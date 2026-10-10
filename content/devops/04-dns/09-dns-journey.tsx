/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  DebugTreeLab,
  JourneyScenarioLab,
} from "../../../components/course/topics/dns/journey-animations";
import {
  FullJourneyDiagram,
  WhoHoldsWhatDiagram,
} from "../../../components/course/topics/dns/journey-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const dnsJourneyContent: TopicData = {
  id: "dns-journey",
  introduction: {
    badge: "MODULE 04 · LESSON 09",
    title: <SectionTitle>একটা নাম, পুরো পথ, এক সুতায়</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই মডিউলের শুরুতে একটা সরল প্রশ্ন ছিল, Browser এ একটা নাম লিখলে কম্পিউটার
          কীভাবে জানে কোথায় যেতে হবে? তখন উত্তরটা ছিল এক লাইনের, DNS নাম থেকে IP
          বের করে দেয়। আটটা লেসন পরে আপনি জানেন সেই এক লাইনের পেছনে আসলে কত কিছু
          ঘটে।
        </ContentParagraph>
        <ContentParagraph>
          কিন্তু টুকরোগুলো আলাদা আলাদা শিখেছেন। Registrar এক লেসনে, Resolver
          আরেকটায়, TTL আরেকটায়, Record আরেকটায়। এই শেষ লেসনে নতুন কোনো ধারণা নেই।
          এখানে শুধু সব টুকরো এক সুতায় গাঁথা হবে, যাতে পুরো ছবিটা একবারে মাথায়
          বসে যায়।
        </ContentParagraph>
        <ContentParagraph>
          আমরা একটা নামকে অনুসরণ করব, Enter চাপা থেকে IP পাওয়া পর্যন্ত, প্রতিটা
          ধাপে থেমে দেখব কে কী করছে আর কোন লেসনে সেটা শিখেছিলেন। তারপর দেখব এই
          যাত্রা কোথায় কোথায় ভাঙে আর কীভাবে ধরতে হয়। আর শেষে একটা Domain কে শূন্য
          থেকে পুরো চালু করার সম্পূর্ণ তালিকা, যেটা আপনি বাস্তব কাজে হাতের কাছে
          রাখতে পারবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "এক সেকেন্ডের দশ ভাগের এক ভাগ সময়ে আপনার প্রশ্নটা হয়তো তিনটা মহাদেশ ঘুরে আসে। আর বেশিরভাগ সময় সে কোথাও যায়ই না, কারণ উত্তরটা আগে থেকেই আপনার পকেটে।",
      author: "DNS",
      role: "Lesson 09",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "map",
      subHeader: { index: "001", title: "The Whole Map" },
      title: <SectionTitle>পুরো মানচিত্র, এক ছবিতে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আগে পুরো মানচিত্রটা একবার দেখে নিন। এই মডিউলে আলাদা আলাদা যত ছবি
              দেখেছেন, সব এখানে এক জায়গায়। প্রতিটা বাক্স আপনার চেনা। এবার শুধু দেখুন
              তারা একটার সাথে আরেকটা কীভাবে জোড়া লাগে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FullJourneyDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "তিনটা দল, তিনটা কাজ",
          content: (
            <p>
              ছবিটা তিন ভাগে পড়ুন। বাঁ দিকে যারা জিজ্ঞেস করে, আপনার Browser,
              Operating System আর Router। মাঝখানে যে খোঁজে, Recursive Resolver।
              ডান দিকে যারা জানে, Root, TLD আর Authoritative। জিজ্ঞেস করা, খোঁজা,
              জানা। পুরো DNS এই তিন কাজের ভাগাভাগি, আর প্রতিটা দল পরের দলের কাজ
              কমাতে নিজের কাছে একটা খাতা রাখে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "cast",
      subHeader: { index: "002", title: "The Cast" },
      title: <SectionTitle>কার কাছে কী থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              উপরের ছবিটা দেখায় প্রশ্নটা কোন পথে যায়। কিন্তু Domain এর মালিক
              হিসেবে আপনার জন্য আরেকটা প্রশ্ন বেশি জরুরি, কোন তথ্যটা কার কাছে
              থাকে, আর সেটা বদলাতে হলে আমাকে কোথায় যেতে হবে। এই ছকটা মুখস্থ না,
              বুঝে রাখুন। DNS এর অর্ধেক ভুল এড়ানো যায় শুধু এটা জানা থাকলে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhoHoldsWhatDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>তিনটা আলাদা কোম্পানি হতে পারে:</strong> Domain কিনেছেন
                এক জায়গা থেকে (Registrar), DNS চলছে আরেক জায়গায় (যেমন Cloudflare),
                আর সাইট বসানো তৃতীয় জায়গায় (Hosting)। তিনটা আলাদা Login, তিনটা
                আলাদা পাতা। আবার তিনটাই এক কোম্পানিতেও হতে পারে।
              </ListItem>
              <ListItem>
                <strong>শিকলটা উপর থেকে নিচে:</strong> Registrar এ লেখা Name
                Server ঠিক করে কোন DNS সেবাকে জিজ্ঞেস করা হবে। সেই DNS সেবায় লেখা
                Record ঠিক করে কোন সার্ভারে যাওয়া হবে। উপরের ধাপ ভুল হলে নিচের ধাপে
                আপনি যা-ই লিখুন, কেউ পড়বে না।
              </ListItem>
              <ListItem>
                <strong>Resolver আপনার নয়:</strong> বাকি সব জায়গায় আপনি কিছু
                বদলাতে পারেন, Resolver এ পারেন না। সেখানে শুধু আপনার লেখার নকল
                থাকে, নিজের মেয়াদ নিয়ে।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "before",
      subHeader: { index: "003", title: "Before the Journey" },
      title: <SectionTitle>যাত্রা শুরুর আগে মালিককে যা করে রাখতে হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একজন পর্যটক নাম লিখে সাইটে পৌঁছাতে পারেন শুধু তখনই, যখন মালিক আগে
                থেকে একটা শিকলের চারটা আংটা জুড়ে রেখেছেন। একটা আংটা বাদ পড়লে পুরো
                যাত্রা সেখানে গিয়ে থামে। পর্যটকের যাত্রা দেখার আগে তাই মালিকের
                দিকটা একবার সাজিয়ে নিই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "LINK",
          steps: [
            {
              title: "নামটা নিবন্ধন করা (লেসন ২)",
              description:
                "একটা Registrar এর মাধ্যমে নামটা কেনা হয়েছে। Registrar সেটা Registry র খাতায় তুলে দিয়েছে। এখন পৃথিবীতে এই নামটা আপনার, যতদিন নবায়ন করবেন।",
            },
            {
              title: "Name Server ঠিক করা (লেসন ৩, ৭)",
              description:
                "Registrar এ লেখা আছে এই Domain এর Name Server কারা। Registrar সেই নামগুলো TLD server এ পৌঁছে দিয়েছে। এখন TLD জানে প্রশ্ন এলে কার দিকে পাঠাতে হবে।",
            },
            {
              title: "Record বসানো (লেসন ৬)",
              description:
                "সেই Name Server যে DNS সেবার, সেখানে A, CNAME, MX আর TXT Record বসানো হয়েছে, প্রতিটা নিজের TTL নিয়ে। এখন Authoritative server জানে কোন প্রশ্নের কী উত্তর।",
            },
            {
              title: "সার্ভার চালু রাখা",
              description:
                "A Record এ যে IP লেখা, সেখানে সত্যিই একটা সার্ভার চালু আছে আর সাইটটা দিচ্ছে। DNS শুধু ঠিকানা বলে। ঠিকানায় গিয়ে কেউ না থাকলে DNS এর কিছু করার নেই।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "DNS এর কাজ শেষ হয় IP দেওয়ায়",
          content: (
            <p>
              একটা সীমারেখা মনে গেঁথে রাখুন। DNS এর দায়িত্ব শুধু নাম থেকে IP বের
              করে দেওয়া। সেই IP তে সার্ভার চালু আছে কি না, সাইট ঠিকঠাক চলছে কি
              না, HTTPS কাজ করছে কি না, এগুলোর কোনোটাই DNS এর ব্যাপার নয়। তাই dig
              ঠিক IP দিলে DNS এর কাজ শেষ, আর এরপরের সমস্যা খুঁজতে হবে অন্য জায়গায়।
              এই সীমাটা জানা থাকলে ভুল জায়গায় ঘণ্টার পর ঘণ্টা খুঁজতে হয় না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "journey",
      subHeader: { index: "004", title: "The Journey" },
      title: <SectionTitle>Enter চাপা থেকে IP পাওয়া, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার মূল যাত্রা। একজন পর্যটক ঢাকায় বসে, বাসার WiFi তে, জীবনে প্রথমবার
              Browser এ www.islandtours.example লিখে Enter চাপলেন। ধরে নিন কোথাও
              কোনো Cache নেই, যাতে প্রতিটা ধাপ দেখা যায়। প্রতিটা ধাপের পাশে লেখা
              আছে কোন লেসনে সেটা বিস্তারিত শিখেছিলেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Browser ঠিকানাটা ভাঙে",
              description:
                "Browser লেখাটা থেকে শুধু নামের অংশটা আলাদা করে, www.islandtours.example। সামনের https আর পেছনের পথের অংশ DNS এর কাজে লাগে না। DNS শুধু নামটা নিয়ে কাজ করে।",
            },
            {
              title: "Browser নিজের খাতা দেখে (লেসন ৫)",
              description:
                "Browser এর নিজের একটা ছোট DNS Cache আছে। প্রথমবার বলে সেখানে কিছু নেই। সে Operating System কে জিজ্ঞেস করে। (Secure DNS চালু থাকলে সে এই ধাপ থেকেই সরাসরি একটা DoH Resolver এর কাছে যেত, লেসন ৪।)",
            },
            {
              title: "Operating System দেখে hosts ফাইল আর নিজের Cache (লেসন ৫, ৮)",
              description:
                "Stub Resolver আগে hosts ফাইল দেখে, সেখানে এই নামের কোনো লাইন নেই। তারপর নিজের Cache, সেখানেও নেই। তখন সে প্রশ্নটা পাঠায় সেই DNS ঠিকানায়, যেটা DHCP দিয়েছিল, মানে Router এ, 192.168.1.1, UDP র Port 53 দিয়ে।",
            },
            {
              title: "Router এগিয়ে দেয় (লেসন ৪)",
              description:
                "Router একজন Forwarder। সে নিজের ছোট Cache দেখে, পায় না, আর প্রশ্নটা NAT করে পাঠিয়ে দেয় ISP র Recursive Resolver এর কাছে। এই প্রশ্নটা Recursive, মানে পুরো উত্তর চাই।",
            },
            {
              title: "Resolver নিজের খাতা দেখে (লেসন ৪, ৫)",
              description:
                "Resolver দেখে এই নামের উত্তর, বা অন্তত পথের কোনো অংশ, খাতায় আছে কি না। আমাদের গল্পে কিছুই নেই। সে Root Hints থেকে একটা Root server বেছে নিয়ে Iterative হাঁটা শুরু করে।",
            },
            {
              title: "Root বলে TLD কোথায় (লেসন ৩)",
              description:
                "Resolver Root কে জিজ্ঞেস করে। Root নামটার একদম শেষ অংশ দেখে, .example, আর বলে, আমি জানি না, তবে .example এর দায়িত্বে এই TLD server গুলো। এটা একটা Referral। Resolver সেটা দুই দিনের জন্য খাতায় তোলে।",
            },
            {
              title: "TLD বলে Name Server কারা (লেসন ২, ৩)",
              description:
                "Resolver TLD server কে জিজ্ঞেস করে। TLD তার খাতায় দেখে, যে তথ্য Registrar বসিয়েছিল, আর বলে, islandtours.example এর Name Server এই দুইজন। আরেকটা Referral। এটাও খাতায় ওঠে।",
            },
            {
              title: "Authoritative দেয় আসল Record (লেসন ৩, ৬)",
              description:
                "Resolver সেই Name Server কে জিজ্ঞেস করে, www.islandtours.example এর A Record কী? উত্তর আসে, www একটা CNAME, আসল নাম islandtours.example। Resolver তখন সেই নামের A চায়, আর পায় 103.94.135.2, TTL ৩৬০০।",
            },
            {
              title: "উত্তর ফেরে, সবাই মনে রাখে (লেসন ৫)",
              description:
                "Resolver CNAME আর A দুইটাই খাতায় তুলে উত্তরটা Router কে দেয়। Router নিজের Cache এ রেখে Operating System কে দেয়। Operating System নিজের Cache এ রেখে Browser কে দেয়। Browser ও নিজের খাতায় তোলে। চার জায়গায় চারটা নকল, প্রতিটা নিজের মেয়াদ নিয়ে।",
            },
            {
              title: "DNS এর কাজ শেষ, আসল সংযোগ শুরু",
              description:
                "Browser এর হাতে এখন একটা IP। সে 103.94.135.2 এর Port 443 এ সংযোগ খোলে। এখান থেকে শুরু হয় TCP, TLS আর HTTP র গল্প, যেটা পরের মডিউলগুলো। পুরো DNS অংশটা লাগল মোটামুটি এক সেকেন্ডের দশ ভাগের এক ভাগ।",
            },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "five-journeys",
      subHeader: { index: "005", title: "Five Journeys" },
      title: <SectionTitle>বাস্তবে যাত্রাটা প্রায়ই অনেক ছোট</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              উপরের দশ ধাপ হলো সবচেয়ে লম্বা সম্ভাব্য যাত্রা, যখন কারো কিছু জানা
              নেই। বাস্তবে পথের কোনো না কোনো খাতায় উত্তরটা প্রায় সবসময় থাকে, আর
              যাত্রা সেখানেই থেমে যায়। নিচে একই নামের পাঁচ রকম যাত্রা দেখুন, আর
              খেয়াল করুন কোনটায় কোন ধাপ বাদ পড়ে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JourneyScenarioLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একটা পাতা খুলতে একটা নয়, অনেক নাম খুঁজতে হয়",
          content: (
            <p>
              একটা আধুনিক Website খুললে Browser শুধু একটা নাম খোঁজে না। পাতার
              ভেতরে ছবি আসে একটা নাম থেকে, Font আরেকটা থেকে, বিশ্লেষণের কোড
              আরেকটা থেকে, Payment এর বোতাম আরেকটা থেকে। একটা পাতায় দশ থেকে বিশটা
              আলাদা নাম থাকা স্বাভাবিক, আর প্রতিটার জন্য একটা করে DNS খোঁজ। এই
              কারণেই Cache এত জরুরি। এগুলোর বেশিরভাগ খুব জনপ্রিয় নাম, তাই প্রায়
              সবসময় কোনো না কোনো খাতায় পাওয়া যায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "variations",
      subHeader: { index: "006", title: "Variations" },
      title: <SectionTitle>যাত্রার চারটা চেনা রূপভেদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মূল পথটা সবসময় একই, কিন্তু শেষের দিকে উত্তরটা কেমন হবে তা নির্ভর
                করে মালিক Record কীভাবে সাজিয়েছেন তার উপর। চারটা রূপ আপনি বারবার
                দেখবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সোজা A Record:</strong> নাম থেকে সরাসরি একটা IP। সবচেয়ে
                  সরল, এক প্রশ্নে শেষ।
                </ListItem>
                <ListItem>
                  <strong>CNAME হয়ে:</strong> নামটা আরেকটা নামের ডাকনাম। Resolver
                  কে তখন দ্বিতীয় নামটাও খুঁজতে হয়, আর সেটা অন্য Domain এর হলে
                  তার জন্য আরেকটা আলাদা হাঁটা। Hosting এর দেওয়া নামে CNAME করলে
                  এটাই ঘটে।
                </ListItem>
                <ListItem>
                  <strong>Proxied (Cloudflare এর পেছনে):</strong> যাত্রা হুবহু
                  একই, শুধু উত্তরের IP টা আপনার সার্ভারের নয়, Cloudflare এর।
                  Browser সেখানে যায়, আর Cloudflare ভেতরে ভেতরে আসল সার্ভার থেকে
                  পাতা এনে দেয়।
                </ListItem>
                <ListItem>
                  <strong>একাধিক IP:</strong> বড় সাইট একই নামে কয়েকটা A Record
                  রাখে, আর অনেকে প্রশ্নকারীর জায়গা দেখে আলাদা IP দেয়। তাই ঢাকা
                  আর লন্ডন থেকে একই নাম dig করলে আলাদা উত্তর আসতে পারে। এটা ভুল
                  নয়, ইচ্ছা করে করা, যাতে সবাই কাছের সার্ভারে যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "variations.sh",
          code: `# সোজা A Record
dig +noall +answer A example.com

# CNAME হয়ে: প্রথম লাইনে ডাকনাম, তারপর আসল নামের A
dig +noall +answer A www.github.com

# Proxied: IP টা Cloudflare এর
dig +short A discord.com | head -1
whois $(dig +short A discord.com | head -1) | grep -i orgname

# একাধিক IP: একই নামে কয়েকটা উত্তর
dig +short A cloudflare.com

# জায়গা ভেদে আলাদা উত্তর: দুই Resolver, দুই রকম IP হতে পারে
dig +short A www.google.com @1.1.1.1
dig +short A www.google.com @8.8.8.8`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "debug",
      subHeader: { index: "007", title: "When It Breaks" },
      title: <SectionTitle>যাত্রা ভাঙলে, দোষ কার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পুরো মানচিত্রটা জানার সবচেয়ে বড় লাভ এখানে। যাত্রাটা যেহেতু একটা
                শিকল, ভাঙলে সে একটা নির্দিষ্ট আংটায় ভাঙে। আর প্রতিটা আংটা আলাদা
                করে পরীক্ষা করার একটা কমান্ড আপনার জানা। তাই আন্দাজে এদিক ওদিক না
                খুঁজে, ক্রম ধরে একটা একটা আংটা পরীক্ষা করুন।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab টা এই পুরো মডিউলের রোগ নির্ণয়ের জ্ঞান এক জায়গায়। একটা
                সাইট খুলছে না ধরে নিয়ে প্রশ্নগুলোর উত্তর দিন, আর দেখুন কত দ্রুত
                কারণে পৌঁছানো যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DebugTreeLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Browser এর বার্তাটা আগে পড়ুন:</strong> সাইট খুঁজে পাওয়া
                যায়নি (DNS_PROBE_FINISHED_NXDOMAIN) মানে সমস্যা DNS এ। সংযোগ
                প্রত্যাখ্যাত বা সময় শেষ (ERR_CONNECTION_REFUSED, TIMED_OUT) মানে
                DNS ঠিক আছে, সমস্যা সার্ভারে বা পথে। সার্টিফিকেটের সতর্কবার্তা
                মানে DNS আর সংযোগ দুইটাই ঠিক, সমস্যা HTTPS এ।
              </ListItem>
              <ListItem>
                <strong>সবার জন্য, নাকি শুধু আমার জন্য:</strong> অন্য একটা Network
                (যেমন Mobile Data) থেকে চেষ্টা করুন। সেখানে খুললে সমস্যা আপনার
                দিকে, Resolver বা Cache। সব জায়গায় না খুললে সমস্যা Domain এর
                দিকে।
              </ListItem>
              <ListItem>
                <strong>উৎস থেকে নিজের দিকে:</strong> আগের লেসনের সেই ক্রম।
                Authoritative ঠিক বললে বাকিটা Cache। সে ভুল বললে Record ভুল।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "launch",
      subHeader: { index: "008", title: "Launching a Domain" },
      title: <SectionTitle>হাতে কলমে, একটা Domain শূন্য থেকে পুরো চালু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার পুরো মডিউলটাকে একটা কাজের তালিকায় নামিয়ে আনি। ধরুন আজ আপনাকে
              একটা নতুন ব্যবসার Domain শূন্য থেকে চালু করতে হবে, Website আর ইমেইল
              সহ। এই বারো ধাপ ক্রম ধরে করলে কিছু বাদ পড়বে না। প্রতিটা ধাপ আগের
              কোনো লেসনের একটা হাতে কলমে অংশ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "নাম বাছুন আর কিনুন",
              description:
                "একটা পরিচিত Registrar এ নামটা খুঁজে কিনুন। প্রথম বছরের দাম নয়, নবায়নের দাম দেখুন। WHOIS Privacy চালু করুন, যাতে আপনার নাম, ঠিকানা আর ফোন নম্বর খোলা তালিকায় না যায়।",
            },
            {
              title: "Domain টা সুরক্ষিত করুন",
              description:
                "Registrar এর Account এ দুই ধাপের যাচাই (2FA) চালু করুন। Auto Renew চালু করুন আর Card এর মেয়াদ দেখে নিন। Domain Lock (Transfer Lock) চালু রাখুন। মেয়াদ শেষ হয়ে Domain হারানো DNS এর সবচেয়ে ব্যয়বহুল ভুল।",
            },
            {
              title: "DNS কোথায় চলবে ঠিক করুন",
              description:
                "Registrar এর নিজের DNS, নাকি Cloudflare এর মতো আলাদা সেবা, সিদ্ধান্ত নিন। আলাদা সেবা নিলে সেখানে Domain যোগ করে তাদের দেওয়া Name Server দুইটা Registrar এ বসান।",
            },
            {
              title: "Name Server যাচাই করুন",
              description:
                "dig +short NS চালিয়ে দেখুন নতুন Name Server দেখাচ্ছে কি না। dig +trace NS দিয়ে দেখুন TLD আসলে কাকে দেখাচ্ছে। এই ধাপ ঠিক না হলে পরের সব ধাপ অর্থহীন।",
            },
            {
              title: "Website এর Record বসান",
              description:
                "মূল নামে (@) A Record, সার্ভারের IP দিয়ে। www তে একটা CNAME, মূল নামের দিকে। Hosting যদি নিজে মান দেয় (যেমন Vercel), তাদের পাতায় দেখানো মান হুবহু বসান। শুরুতে TTL ৩০০ রাখুন।",
            },
            {
              title: "Hosting এ Domain যোগ করুন",
              description:
                "শুধু DNS এ Record বসালে হয় না। Hosting বা সার্ভারকেও জানাতে হয় যে এই নামের Request তার কাছে আসবে। Hosting এর পাতায় Domain যোগ করুন, অথবা নিজের সার্ভারে Web server এর সেটিংয়ে নামটা বসান।",
            },
            {
              title: "HTTPS চালু করুন",
              description:
                "Hosting সাধারণত নিজেই সার্টিফিকেট বানিয়ে দেয়, DNS ঠিক জায়গায় দেখালে। Cloudflare এর পেছনে হলে SSL/TLS Mode কে Full (strict) করুন। https দিয়ে সাইট খুলে তালার চিহ্ন দেখে নিন।",
            },
            {
              title: "www আর www ছাড়া, দুইটাই পরীক্ষা করুন",
              description:
                "দুই নামেই সাইট খোলা চাই, আর একটা থেকে অন্যটায় নিজে থেকে চলে যাওয়া (Redirect) ভালো, যাতে একই সাইট দুই ঠিকানায় না থাকে। http দিয়ে খুললে https এ চলে যাচ্ছে কি না তাও দেখুন।",
            },
            {
              title: "ইমেইল চালু করুন",
              description:
                "ইমেইল সেবায় Domain যোগ করে চার ধরনের Record বসান: যাচাইয়ের TXT, MX, SPF আর DKIM। তারপর DMARC, শুরুতে p=none দিয়ে। Cloudflare এ হলে ইমেইলের সব Record DNS only।",
            },
            {
              title: "ইমেইল দুই দিকেই পরীক্ষা করুন",
              description:
                "বাইরের একটা ঠিকানা থেকে নিজের Domain এ পাঠান, আর উল্টোটা। পৌঁছানো ইমেইলের Original খুলে দেখুন SPF, DKIM আর DMARC তিনটার পাশেই pass আছে কি না।",
            },
            {
              title: "বাইরে থেকে যাচাই করুন",
              description:
                "@1.1.1.1 আর @8.8.8.8 দিয়ে প্রতিটা Record dig করুন। Mobile Data থেকে সাইট খুলুন। whatsmydns.net এ একবার দেখে নিন। নিজের ল্যাপটপে খুলছে, এটা প্রমাণ নয়।",
            },
            {
              title: "সব লিখে রাখুন, TTL বাড়ান",
              description:
                "কোন Registrar, কোন DNS সেবা, কোন Hosting, কোন ইমেইল সেবা, আর প্রতিটার Login কার কাছে, এক জায়গায় লিখে রাখুন। পুরো Zone এর একটা Export নামিয়ে রাখুন। সব এক সপ্তাহ স্থির চললে TTL বাড়িয়ে ৩৬০০ করুন।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "যে তিনটা জিনিস মানুষ চালুর পরে ভুলে যায়",
          content: (
            <p>
              সাইট খুলে গেলে মানুষ ভাবে কাজ শেষ, আর তিনটা জিনিস পড়ে থাকে, যেগুলো
              মাস খানেক পরে বিপদ হয়ে ফেরে। এক, Domain এর নবায়ন, যেটা এমন একজনের
              ব্যক্তিগত ইমেইলে বাঁধা যিনি পরে চাকরি ছেড়ে গেছেন। দুই, পরীক্ষার সময়
              বানানো উপনামগুলো, যেগুলো এখন কোথাও দেখায় না অথচ DNS এ রয়ে গেছে, আর
              কেউ সেই পুরনো ঠিকানাটা নিয়ে নিলে আপনার নামে নিজের সাইট দেখাতে পারে।
              তিন, DMARC, যেটা p=none এ রেখে আর কখনো কড়া করা হয়নি। চালুর এক মাস
              পরে এই তিনটা দেখার জন্য নিজের Calendar এ একটা তারিখ বসিয়ে রাখুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "cheatsheet",
      subHeader: { index: "009", title: "Cheat Sheet" },
      title: <SectionTitle>পুরো মডিউলের কমান্ড, এক পাতায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলে যত কমান্ড শিখেছেন, কাজ অনুযায়ী সাজিয়ে এক জায়গায়। এই
              পাতাটা Bookmark করে রাখুন। বাস্তব কাজে DNS এর প্রায় সব প্রশ্নের
              উত্তর এই কয়টা কমান্ডেই মেলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "dns-cheatsheet.sh",
          code: `D=islandtours.example

# ---- একটা নামের উত্তর ----
dig +short A $D                    # শুধু IP
dig +noall +answer A $D            # চার ঘর: Name, TTL, Type, Value
dig +short AAAA $D                 # IPv6
dig +short CNAME www.$D            # ডাকনাম
dig +short MX $D                   # ইমেইল সার্ভার
dig +short TXT $D                  # SPF, যাচাইয়ের লেখা
dig +short TXT _dmarc.$D           # DMARC
dig +short NS $D                   # Name Server
dig +short SOA $D                  # Zone এর মলাট, শেষ সংখ্যা Negative TTL
dig +short DS $D                   # DNSSEC চালু কি না

# ---- কাকে জিজ্ঞেস করছি ----
dig $D | grep -E "status|SERVER|Query time"
dig @1.1.1.1 $D                    # নির্দিষ্ট Resolver কে
dig @ns1.dnshost.example $D        # উৎসকে সরাসরি, Cache এড়িয়ে
dig +short TXT o-o.myaddr.l.google.com     # আমার আসল Resolver কে

# ---- পুরো পথ ----
dig +trace $D                      # Root থেকে Authoritative, ধাপে ধাপে
dig +norecurse @a.root-servers.net $D      # নিজে এক ধাপ হাঁটা

# ---- Domain এর তথ্য ----
whois $D | grep -i -E "registrar|expir|name server|status"

# ---- Cache ----
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder   # macOS
ipconfig /flushdns                                               # Windows
sudo resolvectl flush-caches                                     # Linux

# ---- DNS পাশ কাটিয়ে সার্ভার পরীক্ষা ----
curl -sI --resolve $D:443:45.120.8.9 https://$D

# ---- DNS এর পরের ধাপ ঠিক আছে তো ----
curl -sI https://$D | head -5      # সার্ভার সাড়া দিচ্ছে কি না, Header সহ`,
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "project",
      subHeader: { index: "010", title: "Project Example" },
      title: <SectionTitle>Island Tours এর পুরো DNS নকশা</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউল জুড়ে Island Tours এর জন্য আলাদা আলাদা সিদ্ধান্ত নিয়েছেন।
                এবার সেগুলো এক জায়গায় সাজালে পুরো নকশাটা দাঁড়ায় এরকম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Domain:</strong> একটা নির্ভরযোগ্য Registrar এ, Auto
                  Renew, Lock আর 2FA সহ। Account টা ব্যবসার একটা সাধারণ ইমেইলে
                  বাঁধা, কোনো একজন কর্মীর ব্যক্তিগত ইমেইলে নয়।
                </ListItem>
                <ListItem>
                  <strong>DNS:</strong> Cloudflare এ। Name Server দুইটা Registrar
                  এ বসানো, DNSSEC চালু।
                </ListItem>
                <ListItem>
                  <strong>Website:</strong> মূল নামে A, www তে CNAME, দুইটাই
                  Proxied, যাতে ছুটির মৌসুমের ভিড় আর আক্রমণ Cloudflare এ এসে
                  থামে। SSL/TLS Mode Full (strict)।
                </ListItem>
                <ListItem>
                  <strong>API:</strong> api উপনামে আলাদা A Record, যাতে Backend
                  কে আলাদা করে বড় করা বা সরানো যায়, Website না ছুঁয়ে।
                </ListItem>
                <ListItem>
                  <strong>ইমেইল:</strong> আলাদা ইমেইল সেবায়। MX, SPF, DKIM আর
                  DMARC, সব DNS only। বুকিং নিশ্চিতকরণের ইমেইল যেন পর্যটকের Inbox
                  এ পৌঁছায়।
                </ListItem>
                <ListItem>
                  <strong>TTL:</strong> স্থির Record এ ৩৬০০। বড় কোনো বদলের দুই
                  দিন আগে ৩০০।
                </ListItem>
                <ListItem>
                  <strong>নজরদারি:</strong> বাইরের একটা সেবা প্রতি মিনিটে সাইট
                  পরীক্ষা করে, আর Domain এর মেয়াদ শেষ হওয়ার ৩০ দিন আগে সতর্ক
                  করে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "DNS ভাঙলে সব ভাঙে",
          content: (
            <p>
              একটা শেষ কথা, যেটা এই মডিউলের সবচেয়ে বড় শিক্ষা। আপনার সার্ভার যত
              শক্তিশালীই হোক, কোড যত নিখুঁতই হোক, DNS কাজ না করলে একজন পর্যটকও
              পৌঁছাতে পারবেন না। Website, API, ইমেইল, সব একসাথে অদৃশ্য হয়ে যায়।
              অথচ DNS সাধারণত একবার বসিয়ে মানুষ ভুলে যায়। তাই এটাকে হালকাভাবে
              নেবেন না। বদলের আগে নকল রাখুন, একবারে একটা জিনিস বদলান, উৎসে যাচাই
              করুন, আর Domain এর নবায়নকে ব্যবসার সবচেয়ে জরুরি বিলগুলোর একটা
              হিসেবে দেখুন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "resources",
      subHeader: { index: "011", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিজে পুরো যাত্রাটা করুন</strong>, নিচের Lab এ একটা নামকে
                শুরু থেকে শেষ পর্যন্ত অনুসরণ করবেন, প্রতিটা স্তরে থেমে। এটাই এই
                মডিউলের শেষ পরীক্ষা।
              </ListItem>
              <ListItem>
                <strong>How DNS Works (কমিক)</strong>, পুরো যাত্রাটা একটা ছোট
                ছবির গল্পে, খুব সহজ ভাষায়।{" "}
                <a
                  href="https://howdns.works"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  howdns.works
                </a>
              </ListItem>
              <ListItem>
                <strong>Mess with DNS</strong>, একটা খেলার মাঠ, যেখানে আসল একটা
                উপনামে নিজে Record বসিয়ে ভেঙে আর জুড়ে শেখা যায়, কোনো Domain না
                কিনেই।{" "}
                <a
                  href="https://messwithdns.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  messwithdns.net
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare Learning, What is DNS</strong>, পুরো বিষয়ের
                একটা গোছানো পুনরালোচনা।{" "}
                <a
                  href="https://www.cloudflare.com/learning/dns/what-is-dns/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cloudflare.com/learning/dns/what-is-dns
                </a>
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "recap",
      subHeader: { index: "012", title: "Module Recap" },
      title: <SectionTitle>পুরো মডিউল, নয় লাইনে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>লেসন ১, DNS কী:</strong> মানুষ নাম মনে রাখে, যন্ত্র চেনে
                IP। DNS এই দুইয়ের মাঝের ফোনবই।
              </ListItem>
              <ListItem>
                <strong>লেসন ২, Domain, Registrar, Registry:</strong> নাম কেনা
                যায় না, ভাড়া নেওয়া যায়। Registrar এর মাধ্যমে, Registry র খাতায়।
              </ListItem>
              <ListItem>
                <strong>লেসন ৩, Root, TLD, Authoritative:</strong> নাম পড়া হয়
                ডান থেকে বাঁয়ে, তিন স্তরে। আসল Record শুধু Authoritative এ।
              </ListItem>
              <ListItem>
                <strong>লেসন ৪, Recursive Resolver:</strong> আপনার হয়ে যে পুরো
                পথটা হাঁটে আর মনে রাখে। কোনটা ব্যবহার করবেন তা আপনার হাতে।
              </ListItem>
              <ListItem>
                <strong>লেসন ৫, Cache আর TTL:</strong> প্রতিটা উত্তরের একটা মেয়াদ।
                মেয়াদ ঠিক করেন মালিক, আর সেটা গতি আর নমনীয়তার মাঝের দরকষাকষি।
              </ListItem>
              <ListItem>
                <strong>লেসন ৬, Record:</strong> প্রতিটা ধরন একটা প্রশ্নের উত্তর।
                A ঠিকানা, CNAME ডাকনাম, MX ইমেইল, TXT প্রমাণ, NS দায়িত্ব।
              </ListItem>
              <ListItem>
                <strong>লেসন ৭, Cloudflare:</strong> Name Server বদলে DNS সরানো,
                আর কমলা মেঘ, যা শুধু Website এর জন্য।
              </ListItem>
              <ListItem>
                <strong>লেসন ৮, Propagation:</strong> কিছু ছড়ায় না, পুরনো Cache
                মরে। উৎসে যাচাই করুন, তারপর ঘড়ি দেখুন।
              </ListItem>
              <ListItem>
                <strong>লেসন ৯, পুরো যাত্রা:</strong> জিজ্ঞেস করা, খোঁজা, জানা।
                তিন দল, সাত ধাপ, আর প্রতিটা ধাপে একটা খাতা।
              </ListItem>
              <ListItem>
                পরের দুই লেসন পুরোপুরি হাতে কলমে: যেকোনো সেবায় Domain জোড়ার সম্পূর্ণ নির্দেশিকা, আর নিজের App এ গ্রাহকদের Wildcard আর Custom Domain দেওয়া।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["যাত্রার ধাপ", "কে, আর কী করে"],
    rows: [
      [
        <span className="font-bold text-primary">১. Browser</span>,
        "নামটা আলাদা করে, নিজের Cache দেখে",
      ],
      [
        <span className="font-bold text-primary">২. Operating System</span>,
        "hosts ফাইল আর নিজের Cache দেখে, তারপর DNS ঠিকানায় পাঠায়",
      ],
      [
        <span className="font-bold text-primary">৩. Router</span>,
        "Forwarder, প্রশ্নটা আসল Resolver এ এগিয়ে দেয়",
      ],
      [
        <span className="font-bold text-primary">৪. Recursive Resolver</span>,
        "নিজের খাতা দেখে, না থাকলে হাঁটা শুরু করে",
      ],
      [
        <span className="font-bold text-primary">৫. Root</span>,
        "বলে এই TLD এর server কারা",
      ],
      [
        <span className="font-bold text-primary">৬. TLD</span>,
        "বলে এই Domain এর Name Server কারা (Registrar এর দেওয়া তথ্য)",
      ],
      [
        <span className="font-bold text-primary">৭. Authoritative</span>,
        "আসল Record দেয়, TTL সহ",
      ],
      [
        <span className="font-bold text-primary">৮. ফেরা</span>,
        "উত্তর একই পথে ফেরে, প্রতিটা স্তর Cache এ রাখে",
      ],
      [
        <span className="font-bold text-primary">৯. সংযোগ</span>,
        "DNS এর কাজ শেষ, Browser IP তে সংযোগ খোলে",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "প্রথমবার একটা নাম খোঁজার সময় সঠিক ক্রম কোনটা?",
        options: [
          {
            key: "A",
            text: "Browser, Operating System, Router, Resolver, Root, TLD, Authoritative",
            isCorrect: true,
            explanation:
              "ঠিক। প্রথম তিনটা আপনার দিক, তারপর Resolver, তারপর সে উপর থেকে নিচে তিন স্তরে হাঁটে।",
          },
          {
            key: "B",
            text: "Browser, Root, TLD, Authoritative, Resolver",
            isCorrect: false,
            explanation: "Browser সরাসরি Root এ যায় না। হাঁটে Resolver।",
          },
          {
            key: "C",
            text: "Browser, Authoritative, TLD, Root",
            isCorrect: false,
            explanation: "হাঁটা হয় উপর থেকে নিচে, Root আগে।",
          },
        ],
      },
      {
        id: 2,
        text: "TLD server কীভাবে জানে একটা Domain এর Name Server কারা?",
        options: [
          {
            key: "A",
            text: "মালিক Registrar এ যা বসান, Registrar সেটা TLD এর Registry তে পৌঁছে দেয়",
            isCorrect: true,
            explanation:
              "ঠিক। এই কারণেই Name Server বদলাতে হয় Registrar এ, DNS সেবার পাতায় নয়।",
          },
          {
            key: "B",
            text: "সে নিজে Internet ঘেঁটে খুঁজে নেয়",
            isCorrect: false,
            explanation: "না, তথ্যটা Registrar এর মাধ্যমে আসে।",
          },
          {
            key: "C",
            text: "Resolver তাকে বলে দেয়",
            isCorrect: false,
            explanation: "Resolver শুধু জিজ্ঞেস করে, কিছু বসায় না।",
          },
        ],
      },
      {
        id: 3,
        text: "dig ঠিক IP দিচ্ছে, কিন্তু Browser বলছে ERR_CONNECTION_REFUSED। সমস্যা কোথায়?",
        options: [
          {
            key: "A",
            text: "DNS এ",
            isCorrect: false,
            explanation: "DNS তার কাজ শেষ করেছে, ঠিক IP দিয়েছে।",
          },
          {
            key: "B",
            text: "সার্ভারে বা Firewall এ, DNS নির্দোষ",
            isCorrect: true,
            explanation:
              "ঠিক। DNS এর দায়িত্ব IP দেওয়া পর্যন্ত। সেই IP তে কেউ সাড়া না দিলে সমস্যা সার্ভারের দিকে।",
          },
          {
            key: "C",
            text: "Registrar এ",
            isCorrect: false,
            explanation: "Registrar এ সমস্যা হলে dig ঠিক IP দিত না।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা সাইট WiFi তে খোলে না, Mobile Data তে খোলে। সবচেয়ে সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "দুই Network এর Resolver আলাদা, একটার Cache এ পুরনো উত্তর বা সে সাইটটা আটকে রেখেছে",
            isCorrect: true,
            explanation:
              "ঠিক। dig @1.1.1.1 দিয়ে তুলনা করলেই নিশ্চিত হওয়া যায়।",
          },
          {
            key: "B",
            text: "Domain এর মেয়াদ শেষ",
            isCorrect: false,
            explanation: "তা হলে কোনো Network থেকেই খুলত না।",
          },
          {
            key: "C",
            text: "সার্ভার বন্ধ",
            isCorrect: false,
            explanation: "তা হলে Mobile Data তেও খুলত না।",
          },
        ],
      },
      {
        id: 5,
        text: "আপনি এইমাত্র যে সাইটে ছিলেন, তার আরেকটা পাতায় চাপ দিলেন। DNS এর কোন ধাপ পর্যন্ত যাত্রা যায়?",
        options: [
          {
            key: "A",
            text: "Browser এর Cache এই শেষ, কোনো DNS প্রশ্নই বাইরে যায় না",
            isCorrect: true,
            explanation:
              "ঠিক। উত্তরটা Browser এর খাতায় আছে। আপনার দিনের বেশিরভাগ DNS খোঁজ এভাবেই মেটে।",
          },
          {
            key: "B",
            text: "প্রতিবার Root পর্যন্ত",
            isCorrect: false,
            explanation: "তা হলে Internet অসহ্য ধীর হতো।",
          },
          {
            key: "C",
            text: "প্রতিবার Authoritative পর্যন্ত",
            isCorrect: false,
            explanation: "TTL এর মেয়াদ থাকা পর্যন্ত কাউকে জিজ্ঞেস করা হয় না।",
          },
        ],
      },
      {
        id: 6,
        text: "www.islandtours.example একটা CNAME, যা islandtours.example এর দিকে দেখায়। Resolver কে কী করতে হয়?",
        options: [
          {
            key: "A",
            text: "CNAME পেয়ে থেমে যায়",
            isCorrect: false,
            explanation: "CNAME একটা নাম, IP নয়। Browser এর দরকার IP।",
          },
          {
            key: "B",
            text: "CNAME পাওয়ার পর সেই নামের A Record ও খুঁজে IP বের করে",
            isCorrect: true,
            explanation:
              "ঠিক। ডাকনাম থেকে আসল নাম, তারপর আসল নাম থেকে IP। দুইটাই সে Cache এ রাখে।",
          },
          {
            key: "C",
            text: "Browser কে বলে নিজে খুঁজে নিতে",
            isCorrect: false,
            explanation: "Recursive প্রশ্নের উত্তর সবসময় সম্পূর্ণ হয়।",
          },
        ],
      },
      {
        id: 7,
        text: "নতুন Domain চালু করে শুধু A Record বসালেন, কিন্তু Hosting এর পাতায় Domain যোগ করেননি। কী হবে?",
        options: [
          {
            key: "A",
            text: "Request সার্ভারে পৌঁছাবে, কিন্তু সার্ভার এই নাম চেনে না বলে ভুল সাইট বা Error দেখাবে",
            isCorrect: true,
            explanation:
              "ঠিক। DNS শুধু পথ দেখায়। সার্ভারকেও জানতে হয় এই নামের Request এলে কোন সাইট দিতে হবে।",
          },
          {
            key: "B",
            text: "DNS কাজই করবে না",
            isCorrect: false,
            explanation: "DNS ঠিকই IP দেবে, সমস্যা তার পরের ধাপে।",
          },
          {
            key: "C",
            text: "কোনো সমস্যা নেই, সাইট খুলবে",
            isCorrect: false,
            explanation: "একই IP তে অনেক সাইট থাকতে পারে, তাই সার্ভারকে নাম জানাতে হয়।",
          },
        ],
      },
      {
        id: 8,
        text: "Domain এর মালিক হিসেবে নিচের কোনটা আপনি বদলাতে পারেন না?",
        options: [
          {
            key: "A",
            text: "Registrar এ Name Server",
            isCorrect: false,
            explanation: "এটা আপনার হাতে।",
          },
          {
            key: "B",
            text: "DNS সেবায় Record আর TTL",
            isCorrect: false,
            explanation: "এটাও আপনার হাতে।",
          },
          {
            key: "C",
            text: "পর্যটকের Resolver এর Cache এ থাকা পুরনো উত্তর",
            isCorrect: true,
            explanation:
              "ঠিক। সেখানে আপনার কোনো নিয়ন্ত্রণ নেই। আপনি শুধু আগে থেকে TTL ছোট রেখে অপেক্ষাটা কমাতে পারেন।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "একটা নামকে শুরু থেকে শেষ পর্যন্ত অনুসরণ করুন",
    subtitle: "Terminal এ সাতটা পরীক্ষা, মডিউলের শেষ Lab",
    stepName: "LAB",
    steps: [
      {
        title: "মালিকের দিক",
        description:
          "নামটা কোন Registrar এ, কবে মেয়াদ শেষ, আর Name Server কারা, বের করুন।",
      },
      {
        title: "আপনার দিক",
        description:
          "আপনার যন্ত্র কাকে জিজ্ঞেস করে, আর তার পেছনের আসল Resolver কে, বের করুন।",
      },
      {
        title: "পুরো হাঁটা",
        description:
          "Root থেকে Authoritative পর্যন্ত পথটা ধাপে ধাপে দেখুন, আর প্রতিটা ধাপের TTL খেয়াল করুন।",
      },
      {
        title: "পুরো Zone",
        description:
          "নামটার সব ধরনের Record এক জায়গায় বের করে পড়ুন।",
      },
      {
        title: "উৎস আর নকল",
        description:
          "Authoritative এর উত্তর আর আপনার Resolver এর উত্তর মিলিয়ে দেখুন।",
      },
      {
        title: "সময় মাপুন",
        description:
          "Cache ছাড়া আর Cache সহ, একই প্রশ্নে কত সময় লাগে তুলনা করুন।",
      },
      {
        title: "DNS এর পরের ধাপ",
        description:
          "পাওয়া IP তে সংযোগ করে দেখুন সার্ভার সাড়া দেয় কি না, আর পুরো সময়ের কত অংশ DNS এ গেল।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-owner-side.sh",
        language: "bash",
        code: `D=wikipedia.org

whois $D | grep -i -E "registrar:|expir|name server" | head -8
# কোন Registrar, কবে মেয়াদ শেষ, আর Registrar এ লেখা Name Server

dig +short NS $D
# DNS যা বলে। উপরের তালিকার সাথে মেলা চাই।`,
      },
      {
        filename: "2-your-side.sh",
        language: "bash",
        code: `# যন্ত্র কাকে জিজ্ঞেস করে
dig $D | grep SERVER

# তার পেছনের আসল Resolver
dig +short TXT o-o.myaddr.l.google.com

# hosts ফাইলে এই নামের কিছু আছে কি না (থাকার কথা নয়)
grep -i wikipedia /etc/hosts`,
      },
      {
        filename: "3-full-walk.sh",
        language: "bash",
        code: `dig +trace A $D

# উপর থেকে নিচে চারটা ভাগ:
#   .              NS   a.root-servers.net ...   Root Hints থেকে
#   org.           NS   a0.org.afilias-nst.info  Root এর Referral (TTL 172800)
#   wikipedia.org. NS   ns0.wikimedia.org        TLD এর Referral
#   wikipedia.org. A    ...                      Authoritative এর আসল উত্তর
# প্রতিটা ভাগের শেষে লেখা থাকে উত্তরটা কোন server দিল, আর কত ms এ।`,
      },
      {
        filename: "4-whole-zone.sh",
        language: "bash",
        code: `for T in A AAAA MX TXT NS SOA CAA; do
  echo "== $T =="; dig +noall +answer $T $D
done
dig +noall +answer A www.$D
dig +noall +answer TXT _dmarc.$D

# প্রতিটা লাইন পড়ে নিজেকে বলুন, এটা কোন প্রশ্নের উত্তর।`,
      },
      {
        filename: "5-source-vs-copy.sh",
        language: "bash",
        code: `NS=$(dig +short NS $D | head -1)

echo "উৎস:";   dig +noall +answer A $D @$NS
echo "নকল:";   dig +noall +answer A $D
echo "1.1.1.1:"; dig +noall +answer A $D @1.1.1.1

# IP গুলো মিলছে? TTL এর সংখ্যা কোথায় পুরো, কোথায় কমে গেছে?
# flags দেখুন: উৎসের উত্তরে aa থাকে, নকলের উত্তরে থাকে না।
dig A $D @$NS | grep flags
dig A $D      | grep flags`,
      },
      {
        filename: "6-timing.sh",
        language: "bash",
        code: `# Cache এ থাকার সম্ভাবনা কম, এমন একটা নাম
dig archive.org | grep "Query time"     # প্রথমবার, হাঁটতে হতে পারে
dig archive.org | grep "Query time"     # দ্বিতীয়বার, খাতা থেকে

# উৎসকে সরাসরি জিজ্ঞেস করলে কত লাগে (শুধু এক ধাপ)
dig archive.org @$(dig +short NS archive.org | head -1) | grep "Query time"`,
      },
      {
        filename: "7-after-dns.sh",
        language: "bash",
        code: `# পুরো Request এর সময়, ভাগ করে
curl -s -o /dev/null -w "DNS:      %{time_namelookup}s
সংযোগ:    %{time_connect}s
TLS:      %{time_appconnect}s
প্রথম Byte: %{time_starttransfer}s
মোট:      %{time_total}s
" https://$D

# প্রথম লাইনটাই এই পুরো মডিউল। বাকি লাইনগুলো পরের মডিউলগুলোর গল্প।
# আবার চালান। DNS এর সময়টা প্রায় শূন্যে নেমে আসবে, কারণ এবার Cache।`,
      },
    ],
    tip: "সাত নম্বর পরীক্ষাটা দিয়ে মডিউলটা শেষ করুন। curl একটা পুরো Request এর সময়কে ভাগ করে দেখায়, আর প্রথম লাইনটা হলো DNS। প্রথমবার চালালে দেখবেন DNS হয়তো মোট সময়ের একটা লক্ষণীয় অংশ নিচ্ছে। দ্বিতীয়বার চালালে সেটা প্রায় শূন্য। এই দুই সংখ্যার তফাতটাই এই মডিউলের সারকথা, DNS একটা লম্বা যাত্রা, যেটা Cache এর জোরে প্রায় সবসময় এড়ানো যায়। আর নিচের লাইনগুলো, সংযোগ, TLS, প্রথম Byte, সেগুলোই আপনার পরের গন্তব্য।",
  },
  assignment: {
    title: "Capstone: একটা ব্যবসার পুরো DNS, নকশা থেকে রানবুক",
    time: "১২০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>পুরো যাত্রা আঁকুন:</strong> কাগজে বা যেকোনো আঁকার জায়গায় একটা নামের
        পুরো যাত্রা নিজের হাতে আঁকুন, এই লেসনের ছবি না দেখে। প্রতিটা তীরের পাশে
        লিখুন কী জিজ্ঞেস করা হচ্ছে আর কী উত্তর আসছে। তারপর ছবির সাথে মিলিয়ে দেখুন
        কী বাদ পড়ল।
      </span>,
      <span key="2">
        <strong>একটা আসল সাইটের পুরো প্রতিবেদন:</strong> একটা সাইট বেছে নিয়ে Lab এর
        সাতটা পরীক্ষাই চালান। এক পাতায় লিখুন, Registrar কে, DNS কোথায়, Proxied কি
        না, ইমেইল কোথায়, SPF আর DMARC এর অবস্থা, A Record এর TTL, আর DNS খোঁজে
        কত সময় লাগে।
      </span>,
      <span key="3">
        <strong>Island Tours এর Zone লিখুন:</strong> পুরো Record তালিকা লিখুন,
        Website, www, api, admin, ইমেইলের চার ধরন সহ। প্রতিটার পাশে Type, Name,
        Value, TTL, Proxied নাকি DNS only, আর এক লাইনে কারণ।
      </span>,
      <span key="4">
        <strong>চালুর রানবুক:</strong> এই লেসনের বারো ধাপকে নিজের মতো করে একটা
        তালিকায় লিখুন, প্রতিটা ধাপের পাশে যাচাইয়ের কমান্ড। এমনভাবে লিখুন যাতে DNS
        না জানা একজন সহকর্মী সেটা দেখে কাজটা করতে পারেন।
      </span>,
      <span key="5">
        <strong>পাঁচটা দুর্ঘটনা:</strong> নিচের প্রতিটায় সম্ভাব্য কারণ, প্রথম
        কমান্ড আর সমাধান লিখুন। (ক) সাইট হঠাৎ সবার জন্য NXDOMAIN। (খ) সাইট চলছে,
        ইমেইল আসছে না। (গ) সার্ভার বদলেছি, অর্ধেক মানুষ পুরনো সাইট দেখছে। (ঘ)
        Cloudflare চালু করার পর সাইট ঘুরতেই থাকে। (ঙ) dig ঠিক IP দেয়, Browser এ
        সংযোগের সময় শেষ হয়ে যায়।
      </span>,
      <span key="6">
        <strong>নিজের ভাষায় লিখুন (১০ লাইন):</strong> একজন একদম নতুন মানুষকে, যিনি
        IP কী তাও জানেন না, বোঝান Browser এ একটা নাম লিখলে কী ঘটে। কোনো কারিগরি
        শব্দ ব্যাখ্যা ছাড়া ব্যবহার করবেন না। এটা লিখতে পারলে বুঝবেন মডিউলটা সত্যিই
        আপনার হয়ে গেছে।
      </span>,
    ],
    deliverables: [
      <span key="1">নিজের হাতে আঁকা পুরো যাত্রার ছবি</span>,
      <span key="2">একটা আসল সাইটের এক পাতার DNS প্রতিবেদন</span>,
      <span key="3">Island Tours এর পুরো Zone, কারণ সহ</span>,
      <span key="4">বারো ধাপের চালুর রানবুক, যাচাইয়ের কমান্ড সহ</span>,
      <span key="5">পাঁচ দুর্ঘটনার কারণ, প্রথম কমান্ড আর সমাধান</span>,
      <span key="6">নতুন মানুষের জন্য ব্যাখ্যা, ১০ লাইনে</span>,
    ],
  },
};
