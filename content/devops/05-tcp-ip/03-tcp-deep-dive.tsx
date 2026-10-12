import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CongestionWindowLab,
  SeqAckLab,
  TcpHeaderLab,
} from "../../../components/course/topics/tcp/tcp-animations";
import {
  BestEffortSplit,
  ConnectionLifeDiagram,
  FlowVsCongestionSplit,
  HeadOfLineDiagram,
  StreamVsMessagesSplit,
} from "../../../components/course/topics/tcp/tcp-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const tcpDeepDiveContent: TopicData = {
  id: "tcp-deep-dive",
  introduction: {
    badge: "MODULE 05 · LESSON 03",
    title: <SectionTitle>অবিশ্বস্ত রাস্তায় বিশ্বস্ত ডেলিভারি</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          একজন পর্যটক ঢাকায় বসে ফোনে Island Tours খুলে নৌকার একটা আসন বুক
          করলেন। তাঁর ফোন থেকে বুকিংয়ের তথ্য কয়েকটা Packet এ ভাগ হয়ে রওনা দিল।
          পথে ডজনখানেক Router, যাদের কেউ কাউকে চেনে না, আর যাদের কেউই কথা দেয়নি
          যে Packet গুলো পৌঁছে দেবে। কোনোটা হারাতে পারে, কোনোটা আগে পরে হয়ে যেতে
          পারে, কোনোটা দুইবার চলে আসতে পারে।
        </ContentParagraph>
        <ContentParagraph>
          অথচ Server এর Program বুকিংটা পেল নিখুঁত। একটা অক্ষরও এদিক ওদিক হয়নি।
          আপনি যত Website খুলেছেন, যত ফাইল নামিয়েছেন, যত Database Query
          চালিয়েছেন, সবখানে একই ঘটনা। ভাঙাচোরা একটা রাস্তার উপর দিয়ে নিখুঁত
          ডেলিভারি। এই জাদুটা যে করে তার নাম TCP, Transmission Control Protocol।
        </ContentParagraph>
        <ContentParagraph>
          আগের দুই লেসনে আপনি Layer এর মানচিত্রটা দেখেছেন, আর জেনেছেন TCP থাকে
          Transport Layer এ। এই লেসনে আমরা সেই একটা Layer এর ভেতরে ঢুকব। শেষে
          আপনি জানবেন TCP ঠিক কী কী কথা দেয় আর কী দেয় না, তার Header এর প্রতিটা
          ঘর কী কাজে লাগে, Packet হারালে সে কীভাবে টের পায় আর কী করে, সে কখন আর
          কেন গতি কমায়, আর একজন Developer হিসেবে Timeout, ECONNRESET, Connection
          Pool বা Keep-Alive এর মতো শব্দগুলো আসলে TCP এর কোন আচরণের নাম।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আপনি একটা বই পাতা ছিঁড়ে আলাদা আলাদা খামে ডাকে পাঠালেন। ডাক বিভাগ কিছুই কথা দেয়নি। তবু বন্ধু পুরো বইটা পেলেন, কারণ প্রতিটা পাতায় নম্বর ছিল, আর তিনি প্রতিবার লিখে জানাতেন কত নম্বর পর্যন্ত পেয়েছেন।",
      author: "TCP",
      role: "Lesson 03",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "best-effort",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>IP কোনো কথাই দেয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TCP কেন দরকার তা বুঝতে হলে আগে দেখতে হবে তার নিচের Layer টা কেমন।
                Module 02 এর Packet এর লেসনে আপনি দেখেছিলেন, Internet এ কোনো বড়
                কথা একটা চিঠি হয়ে যায় না, যায় একগাদা পোস্টকার্ড হয়ে, আর প্রতিটা
                পোস্টকার্ড নিজের মতো পথ খুঁজে নেয়। সেই পোস্টকার্ড বয়ে নেওয়ার কাজটা
                করে IP, যা আগের লেসনের Internet Layer।
              </ContentParagraph>
              <ContentParagraph>
                IP এর স্বভাবটা একজন ব্যস্ত পিয়নের মতো। সে খামের উপরের ঠিকানাটা
                পড়ে আর খামটা সঠিক দিকের পরের ডাকঘরে ছুঁড়ে দেয়। ব্যস, তার দায়িত্ব
                শেষ। খামটা পৌঁছাল কি না সে ফিরে দেখে না, কাউকে জানায় না, কোনো
                রসিদও রাখে না। এই নীতির একটা নাম আছে, Best Effort Delivery, মানে
                আমি সাধ্যমতো চেষ্টা করব, কিন্তু কোনো কথা দিচ্ছি না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <BestEffortSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই চেষ্টা করব কিন্তু কথা দিচ্ছি না নীতির ফলে পথে ঠিক চার রকম
                গোলমাল ঘটতে পারে। চারটাই মনে রাখুন, কারণ TCP এর প্রতিটা যন্ত্র
                এই চারটার কোনো একটার জবাব।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>হারিয়ে যাওয়া (Loss):</strong> প্রতিটা Router এর একটা
                  ছোট অপেক্ষার লাইন থাকে, যাকে বলে Queue। Packet যত দ্রুত আসছে
                  Router তত দ্রুত পাঠাতে না পারলে লাইনটা ভরে যায়, আর তখন নতুন আসা
                  Packet গুলোকে Router সোজা ফেলে দেয়। কাউকে কিছু না জানিয়েই।
                  Wi-Fi এর দুর্বল সংকেতেও Packet হারায়।
                </ListItem>
                <ListItem>
                  <strong>ক্রম ভেঙে যাওয়া (Reordering):</strong> দুইটা Packet
                  দুইটা আলাদা পথে যেতে পারে। পরে ছাড়া Packet টা ছোট পথ পেলে আগে
                  পৌঁছে যায়।
                </ListItem>
                <ListItem>
                  <strong>নকল হয়ে যাওয়া (Duplication):</strong> কোনো যন্ত্র
                  ভেবেছিল Packet টা যায়নি, তাই আবার পাঠিয়েছে, অথচ প্রথমটাও
                  পৌঁছেছিল। ফলে একই Packet দুইবার।
                </ListItem>
                <ListItem>
                  <strong>নষ্ট হয়ে যাওয়া (Corruption):</strong> তারে বা বাতাসে
                  কোনো গোলমালে একটা Bit শূন্য থেকে এক হয়ে গেল। Packet পৌঁছাল,
                  কিন্তু ভেতরের তথ্য আর আগের মতো নেই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা Chat এর বার্তায় একটা অক্ষর এদিক ওদিক হলে হয়তো চলে। কিন্তু
                বুকিংয়ের টাকার অঙ্কে একটা Bit উল্টে গেলে ৫০০ টাকা ৪৫০০ হয়ে যেতে
                পারে। একটা ZIP ফাইলের মাঝের একটা টুকরো হারালে পুরো ফাইলটাই আর
                খোলে না। তাই কাউকে না কাউকে এই চারটা গোলমাল সামলাতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "IP কে অবিশ্বস্ত রাখাটা ভুল নয়, সিদ্ধান্ত",
          content: (
            <p>
              স্বাভাবিক প্রশ্ন, IP কেই নির্ভরযোগ্য করে বানানো হলো না কেন? কারণ
              তাহলে পথের প্রতিটা Router কে প্রতিটা Packet এর হিসাব রাখতে হতো, আর
              কোটি কোটি Connection এর খাতা সামলাতে গিয়ে Router গুলো ধীর, দামি আর
              ভঙ্গুর হয়ে যেত। Internet এর নকশাকাররা উল্টো পথ নিয়েছিলেন। মাঝের
              রাস্তা থাকবে বোকা আর দ্রুত, আর সব বুদ্ধি থাকবে দুই প্রান্তের দুইটা
              যন্ত্রে। আগের লেসনে এর নাম জেনেছেন, End to End Principle। TCP হলো
              সেই প্রান্তের বুদ্ধি। এর আরেকটা লাভ, যার নির্ভরযোগ্যতা দরকার নেই সে
              TCP বাদ দিয়ে হালকা কিছু নিতে পারে, যা পরের লেসনের UDP।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "promises",
      subHeader: { index: "002", title: "The Promises" },
      title: <SectionTitle>TCP যা কথা দেয়, আর যা দেয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TCP আপনার Program কে একটা সহজ চুক্তি দেয়। আপনি এক প্রান্তে যা
                লিখবেন, অন্য প্রান্তে ঠিক তাই পড়া যাবে। এই এক বাক্যের ভেতরে ছয়টা
                আলাদা প্রতিশ্রুতি লুকিয়ে আছে। প্রতিটা আলাদা করে চিনে রাখুন, কারণ
                লেসনের বাকি অংশে আমরা একটা একটা করে দেখব কোনটা কীভাবে রাখা হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Reliable, মানে হারাবে না:</strong> কোনো টুকরো পথে
                  হারালে TCP নিজে টের পাবে আর আবার পাঠাবে। আপনার Program কে কিছু
                  করতে হবে না, এমনকি সে জানবেও না।
                </ListItem>
                <ListItem>
                  <strong>Ordered, মানে ক্রম ঠিক থাকবে:</strong> টুকরোগুলো যে
                  ক্রমেই পৌঁছাক, আপনার Program এর হাতে যাবে ঠিক পাঠানোর ক্রমে।
                </ListItem>
                <ListItem>
                  <strong>নকল থাকবে না, নষ্টও থাকবে না:</strong> একই টুকরো দুইবার
                  এলে একটা ফেলে দেওয়া হবে, আর পথে নষ্ট হওয়া টুকরো ধরা পড়ে বাতিল
                  হবে।
                </ListItem>
                <ListItem>
                  <strong>Connection Oriented, মানে আগে পরিচয়, পরে কথা:</strong>{" "}
                  Data পাঠানোর আগে দুই পক্ষ একটা সংযোগ তৈরি করে, যাকে বলে
                  Connection। ফোন করার মতো, আগে রিং, ওপাশ ধরলে তবে কথা। এর মানে
                  দুই পক্ষই কিছু তথ্য মনে রাখে, কত নম্বর Byte পর্যন্ত গেছে, কত
                  পর্যন্ত এসেছে। এই মনে রাখা তথ্যকে বলে State।
                </ListItem>
                <ListItem>
                  <strong>Flow Control, মানে ওপাশকে ডুবিয়ে দেবে না:</strong>{" "}
                  ওপাশের Program ধীরে পড়লে TCP পাঠানোর গতি কমিয়ে দেবে।
                </ListItem>
                <ListItem>
                  <strong>Congestion Control, মানে রাস্তাকে ডুবিয়ে দেবে না:</strong>{" "}
                  মাঝের Network ভিড়ে ঠাসা হলে TCP নিজে থেকে গতি কমাবে, যাতে সবাই
                  মিলে রাস্তাটা ব্যবহার করতে পারে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার উল্টো দিকটা, যা প্রায় কেউ বলে না অথচ সমান জরুরি। TCP চারটা
                জিনিসের কথা দেয় না, আর এই চারটা না জানার কারণেই বেশিরভাগ ভুল
                বোঝাবুঝি হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>গতির কথা দেয় না:</strong> TCP বলে পৌঁছাবে, কখন পৌঁছাবে
                  তা বলে না। একটা টুকরো হারালে সেটা ফেরত আসা পর্যন্ত পেছনের সবাই
                  অপেক্ষা করে।
                </ListItem>
                <ListItem>
                  <strong>গোপনীয়তার কথা দেয় না:</strong> TCP কিছুই Encrypt করে
                  না। পথের যে কেউ ভেতরের Data পড়তে পারে। গোপনীয়তা আসে TCP এর উপরে
                  বসা TLS থেকে, যা HTTPS এর S।
                </ListItem>
                <ListItem>
                  <strong>বার্তার সীমানার কথা দেয় না:</strong> আপনি তিনটা আলাদা
                  বার্তা লিখলে ওপাশে তিনটা আলাদা বার্তা হিসেবে আসবে, এমন কথা নেই।
                  এটা এত গুরুত্বপূর্ণ যে এর জন্য আলাদা একটা Section আছে।
                </ListItem>
                <ListItem>
                  <strong>তার কেটে গেলে পৌঁছানোর কথা দেয় না:</strong> Reliable
                  মানে TCP চেষ্টা চালিয়ে যাবে, অলৌকিক কিছু করবে এমন নয়। পথ
                  সত্যিই বন্ধ হয়ে গেলে TCP একসময় হাল ছেড়ে আপনার Program কে একটা
                  Error দেবে। তার প্রতিশ্রুতি আসলে এই, হয় ঠিকঠাক পৌঁছাবে, নয়তো
                  আপনাকে জানানো হবে যে পৌঁছায়নি।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "TCP কোথায় থাকে, আর কারা তাকে চেনে",
          content: (
            <p>
              TCP কোনো আলাদা যন্ত্র বা সেবা নয়। এটা আপনার Operating System এর
              Kernel এর ভেতরের একটা অংশ, ফোনের Kernel এ একটা কপি আর Server এর
              Kernel এ আরেকটা। Module 02 এর OS Networking লেসনে দেখেছিলেন, আপনার
              Program একটা Socket হাতে নিয়ে শুধু write আর read ডাকে, আর খাম বানানোর
              কাজটা করে Kernel। সেই খাম বানানোর বড় অংশটাই TCP। আর মাঝের Router
              গুলো? তারা TCP খোলেই না। একটা সাধারণ Router শুধু IP Header পড়ে পথ
              ঠিক করে। তাই পুরো হিসাবটা চলে শুধু দুই প্রান্তের দুইটা Kernel এর
              মধ্যে, মাঝের কেউ তার খবরও রাখে না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "life",
      subHeader: { index: "003", title: "Connection Lifecycle" },
      title: <SectionTitle>একটা Connection এর জন্ম, জীবন, বিদায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভেতরে ঢোকার আগে পুরো ছবিটা একবার উপর থেকে দেখে নিই। প্রতিটা TCP
                Connection এর জীবন তিন পর্বে ভাগ করা যায়, ঠিক একটা ফোনকলের মতো।
                আগে সংযোগ, তারপর কথা, শেষে বিদায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ConnectionLifeDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>খোলা:</strong> ফোন বলে আমি কথা বলতে চাই (SYN), Server
                  বলে ঠিক আছে, আমিও রাজি (SYN-ACK), ফোন বলে পেয়েছি (ACK)। এই
                  তিনটা ছোট বার্তায় কোনো Data থাকে না, শুধু দুই পক্ষ নিশ্চিত হয়
                  যে দুজনেই পাঠাতে আর পেতে পারছে, আর গোনা শুরু হবে কোন সংখ্যা
                  থেকে তা ঠিক করে নেয়। এর নাম Three-way Handshake। কেন তিনটা, দুইটা
                  বা চারটা নয়, আর এটা ব্যর্থ হলে কী দেখায়, সবটা লেসন ০৫ এ।
                </ListItem>
                <ListItem>
                  <strong>কথা বলা:</strong> দুই পক্ষ Data পাঠায়, আর প্রতিটা Data র
                  প্রাপ্তি স্বীকার করে। হারালে আবার পাঠায়, ওপাশ ধীর হলে গতি কমায়,
                  রাস্তা ভরে গেলে গতি কমায়। আজকের পুরো লেসন এই পর্বটা নিয়ে।
                </ListItem>
                <ListItem>
                  <strong>বন্ধ করা:</strong> এক পক্ষ বলে আমার বলা শেষ (FIN),
                  অন্য পক্ষ মেনে নেয় আর নিজেও শেষ করে। দুই দিক আলাদা আলাদা করে
                  বন্ধ হয়। এর খুঁটিনাটি, আর বন্ধ করার পরেও কেন একটা Connection
                  কিছুক্ষণ ঝুলে থাকে, সেটা লেসন ০৮ এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা কথা এখনই ধরে রাখুন, পরে বারবার কাজে লাগবে। Connection খোলার
                এই তিন ধাপে সময় লাগে, কারণ বার্তাগুলোকে সত্যিই পৃথিবীর এক প্রান্ত
                থেকে আরেক প্রান্তে যেতে আসতে হয়। তাই একটা Connection খোলা সস্তা
                নয়। একবার খোলা হলে সেটা বন্ধ না করে বারবার ব্যবহার করাই বুদ্ধিমানের
                কাজ। Keep-Alive আর Connection Pool, এই দুইটা শব্দ ঠিক এই একটা
                ভাবনা থেকে এসেছে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "header",
      subHeader: { index: "004", title: "The Header" },
      title: <SectionTitle>TCP Header, খামের উপরে যা যা লেখা থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TCP আপনার Data কে ছোট ছোট টুকরোয় কাটে। প্রতিটা টুকরোর সামনে সে
                নিজের কিছু তথ্য জুড়ে দেয়, খামের উপরে লেখা ঠিকানা আর নির্দেশের
                মতো। সামনের এই তথ্যটুকুকে বলে Header, আর Header সহ পুরো টুকরোটাকে
                বলে Segment। এই Segment তারপর নিচের Layer এ গিয়ে একটা IP Packet
                এর ভেতরে ঢোকে, যা লেসন ০৬ এ বিস্তারিত দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                TCP যত কথা দিয়েছে, তার সবটা রাখা হয় এই Header এর কয়েকটা ঘর দিয়ে।
                অন্য কোথাও কোনো গোপন যন্ত্র নেই। তাই Header টা বুঝলে TCP বোঝা
                হয়ে যায়। নিচের ছকে প্রতিটা ঘরে ক্লিক করে দেখুন। মানগুলো আমাদের
                গল্পের, ফোন 192.168.1.20 এর Port 51514 থেকে Server 103.94.135.2
                এর Port 443 এ যাওয়া একটা Segment।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TcpHeaderLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সব ঘর সমান গুরুত্বের নয়। মুখস্থ করার চেষ্টা না করে এই চারটা
                দলে ভাগ করে মনে রাখুন, তাহলে বাকি লেসনের সাথে মিলিয়ে নিতে পারবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কার কাছে যাবে:</strong> Source Port আর Destination
                  Port। খেয়াল করুন TCP Header এ কোনো IP Address নেই। IP Address
                  থাকে বাইরের খামে, মানে IP Header এ। মেশিন পর্যন্ত পৌঁছানো IP
                  এর কাজ, মেশিনের ভেতরে সঠিক Program খুঁজে বের করা TCP এর কাজ।
                </ListItem>
                <ListItem>
                  <strong>কোনটা কত নম্বর, আর কত পর্যন্ত পেয়েছি:</strong>{" "}
                  Sequence Number আর Acknowledgment Number। নির্ভরযোগ্যতার পুরো
                  ভার এই দুই ঘরের উপর।
                </ListItem>
                <ListItem>
                  <strong>কত পাঠানো যাবে:</strong> Window। Flow Control এর পুরো
                  ভার এই এক ঘরের উপর।
                </ListItem>
                <ListItem>
                  <strong>সংকেত আর পাহারা:</strong> Flags দিয়ে Connection খোলা,
                  বন্ধ আর ভাঙার সংকেত যায়। Checksum দিয়ে নষ্ট Data ধরা পড়ে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Header এর দাম, প্রতি Segment এ অন্তত ২০ Byte",
          content: (
            <p>
              Options ছাড়া TCP Header ২০ Byte। আধুনিক Connection এ প্রায় সবসময়
              ১২ Byte Timestamps Option থাকে, তাই বাস্তবে ৩২ Byte। তার বাইরে IP
              Header আরও ২০ Byte। অর্থাৎ আপনি এক Byte Data পাঠালেও তারের উপর
              দিয়ে যায় অন্তত ৪১ Byte। বড় ফাইলে এই বাড়তি ওজন চোখে পড়ে না, কিন্তু
              খুব ছোট ছোট অনেক বার্তা পাঠালে খরচটা বড় হয়ে দাঁড়ায়। এই সমস্যাটা
              আর তার সমাধান পরে Nagle এর Section এ আবার আসবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "byte-stream",
      subHeader: { index: "005", title: "Byte Stream" },
      title: <SectionTitle>TCP বার্তা চেনে না, চেনে শুধু Byte এর স্রোত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই Section টা মন দিয়ে পড়ুন। নিজের হাতে Socket নিয়ে কাজ করা প্রায়
                প্রত্যেক Developer জীবনে অন্তত একবার এই ভুলটা করেন, আর ভুলটা
                এমন যে নিজের মেশিনে সব ঠিক চলে, Production এ গিয়ে ভাঙে।
              </ContentParagraph>
              <ContentParagraph>
                একটা পানির পাইপের কথা ভাবুন। আপনি এক প্রান্তে তিন গ্লাস পানি
                ঢাললেন, একটার পর একটা। অন্য প্রান্তে কী বের হবে? তিনটা আলাদা
                গ্লাস নয়, একটা ধারা। কোথায় প্রথম গ্লাস শেষ আর দ্বিতীয়টা শুরু,
                পাইপ তা মনে রাখে না। TCP ঠিক এই পাইপ। আপনার Program যা লেখে, TCP
                তাকে দেখে একটা লম্বা Byte এর সারি হিসেবে, যার নাম Byte Stream।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StreamVsMessagesSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কথায় বিশ্বাস না করে নিজে দেখুন। নিচে দুইটা ছোট Node.js ফাইল। Server
              শুধু গোনে কয়টা টুকরো এলো আর প্রতিটায় কী ছিল। Client তিনবার write
              ডেকে তিনটা আলাদা বুকিং পাঠায়। Port টা কোডে লেখা নেই, Environment
              Variable থেকে পড়া হচ্ছে, আর না পেলে Program সোজা থেমে যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "stream-server.mjs",
          code: `import net from "node:net";

const port = Number(process.env.DEMO_PORT);
if (!port) throw new Error("DEMO_PORT is not set");

let chunkNo = 0;
const server = net.createServer((socket) => {
  // যতবার Kernel আমাদের হাতে কিছু Byte তুলে দেয়, ততবার data ঘটনা
  socket.on("data", (chunk) => {
    chunkNo += 1;
    console.log("chunk", chunkNo, "bytes", chunk.length, JSON.stringify(chunk.toString()));
  });
  socket.on("end", () => {
    console.log("client finished, total chunks:", chunkNo);
    server.close();
  });
});
server.listen(port, "127.0.0.1", () => console.log("listening on", port));`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "stream-client.mjs",
          code: `import net from "node:net";

const port = Number(process.env.DEMO_PORT);
if (!port) throw new Error("DEMO_PORT is not set");

const socket = net.connect(port, "127.0.0.1", () => {
  socket.write("BOOK seat=12;"); // বার্তা ১
  socket.write("BOOK seat=13;"); // বার্তা ২
  socket.write("BOOK seat=14;"); // বার্তা ৩
  socket.end();
});`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "run-stream-demo.sh",
          code: `export DEMO_PORT=9400

# এক Terminal এ
node stream-server.mjs

# আরেক Terminal এ (সেখানেও আগে export DEMO_PORT=9400)
node stream-client.mjs

# Server এর Terminal এ যা দেখা গেল:
#   listening on 9400
#   chunk 1 bytes 39 "BOOK seat=12;BOOK seat=13;BOOK seat=14;"
#   client finished, total chunks: 1
#
# তিনবার write, কিন্তু data ঘটনা মাত্র একবার। তিনটা বার্তা জোড়া লেগে
# ৩৯ Byte এর একটা টুকরো হয়ে এসেছে।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন ভাবুন Server এর কোডে কেউ লিখেছিল, প্রতিটা data ঘটনা মানে
                একটা বুকিং। তাহলে তিনটা বুকিংয়ের জায়গায় সে একটা অদ্ভুত বুকিং
                পেল। আর উল্টোটাও ঘটে। একটা বড় বার্তা দুই বা তিন টুকরো হয়ে আসতে
                পারে, তখন প্রথম টুকরোয় থাকে একটা অসম্পূর্ণ JSON, যা Parse করতে
                গেলে Error হয়। কয় টুকরোয় আসবে তা নির্ভর করে Network এর গতি,
                Buffer এর অবস্থা আর সময়ের উপর, তাই প্রতিবার আলাদা হতে পারে।
                নিজের মেশিনে ছোট বার্তায় প্রায়ই একটা write একটা data হয়ে আসে,
                তাই ভুলটা ধরা পড়ে না।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান হলো বার্তার সীমানা আপনি নিজে ঠিক করে দেওয়া। এই কাজটার নাম
                Framing, আর এর তিনটা প্রচলিত উপায় আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা বিশেষ চিহ্ন দিয়ে শেষ বোঝানো (Delimiter):</strong>{" "}
                  প্রতিটা বার্তার শেষে একটা নির্দিষ্ট অক্ষর, সাধারণত নতুন লাইন।
                  Receiver Byte জমাতে থাকে, আর ওই চিহ্ন পেলেই বোঝে একটা বার্তা
                  শেষ। Redis আর SMTP এভাবে কাজ করে।
                </ListItem>
                <ListItem>
                  <strong>আগে দৈর্ঘ্য বলে দেওয়া (Length Prefix):</strong> প্রতিটা
                  বার্তার শুরুতে কয়েক Byte এ লেখা থাকে বার্তাটা কত লম্বা।
                  Receiver আগে দৈর্ঘ্য পড়ে, তারপর ঠিক তত Byte জমা হওয়া পর্যন্ত
                  অপেক্ষা করে। HTTP এর Content-Length Header, PostgreSQL আর
                  WebSocket এভাবে কাজ করে।
                </ListItem>
                <ListItem>
                  <strong>সব বার্তা সমান মাপের (Fixed Length):</strong> সহজ,
                  কিন্তু অনমনীয়, তাই কম ব্যবহার হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচে প্রথম উপায়টা। Server এবার Byte গুলো একটা Buffer এ জমায় আর
                নতুন লাইন পেলে তবেই একটা বার্তা বের করে। Client ইচ্ছা করে দ্বিতীয়
                বার্তাটা মাঝখান থেকে ভেঙে দুই ভাগে পাঠায়, যাতে আপনি দেখতে পারেন
                সীমানা আর টুকরোর কোনো সম্পর্ক নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "framed-server.mjs",
          code: `import net from "node:net";

const port = Number(process.env.DEMO_PORT);
if (!port) throw new Error("DEMO_PORT is not set");

const server = net.createServer((socket) => {
  let buffer = ""; // অসম্পূর্ণ অংশ এখানে জমে থাকে
  socket.on("data", (chunk) => {
    buffer += chunk.toString();
    let end = buffer.indexOf("\\n");
    while (end !== -1) {
      const message = buffer.slice(0, end); // একটা পুরো বার্তা
      buffer = buffer.slice(end + 1);       // বাকিটা পরের বারের জন্য
      console.log("message:", message);
      end = buffer.indexOf("\\n");
    }
  });
  socket.on("end", () => server.close());
});
server.listen(port, "127.0.0.1");`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "framed-client.mjs",
          code: `import net from "node:net";

const port = Number(process.env.DEMO_PORT);
if (!port) throw new Error("DEMO_PORT is not set");

const socket = net.connect(port, "127.0.0.1", () => {
  // দ্বিতীয় বার্তাটা ইচ্ছা করে মাঝখানে ভাঙা
  socket.write("BOOK seat=12\\nBOOK se");
  setTimeout(() => {
    socket.write("at=13\\nBOOK seat=14\\n");
    socket.end();
  }, 200);
});

// Server এর Terminal এ যা দেখা গেল:
//   message: BOOK seat=12
//   message: BOOK seat=13
//   message: BOOK seat=14
// টুকরো এসেছিল দুইটা, ভাঙা জায়গায়। বার্তা বের হলো তিনটা, ঠিক জায়গায়।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "তাহলে রোজকার কাজে এটা নিয়ে ভাবতে হয় না কেন",
          content: (
            <p>
              কারণ আপনি সাধারণত সরাসরি TCP তে লেখেন না, লেখেন তার উপরে বসা কোনো
              Protocol এ, আর Framing এর কাজটা সেই Protocol আগেই করে রেখেছে। HTTP
              বলে দেয় Header কোথায় শেষ আর Body কত Byte। আপনার Database Driver
              জানে একটা উত্তর কোথায় শেষ। WebSocket প্রতিটা বার্তার আগে দৈর্ঘ্য
              লেখে। তাই Express বা NestJS এ আপনি পুরো একটা Request হাতে পান,
              টুকরো নয়। কিন্তু নিয়মটা জানা থাকা চাই দুই কারণে। এক, যেদিন নিজে
              একটা TCP Client বা Server লিখবেন, সেদিন এটা না জানলে বিপদ। দুই,
              এবার আপনি বুঝতে পারছেন Application Layer এর Protocol গুলো কেন
              আছে। TCP দেয় শুধু একটা নির্ভরযোগ্য পাইপ, সেই পাইপে কথাগুলো কীভাবে
              সাজানো হবে তা ঠিক করাই HTTP এর মতো Protocol এর প্রথম কাজ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "sequence",
      subHeader: { index: "006", title: "Sequence & ACK" },
      title: <SectionTitle>প্রতিটা Byte এর একটা নম্বর, আর প্রতিটা প্রাপ্তির একটা রসিদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শুরুর উক্তিতে বইয়ের পাতার কথা ছিল। পাতায় নম্বর থাকলে তিনটা সমস্যা
                একসাথে মিটে যায়। পাতা এলোমেলো এলে নম্বর দেখে সাজানো যায়। একই পাতা
                দুইবার এলে একটা ফেলে দেওয়া যায়। আর ৪ এর পরে সোজা ৬ এলে বোঝা যায় ৫
                হারিয়েছে। TCP ঠিক এই বুদ্ধিটাই খাটায়, শুধু একটা তফাত আছে। সে পাতা
                গোনে না, গোনে প্রতিটা Byte।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Sequence Number</strong> হলো একটা Segment এর প্রথম Byte টা
                পুরো স্রোতের কত নম্বর Byte। ধরুন ফোন Server কে ৫০০০ Byte পাঠাবে,
                ১০০০ Byte করে পাঁচটা Segment এ। প্রথম Segment এর Sequence Number
                ১, কারণ তার প্রথম Byte টা ১ নম্বর। দ্বিতীয়টার ১০০১, কারণ প্রথমটায়
                ১ থেকে ১০০০ চলে গেছে। তৃতীয়টার ২০০১। Segment এর নম্বর নয়, Byte
                এর নম্বর, এটা মাথায় বসিয়ে নিন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Acknowledgment Number</strong>, ছোট করে ACK, হলো উল্টো
                দিক থেকে আসা রসিদ। কিন্তু রসিদটা একটু অন্যভাবে লেখা। Receiver বলে
                না আমি ১০০০ নম্বর পর্যন্ত পেয়েছি। সে বলে, এরপর আমি ১০০১ নম্বরটা
                চাই। মানে একই, কিন্তু সংখ্যাটা এক বেশি। ACK সবসময় পরের প্রত্যাশিত
                Byte এর নম্বর। এই ধরনের ACK কে বলে Cumulative ACK, কারণ একটা সংখ্যা
                দিয়েই বলা হয়ে যায় এর আগের সবকিছু পেয়ে গেছি।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ পাঁচটা Segment একটা একটা করে পাঠান। প্রথমে কিছু না
                হারিয়ে, তারপর দ্বিতীয় Segment হারিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SeqAckLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab থেকে চারটা জিনিস তুলে রাখুন, প্রতিটা পরের Section গুলোর ভিত।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ACK এর জন্য আলাদা Packet লাগে না:</strong> প্রতিটা
                  Segment এর Header এ ACK এর ঘর আছে। তাই Server যখন নিজের Data
                  পাঠায়, তখন একই Segment এ ফোনের Data র রসিদও সেরে ফেলে। আলাদা
                  করে পাঠাতে হয় শুধু তখন, যখন তার নিজের কিছু পাঠানোর নেই।
                </ListItem>
                <ListItem>
                  <strong>একটা ACK হারালেও সাধারণত ক্ষতি নেই:</strong> ACK 2001
                  হারিয়ে গেলে আর তার পরে ACK 3001 পৌঁছালে Sender বুঝে নেয় ৩০০০
                  পর্যন্ত সবই পৌঁছেছে। Cumulative হওয়ার এটাই সুবিধা।
                </ListItem>
                <ListItem>
                  <strong>দুই দিকের গোনা আলাদা:</strong> ফোন থেকে Server এর দিকে
                  একটা Sequence Number চলে, Server থেকে ফোনের দিকে আরেকটা। একটা
                  Segment এর Seq ঘরে থাকে নিজের দিকের হিসাব, ACK ঘরে থাকে উল্টো
                  দিকের হিসাব।
                </ListItem>
                <ListItem>
                  <strong>গোনা ১ থেকে শুরু হয় না:</strong> বোঝার সুবিধায় আমরা ১
                  ধরেছি। বাস্তবে প্রতিটা Connection একটা এলোমেলো বড় সংখ্যা থেকে
                  গোনা শুরু করে, যার নাম Initial Sequence Number। কেন এলোমেলো,
                  সেটা Handshake এর লেসনে। tcpdump আর Wireshark সুবিধার জন্য আসল
                  সংখ্যা থেকে শুরুর সংখ্যাটা বাদ দিয়ে দেখায়, তাই আপনি সেখানেও ১
                  থেকেই দেখবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার একটা প্রশ্ন বাকি থাকে। TCP প্রতিটা টুকরো কত বড় করে কাটে?
                এর উত্তর একটা সংখ্যা, <strong>MSS</strong>, Maximum Segment Size,
                মানে একটা Segment এ সর্বোচ্চ কত Byte Data ধরবে। সাধারণ Ethernet
                বা Wi-Fi তে একটা Packet সর্বোচ্চ ১৫০০ Byte হতে পারে, এই সীমার নাম
                MTU। তা থেকে ২০ Byte IP Header আর ২০ Byte TCP Header বাদ দিলে থাকে
                ১৪৬০। তাই MSS সাধারণত ১৪৬০, আর Timestamps Option থাকলে Data র
                জন্য থাকে ১৪৪৮। দুই পক্ষ Handshake এর সময় একে অপরকে নিজের MSS
                জানিয়ে দেয়। MTU এর পুরো গল্প, আর Packet এর চেয়ে বড় কিছু পাঠাতে
                গেলে কী হয়, লেসন ০৬ এ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "retransmission",
      subHeader: { index: "007", title: "Retransmission" },
      title: <SectionTitle>হারালে TCP কীভাবে টের পায়, আর কী করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Packet হারালে কেউ এসে Sender কে খবর দেয় না। যে Router ফেলে দিয়েছে
                সে চুপ থাকে। তাহলে Sender জানবে কীভাবে? তার হাতে একটাই সূত্র আছে,
                রসিদ। রসিদ না এলে কিছু একটা হয়েছে। হারানো টুকরো আবার পাঠানোকে বলে
                Retransmission, আর TCP দুইটা আলাদা উপায়ে বোঝে কখন সেটা করতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>প্রথম উপায়, ঘড়ি ধরে অপেক্ষা।</strong> প্রতিটা Segment
                পাঠানোর সময় Sender একটা Timer চালু করে। Timer শেষ হওয়ার আগে ACK
                না এলে সে ধরে নেয় Segment টা হারিয়েছে আর আবার পাঠায়। এই অপেক্ষার
                সময়টার নাম RTO, Retransmission Timeout।
              </ContentParagraph>
              <ContentParagraph>
                RTO কত হওয়া উচিত? খুব ছোট হলে Sender অকারণে আবার পাঠাবে, অথচ ACK
                টা পথেই ছিল। খুব বড় হলে হারানো টুকরোর জন্য অনেকক্ষণ বসে থাকতে হবে।
                ঢাকা থেকে ঢাকার Server এ যাওয়া আসায় লাগে কয়েক মিলিসেকেন্ড, ঢাকা
                থেকে আমেরিকায় লাগে কয়েকশ। তাই একটা বাঁধা সংখ্যা চলে না। TCP তাই
                প্রতিটা Connection এ নিজে মেপে নেয় একটা Segment যেতে আর তার ACK
                ফিরতে কত সময় লাগছে। এই যাওয়া আসার সময়ের নাম RTT, Round Trip Time,
                যা Module 02 এর Latency এরই আরেক নাম। RTO ঠিক হয় এই মাপা RTT এর
                চেয়ে একটু বেশি ধরে। Linux এ RTO কখনো ২০০ মিলিসেকেন্ডের নিচে নামে
                না।
              </ContentParagraph>
              <ContentParagraph>
                আবার পাঠিয়েও ACK না এলে? তখন Sender আগের চেয়ে দ্বিগুণ সময় অপেক্ষা
                করে আবার পাঠায়। তারপর আবার দ্বিগুণ। ২০০ মিলিসেকেন্ড, ৪০০, ৮০০,
                ১.৬ সেকেন্ড, এভাবে। প্রতিবার অপেক্ষা দ্বিগুণ করার এই নিয়মকে বলে
                Exponential Backoff। যুক্তিটা সহজ। ACK আসছে না মানে পথ হয়তো ভিড়ে
                ঠাসা, আর ভিড়ের মধ্যে আরও ঘন ঘন পাঠালে ভিড় শুধু বাড়বে। Linux এ
                ডিফল্ট ব্যবস্থায় এভাবে ১৫ বার চেষ্টা চলে, যাতে মোট ১৫ মিনিটের মতো
                লেগে যায়। তারপর Kernel হাল ছেড়ে দেয় আর আপনার Program পায় ETIMEDOUT
                Error।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দ্বিতীয় উপায়, একই রসিদ বারবার আসা।</strong> ঘড়ির অপেক্ষা
                ধীর। তার চেয়ে দ্রুত একটা সূত্র আছে, যা আপনি এইমাত্র Lab এ দেখেছেন।
                Segment ২ হারালে আর ৩, ৪, ৫ পৌঁছালে Receiver প্রতিবার একই কথা
                বলে, আমি এখনো ১০০১ চাই। একই ACK আবার আসাকে বলে Duplicate ACK। একটা
                বা দুইটা Duplicate ACK ক্রম ভাঙার কারণেও আসতে পারে, তাই Sender
                তখনো অপেক্ষা করে। কিন্তু তিনটা Duplicate ACK পেলে সে নিশ্চিত হয়
                আর Timer এর জন্য বসে না থেকে হারানো Segment টা তখনই আবার পাঠায়।
                এর নাম Fast Retransmit। একটা ব্যস্ত Connection এ বেশিরভাগ হারানো
                Packet এভাবেই উদ্ধার হয়, কয়েক মিলিসেকেন্ডের মধ্যে।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা সূক্ষ্ম উন্নতি আছে, যার নাম আপনি Log আর tcpdump এ দেখবেন,{" "}
                <strong>SACK</strong>, Selective Acknowledgment। সাধারণ ACK শুধু
                বলতে পারে আমি ১০০১ চাই। সে বলতে পারে না যে ২০০১ থেকে ৫০০০ তো আমি
                পেয়েই গেছি। একসাথে দুই তিনটা Segment হারালে Sender তখন বুঝতে পারে
                না কোনগুলো আবার পাঠাতে হবে। SACK এই ফাঁকটা ভরে। Receiver Header
                এর Options ঘরে লিখে দেয়, ফাঁকের পরে আমি ঠিক এই এই অংশ পেয়েছি।
                তখন Sender শুধু সত্যিই হারানো টুকরোগুলোই আবার পাঠায়। আধুনিক সব
                Operating System এ SACK চালু থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "বাকি দুই গোলমাল, নকল আর নষ্ট, এরাও এখানেই মিটে যায়",
          content: (
            <p>
              নকল আসার সবচেয়ে বড় উৎস এই Retransmission নিজেই। ধরুন Segment টা
              আসলে পৌঁছেছিল, শুধু তার ACK টা হারিয়েছিল। Sender আবার পাঠাল, আর
              Receiver একই Byte দ্বিতীয়বার পেল। সমস্যা নেই, Sequence Number দেখেই
              সে বোঝে এই Byte গুলো তার কাছে আগে থেকেই আছে, তাই ফেলে দেয় আর আরেকবার
              ACK পাঠায়। আর নষ্ট Data ধরে Checksum। হিসাব না মিললে Receiver Segment
              টা এমনভাবে ফেলে দেয় যেন সেটা কখনো আসেইনি, কোনো ACK পাঠায় না। ACK না
              পেয়ে Sender আবার পাঠায়। অর্থাৎ নষ্ট হওয়াকে TCP হারিয়ে যাওয়ায় বদলে
              নেয়, আর হারিয়ে যাওয়ার সমাধান তার আগে থেকেই আছে। চারটা গোলমাল, দুইটা
              ঘর, Sequence Number আর Checksum, আর একটা নিয়ম, রসিদ না পেলে আবার
              পাঠাতে হবে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "TCP নির্ভরযোগ্য মানে আপনার Request একবারই পৌঁছেছে, এমন নয়",
          content: (
            <p>
              এখানে একটা ফাঁদ আছে যা অভিজ্ঞ Developer দেরও ধরে। TCP নিশ্চয়তা দেয়
              একটা Connection এর ভেতরের Byte গুলোর। সে আপনার ব্যবসার কাজের নিশ্চয়তা
              দেয় না। ধরুন পর্যটক বুকিং পাঠালেন, Server বুকিংটা Database এ লিখেও
              ফেলল, কিন্তু উত্তরটা ফেরার আগেই Connection ভেঙে গেল। পর্যটকের App
              একটা Error পেল আর আবার চেষ্টা করল, নতুন একটা Connection এ। TCP এর
              চোখে দুইটাই সফল আর আলাদা। ফল, একই আসন দুইবার বুক। তাই টাকা বা
              বুকিংয়ের মতো কাজে আবার চেষ্টা করার আগে ভাবতে হয়, একই Request দুইবার
              গেলে কী হবে। একই Request যতবারই যাক ফল একই থাকবে, এই গুণের নাম
              Idempotency, আর এটা পরে API এর Module এ বিস্তারিত আসবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "flow-control",
      subHeader: { index: "008", title: "Flow Control" },
      title: <SectionTitle>ওপাশ যতটুকু নিতে পারে, ততটুকুই পাঠানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ সমস্যা ছিল রাস্তায়। এবার একটা অন্য সমস্যা, যেখানে রাস্তা
                একদম ঠিক আছে। ধরুন একটা শক্তিশালী Server খুব দ্রুত Data পাঠাচ্ছে,
                আর ওপাশে একটা পুরনো ফোন, যার Program ব্যস্ত, সে ধীরে ধীরে পড়ছে।
                Data তো পৌঁছে যাচ্ছে, কিন্তু রাখবে কোথায়?
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা Connection এর জন্য Kernel একটা জায়গা আলাদা করে রাখে, যেখানে
                এসে পৌঁছানো Data জমা থাকে যতক্ষণ না Program সেটা read করে নেয়।
                এই জায়গার নাম Receive Buffer। একটা বালতির মতো ভাবুন। উপর থেকে
                Network পানি ঢালছে, নিচের কল দিয়ে Program পানি নিচ্ছে। Program
                ধীর হলে বালতি ভরে যায়। ভরা বালতিতে আরও ঢাললে পানি উপচে পড়বে, মানে
                ঠিকঠাক পৌঁছানো Data ফেলে দিতে হবে আর Sender কে আবার পাঠাতে হবে।
                পুরোটাই অপচয়।
              </ContentParagraph>
              <ContentParagraph>
                সমাধানটা আপনি Header এ আগেই দেখেছেন, Window ঘর। Receiver প্রতিটা
                ACK এর সাথে লিখে দেয় তার বালতিতে এই মুহূর্তে আর কত Byte ধরবে। এই
                সংখ্যার নাম Receive Window, ছোট করে rwnd। Sender এর নিয়ম একটাই,
                যেসব Byte এর রসিদ এখনো পাইনি তার মোট পরিমাণ কখনো এই সংখ্যা ছাড়াবে
                না। বালতি ভরতে থাকলে সংখ্যাটা ছোট হয়, Sender ধীর হয়। Program পড়ে
                নিলে সংখ্যাটা বড় হয়, Sender আবার গতি বাড়ায়। এটাই Flow Control।
              </ContentParagraph>
              <ContentParagraph>
                এই ব্যবস্থার আরেকটা নাম শুনবেন, Sliding Window। কারণটা এই। Sender
                এর চোখে Byte এর লম্বা সারির উপর একটা জানালা বসানো আছে। জানালার
                ভেতরের Byte গুলো সে পাঠাতে পারে। যত ACK আসে, জানালাটা তত ডানে
                সরে যায় আর নতুন Byte ভেতরে ঢোকে। জানালা সরে সরে এগোয়, তাই Sliding।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Zero Window:</strong> বালতি পুরো ভরে গেলে Receiver
                  Window লেখে শূন্য। Sender তখন পুরোপুরি থেমে যায়। এটা কোনো Error
                  নয়, Connection ঠিকই আছে, শুধু দাঁড়িয়ে আছে।
                </ListItem>
                <ListItem>
                  <strong>Window Probe:</strong> থেমে থাকা Sender মাঝে মাঝে একটা
                  ছোট্ট খোঁজ নেওয়া Segment পাঠায়, জায়গা হলো কি? কারণ জায়গা হওয়ার
                  খবরটা নিয়ে আসা ACK টা নিজেই হারিয়ে যেতে পারে, আর তখন দুই পক্ষই
                  অনন্তকাল একে অপরের অপেক্ষায় বসে থাকত।
                </ListItem>
                <ListItem>
                  <strong>Window Scale:</strong> Window ঘরটা ১৬ Bit, তাই তাতে
                  সর্বোচ্চ ৬৫৫৩৫ লেখা যায়, মানে ৬৪ KB। আজকের দ্রুত সংযোগে এটা খুব
                  কম। তাই Handshake এর সময় দুই পক্ষ একটা গুণক ঠিক করে নেয়। গুণক ৭
                  মানে Window এর সংখ্যাকে ১২৮ দিয়ে গুণ করতে হবে। এই কারণে tcpdump
                  এ win 2058 দেখলে আসল জায়গা ২০৫৮ Byte নয়, তার অনেক গুণ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার নিজের চোখে দেখুন। নিচের Server সংযোগ নেয়, কিন্তু প্রথম ৩
                সেকেন্ড কিছুই পড়ে না। Client একটানা ২০ MB লিখতে চায়, আর প্রতি আধা
                সেকেন্ডে জানায় কত Byte সে Kernel এর হাতে দিতে পেরেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "slow-reader.mjs",
          code: `import net from "node:net";

const port = Number(process.env.DEMO_PORT);
if (!port) throw new Error("DEMO_PORT is not set");

// এই Server সংযোগ নেয়, কিন্তু ৩ সেকেন্ড কিছুই পড়ে না
const server = net.createServer((socket) => {
  socket.pause();
  setTimeout(() => {
    console.log("reader: now reading");
    socket.resume();
  }, 3000);
  let total = 0;
  socket.on("data", (chunk) => (total += chunk.length));
  socket.on("end", () => {
    console.log("reader: received bytes", total);
    server.close();
  });
});
server.listen(port, "127.0.0.1");`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "fast-writer.mjs",
          code: `import net from "node:net";

const port = Number(process.env.DEMO_PORT);
if (!port) throw new Error("DEMO_PORT is not set");

const block = Buffer.alloc(64 * 1024, "x");
const totalBlocks = 320; // মোট প্রায় ২০ MB
let queued = 0;

const socket = net.connect(port, "127.0.0.1", () => {
  const pump = () => {
    while (queued < totalBlocks) {
      queued += 1;
      // write() false দিলে থামতে হবে, drain এলে আবার শুরু
      if (!socket.write(block)) {
        socket.once("drain", pump);
        return;
      }
    }
    socket.end();
  };
  pump();
});

const started = Date.now();
const timer = setInterval(() => {
  const sec = ((Date.now() - started) / 1000).toFixed(1);
  console.log("t=" + sec + "s", "handed to Kernel:", socket.bytesWritten, "still in my process:", socket.writableLength);
}, 500);
socket.on("close", () => clearInterval(timer));`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "run-flow-control.sh",
          code: `export DEMO_PORT=9403
node slow-reader.mjs &
sleep 0.4
node fast-writer.mjs &
sleep 1.6
netstat -an -p tcp | grep -E "Proto|9403"     # macOS
# Linux এ:  ss -tn "( sport = :9403 or dport = :9403 )"
wait

# যা দেখা গেল (macOS):
#   t=0.5s handed to Kernel: 1114112 still in my process: 65536
#   t=1.0s handed to Kernel: 1114112 still in my process: 65536
#   t=1.5s handed to Kernel: 1114112 still in my process: 65536
#   Proto Recv-Q Send-Q  Local Address      Foreign Address    (state)
#   tcp4  604492      0  127.0.0.1.9403     127.0.0.1.57266    ESTABLISHED
#   tcp4       0 433708  127.0.0.1.57266    127.0.0.1.9403     ESTABLISHED
#   t=2.0s handed to Kernel: 1114112 still in my process: 65536
#   t=2.5s handed to Kernel: 1114112 still in my process: 65536
#   reader: now reading
#   t=3.0s handed to Kernel: 1900544 still in my process: 65536
#   reader: received bytes 20971520`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই কয়েকটা লাইনে পুরো Flow Control ধরা আছে, তাই ধীরে পড়ুন। Writer
                চেয়েছিল ২০ MB পাঠাতে, কিন্তু প্রায় ১.১ MB এ এসে আটকে গেছে আর
                আড়াই সেকেন্ড ধরে এক Byte ও এগোয়নি। কেন, তা netstat এর দুই সারিতে
                লেখা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রথম সারি, Reader এর দিক:</strong> Recv-Q তে ৬০৪৪৯২।
                  এটাই সেই বালতি। ৬ লাখ Byte পৌঁছে Kernel এ বসে আছে, কারণ Program
                  পড়ছে না। বালতি ভরে গেছে, তাই Reader এর Kernel Window ছোট করতে
                  করতে শূন্যে নামিয়েছে।
                </ListItem>
                <ListItem>
                  <strong>দ্বিতীয় সারি, Writer এর দিক:</strong> Send-Q তে
                  ৪৩৩৭০৮। এই Byte গুলো Writer এর Kernel এ অপেক্ষা করছে, কারণ ওপাশ
                  বলে দিয়েছে আর জায়গা নেই। এর নাম Send Buffer।
                </ListItem>
                <ListItem>
                  <strong>দুইটা যোগ করুন:</strong> ৬০৪৪৯২ আর ৪৩৩৭০৮ মিলে প্রায়
                  ১০ লাখ ৩৮ হাজার, যা Writer এর বলা ১১ লাখ ১৪ হাজারের কাছাকাছি।
                  অর্থাৎ Writer যা Kernel কে দিয়েছে তার প্রায় সবটাই দুই Buffer এ
                  আটকে আছে।
                </ListItem>
                <ListItem>
                  <strong>তিন সেকেন্ড পর:</strong> Reader পড়া শুরু করতেই বালতি
                  খালি হলো, Window খুলল, আর বাকি ১৯ MB এক নিমেষে চলে গেল। একটা
                  Byte ও হারায়নি, শেষ লাইনে পুরো ২০৯৭১৫২০।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                খেয়াল করুন ধীরগতিটা শিকল বেয়ে পেছন দিকে গড়িয়ে গেছে। ওপাশের Program
                ধীর, তাই তার Kernel এর Buffer ভরল। তাই এপাশের Kernel এর Buffer
                ভরল। তাই Node এর write() false দিল। তাই আমাদের কোড থেমে drain এর
                অপেক্ষা করল। ধীর ভোক্তার চাপ এভাবে উৎস পর্যন্ত ফিরে যাওয়াকে বলে
                Backpressure। Node এর Stream আর pipe() যে আপনাকে RAM ভরিয়ে ফেলা
                থেকে বাঁচায়, তার গোড়ায় আছে TCP এর এই Window ঘরটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "write() এর false উপেক্ষা করলে কী হয়",
          content: (
            <p>
              উপরের কোডে write() false দিলে আমরা থেমেছি। না থামলে কী হতো? TCP
              তবুও ওপাশকে ডুবিয়ে দিত না, Window তাকে আটকাত। কিন্তু যে Data Kernel
              নিতে পারছে না, Node সেটা নিজের Memory তে জমিয়ে রাখত। উপরে still in
              my process এর পাশের সংখ্যাটাই সেই জমা। ধীর একজন Client কে বড় একটা
              ফাইল পাঠানোর সময় এই ভুল করলে পুরো ফাইলটা Server এর RAM এ এসে বসে।
              এরকম একশ Client এলে Server এর Memory শেষ। ধীর Client এর কারণে Server
              এর Memory ফুলে ওঠা দেখলে প্রথম সন্দেহ এখানেই করুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "congestion",
      subHeader: { index: "009", title: "Congestion Control" },
      title: <SectionTitle>রাস্তা কতটা নিতে পারে, কেউ বলে দেয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Flow Control ওপাশের Program কে বাঁচায়। কিন্তু আরেকজন আছে যাকে
                বাঁচানো দরকার, মাঝের রাস্তা। ধরুন ওপাশের বালতি বিশাল, Window বলছে
                ১০ MB পাঠানো যাবে। কিন্তু আপনার বাসার Wi-Fi থেকে Server পর্যন্ত পথে
                কোথাও একটা সরু জায়গা আছে, যেখান দিয়ে সেকেন্ডে ১ MB এর বেশি যায়
                না। আপনি ১০ MB একসাথে ঠেলে দিলে সেই সরু জায়গার Router এর লাইন ভরে
                যাবে আর সে Packet ফেলতে শুরু করবে। শুধু আপনার নয়, ওই পথ ব্যবহার
                করা সবার।
              </ContentParagraph>
              <ContentParagraph>
                মাঝের পথ ভিড়ে ঠাসা হয়ে যাওয়াকে বলে Congestion। এখানে সমস্যা হলো,
                Flow Control এর মতো কেউ কোনো সংখ্যা বলে দিচ্ছে না। Router রা TCP
                Header এ কিছু লেখে না, তাদের কোনো Window ঘর নেই। পথের সরু জায়গাটা
                কতটা সরু, আর সেখানে এই মুহূর্তে আর কতজন আছে, Sender এর জানার কোনো
                সরাসরি উপায় নেই।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FlowVsCongestionSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাই Sender আন্দাজ করে, আর আন্দাজটা সে রাখে নিজের কাছে একটা সংখ্যায়।
                সংখ্যাটার নাম Congestion Window, ছোট করে cwnd। এটা Header এ যায়
                না, ওপাশ জানেও না, এটা শুধু Sender এর নিজের মাথার ভেতরের হিসাব,
                আমার ধারণা এই পথ একসাথে এতটুকু নিতে পারবে। তারপর নিয়মটা দাঁড়ায়
                এরকম।
              </ContentParagraph>
              <ContentParagraph>
                <strong>
                  রসিদ না পাওয়া Byte এর পরিমাণ কখনো cwnd আর rwnd এর মধ্যে যেটা
                  ছোট, তার বেশি হবে না।
                </strong>{" "}
                ওপাশের বালতি আর মাঝের রাস্তা, দুইটার মধ্যে যেটা বেশি সরু, সেটাই
                গতি ঠিক করে।
              </ContentParagraph>
              <ContentParagraph>
                এখন প্রশ্ন, আন্দাজটা Sender করে কীভাবে? একটা অচেনা সেতুতে ট্রাক
                তোলার কথা ভাবুন। সেতু কত ভার নেবে লেখা নেই। আপনি প্রথমে হালকা
                বোঝা নিয়ে পার হলেন। ঠিক আছে। পরের বার দ্বিগুণ। আবার ঠিক আছে। আবার
                দ্বিগুণ। একসময় সেতু কাঁপল। আপনি বোঝা অর্ধেক করলেন আর এবার থেকে
                খুব সাবধানে একটু একটু করে বাড়ালেন। TCP ঠিক এটাই করে, আর Packet
                হারানোই তার কাছে সেতু কাঁপার সংকেত। নিচের Lab এ নিজে চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CongestionWindowLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab এ যা দেখলেন তার চারটা অংশের প্রতিটার একটা নাম আছে, আর এই
                নামগুলো আপনি Performance নিয়ে যেকোনো লেখায় পাবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Slow Start:</strong> নতুন Connection ছোট একটা cwnd
                  দিয়ে শুরু করে, আধুনিক Linux এ ১০টা Segment, যা প্রায় ১৪ KB।
                  প্রতিটা ACK এ cwnd বাড়ে, ফলে প্রতি Round Trip এ মোটামুটি দ্বিগুণ
                  হয়। ১০, ২০, ৪০, ৮০। নামে Slow, কারণ সে পুরো গতিতে শুরু করে না।
                  আসলে বৃদ্ধিটা খুব দ্রুত।
                </ListItem>
                <ListItem>
                  <strong>ssthresh:</strong> Slow Start Threshold, একটা সীমা যার
                  পরে Sender আর দ্বিগুণ করে না। এটাকে ভাবুন Sender এর স্মৃতি
                  হিসেবে, গতবার মোটামুটি এখানে এসে সেতু কেঁপেছিল।
                </ListItem>
                <ListItem>
                  <strong>Congestion Avoidance:</strong> ssthresh পার হওয়ার পর
                  প্রতি Round Trip এ cwnd বাড়ে মাত্র একটা Segment করে। ধীরে ধীরে
                  সীমাটা খুঁজে দেখা।
                </ListItem>
                <ListItem>
                  <strong>হারালে পিছিয়ে আসা:</strong> তিনটা Duplicate ACK এ cwnd
                  অর্ধেক হয়, কারণ পথ চালু আছে, শুধু একটু বেশি হয়ে গিয়েছিল। Timeout
                  এ cwnd একদম ১ এ নামে আর Slow Start নতুন করে শুরু হয়, কারণ কিছুই
                  ফিরছে না মানে অবস্থা গুরুতর।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ফলে একটা লম্বা Connection এর cwnd এর রেখা দেখতে করাতের দাঁতের মতো
                হয়। ধীরে ওঠে, হঠাৎ অর্ধেক নামে, আবার ধীরে ওঠে। ঠিক কোন নিয়মে উঠবে
                আর নামবে, তার কয়েকটা সংস্করণ আছে, যাদের বলে Congestion Control
                Algorithm। Reno সবচেয়ে পুরনো আর উপরে যা শিখলেন তা মূলত এটাই।
                CUBIC আজকের Linux আর macOS এর ডিফল্ট, দ্রুত সংযোগে সে আরও তাড়াতাড়ি
                উপরে ওঠে। BBR Google এর বানানো, সে Packet হারানোর অপেক্ষা না করে
                সরাসরি পথের গতি আর দেরি মেপে সিদ্ধান্ত নেয়। নামগুলো চিনে রাখলেই
                চলবে, মূল ভাবনাটা সবার এক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Slow Start এর কারণে নতুন Connection সবসময় ধীর, আর এটা আপনার সাইটের গতি ঠিক করে",
          content: (
            <p>
              এই একটা তথ্য Web Performance এর অর্ধেক পরামর্শের পেছনের কারণ। একটা
              একদম নতুন Connection প্রথম Round Trip এ পাঠাতে পারে মোটামুটি ১৪ KB,
              দ্বিতীয়টায় ২৮ KB, তৃতীয়টায় ৫৬ KB। পর্যটকের সংযোগ যত দ্রুতই হোক,
              প্রথম কয়েকটা Round Trip এ এর বেশি যাবে না। এ থেকে তিনটা জিনিস বেরিয়ে
              আসে। এক, পাতার প্রথম ১৪ KB এর মধ্যে জরুরি জিনিসগুলো থাকলে পাতা এক
              Round Trip এই আঁকা শুরু হতে পারে, এই কারণেই HTML ছোট রাখা আর Compress
              করার এত কথা। দুই, একটা Connection যত বেশিক্ষণ বাঁচে তার cwnd তত বড়
              হয়, তাই পুরনো Connection বারবার ব্যবহার করলে শুধু Handshake এর সময়ই
              বাঁচে না, গতিও বেশি পাওয়া যায়। তিন, Server পর্যটকের কাছে থাকলে প্রতিটা
              Round Trip ছোট হয়, তাই cwnd দ্রুত বাড়ে। CDN এর একটা বড় লাভ এখানেই।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "nagle",
      subHeader: { index: "010", title: "Small Writes" },
      title: <SectionTitle>ছোট ছোট লেখা, Nagle আর Delayed ACK</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Header এর Section এ একটা হিসাব দেখেছিলেন, এক Byte Data পাঠাতেও
                তারের উপর দিয়ে যায় অন্তত ৪১ Byte। একটা Program যদি এক অক্ষর এক
                অক্ষর করে লেখে, যেমন দূরের একটা Terminal এ আপনি যখন টাইপ করেন,
                তাহলে প্রতিটা অক্ষরের জন্য একটা আলাদা Packet যাবে, যার প্রায়
                পুরোটাই Header। এক ডজন ডিম আনতে বারোবার বাজারে যাওয়ার মতো।
              </ContentParagraph>
              <ContentParagraph>
                এর সমাধান দিয়েছিলেন John Nagle, তাই নাম Nagle Algorithm। নিয়মটা
                এক লাইনের। আগে পাঠানো Data র ACK যতক্ষণ না আসছে, ততক্ষণ নতুন ছোট
                লেখাগুলো পাঠানো হবে না, জমানো হবে। ACK এলে, বা একটা পুরো Segment ভরার মতো
                Data জমলে, সব একসাথে যাবে। বাজারের থলে ভরলে তবে রওনা। প্রায় সব
                Operating System এ এটা ডিফল্ট চালু।
              </ContentParagraph>
              <ContentParagraph>
                ওপাশে আছে আরেকটা সাশ্রয়ী বুদ্ধি, Delayed ACK। Receiver প্রতিটা
                Segment পেয়েই সাথে সাথে ACK পাঠায় না। সে একটু অপেক্ষা করে, সাধারণত
                ৪০ মিলিসেকেন্ড পর্যন্ত, এই আশায় যে তার Program ও হয়তো এখনই কিছু
                উত্তর পাঠাবে, আর তখন সেই Data র সাথেই ACK টা বিনা খরচে চলে যাবে।
                আলাদা একটা খালি Packet বাঁচল।
              </ContentParagraph>
              <ContentParagraph>
                আলাদা আলাদাভাবে দুইটাই ভালো। একসাথে পড়লে একটা বিখ্যাত সমস্যা হয়।
                ধরুন আপনার Program একটা Request দুই ভাগে লেখে, আগে ছোট একটা
                Header, তারপর ছোট একটা Body। প্রথম ভাগ চলে গেল। দ্বিতীয় ভাগ Nagle
                আটকে রাখল, প্রথমটার ACK এর অপেক্ষায়। ওপাশে Delayed ACK সেই ACK
                আটকে রাখল, কারণ তার Program পুরো Request না পেয়ে কোনো উত্তর দিচ্ছে
                না। দুজন দুজনের অপেক্ষায়, ৪০ মিলিসেকেন্ড পর্যন্ত, যতক্ষণ না Delayed
                ACK এর ধৈর্য ফুরায়। আপনি দেখেন প্রতিটা Request এ অকারণ ৪০
                মিলিসেকেন্ড দেরি, অথচ Network একদম ফাঁকা।
              </ContentParagraph>
              <ContentParagraph>
                এর জন্য একটা সুইচ আছে, <strong>TCP_NODELAY</strong>। এটা চালু করলে
                Nagle বন্ধ হয় আর প্রতিটা লেখা তখনই চলে যায়। Node.js এ
                socket.setNoDelay(true)। যেসব Program এ ছোট বার্তা আর দ্রুত উত্তর
                জরুরি, যেমন Database Driver, Redis Client, Game, বা Chat, তারা
                প্রায় সবাই এটা চালু রাখে। Node এর HTTP Server ও ডিফল্টে এটা চালু
                রাখে। আপনাকে নিজে হাত দিতে হবে শুধু যখন নিজে Socket নিয়ে কাজ
                করছেন আর অকারণ ৪০ মিলিসেকেন্ডের একটা দেরি খুঁজে পাচ্ছেন না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ভালো অভ্যাস: পুরো বার্তা একবারে লিখুন",
          content: (
            <p>
              Nagle এর ফাঁদে পড়ার আসল কারণ হলো একটা বার্তাকে কয়েকটা ছোট write এ
              ভাগ করা। Header আর Body আলাদা আলাদা না লিখে একটা Buffer এ জুড়ে একবারে
              লিখলে সমস্যাটাই তৈরি হয় না, TCP_NODELAY থাকুক বা না থাকুক। তখন কম
              Packet যায়, কম Header এর অপচয় হয়, আর ওপাশও এক বারেই পুরো বার্তা পায়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "keepalive",
      subHeader: { index: "011", title: "Idle Connections" },
      title: <SectionTitle>চুপচাপ Connection, বেঁচে আছে না মরে গেছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TCP Connection এর একটা অদ্ভুত স্বভাব আছে যা প্রথমবার শুনলে অবাক
                লাগে। দুই পক্ষ যখন কিছু পাঠাচ্ছে না, তখন তারের উপর দিয়ে কিছুই যায়
                না। একদম কিছু না। Connection টা তখন আসলে শুধু দুই Kernel এর খাতায়
                লেখা কিছু সংখ্যা। মাঝখানে কোনো তার টানা নেই, কোনো সংকেত নেই।
              </ContentParagraph>
              <ContentParagraph>
                এর ফল হলো, ওপাশের যন্ত্রটা হঠাৎ বন্ধ হয়ে গেলে, বা মাঝের কোনো তার
                কেটে গেলে, এপাশ কিছুই টের পায় না। তার খাতায় Connection টা তখনো
                খোলা। সে যতদিন কিছু পাঠানোর চেষ্টা না করছে, ততদিন জানবেও না।
                এরকম এক পাশে খোলা আর অন্য পাশে মৃত Connection কে বলে Half-open
                Connection।
              </ContentParagraph>
              <ContentParagraph>
                এটা ধরার জন্য TCP এর একটা ব্যবস্থা আছে, <strong>TCP Keepalive</strong>।
                Connection অনেকক্ষণ চুপ থাকলে Kernel নিজে থেকে একটা খালি Segment
                পাঠায়, শুধু জিজ্ঞেস করতে, আছেন? ওপাশ ACK দিলে সব ঠিক। পরপর কয়েকবার
                উত্তর না এলে Kernel Connection টাকে মৃত ঘোষণা করে আর আপনার Program
                কে Error দেয়। কিন্তু ডিফল্ট সংখ্যাগুলো দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "keepalive-defaults.sh",
          code: `# macOS (মান মিলিসেকেন্ডে)
sysctl net.inet.tcp.keepidle net.inet.tcp.keepintvl net.inet.tcp.keepcnt
#   net.inet.tcp.keepidle: 7200000     <- ২ ঘণ্টা চুপ থাকলে প্রথম খোঁজ
#   net.inet.tcp.keepintvl: 75000      <- উত্তর না এলে ৭৫ সেকেন্ড পরপর আবার
#   net.inet.tcp.keepcnt: 8            <- ৮ বার ব্যর্থ হলে মৃত

# Linux (মান সেকেন্ডে), সাধারণত 7200, 75 আর 9 দেখায়
sysctl net.ipv4.tcp_keepalive_time net.ipv4.tcp_keepalive_intvl net.ipv4.tcp_keepalive_probes`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুই ঘণ্টা। তার উপর Keepalive ডিফল্টে বন্ধ থাকে, Program কে প্রতিটা
                Socket এ আলাদা করে চালু করতে হয়। এই সংখ্যাটা ঠিক করা হয়েছিল এমন
                এক যুগে, যখন Network এ প্রতিটা Packet এর দাম ছিল। আজকের জন্য এটা
                অনেক বেশি লম্বা, আর কারণটা Module 03 এর NAT লেসনে লুকিয়ে আছে।
              </ContentParagraph>
              <ContentParagraph>
                মনে করুন, Router তার NAT Table এ প্রতিটা Connection এর জন্য একটা
                সারি রাখে। সেই সারি চিরকাল থাকে না। অনেকক্ষণ কোনো Packet না গেলে
                Router সারিটা মুছে ফেলে, জায়গা বাঁচাতে। বাসার Router এ এটা কয়েক
                মিনিট থেকে কয়েক ঘণ্টা, মোবাইল অপারেটরের Network এ প্রায়ই কয়েক
                মিনিট। Cloud এর Load Balancer ও একই কাজ করে, আর সেখানে সেটিংটার
                নাম আপনি Dashboard এ দেখবেন, Idle Timeout, প্রায়ই ৬০ সেকেন্ড।
                সারি মুছে গেলে Connection টা দুই প্রান্তের খাতায় খোলা, কিন্তু
                মাঝখানে পথ আর নেই। পরের Packet গিয়ে হারিয়ে যায় বা একটা RST ফেরত
                আসে।
              </ContentParagraph>
              <ContentParagraph>
                তাই বাস্তবে লম্বা সময় খোলা রাখা Connection এ, যেমন Database
                Connection বা WebSocket, Keepalive চালু করা হয় অনেক ছোট সময় দিয়ে,
                ৩০ বা ৬০ সেকেন্ড, যাতে মাঝের যন্ত্রগুলোর ধৈর্য ফুরানোর আগেই একটা
                Packet গিয়ে সারিটাকে তাজা রাখে। অনেক Protocol নিজের স্তরেও একই
                কাজ করে, WebSocket এর Ping আর Pong ঠিক এই জন্য। এই পুরো বিষয়টা,
                আর Load Balancer এর Idle Timeout আর App এর Timeout না মিললে কী
                বিপদ হয়, লেসন ০৮ এ বিস্তারিত আসবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "TCP Keepalive আর HTTP Keep-Alive দুইটা সম্পূর্ণ আলাদা জিনিস",
          content: (
            <p>
              নাম প্রায় এক, তাই প্রায় সবাই গুলিয়ে ফেলে। TCP Keepalive হলো Kernel
              এর পাঠানো একটা খালি খোঁজ নেওয়া Segment, যার কাজ মৃত Connection ধরা
              আর মাঝের যন্ত্রে সারিটা তাজা রাখা। HTTP Keep-Alive হলো একটা সিদ্ধান্ত,
              একটা Request এর উত্তর দেওয়ার পর Connection টা বন্ধ না করে খোলা রাখা,
              যাতে পরের Request ওটা দিয়েই যায় আর নতুন Handshake না লাগে। প্রথমটা
              একটা Connection কে পরীক্ষা করে। দ্বিতীয়টা একটা Connection কে বারবার
              ব্যবহার করে। একটা চালু করলে অন্যটা চালু হয় না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "hol",
      subHeader: { index: "012", title: "Head of Line Blocking" },
      title: <SectionTitle>ক্রম ঠিক রাখার দাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TCP এর প্রতিটা সুবিধার একটা দাম আছে, আর সবচেয়ে বড় দামটা আসে ক্রমের
                প্রতিশ্রুতি থেকে। Sequence এর Lab এ আপনি এটা ইতিমধ্যে দেখে ফেলেছেন,
                শুধু নাম জানতেন না। দ্বিতীয় Segment হারানোর পর তৃতীয়, চতুর্থ আর
                পঞ্চমটা ঠিকঠাক পৌঁছেছিল, কিন্তু Program সেগুলো পায়নি। পেয়েছে
                হারানোটা ফিরে আসার পরে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HeadOfLineDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ফাইল নামানোর সময় এতে কিছু আসে যায় না, মাঝের টুকরো ছাড়া পরের
                টুকরো দিয়ে আপনি কিছু করতেও পারতেন না। সমস্যা হয় দুই ক্ষেত্রে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা Connection এ অনেক আলাদা জিনিস:</strong> HTTP/2
                  একটাই TCP Connection দিয়ে একসাথে অনেক ফাইল আনে, ছবি, CSS,
                  JavaScript, সব মিশিয়ে। TCP জানে না এগুলো আলাদা জিনিস, তার কাছে
                  সবটাই একটা Byte এর স্রোত। তাই একটা ছবির একটা Segment হারালে
                  তার পেছনে থাকা CSS আর JavaScript এর Byte গুলোও আটকে যায়, যদিও
                  তাদের কোনো দোষ নেই। দুর্বল মোবাইল Network এ, যেখানে Packet
                  ঘন ঘন হারায়, এটা টের পাওয়া যায়।
                </ListItem>
                <ListItem>
                  <strong>যেখানে দেরিতে আসা তথ্য মূল্যহীন:</strong> একটা Video
                  Call এ আধা সেকেন্ড আগের শব্দের টুকরোটা এখন আর কারো দরকার নেই।
                  সেটার জন্য এখনকার শব্দ আটকে রাখা মানে পুরো কথাটাই পিছিয়ে যাওয়া।
                  এখানে হারানো টুকরো ফেলে দিয়ে এগিয়ে যাওয়াই ভালো, আর TCP সেটা
                  করতে দেয় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই দামটা এড়ানোর উপায় TCP এর ভেতরে নেই, কারণ ক্রমের প্রতিশ্রুতিটাই
                TCP। উপায় হলো অন্য একটা Transport Protocol, যা ক্রম বা Retransmission
                কিছুই করে না, আর যার উপরে আপনি নিজের দরকার মতো নিয়ম বানাতে পারেন।
                সেটা UDP, পরের লেসনের বিষয়। আর HTTP/3 ঠিক এই কারণেই TCP ছেড়ে UDP
                এর উপর QUIC নামে একটা নতুন Protocol ব্যবহার করে, যেখানে প্রতিটা
                ফাইলের ক্রম আলাদা, তাই একটার হারানো টুকরো অন্যটাকে আটকায় না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "developer",
      subHeader: { index: "013", title: "What You Feel" },
      title: <SectionTitle>Developer হিসেবে TCP আপনার সামনে যে চেহারায় আসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রোজকার কাজে আপনি Sequence Number দেখবেন না। TCP আপনার সামনে আসবে
                Error এর নাম হয়ে, Timeout এর সেটিং হয়ে, আর Pool এর মাপ হয়ে। এই
                Section এ সেই চেহারাগুলো একটা একটা করে চিনে নিন, আর প্রতিটার পেছনে
                এই লেসনের কোন ধারণা আছে তা মিলিয়ে দেখুন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>প্রথমে Error এর নামগুলো।</strong> এগুলো Operating System
                এর দেওয়া সংকেত, তাই Node.js, Python, Go, সব ভাষায় একই নামে আসে।
                E দিয়ে শুরু, কারণ Error।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ECONNREFUSED, সংযোগ প্রত্যাখ্যান:</strong> আপনার SYN
                  মেশিন পর্যন্ত পৌঁছেছে, কিন্তু ওই Port এ কোনো Program শুনছে না,
                  তাই Kernel একটা RST ফেরত দিয়েছে। উত্তরটা আসে সাথে সাথে। মানে
                  মেশিন বেঁচে আছে, আপনার Service টা চালু নেই বা ভুল Port এ চলছে।
                </ListItem>
                <ListItem>
                  <strong>ETIMEDOUT, সময় শেষ:</strong> পাঠানো হয়েছে, কিন্তু কোনো
                  উত্তরই আসেনি, আর Kernel এর ধৈর্য ফুরিয়েছে। Connection খোলার সময়
                  হলে সাধারণত একটা Firewall বা Security Group চুপচাপ Packet ফেলে
                  দিচ্ছে, বা IP টাই ভুল। Connection চলার মাঝে হলে পথ কেটে গেছে।
                </ListItem>
                <ListItem>
                  <strong>ECONNRESET, সংযোগ ছিঁড়ে গেছে:</strong> Connection চালু
                  ছিল, হঠাৎ ওপাশ থেকে একটা RST এসেছে। ওপাশের Program Crash করেছে,
                  বা সে Connection টা আগেই বন্ধ করে দিয়েছিল, বা মাঝের কোনো Load
                  Balancer Idle Timeout এ সারি মুছে ফেলেছে। পুরনো Keep-Alive
                  Connection এ নতুন Request পাঠাতে গেলে এটা খুব দেখা যায়।
                </ListItem>
                <ListItem>
                  <strong>EPIPE, ভাঙা পাইপ:</strong> আপনি এমন একটা Connection এ
                  লিখতে গেছেন যা ওপাশ আগেই বন্ধ করে দিয়েছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ECONNREFUSED আর ETIMEDOUT এর তফাতটা Debugging এর সবচেয়ে দামি
                সূত্রগুলোর একটা, আর লেসন ০৫ এ এটা ছবি সহ আসবে। আপাতত নিজের চোখে
                তিনটাই দেখে নিন। নিচের ছোট Program একটা Host আর Port এ সংযোগ
                করে, আর সাথে তিনটা TCP সেটিং দেখায় যা আপনি এই লেসনে শিখলেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "connect-probe.mjs",
          code: `import net from "node:net";

const host = process.env.DEMO_HOST;
const port = Number(process.env.DEMO_PORT);
const idleMs = Number(process.env.DEMO_IDLE_TIMEOUT_MS);
if (!host || !port || !idleMs) {
  throw new Error("DEMO_HOST, DEMO_PORT and DEMO_IDLE_TIMEOUT_MS must be set");
}

const started = Date.now();
const socket = net.connect(port, host);

socket.setNoDelay(true);          // Nagle বন্ধ, ছোট লেখা তখনই যাবে
socket.setKeepAlive(true, 30000); // ৩০ সেকেন্ড চুপ থাকলে Kernel খোঁজ নেবে
socket.setTimeout(idleMs);        // এতক্ষণ কিছু না ঘটলে timeout ঘটনা

socket.on("connect", () => {
  console.log("connected in ms", Date.now() - started);
  console.log("local", socket.localAddress, socket.localPort);
  console.log("remote", socket.remoteAddress, socket.remotePort);
});
socket.on("timeout", () => {
  // setTimeout নিজে Connection বন্ধ করে না, শুধু জানায়। বন্ধ করা আপনার কাজ।
  console.log("idle for ms", idleMs, "closing");
  socket.destroy();
});
socket.on("error", (err) => console.log("error", err.code));`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "run-connect-probe.sh",
          code: `export DEMO_IDLE_TIMEOUT_MS=1500

# ১. চালু একটা Service
DEMO_HOST=example.com DEMO_PORT=80 node connect-probe.mjs
#   connected in ms 12
#   local 192.168.0.103 57235
#   remote 172.66.147.243 80
#   idle for ms 1500 closing

# ২. মেশিন আছে, কিন্তু ওই Port এ কেউ শুনছে না
DEMO_HOST=127.0.0.1 DEMO_PORT=9 node connect-probe.mjs
#   error ECONNREFUSED          <- সাথে সাথে আসে

# ৩. এমন ঠিকানা যেখান থেকে কোনো উত্তরই আসে না
DEMO_HOST=10.255.255.1 DEMO_PORT=81 node connect-probe.mjs
#   idle for ms 1500 closing    <- দেড় সেকেন্ড নীরবতা, তারপর আমরা নিজে হাল ছাড়লাম`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তৃতীয় পরীক্ষাটা ভালো করে দেখুন। আমরা Timeout না বসালে কী হতো?
                Kernel SYN পাঠিয়ে অপেক্ষা করত, আবার পাঠাত, দ্বিগুণ অপেক্ষা করত,
                এভাবে চলত এক মিনিটেরও বেশি। Linux এ ডিফল্টে প্রায় দুই মিনিট।
                Exponential Backoff এখানেও কাজ করছে। এ থেকে আসে TCP নিয়ে কাজ করার
                সবচেয়ে গুরুত্বপূর্ণ অভ্যাস।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Timeout সবসময় নিজে বসান।</strong> TCP এর নিজের ধৈর্য
                মানুষের ধৈর্যের চেয়ে অনেক বেশি। একজন পর্যটক দুই মিনিট ধরে ঘুরতে
                থাকা চাকা দেখবেন না। আর Timeout আসলে দুই রকম, দুইটাই আলাদা করে
                ভাবতে হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Connect Timeout:</strong> Connection খুলতে সর্বোচ্চ
                  কতক্ষণ অপেক্ষা। কাছের Server এ এটা মিলিসেকেন্ডে শেষ হওয়ার কথা,
                  তাই ছোট রাখুন, কয়েক সেকেন্ড।
                </ListItem>
                <ListItem>
                  <strong>Read বা Idle Timeout:</strong> Connection খোলা আছে,
                  Request গেছে, কিন্তু উত্তর আসছে না, কতক্ষণ অপেক্ষা। এটা নির্ভর
                  করে কাজটা কত ভারী তার উপর।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                <strong>এবার Connection Pool।</strong> তিন নম্বর Section এ একটা
                কথা ধরে রাখতে বলেছিলাম, Connection খোলা সস্তা নয়। এখন আপনি জানেন
                কেন দুই দিক থেকে দামি। খুলতে Handshake এর এক Round Trip লাগে, তার
                উপর HTTPS বা Database এর নিজের পরিচয় পর্ব। আর নতুন Connection শুরু
                হয় ছোট cwnd নিয়ে, Slow Start থেকে। তাই বুদ্ধিমান Program গুলো
                Connection খুলে কাজ শেষে বন্ধ করে না, একটা ভাণ্ডারে রেখে দেয়, আর
                পরের কাজে ওখান থেকে একটা তুলে নেয়। এই ভাণ্ডারের নাম Connection
                Pool।
              </ContentParagraph>
              <ContentParagraph>
                আপনার Backend যখন PostgreSQL এর সাথে কথা বলে, সে প্রতিটা Query র
                জন্য নতুন Connection খোলে না। শুরুতে ধরুন ১০টা খুলে রাখে, আর সব
                Query ওই ১০টা দিয়ে ঘুরিয়ে ফিরিয়ে চালায়। Pool এর মাপ, যা আপনি
                Config এ দেখবেন, আসলে একসাথে কয়টা TCP Connection খোলা থাকবে তার
                সংখ্যা। Browser ও একই কাজ করে, একটা সাইটের সাথে খোলা Connection
                সে পরের Request গুলোর জন্য রেখে দেয়, যা HTTP Keep-Alive। curl
                দিয়ে তফাতটা মাপা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "reuse-connection.sh",
          code: `# একই curl কে দুইটা URL দিলে সে প্রথম Connection টা দ্বিতীয়টার জন্য রেখে দেয়
curl -s -o /dev/null -o /dev/null \\
     -w "connect=%{time_connect} total=%{time_total}\\n" \\
     http://example.com http://example.com

# যা দেখা গেল, প্রতিটা URL এর জন্য এক লাইন:
#   connect=0.005008 total=0.013818
#   connect=0.000000 total=0.009796
#
# দ্বিতীয় Request এ connect ঠিক শূন্য। কোনো Handshake হয়নি,
# আগের Connection টাই আবার ব্যবহার হয়েছে, তাই মোট সময়ও কম।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Pool এর Connection ও মরে, তাই ভালো Pool নিজে খোঁজ রাখে",
          content: (
            <p>
              আগের Section এর সাথে এটা জোড়া লাগান। Pool এ একটা Connection আধা
              ঘণ্টা অলস পড়ে থাকলে মাঝের কোনো Firewall বা Load Balancer তার সারি
              মুছে ফেলতে পারে। Pool এর খাতায় সেটা তখনো সুস্থ। পরের Query সেটা
              দিয়ে পাঠাতে গেলে আসে ECONNRESET, বা তার চেয়ে খারাপ, লম্বা নীরবতা।
              রাতে কম Traffic এর পর সকালের প্রথম Request টা ব্যর্থ হওয়া এই সমস্যার
              চেনা লক্ষণ। এই জন্যই Pool এর Config এ আপনি দেখবেন Idle Timeout, যা
              অলস Connection নিজে থেকে বন্ধ করে দেয়, Keepalive, আর Connection
              দেওয়ার আগে একটা ছোট পরীক্ষা চালানোর সেটিং। নিয়মটা হলো, আপনার Pool
              এর Idle Timeout মাঝের সব যন্ত্রের Idle Timeout এর চেয়ে ছোট রাখুন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "see-it",
      subHeader: { index: "014", title: "Seeing TCP" },
      title: <SectionTitle>নিজের মেশিনে TCP কে দেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ যা যা বললাম, তার প্রায় সবটাই আপনার মেশিনে এই মুহূর্তে চলছে,
                আর দেখার জন্য কয়েকটা কমান্ডই যথেষ্ট। তিনটা জানালা আছে, তিনটা
                আলাদা প্রশ্নের উত্তর দেয়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>প্রথম জানালা, এখন কোন কোন Connection খোলা।</strong> macOS
                এ netstat, Linux এ ss। প্রতিটা সারি একটা Connection, সাথে তার
                দুই প্রান্তের ঠিকানা, Buffer এ জমে থাকা Byte, আর সে জীবনের কোন
                পর্বে আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "open-connections.sh",
          code: `# macOS
netstat -an -p tcp | head -6
#   Proto Recv-Q Send-Q  Local Address        Foreign Address      (state)
#   tcp4       0      0  127.0.0.1.3000       *.*                  LISTEN
#   ...

# কোন অবস্থায় কয়টা Connection, এক নজরে
netstat -an -p tcp | awk '{print $6}' | sort | uniq -c | sort -rn | head -5
#     46 ESTABLISHED     <- কথা চলছে
#     22 LISTEN          <- কোনো Program নতুন Connection এর অপেক্ষায়
#      5 TIME_WAIT       <- বন্ধ হয়েছে, কিছুক্ষণ ঝুলে আছে (লেসন ০৮)
#      2 LAST_ACK

# Linux এ একই কাজ
ss -tan | head -6
ss -tan | awk 'NR>1 {print $1}' | sort | uniq -c | sort -rn`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Recv-Q আর Send-Q এর মানে আপনি Flow Control এর পরীক্ষায় শিখে গেছেন।
                সুস্থ মেশিনে দুইটাই প্রায় সবসময় শূন্য। কোনো Connection এ Recv-Q
                লম্বা সময় ধরে বড় থাকলে তার মানে এই মেশিনের Program পড়ছে না, সে
                আটকে আছে বা খুব ধীর। Send-Q বড় থাকলে সমস্যা ওপাশে বা পথে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দ্বিতীয় জানালা, একটা Connection এর ভেতরের হিসাব।</strong>{" "}
                Linux এ ss এর সাথে -i দিলে Kernel প্রতিটা Connection এর জন্য যা যা
                মনে রেখেছে তা দেখায়। এখানে এই লেসনের প্রায় প্রতিটা শব্দ এক লাইনে
                পাবেন। নিচের উত্তরটা একটা নমুনা, সংখ্যাগুলো প্রতিটা Connection এ
                আলাদা হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "inside-one-connection.sh",
          code: `# শুধু Linux। Port 443 এ যাওয়া Connection গুলোর ভেতরের হিসাব
ss -tin dst :443

# উত্তরের নমুনা (আপনার সংখ্যা আলাদা হবে):
#   ESTAB 0 0 192.168.1.20:51514 103.94.135.2:443
#     cubic wscale:7,7 rto:204 rtt:3.2/1.1 mss:1448 cwnd:10 ssthresh:20
#     bytes_sent:1820 bytes_acked:1821 bytes_received:5310 retrans:0/0
#
# শব্দ ধরে ধরে:
#   cubic        কোন Congestion Control Algorithm চলছে
#   wscale:7,7   Window Scale, দুই দিকের গুণক
#   rto:204      Retransmission Timeout, মিলিসেকেন্ডে
#   rtt:3.2/1.1  মাপা Round Trip Time আর তার ওঠানামা
#   mss:1448     একটা Segment এ সর্বোচ্চ Data
#   cwnd:10      Congestion Window, Segment এ
#   ssthresh:20  যার পরে সাবধানী বৃদ্ধি
#   retrans:0/0  এই মুহূর্তে আর মোট কয়টা Retransmission`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>তৃতীয় জানালা, তারের উপর দিয়ে আসলে কী যাচ্ছে।</strong>{" "}
                এর জন্য tcpdump, যা Network Card দিয়ে যাওয়া প্রতিটা Packet এর
                Header ছাপায়। এটা চালাতে Administrator এর অনুমতি লাগে, তাই sudo।
                প্রতিটা লাইন একটা Segment। লাইনটা পড়তে শিখে গেলে আপনি TCP কে
                সরাসরি চোখে দেখতে পাবেন। নিচের লাইনটা একটা নমুনা, ঘরগুলো চেনানোর
                জন্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "read-tcpdump.sh",
          code: `# এক Terminal এ, example.com এর সাথে Port 80 এর সব Segment দেখান
sudo tcpdump -n -i any host example.com and tcp port 80

# আরেক Terminal এ একটা Request পাঠান
curl -s -o /dev/null http://example.com

# একটা লাইনের নমুনা, আর তার ঘরগুলো:
#   IP 192.168.1.20.51514 > 103.94.135.2.80: Flags [P.], seq 1:75, ack 1, win 2058, length 74
#
#   192.168.1.20.51514   কে পাঠাল, শেষ সংখ্যাটা Port
#   103.94.135.2.80      কার কাছে
#   Flags [P.]           P মানে PSH, বিন্দু মানে ACK। [S] SYN, [S.] SYN-ACK, [F.] FIN, [R] RST
#   seq 1:75             এই Segment এ Byte 1 থেকে 74 (শেষ সংখ্যাটা পরের Byte এর নম্বর)
#   ack 1                ওপাশ থেকে এরপর Byte 1 চাই, মানে এখনো কিছু পাইনি
#   win 2058             আমার Window, Window Scale দিয়ে গুণ করার আগে
#   length 74            Data কত Byte। শুধু ACK বহন করা Segment এ এটা 0
#
# থামাতে Ctrl+C। এখানে seq আর ack ১ থেকে শুরু, কারণ tcpdump শুরুর এলোমেলো
# সংখ্যাটা বাদ দিয়ে দেখায়। আসল সংখ্যা দেখতে -S যোগ করুন।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "পুরো মেশিনের হিসাব: কত Segment আবার পাঠাতে হয়েছে",
          content: (
            <p>
              আরেকটা কাজের সংখ্যা আছে, মেশিন চালু হওয়ার পর থেকে মোট কত Segment
              গেছে আর তার কতগুলো Retransmission। Linux এ netstat -s এর উত্তরে
              segments retransmitted লেখা লাইনটা খুঁজুন, বা nstat -az TcpRetransSegs
              চালান। macOS এ netstat -s -p tcp, তবে নতুন সংস্করণে sudo ছাড়া সব
              সংখ্যা শূন্য দেখায়। মোট পাঠানোর তুলনায় Retransmission এক শতাংশের
              অনেক নিচে থাকাই স্বাভাবিক। কোনো Server এ এই হার হঠাৎ কয়েক শতাংশে
              উঠে গেলে সমস্যা আপনার কোডে নয়, Network এ, আর ব্যবহারকারীরা সেটা
              ধীরগতি হিসেবে টের পাচ্ছেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর একটা বুকিংয়ে TCP কোথায় কোথায়</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পর্যটক বুক করুন বোতাম চাপলে আমরা সাধারণত একটা Connection এর কথা
                ভাবি, ফোন থেকে Server। আসলে একটা বুকিং শেষ করতে পরপর কয়েকটা আলাদা
                TCP Connection কাজ করে, আর প্রতিটার আচরণ এই লেসনের নিয়মেই চলে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ফোন থেকে Server, Port 443:</strong> ফোন 192.168.1.20
                  এর Port 51514 থেকে 103.94.135.2 এর Port 443 এ। এই পথটা সবচেয়ে
                  লম্বা আর সবচেয়ে অনিশ্চিত, মোবাইল Network বা বাসার Wi-Fi পার
                  হয়ে। Packet হারানো, Retransmission আর Slow Start এর প্রভাব
                  পর্যটক এখানেই টের পান।
                </ListItem>
                <ListItem>
                  <strong>Reverse Proxy থেকে App, Port 3000:</strong> Server এ
                  Port 443 এ যে Program শুনছে সে আসল App নয়, একটা Reverse Proxy।
                  সে একই মেশিনের ভেতরে আরেকটা TCP Connection দিয়ে Port 3000 এ
                  চলা App কে Request টা দেয়। Module 02 তে দেখেছিলেন, localhost
                  এর Connection মেশিনের বাইরে যায় না, তাই এখানে Packet হারায় না,
                  কিন্তু Sequence, ACK, Window, সব একই নিয়মে চলে।
                </ListItem>
                <ListItem>
                  <strong>App থেকে Database:</strong> আসন খালি আছে কি না দেখতে
                  আর বুকিং লিখতে App কথা বলে PostgreSQL এর সাথে, একটা Connection
                  Pool থেকে তুলে নেওয়া পুরনো Connection দিয়ে। নতুন করে খুলতে হলে
                  প্রতিটা বুকিংয়ে কয়েক মিলিসেকেন্ড বাড়তি লাগত।
                </ListItem>
                <ListItem>
                  <strong>App থেকে Payment Gateway:</strong> টাকা কাটার জন্য App
                  আরেকটা কোম্পানির Server এ একটা HTTPS Request পাঠায়। এখানে App
                  নিজেই Client। এই পথে Timeout বসানো আর একই Request দুইবার গেলে
                  কী হবে তা ভাবা সবচেয়ে জরুরি, কারণ ভুল হলে পর্যটকের টাকা দুইবার
                  কাটবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার এই লেসনের ধারণাগুলো Island Tours এর চারটা বাস্তব সিদ্ধান্তে
                কীভাবে নামে দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রথম পাতা ছোট রাখা:</strong> দ্বীপে মোবাইল Network
                  দুর্বল, Round Trip লম্বা। নতুন Connection এর প্রথম Round Trip
                  এ যায় প্রায় ১৪ KB। তাই ট্যুরের তালিকার প্রথম অংশটা Compress
                  করে এর ভেতরে রাখার চেষ্টা করা হয়, যাতে প্রথম Round Trip এই
                  পর্দায় কিছু আসে।
                </ListItem>
                <ListItem>
                  <strong>Database Pool এর মাপ আর Idle Timeout:</strong> Pool এর
                  মাপ, Idle Timeout আর Keepalive, তিনটাই Environment Variable
                  থেকে আসে, কোডে লেখা থাকে না। Idle Timeout রাখা হয় মাঝের Firewall
                  এর চেয়ে ছোট, যাতে সকালের প্রথম বুকিং মৃত Connection এ গিয়ে না
                  পড়ে।
                </ListItem>
                <ListItem>
                  <strong>Payment এ Timeout আর একটা অনন্য চাবি:</strong> Payment
                  Gateway কে পাঠানো প্রতিটা Request এ একটা Connect Timeout আর
                  একটা Read Timeout থাকে। আর প্রতিটা বুকিংয়ের জন্য একটা অনন্য চাবি
                  পাঠানো হয়, যাতে Connection ছিঁড়ে গিয়ে আবার চেষ্টা করলেও টাকা
                  একবারই কাটে।
                </ListItem>
                <ListItem>
                  <strong>Retransmission এর হার নজরে রাখা:</strong> Server এর
                  Retransmission এর হার Monitoring এ রাখা হয়। পর্যটকরা সাইট ধীর
                  বললে এই একটা সংখ্যা দেখেই বোঝা যায় সমস্যা কোডে না Network এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা বুকিংয়ের Byte গুলো, ফোন থেকে Server পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার পুরো লেসনটা একটা গল্পে। পর্যটকের বুকিংয়ের Request টা ধরুন ৩০০০
              Byte, আর পথে একটা Segment হারাবে। ধাপগুলো পড়ার সময় প্রতিটায় নিজেকে
              জিজ্ঞেস করুন, Header এর কোন ঘরটা এখানে কাজ করছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Connection খোলা",
              description:
                "ফোনের Kernel একটা অস্থায়ী Port বেছে নেয়, 51514, আর 103.94.135.2 এর Port 443 এ SYN পাঠায়। SYN, SYN-ACK, ACK, তিন বার্তায় দুই পক্ষ শুরুর Sequence Number, MSS আর Window Scale ঠিক করে নেয়। এক Round Trip গেল, এখনো কোনো Data যায়নি।",
            },
            {
              title: "Program লেখে, Kernel কাটে",
              description:
                "Browser Socket এ ৩০০০ Byte write করে। তার কাজ এখানেই শেষ। Kernel এই Byte গুলো Send Buffer এ রাখে আর MSS মেপে তিনটা Segment এ কাটে, Seq 1, Seq 1449 আর Seq 2897। cwnd এখন ১০, তাই তিনটাই একসাথে ছাড়া যায়।",
            },
            {
              title: "প্রতিটা Segment এ Header বসে",
              description:
                "প্রতিটা টুকরোর সামনে Source Port 51514, Destination Port 443, Sequence Number, উল্টো দিকের ACK, নিজের Window আর Checksum বসে। তারপর Segment নিচের Layer এ গিয়ে IP Packet এর ভেতরে ঢোকে। প্রতিটার জন্য Kernel একটা Timer চালু করে।",
            },
            {
              title: "পথে দ্বিতীয়টা হারায়",
              description:
                "তিনটা Packet বাসার Router এর NAT পার হয়ে Internet এ যায়। পথের একটা ভিড়ে ঠাসা Router দ্বিতীয়টাকে ফেলে দেয়। কেউ কাউকে কিছু জানায় না।",
            },
            {
              title: "Server ফাঁকটা ধরে ফেলে",
              description:
                "Server এর Kernel প্রথম Segment পেয়ে Checksum মিলিয়ে ACK 1449 পাঠায়। তারপর আসে Seq 2897। মাঝে একটা ফাঁক। Kernel এটাকে Buffer এ ধরে রাখে, Program কে দেয় না, আর আবার বলে ACK 1449, সাথে SACK এ লিখে দেয় 2897 থেকে 3001 আমি পেয়েছি।",
            },
            {
              title: "ফোন আবার পাঠায়",
              description:
                "ফোনের Kernel SACK দেখে বোঝে ঠিক কোনটা হারিয়েছে আর শুধু Seq 1449 এর Segment টা আবার পাঠায়। ধরে নেয় পথে ভিড় আছে, তাই cwnd কমিয়ে দেয়। Browser এর কিছুই জানা নেই।",
            },
            {
              title: "ফাঁক ভরে, সব একসাথে Program এ যায়",
              description:
                "হারানো Segment পৌঁছালে Server এর Kernel ফাঁকটা ভরে, ACK 3001 পাঠায়, আর পুরো ৩০০০ Byte ঠিক ক্রমে Receive Buffer থেকে Reverse Proxy র হাতে তুলে দেয়। Proxy র কাছে এটা একটা নিখুঁত Byte এর স্রোত।",
            },
            {
              title: "Byte থেকে আবার বার্তা",
              description:
                "Proxy র হাতে Byte এসেছে হয়তো দুই টুকরোয়। সে HTTP এর নিয়মে Content-Length দেখে বোঝে Request কোথায় শেষ, আর পুরোটা জমা হলে তবেই App কে দেয়। Framing এর কাজটা এখানে HTTP করল।",
            },
            {
              title: "উত্তর ফেরে উল্টো পথে",
              description:
                "App বুকিং লিখে উত্তর দেয়। এবার Server হলো Sender, তার নিজের Sequence Number, নিজের cwnd, আর ফোনের Window মেনে চলা। ফোন প্রতিটা Segment এর রসিদ দেয়। পর্যটক দেখেন বুকিং নিশ্চিত।",
            },
            {
              title: "Connection খোলাই থাকে",
              description:
                "কেউ FIN পাঠায় না। Connection টা খোলা থাকে, যাতে পর্যটকের পরের ট্যাপে আর Handshake না লাগে আর বড় হয়ে ওঠা cwnd টাও কাজে লাগে। অনেকক্ষণ চুপ থাকলে তবে কোনো এক পক্ষ বন্ধ করবে।",
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
                <strong>নিজে চালান</strong>, নিচের Lab এর পরীক্ষাগুলো এই লেসনের
                সবচেয়ে ভালো Resource। একটা write তিনটা data হয়ে আসা আর থেমে থাকা
                Writer নিজের চোখে একবার দেখলে আর ভোলা যায় না।
              </ListItem>
              <ListItem>
                <strong>High Performance Browser Networking, Building Blocks of
                TCP</strong>, Ilya Grigorik এর বইয়ের এই অধ্যায়টা বিনামূল্যে পড়া
                যায়। Slow Start আর Head of Line Blocking এর সবচেয়ে পরিষ্কার
                ব্যাখ্যা, ছবি সহ।{" "}
                <a
                  href="https://hpbn.co/building-blocks-of-tcp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  hpbn.co/building-blocks-of-tcp
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 9293</strong>, TCP এর বর্তমান সরকারি দলিল। পুরোটা
                পড়ার দরকার নেই, কিন্তু Header এর ছবিটা আর তার নিচের ঘরগুলোর বর্ণনা
                একবার দেখে নিন, আজ যা শিখলেন তা মূল উৎসে মিলে যাবে।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc9293"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc9293
                </a>
              </ListItem>
              <ListItem>
                <strong>Node.js net Module</strong>, এই লেসনের সব কোড এই Module
                দিয়ে লেখা। setNoDelay, setKeepAlive, setTimeout আর write এর ফেরত
                মান সবকিছুর বর্ণনা এখানে।{" "}
                <a
                  href="https://nodejs.org/api/net.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  nodejs.org/api/net.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Wireshark</strong>, tcpdump এর ছবিওয়ালা রূপ। একটা
                Connection ধরে তার Segment গুলো রং দিয়ে আলাদা করে দেখায়, আর
                Retransmission আর Duplicate ACK নিজে থেকে চিহ্নিত করে দেয়।{" "}
                <a
                  href="https://www.wireshark.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  wireshark.org
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
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  IP শুধু চেষ্টা করে, কথা দেয় না। পথে Packet হারায়, আগে পরে হয়,
                  দুইবার আসে, নষ্ট হয়। এই চারটা সামলানোই TCP এর কাজ।
                </ListItem>
                <ListItem>
                  TCP থাকে দুই প্রান্তের Kernel এ। মাঝের Router রা তাকে খোলেও
                  না।
                </ListItem>
                <ListItem>
                  TCP কথা দেয় নির্ভরযোগ্য, ক্রম ঠিক রাখা একটা Byte এর স্রোতের।
                  গতি, গোপনীয়তা আর বার্তার সীমানার কথা সে দেয় না।
                </ListItem>
                <ListItem>
                  বার্তার সীমানা আপনাকে বা আপনার উপরের Protocol কে বানাতে হয়।
                  এর নাম Framing।
                </ListItem>
                <ListItem>
                  Sequence Number প্রতিটা Byte কে একটা নম্বর দেয়। ACK বলে পরের
                  কোন Byte টা চাই। এই দুই ঘর দিয়েই ক্রম, হারানো আর নকল, তিনটাই
                  সামলানো হয়।
                </ListItem>
                <ListItem>
                  হারানো ধরা পড়ে দুইভাবে। Timer শেষ হলে (RTO), অথবা একই ACK
                  তিনবার বাড়তি এলে (Fast Retransmit)।
                </ListItem>
                <ListItem>
                  Flow Control ওপাশের Program কে বাঁচায়, Window ঘর দিয়ে।
                  Congestion Control মাঝের রাস্তাকে বাঁচায়, Sender এর নিজের cwnd
                  দিয়ে। পাঠানো যায় দুইটার মধ্যে ছোটটার সমান।
                </ListItem>
                <ListItem>
                  নতুন Connection শুরু হয় ছোট cwnd নিয়ে, Slow Start থেকে। তাই
                  নতুন Connection ধীর, আর পুরনো Connection বারবার ব্যবহার করা
                  লাভজনক।
                </ListItem>
                <ListItem>
                  চুপচাপ Connection এ তারে কিছুই যায় না, তাই মৃত Connection টের
                  পাওয়া যায় না। সমাধান Keepalive আর নিজের বসানো Timeout।
                </ListItem>
                <ListItem>
                  ক্রমের দাম Head of Line Blocking। একটা হারানো Segment পেছনের
                  সবাইকে আটকে রাখে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                TCP অনেক কিছু দেয়, আর তার জন্য দামও নেয়। Handshake এর সময়, Header
                এর ওজন, হারানো টুকরোর জন্য অপেক্ষা। সব কাজে এত কিছু দরকার হয় না।
                একটা DNS প্রশ্নের জন্য, যা আপনি Module 04 এ বারবার dig দিয়ে
                পাঠিয়েছেন, বা একটা Video Call এর জন্য, এই দামটা অনেক বেশি। পরের
                লেসনে দেখবেন Transport Layer এর দ্বিতীয় সদস্যকে, UDP, যে TCP এর
                প্রায় সবকিছু বাদ দিয়ে শুধু Port টুকু রেখেছে, আর দেখবেন কেন সেই
                বাদ দেওয়াটাই তার শক্তি।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "কোথায় দেখবেন"],
    rows: [
      [
        "Best Effort",
        "IP চেষ্টা করে, কথা দেয় না। Packet হারায়, আগে পরে হয়, নকল হয়, নষ্ট হয়",
        "ping এ packet loss, traceroute এ তারকা চিহ্ন",
      ],
      [
        "Segment আর Header",
        "TCP র কাটা টুকরো, সামনে অন্তত ২০ Byte তথ্য সহ",
        "tcpdump এর প্রতিটা লাইন",
      ],
      [
        "Byte Stream",
        "TCP বার্তা নয়, Byte এর স্রোত বয়ে নেয়। সীমানা বানানো আপনার কাজ, Framing",
        "একটা write এর বদলে অনেক বা কম data ঘটনা",
      ],
      [
        "Sequence Number",
        "Segment এর প্রথম Byte এর নম্বর",
        "tcpdump এ seq 1:75",
      ],
      [
        "ACK",
        "পরের যে Byte টা চাই তার নম্বর, আগের সব পেয়েছি",
        "tcpdump এ ack 1449",
      ],
      [
        "Retransmission",
        "রসিদ না পেলে আবার পাঠানো। Timer শেষ হলে, বা ৩টা Duplicate ACK এ",
        "ss -ti তে retrans, netstat -s",
      ],
      [
        "Flow Control",
        "Receiver Window ঘরে বলে দেয় তার Buffer এ কত জায়গা বাকি",
        "netstat এ Recv-Q আর Send-Q, tcpdump এ win",
      ],
      [
        "Congestion Control",
        "Sender নিজের cwnd দিয়ে রাস্তার ধারণক্ষমতা আন্দাজ করে",
        "ss -ti তে cwnd, ssthresh, cubic",
      ],
      [
        "Slow Start",
        "নতুন Connection প্রায় ১৪ KB দিয়ে শুরু করে, প্রতি Round Trip এ দ্বিগুণ",
        "প্রথম Request ধীর, পরেরগুলো দ্রুত",
      ],
      [
        "MSS",
        "একটা Segment এ সর্বোচ্চ Data, সাধারণত ১৪৬০ Byte",
        "ss -ti তে mss, Handshake এর Options",
      ],
      [
        "Nagle আর TCP_NODELAY",
        "ছোট লেখা জমিয়ে পাঠানো, আর সেটা বন্ধ করার সুইচ",
        "socket.setNoDelay(true)",
      ],
      [
        "TCP Keepalive",
        "চুপচাপ Connection এ Kernel এর খোঁজ নেওয়া Segment, ডিফল্ট ২ ঘণ্টা",
        "socket.setKeepAlive, sysctl",
      ],
      [
        "Head of Line Blocking",
        "একটা হারানো Segment পেছনের সব Data আটকে রাখে",
        "দুর্বল Network এ HTTP/2 হঠাৎ থমকে যাওয়া",
      ],
      [
        "Connection Pool",
        "খোলা Connection জমিয়ে রেখে বারবার ব্যবহার",
        "Database Config এর pool size, curl এ connect=0",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "IP কে Best Effort বলা হয়। এর মানে কোনটা?",
        options: [
          {
            key: "A",
            text: "IP সবচেয়ে দ্রুত পথ দিয়ে Packet পাঠানোর নিশ্চয়তা দেয়",
            isCorrect: false,
            explanation: "IP কোনো কিছুরই নিশ্চয়তা দেয় না, গতিরও নয়।",
          },
          {
            key: "B",
            text: "IP Packet পৌঁছানোর চেষ্টা করে, কিন্তু পৌঁছাবে, ক্রমে পৌঁছাবে বা একবারই পৌঁছাবে, এমন কোনো কথা দেয় না",
            isCorrect: true,
            explanation:
              "ঠিক। হারানো, ক্রম ভাঙা, নকল আর নষ্ট হওয়া, চারটাই সম্ভব। এগুলো সামলানো দুই প্রান্তের TCP এর কাজ।",
          },
          {
            key: "C",
            text: "IP হারানো Packet নিজে আবার পাঠায়",
            isCorrect: false,
            explanation: "আবার পাঠানো TCP এর কাজ। Router রা কোনো হিসাবই রাখে না।",
          },
        ],
      },
      {
        id: 2,
        text: "আপনার Client তিনবার socket.write() ডেকে তিনটা JSON বার্তা পাঠাল। Server এর data ঘটনা কয়বার আসবে?",
        options: [
          {
            key: "A",
            text: "ঠিক তিনবার, প্রতিটা write এর জন্য একবার",
            isCorrect: false,
            explanation:
              "নিজের মেশিনে প্রায়ই এমন দেখায়, তাই ভুলটা ধরা পড়ে না। কিন্তু TCP এমন কোনো কথা দেয় না।",
          },
          {
            key: "B",
            text: "বলা যায় না। একবার, তিনবার বা অন্য যেকোনো সংখ্যা হতে পারে, কারণ TCP বার্তার সীমানা রাখে না",
            isCorrect: true,
            explanation:
              "ঠিক। TCP একটা Byte Stream। সীমানা ফিরে পেতে Delimiter বা Length Prefix দিয়ে নিজে Framing করতে হয়।",
          },
          {
            key: "C",
            text: "সবসময় একবার",
            isCorrect: false,
            explanation: "লেখার মাঝে একটু সময় থাকলে আলাদা আলাদা টুকরোয় আসে, Lab এ এটা দেখবেন।",
          },
        ],
      },
      {
        id: 3,
        text: "একটা Segment এর Seq 2001 আর তাতে 1000 Byte Data আছে। Receiver সব ঠিকঠাক পেলে কোন ACK পাঠাবে?",
        options: [
          {
            key: "A",
            text: "ACK 3000",
            isCorrect: false,
            explanation: "3000 হলো শেষ পাওয়া Byte। ACK বলে পরের কোনটা চাই।",
          },
          {
            key: "B",
            text: "ACK 3001",
            isCorrect: true,
            explanation:
              "ঠিক। Byte 2001 থেকে 3000 পাওয়া গেছে, তাই পরের প্রত্যাশিত Byte 3001। ACK সবসময় পরের প্রত্যাশিত Byte এর নম্বর।",
          },
          {
            key: "C",
            text: "ACK 2001",
            isCorrect: false,
            explanation: "ACK 2001 মানে হতো এই Segment টা এখনো পাইনি।",
          },
        ],
      },
      {
        id: 4,
        text: "Sender একই ACK পরপর তিনবার বাড়তি পেল। সে কী করবে, আর কেন?",
        options: [
          {
            key: "A",
            text: "Timer শেষ হওয়া পর্যন্ত অপেক্ষা করবে",
            isCorrect: false,
            explanation: "সেটা ধীর পথ। তিনটা Duplicate ACK এর চেয়ে দ্রুত একটা সংকেত।",
          },
          {
            key: "B",
            text: "Connection বন্ধ করে দেবে",
            isCorrect: false,
            explanation: "একটা Packet হারানো খুবই সাধারণ ঘটনা, এতে Connection ভাঙে না।",
          },
          {
            key: "C",
            text: "Timer এর অপেক্ষা না করে ওই ACK এ চাওয়া Segment টা তখনই আবার পাঠাবে, আর cwnd কমাবে",
            isCorrect: true,
            explanation:
              "ঠিক। এর নাম Fast Retransmit। পরের Segment গুলো পৌঁছাচ্ছে বলেই Duplicate ACK আসছে, তাই পথ চালু আছে, শুধু একটা হারিয়েছে।",
          },
        ],
      },
      {
        id: 5,
        text: "Flow Control আর Congestion Control এর মূল তফাত কোনটা?",
        options: [
          {
            key: "A",
            text: "Flow Control ওপাশের Program কে বাঁচায় আর সংখ্যাটা Receiver জানায়। Congestion Control মাঝের Network কে বাঁচায় আর সংখ্যাটা Sender নিজে আন্দাজ করে",
            isCorrect: true,
            explanation:
              "ঠিক। প্রথমটা Header এর Window ঘর, rwnd। দ্বিতীয়টা Sender এর মাথার ভেতরের cwnd। পাঠানো যায় দুইটার ছোটটার সমান।",
          },
          {
            key: "B",
            text: "দুইটা একই জিনিসের দুই নাম",
            isCorrect: false,
            explanation: "দুইটা আলাদা সমস্যা, আলাদা সমাধান।",
          },
          {
            key: "C",
            text: "Flow Control Router করে, Congestion Control Server করে",
            isCorrect: false,
            explanation: "দুইটাই দুই প্রান্তের Kernel এর কাজ। Router রা TCP Header খোলেই না।",
          },
        ],
      },
      {
        id: 6,
        text: "একটা নতুন TCP Connection এ প্রথম Request ধীর, কিন্তু একই Connection এ পরেরগুলো দ্রুত। কোন দুই কারণে?",
        options: [
          {
            key: "A",
            text: "প্রথমবার DNS লাগে, আর কিছু না",
            isCorrect: false,
            explanation: "DNS একটা কারণ হতে পারে, কিন্তু সেটা TCP এর বাইরে। TCP এর ভেতরেই দুইটা কারণ আছে।",
          },
          {
            key: "B",
            text: "প্রথমবার Handshake এর Round Trip লাগে, আর cwnd ছোট থাকে বলে Slow Start থেকে শুরু হয়",
            isCorrect: true,
            explanation:
              "ঠিক। পুরনো Connection এ Handshake লাগে না আর cwnd আগে থেকেই বড়। এই কারণেই Keep-Alive আর Connection Pool।",
          },
          {
            key: "C",
            text: "Server প্রথম Request ইচ্ছা করে ধীরে দেয়",
            isCorrect: false,
            explanation: "এমন কিছু নেই। ধীরগতিটা TCP এর সাবধানী শুরুর ফল।",
          },
        ],
      },
      {
        id: 7,
        text: "আপনার App এ দেখা যাচ্ছে ECONNREFUSED। সবচেয়ে সম্ভাব্য কারণ কোনটা?",
        options: [
          {
            key: "A",
            text: "একটা Firewall চুপচাপ Packet ফেলে দিচ্ছে",
            isCorrect: false,
            explanation: "চুপচাপ ফেললে কোনো উত্তরই আসত না, আর আপনি লম্বা অপেক্ষার পর ETIMEDOUT পেতেন।",
          },
          {
            key: "B",
            text: "মেশিনটা আছে, কিন্তু ওই Port এ কোনো Program শুনছে না",
            isCorrect: true,
            explanation:
              "ঠিক। Kernel সাথে সাথে একটা RST ফেরত দিয়েছে। Service টা চালু আছে কি না আর সঠিক Port এ চলছে কি না দেখুন।",
          },
          {
            key: "C",
            text: "Packet পথে হারিয়ে যাচ্ছে",
            isCorrect: false,
            explanation: "হারালে TCP আবার পাঠাত। Refused মানে একটা স্পষ্ট না উত্তর এসেছে।",
          },
        ],
      },
      {
        id: 8,
        text: "রাতে Traffic কম থাকার পর সকালের প্রথম Database Query প্রায়ই ECONNRESET দিয়ে ব্যর্থ হয়, পরেরগুলো ঠিক চলে। কী ঘটছে?",
        options: [
          {
            key: "A",
            text: "Database রাতে বন্ধ হয়ে যায়",
            isCorrect: false,
            explanation: "তাহলে পরের Query গুলোও ব্যর্থ হতো।",
          },
          {
            key: "B",
            text: "TCP রাতে ধীর হয়ে যায়",
            isCorrect: false,
            explanation: "TCP এর আচরণ দিনের সময়ের উপর নির্ভর করে না।",
          },
          {
            key: "C",
            text: "Pool এর Connection অনেকক্ষণ চুপ ছিল, মাঝের কোনো Firewall বা Load Balancer তার সারি মুছে ফেলেছে, কিন্তু Pool জানে না",
            isCorrect: true,
            explanation:
              "ঠিক। চুপচাপ Connection এ তারে কিছু যায় না, তাই কেউ টের পায় না। সমাধান Keepalive, আর Pool এর Idle Timeout মাঝের যন্ত্রের চেয়ে ছোট রাখা।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "TCP কে নিজের মেশিনে ধরুন",
    subtitle: "Terminal আর Node.js এ ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "দুই Terminal এ একটা TCP Connection",
        description:
          "nc দিয়ে এক Terminal এ শুনুন, আরেকটা থেকে সংযোগ করে কথা বলুন। তারপর সংযোগের তিন রকম ফল দেখুন।",
      },
      {
        title: "স্রোত, বার্তা নয়",
        description:
          "লেসনের stream-server আর stream-client চালান, তারপর লেখার মাঝে সময় দিয়ে দেখুন টুকরোর সংখ্যা বদলে যায়।",
      },
      {
        title: "Flow Control কে থামতে দেখা",
        description:
          "slow-reader আর fast-writer চালিয়ে netstat এ Recv-Q আর Send-Q ভরে থাকতে দেখুন।",
      },
      {
        title: "Connection খোলার দাম",
        description:
          "curl দিয়ে মাপুন DNS, TCP আর TLS এ কত সময় যায়, আর পুরনো Connection আবার ব্যবহার করলে কত বাঁচে।",
      },
      {
        title: "Kernel এর সেটিং পড়া",
        description:
          "নিজের মেশিনের Buffer এর মাপ, Keepalive এর সময় আর Congestion Control Algorithm বের করুন।",
      },
      {
        title: "তারের উপর Segment দেখা",
        description:
          "tcpdump দিয়ে একটা ছোট Request এর প্রতিটা Segment ধরুন আর Flags, seq, ack, win পড়ুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-talk-over-tcp.sh",
        language: "bash",
        code: `# Terminal ১: Port 9402 এ শুনুন
nc -l 9402

# Terminal ২: সংযোগ করুন, তারপর কিছু লিখে Enter দিন
nc 127.0.0.1 9402
# যা লিখবেন তা Terminal ১ এ দেখা যাবে, আর উল্টোটাও।
# এটা একটা খাঁটি TCP Connection, উপরে কোনো Protocol নেই। Ctrl+C দিয়ে বন্ধ করুন।

# এবার সংযোগের তিন রকম ফল (-z মানে শুধু সংযোগ হয় কি না দেখা, কিছু পাঠানো নয়)
nc -vz example.com 443
#   Connection to example.com port 443 [tcp/https] succeeded!

nc -vz -w 2 127.0.0.1 9
#   nc: connectx to 127.0.0.1 port 9 (tcp) failed: Connection refused

nc -vz -G 3 10.255.255.1 81          # macOS। Linux এ -G এর বদলে -w 3
#   nc: connectx to 10.255.255.1 port 81 (tcp) failed: Operation timed out

# প্রথমটা সফল। দ্বিতীয়টা সাথে সাথে না বলে দিল (ECONNREFUSED)।
# তৃতীয়টা তিন সেকেন্ড চুপ থেকে হাল ছাড়ল (ETIMEDOUT)।`,
      },
      {
        filename: "2-stream-not-messages.sh",
        language: "bash",
        code: `export DEMO_PORT=9404

# লেসনের stream-client এর একটা ধীর সংস্করণ বানান
cat > stream-client-slow.mjs <<'EOF'
import net from "node:net";

const port = Number(process.env.DEMO_PORT);
if (!port) throw new Error("DEMO_PORT is not set");

const socket = net.connect(port, "127.0.0.1", () => {
  socket.write("BOOK seat=12;");
  setTimeout(() => socket.write("BOOK seat=13;"), 100);
  setTimeout(() => {
    socket.write("BOOK seat=14;");
    socket.end();
  }, 200);
});
EOF

node stream-server.mjs &
sleep 0.4
node stream-client-slow.mjs
wait
#   listening on 9404
#   chunk 1 bytes 13 "BOOK seat=12;"
#   chunk 2 bytes 13 "BOOK seat=13;"
#   chunk 3 bytes 13 "BOOK seat=14;"
#   client finished, total chunks: 3

# একই তিনটা বার্তা। লেসনে একসাথে লিখে এসেছিল ১ টুকরোয়, এখানে একটু সময়
# দিয়ে লিখে এলো ৩ টুকরোয়। টুকরোর সংখ্যা সময়ের উপর নির্ভর করে, আপনার
# write এর সংখ্যার উপর নয়। তাই data ঘটনা গুনে বার্তা গোনা যায় না।`,
      },
      {
        filename: "3-flow-control.sh",
        language: "bash",
        code: `export DEMO_PORT=9403
node slow-reader.mjs &
sleep 0.4
node fast-writer.mjs &
sleep 1.6

# Reader এখনো পড়ছে না। এই মুহূর্তে দুই Buffer এর অবস্থা:
netstat -an -p tcp | grep -E "Proto|9403"                  # macOS
# ss -tn "( sport = :9403 or dport = :9403 )"              # Linux
wait

# Recv-Q বড় যে সারিতে, সেটা Reader এর দিক (না পড়া Data)।
# Send-Q বড় যে সারিতে, সেটা Writer এর দিক (পাঠাতে না পারা Data)।
# এবার slow-reader.mjs এ 3000 কে 6000 করে আবার চালান।
# Writer এর আটকে থাকা সংখ্যাটা একই থাকবে, শুধু বেশিক্ষণ।`,
      },
      {
        filename: "4-connection-cost.sh",
        language: "bash",
        code: `# একটা HTTPS Request এ কোন পর্বে কত সময় (সেকেন্ডে, শুরু থেকে গোনা)
curl -s -o /dev/null \\
     -w "dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} total=%{time_total}\\n" \\
     https://example.com
#   dns=0.001454 connect=0.004525 tls=0.017235 total=0.024397
#
# connect থেকে dns বাদ দিলে পাবেন TCP Handshake এর সময়, মানে এক Round Trip।
# tls থেকে connect বাদ দিলে TLS এর পরিচয় পর্ব।
# দূরের একটা সাইট দিয়ে চালিয়ে দেখুন, connect এর সংখ্যাটা কত বড় হয়।

# এবার পুরনো Connection আবার ব্যবহার
curl -s -o /dev/null -o /dev/null \\
     -w "connect=%{time_connect} total=%{time_total}\\n" \\
     http://example.com http://example.com
#   connect=0.005008 total=0.013818
#   connect=0.000000 total=0.009796`,
      },
      {
        filename: "5-kernel-settings.sh",
        language: "bash",
        code: `# macOS
sysctl net.inet.tcp.sendspace net.inet.tcp.recvspace
#   net.inet.tcp.sendspace: 131072     <- Send Buffer এর শুরুর মাপ, Byte এ
#   net.inet.tcp.recvspace: 131072     <- Receive Buffer এর শুরুর মাপ
sysctl net.inet.tcp.keepidle net.inet.tcp.keepintvl net.inet.tcp.keepcnt
#   net.inet.tcp.keepidle: 7200000     <- মিলিসেকেন্ডে, মানে ২ ঘণ্টা
#   net.inet.tcp.keepintvl: 75000
#   net.inet.tcp.keepcnt: 8
ifconfig en0 | grep mtu
#   en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
#   1500 থেকে 20 আর 20 বাদ দিলে MSS 1460

# Linux
sysctl net.ipv4.tcp_congestion_control      # সাধারণত cubic
sysctl net.ipv4.tcp_rmem net.ipv4.tcp_wmem  # Buffer এর সর্বনিম্ন, শুরুর আর সর্বোচ্চ মাপ
sysctl net.ipv4.tcp_keepalive_time net.ipv4.tcp_keepalive_intvl net.ipv4.tcp_keepalive_probes
ip link show | grep mtu`,
      },
      {
        filename: "6-watch-segments.sh",
        language: "bash",
        code: `# Terminal ১ (sudo লাগবে, Password চাইবে)
sudo tcpdump -n -i any host example.com and tcp port 80

# Terminal ২
curl -s -o /dev/null http://example.com

# Terminal ১ এ এবার কয়েকটা লাইন আসবে। ক্রম ধরে খুঁজুন:
#   Flags [S]      ফোন থেকে SYN
#   Flags [S.]     Server থেকে SYN-ACK, এখানে options এ mss আর wscale দেখুন
#   Flags [.]      ACK, Handshake শেষ
#   Flags [P.]     আপনার HTTP Request, length কত লিখে রাখুন
#   Flags [.]      Server এর রসিদ, ack এর সংখ্যাটা আপনার length এর চেয়ে ১ বেশি
#   Flags [P.]     Server এর উত্তর
#   Flags [F.]     বিদায়
#
# প্রতিটা লাইনের seq, ack আর win মিলিয়ে দেখুন লেসনের নিয়মগুলো খাটছে কি না।
# Ctrl+C দিয়ে থামান।`,
      },
    ],
    tip: "তিন নম্বর পরীক্ষাটা সময় নিয়ে করুন। netstat এর ওই দুইটা সারি এই লেসনের সবচেয়ে দামি ছবি। একটা সারিতে Recv-Q ভরা, কারণ একটা Program পড়ছে না। অন্য সারিতে Send-Q ভরা, কারণ ওপাশ বলেছে আর জায়গা নেই। মাঝখানে কোনো Error নেই, কোনো Packet হারায়নি, Connection সুস্থ, শুধু দাঁড়িয়ে আছে। Production এ কোনো Service হঠাৎ ঝুলে গেলে এই দুইটা সংখ্যা দেখেই আপনি বলতে পারবেন কে কার অপেক্ষায় আছে। আর ছয় নম্বরের tcpdump এ প্রথম তিনটা লাইন ভালো করে দেখে রাখুন, লেসন ০৫ এর পুরোটা ওই তিন লাইন নিয়ে।",
  },
  assignment: {
    title: "Mini Project: my-tours এর জন্য একটা ছোট TCP Protocol",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>Framing নিজে লিখুন:</strong> লেসনের framed-server কে বদলে Length
        Prefix পদ্ধতিতে আনুন। প্রতিটা বার্তার আগে ৪ Byte এ তার দৈর্ঘ্য থাকবে,
        তারপর একটা JSON। Client একটা বার্তা ইচ্ছা করে তিন ভাগে ভেঙে পাঠাবে, আর
        দুইটা বার্তা এক write এ জুড়ে পাঠাবে। Server দুই ক্ষেত্রেই ঠিক বার্তা বের
        করতে পারছে তা দেখান। Port আসবে Environment Variable থেকে।
      </span>,
      <span key="2">
        <strong>Backpressure মানুন:</strong> একটা Server লিখুন যা প্রতিটা Client
        কে ৫০ MB Data পাঠায়, আর write() false দিলে drain এর অপেক্ষা করে। তারপর
        একই Server এর একটা ভুল সংস্করণ লিখুন যা false উপেক্ষা করে। দুই ক্ষেত্রে
        একটা ধীর Client এর বিরুদ্ধে process.memoryUsage().rss মেপে পাশাপাশি
        লিখুন।
      </span>,
      <span key="3">
        <strong>তিনটা Error নিজে ঘটান:</strong> ECONNREFUSED, ECONNRESET আর
        Timeout, প্রতিটা নিজের মেশিনে ইচ্ছা করে তৈরি করুন আর লিখুন কীভাবে করলেন।
        ECONNRESET এর জন্য ইঙ্গিত, Server এ socket.destroy() ডেকে দেখুন Client
        কী পায়।
      </span>,
      <span key="4">
        <strong>হিসাব করুন:</strong> একটা নতুন Connection, শুরুর cwnd ১০ Segment,
        MSS ১৪৬০, কোনো Packet হারায় না, Round Trip ২০০ মিলিসেকেন্ড। ৫০০ KB এর
        একটা ছবি পুরো পৌঁছাতে Handshake সহ মোটামুটি কয়টা Round Trip আর কত সময়
        লাগবে? একই ছবি আগে থেকে গরম হয়ে থাকা একটা Connection এ, যার cwnd ৩২০,
        কত লাগবে?
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় লিখুন (৮ লাইন):</strong> একজন সহকর্মী বললেন, TCP তো
        Reliable, তাহলে আমার Payment Request এ আবার Timeout আর Retry নিয়ে ভাবতে
        হবে কেন? তাঁকে বোঝান TCP ঠিক কীসের নিশ্চয়তা দেয় আর কীসের দেয় না, আর
        একই Request দুইবার চলে যাওয়ার ঘটনাটা কীভাবে ঘটে।
      </span>,
    ],
    deliverables: [
      <span key="1">Length Prefix দিয়ে চলা Server আর Client, দুই পরীক্ষার Output সহ</span>,
      <span key="2">ঠিক আর ভুল দুই Server এর Memory র তুলনা, সংখ্যা সহ</span>,
      <span key="3">তিনটা Error ঘটানোর ধাপ আর প্রতিটার Output</span>,
      <span key="4">দুই ক্ষেত্রের Round Trip আর সময়ের হিসাব, ধাপ দেখিয়ে</span>,
      <span key="5">সহকর্মীর জন্য ব্যাখ্যা, ৮ লাইনে</span>,
    ],
  },
};
