/**
 * What: Module 07 Lesson 11, VPS Setup, End to End. It takes the reader from an empty
 * rented server to the my-tours API running over HTTPS: choosing and creating the VPS, the
 * first login, updates, the deploy user, locking SSH, the firewall, Node and the app's own
 * user, shipping the code as a systemd service, Caddy and HTTPS, logs, uptime and backups,
 * and a final check from outside. It closes the module with a recap of all eleven lessons.
 *
 * Why: The ten lessons before this one each taught one tool. A real server needs them in a
 * particular order, and most first-day disasters (a lockout, a silent open port, an app
 * that does not survive a reboot) come from the order, not from any single command. Every
 * command here was run on an Ubuntu 24.04 practice server, so every output is real.
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
  LockoutLab,
  OutsideCheckLab,
  SetupChecklistLab,
} from "../../../components/course/topics/linux/vps-animations";
import {
  DropInOrderSplit,
  HostingSpectrumDiagram,
  ModuleServerDiagram,
  OutsideCheckDiagram,
  ServerMapDiagram,
  TwoSessionsDiagram,
} from "../../../components/course/topics/linux/vps-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const linkClass = "text-primary underline underline-offset-4";

const lesson = (id: string, label: string) => (
  <Link href={`/devops/topic/${id}`} className={linkClass}>
    {label}
  </Link>
);

export const vpsSetupContent: TopicData = {
  id: "vps-setup",
  introduction: {
    badge: "MODULE 07 · LESSON 11",
    title: <SectionTitle>একটা খালি Server থেকে HTTPS এ চলা App</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          রাত সাড়ে আটটা। Provider এর কাছ থেকে একটা Email এলো: আপনার VPS তৈরি, ঠিকানা
          198.51.100.42। ব্যস, এটুকুই। কোনো Website নেই, কোনো App নেই, কোনো নিয়ম নেই। একটা
          ভাড়া করা যন্ত্র, যার ভেতরে শুধু একটা নতুন Ubuntu, আর যার দরজায় Internet এর সব Bot
          এরই মধ্যে টোকা দেওয়া শুরু করেছে।
        </ContentParagraph>
        <ContentParagraph>
          গত দশটা লেসনে আপনি একটা একটা করে যন্ত্রপাতি হাতে নিয়েছেন। Folder এর মানচিত্র,
          systemd, SSH, Permission, Environment Variable, Firewall, Log, Monitoring, Network
          Debugging আর Timer। প্রতিটা আলাদা করে বুঝেছেন। কিন্তু একটা আসল Server এ এগুলো আলাদা
          আসে না, আসে একটা নির্দিষ্ট ক্রমে। ক্রম ভুল হলে প্রতিটা কমান্ড ঠিক থাকা সত্ত্বেও আপনি
          নিজেকে বাইরে আটকে ফেলতে পারেন, বা একটা দরজা খোলা রেখে ভাবতে পারেন সব বন্ধ।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই প্রথম সন্ধ্যার গল্প। শুরু হবে VPS বাছাই আর ভাড়া দিয়ে, শেষ হবে এমন একটা
          Server দিয়ে যেখানে my-tours এর API চলছে https://api.my-tours.example এ, root আর
          Password দিয়ে কেউ ঢুকতে পারে না, শুধু তিনটা Port খোলা, Reboot এর পরেও সব নিজে ওঠে,
          প্রতি রাতে Backup হয়, আর এসব আপনি বাইরে থেকে নিজের চোখে যাচাই করেছেন। এখানে যত
          কমান্ড দেখবেন, সবগুলো একটা অনুশীলনের Ubuntu 24.04 Server এ সত্যি চালানো, আর যত
          ফলাফল দেখবেন সব সেখান থেকে তোলা। শেষে পুরো মডিউলটা একটা গল্পে জোড়া লাগাব।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "বাড়ি বানাতে কেউ আগে আসবাব কেনে না। আগে ভিত, তারপর দেয়াল, তারপর দরজায় তালা, তারপর আলো আর পানি, আর একদম শেষে আসবাব। Server ও তাই। App টা আসবাব, সবার শেষে আসে।",
      author: "VPS Setup",
      role: "Lesson 11",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "what-we-build",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>শেষে ঠিক কী দাঁড়াবে, আগে সেটা লিখে ফেলি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Server Setup করা মানে কী, এই প্রশ্নের উত্তর মানুষভেদে আলাদা হয়। কেউ বলবেন App
                চালু হলেই হলো। কেউ বলবেন HTTPS না থাকলে হয়নি। এই অস্পষ্টতা থেকেই অর্ধেক কাজ
                বাদ পড়ে যায়। তাই কাজ শুরুর আগে লিখে ফেলি, কাজ শেষে কোন কোন কথা সত্যি হবে। এই
                তালিকাটাই আমাদের লক্ষ্য, আর লেসনের শেষে বাইরে থেকে একটা একটা করে মিলিয়ে দেখব।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কেউ root হয়ে SSH দিয়ে ঢুকতে পারে না</strong>, আর কেউ Password দিয়েও
                  না। ঢোকা যায় শুধু deploy নামের User হয়ে, শুধু আপনার Private Key দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>বাইরে থেকে শুধু তিনটা দরজা খোলা</strong>: 22 (SSH), 80 আর 443
                  (Web)। বাকি সব Port এ টোকা দিলে কোনো উত্তর যায় না।
                </ListItem>
                <ListItem>
                  <strong>Security Patch নিজে নিজে বসে</strong>, প্রতিদিন, আপনি মনে রাখুন বা
                  না রাখুন।
                </ListItem>
                <ListItem>
                  <strong>App চলে নিজের আলাদা User হয়ে</strong>, mytours, যার কোনো Login
                  Shell নেই। App এর Secret থাকে এমন একটা File এ, যেটা শুধু root আর mytours
                  পড়তে পারে।
                </ListItem>
                <ListItem>
                  <strong>App টা systemd চালায়।</strong> ভেঙে পড়লে কয়েক সেকেন্ডে আবার ওঠে,
                  Reboot এর পরে নিজেই চালু হয়।
                </ListItem>
                <ListItem>
                  <strong>পর্যটক আসেন শুধু HTTPS এ</strong>, Caddy এর হাত ধরে। App নিজে শুধু
                  127.0.0.1 এ শোনে, বাইরের কেউ তাকে সরাসরি পায় না।
                </ListItem>
                <ListItem>
                  <strong>প্রতি রাতে Backup হয়</strong>, আর অন্তত একবার সেই Backup থেকে Restore
                  করে মিলিয়ে দেখা হয়েছে।
                </ListItem>
                <ListItem>
                  <strong>উপরের সবকিছু বাইরে থেকে যাচাই করা</strong>, Laptop থেকে, ঠিক যেভাবে
                  একজন অচেনা মানুষ দেখবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের ছবিটা সেই শেষ অবস্থা। প্রতিটা বাক্সের নিচে লেখা আছে কোন লেসন সেটা শিখিয়েছে।
                এই লেসনে নতুন কোনো যন্ত্র শিখবেন না, শিখবেন এগুলো কোন ক্রমে বসাতে হয় আর কেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ServerMapDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "আগে অনুশীলনের Server এ, তারপর আসলটায়",
          content: (
            <div className="space-y-3">
              <p>
                পুরো লেসনটা প্রথমবার একটা অনুশীলনের Server এ করুন। Multipass এর Virtual Machine,
                WSL2 বা Docker এর Container, যেকোনোটা চলবে, কোনটা কীভাবে চালু করতে হয় সেটা{" "}
                {lesson("linux-filesystem", "লেসন ০১")} এ আছে। ভুল হলে মুছে আবার শুরু করবেন,
                কোনো খরচ নেই। দ্বিতীয়বার আসল VPS এ করবেন, তখন হাত কাঁপবে না।
              </p>
              <p>
                এই লেসনের ফলাফলগুলো এসেছে একটা Docker Container থেকে, যেটা Ubuntu 24.04 আর
                systemd চালায়, আর পাশের আরেকটা Container Laptop এর ভূমিকায়। তাই কয়েকটা জায়গায়
                আসল VPS এর চেয়ে আলাদা দেখবেন: ঠিকানা 198.51.100.42 এর বদলে 172.21.0.2, Disk এর
                নাম overlay, CPU আর RAM এর সংখ্যা Docker যন্ত্রের, আর HTTPS এর Certificate আসে
                Caddy এর নিজের ভেতরের CA থেকে, কারণ অনুশীলনের Server এর কোনো Public Domain নেই।
                যেখানে পার্থক্যটা জরুরি, সেখানে এক লাইনে বলে দেওয়া আছে আসল VPS এ কী দেখবেন।
              </p>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "vps-or-not",
      subHeader: { index: "002", title: "VPS or Not" },
      title: <SectionTitle>VPS কখন, কোনটা, কোথায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                VPS মানে Virtual Private Server। একটা বড় যন্ত্রকে Provider কয়েকটা ভাগে কাটে,
                প্রতিটা ভাগ নিজের মতো একটা পুরো Server মনে করে, নিজের OS, নিজের root, নিজের IP।
                আপনি একটা ভাগ ভাড়া নেন। কিন্তু VPS একমাত্র উপায় নয়, আর সবসময় সেরা উপায়ও নয়।
                নিচের ছবিটা দেখায় কোন ধরনের Hosting এ কোন তলার দায়িত্ব আপনার।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HostingSpectrumDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Vercel এর মতো PaaS এ আপনি শুধু Code দেন, বাকি সব তাদের। OS এর Patch, Firewall,
                Certificate, Process চালু রাখা, কিছুই ভাবতে হয় না। বিনিময়ে নিয়ন্ত্রণ কম, আর
                কিছু কাজ সেখানে চলেই না বা খরচ বেশি পড়ে। VPS এ উল্টো: পুরো নিয়ন্ত্রণ আপনার, আর
                সেই সাথে পুরো দায়িত্বও। Security Patch না বসালে সেটা আপনার দোষ, Disk ভরে গেলে
                আপনার রাত নষ্ট।
              </ContentParagraph>
              <ContentParagraph>VPS বেছে নেওয়ার ভালো কারণগুলো এরকম।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>দীর্ঘ সময় চলা Process।</strong> WebSocket (Module 06 এর শেষ লেসন),
                  পেছনে চলা Job, একটা Queue এর Worker। PaaS এর অনেক জায়গায় একটা Request এর
                  সময়সীমা থাকে, VPS এ নেই।
                </ListItem>
                <ListItem>
                  <strong>নিজের Database আর Cache পাশে রাখা।</strong> PostgreSQL আর Redis একই
                  যন্ত্রে, 127.0.0.1 দিয়ে, কোনো আলাদা বিল ছাড়া।
                </ListItem>
                <ListItem>
                  <strong>খরচ আগে থেকে জানা।</strong> মাসে একটা নির্দিষ্ট ভাড়া। হঠাৎ ভিড়ে বিল
                  লাফিয়ে ওঠে না, যদিও ভিড় বেশি হলে Server ও ধীর হয়।
                </ListItem>
                <ListItem>
                  <strong>শেখা।</strong> এই পুরো মডিউলটা শিখতে একটা Server লাগে। একটা VPS
                  চালাতে পারলে আপনি PaaS এর ভেতরে কী ঘটে সেটাও বোঝেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর কখন VPS না: শুধু একটা Next.js এর Frontend হলে, যেখানে Vercel নিজেই Build,
                CDN আর Preview দেয়। Island Tours ঠিক এই ভাগটাই করেছে। পাতাগুলো Vercel থেকে আসে,
                আর API, Database আর Cache চলে একটা VPS এ। দুইটা পদ্ধতি একে অপরের শত্রু নয়, যে
                কাজের জন্য যেটা ভালো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>কত বড় Server?</strong> শুরুতে অনেকে বড় Plan কেনেন, ভয়ে। দরকার নেই, কারণ
                VPS পরে বড় করা যায়। my-tours এর API একা একটা ছোট Node Process, অনুশীলনের Server এ
                চালু অবস্থায় তার Memory লাগছিল ১৬ MB এর মতো। তাই শুধু API এর জন্য 1 vCPU আর 1
                থেকে 2 GB RAM যথেষ্ট। পরে Docker এ PostgreSQL আর Redis পাশে বসালে 2 vCPU আর 4 GB
                RAM এর দিকে যান, Island Tours এর Server যেমন। Disk এ 25 GB থেকে শুরু করা চলে,
                NVMe হলে ভালো। ছোট Plan নিলে Swap যোগ করবেন, সেটা নিচে করব।
              </ContentParagraph>
              <ContentParagraph>
                <strong>কোন Region?</strong> Module 02 তে দেখেছেন, দূরত্ব মানে Latency, আর
                Latency কোনো টাকায় কেনা যায় না। আপনার পর্যটক বাংলাদেশে হলে এমন একটা Region নিন
                যেটা কাছে, যেমন Singapore বা Mumbai। ইউরোপ বা আমেরিকার Region এ প্রতিটা Round
                Trip কয়েকগুণ লম্বা, আর Module 06 এ গুনেছেন একটা HTTPS পাতা খুলতে কতগুলো Round Trip
                লাগে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>কোন Provider?</strong> DigitalOcean, Hetzner, Hostinger, Vultr, Linode,
                AWS Lightsail, সবাই একই জিনিস বিক্রি করে: একটা Linux যন্ত্র আর একটা IP। দাম বদলায়,
                তাই এখানে দাম লিখছি না। বরং নিচের প্রশ্নগুলো দিয়ে মেলান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কী দেখবেন", "কেন জরুরি", "কোথায় খুঁজবেন"],
          rows: [
            ["কাছের Region", "প্রতিটা Request এর Latency কমে", "Server বানানোর পাতায় Location এর তালিকা"],
            ["Ubuntu LTS Image", "পাঁচ বছর Security Patch, এই কোর্সের সব কমান্ড মিলবে", "Operating System বা Image এর তালিকা"],
            ["বানানোর সময় SSH Key যোগ", "প্রথম Login থেকেই Password লাগে না", "Authentication বা SSH Keys এর ঘর"],
            ["Web Console", "নিজেকে বাইরে আটকে ফেললে ফেরার রাস্তা", "Server এর পাতায় Console, Browser Terminal বা Rescue"],
            ["Snapshot আর Backup", "ভুলের আগের অবস্থায় পুরো Server ফেরানো", "Backups বা Snapshots এর ঘর"],
            ["Cloud Firewall", "Server এর বাইরে দ্বিতীয় দেয়াল", "Networking বা Firewall এর ঘর"],
            ["IPv4 আর IPv6", "অনেক Provider এখন IPv4 এর জন্য আলাদা দাম নেয়", "Plan এর বিবরণ"],
            ["ঘণ্টায় নাকি মাসে বিল", "অনুশীলনের Server কয়েক ঘণ্টা চালিয়ে মুছে ফেলা সস্তা", "Pricing এর পাতা"],
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "create",
      subHeader: { index: "003", title: "Create the Server" },
      title: <SectionTitle>Server বানানো, Click এর আগে আর পরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Create বোতামে চাপ দেওয়ার আগে তিনটা জিনিস হাতে রাখুন। এগুলো ছাড়া শুরু করলে মাঝপথে
                থেমে যেতে হয়, বা পরে ঠিক করতে গিয়ে বেশি ঝামেলা হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Laptop এ একটা SSH Key।</strong> {lesson("ssh-security-keys", "লেসন ০৩")}{" "}
                  এ বানিয়েছেন। Public অংশটা দেখুন, এটাই Provider কে দেবেন। Private অংশ কখনো কাউকে
                  দেবেন না, কোথাও Paste করবেন না।
                </ListItem>
                <ListItem>
                  <strong>একটা Domain।</strong> HTTPS এর জন্য লাগবে। Module 04 এ শিখেছেন কীভাবে
                  কিনতে হয় আর কোথায় Record বসাতে হয়। এই লেসনে নাম ধরছি api.my-tours.example, আপনি
                  নিজেরটা বসাবেন।
                </ListItem>
                <ListItem>
                  <strong>Provider এর Account এ Two-factor Authentication।</strong> কথাটা ছোট
                  শোনায়, কিন্তু Server এর সবচেয়ে বড় দরজা SSH নয়, Provider এর Dashboard। কেউ সেখানে
                  ঢুকতে পারলে Web Console খুলে root হয়ে যেতে পারে, বা পুরো Server টাই মুছে দিতে
                  পারে। Password টা Password Manager এ রাখুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "laptop: Public Key টা দেখুন",
          code: `you@laptop:~$ ls -l ~/.ssh
-rw------- 1 you you 399 Oct 31 07:33 id_ed25519
-rw-r--r-- 1 you you  92 Oct 31 07:33 id_ed25519.pub

# Provider কে দেবেন শুধু .pub File এর ভেতরের এক লাইন
you@laptop:~$ cat ~/.ssh/id_ed25519.pub
ssh-ed25519 AAAAC3Nza...(এক লম্বা লাইন)... you@laptop

# এই Key এর আঙুলের ছাপ। পরে Server এর authorized_keys এর সাথে মেলাতে কাজে লাগে
you@laptop:~$ ssh-keygen -lf ~/.ssh/id_ed25519.pub
256 SHA256:geRiWgcPsCIrpuzrxyFdfXvd5nSzKQnFK7snwPwXBpY you@laptop (ED25519)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার Provider এর Dashboard। নাম আর ঘরের জায়গা প্রতিটা Provider এ আলাদা, কিন্তু
              প্রশ্নগুলো সবখানে একই। নিচের ক্রমে উত্তর দিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Plan বেছে নিন",
              description:
                "উপরের আলোচনা মতো। শুধু API হলে 1 vCPU আর 1 থেকে 2 GB RAM, পরে Database পাশে বসালে 2 vCPU আর 4 GB।",
            },
            {
              title: "Region বা Location",
              description:
                "পর্যটকের কাছের, যেমন Singapore। পরে বদলানো মানে নতুন Server বানিয়ে সব সরানো, তাই এখনই ঠিক করুন।",
            },
            {
              title: "Image: শুধু Ubuntu 24.04 LTS",
              description:
                "অনেক Provider Control Panel বা App সহ Template দেয়। এই কোর্সের জন্য সাদামাটা OS টাই নিন, যাতে প্রতিটা জিনিস নিজের হাতে বসান আর জানেন কী কোথায় আছে।",
            },
            {
              title: "Authentication: SSH Key",
              description:
                "id_ed25519.pub এর লাইনটা Paste করুন। Provider যদি root Password ও চায়, Password Manager দিয়ে একটা লম্বা এলোমেলো Password বানিয়ে দিন। কিছুক্ষণ পরে Password Login পুরো বন্ধ করব।",
            },
            {
              title: "Hostname",
              description:
                "একটা নাম যা দেখে বোঝা যায় এটা কোন Server। এই লেসনে mytours-vps-01। Prompt এ এই নামটাই দেখবেন, তাই ভুল Server এ কমান্ড চালানোর ভয় কমে।",
            },
            {
              title: "Backup বা Snapshot চালু",
              description:
                "Provider এর স্বয়ংক্রিয় Backup সাধারণত সামান্য বাড়তি খরচে পাওয়া যায়। চালু রাখুন। এটা আপনার নিজের Backup এর বদলি নয়, বরং তার পাশে আরেকটা জাল।",
            },
            {
              title: "Create, তারপর IP লিখে রাখুন",
              description:
                "এক দুই মিনিটে Server তৈরি হয়। Dashboard এ একটা Public IPv4 দেখাবে, এই লেসনে 198.51.100.42। এটাই Module 04 এর A Record এ বসবে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা নামকরা উদাহরণ: Hostinger, যেখানে Island Tours এর Server",
          content: (
            <div className="space-y-3">
              <p>
                Hostinger এর hPanel এ নতুন কেনা VPS এর পাশে একটা Setup বোতাম থাকে। সেখান থেকে
                Location বাছাই, তারপর Operating System এর ঘরে সাদামাটা Ubuntu 24.04, তারপর root
                Password আর ইচ্ছা হলে SSH Key। Server তৈরি হলে VPS এর Overview পাতায় SSH Access
                অংশে IP, Port 22 আর Username root লেখা থাকে, আর একটা Browser Terminal এর বোতাম,
                যেটাই এই Provider এর Web Console।
              </p>
              <p>
                এই বর্ণনা ২০২৬ সালের Hostinger এর সহায়তা পাতা দেখে লেখা। Menu এর নাম আর জায়গা
                বদলায়, তাই আপনার Dashboard যা দেখায় সেটাই মানবেন। একটা কথা মনে রাখবেন: সেখানে
                Operating System বদলানোর বোতাম চাপলে Server এর সব Data মুছে যায়।
              </p>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Server তৈরি। এখন পুরো সন্ধ্যার কাজের একটা মানচিত্র হাতে রাখুন। নিচের প্রতিটা ধাপে টিক
              দিলে ডান পাশে দেখবেন Server এর অবস্থা কীভাবে বদলায়, আর ক্রম ভাঙলে কী বিপদ হয়।
              বাকি লেসন এই তেরোটা ধাপই একটা একটা করে খুলবে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SetupChecklistLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "first-login",
      subHeader: { index: "004", title: "First Login" },
      title: <SectionTitle>প্রথম Login, আর প্রথম নজর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমবার root হয়েই ঢুকতে হয়, কারণ এখনো আর কোনো User নেই। Laptop থেকে{" "}
                <code>ssh root@198.51.100.42</code>। SSH আপনাকে একটা প্রশ্ন করবে, যেটা{" "}
                {lesson("ssh-security-keys", "লেসন ০৩")} এ চিনেছেন: এই Server টাকে আমি আগে কখনো
                দেখিনি, এর আঙুলের ছাপ এই, বিশ্বাস করবেন?
              </ContentParagraph>
              <ContentParagraph>
                অনুশীলনের Server এ নামটা Container এর, তাই নিচে IP এর জায়গায় mytours-vps-01
                দেখছেন। আপনার VPS এ প্রথম লাইনে 198.51.100.42 থাকবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "laptop: প্রথমবার ঢোকা",
          code: `you@laptop:~$ ssh root@mytours-vps-01
The authenticity of host 'mytours-vps-01 (172.21.0.2)' can't be established.
ED25519 key fingerprint is SHA256:+nTSn8qa1TnQz3YGsvUgHQFn/BHD8b/jnZ8NDVeFMKA.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'mytours-vps-01' (ED25519) to the list of known hosts.`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "yes লেখার আগে ছাপটা মিলিয়ে নিন",
          content: (
            <p>
              কাজটা দশ সেকেন্ডের। Provider এর Web Console খুলে Server এর ভেতরে{" "}
              <code>ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub</code> চালান। যে SHA256
              লাইনটা আসে, সেটা উপরের প্রশ্নের লাইনের সাথে হুবহু মিলতে হবে। মিললে নিশ্চিত হলেন
              আপনি নিজের Server এর সাথেই কথা বলছেন, মাঝে কেউ নেই। এটাই সেই Trust on First Use,
              যার পরে SSH ছাপটা মনে রাখে আর কখনো বদলালে চিৎকার করে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ঢুকেই কিছু বদলাবেন না। আগে চারপাশটা দেখুন, যেমন নতুন বাসায় ঢুকে আগে দেখেন কোথায়
              কী আছে। সাতটা কমান্ড, প্রতিটা একটা প্রশ্নের উত্তর দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: প্রথম নজর (অনুশীলনের Server এর আসল ফলাফল)",
          code: `# কোন OS, কোন সংস্করণ?
root@mytours-vps-01:~# grep -E '^(PRETTY_NAME|VERSION_CODENAME)' /etc/os-release
PRETTY_NAME="Ubuntu 24.04.5 LTS"
VERSION_CODENAME=noble

# নাম কী, কী ধরনের যন্ত্র, কোন Kernel?
root@mytours-vps-01:~# hostnamectl
 Static hostname: mytours-vps-01
       Icon name: computer-container
         Chassis: container
  Virtualization: docker
Operating System: Ubuntu 24.04.5 LTS
          Kernel: Linux 6.8.0-117-generic
    Architecture: arm64

# ঘড়ি কোন Time Zone এ, ঠিক সময় দেখাচ্ছে কি?
root@mytours-vps-01:~# timedatectl
               Local time: Sat 2026-10-31 07:33:55 UTC
           Universal time: Sat 2026-10-31 07:33:55 UTC
                 RTC time: n/a
                Time zone: Etc/UTC (UTC, +0000)
System clock synchronized: yes
              NTP service: n/a
          RTC in local TZ: no

# কয়টা CPU, কত RAM, Swap আছে কি?
root@mytours-vps-01:~# nproc
4
root@mytours-vps-01:~# free -h
               total        used        free      shared  buff/cache   available
Mem:           5.8Gi       1.7Gi       1.8Gi       641Mi       3.1Gi       4.0Gi
Swap:             0B          0B          0B

# Disk কত বড়, কতটা খালি?
root@mytours-vps-01:~# df -h /
Filesystem      Size  Used Avail Use% Mounted on
overlay          98G   15G   79G  16% /

# কোন IP পেয়েছে?
root@mytours-vps-01:~# ip -brief address
lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0@if155       UP             172.21.0.2/16`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা লাইন পড়তে শিখুন, কারণ প্রতিটা কিছু একটা বলে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>noble</strong> হলো Ubuntu 24.04 এর ডাকনাম। অনেক Install নির্দেশনায়
                  সংস্করণের বদলে এই নামটা লাগে, তাই এখানে দেখে রাখা কাজের।
                </ListItem>
                <ListItem>
                  <strong>Virtualization</strong> লাইনে আপনার VPS এ সাধারণত kvm দেখাবে, Chassis এ
                  vm। এখানে docker আর container, কারণ এটা অনুশীলনের Container।
                </ListItem>
                <ListItem>
                  <strong>Time zone: Etc/UTC</strong>। এটাই চাই, কারণটা একটু পরে। আসল VPS এ NTP
                  service এর পাশে active দেখবেন, অর্থাৎ ঘড়ি নিজে নিজে ঠিক সময়ের সাথে মেলে।
                </ListItem>
                <ListItem>
                  <strong>nproc আর free</strong> আপনার কেনা Plan এর সাথে মিলতে হবে। 2 vCPU কিনে
                  1 দেখালে Provider কে জানান। এখানে 4 আর 5.8Gi, কারণ Container টা Docker যন্ত্রের
                  পুরোটা দেখে। Swap এর ঘরে 0B, নতুন VPS এ প্রায়ই তাই থাকে।
                </ListItem>
                <ListItem>
                  <strong>df</strong> এ আসল VPS এ Filesystem এর নাম হবে /dev/vda1 বা /dev/sda1
                  ধরনের কিছু, Size আপনার Plan এর Disk এর কাছাকাছি।
                </ListItem>
                <ListItem>
                  <strong>ip</strong> এ আসল VPS এ eth0 বা ens3 এর পাশে আপনার Public IP,
                  198.51.100.42, আর প্রায়ই একটা IPv6 ও।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "updates",
      subHeader: { index: "005", title: "Updates" },
      title: <SectionTitle>প্রথম কাজ Update, আর তারপর থেকে নিজে নিজে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Provider এর Image টা বানানো হয়েছিল কয়েক সপ্তাহ বা কয়েক মাস আগে। তার পরে যত
                Security ছিদ্র ধরা পড়েছে আর সারানো হয়েছে, তার কোনোটাই আপনার Server এ নেই। তাই
                সবার আগে Update, তারপর বাকি সব। {lesson("linux-filesystem", "লেসন ০১")} এ apt
                চিনেছেন: <code>update</code> শুধু তালিকা নতুন করে, <code>full-upgrade</code>{" "}
                আসলে বসায়, দরকার হলে নতুন Dependency সহ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: সব Update",
          code: `root@mytours-vps-01:~# apt-get update
...
Get:19 http://ports.ubuntu.com/ubuntu-ports noble-security/main arm64 Packages [1476 kB]
Fetched 35.7 MB in 13s (2706 kB/s)
Reading package lists...

root@mytours-vps-01:~# apt-get full-upgrade -y
...
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.

# Kernel বা গুরুত্বপূর্ণ কিছু বদলালে Ubuntu এই File টা রেখে যায়
root@mytours-vps-01:~# ls /var/run/reboot-required
ls: cannot access '/var/run/reboot-required': No such file or directory`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনুশীলনের Image টা সেদিনই বানানো, তাই 0 upgraded। আপনার নতুন VPS এ সংখ্যাটা প্রায়ই
                কয়েক ডজন হবে। আর শেষে যদি <code>/var/run/reboot-required</code> File টা থাকে,
                তাহলে এখনই <code>reboot</code> দিন। এখনো Server এ কিছু চলছে না, Reboot এর জন্য এর
                চেয়ে ভালো সময় আর আসবে না।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু আজকের Update কাল পুরনো। প্রতিদিন নিজে মনে করে Update দেওয়া কেউ করে না, তাই
                Ubuntu এর একটা ছোট সহকারী আছে: <strong>unattended-upgrades</strong>। সে প্রতিদিন
                একবার তালিকা দেখে আর শুধু Security Update গুলো নিজে বসিয়ে দেয়। অনেক VPS Image এ
                আগে থেকেই থাকে, না থাকলে বসান, আর চালু আছে কি না নিশ্চিত হন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: Security Patch নিজে নিজে",
          code: `root@mytours-vps-01:~# apt-get install -y unattended-upgrades
# প্রশ্ন এলে Yes বেছে নিন
root@mytours-vps-01:~# dpkg-reconfigure -plow unattended-upgrades

# চালু হলে এই দুইটা লাইন থাকে: রোজ তালিকা, রোজ Upgrade
root@mytours-vps-01:~# cat /etc/apt/apt.conf.d/20auto-upgrades
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";

# কাজটা আসলে চালায় দুইটা systemd Timer (লেসন ১০)
root@mytours-vps-01:~# systemctl list-timers 'apt-daily*' --no-pager
NEXT                        LEFT LAST PASSED UNIT                    ACTIVATES
Sun 2026-11-01 04:36:07 UTC  21h -         - apt-daily.timer         apt-daily.service
Sun 2026-11-01 06:34:51 UTC  23h -         - apt-daily-upgrade.timer apt-daily-upgrade.service

# কোন জায়গা থেকে Update নেবে, আর এখন কী বসাত, না বসিয়েই দেখা
root@mytours-vps-01:~# unattended-upgrade --dry-run --debug 2>&1 | grep -E 'Allowed origins|No packages'
Allowed origins are: o=Ubuntu,a=noble, o=Ubuntu,a=noble-security, o=UbuntuESMApps,a=noble-apps-security, o=UbuntuESM,a=noble-infra-security
No packages found that can be upgraded unattended and no pending auto-removals`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিজে নিজে Reboot হয় না, সেটা আপনার কাজ",
          content: (
            <p>
              <code>/etc/apt/apt.conf.d/50unattended-upgrades</code> এ Automatic-Reboot এর লাইনটা
              Default এ মন্তব্য করে রাখা, মান false। মানে Kernel এর Patch নামবে, কিন্তু নতুন Kernel
              চালু হবে পরের Reboot এ। তাই সপ্তাহে একবার Login করে{" "}
              <code>ls /var/run/reboot-required</code> দেখুন, থাকলে ভিড় কম এমন সময়ে Reboot দিন।
              এই কাজটা লেসনের শেষে মাসিক তালিকায় তুলে রাখব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "deploy-user",
      subHeader: { index: "006", title: "The deploy User" },
      title: <SectionTitle>root এর বদলে একজন deploy</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                root সব পারে, আর এটাই তার বিপদ। root হয়ে একটা ভুল কমান্ড, একটা ভুল Path এ{" "}
                <code>rm -r</code>, কোনো প্রশ্ন ছাড়াই পুরো Server শেষ। আর বাইরে থেকে যে root হয়ে
                ঢুকতে পারে, সে সবকিছুর মালিক। {lesson("permissions-users-groups", "লেসন ০৪")} এর
                নিয়ম: প্রতিদিনের কাজ একজন সাধারণ User হয়ে, আর প্রশাসকের কাজ লাগলে প্রতিবার
                সচেতনভাবে <code>sudo</code>।
              </ContentParagraph>
              <ContentParagraph>
                তাই deploy নামে একজন User বানাব, তাকে sudo group এ দেব, আর root এর ঘরে যে SSH Key
                আছে সেটা তার ঘরেও কপি করব। <code>adduser</code> একটা Password চাইবে। এটা SSH এর
                জন্য নয়, SSH এ Password একটু পরেই বন্ধ হবে। এটা sudo চালানোর সময় লাগবে। Password
                Manager দিয়ে বানিয়ে সেখানেই রাখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: deploy বানানো",
          code: `root@mytours-vps-01:~# adduser deploy
# এখানে নতুন Password দুইবার চাইবে, বাকি প্রশ্নে Enter চাপলেই চলে
...
info: Creating home directory \`/home/deploy' ...
info: Copying files from \`/etc/skel' ...
info: Adding new user \`deploy' to supplemental / extra groups \`users' ...
info: Adding user \`deploy' to group \`users' ...

root@mytours-vps-01:~# usermod -aG sudo deploy
root@mytours-vps-01:~# usermod -aG adm deploy      # Log পড়তে sudo লাগবে না (লেসন ০৭)
root@mytours-vps-01:~# id deploy
uid=1001(deploy) gid=1001(deploy) groups=1001(deploy),4(adm),27(sudo),100(users)

# root এর .ssh Folder টা deploy এর ঘরে, মালিকানা বদলে, Permission ঠিক রেখে
root@mytours-vps-01:~# rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
root@mytours-vps-01:~# ls -la /home/deploy/.ssh
drwx------ 2 deploy deploy 4096 Oct 31 07:33 .
drwxr-x--- 3 deploy deploy 4096 Oct 31 07:34 ..
-rw------- 1 deploy deploy   92 Oct 31 07:33 authorized_keys

root@mytours-vps-01:~# sudo -l -U deploy | tail -2
User deploy may run the following commands on mytours-vps-01:
    (ALL : ALL) ALL`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                uid 1001 কেন, 1000 নয়? কারণ Ubuntu এর Image এ আগে থেকেই ubuntu নামে একজন User
                আছে, 1000 সে নিয়ে বসে আছে। অনেক VPS Image এ থাকে। দরকার না থাকলে পরে সরাতে পারেন,
                কিন্তু আজ রাতের কাজে সে ক্ষতি করে না, কারণ তার কোনো Key বা Password নেই।
              </ContentParagraph>
              <ContentParagraph>
                এবার সবচেয়ে জরুরি অভ্যাস। root এর Session টা <strong>বন্ধ করবেন না</strong>। Laptop
                এ আরেকটা Terminal খুলুন আর deploy হয়ে ঢুকে দেখুন। ঢোকা গেলে, আর sudo চললে, তবেই
                পরের ধাপে যাবেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TwoSessionsDiagram /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "laptop, দ্বিতীয় Terminal: deploy হয়ে ঢোকা",
          code: `you@laptop:~$ ssh deploy@mytours-vps-01 'whoami; hostname; groups'
deploy
mytours-vps-01
deploy sudo users

# ভেতরে ঢুকে একবার sudo চালিয়ে দেখুন, deploy এর Password চাইবে
deploy@mytours-vps-01:~$ sudo -v
[sudo] password for deploy:`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "lock-ssh",
      subHeader: { index: "007", title: "Lock SSH" },
      title: <SectionTitle>দরজায় তালা: root নয়, Password নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                deploy হয়ে Key দিয়ে ঢোকা যাচ্ছে। এখন তিনটা পুরনো দরজা বন্ধ করব: root এর সরাসরি
                Login, Password দিয়ে Login, আর Keyboard-interactive নামের Password এরই আরেকটা
                রাস্তা। এগুলো কেন বিপজ্জনক আর sshd কীভাবে কাজ করে, সেটা{" "}
                {lesson("ssh-security-keys", "লেসন ০৩")} এ বিস্তারিত। এখানে শুধু একটা ফাঁদ,
                যেটা অনেককে ধোঁকা দেয়, আর সেটা অনুশীলনের Server এ সত্যি ঘটিয়ে দেখাচ্ছি।
              </ContentParagraph>
              <ContentParagraph>
                Ubuntu তে মূল <code>/etc/ssh/sshd_config</code> এর লাইন 12 এ একটা Include আছে,
                যেটা <code>/etc/ssh/sshd_config.d/</code> এর সব .conf File আগে পড়ে নেয়। আর sshd
                এর নিয়ম অদ্ভুত: একটা Setting এর <strong>প্রথম</strong> মানটাই রাখে, পরেরগুলো
                ফেলে দেয়। অনেক VPS এ Cloud-init নামের প্রথম Boot এর সহকারী আগেই{" "}
                <code>50-cloud-init.conf</code> রেখে যায়, যেখানে লেখা{" "}
                <code>PasswordAuthentication yes</code>। এখন আপনার File এর নাম কী দিচ্ছেন, সেটাই
                ঠিক করবে কে জিতবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: নামের খেলাটা নিজের চোখে",
          code: `root@mytours-vps-01:~# grep -n Include /etc/ssh/sshd_config
12:Include /etc/ssh/sshd_config.d/*.conf

# একটা Cloud-init এর File আছে ধরে নিই (আপনার VPS এ সত্যিই থাকতে পারে)
root@mytours-vps-01:~# cat /etc/ssh/sshd_config.d/50-cloud-init.conf
PasswordAuthentication yes

# প্রথম চেষ্টা: নিজের File এর নাম 99 দিয়ে
root@mytours-vps-01:~# cat /etc/ssh/sshd_config.d/99-hardening.conf
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no

# sshd আসলে কোন মান মানবে, সেটা বলে sshd -T
root@mytours-vps-01:~# sshd -T | grep -E '^(passwordauthentication|permitrootlogin|kbdinteractiveauthentication) '
permitrootlogin no
passwordauthentication yes
kbdinteractiveauthentication no

# নাম বদলে 00, যাতে সবার আগে পড়া হয়
root@mytours-vps-01:~# mv /etc/ssh/sshd_config.d/99-hardening.conf /etc/ssh/sshd_config.d/00-hardening.conf
root@mytours-vps-01:~# sshd -T | grep -E '^(passwordauthentication|permitrootlogin|kbdinteractiveauthentication) '
permitrootlogin no
passwordauthentication no
kbdinteractiveauthentication no`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DropInOrderSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দেখলেন? 99 নামের File এ PasswordAuthentication no লেখা থাকা সত্ত্বেও sshd বলছে
                yes। কোনো Error নেই, কোনো সতর্কবার্তা নেই। আপনি ভাবতেন দরজা বন্ধ, অথচ Bot রা
                Password আন্দাজ করেই যেত। তাই নিয়মটা মনে রাখুন: নিজের File এর নাম 00 দিয়ে শুরু
                করুন, আর File দেখে নয়, <code>sshd -T</code> দেখে বিশ্বাস করুন।
              </ContentParagraph>
              <ContentParagraph>
                এবার পরীক্ষা আর চালু। <code>sshd -t</code> (ছোট t) Setting এ বানান ভুল খোঁজে।
                ভুল থাকলে কিছুই বলে না এমন নয়, Error দেখায়, আর তখন Reload করবেন না। ঠিক থাকলে
                Reload। Ubuntu 24.04 এ ssh.socket নামের একটা Unit Port 22 এ শোনে আর দরকার হলে
                ssh.service কে জাগায়। Login এর নিয়ম বদলাতে Reload ই যথেষ্ট। Port নম্বর বদলাতে হলে
                আরেকটু কাজ লাগে, সেটা লেসন ০৩ এ আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: যাচাই আর Reload, তারপর laptop থেকে পরীক্ষা",
          code: `root@mytours-vps-01:~# sshd -t && echo "sshd -t: OK"
sshd -t: OK
root@mytours-vps-01:~# systemctl reload ssh
root@mytours-vps-01:~# systemctl is-active ssh ssh.socket
active
active

# এখন নতুন Terminal এ, Laptop থেকে। root এর জন্য দরজা বন্ধ
you@laptop:~$ ssh root@mytours-vps-01
root@mytours-vps-01: Permission denied (publickey).

# Key বাদ দিয়ে শুধু Password দিয়ে চেষ্টা। Server Password চায়ই না
you@laptop:~$ ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password deploy@mytours-vps-01
deploy@mytours-vps-01: Permission denied (publickey).

# আর Key দিয়ে deploy, যেটা চাই
you@laptop:~$ ssh deploy@mytours-vps-01 'echo still works as $(whoami)'
still works as deploy

# Server এর Log এ পুরো ঘটনা (লেসন ০৭)
deploy@mytours-vps-01:~$ sudo journalctl -u ssh -n 3 -o short-iso
2026-10-31T07:34:52+00:00 mytours-vps-01 sshd[1324]: Connection closed by authenticating user deploy 172.21.0.3 port 54900 [preauth]
2026-10-31T07:34:52+00:00 mytours-vps-01 sshd[1326]: Accepted publickey for deploy from 172.21.0.3 port 54916 ssh2: ED25519 SHA256:geRiWg...
2026-10-31T07:34:52+00:00 mytours-vps-01 sshd[1326]: pam_unix(sshd:session): session opened for user deploy(uid=1001) by deploy(uid=0)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Log এর দ্বিতীয় লাইনে Accepted publickey এর শেষে যে SHA256 এর শুরুটা, সেটা আপনার
                Laptop এর Key এর ছাপের শুরুর সাথে মিলিয়ে দেখুন, geRiWg। কে ঢুকল, কোন Key দিয়ে, সব
                লেখা থাকে। এখন root এর Session বন্ধ করতে পারেন। এখন থেকে সব কাজ deploy হয়ে, আর
                প্রশাসকের কাজে sudo।
              </ContentParagraph>
              <ContentParagraph>
                নিচে পাঁচটা আসল ভুল, যেগুলো দিয়ে মানুষ প্রথম রাতে নিজেকে বাইরে আটকে ফেলেন। প্রতিটা
                অনুশীলনের Server এ ঘটিয়ে Error তোলা। প্রথম Session খোলা রাখার অভ্যাস কতটা বাঁচায়,
                সুইচটা বদলে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LockoutLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "firewall",
      subHeader: { index: "008", title: "Firewall" },
      title: <SectionTitle>তিনটা দরজা খোলা, বাকি সব দেয়াল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                {lesson("firewall-ufw", "লেসন ০৬")} এর নিয়ম মেনে। ufw এর Default হলো ভেতরে
                আসা সব বন্ধ, বাইরে যাওয়া সব খোলা। আমরা শুধু তিনটা জিনিস খুলব: SSH, HTTP আর HTTPS।
                443 এর UDP টাও খুলছি, কারণ Caddy HTTP/3 ও বলে, আর HTTP/3 চলে QUIC এ, UDP এর উপর
                (Module 06)।
              </ContentParagraph>
              <ContentParagraph>
                ক্রমটা আবারও জরুরি। <strong>আগে OpenSSH এর অনুমতি, তারপর enable।</strong>{" "}
                উল্টো করলে উপরের Lab এর প্রথম ভুলটাই ঘটবে। SSH Session এর ভেতর থেকে enable দিলে
                ufw নিজেও সাবধান করে: Command may disrupt existing ssh connections. Proceed with
                operation (y|n)? তখন y দেওয়ার আগে একবার ভাবুন, OpenSSH এর অনুমতি দিয়েছেন কি না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: ufw",
          code: `deploy@mytours-vps-01:~$ sudo ufw status
Status: inactive
deploy@mytours-vps-01:~$ sudo ufw app list
Available applications:
  OpenSSH

deploy@mytours-vps-01:~$ sudo ufw allow OpenSSH
Rules updated
Rules updated (v6)
deploy@mytours-vps-01:~$ sudo ufw allow 80/tcp
deploy@mytours-vps-01:~$ sudo ufw allow 443/tcp
deploy@mytours-vps-01:~$ sudo ufw allow 443/udp
deploy@mytours-vps-01:~$ sudo ufw enable
Firewall is active and enabled on system startup

deploy@mytours-vps-01:~$ sudo ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), deny (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
443/udp                    ALLOW IN    Anywhere
22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)
80/tcp (v6)                ALLOW IN    Anywhere (v6)
443/tcp (v6)               ALLOW IN    Anywhere (v6)
443/udp (v6)               ALLOW IN    Anywhere (v6)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Provider এর Dashboard এ ফিরে যান, আর Cloud Firewall এ একই তিনটা নিয়ম বসান।
                দুইটা দেয়াল কেন? ufw থাকে Server এর ভেতরে। কোনো Update বা ভুল কমান্ডে ufw বন্ধ হয়ে
                গেলে Cloud Firewall তখনো দাঁড়িয়ে। আর Cloud Firewall এর Packet কখনো আপনার Server এ
                পৌঁছায়ই না, তাই Server এর কাজও কমে। একটা ছোট সতর্কতা: Cloud Firewall এ 22 বন্ধ
                করে ফেললে ufw ঠিক থাকলেও ঢুকতে পারবেন না, তাই সেখানেও আগে 22।
              </ContentParagraph>
              <ContentParagraph>
                পরে যখন Docker আসবে, একটা ফাঁদ মনে রাখবেন যেটা লেসন ০৬ এ দেখেছেন: Docker এর Publish
                করা Port ufw এর নিয়ম পাশ কাটিয়ে খুলে যায়। তাই Container এর Port সবসময়{" "}
                <code>127.0.0.1:5432:5432</code> এর মতো করে শুধু ভেতরে বাঁধবেন। Cloud Firewall এই
                ফাঁদ থেকেও বাঁচায়, এটা দ্বিতীয় দেয়ালের আরেকটা কারণ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "small-settings",
      subHeader: { index: "009", title: "Small Settings" },
      title: <SectionTitle>ছোট তিনটা Setting, যা পরে বড় ঝামেলা বাঁচায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>ঘড়ি থাকবে UTC তে।</strong> আপনার দল ঢাকায়, UTC থেকে ছয় ঘণ্টা এগিয়ে। তবুও
                Server এর ঘড়ি UTC তে রাখুন। কারণ Log, Database এর সময়, Certificate এর মেয়াদ, অন্য
                Server এর Log, সবকিছু তখন এক ঘড়িতে মেলে। ঢাকার সময় দেখানো App এর কাজ, Server এর
                নয়। শীতে বা গ্রীষ্মে ঘড়ি পেছানোর ঝামেলাও UTC তে নেই। উপরে দেখেছেন Time zone আগেই
                Etc/UTC। না থাকলে <code>sudo timedatectl set-timezone Etc/UTC</code>। আর NTP service
                active থাকা চাই, যাতে ঘড়ি নিজে নিজে ঠিক থাকে। ঘড়ি ভুল হলে HTTPS ও ভাঙে, কারণ
                Certificate এর মেয়াদ মেলে না (Module 06)।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Hostname।</strong> Provider সাধারণত বানানোর সময় নামটা দেয়। না দিলে বা
                বদলাতে চাইলে <code>sudo hostnamectl set-hostname mytours-vps-01</code>, আর{" "}
                <code>/etc/hosts</code> এ <code>127.0.1.1 mytours-vps-01</code> লাইনটা মিলিয়ে দিন,
                নইলে sudo প্রতিবার একটা সতর্কবার্তা দেয় যে নামটা খুঁজে পাচ্ছে না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Swap, ছোট Server এ।</strong> 1 বা 2 GB RAM এর Server এ npm install এর মতো
                কোনো ভারী কাজে Memory হঠাৎ ফুরিয়ে গেলে Kernel একটা Process মেরে ফেলে, সেই OOM
                Killer যাকে {lesson("system-logs", "লেসন ০৭")} এর Log এ খুঁজেছেন। Disk এর উপর একটা
                Swap File সেই ধাক্কা সামলায়। ধীর, কিন্তু মরার চেয়ে ভালো।{" "}
                {lesson("monitoring-tools", "লেসন ০৮")} এ <code>free -h</code> এ Swap এর লাইন পড়তে
                শিখেছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: 1 GB এর একটা Swap File",
          code: `deploy@mytours-vps-01:~$ sudo fallocate -l 1G /swapfile
deploy@mytours-vps-01:~$ sudo chmod 600 /swapfile      # শুধু root পড়বে, এতে Memory র টুকরো থাকে
deploy@mytours-vps-01:~$ ls -lh /swapfile
-rw------- 1 root root 1.0G Oct 31 07:35 /swapfile
deploy@mytours-vps-01:~$ sudo mkswap /swapfile
Setting up swapspace version 1, size = 1024 MiB (1073737728 bytes)
no label, UUID=34be6609-3196-4720-b1cd-2897a31afe89

# এই দুইটা লাইন আসল VPS এ চালান: চালু করা, আর Reboot এর পরেও যাতে থাকে
deploy@mytours-vps-01:~$ sudo swapon /swapfile
deploy@mytours-vps-01:~$ echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
deploy@mytours-vps-01:~$ free -h        # Swap এর লাইনে এখন 1.0Gi`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "swapon কেন এখানে চালানো হয়নি",
          content: (
            <p>
              অনুশীলনের Server টা একটা Container, আর Container এর ভেতরে swapon চালালে Swap টা
              বসত পুরো Docker যন্ত্রের Kernel এ, শুধু এই Server এ নয়। তাই এখানে File বানানো আর
              mkswap পর্যন্ত চালিয়েছি, শেষের তিনটা লাইন আপনার আসল VPS বা Multipass এর জন্য। এই
              ধরনের সীমা জানা থাকলে অনুশীলনের ফলাফল আর আসল Server এর ফলাফল গুলিয়ে ফেলবেন না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "app-home",
      subHeader: { index: "010", title: "Node and the App's Home" },
      title: <SectionTitle>Node বসানো, আর App এর জন্য আলাদা ঘর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Node কোথা থেকে?</strong> Ubuntu এর নিজের ভাণ্ডারে nodejs আছে, কিন্তু
                সেটা Ubuntu প্রকাশের সময়ের পুরনো সংস্করণ, 24.04 এ 18, যার আয়ু অনেক আগেই শেষ।
                ল্যাপটপে অনেকে nvm ব্যবহার করেন, কিন্তু nvm বসায় একজন User এর Home এ, আর systemd
                এর অন্য User হয়ে চলা Service সেটা খুঁজে পায় না। Server এর জন্য পরিষ্কার পথ হলো
                NodeSource এর apt ভাণ্ডার। Node তখন বাকি সব Package এর মতোই apt দিয়ে Update হয়,
                আর বসে <code>/usr/bin/node</code> এ, যেখানে সব User পায়।
              </ContentParagraph>
              <ContentParagraph>
                কোন সংস্করণ? সবসময় একটা LTS, মানে দীর্ঘ মেয়াদে Security Patch পাবে এমন। ২০২৬ এর
                শেষে 24 আর 26 দুইটাই LTS। nodejs.org এর Releases পাতায় দেখে নিয়ে নিচের NODE_MAJOR
                এর সংখ্যাটা বসাবেন। অনুশীলনের Server এ 24 বসিয়েছি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: NodeSource থেকে Node LTS",
          code: `deploy@mytours-vps-01:~$ NODE_MAJOR=24
deploy@mytours-vps-01:~$ sudo apt-get install -y ca-certificates curl gnupg
deploy@mytours-vps-01:~$ sudo mkdir -p /etc/apt/keyrings
# ভাণ্ডারের সই যাচাইয়ের চাবি (Module 06 এর সই এর ধারণা, এখানে Package এর জন্য)
deploy@mytours-vps-01:~$ curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \\
    | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
deploy@mytours-vps-01:~$ printf 'Types: deb\\nURIs: https://deb.nodesource.com/node_%s.x/\\nSuites: nodistro\\nComponents: main\\nSigned-By: /etc/apt/keyrings/nodesource.gpg\\n' "$NODE_MAJOR" \\
    | sudo tee /etc/apt/sources.list.d/nodesource.sources >/dev/null

deploy@mytours-vps-01:~$ sudo apt-get update
Get:1 https://deb.nodesource.com/node_24.x nodistro InRelease [12.1 kB]
Get:2 https://deb.nodesource.com/node_24.x nodistro/main arm64 Packages [9976 B]
...
deploy@mytours-vps-01:~$ sudo apt-get install -y nodejs
...
Setting up nodejs (24.22.2-1nodesource1) ...

deploy@mytours-vps-01:~$ node --version; npm --version; which node
v24.22.2
11.19.1
/usr/bin/node`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>App এর নিজের User।</strong> App কে deploy হয়ে চালাবেন না, root হয়ে তো
                নয়ই। {lesson("permissions-users-groups", "লেসন ০৪")} এর System User: mytours, যার
                কোনো Home নেই, কোনো Login Shell নেই। কেউ App এ কোনো ছিদ্র পেয়ে ভেতরে ঢুকলেও সে
                হবে mytours, যে প্রায় কিছুই ছুঁতে পারে না। Code থাকবে <code>/srv/my-tours</code>{" "}
                এ, যার মালিক deploy, কারণ deploy ই নতুন সংস্করণ পাঠাবে। App এর Setting আর Secret
                থাকবে <code>/etc/my-tours/api.env</code> এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: mytours User, Folder আর api.env",
          code: `deploy@mytours-vps-01:~$ sudo useradd --system --no-create-home --shell /usr/sbin/nologin mytours
deploy@mytours-vps-01:~$ id mytours
uid=999(mytours) gid=996(mytours) groups=996(mytours)
deploy@mytours-vps-01:~$ getent passwd mytours
mytours:x:999:996::/home/mytours:/usr/sbin/nologin

deploy@mytours-vps-01:~$ sudo mkdir -p /srv/my-tours /etc/my-tours
deploy@mytours-vps-01:~$ sudo chown deploy:deploy /srv/my-tours

# খালি File টা আগে ঠিক Permission দিয়ে বানান, তারপর ভেতরে লিখুন। উল্টো করলে
# কয়েক মুহূর্তের জন্য Secret টা সবার পড়ার মতো অবস্থায় থাকে
deploy@mytours-vps-01:~$ sudo install -m 640 -o root -g mytours /dev/null /etc/my-tours/api.env
deploy@mytours-vps-01:~$ printf 'NODE_ENV=production\\nPORT=3000\\n' | sudo tee -a /etc/my-tours/api.env >/dev/null

deploy@mytours-vps-01:~$ ls -ld /srv/my-tours /etc/my-tours
drwxr-xr-x 2 deploy deploy 4096 Oct 31 07:36 /srv/my-tours
drwxr-xr-x 2 root   root   4096 Oct 31 07:36 /etc/my-tours
deploy@mytours-vps-01:~$ ls -l /etc/my-tours/api.env
-rw-r----- 1 root mytours 30 Oct 31 07:36 /etc/my-tours/api.env`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Path", "মালিক:Group, Mode", "কেন এমন"],
          rows: [
            [<code key="p">/srv/my-tours</code>, "deploy:deploy, 755", "deploy নতুন Code পাঠায়। mytours শুধু পড়ে আর চালায়, লিখতে পারে না, তাই কেউ App এ ঢুকে Code বদলাতে পারে না"],
            [<code key="p">/etc/my-tours/api.env</code>, "root:mytours, 640", "root লেখে, mytours শুধু পড়ে, আর কেউ কিছুই না। deploy পড়তে চাইলে sudo লাগে"],
            [<code key="p">/home/deploy/.ssh</code>, "deploy:deploy, 700", "এর চেয়ে খোলা হলে sshd Key টাই মানবে না, উপরের Lab এর চতুর্থ ভুল"],
            [<code key="p">/swapfile</code>, "root:root, 600", "Memory থেকে নামানো টুকরো, যেকোনো Secret থাকতে পারে"],
            [<code key="p">/var/backups/my-tours</code>, "root:root, 700", "Backup এ api.env ও আছে, তাই Secret এর মতোই আগলে রাখা"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Secret টা কমান্ডে টাইপ করবেন না, বানিয়ে নিন",
          content: (
            <p>
              SESSION_SECRET এর মান নিজে ভেবে লিখবেন না, আর কমান্ডের ভেতরে টাইপও করবেন না, তাহলে
              সেটা Shell এর History তে থেকে যায় ({lesson("environment-variables", "লেসন ০৫")})। একটু
              পরে দেখবেন একটা কমান্ড কীভাবে Secret টা নিজে বানিয়ে সরাসরি File এ লিখে দেয়, আপনার
              চোখের সামনে না এনেই। ইচ্ছা করে এখন সেটা বাদ রাখছি, কারণ পরের ধাপে দেখাব Secret না
              থাকলে App টা কী করে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "ship-run",
      subHeader: { index: "011", title: "Ship and Run" },
      title: <SectionTitle>Code পাঠানো, আর systemd এর হাতে তুলে দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                my-tours এর API টা এখন খুব ছোট: একটা <code>server.js</code>, যেটা চালু হওয়ার আগে
                তিনটা Environment Variable খোঁজে, না পেলে চালুই হয় না, আর <code>/health</code> এ
                একটা ছোট JSON দেয়। শোনে শুধু <code>127.0.0.1</code> এ, কারণ বাইরের Request আসবে
                Caddy হয়ে ({lesson("network-debugging", "লেসন ০৯")} এ bind address এর তফাত
                দেখেছেন)। পুরো File টা নিচের Lab এ আছে।
              </ContentParagraph>
              <ContentParagraph>
                Laptop থেকে Server এ Code পাঠানোর দুইটা চলতি পথ। এক, Server এ{" "}
                <code>git clone</code>, যার জন্য GitHub এ একটা Deploy Key লাগে, শুধু পড়ার অনুমতি
                সহ (লেসন ০৩)। দুই, Laptop থেকে <code>rsync</code>, যেটা শুধু বদলানো File গুলো পাঠায়।
                এখানে rsync দেখাচ্ছি, কারণ এতে GitHub এর কোনো Setting লাগে না। আগে Laptop এর{" "}
                <code>~/.ssh/config</code> এ Server টার একটা ডাকনাম দিন, যাতে প্রতিবার পুরো ঠিকানা
                লিখতে না হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "laptop: ডাকনাম, তারপর Code পাঠানো",
          code: `you@laptop:~$ cat ~/.ssh/config
Host mytours
    HostName 198.51.100.42
    User deploy
    IdentityFile ~/.ssh/id_ed25519

# node_modules আর .env কখনো পাঠাবেন না। প্রথমটা Server নিজে বানাবে, দ্বিতীয়টা Server এ আলাদা
you@laptop:~/my-tours-api$ rsync -av --delete --exclude node_modules --exclude .env ./ mytours:/srv/my-tours/
sending incremental file list
./
package-lock.json
package.json
server.js

sent 1,840 bytes  received 83 bytes  1,282.00 bytes/sec
total size is 1,558  speedup is 0.81

# Server এ Dependency বসানো, Lock File হুবহু মেনে, শুধু Production এর জন্য যা লাগে
you@laptop:~$ ssh mytours 'cd /srv/my-tours && npm ci --omit=dev'

up to date, audited 1 package in 109ms

found 0 vulnerabilities`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার systemd এর Unit File, {lesson("process-management-systemd", "লেসন ০২")} এ যেভাবে
                লিখেছেন। প্রতিটা লাইন একটা সিদ্ধান্ত: কোন User হয়ে চলবে, কোন Folder থেকে, কোন File
                থেকে Setting পড়বে, ভাঙলে কতক্ষণ পরে আবার চালু হবে, থামতে বললে কতক্ষণ সময় পাবে, আর
                Boot এর কোন পর্যায়ে উঠবে। শেষের চারটা লাইন App এর হাত আরও বাঁধে: নতুন ক্ষমতা নিতে
                পারবে না, পুরো Filesystem শুধু পড়ার জন্য, Home Folder গুলো দেখতেই পাবে না, আর নিজের
                আলাদা /tmp।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "ini",
          filename: "/etc/systemd/system/my-tours-api.service",
          code: `[Unit]
Description=my-tours API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=mytours
Group=mytours
WorkingDirectory=/srv/my-tours
EnvironmentFile=/etc/my-tours/api.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5
TimeoutStopSec=20
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <code>enable --now</code> একসাথে দুইটা কাজ করে: Boot এর জন্য তালিকায় তোলে আর এখনই
              চালু করে। মনে আছে, api.env এ এখনো SESSION_SECRET নেই। দেখা যাক App কী করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: প্রথম চালু, আর একটা ইচ্ছাকৃত ব্যর্থতা",
          code: `deploy@mytours-vps-01:~$ sudo systemctl daemon-reload
deploy@mytours-vps-01:~$ sudo systemctl enable --now my-tours-api
Created symlink /etc/systemd/system/multi-user.target.wants/my-tours-api.service → /etc/systemd/system/my-tours-api.service.

deploy@mytours-vps-01:~$ systemctl status my-tours-api --no-pager
● my-tours-api.service - my-tours API
     Loaded: loaded (/etc/systemd/system/my-tours-api.service; enabled; preset: enabled)
     Active: activating (auto-restart) (Result: exit-code) since Sat 2026-10-31 07:36:50 UTC; 1s ago
    Process: 3031 ExecStart=/usr/bin/node server.js (code=exited, status=1/FAILURE)
   Main PID: 3031 (code=exited, status=1/FAILURE)
        CPU: 32ms

deploy@mytours-vps-01:~$ journalctl -u my-tours-api -n 8 -o short-iso --no-pager
2026-10-31T07:36:49+00:00 mytours-vps-01 node[3031]: missing environment variables: SESSION_SECRET
2026-10-31T07:36:50+00:00 mytours-vps-01 systemd[1]: my-tours-api.service: Main process exited, code=exited, status=1/FAILURE
2026-10-31T07:36:50+00:00 mytours-vps-01 systemd[1]: my-tours-api.service: Failed with result 'exit-code'.
2026-10-31T07:36:55+00:00 mytours-vps-01 systemd[1]: my-tours-api.service: Scheduled restart job, restart counter is at 1.
2026-10-31T07:36:55+00:00 mytours-vps-01 systemd[1]: Started my-tours-api.service - my-tours API.
2026-10-31T07:36:55+00:00 mytours-vps-01 node[3052]: missing environment variables: SESSION_SECRET
2026-10-31T07:36:55+00:00 mytours-vps-01 systemd[1]: my-tours-api.service: Main process exited, code=exited, status=1/FAILURE
2026-10-31T07:36:55+00:00 mytours-vps-01 systemd[1]: my-tours-api.service: Failed with result 'exit-code'.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এটাই চেয়েছিলাম। App চুপচাপ ভুল Setting নিয়ে চালু হয়ে পরে রহস্যময় আচরণ করেনি। সে
                প্রথম লাইনেই বলে দিয়েছে কোন জিনিসটা নেই, আর বেরিয়ে গেছে। systemd পাঁচ সেকেন্ড পরপর
                আবার চেষ্টা করছে, প্রতিবার একই বার্তা। {lesson("environment-variables", "লেসন ০৫")}{" "}
                এর fail fast আর {lesson("system-logs", "লেসন ০৭")} এর প্রথম Error খোঁজার অভ্যাস,
                একসাথে কাজ করছে। এবার Secret টা বসাই, এমনভাবে যে সেটা কখনো স্ক্রিনে বা History তে
                আসে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: Secret বানিয়ে সরাসরি File এ, তারপর আবার চালু",
          code: `# openssl এলোমেলো 32 Byte বানায়, tee সেটা File এর শেষে যোগ করে। মানটা কোথাও দেখা যায় না
deploy@mytours-vps-01:~$ echo "SESSION_SECRET=$(openssl rand -base64 32)" | sudo tee -a /etc/my-tours/api.env >/dev/null

# মান লুকিয়ে শুধু নামগুলো দেখা
deploy@mytours-vps-01:~$ sudo sed 's/=.*/=.../' /etc/my-tours/api.env
NODE_ENV=...
PORT=...
SESSION_SECRET=...

