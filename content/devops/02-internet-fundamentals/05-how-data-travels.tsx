/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  HopByHopLab,
  TracerouteLab,
} from "../../../components/course/topics/travel/animations";
import {
  JourneyMapDiagram,
  MediumChangeDiagram,
  RouterHopDiagram,
} from "../../../components/course/topics/travel/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const howDataTravelsContent: TopicData = {
  id: "how-data-travels",
  introduction: {
    badge: "MODULE 02 · LESSON 05",
    title: <SectionTitle>একটা Packet এর সমুদ্রযাত্রা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই মডিউলে এতক্ষণ আপনি টুকরো টুকরো করে জিনিসগুলো দেখেছেন। Internet মানে
          জোড়া লাগানো নেটওয়ার্ক, দুই মাথায় Client আর Server, মেশিনের ভেতরে
          Port আর Socket, আর কথাটা যায় ছোট ছোট Packet এ ভাগ হয়ে। এবার এই
          সবগুলো একসাথে জোড়া লাগিয়ে একটা প্রশ্নের উত্তর দেব, যেটা শুনতে সহজ
          কিন্তু উত্তরটা অবাক করা।
        </ContentParagraph>
        <ContentParagraph>
          আপনি Cox&apos;s Bazar এর সৈকতে বসে একটা বুকিং করলেন। সার্ভার Singapore
          এ। আপনার আঙুল স্ক্রিন ছোঁয়ার পর, আর সার্ভার উত্তর দেওয়ার আগে, ওই
          কয়েক মিলিসেকেন্ডে আপনার তথ্যটা আসলে কোথায় কোথায় যায়? কী দিয়ে
          যায়? কে তাকে পথ দেখায়?
        </ContentParagraph>
        <ContentParagraph>
          এটা এই মডিউলের সবচেয়ে দৃশ্যময় লেসন, তাই আমরা একটা Packet এর পিছু
          নেব, ঠিক যেন একটা চিঠির পিছু নিচ্ছি। বাসার Wi-Fi থেকে সমুদ্রের নিচের
          তার হয়ে অন্য মহাদেশের একটা মেশিন পর্যন্ত, প্রতিটা থামার জায়গায় থেমে
          দেখব সেখানে ঠিক কী হয়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আপনার একটা বুকিং সমুদ্রের নিচ দিয়ে আলো হয়ে যায়, কয়েক হাজার কিলোমিটার, চোখের পলকে। আর মাঝের কোনো মেশিন পুরো পথ জানে না, প্রত্যেকে শুধু পরের একটা ধাপ জানে।",
      author: "Internet Fundamentals",
      role: "Lesson 05",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "the-map",
      subHeader: { index: "001", title: "The Map" },
      title: <SectionTitle>পুরো পথটা একবার দেখে নিই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগে পুরো মানচিত্রটা দেখি, তারপর প্রতিটা থামার জায়গায় ঢুকব।
                আপনার একটা বুকিং Cox&apos;s Bazar থেকে Singapore পৌঁছাতে অন্তত
                সাত আটটা হাত ঘোরে। শুরু আপনার হাতের Phone, শেষ Singapore এর একটা
                তাকের একটা মেশিন। মাঝের প্রতিটা থামার জায়গা একটা Router, আর
                প্রতিটা তীর একটা Hop, মানে এক লাফ।
              </ContentParagraph>
              <ContentParagraph>
                একটা জিনিস আগে থেকে খেয়াল করে রাখুন, কারণ পুরো লেসনে এটাই
                বারবার ফিরে আসবে। প্রতিটা থামার জায়গায় বাহনটা বদলায়, কিন্তু
                যাত্রীটা বদলায় না। Phone থেকে টাওয়ারে যায় বাতাসে, টাওয়ার
                থেকে শহরে তারে, সমুদ্র পার হয় কাচের ভেতরে আলো হয়ে। বাহন তিন
                রকম, কিন্তু ভেতরের তথ্যটা, আপনার বুকিং, হুবহু এক থাকে পুরো পথে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JourneyMapDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "কেউ পুরো পথ জানে না",
          content: (
            <p>
              এটা Internet এর সবচেয়ে সুন্দর ধারণাগুলোর একটা। মাঝের কোনো Router
              এর কাছে পুরো পথের নকশা নেই। GP এর Router শুধু জানে, এই ঠিকানার
              জন্য চিঠিটা IIG এর দিকে পাঠাও। IIG জানে, এটা সমুদ্রের তারে তোলো।
              প্রত্যেকে শুধু পরের একটা ধাপ জানে, ঠিক যেমন আপনি অচেনা শহরে পথ
              জিজ্ঞেস করলে একজন বলেন, সামনে গিয়ে ডানে যান, আর পরের মোড়ে
              আরেকজনকে জিজ্ঞেস করেন। কেউ পুরো ম্যাপ মুখস্থ রাখে না, তবু আপনি
              পৌঁছে যান।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "medium",
      subHeader: { index: "002", title: "The Medium" },
      title: <SectionTitle>বাহন বদলায়, তথ্য বদলায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 01 এ দেখেছেন সবকিছুই আসলে Bit, শূন্য আর এক। এখন প্রশ্ন
                হলো, ওই শূন্য আর এক তারে বা বাতাসে যায় কীভাবে? উত্তর হলো, যে
                মাধ্যমই হোক, তার একটা দুই রকম অবস্থা থাকে, আর ওই দুই অবস্থা
                দিয়ে শূন্য আর এক বোঝানো হয়।
              </ContentParagraph>
              <ContentParagraph>
                তামার তারে বিদ্যুতের ভোল্টেজ উঁচু মানে এক, নিচু মানে শূন্য।
                কাচের তারে আলো জ্বলা মানে এক, নেভা মানে শূন্য। বাতাসে রেডিও
                তরঙ্গের একরকম ওঠানামা মানে এক, আরেকরকম মানে শূন্য। তিনটা
                সম্পূর্ণ আলাদা জিনিস, কিন্তু তিনটাই একই কাজ করে, শূন্য আর এক
                বয়ে নেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MediumChangeDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তাহলে প্রতিটা থামার জায়গায় যে যন্ত্রটা বসে, তার একটা কাজ হলো এক
              বাহন থেকে আরেক বাহনে যাত্রীকে তুলে দেওয়া। টাওয়ার বাতাসের রেডিওকে
              তারের বিদ্যুতে বদলায়। সমুদ্রের তারের মাথায় বসা যন্ত্র বিদ্যুৎকে
              আলোয় বদলায়। এরা যাত্রীকে ছোঁয় না, শুধু গাড়ি বদলে দেয়। এই
              কারণেই আপনার Wi-Fi এ পাঠানো একটা বার্তা সমুদ্রের তারে গিয়েও একই
              বার্তা থাকে, শুধু আলো হয়ে যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সমুদ্রের তার নিয়ে একটা মজার সত্যি",
          content: (
            <p>
              পৃথিবীর মহাদেশগুলো জোড়া লাগানো আছে কয়েকশো মোটা তারে, যেগুলো
              সত্যিই সমুদ্রের তলদেশে পাতা। এগুলোর ভেতরে চুলের চেয়ে সরু কাচের
              সুতো, আর তার ভেতর দিয়ে আলো ছোটে। Bangladesh এই তারে যুক্ত হয়
              Cox&apos;s Bazar আর Kuakata দিয়ে। কখনো খবরে দেখবেন, সমুদ্রের তার কাটার
              কারণে দেশের Internet ধীর, সেটা এই তারই। আপনি submarinecablemap.com
              এ নিজের চোখে পুরো পৃথিবীর তারের জাল দেখতে পারেন, নিচের Resources এ
              লিঙ্ক আছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "router",
      subHeader: { index: "003", title: "The Router" },
      title: <SectionTitle>প্রতিটা মোড়ে একজন ট্রাফিক পুলিশ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মানচিত্রের প্রতিটা বাক্স একটা Router। এই শব্দটা আপনি আপনার বাসার
                যন্ত্রের নামে শুনেছেন, কিন্তু বড় Router গুলো আলমারির সমান, আর
                সেকেন্ডে কোটি কোটি Packet সামলায়। তবু কাজটা মূলত একই, আর সেটা
                একটা রাস্তার মোড়ের ট্রাফিক পুলিশের মতো।
              </ContentParagraph>
              <ContentParagraph>
                একজন ট্রাফিক পুলিশ প্রতিটা গাড়ির ভেতরে কে বসে আছে, কী কথা
                হচ্ছে, সেসব দেখেন না। তিনি শুধু দেখেন গাড়িটা কোন দিকে যাবে, আর
                সেই অনুযায়ী হাত দিয়ে ইশারা করেন, এই দিকে যান। Router ঠিক তাই
                করে। সে Packet এর ভেতরের তথ্য পড়ে না, শুধু খামের উপরের
                গন্তব্যের ঠিকানা দেখে, আর নিজের একটা তালিকা মিলিয়ে ঠিক করে পরের
                কোন দিকে ঠেলবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RouterHopDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              চার নম্বর ধাপে TTL নামে একটা জিনিস আছে, যেটা একটু ব্যাখ্যা লাগে।
              TTL মানে Time To Live, প্রতিটা Packet এর খামে লেখা একটা সংখ্যা,
              ধরুন শুরুতে ৬৪। প্রতিটা Router সেটা এক করে কমায়। সংখ্যাটা শূন্য
              হয়ে গেলে পরের Router টা Packet টা ফেলে দেয়। এটা কেন? ধরুন দুইটা
              Router ভুল করে একে অন্যকে দেখিয়ে দিচ্ছে, তাহলে Packet টা চিরকাল
              ওই দুইয়ের মাঝে ঘুরতে থাকত। TTL নিশ্চিত করে যে যত ভুলই হোক, একটা
              Packet একটা সীমার বেশি ঘুরবে না, তার আগেই মরে যাবে। এই TTL এর সাথে
              খেলেই traceroute কাজ করে, যেটা এখনই দেখবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "hop-by-hop",
      subHeader: { index: "004", title: "Hop by Hop" },
      title: <SectionTitle>একটা Packet কে অনুসরণ করি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সব একসাথে দেখি। একটা Packet ছেড়ে দিন আর ধাপে ধাপে তার পিছু
              নিন। খেয়াল করুন দুইটা সংখ্যায়, গন্তব্যের ঠিকানা কখনো বদলায় না,
              আর TTL প্রতিটা Hop এ এক করে কমে। আর প্রতিটা ধাপে বাহনটা বদলে যায়।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HopByHopLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "ঠিকানা কেন বদলায় না, কিন্তু একটা জিনিস বদলায়",
          content: (
            <p>
              চূড়ান্ত গন্তব্যের ঠিকানা পুরো পথে এক থাকে, নাহলে Packet পথ হারাত।
              কিন্তু একটা জিনিস প্রতি ধাপে বদলায়, যেটা এই লেসনে আমরা সরল
              রেখেছি। প্রতিটা Hop এ পরের মেশিনের ঠিকানা বদলায়, মানে এই মুহূর্তে
              হাতে হাতে কে কাকে দিচ্ছে সেটা। চূড়ান্ত গন্তব্য যেমন চিঠির উপরের
              ঠিকানা, তেমনি প্রতি ধাপের ঠিকানা যেন এক ডাকপিয়ন পরের ডাকপিয়নকে
              হাতে দেওয়ার মুহূর্ত। এই দুই ধরনের ঠিকানার তফাত, IP আর MAC, Module
              03 এর একদম শুরুর বিষয়। আপাতত মনে রাখুন, চূড়ান্ত গন্তব্য এক থাকে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "traceroute",
      subHeader: { index: "005", title: "traceroute" },
      title: <SectionTitle>এই পুরো পথ আপনি নিজে দেখতে পারেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণের পুরো গল্পটা কল্পনা নয়, আপনি নিজের চোখে দেখতে পারেন,
                একটা কমান্ড দিয়ে, traceroute। আগের দুই লেসনে আপনি এটা চালিয়ে
                শুধু লাইন গুনেছেন। এবার লাইনগুলো পড়ার সময়।
              </ContentParagraph>
              <ContentParagraph>
                traceroute একটা সুন্দর চালাকি খাটায়, আর সেটা ঠিক ওই TTL দিয়ে।
                প্রথমে সে একটা Packet পাঠায় TTL মাত্র ১ দিয়ে। প্রথম Router
                সেটা এক কমিয়ে শূন্য পায়, তাই ফেলে দেয়, আর ফেলে দেওয়ার সময়
                একটা বার্তা ফেরত পাঠায়, আমি এটা ফেললাম। ওই বার্তা থেকে
                traceroute প্রথম Router টার নাম জেনে যায়। তারপর সে TTL ২ দিয়ে
                পাঠায়, দ্বিতীয় Router সাড়া দেয়। এভাবে এক এক করে TTL বাড়িয়ে
                সে পুরো পথের প্রতিটা Router কে নাম বলতে বাধ্য করে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TracerouteLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এই এক কমান্ড Production এ বহুবার বাঁচাবে",
          content: (
            <p>
              কোনো সার্ভার হঠাৎ ধীর, বা পৌঁছানোই যাচ্ছে না। প্রথম প্রশ্ন,
              সমস্যাটা পথে কোথায়? traceroute চালিয়ে দেখুন কোন ধাপে গিয়ে
              সংখ্যাগুলো হঠাৎ লাফ দেয়, বা কোথায় গিয়ে তারকা আসতে শুরু করে আর
              থামে না। যদি আপনার নিজের এলাকা পেরিয়ে ISP এর মেশিনেই আটকায়,
              সমস্যা আপনার ISP এর। যদি বহু দূরে বিদেশি কোনো Router এ আটকায়,
              সমস্যা সেখানে, আপনার হাতের বাইরে। এক কমান্ডে আপনি জেনে যান দোষটা
              কার, আর সেটাই অর্ধেক সমাধান।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "project",
      subHeader: { index: "006", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Packet কোন পথে যায়</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের পুরো পথটা Island Tours এর প্রতিটা বুকিং প্রতিদিন পাড়ি
                দেয়, আর সেই বাস্তবতা থেকে কয়েকটা সিদ্ধান্ত সরাসরি বেরিয়ে আসে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পথটা লম্বা, তাই প্রতি কথায় দাম:</strong> পর্যটক
                  Bangladesh এ, সার্ভার Singapore এ, তাই প্রতিটা কথায় এই আট Hop
                  এর যাওয়া আসা। এই কারণেই Lesson 04 এ বলেছিলাম, পাতাটা যত কম
                  আলাদা কথা বলে তত ভালো, কারণ প্রতিটা কথার দাম এই পুরো
                  সমুদ্রযাত্রা।
                </ListItem>
                <ListItem>
                  <strong>একটা Hop এ সমস্যা মানে সবার সমস্যা:</strong> কোনোদিন
                  যদি Bangladesh এর একটা সমুদ্র তার কাটা পড়ে, Island Tours ধীর
                  হয়ে যাবে, অথচ সার্ভারে কোনো দোষ নেই। এই কারণেই সমস্যা খুঁজতে
                  গিয়ে প্রথমেই traceroute চালানো হয়, যাতে বোঝা যায় দোষটা
                  সার্ভারের, নাকি পথের।
                </ListItem>
                <ListItem>
                  <strong>ভারী জিনিস কাছে আনা:</strong> Tour এর ছবিগুলো এই লম্বা
                  পথ পাড়ি দিলে ধীর লাগবে। তাই ছবিগুলো একটা CDN এ রাখা হয়, মানে
                  পর্যটকের কাছের একটা মেশিনে, যাতে ছবির Packet কে সমুদ্র পার হতে
                  না হয়। শুধু বুকিং এর মতো আসল কাজটা দূরের সার্ভারে যায়। এই
                  ভাগ Module 12।
                </ListItem>
                <ListItem>
                  <strong>পথের নিরাপত্তা:</strong> এতগুলো অচেনা Router এর হাত
                  ঘুরে Packet যায়। এদের কেউ যদি খামটা খুলে দেখে? এই কারণেই
                  খামটা আঠা দিয়ে বন্ধ করা থাকে, মানে HTTPS। তখন মাঝের কেউ শুধু
                  খামের ঠিকানা দেখে, ভেতরের বুকিং বা Payment তথ্য নয়। এটা
                  Module 06।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা প্রশ্ন যেটা এখন আপনি ধরতে পারবেন",
          content: (
            <p>
              ধরুন এক পর্যটক বললেন, আপনার সাইট আমার এখানে খুব ধীর, অথচ আমার
              বন্ধুর কাছে ঠিক আছে। আগে হলে আপনি হয়তো সার্ভার বড় করতেন। এখন
              আপনি জানেন, দুইজনের Packet দুইটা আলাদা পথে যায়, আর হয়তো ওই
              পর্যটকের ISP এর একটা Hop এ সমস্যা। দুইজনকে traceroute চালাতে বললেই
              পথের তফাতটা চোখে পড়বে, আর দোষটা কোথায় বোঝা যাবে। ভুল জায়গায়
              টাকা খরচ হওয়ার আগে সমস্যাটা ঠিক জায়গায় খোঁজা, এটাই এই লেসনের
              সবচেয়ে বড় ব্যবহারিক লাভ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "request-flow",
      subHeader: { index: "007", title: "Step-by-step Flow" },
      title: <SectionTitle>এক বুকিং, শুরু থেকে সমুদ্র পার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো যাত্রাটা এক জায়গায় সাজিয়ে দেখুন। প্রতিটা ধাপে মাধ্যম
              বদলায়, কিন্তু গন্তব্যের ঠিকানা এক থাকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "HOP",
          steps: [
            {
              title: "Phone থেকে বাতাসে",
              description:
                "বুকিং এর Packet তৈরি হলো, খামে গন্তব্য Singapore এর ঠিকানা আর TTL ৬৪। Phone সেটা রেডিও তরঙ্গ বানিয়ে সবচেয়ে কাছের টাওয়ারের দিকে ছুড়ল।",
            },
            {
              title: "টাওয়ার, রেডিও থেকে তারে",
              description:
                "টাওয়ার রেডিও ধরে সেটাকে তারের বিদ্যুতে বদলাল, আর GP এর নিজের Fiber এ তুলে দিল। TTL এখন ৬৩। যাত্রী এক, গাড়ি বদলাল।",
            },
            {
              title: "ISP এর core, Dhaka",
              description:
                "GP এর মূল কেন্দ্রে অনেক রাস্তা মেশে। এখানকার Router ঠিকানা দেখে বুঝল এটা দেশের বাইরের, তাই IIG এর দিকে পাঠাল। TTL ৬২।",
            },
            {
              title: "IIG, দেশের শেষ দরজা",
              description:
                "International Internet Gateway। এর পরে বাংলাদেশ শেষ। Router Packet টাকে সমুদ্রের তারের মুখে বসা যন্ত্রের হাতে দিল। TTL ৬১।",
            },
            {
              title: "সমুদ্রের নিচে, আলো হয়ে",
              description:
                "যন্ত্রটা বিদ্যুৎকে আলোয় বদলাল, আর কাচের সুতোর ভেতর দিয়ে আলো ছুটল কয়েক হাজার কিলোমিটার। এই এক ধাপেই Latency সবচেয়ে বেশি বাড়ে। TTL ৬০।",
            },
            {
              title: "Singapore, তারপর Server",
              description:
                "অন্য মাথায় আলো আবার বিদ্যুৎ হলো, Singtel এর Router ধরল, তারপর Datacenter এর ভেতরের Switch হয়ে ঠিক সেই মেশিনে। TTL ৫৮। ঠিকানা একবারও বদলায়নি, প্রতিটা Router শুধু পরের এক ধাপ জানত।",
            },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "resources",
      subHeader: { index: "008", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Submarine Cable Map</strong>, সমুদ্রের নিচের সব তারের
                লাইভ মানচিত্র। Cox&apos;s Bazar আর Kuakata তে তার কোথায় ওঠে, নিজে
                খুঁজে বের করুন।{" "}
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
                <strong>নিজে চালান</strong>, mtr নামের একটা টুল আছে যেটা
                traceroute আর ping একসাথে করে, লাইভ আপডেট হয়। Terminal এ mtr
                google.com চালিয়ে কয়েক সেকেন্ড তাকিয়ে থাকুন।
              </ListItem>
              <ListItem>
                <strong>Computerphile</strong>, Search করুন: How Data Travels
                the Internet, আর Submarine Cables.{" "}
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
    /* ---------------------------------------------------------------- 9 */
    {
      id: "recap",
      subHeader: { index: "009", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                একটা Packet এক বাসা থেকে অন্য মহাদেশে যেতে সাত আটটা Hop পার হয়,
                প্রতিটা Hop এ একটা Router।
              </ListItem>
              <ListItem>
                প্রতিটা থামার জায়গায় বাহন বদলায়, রেডিও, তামা, কাচের আলো,
                কিন্তু ভেতরের তথ্য, মানে বিটগুলো, হুবহু এক থাকে। যন্ত্র শুধু
                গাড়ি বদলে দেয়।
              </ListItem>
              <ListItem>
                Router একজন ট্রাফিক পুলিশ। ভেতরের কথা পড়ে না, শুধু গন্তব্যের
                ঠিকানা দেখে, তালিকা মেলায়, TTL এক কমায়, পরের দিকে ঠেলে।
              </ListItem>
              <ListItem>
                কেউ পুরো পথ জানে না। প্রত্যেকে শুধু পরের এক ধাপ জানে, ঠিক যেমন
                অচেনা শহরে মোড়ে মোড়ে পথ জিজ্ঞেস করা।
              </ListItem>
              <ListItem>
                TTL মানে Time To Live, প্রতি Hop এ কমে। শূন্য হলে Packet ফেলে
                দেওয়া হয়, যাতে কোনো Packet চিরকাল না ঘোরে।
              </ListItem>
              <ListItem>
                traceroute এই পুরো পথ দেখায়, প্রতিটা Router এক লাইন। সময়ের
                হঠাৎ বড় লাফ মানে সমুদ্র, তিনটা তারকা মানে ওই Router নাম বলছে
                না, তবু Packet পার হচ্ছে।
              </ListItem>
              <ListItem>
                গন্তব্যের ঠিকানা পুরো পথে এক থাকে। প্রতি ধাপের হাতে হাতে দেওয়ার
                ঠিকানা বদলায়, IP আর MAC এর তফাত, Module 03 এ।
              </ListItem>
              <ListItem>
                পরের লেসন: এই মডিউলের সবকিছু এক জায়গায়। Browser এ URL লেখা
                থেকে Database পর্যন্ত, একটা Request এর পুরো যাত্রা।
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
        <span className="font-bold text-primary">Hop</span>,
        "এক Router থেকে পরের Router, এক লাফ",
      ],
      [
        <span className="font-bold text-primary">Router</span>,
        "রাস্তার মোড়ের ট্রাফিক পুলিশ, ঠিকানা দেখে পথ দেখায়",
      ],
      [
        <span className="font-bold text-primary">Medium</span>,
        "বাহন, রেডিও তামা বা কাচের আলো, বিট এক থাকে",
      ],
      [
        <span className="font-bold text-primary">Fiber</span>,
        "কাচের সুতো, ভেতরে আলো, সমুদ্রের তার এটাই",
      ],
      [
        <span className="font-bold text-primary">IIG</span>,
        "দেশের গেট, দেশের Traffic এর বাইরের দরজা",
      ],
      [
        <span className="font-bold text-primary">Submarine Cable</span>,
        "সমুদ্রের নিচের তার, মহাদেশ জোড়ে",
      ],
      [
        <span className="font-bold text-primary">TTL</span>,
        "Time To Live, প্রতি Hop এ কমে, শূন্যে Packet মরে",
      ],
      [
        <span className="font-bold text-primary">traceroute</span>,
        "পুরো পথ দেখার কমান্ড, প্রতি Router এক লাইন",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "আপনার Wi-Fi এর একটা বার্তা সমুদ্রের তারে পৌঁছাল। ভেতরের তথ্যটার কী হলো?",
        options: [
          {
            key: "A",
            text: "তথ্যটা আলোয় অনুবাদ হয়ে বদলে গেল",
            isCorrect: false,
            explanation:
              "বাহন বদলাল, তথ্য নয়। রেডিও থেকে আলো, কিন্তু বিটগুলো, শূন্য আর এক, হুবহু এক থাকল।",
          },
          {
            key: "B",
            text: "তথ্য এক থাকল, শুধু বাহন রেডিও থেকে আলো হলো",
            isCorrect: true,
            explanation:
              "প্রতিটা যন্ত্র শুধু গাড়ি বদলায়, যাত্রীকে নয়। এই কারণেই দুই মাথায় একই বার্তা পাওয়া যায়।",
          },
          {
            key: "C",
            text: "তথ্যটা আবার নতুন করে বানানো হলো",
            isCorrect: false,
          },
        ],
      },
      {
        id: 2,
        text: "একটা Router একটা Packet পেল। সে প্রথমে কী দেখে?",
        options: [
          {
            key: "A",
            text: "Packet এর ভেতরের তথ্য, কী পাঠানো হচ্ছে",
            isCorrect: false,
            explanation:
              "Router ভেতরে তাকায় না, ঠিক যেমন ট্রাফিক পুলিশ গাড়ির ভেতরের কথা শোনেন না।",
          },
          {
            key: "B",
            text: "খামের উপরের গন্তব্যের ঠিকানা",
            isCorrect: true,
            explanation:
              "শুধু গন্তব্য দেখে তালিকা মিলিয়ে পরের দিক ঠিক করে। ভেতরের কথা তার কাজ নয়।",
          },
          {
            key: "C",
            text: "Packet টা কে পাঠিয়েছে",
            isCorrect: false,
            explanation:
              "পাঠানোর ঠিকানা উত্তর ফেরানোর সময় লাগে, কিন্তু পথ ঠিক করতে Router দেখে গন্তব্য।",
          },
        ],
      },
      {
        id: 3,
        text: "traceroute এ ৪ নম্বর লাইনে ১৮ ms, ৫ নম্বরে হঠাৎ ৬২ ms। এই লাফটা কী বোঝায়?",
        options: [
          {
            key: "A",
            text: "Router টা নষ্ট",
            isCorrect: false,
            explanation:
              "নষ্ট নয়। এত বড় লাফ প্রায় সবসময় একটা মানেই, অনেক দূর এক ধাপে পার হলো।",
          },
          {
            key: "B",
            text: "ওই ধাপে সম্ভবত সমুদ্র পার হলো, কয়েক হাজার কিলোমিটার এক Hop এ",
            isCorrect: true,
            explanation:
              "দূরত্বই Latency, আর সমুদ্রের তার এক ধাপে বিশাল দূরত্ব পার করায়। তাই হঠাৎ বড় লাফ।",
          },
          {
            key: "C",
            text: "আপনার Internet ধীর হয়ে গেছে",
            isCorrect: false,
            explanation:
              "পুরো লাইন ধীর হলে সব সংখ্যা বাড়ত। একটা জায়গায় লাফ মানে ওই এক ধাপের দূরত্ব।",
          },
        ],
      },
      {
        id: 4,
        text: "TTL সংখ্যাটা প্রতি Hop এ কমানো হয় কেন?",
        options: [
          {
            key: "A",
            text: "Packet এর গতি মাপতে",
            isCorrect: false,
            explanation:
              "TTL সময় মাপে না, যদিও নামে Time আছে। এটা একটা Hop গোনার সংখ্যা।",
          },
          {
            key: "B",
            text: "যাতে কোনো Packet ভুল পথে চিরকাল ঘুরতে না থাকে, শূন্য হলে ফেলে দেওয়া হয়",
            isCorrect: true,
            explanation:
              "দুইটা Router ভুল করে একে অন্যকে দেখালে Packet চিরকাল ঘুরত। TTL সেই সীমা বেঁধে দেয়।",
          },
          { key: "C", text: "Packet এর সাইজ ঠিক রাখতে", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "এক পর্যটকের কাছে আপনার সাইট ধীর, বন্ধুর কাছে ঠিক। প্রথম কাজ কী?",
        options: [
          {
            key: "A",
            text: "সার্ভার বড় করা",
            isCorrect: false,
            explanation:
              "সার্ভার একই, একজনের ঠিক আছে। সমস্যা সম্ভবত পথে, সার্ভারে নয়। বড় সার্ভার এখানে সাহায্য করবে না।",
          },
          {
            key: "B",
            text: "দুইজনকে traceroute চালাতে বলা, কোন ধাপে তফাত দেখা",
            isCorrect: true,
            explanation:
              "দুইজনের Packet দুই পথে যায়। traceroute দেখাবে ধীরজনের কোন Hop এ আটকাচ্ছে, আর দোষটা কার।",
          },
          { key: "C", text: "সাইট নতুন করে বানানো", isCorrect: false },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের Packet এর পথ দেখুন",
    subtitle: "Terminal এ পাঁচটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "পুরো পথ দেখুন",
        description:
          "একটা বিদেশি সার্ভারে traceroute চালান, আর প্রতিটা লাইন পড়ুন। প্রথম লাইন আপনার Router, শেষ লাইন গন্তব্য।",
      },
      {
        title: "সমুদ্রের লাফ খুঁজুন",
        description:
          "সময়ের সংখ্যাগুলোতে চোখ রাখুন। কোথায় হঠাৎ বড় লাফ, সেখানেই সাধারণত সমুদ্র পার হয়।",
      },
      {
        title: "দুইটা গন্তব্য তুলনা করুন",
        description:
          "একটা কাছের আর একটা দূরের সার্ভারে traceroute চালান। দূরেরটায় বেশি Hop আর বড় সংখ্যা দেখবেন।",
      },
      {
        title: "TTL কমা নিজে দেখুন",
        description:
          "ইচ্ছে করে ছোট TTL দিয়ে ping পাঠান, আর দেখুন Packet পথের মাঝেই মরে যায়, ঠিক যেভাবে traceroute কাজ করে।",
      },
      {
        title: "সমুদ্রের তারের ম্যাপ",
        description:
          "submarinecablemap.com খুলে Bangladesh এ কোন তার কোথায় ওঠে দেখুন, আর আপনার traceroute এর সাথে মেলান।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-trace-the-path.sh",
        language: "bash",
        code: `# পুরো পথ, প্রতিটা Router এক লাইন
traceroute -q 1 github.com          # macOS, Linux; -q 1 মানে প্রতি Hop এ একবার
# Windows: tracert github.com

# প্রতিটা লাইন পড়ুন:
#   1  192.168.x.x   ← আপনার নিজের Router, বাসার ভেতরের ঠিকানা
#   2  10.x বা 172.x ← আপনার ISP এর ভেতরের মেশিন
#   ...              ← ISP এর core, তারপর IIG
#   শেষ লাইন         ← গন্তব্যের ঠিকানা
#
# উপর থেকে নিচে ms বাড়ে, কারণ প্রতিটা Hop দূরত্ব যোগ করে।`,
      },
      {
        filename: "2-find-the-ocean.sh",
        language: "bash",
        code: `# একটা নিশ্চিত দূরের সার্ভার, আমেরিকা
traceroute -q 1 stanford.edu

# ms সংখ্যাগুলোতে চোখ রাখুন। একটা জায়গায় হঠাৎ বড় লাফ পাবেন, যেমন:
#   7   ...   20 ms
#   8   ...   210 ms     ← এই লাফটাই সমুদ্র
#
# ২০ থেকে ২১০ মানে ওই এক ধাপে হাজার হাজার কিলোমিটার পার হলো।
# এর আগের Hop টা সাধারণত দেশের ভেতরে, পরেরটা বিদেশে।`,
      },
      {
        filename: "3-near-vs-far.sh",
        language: "bash",
        code: `# কাছের, ধরে নিন একটা bd সার্ভার বা আপনার ISP এর কাছের কিছু
traceroute -q 1 -m 15 google.com | tail -n +1

# দূরের, নিশ্চিত অন্য মহাদেশ
traceroute -q 1 -m 20 bbc.co.uk

# দুইটার লাইন সংখ্যা আর শেষ ms তুলনা করুন।
# কাছেরটা কম Hop, ছোট সংখ্যা। দূরেরটা বেশি Hop, বড় সংখ্যা, আর একটা সমুদ্রের লাফ।
# এই তফাতটাই Lesson 04 এর Latency, চোখে দেখা।`,
      },
      {
        filename: "4-watch-ttl-die.sh",
        language: "bash",
        code: `# TTL নিজে বেঁধে দিন, আর দেখুন Packet পথেই মরে

# TTL 1: প্রথম Router এই মরবে
ping -c 1 -t 1 github.com          # macOS
# Linux: ping -c 1 -T ttl -i ... , বা সহজভাবে:
#   traceroute এর প্রথম লাইনই আসলে TTL 1 এর ফল

# ধাপে ধাপে বাড়িয়ে দেখুন কোন TTL এ কে সাড়া দেয়:
for t in 1 2 3 4 5; do
  echo "TTL=$t:"
  ping -c 1 -t $t github.com 2>&1 | grep -i "exceeded\\|from" | head -1
done
# প্রতিটা TTL এ একটা করে দূরের Router সাড়া দেবে।
# traceroute ঠিক এই কাজটাই করে, TTL এক এক করে বাড়িয়ে পুরো পথ আঁকে।`,
      },
      {
        filename: "5-live-map.sh",
        language: "bash",
        code: `# mtr, traceroute আর ping একসাথে, লাইভ আপডেট
# ইনস্টল: macOS 'brew install mtr', Ubuntu 'sudo apt install mtr'
sudo mtr github.com
# প্রতিটা Hop এর Loss% আর গড় সময় লাইভ দেখবেন, বন্ধ করতে q চাপুন।
# কোনো Hop এ Loss% বাড়তে থাকলে সেখানেই সমস্যা।

# তারপর Browser এ খুলুন:
#   https://www.submarinecablemap.com
# Bangladesh এ চাপুন, দেখুন কোন তার Cox's Bazar আর Kuakata তে ওঠে।
# আপনার traceroute এর সমুদ্রের লাফটা এই তারগুলোর একটার উপর দিয়েই গেছে।`,
      },
    ],
    tip: "দুই নম্বর পরীক্ষাটা সবচেয়ে মজার, কারণ আপনি নিজের চোখে সমুদ্র দেখতে পাবেন, সংখ্যায়। যে লাইনে ২০ থেকে ২০০ এর লাফ, ওই এক লাইনেই আপনার তথ্য হাজার হাজার কিলোমিটার সমুদ্রের নিচ দিয়ে আলো হয়ে গেছে, আপনি চা খেতে খেতে। এই একটা ব্যাপার একবার নিজের চোখে দেখলে Internet আর কখনো জাদু মনে হবে না, বরং একটা বিশাল কিন্তু বোঝার মতো যন্ত্র মনে হবে।",
  },
  assignment: {
    title: "Mini Project: আপনার নিজের Packet এর মানচিত্র",
    time: "১ - ২ ঘণ্টা",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>তিনটা পথ আঁকুন:</strong> তিনটা আলাদা সার্ভারে traceroute চালান,
        একটা bd, একটা Singapore বা India, একটা আমেরিকা বা Europe। প্রতিটার Hop
        সংখ্যা আর শেষ ms লিখুন। তিনটা কি দূরত্বের ক্রমে সাজানো?
      </span>,
      <span key="2">
        <strong>সমুদ্র চিহ্নিত করুন:</strong> দূরের traceroute টায় কোন লাইনে
        বড় লাফ, সেটা মার্ক করুন। তার আগের Hop এর নাম আর পরের Hop এর নাম লিখুন।
        একটা দেশের ভেতরের, একটা বিদেশি, বোঝা যাচ্ছে?
      </span>,
      <span key="3">
        <strong>ম্যাপে মেলান:</strong> submarinecablemap.com এ Bangladesh এর
        তারগুলো দেখুন, নাম লিখুন। আপনার সমুদ্রের লাফটা সম্ভবত কোন তার দিয়ে
        গেছে, অনুমান করুন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু বললেন, আমার
        সাইট US এর ইউজারদের কাছে ধীর। আপনি তাঁকে কী কী মাপতে বলবেন, আর সমস্যা
        যদি দূরত্ব হয়, সমাধান কী? CDN শব্দটা ব্যবহার করুন।
      </span>,
    ],
    deliverables: [
      <span key="1">
        তিনটা traceroute এর Hop সংখ্যা আর সময়, দূরত্বের ক্রমে
      </span>,
      <span key="2">সমুদ্রের লাফের আগে পরের Hop চিহ্নিত</span>,
      <span key="3">Bangladesh এর সমুদ্র তারের নাম, আর নিজের পথের অনুমান</span>,
      <span key="4">দূরের ইউজারের ধীর সাইট নিয়ে ৫ লাইনের সমাধান</span>,
    ],
  },
};
