/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CompilerStagesLab,
  ProgramStartLab,
  StopSignalLab,
  SyscallTraceLab,
} from "../../../components/course/topics/program/animations";
import {
  CompileVsInterpretDiagram,
  ExecutableFileDiagram,
  ProcessMemoryDiagram,
  SourceToProcessDiagram,
  VirtualMemoryDiagram,
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
          ঘটনার সারি ঘটে যেখানে উপরের প্রতিটা জিনিস একবার করে কাজে লাগে। এই
          লেসনে আমরা সেই সারিটা ধীরে ধীরে, একটা একটা ধাপ ধরে দেখব, আর প্রতিটা
          ধাপে থেমে জিজ্ঞেস করব, এখানে ঠিক কী হলো, আর কেন হলো।
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
                হয় না। একজন লবণ বেশি দিলে সেটা তাঁর হাঁড়িতেই থাকে, পাশের
                হাঁড়িতে ছড়ায় না।
              </ContentParagraph>
              <ContentParagraph>
                কম্পিউটারে ব্যাপারটা হুবহু এক। আপনার Disk এ server.js নামে যে
                ফাইলটা পড়ে আছে, সেটা Program। সে নিজে থেকে কিছুই করে না, সে
                শুধু কতগুলো Byte, যেমন একটা ছবি বা একটা গানের ফাইলও কতগুলো Byte।
                আপনি যখন তাকে চালান, তখন Memory তে যে জ্যান্ত জিনিসটা তৈরি হয়,
                সেটা Process। একই Program থেকে আপনি দশটা Process চালাতে পারেন,
                আর প্রত্যেকের নিজের নম্বর থাকবে, নিজের Memory থাকবে, নিজের খোলা
                ফাইলের তালিকা থাকবে।
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
              CPU আর Memory ব্যবহারে। একটা মুছে দিলে জায়গা খালি হয়, অন্যটা
              থামিয়ে দিলে কাজ থেমে যায়।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Process এর একটা নম্বর থাকে, যাকে বলে PID, মানে Process
                ID। এটা ঠিক হাসপাতালের টিকিটের নম্বরের মতো। আপনি যখন হাসপাতালে
                ঢোকেন, তখন আপনার নামটা যা ই হোক, ডাক্তার আপনাকে চেনেন ওই নম্বরে।
                দুইজন একই নামের মানুষ থাকতে পারেন, কিন্তু দুইজনের টিকিটের নম্বর
                কখনো এক হয় না। একই কারণে একই node Program এর দশটা Process চললেও
                Kernel তাদের কখনো গুলিয়ে ফেলে না, কারণ দশটার দশটা আলাদা PID।
              </ContentParagraph>
              <ContentParagraph>
                এই তফাতটা মনে রাখলে অনেক গোলমাল এমনিতেই পরিষ্কার হয়ে যায়।
                সার্ভারে কোড আপডেট করার পরেও পুরনো আচরণ দেখতে পাওয়া, একটা
                Program দুইবার চালিয়ে ফেলা, কিংবা Restart দিলে Memory র সমস্যা
                সাময়িকভাবে মিলিয়ে যাওয়া, সবগুলোরই ব্যাখ্যা এই এক জায়গায়।
                লেসনের শেষে এসে আপনি এই তিনটাই নিজের ভাষায় ব্যাখ্যা করতে
                পারবেন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "translation",
      subHeader: { index: "002", title: "Translation" },
      title: <SectionTitle>CPU আপনার কোড পড়তে পারে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 02 এ দেখেছেন CPU কেবল কয়েকটা নির্দিষ্ট Instruction বোঝে,
                যেমন দুইটা সংখ্যা যোগ করা, বা একটা ঠিকানা থেকে মান তুলে আনা।
                আপনার লেখা if শব্দটা তার কাছে কোনো মানেই বহন করে না। ব্যাপারটা
                ঠিক এমন, আপনি একজন মানুষকে বাংলায় একটা চিঠি দিলেন, কিন্তু সে
                শুধু জাপানি পড়তে পারে। চিঠিটা যত সুন্দর করেই লেখা হোক, মাঝখানে
                একজন অনুবাদক না থাকলে কিছুই হবে না।
              </ContentParagraph>
              <ContentParagraph>
                তাই প্রশ্নটা কোনোদিনই এটা নয় যে অনুবাদ হবে কিনা। অনুবাদ হবেই,
                কারণ CPU অন্য কোনো ভাষা জানে না। প্রশ্নটা শুধু এটুকুই, অনুবাদটা
                কখন হবে। আগেই একবার হয়ে যাবে, নাকি চলার সময় বারবার হবে? এই
                একটা প্রশ্নের উত্তরেই ভাষাগুলো দুই ভাগ হয়ে গেছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SourceToProcessDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              অনুবাদটা ভেতরে ভেতরে কীভাবে হয়, সেটা একবার নিজের চোখে দেখা ভালো।
              নিচের ছোট্ট লাইনটাকে ধাপে ধাপে সংখ্যা হয়ে যেতে দেখুন। প্রতিটা
              ধাপে জিনিসটা মানুষের ভাষা থেকে একটু দূরে সরে, আর CPU এর ভাষার দিকে
              একটু এগিয়ে যায়।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CompilerStagesLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              উপরের ধাপগুলো সব ভাষাতেই ঘটে। তফাত শুধু এটুকু, কেউ এই কাজটা আপনার
              মেশিনে একবার করে রাখে, আর কেউ ইউজারের মেশিনে প্রতিবার করে। নিচের
              দুই পাশে দুই রাস্তাটা পাশাপাশি দেখুন।
            </ContentParagraph>
          ),
        },
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
                ঠিক যেমন একটা বই বাংলায় অনুবাদ হয়ে গেলে পাঠকের আর মূল ভাষা
                জানার দরকার পড়ে না।
              </ListItem>
              <ListItem>
                <strong>JavaScript বা Python:</strong> এখানে আপনার ফাইলটা Text
                হিসেবেই থেকে যায়। চালানোর সময় Node নামের একটা Program সেটা
                পড়ে, বোঝে, আর কাজটা করে দেয়। Node নিজে C++ এ লেখা একটা
                Compiled Program, তাই সে CPU এর ভাষা জানে। এটা যেন পাঠকের পাশে
                একজন দোভাষী বসে থাকেন, যিনি লাইন ধরে ধরে পড়ে শোনান।
              </ListItem>
              <ListItem>
                <strong>মাঝখানের চালাকিটা, JIT:</strong> V8 খেয়াল রাখে কোন
                Function বারবার চলছে। যেটা বারবার চলে, সেটাকে সে চলতে চলতেই
                Machine Code এ অনুবাদ করে রেখে দেয়, যাতে পরের বার আর দোভাষী
                লাগে না। এই কারণেই একটা Node সার্ভার চালু হওয়ার প্রথম কয়েক
                সেকেন্ডে একটু ধীর থাকে, আর তারপর গরম হয়ে ওঠে।
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
              নিছক একটা ইনপুট, যেমন একটা ছবি Photoshop এর ইনপুট। ps aux চালালে
              তাই আপনি node কেই দেখতে পান। এই এক কথাটা মনে রাখলে পরে অনেক কিছু
              সহজ হয়ে যাবে, যেমন সার্ভারে কেন Node ইনস্টল করতে হয়, আর Docker
              Image এ Go এর জন্য কয়েক Megabyte যথেষ্ট হলেও Node এর জন্য কেন
              অনেক বেশি লাগে। Module 10 এ আমরা ঠিক এই জায়গা থেকেই শুরু করব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "the-file",
      subHeader: { index: "003", title: "The File" },
      title: <SectionTitle>চালানোর ফাইলটার ভেতরে কী আছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনুবাদ শেষে যে ফাইলটা তৈরি হয়, সেটা শুধু Machine Code এর একটা
                স্তূপ নয়। একটা বইয়ের কথা ভাবুন। বইয়ের মলাটে নাম লেখা থাকে,
                তারপর একটা সূচিপত্র থাকে, আর তারপর অধ্যায়গুলো থাকে। চালানোর
                ফাইলও ঠিক এভাবে সাজানো, আর সাজানোর একটা কারণ আছে। Kernel কে
                ফাইলটা পুরো পড়ে বোঝার দরকার হয় না, সে শুরুতে মলাট আর সূচিপত্র
                দেখেই জেনে যায় কোন অংশ Memory র কোথায় বসাতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                Linux এ এই ফাইলের গড়নটার নাম ELF। নামটা মনে রাখার দরকার নেই,
                কিন্তু একটা ব্যাপার মজার। প্রতিটা ELF ফাইলের প্রথম চারটা Byte
                সবসময় একই, আর তার ভেতরে তিনটা Byte মিলে লেখা থাকে E, L, F এই
                তিনটা অক্ষর। Kernel চালানোর আগে শুধু এই চারটা Byte দেখে, আর
                মিললেই বুঝে যায়, হ্যাঁ, এটা চালানোর ফাইল। Lesson 01 এ যেমন
                দেখেছেন, একটা ছবির ফাইলও ঠিক এভাবে শুরুতে নিজের নাম বলে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ExecutableFileDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির শেষ খোপটা, .bss, এই লেসনের সবচেয়ে সুন্দর ছোট্ট চালাকিটা
                দেখায়। ধরুন আপনার Program এ দশ লক্ষ সংখ্যার একটা তালিকা আছে,
                যার সবগুলো শুরুতে শূন্য। ফাইলে দশ লক্ষ শূন্য লিখে রাখলে ফাইলটা
                অকারণে বিশাল হয়ে যেত। তার বদলে ফাইলে শুধু একটা লাইন লেখা থাকে,
                আমাকে এতটুকু ফাঁকা জায়গা দাও। Kernel চালানোর সময় ওই জায়গাটা
                বানিয়ে শূন্য দিয়ে ভরে দেয়। ফাইল ছোট থাকে, কাজও হয়।
              </ContentParagraph>
              <ContentParagraph>
                আর Entry Point এর কথাটা মনে রাখুন। এটা ফাইলের ভেতরে লেখা একটা
                ঠিকানা, যেটা বলে দেয় শুরুটা কোথা থেকে হবে। বইয়ের ভূমিকায় যেমন
                লেখা থাকে, পড়া শুরু করুন ১২ নম্বর পাতা থেকে। কয়েক ধাপ পরে CPU
                ঠিক এই ঠিকানাতেই লাফ দেবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নিজের চোখে দেখুন, এক লাইনে",
          content: (
            <p>
              Linux বা macOS এর Terminal এ লিখুন xxd $(which node) | head -1.
              প্রথম লাইনে দেখবেন 7f45 4c46, আর ডান পাশে .ELF লেখা। macOS এ
              ফাইলের গড়ন আলাদা, নাম Mach-O, তাই শুরুর সংখ্যাগুলোও আলাদা হবে,
              কিন্তু ধারণাটা হুবহু এক। ফাইল নিজের শুরুতেই বলে দেয় সে কী।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "fork-exec",
      subHeader: { index: "004", title: "Birth" },
      title: <SectionTitle>Enter চাপার পর Shell ঠিক কী করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Terminal এ আপনি যা লেখেন, সেটা পড়ে একটা Program, যার নাম Shell।
                bash বা zsh, দুইটাই Shell। আপনি node server.js লিখে Enter চাপলে
                Shell প্রথমে লাইনটাকে শব্দে ভাগ করে। প্রথম শব্দটা, node, হলো কোন
                Program চালাতে হবে তার নাম। বাকি শব্দগুলো, এখানে server.js, হলো
                ওই Program কে দেওয়া কথা, যাকে বলে Argument।
              </ContentParagraph>
              <ContentParagraph>
                তারপর Shell খোঁজে node নামের ফাইলটা ঠিক কোথায় আছে। সে সারা Disk
                খোঁজে না, শুধু কয়েকটা নির্দিষ্ট ফোল্ডার খোঁজে, আর ওই ফোল্ডারের
                তালিকাটার নাম PATH। এই কারণেই মাঝে মাঝে আপনি একটা জিনিস ইনস্টল
                করেন, তবু Terminal বলে command not found। ফাইলটা আছে, কিন্তু
                PATH এর ফোল্ডারগুলোর একটাতেও নেই, তাই Shell তাকে খুঁজে পায়নি।
              </ContentParagraph>
              <ContentParagraph>
                এবার আসে সেই ব্যাপারটা যেটা প্রায় সবাইকে অবাক করে। Shell নতুন
                Program টা সরাসরি চালু করে না। সে প্রথমে নিজের একটা হুবহু কপি
                বানায়, আর কপিটা একটা নতুন PID পায়। এই কাজটার নাম fork। তারপর
                ওই কপিটা Kernel কে বলে, আমার ভেতরের সবকিছু মুছে ফেলে ওই node
                ফাইলটা বসিয়ে দাও। এই কাজটার নাম exec।
              </ContentParagraph>
              <ContentParagraph>
                একটা উদাহরণে ভাবুন। একটা দোকানের মালিক একটা নতুন শাখা খুলতে চান।
                তিনি প্রথমে নিজের দোকানের হুবহু একটা কপি বানান, একই সাজ, একই
                নিয়ম, একই ঠিকানার খাতা। তারপর ওই নতুন দোকানের ভেতরের সব মাল
                সরিয়ে একদম অন্য জিনিস তুলে দেন। দোকানের লাইসেন্স নম্বরটা কিন্তু
                বদলায় না। খোলসটা রয়ে গেল, ভেতরের মালটা বদলে গেল। fork হলো কপি
                বানানো, exec হলো ভেতরের মাল বদলানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "ঘুরপথটা ইচ্ছে করেই রাখা",
          content: (
            <p>
              শুনতে ঘুরপথ মনে হয়, কেন সরাসরি নতুন Program চালু না করে আগে কপি
              বানানো? কারণ fork আর exec এর মাঝখানে একটা ফাঁক থাকে, আর ওই ফাঁকে
              দাঁড়িয়ে Shell নতুন Program টার জন্য অনেক কিছু ঠিক করে দিতে পারে।
              কোন ফোল্ডারে চলবে। কোন Environment Variable পাবে। তার লেখা Output
              পর্দায় যাবে, নাকি একটা ফাইলে জমা হবে। আপনি যখন node server.js
              &gt; log.txt লেখেন, তখন ওই মাঝের ফাঁকেই Shell পর্দার বদলে ফাইলটা
              বসিয়ে দেয়, আর node কিছু টেরও পায় না। তার কাছে সে পর্দাতেই
              লিখছে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের গল্পটা Play করে দেখুন। ডান পাশে Memory র চারটা খোপ আছে, আর
              তার উপরে PID। তিন নম্বর ধাপে খেয়াল করুন, Memory পুরো খালি হয়ে
              গেল, কিন্তু PID টা একই রইল। এটাই exec। খোলসটা থাকে, ভেতরের মানুষটা
              বদলে যায়।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProgramStartLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "loading",
      subHeader: { index: "005", title: "Loading" },
      title: <SectionTitle>Kernel ফাইলটা Memory তে সাজায় কীভাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                exec এর পর Kernel ফাইলটার শুরুর অংশ, মানে সেই মলাট আর সূচিপত্র
                পড়ে জেনে নেয় কোন অংশ কোথায় বসবে। তারপর Memory টা চার ভাগে
                সাজিয়ে দেয়। Lesson 03 এ Stack আর Heap নিয়ে যা পড়েছেন, ছবিটা
                ঠিক এখানে এসে সম্পূর্ণ হয়, কারণ এবার আপনি দেখবেন ওই দুইটা কোথা
                থেকে আসে আর তাদের পাশে আর কী কী থাকে।
              </ContentParagraph>
              <ContentParagraph>
                একটা ফ্ল্যাটে ওঠার কথা ভাবুন। ট্রাক থেকে মাল নামানোর আগেই আপনি
                জানেন কোনটা কোন ঘরে যাবে। বইগুলো পড়ার ঘরে, বাসনপত্র রান্নাঘরে,
                আর দুইটা ঘর আপাতত খালি থাকবে, পরে দরকার মতো ভরা হবে। Kernel ঠিক
                এই কাজটাই করে। কোডটা তার ঘরে, জানা সংখ্যাগুলো তাদের ঘরে, আর
                দুইটা ঘর খালি রেখে দেয় পরে ভরার জন্য।
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
                অংশটা Read Only, মানে এখানে শুধু পড়া যায়, লেখা যায় না। তাই
                কোনো Bug ভুল করেও আপনার নিজের কোড বদলে দিতে পারে না। আর একটা
                সুন্দর ব্যাপার, একই Program এর দুইটা Process চললে Kernel এই
                অংশটা দুইজনকে ভাগ করে দেয়। কোড তো একই, তাই দুইবার রাখার দরকার
                কী।
              </ListItem>
              <ListItem>
                <strong>Data:</strong> Global Variable আর আগে থেকেই জানা
                সংখ্যাগুলো এখানে বসে। এদের সাইজ চালানোর আগেই জানা থাকে, তাই
                ফাইলের সূচিপত্রে লেখাই থাকে এতটুকু জায়গা লাগবে।
              </ListItem>
              <ListItem>
                <strong>Heap:</strong> চলার সময় যা কিছু বানান, মানে Object,
                Array, বড় String, সব এখানে জায়গা পায়। আগে থেকে জানা যায় না
                কতটুকু লাগবে, তাই এটা শুরুতে ছোট থাকে আর দরকার মতো উপরের দিকে
                বাড়তে থাকে।
              </ListItem>
              <ListItem>
                <strong>Stack:</strong> প্রতিটা Function Call এখানে একটা করে থাক
                বসায়, আর Function শেষ হলে থাকটা উঠে যায়। ঠিক যেমন থালার উপরে
                থালা রাখেন, আর উপরেরটাই আগে তোলেন। Stack নিচের দিকে নামে।
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
              না। কোনো Function যদি নিজেকেই বারবার ডাকতে থাকে আর থামার শর্ত না
              পায়, তাহলে Stack একাই নামতে নামতে সীমা পেরিয়ে যায়, আর তখনই সেই
              চেনা এরর, Stack Overflow। আর Object জমতে জমতে Heap ফুরিয়ে গেলে
              Out of Memory। দুইটা এররের জন্ম একই ছবি থেকে, শুধু দুই দিক থেকে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "virtual-memory",
      subHeader: { index: "006", title: "The Illusion" },
      title: (
        <SectionTitle>প্রত্যেক Process ভাবে পুরো মেশিন তার একার</SectionTitle>
      ),
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে একটা প্রশ্ন আসে যেটা খুব স্বাভাবিক। আপনার মেশিনে এখন
                একসাথে পঞ্চাশটা Process চলছে। উপরের ছবিতে প্রত্যেকের Text অংশ
                একই ঠিকানায় বসে। তাহলে পঞ্চাশটা Process একই ঠিকানায় থাকে
                কীভাবে? একই জায়গায় তো দুইজন থাকতে পারে না।
              </ContentParagraph>
              <ContentParagraph>
                উত্তরটা একটা চালাকি, আর চালাকিটা করে Kernel। একটা হোটেলের কথা
                ভাবুন যেখানে প্রতিটা তলায় একটা ১০১ নম্বর ঘর আছে। দুই তলার ১০১
                নম্বর ঘরের অতিথি আর তিন তলার ১০১ নম্বর ঘরের অতিথি, দুইজনই বলেন
                আমি ১০১ এ থাকি, আর দুইজনই ঠিক বলেন। কিন্তু দুইজন এক ঘরে নেই।
                ঘরের নম্বর একই, ঘর আলাদা। রিসেপশনের কাছে একটা খাতা আছে যেটা বলে
                দেয় কোন অতিথির ১০১ আসলে কোন তলায়।
              </ContentParagraph>
              <ContentParagraph>
                Process যে ঠিকানা দেখে, সেটা ঘরের নম্বর। RAM এ সেই জিনিসটা আসলে
                যেখানে আছে, সেটা তলা সহ আসল ঠিকানা। আর রিসেপশনের খাতাটা Kernel
                রাখে, প্রতিটা Process এর জন্য একটা করে আলাদা। Process যতবার কোনো
                ঠিকানায় হাত দেয়, ততবার মাঝখানে বসে ঠিকানাটা বদলে যায়, আর
                Process টা কিছু টেরও পায় না। সে সারাজীবন বিশ্বাস করে থাকে পুরো
                Memory তার একার।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <VirtualMemoryDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই চালাকির নাম Virtual Memory, আর এটা দুইটা বড় উপকার করে যেটা
                আপনি প্রতিদিন পান কিন্তু কখনো খেয়াল করেন না। প্রথমত, এক Process
                অন্য Process এর Memory তে হাত দিতে পারে না, কারণ তার খাতায় ওই
                তলাটাই নেই। Browser Crash করলে আপনার Editor বেঁচে থাকে এই
                কারণেই। দ্বিতীয়ত, Program লেখার সময় আপনাকে ভাবতেই হয় না
                মেশিনে আর কে চলছে। আপনি লেখেন যেন মেশিন আপনার একার, আর Kernel
                বাকি হিসাবটা সামলে নেয়।
              </ContentParagraph>
              <ContentParagraph>
                Lesson 05 এ RAM ফুরিয়ে গেলে Kernel কী করে সেটা দেখেছেন, Disk এর
                একটা অংশকে RAM এর মতো ব্যবহার করা। সেটাও এই খাতার জোরেই সম্ভব।
                খাতায় লেখা থাকতে পারে, এই ঘরটা আপাতত Disk এ রাখা আছে, কেউ চাইলে
                তুলে এনো। Process টা শুধু দেখে জিনিসটা একটু ধীরে এলো, কেন এলো সে
                জানে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Segmentation Fault মানে কী",
          content: (
            <p>
              C বা Rust এর কোড লিখতে গিয়ে কখনো segmentation fault দেখলে এবার
              বুঝবেন সেটা কী। Process এমন একটা ঠিকানায় হাত দিতে গেছে যেটা তার
              খাতায় নেই, মানে হোটেলের এমন একটা ঘরে ঢুকতে চেয়েছে যেটা তাকে
              দেওয়াই হয়নি। Kernel সাথে সাথে তাকে থামিয়ে দেয়। Node এ আপনি এটা
              প্রায় কখনোই দেখবেন না, কারণ V8 আগে থেকেই আপনার ঠিকানার হিসাব
              পাহারা দেয়। কিন্তু ভেতরে নিয়মটা একই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "syscall",
      subHeader: { index: "007", title: "The Boundary" },
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
                একটা হোটেলের ঘরের অতিথির কথা ভাবুন। নিজের ঘরের ভেতরে তিনি যা
                খুশি করতে পারেন। কিন্তু খাবার চাইলে, তোয়ালে চাইলে, বা বাইরে ফোন
                করতে চাইলে তাঁকে রিসেপশনে ফোন করতে হয়। রান্নাঘরে তিনি নিজে
                ঢুকতে পারেন না, কারণ রান্নাঘরটা সব অতিথির, আর একজন ঢুকে গোলমাল
                করলে সবার খাবার নষ্ট হবে।
              </ContentParagraph>
              <ContentParagraph>
                Process এর জন্য Kernel ই সেই রিসেপশন। ফাইল, Disk, Network,
                পর্দা, এগুলো সবার ভাগের সম্পত্তি, তাই সেখানে হাত দেওয়ার চাবি
                একমাত্র Kernel এর কাছে থাকে, Lesson 05 এ ঠিক এটাই দেখেছেন। আপনার
                Program কে তাই প্রতিবার Kernel এর দরজায় গিয়ে কড়া নাড়তে হয়,
                আর সেই কড়া নাড়ার নামই Syscall, মানে System Call।
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
            <div className="space-y-6">
              <ContentParagraph>
                আপনি হয়তো ভাবছেন, আমি তো fs.readFileSync লিখি, কোনো Syscall
                লিখি না। ঠিক। মাঝখানে কয়েকটা স্তর থাকে। আপনি Node কে বলেন, Node
                তার ভেতরের C++ কোডকে বলে, সেই কোড libc নামের একটা Library কে
                বলে, আর libc শেষমেশ Kernel এর দরজায় কড়া নাড়ে। আপনি রিসেপশনে
                ফোন করেন, রিসেপশন রান্নাঘরে জানায়, রান্নাঘর ভাণ্ডার থেকে জিনিস
                আনে। কিন্তু স্তর যতগুলোই থাকুক, শেষ ধাপটা সবসময় একই। কড়া না
                নাড়লে ফাইল খোলে না।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা Syscall এ CPU কে User Mode ছেড়ে Kernel Mode এ যেতে হয়,
                কাজটা করতে হয়, তারপর আবার ফিরে আসতে হয়। এই যাওয়া আসাটা
                মাইক্রোসেকেন্ডের ব্যাপার, কিন্তু সংখ্যাটা লাখে পৌঁছালে সেটাই
                আপনার সার্ভারের সবচেয়ে বড় খরচ হয়ে দাঁড়ায়। এই কারণেই এক Byte
                করে দশ হাজার বার Write করার চেয়ে দশ হাজার Byte একবারে Write করা
                অনেক দ্রুত, যদিও লেখার পরিমাণ দুইটাতেই সমান। দশ হাজার বার
                রিসেপশনে ফোন করার চেয়ে একবার ফোন করে দশ হাজার জিনিস চাওয়া সহজ।
              </ContentParagraph>
            </div>
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
              ঘটেছে শুরুর সময় Module আর Library খুঁজতে গিয়ে। আপনার নিজের কোড
              চলার আগেই Node একা একা হাজারবার কড়া নেড়ে ফেলে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "signals",
      subHeader: { index: "008", title: "Signals" },
      title: <SectionTitle>Ctrl+C চাপলে আসলে কী হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Syscall হলো Process এর দিক থেকে Kernel কে কিছু বলা। এবার উল্টো
                দিকটা দেখুন। Kernel যখন Process কে কিছু বলতে চায়, তখন সে কী
                করে? Process তো নিজের কাজে ব্যস্ত, সে Kernel এর দিকে তাকিয়ে বসে
                নেই।
              </ContentParagraph>
              <ContentParagraph>
                আপনি নিজে এই ব্যাপারটা প্রতিদিন ঘটান, শুধু জানেন না। Terminal এ
                একটা Program চলছে, আপনি Ctrl+C চাপলেন, আর সেটা থেমে গেল। কিন্তু
                ভাবুন, Program টা তো আপনার Keyboard এর দিকে তাকিয়ে ছিল না।
                তাহলে সে থামল কীভাবে?
              </ContentParagraph>
              <ContentParagraph>
                ঘটনাটা এরকম। Ctrl+C চাপার খবরটা Kernel পায়। Kernel তখন ওই
                Process কে একটা ছোট্ট বার্তা পাঠায়, যার নাম Signal। এটা দরজায়
                টোকা দেওয়ার মতো, যেখানে টোকার ধরন বলে দেয় কথাটা কী। Process যা
                ই করছিল, সেটা এক মুহূর্ত থামিয়ে Kernel তাকে জানায়, একটা
                বার্তা এসেছে। Ctrl+C এর বার্তাটার নাম SIGINT, আর তার মানে
                হলো, ইউজার আপনাকে থামতে বলছেন।
              </ContentParagraph>
              <ContentParagraph>
                এখন আসল কথাটা। Process বার্তা পেয়ে দুইটা কাজ করতে পারে। সে যদি
                আগে থেকে বলে রাখে, এই বার্তা এলে আমার এই Function টা চালিও,
                তাহলে Kernel ঠিক সেটাই চালায়। এই Function টার নাম Handler। আর
                সে যদি কিছু বলে না রাখে, তাহলে Kernel তার ডিফল্ট নিয়ম মানে, আর
                বেশিরভাগ বার্তার ডিফল্ট নিয়ম হলো, Process কে সাথে সাথে মেরে
                ফেলা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Signal", "কখন আসে", "ধরা যায়?", "সহজ কথায়"],
          rows: [
            [
              <span className="font-mono font-bold text-primary">SIGINT</span>,
              "Terminal এ Ctrl+C চাপলে",
              "হ্যাঁ",
              "ইউজার থামতে বলছেন",
            ],
            [
              <span className="font-mono font-bold text-primary">SIGTERM</span>,
              "pm2 stop, docker stop, kill চালালে",
              "হ্যাঁ",
              "ভদ্রভাবে বলা, কাজ গুছিয়ে বেরিয়ে আসুন",
            ],
            [
              <span className="font-mono font-bold text-primary">SIGKILL</span>,
              "kill -9 চালালে",
              "না, কোনোভাবেই না",
              "বিদ্যুৎ কেটে দেওয়া, কোনো সুযোগ নেই",
            ],
            [
              <span className="font-mono font-bold text-primary">SIGSEGV</span>,
              "ভুল ঠিকানায় হাত দিলে",
              "হ্যাঁ, কিন্তু ধরা উচিত নয়",
              "সেই Segmentation Fault",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সার্ভারের জন্য এই টেবিলের মাঝের দুইটা লাইন সবচেয়ে গুরুত্বপূর্ণ,
              আর কেন, সেটা নিচের লাবে নিজের চোখে দেখুন। একই সার্ভার, একই দুইজন
              ইউজার, শুধু থামানোর ধরন আলাদা। ফলটা তিন কলামে পাশাপাশি।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StopSignalLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এই কারণেই Graceful Shutdown লিখতে হয়",
          content: (
            <p>
              মাঝের কলামের কাজটাকে বলে Graceful Shutdown, মানে ভদ্রভাবে বন্ধ
              হওয়া। কোডে এটা মাত্র কয়েক লাইন, process.on এ SIGTERM ধরে নতুন
              Request নেওয়া বন্ধ করা, হাতে থাকা কাজগুলো শেষ করা, তারপর Database
              এর Connection বন্ধ করে বেরিয়ে আসা। এই কয়েক লাইন না থাকলে প্রতিটা
              Deploy এ কয়েকজন ইউজারের Request মাঝপথে মরে, আর Log এ তার কোনো
              চিহ্নও থাকে না, কারণ Log লেখার আগেই Process টা নেই। Module 08 এ
              Node এর ভেতরে ঢুকে এই কোডটা আমরা লাইন ধরে লিখব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "exit",
      subHeader: { index: "009", title: "Death" },
      title: <SectionTitle>শেষে একটা সংখ্যা, আর সেটা সবাই পড়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Process যেভাবেই শেষ হোক, নিজে থেকে কাজ শেষ করে, কোনো Signal
                এ, বা কোনো ভুলে, শেষ মুহূর্তে সে Kernel কে একটা সংখ্যা দিয়ে
                যায়। এই সংখ্যাটার নাম Exit Code। নিয়মটা খুব সরল। শূন্য মানে সব
                ঠিক ছিল, কাজ শেষ করে বিদায় নিয়েছি। শূন্য ছাড়া অন্য কিছু মানে
                কিছু একটা ভেঙেছে, আর সংখ্যাটা একটা ইঙ্গিত দেয় কী ভেঙেছে।
              </ContentParagraph>
              <ContentParagraph>
                ছোট্ট এই সংখ্যাটা কেন এত গুরুত্বপূর্ণ? কারণ মানুষ পড়ে না,
                Program পড়ে। pm2, systemd, Docker, GitHub Actions, এরা সবাই
                আপনার Program শেষ হওয়ার পর প্রথমেই এই সংখ্যাটার দিকে তাকায়।
                শূন্য দেখলে তারা ধরে নেয় সব ভালো। অন্য কিছু দেখলে তারা
                সিদ্ধান্ত নেয়, আবার চালু করব, নাকি Deploy থামিয়ে দেব, নাকি
                কাউকে খবর দেব। আপনার Test যদি ভুল Exit Code দেয়, তাহলে ভাঙা
                কোডও সবুজ টিক পেয়ে Production এ চলে যাবে।
              </ContentParagraph>
              <ContentParagraph>
                Process মরার পর Kernel তার সব জিনিস ফেরত নিয়ে নেয়। Memory খালি
                হয়, খোলা ফাইলগুলো বন্ধ হয়, Network এর Port ছেড়ে দেওয়া হয়,
                আর PID টা আবার অন্য কাউকে দেওয়ার জন্য খালি হয়ে যায়। হোটেলের
                অতিথি চলে গেলে ঘর পরিষ্কার হয়, আর ওই ঘরের চাবি পরের অতিথির জন্য
                তৈরি থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "exit-code.sh",
          code: `# শেষ Program টার Exit Code দেখার উপায়, Shell এর $? এ জমা থাকে
node -e 'console.log("সব ঠিক")'
echo $?          # 0

node -e 'process.exit(3)'
echo $?          # 3, আপনি নিজে যেটা দিয়েছেন

node -e 'throw new Error("ভাঙল")' 2>/dev/null
echo $?          # 1, না ধরা Error এ Node নিজে থেকে 1 দেয়

node -e 'setTimeout(()=>{}, 100000)' &
kill -9 $!       # SIGKILL
wait $!
echo $?          # 137, মানে 128 + 9, Signal নম্বর 9 এ মরেছে

# && এর পুরো জাদুটা এই সংখ্যার উপর দাঁড়িয়ে। বাম পাশ 0 দিলে তবেই ডান পাশ চলে।
npm test && npm run deploy`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "137 সংখ্যাটা মুখস্থ রাখুন",
          content: (
            <p>
              Docker বা Kubernetes এ কখনো একটা Container Exit Code 137 দিয়ে
              মরতে দেখলে এবার আপনি জানেন সেটা কী। 128 যোগ 9, মানে SIGKILL। আর
              Container এ SIGKILL সবচেয়ে বেশি আসে একটা কারণে, Memory র সীমা
              পেরিয়ে যাওয়া। Kernel দেখে Container টা তার ভাগের চেয়ে বেশি RAM
              নিচ্ছে, আর সাথে সাথে তাকে মেরে দেয়। তাই 137 দেখলে প্রথম প্রশ্নটা
              হবে, Memory কতটুকু দিয়েছিলাম, আর লাগছে কতটুকু।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "project",
      subHeader: { index: "010", title: "Project Example" },
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
                বেরিয়ে আসে, যেগুলোর প্রত্যেকটা একদিন আপনার নিজের সার্ভারে ঘটবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>.env বদলালে সাথে সাথে কিছু হয় না:</strong>{" "}
                  Environment Variable গুলো Process কে দেওয়া হয় fork আর exec
                  এর মাঝের সেই ফাঁকে, একবারের জন্য। তাই সার্ভারে বসে .env ফাইল
                  বদলালে চলতে থাকা Process টা পুরনো মানটাই ধরে রাখে। Restart না
                  দেওয়া পর্যন্ত নতুন মান কার্যকর হয় না, আর নতুন ডেভেলপাররা
                  এখানেই সবচেয়ে বেশি সময় নষ্ট করেন।
                </ListItem>
                <ListItem>
                  <strong>Restart দিলে Memory র সমস্যা মিলিয়ে যায়:</strong>{" "}
                  pm2 restart দিলে পুরনো Process মরে যায় আর একদম নতুন একটা
                  Process জন্ম নেয়, নতুন PID নিয়ে, খালি Heap নিয়ে। তাই Memory
                  Leak সাময়িকভাবে উধাও হয়ে যায়। কিন্তু Leak টা সারেনি, শুধু
                  ঘড়িটা শূন্য থেকে শুরু হয়েছে। ফাটা বালতি বদলে নতুন বালতি নিলে
                  পানি ধরে, কিন্তু ফাটলটা কেন হলো সেটা জানা হলো না।
                </ListItem>
                <ListItem>
                  <strong>Deploy এ SIGTERM ধরা আছে:</strong> Island Tours এর
                  main.ts এ process.on দিয়ে SIGTERM ধরা আছে। নতুন Version চালু
                  করার সময় pm2 পুরনো Process কে SIGTERM পাঠায়, পুরনোটা হাতের
                  Booking গুলো শেষ করে বেরিয়ে যায়, আর কোনো ইউজার মাঝপথে আটকে
                  থাকেন না। এই কয়েক লাইন লেখার আগে প্রতিটা Deploy এ দুই একটা
                  Payment অর্ধেক হয়ে থাকত।
                </ListItem>
                <ListItem>
                  <strong>Exit Code দিয়েই pm2 সিদ্ধান্ত নেয়:</strong> Process
                  শূন্য ছাড়া অন্য কিছু দিয়ে মরলে pm2 ধরে নেয় সে Crash করেছে,
                  আর সাথে সাথে আবার চালু করে। কিন্তু বারবার Crash করলে pm2 একটু
                  থেমে থেমে চেষ্টা করে, নাহলে একটা ভাঙা Program সেকেন্ডে শতবার
                  জন্ম নিয়ে মেশিনটাই বসিয়ে দিত।
                </ListItem>
                <ListItem>
                  <strong>প্রথম Request টা ধীর মনে হয়:</strong> নতুন Process কে
                  শূন্য থেকে শুরু করতে হয়, Library জোড়া লাগাতে হয়, Module
                  পড়তে হয়, আর V8 কে গরম হওয়ার সময় দিতে হয়। এই কারণেই Deploy
                  এর পরের প্রথম কয়েকটা Request তুলনায় ধীর, আর এই একই কারণে
                  Serverless এ Cold Start নিয়ে এত আলোচনা হয়।
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
              জন্মের পর আর ওই ফাইলটার দিকে ফিরেও তাকায় না। রাঁধুনি একবার রেসিপি
              পড়ে রান্না শুরু করার পর আপনি বইয়ের পাতা বদলে দিলে হাঁড়ির খাবার
              বদলায় না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "request-flow",
      subHeader: { index: "011", title: "Step-by-step Flow" },
      title: (
        <SectionTitle>Enter চাপার পর প্রথম লাইন ছাপা পর্যন্ত</SectionTitle>
      ),
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো ঘটনাটা একবারে সাজিয়ে দেখুন। মাঝখানের প্রতিটা ধাপে এই মডিউলের
              কোনো না কোনো লেসন কাজে লাগছে, আর শেষের ধাপটা এই লেসনে নতুন।
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
                "Shell প্রথমে বুঝে নেয় কোনটা Program এর নাম আর কোনগুলো তার Argument। তারপর PATH এর ফোল্ডারগুলো ধরে খুঁজে বের করে node ফাইলটা ঠিক কোথায় আছে।",
            },
            {
              title: "fork, নিজের একটা কপি",
              description:
                "Shell নিজের হুবহু একটা কপি বানায়, আর Kernel সেই কপিকে নতুন একটা PID দেয়। এই মুহূর্তে নতুন Process টা এখনো Shell ই।",
            },
            {
              title: "exec, ভেতরের মানুষ বদলে গেল",
              description:
                "কপিটা Kernel কে বলে node ফাইলটা বসিয়ে দিতে। Kernel পুরনো Memory মুছে ফেলে, কিন্তু PID টা একই রেখে দেয়। Environment Variable গুলো ঠিক এই মুহূর্তে দেওয়া হয়।",
            },
            {
              title: "মলাট দেখে, সূচিপত্র পড়ে",
              description:
                "Kernel প্রথম চার Byte দেখে নিশ্চিত হয় এটা চালানোর ফাইল। তারপর সূচিপত্র পড়ে Text আর Data বসিয়ে দেয়, .bss এর জন্য ফাঁকা জায়গা বানায়, আর একটা নতুন Stack তৈরি করে।",
            },
            {
              title: "Library গুলো জোড়া লাগে",
              description:
                "node একা চলে না, তার libc আর আরও কয়েকটা Library দরকার। ওগুলো খুঁজে না পেলে এখানেই সব থেমে যায়, আর shared library not found লেখা ওঠে।",
            },
            {
              title: "CPU লাফ দিল Entry Point এ",
              description:
                "Kernel Program Counter কে ফাইলে লেখা শুরুর ঠিকানায় বসিয়ে দেয়। এরপর থেকে CPU শুধু Fetch, Decode, Execute করে যায়, ঠিক যেমনটা Lesson 02 এ দেখেছেন।",
            },
            {
              title: "Node এবার আপনার ফাইলটা পড়ে",
              description:
                "এতক্ষণে node দাঁড়িয়ে গেছে। এখন সে server.js খোলে, Parse করে, আর চালাতে শুরু করে। প্রতিটা require এ ফাইল খুঁজতে গিয়ে আরও অনেকগুলো Syscall হয়।",
            },
            {
              title: "প্রথম লাইনটা পর্দায় এলো",
              description:
                "console.log চালালে Node write Syscall করে, Kernel লেখাটা Terminal এ পাঠায়, আর আপনি ফল দেখতে পান। ওদিকে listen করা থাকলে Process টা মরে না, সে Request এর অপেক্ষায় বসে থাকে।",
            },
            {
              title: "একদিন SIGTERM আসে, আর একটা সংখ্যা যায়",
              description:
                "Deploy এর সময় pm2 তাকে SIGTERM পাঠায়। Handler হাতের কাজ শেষ করে, Connection বন্ধ করে, আর Process শূন্য Exit Code দিয়ে বিদায় নেয়। Kernel Memory ফেরত নেয়, আর PID টা পরের জনের জন্য খালি হয়।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "resources",
      subHeader: { index: "012", title: "Best Resources" },
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
                <strong>Julia Evans এর Comics</strong>, Signals, strace আর
                Virtual Memory নিয়ে এক পাতার ছবিতে ব্যাখ্যা, সম্পূর্ণ
                বিগিনারদের জন্য।{" "}
                <a
                  href="https://wizardzines.com/comics/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  wizardzines.com/comics
                </a>
              </ListItem>
              <ListItem>
                <strong>পড়ার জন্য</strong>, man পাতাগুলো নিজেই চমৎকার শিক্ষক।
                Terminal এ লিখুন man fork, তারপর man execve, তারপর man 7 signal.
                Module 07 এ Linux নিয়ে বসলে এই তিনটা আবার কাজে লাগবে।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "recap",
      subHeader: { index: "013", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                Program মানে Disk এ পড়ে থাকা ফাইল, আর Process মানে সেই ফাইলের
                জ্যান্ত রূপ। একই Program থেকে অনেকগুলো Process চলতে পারে,
                প্রত্যেকের আলাদা PID।
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
                চালানোর ফাইলটা বইয়ের মতো সাজানো, মলাটে নাম, তারপর সূচিপত্র,
                তারপর খোপগুলো। Kernel শুরুর চার Byte দেখেই বুঝে যায় ফাইলটা
                চালানো যাবে।
              </ListItem>
              <ListItem>
                Shell আগে fork দিয়ে নিজের কপি বানায়, তারপর exec দিয়ে সেই কপির
                ভেতরটা বদলে দেয়। PID টা একই থাকে, আর মাঝের ফাঁকেই Environment
                Variable আর Output এর জায়গা ঠিক হয়।
              </ListItem>
              <ListItem>
                exec এর পর Memory চার ভাগে সাজে, Text, Data, Heap আর Stack। Heap
                বাড়ে উপরে, Stack নামে নিচে, আর মাঝখানে ধাক্কা খেলেই Out of
                Memory বা Stack Overflow।
              </ListItem>
              <ListItem>
                প্রতিটা Process ভাবে পুরো Memory তার একার। Kernel মাঝখানে বসে
                ঠিকানা বদলে দেয়, তাই কেউ কারো জায়গায় হাত দিতে পারে না। এটাই
                Virtual Memory।
              </ListItem>
              <ListItem>
                নিজের Memory র বাইরের কিছু ছুঁতে হলে Program কে Syscall করতে
                হয়। প্রতিটা Syscall এ User Mode আর Kernel Mode এর মধ্যে যাওয়া
                আসা হয়, আর সেটার খরচ আছে।
              </ListItem>
              <ListItem>
                Kernel যখন Process কে কিছু বলতে চায়, তখন Signal পাঠায়। SIGTERM
                ভদ্র অনুরোধ, ধরা যায়। SIGKILL বিদ্যুৎ কেটে দেওয়া, ধরা যায় না।
                Graceful Shutdown মানে SIGTERM ধরে কাজ গুছিয়ে বেরোনো।
              </ListItem>
              <ListItem>
                Process মরার সময় একটা Exit Code দিয়ে যায়। শূন্য মানে ভালো,
                বাকি সব মানে সমস্যা, আর 137 মানে SIGKILL, প্রায়ই Memory র সীমা
                পেরিয়ে যাওয়া।
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
        <span className="font-bold text-primary">PID</span>,
        "Process এর নম্বর, হাসপাতালের টিকিটের মতো, কখনো দুইজনের এক হয় না",
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
        <span className="font-bold text-primary">ELF</span>,
        "Linux এ চালানোর ফাইলের গড়ন, শুরুতেই নিজের নাম লেখা থাকে",
      ],
      [
        <span className="font-bold text-primary">fork</span>,
        "নিজের হুবহু একটা কপি বানানো, নতুন PID সহ",
      ],
      [
        <span className="font-bold text-primary">exec</span>,
        "PID একই রেখে ভেতরের Program টা বদলে দেওয়া",
      ],
      [
        <span className="font-bold text-primary">Text Segment</span>,
        "Machine Code যেখানে বসে, Read Only",
      ],
      [
        <span className="font-bold text-primary">Virtual Memory</span>,
        "প্রত্যেকে ভাবে Memory তার একার, Kernel ঠিকানা বদলে দেয়",
      ],
      [
        <span className="font-bold text-primary">Syscall</span>,
        "নিজের Memory র বাইরে কিছু করতে Kernel কে অনুরোধ",
      ],
      [
        <span className="font-bold text-primary">Signal</span>,
        "Kernel এর দিক থেকে Process এর দরজায় টোকা",
      ],
      [
        <span className="font-bold text-primary">SIGTERM</span>,
        "ভদ্র অনুরোধ, কাজ গুছিয়ে বেরিয়ে আসুন, ধরা যায়",
      ],
      [
        <span className="font-bold text-primary">SIGKILL</span>,
        "বিদ্যুৎ কেটে দেওয়া, ধরা যায় না",
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
        text: "fork এর পর আর exec এর আগে, নতুন Process টা আসলে কী?",
        options: [
          {
            key: "A",
            text: "একটা খালি Process, ভেতরে কিছু নেই",
            isCorrect: false,
            explanation:
              "খালি নয়। fork হুবহু কপি বানায়, তাই ভেতরে যা আছে সেটা Shell এর সবকিছু।",
          },
          {
            key: "B",
            text: "Shell এর হুবহু একটা কপি, শুধু PID আলাদা",
            isCorrect: true,
            explanation:
              "এই মুহূর্তে নতুন Process টা এখনো Shell ই। exec করার পরেই সে node হয়ে ওঠে, আর তখনো PID টা একই থাকে।",
          },
          {
            key: "C",
            text: "ইতিমধ্যেই node, শুধু চালু হয়নি",
            isCorrect: false,
            explanation:
              "node আসে exec এর পরে। fork আর exec আলাদা দুইটা ধাপ, আর মাঝের ফাঁকটাই Shell কাজে লাগায়।",
          },
        ],
      },
      {
        id: 4,
        text: "সার্ভারে .env ফাইলে নতুন একটা মান বসিয়ে দিলেন, কিন্তু API পুরনো মানই ব্যবহার করছে। কেন?",
        options: [
          {
            key: "A",
            text: "ফাইলটা সেভ হয়নি",
            isCorrect: false,
          },
          {
            key: "B",
            text: "Environment Variable Process পায় exec এর সময়, তাই Restart ছাড়া বদলায় না",
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
        id: 5,
        text: "দুইটা Process দুইজনই বলছে তাদের কোড 0x400000 ঠিকানায় আছে। কে মিথ্যা বলছে?",
        options: [
          {
            key: "A",
            text: "কেউ না, দুইজনের 0x400000 আসলে RAM এর আলাদা জায়গায়",
            isCorrect: true,
            explanation:
              "হোটেলের দুই তলার দুইটা ১০১ নম্বর ঘর। Kernel প্রতিটা Process এর জন্য আলাদা খাতা রাখে, আর মাঝখানে বসে ঠিকানা বদলে দেয়।",
          },
          {
            key: "B",
            text: "দ্বিতীয়জন, কারণ ঠিকানাটা প্রথমজন আগেই নিয়ে ফেলেছে",
            isCorrect: false,
            explanation:
              "Process যে ঠিকানা দেখে সেটা আসল RAM এর ঠিকানা নয়। তাই দুইজন একই সংখ্যা দেখলেও দুইজন এক জায়গায় নেই।",
          },
          {
            key: "C",
            text: "দুইজনই, Process কখনো নিজের ঠিকানা জানে না",
            isCorrect: false,
          },
        ],
      },
      {
        id: 6,
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
              "নিয়মটা এটাই। নিজের ঘরের ভেতরের কাজে রিসেপশনে ফোন করতে হয় না, বাইরের সবকিছুতে হয়।",
          },
          {
            key: "C",
            text: "Function শুরু আর শেষে দুইটা",
            isCorrect: false,
          },
        ],
      },
      {
        id: 7,
        text: "Deploy এর সময় pm2 আপনার সার্ভারকে SIGTERM পাঠাল, আর সাথে সাথে সার্ভার মরে গেল, দুইটা Booking মাঝপথে থেমে গেল। কী বাদ পড়েছিল?",
        options: [
          {
            key: "A",
            text: "কিছু না, SIGTERM এমনই, সাথে সাথে মারে",
            isCorrect: false,
            explanation:
              "SIGTERM ধরা যায়, এটাই তার সাথে SIGKILL এর তফাত। সাথে সাথে মরেছে কারণ কেউ ধরার ব্যবস্থা রাখেনি।",
          },
          {
            key: "B",
            text: "কোডে SIGTERM এর Handler ছিল না, তাই ডিফল্ট নিয়মে Process সাথে সাথে মরেছে",
            isCorrect: true,
            explanation:
              "process.on দিয়ে SIGTERM ধরে হাতের কাজ শেষ করা, এটাই Graceful Shutdown। কয়েক লাইন, কিন্তু প্রতিটা Deploy এ কয়েকজন ইউজার বাঁচে।",
          },
          {
            key: "C",
            text: "pm2 এর বদলে kill -9 ব্যবহার করা উচিত ছিল",
            isCorrect: false,
            explanation:
              "kill -9 হলো SIGKILL, যেটা কোনোভাবেই ধরা যায় না। সমস্যাটা আরও বাড়ত, কমত না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Program কে জ্যান্ত হতে দেখুন",
    subtitle: "Terminal এ পাঁচটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "ফাইল আর Process পাশাপাশি দেখুন",
        description:
          "Disk এ পড়ে থাকা node ফাইলটা দেখুন, তার প্রথম Byte গুলো দেখুন, তারপর সেটা থেকে জন্ম নেওয়া Process গুলো দেখুন। একই Program, একাধিক Process।",
      },
      {
        title: "fork আর exec ধরুন",
        description:
          "Shell যে আগে নিজের কপি বানায় আর তারপর Program বদলায়, সেটা নিজের চোখে দেখুন।",
      },
      {
        title: "Syscall গুনুন",
        description:
          "একটা ছোট Program কয়টা Syscall করে গুনে দেখুন, আর তারপর দেখুন এক Byte করে লিখলে সময়টা কোথায় গিয়ে দাঁড়ায়।",
      },
      {
        title: "Signal পাঠান আর ধরুন",
        description:
          "একটা সার্ভারকে SIGTERM পাঠান, প্রথমে Handler ছাড়া, তারপর Handler দিয়ে। দুইবারের তফাতটাই Graceful Shutdown।",
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
file $(which node)          # Linux এ ELF, macOS এ Mach-O

# ফাইলের প্রথম ষোলটা Byte, নিজের নাম নিজেই বলে
xxd $(which node) | head -1
# Linux এ দেখবেন:  7f45 4c46 ...   .ELF
# macOS এ দেখবেন:  cffa edfe ...   অন্য নাম, একই ধারণা

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

# macOS এ strace নেই। বদলে PID এর দিকে তাকান:
echo "Shell এর PID: $$"
bash -c 'echo "কপির PID: $$"'       # fork হলো, নতুন PID
exec echo "exec এর পর PID: $$"     # exec হলো, PID একই, তবে Shell টা আর নেই!

# শেষ লাইনটা চালানোর পর Terminal বন্ধ হয়ে যাবে। ঠিক এটাই exec।
# আপনার Shell এর খোলসে echo বসে গেল, আর echo শেষ হওয়ায় খোলসটাও গেল।`,
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
        filename: "4-signals.js",
        language: "javascript",
        code: `// প্রথমে এই ফাইলটা যেমন আছে তেমনই চালান, তারপর নিচের অংশটা খুলে আবার চালান
const http = require('http');

const server = http.createServer((req, res) => {
  setTimeout(() => res.end('বুকিং হয়ে গেছে\\n'), 3000);   // তিন সেকেন্ডের কাজ
}).listen(3000, () => console.log('PID', process.pid, 'চলছে'));

// ---- দ্বিতীয়বার চালানোর সময় এই অংশটা খুলে দিন ----
// process.on('SIGTERM', () => {
//   console.log('SIGTERM পেলাম। নতুন Request নেওয়া বন্ধ, হাতের কাজ শেষ করছি।');
//   server.close(() => {
//     console.log('সব শেষ, বিদায়।');
//     process.exit(0);
//   });
// });

// পরীক্ষাটা এভাবে করুন, দুইটা Terminal লাগবে:
//
//   Terminal 1:  node 4-signals.js
//   Terminal 2:  curl localhost:3000 &        ← একটা তিন সেকেন্ডের Request
//                kill <PID>                    ← এক সেকেন্ডের মধ্যে SIGTERM
//
// প্রথমবার (Handler ছাড়া): curl কোনো উত্তর পায় না, সার্ভার সাথে সাথে মরেছে।
// দ্বিতীয়বার (Handler সহ): curl উত্তর পায়, তারপর সার্ভার বিদায় নেয়।
//
// এবার kill -9 <PID> দিয়ে দেখুন। Handler থাকলেও কিছু হবে না।
// SIGKILL ধরা যায় না, এটাই তার সাথে SIGTERM এর তফাত।`,
      },
      {
        filename: "5-env-at-exec.js",
        language: "javascript",
        code: `// Environment Variable Process পায় জন্মের সময়, একবার।
setInterval(() => {
  console.log('আমি দেখছি GREETING =', process.env.GREETING ?? '(কিছুই না)');
}, 2000);

// পরীক্ষাটা এভাবে করুন:
//
//   Terminal 1:  GREETING=hello node 5-env-at-exec.js
//   Terminal 2:  export GREETING=bye        ← বাইরে বদলে দিন
//
// Terminal 1 এ তাকিয়ে থাকুন। সে hello ই বলে যাবে, চিরকাল।
// কারণ ওই Process টা জন্মের সময় যা পেয়েছিল, সেটাই তার কাছে সত্যি।
//
// এবার Terminal 1 বন্ধ করে আবার চালান। এবার সে নতুন মান পাবে।
// সার্ভারে .env বদলানোর পর Restart লাগে ঠিক এই কারণেই।`,
      },
    ],
    tip: "চার নম্বর পরীক্ষাটা সবচেয়ে বেশি শেখায়। একই সার্ভার, একই Request, একই kill কমান্ড, শুধু কয়েক লাইন Handler এর তফাত। প্রথমবার ইউজার খালি হাতে ফেরেন, দ্বিতীয়বার উত্তর পান। Production এ এই কয়েক লাইনই ঠিক করে দেয় প্রতিটা Deploy এ কতজন ইউজারের Payment মাঝপথে থেমে যাবে।",
  },
  assignment: {
    title: "Mini Project: আপনার Program এর জন্মবৃত্তান্ত",
    time: "২ - ৩ ঘণ্টা",
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
        <strong>my-tours এ Graceful Shutdown লিখুন:</strong> আপনার my-tours
        সার্ভারে SIGTERM এর Handler যোগ করুন, যেটা নতুন Request নেওয়া বন্ধ করে,
        হাতের কাজ শেষ করে, তারপর শূন্য Exit Code দিয়ে বেরিয়ে আসে। Lab এর চার
        নম্বর পরীক্ষাটা আপনার সার্ভারে চালিয়ে দেখুন curl উত্তর পায় কিনা।
      </span>,
      <span key="4">
        <strong>একটা /health Endpoint বানান:</strong> যেটা process.pid,
        process.uptime() আর process.version ফেরত দেয়। সার্ভার চালু করে দুইবার
        ডাকুন, তারপর Restart দিয়ে আবার ডাকুন। PID বদলাল কিনা আর uptime শূন্য
        থেকে শুরু হলো কিনা দেখুন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> আপনার my-tours সার্ভারে
        .env বদলানোর পর কী কী করলে নতুন মান কার্যকর হবে, আর কেন শুধু ফাইল সেভ
        করাই যথেষ্ট নয়? উত্তরে fork আর exec শব্দ দুইটা থাকতে হবে।
      </span>,
    ],
    deliverables: [
      <span key="1">clone আর execve লাইন দুইটার স্ক্রিনশট</span>,
      <span key="2">দুইটা Script এর সময়ের তুলনা</span>,
      <span key="3">
        SIGTERM Handler সহ my-tours সার্ভার, আর curl এর উত্তরের স্ক্রিনশট
      </span>,
      <span key="4">PID আর uptime দেখানো /health Endpoint</span>,
      <span key="5">.env নিয়ে নিজের লেখা ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
