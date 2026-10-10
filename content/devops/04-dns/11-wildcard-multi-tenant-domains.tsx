/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CustomDomainFlowLab,
  RecordsForUserLab,
  WildcardMatchLab,
} from "../../../components/course/topics/dns/tenant-animations";
import {
  CnameTargetChainDiagram,
  ThreeLayersDiagram,
  TwoAddressStylesSplit,
} from "../../../components/course/topics/dns/tenant-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const wildcardMultiTenantDomainsContent: TopicData = {
  id: "wildcard-multi-tenant-domains",
  introduction: {
    badge: "MODULE 04 · LESSON 11",
    title: <SectionTitle>এবার আপনিই সেই সেবা, যে গ্রাহককে Record দেয়</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি ছিলেন গ্রাহকের আসনে। একটা সেবার পাতায় নিজের Domain
          লিখেছেন, সে একটা ছক দেখিয়েছে, আপনি সেটা নিজের DNS এ বসিয়েছেন, আর সে
          যাচাই করেছে। এবার আসন বদল। আপনি নিজে এমন একটা App বানাচ্ছেন, যেখানে
          অনেক গ্রাহক থাকবেন, আর প্রত্যেকে নিজের একটা ঠিকানা চাইবেন।
        </ContentParagraph>
        <ContentParagraph>
          তখন প্রশ্নগুলো উল্টে যায়। প্রতিটা গ্রাহককে একটা করে উপনাম দেব কীভাবে,
          প্রতিবার হাতে DNS না বসিয়ে? গ্রাহক নিজের Domain জুড়তে চাইলে আমি তাঁকে
          কোন Record বসাতে বলব? সেই Record এর মান আমি পাব কোথা থেকে? তিনি সত্যিই
          বসিয়েছেন কি না জানব কীভাবে? আর হাজারটা আলাদা Domain এর জন্য HTTPS
          সার্টিফিকেট আসবে কোথা থেকে?
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই পুরো ব্যবস্থাটা শুরু থেকে শেষ পর্যন্ত বানায়। প্রথমে Wildcard
          দিয়ে উপনাম, তারপর গ্রাহকের নিজের Domain। DNS, সার্টিফিকেট, App এর কোড,
          Database এর নকশা, গ্রাহককে দেখানোর পাতা, আর নিরাপত্তার ফাঁদ, সব। শেষে
          আপনি এটা নিজে বানাতে পারবেন, আর আরেকজনকে শেখাতেও পারবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "একটা বড় ভবনে একটাই দারোয়ান, কিন্তু শত শত ফ্ল্যাট। দর্শনার্থী এসে একটা নাম বলেন, দারোয়ান খাতা দেখে বলে দেন কোন ফ্ল্যাট। আপনার App সেই দারোয়ান, আর Browser এর চাওয়া নামটাই দর্শনার্থীর বলা নাম।",
      author: "DNS",
      role: "Lesson 11",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "multi-tenant",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Multi-tenant মানে কী, আর ঠিকানার দুই ধরন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Tenant মানে ভাড়াটিয়া। Multi-tenant App হলো এমন একটা App, যেখানে
                একই কোড আর একই সার্ভার অনেক আলাদা গ্রাহককে সেবা দেয়, আর প্রত্যেক
                গ্রাহক মনে করেন App টা শুধু তাঁর। Shopify তে লক্ষ লক্ষ দোকান,
                কিন্তু Shopify র কোড একটাই। Blog সেবা, অনলাইন কোর্সের Platform,
                Website বানানোর সেবা, সবই এই ধাঁচের।
              </ContentParagraph>
              <ContentParagraph>
                আমাদের উদাহরণে Island Tours বড় হয়ে একটা Platform হয়েছে। এখন অন্য
                ট্যুর কোম্পানিরা এখানে Account খুলে নিজেদের বুকিং সাইট চালাতে
                পারে। Seagull Tours, Coral Trips, Bluewave, প্রত্যেকে একজন গ্রাহক,
                মানে একজন Tenant। আর প্রত্যেকের নিজের একটা ঠিকানা লাগবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TwoAddressStylesSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>ধরন ১, উপনাম:</strong> seagull.islandtours.example। গ্রাহক
                Account খোলার সাথে সাথে পান, কিছু বসাতে হয় না। Domain আপনার, তাই
                DNS পুরোপুরি আপনার হাতে।
              </ListItem>
              <ListItem>
                <strong>ধরন ২, Custom Domain:</strong>{" "}
                booking.seagulltours.example। গ্রাহকের নিজের কেনা Domain। দেখতে
                পেশাদার, গ্রাহকের নিজের পরিচয়। কিন্তু DNS গ্রাহকের হাতে, তাই তাঁকে
                কিছু Record বসাতে হয়, আর আপনাকে যাচাই করতে হয়।
              </ListItem>
              <ListItem>
                <strong>বাস্তবে দুইটাই একসাথে:</strong> প্রায় সব Platform প্রথম
                দিন থেকে উপনাম দেয়, আর Custom Domain রাখে একটা বাড়তি বা টাকার
                সুবিধা হিসেবে। তাই আপনাকে দুইটাই বানাতে হবে, আর আমরা সেই ক্রমেই
                এগোব।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "three-layers",
      subHeader: { index: "002", title: "Three Layers" },
      title: <SectionTitle>তিনটা স্তর, আর তিনটাই ঠিক হতে হবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কোডে হাত দেওয়ার আগে একটা মানচিত্র। একটা গ্রাহকের ঠিকানা কাজ করতে তিনটা
              আলাদা জিনিস ঠিক হতে হয়। এই তিনটা আলাদা করে মাথায় না রাখলে পুরো বিষয়টা
              একটা জট মনে হয়। আর সমস্যা হলে প্রথম প্রশ্নই হবে, এটা তিন স্তরের
              কোনটায়।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ThreeLayersDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "DNS শুধু প্রথম স্তর",
          content: (
            <p>
              এই মডিউলের বিষয় DNS, কিন্তু এই লেসনে আমরা ইচ্ছা করে একটু বাইরে
              যাব, কারণ Multi-tenant ঠিকানা শুধু DNS দিয়ে হয় না। DNS নামটাকে
              আপনার সার্ভারের দরজায় পৌঁছে দেয়। দরজা খোলে সার্টিফিকেট। আর ভেতরে
              কোন ঘরে যেতে হবে তা ঠিক করে আপনার App। সার্টিফিকেট আর App এর
              বিস্তারিত পরের মডিউলগুলোতে আসবে। এখানে আমরা প্রতিটা থেকে ঠিক ততটুকু
              নেব, যতটুকু ছাড়া গ্রাহকের ঠিকানা চালু করা যায় না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "wildcard-dns",
      subHeader: { index: "003", title: "Wildcard DNS" },
      title: <SectionTitle>Wildcard Record, এক সারিতে সব গ্রাহক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম সমস্যা, প্রতিটা গ্রাহকের উপনামের জন্য DNS এ একটা করে Record।
                দশজন গ্রাহক হলে হাতে বসানো যায়। দশ হাজার হলে যায় না, আর গ্রাহক
                Account খোলার পর আপনার DNS বসানোর অপেক্ষায় বসে থাকবেন, সেটাও চলে
                না।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান Record এর লেসনে এক লাইনে দেখেছিলেন, Name ঘরে একটা তারকা
                চিহ্ন। এর নাম Wildcard Record। এটা বলে, এই Domain এর নিচে যে নামের
                নিজের কোনো Record নেই, তার উত্তর এটা। একটা সারি বসালেই ভবিষ্যতের
                সব গ্রাহকের উপনাম আগে থেকে তৈরি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "wildcard.zone",
          code: `; Type   Name   Value
A        @      103.94.135.2          ; মূল সাইট (Wildcard এটা ঢাকে না)
CNAME    www    islandtours.example
A        api    103.94.135.3          ; নিজের উপনাম, নির্দিষ্ট Record
A        *      103.94.135.2          ; বাকি সব: seagull, coral, bluewave ...

; A এর বদলে CNAME দিয়েও করা যায়:
; CNAME  *      islandtours.example`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Wildcard এর আচরণ নিয়ে চারটা নিয়ম আছে, যেগুলো না জানলে অদ্ভুত সমস্যায়
              পড়তে হয়। নিচের Lab এ ছয়টা নাম পরীক্ষা করে নিয়মগুলো নিজে বের করুন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WildcardMatchLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নির্দিষ্ট Record সবসময় জেতে:</strong> api, www, mail এর
                মতো আপনার নিজের উপনামগুলো নিজের Record নিয়ে আগের মতোই চলে।
              </ListItem>
              <ListItem>
                <strong>মূল নাম আলাদা:</strong> তারকা মূল নামকে ঢাকে না। মূল
                নামের জন্য আলাদা Record রাখতেই হবে।
              </ListItem>
              <ListItem>
                <strong>যে নাম আছে, সেখানে Wildcard নেই:</strong> একটা নামে
                যেকোনো ধরনের একটা Record থাকলেই সেই নামে Wildcard আর কাজ করে না,
                অন্য ধরনের প্রশ্নেও না।
              </ListItem>
              <ListItem>
                <strong>ভুল নামও উত্তর পায়:</strong> এমন উপনাম যা কোনো গ্রাহকের
                নয়, সেটাও আপনার সার্ভারে পৌঁছায়। তাই DNS কখনো বলে না গ্রাহক আছে
                কি নেই, সেটা বলে আপনার App।
              </ListItem>
              <ListItem>
                <strong>Cloudflare এ Wildcard:</strong> Name এ * লিখে সাধারণ Record
                এর মতোই বসে, আর Proxied ও করা যায়। Cloudflare এর বিনা খরচের
                সার্টিফিকেট মূল নাম আর এক স্তরের সব উপনাম ঢাকে।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "wildcard-cert",
      subHeader: { index: "004", title: "Wildcard Certificate" },
      title: <SectionTitle>Wildcard সার্টিফিকেট, আর কেন Hosting Name Server চায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DNS ঠিক হলো, প্রতিটা উপনাম আপনার সার্ভারে পৌঁছায়। দ্বিতীয় স্তর,
                HTTPS। সার্ভারকে প্রতিটা নামের জন্য একটা বৈধ সার্টিফিকেট দেখাতে
                হয়। দশ হাজার গ্রাহকের জন্য দশ হাজার সার্টিফিকেট? দরকার নেই। DNS
                এর মতো সার্টিফিকেটেরও একটা Wildcard রূপ আছে। একটাই সার্টিফিকেট,
                *.islandtours.example নামে, যা এক স্তরের সব উপনাম ঢাকে।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু এই সার্টিফিকেট পেতে একটা বিশেষ শর্ত আছে, আর এই শর্তটাই
                ব্যাখ্যা করে একটা প্রশ্ন যা অনেককে ভাবায়, Wildcard চাইলে Hosting
                কেন বলে আমাদের Name Server ব্যবহার করুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সাধারণ নামের সার্টিফিকেট:</strong> সার্টিফিকেট সংস্থা
                  একটা ছোট পরীক্ষা নেয়। সে নামটায় একটা Request পাঠায়, আর দেখে
                  আপনার সার্ভার একটা নির্দিষ্ট গোপন লেখা ফেরত দেয় কি না। দিলে
                  প্রমাণ হয় নামটা আপনার সার্ভারে আসে। এর নাম HTTP Challenge, আর
                  এতে DNS এ হাত দেওয়ার দরকার পড়ে না।
                </ListItem>
                <ListItem>
                  <strong>Wildcard সার্টিফিকেট:</strong> এখানে সেই পরীক্ষা চলে
                  না, কারণ অসীম সংখ্যক নাম পরীক্ষা করা যায় না। তাই সংস্থা আরও
                  শক্ত প্রমাণ চায়, পুরো Domain এর DNS এর নিয়ন্ত্রণ। সে বলে,
                  _acme-challenge নামে এই লেখাটা একটা TXT Record হিসেবে বসান। এর
                  নাম DNS Challenge।
                </ListItem>
                <ListItem>
                  <strong>আর এটা বারবার করতে হয়:</strong> সার্টিফিকেটের মেয়াদ
                  মোটামুটি তিন মাস। প্রতিবার নবায়নে নতুন একটা লেখা বসাতে হয়। হাতে
                  করা অসম্ভব, তাই যে Program সার্টিফিকেট নেয় তার হাতে আপনার DNS
                  এ লেখার ক্ষমতা থাকতে হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এখন ধাঁধাটা মেলে। Hosting যদি আপনার হয়ে Wildcard সার্টিফিকেট নিতে
                আর নবায়ন করতে চায়, তাকে আপনার DNS এ TXT বসাতে পারতে হবে। সেটা
                সম্ভব দুইভাবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>উপায় ক, Name Server তাদের হাতে:</strong> আপনি Registrar
                  এ Hosting এর Name Server বসান। তখন পুরো DNS তাদের, তারা যখন খুশি
                  যা খুশি বসাতে পারে। Vercel এ Wildcard Domain এর জন্য এটাই প্রধান
                  পথ, ns1.vercel-dns.com আর ns2.vercel-dns.com।
                </ListItem>
                <ListItem>
                  <strong>উপায় খ, শুধু সেই একটা নাম তাদের হাতে:</strong> DNS নিজের
                  কাছেই রাখেন, কিন্তু _acme-challenge নামটা একটা CNAME বা NS দিয়ে
                  Hosting এর দিকে দেখিয়ে দেন। তখন শুধু ঐ একটা নামের উত্তর তারা
                  দেয়। বাকি DNS আপনার হাতে থাকে। সব Hosting এটা সমর্থন করে না,
                  তাদের নির্দেশিকা দেখে নিন।
                </ListItem>
                <ListItem>
                  <strong>নিজের সার্ভার হলে:</strong> আপনার সার্টিফিকেট নেওয়ার
                  Program কে DNS সেবার একটা API Token দেন, যা দিয়ে সে নিজে TXT
                  বসাতে আর মুছতে পারে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "DNS এর Wildcard আর সার্টিফিকেটের Wildcard এক নিয়মে চলে না",
          content: (
            <p>
              Lab এর শেষ নামটায় দেখেছেন, DNS এর Wildcard দুই স্তর গভীর নামকেও
              ধরে, কিন্তু *.islandtours.example সার্টিফিকেট ঢাকে শুধু ঠিক এক স্তর।
              shop.seagull.islandtours.example এর জন্য সেটা বৈধ নয়। আর মূল নামও
              এতে পড়ে না, তাই সার্টিফিকেটে সবসময় দুইটা নাম রাখা হয়, মূল নাম আর
              তারকা সহ নাম। শিক্ষা হলো, গ্রাহকের উপনাম সবসময় এক স্তরে রাখুন, আর
              গ্রাহকের দেওয়া নামে ফোঁটা থাকতে দেবেন না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "wildcard-setup",
      subHeader: { index: "005", title: "Setting Up Wildcard" },
      title: <SectionTitle>হাতে কলমে ১, Wildcard উপনাম চালু করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              App কোথায় চলে তার উপর নির্ভর করে তিনটা পথ। তিনটাতেই একই তিন স্তর
              ঠিক হচ্ছে, শুধু কে কোন কাজটা করছে তা আলাদা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "PATH A",
          steps: [
            {
              title: "Hosting Platform এ (Vercel এর মতো), তাদের Name Server দিয়ে",
              description:
                "Registrar এ Platform এর দেওয়া Name Server দুইটা বসান। Platform এ Project এর Domains পাতায় প্রথমে মূল নাম islandtours.example যোগ করুন, তারপর আলাদা করে *.islandtours.example যোগ করুন। Platform নিজে DNS এ Wildcard Record বসায়, নিজে DNS Challenge দিয়ে Wildcard সার্টিফিকেট নেয়, আর নিজে নবায়ন করে। তিন স্তরের প্রথম দুইটা শেষ।",
            },
            {
              title: "ইমেইল আর বাকি Record সরিয়ে আনুন",
              description:
                "Name Server বদলেছেন, তাই আগের DNS পাতার MX, SPF, DKIM আর যাচাইয়ের TXT গুলো এখন Platform এর DNS পাতায় বসাতে হবে। এটা ভুললে ইমেইল বন্ধ হবে।",
            },
            {
              title: "যাচাই",
              description:
                "dig +short NS দিয়ে দেখুন Platform এর Name Server। তারপর এমন একটা উপনাম খুলুন যা কোথাও বসাননি, যেমন test123.islandtours.example। সাইট খুললে আর তালার চিহ্ন এলে DNS আর সার্টিফিকেট দুইটাই কাজ করছে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "PATH B",
          steps: [
            {
              title: "Cloudflare এর পেছনে, যেকোনো সার্ভার বা Hosting",
              description:
                "Cloudflare এর DNS পাতায় একটা Record বসান: Type A (বা CNAME), Name এ *, Value তে আপনার সার্ভারের IP বা Hosting এর নাম, আর Proxy status Proxied। Cloudflare এর বিনা খরচের সার্টিফিকেট নিজে থেকেই মূল নাম আর এক স্তরের সব উপনাম ঢাকে, তাই পর্যটকের দিকের HTTPS তৈরি।",
            },
            {
              title: "Cloudflare থেকে সার্ভারের পথটা",
              description:
                "SSL/TLS Mode Full (strict) রাখতে সার্ভারেও একটা সার্টিফিকেট লাগবে। সহজ উপায়, Cloudflare এর Origin Certificate বানানো, যেখানে নাম হিসেবে মূল নাম আর *.islandtours.example দুইটাই দেওয়া যায়, আর মেয়াদ বহু বছর। সেটা সার্ভারে বসান।",
            },
            {
              title: "সার্ভারকে সব উপনাম নিতে বলুন",
              description:
                "Web server এর সেটিংয়ে নাম হিসেবে *.islandtours.example দিন, যাতে সে সব উপনামের Request আপনার App এ পাঠায়। Hosting হলে তার পাতায় Wildcard Domain যোগ করুন।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "PATH C",
          steps: [
            {
              title: "নিজের সার্ভার, নিজের সার্টিফিকেট (Caddy দিয়ে)",
              description:
                "DNS সেবায় Wildcard A Record বসান, সার্ভারের IP দিয়ে, DNS only। DNS সেবা থেকে একটা API Token বানান, যার ক্ষমতা শুধু এই একটা Domain এর DNS Record বদলানো। Token টা সার্ভারে একটা Environment Variable এ রাখুন, কোডে বা Config ফাইলে নয়।",
            },
            {
              title: "Web server কে Token দিন",
              description:
                "নিচের Caddyfile এ দেখুন। Caddy নিজে সার্টিফিকেট সংস্থার সাথে কথা বলে, Token দিয়ে নিজে _acme-challenge TXT বসায়, সার্টিফিকেট নেয়, TXT মুছে দেয়, আর মেয়াদ শেষের আগে নিজে নবায়ন করে।",
            },
            {
              title: "যাচাই",
              description:
                "যেকোনো উপনাম https দিয়ে খুলুন। নিচের openssl কমান্ডে দেখুন সার্টিফিকেটে *.islandtours.example নামটা আছে কি না।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "Caddyfile",
          code: `# মূল নাম আর সব উপনাম, একটাই Wildcard সার্টিফিকেট দিয়ে
islandtours.example, *.islandtours.example {
	tls {
		# DNS Challenge: Caddy এই Token দিয়ে নিজে TXT বসায় আর মোছে
		dns cloudflare {env.CLOUDFLARE_API_TOKEN}
	}
	# সব Request একই App এ, App নিজে নাম দেখে গ্রাহক বাছবে
	reverse_proxy localhost:3000
}`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "verify-wildcard.sh",
          code: `D=islandtours.example

# ১. DNS: যে উপনাম কোথাও বসাননি, সেও উত্তর পায়?
dig +short A kichu-ekta-12345.$D
dig +short A seagull.$D

# ২. সার্টিফিকেট: কোন কোন নাম ঢাকা?
echo | openssl s_client -connect seagull.$D:443 -servername seagull.$D 2>/dev/null \\
  | openssl x509 -noout -ext subjectAltName
#    DNS:*.islandtours.example, DNS:islandtours.example  দেখা চাই

# ৩. App: দুই নামে দুই গ্রাহক?
curl -s https://seagull.$D | head -5
curl -s https://coral.$D   | head -5`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "host-routing",
      subHeader: { index: "006", title: "Tenant from Host" },
      title: <SectionTitle>App কীভাবে বোঝে কে কোন গ্রাহক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তৃতীয় স্তর। সব উপনাম একই সার্ভারের একই App এ এসে পড়ছে। App কীভাবে
                জানবে কাকে কোন তথ্য দেখাতে হবে? উত্তরটা প্রতিটা Request এর ভেতরেই
                আছে। Browser যখন একটা Request পাঠায়, সে সাথে লিখে দেয় কোন নামটা সে
                চেয়েছিল। এই তথ্যটার নাম Host Header।
              </ContentParagraph>
              <ContentParagraph>
                DNS নামকে IP বানিয়ে দেয়, কিন্তু নামটা হারিয়ে যায় না। Browser IP তে
                পৌঁছে আবার নামটা বলে। আপনার App সেই নামটা পড়ে, আর সেখান থেকে
                গ্রাহক বের করে। পুরো Multi-tenant ব্যবস্থার মেরুদণ্ড এই একটা কাজ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "typescript",
          filename: "tenant-from-host.ts",
          code: `// মূল Domain আসে Configuration থেকে, কোডে লেখা নয়।
// Production এ islandtours.example, নিজের যন্ত্রে localhost।
const ROOT = process.env.APP_ROOT_DOMAIN!;

// এই উপনামগুলো কোনো গ্রাহক নিতে পারবেন না।
const RESERVED = new Set([
  "www", "api", "app", "admin", "mail", "status", "customers", "docs",
]);

export async function tenantFromHost(hostHeader: string) {
  // Host এ Port থাকতে পারে (localhost:3000), আর বড় হাতের অক্ষরও।
  const host = hostHeader.toLowerCase().split(":")[0];

  // ১. মূল নাম বা www: এটা Platform এর নিজের সাইট, কোনো গ্রাহক নয়।
  if (host === ROOT || host === "www." + ROOT) return null;

  // ২. আমাদের Domain এর নিচের উপনাম।
  if (host.endsWith("." + ROOT)) {
    const slug = host.slice(0, -(ROOT.length + 1));
    // দুই স্তরের নাম (a.b) আর সংরক্ষিত নাম বাদ।
    if (slug.includes(".") || RESERVED.has(slug)) return null;
    return db.tenant.findBySlug(slug);          // না পেলে null
  }

  // ৩. অন্য যেকোনো নাম: একটা Custom Domain। শুধু active হলে তবেই।
  return db.tenant.findByActiveDomain(host);    // না পেলে null
}

// প্রতিটা Request এর শুরুতে:
//   const tenant = await tenantFromHost(request.headers.get("host") ?? "");
//   if (!tenant) return notFound();   // অচেনা নাম: 404, কখনো কোনো ডিফল্ট গ্রাহক নয়`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>অচেনা নামে সবসময় 404:</strong> Wildcard এর কারণে যেকোনো
                উপনাম আপনার App এ পৌঁছায়। গ্রাহক না পেলে একটা সাধারণ খুঁজে পাওয়া
                যায়নি পাতা দেখান। কখনো প্রথম গ্রাহক বা কোনো ডিফল্ট গ্রাহকের তথ্য
                দেখাবেন না।
              </ListItem>
              <ListItem>
                <strong>সংরক্ষিত নামের তালিকা:</strong> গ্রাহক যদি admin, api বা
                www নামে Account খুলতে পারেন, তিনি আপনার নিজের ঠিকানা দখল করে
                ফেলবেন বা মানুষকে ঠকাতে পারবেন। Account খোলার সময়ই এই নামগুলো
                আটকান।
              </ListItem>
              <ListItem>
                <strong>উপনামের নিয়ম:</strong> শুধু ছোট হাতের ইংরেজি অক্ষর,
                সংখ্যা আর মাঝখানে হাইফেন। ৩ থেকে ৬৩ অক্ষর। ফোঁটা নয়। এটা DNS এর
                নিজের নিয়মের সাথে মেলে।
              </ListItem>
              <ListItem>
                <strong>খোঁজাটা দ্রুত হতে হবে:</strong> এই কাজ প্রতিটা Request এ
                হয়। তাই নাম থেকে গ্রাহক বের করার ফলটা কয়েক মিনিটের জন্য Cache এ
                রাখুন, প্রতিবার Database এ যাবেন না।
              </ListItem>
              <ListItem>
                <strong>সামনে Proxy থাকলে:</strong> App এর সামনে Load Balancer বা
                CDN থাকলে আসল নামটা কখনো X-Forwarded-Host নামের আরেকটা Header এ
                আসে। আপনার Platform কোনটা পাঠায় জেনে নিন। আর এই Header শুধু নিজের
                Proxy থেকে এলে তবেই বিশ্বাস করুন, বাইরের কেউ এটা জাল করতে পারে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "try-it-locally.sh",
          code: `# নিজের যন্ত্রে, কোনো Domain বা DNS ছাড়াই পুরো ধারণাটা পরীক্ষা করুন।
# এক লাইনের একটা সার্ভার, যে শুধু Host দেখে গ্রাহকের নাম বলে:
node -e 'require("http").createServer((q,s)=>s.end("tenant: "+q.headers.host.split(".")[0]+"\\n")).listen(3000)'

# আরেকটা Terminal এ। .localhost দিয়ে শেষ যেকোনো নাম নিজের যন্ত্রেই আসে,
# তাই এটা একটা বিনা খরচের Wildcard:
curl http://seagull.localhost:3000        # tenant: seagull
curl http://coral.localhost:3000          # tenant: coral

# Custom Domain এর ভান: একই সার্ভার, শুধু Host আলাদা
curl -H "Host: booking.seagulltours.example" http://127.0.0.1:3000   # tenant: booking

# Browser এও http://seagull.localhost:3000 সরাসরি খোলে।`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "custom-domain-problem",
      subHeader: { index: "007", title: "Custom Domains" },
      title: <SectionTitle>Custom Domain, আর গ্রাহককে দেওয়ার Record কোথা থেকে আসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার কঠিন অংশ। Seagull Tours বলল, আমরা
                seagull.islandtours.example চাই না, আমাদের নিজের Domain এ চাই,
                booking.seagulltours.example। এই Domain তাদের। এর DNS তাদের হাতে।
                আপনি সেখানে কিছুই বসাতে পারেন না। তাই আপনাকে তাদের বলে দিতে হবে
                কী বসাতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                আর এখানেই সেই প্রশ্ন, যেটা এই লেসনের কেন্দ্র। গ্রাহককে দেওয়ার
                Record এর মান আমি পাব কোথা থেকে? আগের লেসনে আপনি দেখেছেন অন্য
                সেবাগুলো আপনাকে কী দেয়। তারা সেটা কোথাও থেকে পায়নি। তারা সেটা
                নিজেরা ঠিক করেছে। এবার আপনিও তাই করবেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CnameTargetChainDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                গ্রাহককে আপনি সর্বোচ্চ তিনটা মান দেন, আর তিনটার উৎস তিনটা আলাদা
                জায়গা। এই তিনটা বুঝলে পুরো রহস্য শেষ।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>CNAME Target, আপনার নিজের বানানো একটা নাম:</strong> আপনি
                  নিজের Domain এর নিচে একটা নাম ঠিক করেন, যেমন
                  customers.islandtours.example, আর নিজের DNS এ সেটাকে নিজের
                  সার্ভারের দিকে দেখান। এটা একবারের কাজ। তারপর সব গ্রাহককে একই
                  নাম দেন। আপনার কোডে এটা একটা স্থির মান, যা Configuration থেকে
                  আসে।
                </ListItem>
                <ListItem>
                  <strong>IP, মূল নামের জন্য:</strong> গ্রাহক যদি মূল নাম
                  (seagulltours.example) জুড়তে চান, সেখানে CNAME চলে না, তাই একটা
                  IP দিতে হয়। এটা আপনার সার্ভার বা Load Balancer এর স্থায়ী Public
                  IP। এটাও Configuration থেকে আসে।
                </ListItem>
                <ListItem>
                  <strong>যাচাইয়ের সংকেত, আপনার Backend এর বানানো:</strong> গ্রাহক
                  Domain যোগ করার মুহূর্তে আপনার কোড একটা এলোমেলো লেখা বানায়,
                  Database এ রাখে, আর TXT Record হিসেবে বসাতে বলে। এটা প্রতিটা
                  Domain এর জন্য আলাদা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর আপনার App যদি নিজের সার্ভারে না চলে, বরং একটা Hosting Platform
                এ চলে, তাহলে একটা চতুর্থ উৎস আসে। Platform এর API। তখন CNAME
                Target আর IP আপনি বানান না, Platform এর কাছ থেকে নেন, কারণ সার্ভার
                তাদের। নিচের Lab এ তিনটা অবস্থাই দেখুন, আর প্রতিটা সারিতে চাপ দিয়ে
                দেখুন মানটা কোথা থেকে এলো।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RecordsForUserLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "গ্রাহককে IP নয়, নিজের একটা নাম দিন",
          content: (
            <p>
              গ্রাহককে সরাসরি IP দেওয়া সহজ মনে হয়, কিন্তু এটা একটা ফাঁদ। হাজার
              গ্রাহক নিজেদের DNS এ আপনার IP লিখে রাখলে, সেই IP আপনি আর কখনো
              বদলাতে পারবেন না। সার্ভার বদল, Cloud বদল, Load Balancer যোগ, যেকোনো
              কিছুতে হাজার গ্রাহককে ইমেইল করে DNS বদলাতে বলতে হবে, আর অর্ধেক
              গ্রাহক করবেনই না। CNAME Target দিলে গ্রাহকরা একটা নামের দিকে
              দেখান, আর সেই নাম কোন IP তে যাবে তা আপনার নিজের DNS এ, আপনার হাতে।
              তাই যেখানে সম্ভব CNAME দিন, আর গ্রাহককে মূল নামের বদলে একটা উপনাম
              (যেমন booking বা www) ব্যবহার করতে উৎসাহ দিন। মূল নামের জন্য IP
              দিতেই হলে একটা স্থায়ী, আলাদা করে সংরক্ষিত IP নিন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "setup-target",
      subHeader: { index: "008", title: "One-time Setup" },
      title: <SectionTitle>হাতে কলমে ২, নিজের দিকের একবারের প্রস্তুতি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম গ্রাহক Domain জোড়ার আগে আপনার নিজের দিকে চারটা জিনিস একবার
              তৈরি করে রাখতে হয়। এগুলো প্রতিটা গ্রাহকের জন্য আবার করতে হয় না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "একটা স্থায়ী IP নিন",
              description:
                "সার্ভার কোম্পানির পাতায় একটা Static বা Reserved IP নিয়ে সার্ভার বা Load Balancer এ জুড়ুন। সাধারণ সার্ভারের IP সার্ভার মুছলে হারিয়ে যায়। সংরক্ষিত IP আপনার থাকে, আর নতুন সার্ভারে সরানো যায়।",
            },
            {
              title: "CNAME Target বানান",
              description:
                "নিজের DNS এ একটা A Record বসান: Name customers, Value সেই স্থায়ী IP। এখন customers.islandtours.example আপনার CNAME Target। নামটা ভেবে বাছুন, কারণ এটা আর কখনো বদলানো যাবে না। Cloudflare এ হলে এটা DNS only রাখুন, যদি না আপনি Cloudflare for SaaS ব্যবহার করেন।",
            },
            {
              title: "দুইটা মান Configuration এ রাখুন",
              description:
                "CNAME Target আর IP, দুইটাই Environment Variable এ রাখুন, কোডের ভেতরে লিখে নয়। পরীক্ষার পরিবেশ আর আসল পরিবেশে এগুলো আলাদা হবে, আর একদিন বদলাতে হলে শুধু Configuration বদলাবেন।",
            },
            {
              title: "সার্ভারকে অচেনা নাম নিতে শেখান",
              description:
                "Web server কে বলুন যেকোনো নামের Request নিয়ে App এ পাঠাতে, আর দরকার মতো সেই নামের সার্টিফিকেট নিতে। এটা কীভাবে হয় তা একটু পরেই, সার্টিফিকেটের অংশে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "platform-side.zone",
          code: `; islandtours.example এর DNS, আপনার হাতে

A      @           103.94.135.2     ; Platform এর নিজের সাইট
CNAME  www         islandtours.example
A      *           103.94.135.2     ; গ্রাহকদের উপনাম (seagull, coral, ...)
A      customers   103.94.135.2     ; CNAME Target, গ্রাহকরা এর দিকে CNAME করবেন

; customers এর জন্য আলাদা নির্দিষ্ট Record রাখা ভালো, Wildcard এর উপর না ছেড়ে।
; তাহলে একদিন Custom Domain এর Traffic আলাদা সার্ভারে সরানো যায়,
; শুধু এই এক সারি বদলে।`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "verification",
      subHeader: { index: "009", title: "Verifying Ownership" },
      title: <SectionTitle>যাচাই: গ্রাহক সত্যিই মালিক তো, আর বসিয়েছেন তো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                গ্রাহক বললেন Record বসিয়েছি। আপনি বিশ্বাস করবেন না, যাচাই করবেন।
                আর যাচাই দুই রকম, যা দুইটা আলাদা প্রশ্নের উত্তর দেয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>মালিকানা (TXT দেখে):</strong> এই Domain কি সত্যিই এই
                  গ্রাহকের? আপনার বানানো সংকেতটা Domain এর DNS এ পাওয়া গেলে প্রমাণ
                  হয়, যিনি আপনার App এ Domain যোগ করেছেন তাঁর হাতেই Domain এর DNS।
                </ListItem>
                <ListItem>
                  <strong>পথ (CNAME বা A দেখে):</strong> এই Domain এর Traffic কি
                  এখন আপনার সার্ভারে আসছে? না এলে সার্টিফিকেট নেওয়া যাবে না, আর
                  সাইটও খুলবে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মালিকানা যাচাই বাদ দেওয়ার লোভ হয়, কারণ CNAME তো আছেই। কিন্তু একটা
                বাস্তব আক্রমণ আছে যা শুধু TXT ঠেকায়। ধরুন Seagull Tours এক বছর পর
                আপনার সেবা ছেড়ে দিল, কিন্তু তাদের DNS এর CNAME টা মুছল না। সেটা
                এখনো আপনার দিকে দেখাচ্ছে। এখন অন্য যে কেউ আপনার App এ একটা Account
                খুলে booking.seagulltours.example যোগ করলে, পথের যাচাই পাশ করবে,
                আর Seagull Tours এর Domain এ সেই অচেনা মানুষের সাইট দেখাবে। TXT
                যাচাই থাকলে সে পারবে না, কারণ Seagull Tours এর DNS এ নতুন সংকেত
                বসানোর ক্ষমতা তার নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "typescript",
          filename: "verify-domain.ts",
          code: `import { Resolver } from "node:dns/promises";
import { randomBytes } from "node:crypto";

// নিজের যন্ত্রের Resolver নয়, একটা Public Resolver, যাতে উত্তর সবার জন্য এক হয়।
const resolver = new Resolver();
resolver.setServers(process.env.DNS_CHECK_RESOLVERS!.split(","));   // যেমন 1.1.1.1,8.8.8.8

const CNAME_TARGET = process.env.CUSTOM_DOMAIN_CNAME_TARGET!;   // customers.islandtours.example
const APEX_IP = process.env.CUSTOM_DOMAIN_APEX_IP!;             // 103.94.135.2
const TXT_PREFIX = "_islandtours-verify";

// Domain যোগ করার সময় একবার: একটা অনুমান করা অসম্ভব সংকেত
export function newVerificationToken() {
  return randomBytes(16).toString("hex");
}

// মালিকানা: আমাদের সংকেতটা কি গ্রাহকের DNS এ আছে?
export async function ownsDomain(hostname: string, token: string) {
  try {
    const records = await resolver.resolveTxt(TXT_PREFIX + "." + hostname);
    // একটা লম্বা TXT কয়েক টুকরোয় আসে, তাই জোড়া লাগাতে হয়
    return records.some((chunks) => chunks.join("") === "it-verify=" + token);
  } catch {
    return false;   // Record নেই, বা Domain নেই
  }
}

// পথ: এই নামটা কি আমাদের সার্ভারে আসে?
export async function pointsToUs(hostname: string) {
  try {
    const cnames = await resolver.resolveCname(hostname);
    if (cnames.some((c) => c.toLowerCase() === CNAME_TARGET)) return true;
  } catch {
    // CNAME নেই: মূল নাম হতে পারে, বা CNAME Flattening। A দেখে নিই।
  }
  try {
    const ips = await resolver.resolve4(hostname);
    // সব IP আমাদের হতে হবে। একটা পুরনো A রয়ে গেলে অর্ধেক মানুষ ভুল জায়গায় যাবে।
    return ips.length > 0 && ips.every((ip) => ip === APEX_IP);
  } catch {
    return false;
  }
}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>TXT এর নাম আলাদা রাখুন:</strong> সংকেতটা মূল নামে না বসিয়ে
                একটা নিজস্ব উপনামে (যেমন _islandtours-verify) বসাতে বলুন। এতে
                গ্রাহকের অন্য TXT এর সাথে মেশে না, আর যে নামে CNAME আছে সেখানে TXT
                বসানোর নিষেধটাও এড়ানো যায়।
              </ListItem>
              <ListItem>
                <strong>কী পেয়েছেন তা গ্রাহককে দেখান:</strong> শুধু যাচাই ব্যর্থ
                বললে গ্রাহক আটকে যান। বলুন, আমরা আশা করেছিলাম এই মান, পেয়েছি এই
                মান, বা কিছুই পাইনি। এই এক কাজ আপনার সহায়তার অর্ধেক ইমেইল কমায়।
              </ListItem>
              <ListItem>
                <strong>নিজে থেকে আবার চেষ্টা করুন:</strong> গ্রাহক Record বসানোর
                পর DNS এ পৌঁছাতে কয়েক মিনিট লাগে। একটা পেছনের কাজ কয়েক মিনিট পরপর
                অপেক্ষমাণ Domain গুলো আবার পরীক্ষা করুক, যাতে গ্রাহককে বারবার
                বোতাম চাপতে না হয়। এক দুই দিন পরে হাল ছেড়ে গ্রাহককে একটা ইমেইল
                দিন।
              </ListItem>
              <ListItem>
                <strong>Verify বোতামে সীমা দিন:</strong> প্রতি চাপে আপনার সার্ভার
                কয়েকটা DNS প্রশ্ন করে। একজন গ্রাহক মিনিটে কয়েকবারের বেশি যেন চাপতে
                না পারেন।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "lifecycle",
      subHeader: { index: "010", title: "Lifecycle" },
      title: <SectionTitle>একটা Custom Domain এর পুরো জীবনচক্র</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সব টুকরো সময় ধরে সাজাই। গ্রাহক Domain লেখা থেকে সাইট চালু হওয়া
              পর্যন্ত সাতটা ধাপ, আর প্রতিটায় দুই দিক, গ্রাহক কী দেখেন আর আপনার
              Backend কী করে। এটাই আপনার বানাতে হবে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CustomDomainFlowLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই জীবনচক্র ধরে রাখতে Database এ একটা ছক লাগে। নকশাটা ছোট, কিন্তু
              প্রতিটা ঘরের একটা কারণ আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "custom_domains.sql",
          code: `CREATE TABLE custom_domains (
  id                 uuid PRIMARY KEY,
  tenant_id          uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- সবসময় ছোট হাতের অক্ষরে রাখা। UNIQUE, কারণ একটা নাম শুধু একজন গ্রাহকের হতে পারে।
  hostname           text NOT NULL UNIQUE,

  -- এলোমেলো সংকেত, যা গ্রাহক TXT এ বসান
  verification_token text NOT NULL,

  -- pending_verification | verified | pending_certificate | active | misconfigured
  status             text NOT NULL DEFAULT 'pending_verification',

  -- গ্রাহককে দেখানোর জন্য: শেষবার কী পাওয়া গিয়েছিল, কেন ব্যর্থ
  last_error         text,
  last_checked_at    timestamptz,
  verified_at        timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- প্রতিটা Request এ এই খোঁজটা হয়, তাই দ্রুত হতে হবে
CREATE INDEX custom_domains_active ON custom_domains (hostname) WHERE status = 'active';`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "গ্রাহকের লেখা নামটা পরিষ্কার না করে রাখবেন না",
          content: (
            <p>
              গ্রাহক Add Domain ঘরে যা খুশি লিখবেন। কেউ লিখবেন
              https://Booking.SeagullTours.example/ সামনে https, বড় হাতের অক্ষর আর
              শেষে স্ল্যাশ সহ। কেউ সামনে পেছনে ফাঁকা জায়গা রাখবেন। রাখার আগে নামটা
              পরিষ্কার করুন: ছোট হাতের অক্ষর, https আর পথের অংশ বাদ, শেষের ফোঁটা
              বাদ। তারপর তিনটা জিনিস আটকান। নিজের Domain বা তার নিচের কোনো নাম
              (তার জন্য উপনাম আছে)। IP ঠিকানা। আর এমন নাম যা বৈধ Domain ই নয়। এই
              ধাপ বাদ দিলে একই Domain দুই রূপে দুইবার ঢুকবে, আর UNIQUE নিয়মটা
              অকেজো হয়ে যাবে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "certificates",
      subHeader: { index: "011", title: "Certificates at Scale" },
      title: <SectionTitle>হাজার Domain এর সার্টিফিকেট, তিনটা পথ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Custom Domain এ Wildcard সার্টিফিকেট কাজে আসে না, কারণ প্রতিটা
                গ্রাহকের Domain সম্পূর্ণ আলাদা। booking.seagulltours.example আর
                www.coraltrips.example এর মধ্যে কোনো মিল নেই। তাই প্রতিটা Domain
                এর নিজের সার্টিফিকেট লাগে, যা নিজে থেকে আসতে হবে, গ্রাহক Record
                বসানোর কয়েক মিনিটের মধ্যে, আর নিজে থেকে নবায়ন হতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                সুখবর, এখানে DNS Challenge লাগে না। গ্রাহকের CNAME আপনার সার্ভারে
                এসে গেলে সার্টিফিকেট সংস্থার HTTP পরীক্ষাটা আপনার সার্ভারই পাশ
                করাতে পারে, গ্রাহকের DNS এ আর কিছু না বসিয়ে। তাই গ্রাহককে শুধু
                CNAME আর TXT, এই দুইটা Record ই দিতে হয়। বাকিটা আপনি তিনভাবে করতে
                পারেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ROUTE",
          steps: [
            {
              title: "পথ ১, Hosting Platform এর API (সবচেয়ে সহজ)",
              description:
                "App যদি Vercel এর মতো Platform এ চলে, সার্টিফিকেট তাদের কাজ। গ্রাহক Domain যোগ করলে আপনার Backend Platform এর API কে বলে, এই নামটা আমার Project এ যোগ করুন। Platform উত্তরে জানায় নামটা যাচাই করা কি না, আর না হলে কোন TXT লাগবে। আপনি Platform এর Domain Configuration এর API থেকে প্রস্তাবিত CNAME আর A এর মান পড়ে গ্রাহককে দেখান। গ্রাহক Record বসালে Platform নিজে সার্টিফিকেট নেয়। গ্রাহক Domain মুছলে আপনি API দিয়ে Platform থেকেও মুছে দেন।",
            },
            {
              title: "পথ ২, Cloudflare for SaaS (নিজের সার্ভার, Cloudflare সামনে)",
              description:
                "Cloudflare এর এই সেবাটা ঠিক এই কাজের জন্য বানানো। আপনি একবার একটা Fallback Origin ঠিক করেন (আপনার সার্ভারের দিকে একটা Proxied Record), আর একটা CNAME Target। প্রতিটা গ্রাহকের Domain এর জন্য আপনার Backend Cloudflare এর Custom Hostnames API ডাকে। উত্তরে আসে একটা মালিকানা যাচাইয়ের TXT (নাম শুরু হয় _cf-custom-hostname দিয়ে) আর অবস্থা। গ্রাহক CNAME বসালে Cloudflare নিজে সার্টিফিকেট নেয়, আর Traffic আপনার সার্ভারে পাঠায়। সাথে প্রতিটা গ্রাহকের Domain এ Cloudflare এর ঢাল আর Cache ও পাওয়া যায়। মূল নাম (A Record দিয়ে) জোড়ার জন্য একটা আলাদা সুবিধা লাগে, নাম Apex Proxying।",
            },
            {
              title: "পথ ৩, নিজের সার্ভারে On-Demand TLS (পুরো নিয়ন্ত্রণ)",
              description:
                "Caddy Web server এ On-Demand TLS নামে একটা সুবিধা আছে। একটা অচেনা নামে প্রথম Request এলে Caddy সেই মুহূর্তে সেই নামের সার্টিফিকেট নিয়ে নেয়, কয়েক সেকেন্ডে। কিন্তু যে কেউ যেকোনো Domain আপনার IP তে দেখিয়ে আপনাকে দিয়ে হাজার হাজার সার্টিফিকেট নেওয়াতে পারে, তাই একটা পাহারা বাধ্যতামূলক। Caddy প্রতিটা নতুন নামের জন্য আগে আপনার App এর একটা গোপন ঠিকানায় জিজ্ঞেস করে, এই নামটা কি অনুমোদিত। আপনার App Database দেখে হ্যাঁ বা না বলে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "typescript",
          filename: "route-1-platform-api.ts",
          code: `// পথ ১: Vercel এ চলা App। মানগুলো আমরা বানাই না, Platform থেকে নিই।
// Method এর নাম SDK র সংস্করণ ভেদে বদলাতে পারে, নিজের সংস্করণের নির্দেশিকা মিলিয়ে নিন।
import { Vercel } from "@vercel/sdk";

const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN });
const project = process.env.VERCEL_PROJECT_ID!;
const teamId = process.env.VERCEL_TEAM_ID!;

// গ্রাহক Domain যোগ করলেন
export async function addTenantDomain(hostname: string) {
  const added = await vercel.projects.addProjectDomain({
    idOrName: project,
    teamId,
    requestBody: { name: hostname },
  });
  // added.verified === false হলে added.verification এ একটা TXT থাকে,
  // যা গ্রাহককে দেখাতে হবে (Domain টা অন্য Account এ আগে থেকে থাকলে)।
  return added;
}

// গ্রাহক Verify চাপলেন, বা পেছনের কাজটা আবার দেখছে
export async function checkTenantDomain(hostname: string) {
  const result = await vercel.projects.verifyProjectDomain({
    idOrName: project,
    teamId,
    domain: hostname,
  });
  return result.verified;
}

// গ্রাহক Domain মুছলেন, বা Account বন্ধ হলো: Platform থেকেও সরাতেই হবে
export async function removeTenantDomain(hostname: string) {
  await vercel.projects.removeProjectDomain({ idOrName: project, teamId, domain: hostname });
}`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "route-3-Caddyfile",
          code: `{
	# পাহারা: নতুন নামের সার্টিফিকেট নেওয়ার আগে App কে জিজ্ঞেস করুন।
	# Caddy ডাকে  .../internal/domain-allowed?domain=booking.seagulltours.example
	# App 200 দিলে সার্টিফিকেট নেয়, অন্য কিছু দিলে নেয় না।
	on_demand_tls {
		ask http://localhost:3000/internal/domain-allowed
	}
}

# নিজের Domain আর সব উপনাম: একটা Wildcard সার্টিফিকেট
islandtours.example, *.islandtours.example {
	tls {
		dns cloudflare {env.CLOUDFLARE_API_TOKEN}
	}
	reverse_proxy localhost:3000
}

# বাকি যেকোনো নাম, মানে গ্রাহকদের Custom Domain: দরকার মতো সার্টিফিকেট
https:// {
	tls {
		on_demand
	}
	reverse_proxy localhost:3000
}`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "typescript",
          filename: "domain-allowed.ts",
          code: `// Caddy র পাহারার প্রশ্নের উত্তর। এটা শুধু সার্ভারের ভেতর থেকে ডাকা যাবে,
// বাইরের দুনিয়া থেকে নয়।
export async function GET(request: Request) {
  const domain = new URL(request.url).searchParams.get("domain")?.toLowerCase();
  if (!domain) return new Response(null, { status: 400 });

  // শুধু সেই নাম, যার মালিকানা যাচাই হয়ে গেছে। একটা দ্রুত, Index করা খোঁজ।
  // এখানে DNS প্রশ্ন বা ধীর কিছু করবেন না, Caddy এই উত্তরের অপেক্ষায় থাকে।
  const allowed = await db.customDomain.existsVerified(domain);

  return new Response(null, { status: allowed ? 200 : 403 });
}`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কোন পথ কখন",
          content: (
            <p>
              App আগে থেকেই একটা Hosting Platform এ থাকলে পথ ১, ভাবার কিছু নেই।
              নিজের সার্ভারে থাকলে আর শুরু করছেন, পথ ৩ সবচেয়ে কম খরচে আর এক ফাইলে
              হয়ে যায়। গ্রাহক সংখ্যা বাড়লে, বা প্রতিটা গ্রাহকের সাইটে আক্রমণ
              ঠেকানো আর গতি দরকার হলে পথ ২। তিনটা পথেই গ্রাহকের অভিজ্ঞতা একই,
              তিনি একটা ছক দেখেন, Record বসান, আর সাইট চালু হয়। তাই পরে এক পথ
              থেকে আরেক পথে যাওয়া সম্ভব, যদি গ্রাহকদের আপনি IP না দিয়ে নিজের CNAME
              Target দিয়ে থাকেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "ui",
      subHeader: { index: "012", title: "The Domain Page" },
      title: <SectionTitle>গ্রাহককে দেখানোর পাতাটা কেমন হবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনার গ্রাহকদের বেশিরভাগ DNS জানেন না। আগের লেসনে আপনি নিজে যে
                বিভ্রান্তিগুলোর মধ্যে দিয়ে গেছেন, তাঁরা ঠিক সেখানেই আটকাবেন। তাই
                Domain জোড়ার পাতাটা যত ভালো বানাবেন, সহায়তার অনুরোধ তত কম আসবে।
                ভালো পাতায় এই জিনিসগুলো থাকে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা পরিষ্কার ছক:</strong> তিন কলাম, Type, Name, Value।
                  ঠিক যে শব্দগুলো DNS সেবাগুলো ব্যবহার করে। প্রতিটা মানের পাশে
                  একটা Copy বোতাম।
                </ListItem>
                <ListItem>
                  <strong>Name এ শুধু সামনের অংশ:</strong> booking লিখুন, পুরো নাম
                  নয়, কারণ বেশিরভাগ DNS পাতায় সেটাই বসাতে হয়। নিচে ছোট করে পুরো
                  নামটাও দেখান, যাতে সন্দেহ না থাকে।
                </ListItem>
                <ListItem>
                  <strong>মূল নাম নাকি উপনাম, নিজে বুঝে নিন:</strong> গ্রাহক মূল
                  নাম দিলে A Record দেখান, উপনাম দিলে CNAME। এটা বোঝা ফোঁটা গুনে
                  হয় না। seagulltours.co.uk এ দুইটা ফোঁটা, তবু এটা মূল নাম। এর
                  জন্য Public Suffix List নামে একটা সর্বজনীন তালিকা আছে, আর সেটা
                  পড়ার তৈরি Library আছে। নিজে নিয়ম লিখতে যাবেন না।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা সারির নিজের অবস্থা:</strong> CNAME পাওয়া গেছে,
                  TXT পাওয়া যায়নি, এভাবে আলাদা করে। আর ব্যর্থ হলে লিখুন আপনি কী
                  পেয়েছেন।
                </ListItem>
                <ListItem>
                  <strong>চেনা ভুলের আগাম সতর্কতা:</strong> Cloudflare ব্যবহার
                  করলে Proxy বন্ধ রাখুন। একই নামে আগের A বা AAAA থাকলে মুছুন। CAA
                  Record থাকলে আমাদের সার্টিফিকেট সংস্থা যোগ করুন।
                </ListItem>
                <ListItem>
                  <strong>সময়ের সৎ ধারণা:</strong> সাধারণত কয়েক মিনিট, কখনো কয়েক
                  ঘণ্টা। আর লিখে দিন, আপনি পাতা বন্ধ করতে পারেন, চালু হলে আমরা
                  ইমেইল করব।
                </ListItem>
                <ListItem>
                  <strong>উপনামটা চালু রাখুন:</strong> Custom Domain চালু হওয়ার
                  আগে আর পরেও seagull.islandtours.example কাজ করুক। চালু হওয়ার
                  পর উপনাম থেকে Custom Domain এ Redirect করুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "গ্রাহককে উপনাম ব্যবহার করতে উৎসাহ দিন",
          content: (
            <p>
              পাতায় উদাহরণ হিসেবে সবসময় একটা উপনাম দেখান, যেমন
              booking.yourcompany.com বা www.yourcompany.com। উপনামে CNAME চলে,
              তাই আপনি স্থায়ী নাম দিতে পারেন, গ্রাহকের ইমেইল বা অন্য Record এ হাত
              পড়ে না, আর ভুলের সুযোগ সবচেয়ে কম। মূল নাম চাইলে গ্রাহককে দুইটা পথ
              দিন। তাঁর DNS সেবা CNAME Flattening বা ALIAS সমর্থন করলে মূল নামে
              আপনার CNAME Target ই বসানো যায়। না করলে A Record, আর সাথে www এর
              একটা CNAME।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "security",
      subHeader: { index: "013", title: "Security" },
      title: <SectionTitle>নিরাপত্তার ছয়টা ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>যাচাই ছাড়া Domain চালু করা:</strong> মালিকানার TXT যাচাই
                বাদ দিলে, পড়ে থাকা CNAME ওয়ালা যেকোনো Domain অন্য গ্রাহক দখল করতে
                পারেন। প্রতিটা Domain যোগে নতুন সংকেত, আর সংকেত না মিললে চালু নয়।
              </ListItem>
              <ListItem>
                <strong>গ্রাহক চলে গেলে Domain রেখে দেওয়া:</strong> Account বন্ধ
                হলে বা Domain মুছলে Database এর সারি, Platform এর নিবন্ধন আর
                সার্টিফিকেট, তিনটাই মুছুন। নাহলে পুরনো নামে পুরনো সাইট দেখাতে
                থাকবে, অথবা পরে অন্য কেউ সেই নামটা নিয়ে নেবে।
              </ListItem>
              <ListItem>
                <strong>পাহারা ছাড়া On-Demand TLS:</strong> যে কেউ হাজার Domain
                আপনার IP তে দেখিয়ে আপনার সার্টিফিকেট নেওয়ার সীমা শেষ করে দিতে
                পারে। তখন আসল গ্রাহকরা সার্টিফিকেট পাবেন না। পাহারার ঠিকানা
                বাধ্যতামূলক।
              </ListItem>
              <ListItem>
                <strong>অচেনা নামে ডিফল্ট গ্রাহক:</strong> নাম থেকে গ্রাহক না
                পেলে সবসময় 404। একটা ডিফল্ট গ্রাহক দেখানো মানে এক গ্রাহকের তথ্য
                অন্য নামে ফাঁস।
              </ListItem>
              <ListItem>
                <strong>সব উপনামে ভাগ করা Cookie:</strong> Login এর Cookie যদি
                পুরো .islandtours.example এর জন্য বসান, তাহলে প্রতিটা গ্রাহকের
                উপনাম সেই Cookie পড়তে পারে। গ্রাহকরা নিজের পাতায় নিজের JavaScript
                বসাতে পারলে এক গ্রাহক অন্যের Login চুরি করতে পারবেন। Cookie সবসময়
                ঠিক সেই এক নামের জন্য বসান। বড় Platform গুলো এই কারণে গ্রাহকদের
                উপনামের জন্য সম্পূর্ণ আলাদা একটা Domain রাখে।
              </ListItem>
              <ListItem>
                <strong>সংরক্ষিত আর ঠকানো নাম:</strong> admin, support, login,
                billing, www এর মতো উপনাম আটকান, আর নিজের নামের কাছাকাছি নামও।
                নাহলে একজন গ্রাহক support.islandtours.example নিয়ে আপনার অন্য
                গ্রাহকদের ঠকাতে পারেন।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "সার্টিফিকেট নেওয়ার সীমা, আর কেন Wildcard দরকার",
          content: (
            <p>
              বিনা খরচের সার্টিফিকেট সংস্থা একটা নিবন্ধিত Domain এর জন্য সপ্তাহে
              একটা নির্দিষ্ট সংখ্যার বেশি সার্টিফিকেট দেয় না। Custom Domain এ এটা
              সমস্যা নয়, কারণ প্রতিটা গ্রাহকের Domain আলাদা, প্রত্যেকের নিজের
              সীমা। কিন্তু উপনামে এটা বড় সমস্যা। seagull, coral, bluewave, সবই
              আপনার একটাই Domain এর নিচে। প্রতিটার আলাদা সার্টিফিকেট নিলে কয়েক
              ডজন গ্রাহকের পরেই সীমায় ঠেকবেন। এই কারণেই উপনামে সবসময় একটা Wildcard
              সার্টিফিকেট, আর আলাদা সার্টিফিকেট শুধু Custom Domain এ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "debugging",
      subHeader: { index: "014", title: "Debugging" },
      title: <SectionTitle>গ্রাহকের Domain খুলছে না, কোন স্তরে সমস্যা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একজন গ্রাহক লিখলেন, Record বসিয়েছি, সাইট খুলছে না। তিন স্তর ধরে ক্রমে
              পরীক্ষা করুন। প্রতিটা স্তরের জন্য এমন একটা কমান্ড আছে যা বাকি স্তরগুলো
              বাদ দিয়ে শুধু সেই স্তরটা দেখে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "debug-tenant-domain.sh",
          code: `H=booking.seagulltours.example          # গ্রাহকের Domain
T=customers.islandtours.example         # আপনার CNAME Target
IP=103.94.135.2                         # আপনার সার্ভার

# ---------- স্তর ১, DNS: নামটা কি আপনার দিকে আসে? ----------
dig +short CNAME $H @1.1.1.1            # $T আসা চাই
dig +short A     $H @1.1.1.1            # শেষে $IP আসা চাই, আর শুধু সেটাই
dig +short AAAA  $H @1.1.1.1            # ফাঁকা থাকা চাই (পুরনো IPv6 নয়)
dig +short TXT _islandtours-verify.$H @1.1.1.1    # আপনার সংকেত
dig +short CAA seagulltours.example @1.1.1.1      # সার্টিফিকেট আটকাচ্ছে না তো

# Cloudflare এর IP এলে গ্রাহক Proxy চালু রেখেছেন
whois $(dig +short A $H @1.1.1.1 | head -1) | grep -i orgname

# ---------- স্তর ৩, App: DNS আর সার্টিফিকেট বাদ দিয়ে শুধু App ----------
# সরাসরি সার্ভারে, শুধু Host বলে দিয়ে। গ্রাহকের সাইট এলে App ঠিক আছে।
curl -s -H "Host: $H" http://$IP | head -5
#   404 এলে: Database এ নামটা নেই বা active নয়

# ---------- স্তর ২, সার্টিফিকেট: DNS বাদ দিয়ে শুধু সার্টিফিকেট ----------
echo | openssl s_client -connect $IP:443 -servername $H 2>/dev/null \\
  | openssl x509 -noout -subject -issuer -dates
#   subject এ গ্রাহকের নাম না থাকলে সার্টিফিকেট এখনো আসেনি

# ---------- সব একসাথে, DNS পাশ কাটিয়ে ----------
curl -sI --resolve $H:443:$IP https://$H | head -3
#   এটা চলে অথচ সাধারণভাবে চলে না: সমস্যা শুধু গ্রাহকের DNS এ`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>DNS এ অন্য IP বা দুইটা IP:</strong> গ্রাহকের পুরনো A বা
                AAAA রয়ে গেছে। মুছতে বলুন।
              </ListItem>
              <ListItem>
                <strong>DNS এ Cloudflare এর IP:</strong> গ্রাহক Record টা Proxied
                রেখেছেন। DNS only করতে বলুন।
              </ListItem>
              <ListItem>
                <strong>TXT নেই, কিন্তু গ্রাহক বলছেন বসিয়েছেন:</strong> Name এ
                পুরো Domain লিখেছেন, ফলে নামটা দুইবার জুড়ে গেছে। পুরো নামটা dig
                করে দেখান।
              </ListItem>
              <ListItem>
                <strong>DNS ঠিক, সার্টিফিকেট নেই:</strong> CAA আটকাচ্ছে, অথবা
                পাহারার ঠিকানা না বলছে কারণ অবস্থা এখনো verified নয়, অথবা
                সার্টিফিকেটের সীমা শেষ।
              </ListItem>
              <ListItem>
                <strong>সব ঠিক, তবু 404:</strong> App নামটা চেনে না। Database এ
                নামটা বড় হাতের অক্ষরে বা www সহ রাখা, অথচ Request আসছে অন্য রূপে।
              </ListItem>
              <ListItem>
                <strong>www তে চলে, মূল নামে চলে না:</strong> গ্রাহক শুধু একটা
                জুড়েছেন। দুইটাই আলাদা Domain, দুইটাই আলাদা করে যোগ করতে হয়।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, এবার একটা Platform</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এখন অন্য ট্যুর কোম্পানিদের জন্য একটা বুকিং Platform।
                পুরো নকশাটা এক জায়গায় সাজালে দাঁড়ায় এরকম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা কোম্পানি Account খুললেই পায়:</strong>{" "}
                  নাম.islandtours.example। DNS এ একটা Wildcard A Record, সার্ভারে
                  একটা Wildcard সার্টিফিকেট, DNS Challenge দিয়ে নেওয়া।
                </ListItem>
                <ListItem>
                  <strong>টাকার Plan এ Custom Domain:</strong> কোম্পানি নিজের
                  Domain লেখে। App দেখায় একটা CNAME, যার লক্ষ্য
                  customers.islandtours.example, আর একটা যাচাইয়ের TXT।
                </ListItem>
                <ListItem>
                  <strong>যাচাই:</strong> একটা পেছনের কাজ পাঁচ মিনিট পরপর
                  অপেক্ষমাণ Domain গুলো দেখে। TXT মিললে verified, CNAME মিললে
                  সার্টিফিকেটের জন্য প্রস্তুত।
                </ListItem>
                <ListItem>
                  <strong>সার্টিফিকেট:</strong> Caddy র On-Demand TLS, পাহারার
                  ঠিকানা শুধু verified Domain কে হ্যাঁ বলে।
                </ListItem>
                <ListItem>
                  <strong>App:</strong> প্রতিটা Request এ Host পড়ে গ্রাহক বের
                  করে। অচেনা নামে 404। Login এর Cookie শুধু সেই এক নামের জন্য।
                </ListItem>
                <ListItem>
                  <strong>কোম্পানি চলে গেলে:</strong> Domain এর সারি আর
                  সার্টিফিকেট মোছা হয়, আর কোম্পানিকে মনে করিয়ে দেওয়া হয় নিজের DNS
                  থেকে CNAME টা সরাতে।
                </ListItem>
                <ListItem>
                  <strong>বুকিং এর ইমেইল:</strong> শুরুতে সব কোম্পানির ইমেইল যায়
                  Platform এর নিজের Domain থেকে। কোম্পানি নিজের নামে পাঠাতে চাইলে
                  একই গল্প আবার: App এর ইমেইল সেবার API কে বলা এই Domain যোগ করুন,
                  সে DKIM এর Record দেয়, App সেগুলো কোম্পানিকে দেখায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "নিয়মটা সবসময় একই, শুধু আসন বদলায়",
          content: (
            <p>
              আগের লেসন আর এই লেসন আসলে একই গল্পের দুই পাশ। একটা সেবা নিজের
              সার্ভারের ঠিকানা আর একটা এলোমেলো সংকেত গ্রাহককে দেয়। গ্রাহক সেগুলো
              নিজের DNS এ বসান। সেবা DNS দেখে মিলিয়ে নেয়, আর নাম দেখে গ্রাহক চিনে
              নেয়। আপনি যখন Domain কিনে কোথাও জোড়েন, আপনি গ্রাহক। আপনি যখন
              Platform বানান, আপনি সেবা। এমনকি আপনার Platform নিজে যখন আরেকটা
              Hosting এ চলে, তখন আপনি একসাথে দুইটাই, Hosting এর কাছে গ্রাহক, আর
              নিজের গ্রাহকদের কাছে সেবা। এই একটা ছবি মাথায় থাকলে Domain নিয়ে আর
              কোনো পরিস্থিতিই অচেনা লাগবে না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>গ্রাহকের Domain এ একটা Request, শুরু থেকে শেষ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একজন পর্যটক booking.seagulltours.example খুললেন। Domain টা চালু,
              active। এবার পথটা, তিন স্তর ধরে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Resolver গ্রাহকের DNS এ যায়",
              description:
                "পর্যটকের Resolver seagulltours.example এর Name Server কে জিজ্ঞেস করে। উত্তর আসে একটা CNAME, customers.islandtours.example। এই Record টা Seagull Tours নিজে বসিয়েছিল, আপনার দেওয়া মান দিয়ে।",
            },
            {
              title: "Resolver আপনার DNS এ যায়",
              description:
                "CNAME একটা নাম, তাই Resolver এবার islandtours.example এর Name Server কে জিজ্ঞেস করে customers এর A কী। উত্তর 103.94.135.2। এই Record টা আপনার, আর এটাই একমাত্র জায়গা যা সার্ভার বদলালে বদলাতে হয়।",
            },
            {
              title: "Browser সংযোগ খোলে, নামটা বলে",
              description:
                "Browser 103.94.135.2 এর Port 443 এ সংযোগ করে, আর সংযোগের একদম শুরুতে জানায় সে booking.seagulltours.example চায়। সার্ভার এই নাম দেখে ঠিক করে কোন সার্টিফিকেট দেখাবে।",
            },
            {
              title: "সার্ভার সঠিক সার্টিফিকেট দেখায়",
              description:
                "এই নামের সার্টিফিকেট আগে থেকেই নেওয়া, কারণ Domain চালু হওয়ার সময় নেওয়া হয়েছিল। Browser মিলিয়ে দেখে, তালার চিহ্ন দেখায়।",
            },
            {
              title: "App নাম থেকে গ্রাহক বের করে",
              description:
                "Request App এ পৌঁছায়, Host Header এ booking.seagulltours.example। App দেখে নামটা নিজের Domain এর নিচে নয়, তাই Custom Domain এর তালিকায় খোঁজে, আর পায়, এটা Seagull Tours এর, অবস্থা active।",
            },
            {
              title: "Seagull Tours এর সাইট দেখায়",
              description:
                "App শুধু Seagull Tours এর ট্যুর, দাম আর রঙ দিয়ে পাতা বানিয়ে পাঠায়। পর্যটক জানতেও পারেন না পেছনে Island Tours এর Platform আছে। তাঁর চোখে এটা Seagull Tours এর নিজের সাইট।",
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
                <strong>নিজের যন্ত্রে বানিয়ে দেখুন</strong>, নিচের Lab এর প্রথম
                পরীক্ষায় এক লাইনের একটা সার্ভার দিয়ে পুরো ধারণাটা চালু করা যায়,
                কোনো Domain না কিনে।
              </ListItem>
              <ListItem>
                <strong>Vercel Docs, Multi-tenant platforms</strong>, Wildcard আর
                Custom Domain এর পুরো নির্দেশিকা, API র উদাহরণ সহ।{" "}
                <a
                  href="https://vercel.com/docs/platforms/multi-tenant-platforms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  vercel.com/docs/platforms/multi-tenant-platforms
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare for SaaS</strong>, Custom Hostname, Fallback
                Origin আর যাচাইয়ের ধাপ।{" "}
                <a
                  href="https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developers.cloudflare.com/cloudflare-for-platforms
                </a>
              </ListItem>
              <ListItem>
                <strong>Caddy Docs, On-Demand TLS</strong>, নিজের সার্ভারে গ্রাহকের
                Domain এর স্বয়ংক্রিয় সার্টিফিকেট।{" "}
                <a
                  href="https://caddyserver.com/docs/automatic-https#on-demand-tls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  caddyserver.com/docs/automatic-https
                </a>
              </ListItem>
              <ListItem>
                <strong>Public Suffix List</strong>, কোন নামটা মূল নাম তা জানার
                সর্বজনীন তালিকা।{" "}
                <a
                  href="https://publicsuffix.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  publicsuffix.org
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
                Multi-tenant App এ কোড একটা, গ্রাহক অনেক। ঠিকানা দুই ধরনের: আপনার
                Domain এর নিচে উপনাম, আর গ্রাহকের নিজের Custom Domain।
              </ListItem>
              <ListItem>
                প্রতিটা ঠিকানায় তিন স্তর ঠিক হতে হয়: DNS (নাম সার্ভারে পৌঁছায়),
                HTTPS (সেই নামের সার্টিফিকেট), App (নাম থেকে গ্রাহক)।
              </ListItem>
              <ListItem>
                <strong>Wildcard Record</strong> (Name এ *) এক সারিতে সব উপনাম
                ঢাকে। নির্দিষ্ট Record আগে জেতে, মূল নাম এর বাইরে, আর যে নাম আগে
                থেকে আছে সেখানে কাজ করে না।
              </ListItem>
              <ListItem>
                <strong>Wildcard সার্টিফিকেট</strong> পেতে DNS Challenge লাগে,
                মানে DNS এ লেখার ক্ষমতা। এই কারণেই Hosting Name Server চায়। এটা
                ঢাকে শুধু এক স্তর।
              </ListItem>
              <ListItem>
                App গ্রাহক চেনে <strong>Host Header</strong> পড়ে। অচেনা নামে
                সবসময় 404। সংরক্ষিত উপনাম আটকান।
              </ListItem>
              <ListItem>
                গ্রাহককে দেওয়ার Record আপনি বানান: নিজের একটা স্থায়ী{" "}
                <strong>CNAME Target</strong>, মূল নামের জন্য একটা স্থায়ী IP, আর
                Backend এর বানানো একটা এলোমেলো যাচাইয়ের সংকেত। Platform এ চললে
                প্রথম দুইটা আসে Platform এর API থেকে।
              </ListItem>
              <ListItem>
                গ্রাহককে IP নয়, নিজের নাম দিন। তাহলে সার্ভার বদলালে কাউকে কিছু
                করতে হয় না।
              </ListItem>
              <ListItem>
                যাচাই দুই রকম: TXT দিয়ে মালিকানা, CNAME বা A দিয়ে পথ। TXT বাদ
                দিলে পড়ে থাকা CNAME দিয়ে Domain দখল সম্ভব।
              </ListItem>
              <ListItem>
                Custom Domain এর সার্টিফিকেট প্রতিটার আলাদা, তিন পথে: Platform এর
                API, Cloudflare for SaaS, বা নিজের সার্ভারে On-Demand TLS পাহারা
                সহ।
              </ListItem>
              <ListItem>
                গ্রাহক চলে গেলে Domain, নিবন্ধন আর সার্টিফিকেট মুছুন। Cookie শুধু
                এক নামের জন্য।
              </ListItem>
              <ListItem>
                এখানেই DNS মডিউল শেষ। পরের মডিউল: Browser এর হাতে এখন একটা IP।
                সেই IP তে পৌঁছে একটা নির্ভরযোগ্য সংযোগ কীভাবে তৈরি হয়, TCP/IP আর
                Transport Layer।
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
        <span className="font-bold text-primary">Multi-tenant</span>,
        "একটা App, অনেক গ্রাহক, প্রত্যেকের নিজের ঠিকানা",
      ],
      [
        <span className="font-bold text-primary">Wildcard Record</span>,
        "Name এ *, যে উপনামের নিজের Record নেই তার উত্তর",
      ],
      [
        <span className="font-bold text-primary">Wildcard সার্টিফিকেট</span>,
        "এক স্তরের সব উপনাম ঢাকে, পেতে DNS Challenge লাগে",
      ],
      [
        <span className="font-bold text-primary">DNS Challenge</span>,
        "_acme-challenge এ TXT বসিয়ে DNS এর নিয়ন্ত্রণ প্রমাণ",
      ],
      [
        <span className="font-bold text-primary">Host Header</span>,
        "Browser যে নামটা চেয়েছে, App এটা পড়ে গ্রাহক চেনে",
      ],
      [
        <span className="font-bold text-primary">CNAME Target</span>,
        "আপনার নিজের একটা স্থায়ী নাম, যার দিকে সব গ্রাহক CNAME করেন",
      ],
      [
        <span className="font-bold text-primary">যাচাইয়ের সংকেত</span>,
        "Backend এর বানানো এলোমেলো লেখা, গ্রাহক TXT এ বসান",
      ],
      [
        <span className="font-bold text-primary">On-Demand TLS</span>,
        "অচেনা নামের সার্টিফিকেট দরকার মতো নেওয়া, পাহারার ঠিকানা সহ",
      ],
      [
        <span className="font-bold text-primary">Cloudflare for SaaS</span>,
        "গ্রাহকের Domain এর সার্টিফিকেট আর Proxy, API দিয়ে",
      ],
      [
        <span className="font-bold text-primary">Public Suffix List</span>,
        "কোন নাম মূল নাম আর কোনটা উপনাম, তা জানার তালিকা",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "আপনার Zone এ api নামে একটা A Record আছে, আর একটা Wildcard A Record আছে। api.islandtours.example কোন IP পাবে?",
        options: [
          {
            key: "A",
            text: "api এর নিজের Record এর IP",
            isCorrect: true,
            explanation:
              "ঠিক। নির্দিষ্ট Record সবসময় Wildcard এর উপরে জেতে। Wildcard শুধু সেই নামের জন্য যার নিজের কিছু নেই।",
          },
          {
            key: "B",
            text: "Wildcard এর IP",
            isCorrect: false,
            explanation: "Wildcard শুধু তখন উত্তর দেয় যখন নামটার নিজের কোনো Record নেই।",
          },
          {
            key: "C",
            text: "দুইটাই, পালা করে",
            isCorrect: false,
            explanation: "না, দুইটা মেশে না।",
          },
        ],
      },
      {
        id: 2,
        text: "Wildcard সার্টিফিকেট নিতে Hosting কেন বলে তাদের Name Server ব্যবহার করুন?",
        options: [
          {
            key: "A",
            text: "Wildcard সার্টিফিকেটের জন্য DNS এ একটা TXT বসিয়ে প্রমাণ দিতে হয়, আর প্রতি নবায়নে আবার, তাই তাদের DNS এ লেখার ক্ষমতা লাগে",
            isCorrect: true,
            explanation:
              "ঠিক। এটাই DNS Challenge। Name Server তাদের হলে তারা নিজেরাই TXT বসাতে আর মুছতে পারে।",
          },
          {
            key: "B",
            text: "তাদের Name Server দ্রুত",
            isCorrect: false,
            explanation: "গতির ব্যাপার নয়, নিয়ন্ত্রণের ব্যাপার।",
          },
          {
            key: "C",
            text: "Wildcard Record শুধু তাদের DNS এই বসে",
            isCorrect: false,
            explanation: "Wildcard Record যেকোনো DNS সেবায় বসে। সমস্যাটা সার্টিফিকেটের।",
          },
        ],
      },
      {
        id: 3,
        text: "সব গ্রাহকের উপনাম একই সার্ভারের একই App এ আসে। App কীভাবে বোঝে কোন গ্রাহকের তথ্য দেখাতে হবে?",
        options: [
          {
            key: "A",
            text: "Request এর Host Header পড়ে, যেখানে Browser এর চাওয়া নামটা থাকে",
            isCorrect: true,
            explanation:
              "ঠিক। DNS নামকে IP বানায়, কিন্তু Browser সার্ভারে পৌঁছে আবার নামটা বলে। App সেটা পড়ে গ্রাহক খোঁজে।",
          },
          {
            key: "B",
            text: "পর্যটকের IP দেখে",
            isCorrect: false,
            explanation: "পর্যটকের IP র সাথে গ্রাহকের কোনো সম্পর্ক নেই।",
          },
          {
            key: "C",
            text: "DNS প্রতিটা গ্রাহককে আলাদা IP দেয়",
            isCorrect: false,
            explanation: "Wildcard এ সবাই একই IP পায়।",
          },
        ],
      },
      {
        id: 4,
        text: "গ্রাহক নিজের Domain জুড়তে চান। তাঁকে দেওয়ার CNAME এর লক্ষ্যটা আপনি কোথা থেকে পাবেন?",
        options: [
          {
            key: "A",
            text: "Registrar এর কাছ থেকে",
            isCorrect: false,
            explanation: "Registrar এর এতে কোনো ভূমিকা নেই।",
          },
          {
            key: "B",
            text: "আপনি নিজে বানান: নিজের Domain এর নিচে একটা স্থায়ী নাম, যা নিজের DNS এ নিজের সার্ভারের দিকে দেখানো",
            isCorrect: true,
            explanation:
              "ঠিক। এটাই CNAME Target। App একটা Hosting Platform এ চললে এই মানটা Platform এর API থেকে নিতে হয়, কারণ সার্ভার তাদের।",
          },
          {
            key: "C",
            text: "গ্রাহকের DNS সেবা থেকে",
            isCorrect: false,
            explanation: "গ্রাহকের DNS সেবা শুধু Record রাখে, মান দেয় না।",
          },
        ],
      },
      {
        id: 5,
        text: "গ্রাহককে সরাসরি IP না দিয়ে CNAME Target দেওয়া ভালো কেন?",
        options: [
          {
            key: "A",
            text: "সার্ভার বদলালে শুধু নিজের একটা A Record বদলালেই হয়, কোনো গ্রাহককে কিছু করতে হয় না",
            isCorrect: true,
            explanation:
              "ঠিক। IP দিলে সেটা হাজার গ্রাহকের DNS এ ছড়িয়ে যায়, আর বদলানো প্রায় অসম্ভব হয়ে পড়ে।",
          },
          {
            key: "B",
            text: "CNAME সবসময় দ্রুত",
            isCorrect: false,
            explanation: "CNAME এ বরং একটা বাড়তি ধাপ লাগে।",
          },
          {
            key: "C",
            text: "IP দিয়ে HTTPS হয় না",
            isCorrect: false,
            explanation: "A Record দিয়েও HTTPS দিব্যি হয়।",
          },
        ],
      },
      {
        id: 6,
        text: "CNAME তো পথ প্রমাণ করেই। তবু TXT দিয়ে মালিকানা যাচাই করা দরকার কেন?",
        options: [
          {
            key: "A",
            text: "চলে যাওয়া গ্রাহকের পড়ে থাকা CNAME এখনো আপনার দিকে দেখায়। TXT ছাড়া অন্য কেউ সেই Domain নিজের Account এ যোগ করে দখল করতে পারে",
            isCorrect: true,
            explanation:
              "ঠিক। পথের যাচাই শুধু বলে Traffic আপনার কাছে আসে। TXT বলে যিনি যোগ করছেন তাঁর হাতেই DNS।",
          },
          {
            key: "B",
            text: "TXT ছাড়া সার্টিফিকেট নেওয়া যায় না",
            isCorrect: false,
            explanation: "একটা নামের সার্টিফিকেট HTTP পরীক্ষা দিয়েই নেওয়া যায়।",
          },
          {
            key: "C",
            text: "দরকার নেই, CNAME ই যথেষ্ট",
            isCorrect: false,
            explanation: "এটাই সেই ভুল ধারণা যা Domain দখলের সুযোগ তৈরি করে।",
          },
        ],
      },
      {
        id: 7,
        text: "নিজের সার্ভারে On-Demand TLS চালু করলেন, কিন্তু পাহারার (ask) ঠিকানা দিলেন না। ঝুঁকি কী?",
        options: [
          {
            key: "A",
            text: "যে কেউ অসংখ্য Domain আপনার IP তে দেখিয়ে আপনার সার্টিফিকেটের সীমা শেষ করে দিতে পারে",
            isCorrect: true,
            explanation:
              "ঠিক। তখন আসল গ্রাহকদের সার্টিফিকেট আটকে যাবে। পাহারার ঠিকানা শুধু যাচাই করা Domain কে হ্যাঁ বলে।",
          },
          {
            key: "B",
            text: "সার্টিফিকেট ধীরে আসবে",
            isCorrect: false,
            explanation: "গতি নয়, অপব্যবহারই ঝুঁকি।",
          },
          {
            key: "C",
            text: "কোনো ঝুঁকি নেই",
            isCorrect: false,
            explanation: "Caddy নিজেই এটাকে বাধ্যতামূলক বলে।",
          },
        ],
      },
      {
        id: 8,
        text: "গ্রাহকের Domain এ dig ঠিক আপনার IP দিচ্ছে, সার্টিফিকেটও ঠিক, কিন্তু সাইটে 404। কোন স্তরে সমস্যা?",
        options: [
          {
            key: "A",
            text: "DNS",
            isCorrect: false,
            explanation: "DNS ঠিক IP দিচ্ছে।",
          },
          {
            key: "B",
            text: "সার্টিফিকেট",
            isCorrect: false,
            explanation: "সার্টিফিকেট ঠিক আছে।",
          },
          {
            key: "C",
            text: "App, সে এই নাম থেকে গ্রাহক খুঁজে পাচ্ছে না",
            isCorrect: true,
            explanation:
              "ঠিক। Database এ নামটা নেই, active নয়, অথবা অন্য রূপে রাখা (বড় হাতের অক্ষর বা www সহ)।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Multi-tenant ঠিকানা, নিজের হাতে আর বাইরের দুনিয়ায়",
    subtitle: "Terminal এ ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের যন্ত্রে একটা Multi-tenant সার্ভার",
        description:
          "এক লাইনের সার্ভার চালিয়ে দেখুন একই সার্ভার Host দেখে আলাদা গ্রাহক চেনে।",
      },
      {
        title: "বাইরের দুনিয়ায় Wildcard DNS",
        description:
          "বড় Platform গুলোর Domain এ যেকোনো এলোমেলো উপনাম dig করে Wildcard নিজের চোখে দেখুন।",
      },
      {
        title: "Wildcard সার্টিফিকেট",
        description:
          "একটা Platform এর সার্টিফিকেট খুলে দেখুন তাতে তারকা সহ নামটা লেখা।",
      },
      {
        title: "একটা আসল Custom Domain এর শিকল",
        description:
          "একটা দোকানের নিজের Domain থেকে Platform এর CNAME Target পর্যন্ত পথটা পড়ুন।",
      },
      {
        title: "এক IP, অনেক সাইট",
        description:
          "একই IP তে দুইটা আলাদা নাম পাঠিয়ে দেখুন সার্ভার দুইটা আলাদা সাইট দেয়।",
      },
      {
        title: "যাচাইয়ের কোড চালান",
        description:
          "Node দিয়ে একটা আসল Domain এর TXT আর CNAME পড়ুন, ঠিক যেভাবে আপনার Backend পড়বে।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-local-multi-tenant.sh",
        language: "bash",
        code: `# Terminal ১: সার্ভার
node -e 'require("http").createServer((q,s)=>s.end("tenant: "+q.headers.host.split(".")[0]+"\\n")).listen(3000)'

# Terminal ২: তিন রকম নাম, একই সার্ভার
curl http://seagull.localhost:3000
curl http://coral.localhost:3000
curl -H "Host: booking.seagulltours.example" http://127.0.0.1:3000

# Browser এ http://seagull.localhost:3000 খুলেও দেখুন।
# কোনো DNS, কোনো Domain ছাড়াই আপনি তৃতীয় স্তরটা বানিয়ে ফেললেন।`,
      },
      {
        filename: "2-wildcard-in-the-wild.sh",
        language: "bash",
        code: `# এমন নাম যা নিশ্চিতভাবেই কেউ বানায়নি, তবু উত্তর আসে
dig +short ei-nam-keu-banayni-98123.vercel.app
dig +short ei-nam-keu-banayni-98123.netlify.app
dig +short ei-nam-keu-banayni-98123.github.io

# প্রতিটায় IP আসছে, মানে একটা Wildcard Record আছে।
# DNS বলছে না নামটা কোনো গ্রাহকের কি না। সেটা বলবে App:
curl -sI https://ei-nam-keu-banayni-98123.vercel.app | head -1     # 404`,
      },
      {
        filename: "3-wildcard-certificate.sh",
        language: "bash",
        code: `echo | openssl s_client -connect vercel.app:443 -servername demo.vercel.app 2>/dev/null \\
  | openssl x509 -noout -ext subjectAltName
#   DNS:*.vercel.app   একটা সার্টিফিকেট, সব গ্রাহকের উপনাম

# কে দিয়েছে, আর মেয়াদ কত দিন
echo | openssl s_client -connect vercel.app:443 -servername demo.vercel.app 2>/dev/null \\
  | openssl x509 -noout -issuer -dates`,
      },
      {
        filename: "4-real-custom-domain.sh",
        language: "bash",
        code: `# একটা দোকান, যেটা Shopify তে চলে কিন্তু নিজের Domain এ
dig +noall +answer www.allbirds.com
#   www.allbirds.com.     CNAME   shops.myshopify.com.
#   shops.myshopify.com.  A       23.227.38.74
#
# shops.myshopify.com হলো Shopify র CNAME Target।
# লক্ষ লক্ষ দোকান এই একই নামের দিকে CNAME করে।

# একটা সাইট, যেটা Vercel এ চলে নিজের Domain এ
dig +noall +answer www.nextjs.org
#   CNAME এর লক্ষ্যটা vercel-dns.com এর নিচের একটা নাম।`,
      },
      {
        filename: "5-one-ip-many-sites.sh",
        language: "bash",
        code: `# একটা Platform এর একটা IP নিন
IP=$(dig +short A vercel.com | head -1); echo $IP

# সেই একই IP তে দুইটা আলাদা নাম বলুন
curl -sI --resolve vercel.com:443:$IP  https://vercel.com  | grep -i -E "^HTTP|^x-matched-path|^content-length"
curl -sI --resolve nextjs.org:443:$IP  https://nextjs.org  | grep -i -E "^HTTP|^x-matched-path|^content-length"

# একই IP, একই সার্ভার, দুইটা সম্পূর্ণ আলাদা সাইট।
# তফাত শুধু Browser কোন নামটা বলল। এটাই Host দিয়ে গ্রাহক চেনা।`,
      },
      {
        filename: "6-verify-like-a-backend.sh",
        language: "bash",
        code: `# আপনার Backend ঠিক এভাবেই গ্রাহকের DNS পড়বে
node -e '
const dns = require("node:dns/promises");
const r = new dns.Resolver();
r.setServers(["1.1.1.1", "8.8.8.8"]);

r.resolveTxt("_dmarc.github.com")
  .then((recs) => console.log("TXT:", recs.map((chunks) => chunks.join(""))));

r.resolveCname("www.allbirds.com")
  .then((c) => console.log("CNAME:", c, "target মিলল?", c.includes("shops.myshopify.com")));

r.resolveTxt("_islandtours-verify.example.com")
  .catch((e) => console.log("নেই:", e.code));   // ENOTFOUND বা ENODATA, মানে যাচাই হয়নি
'`,
      },
    ],
    tip: "চার আর পাঁচ নম্বর পরীক্ষা পাশাপাশি দেখুন, কারণ এই দুইটা মিলে পুরো লেসন। চার নম্বরে দেখলেন একটা দোকানের নিজের Domain একটা CNAME দিয়ে Platform এর একটা নামের দিকে যায়, যে নামটা Platform নিজে বানিয়েছে আর লক্ষ লক্ষ গ্রাহককে দিয়েছে। পাঁচ নম্বরে দেখলেন একটাই IP দুইটা আলাদা নামে দুইটা আলাদা সাইট দেয়। প্রথমটা DNS এর স্তর, দ্বিতীয়টা App এর স্তর। মাঝখানে শুধু সার্টিফিকেট। এটুকুই পৃথিবীর প্রতিটা Multi-tenant Platform এর ভিত।",
  },
  assignment: {
    title: "Capstone: নিজের Platform এ Custom Domain সুবিধার নকশা",
    time: "১২০ মিনিট",
    difficulty: "Advanced",
    tasks: [
      <span key="1">
        <strong>তিন স্তরের ছক:</strong> দুই ধরনের ঠিকানার (উপনাম আর Custom Domain)
        জন্য তিন স্তরের প্রতিটায় কী লাগে, নিজের ভাষায় একটা ছকে লিখুন। ছবি না দেখে।
      </span>,
      <span key="2">
        <strong>পাঁচটা Platform এর জরিপ:</strong> পাঁচটা চেনা Platform (Blog,
        দোকান বা Website বানানোর সেবা) নিন। প্রতিটার জন্য বের করুন, গ্রাহকের
        উপনাম কোন Domain এর নিচে, সেখানে Wildcard আছে কি না, আর একটা আসল Custom
        Domain খুঁজে তার CNAME Target কী।
      </span>,
      <span key="3">
        <strong>নিজের দিকের প্রস্তুতি লিখুন:</strong> ধরুন আপনার Platform এর
        Domain myplatform.example, সার্ভার একটাই। নিজের DNS এ কোন কোন Record
        বসাবেন (মূল সাইট, Wildcard, CNAME Target), আর কোন কোন মান Configuration
        এ রাখবেন, তালিকা করুন।
      </span>,
      <span key="4">
        <strong>গ্রাহকের পাতা নকশা করুন:</strong> কাগজে Custom Domain পাতাটা আঁকুন।
        একজন গ্রাহক shop.acme.example লিখলে তিনি কী দেখবেন, আর acme.example লিখলে
        কী দেখবেন। ছক, Copy বোতাম, প্রতিটা সারির অবস্থা, আর অন্তত তিনটা আগাম
        সতর্কবার্তা রাখুন।
      </span>,
      <span key="5">
        <strong>জীবনচক্র আর Database:</strong> একটা Domain এর সব অবস্থা আর এক
        অবস্থা থেকে আরেকটায় যাওয়ার শর্ত একটা ছবিতে আঁকুন। তারপর Database এর ছকটা
        লিখুন, প্রতিটা ঘরের পাশে এক লাইনে কারণ।
      </span>,
      <span key="6">
        <strong>পাঁচটা দুর্ঘটনা:</strong> প্রতিটার স্তর, প্রথম কমান্ড আর সমাধান
        লিখুন। (ক) গ্রাহকের Domain এ সার্টিফিকেটের সতর্কবার্তা। (খ) গ্রাহকের
        Domain এ অন্য গ্রাহকের সাইট দেখাচ্ছে। (গ) Verify চাপলে সবসময় ব্যর্থ, অথচ
        গ্রাহক Cloudflare এ Record বসিয়েছেন। (ঘ) নতুন গ্রাহকদের উপনামে হঠাৎ
        সার্টিফিকেট আসছে না। (ঙ) চলে যাওয়া গ্রাহকের Domain এ এখনো পুরনো সাইট।
      </span>,
      <span key="7">
        <strong>শেখান (১৫ মিনিটের পাঠ):</strong> একজন সহকর্মীকে, যিনি Backend
        জানেন কিন্তু DNS জানেন না, বোঝানোর জন্য একটা পাঠ লিখুন: গ্রাহককে দেওয়ার
        Record কোথা থেকে আসে, আর কেন TXT যাচাই বাদ দেওয়া যাবে না।
      </span>,
    ],
    deliverables: [
      <span key="1">দুই ধরনের ঠিকানার তিন স্তরের ছক</span>,
      <span key="2">পাঁচ Platform এর উপনাম, Wildcard আর CNAME Target</span>,
      <span key="3">নিজের DNS এর Record তালিকা আর Configuration এর মান</span>,
      <span key="4">Custom Domain পাতার নকশা, দুই অবস্থায়</span>,
      <span key="5">জীবনচক্রের ছবি আর Database এর ছক</span>,
      <span key="6">পাঁচ দুর্ঘটনার স্তর, কমান্ড আর সমাধান</span>,
      <span key="7">সহকর্মীর জন্য ১৫ মিনিটের পাঠ</span>,
    ],
  },
};