deploy@mytours-vps-01:~$ sudo systemctl restart my-tours-api
deploy@mytours-vps-01:~$ systemctl status my-tours-api --no-pager
● my-tours-api.service - my-tours API
     Loaded: loaded (/etc/systemd/system/my-tours-api.service; enabled; preset: enabled)
     Active: active (running) since Sat 2026-10-31 07:37:03 UTC; 2s ago
   Main PID: 3085 (MainThread)
      Tasks: 7 (limit: 7039)
     Memory: 15.9M (peak: 17.3M)
        CPU: 47ms
     CGroup: /system.slice/my-tours-api.service
             └─3085 /usr/bin/node server.js

Oct 31 07:37:03 mytours-vps-01 systemd[1]: Started my-tours-api.service - my-tours API.
Oct 31 07:37:03 mytours-vps-01 node[3085]: my-tours-api listening on 127.0.0.1:3000

# Server এর ভেতর থেকে App কে সরাসরি ডাকা
deploy@mytours-vps-01:~$ curl -s 127.0.0.1:3000/health
{"status":"ok","uptimeSeconds":2}

# কে কোথায় শুনছে (লেসন ০৯)
deploy@mytours-vps-01:~$ sudo ss -tlnp | grep -E 'State|:3000|:22 '
State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=138,fd=3),("systemd",pid=1,fd=61))
LISTEN 0      511        127.0.0.1:3000       0.0.0.0:*    users:(("MainThread",pid=3085,fd=21))

