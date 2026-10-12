 
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  EncapsulationLab,
  FragmentLab,
  HopRewriteLab,
} from "../../../components/course/topics/tcp/pdu-animations";
import {
  CaptureLineDiagram,
  MtuMssDiagram,
  NestedUnitsDiagram,
  PduNamesDiagram,
  TunnelOverheadDiagram,
} from "../../../components/course/topics/tcp/pdu-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const packetSegmentFrameContent: TopicData = {
  id: "packet-segment-frame",
  introduction: {
    badge: "MODULE 05 · LESSON 06",
    title: <SectionTitle>একই Data, তিনটা নাম, তিনটা মোড়ক</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এতদিন এই কোর্সে আমরা প্রায় সব জায়গায় একটাই শব্দ বলেছি, Packet। ফোন
          থেকে Packet বেরোল, Router Packet পাঠাল, Packet হারিয়ে গেল। অথচ আগের
          লেসনগুলোতে আপনি নিশ্চয়ই খেয়াল করেছেন, TCP র কথা এলে হঠাৎ শব্দটা হয়ে
          যায় Segment, UDP র বেলায় Datagram, আর Switch বা MAC এর কথা এলে Frame।
          Wireshark খুললে একই লাইনে তিনটা নামই দেখা যায়। তাহলে এরা কি তিনটা
          আলাদা জিনিস, নাকি একই জিনিসের তিন নাম?
        </ContentParagraph>
        <ContentParagraph>
          উত্তরটা মাঝামাঝি, আর সেই উত্তরটাই এই লেসন। এরা একই বার্তা, কিন্তু যাত্রার
          তিনটা আলাদা অবস্থায়। ঠিক যেমন একটা চিঠি প্রথমে খামে ঢোকে, খাম ঢোকে
          কুরিয়ারের ব্যাগে, ব্যাগ ওঠে ট্রাকে। চিঠি একটাই, কিন্তু যে যে অবস্থায়
          দেখছে সে সেই অবস্থার নামে ডাকছে। OSI আর TCP/IP Model এর লেসনে আপনি
          Layer গুলো চিনেছেন, TCP, UDP আর Handshake এর লেসনে Transport Layer এর
          ভেতরটা দেখেছেন। এবার সেই সব Layer কে একটা বার্তার গায়ে পরপর বসতে
          দেখবেন, Byte গুনে গুনে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি বলতে পারবেন কোন Layer এ জিনিসটার নাম কী আর কেন, একটা
          ১৪৬০ Byte এর Data তারে যেতে যেতে কীভাবে ১৫১৮ Byte হয়ে যায়, পথের প্রতিটা
          Router ঠিক কোন মোড়কটা ছিঁড়ে নতুন করে বানায় আর কোনটায় হাতই দেয় না, MTU
          আর MSS এর ১৫০০ আর ১৪৬০ সংখ্যা দুইটা কোথা থেকে এলো, Packet রাস্তার চেয়ে
          বড় হলে কী ঘটে, VPN চালু করলে কিছু সাইট আধখানা খুলে আটকে যায় কেন, আর
          tcpdump এর একটা লাইন কীভাবে বাইরে থেকে ভেতরে পড়তে হয়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "চিঠি খামে, খাম ব্যাগে, ব্যাগ ট্রাকে। পথে ট্রাক বদলায় দশবার, ব্যাগ বদলায় না, আর খামটা খোলে শুধু সেই মানুষ, যার নামে চিঠি।",
      author: "Encapsulation",
      role: "Lesson 06",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "one-thing-many-names",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা চিঠি, চারজন মানুষ, চারটা নাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরুন আপনি ঢাকা থেকে কক্সবাজারে এক বন্ধুকে একটা চিঠি পাঠাচ্ছেন।
                আপনি কাগজে লিখলেন, এটা আপনার কাছে চিঠি। সেটা একটা খামে ভরে উপরে
                লিখলেন কোন বাড়ির কোন মানুষের জন্য। কুরিয়ার অফিসের কর্মী সেই খামটা
                তাঁদের নিজেদের একটা প্যাকেটে ভরলেন, আর উপরে লিখলেন কোন শহরের কোন
                শাখায় যাবে। তাঁর কাছে এটা আর চিঠি নয়, এটা একটা চালান। তারপর সেই
                প্যাকেট উঠল একটা ট্রাকের বস্তায়, বস্তার গায়ে লেখা শুধু পরের
                স্টপের নাম। ট্রাকচালকের কাছে এটা একটা বস্তা, ভেতরে কী আছে তিনি
                জানেন না, জানার দরকারও নেই।
              </ContentParagraph>
              <ContentParagraph>
                চারজন মানুষ, চারটা নাম, অথচ ভেতরের কাগজটা একটাই। আর খেয়াল করুন,
                প্রত্যেকে শুধু নিজের মোড়কের গায়ের লেখাটুকু পড়েন। ট্রাকচালক বস্তার
                লেখা পড়েন, খামের ভেতরের চিঠি নয়। কুরিয়ার শাখা প্যাকেটের লেখা
                পড়ে, চিঠি নয়। চিঠি পড়েন শুধু আপনার বন্ধু।
              </ContentParagraph>
              <ContentParagraph>
                Network এ হুবহু এটাই ঘটে। OSI Model এর লেসনে দেখেছেন, কাজটা Layer
                এ ভাগ করা, প্রতিটা Layer এর একটাই দায়িত্ব। দায়িত্ব পালন করতে
                প্রতিটা Layer কে নিজের কিছু তথ্য লিখে দিতে হয়, যেমন ঠিকানা, ক্রম,
                মাপ। সেই তথ্য সে লেখে নিজের একটা মোড়কে, আর মোড়কটা জুড়ে দেয়
                উপরের Layer থেকে পাওয়া জিনিসটার গায়ে। মোড়ক লাগার পর জিনিসটাকে সে
                নিজের দেওয়া নামে ডাকে। তাই Layer যতগুলো, নামও ততগুলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "নামটা জিনিসের নয়, জিনিসটা এই মুহূর্তে কোন মোড়কে আছে তার",
          content: (
            <p>
              পুরো লেসনটা এই এক লাইনে ধরা যায়। Segment, Packet আর Frame তিনটা আলাদা
              বস্তু নয়। একই Data র গায়ে একটা মোড়ক থাকলে সেটা Segment, দুইটা থাকলে
              Packet, তিনটা থাকলে Frame। তাই কেউ যখন জিজ্ঞেস করে Packet আর Frame এর
              তফাত কী, আসল উত্তর হলো, Frame হলো সেই Packet, যার গায়ে Link Layer এর
              মোড়কটাও লেগে গেছে। এই কথাটা মাথায় বসে গেলে বাকি সব কিছু শুধু হিসাব।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই পুরো মডিউলের মতো এখানেও আমরা একটাই ঘটনা ধরে হাঁটব। ঢাকার একজন
              পর্যটক ফোনে islandtours.example খুলে নৌকার একটা আসন বুক করছেন।
              তাঁর ফোনের IP 192.168.1.20, Port 51514, MAC a4:83:e7:12:9c:01। বাসার
              Router এর ভেতরের IP 192.168.1.1, MAC c8:3a:35:4b:10:fe, আর বাইরের
              Public IP 203.0.113.25। Island Tours এর Server 103.94.135.2, Port
              443। এই সংখ্যাগুলো পুরো লেসনে একই থাকবে, তাই একবার চোখ বুলিয়ে নিন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "names",
      subHeader: { index: "002", title: "The Names" },
      title: <SectionTitle>কোন Layer এ কী নাম, একটা ছকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আগে নামগুলো এক জায়গায় দেখে নেওয়া যাক, তারপর প্রতিটা নিয়ে আলাদা করে
              কথা হবে। TCP/IP Model এর লেসনে চারটা Layer দেখেছিলেন, Application,
              Transport, Internet আর Link। এখানে তার সাথে সবার নিচে তারটাকেও
              রাখা হলো, কারণ শেষ পর্যন্ত সব কিছু সেখানেই ১ আর ০ হয়ে যায়।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PduNamesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Data বা Message:</strong> Application Layer এ আপনার
                  Program যা বানায়। একটা HTTP Request, একটা DNS প্রশ্ন, একটা Chat
                  এর বার্তা। এর গায়ে Network এর কোনো ঠিকানা নেই। আপনি যখন Code এ
                  কিছু পাঠান, আপনি এই স্তরেই কাজ করেন।
                </ListItem>
                <ListItem>
                  <strong>Segment:</strong> Data র গায়ে TCP Header লাগলে। নামটা
                  এসেছে টুকরো করা থেকে, কারণ TCP Deep Dive এর লেসনে দেখেছেন, TCP
                  একটা লম্বা Byte এর ধারাকে টুকরো টুকরো করে পাঠায়। প্রতিটা টুকরোই
                  একটা Segment।
                </ListItem>
                <ListItem>
                  <strong>Datagram:</strong> Data র গায়ে UDP Header লাগলে। UDP
                  Deep Dive এর লেসনে দেখেছেন, UDP টুকরো করে না, আপনি যে বার্তা
                  দেন সেটাকে একটা আস্ত একক হিসেবে পাঠায়। তাই এর নাম আলাদা।
                  Transport Layer এ তাই দুইটা নাম, কোন Protocol চলছে তার উপর
                  নির্ভর করে।
                </ListItem>
                <ListItem>
                  <strong>Packet:</strong> Segment বা Datagram এর গায়ে IP Header
                  লাগলে। এটাই সেই একক, যা এক যন্ত্র থেকে পৃথিবীর আরেক প্রান্তের
                  যন্ত্রে পৌঁছায়। Router রা এই স্তরেই কাজ করে।
                </ListItem>
                <ListItem>
                  <strong>Frame:</strong> Packet এর সামনে Link Layer এর Header আর
                  পেছনে একটা ছোট Trailer লাগলে। এটা শুধু একটা তারের এক মাথা থেকে
                  আরেক মাথা পর্যন্ত বাঁচে। Switch এই স্তরে কাজ করে।
                </ListItem>
                <ListItem>
                  <strong>Bits:</strong> Frame টা যখন তারে বিদ্যুৎ, Fiber এ আলো বা
                  বাতাসে Radio তরঙ্গ হয়ে যায়। Binary র লেসনের সেই ১ আর ০।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই নামগুলোর সবার একটা সাধারণ নামও আছে, বইপত্রে যা প্রায়ই দেখবেন।
                সেটা হলো PDU, পুরো কথায় Protocol Data Unit। মানে খুব সোজা, একটা
                Protocol যে একক ধরে কাজ করে। TCP র PDU হলো Segment, IP র PDU
                Packet, Ethernet এর PDU Frame। কেউ যদি বলে Layer 2 PDU, সে আসলে
                Frame বলছে। নতুন কিছু নয়, শুধু একটা সাধারণ ডাকনাম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "মুখের কথায় সবাই Packet বলে, আর সেটা ঠিক আছে",
          content: (
            <p>
              বাস্তবে Engineer রা সব কিছুকেই Packet বলে ফেলেন। Packet Loss, Packet
              Capture, Packet Sniffer, অথচ Wireshark আসলে ধরে Frame, আর হারায় Frame
              বা Packet যেকোনোটা। এটা ভুল নয়, এটা চলতি ভাষা, আর এই কোর্সের আগের
              লেসনগুলোতেও আমরা তাই করেছি। সঠিক নামটা দরকার হয় তখন, যখন আপনি বলতে
              চান সমস্যাটা ঠিক কোন Layer এ। Frame হারাচ্ছে বললে বোঝায় তার বা Wi-Fi
              এর সমস্যা। Segment আবার পাঠানো হচ্ছে বললে বোঝায় TCP টের পেয়েছে কিছু
              পৌঁছায়নি। নামটা তখন একটা ঠিকানার কাজ করে, সমস্যার ঠিকানা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "header-payload-trailer",
      subHeader: { index: "003", title: "Header, Payload, Trailer" },
      title: <SectionTitle>মোড়কের তিনটা শব্দ, যা সব জায়গায় লাগবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মোড়ক নিয়ে কথা বলতে তিনটা শব্দ বারবার আসবে। তিনটাই সহজ, কিন্তু
                একটু ভেবে দেখার মতো একটা ব্যাপার এদের মধ্যে লুকিয়ে আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Header:</strong> মোড়কের সামনের অংশ, যেখানে সেই Layer
                  নিজের দরকারি তথ্য লেখে। খামের সামনের দিকের ঠিকানার মতো। Header
                  সবসময় আগে যায়, কারণ যে যন্ত্র এটা পাবে তাকে মাল দেখার আগেই
                  জানতে হবে মালটা কার, আর এটা নিয়ে কী করতে হবে।
                </ListItem>
                <ListItem>
                  <strong>Payload:</strong> মোড়কের ভেতরের মাল। শব্দটা এসেছে
                  ভাড়ার মালবাহী গাড়ি থেকে, যে মালের জন্য ভাড়া দেওয়া হয় সেটাই
                  Payload, গাড়িটা নিজে নয়।
                </ListItem>
                <ListItem>
                  <strong>Trailer:</strong> মোড়কের পেছনের অংশ। চার Layer এর মধ্যে
                  শুধু Link Layer এর একটা Trailer আছে, যার নাম FCS, পুরো কথায়
                  Frame Check Sequence। এটা ৪ Byte এর একটা হিসাবের ফল, যা দিয়ে
                  বোঝা যায় পথে Frame এর কোনো Bit উল্টে গেছে কি না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার সেই ভাবার মতো ব্যাপারটা। Payload কোনো নির্দিষ্ট জিনিস নয়, এটা
                নির্ভর করে আপনি কোন Layer এর চোখ দিয়ে দেখছেন তার উপর। TCP র চোখে
                Payload হলো আপনার Data। IP র চোখে Payload হলো পুরো Segment টা, TCP
                Header সহ। Ethernet এর চোখে Payload হলো পুরো Packet টা, IP Header
                আর TCP Header দুইটাই সহ। অর্থাৎ উপরের Layer এর Header নিচের Layer
                এর কাছে শুধুই মাল, আলাদা করে চেনার কিছু নয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NestedUnitsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Header এ কী লেখা থাকে সেটা আপনি আগের লেসনগুলোতে আলাদা আলাদা
                করে দেখেছেন। এখানে তিনটাকে পাশাপাশি রাখলে একটা সুন্দর ছক বেরিয়ে
                আসে। প্রতিটা Header আসলে একটা করে প্রশ্নের উত্তর দেয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>TCP Header, ২০ Byte:</strong> প্রশ্নটা হলো, যন্ত্রের
                  ভেতরে কোন Program, আর এই টুকরোটা ক্রমে কোথায় বসবে। উত্তর দেয়
                  Source Port, Destination Port, Sequence Number, ACK Number, Flag
                  আর Window। TCP Deep Dive এর লেসনে প্রতিটা ঘর ধরে ধরে দেখেছেন।
                </ListItem>
                <ListItem>
                  <strong>IP Header, ২০ Byte:</strong> প্রশ্নটা হলো, পৃথিবীর কোন
                  যন্ত্র। উত্তর দেয় Source IP আর Destination IP। সাথে থাকে TTL,
                  মোট দৈর্ঘ্য, আর Protocol নামে একটা ঘর, যার কথা একটু পরেই আসছে।
                </ListItem>
                <ListItem>
                  <strong>Ethernet Header, ১৪ Byte:</strong> প্রশ্নটা হলো, এই
                  তারের ওপাশে ঠিক কোন যন্ত্র। উত্তর দেয় Destination MAC ৬ Byte,
                  Source MAC ৬ Byte, আর EtherType নামে ২ Byte এর একটা ঘর।
                </ListItem>
                <ListItem>
                  <strong>FCS, ৪ Byte:</strong> প্রশ্নটা হলো, পথে কিছু নষ্ট হয়েছে
                  কি। পাঠানো Network Card পুরো Frame এর উপর একটা হিসাব কষে ফলটা
                  শেষে জুড়ে দেয়। যে Card পায় সে একই হিসাব আবার কষে। না মিললে
                  Frame টা চুপচাপ ফেলে দেয়, কাউকে কিছু জানায় না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "২০ Byte হলো সবচেয়ে ছোট মাপ, সবসময়ের মাপ নয়",
          content: (
            <p>
              IP Header আর TCP Header দুইটারই মাপ কমপক্ষে ২০ Byte, কিন্তু দুইটাতেই
              বাড়তি কিছু ঘর জোড়া যায়, যাদের বলে Options। Three-way Handshake এর
              লেসনে দেখেছেন, SYN এর সাথে MSS, Window Scale আর SACK এর মতো Option
              যায়, তাই SYN এর TCP Header ২০ এর চেয়ে বড় হয়। আজকের বেশিরভাগ
              Connection এ প্রতিটা Segment এর সাথে Timestamp নামে একটা ১২ Byte এর
              Option ও যায়। এই লেসনে হিসাব সহজ রাখতে আমরা ২০ ধরে এগোব, আর যেখানে
              এই বাড়তি ১২ Byte আপনার চোখে পড়বে সেখানে আলাদা করে বলে দেব। Ethernet
              এরও একটা সর্বনিম্ন মাপ আছে, একটা Frame ৬৪ Byte এর ছোট হতে পারে না,
              তাই খুব ছোট Packet এর পেছনে Network Card নিজে কিছু ফাঁকা Byte জুড়ে
              মাপটা পুরিয়ে দেয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "encapsulation",
      subHeader: { index: "004", title: "Encapsulation" },
      title: <SectionTitle>পাঠানোর সময়, এক Layer নামলে এক মোড়ক বাড়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উপরের Layer এর জিনিসকে নিজের মোড়কে ভরে ফেলার এই কাজটার একটা নাম
                আছে, Encapsulation। শব্দটা এসেছে Capsule থেকে, ওষুধের ক্যাপসুলের
                মতো, ভেতরে আসল জিনিস আর বাইরে খোল। OSI Model এর লেসনে এর একটা ঝলক
                দেখেছিলেন, এবার পুরোটা Byte গুনে দেখা যাক।
              </ContentParagraph>
              <ContentParagraph>
                পর্যটক বুকিং এর বোতাম চাপলেন। ধরুন তাঁর Browser যে Data পাঠাবে
                সেটা ১৪৬০ Byte। এই সংখ্যাটা ইচ্ছা করেই নেওয়া, কেন তা MSS এর অংশে
                পরিষ্কার হবে। এই ১৪৬০ Byte এবার নিচে নামতে শুরু করল।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Application থেকে Transport:</strong> Browser একটা Socket
                  এ Data লিখল। OS Networking এর লেসনের সেই হাতে ধরা টেলিফোন। এখান
                  থেকে কাজ Kernel এর। TCP সামনে ২০ Byte এর Header বসাল। ১৪৬০ + ২০ =
                  ১৪৮০ Byte, নাম Segment।
                </ListItem>
                <ListItem>
                  <strong>Transport থেকে Internet:</strong> IP সামনে আরও ২০ Byte
                  এর Header বসাল। ১৪৮০ + ২০ = ১৫০০ Byte, নাম Packet।
                </ListItem>
                <ListItem>
                  <strong>Internet থেকে Link:</strong> Network Card এর Driver সামনে
                  ১৪ Byte এর Ethernet Header আর পেছনে ৪ Byte এর FCS বসাল। ১৪ + ১৫০০
                  + ৪ = ১৫১৮ Byte, নাম Frame।
                </ListItem>
                <ListItem>
                  <strong>Link থেকে তার:</strong> ১৫১৮ Byte মানে ১২১৪৪ Bit, যা
                  একটা একটা করে তারে বা বাতাসে বেরিয়ে গেল।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ১৪৬০ Byte কথা বলতে ৫৮ Byte মোড়ক লাগল, মানে মোটের প্রায় ৪ শতাংশ।
                খারাপ নয়। কিন্তু বার্তা ছোট হলে হিসাবটা উল্টে যায়, নিচের Lab এ
                নিজে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <EncapsulationLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "মোড়কের এই খরচ কেন আপনার জানা দরকার",
          content: (
            <p>
              Lab এ ৩২ Byte বেছে দেখেছেন, ৩২ Byte কথা পাঠাতে ৫৮ Byte মোড়ক লাগে,
              অর্থাৎ তারে যা যাচ্ছে তার প্রায় দুই তৃতীয়াংশই মোড়ক। আর TCP র যে ACK
              গুলো কোনো Data ছাড়াই যায়, সেগুলো পুরোটাই মোড়ক। এই কারণেই একটা বড়
              কাজ এক হাজারটা ছোট ছোট Request এ ভাগ করলে সেটা ধীর হয়, আর একই তথ্য
              কয়েকটা বড় Request এ পাঠালে দ্রুত হয়। আর এই কারণেই TCP Deep Dive এর
              লেসনে দেখা Nagle এর নিয়মটা ছোট ছোট লেখাকে একটু জমিয়ে একসাথে পাঠাতে
              চায়। সে আসলে মোড়কের খরচ বাঁচাচ্ছে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা জিনিস এখানে পরিষ্কার করে রাখা ভালো। পর্যটক যদি নৌকার ১ MB র
              একটা ছবি Upload করেন, সেটা একটা Segment এ ধরবে না। TCP সেটাকে ১৪৬০
              Byte এর টুকরোয় কাটবে। ১ MB মানে ১০৪৮৫৭৬ Byte, ভাগ ১৪৬০, অর্থাৎ ৭১৯টা
              Segment। প্রতিটার গায়ে আলাদা করে তিনটা মোড়ক লাগবে, আর প্রতিটা আলাদা
              Frame হয়ে তারে যাবে। Module 02 এর Packet এর লেসনে একগাদা পোস্টকার্ডের
              যে ছবিটা দেখেছিলেন, এটা সেই ছবিরই ভেতরের হিসাব।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "decapsulation",
      subHeader: { index: "005", title: "Decapsulation" },
      title: <SectionTitle>পাওয়ার সময়, মোড়ক খোলে উল্টো ক্রমে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Server এর দিকে ঠিক উল্টো কাজ হয়, যার নাম Decapsulation। সবার শেষে
                যে মোড়কটা লেগেছিল সেটা সবার আগে খোলে। উপরের Lab এ দিকটা উল্টে
                দিয়ে একবার দেখে নিন, তারপর নিচের প্রশ্নটা নিয়ে ভাবুন।
              </ContentParagraph>
              <ContentParagraph>
                প্রশ্নটা হলো, Network Card যখন Ethernet এর মোড়ক খুলল, সে কীভাবে
                জানল ভেতরের জিনিসটা কাকে দিতে হবে? ভেতরে তো IPv4 Packet থাকতে
                পারে, IPv6 Packet থাকতে পারে, আবার ARP এর একটা প্রশ্নও থাকতে পারে।
                একইভাবে IP যখন নিজের মোড়ক খুলল, সে কীভাবে জানল ভেতরে TCP আছে নাকি
                UDP?
              </ContentParagraph>
              <ContentParagraph>
                উত্তরটা হলো, প্রতিটা Header এ একটা করে ছোট ঘর আছে, যার একমাত্র কাজ
                বলে দেওয়া ভেতরে কী আছে। মোড়কের গায়ে লেখা একটা চিরকুটের মতো, ভেতরে
                কাচের জিনিস, বা ভেতরে কাগজপত্র।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Ethernet Header এর EtherType:</strong> 0x0800 মানে ভেতরে
                  IPv4 Packet, 0x86DD মানে IPv6, 0x0806 মানে ARP। ARP এর লেসনে যে
                  প্রশ্নটা পুরো Network এ ছড়িয়ে পড়তে দেখেছিলেন, সেটা Frame এর
                  ভেতরে সরাসরি বসে, কোনো IP Packet ছাড়াই, আর এই ঘরটাই সেটা চিনিয়ে
                  দেয়।
                </ListItem>
                <ListItem>
                  <strong>IP Header এর Protocol:</strong> 6 মানে ভেতরে TCP, 17
                  মানে UDP, 1 মানে ICMP, অর্থাৎ ping এর বার্তা।
                </ListItem>
                <ListItem>
                  <strong>TCP বা UDP Header এর Destination Port:</strong> 443 মানে
                  Data যাবে সেই Program এর কাছে, যে এই Port এ কান পেতে আছে। Port আর Socket
                  নিয়ে পরের লেসনটা পুরোটাই এই ঘর নিয়ে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তিনটা ঘর, তিনটা হাতবদল। এই তিনটা ঘর পরপর ঠিক থাকলেই একটা Frame তার
                থেকে উঠে ঠিক Program এর হাতে পৌঁছায়। এর যেকোনো একটায় গিয়ে আটকালে
                বার্তাটা সেখানেই ফেলে দেওয়া হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Bits থেকে Frame",
              description:
                "Server এর Network Card তার থেকে Bits নিয়ে একটা Frame জোড়া দিল। প্রথমে FCS মেলাল। না মিললে Frame এখানেই শেষ, উপরের কোনো Layer জানতেই পারবে না যে কিছু এসেছিল।",
            },
            {
              title: "MAC টা আমার তো",
              description:
                "Card এবার Destination MAC দেখল। নিজের MAC হলে বা Broadcast হলে রাখল, নইলে ফেলে দিল। তারপর EtherType এ 0x0800 দেখে Ethernet Header আর FCS খুলে ভেতরের Packet টা Kernel এর IP অংশের হাতে দিল।",
            },
            {
              title: "IP টা আমার তো",
              description:
                "IP আগে নিজের Header এর Checksum মেলাল, তারপর Destination IP দেখল। 103.94.135.2 এই Server এর নিজের IP, তাই রাখল। Protocol ঘরে 6 দেখে IP Header খুলে ভেতরের Segment টা TCP র হাতে দিল।",
            },
            {
              title: "কোন Connection এর",
              description:
                "TCP চারটা সংখ্যা মিলিয়ে দেখল, Source IP, Source Port, Destination IP, Destination Port। এই চারটা মিলে ঠিক একটা Connection চেনা যায়। তারপর Sequence Number দেখে Data টাকে সঠিক জায়গায় বসাল, আর একটা ACK ফেরত পাঠাল।",
            },
            {
              title: "Program এর হাতে শুধু Data",
              description:
                "TCP Header খুলে ফেলার পর বাকি রইল ১৪৬০ Byte Data। সেটা গেল সেই Socket এর Buffer এ, যেখান থেকে Server এর Program পড়ে। Program জানেই না এর গায়ে কখনো তিনটা মোড়ক ছিল।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "প্রতিটা Layer ওপাশের ঠিক নিজের জোড়াটার সাথেই কথা বলে",
          content: (
            <p>
              এখানে একটা সুন্দর জিনিস ঘটছে, যা একবার চোখে পড়লে Layer এর ধারণাটা
              পাকা হয়ে যায়। ফোনের TCP যে Header লিখেছিল, সেটা পড়ল শুধু Server এর
              TCP। ফোনের IP যে Header লিখেছিল, সেটা পড়ল পথের Router দের IP আর শেষে
              Server এর IP। ফোনের Network Card যে Header লিখেছিল, সেটা পড়ল শুধু
              বাসার Router এর Network Card। প্রতিটা Layer নিজের সমান স্তরের Layer
              এর জন্য চিঠি লেখে, আর নিচের Layer গুলো শুধু সেই চিঠি বয়ে নিয়ে যায়।
              TCP/IP Model এর লেসনে যাকে বলা হয়েছিল End to End, এটা তারই চেহারা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "hop-by-hop",
      subHeader: { index: "006", title: "Hop by Hop" },
      title: <SectionTitle>পথে কোন মোড়ক ছেঁড়ে, কোনটা টিকে থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনের সবচেয়ে জরুরি অংশ, আর যেখানে Module 03 এর প্রায় সব
                লেসন এসে এক জায়গায় মেলে। ফোন থেকে Server পর্যন্ত পথে অনেকগুলো
                Router আছে, How Data Travels এর লেসনে traceroute দিয়ে সেগুলো
                গুনেও দেখেছিলেন। প্রশ্ন হলো, তিনটা মোড়কের কোনটা এই পথে কতদূর
                পর্যন্ত বাঁচে।
              </ContentParagraph>
              <ContentParagraph>
                আবার সেই কুরিয়ারের ছবিতে ফিরি। ট্রাকের বস্তা প্রতিটা স্টপে খোলা
                হয়, আর মাল ওঠে নতুন ট্রাকের নতুন বস্তায়। কুরিয়ারের প্যাকেট পুরো
                পথে একই থাকে, শুধু প্রতিটা শাখায় তার গায়ে একটা সিল পড়ে। আর
                ভেতরের খামটা কেউ খোলেই না, যতক্ষণ না সেটা প্রাপকের হাতে যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Frame প্রতিটা তারে নতুন করে তৈরি হয়।</strong> MAC
                  Address এর লেসনে দেখেছেন, MAC শুধু একটা Network এর ভেতরে কাজ
                  করে। তাই ফোন Frame এ Destination হিসেবে Server এর MAC লিখতে
                  পারে না, সে তো সেটা জানেই না। Gateway এর লেসন অনুযায়ী সে লেখে
                  বাসার Router এর MAC, যা সে ARP করে জেনেছে। Router Frame টা পেয়ে
                  Ethernet এর মোড়ক পুরোটা ফেলে দেয়, ভেতরের Packet বের করে, তারপর
                  পরের তারের জন্য একদম নতুন একটা Frame বানায়, যেখানে Source তার
                  নিজের MAC আর Destination পরের Router এর MAC। পথে দশটা Router
                  থাকলে এগারোটা আলাদা Frame তৈরি হয়।
                </ListItem>
                <ListItem>
                  <strong>Packet পুরো পথ টিকে থাকে, দুইটা ব্যতিক্রম সহ।</strong>{" "}
                  Destination IP শুরু থেকে শেষ পর্যন্ত 103.94.135.2, কেউ এটা
                  বদলায় না। কিন্তু প্রতিটা Router দুইটা ছোট জিনিস ছোঁয়। সে TTL
                  এক কমায়, আর TTL বদলেছে বলে IP Header এর Checksum টা নতুন করে
                  কষে। আর একটা জায়গায় বড় বদল হয়। NAT এর লেসনে দেখেছেন, বাসার
                  Router Source IP টা 192.168.1.20 থেকে বদলে নিজের Public IP
                  203.0.113.25 করে দেয়, কারণ Private IP Internet এ চলে না।
                </ListItem>
                <ListItem>
                  <strong>Segment পথে কেউ খোলে না।</strong> সাধারণ Router এর কাজ
                  IP Header পর্যন্ত, এর ভেতরে কী আছে তা দেখার দরকার তার নেই।
                  Sequence Number, ACK, আর আসল Data ফোন থেকে বেরোনোর সময় যা ছিল,
                  Server এ পৌঁছানোর সময়ও হুবহু তাই। এই কারণেই TCP র নির্ভরযোগ্যতার
                  পুরো কাজটা দুই মাথার দুই যন্ত্র করে, মাঝের কেউ নয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HopRewriteLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "কেউ খোলে না কথাটার সৎ সংস্করণ",
          content: (
            <p>
              Lab এ খেয়াল করেছেন, দ্বিতীয় তারে Source Port টাও বদলে গেছে, অথচ Port
              থাকে Segment এর Header এ। তাহলে Segment কেউ খোলে না কথাটা পুরো সত্যি
              নয়। সঠিক কথাটা হলো, নকশা অনুযায়ী পথের Router দের Segment খোলার কথা
              নয়, কিন্তু বাস্তবে কয়েকটা যন্ত্র ইচ্ছা করেই খোলে। NAT করা Router
              Source Port বদলায়, যাতে একই Public IP র পেছনের অনেক যন্ত্রকে আলাদা
              রাখা যায়। Firewall Port দেখে ঠিক করে ঢুকতে দেবে কি না। Layer 4 Load
              Balancer Port দেখে ঠিক করে কোন Server এ পাঠাবে। এদের সবাইকে একসাথে
              Middlebox বলা হয়। তবে এরাও শুধু Header এর কয়েকটা ঘর ছোঁয়। আসল Data
              র দিকে তাকায় শুধু সেইসব যন্ত্র, যারা Layer 7 এ কাজ করে, যেমন একটা
              Reverse Proxy, আর HTTPS এ সেই Data ও Encrypt করা থাকে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই একটা ছবি থেকে আগের অনেক লেসনের কেন গুলো একসাথে মিলে যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>দুই রকম ঠিকানা কেন লাগে:</strong> IP বলে শেষ গন্তব্য
                  কোথায়, MAC বলে এই মুহূর্তে পরের পা কোথায়। একটা পুরো পথের জন্য,
                  অন্যটা একটা ধাপের জন্য। তাই একটা Packet এ, আর অন্যটা Frame এ।
                </ListItem>
                <ListItem>
                  <strong>ARP কেন প্রতিটা Network এ আলাদা:</strong> কারণ প্রতিটা
                  তারে নতুন Frame বানাতে পরের যন্ত্রের MAC জানতে হয়, আর সেটা
                  জানার উপায় ARP।
                </ListItem>
                <ListItem>
                  <strong>Server কেন আপনার ফোনের MAC জানে না:</strong> কারণ ফোনের
                  MAC ছিল প্রথম Frame এ, আর সেই Frame প্রথম Router এই শেষ। Server
                  এর কাছে যে Frame পৌঁছায় তার Source MAC হলো শেষ Router এর।
                </ListItem>
                <ListItem>
                  <strong>Server কেন আপনার Private IP দেখে না:</strong> কারণ NAT
                  সেটা Packet থেকে মুছে নিজের Public IP বসিয়ে দিয়েছে। Server এর
                  Log এ তাই 203.0.113.25 থাকে, 192.168.1.20 নয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "ttl",
      subHeader: { index: "007", title: "TTL" },
      title: <SectionTitle>TTL, Packet এর গায়ের একটা গুনতি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Router যে TTL এক কমায়, সেটা একটু আলাদা করে দেখার মতো,
                কারণ এটা নিজের চোখে দেখা যায়। TTL এর পুরো কথা Time To Live। DNS
                এর লেসনেও TTL শব্দটা পেয়েছিলেন, সেখানে মানে ছিল একটা উত্তর কত
                সেকেন্ড Cache এ থাকবে। এখানে নাম একই হলেও জিনিসটা আলাদা। IP
                Header এর TTL সেকেন্ড নয়, এটা একটা গুনতি, আর কয়টা Router পেরোনো
                যাবে।
              </ContentParagraph>
              <ContentParagraph>
                দরকারটা কী? ধরুন দুইটা Router এর পথের তালিকায় ভুল আছে, একজন ভাবছে
                গন্তব্য অন্যজনের দিকে, অন্যজন ভাবছে প্রথমজনের দিকে। Packet টা তখন
                দুইজনের মধ্যে চিরকাল ঘুরতে থাকত, আর এরকম হাজার Packet মিলে পুরো
                Network জ্যাম করে দিত। TTL এটা থামায়। যন্ত্র Packet ছাড়ার সময়
                একটা সংখ্যা বসায়, সাধারণত ৬৪, কিছু যন্ত্রে ১২৮ বা ২৫৫। প্রতিটা
                Router সেটা এক কমায়। যার হাতে গিয়ে শূন্য হয়, সে Packet ফেলে দেয়
                আর পাঠানো যন্ত্রকে একটা ICMP বার্তা ফেরত দেয়, Time to live
                exceeded।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ttl.sh",
          code: `# স্বাভাবিক ping, উত্তরের ttl ঘরটা দেখুন
ping -c 1 1.1.1.1
#   64 bytes from 1.1.1.1: icmp_seq=0 ttl=58 time=3.745 ms
# 1.1.1.1 উত্তরটা ছেড়েছিল 64 দিয়ে। পৌঁছাল 58 হয়ে।
# 64 - 58 = 6, অর্থাৎ ফেরার পথে ছয়টা Router পেরিয়েছে।

# এবার নিজে TTL বেঁধে দিন মাত্র 1
ping -c 1 -m 1 1.1.1.1        # macOS
ping -c 1 -t 1 1.1.1.1        # Linux
#   92 bytes from 192.168.0.1: Time to live exceeded
# প্রথম Router ই, মানে আপনার নিজের Gateway, TTL শূন্য করে ফেলে দিল
# আর নিজের ঠিকানা থেকে খবরটা পাঠাল।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দ্বিতীয় কমান্ডটা দেখে কিছু মনে পড়ছে? How Data Travels এর লেসনের
              traceroute ঠিক এই কৌশলেই চলে। সে প্রথমে TTL ১ দিয়ে পাঠায়, প্রথম
              Router ধরা পড়ে। তারপর TTL ২, দ্বিতীয় Router ধরা পড়ে। এভাবে এক এক
              করে পুরো পথের সব Router নিজের নাম বলে দেয়। তখন আপনি কমান্ডটা
              চালিয়েছিলেন, এখন জানলেন সে ভেতরে Packet এর কোন ঘরটা নিয়ে খেলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "উত্তরের ttl দেখে ওপাশের যন্ত্র সম্পর্কে একটা আন্দাজ",
          content: (
            <p>
              ping এর উত্তরে ttl ৬৪ এর একটু নিচে হলে ওপাশের যন্ত্র সম্ভবত Linux বা
              macOS, কারণ তারা ৬৪ দিয়ে শুরু করে। ১২৮ এর একটু নিচে হলে সম্ভবত
              Windows। ২৫৫ এর একটু নিচে হলে সম্ভবত একটা Router বা Network এর
              যন্ত্র। এটা প্রমাণ নয়, শুধু একটা ইশারা, কারণ সংখ্যাটা বদলে রাখা যায়।
              তবে একটা কাজের ব্যবহার আছে। একই Server এ ping করে হঠাৎ একদিন ttl
              আগের চেয়ে অনেক আলাদা দেখলে বুঝবেন পথটা বদলেছে, বা মাঝখানে নতুন কিছু
              বসেছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "mtu",
      subHeader: { index: "008", title: "MTU" },
      title: <SectionTitle>MTU, একটা Frame এ কতটুকু ধরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ ১৫০০ আর ১৪৬০ সংখ্যা দুইটা বারবার এসেছে, ব্যাখ্যা ছাড়াই।
                এবার এদের পালা। শুরু করি একটা সেতুর ছবি দিয়ে। সেতুর মুখে একটা
                সাইনবোর্ড, সর্বোচ্চ উচ্চতা ৩ মিটার। এর চেয়ে উঁচু ট্রাক এই সেতু
                দিয়ে যেতে পারবে না, ট্রাকে কী মাল আছে তাতে কিছু আসে যায় না।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা তারের, বা আরও ঠিক করে বললে প্রতিটা Link এর, এরকম একটা
                সীমা আছে। তার নাম MTU, পুরো কথায় Maximum Transmission Unit। মানে,
                এই Link এর একটা Frame এর ভেতরে সর্বোচ্চ কত বড় একটা Packet ধরে।
                সাধারণ Ethernet এ সংখ্যাটা ১৫০০ Byte, আর Wi-Fi ও সাধারণত একই
                সংখ্যা মেনে চলে।
              </ContentParagraph>
              <ContentParagraph>
                ১৫০০ কেন, এর পেছনে কোনো গভীর গণিত নেই। ১৯৮০ র দশকে Ethernet এর
                নকশা করার সময় এটা একটা আপসের সংখ্যা ছিল। Frame খুব বড় হলে একটা
                যন্ত্র অনেকক্ষণ তার দখল করে রাখত, আর একটা Bit নষ্ট হলে পুরো বড়
                Frame আবার পাঠাতে হতো। খুব ছোট হলে মোড়কের খরচ বেড়ে যেত, যা আপনি
                আগের Lab এ দেখেছেন। ১৫০০ মাঝামাঝি একটা জায়গা, আর তারপর থেকে
                পৃথিবীর এত যন্ত্র এই সংখ্যা ধরে তৈরি হয়েছে যে এটা আর বদলানো যায়নি।
              </ContentParagraph>
              <ContentParagraph>
                একটা সূক্ষ্ম জিনিস, যা প্রায় সবাই ভুল করে। MTU মাপে Packet এর
                মাপ, Frame এর নয়। ১৫০০ এর মধ্যে IP Header পড়ে, TCP Header পড়ে,
                Data পড়ে। কিন্তু Ethernet এর নিজের ১৪ Byte এর Header আর ৪ Byte এর
                FCS পড়ে না। তাই MTU ১৫০০ হলে তারে যাওয়া Frame টা আসলে ১৫১৮ Byte।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "see-mtu.sh",
          code: `# macOS: প্রতিটা Network Interface এর MTU
ifconfig | grep mtu
#   lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
#   en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500

# macOS: একটা নির্দিষ্ট Interface এর
networksetup -getMTU en0
#   Active MTU: 1500 (Current Setting: 1500)

# Linux
ip link show
#   2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ...

# Windows (PowerShell বা cmd)
netsh interface ipv4 show subinterfaces`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফলাফলে দুইটা জিনিস চোখে পড়ার কথা। en0, অর্থাৎ আপনার Wi-Fi বা
                Ethernet, দেখাচ্ছে ১৫০০। কিন্তু lo0 দেখাচ্ছে ১৬৩৮৪। lo0 হলো
                Loopback, OS Networking এর লেসনের সেই localhost, যা কখনো যন্ত্রের
                বাইরে যায় না। এখানে কোনো আসল তার নেই, কোনো সেতু নেই, তাই সীমাটা
                অনেক বড় রাখা যায়। Linux এ এটা সাধারণত ৬৫৫৩৬। এটা একটা ভালো
                প্রমাণ যে MTU তারের ধর্ম, IP র নয়।
              </ContentParagraph>
              <ContentParagraph>
                আর এখান থেকেই পরের সমস্যাটা আসে। আপনার ফোন থেকে Server পর্যন্ত
                পথে অনেকগুলো আলাদা Link আছে, আর প্রতিটার MTU আলাদা হতে পারে।
                পুরো পথে যে Link এর MTU সবচেয়ে ছোট, সেটাই ঠিক করে দেয় আসলে কত বড়
                Packet এ মাথা থেকে ও মাথা যেতে পারবে। এই সংখ্যাটার নাম Path MTU।
                একটা রাস্তায় দশটা সেতু থাকলে সবচেয়ে নিচু সেতুটাই ঠিক করে কোন
                ট্রাক পুরো পথ যেতে পারবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Jumbo Frame, ৯০০০ Byte এর MTU",
          content: (
            <p>
              Data Center এর ভেতরে, যেখানে সব যন্ত্র একই মালিকের আর সব তার একই
              মানের, সেখানে MTU বাড়িয়ে প্রায় ৯০০০ করা হয়। একে বলে Jumbo Frame।
              লাভ হলো একই Data কম সংখ্যক Frame এ যায়, তাই মোড়কের খরচ আর প্রতিটা
              Frame সামলানোর খাটুনি দুইটাই কমে। কিছু Cloud এর ভেতরের Network এ
              এটা আগে থেকেই চালু থাকে, তাই Cloud এর একটা Server এ MTU ৯০০১ দেখলে
              অবাক হবেন না। কিন্তু মনে রাখুন, Jumbo Frame শুধু সেই চৌহদ্দির ভেতরে
              কাজ করে। Packet টা Internet এ বেরোলেই আবার ১৫০০ র দুনিয়া।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "mss",
      subHeader: { index: "009", title: "MSS" },
      title: <SectionTitle>MSS, TCP কীভাবে আগে থেকেই মাপমতো কাটে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সেতুর উচ্চতা জানা থাকলে বুদ্ধিমান চালক কী করেন? তিনি গুদামেই মাল
                এমনভাবে সাজান, যাতে ট্রাকের উচ্চতা সীমার ভেতরে থাকে। সেতুর মুখে
                গিয়ে মাল নামানোর চেয়ে এটা অনেক ভালো। TCP ঠিক এই কাজটাই করে, আর
                যে সংখ্যা ধরে করে তার নাম MSS, পুরো কথায় Maximum Segment Size।
              </ContentParagraph>
              <ContentParagraph>
                MSS মানে, একটা Segment এ সর্বোচ্চ কত Byte Data থাকতে পারবে। হিসাবটা
                সোজা। Packet হতে পারবে সর্বোচ্চ ১৫০০। তার মধ্যে IP Header নেবে ২০,
                TCP Header নেবে ২০। বাকি থাকে ১৪৬০। এটাই সেই সংখ্যা, যা আমরা
                Encapsulation এর উদাহরণে ইচ্ছা করে নিয়েছিলাম, কারণ এটা একটা ভরা
                Segment।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MtuMssDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুই পক্ষ এই সংখ্যাটা জানে কীভাবে? Three-way Handshake এর লেসনে
                দেখেছেন, SYN আর SYN-ACK এর সাথে কিছু Option যায়, আর তার একটা হলো
                MSS। ফোন SYN এ বলে, আমাকে একটা Segment এ ১৪৬০ Byte এর বেশি পাঠাবেন
                না। Server SYN-ACK এ নিজের সংখ্যাটা বলে। প্রত্যেকে নিজের
                Interface এর MTU থেকে ৪০ বিয়োগ করে সংখ্যাটা বের করে। তারপর পুরো
                Connection জুড়ে প্রত্যেকে অন্য পক্ষের বলা সীমাটা মেনে চলে।
              </ContentParagraph>
              <ContentParagraph>
                এবার দুইটা সংখ্যার তফাতটা পরিষ্কার করে বলা যায়, কারণ Interview এ
                আর বাস্তবে দুই জায়গাতেই এটা গুলিয়ে যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>MTU কার সীমা:</strong> Link এর, অর্থাৎ তারের। মাপে পুরো
                  Packet। ঠিক করে Network Interface এর Setting। সব রকম Packet এর
                  উপর খাটে, TCP, UDP, ICMP সব।
                </ListItem>
                <ListItem>
                  <strong>MSS কার সীমা:</strong> TCP র। মাপে শুধু Data, কোনো Header
                  নয়। ঠিক হয় Handshake এর সময় দুই পক্ষের কথায়। শুধু TCP র উপর
                  খাটে। UDP র এরকম কোনো সংখ্যা নেই, যে কারণে UDP Deep Dive এর
                  লেসনে বলা হয়েছিল Datagram ছোট রাখার দায়িত্ব Application এর
                  নিজের।
                </ListItem>
                <ListItem>
                  <strong>সম্পর্ক:</strong> MSS = MTU বিয়োগ ৪০। IPv6 এ IP Header
                  ৪০ Byte, তাই সেখানে MSS = MTU বিয়োগ ৬০, অর্থাৎ ১৪৪০।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Capture এ ১৪৬০ এর বদলে ১৪৪৮ দেখলে ঘাবড়াবেন না",
          content: (
            <p>
              নিজে কখনো tcpdump বা Wireshark চালালে দেখবেন, ভরা Segment গুলোর
              length প্রায়ই ১৪৬০ নয়, ১৪৪৮। কারণ সেই Timestamp Option, যার কথা
              একটু আগে বলা হয়েছিল। আজকের প্রায় সব Connection প্রতিটা Segment এর
              TCP Header এ ১২ Byte এর এই বাড়তি ঘর জুড়ে দেয়, ফলে Header হয় ৩২
              Byte, আর Data র জন্য থাকে ১৫০০ বিয়োগ ২০ বিয়োগ ৩২, অর্থাৎ ১৪৪৮।
              Handshake এ ঘোষণা করা MSS তখনো ১৪৬০ ই থাকে, কারণ MSS এর হিসাবে
              Option ধরা হয় না। দুইটা সংখ্যাই ঠিক, শুধু ১২ Byte এর এই ব্যাখ্যাটা
              জানা থাকলে আর খটকা লাগে না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "fragmentation",
      subHeader: { index: "010", title: "Fragmentation" },
      title: <SectionTitle>Packet যদি রাস্তার চেয়ে বড় হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TCP আগে থেকে মাপমতো কাটে, ভালো কথা। কিন্তু সব সময় তো সেটা সম্ভব
                নয়। UDP র কোনো MSS নেই, Application ৩০০০ Byte এর একটা Datagram
                দিলে সে সেটাই পাঠাতে চাইবে। আবার TCP র বেলাতেও, ফোন জানে নিজের
                Interface এর MTU ১৫০০, কিন্তু পথের মাঝখানে কোথাও যে ১৪০০ র একটা
                সরু Link আছে, সেটা সে জানবে কীভাবে? তাহলে ১৫০০ Byte এর একটা Packet
                ১৪০০ র সেতুর মুখে পৌঁছালে কী হবে?
              </ContentParagraph>
              <ContentParagraph>
                IPv4 এর পুরনো উত্তর হলো Fragmentation। যে Router এর সামনে সরু
                Link টা পড়েছে, সে Packet টাকে কয়েক টুকরো করে। প্রতিটা টুকরো নিজে
                একটা পূর্ণ Packet, নিজের IP Header সহ, যাতে পথের বাকি Router রা
                তাদের আলাদা আলাদা করে এগিয়ে দিতে পারে। টুকরোগুলোকে বলে Fragment।
                আবার জোড়া লাগানোর জন্য IP Header এর তিনটা ঘর ব্যবহার হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Identification:</strong> একটা সংখ্যা, যা মূল Packet এর
                  সব Fragment এ একই থাকে। এটা দেখে গন্তব্য বোঝে কোন কোন টুকরো
                  একই Packet এর।
                </ListItem>
                <ListItem>
                  <strong>MF, More Fragments:</strong> এক Bit এর একটা পতাকা। ১
                  মানে এর পরেও টুকরো আছে, ০ মানে এটাই শেষ টুকরো।
                </ListItem>
                <ListItem>
                  <strong>Fragment Offset:</strong> এই টুকরোর Data মূল Packet এর
                  কোন জায়গা থেকে শুরু। এই ঘরটা ৮ Byte এর এককে গোনে, তাই শেষটা
                  ছাড়া প্রতিটা টুকরোর Data র মাপ ৮ এর গুণিতক হতে হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা জরুরি কথা, টুকরোগুলো জোড়া লাগে শুধু শেষ গন্তব্যে। পথের কোনো
                Router এগুলো আবার জোড়ে না, এমনকি পরের Link চওড়া হলেও না। একবার
                ভাঙলে বাকি পুরো পথ ভাঙা অবস্থাতেই যায়। নিচে নিজে মাপ বদলে দেখুন
                কয় টুকরো হয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FragmentLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Lab এ ৩০০৮ Byte আর MTU ১৫০০ বেছে নিলে তিন টুকরো পাবেন, ১৪৮০, ১৪৮০ আর
              ৪৮। এই সংখ্যাটা ইচ্ছা করে রাখা, কারণ এটা আপনি নিজের যন্ত্রে এখনই
              ঘটাতে পারেন। ping এ ৩০০০ Byte Data দিলে তার সাথে ICMP র ৮ Byte Header
              মিলে হয় ৩০০৮, যা ১৫০০ র MTU তে কিছুতেই ধরে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "fragment.sh",
          code: `# আগে গুনে রাখুন এখন পর্যন্ত কত Fragment তৈরি হয়েছে (macOS)
netstat -s -p ip | grep -i fragment
#   10 fragments received
#   2 output datagrams fragmented
#   6 fragments created

# 3000 Byte Data দিয়ে ping, কোনো বাড়তি পতাকা ছাড়া
ping -c 2 -s 3000 1.1.1.1
#   PING 1.1.1.1 (1.1.1.1): 3000 data bytes
#   3008 bytes from 1.1.1.1: icmp_seq=0 ttl=58 time=6.528 ms
#   3008 bytes from 1.1.1.1: icmp_seq=1 ttl=58 time=6.295 ms
# উত্তর এসেছে, অথচ 3008 Byte তো 1500 তে ধরে না।
# আপনার যন্ত্র নিজেই প্রতিটাকে ভেঙে পাঠিয়েছে, আর ওপাশ জোড়া লাগিয়েছে।

# আবার গুনুন, সংখ্যাগুলো বেড়েছে
netstat -s -p ip | grep -i fragment

# Linux এ একই গুনতি
netstat -s | grep -i -E "fragment|reassembl"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কাজ তো হলো, তাহলে Fragmentation কে সবাই এত অপছন্দ করে কেন? কারণ
                চারটা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা হারালে সব হারায়।</strong> তিন টুকরোর একটা পথে
                  হারালে গন্তব্য বাকি দুইটা নিয়ে কিছুই করতে পারে না, কিছুক্ষণ
                  অপেক্ষা করে সেগুলোও ফেলে দেয়। তখন পুরো মূল Packet আবার পাঠাতে
                  হয়। ফলে হারানোর সম্ভাবনা কয়েক গুণ বেড়ে যায়।
                </ListItem>
                <ListItem>
                  <strong>খাটুনি বেশি।</strong> ভাঙতে Router এর আর জুড়তে গন্তব্যের
                  বাড়তি Memory আর CPU লাগে। গন্তব্যকে প্রতিটা অসম্পূর্ণ Packet এর
                  টুকরো ধরে বসে থাকতে হয়।
                </ListItem>
                <ListItem>
                  <strong>Firewall আর NAT এর অসুবিধা।</strong> TCP বা UDP Header
                  থাকে শুধু প্রথম টুকরোয়। বাকি টুকরোগুলোতে কোনো Port নেই। যে
                  Firewall বা NAT Port দেখে সিদ্ধান্ত নেয়, সে পরের টুকরোগুলো নিয়ে
                  কী করবে বুঝে উঠতে পারে না, আর অনেকে নিরাপদ থাকতে সব Fragment ই
                  ফেলে দেয়।
                </ListItem>
                <ListItem>
                  <strong>আক্রমণের সুযোগ।</strong> ইচ্ছা করে অসম্পূর্ণ বা একটার
                  উপর আরেকটা চড়ানো Fragment পাঠিয়ে গন্তব্যের Memory ভরিয়ে ফেলার
                  পুরনো কিছু আক্রমণ আছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই কারণেই IPv6 এ নিয়মটা বদলে দেওয়া হয়েছে। সেখানে পথের Router রা
                কখনো Packet ভাঙে না। ভাঙতে হলে শুধু পাঠানো যন্ত্র নিজে ভাঙতে পারে।
                আর IPv6 এ প্রতিটা Link এর MTU কমপক্ষে ১২৮০ হতে হয়, যাতে অন্তত
                এইটুকু মাপের Packet সব জায়গায় নিশ্চিন্তে যায়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "df-pmtud",
      subHeader: { index: "011", title: "DF & Path MTU" },
      title: <SectionTitle>DF bit, আর পথের সবচেয়ে সরু জায়গাটা খুঁজে বের করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভাঙা যখন এত খারাপ, তখন ভালো উপায় হলো পথের সবচেয়ে সরু জায়গাটার
                মাপ আগে জেনে নিয়ে সেই মাপেই পাঠানো। কিন্তু ফোন তো পথের সব Link
                দেখতে পায় না। তাই সে একটা চালাকি করে, আর চালাকিটা IP Header এর এক
                Bit এর একটা পতাকা দিয়ে, যার নাম DF, পুরো কথায় Don&apos;t Fragment।
              </ContentParagraph>
              <ContentParagraph>
                DF চালু রেখে Packet পাঠানো মানে পথের সব Router কে বলা, এটা ভাঙবেন
                না। না ধরলে ফেলে দিন, কিন্তু আমাকে জানান। যে Router এর সামনে গিয়ে
                Packet আটকায়, সে সেটা ফেলে দেয় আর পাঠানো যন্ত্রকে একটা ICMP বার্তা
                ফেরত দেয়। বার্তাটার নাম Fragmentation Needed, আর তাতে একটা দামি
                তথ্য থাকে, সামনের Link এর MTU কত। পাঠানো যন্ত্র সেই সংখ্যা দেখে
                ছোট করে আবার পাঠায়। আবার কোথাও আটকালে আবার ছোট করে। এভাবে কয়েক
                ধাপে সে পুরো পথের সবচেয়ে ছোট MTU টা জেনে যায়। এই পদ্ধতির নাম Path
                MTU Discovery, সংক্ষেপে PMTUD। আজকের সব Operating System এ TCP
                এটাই করে, তাই প্রায় সব TCP Packet এর DF চালু থাকে।
              </ContentParagraph>
              <ContentParagraph>
                এটা আপনি ping দিয়ে হাতে করে দেখতে পারেন, আর এটা এই লেসনের সবচেয়ে
                মজার পরীক্ষা। ping এ DF চালু করে মাপ একটু একটু বদলান। মনে রাখুন,
                ping এর Data র সাথে ICMP র ৮ আর IP র ২০, মোট ২৮ Byte Header যোগ
                হয়। তাই ১৪৭২ Byte Data মানে ঠিক ১৫০০ Byte এর একটা Packet।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "path-mtu.sh",
          code: `# macOS এ DF চালু করতে -D, Linux এ -M do

# ১. নিজের Interface এর MTU র চেয়ে বড়: 1473 + 28 = 1501
ping -c 1 -D -s 1473 1.1.1.1         # macOS
ping -c 1 -M do -s 1473 1.1.1.1      # Linux
#   ping: sendto: Message too long
# Packet যন্ত্র থেকে বেরোতেই পারেনি। Kernel নিজেই ফিরিয়ে দিয়েছে,
# কারণ নিজের Interface এর MTU 1500 সে জানে।

# ২. ঠিক 1500 Byte এর Packet: 1472 + 28
ping -c 1 -D -s 1472 1.1.1.1
# পথের সব Link 1500 হলে উত্তর আসবে:
#   1480 bytes from 1.1.1.1: icmp_seq=0 ttl=58 time=...
# এই লেসন লেখার যন্ত্রে এসেছিল এটা:
#   556 bytes from 192.168.0.1: frag needed and DF set (MTU 1480)
# অর্থাৎ বাসার Router বলছে, আমার সামনের Link এ 1480 এর বেশি ধরে না।

# ৩. Router যা বলল সেই মাপে: 1480 - 28 = 1452
ping -c 1 -D -s 1452 1.1.1.1
#   1460 bytes from 1.1.1.1: icmp_seq=0 ttl=58 time=4.464 ms
# এবার গেল। এই পথের Path MTU তাহলে 1480।

# ৪. এক Byte বেশি দিলেই আবার আটকায়
ping -c 1 -D -s 1453 1.1.1.1
#   556 bytes from 192.168.0.1: frag needed and DF set (MTU 1480)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              উপরের ফলটা একটা আসল যন্ত্রের, আর এতে একটা শিক্ষা আছে। যন্ত্রের নিজের
              Interface বলছিল MTU ১৫০০, অথচ পথের আসল সীমা বেরোল ১৪৮০। অর্থাৎ ISP র
              দিকে কোথাও ২০ Byte এর একটা বাড়তি মোড়ক লাগছে, যার কথা পরের অংশে
              আসছে। আপনার যন্ত্রে ফল আলাদা হতে পারে। ১৪৭২ সোজা চলে গেলে আপনার পথ
              পুরো ১৫০০। ১৪৯২ এর কথা বললে আপনার সংযোগ PPPoE। যা ই আসুক, এখন আপনি
              জানেন সংখ্যাটা কোথা থেকে এলো আর কীভাবে পড়তে হয়। আর প্রথম আর
              দ্বিতীয় পরীক্ষার তফাতটা খেয়াল করুন। প্রথমটায় না বলেছে আপনার নিজের
              Kernel, দ্বিতীয়টায় না বলেছে পথের একটা Router। দুইটা আলাদা জায়গার
              দুইটা আলাদা সীমা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "PMTUD Black Hole, যে সমস্যা মানুষকে দিনের পর দিন ঘোরায়",
          content: (
            <div className="space-y-3">
              <p>
                পুরো পদ্ধতিটা দাঁড়িয়ে আছে একটা জিনিসের উপর, Router এর সেই ICMP
                বার্তাটা পাঠানো যন্ত্রের কাছে ফিরে আসা। এখন ধরুন মাঝখানের কোনো
                Firewall সব ICMP আটকে দেয়, কারণ কেউ একসময় ভেবেছিল ICMP মানেই
                ঝুঁকি। তখন বড় Packet পথে চুপচাপ মরে যায়, আর পাঠানো যন্ত্র কখনো
                জানতেই পারে না কেন। সে একই মাপে বারবার পাঠাতে থাকে। এই অবস্থার
                নাম PMTUD Black Hole।
              </p>
              <p>
                লক্ষণগুলো খুব অদ্ভুত, আর একবার চিনে রাখলে সারা জীবন কাজে লাগবে।
                ping চলে। Connection তৈরি হয়, কারণ SYN ছোট। ছোট ছোট পাতা খোলে।
                কিন্তু বড় কিছু পাঠাতে বা আনতে গেলেই আটকে যায়। SSH এ Login হয়,
                কিন্তু বড় Output এর কমান্ড দিলে Terminal জমে যায়। সাইট আধখানা
                খুলে ঘুরতে থাকে। File Upload শূন্য শতাংশে বসে থাকে। আর প্রায়ই এটা
                শুরু হয় VPN চালু করার পর। ছোট যায়, বড় যায় না, এই ছবিটা দেখলেই
                সবার আগে MTU র কথা ভাববেন।
              </p>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমাধান তিনটা, আর তিনটাই আপনি কোনো না কোনো দিন কোনো Setting এর
                পাতায় দেখবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ICMP পুরো বন্ধ না করা।</strong> Firewall এ ICMP র অন্তত
                  Fragmentation Needed বার্তাটা ঢুকতে দিতে হয়। এর আনুষ্ঠানিক
                  নাম ICMP Type 3, Code 4। Cloud এর Security Group এ সব ICMP
                  বন্ধ করে দেওয়া খুব চেনা একটা ভুল।
                </ListItem>
                <ListItem>
                  <strong>MSS Clamping।</strong> যে Router জানে তার সামনের Link
                  সরু, সে তার উপর দিয়ে যাওয়া প্রতিটা SYN এর ভেতরের MSS Option টা
                  কমিয়ে লিখে দেয়। ফলে দুই পক্ষ শুরু থেকেই ছোট Segment পাঠায়, আর
                  ICMP র উপর নির্ভর করতে হয় না। হ্যাঁ, এটা Segment খোলার আরেকটা
                  ব্যতিক্রম। প্রায় সব বাসার Router PPPoE তে এটা নিজে থেকেই করে।
                </ListItem>
                <ListItem>
                  <strong>Interface এর MTU নিজে কমিয়ে দেওয়া।</strong> VPN বা
                  Tunnel এর Interface এ সঠিক ছোট MTU বসিয়ে দিলে যন্ত্র শুরু থেকেই
                  ছোট Packet বানায়। VPN এর Software সাধারণত এটা নিজে করে নেয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "overhead",
      subHeader: { index: "012", title: "PPPoE, VPN, Tunnel" },
      title: <SectionTitle>খামের ভেতর খাম, তার ভেতর আবার খাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তার যদি ১৫০০ ধরে, তাহলে পথের MTU ১৫০০ র কম হয় কীভাবে? উত্তরটা এই
                লেসনের মূল ধারণারই আরেক ধাপ। Encapsulation শুধু চার Layer এ থামে
                না। মাঝপথে যে কেউ আপনার পুরো Packet টাকে মাল বানিয়ে নিজের আরেকটা
                মোড়কে ভরে ফেলতে পারে। এই কাজটাকে বলে Tunneling, কারণ আপনার Packet
                তখন অন্য একটা Packet এর পেটের ভেতর দিয়ে সুড়ঙ্গের মতো পার হয়।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু বাইরের তারটা তো বদলায়নি, সেখানে এখনো ১৫০০ ই ধরে। তাই বাড়তি
                মোড়ক যতটুকু জায়গা নেয়, ভেতরের Packet এর জন্য ঠিক ততটুকু জায়গা
                কমে যায়। ট্রাকের ভেতরে যদি মালের সাথে একটা বাড়তি বাক্সও ঢোকাতে
                হয়, মালের জায়গা কমবেই।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TunnelOverheadDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>PPPoE, MTU ১৪৯২:</strong> অনেক Broadband সংযোগে ISP
                  আপনার Router এ একটা User name আর Password বসাতে বলে। সেটাই
                  PPPoE। এটা প্রতিটা Packet এর সামনে ৮ Byte এর নিজের একটা Header
                  বসায়, তাই ১৫০০ থেকে ৮ গিয়ে থাকে ১৪৯২, আর MSS হয় ১৪৫২। Router এর
                  WAN Setting এ ১৪৯২ সংখ্যাটা দেখলে এখন জানবেন কেন।
                </ListItem>
                <ListItem>
                  <strong>IP in IP আর GRE:</strong> দুইটা দূরের Network কে জোড়া
                  দিতে পুরো Packet কে আরেকটা IP Packet এর ভেতরে ভরা হয়। শুধু একটা
                  IP Header লাগলে ২০ Byte যায়, থাকে ১৪৮০। GRE নামের মোড়কে যায় ২৪,
                  থাকে ১৪৭৬। আগের অংশের পরীক্ষায় যে ১৪৮০ বেরিয়েছিল, সেটা ঠিক এই
                  রকম একটা ২০ Byte এর মোড়কের চিহ্ন।
                </ListItem>
                <ListItem>
                  <strong>VPN:</strong> VPN আপনার পুরো Packet টা Encrypt করে আরেকটা
                  Packet এর ভেতরে ভরে পাঠায়। UDP Deep Dive এর লেসনে দেখা WireGuard
                  এ বাইরের IP Header, UDP Header আর নিজের Header মিলে IPv4 এ ৬০
                  আর IPv6 এ ৮০ Byte যায়। নিরাপদ থাকতে সে বড় সংখ্যাটা ধরে নিজের
                  Interface এর MTU রাখে ১৪২০।
                </ListItem>
                <ListItem>
                  <strong>Container এর Overlay Network:</strong> অনেকগুলো Server
                  এর Container কে এক Network এ আছে বলে দেখাতে VXLAN নামের একটা
                  মোড়ক ব্যবহার হয়, যা পুরো Frame টাকেই একটা UDP Datagram এর ভেতরে
                  ভরে। এতে যায় ৫০ Byte, থাকে ১৪৫০। Docker বা Kubernetes এর ভেতরে
                  MTU ১৪৫০ দেখলে এটাই কারণ। সামনের মডিউলগুলোতে এর সাথে আবার দেখা
                  হবে।
                </ListItem>
                <ListItem>
                  <strong>Cloud:</strong> কিছু Cloud এর ভেতরের Network নিজেই একটা
                  Tunnel, তাই সেখানে Server এর MTU ১৫০০ র বদলে ১৪৬০ এর মতো কিছু
                  দেখা যায়। আবার কোনো Cloud এ ভেতরে Jumbo Frame চালু থাকায় ৯০০১
                  দেখা যায়। সংখ্যা মুখস্থ করার দরকার নেই, নিজের Server এ ip link
                  চালিয়ে দেখে নিন, আর সেই Cloud এর Documentation এ MTU লিখে
                  খুঁজুন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মোড়কের উপর মোড়ক জমতেও পারে। অফিসের VPN এর ভেতর দিয়ে একটা
                Kubernetes Cluster এ কাজ করলে আপনার Data র গায়ে TCP, IP, VXLAN,
                আবার UDP, আবার IP, তারপর WireGuard, তারপর আবার UDP, আবার IP, শেষে
                Ethernet। প্রতিটা স্তর একটু করে জায়গা খায়। এই কারণেই MTU র সমস্যা
                সবচেয়ে বেশি দেখা যায় ঠিক সেখানে, যেখানে দুই তিনটা Tunnel একটার
                ভেতরে আরেকটা চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MSS Clamping দেখতে কেমন, যদি কখনো নিজে বসাতে হয়",
          content: (
            <p>
              Linux দিয়ে বানানো Router বা VPN Server এ কাজটা সাধারণত এক লাইনের
              একটা Firewall নিয়ম, যাতে TCPMSS আর clamp-mss-to-pmtu শব্দ দুইটা
              থাকে। নিয়মটা Router কে বলে, তার উপর দিয়ে যাওয়া প্রতিটা SYN এর MSS যেন পথের
              MTU অনুযায়ী ছেঁটে দেওয়া হয়। বাসার Router এর Setting এ একই জিনিস থাকে একটা
              টিক চিহ্ন হয়ে, নাম হয় MSS Clamping বা Clamp MSS to PMTU। নিজে লেখার
              দরকার এখন নেই, শুধু শব্দটা চিনে রাখুন, যাতে কোনো VPN এর Guide এ দেখলে
              বুঝতে পারেন এটা কোন সমস্যার ওষুধ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "read-capture",
      subHeader: { index: "013", title: "Reading a Capture" },
      title: <SectionTitle>হাতে কলমে, একটা ধরা Frame বাইরে থেকে ভেতরে পড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ যা বললাম সবটা নিজের চোখে দেখার একটা উপায় আছে। তারে যাওয়া
                Frame গুলো ধরে ফেলা যায়, আর এই কাজটাকে বলে Packet Capture। সবচেয়ে
                পুরনো আর সব জায়গায় থাকা যন্ত্রটা হলো tcpdump, Terminal এ চলে।
                Wireshark একই কাজ করে জানালা আর রঙ দিয়ে। দুইটাই ধরা Frame গুলো
                একটা ফাইলে রাখতে পারে, যার নাম pcap ফাইল।
              </ContentParagraph>
              <ContentParagraph>
                চলতি Network থেকে ধরতে Administrator এর অনুমতি লাগে, কারণ এতে অন্য
                Program এর Data ও দেখা যায়। তাই শুরুটা আমরা একটা নিরাপদ পথে করব।
                নিচের Lab এ একটা ছোট Script আছে, যা আমাদের গল্পের ঠিকানাগুলো দিয়ে
                হাতে বানানো একটা Frame কে একটা pcap ফাইলে লিখে দেয়। তারপর tcpdump
                সেই ফাইল পড়ে, যার জন্য কোনো বাড়তি অনুমতি লাগে না। সেই Frame টা
                tcpdump এভাবে দেখায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "tcpdump-read.sh",
          code: `# -r মানে ফাইল থেকে পড়া, -e মানে Frame এর Header ও দেখানো,
# -nn মানে নাম না খুঁজে সংখ্যাই দেখানো, -v মানে IP Header এর খুঁটিনাটি
tcpdump -e -nn -v -r frame.pcap

# reading from file frame.pcap, link-type EN10MB (Ethernet)
# 11:43:51.000000 a4:83:e7:12:9c:01 > c8:3a:35:4b:10:fe, ethertype IPv4 (0x0800), length 86: (tos 0x0, ttl 64, id 7238, offset 0, flags [DF], proto TCP (6), length 72)
#     192.168.1.20.51514 > 103.94.135.2.443: Flags [P.], cksum 0xaf34 (correct), seq 1000:1032, ack 5000, win 2048, length 32`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CaptureLineDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা length কে পাশাপাশি রাখুন। Frame ৮৬, Packet ৭২, Data ৩২।
                ৮৬ থেকে Ethernet Header এর ১৪ বাদ দিলে ৭২। ৭২ থেকে IP Header এর
                ২০ আর TCP Header এর ২০ বাদ দিলে ৩২। FCS এর ৪ Byte কোথাও নেই, কারণ
                Network Card সেটা মিলিয়ে দেখে নিজেই ফেলে দেয়, tcpdump পর্যন্ত আসেই
                না। তাই তারে আসলে গিয়েছিল ৯০ Byte, কিন্তু Capture এ সবসময় ৪ কম
                দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                আরও এক ধাপ ভেতরে যাওয়া যায়। -XX দিলে tcpdump Frame এর প্রতিটা
                Byte কে Hexadecimal এ দেখায়। Binary র লেসনে Hex পড়া শিখেছিলেন,
                দুইটা অক্ষর মানে এক Byte। এবার সেটা কাজে লাগবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "tcpdump-hex.sh",
          code: `tcpdump -nn -XX -r frame.pcap

# 0x0000:  c83a 354b 10fe a483 e712 9c01 0800 4500  .:5K..........E.
# 0x0010:  0048 1c46 4000 4006 6e4d c0a8 0114 675e  .H.F@.@.nM....g^
# 0x0020:  8702 c93a 01bb 0000 03e8 0000 1388 5018  ...:..........P.
# 0x0030:  0800 af34 0000 1703 0300 1b28 cd2c 5c15  ...4.......(.,\\.
# 0x0040:  d139 78a6 bc06 d380 92db bafb 31f5 590a  .9x.........1.Y.
# 0x0050:  a3ac 120f 9f8d                           ......

# প্রথম 14 Byte, Ethernet Header:
#   c83a354b10fe   Destination MAC  c8:3a:35:4b:10:fe  (Router)
#   a483e7129c01   Source MAC       a4:83:e7:12:9c:01  (ফোন)
#   0800           EtherType, ভেতরে IPv4

# পরের 20 Byte, IP Header, শুরু 45 দিয়ে:
#   45             4 মানে IPv4, 5 মানে Header 5 x 4 = 20 Byte
#   0048           মোট দৈর্ঘ্য, Hex 48 = 72
#   4000           পতাকা, 4 মানে DF চালু
#   40             TTL, Hex 40 = 64
#   06             Protocol, 6 মানে TCP
#   c0a80114       Source IP       192.168.1.20
#   675e8702       Destination IP  103.94.135.2

# পরের 20 Byte, TCP Header:
#   c93a           Source Port, Hex c93a = 51514
#   01bb           Destination Port, Hex 01bb = 443
#   000003e8       Sequence Number, Hex 3e8 = 1000

# বাকি 32 Byte, Data, শুরু 17 03 03 দিয়ে।
# এটা TLS এ Encrypt করা Data র চিহ্ন, তাই এর পরেরটুকু পড়া যায় না।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                c0 a8 01 14 কে আলাদা আলাদা করে দশমিকে বদলে দেখুন, ১৯২, ১৬৮, ১, ২০।
                IP Address এর লেসনে বলা হয়েছিল একটা IPv4 Address আসলে চারটা Byte।
                এখানে সেই চারটা Byte আপনি তারের উপর দেখছেন। আর শেষ লাইনটা একটা
                জরুরি সত্য দেখায়। HTTPS এ আপনার আসল Data পড়া যায় না, কিন্তু তিনটা
                Header এর সবটাই খোলা। পথের যে কেউ দেখতে পায় কোন IP কোন IP র কোন
                Port এ কথা বলছে আর কত Byte, শুধু কথাটা কী সেটা দেখতে পায় না।
              </ContentParagraph>
              <ContentParagraph>
                নিজের চলতি Network থেকে ধরতে চাইলে কমান্ডটা এরকম। এতে sudo লাগবে,
                আর এটা শুধু নিজের যন্ত্রে বা যেখানে আপনার অনুমতি আছে সেখানেই
                চালাবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "live-capture.sh",
          code: `# কোন কোন Interface আছে
tcpdump -D

# en0 থেকে, শুধু 1.1.1.1 এর সাথে Port 443 এর কথা, প্রথম 10টা Frame
sudo tcpdump -i en0 -e -nn -c 10 host 1.1.1.1 and tcp port 443
# Linux এ en0 এর জায়গায় eth0 বা যা ip link দেখায়

# আরেকটা Terminal এ কিছু একটা চালান, যাতে ধরার মতো কিছু থাকে
curl -sI https://1.1.1.1 > /dev/null

# পরে Wireshark এ খুলে দেখার জন্য ফাইলে রাখা
sudo tcpdump -i en0 -c 50 -w capture.pcap host 1.1.1.1`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিজের যন্ত্রে ধরলে তিনটা জিনিস বইয়ের সাথে মিলবে না",
          content: (
            <div className="space-y-3">
              <p>
                <strong>এক, length ১৫০০ র অনেক বেশি দেখাতে পারে।</strong> নিজের
                পাঠানো Frame এ কখনো length ১৬০০০ বা তার বেশি দেখে মনে হতে পারে
                পুরো লেসনটাই ভুল। আসলে আজকের Network Card গুলো Segment কাটার কাজটা
                নিজেরা করে, Kernel এর খাটুনি বাঁচাতে। Kernel একটা বিশাল Segment
                Card এর হাতে দেয়, Card সেটাকে MSS মাপে কেটে তারে ছাড়ে। এর নাম TSO,
                পুরো কথায় TCP Segmentation Offload। tcpdump ধরে Card এ ঢোকার
                আগে, তাই সে বড়টাই দেখে। তারে কিন্তু ১৫০০ র বেশি কিছুই যায়নি।
              </p>
              <p>
                <strong>দুই, FCS দেখা যায় না।</strong> কারণটা একটু আগেই বলা হলো।
              </p>
              <p>
                <strong>তিন, Wi-Fi তেও Ethernet Header দেখায়।</strong> Wi-Fi এর
                আসল Frame এর Header আলাদা আর বড়, কিন্তু Operating System সেটা
                লুকিয়ে একটা সাধারণ Ethernet Header এর চেহারায় দেখায়, যাতে সব
                Program একই ভাবে পড়তে পারে।
              </p>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "mistakes",
      subHeader: { index: "014", title: "Common Mistakes" },
      title: <SectionTitle>যে আটটা জায়গায় সবাই হোঁচট খায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসন আপনি অন্য কাউকে পড়ালে নিচের ভুল ধারণাগুলো প্রায় নিশ্চিতভাবে
                সামনে আসবে। প্রতিটার সাথে সঠিক কথাটাও রাখা হলো।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ভুল: Packet, Segment আর Frame তিনটা আলাদা জিনিস পাশাপাশি
                  যায়।</strong>{" "}
                  ঠিক কথা, এরা একটার ভেতরে আরেকটা। তারে যায় শুধু Frame, আর তার
                  পেটের ভেতরে Packet, তার পেটে Segment।
                </ListItem>
                <ListItem>
                  <strong>ভুল: Router Frame টা এগিয়ে দেয়।</strong> ঠিক কথা, Router
                  Frame ফেলে দেয় আর Packet এগিয়ে দেয়, নতুন Frame এ মুড়ে। Frame
                  এগিয়ে দেয় Switch, আর তাও শুধু একই Network এর ভেতরে।
                </ListItem>
                <ListItem>
                  <strong>ভুল: Server আমার MAC Address দেখতে পায়।</strong> ঠিক কথা,
                  আপনার MAC প্রথম Router এর বাইরে যায় না। ওয়েবসাইট আপনার MAC
                  জানতে পারে না।
                </ListItem>
                <ListItem>
                  <strong>ভুল: MTU ১৫০০ মানে Frame ১৫০০ Byte।</strong> ঠিক কথা, MTU
                  মাপে Frame এর ভেতরের Packet। Frame হয় ১৫১৮।
                </ListItem>
                <ListItem>
                  <strong>ভুল: MTU আর MSS একই জিনিস।</strong> ঠিক কথা, একটা Link
                  এর সীমা আর Packet মাপে, অন্যটা TCP র সীমা আর শুধু Data মাপে।
                  তফাত ৪০ Byte।
                </ListItem>
                <ListItem>
                  <strong>ভুল: TCP র Segment কাটা আর IP র Fragmentation একই কাজ।</strong>{" "}
                  ঠিক কথা, প্রথমটা পাঠানো যন্ত্রের TCP আগে থেকে পরিকল্পনা করে করে,
                  আর প্রতিটা টুকরোর নিজের Sequence Number থাকে, হারালে শুধু সেটাই
                  আবার যায়। দ্বিতীয়টা পথের মাঝখানে বাধ্য হয়ে ঘটে, আর একটা টুকরো
                  হারালে পুরোটাই নষ্ট।
                </ListItem>
                <ListItem>
                  <strong>ভুল: একটা send মানে একটা Packet।</strong> ঠিক কথা, আপনার
                  Code এর একটা লেখা কয়েকটা Segment এ ভাগ হতে পারে, আবার কয়েকটা
                  ছোট লেখা একটা Segment এ জুড়েও যেতে পারে। TCP Deep Dive এর লেসনে
                  Byte এর ধারার যে কথা ছিল, এটা তারই ফল।
                </ListItem>
                <ListItem>
                  <strong>ভুল: নিরাপত্তার জন্য সব ICMP বন্ধ করা ভালো।</strong> ঠিক
                  কথা, তাতে Path MTU Discovery ভেঙে যায়, আর আপনি নিজের হাতে একটা
                  Black Hole বানান।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একই শব্দ, অন্য জায়গায় অন্য মানে",
          content: (
            <p>
              তিনটা শব্দ আপনি অন্য প্রসঙ্গেও পাবেন, গুলিয়ে ফেলবেন না। Payload শব্দটা
              API র কথায় মানে Request বা Response এর Body, যা আসলে একই ধারণা, শুধু
              Application Layer এর চোখ দিয়ে দেখা। Frame শব্দটা ভিডিওর বেলায় মানে
              একটা স্থির ছবি, আর HTTP/2 তেও Frame নামে একটা একক আছে, কোনোটারই
              Ethernet এর Frame এর সাথে সম্পর্ক নেই। আর Datagram শব্দটা কিছু পুরনো
              বইয়ে IP Packet এর জন্যও ব্যবহার হয়, IP Datagram নামে। প্রসঙ্গ দেখে
              বুঝে নিতে হয়, আর Layer টা জিজ্ঞেস করে নিলে আর ভুল হয় না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এ এই জ্ঞান কোথায় কাজে লাগে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মনে হতে পারে Frame আর MTU র কথা Network Engineer দের ব্যাপার, একজন
                Backend বা DevOps Engineer এর এতে কী। Island Tours চালাতে গিয়ে
                চারটা জায়গায় এই লেসন সরাসরি কাজে লাগে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>অফিসের VPN থেকে Admin Panel আধখানা খোলে।</strong> Island
                  Tours এর কর্মীরা VPN দিয়ে Admin Panel এ ঢোকেন। একদিন অভিযোগ এলো,
                  Login হয়, ছোট পাতা খোলে, কিন্তু বুকিং এর বড় তালিকা আর ছবি
                  Upload আটকে থাকে। VPN ছাড়া সব ঠিক। ছোট যায়, বড় যায় না, এটা সেই
                  চেনা ছবি। VPN এর মোড়ক Path MTU কমিয়েছে, আর Server এর সামনের
                  Firewall সব ICMP আটকে দিচ্ছিল, তাই Server কখনো জানতে পারেনি
                  তাকে ছোট Segment পাঠাতে হবে। Firewall এ ICMP র Fragmentation
                  Needed বার্তাটা খুলে দিতেই সব ঠিক।
                </ListItem>
                <ListItem>
                  <strong>Log এ পর্যটকের আসল IP নেই।</strong> Server এর Log এ সব
                  Request এর Source IP দেখাচ্ছে একই, Reverse Proxy র IP। কারণটা
                  এখন পরিষ্কার। Proxy পর্যটকের Connection নিজে শেষ করে, তারপর
                  App এর সাথে একদম নতুন একটা Connection খোলে, যার Packet এ Source
                  IP তার নিজের। আসল IP আর Packet এর Header এ নেই, তাই Proxy সেটা
                  Data র ভেতরে একটা HTTP Header এ লিখে দেয়। সামনের মডিউলে এই
                  Header টার নাম জানবেন।
                </ListItem>
                <ListItem>
                  <strong>ছোট ছোট অনেক Request, ধীর পাতা।</strong> বুকিং এর পাতা
                  প্রথমে প্রতিটা নৌকার জন্য আলাদা Request পাঠাত, চল্লিশটা নৌকায়
                  চল্লিশটা Request। প্রতিটার উত্তর মাত্র কয়েকশ Byte, অথচ প্রতিটায়
                  মোড়কের খরচ, আলাদা Round Trip। সব নৌকার তথ্য এক Request এ আনার
                  পর একই Data কয়েকটা ভরা Segment এ চলে এলো।
                </ListItem>
                <ListItem>
                  <strong>Container এ সরানোর পর অদ্ভুত Timeout।</strong> পরে App
                  যখন Container এ যাবে, Overlay Network এর MTU হবে ১৪৫০। তখন যদি
                  কোনো Service কে হাতে ১৫০০ বসিয়ে দেওয়া হয়, ঠিক এই লেসনের সমস্যাটা
                  ফিরে আসবে। তখন প্রথম কাজ হবে দুই দিকের Interface এর MTU পাশাপাশি
                  দেখা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা সাধারণ বুকিং Request এর হিসাবটাও করে রাখা যাক। পর্যটকের
                বুকিং এর Data, Header আর Body মিলিয়ে ধরুন ২০০০ Byte। এটা যাবে দুইটা
                Segment এ, একটায় ১৪৬০ আর অন্যটায় ৫৪০ Byte। দুইটার গায়ে আলাদা করে
                ৫৮ Byte মোড়ক, তাই তারে যাবে ১৫১৮ আর ৫৯৮ Byte এর দুইটা Frame। Server
                দুইটা পেয়ে জুড়ে আবার ২০০০ Byte বানাবে, আর App এর হাতে দেবে। App এর
                কাছে এটা সবসময় একটাই Request ছিল।
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
      title: <SectionTitle>একটা বুকিং এর Data, ফোন থেকে Server, মোড়ক ধরে ধরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার পুরো লেসনটা একটা যাত্রায়। Handshake শেষ, Connection তৈরি আছে।
              পর্যটক বুকিং নিশ্চিত করার বোতাম চাপলেন। প্রতিটা ধাপে খেয়াল রাখুন
              জিনিসটার নাম এখন কী, আর কে কোন মোড়কে হাত দিচ্ছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Browser বানাল Data",
              description:
                "Browser বুকিং এর তথ্য দিয়ে একটা HTTP Request বানাল, TLS সেটা Encrypt করল। ফল ২০০০ Byte এর Data। Browser সেটা Socket এ লিখে দিল। এখান থেকে সব কাজ Kernel এর।",
            },
            {
              title: "TCP কাটল দুইটা Segment এ",
              description:
                "Handshake এ ঠিক হওয়া MSS ১৪৬০। তাই TCP প্রথম ১৪৬০ Byte নিয়ে একটা Segment বানাল, বাকি ৫৪০ নিয়ে আরেকটা। প্রতিটার সামনে ২০ Byte এর Header, তাতে Port 51514 থেকে 443, আর পরপর দুইটা Sequence Number।",
            },
            {
              title: "IP বানাল দুইটা Packet",
              description:
                "প্রতিটা Segment এর সামনে ২০ Byte এর IP Header বসল। Source 192.168.1.20, Destination 103.94.135.2, TTL 64, Protocol 6, DF চালু। প্রথম Packet ঠিক ১৫০০ Byte, দ্বিতীয়টা ৫৮০।",
            },
            {
              title: "Network Card বানাল দুইটা Frame",
              description:
                "Destination IP বাইরের Network এর, তাই Packet যাবে Gateway র কাছে। ফোন ARP Cache থেকে Router এর MAC নিল। সামনে ১৪ Byte এর Ethernet Header, পেছনে FCS। Frame দুইটা Wi-Fi এ Radio তরঙ্গ হয়ে বেরিয়ে গেল।",
            },
            {
              title: "বাসার Router: Frame ফেলল, Packet বদলাল",
              description:
                "Router FCS মিলিয়ে Frame খুলল, Ethernet এর মোড়ক ফেলে দিল। Packet এ TTL করল 63। NAT করে Source IP বানাল 203.0.113.25 আর Source Port বদলে নিজের খাতায় টুকে রাখল। তারপর ISP র দিকের Link এর জন্য নতুন Frame বানিয়ে ছাড়ল।",
            },
            {
              title: "পথের প্রতিটা Router: একই তিন কাজ",
              description:
                "Frame খোলা, Destination IP দেখে পথ ঠিক করা আর TTL এক কমানো, নতুন Frame এ মোড়া। কেউ Segment এর ভেতরে তাকায় না। কোনো Link এর MTU ১৫০০ র কম হলে প্রথম Packet টা সেখানে আটকাত, আর DF চালু বলে ফোনের কাছে ICMP ফিরে যেত।",
            },
            {
              title: "শেষ Router থেকে Server",
              description:
                "শেষ Router দেখল 103.94.135.2 তার নিজের Network এ। সে ARP করে Server এর MAC জেনে শেষ Frame টা বানাল। এই প্রথম Frame এর Destination MAC হলো Server এর নিজের।",
            },
            {
              title: "Server মোড়ক খুলল উল্টো ক্রমে",
              description:
                "Network Card FCS আর MAC মিলিয়ে Ethernet এর মোড়ক খুলল। IP নিজের ঠিকানা মিলিয়ে IP Header খুলল। TCP চার সংখ্যা মিলিয়ে Connection চিনল, Sequence Number দেখে দুইটা Segment এর Data পরপর জুড়ল, আর ACK পাঠাল।",
            },
            {
              title: "App পেল ২০০০ Byte",
              description:
                "Port 443 এ থাকা Reverse Proxy Socket থেকে ২০০০ Byte পড়ল, TLS খুলল, আর HTTP Request টা Port 3000 এ থাকা App এর কাছে পাঠাল। App বুকিং টা Database এ লিখল। উত্তরটা ফিরবে ঠিক একই নিয়মে, উল্টো দিকে।",
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
                <strong>নিজে একটা Frame খুলে দেখুন</strong>, নিচের Lab এর পাঁচ আর
                ছয় নম্বর পরীক্ষায় একটা Frame কে Byte ধরে ধরে তিন মোড়কে ভাগ করবেন।
                এটা একবার নিজের হাতে করলে Encapsulation আর কখনো ভুলবেন না।
              </ListItem>
              <ListItem>
                <strong>Wireshark</strong>, একই Capture জানালায় দেখার জন্য। একটা
                Frame এ Click করলে নিচে তিনটা মোড়ক আলাদা আলাদা ভাঁজে খুলে দেখায়,
                আর কোন Byte কোন ঘরের তা রঙ করে দেয়।{" "}
                <a
                  href="https://www.wireshark.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  wireshark.org
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare Learning, What is MTU</strong>, MTU, MSS আর
                Fragmentation এর ছোট আর পরিষ্কার ব্যাখ্যা, ছবি সহ।{" "}
                <a
                  href="https://www.cloudflare.com/learning/network-layer/what-is-mtu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cloudflare.com/learning/network-layer/what-is-mtu
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 791, Internet Protocol</strong>, IP Header এর প্রতিটা
                ঘর আর Fragmentation এর আসল নিয়ম, ১৯৮১ সালের মূল দলিল। পড়তে যতটা
                ভয়ের মনে হয় ততটা নয়।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc791"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc791
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 1191, Path MTU Discovery</strong>, DF bit আর ICMP দিয়ে
                পথের সরু জায়গা খোঁজার পদ্ধতি যেখানে প্রথম লেখা হয়।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc1191"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc1191
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
                  <strong>নাম মানে মোড়ক।</strong> Data র গায়ে TCP Header লাগলে
                  Segment, UDP Header লাগলে Datagram, তার উপর IP Header লাগলে
                  Packet, তার সামনে পেছনে Ethernet এর মোড়ক লাগলে Frame, তারে গেলে
                  Bits।
                </ListItem>
                <ListItem>
                  <strong>Encapsulation আর Decapsulation।</strong> পাঠানোর সময়
                  প্রতিটা Layer নিজের Header জোড়ে, পাওয়ার সময় উল্টো ক্রমে খোলে।
                  EtherType, Protocol আর Destination Port, এই তিনটা ঘর বলে দেয়
                  খোলার পর ভেতরের জিনিস কার হাতে যাবে।
                </ListItem>
                <ListItem>
                  <strong>হিসাব।</strong> ১৪৬০ Data + ২০ TCP + ২০ IP = ১৫০০ এর
                  Packet, তার সাথে ১৪ + ৪ মিলে ১৫১৮ এর Frame। মোড়ক ৫৮ Byte, বার্তা
                  ছোট হলে এটাই বড় খরচ।
                </ListItem>
                <ListItem>
                  <strong>পথে কী বদলায়।</strong> Frame প্রতিটা তারে নতুন। Packet
                  পুরো পথ টেকে, শুধু TTL প্রতি Router এ কমে আর NAT একবার Source
                  IP বদলায়। Segment আর Data দুই মাথার ব্যাপার, মাঝে শুধু NAT আর
                  Firewall এর মতো কয়েকটা যন্ত্র Header এর ঘর ছোঁয়।
                </ListItem>
                <ListItem>
                  <strong>MTU আর MSS।</strong> MTU হলো Link এর সীমা, Packet মাপে,
                  সাধারণত ১৫০০। MSS হলো TCP র সীমা, শুধু Data মাপে, MTU থেকে ৪০
                  কম, Handshake এ জানানো হয়।
                </ListItem>
                <ListItem>
                  <strong>বড় Packet, সরু রাস্তা।</strong> DF বন্ধ থাকলে Router
                  ভাঙে, যা ধীর আর ভঙ্গুর। DF চালু থাকলে ফেলে দিয়ে ICMP তে MTU
                  জানায়, আর পাঠানো যন্ত্র ছোট করে পাঠায়। সেই ICMP আটকে গেলে হয়
                  Black Hole, ছোট যায় কিন্তু বড় যায় না।
                </ListItem>
                <ListItem>
                  <strong>Tunnel মানে বাড়তি মোড়ক।</strong> PPPoE তে ১৪৯২,
                  WireGuard এ ১৪২০, VXLAN এ ১৪৫০। মোড়ক যত, ভেতরের জায়গা তত কম।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে একটা ঘর বারবার এসেছে, কিন্তু প্রতিবারই আমরা পাশ কাটিয়ে
                গেছি। সেটা TCP Header এর Port। আমরা শুধু বলেছি 51514 থেকে 443,
                আর TCP এটা দেখে ঠিক Program এর হাতে Data তুলে দেয়। কিন্তু 51514
                সংখ্যাটা এলো কোথা থেকে? একই Port 443 এ হাজার পর্যটক একসাথে কীভাবে
                কথা বলেন? আপনার App Port 3000 এ চালু, অথচ বাইরে থেকে খোলে না কেন?
                আর Address already in use লেখা Error টা আসলে কী বলতে চায়? পরের
                লেসন Port আর Socket পুরোটাই এই প্রশ্নগুলো নিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "মূল কথা"],
    rows: [
      ["PDU", "একটা Layer যে একক ধরে কাজ করে তার সাধারণ নাম"],
      ["Data / Message", "Application Layer এর একক, গায়ে Network এর কোনো মোড়ক নেই"],
      ["Segment / Datagram", "Data + TCP Header (২০ Byte) / Data + UDP Header (৮ Byte)"],
      ["Packet", "Segment + IP Header (২০ Byte), এক যন্ত্র থেকে দূরের যন্ত্র পর্যন্ত টেকে"],
      ["Frame", "Packet + Ethernet Header (১৪) + FCS (৪), শুধু একটা তারে বাঁচে"],
      ["Encapsulation", "নামার সময় প্রতিটা Layer নিজের Header জুড়ে দেয়"],
      ["Decapsulation", "ওঠার সময় উল্টো ক্রমে খোলে, EtherType, Protocol আর Port দেখে হাতবদল"],
      ["পথে যা বদলায়", "Frame প্রতি তারে নতুন, TTL প্রতি Router এ এক কম, NAT এ Source IP আর Port"],
      ["MTU", "Link এর সীমা, একটা Frame এ কত বড় Packet ধরে, সাধারণত ১৫০০"],
      ["MSS", "TCP র সীমা, একটা Segment এ কত Data, MTU বিয়োগ ৪০, সাধারণত ১৪৬০"],
      ["Fragmentation", "বড় Packet কে পথে টুকরো করা, জোড়া লাগে শুধু গন্তব্যে, একটা হারালে সব নষ্ট"],
      ["DF ও PMTUD", "ভাঙা নিষেধ করে পাঠানো, আটকালে ICMP তে MTU জেনে ছোট করে পাঠানো"],
      ["Black Hole", "ICMP আটকে গেলে ছোট Packet যায়, বড় Packet চুপচাপ হারায়"],
      ["Tunnel এর খরচ", "PPPoE ১৪৯২, WireGuard ১৪২০, VXLAN ১৪৫০, বাড়তি মোড়ক জায়গা খায়"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Packet আর Frame এর সম্পর্ক সবচেয়ে ঠিকভাবে কোনটা বলে?",
        options: [
          {
            key: "A",
            text: "এরা দুইটা আলাদা বার্তা, যা পাশাপাশি দুইটা পথে যায়",
            isCorrect: false,
            explanation: "না। তারে যায় শুধু Frame, আর Packet থাকে তার ভেতরে।",
          },
          {
            key: "B",
            text: "Frame হলো সেই Packet, যার সামনে Link Layer এর Header আর পেছনে FCS লেগেছে",
            isCorrect: true,
            explanation:
              "ঠিক। নামটা বলে দেয় জিনিসটার গায়ে এই মুহূর্তে কোন কোন মোড়ক আছে। Frame এর Payload ই Packet।",
          },
          {
            key: "C",
            text: "Packet হলো বড় Frame এর আরেক নাম",
            isCorrect: false,
            explanation: "মাপের সাথে নামের সম্পর্ক নেই, সম্পর্ক Layer এর সাথে।",
          },
        ],
      },
      {
        id: 2,
        text: "১৪৬০ Byte Data একটা TCP Segment এ সাধারণ Ethernet দিয়ে গেলে তারে যাওয়া Frame টা কত Byte?",
        options: [
          {
            key: "A",
            text: "১৫০০",
            isCorrect: false,
            explanation: "১৫০০ হলো Packet এর মাপ। Ethernet এর Header আর FCS এখনো যোগ হয়নি।",
          },
          {
            key: "B",
            text: "১৫১৮",
            isCorrect: true,
            explanation:
              "ঠিক। ১৪৬০ + TCP ২০ + IP ২০ = ১৫০০ এর Packet, তার সাথে Ethernet Header ১৪ আর FCS ৪।",
          },
          {
            key: "C",
            text: "১৪৬০",
            isCorrect: false,
            explanation: "এটা শুধু Data। তিনটা মোড়কের কোনোটাই ধরা হয়নি।",
          },
        ],
      },
      {
        id: 3,
        text: "ফোন থেকে Server পর্যন্ত পথে দশটা Router আছে। পথে কোনটা প্রতিটা Router এ সম্পূর্ণ নতুন করে তৈরি হয়?",
        options: [
          {
            key: "A",
            text: "Frame, কারণ MAC Address শুধু একটা তারের দুই মাথার জন্য",
            isCorrect: true,
            explanation:
              "ঠিক। Router পুরনো Frame ফেলে দেয় আর পরের তারের জন্য নতুন MAC দিয়ে নতুন Frame বানায়।",
          },
          {
            key: "B",
            text: "Segment, কারণ প্রতিটা Router নতুন Sequence Number দেয়",
            isCorrect: false,
            explanation: "সাধারণ Router Segment খোলেই না। Sequence Number দুই মাথার ব্যাপার।",
          },
          {
            key: "C",
            text: "Packet, কারণ প্রতিটা Router Destination IP বদলায়",
            isCorrect: false,
            explanation: "Destination IP পুরো পথে একই থাকে। Router শুধু TTL কমায়।",
          },
        ],
      },
      {
        id: 4,
        text: "MTU ১৫০০ আর MSS ১৪৬০। এই ৪০ Byte এর তফাতটা কীসের?",
        options: [
          {
            key: "A",
            text: "Ethernet Header আর FCS এর",
            isCorrect: false,
            explanation: "এদের মোট ১৮ Byte, আর এরা MTU র হিসাবে পড়েই না।",
          },
          {
            key: "B",
            text: "IP Header এর ২০ আর TCP Header এর ২০ Byte এর",
            isCorrect: true,
            explanation:
              "ঠিক। MTU মাপে পুরো Packet, MSS মাপে শুধু Data। মাঝের দুইটা Header ই তফাত।",
          },
          {
            key: "C",
            text: "নিরাপত্তার জন্য রাখা ফাঁকা জায়গার",
            isCorrect: false,
            explanation: "কোনো ফাঁকা জায়গা নেই, পুরোটাই Header।",
          },
        ],
      },
      {
        id: 5,
        text: "ping -D -s 1472 চালিয়ে উত্তর এলো: frag needed and DF set (MTU 1480), আর বার্তাটা এসেছে আপনার Router এর IP থেকে। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "গন্তব্যের Server বন্ধ",
            isCorrect: false,
            explanation: "বার্তাটা Server পাঠায়নি, পথের একটা Router পাঠিয়েছে।",
          },
          {
            key: "B",
            text: "Router এর সামনের Link এ ১৪৮০ Byte এর বড় Packet ধরে না, আর DF চালু বলে সে ভাঙতে পারেনি",
            isCorrect: true,
            explanation:
              "ঠিক। ১৪৭২ + ২৮ = ১৫০০ Byte এর Packet ১৪৮০ র Link এ আটকেছে। Router ফেলে দিয়ে সঠিক MTU জানিয়েছে। এটাই Path MTU Discovery।",
          },
          {
            key: "C",
            text: "আপনার যন্ত্রের Interface এর MTU ১৪৮০",
            isCorrect: false,
            explanation:
              "তা হলে Packet বেরোতই না, আর আপনি নিজের Kernel থেকে Message too long দেখতেন।",
          },
        ],
      },
      {
        id: 6,
        text: "VPN চালু করার পর SSH এ Login হয়, ছোট পাতা খোলে, কিন্তু বড় File নামাতে গেলে আটকে থাকে। সবচেয়ে সম্ভাব্য কারণ কোনটা?",
        options: [
          {
            key: "A",
            text: "DNS ভুল উত্তর দিচ্ছে",
            isCorrect: false,
            explanation: "DNS ভুল হলে Login ই হতো না।",
          },
          {
            key: "B",
            text: "VPN এর মোড়কে Path MTU কমেছে, আর কোথাও ICMP আটকে থাকায় পাঠানো যন্ত্র সেটা জানতে পারছে না",
            isCorrect: true,
            explanation:
              "ঠিক। ছোট Packet ধরে, ভরা মাপের Packet চুপচাপ হারায়। এটাই PMTUD Black Hole এর চেনা লক্ষণ।",
          },
          {
            key: "C",
            text: "Server এর Disk ভরে গেছে",
            isCorrect: false,
            explanation: "তা হলে VPN ছাড়াও একই সমস্যা হতো।",
          },
        ],
      },
      {
        id: 7,
        text: "Network Card একটা Frame এর Ethernet মোড়ক খুলল। ভেতরের জিনিসটা IPv4 Packet, IPv6 Packet নাকি ARP, সে কীভাবে বোঝে?",
        options: [
          {
            key: "A",
            text: "Ethernet Header এর EtherType ঘর দেখে",
            isCorrect: true,
            explanation:
              "ঠিক। 0x0800 মানে IPv4, 0x86DD মানে IPv6, 0x0806 মানে ARP। একইভাবে IP Header এর Protocol ঘর বলে ভেতরে TCP না UDP।",
          },
          {
            key: "B",
            text: "Destination Port দেখে",
            isCorrect: false,
            explanation: "Port আছে আরও দুই মোড়ক ভেতরে, TCP বা UDP Header এ।",
          },
          {
            key: "C",
            text: "Frame এর মাপ দেখে আন্দাজ করে",
            isCorrect: false,
            explanation: "আন্দাজ নয়, প্রতিটা Header এ এর জন্য একটা নির্দিষ্ট ঘর আছে।",
          },
        ],
      },
      {
        id: 8,
        text: "নিজের যন্ত্রে tcpdump চালিয়ে একটা পাঠানো TCP Segment এর length দেখলেন ১৬৩৮৪, অথচ MTU ১৫০০। ব্যাখ্যা কোনটা?",
        options: [
          {
            key: "A",
            text: "আপনার যন্ত্র MTU মানছে না",
            isCorrect: false,
            explanation: "তারে ১৫০০ র বড় কিছুই যায়নি।",
          },
          {
            key: "B",
            text: "Network Card নিজে Segment কাটছে (TSO), আর tcpdump কাটার আগের বড় টুকরোটা দেখছে",
            isCorrect: true,
            explanation:
              "ঠিক। Kernel বড় Segment টা Card এর হাতে দেয়, Card MSS মাপে কেটে তারে ছাড়ে। Capture হয় তার আগের ধাপে।",
          },
          {
            key: "C",
            text: "এটা একটা Jumbo Frame",
            isCorrect: false,
            explanation: "Jumbo Frame এ MTU নিজেই ৯০০০ এর মতো দেখাত, আর তাতেও ১৬৩৮৪ ধরত না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "মোড়কগুলো নিজের হাতে খুলুন",
    subtitle: "Terminal এ ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের MTU দেখা",
        description:
          "প্রতিটা Network Interface এর MTU বের করুন, আর Loopback এর সংখ্যাটা আলাদা কেন ভাবুন।",
      },
      {
        title: "TTL কমতে দেখা",
        description:
          "ping এর উত্তরের ttl থেকে Router গুনুন, তারপর TTL ১ দিয়ে নিজের Gateway কে ধরুন।",
      },
      {
        title: "Path MTU খুঁজে বের করা",
        description:
          "DF চালু রেখে ping এর মাপ বদলে বদলে পথের সবচেয়ে সরু জায়গার মাপ বের করুন।",
      },
      {
        title: "Fragmentation ঘটানো",
        description:
          "বড় একটা ping পাঠিয়ে Kernel এর Fragment এর গুনতি বাড়তে দেখুন।",
      },
      {
        title: "একটা Frame কে Byte ধরে খোলা",
        description:
          "একটা ছোট Node Script দিয়ে Hex এ লেখা একটা Frame থেকে তিনটা Header আলাদা করুন।",
      },
      {
        title: "একই Frame, tcpdump এর চোখে",
        description:
          "Frame টাকে একটা pcap ফাইলে লিখে tcpdump দিয়ে পড়ুন, আর আগের ফলের সাথে মিলিয়ে দেখুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-my-mtu.sh",
        language: "bash",
        code: `# macOS
ifconfig | grep mtu
networksetup -getMTU en0

# Linux
ip link show

# যা খেয়াল করবেন:
# - Wi-Fi বা Ethernet এর Interface এ সাধারণত 1500
# - Loopback (lo0 বা lo) এ অনেক বড়, 16384 বা 65536, কারণ সেখানে আসল তার নেই
# - VPN চালু থাকলে একটা বাড়তি Interface (utun, wg0, tun0) আর তার ছোট MTU
# VPN থাকলে একবার চালু করে আবার চালান, নতুন লাইনটা খুঁজে বের করুন।`,
      },
      {
        filename: "2-ttl.sh",
        language: "bash",
        code: `# উত্তরের ttl ঘর
ping -c 1 1.1.1.1
ping -c 1 8.8.8.8
ping -c 1 github.com
# প্রতিটার জন্য লিখুন: ttl কত, শুরুটা সম্ভবত কত ছিল (64, 128 না 255),
# তাহলে ফেরার পথে কয়টা Router।

# TTL বেঁধে দিয়ে প্রথম দুইটা Router কে ধরা
ping -c 1 -m 1 1.1.1.1     # macOS, Linux এ -t 1
ping -c 1 -m 2 1.1.1.1     # macOS, Linux এ -t 2
# প্রথমটায় Time to live exceeded আসবে আপনার Gateway র IP থেকে।
# দ্বিতীয়টায় আসবে পথের দ্বিতীয় Router থেকে।
# traceroute ঠিক এটাই করে, 1 থেকে শুরু করে এক এক করে বাড়িয়ে।
traceroute -m 5 1.1.1.1`,
      },
      {
        filename: "3-path-mtu.sh",
        language: "bash",
        code: `# macOS: -D মানে DF চালু, -t 2 মানে 2 সেকেন্ডের বেশি অপেক্ষা নয়
for s in 1472 1464 1460 1452 1400; do
  if ping -c 1 -t 2 -D -s $s 1.1.1.1 > /dev/null 2>&1; then
    echo "$s ok"
  else
    echo "$s too big"
  fi
done

# Linux: -M do মানে DF চালু, -W 2 মানে 2 সেকেন্ড অপেক্ষা
for s in 1472 1464 1460 1452 1400; do
  if ping -c 1 -W 2 -M do -s $s 1.1.1.1 > /dev/null 2>&1; then
    echo "$s ok"
  else
    echo "$s too big"
  fi
done

# এই লেসন লেখার যন্ত্রে ফল ছিল:
#   1472 too big
#   1464 too big
#   1460 too big
#   1452 ok
#   1400 ok
# সবচেয়ে বড় যে মাপটা ok, তার সাথে 28 যোগ করলে Path MTU।
# এখানে 1452 + 28 = 1480।
# আপনার যন্ত্রে 1472 ok এলে Path MTU পুরো 1500।

# Linux এ একটা কমান্ডেই পথের MTU দেখা যায়
tracepath 1.1.1.1`,
      },
      {
        filename: "4-fragment.sh",
        language: "bash",
        code: `# আগের গুনতি
netstat -s -p ip | grep -i fragment      # macOS
netstat -s | grep -i -E "fragment|reassembl"   # Linux

# DF ছাড়া বড় ping: যন্ত্র নিজে ভেঙে পাঠাবে
ping -c 2 -s 3000 1.1.1.1
#   3008 bytes from 1.1.1.1: icmp_seq=0 ttl=58 time=6.528 ms

# পরের গুনতি, আগেরটার সাথে মিলিয়ে দেখুন কোন সংখ্যা কত বাড়ল
netstat -s -p ip | grep -i fragment

# একই মাপ, এবার DF চালু করে
ping -c 1 -D -s 3000 1.1.1.1      # macOS, Linux এ -M do
#   ping: sendto: Message too long
# ভাঙা নিষেধ, আর ধরেও না, তাই Kernel পাঠাতেই রাজি হলো না।`,
      },
      {
        filename: "5-read-frame.js",
        language: "javascript",
        code: `// চালানো: node 5-read-frame.js <frame-hex>
const hex = process.argv[2];
if (!hex) {
  console.error("Frame এর hex দিন: node 5-read-frame.js <hex>");
  process.exit(1);
}
const frame = Buffer.from(hex, "hex");
const mac = (b) => [...b].map((x) => x.toString(16).padStart(2, "0")).join(":");
const ip = (b) => [...b].join(".");

// Link Layer: প্রথম 14 Byte হলো Ethernet Header
console.log("FRAME   মোট", frame.length, "Byte");
console.log("  Destination MAC :", mac(frame.subarray(0, 6)));
console.log("  Source MAC      :", mac(frame.subarray(6, 12)));
console.log("  EtherType       : 0x" + frame.readUInt16BE(12).toString(16).padStart(4, "0"));

// Internet Layer: Frame এর Payload টাই Packet
const packet = frame.subarray(14);
const ipHeaderLen = (packet[0] & 0x0f) * 4;
console.log("PACKET  মোট", packet.readUInt16BE(2), "Byte, Header", ipHeaderLen);
console.log("  TTL             :", packet[8]);
console.log("  Protocol        :", packet[9], "(6 মানে TCP, 17 মানে UDP)");
console.log("  DF bit          :", (packet[6] & 0x40) !== 0);
console.log("  Source IP       :", ip(packet.subarray(12, 16)));
console.log("  Destination IP  :", ip(packet.subarray(16, 20)));

// Transport Layer: Packet এর Payload টাই Segment
const segment = packet.subarray(ipHeaderLen);
const tcpHeaderLen = (segment[12] >> 4) * 4;
console.log("SEGMENT মোট", segment.length, "Byte, Header", tcpHeaderLen);
console.log("  Source Port     :", segment.readUInt16BE(0));
console.log("  Destination Port:", segment.readUInt16BE(2));
console.log("  Sequence Number :", segment.readUInt32BE(4));

// Application Layer: Segment এর Payload টাই আসল Data
const data = segment.subarray(tcpHeaderLen);
console.log("DATA    মোট", data.length, "Byte");
console.log("  প্রথম কয়েক Byte  :", data.subarray(0, 8).toString("hex"));

// এই Frame টা দিয়ে চালান (এক লাইনে):
// node 5-read-frame.js c83a354b10fea483e7129c010800450000481c46400040066e4dc0a80114675e8702c93a01bb000003e80000138850180800af340000170303001b28cd2c5c15d13978a6bc06d38092dbbafb31f5590aa3ac120f9f8d
//
// ফল:
// FRAME   মোট 86 Byte
//   Destination MAC : c8:3a:35:4b:10:fe
//   Source MAC      : a4:83:e7:12:9c:01
//   EtherType       : 0x0800
// PACKET  মোট 72 Byte, Header 20
//   TTL             : 64
//   Protocol        : 6 (6 মানে TCP, 17 মানে UDP)
//   DF bit          : true
//   Source IP       : 192.168.1.20
//   Destination IP  : 103.94.135.2
// SEGMENT মোট 52 Byte, Header 20
//   Source Port     : 51514
//   Destination Port: 443
//   Sequence Number : 1000
// DATA    মোট 32 Byte
//   প্রথম কয়েক Byte  : 170303001b28cd2c`,
      },
      {
        filename: "6-make-pcap.js",
        language: "javascript",
        code: `// চালানো: node 6-make-pcap.js <frame-hex> <output-file>
const fs = require("node:fs");
const [hex, out] = process.argv.slice(2);
if (!hex || !out) {
  console.error("ব্যবহার: node 6-make-pcap.js <frame-hex> <output-file>");
  process.exit(1);
}
const frame = Buffer.from(hex, "hex");

// pcap ফাইলের 24 Byte এর Header, শেষের 1 মানে Link type Ethernet
const fileHeader = Buffer.alloc(24);
fileHeader.writeUInt32LE(0xa1b2c3d4, 0);
fileHeader.writeUInt16LE(2, 4);
fileHeader.writeUInt16LE(4, 6);
fileHeader.writeUInt32LE(65535, 16);
fileHeader.writeUInt32LE(1, 20);

// প্রতিটা Frame এর আগে 16 Byte: সময় আর দৈর্ঘ্য
const recordHeader = Buffer.alloc(16);
recordHeader.writeUInt32LE(Math.floor(Date.now() / 1000), 0);
recordHeader.writeUInt32LE(frame.length, 8);
recordHeader.writeUInt32LE(frame.length, 12);

fs.writeFileSync(out, Buffer.concat([fileHeader, recordHeader, frame]));
console.log(out, "লেখা হলো,", frame.length, "Byte এর একটা Frame");

// আগের পরীক্ষার একই hex দিয়ে:
//   node 6-make-pcap.js <hex> frame.pcap
//   tcpdump -e -nn -v -r frame.pcap
//   tcpdump -nn -XX -r frame.pcap
//
// tcpdump এর লাইনের প্রতিটা সংখ্যা আগের Script এর ফলের সাথে মিলিয়ে দেখুন।
// MAC, IP, Port, TTL, তিনটা length, সব একই হওয়া চাই।
// cksum এর পাশে (correct) লেখাটাও খেয়াল করুন, TCP Checksum মিলেছে।
// frame.pcap ফাইলটা Wireshark এ খুললেও একই Frame দেখবেন।`,
      },
    ],
    tip: "পাঁচ আর ছয় নম্বর পরীক্ষা পাশাপাশি করুন, এটাই এই Lab এর প্রাণ। আপনার নিজের বিশ লাইনের Script আর tcpdump একই ৮৬টা Byte পড়ে একই উত্তর দিচ্ছে, কারণ দুইজনেই একই নিয়ম মানছে। প্রথম ১৪ Byte Ethernet, তারপর IP, যার Header এর মাপ তার নিজের প্রথম Byte এ লেখা, তারপর TCP। কোনো জাদু নেই, শুধু কোন Byte কোথায় বসবে তার একটা চুক্তি। Protocol শব্দটার আসল মানে এটাই। এরপর Script এর hex এ একটা দুইটা অক্ষর বদলে আবার চালান, যেমন TTL এর 40 কে 01 করুন, বা Port এর 01bb কে 0050 করুন, আর দেখুন ফল কীভাবে বদলায়। tcpdump তখন বলবে Checksum মেলেনি, আর সেটাও একটা শিক্ষা।",
  },
  assignment: {
    title: "Mini Project: একটা Request এর মোড়কের হিসাবখাতা",
    time: "৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>নিজের পথ মাপুন:</strong> নিজের যন্ত্রের প্রতিটা Interface এর MTU
        একটা ছকে লিখুন। তারপর Lab এর তিন নম্বর পরীক্ষা দিয়ে 1.1.1.1 আর 8.8.8.8,
        দুইটার জন্যই Path MTU বের করুন। Interface এর MTU আর Path MTU একই এলো কি?
        আলাদা হলে তফাতটা কত Byte, আর এই লেসনের কোন মোড়কের সাথে সেটা মেলে? সম্ভব
        হলে Mobile Data র Hotspot এ একই পরীক্ষা আবার করুন।
      </span>,
      <span key="2">
        <strong>হিসাব কষুন:</strong> Island Tours এ একজন পর্যটক ৩ MB র একটা ছবি
        Upload করছেন, MSS ১৪৬০। (ক) কয়টা Segment লাগবে? (খ) সব Frame মিলিয়ে তারে
        মোট কত Byte যাবে, আর তার কত শতাংশ মোড়ক? (গ) একই Upload একটা WireGuard VPN
        এর ভেতর দিয়ে গেলে, যেখানে MTU ১৪২০, MSS কত হবে আর Segment কয়টা লাগবে?
      </span>,
      <span key="3">
        <strong>কে কোনটা ছোঁয়:</strong> একটা ছক বানান। সারিতে থাকবে Source MAC,
        Destination MAC, Source IP, Destination IP, TTL, Source Port, Destination
        Port, Sequence Number আর Data। কলামে থাকবে Switch, সাধারণ Router, NAT করা
        Router, Firewall আর Reverse Proxy। প্রতিটা ঘরে লিখুন যন্ত্রটা ঘরটা পড়ে,
        বদলায়, নাকি ছোঁয়ই না। যেখানে নিশ্চিত নন, কোন লেসন দেখে উত্তর পেলেন
        সেটাও লিখুন।
      </span>,
      <span key="4">
        <strong>নিজের Frame বানান:</strong> Lab এর hex টা নিয়ে তিনটা বদল করুন।
        Destination Port করুন 80, TTL করুন 1, আর Source IP করুন 192.168.1.21।
        প্রতিটা বদলের জন্য লিখুন hex এর কোন জায়গার কোন অক্ষর বদলালেন আর কেন ঠিক
        সেখানেই। Script আর tcpdump দুইটা দিয়েই যাচাই করুন। tcpdump Checksum নিয়ে
        কী বলল, আর কেন বলল?
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় লিখুন (৮ লাইন):</strong> একজন সহকর্মী বলছেন, VPN চালু
        করলে আমাদের Admin Panel এ Login হয় কিন্তু বড় Report নামে না, Server এ
        নিশ্চয়ই কোনো Bug আছে। তাঁকে বুঝিয়ে লিখুন আসলে কী ঘটছে বলে আপনার সন্দেহ,
        কোন দুইটা কমান্ড চালিয়ে সেটা প্রমাণ করবেন, আর কোন কোন জায়গায় ঠিক করা যায়।
      </span>,
    ],
    deliverables: [
      <span key="1">Interface এর MTU আর দুই গন্তব্যের Path MTU র ছক, তফাতের ব্যাখ্যা সহ</span>,
      <span key="2">৩ MB Upload এর Segment, মোট Byte আর মোড়কের শতাংশের হিসাব, VPN সহ আর ছাড়া</span>,
      <span key="3">নয়টা ঘর আর পাঁচটা যন্ত্রের ছক, পড়ে, বদলায় না ছোঁয় না</span>,
      <span key="4">তিনটা বদলানো hex, প্রতিটার Script আর tcpdump এর ফল</span>,
      <span key="5">সহকর্মীর জন্য ৮ লাইনের ব্যাখ্যা, দুইটা কমান্ড আর সমাধান সহ</span>,
    ],
  },
};
