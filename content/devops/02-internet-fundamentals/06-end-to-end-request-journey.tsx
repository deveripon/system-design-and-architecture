/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  FullJourneyLab,
  NarrateItLab,
} from "../../../components/course/topics/journey/animations";
import {
  FullJourneyDiagram,
  TimeBudgetDiagram,
  WhoOwnsWhatDiagram,
} from "../../../components/course/topics/journey/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const endToEndRequestJourneyContent: TopicData = {
  id: "end-to-end-request-journey",
  introduction: {
    badge: "MODULE 02 · LESSON 06",
    title: <SectionTitle>Enter চাপা থেকে পর্দায় তালিকা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই মডিউলের শেষ লেসন, আর এটা নতুন কিছু শেখানোর লেসন নয়। এটা জোড়া
          লাগানোর লেসন। আগের পাঁচটা লেসনে আপনি আলাদা আলাদা করে টুকরোগুলো
          শিখেছেন, নেটওয়ার্ক, Client আর Server, Port আর Socket, Packet আর
          Latency, আর ডেটার শারীরিক যাত্রা। এবার আমরা একটা মাত্র বাটন চাপব, আর
          দেখব ওই পাঁচটা টুকরো কীভাবে এক মুহূর্তে, এক সারিতে, সবাই মিলে কাজ করে।
        </ContentParagraph>
        <ContentParagraph>
          পর্যটক Cox&apos;s Bazar এর সৈকতে বসে Island Tours খুললেন, আর Tour এর
          তালিকাটা লোড হতে দিলেন। তাঁর কাছে এটা এক পলকের ব্যাপার, একটা তালিকা
          এলো, ব্যস। কিন্তু ওই এক পলকের ভেতরে তাঁর একটা অনুরোধ অন্য মহাদেশে গেল,
          একটা Database ছুঁলো, আর উত্তর নিয়ে ফিরে এলো, প্রায় দশটা আলাদা
          কোম্পানির যন্ত্রের হাত ঘুরে।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি এই পুরো যাত্রাটা নিজের মুখে, শুরু থেকে শেষ পর্যন্ত,
          কারো সাহায্য ছাড়া বলতে পারবেন। সেটাই এই লেসনের একমাত্র লক্ষ্য, আর
          সেটাই এই মডিউল শেষ করার আসল প্রমাণ।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আপনি একটা বাটন চাপলেন। ভেতরে দশটা মেশিন, দুইটা মহাদেশ, একটা সমুদ্র, আর পাঁচটা লেসন, সব একসাথে কাজ করল। আপনি শুধু দেখলেন তালিকা এলো।",
      author: "Internet Fundamentals",
      role: "Lesson 06",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "overview",
      subHeader: { index: "001", title: "The Whole Arc" },
      title: <SectionTitle>পুরো যাত্রা, এক নজরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগে পুরো ছবিটা এক নজরে দেখি, তারপর ধাপে ধাপে ঢুকব। একটা Request
                এর জীবন মোটামুটি দশটা ধাপে ভাগ করা যায়। শুরু আপনার Browser এ,
                শেষ আবার আপনার Browser এ, আর মাঝখানে একটা লম্বা যাত্রা।
              </ContentParagraph>
              <ContentParagraph>
                নিচের ছবিতে দুইটা ধাপ ধূসর, নাম থেকে নম্বর আর খাম বন্ধ করা। এই
                দুইটা এই মডিউলে শেখানো হয়নি, ওগুলো Module 04 আর 06 এর। আমি
                ইচ্ছে করেই এগুলো রেখেছি, যাতে পুরো ছবিটা সত্যিকারের হয়, আর আপনি
                জানেন সামনে কী আসছে। বাকি আটটা ধাপ আপনার চেনা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FullJourneyDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনটা আলাদা কেন",
          content: (
            <p>
              আগের লেসনগুলো ছিল গভীরে যাওয়ার, একটা জিনিস ভালো করে বোঝার। এই
              লেসনটা উল্টো, উপরে ওঠার, সবগুলো একসাথে দেখার। বাস্তব কাজে আপনার এই
              দুইটাই লাগবে। যখন কিছু ভাঙে, আপনি প্রথমে এই পুরো ছবিটা মাথায়
              আনবেন, তারপর আঙুল দিয়ে দেখাবেন সমস্যাটা কোন ধাপে, আর তারপর ওই এক
              ধাপের গভীরে ঢুকবেন। উপরে ওঠা আর গভীরে যাওয়া, এই দুইয়ের যাওয়া
              আসাই একজন ভালো ইঞ্জিনিয়ারের কাজ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "walk",
      subHeader: { index: "002", title: "Step Through" },
      title: <SectionTitle>এবার ধাপে ধাপে হাঁটি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের লাবটা এই লেসনের কেন্দ্র। Play চাপুন, বা Step দিয়ে ধীরে ধীরে
              যান। বাঁ পাশে প্রতিটা ধাপ, আর তার পাশে লেখা সেটা কোন লেসনের। উপরের
              ঘড়িটা দেখায় সময় কীভাবে জমে। খেয়াল করুন, সবচেয়ে বেশি সময়
              কোথায় যায়।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FullJourneyLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একই যাত্রাটা লেখায় ধরি, একটু ধীরে, যাতে প্রতিটা ধাপে কোন
                লেসনের জিনিস কাজ করছে সেটা স্পষ্ট হয়। এটাই সেই গল্প যেটা লেসন
                শেষে আপনি নিজের মুখে বলতে পারবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আপনি URL লিখলেন।</strong> Browser এ islandtours.com।
                  এখনো কিছু বাইরে যায়নি। Browser জানে, এটা একটা Web এর কথা, তাই
                  সে মনে মনে ঠিক করে নিল ফ্ল্যাটের নম্বর হবে 443।
                </ListItem>
                <ListItem>
                  <strong>নাম থেকে নম্বর।</strong> Internet নাম চেনে না, শুধু
                  সংখ্যা, এটা Lesson 01 এ দেখেছেন। তাই islandtours.com কে আগে
                  একটা IP Address এ বদলাতে হয়। কে বদলায়, কীভাবে বদলায়, সেটা
                  Module 04 এর পুরোটা। আপাতত ধরুন নম্বরটা পাওয়া গেল।
                </ListItem>
                <ListItem>
                  <strong>Packet রাস্তায় নামল।</strong> এবার Lesson 05 এর
                  যাত্রা। আপনার Router, ISP, IIG, সমুদ্রের তার, Singapore এর
                  ISP, প্রত্যেকে শুধু পরের এক ধাপ জেনে ঠিকানার দিকে Packet ঠেলল।
                  মাধ্যম বদলাল বারবার, ঠিকানা এক থাকল।
                </ListItem>
                <ListItem>
                  <strong>দরজায় কড়া, Port 443।</strong> মেশিনে পৌঁছে Lesson 03
                  এর পালা। Packet এর খামে ফ্ল্যাটের নম্বর 443। Kernel খাতা দেখে
                  বুঝল সেখানে nginx বসা, আর তার হ্যান্ডসেটে কথাটা তুলে দিল।
                </ListItem>
                <ListItem>
                  <strong>খাম বন্ধ হলো।</strong> আসল কথা শুরুর আগে দুই পক্ষ একটা
                  গোপন তালা বানায়, যাতে পথের কোনো Router খামের ভেতরটা পড়তে না
                  পারে। এটাই HTTPS, Module 06 এর বিষয়। এই ধাপে কয়েকবার যাওয়া
                  আসা লাগে, তাই সময় বেশি।
                </ListItem>
                <ListItem>
                  <strong>nginx থেকে API।</strong> এখন Lesson 02 এর ভূমিকার
                  খেলা। nginx নিজে উত্তর জানে না, সে ভেতরে ভেতরে API কে ডাকে,
                  127.0.0.1:3000 এ, মানে একই বিল্ডিংয়ের ভেতরে, Loopback দিয়ে।
                  এই কথায় nginx হলো Client, API হলো Server।
                </ListItem>
                <ListItem>
                  <strong>API এখন নিজেই Client।</strong> API তালিকা জানে না, তাই
                  Database কে জিজ্ঞেস করে। এক মুহূর্ত আগে যে Server ছিল, সে এখন
                  Client। এটাই ছিল Lesson 02 এর সবচেয়ে বড় কথা, ভূমিকা কথা ধরে
                  বদলায়, মেশিন ধরে নয়।
                </ListItem>
                <ListItem>
                  <strong>Response টুকরো হয়ে ফিরল।</strong> Database তালিকা
                  দিল, API Response বানাল, আর সেটা আবার Lesson 04 এর Packet এ
                  ভাগ হয়ে ফিরল, একই সমুদ্র উল্টো দিকে। খামে এবার আপনার Phone এর
                  ঠিকানা আর সেই সাময়িক ফেরার Port।
                </ListItem>
                <ListItem>
                  <strong>Browser পর্দায় আঁকল।</strong> Packet গুলো এসে ক্রমে
                  সাজল, Kernel পুরো Response টা Browser কে দিল, আর Browser Tour
                  এর তালিকা পর্দায় আঁকল। যাত্রা শেষ, প্রায় ৩৮০ মিলিসেকেন্ডে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "who-owns",
      subHeader: { index: "003", title: "Which Lesson" },
      title: <SectionTitle>প্রতিটা ধাপ, কোন লেসনের</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো যাত্রাটা আসলে এই মডিউলের সূচিপত্র, উল্টো করে সাজানো। নিচের
              টেবিলে প্রতিটা ধাপের পাশে লেখা সেটা কোন লেসনে শিখেছেন। কমলা
              সারিগুলো আপনার জানা, ধূসর দুইটা সামনে আসছে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhoOwnsWhatDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই টেবিলটাই আপনার Debugging এর মানচিত্র",
          content: (
            <p>
              একদিন Production এ কিছু ভাঙবে, আর আপনার হাতে থাকবে শুধু একটা
              লক্ষণ, সাইট ধীর, বা খুলছে না। তখন এই টেবিলটা মাথায় আনুন, আর উপর
              থেকে নিচে প্রশ্ন করুন। নাম নম্বরে বদলাচ্ছে তো? রাস্তা ঠিক আছে তো,
              traceroute কী বলে? সঠিক Port এ কেউ শুনছে তো, Connection refused
              নাকি Timeout? সমস্যাটা Latency নাকি সার্ভারের কোড? প্রতিটা প্রশ্ন
              এই মডিউলের একটা লেসন, আর প্রতিটা প্রশ্নের একটা কমান্ড আছে যেটা
              আপনি ইতিমধ্যে শিখেছেন। ভালো Debugging মানে এলোমেলো চেষ্টা নয়, এই
              টেবিল ধরে ধরে এক এক করে বাদ দেওয়া।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "time",
      subHeader: { index: "004", title: "The Clock" },
      title: <SectionTitle>সময়টা আসলে কোথায় যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লাবের ঘড়িটা খেয়াল করেছেন হয়তো। পুরো যাত্রায় প্রায় ৩৮০
                মিলিসেকেন্ড লাগল, কিন্তু সেই সময়টা সব জায়গায় সমানভাবে ভাগ
                হয়নি। এই ভাগটা বোঝা গুরুত্বপূর্ণ, কারণ এটাই ঠিক করে দেয় সাইট
                দ্রুত করতে হলে কোথায় হাত দিতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের ছবিটা দেখুন, আর একটা জিনিস খেয়াল করুন যেটা প্রায় সবাইকে
                অবাক করে। আপনার নিজের লেখা কোড, মানে সার্ভারের নিজের কাজ, পুরো
                সময়ের সবচেয়ে ছোট অংশ। বড় অংশটা যায় যাওয়া আসায়, রাস্তা
                তৈরিতে, খাম বন্ধ করায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TimeBudgetDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "তাই দ্রুত সাইট মানে প্রায়ই দ্রুত কোড নয়",
          content: (
            <p>
              নতুন ডেভেলপাররা সাইট ধীর দেখলে প্রথমে কোড দ্রুত করতে বসেন। কিন্তু
              কোড যদি মোট সময়ের দশ ভাগের এক ভাগ হয়, তাহলে সেটা অর্ধেক করেও
              আপনি খুব সামান্যই পাবেন। আসল লাভ যাওয়া আসা কমানোয়, আর তার তিনটা
              বড় উপায় এই মডিউল থেকেই বেরিয়ে আসে। এক, পাতাটা যেন সার্ভারের
              সাথে কম বার কথা বলে, কারণ প্রতিটা কথা এক Round Trip, Lesson 04।
              দুই, সার্ভার ইউজারের কাছে আনা, যাতে দূরত্ব কমে, Lesson 05 এর CDN।
              তিন, একবার বানানো উত্তর জমিয়ে রাখা, যাতে বারবার Database এ যেতে
              না হয়, Module 14 এর Cache। মাপার আগে ঠিক করবেন না কোনটা লাগবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "narrate",
      subHeader: { index: "005", title: "Your Turn" },
      title: <SectionTitle>এবার আপনি বলুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউল সত্যিই বসেছে কিনা, তার সবচেয়ে সহজ পরীক্ষা হলো, যাত্রার
              একটা ধাপ শুনে আপনি বলতে পারেন কিনা সেটা কোন লেসনের গল্প। নিচে
              পাঁচটা প্রশ্ন। পাঁচটাই ঠিক হলে ধরে নিন Module 02 আপনার হাতের
              মুঠোয়।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NarrateItLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "project",
      subHeader: { index: "006", title: "Project Example" },
      title: <SectionTitle>Island Tours এর একটা বুকিং, পুরোটা</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তালিকা দেখা তো তুলনায় সহজ, শুধু পড়া। এবার একটা সত্যিকারের
                বুকিং ধরি, যেখানে টাকা কাটা হয়, Seat কমে, আর একটা Email যায়।
                এই এক বুকিং এ পুরো মডিউল তো লাগেই, তার উপর কয়েকটা জিনিস একসাথে
                ঘটে যেগুলো আলাদা আলাদা লেসনে দেখেছেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক বুকিং, API চারবার Client:</strong> পর্যটকের কাছে
                  API একবার Server। কিন্তু ওই এক বুকিং সারতে API নিজে Client হয়
                  চারবার, Database এর কাছে Seat দেখতে, bKash এর কাছে টাকা কাটতে,
                  আবার Database এ Booking লিখতে, আর Email সার্ভিসের কাছে চিঠি
                  পাঠাতে। প্রতিটা আলাদা যাত্রা, আর প্রতিটাতে Lesson 02 এর ভূমিকা
                  বদল।
                </ListItem>
                <ListItem>
                  <strong>bKash এর যাত্রা আবার Bangladesh এ:</strong> মজার
                  ব্যাপার, API Singapore এ, কিন্তু bKash এর সার্ভার Dhaka তে।
                  তাই টাকা কাটার কথাটা Singapore থেকে আবার সমুদ্র পেরিয়ে
                  Bangladesh এ আসে, তারপর উত্তর আবার Singapore এ ফেরে। এই এক
                  কথায় সমুদ্র দুইবার পার হয়, Lesson 05 দুইবার।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা বাইরের কথায় একটা Timeout:</strong> bKash যদি
                  দেরি করে, পর্যটকও দেরি দেখেন, কারণ লাইনটা জোড়া। তাই প্রতিটা
                  বাইরের ডাকে একটা সময়ের সীমা বাঁধা, Lesson 02 এর Timeout। এই
                  সীমা না থাকলে একজনের ধীর সার্ভার আপনার পুরো সাইটকে আটকে দিতে
                  পারত।
                </ListItem>
                <ListItem>
                  <strong>Seat দুইজন একসাথে চাইলে:</strong> ঠিক এই যাত্রার
                  মাঝখানেই Module 01 এর Race Condition ফিরে আসে। শেষ Seat টা
                  দুইজন একই মুহূর্তে বুক করতে চাইলে, Database এর Lock ই ঠিক করে
                  কে পাবে। মানে এক বুকিং এ Module 01 আর 02 দুইটাই একসাথে কাজ
                  করছে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই ছবিটাই বাকি কোর্সের ভিত্তি",
          content: (
            <p>
              এতক্ষণে একটা জিনিস পরিষ্কার হওয়ার কথা। বাকি মডিউলগুলো আসলে এই এক
              যাত্রার আলাদা আলাদা অংশকে গভীর করা। Module 03 আর 04 ঠিকানা আর নাম
              নিয়ে, মানে যাত্রার শুরু। Module 05 আর 06 খাম আর তালা নিয়ে।
              Module 08 থেকে Backend, মানে সার্ভারের নিজের কাজ। Module 11 থেকে
              সেই nginx, যেটা সামনে বসে। Module 12 সেই CDN, দূরত্ব কমাতে।
              প্রতিটা মডিউল এই ছবির একটা অংশে জুম করা। ছবিটা মাথায় থাকলে আপনি
              কখনো হারাবেন না, সবসময় জানবেন এখন কোন অংশে আছেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "request-flow",
      subHeader: { index: "007", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা বুকিং, দশ ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো বুকিং যাত্রাটা এক জায়গায়। প্রতিটা ধাপের পাশে মনে মনে বলুন,
              এটা কোন লেসনের। পারলে বুঝবেন মডিউলটা হয়ে গেছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "নাম থেকে নম্বর",
              description:
                "Phone islandtours.com কে একটা IP Address এ বদলাল। কীভাবে, Module 04। এখন গন্তব্য জানা।",
            },
            {
              title: "রাস্তায় নামা",
              description:
                "বুকিং এর Packet ISP, IIG, সমুদ্রের তার হয়ে Singapore চলল। Lesson 05 এর পুরো পথ।",
            },
            {
              title: "দরজায় কড়া",
              description:
                "মেশিনে পৌঁছে Port 443 খুঁজল, Kernel nginx এর হ্যান্ডসেটে দিল। Lesson 03।",
            },
            {
              title: "খাম বন্ধ, তারপর API",
              description:
                "HTTPS তালা বসল (Module 06), তারপর nginx ভেতরে API কে ডাকল। এই কথায় nginx Client, API Server। Lesson 02।",
            },
            {
              title: "API, Seat আছে কিনা দেখা",
              description:
                "API Database কে জিজ্ঞেস করল শেষ Seat আছে কিনা। API এখন Client। এখানেই Module 01 এর Lock, যাতে দুইজন একই Seat না পান।",
            },
            {
              title: "API, টাকা কাটা",
              description:
                "API bKash কে বলল টাকা কাটতে। এই কথা আবার সমুদ্র পেরিয়ে Dhaka গেল আর ফিরল। একটা Timeout বাঁধা, নাহলে পর্যটক আটকে থাকতেন।",
            },
            {
              title: "API, Booking লেখা",
              description:
                "টাকা কাটা হলে API Database এ Booking লিখল আর Seat এক কমাল। আবার API Client।",
            },
            {
              title: "API, Email পাঠানো",
              description:
                "API একটা Email সার্ভিসকে Confirmation পাঠাতে বলল। চতুর্থবার API Client। এক বুকিং, চারবার Client, একবার Server।",
            },
            {
              title: "Response টুকরো হয়ে ফেরা",
              description:
                "বুকিং হয়ে গেছে, এই উত্তর Packet এ ভাগ হয়ে একই সমুদ্র উল্টো দিকে পার হলো। Lesson 04 আর 05।",
            },
            {
              title: "পর্দায় নিশ্চিত বার্তা",
              description:
                "Browser উত্তর সাজিয়ে পর্দায় দেখাল, বুকিং সফল। পর্যটক শুধু দেখলেন একটা সবুজ টিক, ভেতরের পুরো যাত্রা টের পেলেন না।",
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
                <strong>What happens when you type a URL</strong>, এই বিখ্যাত
                প্রশ্নটা প্রায় প্রতিটা বড় কোম্পানির ইন্টারভিউতে আসে। GitHub এ
                &quot;what happens when&quot; নামে একটা সংকলন আছে, খুঁজে পড়ুন।
                এই লেসনটাই তার সহজ রূপ।{" "}
                <a
                  href="https://github.com/alex/what-happens-when"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  github.com/alex/what-happens-when
                </a>
              </ListItem>
              <ListItem>
                <strong>নিজের চোখে পুরো যাত্রা</strong>, Browser এ F12 চেপে
                Network ট্যাব খুলুন, তারপর একটা সাইট লোড করুন। প্রতিটা Request
                এর সময় ভাগ করা দেখবেন, কোথায় কত মিলিসেকেন্ড গেল। এই লেসনের
                ঘড়িটা সেখানে সত্যি।
              </ListItem>
              <ListItem>
                <strong>High Performance Browser Networking</strong>, Ilya
                Grigorik, বিনামূল্যে। এই পুরো যাত্রার প্রতিটা ধাপ বইটিতে
                গভীরভাবে আছে, পরের ধাপের পড়া।{" "}
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
    /* ---------------------------------------------------------------- 9 */
    {
      id: "recap",
      subHeader: { index: "009", title: "Recap" },
      title: <SectionTitle>Module 02, ৫ মিনিটে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                একটা Request এর পুরো জীবন দশ ধাপ, শুরু আর শেষ আপনার Browser এ,
                মাঝখানে অন্য মহাদেশ। এই লেসন নতুন কিছু নয়, আগের পাঁচটার জোড়া।
              </ListItem>
              <ListItem>
                নাম থেকে নম্বর (Module 04) আর খাম বন্ধ করা (Module 06), এই দুইটা
                ছাড়া বাকি পুরো যাত্রা আপনি এই মডিউলেই শিখেছেন।
              </ListItem>
              <ListItem>
                Internet এর কোনো মালিক নেই (L1), দুই মাথায় Client আর Server
                (L2), মেশিনে Port আর Socket (L3), কথা যায় Packet এ আর Latency
                বনাম Bandwidth (L4), আর পথটা শারীরিক, সমুদ্রের তার আর Hop (L5)।
              </ListItem>
              <ListItem>
                পুরো সময়ের বেশিরভাগ যায় যাওয়া আসায়, আপনার কোডে নয়। তাই
                দ্রুত সাইট মানে প্রায়ই কম কথা, কাছের সার্ভার, আর জমানো উত্তর।
              </ListItem>
              <ListItem>
                এই পুরো ছবিটাই আপনার Debugging এর মানচিত্র। কিছু ভাঙলে ছবিটা
                মাথায় আনুন, ধাপ ধরে ধরে বাদ দিন, প্রতিটা ধাপের একটা করে কমান্ড
                আপনি জানেন।
              </ListItem>
              <ListItem>
                বাকি প্রতিটা মডিউল এই এক যাত্রার একটা অংশে জুম করা। ছবিটা মাথায়
                থাকলে আপনি কখনো হারাবেন না।
              </ListItem>
              <ListItem>
                পরের মডিউল: এই যাত্রায় আমরা যেটা ধরে নিয়েছিলাম, ঠিকানা। এবার
                ঠিকানা আসলে কীভাবে কাজ করে, IP, MAC, Subnet, Gateway, পুরো
                Computer Networking।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধাপ", "কোন লেসন"],
    rows: [
      [
        <span className="font-bold text-primary">নাম থেকে নম্বর</span>,
        "DNS, Module 04 এ শিখবেন",
      ],
      [
        <span className="font-bold text-primary">মালিকহীন রাস্তা</span>,
        "Lesson 01, Internet কী",
      ],
      [
        <span className="font-bold text-primary">Client আর Server</span>,
        "Lesson 02, ভূমিকা মেশিন নয়",
      ],
      [
        <span className="font-bold text-primary">Port আর Socket</span>,
        "Lesson 03, কোন Program",
      ],
      [
        <span className="font-bold text-primary">Packet, Latency</span>,
        "Lesson 04, টুকরো আর দেরি",
      ],
      [
        <span className="font-bold text-primary">সমুদ্রের পথ</span>,
        "Lesson 05, ডেটা কীভাবে যায়",
      ],
      [
        <span className="font-bold text-primary">খাম বন্ধ, HTTPS</span>,
        "Module 06 এ শিখবেন",
      ],
      [
        <span className="font-bold text-primary">ভূমিকা বদল, Timeout</span>,
        "Lesson 02, API ও Client হয়",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "islandtours.com লেখার পর Internet এ Packet পাঠানোর আগে প্রথম কী করতে হয়?",
        options: [
          {
            key: "A",
            text: "সরাসরি সার্ভারে Packet পাঠানো",
            isCorrect: false,
            explanation:
              "Internet নাম চেনে না, শুধু সংখ্যা। নামটা আগে একটা IP Address এ বদলাতে হয়।",
          },
          {
            key: "B",
            text: "নামটাকে একটা IP Address এ বদলানো, DNS দিয়ে",
            isCorrect: true,
            explanation:
              "নাম থেকে নম্বর, এটাই প্রথম ধাপ। কীভাবে হয়, Module 04। Lesson 01 এ দেখেছিলেন Internet শুধু সংখ্যা চেনে।",
          },
          {
            key: "C",
            text: "HTTPS তালা বসানো",
            isCorrect: false,
            explanation:
              "তালা পরে বসে, সার্ভারে পৌঁছানোর পর। তার আগে ঠিকানা লাগে, নাহলে যাবে কোথায়?",
          },
        ],
      },
      {
        id: 2,
        text: "পুরো যাত্রায় সবচেয়ে বেশি সময় সাধারণত কোথায় যায়?",
        options: [
          {
            key: "A",
            text: "সার্ভারের নিজের কোডে",
            isCorrect: false,
            explanation:
              "অবাক করা হলেও, কোড প্রায়ই সবচেয়ে ছোট অংশ। বড় অংশ যাওয়া আসায়।",
          },
          {
            key: "B",
            text: "যাওয়া আসায়, রাস্তা তৈরি আর খাম বন্ধ করায়",
            isCorrect: true,
            explanation:
              "এই কারণেই দ্রুত সাইট মানে প্রায়ই দ্রুত কোড নয়, বরং কম যাওয়া আসা, কাছের সার্ভার, জমানো উত্তর।",
          },
          {
            key: "C",
            text: "Browser পর্দায় আঁকায়",
            isCorrect: false,
            explanation:
              "আঁকায় কিছু সময় যায় বটে, কিন্তু সবচেয়ে বড় অংশ নয়। বড় অংশ Network এ।",
          },
        ],
      },
      {
        id: 3,
        text: "nginx যখন ভেতরে ভেতরে API কে 127.0.0.1:3000 এ ডাকে, তখন nginx কী?",
        options: [
          {
            key: "A",
            text: "Server, কারণ nginx বড়",
            isCorrect: false,
            explanation:
              "এই কথায় nginx আগে জিজ্ঞেস করছে। যে আগে জিজ্ঞেস করে সে Client, আকার যাই হোক।",
          },
          {
            key: "B",
            text: "Client, কারণ এই কথাটা nginx শুরু করেছে",
            isCorrect: true,
            explanation:
              "বাইরের পর্যটকের কাছে nginx Server, কিন্তু API এর কাছে Client। ভূমিকা কথা ধরে বদলায়, Lesson 02।",
          },
          {
            key: "C",
            text: "কোনোটাই না, nginx শুধু রাস্তা",
            isCorrect: false,
            explanation:
              "nginx নিজে কথা শুরু করছে, তাই সে একটা পক্ষ, রাস্তা নয়।",
          },
        ],
      },
      {
        id: 4,
        text: "এক বুকিং সারতে Island Tours এর API কতবার Client হয়?",
        options: [
          {
            key: "A",
            text: "একবারও না, API সবসময় Server",
            isCorrect: false,
            explanation:
              "API পর্যটকের কাছে Server, কিন্তু Database, bKash, Email এর কাছে Client। বারবার।",
          },
          {
            key: "B",
            text: "চারবার, Database দুইবার, bKash, আর Email",
            isCorrect: true,
            explanation:
              "Seat দেখা, টাকা কাটা, Booking লেখা, Email পাঠানো। এক বুকিং, চারবার Client, একবার Server।",
          },
          {
            key: "C",
            text: "একবার, শুধু Database এ",
            isCorrect: false,
            explanation:
              "শুধু Database নয়, bKash আর Email সার্ভিসও আছে। প্রতিটা বাইরের কথায় API Client।",
          },
        ],
      },
      {
        id: 5,
        text: "Production এ সাইট হঠাৎ ধীর। এই মডিউলের দৃষ্টিতে প্রথম কাজ কী?",
        options: [
          {
            key: "A",
            text: "কোড নতুন করে লেখা",
            isCorrect: false,
            explanation:
              "সমস্যা কোথায় না জেনে কোড লেখা মানে অন্ধকারে ঢিল। আগে দেখতে হবে সমস্যাটা কোন ধাপে।",
          },
          {
            key: "B",
            text: "যাত্রার ছবিটা মাথায় এনে ধাপ ধরে ধরে বাদ দেওয়া, প্রতিটার একটা কমান্ড আছে",
            isCorrect: true,
            explanation:
              "নাম বদলাচ্ছে তো (dig), রাস্তা ঠিক তো (traceroute), Port এ কেউ শুনছে তো (curl, lsof), Latency নাকি কোড। এক এক করে বাদ দিলেই সমস্যা ধরা পড়ে।",
          },
          {
            key: "C",
            text: "সার্ভার বড় করা",
            isCorrect: false,
            explanation:
              "সমস্যা যদি রাস্তায় বা Latency তে হয়, বড় সার্ভার এক ফোঁটাও সাহায্য করবে না। আগে মাপুন।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "পুরো যাত্রা নিজের চোখে দেখুন",
    subtitle: "Browser আর Terminal, পাঁচটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "Browser এর ঘড়ি খুলুন",
        description:
          "F12 চেপে Network ট্যাব খুলে একটা সাইট লোড করুন। প্রতিটা Request এর সময় ভাগ করা দেখবেন, এই লেসনের ঘড়িটা সেখানে সত্যি।",
      },
      {
        title: "একটা Request এর ভাঙা সময়",
        description:
          "একটা Request এ চাপুন, Timing দেখুন। নাম খোঁজা, তালা বসানো, অপেক্ষা, ডাউনলোড, প্রতিটা আলাদা করে দেখানো।",
      },
      {
        title: "পুরো যাত্রা কমান্ডে",
        description:
          "একটা সাইটের জন্য পরপর dig, traceroute, curl চালান। তিনটা মিলে যাত্রার শুরু, মাঝ, শেষ।",
      },
      {
        title: "ধাপ ধরে দোষ খোঁজা",
        description:
          "একটা ভুল নাম, একটা বন্ধ Port, একটা দূরের সার্ভার, তিনটায় আলাদা এরর পাবেন। প্রতিটা এরর বলে দেয় কোন ধাপে সমস্যা।",
      },
      {
        title: "নিজের যাত্রা লিখুন",
        description:
          "আপনার নিজের একটা প্রিয় সাইট বেছে, F12 আর Terminal মিলিয়ে তার পুরো যাত্রাটা কাগজে আঁকুন, এই লেসনের ছবির মতো।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-browser-timing.md",
        language: "markdown",
        code: `# Browser এই লেসনের সবচেয়ে ভালো ল্যাব, কোনো ইনস্টল লাগে না

১. যেকোনো সাইট খুলুন, F12 চাপুন (বা ডান ক্লিক > Inspect)
২. উপরে "Network" ট্যাব এ যান
৩. পাতাটা Reload করুন (Ctrl+R বা Cmd+R)

এখন প্রতিটা Request এক লাইন করে দেখবেন। ডান দিকে একটা
Waterfall, মানে সময়ের বার। লম্বা বার মানে ধীর Request।

একটা Request এ চাপুন, তারপর "Timing" ট্যাব:
  Queued / Stalled    ← লাইনে অপেক্ষা
  DNS Lookup          ← নাম থেকে নম্বর, এই লেসনের ধাপ ২
  Initial connection  ← রাস্তা তৈরি
  SSL                 ← খাম বন্ধ, HTTPS, ধাপ ৫
  Waiting (TTFB)      ← সার্ভারের নিজের কাজ + Latency
  Content Download    ← Bandwidth, টুকরো নামা

এই নামগুলো ঠিক এই লেসনের ধাপ। Browser আপনাকে আসল সংখ্যা দেখাচ্ছে।`,
      },
      {
        filename: "2-journey-in-commands.sh",
        language: "bash",
        code: `# যাত্রার তিন অংশ, তিন কমান্ড, একটা সাইটের জন্য

# শুরু: নাম থেকে নম্বর
dig +short github.com
# একটা IP Address ফেরত পাবেন। এটাই ধাপ ২, যেটা Module 04 এ শিখবেন।

# মাঝ: রাস্তা
traceroute -q 1 github.com
# প্রতিটা Hop এক লাইন, এই লেসনের ধাপ ৩। Lesson 05 এর পুরো পথ।

# শেষ: দরজায় কড়া, উত্তর
curl -s -o /dev/null -w "মোট সময়: %{time_total}s\\nপ্রথম Byte: %{time_starttransfer}s\\n" https://github.com
# time_starttransfer পর্যন্ত হলো যাওয়া, বাকিটা উত্তর নামা।
# তিনটা কমান্ড মিলে পুরো যাত্রা, নিজের চোখে।`,
      },
      {
        filename: "3-timing-breakdown.sh",
        language: "bash",
        code: `# curl নিজেই পুরো যাত্রার সময় ভাগ করে দেখাতে পারে
curl -s -o /dev/null -w "\\
নাম খোঁজা (DNS):     %{time_namelookup}s
রাস্তা তৈরি:         %{time_connect}s
তালা বসানো (SSL):    %{time_appconnect}s
প্রথম Byte:          %{time_starttransfer}s
মোট:                 %{time_total}s
" https://github.com

# প্রতিটা সংখ্যা আগেরটার উপরে জমা, মানে time_total সবচেয়ে বড়।
# বিয়োগ করলে প্রতিটা ধাপের নিজের সময় পাবেন:
#   রাস্তা = time_connect - time_namelookup
#   তালা   = time_appconnect - time_connect
# এই ভাগটাই এই লেসনের ঘড়ির ছবি, আপনার নিজের Internet এ।`,
      },
      {
        filename: "4-break-each-step.sh",
        language: "bash",
        code: `# প্রতিটা এরর বলে দেয় কোন ধাপে সমস্যা

# ধাপ ২ ভাঙা: এমন নাম যেটা নেই
curl --max-time 5 https://this-name-does-not-exist-xyz.com
# curl: (6) Could not resolve host
# মানে নাম থেকে নম্বরেই আটকাল, Packet এখনো রওনাই হয়নি।

# ধাপ ৪ ভাঙা: ঠিক মেশিন, কিন্তু বন্ধ Port
curl --max-time 5 https://github.com:9999
# ... Timeout বা refused ...
# মানে বিল্ডিং ঠিক, ফ্ল্যাট বন্ধ। Lesson 03 এর কথা।

# ধাপ ৩ ভাঙা: পথে সমস্যা, মেশিনই নেই
curl --max-time 5 http://10.255.255.1
# ... Connection timed out ...
# মানে বিল্ডিং পর্যন্ত পৌঁছালই না। Lesson 05 এর কথা।

# তিনটা আলাদা এরর, তিনটা আলাদা ধাপ। এররটাই আপনার মানচিত্র।`,
      },
      {
        filename: "5-your-own-journey.md",
        language: "markdown",
        code: `# আপনার নিজের একটা সাইটের পুরো যাত্রা আঁকুন

একটা প্রিয় সাইট বেছে নিন, ধরুন আপনার পছন্দের একটা bd সাইট।
তারপর এই ছবিটা কাগজে বা কোনো Drawing App এ বানান:

  [ আপনার Browser ]
        |  dig দিয়ে পাওয়া IP লিখুন
  [ নাম -> নম্বর ]
        |  traceroute এর Hop সংখ্যা লিখুন
  [ রাস্তা, কয়টা Hop ]
        |  সমুদ্রের লাফ ছিল? কোন লাইনে?
  [ সার্ভার, কোন দেশ ]
        |  curl এর time_total লিখুন
  [ উত্তর ফিরল ]
        |
  [ পর্দায় ছবি ]

প্রতিটা তীরের পাশে লিখুন সেটা কোন লেসনের।
এই এক কাগজ বানাতে পারলে, Module 02 সত্যিই আপনার হয়ে গেছে।`,
      },
    ],
    tip: "এক নম্বর পরীক্ষাটা, মানে Browser এর Network ট্যাব, আপনার সারা জীবনের সঙ্গী হবে। প্রতিটা Frontend আর Backend ডেভেলপার দিনে বহুবার এটা খোলেন, কারণ এটাই সেই জায়গা যেখানে এই লেসনের পুরো ঘড়িটা আসল সংখ্যায় দেখা যায়। কোনো সাইট ধীর লাগলে সবার আগে এটা খুলুন, দেখুন লম্বা বারটা কোথায়, আর সেই ধাপের লেসনটা মনে করুন। এই এক অভ্যাস আপনাকে অনুমান করা থেকে মাপা তে নিয়ে যাবে, আর সেটাই একজন জুনিয়র আর সিনিয়র ইঞ্জিনিয়ারের মধ্যে সবচেয়ে বড় তফাত।",
  },
  assignment: {
    title: "Mini Project: পুরো যাত্রা, নিজের হাতে",
    time: "২ - ৩ ঘণ্টা",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>একটা সাইটের ঘড়ি:</strong> একটা সাইট বেছে, Lab এর তিন নম্বর curl
        কমান্ড চালিয়ে পাঁচটা সময় লিখুন। তারপর বিয়োগ করে প্রতিটা ধাপের নিজের
        সময় বের করুন। কোন ধাপ সবচেয়ে বড়?
      </span>,
      <span key="2">
        <strong>তিনটা এরর, তিন ধাপ:</strong> Lab এর চার নম্বর তিনটা কমান্ড
        চালিয়ে তিনটা আলাদা এরর বার্তা লিখুন। প্রতিটার পাশে লিখুন সেটা যাত্রার
        কোন ধাপে আটকেছে, আর কোন লেসনের।
      </span>,
      <span key="3">
        <strong>my-tours এর পুরো যাত্রা:</strong> আপনার my-tours লোকালে চালিয়ে,
        Browser এর Network ট্যাব খুলে একটা Request এর Timing এর স্ক্রিনশট নিন।
        localhost বলে কিছু সময় শূন্য থাকবে, সেটাই স্বাভাবিক, আর সেটাও এই লেসনের
        একটা প্রমাণ। কোন কোন ধাপ প্রায় শূন্য, আর কেন?
      </span>,
      <span key="4">
        <strong>নিজের মুখে পুরো যাত্রা (১৫ লাইন):</strong> কোনো নোট না দেখে,
        islandtours.com এ একটা বুকিং করলে শুরু থেকে শেষ পর্যন্ত কী কী ঘটে, নিজের
        ভাষায় লিখুন। প্রতিটা বড় ধাপের পাশে বন্ধনীতে লেসন নম্বর দিন। এটাই এই
        পুরো মডিউলের চূড়ান্ত পরীক্ষা।
      </span>,
    ],
    deliverables: [
      <span key="1">একটা সাইটের পাঁচটা সময়, আর ধাপ ধরে ভাগ</span>,
      <span key="2">তিনটা এরর, প্রতিটার ধাপ আর লেসন</span>,
      <span key="3">
        my-tours এর Timing স্ক্রিনশট, শূন্য ধাপের ব্যাখ্যা সহ
      </span>,
      <span key="4">নোট ছাড়া লেখা পুরো যাত্রা, লেসন নম্বর সহ, ১৫ লাইন</span>,
    ],
  },
};
