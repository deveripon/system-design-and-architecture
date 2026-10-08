/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import { TtlClockLab } from "../../../components/course/topics/dns/cache-animations";
import {
  CacheLayersDiagram,
  MigrationTimelineDiagram,
  TtlTradeoffSplit,
} from "../../../components/course/topics/dns/cache-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const dnsCacheTtlContent: TopicData = {
  id: "dns-cache-ttl",
  introduction: {
    badge: "MODULE 04 · LESSON 05",
    title: <SectionTitle>উত্তরটা কতক্ষণ মনে থাকে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে দেখেছিলেন, একটা নামের IP খুঁজতে Resolver কে Root, TLD আর
          Authoritative, তিন জায়গায় হাঁটতে হয়। আর একটা কথা বলে রেখেছিলাম, এই
          পুরো হাঁটা বাস্তবে খুব কমই লাগে, কারণ উত্তর মনে রাখা হয়। এই লেসন সেই মনে
          রাখার গল্প।
        </ContentParagraph>
        <ContentParagraph>
          দুইটা প্রশ্নের উত্তর খুঁজব। এক, উত্তরটা কে কে মনে রাখে, কোথায় কোথায়?
          দুই, কতক্ষণ মনে রাখে, আর সেই সময়টা ঠিক করে কে? দ্বিতীয় প্রশ্নের উত্তর
          একটা ছোট সংখ্যা, নাম TTL, আর এই একটা সংখ্যা না বুঝলে DNS নিয়ে কাজ করতে
          গিয়ে বারবার হোঁচট খেতে হয়।
        </ContentParagraph>
        <ContentParagraph>
          সাইটের IP বদলালেন, অথচ নিজের Laptop এ এখনো পুরনো সাইট খুলছে, বন্ধুর
          Phone এ নতুনটা। এই চেনা ধাঁধাটার পুরো ব্যাখ্যা এই লেসনে। শেষে আপনি নিজে
          Cache মুছতে, TTL পড়তে, আর কোনো ঝামেলা ছাড়া সার্ভার বদলের পরিকল্পনা করতে
          পারবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "DNS এর উত্তর দুধের প্যাকেটের মতো, গায়ে একটা মেয়াদ লেখা থাকে। মেয়াদের আগে কেউ আর দোকানে যায় না, ঘরেরটাই খায়। আর দোকানদার দাম বদলালেও, ঘরের প্যাকেট সেটা জানে না।",
      author: "DNS",
      role: "Lesson 05",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-cache",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>প্রতিবার হাঁটলে চলত না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Website খুলতে গেলে শুধু একটা নাম নয়, প্রায়ই ডজনখানেক নাম
                খুঁজতে হয়, ছবির জন্য একটা, Font এর জন্য একটা, বিজ্ঞাপনের জন্য
                আরও কয়েকটা। প্রতিটার জন্য যদি তিন ধাপের হাঁটা লাগত, প্রতিটা পেজ
                খুলতে কয়েক সেকেন্ড বাড়তি লাগত, আর Root server গুলো প্রশ্নের চাপে
                ডুবে যেত।
              </ContentParagraph>
              <ContentParagraph>
                সমাধানটা খুব মানুষের মতো। একবার কারো ফোন নম্বর জেনে গেলে আপনি
                প্রতিবার ফোনবুক খোলেন না, মনে রাখেন বা ফোনে টুকে রাখেন। DNS ও
                তাই করে, একবার পাওয়া উত্তর কিছুক্ষণ টুকে রাখে। এই টুকে রাখা
                জায়গার নাম Cache।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Cache শব্দটা আগেও দেখেছেন",
          content: (
            <p>
              Module 01 এ CPU আর Memory র লেসনে Cache এসেছিল, ধীর জায়গার জিনিস
              দ্রুত জায়গায় কপি করে রাখা। ARP এর লেসনেও ছিল, IP থেকে MAC এর উত্তর
              মনে রাখা। ধারণাটা প্রতিবার একই, যেটা জোগাড় করতে কষ্ট, সেটা একবার
              জোগাড় করে কাছে রেখে দাও। DNS Cache সেই একই বুদ্ধি, শুধু জিনিসটা
              এবার নাম থেকে IP র উত্তর।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "layers",
      subHeader: { index: "002", title: "Where It Lives" },
      title: <SectionTitle>এক জায়গায় নয়, চার জায়গায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখানে একটা জিনিস অনেকে জানে না, আর না জানার কারণেই বিভ্রান্ত হয়।
              উত্তরটা শুধু এক জায়গায় মনে রাখা হয় না। আপনার Browser থেকে Resolver
              পর্যন্ত পথে চারটা আলাদা জায়গায় চারটা আলাদা খাতা আছে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CacheLayersDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Browser Cache:</strong> Chrome, Firefox, প্রত্যেকের নিজের
                একটা ছোট খাতা আছে। সাধারণত খুব অল্প সময়, মিনিটখানেক মনে রাখে।
                একই সাইটের পরের ক্লিকগুলো এখান থেকেই উত্তর পায়।
              </ListItem>
              <ListItem>
                <strong>Operating System Cache:</strong> আপনার যন্ত্রের নিজের
                খাতা, সব App এর জন্য এক। Browser না জানলে এখানে জিজ্ঞেস করে। এখানে
                আরেকটা জিনিসও আছে, hosts নামের একটা ফাইল, যেখানে হাতে লিখে রাখা নাম
                সবার আগে মানা হয়।
              </ListItem>
              <ListItem>
                <strong>Router Cache:</strong> বাসার Router ও প্রায়ই একটা ছোট খাতা
                রাখে, যাতে বাসার সব যন্ত্রের জন্য একই উত্তর বারবার আনতে না হয়।
              </ListItem>
              <ListItem>
                <strong>Resolver Cache:</strong> সবচেয়ে বড় খাতা। আপনার ISP এর
                Resolver, বা Google এর 8.8.8.8, Cloudflare এর 1.1.1.1 এর মতো
                Public Resolver, লাখ লাখ মানুষের প্রশ্নের উত্তর মনে রাখে। এই
                খাতাটা আপনার যন্ত্রে নয়, তাই আপনি নিজে মুছতে পারেন না।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এই কারণেই দুই যন্ত্রে দুই রকম দেখায়",
          content: (
            <p>
              সাইটের IP বদলানোর পর আপনার Laptop এ পুরনো সাইট, অথচ Phone এ নতুন।
              কারণটা এখন পরিষ্কার, দুই যন্ত্রের খাতা আলাদা, আর দুইটা হয়তো আলাদা
              Resolver ও ব্যবহার করছে (Laptop বাসার Wi-Fi তে, Phone Mobile Data
              তে)। যার খাতায় পুরনো লেখাটা এখনো আছে, সে পুরনোটাই দেখে। কিছু ভাঙেনি,
              শুধু সবার খাতা একসাথে হালনাগাদ হয় না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "ttl",
      subHeader: { index: "003", title: "TTL" },
      title: <SectionTitle>TTL, উত্তরের গায়ে লেখা মেয়াদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন বড় প্রশ্ন, কতক্ষণ মনে রাখবে? চিরদিন রাখলে তো IP বদলালে কেউ
                কখনো জানতেই পারত না। তাই প্রতিটা উত্তরের সাথে একটা সংখ্যা জুড়ে
                দেওয়া হয়, এই উত্তর এত সেকেন্ড পর্যন্ত মনে রাখতে পারেন, তারপর আবার
                জিজ্ঞেস করবেন। এই সংখ্যার নাম TTL, পুরো নাম Time To Live।
              </ContentParagraph>
              <ContentParagraph>
                TTL লেখা হয় সেকেন্ডে। 300 মানে পাঁচ মিনিট, 3600 মানে এক ঘণ্টা,
                86400 মানে পুরো এক দিন। আর সবচেয়ে জরুরি কথা, এই সংখ্যাটা ঠিক করে
                Domain এর মালিক, মানে আপনি, যখন Record বসান। Resolver নিজে থেকে
                কিছু ঠিক করে না, সে শুধু মেনে চলে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ একটা পরিস্থিতি সাজানো আছে। Resolver পুরনো IP টা মনে
                রাখল, আর ঠিক তারপরেই মালিক IP বদলে ফেললেন। সময় এগিয়ে দেখুন,
                Resolver কখন টের পায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TtlClockLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "TTL একটা উল্টো ঘড়ি",
          content: (
            <p>
              Resolver উত্তর পাওয়ার মুহূর্তে ঘড়িটা চালু করে, আর সেটা গুনতে থাকে
              নিচের দিকে, 300, 299, 298। শূন্য হলে সে লেখাটা ফেলে দেয়। কেউ এরপর ওই
              নাম জিজ্ঞেস করলে সে আবার নতুন করে খুঁজতে যায়। খেয়াল করুন, ঘড়িটা
              শেষ না হওয়া পর্যন্ত সে একবারও জিজ্ঞেস করে না আসল ঠিকানা বদলেছে কি
              না। মালিক বদলালেও সে জানার কোনো উপায় নেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "choosing",
      subHeader: { index: "004", title: "Choosing a TTL" },
      title: <SectionTitle>কত TTL দেবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              TTL ছোট দেবেন নাকি বড়, এর কোনো এক কথার উত্তর নেই, কারণ দুই দিকেই
              কিছু পাওয়া আর কিছু হারানো আছে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TtlTradeoffSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>৩০০ (৫ মিনিট):</strong> যখন কিছু বদলাতে যাচ্ছেন, বা
                জিনিসটা এখনো পরীক্ষার পর্যায়ে। ভুল হলে পাঁচ মিনিটে শুধরে যায়।
              </ListItem>
              <ListItem>
                <strong>৩৬০০ (১ ঘণ্টা):</strong> সাধারণ দিনের জন্য একটা ভালো
                মাঝামাঝি। বেশিরভাগ Website এর মূল Record এ এটাই দেখবেন।
              </ListItem>
              <ListItem>
                <strong>৮৬৪০০ (১ দিন):</strong> যে জিনিস প্রায় কখনো বদলায় না,
                যেমন Name Server এর Record বা ইমেইলের Record। এগুলো বড় রাখাই
                নিয়ম।
              </ListItem>
              <ListItem>
                <strong>Auto:</strong> অনেক DNS সেবায় (যেমন Cloudflare) একটা Auto
                বিকল্প থাকে, যেটা সাধারণত ৫ মিনিটের মতো একটা মান নিজে বসিয়ে দেয়।
                শুরুতে এটা রেখে দিলে ক্ষতি নেই।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "খুব ছোট TTL সবাই মানে না",
          content: (
            <p>
              কেউ কেউ ভাবেন, TTL ১ সেকেন্ড করে দিলে বদল সাথে সাথে পৌঁছাবে। বাস্তবে
              অনেক Resolver খুব ছোট TTL মানে না, নিজে থেকে একটা ন্যূনতম সময়
              (যেমন ৩০ সেকেন্ড বা ১ মিনিট) ধরে রাখে, নাহলে তাদের উপর চাপ অসহ্য
              হতো। তাই ৬০ এর নিচে নামিয়ে লাভ প্রায় নেই। বাস্তব দুনিয়ায় সবচেয়ে
              ছোট কাজের মান ধরুন ৬০ থেকে ৩০০।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "plan-change",
      subHeader: { index: "005", title: "Planning a Change" },
      title: <SectionTitle>ঝামেলা ছাড়া IP বদলানো, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এটাই TTL জানার সবচেয়ে বড় ব্যবহার। ধরুন Island Tours কে পুরনো
                সার্ভার থেকে নতুন সার্ভারে সরাবেন, IP বদলাবে। TTL না বুঝে শুধু IP
                বদলে দিলে, যাদের Cache এ পুরনো ঠিকানা আছে তারা ঘণ্টার পর ঘণ্টা
                পুরনো সার্ভারেই যাবে। সঠিক নিয়মটা একটা সময়রেখা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MigrationTimelineDiagram /> },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "এখনকার TTL দেখে নিন",
              description:
                "আগে জানুন Record টার TTL এখন কত। নিচের অংশের dig কমান্ড দিয়ে Authoritative কে জিজ্ঞেস করলে আসল মানটা দেখা যায়। ধরুন পেলেন 86400, মানে এক দিন। এই সংখ্যাটা লিখে রাখুন, পরে লাগবে।",
            },
            {
              title: "বদলের আগেই TTL ছোট করুন",
              description:
                "DNS এর Record পাতায় গিয়ে শুধু TTL টা বদলে 300 করুন। IP এখনো ছোঁবেন না। এই কাজটা বদলের দিনের অন্তত এক দুই দিন আগে করুন।",
            },
            {
              title: "পুরনো TTL পার হওয়া পর্যন্ত অপেক্ষা",
              description:
                "এই ধাপটাই সবাই বাদ দেয়। যাদের Cache এ এখনো পুরনো উত্তর আছে, তাদের ঘড়িতে তো আগের বড় TTL চলছে। তাই আগের মানটা যত ছিল (এখানে এক দিন), ততক্ষণ অপেক্ষা করুন। এরপর দুনিয়ার সব Cache এ ছোট TTL বসে গেছে।",
            },
            {
              title: "নতুন সার্ভার তৈরি রেখে IP বদলান",
              description:
                "নতুন সার্ভারে সাইট পুরোপুরি চালু আছে নিশ্চিত হয়ে তবেই Record এর IP বদলান। এখন TTL ছোট, তাই পাঁচ মিনিটের মধ্যে প্রায় সবাই নতুন ঠিকানায় চলে আসবে।",
            },
            {
              title: "যাচাই করুন, পুরনো সার্ভার চালু রাখুন",
              description:
                "dig দিয়ে মিলিয়ে নিন নতুন IP আসছে কি না। পুরনো সার্ভারটা অন্তত এক দুই দিন চালু রাখুন, কারণ কিছু জেদি Cache দেরিতে ছাড়ে। কোনো গড়বড় দেখলে IP আবার পুরনোটায় ফেরান, পাঁচ মিনিটে ফিরে যাবে।",
            },
            {
              title: "সব ঠিক থাকলে TTL আবার বড় করুন",
              description:
                "কয়েক দিন সব ঠিক চললে TTL আবার 3600 বা তার বেশি করে দিন, যাতে সাধারণ দিনে উত্তর দ্রুত পাওয়া যায় আর Name Server এ চাপ কম থাকে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "TTL ছোট করা আর IP বদলানো একসাথে নয়",
          content: (
            <p>
              সবচেয়ে চেনা ভুল, একই সাথে TTL ছোট করা আর IP বদলে ফেলা। এতে কোনো লাভ
              হয় না, কারণ যাদের কাছে পুরনো উত্তর আছে, তাদের খাতায় তো পুরনো বড় TTL
              ই লেখা, তারা নতুন TTL এর খবরই পায়নি। TTL ছোট করার কাজটা আগে, আলাদা
              করে, আর তারপর অপেক্ষা। এই ক্রমটাই পুরো কৌশল।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "read-ttl",
      subHeader: { index: "006", title: "Reading TTL" },
      title: <SectionTitle>dig দিয়ে TTL পড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              TTL কোনো লুকানো জিনিস নয়, প্রতিটা DNS উত্তরের ভেতরেই লেখা থাকে। dig
              এর উত্তরে দ্বিতীয় ঘরের সংখ্যাটাই TTL। কীভাবে পড়তে হয় দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "read-ttl.sh",
          code: `# সাধারণভাবে জিজ্ঞেস করুন (Resolver এর Cache থেকে আসবে)
dig example.com

# ANSWER SECTION এ এমন একটা লাইন পাবেন:
#   example.com.    247    IN    A    93.184.215.14
#                   ^^^
#   এই দ্বিতীয় সংখ্যাটাই TTL, মানে Cache এ আর 247 সেকেন্ড বাকি।

# কয়েক সেকেন্ড পর আবার চালান:
dig example.com
#   example.com.    239    IN    A    93.184.215.14
#   সংখ্যাটা কমে গেছে। উল্টো ঘড়িটা নিজের চোখে দেখলেন।

# আসল, পুরো TTL দেখতে Authoritative কে সরাসরি জিজ্ঞেস করুন:
dig +short NS example.com          # আগে Name Server এর নাম বের করুন
dig @a.iana-servers.net example.com
#   এখানে সংখ্যাটা কমে না, প্রতিবার পুরো মানটাই আসে,
#   কারণ Authoritative এর কাছে এটা Cache নয়, আসল লেখা।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "দুই জায়গার সংখ্যা দুই মানে",
          content: (
            <p>
              Resolver কে জিজ্ঞেস করলে যে সংখ্যা পান সেটা বাকি সময়, প্রতিবার কমে।
              Authoritative কে জিজ্ঞেস করলে যে সংখ্যা পান সেটা মালিকের বসানো পুরো
              মান, কমে না। কোনো Record এর আসল TTL জানতে তাই সবসময় Authoritative
              কে জিজ্ঞেস করুন। আর আপনার কাছে বদলটা পৌঁছাতে আর কতক্ষণ, সেটা জানতে
              Resolver কে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "flush",
      subHeader: { index: "007", title: "Flushing Cache" },
      title: <SectionTitle>নিজের Cache মুছে ফেলা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              অপেক্ষা না করে নিজের যন্ত্রের খাতাগুলো হাতে মুছে ফেলা যায়, যাকে বলে
              Flush করা। চার খাতার প্রথম তিনটা আপনার হাতে। কোনটা কীভাবে মুছবেন,
              একসাথে রাখলাম।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "flush-cache.sh",
          code: `# ---- Operating System এর Cache ----
# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Windows (Command Prompt বা PowerShell)
ipconfig /flushdns

# Linux (systemd-resolved চালু থাকলে)
sudo resolvectl flush-caches
resolvectl statistics            # Cache এ কয়টা লেখা আছে, দেখায়

# ---- Browser এর Cache ----
# Chrome বা Edge: ঠিকানার ঘরে লিখুন
#   chrome://net-internals/#dns
# তারপর "Clear host cache" বোতামে চাপুন।
# Firefox: about:networking#dns এ গিয়ে "Clear DNS Cache"

# ---- Router এর Cache ----
# সবচেয়ে সহজ উপায়, Router টা বন্ধ করে আবার চালু করা।

# ---- মুছে গেছে কি না, দেখে নিন ----
dig example.com      # এবার TTL আবার প্রায় পুরো মান থেকে শুরু হবে`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              চতুর্থ খাতা, মানে Resolver এর Cache, আপনার যন্ত্রে নয়, তাই উপরের
              কোনো কমান্ড সেটা ছুঁতে পারে না। তবে দুইটা বড় Public Resolver একটা
              সুবিধা দেয়, তাদের Website এ গিয়ে একটা নামের Cache মুছতে অনুরোধ করা
              যায়। Google এর জন্য খুঁজুন Google Public DNS Flush Cache, আর Cloudflare
              এর জন্য 1.1.1.1 Purge Cache। আপনার ISP এর Resolver এ এমন কিছু নেই,
              সেখানে শুধু অপেক্ষা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিজের Cache মুছলে শুধু নিজের সমস্যা যায়",
          content: (
            <p>
              Flush করার পর আপনার Laptop এ নতুন সাইট খুলল, আর আপনি ভাবলেন কাজ শেষ।
              কিন্তু আপনার ব্যবহারকারীদের খাতা তো আপনি মোছেননি। তারা তাদের TTL শেষ
              না হওয়া পর্যন্ত পুরনোটাই দেখবে। তাই Flush একটা পরীক্ষার হাতিয়ার,
              সমাধান নয়। আসল সমাধান সবসময় আগের অংশের সময়রেখা, আগে থেকে TTL ছোট
              করে রাখা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "negative",
      subHeader: { index: "008", title: "Negative Cache" },
      title: <SectionTitle>নেই, এই উত্তরটাও মনে রাখা হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা সূক্ষ্ম ফাঁদ, যেটায় প্রায় সবাই একবার পড়ে। আগের লেসনে
                NXDOMAIN দেখেছিলেন, মানে এই নামের অস্তিত্ব নেই। মজার ব্যাপার,
                Resolver এই নেই উত্তরটাও Cache করে রাখে। একে বলে Negative Cache।
              </ContentParagraph>
              <ContentParagraph>
                ঘটনাটা সাধারণত এমন হয়। আপনি একটা নতুন উপনাম বানাবেন,
                api.islandtours.example। Record বসানোর আগেই কৌতূহলে Browser এ একবার
                লিখে দেখলেন, খুলল না, স্বাভাবিক। এবার Record বসালেন, আবার চেষ্টা
                করলেন, এখনো খুলছে না। কারণ আপনার Resolver মনে রেখেছে, এই নামটা নেই,
                আর সেই মনে রাখার মেয়াদ এখনো শেষ হয়নি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নিয়ম, আগে বসান, তারপর পরীক্ষা করুন",
          content: (
            <p>
              নতুন Record বানানোর সময় আগে Record টা বসান, তারপর নামটা খুলে দেখুন,
              উল্টো ক্রমে নয়। আর যদি ভুল করে আগে দেখে ফেলেন, ঘাবড়ানোর কিছু নেই।
              নিজের Cache মুছে নিন, অথবা সরাসরি Authoritative কে জিজ্ঞেস করে নিশ্চিত
              হোন Record ঠিক বসেছে, তারপর কয়েক মিনিট থেকে এক ঘণ্টা অপেক্ষা করুন।
              নেই উত্তরের মেয়াদ কত হবে, সেটাও Domain এর একটা সেটিং থেকে আসে, যা
              Record এর লেসনে দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "project",
      subHeader: { index: "009", title: "Project Example" },
      title: <SectionTitle>Cache, TTL আর Island Tours</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours চালাতে গিয়ে TTL এর সিদ্ধান্ত বারবার সামনে আসবে। কোথায়
                কী রাখবেন, একটা বাস্তব ছক।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>মূল সাইটের Record, ১ ঘণ্টা:</strong> islandtours.example
                  এর A Record সাধারণ দিনে 3600 রাখুন। দ্রুতও, আবার জরুরি বদল এক
                  ঘণ্টায় সবার কাছে পৌঁছায়।
                </ListItem>
                <ListItem>
                  <strong>বড় বদলের আগে, ৫ মিনিট:</strong> সার্ভার বদল বা Hosting
                  পাল্টানোর পরিকল্পনা থাকলে আগের দিন TTL 300 করে রাখুন। পর্যটন
                  মৌসুমে বুকিং চলার সময় এক ঘণ্টা অর্ধেক মানুষ পুরনো সার্ভারে গেলে
                  বুকিং হারাবেন।
                </ListItem>
                <ListItem>
                  <strong>ইমেইল আর Name Server, ১ দিন:</strong> এগুলো প্রায় কখনো
                  বদলায় না, তাই বড় TTL। ইমেইল সার্ভারগুলো বারবার জিজ্ঞেস না করে
                  নিশ্চিন্তে কাজ চালাতে পারে।
                </ListItem>
                <ListItem>
                  <strong>কাস্টমার বলছে খুলছে না:</strong> বদলের পর কেউ অভিযোগ
                  করলে প্রথমে নিজে dig দিয়ে Authoritative কে জিজ্ঞেস করুন। সেখানে
                  ঠিক থাকলে সমস্যা তার Cache এ, আপনার সাইটে নয়। তাকে Browser বন্ধ
                  করে খুলতে বা কয়েক মিনিট অপেক্ষা করতে বলুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "request-flow",
      subHeader: { index: "010", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা নাম, চার খাতা পার হয়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি islandtours.example লিখলেন। উত্তরটা কোন খাতায় পাওয়া যাবে, তার
              উপর নির্ভর করে পথটা কত ছোট বা বড় হবে, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Browser নিজের খাতা দেখে",
              description:
                "একটু আগে এই সাইটে গিয়ে থাকলে উত্তর এখানেই আছে। তখন আর কোথাও জিজ্ঞেস করা লাগে না, সাথে সাথে IP পাওয়া গেল। সবচেয়ে ছোট পথ।",
            },
            {
              title: "না পেলে Operating System কে",
              description:
                "Browser এ না থাকলে প্রশ্ন যায় যন্ত্রের নিজের খাতায়। সে আগে hosts ফাইল দেখে, তারপর নিজের Cache। অন্য কোনো App আগে এই নাম খুঁজে থাকলে এখানেই মিলবে।",
            },
            {
              title: "না পেলে Router, তারপর Resolver",
              description:
                "এবার প্রশ্ন যন্ত্রের বাইরে যায়, প্রথমে বাসার Router এ, তারপর Resolver এ। Resolver এর খাতা বিশাল, জনপ্রিয় নাম প্রায় সবসময় এখানে থাকে।",
            },
            {
              title: "কোথাও না পেলে পুরো হাঁটা",
              description:
                "চার খাতার কোথাও না থাকলে, বা সবার TTL শেষ হয়ে গিয়ে থাকলে, Resolver আগের লেসনের সেই হাঁটাটা হাঁটে, Root, TLD, Authoritative। উত্তরের সাথে আসে একটা TTL।",
            },
            {
              title: "ফেরার পথে সবাই টুকে রাখে",
              description:
                "উত্তরটা ফেরার পথে Resolver, Router, Operating System আর Browser, প্রত্যেকে নিজের খাতায় টুকে রাখে, TTL এর ঘড়ি চালু করে। পরেরবার এই নাম চাইলে পথটা আবার ছোট।",
            },
          ],
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
                <strong>নিজে ঘড়িটা দেখুন</strong>, নিচের Lab এ একই কমান্ড পরপর
                চালিয়ে TTL কমতে দেখবেন। এই লেসনের সবচেয়ে সহজ আর সবচেয়ে কাজের
                পরীক্ষা।
              </ListItem>
              <ListItem>
                <strong>Cloudflare Learning, DNS TTL</strong>, TTL আর Cache নিয়ে
                ছোট, পরিষ্কার লেখা।{" "}
                <a
                  href="https://www.cloudflare.com/learning/cdn/glossary/time-to-live-ttl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cloudflare.com/learning
                </a>
              </ListItem>
              <ListItem>
                <strong>Julia Evans, DNS নিয়ে লেখা</strong>, Cache আর TTL এর অদ্ভুত
                আচরণগুলো মজার ছবি দিয়ে বোঝানো। Search করুন: Julia Evans DNS।{" "}
                <a
                  href="https://jvns.ca/categories/dns/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  jvns.ca
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
      subHeader: { index: "012", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                প্রতিবার তিন ধাপের হাঁটা হাঁটলে Internet ধীর হতো, তাই উত্তর মনে রাখা
                হয়। এই মনে রাখার জায়গা Cache।
              </ListItem>
              <ListItem>
                Cache চার জায়গায়, Browser, Operating System, Router আর Resolver।
                প্রথম তিনটা আপনি মুছতে পারেন, শেষেরটা নয়।
              </ListItem>
              <ListItem>
                TTL হলো উত্তরের মেয়াদ, সেকেন্ডে। ঠিক করে Domain এর মালিক। মেয়াদ
                শেষ না হওয়া পর্যন্ত Resolver আর জিজ্ঞেসই করে না।
              </ListItem>
              <ListItem>
                ছোট TTL এ বদল দ্রুত ছড়ায় কিন্তু খোঁজ বেশি। বড় TTL এ সাইট দ্রুত
                কিন্তু বদল ধীর। সাধারণ দিনে ৩৬০০, বদলের আগে ৩০০।
              </ListItem>
              <ListItem>
                IP বদলানোর নিয়ম, আগে TTL ছোট করুন, পুরনো TTL পার হতে দিন, তারপর IP
                বদলান, যাচাই করুন, শেষে TTL আবার বড় করুন। দুইটা একসাথে করলে লাভ
                নেই।
              </ListItem>
              <ListItem>
                dig এর উত্তরের দ্বিতীয় সংখ্যাটা TTL। Resolver এ সেটা কমতে থাকে,
                Authoritative এ পুরো মান দেখায়।
              </ListItem>
              <ListItem>
                নিজের Cache মোছা (Flush) শুধু নিজের সমস্যা সারায়, ব্যবহারকারীদের
                নয়। নেই উত্তরও মনে রাখা হয়, তাই Record আগে বসান, পরে পরীক্ষা করুন।
              </ListItem>
              <ListItem>
                পরের লেসন: নামের নিচে কত রকম তথ্য বসে, A, AAAA, CNAME, MX, TXT, NS,
                সব DNS Record।
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
        <span className="font-bold text-primary">DNS Cache</span>,
        "পাওয়া উত্তর টুকে রাখার জায়গা, যাতে বারবার খুঁজতে না হয়",
      ],
      [
        <span className="font-bold text-primary">চার স্তর</span>,
        "Browser, Operating System, Router, Resolver",
      ],
      [
        <span className="font-bold text-primary">TTL</span>,
        "উত্তরের মেয়াদ, সেকেন্ডে, ঠিক করে Domain এর মালিক",
      ],
      [
        <span className="font-bold text-primary">ছোট বনাম বড় TTL</span>,
        "ছোটতে বদল দ্রুত, বড়তে সাইট দ্রুত",
      ],
      [
        <span className="font-bold text-primary">বদলের নিয়ম</span>,
        "আগে TTL ছোট, অপেক্ষা, তারপর IP বদল, শেষে TTL বড়",
      ],
      [
        <span className="font-bold text-primary">Flush</span>,
        "নিজের যন্ত্রের Cache হাতে মুছে ফেলা",
      ],
      [
        <span className="font-bold text-primary">Negative Cache</span>,
        "নাম নেই, এই উত্তরটাও কিছুক্ষণ মনে রাখা হয়",
      ],
      [
        <span className="font-bold text-primary">hosts ফাইল</span>,
        "যন্ত্রে হাতে লেখা নাম, DNS এর আগে মানা হয়",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা Record এর TTL কে ঠিক করে?",
        options: [
          {
            key: "A",
            text: "আপনার Browser",
            isCorrect: false,
            explanation: "না। Browser শুধু মেনে চলে, ঠিক করে না।",
          },
          {
            key: "B",
            text: "Domain এর মালিক, Record বসানোর সময়",
            isCorrect: true,
            explanation:
              "ঠিক। TTL Record এর সাথে লেখা থাকে, আর সেটা বসায় মালিক। Resolver শুধু সেই মেয়াদ মেনে চলে।",
          },
          {
            key: "C",
            text: "Root Server",
            isCorrect: false,
            explanation: "Root আপনার Record এর TTL ঠিক করে না।",
          },
        ],
      },
      {
        id: 2,
        text: "সাইটের IP বদলানোর পর Laptop এ পুরনো সাইট, Phone এ নতুন। কারণ কী?",
        options: [
          {
            key: "A",
            text: "সাইটটা ভেঙে গেছে",
            isCorrect: false,
            explanation: "কিছু ভাঙেনি। এটা Cache এর স্বাভাবিক আচরণ।",
          },
          {
            key: "B",
            text: "দুই যন্ত্রের Cache আলাদা, একটায় পুরনো উত্তর এখনো মেয়াদের মধ্যে",
            isCorrect: true,
            explanation:
              "ঠিক। প্রতিটা যন্ত্র আর Resolver এর খাতা আলাদা, তাই সবাই একসাথে নতুন উত্তর পায় না।",
          },
          {
            key: "C",
            text: "Phone বেশি শক্তিশালী",
            isCorrect: false,
            explanation: "শক্তির সাথে সম্পর্ক নেই, ব্যাপারটা কার Cache এ কী আছে।",
          },
        ],
      },
      {
        id: 3,
        text: "কাল সার্ভার বদলাবেন, Record এর TTL এখন ১ দিন। সবচেয়ে ভালো কাজ কোনটা?",
        options: [
          {
            key: "A",
            text: "কাল একসাথে TTL ছোট করে IP বদলে দেওয়া",
            isCorrect: false,
            explanation:
              "লাভ হবে না। যাদের Cache এ পুরনো উত্তর আছে, তাদের খাতায় পুরনো বড় TTL ই চলছে।",
          },
          {
            key: "B",
            text: "আজই TTL ছোট করা, এক দিন অপেক্ষা করে তারপর IP বদলানো",
            isCorrect: true,
            explanation:
              "ঠিক। আগে TTL ছোট, তারপর পুরনো TTL পার হতে দেওয়া, তারপর বদল। তখন কয়েক মিনিটেই সবাই নতুন ঠিকানা পায়।",
          },
          {
            key: "C",
            text: "TTL আরও বড় করে দেওয়া",
            isCorrect: false,
            explanation: "উল্টো ফল হবে, বদল ছড়াতে আরও বেশি সময় লাগবে।",
          },
        ],
      },
      {
        id: 4,
        text: "dig example.com এর উত্তরে দ্বিতীয় ঘরে 247 দেখলেন, একটু পর 239। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "এটা IP র একটা অংশ",
            isCorrect: false,
            explanation: "না, IP থাকে শেষ ঘরে। এটা TTL।",
          },
          {
            key: "B",
            text: "এটা TTL, Resolver এর Cache এ বাকি সময়, আর সেটা কমছে",
            isCorrect: true,
            explanation:
              "ঠিক। Resolver এ TTL একটা উল্টো ঘড়ি। পুরো মান দেখতে Authoritative কে জিজ্ঞেস করতে হয়।",
          },
          {
            key: "C",
            text: "কতজন এই নাম খুঁজেছে",
            isCorrect: false,
            explanation: "না, এটা গণনা নয়, বাকি মেয়াদ।",
          },
        ],
      },
      {
        id: 5,
        text: "আপনি নিজের Laptop এর DNS Cache Flush করলেন, নতুন সাইট খুলল। এতে কী নিশ্চিত হলো?",
        options: [
          {
            key: "A",
            text: "সব ব্যবহারকারী এখন নতুন সাইট দেখছে",
            isCorrect: false,
            explanation:
              "না। আপনি শুধু নিজের খাতা মুছেছেন, অন্যদের Cache যেমন ছিল তেমনই।",
          },
          {
            key: "B",
            text: "শুধু আপনার যন্ত্রে নতুন উত্তর আসছে, অন্যদের জন্য অপেক্ষা লাগবে",
            isCorrect: true,
            explanation:
              "ঠিক। Flush একটা পরীক্ষার হাতিয়ার। ব্যবহারকারীরা তাদের TTL শেষ হলে নতুনটা পাবে।",
          },
          {
            key: "C",
            text: "TTL শূন্য হয়ে গেছে চিরতরে",
            isCorrect: false,
            explanation: "না, Flush TTL বদলায় না, শুধু জমা লেখা মোছে।",
          },
        ],
      },
      {
        id: 6,
        text: "নতুন উপনাম বানানোর আগে একবার খুলে দেখলেন, তারপর Record বসালেন, তবু খুলছে না। সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "Resolver মনে রেখেছে নামটা নেই (Negative Cache)",
            isCorrect: true,
            explanation:
              "ঠিক। নেই উত্তরও Cache হয়। নিজের Cache মুছুন বা একটু অপেক্ষা করুন, আর পরেরবার আগে Record বসিয়ে তারপর দেখুন।",
          },
          {
            key: "B",
            text: "উপনাম বানানো যায় না",
            isCorrect: false,
            explanation: "যায়, কোনো বাধা নেই। সমস্যা Cache এ।",
          },
          {
            key: "C",
            text: "Registrar নামটা বাতিল করেছে",
            isCorrect: false,
            explanation: "না, এর সাথে Registrar এর সম্পর্ক নেই।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Cache আর TTL হাতে ধরা",
    subtitle: "Terminal এ পাঁচটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "ঘড়িটা কমতে দেখুন",
        description:
          "একই নাম কয়েক সেকেন্ড পরপর জিজ্ঞেস করে TTL এর সংখ্যা কমতে দেখুন।",
      },
      {
        title: "আসল TTL বের করুন",
        description:
          "একই নামের জন্য Authoritative কে জিজ্ঞেস করে মালিকের বসানো পুরো TTL দেখুন।",
      },
      {
        title: "দুই Resolver, দুই ঘড়ি",
        description:
          "দুইটা আলাদা Public Resolver কে একই নাম জিজ্ঞেস করে দেখুন তাদের বাকি সময় আলাদা।",
      },
      {
        title: "নিজের Cache মুছে দেখুন",
        description:
          "যন্ত্রের Cache Flush করে আবার জিজ্ঞেস করুন, আর সময়ের তফাত লক্ষ করুন।",
      },
      {
        title: "hosts ফাইল উঁকি দিন",
        description:
          "যন্ত্রের hosts ফাইলটা খুলে দেখুন, যেখানে হাতে লেখা নাম DNS এর আগে মানা হয়।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-watch-ttl.sh",
        language: "bash",
        code: `# একই প্রশ্ন, পাঁচ সেকেন্ড পরপর, তিনবার
dig +noall +answer github.com
sleep 5
dig +noall +answer github.com
sleep 5
dig +noall +answer github.com

# +noall +answer দিলে শুধু উত্তরের লাইনটা আসে।
# দ্বিতীয় ঘরের সংখ্যাটা প্রতিবার ৫ করে কমছে, এটাই TTL এর উল্টো ঘড়ি।`,
      },
      {
        filename: "2-real-ttl.sh",
        language: "bash",
        code: `# আগে Name Server এর নাম বের করুন
dig +short NS github.com

# তারপর তাদের একজনকে সরাসরি জিজ্ঞেস করুন (নামটা বসান)
dig +noall +answer @ns-1283.awsdns-32.org github.com

# এবারের সংখ্যাটাই মালিকের বসানো আসল TTL।
# কয়েকবার চালান, এটা কমবে না।`,
      },
      {
        filename: "3-two-resolvers.sh",
        language: "bash",
        code: `# একই নাম, দুইটা আলাদা Public Resolver
dig +noall +answer @8.8.8.8 github.com     # Google
dig +noall +answer @1.1.1.1 github.com     # Cloudflare

# দুই জায়গায় বাকি সময় আলাদা, কারণ দুইজন আলাদা সময়ে
# উত্তরটা টুকেছিল। প্রত্যেকের খাতা, প্রত্যেকের ঘড়ি।`,
      },
      {
        filename: "4-flush.sh",
        language: "bash",
        code: `# Cache থাকা অবস্থায় কত সময় লাগে
dig github.com | grep "Query time"

# Cache মুছুন (নিজের সিস্টেমের লাইনটা চালান)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder   # macOS
# ipconfig /flushdns                                            # Windows
# sudo resolvectl flush-caches                                  # Linux

# আবার মাপুন
dig github.com | grep "Query time"
# Query time এ খুব বড় তফাত নাও দেখতে পারেন, কারণ dig সরাসরি
# Resolver কে জিজ্ঞেস করে, আর Resolver এর Cache আপনি মোছেননি।
# এটাই প্রমাণ, চার খাতার শেষেরটা আপনার হাতে নেই।`,
      },
      {
        filename: "5-hosts-file.sh",
        language: "bash",
        code: `# যন্ত্রের হাতে লেখা নামের তালিকা
cat /etc/hosts                                   # macOS, Linux
# type C:\\Windows\\System32\\drivers\\etc\\hosts    # Windows

# এখানে localhost এর পাশে 127.0.0.1 লেখা দেখবেন।
# এই ফাইলে লেখা নাম DNS এ জিজ্ঞেস না করেই মানা হয়।
# Developer রা প্রায়ই এখানে একটা লাইন যোগ করে, নতুন সার্ভার
# সবার জন্য চালু করার আগে শুধু নিজের যন্ত্রে পরীক্ষা করতে:
#   45.120.8.9   islandtours.example
# কাজ শেষে লাইনটা মুছে দিতে ভুলবেন না।`,
      },
    ],
    tip: "এক নম্বর পরীক্ষাটা দুই মিনিটের, কিন্তু এই লেসনের সবচেয়ে জরুরি অনুভূতিটা দেয়। একই প্রশ্ন পরপর করলে সংখ্যাটা চোখের সামনে কমে, আর তখন TTL আর কোনো সংজ্ঞা থাকে না, একটা চলন্ত ঘড়ি হয়ে যায়। আর পাঁচ নম্বরের hosts ফাইলের কৌশলটা মনে রাখুন, সার্ভার বদলের দিন নতুন সার্ভার আগে নিজে পরখ করার এটাই সবচেয়ে নিরাপদ উপায়।",
  },
  assignment: {
    title: "Mini Project: সার্ভার বদলের পরিকল্পনা",
    time: "৫০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>তিনটা সাইটের TTL:</strong> Lab এর দুই নম্বর দিয়ে তিনটা চেনা
        সাইটের আসল TTL বের করুন। কার TTL সবচেয়ে ছোট, কার সবচেয়ে বড়? এক লাইনে
        আন্দাজ করুন কেন।
      </span>,
      <span key="2">
        <strong>ঘড়ি দেখা:</strong> Lab এর এক নম্বর চালিয়ে তিনবারের TTL লিখুন।
        সংখ্যাগুলোর তফাত কি আপনার অপেক্ষার সেকেন্ডের সাথে মেলে?
      </span>,
      <span key="3">
        <strong>সময়রেখা লিখুন:</strong> Island Tours এর A Record এর TTL এখন
        86400, আর শুক্রবার সকালে সার্ভার বদলাবেন। কোন দিন কোন কাজ করবেন, তারিখ
        ধরে ধরে পুরো পরিকল্পনা লিখুন, TTL আবার বড় করা পর্যন্ত।
      </span>,
      <span key="4">
        <strong>অভিযোগের উত্তর:</strong> বদলের পর একজন পর্যটক লিখলেন, সাইট খুলছে
        না। আপনি কোন কোন ধাপে পরীক্ষা করবেন আর তাঁকে কী করতে বলবেন, লিখুন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু বললেন, DNS বদলালে
        নাকি ২৪ ঘণ্টা লাগে। তাঁকে TTL আর চার খাতার উদাহরণ দিয়ে বোঝান আসলে কী
        ঘটে, আর সময়টা কীভাবে কমানো যায়।
      </span>,
    ],
    deliverables: [
      <span key="1">তিনটা সাইটের আসল TTL আর আপনার ব্যাখ্যা</span>,
      <span key="2">তিনবারের TTL এর সংখ্যা</span>,
      <span key="3">সার্ভার বদলের তারিখ ধরা সময়রেখা</span>,
      <span key="4">অভিযোগ সামলানোর ধাপের তালিকা</span>,
      <span key="5">DNS বদলে সময় লাগার আসল কারণ, ৫ লাইনে</span>,
    ],
  },
};
