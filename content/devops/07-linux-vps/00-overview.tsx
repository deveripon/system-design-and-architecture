/**
 * What: The overview chapter of DevOps Module 07, Linux & VPS Fundamentals. It says why the module
 * exists, what the ten lessons teach, where the knowledge is used at work, and how to study it.
 *
 * Why: Every module opens with a map before its first lesson, so the reader knows why the lessons
 * matter before meeting them. It reuses the shared overview visuals so every module overview looks
 * and reads the same.
 */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  BeforeAfterSplit,
  ModuleBridgeDiagram,
  ModuleRoadmap,
} from "../../../components/course/topics/overview/module-overview";
import { RealLifeLab } from "../../../components/course/topics/overview/overview-animations";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const linuxVpsOverviewContent: TopicData = {
  id: "linux-vps-overview",
  introduction: {
    badge: "MODULE 07 · OVERVIEW",
    title: <SectionTitle>অতিথি থেকে বাড়ির দায়িত্বে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের মডিউলে আপনি একটা Request কে তার পুরো যাত্রায় অনুসরণ করেছেন।
          পর্যটকের ফোন থেকে বেরিয়ে, তালাবন্ধ হয়ে, পথের প্রতিটা হাত পার হয়ে সেটা
          পৌঁছেছিল একটা ঠিকানায়, 103.94.135.2 এর Port 443 এ। সেখানে Caddy তালা
          খুলে কথাটা দিয়েছিল Port 3000 এর App কে, আর App উত্তর লিখে পাঠিয়েছিল।
          কিন্তু সেই ঠিকানার পেছনের যন্ত্রটা নিয়ে আমরা প্রায় কিছুই বলিনি। ওটা
          একটা কম্পিউটার, যেটা Island Tours ভাড়া নিয়েছে, আর যেটায় চলে Linux।
        </ContentParagraph>
        <ContentParagraph>
          এতদিন আপনি সেই যন্ত্রের অতিথি ছিলেন। বাইরে থেকে Request পাঠিয়েছেন,
          উত্তর পড়েছেন। এই মডিউলে আপনি ভেতরে ঢুকবেন, আর বাড়ির দায়িত্ব নেবেন।
          কোন ঘরে কী রাখা, কে দরজার চাবি পায়, সকালে সবাইকে কে জাগিয়ে দেয়, রাতে কী
          ঘটেছিল তা কোন খাতায় লেখা থাকে, আর কোন জানালা খোলা রাখলে চোর ঢুকতে পারে।
          আগের মডিউলের শেষ লেসন তিনটা প্রশ্ন রেখে গিয়েছিল: Caddy এর Setting এর
          ফাইল ঠিক কোন Folder এ থাকে, Log খুঁজতে কোথায় যেতে হয়, আর Server চালু
          হলেই App টা কে চালু করে দেয়। তিনটার উত্তরই এখানে।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা কোনো লেসন নয়, এটা মডিউলের মানচিত্র। এখানে আপনি জানবেন এই
          মডিউল কেন আছে, এগারোটা লেসনে কী কী শিখবেন, কেন শেখাটা জরুরি, কাজের জায়গায়
          কোথায় কোথায় লাগবে, আর বাস্তবে কীভাবে ব্যবহার করবেন। অনেক নতুন শব্দ আর
          Command এখানে শুধু নাম হিসেবে আসবে। ঘাবড়াবেন না, প্রতিটার পাশে বলে দেওয়া
          আছে কোন লেসন সেটা হাতে ধরে শেখাবে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "হোটেলে থাকলে ঘর পরিষ্কার, তালা, বিদ্যুৎ, সবকিছু অন্য কেউ দেখেন। নিজের বাসা ভাড়া নিলে চাবিটা আপনার হাতে আসে, সাথে আসে সব দায়ও। কে ঢুকবে, কোন জানালা খোলা থাকবে, রাতে পানির কল কে বন্ধ করবে, সব সিদ্ধান্ত তখন আপনার।",
      author: "Linux & VPS Fundamentals",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>একটা কালো পর্দা, একটা জ্বলতে নিভতে থাকা দাগ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা দৃশ্য ভাবুন। আপনার my-tours নিজের ল্যাপটপে চমৎকার চলছে।{" "}
                <code>npm run dev</code> লিখলেই সাইট খোলে, Browser এ Login হয়,
                বুকিং হয়। এবার ঠিক করলেন সাইটটা সবার জন্য Internet এ তুলবেন। একটা
                Hosting কোম্পানির পাতায় গিয়ে মাসিক ভাড়ায় একটা Server নিলেন। কয়েক
                মিনিট পরে ইমেইলে এলো একটা IP Address আর ঢোকার নিয়ম।
              </ContentParagraph>
              <ContentParagraph>
                নিয়ম মেনে ঢুকলেন। পর্দায় এলো একটা কালো জানালা, তাতে এক লাইন লেখা,
                শেষে একটা জ্বলতে নিভতে থাকা দাগ। ব্যস, আর কিছু নেই। কোনো Desktop নেই,
                কোনো Folder এর ছবি নেই, Mouse দিয়ে চাপার মতো একটা বোতামও নেই। আপনার
                Code কোথায় রাখবেন, কীভাবে চালাবেন, Database কোথায় বসবে, কিছুই জানেন
                না। আর ঠিক এই মুহূর্তে, আপনি যখন ভাবছেন কোথা থেকে শুরু করবেন, Internet
                এর কোথাও বসে থাকা কিছু স্বয়ংক্রিয় Program হয়তো আপনার Server এর
                দরজায় Password আন্দাজ করা শুরু করে দিয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                এরপরও অনেকগুলো মুহূর্ত আসে, যেগুলো এই মডিউল ছাড়া রহস্যই থেকে যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  Server এ App চালিয়ে দিলেন, সাইট খুলল। ল্যাপটপ বন্ধ করে ঘুমাতে
                  গেলেন, সকালে দেখেন সাইট বন্ধ, অথচ Server চালু।
                </ListItem>
                <ListItem>
                  Hosting কোম্পানি রাতে Server Restart দিল। আর সবকিছু উঠল, শুধু
                  আপনার App টা উঠল না।
                </ListItem>
                <ListItem>
                  রাত দুইটায় App টা একবার পড়ে গিয়েছিল। কেন, সেটা কোথায় লেখা আছে
                  আপনি জানেন না।
                </ListItem>
                <ListItem>
                  ছবি Upload করতে গেলে Permission denied, অথচ নিজের ল্যাপটপে একই
                  Code দিব্যি চলে।
                </ListItem>
                <ListItem>
                  ভুল করে Database এর Password সহ একটা ফাইল GitHub এ উঠে গেছে। মুছে
                  দিলেন, তবু সেটা আসলে কোথাও থেকে মোছেনি।
                </ListItem>
                <ListItem>
                  Firewall চালু করার সাথে সাথে নিজেই আর Server এ ঢুকতে পারছেন না।
                </ListItem>
                <ListItem>
                  মাসের পর মাস ঠিক চলার পর এক সকালে সব বুকিং ব্যর্থ, Log এ লেখা No
                  space left on device।
                </ListItem>
                <ListItem>
                  প্রতি রাতের Backup এর ব্যবস্থা করেছিলেন। যেদিন দরকার পড়ল, দেখলেন
                  তিন সপ্তাহ ধরে একটাও Backup হয়নি।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই আটটা সমস্যার একটাও আপনার App এর Code এ নয়। আটটাই ঘটে সেই
                যন্ত্রের ভেতরে, যার উপর আপনার Code চলে। কে Program চালু রাখে, কে
                কোন ফাইল ছুঁতে পারে, কোন দরজা খোলা, কী কোথায় লেখা হয়, আর কোন কাজ
                নিজে থেকে কখন চলে। এই মডিউল সেই যন্ত্রটার ভেতর আপনার সামনে খুলে
                দেয়। শেষ করার পর উপরের প্রতিটা লাইন পড়ে আপনি বলতে পারবেন কী ঘটছে,
                কোন Command দিয়ে নিজের চোখে দেখবেন, আর কোথায় হাত দিলে ঠিক হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Permission denied, Firewall, Backup, এই শব্দগুলো এখন না বুঝলে কোনো সমস্যা নেই",
          content: (
            <p>
              উপরের তালিকায় কয়েকটা শব্দ আর বার্তা ইচ্ছা করেই ব্যাখ্যা ছাড়া রাখা
              হয়েছে। এগুলো সেই দরজা, যেগুলোর সামনে নিজের Server চালানো প্রত্যেক
              Developer একদিন না একদিন দাঁড়ান। এই মডিউলের প্রতিটা লেসন এরকম একটা
              বা দুইটা দরজা খুলে দেয়। মডিউল শেষে এই পাতায় ফিরে এসে তালিকাটা আবার
              পড়বেন, দেখবেন প্রতিটা লাইন তখন একটা চেনা গল্প, আর প্রতিটার পাশে আপনি
              একটা Command লিখে দিতে পারছেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "big-picture",
      subHeader: { index: "002", title: "The Big Picture" },
      title: <SectionTitle>পুরো মডিউল, এক কথায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা বড় ভবনের একটা ফ্ল্যাট ভাড়া নেওয়ার কথা ভাবুন। ভবনের মালিক
                দেয়াল, বিদ্যুৎ, পানির লাইন আর মূল ফটকের দারোয়ান দেন। কিন্তু ফ্ল্যাটের
                ভেতরে সব কিছু আপনার। কোন ঘরে কী রাখবেন, কার হাতে চাবি থাকবে, কোন
                জানালা খোলা থাকবে, সকালে কে সবাইকে জাগাবে, রাতে কী ঘটল তা কোন খাতায়
                লেখা থাকবে, বিদ্যুতের মিটারে চোখ রাখবেন কি না, আর প্রতি রাতে কোন কাজ
                এলার্ম দিয়ে করিয়ে নেবেন।
              </ContentParagraph>
              <ContentParagraph>
                VPS ঠিক এই ফ্ল্যাট। পুরো নাম Virtual Private Server। একটা Data
                Center এ একটা বিশাল শক্তিশালী কম্পিউটার থাকে, Hosting কোম্পানি সেটাকে
                অনেকগুলো আলাদা ভাগে কেটে ভাড়া দেয়। প্রতিটা ভাগ নিজেকে একটা পুরো
                কম্পিউটার মনে করে, তার নিজের CPU এর ভাগ, নিজের Memory, নিজের Disk,
                নিজের Public IP। ভবনের মালিকের মতো Hosting কোম্পানি যন্ত্র, বিদ্যুৎ
                আর Internet এর লাইন দেখে। ফ্ল্যাটের ভেতরের সব দায়িত্ব আপনার, আর
                ফ্ল্যাটের ভেতরের নিয়মগুলো লেখা Linux এর ভাষায়। VPS আসলে কী আর অন্য
                রকম Hosting থেকে কোথায় আলাদা, তা লেসন ১ এ। আর একটা খালি VPS ভাড়া
                নেওয়া থেকে তাতে HTTPS এ চালু App পর্যন্ত পুরো পথ, ধাপে ধাপে, এই
                মডিউলের শেষ লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                এটা কোনো কাল্পনিক ছবি নয়। নিচে একটা আসল Ubuntu 24.04 অনুশীলনের
                Server এ চালানো চারটা Command আর তাদের আসল Output, শুধু ছোট করে
                দেখানো। একটা হলো কোন Linux চলছে, একটা হলো একদম মূলে কী কী Folder
                আছে, একটা হলো এই মুহূর্তে কোন কোন Service চলছে, আর শেষটা হলো Server এর
                ঘড়ি। এর একটা লাইনও এখন বোঝার দরকার নেই। শুধু খেয়াল করুন, Server এর
                সব খবর সাধারণ লেখা হিসেবে পড়া যায়। এই মডিউলের পুরো কৌশলটাই হলো কোন
                খবরের জন্য কোন Command।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "first-look.sh",
          code: `# কোন Linux চলছে (লেসন ১)
deploy@island-vps-01:~$ grep PRETTY_NAME /etc/os-release
PRETTY_NAME="Ubuntu 24.04.5 LTS"

# একদম মূলে, / এর নিচে কী আছে (লেসন ১)
deploy@island-vps-01:~$ ls /
bin                dev   lib                mnt   root  sbin.usr-is-merged  tmp
bin.usr-is-merged  etc   lib.usr-is-merged  opt   run   srv                 usr
boot               home  media              proc  sbin  sys                 var

# এই মুহূর্তে কোন Service চলছে (লেসন ২)
deploy@island-vps-01:~$ systemctl list-units --type=service --state=running --no-legend
  cron.service             loaded active running Regular background program processing daemon
  dbus.service             loaded active running D-Bus System Message Bus
  rsyslog.service          loaded active running System Logging Service
  systemd-journald.service loaded active running Journal Service

# Server এর ঘড়ি UTC তে, দল কাজ করে ঢাকার সময়ে (লেসন ১০)
deploy@island-vps-01:~$ date; TZ=Asia/Dhaka date
Sat Oct 31 07:20:32 UTC 2026
Sat Oct 31 13:20:32 +06 2026`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এটা একটা খালি অনুশীলনের Server, তাই চলমান Service এর তালিকায় মাত্র
              চারটা নাম। Island Tours এর আসল Server এ এই তালিকায় আরও কয়েকটা নাম
              থাকে, যেমন Caddy, Docker আর SSH। কোনটা কে, কে তাদের চালু করে, আর একটা
              বন্ধ হয়ে গেলে কী হয়, সেটাই লেসন ২ এর গল্প।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিল, এই মডিউল কী যোগ করে, পরেরটা কী চায়"
              caption="তিনটা মডিউল একটা শিকলের তিনটা আংটা। আগের মডিউল HTTP & HTTPS শিখিয়েছে Browser আর Server কোন ভাষায় কথা বলে আর সেই কথায় তালা লাগে কীভাবে, কিন্তু উত্তরটা যে যন্ত্র দেয়, সেটা নিয়ে কিছু বলেনি। এই মডিউল আপনাকে সেই যন্ত্রের ভেতরে নামিয়ে দেয়: নিজের একটা Linux Server গোছানো, চালু রাখা, তালা দেওয়া আর পাহারা দেওয়া। পরের মডিউল Backend Runtime ধরে নেয় আপনার Server চলছে আর তাতে আপনার Node.js App একটা Service হিসেবে বসে আছে, তারপর সেই App এর ভেতরে ঢুকে দেখায় Node.js একসাথে হাজার Request সামলায় কীভাবে।"
              before={{
                tag: "Module 06",
                title: "HTTP & HTTPS",
                lines: ["Request আর Response এর ভাষা", "তালাবন্ধ কথা, Certificate", "উত্তরদাতা যন্ত্রটা অচেনা"],
              }}
              current={{
                tag: "Module 07",
                title: "Linux & VPS",
                lines: ["নিজের Server এ ঘর গোছানো", "চালু রাখা, তালা, পাহারা", "কিছু ভাঙলে খুঁজে বের করা"],
              }}
              after={{
                tag: "Module 08",
                title: "Backend Runtime",
                lines: ["Server এ চলা Node.js এর ভেতর", "V8 আর libuv", "হাজার Request একসাথে"],
              }}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলটা আগের অনেক মডিউলের খোলা সুতো একটা আসল যন্ত্রের উপর বাঁধে,
                তাই সুতোগুলো একবার মনে করিয়ে দিই। Module 01 এ আপনি Operating
                System, Program আর Process, Memory আর Storage চিনেছিলেন, নিজের
                ল্যাপটপের উদাহরণে। এখানে সেই একই জিনিস দেখবেন একটা Server এ, যেখানে
                কোনো পর্দা নেই, আর যেখানে একটা Process এর মরে যাওয়া মানে হাজার পর্যটকের
                সাইট বন্ধ।
              </ContentParagraph>
              <ContentParagraph>
                Module 03 এ শিখেছিলেন Gateway কী, আর বাসার Router এর NAT কীভাবে
                অজান্তেই বাইরের অচেনা Connection আটকে দেয়। ভাড়া করা Server এর সামনে
                কোনো বাসার Router নেই, Public IP সরাসরি তার গায়ে। তাই সেই পাহারাটা
                এখানে আপনাকে নিজে হাতে বসাতে হবে, আর সেটাই Firewall এর লেসন। Module 05
                এর Port & Socket লেসনে দেখেছিলেন একটা Program কোন ঠিকানায় বসে শোনে,
                127.0.0.1 নাকি 0.0.0.0, আর Connection Close লেসনে দেখেছিলেন Server
                থামানোর ভদ্র উপায়, যার শুরু একটা Signal দিয়ে। এখানে সেই Signal কে
                পাঠায় আর সেই ঠিকানা বাইরে থেকে কীভাবে যাচাই করবেন, তা হাতে কলমে।
              </ContentParagraph>
              <ContentParagraph>
                আর Module 06 এর পুরো যাত্রার শেষ ধাপগুলো, Caddy, Port 3000 এর App,
                Certificate এর ফাইল, Login এর গোপন চাবি, সব এই যন্ত্রের ভেতরেই থাকে।
                আগের মডিউলের শেষে Request টা Server এ পৌঁছানো পর্যন্ত ছবিটা পরিষ্কার
                ছিল। এই মডিউলের শেষে Server এর ভেতরের ছবিটাও পরিষ্কার হবে, কোন ফাইল
                কোথায়, কোন Program কে চালায়, আর কী ভাঙলে কোথায় লেখা থাকে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "what-you-will-learn",
      subHeader: { index: "003", title: "What You Will Learn" },
      title: <SectionTitle>এগারোটা লেসন, এগারোটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। নিচে এগারোটা লেসন আর তাদের প্রশ্ন।
              যেকোনোটায় চাপ দিলে সরাসরি সেই লেসনে চলে যাবেন, তবে প্রথমবার ক্রম
              ধরে পড়াই ভালো, কারণ প্রতিটা লেসন আগেরটার উপর দাঁড়িয়ে, আর পরের লেসনের
              Lab আগের লেসনে বানানো জিনিস ব্যবহার করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              moduleId="linux-vps"
              questions={{
                "linux-filesystem":
                  "Server এ কোনো Desktop নেই, Folder দেখার জানালা নেই। তাহলে Caddy এর Setting, Log আর আপনার App ঠিক কোথায় থাকে, আর সেখানে হাঁটবেন কীভাবে?",
                "process-management-systemd":
                  "আপনি Logout করলে বা Server Restart হলে আপনার App কে চালু রাখে কে, আর Crash করলে আবার তোলে কে?",
                "ssh-security-keys":
                  "দূরের একটা Server এ নিরাপদে ঢুকবেন কীভাবে, যাতে আপনি ঢুকতে পারেন অথচ Password আন্দাজ করতে থাকা Bot গুলো না পারে?",
                "permissions-users-groups":
                  "Server এ কে কোন ফাইল পড়তে, লিখতে বা চালাতে পারে, আর Permission denied এলে সব খুলে না দিয়ে ঠিক করবেন কীভাবে?",
                "environment-variables":
                  "Database এর Password আর গোপন চাবি Code এ না লিখে App এর হাতে পৌঁছায় কীভাবে, আর ফাঁস হয়ে গেলে কী করবেন?",
                "firewall-ufw":
                  "Server এর কোন দরজা Internet এর জন্য খোলা থাকবে আর কোনটা বন্ধ, আর নিজেকে বাইরে আটকে না ফেলে দরজা বন্ধ করবেন কীভাবে?",
                "system-logs":
                  "রাত দুইটায় App কেন পড়ে গিয়েছিল, সেই উত্তর কোন খাতায় লেখা থাকে, আর হাজার লাইনের ভেতর আসল লাইনটা খুঁজবেন কীভাবে?",
                "monitoring-tools":
                  "Server কি হাঁপাচ্ছে? CPU, Memory আর Disk এর কোনটা ফুরিয়ে আসছে, আর কোন সংখ্যা দেখলে চিন্তা করা উচিত?",
                "network-debugging":
                  "সাইট খুলছে না। দোষটা নামে, রাস্তায়, দরজায়, তালায় নাকি App এ, তা বাইরে থেকে ভেতরে ধাপে ধাপে বের করবেন কীভাবে?",
                "cron-jobs":
                  "প্রতি রাতের Backup নিজে থেকে চলবে কীভাবে, আর কোনো রাতে না চললে আপনি সেটা জানবেন কীভাবে?",
                "vps-setup":
                  "একটা একদম খালি VPS থেকে শুরু করে নিজের Domain এ HTTPS এ চালু, নিরাপদ, Reboot সহ্য করা App পর্যন্ত পৌঁছাবেন কীভাবে, আর শেষে বাইরে থেকে কীভাবে প্রমাণ করবেন যে সব ঠিক আছে?",
              }}
              footer="এগারোটা লেসন ছয় ভাগে পড়লে মনে রাখা সহজ। প্রথমটা পথ চেনা: কোন ফাইল কোথায়। দ্বিতীয়টা চালু রাখা: Process আর systemd। পরের চারটা তালা আর চাবি: SSH, Permission, গোপন Setting আর Firewall। তার পরের তিনটা পাহারা আর মেরামত: Log, যন্ত্রের স্বাস্থ্য আর Network এর গোলমাল। তারপর একটা, সময়মতো নিজে থেকে চলা কাজ। আর শেষ লেসনে আগের দশটা একসাথে: একটা খালি VPS থেকে নিজের হাতে পুরো একটা Server দাঁড় করানো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একই এগারোটা লেসন একটা গল্প হিসেবে শুনুন, যাতে বোঝা যায় কোনটা
                কোনটার জন্য পথ তৈরি করে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>লেসন ১, Linux Filesystem Architecture:</strong> শুরু হবে
                  অনুশীলনের জায়গা জোগাড় দিয়ে। নিজের কম্পিউটারে একটা ছোট Linux চালানোর
                  উপায়, VPS আসলে কী, আর অনুশীলনের জন্য একটা ছোট VPS নিয়ে প্রথমবার ঢোকার
                  সংক্ষিপ্ত পথ। পুরো পথটা আসবে শেষ লেসনে। তারপর সেই কালো পর্দার প্রথম পাঠ:
                  এখন কোথায় আছি, এখানে কী আছে, ওখানে যাব কীভাবে। Linux এ সব কিছু একটাই
                  গাছের ডালপালা, যার মূল একটা <code>/</code> চিহ্ন। সেই গাছের প্রতিটা বড়
                  ডাল কী কাজে লাগে, নতুন Software কীভাবে বসাতে হয় আর তার ফাইলগুলো
                  কোথায় গিয়ে বসে, আর Island Tours এর Caddyfile ঠিক কোন Folder এ।
                </ListItem>
                <ListItem>
                  <strong>লেসন ২, Process Management & Systemd:</strong> আপনার App
                  একটা Process, আর Server এ এই মুহূর্তে আরও কয়েকশ Process চলছে। কে কার
                  সন্তান, কে কাকে থামতে বলে, আর Terminal বন্ধ করলে আপনার App কেন মরে
                  যায়। তারপর সমাধান, systemd, Linux এর সেই তত্ত্বাবধায়ক যে Server চালু
                  হলেই সবাইকে জাগায় আর কেউ পড়ে গেলে আবার তোলে। নিজের হাতে my-tours
                  এর জন্য একটা Service লিখবেন, আর Server Restart দিয়ে প্রমাণ করবেন যে
                  App নিজে উঠে আসে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৩, SSH & Security Keys:</strong> দূরের Server এ ঢোকার
                  দরজা SSH। Password এর বদলে একজোড়া চাবি বানাবেন, যার একটা আপনার
                  ল্যাপটপেই থাকে, কখনো কোথাও যায় না। Module 06 এর Certificate এর লেসনে
                  যে Public Key আর Private Key চিনেছিলেন, এখানে সেটাই প্রতিদিনের কাজে।
                  নতুন VPS এর প্রথম এক ঘণ্টার কাজের তালিকাও এখানে: Root হিসেবে ঢোকা
                  বন্ধ, Password দিয়ে ঢোকা বন্ধ, আর এমনভাবে বন্ধ করা যাতে নিজে বাইরে
                  আটকে না যান।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৪, Permissions, Users, and Groups:</strong> একটা Server
                  এ কয়েকজন মানুষ আর কয়েকটা Program থাকে, আর প্রত্যেকের হাতে আলাদা চাবি।
                  প্রতিটা ফাইলের গায়ে লেখা থাকে কে পড়তে পারে, কে লিখতে পারে, কে চালাতে
                  পারে। সেই লেখা পড়তে শিখবেন, বদলাতে শিখবেন, আর বুঝবেন কেন আপনার App
                  নিজের Code বদলাতে পারে না অথচ নিজের Setting পড়তে পারে। Permission
                  denied এলে সব খুলে দেওয়ার সেই জনপ্রিয় ভুল কেন বিপজ্জনক, আর তার বদলে
                  কী করবেন, তাও এখানে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৫, Environment Variables:</strong> App কে Database এর
                  ঠিকানা আর গোপন চাবি জানাতে হয়, কিন্তু Code এ লিখলে সেটা GitHub এ চলে
                  যায়। এই লেসন দেখাবে একটা Process তার চারপাশ থেকে কীভাবে Setting পায়,
                  একটা <code>.env</code> ফাইল আসলে কী, Service হিসেবে চলা App কেন আপনার
                  Terminal এর Setting দেখতে পায় না, আর গোপন জিনিস কোথায় রাখলে নিরাপদ।
                  একটা Setting না পেলে App যেন চুপচাপ ভুল কিছু ধরে না নেয়, বরং চালু
                  হওয়ার মুহূর্তেই পরিষ্কার বার্তা দিয়ে থেমে যায়, সেই অভ্যাসটাও।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৬, Firewall Management (ufw):</strong> Server এর অনেক
                  দরজা, প্রতিটা একটা Port। কোনগুলো বাইরের জন্য খোলা থাকবে আর কোনগুলো
                  শুধু ভেতরের, সেটা ঠিক করে Firewall। ufw দিয়ে Rule বসাবেন, নিজেকে আটকে
                  না ফেলার নিয়ম শিখবেন, আর একটা সত্যিকারের ফাঁদ চিনবেন যেখানে Firewall
                  চালু থাকা সত্ত্বেও Database বাইরে থেকে দেখা যায়।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৭, System Logs (journalctl, systemctl):</strong> Server
                  এ যা কিছু ঘটে, তার প্রায় সবটাই কোথাও না কোথাও লেখা থাকে। কোন খাতায়,
                  আর হাজার লাইনের ভেতর থেকে গতকাল রাত দুইটার সেই একটা লাইন কীভাবে
                  বের করবেন, সেটা এই লেসনের কাজ। একটা App বারবার পড়ে যাচ্ছে, তার আসল
                  কারণ Log এর কোন লাইনে বসে আছে, তা নিজের চোখে খুঁজে বের করবেন। আগের
                  মডিউলের Log কোথায় প্রশ্নের উত্তরও এখানে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৮, Monitoring Tools (top, htop):</strong> Server এর
                  স্বাস্থ্য পরীক্ষা। CPU কতটা ব্যস্ত, Memory কতটা বাকি, Disk কতটা ভরা,
                  কোন Process সবচেয়ে বেশি খাচ্ছে। ইচ্ছা করে Server এর উপর চাপ তৈরি
                  করবেন আর দেখবেন কোন সংখ্যা কীভাবে নড়ে, যাতে আসল বিপদের দিনে সংখ্যা
                  দেখেই বুঝতে পারেন কোনটা স্বাভাবিক আর কোনটা নয়।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৯, Network Debugging (netstat, ss, curl):</strong>{" "}
                  সাইট খুলছে না, এই একটা বাক্যের পেছনে দশটা আলাদা কারণ থাকতে পারে।
                  এই লেসন আগের তিনটা মডিউলের জ্ঞান একসাথে কাজে লাগায়: নাম থেকে
                  ঠিকানা, রাস্তা, দরজা, তালা, তারপর App। প্রতিটা ধাপ আলাদা করে যাচাই
                  করার Command, আর প্রতিটা Error বার্তার আসল মানে, যাতে অন্ধকারে হাতড়ে
                  না বেড়িয়ে সোজা দোষী ধাপে পৌঁছান।
                </ListItem>
                <ListItem>
                  <strong>লেসন ১০, Cron & Scheduled Tasks:</strong> কিছু কাজ কেউ
                  বলে না দিলেও নিয়মিত হতে হয়, যেমন প্রতি রাতের Backup। Server কে সময়
                  ধরে কাজ করানোর দুইটা উপায় শিখবেন, আর সেই চুপচাপ ব্যর্থতাগুলো চিনবেন
                  যেগুলোর জন্য Backup সপ্তাহের পর সপ্তাহ হয় না অথচ কেউ টের পায় না।
                </ListItem>
                <ListItem>
                  <strong>লেসন ১১, VPS Setup, End to End:</strong> এবার আর আলাদা আলাদা
                  টুকরো নয়, পুরো কাজটা এক বসায়। আগে ঠিক করবেন আদৌ VPS লাগবে কি না,
                  লাগলে কত বড়, কোন Region এ, কোন কোম্পানির। তারপর একটা একদম খালি Server
                  নিয়ে আগের দশটা লেসন ধাপে ধাপে চালাবেন: প্রথম Login, Update, নিজের User
                  আর চাবি, দরজা বন্ধ, Firewall, Swap, Node.js, App এর নিজের User আর
                  Setting, Code পৌঁছানো, Service, Caddy দিয়ে নিজের Domain এ HTTPS, Log,
                  Backup আর ফেরত আনার পরীক্ষা। শেষে বাইরে থেকে প্রমাণ করবেন যে Root আর
                  Password দিয়ে ঢোকা যায় না, শুধু ঠিক দরজাগুলো খোলা, HTTPS ঠিক আছে, আর
                  Reboot এর পরেও App নিজে ওঠে। মাসিক রক্ষণাবেক্ষণের একটা তালিকা আর
                  নিজের Server এর একটা লেখা Runbook নিয়ে মডিউল শেষ হবে, আর তার শেষে
                  এগারোটা লেসন একটা গল্পে জোড়া লাগানো হবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এগারোটা লেসনেই একই Server, Island Tours এর ভাড়া করা VPS। তার নাম{" "}
                <code>island-vps-01</code>, Public IP <code>103.94.135.2</code>, অর্থাৎ
                আগের মডিউলের সেই একই ঠিকানা। তাতে চলে Ubuntu 24.04 LTS, ভাগে পেয়েছে
                ২টা vCPU, 4 GB Memory আর 80 GB Disk। ঘড়ি চলে UTC তে, কিন্তু দল কাজ
                করে ঢাকার সময়ে, যা UTC র চেয়ে ছয় ঘণ্টা এগিয়ে। এই Server এ ঢোকেন{" "}
                <code>deploy</code> নামের একজন মানুষ, আর App চলে{" "}
                <code>islandtours</code> নামের একটা আলাদা User হিসেবে, যে কখনো Login
                করে না। প্রতিটা লেসন এই একই Server এর একটা দিক খোলে, তাই শেষে আপনার
                মাথায় এগারোটা আলাদা বিষয় থাকবে না, থাকবে একটা চেনা বাড়ির পুরো নকশা, আর শেষ লেসনে নিজের হাতে বানানো ঠিক তেমন একটা বাড়ি।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "why-learn-it",
      subHeader: { index: "004", title: "Why Learn It" },
      title: <SectionTitle>Vercel এ তো এক Push এই Deploy, তবু কেন শিখব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রশ্নটা ন্যায্য। আজকাল অনেক সেবা আছে যেখানে Code GitHub এ Push
                করলেই সাইট Internet এ উঠে যায়, কোনো Server চোখেও দেখতে হয় না। এই
                সাইটটাই এভাবে চলে, Vercel এ। Island Tours এর Frontend ও তাই। তাহলে
                কালো পর্দার এত কষ্ট কেন?
              </ContentParagraph>
              <ContentParagraph>
                সৎ উত্তরটা তিন ভাগে। প্রথমত, সেই সহজ সেবাগুলোর পেছনেও Linux চলে,
                শুধু অন্য কেউ সেটা দেখাশোনা করেন। আপনার Backend, Database, প্রতি রাতের
                Backup, একটানা চলা কোনো Worker, এগুলো প্রায়ই কোনো না কোনো Linux যন্ত্রে
                গিয়ে বসে, আর সেই যন্ত্রটা একদিন আপনাকেই দেখতে হয়। দ্বিতীয়ত, সামনের
                মডিউলগুলোর প্রায় সব কিছু Linux এর উপর দাঁড়ানো। Docker এর Container
                ভেতরে একটা ছোট Linux, Kubernetes হাজারটা Linux যন্ত্রের পরিচালক, আর
                GitHub Actions এর মতো CI সেবা আপনার Code Build করে একটা Linux যন্ত্রে।
                সেখানে কিছু ভাঙলে যে Error আসে, সেটা Linux এর ভাষায় লেখা। তৃতীয়ত,
                নিজের Server চালালে খরচ আর নিয়ন্ত্রণ দুইটাই আপনার হাতে থাকে, যেটা
                Island Tours এর মতো ছোট ব্যবসার কাছে বড় ব্যাপার।
              </ContentParagraph>
              <ContentParagraph>
                না শিখলে পরে যা যা দাম দিতে হয়, সেগুলো এরকম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>অন্যের Command অন্ধভাবে চালাবেন:</strong> Internet এ
                  প্রতিটা সমস্যার একটা লাইনের সমাধান পাওয়া যায়, শুরুতে প্রায়ই{" "}
                  <code>sudo</code> লেখা, অর্থাৎ পুরো Server এর সব ক্ষমতা নিয়ে চালানো।
                  কী করছে না জেনে এমন লাইন চালানো মানে অচেনা কাউকে বাসার সব চাবি
                  দিয়ে দেওয়া।
                </ListItem>
                <ListItem>
                  <strong>সব কিছু সবার জন্য খুলে দেবেন:</strong> Permission denied
                  এলে সব খুলে দেওয়া, সব Program কে সর্বোচ্চ ক্ষমতা দিয়ে চালানো, সব Port
                  খোলা রাখা। এগুলো সমস্যাটা তখনকার মতো সরায়, কিন্তু Server টাকে একটা
                  খোলা দরজার বাড়ি বানায়।
                </ListItem>
                <ListItem>
                  <strong>বিপদের দিনে অন্ধ থাকবেন:</strong> সাইট বন্ধ হলে প্রথম কয়েক
                  মিনিট সবচেয়ে দামি। কোথায় তাকাতে হবে না জানলে সেই মিনিটগুলো যায়
                  আন্দাজে, আর সবচেয়ে সহজ আন্দাজটা হয় পুরো Server Restart, যা অনেক সময়
                  আসল কারণের প্রমাণটাই মুছে দেয়।
                </ListItem>
                <ListItem>
                  <strong>চুপচাপ ব্যর্থতা টের পাবেন না:</strong> ভরে আসা Disk, না চলা
                  Backup, মেয়াদ ফুরিয়ে আসা কোনো কিছু, এরা কোনো শব্দ করে না। যিনি
                  নিয়মিত দেখার জায়গাগুলো চেনেন না, তিনি প্রথম খবর পান পর্যটকের কাছ
                  থেকে।
                </ListItem>
                <ListItem>
                  <strong>পরের মডিউলগুলো ভিত ছাড়া দাঁড়াবে:</strong> Backend Runtime
                  এর মডিউলে Node.js কে Server এ চালিয়ে মাপবেন। Docker এর মডিউলে
                  Container এর ভেতরের Linux। Reverse Proxy র মডিউলে Caddy আর Nginx এর
                  Service আর Log। CI/CD তে SSH দিয়ে স্বয়ংক্রিয় Deploy। Observability
                  তে এই মডিউলের প্রতিটা সংখ্যা Graph এ। সব জায়গায় এখানকার Command ফিরে
                  আসবে।
                </ListItem>
                <ListItem>
                  <strong>Interview আর দলের আলাপে পিছিয়ে পড়বেন:</strong> একটা Process
                  কে ভদ্রভাবে থামানো আর জোর করে মারার তফাত কী, Load Average মানে কী,
                  Server এ Port 3000 এ কে বসে আছে কীভাবে দেখবেন, চাবির ফাইলের Permission
                  কত হওয়া উচিত। Backend আর DevOps এর Interview এ এগুলো খুব চেনা প্রশ্ন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই মডিউল কয়েকটা প্রচলিত ভুল ধারণাও সরিয়ে দেয়, যেগুলো অনেকে বছরের পর
                বছর বয়ে বেড়ান।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ভুল ধারণা, Linux চালাতে শত শত Command মুখস্থ লাগে:</strong>{" "}
                  প্রতিদিনের প্রায় সব কাজ হয় ত্রিশ চল্লিশটা Command দিয়ে। আর মুখস্থের
                  চেয়ে জরুরি হলো জানা কোন প্রশ্নের জন্য কোন Command, বাকিটা সাহায্যের
                  পাতা থেকে দেখে নেওয়া যায়। সেই পাতা কীভাবে খুলবেন, লেসন ১ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, আমার Server এর IP কেউ জানে না, তাই নিরাপদ:</strong>{" "}
                  স্বয়ংক্রিয় Program গুলো দিনরাত পুরো Internet এর প্রতিটা ঠিকানায় টোকা
                  দেয়, কারো নাম বা খ্যাতি দেখে নয়। নতুন Server এর Log এ অচেনা Login এর
                  চেষ্টা প্রায়ই প্রথম দিনেই দেখা যায়। লেসন ৩ এ নিজের চোখে দেখবেন, আর লেসন
                  ৬ এ দরজা বন্ধ করবেন।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, ছোট Project এ সব কিছু Root হিসেবে চালানোই সহজ:</strong>{" "}
                  সহজ, যতদিন না আপনার App এ একটা ফুটো পাওয়া যায়। তখন যে আক্রমণকারী App
                  এর দখল পান, তিনি পুরো Server এর দখলও পেয়ে যান। আলাদা User কেন আর
                  কীভাবে, লেসন ৪ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, Command এর শেষে একটা & দিলেই App চলতে থাকবে:</strong>{" "}
                  চলবে, যতক্ষণ না প্রথমবার Crash করে বা Server Restart হয়। তারপর কেউ
                  তাকে আবার চালু করবে না। লেসন ২ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, Repository Private, তাই .env ফাইল রাখা নিরাপদ:</strong>{" "}
                  Private Repository অনেকের হাতে যায়, Laptop হারায়, আর একবার Commit
                  হওয়া জিনিস ইতিহাসে থেকে যায়, পরে মুছলেও। লেসন ৫ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, Firewall চালু মানে সব Port সুরক্ষিত:</strong>{" "}
                  কিছু Software নিজের দরজা Firewall এর পাশ কাটিয়ে খোলে। চালু আছে আর
                  কাজ করছে এক কথা নয়, আর তফাতটা ধরতে হয় বাইরে থেকে পরীক্ষা করে। লেসন ৬
                  আর ৯ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, সমস্যা হলে আগে Server Restart দিন:</strong>{" "}
                  Restart অনেক সময় সাইটটা ফেরত আনে, কিন্তু কারণটা মুছে দেয়, আর সমস্যা
                  ফিরে আসে। আগে দেখুন, তারপর বদলান। কোথায় দেখবেন, লেসন ৭, ৮ আর ৯ এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "পুরো মডিউলে একটাই অভ্যাস ধরে রাখুন",
          content: (
            <p>
              আন্দাজ নয়, যন্ত্রকে জিজ্ঞেস করুন। Linux এ প্রায় প্রতিটা অবস্থা লেখা
              হিসেবে পড়া যায়, একটা ফাইলে বা একটা Command এর Output এ। App চলছে কি না,
              শেষবার কেন থেমেছিল, কোন Port এ কে বসে আছে, Disk কতটা ভরা, ফাইলটা কার।
              কিছু বদলানোর আগে আগে দেখে নিন, বদলানোর পরে আবার দেখে নিশ্চিত হন। প্রথম
              দশটা লেসন আসলে এই দেখার দশটা জানালা, আর প্রতিটা লেসন শেখাবে কোন প্রশ্নের
              জন্য কোন জানালা। শেষ লেসনে প্রতিটা ধাপের পরে ঠিক এই জানালাগুলো দিয়েই
              যাচাই করবেন যে ধাপটা সত্যিই হয়েছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "where-it-helps",
      subHeader: { index: "005", title: "Where It Helps" },
      title: <SectionTitle>কাজের জায়গায় ঠিক কোন মুহূর্তগুলোতে লাগবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে সাতটা সত্যিকারের মুহূর্ত, যেগুলো নিজের Server চালানো প্রায় প্রত্যেক
              Developer এর জীবনে আসে, অনেকের জীবনে প্রথম মাসেই। একটা একটা করে বেছে
              দেখুন, এই মডিউল না জানলে সেই মুহূর্তটা কেমন যায়, আর জানলে কেমন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "app-dies-on-logout",
                  label: "Terminal বন্ধ, App ও বন্ধ",
                  situation:
                    "VPS এ ঢুকে my-tours এর Folder এ গিয়ে npm start চালালেন। সাইট খুলল, সব ঠিক। ল্যাপটপ বন্ধ করে ঘুমাতে গেলেন। সকালে দেখেন সাইট আর খুলছে না, অথচ Hosting এর Dashboard বলছে Server চালু।",
                  without:
                    "পরের বার Command এর শেষে একটা & জুড়ে দেন, বা Internet থেকে nohup শিখে নেন। কিছুদিন চলে। তারপর App একবার Crash করে, আর কেউ তাকে আবার চালু করে না। Server Restart হলেও না।",
                  withIt:
                    "জানেন Terminal এ চালানো Program সেই Terminal এর সন্তান, Terminal গেলে সেও যায়। App টাকে একটা systemd Service হিসেবে লেখেন: কোন User চালাবে, কোথা থেকে Setting পড়বে, Crash করলে কত সেকেন্ড পরে আবার উঠবে, Server চালু হলে নিজে উঠবে কি না। একবার লিখলে কাউকে আর জেগে থাকতে হয় না।",
                  lessons: ["Process Management & Systemd"],
                },
                {
                  id: "reboot-night",
                  label: "রাতের Reboot, সকাল পর্যন্ত সাইট বন্ধ",
                  situation:
                    "Hosting কোম্পানি রাতে রক্ষণাবেক্ষণের জন্য Server Restart দিল। Caddy উঠল, কিন্তু App উঠল না। সকাল দশটায় একজন পর্যটক ফোন করে জানালেন বুকিং হচ্ছে না।",
                  without:
                    "Server এ ঢুকে আগের মতো App টা হাতে চালিয়ে দেন। কেন ওঠেনি, পরের Restart এ আবার এমন হবে কি না, জানেন না, তাই প্রতিটা রক্ষণাবেক্ষণের রাতে দুশ্চিন্তায় থাকেন।",
                  withIt:
                    "systemctl দিয়ে দেখেন App এর Service টা Server চালুর সাথে ওঠার তালিকায় ছিলই না, আর journalctl এ দেখেন Reboot এর পরে কী কী উঠেছিল আর কোনটা ব্যর্থ হয়েছিল। Service টাকে Boot এর তালিকায় যোগ করেন, তারপর নিজেই একটা Reboot দিয়ে যাচাই করে নেন।",
                  lessons: ["Process Management & Systemd", "System Logs (journalctl, systemctl)"],
                },
                {
                  id: "locked-out",
                  label: "নিজেই নিজেকে তালাবন্ধ",
                  situation:
                    "নিরাপত্তার জন্য Password দিয়ে ঢোকা বন্ধ করলেন আর Firewall চালু করলেন। Terminal বন্ধ করে আবার ঢুকতে গেলেন। লেখা এলো Permission denied (publickey), অথবা কিছুই এলো না, শুধু অপেক্ষা আর অপেক্ষা।",
                  without:
                    "Hosting কোম্পানির কাছে সাহায্য চেয়ে Ticket খোলেন, অথবা Server টাই মুছে নতুন করে বানান, সাথে মুছে যায় এতদিনের সব Setting।",
                  withIt:
                    "জানেন এমন বদল বসানোর আগে চাবি দিয়ে ঢোকা কাজ করছে কি না একটা দ্বিতীয় Terminal এ যাচাই করতে হয়, আর Firewall চালুর আগে SSH এর দরজাটা খুলে রাখতে হয়। আটকে গেলেও Hosting এর Dashboard এর Web Console দিয়ে ঢুকে একটা লাইন ঠিক করে বেরিয়ে আসেন।",
                  lessons: ["SSH & Security Keys", "Firewall Management (ufw)"],
                },
                {
                  id: "permission-denied",
                  label: "ছবি Upload এ Permission denied",
                  situation:
                    "একজন পর্যটক নিজের Profile এর ছবি তুলতে গেলেন, ব্যর্থ। Server এর Log এ লেখা EACCES: permission denied। নিজের ল্যাপটপে একই Code দিব্যি চলে।",
                  without:
                    "Internet এর পরামর্শে পুরো Folder এ chmod 777 চালান। Error চলে যায়, সাথে চলে যায় সব নিরাপত্তা: এখন Server এর যেকোনো Program, যেকোনো User ওই Folder এ যা খুশি লিখতে পারে, এমনকি চালানোর মতো ফাইলও।",
                  withIt:
                    "ls -l দেখে বোঝেন Folder টা কার, কোন Group এর, আর App চলছে কোন User হিসেবে। শুধু সেই একটা Folder এ শুধু App এর User কে লেখার অনুমতি দেন, বাকি সব যেমন ছিল তেমন থাকে।",
                  lessons: ["Permissions, Users, and Groups"],
                },
                {
                  id: "database-exposed",
                  label: "Database পুরো Internet এর জন্য খোলা",
                  situation:
                    "Firewall এ শুধু 22, 80 আর 443 খোলা, বাকি সব বন্ধ। তবু একদিন একটা নিরাপত্তা পরীক্ষার রিপোর্টে দেখলেন আপনার Server এর Port 5432 এ PostgreSQL বাইরে থেকে সাড়া দিচ্ছে।",
                  without:
                    "Firewall এর Rule গুলো বারবার পড়েন, সব ঠিক দেখায়। ধরে নেন রিপোর্টটাই ভুল, আর Database খোলাই থেকে যায়।",
                  withIt:
                    "Server এ ss দিয়ে দেখেন Port টা কোন ঠিকানায় শুনছে, আর বাইরে থেকে নিজে যাচাই করেন। জানেন Docker এর খোলা Port Firewall এর পাশ কাটিয়ে যায়, তাই Database কে শুধু Server এর নিজের ভেতরের ঠিকানায় বাঁধেন, আর আবার বাইরে থেকে পরীক্ষা করে নিশ্চিত হন দরজাটা সত্যিই বন্ধ।",
                  lessons: ["Firewall Management (ufw)", "Network Debugging (netstat, ss, curl)"],
                },
                {
                  id: "disk-full",
                  label: "Disk ভরে সাইট বন্ধ",
                  situation:
                    "মাসের পর মাস সব ঠিক চলছিল। হঠাৎ এক সকালে সব বুকিং ব্যর্থ, App এর Log এ লেখা No space left on device। কেউ কোনো বড় ফাইল রাখেননি।",
                  without:
                    "আন্দাজে কয়েকটা Folder মুছে দেন, যার একটায় ছিল গত সপ্তাহের Backup। সাইট ফেরে, দুই সপ্তাহ পরে আবার Disk ভরে যায়।",
                  withIt:
                    "df দিয়ে দেখেন কোন অংশটা ভরেছে, du দিয়ে এক Folder থেকে আরেক Folder এ নামতে নামতে দোষীটা খুঁজে পান, প্রায়ই জমে থাকা পুরনো Log বা পুরনো Backup। তারপর কারণটা সারান: Log এর সর্বোচ্চ আকার বেঁধে দেন আর পুরনো Backup নিজে থেকে মোছার নিয়ম বসান।",
                  lessons: ["Monitoring Tools (top, htop)", "System Logs (journalctl, systemctl)"],
                },
                {
                  id: "backup-never-ran",
                  label: "Backup তিন সপ্তাহ চলেইনি",
                  situation:
                    "প্রতি রাতে Database এর Backup নেওয়ার একটা কাজ বসিয়েছিলেন। হাতে চালালে চমৎকার চলে। একদিন একটা মুছে যাওয়া বুকিং ফেরত আনতে গিয়ে দেখলেন Backup এর Folder খালি, তিন সপ্তাহ ধরে।",
                  without:
                    "কাজটা আবার হাতে চালান, দিব্যি চলে। ধরে নেন সেই রাতগুলোতে হয়তো Server বন্ধ ছিল, আর একই ব্যবস্থা রেখে দেন।",
                  withIt:
                    "জানেন সময় ধরে চলা কাজ আপনার Terminal এর মতো পরিবেশ পায় না: Command খোঁজার পথ ছোট, আপনার Setting এর ফাইল পড়া হয় না, আর তার Error কোথাও লেখা না থাকলে কেউ দেখে না। পুরো Path লেখেন, Setting আলাদা ফাইল থেকে পড়ান, Output Log এ পাঠান, আর এমন ব্যবস্থা রাখেন যে কাজটা না চললে আপনার কাছে খবর আসে।",
                  lessons: ["Cron & Scheduled Tasks", "Environment Variables"],
                },
              ]}
              footer="সাতটা মুহূর্তের প্রতিটায় খেয়াল করুন, তফাতটা বুদ্ধির নয়, জানার। যিনি জানেন তিনি বেশি পরিশ্রম করছেন না, বরং কম করছেন, কারণ তিনি জানেন কোন Command এ তাকালে উত্তর পাওয়া যাবে। নিচে লেখা লেসনের নামগুলো মনে রাখুন, মডিউল পড়ার সময় এই মুহূর্তগুলো আবার ফিরে আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর বাইরেও এই মডিউলের শব্দ আর Command আপনার চোখে পড়বে এই জায়গাগুলোতে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Server এর Terminal এ:</strong> প্রতিদিনের কাজের টেবিল।
                  কোথায় আছি, কী চলছে, কে কোন Port এ, কোন ফাইল কার, শেষ এক ঘণ্টায় কী
                  লেখা হয়েছে। এই মডিউলের প্রায় প্রতিটা উত্তর এখানে একটা ছোট Command এর
                  দূরত্বে।
                </ListItem>
                <ListItem>
                  <strong>Hosting কোম্পানির Dashboard এ:</strong> নতুন Server বানানোর
                  পাতা, যেখানে Region, Operating System আর SSH চাবি বাছতে হয়। Web
                  Console, যেটা আটকে গেলে শেষ ভরসা। Cloud Firewall, যেটা আপনার Server এর
                  সামনে আরেকটা দেয়াল। আর CPU, Memory, Network এর Graph।
                </ListItem>
                <ListItem>
                  <strong>Error বার্তায়:</strong> Permission denied (publickey),
                  Connection refused, Connection timed out, No space left on device,
                  Address already in use, command not found, Killed। প্রতিটা বার্তা
                  একটা নির্দিষ্ট ঘটনার নাম, আর এই মডিউলের পরে প্রতিটা পড়েই বলতে পারবেন
                  কোথায় খুঁজতে হবে।
                </ListItem>
                <ListItem>
                  <strong>Config ফাইলে:</strong> SSH এর নিয়মের ফাইল, systemd এর Service
                  এর ফাইল, Caddy এর Caddyfile, Firewall এর Rule, সময় ধরে চলা কাজের
                  তালিকা, আর App এর Setting এর <code>.env</code> ধরনের ফাইল। সবই সাধারণ
                  লেখা, সবই নির্দিষ্ট Folder এ, আর কোনটা কোথায় তা লেসন ১ এর মানচিত্রে।
                </ListItem>
                <ListItem>
                  <strong>Docker আর CI এর ভেতরে:</strong> একটা Container এর ভেতরে
                  ঢুকলে আপনি একটা ছোট Linux এ দাঁড়ান। GitHub Actions এর Log পড়লে দেখবেন
                  একটা Ubuntu যন্ত্রে একের পর এক Command চলছে। এই মডিউলের Folder,
                  Permission, Environment Variable আর Process সেখানে হুবহু একই।
                </ListItem>
                <ListItem>
                  <strong>দলের আলাপে আর Interview এ:</strong> SIGTERM, Load Average,
                  OOM Killed, chmod 600, sudo, Port Forward, CLOSE_WAIT, Cron, এই শব্দগুলো
                  সহকর্মীরা প্রতিদিনের আলাপে ধরে নিয়েই বলেন। Incident এর সময়ের আলাপ
                  প্রায় পুরোটাই এই মডিউলের ভাষায় হয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "in-real-life",
      subHeader: { index: "006", title: "In Real Life" },
      title: <SectionTitle>Island Tours আর আপনার my-tours এ এর ব্যবহার</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Backend চলে একটা ভাড়া করা VPS এ, <code>island-vps-01</code>।
                পর্যটকের প্রতিটা বুকিং শেষ পর্যন্ত এই একটা যন্ত্রে এসে লেখা হয়। তাই এই
                যন্ত্রটা ভালো থাকা মানে ব্যবসা চালু থাকা। দিনের কাজে এই মডিউলের জ্ঞান
                সেখানে যেভাবে চেহারা নেয়, তার কয়েকটা নমুনা। প্রতিটার পাশে বলা আছে কোন
                লেসনে সেটা খোলা হবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সব কিছুর একটা নির্দিষ্ট জায়গা:</strong> Caddy এর Setting{" "}
                  <code>/etc/caddy/Caddyfile</code> এ, App এর গোপন Setting{" "}
                  <code>/etc/islandtours/api.env</code> এ, App এর Release গুলো{" "}
                  <code>/srv/islandtours/</code> এ, Caddy র Access Log{" "}
                  <code>/var/log/caddy/</code> এ, আর প্রতি রাতের Backup{" "}
                  <code>/var/backups/islandtours/</code> এ। নতুন কেউ দলে এলে প্রথম দিনেই
                  জানেন কী কোথায় খুঁজতে হবে, কারণ এই জায়গাগুলো Linux এর সাধারণ নিয়ম
                  মেনে বাছা। লেসন ১ এ।
                </ListItem>
                <ListItem>
                  <strong>Server চালু হলে কে কাকে জাগায়:</strong> SSH, Caddy, Docker আর
                  সময় ধরে চলা কাজের পাহারাদার, সবাই systemd এর তালিকায়। Server যেকোনো
                  কারণে Restart হলে কেউ Login না করলেও সবাই নিজে থেকে ওঠে, ঠিক ক্রমে। আর
                  কেউ পড়ে গেলে কয়েক সেকেন্ডে আবার ওঠে। লেসন ২ এ।
                </ListItem>
                <ListItem>
                  <strong>দরজা শুধু একজনের জন্য, শুধু চাবি দিয়ে:</strong> Root হিসেবে
                  সরাসরি ঢোকা বন্ধ, Password দিয়ে ঢোকা বন্ধ। শুধু <code>deploy</code>{" "}
                  নামের User ঢুকতে পারেন, আর শুধু নিজের ল্যাপটপের চাবি দিয়ে। প্রতিদিন
                  দরজায় যে হাজারো ব্যর্থ চেষ্টা আসে, সেগুলো Log এ পড়া যায়। লেসন ৩ এ।
                </ListItem>
                <ListItem>
                  <strong>App এর হাতে শুধু যতটুকু দরকার:</strong> App চলে{" "}
                  <code>islandtours</code> নামের একটা User হিসেবে, যে Login করতে পারে
                  না। সে নিজের Setting পড়তে পারে, কিন্তু নিজের Code বদলাতে পারে না, আর
                  Server এর অন্য কারো ফাইলে হাতও দিতে পারে না। App এ কোনো ফুটো পাওয়া
                  গেলেও ক্ষতি সেই ছোট গণ্ডির ভেতরে আটকে থাকে। লেসন ৪ এ।
                </ListItem>
                <ListItem>
                  <strong>গোপন জিনিস Code এর বাইরে:</strong> Database এর ঠিকানা আর
                  Login এর গোপন চাবি থাকে একটা ফাইলে, যা শুধু Root আর App এর Group পড়তে
                  পারে। GitHub এ এর কোনো চিহ্ন নেই। আর একটা Setting না পেলে App চালুই
                  হয় না, পরিষ্কার একটা বার্তা দিয়ে থামে। লেসন ৫ এ।
                </ListItem>
                <ListItem>
                  <strong>চারটা খোলা দরজা, বাকি সব বন্ধ:</strong> Firewall শুধু SSH আর
                  Web এর দরজা খোলা রাখে, Port 22, 80, 443 TCP আর 443 UDP, শেষটা আগের
                  মডিউলের HTTP/3 এর জন্য। App এর 3000, Database এর 5432, Redis এর 6379
                  বাইরের জন্য কখনো খোলা নয়। Hosting কোম্পানির Cloud Firewall আরেকটা
                  দেয়াল হিসেবে সামনে দাঁড়িয়ে। লেসন ৬ এ।
                </ListItem>
                <ListItem>
                  <strong>একটা অভিযোগ থেকে একটা লাইনে:</strong> একজন পর্যটক লিখলেন তাঁর
                  বুকিং ব্যর্থ হয়েছে। আগের মডিউলের Request এর ID ধরে Log এ খুঁজলে ঠিক
                  সেই Request এর লাইনটা পাওয়া যায়, তার আগে পরে কী ঘটেছিল সহ। লেসন ৭ এ।
                </ListItem>
                <ListItem>
                  <strong>স্বাস্থ্যের পাঁচ Command:</strong> কিছু অস্বাভাবিক মনে হলে
                  দলের যে কেউ পাঁচটা Command চালিয়ে এক মিনিটে বলে দিতে পারেন CPU, Memory,
                  Disk আর চলমান Process এর অবস্থা। লেসন ৮ এ।
                </ListItem>
                <ListItem>
                  <strong>সাইট বন্ধ, বাইরে থেকে ভেতরে:</strong> নাম ঠিক আছে কি না, Server
                  এ পৌঁছানো যায় কি না, দরজা খোলা কি না, তালা ঠিক আছে কি না, Caddy আর App
                  সাড়া দিচ্ছে কি না, প্রতিটা ধাপ একটা করে Command। লেসন ৯ এ।
                </ListItem>
                <ListItem>
                  <strong>প্রতি রাত সাড়ে তিনটায় Backup:</strong> ঢাকার সময় রাত ৩টা
                  ৩০ মিনিটে, যা Server এর UTC ঘড়িতে 21:30, Database এর একটা পূর্ণ কপি
                  নেওয়া হয়, আর সাত দিনের পুরনোগুলো নিজে থেকে মুছে যায়। কাজটা না চললে
                  দলের কাছে খবর যায়। লেসন ১০ এ।
                </ListItem>
                <ListItem>
                  <strong>একটা লেখা Runbook:</strong> এই Server টা কীভাবে শূন্য থেকে
                  দাঁড় করানো হয়েছে, প্রতিটা ধাপ ক্রমে লেখা আছে। Server হারালে বা নতুন
                  একটা লাগলে কেউ মনে করার চেষ্টা করেন না, লেখা ধরে আবার বানান। আর মাসে
                  একবার একটা ছোট তালিকা মেলানো হয়: Update, Disk, Certificate এর মেয়াদ,
                  Log, একটা Backup ফেরত আনার পরীক্ষা, আর কার কার হাতে চাবি আছে। লেসন ১১
                  এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Island Tours এর API, Database আর Redis এখন Docker এর Container এ
                চলে, যেটা পরের একটা মডিউলের বিষয়। আপনার নিজের my-tours এই মডিউলে আরও
                সরল পথে চলবে: Node.js এর API সরাসরি একটা systemd Service হিসেবে,{" "}
                <code>mytours</code> নামের নিজস্ব User দিয়ে। এই মডিউল চলাকালীন আপনি
                নিজে হাতে যা যা করবেন, সেটা এরকম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  একটা অনুশীলনের Linux জোগাড় করবেন, নিজের কম্পিউটারে অথবা একটা ছোট
                  ভাড়া করা VPS এ, আর তার Folder গুলোর একটা নিজের হাতে আঁকা মানচিত্র
                  বানাবেন।
                </ListItem>
                <ListItem>
                  my-tours এর API এর জন্য একটা systemd Service লিখবেন, Crash হলে নিজে
                  ওঠে আর Server চালু হলে নিজে চালু হয় এমন, আর Reboot দিয়ে প্রমাণ
                  করবেন।
                </ListItem>
                <ListItem>
                  একজোড়া SSH চাবি বানিয়ে নিজের Server এ শুধু চাবি দিয়ে ঢোকার ব্যবস্থা
                  করবেন, Root আর Password দুইটাই বন্ধ করে, নিজেকে আটকে না ফেলে।
                </ListItem>
                <ListItem>
                  App এর জন্য আলাদা User বানাবেন, Code আর Setting এর ফাইলের মালিকানা আর
                  Permission এমনভাবে সাজাবেন যে App যতটুকু দরকার ঠিক ততটুকু পায়।
                </ListItem>
                <ListItem>
                  গোপন Setting এর ফাইল বানাবেন, আর App কে এমনভাবে লিখবেন যে একটা
                  Setting না পেলে চালুই হয় না। তারপর ইচ্ছা করে একটা মুছে দেখবেন Log এ কী
                  লেখা আসে।
                </ListItem>
                <ListItem>
                  Firewall এর Rule বসিয়ে বাইরে থেকে পরীক্ষা করবেন কোন দরজা খোলা, Server
                  এর উপর ইচ্ছা করে চাপ দিয়ে স্বাস্থ্যের সংখ্যাগুলো নড়তে দেখবেন, একটা
                  ইচ্ছা করে ভাঙা Network এর সমস্যা ধাপে ধাপে ধরবেন, আর প্রতি রাতের
                  একটা Backup এর কাজ বসাবেন।
                </ListItem>
                <ListItem>
                  শেষে সব এক জায়গায়: একটা নতুন Server এ শূন্য থেকে my-tours দাঁড় করাবেন,
                  নিজের Domain এ HTTPS সহ। তারপর বাইরে থেকে শেষ যাচাই আর একটা Reboot,
                  আর পুরো কাজটা নিজের ভাষায় একটা Runbook এ লিখে রাখবেন, যাতে পরের বার
                  চোখ বন্ধ করে নয়, লেখা ধরে আবার করতে পারেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মডিউল শেষে আপনার হাতে থাকবে একটা ছোট কিন্তু সত্যিকারের Production এর
                মতো সাজানো Server, যার প্রতিটা Setting আপনি নিজে লিখেছেন আর প্রতিটা
                লাইনের কারণ বলতে পারেন। পরের মডিউলগুলো এই Server এর উপরেই দাঁড়াবে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "before-and-after",
      subHeader: { index: "007", title: "Before and After" },
      title: <SectionTitle>এই মডিউল আপনাকে কোথা থেকে কোথায় নিয়ে যাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <BeforeAfterSplit
              before={[
                "কালো পর্দায় এসে কোথা থেকে শুরু করবেন জানেন না",
                "App চালু রাখতে Terminal খোলা রাখেন, বা & জুড়ে দিয়ে আশা করেন",
                "Server এ Password দিয়ে Root হিসেবে ঢোকেন",
                "Permission denied এলে সব খুলে দেন",
                "গোপন Setting Code এ বা Repository তে থাকে",
                "সাইট বন্ধ হলে প্রথম কাজ Server Restart",
                "সময় ধরে চলা কাজ চলছে কি না তা কখনো যাচাই করেননি",
              ]}
              after={[
                "যেকোনো Linux Server এ ঢুকে পাঁচ মিনিটে বলতে পারেন কী কোথায় আছে",
                "App কে systemd Service হিসেবে চালান, যা Crash আর Reboot দুইটাই সামলায়",
                "শুধু চাবি দিয়ে, নিজের User হিসেবে ঢোকেন, আর নিজেকে আটকে না ফেলে দরজা বন্ধ করতে জানেন",
                "ফাইলের মালিক আর Permission পড়ে ঠিক যতটুকু দরকার ততটুকুই খোলেন",
                "গোপন Setting Code এর বাইরে রাখেন, আর একটা না পেলে App চালুই হয় না",
                "বিপদে আগে Log, স্বাস্থ্যের সংখ্যা আর Network ধাপে ধাপে দেখেন, তারপর হাত দেন",
                "নিয়মিত কাজ বসান, আর না চললে খবর পাওয়ার ব্যবস্থাও রাখেন",
              ]}
              footer="বাঁ দিকের তালিকায় নিজেকে পেলে লজ্জার কিছু নেই, Frontend থেকে আসা অনেক অভিজ্ঞ Developer ও এখানে দাঁড়িয়ে থাকেন, কারণ সহজ Hosting সেবা এই সব কিছু লুকিয়ে রাখে। ডান দিকের তালিকাটা মডিউল শেষে নিজেকে যাচাই করার জন্য রেখে দিন। যে লাইনটা তখনও পারছেন না মনে হবে, সেটার লেসনটা আরেকবার করুন, শুধু পড়ে নয়, হাতে চালিয়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলে আপনার লক্ষ্য Command মুখস্থ করা নয়, অন্যকে বোঝাতে পারা।
                মান যাচাইয়ের একটা সহজ উপায় আছে। মডিউল শেষে এমন কাউকে বসান যিনি এসব
                জানেন না, আর একটা সাদা কাগজে এঁকে তাঁকে বোঝান, রাত তিনটায় Island Tours
                এর Server হঠাৎ Restart হলে বিদ্যুৎ আসা থেকে সকালের প্রথম বুকিং পর্যন্ত
                কী কী ঘটে। কে প্রথমে ওঠে, Firewall এর Rule কখন বসে, App কোন User হিসেবে
                আর কোথা থেকে Setting পড়ে চালু হয়, সব কিছু কোন খাতায় লেখা হয়, সেই রাতের
                Backup তবু হয় কি না, আর সকালে আপনি নিজের ল্যাপটপ থেকে কোন কয়েকটা
                Command চালিয়ে নিশ্চিত হবেন যে সব ঠিক আছে।
              </ContentParagraph>
              <ContentParagraph>
                তিনি যদি মাঝপথে একটা কেন জিজ্ঞেস করেন আর আপনি উত্তর দিতে পারেন,
                তাহলে আপনি সত্যিই শিখেছেন। যেখানে আটকে যাবেন, সেটাই ফাঁক, আর সেই
                ফাঁক কোন লেসনে ভরবে তা উপরের Roadmap দেখে বের করে নিতে পারবেন।
                প্রতিটা লেসনের Assignment এর শেষ কাজটা এই কারণেই নিজের ভাষায় লিখে
                বোঝানোর।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "how-to-study",
      subHeader: { index: "008", title: "How to Study" },
      title: <SectionTitle>এই মডিউল কীভাবে পড়লে সবচেয়ে বেশি পাবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>আগে যা জানা থাকা দরকার।</strong> চারটা জিনিস ঝাপসা থাকলে আগে
                একবার চোখ বুলিয়ে নিন। Module 01 এর What an Operating System Actually
                Does আর Process, Thread and Concurrency, কারণ এখানে প্রতিটা লেসনে
                Process আর Operating System এর কথা আসবে। Module 03 এর Gateway আর NAT & PAT, কারণ Firewall আর Network
                Debugging এর লেসন সেখান থেকে শুরু করে। Module 05 এর Port & Socket আর
                Connection Close, কারণ কে কোন ঠিকানায় শোনে আর একটা Program কে ভদ্রভাবে
                থামানো এখানে বারবার আসবে। আর Module 06 এর Full HTTPS Journey, কারণ সেই
                যাত্রার শেষ ধাপগুলোই এই মডিউলের Server এর ভেতরে ঘটে। এগুলো নতুন করে
                পড়ানো হবে না, শুধু নাম ধরে মনে করিয়ে দেওয়া হবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>কত সময় লাগবে।</strong> পুরো মডিউলের জন্য এক থেকে দুই সপ্তাহ
                ধরুন। এই মডিউলের প্রতিটা লেসনই হাতে কলমে, তাই পড়ার সময়ের চেয়ে চালানোর
                সময় বেশি লাগবে। Lab আর Assignment সহ প্রতিটা লেসনে এক থেকে দুই ঘণ্টা ধরলে
                বাস্তবসম্মত হবে। Process Management & Systemd আর Network Debugging
                সবচেয়ে ভারী, এই দুইটার জন্য বাড়তি সময় রাখুন। আর শেষ লেসন VPS Setup,
                End to End এর জন্য একটা পুরো বেলা আলাদা রাখুন, কারণ সেখানে একটা Server
                শুরু থেকে শেষ পর্যন্ত এক বসায় দাঁড় করাবেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ক্রম ভাঙবেন না।</strong> লেসন ১ এ যে অনুশীলনের Server জোগাড়
                করবেন, পরের নয়টা লেসনের সব Lab সেখানেই চলবে। লেসন ২ এর Service টা লেসন
                ৫ এ Setting পাবে, লেসন ৭ এ তার Log পড়বেন, আর লেসন ৯ এ তাকে ইচ্ছা করে
                ভেঙে সারাবেন। লেসন ৩ এর SSH ছাড়া লেসন ৬ এর Firewall বসাতে গেলে নিজেকেই
                আটকে ফেলার ঝুঁকি থাকে। প্রতিটা লেসন আগেরটার কাজের উপর নতুন একটা তলা
                তোলে। আর লেসন ১১ আগের দশটার সব কাজ একটা নতুন Server এ একসাথে করায়,
                তাই আগের দশটা ছাড়া সেটা শুধু Command এর একটা লম্বা তালিকা মনে হবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আগে অনুশীলনের Server, তারপর পড়া:</strong> এই মডিউল শুধু
                  পড়ে শেখা যায় না। লেসন ১ এর প্রথম অংশ দেখাবে নিজের কম্পিউটারে বিনা
                  খরচে একটা Ubuntu চালানোর উপায়, আর চাইলে অনুশীলনের জন্য একটা ছোট VPS
                  নেওয়ার সংক্ষিপ্ত ধাপ। সত্যিকারের কাজের Server এর পুরো ব্যবস্থা লেসন ১১ এ।
                  যেটাই বাছুন, এমন একটা Server এ অনুশীলন করুন যেটা ভাঙলে কারো ক্ষতি
                  নেই। কোনো চালু Production Server এ কখনো অনুশীলন করবেন না।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Command নিজে চালান:</strong> লেসনের Output গুলো একটা
                  আসল Ubuntu 24.04 অনুশীলনের Server থেকে নেওয়া। আপনার Server এ সময়,
                  Process এর নম্বর, Memory এর সংখ্যা আলাদা হবে, সেটাই স্বাভাবিক, আকারটা
                  মিললেই হলো। যেখানে অনুশীলনের Server আর একটা আসল VPS এর তফাত আছে,
                  লেসনে সেটা বলে দেওয়া আছে।
                </ListItem>
                <ListItem>
                  <strong>দুইটা Terminal খোলা রাখার অভ্যাস করুন:</strong> SSH, Firewall
                  আর Permission এর মতো দরজা সংক্রান্ত কিছু বদলানোর সময় একটা Terminal এ
                  ঢুকে থাকুন, আর দ্বিতীয়টায় বদলটা যাচাই করুন। কিছু ভুল হলে প্রথমটা দিয়ে
                  ফেরত আসতে পারবেন। এই একটা অভ্যাস অনেক রাতের দুশ্চিন্তা বাঁচায়।
                </ListItem>
                <ListItem>
                  <strong>না বুঝে sudo চালাবেন না:</strong> লেসনের প্রতিটা{" "}
                  <code>sudo</code> এর পাশে বলা আছে কেন বাড়তি ক্ষমতা লাগছে। Internet থেকে
                  পাওয়া কোনো Command এ এই শব্দটা দেখলে আগে বুঝে নিন সেটা কী বদলাবে।
                </ListItem>
                <ListItem>
                  <strong>Interactive অংশগুলো এড়িয়ে যাবেন না:</strong> প্রতিটা
                  লেসনে কয়েকটা জায়গা আছে যেখানে আপনি নিজে বোতাম চেপে কিছু বদলাতে বা ধাপে
                  ধাপে এগোতে পারেন। আগে নিজে অনুমান করুন কী হবে, তারপর চাপুন। অনুমান ভুল
                  হলে সেটাই সবচেয়ে ভালো শেখা।
                </ListItem>
                <ListItem>
                  <strong>গোপন জিনিস কখনো Command এ লিখবেন না:</strong> Terminal আপনার
                  লেখা প্রতিটা Command মনে রাখে। Password বা চাবি সরাসরি Command এ লিখলে
                  সেটা ইতিহাসের ফাইলে থেকে যায়। লেসনগুলো দেখাবে নিরাপদ উপায়, প্রথম দিন
                  থেকেই সেই অভ্যাসটা নিন।
                </ListItem>
                <ListItem>
                  <strong>আটকে গেলে:</strong> Error বার্তাটা শব্দ ধরে পড়ুন, Linux এর
                  বার্তা প্রায়ই ঠিক যা ঘটেছে তাই বলে। তারপর সেই লেসনের শেষের Recap আর
                  Summary ছকটা দেখুন। তাতেও না হলে নিজেকে জিজ্ঞেস করুন, আমি কি আন্দাজ
                  করছি, নাকি দেখে নিয়েছি? প্রায় সব বিভ্রান্তির মূল একটাই, যন্ত্রকে না
                  জিজ্ঞেস করে ধরে নেওয়া।
                </ListItem>
                <ListItem>
                  <strong>একটা নিজের Command এর খাতা রাখুন:</strong> প্রতিটা নতুন
                  Command এর পাশে এক লাইনে লিখুন সেটা কোন প্রশ্নের উত্তর দেয়, আর প্রতিটা
                  নতুন Error বার্তার পাশে লিখুন কোথায় খুঁজতে হয়। মডিউল শেষে এই এক পাতাই
                  আপনার সবচেয়ে কাজের নোট হবে, বিশেষ করে রাত দুইটার কোনো বিপদে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মানচিত্র দেখা শেষ। এবার প্রথম লেসন খুলুন,{" "}
                <strong>Linux Filesystem Architecture</strong>। সেখানে প্রথমে একটা
                অনুশীলনের Server জোগাড় হবে, তারপর সেই কালো পর্দার প্রথম প্রশ্নটা দিয়ে
                শুরু, আমি এখন কোথায়?
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["লেসন", "এক লাইনে যা নিয়ে ফিরবেন"],
    rows: [
      [
        "Linux Filesystem Architecture",
        "অনুশীলনের Server জোগাড়, VPS কী, একটাই গাছের মতো Folder, কোন ফাইল কোথায়, আর Software বসানো",
      ],
      [
        "Process Management & Systemd",
        "Process আর Signal, আর systemd দিয়ে App কে চালু রাখা, Crash এ তোলা, Boot এ চালু করা",
      ],
      [
        "SSH & Security Keys",
        "চাবি দিয়ে নিরাপদে ঢোকা, নতুন VPS এর প্রথম ঘণ্টা, আর নিজেকে আটকে না ফেলা",
      ],
      [
        "Permissions, Users, and Groups",
        "কে কোন ফাইল পড়ে, লেখে, চালায়, আর ঠিক যতটুকু দরকার ততটুকু অনুমতি",
      ],
      [
        "Environment Variables",
        "Setting আর গোপন চাবি Code এর বাইরে, Service এর হাতে পৌঁছানো, আর না পেলে সাথে সাথে থামা",
      ],
      [
        "Firewall Management (ufw)",
        "কোন দরজা খোলা, কোনটা বন্ধ, বাইরে থেকে যাচাই, আর Docker এর ফাঁদ",
      ],
      [
        "System Logs (journalctl, systemctl)",
        "Server এর খাতা কোথায়, আর হাজার লাইনের ভেতর আসল কারণের লাইনটা খোঁজা",
      ],
      [
        "Monitoring Tools (top, htop)",
        "CPU, Memory, Disk আর Process এর সংখ্যা পড়া, আর কোন সংখ্যায় চিন্তা করা উচিত",
      ],
      [
        "Network Debugging (netstat, ss, curl)",
        "সাইট না খুললে নাম থেকে App পর্যন্ত ধাপে ধাপে যাচাই, আর প্রতিটা Error এর মানে",
      ],
      [
        "Cron & Scheduled Tasks",
        "সময় ধরে নিজে থেকে চলা কাজ, তার চুপচাপ ব্যর্থতা, আর না চললে খবর পাওয়ার ব্যবস্থা",
      ],
      [
        "VPS Setup, End to End",
        "খালি VPS থেকে নিজের Domain এ HTTPS এ চালু App, বাইরে থেকে শেষ যাচাই, Reboot পরীক্ষা আর মাসিক রক্ষণাবেক্ষণের তালিকা",
      ],
    ],
  },
};