# App কোন User হয়ে চলছে
deploy@mytours-vps-01:~$ ps -o user,pid,comm,args -u mytours
USER         PID COMMAND         COMMAND
mytours     3085 MainThread      /usr/bin/node server.js`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ps -C node কেন কিছুই খুঁজে পায় না",
          content: (
            <p>
              উপরের ফলাফলে খেয়াল করুন, Process এর নাম node নয়, MainThread। Node এর নতুন সংস্করণ
              Linux এ নিজের মূল Thread এর নাম এভাবে বদলে দেয়, আর ps, top বা ss এর COMMAND এর ঘরে
              সেই নামটাই আসে। তাই <code>ps -C node</code> চালালে অনুশীলনের Server এ একটাও লাইন আসেনি।
              Node এর Process খুঁজতে নাম দিয়ে না খুঁজে User বা পুরো কমান্ড দিয়ে খুঁজুন:{" "}
              <code>pgrep -a -u mytours</code> বা <code>pgrep -af server.js</code>।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পরে নতুন সংস্করণ পাঠানো মানে একই তিনটা কাজ আবার: Laptop থেকে rsync, Server এ{" "}
                <code>npm ci --omit=dev</code>, তারপর <code>sudo systemctl restart my-tours-api</code>{" "}
                আর status এ চোখ। Restart এর মুহূর্তে কয়েকটা Request হারাতে পারে। সেটা কীভাবে শূন্যে
                নামাতে হয়, Graceful Shutdown আর একাধিক Instance দিয়ে, সেটা পরের মডিউলগুলোর কাজ,
                Module 05 এর শেষ লেসনে যার শুরু দেখেছেন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "https",
      subHeader: { index: "012", title: "HTTPS" },
      title: <SectionTitle>Caddy, একটা DNS Record, আর তালার চিহ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                App চলছে, কিন্তু শুধু Server এর ভেতর থেকে পাওয়া যায়। এবার সামনের দরজা: Caddy।
                Module 06 এ দেখেছেন Caddy কী করে, TLS খোলে, Certificate আনে আর নবীকরণ করে, তারপর
                Request টা ভেতরের App কে দেয়। এখানে শুধু বসানো। কাজের ক্রম তিনটা, আর ক্রমটা আবারও
                গুরুত্বপূর্ণ।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রথমে DNS।</strong> আপনার DNS এর জায়গায় (Module 04) একটা A Record:
                  নাম <code>api</code>, মান <code>198.51.100.42</code>। তারপর Laptop থেকে{" "}
                  <code>dig +short api.my-tours.example</code> এ এই IP টা আসা পর্যন্ত অপেক্ষা।
                  কেন আগে? কারণ Caddy চালু হয়েই Let&apos;s Encrypt এর কাছে Certificate চাইবে, আর
                  Let&apos;s Encrypt নামটা দিয়ে আপনার Server খুঁজে Port 80 এ যাচাই করবে (Module 06 এর
                  HTTP-01)। নাম ভুল জায়গায় গেলে Certificate আসবে না।
                </ListItem>
                <ListItem>
                  <strong>তারপর Caddy বসানো</strong>, Caddy এর নিজের apt ভাণ্ডার থেকে, Node এর মতোই,
                  যাতে Update apt এর সাথে আসে।
                </ListItem>
                <ListItem>
                  <strong>শেষে Caddyfile</strong>, তিন লাইনের।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: Caddy এর অফিসিয়াল ভাণ্ডার থেকে",
          code: `deploy@mytours-vps-01:~$ sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
