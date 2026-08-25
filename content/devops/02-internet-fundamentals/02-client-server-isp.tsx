/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  ManyClientsLab,
  WhoIsClientLab,
} from "../../../components/course/topics/internet/animations";
import {
  IspChainDiagram,
  RequestResponseDiagram,
  RolesSplitDiagram,
} from "../../../components/course/topics/internet/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const clientServerIspContent: TopicData = {
  id: "client-server-isp",
  introduction: {
    badge: "MODULE 02 · LESSON 02",
    title: <SectionTitle>দোকানে কে খদ্দের, কে দোকানদার</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি দেখেছেন Internet একটা বিশাল রাস্তার জাল, কারো
          মালিকানায় নয়। এবার আমরা রাস্তার দুই মাথায় যাঁরা দাঁড়িয়ে আছেন,
          তাঁদের দিকে তাকাব। কারণ রাস্তা যত বড়ই হোক, প্রতিটা কথা হয় ঠিক
          দুইজনের মধ্যে, আর ওই দুইজনের ভূমিকা কখনো এক নয়। একজন জিজ্ঞেস করেন,
          অন্যজন উত্তর দেন।
        </ContentParagraph>
        <ContentParagraph>
          একটা মুদির দোকানের কথা ভাবুন। আপনি দোকানে গিয়ে বললেন, এক কেজি চাল
          দিন। দোকানদার চাল মেপে দিলেন। এখানে দুইটা ভূমিকা খুব পরিষ্কার। আপনি
          খদ্দের, আপনি চাইলেন। তিনি দোকানদার, তিনি অপেক্ষায় বসে ছিলেন আর দিলেন।
          দোকানদার কখনো আপনার বাসায় গিয়ে চাল দিয়ে আসেন না, আপনাকেই যেতে হয়।
        </ContentParagraph>
        <ContentParagraph>
          Internet এর প্রতিটা কথা ঠিক এই দোকানের মতো। আর এই লেসনের সবচেয়ে বড়
          কথাটা এখনই বলে রাখি, যেটা শেষ পর্যন্ত মনে রাখবেন। খদ্দের আর দোকানদার
          হলো ভূমিকা, মানুষ নয়। ওই দোকানদারই সন্ধ্যায় অন্য দোকানে গিয়ে খদ্দের
          হন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "Client আর Server কোনো মেশিনের নাম নয়। যে আগে জিজ্ঞেস করে সে Client, যে অপেক্ষা করে আর উত্তর দেয় সে Server। একই মেশিন এক সেকেন্ডে দুইটাই হতে পারে।",
      author: "Internet Fundamentals",
      role: "Lesson 02",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "roles",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>ভূমিকা, মেশিন নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Internet এ যে জিজ্ঞেস করে, তার নাম Client। যে অপেক্ষা করে আর
                উত্তর দেয়, তার নাম Server। এই দুইটা শব্দ শুনলে অনেকের মাথায়
                দুই রকম মেশিনের ছবি আসে। Client মানে আপনার Laptop বা Phone, আর
                Server মানে কোনো Datacenter এ তাকের উপরে বসানো একটা বড় কালো
                বাক্স, যার গায়ে সবুজ বাতি জ্বলে। ছবিটা ভুল নয়, কিন্তু
                অসম্পূর্ণ, আর ওই অসম্পূর্ণতাটাই পরে অনেক গোলমাল বাধায়।
              </ContentParagraph>
              <ContentParagraph>
                আসল কথাটা হলো, Client আর Server কোনো মেশিনের ধরন নয়, একটা কথার
                মধ্যে দুইজনের ভূমিকা। দোকানে খদ্দের আর দোকানদার যেমন। একই মানুষ
                সকালে নিজের দোকানে দোকানদার, আর বিকেলে বাজারে গিয়ে খদ্দের। কেউ
                জন্ম থেকে খদ্দের নয়।
              </ContentParagraph>
              <ContentParagraph>
                আপনার Laptop টাই দেখুন। সকালে আপনি YouTube খুললেন। Laptop
                জিজ্ঞেস করল, ভিডিওটা দাও। YouTube এর মেশিন দিল। Laptop এখানে
                Client। রাতে আপনি Laptop এ node server.js চালালেন, আর একই Wi-Fi
                এ বসা বন্ধু তাঁর Phone থেকে আপনার Laptop এর ঠিকানাটা খুললেন।
                এবার বন্ধুর Phone জিজ্ঞেস করছে, আর আপনার Laptop উত্তর দিচ্ছে।
                Laptop এবার Server। মেশিন এক, তার, বসার জায়গা, সব এক। শুধু
                কথাটা উল্টো দিক থেকে শুরু হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RolesSplitDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "চেনার একটাই নিয়ম",
          content: (
            <p>
              কে আগে বলল? সেই Client। যে চুপচাপ অপেক্ষা করছিল আর ডাক পেয়ে উত্তর
              দিল, সে Server। ব্যস। মেশিনটা বড় কি ছোট, Datacenter এ কি আপনার
              টেবিলে, দাম কত, এর কোনোটাই প্রশ্ন নয়। শুধু কথাটা কে শুরু করল।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তবে হ্যাঁ, একটা কারণে ওই কালো বাক্সের ছবিটাও কিছুটা ঠিক। কিছু
              মেশিন সারাদিন শুধু Server এর ভূমিকাতেই থাকে, কখনো বন্ধ হয় না, আর
              হাজার হাজার Client কে একসাথে উত্তর দেয়। ওই মেশিনগুলোকে ছোট করে
              মানুষ Server ই বলে, আর তাতে দোষ নেই। শুধু মনে রাখুন, নামটা আসলে
              তার কাজের, তার শরীরের নয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "request-response",
      subHeader: { index: "002", title: "The Shape" },
      title: <SectionTitle>প্রতিটা কথার একটাই আকার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Internet এ যত কথা হয়, একটা ভিডিও দেখা, একটা Email পাঠানো, একটা
                Tour বুক করা, সবগুলোর আকার একই। Client একটা কথা পাঠায়, যার নাম
                Request। Server সেটা পড়ে, কাজটা করে, আর একটা কথা ফেরত পাঠায়,
                যার নাম Response। জিজ্ঞাসা আর উত্তর। এই জোড়াটাই Internet এর
                সবচেয়ে ছোট একক, যেমন Lesson 01 এ Bit ছিল কম্পিউটারের সবচেয়ে
                ছোট একক।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু কথা শুরু হওয়ার আগেও একটা জিনিস ঘটে, যেটা প্রায়ই চোখ
                এড়িয়ে যায়। দোকানদার দোকান খুলে বসে থাকেন। সাটার তুলে, বাতি
                জ্বালিয়ে, খদ্দেরের অপেক্ষায়। সাটার নামানো থাকলে আপনি হাজারবার
                ডাকলেও কিছু হবে না। Server ও ঠিক এভাবে আগে থেকে দরজা খুলে
                অপেক্ষায় থাকে, আর এই অপেক্ষায় থাকার নাম Listening। আগের মডিউলে
                আপনি দেখেছেন node server.js চালালে Process টা মরে না, সে বসে
                থাকে। এই বসে থাকাটাই Listening।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RequestResponseDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Server কখনো নিজে থেকে বলে না",
          content: (
            <p>
              এটা এমন একটা নিয়ম যেটা প্রথমে তুচ্ছ মনে হয় কিন্তু পরে বারবার
              কাজে লাগে। Server শুধু উত্তর দেয়, সে কখনো নিজে থেকে কথা শুরু করে
              না, যেমন দোকানদার আপনার বাসায় এসে চাল দিয়ে যান না। তাহলে আপনার
              Phone এ Notification আসে কীভাবে? উত্তরটা একটা চালাকি, Phone টা
              নিজেই আগে থেকে একটা দরজা খুলে রাখে, বা বারবার জিজ্ঞেস করে নতুন
              কিছু আছে কিনা। মানে Notification এর সময় আপনার Phone টাই একটু
              Server এর মতো আচরণ করে। কীভাবে, সেটা Module 06 এ। আপাতত নিয়মটা
              মনে রাখুন, Client আগে বলে, সবসময়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "who-is-client",
      subHeader: { index: "003", title: "Practice" },
      title: <SectionTitle>নিজে ঠিক করুন কে Client</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিয়মটা এক লাইনের, কিন্তু হাতে ধরে না দেখলে মাথায় বসে না। নিচে
              ছয়টা দৃশ্য। প্রতিটাতে দুইজন কথা বলছে, আর আপনাকে বলতে হবে কে আগে
              জিজ্ঞেস করল। তিন নম্বর দৃশ্যটায় থামুন, কারণ ওখানে একটা জিনিস আছে
              যেটা Backend Developer দের সারাজীবন কাজে লাগে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhoIsClientLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তিন আর চার নম্বর দৃশ্যটাই এই লেসনের আসল কথা। Island Tours এর API
              পর্যটকের Phone এর কাছে Server, কারণ Phone জিজ্ঞেস করছে। কিন্তু ওই
              একই মুহূর্তে API নিজে Database কে জিজ্ঞেস করছে, আর bKash কে
              জিজ্ঞেস করছে। ওই দুই কথায় API হলো Client। আপনি যখন Backend
              লিখবেন, আপনার কোড দিনের অর্ধেক সময় Server আর বাকি অর্ধেক সময়
              Client। একই ফাইলে, একই Function এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "many-clients",
      subHeader: { index: "004", title: "One To Many" },
      title: <SectionTitle>এক দোকানদার, হাজার খদ্দের</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দোকানের উদাহরণে একটা জিনিস এখনো বলা হয়নি। দোকানে একজন দোকানদার,
                কিন্তু খদ্দের অনেক। ঈদের আগের দিন বিকেলে দোকানে ঢুকলে আপনি একা
                নন, আপনার সামনে দশজন দাঁড়িয়ে। দোকানদারের হাত দুইটাই, তাই লাইন
                পড়ে, আর আপনি দাঁড়িয়ে থাকেন।
              </ContentParagraph>
              <ContentParagraph>
                Server এর জীবন ঠিক এমন। একটা Server, আর হাজার Client, সবাই
                একসাথে জিজ্ঞেস করছে। এই কারণেই Server আর Client এর কাজ একরকম
                নয়, যদিও দুইটাই ভূমিকা। Client একজন, তার একটা প্রশ্ন। Server কে
                একই সময়ে হাজারজনের কথা শুনতে হয়। নিচে খদ্দের বাড়িয়ে দেখুন
                শেষজন কতক্ষণ দাঁড়ান।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ManyClientsLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এখান থেকেই বাকি কোর্সের অর্ধেক জন্ম নেয়",
          content: (
            <p>
              শেষজনের অপেক্ষা যখন কয়েক সেকেন্ডে পৌঁছায়, মানুষ চলে যান। তাই
              Server নিয়ে যত কথা হয়, তার বড় অংশ আসলে এই একটা প্রশ্ন, লাইনটা
              ছোট রাখা যায় কীভাবে? একটার বদলে দশটা Server বসানো (Module 13),
              একবার বানানো উত্তর জমিয়ে রাখা (Module 14), কাজ ভাগ করে দেওয়া
              (Module 08)। এগুলো সব এই দোকানের লাইনটা ছোট করার কৌশল। আপাতত শুধু
              ছবিটা মনে রাখুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "isp",
      subHeader: { index: "005", title: "ISP" },
      title: <SectionTitle>মাঝখানে যে কেউই নয়, শুধু রাস্তা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দোকানে যেতে আপনাকে রাস্তা লাগে। আপনি রাস্তা বানান না, রাস্তার
                মালিকও নন, শুধু ব্যবহার করেন। Internet এ এই রাস্তাটা আপনাকে
                ভাড়া দেয় একটা কোম্পানি, যার নাম ISP, Internet Service
                Provider। Link3, Amber IT, Grameenphone, Robi, এরা সবাই ISP।
                আপনি মাসে টাকা দেন, তারা আপনার বাসার Router কে দুনিয়ার বাকি
                অংশের সাথে জোড়া লাগিয়ে রাখে।
              </ContentParagraph>
              <ContentParagraph>
                ISP ঠিক তিনটা কাজ করে, আর তিনটাই আগের লেসনে আপনি একটু করে
                দেখেছেন। প্রথমত, তারা আপনাকে একটা ঠিকানা দেয়, সেই বাইরের
                ঠিকানাটা যেটা curl ifconfig.me তে দেখেছিলেন। ঠিকানা ছাড়া আপনার
                Request এর উত্তর ফেরত আসার জায়গা থাকত না। দ্বিতীয়ত, তারা আপনার
                Byte গুলো বয়ে নিয়ে যায় তাদের নিজেদের তারে, আপনার এলাকা থেকে
                শহরের কেন্দ্র পর্যন্ত। তৃতীয়ত, আর এটাই আসল, তারা নিজেরা অন্য
                ISP এর সাথে জোড়া লাগে, যাতে আপনার Byte তাদের সীমানা পেরিয়ে
                যেতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                এই তৃতীয় কাজটার একটা সিঁড়ি আছে। আপনার এলাকার ISP ছোট, তার তার
                শুধু শহরে। সে আবার একটা বড় কোম্পানির কাছ থেকে রাস্তা ভাড়া
                নেয়, যার তার সারা দেশে আর দেশের বাইরে। Bangladesh এ এই বড়
                কোম্পানিগুলোকে বলে IIG, International Internet Gateway, মানে
                দেশের গেট। আর IIG সমুদ্রের নিচের তারের ভাড়া দেয়। ঠিক যেমন
                আপনার গলি শহরের রাস্তায় ওঠে, শহরের রাস্তা হাইওয়েতে ওঠে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <IspChainDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "ISP Client ও নয়, Server ও নয়",
          content: (
            <p>
              উপরের ছবিতে মাঝের ছয়জনের কেউ কথাটা বলছে না, কেউ উত্তরও দিচ্ছে না।
              তারা শুধু বয়ে নিয়ে যাচ্ছে, যেমন Post Office এর গাড়ি আপনার চিঠি
              বয়ে নিয়ে যায় কিন্তু চিঠির উত্তর দেয় না। তবে একটা কথা এখনই বলে
              রাখি। Post Office এর লোক খামের উপরের ঠিকানা দেখেন, খামের ওজন
              জানেন, কখন পাঠালেন জানেন। ভেতরে কী লেখা, সেটা জানেন কিনা, নির্ভর
              করে খামটা আঠা দিয়ে বন্ধ কিনা। Internet এ এই আঠার নাম HTTPS, আর
              সেটা Module 06 এর গল্প। আপাতত জানুন, আপনার ISP আপনার প্রতিটা
              Request এর খাম দেখে, ভেতরটা নয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "project",
      subHeader: { index: "006", title: "Project Example" },
      title: <SectionTitle>Island Tours এ কে কখন কোন ভূমিকায়</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা বুকিং এর সময় Island Tours এ অন্তত চারটা কথা হয়, আর
                চারটাতেই ভূমিকা বদলায়। একটা বুকিং ধরে ধরে দেখুন কে কখন Client
                আর কে Server।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পর্যটকের Phone আর API:</strong> Phone বলে, Tour ৭ এ
                  দুইটা Seat দাও। API উত্তর দেয়। Phone হলো Client, API হলো
                  Server। এই কথাটার রাস্তা GP থেকে সমুদ্রের নিচ দিয়ে Singapore,
                  পুরোটা আগের লেসনের ছবি।
                </ListItem>
                <ListItem>
                  <strong>API আর Database:</strong> উত্তর দিতে API কে জানতে হবে
                  Seat আছে কিনা। সে PostgreSQL কে জিজ্ঞেস করে। এবার API হলো
                  Client, Database হলো Server। এই দুইজন একই Datacenter এ, তাই এই
                  কথাটার রাস্তা কয়েক মিটার তার।
                </ListItem>
                <ListItem>
                  <strong>API আর bKash:</strong> Seat আছে, এবার টাকা। API bKash
                  এর সার্ভারকে বলে, এই টাকাটা কাটো। API আবার Client, bKash
                  Server। এই কথাটা Singapore থেকে আবার Bangladesh এ ফিরে আসে,
                  কারণ bKash এর সার্ভার Dhaka তে।
                </ListItem>
                <ListItem>
                  <strong>API আর Email এর সার্ভার:</strong> সব শেষে পর্যটককে
                  একটা Confirmation Email। API একটা Email সার্ভিসকে বলে, এই
                  চিঠিটা পাঠাও। আবার Client। এক বুকিংয়ে API তিনবার Client হলো,
                  একবার Server।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই কারণেই Backend এ Timeout শব্দটা এত শোনা যায়",
          content: (
            <p>
              API যখন bKash এর Client, তখন সে bKash এর উত্তরের অপেক্ষায় বসে
              থাকে, ঠিক যেমন পর্যটকের Phone তার উত্তরের অপেক্ষায়। bKash যদি দশ
              সেকেন্ড দেরি করে, পর্যটকও দশ সেকেন্ড দাঁড়িয়ে থাকেন, কারণ লাইনটা
              জোড়া। তাই Backend এ প্রতিটা বাইরের ডাকে একটা সীমা বেঁধে দেওয়া
              হয়, এত সেকেন্ডে উত্তর না এলে হাল ছাড়ো। এই সীমার নাম Timeout, আর
              সেটা Client এর হাতিয়ার, Server এর নয়। আপনার API যতবার Client
              হয়, ততবার একটা Timeout লাগে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "request-flow",
      subHeader: { index: "007", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Request এর পূর্ণ চক্র</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটক Tour এর তালিকা খুললেন। এই একটা কথায় কী কী ঘটে, ভূমিকা ধরে
              ধরে। প্রতিটা ধাপে কে Client আর কে Server, সেটা খেয়াল করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Server আগে থেকেই দরজা খুলে বসা",
              description:
                "Singapore এ node dist/main.js কয়েক দিন আগে চালু হয়েছে, আর তখন থেকে Listening। কেউ না ডাকলে সে কিছুই করে না, শুধু অপেক্ষা করে।",
            },
            {
              title: "Client কথা শুরু করল",
              description:
                "পর্যটক App এ চাপ দিলেন। Phone একটা Request বানাল, Tour এর তালিকা দাও, আর উপরে সার্ভারের ঠিকানা লিখে ছেড়ে দিল। Phone এখানে Client।",
            },
            {
              title: "রাস্তা বয়ে নিয়ে গেল",
              description:
                "GP, IIG, সমুদ্রের তার, Singtel, Datacenter। কেউ Request টা পড়ল না, কেউ উত্তরও দিল না। শুধু খামের ঠিকানা দেখে পরের জনের হাতে দিল।",
            },
            {
              title: "Server নিজেই Client হলো",
              description:
                "API Request পেল, কিন্তু তালিকা তার হাতে নেই। সে PostgreSQL কে জিজ্ঞেস করল, Tour গুলো দাও। এই কথায় API হলো Client, Database হলো Server।",
            },
            {
              title: "Database উত্তর দিল, API আবার Server",
              description:
                "PostgreSQL বারোটা Tour ফেরত দিল। API সেগুলো সাজিয়ে একটা Response বানাল। Database এর সাথে কথা শেষ, এবার API আবার পর্যটকের Server।",
            },
            {
              title: "Response ফিরল, একই রাস্তা উল্টো দিকে",
              description:
                "Response এর খামে এবার পর্যটকের Phone এর ঠিকানা। Datacenter, Singtel, সমুদ্রের তার, IIG, GP, Phone। পর্যটক তালিকা দেখলেন। একটা কথা শেষ, Server আবার অপেক্ষায়।",
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
                <strong>Code.org, How the Internet Works</strong>, সিরিজের
                Packets, Routing and Reliability পর্বটা এই লেসনের ISP অংশটা
                ছবিতে দেখায়।{" "}
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
                <strong>Computerphile</strong>, Search করুন: Client Server
                Model, আর What is an ISP.{" "}
                <a
                  href="https://www.youtube.com/@Computerphile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  youtube.com/@Computerphile
                </a>
              </ListItem>
              <ListItem>
                <strong>BTRC এর ISP তালিকা</strong>, Bangladesh এ লাইসেন্স
                পাওয়া সব ISP আর IIG এর নাম। আপনার ISP টা কোন সারিতে, খুঁজে
                দেখুন।{" "}
                <a
                  href="http://www.btrc.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  btrc.gov.bd
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
                Client আর Server ভূমিকা, মেশিন নয়। যে আগে জিজ্ঞেস করে সে
                Client, যে অপেক্ষা করে আর উত্তর দেয় সে Server।
              </ListItem>
              <ListItem>
                একই মেশিন একই সেকেন্ডে দুইটাই হতে পারে। Island Tours এর API
                পর্যটকের Server, আর Database আর bKash এর Client।
              </ListItem>
              <ListItem>
                প্রতিটা কথার আকার একটাই, Request যায়, Response ফেরে। Server আগে
                থেকে দরজা খুলে অপেক্ষায় থাকে, সেটাই Listening।
              </ListItem>
              <ListItem>
                Server কখনো নিজে থেকে কথা শুরু করে না। Client সবসময় আগে বলে।
                Notification এর জন্য Phone টাই একটু Server এর মতো আচরণ করে।
              </ListItem>
              <ListItem>
                এক Server, হাজার Client। লাইন পড়ে, শেষজন অপেক্ষা করেন। লাইন ছোট
                রাখাই পরের অনেক মডিউলের বিষয়।
              </ListItem>
              <ListItem>
                ISP আপনাকে রাস্তা ভাড়া দেয়, তিনটা কাজ করে: ঠিকানা দেয়, Byte
                বয়ে নেয়, আর অন্য ISP এর সাথে জোড়া লাগে। ছোট ISP বড় ISP এর
                কাছে ভাড়া নেয়, Bangladesh এ বড়গুলোর নাম IIG।
              </ListItem>
              <ListItem>
                ISP Client ও নয়, Server ও নয়। তারা খাম দেখে, ভেতরটা নয়, যদি
                খামটা HTTPS দিয়ে বন্ধ থাকে।
              </ListItem>
              <ListItem>
                আপনার Backend যতবার Client হয়, ততবার একটা Timeout লাগে, নাহলে
                অন্যের দেরি আপনার ইউজারের দেরি হয়ে যায়।
              </ListItem>
              <ListItem>
                পরের লেসন: আপনার মেশিনের ভেতরে এই কথাগুলো ঢোকে আর বেরোয় কোন
                দরজা দিয়ে। Socket আর Port।
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
        <span className="font-bold text-primary">Client</span>,
        "যে কথা শুরু করে, যে আগে জিজ্ঞেস করে",
      ],
      [
        <span className="font-bold text-primary">Server</span>,
        "যে দরজা খুলে অপেক্ষা করে আর উত্তর দেয়",
      ],
      [
        <span className="font-bold text-primary">Request</span>,
        "Client এর পাঠানো কথা, প্রশ্নটা",
      ],
      [
        <span className="font-bold text-primary">Response</span>,
        "Server এর ফেরত পাঠানো কথা, উত্তরটা",
      ],
      [
        <span className="font-bold text-primary">Listening</span>,
        "সাটার তুলে খদ্দেরের অপেক্ষায় বসে থাকা",
      ],
      [
        <span className="font-bold text-primary">ISP</span>,
        "যে কোম্পানি আপনাকে রাস্তা ভাড়া দেয়",
      ],
      [
        <span className="font-bold text-primary">IIG</span>,
        "Bangladesh এর বড় ISP, দেশের গেট, সমুদ্রের তার পর্যন্ত",
      ],
      [
        <span className="font-bold text-primary">Peer to Peer</span>,
        "দুইজনই দুইজনকে জিজ্ঞেস করে, Video Call এর মতো",
      ],
      [
        <span className="font-bold text-primary">Timeout</span>,
        "Client এর ধৈর্যের সীমা, এত সেকেন্ডে উত্তর না এলে হাল ছাড়ো",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Island Tours এর API Database কে জিজ্ঞেস করছে Seat আছে কিনা। এই কথায় API কী?",
        options: [
          {
            key: "A",
            text: "Server, কারণ API সবসময় Server",
            isCorrect: false,
            explanation:
              "সবসময় বলে কিছু নেই। এই কথায় API আগে জিজ্ঞেস করছে, আর Database অপেক্ষায় ছিল। যে আগে জিজ্ঞেস করে সে Client।",
          },
          {
            key: "B",
            text: "Client, কারণ এই কথাটা API শুরু করেছে",
            isCorrect: true,
            explanation:
              "ঠিক। এক মুহূর্ত আগে পর্যটকের কাছে সে Server ছিল, এখন Database এর কাছে Client। ভূমিকা কথা ধরে বদলায়।",
          },
          {
            key: "C",
            text: "দুইটাই না, API মাঝখানের ISP এর মতো",
            isCorrect: false,
            explanation:
              "ISP কথা বলে না, বয়ে নেয়। API নিজে প্রশ্ন করছে, তাই সে কথার একজন পক্ষ, রাস্তা নয়।",
          },
        ],
      },
      {
        id: 2,
        text: "আপনার Laptop এ node server.js চলছে। এটা কি এখন Server?",
        options: [
          {
            key: "A",
            text: "না, Laptop কখনো Server হতে পারে না, Server মানে Datacenter এর মেশিন",
            isCorrect: false,
            explanation:
              "Server কোনো মেশিনের ধরন নয়। যে অপেক্ষা করে আর উত্তর দেয়, সে Server, টেবিলের Laptop হলেও।",
          },
          {
            key: "B",
            text: "হ্যাঁ, সে Listening করছে, কেউ জিজ্ঞেস করলে উত্তর দেবে",
            isCorrect: true,
            explanation:
              "একই Wi-Fi এ বন্ধুর Phone জিজ্ঞেস করলে আপনার Laptop উত্তর দেবে। ওই কথায় Laptop টা Server।",
          },
          {
            key: "C",
            text: "শুধু তখনই, যদি Public ঠিকানা থাকে",
            isCorrect: false,
            explanation:
              "Public ঠিকানা ঠিক করে দুনিয়ার কে পৌঁছাতে পারবে, ভূমিকা ঠিক করে না। বাসার ভেতরের Phone এর কাছে সে এখনই Server।",
          },
        ],
      },
      {
        id: 3,
        text: "Server কি কখনো নিজে থেকে Client কে কিছু বলে?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, Notification তো Server ই পাঠায়",
            isCorrect: false,
            explanation:
              "Notification এর সময় Phone টা আগে থেকে একটা দরজা খুলে রাখে, বা বারবার জিজ্ঞেস করে। মানে Phone ই কথা শুরু করে রাখে। Module 06 এ বিস্তারিত।",
          },
          {
            key: "B",
            text: "না, Server শুধু উত্তর দেয়, Client সবসময় আগে বলে",
            isCorrect: true,
            explanation:
              "দোকানদার আপনার বাসায় চাল দিয়ে যান না। এই নিয়মটা পরে অনেক জায়গায় কাজে লাগবে।",
          },
          {
            key: "C",
            text: "হ্যাঁ, যদি Server বড় হয়",
            isCorrect: false,
          },
        ],
      },
      {
        id: 4,
        text: "আপনার ISP আপনার Request নিয়ে ঠিক কী করে?",
        options: [
          {
            key: "A",
            text: "পড়ে, বোঝে, আর উত্তর দেয়",
            isCorrect: false,
            explanation:
              "উত্তর দেয় Server, ISP নয়। ISP শুধু বয়ে নেয়, যেমন Post Office এর গাড়ি চিঠির উত্তর দেয় না।",
          },
          {
            key: "B",
            text: "খামের ঠিকানা দেখে পরের রাস্তায় তুলে দেয়, ভেতরটা পড়ার দরকার হয় না",
            isCorrect: true,
            explanation:
              "ISP Client ও নয়, Server ও নয়, রাস্তা। খামের ভেতরটা পড়তে পারে কিনা, সেটা HTTPS এর উপর, Module 06 এ।",
          },
          {
            key: "C",
            text: "Request টা জমিয়ে রাখে, পরে একসাথে পাঠায়",
            isCorrect: false,
          },
        ],
      },
      {
        id: 5,
        text: "একটা Server এ ১০০ মিলিসেকেন্ডে একজনের উত্তর হয়। ৩০ জন একসাথে এলে শেষজন কতক্ষণ দাঁড়ান?",
        options: [
          {
            key: "A",
            text: "১০০ মিলিসেকেন্ড, Server তো একসাথে সবাইকে দেয়",
            isCorrect: false,
            explanation:
              "একটা দোকানদারের হাত দুইটাই। তিরিশজন এলে লাইন পড়ে, আর শেষজন সবার পরে পান।",
          },
          {
            key: "B",
            text: "প্রায় ৩ সেকেন্ড, কারণ ২৯ জনের পরে তাঁর পালা",
            isCorrect: true,
            explanation:
              "৩০ গুণ ১০০ মিলিসেকেন্ড। এই ৩ সেকেন্ডেই মানুষ চলে যান, আর এখান থেকেই Module 13 এর সব কৌশল জন্ম নেয়।",
          },
          {
            key: "C",
            text: "নির্ভর করে তাঁর Internet এর গতির উপর",
            isCorrect: false,
            explanation:
              "তাঁর রাস্তা যত দ্রুতই হোক, দোকানদার ব্যস্ত থাকলে লাইনে দাঁড়াতেই হয়। এই অপেক্ষাটা রাস্তার নয়, দোকানের।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "একবার Client হোন, একবার Server",
    subtitle: "Terminal এ পাঁচটা পরীক্ষা, দুইটা Terminal লাগবে",
    stepName: "LAB",
    steps: [
      {
        title: "Client হয়ে একটা কথা বলুন",
        description:
          "curl দিয়ে একটা সাইটকে Request পাঠান আর পুরো কথাটা দেখুন, আপনি কী পাঠালেন আর কী ফেরত এলো।",
      },
      {
        title: "Server হয়ে দরজা খুলুন",
        description:
          "এক লাইনে একটা Server চালান। সে Listening করবে, আর আপনি নিজেই অন্য Terminal থেকে তার Client হবেন।",
      },
      {
        title: "Phone কে আপনার Laptop এর Client বানান",
        description:
          "একই Wi-Fi এ বসা Phone থেকে আপনার Laptop এর সার্ভার খুলুন। এবার Mobile Data চালু করে আবার চেষ্টা করুন, আর দেখুন কী হয়।",
      },
      {
        title: "আপনার ISP কে, জেনে নিন",
        description:
          "আপনার বাইরের ঠিকানাটা কোন কোম্পানির, এক কমান্ডে দেখুন। তারপর traceroute এর প্রথম কয়েকটা লাইনে সেই কোম্পানির নাম খুঁজুন।",
      },
      {
        title: "অনেক Client একসাথে",
        description:
          "আপনার ছোট Server টাকে বিশজন Client একসাথে ডাকুন, আর Server এর Terminal এ লাইন পড়তে দেখুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-be-a-client.sh",
        language: "bash",
        code: `# -v মানে verbose, পুরো কথাটা দেখাও
curl -v https://example.com 2>&1 | head -30

# > দিয়ে শুরু লাইনগুলো আপনি পাঠিয়েছেন, এটা Request
#   > GET / HTTP/2
#   > Host: example.com
#
# < দিয়ে শুরু লাইনগুলো ফেরত এসেছে, এটা Response
#   < HTTP/2 200
#   < content-type: text/html
#
# আপনি আগে বললেন, তারা উত্তর দিল। এই কথায় আপনি Client।
# লাইনগুলোর মানে Module 06 এ। আপাতত শুধু দিকটা দেখুন, > আর <।`,
      },
      {
        filename: "2-be-a-server.sh",
        language: "bash",
        code: `# Terminal 1: এক লাইনে একটা Server, দরজা খুলে বসে থাকবে
node -e "
require('http').createServer((req, res) => {
  console.log('একজন এলো:', req.socket.remoteAddress, req.url);
  res.end('Island Tours এর Laptop Server থেকে হ্যালো\\n');
}).listen(8000, () => console.log('Listening... দরজা খোলা, অপেক্ষায়'));
"
# খেয়াল করুন, Terminal টা ফেরত আসে না। Process বসে আছে। এটাই Listening।

# Terminal 2: এবার আপনিই তার Client
curl localhost:8000

# Terminal 1 এ দেখুন, "একজন এলো" লেখা উঠেছে।
# একই Laptop, একই সেকেন্ডে Server (Terminal 1) আর Client (Terminal 2)।`,
      },
      {
        filename: "3-phone-as-client.sh",
        language: "bash",
        code: `# Terminal 1 এর Server চলতে থাকুক। আপনার Laptop এর বাসার ভেতরের ঠিকানা বের করুন:
ipconfig getifaddr en0          # macOS, Wi-Fi
hostname -I | awk '{print $1}'  # Linux
# 192.168.0.12 এর মতো একটা সংখ্যা পাবেন

# এবার Phone এ, একই Wi-Fi এ থেকে, Browser এ লিখুন:
#   http://192.168.0.12:8000        ← আপনার সংখ্যাটা বসান
# হ্যালো লেখাটা দেখবেন। Terminal 1 এ Phone এর ঠিকানা উঠবে।
# Phone এবার Client, আপনার Laptop Server। আগের লেসনের বন্ধুর গল্পটা এখন সত্যি।

# এবার Phone এর Wi-Fi বন্ধ করে Mobile Data চালু করুন, আবার খুলুন।
# খুলবে না। কারণ 192.168 দিয়ে শুরু ঠিকানাটা শুধু বাসার ভেতরে কাজ করে।
# ভেতরের ঠিকানা আর বাইরের ঠিকানার এই তফাত Module 03 এ। আপাতত শুধু দেখে রাখুন।`,
      },
      {
        filename: "4-who-is-my-isp.sh",
        language: "bash",
        code: `# আপনার বাইরের ঠিকানা কোন কোম্পানির
curl ipinfo.io
# "org" লাইনে আপনার ISP এর নাম, যেমন "AS24389 Grameenphone Ltd."
# AS এর পরের সংখ্যাটা ওই ISP এর নিজের নম্বর, Internet এ প্রতিটা বড় Network এর একটা থাকে

# এবার traceroute এর প্রথম কয়েকটা লাইন
traceroute -m 6 8.8.8.8
# ১ নম্বর: আপনার Router, 192.168 দিয়ে শুরু
# ২ থেকে ৪: আপনার ISP এর মেশিন, নামে হয়তো ISP এর নাম দেখবেন
# তারপর: IIG বা বিদেশি কোম্পানি
# আপনার Byte হাত বদলাচ্ছে, ছোট ISP থেকে বড় ISP তে। সিঁড়ির ছবিটা এখানে।`,
      },
      {
        filename: "5-many-clients.sh",
        language: "bash",
        code: `# Terminal 1 এর Server চলতে থাকুক। Terminal 2 এ বিশজন Client একসাথে:
for i in $(seq 1 20); do
  curl -s localhost:8000 > /dev/null &
done
wait
echo "বিশজনই উত্তর পেয়েছেন"

# Terminal 1 এ তাকান। বিশটা "একজন এলো" লাইন, এক সেকেন্ডের কম সময়ে।
# একটা Server, বিশটা Client। এখন এটা সহজ, কারণ কাজটা ছোট।

# কাজটা ভারী হলে কী হয়, সেটা আগের মডিউলের Blocking Server পরীক্ষাটায় দেখেছেন।
# আর লাইন ছোট রাখার কৌশল, সেটা Module 13।`,
      },
    ],
    tip: "তিন নম্বর পরীক্ষাটা সবচেয়ে বেশি শেখায়, কারণ এখানে আপনার Laptop সত্যিই একটা Server, আর আপনার হাতের Phone সত্যিই তার Client। Datacenter, কালো বাক্স, সবুজ বাতি, কিছুই লাগেনি। শুধু একটা Process দরজা খুলে বসেছে, আর একজন এসে জিজ্ঞেস করেছে। Server মানে এইটুকুই।",
  },
  assignment: {
    title: "Mini Project: my-tours কে Phone থেকে খুলুন",
    time: "১ - ২ ঘণ্টা",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>my-tours কে Server বানান:</strong> আপনার my-tours সার্ভার Laptop
        এ চালান, তারপর একই Wi-Fi এ বসা Phone থেকে Laptop এর ভেতরের ঠিকানা দিয়ে
        Tour এর তালিকাটা খুলুন। Phone এর স্ক্রিনশট আর Laptop এর Terminal এ
        Request এর লাইন, দুইটাই রাখুন।
      </span>,
      <span key="2">
        <strong>ভূমিকার তালিকা:</strong> my-tours এ একটা বুকিং হলে কয়টা কথা
        হয়, লিখুন। প্রতিটা কথায় কে Client আর কে Server, পাশে লিখুন। Database
        কে ধরুন, আর যদি Email পাঠান সেটাও।
      </span>,
      <span key="3">
        <strong>আপনার ISP এর সিঁড়ি:</strong> Lab এর চার নম্বর কমান্ড চালিয়ে
        আপনার ISP এর নাম আর AS নম্বর লিখুন। তারপর traceroute এর লাইনগুলোতে কোন
        লাইন থেকে আপনার ISP এর নাম বদলে অন্য কোম্পানির নাম আসছে, সেটা চিহ্নিত
        করুন। ওটাই হাত বদলের জায়গা।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু বললেন, আমার
        Laptop তো Server নয়, Server তো Datacenter এ থাকে। তাঁকে বোঝান কেন কথাটা
        অর্ধেক ঠিক আর অর্ধেক ভুল। দোকানের উদাহরণ ব্যবহার করতে পারেন।
      </span>,
    ],
    deliverables: [
      <span key="1">
        Phone থেকে খোলা my-tours এর স্ক্রিনশট আর Terminal এর লাইন
      </span>,
      <span key="2">একটা বুকিংয়ের সব কথার ভূমিকা সহ তালিকা</span>,
      <span key="3">ISP এর নাম, AS নম্বর, আর হাত বদলের লাইন নম্বর</span>,
      <span key="4">Laptop কি Server, ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
