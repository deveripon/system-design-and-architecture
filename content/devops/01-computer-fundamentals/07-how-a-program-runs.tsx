/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  ProgramStartLab,
  SyscallTraceLab,
} from "../../../components/course/topics/program/animations";
import {
  CompileVsInterpretDiagram,
  ProcessMemoryDiagram,
  SourceToProcessDiagram,
} from "../../../components/course/topics/program/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const howAProgramRunsContent: TopicData = {
  id: "how-a-program-runs",
  introduction: {
    badge: "MODULE 01 · LESSON 07",
    title: <SectionTitle>রান্নার বই, নাকি চুলায় বসানো হাঁড়ি</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই মডিউলে আপনি আলাদা আলাদা করে অনেকগুলো জিনিস দেখেছেন। সবকিছু আসলে
          Bit, CPU একটার পর একটা Instruction চালায়, RAM দ্রুত কিন্তু ভুলে যায়,
          Disk ধীর কিন্তু মনে রাখে, Kernel সবাইকে ভাগ করে সময় দেয়, আর একটা
          Process এর ভেতরে অনেকগুলো Thread থাকতে পারে।
        </ContentParagraph>
        <ContentParagraph>
          এবার আমরা টুকরোগুলো এক জায়গায় জোড়া লাগাব। আপনি Terminal এ যখন node
          server.js লিখে Enter চাপেন, তখন কয়েক মিলিসেকেন্ডের ভেতরে এমন একটা
          ঘটনার সারি ঘটে যেখানে উপরের প্রতিটা জিনিস একবার করে কাজে লাগে।
        </ContentParagraph>
        <ContentParagraph>
          শুরুটা হোক একটা রান্নার বই দিয়ে। বইয়ের ১২ নম্বর পাতায় বিরিয়ানির
          রেসিপি লেখা আছে, প্রতিটা ধাপ পরিষ্কার করে বলা। কিন্তু বইটা যতক্ষণ
          তাকের উপরে বন্ধ হয়ে পড়ে আছে, ততক্ষণ ঘরে বিরিয়ানির গন্ধ আসে না।
          রেসিপি আর রান্না এক জিনিস নয়, আর এই লেসনের পুরোটাই ওই তফাতের গল্প।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "Disk এ পড়ে থাকা ফাইলটার নাম Program। সেই ফাইলটা যখন Memory তে জ্যান্ত হয়ে ওঠে, তখন তার নাম Process।",
      author: "Computer Fundamentals",
      role: "Lesson 07",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "program-vs-process",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Program আর Process এক জিনিস নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রেসিপিটা নিছক নির্দেশ, কাগজের উপরে চুপচাপ শুয়ে আছে। রান্না শুরু
                হয় তখনই, যখন রাঁধুনি বইটা খোলেন, চুলা ধরান, আর হাঁড়ি বসান। এই
                মুহূর্ত থেকে ঘটনাটার নিজের একটা অস্তিত্ব তৈরি হয়। তার একটা চুলা
                লাগে, একটা হাঁড়ি লাগে, আর কেউ একজন সময় ধরে তার পাশে দাঁড়িয়ে
                থাকেন।
              </ContentParagraph>
              <ContentParagraph>
                এখন মজার প্রশ্নটা করি। তিনজন রাঁধুনি একই বইয়ের একই পাতা দেখে
                একসাথে তিন হাঁড়ি বিরিয়ানি রাঁধতে পারেন কি? অবশ্যই পারেন।
                রেসিপি একটাই থাকে, কিন্তু রান্না হয় তিনটা, তিনটা আলাদা চুলায়,
                তিনটা আলাদা হাঁড়িতে। একজনের হাঁড়ি পুড়ে গেলে বাকি দুইজনের কিছু
                হয় না।
              </ContentParagraph>
              <ContentParagraph>
                কম্পিউটারে ব্যাপারটা হুবহু এক। আপনার Disk এ server.js নামে যে
                ফাইলটা পড়ে আছে, সেটা Program। সে নিজে থেকে কিছুই করে না, সে
                শুধু কতগুলো Byte। আপনি যখন তাকে চালান, তখন Memory তে যে জ্যান্ত
                জিনিসটা তৈরি হয়, সেটা Process। একই Program থেকে আপনি দশটা
                Process চালাতে পারেন, আর প্রত্যেকের নিজের PID থাকবে, নিজের
                Memory থাকবে, নিজের খোলা ফাইলের তালিকা থাকবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "চেনার সহজ উপায়",
          content: (
            <p>
              Disk এ যেটা পড়ে আছে সেটা Program, আর RAM এ যেটা চলছে সেটা
              Process। Terminal এ ls দিয়ে আপনি Program দেখেন, আর ps দিয়ে দেখেন
              Process। একটার সাইজ মাপা হয় Megabyte এ, অন্যটার অবস্থা মাপা হয়
              CPU আর Memory ব্যবহারে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই তফাতটা মনে রাখলে অনেক গোলমাল এমনিতেই পরিষ্কার হয়ে যায়।
              সার্ভারে কোড আপডেট করার পরেও পুরনো আচরণ দেখতে পাওয়া, একটা Program
              দুইবার চালিয়ে ফেলা, কিংবা Restart দিলে Memory র সমস্যা
              সাময়িকভাবে মিলিয়ে যাওয়া, সবগুলোরই ব্যাখ্যা এই এক জায়গায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "translation",
      subHeader: { index: "002", title: "Visual Explanation" },
      title: <SectionTitle>CPU আপনার কোড পড়তে পারে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 02 এ দেখেছেন CPU কেবল কয়েকটা নির্দিষ্ট Instruction বোঝে,
                যেমন দুইটা সংখ্যা যোগ করা, বা একটা ঠিকানা থেকে মান তুলে আনা।
                আপনার লেখা if শব্দটা তার কাছে কোনো মানেই বহন করে না। তাই মাঝখানে
                কাউকে না কাউকে অনুবাদের কাজটা করতেই হয়।
              </ContentParagraph>
              <ContentParagraph>
                প্রশ্নটা শুধু এটুকুই, অনুবাদটা কখন হবে। আগেই একবার হয়ে যাবে,
                নাকি চলার সময় বারবার হবে? এই একটা প্রশ্নের উত্তরেই ভাষাগুলো দুই
                ভাগ হয়ে গেছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SourceToProcessDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CompileVsInterpretDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Compiled ভাষা, যেমন Go বা Rust:</strong> আপনি যখন go
                build চালান, তখন Compiler পুরো Source একবারে পড়ে ফেলে, আর একটা
                ফাইল বানিয়ে দেয় যার ভেতরে সরাসরি Machine Code বসানো থাকে। ওই
                ফাইলটা ইউজারের মেশিনে দিলেই চলে, সেখানে Go ইনস্টল করা লাগে না।
              </ListItem>
              <ListItem>
                <strong>JavaScript বা Python:</strong> এখানে আপনার ফাইলটা Text
                হিসেবেই থেকে যায়। চালানোর সময় Node নামের একটা Program সেটা
                পড়ে, বোঝে, আর কাজটা করে দেয়। Node নিজে C++ এ লেখা একটা
                Compiled Program, তাই সে CPU এর ভাষা জানে।
              </ListItem>
              <ListItem>
                <strong>মাঝখানের চালাকিটা, JIT:</strong> V8 খেয়াল রাখে কোন
                Function বারবার চলছে। যেটা বারবার চলে, সেটাকে সে চলতে চলতেই
                Machine Code এ অনুবাদ করে রেখে দেয়। এই কারণেই একটা Node সার্ভার
                চালু হওয়ার প্রথম কয়েক সেকেন্ডে একটু ধীর থাকে, আর তারপর গরম
                হয়ে ওঠে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "অনেকেই এখানে অবাক হন",
          content: (
            <p>
              node server.js চালালে যে Process টা তৈরি হয়, সেটা আসলে server.js
              এর Process নয়। সেটা node এর Process, আর আপনার ফাইলটা তার কাছে
              নিছক একটা ইনপুট। ps aux চালালে তাই আপনি node কেই দেখতে পান। এই এক
              কথাটা মনে রাখলে পরে অনেক কিছু সহজ হয়ে যাবে, যেমন সার্ভারে কেন
              Node ইনস্টল করতে হয়, আর Docker Image এ Go এর জন্য কয়েক Megabyte
              যথেষ্ট হলেও Node এর জন্য কেন অনেক বেশি লাগে। Module 10 এ আমরা ঠিক
              এই জায়গা থেকেই শুরু করব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "loading",
      subHeader: { index: "003", title: "Loading" },
      title: <SectionTitle>Kernel ফাইলটা Memory তে সাজায় কীভাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে একটা ব্যাপার আছে যেটা প্রায় সবাইকে অবাক করে। Shell নতুন
                Program টা সরাসরি চালু করে না। সে প্রথমে fork() ডেকে নিজের একটা
                হুবহু কপি বানায়, আর সেই কপিটা নতুন একটা PID পায়। তারপর কপিটা
                exec() ডেকে বলে, আমার ভেতরের সবকিছু মুছে ফেলে ওই ফাইলটা বসিয়ে
                দাও।
              </ContentParagraph>
              <ContentParagraph>
                অর্থাৎ খোলসটা আগে তৈরি হয়, ভেতরের মানুষটা বসে পরে। শুনতে ঘুরপথ
                মনে হলেও এই ফাঁকটা ইচ্ছে করেই রাখা, কারণ ওই দুই ধাপের মাঝখানে
                দাঁড়িয়ে Shell ঠিক করে দিতে পারে নতুন Program টা কোন ফোল্ডারে
                চলবে, কোন Environment Variable পাবে, আর তার Output কোথায় গিয়ে
                জমা হবে।
              </ContentParagraph>
              <ContentParagraph>
                exec() এর পর Kernel ফাইলটার Header পড়ে জেনে নেয় কোন অংশ কোথায়
                বসবে, তারপর Memory টা চার ভাগে সাজিয়ে দেয়। Lesson 03 এ Stack
                আর Heap নিয়ে যা পড়েছেন, ছবিটা ঠিক এখানেই এসে সম্পূর্ণ হয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProcessMemoryDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Text:</strong> আপনার Program এর Machine Code এখানে থাকে।
                অংশটা Read Only, তাই কোনো Bug ভুল করেও আপনার নিজের কোড বদলে দিতে
                পারে না। একই Program এর দুইটা Process চললে Kernel এই অংশটা
                দুইজনকে ভাগ করে দেয়, কারণ কোড তো একই।
              </ListItem>
              <ListItem>
                <strong>Data:</strong> Global Variable আর আগে থেকেই জানা
                সংখ্যাগুলো এখানে বসে। এদের সাইজ চালানোর আগেই জানা থাকে।
              </ListItem>
              <ListItem>
                <strong>Heap:</strong> চলার সময় যা কিছু বানান, মানে Object,
                Array, বড় String, সব এখানে জায়গা পায়। Heap উপরের দিকে বাড়তে
                থাকে।
              </ListItem>
              <ListItem>
                <strong>Stack:</strong> প্রতিটা Function Call এখানে একটা করে থাক
                বসায়, আর Function শেষ হলে থাকটা উঠে যায়। Stack নিচের দিকে
                নামে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "দুইজন মাঝখানে ধাক্কা খেলে",
          content: (
            <p>
              Heap বাড়ে উপরে, Stack নামে নিচে, আর মাঝখানের ফাঁকা জায়গাটা তারা
              ভাগ করে নেয়। এই দুইজন যেদিন এসে ধাক্কা খায়, সেদিন আর জায়গা থাকে
              না। অসীম Recursion লিখলে Stack একাই নামতে নামতে সীমা পেরিয়ে যায়,
              আর তখনই Stack Overflow। আর Object জমতে জমতে Heap ফুরিয়ে গেলে Out
              of Memory।
            </p>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProgramStartLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "syscall",
      subHeader: { index: "004", title: "The Boundary" },
      title: (
        <SectionTitle>আপনার Program নিজে আসলে কম জিনিসই পারে</SectionTitle>
      ),
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা চলতে থাকা Process আসলে খুব সীমিত ক্ষমতা নিয়ে বসে থাকে। সে
                হিসাব করতে পারে, আর নিজের Memory র ভেতরে হাত দিতে পারে। ব্যস,
                এইটুকুই। ফাইল খোলা, Network এ কিছু পাঠানো, ঘড়ির সময় জানা,
                এমনকি পর্দায় একটা লাইন লেখা, এর কোনোটাই সে নিজে করতে পারে না।
              </ContentParagraph>
              <ContentParagraph>
                কারণটা Lesson 05 এ দেখেছেন। ওই জিনিসগুলো সবার ভাগের সম্পত্তি,
                তাই সেখানে হাত দেওয়ার চাবি একমাত্র Kernel এর কাছে থাকে। আপনার
                Program কে তাই প্রতিবার Kernel এর দরজায় গিয়ে কড়া নাড়তে হয়,
                আর সেই কড়া নাড়ার নামই Syscall।
              </ContentParagraph>
              <ContentParagraph>
                নিচের লেখাটা চালিয়ে দেখুন কোন লাইনে কড়া নাড়তে হচ্ছে আর কোন
                লাইনে হচ্ছে না। উপরের বোতামটা দিয়ে কাজের ধরন বদলে দুইটা মিলিয়ে
                দেখলে নিয়মটা নিজেই পরিষ্কার হয়ে যাবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SyscallTraceLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা Syscall এ CPU কে User Mode ছেড়ে Kernel Mode এ যেতে হয়,
              কাজটা করতে হয়, তারপর আবার ফিরে আসতে হয়। এই যাওয়া আসাটা
              মাইক্রোসেকেন্ডের ব্যাপার, কিন্তু সংখ্যাটা লাখে পৌঁছালে সেটাই আপনার
              সার্ভারের সবচেয়ে বড় খরচ হয়ে দাঁড়ায়। এই কারণেই এক Byte করে দশ
              হাজার বার Write করার চেয়ে দশ হাজার Byte একবারে Write করা অনেক
              দ্রুত, যদিও লেখার পরিমাণ দুইটাতেই সমান।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নিজের চোখে দেখতে চাইলে",
          content: (
            <p>
              Linux এ strace দিয়ে আপনি একটা Program এর সব Syscall লাইভ দেখতে
              পারেন। নিচের Lab এ কমান্ডগুলো দেওয়া আছে। একটা ছোট Node Program
              চালিয়ে গুনলে দেখবেন হাজারের উপরে Syscall হয়েছে, আর তার বেশিরভাগই
              ঘটেছে শুরুর সময় Module আর Library খুঁজতে গিয়ে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>Island Tours সার্ভারে চালু হয় কীভাবে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর API একটা VPS এ চলে, আর চালু করার কমান্ডটা দেখতে
                খুব সাধারণ, node dist/main.js। কিন্তু এই এক লাইনের পেছনে উপরের
                পুরো গল্পটাই ঘটে, আর সেখান থেকে কয়েকটা বাস্তব ব্যাপার সরাসরি
                বেরিয়ে আসে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>.env বদলালে সাথে সাথে কিছু হয় না:</strong>{" "}
                  Environment Variable গুলো Process কে দেওয়া হয় exec() এর
                  সময়, একবারের জন্য। তাই সার্ভারে বসে .env ফাইল বদলালে চলতে
                  থাকা Process টা পুরনো মানটাই ধরে রাখে। Restart না দেওয়া
                  পর্যন্ত নতুন মান কার্যকর হয় না, আর নতুন ডেভেলপাররা এখানেই
                  সবচেয়ে বেশি সময় নষ্ট করেন।
                </ListItem>
                <ListItem>
                  <strong>Restart দিলে Memory র সমস্যা মিলিয়ে যায়:</strong>{" "}
                  pm2 restart দিলে পুরনো Process মরে যায় আর একদম নতুন একটা
                  Process জন্ম নেয়, নতুন PID নিয়ে, খালি Heap নিয়ে। তাই Memory
                  Leak সাময়িকভাবে উধাও হয়ে যায়। কিন্তু Leak টা সারেনি, শুধু
                  ঘড়িটা শূন্য থেকে শুরু হয়েছে।
                </ListItem>
                <ListItem>
                  <strong>Exit Code দিয়েই সব ঠিক হয়:</strong> Process মরার
                  সময় একটা সংখ্যা ফেরত দেয়। শূন্য মানে কাজ শেষ করে ভদ্রভাবে
                  বিদায় নিয়েছে, আর শূন্য না হলে কিছু একটা ভেঙেছে। pm2, systemd
                  আর Docker এই সংখ্যাটার দিকেই তাকিয়ে থাকে, আর এর উপর ভিত্তি
                  করেই ঠিক করে আবার চালু করবে কিনা।
                </ListItem>
                <ListItem>
                  <strong>প্রথম Request টা ধীর মনে হয়:</strong> নতুন Process কে
                  শূন্য থেকে শুরু করতে হয়, মানে Library জোড়া লাগাতে হয়,
                  Module পড়তে হয়, আর V8 কে গরম হওয়ার সময় দিতে হয়। এই কারণেই
                  Deploy এর পরের প্রথম কয়েকটা Request তুলনায় ধীর, আর এই একই
                  কারণে Serverless এ Cold Start নিয়ে এত আলোচনা হয়।
                </ListItem>
                <ListItem>
                  <strong>src নয়, dist যায় সার্ভারে:</strong> TypeScript
                  সরাসরি চলে না, তাই Build ধাপে সেটা JavaScript এ অনুবাদ হয়ে
                  dist ফোল্ডারে জমা হয়। সার্ভারে ওই তৈরি ফাইলটাই পাঠানো হয়।
                  এটাও এক ধরনের Compile, শুধু ফল হিসেবে Machine Code এর বদলে
                  আরেকটা ভাষার Text বের হয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "একটা প্রশ্ন, যেটা ইন্টারভিউতে আসে",
          content: (
            <p>
              কেউ যদি জিজ্ঞেস করেন, সার্ভারে কোড আপডেট করার পরেও পুরনো আচরণ কেন
              দেখা যায়, উত্তরটা এখন আপনার হাতেই আছে। চলতে থাকা Process টা পুরনো
              ফাইল থেকে জন্মেছে, আর তার Memory তে পুরনো কোডই বসানো আছে। Disk এ
              ফাইল বদলে দিলে চলতে থাকা Process এর কিছু যায় আসে না, কারণ সে
              জন্মের পর আর ওই ফাইলটার দিকে ফিরেও তাকায় না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "request-flow",
      subHeader: { index: "006", title: "Step-by-step Flow" },
      title: (
        <SectionTitle>Enter চাপার পর প্রথম লাইন ছাপা পর্যন্ত</SectionTitle>
      ),
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো ঘটনাটা একবারে সাজিয়ে দেখুন। মাঝখানের প্রতিটা ধাপে এই মডিউলের
              কোনো না কোনো লেসন কাজে লাগছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Shell আপনার লেখা লাইনটা ভাগ করল",
              description:
                "Shell প্রথমে বুঝে নেয় কোনটা Program এর নাম আর কোনগুলো তার Argument। তারপর PATH ধরে খুঁজে বের করে node ফাইলটা ঠিক কোথায় আছে।",
            },
            {
              title: "fork(), নিজের একটা কপি",
              description:
                "Shell নিজের হুবহু একটা কপি বানায়, আর Kernel সেই কপিকে নতুন একটা PID দেয়। এই মুহূর্তে নতুন Process টা এখনো Shell ই।",
            },
            {
              title: "exec(), ভেতরের মানুষ বদলে গেল",
              description:
                "কপিটা Kernel কে বলে node ফাইলটা বসিয়ে দিতে। Kernel পুরনো Memory মুছে ফেলে, কিন্তু PID টা একই রেখে দেয়।",
            },
            {
              title: "Header পড়ে Segment বসানো",
              description:
                "Kernel ফাইলের শুরুর অংশ পড়ে জেনে নেয় কোথায় কী আছে, তারপর Text আর Data বসিয়ে দেয়, আর একটা নতুন Stack বানিয়ে দেয়।",
            },
            {
              title: "Dynamic Linker জোড়া লাগায়",
              description:
                "node একা চলে না, তার libc আর আরও কয়েকটা Library দরকার। ওগুলো খুঁজে না পেলে এখানেই সব থেমে যায়, আর shared library not found লেখা ওঠে।",
            },
            {
              title: "CPU লাফ দিল Entry Point এ",
              description:
                "Kernel Program Counter কে শুরুর ঠিকানায় বসিয়ে দেয়। এরপর থেকে CPU শুধু Fetch, Decode, Execute করে যায়, ঠিক যেমনটা Lesson 02 এ দেখেছেন।",
            },
            {
              title: "Node এবার আপনার ফাইলটা পড়ে",
              description:
                "এতক্ষণে node দাঁড়িয়ে গেছে। এখন সে server.js খোলে, Parse করে, আর চালাতে শুরু করে। প্রতিটা require এ ফাইল খুঁজতে গিয়ে আরও অনেকগুলো Syscall হয়।",
            },
            {
              title: "প্রথম লাইনটা পর্দায় এলো",
              description:
                "console.log চালালে Node write() Syscall করে, Kernel লেখাটা Terminal এ পাঠায়, আর আপনি ফল দেখতে পান। ওদিকে listen() করা থাকলে Process টা মরে না, সে Request এর অপেক্ষায় বসে থাকে।",
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
                <strong>Computerphile</strong>, Search করুন: What Happens When
                You Run a Program, আর How Compilers Work.{" "}
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
                <strong>Ben Eater</strong>, একটা Program কীভাবে Machine Code
                হয়ে CPU তে চলে, তার হাতে কলমে ব্যাখ্যা।{" "}
                <a
                  href="https://www.youtube.com/@BenEater"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  youtube.com/@BenEater
                </a>
              </ListItem>
              <ListItem>
                <strong>পড়ার জন্য</strong>, man পাতাগুলো নিজেই চমৎকার শিক্ষক।
                Terminal এ লিখুন man fork, তারপর man execve, আর শেষে man strace.
                Module 07 এ Linux নিয়ে বসলে এই তিনটা আবার কাজে লাগবে।
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
                Program মানে Disk এ পড়ে থাকা ফাইল, আর Process মানে সেই ফাইলের
                জ্যান্ত রূপ। একই Program থেকে অনেকগুলো Process চলতে পারে।
              </ListItem>
              <ListItem>
                CPU শুধু Machine Code বোঝে, তাই অনুবাদ কাউকে না কাউকে করতেই হয়।
                Compiled ভাষায় অনুবাদ হয় আগে, একবার। JavaScript এ অনুবাদক Node
                নিজেই, আর সে চলার সময় কাজটা করে।
              </ListItem>
              <ListItem>
                node server.js চালালে Process টা আসলে node এর, আর আপনার ফাইলটা
                তার ইনপুট।
              </ListItem>
              <ListItem>
                Shell আগে fork() দিয়ে নিজের কপি বানায়, তারপর exec() দিয়ে সেই
                কপির ভেতরটা বদলে দেয়। PID টা কিন্তু একই থাকে।
              </ListItem>
              <ListItem>
                exec() এর পর Memory চার ভাগে সাজে, Text, Data, Heap আর Stack।
                Heap বাড়ে উপরে, Stack নামে নিচে।
              </ListItem>
              <ListItem>
                নিজের Memory র বাইরের কিছু ছুঁতে হলে Program কে Syscall করতে
                হয়। প্রতিটা Syscall এ User Mode আর Kernel Mode এর মধ্যে যাওয়া
                আসা হয়, আর সেটার খরচ আছে।
              </ListItem>
              <ListItem>
                Environment Variable Process পায় জন্মের সময়। তাই .env বদলে
                Restart না দিলে কিছুই বদলায় না।
              </ListItem>
              <ListItem>
                পরের মডিউল: এতক্ষণ আমরা একটা মেশিনের ভেতরে ছিলাম। এবার আমরা
                বাইরে বেরিয়ে দেখব দুইটা মেশিন একে অন্যের সাথে কথা বলে কীভাবে।
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
        <span className="font-bold text-primary">Program</span>,
        "Disk এ পড়ে থাকা ফাইল, নিজে থেকে কিছু করে না",
      ],
      [
        <span className="font-bold text-primary">Process</span>,
        "চলতে থাকা Program, নিজের PID আর Memory নিয়ে",
      ],
      [
        <span className="font-bold text-primary">Compile</span>,
        "চালানোর আগেই পুরো Source একবারে অনুবাদ করা",
      ],
      [
        <span className="font-bold text-primary">JIT</span>,
        "চলতে চলতে, যে অংশ বারবার চলে সেটুকু অনুবাদ করা",
      ],
      [
        <span className="font-bold text-primary">fork()</span>,
        "নিজের হুবহু একটা কপি বানানো, নতুন PID সহ",
      ],
      [
        <span className="font-bold text-primary">exec()</span>,
        "PID একই রেখে ভেতরের Program টা বদলে দেওয়া",
      ],
      [
        <span className="font-bold text-primary">Text Segment</span>,
        "Machine Code যেখানে বসে, Read Only",
      ],
      [
        <span className="font-bold text-primary">Syscall</span>,
        "নিজের Memory র বাইরে কিছু করতে Kernel কে অনুরোধ",
      ],
      [
        <span className="font-bold text-primary">Exit Code</span>,
        "মরার সময় ফেরত দেওয়া সংখ্যা, শূন্য মানে সব ঠিক",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একই Program দুইবার চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "দুইটা আলাদা Process হয়, প্রত্যেকের নিজের Memory নিয়ে",
            isCorrect: true,
            explanation:
              "একই রেসিপি থেকে দুই হাঁড়ি রান্না। একজনের Variable বদলালে অন্যজন টের পায় না।",
          },
          {
            key: "B",
            text: "একটাই Process হয়, দ্বিতীয়বার সে আগেরটাতেই যোগ হয়",
            isCorrect: false,
            explanation:
              "প্রতিবার চালালে Kernel নতুন একটা Process বানায়, নতুন PID দিয়ে।",
          },
          {
            key: "C",
            text: "দুইটা Process একই Memory ভাগ করে নেয়",
            isCorrect: false,
            explanation:
              "Thread রা Memory ভাগ করে, Process রা করে না। Lesson 06 এ এই তফাতটাই ছিল।",
          },
        ],
      },
      {
        id: 2,
        text: "node server.js চালালে ps aux তে কোন Program টা দেখা যায়?",
        options: [
          {
            key: "A",
            text: "server.js, কারণ ওটাই তো চলছে",
            isCorrect: false,
            explanation:
              "server.js নিজে চলে না, সে Text হিসেবেই থেকে যায়। তাকে পড়ে কাজটা করে দেয় অন্য একজন।",
          },
          {
            key: "B",
            text: "node, আর server.js তার Argument",
            isCorrect: true,
            explanation:
              "Process টা node এর। এই কারণেই সার্ভারে Node ইনস্টল করা লাগে, আর এই কারণেই Docker Image বড় হয়।",
          },
          {
            key: "C",
            text: "দুইটাই আলাদা Process হিসেবে দেখা যায়",
            isCorrect: false,
          },
        ],
      },
      {
        id: 3,
        text: "সার্ভারে .env ফাইলে নতুন একটা মান বসিয়ে দিলেন, কিন্তু API পুরনো মানই ব্যবহার করছে। কেন?",
        options: [
          {
            key: "A",
            text: "ফাইলটা সেভ হয়নি",
            isCorrect: false,
          },
          {
            key: "B",
            text: "Environment Variable Process পায় exec() এর সময়, তাই Restart ছাড়া বদলায় না",
            isCorrect: true,
            explanation:
              "চলতে থাকা Process টা জন্মের সময় যা পেয়েছিল সেটাই ধরে রেখেছে। নতুন মান পেতে হলে নতুন Process লাগবে।",
          },
          {
            key: "C",
            text: "Node দশ মিনিট পরপর .env আবার পড়ে",
            isCorrect: false,
            explanation:
              "Node নিজে থেকে .env এর দিকে ফিরেও তাকায় না। যে Library টা ওটা পড়ে, সেও পড়ে শুধু একবার, শুরুর সময়।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা Function শুধু সংখ্যা যোগ করে যাচ্ছে, কোনো ফাইল বা Network ছুঁচ্ছে না। এতে কয়টা Syscall হবে?",
        options: [
          {
            key: "A",
            text: "প্রতিটা যোগের জন্য একটা করে",
            isCorrect: false,
            explanation:
              "যোগ করা CPU এর নিজের কাজ। এর জন্য Kernel কে বলার কিছু নেই।",
          },
          {
            key: "B",
            text: "একটাও নয়, কারণ পুরো কাজটা নিজের Memory র ভেতরেই হচ্ছে",
            isCorrect: true,
            explanation:
              "নিয়মটা এটাই। নিজের Memory র ভেতরের কাজে Kernel লাগে না, বাইরের সবকিছুতে লাগে।",
          },
          {
            key: "C",
            text: "Function শুরু আর শেষে দুইটা",
            isCorrect: false,
          },
        ],
      },
      {
        id: 5,
        text: "Memory Leak আছে এমন একটা সার্ভারে pm2 restart দিলেন, আর ব্যবহার নেমে এলো। সমস্যাটা কি সেরে গেল?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, Memory তো কমে গেছে",
            isCorrect: false,
            explanation:
              "পুরনো Process মরে গেছে বলে তার জমানো সব Object ও গেছে। কিন্তু নতুন Process আবার নতুন করে জমাতে শুরু করবে।",
          },
          {
            key: "B",
            text: "না, শুধু নতুন একটা Process খালি Heap নিয়ে শুরু হয়েছে",
            isCorrect: true,
            explanation:
              "Restart সময় কিনে দেয়, সমাধান দেয় না। কোন Object জমছে সেটা খুঁজে বের না করা পর্যন্ত ঘটনাটা ফিরে আসবেই।",
          },
          {
            key: "C",
            text: "হ্যাঁ, কারণ Restart এ Garbage Collector পুরোটা পরিষ্কার করে দেয়",
            isCorrect: false,
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Program কে জ্যান্ত হতে দেখুন",
    subtitle: "Terminal এ চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "ফাইল আর Process পাশাপাশি দেখুন",
        description:
          "Disk এ পড়ে থাকা node ফাইলটা দেখুন, তারপর সেটা থেকে জন্ম নেওয়া Process গুলো দেখুন। একই Program, একাধিক Process।",
      },
      {
        title: "fork আর exec ধরুন",
        description:
          "Shell যে আগে নিজের কপি বানায় আর তারপর Program বদলায়, সেটা নিজের চোখে দেখুন।",
      },
      {
        title: "Syscall গুনুন",
        description:
          "একটা ছোট Program কয়টা Syscall করে গুনে দেখুন, আর তারপর দেখুন এক Byte করে লিখলে সংখ্যাটা কোথায় গিয়ে দাঁড়ায়।",
      },
      {
        title: "Environment জন্মের সময়েই আটকে যায়",
        description:
          "একটা Process চালু রেখে বাইরে থেকে Variable বদলে দেখুন, আর বুঝুন কেন Restart ছাড়া উপায় নেই।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-program-vs-process.sh",
        language: "bash",
        code: `# Disk এ পড়ে থাকা Program টা, মানে নিছক একটা ফাইল
ls -lh $(which node)
file $(which node)          # ELF, মানে Linux এর Executable এর গড়ন

# এবার একই Program থেকে তিনটা Process বানান
node -e 'setTimeout(()=>{},60000)' &
node -e 'setTimeout(()=>{},60000)' &
node -e 'setTimeout(()=>{},60000)' &

ps -o pid,rss,comm -C node   # তিনটা আলাদা PID, তিনটা আলাদা Memory
# macOS এ: ps -o pid,rss,comm | grep node

# খেয়াল করুন, ফাইল একটাই কিন্তু Process তিনটা।
kill %1 %2 %3`,
      },
      {
        filename: "2-fork-and-exec.sh",
        language: "bash",
        code: `# Shell প্রথমে নিজের কপি বানায়, তারপর Program বদলায়

# Linux এ, শুধু এই দুইটা Syscall দেখুন
strace -f -e trace=clone,execve bash -c 'ls' 2>&1 | grep -E 'clone|execve'

# আউটপুটে যা দেখবেন:
#   clone(...)              ← এটাই fork, নতুন Process তৈরি হলো
#   execve("/bin/ls", ...)  ← এইবার ভেতরের Program বদলে গেল

# macOS এ strace নেই। বদলে এটা চালান, আর PID এর দিকে তাকান:
#   echo "Shell এর PID: $$"
#   bash -c 'echo "কপির PID: $$"'
#   exec echo "exec এর পর PID একই থাকে"

# PID একই থাকা মানে খোলসটা বদলায়নি, শুধু ভেতরের মানুষটা বদলেছে।`,
      },
      {
        filename: "3-count-syscalls.sh",
        language: "bash",
        code: `# একটা ছোট Program কয়টা Syscall করে? (Linux)
strace -c -f node -e 'console.log(1)' 2>&1 | tail -20

# শুধু হিসাব, কোনো ফাইল বা Network নেই
strace -c -f node -e 'let t=0; for(let i=0;i<1e7;i++) t+=i;' 2>&1 | tail -5

# এখন খরচটা নিজের চোখে দেখুন: একবারে লেখা, নাকি বারবার
cat > /tmp/buffered.js <<'EOF'
const fs = require('fs');
let out = '';
for (let i = 0; i < 20000; i++) out += i + '\\n';
fs.writeFileSync('/tmp/a.txt', out);          // একটাই write
EOF

cat > /tmp/unbuffered.js <<'EOF'
const fs = require('fs');
const fd = fs.openSync('/tmp/b.txt', 'w');
for (let i = 0; i < 20000; i++) fs.writeSync(fd, i + '\\n');  // ২০০০০ বার
fs.closeSync(fd);
EOF

time node /tmp/buffered.js
time node /tmp/unbuffered.js

# লেখার পরিমাণ সমান, কিন্তু সময় সমান নয়।
# তফাতটা পুরোটাই User Mode আর Kernel Mode এর যাওয়া আসার খরচ।`,
      },
      {
        filename: "4-env-at-exec.js",
        language: "javascript",
        code: `// Environment Variable Process পায় জন্মের সময়, একবার।
setInterval(() => {
  console.log('আমি দেখছি GREETING =', process.env.GREETING ?? '(কিছুই না)');
}, 2000);

// পরীক্ষাটা এভাবে করুন:
//
//   Terminal 1:  GREETING=hello node 4-env-at-exec.js
//   Terminal 2:  export GREETING=bye        ← বাইরে বদলে দিন
//
// Terminal 1 এ তাকিয়ে থাকুন। সে hello ই বলে যাবে, চিরকাল।
// কারণ ওই Process টা জন্মের সময় যা পেয়েছিল, সেটাই তার কাছে সত্যি।
//
// এবার Terminal 1 বন্ধ করে আবার চালান। এবার সে নতুন মান পাবে।
// সার্ভারে .env বদলানোর পর Restart লাগে ঠিক এই কারণেই।`,
      },
    ],
    tip: "তিন নম্বর পরীক্ষাটা সবচেয়ে বেশি শেখায়। দুইটা Script একই পরিমাণ লেখা লেখে, তবু সময়ের তফাত অনেকখানি। এই তফাতটাই আপনাকে মনে করিয়ে দেবে যে Kernel এর দরজায় কড়া নাড়া বিনামূল্যে নয়, আর ভালো কোড কম Syscall এ বেশি কাজ সেরে ফেলে।",
  },
  assignment: {
    title: "Mini Project: আপনার Program এর জন্মবৃত্তান্ত",
    time: "১ - ২ ঘণ্টা",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>জন্মটা ধরুন:</strong> Lab এর দুই নম্বর কমান্ড চালিয়ে clone আর
        execve লাইন দুইটা খুঁজে বের করুন, আর স্ক্রিনশট রেখে দিন। কোন লাইনটা fork
        আর কোনটা exec, নিজের ভাষায় এক লাইনে লিখুন।
      </span>,
      <span key="2">
        <strong>খরচটা মাপুন:</strong> তিন নম্বর Lab এর দুইটা Script চালিয়ে সময়
        দুইটা লিখে রাখুন। কতগুণ তফাত হলো?
      </span>,
      <span key="3">
        <strong>my-tours এ যোগ করুন:</strong> একটা /health Endpoint বানান, যেটা
        process.pid, process.uptime() আর process.version ফেরত দেয়। সার্ভার চালু
        করে দুইবার ডাকুন, তারপর Restart দিয়ে আবার ডাকুন। PID বদলাল কিনা আর
        uptime শূন্য থেকে শুরু হলো কিনা দেখুন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> আপনার my-tours সার্ভারে
        .env বদলানোর পর কী কী করলে নতুন মান কার্যকর হবে, আর কেন শুধু ফাইল সেভ
        করাই যথেষ্ট নয়?
      </span>,
    ],
    deliverables: [
      <span key="1">clone আর execve লাইন দুইটার স্ক্রিনশট</span>,
      <span key="2">দুইটা Script এর সময়ের তুলনা</span>,
      <span key="3">PID আর uptime দেখানো /health Endpoint</span>,
      <span key="4">.env নিয়ে নিজের লেখা ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
