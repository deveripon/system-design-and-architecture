/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import { RoleLab } from "../../../components/course/topics/dns/registrar-animations";
import {
  HierarchyDiagram,
  TldTableDiagram,
} from "../../../components/course/topics/dns/registrar-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const domainRegistrarRegistryContent: TopicData = {
  id: "domain-registrar-registry",
  introduction: {
    badge: "MODULE 04 · LESSON 02",
    title: <SectionTitle>নামটা আসে কার কাছ থেকে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে বলেছিলাম, একটা Website এর জন্য আপনার একটা নাম দরকার, আর সেই
          নামটা জোগাড় করতে হয়। কিন্তু জোগাড় মানে ঠিক কী? আপনি তো শুধু ঘোষণা করে
          দিলেই islandtours.example আপনার হয়ে যায় না। কেউ একজনকে সেটা আপনাকে বেচতে
          হবে, আর কেউ একজনকে লিখে রাখতে হবে এটা এখন আপনার, যাতে আর কেউ নিতে না পারে।
        </ContentParagraph>
        <ContentParagraph>
          Domain কেনার সেই একটা ক্লিকের পেছনে সাজানো আছে ছোট্ট একটা শৃঙ্খল, চারটা
          ভূমিকা, ICANN, Registry, Registrar, আর আপনি নিজে। এই লেসন সেই চারজনের
          সাথে পরিচয় করিয়ে দেবে, আর দেখাবে একটা নাম আসলে কীভাবে আপনার হয়।
        </ContentParagraph>
        <ContentParagraph>
          এটা DNS কীভাবে নাম খুঁজে বের করে, সেই কারিগরি অংশ নয়। এটা তার আগের কথা,
          মালিকানার কথা, কে নামটা বেচে আর কে হিসাব রাখে। ভিত হিসেবে জানা জরুরি,
          কারণ যে নাম নেই, DNS তার হিসাবই রাখবে না।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "একটা নাম শুধু চাইলেই পাওয়া যায় না, তাকে কিনতে হয়, আর লিখে রাখতে হয়। কে বেচে, কে লেখে, কে নিয়ম বানায়, এই তিনজন আর আপনি, চারজন মিলেই একটা নাম কারো হয়ে ওঠে।",
      author: "DNS",
      role: "Lesson 02",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "the-chain",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>নামের পেছনে ছোট্ট এক শৃঙ্খল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা জমি কেনার কথা ভাবুন। আপনি চাইলেই কোনো জমি নিজের বলে দাবি করতে
                পারেন না। একটা সরকারি খতিয়ান অফিস আছে, যে লিখে রাখে কোন জমি কার।
                আর সরাসরি সেই অফিসে না গিয়ে আপনি সাধারণত একজন দালালের মাধ্যমে কেনেন,
                যে কাগজপত্র সামলায়। পুরো ব্যবস্থাটার নিয়ম আবার বানায় উপরের কোনো
                কর্তৃপক্ষ।
              </ContentParagraph>
              <ContentParagraph>
                Domain Name এর দুনিয়াও ঠিক তেমন, সাজানো একটা শৃঙ্খল। সবার উপরে
                ICANN নিয়ম বানায়, তার নিচে Registry খতিয়ান রাখে, তারপর Registrar
                আপনার কাছে বেচে, আর সবার নিচে আপনি, যে নামটা নেন। চলুন এই চার স্তর
                একসাথে দেখি।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HierarchyDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "মালিকানা আর খোঁজা, দুইটা আলাদা ব্যাপার",
          content: (
            <p>
              একটা কথা গোড়াতেই পরিষ্কার করে নিই। এই লেসন নামের মালিকানা নিয়ে, কে
              বেচে আর কে হিসাব রাখে। DNS যখন একটা নামের IP খুঁজে বের করে, সেই খোঁজার
              কারিগরি অংশটা আলাদা, পরের লেসনের বিষয়। দুইটা গুলিয়ে ফেলবেন না। আগে
              নামটা কারো হতে হয় (এই লেসন), তারপর সেই নামের ঠিকানা খোঁজা যায় (পরের
              লেসন)।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "roles",
      subHeader: { index: "002", title: "The Four Roles" },
      title: <SectionTitle>চারজন, চার কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              চারটা ভূমিকা আলাদা করে বুঝে নেওয়া জরুরি, কারণ নাম প্রায়ই একই রকম
              শোনায় (Registry, Registrar), অথচ কাজ আলাদা। নিচে প্রতিটাতে চাপ দিয়ে
              দেখুন কে ঠিক কী করে, আর রোজকার কাজে আপনি আসলে কার সাথে কথা বলেন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RoleLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Registry বনাম Registrar, গোলানো সহজ",
          content: (
            <p>
              দুইটা নাম প্রায় এক শোনায়, তাই মনে রাখার একটা সহজ উপায়, Registry
              হলো তালিকা রাখার জায়গা (একটা TLD এর জন্য একটাই), আর Registrar হলো
              দোকান, যেখান থেকে আপনি কেনেন (অনেকগুলো থাকতে পারে)। খতিয়ান অফিস একটা,
              দালাল অনেক। আপনি দালালের সাথে কথা বলেন, দালাল খতিয়ান অফিসে লিখিয়ে
              দেয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "tld",
      subHeader: { index: "003", title: "The TLD" },
      title: <SectionTitle>নামের শেষ অংশ, TLD</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নামের শেষ টুকরোটা, যেমন .com বা .org, তার একটা নাম আছে, TLD, মানে
                Top Level Domain। এটা শুধু সাজানো একটা লেজুড় নয়, প্রতিটা TLD এর
                পেছনে একটা করে আলাদা Registry, আর প্রত্যেকের নিজের নিয়ম আর দাম।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TldTableDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Generic TLD (gTLD):</strong> .com, .org, .net, .io এর মতো,
                যেকোনো দেশের যে কেউ নিতে পারে। .com সবচেয়ে চেনা।
              </ListItem>
              <ListItem>
                <strong>Country Code TLD (ccTLD):</strong> একটা দেশের নিজের, যেমন
                বাংলাদেশের .bd, ভারতের .in। প্রায়ই সেই দেশের একটা সংস্থা চালায়,
                .bd চালায় BTCL।
              </ListItem>
              <ListItem>
                <strong>দাম আর নিয়ম আলাদা:</strong> কোন TLD বেছে নেবেন সেটা তাই শুধু
                পছন্দের ব্যাপার নয়। কোনোটা সস্তা, কোনোটা দামি, কোনোটা শুধু নির্দিষ্ট
                লোককে দেয়। বাছার আগে দেখে নেওয়া ভালো।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই TLD আবার খোঁজাতেও কাজে লাগে",
          content: (
            <p>
              মজার ব্যাপার, এই TLD শুধু মালিকানায় নয়, নাম খোঁজাতেও একটা বড় ভূমিকা
              নেয়। DNS যখন একটা নাম খুঁজে বের করে, সে প্রথমে TLD ধরে ধরে এগোয়। কিন্তু
              সেই খোঁজার গল্প, Root আর TLD server এর ভূমিকা, ঠিক পরের লেসনের বিষয়।
              এখানে শুধু জানুন, TLD হলো নামের শেষ অংশ, আর প্রতিটার নিজের একটা মালিক
              তালিকা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "buying",
      subHeader: { index: "004", title: "Buying & Lease" },
      title: <SectionTitle>নাম কেনা মানে ভাড়া নেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আসল কাজটা, নাম কেনা কীভাবে হয়। আপনি একটা Registrar এর সাইটে
                গিয়ে নামটা খোঁজেন। Registrar সেই TLD এর Registry কে জিজ্ঞেস করে
                নামটা খালি কি না। খালি থাকলে আপনি টাকা দেন, আর Registrar নামটা
                Registry তে আপনার নামে নিবন্ধন করে দেয়। ব্যস, নামটা এখন আপনার।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু একটা জরুরি কথা, নাম কেনা আসলে কেনা নয়, ভাড়া নেওয়া। আপনি
                সাধারণত বছরের হিসাবে নেন, আর প্রতিবছর নবায়ন করতে হয়। নবায়ন না করলে
                নামটা মেয়াদ শেষে খালি হয়ে যায়, আর অন্য কেউ নিয়ে নিতে পারে। মনে
                পড়ছে DHCP এর Lease? ধারণাটা প্রায় একই, ঠিকানা বা নাম, কোনোটাই
                চিরদিনের নয়, সময়ের জন্য ধার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নবায়ন ভুলে যাওয়া একটা বড় বিপদ",
          content: (
            <p>
              অনেক বড় সাইট শুধু Domain নবায়ন করতে ভুলে যাওয়ায় হঠাৎ বন্ধ হয়ে গেছে,
              এমন ঘটনা কম নয়। নাম হাতছাড়া হলে শুধু সাইট বন্ধই নয়, খারাপ কেউ সেটা
              নিয়ে আপনার নামে বাজে কিছু চালাতে পারে। তাই Auto Renew চালু রাখা, আর
              Domain এর ইমেইল ঠিক রাখা, একজন Developer এর জরুরি অভ্যাস। নামটা আপনার
              পরিচয়, সেটা হাতছাড়া হওয়া মানে অনেক কিছু হারানো।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>Island Tours এর নাম কেনা</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours কে অনলাইনে আনতে গেলে প্রথম কাজগুলোর একটা হলো একটা নাম
                কেনা। এই কেনার সিদ্ধান্তগুলো কোথায় কাজে আসে, দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কোন TLD, কোন Registrar:</strong> islandtours.com নাকি
                  islandtours.com.bd, নাকি সস্তা কোনো TLD, এটা একটা সিদ্ধান্ত।
                  তারপর একটা বিশ্বস্ত Registrar বেছে নেওয়া (Namecheap, Cloudflare
                  এর মতো), যাদের দাম আর সেবা ভালো। এই পছন্দগুলো ছোট মনে হলেও পরে
                  ঝামেলা বাঁচায়।
                </ListItem>
                <ListItem>
                  <strong>Domain আর Hosting আলাদা:</strong> একটা চেনা ভুল, নাম কেনা
                  আর সাইট কোথায় চলবে (Hosting) দুইটাকে এক ভাবা। নাম কেনেন Registrar
                  থেকে, সাইট রাখেন Cloud এ। নামটাকে সার্ভারের সাথে জোড়া লাগানো একটা
                  আলাদা কাজ, DNS Record, যেটা এই মডিউলের পরের লেসন।
                </ListItem>
                <ListItem>
                  <strong>WHOIS, নামের খতিয়ান:</strong> কোন নাম কে নিবন্ধন করেছে,
                  কবে, কার কাছ থেকে, এসব একটা পাবলিক তালিকায় থাকে, নাম WHOIS।
                  আজকাল ব্যক্তিগত তথ্য প্রায়ই লুকিয়ে রাখা যায় (Privacy Protection),
                  কিন্তু Registrar আর মেয়াদের তথ্য দেখা যায়। নিচের Lab এ নিজে দেখবেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "request-flow",
      subHeader: { index: "006", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা নাম যেভাবে আপনার হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি islandtours.example নামটা নিতে চান। চাওয়া থেকে নামটা নিবন্ধিত
              আর আপনার হওয়া পর্যন্ত, পেছনে কে কী করে, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "নামটা চাইলেন",
              description:
                "আপনি ঠিক করলেন islandtours.example চাই। কিন্তু নামটা খালি কি না, আর কীভাবে দাবি করবেন, একা তো জানা যায় না।",
            },
            {
              title: "Registrar এ খোঁজ",
              description:
                "একটা Registrar এর (যেমন Namecheap) সাইটে নামটা খুঁজলেন। Registrar সেই TLD এর Registry এর তালিকায় দেখল, নামটা খালি আছে।",
            },
            {
              title: "টাকা দিলেন",
              description:
                "নামটা পছন্দ, তাই Registrar কে বছরের ভাড়া দিলেন। এই লেনদেনটা আপনার আর Registrar এর মধ্যে।",
            },
            {
              title: "Registry তে নিবন্ধন",
              description:
                "Registrar নামটা Registry তে আপনার নামে নিবন্ধন করে দিল। এখন সেই TLD এর আসল খতিয়ানে লেখা হলো, islandtours.example এর Registrant আপনি।",
            },
            {
              title: "নামটা এখন আপনার (ভাড়ায়)",
              description:
                "নামটা এখন আপনার, তবে সময়ের জন্য। প্রতিবছর নবায়ন করলে থাকবে, নাহলে খালি হয়ে যাবে। পুরো এই ব্যবস্থাটা চলে ICANN এর নিয়মে, যে Registrar কে অনুমোদন দিয়েছিল আর TLD টা ঠিক করেছিল।",
            },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "resources",
      subHeader: { index: "007", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>একটা নামের খতিয়ান দেখুন</strong>, নিচের Lab এ whois কমান্ড
                আছে। একটা চেনা সাইটের Registrar, মেয়াদ আর তথ্য নিজের চোখে দেখুন।
              </ListItem>
              <ListItem>
                <strong>ICANN, নতুনদের জন্য</strong>, Registrar আর Registry নিয়ে
                সরল ব্যাখ্যা, একদম আসল উৎস থেকে।{" "}
                <a
                  href="https://www.icann.org/resources/pages/what-2012-02-25-en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  icann.org
                </a>
              </ListItem>
              <ListItem>
                <strong>Namecheap বা Cloudflare এর Blog</strong>, Registrar দের
                নিজের ভাষায় Domain কেনা, নবায়ন, স্থানান্তর বোঝানো, উদাহরণ সহ।
                Search করুন: what is a domain registrar।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "recap",
      subHeader: { index: "008", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                একটা নাম শুধু ঘোষণা করলে হয় না, কেউ বেচে আর কেউ লিখে রাখে। এর পেছনে
                সাজানো চারটা ভূমিকা।
              </ListItem>
              <ListItem>
                <strong>ICANN</strong> পুরো ব্যবস্থার তদারক করে, কোন TLD থাকবে ঠিক
                করে, Registrar দের অনুমোদন দেয়। পৃথিবীতে একটাই।
              </ListItem>
              <ListItem>
                <strong>Registry</strong> একটা TLD এর আসল মালিক তালিকা রাখে (এক
                TLD, এক Registry)। <strong>Registrar</strong> আপনার কাছে বেচে
                (অনেক থাকতে পারে)। আপনি <strong>Registrant</strong>।
              </ListItem>
              <ListItem>
                TLD মানে নামের শেষ অংশ (.com, .org, .bd)। gTLD সবার জন্য, ccTLD
                দেশের নিজের। প্রত্যেকের নিয়ম আর দাম আলাদা।
              </ListItem>
              <ListItem>
                নাম কেনা মানে ভাড়া নেওয়া, বছরের হিসাবে। নবায়ন না করলে হাতছাড়া হয়,
                তাই Auto Renew জরুরি।
              </ListItem>
              <ListItem>
                Domain কেনা আর সাইট Hosting আলাদা কাজ। নামকে সার্ভারের সাথে জোড়া
                লাগানো (DNS Record) এই মডিউলের পরের বিষয়।
              </ListItem>
              <ListItem>
                পরের লেসন: নামটা তো আছে, কিন্তু DNS তার IP আসলে খুঁজে বের করে
                কীভাবে, Root, TLD আর Authoritative server।
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
        <span className="font-bold text-primary">ICANN</span>,
        "পুরো নাম ব্যবস্থার তদারক, TLD ঠিক করে, Registrar অনুমোদন দেয়",
      ],
      [
        <span className="font-bold text-primary">Registry</span>,
        "একটা TLD এর আসল মালিক তালিকা রাখে, এক TLD এক Registry",
      ],
      [
        <span className="font-bold text-primary">Registrar</span>,
        "যে কোম্পানি আপনার কাছে নাম বেচে, Registry তে নিবন্ধন করে",
      ],
      [
        <span className="font-bold text-primary">Registrant</span>,
        "যে নামটা নিবন্ধন করে, মানে আপনি",
      ],
      [
        <span className="font-bold text-primary">TLD</span>,
        "নামের শেষ অংশ (.com, .bd), প্রতিটার নিজের Registry",
      ],
      [
        <span className="font-bold text-primary">Lease</span>,
        "নাম কেনা মানে ভাড়া, বছরের হিসাবে, নবায়ন লাগে",
      ],
      [
        <span className="font-bold text-primary">Domain vs Hosting</span>,
        "নাম কেনা আর সাইট কোথায় চলবে, দুইটা আলাদা কাজ",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা Domain Name আপনি সাধারণত সরাসরি কার কাছ থেকে কেনেন?",
        options: [
          {
            key: "A",
            text: "ICANN এর কাছ থেকে",
            isCorrect: false,
            explanation:
              "ICANN নিয়ম বানায়, সরাসরি বেচে না। আপনি কেনেন একটা Registrar থেকে।",
          },
          {
            key: "B",
            text: "একটা Registrar থেকে",
            isCorrect: true,
            explanation:
              "ঠিক। Registrar হলো দোকান (Namecheap, GoDaddy), যে আপনার কাছে বেচে আর Registry তে নিবন্ধন করে দেয়।",
          },
          {
            key: "C",
            text: "সরাসরি Registry থেকে",
            isCorrect: false,
            explanation:
              "সাধারণত না। Registry খতিয়ান রাখে, কিন্তু বিক্রি হয় Registrar এর মাধ্যমে।",
          },
        ],
      },
      {
        id: 2,
        text: "Registry আর Registrar এর মূল তফাত কী?",
        options: [
          {
            key: "A",
            text: "Registry এক TLD এর তালিকা রাখে (একটাই), Registrar বেচে (অনেক থাকতে পারে)",
            isCorrect: true,
            explanation:
              "ঠিক। খতিয়ান অফিস একটা (Registry), দালাল অনেক (Registrar)। আপনি দালালের সাথে কথা বলেন।",
          },
          {
            key: "B",
            text: "দুইটা আসলে একই জিনিস",
            isCorrect: false,
            explanation:
              "না। নাম কাছাকাছি হলেও কাজ আলাদা। একজন তালিকা রাখে, একজন বেচে।",
          },
          {
            key: "C",
            text: "Registrar তালিকা রাখে, Registry বেচে",
            isCorrect: false,
            explanation:
              "উল্টো। Registry তালিকা রাখে, Registrar বেচে।",
          },
        ],
      },
      {
        id: 3,
        text: "ICANN এর কাজ কী?",
        options: [
          {
            key: "A",
            text: "প্রতিটা Website চালায়",
            isCorrect: false,
            explanation:
              "না, ICANN Website চালায় না। সে পুরো নাম ব্যবস্থার তদারক করে।",
          },
          {
            key: "B",
            text: "পুরো নাম ব্যবস্থার তদারক, কোন TLD থাকবে ঠিক করে, Registrar অনুমোদন দেয়",
            isCorrect: true,
            explanation:
              "ঠিক। ICANN নিয়ম বানায় আর তদারক করে। আপনি সরাসরি এর সাথে কাজ করেন না, কিন্তু সব এর নিয়মে চলে।",
          },
          {
            key: "C",
            text: "সব Domain এর টাকা রাখে",
            isCorrect: false,
            explanation:
              "না, টাকা রাখা এর কাজ নয়। এটা একটা তদারককারী সংস্থা।",
          },
        ],
      },
      {
        id: 4,
        text: ".bd এর মতো একটা Country Code TLD এর ব্যাপারে কোনটা ঠিক?",
        options: [
          {
            key: "A",
            text: "এটা একটা দেশের নিজের TLD, প্রায়ই সেই দেশের সংস্থা চালায়",
            isCorrect: true,
            explanation:
              "ঠিক। .bd বাংলাদেশের ccTLD, চালায় BTCL। প্রতিটা দেশের নিজের একটা আছে, যেমন ভারতের .in।",
          },
          {
            key: "B",
            text: "এটা .com এর চেয়ে সবসময় সস্তা",
            isCorrect: false,
            explanation:
              "দাম TLD ভেদে আলাদা, কোনো নির্দিষ্ট নিয়ম নেই। ccTLD সস্তা নাও হতে পারে।",
          },
          {
            key: "C",
            text: "এটা ICANN নিজে চালায়",
            isCorrect: false,
            explanation:
              "না। ICANN তদারক করে, কিন্তু প্রতিটা TLD চালায় আলাদা Registry, ccTLD এর ক্ষেত্রে প্রায়ই দেশের সংস্থা।",
          },
        ],
      },
      {
        id: 5,
        text: "Domain নবায়ন না করলে কী হয়?",
        options: [
          {
            key: "A",
            text: "নামটা চিরদিন আপনারই থাকে",
            isCorrect: false,
            explanation:
              "না। নাম কেনা মানে ভাড়া, চিরদিনের নয়। নবায়ন না করলে হাতছাড়া হয়।",
          },
          {
            key: "B",
            text: "মেয়াদ শেষে নামটা খালি হয়ে যায়, অন্য কেউ নিতে পারে",
            isCorrect: true,
            explanation:
              "ঠিক। তাই Auto Renew চালু রাখা জরুরি, নাহলে সাইট বন্ধ, এমনকি খারাপ কেউ নামটা নিয়ে নিতে পারে।",
          },
          {
            key: "C",
            text: "ICANN আপনাকে ফ্রিতে রেখে দেয়",
            isCorrect: false,
            explanation:
              "না, ICANN এমন কিছু করে না। নবায়ন না হলে নামটা খালি হয়ে যায়।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "একটা নামের খতিয়ান",
    subtitle: "Terminal এ চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "একটা Domain এর তথ্য দেখুন",
        description:
          "একটা চেনা সাইটের whois তথ্য দেখুন, কে Registrar, কবে নিবন্ধিত, কবে মেয়াদ শেষ।",
      },
      {
        title: "Registrar কে",
        description:
          "যে Registrar থেকে নামটা নেওয়া, তার নাম বের করুন। নবায়ন বা বদল এর সাথেই করতে হয়।",
      },
      {
        title: "মেয়াদ কবে শেষ",
        description:
          "Domain টার মেয়াদ কবে শেষ হচ্ছে দেখুন। এই তারিখের আগেই নবায়ন করতে হয়।",
      },
      {
        title: "একটা TLD এর Registry",
        description:
          "একটা TLD এর পেছনে কোন Registry, সেটা বের করুন, যেমন .com এর পেছনে কে।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-whois.sh",
        language: "bash",
        code: `# একটা Domain এর পুরো তথ্য
whois google.com          # না থাকলে: brew install whois / apt install whois

# আউটপুটে দেখবেন Registrar, তারিখ, Name Server, ইত্যাদি।
# এই পুরো তথ্যটাই WHOIS, নামের একটা পাবলিক খতিয়ান।`,
      },
      {
        filename: "2-registrar.sh",
        language: "bash",
        code: `# কোন Registrar থেকে নামটা নেওয়া
whois google.com | grep -i "Registrar:" | head

# 'Registrar:' এর পাশে যে কোম্পানির নাম, নবায়ন বা
# স্থানান্তর এর সাথেই করতে হয়।`,
      },
      {
        filename: "3-expiry.sh",
        language: "bash",
        code: `# মেয়াদ কবে শেষ
whois google.com | grep -i "Expir"

# Registry Expiry Date এর পাশের তারিখটাই মেয়াদ।
# এই তারিখের আগে নবায়ন না করলে নামটা খালি হয়ে যেতে পারে।`,
      },
      {
        filename: "4-tld-registry.sh",
        language: "bash",
        code: `# একটা TLD এর পেছনে কোন Registry
whois -h whois.iana.org com

# IANA (ICANN এর অংশ) এর তথ্য দেখাবে .com কে চালায়।
# আউটপুটে organisation এর নামটাই সেই TLD এর Registry।`,
      },
    ],
    tip: "এক নম্বর পরীক্ষাটা সবচেয়ে চোখ খুলে দেয়, কারণ whois চালালে আপনি এই লেসনের চারজনকেই একসাথে দেখতে পাবেন, Registrar এর নাম, Registry এর তথ্য, আর মেয়াদের তারিখ, সব এক জায়গায়। তখন এই ভূমিকাগুলো আর বিমূর্ত থাকে না, একটা সত্যিকারের নামের পেছনে সাজানো একটা ব্যবস্থা হয়ে ওঠে। যেকোনো চেনা সাইট দিয়ে চালিয়ে দেখুন, প্রতিটার পেছনে এই একই গল্প।",
  },
  assignment: {
    title: "Mini Project: নাম কেনার পরিকল্পনা",
    time: "৪৫ মিনিট",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>দুইটা খতিয়ান:</strong> Lab এর এক নম্বর দিয়ে দুইটা চেনা সাইটের
        whois দেখুন। প্রতিটার Registrar আর মেয়াদের তারিখ লিখুন।
      </span>,
      <span key="2">
        <strong>চার ভূমিকা মেলান:</strong> একটা কল্পিত নাম islandtours.com.bd এর
        জন্য এই লেসনের চারটা ভূমিকা (ICANN, Registry, Registrar, Registrant) কে কে
        হবে, লিখে মেলান।
      </span>,
      <span key="3">
        <strong>TLD বাছাই:</strong> Island Tours এর জন্য তিনটা সম্ভাব্য TLD লিখুন
        (যেমন .com, .com.bd, .travel)। এক লাইনে লিখুন কোনটা কেন বেছে নিতেন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু জিজ্ঞেস করলেন,
        Domain কেনা মানে কি ওটা চিরদিন আমার? তাঁকে Lease আর নবায়নের উদাহরণ দিয়ে
        বোঝান কেন তা নয়।
      </span>,
    ],
    deliverables: [
      <span key="1">দুইটা সাইটের Registrar আর মেয়াদ</span>,
      <span key="2">একটা নামের জন্য চার ভূমিকা মেলানো</span>,
      <span key="3">তিনটা TLD, আর কোনটা কেন</span>,
      <span key="4">Domain চিরদিনের নয় কেন, ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
