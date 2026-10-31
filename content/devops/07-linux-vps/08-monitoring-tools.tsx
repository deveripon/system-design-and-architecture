/**
 * What: Module 07 Lesson 08, Monitoring Tools. It teaches how to read the health of a Linux
 * server in the moment: load average, top and its CPU line, htop, free and available memory,
 * swap and the OOM killer, vmstat, disk space with df and du, disk I/O with iostat, finding the
 * process or service to blame, a five look health check, and when a number means worry.
 *
 * Why: When Island Tours slows down, the server cannot say what hurts. These tools print the
 * numbers that can, but a beginner drowns in them. Every output here was captured on the
 * lesson's practice server while a small app burned CPU, held memory or filled the disk on
 * purpose, so the reader learns to read real numbers, and the labs repeat the same cause and
 * effect on the reader's own machine.
 */
import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CpuLineLab,
  LoadAverageLab,
  TriageLab,
} from "../../../components/course/topics/linux/monitor-animations";
import {
  DiskGhostSplit,
  LoadQueueDiagram,
  MemoryBarDiagram,
  TopAnatomyDiagram,
  VirtResShrDiagram,
  VitalSignsDiagram,
} from "../../../components/course/topics/linux/monitor-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

const linkClass = "text-primary underline underline-offset-4";