deploy@mytours-vps-01:~$ curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \\
    | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
deploy@mytours-vps-01:~$ curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \\
    | sudo tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
deploy@mytours-vps-01:~$ sudo chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg /etc/apt/sources.list.d/caddy-stable.list
deploy@mytours-vps-01:~$ sudo apt-get update
deploy@mytours-vps-01:~$ sudo apt-get install -y caddy
...
Setting up caddy (2.11.7) ...

deploy@mytours-vps-01:~$ caddy version
v2.11.7 h1:yj0Y4fYZGPkSvibBJ1sTWE33xC0fxztVyXEW5iIdUT4=
deploy@mytours-vps-01:~$ systemctl is-enabled caddy
enabled`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আসল VPS এ Caddy বসার সাথে সাথেই চালু হয়ে যায়। অনুশীলনের Container এ হয়নি, কারণ
                Docker এর Ubuntu Image এ <code>/usr/sbin/policy-rc.d</code> নামের একটা ছোট File আছে,
                যেটা Package বসানোর সময় Service চালু করতে দেয় না। তাই সেখানে{" "}
                <code>sudo systemctl start caddy</code> হাতে দিতে হয়েছে। আবারও, অনুশীলন আর আসল
                Server এর একটা পার্থক্য, যেটা জানা থাকলে বিভ্রান্ত হবেন না।
              </ContentParagraph>
              <ContentParagraph>
                এবার Caddyfile। আসল VPS এর জন্য পুরোটা এই, Certificate নিয়ে একটা লাইনও লিখতে হয়
                না:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "/etc/caddy/Caddyfile (আসল VPS এ)",
          code: `api.my-tours.example {
	encode zstd gzip
	reverse_proxy 127.0.0.1:3000
}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              অনুশীলনের Server এর কোনো Public নাম নেই, তাই Let&apos;s Encrypt তাকে খুঁজে পাবে না। সেখানে
              একটা লাইন বেশি, <code>tls internal</code>, যাতে Caddy নিজের ভেতরের ছোট একটা CA থেকে
              Certificate দেয়। বাকি সব হুবহু এক। তারপর যাচাই, চালু, আর Laptop থেকে পরীক্ষা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server আর laptop: যাচাই, চালু, তারপর বাইরে থেকে HTTPS",
          code: `# অনুশীলনের Caddyfile, শুধু tls internal লাইনটা বেশি
deploy@mytours-vps-01:~$ cat /etc/caddy/Caddyfile
api.my-tours.example {
	tls internal
	encode zstd gzip
	reverse_proxy 127.0.0.1:3000
}
deploy@mytours-vps-01:~$ caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile 2>&1 | tail -1
Valid configuration
deploy@mytours-vps-01:~$ sudo systemctl reload caddy      # অনুশীলনে প্রথমবার: start

# কে কোথায় শুনছে: 80, 443 tcp, আর HTTP/3 এর জন্য 443 udp
deploy@mytours-vps-01:~$ sudo ss -tlnup | grep -E ':(80|443) '
udp   UNCONN 0      0                  *:443              *:*    users:(("caddy",pid=3612,fd=7))
tcp   LISTEN 0      4096               *:443              *:*    users:(("caddy",pid=3612,fd=6))
tcp   LISTEN 0      4096               *:80               *:*    users:(("caddy",pid=3612,fd=8))

# Laptop থেকে। http দিয়ে এলে Caddy নিজেই https এ পাঠায়
you@laptop:~$ curl -sI http://api.my-tours.example/health | head -4
HTTP/1.1 308 Permanent Redirect
Connection: close
Location: https://api.my-tours.example/health
Server: Caddy

# https দিয়ে, পুরো পথ: Laptop, ufw, Caddy, App
you@laptop:~$ curl -s https://api.my-tours.example/health
{"status":"ok","uptimeSeconds":52}

# TLS আর Certificate এর লাইনগুলো (Module 06)
you@laptop:~$ curl -sv https://api.my-tours.example/health 2>&1 | grep -E 'SSL connection|ALPN: server|subjectAltName|issuer|^< HTTP|^< via'
* SSL connection using TLSv1.3 / TLS_AES_128_GCM_SHA256 / X25519 / id-ecPublicKey
* ALPN: server accepted h2
*  subjectAltName: host "api.my-tours.example" matched cert's "api.my-tours.example"
*  issuer: CN=Caddy Local Authority - ECC Intermediate
< HTTP/2 200
< via: 1.1 Caddy`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনুশীলনে Laptop এর curl কে দুইটা জিনিস বলে দিতে হয়েছিল: নামটা কোন IP তে যাবে{" "}
                (<code>--resolve</code>, Module 04 এর DNS ছাড়াই পরীক্ষার কৌশল), আর Caddy এর ভেতরের
                CA কে বিশ্বাস করতে (<code>--cacert</code>)। আসল VPS এ এর কোনোটাই লাগবে না। issuer
                এর লাইনে তখন Caddy Local Authority এর বদলে Let&apos;s Encrypt বা ZeroSSL এর নাম দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                Certificate না এলে প্রথমে <code>journalctl -u caddy -n 50</code> দেখুন। প্রায় সবসময়
                কারণ তিনটার একটা: A Record এখনো পুরনো IP দেখাচ্ছে, Cloud Firewall এ 80 বন্ধ বলে
                Let&apos;s Encrypt যাচাই করতে পারছে না, বা Caddyfile এ নামের বানান ভুল। আর একটা জিনিস
                জেনে রাখুন: Caddy এর নিজের একটা Admin API চলে <code>127.0.0.1:2019</code> এ। শুধু
                ভেতরে, তাই নিরাপদ, কিন্তু ss এর তালিকায় দেখে ঘাবড়াবেন না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "keep",
      subHeader: { index: "013", title: "Logs, Uptime, Backups" },
      title: <SectionTitle>চোখ রাখা আর ফেরার রাস্তা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Server চলছে। এখন এমন ব্যবস্থা চাই, যাতে কিছু ভাঙলে আপনি জানতে পারেন, কেন ভাঙল
                সেটা খুঁজে পান, আর দরকার হলে আগের অবস্থায় ফিরতে পারেন। তিনটা কাজ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Log থাকুক Reboot এর পরেও।</strong> {lesson("system-logs", "লেসন ০৭")} এ
                দেখেছেন, journald এর Log শুধু Memory তে থাকলে Reboot এ মুছে যায়।{" "}
                <code>/var/log/journal</code> Folder টা থাকলে Log Disk এ জমা হয়। Ubuntu 24.04 এ
                সাধারণত আগে থেকেই থাকে, একবার দেখে নিন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>বাইরে থেকে কেউ পাহারা দিক।</strong> Server নিজে মরে গেলে নিজের মৃত্যুর খবর
                দিতে পারে না। তাই বাইরের একটা Uptime Check সেবা, যেমন UptimeRobot, Better Stack বা
                Healthchecks, প্রতি মিনিটে <code>https://api.my-tours.example/health</code> এ টোকা
                দেবে, আর উত্তর না এলে আপনার ফোনে বা Email এ জানাবে। এটা দশ মিনিটের কাজ, আর প্রথম
                রাতের বিপদেই এর দাম বুঝবেন। Monitoring এর বড় ছবি আসবে Observability মডিউলে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Backup, দুই স্তরে।</strong> প্রথম স্তর Provider এর Snapshot, পুরো Disk এর
                ছবি। বড় কোনো বদলের আগে হাতে একটা নিন, আর স্বয়ংক্রিয় সাপ্তাহিকটা চালু রাখুন।
                দ্বিতীয় স্তর আপনার নিজের, যেটা আপনি ঠিক জানেন কী রাখে আর কীভাবে ফেরাতে হয়। my-tours
                এ এখনো Database নেই, তাই আপাতত Setting গুলোর Backup: api.env, Caddyfile আর Unit
                File। Database এলে তার Dump এই একই Timer এ যোগ হবে, Island Tours এ যেমন।{" "}
                {lesson("cron-jobs", "লেসন ১০")} এর systemd Timer দিয়ে, প্রতি রাতে 21:30 UTC, মানে
                ঢাকায় রাত সাড়ে তিনটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "/usr/local/bin/my-tours-backup",
          code: `#!/usr/bin/env bash
# my-tours এর Setting গুলোর রাতের Backup। ভেতরে Secret আছে, তাই শুধু root পড়তে পারে।
set -euo pipefail

backup_dir=/var/backups/my-tours
keep_days=7
stamp=$(date -u +%Y%m%d-%H%M)

install -d -m 700 -o root -g root "$backup_dir"
umask 077
tar -czf "$backup_dir/config-$stamp.tar.gz" \\
  /etc/my-tours /etc/caddy/Caddyfile /etc/systemd/system/my-tours-api.service 2>/dev/null

find "$backup_dir" -name 'config-*.tar.gz' -mtime +"$keep_days" -delete
echo "backup written: $backup_dir/config-$stamp.tar.gz"`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "ini",
          filename: "/etc/systemd/system/my-tours-backup.service আর .timer",
          code: `# my-tours-backup.service
[Unit]
Description=my-tours nightly config backup

[Service]
Type=oneshot
ExecStart=/usr/local/bin/my-tours-backup

# my-tours-backup.timer
[Unit]
Description=Run the my-tours backup every night at 03:30 Dhaka time

[Timer]
OnCalendar=*-*-* 21:30:00 UTC
Persistent=true
RandomizedDelaySec=300

[Install]
WantedBy=timers.target`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: Timer চালু, একবার হাতে চালানো, তারপর Restore এর পরীক্ষা",
          code: `deploy@mytours-vps-01:~$ systemd-analyze calendar '*-*-* 21:30:00 UTC' | head -3
Normalized form: *-*-* 21:30:00 UTC
    Next elapse: Sat 2026-10-31 21:30:00 UTC
       From now: 13h left

deploy@mytours-vps-01:~$ sudo systemctl daemon-reload
deploy@mytours-vps-01:~$ sudo systemctl enable --now my-tours-backup.timer
Created symlink /etc/systemd/system/timers.target.wants/my-tours-backup.timer → /etc/systemd/system/my-tours-backup.timer.

# রাতের অপেক্ষা না করে এখনই একবার
deploy@mytours-vps-01:~$ sudo systemctl start my-tours-backup.service
deploy@mytours-vps-01:~$ journalctl -u my-tours-backup -n 3 -o cat --no-pager
backup written: /var/backups/my-tours/config-20261031-0738.tar.gz
my-tours-backup.service: Deactivated successfully.
Finished my-tours-backup.service - my-tours nightly config backup.

deploy@mytours-vps-01:~$ sudo ls -l /var/backups/my-tours
-rw------- 1 root root 795 Oct 31 07:38 config-20261031-0738.tar.gz

deploy@mytours-vps-01:~$ systemctl list-timers my-tours-backup.timer --no-pager | head -2
NEXT                        LEFT LAST PASSED UNIT                  ACTIVATES
Sat 2026-10-31 21:33:54 UTC  13h -         - my-tours-backup.timer my-tours-backup.service

# যে Backup কখনো ফেরানো হয়নি, সেটা Backup নয়, আশা। তাই একবার ফিরিয়ে মিলিয়ে দেখা
deploy@mytours-vps-01:~$ sudo bash -c 'mkdir -p /tmp/restore-test && tar -xzf /var/backups/my-tours/config-*.tar.gz -C /tmp/restore-test && find /tmp/restore-test -type f | sort && diff -r /tmp/restore-test/etc/my-tours /etc/my-tours && diff /tmp/restore-test/etc/caddy/Caddyfile /etc/caddy/Caddyfile && echo "restore matches live files"; rm -rf /tmp/restore-test'
/tmp/restore-test/etc/caddy/Caddyfile
/tmp/restore-test/etc/my-tours/api.env
/tmp/restore-test/etc/systemd/system/my-tours-api.service
restore matches live files

# Log Disk এ জমছে কি না
deploy@mytours-vps-01:~$ ls /var/log/journal
bb34e21505094a108009f5ab781901de
deploy@mytours-vps-01:~$ journalctl --disk-usage
Archived and active journals take up 16.0M in the file system.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Timer এর NEXT এ 21:30 এর বদলে 21:33:54 কেন? কারণ RandomizedDelaySec=300, প্রতিদিন
                শূন্য থেকে পাঁচ মিনিটের একটা এলোমেলো দেরি, যাতে একই সময়ে হাজার Server একসাথে একই
                কাজ শুরু না করে। আর Persistent=true মানে Server সেই রাতে বন্ধ থাকলে চালু হয়েই একবার
                চালিয়ে নেবে, লেসন ১০ এ যার তফাত দেখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                একটা কথা খেয়াল রাখুন: এই Backup Server এর নিজের Disk এ। Disk বা পুরো Server হারালে
                Backup ও হারায়। নিয়মটার নাম 3-2-1: তিনটা কপি, দুই ধরনের জায়গায়, একটা অন্তত অন্য
                শহরে বা অন্য Provider এ। বাইরে পাঠানোর সময় Encrypt করে পাঠাবেন, কারণ ভেতরে Secret
                আছে। Object Storage এ পাঠানোর কাজ পরের মডিউলগুলোতে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "outside-check",
      subHeader: { index: "014", title: "The Final Check" },
      title: <SectionTitle>বাইরে থেকে শেষ পরীক্ষা, আর একটা Reboot</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসনের শুরুতে আটটা কথা লিখেছিলাম। এবার মেলানোর পালা। আর মেলাব বাইরে থেকে, কারণ Server
                এর ভেতরে বসে সব ঠিক দেখালেও আসল প্রশ্ন হলো একজন অচেনা মানুষ বাইরে থেকে কী দেখেন।
                আক্রমণকারী বাইরে, পর্যটকও বাইরে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OutsideCheckDiagram /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "laptop: সাতটা টোকা (অনুশীলনের আসল ফলাফল)",
          code: `# ১ আর ২: root নয়, Password নয়
