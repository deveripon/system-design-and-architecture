/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import { ResolveWalkLab } from "../../../components/course/topics/dns/resolve-animations";
import {
  ConnectWaysSplit,
  NameTreeDiagram,
  TiersDiagram,
} from "../../../components/course/topics/dns/resolve-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const rootTldAuthoritativeDnsContent: TopicData = {
  id: "root-tld-authoritative-dns",
  introduction: {
    badge: "MODULE 04 · LESSON 03",
    title: <SectionTitle>নামটা খুঁজে বের করা হয় যেভাবে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের দুই লেসনে দুইটা কথা জেনেছেন। এক, DNS একটা মোটা বই নয়, অনেক server
          মিলে ছড়ানো একটা বিশাল ব্যবস্থা। দুই, একটা নাম কিনে নিজের করা যায়। কিন্তু
          আসল প্রশ্নটা এখনো বাকি। আপনার Resolver যখন www.islandtours.example
          নামটা হাতে পায়, সে এই বিশাল ছড়ানো ব্যবস্থার মধ্যে ঠিক উত্তরটা খুঁজে পায়
          কীভাবে?
        </ContentParagraph>
        <ContentParagraph>
          উত্তরটা একটা সুন্দর হাঁটা। Resolver একটা গাছের উপর থেকে নিচে নামে, তিনটা
          ধাপে, Root, তারপর TLD, তারপর Authoritative। প্রতিটা ধাপ তাকে উত্তরের এক
          কদম কাছে নিয়ে যায়। এই তিন ধাপের হাঁটাই DNS এর প্রাণ, আর এই লেসনের পুরো
          বিষয়।
        </ContentParagraph>
        <ContentParagraph>
          শুনতে জটিল লাগতে পারে, কিন্তু ভেতরের বুদ্ধিটা খুব সাদামাটা, কেউ পুরোটা
          জানে না, প্রত্যেকে শুধু জানে পরের জন কে। ঠিক যেমন অচেনা শহরে ঠিকানা
          খুঁজতে গিয়ে আপনি একজন থেকে আরেকজনের কাছে যান, আর প্রতিজন একটু কাছে
          পৌঁছে দেয়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "কেউ পুরো Internet এর হিসাব রাখে না। Root জানে TLD কে, TLD জানে Authoritative কে, আর Authoritative জানে আসল উত্তর। তিনজনের ছোট ছোট জানা জোড়া লাগিয়েই দুনিয়ার যেকোনো নাম খুঁজে পাওয়া যায়।",
      author: "DNS",
      role: "Lesson 03",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "name-tree",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা নাম আসলে একটা পথ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমে নামটাকে নতুন চোখে দেখা দরকার। www.islandtours.example কে
                আমরা বাঁ থেকে ডানে পড়ি, কিন্তু DNS এটাকে পড়ে উল্টো দিক থেকে, ডান
                থেকে বাঁয়ে। কারণ নামটা আসলে একটা ঠিকানার মতো সাজানো, বড় এলাকা থেকে
                ছোট বাসার দিকে, শুধু বড় এলাকাটা লেখা আছে ডান দিকে।
              </ContentParagraph>
              <ContentParagraph>
                একটা ডাকঠিকানা ভাবুন, বাসা নম্বর, রাস্তা, শহর, দেশ। চিঠি বিলি শুরু
                হয় দেশ থেকে, তারপর শহর, তারপর রাস্তা, শেষে বাসা। নামের বেলায়ও
                তাই, সবার ডানের অংশ সবচেয়ে বড় এলাকা, আর বাঁ দিকে যেতে যেতে ছোট
                হয়। নামের প্রতিটা ফোঁটা আসলে এক স্তর নিচে নামা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NameTreeDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা লুকানো ফোঁটা, যেটা কেউ লেখে না",
          content: (
            <p>
              মজার ব্যাপার, প্রতিটা নামের একদম শেষে একটা ফোঁটা থাকে, যেটা আমরা লিখি
              না। পুরো নামটা আসলে www.islandtours.example. (শেষে ফোঁটা সহ)। ওই
              শেষের ফোঁটাটাই Root, গাছের একদম গোড়া, যেখান থেকে সব নাম শুরু। আমরা
              রোজকার কাজে এটা বাদ দিই, কিন্তু DNS এর চোখে এটা সবসময় আছে, আর খোঁজা
              শুরু হয় ঠিক এখান থেকেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "three-tiers",
      subHeader: { index: "002", title: "The Three Tiers" },
      title: <SectionTitle>তিন স্তরের server</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নামের প্রতিটা স্তরের জন্য এক ধরনের server আছে, আর প্রত্যেকে জানে শুধু
                নিজের অংশটুকু। কেউ পুরো ছবি জানে না, আর সেটাই এই নকশার সৌন্দর্য।
                তিনজনের পরিচয় নিই।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TiersDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Root Server:</strong> গাছের গোড়া। সে কোনো Website এর IP
                জানে না, জানে শুধু কোন TLD কে চালায়। তাকে .example এর কথা জিজ্ঞেস
                করলে সে বলে দেয় .example এর server গুলো কোথায়। দুনিয়ায় এদের
                প্রায় ১৩টা পরিচয়, যেগুলো আসলে শত শত জায়গায় ছড়িয়ে রাখা।
              </ListItem>
              <ListItem>
                <strong>TLD Server:</strong> একটা TLD এর দায়িত্বে। মনে আছে আগের
                লেসনের Registry? সেই Registry ই এই server চালায়। সেও IP জানে না,
                জানে শুধু কোন Domain এর হিসাব কোন server রাখে।
              </ListItem>
              <ListItem>
                <strong>Authoritative Server:</strong> এটাই শেষ ঠিকানা। এখানে
                নামটার আসল Record লেখা থাকে, কোন নাম কোন IP তে যাবে। এই server কে
                ঠিক করে দেয় Domain এর মালিক নিজে। আসল উত্তর শুধু এখান থেকেই আসে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Referral মানে উত্তর নয়, দিকনির্দেশ",
          content: (
            <p>
              উপরের দুই স্তর, Root আর TLD, যা দেয় সেটাকে বলে Referral। এটা উত্তর
              নয়, এটা একটা দিকনির্দেশ, আমি জানি না, কিন্তু অমুক জানে, তার কাছে
              যান। রাস্তায় কাউকে ঠিকানা জিজ্ঞেস করলে যেমন বলে, আমি ঠিক চিনি না,
              তবে ওই মোড়ের দোকানদার জানবে। সেই দোকানদারের কাছে পাঠিয়ে দেওয়াটাই
              Referral।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "মাত্র ১৩টা Root, তবু কখনো বন্ধ হয় না কেন",
          content: (
            <p>
              ১৩টা শুনে মনে হতে পারে, এগুলো নষ্ট হলে তো পুরো Internet অচল। আসলে
              ১৩টা হলো পরিচয়, যন্ত্রের সংখ্যা নয়। প্রতিটা পরিচয়ের পেছনে দুনিয়ার
              নানা শহরে শত শত যন্ত্র বসানো, সবার ঠিকানা একই। আপনার প্রশ্ন যায়
              সবচেয়ে কাছেরটায়। একটা শহরের যন্ত্র বন্ধ হলে প্রশ্ন চুপচাপ পরের
              কাছেরটায় চলে যায়। এক ঠিকানা, অনেক জায়গা, এই কৌশলের নাম Anycast।
              তাই Root আজ পর্যন্ত কখনো পুরোপুরি বন্ধ হয়নি।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "the-walk",
      subHeader: { index: "003", title: "The Walk" },
      title: <SectionTitle>Resolver এর হাঁটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার পুরো হাঁটাটা একসাথে। হাঁটে আপনার Resolver, সেই DNS server
                যার ঠিকানা DHCP আপনাকে দিয়েছিল। আপনি তাকে একবার জিজ্ঞেস করেন, আর
                সে আপনার হয়ে পুরো খোঁজটা সেরে আসে। এই কারণে তাকে বলে Recursive
                Resolver, মানে যে নিজে ঘুরে ঘুরে উত্তর নিয়ে আসে।
              </ContentParagraph>
              <ContentParagraph>
                সে শুরু করে সবার উপরে, Root এ। Root তাকে পাঠায় TLD এর কাছে, TLD
                পাঠায় Authoritative এর কাছে, আর Authoritative দেয় আসল উত্তর। নিচের
                Lab এ প্রতিটা ধাপে চাপ দিয়ে দেখুন কে কী বলে, আর কখন দিকনির্দেশ
                বদলে আসল উত্তরে পরিণত হয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ResolveWalkLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "আপনি একবার জিজ্ঞেস করেন, Resolver তিনবার",
          content: (
            <p>
              এখানে দুই রকম জিজ্ঞেস করা চলছে, খেয়াল করুন। আপনার যন্ত্র Resolver
              কে বলে, পুরো উত্তরটা এনে দিন, আমি অপেক্ষা করছি। এটাকে বলে Recursive
              প্রশ্ন। আর Resolver যখন Root, TLD আর Authoritative এর কাছে যায়, সে
              প্রতিবার একটু করে এগোয়, একজনের দিকনির্দেশ নিয়ে পরের জনের কাছে।
              এটাকে বলে Iterative প্রশ্ন। নাম দুইটা মুখস্থ না করলেও চলবে, ধারণাটা
              রাখুন, খাটুনিটা Resolver এর, আপনার নয়।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নামটা যদি আদৌ না থাকে",
          content: (
            <p>
              ভুল বানানে একটা নাম লিখলে কী হয়? হাঁটা একইভাবে চলে, কিন্তু কোনো এক
              ধাপে server বলে দেয়, এই নামে কিছু নেই। এই উত্তরের নাম NXDOMAIN,
              মানে নামটার অস্তিত্বই নেই। Browser তখন দেখায় সাইট খুঁজে পাওয়া
              যায়নি। এটা সার্ভার বন্ধ থাকার ভুল থেকে আলাদা। NXDOMAIN মানে সমস্যা
              DNS এ বা বানানে, সার্ভারে নয়। ভুলের বার্তাটা পড়তে জানলে অর্ধেক
              ডিবাগ সেখানেই শেষ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "truth-and-cache",
      subHeader: { index: "004", title: "Truth & Cache" },
      title: <SectionTitle>আসল উত্তর কার, আর এত দ্রুত কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা নামের ব্যাপারে শেষ কথা বলার অধিকার শুধু তার Authoritative
                server এর। সে যা বলে সেটাই সত্য, কারণ আসল Record তার কাছেই। তাই তার
                উত্তরকে বলে Authoritative answer। আপনার Resolver পরে যে উত্তরটা
                মনে রেখে আবার দেয়, সেটা একটা নকল মাত্র, আসলটা নয়।
              </ContentParagraph>
              <ContentParagraph>
                এখন একটা স্বাভাবিক দুশ্চিন্তা, প্রতিটা নামের জন্য তিনটা server ঘুরে
                আসা তো ধীর হওয়ার কথা। বাস্তবে তা হয় না, কারণ Resolver যা শেখে তা
                কিছুক্ষণ মনে রাখে, যাকে বলে Cache। একবার .example এর TLD server
                কোথায় জেনে গেলে, পরের যেকোনো .example নামের জন্য তাকে আর Root এ
                যেতে হয় না। আর একই নাম আবার চাইলে পুরো হাঁটাটাই বাদ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "পুরো হাঁটা আসলে কমই ঘটে",
          content: (
            <p>
              বাস্তবে এই তিন ধাপের পুরো হাঁটা খুব কম সময় লাগে, কারণ জনপ্রিয় নামগুলো
              প্রায় সবসময় কারো না কারো Cache এ থাকে। আপনার Resolver হাজার হাজার
              মানুষের প্রশ্ন সামলায়, তাই একজনের জন্য খুঁজে আনা উত্তর পরের সবার কাজে
              লাগে। এই মনে রাখা কতক্ষণ থাকে, আর কে ঠিক করে, সেটা আসছে দুই লেসন পরে,
              Cache আর TTL।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Authoritative server</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই তিন স্তরের মধ্যে আপনার হাতে থাকে শুধু শেষেরটা। Root আর TLD অন্যরা
                চালায়, কিন্তু Island Tours এর Authoritative server কোনটা হবে আর তাতে
                কী লেখা থাকবে, সেটা পুরোপুরি আপনার সিদ্ধান্ত।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Name Server বসানো:</strong> নাম কেনার পর Registrar এ
                  আপনাকে বলে দিতে হয় এই নামের Authoritative server কোনগুলো,
                  যেগুলোকে বলে Name Server। এই তথ্যটাই TLD server এ গিয়ে বসে, আর
                  সেখান থেকেই সে Resolver কে আপনার দিকে পাঠায়।
                </ListItem>
                <ListItem>
                  <strong>Record আপনার হাতে:</strong> Authoritative server এ আপনি
                  নিজে লেখেন islandtours.example কোন IP তে যাবে। সার্ভার বদলালে
                  শুধু এই একটা লেখা বদলান। কাউকে অনুমতি চাইতে হয় না, কারণ এই
                  স্তরটার মালিক আপনি।
                </ListItem>
                <ListItem>
                  <strong>Name Server ভুল হলে সব অন্ধকার:</strong> একটা চেনা বিপদ,
                  Registrar এ ভুল Name Server বসালে TLD server Resolver কে ভুল
                  জায়গায় পাঠায়, আর আপনার নাম আর খুঁজেই পাওয়া যায় না, যদিও
                  সার্ভার দিব্যি চলছে। সাইট খুলছে না অথচ সার্ভার ঠিক, এমন হলে আগে
                  Name Server মিলিয়ে দেখুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "connect-ways",
      subHeader: { index: "006", title: "Connecting a Domain" },
      title: <SectionTitle>নামকে সাইটের সাথে জোড়া, দুই উপায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার এই লেসনের সবচেয়ে হাতে কলমে অংশ। ধরুন আপনি Registrar থেকে
                islandtours.example কিনেছেন, আর সাইটটা তুলেছেন একটা Hosting এ,
                যেমন Vercel, Netlify বা নিজের একটা Cloud সার্ভার। এই মুহূর্তে নাম
                আর সাইট একে অপরকে চেনেই না। নাম লিখলে কিছু খোলে না, কারণ Resolver
                এর হাঁটা এখনো আপনার সাইট পর্যন্ত পৌঁছায় না।
              </ContentParagraph>
              <ContentParagraph>
                জোড়া লাগানো মানে আসলে একটাই কাজ, হাঁটাটার শেষ ধাপ যেন আপনার
                Hosting এ গিয়ে থামে, সেটা নিশ্চিত করা। আর সেটা করার ঠিক দুইটা
                উপায় আছে। পৃথিবীর প্রায় সব Hosting কোম্পানি এই দুইটার একটা বা
                দুইটাই দেয়, তাই একবার বুঝলে যেকোনো জায়গায় কাজে লাগবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ConnectWaysSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>উপায় ১, Name Server বদলানো:</strong> Registrar এ গিয়ে বলে
                দেন, এই নামের Authoritative server এখন থেকে Hosting কোম্পানির।
                তখন পুরো DNS এর দায়িত্ব Hosting এর, দরকারি Record সে নিজেই বসিয়ে
                নেয়। নতুনদের জন্য সবচেয়ে কম ঝামেলার।
              </ListItem>
              <ListItem>
                <strong>উপায় ২, Record যোগ করা:</strong> Name Server যেখানে আছে
                সেখানেই থাকে। আপনি বর্তমান DNS এ গিয়ে শুধু একটা বা দুইটা Record
                যোগ করেন, যেটা বলে এই নাম Hosting এর অমুক ঠিকানায় যাবে। DNS এর
                নিয়ন্ত্রণ আপনার হাতেই থাকে।
              </ListItem>
              <ListItem>
                <strong>কোনটা কখন:</strong> নামটা নতুন, তাতে ইমেইল বা অন্য কিছু
                চলছে না, তাহলে উপায় ১ সহজ। আর নামে আগে থেকেই ইমেইল বা আরও সাইট
                চললে, বা DNS অন্য কোথাও (যেমন Cloudflare) রাখতে চাইলে, উপায় ২
                নিরাপদ, কারণ বাকি কিছু নড়ে না।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "way-nameserver",
      subHeader: { index: "007", title: "Way 1, Nameservers" },
      title: <SectionTitle>উপায় ১, Name Server বদলে জোড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              উদাহরণ হিসেবে Vercel ধরছি, কিন্তু ধাপগুলো যেকোনো Hosting এ প্রায় একই।
              শুধু মেনুর নাম একটু আলাদা হয়। যে মানগুলো দেখাচ্ছি সেগুলো উদাহরণ,
              আপনি সবসময় নিজের Dashboard এ যা দেখায় ঠিক সেটাই কপি করবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Hosting এ নামটা যোগ করুন",
              description:
                "Hosting এর Dashboard এ আপনার Project খুলে Settings, তারপর Domains এ যান। সেখানে islandtours.example লিখে Add করুন। Hosting এখন জানল এই নামটা এই সাইটের, কিন্তু নামটা এখনো তার দিকে আসছে না, তাই সে দেখাবে সেটিং বাকি।",
            },
            {
              title: "Hosting এর Name Server কপি করুন",
              description:
                "একই পাতায় Hosting তার Name Server গুলো দেখাবে, সাধারণত দুইটা, যেমন ns1.vercel-dns.com আর ns2.vercel-dns.com। এই দুইটাই আপনার নামের নতুন Authoritative server হবে। হুবহু কপি করুন, একটা অক্ষরও যেন না বদলায়।",
            },
            {
              title: "বদলানোর আগে পুরনো Record টুকে নিন",
              description:
                "এটা সবাই ভুলে যায়। পুরনো DNS এ যা যা Record আছে, বিশেষ করে ইমেইলের (MX), সেগুলো লিখে রাখুন আর Hosting এর DNS এ আগে থেকে বসিয়ে দিন। Name Server বদলালে পুরনো DNS এর সব Record অকেজো হয়ে যায়, কারণ তখন আর কেউ সেখানে জিজ্ঞেস করে না।",
            },
            {
              title: "Registrar এ Name Server বদলান",
              description:
                "যেখান থেকে নাম কিনেছেন সেই Registrar এ ঢুকুন। নামটা বেছে Nameservers বা DNS অংশে যান, Custom Nameservers বেছে নিন, পুরনোগুলো মুছে Hosting এর দুইটা বসান, তারপর Save করুন।",
            },
            {
              title: "খবরটা TLD server এ পৌঁছায়",
              description:
                "Registrar এই বদলটা Registry কে জানায়, আর TLD server এখন থেকে Resolver দের নতুন Name Server এর দিকে পাঠায়। এটা কয়েক মিনিটে হতে পারে, আবার পুরনো তথ্য Cache এ থাকলে এক দুই দিনও লাগতে পারে।",
            },
            {
              title: "Hosting যাচাই করে, HTTPS বসায়",
              description:
                "Hosting নিজে থেকে দেখে নেয় নামটা এখন তার দিকে আসছে কি না। এলে Domains পাতায় সবুজ চিহ্ন দেখায়, আর নিজেই একটা HTTPS সার্টিফিকেট বসিয়ে দেয়। এবার নাম লিখলে আপনার সাইট খুলবে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Name Server বদলে ইমেইল বন্ধ, খুব চেনা দুর্ঘটনা",
          content: (
            <p>
              একটা নামের নিচে শুধু Website নয়, ইমেইলের ঠিকানাও লেখা থাকে। Name
              Server বদলালে সেই পুরনো লেখাগুলো নতুন জায়গায় আপনাআপনি যায় না। ফলে
              সাইট দিব্যি খোলে, কিন্তু অফিসের ইমেইল আসা বন্ধ হয়ে যায়, আর কেউ
              বুঝতেই পারে না কেন। তাই নিয়ম একটাই, বদলানোর আগে পুরনো সব Record
              নতুন জায়গায় তুলে নিন, তারপর Name Server বদলান।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "way-records",
      subHeader: { index: "008", title: "Way 2, Records" },
      title: <SectionTitle>উপায় ২, Record যোগ করে জোড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই উপায়ে Name Server ছোঁয়াই হয় না। আপনার নামের Authoritative server
              এখন যেখানে, সেখানে গিয়ে শুধু বলে দেন, এই নাম Hosting এর অমুক ঠিকানায়
              যাবে। প্রথম কাজ তাই জানা, আপনার DNS এখন আসলে কোথায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Hosting এ নামটা যোগ করুন",
              description:
                "আগের মতোই, Project এর Settings এ Domains এ গিয়ে islandtours.example যোগ করুন। সাথে www.islandtours.example ও যোগ করুন, কারণ অনেকে www সহ লেখে, আর দুইটা আলাদা নাম।",
            },
            {
              title: "Hosting কোন Record চায়, দেখে নিন",
              description:
                "Hosting দুইটা জিনিস দেখাবে। মূল নামের জন্য একটা A Record, যার মান একটা IP, যেমন 76.76.21.21। আর www এর জন্য একটা CNAME Record, যার মান Hosting এর একটা নাম, যেমন cname.vercel-dns-0.com। নিজের Dashboard এর মানটাই নিন।",
            },
            {
              title: "আপনার DNS কোথায়, খুঁজে বের করুন",
              description:
                "Record বসাতে হবে সেখানে, যেখানে আপনার Name Server। বেশিরভাগ সময় সেটা Registrar নিজেই। কিন্তু আগে কখনো Cloudflare বা অন্য কোথাও সরিয়ে থাকলে সেখানে। নিশ্চিত হতে নিচের Lab এর Name Server কমান্ডটা চালান।",
            },
            {
              title: "A Record বসান",
              description:
                "DNS এর Records পাতায় নতুন Record যোগ করুন। Type এ A, Name এ @ (এই চিহ্নের মানে মূল নাম নিজে, মানে islandtours.example), আর Value তে Hosting এর দেওয়া IP। আগে থেকে অন্য কোনো A Record থাকলে সেটা মুছে দিন।",
            },
            {
              title: "CNAME Record বসান",
              description:
                "আরেকটা Record যোগ করুন। Type এ CNAME, Name এ www, আর Value তে Hosting এর দেওয়া নামটা। এর মানে, www এর ঠিকানা জানতে চাইলে ওই নামের ঠিকানা দেখুন।",
            },
            {
              title: "Save করে অপেক্ষা, তারপর যাচাই",
              description:
                "Save করুন। কয়েক মিনিটের মধ্যে Hosting নিজে দেখে নেবে Record গুলো ঠিক জায়গায় বসেছে কি না, তারপর সবুজ চিহ্ন দেখাবে আর HTTPS বসাবে। সাথে সাথে না হলে ঘাবড়াবেন না, Cache এর কারণে একটু সময় লাগে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "মূল নামে A, আর www তে CNAME কেন",
          content: (
            <p>
              A Record বলে, এই নামের IP এটা। CNAME বলে, এই নাম আসলে ওই আরেকটা নামের
              ডাকনাম, তার ঠিকানাই এর ঠিকানা। www এর মতো উপনামে CNAME সুবিধার, কারণ
              Hosting পরে নিজের IP বদলালেও আপনাকে কিছু করতে হয় না। কিন্তু মূল নামে
              (শুধু islandtours.example) নিয়ম অনুযায়ী CNAME বসানো যায় না, তাই
              সেখানে সরাসরি IP দিয়ে A Record। Record এর সব ধরন নিয়ে এই মডিউলে
              একটা পুরো লেসন আছে, সেখানে গভীরে যাব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "verify-mistakes",
      subHeader: { index: "009", title: "Verify & Mistakes" },
      title: <SectionTitle>কাজ হলো কি না, আর চেনা ভুলগুলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Browser এ বারবার Refresh করে বোঝার চেষ্টা করবেন না, Browser নিজেও
              পুরনো উত্তর মনে রাখে। তার বদলে সরাসরি DNS কে জিজ্ঞেস করুন। তিনটা
              প্রশ্নের উত্তর মিললেই কাজ শেষ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "verify-domain.sh",
          code: `# ১. Name Server এখন কোনগুলো (উপায় ১ এ এখানে Hosting এর নাম আসা উচিত)
dig +short NS islandtours.example

# ২. মূল নাম কোন IP তে যাচ্ছে (Hosting এর দেওয়া IP আসা উচিত)
dig +short A islandtours.example

# ৩. www কোথায় যাচ্ছে (Hosting এর নাম, তারপর তার IP আসা উচিত)
dig +short www.islandtours.example

# Cache এড়িয়ে আসল উত্তর দেখতে, সরাসরি Authoritative কে জিজ্ঞেস করুন:
dig @ns1.vercel-dns.com islandtours.example
# এখানে ঠিক উত্তর এলে আপনার দিকের কাজ শেষ, বাকিটা শুধু অপেক্ষা।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>ভুল জায়গায় Record বসানো:</strong> সবচেয়ে চেনা ভুল।
                Name Server দেখাচ্ছে Cloudflare এর দিকে, অথচ Record বসালেন
                Registrar এর পাতায়। সেই Record কেউ কখনো পড়বেই না, কারণ হাঁটা
                সেখানে যায় না। Record সবসময় বসবে যেখানে Name Server।
              </ListItem>
              <ListItem>
                <strong>পুরনো Record রেখে দেওয়া:</strong> নতুন A Record বসালেন,
                কিন্তু আগেরটা মুছলেন না। এখন এক নামের দুইটা উত্তর, কখনো নতুন সাইট
                খোলে, কখনো পুরনো। পুরনোটা মুছে দিন।
              </ListItem>
              <ListItem>
                <strong>শুধু একটা নাম জোড়া:</strong> মূল নাম জুড়লেন, www ভুলে
                গেলেন, বা উল্টো। দুইটা আলাদা নাম, দুইটারই Record লাগে।
              </ListItem>
              <ListItem>
                <strong>Name Server এ বানান ভুল বা একটা বাদ:</strong> দুইটার একটা
                বসালেন, বা একটা অক্ষর ভুল। তখন নাম মাঝে মাঝে খোলে, মাঝে মাঝে না।
                হুবহু কপি করুন।
              </ListItem>
              <ListItem>
                <strong>অধৈর্য হওয়া:</strong> বদলানোর পাঁচ মিনিটে কাজ না হলে আবার
                সব বদলে ফেলা। পুরনো উত্তর Cache এ থাকে, সময় দিন। আগে Authoritative
                কে সরাসরি জিজ্ঞেস করে দেখুন, সেখানে ঠিক থাকলে আর কিছু ছোঁবেন না।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সমস্যা হলে হাঁটাটা ধরে ধরে খুঁজুন",
          content: (
            <p>
              নাম খুলছে না, এমন হলে এই লেসনের তিন ধাপ ধরেই খুঁজুন। প্রথমে দেখুন
              Name Server কোনগুলো আসছে, সেগুলো কি আপনার চাওয়া জায়গার। তারপর সেই
              Name Server কে সরাসরি জিজ্ঞেস করুন, সে কি ঠিক IP দিচ্ছে। দুইটাই ঠিক
              হলে DNS এ আর সমস্যা নেই, তখন Hosting বা সাইটের দিকে তাকান। এভাবে
              ধাপে ধাপে গেলে আন্দাজে হাতড়াতে হয় না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "request-flow",
      subHeader: { index: "010", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা নাম, শুরু থেকে উত্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি www.islandtours.example লিখলেন, আর কারো Cache এ এটা নেই। একদম
              শূন্য থেকে উত্তর পাওয়া পর্যন্ত পুরো হাঁটা, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Resolver কে জিজ্ঞেস",
              description:
                "আপনার যন্ত্র তার Resolver কে জিজ্ঞেস করল, www.islandtours.example এর IP কী? Resolver নিজের Cache এ দেখল, নেই। তাই হাঁটা শুরু।",
            },
            {
              title: "Root এর কাছে",
              description:
                "Resolver একটা Root server কে জিজ্ঞেস করল। Root বলল, আমি জানি না, তবে .example এর TLD server গুলো এখানে। এটা একটা Referral।",
            },
            {
              title: "TLD এর কাছে",
              description:
                "Resolver এবার .example এর TLD server কে জিজ্ঞেস করল। সে বলল, আমিও জানি না, তবে islandtours.example এর Name Server এগুলো। আরেকটা Referral।",
            },
            {
              title: "Authoritative এর কাছে",
              description:
                "Resolver শেষে islandtours.example এর Authoritative server কে জিজ্ঞেস করল। সে আসল উত্তর দিল, 103.94.135.2। এটাই Authoritative answer।",
            },
            {
              title: "উত্তর ফেরত, আর মনে রাখা",
              description:
                "Resolver উত্তরটা আপনার যন্ত্রকে ফেরত দিল, আর নিজের Cache এ রেখে দিল। এবার আপনার যন্ত্র IP হাতে নিয়ে চেনা পথে নামে, Gateway, NAT, তারপর Server।",
            },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
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
                <strong>নিজে হাঁটাটা দেখুন</strong>, নিচের Lab এ একটা কমান্ড আছে যেটা
                পুরো হাঁটা ধাপে ধাপে ছাপিয়ে দেয়, Root থেকে Authoritative পর্যন্ত।
                এই লেসনের ছবিটা নিজের Terminal এ দেখার সবচেয়ে ভালো উপায়।
              </ListItem>
              <ListItem>
                <strong>How DNS Works (কমিক)</strong>, Root, TLD আর Authoritative এর
                পুরো গল্প ছবিতে, খুব সহজ করে।{" "}
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
                <strong>Root Server এর মানচিত্র</strong>, দুনিয়াজুড়ে Root server
                গুলো কোথায় কোথায় ছড়ানো, একটা জীবন্ত মানচিত্রে।{" "}
                <a
                  href="https://root-servers.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  root-servers.org
                </a>
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "recap",
      subHeader: { index: "012", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                একটা নাম ডান থেকে বাঁয়ে পড়তে হয়, বড় এলাকা থেকে ছোট। শেষে একটা
                লুকানো ফোঁটা আছে, সেটাই Root।
              </ListItem>
              <ListItem>
                তিন স্তরের server। Root জানে কোন TLD কে চালায়। TLD জানে কোন Domain
                এর হিসাব কে রাখে। Authoritative জানে আসল Record।
              </ListItem>
              <ListItem>
                উপরের দুই স্তর শুধু Referral দেয়, মানে দিকনির্দেশ। আসল উত্তর দেয়
                একমাত্র Authoritative server।
              </ListItem>
              <ListItem>
                হাঁটে আপনার Recursive Resolver। আপনি একবার জিজ্ঞেস করেন, সে Root,
                TLD, Authoritative ঘুরে উত্তর নিয়ে আসে।
              </ListItem>
              <ListItem>
                Resolver যা শেখে তা Cache এ রাখে, তাই পুরো হাঁটা কমই লাগে, আর
                পরেরবার উত্তর প্রায় সাথে সাথে।
              </ListItem>
              <ListItem>
                তিন স্তরের মধ্যে আপনার হাতে শুধু Authoritative। Registrar এ Name
                Server বসিয়ে আপনি বলে দেন সেটা কোনটা, আর ভুল বসালে নাম খুঁজে
                পাওয়া যায় না।
              </ListItem>
              <ListItem>
                নামকে Hosting এর সাথে জোড়ার দুই উপায়। Name Server বদলে পুরো DNS
                Hosting কে দেওয়া, অথবা Name Server রেখে বর্তমান DNS এ A আর CNAME
                Record যোগ করা।
              </ListItem>
              <ListItem>
                Name Server বদলানোর আগে পুরনো সব Record, বিশেষ করে ইমেইলের, নতুন
                জায়গায় তুলে নিন। Record সবসময় বসবে যেখানে Name Server।
              </ListItem>
              <ListItem>
                যাচাই করুন dig দিয়ে, Browser দিয়ে নয়। Authoritative কে সরাসরি
                জিজ্ঞেস করে ঠিক উত্তর পেলে আপনার কাজ শেষ, বাকিটা অপেক্ষা।
              </ListItem>
              <ListItem>
                পরের লেসন: যে এই পুরো হাঁটাটা হাঁটে, সেই Recursive Resolver কে কাছ থেকে চেনা।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["শব্দ", "এক লাইনে"],
    rows: [
      [
        <span className="font-bold text-primary">Root Server</span>,
        "গাছের গোড়া, জানে শুধু কোন TLD কে চালায়",
      ],
      [
        <span className="font-bold text-primary">TLD Server</span>,
        "Registry চালায়, জানে কোন Domain এর Name Server কোনগুলো",
      ],
      [
        <span className="font-bold text-primary">Authoritative Server</span>,
        "নামটার আসল Record রাখে, চূড়ান্ত উত্তর দেয়",
      ],
      [
        <span className="font-bold text-primary">Referral</span>,
        "উত্তর নয়, দিকনির্দেশ, অমুকের কাছে যান",
      ],
      [
        <span className="font-bold text-primary">Recursive Resolver</span>,
        "আপনার হয়ে পুরো হাঁটাটা সেরে উত্তর নিয়ে আসে",
      ],
      [
        <span className="font-bold text-primary">Name Server</span>,
        "একটা Domain এর Authoritative server, Registrar এ বসানো হয়",
      ],
      [
        <span className="font-bold text-primary">Cache</span>,
        "শেখা উত্তর মনে রাখা, তাই পুরো হাঁটা কমই লাগে",
      ],
      [
        <span className="font-bold text-primary">Anycast</span>,
        "এক ঠিকানা, অনেক জায়গায় যন্ত্র, তাই Root বন্ধ হয় না",
      ],
      [
        <span className="font-bold text-primary">NXDOMAIN</span>,
        "নামটার অস্তিত্বই নেই, সমস্যা DNS বা বানানে",
      ],
      [
        <span className="font-bold text-primary">Domain জোড়া</span>,
        "Name Server বদল, অথবা বর্তমান DNS এ A আর CNAME Record",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "DNS একটা নাম কোন দিক থেকে পড়ে খোঁজা শুরু করে?",
        options: [
          {
            key: "A",
            text: "বাঁ থেকে ডানে, www দিয়ে শুরু",
            isCorrect: false,
            explanation:
              "উল্টো। খোঁজা শুরু হয় সবচেয়ে বড় এলাকা থেকে, যেটা ডান দিকে।",
          },
          {
            key: "B",
            text: "ডান থেকে বাঁয়ে, Root আর TLD দিয়ে শুরু",
            isCorrect: true,
            explanation:
              "ঠিক। নামের ডান দিকে বড় এলাকা। শেষের লুকানো ফোঁটা Root, তারপর TLD, তারপর Domain।",
          },
          {
            key: "C",
            text: "মাঝখান থেকে",
            isCorrect: false,
            explanation:
              "না। খোঁজা সবসময় উপর থেকে নিচে, মানে ডান থেকে বাঁয়ে।",
          },
        ],
      },
      {
        id: 2,
        text: "Root Server কে একটা Website এর IP জিজ্ঞেস করলে সে কী করে?",
        options: [
          {
            key: "A",
            text: "সরাসরি IP বলে দেয়",
            isCorrect: false,
            explanation:
              "না। Root কোনো Website এর IP জানে না।",
          },
          {
            key: "B",
            text: "বলে দেয় ওই TLD এর server কোথায়, মানে একটা Referral দেয়",
            isCorrect: true,
            explanation:
              "ঠিক। Root শুধু জানে কোন TLD কে চালায়, তাই সে এক ধাপ নিচে পাঠিয়ে দেয়।",
          },
          {
            key: "C",
            text: "প্রশ্নটা ফেলে দেয়",
            isCorrect: false,
            explanation:
              "না, সে সাহায্য করে, তবে উত্তর দিয়ে নয়, দিকনির্দেশ দিয়ে।",
          },
        ],
      },
      {
        id: 3,
        text: "তিন স্তরের মধ্যে আসল, চূড়ান্ত উত্তর কে দেয়?",
        options: [
          {
            key: "A",
            text: "Root Server",
            isCorrect: false,
            explanation: "Root শুধু TLD এর দিকে পাঠায়, উত্তর দেয় না।",
          },
          {
            key: "B",
            text: "TLD Server",
            isCorrect: false,
            explanation:
              "TLD শুধু জানে কোন Name Server হিসাব রাখে, IP জানে না।",
          },
          {
            key: "C",
            text: "Authoritative Server",
            isCorrect: true,
            explanation:
              "ঠিক। আসল Record তার কাছেই, তাই শেষ কথা তারই। উপরের দুইজন শুধু Referral দেয়।",
          },
        ],
      },
      {
        id: 4,
        text: "প্রতিটা নামের জন্য তিনটা server ঘুরে আসা লাগলে DNS তো ধীর হওয়ার কথা। বাস্তবে দ্রুত কেন?",
        options: [
          {
            key: "A",
            text: "Resolver শেখা উত্তর Cache এ রাখে, তাই পুরো হাঁটা কমই লাগে",
            isCorrect: true,
            explanation:
              "ঠিক। একবার জানা TLD বা নামের উত্তর মনে রাখা হয়, আর এক Resolver অনেকের প্রশ্ন সামলায় বলে Cache প্রায় সবসময় গরম থাকে।",
          },
          {
            key: "B",
            text: "Root Server সব নামের IP মুখস্থ রাখে",
            isCorrect: false,
            explanation:
              "না, Root কোনো নামের IP জানে না। গতি আসে Cache থেকে।",
          },
          {
            key: "C",
            text: "তিনটা server আসলে একই যন্ত্র",
            isCorrect: false,
            explanation:
              "না, তারা আলাদা, আলাদা সংস্থা চালায়। দ্রুত হওয়ার কারণ Cache।",
          },
        ],
      },
      {
        id: 5,
        text: "Island Tours এর সার্ভার ঠিক চলছে, কিন্তু নামটা কোথাও খুঁজে পাওয়া যাচ্ছে না। প্রথম সন্দেহ কোথায়?",
        options: [
          {
            key: "A",
            text: "Root Server নষ্ট",
            isCorrect: false,
            explanation:
              "Root নষ্ট হলে পুরো দুনিয়ার নাম বন্ধ হতো। সমস্যা আপনার নিজের স্তরে।",
          },
          {
            key: "B",
            text: "Registrar এ বসানো Name Server ভুল",
            isCorrect: true,
            explanation:
              "ঠিক। Name Server ভুল হলে TLD server Resolver কে ভুল জায়গায় পাঠায়, তাই নাম খুঁজে পাওয়া যায় না, যদিও সার্ভার চলছে।",
          },
          {
            key: "C",
            text: "সার্ভারের RAM কম",
            isCorrect: false,
            explanation:
              "RAM এর সাথে নাম খোঁজার সম্পর্ক নেই। এটা DNS এর সমস্যা।",
          },
        ],
      },
      {
        id: 6,
        text: "আপনার নামের Name Server দেখাচ্ছে Cloudflare এর দিকে। Hosting এর A Record কোথায় বসাবেন?",
        options: [
          {
            key: "A",
            text: "Registrar এর DNS পাতায়",
            isCorrect: false,
            explanation:
              "না। Name Server যেহেতু Cloudflare এ, Registrar এর পাতার Record কেউ পড়বে না।",
          },
          {
            key: "B",
            text: "Cloudflare এ, কারণ Record বসে যেখানে Name Server",
            isCorrect: true,
            explanation:
              "ঠিক। Resolver এর হাঁটা শেষ হয় Name Server এ, তাই Record সেখানেই থাকতে হবে।",
          },
          {
            key: "C",
            text: "যেকোনো জায়গায় বসালেই হবে",
            isCorrect: false,
            explanation:
              "না। ভুল জায়গায় বসানো Record একদম অকেজো, এটাই সবচেয়ে চেনা ভুল।",
          },
        ],
      },
      {
        id: 7,
        text: "Name Server বদলে নতুন Hosting এ নেওয়ার পর সাইট খুলছে, কিন্তু অফিসের ইমেইল আসা বন্ধ। সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "পুরনো DNS এর ইমেইলের Record নতুন জায়গায় তোলা হয়নি",
            isCorrect: true,
            explanation:
              "ঠিক। Name Server বদলালে পুরনো DNS এর Record আর কেউ পড়ে না। ইমেইলের Record আগে নতুন জায়গায় বসাতে হতো।",
          },
          {
            key: "B",
            text: "Root Server ইমেইল বন্ধ করে দিয়েছে",
            isCorrect: false,
            explanation: "Root এমন কিছু করে না, সে শুধু TLD এর দিকে পাঠায়।",
          },
          {
            key: "C",
            text: "HTTPS সার্টিফিকেটের সমস্যা",
            isCorrect: false,
            explanation:
              "সার্টিফিকেট Website এর ব্যাপার। ইমেইল বন্ধ হওয়ার কারণ হারিয়ে যাওয়া DNS Record।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের চোখে হাঁটাটা দেখুন",
    subtitle: "Terminal এ পাঁচটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "পুরো হাঁটা ছাপান",
        description:
          "একটা কমান্ড দিয়ে Root থেকে Authoritative পর্যন্ত পুরো হাঁটা ধাপে ধাপে দেখুন।",
      },
      {
        title: "Root Server গুলো দেখুন",
        description:
          "দুনিয়ার Root server গুলোর নাম বের করুন, আর গুনে দেখুন কয়টা।",
      },
      {
        title: "একটা Domain এর Name Server",
        description:
          "একটা Domain এর Authoritative server কোনগুলো, মানে তার Name Server, বের করুন।",
      },
      {
        title: "সরাসরি Authoritative কে জিজ্ঞেস",
        description:
          "Resolver বাদ দিয়ে সরাসরি Authoritative server কে জিজ্ঞেস করুন, আর আসল উত্তরের চিহ্ন খুঁজুন।",
      },
      {
        title: "একটা সাইট কীভাবে জোড়া, গোয়েন্দাগিরি",
        description:
          "একটা চেনা সাইটের Name Server, A Record আর www দেখে আন্দাজ করুন সে কোন উপায়ে আর কোন Hosting এ জোড়া।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-trace.sh",
        language: "bash",
        code: `# পুরো হাঁটা, Root থেকে Authoritative পর্যন্ত
dig +trace example.com

# আউটপুট উপর থেকে নিচে পড়ুন:
#   প্রথম অংশ  -> Root server গুলো (.)
#   দ্বিতীয় অংশ -> com এর TLD server গুলো
#   তৃতীয় অংশ  -> example.com এর Name Server গুলো
#   শেষ অংশ    -> আসল উত্তর, A Record আর IP
# এটাই এই লেসনের তিন ধাপের হাঁটা, নিজের চোখে।`,
      },
      {
        filename: "2-root-servers.sh",
        language: "bash",
        code: `# Root server গুলোর নাম
dig +short NS .

# a.root-servers.net থেকে m.root-servers.net পর্যন্ত আসবে।
# গুনে দেখুন, ১৩টা। এগুলো পরিচয় মাত্র,
# প্রতিটা আসলে দুনিয়ার বহু জায়গায় ছড়ানো।`,
      },
      {
        filename: "3-name-servers.sh",
        language: "bash",
        code: `# একটা Domain এর Authoritative server (Name Server)
dig +short NS example.com
dig +short NS github.com

# যে নামগুলো আসবে, সেগুলোই ওই Domain এর Authoritative server।
# TLD server ঠিক এই তালিকাটাই Resolver কে দেয়।`,
      },
      {
        filename: "4-ask-authoritative.sh",
        language: "bash",
        code: `# আগের ধাপে পাওয়া একটা Name Server কে সরাসরি জিজ্ঞেস করুন
dig @a.iana-servers.net example.com

# উত্তরের উপরে flags লাইনটা দেখুন, সেখানে 'aa' থাকবে।
# aa মানে Authoritative Answer, মানে আসল উৎস থেকে আসা উত্তর।

# এবার সাধারণভাবে জিজ্ঞেস করুন (Resolver দিয়ে):
dig example.com
# এখানে সাধারণত 'aa' থাকে না, কারণ এটা Cache থেকে আসা নকল।`,
      },
      {
        filename: "5-how-is-it-connected.sh",
        language: "bash",
        code: `# একটা সাইট কোন উপায়ে জোড়া, তিন প্রশ্নে বের করুন
dig +short NS vercel.com        # Name Server কার, সেটাই বলে DNS কোথায়
dig +short A vercel.com         # মূল নাম কোন IP তে
dig +short www.vercel.com       # www কি CNAME, নাকি সরাসরি IP

# Name Server এ Hosting এর নাম থাকলে   -> উপায় ১ (Name Server বদল)
# Name Server অন্য কারো, কিন্তু IP বা CNAME Hosting এর -> উপায় ২ (Record যোগ)
# নিজের পছন্দের দুই তিনটা সাইটে চালিয়ে মিলিয়ে দেখুন।`,
      },
    ],
    tip: "এক নম্বর পরীক্ষাটা এই পুরো মডিউলের সবচেয়ে চোখ খোলা কমান্ড। dig +trace চালালে Terminal এ ঠিক সেই তিন ধাপ পরপর ছাপা হয়, প্রথমে Root, তারপর TLD, তারপর Domain এর Name Server, আর শেষে আসল উত্তর। উপরের Lab এ যা চাপ দিয়ে দেখলেন, এখানে সেটা সত্যিকারের server এর সাথে ঘটতে দেখা যায়। একবার চালিয়ে উপর থেকে নিচে ধীরে পড়ুন, DNS আর কখনো রহস্য মনে হবে না।",
  },
  assignment: {
    title: "Mini Project: একটা নামের পিছু নেওয়া",
    time: "৫০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>হাঁটাটা লিখে ফেলুন:</strong> Lab এর এক নম্বর দিয়ে একটা চেনা
        সাইটের পুরো হাঁটা দেখুন। তিন ধাপের প্রতিটাতে কোন server সাড়া দিল, একটা
        করে নাম লিখুন।
      </span>,
      <span key="2">
        <strong>Root গুনুন:</strong> Lab এর দুই নম্বর দিয়ে Root server এর সংখ্যা
        লিখুন। এক লাইনে লিখুন, এত কম সংখ্যায় পুরো দুনিয়া চলে কীভাবে।
      </span>,
      <span key="3">
        <strong>আসল বনাম নকল:</strong> Lab এর চার নম্বরের দুইটা কমান্ডই চালান।
        কোনটায় aa চিহ্ন পেলেন আর কোনটায় পাননি, লিখুন, আর কারণটা এক লাইনে।
      </span>,
      <span key="5">
        <strong>জোড়ার পরিকল্পনা:</strong> ধরুন islandtours.example নামে আগে
        থেকেই অফিসের ইমেইল চলছে, আর সাইটটা তুলবেন একটা Hosting এ। দুই উপায়ের
        কোনটা বেছে নেবেন আর কেন, লিখুন। তারপর সেই উপায়ের ধাপগুলো নিজের ভাষায়
        ক্রম অনুযায়ী সাজান।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ থেকে ৭ লাইন):</strong> একজন বন্ধু জিজ্ঞেস
        করলেন, Internet এ কোটি কোটি নাম, একটা নাম লিখলে উত্তর এত তাড়াতাড়ি খুঁজে
        পায় কীভাবে? তাঁকে তিন স্তর আর Cache এর উদাহরণ দিয়ে বোঝান।
      </span>,
    ],
    deliverables: [
      <span key="1">একটা নামের হাঁটার তিন ধাপের তিনটা server</span>,
      <span key="2">Root server এর সংখ্যা, আর এত কমে চলার কারণ</span>,
      <span key="3">দুই কমান্ডের aa চিহ্নের তফাত আর কারণ</span>,
      <span key="4">নাম খুঁজে পাওয়ার পুরো গল্প, ৫ থেকে ৭ লাইনে</span>,
      <span key="5">Domain জোড়ার বেছে নেওয়া উপায়, কারণ আর ধাপের তালিকা</span>,
    ],
  },
};
