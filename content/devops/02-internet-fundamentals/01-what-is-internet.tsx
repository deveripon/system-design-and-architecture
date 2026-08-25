/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  GrowingNetworkLab,
  NoCenterLab,
} from "../../../components/course/topics/internet/animations";
import {
  InternetVsWebDiagram,
  NetworkOfNetworksDiagram,
  ProtocolAgreementDiagram,
} from "../../../components/course/topics/internet/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const whatIsInternetContent: TopicData = {
  id: "what-is-internet",
  introduction: {
    badge: "MODULE 02 · LESSON 01",
    title: <SectionTitle>রাস্তাগুলোর মালিক কে?</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের মডিউলে আমরা পুরোটা সময় একটা মেশিনের ভেতরে ছিলাম। Bit থেকে CPU,
          RAM থেকে Disk, Kernel থেকে Process। এবার আমরা প্রথমবার বাইরে বেরোব, আর
          দেখব একটা মেশিন অন্য একটা মেশিনের সাথে কথা বলে কীভাবে, বিশেষ করে যখন
          অন্য মেশিনটা পাঁচ হাজার কিলোমিটার দূরে।
        </ContentParagraph>
        <ContentParagraph>
          শুরুটা হোক একটা প্রশ্ন দিয়ে যেটা শুনতে সহজ, কিন্তু উত্তরটা একটু অবাক
          করে। আপনি Cox&apos;s Bazar থেকে গাড়িতে উঠে Dhaka যেতে পারেন, একটানা, কোথাও
          না থেমে। কিন্তু ওই রাস্তার মালিক কে? আপনার বাসার সামনের গলি আপনার
          বিল্ডিংয়ের। শহরের রাস্তা City Corporation এর। হাইওয়ে সড়ক বিভাগের।
          ফেরির ঘাট আরেক দপ্তরের। কেউ পুরো রাস্তাটার মালিক নয়, তবু আপনি একটানা
          যেতে পারেন।
        </ContentParagraph>
        <ContentParagraph>
          Internet ঠিক এই জিনিস। এই লেসনে আমরা বুঝব এটা আসলে কী, কে বানিয়েছে,
          কার মালিকানায় চলে, আর কোন একটা জিনিসের জন্য হাজারটা আলাদা কোম্পানির
          তার মিলে একটা জিনিস হয়ে উঠেছে। উত্তরগুলো জানার পর আপনি Internet
          শব্দটা আর আগের মতো শুনবেন না।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "Internet কোনো একটা জিনিস নয়। এটা লক্ষ লক্ষ নেটওয়ার্ক, যারা একে অন্যের সাথে একই নিয়মে কথা বলতে রাজি হয়েছে।",
      author: "Internet Fundamentals",
      role: "Lesson 01",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "network",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>দুইটা কম্পিউটার, একটা তার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে ছোট জায়গা থেকে শুরু করি। আপনার হাতে দুইটা Laptop আছে,
                আর একটা তার। তারটা দুইটার মাঝে লাগিয়ে দিলে একটা Laptop অন্যটাকে
                ফাইল পাঠাতে পারে। এই সবচেয়ে ছোট জিনিসটার একটা নাম আছে, Network।
                দুই বা তার বেশি মেশিন, যারা একে অন্যের সাথে কথা বলতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                এবার বাসায় পাঁচটা যন্ত্র হলো। Laptop, দুইটা Phone, একটা TV,
                একটা Printer। প্রত্যেকের সাথে প্রত্যেকের তার টানতে গেলে দশটা তার
                লাগে, আর ঘরটা মাকড়সার জালের মতো হয়ে যায়। তাই মাঝখানে একটা
                বাক্স বসানো হয়, আর সবাই ওই বাক্সে জোড়া লাগে। বাক্সটার নাম
                Router, আর আপনার বাসার Wi-Fi আসলে এই ছবিটাই, শুধু তারের বদলে
                বাতাস দিয়ে। এটাও একটা Network, আপনার বাসার Network, আর এর মালিক
                আপনি।
              </ContentParagraph>
              <ContentParagraph>
                এখন আসল প্রশ্নটা। আপনার বাসার Network আর আপনার বন্ধুর বাসার
                Network, এই দুইটা কথা বলবে কীভাবে? আপনি তো বন্ধুর বাসা পর্যন্ত
                তার টানতে যাবেন না। এখানেই একটা তৃতীয় পক্ষ ঢোকে। একটা কোম্পানি,
                যেমন Link3 বা Grameenphone, যার নিজের একটা বিশাল Network আছে
                সারা শহরে ছড়ানো। আপনার Router ওই কোম্পানির তারে জোড়া লাগে,
                আপনার বন্ধুর Router ও লাগে। এখন আপনাদের দুই Network কথা বলছে,
                একটা তৃতীয় Network এর মধ্য দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "নামটার ভেতরেই উত্তর লুকানো",
          content: (
            <p>
              Inter মানে মাঝখানে, Network মানে জোড়া লাগানো মেশিন। Internet মানে
              নেটওয়ার্কগুলোর মাঝখানের জিনিস, মানে আলাদা আলাদা নেটওয়ার্ককে যা
              জোড়া লাগায়। Internet কোনো একটা নেটওয়ার্ক নয়, Internet হলো লক্ষ
              লক্ষ নেটওয়ার্কের জোড়া। আপনার বাসাটা তার একটা। GP এর টাওয়ারগুলো
              আরেকটা। Singapore এর একটা Datacenter আরেকটা। আর এই জোড়া লাগানোটা
              কেউ একজন করেনি, সবাই মিলে করেছে, একটু একটু করে, কয়েক দশক ধরে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "growing",
      subHeader: { index: "002", title: "Visual Explanation" },
      title: (
        <SectionTitle>কেউ বানায়নি, জোড়া লাগতে লাগতে হয়ে গেছে</SectionTitle>
      ),
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              উপরের গল্পটা পাঁচ ধাপে ছবিতে দেখুন। প্রতিটা ধাপে কমলা রঙের জিনিসটা
              নতুন যোগ হয়েছে। খেয়াল করার মতো ব্যাপার একটাই, কোনো ধাপে কেউ
              Internet বানাচ্ছে না। প্রতিবার শুধু একটা Network আরেকটার সাথে
              জোড়া লাগছে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <GrowingNetworkLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষ ধাপের ছবিটাকে একটু অন্যভাবে আঁকলে মালিকানার ব্যাপারটা স্পষ্ট
              হয়। নিচে তিনটা Network পাশাপাশি, তিনজন আলাদা মালিক, আর তাদের মাঝে
              জোড়া।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetworkOfNetworksDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তাহলে Internet এর মালিক কে? উত্তরটা এখন আপনি নিজেই দিতে পারবেন।
              কেউ না। প্রতিটা টুকরোর মালিক আছে, আপনার Router আপনার, GP এর তার GP
              এর, সমুদ্রের নিচের তারটা কয়েকটা কোম্পানি মিলে বসিয়েছে। কিন্তু
              পুরোটার মালিক কেউ নয়, ঠিক যেমন Cox&apos;s Bazar থেকে Dhaka র পুরো
              রাস্তাটার মালিক কেউ নয়। কিছু সংস্থা আছে যারা নিয়ম ঠিক করে আর
              ঠিকানা বিলি করে, কিন্তু তারা মালিক নয়, তারা রেফারি।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "no-center",
      subHeader: { index: "003", title: "No Centre" },
      title: <SectionTitle>একটা রাস্তা বন্ধ হলে অন্যটা আছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উপরের ছবিতে একটা জিনিস হয়তো আপনার চোখে পড়েছে। জোড়াগুলো
                এলোমেলো। কোনো একটা মাঝের বাক্স নেই যেখান থেকে সব তার বেরিয়েছে।
                এটা দুর্ঘটনা নয়, এটা ইচ্ছে করে করা, আর কারণটা একটা ভয় থেকে
                আসা।
              </ContentParagraph>
              <ContentParagraph>
                ১৯৬০ এর দশকে আমেরিকার সরকার যখন এই ধারণাটা প্রথম বানাচ্ছিল, তখন
                তাঁদের মাথায় ছিল যুদ্ধ। প্রশ্নটা ছিল, একটা শহর যদি উড়ে যায়,
                বাকি শহরগুলো কথা বলতে পারবে কি? টেলিফোন ব্যবস্থায় পারত না, কারণ
                সব লাইন কয়েকটা কেন্দ্র দিয়ে যেত, আর কেন্দ্র গেলে সব যেত। তাই
                নতুন ব্যবস্থাটা এমন করে বানানো হলো যেখানে কোনো কেন্দ্র নেই।
                প্রতিটা জায়গা থেকে অনেক দিকে রাস্তা, আর একটা বন্ধ হলে বার্তা
                নিজেই অন্য রাস্তা খুঁজে নেয়।
              </ContentParagraph>
              <ContentParagraph>
                কথাটা শুনে বোঝার চেয়ে হাতে ধরে দেখা সহজ। নিচে দুইটা Network
                পাশাপাশি। বাম পাশে Internet এর মতো, ডান পাশে একটা কেন্দ্র সহ।
                যেকোনো বাক্সে চেপে সেটা কেটে দিন, আর দেখুন আপনার বার্তা Tours
                সার্ভার পর্যন্ত যেতে পারছে কিনা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NoCenterLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এই কারণেই Internet বন্ধ করা এত কঠিন",
          content: (
            <p>
              আপনি হয়তো খবরে দেখেছেন, কোনো দেশ Internet বন্ধ করে দিয়েছে।
              খেয়াল করলে দেখবেন সেটা সবসময় একটা দেশের ভেতরে, আর সেটাও করতে হয়
              সব ISP কে আলাদা করে বলে। পুরো Internet বন্ধ করার কোনো একটা সুইচ
              কোথাও নেই, কারণ কোনো একটা জায়গা নেই যেখান দিয়ে সবকিছু যায়। বাম
              পাশের ছবিতে আপনি যতগুলো বাক্স কাটতে বাধ্য হলেন, সেটাই এর কারণ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "protocol",
      subHeader: { index: "004", title: "Protocol" },
      title: (
        <SectionTitle>তার Internet বানায় না, রাজি হওয়াটা বানায়</SectionTitle>
      ),
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন একটা জিনিস ভাবুন যেটা প্রথমে চোখে পড়ে না। আপনার Phone
                বানিয়েছে Samsung, আপনার Laptop Apple, Island Tours এর সার্ভারে
                Linux চলে, আর মাঝখানের Router গুলো বানিয়েছে আরও দশটা আলাদা
                কোম্পানি। এরা একে অন্যকে বোঝে কীভাবে? Samsung আর Apple তো একসাথে
                বসে কিছু ঠিক করেনি।
              </ContentParagraph>
              <ContentParagraph>
                একটা আন্তর্জাতিক সম্মেলনের কথা ভাবুন। ত্রিশটা দেশের মানুষ,
                ত্রিশটা ভাষা। তাঁরা কথা বলতে পারেন একটা মাত্র কারণে, সবাই আগে
                থেকে রাজি হয়েছেন যে সম্মেলনে English বলা হবে। কেউ English এর
                মালিক নয়, কেউ কাউকে বাধ্য করেনি, শুধু সবাই রাজি হয়েছেন। রাজি
                না হলে ত্রিশটা মাইক্রোফোন থাকলেও একটা কথাও হতো না।
              </ContentParagraph>
              <ContentParagraph>
                কম্পিউটারের দুনিয়ায় এই আগে থেকে রাজি হওয়া নিয়মটার নাম
                Protocol। কথা শুরু করার আগে কী বলতে হবে, একটা বার্তা কত বড় হবে,
                ঠিকানা কোথায় লেখা থাকবে, উত্তর না এলে কী করতে হবে, এই সবকিছু
                আগে থেকে লেখা। আর Internet এর সাধারণ নিয়মটার নাম TCP/IP।
                Samsung, Apple, Linux, সবাই এই একটা নিয়মে কথা বলতে রাজি হয়েছে,
                আর সেই রাজি হওয়াটাই Internet কে সম্ভব করেছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProtocolAgreementDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "TCP/IP নিয়ে আপাতত এটুকুই",
          content: (
            <p>
              TCP/IP এর ভেতরে কী লেখা আছে, সেটা Module 05 এর পুরোটা। আপাতত শুধু
              এটুকু মনে রাখুন, এটা একটা লেখা নিয়ম, কোনো যন্ত্র বা তার নয়। কোনো
              কোম্পানি এর মালিক নয়, আর এটা বিনামূল্যে পড়া যায়। এই দুইটা
              কারণেই পৃথিবীর যেকোনো কোম্পানি চাইলেই নিজের যন্ত্রকে Internet এ
              যোগ দেওয়াতে পারে, কারো অনুমতি না নিয়ে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "address",
      subHeader: { index: "005", title: "Address" },
      title: <SectionTitle>ঠিকানা ছাড়া চিঠি যায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়মে রাজি হওয়ার পরেও একটা জিনিস বাকি থাকে। আপনি Singapore এর
                একটা সার্ভারকে কিছু বলতে চান। কিন্তু Internet এ কোটি কোটি মেশিন।
                আপনার বার্তা ঠিক ওই মেশিনটার কাছে পৌঁছাবে কীভাবে? ঠিক যে কারণে
                একটা চিঠির উপরে ঠিকানা লিখতে হয়, সেই কারণে।
              </ContentParagraph>
              <ContentParagraph>
                Internet এ যোগ দেওয়া প্রতিটা মেশিনের একটা ঠিকানা থাকে, সংখ্যা
                দিয়ে লেখা, যেমন 103.94.135.2। এই ঠিকানাটার নাম IP Address।
                আপনার বার্তার উপরে এই ঠিকানা লেখা থাকে, আর মাঝের প্রতিটা Network
                শুধু ঠিকানা দেখে ঠিক করে বার্তাটা কোন দিকে ঠেলে দেবে, ঠিক যেমন
                Post Office এর লোক খামের উপরের জেলার নাম দেখে সেটা ঠিক গাড়িতে
                তোলেন। ভেতরে কী লেখা, তা তাঁকে পড়তে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                একটা মজার ব্যাপার এখনই বলে রাখি, যেটা পরে কাজে লাগবে। আপনার
                Laptop এর আসলে দুইটা ঠিকানা। একটা আপনার বাসার ভেতরের, যেটা
                Router দিয়েছে, যেমন 192.168.0.5, আর সেটা শুধু বাসার ভেতরে কাজ
                করে। আরেকটা বাইরের দুনিয়া যেটা দেখে, যেটা আসলে আপনার Router এর
                ঠিকানা। বাসার ভেতরে আপনার ঘরের নম্বর আছে, কিন্তু চিঠি আসে বাড়ির
                ঠিকানায়। কেন এমন, আর এর ফলে কী কী হয়, সেটা Module 03 এ
                বিস্তারিত। আপাতত নিচের Lab এ দুইটা ঠিকানা নিজের চোখে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "internet-vs-web",
      subHeader: { index: "006", title: "Internet vs Web" },
      title: <SectionTitle>Facebook বন্ধ মানে Internet বন্ধ নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ভুল ধারণা আছে যেটা প্রায় সবার মধ্যে থাকে, আর সেটা ভাঙা এই
                লেসনের একটা বড় কাজ। অনেকে ভাবেন Internet মানে Browser এ যা দেখা
                যায়। Facebook, YouTube, Google, এগুলোই Internet। কথাটা ঠিক নয়,
                আর তফাতটা বুঝলে অনেক কিছু পরিষ্কার হয়ে যায়।
              </ContentParagraph>
              <ContentParagraph>
                রাস্তার উদাহরণে ফিরে যাই। রাস্তা একটা জিনিস। তার উপরে বাস চলে,
                ট্রাক চলে, রিকশা চলে, অ্যাম্বুলেন্স চলে। বাস হলো রাস্তার উপরে
                চলা একটা জিনিস, বাস রাস্তা নয়। সব বাস বন্ধ হয়ে গেলেও রাস্তা
                থাকে, ট্রাক চলে।
              </ContentParagraph>
              <ContentParagraph>
                Internet হলো রাস্তা। Web, মানে Browser এ যা দেখেন, হলো তার উপরে
                চলা একটা জিনিস। Email আরেকটা। Video Call আরেকটা। Online Game
                আরেকটা। আপনি Terminal থেকে যে সার্ভারে ঢোকেন, সেটাও আরেকটা।
                এগুলো সবাই একই Internet ব্যবহার করে, কিন্তু এগুলো Internet নয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <InternetVsWebDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "দুইটা ভাঙা, দুই রকম",
          content: (
            <p>
              Facebook বন্ধ হয়ে গেলে আপনার Email আসে, Zoom চলে, অন্য Website
              খোলে। ভেঙেছে Web এর একটা জিনিস, রাস্তা ঠিক আছে। আর আপনার Wi-Fi এর
              তার খুলে ফেললে সবকিছু একসাথে বন্ধ, Email, Zoom, Game, সব। এবার
              রাস্তাটাই নেই। কাজে এই তফাতটা প্রতিদিন লাগবে, কারণ কেউ যখন বলবেন
              সাইট খুলছে না, আপনার প্রথম প্রশ্ন হবে, শুধু এই সাইট, নাকি সবকিছু?
              উত্তরটাই বলে দেবে সমস্যাটা কোথায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "project",
      subHeader: { index: "007", title: "Project Example" },
      title: <SectionTitle>Island Tours Internet এ আছে মানে কী</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর সার্ভার Singapore এর একটা Datacenter এ বসানো
                একটা মেশিন। একজন পর্যটক Cox&apos;s Bazar এর সৈকতে বসে Phone থেকে
                বুকিং করেন। এই দুইজনের মাঝে যা কিছু আছে, তার পুরোটাই এই লেসনের
                গল্প, আর সেখান থেকে কয়েকটা বাস্তব ব্যাপার সরাসরি বেরিয়ে আসে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পথটার মালিক অন্তত পাঁচজন:</strong> পর্যটকের Phone থেকে
                  GP এর টাওয়ার, GP এর Network, সমুদ্রের নিচের তার, Singapore এর
                  ISP, Datacenter এর নিজের Network, তারপর সার্ভার। Island Tours
                  এর মালিক এই পথের কোনো অংশেরই মালিক নন। তিনি শুধু শেষ মেশিনটা
                  ভাড়া নিয়েছেন। বাকি সবটা অন্যদের, আর সবাই একই নিয়মে রাজি
                  বলেই কাজ হয়।
                </ListItem>
                <ListItem>
                  <strong>সার্ভার ভাড়া মানে আসলে ঠিকানা ভাড়া:</strong> একটা
                  VPS কেনার সময় আপনি যা পান তার সবচেয়ে দামি জিনিসটা মেশিন নয়,
                  একটা Public IP Address। এমন একটা ঠিকানা যেটা পৃথিবীর যেকোনো
                  জায়গা থেকে চিঠি পাঠালে পৌঁছায়। আপনার বাসার Laptop এর সেটা
                  নেই, তাই আপনার Laptop দুনিয়ার কাছে অদৃশ্য, আর সার্ভারটা
                  দৃশ্যমান।
                </ListItem>
                <ListItem>
                  <strong>localhost:3000 বন্ধু কেন খুলতে পারেন না:</strong>{" "}
                  প্রতিটা নতুন ডেভেলপার একদিন এই ভুলটা করেন। নিজের Laptop এ
                  সার্ভার চালিয়ে বন্ধুকে localhost:3000 লিঙ্ক পাঠান, আর বন্ধু
                  বলেন খুলছে না। localhost মানে এই মেশিনটা নিজে। বন্ধুর মেশিনে
                  localhost মানে বন্ধুর মেশিন, যেখানে কোনো সার্ভার চলছে না।
                  আপনার Laptop এর তো বাইরের দুনিয়ার কোনো ঠিকানাই নেই, তাই বন্ধু
                  লিখবেনই কী। এই কারণেই Deploy করতে হয়, মানে কোডটা এমন একটা
                  মেশিনে তোলা যার একটা Public ঠিকানা আছে।
                </ListItem>
                <ListItem>
                  <strong>Facebook বন্ধ থাকলেও বুকিং চলে:</strong> ২০২১ সালে
                  Facebook ছয় ঘণ্টা বন্ধ ছিল। ওই ছয় ঘণ্টা Island Tours এর মতো
                  সাইটগুলোতে বুকিং চলেছে, কারণ Web এর একটা জিনিস ভেঙেছিল, রাস্তা
                  ভাঙেনি। আপনার সাইট কখনো বন্ধ হলে প্রথম প্রশ্নটা তাই হবে, আমার
                  সার্ভার, নাকি আমার ISP, নাকি ইউজারের ISP?
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "my-tours এর জন্য এর মানে",
          content: (
            <p>
              আপনার my-tours আপাতত আপনার Laptop এ চলবে, আর সেটা ঠিকই আছে। কিন্তু
              এই মডিউল শেষে আপনি জানবেন Laptop থেকে একটা Public ঠিকানার মেশিনে
              যাওয়ার মাঝখানে ঠিক কী কী বদলায়, আর Module 07 এ আমরা সেটা করব। এই
              লেসনের কাজ শুধু একটা প্রশ্নের উত্তর মাথায় বসানো, Internet এ থাকা
              মানে কী। উত্তর: একটা Public ঠিকানা থাকা, আর সবার সাথে একই নিয়মে
              কথা বলা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "request-flow",
      subHeader: { index: "008", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা বার্তা কয়জনের হাত ঘুরে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Cox&apos;s Bazar থেকে একটা বুকিং Singapore পর্যন্ত যাওয়ার পথে কার কার
              হাত ঘুরে যায়, সেটা এক নজরে। এখানে আমরা শুধু মালিক বদলের
              জায়গাগুলো দেখছি। প্রতিটা হাতে ঠিক কী হয়, সেটা Lesson 05 এ ধাপে
              ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "HAND",
          steps: [
            {
              title: "পর্যটকের Phone",
              description:
                "বার্তার উপরে Tours সার্ভারের IP Address লেখা হলো, আর Phone সেটা বাতাসে ছুড়ে দিল সবচেয়ে কাছের টাওয়ারের দিকে। এই মেশিনটা পর্যটকের নিজের।",
            },
            {
              title: "Grameenphone এর Network",
              description:
                "টাওয়ার বার্তাটা ধরল, আর GP এর নিজের তার ধরে Dhaka র দিকে ঠেলে দিল, যেখানে GP এর Network বাইরের দুনিয়ার সাথে জোড়া লাগে। এই পুরো অংশটা GP এর মালিকানায়।",
            },
            {
              title: "সমুদ্রের নিচের তার",
              description:
                "Cox's Bazar এর কাছেই একটা জায়গায় সমুদ্রের নিচের তারটা ডাঙায় ওঠে। GP সেই তারে বার্তাটা তুলে দিল। তারটা কয়েকটা কোম্পানি মিলে বসিয়েছে, GP তার একজন অংশীদার মাত্র।",
            },
            {
              title: "Singapore এর ISP",
              description:
                "তারের অন্য মাথায় Singtel বার্তাটা ধরল। সে ঠিকানা দেখে বুঝল এটা তার শহরের একটা Datacenter এর, আর সেদিকে ঠেলে দিল। এবার মালিক Singtel।",
            },
            {
              title: "Datacenter এর নিজের Network",
              description:
                "Datacenter এর গেটে বার্তাটা ঢুকল, আর ভেতরের Switch গুলো ঠিকানা মিলিয়ে ঠিক সেই তাকের ঠিক সেই মেশিনে পাঠিয়ে দিল। এই অংশ Datacenter কোম্পানির।",
            },
            {
              title: "Island Tours এর সার্ভার",
              description:
                "বার্তা পৌঁছাল। এতগুলো হাত ঘুরল, কেউ কাউকে চেনে না, কেউ পুরো পথটা জানে না, তবু বার্তা ঠিক জায়গায় গেল। কারণ সবাই একই নিয়মে ঠিকানা পড়ে, আর সবাই সেই নিয়মে রাজি।",
            },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "resources",
      subHeader: { index: "009", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Code.org, How the Internet Works</strong>, আটটা ছোট
                ভিডিওর একটা সিরিজ, একদম শূন্য থেকে। এই মডিউলের ছয়টা লেসনের সাথে
                প্রায় মিলে যায়।{" "}
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
                <strong>Submarine Cable Map</strong>, সমুদ্রের নিচের সব তারের
                একটা লাইভ মানচিত্র। Bangladesh এ তার কোথায় ওঠে, সেটা নিজে খুঁজে
                বের করুন।{" "}
                <a
                  href="https://www.submarinecablemap.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  submarinecablemap.com
                </a>
              </ListItem>
              <ListItem>
                <strong>Computerphile</strong>, Search করুন: Internet vs Web, আর
                How the Internet Was Invented.{" "}
                <a
                  href="https://www.youtube.com/@Computerphile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  youtube.com/@Computerphile
                </a>
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "recap",
      subHeader: { index: "010", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                দুইটা মেশিন কথা বলতে পারলেই সেটা একটা Network। আপনার বাসার Wi-Fi
                একটা Network, আর এর মালিক আপনি।
              </ListItem>
              <ListItem>
                Internet মানে Inter Network, নেটওয়ার্কগুলোর মাঝখানের জোড়া। এটা
                লক্ষ লক্ষ আলাদা Network, একে অন্যের সাথে জোড়া লাগানো।
              </ListItem>
              <ListItem>
                কেউ Internet বানায়নি আর কেউ এর মালিক নয়। প্রতিটা টুকরোর মালিক
                আছে, পুরোটার নেই, ঠিক রাস্তার মতো।
              </ListItem>
              <ListItem>
                Internet এর কোনো কেন্দ্র নেই, আর সেটা ইচ্ছে করেই। একটা রাস্তা
                বন্ধ হলে বার্তা অন্য রাস্তা খুঁজে নেয়। এই কারণেই পুরোটা বন্ধ
                করার কোনো সুইচ নেই।
              </ListItem>
              <ListItem>
                তার Internet বানায় না, রাজি হওয়াটা বানায়। সবাই একই নিয়মে কথা
                বলতে রাজি, আর নিয়মটার নাম Protocol। Internet এর সাধারণ নিয়মটা
                TCP/IP।
              </ListItem>
              <ListItem>
                প্রতিটা মেশিনের একটা ঠিকানা আছে, IP Address। মাঝের কেউ বার্তার
                ভেতরে পড়ে না, শুধু ঠিকানা দেখে ঠেলে দেয়। আপনার Laptop এর দুইটা
                ঠিকানা, একটা ভেতরের, একটা বাইরের।
              </ListItem>
              <ListItem>
                Web আর Internet এক জিনিস নয়। Internet রাস্তা, Web তার উপরে চলা
                একটা গাড়ি। Facebook বন্ধ মানে একটা গাড়ি থেমেছে, Wi-Fi বন্ধ
                মানে রাস্তাটাই নেই।
              </ListItem>
              <ListItem>
                Internet এ থাকা মানে একটা Public ঠিকানা থাকা। localhost মানে
                নিজের মেশিন, তাই বন্ধু সেটা খুলতে পারেন না, আর তাই Deploy করতে
                হয়।
              </ListItem>
              <ListItem>
                পরের লেসন: এই পথের দুই মাথায় যে দুইজন, Client আর Server, আর
                মাঝখানের ISP ঠিক কী করে।
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
        <span className="font-bold text-primary">Network</span>,
        "দুই বা তার বেশি মেশিন, যারা একে অন্যের সাথে কথা বলতে পারে",
      ],
      [
        <span className="font-bold text-primary">Router</span>,
        "বাসার মাঝের বাক্স, যার সাথে সব যন্ত্র জোড়া লাগে",
      ],
      [
        <span className="font-bold text-primary">ISP</span>,
        "যে কোম্পানির Network এ আপনার বাসার Network জোড়া লাগে",
      ],
      [
        <span className="font-bold text-primary">Internet</span>,
        "লক্ষ লক্ষ Network এর জোড়া, কারো মালিকানায় নয়",
      ],
      [
        <span className="font-bold text-primary">Protocol</span>,
        "আগে থেকে রাজি হওয়া নিয়ম, যেটাতে সবাই কথা বলে",
      ],
      [
        <span className="font-bold text-primary">TCP/IP</span>,
        "Internet এর সাধারণ নিয়মের নাম, Module 05 এ বিস্তারিত",
      ],
      [
        <span className="font-bold text-primary">IP Address</span>,
        "মেশিনের ঠিকানা, খামের উপরের লেখাটা",
      ],
      [
        <span className="font-bold text-primary">Public Address</span>,
        "যে ঠিকানায় পৃথিবীর যেকোনো জায়গা থেকে বার্তা পৌঁছায়",
      ],
      [
        <span className="font-bold text-primary">Web</span>,
        "Internet এর উপরে চলা একটা জিনিস, Internet নিজে নয়",
      ],
      [
        <span className="font-bold text-primary">localhost</span>,
        "এই মেশিনটা নিজে, তাই অন্য কেউ সেখানে পৌঁছায় না",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Internet এর মালিক কে?",
        options: [
          {
            key: "A",
            text: "আমেরিকার সরকার, কারণ তারাই বানিয়েছে",
            isCorrect: false,
            explanation:
              "শুরুর ধারণাটা তাদের, কিন্তু আজকের Internet লক্ষ লক্ষ আলাদা মালিকের Network এর জোড়া। শুরু করা আর মালিক হওয়া এক কথা নয়।",
          },
          {
            key: "B",
            text: "কেউ না, প্রতিটা টুকরোর মালিক আছে, পুরোটার নেই",
            isCorrect: true,
            explanation:
              "ঠিক রাস্তার মতো। আপনার গলি, শহরের রাস্তা, হাইওয়ে, সবার আলাদা মালিক, কিন্তু Cox's Bazar থেকে Dhaka র পুরো পথটার মালিক কেউ নয়।",
          },
          {
            key: "C",
            text: "Google আর Facebook মিলে",
            isCorrect: false,
            explanation:
              "এরা Internet এর উপরে চলা জিনিস বানায়, রাস্তার উপরের গাড়ি। রাস্তাটা তাদের নয়।",
          },
        ],
      },
      {
        id: 2,
        text: "Facebook বন্ধ, কিন্তু আপনার Email আসছে আর YouTube চলছে। কী ভেঙেছে?",
        options: [
          {
            key: "A",
            text: "Internet ভেঙেছে, শুধু আংশিক",
            isCorrect: false,
            explanation:
              "Internet ভাঙলে Email আর YouTube ও যেত, কারণ সবাই একই রাস্তা ব্যবহার করে। রাস্তা ঠিক আছে।",
          },
          {
            key: "B",
            text: "Web এর একটা জিনিস ভেঙেছে, Internet ঠিক আছে",
            isCorrect: true,
            explanation:
              "একটা গাড়ি থেমেছে, রাস্তা খোলা। এই কারণেই সাইট না খুললে প্রথম প্রশ্ন, শুধু এই সাইট, নাকি সবকিছু?",
          },
          {
            key: "C",
            text: "আপনার ISP Facebook বন্ধ করে দিয়েছে",
            isCorrect: false,
            explanation:
              "হতে পারে, কিন্তু ২০২১ এর ঘটনায় Facebook নিজেই ভেঙেছিল, সারা পৃথিবীতে। প্রশ্নে যা বলা আছে তা থেকে এটুকুই বলা যায়, রাস্তা ঠিক আছে।",
          },
        ],
      },
      {
        id: 3,
        text: "দুইটা Laptop একটা তার দিয়ে জোড়া। এটা কি Internet?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, দুইটা কম্পিউটার কথা বলছে, এটাই Internet",
            isCorrect: false,
            explanation:
              "এটা একটা Network, সবচেয়ে ছোটটা। Internet হয় যখন অনেকগুলো আলাদা Network একে অন্যের সাথে জোড়া লাগে।",
          },
          {
            key: "B",
            text: "না, এটা একটা Network। Internet হলো Network গুলোর জোড়া",
            isCorrect: true,
            explanation:
              "Inter মানে মাঝখানে। একটা Network এর মাঝখানে কিছু নেই। অন্য Network এর সাথে জোড়া লাগলে তবেই Inter Network।",
          },
          {
            key: "C",
            text: "তারটা Fiber হলে Internet, নাহলে না",
            isCorrect: false,
            explanation:
              "তারের ধরন দিয়ে কিছু ঠিক হয় না। কয়টা আলাদা Network জোড়া লাগছে, সেটাই প্রশ্ন।",
          },
        ],
      },
      {
        id: 4,
        text: "Samsung এর Phone আর Apple এর Laptop একে অন্যকে বোঝে। কী কারণে?",
        options: [
          {
            key: "A",
            text: "Samsung আর Apple একসাথে বসে ঠিক করেছে",
            isCorrect: false,
            explanation:
              "তারা কখনো একসাথে বসেনি। দুইজনই আগে থেকে লেখা একটা নিয়ম মানতে রাজি হয়েছে, যেটা কারো নয়।",
          },
          {
            key: "B",
            text: "দুইজনই একই Protocol, TCP/IP, মানতে রাজি হয়েছে",
            isCorrect: true,
            explanation:
              "সম্মেলনে সবাই English বলতে রাজি হওয়ার মতো। তারটা Internet বানায় না, এই রাজি হওয়াটা বানায়।",
          },
          {
            key: "C",
            text: "মাঝের Router অনুবাদ করে দেয়",
            isCorrect: false,
            explanation:
              "Router অনুবাদ করে না, সে শুধু ঠিকানা দেখে ঠেলে দেয়। বোঝাবুঝিটা দুই মাথায় হয়, একই নিয়মে।",
          },
        ],
      },
      {
        id: 5,
        text: "আপনি Laptop এ সার্ভার চালিয়ে বন্ধুকে localhost:3000 পাঠালেন। বন্ধু বলছেন খুলছে না। কেন?",
        options: [
          {
            key: "A",
            text: "বন্ধুর Internet ধীর",
            isCorrect: false,
          },
          {
            key: "B",
            text: "localhost মানে নিজের মেশিন, বন্ধুর মেশিনে কোনো সার্ভার চলছে না",
            isCorrect: true,
            explanation:
              "তার উপর আপনার Laptop এর বাইরের দুনিয়ার কোনো ঠিকানাই নেই। এই কারণেই Deploy করতে হয়, একটা Public ঠিকানার মেশিনে।",
          },
          {
            key: "C",
            text: "Port 3000 বন্ধ, 8080 দিলে খুলবে",
            isCorrect: false,
            explanation:
              "Port বদলালে কিছু হবে না। localhost শব্দটাই বন্ধুর মেশিনে অন্য জিনিস বোঝায়, আপনার মেশিন নয়।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Internet কে নিজের চোখে দেখুন",
    subtitle: "Terminal এ পাঁচটা পরীক্ষা, কোনো কোড লাগবে না",
    stepName: "LAB",
    steps: [
      {
        title: "আপনার দুইটা ঠিকানা দেখুন",
        description:
          "একটা ভেতরের, যেটা Router দিয়েছে। একটা বাইরের, যেটা দুনিয়া দেখে। দুইটা আলাদা হবে, আর সেটাই আশা করার কথা।",
      },
      {
        title: "দূরের একটা মেশিনকে ডাক দিন",
        description:
          "একটা সংখ্যার ঠিকানায় ping করুন আর দেখুন কত মিলিসেকেন্ডে উত্তর আসে। এই মেশিনটা হয়তো আপনার থেকে হাজার কিলোমিটার দূরে।",
      },
      {
        title: "নাম দিয়ে ডাকুন, সংখ্যা ফেরত আসবে",
        description:
          "google.com লিখে ping করুন। উত্তরের প্রথম লাইনে দেখুন নামটা একটা সংখ্যায় বদলে গেছে। কীভাবে, সেটা Module 04।",
      },
      {
        title: "কয়জনের হাত ঘুরে যায় গুনুন",
        description:
          "traceroute চালান আর শুধু লাইন গুনুন। প্রতিটা লাইন একটা আলাদা মেশিন যার হাত দিয়ে আপনার বার্তা গেছে। পড়ার দরকার নেই, গুনলেই হবে।",
      },
      {
        title: "রাস্তাটা কেটে দিন",
        description:
          "Wi-Fi বন্ধ করে আবার ping করুন। উত্তর আসবে না। Internet শেষমেশ একটা তার, আর তার ছাড়া কিছুই নেই।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-two-addresses.sh",
        language: "bash",
        code: `# ভেতরের ঠিকানা, যেটা আপনার Router দিয়েছে
ip addr | grep "inet "          # Linux
ifconfig | grep "inet "         # macOS
# 192.168.x.x বা 10.x.x.x এর মতো একটা সংখ্যা দেখবেন
# এটা শুধু আপনার বাসার ভেতরে কাজ করে

# বাইরের ঠিকানা, যেটা দুনিয়া দেখে
curl ifconfig.me
echo
# একদম আলাদা একটা সংখ্যা। এটা আসলে আপনার Router এর, আপনার Laptop এর নয়।
# বাসার সবার Laptop থেকে চালালে একই সংখ্যা আসবে। কেন, সেটা Module 03।`,
      },
      {
        filename: "2-ping-far-away.sh",
        language: "bash",
        code: `# 8.8.8.8 হলো Google এর একটা মেশিন। সংখ্যা দিয়ে ডাকছি, নাম ছাড়া।
ping -c 4 8.8.8.8

# আউটপুটে time= এর পরের সংখ্যাটা দেখুন, মিলিসেকেন্ডে।
# Bangladesh থেকে সাধারণত ৩০ থেকে ৮০ এর মধ্যে।
# এই সময়টায় আপনার বার্তা গেছে, আর উত্তর ফিরে এসেছে।
# কয়েক হাজার কিলোমিটার, চোখের পলকের দশ ভাগের এক ভাগে।`,
      },
      {
        filename: "3-name-to-number.sh",
        language: "bash",
        code: `# এবার নাম দিয়ে ডাকুন
ping -c 2 google.com

# প্রথম লাইনটা পড়ুন:
#   PING google.com (142.250.xxx.xxx) ...
# আপনি নাম লিখলেন, কেউ সেটাকে সংখ্যায় বদলে দিল, তারপর সংখ্যায় বার্তা গেল।
# Internet নাম চেনে না, শুধু সংখ্যা চেনে। নামটা মানুষের জন্য।
# কে বদলে দিল, সেটা Module 04 এর পুরোটা।`,
      },
      {
        filename: "4-count-the-hands.sh",
        language: "bash",
        code: `# আপনার বার্তা কয়জনের হাত ঘুরে যায়
traceroute 8.8.8.8              # macOS, Linux
# Windows এ: tracert 8.8.8.8

# প্রতিটা লাইন একটা আলাদা মেশিন। প্রথমটা আপনার Router।
# তারপর আপনার ISP এর কয়েকটা। তারপর দেশের বাইরের কয়েকটা। শেষে Google।
# আপাতত শুধু গুনুন। সাধারণত ৮ থেকে ১৫ টা।
# * * * দেখলে ঘাবড়াবেন না, ওই মেশিনটা শুধু নিজের নাম বলতে চায় না।
# এই লাইনগুলোর প্রত্যেকটা কী করে, সেটা Lesson 05 এ ধাপে ধাপে।`,
      },
      {
        filename: "5-cut-the-road.sh",
        language: "bash",
        code: `# Wi-Fi বন্ধ করুন, বা তার খুলে দিন। তারপর:
ping -c 2 8.8.8.8
# "Network is unreachable" বা কোনো উত্তর নেই

# আবার Wi-Fi চালু করুন, কয়েক সেকেন্ড দিন, আবার চালান:
ping -c 2 8.8.8.8
# উত্তর ফিরে এলো

# Internet কোনো জাদু নয়। এটা তার, আর তার কাটলে কিছুই নেই।
# আপনার বাসার তার আপনার হাতে। GP এর তার GP এর হাতে।
# সমুদ্রের নিচের তার কাটলে একটা দেশের অর্ধেক Internet চলে যায়, আর সেটা ঘটেছে।`,
      },
    ],
    tip: "এক নম্বর পরীক্ষাটা কয়েকজন বন্ধুকে করতে বলুন। সবার ভেতরের ঠিকানা কাছাকাছি হবে, 192.168 দিয়ে শুরু, কারণ সবার Router একই ধরনের সংখ্যা বিলি করে। আর সবার বাইরের ঠিকানা আলাদা হবে, কারণ সেটা যার যার ISP এর দেওয়া। এই এক পরীক্ষায় Module 03 এর অর্ধেক প্রশ্ন আপনার মাথায় জন্ম নেবে।",
  },
  assignment: {
    title: "Mini Project: আপনার নিজের Network এর মানচিত্র",
    time: "১ ঘণ্টা",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>বাসার Network আঁকুন:</strong> কাগজে বা কোনো Drawing App এ আপনার
        বাসার সব যন্ত্র আঁকুন, মাঝখানে Router, আর Router থেকে বাইরে একটা তার
        আপনার ISP এর দিকে। প্রতিটা যন্ত্রের পাশে তার ভেতরের ঠিকানা লিখুন (Phone
        এর Settings এ Wi-Fi এর ভেতরে পাবেন)।
      </span>,
      <span key="2">
        <strong>দুইটা ঠিকানা মিলিয়ে দেখুন:</strong> Lab এর এক নম্বর পরীক্ষা
        চালিয়ে দুইটা ঠিকানা লিখে রাখুন। তারপর Phone থেকে Browser এ ifconfig.me
        খুলুন। Phone আর Laptop এর বাইরের ঠিকানা এক কিনা দেখুন, আর এক লাইনে লিখুন
        কেন।
      </span>,
      <span key="3">
        <strong>তিনটা গন্তব্যে হাত গুনুন:</strong> traceroute চালান google.com,
        bbc.co.uk আর আপনার পছন্দের একটা Bangladeshi সাইটে। তিনটার লাইন সংখ্যা
        লিখে রাখুন। কোনটা সবচেয়ে কম হাত ঘুরল, আর আপনার অনুমান কেন?
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু আপনাকে জিজ্ঞেস
        করলেন, Internet এর মালিক কে? উত্তরটা এমনভাবে লিখুন যেন কম্পিউটার না জানা
        কেউ বোঝে। রাস্তার উদাহরণ ব্যবহার করতে পারেন, বা নিজের একটা বানাতে পারেন।
      </span>,
    ],
    deliverables: [
      <span key="1">বাসার Network এর আঁকা ছবি, ঠিকানা সহ</span>,
      <span key="2">দুইটা ঠিকানা, আর Phone এর সাথে মিলের ব্যাখ্যা</span>,
      <span key="3">তিনটা traceroute এর লাইন সংখ্যা আর অনুমান</span>,
      <span key="4">Internet এর মালিক নিয়ে ৫ লাইনের লেখা</span>,
    ],
  },
};
