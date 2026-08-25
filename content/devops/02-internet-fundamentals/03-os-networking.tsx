/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  ManyTabsLab,
  PortTableLab,
} from "../../../components/course/topics/os-networking/animations";
import {
  BuildingDiagram,
  LoopbackSplitDiagram,
  NetworkStackDiagram,
} from "../../../components/course/topics/os-networking/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const osNetworkingContent: TopicData = {
  id: "os-networking",
  introduction: {
    badge: "MODULE 02 · LESSON 03",
    title: <SectionTitle>এক বিল্ডিং, ছয়টা দরজা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের দুই লেসনে চিঠিটা বিল্ডিং পর্যন্ত পৌঁছেছে। আপনার মেশিনের একটা
          ঠিকানা আছে, Server এর একটা ঠিকানা আছে, আর মাঝখানের রাস্তা খামের ঠিকানা
          দেখে চিঠিটা ঠিক বিল্ডিংয়ে পৌঁছে দেয়। এবার একটা প্রশ্ন, যেটা আগের
          লেসনে চুপচাপ পাশ কাটিয়ে গেছি। বিল্ডিংয়ে পৌঁছানোর পর চিঠিটা যায়
          কোথায়?
        </ContentParagraph>
        <ContentParagraph>
          কারণ একটা মেশিনে একটা Program চলে না, অনেকগুলো চলে। Module 01 এ আপনি
          দেখেছেন Kernel একই সময়ে ডজন ডজন Process চালায়। Island Tours এর
          সার্ভারে একই মুহূর্তে চলছে nginx, node, postgres, redis, আর sshd।
          মেশিনের ঠিকানা একটাই। তাহলে একটা চিঠি এসে ঠিক node এর হাতেই পড়ে
          কীভাবে, postgres এর হাতে নয়?
        </ContentParagraph>
        <ContentParagraph>
          উত্তরটা একটা ফ্ল্যাট বাড়ির মতো। একটা বিল্ডিংয়ের ঠিকানা একটাই, কিন্তু
          ভেতরে বিশটা ফ্ল্যাট, আর প্রতিটা ফ্ল্যাটের একটা নম্বর। চিঠিতে
          বিল্ডিংয়ের ঠিকানার পাশে ফ্ল্যাটের নম্বরও লেখা থাকে, আর গেটের
          ম্যানেজার সেই নম্বর দেখে ঠিক দরজায় পৌঁছে দেন। এই লেসন পুরোটা ওই
          ম্যানেজারের গল্প, আর ম্যানেজারটা আপনার পুরনো পরিচিত, Kernel।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ঠিকানা বলে কোন মেশিন। Port বলে ওই মেশিনের কোন Program। দুইটা ছাড়া চিঠি গেটেই পড়ে থাকে।",
      author: "Internet Fundamentals",
      role: "Lesson 03",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "port",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Port মানে ফ্ল্যাটের নম্বর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনার মেশিনে যে Program টা বাইরের কথা শুনতে চায়, সে Kernel কে
                বলে, আমাকে একটা ফ্ল্যাট দাও, আর ওই ফ্ল্যাটে যা চিঠি আসবে সব আমার
                হাতে দিও। ফ্ল্যাটের নম্বরটার নাম Port, আর এটা শুধু একটা সংখ্যা,
                ০ থেকে ৬৫৫৩৫ এর মধ্যে। node server.js এ আপনি যখন লেখেন
                listen(3000), আপনি ঠিক এই কথাটাই বলছেন, ফ্ল্যাট 3000 আমার।
              </ContentParagraph>
              <ContentParagraph>
                এখন খামের উপরে দুইটা জিনিস লেখা থাকে। বিল্ডিংয়ের ঠিকানা, মানে
                IP Address, যেটা বলে কোন মেশিন। আর ফ্ল্যাটের নম্বর, মানে Port,
                যেটা বলে ওই মেশিনের কোন Program। দুইটা একসাথে লেখার একটা চেনা
                ধরন আছে যেটা আপনি হাজারবার দেখেছেন কিন্তু হয়তো ভেঙে পড়েননি,
                localhost:3000। কোলনের আগে বিল্ডিং, কোলনের পরে ফ্ল্যাট।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <BuildingDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কিছু ফ্ল্যাটের নম্বর সবাই আগে থেকে জানে, ঠিক যেমন প্রতিটা হোটেলে
                রিসেপশন নিচতলায়। আপনি Browser এ যখন একটা সাইটের নাম লেখেন, কোনো
                Port লেখেন না, তবু কাজ হয়। কারণ Browser জানে Web এর ফ্ল্যাট
                443, আর সে নিজেই লিখে নেয়। এই আগে থেকে ঠিক করা নম্বরগুলোকে বলে
                Well Known Port, আর কয়েকটা আপনার মুখস্থ হয়ে যাবে এমনিতেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Port", "কে বসে", "সহজ কথায়"],
          rows: [
            [
              <span className="font-mono font-bold text-primary">22</span>,
              "SSH",
              "Terminal থেকে সার্ভারে ঢোকার দরজা",
            ],
            [
              <span className="font-mono font-bold text-primary">80</span>,
              "HTTP",
              "Web, খোলা খাম",
            ],
            [
              <span className="font-mono font-bold text-primary">443</span>,
              "HTTPS",
              "Web, বন্ধ খাম, আজকের সব সাইট",
            ],
            [
              <span className="font-mono font-bold text-primary">5432</span>,
              "PostgreSQL",
              "Database, বাইরে থেকে বন্ধ থাকা উচিত",
            ],
            [
              <span className="font-mono font-bold text-primary">3306</span>,
              "MySQL",
              "Database, একই কথা",
            ],
            [
              <span className="font-mono font-bold text-primary">6379</span>,
              "Redis",
              "Cache, একই কথা",
            ],
            [
              <span className="font-mono font-bold text-primary">
                3000, 8080
              </span>,
              "আপনার Dev Server",
              "কোনো নিয়ম নেই, শুধু অভ্যাস",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "১০২৪ এর নিচের ফ্ল্যাটগুলো বিশেষ",
          content: (
            <p>
              ০ থেকে ১০২৩ পর্যন্ত ফ্ল্যাটগুলো Kernel সাধারণ ইউজারকে দেয় না,
              শুধু root কে দেয়। তাই আপনার Laptop এ listen(80) লিখলে একটা এরর
              পাবেন, EACCES, permission denied। এই কারণেই Dev Server গুলো 3000
              বা 8080 এ চলে, ওগুলো ১০২৪ এর উপরে, সবার জন্য খোলা। আর এই কারণেই
              Production এ node সরাসরি 80 এ বসে না, সামনে nginx বসে, যেটা Module
              11 এর গল্প।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "socket",
      subHeader: { index: "002", title: "Socket" },
      title: <SectionTitle>Socket মানে হাতে ধরা টেলিফোন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 01 এর Lesson 07 এ একটা কথা ছিল যেটা এখানে ফিরে আসে। আপনার
                Program নিজে Network Card ছুঁতে পারে না। Card টা সবার ভাগের
                সম্পত্তি, তাই তার চাবি Kernel এর কাছে। Program কে Kernel এর
                দরজায় কড়া নাড়তে হয়, মানে Syscall করতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে Program কথা বলে কীভাবে? Kernel তাকে একটা জিনিস হাতে দেয়,
                যেটা দিয়ে সে কথা বলতে আর শুনতে পারে, আর ওই জিনিসটার নাম Socket।
                ফ্ল্যাটের ইন্টারকমের হ্যান্ডসেটটার মতো। হ্যান্ডসেটটা আপনার হাতে,
                কিন্তু তারটা গেটের ম্যানেজারের বোর্ডে গিয়ে লেগেছে। আপনি
                হ্যান্ডসেটে বলেন, ম্যানেজার শোনেন আর বাইরে পাঠান। বাইরে থেকে
                কিছু এলে ম্যানেজার আপনার হ্যান্ডসেটে বাজিয়ে দেন।
              </ContentParagraph>
              <ContentParagraph>
                Server এর দিকে ঘটনাটা তিন ধাপে হয়, আর তিনটাই Syscall। প্রথমে
                Program বলে, একটা হ্যান্ডসেট দাও, এটা socket()। তারপর বলে, এই
                হ্যান্ডসেটটা ফ্ল্যাট 3000 এর সাথে জোড়ো, এটা bind()। শেষে বলে,
                এবার আমি অপেক্ষায় বসলাম, যা আসে দিও, এটা listen()। Node এ আপনি
                এই তিনটাকে একসাথে দেখেন, একটা লাইনে, server.listen(3000)। ভেতরে
                কিন্তু Kernel এর সাথে তিনবার কথা হয়।
              </ContentParagraph>
              <ContentParagraph>
                listen() এর পরে Kernel তার খাতায় একটা লাইন লেখে। ফ্ল্যাট 3000,
                PID 4821। এরপর 3000 এ যা আসে, Kernel খাতা দেখে ঠিক ওই Process এর
                হ্যান্ডসেটে বাজিয়ে দেয়। আগের লেসনে যে Listening শব্দটা
                শিখেছেন, সাটার তুলে বসে থাকা, সেটা ভেতরে আসলে এই একটা লাইন,
                খাতায় লেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক ফ্ল্যাটে দুইজন বসে না",
          content: (
            <p>
              খাতায় ফ্ল্যাট 3000 এর পাশে একজনের নাম থাকতে পারে, দুইজনের না।
              দ্বিতীয় কেউ listen(3000) বললে Kernel না বলে দেয়, আর Node আপনাকে
              দেখায়, EADDRINUSE, address already in use। এই এররটা আপনি নিশ্চিত
              একদিন পাবেন, আর প্রায় সবসময় কারণ একটাই। আগের Process টা মরেনি,
              হয়তো অন্য একটা Terminal এ এখনো বসে আছে। সমাধান Kernel এর খাতা
              দেখা, কে বসে আছে 3000 এ, তারপর তাকে বের করা। নিচের Lab এ কমান্ডটা
              আছে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              খাতাটা নিজে হাতে চালিয়ে দেখুন। Program চালু করুন, একই ফ্ল্যাটে
              দুইটা বসাতে চেষ্টা করুন, খালি ফ্ল্যাটে কড়া নাড়ুন। তিনটা আলাদা ফল
              দেখবেন, আর তিনটাই আপনার Terminal এ একদিন আসবে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PortTableLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "client-port",
      subHeader: { index: "003", title: "The Other Side" },
      title: <SectionTitle>Client এরও একটা ফ্ল্যাট লাগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ Server এর ফ্ল্যাটের কথা হলো। এবার একটা প্রশ্ন যেটা প্রথমে
                মাথায় আসে না। আপনার Browser এ দশটা Tab খোলা, দশটাই একই সাইটের।
                দশটা Request গেল, দশটা Response ফিরে এলো। আপনার Laptop এর ঠিকানা
                একটাই। তাহলে তিন নম্বর Tab এর উত্তর ঠিক তিন নম্বর Tab এই ফেরে
                কীভাবে, সাত নম্বরে নয়?
              </ContentParagraph>
              <ContentParagraph>
                কারণ চিঠি পাঠানোর সময় খামে ফেরার ঠিকানাও লেখা হয়, আর ফেরার
                ঠিকানাতেও একটা ফ্ল্যাটের নম্বর থাকে। Client নিজে কোনো ফ্ল্যাট
                বেছে নেয় না, তার দরকারও নেই। কথা শুরু করার মুহূর্তে Kernel তাকে
                একটা সাময়িক ফ্ল্যাট দিয়ে দেয়, উপরের দিকের একটা নম্বর, ৪৯১৫২
                থেকে ৬৫৫৩৫ এর মধ্যে। Server উত্তরের খামে ওই নম্বরটাই ফিরিয়ে
                লেখে, আর আপনার Kernel খাতা দেখে ঠিক Tab টা খুঁজে বের করে। কথা
                শেষ হলে নম্বরটা ফেরত চলে যায়, পরের কথায় আবার কেউ পাবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ManyTabsLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "চারটা সংখ্যায় একটা কথা",
          content: (
            <p>
              তাহলে Internet এ একটা কথাকে আলাদা করে চেনার জন্য চারটা সংখ্যা
              লাগে। আপনার ঠিকানা, আপনার ফ্ল্যাট, Server এর ঠিকানা, Server এর
              ফ্ল্যাট। চারটার একটা আলাদা হলেই সেটা আলাদা কথা। এই কারণেই একটা
              Server একই ফ্ল্যাট 443 এ বসে হাজার মানুষের সাথে একসাথে কথা বলতে
              পারে, কারণ হাজারজনের বাকি তিনটা সংখ্যা আলাদা। এই চার সংখ্যার
              জোড়াটা Module 05 এ আবার আসবে, তখন TCP এর ভাষায়। আপাতত ছবিটা মনে
              থাকলেই হবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "stack",
      subHeader: { index: "004", title: "The Stack" },
      title: <SectionTitle>Kernel এর ভেতরে খামটা তৈরি হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনার Program যখন হ্যান্ডসেটে কথা বলে, সে শুধু কথাটাই বলে। Tour
                list দাও। সে কোনো ঠিকানা লেখে না, কোনো Port লেখে না, খাম বানায়
                না। এই সব কাজ Kernel করে, আর করে একটা সিঁড়ির মতো, উপর থেকে নিচে
                নামতে নামতে।
              </ContentParagraph>
              <ContentParagraph>
                একটা চিঠি Post Office এ দেওয়ার কথা ভাবুন। আপনি কাগজে শুধু
                চিঠিটা লেখেন। একজন সেটা খামে ভরে ফ্ল্যাটের নম্বর লেখেন। পরের জন
                খামের উপরে বিল্ডিংয়ের ঠিকানা লেখেন। শেষের জন খামটা বস্তায় ভরে
                গাড়িতে তোলেন। প্রতিটা ধাপে একটা নতুন মোড়ক, আর প্রতিটা মোড়কে
                একটা নতুন লেখা। Kernel এর ভেতরে এই ধাপগুলোর একটা নাম আছে,
                Network Stack, আর প্রতিটা ধাপকে বলে Layer।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetworkStackDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই সিঁড়ির প্রতিটা ধাপে কী লেখা হয়, ধাপগুলোর নাম কেন এমন, আর
                TCP আর UDP এর তফাত কী, এই সবকিছু Module 05 এর পুরোটা। এখানে শুধু
                দুইটা জিনিস মনে রাখুন। প্রথমত, সিঁড়িটা আছে, আর আপনার Program
                তার সবচেয়ে উপরের ধাপে বসে, খাম নিয়ে তাকে ভাবতে হয় না।
                দ্বিতীয়ত, Port লেখার ধাপটা Kernel এর, তাই Port এর সব হিসাব,
                খাতা, কে কোথায় বসে, সব Kernel এর হাতে।
              </ContentParagraph>
              <ContentParagraph>
                ওপাশের মেশিনে ঠিক উল্টোটা হয়। Card থেকে খাম ঢোকে, Kernel সিঁড়ি
                বেয়ে উপরে উঠতে উঠতে একটা একটা মোড়ক খোলে, শেষে Port দেখে খাতা
                মেলায়, আর ঠিক Program এর হ্যান্ডসেটে শুধু কথাটা তুলে দেয়।
                Program দুই পাশেই শুধু কথা দেখে, খাম কখনো দেখে না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "loopback",
      subHeader: { index: "005", title: "Loopback" },
      title: <SectionTitle>localhost কখনো বাইরে যায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 01 এ একটা কথা রেখে এসেছি। localhost মানে এই মেশিনটা নিজে,
                আর তাই বন্ধু সেটা খুলতে পারেন না। এবার ভেতরটা দেখার সময়।
                localhost আসলে একটা ঠিকানার ডাকনাম, 127.0.0.1, আর এই ঠিকানাটা
                পৃথিবীর প্রতিটা মেশিনে একই। প্রতিটা মেশিনে 127.0.0.1 মানে আমি
                নিজে।
              </ContentParagraph>
              <ContentParagraph>
                আপনার curl যখন 127.0.0.1:3000 এ চিঠি পাঠায়, Kernel খামে
                ঠিকানাটা দেখে আর বুঝে যায়, এটা তো এই বিল্ডিংয়েরই। তখন সে
                চিঠিটা Network Card পর্যন্ত পাঠায়ই না। গেটে দাঁড়িয়েই ঘুরিয়ে
                ভেতরে ফ্ল্যাট 3000 এ দিয়ে দেয়। এই ঘুরিয়ে দেওয়ার নাম
                Loopback, আর এর একটা সুন্দর ফল আছে যেটা নিচের Lab এ নিজে দেখবেন।
                Wi-Fi বন্ধ করে দিলেও localhost কাজ করে, কারণ চিঠি তারে ওঠেই না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LoopbackSplitDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এবার লেসন ০১ এর প্রশ্নটার পুরো উত্তর",
          content: (
            <p>
              বন্ধুর Phone এ localhost:3000 লিখলে বন্ধুর Kernel 127.0.0.1 দেখে
              ভাবে, এটা আমার বিল্ডিং, আর নিজের ফ্ল্যাট 3000 এ কড়া নাড়ে। বন্ধুর
              Phone এ 3000 এ কেউ বসে নেই, তাই Connection refused। আপনার Laptop
              পর্যন্ত চিঠিটা যাওয়ার প্রশ্নই ওঠে না। বন্ধুকে আপনার বিল্ডিংয়ের
              আসল ঠিকানা দিতে হবে, 192.168.0.12, যেটা Lesson 02 এর Lab এ আপনি
              করেছেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "project",
      subHeader: { index: "006", title: "Project Example" },
      title: (
        <SectionTitle>Island Tours এর বিল্ডিংয়ে কোন ফ্ল্যাট খোলা</SectionTitle>
      ),
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর সার্ভারে পাঁচটা Program চলে, আর পাঁচটার পাঁচটা
                ফ্ল্যাট। কিন্তু সবগুলো ফ্ল্যাট বাইরে থেকে খোলা নয়, আর কোনটা
                খোলা কোনটা বন্ধ, সেই সিদ্ধান্তটাই এই সার্ভারের নিরাপত্তার
                অর্ধেক।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>443 আর 80, nginx, বাইরে খোলা:</strong> পৃথিবীর যে কেউ
                  এই দুই দরজায় কড়া নাড়তে পারে, কারণ এটাই সাইট। 80 এ যে আসে
                  তাকে nginx ভদ্রভাবে 443 এ পাঠিয়ে দেয়।
                </ListItem>
                <ListItem>
                  <strong>3000, node, শুধু ভেতরে:</strong> API টা 3000 এ বসে,
                  কিন্তু বাইরে থেকে 3000 এ কড়া নাড়লে কেউ দরজা খোলে না। কারণ
                  বাইরের চিঠি nginx এর হাত দিয়ে আসে, nginx ভেতরে ভেতরে 3000 এ
                  কড়া নাড়ে, একই বিল্ডিংয়ের ভেতরে, ঠিক Loopback এর মতো। কেন
                  মাঝখানে nginx, সেটা Module 11।
                </ListItem>
                <ListItem>
                  <strong>5432 আর 6379, শুধু localhost:</strong> postgres আর
                  redis এমনভাবে চালু করা যে তারা শুধু 127.0.0.1 এ শোনে। মানে
                  বাইরের কোনো চিঠি এই ফ্ল্যাটে পৌঁছানোর প্রশ্নই ওঠে না, Kernel
                  তার আগেই ফেলে দেয়। Database এ শুধু node কথা বলবে, আর node একই
                  বিল্ডিংয়ে।
                </ListItem>
                <ListItem>
                  <strong>22, sshd, খোলা কিন্তু পাহারায়:</strong> এই দরজা দিয়ে
                  ডেভেলপাররা ঢোকেন। খোলা রাখতেই হয়, তাই এখানে সবচেয়ে বেশি
                  পাহারা, যেটা Module 07 এর কথা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সবচেয়ে চেনা ভুলটা এই তালিকার তিন নম্বরে",
          content: (
            <p>
              Database চালু করার সময় একটা সেটিং থাকে, কোন ঠিকানায় শুনবে।
              127.0.0.1 লিখলে শুধু ভেতরে। 0.0.0.0 লিখলে সব ঠিকানায়, মানে বাইরে
              থেকেও। Docker এর অনেক উদাহরণে দ্বিতীয়টা লেখা থাকে, কারণ ওটা সহজে
              কাজ করে। ফল হলো পৃথিবীর যে কেউ 5432 এ কড়া নাড়তে পারে, আর সারা
              দুনিয়ায় Bot গুলো ঠিক এই ফ্ল্যাটগুলোই খুঁজে বেড়ায়, দিন রাত।
              খবরে যে Database ফাঁস হওয়ার গল্পগুলো পড়েন, তার একটা বড় অংশ এই
              এক লাইনের সেটিং। নিচের Lab এর এক নম্বর কমান্ডে আপনার নিজের মেশিনে
              কোন ফ্ল্যাট কোন ঠিকানায় শুনছে, দেখে নিন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "request-flow",
      subHeader: { index: "007", title: "Step-by-step Flow" },
      title: <SectionTitle>গেট থেকে ফ্ল্যাট, তারপর ফেরত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আগের লেসনে চিঠিটা Island Tours এর বিল্ডিং পর্যন্ত পৌঁছেছিল। এবার
              বিল্ডিংয়ের ভেতরের গল্প, গেট থেকে ফ্ল্যাট পর্যন্ত, আর ফেরত।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Phone এ Kernel একটা ফেরার ফ্ল্যাট দিল",
              description:
                "পর্যটকের App কথা শুরু করতে চাইল। Phone এর Kernel তাকে একটা সাময়িক ফ্ল্যাট দিল, ধরুন 51234, আর খামে ফেরার ঠিকানা লিখল, Phone এর ঠিকানা : 51234। যাওয়ার ঠিকানা: Server এর ঠিকানা : 443।",
            },
            {
              title: "Card থেকে গেটে",
              description:
                "রাস্তা পেরিয়ে খামটা Island Tours এর মেশিনের Network Card এ ঢুকল। Card সেটা Kernel এর হাতে দিল। Kernel সিঁড়ি বেয়ে উঠতে উঠতে মোড়ক খুলল।",
            },
            {
              title: "খাতা মেলানো: 443 → nginx",
              description:
                "শেষ মোড়কে লেখা 443। Kernel খাতায় দেখল, 443 এ বসে nginx, PID 812। nginx এর হ্যান্ডসেটে শুধু কথাটা তুলে দিল। খাম nginx দেখল না।",
            },
            {
              title: "nginx ভেতরে ভেতরে 3000 এ কড়া নাড়ল",
              description:
                "nginx নিজে উত্তর জানে না। সে একই বিল্ডিংয়ের ভেতরে 127.0.0.1:3000 এ চিঠি পাঠাল। Kernel দেখল নিজের ঠিকানা, Card এ পাঠাল না, ঘুরিয়ে ফ্ল্যাট 3000 এ দিল। এই কথায় nginx হলো Client, node হলো Server।",
            },
            {
              title: "node আবার 5432 এ, একই বিল্ডিংয়ে",
              description:
                "node কে Database লাগল। সে 127.0.0.1:5432 এ চিঠি পাঠাল। আবার Loopback, আবার খাতা, এবার postgres এর হ্যান্ডসেট বাজল। postgres শুধু 127.0.0.1 এ শোনে, তাই এই চিঠি ভেতর থেকেই আসতে পারত, বাইরে থেকে কোনোদিন না।",
            },
            {
              title: "উত্তর ফিরল, খামে 51234",
              description:
                "উত্তর postgres থেকে node, node থেকে nginx, nginx থেকে বাইরে। শেষ খামে যাওয়ার ঠিকানা Phone এর ঠিকানা : 51234। Phone এর Kernel খাতায় 51234 খুঁজল, পেল Island Tours App এর হ্যান্ডসেট। পর্যটক তালিকা দেখলেন, আর 51234 ফেরত গেল খাতায়।",
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
                <strong>Beej&apos;s Guide to Network Programming</strong>, socket,
                bind, listen, accept, এই চারটা Syscall এর সবচেয়ে বিখ্যাত আর
                সবচেয়ে মজার ব্যাখ্যা। প্রথম তিনটা অধ্যায় এই লেসনের সাথে পড়ুন,
                বাকিটা Module 05 এ।{" "}
                <a
                  href="https://beej.us/guide/bgnet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  beej.us/guide/bgnet
                </a>
              </ListItem>
              <ListItem>
                <strong>Julia Evans, Networking zine</strong>, Port, Socket আর
                localhost এক পাতার ছবিতে, সম্পূর্ণ বিগিনারদের জন্য।{" "}
                <a
                  href="https://wizardzines.com/zines/networking/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  wizardzines.com/zines/networking
                </a>
              </ListItem>
              <ListItem>
                <strong>পড়ার জন্য</strong>, Terminal এ man 2 socket, man 2
                bind, man 2 listen। আর Node ডকুমেন্টেশনের net.Server অংশটা,
                যেখানে listen() এর host আর port দুইটা আলাদা করে বোঝানো আছে।
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
                এক মেশিন, এক ঠিকানা, অনেক Program। Port হলো ফ্ল্যাটের নম্বর, ০
                থেকে ৬৫৫৩৫, যেটা বলে চিঠিটা কোন Program এর।
              </ListItem>
              <ListItem>
                localhost:3000 মানে বিল্ডিং : ফ্ল্যাট। Well Known Port গুলো সবাই
                জানে, 22, 80, 443, 5432। ১০২৪ এর নিচে শুধু root, তাই Dev Server
                3000 এ।
              </ListItem>
              <ListItem>
                Socket হলো Kernel এর দেওয়া হ্যান্ডসেট। Program নিজে Card ছোঁয়
                না, হ্যান্ডসেটে বলে, Kernel পাঠায়। Server এর দিকে তিন Syscall,
                socket, bind, listen, Node এ এক লাইন।
              </ListItem>
              <ListItem>
                listen() এর পরে Kernel খাতায় লেখে, ফ্ল্যাট → PID। এক ফ্ল্যাটে
                দুইজন বসে না, তাই EADDRINUSE। খালি ফ্ল্যাটে কড়া নাড়লে
                Connection refused।
              </ListItem>
              <ListItem>
                Client এরও ফ্ল্যাট লাগে, Kernel সাময়িকভাবে দেয়, ৪৯১৫২ থেকে
                ৬৫৫৩৫। এই কারণেই দশটা Tab এর উত্তর গুলিয়ে যায় না। চারটা
                সংখ্যায় একটা কথা।
              </ListItem>
              <ListItem>
                Kernel এর ভেতরে একটা সিঁড়ি, Network Stack। Program শুধু কথা
                লেখে, Kernel নামতে নামতে খামে Port আর ঠিকানা লেখে, ওপাশে উঠতে
                উঠতে খোলে। ধাপগুলোর ভেতরটা Module 05।
              </ListItem>
              <ListItem>
                localhost মানে 127.0.0.1, প্রতিটা মেশিনে নিজে। Kernel গেট থেকেই
                ঘুরিয়ে দেয়, Card এ যায় না, Wi-Fi ছাড়াও চলে। বন্ধুর localhost
                বন্ধুর বিল্ডিং।
              </ListItem>
              <ListItem>
                Production এ সব ফ্ল্যাট বাইরে খোলা থাকে না। Database শুধু
                127.0.0.1 এ শোনে। 0.0.0.0 লিখলে দুনিয়া শুনে, আর Bot রা খুঁজে
                পায়।
              </ListItem>
              <ListItem>
                পরের লেসন: খামটা আসলে একটা নয়, চিঠিটা টুকরো টুকরো হয়ে যায়।
                Packet, আর Latency আর Bandwidth কেন এক জিনিস নয়।
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
        <span className="font-bold text-primary">Port</span>,
        "ফ্ল্যাটের নম্বর, ০ থেকে ৬৫৫৩৫, বলে কোন Program",
      ],
      [
        <span className="font-bold text-primary">IP : Port</span>,
        "বিল্ডিং : ফ্ল্যাট, যেমন localhost:3000",
      ],
      [
        <span className="font-bold text-primary">Well Known Port</span>,
        "সবাই আগে থেকে জানে, 22, 80, 443, 5432",
      ],
      [
        <span className="font-bold text-primary">Socket</span>,
        "Kernel এর দেওয়া হ্যান্ডসেট, যেটা দিয়ে Program কথা বলে",
      ],
      [
        <span className="font-bold text-primary">bind + listen</span>,
        "হ্যান্ডসেট ফ্ল্যাটে জোড়া, তারপর অপেক্ষায় বসা",
      ],
      [
        <span className="font-bold text-primary">EADDRINUSE</span>,
        "ফ্ল্যাটে আগেই কেউ বসে আছে, প্রায়ই পুরনো Process",
      ],
      [
        <span className="font-bold text-primary">Connection refused</span>,
        "বিল্ডিং আছে, ফ্ল্যাট খালি, কেউ শুনছে না",
      ],
      [
        <span className="font-bold text-primary">Ephemeral Port</span>,
        "Client এর সাময়িক ফেরার ফ্ল্যাট, Kernel দেয়",
      ],
      [
        <span className="font-bold text-primary">Network Stack</span>,
        "Kernel এর সিঁড়ি, নামতে নামতে খাম বানায়",
      ],
      [
        <span className="font-bold text-primary">Loopback</span>,
        "127.0.0.1, নিজের কাছে চিঠি, Card এ যায় না",
      ],
      [
        <span className="font-bold text-primary">0.0.0.0</span>,
        "সব ঠিকানায় শোনা, মানে বাইরে থেকেও, সাবধান",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা মেশিনের ঠিকানা একটাই। তাহলে চিঠিটা postgres এর হাতে না পড়ে node এর হাতে পড়ে কীভাবে?",
        options: [
          {
            key: "A",
            text: "Kernel চিঠি খুলে পড়ে বুঝে নেয় এটা কার",
            isCorrect: false,
            explanation:
              "Kernel চিঠির ভেতরটা পড়ে না। সে শুধু খামের উপরের একটা সংখ্যা দেখে।",
          },
          {
            key: "B",
            text: "খামে Port লেখা থাকে, Kernel খাতায় মিলিয়ে ঠিক Process এর হ্যান্ডসেটে দেয়",
            isCorrect: true,
            explanation:
              "ফ্ল্যাটের নম্বর। 3000 লেখা থাকলে খাতায় 3000 এর পাশে যার নাম, তার হাতে।",
          },
          {
            key: "C",
            text: "যে Program আগে চালু হয়েছে, সে পায়",
            isCorrect: false,
          },
        ],
      },
      {
        id: 2,
        text: "node server.js চালালেন, এরর: listen EADDRINUSE :::3000। সবচেয়ে সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "Port 3000 আপনার মেশিনে নেই",
            isCorrect: false,
            explanation:
              "সব মেশিনে ০ থেকে ৬৫৫৩৫ সব Port আছে। প্রশ্নটা কেউ বসে আছে কিনা।",
          },
          {
            key: "B",
            text: "আগের একটা Process এখনো 3000 এ বসে আছে, সম্ভবত মরেনি",
            isCorrect: true,
            explanation:
              "এক ফ্ল্যাটে দুইজন না। lsof -i :3000 দিয়ে খুঁজে বের করুন, তারপর kill।",
          },
          {
            key: "C",
            text: "Internet সংযোগ নেই",
            isCorrect: false,
            explanation:
              "Port খাতা Kernel এর নিজের, Internet এর সাথে এর সম্পর্ক নেই। Wi-Fi ছাড়াও এই এরর আসে।",
          },
        ],
      },
      {
        id: 3,
        text: "curl localhost:3001 দিলেন, সাথে সাথে Connection refused। মানে কী?",
        options: [
          {
            key: "A",
            text: "মেশিনটা নেই বা Network নেই",
            isCorrect: false,
            explanation:
              "মেশিন না থাকলে কেউ না বলার জন্যও থাকত না, আপনি অনেকক্ষণ অপেক্ষা করে Timeout পেতেন। সাথে সাথে না বলা মানে Kernel জেগে আছে।",
          },
          {
            key: "B",
            text: "মেশিন আছে, Kernel জেগে আছে, কিন্তু 3001 এ কেউ শুনছে না",
            isCorrect: true,
            explanation:
              "বিল্ডিং ঠিক, ফ্ল্যাট খালি। প্রায়ই Server চালু করতে ভুলে গেছেন, বা ভুল Port।",
          },
          {
            key: "C",
            text: "Server আপনাকে ঢুকতে দিচ্ছে না",
            isCorrect: false,
            explanation:
              "Server থাকলে সে অন্তত দরজা খুলত। এখানে দরজার পেছনে কেউই নেই।",
          },
        ],
      },
      {
        id: 4,
        text: "Browser এ একই সাইটের দশটা Tab। দশটা উত্তর ঠিক Tab এ ফেরে কীভাবে?",
        options: [
          {
            key: "A",
            text: "Server Tab এর নম্বর মনে রাখে",
            isCorrect: false,
            explanation:
              "Server আপনার Tab এর কিছুই জানে না। সে শুধু খামের ফেরার ঠিকানাটা ফিরিয়ে লেখে।",
          },
          {
            key: "B",
            text: "প্রতিটা Tab এর কথায় Kernel একটা আলাদা সাময়িক Port দিয়েছিল, উত্তরের খামে সেটাই ফেরে",
            isCorrect: true,
            explanation:
              "Ephemeral Port, ৪৯১৫২ থেকে ৬৫৫৩৫। আপনার Kernel খাতায় সেই নম্বর খুঁজে ঠিক Tab এর হ্যান্ডসেট বাজায়।",
          },
          {
            key: "C",
            text: "দশটা Tab দশটা আলাদা ঠিকানা পায়",
            isCorrect: false,
            explanation:
              "ঠিকানা একটাই, Laptop এর। আলাদা হয় শুধু আপনার দিকের Port।",
          },
        ],
      },
      {
        id: 5,
        text: "Wi-Fi বন্ধ। curl localhost:3000 কাজ করবে, যদি Server চলে?",
        options: [
          {
            key: "A",
            text: "না, Network ছাড়া কোনো Request যায় না",
            isCorrect: false,
            explanation:
              "127.0.0.1 এর চিঠি Network Card পর্যন্ত যায়ই না। Kernel গেট থেকেই ঘুরিয়ে দেয়।",
          },
          {
            key: "B",
            text: "হ্যাঁ, Loopback এ চিঠি Card এ ওঠেই না, Kernel এর ভেতরেই ঘোরে",
            isCorrect: true,
            explanation:
              "এই কারণেই Dev করার সময় Internet না থাকলেও localhost চলে। আর এই কারণেই বন্ধুর localhost আপনার মেশিনে পৌঁছায় না।",
          },
          {
            key: "C",
            text: "শুধু তখনই, যদি আগে একবার খোলা থাকে",
            isCorrect: false,
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Kernel এর খাতাটা নিজে পড়ুন",
    subtitle: "Terminal এ পাঁচটা পরীক্ষা, দুইটা Terminal লাগবে",
    stepName: "LAB",
    steps: [
      {
        title: "খাতাটা পড়ুন: কে কোন ফ্ল্যাটে",
        description:
          "আপনার মেশিনে এই মুহূর্তে কোন Program কোন Port এ শুনছে, আর কোন ঠিকানায়, এক কমান্ডে দেখুন। 127.0.0.1 আর 0.0.0.0 এর তফাত এখানেই চোখে পড়বে।",
      },
      {
        title: "এক ফ্ল্যাটে দুইজন বসান",
        description:
          "একই Port এ দুইটা Server চালু করে EADDRINUSE নিজে বানান। তারপর খাতায় খুঁজে বের করুন কে বসে আছে, আর তাকে বের করুন।",
      },
      {
        title: "খালি ফ্ল্যাটে কড়া নাড়ুন",
        description:
          "যে Port এ কেউ নেই সেখানে curl করুন আর Connection refused দেখুন। পাশাপাশি এমন ঠিকানায় করুন যেখানে মেশিনই নেই, আর তফাতটা অনুভব করুন।",
      },
      {
        title: "Client এর সাময়িক ফ্ল্যাটটা ধরুন",
        description:
          "একটা ধীর Server চালিয়ে, curl চলার মাঝখানে খাতা দেখুন। একই কথার দুই দিক দুই লাইনে দেখবেন, Server এর 3000 আর curl এর একটা বড় সংখ্যা।",
      },
      {
        title: "Wi-Fi বন্ধ করে localhost",
        description:
          "Wi-Fi বন্ধ করুন, তারপর localhost এ curl করুন। কাজ করবে। Loopback কখনো তারে ওঠে না।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-read-the-table.sh",
        language: "bash",
        code: `# কে কোন Port এ শুনছে, আর কোন ঠিকানায়
sudo lsof -iTCP -sTCP:LISTEN -n -P        # macOS, Linux দুইটাতেই চলে
# Linux এ আরও পরিষ্কার:
ss -tulnp

# একটা লাইন এরকম দেখবেন:
#   postgres  812  ...  TCP 127.0.0.1:5432 (LISTEN)     ← শুধু ভেতরে শোনে, ভালো
#   node     4821  ...  TCP *:3000 (LISTEN)             ← * মানে 0.0.0.0, সব ঠিকানায়
#
# 127.0.0.1 লেখা মানে ওই ফ্ল্যাটে বাইরের চিঠি পৌঁছাবেই না।
# * বা 0.0.0.0 মানে যে কেউ কড়া নাড়তে পারে, Wi-Fi এর সবাই, আর Public ঠিকানা থাকলে দুনিয়া।
# আপনার Database কোনটায়? এই এক লাইনই বলে দেয় আপনি নিরাপদ কিনা।`,
      },
      {
        filename: "2-two-in-one-flat.sh",
        language: "bash",
        code: `# Terminal 1
node -e "require('http').createServer((q,r)=>r.end('এক\\n')).listen(3000, ()=>console.log('PID', process.pid, 'ফ্ল্যাট 3000 এ বসলাম'))"

# Terminal 2, একই ফ্ল্যাটে আরেকজন
node -e "require('http').createServer((q,r)=>r.end('দুই\\n')).listen(3000)"
# Error: listen EADDRINUSE: address already in use :::3000
# Kernel না বলে দিল। এক ফ্ল্যাটে দুইজন না।

# কে বসে আছে? খাতা দেখুন:
lsof -i :3000
# COMMAND  PID  ...  TCP *:3000 (LISTEN)
# ওই PID টাই Terminal 1 এর। এবার সিদ্ধান্ত আপনার:
kill <PID>
# আবার Terminal 2 এর কমান্ড চালান, এবার বসতে পারবে।
#
# Production এ এই এররটা আসে যখন Restart এর সময় পুরনো Process মরতে দেরি করে।
# pm2 আর docker এই কারণেই আগে SIGTERM পাঠিয়ে অপেক্ষা করে, Module 01 এর Lesson 07।`,
      },
      {
        filename: "3-knock-on-empty.sh",
        language: "bash",
        code: `# ধরুন Terminal 1 এ 3000 এ Server চলছে। এবার 3001 এ, যেখানে কেউ নেই:
curl localhost:3001
# curl: (7) Failed to connect to localhost port 3001: Connection refused
# সাথে সাথেই এলো। Kernel জেগে আছে, খাতায় 3001 এর পাশে কেউ নেই, তাই সাথে সাথে না।

# এবার এমন ঠিকানায়, যেখানে মেশিনই নেই:
curl --max-time 5 http://10.255.255.1:3000
# ... পাঁচ সেকেন্ড চুপ ...
# curl: (28) Connection timed out
# কেউ না বলার জন্যও নেই। চিঠি গেল, ফিরল না।

# দুইটা এরর, দুইটা মানে:
#   refused  = বিল্ডিং আছে, ফ্ল্যাট খালি      → Server চালু করুন, বা Port মিলান
#   timeout  = বিল্ডিং পর্যন্ত পৌঁছালই না    → ঠিকানা, Network, Firewall দেখুন
# কোনটা পেলেন, সেটাই বলে দেয় কোথায় খুঁজবেন।`,
      },
      {
        filename: "4-catch-the-client-port.sh",
        language: "bash",
        code: `# Terminal 1: একটা ধীর Server, উত্তর দিতে ১০ সেকেন্ড নেয়
node -e "require('http').createServer((q,r)=>setTimeout(()=>r.end('দেরিতে\\n'),10000)).listen(3000)"

# Terminal 2: curl শুরু করুন, সে ১০ সেকেন্ড অপেক্ষা করবে
curl localhost:3000 &

# Terminal 2, সাথে সাথেই: কথাটার দুই দিক খাতায় দেখুন
lsof -i :3000
# node  4821  TCP *:3000 (LISTEN)                          ← Server, দরজা খোলা
# node  4821  TCP localhost:3000->localhost:51234 (ESTABLISHED)  ← Server এর দিক থেকে কথাটা
# curl  4990  TCP localhost:51234->localhost:3000 (ESTABLISHED)  ← curl এর দিক থেকে কথাটা
#
# 51234 সংখ্যাটা দেখুন। curl কখনো এটা চায়নি, Kernel দিয়েছে। এটাই Client এর সাময়িক ফ্ল্যাট।
# আপনার সংখ্যাটা আলাদা হবে, কিন্তু ৪৯১৫২ থেকে ৬৫৫৩৫ এর মধ্যে।
# ১০ সেকেন্ড পরে আবার lsof চালান। ESTABLISHED লাইন দুইটা নেই, 51234 ফেরত গেছে।`,
      },
      {
        filename: "5-loopback-offline.sh",
        language: "bash",
        code: `# Terminal 1 এ 3000 এ Server চলছে। এবার Wi-Fi বন্ধ করুন। পুরোপুরি।

curl localhost:3000
# উত্তর এলো। Internet নেই, তবু এলো।

curl 127.0.0.1:3000
# একই কথা, শুধু ডাকনামের বদলে আসল নম্বর।

ping -c 1 8.8.8.8
# Network is unreachable। বাইরের দুনিয়া নেই।

# Loopback এর চিঠি Network Card পর্যন্ত যায়ই না, Kernel গেট থেকে ঘুরিয়ে দেয়।
# তাই Card বন্ধ থাকলেও কিছু যায় আসে না।
# এই কারণেই বিমানে বসেও আপনি localhost এ Dev করতে পারেন।
# আর এই কারণেই বন্ধুর Phone এ localhost মানে বন্ধুর Phone, চিঠি বন্ধুর গেট থেকেই ঘুরে যায়।`,
      },
    ],
    tip: "এক নম্বর কমান্ডটা মুখস্থ করে রাখুন, কারণ Production এ প্রথম দিন এটাই সবচেয়ে বেশি লাগবে। কোনো সাইট খুলছে না? প্রথম প্রশ্ন: Server আসলে শুনছে কি, কোন Port এ, কোন ঠিকানায়? এই এক লাইন তিনটা প্রশ্নের উত্তর একসাথে দেয়, আর অর্ধেক সমস্যা এখানেই ধরা পড়ে।",
  },
  assignment: {
    title: "Mini Project: my-tours এর ফ্ল্যাটগুলো গুছিয়ে দিন",
    time: "১ - ২ ঘণ্টা",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>আপনার মেশিনের খাতা:</strong> Lab এর এক নম্বর কমান্ড চালিয়ে
        প্রতিটা LISTEN লাইন লিখে রাখুন। প্রতিটার পাশে লিখুন Program টা কী, আর সে
        127.0.0.1 এ শুনছে নাকি সব ঠিকানায়। কোনোটা অবাক করল কি?
      </span>,
      <span key="2">
        <strong>my-tours এর Port ঠিক করুন:</strong> my-tours সার্ভারের listen()
        এ Port টা Environment Variable থেকে নিন, PORT না থাকলে 3000। তারপর
        PORT=4000 দিয়ে চালিয়ে দেখুন খাতায় 4000 উঠল। Lesson 07 এর .env এর কথা
        মনে রাখুন, Restart লাগবে।
      </span>,
      <span key="3">
        <strong>Database কে ভেতরে আটকান:</strong> আপনার Laptop এ postgres বা যে
        Database চলে, তার সেটিং দেখুন কোন ঠিকানায় শুনছে। 0.0.0.0 বা * থাকলে
        127.0.0.1 করুন, Restart দিন, আর Lab এর এক নম্বর কমান্ডে বদলটা দেখুন। আগে
        পরে দুইটা লাইন রাখুন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু বললেন, আমার
        সাইট খুলছে না, curl দিলে Connection refused দেখায়। আপনি তাঁকে পরপর কোন
        তিনটা কমান্ড চালাতে বলবেন, আর প্রতিটা কমান্ডের ফল থেকে কী বুঝবেন?
      </span>,
    ],
    deliverables: [
      <span key="1">LISTEN লাইনের তালিকা, প্রতিটার Program আর ঠিকানা সহ</span>,
      <span key="2">
        PORT Environment Variable পড়া my-tours, আর 4000 এ খাতার লাইন
      </span>,
      <span key="3">Database এর ঠিকানা বদলের আগে আর পরের দুইটা লাইন</span>,
      <span key="4">Connection refused এর তিন ধাপের খোঁজ, ৫ লাইনে</span>,
    ],
  },
};