you@laptop:~$ ssh root@mytours-vps-01
root@mytours-vps-01: Permission denied (publickey).
you@laptop:~$ ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password deploy@mytours-vps-01
deploy@mytours-vps-01: Permission denied (publickey).

# ৩ আর ৪: কোন দরজা খোলা। nmap প্রতিটা Port এ টোকা দিয়ে উত্তর দেখে
you@laptop:~$ nmap -Pn -p 22,80,443,3000,5432,6379 mytours-vps-01
Nmap scan report for mytours-vps-01 (172.21.0.2)
Host is up (0.00063s latency).
PORT     STATE    SERVICE
22/tcp   open     ssh
80/tcp   open     http
443/tcp  open     https
3000/tcp filtered ppp
5432/tcp filtered postgresql
6379/tcp filtered redis

# filtered মানে Firewall টোকাটা চুপচাপ ফেলে দিচ্ছে। nc দিয়ে একই কথা
you@laptop:~$ nc -vz -w 3 mytours-vps-01 3000
nc: connect to mytours-vps-01 (172.21.0.2) port 3000 (tcp) timed out: Operation now in progress

# ৫ আর ৬: HTTPS চলে, http এলে https এ পাঠায়
you@laptop:~$ curl -s https://api.my-tours.example/health
{"status":"ok","uptimeSeconds":52}
you@laptop:~$ curl -sI http://api.my-tours.example/health | head -1
HTTP/1.1 308 Permanent Redirect`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                nmap এর STATE এর ঘরের তিনটা শব্দ আলাদা করে চিনে রাখুন, কারণ তারা তিনটা আলাদা গল্প
                বলে। <strong>open</strong>: কেউ শুনছে, আর দরজা খোলা। <strong>filtered</strong>:
                কোনো উত্তরই আসেনি, অর্থাৎ মাঝে একটা Firewall টোকাটা ফেলে দিয়েছে।{" "}
                <strong>closed</strong>: Server উত্তর দিয়েছে যে এখানে কেউ নেই, অর্থাৎ Firewall নেই
                বা খোলা। অনুশীলনে ufw বন্ধ করে পরীক্ষা করেছিলাম, তখন 3000 দেখিয়েছিল closed। মানে
                App ঠিকই 127.0.0.1 এ ছিল বলে বাঁচা গেছে, কিন্তু দেয়াল ছিল না। নিচের Lab এ এই তফাতটা
                নিজে ঘটিয়ে দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                সপ্তম পরীক্ষা সবচেয়ে বেশি বাদ পড়ে: <strong>Reboot।</strong> আজ সব চলছে মানে কাল
                সকালে চলবে, এর কোনো নিশ্চয়তা নেই। কোনো Service শুধু start করে enable করা ভুলে গেলে
                আজ রাতে সব সবুজ, আর Provider এর রক্ষণাবেক্ষণের Reboot এর পরে App উধাও। তাই ইচ্ছা করে
                এখনই একবার Reboot দিন, যখন আপনি সামনে বসে আছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "Reboot, তারপর সব কি নিজে উঠল?",
          code: `deploy@mytours-vps-01:~$ sudo reboot
# SSH কেটে যাবে। আধা মিনিট থেকে এক মিনিট পরে আবার ঢুকুন

you@laptop:~$ ssh mytours 'systemctl is-active my-tours-api caddy ssh.socket; systemctl is-enabled my-tours-api caddy my-tours-backup.timer; curl -s 127.0.0.1:3000/health; echo'
active
active
active
enabled
enabled
enabled
{"status":"ok","uptimeSeconds":8}

deploy@mytours-vps-01:~$ sudo ufw status | head -1
Status: active`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              uptimeSeconds 8, মানে App টা সত্যিই নতুন করে চালু হয়েছে, Reboot এর পরে কেউ হাত না
              দিয়েই। এটাই Module 06 এর শেষে দেওয়া প্রতিশ্রুতির উত্তর: Server চালু হলে App কে কে চালু
              করে? systemd, কারণ আমরা তাকে enable দিয়ে বলে রেখেছি। শেষে একবার পুরো Server এর একটা
              তালিকা নিন, যেটা পরে আপনার Runbook এ যাবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "server: এই Server এ কী কী চলে, আর কে কোথায় শোনে",
          code: `deploy@mytours-vps-01:~$ systemctl list-units --type=service --state=running --no-legend --no-pager | awk '{print $1}'
caddy.service
cron.service
dbus.service
my-tours-api.service
rsyslog.service
ssh.service
systemd-journald.service
unattended-upgrades.service