export const monitoringToolsContent: TopicData = {
  id: "monitoring-tools",
  introduction: {
    badge: "MODULE 07 · LESSON 08",
    title: <SectionTitle>Server কেমন আছে, তিন মিনিটে জানবেন কীভাবে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          শুক্রবার সন্ধ্যা, ছুটির আগের দিন। Island Tours এ বুকিং এর ভিড়। হঠাৎ একজন পর্যটক
          লিখলেন, সাইট খুলতে বিশ সেকেন্ড লাগছে, বুকিং বোতাম চাপলে কিছুই হয় না। আপনি ল্যাপটপ
          খুলে <code>ssh island</code> লিখলেন, Server এ ঢুকলেন, আর একটা খালি Prompt আপনার
          দিকে তাকিয়ে রইল। এবার কী?
        </ContentParagraph>
        <ContentParagraph>
          Server নিজে থেকে বলবে না তার কোথায় ব্যথা। কিন্তু তার কাছে সংখ্যা আছে, আর সেই সংখ্যা
          পড়তে জানলে এক মিনিটের মধ্যে বোঝা যায় সমস্যাটা CPU তে, Memory তে, Disk এ, নাকি
          Server আসলে সুস্থ আর সমস্যা অন্য কোথাও। মুশকিল হলো, প্রতিটা যন্ত্র একসাথে ত্রিশটা সংখ্যা
          ছুড়ে দেয়, আর নতুন কেউ বুঝতে পারেন না কোনটা দেখবেন।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি সেই সংখ্যাগুলো পড়তে শিখবেন: <code>uptime</code> এর Load average আসলে
          কী গোনে, <code>top</code> এর প্রথম পাঁচ লাইন, CPU লাইনের us, wa আর st, কেন
          <code> free</code> এ খালি জায়গা কম দেখেও ভয় পাওয়ার কিছু নেই, Swap আর OOM Killer,
          Disk ভরে গেলে কাকে খুঁজবেন, আর কোন Process বা কোন Service দায়ী সেটা কীভাবে ধরবেন।
          শেষে থাকবে এক মিনিটের একটা স্বাস্থ্য পরীক্ষা, যা আপনি প্রতিটা Server এ প্রথমেই চালাবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "রোগী মুখে কিছু না বললেও তাঁর শরীর কথা বলে। জ্বর, নাড়ি, শ্বাসের গতি। ভালো ডাক্তার সব পরীক্ষা একসাথে করেন না, আগে এই কয়টা সংখ্যা দেখেন, তারপর ঠিক করেন কোন দিকে তাকাবেন।",
      author: "Monitoring",
      role: "Lesson 08",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-monitor",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Server অসুস্থ হলে নিজে থেকে বলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনে আপনি Log পড়তে শিখেছেন। Log বলে কী ঘটেছে: কোন Request এলো, কোন Error
                হলো। কিন্তু অনেক সমস্যার কোনো Error নেই। App ঠিকই চলছে, শুধু ধীরে। কোনো লাইন
                লাল হয় না, কেউ চিৎকার করে না। এই নীরব সমস্যাগুলো ধরা পড়ে শুধু সংখ্যায়: CPU কতটা
                ব্যস্ত, Memory কতটা বাকি, Disk কতটা ভরা।
              </ContentParagraph>
              <ContentParagraph>
                ডাক্তারের কাছে গেলে তিনি প্রথমেই আপনার পুরো শরীর পরীক্ষা করেন না। আগে কয়েকটা সহজ
                জিনিস মাপেন, যাকে বলে Vital Signs: তাপমাত্রা, নাড়ি, রক্তচাপ। এই কয়টা সংখ্যাই বলে
                দেয় কোন দিকে আরও খুঁজতে হবে। একটা Server এরও এমন ছয়টা লক্ষণ আছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <VitalSignsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>CPU</strong>, Server এর চিন্তা করার ক্ষমতা। Module 01 এ দেখেছেন CPU
                  একবারে একটা কাজের একটা অংশ করে। প্রশ্ন হলো, যত কাজ আসছে সেটা কি সামলাতে
                  পারছে, নাকি কাজ লাইনে দাঁড়াচ্ছে।
                </ListItem>
                <ListItem>
                  <strong>Memory</strong>, কাজের টেবিল। চলমান প্রতিটা Program এর Data এখানে থাকে।
                  টেবিল ভরে গেলে Linux জিনিস নামিয়ে রাখে ধীর Disk এ, যাকে বলে Swap, আর তাতেও
                  না কুলালে কোনো একটা Program কে মেরে ফেলে।
                </ListItem>
                <ListItem>
                  <strong>Disk Space</strong>, আলমারি, Module 01 এর ভাষায়। Log, Backup, ছবি, Database এখানে জমে। আলমারি
                  পুরো ভরে গেলে কেউ আর কিছু লিখতে পারে না, আর তখন অদ্ভুত সব জিনিস ভাঙে।
                </ListItem>
                <ListItem>
                  <strong>Disk I/O</strong>, আলমারি থেকে জিনিস আনা নেওয়ার গতি। জায়গা থাকলেও Disk যদি
                  একসাথে অনেক কাজে ব্যস্ত থাকে, সবাই তার উত্তরের জন্য দাঁড়িয়ে থাকে।
                </ListItem>
                <ListItem>
                  <strong>Network</strong>, দরজা। কতগুলো Connection খোলা, কত Data আসছে যাচ্ছে,
                  কোথাও Packet হারাচ্ছে কি না। এর গভীর Debugging পরের লেসনের কাজ।
                </ListItem>
                <ListItem>
                  <strong>Process</strong>, যারা এই সবকিছু খরচ করছে। প্রথম পাঁচটা প্রশ্ন বলে কোন
                  সম্পদে টান পড়েছে, আর এই ষষ্ঠ প্রশ্ন বলে কে টানছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দুই রকম Monitoring আছে, আর এদের গুলিয়ে ফেলবেন না। এই লেসনটা প্রথম রকমের: এই
                মুহূর্তে Server এ ঢুকে নিজের চোখে সংখ্যা দেখা, যেমন ডাক্তার রোগীর নাড়ি ধরেন। দ্বিতীয়
                রকম হলো দীর্ঘ সময় ধরে Graph রাখা আর কোনো সংখ্যা সীমা পার হলে নিজে থেকে খবর
                পাঠানো, যেমন হাসপাতালের Monitor যা সারারাত বাজতে প্রস্তুত থাকে। সেটা আসবে পরে,
                Observability Module এ। কিন্তু সেখানকার প্রতিটা Graph এই লেসনের কোনো না কোনো
                সংখ্যারই ছবি, তাই আগে সংখ্যাগুলো চেনা দরকার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এই লেসনের Output কোথা থেকে এসেছে",
          content: (
            <p>
              লেসনের প্রতিটা Terminal Output আসল, একটা অনুশীলনের Server এ চালিয়ে নেওয়া, যার নাম
              আমরা রেখেছি island-vps-01। সেখানে একটা ছোট Node App ইচ্ছা করে CPU পুড়িয়েছে, Memory
              ধরে রেখেছে, Disk ভরিয়েছে। তবে এই অনুশীলনের Server টা একটা বড় যন্ত্রের ভেতরে চলা
              Container, তাই দুইটা জিনিস আসল VPS থেকে আলাদা। এক, সে পুরো যন্ত্রের CPU আর Memory
              দেখে, তাই সংখ্যায় 4 টা Core আর 5.8 GB RAM আসে, Island Tours এর 2 vCPU আর 4 GB নয়।
              দুই, একই যন্ত্রে অন্য কাজও চলছিল, তাই Load average এ তাদের ভাগও ঢুকেছে। যেখানে এই
              তফাত গুরুত্বপূর্ণ, সেখানে আলাদা করে বলা আছে। আপনার নিজের VPS এ শুধু আপনার নিজের
              সংখ্যা আসবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "load-average",
      subHeader: { index: "002", title: "Load Average" },
      title: <SectionTitle>uptime আর Load average, তিনটা সংখ্যার আসল মানে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Server এ ঢুকে প্রথম যে কমান্ডটা চালাবেন সেটা সবচেয়ে ছোট:{" "}
                <code>uptime</code>। এক লাইনে চারটা জিনিস বলে। তার আগে আরেকটা কমান্ড,{" "}
                <code>nproc</code>, যা বলে এই যন্ত্রে কয়টা CPU Core আছে। কেন আগে এটা, একটু পরেই
                বুঝবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "uptime.sh",
          code: `deploy@island-vps-01:~$ nproc
4
deploy@island-vps-01:~$ uptime
 07:24:18 up  4:18,  0 user,  load average: 5.81, 2.93, 2.06
deploy@island-vps-01:~$ cat /proc/loadavg
5.81 2.93 2.06 9/840 119`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  {mono("07:24:18")} এখনকার সময়, Server এর ঘড়িতে। Island Tours এর Server চলে
                  UTC তে, তাই ঢাকায় তখন দুপুর একটা চব্বিশ।
                </ListItem>
                <ListItem>
                  {mono("up 4:18")} মানে শেষবার চালু হওয়ার পরে চার ঘণ্টা আঠারো মিনিট পার হয়েছে।
                  কেউ অভিযোগ করলেন সকালে সাইট বন্ধ ছিল, আর এখানে দেখলেন up মাত্র কয়েক মিনিট,
                  তাহলে বুঝবেন মাঝে Server Reboot হয়েছে।
                </ListItem>
                <ListItem>
                  {mono("0 user")} কতজন এই মুহূর্তে Login করে আছেন। অনুশীলনের Container এ কেউ
                  আসল Login করেননি বলে শূন্য, VPS এ SSH এ ঢুকলে আপনি নিজেও গোনা হবেন।
                </ListItem>
                <ListItem>
                  {mono("load average: 5.81, 2.93, 2.06")} এই লাইনের আসল খবর। তিনটা সংখ্যা,
                  গত ১ মিনিট, ৫ মিনিট আর ১৫ মিনিটের গড়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Load মানে কী? সহজ কথায়, একটা মুহূর্তে কতগুলো কাজ CPU চাইছে। একটা টিকিট ঘর ভাবুন
                যার কাউন্টার দুইটা। দুইজন টিকিট কাটছেন, তিনজন লাইনে। Load হলো পাঁচ, কাউন্টারে যারা
                আছেন আর যারা অপেক্ষা করছেন, সবাই মিলে। Linux এ এর সাথে আরেক দল যোগ হয়: যারা CPU
                ছেড়ে Disk এর উত্তরের অপেক্ষায় আটকে আছে। লেসন ০২ এ Process এর State দেখেছিলেন,
                চলছে বা চলার জন্য তৈরি হলে R, আর Disk এর জন্য এমনভাবে আটকে থাকলে যে Signal দিয়েও
                নাড়ানো যায় না, তখন D। Load average এই R আর D দুই দলকেই গোনে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LoadQueueDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার বুঝবেন কেন আগে <code>nproc</code>। Load 4 শুনে ভালো না খারাপ, বলা অসম্ভব,
                যতক্ষণ না জানছেন কাউন্টার কয়টা। এক Core এর যন্ত্রে Load 4 মানে একজন কাজ করছে আর
                তিনজন দাঁড়িয়ে, অবস্থা খারাপ। চার Core এর যন্ত্রে Load 4 মানে চারজনই কাজ করছে আর
                কেউ লাইনে নেই, একদম ঠিক আছে। তাই সবসময় Load কে Core সংখ্যা দিয়ে ভাগ করে পড়বেন।
                উপরের অনুশীলনের Server এর 5.81 কে 4 দিয়ে ভাগ করলে প্রতি Core এ প্রায় 1.45, মানে সেই
                মুহূর্তে কিছু কাজ অপেক্ষায় ছিল।
              </ContentParagraph>
              <ContentParagraph>
                তিনটা সংখ্যা পাশাপাশি থাকার কারণ হলো দিক বোঝা। প্রথমটা যদি তৃতীয়টার চেয়ে অনেক বড়
                হয়, যেমন 5.81 বনাম 2.06, তাহলে চাপ এই মাত্র বাড়ছে। উল্টোটা হলে, যেমন 1.12, 4.41,
                4.80, চাপ ছিল কিন্তু এখন কমে আসছে, যা খুঁজছিলেন হয়তো শেষ হয়ে গেছে। আর তিনটাই
                প্রায় সমান আর বড় হলে, বিপদ অনেকক্ষণ ধরে চলছে।
              </ContentParagraph>
              <ContentParagraph>
                <code>/proc/loadavg</code> ফাইলটা Kernel এর নিজের খাতা, <code>uptime</code>{" "}
                এখান থেকেই পড়ে। প্রথম তিনটা সেই তিনটা গড়। তারপর {mono("9/840")} মানে এই
                মুহূর্তে 9 টা চলার জন্য তৈরি, আর মোট 840 টা Thread আছে যন্ত্রে। শেষের {mono("119")}{" "}
                হলো সবশেষে তৈরি হওয়া Process এর PID।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LoadAverageLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Load মানে CPU এর শতাংশ নয়",
          content: (
            <p>
              অনেকে Load 2.0 দেখে ভাবেন CPU 200% ব্যস্ত। Load কোনো শতাংশ নয়, এটা একটা গণনা,
              কতগুলো কাজ এই মুহূর্তে চলছে বা অপেক্ষায়। আর যেহেতু Disk এর অপেক্ষায় থাকারাও গোনা
              হয়, তাই এমন হতে পারে যে CPU প্রায় পুরো ফাঁকা, অথচ Load বেশি। তখন সমস্যা CPU তে নয়,
              Disk এ। কোনটা ঘটছে সেটা আলাদা করে দেখায় পরের যন্ত্র, top।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "top-header",
      subHeader: { index: "003", title: "top" },
      title: <SectionTitle>top এর মাথার পাঁচ লাইন, পুরো যন্ত্রের সারাংশ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>top</code> প্রায় সব Linux এ আগে থেকেই থাকে, কিছু বসাতে হয় না। লিখে Enter
                চাপলে পুরো পর্দা জুড়ে একটা টেবিল আসে, যা প্রতি তিন সেকেন্ডে নিজে থেকে নতুন হয়।
                বেরোতে চাইলে <code>q</code> চাপুন। পর্দাটা দুই ভাগে বিভক্ত: উপরের পাঁচ লাইন পুরো
                যন্ত্রের সারাংশ, নিচের টেবিল প্রতিটা Process এর আলাদা হিসাব।
              </ContentParagraph>
              <ContentParagraph>
                নিচের ছবিটা অনুশীলনের Server এর আসল top, তোলা হয়েছিল যখন একটা Node App একটা
                ভারী Report বানাতে গিয়ে CPU পোড়াচ্ছিল। একটা একটা লাইন ধরে পড়ি।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TopAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>প্রথম লাইন</strong> হুবহু <code>uptime</code> এর লাইন। সময়, কতক্ষণ চালু,
                  কতজন Login করা, আর Load average। এজন্য অনেকে uptime আলাদা চালান না, top খুললেই
                  পেয়ে যান।
                </ListItem>
                <ListItem>
                  <strong>Tasks</strong> লাইনে মোট Process কয়টা আর কে কোন State এ। running মানে R,
                  sleeping মানে অপেক্ষায় বা বিশ্রামে, stopped মানে কেউ Ctrl+Z দিয়ে থামিয়ে রেখেছে,
                  আর zombie মানে মরে গেছে কিন্তু Parent তার খোঁজ নেয়নি (লেসন ০২)। দুই একটা zombie
                  ক্ষতিকর নয়, কিন্তু সংখ্যাটা বাড়তে থাকলে কোনো Program তার সন্তানদের ঠিকমতো
                  সামলাচ্ছে না।
                </ListItem>
                <ListItem>
                  <strong>%Cpu(s)</strong> লাইনটা পুরো পর্দার সবচেয়ে কাজের লাইন। CPU এর সময় কোন
                  কাজে কত শতাংশ যাচ্ছে, আটটা ভাগে। এটার জন্য পরের পুরো Section টা রাখা।
                </ListItem>
                <ListItem>
                  <strong>MiB Mem</strong> লাইনে RAM এর হিসাব, MiB এককে। total, free, used আর
                  buff/cache। এখানে free ছোট দেখে ঘাবড়াবেন না, কেন সেটা Memory এর Section এ।
                </ListItem>
                <ListItem>
                  <strong>MiB Swap</strong> লাইনে Swap এর হিসাব, আর লাইনের শেষে একটা আলাদা সংখ্যা,{" "}
                  {mono("avail Mem")}। নতুন কোনো Program এলে আসলে কতটা Memory পাবে, সেটা এই
                  সংখ্যা। Memory নিয়ে প্রশ্ন উঠলে প্রথমে এটাই দেখবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Server এ ঢুকে এক ঝলক দেখার জন্য পুরো পর্দা খোলার দরকার নেই। <code>-b</code> মানে
                Batch, অর্থাৎ পর্দা দখল না করে সাধারণ লেখা হিসেবে ছাপো, আর <code>-n 1</code> মানে
                একবারই। এভাবে top এর Output অন্য কমান্ডে পাঠানো যায়, File এ রাখা যায়, Script এ
                ব্যবহার করা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "top-once.sh",
          code: `deploy@island-vps-01:~$ top -b -n 1 | head -5
top - 07:25:30 up  4:19,  0 user,  load average: 5.14, 3.28, 2.24
Tasks:  15 total,   2 running,  13 sleeping,   0 stopped,   0 zombie
%Cpu(s): 51.2 us,  4.7 sy,  0.0 ni, 41.9 id,  0.0 wa,  0.0 hi,  2.3 si,  0.0 st
MiB Mem :   5910.3 total,    981.2 free,   1726.8 used,   4036.1 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.   4183.6 avail Mem`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "cpu-line",
      subHeader: { index: "004", title: "CPU Line" },
      title: <SectionTitle>us, sy, wa, st: CPU এর সময় কোথায় যাচ্ছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একজন রাঁধুনির এক ঘণ্টার হিসাব ভাবুন। কিছুটা সময় তিনি অতিথিদের জন্য রান্না করলেন,
                কিছুটা হাঁড়িপাতিল গোছালেন আর বাজারের হিসাব লিখলেন, কিছুটা বসে রইলেন কারণ চুলায়
                কিছু নেই, আর কিছুটা দাঁড়িয়ে রইলেন কারণ গুদাম থেকে চাল আসতে দেরি হচ্ছিল। ঘণ্টার
                শেষে এই ভাগগুলো যোগ করলে ১০০%। top এর CPU লাইন ঠিক এই হিসাব, CPU এর জন্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ঘর", "পুরো নাম", "মানে", "বড় হলে কী বুঝবেন"],
          rows: [
            [mono("us"), "user", "আপনার Program এর নিজের হিসাব, যেমন Node এর Code চালানো", "App নিজে ভারী কাজ করছে। কে, সেটা Process টেবিলে দেখুন"],
            [mono("sy"), "system", "Kernel এর কাজ: File খোলা, Network এ পাঠানো, Memory দেওয়া", "অসংখ্য ছোট System Call, প্রায়ই অনেক Connection"],
            [mono("ni"), "nice", "নিচু অগ্রাধিকার দিয়ে চালানো কাজের user সময়", "কোনো Batch কাজ চলছে, সাধারণত দুশ্চিন্তার নয়"],
            [mono("id"), "idle", "কিছু করার নেই, বসে আছে", "বড় হলে ভালো। প্রায় শূন্য হলে CPU পুরো ভরা"],
            [mono("wa"), "I/O wait", "কাজ আছে, কিন্তু Disk এর উত্তরের অপেক্ষায় বসে", "Disk ধীর বা ব্যস্ত। CPU বাড়িয়ে লাভ নেই"],
            [mono("hi"), "hardware interrupt", "যন্ত্রাংশের ডাকে সাড়া দেওয়া", "VPS এ প্রায় সবসময় শূন্যের কাছে"],
            [mono("si"), "software interrupt", "Kernel এর পিছিয়ে রাখা কাজ, বেশিরভাগ Network Packet", "প্রচুর Network Traffic"],
            [mono("st"), "steal", "আপনার vCPU চাইল, কিন্তু Hypervisor সেই সময় অন্য VM কে দিল", "পাশের VM এর ভিড়। আপনার Code এর দোষ নয়"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষের ঘরটা, <strong>st</strong>, শুধু VPS এর জগতে অর্থবহ, তাই আলাদা করে বলি।
                আপনার VPS আসলে একটা বড় Physical যন্ত্রের একটা টুকরো, যেটা আরও অনেকের VPS এর সাথে
                ভাগাভাগি করে চলে। প্রতিটা VPS কে কতটা CPU দেওয়া হবে সেটা ঠিক করে Hypervisor নামের
                একটা Program। পাশের কোনো VPS যদি হঠাৎ খুব বেশি CPU চায়, Hypervisor আপনার vCPU এর
                পালা কিছুটা কেটে তাকে দিতে পারে। আপনার Program তখন চলতে চেয়েও চলতে পারে না, আর সেই
                হারানো সময়টাই st। একে বলে Noisy Neighbour, ঝামেলাবাজ প্রতিবেশী। st কয়েক ঘণ্টা ধরে
                5 থেকে 10 এর উপরে থাকলে Provider কে জানান, অথবা ভালো Plan বা অন্য Server এ সরে
                যান।
              </ContentParagraph>
              <ContentParagraph>
                এবার আসল Output টা আবার দেখুন: {mono("51.2 us, 41.9 id")}। চারটা Core এর যন্ত্রে
                us মাত্র অর্ধেক, আর id প্রায় অর্ধেক। মনে হতে পারে CPU এর হাতে প্রচুর সময় বাকি,
                তাহলে Report ধীর কেন? উত্তর পেতে top চলার সময় <code>1</code> চাপুন। সারাংশের এক
                লাইনের বদলে প্রতিটা Core এর আলাদা লাইন আসবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "top-per-core.sh",
          code: `# top চলার সময় 1 চাপলে এই চেহারা আসে। Batch এ একই জিনিস: -1
deploy@island-vps-01:~$ top -b -n 1 -1 -w 200 | sed -n 3,4p
%Cpu0  :100.0 us,  0.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st   %Cpu1  :  0.0 us,  0.0 sy,  0.0 ni,100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
%Cpu2  :  0.0 us,  8.3 sy,  0.0 ni, 83.3 id,  0.0 wa,  0.0 hi,  8.3 si,  0.0 st   %Cpu3  :  0.0 us,  8.3 sy,  0.0 ni, 83.3 id,  0.0 wa,  0.0 hi,  8.3 si,  0.0 st`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার পরিষ্কার। Cpu0 পুরো 100% ভরা, বাকি তিনটা প্রায় ফাঁকা। Node তার JavaScript
                চালায় একটা মূল Thread এ (Module 01 এর process-vs-thread মনে করুন), তাই একটা ভারী
                Report একটার বেশি Core ব্যবহার করতে পারে না। সারাংশের লাইন চারটা Core এর গড় দেখায়,
                আর গড় এই একলা ভরা Core টাকে লুকিয়ে ফেলে। শিক্ষাটা মনে রাখার মতো: সারাংশে CPU
                অর্ধেক ফাঁকা দেখালেও একটা Single Thread App তার নিজের একমাত্র Core এ দম আটকে মরতে
                পারে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ ছয়টা পরিস্থিতির CPU লাইন আছে। প্রতিটায় একটা ঘর বাকিদের চেয়ে বড়, আর
                সেই ঘরটাই বলে কোন দিকে খুঁজতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CpuLineLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "top-processes",
      subHeader: { index: "005", title: "Process Table" },
      title: <SectionTitle>Process এর টেবিল পড়া, আর top কে হাতে চালানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সারাংশ বলল সমস্যা CPU তে। এবার কে দায়ী? top এর নিচের টেবিলে প্রতিটা Process এর এক
              লাইন। অনুশীলনের Server এর আসল টেবিল, Report চলার সময়:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "top-table.txt",
          code: `    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
    198 mytours   20   0  607596  53464  39228 R 100.0   0.9   0:13.46 node
      1 root      20   0   21080  11744   8892 S   0.0   0.2   0:01.51 systemd
     24 root      19  -1   33688  11636  10684 S   0.0   0.2   0:00.24 systemd-journal
     80 root      20   0    4160   2436   2196 S   0.0   0.0   0:00.02 cron
     81 message+  20   0    8396   3988   3508 S   0.0   0.1   0:00.02 dbus-daemon
     90 syslog    20   0  222360   4176   3424 S   0.0   0.1   0:00.09 rsyslogd`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কলাম", "মানে", "খেয়াল রাখার কথা"],
          rows: [
            [mono("PID"), "Process এর নম্বর", "kill বা systemctl status এ এই নম্বর লাগবে"],
            [mono("USER"), "কোন User এর নামে চলছে", "mytours মানে আপনার App, লম্বা নাম কেটে + হয়ে যায়"],
            [mono("PR, NI"), "অগ্রাধিকার আর Nice মান", "NI ধনাত্মক মানে নিজেকে পিছিয়ে রাখছে, ঋণাত্মক মানে আগে পায়"],
            [mono("VIRT"), "যত Memory চেয়ে রেখেছে বা দেখতে পায়, KiB তে", "বড় দেখালেও ভয় নেই, সবটা ব্যবহার হয় না"],
            [mono("RES"), "এই মুহূর্তে সত্যিই RAM এ আছে", "Memory এর আসল খরচ, এটাই দেখবেন"],
            [mono("SHR"), "RES এর ভাগ করা অংশ, যেমন Library", "একাধিক Process একই Library ভাগ করে"],
            [mono("S"), "State: R, S, D, Z, T", "অনেক D মানে Disk এর অপেক্ষা"],
            [mono("%CPU"), "শেষ কয়েক সেকেন্ডে কতটা CPU", "একটা Core পুরো = 100। Multi Thread হলে 100 ছাড়াতে পারে"],
            [mono("%MEM"), "মোট RAM এর কত শতাংশ RES", "শতাংশটা পুরো যন্ত্রের RAM এর উপর"],
            [mono("TIME+"), "শুরু থেকে মোট কত CPU সময় খেয়েছে", "দীর্ঘদিনের পেটুক ধরতে কাজের"],
            [mono("COMMAND"), "Program এর নাম", "c চাপলে পুরো কমান্ড লাইন দেখায়"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                টেবিলের সবচেয়ে বেশি ভুল বোঝা তিনটা কলাম VIRT, RES আর SHR। একই node Process এর তিনটা
                সংখ্যা নিচের ছবিতে, App টা 300 MB Memory ধরে রাখার পরে নেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <VirtResShrDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                top শুধু দেখার যন্ত্র নয়, চলার সময় একটা একটা অক্ষর চেপে তাকে চালানো যায়। সবগুলো
                মুখস্থ করার দরকার নেই, এই কয়টাই প্রতিদিন লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["চাপুন", "কী হয়", "কখন লাগে"],
          rows: [
            [mono("P"), "CPU অনুযায়ী সাজায় (Default)", "কে CPU খাচ্ছে"],
            [mono("M"), "Memory অনুযায়ী সাজায়", "কে RAM খাচ্ছে"],
            [mono("T"), "TIME+ অনুযায়ী সাজায়", "দীর্ঘদিনের পেটুক"],
            [mono("1"), "প্রতিটা Core আলাদা লাইনে", "একটা Core ভরা কি না"],
            [mono("c"), "পুরো কমান্ড লাইন দেখায়", "অনেকগুলো node এর মধ্যে কোনটা কোন App"],
            [mono("u"), "একজন User এর Process গুলোই দেখায়", "শুধু mytours দেখতে"],
            [mono("H"), "Thread গুলো আলাদা লাইনে", "Process এর ভেতরে কোন Thread ব্যস্ত"],
            [mono("o"), "Filter, যেমন COMMAND=node", "ভিড়ের মধ্যে একটা নাম খুঁজতে"],
            [mono("k"), "PID চেয়ে Signal পাঠায়, Default SIGTERM", "হাতে থামাতে, তবে Service হলে systemctl ভালো"],
            [mono("d"), "কত সেকেন্ড পর পর নতুন হবে", "দ্রুত বদলাচ্ছে এমন কিছু দেখতে"],
            [mono("q"), "বেরিয়ে যায়", "সবসময়"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Batch Mode এও সাজানো যায়, <code>-o</code> দিয়ে। Script এ বা চট করে এক নজরের জন্য
              এগুলো কাজের।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "top-sorted.sh",
          code: `# সবচেয়ে বেশি CPU খাওয়া কয়টা Process, একবার ছেপে
top -b -n 1 -o %CPU | head -12

# সবচেয়ে বেশি Memory খাওয়া কয়টা
top -b -n 1 -o %MEM | head -12

# শুধু একজন User এর Process
top -u mytours

# কয়েকটা নির্দিষ্ট PID কে চোখে চোখে রাখা
top -p 198`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "htop",
      subHeader: { index: "006", title: "htop" },
      title: <SectionTitle>htop, একই খবর আরও সহজ চেহারায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                top সব জায়গায় থাকে, কিন্তু চেহারাটা পুরনো দিনের। <code>htop</code> একই তথ্য
                দেখায় রঙিন দাগ দিয়ে, Mouse দিয়ে বেছে নেওয়া যায়, নিচে বোতামের তালিকা থাকে, আর
                Process গুলোকে গাছের মতো সাজাতে পারে। Ubuntu তে না থাকলে বসিয়ে নিন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "install-htop.sh",
          code: `sudo apt update
sudo apt install -y htop
htop                 # সব
htop -u mytours      # শুধু mytours এর Process`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে অনুশীলনের Server এ চালানো আসল htop, শুধু mytours এর Process গুলো, যখন App
              টা 300 MB ধরে রেখেছিল। লেখা হিসেবে তোলা, তাই রং নেই, আর নিচের দিকে কয়েকটা একই
              রকম লাইন বাদ দেওয়া।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "htop-mytours.txt",
          code: `    0[|||||||||||||||||||||||||||||||||||||||||||||||99.2%] Tasks: 10, 12 thr, 0 kthr; 4 running
    1[|||||||||||||||||||||||||||||||||||||||||||||||98.4%] Load average: 13.25 6.05 3.33
    2[||||||||||||||||||||||||||||||||||||||||||||||100.0%] Uptime: 04:22:04
    3[|||||||||||||||||||||||||||||||||||||||||||||||99.2%]
  Mem[|||||||||||||||||||||||||||||||||||||||||3.13G/5.77G]
  Swp[                                               0K/0K]

  [Main] [I/O]
    PID USER       PRI  NI  VIRT   RES   SHR S  CPU%-MEM%   TIME+  Command
    198 mytours     20   0  893M  350M 39228 S   0.0  5.9  0:27.94 /usr/bin/node /srv/my-tours/server.js
    200 mytours     20   0  893M  350M 39228 S   0.0  5.9  0:00.00 /usr/bin/node /srv/my-tours/server.js
    201 mytours     20   0  893M  350M 39228 S   0.0  5.9  0:00.00 /usr/bin/node /srv/my-tours/server.js
F1Help  F2Setup F3SearchF4FilterF5Tree  F6SortByF7Nice -F8Nice +F9Kill  F10Quit`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>উপরের চারটা দাগ</strong> চারটা Core, প্রতিটার পাশে শতাংশ। top এর{" "}
                  <code>1</code> চাপা চেহারাটাই, কিন্তু এক নজরে। আসল রঙিন htop এ দাগের রং বলে সময়টা
                  কোন কাজে গেল। কোন রং কোন কাজ, সেটা htop এর মধ্যেই <code>F1</code> চাপলে লেখা
                  আছে।
                </ListItem>
                <ListItem>
                  <strong>Mem আর Swp</strong> দুইটা দাগ, পাশে ব্যবহার আর মোট। ডান দিকে Tasks, Thread
                  এর সংখ্যা, Load average আর Uptime।
                </ListItem>
                <ListItem>
                  <strong>একই node তিনবার?</strong> না, এটা একটাই Process। PID 198 মূল Process, আর
                  200, 201 তার Thread। Node এর JavaScript এক Thread এ চলে, কিন্তু File পড়া আর
                  এরকম কাজের জন্য ভেতরে আরও কয়েকটা Thread রাখে। htop নিজে থেকে এগুলোও দেখায়,{" "}
                  <code>H</code> চাপলে লুকায়। VIRT আর RES সবার একই, কারণ সবাই একই Memory ভাগ
                  করে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই ছবিতে একটা অদ্ভুত জিনিস লক্ষ্য করেছেন? চারটা Core প্রায় 100% ভরা, অথচ তালিকার
                কোনো Process এর CPU% শূন্যের বেশি নয়। কারণটা হলো, অনুশীলনের Server টা একটা বড়
                যন্ত্রের ভেতরের Container, আর সেই মুহূর্তে যন্ত্রের অন্য কাজগুলো CPU খাচ্ছিল। দাগগুলো
                পুরো যন্ত্রের, তালিকা শুধু এই Server এর। আসল VPS এ ঠিক এই অনুভূতিটা আপনি পাবেন
                যখন st বেশি: CPU ব্যস্ত দেখাচ্ছে, অথচ আপনার কেউ দায়ী নয়। শিক্ষাটা হলো, দাগ ভরা
                কিন্তু তালিকা খালি মানে খরচটা হচ্ছে আপনার চোখের বাইরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["চাপুন", "কাজ"],
          rows: [
            [mono("F3 বা /"), "নাম দিয়ে খোঁজা, পরেরটায় যেতে আবার F3"],
            [mono("F4 বা \\"), "Filter, যেমন node লিখলে শুধু node এর লাইন থাকে"],
            [mono("F5 বা t"), "Tree, কে কার সন্তান সেটা গাছের মতো"],
            [mono("F6"), "কোন কলাম দিয়ে সাজাবেন বেছে নিন। P আর M ও কাজ করে"],
            [mono("Space"), "একটা Process চিহ্নিত করা, একসাথে কয়েকটায় Signal দিতে"],
            [mono("F9 বা k"), "Signal পাঠানো, তালিকা থেকে SIGTERM বা অন্যটা বেছে"],
            [mono("H"), "User Thread দেখানো বা লুকানো"],
            [mono("F2"), "Setup, কোন দাগ আর কোন কলাম থাকবে বদলানো"],
            [mono("F10 বা q"), "বেরোনো"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "htop থেকে Kill করার আগে",
          content: (
            <p>
              htop এ F9 চেপে একটা Process মেরে ফেলা খুব সহজ, আর সেজন্যই সাবধান। যে Process টা
              systemd চালাচ্ছে, যেমন my-tours-api, সেটা মারলে systemd তাকে নিজেই আবার চালু করবে
              (লেসন ০২ এর Restart=on-failure)। আর হুট করে SIGKILL দিলে চলমান বুকিং গুলো মাঝপথে
              কাটা পড়ে। Service থামাতে বা নতুন করে চালাতে সবসময় <code>systemctl</code> ব্যবহার
              করুন। htop এর Kill রাখুন সেই অবাধ্য Process এর জন্য যাকে কেউ চালায়নি বলে মনে হয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "memory",
      subHeader: { index: "007", title: "Memory" },
      title: <SectionTitle>free -h: খালি জায়গা কম, তবু ভয় নেই কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Memory দেখার সবচেয়ে সোজা কমান্ড <code>free</code>, আর <code>-h</code> মানে মানুষের
              পড়ার মতো একক, যেমন Gi আর Mi। অনুশীলনের Server এ:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "free.sh",
          code: `deploy@island-vps-01:~$ free -h
               total        used        free      shared  buff/cache   available
Mem:           5.8Gi       1.6Gi       1.5Gi       627Mi       3.5Gi       4.1Gi
Swap:             0B          0B          0B`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  {mono("total")} মোট RAM।
                </ListItem>
                <ListItem>
                  {mono("free")} একদম খালি, কেউ কোনো কাজে লাগায়নি।
                </ListItem>
                <ListItem>
                  {mono("buff/cache")} Linux যা নিজে থেকে কাজে লাগিয়েছে: Disk থেকে পড়া File গুলোর কপি,
                  যাতে আবার লাগলে ধীর Disk এ যেতে না হয়।
                </ListItem>
                <ListItem>
                  {mono("shared")} একাধিক Process এর ভাগ করা Memory, আর tmpfs এর মতো RAM এর উপরে
                  বানানো Filesystem।
                </ListItem>
                <ListItem>
                  {mono("available")} নতুন কোনো Program এলে মোট কতটা পাবে, Cache থেকে ছেড়ে দেওয়া
                  যায় এমন অংশ সহ। এটাই আসল সংখ্যা।
                </ListItem>
                <ListItem>
                  {mono("used")} এখনকার free এ এর হিসাব সোজা: total থেকে available বাদ। Ubuntu
                  24.04 এর procps 4 থেকে এভাবেই গোনা হয়। পুরনো Server এ পুরনো free অন্যভাবে গুনত,
                  তাই দুই যন্ত্রের used না মিললে অবাক হবেন না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Module 01 এ RAM কে বলেছিলাম কাজের টেবিল। Linux এর একটা অভ্যাস আছে যা প্রথমবার দেখে
                অনেকে ভয় পান: টেবিলের খালি জায়গা সে ফেলে রাখে না। যে File একবার পড়া হয়েছে, তার একটা
                কপি টেবিলের কোণে রেখে দেয়। কেউ আবার চাইলে আলমারি পর্যন্ত যেতে হয় না। আর কোনো Program এর
                জায়গা দরকার হলে সেই কপিগুলো চুপচাপ সরিয়ে জায়গা করে দেয়। খালি টেবিল মানে নষ্ট টেবিল,
                এটাই Linux এর দর্শন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MemoryBarDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে Memory এর চিন্তা কখন? যখন <strong>available</strong> মোটের 10% এর নিচে নেমে
                যায় আর সেখানেই থাকে, অথবা যখন Swap ব্যবহার বাড়তে থাকে। free ছোট থাকা নিজে কোনো
                সমস্যা নয়, ব্যস্ত Server এ সেটাই স্বাভাবিক।
              </ContentParagraph>
              <ContentParagraph>
                একটা Program কতটা Memory নিচ্ছে, সেটা free বলে না। তার জন্য top এ <code>M</code>,
                অথবা <code>ps</code>। নিচে App টাকে 300 MB ধরে রাখতে বলার আগে আর পরে free, আর
                তারপর সেই Process এর RSS, যা top এর RES এরই আরেক নাম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "memory-before-after.sh",
          code: `deploy@island-vps-01:~$ free -h          # আগে
               total        used        free      shared  buff/cache   available
Mem:           5.8Gi       1.7Gi       953Mi       627Mi       4.0Gi       4.1Gi

deploy@island-vps-01:~$ free -h          # App 300 MB ধরে রাখার পরে
               total        used        free      shared  buff/cache   available
Mem:           5.8Gi       2.0Gi       646Mi       627Mi       4.0Gi       3.8Gi

deploy@island-vps-01:~$ ps -o pid,user,%cpu,%mem,rss,etime,cmd -p 198
    PID USER     %CPU %MEM   RSS     ELAPSED CMD
    198 mytours  54.9  5.9 358744      00:50 /usr/bin/node /srv/my-tours/server.js

deploy@island-vps-01:~$ systemctl status my-tours-api | grep Memory
     Memory: 313.6M (peak: 313.9M)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              available প্রায় 300 MB কমল, used প্রায় তেমনই বাড়ল, ঠিক যা আশা করা যায়। আর শেষ
              লাইনটা লক্ষ্য করুন: systemd নিজেও প্রতিটা Service এর Memory হিসাব রাখে, peak সহ।
              একটা Service দিনে সর্বোচ্চ কত Memory খেয়েছিল, সেটা এখান থেকেই জানা যায়, আলাদা কোনো
              যন্ত্র ছাড়াই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "swap-oom",
      subHeader: { index: "008", title: "Swap and OOM" },
      title: <SectionTitle>Swap আর OOM Killer: Memory ফুরালে কী ঘটে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                টেবিল ভরে গেলে কী হয়? প্রথমে Linux Cache সরায়। তাতেও না কুলালে কম ব্যবহার হওয়া
                জিনিস টেবিল থেকে নামিয়ে রাখে নিচের ড্রয়ারে। এই ড্রয়ার হলো Disk এর একটা অংশ, যাকে বলে
                Swap। জিনিস হারায় না, কিন্তু ড্রয়ার থেকে আবার তুলতে সময় লাগে, কারণ Disk RAM এর চেয়ে
                বহুগুণ ধীর।
              </ContentParagraph>
              <ContentParagraph>
                আর যদি ড্রয়ারও ভরা থাকে, বা ড্রয়ারই না থাকে? তখন Kernel এর শেষ উপায় একজন জল্লাদ,
                যার নাম OOM Killer, Out Of Memory Killer। সে হিসাব করে কোন Process সবচেয়ে বেশি
                Memory নিয়ে বসে আছে আর তাকে সাথে সাথে SIGKILL দেয়। কোনো ভদ্র বিদায় নেই, চলমান
                বুকিং মাঝপথে কাটা।
              </ContentParagraph>
              <ContentParagraph>
                অনুশীলনের Server এ এটা ইচ্ছা করে ঘটানো হয়েছিল। App এর Service এ systemd দিয়ে একটা
                সীমা বসানো হলো, MemoryMax=200M, মানে এই Service 200 MB এর বেশি পাবে না। তারপর
                App কে বলা হলো একটু একটু করে 300 MB ধরে রাখতে। Journal এ যা এলো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "oom-kill.sh",
          code: `deploy@island-vps-01:~$ journalctl -u my-tours-api -n 5 -o short-iso
2026-10-31T07:28:07+00:00 island-vps-01 systemd[1]: my-tours-api.service: A process of this unit has been killed by the OOM killer.
2026-10-31T07:28:07+00:00 island-vps-01 systemd[1]: my-tours-api.service: Main process exited, code=killed, status=9/KILL
2026-10-31T07:28:07+00:00 island-vps-01 systemd[1]: my-tours-api.service: Failed with result 'oom-kill'.
2026-10-31T07:28:07+00:00 island-vps-01 systemd[1]: my-tours-api.service: Scheduled restart job, restart counter is at 1.
2026-10-31T07:28:07+00:00 island-vps-01 systemd[1]: Started my-tours-api.service - my-tours API.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পাঁচ লাইনে পুরো ঘটনা। OOM Killer Process টা মারল, {mono("status=9/KILL")} মানে
                SIGKILL, ফলাফল {mono("oom-kill")}, আর Restart=on-failure থাকায় systemd সাথে সাথে App
                আবার চালু করল। পর্যটকের দিক থেকে কয়েকটা Request এর উত্তর আসেনি, তারপর সব আবার ঠিক।
                এমন লাইন Journal এ কীভাবে খুঁজবেন আর Kernel এর নিজের OOM লাইন কোথায় থাকে, সেটা
                লেসন ০৭ এর{" "}
                <Link href="/devops/topic/system-logs" className={linkClass}>
                  System Logs
                </Link>{" "}
                এ। এখানে মনে রাখুন শুধু এটুকু: App নিজে নিজে Restart হচ্ছে দেখলে প্রথম সন্দেহ Memory।
              </ContentParagraph>
              <ContentParagraph>
                ছোট VPS এ Swap একটা গদির কাজ করে। হঠাৎ একটু বেশি Memory লাগলে OOM Killer ডাকার আগে
                Linux কিছু জিনিস Swap এ নামিয়ে সময় কেনে। অনেক VPS কোনো Swap ছাড়াই আসে, তাই প্রথমে
                দেখে নিন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "add-swapfile.sh",
          code: `# ১. আছে কি না দেখুন। কিছু না ছাপলে Swap নেই।
swapon --show
free -h

# ২. 2 GB এর একটা File বানিয়ে শুধু root এর পড়ার মতো করুন, তারপর Swap হিসেবে সাজান
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
ls -lh /swapfile
#   -rw------- 1 root root 2.0G Oct 31 07:26 /swapfile
sudo mkswap /swapfile
#   Setting up swapspace version 1, size = 2 GiB (2147479552 bytes)
#   no label, UUID=e2be34d1-f6bc-40ad-a324-34b9bad365c6

# ৩. চালু করুন, আর Reboot এর পরেও যেন চালু থাকে
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# ৪. Linux কত তাড়াতাড়ি Swap এ নামাবে। Default 60, Server এ কম রাখাই ভালো।
cat /proc/sys/vm/swappiness
#   60
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swappiness.conf
sudo sysctl --system

# ৫. মিলিয়ে দেখুন
swapon --show
free -h`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে দুইটা কথা খোলাখুলি বলি। প্রথম দুইটা ধাপের Output আসল, অনুশীলনের Server থেকে।
                তিন নম্বর ধাপ, <code>swapon</code>, সেখানে চালানো হয়নি, কারণ একটা Container এ
                Swap চালু করলে সেটা পুরো বড় যন্ত্রের উপর পড়ে। আপনার নিজের VPS বা অনুশীলনের VM এ নিশ্চিন্তে
                চালান, এই ধাপগুলোই Ubuntu তে Swap যোগ করার প্রচলিত পথ।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় কথা, Swap গদি, ওষুধ নয়। একটা App এর Memory যদি দিনভর বাড়তেই থাকে, যাকে বলে
                Memory Leak, Swap শুধু মৃত্যুটা পিছিয়ে দেয়, আর মাঝের সময়টা সবকিছু ধীর করে দেয়।
                সবচেয়ে খারাপ অবস্থার নাম Thrashing: Linux সারাক্ষণ জিনিস ড্রয়ারে নামাচ্ছে আর তুলছে, আসল
                কাজ প্রায় হয়ই না, SSH এ ঢুকতেও মিনিট লাগে। এটা ধরা পড়ে পরের যন্ত্র vmstat এর si আর so
                কলামে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একটা Service যেন পুরো Server না খেয়ে ফেলে",
          content: (
            <p>
              উপরের পরীক্ষায় যে MemoryMax ব্যবহার হলো, সেটা আসলে একটা ভালো অভ্যাস। Service এর Unit
              File এ <code>MemoryMax=</code> বসালে সেই Service একটা নির্দিষ্ট সীমার বেশি Memory পায় না।
              সীমা পার হলে মারা পড়ে শুধু সেই Service, পুরো Server এর OOM Killer কাকে বেছে নেবে সেই
              অনিশ্চয়তা থাকে না, আর Database এর মতো জরুরি জিনিস বেঁচে যায়। Unit File এ কোথায় কীভাবে
              লিখবেন, সেটা লেসন ০২ এর{" "}
              <Link href="/devops/topic/process-management-systemd" className={linkClass}>
                Process Management &amp; Systemd
              </Link>{" "}
              এর Drop-in Override এর নিয়মে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "vmstat",
      subHeader: { index: "009", title: "vmstat" },
      title: <SectionTitle>vmstat, প্রতি সেকেন্ডে পুরো যন্ত্রের এক লাইন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                top একটা ছবি দেখায়, যা কয়েক সেকেন্ড পর বদলে যায় আর আগেরটা হারিয়ে যায়।{" "}
                <code>vmstat 1</code> প্রতি সেকেন্ডে পুরো যন্ত্রের এক লাইন নিচে নিচে ছাপে, ফলে চোখের
                সামনে একটা ছোট ইতিহাস জমে। কিছু একটা হঠাৎ শুরু হলো কি না, সেটা এভাবে দেখা সবচেয়ে সহজ।
                শেষের সংখ্যাটা বলে কয়বার ছাপবে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Output তোলা হয়েছিল ঠিক তখন, যখন অনুশীলনের Server এ একটা পুরনো Backup এর মতো
                1 GB এর একটা File Disk এ লেখা হচ্ছিল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "vmstat.sh",
          code: `deploy@island-vps-01:~$ vmstat 1 3
procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
 1  1      0 569920 508664 3670444    0    0    90  2207 2981   12  5  4 90  1  0  0
 0  2      0 564632 508664 3670520    0    0     0   148 43831 87446  2  6 68 24  0  0
 0  0      0 556312 508668 3679796    0    0     0  8532 49673 103832  5 10 66 20  0  0`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["দল", "কলাম", "মানে", "চিন্তার সংকেত"],
          rows: [
            ["procs", mono("r"), "চলছে বা CPU এর লাইনে", "Core সংখ্যার চেয়ে একটানা বেশি"],
            ["procs", mono("b"), "Disk এর অপেক্ষায় আটকে (D)", "একটানা শূন্যের উপরে"],
            ["memory", mono("swpd, free, buff, cache"), "KiB তে Swap এ রাখা, খালি, Buffer আর Cache", "swpd বাড়তে থাকা"],
            ["swap", mono("si, so"), "প্রতি সেকেন্ডে Swap থেকে তোলা আর Swap এ নামানো", "একটানা শূন্যের উপরে: Thrashing"],
            ["io", mono("bi, bo"), "প্রতি সেকেন্ডে Disk থেকে পড়া আর Disk এ লেখা Block", "নিজে খারাপ নয়, wa এর সাথে মিলিয়ে পড়ুন"],
            ["system", mono("in, cs"), "Interrupt আর Context Switch", "স্বাভাবিক দিনের তুলনায় হঠাৎ অনেক বেশি"],
            ["cpu", mono("us sy id wa st gu"), "top এর CPU লাইনের মতো, gu হলো Guest", "wa আর st আগের নিয়মেই"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম লাইনটা একটা ফাঁদ, তাই সবার আগে বলি। vmstat এর প্রথম লাইন এই মুহূর্তের নয়, Server
                চালু হওয়ার পর থেকে পুরো সময়ের গড়। তাই প্রথম লাইনটা প্রায় সবসময় শান্ত দেখায়। আসল খবর
                দ্বিতীয় লাইন থেকে। এখানে দ্বিতীয় লাইনে {mono("b")} 2, মানে দুইটা Process Disk এর
                অপেক্ষায় আটকে, আর {mono("wa")} 24, মানে CPU এর প্রায় এক চতুর্থাংশ সময় কাটছে Disk এর
                অপেক্ষায়। লেখার কাজটা শেষ হতেই তৃতীয় লাইনে b আবার শূন্য। Backup এর সময় সাইট ধীর হয়
                কেন, এই দুইটা কলামই তার উত্তর।
              </ContentParagraph>
              <ContentParagraph>
                আর si ও so দুইটাই শূন্য, কারণ এই Server এ Swap নেই। Memory এর চাপে থাকা কোনো Server
                এ এই দুই কলামে একটানা সংখ্যা দেখলে বুঝবেন Thrashing চলছে, আর তখন বাকি সব সংখ্যা ভুলে
                আগে Memory এর সমস্যা মেটাতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "disk-space",
      subHeader: { index: "010", title: "Disk Space" },
      title: <SectionTitle>df আর du: আলমারি কতটা ভরা, আর কে ভরাল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Disk ভরে যাওয়া Server এর সবচেয়ে সাধারণ আর সবচেয়ে অপমানজনক মৃত্যু। কোনো জটিল Bug
                নয়, শুধু জায়গা নেই। তখন Database লিখতে পারে না, App এর Log লেখা থেমে যায়, Deploy
                আটকে যায়, এমনকি SSH এ ঢোকার সময়ও অদ্ভুত Error আসে। Error বার্তাটা সাধারণত এরকম:{" "}
                <code>No space left on device</code>।
              </ContentParagraph>
              <ContentParagraph>
                দুইটা যন্ত্র, দুইটা আলাদা প্রশ্নের উত্তর। <code>df</code> মানে Disk Free, Filesystem
                এর দিক থেকে কতটা ভরা। <code>du</code> মানে Disk Usage, Folder ধরে ধরে কে কতটা নিয়েছে।
                আগে df দিয়ে জানুন সমস্যা আছে কি না, তারপর du দিয়ে খুঁজুন কোথায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "df-du.sh",
          code: `# কতটা ভরা। -h মানুষের পড়ার মতো একক
deploy@island-vps-01:~$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
overlay          98G   15G   78G  17% /

# Inode, মানে File এর সংখ্যার হিসাব। জায়গা থাকলেও এটা ফুরাতে পারে।
deploy@island-vps-01:~$ df -i /
Filesystem      Inodes  IUsed   IFree IUse% Mounted on
overlay        6553600 194698 6358902    3% /

# /var এর ভেতরে কোন Folder কত বড়, ছোট থেকে বড় সাজিয়ে
deploy@island-vps-01:~$ sudo du -xh --max-depth=1 /var | sort -h | tail -5
1.8M	/var/cache
8.2M	/var/lib
8.6M	/var/log
1.1G	/var
1.1G	/var/backups

# 100 MB এর বড় একক File গুলো, পুরো Root Filesystem এ
deploy@island-vps-01:~$ sudo find / -xdev -type f -size +100M -exec ls -lh {} +
-rw-r--r-- 1 root root 1.0G Oct 31 07:26 /var/backups/islandtours/old-2026-10-01.dump`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  অনুশীলনের Server এ Filesystem এর নাম overlay, কারণ সেটা Container। আসল VPS এ দেখবেন
                  <code> /dev/vda1</code> বা <code>/dev/sda1</code> এর মতো একটা Disk এর নাম, আর মাপ
                  আপনার Plan এর, যেমন Island Tours এর 80G।
                </ListItem>
                <ListItem>
                  <code>du</code> এর <code>-x</code> মানে অন্য Filesystem এ ঢুকো না, যাতে /proc এর মতো
                  কাল্পনিক জায়গা হিসাবে না আসে। <code>--max-depth=1</code> মানে শুধু এক স্তর নিচ পর্যন্ত।
                  সবচেয়ে বড় Folder টা পেলে তার ভেতরে একই কমান্ড আবার চালান, এভাবে নামতে নামতে আসল
                  দোষীকে পাবেন।
                </ListItem>
                <ListItem>
                  <code>df -i</code> একটা লুকানো ফাঁদের জন্য। প্রতিটা File এর জন্য Filesystem একটা
                  Inode খরচ করে, আর Inode এর সংখ্যা Disk বানানোর সময়ই ঠিক হয়ে যায়। লাখ লাখ ছোট File,
                  যেমন পুরনো Session বা Cache এর File, জমলে জায়গা অনেক বাকি থাকতেও IUse% 100 হয়ে
                  যায়, আর তখনো একই No space left on device আসে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার সবচেয়ে বিভ্রান্তিকর অবস্থা। কোনো বড় Log File খুঁজে পেলেন, <code>rm</code> দিয়ে
                মুছলেন, df আবার চালালেন, আর জায়গা একটুও কমল না। অনুশীলনের Server এ ঠিক এটা ঘটানো
                হয়েছিল: একটা Process একটা 800 MB এর Log File খুলে রেখেছিল, আর সেই অবস্থায় File টা
                মুছে দেওয়া হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deleted-but-open.sh",
          code: `deploy@island-vps-01:~$ df -h / | tail -1          # Log টা থাকা অবস্থায়
overlay          98G   16G   78G  17% /
deploy@island-vps-01:~$ sudo rm /var/log/my-tours/api.log
deploy@island-vps-01:~$ df -h / | tail -1          # মোছার পরে, একই!
overlay          98G   16G   78G  17% /
deploy@island-vps-01:~$ sudo du -sh /var/log/my-tours
4.0K	/var/log/my-tours

# মুছে ফেলা কিন্তু এখনো খোলা File গুলো খুঁজুন
deploy@island-vps-01:~$ sudo lsof +L1
COMMAND PID USER   FD   TYPE DEVICE  SIZE/OFF NLINK    NODE NAME
python3 338 root    3w   REG  0,249 838860800     0 1985031 /var/log/my-tours/api.log (deleted)

deploy@island-vps-01:~$ sudo kill 338                # যে ধরে রেখেছে, তাকে থামানো
deploy@island-vps-01:~$ df -h / | tail -1
overlay          98G   15G   78G  17% /`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DiskGhostSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Linux এ একটা File এর নাম আর তার আসল Data আলাদা জিনিস। <code>rm</code> শুধু
                Folder থেকে নামটা মোছে। কোনো Process যতক্ষণ File টা খুলে রেখেছে, Kernel আসল Data টা
                রেখে দেয়, কারণ সেই Process এখনো লিখছে বা পড়ছে। <code>lsof +L1</code> মানে এমন খোলা
                File দেখানো যার নাম আর কোথাও নেই, NLINK কলামে শূন্য। বাস্তবে এর দোষী প্রায় সবসময় এমন
                কোনো App বা Service যার Log File কেউ হাতে মুছে দিয়েছে। সমাধান সেই Service কে নতুন করে
                চালানো, <code>sudo systemctl restart</code> দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                ভবিষ্যতে যাতে এমন না হয়: চলমান App এর Log কখনো <code>rm</code> দিয়ে মুছবেন না। আকার
                শূন্য করতে চাইলে <code>sudo truncate -s 0 file.log</code>, আর স্থায়ী ব্যবস্থা হলো
                logrotate আর Journal এর সীমা, যা লেসন ০৭ এ শিখেছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["সাধারণ দোষী", "কোথায় থাকে", "নিরাপদে কী করবেন"],
          rows: [
            ["Journal আর পুরনো Log", mono("/var/log"), "journalctl --vacuum-size, logrotate (লেসন ০৭)"],
            ["রাতের Backup যা কেউ মোছে না", mono("/var/backups"), "Retention সহ Backup, যেমন ৭ দিন (লেসন ১০)"],
            ["Docker এর পুরনো Image আর Container", mono("/var/lib/docker"), "docker system df দিয়ে দেখা, Docker Module এ পরিষ্কার করা"],
            ["apt এর ডাউনলোড করা Package", mono("/var/cache/apt"), "sudo apt clean"],
            ["ব্যবহারকারীর Upload করা ছবি", mono("/srv/islandtours"), "Object Storage এ সরানো, পরের Module গুলোতে"],
            ["মুছে ফেলা কিন্তু খোলা File", "কোথাও দেখা যায় না", "lsof +L1, তারপর সেই Service Restart"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "জায়গা খালি করতে গিয়ে কী কখনো মুছবেন না",
          content: (
            <p>
              <code>/var/lib</code> এর ভেতরের জিনিস, যেমন <code>/var/lib/postgresql</code> বা{" "}
              <code>/var/lib/docker</code>, হাতে কখনো মুছবেন না। ওগুলো চলমান Program এর আসল Data,
              Database এর File। জায়গা ফেরত পাবেন, সাথে Database টাও হারাবেন। প্রতিটা জিনিস তার
              নিজের যন্ত্র দিয়ে পরিষ্কার করুন: Journal এর জন্য journalctl, Docker এর জন্য docker, apt
              এর জন্য apt। আর Disk 80% ছাড়ালেই খোঁজা শুরু করুন, 100% এর অপেক্ষা করবেন না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "disk-io",
      subHeader: { index: "011", title: "Disk I/O" },
      title: <SectionTitle>iostat: জায়গা আছে, তবু Disk সবাইকে দাঁড় করিয়ে রাখছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Disk এর দুইটা আলাদা অসুখ হয়। একটা ভরে যাওয়া, যা df দেখায়। আরেকটা ব্যস্ততা: জায়গা
                প্রচুর, কিন্তু Disk একসাথে এত কাজ পেয়েছে যে প্রতিটা অনুরোধের উত্তর দিতে দেরি হচ্ছে। top
                এ wa বাড়ে, vmstat এ b বাড়ে, আর কোন Disk কতটা ব্যস্ত সেটা বলে <code>iostat</code>।
                এটা আসে <code>sysstat</code> Package এর সাথে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "iostat.sh",
          code: `sudo apt install -y sysstat

# -d শুধু Disk, -x বিস্তারিত, -y প্রথম "চালু থেকে গড়" লাইনটা বাদ, 1 সেকেন্ড পর পর
deploy@island-vps-01:~$ iostat -dxy 1 2 vdb
# অনুশীলনের Server এ বড় একটা লেখার মাঝে, অনেক কলাম থেকে কাজের কয়টা রেখে:
Device        r/s      rkB/s      w/s      wkB/s  w_await   %util
vdb          0.00       0.00   314.00  165380.00    30.59   81.70
vdb          0.00       0.00   478.00  459636.00     7.73   83.40`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  {mono("r/s, w/s")} প্রতি সেকেন্ডে কতগুলো পড়া আর লেখার অনুরোধ। {mono("rkB/s, wkB/s")}{" "}
                  প্রতি সেকেন্ডে কত KB। এখানে পড়া শূন্য, লেখা প্রতি সেকেন্ডে কয়েকশো MB, কারণ শুধু
                  লেখাই চলছিল।
                </ListItem>
                <ListItem>
                  {mono("r_await, w_await")} একটা অনুরোধ গড়ে কত মিলিসেকেন্ড অপেক্ষা করল, লাইনে
                  দাঁড়ানো সহ। এটাই পর্যটক টের পান। NVMe বা SSD তে সাধারণত কয়েক মিলিসেকেন্ড, তাই
                  প্রথম লাইনের 30 ms মানে লাইন জমেছিল।
                </ListItem>
                <ListItem>
                  {mono("%util")} সময়ের কত ভাগ Disk কোনো না কোনো কাজে ব্যস্ত ছিল। পুরনো ঘূর্ণায়মান Disk
                  এ 100 মানে পুরো ভরা। কিন্তু SSD আর NVMe একসাথে অনেক কাজ করতে পারে, তাই তাদের বেলায়
                  %util 100 হলেও আরও কাজ নেওয়ার ক্ষমতা থাকতে পারে। SSD তে তাই await কে বেশি বিশ্বাস
                  করুন।
                </ListItem>
                <ListItem>
                  Device এর নাম অনুশীলনের Server এ vdb। VPS এ সাধারণত <code>vda</code>,{" "}
                  <code>sda</code> বা <code>nvme0n1</code>। নাম না দিলে iostat সবগুলো দেখায়, আর{" "}
                  <code>lsblk</code> বলে কোন Disk কোথায় লাগানো।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                কোন Process এত লিখছে, সেটা জানতে <code>sudo iotop</code> খুব কাজের, যদিও আলাদা
                করে বসাতে হয়। সাধারণত উত্তরটা আগে থেকেই আন্দাজ করা যায়: রাতের Backup, একটা বড় Import,
                অথবা কোনো Log যা হঠাৎ পাগলের মতো লিখছে। Island Tours এর Backup ঠিক এই কারণে রাত সাড়ে
                তিনটায় চলে, যখন পর্যটক সবচেয়ে কম (লেসন ১০)।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "culprit",
      subHeader: { index: "012", title: "Find the Culprit" },
      title: <SectionTitle>দোষী কে: Process থেকে Service পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                top আর htop দেখতে ভালো, কিন্তু Script এ বা কাউকে পাঠানোর জন্য একটা পরিষ্কার তালিকা
                দরকার হয়। তখন <code>ps</code>। লেসন ০২ এ এর কলামগুলো চিনেছেন, এখানে শুধু সাজানোর
                কৌশল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ps-sorted.sh",
          code: `# সবচেয়ে বেশি CPU, উপরের কয়টা
deploy@island-vps-01:~$ ps aux --sort=-%cpu | head -5
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
mytours      198 46.9  0.8 607596 53464 ?        Rsl  07:25   0:13 /usr/bin/node /srv/my-tours/server.js
root           1  1.7  0.1  21080 11744 ?        Ss   07:24   0:01 /sbin/init
root          24  0.2  0.1  33688 11636 ?        S<s  07:24   0:00 /usr/lib/systemd/systemd-journald
syslog        90  0.1  0.0 222360  4176 ?        Ssl  07:24   0:00 /usr/sbin/rsyslogd -n -iNONE

# সবচেয়ে বেশি Memory
ps aux --sort=-%mem | head -5

# নিজের বেছে নেওয়া কলাম, যেমন কতক্ষণ ধরে চলছে
ps -eo pid,user,%cpu,%mem,etime,comm --sort=-%cpu | head -6`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ধাঁধা খেয়াল করুন। একই মুহূর্তে top বলছিল node এর CPU 100.0, অথচ ps বলছে 46.9।
                কেউ ভুল নয়, দুইজন দুইটা আলাদা প্রশ্নের উত্তর দিচ্ছে। top বলে শেষ কয়েক সেকেন্ডে কতটা।
                ps বলে Process শুরু হওয়া থেকে এখন পর্যন্ত গড়ে কতটা, মোট CPU সময়কে মোট চলার সময় দিয়ে
                ভাগ করে। App টা শুরুর প্রথম কিছু সেকেন্ড বসে ছিল, তারপর Report চালু হলো, তাই ps এর গড়
                অর্ধেকে নেমে এসেছে। এই মুহূর্তে কে CPU খাচ্ছে জানতে চাইলে ps এর %CPU এ ভরসা করবেন না।
              </ContentParagraph>
              <ContentParagraph>
                এই মুহূর্তের হিসাব, সেকেন্ডে সেকেন্ডে, একটা নির্দিষ্ট Process এর জন্য দেয়{" "}
                <code>pidstat</code>, sysstat এর আরেক সদস্য:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "pidstat.sh",
          code: `# my-tours-api এর মূল PID বের করে, প্রতি সেকেন্ডে তিনবার
deploy@island-vps-01:~$ pidstat -u -p $(systemctl show -p MainPID --value my-tours-api) 1 3
07:25:30      UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
07:25:31      999       198   91.00    0.00    0.00    9.00   91.00     1  node
07:25:32      999       198   91.00    0.00    0.00    9.00   91.00     1  node
07:25:33      999       198   98.00    0.00    0.00    1.00   98.00     0  node
Average:      999       198   93.33    0.00    0.00    6.33   93.33     -  node`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                {mono("%wait")} কলামটা দেখুন, এটা Disk এর wa নয়। এটা বলে Process চলতে তৈরি ছিল
                কিন্তু CPU পায়নি, লাইনে দাঁড়িয়ে ছিল। আর {mono("CPU")} কলাম বলে কোন Core এ চলছিল, যা
                প্রথম দুই সেকেন্ডে 1, তারপর 0। Kernel তাকে Core বদলে দিয়েছে, কিন্তু একসাথে কখনো দুইটায়
                নয়।
              </ContentParagraph>
              <ContentParagraph>
                এবার একটা বড় প্রশ্ন। Server এ অনেক Process, অনেকের নাম node বা python। কোনটা কোন
                Service এর? Process এর বদলে Service এর হিসাবে ভাবতে পারলে কাজ অনেক সহজ, কারণ আপনি
                থামান বা চালান Service কে। systemd প্রতিটা Service কে একটা আলাদা Control Group, সংক্ষেপে
                cgroup, এ রাখে, আর <code>systemd-cgtop</code> সেই হিসাব দেখায়, Service ধরে ধরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "systemd-cgtop.sh",
          code: `# CPU অনুযায়ী সাজিয়ে, তিন স্তর পর্যন্ত, দুইবার মেপে (প্রথমবার CPU এর ঘর ফাঁকা থাকে)
deploy@island-vps-01:~$ sudo systemd-cgtop -b -n 2 -d 1 -c --depth=3
# দ্বিতীয় মাপ থেকে কাজের লাইনগুলো। অনুশীলনের Container এর লম্বা পথ ছেঁটে / করা।
# কলাম: Control Group, Tasks, %CPU, Memory, Input/s, Output/s
/                                           26  100.3   104.8M        -        -
/system.slice                               18   99.1    24.6M        -        -
/system.slice/lab-api.service               11   99.1    15.8M        -        -
/system.slice/cron.service                   1      -   364.0K        -        -

# একটা PID কোন Service এর? systemctl status কে PID দিলেই বলে দেয়
deploy@island-vps-01:~$ systemctl status 198 | head -2
● my-tours-api.service - my-tours API
     Loaded: loaded (/etc/systemd/system/my-tours-api.service; enabled; preset: enabled)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই দুইটা অভ্যাস একসাথে খুব শক্তিশালী। top বা ps এ একটা ভারী PID পেলেন, systemctl status
              কে সেই PID দিলেন, জেনে গেলেন এটা কোন Service, কোন Unit File থেকে এসেছে, কবে চালু হয়েছে।
              এরপর সেই Service এর Log দেখবেন লেসন ০৭ এর নিয়মে, আর দরকার হলে systemctl দিয়ে
              ভদ্রভাবে নতুন করে চালাবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "health-check",
      subHeader: { index: "013", title: "Health Check" },
      title: <SectionTitle>এক মিনিটের স্বাস্থ্য পরীক্ষা, আর কোন সংখ্যায় চিন্তা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অভিজ্ঞ লোকেরা কোনো Server এ ঢুকে প্রথম মিনিটে প্রায় একই কাজ করেন: Load, Memory, Disk,
                কে সবচেয়ে ব্যস্ত, আর কোনো Service পড়ে আছে কি না। প্রতিবার পাঁচটা কমান্ড আলাদা লেখার
                বদলে একটা ছোট Script বানিয়ে রাখুন। অনুশীলনের Server এ এটার নাম <code>health</code>:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "/usr/local/bin/health",
          code: `#!/usr/bin/env bash
# Five quick looks at a Linux server: load, memory, disk, the busiest processes, failed services.
set -u
echo "== load (CPU cores: $(nproc))"; uptime
echo; echo "== memory"; free -h
echo; echo "== disk"; df -h /
echo; echo "== busiest processes"; ps -eo pid,user,%cpu,%mem,etime,comm --sort=-%cpu | head -6
echo; echo "== failed services"; systemctl --failed --no-legend --plain || true`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "health-output.txt",
          code: `deploy@island-vps-01:~$ health
== load (CPU cores: 4)
 07:38:55 up  4:33,  0 user,  load average: 1.12, 4.41, 4.80

== memory
               total        used        free      shared  buff/cache   available
Mem:           5.8Gi       1.8Gi       1.4Gi       641Mi       3.4Gi       4.0Gi
Swap:             0B          0B          0B

== disk
Filesystem      Size  Used Avail Use% Mounted on
overlay          98G   16G   78G  17% /

== busiest processes
    PID USER     %CPU %MEM     ELAPSED COMMAND
      1 root      0.2  0.1       14:50 systemd
   1106 mytours   0.0  0.7       01:42 node
     24 root      0.0  0.1       14:46 systemd-journal
     90 syslog    0.0  0.0       14:42 rsyslogd
     81 message+  0.0  0.0       14:43 dbus-daemon

== failed services`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এক নজরে পড়ুন: Load কমে আসছে (1.12 আগের 4.80 এর চেয়ে কম), available প্রচুর, Disk
                17%, কেউ CPU খাচ্ছে না, আর failed services এর নিচে কিছুই নেই, মানে কোনো Service পড়ে
                নেই। এই Server সুস্থ। ল্যাপটপ থেকে একবারে চালাতে চাইলে <code>ssh island health</code>,
                লেসন ০৩ এর SSH Alias দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                Network এর দুইটা ঝটপট সংখ্যাও কাছে রাখুন, যদিও গভীর খোঁজ পরের লেসনে।{" "}
                <code>ss -s</code> বলে কতগুলো Connection, কোন State এ। <code>ip -s link</code> বলে
                Network Card দিয়ে কত Byte গেল এলো, আর errors বা dropped বাড়ছে কি না।{" "}
                <code>sar -n DEV 1</code> বলে প্রতি সেকেন্ডে কত KB।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "network-glance.sh",
          code: `deploy@island-vps-01:~$ ss -s
Total: 34
TCP:   90 (estab 0, closed 88, orphaned 0, timewait 0)

Transport Total     IP        IPv6
RAW	  0         0         0
UDP	  0         0         0
TCP	  2         1         1
INET	  2         1         1
FRAG	  0         0         0

deploy@island-vps-01:~$ ip -s link show eth0
2: eth0@if133: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default
    RX:  bytes packets errors dropped  missed   mcast
      36833168    8373      0       0       0       0
    TX:  bytes packets errors dropped carrier collsns
        165109    2378      0       0       0       0

deploy@island-vps-01:~$ sar -n DEV 1 3 | grep -E 'IFACE|eth0' | tail -2
Average:        IFACE   rxpck/s   txpck/s    rxkB/s    txkB/s   rxcmp/s   txcmp/s  rxmcst/s   %ifutil
Average:         eth0     21.52     29.47     12.60      3.51      0.00      0.00      0.00      0.00`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সবচেয়ে কাজের প্রশ্ন: কোন সংখ্যা দেখলে চিন্তা করবেন? নিচের টেবিলের সীমাগুলো
              অভিজ্ঞতা থেকে আসা আন্দাজ, পাথরে খোদাই করা নিয়ম নয়। একটা কথা তার চেয়েও বড়: নিজের
              Server এর স্বাভাবিক দিনের সংখ্যা জেনে রাখুন। স্বাভাবিকে Load 0.4 থাকা Server এ হঠাৎ 1.5
              দেখা, টেবিলের যেকোনো সীমার চেয়ে বেশি খবর দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লক্ষণ", "কোথায় দেখবেন", "স্বাভাবিক", "চিন্তার সংকেত", "প্রথম পদক্ষেপ"],
          rows: [
            ["Load", "uptime", "প্রতি Core এ 0.7 এর নিচে", "১৫ মিনিটের গড়েও প্রতি Core এ 1 এর বেশি", "top, P"],
            ["CPU", "top এর %Cpu(s)", "id যথেষ্ট বড়", "id প্রায় শূন্য একটানা", "কে us খাচ্ছে"],
            ["I/O wait", "top, vmstat", "wa কয়েকের ঘরে", "wa 10 থেকে 20 এর উপরে একটানা", "iostat, b কলাম"],
            ["Steal", "top, vmstat", "st প্রায় শূন্য", "st 5 থেকে 10 এর উপরে কয়েক ঘণ্টা", "Provider কে জানান"],
            ["Memory", "free -h", "available যথেষ্ট", "available মোটের 10% এর নিচে", "top, M"],
            ["Swap", "vmstat", "si, so শূন্য", "si, so একটানা শূন্যের উপরে", "Memory এর দোষী খুঁজুন"],
            ["Disk Space", "df -h, df -i", "Use% 80 এর নিচে", "80 এ খোঁজা শুরু, 90 এ এখনই", "du, find, lsof +L1"],
            ["Disk Busy", "iostat -dx", "await কয়েক ms", "await অনেক বেশি আর %util প্রায় 100", "কে লিখছে, কখন"],
            ["Network", "ip -s link", "errors, dropped শূন্য", "errors বা dropped বাড়ছে", "লেসন ০৯"],
            ["Services", "systemctl --failed", "খালি", "যেকোনো একটা", "journalctl -u (লেসন ০৭)"],
          ],
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TriageLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "চোখে দেখা থেকে নিজে থেকে খবর পাওয়া",
          content: (
            <p>
              এই লেসনের সব যন্ত্র কাজ করে তখনই, যখন আপনি Server এ ঢুকে চালান। কিন্তু রাত তিনটায় Disk
              ভরে গেলে কেউ ঢুকে দেখবে না। তাই একটা সময়ের পরে দরকার এমন ব্যবস্থা, যা প্রতি মিনিটে এই
              সংখ্যাগুলো নিজে মাপে, Graph এ রাখে আর সীমা পার হলেই খবর পাঠায়। শুরুটা সহজ: Provider এর
              Dashboard এ CPU, Disk আর Network এর Graph প্রায় সবসময় বিনা খরচে থাকে, আর বাইরের একটা
              Uptime Check সেবা প্রতি মিনিটে আপনার সাইট খুলে দেখতে পারে। পূর্ণ ব্যবস্থা, যেমন
              Prometheus আর Grafana বা Netdata, আসবে Observability Module এ। সেখানে প্রতিটা Graph চিনতে
              পারবেন, কারণ সংখ্যাগুলো আজ শিখলেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "see-it",
      subHeader: { index: "014", title: "Hands-on" },
      title: <SectionTitle>নিজের চোখে দেখা: ইচ্ছা করে চাপ দিন, যন্ত্রগুলো কী বলে দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পড়ে বোঝা এক জিনিস, নিজের Server এ সংখ্যা নড়তে দেখা আরেক জিনিস। নিচের পরীক্ষাগুলো
                শুধু Ubuntu এর সাথে আসা যন্ত্র দিয়ে, আপনার অনুশীলনের Server এ (লেসন ০১ এ যেটা
                বানিয়েছেন)। প্রতিটা চাপ নিজে থেকেই থেমে যায়, তাই ভুলে গেলেও Server আটকে থাকবে না।
                দুইটা Terminal খুলুন, দুইটাতেই Server এ ঢুকুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "প্রথম Terminal এ top খুলে রাখুন",
              description:
                "top লিখে Enter, তারপর 1 চাপুন যাতে প্রতিটা Core আলাদা দেখা যায়। এই Terminal টা শুধু দেখার জন্য।",
            },
            {
              title: "দ্বিতীয় Terminal এ একটা Core ভরান",
              description:
                "timeout 60 yes > /dev/null & লিখুন। yes নামের Program টা অনবরত y লিখতে থাকে, আর লেখাটা ফেলে দেওয়া হচ্ছে /dev/null এ। top এ দেখবেন একটা Core 100 এর কাছে উঠল, আর তালিকার সবার উপরে yes, CPU 100.0।",
            },
            {
              title: "আরেকটা চালান, তারপর আরেকটা",
              description:
                "একই কমান্ড আবার দিন। এখন দুইটা Core ভরা। আপনার Core সংখ্যার চেয়ে একটা বেশি চালান। কোনো yes ই আর 100 পাবে না, কারণ Core এর চেয়ে কাজ বেশি, তারা পালা করে চলছে। এটাই লাইনে দাঁড়ানো।",
            },
            {
              title: "Load বাড়তে দেখুন",
              description:
                "top এর প্রথম লাইনে Load average এর প্রথম সংখ্যাটা প্রতি কয়েক সেকেন্ডে উঠছে, তৃতীয়টা প্রায় নড়ছে না। এক মিনিট পরে timeout সবাইকে থামিয়ে দেবে, আর প্রথম সংখ্যাটা ধীরে ধীরে নামবে। গড় এক মুহূর্তে শূন্য হয় না।",
            },
            {
              title: "Cache কে কাজ করতে দেখুন",
              description:
                "দ্বিতীয় Terminal এ: dd if=/dev/urandom of=$HOME/big.bin bs=1M count=500 oflag=direct, তারপর free -h। এরপর cat $HOME/big.bin > /dev/null, আবার free -h। buff/cache প্রায় 500M বাড়বে, free প্রায় ততটাই কমবে, অথচ available প্রায় নড়বে না। Linux পড়া File এর কপি রাখল, আর জানে দরকার হলে ছেড়ে দেবে।",
            },
            {
              title: "পরিষ্কার করুন",
              description:
                "rm $HOME/big.bin। jobs লিখে দেখুন কোনো yes বাকি আছে কি না, থাকলে kill %1 এর মতো করে থামান। top থেকে q চেপে বেরোন।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "two-cpu-hogs.sh",
          code: `# অনুশীলনের Server এ দুইটা yes একসাথে, ছয় সেকেন্ড পরে নেওয়া আসল ছবি
deploy@island-vps-01:~$ timeout 15 yes > /dev/null &
deploy@island-vps-01:~$ timeout 15 yes > /dev/null &
deploy@island-vps-01:~$ top -b -n 1 -o %CPU | sed -n 7,10p
    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   1113 root      20   0    2268   1164   1076 R 100.0   0.0   0:06.37 yes
   1114 root      20   0    2268   1152   1060 R 100.0   0.0   0:06.38 yes
      1 root      20   0   21176  11828   8892 S   0.0   0.2   0:02.34 systemd`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Cache এর পরীক্ষাটা কেন এখানে ছবি ছাড়া",
          content: (
            <p>
              ধাপ ৫ এর আসল সংখ্যা এখানে দেওয়া হয়নি, আর কারণটা সৎভাবে বলি। অনুশীলনের Server যে বড়
              যন্ত্রে চলে, সেখানে একই সময়ে অন্য কাজ Memory নিচ্ছিল আর ছাড়ছিল, তাই free এর সংখ্যাগুলো
              শুধু এই File এর কারণে নড়েনি, ছবিটা বিভ্রান্তিকর হতো। আপনার নিজের ফাঁকা VM বা VPS এ এমন
              অন্য কেউ নেই, সেখানে উপরে লেখা আচরণটা পরিষ্কার দেখবেন। <code>oflag=direct</code> দিয়ে লেখা
              হয় যাতে লেখার সময়ই Cache না ভরে, আর পরের cat এর পড়াটা আলাদা করে দেখা যায়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, শুক্রবার সন্ধ্যার ধীর সাইট</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসনের শুরুর সেই শুক্রবার সন্ধ্যায় ফিরি। Island Tours এর VPS, island-vps-01, 2 vCPU,
                4 GB RAM, 80 GB Disk। নিচের সংখ্যাগুলো সেই VPS এর গল্প বোঝাতে সাজানো, অনুশীলনের Server
                এর আসল Output নয়, কিন্তু প্রতিটা ধাপ ঠিক এই লেসনের যন্ত্র দিয়েই নেওয়া।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রথম মিনিট, health।</strong> Load average 3.80, 3.10, 1.40। Core দুইটা,
                  তাই প্রতি Core এ প্রায় 1.9, আর প্রথম সংখ্যা তৃতীয়টার অনেক উপরে, মানে চাপ এই মাত্র
                  বাড়ছে। available 2.1 GB, Disk 41%, কোনো Service পড়ে নেই। Memory আর Disk সন্দেহের
                  বাইরে।
                </ListItem>
                <ListItem>
                  <strong>CPU লাইন।</strong> top এ us 92, wa 0, st 0.4। পাশের VM দোষী নয়, Disk ও নয়।
                  CPU এর সময় যাচ্ছে নিজেদের কোনো Program এর হিসাবে।
                </ListItem>
                <ListItem>
                  <strong>কে।</strong> P চেপে সাজাতেই সবার উপরে একটা node, CPU 99। <code>1</code>{" "}
                  চাপতে দেখা গেল একটা Core পুরো ভরা। systemd-cgtop বলল খরচটা docker.service এর ভেতরে,
                  মানে API এর Container (Docker Module এ <code>docker stats</code> দিয়ে এটাই আরও
                  সহজে দেখবেন)।
                </ListItem>
                <ListItem>
                  <strong>কেন।</strong> Log এ X-Request-Id ধরে দেখা গেল (লেসন ০৭), সেই সময়ে Admin
                  Panel থেকে কেউ পুরো মাসের বুকিং এর একটা বড় Report চেয়েছেন। Report টা API এর ভেতরেই
                  বানানো হচ্ছিল, এক Thread এ, আর সেই কয়েক মিনিট বাকি সব পর্যটকের Request লাইনে
                  দাঁড়িয়ে ছিল।
                </ListItem>
                <ListItem>
                  <strong>সমাধান।</strong> তাৎক্ষণিক: Report টা থামানো হলো, Load দশ মিনিটে 0.6 এ
                  নামল। স্থায়ী: ভারী Report এখন আর API এর ভেতরে বানানো হয় না, রাতে একটা আলাদা
                  Scheduled কাজ হিসেবে চলে (লেসন ১০), আর Admin সকালে File টা পান।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই ঘটনার পরে Island Tours তাদের VPS এর জন্য পাঁচটা নিয়ম লিখে রেখেছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>স্বাভাবিকটা জানা।</strong> সাধারণ দিনে Load 0.3 থেকে 0.6, available 2 GB এর
                  বেশি, Disk 40% এর আশেপাশে, st 1 এর নিচে। এই সংখ্যাগুলো Runbook এ লেখা, যাতে কেউ
                  অস্বাভাবিকটা সাথে সাথে চিনতে পারেন।
                </ListItem>
                <ListItem>
                  <strong>2 GB Swap, swappiness 10।</strong> হঠাৎ ভিড়ে OOM Killer ডাকার আগে একটু
                  গদি, কিন্তু স্বাভাবিক সময়ে Swap প্রায় ব্যবহার হয় না।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা ভারী কাজের সীমা।</strong> রাতের Backup এর Service এ MemoryMax বসানো,
                  আর সেটা চলে রাত সাড়ে তিনটায়, যাতে তার Disk এর ভিড় কোনো পর্যটক টের না পান।
                </ListItem>
                <ListItem>
                  <strong>নিজে থেকে খবর।</strong> Provider এর Dashboard এ Disk 80%, CPU একটানা 85% আর
                  বাইরের Uptime Check, এই তিনটায় সতর্কবার্তা চালু। পুরো Monitoring ব্যবস্থা আসবে
                  Observability Module এ।
                </ListItem>
                <ListItem>
                  <strong>প্রথম মিনিটের নিয়ম।</strong> কেউ অভিযোগ করলে আগে <code>ssh island health</code>,
                  তারপর top। অনুমান করে কিছু Restart করা নিষেধ, কারণ Restart প্রমাণ মুছে দেয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>সাইট ধীর অভিযোগ থেকে কারণ পর্যন্ত, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              যেকোনো Server এ, যেকোনো ধীরগতির অভিযোগে, এই ক্রমটা মেনে চললে কিছু বাদ পড়বে না। প্রতিটা
              ধাপ আগের ধাপের উত্তর দেখে ঠিক করে পরে কোন দিকে যাবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Server এ ঢুকুন, আর কিছু Restart করবেন না",
              description:
                "ssh island। প্রথমে শুধু দেখবেন। Restart করলে সমস্যা হয়তো চলে যায়, কিন্তু কেন হয়েছিল সেই প্রমাণও চলে যায়, আর সমস্যা আবার ফিরে আসে।",
            },
            {
              title: "Core গুনুন, Load পড়ুন",
              description:
                "nproc আর uptime। Load কে Core দিয়ে ভাগ করুন। প্রথম সংখ্যা তৃতীয়টার চেয়ে বড় হলে চাপ বাড়ছে, ছোট হলে কমছে।",
            },
            {
              title: "CPU লাইনে বড় ঘরটা খুঁজুন",
              description:
                "top। us বড় হলে কোনো Program হিসাব করছে, wa বড় হলে Disk, st বড় হলে পাশের VM, sy আর si বড় হলে অনেক ছোট Network কাজ। id বড় হলে CPU নির্দোষ।",
            },
            {
              title: "Memory দেখুন",
              description:
                "free -h এর available, আর vmstat 1 এর si, so। available প্রচুর আর si, so শূন্য হলে Memory নির্দোষ।",
            },
            {
              title: "Disk দেখুন, দুই দিক থেকে",
              description:
                "df -h আর df -i দিয়ে ভরা কি না, iostat -dx 1 দিয়ে ব্যস্ত কি না।",
            },
            {
              title: "দোষী Process ধরুন",
              description:
                "top এ P বা M, অথবা ps aux --sort। একটা Core পুরো ভরা কি না দেখতে 1। এই মুহূর্তের হিসাব চাইলে pidstat।",
            },
            {
              title: "Process থেকে Service এ যান",
              description:
                "systemctl status <PID> বলে দেয় কোন Service। systemd-cgtop দিয়ে Service ধরে ধরে খরচ মিলিয়ে নিন।",
            },
            {
              title: "কেন, সেটা Log থেকে",
              description:
                "journalctl -u <service> দিয়ে সেই সময়ের Log, X-Request-Id ধরে নির্দিষ্ট Request (লেসন ০৭)।",
            },
            {
              title: "সব সুস্থ হলে চোখ বাইরে ফেরান",
              description:
                "CPU, Memory, Disk সব ঠিক, অথচ সাইট ধীর? তাহলে App হয়তো অন্য কোনো Server এর উত্তরের অপেক্ষায়, অথবা পথে কোথাও Network এর সমস্যা। সেটা পরের লেসনের কাজ।",
            },
            {
              title: "লিখে রাখুন",
              description:
                "কী দেখলেন, কোন সংখ্যা, কী করলেন। পরের বার একই সংখ্যা দেখলে আপনি বা দলের অন্য কেউ এক মিনিটে চিনবেন।",
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
                <strong>নিচের Lab টা আগে করুন</strong>। ছয়টা পরীক্ষায় CPU, Memory, OOM, Disk আর Disk
                এর ব্যস্ততা নিজের Server এ ঘটিয়ে প্রতিটা যন্ত্রে দেখবেন। এর কোনো ভিডিও বিকল্প নেই।
              </ListItem>
              <ListItem>
                <strong>Brendan Gregg এর Linux Performance পাতা</strong>। Linux এর গতি মাপার জগতে
                সবচেয়ে পরিচিত নাম। এখানে প্রতিটা যন্ত্র কোন অংশ মাপে তার একটা বিখ্যাত ছবি আছে, আর তাঁর
                লেখা Linux Performance Analysis in 60,000 Milliseconds এর লিংক, যা এই লেসনের
                এক মিনিটের পরীক্ষার মতোই একটা ক্রম শেখায়।{" "}
                <a href="https://www.brendangregg.com/linuxperf.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  brendangregg.com/linuxperf.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Linux Load Averages: Solving the Mystery</strong>, একই লেখকের। Linux এর Load
                কেন Disk এর অপেক্ষাকেও গোনে, তার ইতিহাস আর কারণ।{" "}
                <a href="https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  brendangregg.com, linux load averages
                </a>
              </ListItem>
              <ListItem>
                <strong>top আর free এর man page</strong>। প্রতিটা কলাম আর প্রতিটা চাবির সংজ্ঞা।
                Terminal এ <code>man top</code> আর <code>man free</code>, অথবা{" "}
                <a href="https://man7.org/linux/man-pages/man1/top.1.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  man7.org, top
                </a>
                {" আর "}
                <a href="https://man7.org/linux/man-pages/man1/free.1.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  man7.org, free
                </a>
              </ListItem>
              <ListItem>
                <strong>Kernel এর /proc নথি</strong>। MemAvailable কীভাবে হিসাব হয় আর /proc/loadavg এর
                প্রতিটা ঘর।{" "}
                <a href="https://docs.kernel.org/filesystems/proc.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  docs.kernel.org/filesystems/proc.html
                </a>
              </ListItem>
              <ListItem>
                <strong>htop আর sysstat</strong>, দুইটার নিজের পাতা।{" "}
                <a href="https://htop.dev" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  htop.dev
                </a>
                {" আর "}
                <a href="https://github.com/sysstat/sysstat" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  github.com/sysstat/sysstat
                </a>
              </ListItem>
              <ListItem>
                <strong>আপনার Provider এর Monitoring পাতা</strong>। VPS এর Dashboard এ CPU, Disk আর
                Network এর Graph কোথায়, আর Alert কীভাবে বসাতে হয়, সেটা সেবাভেদে আলাদা। নিজের Dashboard
                এ যা দেখেন, সেটাই মানুন।
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
                  Server এর ছয়টা লক্ষণ: CPU, Memory, Disk Space, Disk I/O, Network আর Process। প্রথম
                  পাঁচটা বলে কোথায় টান, শেষটা বলে কে টানছে।
                </ListItem>
                <ListItem>
                  Load average গোনে কারা CPU তে চলছে, কারা লাইনে, আর কারা Disk এ আটকে। Core সংখ্যা
                  দিয়ে ভাগ করে পড়ুন। তিনটা সংখ্যা ১, ৫, ১৫ মিনিটের গড়, তুলনা করলে দিক বোঝা যায়।
                </ListItem>
                <ListItem>
                  top এর CPU লাইনে বড় ঘরটা দিক দেখায়: us মানে Program, wa মানে Disk, st মানে পাশের VM।
                  1 চাপলে প্রতিটা Core, আর একলা ভরা Core টা Single Thread App এর চিহ্ন।
                </ListItem>
                <ListItem>
                  Memory এর আসল খরচ RES, VIRT নয়। free এ দেখবেন available, free নয়। Linux খালি RAM
                  Cache এ লাগায় আর দরকারে ছেড়ে দেয়।
                </ListItem>
                <ListItem>
                  Memory ফুরালে প্রথমে Swap, তারপর OOM Killer, যে SIGKILL দেয়। Journal এ oom-kill দেখলে
                  দোষী Memory। ছোট VPS এ Swap গদি, আর Service এ MemoryMax বাকিদের রক্ষাকবচ।
                </ListItem>
                <ListItem>
                  vmstat 1 প্রতি সেকেন্ডের ইতিহাস, প্রথম লাইন বাদ দিয়ে পড়ুন। b আর wa মানে Disk এর
                  অপেক্ষা, si আর so মানে Swap এর টানাটানি।
                </ListItem>
                <ListItem>
                  df বলে কতটা ভরা, du বলে কে ভরাল। df -i Inode এর ফাঁদ ধরে। মুছেও জায়গা না ফিরলে
                  lsof +L1।
                </ListItem>
                <ListItem>
                  iostat বলে Disk কতটা ব্যস্ত, await পর্যটকের অপেক্ষা। ps এর %CPU আজীবনের গড়, এই
                  মুহূর্তের জন্য top বা pidstat। PID থেকে Service জানতে systemctl status, আর Service
                  ধরে খরচ systemd-cgtop।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর পুরো লেসনটা এক বাক্যে: অভিযোগ এলে আগে মাপুন, তারপর ভাবুন, আর সবশেষে কিছু বদলান।
                যে মাপে না, সে অনুমানে Restart করে, আর অনুমানের Restart প্রমাণ মুছে দিয়ে সমস্যাটা পরের
                শুক্রবারের জন্য রেখে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৯, Network Debugging",
          content: (
            <p>
              এই লেসনের শেষ ধাপটা মনে আছে? CPU, Memory, Disk সব সুস্থ, অথচ পর্যটক বলছেন সাইট খুলছে
              না। তখন সমস্যা যন্ত্রের ভেতরে নয়, পথে: DNS ঠিক উত্তর দিচ্ছে কি না, Port টা আসলে শুনছে
              কি না, Firewall আটকাচ্ছে কি না, App 127.0.0.1 এ শুনছে নাকি সবার জন্য খোলা। Module 05 আর
              06 এ যা শিখেছেন, সেটাকে এবার Server এর ভেতরে বসে একটা একটা স্তর ধরে পরীক্ষা করবেন।
              পরের লেসন:{" "}
              <Link href="/devops/topic/network-debugging" className={linkClass}>
                Network Debugging (netstat, ss, curl)
              </Link>
              ।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Load average", "চলছে, লাইনে আর Disk এ আটকে থাকা কাজের ১, ৫, ১৫ মিনিটের গড়"],
      ["প্রতি Core এ Load", "Load ভাগ nproc। 1 এর বেশি একটানা মানে লাইন জমছে"],
      ["R আর D", "R মানে চলছে বা CPU এর লাইনে, D মানে Disk এর জন্য আটকে। দুইটাই Load এ গোনা"],
      ["%Cpu(s)", "CPU এর সময়ের আট ভাগ। বড় ঘরটাই দিক দেখায়"],
      ["us, sy", "নিজের Program এর হিসাব, আর Kernel এর কাজ"],
      ["wa", "Disk এর অপেক্ষায় বসে থাকা। CPU বাড়িয়ে লাভ নেই"],
      ["st", "Hypervisor পাশের VM কে দিয়ে দেওয়া সময়, Noisy Neighbour"],
      ["VIRT, RES, SHR", "চেয়ে রাখা, সত্যিই RAM এ থাকা, আর ভাগ করা অংশ। দেখবেন RES"],
      ["available", "নতুন Program কতটা পাবে, Cache থেকে ছাড়া যায় এমন অংশ সহ। free নয়, এটা দেখুন"],
      ["buff/cache", "Linux এর রাখা File এর কপি, দরকারে ছেড়ে দেয়"],
      ["Swap", "Disk এর উপর Memory এর ড্রয়ার। গদি, ওষুধ নয়। si, so একটানা মানে Thrashing"],
      ["OOM Killer", "Memory ফুরালে সবচেয়ে বড় Process কে SIGKILL। Journal এ oom-kill"],
      ["df আর du", "কতটা ভরা, আর কে ভরাল। df -i দিয়ে Inode"],
      ["lsof +L1", "মুছে ফেলা কিন্তু এখনো খোলা File, যারা জায়গা ছাড়ে না"],
      ["iostat", "Disk এর পড়া, লেখা, await আর %util"],
      ["ps এর %CPU", "শুরু থেকে গড়, এই মুহূর্তের নয়। এখনকার জন্য top বা pidstat"],
      ["systemd-cgtop", "Process নয়, Service ধরে ধরে CPU আর Memory"],
      ["health", "Load, Memory, Disk, ব্যস্ততম Process আর পড়ে থাকা Service, এক মিনিটে"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Island Tours এর 2 vCPU এর VPS এ uptime দেখাচ্ছে load average: 3.90, 3.70, 3.50। কোনটা সঠিক পড়া?",
        options: [
          {
            key: "A",
            text: "সব ঠিক আছে, কারণ Load 4 এর নিচে",
            isCorrect: false,
            explanation: "Load কে Core সংখ্যা দিয়ে ভাগ করতে হয়। 2 Core এ 3.9 মানে প্রতি Core এ প্রায় 2।",
          },
          {
            key: "B",
            text: "প্রতি Core এ প্রায় 2, আর তিনটা সংখ্যাই কাছাকাছি, মানে অনেকক্ষণ ধরে চাপ চলছে",
            isCorrect: true,
            explanation: "ঠিক। প্রতিটা Core এর সামনে গড়ে আরেকজন অপেক্ষা করছে, আর ১৫ মিনিটের গড়ও বড়, তাই এটা হঠাৎ এক মুহূর্তের ভিড় নয়।",
          },
          {
            key: "C",
            text: "চাপ কমে আসছে, কারণ সংখ্যাগুলো ক্রমে ছোট হচ্ছে",
            isCorrect: false,
            explanation: "প্রথমটা ১ মিনিটের, শেষটা ১৫ মিনিটের। প্রথমটা সবচেয়ে বড় মানে চাপ সামান্য বাড়ছে, কমছে না।",
          },
          {
            key: "D",
            text: "CPU 390% ব্যস্ত",
            isCorrect: false,
            explanation: "Load কোনো শতাংশ নয়, এটা কাজের গণনা। আর Disk এ আটকে থাকা কাজও এতে গোনা হয়।",
          },
        ],
      },
      {
        id: 2,
        text: "4 GB এর একটা Server এ free -h দেখাচ্ছে free 120Mi, buff/cache 2.4Gi, available 2.6Gi। আপনার সিদ্ধান্ত কী?",
        options: [
          {
            key: "A",
            text: "Memory প্রায় শেষ, এখনই বড় Plan নিতে হবে",
            isCorrect: false,
            explanation: "free ছোট, কিন্তু Linux খালি RAM Cache এ লাগায়। দেখার সংখ্যা available, আর সেটা 2.6Gi।",
          },
          {
            key: "B",
            text: "Memory যথেষ্ট আছে, Cache দরকারে জায়গা ছেড়ে দেবে",
            isCorrect: true,
            explanation: "ঠিক। available প্রায় মোটের দুই তৃতীয়াংশ। ছোট free একটা ব্যস্ত, সুস্থ Linux এর স্বাভাবিক চেহারা।",
          },
          {
            key: "C",
            text: "Cache খালি করার জন্য Server Restart করতে হবে",
            isCorrect: false,
            explanation: "Cache আপনার শত্রু নয়, Disk এ যাওয়া কমিয়ে সবকিছু দ্রুত রাখে। Restart এ শুধু সেই সুবিধা হারাবেন।",
          },
          {
            key: "D",
            text: "Swap চালু না করলে কিছুক্ষণের মধ্যে OOM হবে",
            isCorrect: false,
            explanation: "available প্রচুর থাকলে OOM এর ঝুঁকি নেই। Swap ভালো গদি, কিন্তু এই সংখ্যাগুলো কোনো বিপদ দেখায় না।",
          },
        ],
      },
      {
        id: 3,
        text: "সাইট ধীর। top এর CPU লাইন: 4.0 us, 3.0 sy, 0.0 ni, 52.0 id, 41.0 wa, 0.0 st। সবচেয়ে সম্ভাব্য কারণ কোনটা?",
        options: [
          {
            key: "A",
            text: "App এর Code খুব ভারী হিসাব করছে",
            isCorrect: false,
            explanation: "তাহলে us বড় হতো। এখানে us মাত্র 4।",
          },
          {
            key: "B",
            text: "Disk ধীর বা খুব ব্যস্ত, অনেক কাজ তার উত্তরের অপেক্ষায়",
            isCorrect: true,
            explanation: "ঠিক। wa 41 মানে CPU এর হাতে কাজ আছে কিন্তু Disk এর জন্য বসে। এরপর iostat আর vmstat এর b কলাম।",
          },
          {
            key: "C",
            text: "পাশের VM CPU নিয়ে যাচ্ছে",
            isCorrect: false,
            explanation: "সেটা st এ দেখা যেত, আর st এখানে শূন্য।",
          },
          {
            key: "D",
            text: "CPU কম, বেশি vCPU এর Plan নিলে সারবে",
            isCorrect: false,
            explanation: "CPU এর অর্ধেক সময় id, তার উপর wa। বেশি CPU কিনলেও Disk এর অপেক্ষা একই থাকবে।",
          },
        ],
      },
      {
        id: 4,
        text: "VPS এ কয়েক ঘণ্টা ধরে top দেখাচ্ছে st 30 এর আশেপাশে, অথচ আপনার কোনো Process বেশি CPU নিচ্ছে না। কী বুঝবেন?",
        options: [
          {
            key: "A",
            text: "একটা Process লুকিয়ে CPU খাচ্ছে, খুঁজে বের করতে হবে",
            isCorrect: false,
            explanation: "st আপনার যন্ত্রের ভেতরের কারো খরচ নয়। এটা Hypervisor এর হিসাব, আপনার vCPU পালা পায়নি।",
          },
          {
            key: "B",
            text: "একই Physical যন্ত্রের অন্য VM এর ভিড়ে আপনার vCPU সময় পাচ্ছে না",
            isCorrect: true,
            explanation: "ঠিক, Noisy Neighbour। Code এর দোষ নয়। Provider কে জানান, বা ভালো Plan বা অন্য যন্ত্রে সরে যান।",
          },
          {
            key: "C",
            text: "Swap বেশি ব্যবহার হচ্ছে",
            isCorrect: false,
            explanation: "Swap এর টান দেখা যায় vmstat এর si আর so তে, আর তার সাথে wa বাড়ে, st নয়।",
          },
          {
            key: "D",
            text: "Network এর Packet হারাচ্ছে",
            isCorrect: false,
            explanation: "Network এর সমস্যা ip -s link এর errors আর dropped এ দেখা যায়। st সম্পূর্ণ আলাদা জিনিস।",
          },
        ],
      },
      {
        id: 5,
        text: "top এ node এর লাইনে VIRT 914564 আর RES 358744। এই App আসলে কতটা RAM খরচ করছে?",
        options: [
          {
            key: "A",
            text: "প্রায় 893 MB, VIRT এর হিসাবে",
            isCorrect: false,
            explanation: "VIRT হলো যত Memory সে চেয়ে রেখেছে বা দেখতে পায়, যার বড় অংশ কখনো RAM এ আসেই না।",
          },
          {
            key: "B",
            text: "প্রায় 350 MB, RES এর হিসাবে",
            isCorrect: true,
            explanation: "ঠিক। RES হলো এই মুহূর্তে সত্যিই RAM এ থাকা অংশ। Memory এর প্রশ্নে এটাই দেখবেন।",
          },
          {
            key: "C",
            text: "দুইটা যোগ করে প্রায় 1.2 GB",
            isCorrect: false,
            explanation: "RES তো VIRT এর ভেতরেরই অংশ, যোগ করলে একই জিনিস দুইবার গোনা হয়।",
          },
          {
            key: "D",
            text: "শূন্য, কারণ %CPU শূন্য",
            isCorrect: false,
            explanation: "CPU আর Memory আলাদা হিসাব। একটা Process চুপচাপ বসে থেকেও অনেক Memory ধরে রাখতে পারে।",
          },
        ],
      },
      {
        id: 6,
        text: "df -h বলছে Disk 100% ভরা। আপনি একটা 5 GB এর Log File rm দিয়ে মুছলেন, কিন্তু df এখনো 100%। কারণ কী, আর কী করবেন?",
        options: [
          {
            key: "A",
            text: "df এর হিসাব দেরিতে আসে, কয়েক ঘণ্টা অপেক্ষা করুন",
            isCorrect: false,
            explanation: "df সাথে সাথে আসল অবস্থা দেখায়। অপেক্ষা করলে কিছুই বদলাবে না।",
          },
          {
            key: "B",
            text: "কোনো Process File টা এখনো খুলে রেখেছে, lsof +L1 দিয়ে তাকে খুঁজে সেই Service Restart করুন",
            isCorrect: true,
            explanation: "ঠিক। rm শুধু নাম মোছে। খোলা হাত না ছাড়া পর্যন্ত Kernel আসল Data রেখে দেয়।",
          },
          {
            key: "C",
            text: "Inode শেষ হয়ে গেছে",
            isCorrect: false,
            explanation: "Inode এর সমস্যা df -i তে দেখা যায়, আর তখন জায়গা থাকতেও লেখা যায় না। এখানে জায়গাই ফেরত আসেনি।",
          },
          {
            key: "D",
            text: "/var/lib এর ভেতরের বড় Folder গুলোও মুছে ফেলুন",
            isCorrect: false,
            explanation: "/var/lib এ চলমান Program এর আসল Data থাকে, যেমন Database। হাতে মুছলে Data হারাবেন।",
          },
        ],
      },
      {
        id: 7,
        text: "একই মুহূর্তে top বলছে node এর CPU 100.0, অথচ ps aux বলছে 46.9। কেন?",
        options: [
          {
            key: "A",
            text: "দুইটার একটা ভুল, ps আর ব্যবহার করা উচিত নয়",
            isCorrect: false,
            explanation: "কেউ ভুল নয়। দুইজন দুইটা আলাদা প্রশ্নের উত্তর দিচ্ছে।",
          },
          {
            key: "B",
            text: "ps গোনে শুরু থেকে এখন পর্যন্ত গড়, top গোনে শেষ কয়েক সেকেন্ড",
            isCorrect: true,
            explanation: "ঠিক। App শুরুতে কিছুক্ষণ বসে ছিল, তাই আজীবনের গড় অর্ধেকে নেমেছে। এই মুহূর্তের জন্য top বা pidstat।",
          },
          {
            key: "C",
            text: "ps প্রতিটা Core আলাদা দেখায়, top সব মিলিয়ে",
            isCorrect: false,
            explanation: "দুইটাই একটা Process এর জন্য এক Core কে 100 ধরে। তফাত সময়ের পরিসরে।",
          },
          {
            key: "D",
            text: "node দুইটা Process, ps একটাকে দেখাচ্ছে",
            isCorrect: false,
            explanation: "দুই যন্ত্রেই একই PID 198। প্রশ্নটা কত সময় ধরে মাপা হচ্ছে, সেটা নিয়ে।",
          },
        ],
      },
      {
        id: 8,
        text: "my-tours-api মাঝে মাঝে নিজে নিজে Restart হচ্ছে। systemctl status এ লেখা Result: oom-kill। প্রথমে কী খুঁজবেন?",
        options: [
          {
            key: "A",
            text: "Disk ভরা কি না",
            isCorrect: false,
            explanation: "oom-kill মানে Out Of Memory। Disk এর সাথে এর সরাসরি সম্পর্ক নেই।",
          },
          {
            key: "B",
            text: "App এর RES সময়ের সাথে বাড়ছে কি না, আর পুরো Server এর available আর Swap",
            isCorrect: true,
            explanation: "ঠিক। RES থামতে না জানলে Memory Leak, available শেষ হলে পুরো Server এর টান। Service এ MemoryMax থাকলে সীমাটা কত, সেটাও দেখুন।",
          },
          {
            key: "C",
            text: "CPU এর st",
            isCorrect: false,
            explanation: "st পাশের VM এর ভিড় দেখায়, তাতে Process মারা পড়ে না, শুধু ধীর হয়।",
          },
          {
            key: "D",
            text: "Firewall এর নিয়ম",
            isCorrect: false,
            explanation: "Firewall Connection আটকায়, Process মারে না। oom-kill একটা Memory এর সমস্যা।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "চাপ বানান, যন্ত্র দিয়ে ধরুন",
    subtitle: "ছয়টা পরীক্ষা, প্রতিটার চাপ নিজে থেকে থামে",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের health Script",
        description:
          "পাঁচটা দেখার একটা ছোট Script বানিয়ে /usr/local/bin এ রাখুন, চালান, আর প্রতিটা অংশ পড়ে বলুন Server সুস্থ কি না।",
      },
      {
        title: "Core ভরানো আর Load বাড়তে দেখা",
        description:
          "timeout সহ yes দিয়ে Core এর সংখ্যার চেয়ে একটা বেশি কাজ চালান। top এ 1 চেপে প্রতিটা Core আর Load এর প্রথম সংখ্যা দেখুন।",
      },
      {
        title: "একটা দুষ্টু API বানানো",
        description:
          "ছোট একটা Node App যা চাইলে CPU পোড়ায় বা Memory ধরে রাখে। systemd-run দিয়ে একটা অস্থায়ী Service হিসেবে চালান।",
      },
      {
        title: "দোষী ধরা, Process থেকে Service পর্যন্ত",
        description:
          "API তে চাপ দিন, তারপর top, ps, pidstat আর systemd-cgtop দিয়ে ধরুন কে খাচ্ছে আর সে কোন Service।",
      },
      {
        title: "Memory আর OOM Killer",
        description:
          "API কে 300 MB ধরে রাখতে বলুন, RES আর available দেখুন। তারপর MemoryMax=200M দিয়ে চালিয়ে OOM Killer কে ডেকে আনুন আর Journal পড়ুন।",
      },
      {
        title: "Disk ভরানো, ভূতুড়ে File আর ব্যস্ত Disk",
        description:
          "বড় একটা File দিয়ে df আর du মিলান, মুছে ফেলা অথচ খোলা File lsof +L1 দিয়ে ধরুন, আর বড় লেখার সময় iostat আর vmstat পড়ুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-health.sh",
        language: "bash",
        code: `# Script টা বানান। cat এর পরের লাইনগুলো EOF পর্যন্ত File এ যাবে।
sudo tee /usr/local/bin/health > /dev/null <<'EOF'
#!/usr/bin/env bash
# Five quick looks at a Linux server: load, memory, disk, the busiest processes, failed services.
set -u
echo "== load (CPU cores: $(nproc))"; uptime
echo; echo "== memory"; free -h
echo; echo "== disk"; df -h /
echo; echo "== busiest processes"; ps -eo pid,user,%cpu,%mem,etime,comm --sort=-%cpu | head -6
echo; echo "== failed services"; systemctl --failed --no-legend --plain || true
EOF
sudo chmod 755 /usr/local/bin/health
health

# যা দেখবেন: লেসনের Health Check Section এর মতো পাঁচটা অংশ।
# নিজেকে পাঁচটা প্রশ্ন করুন:
#   প্রতি Core এ Load কত? (Load ভাগ nproc)
#   available মোটের কত ভাগ?
#   Disk এর Use% কত?
#   কেউ কি CPU একাই খাচ্ছে?
#   failed services এর নিচে কিছু আছে?

# ল্যাপটপ থেকে এক কমান্ডে (লেসন ০৩ এর SSH Alias থাকলে):
#   you@laptop:~$ ssh island health`,
      },
      {
        filename: "2-cpu-hogs.sh",
        language: "bash",
        code: `# কয়টা Core আছে জানুন
nproc

# Core এর সংখ্যার চেয়ে একটা বেশি yes চালান। প্রতিটা 60 সেকেন্ড পরে নিজে থামবে।
# উদাহরণ: 2 Core এর যন্ত্রে তিনটা
timeout 60 yes > /dev/null &
timeout 60 yes > /dev/null &
timeout 60 yes > /dev/null &

# আরেক Terminal এ দেখুন
top          # তারপর 1 চাপুন। প্রতিটা Core প্রায় 100, আর কোনো yes ই একা 100 পায় না।
uptime       # কয়েকবার চালান। প্রথম সংখ্যা উঠছে, তৃতীয়টা প্রায় স্থির।

# Batch এ এক ঝলক, অনুশীলনের Server এ দুইটা yes চলার সময় এরকম এসেছিল:
#     PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
#    1113 root      20   0    2268   1164   1076 R 100.0   0.0   0:06.37 yes
#    1114 root      20   0    2268   1152   1060 R 100.0   0.0   0:06.38 yes
top -b -n 1 -o %CPU | sed -n 7,11p

# চলমান কাজের তালিকা, আর আগেভাগে থামাতে চাইলে
jobs
kill %1 %2 %3`,
      },
      {
        filename: "3-lab-api.mjs",
        language: "javascript",
        code: `// lab-api.mjs: একটা ছোট API, যেটা ইচ্ছা করে CPU আর Memory খরচ করতে পারে।
//   /tours   সস্তা উত্তর
//   /report  800 ms ধরে CPU পোড়ায়, ভারী Report বানানোর মতো
//   /cache   প্রতিবার আরও 50 MB ধরে রাখে, সর্বোচ্চ 300 MB
//
// রাখুন: /srv/lab/lab-api.mjs
// চালান (পরের Script এ): LAB_PORT পরিবেশ থেকে আসে, না থাকলে চালুই হবে না।
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

const held = [];
http
  .createServer((req, res) => {
    if (req.url.startsWith("/report")) {
      const until = Date.now() + 800;
      let n = 0;
      while (Date.now() < until) n += Math.sqrt(n + 1);
      res.end("report ready\\n");
    } else if (req.url.startsWith("/cache")) {
      if (held.length < 6) held.push(Buffer.alloc(50 * 1024 * 1024, 1));
      res.end(\`holding \${held.length * 50} MB\\n\`);
    } else {
      res.end("[]\\n");
    }
  })
  .listen(port, "127.0.0.1", () => console.log(\`lab-api listening on 127.0.0.1:\${port}\`));`,
      },
      {
        filename: "4-find-the-culprit.sh",
        language: "bash",
        code: `# দরকারি জিনিস বসান। Ubuntu এর nodejs এই Lab এর জন্য যথেষ্ট।
sudo apt install -y nodejs sysstat curl
sudo mkdir -p /srv/lab
sudo nano /srv/lab/lab-api.mjs        # আগের Code টা বসান

# একটা অস্থায়ী Service হিসেবে চালান, nobody User এর নামে
sudo systemd-run --unit=lab-api --uid=nobody \\
  --setenv=LAB_PORT=47880 /usr/bin/node /srv/lab/lab-api.mjs
curl -s 127.0.0.1:47880/tours         # উত্তর: []

# ২০ সেকেন্ড ধরে তিনজন একসাথে ভারী Report চায়
for i in 1 2 3; do
  (timeout 20 bash -c 'while true; do curl -s -o /dev/null 127.0.0.1:47880/report; done') &
done

# এবার খুঁজুন, যত দ্রুত সম্ভব
top -b -n 1 -1 -w 200 | sed -n 3,4p           # একটা Core 100 us, বাকিরা প্রায় ফাঁকা
ps -eo pid,user,%cpu,%mem,etime,comm --sort=-%cpu | head -4
PID=$(systemctl show -p MainPID --value lab-api)
pidstat -u -p "$PID" 1 3                      # এই মুহূর্তের হিসাব, %CPU 90 এর উপরে
systemctl status "$PID" | head -1             # কোন Service: lab-api.service
sudo systemd-cgtop -b -n 2 -d 1 -c --depth=3 | tail -8

# অনুশীলনের Server এ এসেছিল:
#   %Cpu0  :100.0 us,  0.0 sy,  0.0 ni,  0.0 id, ...   %Cpu1  :  0.0 us, ... 100.0 id, ...
#   ● lab-api.service - /usr/bin/node /srv/lab/lab-api.mjs
#   /system.slice/lab-api.service    11   99.1    15.8M        -        -

wait`,
      },
      {
        filename: "5-memory-oom.sh",
        language: "bash",
        code: `# ১. Memory ধরে রাখতে বলুন, আর দেখুন কে বাড়ল
free -h
for i in 1 2 3 4 5 6; do curl -s 127.0.0.1:47880/cache; done
#   holding 50 MB ... holding 300 MB
ps -o pid,user,vsz,rss,%mem,cmd -C node
#   অনুশীলনের Server এ: 796 nobody 915336 359552 5.9 /usr/bin/node /srv/lab/lab-api.mjs
systemctl status lab-api | grep Memory
#        Memory: 314.3M (peak: 314.8M)
free -h          # available প্রায় 300M কম

# ২. এবার সীমা দিয়ে চালান, 200 MB এর বেশি নয়, Swap ও নয়
sudo systemctl stop lab-api
sudo systemd-run --unit=lab-api --uid=nobody -p MemoryMax=200M -p MemorySwapMax=0 \\
  --setenv=LAB_PORT=47880 /usr/bin/node /srv/lab/lab-api.mjs
for i in 1 2 3 4 5 6; do curl -s -m 3 127.0.0.1:47880/cache || echo "curl: no reply"; done
#   holding 50 MB / holding 100 MB / holding 150 MB / curl: no reply ...

# ৩. কী ঘটল, Journal থেকে (বিস্তারিত লেসন ০৭ এ)
journalctl -u lab-api -n 4 -o short-iso --no-pager
#   ... lab-api.service: A process of this unit has been killed by the OOM killer.
#   ... lab-api.service: Main process exited, code=killed, status=9/KILL
#   ... lab-api.service: Failed with result 'oom-kill'.
systemctl status lab-api | sed -n 4p
#        Active: failed (Result: oom-kill) since ...

# ৪. পরিষ্কার
sudo systemctl reset-failed lab-api`,
      },
      {
        filename: "6-disk.sh",
        language: "bash",
        code: `# ১. একটা 1 GB এর "পুরনো Backup" বানান, তারপর df আর du দিয়ে খুঁজুন
sudo mkdir -p /var/backups/islandtours
df -h /
sudo dd if=/dev/zero of=/var/backups/islandtours/old.dump bs=1M count=1024 status=progress
df -h /                                                # Used প্রায় 1G বাড়ল
sudo du -xh --max-depth=1 /var | sort -h | tail -5     # /var/backups সবার নিচে, সবচেয়ে বড়
sudo find / -xdev -type f -size +100M -exec ls -lh {} +

# ২. ভূতুড়ে File: মুছে ফেলা, কিন্তু খোলা
sudo mkdir -p /var/log/lab
sudo dd if=/dev/zero of=/var/log/lab/api.log bs=1M count=800 status=none
sudo python3 -c 'import time; f=open("/var/log/lab/api.log","a"); time.sleep(120)' &
sleep 1
df -h / | tail -1
sudo rm /var/log/lab/api.log
df -h / | tail -1                                      # একই! জায়গা ফেরেনি
sudo du -sh /var/log/lab                               # অথচ du বলছে প্রায় খালি
sudo lsof +L1                                          # দোষী: python3 ... (deleted)
sudo kill "$(sudo lsof -t +L1 | head -1)"
df -h / | tail -1                                      # এবার ফিরল

# ৩. ব্যস্ত Disk: বড় একটা লেখা, আর একই সময়ে iostat আর vmstat
sudo dd if=/dev/zero of=/var/tmp/io-test.bin bs=4M count=384 oflag=direct status=none &
iostat -dxy 1 3        # w/s, wkB/s, w_await আর %util বেড়ে যাবে
vmstat 1 5             # b কলাম 1 বা 2, wa বেড়ে যাবে
wait

# ৪. পরিষ্কার
sudo rm -f /var/tmp/io-test.bin /var/backups/islandtours/old.dump
df -h /`,
      },
    ],
    tip: "পরীক্ষা ৪ আর ৬ এর তৃতীয় অংশ পাশাপাশি রেখে ভাবুন। দুইবারই সাইট ধীর হতো, কিন্তু দুইবার সম্পূর্ণ আলাদা কারণে। প্রথমবার top এর us ভরা, একটা Core পুরো ব্যস্ত, আর বেশি CPU বা কাজটা অন্য সময়ে সরানোই সমাধান। দ্বিতীয়বার us প্রায় শূন্য, অথচ wa আর b বাড়ছে, আর এখানে CPU কিনে এক পয়সাও লাভ নেই। পর্যটকের কাছে দুইটাই একই অভিযোগ, সাইট ধীর। আপনার কাজ হলো সেই একই অভিযোগের পেছনে কোন সংখ্যাটা নড়ছে সেটা দেখা, আর এই লেসনের পুরোটাই আসলে সেই একটা দক্ষতা।",
  },
  assignment: {
    title: "Mini Project: my-tours এর Server এর স্বাস্থ্যের খাতা",
    time: "৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>স্বাভাবিকটা লিখে রাখুন:</strong> নিজের অনুশীলনের Server বা my-tours এর VPS এ দিনের তিনটা
        আলাদা সময়ে health চালান। প্রতিবার একটা টেবিলে লিখুন: প্রতি Core এ Load, available কত শতাংশ,
        Disk এর Use%, top থেকে wa আর st। তিনবারের সংখ্যা থেকে আপনার Server এর স্বাভাবিক দিনটা এক
        প্যারাগ্রাফে বর্ণনা করুন।
      </span>,
      <span key="2">
        <strong>health কে নিজের মতো করুন:</strong> Lab এর Script এ তিনটা জিনিস যোগ করুন:{" "}
        <code>df -i /</code>, Swap এর ব্যবহার, আর my-tours-api এর Memory লাইন{" "}
        <code>systemctl status</code> থেকে। ল্যাপটপ থেকে <code>ssh</code> এর Alias দিয়ে এক কমান্ডে
        চালিয়ে দেখান।
      </span>,
      <span key="3">
        <strong>তিনটা অসুখ, তিনটা প্রমাণ:</strong> lab-api দিয়ে একবার CPU, একবার Memory, একবার Disk এর
        চাপ তৈরি করুন। প্রতিটার জন্য লিখুন কোন কমান্ড প্রথম ধরল, কোন সংখ্যাটা সবচেয়ে স্পষ্ট বদলাল, আর
        কোন সংখ্যা বিভ্রান্ত করতে পারত। প্রতিটার Terminal এর অংশটুকু জমা দিন।
      </span>,
      <span key="4">
        <strong>my-tours এর Memory পরিকল্পনা:</strong> আপনার VPS এর মাপ ধরে ঠিক করুন Swap কত হবে আর
        swappiness কত, আর কেন। তারপর my-tours-api.service এর জন্য একটা MemoryMax ঠিক করুন, কারণ সহ।
        lab-api দিয়ে প্রমাণ করুন যে সীমা পার হলে শুধু সেই Service মারা পড়ে আর systemd তাকে আবার চালু
        করে, বাকি Server ঠিক থাকে।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন নতুন সদস্য লিখেছেন, free বলছে মাত্র 150
        MB খালি, Server মরে যাচ্ছে, আজই বড় Plan কিনি? তাঁকে বোঝান free আর available এর তফাত, buff/cache
        কেন ভালো জিনিস, আসলে কোন দুইটা সংখ্যা দেখলে Memory এর বিপদ বোঝা যায়, আর কেনার আগে কোন তিনটা
        কমান্ড চালাতে হবে।
      </span>,
    ],
    deliverables: [
      <span key="1">তিন সময়ের সংখ্যার টেবিল আর স্বাভাবিক দিনের বর্ণনা</span>,
      <span key="2">বাড়ানো health Script আর ল্যাপটপ থেকে চালানোর ফলাফল</span>,
      <span key="3">তিনটা চাপের প্রমাণ, প্রতিটায় প্রথম ধরা কমান্ড আর মূল সংখ্যা</span>,
      <span key="4">Swap আর MemoryMax এর সিদ্ধান্ত, কারণ সহ, আর OOM এর পরীক্ষার Journal লাইন</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
