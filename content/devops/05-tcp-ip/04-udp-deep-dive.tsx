 
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  DatagramSizeLab,
  LostPieceLab,
  TransportPickerLab,
} from "../../../components/course/topics/tcp/udp-animations";
import {
  AmplificationDiagram,
  DnsFallbackDiagram,
  TalkVsPostcardSplit,
  UdpHeaderDiagram,
  UdpUsersDiagram,
  WhoDoesTheJobDiagram,
} from "../../../components/course/topics/tcp/udp-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const udpDeepDiveContent: TopicData = {
  id: "udp-deep-dive",
  introduction: {
    badge: "MODULE 05 · LESSON 04",
    title: <SectionTitle>যে Protocol কোনো কথাই দেয় না, তবু সবাই তাকে চায়</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে TCP কে দেখেছেন একজন অতি যত্নশীল কুরিয়ারের মতো। প্রতিটা
          টুকরোয় নম্বর বসায়, পৌঁছালে প্রাপ্তি স্বীকার নেয়, হারালে আবার পাঠায়,
          গ্রহীতা হাঁপিয়ে গেলে থামে, রাস্তায় জ্যাম দেখলে ধীরে চলে। এত গুণ থাকার
          পরেও Transport Layer এ আরেকটা Protocol আছে, যে এর একটাও করে না। তার নাম
          UDP।
        </ContentParagraph>
        <ContentParagraph>
          স্বাভাবিক প্রশ্ন হলো, এমন একটা Protocol কেউ কেন ব্যবহার করবে? অথচ আপনি
          আজ সকাল থেকে যতবার একটা সাইটের নাম লিখেছেন, প্রতিবার প্রথম কাজটা হয়েছে
          UDP দিয়ে। আপনার ফোন Wi-Fi তে জোড়া লেগে IP পেয়েছে UDP দিয়ে। আপনার
          Video Call চলে UDP তে। আর Chrome এই মুহূর্তে Google এর সাথে যে কথা বলছে,
          সেটাও খুব সম্ভব UDP র উপরেই।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন UDP র আট Byte এর Header এ কী থাকে, TCP র কোন
          কোন কাজ এখানে নেই আর সেই না থাকাটাই কেন কখনো কখনো আসল সুবিধা, DNS, DHCP,
          Video Call, QUIC আর VPN কেন UDP বেছেছে, UDP ব্যবহার করলে আপনার
          Application কে নিজে কী কী করতে হয়, NAT আর Firewall UDP কে কীভাবে দেখে,
          UDP দিয়ে কোন ধরনের আক্রমণ হয়, একটা Datagram কত বড় রাখা নিরাপদ, আর কোন
          কাজে কোনটা নেবেন সেই সিদ্ধান্ত কীভাবে নিতে হয়। সবটা নিজের Terminal এ
          চালিয়ে দেখবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "TCP হলো রেজিস্ট্রি করা চিঠি, প্রাপক সই না করা পর্যন্ত ডাকপিয়ন দরজায় দাঁড়িয়ে থাকে। আমি পোস্টকার্ড। ডাকবাক্সে ফেলে দিলেন, আপনার কাজ শেষ। পৌঁছাল কি না, সেটা জানার দরকার হলে প্রাপককে বলুন উত্তর লিখতে।",
      author: "UDP",
      role: "Lesson 04",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>ফোনে আলাপ আর ডাকবাক্সে পোস্টকার্ড</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরুন আপনি বন্ধুকে একটা খবর দেবেন। দুইভাবে দেওয়া যায়। প্রথম উপায়,
                ফোন করা। আগে রিং হবে, বন্ধু ধরে হ্যালো বলবেন, আপনিও হ্যালো বলবেন,
                তারপর আসল কথা। মাঝে কিছু শুনতে না পেলে বন্ধু বলবেন, আবার বলুন।
                শেষে দুইজনই রাখি বলে ফোন রাখবেন। এটা TCP।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় উপায়, একটা পোস্টকার্ডে খবরটা লিখে ডাকবাক্সে ফেলে দেওয়া।
                বন্ধু বাড়িতে আছেন কি না আপনি জানেন না। কার্ডটা পৌঁছাল কি না, তাও
                জানবেন না। তিনটা কার্ড পরপর ফেললে কোনটা আগে পৌঁছাবে তার ঠিক নেই।
                কিন্তু কাজটা হয়ে গেল এক ধাপে, কারো জন্য অপেক্ষা না করে। এটা UDP।
              </ContentParagraph>
              <ContentParagraph>
                UDP র পুরো নাম User Datagram Protocol। Datagram শব্দটা এসেছে Data
                আর Telegram মিলিয়ে, মানে নিজের ঠিকানা সাথে নিয়ে একা একা চলা একটা
                ছোট বার্তা, যার আগের বা পরের বার্তার সাথে কোনো সম্পর্ক নেই। এই
                মডিউলের ভাষায়, Transport Layer এ TCP র একক হলো Segment, আর UDP র
                একক হলো Datagram।
              </ContentParagraph>
              <ContentParagraph>
                Module 02 এর Packet লেসনে আপনি শিখেছিলেন, Internet এ Data যায়
                একগাদা পোস্টকার্ডের মতো, ক্রম ভাঙতে পারে, একটা হারাতেও পারে। সেটা
                ছিল IP র স্বভাব। TCP সেই এলোমেলো পোস্টকার্ডের উপর একটা গোছানো
                ব্যবস্থা বসিয়েছে। UDP কিছুই বসায়নি। UDP হলো IP র সেই কাঁচা
                স্বভাবটাই, শুধু সাথে একটা Port নম্বর আর একটা ভুল ধরার হিসাব জুড়ে
                দেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "UDP = IP + Port + Checksum, এর বেশি এক ফোঁটাও নয়",
          content: (
            <p>
              পুরো লেসনের ভিত এই এক লাইন। IP একটা Packet কে সঠিক যন্ত্র পর্যন্ত
              পৌঁছে দেয়, কিন্তু যন্ত্রের ভেতরে কোন Program এর কাছে যাবে তা জানে
              না। UDP শুধু সেই ফাঁকটুকু ভরে: Port নম্বর দিয়ে বলে কোন Program, আর
              Checksum দিয়ে বলে Data পথে নষ্ট হয়েছে কি না। ক্রম, প্রাপ্তি স্বীকার,
              আবার পাঠানো, গতি নিয়ন্ত্রণ, এসবের কিছুই সে ধরে না। তাই UDP কে
              বুঝতে হলে নতুন কিছু শিখতে হয় না, শুধু TCP থেকে কী কী বাদ গেল আর
              তার ফল কী, সেটা দেখতে হয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "header",
      subHeader: { index: "002", title: "The Header" },
      title: <SectionTitle>আট Byte এর Header, চারটা ঘর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                OS Networking এর লেসনে দেখেছিলেন, Kernel আপনার Data র গায়ে একটা
                খাম পরায়, আর খামের উপর ঠিকানা লেখে। খামের সেই লেখা অংশটার নাম
                Header। আগের লেসনে TCP র Header ছিল কমপক্ষে ২০ Byte, দশটার মতো
                ঘর। UDP র Header মাত্র ৮ Byte, ঘর চারটা। এত ছোট যে পুরোটা একবারে
                মনে রাখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <UdpHeaderDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Source Port (২ Byte):</strong> যে Program পাঠাচ্ছে তার
                  ফ্ল্যাটের নম্বর। উত্তর দিতে হলে গ্রহীতা এই নম্বরেই ফেরত পাঠাবে।
                  আমাদের গল্পের পর্যটকের ফোনে এটা 51514। মজার ব্যাপার, UDP তে এই
                  ঘরটা ঐচ্ছিক। উত্তরের দরকার না থাকলে এখানে শূন্য বসানো যায়।
                </ListItem>
                <ListItem>
                  <strong>Destination Port (২ Byte):</strong> গন্তব্য যন্ত্রের কোন
                  ফ্ল্যাটে যাবে। DNS এর জন্য 53। ২ Byte মানে ১৬ Bit, তাই Port
                  নম্বর 0 থেকে 65535 পর্যন্ত, ঠিক TCP র মতোই।
                </ListItem>
                <ListItem>
                  <strong>Length (২ Byte):</strong> Header আর Data মিলিয়ে পুরো
                  Datagram কত Byte। সবচেয়ে ছোট মান 8, মানে শুধু Header, কোনো Data
                  নেই। এই ঘরটাই UDP কে বার্তার সীমানা মনে রাখতে দেয়, যা নিয়ে একটু
                  পরে আলাদা করে কথা হবে।
                </ListItem>
                <ListItem>
                  <strong>Checksum (২ Byte):</strong> পাঠানোর সময় Kernel পুরো
                  Datagram এর উপর একটা যোগফলের হিসাব করে এখানে লিখে দেয়। গ্রহীতার
                  Kernel একই হিসাব আবার করে। না মিললে বোঝা যায় পথে কোনো Bit উল্টে
                  গেছে, আর Datagram টা নীরবে ফেলে দেওয়া হয়। খেয়াল করুন, ফেলে দেওয়া
                  হয়, সারানো হয় না, আর কাউকে জানানোও হয় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার দেখুন কী কী নেই। Sequence Number নেই, তাই কোন Datagram আগে
                আর কোনটা পরে, তা লেখার জায়গাই নেই। Acknowledgment Number নেই, তাই
                পেয়েছি বলার জায়গা নেই। SYN, FIN এর মতো Flag নেই, তাই Connection
                খোলা বা বন্ধ করার ভাষাই নেই। Window নেই, তাই ধীরে পাঠান বলার উপায়
                নেই। UDP র প্রতিটা আচরণ এই না থাকা ঘরগুলোর সরাসরি ফল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ছোট Header এর দাম কোথায় টের পাওয়া যায়",
          content: (
            <p>
              একটা DNS প্রশ্ন মোটামুটি ৪০ Byte। TCP তে পাঠালে শুধু Header ই ২০
              Byte, তার উপর Connection খুলতে তিনটা আর বন্ধ করতে চারটা বাড়তি
              Packet, যাদের প্রত্যেকের নিজের Header আছে। মোট খরচ আসল প্রশ্নের
              কয়েক গুণ। UDP তে একই প্রশ্নে বাড়তি মাত্র ৮ Byte, আর Packet একটাই।
              একটা Resolver যখন সেকেন্ডে লাখো প্রশ্ন সামলায়, এই তফাতটা আর ছোট
              থাকে না। UDP র মূল দলিল RFC 768 লেখা হয়েছিল ১৯৮০ সালে, আর সেটা
              মাত্র তিন পৃষ্ঠার। এত ছোট বলেই চল্লিশ বছরে একবারও বদলাতে হয়নি।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "missing",
      subHeader: { index: "003", title: "What Is Missing" },
      title: <SectionTitle>TCP র কোন কোন কাজ এখানে নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনে TCP র যা যা শিখেছেন, এবার সেগুলো একটা একটা করে মুছে
                ফেলুন। যা বাকি থাকবে সেটাই UDP। আগে পুরো ছবিটা দেখুন, একই বার্তা
                দুই Protocol এ পাঠাতে কয়টা যাওয়া আসা লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TalkVsPostcardSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Connection নেই (Connectionless):</strong> TCP তে কথা
                  বলার আগে দুই পক্ষ Handshake করে একটা Connection বানায়, আর দুই
                  পক্ষের Kernel সেই Connection এর অবস্থা মনে রাখে। UDP তে এমন কোনো
                  ধাপ নেই। প্রথম Packet টাই আসল বার্তা। গ্রহীতা প্রস্তুত কি না,
                  আদৌ আছে কি না, পাঠানোর আগে জানার কোনো উপায় নেই।
                </ListItem>
                <ListItem>
                  <strong>প্রাপ্তি স্বীকার নেই:</strong> TCP তে প্রতিটা Data র
                  জবাবে ACK আসে। UDP তে কিছুই ফেরে না। Kernel এর কাছে পাঠিয়ে
                  দিয়েছি আর পৌঁছে গেছে, এই দুইয়ের মধ্যে কোনো তফাত নেই, কারণ সে
                  দ্বিতীয়টা কখনো জানতেই পারে না।
                </ListItem>
                <ListItem>
                  <strong>Retransmission নেই:</strong> ACK ই যখন নেই, তখন হারাল
                  কি না বোঝার উপায়ও নেই, তাই আবার পাঠানোর প্রশ্নও ওঠে না। হারানো
                  Datagram চিরতরে হারানো।
                </ListItem>
                <ListItem>
                  <strong>ক্রম নেই:</strong> Sequence Number নেই বলে গ্রহীতার
                  Kernel জানে না কোনটা আগে পাঠানো হয়েছিল। যেটা আগে পৌঁছায়, সেটাই
                  আগে Application এর হাতে যায়। একই Datagram পথে নকল হয়ে দুইবার
                  পৌঁছালে দুইবারই দেওয়া হয়।
                </ListItem>
                <ListItem>
                  <strong>Flow Control নেই:</strong> TCP তে গ্রহীতা Window দিয়ে
                  বলে তার Buffer এ আর কতটুকু জায়গা আছে। UDP তে এমন কিছু নেই।
                  গ্রহীতার Buffer ভরে গেলে পরের Datagram গুলো Kernel নীরবে ফেলে
                  দেয়, আর প্রেরক কিছুই টের পায় না।
                </ListItem>
                <ListItem>
                  <strong>Congestion Control নেই:</strong> TCP রাস্তায় জ্যাম টের
                  পেলে নিজে থেকে গতি কমায়। UDP যত দ্রুত বলা হয় তত দ্রুতই পাঠাতে
                  থাকে, রাস্তা ডুবে গেলেও। তাই একটা বেপরোয়া UDP Program পুরো
                  Network এর বাকি সবার ক্ষতি করতে পারে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শুনে মনে হতে পারে UDP একটা অসম্পূর্ণ, ভাঙা Protocol। আসলে এটা একটা
                ইচ্ছাকৃত সিদ্ধান্ত। UDP বলে, এই কাজগুলো সবার দরকার হয় না, আর যাদের
                দরকার তারা নিজের মতো করে বানিয়ে নিক। নিচের ছকটা সেই ভাগাভাগির
                পুরো হিসাব।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhoDoesTheJobDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Unreliable মানে খারাপ নয়, মানে কথা দেয়নি",
          content: (
            <p>
              বইয়ে UDP কে বলা হয় Unreliable Protocol। শব্দটা শুনে অনেকে ভাবেন UDP
              তে Data প্রায়ই হারায়। তা নয়। ভালো Network এ শতকরা নিরানব্বই ভাগের
              বেশি UDP Datagram ঠিকঠাক পৌঁছায়, ঠিক TCP র Segment এর মতোই, কারণ
              দুইটাই একই IP র রাস্তা দিয়ে যায়। তফাত শুধু এটুকু যে হারালে UDP
              কিছু করে না, আর আপনাকে জানায়ও না। Unreliable এর সঠিক বাংলা তাই
              অবিশ্বস্ত নয়, বরং দায় নেয় না। আরেকটা প্রচলিত নাম Best Effort,
              মানে চেষ্টা করব, কথা দিচ্ছি না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "feature",
      subHeader: { index: "004", title: "Why Less Is More" },
      title: <SectionTitle>না থাকাটাই কখন সুবিধা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Video Call এর কথা ভাবুন। আপনার বন্ধু একটা বাক্য বলছেন। মাঝের
                একটা ছোট্ট টুকরো পথে হারিয়ে গেল। এখন দুইটা রাস্তা। এক, থেমে যাওয়া,
                হারানো টুকরোটা আবার চেয়ে আনা, তারপর সেখান থেকে আবার শোনানো। দুই,
                টুকরোটা ভুলে গিয়ে পরেরটা থেকে চালিয়ে যাওয়া। আপনি কোনটা চাইবেন?
              </ContentParagraph>
              <ContentParagraph>
                প্রথমটা নিলে কল থমকে যাবে, আর যখন আবার চালু হবে তখন আপনি শুনবেন
                আধা সেকেন্ড আগের কথা। বন্ধু ততক্ষণে পরের বাক্যে চলে গেছেন, আপনি
                পিছিয়ে পড়লেন। প্রতিবার একটা টুকরো হারালে আপনি আরও একটু পিছাবেন।
                দ্বিতীয়টা নিলে শুধু এক পলকের একটা খটকা, যা মানুষের কান প্রায় ধরতেই
                পারে না। কলের বেলায় দেরিতে আসা Data আর না আসা Data একই, দুইটাই
                কাজে লাগে না। বরং দেরিতে আসাটা বেশি খারাপ, কারণ সে পেছনের সবাইকে
                আটকে রাখে।
              </ContentParagraph>
              <ContentParagraph>
                আগের লেসনের শেষ দিকে এই আটকে রাখার একটা নাম শিখেছিলেন, Head of
                Line Blocking। TCP ক্রম ভেঙে কিছু দেয় না, তাই সামনের একটা টুকরো
                হারালে পেছনের সবাই পৌঁছে গিয়েও Kernel এ বসে থাকে। নিচে নিজে চালিয়ে
                দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LostPieceLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab এ চারটা জোড়া চালিয়ে যা দেখলেন তার সারকথা: একই আচরণ একটা কাজে
                দোষ, আরেকটা কাজে গুণ। তাই TCP ভালো নাকি UDP ভালো, এই প্রশ্নটাই
                ভুল। সঠিক প্রশ্ন হলো, আমার কাজে কোনটা বেশি ক্ষতির, একটা টুকরো
                হারানো, নাকি একটা টুকরোর জন্য সবাই দাঁড়িয়ে থাকা। UDP বেছে নেওয়ার
                মোট চারটা আলাদা কারণ আছে, আর বাস্তবের প্রতিটা ব্যবহার এর কোনো
                একটাতে পড়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>দেরিতে আসা Data মূল্যহীন:</strong> Voice, Video, Game,
                  ঘড়ির সময়। এখানে তাজা Data পুরনো নিখুঁত Data র চেয়ে দামি।
                </ListItem>
                <ListItem>
                  <strong>আয়োজনটা কাজের চেয়ে বড়:</strong> একটা ছোট প্রশ্ন আর একটা
                  ছোট উত্তর। Handshake করতে গেলে আসল কাজের চেয়ে বেশি Packet আর
                  বেশি সময় লাগে। DNS এর ঘটনা এটাই।
                </ListItem>
                <ListItem>
                  <strong>Connection খোলাই সম্ভব নয়:</strong> যে যন্ত্রের এখনো IP
                  নেই, বা যে বার্তা একসাথে অনেকের কাছে যাবে। TCP সবসময় ঠিক দুই
                  পক্ষের মধ্যে, তাই এখানে চলেই না। DHCP র ঘটনা এটাই।
                </ListItem>
                <ListItem>
                  <strong>নির্ভরযোগ্যতা চাই, কিন্তু নিজের শর্তে:</strong> TCP র
                  নিয়মগুলো Kernel এর ভেতরে গাঁথা, বদলানো যায় না। কেউ যদি আরও ভালো
                  নিয়ম বানাতে চায়, তার একটা খালি মাঠ দরকার। UDP সেই খালি মাঠ। QUIC
                  এর ঘটনা এটাই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "connectionless",
      subHeader: { index: "005", title: "Connectionless" },
      title: <SectionTitle>কেউ না থাকলেও পাঠানো সফল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Connectionless কথাটা পড়ে বোঝার চেয়ে একবার চোখে দেখা ভালো। নিচে
                দুইটা ছোট Node.js ফাইল। প্রথমটা একটা UDP সার্ভার, যা পাওয়া বার্তা
                ছাপায় আর সামনে echo লিখে ফেরত পাঠায়। দ্বিতীয়টা একটা Client, যা
                পরপর তিনটা বার্তা পাঠায়। Node এ UDP র কাজ করে{" "}
                <code>node:dgram</code> নামের Module, নামটা এসেছে Datagram থেকে।
                Host আর Port দুইটাই পড়া হচ্ছে Environment Variable থেকে, না থাকলে
                Program শুরুতেই থেমে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "udp-server.mjs",
          code: `import dgram from "node:dgram";

const host = process.env.UDP_HOST;
const port = Number(process.env.UDP_PORT);
if (!host || !Number.isInteger(port)) {
  throw new Error("UDP_HOST and UDP_PORT must be set");
}

// "udp4" মানে IPv4 এর উপর UDP। খেয়াল করুন, listen() বা accept() নেই।
const server = dgram.createSocket("udp4");
let count = 0;

// প্রতিটা Datagram এর জন্য এই Event একবার। rinfo তে প্রেরকের IP আর Port।
server.on("message", (msg, rinfo) => {
  count += 1;
  console.log("#" + count, "from", rinfo.address + ":" + rinfo.port,
    "bytes", msg.length, "text", JSON.stringify(msg.toString()));
  // উত্তর দিতে হলে প্রতিবার ঠিকানা বলে দিতে হয়, কারণ কোনো Connection নেই।
  server.send("echo: " + msg, rinfo.port, rinfo.address);
});

server.on("listening", () => {
  const a = server.address();
  console.log("listening on", a.address + ":" + a.port);
});

server.bind(port, host);`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "udp-client.mjs",
          code: `import dgram from "node:dgram";

const host = process.env.UDP_HOST;
const port = Number(process.env.UDP_PORT);
if (!host || !Number.isInteger(port)) {
  throw new Error("UDP_HOST and UDP_PORT must be set");
}

const client = dgram.createSocket("udp4");

client.on("message", (msg) => {
  console.log("reply:", msg.toString());
});

client.on("error", (err) => {
  console.log("error:", err.code);
});

// connect() নেই। প্রতিটা send এ গন্তব্য আলাদা করে বলা হচ্ছে।
for (const text of ["one", "two", "three"]) {
  client.send(text, port, host, (err) => {
    console.log("sent", JSON.stringify(text), err ? "error " + err.code : "ok");
  });
}

// এক সেকেন্ড উত্তরের অপেক্ষা, তারপর বন্ধ।
setTimeout(() => client.close(), 1000);`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আসল পরীক্ষা। সার্ভার চালু না করেই শুধু Client টা চালান।
                ওপাশে কেউ শুনছে না, Port টা সম্পূর্ণ ফাঁকা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "nobody-home.sh",
          code: `export UDP_HOST=127.0.0.1
export UDP_PORT=41234

# সার্ভার চালু নেই, তবু
node udp-client.mjs
# sent "one" ok
# sent "two" ok
# sent "three" ok

# এবার আরেকটা Terminal এ সার্ভার চালু করুন (সেখানেও একই দুই export লাগবে)
node udp-server.mjs
# listening on 127.0.0.1:41234

# আবার Client
node udp-client.mjs
# sent "one" ok
# sent "two" ok
# sent "three" ok
# reply: echo: one
# reply: echo: two
# reply: echo: three`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমবারের ফলটা আবার পড়ুন। কেউ শুনছে না, তবু তিনবারই ok। কোনো
                Error নেই। এটাই Connectionless এর আসল চেহারা। এখানে ok মানে শুধু
                এটুকু যে Kernel Datagram টা হাতে নিয়েছে আর Network এর দিকে ছেড়ে
                দিয়েছে। এরপর কী হলো, কেউ জানে না। একই কাজ TCP তে করলে প্রথম ধাপেই
                Connection Refused পেতেন, কারণ Handshake ই হতো না। এই তফাতটা মনে
                গেঁথে নিন, কারণ এর থেকেই UDP র সবচেয়ে বড় ফাঁদটা আসে: আপনার Log এ
                পাঠানো হয়েছে লেখা থাকবে, অথচ কিছুই পৌঁছায়নি।
              </ContentParagraph>
              <ContentParagraph>
                Connection না থাকার আরও তিনটা ফল আছে, যা সার্ভারের দিক থেকে জরুরি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা Socket দিয়েই সবার সাথে কথা:</strong> TCP সার্ভারে
                  প্রতিটা Client এর জন্য আলাদা একটা Connected Socket তৈরি হয়। UDP
                  সার্ভারে Socket একটাই, আর হাজারটা Client এর Datagram সেই একই
                  Socket এ এসে পড়ে। কে পাঠিয়েছে তা আলাদা করার একমাত্র উপায় প্রতিটা
                  Datagram এর সাথে আসা প্রেরকের IP আর Port, কোডে যেটা{" "}
                  <code>rinfo</code>।
                </ListItem>
                <ListItem>
                  <strong>Kernel কাউকে মনে রাখে না:</strong> কোনো Client এর জন্য
                  Kernel এ কোনো অবস্থা জমা থাকে না। তাই একটা UDP সার্ভার খুব কম
                  Memory তে বিপুল সংখ্যক Client সামলাতে পারে। আবার এই কারণেই কে
                  এখনো আছে আর কে চলে গেছে, তা জানার দরকার হলে Application কে নিজে
                  হিসাব রাখতে হয়।
                </ListItem>
                <ListItem>
                  <strong>সার্ভার Restart হলে Client টেরই পায় না:</strong> TCP তে
                  সার্ভার বন্ধ হলে সব Connection ছিঁড়ে যায়, Client কে আবার জুড়তে
                  হয়। UDP তে ছেঁড়ার মতো কিছুই নেই। সার্ভার ফিরে এলে পরের Datagram
                  এমনিই পৌঁছে যায়। মাঝের কয়েকটা শুধু হারিয়ে যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "UDP তে connect() আছে, কিন্তু তাতে কোনো Packet যায় না",
          content: (
            <p>
              একটা বিভ্রান্তির জায়গা। UDP Socket এও <code>connect()</code> ডাকা
              যায়, Node এ <code>client.connect(port, host)</code>। নাম এক হলেও
              এটা TCP র connect এর মতো কিছু নয়। কোনো Handshake হয় না, একটা Packet
              ও বের হয় না। Kernel শুধু মনে রাখে, এই Socket এখন থেকে শুধু এই এক
              ঠিকানায় পাঠাবে আর শুধু সেখান থেকে আসা Datagram নেবে। এর একটা বাড়তি
              লাভ আছে। ফাঁকা Port এ Datagram পৌঁছালে ওপাশের Kernel অনেক সময় ICMP
              দিয়ে একটা ছোট খবর ফেরত পাঠায়, Port Unreachable। Connected UDP
              Socket সেই খবরটা ধরতে পারে, আর তখন আপনি পান{" "}
              <code>ECONNREFUSED</code>। নিজের যন্ত্রে (127.0.0.1) এটা নির্ভরযোগ্যভাবে
              দেখা যায়। Internet এর ওপারে প্রায়ই দেখা যায় না, কারণ মাঝের Firewall
              ICMP ফেলে দেয়। তাই UDP তে Error না পাওয়া মানে কখনোই সফল হওয়া নয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "boundaries",
      subHeader: { index: "006", title: "Message Boundaries" },
      title: <SectionTitle>যে একটা জিনিস UDP তে আছে, TCP তে নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনে একটা অবাক করা জিনিস দেখেছিলেন। TCP তে আপনি তিনবার আলাদা
                করে তিনটা বার্তা লিখলেন, অথচ ওপাশে সেগুলো এলো এক দলা হয়ে, বা
                মাঝখান থেকে ভাগ হয়ে। কারণ TCP একটা Byte Stream, মানে Byte এর একটানা
                স্রোত। সে শুধু Byte গুলো ঠিক ক্রমে পৌঁছে দেয়, আপনি কোথায় থেমে নতুন
                বার্তা শুরু করেছিলেন তা মনে রাখে না। তাই TCP র উপর Protocol বানালে
                বার্তার শেষ কোথায় তা নিজে চিহ্ন দিয়ে বোঝাতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                UDP এখানে ঠিক উল্টো, আর এটাই ছকের সেই একমাত্র সারি যেখানে UDP
                এগিয়ে। আপনি একবার send ডাকলে একটা Datagram তৈরি হয়। ওপাশে সেটা
                পৌঁছালে পুরোটাই পৌঁছায়, একবারে, ঠিক যে আকারে পাঠিয়েছিলেন। কখনো
                দুইটা জুড়ে যায় না, কখনো একটা ভেঙে আধখানা আসে না। হয় পুরোটা, নয়
                কিছুই না। এর নাম Message Boundary রক্ষা করা। Header এর Length
                ঘরটার কাজ এটাই।
              </ContentParagraph>
              <ContentParagraph>
                একটু আগে চালানো সার্ভারের Terminal টা দেখুন। সেখানে প্রমাণ লেখা
                আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server-output.txt",
          code: `listening on 127.0.0.1:41234
#1 from 127.0.0.1:59151 bytes 3 text "one"
#2 from 127.0.0.1:59151 bytes 3 text "two"
#3 from 127.0.0.1:59151 bytes 5 text "three"

# তিনটা send, তিনটা আলাদা message Event। 3, 3 আর 5 Byte, ঠিক যেমন পাঠানো।
# "onetwothree" হয়ে একসাথে আসেনি, যা TCP তে প্রায়ই ঘটে।
# তিনটারই প্রেরকের Port এক (59151), কারণ একই Socket থেকে পাঠানো।
# এই Port টা Kernel নিজে বেছে দিয়েছে, যাকে বলে Ephemeral Port।
# আপনার যন্ত্রে সংখ্যাটা আলাদা হবে।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই গুণটার জন্যই ছোট প্রশ্ন উত্তরের Protocol গুলো UDP তে এত সহজে
                বসে যায়। একটা DNS প্রশ্ন মানে একটা Datagram, একটা উত্তর মানে একটা
                Datagram। কোথায় শুরু কোথায় শেষ, তা নিয়ে ভাবতেই হয় না। একই DNS
                যখন TCP তে চলে, তখন প্রতিটা বার্তার আগে ২ Byte এ তার দৈর্ঘ্য লিখে
                দিতে হয়, ঠিক এই সীমানার অভাব পূরণ করতে।
              </ContentParagraph>
              <ContentParagraph>
                তবে এর একটা শর্ত আছে, যা ভুললে Data নীরবে হারায়। গ্রহীতা যে Buffer
                এ Datagram পড়ছে সেটা Datagram এর চেয়ে ছোট হলে বাড়তি অংশটুকু কেটে
                ফেলে দেওয়া হয়, পরেরবার পড়লে সেটা আর পাওয়া যায় না। TCP তে ছোট
                Buffer এ পড়লে বাকিটা পরের বার পাওয়া যায়, UDP তে যায় না। Node এই
                ঝামেলা আপনার হয়ে সামলায়, কিন্তু C, Go বা Python এ নিচু স্তরে কাজ
                করলে Buffer সবসময় সম্ভাব্য সবচেয়ে বড় Datagram এর সমান রাখতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Stream আর Datagram, এক লাইনে তফাত",
          content: (
            <p>
              TCP হলো পানির পাইপ। এক বালতি, দুই বালতি করে ঢাললেও ওপাশে বের হয়
              একটানা ধারা, কোন পানি কোন বালতির তা আর বোঝা যায় না, কিন্তু এক
              ফোঁটাও হারায় না। UDP হলো আলাদা আলাদা বোতল ছুড়ে দেওয়া। প্রতিটা বোতল
              আস্ত পৌঁছায় বা একদমই পৌঁছায় না, কোন বোতল আগে আসবে তার ঠিক নেই,
              কিন্তু বোতলের ভেতরের পানি কখনো পাশের বোতলের সাথে মেশে না। Socket
              বানানোর সময় এই দুই ধরনের নাম দেখবেন SOCK_STREAM আর SOCK_DGRAM।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "dns",
      subHeader: { index: "007", title: "UDP and DNS" },
      title: <SectionTitle>DNS কেন UDP তে, আর কখন TCP তে পালায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পুরো Module 04 জুড়ে আপনি শত শত <code>dig</code> চালিয়েছেন। প্রতিটা
                উত্তরের নিচে একটা লাইন ছিল, <code>SERVER: 1.1.1.1#53</code>। এখন
                আপনি পুরোটা পড়তে পারেন: 53 হলো Port, আর Protocol টা ছিল UDP। dig
                কিছু না বললে UDP ই ব্যবহার করে।
              </ContentParagraph>
              <ContentParagraph>
                DNS কেন UDP বেছেছে, তা এখন হিসাব করে বলা যায়। একটা নাম খোঁজা মানে
                একটা ছোট প্রশ্ন আর একটা ছোট উত্তর। UDP তে মোট দুইটা Packet, সময়
                লাগে একবার যাওয়া আর একবার আসা, যাকে বলে এক Round Trip। TCP তে আগে
                Handshake এর তিনটা Packet, তারপর প্রশ্ন, উত্তর, তাদের ACK, তারপর
                বন্ধ করার চারটা, সব মিলিয়ে নয় দশটা Packet আর কমপক্ষে দুই Round
                Trip। একটা Web Page খুলতে ব্রাউজারকে অনেকগুলো নাম খুঁজতে হয়, আর
                Resolver এর লেসনে দেখেছেন একটা নামের পেছনে Resolver নিজে আরও
                তিন চারটা প্রশ্ন করে। প্রতিটায় দ্বিগুণ সময় লাগলে পুরো Internet
                চোখে পড়ার মতো ধীর হয়ে যেত।
              </ContentParagraph>
              <ContentParagraph>
                আর উত্তর না এলে? DNS এর Client নিজেই সেটা সামলায়, খুব সরল উপায়ে।
                সে কয়েক সেকেন্ড অপেক্ষা করে, উত্তর না পেলে একই প্রশ্ন আবার পাঠায়,
                বা তালিকার পরের Resolver কে জিজ্ঞেস করে। মানে নির্ভরযোগ্যতা আছে,
                শুধু সেটা Kernel এ নয়, Application এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "dns-udp-vs-tcp.sh",
          code: `# স্বাভাবিক dig, মানে UDP
dig +noall +answer +stats A example.com @1.1.1.1
# example.com.   261  IN  A  104.20.23.154
# ;; SERVER: 1.1.1.1#53(1.1.1.1)
# ;; MSG SIZE  rcvd: 72          <- উত্তরটা মাত্র 72 Byte

# একই প্রশ্ন, জোর করে TCP তে
dig +tcp +noall +answer +stats A example.com @1.1.1.1
# উত্তর হুবহু এক। শুধু পথটা আলাদা, আর পর্দার আড়ালে Packet অনেক বেশি।

# প্রমাণ, Port 53 TCP তেও খোলা
nc -vz -w 2 1.1.1.1 53
# Connection to 1.1.1.1 port 53 [tcp/domain] succeeded!`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে DNS সার্ভার TCP তেও শোনে কেন? কারণ কিছু উত্তর একটা Datagram
                এ আঁটে না। DNS এর আদি নিয়মে একটা UDP উত্তর সর্বোচ্চ ৫১২ Byte হতে
                পারত। পরে EDNS নামে একটা বাড়তি ব্যবস্থা আসে, যেখানে Client প্রশ্নের
                সাথেই বলে দেয় সে কত বড় UDP উত্তর নিতে পারবে। আজকাল সেই সংখ্যাটা
                সাধারণত 1232। উত্তর এর চেয়েও বড় হলে সার্ভার সেটা কেটে পাঠায় আর
                একটা Flag চালু করে দেয়, TC, মানে Truncated। Client তখন বোঝে তাকে
                TCP তে আসতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DnsFallbackDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এটা নিজে ঘটিয়ে দেখা যায়। google.com এর TXT Record অনেকগুলো, উত্তরটা
                হাজার Byte ছাড়িয়ে যায়। dig কে বলুন সে মাত্র ৫১২ Byte নিতে পারে,
                তারপর দেখুন কী হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "dns-truncated.sh",
          code: `# +bufsize=512: আমি সর্বোচ্চ 512 Byte এর UDP উত্তর নিতে পারি
# +notcp +ignore: কাটা পড়লেও TCP তে যেও না, যা পেয়েছ তাই দেখাও
dig +notcp +ignore +bufsize=512 +noall +comments TXT google.com @8.8.8.8
# ;; flags: qr tc rd ra; QUERY: 1, ANSWER: 0, ...
#              ^^ এই tc ই Truncated Flag। আর ANSWER: 0, মানে উত্তরে কিছুই নেই।

# এবার +ignore বাদ দিন, dig কে তার স্বাভাবিক কাজ করতে দিন
dig +bufsize=512 TXT google.com @8.8.8.8 | grep -i "trunc\\|MSG SIZE"
# ;; Truncated, retrying in TCP mode.
# ;; MSG SIZE  rcvd: 1187
# dig নিজেই TC দেখে TCP তে গিয়ে পুরো 1187 Byte এর উত্তর এনেছে।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Firewall এ শুধু UDP 53 খুললে যে রহস্যময় সমস্যা হয়",
          content: (
            <p>
              নিজের DNS সার্ভার বা Resolver বসানোর সময় অনেকে Firewall এ শুধু UDP
              53 খোলেন, কারণ শুনেছেন DNS মানে UDP। সাধারণ A Record এর প্রশ্ন তখন
              ঠিকই চলে, তাই কিছু ভুল আছে মনে হয় না। কিন্তু বড় উত্তরের বেলায়,
              যেমন লম্বা SPF বা DKIM সহ TXT Record, Client যখন TC দেখে TCP তে
              আসতে চায় তখন পথ বন্ধ পায়। ফল হলো, কিছু নাম খোলে, কিছু খোলে না, আর
              ইমেইল যাচাই মাঝে মাঝে ব্যর্থ হয়। নিয়ম সহজ: DNS এর জন্য Port 53
              সবসময় UDP আর TCP দুইটাতেই খুলুন। আর মনে রাখুন, UDP 53 আর TCP 53
              দুইটা সম্পূর্ণ আলাদা দরজা, একটা খুললে অন্যটা খোলে না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "other-users",
      subHeader: { index: "008", title: "Who Else Uses It" },
      title: <SectionTitle>DHCP, ঘড়ি, কল, গেম আর Metric</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DNS একা নয়। নিচের ছকে UDP র সবচেয়ে পরিচিত ব্যবহারকারীরা, প্রত্যেকের
                নিজের কারণ সহ। ছকের পরে প্রতিটা একটু খুলে বলা হলো, কারণ প্রতিটার
                যুক্তি আলাদা, আর সেই যুক্তিটাই আপনার শেখার জিনিস।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <UdpUsersDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>DHCP, যেখানে TCP সম্ভবই নয়।</strong> Module 03 এর DHCP
                লেসনের DORA মনে করুন। আপনার ফোন Wi-Fi তে সবে জোড়া লেগেছে, তার
                কোনো IP নেই, সে জানেও না DHCP সার্ভার কোথায়। তাই সে প্রথম বার্তা
                Discover পাঠায় Source IP 0.0.0.0 থেকে, গন্তব্য 255.255.255.255,
                মানে Broadcast, এই Network এর সবাই শুনুন। এখন ভাবুন এটা TCP তে
                করা যেত কি না। Handshake করতে হলে নিজের একটা ঠিকানা লাগে, যেখানে
                SYN-ACK ফিরবে, আর ওপাশের একটা নির্দিষ্ট ঠিকানা লাগে। ফোনের এর
                কোনোটাই নেই। আর TCP সবসময় ঠিক দুই পক্ষের মধ্যে, সবাইকে একসাথে বলা
                তার ভাষায় নেই। UDP তে এই সমস্যাই নেই, কারণ সে কারো সাথে আগে থেকে
                কিছু ঠিক করে না। DHCP তে সার্ভার শোনে UDP Port 67 এ, Client শোনে
                68 এ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>NTP, ঘড়ি মেলানো।</strong> আপনার কম্পিউটার আর সার্ভারের
                ঘড়ি নিজে থেকে একটু একটু করে পিছায় বা এগোয়। NTP (Network Time
                Protocol) একটা সময় সার্ভারকে জিজ্ঞেস করে এখন ঠিক কয়টা, আর
                উত্তরটা আসতে পথে কত সময় লাগল সেটা মেপে হিসাব ঠিক করে নেয়। এখানে
                হারানো উত্তর আবার পাঠিয়ে কোনো লাভ নেই। দেরিতে পৌঁছানো একটা সময়
                মানে একটা ভুল সময়। তার চেয়ে নতুন করে জিজ্ঞেস করা ভালো। NTP চলে
                UDP Port 123 এ। এটা তুচ্ছ কিছু নয়: সার্ভারের ঘড়ি ভুল হলে TLS
                Certificate যাচাই ব্যর্থ হয়, Log এর সময় এলোমেলো হয়, আর সময় ধরে
                কাজ করা Token অকেজো হয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ntp-ask.sh",
          code: `# macOS এ একটা সময় সার্ভারকে জিজ্ঞেস করুন (ঘড়ি বদলায় না, শুধু দেখায়)
sntp time.apple.com
# +0.035237 +/- 0.118751 time.apple.com 17.253.18.99
#  ^^^^^^^^ আপনার ঘড়ি সার্ভারের চেয়ে এত সেকেন্ড আলাদা

# Linux এ (এই যন্ত্রে চালানো হয়নি)
# chronyc tracking
# timedatectl status`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Voice আর Video Call।</strong> Lab এ যা দেখেছেন সেটাই।
                মাইক্রোফোনের শব্দ কাটা হয় খুব ছোট টুকরোয়, সাধারণত ২০ মিলিসেকেন্ডের,
                মানে সেকেন্ডে পঞ্চাশটা Datagram। গ্রহীতার দিকে একটা ছোট অপেক্ষার
                ঘর থাকে, যার নাম Jitter Buffer। সে কয়েক দশ মিলিসেকেন্ড টুকরো জমিয়ে
                রাখে যাতে একটু আগে পরে আসা টুকরোগুলো সাজিয়ে নেওয়া যায়। যে টুকরো
                এই সময়ের মধ্যে আসে না, তাকে বাদ দিয়ে এগিয়ে যাওয়া হয়, আর ফাঁকটা
                আগের শব্দ থেকে আন্দাজ করে ভরে দেওয়া হয়। খেয়াল করুন, ক্রম ঠিক করা
                এখানেও হচ্ছে, টুকরোর গায়ে নম্বরও আছে। কিন্তু নিয়মটা কল এর দরকার
                মতো বানানো: ক্রম সাজানো হবে, কিন্তু কারো জন্য অপেক্ষা করা হবে না। এই কাজের জন্য যে Protocol
                টা UDP র উপরে বসে তার নাম RTP, আর ব্রাউজারের ভেতরে কল চালানোর
                প্রযুক্তি WebRTC সেটাই ব্যবহার করে। Zoom, Google Meet, WhatsApp
                Call সবাই প্রথমে UDP ই চেষ্টা করে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Online Game।</strong> একটা দ্রুত গতির খেলায় সার্ভার
                সেকেন্ডে বিশ থেকে ষাট বার সব খেলোয়াড়ের অবস্থান পাঠায়। একটা
                হারালে আবার পাঠানোর মানে নেই, কারণ তার পরেরটাতেই আরও নতুন অবস্থান
                আসছে। পুরনো অবস্থানের জন্য দাঁড়িয়ে থাকলে খেলাটা আটকে আটকে চলবে,
                যাকে খেলোয়াড়রা Lag বলেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Metric আর Log।</strong> এটা একজন Backend Developer এর
                সবচেয়ে কাছের উদাহরণ। আপনার App প্রতিটা Request শেষে একটা ছোট হিসাব
                পাঠায়, যেমন এই Request এ কত মিলিসেকেন্ড লাগল। StatsD নামের জনপ্রিয়
                ব্যবস্থাটা এগুলো নেয় UDP Port 8125 এ, আর পুরনো Syslog নেয় UDP 514
                এ। কেন UDP? কারণ Metric সংগ্রহ একটা পাশের কাজ, আসল কাজ নয়। TCP
                হলে Metric সার্ভার ধীর বা বন্ধ হলে আপনার App Connection খোলার
                অপেক্ষায় আটকে যেতে পারত, আর Metric এর জন্য পর্যটকের বুকিং ধীর হতো।
                UDP তে পাঠানো মানে ছুড়ে দিয়ে ভুলে যাওয়া। Metric সার্ভার মরে গেলেও
                App টেরই পায় না। হাজারে দুই একটা Metric হারালে গ্রাফের কিছু যায়
                আসে না। এই ধরনটার একটা নাম আছে, Fire and Forget।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একটা বার্তা, অনেক গ্রহীতা: Broadcast আর Multicast",
          content: (
            <p>
              TCP তে একটা Connection মানে ঠিক দুইটা প্রান্ত, যাকে বলে Unicast।
              UDP তে আরও দুইটা উপায় আছে। Broadcast মানে একই Network এর সবাইকে
              পাঠানো, DHCP Discover যেমন, আর ARP লেসনে যার সাথে আপনার প্রথম
              পরিচয়। Multicast মানে শুধু তাদের পাঠানো যারা একটা নির্দিষ্ট দলে নাম
              লিখিয়েছে। আপনার বাসার Network এ ল্যাপটপ যখন নিজে থেকেই Printer বা
              Smart TV খুঁজে পায়, সেটা হয় mDNS দিয়ে, যা UDP Port 5353 এ Multicast।
              একটু পরে নিজের যন্ত্রের খোলা UDP Port দেখার সময় এই 5353 কে চিনতে
              পারবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "quic",
      subHeader: { index: "009", title: "QUIC and VPN" },
      title: <SectionTitle>QUIC, HTTP/3 আর WireGuard: UDP র উপরে নতুন করে বানানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণের উদাহরণগুলোতে UDP বাছা হয়েছে কারণ নির্ভরযোগ্যতার দরকার কম।
                এবার একটা উল্টো ঘটনা। Web Page এ একটা Byte হারালেও চলে না, তবু
                Web এর সবচেয়ে নতুন সংস্করণ HTTP/3 চলে UDP র উপরে। এটা বুঝলে UDP
                সম্পর্কে আপনার ধারণা পুরো হবে।
              </ContentParagraph>
              <ContentParagraph>
                সমস্যাটা ছিল TCP র দুই জায়গায়। প্রথমত, Head of Line Blocking। একটা
                Web Page এ অনেকগুলো ফাইল থাকে, ছবি, CSS, JavaScript। HTTP/2 এগুলো
                সব একটা TCP Connection দিয়ে একসাথে আনে। কিন্তু TCP র চোখে পুরোটা
                একটাই Byte Stream। একটা ছবির একটা Segment হারালে TCP সবাইকে আটকে
                রাখে, যদিও বাকি ফাইলগুলোর সাথে ওই হারানো টুকরোর কোনো সম্পর্ক নেই।
                দ্বিতীয়ত, শুরুর দেরি। TCP Handshake এ এক Round Trip, তার উপর TLS
                এর নিরাপত্তার Handshake এ আরও এক বা দুই, তারপর প্রথম Request।
                দূরের সার্ভারে এটা কয়েকশো মিলিসেকেন্ড।
              </ContentParagraph>
              <ContentParagraph>
                এগুলো সারাতে হলে TCP কেই বদলাতে হয়। কিন্তু TCP থাকে Kernel এর
                ভেতরে, আর পথের হাজারো Router, Firewall আর NAT যন্ত্র TCP র চেনা
                চেহারা ধরে নিয়ে কাজ করে। পৃথিবীর সব Operating System আর মাঝপথের
                সব যন্ত্র বদলানো প্রায় অসম্ভব। তাই Google এর প্রকৌশলীরা অন্য পথ
                নিলেন। তাঁরা একটা সম্পূর্ণ নতুন Transport Protocol বানালেন, নাম
                QUIC, আর সেটাকে বসালেন UDP র উপরে। পথের যন্ত্রগুলোর চোখে এটা
                সাধারণ UDP Datagram, তারা কিছু না বুঝেই পার করে দেয়। আর আসল বুদ্ধিটা
                থাকে দুই প্রান্তের Application এ, যেমন ব্রাউজারের ভেতরে, Kernel
                এ নয়। তাই ব্রাউজার Update হলেই Protocol টা Update হয়ে যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>QUIC এ TCP র সব গুণই আছে:</strong> Packet এর নম্বর, ACK,
                  Retransmission, Flow Control, Congestion Control, সবই আছে। শুধু
                  UDP এগুলো দেয় না বলে QUIC নিজে বানিয়ে নিয়েছে।
                </ListItem>
                <ListItem>
                  <strong>আলাদা Stream, আলাদা ক্রম:</strong> QUIC এর ভেতরে প্রতিটা
                  ফাইল নিজের আলাদা Stream এ যায়। একটা ছবির টুকরো হারালে শুধু সেই
                  ছবিটাই অপেক্ষা করে, বাকিরা এগিয়ে যায়।
                </ListItem>
                <ListItem>
                  <strong>এক ধাপে Connection আর নিরাপত্তা:</strong> QUIC এ TLS
                  ভেতরেই গাঁথা। Connection খোলা আর Encryption এর চাবি ঠিক করা একই
                  Round Trip এ হয়ে যায়, আর আগে কথা হওয়া সার্ভারের বেলায় প্রথম
                  Packet এই Data পাঠানো যায়।
                </ListItem>
                <ListItem>
                  <strong>Network বদলালেও Connection টেকে:</strong> TCP Connection
                  চেনা হয় IP আর Port দিয়ে, তাই ফোন Wi-Fi থেকে Mobile Data য় গেলে
                  IP বদলায় আর Connection ছিঁড়ে যায়। QUIC প্রতিটা Connection কে
                  একটা নিজস্ব ID দিয়ে চেনে, তাই IP বদলালেও কথা চলতে থাকে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                HTTP/3 চলে UDP Port 443 এ, ঠিক যে নম্বরে HTTPS চলে TCP তে। ব্রাউজার
                কীভাবে জানে একটা সাইট HTTP/3 পারে? প্রথমবার সে সাধারণ TCP তেই যায়,
                আর সার্ভার উত্তরের Header এ একটা ইঙ্গিত দিয়ে দেয়। সেটা নিজে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "see-quic.sh",
          code: `# সার্ভার কি বলছে, আমি HTTP/3 পারি?
curl -sI https://www.cloudflare.com | grep -i alt-svc
# alt-svc: h3=":443"; ma=86400
#          ^^ h3 মানে HTTP/3, ":443" মানে UDP Port 443, ma মানে কত সেকেন্ড মনে রাখবে

# আপনার যন্ত্রে এই মুহূর্তে কারা UDP 443 এ কথা বলছে (Chrome খোলা রেখে চালান)
lsof -nP -iUDP | grep ":443"
# Google  ...  UDP 192.168.0.103:64662->142.251.154.119:443
# Google  ...  UDP 192.168.0.103:57764->172.217.26.10:443
# এগুলোই QUIC। Chrome এই মুহূর্তে UDP র উপর দিয়ে Web Page আনছে।

# Linux এ একই জিনিস (এই যন্ত্রে চালানো হয়নি)
# ss -uanp | grep ":443"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>WireGuard আর VPN।</strong> VPN একটা সুড়ঙ্গ বানায়: আপনার
                পুরো IP Packet টাকে Encrypt করে আরেকটা Packet এর পেটে ভরে সার্ভারে
                পাঠায়। এখন ভাবুন সুড়ঙ্গটা TCP হলে কী হতো। ভেতরের Packet গুলোর
                বেশিরভাগ নিজেই TCP, যারা হারালে নিজে থেকেই আবার পাঠায়। বাইরের
                সুড়ঙ্গও TCP হলে একটা Packet হারালে দুই স্তরই একসাথে আবার পাঠানোর
                চেষ্টা করত আর দুই স্তরই গতি কমাত, একটা আরেকটার সাথে লড়াই করে।
                ফলে গতি ধসে পড়ে, যার নাম TCP Meltdown। তাই সুড়ঙ্গটা হওয়া উচিত
                বোকা আর দ্রুত, নির্ভরযোগ্যতার ভার ভেতরের জনের। এই কারণে আধুনিক
                VPN WireGuard শুধুই UDP তে চলে, স্বাভাবিক Port 51820, আর OpenVPN
                ও স্বাভাবিকভাবে UDP ই বাছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "UDP অনির্ভরযোগ্য, কিন্তু UDP র উপরে যা চলে তা নাও হতে পারে",
          content: (
            <p>
              এখান থেকে একটা ভুল ধারণা চিরতরে ঝেড়ে ফেলুন। UDP মানেই Data হারাবে,
              এই কথাটা Transport Layer এর জন্য সত্য, কিন্তু তার উপরে কী বসানো
              হয়েছে তার জন্য নয়। QUIC UDP র উপরে চলে, আর সে TCP র মতোই নিখুঁত।
              তাই কেউ যখন বলেন HTTP/3 UDP ব্যবহার করে, তার মানে এই নয় যে Web Page
              এখন হারাতে পারে। মানে হলো, নির্ভরযোগ্যতার কাজটা Kernel থেকে সরে
              Application এ এসেছে। UDP তাই দুই রকম মানুষের Protocol: যাদের
              নির্ভরযোগ্যতা লাগে না, আর যারা সেটা নিজে আরও ভালো বানাতে চায়। আর
              Server চালানোর দিক থেকে মনে রাখুন, HTTP/3 চালাতে হলে Firewall এ UDP
              443 আলাদা করে খুলতে হয়। শুধু TCP 443 খোলা থাকলে সাইট চলবে, কিন্তু
              চুপচাপ পুরনো HTTP/2 তে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "diy",
      subHeader: { index: "010", title: "Do It Yourself" },
      title: <SectionTitle>UDP নিলে আপনার Application কে নিজে যা করতে হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরুন আপনি নিজে UDP র উপরে একটা ছোট প্রশ্ন উত্তরের ব্যবস্থা বানাবেন।
                TCP যা বিনা পয়সায় দিত, তার কোনগুলো আপনার লাগবে সেটা ঠিক করে নিজে
                লিখতে হবে। সবচেয়ে সাধারণ চাহিদা হলো, প্রশ্নের উত্তর না এলে আবার
                জিজ্ঞেস করা। DNS Client ঠিক এটাই করে। এটা বানাতে চারটা জিনিস লাগে,
                আর প্রতিটার পেছনে একটা কারণ আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা প্রশ্নের একটা ID:</strong> উত্তর এলে বুঝতে হবে
                  এটা কোন প্রশ্নের। ক্রমের নিশ্চয়তা নেই, পুরনো প্রশ্নের দেরিতে
                  আসা উত্তরও চলে আসতে পারে। DNS এর Header এ ঠিক এই কাজের জন্য
                  ১৬ Bit এর একটা ID থাকে, dig এর উত্তরে যেটা{" "}
                  <code>id: 62455</code> হিসেবে দেখেছেন।
                </ListItem>
                <ListItem>
                  <strong>একটা Timeout:</strong> উত্তর আসবে না, এই খবরটা কেউ দেবে
                  না। তাই নিজে একটা ঘড়ি ধরতে হবে, এতক্ষণে না এলে ধরে নেব হারিয়েছে।
                </ListItem>
                <ListItem>
                  <strong>Retry, আর তার একটা সীমা:</strong> Timeout হলে আবার পাঠানো,
                  কিন্তু অনন্তকাল নয়। কয়েকবার চেষ্টার পর হাল ছেড়ে Error জানানো।
                  আর প্রতিবার অপেক্ষার সময় একটু বাড়ানো ভালো, যাতে ডুবে থাকা
                  সার্ভারকে আরও ডোবানো না হয়।
                </ListItem>
                <ListItem>
                  <strong>একই কাজ দুইবার হলে ক্ষতি না হওয়া:</strong> সবচেয়ে সূক্ষ্ম
                  ব্যাপার। উত্তর না আসার দুইটা কারণ হতে পারে, প্রশ্নটা হারিয়েছে,
                  অথবা প্রশ্নটা পৌঁছেছিল কিন্তু উত্তরটা হারিয়েছে। আপনি তফাত করতে
                  পারবেন না। দ্বিতীয় ক্ষেত্রে আবার পাঠালে সার্ভার কাজটা দুইবার
                  করবে। নাম খোঁজার মতো কাজে এতে ক্ষতি নেই। কিন্তু টাকা কেটে নেওয়ার মতো
                  কাজে সর্বনাশ। যে কাজ বারবার করলেও ফল একই থাকে তাকে বলে
                  Idempotent, আর UDP র উপরে Retry শুধু তেমন কাজেই নিরাপদ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "udp-retry.mjs",
          code: `import dgram from "node:dgram";

const host = process.env.UDP_HOST;
const port = Number(process.env.UDP_PORT);
const timeoutMs = Number(process.env.UDP_TIMEOUT_MS);
const maxTries = Number(process.env.UDP_MAX_TRIES);
if (!host || !Number.isInteger(port) || !Number.isInteger(timeoutMs) || !Number.isInteger(maxTries)) {
  throw new Error("UDP_HOST, UDP_PORT, UDP_TIMEOUT_MS and UDP_MAX_TRIES must be set");
}

const client = dgram.createSocket("udp4");
// ১. প্রশ্নের ID, যাতে উত্তরটা চেনা যায়
const id = Math.floor(Math.random() * 65536);
let tries = 0;
let timer;

function attempt() {
  tries += 1;
  // ৩. Retry র সীমা
  if (tries > maxTries) {
    console.log("gave up after", maxTries, "tries");
    client.close();
    return;
  }
  console.log("try", tries, "id", id);
  client.send(id + " ping", port, host);
  // ২. Timeout: এতক্ষণে উত্তর না এলে আবার চেষ্টা
  timer = setTimeout(attempt, timeoutMs);
}

client.on("message", (msg) => {
  // অন্য কোনো প্রশ্নের উত্তর হলে উপেক্ষা
  if (!msg.toString().includes(String(id))) return;
  clearTimeout(timer);
  console.log("answer after", tries, "tries:", msg.toString());
  client.close();
});

client.on("error", (err) => {
  console.log("error:", err.code);
});

attempt();`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "run-retry.sh",
          code: `export UDP_HOST=127.0.0.1 UDP_PORT=41234
export UDP_TIMEOUT_MS=300 UDP_MAX_TRIES=3

# সার্ভার বন্ধ রেখে
node udp-retry.mjs
# try 1 id 62845
# try 2 id 62845
# try 3 id 62845
# gave up after 3 tries

# সার্ভার চালু রেখে
node udp-retry.mjs
# try 1 id 60592
# answer after 1 tries: echo: 60592 ping`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মাত্র চল্লিশ লাইনে আপনি TCP র Retransmission এর একটা সরল রূপ নিজে
                বানিয়ে ফেললেন। এটা দেখে দুইটা জিনিস বোঝা উচিত। এক, নির্ভরযোগ্যতা
                কোনো জাদু নয়, এটা ID, ঘড়ি আর আবার চেষ্টা। দুই, এই সরল রূপটা একটা
                প্রশ্ন উত্তরের জন্য যথেষ্ট, কিন্তু বড় Data পাঠানোর জন্য একদমই নয়।
                সেখানে আরও লাগবে ক্রম সাজানো, গ্রহীতার ক্ষমতা মেনে চলা, আর সবচেয়ে
                জরুরি, রাস্তার ভিড় বুঝে গতি কমানো। শেষেরটা না থাকলে আপনার Program
                নিজের আর আশেপাশের সবার Network ডুবিয়ে দিতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা জিনিস UDP দেয় না, আর TCP ও দেয় না: গোপনীয়তা। দুইটাই Data
                খোলা অবস্থায় পাঠায়। TCP র উপরে Encryption বসায় TLS। UDP র জন্য
                তার সমান জিনিসটার নাম DTLS, আর QUIC ও WireGuard নিজের Encryption
                নিজেই সাথে আনে। নিজে UDP Protocol বানিয়ে তাতে গোপন কিছু পাঠালে এই
                কাজটাও আপনার ঘাড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিজে আরেকটা TCP বানাতে শুরু করলে থামুন",
          content: (
            <p>
              নতুনদের একটা চেনা ভুল হলো, শুনেছি UDP দ্রুত, তাই UDP নিয়ে তার উপরে
              ক্রম, ACK, Retry সব নিজে লিখে ফেলা। শেষে যা দাঁড়ায় তা TCP র একটা
              ধীর, ভুলে ভরা নকল। TCP র পেছনে চল্লিশ বছরের পরীক্ষা আর ঘষামাজা
              আছে। নিয়মটা এরকম রাখুন: আপনার যদি সব Data, ঠিক ক্রমে লাগে, তাহলে
              TCP নিন, ব্যস। UDP নিন শুধু তখন, যখন আপনি স্পষ্ট বলতে পারেন TCP র
              কোন কাজটা আপনার দরকার নেই আর কেন। আর যদি UDP র সুবিধা আর পুরো
              নির্ভরযোগ্যতা দুইটাই চান, নিজে না বানিয়ে QUIC এর মতো তৈরি কিছু
              ব্যবহার করুন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "size",
      subHeader: { index: "011", title: "Datagram Size" },
      title: <SectionTitle>একটা Datagram কত বড় রাখা নিরাপদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TCP তে আপনি যত খুশি Data লিখে দেন, আর TCP নিজে সেটাকে পথের মাপ
                মতো ছোট ছোট Segment এ কেটে নেয়। আগের লেসনে এই মাপটার নাম শিখেছেন,
                MSS। UDP কিছু কাটে না। আপনি যে আকারের বার্তা দেবেন, সে হুবহু সেই
                আকারের একটা Datagram বানাবে। তাই কত বড় দেওয়া উচিত, এই ভাবনাটা
                এবার আপনার।
              </ContentParagraph>
              <ContentParagraph>
                তিনটা সীমা আছে, বড় থেকে ছোট।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>তাত্ত্বিক সীমা, 65507 Byte:</strong> একটা IP Packet
                  সর্বোচ্চ 65535 Byte। তা থেকে IP Header এর 20 আর UDP Header এর
                  8 বাদ দিলে Data র জন্য থাকে 65507। এর বেশি কোনোভাবেই সম্ভব নয়।
                </ListItem>
                <ListItem>
                  <strong>পথের সীমা, 1472 Byte:</strong> পথের প্রতিটা তারের একটা
                  সর্বোচ্চ Packet আকার আছে, যার নাম MTU (Maximum Transmission
                  Unit)। সাধারণ Ethernet আর Wi-Fi তে এটা 1500 Byte। 1500 থেকে 20
                  আর 8 বাদ দিলে 1472। এর চেয়ে বড় Datagram কে IP পথে কয়েক টুকরো
                  করে পাঠায়, যার নাম Fragmentation। ওপাশে সব টুকরো জুড়ে আবার আস্ত
                  Datagram বানানো হয়।
                </ListItem>
                <ListItem>
                  <strong>নিরাপদ সীমা, মোটামুটি 1200 Byte:</strong> পথে VPN,
                  Tunnel বা PPPoE থাকলে তারা নিজের Header জোড়ে, ফলে আসল MTU 1500
                  এর কম হয়ে যায়। তাই বাস্তবে যাঁরা UDP Protocol বানান তাঁরা হাতে
                  জায়গা রাখেন। QUIC এর Packet 1200 Byte এর আশেপাশে, DNS এর
                  প্রচলিত সীমা 1232।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Fragmentation এড়াতে চাওয়ার কারণটা নিচের Lab এ সংখ্যায় দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DatagramSizeLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Fragmentation খারাপ তিনটা কারণে। এক, যেকোনো একটা টুকরো হারালে
                পুরো Datagram বাতিল, তাই টুকরো যত বেশি, হারানোর ঝুঁকি তত বেশি।
                দুই, Port নম্বর থাকে শুধু প্রথম টুকরোয়, কারণ UDP Header একটাই। তাই
                অনেক Firewall আর NAT যন্ত্র পরের টুকরোগুলো কার, বুঝতে না পেরে
                ফেলে দেয়। তিন, গ্রহীতার Kernel কে সব টুকরো আসা পর্যন্ত Memory তে
                ধরে রাখতে হয়, যা আক্রমণকারীরা কাজে লাগাতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                আর পথের সীমায় পৌঁছানোর আগেই আপনার নিজের Operating System থামিয়ে
                দিতে পারে। নিচের ছোট Program টা নানা আকারের Datagram পাঠানোর
                চেষ্টা করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "udp-size.mjs",
          code: `import dgram from "node:dgram";

const host = process.env.UDP_HOST;
const port = Number(process.env.UDP_PORT);
if (!host || !Number.isInteger(port)) {
  throw new Error("UDP_HOST and UDP_PORT must be set");
}

const client = dgram.createSocket("udp4");
const sizes = [512, 1200, 1472, 9216, 9217, 65507, 65508];

let left = sizes.length;
for (const size of sizes) {
  client.send(Buffer.alloc(size, "a"), port, host, (err) => {
    console.log(String(size).padStart(6), "bytes ->", err ? err.code : "ok");
    left -= 1;
    if (left === 0) client.close();
  });
}`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "run-size.sh",
          code: `# macOS এ, সার্ভার 127.0.0.1 এ চালু রেখে
node udp-size.mjs
#    512 bytes -> ok
#   1200 bytes -> ok
#   1472 bytes -> ok
#   9216 bytes -> ok
#   9217 bytes -> EMSGSIZE
#  65507 bytes -> EMSGSIZE
#  65508 bytes -> EMSGSIZE

# 9216 এর পরেই থেমে গেল কেন? macOS এর নিজের একটা সীমা আছে
sysctl net.inet.udp.maxdgram
# net.inet.udp.maxdgram: 9216

# Linux এ এই সীমাটা নেই, সেখানে 65507 পর্যন্ত ok আর 65508 এ EMSGSIZE
# পাওয়ার কথা (এই যন্ত্রে চালানো হয়নি)।

# আপনার Network Card এর MTU
ifconfig en0 | grep mtu          # macOS
# en0: flags=8863<UP,BROADCAST,...> mtu 1500
# ip link show                   # Linux (এই যন্ত্রে চালানো হয়নি)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "EMSGSIZE দেখলে কী বুঝবেন",
          content: (
            <p>
              EMSGSIZE মানে Message Too Long, বার্তাটা এত বড় যে Kernel পাঠাতেই
              রাজি হয়নি। এটা UDP র হাতে গোনা কয়েকটা Error এর একটা যা আপনি সত্যিই
              হাতে পান, কারণ এটা ধরা পড়ে আপনার নিজের যন্ত্রেই, Packet বের হওয়ার
              আগে। সমাধান কখনোই সীমা বাড়ানো নয়। সমাধান হলো বার্তা ছোট করা, বা
              বড় Data কে নিজে কয়েকটা ছোট Datagram এ ভাগ করে প্রতিটায় নম্বর বসানো,
              বা মেনে নেওয়া যে এই কাজটা আসলে TCP র। loopback এ (127.0.0.1) 9216
              Byte ঠিকঠাক গেছে বলে ভুল বুঝবেন না। সেখানে আসল তার নেই, MTU অনেক
              বড়। আসল Network এ সেটাই সাত টুকরো হয়ে যেত।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "nat-firewall",
      subHeader: { index: "012", title: "NAT and Firewall" },
      title: <SectionTitle>Connection নেই, তাহলে NAT আর Firewall কী মনে রাখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এর NAT লেসনে দেখেছেন, বাসার Router বাইরে যাওয়া প্রতিটা
                Packet এর Source IP আর Port বদলে দেয়, আর একটা ছকে লিখে রাখে কোন
                ভেতরের যন্ত্রের কোন Port বাইরের কোন Port হয়ে গেল, যাতে উত্তর এলে
                সঠিক যন্ত্রে ফেরত দিতে পারে। TCP তে এই ছকের সারি কখন মুছতে হবে তা
                Router পরিষ্কার জানে: FIN বা RST দেখলে Connection শেষ। UDP তে তো
                শুরুও নেই, শেষও নেই। তাহলে Router কী করে?
              </ContentParagraph>
              <ContentParagraph>
                সে আন্দাজ করে। ভেতর থেকে একটা UDP Datagram বাইরে গেলে Router ছকে
                একটা সারি বানায় আর একটা ঘড়ি চালু করে। ওই একই ঠিকানা থেকে উত্তর
                এলে বা ভেতর থেকে আবার কিছু গেলে ঘড়িটা নতুন করে শুরু হয়। কিছুক্ষণ
                চুপচাপ থাকলে Router ধরে নেয় কথা শেষ, আর সারিটা মুছে ফেলে। এই
                চুপচাপ থাকার সময়টা UDP র জন্য খুব ছোট, অনেক বাসার Router এ মাত্র
                ৩০ সেকেন্ড থেকে কয়েক মিনিট, যেখানে TCP র খোলা Connection এর জন্য
                সেটা ঘণ্টার হিসাবে।
              </ContentParagraph>
              <ContentParagraph>
                আমাদের পর্যটকের ফোন দিয়ে দেখুন। ফোন (192.168.1.20, Port 51514)
                একটা UDP Datagram পাঠাল। Router সেটার Source বদলে করল
                203.0.113.25, Port 51514, আর সারিটা লিখে রাখল। উত্তর ওই Port এ
                ফিরলে Router সেটা ফোনে পৌঁছে দেবে। কিন্তু ফোন যদি এক মিনিট কিছু
                না পাঠায়, সারিটা মুছে যাবে। তারপর সার্ভার কিছু পাঠালে Router
                জানবে না সেটা কার, আর ফেলে দেবে। কেউ কোনো Error পাবে না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Keepalive:</strong> এই কারণে লম্বা সময় চালু থাকা UDP
                  ব্যবস্থাগুলো নিয়ম করে একটা ছোট্ট ফাঁকা Datagram পাঠায়, শুধু
                  Router এর ঘড়িটা জাগিয়ে রাখতে। WireGuard এ এর জন্য একটা Setting
                  আছে, PersistentKeepalive, যা সাধারণত 25 সেকেন্ড রাখা হয়। সংখ্যাটা
                  এলোমেলো নয়, এটা সবচেয়ে অধৈর্য Router গুলোর ৩০ সেকেন্ডের ঠিক
                  নিচে।
                </ListItem>
                <ListItem>
                  <strong>NAT এর পেছনের দুইজনের সরাসরি কথা:</strong> Video Call এ
                  দুইজনই নিজের নিজের NAT এর পেছনে, কারো Public IP নেই। NAT লেসনে
                  শিখেছেন, বাইরে থেকে ভেতরে ঢোকা সহজ নয়। সমাধানটা UDP র এই
                  আচরণকেই কাজে লাগায়। দুইজনই আগে একটা পরিচিত সার্ভারকে (যার নাম
                  STUN Server) একটা Datagram পাঠায়, যে তাদের জানিয়ে দেয় বাইরে থেকে
                  তাদের ঠিকানা আর Port কী দেখাচ্ছে। তারপর দুইজন একই সময়ে একে
                  অপরের সেই ঠিকানায় Datagram পাঠায়। প্রত্যেকের Router ভাবে এটা তো
                  আমার ভেতরের জনের শুরু করা কথার উত্তর, আর ঢুকতে দেয়। এই কৌশলের
                  নাম UDP Hole Punching। TCP দিয়ে এটা অনেক কঠিন, যা Call এ UDP
                  ব্যবহারের আরেকটা বড় কারণ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Firewall ও একই আন্দাজের খেলা খেলে। আধুনিক Firewall, যাকে বলে
                Stateful Firewall, TCP Connection এর শুরু থেকে শেষ পর্যন্ত খেয়াল
                রাখে। UDP র জন্য সে একটা নকল Connection ধরে নেয়: ভেতর থেকে একটা
                Datagram গেলে কিছুক্ষণের জন্য ওই ঠিকানা থেকে ফেরত আসা Datagram
                ঢুকতে দেয়। এই কারণেই আপনার ল্যাপটপ থেকে DNS প্রশ্ন বাইরে যায় আর
                উত্তর ফিরে আসে, যদিও বাইরে থেকে আপনার ল্যাপটপে নতুন করে কিছু ঢোকা
                বন্ধ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "UDP Port খোলা না বন্ধ, বাইরে থেকে বলা প্রায় অসম্ভব",
          content: (
            <p>
              TCP Port পরীক্ষা করা সহজ। SYN পাঠান, SYN-ACK ফিরলে খোলা, RST ফিরলে
              বন্ধ। UDP তে এই সুবিধা নেই, কারণ খোলা Port ও চুপ থাকতে পারে, আর
              বন্ধ Port এর খবর (ICMP) পথে হারিয়ে যায়। ফল হলো, পরিচিত{" "}
              <code>nc -vzu</code> কমান্ডটা প্রায় সব কিছুকেই succeeded বলে। নিজের
              যন্ত্রে একটা সম্পূর্ণ ফাঁকা Port এ চালিয়ে দেখুন, সে তবুও succeeded
              বলবে। তাই UDP Service চলছে কি না জানার একটাই ভরসাযোগ্য উপায়: ওই
              Service এর নিজের ভাষায় একটা আসল প্রশ্ন পাঠানো আর উত্তর আসে কি না
              দেখা। DNS এর জন্য dig, NTP র জন্য sntp। আর Cloud এর Security Group
              বা Firewall এ নিয়ম লেখার সময় Protocol এর ঘরে TCP আর UDP আলাদা করে
              বাছতে হয়। WireGuard বসিয়ে TCP 51820 খুললে কিছুই হবে না, খুলতে হবে
              UDP 51820।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "attacks",
      subHeader: { index: "013", title: "Spoofing and Amplification" },
      title: <SectionTitle>Handshake না থাকার অন্ধকার দিক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পোস্টকার্ডে প্রেরকের ঠিকানা আপনি নিজে হাতে লেখেন। চাইলে অন্য কারো
                ঠিকানাও লিখে দিতে পারেন, ডাকঘর যাচাই করে না। IP Packet এর Source
                IP ও ঠিক তাই, প্রেরক যা লেখে তাই। অন্যের ঠিকানা বসিয়ে Packet
                পাঠানোর নাম IP Spoofing।
              </ContentParagraph>
              <ContentParagraph>
                TCP তে Spoofing করে বেশিদূর যাওয়া যায় না, আর কারণটা Handshake।
                জাল ঠিকানা দিয়ে SYN পাঠালে সার্ভারের SYN-ACK চলে যায় সেই জাল
                ঠিকানায়, আক্রমণকারীর কাছে নয়। সে SYN-ACK এর ভেতরের সংখ্যাটা
                দেখতেই পায় না, তাই শেষ ACK টা ঠিকমতো পাঠাতে পারে না, আর Connection
                কখনো দাঁড়ায় না। মানে Handshake শুধু ভদ্রতা নয়, এটা একটা ঠিকানা
                যাচাইও: আপনি সত্যিই ওই ঠিকানায় আছেন, তার প্রমাণ। পরের লেসনে এটা
                বিস্তারিত দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                UDP তে এই যাচাই নেই। সার্ভার একটা Datagram পায়, তাতে লেখা Source
                IP বিশ্বাস করে, আর সেখানেই উত্তর পাঠায়। এই ফাঁক দিয়েই আসে UDP র
                সবচেয়ে কুখ্যাত আক্রমণ।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <AmplificationDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর নাম Reflection and Amplification Attack। Reflection, কারণ
                আক্রমণটা একটা নিরীহ সার্ভারে ঠিকরে গিয়ে শিকারের গায়ে লাগে, তাই
                শিকার আসল আক্রমণকারীকে দেখতেই পায় না। Amplification, কারণ ছোট
                প্রশ্নে বড় উত্তর আসে, তাই আক্রমণকারীর শক্তি বহুগুণ বেড়ে যায়। কত
                গুণ বাড়ল তাকে বলে Amplification Factor। খোলা DNS Resolver এ এটা
                কয়েক দশ গুণ হতে পারে। ২০১৮ সালে Internet এ খোলা পড়ে থাকা
                Memcached সার্ভার (UDP Port 11211) ব্যবহার করে GitHub এর উপর যে
                আক্রমণ হয়েছিল, সেখানে এই গুণফল ছিল হাজারের ঘরে, আর আক্রমণের মাপ
                ছিল সেকেন্ডে এক Terabit এর বেশি।
              </ContentParagraph>
              <ContentParagraph>
                একজন Developer বা DevOps Engineer হিসেবে এখানে আপনার দুইটা দায়িত্ব।
                প্রথমটা, নিজে যেন অন্যের আক্রমণের হাতিয়ার না হন। দ্বিতীয়টা, নিজে
                যেন শিকার না হন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>দরকার না থাকলে কোনো UDP Port Internet এ খুলবেন না:</strong>{" "}
                  Memcached, Redis, Database, StatsD, এদের কোনোটারই Public
                  Internet থেকে পৌঁছানোর দরকার নেই। এগুলো শুনবে শুধু 127.0.0.1 বা
                  Private Network এ। Firewall এ শুরুর নিয়ম হোক সব বন্ধ, তারপর যা
                  লাগে শুধু সেটুকু খোলা।
                </ListItem>
                <ListItem>
                  <strong>নিজের Resolver সবার জন্য খোলা রাখবেন না:</strong> নিজের
                  Network এর জন্য একটা DNS Resolver বসালে সেটা যেন শুধু নিজের
                  Network এর প্রশ্নের উত্তর দেয়। যেকারো প্রশ্নের উত্তর দেওয়া
                  Resolver কে বলে Open Resolver, আর আক্রমণকারীরা সারাক্ষণ এমন
                  সার্ভার খুঁজে বেড়ায়।
                </ListItem>
                <ListItem>
                  <strong>যাচাইয়ের আগে প্রশ্নের চেয়ে অনেক বড় উত্তর নয়:</strong>{" "}
                  নিজে UDP Service বানালে এই নিয়মটা মানুন। QUIC এর নকশায় এটা
                  গাঁথা: ঠিকানা যাচাই না হওয়া পর্যন্ত সার্ভার যত Byte পেয়েছে তার
                  তিন গুণের বেশি ফেরত পাঠায় না। আর এই কারণেই QUIC এর প্রথম Packet
                  কে ইচ্ছা করে ফাঁকা Byte দিয়ে ভরে 1200 Byte করা হয়।
                </ListItem>
                <ListItem>
                  <strong>Rate Limit:</strong> একই ঠিকানা থেকে অস্বাভাবিক বেশি
                  প্রশ্ন এলে উত্তর দেওয়া কমিয়ে দিন।
                </ListItem>
                <ListItem>
                  <strong>নিজে শিকার হলে:</strong> সেকেন্ডে শত Gigabit এর ঢল নিজের
                  একটা সার্ভার দিয়ে ঠেকানো যায় না, কারণ Packet গুলো আপনার দরজায়
                  পৌঁছানোর আগেই তার ভরে যায়। এটা ঠেকাতে হয় আরও উজানে, বড় Network
                  এর কাছে। Module 04 এ Cloudflare এর Proxy চালু করেছিলেন। তার একটা
                  বড় কাজ ঠিক এটাই, আপনার আসল IP লুকিয়ে রাখা আর এই ধরনের ঢল নিজের
                  বিশাল Network এ শুষে নেওয়া।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "UDP তে Source IP কখনো পরিচয়ের প্রমাণ নয়",
          content: (
            <p>
              এখান থেকে একটা নিয়ম সারা জীবনের জন্য নিয়ে যান। UDP তে আসা একটা
              Datagram এর Source IP দেখে কখনো কাউকে বিশ্বাস করবেন না। এই IP আমাদের
              অফিসের, তাই ঢুকতে দিলাম, এই যুক্তি UDP তে চলে না, কারণ ঠিকানাটা
              যে কেউ লিখে দিতে পারে। পরিচয় প্রমাণ করতে হয় এমন কিছু দিয়ে যা জাল
              করা যায় না, যেমন গোপন চাবি দিয়ে করা সই। WireGuard ঠিক তাই করে: সঠিক
              চাবি ছাড়া আসা Datagram এর সে কোনো উত্তরই দেয় না, এমনকি না বলেও নয়।
              ফলে বাইরে থেকে বোঝাই যায় না ওই Port এ কিছু চলছে কি না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "decision",
      subHeader: { index: "014", title: "TCP or UDP" },
      title: <SectionTitle>কোন কাজে কোনটা, সিদ্ধান্তটা কীভাবে নেবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণে আপনার হাতে সিদ্ধান্ত নেওয়ার সব উপকরণ আছে। পুরো তুলনাটা
                একটা ছকে রাখা হলো। এটা মুখস্থ করার জিনিস নয়, প্রতিটা সারির কারণ
                আপনি ইতিমধ্যে জানেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "TCP", "UDP"],
          rows: [
            ["একক", "Segment", "Datagram"],
            ["Header", "কমপক্ষে ২০ Byte", "৮ Byte"],
            ["শুরুর আগে", "Handshake, এক Round Trip", "কিছুই না"],
            ["পৌঁছানোর নিশ্চয়তা", "আছে, ACK আর Retransmission", "নেই"],
            ["ক্রম", "ঠিক থাকে", "ঠিক থাকার নিশ্চয়তা নেই"],
            ["বার্তার সীমানা", "থাকে না, Byte Stream", "থাকে, এক send এক Datagram"],
            ["Flow আর Congestion Control", "আছে", "নেই"],
            ["একসাথে অনেককে পাঠানো", "না, শুধু দুই পক্ষ", "হ্যাঁ, Broadcast আর Multicast"],
            ["সার্ভারে প্রতি Client এর খরচ", "একটা করে Connection, Memory লাগে", "কিছুই জমা থাকে না"],
            ["ঠিকানা জাল করা", "কঠিন, Handshake আটকায়", "সহজ"],
            ["কোথায়", "HTTP/1.1, HTTP/2, SSH, Database, ইমেইল", "DNS, DHCP, NTP, Call, Game, QUIC, VPN"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সিদ্ধান্তের জন্য তিনটা প্রশ্ন নিজেকে করুন, এই ক্রমে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক, প্রতিটা Byte কি ঠিক ক্রমে লাগবেই?</strong> হ্যাঁ হলে
                  TCP, আর এখানেই থামুন। ফাইল, Web Page, API, Database, টাকা পয়সা,
                  সব এই ঘরে। বাস্তবে আপনার লেখা Application এর শতকরা পঁচানব্বই
                  ভাগ কাজ এখানেই পড়ে।
                </ListItem>
                <ListItem>
                  <strong>দুই, দেরিতে আসা Data কি মূল্যহীন?</strong> হ্যাঁ হলে UDP।
                  কল, খেলা, সরাসরি সম্প্রচার, ঘড়ি, সেন্সরের এই মুহূর্তের মান।
                </ListItem>
                <ListItem>
                  <strong>তিন, কাজটা কি একটা ছোট প্রশ্ন আর একটা ছোট উত্তর, যা
                  আবার করলে ক্ষতি নেই?</strong> হ্যাঁ হলে UDP, সাথে নিজের Timeout
                  আর Retry। নাম খোঁজা, Service খোঁজা, ছোট অবস্থা জানতে চাওয়া,
                  Metric পাঠানো।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তিনটাতেই না হলে, বা দ্বিধা থাকলে, উত্তর TCP। এবার নিজেকে পরীক্ষা
                করুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TransportPickerLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একই Port নম্বর, দুইটা আলাদা দুনিয়া",
          content: (
            <p>
              TCP Port 53 আর UDP Port 53 একই নম্বর হলেও সম্পূর্ণ আলাদা দুইটা
              দরজা। Kernel এ দুইটার তালিকা আলাদা, তাই একটা Program TCP 8125 এ আর
              আরেকটা Program UDP 8125 এ একই সময়ে নির্বিঘ্নে শুনতে পারে। Kernel
              কীভাবে বোঝে কোন Packet কোন দুনিয়ার? IP Header এ Protocol নামে একটা
              ঘর আছে। সেখানে 6 লেখা থাকলে ভেতরের জিনিসটা TCP, 17 থাকলে UDP। তাই
              কোনো Service এর ঠিকানা বলতে হলে তিনটা জিনিস বলতে হয়: IP, Port, আর
              Protocol। Port লেসনে এই ব্যাপারটা আরও বিস্তারিত আসবে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এ UDP কোথায় কোথায় লুকিয়ে আছে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর কোডে কোথাও dgram লেখা নেই। পুরো App টা HTTP, মানে
                TCP। তবু একজন পর্যটকের একটা বুকিং এ UDP অন্তত পাঁচ জায়গায় কাজ করে।
                এগুলো চিনে রাখলে সমস্যা হলে কোথায় তাকাতে হবে তা জানা থাকবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পর্যটকের ফোন IP পায় (DHCP):</strong> ঢাকার পর্যটক
                  বাসার Wi-Fi তে জোড়া লাগলেন। ফোন UDP 67 আর 68 দিয়ে DORA সেরে
                  192.168.1.20 পেল। এটা না হলে বাকি কিছুই শুরু হয় না।
                </ListItem>
                <ListItem>
                  <strong>নাম থেকে ঠিকানা (DNS):</strong> ফোন islandtours.example
                  এর IP জানতে একটা UDP Datagram পাঠাল Resolver এর Port 53 এ, আর
                  উত্তরে পেল 103.94.135.2। পুরো Module 04 এই এক ধাপের গল্প ছিল।
                </ListItem>
                <ListItem>
                  <strong>পাতা আনা (QUIC):</strong> Island Tours এর সামনে
                  Cloudflare এর Proxy চালু থাকলে পর্যটকের ব্রাউজার Cloudflare এর
                  সাথে HTTP/3 তে, মানে UDP 443 এ কথা বলতে পারে। দুর্বল Mobile
                  Network এ এর লাভ চোখে পড়ে, কারণ একটা হারানো Packet আর পুরো
                  পাতাটাকে আটকে রাখে না, আর Wi-Fi থেকে Mobile Data য় গেলে বুকিং
                  এর মাঝপথে Connection ছেঁড়ে না। Cloudflare থেকে আপনার সার্ভার
                  পর্যন্ত বাকি পথটা সাধারণ TCP ই থাকে, তাই আপনার সার্ভারে কিছুই
                  বদলাতে হয় না।
                </ListItem>
                <ListItem>
                  <strong>সার্ভারের ঘড়ি (NTP):</strong> সার্ভার নিয়মিত UDP 123
                  দিয়ে নিজের ঘড়ি মিলিয়ে নেয়। বুকিং কখন হলো, কোন আসন কে আগে নিল,
                  পেমেন্টের সময়সীমা পার হলো কি না, সবই এই ঘড়ির উপর। ঘড়ি কয়েক
                  মিনিট সরে গেলে TLS যাচাই আর লগইন Token দুইটাই ভাঙতে শুরু করে।
                </ListItem>
                <ListItem>
                  <strong>Metric (StatsD):</strong> প্রতিটা বুকিং Request শেষে App
                  একটা ছোট UDP Datagram ছুড়ে দেয়, কত মিলিসেকেন্ড লাগল। Metric
                  সংগ্রহের ব্যবস্থা রাত তিনটায় বন্ধ হয়ে গেলেও বুকিং একটুও ধীর হয়
                  না।
                </ListItem>
                <ListItem>
                  <strong>দলের ভেতরের রাস্তা (WireGuard):</strong> Database
                  Internet এ খোলা নয়। দলের কেউ সেখানে ঢুকতে চাইলে আগে UDP 51820
                  দিয়ে একটা WireGuard সুড়ঙ্গ খোলেন, তারপর তার ভেতর দিয়ে যান।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার সার্ভারের Firewall এর দিক থেকে ভাবুন, কারণ এখানেই UDP র জ্ঞান
                সরাসরি কাজে লাগে। বাইরে থেকে ভেতরে আসার জন্য খোলা থাকবে TCP 443
                আর TCP 80, Web এর জন্য। VPN চালালে UDP 51820। নিজে HTTP/3 পরিবেশন
                করলে UDP 443। ব্যস। StatsD র 8125, Database, Cache, এর কোনোটাই
                বাইরে থেকে খোলা নয়। আর DNS, NTP র মতো যে কাজগুলো সার্ভার নিজে শুরু
                করে বাইরে যায়, তাদের উত্তর Stateful Firewall নিজেই ঢুকতে দেয়,
                আলাদা করে কিছু খুলতে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                আর Island Tours যদি কখনো গাইডের সাথে সরাসরি Video তে কথা বলার
                সুবিধা যোগ করে, সেটা হবে WebRTC দিয়ে, মানে UDP তে। তখন STUN, Hole
                Punching আর NAT এর ঘড়ির যে গল্প এই লেসনে পড়লেন, সেগুলো আর তত্ত্ব
                থাকবে না, প্রতিদিনের সমস্যা হয়ে দাঁড়াবে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা UDP Datagram এর পুরো জীবন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটক ঠিকানার ঘরে islandtours.example লিখে Enter চাপলেন। ব্রাউজার
              আগে নামটার IP জানতে চায়। সেই একটা DNS প্রশ্ন, UDP Datagram হয়ে ফোন
              থেকে Resolver পর্যন্ত গিয়ে উত্তর নিয়ে ফেরে। প্রতিটা ধাপে খেয়াল করুন
              আগের কোন লেসনের কোন জিনিসটা কাজ করছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Application একটা Socket চায়",
              description:
                "ফোনের DNS Client Kernel কে বলে, একটা UDP Socket দিন (SOCK_DGRAM)। Kernel নিজে থেকে একটা ফাঁকা Ephemeral Port বেছে দেয়, ধরুন 51514। কোনো Handshake হয় না, এখনো একটা Packet ও বের হয়নি।",
            },
            {
              title: "প্রশ্নটা লেখা হয়, সাথে একটা ID",
              description:
                "Client মোটামুটি ৪০ Byte এর একটা DNS প্রশ্ন বানায়, আর তাতে একটা এলোমেলো ১৬ Bit এর ID বসায়। উত্তর এলে এই ID দিয়েই মেলানো হবে। তারপর send ডাকে, গন্তব্য 1.1.1.1 আর Port 53।",
            },
            {
              title: "Kernel আট Byte এর Header পরায়",
              description:
                "Kernel প্রশ্নের সামনে UDP Header বসায়: Source Port 51514, Destination Port 53, Length 48, আর হিসাব করা Checksum। এটাই এখন একটা Datagram। send সাথে সাথে ফিরে আসে, সফল বলে।",
            },
            {
              title: "IP Packet আর Frame",
              description:
                "Datagram টা একটা IP Packet এর ভেতরে যায়: Source 192.168.1.20, Destination 1.1.1.1, Protocol 17 (মানে ভেতরে UDP)। গন্তব্য নিজের Network এর বাইরে, তাই Packet টা একটা Frame এ ভরে পাঠানো হয় Gateway র MAC c8:3a:35:4b:10:fe এ।",
            },
            {
              title: "Router এ NAT, আর একটা ঘড়ি",
              description:
                "Router Source বদলে করে 203.0.113.25, Port 51514, আর ছকে লিখে রাখে এই Port এর মালিক 192.168.1.20। Connection নেই বলে সে একটা ঘড়ি চালু করে। কিছুক্ষণ চুপ থাকলে সারিটা মুছে যাবে।",
            },
            {
              title: "পথ পাড়ি, কেউ কিছু মনে রাখে না",
              description:
                "Packet টা Router থেকে Router এ লাফিয়ে 1.1.1.1 এ পৌঁছায়। পথের কোনো Router UDP Header খোলে না, শুধু IP ঠিকানা দেখে পার করে দেয়। পথে হারালে কেউ কাউকে জানাবে না।",
            },
            {
              title: "Resolver উত্তর পাঠায়",
              description:
                "Resolver এর Kernel Checksum মিলিয়ে দেখে, Port 53 এ শুনতে থাকা Program কে Datagram টা দেয়, সাথে প্রেরকের ঠিকানা। Program উত্তর বানায়, একই ID বসিয়ে, আর ফেরত পাঠায় 203.0.113.25 এর Port 51514 এ। উত্তরটা মাত্র ৭২ Byte।",
            },
            {
              title: "Router ফেরত পথ চেনে",
              description:
                "উত্তর Router এ পৌঁছায়। ছকের সারিটা এখনো বেঁচে আছে, তাই Router গন্তব্য বদলে 192.168.1.20 এর Port 51514 করে ফোনে পাঠিয়ে দেয়।",
            },
            {
              title: "ফোন উত্তর পায়, ID মেলায়",
              description:
                "ফোনের Kernel Checksum দেখে, Port 51514 এর Socket এ Datagram টা দেয়, আস্ত, এক টুকরোয়। Client ID মিলিয়ে নিশ্চিত হয় এটা তারই প্রশ্নের উত্তর, আর পায় 103.94.135.2। Socket বন্ধ করে দেওয়া হয়, কাউকে বিদায় জানানো ছাড়াই।",
            },
            {
              title: "আর উত্তর না এলে",
              description:
                "কয়েক সেকেন্ডে উত্তর না এলে Client নিজেই একই প্রশ্ন আবার পাঠায়, বা পরের Resolver এ যায়। উত্তরে TC Flag থাকলে সে একই প্রশ্ন নিয়ে TCP তে যায়। এই দুইটা সিদ্ধান্তই Application এর, UDP র নয়।",
            },
            {
              title: "এবার আসল কাজ",
              description:
                "IP হাতে পেয়ে ব্রাউজার এবার 103.94.135.2 এর Port 443 এর সাথে একটা TCP Connection খুলতে যায়। সেটার প্রথম ধাপ Three-way Handshake, যা পরের লেসনের বিষয়।",
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
                <strong>নিজের যন্ত্রের UDP দেখুন</strong>, নিচের Lab এর শেষ
                পরীক্ষায় দেখবেন আপনার কম্পিউটারে এই মুহূর্তে কোন কোন Program UDP
                তে কথা বলছে। তালিকাটা যত লম্বা হবে ভাবেননি।
              </ListItem>
              <ListItem>
                <strong>RFC 768</strong>, UDP র মূল দলিল, মাত্র তিন পৃষ্ঠা। একটা
                Internet Protocol এর আসল দলিল পুরোটা পড়ে ফেলার এর চেয়ে সহজ সুযোগ
                আর নেই।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc768"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc768
                </a>
              </ListItem>
              <ListItem>
                <strong>Node.js, UDP/datagram sockets</strong>, এই লেসনের কোডে
                ব্যবহার করা dgram Module এর পুরো দলিল।{" "}
                <a
                  href="https://nodejs.org/api/dgram.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  nodejs.org/api/dgram.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare Learning, What is UDP</strong>, সহজ ভাষায় UDP
                আর UDP ভিত্তিক আক্রমণের ব্যাখ্যা।{" "}
                <a
                  href="https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cloudflare.com/learning
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare Learning, What is HTTP/3</strong>, QUIC কেন
                UDP র উপরে বানানো হলো তার গল্প, ছবি সহ।{" "}
                <a
                  href="https://www.cloudflare.com/learning/performance/what-is-http3/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cloudflare.com/learning/performance/what-is-http3
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 9000, QUIC</strong>, যাঁরা গভীরে যেতে চান। পুরোটা
                পড়ার দরকার নেই, শুরুর Overview অংশটুকুই যথেষ্ট।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc9000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc9000
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
                  UDP হলো IP র উপরে শুধু Port আর Checksum। Header আট Byte, ঘর
                  চারটা: Source Port, Destination Port, Length, Checksum।
                </ListItem>
                <ListItem>
                  TCP র Handshake, Sequence Number, ACK, Retransmission, Flow
                  Control আর Congestion Control, এর একটাও UDP তে নেই। Header এ
                  সেগুলোর ঘরই নেই।
                </ListItem>
                <ListItem>
                  Unreliable মানে প্রায়ই হারায় তা নয়। মানে হারালে UDP কিছু করে
                  না, আর জানায়ও না।
                </ListItem>
                <ListItem>
                  কেউ না শুনলেও send সফল হয়। UDP তে Error না পাওয়া কখনো পৌঁছানোর
                  প্রমাণ নয়।
                </ListItem>
                <ListItem>
                  UDP বার্তার সীমানা রাখে: এক send, এক Datagram, ওপাশে আস্ত
                  একটাই। TCP র Byte Stream এ এটা নেই।
                </ListItem>
                <ListItem>
                  UDP বাছার চার কারণ: দেরিতে আসা Data মূল্যহীন (Call, Game, NTP),
                  আয়োজন কাজের চেয়ে বড় (DNS), Connection সম্ভব নয় (DHCP), অথবা
                  নির্ভরযোগ্যতা নিজের শর্তে চাই (QUIC)।
                </ListItem>
                <ListItem>
                  DNS আগে UDP তে চেষ্টা করে। উত্তর না আঁটলে TC Flag আসে আর Client
                  TCP তে যায়। তাই Port 53 দুই Protocol এই খোলা চাই।
                </ListItem>
                <ListItem>
                  HTTP/3 চলে QUIC এ, QUIC চলে UDP 443 এ, আর QUIC নিজেই পুরো
                  নির্ভরযোগ্য। UDP র উপরে যা চলে তা অনির্ভরযোগ্য নাও হতে পারে।
                </ListItem>
                <ListItem>
                  নিজে UDP ব্যবহার করলে ID, Timeout, সীমিত Retry আর Idempotent
                  কাজ, এই চারটা আপনার দায়িত্ব।
                </ListItem>
                <ListItem>
                  Datagram 1200 Byte এর আশেপাশে রাখুন। 1472 এর উপরে গেলে
                  Fragmentation, আর এক টুকরো হারালে পুরোটা বাতিল।
                </ListItem>
                <ListItem>
                  NAT আর Firewall UDP র জন্য একটা ছোট ঘড়ি ধরে রাখে। লম্বা সময়
                  চালু রাখতে হলে Keepalive লাগে।
                </ListItem>
                <ListItem>
                  Handshake নেই বলে Source IP জাল করা সহজ, যা থেকে Amplification
                  Attack। দরকার ছাড়া কোনো UDP Port Internet এ খোলা রাখবেন না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে বারবার একটা কথা এসেছে: UDP তে Handshake নেই, আর তার জন্য
                কী কী হারাতে হয়, ঠিকানা যাচাই থেকে শুরু করে Port খোলা কি না বোঝা
                পর্যন্ত। এবার সেই Handshake কেই কাছ থেকে দেখার পালা। পরের লেসন
                Three-way Handshake এ দেখবেন SYN, SYN-ACK আর ACK এই তিনটা Packet
                এ ঠিক কী লেখা থাকে, তিনটাই কেন লাগে, দুইটায় কেন হয় না, আর
                Connection Refused আর Connection Timed Out এই দুই Error আসলে দুইটা
                সম্পূর্ণ আলাদা গল্প কেন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "মূল কথা", "মনে রাখার উপায়"],
    rows: [
      [
        "UDP কী",
        "IP র উপরে Port আর Checksum, এর বেশি কিছু নয়",
        "ডাকবাক্সে ফেলা পোস্টকার্ড",
      ],
      [
        "Header",
        "৮ Byte: Source Port, Destination Port, Length, Checksum",
        "চার ঘর, প্রতিটা ২ Byte",
      ],
      [
        "যা নেই",
        "Handshake, ক্রম, ACK, Retransmission, Flow আর Congestion Control",
        "Header এ ঘর নেই, তাই কাজও নেই",
      ],
      [
        "যা আছে, TCP তে নেই",
        "বার্তার সীমানা, আর Broadcast ও Multicast",
        "পাইপ নয়, আলাদা আলাদা বোতল",
      ],
      [
        "send সফল মানে",
        "Kernel হাতে নিয়েছে, পৌঁছেছে নয়",
        "কেউ না শুনলেও ok",
      ],
      [
        "DNS",
        "আগে UDP 53, উত্তর না আঁটলে TC Flag আর TCP 53",
        "দুই দরজাই খোলা রাখুন",
      ],
      [
        "QUIC, HTTP/3",
        "UDP 443 এর উপরে নিজে বানানো পুরো নির্ভরযোগ্যতা",
        "নির্ভরযোগ্যতা Kernel থেকে Application এ",
      ],
      [
        "নিজে করতে হয়",
        "ID, Timeout, সীমিত Retry, Idempotent কাজ",
        "চল্লিশ লাইনে ছোট্ট একটা TCP",
      ],
      [
        "আকার",
        "নিরাপদ 1200, পথের সীমা 1472, চূড়ান্ত সীমা 65507",
        "বেশি হলে Fragmentation বা EMSGSIZE",
      ],
      [
        "NAT, Firewall",
        "Connection নেই, তাই ছোট ঘড়ি ধরে আন্দাজ",
        "চুপ থাকলে সারি মুছে যায়, Keepalive লাগে",
      ],
      [
        "নিরাপত্তা",
        "Source IP জাল করা সহজ, তা থেকে Amplification",
        "UDP তে IP পরিচয়ের প্রমাণ নয়",
      ],
      [
        "কখন কোনটা",
        "সব Byte ক্রমে লাগলে TCP, দেরি মানে নষ্ট হলে UDP",
        "দ্বিধা থাকলে TCP",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "UDP Header এ কোন চারটা ঘর থাকে?",
        options: [
          {
            key: "A",
            text: "Source Port, Destination Port, Length, Checksum",
            isCorrect: true,
            explanation:
              "ঠিক। প্রতিটা ২ Byte, মোট ৮ Byte। এর বাইরে আর কিছুই নেই, আর UDP র সব আচরণ এখান থেকেই আসে।",
          },
          {
            key: "B",
            text: "Source Port, Destination Port, Sequence Number, Window",
            isCorrect: false,
            explanation:
              "Sequence Number আর Window TCP র ঘর। UDP তে এগুলো নেই বলেই ক্রম আর Flow Control নেই।",
          },
          {
            key: "C",
            text: "Source IP, Destination IP, Length, Checksum",
            isCorrect: false,
            explanation:
              "IP ঠিকানা থাকে IP Header এ, তার নিচের Layer এ। UDP Header এ থাকে Port।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা UDP Client এমন Port এ তিনটা বার্তা পাঠাল যেখানে কোনো Program শুনছে না। send এর ফল সাধারণত কী হয়?",
        options: [
          {
            key: "A",
            text: "প্রথমটাতেই Connection Refused",
            isCorrect: false,
            explanation:
              "এটা TCP র আচরণ, কারণ সেখানে Handshake ব্যর্থ হয়। UDP তে Handshake ই নেই।",
          },
          {
            key: "B",
            text: "তিনটাই সফল দেখায়, কোনো Error ছাড়া",
            isCorrect: true,
            explanation:
              "ঠিক। সফল মানে শুধু Kernel Datagram টা Network এ ছেড়ে দিয়েছে। পৌঁছাল কি না, UDP জানে না। Connected Socket হলে নিজের যন্ত্রে কখনো ECONNREFUSED আসতে পারে, কিন্তু তার উপর ভরসা করা যায় না।",
          },
          {
            key: "C",
            text: "Program টা উত্তরের অপেক্ষায় আটকে থাকে",
            isCorrect: false,
            explanation:
              "send কারো জন্য অপেক্ষা করে না। অপেক্ষা আর Timeout চাইলে Application কে নিজে বানাতে হয়।",
          },
        ],
      },
      {
        id: 3,
        text: "Video Call এ একটা টুকরো হারালে UDP র আচরণ কেন TCP র চেয়ে ভালো?",
        options: [
          {
            key: "A",
            text: "UDP হারানো টুকরো TCP র চেয়ে দ্রুত আবার পাঠায়",
            isCorrect: false,
            explanation: "UDP কখনোই কিছু আবার পাঠায় না।",
          },
          {
            key: "B",
            text: "UDP তে Packet কখনো হারায় না",
            isCorrect: false,
            explanation:
              "দুইটাই একই IP র রাস্তা দিয়ে যায়, হারানোর সম্ভাবনা একই।",
          },
          {
            key: "C",
            text: "TCP হারানো টুকরো না আসা পর্যন্ত পরের টুকরোগুলোও আটকে রাখে, UDP এগিয়ে যায়",
            isCorrect: true,
            explanation:
              "ঠিক। এটাই Head of Line Blocking। কলে দেরিতে আসা শব্দ কাজে লাগে না, তাই এক পলকের খটকা মেনে নিয়ে এগিয়ে যাওয়াই ভালো।",
          },
        ],
      },
      {
        id: 4,
        text: "dig এর উত্তরে flags এর মধ্যে tc দেখা গেল। এর মানে কী, আর এরপর কী হওয়ার কথা?",
        options: [
          {
            key: "A",
            text: "উত্তরটা একটা UDP Datagram এ আঁটেনি, তাই কাটা পড়েছে। Client একই প্রশ্ন TCP তে আবার করবে",
            isCorrect: true,
            explanation:
              "ঠিক। TC মানে Truncated। এই কারণে DNS সার্ভারের Port 53 UDP আর TCP দুইটাতেই খোলা থাকা চাই।",
          },
          {
            key: "B",
            text: "উত্তরটা TCP দিয়ে এসেছে",
            isCorrect: false,
            explanation: "উল্টো। tc বলছে UDP তে পুরোটা আসেনি, এবার TCP তে যেতে হবে।",
          },
          {
            key: "C",
            text: "উত্তরটা Cache থেকে এসেছে",
            isCorrect: false,
            explanation: "Cache এর সাথে tc র সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 5,
        text: "HTTP/3 UDP র উপরে চলে। তাহলে কি HTTP/3 তে খোলা Web Page এর Data হারাতে পারে?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, UDP অনির্ভরযোগ্য বলে মাঝে মাঝে হারায়",
            isCorrect: false,
            explanation:
              "UDP নিজে নিশ্চয়তা দেয় না, কিন্তু তার উপরের QUIC দেয়।",
          },
          {
            key: "B",
            text: "না। QUIC UDP র উপরে নিজে ক্রম, ACK আর Retransmission বানিয়ে নিয়েছে",
            isCorrect: true,
            explanation:
              "ঠিক। নির্ভরযোগ্যতার কাজটা Kernel এর TCP থেকে সরে Application এর QUIC এ এসেছে, হারিয়ে যায়নি।",
          },
          {
            key: "C",
            text: "না, কারণ HTTP/3 আসলে গোপনে TCP ব্যবহার করে",
            isCorrect: false,
            explanation:
              "HTTP/3 সত্যিই UDP 443 এ চলে। lsof দিয়ে নিজের ব্রাউজারেই দেখা যায়।",
          },
        ],
      },
      {
        id: 6,
        text: "আপনি UDP র উপরে Retry সহ একটা ব্যবস্থা বানালেন। কোন কাজটা এভাবে পাঠানো সবচেয়ে বিপজ্জনক?",
        options: [
          {
            key: "A",
            text: "একটা Domain এর IP জানতে চাওয়া",
            isCorrect: false,
            explanation: "দশবার জিজ্ঞেস করলেও উত্তর একই, কোনো ক্ষতি নেই।",
          },
          {
            key: "B",
            text: "সার্ভারের এখনকার সময় জানতে চাওয়া",
            isCorrect: false,
            explanation: "এটাও বারবার করা নিরাপদ।",
          },
          {
            key: "C",
            text: "হিসাব থেকে ৫০০ টাকা কাটার নির্দেশ",
            isCorrect: true,
            explanation:
              "ঠিক। উত্তর না এলে আপনি জানেন না প্রশ্নটা হারিয়েছে নাকি শুধু উত্তরটা। দ্বিতীয় ক্ষেত্রে Retry করলে টাকা দুইবার কাটবে। Retry শুধু Idempotent কাজে নিরাপদ।",
          },
        ],
      },
      {
        id: 7,
        text: "সাধারণ Ethernet এ (MTU 1500) Fragmentation ছাড়া একটা UDP Datagram এ সর্বোচ্চ কত Byte Data যায়, আর বাস্তবে কত রাখা ভালো?",
        options: [
          {
            key: "A",
            text: "সর্বোচ্চ 1472 (1500 থেকে IP র 20 আর UDP র 8 বাদ), আর বাস্তবে 1200 এর আশেপাশে",
            isCorrect: true,
            explanation:
              "ঠিক। পথে VPN বা Tunnel থাকলে MTU কমে যায়, তাই হাতে জায়গা রাখা হয়। QUIC আর DNS দুইটাই এই নিয়ম মানে।",
          },
          {
            key: "B",
            text: "সর্বোচ্চ 65507, আর সেটাই রাখা ভালো",
            isCorrect: false,
            explanation:
              "65507 তাত্ত্বিক সীমা। ওই আকারে Datagram চল্লিশের বেশি টুকরো হবে, আর একটা হারালেই পুরোটা বাতিল।",
          },
          {
            key: "C",
            text: "সর্বোচ্চ 1500, কারণ MTU 1500",
            isCorrect: false,
            explanation: "MTU র ভেতরে IP আর UDP Header এর জায়গাও ধরতে হয়।",
          },
        ],
      },
      {
        id: 8,
        text: "Amplification Attack UDP তে সম্ভব কিন্তু TCP তে প্রায় অসম্ভব কেন?",
        options: [
          {
            key: "A",
            text: "UDP র গতি বেশি বলে",
            isCorrect: false,
            explanation: "গতির সাথে সম্পর্ক নেই।",
          },
          {
            key: "B",
            text: "UDP তে Handshake নেই, তাই সার্ভার জাল Source IP যাচাই না করেই সেখানে বড় উত্তর পাঠিয়ে দেয়",
            isCorrect: true,
            explanation:
              "ঠিক। TCP তে জাল ঠিকানায় SYN-ACK চলে যায়, আক্রমণকারী সেটা দেখতে পায় না, তাই Handshake শেষ হয় না আর কোনো Data ও যায় না।",
          },
          {
            key: "C",
            text: "UDP তে Checksum নেই বলে",
            isCorrect: false,
            explanation: "UDP তে Checksum আছে, আর এর সাথে ঠিকানা জাল করার সম্পর্ক নেই।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "UDP কে নিজের হাতে ছুঁয়ে দেখুন",
    subtitle: "Terminal এ ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "DNS, দুই পথে",
        description:
          "একই প্রশ্ন UDP আর TCP তে পাঠান, তারপর ইচ্ছা করে উত্তর কাটিয়ে TC Flag আর TCP তে পালানো দেখুন।",
      },
      {
        title: "কেউ নেই, তবু সফল",
        description:
          "সার্ভার বন্ধ রেখে Client চালান। তারপর সার্ভার চালু করে বার্তার সীমানা নিজের চোখে দেখুন।",
      },
      {
        title: "nc দিয়ে হাতে লেখা Datagram",
        description:
          "কোনো কোড ছাড়া, শুধু nc দিয়ে নিজের সার্ভারে একটা Datagram পাঠান আর উত্তর নিন।",
      },
      {
        title: "নিজের বানানো Retry",
        description:
          "সার্ভার বন্ধ আর চালু, দুই অবস্থায় udp-retry চালান। Timeout আর চেষ্টার সংখ্যা বদলে দেখুন।",
      },
      {
        title: "আকারের সীমা খোঁজা",
        description:
          "ছোট থেকে বড় Datagram পাঠিয়ে দেখুন কোথায় গিয়ে EMSGSIZE আসে, আর আপনার MTU কত।",
      },
      {
        title: "আপনার যন্ত্রে এখন কে UDP তে কথা বলছে",
        description:
          "খোলা UDP Socket এর তালিকা, QUIC এর চলতি Connection, আর Kernel এর UDP হিসাব পড়ুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-dns-two-ways.sh",
        language: "bash",
        code: `# UDP (স্বাভাবিক)
dig +noall +answer +stats A example.com @1.1.1.1
# TCP (জোর করে)
dig +tcp +noall +answer +stats A example.com @1.1.1.1
# দুই উত্তর মিলিয়ে দেখুন। MSG SIZE কত?

# dig প্রশ্নের সাথে কত বড় UDP উত্তর নিতে রাজি বলে পাঠায়, আর সার্ভার কী বলে
dig +noall +comments A example.com @1.1.1.1 | grep "udp:"
# ; EDNS: version: 0, flags:; udp: 1232

# ইচ্ছা করে উত্তর কাটান
dig +notcp +ignore +bufsize=512 +noall +comments TXT google.com @8.8.8.8 | grep flags
# ;; flags: qr tc rd ra; ...        <- tc

# এবার dig কে নিজে সামলাতে দিন
dig +bufsize=512 TXT google.com @8.8.8.8 | grep -i "trunc\\|MSG SIZE"
# ;; Truncated, retrying in TCP mode.

# মৃত ঠিকানায় প্রশ্ন, UDP তে Timeout কেমন দেখায় (192.0.2.1 পরীক্ষার জন্য সংরক্ষিত)
time dig +tries=2 +timeout=1 A example.com @192.0.2.1
# ;; connection timed out; no servers could be reached
# মোট সময় প্রায় 2 সেকেন্ড: দুইবার চেষ্টা, প্রতিবার এক সেকেন্ড অপেক্ষা।
# এটাই Application এর নিজের Timeout আর Retry।`,
      },
      {
        filename: "2-nobody-home.sh",
        language: "bash",
        code: `# লেসনের udp-server.mjs আর udp-client.mjs একটা ফোল্ডারে রাখুন।
# দুই Terminal এই আগে এই দুই লাইন
export UDP_HOST=127.0.0.1
export UDP_PORT=41234

# Terminal ১, সার্ভার চালু না করেই
node udp-client.mjs
# sent "one" ok   sent "two" ok   sent "three" ok     <- কেউ শুনছে না, তবু ok

# Terminal ২
node udp-server.mjs
# listening on 127.0.0.1:41234

# Terminal ১, আবার
node udp-client.mjs
# এবার reply: echo: one, two, three

# Terminal ২ তে দেখুন: তিনটা আলাদা লাইন, 3, 3 আর 5 Byte।
# Variable না দিলে কী হয় সেটাও দেখুন
env -u UDP_HOST node udp-server.mjs
# Error: UDP_HOST and UDP_PORT must be set`,
      },
      {
        filename: "3-netcat-udp.sh",
        language: "bash",
        code: `# সার্ভার চালু রেখে। -u মানে UDP, -w 1 মানে এক সেকেন্ড পর ছেড়ে দাও
echo "hello from nc" | nc -u -w 1 127.0.0.1 41234
# echo: hello from nc

# সার্ভারের Terminal এ দেখবেন bytes 14। hello from nc তো 13 অক্ষর?
# বাড়তি একটা হলো echo র জোড়া লাইন শেষের চিহ্ন। Datagram হুবহু যা পাঠানো তাই।

# সার্ভার কোন Port ধরে আছে
lsof -nP -iUDP:41234
# node  20385  ...  UDP 127.0.0.1:41234

# এবার একটা ফাঁকা Port পরীক্ষা করুন
nc -vzu -w 2 127.0.0.1 41999
# Connection to 127.0.0.1 port 41999 [udp/*] succeeded!
# সেখানে কিছুই চলছে না, তবু succeeded। UDP Port পরীক্ষায় nc কে বিশ্বাস করা যায় না।`,
      },
      {
        filename: "4-retry.sh",
        language: "bash",
        code: `export UDP_HOST=127.0.0.1 UDP_PORT=41234
export UDP_TIMEOUT_MS=300 UDP_MAX_TRIES=3

# সার্ভার বন্ধ করুন (Ctrl+C), তারপর
node udp-retry.mjs
# try 1 ... try 2 ... try 3 ... gave up after 3 tries

# সার্ভার চালু করুন, তারপর
node udp-retry.mjs
# try 1 ... answer after 1 tries

# পরীক্ষা: UDP_TIMEOUT_MS=2000 করে চালু করুন, আর দ্বিতীয় চেষ্টার আগেই
# অন্য Terminal এ সার্ভার চালু করে দিন। উত্তর কয় নম্বর চেষ্টায় এলো?

# Connected UDP Socket এ ফাঁকা Port এর খবর পাওয়া (নিচের ফাইলটা বানিয়ে)
UDP_PORT=41999 node udp-connected.mjs
# sent ok
# error: ECONNREFUSED          <- নিজের যন্ত্রে ICMP ফিরে এসেছে

UDP_HOST=192.0.2.1 UDP_PORT=41999 node udp-connected.mjs
# sent ok                      <- দূরের ঠিকানায় কোনো খবরই ফেরে না`,
      },
      {
        filename: "udp-connected.mjs",
        language: "javascript",
        code: `import dgram from "node:dgram";

const host = process.env.UDP_HOST;
const port = Number(process.env.UDP_PORT);
if (!host || !Number.isInteger(port)) {
  throw new Error("UDP_HOST and UDP_PORT must be set");
}

const client = dgram.createSocket("udp4");

client.on("error", (err) => {
  console.log("error:", err.code);
  client.close();
});

// connect() কোনো Packet পাঠায় না, শুধু গন্তব্যটা Kernel এ মনে রাখায়।
client.connect(port, host, () => {
  client.send("anyone there?", (err) => {
    console.log("sent", err ? "error " + err.code : "ok");
  });
});

// আধা সেকেন্ড পর Program কে বের হতে দিন
setTimeout(() => client.unref(), 500);`,
      },
      {
        filename: "6-who-speaks-udp.sh",
        language: "bash",
        code: `# লেসনের udp-size.mjs চালান (সার্ভার চালু রেখে)
node udp-size.mjs
sysctl net.inet.udp.maxdgram        # macOS
ifconfig en0 | grep mtu             # macOS, Linux এ: ip link show

# এই মুহূর্তে কোন কোন Program এর UDP Socket খোলা
lsof -nP -iUDP | awk '{print $1, $9}' | sort | uniq -c | sort -rn | head
#   8 Google *:5353                  <- mDNS, বাসার Network এ যন্ত্র খোঁজা
#   1 Google 192.168.0.103:64662->142.251.154.119:443    <- QUIC

# শুধু QUIC
lsof -nP -iUDP | grep ":443"

# Kernel এর UDP হিসাব
netstat -s -p udp | head -16        # macOS
#   115492 datagrams received
#        0 with bad checksum
#     1437 dropped due to no socket          <- এমন Port এ এসেছিল যেখানে কেউ শুনছে না
#        0 dropped due to full socket buffers <- গ্রহীতা হাঁপিয়ে গিয়ে ফেলে দেওয়া

# Linux এ (এই যন্ত্রে চালানো হয়নি)
# ss -lunp            খোলা UDP Port আর তাদের Program
# netstat -su         UDP হিসাব, "receive buffer errors" লাইনটা দেখুন

# Packet গুলো নিজের চোখে (sudo লাগে, এই যন্ত্রে চালানো হয়নি)
# sudo tcpdump -n -i any udp port 53
# তারপর অন্য Terminal এ একটা dig চালান। দুইটা লাইন দেখবেন, প্রশ্ন আর উত্তর।`,
      },
    ],
    tip: "দুই নম্বর পরীক্ষাটা সবচেয়ে মন দিয়ে করুন। সার্ভার বন্ধ, তবু তিনবার ok, এই দৃশ্যটা একবার নিজের চোখে দেখলে UDP আর কখনো ভুল বুঝবেন না। এরপর যখনই কোনো Log এ দেখবেন Metric পাঠানো হয়েছে অথচ Dashboard ফাঁকা, বা VPN জোড়া লেগেছে বলছে অথচ কিছুই যাচ্ছে না, আপনি জানবেন প্রথম প্রশ্নটা কী হওয়া উচিত: ওপাশে আসলে কেউ শুনছে তো, আর মাঝের Firewall এ UDP র দরজাটা খোলা তো? আর শেষ পরীক্ষায় নিজের যন্ত্রের তালিকাটা দেখে প্রতিটা Port গুগল করে চিনে নিন। নিজের কম্পিউটার কার কার সাথে কথা বলে, এটা জানা একজন Engineer এর প্রথম অভ্যাস হওয়া উচিত।",
  },
  assignment: {
    title: "Mini Project: UDP দিয়ে একটা ছোট অবস্থা জানার Service",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>নিজের যন্ত্রের UDP মানচিত্র:</strong> নিজের কম্পিউটারে খোলা সব
        UDP Socket এর তালিকা বের করুন। প্রতিটা Port এর পাশে লিখুন কোন Program,
        কোন Protocol (যেমন mDNS, QUIC, DNS), আর সেটা UDP কেন, এই লেসনের চার
        কারণের কোনটা খাটে।
      </span>,
      <span key="2">
        <strong>Seat Service বানান:</strong> লেসনের udp-server.mjs কে বদলে একটা
        ছোট Service বানান। Client একটা নৌকার নাম পাঠালে সার্ভার ফেরত দেবে কয়টা
        আসন খালি (সংখ্যাগুলো একটা JSON ফাইল থেকে পড়ুন, যার পথ আসবে Environment
        Variable থেকে)। Client এ udp-retry র মতো ID, Timeout আর সীমিত Retry
        রাখুন। অচেনা নৌকার নাম এলে কী ফেরত দেবেন তা ঠিক করুন।
      </span>,
      <span key="3">
        <strong>ইচ্ছা করে Data হারান:</strong> সার্ভারে এমন ব্যবস্থা করুন যাতে
        সে প্রতি তিনটা প্রশ্নের একটা উপেক্ষা করে (হারের মানটা Environment
        Variable থেকে)। Client দশবার চালিয়ে লিখুন কয়বার প্রথম চেষ্টায়, কয়বার
        দ্বিতীয়তে, আর কয়বার পুরো ব্যর্থ। এরপর ভাবুন, এই একই Service দিয়ে আসন
        বুকিং (মানে আসন কমানো) করা কি নিরাপদ হতো? কেন নয়?
      </span>,
      <span key="4">
        <strong>DNS এর দুই পথ মাপুন:</strong> পাঁচটা Domain বেছে নিন। প্রতিটার A
        আর TXT Record UDP তে আর TCP তে জিজ্ঞেস করে MSG SIZE আর Query time একটা
        ছকে লিখুন। কোনটায় উত্তর 512 Byte ছাড়ায়? +bufsize=512 দিয়ে কোনগুলোতে tc
        Flag আসে?
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় লিখুন (৮ লাইন):</strong> আপনার দলের একজন বলছেন, আমাদের
        API ধীর, চলুন TCP বাদ দিয়ে UDP তে নিয়ে যাই, UDP তো দ্রুত। তাঁকে ভদ্রভাবে
        বোঝান এই যুক্তিতে ভুলটা কোথায়, UDP আসলে কী কী দেয় না, আর UDP র গতির
        সুবিধা আর নির্ভরযোগ্যতা দুইটাই চাইলে আসল পথটা কী।
      </span>,
    ],
    deliverables: [
      <span key="1">খোলা UDP Socket এর ছক: Port, Program, Protocol, UDP কেন</span>,
      <span key="2">Seat Service এর সার্ভার আর Client, কোনো মান কোডে গাঁথা নয়</span>,
      <span key="3">দশবারের ফলাফলের ছক, আর বুকিং কেন নিরাপদ নয় তার ব্যাখ্যা</span>,
      <span key="4">পাঁচ Domain এর UDP আর TCP তুলনার ছক</span>,
      <span key="5">সহকর্মীর জন্য উত্তর, ৮ লাইনে</span>,
    ],
  },
};
