/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  PacketJourneyLab,
  PipeLab,
} from "../../../components/course/topics/packets/animations";
import {
  ChopIntoPacketsDiagram,
  DistanceLatencyDiagram,
  LatencyVsBandwidthSplit,
} from "../../../components/course/topics/packets/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const packetLatencyBandwidthContent: TopicData = {
  id: "packet-latency-bandwidth",
  introduction: {
    badge: "MODULE 02 · LESSON 04",
    title: <SectionTitle>একটা চিঠি নয়, একগাদা পোস্টকার্ড</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এতক্ষণ আমরা একটা কথাকে একটা চিঠির মতো ভেবেছি। Client একটা Request
          পাঠায়, Server একটা Response ফেরায়, আর মাঝখানের রাস্তা সেই খামটা বয়ে
          নিয়ে যায়। ছবিটা বোঝার জন্য ভালো ছিল, কিন্তু আসলে একটু সরল করা। এবার
          আসল ছবিটা দেখার সময়।
        </ContentParagraph>
        <ContentParagraph>
          একটা বড় বাক্স ভরা জিনিস অন্য শহরে পাঠানোর কথা ভাবুন। আপনি চাইলেও পুরো
          বাক্সটা একটা খামে ভরতে পারবেন না। তার বদলে জিনিসগুলো ভাগ করে অনেকগুলো
          ছোট পার্সেলে ভরেন, প্রতিটার গায়ে লেখেন এটা কত নম্বর পার্সেল, মোট
          কয়টা। তারপর সবগুলো Post Office এ দিয়ে আসেন। এখন মজার ব্যাপার, এই
          পার্সেলগুলো সব একসাথে একই ট্রাকে যায় না। কোনোটা এই গাড়িতে, কোনোটা ওই
          গাড়িতে, আর ওপাশে হয়তো ৩ নম্বর পার্সেল ২ নম্বরের আগে পৌঁছায়।
        </ContentParagraph>
        <ContentParagraph>
          Internet এ আপনার প্রতিটা কথা ঠিক এভাবে যায়, ছোট ছোট টুকরোয় ভাগ হয়ে।
          এই লেসনে আমরা দেখব টুকরোগুলো কী, তারা কীভাবে যায়, আর কেন একটা জিনিস
          মানুষকে সবচেয়ে বেশি বিভ্রান্ত করে, কেন ১০০ Mbps কেনার পরেও একটা সাইট
          ধীর লাগে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "Bandwidth মানে পাইপটা কত চওড়া। Latency মানে এক ফোঁটা পানি এক মাথা থেকে অন্য মাথায় পৌঁছাতে কতক্ষণ। পাইপ চওড়া করলে ফোঁটাটা দ্রুত যায় না।",
      author: "Internet Fundamentals",
      role: "Lesson 04",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "packet",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>বড় কথা ছোট টুকরোয় ভাগ হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Internet একটানা কিছু পাঠায় না, টুকরো টুকরো করে পাঠায়। আপনার ২
                MB এর একটা ছবি Server এ যাওয়ার সময় Kernel সেটাকে হাজার হাজার
                ছোট টুকরোয় ভাগ করে, আর প্রতিটা টুকরোর নাম Packet। প্রতিটা
                Packet এর গায়ে একটা করে খাম, আর খামে লেখা থাকে যাওয়ার ঠিকানা,
                ফেরার ঠিকানা, Port, আর সবচেয়ে জরুরি দুইটা জিনিস, সে কত নম্বর
                টুকরো আর মোট কয়টা।
              </ContentParagraph>
              <ContentParagraph>
                কেন এই ভাগাভাগি? দুইটা সহজ কারণ। প্রথমত, রাস্তা সবার। একজন যদি
                পুরো একটা সিনেমা একটানা পাঠাত, তাহলে ওই সময়টা আর কেউ কিছু
                পাঠাতে পারত না, ঠিক যেমন একটা বিশাল ট্রাক পুরো রাস্তা আটকে
                দাঁড়িয়ে থাকলে পেছনের অ্যাম্বুলেন্স আটকে যায়। ছোট টুকরো করলে
                সবার টুকরো পালা করে যেতে পারে। দ্বিতীয়ত, একটা টুকরো নষ্ট হলে
                শুধু ওই টুকরোটা আবার পাঠালেই হয়, পুরো ফাইল নয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ChopIntoPacketsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সবচেয়ে গুরুত্বপূর্ণ কথাটা। এই Packet গুলো সব একই রাস্তায়
              যায় না। মাঝের প্রতিটা Router প্রতিটা Packet কে আলাদাভাবে দেখে, আর
              সেই মুহূর্তে যে রাস্তা খালি, সেদিকে ঠেলে দেয়। তাই ১ নম্বর আর ৩
              নম্বর Packet দুইটা আলাদা পথে Singapore পৌঁছাতে পারে, আর ৩ নম্বর
              আগে পৌঁছে যেতে পারে। এমনকি একটা Packet পুরো হারিয়েও যেতে পারে,
              যদি কোনো Router এর সামনে এত ভিড় হয় যে সে নতুন Packet ফেলে দিতে
              বাধ্য হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "তাহলে ফাইলটা ভুল হয়ে যায় না কেন",
          content: (
            <p>
              কারণ প্রতিটা Packet এ নম্বর লেখা আছে। ওপাশের Kernel টুকরোগুলো যে
              ক্রমেই আসুক, নম্বর দেখে আবার সাজিয়ে নেয়, ১, ২, ৩, ৪, ৫। আর কোনো
              নম্বর না এলে বুঝে যায় ওটা হারিয়েছে, তখন এপাশকে বলে আবার পাঠাতে।
              এই পুরো সাজানো আর আবার চাওয়ার কাজটা যে ব্যবস্থা করে, তার নাম TCP,
              আর সেটা Module 05 এর পুরোটা। এই লেসনে আপনি শুধু সমস্যাটা দেখবেন,
              যেটার জন্য TCP লাগে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "journey",
      subHeader: { index: "002", title: "Visual Explanation" },
      title: <SectionTitle>ক্রম ভাঙে, একটা হারায়, তবু ফাইল ঠিক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পাঁচটা Packet ছেড়ে দিন আর দেখুন কী হয়। তারা ক্রম ভেঙে পৌঁছাবে,
              একটা হারিয়ে যাবে, আর তবু শেষে ফাইলটা নিখুঁত হবে। Step দিয়ে ধীরে
              ধীরে দেখুন, প্রতিটা ধাপে নিচের লেখাটা পড়ুন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PacketJourneyLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আপনার Program এই ঝামেলার কিছুই দেখে না",
          content: (
            <p>
              খেয়াল করার মতো ব্যাপার হলো, এই সব ওলটপালট Kernel এর ভেতরে ঘটে।
              আপনার node কোড fs.readFile বা একটা Response পড়ার সময় একটা
              নিখুঁত, ক্রমে সাজানো Data পায়। হারানো, আবার পাঠানো, ক্রমে সাজানো,
              সব Kernel সামলে নেয়, ঠিক যেমন Lesson 07 এ Syscall এর পেছনে আসল
              কাজটা Kernel করত। আপনি উপরের ধাপে বসে শুধু পরিষ্কার ফলটা পান।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "latency-bandwidth",
      subHeader: { index: "003", title: "The Confusion" },
      title: <SectionTitle>চওড়া পাইপ আর দ্রুত পাইপ এক নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার এই লেসনের সবচেয়ে দরকারি অংশ, কারণ এখানে একটা ভুল ধারণা
                ভাঙবে যেটা প্রায় সবার আছে। দুইটা শব্দ, Latency আর Bandwidth,
                মানুষ প্রায়ই এক করে ফেলে, অথচ এরা সম্পূর্ণ আলাদা দুইটা জিনিস।
              </ContentParagraph>
              <ContentParagraph>
                একটা পানির পাইপের কথা ভাবুন। <strong>Bandwidth</strong> মানে
                পাইপটা কত চওড়া, মানে এক সেকেন্ডে কতটুকু পানি ঢোকানো যায়। মাপা
                হয় Mbps তে, মানে সেকেন্ডে কত Megabit। আপনি যখন ১০০ Mbps এর একটা
                লাইন কেনেন, আপনি একটা চওড়া পাইপ কেনেন। <strong>Latency</strong>{" "}
                মানে একদম আলাদা জিনিস, এক ফোঁটা পানি পাইপের এক মাথা থেকে অন্য
                মাথায় পৌঁছাতে কতক্ষণ লাগে। মাপা হয় মিলিসেকেন্ডে।
              </ContentParagraph>
              <ContentParagraph>
                এখন মূল কথাটা। পাইপ যত চওড়াই করুন, এক ফোঁটা পানির এক মাথা থেকে
                অন্য মাথায় যেতে যে সময় লাগে, সেটা কমে না। চওড়া পাইপ মানে
                একসাথে বেশি পানি, দ্রুত পানি নয়। এই একটা কথা বুঝলে অর্ধেক
                ইন্টারনেট রহস্য পরিষ্কার হয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LatencyVsBandwidthSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              হাতে ধরে দেখা সবচেয়ে ভালো। নিচে দুইটা আলাদা হাতল, একটা Latency,
              একটা Bandwidth। একটা নাড়ুন, দেখুন কোন সংখ্যা বদলায় আর কোনটা
              বদলায় না। এটাই এই লেসনের আসল পরীক্ষা।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PipeLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "আমার ১০০ Mbps আছে, তবু সাইট ধীর কেন",
          content: (
            <p>
              এই প্রশ্নটা আপনি নিশ্চয়ই কারো মুখে শুনেছেন, বা নিজেই করেছেন।
              উত্তরটা এখন আপনার হাতে। একটা সাইট খোলা মানে শুধু বড় File নামানো
              নয়, বরং সার্ভারের সাথে অনেকবার ছোট ছোট কথা বলা, প্রতিটা কথার
              উত্তরের জন্য অপেক্ষা। প্রতিটা অপেক্ষা Latency, আর Latency চওড়া
              পাইপে কমে না। আপনার সার্ভার যদি US তে হয়, প্রতিটা কথায় ২২০
              মিলিসেকেন্ড যাওয়া আসা, আর দশটা কথা মানে দুই সেকেন্ড শুধু
              অপেক্ষায়, আপনার Bandwidth যতই থাক। এই কারণেই দ্রুত সাইটের আসল
              রহস্য কম Latency, আর সেটার সবচেয়ে বড় কৌশল সার্ভার ইউজারের কাছে
              আনা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "distance",
      subHeader: { index: "004", title: "The Floor" },
      title: (
        <SectionTitle>দূরত্বই সবচেয়ে কম Latency ঠিক করে দেয়</SectionTitle>
      ),
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Latency কমানোর একটা সীমা আছে, আর সীমাটা ঠিক করে দেয় আলো নিজে।
                আপনার Data কাচের তারের ভেতর দিয়ে আলো হয়ে যায়, আর আলো যত
                দ্রুতই হোক, অসীম দ্রুত নয়। কাচের ভেতরে আলো সেকেন্ডে প্রায় দুই
                লাখ কিলোমিটার যায়। শুনতে বিশাল, কিন্তু পৃথিবীটাও বড়।
              </ContentParagraph>
              <ContentParagraph>
                তার মানে দূরত্ব থেকেই একটা সবচেয়ে কম Latency ঠিক হয়ে যায়,
                যেটা যত টাকা দিলেও কমানো যায় না। US এর পশ্চিম উপকূল থেকে
                Bangladesh প্রায় উল্টো পিঠ, তাই আপনার একটা কথা ওখানে গিয়ে ফিরে
                আসতে অন্তত ২২০ মিলিসেকেন্ড লাগবেই। কোনো ISP, কোনো টাকা এটা কমাতে
                পারবে না, কারণ আলোর চেয়ে দ্রুত কিছু যায় না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DistanceLatencyDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই কারণেই Server আপনার কাছে এনে বসানো হয়",
          content: (
            <p>
              যেহেতু দূরত্ব কমানো ছাড়া Latency কমানোর উপায় নেই, বড় কোম্পানিরা
              একটা সহজ কাজ করে, তারা Server টাকেই আপনার কাছে এনে বসায়। YouTube
              এর একটা ভিডিও আপনি দেখলে সেটা সম্ভবত US থেকে আসে না, বরং Dhaka বা
              Singapore এর একটা কাছের মেশিন থেকে আসে, যেখানে জনপ্রিয় ভিডিওগুলোর
              একটা কপি রাখা আছে। এই কাছের মেশিনগুলোর জালকে বলে CDN, Content
              Delivery Network, আর এটা Module 12 এর একটা বড় বিষয়। আপাতত শুধু
              জানুন, দ্রুত সাইট বানানোর অর্ধেক মানে দূরত্ব কমানো।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>Island Tours এ কোনটা কোথায় লাগে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর সার্ভার Singapore এ, আর পর্যটকরা Bangladesh
                থেকে। এই দূরত্বটাই প্রতিদিন কয়েকটা সিদ্ধান্তে ঢুকে পড়ে, আর
                কোথায় Latency লাগে আর কোথায় Bandwidth, সেটা না বুঝলে ভুল
                জায়গায় টাকা খরচ হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Tour এর তালিকা, Latency এর খেলা:</strong> তালিকাটা
                  ছোট, কয়েক KB। এটা নামাতে Bandwidth লাগেই না বলা যায়। যা লাগে
                  তা Latency, কারণ পর্যটকের কথা Singapore গিয়ে ফিরতে ৬০
                  মিলিসেকেন্ড। পাতাটা যদি দশবার আলাদা কথা বলে, সেটা ৬০০
                  মিলিসেকেন্ড শুধু যাওয়া আসায়। তাই এই পাতা দ্রুত করার উপায়
                  Bandwidth বাড়ানো নয়, কথার সংখ্যা কমানো।
                </ListItem>
                <ListItem>
                  <strong>ছবিগুলো, Bandwidth এর খেলা:</strong> প্রতিটা Tour এর
                  সুন্দর সুন্দর ছবি, প্রতিটা কয়েক MB। এখানে Latency তুচ্ছ, আসল
                  হলো Bandwidth, পাইপ কত চওড়া। আর এই কারণেই ছবি Compress করা,
                  ছোট সাইজে পাঠানো, এত জরুরি। ছবির সাইজ অর্ধেক মানে নামার সময়
                  অর্ধেক।
                </ListItem>
                <ListItem>
                  <strong>একটা Packet হারালে ছবি নষ্ট হয় না:</strong> পর্যটকের
                  দুর্বল Mobile Network এ Packet প্রায়ই হারায়। কিন্তু ছবি ভাঙা
                  আসে না, শুধু একটু ধীরে আসে, কারণ হারানো Packet টা আবার পাঠানো
                  হয়। এই আবার পাঠানোই দুর্বল Network এ জিনিস ধীর লাগার আসল
                  কারণ, Bandwidth কম বলে নয়, Packet বেশি হারায় বলে।
                </ListItem>
                <ListItem>
                  <strong>ছবি CDN এ, তালিকা সার্ভারে:</strong> তাই বুদ্ধিমান
                  বন্দোবস্ত হলো, ভারী ছবিগুলো একটা CDN এ রাখা, যাতে সেগুলো
                  পর্যটকের কাছের মেশিন থেকে আসে, কম Latency আর কাছের চওড়া
                  পাইপে। আর বুকিং এর মতো আসল কাজ Singapore এর সার্ভারে, কারণ
                  সেখানে Database। এই ভাগটা Module 12 এ বিস্তারিত।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সবচেয়ে দামি ভুলটা এখানে",
          content: (
            <p>
              নতুন ডেভেলপাররা একটা ধীর সাইট দেখে প্রায়ই ভাবেন, সার্ভার বড়
              করলে, বেশি Bandwidth নিলে ঠিক হয়ে যাবে। কিন্তু সমস্যাটা যদি
              Latency হয়, মানে পাতাটা যদি সার্ভারের সাথে বিশবার আলাদা কথা বলে,
              তাহলে বড় সার্ভার এক ফোঁটাও সাহায্য করবে না। উত্তরটা কথার সংখ্যা
              কমানো, বা সার্ভার কাছে আনা। ভুল রোগে ভুল ওষুধ দিলে টাকা যায়, রোগ
              থাকে। তাই আগে মাপুন, সমস্যাটা Latency নাকি Bandwidth, তারপর ঠিক
              করুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "request-flow",
      subHeader: { index: "006", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা ছবি নামার পুরো হিসাব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটক একটা Tour এর ২ MB ছবি খুললেন, সার্ভার Singapore এ, Latency
              ৬০ মিলিসেকেন্ড, Bandwidth ২০ Mbps। সময়টা কোথায় কোথায় যায়, ধাপে
              ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রথম কথা: ছবিটা দাও",
              description:
                "Phone একটা ছোট Request পাঠাল। সেটা Singapore গিয়ে পৌঁছাতে ৬০ মিলিসেকেন্ড। এই সময়টা পুরোটাই Latency, Bandwidth এখানে কিছু করছে না।",
            },
            {
              title: "সার্ভার ছবিটা টুকরো করল",
              description:
                "২ MB ছবিকে Kernel হাজারের বেশি Packet এ ভাগ করল, প্রত্যেকে নম্বর দিয়ে। এবার এগুলো পাইপে ঢুকতে শুরু করবে।",
            },
            {
              title: "প্রথম Packet ফিরতি পথে",
              description:
                "প্রথম টুকরোটা Phone এ পৌঁছাতে আরও ৬০ মিলিসেকেন্ড। এ পর্যন্ত মোট ১২০ মিলিসেকেন্ড কেটে গেছে, আর ছবির একটা টুকরোও পুরো আসেনি। এটাই প্রথম Byte এর দেরি।",
            },
            {
              title: "বাকি টুকরো পাইপ ভরে আসতে থাকল",
              description:
                "এবার Bandwidth এর পালা। ২ MB মানে ১৬ Megabit। ২০ Mbps পাইপে সেটা ঢুকতে প্রায় ৮০০ মিলিসেকেন্ড। টুকরোগুলো একটার পিছে একটা, পাইপ যত চওড়া তত দ্রুত।",
            },
            {
              title: "দুই একটা হারাল, আবার এলো",
              description:
                "পর্যটকের Mobile Network দুর্বল, তাই কয়েকটা Packet হারাল। ওপাশ নম্বর দেখে বুঝল, আবার চাইল, সেগুলো আবার এলো। এতে আরও কিছু সময় যোগ হলো।",
            },
            {
              title: "Kernel সাজিয়ে ছবি দিল",
              description:
                "সব টুকরো এলে Kernel নম্বর ধরে সাজিয়ে পুরো ছবিটা Browser কে দিল। মোট সময় প্রায় এক সেকেন্ড, যার শুরুর অংশ Latency, বড় অংশ Bandwidth, আর একটু হারানোর মাশুল।",
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
                <strong>Code.org, Packets and Routing</strong>, এই লেসনের প্রথম
                অর্ধেকটা ছবিতে, একদম শূন্য থেকে।{" "}
                <a
                  href="https://www.youtube.com/playlist?list=PLzdnOPI1iJNfMRZm5DDxco3UdsFegvuB7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  youtube.com, How the Internet Works
                </a>
              </ListItem>
              <ListItem>
                <strong>নিজে মাপুন</strong>, একটা সাইট খুলে fast.com এ Bandwidth
                দেখুন, আর Terminal এ ping দিয়ে Latency দেখুন। দুইটা আলাদা
                সংখ্যা, আলাদা একক।
              </ListItem>
              <ListItem>
                <strong>High Performance Browser Networking</strong>, Ilya
                Grigorik এর বই, বিনামূল্যে পড়া যায়। Primer on Latency and
                Bandwidth অধ্যায়টা এই লেসনের পরের ধাপ।{" "}
                <a
                  href="https://hpbn.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  hpbn.co
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
                Internet একটানা কিছু পাঠায় না। বড় কথা ছোট টুকরোয় ভাগ হয়,
                প্রতিটার নাম Packet, প্রতিটায় নম্বর লেখা, সে কত নম্বর, মোট
                কয়টা।
              </ListItem>
              <ListItem>
                Packet রা আলাদা রাস্তায় যায়, তাই ক্রম ভেঙে পৌঁছাতে পারে, আর
                কোনোটা হারাতেও পারে যদি Router ভিড়ে ফেলে দেয়।
              </ListItem>
              <ListItem>
                ওপাশের Kernel নম্বর দেখে আবার সাজায়, হারানোটা আবার চায়, তারপর
                নিখুঁত Data Program কে দেয়। এই ব্যবস্থার নাম TCP, বিস্তারিত
                Module 05 এ।
              </ListItem>
              <ListItem>
                Bandwidth মানে পাইপ কত চওড়া, এক সেকেন্ডে কত Data, মাপা হয় Mbps
                তে। Latency মানে এক Packet এক মাথা থেকে অন্য মাথায় কত সময়ে,
                মাপা হয় মিলিসেকেন্ডে।
              </ListItem>
              <ListItem>
                দুইটা আলাদা জিনিস। পাইপ চওড়া করলে ফোঁটা দ্রুত যায় না। তাই ১০০
                Mbps কিনেও সাইট ধীর লাগতে পারে, যদি সমস্যাটা Latency হয়।
              </ListItem>
              <ListItem>
                দূরত্বই সবচেয়ে কম Latency ঠিক করে, কারণ আলোর চেয়ে দ্রুত কিছু
                যায় না। US এ যাওয়া আসায় অন্তত ২২০ মিলিসেকেন্ড, যত টাকাই দিন।
              </ListItem>
              <ListItem>
                তাই Server ইউজারের কাছে এনে বসানো হয়, CDN দিয়ে। ছোট কথায়
                Latency লাগে, বড় File এ Bandwidth। ভুল রোগে ভুল ওষুধ দিলে টাকা
                যায়, রোগ থাকে।
              </ListItem>
              <ListItem>
                পরের লেসন: এই Packet গুলো আসলে কোন পথে যায়, সমুদ্রের নিচের তার
                থেকে Router Hop পর্যন্ত পুরো শারীরিক যাত্রা।
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
        <span className="font-bold text-primary">Packet</span>,
        "একটা বড় কথার ছোট টুকরো, নম্বর লেখা খামে",
      ],
      [
        <span className="font-bold text-primary">Reorder</span>,
        "Packet ক্রম ভেঙে পৌঁছানো, আলাদা রাস্তায় যায় বলে",
      ],
      [
        <span className="font-bold text-primary">Packet Loss</span>,
        "Router ভিড়ে Packet ফেলে দেওয়া, আবার পাঠাতে হয়",
      ],
      [
        <span className="font-bold text-primary">Latency</span>,
        "এক Packet এক মাথা থেকে অন্য মাথায়, মিলিসেকেন্ডে",
      ],
      [
        <span className="font-bold text-primary">Bandwidth</span>,
        "এক সেকেন্ডে কত Data, পাইপ কত চওড়া, Mbps তে",
      ],
      [
        <span className="font-bold text-primary">Round Trip</span>,
        "কথা গিয়ে উত্তর ফিরে আসা, Latency এর দ্বিগুণ",
      ],
      [
        <span className="font-bold text-primary">প্রথম Byte</span>,
        "প্রথম টুকরো পৌঁছাতে সময়, Latency এর উপর",
      ],
      [
        <span className="font-bold text-primary">CDN</span>,
        "Server ইউজারের কাছে এনে বসানো, Latency কমাতে",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা ছবি পাঠানোর সময় ৩ নম্বর Packet ২ নম্বরের আগে পৌঁছাল। এটা কি সমস্যা?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, ছবিটা ভাঙা আসবে",
            isCorrect: false,
            explanation:
              "ভাঙা আসে না। প্রতিটা Packet এ নম্বর লেখা, তাই ওপাশ ক্রমে সাজিয়ে নেয়।",
          },
          {
            key: "B",
            text: "না, স্বাভাবিক। Packet রা আলাদা রাস্তায় যায়, Kernel নম্বর দেখে সাজায়",
            isCorrect: true,
            explanation:
              "এটাই রোজকার ঘটনা। প্রত্যেকে নিজের রাস্তা পায় বলেই ক্রম ভাঙে, আর নম্বর আছে বলেই ঠিক হয়ে যায়।",
          },
          {
            key: "C",
            text: "না, কারণ Packet কখনো ক্রম ভাঙে না",
            isCorrect: false,
            explanation:
              "ক্রম প্রায়ই ভাঙে। সেটাই স্বাভাবিক, আর সেই কারণেই নম্বর লাগে।",
          },
        ],
      },
      {
        id: 2,
        text: "আপনার Bandwidth ১০০ Mbps, তবু একটা সাইট ধীর লাগছে। সবচেয়ে সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "Bandwidth আসলে কম, প্রোভাইডার মিথ্যা বলছে",
            isCorrect: false,
            explanation:
              "হতে পারে, কিন্তু বেশিরভাগ ক্ষেত্রে না। ধীর সাইটের সবচেয়ে চেনা কারণ Bandwidth নয়।",
          },
          {
            key: "B",
            text: "সমস্যাটা Latency, সাইটটা সার্ভারের সাথে অনেকবার কথা বলছে, আর সার্ভার দূরে",
            isCorrect: true,
            explanation:
              "প্রতিটা কথায় যাওয়া আসার সময় Latency, আর সেটা চওড়া পাইপে কমে না। দশ কথা মানে দশগুণ অপেক্ষা।",
          },
          {
            key: "C",
            text: "আপনার Wi-Fi এর সমস্যা",
            isCorrect: false,
            explanation:
              "হতে পারে, কিন্তু প্রশ্নটা Bandwidth ঠিক থাকলেও কেন ধীর। উত্তর Latency।",
          },
        ],
      },
      {
        id: 3,
        text: "US এর একটা সার্ভারে আপনার Latency ২২০ মিলিসেকেন্ড। বেশি টাকা দিয়ে ভালো ISP নিলে এটা ৫০ এ নামবে?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, ভালো লাইনে Latency কমে",
            isCorrect: false,
            explanation:
              "ভালো লাইন Bandwidth বাড়ায়, দূরত্ব কমায় না। আলো তার নির্দিষ্ট গতিতেই যায়।",
          },
          {
            key: "B",
            text: "না, দূরত্বই সীমা ঠিক করে, আলোর চেয়ে দ্রুত কিছু যায় না",
            isCorrect: true,
            explanation:
              "US প্রায় উল্টো পিঠ। যত টাকাই দিন, আলোর যাওয়া আসায় ২২০ মিলিসেকেন্ড লাগবেই। উপায় একটাই, সার্ভার কাছে আনা।",
          },
          {
            key: "C",
            text: "হ্যাঁ, যদি Fiber লাইন নেন",
            isCorrect: false,
            explanation:
              "Data তো এমনিতেই বেশিরভাগ পথ Fiber এ যায়। তবু দূরত্বের সীমা থেকেই যায়।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা ৫০ MB ভিডিও নামাচ্ছেন। কোনটা সময়টা সবচেয়ে বেশি ঠিক করবে?",
        options: [
          {
            key: "A",
            text: "Latency, প্রথম Byte কত দ্রুত এলো",
            isCorrect: false,
            explanation:
              "Latency শুধু শুরুর ধাক্কাটা দেয়। ৫০ MB এর বেশিরভাগ সময় পাইপ ভরে বিট ঢোকানোয় যায়।",
          },
          {
            key: "B",
            text: "Bandwidth, পাইপ কত চওড়া",
            isCorrect: true,
            explanation:
              "বড় File মানে অনেক বিট। যত চওড়া পাইপ, তত দ্রুত ঢোকে। এখানে Bandwidth রাজা।",
          },
          {
            key: "C",
            text: "Packet এর সংখ্যা",
            isCorrect: false,
            explanation:
              "Packet সংখ্যা তো Bandwidth আর সাইজ থেকেই আসে। আসল হাতল Bandwidth।",
          },
        ],
      },
      {
        id: 5,
        text: "দুর্বল Mobile Network এ ছবি ভাঙা আসে না, শুধু ধীরে আসে। কেন?",
        options: [
          {
            key: "A",
            text: "দুর্বল Network কম Bandwidth দেয়, তাই ধীর",
            isCorrect: false,
            explanation:
              "Bandwidth কমও থাকতে পারে, কিন্তু ভাঙা না আসার আসল কারণ আলাদা। ইঙ্গিত: হারানো Packet।",
          },
          {
            key: "B",
            text: "Packet হারায় বেশি, প্রতিটা হারানো Packet আবার পাঠাতে হয়, তাই সময় লাগে কিন্তু ফাইল নিখুঁত থাকে",
            isCorrect: true,
            explanation:
              "হারানো Packet আবার চাওয়া হয়, আর সেটাই দেরির কারণ। কিন্তু নম্বর আছে বলে শেষ ছবিটা ঠিকই সম্পূর্ণ।",
          },
          {
            key: "C",
            text: "ছবিটা ছোট করে পাঠানো হয়",
            isCorrect: false,
            explanation:
              "ছবি ছোট হয় না, সম্পূর্ণই আসে, শুধু হারানো টুকরো আবার পাঠানোর জন্য দেরি হয়।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Latency আর Bandwidth নিজে মাপুন",
    subtitle: "Terminal আর Browser, পাঁচটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "Latency মাপুন",
        description:
          "কাছের আর দূরের কয়েকটা সার্ভারে ping করুন, আর time= এর সংখ্যাটা তুলনা করুন। দূরত্ব বাড়লে সংখ্যাটা কীভাবে বাড়ে দেখুন।",
      },
      {
        title: "হাত গুনুন আর সময় যোগ করুন",
        description:
          "traceroute এ প্রতিটা hop এর সময় দেখুন। প্রতিটা লাইন একটু করে সময় যোগ করে, আর যোগফলই আপনার মোট Latency।",
      },
      {
        title: "Bandwidth মাপুন",
        description:
          "একটা বড় ফাইল নামিয়ে গতি দেখুন। এটা Mbps তে, আর ping এর ms এর সাথে এর কোনো সম্পর্ক নেই, দুইটা আলাদা মাপ।",
      },
      {
        title: "Packet Loss বানান",
        description:
          'ধীরে ধীরে দূরের একটা সার্ভারে অনেকগুলো ping পাঠান, আর "packet loss" এর শতাংশটা দেখুন। শূন্য না হলে বুঝবেন কিছু হারিয়েছে।',
      },
      {
        title: "ছোট আর বড় এর তফাত অনুভব করুন",
        description:
          "একটা ছোট Request আর একটা বড় File একই সার্ভার থেকে আনুন। ছোটটায় Latency টের পাবেন, বড়টায় Bandwidth।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-measure-latency.sh",
        language: "bash",
        code: `# কাছের, ধরে নিন আপনার ISP এর একটা মেশিন বা bd সাইট
ping -c 5 google.com

# দূরের, ইচ্ছে করে একটা আমেরিকান সার্ভার
ping -c 5 github.com

# time= এর পরের সংখ্যাগুলো তুলনা করুন, সব মিলিসেকেন্ডে।
# কাছেরটা হয়তো ২০ থেকে ৬০, দূরেরটা ২০০ এর কাছাকাছি।
# min/avg/max লাইনটা দেখুন, avg টাই আপনার গড় Latency।
# একই কমান্ড, শুধু গন্তব্য আলাদা, আর সংখ্যাটা দূরত্ব ধরে বাড়ে।`,
      },
      {
        filename: "2-trace-and-add.sh",
        language: "bash",
        code: `# প্রতিটা hop এর নিজের সময়
traceroute github.com          # macOS, Linux
# Windows: tracert github.com

# প্রতিটা লাইনে তিনটা করে ms দেখবেন, ওই hop পর্যন্ত যাওয়া আসার সময়।
# উপর থেকে নিচে সংখ্যাগুলো বাড়তে থাকে, কারণ প্রতিটা hop দূরত্ব যোগ করে।
# শেষ লাইনের সংখ্যাটাই মোটামুটি আপনার মোট Latency।
#
# একটা জায়গায় হঠাৎ বড় লাফ দেখলে, সম্ভবত ওখানেই সমুদ্র পার হলো।`,
      },
      {
        filename: "3-measure-bandwidth.sh",
        language: "bash",
        code: `# একটা বড় ফাইল নামিয়ে গতি দেখুন
curl -o /dev/null https://speed.hetzner.de/100MB.bin
# curl নিজেই নিচে একটা গতি দেখায়, যেমন 12.4M মানে সেকেন্ডে ১২.৪ Megabyte।
# Megabyte কে ৮ দিয়ে গুণ করলে Megabit, মানে প্রায় ১০০ Mbps।

# Browser এ সহজ উপায়: fast.com খুলুন, একটা সংখ্যা দেখাবে, Mbps তে।
#
# এবার মিলিয়ে দেখুন: fast.com এর Mbps আর ping এর ms।
# দুইটা একদম আলাদা সংখ্যা, আলাদা একক, আর একটা বাড়ালে অন্যটা বাড়ে না।
# এই দুই সংখ্যাই একসাথে আপনার Internet এর পুরো ছবি।`,
      },
      {
        filename: "4-make-packet-loss.sh",
        language: "bash",
        code: `# অনেকগুলো ping পাঠিয়ে হারানোর হিসাব দেখুন
ping -c 50 github.com | tail -3

# শেষের দিকে একটা লাইন:
#   50 packets transmitted, 48 received, 4% packet loss
# 4% মানে ৫০টার মধ্যে ২টা হারিয়েছে।
#
# ভালো তারে এটা প্রায় সবসময় 0%। Mobile এ বা দুর্বল Wi-Fi তে বাড়ে।
# Packet loss বাড়লে জিনিস ধীর লাগে, কারণ হারানো Packet আবার পাঠাতে হয়,
# Bandwidth কম বলে নয়।

# চাইলে নিজে হারানো বানিয়ে দেখুন (Linux, sudo লাগবে, সাবধানে):
#   sudo tc qdisc add dev eth0 root netem loss 10%
#   ... এখন সব ধীর লাগবে ...
#   sudo tc qdisc del dev eth0 root netem      # ফেরত আনুন`,
      },
      {
        filename: "5-small-vs-big.sh",
        language: "bash",
        code: `# ছোট Request, এখানে Latency ই সব
time curl -s -o /dev/null https://api.github.com
# মোট সময় প্রায় আপনার Round Trip এর সমান, কয়েকশো মিলিসেকেন্ড।
# ফাইল ছোট, তাই Bandwidth এর কিছু করার নেই।

# বড় File, এখানে Bandwidth ই সব
time curl -s -o /dev/null https://speed.hetzner.de/100MB.bin
# মোট সময় অনেক বেশি, আর প্রায় পুরোটাই বিট ঢোকানোর সময়।
# Latency শুধু শুরুর কয়েকশো মিলিসেকেন্ড, বাকিটা Bandwidth।
#
# একই কমান্ড, একই সার্ভার, শুধু সাইজ আলাদা। দুই ক্ষেত্রে দুই জিনিস রাজা।`,
      },
    ],
    tip: "তিন নম্বর পরীক্ষার দুইটা সংখ্যা পাশাপাশি রাখুন, fast.com এর Mbps আর ping এর ms। এই দুই সংখ্যাই একসাথে আপনার Internet কে বর্ণনা করে, আর কোনো একটা দিয়ে অন্যটা অনুমান করা যায় না। বন্ধুকে জিজ্ঞেস করুন তাঁর Internet কেমন, আর যদি শুধু Mbps বলেন, বুঝবেন তিনি অর্ধেক ছবি দেখছেন। দ্রুত সাইটের জন্য দুইটাই লাগে, কিন্তু দুইটা দুই কাজে।",
  },
  assignment: {
    title: "Mini Project: আপনার Internet এর দুইটা সংখ্যা",
    time: "১ ঘণ্টা",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>একটা ছোট টেবিল বানান:</strong> পাঁচটা আলাদা সাইটে ping করুন,
        তিনটা Bangladeshi আর দুইটা বিদেশি। প্রতিটার avg Latency লিখুন। তারপর ছোট
        থেকে বড় ক্রমে সাজান। ক্রমটা কি দূরত্বের সাথে মেলে?
      </span>,
      <span key="2">
        <strong>দুইটা সংখ্যা আলাদা করুন:</strong> fast.com এ আপনার Bandwidth
        মাপুন, আর একটা কাছের সাইটে ping দিয়ে Latency মাপুন। দুইটা একসাথে লিখুন,
        এককসহ। এক লাইনে লিখুন কোন কাজে কোনটা বেশি জরুরি।
      </span>,
      <span key="3">
        <strong>my-tours এ ভাবুন:</strong> আপনার my-tours এ কোন কোন জিনিস ছোট
        কথা (Latency এর খেলা) আর কোনগুলো বড় File (Bandwidth এর খেলা)? অন্তত
        তিনটা করে লিখুন, আর প্রতিটার জন্য দ্রুত করার একটা উপায় ভাবুন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু বললেন, আমি তো
        ১৫০ Mbps কিনেছি, তবু PUBG এ ল্যাগ করে কেন? তাঁকে Latency আর Bandwidth এর
        তফাত দিয়ে বোঝান, পাইপের উদাহরণ ব্যবহার করতে পারেন।
      </span>,
    ],
    deliverables: [
      <span key="1">পাঁচটা সাইটের Latency, দূরত্বের ক্রমে সাজানো</span>,
      <span key="2">আপনার Bandwidth আর Latency, একক সহ, আর কোনটা কী কাজে</span>,
      <span key="3">
        my-tours এর তিনটা Latency আর তিনটা Bandwidth এর জিনিস
      </span>,
      <span key="4">PUBG ল্যাগের ব্যাখ্যা, ৫ লাইনে</span>,
    ],
  },
};