deploy@mytours-vps-01:~$ sudo ss -tlnup | awk '{print $1, $5}'
Netid Local
udp *:443
tcp 127.0.0.1:2019
tcp 0.0.0.0:22
tcp 127.0.0.1:3000
tcp *:443
tcp *:80
tcp [::]:22
# অনুশীলনের Container এ 127.0.0.11 এর দুইটা বাড়তি লাইন ছিল, Docker এর নিজের DNS, বাদ দিয়েছি`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা পরীক্ষা একটা নির্দিষ্ট ভুল ধরার জন্য। নিচে Server এ এক বা একাধিক ভুল লুকিয়ে
              রাখুন, আর দেখুন কোন পরীক্ষা লাল হয়। কোনো ভুল একটা পরীক্ষাও লাল না করলে বুঝবেন সেই
              পরীক্ষাটা আপনার তালিকায় নেই।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OutsideCheckLab /> },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Server, আর তার খাতা</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর island-vps-01 ঠিক এই কঙ্কালের উপর দাঁড়ানো। Hostinger এর VPS,
                Ubuntu 24.04 LTS, 2 vCPU, 4 GB RAM, 80 GB NVMe, ঠিকানা 103.94.135.2। একই deploy
                User, একই 00-hardening.conf, একই ufw এর চারটা নিয়ম, একই unattended-upgrades। তফাত
                শুধু ভেতরের দিকে: Island Tours এর NestJS API, PostgreSQL আর Redis চলে Docker এর
                Container এ, আর Docker নিজে একটা systemd Service। Caddy বসে আছে সামনে, ঠিক
                আপনার মতো। রাতের Timer টা Setting এর পাশাপাশি Database এর একটা Dump ও নেয়, সাত দিন
                রাখে।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু Island Tours এর সবচেয়ে কাজের জিনিসটা কোনো কমান্ড নয়, একটা File:{" "}
                <code>SERVER.md</code>, দলের Repository তে রাখা। এর নিয়ম একটাই: Server এ যা কিছু
                হাতে বদলানো হয়, সেটা এখানে লেখা হয়, একই দিনে। ভেতরে যা থাকে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পরিচয়:</strong> Provider, Plan, Region, IP, OS এর সংস্করণ, কবে বানানো।
                </ListItem>
                <ListItem>
                  <strong>কারা ঢুকতে পারে:</strong> deploy এর authorized_keys এ কার কার Key, প্রতিটার
                  ছাপ আর কবে যোগ হয়েছে। কেউ দল ছাড়লে সেই দিনই তার লাইন মোছা হয়।
                </ListItem>
                <ListItem>
                  <strong>কী চলে আর কোথায়:</strong> উপরের মতো Service, Timer আর Port এর তালিকা, প্রতিটা
                  Config File এর Path।
                </ListItem>
                <ListItem>
                  <strong>কীভাবে Deploy হয়</strong>, আর আগের সংস্করণে ফেরার ধাপ।
                </ListItem>
                <ListItem>
                  <strong>Backup কোথায় আর কীভাবে ফেরাতে হয়</strong>, শেষ কবে Restore পরীক্ষা হয়েছে।
                </ListItem>
                <ListItem>
                  <strong>বিপদের ফোন নম্বর:</strong> Web Console কোথায়, Provider এর Support, Domain
                  এর Registrar, কার কাছে কোন Account।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর প্রতি মাসের প্রথম সোমবার একজন এই তালিকা ধরে আধা ঘণ্টা দেন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>/var/run/reboot-required</code> আছে কি না, থাকলে ভিড় কম সময়ে Reboot, তারপর
                  উপরের Reboot পরীক্ষা।
                </ListItem>
                <ListItem>
                  <code>df -h</code> আর <code>journalctl --disk-usage</code>, Disk কতটা ভরেছে (লেসন
                  ০৭, ০৮)।
                </ListItem>
                <ListItem>
                  Certificate এর মেয়াদ কত বাকি, Caddy নিজে নবীকরণ করছে কি না (Module 06)।
                </ListItem>
                <ListItem>
                  <code>systemctl --failed</code> আর গত মাসের Error এর Log এ একবার চোখ।
                </ListItem>
                <ListItem>
                  একটা Backup থেকে Restore করে মিলিয়ে দেখা।
                </ListItem>
                <ListItem>
                  authorized_keys আর sudo group এ কে কে আছে, সবাই কি এখনো দলে।
                </ListItem>
                <ListItem>
                  বাইরে থেকে সাতটা পরীক্ষা আবার, কারণ মাসে কেউ না কেউ কিছু বদলায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                বছরে দুইবার দলটা আরও বড় একটা মহড়া দেয়: একটা নতুন খালি VPS নিয়ে শুধু SERVER.md আর
                Backup দেখে পুরো Server আবার দাঁড় করায়, ঘড়ি ধরে। প্রথমবার লেগেছিল প্রায় পাঁচ ঘণ্টা,
                কারণ খাতায় তিনটা ধাপ লেখা ছিল না। শেষবার দেড় ঘণ্টা। যে Server আবার বানানো যায় না,
                সেটা একদিন হারাবেই, প্রশ্ন শুধু কবে। এই হাতে করা কাজগুলো পরে Ansible বা Cloud-init এর
                মতো যন্ত্র দিয়ে Code এ লেখা হবে, যাকে বলে Infrastructure as Code, সেটা পরের মডিউলের
                গল্প। কিন্তু হাতে একবার না করলে Code এ কী লিখতে হবে সেটাই জানা যায় না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>প্রথম সন্ধ্যা, এক নজরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Email এ IP আসা থেকে বাইরের পরীক্ষা পাস করা পর্যন্ত, পুরো কাজটা একটানা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Server বানানো",
              description:
                "কাছের Region, Ubuntu 24.04 LTS, SSH Key, Backup চালু। Provider Account এ আগেই Two-factor। হাতে আসে 198.51.100.42।",
            },
            {
              title: "প্রথম Login আর প্রথম নজর",
              description:
                "ssh root@198.51.100.42, ছাপ মিলিয়ে yes। os-release, hostnamectl, timedatectl, free, df, ip দিয়ে দেখা Plan যা বলেছিল তাই পেলেন কি না।",
            },
            {
              title: "Update, তারপর রোজ নিজে",
              description:
                "apt-get update আর full-upgrade, reboot-required থাকলে Reboot। unattended-upgrades চালু।",
            },
            {
              title: "deploy, sudo আর Key",
              description:
                "adduser deploy, sudo group, root এর .ssh কপি। root এর Session খোলা রেখে দ্বিতীয় Terminal এ deploy হয়ে ঢুকে sudo চালিয়ে দেখা।",
            },
            {
              title: "SSH এ তালা",
              description:
                "00-hardening.conf এ তিনটা no, sshd -t, Reload। sshd -T দিয়ে আসল মান দেখা, বাইরে থেকে root আর Password দুইটাই প্রত্যাখ্যাত।",
            },
            {
              title: "Firewall, দুই স্তরে",
              description:
                "ufw এ আগে OpenSSH, তারপর 80, 443 tcp আর 443 udp, তারপর enable। Provider এর Cloud Firewall এ একই নিয়ম।",
            },
            {
              title: "ছোট Setting",
              description: "ঘড়ি UTC, NTP active, Hostname, ছোট Server হলে Swap File।",
            },
            {
              title: "Node আর App এর ঘর",
              description:
                "NodeSource থেকে LTS। mytours System User, /srv/my-tours এর মালিক deploy, api.env 640 root:mytours।",
            },
            {
              title: "Code পাঠানো আর Service",
              description:
                "rsync, npm ci --omit=dev, Unit File, enable --now। Secret না থাকলে App চালু হয় না, Log বলে কী নেই। Secret বানিয়ে File এ, Restart, /health এ 200।",
            },
            {
              title: "DNS, Caddy, HTTPS",
              description:
                "আগে A Record আর dig, তারপর Caddy এর অফিসিয়াল ভাণ্ডার থেকে, তিন লাইনের Caddyfile। Certificate নিজে আসে।",
            },
            {
              title: "চোখ আর ফেরার রাস্তা",
              description:
                "Persistent Journal, বাইরের Uptime Check, Provider Snapshot, রাতের Backup Timer, আর একবার Restore করে মেলানো।",
            },
            {
              title: "বাইরে থেকে সাতটা পরীক্ষা",
              description:
                "root আর Password প্রত্যাখ্যাত, শুধু 22, 80, 443 খোলা, HTTPS এ 200, http থেকে 308, আর Reboot এর পরে সব active।",
            },
            {
              title: "খাতায় লেখা",
              description:
                "SERVER.md এ সব: কী বসানো, কোথায়, কারা ঢুকতে পারে, কীভাবে ফেরাতে হয়। মাসিক তালিকা ক্যালেন্ডারে।",
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
                <strong>নিচের Lab টা আগে করুন</strong>, দুইবার। একবার অনুশীলনের Server এ, ভুল করে
                আর ভেঙে। একবার আসল VPS এ, খাতা লিখতে লিখতে।
              </ListItem>
              <ListItem>
                <strong>Ubuntu Server এর অফিসিয়াল নথি</strong>, প্রতিটা অংশের নির্ভরযোগ্য উৎস,
                বিশেষ করে স্বয়ংক্রিয় Update এর পাতাটা।{" "}
                <a href="https://ubuntu.com/server/docs" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  ubuntu.com/server/docs
                </a>
                {" আর "}
                <a
                  href="https://documentation.ubuntu.com/server/how-to/software/automatic-updates/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Automatic updates
                </a>
              </ListItem>
              <ListItem>
                <strong>DigitalOcean এর Initial Server Setup</strong>, এই একই প্রথম ঘণ্টার কাজ, আরেকজনের
                ভাষায়। নিজের ধাপের সাথে মিলিয়ে পড়লে কোথায় কী বাদ গেছে ধরা পড়ে।{" "}
                <a
                  href="https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  digitalocean.com/community/tutorials
                </a>
              </ListItem>
              <ListItem>
                <strong>sshd_config এর man page</strong>, প্রতিটা Setting এর সংজ্ঞা, আর সেই প্রথম মান
                জেতার নিয়মটা লিখিতভাবে। Terminal এ <code>man sshd_config</code>, অথবা{" "}
                <a href="https://man.openbsd.org/sshd_config" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  man.openbsd.org/sshd_config
                </a>
              </ListItem>
              <ListItem>
                <strong>Caddy আর NodeSource এর Install পাতা</strong>, এই লেসনের দুইটা apt ভাণ্ডারের
                আসল উৎস। কমান্ড বদলালে এখানেই আগে বদলায়।{" "}
                <a href="https://caddyserver.com/docs/install" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  caddyserver.com/docs/install
                </a>
                {" আর "}
                <a href="https://github.com/nodesource/distributions" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  github.com/nodesource/distributions
                </a>
              </ListItem>
              <ListItem>
                <strong>Node.js এর Release তালিকা</strong>, কোন সংস্করণ কবে পর্যন্ত Security Patch পাবে।{" "}
                <a href="https://nodejs.org/en/about/previous-releases" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  nodejs.org/en/about/previous-releases
                </a>
              </ListItem>
              <ListItem>
                <strong>আপনার Provider এর সহায়তা পাতা</strong>, Web Console, Snapshot আর Cloud Firewall
                ঠিক কোথায়। Island Tours এর ক্ষেত্রে{" "}
                <a href="https://www.hostinger.com/support/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  hostinger.com/support
                </a>
                । প্রথম রাতের আগেই একবার Web Console খুলে দেখে রাখুন, বিপদের রাতে খোঁজার সময় থাকে না।
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
      title: <SectionTitle>৫ মিনিটে পুরো লেসন, আর পুরো মডিউল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>প্রথমে এই লেসনটা, আট লাইনে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  কাজ শুরুর আগে লিখে ফেলুন শেষে কী সত্যি হবে, আর শেষে সেগুলো বাইরে থেকে মেলান।
                </ListItem>
                <ListItem>
                  VPS মানে পুরো নিয়ন্ত্রণ আর পুরো দায়িত্ব। কাছের Region, Ubuntu LTS, বানানোর সময়ই SSH
                  Key, আর Provider Account এ Two-factor।
                </ListItem>
                <ListItem>
                  প্রথম কাজ Update, তারপর unattended-upgrades। নিজে নিজে Reboot হয় না, সেটা আপনার
                  মাসিক কাজ।
                </ListItem>
                <ListItem>
                  deploy আর sudo, তারপর SSH এ তালা। প্রথম Session খোলা রেখে দ্বিতীয়টায় পরীক্ষা। নিজের
                  File এর নাম 00 দিয়ে, আর বিশ্বাস sshd -T কে।
                </ListItem>
                <ListItem>
                  ufw এ আগে OpenSSH, তারপর enable। Cloud Firewall এ দ্বিতীয় দেয়াল।
                </ListItem>
                <ListItem>
                  App চলে নিজের System User হয়ে, Secret 640 এর File এ, systemd এর হাতে, শুধু
                  127.0.0.1 এ। Secret না থাকলে চালুই হয় না।
                </ListItem>
                <ListItem>
                  আগে DNS, তারপর Caddy। Certificate নিজে আসে, নিজে নবীকরণ হয়।
                </ListItem>
                <ListItem>
                  Uptime Check, Snapshot, রাতের Backup আর একবার Restore। তারপর ইচ্ছা করে একটা Reboot,
                  আর সবকিছু খাতায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার পুরো মডিউল। এগারোটা লেসন এগারোটা আলাদা অধ্যায় মনে হতে পারে, কিন্তু আসলে প্রতিটা
                একটা প্রশ্নের উত্তর, আর প্রশ্নগুলো সব একটা Server কে ঘিরে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ModuleServerDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                গল্পটা একবার টানা বলি, Island Tours এর Server এর এক রাত দিয়ে, যেভাবে আপনি অন্য কাউকে
                বলবেন।
              </ContentParagraph>
              <ContentParagraph>
                রাত তিনটা পঁচিশ, ঢাকা। island-vps-01 এর ঘড়িতে তখন 21:25, কারণ Server এর ঘড়ি UTC তে
                (এই লেসন)। পাঁচ মিনিট পরে একটা systemd Timer জেগে উঠবে আর Database এর Dump নিয়ে{" "}
                <code>/var/backups/islandtours/</code> এ রাখবে, সাত দিনের পুরনোগুলো মুছে দেবে (লেসন
                ১০)। সেই Folder থেকে শুরু করে Caddyfile এর <code>/etc/caddy/</code>, Code এর{" "}
                <code>/srv/islandtours/</code>, সবকিছু কোথায় থাকে সেটা Filesystem এর মানচিত্র বলে দেয়
                (লেসন ০১)।
              </ContentParagraph>
              <ContentParagraph>
                ঠিক তখন Bangkok থেকে একটা Bot Port 22 এ টোকা দিল, root আর একটা Password আন্দাজ
                করে। sshd তাকে দরজায় দাঁড় করিয়েই ফিরিয়ে দিল, কারণ root এর Login বন্ধ আর Password
                দিয়ে কেউ ঢুকতে পারে না, ঢোকা যায় শুধু deploy এর Key দিয়ে (লেসন ০৩)। Bot টা এরপর
                Port 5432 এ চেষ্টা করল। কোনো উত্তরই পেল না, কারণ ufw শুধু 22, 80 আর 443 খোলা রেখেছে
                (লেসন ০৬)। পুরো ঘটনাটা <code>journalctl -u ssh</code> এ একটা লাইন হয়ে রইল (লেসন ০৭)।
              </ContentParagraph>
              <ContentParagraph>
                সাড়ে তিনটায় Backup চলল, root হয়ে, কারণ Backup এ Secret আছে আর Folder টা 700, শুধু
                root ঢুকতে পারে (লেসন ০৪)। সেই Secret গুলো থাকে <code>/etc/islandtours/api.env</code>{" "}
                এ, যেটা App পড়ে Environment Variable হিসেবে, Code এ নয়, Git এ তো নয়ই (লেসন ০৫)।
              </ContentParagraph>
              <ContentParagraph>
                ভোর পাঁচটায় unattended-upgrades একটা Kernel এর Patch নামাল, আর রেখে গেল{" "}
                <code>/var/run/reboot-required</code>। সকালে deploy হয়ে ঢুকে একজন সেটা দেখলেন, ভিড়
                কম থাকতে থাকতে Reboot দিলেন। এক মিনিট পরে Server ফিরল, আর কেউ হাত না দিয়েই Docker,
                Caddy আর সব Container নিজে চালু হলো, কারণ systemd কে আগে থেকেই বলে রাখা আছে কোনটা
                Boot এ উঠবে (লেসন ০২)।
              </ContentParagraph>
              <ContentParagraph>
                দুপুরে একজন পর্যটক অভিযোগ করলেন পাতাটা ধীর। top এ CPU ঠিক, কিন্তু wa এর ঘরে বড়
                সংখ্যা, আর <code>df -h</code> বলল Disk এর 94 শতাংশ ভরা (লেসন ০৮)। কারণ খুঁজতে{" "}
                <code>du -sh</code>, পাওয়া গেল পুরনো Log। আরেকবার, পাতা খুলছেই না এমন অভিযোগে, দল
                বাইরে থেকে ভেতরের দিকে এগিয়েছে: dig, nc, curl, তারপর Server এর ভেতরে ss, আর পেয়েছে যে
                App টা ভুল করে অন্য Port এ শুনছিল (লেসন ০৯)।
              </ContentParagraph>
              <ContentParagraph>
                আর এই পুরো ব্যবস্থাটা দাঁড়িয়েছিল একটা সন্ধ্যায়, একটা খালি VPS থেকে, একটা নির্দিষ্ট
                ক্রমে, যার প্রতিটা ধাপ বাইরে থেকে যাচাই করে খাতায় লেখা হয়েছিল (লেসন ১১)।
              </ContentParagraph>
              <ContentParagraph>
                এই গল্পটা যদি আপনি না দেখে বলতে পারেন, আর প্রতিটা বাক্যে কেউ কেন জিজ্ঞেস করলে উত্তর
                দিতে পারেন, যেমন কেন UTC, কেন 00, কেন 640, কেন আগে OpenSSH, কেন enable আর start
                আলাদা, তাহলে এই মডিউল আপনার হয়ে গেছে। আর তখন আপনি এটা অন্যকে শেখাতেও পারবেন, কারণ
                শেখানো মানে আসলে এই কেন গুলোর উত্তর দেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর Module 08, Backend Runtime",
          content: (
            <p>
              এই পুরো মডিউলে আমরা একটা কমান্ড বহুবার লিখেছি অথচ তার ভেতরে একবারও তাকাইনি:{" "}
              <code>/usr/bin/node server.js</code>। systemd সেটা চালায়, ps এ তার নাম MainThread
              দেখায়, ss এ সে 3000 এ শোনে, Memory লাগে ষোলো MB। কিন্তু একটা Thread কীভাবে একসাথে হাজার
              Request সামলায়? কেন একটা ভারী হিসাব পুরো App কে আটকে দেয়, অথচ Database এর অপেক্ষা
              দেয় না? Node এর ভেতরে কী কী আছে, আর Event Loop আসলে কী ঘোরে? পরের মডিউল সেটা নিয়ে,
              শুরু হবে Node এর ইঞ্জিন দিয়ে।{" "}
              <Link href="/devops/topic/nodejs-internals" className={linkClass}>
                প্রথম লেসন: Node.js Internals (V8 + libuv)
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
      ["VPS", "একটা বড় যন্ত্রের একটা ভাগ, নিজের OS আর root সহ। নিয়ন্ত্রণ পুরো, দায়িত্বও পুরো"],
      ["Region", "পর্যটকের কাছে, কারণ Latency টাকায় কেনা যায় না"],
      ["Web Console", "SSH আর Firewall এর বাইরের ফেরার রাস্তা, Provider এর Dashboard এ"],
      ["Host Key এর ছাপ", "প্রথম Login এ yes এর আগে Console এ মিলিয়ে নেওয়া"],
      ["unattended-upgrades", "রোজ Security Patch নিজে বসায়, কিন্তু নিজে Reboot করে না"],
      ["deploy", "প্রতিদিনের কাজের User, sudo group এ, শুধু Key দিয়ে ঢোকে"],
      ["দুই Session", "একটায় বদল, আরেকটায় পরীক্ষা, পাস হলে তবেই প্রথমটা বন্ধ"],
      ["00-hardening.conf", "sshd প্রথম মান রাখে, তাই নাম 00 দিয়ে। বিশ্বাস sshd -T কে"],
      ["ufw এর ক্রম", "আগে OpenSSH, তারপর 80, 443 tcp আর udp, তারপর enable"],
      ["UTC", "Server এর ঘড়ি, যাতে সব Log আর মেয়াদ এক ঘড়িতে মেলে"],
      ["NodeSource", "Server এ Node LTS, apt দিয়ে Update, /usr/bin/node এ"],
      ["mytours", "App এর System User, Login নেই, Code লিখতে পারে না"],
      ["api.env", "640 root:mytours। Secret বানানো হয় কমান্ডে, টাইপ করে নয়"],
      ["enable --now", "এখন চালু, আর প্রতিটা Boot এ চালু। শুধু start মানে Reboot এ হারানো"],
      ["Caddy", "আগে DNS, তারপর Caddy। তিন লাইনে HTTPS, Certificate নিজে আসে"],
      ["Backup", "Snapshot আর নিজের Timer। যে Backup ফেরানো হয়নি সেটা শুধু আশা"],
      ["open, filtered, closed", "শুনছে, Firewall ফেলে দিল, কেউ নেই আর দেয়ালও নেই"],
      ["SERVER.md", "Server এর খাতা। যা বদলায় সেদিনই লেখা, যাতে আবার বানানো যায়"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "নতুন VPS এ প্রথম Login এর পরে সবার আগে কোন কাজটা?",
        options: [
          {
            key: "A",
            text: "App এর Code পাঠানো, যাতে তাড়াতাড়ি চালু হয়",
            isCorrect: false,
            explanation:
              "App সবার শেষে আসে। তালা না লাগিয়ে আসবাব তোলার মতো, পুরনো Patch আর খোলা দরজা নিয়ে App চালালে প্রথম দিনেই বিপদ।",
          },
          {
            key: "B",
            text: "apt-get update আর full-upgrade, তারপর দরকার হলে Reboot",
            isCorrect: true,
            explanation:
              "ঠিক। Image টা পুরনো, তার পরের কোনো Security Patch নেই। আর এখনো কিছু চলছে না, তাই Reboot এর সবচেয়ে সস্তা সময় এটাই।",
          },
          {
            key: "C",
            text: "ufw enable",
            isCorrect: false,
            explanation:
              "Firewall জরুরি, কিন্তু OpenSSH এর অনুমতি ছাড়া enable দিলে নিজেকে আটকে ফেলবেন। আর Update এর আগে করার কোনো সুবিধাও নেই।",
          },
          {
            key: "D",
            text: "Password Login বন্ধ করা",
            isCorrect: false,
            explanation:
              "deploy User আর তার Key তৈরির আগে বন্ধ করলে নিজেকেই বাইরে আটকে ফেলার ঝুঁকি। এটা আসে deploy এর পরে।",
          },
        ],
      },
      {
        id: 2,
        text: "sshd_config.d তে 99-hardening.conf এ PasswordAuthentication no লিখলেন, অথচ পাশে 50-cloud-init.conf এ yes। sshd -T কী দেখাবে?",
        options: [
          {
            key: "A",
            text: "passwordauthentication no, কারণ শেষের File জেতে",
            isCorrect: false,
            explanation:
              "অনেক Config এ শেষেরটা জেতে, sshd এ নয়। sshd একটা Setting এর প্রথম পাওয়া মানটাই রাখে।",
          },
          {
            key: "B",
            text: "passwordauthentication yes, কারণ 50 আগে পড়া হয় আর প্রথম মান জেতে",
            isCorrect: true,
            explanation:
              "ঠিক, অনুশীলনের Server এ ঠিক এটাই দেখা গেছে। File এর নাম 00 দিয়ে শুরু করলে আপনার মান আগে পড়া হয় আর জেতে।",
          },
          {
            key: "C",
            text: "sshd চালুই হবে না, দুইটা মান সাংঘর্ষিক বলে",
            isCorrect: false,
            explanation: "কোনো Error হয় না, আর এটাই বিপদ। sshd -t ও OK বলে। শুধু sshd -T আসল মান দেখায়।",
          },
          {
            key: "D",
            text: "Server প্রতিবার এলোমেলোভাবে একটা বেছে নেয়",
            isCorrect: false,
            explanation: "ক্রমটা নির্দিষ্ট: নামের বর্ণক্রম, আর প্রথম মান জেতে।",
          },
        ],
      },
      {
        id: 3,
        text: "SSH এর Setting বদলানোর সময় প্রথম Session খোলা রাখার আসল কারণ কী?",
        options: [
          {
            key: "A",
            text: "খোলা Session না থাকলে Reload কাজ করে না",
            isCorrect: false,
            explanation: "Reload যেকোনো Session থেকে চলে। কারণটা ফেরার রাস্তা।",
          },
          {
            key: "B",
            text: "নতুন নিয়মে নতুন Login ব্যর্থ হলেও চলতি Connection টিকে থাকে, সেখান থেকে ভুল সারানো যায়",
            isCorrect: true,
            explanation:
              "ঠিক। sshd বা ufw এর নতুন নিয়ম চলতি Session কাটে না। দ্বিতীয় Terminal এ পরীক্ষা পাস হলে তবেই প্রথমটা বন্ধ।",
          },
          {
            key: "C",
            text: "দুইটা Session থাকলে Server দ্রুত চলে",
            isCorrect: false,
            explanation: "গতির সাথে এর কোনো সম্পর্ক নেই।",
          },
          {
            key: "D",
            text: "Provider দুইটা Session চায়",
            isCorrect: false,
            explanation: "এটা কোনো Provider এর নিয়ম নয়, নিজের নিরাপত্তার অভ্যাস।",
          },
        ],
      },
      {
        id: 4,
        text: "my-tours-api.service এ api.env এর SESSION_SECRET নেই। systemctl status এ কী দেখার কথা?",
        options: [
          {
            key: "A",
            text: "active (running), App খালি Secret নিয়েই চলবে",
            isCorrect: false,
            explanation:
              "এই App চালু হওয়ার আগেই তিনটা Variable খোঁজে, না পেলে বেরিয়ে যায়। খালি Secret নিয়ে চলা ঠিক সেই নীরব ভুল, যেটা এড়াতে চাই।",
          },
          {
            key: "B",
            text: "activating (auto-restart) আর status=1/FAILURE, Log এ লেখা কোন Variable নেই",
            isCorrect: true,
            explanation:
              "ঠিক। অনুশীলনের Server এ ঠিক এটাই দেখা গেছে: missing environment variables: SESSION_SECRET, আর systemd পাঁচ সেকেন্ড পরপর আবার চেষ্টা করছে।",
          },
          {
            key: "C",
            text: "inactive (dead), কোনো Log ছাড়া",
            isCorrect: false,
            explanation: "Restart=on-failure আছে বলে systemd বারবার চেষ্টা করে, আর প্রতিবার App এর বার্তা Journal এ যায়।",
          },
          {
            key: "D",
            text: "Server Reboot হয়ে যাবে",
            isCorrect: false,
            explanation: "একটা Service এর ব্যর্থতা পুরো Server কে Reboot করায় না।",
          },
        ],
      },
      {
        id: 5,
        text: "Server এর ভেতরে curl 127.0.0.1:3000 চলে, কিন্তু বাইরে থেকে nmap এ 3000 দেখায় filtered। এটা কী বোঝায়?",
        options: [
          {
            key: "A",
            text: "App ভেঙে গেছে",
            isCorrect: false,
            explanation: "ভেতর থেকে 200 আসছে, তাই App ঠিক আছে।",
          },
          {
            key: "B",
            text: "Firewall বাইরের টোকা ফেলে দিচ্ছে, আর App শুধু ভেতরে শোনে, ঠিক যেমন চাই",
            isCorrect: true,
            explanation:
              "ঠিক। filtered মানে কোনো উত্তরই আসেনি, Firewall এর কাজ। বাইরের Request আসবে Caddy হয়ে 443 এ।",
          },
          {
            key: "C",
            text: "DNS ভুল",
            isCorrect: false,
            explanation: "nmap IP তে টোকা দিচ্ছে আর 22, 80, 443 খোলা পাচ্ছে, তাই ঠিকানা ঠিক।",
          },
          {
            key: "D",
            text: "Caddy বন্ধ",
            isCorrect: false,
            explanation: "Caddy থাকে 80 আর 443 এ। 3000 এর অবস্থা Caddy নিয়ে কিছু বলে না।",
          },
        ],
      },
      {
        id: 6,
        text: "Caddy Certificate আনতে পারছে না। নিচের কোনটা সবচেয়ে সম্ভাব্য কারণ নয়?",
        options: [
          {
            key: "A",
            text: "A Record এখনো পুরনো IP দেখাচ্ছে",
            isCorrect: false,
            explanation: "এটা খুবই সম্ভাব্য। Let's Encrypt নাম ধরে খোঁজে, ভুল Server এ গেলে যাচাই ব্যর্থ।",
          },
          {
            key: "B",
            text: "Cloud Firewall এ Port 80 বন্ধ",
            isCorrect: false,
            explanation: "এটাও সম্ভাব্য। HTTP-01 যাচাই Port 80 এ হয়।",
          },
          {
            key: "C",
            text: "App টা 127.0.0.1 এ শোনে, 0.0.0.0 এ নয়",
            isCorrect: true,
            explanation:
              "ঠিক, এটা কারণ নয়। Certificate এর কাজ Caddy আর Let's Encrypt এর মাঝে, App এর bind address এখানে কিছু বদলায় না। বরং 127.0.0.1 ই ঠিক।",
          },
          {
            key: "D",
            text: "Caddyfile এ নামের বানান ভুল",
            isCorrect: false,
            explanation: "সম্ভাব্য। Caddy ভুল নামের জন্য Certificate চাইবে, যেটা আপনার Server এ আসেই না।",
          },
        ],
      },
      {
        id: 7,
        text: "সব ঠিক চলছিল, Provider এর রক্ষণাবেক্ষণের Reboot এর পরে App আর চালু নেই, অথচ Caddy চলছে। সবচেয়ে সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "Service টা start করা হয়েছিল কিন্তু enable করা হয়নি",
            isCorrect: true,
            explanation:
              "ঠিক। start মানে এখন চালু, enable মানে প্রতিটা Boot এ চালু। systemctl is-enabled দেখলেই ধরা পড়ে, আর Reboot এর পরীক্ষা এই ভুলটাই ধরার জন্য।",
          },
          {
            key: "B",
            text: "Reboot এ api.env মুছে গেছে",
            isCorrect: false,
            explanation: "/etc এর File Reboot এ মোছে না। /tmp বা /run এর জিনিস মুছতে পারে।",
          },
          {
            key: "C",
            text: "ufw Reboot এ বন্ধ হয়ে যায়",
            isCorrect: false,
            explanation: "ufw enable করার সময়ই বলে enabled on system startup। আর ufw এর সাথে App চালু হওয়ার সম্পর্ক নেই।",
          },
          {
            key: "D",
            text: "Node Reboot এ মুছে যায়",
            isCorrect: false,
            explanation: "apt দিয়ে বসানো Node /usr/bin এ থাকে, Reboot এ থাকে।",
          },
        ],
      },
      {
        id: 8,
        text: "Island Tours বছরে দুইবার খালি VPS এ শুধু SERVER.md আর Backup দেখে Server আবার বানায়। এর মূল উদ্দেশ্য কী?",
        options: [
          {
            key: "A",
            text: "নতুন Server টা পুরনোটার চেয়ে দ্রুত হয়",
            isCorrect: false,
            explanation: "গতি উদ্দেশ্য নয়। মহড়ার Server টা পরে মুছে ফেলা হয়।",
          },
          {
            key: "B",
            text: "প্রমাণ করা যে খাতা আর Backup দিয়ে সত্যিই Server ফেরানো যায়, আর কোথায় কোন ধাপ লেখা নেই সেটা খুঁজে বের করা",
            isCorrect: true,
            explanation:
              "ঠিক। প্রথম মহড়ায় তিনটা ধাপ খাতায় ছিল না বলে পাঁচ ঘণ্টা লেগেছিল। যে Server আবার বানানো যায় না, সেটা একদিন হারাবেই।",
          },
          {
            key: "C",
            text: "Provider বদলানোর প্রস্তুতি",
            isCorrect: false,
            explanation: "সেটাও সম্ভব হয় একই কারণে, কিন্তু মূল উদ্দেশ্য ফেরার রাস্তা যাচাই।",
          },
          {
            key: "D",
            text: "Security Patch বসানো",
            isCorrect: false,
            explanation: "সেটা unattended-upgrades রোজ করে, এর জন্য নতুন Server লাগে না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "শূন্য থেকে একটা চালু, তালাবদ্ধ, যাচাই করা Server",
    subtitle: "ছয়টা ধাপ, অনুশীলনের Server এ আগে, তারপর আসল VPS এ",
    stepName: "LAB",
    steps: [
      {
        title: "দুইটা যন্ত্র: একটা Server, একটা Laptop",
        description:
          "Docker এ দুইটা Ubuntu 24.04, একই Network এ। Laptop এ SSH Key বানিয়ে তার Public অংশ Server এর root এ বসান, ঠিক যেভাবে Provider বসাত। Multipass বা আসল VPS থাকলে এই ধাপ বাদ।",
      },
      {
        title: "প্রথম ঘণ্টা: Update, deploy আর SSH এর তালা",
        description:
          "Update, unattended-upgrades, deploy User, Key কপি, 00-hardening.conf, sshd -T। দ্বিতীয় Terminal এ deploy হয়ে ঢুকে দেখুন, root আর Password প্রত্যাখ্যাত।",
      },
      {
        title: "Firewall",
        description:
          "আগে OpenSSH, তারপর 80, 443 tcp আর udp, তারপর enable। ইচ্ছা করে একবার OpenSSH মুছে নতুন Terminal থেকে ঢোকার চেষ্টা করুন, Connection timed out দেখুন, পুরনো Session থেকে ঠিক করুন।",
      },
      {
        title: "Node আর App এর ঘর",
        description:
          "NodeSource থেকে Node LTS, mytours System User, /srv/my-tours আর api.env, ঠিক মালিক আর Mode সহ।",
      },
      {
        title: "Code, Service আর Caddy",
        description:
          "rsync দিয়ে পাঠান, npm ci, Unit File। Secret ছাড়া চালু করে Log এ ব্যর্থতার বার্তা পড়ুন, তারপর Secret বানিয়ে আবার। শেষে Caddy আর Caddyfile।",
      },
      {
        title: "Backup, বাইরের পরীক্ষা আর Reboot",
        description:
          "Backup Timer, হাতে একবার চালানো আর Restore মেলানো। Laptop থেকে সাতটা পরীক্ষা, তারপর Reboot আর সব active কি না।",
      },
    ],
    codeBlocks: [
      {
        filename: "0-two-machines.sh",
        language: "bash",
        code: `# আপনার নিজের যন্ত্রে চালান। Docker লাগবে, আর privileged Container চালানোর অনুমতি।
# Multipass বা আসল VPS থাকলে এই File বাদ, সরাসরি 1 নম্বরে যান (লেসন ০১)।
mkdir -p ~/practice-vps && cd ~/practice-vps

cat > Dockerfile <<'EOF'
FROM ubuntu:24.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \\
      systemd systemd-sysv dbus openssh-server openssh-client ufw iptables sudo \\
      curl ca-certificates gnupg rsync nmap netcat-openbsd iproute2 nano less \\
    && apt-get clean && rm -rf /var/lib/apt/lists/*
STOPSIGNAL SIGRTMIN+3
CMD ["/sbin/init"]
EOF
docker build -t practice-vps .

docker network create practice-net
for name in mytours-vps-01 laptop; do
  docker run -d --name "$name" --hostname "$name" --network practice-net \\
    --privileged --cgroupns=host -v /sys/fs/cgroup:/sys/fs/cgroup:rw \\
    --tmpfs /run --tmpfs /run/lock practice-vps
done
sleep 5
docker exec mytours-vps-01 systemctl is-system-running      # running

# Laptop এ একজন সাধারণ User আর তার Key
docker exec laptop bash -c 'useradd -m -s /bin/bash you && su - you -c "ssh-keygen -t ed25519 -C you@laptop -N \\"\\" -f ~/.ssh/id_ed25519 -q"'

# Provider যা করত: Public Key টা Server এর root এ বসানো
PUB=$(docker exec laptop cat /home/you/.ssh/id_ed25519.pub)
docker exec mytours-vps-01 bash -c "install -d -m 700 /root/.ssh && echo '$PUB' > /root/.ssh/authorized_keys && chmod 600 /root/.ssh/authorized_keys"

# এখন থেকে Laptop এর ভেতরে কাজ:  docker exec -it laptop su - you
# সেখান থেকে:                     ssh root@mytours-vps-01
# শেষে সব মুছতে:  docker rm -fv mytours-vps-01 laptop && docker network rm practice-net`,
      },
      {
        filename: "1-first-hour.sh",
        language: "bash",
        code: `# Server এ root হয়ে, প্রথম Login এর পরে। প্রতিটা ধাপ পড়ে বুঝে চালান, একসাথে Paste নয়।

# ১. Update আর রোজকার Security Patch
apt-get update && apt-get full-upgrade -y
ls /var/run/reboot-required 2>/dev/null && echo "এখন reboot দিন, তারপর আবার ঢুকুন"
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades          # Yes বেছে নিন
cat /etc/apt/apt.conf.d/20auto-upgrades             # দুইটা লাইনেই "1"

# ২. deploy, sudo আর Key
adduser deploy                                      # Password টা Password Manager এ রাখুন
usermod -aG sudo deploy
usermod -aG adm deploy                              # journalctl আর /var/log পড়তে, sudo ছাড়া
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
ls -la /home/deploy/.ssh                            # 700 আর 600, মালিক deploy

# ৩. এই Session বন্ধ করবেন না। Laptop এ নতুন Terminal থেকে:
#      ssh deploy@<IP>   তারপর   sudo -v
#    পাস হলে তবেই এগোন।

# ৪. SSH এর তালা, নাম 00 দিয়ে যাতে সবার আগে পড়া হয়
cat > /etc/ssh/sshd_config.d/00-hardening.conf <<'EOF'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
EOF
ls /etc/ssh/sshd_config.d/                          # 50-cloud-init.conf থাকলে দেখে রাখুন
sshd -t && echo "sshd -t: OK"
sshd -T | grep -E '^(passwordauthentication|permitrootlogin|kbdinteractiveauthentication) '
# তিনটাই no দেখালে:
systemctl reload ssh

# ৫. নতুন Terminal থেকে প্রমাণ, তারপর root এর Session বন্ধ
#      ssh root@<IP>                                              -> Permission denied (publickey).
#      ssh -o PubkeyAuthentication=no deploy@<IP>                 -> Permission denied (publickey).
#      ssh deploy@<IP> 'whoami'                                   -> deploy`,
      },
      {
        filename: "2-firewall.sh",
        language: "bash",
        code: `# এখন থেকে deploy হয়ে, sudo দিয়ে

sudo ufw allow OpenSSH          # সবার আগে
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp          # HTTP/3
sudo ufw enable                 # প্রশ্ন এলে, OpenSSH আছে নিশ্চিত হয়ে y
sudo ufw status verbose

# একটা নিয়ন্ত্রিত ভুল, পুরনো Session খোলা রেখে:
sudo ufw delete allow OpenSSH
#   নতুন Terminal থেকে:  ssh -o ConnectTimeout=5 deploy@<IP>
#   দেখবেন:  ssh: connect to host ... port 22: Connection timed out
sudo ufw allow OpenSSH          # পুরনো Session থেকেই সারানো
#   নতুন Terminal থেকে আবার ঢুকুন, এবার ঢুকবে

# ছোট Setting
timedatectl                     # Time zone: Etc/UTC
# ছোট VPS এ Swap (Container এ শুধু প্রথম তিনটা চালান)
sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile
sudo swapon /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h`,
      },
      {
        filename: "3-node-and-app-home.sh",
        language: "bash",
        code: `# Node LTS, NodeSource এর apt ভাণ্ডার থেকে। nodejs.org দেখে সংস্করণ বসান
NODE_MAJOR=24
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \\
  | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
printf 'Types: deb\\nURIs: https://deb.nodesource.com/node_%s.x/\\nSuites: nodistro\\nComponents: main\\nSigned-By: /etc/apt/keyrings/nodesource.gpg\\n' "$NODE_MAJOR" \\
  | sudo tee /etc/apt/sources.list.d/nodesource.sources >/dev/null
sudo apt-get update && sudo apt-get install -y nodejs
node --version && which node                         # /usr/bin/node

# App এর User আর ঘর
sudo useradd --system --no-create-home --shell /usr/sbin/nologin mytours
sudo mkdir -p /srv/my-tours /etc/my-tours
sudo chown deploy:deploy /srv/my-tours

# আগে খালি File, ঠিক Permission সহ। তারপর ভেতরে লেখা
sudo install -m 640 -o root -g mytours /dev/null /etc/my-tours/api.env
printf 'NODE_ENV=production\\nPORT=3000\\n' | sudo tee -a /etc/my-tours/api.env >/dev/null
ls -l /etc/my-tours/api.env                         # -rw-r----- root mytours
# SESSION_SECRET ইচ্ছা করে এখনো বাদ, পরের File এ দেখবেন কেন`,
      },
      {
        filename: "4-ship-run-https.sh",
        language: "bash",
        code: `# ---- Laptop এ: ছোট App টা বানানো ----
mkdir -p ~/my-tours-api && cd ~/my-tours-api
cat > server.js <<'EOF'
import http from "node:http";

// কোনো Setting না থাকলে চালুই হব না, ভুল মান নিয়ে চুপচাপ চলার চেয়ে এটা ভালো।
const required = ["NODE_ENV", "PORT", "SESSION_SECRET"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(\`missing environment variables: \${missing.join(", ")}\`);
  process.exit(1);
}

const port = Number(process.env.PORT);

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok", uptimeSeconds: Math.round(process.uptime()) }));
    return;
  }
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

// শুধু 127.0.0.1 এ শুনি, বাইরের দুনিয়া আসবে Caddy হয়ে।
server.listen(port, "127.0.0.1", () => {
  console.log(\`my-tours-api listening on 127.0.0.1:\${port}\`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, finishing open requests");
  server.close(() => process.exit(0));
});
EOF
cat > package.json <<'EOF'
{
  "name": "my-tours-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": { "start": "node server.js" }
}
EOF
# কোনো Dependency নেই, তাই Lock File টা হাতেই লেখা যায়। Node থাকলে npm install ও এটা বানায়
cat > package-lock.json <<'EOF'
{
  "name": "my-tours-api",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": { "": { "name": "my-tours-api", "version": "1.0.0" } }
}
EOF

# ডাকনাম। আসল VPS এ HostName এর জায়গায় আপনার IP
cat >> ~/.ssh/config <<'EOF'
Host mytours
    HostName mytours-vps-01
    User deploy
    IdentityFile ~/.ssh/id_ed25519
EOF
chmod 600 ~/.ssh/config
rsync -av --delete --exclude node_modules --exclude .env ./ mytours:/srv/my-tours/
ssh mytours 'cd /srv/my-tours && npm ci --omit=dev'

# ---- Server এ, deploy হয়ে ----
sudo tee /etc/systemd/system/my-tours-api.service >/dev/null <<'EOF'
[Unit]
Description=my-tours API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=mytours
Group=mytours
WorkingDirectory=/srv/my-tours
EnvironmentFile=/etc/my-tours/api.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5
TimeoutStopSec=20
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload && sudo systemctl enable --now my-tours-api
sleep 7; journalctl -u my-tours-api -n 4 --no-pager    # missing environment variables: SESSION_SECRET

echo "SESSION_SECRET=$(openssl rand -base64 32)" | sudo tee -a /etc/my-tours/api.env >/dev/null
sudo systemctl restart my-tours-api && sleep 2
systemctl status my-tours-api --no-pager | head -4     # active (running)
curl -s 127.0.0.1:3000/health

# Caddy (আগে DNS এর A Record আর dig, Module 04)
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
sudo chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update && sudo apt-get install -y caddy

# অনুশীলনের Server এ tls internal লাইনটা রাখুন, আসল VPS এ মুছে দিন
sudo tee /etc/caddy/Caddyfile >/dev/null <<'EOF'
api.my-tours.example {
	tls internal
	encode zstd gzip
	reverse_proxy 127.0.0.1:3000
}
EOF
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo systemctl restart caddy && systemctl is-active caddy`,
      },
      {
        filename: "5-backup-and-final-check.sh",
        language: "bash",
        code: `# ---- Server এ: Backup Script, Service আর Timer ----
sudo tee /usr/local/bin/my-tours-backup >/dev/null <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
backup_dir=/var/backups/my-tours
keep_days=7
stamp=$(date -u +%Y%m%d-%H%M)
install -d -m 700 -o root -g root "$backup_dir"
umask 077
tar -czf "$backup_dir/config-$stamp.tar.gz" \\
  /etc/my-tours /etc/caddy/Caddyfile /etc/systemd/system/my-tours-api.service 2>/dev/null
find "$backup_dir" -name 'config-*.tar.gz' -mtime +"$keep_days" -delete
echo "backup written: $backup_dir/config-$stamp.tar.gz"
EOF
sudo chmod 755 /usr/local/bin/my-tours-backup
printf '[Unit]\\nDescription=my-tours nightly config backup\\n\\n[Service]\\nType=oneshot\\nExecStart=/usr/local/bin/my-tours-backup\\n' \\
  | sudo tee /etc/systemd/system/my-tours-backup.service >/dev/null
printf '[Unit]\\nDescription=Run the my-tours backup every night at 03:30 Dhaka time\\n\\n[Timer]\\nOnCalendar=*-*-* 21:30:00 UTC\\nPersistent=true\\nRandomizedDelaySec=300\\n\\n[Install]\\nWantedBy=timers.target\\n' \\
  | sudo tee /etc/systemd/system/my-tours-backup.timer >/dev/null
sudo systemctl daemon-reload && sudo systemctl enable --now my-tours-backup.timer
sudo systemctl start my-tours-backup.service
journalctl -u my-tours-backup -n 1 -o cat --no-pager    # backup written: ...
systemctl list-timers my-tours-backup.timer --no-pager

# Restore এর পরীক্ষা
sudo bash -c 'mkdir -p /tmp/restore-test && tar -xzf /var/backups/my-tours/config-*.tar.gz -C /tmp/restore-test \\
  && diff -r /tmp/restore-test/etc/my-tours /etc/my-tours && echo "restore matches live files"; rm -rf /tmp/restore-test'

# ---- Laptop থেকে: সাতটা পরীক্ষা ----
ssh root@mytours-vps-01                                               # Permission denied (publickey).
ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password deploy@mytours-vps-01   # Permission denied (publickey).
nmap -Pn -p 22,80,443,3000,5432,6379 mytours-vps-01                   # শুধু 22, 80, 443 open
curl -sI http://api.my-tours.example/health | head -1                 # 308
curl -s https://api.my-tours.example/health                           # {"status":"ok",...}
# অনুশীলনের Server এ curl এর সাথে যোগ করুন:
#   --resolve api.my-tours.example:443:<Server এর IP> --cacert <Caddy এর root.crt>
# root.crt আছে Server এর /var/lib/caddy/.local/share/caddy/pki/authorities/local/ এ

# ---- Reboot ----
ssh -t mytours 'sudo reboot'       # sudo Password চাইবে বলে -t। অনুশীলনে: docker restart mytours-vps-01
sleep 60
ssh mytours 'systemctl is-active my-tours-api caddy ssh.socket; systemctl is-enabled my-tours-api caddy my-tours-backup.timer; curl -s 127.0.0.1:3000/health'`,
      },
    ],
    tip: "ধাপ ২ আর ৩ এর নিয়ন্ত্রিত ভুলগুলো এড়িয়ে যাবেন না। আটকে পড়ার অনুভূতিটা একবার অনুশীলনের Server এ পেয়ে নিলে, আর পুরনো Session থেকে এক লাইনে সারানোর স্বস্তিটা একবার পেলে, আসল VPS এ আর কখনো প্রথম Session বন্ধ করে পরীক্ষা করবেন না। আর পুরো Lab শেষে সবকিছু মুছে আরেকবার শুরু থেকে করুন, এবার নিজের লেখা SERVER.md দেখে। দ্বিতীয়বার যেখানে আটকাবেন, সেটাই আপনার খাতার ফাঁক।",
  },
  assignment: {
    title: "Mini Project: my-tours এর প্রথম আসল Server",
    time: "৩ থেকে ৪ ঘণ্টা",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>Server দাঁড় করান আর খাতা লিখুন:</strong> অনুশীলনের Server এ একবার, তারপর পারলে
        একটা আসল ছোট VPS এ, এই লেসনের তেরোটা ধাপ মেনে my-tours এর API কে HTTPS এ চালু করুন। কাজের
        সাথে সাথে <code>SERVER.md</code> লিখুন, Island Tours এর ছয়টা অংশ সহ। কোনো ধাপ পরে লিখবেন না,
        করার সাথে সাথে।
      </span>,
      <span key="2">
        <strong>তিনটা ভুল লুকান, তিনটা পরীক্ষায় ধরুন:</strong> ইচ্ছা করে তিনটা ভুল বসান: Hardening
        File এর নাম 99, App কে 0.0.0.0 এ শোনানো আর একই সাথে ufw বন্ধ, আর Service এর enable মুছে
        দেওয়া। প্রতিটার জন্য দেখান বাইরের সাতটা পরীক্ষার কোনটা লাল হলো, আসল Terminal এর ফলাফল
        সহ। তারপর তিনটা সারিয়ে আবার সাতটাই সবুজ দেখান।
      </span>,
      <span key="3">
        <strong>মুছে ফেলে আবার বানান, ঘড়ি ধরে:</strong> Server টা পুরো মুছে দিন। একটা নতুন খালি Server
        এ শুধু নিজের SERVER.md আর Backup দেখে সব আবার দাঁড় করান। কত সময় লাগল লিখুন, আর খাতায় কী কী
        ছিল না যা লাগল, সেগুলো যোগ করে খাতাটা ঠিক করুন।
      </span>,
      <span key="4">
        <strong>মাসিক তালিকা বানান:</strong> নিজের Server এর জন্য একটা মাসিক রক্ষণাবেক্ষণের তালিকা
        লিখুন, প্রতিটা কাজের পাশে ঠিক কোন কমান্ড আর ঠিক অবস্থায় কী দেখার কথা। প্রথমবার তালিকাটা
        পুরো চালিয়ে ফলাফল জমা দিন, আর ক্যালেন্ডারে পরের মাসের তারিখ বসান।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> একজন বন্ধু সবে প্রথম VPS কিনেছেন আর বলছেন,
        আগে App টা চালিয়ে নিই, নিরাপত্তা পরে দেখব। তাঁকে বোঝান কেন ক্রমটা উল্টো, প্রথম Session খোলা
        রাখার অভ্যাসটা কী আর কেন, sshd এর File এর নাম কেন জরুরি, আর start আর enable এর তফাত কেন
        একদিন রাতের ঘুম কেড়ে নিতে পারে।
      </span>,
    ],
    deliverables: [
      <span key="1">চালু Server এর বাইরের সাতটা পরীক্ষার ফলাফল, আর পুরো SERVER.md</span>,
      <span key="2">তিনটা ভুলের প্রতিটার জন্য লাল পরীক্ষার ফলাফল, আর সারানোর পরের সবুজ ফলাফল</span>,
      <span key="3">আবার বানানোর সময়, আর খাতায় যোগ করা ধাপগুলোর তালিকা</span>,
      <span key="4">মাসিক তালিকা আর প্রথমবার চালানোর ফলাফল</span>,
      <span key="5">বন্ধুর জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
