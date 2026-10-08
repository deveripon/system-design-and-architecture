/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  ResolverMemoryLab,
  ResolverPickerLab,
} from "../../../components/course/topics/dns/resolver-animations";
import {
  QueryStyleSplit,
  ResolverChainDiagram,
  StubRecursiveDiagram,
} from "../../../components/course/topics/dns/resolver-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const recursiveResolverContent: TopicData = {
  id: "recursive-resolver",
  introduction: {
    badge: "MODULE 04 · LESSON 04",
    title: <SectionTitle>যে আপনার হয়ে পুরো পথটা হাঁটে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে Root, TLD আর Authoritative, তিন স্তরের server চিনেছেন, আর
          দেখেছেন একটা নাম খুঁজতে এই তিন জায়গায় যেতে হয়। কিন্তু একটা চরিত্রকে
          আমরা শুধু নাম ধরে ডেকেছি, ভালো করে চিনিনি। সে হলো যে আসলে হাঁটে, Recursive
          Resolver।
        </ContentParagraph>
        <ContentParagraph>
          আপনি প্রতিদিন শত শত বার তার সেবা নেন, অথচ হয়তো জানেনই না সে কে, কোথায়
          থাকে, বা কে তাকে বেছে দিয়েছে। এই লেসনে আমরা তাকে কাছ থেকে দেখব। সে কীভাবে
          কাজ শুরু করে, কেন সে এত দ্রুত, আপনার Resolver টা আসলে কোনটা, সেটা কীভাবে
          বদলানো যায়, আর সে ভুল করলে বা বন্ধ থাকলে কীভাবে ধরবেন।
        </ContentParagraph>
        <ContentParagraph>
          এটা জানা জরুরি, কারণ কোনো সাইট না খুললে তিনটা প্রশ্নের একটা প্রায়
          সবসময় আসে, সমস্যাটা সাইটের, নাকি আমার Internet এর, নাকি আমার DNS এর?
          তৃতীয় প্রশ্নটার উত্তর দিতে হলে Resolver কে চিনতেই হবে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আপনি লাইব্রেরিতে গিয়ে নিজে তাক ঘাঁটেন না। ডেস্কে বসা মানুষটাকে বইয়ের নাম বলেন, তিনি ঘুরে ঘুরে খুঁজে এনে দেন। আর যে বই রোজ কেউ না কেউ চায়, সেটা তিনি ডেস্কের পাশেই রেখে দেন।",
      author: "DNS",
      role: "Lesson 04",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "who",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Resolver আসলে কে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Recursive Resolver একটা সার্ভার, যার একটাই কাজ, আপনার হয়ে DNS এর
                প্রশ্নের উত্তর খুঁজে আনা। তার নিজের কাছে কোনো Domain এর আসল Record
                নেই। সে কোনো নামের মালিক নয়। সে শুধু জানে কীভাবে খুঁজতে হয়, আর যা
                খুঁজে পায় তা কিছুক্ষণ মনে রাখে।
              </ContentParagraph>
              <ContentParagraph>
                আর আপনার যন্ত্রের ভেতরেও একটা ছোট অংশ আছে, যেটা এই কাজে হাত লাগায়।
                তার নাম Stub Resolver। Stub মানে গোড়া বা ছোট টুকরো, আর নামটা যথার্থ,
                কারণ সে প্রায় কিছুই করে না। সে শুধু প্রশ্নটা Recursive Resolver এর
                কাছে পাঠায়, আর উত্তরের জন্য বসে থাকে। Root কোথায়, TLD কী, এসব সে
                জানেই না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StubRecursiveDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "কাজ ভাগ করে নেওয়ার কারণ",
          content: (
            <p>
              আপনার ফোন কেন নিজেই Root থেকে হাঁটে না? দুইটা কারণ। এক, তাহলে
              পৃথিবীর প্রতিটা ফোন, ঘড়ি আর বাল্বকে পুরো খোঁজার নিয়ম জানতে হতো, যেটা
              ছোট যন্ত্রের জন্য বাড়তি বোঝা। দুই, আর এটাই বড় কারণ, একটা Resolver
              হাজার হাজার মানুষের প্রশ্ন সামলায়, তাই একজনের জন্য খুঁজে আনা উত্তর
              বাকি সবার কাজে লাগে। প্রতিটা যন্ত্র আলাদা হাঁটলে এই ভাগাভাগির সুবিধাটা
              হারিয়ে যেত, আর Root server গুলোর উপর চাপ বহু গুণ বাড়ত।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "two-questions",
      subHeader: { index: "002", title: "Recursive vs Iterative" },
      title: <SectionTitle>দুই রকম প্রশ্ন, দুই রকম উত্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনে এক লাইনে বলেছিলাম, খোঁজের ভেতরে দুই রকম জিজ্ঞেস করা
                চলে। এবার সেটা ভালো করে আলাদা করি, কারণ Resolver এর নামের
                Recursive শব্দটা এখান থেকেই এসেছে।
              </ContentParagraph>
              <ContentParagraph>
                একটা রেস্তোরাঁর কথা ভাবুন। আপনি ওয়েটারকে বলেন, এক প্লেট বিরিয়ানি
                দিন। আপনি রান্নাঘরে যান না, বাজারে যান না, শুধু অপেক্ষা করেন আর
                তৈরি খাবারটা পান। এটা Recursive ধাঁচ, পুরো কাজটা আরেকজনের ঘাড়ে।
                এবার ভাবুন আপনি নিজে একটা অচেনা শহরে ঠিকানা খুঁজছেন। একজনকে জিজ্ঞেস
                করলেন, তিনি বললেন ওই মোড়ে গিয়ে জিজ্ঞেস করুন। মোড়ে গেলেন, সেখানে
                আরেকজন বললেন ওই গলিতে যান। প্রতিবার একটু করে এগোচ্ছেন, হাঁটছেন নিজে।
                এটা Iterative ধাঁচ।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <QueryStyleSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Recursive প্রশ্ন:</strong> আপনার যন্ত্র Resolver কে করে।
                মানে, পুরো উত্তর চাই। ফেরত আসে হয় IP, নয়তো একটা পরিষ্কার না।
                মাঝপথের কোনো দিকনির্দেশ কখনো আপনার যন্ত্রের কাছে আসে না।
              </ListItem>
              <ListItem>
                <strong>Iterative প্রশ্ন:</strong> Resolver করে Root, TLD আর
                Authoritative কে। তারা যতটুকু জানে ততটুকু বলে, সাধারণত পরের কার
                কাছে যেতে হবে। এই দিকনির্দেশের নাম Referral।
              </ListItem>
              <ListItem>
                <strong>Root আর TLD কেন পুরো কাজ করে দেয় না:</strong> তারা পুরো
                পৃথিবীর প্রশ্ন সামলায়। প্রতিটা প্রশ্নের জন্য নিজেরা ঘুরে বেড়ালে
                তারা চাপে ভেঙে পড়ত। তাই তারা শুধু দিক দেখায়, হাঁটার কাজটা ছেড়ে
                দেয় Resolver এর উপর।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "where-from",
      subHeader: { index: "003", title: "Your Resolver" },
      title: <SectionTitle>আপনার Resolver কোথা থেকে এলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি কখনো কোনো Resolver বেছে নেননি, তবু একটা আছে। কে দিল? উত্তরটা
                আপনি আগের মডিউলে শিখে এসেছেন, DHCP। WiFi তে যুক্ত হওয়ার সময় DHCP
                আপনাকে চারটা জিনিস দিয়েছিল, IP, Subnet Mask, Gateway, আর DNS server
                এর ঠিকানা। ওই চতুর্থটাই আপনার Resolver এর ঠিকানা।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু বাসার WiFi তে একটা ছোট মোচড় আছে। DHCP যে DNS ঠিকানাটা দেয়,
                সেটা প্রায় সবসময় Router এর নিজের ঠিকানা। অথচ ছোট্ট একটা Router
                পুরো DNS খোঁজার কাজ করে না। তাহলে?
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ResolverChainDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Router একজন Forwarder:</strong> সে প্রশ্নটা নেয়, আর না
                খুঁজেই এগিয়ে দেয় আসল Resolver এর কাছে। সেই আসল Resolver এর ঠিকানা
                Router পেয়েছে আপনার ISP র কাছ থেকে, ঠিক যেভাবে আপনি Router এর কাছ
                থেকে পেয়েছেন।
              </ListItem>
              <ListItem>
                <strong>Mobile Data তে:</strong> মাঝখানে Router নেই। মোবাইল
                অপারেটর সরাসরি তাদের নিজের Resolver এর ঠিকানা ফোনকে দিয়ে দেয়।
              </ListItem>
              <ListItem>
                <strong>অফিস বা বিশ্ববিদ্যালয়ে:</strong> প্রতিষ্ঠান প্রায়ই নিজেদের
                একটা Resolver চালায়, যাতে ভেতরের নামগুলো (যেমন একটা অভ্যন্তরীণ
                সাইট) চেনানো যায়, আর কোন সাইটে যাওয়া যাবে তা নিয়ন্ত্রণ করা যায়।
              </ListItem>
              <ListItem>
                <strong>Cloud এর সার্ভারে:</strong> আপনার ভাড়া করা সার্ভারেরও একটা
                Resolver আছে, Cloud কোম্পানি নিজে দেয়। সার্ভার যখন অন্য কোনো সেবাকে
                নাম ধরে ডাকে, সে ঐ Resolver কেই জিজ্ঞেস করে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "127.0.0.53 দেখলে ঘাবড়াবেন না",
          content: (
            <p>
              Linux এ নিজের DNS ঠিকানা দেখতে গেলে অনেক সময় 127.0.0.53 দেখা যায়।
              127 দিয়ে শুরু মানে নিজের যন্ত্র, তাই মনে হয় যন্ত্রটাই বুঝি Resolver।
              আসলে তা নয়। এটা যন্ত্রের ভেতরের একটা ছোট সহকারী, যে প্রশ্নগুলো নিয়ে
              নিজের ছোট Cache দেখে, তারপর আসল Resolver এর কাছে এগিয়ে দেয়। আসল
              ঠিকানাটা দেখতে resolvectl status চালাতে হয়, নিচে Lab এ পাবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "how-it-starts",
      subHeader: { index: "004", title: "Root Hints & Memory" },
      title: <SectionTitle>সে শুরু করে কোথা থেকে, আর এত দ্রুত কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ধাঁধা আছে এখানে। Resolver প্রথমে Root এ যায়। কিন্তু Root
                server এর ঠিকানা সে পেল কোথায়? DNS কে জিজ্ঞেস করে তো পাওয়ার উপায়
                নেই, কারণ DNS খোঁজা শুরুই হয় Root থেকে। এটা সেই ডিম আগে না মুরগি
                আগে সমস্যা।
              </ContentParagraph>
              <ContentParagraph>
                সমাধানটা সরল। প্রতিটা Resolver এর ভেতরে একটা ছোট তালিকা আগে থেকেই
                লিখে দেওয়া থাকে, যাতে ১৩টা Root server এর নাম আর IP আছে। এই
                তালিকার নাম Root Hints। নামগুলো a থেকে m পর্যন্ত, যেমন
                a.root-servers.net। এই ঠিকানাগুলো বছরের পর বছর প্রায় বদলায়ই না,
                তাই একবার লিখে দিলেই চলে। পুরো DNS এর এটাই একমাত্র জায়গা যেখানে
                কিছু একটা আগে থেকে জানা থাকতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                এবার গতির প্রশ্ন। Resolver শুধু শেষ উত্তরটা মনে রাখে না। পথে যা যা
                শেখে, সবই মনে রাখে। .example এর TLD server কারা, islandtours.example
                এর Authoritative কে, প্রতিটা ধাপের উত্তর আলাদা করে তার খাতায় ওঠে।
                তাই পরের বার সে মাঝপথ থেকে শুরু করতে পারে। নিচের Lab এ নিজে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ResolverMemoryLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "তাই Root server এ চাপ কম পড়ে",
          content: (
            <p>
              পৃথিবীতে প্রতিদিন লক্ষ কোটি DNS প্রশ্ন হয়, অথচ Root server গুলো তা
              সামলে নেয়। কারণটা এই Lab এ দেখলেন। একটা ব্যস্ত Resolver জনপ্রিয়
              সব TLD এর ঠিকানা প্রায় সবসময় খাতায় রাখে, তাই Root এ তাকে দিনে মাত্র
              কয়েকবার যেতে হয়। TLD server এর ঠিকানাগুলোর মেয়াদ সাধারণত দুই দিন।
              মানে একবার জেনে নিলে দুই দিন আর Root কে বিরক্ত করতে হয় না। এই মেয়াদের
              পুরো গল্প পরের লেসনে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "public-resolvers",
      subHeader: { index: "005", title: "Public Resolvers" },
      title: <SectionTitle>ISP র টা ছাড়াও Resolver আছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DHCP যে Resolver দেয় সেটাই ব্যবহার করতে হবে, এমন কোনো বাধ্যবাধকতা
                নেই। কিছু বড় প্রতিষ্ঠান পুরো পৃথিবীর জন্য বিনা পয়সায় Resolver খুলে
                রেখেছে। এগুলোকে বলে Public Resolver বা Public DNS। আপনি শুধু নিজের
                যন্ত্রে তাদের ঠিকানাটা বসিয়ে দিলেই হলো।
              </ContentParagraph>
              <ContentParagraph>
                8.8.8.8 ঠিকানাটা আপনি আগের মডিউলগুলোতে ping করতে গিয়ে বহুবার
                দেখেছেন। এবার জানলেন সেটা আসলে কী, Google এর Public Resolver।
                নিচে চারটা চেনা বিকল্প পাশাপাশি দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ResolverPickerLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা ঠিকানা, অথচ সারা পৃথিবীতে",
          content: (
            <p>
              একটা স্বাভাবিক প্রশ্ন, 8.8.8.8 যদি একটাই সার্ভার হয়, আর সেটা যদি
              আমেরিকায় থাকে, তাহলে ঢাকা থেকে প্রতিটা প্রশ্ন এত দূর যাওয়া তো ধীর
              হওয়ার কথা। আসলে 8.8.8.8 একটা সার্ভার নয়। পৃথিবীর বহু শহরে শত শত
              সার্ভার একই ঠিকানা ব্যবহার করে, আর Internet এর Router গুলো আপনার
              প্রশ্নটা সবচেয়ে কাছেরটায় পাঠিয়ে দেয়। এই কৌশলের নাম Anycast। Root
              server ১৩টা নাম নিয়েও পৃথিবীজুড়ে হাজারের বেশি জায়গায় থাকে একই
              কৌশলে। এখন শুধু নামটা চিনে রাখুন, পরে বিস্তারিত আসবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "which-one",
      subHeader: { index: "006", title: "Find Yours" },
      title: <SectionTitle>হাতে কলমে, আমার Resolver কোনটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বদলানোর আগে জানা দরকার এখন কোনটা চলছে। প্রতিটা Operating System এ
              দেখার উপায় আলাদা। নিজেরটা বেছে চালান। আর শেষের কমান্ডটা যেকোনো
              জায়গায় চলে, সেটা বলে দেয় এই মুহূর্তের উত্তরটা আসলে কে দিল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "which-resolver.sh",
          code: `# macOS
scutil --dns | grep nameserver
networksetup -getdnsservers Wi-Fi        # হাতে বসানো থাকলে দেখায়

# Windows (PowerShell বা CMD)
ipconfig /all                            # "DNS Servers" লাইনটা খুঁজুন
Get-DnsClientServerAddress               # শুধু PowerShell

# Linux
resolvectl status                        # "DNS Servers" লাইনটা আসল ঠিকানা
cat /etc/resolv.conf                     # 127.0.0.53 দেখালে উপরেরটা চালান

# যেকোনো জায়গায়: dig এর উত্তরের শেষে SERVER লাইন
dig google.com | grep SERVER
#   ;; SERVER: 192.168.1.1#53(192.168.1.1)
#   192.168.1.1 মানে Router, সে একজন Forwarder`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              উপরের কমান্ডগুলো দেখায় আপনার যন্ত্র কাকে জিজ্ঞেস করছে। কিন্তু সেটা
              যদি Router হয়, তাহলে Router এর পেছনের আসল Resolver টা কে? সেটা বের
              করার একটা চালাক উপায় আছে। কিছু বিশেষ নাম আছে যাদের Authoritative
              server উত্তরে বলে দেয়, প্রশ্নটা কোন IP থেকে এসেছিল। যেহেতু প্রশ্নটা
              করে Resolver, আপনি নন, তাই উত্তরে Resolver এর IP টাই ফেরত আসে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "real-resolver.sh",
          code: `# আসল Recursive Resolver এর IP, যে Authoritative পর্যন্ত গিয়েছিল
dig +short TXT o-o.myaddr.l.google.com
dig +short whoami.akamai.net

# এই IP টা কার, সেটা দেখুন (ISP র নাম, বা Google, Cloudflare)
whois <উপরের IP> | grep -i -E "orgname|org-name|descr|netname"

# Cloudflare ব্যবহার করলে, কোন শহরের সার্ভার উত্তর দিল
dig +short CH TXT id.server @1.1.1.1     # যেমন DAC মানে ঢাকা`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "change-it",
      subHeader: { index: "007", title: "Changing It" },
      title: <SectionTitle>হাতে কলমে, Resolver বদলানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Resolver বদলানো যায় দুই জায়গায়, আর কোনটা বেছে নেবেন তা নির্ভর করে
                আপনি কার জন্য বদলাতে চান।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা যন্ত্রে:</strong> শুধু আপনার ল্যাপটপ বা ফোনে।
                  বাকিরা যেমন ছিল তেমনই থাকে। পরীক্ষা করার জন্য এটাই নিরাপদ।
                </ListItem>
                <ListItem>
                  <strong>Router এ:</strong> Router এর DHCP যে DNS ঠিকানা বিলি করে,
                  সেটা বদলে দিলে বাসার প্রতিটা যন্ত্র নতুন Resolver পায়, কাউকে
                  আলাদা করে কিছু করতে হয় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সবসময় দুইটা ঠিকানা বসান, একটা মূল আর একটা বিকল্প (যেমন 1.1.1.1 আর
                1.0.0.1)। একটা সাড়া না দিলে যন্ত্র অন্যটায় যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "DEVICE",
          steps: [
            {
              title: "Windows 11",
              description:
                "Settings খুলে Network & Internet এ যান। WiFi (বা Ethernet) বেছে Hardware properties এ ঢুকুন। DNS server assignment এর পাশে Edit চাপুন, Automatic থেকে Manual করুন, IPv4 চালু করে Preferred DNS এ 1.1.1.1 আর Alternate DNS এ 1.0.0.1 লিখে Save করুন।",
            },
            {
              title: "macOS",
              description:
                "System Settings খুলে Network এ যান, WiFi বেছে যুক্ত থাকা Network এর পাশে Details চাপুন। বাঁ দিকে DNS বেছে নিন, যোগ চিহ্নে চেপে 1.1.1.1 আর 1.0.0.1 বসান, তারপর OK। তালিকায় আগে ধূসর রঙে যে ঠিকানা ছিল, সেটা DHCP র দেওয়া।",
            },
            {
              title: "Linux (Desktop)",
              description:
                "Settings এ Network খুলে যুক্ত থাকা সংযোগের গিয়ার চিহ্নে চাপুন। IPv4 ট্যাবে DNS এর Automatic বন্ধ করে ঘরে 1.1.1.1, 1.0.0.1 লিখে Apply করুন, তারপর সংযোগটা একবার বন্ধ করে চালু করুন। Terminal থেকে করতে চাইলে নিচের কমান্ড দেখুন।",
            },
            {
              title: "Android",
              description:
                "Settings এ Network & Internet (বা Connections, তারপর More connection settings) খুলে Private DNS এ যান। Private DNS provider hostname বেছে একটা নাম লিখুন, IP নয়। Cloudflare এর জন্য one.one.one.one, Google এর জন্য dns.google, Quad9 এর জন্য dns.quad9.net। এটা WiFi আর Mobile Data দুই জায়গাতেই খাটে, আর প্রশ্নগুলো এনক্রিপ্ট করে পাঠায়।",
            },
            {
              title: "iPhone, iPad",
              description:
                "Settings এ WiFi খুলে যুক্ত থাকা Network এর পাশের i চিহ্নে চাপুন। Configure DNS এ গিয়ে Automatic থেকে Manual করুন, পুরনো ঠিকানা মুছে Add Server দিয়ে 1.1.1.1 আর 1.0.0.1 বসান, তারপর Save। এটা শুধু ঐ একটা WiFi এর জন্য খাটে।",
            },
            {
              title: "Router (পুরো বাসার জন্য)",
              description:
                "Browser এ Router এর ঠিকানা (যেমন 192.168.1.1) খুলে ঢুকুন। DHCP বা LAN নামের অংশে DNS Server এর ঘর খুঁজুন, Primary তে 1.1.1.1 আর Secondary তে 1.0.0.1 বসিয়ে Save করুন। যন্ত্রগুলো নতুন ঠিকানা পাবে পরের বার DHCP Lease নবায়ন হলে, তাড়াতাড়ি চাইলে WiFi একবার বন্ধ করে চালু করুন।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "change-resolver.sh",
          code: `# macOS: বসানো
networksetup -setdnsservers Wi-Fi 1.1.1.1 1.0.0.1
# macOS: আগের অবস্থায় ফেরা (আবার DHCP র টা)
networksetup -setdnsservers Wi-Fi empty

# Linux (NetworkManager): আগে সংযোগের নাম দেখুন
nmcli connection show
nmcli connection modify "MyWiFi" ipv4.dns "1.1.1.1 1.0.0.1" ipv4.ignore-auto-dns yes
nmcli connection up "MyWiFi"
# Linux: আগের অবস্থায় ফেরা
nmcli connection modify "MyWiFi" ipv4.dns "" ipv4.ignore-auto-dns no
nmcli connection up "MyWiFi"

# Windows (PowerShell, Administrator হিসেবে): আগে Interface এর নাম দেখুন
Get-NetAdapter
Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ServerAddresses 1.1.1.1,1.0.0.1
# Windows: আগের অবস্থায় ফেরা
Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ResetServerAddresses

# কিছু না বদলে, শুধু একবারের জন্য অন্য Resolver কে জিজ্ঞেস করা
dig @1.1.1.1 islandtours.example
dig @8.8.8.8 islandtours.example`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "স্থায়ীভাবে বদলানোর আগে @ দিয়ে পরীক্ষা করুন",
          content: (
            <p>
              উপরের শেষ দুই লাইন সবচেয়ে কাজের। dig এর পরে @ দিয়ে একটা ঠিকানা লিখলে
              শুধু ঐ একটা প্রশ্ন ঐ Resolver এর কাছে যায়, আপনার যন্ত্রের কিছুই
              বদলায় না। তাই কিছু বদলানোর আগেই আপনি দেখে নিতে পারেন অন্য Resolver
              কী উত্তর দেয়, আর কত দ্রুত দেয়। উত্তরের নিচে Query time লাইনটা
              মিলিসেকেন্ডে সময় দেখায়, তবে প্রথমবারের সময়টা ধরবেন না, দ্বিতীয়বার
              চালিয়ে যা আসে সেটাই তুলনা করুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "trust",
      subHeader: { index: "008", title: "Trust & Privacy" },
      title: <SectionTitle>Resolver যা দেখে, আর যা করতে পারে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Resolver বাছাই শুধু গতির ব্যাপার নয়, বিশ্বাসেরও। কারণ সে দুইটা
                ক্ষমতা রাখে, যেগুলো নিয়ে একবার ভাবা দরকার।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সে আপনার সব নাম দেখে:</strong> আপনি যে সাইটেই যান,
                  প্রথমে তার নামটা Resolver কে জিজ্ঞেস করতে হয়। তাই Resolver যে
                  চালায়, সে জানে আপনার যন্ত্র কোন কোন নাম খুঁজল আর কখন। পাতার
                  ভেতরে কী দেখলেন তা সে জানে না, কিন্তু কোথায় গেলেন তা জানে।
                </ListItem>
                <ListItem>
                  <strong>সে উত্তর বদলাতে পারে:</strong> আপনার যন্ত্র Resolver এর
                  উত্তর চোখ বুজে বিশ্বাস করে। তাই Resolver চাইলে একটা সাইটের জন্য
                  বলতে পারে নামটা নেই (এভাবেই অনেক জায়গায় সাইট আটকানো হয়), অথবা
                  ভুল একটা IP দিতে পারে। কিছু ISP ভুল বানানের নামে NXDOMAIN না
                  দিয়ে নিজেদের বিজ্ঞাপনের পাতার IP দিয়ে দেয়।
                </ListItem>
                <ListItem>
                  <strong>পথে অন্যরাও দেখতে পারে:</strong> সাধারণ DNS প্রশ্ন যায়
                  UDP র Port 53 দিয়ে, একদম খোলা লেখায়, কোনো তালা ছাড়া। তাই একই
                  WiFi তে থাকা কেউ, বা পথের যেকোনো Network, প্রশ্নগুলো পড়তে পারে,
                  এমনকি বদলেও দিতে পারে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শেষ সমস্যাটার সমাধান হলো প্রশ্নগুলোকে তালাবদ্ধ করে পাঠানো। এর
                দুইটা চেনা উপায় আছে, দুইটারই কাজ এক, শুধু পথ আলাদা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>DNS over HTTPS (DoH):</strong> DNS প্রশ্নটা সাধারণ HTTPS
                  এর ভেতরে, Port 443 দিয়ে যায়। বাইরে থেকে দেখে মনে হয় একটা সাধারণ
                  Website খোলা হচ্ছে। Browser গুলো এটাই ব্যবহার করে।
                </ListItem>
                <ListItem>
                  <strong>DNS over TLS (DoT):</strong> একই তালা, কিন্তু নিজের আলাদা
                  Port 853 দিয়ে। Android এর Private DNS এটাই ব্যবহার করে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Browser হয়তো আপনার যন্ত্রের Resolver মানছেই না",
          content: (
            <p>
              Chrome আর Firefox এ Secure DNS নামে একটা সেটিং আছে, যেটা চালু থাকলে
              Browser নিজেই সরাসরি একটা DoH Resolver কে জিজ্ঞেস করে, যন্ত্রের
              সেটিং পাশ কাটিয়ে। ফলে একটা অদ্ভুত অবস্থা হতে পারে, Terminal এ dig
              একটা উত্তর দিচ্ছে, অথচ Browser অন্যটা দেখাচ্ছে। Chrome এ এটা আছে
              Settings, Privacy and security, Security এর ভেতরে Use secure DNS
              নামে। Firefox এ Settings, Privacy & Security এর নিচে DNS over HTTPS।
              DNS ডিবাগ করার সময় Browser আর Terminal এর উত্তর না মিললে এটাই প্রথম
              সন্দেহ।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "উত্তরটা আসল তো? DNSSEC এক লাইনে",
          content: (
            <p>
              তালা দিলে পথে কেউ পড়তে পারে না, কিন্তু উত্তরটা যে সত্যিই Domain এর
              মালিকের লেখা, সেটা কে নিশ্চিত করবে? এর জন্য আছে DNSSEC। Domain এর
              মালিক নিজের Record গুলোতে একটা ডিজিটাল সই বসান, আর ভালো Resolver গুলো
              উত্তর দেওয়ার আগে সেই সই মিলিয়ে দেখে। সই না মিললে সে উত্তরই দেয় না।
              উপরের চারটা Public Resolver ই এই যাচাই করে। আপাতত এটুকু জানা যথেষ্ট।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "failures",
      subHeader: { index: "009", title: "When It Fails" },
      title: <SectionTitle>Resolver ব্যর্থ হলে উত্তরটা পড়তে শেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Resolver প্রতিটা উত্তরের সাথে একটা অবস্থার শব্দ পাঠায়, dig এ যেটা
                status এর পাশে দেখা যায়। এই একটা শব্দ পড়তে জানলে বোঝা যায় সমস্যাটা
                কার। চারটা শব্দ আর একটা নীরবতা চিনলেই চলে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>NOERROR:</strong> সব ঠিক। খোঁজ সফল। (উত্তরের অংশ ফাঁকা
                  থাকলেও এটা আসতে পারে, মানে নামটা আছে কিন্তু আপনি যে ধরনের তথ্য
                  চেয়েছেন সেটা নেই।)
                </ListItem>
                <ListItem>
                  <strong>NXDOMAIN:</strong> Resolver পুরো পথ হেঁটেছে, আর
                  Authoritative পরিষ্কার বলেছে এই নাম নেই। Resolver ঠিকই কাজ করছে।
                  সমস্যা বানানে, বা Record টা বসানোই হয়নি।
                </ListItem>
                <ListItem>
                  <strong>SERVFAIL:</strong> Resolver চেষ্টা করেছে কিন্তু উত্তর
                  আনতে পারেনি। সাধারণত Domain এর Name Server গুলো সাড়া দিচ্ছে না,
                  ভুল বসানো, অথবা DNSSEC এর সই মিলছে না। নামটা থাকতেও পারে, শুধু
                  পৌঁছানো যাচ্ছে না।
                </ListItem>
                <ListItem>
                  <strong>REFUSED:</strong> Resolver আপনার প্রশ্ন নিতেই রাজি নয়।
                  যেমন একটা প্রতিষ্ঠানের ভেতরের Resolver কে বাইরে থেকে জিজ্ঞেস
                  করলে।
                </ListItem>
                <ListItem>
                  <strong>কোনো উত্তরই না (timed out):</strong> Resolver পর্যন্ত
                  পৌঁছানোই যায়নি। হয় সে বন্ধ, নয়তো আপনার Internet ই নেই, অথবা
                  মাঝখানে কেউ Port 53 আটকে রেখেছে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "read-status.sh",
          code: `dig islandtours.example
# উত্তরের উপরের দিকে এই লাইনটা খুঁজুন:
#   ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 41234
#                                          ^^^^^^^ এটাই অবস্থা
# আর নিচের দিকে:
#   ;; flags: qr rd ra;
#   rd = Recursion Desired, আপনি পুরো উত্তর চেয়েছেন
#   ra = Recursion Available, সে Recursive Resolver হিসেবে কাজ করতে রাজি

# শুধু অবস্থাটুকু এক লাইনে
dig islandtours.example | grep status

# একটা নাম যেটা নেই
dig ei-namta-kothao-nei-12345.com | grep status     # status: NXDOMAIN`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সেই রোজকার অবস্থা, একটা সাইট খুলছে না, আর জানতে হবে দোষ কার।
              নিচের পাঁচ ধাপ এই ক্রমে চালালে দুই মিনিটে উত্তর মেলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "CHECK",
          steps: [
            {
              title: "Internet আছে তো?",
              description:
                "ping 8.8.8.8 চালান। এখানে কোনো নাম নেই, তাই DNS লাগে না। সাড়া এলে Internet ঠিক আছে, সমস্যা অন্য কোথাও। সাড়া না এলে DNS নিয়ে ভাবার দরকারই নেই, আগে Network ঠিক করুন।",
            },
            {
              title: "নিজের Resolver কী বলে?",
              description:
                "dig সাইটের নাম চালিয়ে status দেখুন। NOERROR আর একটা IP এলে DNS ঠিক আছে, সমস্যা সার্ভারে বা পথে। NXDOMAIN, SERVFAIL বা timed out এলে পরের ধাপে যান।",
            },
            {
              title: "অন্য Resolver কী বলে?",
              description:
                "একই প্রশ্ন @1.1.1.1 আর @8.8.8.8 দিয়ে করুন। তারা ঠিক উত্তর দিলে অথচ আপনারটা না দিলে, দোষ আপনার Resolver এর। সে হয় বন্ধ, নয় পুরনো উত্তর ধরে আছে, নয়তো সাইটটা আটকে রেখেছে।",
            },
            {
              title: "সবাই একই ভুল বলছে?",
              description:
                "তিনটা Resolver ই NXDOMAIN বা SERVFAIL দিলে সমস্যা Domain এর দিকে, কোনো Resolver এর নয়। তখন dig +trace চালিয়ে দেখুন হাঁটাটা কোন ধাপে থামছে, TLD তে নাকি Authoritative এ।",
            },
            {
              title: "সিদ্ধান্ত নিন",
              description:
                "দোষ নিজের Resolver এর হলে সাময়িকভাবে একটা Public Resolver বসিয়ে নিন। দোষ Domain এর হলে আর সেটা আপনার নিজের সাইট হলে, Registrar এ Name Server আর DNS পাতায় Record মিলিয়ে দেখুন। অন্যের সাইট হলে অপেক্ষা ছাড়া কিছু করার নেই।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Mobile Data তে খোলে, WiFi তে খোলে না",
          content: (
            <p>
              এই অভিযোগটা খুব চেনা, আর এর পেছনে প্রায়ই Resolver। WiFi তে আপনি
              ISP র Resolver ব্যবহার করছেন, Mobile Data তে অপারেটরের। দুইজনের
              খাতা আলাদা। একজনের কাছে পুরনো উত্তর রয়ে গেছে, বা একজন সাইটটা আটকে
              রেখেছে। উপরের তিন নম্বর ধাপটাই এখানে সরাসরি উত্তর দিয়ে দেয়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "project",
      subHeader: { index: "010", title: "Project Example" },
      title: <SectionTitle>Island Tours এর জন্য এর মানে কী</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর মালিক হিসেবে আপনি নিজের Authoritative server
                নিয়ন্ত্রণ করেন, সেখানে কী লেখা থাকবে তা আপনার হাতে। কিন্তু পর্যটকরা
                কোন Resolver ব্যবহার করবেন, সেটা আপনার হাতে নেই। এই একটা সত্য থেকে
                তিনটা বাস্তব শিক্ষা আসে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পর্যটকরা হাজারটা আলাদা Resolver দিয়ে আসেন:</strong>{" "}
                  কক্সবাজারের একজন তাঁর মোবাইল অপারেটরের Resolver ব্যবহার করছেন,
                  ঢাকার একজন ISP র, লন্ডনের একজন Google এর। প্রত্যেকের খাতা আলাদা,
                  প্রত্যেকে আলাদা সময়ে আপনার নাম শিখেছে। তাই আপনি একটা Record
                  বদলালে সবাই একসাথে নতুনটা দেখেন না।
                </ListItem>
                <ListItem>
                  <strong>আমার কাছে তো খুলছে, কোনো প্রমাণ নয়:</strong> আপনার
                  ল্যাপটপে সাইট খুলছে মানে শুধু আপনার Resolver ঠিক উত্তর জানে। একজন
                  পর্যটক অভিযোগ করলে তাঁকে অবিশ্বাস করবেন না। @1.1.1.1 আর @8.8.8.8
                  দিয়ে, আর সম্ভব হলে তাঁর দেশের একটা Resolver দিয়ে পরীক্ষা করুন।
                </ListItem>
                <ListItem>
                  <strong>আপনার সার্ভারও একজন গ্রাহক:</strong> বুকিং এর সময়
                  Backend যখন Payment সেবার API কে নাম ধরে ডাকে, তখন সার্ভার নিজেও
                  একটা Resolver কে জিজ্ঞেস করে। সেই Resolver ধীর বা বন্ধ হলে
                  প্রতিটা বুকিং ধীর হয় বা ব্যর্থ হয়, অথচ আপনার কোডে কোনো ভুল নেই।
                  সার্ভারে cat /etc/resolv.conf চালিয়ে জেনে রাখুন সে কাকে জিজ্ঞেস
                  করে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "আপনি সত্যটা লেখেন, Resolver সেটা বিলি করে",
          content: (
            <p>
              পুরো ছবিটা এক লাইনে রাখুন। Authoritative server এ আপনি যা লেখেন সেটা
              সত্য। আর পৃথিবীর হাজার হাজার Resolver সেই সত্যের নকল নিজেদের খাতায়
              রেখে মানুষের কাছে বিলি করে। আপনি সত্যটা এক মুহূর্তে বদলাতে পারেন,
              কিন্তু নকলগুলো বদলায় নিজেদের সময়ে। সেই সময়টা কে ঠিক করে, আর আপনি
              কীভাবে সেটা নিয়ন্ত্রণ করবেন, সেটাই পরের লেসন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "request-flow",
      subHeader: { index: "011", title: "Step-by-step Flow" },
      title: <SectionTitle>Resolver এর চোখ দিয়ে একটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এতদিন খোঁজটা দেখেছেন আপনার দিক থেকে। এবার Resolver এর জায়গায় বসুন।
              একজন পর্যটকের ফোন থেকে islandtours.example এর প্রশ্নটা এসে পৌঁছাল।
              এরপর সে কী কী করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নটা আসে",
              description:
                "পর্যটকের ফোনের Stub Resolver একটা Recursive প্রশ্ন পাঠায়, UDP র Port 53 তে: islandtours.example এর A Record কী? সাথে একটা চিহ্ন থাকে, Recursion Desired, মানে পুরো উত্তর চাই।",
            },
            {
              title: "আগে নিজের খাতা",
              description:
                "Resolver প্রথমেই দেখে এই উত্তরটা খাতায় আছে কি না, আর মেয়াদ বাকি আছে কি না। থাকলে এখানেই শেষ, সাথে সাথে উত্তর যায়। বেশিরভাগ প্রশ্ন এই ধাপেই মিটে যায়।",
            },
            {
              title: "কতটুকু জানা আছে",
              description:
                "পুরো উত্তর না থাকলে সে দেখে পথের কতটুকু জানা। islandtours.example এর Authoritative জানা থাকলে সোজা সেখানে। না থাকলে .example এর TLD জানা আছে কি না। কিছুই না থাকলে Root Hints থেকে একটা Root server বেছে নেয়।",
            },
            {
              title: "Iterative হাঁটা",
              description:
                "যেখান থেকে শুরু করা দরকার সেখান থেকে সে একটা একটা করে Iterative প্রশ্ন করে। প্রতিটা Referral এ পাওয়া Name Server এর ঠিকানা সে খাতায় তুলে রাখে, পরের বারের জন্য।",
            },
            {
              title: "আসল উত্তর, আর যাচাই",
              description:
                "Authoritative server আসল A Record দেয়, 103.94.135.2, সাথে একটা মেয়াদ। Domain এ DNSSEC চালু থাকলে Resolver সইটা মিলিয়ে দেখে। না মিললে সে SERVFAIL দেয়, ভুল উত্তর দেয় না।",
            },
            {
              title: "খাতায় লেখা, উত্তর ফেরত",
              description:
                "সে উত্তরটা মেয়াদ সহ খাতায় লেখে, তারপর পর্যটকের ফোনে পাঠায়, status NOERROR দিয়ে। পরের যে পর্যটক একই নাম চাইবেন, তিনি উত্তর পাবেন দ্বিতীয় ধাপেই।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "resources",
      subHeader: { index: "012", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিজের Resolver খুঁজে বের করুন</strong>, নিচের Lab এর প্রথম
                দুইটা পরীক্ষা চালালে আজই জানবেন এতদিন কে আপনার সব নাম খুঁজে
                দিচ্ছিল।
              </ListItem>
              <ListItem>
                <strong>Cloudflare Learning, DNS Server Types</strong>, Recursive
                Resolver, Root, TLD আর Authoritative এর ভূমিকা ছবি সহ।{" "}
                <a
                  href="https://www.cloudflare.com/learning/dns/dns-server-types/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cloudflare.com/learning/dns/dns-server-types
                </a>
              </ListItem>
              <ListItem>
                <strong>1.1.1.1 এর সেটআপ নির্দেশিকা</strong>, প্রতিটা যন্ত্র আর
                Router এর জন্য ধাপে ধাপে, ছবি সহ।{" "}
                <a
                  href="https://one.one.one.one"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  one.one.one.one
                </a>
              </ListItem>
              <ListItem>
                <strong>Root Server এর মানচিত্র</strong>, ১৩টা নামের পেছনে
                পৃথিবীজুড়ে কত জায়গায় Root server আছে, নিজের চোখে।{" "}
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
    /* --------------------------------------------------------------- 13 */
    {
      id: "recap",
      subHeader: { index: "013", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Recursive Resolver</strong> আপনার হয়ে পুরো DNS খোঁজটা সেরে
                আসে। তার নিজের কোনো Record নেই, সে শুধু খোঁজে আর মনে রাখে। আপনার
                যন্ত্রের <strong>Stub Resolver</strong> শুধু প্রশ্নটা পাঠায়।
              </ListItem>
              <ListItem>
                যন্ত্র থেকে Resolver এ যায় <strong>Recursive</strong> প্রশ্ন (পুরো
                উত্তর চাই)। Resolver থেকে Root, TLD তে যায়{" "}
                <strong>Iterative</strong> প্রশ্ন, ফেরত আসে Referral।
              </ListItem>
              <ListItem>
                আপনার Resolver এর ঠিকানা দেয় DHCP। বাসায় সেটা সাধারণত Router, যে
                একজন Forwarder, আসল Resolver থাকে ISP র কাছে।
              </ListItem>
              <ListItem>
                Root এর ঠিকানা আগে থেকে লেখা থাকে, <strong>Root Hints</strong> এ।
                Resolver পথের প্রতিটা ধাপ মনে রাখে, তাই পুরো হাঁটা কমই লাগে।
              </ListItem>
              <ListItem>
                Public Resolver: Google 8.8.8.8, Cloudflare 1.1.1.1, Quad9 9.9.9.9।
                একই ঠিকানা পৃথিবীজুড়ে বহু জায়গায়, Anycast এর জোরে।
              </ListItem>
              <ListItem>
                Resolver বদলানো যায় একটা যন্ত্রে, বা Router এ পুরো বাসার জন্য।
                কিছু না বদলে পরীক্ষা করতে dig এর সাথে @ঠিকানা।
              </ListItem>
              <ListItem>
                Resolver আপনার সব নাম দেখে আর উত্তর বদলাতে পারে। সাধারণ DNS খোলা
                লেখায় যায়, DoH আর DoT সেটাকে তালাবদ্ধ করে। Browser এর Secure DNS
                যন্ত্রের সেটিং পাশ কাটাতে পারে।
              </ListItem>
              <ListItem>
                status পড়ুন: NOERROR ঠিক, NXDOMAIN নাম নেই, SERVFAIL আনতে পারেনি,
                REFUSED নিতে রাজি নয়, timed out পৌঁছানোই যায়নি।
              </ListItem>
              <ListItem>
                পরের লেসন: Resolver কতক্ষণ মনে রাখে, আর কে ঠিক করে, DNS Cache আর
                TTL।
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
        <span className="font-bold text-primary">Recursive Resolver</span>,
        "আপনার হয়ে Root, TLD, Authoritative ঘুরে পুরো উত্তর আনে",
      ],
      [
        <span className="font-bold text-primary">Stub Resolver</span>,
        "যন্ত্রের ভেতরের ছোট অংশ, শুধু প্রশ্ন পাঠায়",
      ],
      [
        <span className="font-bold text-primary">Recursive প্রশ্ন</span>,
        "পুরো উত্তর চাই, যন্ত্র থেকে Resolver এ",
      ],
      [
        <span className="font-bold text-primary">Iterative প্রশ্ন</span>,
        "যতটুকু জানেন বলুন, Resolver থেকে বাকিদের কাছে, ফেরত আসে Referral",
      ],
      [
        <span className="font-bold text-primary">Forwarder</span>,
        "নিজে খোঁজে না, প্রশ্ন এগিয়ে দেয়, যেমন বাসার Router",
      ],
      [
        <span className="font-bold text-primary">Root Hints</span>,
        "Resolver এ আগে থেকে লেখা ১৩টা Root server এর ঠিকানা",
      ],
      [
        <span className="font-bold text-primary">Public Resolver</span>,
        "8.8.8.8, 1.1.1.1, 9.9.9.9, সবার জন্য খোলা",
      ],
      [
        <span className="font-bold text-primary">DoH / DoT</span>,
        "তালাবদ্ধ DNS, Port 443 আর Port 853",
      ],
      [
        <span className="font-bold text-primary">SERVFAIL</span>,
        "Resolver চেষ্টা করেও উত্তর আনতে পারেনি",
      ],
      [
        <span className="font-bold text-primary">dig @ঠিকানা</span>,
        "কিছু না বদলে অন্য Resolver কে একবার জিজ্ঞেস করা",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Recursive Resolver এর নিজের কাছে কি islandtours.example এর আসল Record থাকে?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, সব Domain এর Record তার কাছে জমা থাকে",
            isCorrect: false,
            explanation:
              "না। আসল Record থাকে শুধু Authoritative server এ। Resolver এর কাছে থাকে বড়জোর একটা নকল, তাও কিছুক্ষণের জন্য।",
          },
          {
            key: "B",
            text: "না, সে শুধু খুঁজে আনে আর কিছুক্ষণ মনে রাখে",
            isCorrect: true,
            explanation:
              "ঠিক। Resolver কোনো নামের মালিক নয়। সে জানে কীভাবে খুঁজতে হয়, আর যা পায় তা Cache এ রাখে।",
          },
          {
            key: "C",
            text: "শুধু .com নামগুলোর Record থাকে",
            isCorrect: false,
            explanation: "কোনো TLD এর জন্যই থাকে না।",
          },
        ],
      },
      {
        id: 2,
        text: "আপনার ল্যাপটপে DNS server হিসেবে 192.168.1.1 দেখাচ্ছে। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "Router নিজেই Root থেকে পুরো খোঁজ করে",
            isCorrect: false,
            explanation:
              "বাসার Router সাধারণত নিজে খোঁজে না, সে একজন Forwarder।",
          },
          {
            key: "B",
            text: "প্রশ্নটা Router এ যায়, আর Router সেটা আসল Resolver এর কাছে এগিয়ে দেয়",
            isCorrect: true,
            explanation:
              "ঠিক। Router একজন Forwarder। আসল Recursive Resolver সাধারণত ISP র, Router এর এক ধাপ পেছনে।",
          },
          {
            key: "C",
            text: "DNS বন্ধ আছে",
            isCorrect: false,
            explanation: "না, এটা বাসার Network এর একদম স্বাভাবিক অবস্থা।",
          },
        ],
      },
      {
        id: 3,
        text: "Resolver সবে islandtours.example খুঁজে এনেছে। এবার api.islandtours.example চাইলে তাকে কোথা থেকে শুরু করতে হবে?",
        options: [
          {
            key: "A",
            text: "আবার Root থেকে",
            isCorrect: false,
            explanation:
              "দরকার নেই। পথের ধাপগুলো তার খাতায় আছে।",
          },
          {
            key: "B",
            text: "সোজা islandtours.example এর Authoritative server থেকে",
            isCorrect: true,
            explanation:
              "ঠিক। সে আগের খোঁজে জেনে গেছে এই Domain এর Authoritative কে, তাই Root আর TLD বাদ।",
          },
          {
            key: "C",
            text: "কোথাও যেতে হবে না, উত্তর খাতাতেই আছে",
            isCorrect: false,
            explanation:
              "api একটা আলাদা নাম, তার নিজের উত্তর এখনো খাতায় নেই। শুধু পথটা জানা।",
          },
        ],
      },
      {
        id: 4,
        text: "dig islandtours.example দিচ্ছে SERVFAIL, কিন্তু dig @1.1.1.1 islandtours.example ঠিক IP দিচ্ছে। সমস্যা কোথায়?",
        options: [
          {
            key: "A",
            text: "আপনার নিজের Resolver এ",
            isCorrect: true,
            explanation:
              "ঠিক। অন্য Resolver ঠিক উত্তর আনতে পারছে, মানে Domain ঠিক আছে। আপনার Resolver কোনো কারণে আনতে পারছে না।",
          },
          {
            key: "B",
            text: "Domain এর Authoritative server এ",
            isCorrect: false,
            explanation:
              "তা হলে 1.1.1.1 ও উত্তর আনতে পারত না।",
          },
          {
            key: "C",
            text: "নামটার অস্তিত্বই নেই",
            isCorrect: false,
            explanation: "তা হলে উত্তর হতো NXDOMAIN, আর সব Resolver একই বলত।",
          },
        ],
      },
      {
        id: 5,
        text: "NXDOMAIN আর SERVFAIL এর তফাত কী?",
        options: [
          {
            key: "A",
            text: "দুইটা একই জিনিস",
            isCorrect: false,
            explanation: "না, দুইটা সম্পূর্ণ আলাদা অবস্থা বোঝায়।",
          },
          {
            key: "B",
            text: "NXDOMAIN মানে খোঁজ সফল আর উত্তর হলো নামটা নেই, SERVFAIL মানে খোঁজটাই সফল হয়নি",
            isCorrect: true,
            explanation:
              "ঠিক। NXDOMAIN একটা নিশ্চিত উত্তর। SERVFAIL মানে Resolver জানেই না, কারণ সে উত্তর আনতে পারেনি।",
          },
          {
            key: "C",
            text: "NXDOMAIN মানে Internet নেই",
            isCorrect: false,
            explanation:
              "Internet না থাকলে কোনো উত্তরই আসে না, timed out হয়।",
          },
        ],
      },
      {
        id: 6,
        text: "Terminal এ dig ঠিক নতুন IP দিচ্ছে, কিন্তু Chrome পুরনো সাইট দেখাচ্ছে। Resolver সম্পর্কিত কোন কারণটা আগে দেখবেন?",
        options: [
          {
            key: "A",
            text: "Chrome এর Secure DNS চালু, সে যন্ত্রের Resolver পাশ কাটিয়ে অন্য একটাকে জিজ্ঞেস করছে",
            isCorrect: true,
            explanation:
              "ঠিক। Secure DNS চালু থাকলে Browser নিজের DoH Resolver ব্যবহার করে, যার খাতায় পুরনো উত্তর থাকতে পারে। সাথে Browser এর নিজের Cache ও দেখুন।",
          },
          {
            key: "B",
            text: "Root server বন্ধ",
            isCorrect: false,
            explanation: "তা হলে dig ও উত্তর পেত না।",
          },
          {
            key: "C",
            text: "Domain এর মেয়াদ শেষ",
            isCorrect: false,
            explanation: "তা হলে dig নতুন IP দিত না।",
          },
        ],
      },
      {
        id: 7,
        text: "সাধারণ DNS প্রশ্ন (DoH বা DoT ছাড়া) পথে কীভাবে যায়?",
        options: [
          {
            key: "A",
            text: "খোলা লেখায়, UDP র Port 53 দিয়ে, যে কেউ পথে পড়তে পারে",
            isCorrect: true,
            explanation:
              "ঠিক। এই কারণেই DoH (Port 443) আর DoT (Port 853) এসেছে, প্রশ্নগুলোকে তালাবদ্ধ করতে।",
          },
          {
            key: "B",
            text: "সবসময় এনক্রিপ্ট করা, Port 443 দিয়ে",
            isCorrect: false,
            explanation: "এটা DoH এর বর্ণনা, সাধারণ DNS এর নয়।",
          },
          {
            key: "C",
            text: "ইমেইলের মাধ্যমে",
            isCorrect: false,
            explanation: "না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের Resolver কে চিনুন",
    subtitle: "Terminal এ ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "যন্ত্র কাকে জিজ্ঞেস করে",
        description:
          "নিজের Operating System এর কমান্ড দিয়ে DNS ঠিকানাটা বের করুন। এটা কি Router এর ঠিকানা?",
      },
      {
        title: "আসল Resolver কে",
        description:
          "Router এর পেছনের আসল Recursive Resolver এর IP বের করুন, আর দেখুন সেটা কোন প্রতিষ্ঠানের।",
      },
      {
        title: "Cache এর গতি নিজের চোখে",
        description:
          "একটা অচেনা নাম পরপর দুইবার জিজ্ঞেস করে Query time এর তফাত দেখুন।",
      },
      {
        title: "তিন Resolver এর তুলনা",
        description:
          "একই প্রশ্ন নিজের, Cloudflare এর আর Google এর Resolver কে করে উত্তর আর সময় মিলিয়ে দেখুন।",
      },
      {
        title: "চার রকম status",
        description:
          "ইচ্ছা করে NOERROR, NXDOMAIN, REFUSED আর timed out ঘটিয়ে প্রতিটা চিনে নিন।",
      },
      {
        title: "নিজেই Resolver হয়ে দেখুন",
        description:
          "Recursion বন্ধ করে একটা একটা ধাপ নিজে হাঁটুন, Root থেকে Authoritative পর্যন্ত।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-my-dns.sh",
        language: "bash",
        code: `# macOS
scutil --dns | grep nameserver | sort -u

# Linux
resolvectl status | grep "DNS Servers"

# Windows
ipconfig /all | findstr /C:"DNS Servers"

# যেকোনো জায়গায়
dig google.com | grep SERVER
# উত্তরটা নিজের Gateway র ঠিকানার সাথে মিলিয়ে দেখুন।
# মিললে আপনার Router একজন Forwarder।`,
      },
      {
        filename: "2-real-resolver.sh",
        language: "bash",
        code: `# Authoritative এর চোখে প্রশ্নটা কোন IP থেকে এসেছিল
dig +short TXT o-o.myaddr.l.google.com
dig +short whoami.akamai.net

# IP টা কার
whois <উপরের IP> | grep -i -E "orgname|org-name|descr|netname"

# এবার একই প্রশ্ন Cloudflare দিয়ে, IP টা বদলে যাবে
dig +short TXT o-o.myaddr.l.google.com @1.1.1.1`,
      },
      {
        filename: "3-cache-speed.sh",
        language: "bash",
        code: `# এমন একটা নাম বাছুন যেটা আজ সম্ভবত কেউ খোঁজেনি
dig archive.org | grep "Query time"
dig archive.org | grep "Query time"

# প্রথমবার হয়তো ৫০ থেকে ৩০০ মিলিসেকেন্ড (Resolver কে হাঁটতে হয়েছে)
# দ্বিতীয়বার ০ থেকে ২০ মিলিসেকেন্ড (খাতা থেকে)
# তফাতটাই Resolver এর স্মৃতির দাম।`,
      },
      {
        filename: "4-compare.sh",
        language: "bash",
        code: `# প্রতিটা দুইবার চালান, দ্বিতীয়বারের সময়টা ধরুন
dig github.com            | grep -E "Query time|SERVER"
dig @1.1.1.1 github.com   | grep -E "Query time|SERVER"
dig @8.8.8.8 github.com   | grep -E "Query time|SERVER"
dig @9.9.9.9 github.com   | grep -E "Query time|SERVER"

# উত্তরের IP গুলোও মিলিয়ে দেখুন
dig +short github.com
dig +short @1.1.1.1 github.com
# বড় সাইটের ক্ষেত্রে IP আলাদা হতে পারে, কারণ তারা প্রশ্নকারীর
# জায়গা দেখে কাছের সার্ভারের ঠিকানা দেয়। এটা ভুল নয়।`,
      },
      {
        filename: "5-status.sh",
        language: "bash",
        code: `# NOERROR: সব ঠিক
dig google.com | grep status

# NXDOMAIN: নাম নেই
dig ei-namta-kothao-nei-12345.com | grep status

# REFUSED: এমন server কে জিজ্ঞেস, যে এই নামের দায়িত্বে নেই
# আর অন্যের হয়ে খুঁজতেও রাজি নয়
dig @ns1.google.com wikipedia.org | grep status

# Root কে পুরো উত্তর চাইলে কী হয়
dig @a.root-servers.net google.com | grep -E "status|recursion"
# লেখা থাকবে recursion requested but not available, আর উত্তরের
# জায়গায় শুধু Referral। Root পুরো কাজ করে দেয় না।

# timed out: এমন ঠিকানা যেখানে কোনো Resolver নেই
dig @192.0.2.1 google.com +time=2 +tries=1
# কোনো status ই আসবে না, শুধু জানাবে পৌঁছানো যায়নি।`,
      },
      {
        filename: "6-be-the-resolver.sh",
        language: "bash",
        code: `# +norecurse মানে: পুরো কাজ করে দেবেন না, যতটুকু জানেন বলুন।
# এটাই Iterative প্রশ্ন। তিন ধাপ নিজে হাঁটুন।

# ধাপ ১: Root কে জিজ্ঞেস। উত্তরে আসবে .org এর TLD server দের নাম
dig +norecurse @a.root-servers.net wikipedia.org

# ধাপ ২: সেই তালিকার একজনকে জিজ্ঞেস। আসবে wikipedia.org এর Name Server
dig +norecurse @a0.org.afilias-nst.info wikipedia.org

# ধাপ ৩: সেই Name Server কে জিজ্ঞেস। এবার আসল উত্তর
dig +norecurse @ns0.wikimedia.org wikipedia.org

# প্রথম দুই ধাপে ANSWER SECTION নেই, আছে AUTHORITY SECTION (Referral)।
# শেষ ধাপে ANSWER SECTION, আর flags এ aa, মানে Authoritative Answer।
# এইমাত্র আপনি হাতে সেটাই করলেন যা Resolver প্রতি সেকেন্ডে হাজার বার করে।`,
      },
    ],
    tip: "ছয় নম্বর পরীক্ষাটা না করে উঠবেন না। আগের লেসনে dig +trace পুরো হাঁটাটা নিজে করে দেখিয়েছিল। এখানে আপনি নিজে হাঁটছেন, প্রতিটা ধাপে নিজে ঠিক করছেন এরপর কাকে জিজ্ঞেস করবেন। প্রথম দুই উত্তরে শুধু দিকনির্দেশ, শেষেরটায় আসল উত্তর। এই তিনটা কমান্ড একবার নিজের হাতে চালালে Recursive আর Iterative এর তফাত আর কখনো ভুলবেন না। দ্বিতীয় আর তৃতীয় ধাপের server এর নাম বদলে গিয়ে থাকলে, আগের ধাপের উত্তরে যে নামগুলো পাবেন তার একটা বসিয়ে নিন।",
  },
  assignment: {
    title: "Mini Project: নিজের Resolver এর পরিচয়পত্র",
    time: "৬০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>পরিচয় বের করুন:</strong> আপনার যন্ত্র কোন DNS ঠিকানায় জিজ্ঞেস
        করে, সেটা কি Router, আর তার পেছনের আসল Resolver এর IP কী আর সেটা কোন
        প্রতিষ্ঠানের, লিখুন। একই কাজ ফোনের Mobile Data দিয়ে Hotspot করে আবার
        করুন। দুইটা কি আলাদা?
      </span>,
      <span key="2">
        <strong>গতি মাপুন:</strong> পাঁচটা সাইট বেছে নিন। প্রতিটার জন্য নিজের
        Resolver, 1.1.1.1, 8.8.8.8 আর 9.9.9.9 এর Query time (দ্বিতীয়বারের) একটা
        ছকে লিখুন। আপনার জায়গা থেকে কোনটা সবচেয়ে দ্রুত?
      </span>,
      <span key="3">
        <strong>একটা যন্ত্রে বদলান:</strong> নিজের ল্যাপটপ বা ফোনে Resolver বদলে
        সবচেয়ে দ্রুতটা বসান। dig এর SERVER লাইন দিয়ে প্রমাণ করুন বদলটা কাজ করেছে।
        তারপর আগের অবস্থায় ফেরানোর কমান্ড বা ধাপগুলোও লিখে রাখুন।
      </span>,
      <span key="4">
        <strong>হাতে হাঁটুন:</strong> নিজের পছন্দের একটা Domain নিয়ে +norecurse
        দিয়ে Root থেকে Authoritative পর্যন্ত তিন ধাপ হাঁটুন। প্রতিটা ধাপে কাকে
        জিজ্ঞেস করলেন আর সে কার কাছে পাঠাল, লিখুন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় লিখুন (৬ লাইন):</strong> একজন বন্ধু বললেন, একটা সাইট
        আমার WiFi তে খুলছে না কিন্তু Mobile Data তে খুলছে। তাঁকে বোঝান Resolver
        কী, কেন এমন হতে পারে, আর কোন তিনটা কমান্ড চালিয়ে তিনি নিজে কারণটা বের
        করতে পারবেন।
      </span>,
    ],
    deliverables: [
      <span key="1">WiFi আর Mobile Data র Resolver এর IP আর মালিক</span>,
      <span key="2">পাঁচ সাইট, চার Resolver এর Query time এর ছক</span>,
      <span key="3">বদলের প্রমাণ (SERVER লাইন) আর ফেরানোর ধাপ</span>,
      <span key="4">হাতে হাঁটা তিন ধাপের নোট</span>,
      <span key="5">বন্ধুর জন্য ব্যাখ্যা, ৬ লাইনে</span>,
    ],
  },
};
