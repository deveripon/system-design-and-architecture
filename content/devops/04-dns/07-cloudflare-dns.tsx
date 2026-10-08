/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import { ProxyToggleLab } from "../../../components/course/topics/dns/cloudflare-animations";
import {
  NameserverSwitchDiagram,
  ProxyModesSplit,
  SslModesDiagram,
} from "../../../components/course/topics/dns/cloudflare-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const cloudflareDnsContent: TopicData = {
  id: "cloudflare-dns",
  introduction: {
    badge: "MODULE 04 · LESSON 07",
    title: <SectionTitle>সব টুকরো এক জায়গায়, হাতে কলমে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই মডিউলে এতদিন যা শিখেছেন, Registrar, Name Server, Authoritative,
          Resolver, TTL আর Record, সবই ছিল ধারণা আর Terminal এর পরীক্ষা। এবার সেই
          সব ধারণা একটা সত্যিকারের সেবায় বসিয়ে দেখার পালা। সেবাটা Cloudflare।
        </ContentParagraph>
        <ContentParagraph>
          Cloudflare বেছে নেওয়ার কারণ তিনটা। এর DNS বিনা খরচে পাওয়া যায়, পাতাটা
          নতুনদের জন্য পরিষ্কার, আর পৃথিবীর বিশাল সংখ্যক Website এটা ব্যবহার করে,
          তাই চাকরিতে গিয়ে আপনি প্রায় নিশ্চিতভাবেই এটার সামনে পড়বেন। তবে এখানে
          যা শিখবেন তার ধারণাগুলো যেকোনো DNS সেবায় একই।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে দুইটা বড় কাজ। এক, একটা Domain কে শুরু থেকে শেষ পর্যন্ত
          Cloudflare এ আনা, কোনো ধাপ বাদ না দিয়ে আর সাইট এক মিনিটও বন্ধ না রেখে।
          দুই, Cloudflare এর সেই ছোট্ট কমলা মেঘটা বোঝা, Proxied আর DNS Only, যেটা
          না বুঝে চাপ দেওয়াই এই সেবার সবচেয়ে চেনা দুর্ঘটনার কারণ।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "কমলা মেঘ মানে Cloudflare আপনার দরজার সামনে দারোয়ান হয়ে দাঁড়াল। ধূসর মেঘ মানে সে শুধু পথ দেখিয়ে সরে গেল। দারোয়ান সব অতিথি সামলাতে পারে না, সে শুধু Website এর অতিথি চেনে।",
      author: "DNS",
      role: "Lesson 07",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "what",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Cloudflare আসলে কী করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Cloudflare নিয়ে নতুনদের সবচেয়ে বড় বিভ্রান্তি, এটা কি Hosting?
                উত্তর, না। আপনার Website এর ফাইল বা কোড Cloudflare এ থাকে না, সেটা
                থাকে আপনার সার্ভারে বা Hosting এ, আগের মতোই। Cloudflare দুইটা
                আলাদা ভূমিকা পালন করে, আর দুইটাকে আলাদা করে চেনাই এই লেসনের মূল
                কথা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ভূমিকা ১, DNS সেবা:</strong> সে আপনার Domain এর
                  Authoritative server হয়। আপনার সব Record তার কাছে থাকে, আর
                  পৃথিবীর Resolver রা তাকেই জিজ্ঞেস করে। এই কাজটা সে সবসময় করে।
                </ListItem>
                <ListItem>
                  <strong>ভূমিকা ২, Proxy:</strong> সে পর্যটক আর আপনার সার্ভারের
                  মাঝখানে দাঁড়ায়। প্রতিটা Request আগে তার কাছে আসে, তারপর সে সেটা
                  আপনার সার্ভারে পাঠায়। এই কাজটা ঐচ্ছিক, আর প্রতিটা Record এর জন্য
                  আলাদা করে চালু বা বন্ধ করা যায়। এই সুইচটাই সেই কমলা মেঘ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শুধু প্রথম ভূমিকাটা নিলে Cloudflare একটা সাধারণ, দ্রুত DNS সেবা।
                দ্বিতীয়টা চালু করলে সে হয়ে যায় একটা ঢাল আর গতি বাড়ানোর যন্ত্র।
                একটা Record বসানোর সময় আপনাকে প্রতিবার ঠিক করতে হবে, এই নামের জন্য
                কোন ভূমিকা চান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Domain কিনতে হয় না Cloudflare থেকে",
          content: (
            <p>
              Cloudflare এর DNS ব্যবহার করতে Domain টা সেখানে কিনতে বা সরিয়ে আনতে
              হয় না। Domain যে Registrar এ আছে সেখানেই থাকে, নবায়নের টাকাও
              সেখানেই দেন। আপনি শুধু Registrar কে বলেন, এই Domain এর Name Server
              এখন Cloudflare। দ্বিতীয় লেসনের সেই কথাটা মনে করুন, Registrar আর DNS
              সেবা দুইটা আলাদা কাজ, আর দুইটা আলাদা কোম্পানির কাছে থাকতে পারে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "before",
      subHeader: { index: "002", title: "Before You Start" },
      title: <SectionTitle>শুরুর আগে তিনটা প্রস্তুতি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Name Server বদলানো মানে আপনার Domain এর পুরো DNS এক হাত থেকে আরেক
                হাতে যাওয়া। ভুল হলে Website আর ইমেইল দুইটাই একসাথে বন্ধ হতে পারে।
                তাই বোতামে চাপ দেওয়ার আগে তিনটা কাজ সেরে নিন। দশ মিনিটের এই
                প্রস্তুতি ঘণ্টার পর ঘণ্টা বিপদ থেকে বাঁচায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>বর্তমান Record গুলোর একটা নকল রাখুন:</strong> পুরনো DNS
                  সেবার পাতায় গিয়ে প্রতিটা Record এর ছবি তুলে রাখুন বা একটা ফাইলে
                  লিখে রাখুন। বিশেষ করে MX আর TXT, কারণ এগুলো চোখে পড়ে না অথচ
                  ইমেইল এগুলোর উপর নির্ভর করে। নিচের কমান্ডগুলোও চালিয়ে উত্তর জমিয়ে
                  রাখুন।
                </ListItem>
                <ListItem>
                  <strong>DNSSEC চালু আছে কি না দেখুন:</strong> পুরনো জায়গায়
                  DNSSEC চালু থাকলে Name Server বদলানোর আগে সেটা Registrar এ বন্ধ
                  করতেই হবে। নাহলে বদলের পর Resolver রা পুরনো সই খুঁজবে, পাবে না,
                  আর আপনার পুরো Domain SERVFAIL দেবে। Cloudflare এর নিজের
                  নির্দেশিকায় এটা একটা আলাদা ধাপ।
                </ListItem>
                <ListItem>
                  <strong>Registrar এ ঢুকতে পারেন তো:</strong> বদলটা হবে Registrar
                  এ। সেখানকার Login জানা না থাকলে এখনই খুঁজে বের করুন। কোন Registrar
                  তা না জানলে whois চালিয়ে দেখুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "before-switch.sh",
          code: `# বর্তমান অবস্থার একটা নকল, একটা ফাইলে জমিয়ে রাখুন
D=islandtours.example
for T in NS A AAAA MX TXT CAA; do
  echo "== $T =="; dig +noall +answer $T $D
done > dns-backup.txt
dig +noall +answer A     www.$D   >> dns-backup.txt
dig +noall +answer TXT   _dmarc.$D >> dns-backup.txt
cat dns-backup.txt

# DNSSEC চালু আছে? কিছু ফেরত এলে চালু, আগে Registrar এ বন্ধ করুন
dig +short DS $D

# Registrar কে, জানা না থাকলে
whois $D | grep -i registrar`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "dig সব উপনাম দেখাতে পারে না",
          content: (
            <p>
              উপরের কমান্ড শুধু সেই নামগুলো দেখায় যেগুলো আপনি নাম ধরে জিজ্ঞেস
              করেছেন। আপনার Domain এ shop, admin বা অন্য কোনো উপনাম থাকলে, বাইরে
              থেকে সেগুলোর পুরো তালিকা বের করার কোনো উপায় নেই। তাই পুরনো DNS
              সেবার পাতাটাই আসল উৎস। সেখান থেকে প্রতিটা সারি মিলিয়ে নিন। অনেক সেবায়
              Export Zone File নামে একটা বোতাম থাকে, থাকলে সেটা নামিয়ে রাখুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "onboard",
      subHeader: { index: "003", title: "Moving a Domain" },
      title: <SectionTitle>হাতে কলমে, Domain কে Cloudflare এ আনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো কাজটার ভেতরে আসল বদল একটাই, নিচের ছবিতে দেখুন। বাকি সব ধাপ হলো
              সেই এক বদলের আগে আর পরে নিশ্চিত হওয়া যে কিছু ভাঙেনি।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NameserverSwitchDiagram /> },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Account খুলুন, Domain যোগ করুন",
              description:
                "dash.cloudflare.com এ একটা Account খুলে ঢুকুন। Onboard a domain (বা Add a domain) চাপুন। শুধু মূল নামটা লিখুন, যেমন islandtours.example, সামনে www বা https ছাড়া। Record গুলো কীভাবে আনবেন জিজ্ঞেস করলে Quick scan বেছে নিন, তারপর Continue।",
            },
            {
              title: "Plan বাছুন",
              description:
                "Plan এর তালিকার একদম নিচে Free আছে, সেটাই বেছে নিন। DNS, Proxy আর HTTPS, এই লেসনের সবকিছু Free তেই পাওয়া যায়। Card এর তথ্য দিতে হয় না।",
            },
            {
              title: "খুঁজে পাওয়া Record গুলো মিলিয়ে দেখুন",
              description:
                "Cloudflare নিজে আপনার বর্তমান DNS ঘেঁটে যা পায় একটা তালিকায় দেখাবে। এটাই সবচেয়ে জরুরি ধাপ। প্রস্তুতির সময় রাখা নকলের সাথে সারি ধরে মিলিয়ে নিন। সে সব খুঁজে পায় না, বিশেষ করে অচেনা নামের উপনাম আর DKIM এর TXT। যা বাদ পড়েছে তা Add record দিয়ে হাতে বসান।",
            },
            {
              title: "প্রতিটা Record এর মেঘ ঠিক করুন",
              description:
                "A, AAAA আর CNAME এর পাশে একটা Proxy status সুইচ থাকে। আপাতত একটা নিরাপদ নিয়ম মানুন: ইমেইলের সাথে জড়িত আর Website নয় এমন সব কিছু DNS only। প্রথম দিন সব কিছুই DNS only রাখলেও ক্ষতি নেই, বদলটা ঠিকঠাক হয়ে গেলে পরে একটা একটা করে Proxied করবেন। এতে একসাথে দুইটা জিনিস বদলায় না।",
            },
            {
              title: "Cloudflare এর দেওয়া দুইটা Name Server টুকে নিন",
              description:
                "Continue চাপলে Cloudflare দুইটা নাম দেখাবে, দেখতে কিছু একটা.ns.cloudflare.com এর মতো। এই দুইটা নাম শুধু আপনার জন্য, অন্যের সাথে মিলবে না। বোতামে চেপে হুবহু কপি করুন, হাতে টাইপ করবেন না।",
            },
            {
              title: "Registrar এ DNSSEC বন্ধ করুন (চালু থাকলে)",
              description:
                "Registrar এর পাতায় Domain টা খুলে DNSSEC এর অংশে যান। চালু থাকলে বন্ধ করুন বা DS Record মুছে দিন। তারপর DS Record এর TTL যতক্ষণ (সাধারণত ২৪ ঘণ্টা) ততক্ষণ অপেক্ষা করে পরের ধাপে যান। আগে থেকেই বন্ধ থাকলে এই ধাপ বাদ।",
            },
            {
              title: "Registrar এ Name Server বদলান",
              description:
                "Registrar এ Nameservers বা DNS নামের অংশে যান। Custom nameservers বেছে নিন। পুরনো সব নাম মুছে দিন, তারপর Cloudflare এর দুইটা নাম বসিয়ে Save করুন। পুরনো একটাও রেখে দেবেন না, রাখলে কিছু প্রশ্ন পুরনো জায়গায় যেতে থাকবে।",
            },
            {
              title: "অপেক্ষা করুন, তারপর যাচাই করুন",
              description:
                "Cloudflare এ ফিরে Check nameservers চাপুন। Domain এর অবস্থা থাকবে Pending। Registrar বদলটা TLD তে পৌঁছে দিলে অবস্থা হবে Active, আর আপনি একটা ইমেইল পাবেন। সাধারণত কয়েক মিনিট থেকে কয়েক ঘণ্টা, সর্বোচ্চ ২৪ ঘণ্টা। এই সময়ে সাইট বন্ধ হয় না, কারণ দুই জায়গাতেই একই Record আছে।",
            },
            {
              title: "DNSSEC আবার চালু করুন (ঐচ্ছিক, কিন্তু ভালো)",
              description:
                "Active হওয়ার পর Cloudflare এ DNS, Settings এ গিয়ে DNSSEC চালু করুন। সে একটা DS Record দেবে, সেটা Registrar এর DNSSEC অংশে বসান। এবার সই Cloudflare এর, আর আপনার Domain আবার জাল উত্তর থেকে সুরক্ষিত।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "পুরনো DNS সেবাটা সাথে সাথে বন্ধ করবেন না",
          content: (
            <p>
              বদলের পরেও কয়েক দিন পুরনো DNS সেবায় Record গুলো যেমন ছিল তেমন রেখে
              দিন। কারণটা আগের লেসনগুলো থেকে জানেন, পৃথিবীর অনেক Resolver এর খাতায়
              পুরনো Name Server এর ঠিকানা এখনো আছে, আর সেই মেয়াদ দুই দিন পর্যন্ত
              হতে পারে। তারা ততদিন পুরনো জায়গাতেই জিজ্ঞেস করবে। সেখানে ঠিক উত্তর
              থাকলে কেউ টেরই পাবে না যে বদল হয়েছে। এটাই বিনা বিরতিতে DNS সরানোর
              পুরো রহস্য, দুই জায়গায় একই উত্তর রাখা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "verify",
      subHeader: { index: "004", title: "Verify" },
      title: <SectionTitle>বদলটা সত্যিই হয়েছে তো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Cloudflare এর পাতায় Active লেখা দেখা ভালো, কিন্তু নিজে যাচাই করা আরও
              ভালো। এই চারটা পরীক্ষা ক্রমে চালান। প্রতিটা আগের লেসনের একটা ধারণার
              সরাসরি প্রয়োগ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "verify-cloudflare.sh",
          code: `D=islandtours.example

# ১. TLD এখন কাকে দেখাচ্ছে? (উৎসকে সরাসরি জিজ্ঞেস, Cache এড়িয়ে)
dig +trace NS $D | tail -8
#    শেষের দিকে xxx.ns.cloudflare.com দেখা গেলে Registrar এর কাজ শেষ

# ২. আপনার Resolver কী জানে?
dig +short NS $D
#    এখনো পুরনো নাম দেখালে সেটা শুধু Cache, অপেক্ষা করলে ঠিক হবে

# ৩. Cloudflare কি ঠিক উত্তর দিচ্ছে? (Name Server কে সরাসরি)
dig +short A   $D      @ada.ns.cloudflare.com     # নিজের Name Server এর নাম বসান
dig +short MX  $D      @ada.ns.cloudflare.com
dig +short TXT $D      @ada.ns.cloudflare.com
#    এই তিনটা উত্তর dns-backup.txt এর সাথে মিলিয়ে দেখুন

# ৪. পুরনো আর নতুন, দুই জায়গার উত্তর পাশাপাশি
dig +short MX $D @পুরনো-name-server
dig +short MX $D @ada.ns.cloudflare.com
#    দুইটা হুবহু এক হওয়া চাই`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ইমেইলটা আলাদা করে পরীক্ষা করুন",
          content: (
            <p>
              Website ভাঙলে আপনি সাথে সাথে দেখতে পান। ইমেইল ভাঙলে কেউ জানায় না,
              ইমেইলগুলো শুধু চুপচাপ আসা বন্ধ করে দেয়, আর আপনি হয়তো তিন দিন পরে
              টের পান। তাই বদলের পর অন্য একটা ঠিকানা থেকে নিজের Domain এর ঠিকানায়
              একটা ইমেইল পাঠিয়ে দেখুন পৌঁছায় কি না, আর উল্টোটাও। MX আর TXT ঠিক
              আছে, এর চেয়ে নিশ্চিত প্রমাণ আর নেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "proxy",
      subHeader: { index: "005", title: "Proxied vs DNS Only" },
      title: <SectionTitle>কমলা মেঘ, ধূসর মেঘ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সেই সুইচ। Cloudflare এর Record তালিকায় প্রতিটা A, AAAA আর
                CNAME এর পাশে একটা মেঘের চিহ্ন থাকে, যাতে চাপ দিলে রঙ বদলায়। এই এক
                চাপে বদলে যায় DNS এর উত্তরটাই।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProxyModesSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                খেয়াল করুন, কৌশলটা পুরোপুরি DNS এর। Proxied করলে Cloudflare
                আপনার Record এর Value তে লেখা IP টা বাইরের কাউকে আর বলে না। তার
                বদলে সে নিজের একটা IP বলে। Browser সেই IP তে যায়, মানে Cloudflare
                এর কাছে। Cloudflare তখন ভেতরে ভেতরে আপনার আসল IP তে গিয়ে পাতাটা
                আনে। পর্যটকের চোখে কিছুই আলাদা নয়, তিনি শুধু সাইটটা পান।
              </ContentParagraph>
              <ContentParagraph>
                মাঝখানে দাঁড়ানোর এই জায়গা থেকে Proxied Record চারটা সুবিধা পায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আসল IP লুকানো থাকে:</strong> আক্রমণকারী আপনার সার্ভারের
                  ঠিকানাই জানে না, সে দেখে শুধু Cloudflare কে।
                </ListItem>
                <ListItem>
                  <strong>আক্রমণ ঠেকে যায়:</strong> কেউ লক্ষ লক্ষ ভুয়া Request
                  পাঠিয়ে সাইট ডুবিয়ে দিতে চাইলে (যাকে বলে DDoS), সেই ঢেউ Cloudflare
                  এর বিশাল Network এ এসে ভাঙে, আপনার ছোট সার্ভার পর্যন্ত পৌঁছায় না।
                </ListItem>
                <ListItem>
                  <strong>সাইট দ্রুত হয়:</strong> ছবি, CSS আর JavaScript এর মতো
                  ফাইল Cloudflare নিজের কাছে জমিয়ে রাখে, আর পর্যটকের সবচেয়ে কাছের
                  শহর থেকে দিয়ে দেয়। এই কাজের নাম CDN, যেটা পরে আলাদা মডিউলে আসবে।
                </ListItem>
                <ListItem>
                  <strong>বিনা খরচে HTTPS:</strong> Cloudflare নিজে আপনার Domain
                  এর জন্য একটা সার্টিফিকেট বানিয়ে পর্যটকের সাথে পথটা তালাবদ্ধ করে
                  দেয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Proxy শুধু Website এর ভাষা বোঝে",
          content: (
            <p>
              Cloudflare এর Proxy শুধু HTTP আর HTTPS বোঝে, মানে যা Browser এ
              খোলে। ইমেইল (SMTP), SSH, FTP, Database এর সংযোগ, Game server, এগুলো
              অন্য ভাষায় কথা বলে। এমন কোনো Record কমলা করলে সেই সংযোগ Cloudflare
              এর কাছে গিয়ে থেমে যায়, কারণ সে ভাষাটা বোঝে না আর এগিয়েও দেয় না।
              তাই নিয়মটা এক লাইনের: যা Browser এ খোলে তা কমলা হতে পারে, বাকি সব
              ধূসর।
            </p>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProxyToggleLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "proxy-rules",
      subHeader: { index: "006", title: "Which Colour" },
      title: <SectionTitle>কোন Record এ কোন রঙ, পুরো তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়মটা একবার পরিষ্কার করে লিখে রাখি, যাতে প্রতিবার Record বসানোর
                সময় মিলিয়ে নিতে পারেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>মূল সাইট আর www:</strong> Proxied। তবে একটা ব্যতিক্রম
                  নিচের সতর্কবার্তায় দেখুন।
                </ListItem>
                <ListItem>
                  <strong>HTTPS এ চলা API:</strong> Proxied করা যায়, বেশিরভাগ
                  ক্ষেত্রে ভালো।
                </ListItem>
                <ListItem>
                  <strong>MX যে নামের দিকে দেখায় (যেমন mail):</strong> সবসময় DNS
                  only। Cloudflare নিজেই এখানে একটা সতর্কবার্তা দেখায়।
                </ListItem>
                <ListItem>
                  <strong>MX, TXT, NS, SRV, CAA:</strong> এগুলোর পাশে মেঘই থাকে না।
                  Proxy শুধু A, AAAA আর CNAME এর জন্য, কারণ শুধু এগুলোই একটা IP তে
                  গিয়ে শেষ হয়।
                </ListItem>
                <ListItem>
                  <strong>SSH, FTP, Database, Game server:</strong> DNS only।
                </ListItem>
                <ListItem>
                  <strong>অন্য সেবার যাচাইয়ের CNAME:</strong> DNS only। কোনো সেবা
                  যদি বলে এই CNAME বসিয়ে প্রমাণ করুন Domain আপনার, সে DNS এ ঠিক ঐ
                  CNAME টাই খোঁজে। Proxied করলে Cloudflare CNAME এর বদলে নিজের IP
                  দেয়, আর যাচাই ব্যর্থ হয়।
                </ListItem>
                <ListItem>
                  <strong>DKIM এর CNAME:</strong> DNS only, একই কারণে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Hosting এর নিজের CDN থাকলে আগে তাদের কথা শুনুন",
          content: (
            <p>
              Vercel, Netlify বা এমন আধুনিক Hosting গুলো নিজেরাই একটা CDN আর
              নিজেরাই HTTPS সার্টিফিকেট দেয়। তাদের সামনে আবার Cloudflare এর Proxy
              বসালে দুইটা ঢাল একটার উপর আরেকটা পড়ে, আর সার্টিফিকেট নবায়ন বা
              Cache নিয়ে অদ্ভুত সমস্যা হতে পারে। এমন Hosting এর দিকে দেখানো Record
              সাধারণত DNS only রাখতে বলা হয়। Record বসানোর আগে Hosting এর নিজের
              নির্দেশিকায় Cloudflare এর অংশটা পড়ে নিন, আর তারা যা বলে তাই করুন।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Proxied Record এর TTL আপনার হাতে নেই",
          content: (
            <p>
              একটা Record কমলা করলে TTL এর ঘরটা Auto হয়ে আটকে যায়, আর বাইরে সেটা
              ৩০০ সেকেন্ড দেখায়। এটা ভুল নয়, আর এতে আপনার সুবিধাই। কারণ বাইরের
              দুনিয়া যে IP দেখে সেটা Cloudflare এর, যা বদলায় না। আপনি নিজের
              সার্ভারের IP বদলালে Cloudflare ভেতরে সাথে সাথে নতুন জায়গায় যেতে
              শুরু করে, কারো Cache মরার অপেক্ষা করতে হয় না। মানে Proxied Record এ
              সার্ভার বদল প্রায় তাৎক্ষণিক।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "ssl",
      subHeader: { index: "007", title: "SSL/TLS Mode" },
      title: <SectionTitle>কমলা করার সাথে সাথে যে সেটিংটা দেখতেই হবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HTTPS এর পুরো গল্প সামনের মডিউলে। কিন্তু একটা সেটিং এখনই জানতে হবে,
                কারণ প্রথমবার কমলা মেঘ চালু করে মানুষ যে দুইটা সমস্যায় সবচেয়ে বেশি
                পড়ে, দুইটাই এখান থেকে আসে। সেটিংটা আছে Cloudflare এর SSL/TLS অংশে,
                Overview এর ভেতরে।
              </ContentParagraph>
              <ContentParagraph>
                Proxied হলে পথটা দুই টুকরো, পর্যটক থেকে Cloudflare, আর Cloudflare
                থেকে আপনার সার্ভার। প্রথম টুকরো Cloudflare নিজেই সামলায়। এই
                সেটিং ঠিক করে দ্বিতীয় টুকরোটা কেমন হবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SslModesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>সাইট ঘুরতেই থাকে, খোলে না (ERR_TOO_MANY_REDIRECTS):</strong>{" "}
                Mode যদি Flexible হয়, Cloudflare আপনার সার্ভারে যায় HTTP দিয়ে।
                আপনার সার্ভার যদি বলে, HTTP চলবে না, HTTPS এ আসুন, তাহলে Cloudflare
                আবার HTTP দিয়েই আসে, সার্ভার আবার ফেরত পাঠায়, আর এই চক্র চলতেই
                থাকে। সমাধান, Mode কে Full বা Full (strict) করা।
              </ListItem>
              <ListItem>
                <strong>Error 526 বা 525:</strong> Mode Full (strict), কিন্তু আপনার
                সার্ভারে বৈধ সার্টিফিকেট নেই বা মেয়াদ শেষ। সমাধান, সার্ভারে একটা
                ঠিকঠাক সার্টিফিকেট বসানো। Cloudflare নিজেই এর জন্য বিনা খরচে একটা
                দেয়, নাম Origin Certificate, SSL/TLS এর Origin Server অংশে।
              </ListItem>
              <ListItem>
                <strong>লক্ষ্য কোনটা:</strong> সবসময় Full (strict)। Flexible
                শুধু তখনই, যখন সার্ভারে কোনোভাবেই সার্টিফিকেট বসানো যাচ্ছে না, আর
                সাইটে কোনো Login বা ব্যক্তিগত তথ্য নেই।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "records-in-cf",
      subHeader: { index: "008", title: "Records in Cloudflare" },
      title: <SectionTitle>Cloudflare এ Record বসানোর খুঁটিনাটি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনের ছয় ধাপ এখানেও একই, DNS এ গিয়ে Records, তারপর Add
                record। তবে Cloudflare এর পাতায় কয়েকটা নিজস্ব ব্যাপার আছে, যা জানা
                থাকলে হোঁচট খাবেন না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Name ঘরে @:</strong> মূল নামের জন্য @ লিখুন। Save করার পর
                  তালিকায় সে পুরো Domain টা লিখে দেখায়, দুইটা একই জিনিস।
                </ListItem>
                <ListItem>
                  <strong>Value র নাম এখানে Content বা Target:</strong> A এর জন্য
                  IPv4 address, CNAME এর জন্য Target, MX এর জন্য Mail server আর
                  আলাদা একটা Priority ঘর।
                </ListItem>
                <ListItem>
                  <strong>মূল নামে CNAME বসানো যায়:</strong> আগের লেসনে শিখেছেন
                  নিয়মে এটা নিষেধ। Cloudflare এখানে CNAME Flattening করে, আপনি মূল
                  নামে একটা নাম বসান, সে নিজে IP খুঁজে বাইরে A Record হিসেবে দেয়।
                  তাই যে Hosting মূল নামের জন্য শুধু একটা নাম দেয়, তার সাথে
                  Cloudflare এ কাজ করা সহজ।
                </ListItem>
                <ListItem>
                  <strong>TTL এর Auto:</strong> DNS only Record এ Auto মানে ৩০০
                  সেকেন্ড। চাইলে তালিকা থেকে অন্য মান বাছতে পারেন। Proxied হলে
                  বাছার সুযোগ নেই।
                </ListItem>
                <ListItem>
                  <strong>Import আর Export:</strong> Record তালিকার উপরে Import
                  and Export নামে একটা বোতাম আছে। Export চাপলে পুরো Zone একটা
                  লেখার ফাইল হিসেবে নেমে আসে। বড় কোনো বদলের আগে এটা নামিয়ে রাখুন,
                  এটাই আপনার Backup।
                </ListItem>
                <ListItem>
                  <strong>বদল কত দ্রুত:</strong> Save করার কয়েক সেকেন্ডের মধ্যে
                  Cloudflare এর সব Name Server নতুন উত্তর দিতে শুরু করে। এরপর যা
                  দেরি, তা শুধু Resolver দের Cache এর মেয়াদ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "islandtours-in-cloudflare.txt",
          code: `Type    Name      Content                         Proxy status    TTL
A       @         103.94.135.2                    Proxied         Auto
CNAME   www       islandtours.example             Proxied         Auto
A       api       103.94.135.3                    Proxied         Auto
A       ssh       103.94.135.2                    DNS only        Auto
MX      @         mail1.provider.example  (10)    (মেঘ নেই)       Auto
TXT     @         "v=spf1 include:... ~all"       (মেঘ নেই)       Auto
TXT     _dmarc    "v=DMARC1; p=none; rua=..."     (মেঘ নেই)       Auto
CNAME   s1._domainkey   s1.dkim.provider.example  DNS only        Auto`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "একটা ধূসর Record পুরো লুকোচুরি ভেঙে দিতে পারে",
          content: (
            <p>
              উপরের তালিকাটা আবার দেখুন। মূল সাইট কমলা, তাই তার আসল IP লুকানো।
              কিন্তু ssh নামের Record টা ধূসর, আর সেখানে একই IP খোলা লেখা। যে কেউ
              ssh.islandtours.example কে dig করলেই আসল IP পেয়ে যাবে, আর তখন
              Cloudflare কে পাশ কাটিয়ে সরাসরি সার্ভারে আক্রমণ করতে পারবে। তাই আসল
              IP সত্যিই লুকাতে চাইলে দুইটা কাজ করুন। এক, ধূসর Record এ এমন নাম
              দেবেন না যা সহজে আন্দাজ করা যায়, বা SSH এর জন্য আলাদা পথ রাখুন। দুই,
              সার্ভারের Firewall এ Port 80 আর 443 শুধু Cloudflare এর IP গুলোর জন্য
              খুলুন, তালিকাটা cloudflare.com/ips এ আছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "see-proxy",
      subHeader: { index: "009", title: "Seeing the Proxy" },
      title: <SectionTitle>হাতে কলমে, Proxy টা নিজের চোখে দেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা সাইট Cloudflare এর পেছনে আছে কি না, আর থাকলে সে কী করছে, বাইরে
              থেকে চার ভাবে ধরা যায়। নিজের Domain না থাকলেও চলবে, যেকোনো চেনা সাইটে
              চালিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "see-the-proxy.sh",
          code: `# ১. Name Server কি Cloudflare এর?
dig +short NS cloudflare.com
#    xxx.ns.cloudflare.com দেখালে DNS Cloudflare এ

# ২. IP টা কার? Proxied হলে IP হবে Cloudflare এর, সার্ভারের নয়
dig +short A www.cloudflare.com
whois $(dig +short A www.cloudflare.com | head -1) | grep -i -E "orgname|netname"
#    OrgName: Cloudflare, Inc. মানে Proxied

# ৩. উত্তরের Header এ Cloudflare এর ছাপ
curl -sI https://www.cloudflare.com | grep -i -E "^server|^cf-ray|^cf-cache-status"
#    server: cloudflare        Proxy দিয়ে এসেছে
#    cf-ray: 8c1f...-DAC       শেষের তিন অক্ষর শহর, DAC মানে ঢাকা
#    cf-cache-status: HIT      ফাইলটা Cloudflare এর Cache থেকে এসেছে,
#                              MISS মানে সার্ভার থেকে আনতে হয়েছে

# ৪. Cloudflare এর চোখে আপনি কে, কোথা থেকে
curl -s https://www.cloudflare.com/cdn-cgi/trace
#    ip=আপনার IP, colo=কোন শহরের সার্ভার, loc=দেশ, tls=TLS এর সংস্করণ`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "সার্ভারে এখন সব Request আসছে Cloudflare এর IP থেকে",
          content: (
            <p>
              Proxied করার পর আপনার সার্ভারের Log খুললে দেখবেন প্রতিটা Request
              এর IP হলো Cloudflare এর, পর্যটকের নয়। কারণ সার্ভারের সাথে সংযোগটা
              আসলে Cloudflare ই করছে। পর্যটকের আসল IP হারায় না, Cloudflare সেটা
              একটা বাড়তি Header এ লিখে পাঠায়, নাম CF-Connecting-IP। আপনার Backend
              এ কারো IP দেখে কিছু করার নিয়ম থাকলে (যেমন এক IP থেকে ঘন ঘন বুকিং
              আটকানো), সেটা এই Header থেকে পড়তে হবে। নাহলে সবাইকে একই মানুষ মনে
              হবে, আর একজনকে আটকাতে গিয়ে সবাইকে আটকে ফেলবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "mistakes",
      subHeader: { index: "010", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো সবচেয়ে বেশি হয়, আর সমাধান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>বদলের পর ইমেইল বন্ধ:</strong> Quick scan MX বা TXT খুঁজে
                পায়নি, আর আপনি মিলিয়ে দেখেননি। সমাধান, নকল দেখে MX, SPF, DKIM আর
                DMARC হাতে বসান।
              </ListItem>
              <ListItem>
                <strong>mail Record কমলা:</strong> ইমেইল আসা বন্ধ। সমাধান, MX যে
                নামের দিকে দেখায় সেটা DNS only করুন।
              </ListItem>
              <ListItem>
                <strong>অবস্থা Pending এ আটকে আছে:</strong> Registrar এ Name
                Server এর নামে বানান ভুল, বা পুরনো একটা নাম রয়ে গেছে, বা DNSSEC
                বন্ধ করা হয়নি। সমাধান, dig +trace NS দিয়ে দেখুন TLD আসলে কী
                দেখাচ্ছে, তারপর Registrar এ মিলিয়ে নিন।
              </ListItem>
              <ListItem>
                <strong>বদলের পর পুরো Domain SERVFAIL:</strong> পুরনো DNSSEC এর
                DS Record Registrar এ রয়ে গেছে। সমাধান, dig +short DS চালান, কিছু
                এলে Registrar এ সেটা মুছুন।
              </ListItem>
              <ListItem>
                <strong>সাইট ঘুরতেই থাকে:</strong> SSL/TLS Mode Flexible আর
                সার্ভার HTTPS এ পাঠাতে চায়। সমাধান, Mode কে Full বা Full (strict)
                করুন।
              </ListItem>
              <ListItem>
                <strong>Error 521 বা 522:</strong> Cloudflare আপনার সার্ভারে
                পৌঁছাতে পারছে না। সার্ভার বন্ধ, বা Record এ ভুল IP, বা সার্ভারের
                Firewall Cloudflare এর IP আটকে দিচ্ছে। সমাধান, Record টা সাময়িক
                DNS only করে দেখুন সরাসরি সাইট খোলে কি না। খুললে সমস্যা Firewall
                এ, না খুললে সার্ভারে।
              </ListItem>
              <ListItem>
                <strong>সাইট বদলালাম, পুরনোটাই দেখাচ্ছে:</strong> এটা DNS নয়,
                Cloudflare এর Cache। সমাধান, Caching, Configuration এ গিয়ে Purge
                Everything চাপুন। কাজ চলাকালীন Development Mode চালু রাখলে তিন
                ঘণ্টার জন্য Cache পাশ কাটানো যায়।
              </ListItem>
              <ListItem>
                <strong>যাচাইয়ের CNAME কাজ করছে না:</strong> সেটা Proxied হয়ে
                আছে। সমাধান, DNS only করুন।
              </ListItem>
              <ListItem>
                <strong>ভুল জায়গায় Record বসানো:</strong> Name Server এখন
                Cloudflare, অথচ নতুন Record বসালেন পুরনো সেবার পাতায়। সেটা আর কেউ
                পড়ে না। সমাধান, এখন থেকে সব বদল শুধু Cloudflare এ।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সন্দেহ হলে ধূসর করে দেখুন",
          content: (
            <p>
              Cloudflare এর পেছনের কোনো সাইটে অদ্ভুত সমস্যা হলে সবচেয়ে দ্রুত
              পরীক্ষা হলো Record টা কয়েক মিনিটের জন্য DNS only করা। এতে Cloudflare
              মাঝখান থেকে সরে যায়। সমস্যা চলে গেলে কারণ Cloudflare এর কোনো সেটিং
              (SSL Mode, Cache, Firewall এর নিয়ম)। সমস্যা থেকে গেলে কারণ আপনার
              সার্ভার। এক চাপে অর্ধেক সম্ভাবনা বাদ। পরীক্ষা শেষে আবার কমলা করতে
              ভুলবেন না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "project",
      subHeader: { index: "011", title: "Project Example" },
      title: <SectionTitle>Island Tours কে Cloudflare এর পেছনে নেওয়া</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর জন্য সিদ্ধান্তগুলো এক জায়গায় সাজাই। প্রতিটার পেছনে
                একটা ব্যবসায়িক কারণ আছে, শুধু কারিগরি নয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>মূল সাইট আর www, Proxied:</strong> ছুটির মৌসুমে হঠাৎ
                  ভিড় বাড়ে। দ্বীপের ছবিগুলো ভারী। Cloudflare ছবিগুলো নিজের কাছে
                  জমিয়ে পর্যটকের কাছের শহর থেকে দিলে সার্ভারের চাপ কমে, আর লন্ডনের
                  পর্যটকও সাইট দ্রুত পান।
                </ListItem>
                <ListItem>
                  <strong>api, Proxied:</strong> বুকিং এর API তে আক্রমণ এলে তা
                  সার্ভার পর্যন্ত পৌঁছানোর আগেই আটকায়। তবে Backend এ পর্যটকের IP
                  পড়তে হবে CF-Connecting-IP থেকে।
                </ListItem>
                <ListItem>
                  <strong>ইমেইলের সব Record, DNS only:</strong> বুকিং নিশ্চিতকরণের
                  ইমেইল বন্ধ হওয়া মানে সরাসরি ব্যবসার ক্ষতি। এখানে কোনো পরীক্ষা
                  নয়।
                </ListItem>
                <ListItem>
                  <strong>SSL/TLS Mode, Full (strict):</strong> বুকিং এ নাম, ফোন
                  নম্বর আর Payment এর তথ্য যায়। পথের কোনো টুকরো খোলা রাখা চলবে না।
                </ListItem>
                <ListItem>
                  <strong>সার্ভারের Firewall:</strong> Port 80 আর 443 শুধু
                  Cloudflare এর IP র জন্য খোলা, যাতে কেউ আসল IP জেনে গেলেও পাশ
                  কাটিয়ে ঢুকতে না পারে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "request-flow",
      subHeader: { index: "012", title: "Step-by-step Flow" },
      title: <SectionTitle>Proxied সাইটে একটা Request এর পথ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একজন পর্যটক islandtours.example লিখে Enter চাপলেন। সাইট এখন Cloudflare
              এর পেছনে, Record কমলা। এবার পথটা কেমন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Resolver খোঁজ শুরু করে",
              description:
                "পর্যটকের Resolver চেনা হাঁটা হাঁটে। TLD server তাকে বলে, এই Domain এর Name Server হলো Cloudflare এর দুইটা নাম।",
            },
            {
              title: "Cloudflare DNS এর উত্তর দেয়",
              description:
                "Resolver Cloudflare এর Name Server কে A Record জিজ্ঞেস করে। Record টা Proxied, তাই Cloudflare আপনার সার্ভারের 103.94.135.2 না বলে নিজের একটা IP বলে, যেমন 104.21.48.1, TTL ৩০০।",
            },
            {
              title: "Browser যায় Cloudflare এর কাছে",
              description:
                "Browser সেই IP তে HTTPS সংযোগ করে। Anycast এর জোরে সংযোগটা পৌঁছায় পর্যটকের সবচেয়ে কাছের Cloudflare কেন্দ্রে। Cloudflare নিজের বানানো সার্টিফিকেট দেখায়, পথের প্রথম টুকরো তালাবদ্ধ হয়।",
            },
            {
              title: "Cloudflare পরীক্ষা করে আর Cache দেখে",
              description:
                "সে দেখে Request টা সন্দেহজনক কি না। তারপর দেখে চাওয়া ফাইলটা (যেমন দ্বীপের একটা ছবি) নিজের Cache এ আছে কি না। থাকলে এখান থেকেই দিয়ে দেয়, আপনার সার্ভার জানতেও পারে না।",
            },
            {
              title: "না থাকলে আপনার সার্ভারে যায়",
              description:
                "Cache এ না থাকলে, বা বুকিং এর মতো Request হলে, Cloudflare আপনার আসল IP তে সংযোগ করে। Mode Full (strict), তাই এই টুকরোও HTTPS আর সার্টিফিকেট যাচাই করা। সাথে CF-Connecting-IP Header এ পর্যটকের আসল IP পাঠায়।",
            },
            {
              title: "উত্তর ফিরে আসে একই পথে",
              description:
                "আপনার সার্ভার উত্তর দেয় Cloudflare কে, Cloudflare সেটা পর্যটককে দেয়, আর জমানোর মতো হলে নিজের Cache এ রেখে দেয়। পর্যটক শুধু দেখেন সাইটটা খুলল, দ্রুত।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "resources",
      subHeader: { index: "013", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিজে করে দেখুন</strong>, একটা সস্তা Domain কিনে, বা বন্ধুর
                একটা অব্যবহৃত Domain নিয়ে, পুরো নয় ধাপ নিজে করুন। এই লেসন পড়ে
                যতটা শিখবেন, একবার নিজে করলে তার দশ গুণ।
              </ListItem>
              <ListItem>
                <strong>Cloudflare Docs, Full setup</strong>, Name Server বদলের
                সরকারি নির্দেশিকা, ধাপে ধাপে।{" "}
                <a
                  href="https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developers.cloudflare.com/dns/zone-setups/full-setup
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare Docs, Proxy status</strong>, কোন Record কখন
                Proxied আর কখন DNS only, পুরো তালিকা।{" "}
                <a
                  href="https://developers.cloudflare.com/dns/proxy-status/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developers.cloudflare.com/dns/proxy-status
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare Docs, SSL/TLS encryption modes</strong>,
                Flexible, Full আর Full (strict) এর বিস্তারিত।{" "}
                <a
                  href="https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developers.cloudflare.com/ssl/origin-configuration/ssl-modes
                </a>
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "recap",
      subHeader: { index: "014", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                Cloudflare Hosting নয়। তার দুই ভূমিকা, <strong>DNS সেবা</strong>{" "}
                (সবসময়) আর <strong>Proxy</strong> (ঐচ্ছিক, Record ধরে ধরে)।
              </ListItem>
              <ListItem>
                Domain আনা মানে Registrar এ দুইটা Name Server এর নাম বদলানো। Domain
                আগের Registrar এই থাকে।
              </ListItem>
              <ListItem>
                বদলের আগে: সব Record এর নকল রাখুন, DNSSEC বন্ধ করুন, Cloudflare এ
                সব Record মিলিয়ে বসান। বদলের পরে: পুরনো সেবা কয়েক দিন চালু রাখুন।
              </ListItem>
              <ListItem>
                <strong>DNS only</strong> (ধূসর) মানে Cloudflare আসল IP বলে দেয়।{" "}
                <strong>Proxied</strong> (কমলা) মানে সে নিজের IP বলে আর মাঝখানে
                দাঁড়ায়, IP লুকায়, আক্রমণ ঠেকায়, Cache করে, HTTPS দেয়।
              </ListItem>
              <ListItem>
                Proxy শুধু HTTP আর HTTPS বোঝে। ইমেইল, SSH, FTP, যাচাইয়ের CNAME, সব
                DNS only। Proxy শুধু A, AAAA আর CNAME এ।
              </ListItem>
              <ListItem>
                কমলা করলে SSL/TLS Mode দেখুন। লক্ষ্য <strong>Full (strict)</strong>
                । Flexible আর HTTPS এ পাঠানো সার্ভার মিলে অন্তহীন চক্র হয়।
              </ListItem>
              <ListItem>
                Proxied হলে সার্ভার দেখে Cloudflare এর IP। পর্যটকের আসল IP থাকে
                CF-Connecting-IP Header এ।
              </ListItem>
              <ListItem>
                একটা ধূসর Record আসল IP ফাঁস করতে পারে। সার্ভারের Firewall এ শুধু
                Cloudflare এর IP কে ঢুকতে দিন।
              </ListItem>
              <ListItem>
                সন্দেহ হলে Record টা সাময়িক ধূসর করে দেখুন, সমস্যা Cloudflare এ না
                সার্ভারে।
              </ListItem>
              <ListItem>
                পরের লেসন: বদল করলাম, তবু সবাই দেখছে না কেন, DNS Propagation।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      [
        <span className="font-bold text-primary">Cloudflare DNS</span>,
        "আপনার Domain এর Authoritative server হয়, Hosting নয়",
      ],
      [
        <span className="font-bold text-primary">Name Server বদল</span>,
        "Registrar এ দুইটা নাম বদলানো, Domain আগের জায়গাতেই থাকে",
      ],
      [
        <span className="font-bold text-primary">Pending / Active</span>,
        "বদল TLD তে পৌঁছানোর আগে আর পরে Domain এর অবস্থা",
      ],
      [
        <span className="font-bold text-primary">DNS only</span>,
        "ধূসর মেঘ, আসল IP বলে দেয়, সরাসরি পথ",
      ],
      [
        <span className="font-bold text-primary">Proxied</span>,
        "কমলা মেঘ, Cloudflare এর IP বলে আর মাঝখানে দাঁড়ায়",
      ],
      [
        <span className="font-bold text-primary">যা কমলা হয় না</span>,
        "ইমেইল, SSH, FTP, যাচাইয়ের CNAME, যা কিছু Website নয়",
      ],
      [
        <span className="font-bold text-primary">Full (strict)</span>,
        "দুই টুকরো পথই HTTPS আর সার্টিফিকেট যাচাই করা",
      ],
      [
        <span className="font-bold text-primary">CNAME Flattening</span>,
        "মূল নামে CNAME এর মতো নাম বসানো, বাইরে A হিসেবে যায়",
      ],
      [
        <span className="font-bold text-primary">CF-Connecting-IP</span>,
        "যে Header এ পর্যটকের আসল IP থাকে",
      ],
      [
        <span className="font-bold text-primary">521 / 522 / 526</span>,
        "সার্ভার বন্ধ, সার্ভার সাড়া দিচ্ছে না, সার্টিফিকেট অবৈধ",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা Domain কে Cloudflare এর DNS এ আনতে আসলে কোথায়, কী বদলাতে হয়?",
        options: [
          {
            key: "A",
            text: "Domain টা Cloudflare এ কিনে আনতে হয়",
            isCorrect: false,
            explanation:
              "না। Domain আগের Registrar এই থাকে। Registrar আর DNS সেবা আলাদা কাজ।",
          },
          {
            key: "B",
            text: "Registrar এ Name Server এর নাম বদলে Cloudflare এর দুইটা নাম বসাতে হয়",
            isCorrect: true,
            explanation:
              "ঠিক। এতে TLD server সবাইকে Cloudflare এর দিকে পাঠাতে শুরু করে, আর Cloudflare হয় Authoritative।",
          },
          {
            key: "C",
            text: "Website এর ফাইল Cloudflare এ তুলতে হয়",
            isCorrect: false,
            explanation: "Cloudflare Hosting নয়, ফাইল আপনার সার্ভারেই থাকে।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা A Record কমলা (Proxied) করলে বাইরে থেকে dig করলে কী দেখা যায়?",
        options: [
          {
            key: "A",
            text: "আপনার সার্ভারের আসল IP",
            isCorrect: false,
            explanation: "এটা DNS only এর আচরণ।",
          },
          {
            key: "B",
            text: "Cloudflare এর একটা IP",
            isCorrect: true,
            explanation:
              "ঠিক। Cloudflare আসল IP লুকিয়ে নিজের IP দেয়, তাই পর্যটক আগে তার কাছে যায়।",
          },
          {
            key: "C",
            text: "কিছুই না, NXDOMAIN",
            isCorrect: false,
            explanation: "নামটা আছে, শুধু উত্তরের IP টা Cloudflare এর।",
          },
        ],
      },
      {
        id: 3,
        text: "Name Server বদলের পরদিন থেকে Domain এর ঠিকানায় ইমেইল আসছে না। সবচেয়ে সম্ভাব্য দুই কারণ?",
        options: [
          {
            key: "A",
            text: "MX বা TXT Record Cloudflare এ বসানো হয়নি, অথবা mail এর A Record কমলা হয়ে আছে",
            isCorrect: true,
            explanation:
              "ঠিক। Quick scan সব খুঁজে পায় না, আর Proxy ইমেইলের ভাষা বোঝে না। দুইটাই মিলিয়ে দেখুন।",
          },
          {
            key: "B",
            text: "Cloudflare ইমেইল সমর্থন করে না, তাই চলবেই না",
            isCorrect: false,
            explanation: "MX আর TXT ঠিক থাকলে ইমেইল দিব্যি চলে।",
          },
          {
            key: "C",
            text: "TTL খুব বেশি",
            isCorrect: false,
            explanation: "TTL বেশি হলে পুরনো (ঠিক) উত্তর বরং বেশিক্ষণ থাকত।",
          },
        ],
      },
      {
        id: 4,
        text: "কমলা মেঘ চালু করার পর সাইট খোলে না, Browser বলে ERR_TOO_MANY_REDIRECTS। কী দেখবেন?",
        options: [
          {
            key: "A",
            text: "SSL/TLS Mode, সম্ভবত Flexible আর সার্ভার HTTPS এ পাঠাতে চায়",
            isCorrect: true,
            explanation:
              "ঠিক। Flexible এ Cloudflare HTTP দিয়ে আসে, সার্ভার HTTPS এ ফেরত পাঠায়, চক্র চলতে থাকে। Full বা Full (strict) করুন।",
          },
          {
            key: "B",
            text: "MX Record",
            isCorrect: false,
            explanation: "MX শুধু ইমেইলের।",
          },
          {
            key: "C",
            text: "Registrar এর Name Server",
            isCorrect: false,
            explanation: "Name Server ভুল হলে সাইট পর্যন্ত পৌঁছানোই যেত না।",
          },
        ],
      },
      {
        id: 5,
        text: "নিচের কোন Record টা Proxied করা উচিত নয়?",
        options: [
          {
            key: "A",
            text: "মূল Website এর A Record",
            isCorrect: false,
            explanation: "এটা Website, Proxied করাই ভালো।",
          },
          {
            key: "B",
            text: "ssh উপনামের A Record",
            isCorrect: true,
            explanation:
              "ঠিক। SSH HTTP নয়। Proxied করলে সংযোগ Cloudflare এ গিয়ে থেমে যাবে।",
          },
          {
            key: "C",
            text: "www এর CNAME",
            isCorrect: false,
            explanation: "এটাও Website, Proxied করা যায়।",
          },
        ],
      },
      {
        id: 6,
        text: "Proxied করার পর Backend এ এক IP থেকে ঘন ঘন বুকিং আটকানোর নিয়মটা সবাইকেই আটকে দিচ্ছে। কেন?",
        options: [
          {
            key: "A",
            text: "সার্ভার এখন সবার Request এ Cloudflare এর IP দেখছে, আসল IP আছে CF-Connecting-IP Header এ",
            isCorrect: true,
            explanation:
              "ঠিক। সংযোগটা Cloudflare করে, তাই সবাইকে একই কয়েকটা IP মনে হয়। আসল IP ঐ Header থেকে পড়তে হবে।",
          },
          {
            key: "B",
            text: "DNS এর TTL শেষ হয়ে গেছে",
            isCorrect: false,
            explanation: "TTL এর সাথে এর সম্পর্ক নেই।",
          },
          {
            key: "C",
            text: "Cloudflare বুকিং সমর্থন করে না",
            isCorrect: false,
            explanation: "না, সে শুধু Request এগিয়ে দেয়।",
          },
        ],
      },
      {
        id: 7,
        text: "Name Server বদলের পরেও পুরনো DNS সেবায় Record গুলো কয়েক দিন রেখে দেওয়া উচিত কেন?",
        options: [
          {
            key: "A",
            text: "অনেক Resolver এর Cache এ পুরনো Name Server এখনো আছে, তারা ততদিন সেখানেই জিজ্ঞেস করবে",
            isCorrect: true,
            explanation:
              "ঠিক। দুই জায়গায় একই উত্তর থাকলে কেউ বদলটা টেরই পায় না। এটাই বিনা বিরতিতে সরানোর কৌশল।",
          },
          {
            key: "B",
            text: "Cloudflare পুরনো সেবা থেকে প্রতিদিন Record নকল করে",
            isCorrect: false,
            explanation: "না, সে শুধু একবার শুরুতে scan করে।",
          },
          {
            key: "C",
            text: "কোনো কারণ নেই, সাথে সাথে মুছে দেওয়াই ভালো",
            isCorrect: false,
            explanation: "সাথে সাথে মুছলে কিছু মানুষের জন্য সাইট আর ইমেইল বন্ধ হবে।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Cloudflare কে বাইরে থেকে পড়ুন",
    subtitle: "Terminal এ পাঁচটা পরীক্ষা, নিজের Domain ছাড়াই",
    stepName: "LAB",
    steps: [
      {
        title: "কে Cloudflare এর DNS ব্যবহার করে",
        description:
          "কয়েকটা চেনা সাইটের Name Server দেখে বের করুন কারা Cloudflare এ।",
      },
      {
        title: "Proxied নাকি DNS only",
        description:
          "একটা সাইটের IP বের করে দেখুন সেটা Cloudflare এর নাকি অন্য কারো।",
      },
      {
        title: "Header এ Cloudflare এর ছাপ",
        description:
          "curl দিয়ে server, cf-ray আর cf-cache-status পড়ুন, আর বের করুন কোন শহর থেকে উত্তর এলো।",
      },
      {
        title: "Cache এর HIT আর MISS",
        description:
          "একই ফাইল পরপর দুইবার চেয়ে দেখুন cf-cache-status কীভাবে বদলায়।",
      },
      {
        title: "বদলের আগের নকল বানানো",
        description:
          "যেকোনো একটা Domain এর জন্য সেই dns-backup.txt ফাইলটা বানিয়ে পড়ুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-who-uses-cf.sh",
        language: "bash",
        code: `for D in cloudflare.com discord.com github.com wikipedia.org; do
  echo "== $D =="; dig +short NS $D | head -2
done
# ns.cloudflare.com দিয়ে শেষ হলে DNS Cloudflare এ।
# নিজের পছন্দের আরও পাঁচটা সাইট যোগ করে দেখুন।`,
      },
      {
        filename: "2-proxied-or-not.sh",
        language: "bash",
        code: `IP=$(dig +short A discord.com | head -1)
echo $IP
whois $IP | grep -i -E "orgname|netname" | head -2
# Cloudflare, Inc. দেখালে Record টা Proxied।
# মনে রাখুন: Name Server Cloudflare এ হলেই যে Proxied, তা নয়।
# DNS Cloudflare এ, অথচ IP অন্য কারো, মানে Record টা DNS only।`,
      },
      {
        filename: "3-headers.sh",
        language: "bash",
        code: `curl -sI https://www.cloudflare.com | grep -i -E "^server|^cf-ray|^cf-cache-status"

# cf-ray এর শেষের তিন অক্ষর একটা বিমানবন্দরের সংকেত, মানে শহর।
# DAC ঢাকা, SIN সিঙ্গাপুর, BOM মুম্বাই, LHR লন্ডন।

# আরও বিস্তারিত, Cloudflare এর চোখে এই সংযোগ
curl -s https://www.cloudflare.com/cdn-cgi/trace | grep -E "^ip|^colo|^loc|^tls|^http"`,
      },
      {
        filename: "4-cache-hit-miss.sh",
        language: "bash",
        code: `# একটা স্থির ফাইল পরপর দুইবার চান
URL=https://www.cloudflare.com/favicon.ico
curl -sI $URL | grep -i -E "^cf-cache-status|^age"
curl -sI $URL | grep -i -E "^cf-cache-status|^age"

# HIT  মানে Cloudflare নিজের Cache থেকে দিয়েছে, সার্ভার জানেই না
# MISS মানে সার্ভার থেকে আনতে হয়েছে, এবার Cache এ রাখা হলো
# DYNAMIC মানে এটা Cache করার মতো জিনিস নয় (যেমন একটা HTML পাতা)
# age মানে ফাইলটা কত সেকেন্ড ধরে Cache এ আছে`,
      },
      {
        filename: "5-backup.sh",
        language: "bash",
        code: `D=github.com
for T in NS A AAAA MX TXT CAA; do
  echo "== $T =="; dig +noall +answer $T $D
done > dns-backup.txt
dig +noall +answer A   www.$D    >> dns-backup.txt
dig +noall +answer TXT _dmarc.$D >> dns-backup.txt
cat dns-backup.txt

# DNSSEC চালু আছে?
dig +short DS $D
# কিছু না এলে বন্ধ। এবার cloudflare.com দিয়ে চালিয়ে দেখুন, সেখানে চালু।`,
      },
    ],
    tip: "দুই নম্বর পরীক্ষার শেষ মন্তব্যটা ভালো করে পড়ুন, কারণ এখানেই এই লেসনের মূল তফাতটা ধরা পড়ে। Name Server দেখে জানা যায় DNS কার হাতে। IP দেখে জানা যায় Proxy চালু কি না। দুইটা আলাদা প্রশ্ন, আর দুইটার উত্তর আলাদা হতে পারে। একটা সাইট বেছে দুইটা পরীক্ষাই চালান, আর নিজেকে বলুন, এর DNS কোথায়, আর এর Proxy আছে কি নেই।",
  },
  assignment: {
    title: "Mini Project: একটা Domain সরানোর পরিকল্পনা",
    time: "৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>দশটা সাইটের জরিপ:</strong> দশটা চেনা সাইট নিন। প্রতিটার জন্য একটা
        ছকে লিখুন, DNS কি Cloudflare এ (Name Server দেখে), আর মূল নামটা কি Proxied
        (IP আর Header দেখে)।
      </span>,
      <span key="2">
        <strong>সরানোর পরিকল্পনা লিখুন:</strong> ধরুন Island Tours এর DNS এখন
        Registrar এর নিজের পাতায়, আর আপনি শুক্রবার রাতে সেটা Cloudflare এ সরাবেন।
        বদলের আগে, বদলের সময় আর বদলের পরে কী কী করবেন, ক্রম ধরে একটা তালিকা
        বানান। কোন ধাপের পর কোন কমান্ড দিয়ে যাচাই করবেন, তাও লিখুন।
      </span>,
      <span key="3">
        <strong>রঙ ঠিক করুন:</strong> এই Record গুলোর প্রতিটার পাশে লিখুন Proxied
        নাকি DNS only, আর এক লাইনে কারণ: @ A, www CNAME, api A, admin A, mail A,
        ftp A, একটা সেবার যাচাইয়ের CNAME, DKIM এর CNAME।
      </span>,
      <span key="4">
        <strong>সমস্যা ধরুন:</strong> তিনটা অভিযোগ এসেছে। (ক) সাইট ঘুরতেই থাকে,
        খোলে না। (খ) সাইট দেখায় Error 522। (গ) সাইট বদলেছি অথচ পুরনোটাই দেখাচ্ছে,
        যদিও dig ঠিক IP দিচ্ছে। প্রতিটার সম্ভাব্য কারণ আর প্রথম পরীক্ষাটা লিখুন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় লিখুন (৬ লাইন):</strong> একজন বন্ধু জিজ্ঞেস করলেন,
        Cloudflare এ কমলা মেঘ আর ধূসর মেঘের তফাত কী, আর আমি সব কমলা করে দিলে
        সমস্যা কোথায়? তাঁকে বোঝান।
      </span>,
    ],
    deliverables: [
      <span key="1">দশ সাইটের ছক, DNS আর Proxy র অবস্থা</span>,
      <span key="2">আগে, সময়ে, পরে, তিন ভাগে সরানোর তালিকা, যাচাইয়ের কমান্ড সহ</span>,
      <span key="3">আট Record এর রঙ আর কারণ</span>,
      <span key="4">তিন অভিযোগের কারণ আর প্রথম পরীক্ষা</span>,
      <span key="5">কমলা আর ধূসর মেঘের ব্যাখ্যা, ৬ লাইনে</span>,
    ],
  },
};
