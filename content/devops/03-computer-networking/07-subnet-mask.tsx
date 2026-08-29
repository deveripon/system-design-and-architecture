/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  PrefixLab,
  SameSubnetLab,
} from "../../../components/course/topics/subnet/animations";
import {
  BitSplitDiagram,
  CidrTableDiagram,
  MaskAnatomyDiagram,
  SplitDiagram,
} from "../../../components/course/topics/subnet/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const subnetMaskContent: TopicData = {
  id: "subnet-mask",
  introduction: {
    badge: "MODULE 03 · LESSON 07",
    title: <SectionTitle>লাইনটা কোথায় টানা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          IP Address এর লেসনে একটা কথা বলে রেখেছিলাম, প্রতিটা IP এর দুই ভাগ, একটা
          Network অংশ (কোন এলাকা) আর একটা Host অংশ (সেই এলাকার কোন যন্ত্র)। কিন্তু
          একটা প্রশ্ন তখন ঝুলিয়ে রেখেছিলাম, লাইনটা ঠিক কোথায় টানা, কতটুকু Network
          আর কতটুকু Host? এই লেসন সেই ঝুলে থাকা প্রশ্নের উত্তর।
        </ContentParagraph>
        <ContentParagraph>
          লাইনটা টেনে দেয় একটা ছোট জিনিস, নাম Subnet Mask। আর লাইনটা টানতে
          পারলে দুইটা দারুণ কাজ করা যায়। এক, একটা বড় Network কে ছোট ছোট ভাগে ভাগ
          করা যায়, যাকে বলে Subnetting। দুই, বলে দেওয়া যায় দুইটা যন্ত্র সরাসরি
          কথা বলতে পারবে নাকি মাঝে একটা Router লাগবে। এই দ্বিতীয় কাজটাই আসলে রোজকার
          Network এর মূল সিদ্ধান্ত।
        </ContentParagraph>
        <ContentParagraph>
          একটু Binary আসবে ঠিকই, কিন্তু ভয় নেই। হিসাবটা আপনাকে হাতে করতে হবে না,
          নিচের Lab গুলো নিজেই করে দেখাবে। আপনি শুধু লাইনটাকে এদিক ওদিক সরতে
          দেখবেন, আর দেখবেন সরানোর সাথে সাথে সব কীভাবে বদলায়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "IP বলে ঠিকানাটা কী। Subnet Mask বলে সেই ঠিকানার কোন অংশ পর্যন্ত এক পাড়া, আর কোথা থেকে আলাদা বাসা। একটা ছোট লাইন, অথচ সেই লাইনই ঠিক করে চিঠি সরাসরি যাবে নাকি দরজা দিয়ে বেরোবে।",
      author: "Computer Networking",
      role: "Lesson 07",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "the-line",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Mask কোথায় লাইন টানে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ডাকঠিকানার কথা আবার ভাবুন। ঠিকানার শুরুর অংশ বলে কোন এলাকা,
                কোন পাড়া, আর শেষের অংশ বলে সেই পাড়ার ঠিক কোন বাসা। কিন্তু পাড়া
                কোথায় শেষ আর বাসা নম্বর কোথায় শুরু, সেই সীমারেখা কে টানে? IP এর
                বেলায় সেই কাজটা করে Subnet Mask।
              </ContentParagraph>
              <ContentParagraph>
                Subnet Mask দেখতে ঠিক একটা IP এর মতো, চারটা সংখ্যা, যেমন
                255.255.255.0। নিয়মটা সহজ, Mask এর যেখানে 255, সেই অংশটা Network,
                আর যেখানে 0, সেই অংশটা Host। তাই 255.255.255.0 মানে, প্রথম তিন অংশ
                Network, শেষ অংশ Host।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MaskAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এটা কেন এত জরুরি? কারণ একই Network অংশ যাদের, তারা এক পাড়ার লোক,
              সরাসরি একে অপরের সাথে কথা বলতে পারে। এখানে 192.168.1 পর্যন্ত এক থাকলে
              সবাই এক Network এ। তাই 192.168.1.10 আর 192.168.1.50 এক পাড়ার, কিন্তু
              192.168.2.10 আলাদা পাড়ার, তার কাছে যেতে হলে Router দিয়ে ঘুরতে হবে।
              এই এক পাড়া কতদূর, সেটাই Mask ঠিক করে দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Network Address মানে পাড়ার নাম",
          content: (
            <p>
              ঠিকানা আর Mask মিলিয়ে একটা জিনিস বের হয়, নাম Network Address, যেমন
              এখানে 192.168.1.0। এটাকে পাড়ার নাম ভাবতে পারেন। এক পাড়ার সবার
              Network Address এক, শুধু শেষের Host সংখ্যা আলাদা। এই পাড়ার নাম কীভাবে
              বের হয়, সেটা একটু পরেই দেখবেন, আর সেখানেই আসল মজা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "binary-prefix",
      subHeader: { index: "002", title: "Mask in Binary" },
      title: <SectionTitle>Mask আসলে 1 আর 0 এর খেলা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Mask এর ভেতরে উঁকি দিলে ব্যাপারটা আরও পরিষ্কার হয়। মনে আছে, 255
                মানে আটটা Bit ই এক (11111111), আর 0 মানে আটটাই শূন্য (00000000)?
                তাহলে 255.255.255.0 আসলে ২৪টা এক, তারপর ৮টা শূন্য। এই একের সারিটাই
                Network, আর শূন্যের সারিটা Host। Mask সবসময় এমন, প্রথমে একগুচ্ছ এক,
                তারপর একগুচ্ছ শূন্য, মাঝে মেশানো নয়।
              </ContentParagraph>
              <ContentParagraph>
                255.255.255.0 লিখতে লম্বা লাগে, তাই একটা সংক্ষিপ্ত রূপ আছে, নাম
                CIDR। /24 মানে শুরুর ২৪টা Bit এক, মানে ঠিক 255.255.255.0। এই /24
                লেখাটা আপনি সবখানে দেখবেন। নিচের Lab এ Prefix টা এদিক ওদিক সরিয়ে
                দেখুন, লাইনটা কীভাবে সরে আর সব কীভাবে বদলায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PrefixLab /> },
        { type: CONTENT_TYPES.CUSTOM, component: <CidrTableDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা খুব জরুরি ভুল ধারণা এখানে পরিষ্কার করে নিই। 192.168.1.10
                ঠিকানাটা কিন্তু নিজে থেকে জানে না তার লাইন কোথায়, মানে কতটুকু
                Network আর কতটুকু Host। শুধু IP টা দেখে কেউ বলতেই পারবে না এটা /24
                নাকি /25 নাকি /16। ঠিকানাটা একা কোনো কথাই বলে না লাইন নিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                লাইনটা আসে সম্পূর্ণ আলাদা একটা তথ্য থেকে, সেই Subnet Mask। তাই IP
                আর Mask সবসময় জোড়ায় চলে, আপনি লেখা দেখবেন 192.168.1.10/24, কখনো
                শুধু IP একা নয়। Mask ছাড়া একটা IP অসম্পূর্ণ, তার পাড়া কোথায় শেষ
                সেটা তখন কেউ জানে না। মানে Mask নিজে কিছু আবিষ্কার করে না, Mask
                নিজেই হলো লাইনটা কোথায়, সেই লিখে রাখা সিদ্ধান্ত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "তাহলে এই Mask টা কে বসায়, আর কীভাবে ঠিক করে",
          content: (
            <p>
              এটা মুখস্থ কোনো নিয়ম নয়, একজন মানুষ ঠিক করে দেয়, সাধারণত Network এর
              ডিজাইনার। প্রশ্নটা সহজ, এই Network এ কতগুলো যন্ত্র লাগবে? ২৫৪টার মতো
              লাগলে সে বেছে নেয় /24, মানে 255.255.255.0। মাত্র দুইটা যন্ত্রের একটা
              লিংক হলে বেছে নেয় /30। মানে কত বড় জায়গা দরকার, সেই হিসাব করে সে
              Mask টা বেছে নেয়, তারপর সেটাকে যন্ত্রে বসিয়ে দেয়। বসানোর দুইটা উপায়,
              হয় হাতে টাইপ করে (Static), নয়তো Router প্রতিটা যন্ত্রকে IP এর সাথে
              Mask টাও আপনাআপনি দিয়ে দেয় (DHCP, পরের কয়েক লেসন)। এক Network এর সব
              যন্ত্র একই Mask পায়। তাই 255.255.255.0 লেখার এই ক্রমটা জাদু নয়, এটা
              কেউ ইচ্ছে করে বেছে দেওয়া লাইন।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কেন প্রতিবার ২টা ঠিকানা বাদ যায়",
          content: (
            <p>
              খেয়াল করলেন, /24 এ ৮টা Host Bit মানে ২৫৬টা সম্ভাব্য ঠিকানা, কিন্তু
              যন্ত্র ধরে ২৫৪টা? কারণ প্রতিটা Network এ দুইটা ঠিকানা বিশেষ কাজে রাখা
              থাকে। সবার প্রথমটা (যেমন .0) হলো Network Address, মানে পাড়ার নাম,
              সেটা কোনো যন্ত্রকে দেওয়া যায় না। আর সবার শেষেরটা (যেমন .255) হলো
              Broadcast Address, যেটা দিয়ে পুরো পাড়ায় একসাথে ডাক দেওয়া যায়।
              তাই মোট থেকে সবসময় ২টা বাদ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "same-or-not",
      subHeader: { index: "003", title: "Same Network?" },
      title: <SectionTitle>এক পাড়া নাকি আলাদা, Mask ঠিক করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার এই লেসনের সবচেয়ে কাজের কথা। একটা যন্ত্র যখন চিঠি পাঠাতে চায়,
                তার প্রথম প্রশ্ন থাকে, গন্তব্য কি আমার পাড়ার, নাকি বাইরের? এই
                উত্তরটা সে বের করে Mask দিয়ে। নিজের IP আর গন্তব্যের IP, দুইটাকেই
                Mask দিয়ে মেপে দেখে দুইজনের Network Address (পাড়ার নাম) এক কি না।
              </ContentParagraph>
              <ContentParagraph>
                Network Address বের করার নিয়মটা একটা সহজ Bit এর হিসাব, যাকে বলে
                AND, ঠিকানা আর Mask এর প্রতিটা অংশ মিলিয়ে নেওয়া। হাতে করতে হবে না,
                নিচের Lab এই দেখিয়ে দেবে। বরং একটা মজার জিনিস লক্ষ করুন, IP দুইটা
                এক রেখে শুধু Mask বদলালেই উত্তর বদলে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SameSubnetLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>এক Network হলে:</strong> দুইজনের পাড়ার নাম মিলে যায়, তাই
                চিঠি সরাসরি যায়। যন্ত্র শুধু পরের হাতের MAC বের করে (ARP, আগের
                লেসন) আর সরাসরি পৌঁছে দেয়।
              </ListItem>
              <ListItem>
                <strong>আলাদা Network হলে:</strong> পাড়ার নাম মেলে না, তাই সরাসরি
                পৌঁছানো যায় না। যন্ত্র তখন চিঠিটা তুলে দেয় বাইরে বেরোনোর দরজায়,
                মানে Router এর হাতে, আর সে বাকিটা সামলায়।
              </ListItem>
              <ListItem>
                <strong>Mask ই বিচারক:</strong> একই দুই IP, শুধু Mask বদলে দিলে
                এক পাড়া হয়ে যায় দুই পাড়া। তাই সরাসরি যাবে নাকি Router লাগবে, এই
                পুরো সিদ্ধান্তটা আসলে Mask এর হাতে।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "splitting",
      subHeader: { index: "004", title: "Subnetting" },
      title: <SectionTitle>একটা বড় Network কে ভাগ করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন আসল খেলাটা, Subnetting। যেহেতু লাইনটা আমরা সরাতে পারি, একটা বড়
                Network কে আমরা ছোট ছোট ভাগে ভেঙে ফেলতে পারি। ধরুন একটা 192.168.1.0
                /24 আছে, যেটা ২৫৪টা যন্ত্র ধরে। Host এর দিক থেকে মাত্র একটা Bit ধার
                করে যদি /25 বানাই, তাহলে সেই এক Network দুইটা আলাদা Network এ ভেঙে
                যায়, প্রতিটা ১২৬টা যন্ত্র ধরে।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু ভাগটা ঠিক কীভাবে ঘটে, একটু ভেঙে দেখি, কারণ এখানেই আসল
                বুদ্ধিটা। পুরো খেলাটা হয় শেষ octet, মানে চতুর্থ সংখ্যাটার ভেতরে।
                /24 এ ওই octet এর আটটা Bit ই Host, তাই সে 0 থেকে 255 পর্যন্ত
                যেকোনো মান হতে পারে, এক বড় ঘর। এবার লাইনটা এক ঘর ডানে সরিয়ে /25
                করলে ওই octet এর সবচেয়ে বাঁয়ের Bit টা আর Host থাকে না, সেটা
                Network এর হয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <BitSplitDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন মজাটা দেখুন। ধার করা ওই একটা Bit হয় 0 নয় 1, দুইটাই সম্ভব।
                তাই এক ঘর ভেঙে দুই ঘর হয়ে যায়। Bit টা 0 হলে সংখ্যা থাকে 0 থেকে
                127 এর মধ্যে, এটা এক Network (192.168.1.0/25)। আর Bit টা 1 হলে
                সংখ্যা হয় 128 থেকে 255, এটা আরেক Network (192.168.1.128/25)।
              </ContentParagraph>
              <ContentParagraph>
                কেন ঠিক 128 এ ভাগ পড়ল, এলোমেলো কোনো সংখ্যায় নয়? কারণ একটা octet
                এ সবচেয়ে বাঁয়ের Bit টার মান 128 (Binary লেসনে দেখেছিলেন, 128 64
                32 ...)। তাই ওই Bit টা 1 হওয়া মানেই সংখ্যা অন্তত 128। এই কারণেই
                লাইনটা এক ঘর সরালে ভাগ পড়ে ঠিক মাঝখানে, 128 এ। আরেকটা Bit ধার করে
                /26 করলে একই নিয়মে চার ঘর হয়, প্রতিটা 64 করে (0, 64, 128, 192),
                কারণ পরের Bit টার মান 64।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SplitDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কেন কেউ এমন ভাগ করবে? কারণ আলাদা রাখা কাজে দেয়। অফিসের Accounts
              বিভাগ এক Network এ, Engineering আরেক Network এ রাখলে তারা আলাদা
              থাকে, একের সমস্যা অন্যকে ছোঁয় না, আর কে কার সাথে সরাসরি কথা বলতে
              পারবে সেটাও নিয়ন্ত্রণে থাকে। একটা বড় খোলা মাঠের বদলে কয়েকটা আলাদা
              ঘর, প্রতিটার নিজের দরজা। ঠিক কোথায় ভাগ পড়বে, সেটাই Mask ঠিক করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "ছোট ভাগ মানে কম অপচয়",
          content: (
            <p>
              একটা লিংকে যদি মাত্র দুইটা যন্ত্র থাকে (যেমন দুই Router এর মাঝের তার),
              তাহলে ২৫৪টা ঠিকানার একটা /24 দেওয়া মানে বিরাট অপচয়। তাই সেখানে ছোট
              একটা ভাগ দেওয়া হয়, ঠিক যতটা লাগে ততটা। বড় Cloud এ এই মাপজোক করে
              Network ভাগ করাটা রোজকার কাজ, আর তার পুরো ভিত্তি এই Subnet Mask।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>Subnet আর Island Tours</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একজন Backend Developer হিসেবে Cloud এ সার্ভার বসাতে গেলেই Subnet
                সামনে চলে আসে। Island Tours কে Cloud এ তুললে এটা কোথায় কাজে লাগে,
                দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>API আর Database এক Subnet এ:</strong> Island Tours এর
                  API আর Database কে একই Subnet এ রাখলে তাদের Network Address এক
                  হয়, তাই তারা সরাসরি, দ্রুত কথা বলে, মাঝে Router লাগে না। এই
                  কারণেই একই Subnet এ রাখা একটা সাধারণ নিয়ম।
                </ListItem>
                <ListItem>
                  <strong>Public আর Private Subnet:</strong> Cloud এ প্রায়ই দুই
                  রকম Subnet বানানো হয়, একটা Public (যেখানে বাইরে থেকে পৌঁছানো
                  যায়, যেমন Web সার্ভার), আরেকটা Private (যেখানে বাইরে থেকে যাওয়া
                  যায় না, যেমন Database)। এই ভাগটাই Subnet দিয়ে করা, আর এটা আগের
                  লেসনের Public বনাম Private ধারণার হাতে কলমে রূপ।
                </ListItem>
                <ListItem>
                  <strong>ভুল Mask, বিচ্ছিন্ন যন্ত্র:</strong> একটা চেনা বিপদ,
                  Mask ভুল বসালে দুইটা যন্ত্র নিজেদের আলাদা পাড়ার ভাবে, অথচ তারা
                  আসলে এক পাড়ার। ফল, তারা সরাসরি কথা না বলে অকারণে Router খোঁজে,
                  আর যোগাযোগ ভেঙে পড়ে। এমন সমস্যা ডিবাগ করতে গেলে প্রথমেই Mask
                  মিলিয়ে দেখা জরুরি।
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
      title: <SectionTitle>চিঠি ছাড়ার আগে যন্ত্র যা ভাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনার Laptop একটা চিঠি পাঠাতে চায়। সরাসরি পাঠাবে নাকি Router এর হাতে
              দেবে, সেই সিদ্ধান্তটা সে Mask দিয়ে কীভাবে নেয়, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "দুইটা পাড়ার নাম বের করল",
              description:
                "Laptop নিজের IP আর গন্তব্যের IP, দুইটাকেই নিজের Subnet Mask দিয়ে মেপে দুইটা Network Address বের করল। মানে দুইজনের পাড়ার নাম।",
            },
            {
              title: "মিলিয়ে দেখল, এক পাড়া নাকি আলাদা",
              description:
                "দুইটা Network Address মিলিয়ে দেখল। মিলে গেলে গন্তব্য একই পাড়ার, না মিললে বাইরের পাড়ার। এই এক তুলনাই পরের সব ঠিক করে দেয়।",
            },
            {
              title: "এক পাড়া হলে, সরাসরি",
              description:
                "গন্তব্য একই Network এ হলে চিঠি সরাসরি যায়। Laptop শুধু পরের হাতের MAC বের করে (ARP, আগের লেসন), তারপর MAC দিয়ে সরাসরি পৌঁছে দেয়।",
            },
            {
              title: "আলাদা পাড়া হলে, দরজায়",
              description:
                "গন্তব্য বাইরের Network এ হলে সরাসরি যাওয়া যায় না। Laptop চিঠিটা তুলে দেয় Default Gateway, মানে Router এর হাতে, আর Router বাকি পথ সামলায়। এই Gateway নিয়ে পরের লেসন।",
            },
            {
              title: "প্রতি ধাপে একই প্রশ্ন",
              description:
                "Router নিজেও পরের ধাপে ঠিক এই একই প্রশ্ন করে, গন্তব্য কি আমার কোনো পাড়ার? এভাবে Mask এর হিসাব ধরে ধরে চিঠি ঠিক গন্তব্যে পৌঁছায়।",
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
                <strong>নিজের Mask দেখুন</strong>, নিচের Lab এ কমান্ড আছে। তারপর
                একটা ipcalc দিয়ে নিজের Network Address আর যন্ত্রসংখ্যা মিলিয়ে
                দেখুন, উপরের Lab এর সাথে মিলবে।
              </ListItem>
              <ListItem>
                <strong>Practical Networking</strong>, Search করুন: Subnetting
                Mastery। ধাপে ধাপে, একদম গোড়া থেকে, এই বিষয়ের সবচেয়ে পরিষ্কার
                সিরিজগুলোর একটা।{" "}
                <a
                  href="https://www.youtube.com/@PracticalNetworking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  youtube.com/@PracticalNetworking
                </a>
              </ListItem>
              <ListItem>
                <strong>PowerCert Animated Videos</strong>, Subnet Mask আর CIDR
                নিয়ে ছোট, সহজ Animation।{" "}
                <a
                  href="https://www.youtube.com/@PowerCertAnimatedVideos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  youtube.com/@PowerCertAnimatedVideos
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
      subHeader: { index: "008", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                Subnet Mask একটা IP এর ভেতরে Network আর Host এর মাঝে লাইন টেনে
                দেয়। Mask এ 255 মানে Network, 0 মানে Host।
              </ListItem>
              <ListItem>
                Mask আসলে একগুচ্ছ 1 তারপর একগুচ্ছ 0। CIDR /n মানে শুরুর n টা Bit
                Network। /24 মানে ঠিক 255.255.255.0।
              </ListItem>
              <ListItem>
                Prefix যত বড়, Network তত বড়, Host এর জায়গা তত কম, তাই তত কম যন্ত্র
                ধরে। প্রতি Network এ ২টা ঠিকানা বাদ, একটা Network Address একটা
                Broadcast।
              </ListItem>
              <ListItem>
                IP আর Mask কে AND করলে বেরোয় Network Address, মানে পাড়ার নাম।
                দুইজনের পাড়ার নাম মিললে তারা এক Network এ।
              </ListItem>
              <ListItem>
                এক Network হলে চিঠি সরাসরি যায় (MAC বের করে ARP)। আলাদা হলে চিঠি
                যায় Default Gateway তে, মানে Router এর হাতে। এই সিদ্ধান্তটা Mask
                এর।
              </ListItem>
              <ListItem>
                Subnetting মানে একটা বড় Network কে ছোট ভাগে ভাগ করা, Host থেকে Bit
                ধার করে। আলাদা বিভাগ, কম অপচয়, আর ভালো নিয়ন্ত্রণের জন্য।
              </ListItem>
              <ListItem>
                Mask ভুল হলে যন্ত্র নিজেদের ভুল পাড়ার ভাবে আর যোগাযোগ ভেঙে পড়ে,
                তাই ডিবাগে প্রথমেই Mask মিলিয়ে দেখা জরুরি।
              </ListItem>
              <ListItem>
                পরের লেসন: আলাদা পাড়ায় যাওয়ার সেই দরজা, Default Gateway।
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
        <span className="font-bold text-primary">Subnet Mask</span>,
        "IP তে Network আর Host এর মাঝে লাইন টানে, 255 মানে Network, 0 মানে Host",
      ],
      [
        <span className="font-bold text-primary">CIDR /n</span>,
        "শুরুর n টা Bit Network, /24 মানে 255.255.255.0",
      ],
      [
        <span className="font-bold text-primary">Network Address</span>,
        "IP আর Mask কে AND করে বেরোনো পাড়ার নাম, যেমন 192.168.1.0",
      ],
      [
        <span className="font-bold text-primary">এক Network?</span>,
        "দুইজনের Network Address মিললে সরাসরি, না মিললে Router লাগে",
      ],
      [
        <span className="font-bold text-primary">যন্ত্রসংখ্যা</span>,
        "Host Bit থেকে, তারপর ২টা বাদ (Network Address আর Broadcast)",
      ],
      [
        <span className="font-bold text-primary">Subnetting</span>,
        "Host থেকে Bit ধার করে একটা বড় Network কে ছোট ভাগে ভাগ করা",
      ],
      [
        <span className="font-bold text-primary">ভুল Mask</span>,
        "যন্ত্র নিজেদের ভুল পাড়ার ভাবে, যোগাযোগ ভেঙে পড়ে",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Subnet Mask 255.255.255.0 এর মানে কী?",
        options: [
          {
            key: "A",
            text: "পুরো IP ই Network",
            isCorrect: false,
            explanation:
              "না। যেখানে 255 সেটা Network, যেখানে 0 সেটা Host। শেষ অংশে 0, তাই ওটা Host।",
          },
          {
            key: "B",
            text: "প্রথম তিন অংশ Network, শেষ অংশ Host",
            isCorrect: true,
            explanation:
              "ঠিক। 255 মানে Network, 0 মানে Host। তাই 192.168.1 পর্যন্ত Network, শেষের সংখ্যা Host।",
          },
          {
            key: "C",
            text: "পুরো IP ই Host",
            isCorrect: false,
            explanation:
              "উল্টো। তিনটা 255 মানে বড় অংশটাই Network, শুধু শেষ 0 টুকু Host।",
          },
        ],
      },
      {
        id: 2,
        text: "CIDR এ /24 লিখলে সেটা কোন Mask?",
        options: [
          {
            key: "A",
            text: "255.255.0.0",
            isCorrect: false,
            explanation:
              "ওটা /16, মানে ১৬টা Bit Network। /24 মানে ২৪টা Bit।",
          },
          {
            key: "B",
            text: "255.255.255.0",
            isCorrect: true,
            explanation:
              "ঠিক। /24 মানে শুরুর ২৪টা Bit এক, যেটা তিনটা 255 আর একটা 0, মানে 255.255.255.0।",
          },
          {
            key: "C",
            text: "255.255.255.255",
            isCorrect: false,
            explanation:
              "ওটা /32, মানে ৩২টা Bit ই Network, একটাও Host নেই। /24 নয়।",
          },
        ],
      },
      {
        id: 3,
        text: "192.168.1.10 আর 192.168.1.200, Mask /24। এরা কি সরাসরি কথা বলতে পারে?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, দুইজনের Network Address এক (192.168.1.0)",
            isCorrect: true,
            explanation:
              "ঠিক। /24 তে প্রথম তিন অংশ Network, দুইজনের 192.168.1 এক, তাই এক পাড়া, সরাসরি কথা বলে।",
          },
          {
            key: "B",
            text: "না, শেষ সংখ্যা আলাদা তাই আলাদা Network",
            isCorrect: false,
            explanation:
              "শেষ সংখ্যা Host অংশ, ওটা আলাদা হওয়া তো স্বাভাবিক। Network অংশ (192.168.1) এক, তাই এক পাড়া।",
          },
          {
            key: "C",
            text: "না, ২০০ অনেক বড় সংখ্যা",
            isCorrect: false,
            explanation:
              "সংখ্যা বড় ছোট এখানে ব্যাপার নয়। /24 তে Network Address এক, তাই সরাসরি চলে।",
          },
        ],
      },
      {
        id: 4,
        text: "দুইটা যন্ত্রের Network Address আলাদা হলে কী হয়?",
        options: [
          {
            key: "A",
            text: "তারা সরাসরি কথা বলে",
            isCorrect: false,
            explanation:
              "না। আলাদা Network মানে আলাদা পাড়া, সরাসরি যাওয়া যায় না।",
          },
          {
            key: "B",
            text: "সরাসরি পারে না, চিঠি Default Gateway (Router) দিয়ে যায়",
            isCorrect: true,
            explanation:
              "ঠিক। আলাদা পাড়া হলে চিঠি তুলে দেওয়া হয় বাইরে বেরোনোর দরজায়, মানে Router এর হাতে।",
          },
          {
            key: "C",
            text: "চিঠি হারিয়ে যায়",
            isCorrect: false,
            explanation:
              "হারায় না। আলাদা Network হলে Router সেটা ঠিক পথে এগিয়ে দেয়।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা /24 কে /25 বানালে কী হয়?",
        options: [
          {
            key: "A",
            text: "এক Network দুইটা ছোট Network এ ভাগ হয়, প্রতিটা কম যন্ত্র ধরে",
            isCorrect: true,
            explanation:
              "ঠিক। Host থেকে একটা Bit ধার করলে Network দ্বিগুণ হয়, আর প্রতিটার যন্ত্রধারণ অর্ধেক, ২৫৪ থেকে ১২৬।",
          },
          {
            key: "B",
            text: "Network আরও বড় হয়, বেশি যন্ত্র ধরে",
            isCorrect: false,
            explanation:
              "উল্টো। Prefix বাড়লে Host এর জায়গা কমে, তাই কম যন্ত্র ধরে।",
          },
          {
            key: "C",
            text: "কিছুই বদলায় না",
            isCorrect: false,
            explanation:
              "বদলায়। /25 মানে লাইন এক ঘর সরে, এক Network দুই ভাগ হয়ে যায়।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের Mask আর Network",
    subtitle: "Terminal এ চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের Subnet Mask দেখুন",
        description:
          "আপনার যন্ত্রের Mask বের করুন। প্রায় নিশ্চিত এটা 255.255.255.0, মানে /24 হবে।",
      },
      {
        title: "Network Address বের করুন",
        description:
          "ipcalc দিয়ে আপনার IP আর Mask থেকে Network Address আর যন্ত্রসংখ্যা বের করুন, উপরের Lab এর সাথে মিলিয়ে দেখুন।",
      },
      {
        title: "Prefix বদলে দেখুন",
        description:
          "একই IP তে /25 বা /26 দিয়ে ipcalc চালান, দেখুন Network Address আর যন্ত্রসংখ্যা কীভাবে বদলায়।",
      },
      {
        title: "এক Subnet নাকি আলাদা",
        description:
          "দুইটা IP নিয়ে দেখুন তারা একই Network Address এ পড়ে কি না, মানে সরাসরি কথা বলতে পারবে কি না।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-my-mask.sh",
        language: "bash",
        code: `# নিজের Mask দেখুন
ip -4 addr show          # Linux, দেখাবে যেমন 192.168.1.10/24
ifconfig en0 | grep "inet "   # macOS

# macOS এ Mask দেখায় Hex এ, যেমন netmask 0xffffff00।
# 0xffffff00 মানে 255.255.255.0, মানে /24।
# ff = 255 (আটটা 1), 00 = 0 (আটটা 0)।`,
      },
      {
        filename: "2-network-address.sh",
        language: "bash",
        code: `# ipcalc দিয়ে পুরো ছবি (না থাকলে: apt install ipcalc / brew install ipcalc)
ipcalc 192.168.1.10/24

# দেখাবে যেমন:
#   Network:   192.168.1.0/24    <- পাড়ার নাম
#   HostMin:   192.168.1.1       <- প্রথম যন্ত্র
#   HostMax:   192.168.1.254     <- শেষ যন্ত্র
#   Broadcast: 192.168.1.255     <- পুরো পাড়ায় ডাক
#   Hosts/Net: 254               <- কতগুলো যন্ত্র`,
      },
      {
        filename: "3-change-prefix.sh",
        language: "bash",
        code: `# একই IP, ছোট ভাগ করে দেখুন যন্ত্রসংখ্যা কমে
ipcalc 192.168.1.10/25
# Hosts/Net: 126   <- /24 এর ঠিক অর্ধেক

ipcalc 192.168.1.10/26
# Hosts/Net: 62    <- আরও অর্ধেক

# Prefix যত বড়, যন্ত্র তত কম। উপরের Prefix Lab এর সাথে মিলিয়ে নিন।`,
      },
      {
        filename: "4-same-subnet.md",
        language: "markdown",
        code: `# দুইটা IP কি এক Subnet এ, হাতে মিলিয়ে দেখুন

দুইটা IP এর Network Address এক হলে তারা এক পাড়ার:

  192.168.1.10/24   ->  Network 192.168.1.0
  192.168.1.200/24  ->  Network 192.168.1.0   -> এক, সরাসরি চলে

কিন্তু Mask বদলে /25 করলে:

  192.168.1.10/25   ->  Network 192.168.1.0
  192.168.1.200/25  ->  Network 192.168.1.128 -> আলাদা, Router লাগবে

ipcalc দিয়ে দুইটা IP এর Network লাইন মিলিয়ে দেখুন, এক কি না।`,
      },
    ],
    tip: "তিন নম্বর পরীক্ষাটা সবচেয়ে চোখ খুলে দেয়, কারণ আপনি একই IP তে শুধু Prefix বদলে দেখবেন যন্ত্রসংখ্যা প্রতিবার ঠিক অর্ধেক হয়ে যাচ্ছে, ২৫৪ থেকে ১২৬, তারপর ৬২। তখন Subnetting আর বইয়ের নিয়ম থাকে না, একটা লাইন সরানোর সরাসরি ফল হয়ে যায়। উপরের Prefix Lab আর এই ipcalc এর সংখ্যা হুবহু মিলবে, নিজের চোখে মিলিয়ে নিন।",
  },
  assignment: {
    title: "Mini Project: লাইন সরিয়ে দেখা",
    time: "৫০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>নিজের Network:</strong> Lab এর এক আর দুই নম্বর চালিয়ে আপনার IP,
        Mask আর Network Address লিখুন। আপনার Network এ মোট কয়টা যন্ত্র ধরে?
      </span>,
      <span key="2">
        <strong>অর্ধেক করে করে:</strong> Lab এর তিন নম্বর দিয়ে আপনার IP তে /24,
        /25, /26, /27 চালিয়ে প্রতিবারের যন্ত্রসংখ্যা লিখুন। প্রতিবার কি ঠিক
        অর্ধেক হচ্ছে? এক লাইনে লিখুন কেন।
      </span>,
      <span key="3">
        <strong>এক নাকি আলাদা:</strong> 10.0.0.5 আর 10.0.0.130 নিন। /24 এ এরা কি
        এক Subnet এ? আর /25 এ? দুইটার Network Address বের করে (ipcalc বা Lab
        দিয়ে) উত্তর দিন, আর কেন বদলাল সেটাও লিখুন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু জিজ্ঞেস করলেন,
        দুইটা যন্ত্র সরাসরি কথা বলবে নাকি Router লাগবে, সেটা কীভাবে ঠিক হয়? তাঁকে
        Subnet Mask আর পাড়ার নামের উদাহরণ দিয়ে বোঝান।
      </span>,
    ],
    deliverables: [
      <span key="1">আপনার IP, Mask, Network Address আর যন্ত্রসংখ্যা</span>,
      <span key="2">/24 থেকে /27 এর যন্ত্রসংখ্যা, আর অর্ধেক হওয়ার কারণ</span>,
      <span key="3">দুই IP এর /24 আর /25 এ Network Address, আর কেন বদলাল</span>,
      <span key="4">সরাসরি নাকি Router, কীভাবে ঠিক হয়, ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
