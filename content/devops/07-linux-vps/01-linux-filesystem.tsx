/**
 * What: Module 07 Lesson 01, Linux Filesystem Architecture. Teaches what Linux is, how to get a
 * Linux to practise on and what a VPS is, how to read the prompt and move around, the single
 * tree that starts at "/", what lives in each top level folder, how apt installs a program and
 * where its pieces land, and the everyday file, reading and finding commands.
 *
 * Why: Every later lesson in this module happens on a Linux server, and the reader cannot fix a
 * service, a permission or a log until they know where things live. Module 06 Lesson 10 promised
 * to answer which folder the Caddyfile lives in; this lesson answers it and teaches the reader
 * to find any program's settings on their own. Every output shown was captured by running the
 * commands on an Ubuntu 24.04 practice server; where that server differs from a real VPS, the
 * lesson says so.
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
  FsExplorerLab,
  FsPathLab,
  FsWhereLab,
} from "../../../components/course/topics/linux/fs-animations";
import {
  FsDrivesVsTreeSplit,
  FsHostingKindsDiagram,
  FsKernelDistroDiagram,
  FsPackagePiecesDiagram,
  FsPromptDiagram,
  FsReleasesDiagram,
  FsTreeDiagram,
} from "../../../components/course/topics/linux/fs-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

const linkClass = "text-primary underline underline-offset-4";

export const linuxFilesystemContent: TopicData = {
  id: "linux-filesystem",
  introduction: {
    badge: "MODULE 07 · LESSON 01",
    title: <SectionTitle>যে যন্ত্রে সব Request গিয়ে থামে, তার ভেতরে একবার ঢুকি</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের Module এ একজন পর্যটকের Request কে আমরা অনেক দূর পর্যন্ত অনুসরণ করেছি। DNS ঠিকানা
          দিল, TCP রাস্তা বানাল, TLS তালা লাগাল, আর শেষে Request টা গিয়ে পৌঁছাল{" "}
          <code>103.94.135.2</code> এর Port 443 এ, যেখানে Caddy অপেক্ষা করছিল। তারপর আমরা থেমে
          গিয়েছিলাম। কিন্তু সেই যন্ত্রটা আসলে কী? কোথায় আছে? তার ভেতরে Caddy নামের Program টা
          কোন Folder এ বসে আছে, তার Setting কোথায় লেখা, আর কিছু ভাঙলে Log খুঁজতে কোথায় যাবেন?
        </ContentParagraph>
        <ContentParagraph>
          যন্ত্রটার কোনো পর্দা নেই, Keyboard নেই, Mouse নেই। কোনো এক Data Center এর তাকে বসে আছে,
          আর আপনি তার সাথে কথা বলবেন শুধু লেখা দিয়ে। যন্ত্রটা চলে Linux এ। প্রথমবার এরকম একটা
          কালো পর্দার সামনে বসলে মনে হয় হারিয়ে গেছি। কোনো Desktop নেই, কোনো Icon নেই, শুধু একটা
          লাইন আর একটা জ্বলতে নিভতে থাকা Cursor।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনের কাজ হলো সেই হারিয়ে যাওয়ার অনুভূতিটা মুছে দেওয়া। শেষে আপনি জানবেন Linux আসলে কী
          দিয়ে তৈরি, অনুশীলনের জন্য একটা Linux কীভাবে পাবেন, VPS কী জিনিস, Prompt কীভাবে পড়তে হয়,
          কীভাবে ঘোরাফেরা করতে হয়, আর সবচেয়ে বড় কথা, পুরো Server এর মানচিত্রটা: কোন জিনিস কোন
          Folder এ থাকে, আর কেন। আর আগের Module যে প্রশ্ন রেখে গিয়েছিল, Caddyfile ঠিক কোন Folder
          এ থাকে, তার উত্তর তো পাবেনই, সাথে শিখবেন অচেনা যেকোনো Server এ যেকোনো Program এর Setting
          নিজে নিজে কীভাবে খুঁজে বের করবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "নতুন শহরে প্রথম দিন সবাই হারায়। যিনি শহরের মানচিত্রটা একবার ভালো করে দেখে নেন, দ্বিতীয় দিন থেকে তিনি আর রাস্তা জিজ্ঞেস করেন না, অন্যকে রাস্তা দেখান।",
      author: "Linux Filesystem",
      role: "Lesson 01",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "what-is-linux",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Linux আসলে কী: Kernel আর Distribution</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 01 এ Operating System এর কাজ দেখেছিলেন: একটা ব্যবস্থাপক, যে CPU, Memory,
                Disk আর Network সবার মাঝে ভাগ করে দেয়, যাতে প্রতিটা Program মনে করে পুরো যন্ত্রটা তার
                একার। সেই ব্যবস্থাপকের সবচেয়ে ভেতরের অংশটার নাম Kernel। Hardware কে সরাসরি ছুঁতে
                পারে শুধু Kernel। আপনার Program যখন একটা File পড়তে চায় বা Network এ কিছু পাঠাতে চায়,
                সে নিজে Disk বা Network Card ছোঁয় না, Kernel কে অনুরোধ করে। Linux আসলে এই Kernel টার
                নাম। ১৯৯১ সালে Linus Torvalds নামের একজন ছাত্র এটা লেখা শুরু করেছিলেন, আজ হাজার হাজার
                মানুষ মিলে এটা লেখেন।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু শুধু একটা Kernel দিয়ে আপনি কিছুই করতে পারবেন না। Kernel এর কাছে কথা বলার জন্য
                একটা Shell লাগে, File নাড়াচাড়ার জন্য <code>ls</code>, <code>cp</code> এর মতো ছোট
                ছোট Program লাগে, Server চালু হলে কোন Program আগে চালু হবে সেটা ঠিক করার জন্য একজন
                ব্যবস্থাপক লাগে, আর নতুন Program আনার জন্য একটা দোকান লাগে। Kernel এর সাথে এই সবকিছু
                জুড়ে, পরীক্ষা করে, একসাথে যে প্যাকেজটা মানুষের হাতে দেওয়া হয়, তার নাম{" "}
                <strong>Distribution</strong>, ছোট করে Distro। Ubuntu একটা Distribution। Debian,
                Fedora, Alpine আরও কয়েকটা। সবার ভেতরে একই Linux Kernel, তফাত হলো চারপাশে কী জোড়া
                হয়েছে আর কীভাবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FsKernelDistroDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই পুরো Module এ আমরা Ubuntu ব্যবহার করব, আর নির্দিষ্ট করে বললে{" "}
                <strong>Ubuntu 24.04 LTS</strong>, কারণ Island Tours এর Server এটাতেই চলে। নামের
                শেষের LTS মানে Long Term Support। Ubuntu প্রতি দুই বছরে একটা LTS Version বের করে, আর
                সেটায় অন্তত পাঁচ বছর Security Update আসে। 24.04 এসেছিল ২০২৪ এর এপ্রিলে, তাই ২০২৯ পর্যন্ত
                নিশ্চিন্তে চালানো যায়। ২০২৬ এর এপ্রিলে পরের LTS, 26.04 ও বের হয়েছে। নতুন Server
                খুললে সেটাও বেছে নিতে পারেন। এই Module এর প্রায় সব Command দুইটাতেই হুবহু একই কাজ
                করে।
              </ContentParagraph>
              <ContentParagraph>
                Server এর দুনিয়ায় Linux প্রায় একচ্ছত্র, আর তার কারণগুলো খুব বাস্তব:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>খরচ নেই।</strong> প্রতি Server এ License কিনতে হয় না। একশোটা Server চালালেও
                  না।
                </ListItem>
                <ListItem>
                  <strong>বছরের পর বছর না থেমে চলে।</strong> বেশিরভাগ Update এর জন্য Restart লাগে না,
                  আর লাগলেও কয়েক সেকেন্ডের।
                </ListItem>
                <ListItem>
                  <strong>সবকিছু লেখা দিয়ে চলে।</strong> যা হাতে করা যায়, তা Script এ লেখা যায়।
                  তাই একটা Server যেভাবে সাজালেন, পরের দশটা একই Script দিয়ে হুবহু সাজানো যায়।
                </ListItem>
                <ListItem>
                  <strong>সব জায়গায় একই।</strong> আপনার VPS, বড় Cloud এর Virtual Machine, Docker
                  Container, এমনকি আপনার ফোনের Android, সবার ভেতরে Linux Kernel। একবার শিখলে সব
                  জায়গায় কাজে লাগে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Linux, Ubuntu, আর GNU/Linux: তিনটা নামের হিসাব",
          content: (
            <p>
              কথাবার্তায় মানুষ পুরো Operating System টাকেই Linux বলে, আর সেটা ঠিক আছে। কড়া হিসাবে
              Linux শুধু Kernel, আর <code>ls</code>, <code>cp</code>, <code>bash</code> এর মতো
              Tool গুলোর বড় অংশ এসেছে GNU নামের আরেকটা প্রকল্প থেকে, তাই কেউ কেউ GNU/Linux বলেন।
              Ubuntu হলো সেই পুরো জিনিসটার একটা নির্দিষ্ট সংস্করণ, যেটা Canonical নামের একটা
              প্রতিষ্ঠান সাজিয়ে দেয়। কেউ আপনাকে জিজ্ঞেস করলে বলবেন, Server টা Linux, Distribution
              Ubuntu 24.04।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "practice-linux",
      subHeader: { index: "002", title: "Practice Machine" },
      title: <SectionTitle>অনুশীলনের জন্য একটা Linux: চারটা উপায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সাঁতার বই পড়ে শেখা যায় না, Linux ও না। এই Module এর প্রতিটা লেসন Hands-on, তাই পড়া
                শুরু করার আগে নিজের জন্য একটা Linux চালু করে নিন, যেটা ভাঙলেও কিছু যায় আসে না। চারটা
                উপায় আছে, আর প্রতিটার নিজের সুবিধা আর সীমা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Multipass, নিজের Computer এ একটা আসল Ubuntu।</strong> Canonical এর বানানো
                  একটা ছোট Tool, Mac, Windows আর Linux তিনটাতেই চলে। এক Command এ আপনার Computer এর
                  ভেতরে একটা পুরো Ubuntu Virtual Machine বানায়, যেটায় systemd সহ সবকিছু আসল Server এর
                  মতোই কাজ করে। খরচ নেই, Internet এ খোলা নেই, তাই ভুল করার স্বাধীনতা পুরোটা।
                </ListItem>
                <ListItem>
                  <strong>WSL2, Windows এর ভেতরে Ubuntu।</strong> Windows ব্যবহার করলে Microsoft এর
                  নিজের ব্যবস্থা। Windows এর পাশেই একটা আসল Linux Kernel চলে। শুধু systemd টা চালু আছে কি
                  না একবার দেখে নিতে হয়, কারণ পরের লেসনে সেটা লাগবে।
                </ListItem>
                <ListItem>
                  <strong>Docker Container, সবচেয়ে দ্রুত।</strong> Docker আগে থেকে থাকলে এক লাইনে একটা
                  Ubuntu এর Shell পাবেন। কিন্তু Container আসলে পুরো Server নয়, একটা মোড়ানো Process।
                  সাধারণভাবে চালালে systemd নেই, man পাতা নেই, আর বেরিয়ে এলে সব মুছে যায়। এই লেসনের
                  Folder ঘোরাঘুরির জন্য চলবে, পরের লেসনগুলোর জন্য না।
                </ListItem>
                <ListItem>
                  <strong>একটা সত্যিকারের VPS।</strong> সবচেয়ে বাস্তব, কারণ এটাই আসল জিনিস: একটা
                  Public IP, Internet থেকে আসা আসল আক্রমণ, আসল Firewall। মাসে সামান্য খরচ আছে। পরের
                  Section এ এটা কী আর কীভাবে পাবেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["উপায়", "খরচ", "systemd", "Public IP", "কখন বেছে নেবেন"],
          rows: [
            [mono("Multipass"), "নেই", "আছে", "নেই", "শুরু করার জন্য সেরা, পুরো Module এর জন্য চলবে"],
            [mono("WSL2"), "নেই", "চালু করে নিতে হতে পারে", "নেই", "Windows ব্যবহার করলে"],
            [mono("Docker"), "নেই", "সাধারণভাবে নেই", "নেই", "শুধু এই লেসনের ঘোরাঘুরির জন্য"],
            [mono("VPS"), "মাসিক ভাড়া", "আছে", "আছে", "SSH, Firewall আর আসল Deploy শেখার জন্য"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আমার পরামর্শ: আজই Multipass দিয়ে শুরু করুন, আর লেসন ০৩ এ SSH শেখার সময় থেকে একটা ছোট
              VPS নিয়ে নিন। নিচে প্রথম তিনটা উপায়ের Command। Multipass এর Flag গুলো সময়ের সাথে একটু
              বদলায়, তাই আপনার যন্ত্রে <code>multipass help launch</code> একবার দেখে নেবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "practice-linux.sh",
          code: `# ১. Multipass (Mac, Windows, Linux): multipass.run থেকে Install করে নিন, তারপর
multipass find                      # কোন কোন Ubuntu পাওয়া যায়, 24.04 আছে কি না দেখুন
multipass launch 24.04 --name practice --cpus 2 --memory 2G --disk 10G
multipass shell practice            # ভেতরে ঢুকলেন। Prompt হবে ubuntu@practice:~$
multipass list                      # কোনটা চলছে, তার IP কত
multipass stop practice             # কাজ শেষে থামান
multipass delete practice && multipass purge   # একদম মুছে ফেলতে চাইলে

# ২. WSL2 (Windows এর PowerShell এ, Administrator হিসেবে)
wsl --list --online                 # Ubuntu-24.04 নামটা তালিকায় আছে কি না দেখুন
wsl --install -d Ubuntu-24.04
# Ubuntu খোলার পর systemd চলছে কি না দেখুন:
systemctl is-system-running
# যদি বলে "System has not been booted with systemd", তাহলে /etc/wsl.conf এ লিখুন:
#   [boot]
#   systemd=true
# তারপর PowerShell এ wsl --shutdown দিয়ে Ubuntu আবার খুলুন।

# ৩. Docker (শুধু এই লেসনের জন্য, বেরোলেই সব মুছে যায়)
docker run -it --rm --hostname practice ubuntu:24.04 bash`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই লেসনের Output কোথা থেকে এসেছে",
          content: (
            <p>
              এই লেসনে যত Output দেখবেন, সব একটা Ubuntu 24.04 অনুশীলনের Server এ সত্যি চালিয়ে
              পাওয়া, যার Hostname রাখা হয়েছিল <code>island-vps-01</code> আর User{" "}
              <code>deploy</code>, ঠিক Island Tours এর মতো। যন্ত্রটা একটা ARM Processor এর উপর চলে,
              তাই কোথাও কোথাও <code>arm64</code> বা <code>aarch64</code> লেখা দেখবেন। বেশিরভাগ VPS এ
              সেখানে <code>amd64</code> বা <code>x86_64</code> থাকবে। Command আর তার মানে একই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "what-is-vps",
      subHeader: { index: "003", title: "VPS" },
      title: <SectionTitle>VPS আসলে কী, আর অনুশীলনের জন্য একটা পাওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কোনো এক Data Center এ একটা বিশাল শক্তিশালী Computer আছে, ধরুন ৬৪টা CPU Core আর ২৫৬ GB
                RAM। এত বড় যন্ত্র একজনের ছোট একটা Website এর জন্য অপচয়। তাই Hosting কোম্পানি তার উপর
                একটা বিশেষ Software চালায়, যার নাম <strong>Hypervisor</strong>। Hypervisor এই একটা
                যন্ত্রকে কেটে অনেকগুলো আলাদা ছোট যন্ত্রের মতো বানায়, প্রতিটার নিজের CPU এর ভাগ, নিজের
                RAM, নিজের Disk আর নিজের Public IP। প্রতিটা টুকরোর নাম Virtual Machine। আর এরকম একটা
                Virtual Machine যখন আপনাকে মাসিক ভাড়ায় দেওয়া হয়, তখন তাকে বলে{" "}
                <strong>VPS</strong>, Virtual Private Server।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে বড় কথাটা হলো, VPS এর ভেতরে Operating System টা পুরোপুরি আপনার। নিজের Ubuntu,
                নিজের root, যা ইচ্ছা Install করবেন, যে Port ইচ্ছা খুলবেন। পাশের VM এ কে আছে, কী চালাচ্ছে,
                আপনি দেখতেও পাবেন না, তিনিও আপনাকে দেখবেন না। ঢাকার একটা বড় ফ্ল্যাট বাড়ির কথা ভাবুন।
                বাড়িটা একটাই, কিন্তু প্রতিটা ফ্ল্যাটের নিজের দরজা, নিজের তালা, নিজের চাবি। ভেতরে কীভাবে
                সাজাবেন, সেটা ভাড়াটিয়ার ব্যাপার।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FsHostingKindsDiagram /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["রকম", "আপনি পান", "Root", "কার জন্য"],
          rows: [
            [mono("Shared Hosting"), "অন্য সবার সাথে ভাগ করা একটা Server এ একটা Folder, সাথে cPanel", "নেই", "ছোট WordPress সাইট। Module 04 এর Addon Domain এর দুনিয়া"],
            [mono("VPS"), "নিজের একটা Virtual Machine, নিজের OS", "আছে", "নিজের App, নিজের নিয়মে। Island Tours এখানে"],
            [mono("Dedicated"), "পুরো একটা আসল যন্ত্র", "আছে", "অনেক বেশি ভিড়, বা Hardware এর উপর পুরো দখল দরকার"],
            [mono("Cloud VM"), "VPS এর মতোই, সাথে API, ঘণ্টা হিসেবে বিল", "আছে", "দরকার মতো Server বাড়ানো কমানো, পরের Module গুলোতে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনুশীলনের জন্য একটা VPS পাওয়া পনেরো মিনিটের কাজ। পুরো পরিকল্পনা, কোন Plan কতটা বড়,
                কোন Provider কেন, প্রথম দিনেই কী কী নিরাপত্তা বসাতে হবে, আর my-tours কে একদম শুরু থেকে
                Live করা, এসব আছে এই Module এর শেষ লেসনে,{" "}
                <Link href="/devops/topic/vps-setup" className={linkClass}>
                  VPS Setup, End to End
                </Link>
                । এখানে শুধু এটুকু, যাতে লগইন করে অনুশীলন শুরু করতে পারেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "একটা Provider বেছে নিন",
              description:
                "Hostinger, DigitalOcean, Hetzner, Vultr এর মতো যেকোনো একটায় Account খুলুন। Island Tours Hostinger ব্যবহার করে। Dashboard এর নাম আর বোতাম একেক জায়গায় একেক রকম, কিন্তু প্রশ্নগুলো সবখানে একই।",
            },
            {
              title: "কাছের Region",
              description:
                "Bangladesh থেকে ব্যবহার করলে Singapore বা কাছাকাছি কোনো Data Center নিন। Module 02 এ দেখেছেন, দূরত্ব মানেই Latency।",
            },
            {
              title: "Image: Ubuntu 24.04 LTS",
              description:
                "Operating System এর তালিকা থেকে Ubuntu 24.04 LTS (64-bit বা x86_64) বেছে নিন। কোনো Control Panel আগে থেকে বসানো Image নেবেন না, সব নিজে শিখবেন।",
            },
            {
              title: "সবচেয়ে ছোট Plan",
              description:
                "অনুশীলনের জন্য সবচেয়ে ছোট Plan টাই যথেষ্ট। পরে লাগলে বড় করা যায়।",
            },
            {
              title: "লগইনের উপায়",
              description:
                "SSH Key দেওয়ার জায়গা থাকলে লেসন ০৩ এর পর সেটা ব্যবহার করবেন। আজকের জন্য Provider একটা root Password দিলে সেটা Password Manager এ রাখুন। লেসন ০৩ এ এটা বন্ধ করে Key তে যাবেন।",
            },
            {
              title: "Create, তারপর IP টা নিন",
              description:
                "এক দুই মিনিটে Server তৈরি হয়ে Dashboard এ একটা Public IP দেখাবে। Terminal খুলে ssh root@সেই IP লিখে ঢুকুন। প্রথমবার একটা Fingerprint নিয়ে প্রশ্ন আসবে, yes লিখুন। এর মানে কী, লেসন ০৩ এ।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "first-login (চেহারাটা, আপনার সংখ্যা আলাদা হবে)",
          code: `you@laptop:~$ ssh root@203.0.113.50
Welcome to Ubuntu 24.04.x LTS (GNU/Linux 6.8.0-xx-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of ...

  System load:  0.0               Processes:             105
  Usage of /:   4.1% of 24.05GB   Users logged in:       0
  Memory usage: 9%                IPv4 address for eth0: 203.0.113.50
  Swap usage:   0%

root@ubuntu-s-1vcpu-1gb-sgp1-01:~#`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Prompt এর শেষে # দেখছেন, মানে আপনি root",
          content: (
            <p>
              নতুন VPS এ প্রথমবার আপনি root হয়ে ঢোকেন, যার ক্ষমতার কোনো সীমা নেই। একটা ভুল Command এ
              পুরো Server মুছে যেতে পারে, কেউ আটকাবে না। আর Password দিয়ে root এ ঢোকার দরজা খোলা থাকলে
              Internet এর Bot গুলো কয়েক মিনিটের মধ্যেই সেই দরজায় ধাক্কা দেওয়া শুরু করে। তাই অনুশীলন করুন,
              কিন্তু দীর্ঘদিন এভাবে রাখবেন না। লেসন ০৩ এ নিজের User বানিয়ে, Key দিয়ে ঢোকা চালু করে, root
              আর Password দুইটার দরজাই বন্ধ করবেন। কিছু Provider আবার root এর বদলে <code>ubuntu</code>{" "}
              নামের একটা User দিয়ে ঢোকায়। Dashboard যা বলে, সেটাই মানুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "shell-prompt",
      subHeader: { index: "004", title: "Shell" },
      title: <SectionTitle>Terminal, Shell আর Prompt: কে কী করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা শব্দ প্রায়ই গুলিয়ে যায়, তাই শুরুতেই আলাদা করে নিই। <strong>Terminal</strong>{" "}
                হলো জানালাটা, যেখানে আপনি লেখেন আর লেখা দেখেন। Mac এর Terminal, Windows এর Windows
                Terminal, VS Code এর ভেতরের Terminal, সবাই একই কাজ করে। <strong>Shell</strong> হলো সেই
                জানালার ওপাশে বসে থাকা একটা Program, যে আপনার লেখা লাইনটা পড়ে, বোঝে, আর সেই অনুযায়ী অন্য
                Program চালায়। Ubuntu তে Default Shell এর নাম <code>bash</code>। আর{" "}
                <strong>Prompt</strong> হলো Shell এর দেখানো সেই ছোট লাইনটা, যেটা বলে আমি তৈরি, এবার
                লিখুন।
              </ContentParagraph>
              <ContentParagraph>
                Prompt টা শুধু সাজসজ্জা নয়। তাতে চারটা দরকারি তথ্য থাকে, আর অভিজ্ঞ মানুষেরা প্রতিটা
                বিপজ্জনক Command এর আগে এক পলকে এটা পড়ে নেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FsPromptDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা Command এর গঠন। <code>ls -la /etc</code> লিখলে Shell এটাকে তিন ভাগে ভাঙে।
                প্রথম শব্দ <code>ls</code> হলো কোন Program চালাতে হবে। <code>-la</code> হলো Option,
                Program টা কীভাবে কাজ করবে তার নির্দেশ, সাধারণত <code>-</code> দিয়ে শুরু। আর{" "}
                <code>/etc</code> হলো Argument, কাজটা কিসের উপর। ভাগগুলোর মাঝে Space, আর এই কারণেই
                Linux এ File এর নামে Space রাখা ঝামেলার।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Tab</strong> চাপলে Shell নাম বাকিটা নিজে লিখে দেয়। <code>cd /et</code> লিখে
                  Tab চাপুন, হয়ে যাবে <code>cd /etc/</code>। দুইবার চাপলে সম্ভাব্য সব নাম দেখায়। এটা
                  শুধু সময় বাঁচায় না, বানান ভুলও বাঁচায়।
                </ListItem>
                <ListItem>
                  <strong>উপরের তীর</strong> চাপলে আগের Command ফিরে আসে। <code>history</code> লিখলে
                  পুরো তালিকা। এই কারণেই কখনো Command এর ভেতরে Password লিখবেন না, সেটা এই তালিকায়
                  থেকে যায় (লেসন ০৫)।
                </ListItem>
                <ListItem>
                  <strong>Ctrl+C</strong> চলমান Command থামায়। কোনো কিছু আটকে গেলে প্রথম চেষ্টা এটা।
                  এর ভেতরে আসলে কী ঘটে, লেসন ০২ এ।
                </ListItem>
                <ListItem>
                  <strong>Ctrl+L</strong> বা <code>clear</code> পর্দা পরিষ্কার করে। Command এর
                  ইতিহাস মোছে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                কোনো Command কী করে জানতে দুইটা উপায়। <code>man ls</code> পুরো নির্দেশিকা খোলে, আর{" "}
                <code>ls --help</code> ছোট একটা সারসংক্ষেপ দেয়। অনুশীলনের Server এ man চালাতে গিয়ে এই
                বার্তা এসেছিল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "help.txt",
          code: `deploy@island-vps-01:~$ man ls
This system has been minimized by removing packages and content that are
not required on a system that users do not log into.

To restore this content, including manpages, you can run the 'unminimize'
command. You will still need to ensure the 'man-db' package is installed.

deploy@island-vps-01:~$ ls --help | head -6
Usage: ls [OPTION]... [FILE]...
List information about the FILEs (the current directory by default).
Sort entries alphabetically if none of -cftuvSUX nor --sort is specified.

Mandatory arguments to long options are mandatory for short options too.
  -a, --all                  do not ignore entries starting with .`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "man বলছে minimized?",
          content: (
            <p>
              কিছু Ubuntu Image জায়গা বাঁচাতে man পাতা বাদ দিয়ে আসে, যেমন Docker এর Ubuntu আর কিছু
              Cloud Image। তখন <code>sudo unminimize</code> চালালে সব ফিরে আসে। তাড়া থাকলে{" "}
              <code>--help</code> সবসময় কাজ করে। আর একটা ছোট কৌশল: <code>type</code> দিয়ে জানতে
              পারবেন একটা নাম আসলে কী। <code>type cd</code> বলবে <code>cd is a shell builtin</code>,
              মানে এটা আলাদা কোনো Program নয়, Shell এর নিজের ভেতরের কাজ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "moving-around",
      subHeader: { index: "005", title: "Navigation" },
      title: <SectionTitle>ঘোরাফেরা: pwd, ls, cd আর দুই রকম Path</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Shell সবসময় কোনো না কোনো একটা Folder এ দাঁড়িয়ে থাকে। সেটার নাম{" "}
                <strong>Current Directory</strong>, বা Working Directory। Linux এ Folder কে
                সাধারণত Directory বলে, দুইটা একই জিনিস। তিনটা Command দিয়ে আপনি পুরো Server এ ঘুরতে
                পারবেন: <code>pwd</code> বলে আমি এখন কোথায় (Print Working Directory),{" "}
                <code>ls</code> বলে এখানে কী কী আছে, আর <code>cd</code> নিয়ে যায় অন্য কোথাও (Change
                Directory)।
              </ContentParagraph>
              <ContentParagraph>
                কোথাও যাওয়ার ঠিকানাকে বলে <strong>Path</strong>, আর Path দুই রকম। যে Path{" "}
                <code>/</code> দিয়ে শুরু, সেটা <strong>Absolute Path</strong>, গোড়া থেকে পুরো ঠিকানা।
                আপনি যেখানেই থাকুন, <code>/etc/caddy</code> সবসময় একই জায়গা। যেমন পুরো ডাকঠিকানা:
                বাড়ি নম্বর, রাস্তা, এলাকা, শহর। আর যে Path <code>/</code> দিয়ে শুরু হয় না, সেটা{" "}
                <strong>Relative Path</strong>, এখন যেখানে দাঁড়িয়ে আছেন সেখান থেকে হিসাব। যেমন কাউকে
                বলা, এখান থেকে দুই বাড়ি পরে। কোথায় দাঁড়িয়ে বলছেন তার উপর মানে বদলে যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>.</code> মানে এই Folder টাই। <code>./notes</code> মানে এখানকার notes।
                </ListItem>
                <ListItem>
                  <code>..</code> মানে এক ধাপ উপরের Folder, মা Folder।{" "}
                  <code>../..</code> মানে দুই ধাপ উপরে।
                </ListItem>
                <ListItem>
                  <code>~</code> মানে আপনার Home Folder। deploy এর জন্য সেটা{" "}
                  <code>/home/deploy</code>।
                </ListItem>
                <ListItem>
                  শুধু <code>cd</code> লিখলে সোজা Home এ ফেরে, আর <code>cd -</code> ফেরে ঠিক আগের
                  জায়গায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>অনুশীলনের Server এ একটা ছোট ঘোরাঘুরি, প্রতিটা লাইনের পরে pwd:</ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "walk.txt",
          code: `deploy@island-vps-01:~$ cd /etc/caddy && pwd && ls
/etc/caddy
Caddyfile
deploy@island-vps-01:/etc/caddy$ cd .. && pwd
/etc
deploy@island-vps-01:/etc$ cd ~ && pwd
/home/deploy
deploy@island-vps-01:~$ cd /var/log/caddy && pwd
/var/log/caddy
deploy@island-vps-01:/var/log/caddy$ cd ../../backups/islandtours && pwd
/var/backups/islandtours
deploy@island-vps-01:/var/backups/islandtours$ cd -
/var/log/caddy
deploy@island-vps-01:/var/log/caddy$ cd && pwd
/home/deploy`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পাঁচ নম্বর লাইনটা একটু থেমে দেখুন। <code>/var/log/caddy</code> থেকে{" "}
              <code>../..</code> মানে দুই ধাপ উপরে, <code>/var</code>। তারপর{" "}
              <code>backups/islandtours</code>। মাথায় এই হিসাবটা করতে করতে একদিন অভ্যাস হয়ে যাবে।
              ততদিন নিচের Lab টা আপনার হয়ে হিসাব করবে, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FsPathLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার <code>ls</code> এর সবচেয়ে কাজের রূপ, <code>ls -la</code>। <code>-l</code> মানে
                লম্বা তালিকা, প্রতিটা জিনিসের বিস্তারিত সহ। <code>-a</code> মানে সব, লুকানোগুলোও।
                Linux এ যে File এর নাম <code>.</code> দিয়ে শুরু, সেটা সাধারণ <code>ls</code> এ দেখা যায়
                না। একে বলে Hidden File, আর বেশিরভাগ Setting এভাবেই লুকিয়ে থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "ls-la.txt",
          code: `deploy@island-vps-01:~$ ls -la ~
total 20
drwxr-x--- 2 deploy deploy 4096 Oct 31 07:23 .
drwxr-xr-x 1 root   root   4096 Oct 31 07:23 ..
-rw-r--r-- 1 deploy deploy  220 Mar 31  2024 .bash_logout
-rw-r--r-- 1 deploy deploy 3771 Mar 31  2024 .bashrc
-rw-r--r-- 1 deploy deploy  807 Mar 31  2024 .profile`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কলাম", "উদাহরণ", "মানে"],
          rows: [
            [mono("প্রথম অক্ষর"), "d, -, l", "d মানে Directory, - মানে সাধারণ File, l মানে Link"],
            [mono("বাকি নয়টা অক্ষর"), "rw-r--r--", "কে পড়তে, লিখতে, চালাতে পারে। পুরোটা লেসন ০৪ এ"],
            [mono("সংখ্যা"), "2", "কতগুলো নাম এই জিনিসটাকে দেখায়। এখন উপেক্ষা করুন"],
            [mono("Owner, Group"), "deploy deploy", "File টা কার, আর কোন দলের। লেসন ০৪"],
            [mono("Size"), "3771", "Byte এ। -h দিলে 3.7K এর মতো পড়ার মতো করে দেখায়"],
            [mono("সময়"), "Mar 31 2024", "শেষ কবে বদলেছে"],
            [mono("নাম"), ".bashrc", ". আর .. সবসময় থাকে: এই Folder আর মা Folder"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ll নামের ছোট রাস্তা",
          content: (
            <p>
              Ubuntu এর <code>~/.bashrc</code> এ আগে থেকেই লেখা আছে{" "}
              <code>alias ll=&apos;ls -alF&apos;</code>। তাই Terminal এ শুধু <code>ll</code>{" "}
              লিখলেই লম্বা তালিকা পাবেন। Alias মানে একটা লম্বা Command এর ডাকনাম। এই File টা কখন পড়া
              হয় আর কখন হয় না, সেটা লেসন ০৫ এর বিষয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "one-tree",
      subHeader: { index: "006", title: "One Tree" },
      title: <SectionTitle>একটাই গাছ, শুরু / থেকে, আর Disk জোড়ে Mount দিয়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Windows থেকে এলে প্রথম ধাক্কাটা এখানে। Linux এ কোনো C: Drive নেই, D: Drive নেই। পুরো
                যন্ত্রে একটাই গাছ, আর সেই গাছের গোড়ার নাম শুধু একটা দাগ: <code>/</code>। একে বলে Root
                Directory। Server এ যত File আছে, যত Disk লাগানো আছে, সবকিছু এই একটা গাছের কোনো না কোনো
                ডালে ঝুলে আছে।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে নতুন একটা Disk লাগালে সেটা কোথায় যায়? সেটা গাছের কোনো একটা খালি Folder এ জুড়ে
                দেওয়া হয়, যেমন <code>/mnt/data</code>। এই জুড়ে দেওয়ার নাম <strong>Mount</strong>।
                তারপর থেকে <code>/mnt/data</code> এ ঢুকলেই আপনি আসলে অন্য Disk এ আছেন, যদিও Path দেখে
                বোঝার উপায় নেই। Pen Drive, দ্বিতীয় Disk, এমনকি Network এর ওপারের Storage, সবাই এভাবেই
                গাছে ঢোকে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FsDrivesVsTreeSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              গাছের গোড়ায় দাঁড়িয়ে দেখা যাক প্রথম স্তরে কী আছে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "root.txt",
          code: `deploy@island-vps-01:~$ ls /
bin                bin.usr-is-merged  boot  dev  etc  home  lib
lib.usr-is-merged  media  mnt  opt  proc  root  run  sbin
sbin.usr-is-merged  srv  sys  tmp  usr  var

deploy@island-vps-01:~$ ls -la / | grep -- '->'
lrwxrwxrwx   1 root root    7 Apr 22  2024 bin -> usr/bin
lrwxrwxrwx   1 root root    7 Apr 22  2024 lib -> usr/lib
lrwxrwxrwx   1 root root    8 Apr 22  2024 sbin -> usr/sbin`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় Command টা একটা মজার জিনিস দেখাচ্ছে। <code>/bin</code>, <code>/lib</code>{" "}
                আর <code>/sbin</code> আসলে Folder নয়, তীর। <code>/bin</code> দেখায়{" "}
                <code>/usr/bin</code> কে। অনেক আগে এগুলো আলাদা ছিল, কারণ তখনকার ছোট Disk এ সব জায়গা
                হতো না। আধুনিক Ubuntu সব এক জায়গায় এনেছে, আর পুরনো Script যাতে না ভাঙে সেজন্য পুরনো
                নামগুলো তীর হয়ে রয়ে গেছে। <code>.usr-is-merged</code> দিয়ে শেষ হওয়া নামগুলো এই একত্র
                করার কাজের চিহ্ন, এগুলো নিয়ে মাথা ঘামানোর কিছু নেই। আসল VPS এ এর পাশে{" "}
                <code>lost+found</code> আর <code>snap</code> ও দেখতে পারেন।
              </ContentParagraph>
              <ContentParagraph>
                কোন Disk গাছের কোথায় জুড়ে আছে, আর কতটা ভরা, সেটা দেখার Command <code>df -h</code>।{" "}
                <code>-h</code> মানে Human, সংখ্যাগুলো GB আর MB এ। আর Disk গুলো নিজেরা কী কী আছে, দেখায়{" "}
                <code>lsblk</code>। অনুশীলনের Server টা একটা Container, তাই তার <code>df</code> একটু
                অন্যরকম দেখায়। আগে সেটা, তারপর একটা আসল VPS এ যেমন দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "df.txt",
          code: `# অনুশীলনের Server (Container), সত্যি Output:
deploy@island-vps-01:~$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
overlay          98G   14G   79G  16% /

deploy@island-vps-01:~$ lsblk
NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
vda     253:0    0   20G  0 disk
|-vda1  253:1    0   19G  0 part
|-vda15 253:15   0   99M  0 part
\`-vda16 259:0    0  923M  0 part
vdb     253:16   0  100G  0 disk
\`-vdb1  253:17   0  100G  0 part /etc/hosts

# একটা আসল Ubuntu 24.04 VPS এ df -h এর চেহারা (সংখ্যা আপনার আলাদা হবে):
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        77G  3.1G   74G   5% /
/dev/vda16      881M  112M  708M  14% /boot
/dev/vda15      105M  6.1M   99M   6% /boot/efi`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম লাইনে <code>overlay</code> দেখছেন, কারণ Container এর গাছটা কয়েকটা স্তর জুড়ে
                বানানো, সেটা Docker এর Module এর গল্প। lsblk এর তালিকা কিন্তু একটা আসল Ubuntu Cloud
                VM এর মতোই: <code>vda</code> নামের একটা Disk, তার তিনটা ভাগ। আসল VPS এ{" "}
                <code>vda1</code> Mount হয় <code>/</code> এ, মানে পুরো গাছটা ওখানে।{" "}
                <code>vda16</code> যায় <code>/boot</code> এ আর <code>vda15</code>{" "}
                <code>/boot/efi</code> এ, যন্ত্র চালু হওয়ার জন্য। Disk এর নামের <code>v</code> মানে
                Virtual, আপনি একটা VM এ আছেন বলে। কিছু Provider এ নামটা <code>sda</code> বা{" "}
                <code>nvme0n1</code> হয়, মানে একই।
              </ContentParagraph>
              <ContentParagraph>
                কোন Disk কোথায় Mount হবে, সেটা Server চালু হওয়ার সময় একটা File থেকে পড়া হয়:{" "}
                <code>/etc/fstab</code>। নতুন Disk যোগ করার আগে এই File এ হাত দেওয়া শিখতে হয়, কারণ এখানে
                একটা ভুল মানে Server আর চালুই না হওয়া। আপাতত শুধু নামটা মনে রাখুন। আর{" "}
                <code>df -i</code> নামের আরেকটা রূপ আছে, যেটা জায়গা নয়, File এর সংখ্যার হিসাব দেখায়। লক্ষ
                লক্ষ ছোট File জমলে Disk খালি থাকতেও নতুন File বানানো যায় না। সেই গল্প লেসন ০৮ এ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "etc-usr-var",
      subHeader: { index: "007", title: "FHS" },
      title: <SectionTitle>তিনটা বড় ঘর: /etc, /usr আর /var</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম স্তরের Folder গুলোর নাম আর কাজ এলোমেলো নয়। একটা লিখিত নিয়মপত্র আছে, নাম{" "}
                <strong>FHS</strong>, Filesystem Hierarchy Standard, যেটা বলে কোন জিনিস কোথায় থাকবে।
                প্রায় সব Distribution এটা মানে। তাই Ubuntu তে শেখা মানচিত্র Debian বা অন্য কোথাও গিয়েও
                প্রায় হুবহু কাজে লাগে। মানচিত্রটা মুখস্থ করার দরকার নেই। প্রতিটা ঘরের কাজটা বুঝলে বাকিটা
                নিজেই আন্দাজ করতে পারবেন। শুরু করি তিনটা সবচেয়ে বড় ঘর দিয়ে, কারণ আপনার কাজের নব্বই ভাগ
                এই তিনটার ভেতরে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>/etc, Setting এর ঘর।</strong> Server এ প্রায় যেকোনো Program এর Setting খুঁজতে
                চাইলে প্রথম জায়গা এটা। এখানের প্রায় সব File সাধারণ Text, যেকোনো Editor এ খোলা যায়।
                Windows এর Registry এর কাজটা Linux এ এই সাধারণ File গুলো করে, আর সেটাই সুবিধা: একটা
                Setting এর Backup নেওয়া মানে একটা File কপি করা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "etc.txt",
          code: `deploy@island-vps-01:~$ ls /etc | wc -l
130
deploy@island-vps-01:~$ cat /etc/hostname
island-vps-01
deploy@island-vps-01:~$ head -6 /etc/os-release
PRETTY_NAME="Ubuntu 24.04.5 LTS"
NAME="Ubuntu"
VERSION_ID="24.04"
VERSION="24.04.5 LTS (Noble Numbat)"
VERSION_CODENAME=noble
ID=ubuntu
deploy@island-vps-01:~$ ls /etc/caddy /etc/islandtours
/etc/caddy:
Caddyfile

/etc/islandtours:
api.env`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                /etc এর কয়েকটা File এই Module জুড়ে বারবার দেখা হবে, তাই নামগুলো চিনে রাখুন:{" "}
                <code>/etc/hostname</code> (যন্ত্রের নাম), <code>/etc/hosts</code> (DNS এর আগে দেখা
                ছোট ঠিকানার খাতা, Module 04 আর লেসন ০৯), <code>/etc/passwd</code> আর{" "}
                <code>/etc/group</code> (User আর দল, লেসন ০৪), <code>/etc/ssh/</code> (লেসন ০৩),{" "}
                <code>/etc/systemd/system/</code> (নিজের Service, লেসন ০২),{" "}
                <code>/etc/cron.d/</code> (নির্দিষ্ট সময়ের কাজ, লেসন ১০)।
              </ContentParagraph>
              <ContentParagraph>
                <strong>/usr, Install করা Program এর ঘর।</strong> নামটা User থেকে এলেও আজ এখানে
                মানুষের কোনো File থাকে না। apt যা বসায় তার বেশিরভাগ এখানে: Program গুলো{" "}
                <code>/usr/bin</code> এ, Library <code>/usr/lib</code> এ, নথি আর অন্যান্য জিনিস{" "}
                <code>/usr/share</code> এ। অনুশীলনের Server এ শুধু <code>/usr/bin</code> এই ৫০৪টা
                Program। এই ঘরে আপনি নিজে হাত দেবেন না, আপনার হয়ে apt দেবে। একটাই ব্যতিক্রম:{" "}
                <code>/usr/local</code>। নিজে Build করা বা হাতে নামানো Program এখানে রাখবেন, কারণ apt
                এই অংশে কখনো লেখে না, তাই পরের Update এ আপনার জিনিস হারায় না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>/var, বদলাতে থাকা জিনিসের ঘর।</strong> নামটা Variable থেকে। Server চলতে চলতে
                যা বাড়ে আর বদলায়, সব এখানে: Log, Database এর File, Cache, অপেক্ষায় থাকা Mail, Backup। এই
                কারণে Disk ভরে যাওয়ার খবর এলে প্রথম সন্দেহ এই ঘরটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "var.txt",
          code: `deploy@island-vps-01:~$ ls /var
backups  cache  lib  local  lock  log  mail  opt  run  spool  tmp
deploy@island-vps-01:~$ ls /var/log
README  alternatives.log  apt  auth.log  bootstrap.log  btmp  caddy
dmesg  dpkg.log  faillog  journal  kern.log  lastlog  private
syslog  sysstat  wtmp
deploy@island-vps-01:~$ ls /var/lib
apt  caddy  dbus  dpkg  logrotate  misc  pam  private  python
shells.state  sudo  systemd  ucf`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["/var এর ভেতরে", "কী থাকে", "Island Tours এ"],
          rows: [
            [mono("/var/log"), "Log, Text File আর journald এর Journal", "/var/log/caddy/access.log, লেসন ০৭"],
            [mono("/var/lib"), "Program এর নিজের স্থায়ী Data", "/var/lib/caddy (Certificate), /var/lib/docker"],
            [mono("/var/cache"), "আবার বানানো যায় এমন জিনিস, যেমন apt এর নামানো Package", "মুছলে ক্ষতি নেই, শুধু ধীর হবে"],
            [mono("/var/backups"), "Backup", "/var/backups/islandtours, লেসন ১০"],
            [mono("/var/spool"), "লাইনে অপেক্ষায় থাকা কাজ: Mail, Print, cron", "লেসন ১০ এ একবার দেখা হবে"],
            [mono("/var/tmp"), "অস্থায়ী, কিন্তু Restart এর পরেও থাকে", "/tmp এর চেয়ে একটু বেশি টেকে"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা প্রশ্নে পুরো মানচিত্র",
          content: (
            <p>
              কোনো File কোথায় রাখবেন বা খুঁজবেন, ঠিক করতে নিজেকে জিজ্ঞেস করুন: এটা কি Program, Setting,
              নাকি চলতে চলতে বদলায়? Program হলে <code>/usr</code>, Setting হলে <code>/etc</code>,
              বদলালে <code>/var</code>। এই এক প্রশ্নে Server এর বেশিরভাগ File এর জায়গা ঠিক হয়ে যায়।
              আর তিনটা আলাদা রাখার সুবিধাও বড়। Program আবার Install করা যায়, তাই তার Backup লাগে না।
              Setting ছোট আর অমূল্য, তাই সবসময় Backup। Data বড় আর বাড়তে থাকে, তাই তার জন্য আলাদা Disk
              আর আলাদা নজর।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "other-folders",
      subHeader: { index: "008", title: "FHS" },
      title: <SectionTitle>বাকি ঘরগুলো, একটা একটা করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাকি ঘরগুলো ছোট, কিন্তু প্রতিটার নিজের কাজ আছে, আর ভুল ঘরে জিনিস রাখার দাম একদিন না
                একদিন দিতে হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>/home</strong>: প্রতিটা মানুষ User এর নিজের ঘর, যেমন{" "}
                  <code>/home/deploy</code>। নিজের Setting, নিজের SSH Key, নিজের Note।
                </ListItem>
                <ListItem>
                  <strong>/root</strong>: root User এর ঘর। এটা <code>/home</code> এর ভেতরে নয়, যাতে{" "}
                  <code>/home</code> আলাদা Disk এ থাকলে আর সেই Disk ঝামেলা করলেও root ঢুকে সারাতে
                  পারে।
                </ListItem>
                <ListItem>
                  <strong>/srv</strong>: Server টা বাইরের দুনিয়াকে যা পরিবেশন করে, তার জন্য। নতুন Server
                  এ খালি। Island Tours এর App এর Code এখানে।
                </ListItem>
                <ListItem>
                  <strong>/opt</strong>: এমন Program, যা একটা Folder হয়ে আসে আর নিজের সবকিছু নিজের
                  ভেতরে রাখে।
                </ListItem>
                <ListItem>
                  <strong>/tmp</strong>: সবার অস্থায়ী জায়গা। Restart এ বা কয়েকদিন পর পরিষ্কার হতে পারে।
                  দরকারি কিছু এখানে কখনো নয়।
                </ListItem>
                <ListItem>
                  <strong>/boot</strong>: Kernel আর চালু হওয়ার File। Kernel Update হলে apt এখানে লেখে।
                  হাতে কিছু মুছবেন না।
                </ListItem>
                <ListItem>
                  <strong>/mnt</strong> আর <strong>/media</strong>: হাতে Mount করা Disk এর জন্য{" "}
                  <code>/mnt</code>, Pen Drive এর মতো নিজে থেকে আসা জিনিসের জন্য{" "}
                  <code>/media</code>।
                </ListItem>
                <ListItem>
                  <strong>/run</strong>: এই Boot এর চলমান অবস্থা, Memory তে। Restart দিলেই মুছে যায়, আর
                  সেটাই উদ্দেশ্য।
                </ListItem>
                <ListItem>
                  <strong>/proc</strong>, <strong>/sys</strong> আর <strong>/dev</strong>: এই তিনটা
                  আসলে ঘর নয়, জানালা। পরের Section পুরোটা এদের নিয়ে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মুখস্থ না করে ঘুরে দেখাই ভালো। নিচের Lab এ প্রতিটা ঘরে একবার ঢুকুন। প্রতিটার পাশে আছে
                Windows এ তার কাছাকাছি জিনিস, Island Tours সেখানে কী রাখে, হাত দেওয়া নিরাপদ কি না, আর
                অনুশীলনের Server এ চালানো একটা আসল Command।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FsExplorerLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "/tmp এর Permission এর শেষে একটা t কেন",
          content: (
            <p>
              <code>ls -ld /tmp</code> চালালে দেখবেন <code>drwxrwxrwt</code>। সবাই লিখতে পারে, তাই
              মাঝের rwx তিনবার। কিন্তু শেষের <code>t</code> একটা বিশেষ নিয়ম, নাম Sticky Bit: যে কেউ এখানে
              File বানাতে পারবে, কিন্তু শুধু নিজের File মুছতে পারবে, অন্যের নয়। না হলে যেকোনো User অন্যের
              অস্থায়ী File মুছে তার Program ভেঙে দিতে পারত। বাকি অক্ষরগুলোর পুরো মানে লেসন ০৪ এ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "everything-is-a-file",
      subHeader: { index: "009", title: "Everything is a File" },
      title: <SectionTitle>সবকিছুই File: /proc, /dev আর /sys</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Linux এর একটা পুরনো আর খুব কাজের নীতি আছে: যত কিছু সম্ভব, সবকিছুকে File হিসেবে দেখানো।
                এর ফল দারুণ। যে Command দিয়ে আপনি একটা Text File পড়েন, ঠিক সেই <code>cat</code> আর{" "}
                <code>head</code> দিয়েই আপনি জানতে পারেন Server এ কতটা RAM আছে, কোন Program কোন
                Setting নিয়ে চলছে, বা Network Card এর MTU কত। নতুন কোনো Tool শিখতে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>/proc</strong> এর একটা File ও Disk এ নেই। আপনি যখন{" "}
                <code>/proc/meminfo</code> পড়েন, Kernel সেই মুহূর্তের হিসাব দিয়ে File টা বানিয়ে দেয়।
                একটু পরে আবার পড়লে সংখ্যা বদলে যাবে। যেন একটা জানালা, যার ওপাশে Kernel এর খাতা খোলা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "proc.txt",
          code: `deploy@island-vps-01:~$ nproc
4
deploy@island-vps-01:~$ head -3 /proc/meminfo
MemTotal:        6052188 kB
MemFree:          661292 kB
MemAvailable:    3958436 kB
deploy@island-vps-01:~$ cat /proc/uptime
16124.67 56265.67`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমটা বলছে চারটা CPU, দ্বিতীয়টা প্রায় ৬ GB RAM, তৃতীয়টার প্রথম সংখ্যা যন্ত্রটা কত
                সেকেন্ড ধরে চালু। এগুলো অনুশীলনের যন্ত্রের সংখ্যা। Island Tours এর VPS এ{" "}
                <code>nproc</code> বলবে 2, আর MemTotal প্রায় 4 GB। এই সংখ্যাগুলো সুন্দর করে পড়ার Tool,{" "}
                <code>free</code>, <code>top</code> এসব, লেসন ০৮ এ। ভেতরে ভেতরে ওরাও এই File গুলোই
                পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                এবার সবচেয়ে কাজের অংশ। প্রতিটা চলমান Program এর জন্য <code>/proc</code> এ একটা Folder
                আছে, যার নাম সেই Program এর নম্বর, যাকে বলে PID। সেই Folder এ খুঁজলে জানা যায় Program টা
                ঠিক কোন Command দিয়ে চালু হয়েছিল। আগের Module এর প্রশ্নের উত্তরের দিকে প্রথম পা এটা:
                Caddy আসলে কোন Setting File নিয়ে চলছে?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "proc-caddy.txt",
          code: `deploy@island-vps-01:~$ pgrep -x caddy
382
deploy@island-vps-01:~$ tr '\\0' ' ' < /proc/382/cmdline; echo
/usr/bin/caddy run --environ --config /etc/caddy/Caddyfile
deploy@island-vps-01:~$ head -9 /proc/382/status
Name:	caddy
Umask:	0022
State:	S (sleeping)
Tgid:	382
Ngid:	0
Pid:	382
PPid:	1
TracerPid:	0
Uid:	999	999	999	999`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>pgrep -x caddy</code> নাম দিয়ে Program টার PID খুঁজে দিল, 382। তারপর{" "}
                <code>cmdline</code> File টা সরাসরি বলে দিল Caddy চালু হয়েছে{" "}
                <code>--config /etc/caddy/Caddyfile</code> নিয়ে। এখানে আর আন্দাজের কিছু নেই, চলমান
                Program নিজেই বলছে। মাঝের <code>tr</code> টা শুধু সাজানোর জন্য, কারণ এই File এ শব্দগুলোর
                মাঝে Space এর বদলে একটা অদৃশ্য শূন্য Byte থাকে।
              </ContentParagraph>
              <ContentParagraph>
                <code>status</code> File এ দুইটা লাইন খেয়াল করুন। <code>Uid: 999</code> মানে Caddy
                root হয়ে নয়, নিজের একটা User হয়ে চলছে, কেন সেটা লেসন ০৪ এ। আর <code>PPid: 1</code>{" "}
                মানে Caddy কে চালু করেছে PID 1, Server চালু হয়ে প্রথম যে Program টা জাগে। সে কে, আর সে
                কীভাবে জানল Caddy কে চালু করতে হবে, সেটাই পরের লেসনের গল্প।
              </ContentParagraph>
              <ContentParagraph>
                <strong>/dev</strong> এ থাকে যন্ত্রগুলো, File হিসেবে। Disk, Terminal আর কয়েকটা বিশেষ
                জিনিস, যেগুলো প্রতিদিন কাজে লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "dev.txt",
          code: `deploy@island-vps-01:~$ ls -l /dev/null /dev/zero /dev/urandom
crw-rw-rw- 1 root root 1, 3 Oct 31 07:23 /dev/null
crw-rw-rw- 1 root root 1, 9 Oct 31 07:23 /dev/urandom
crw-rw-rw- 1 root root 1, 5 Oct 31 07:23 /dev/zero
deploy@island-vps-01:~$ echo "hello" > /dev/null; echo "exit=$?"
exit=0
deploy@island-vps-01:~$ head -c 8 /dev/urandom | od -An -tx1
 c5 66 47 8b 55 29 0c b1
deploy@island-vps-01:~$ head -c 8 /dev/zero | od -An -tx1
 00 00 00 00 00 00 00 00
deploy@island-vps-01:~$ grep -H . /sys/class/net/*/mtu
/sys/class/net/eth0/mtu:1500
/sys/class/net/lo/mtu:65536`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["File", "কী করে", "কোথায় কাজে লাগে"],
          rows: [
            [mono("/dev/null"), "যা লেখেন সব খেয়ে ফেলে, পড়লে কিছুই দেয় না", "অদরকারি Output ফেলে দিতে: command 2>/dev/null"],
            [mono("/dev/urandom"), "অফুরন্ত এলোমেলো Byte", "Secret আর Password বানাতে, লেসন ০৫"],
            [mono("/dev/zero"), "অফুরন্ত শূন্য Byte", "একটা নির্দিষ্ট আকারের File বানাতে"],
            [mono("/sys/class/net/eth0/mtu"), "Network Card এর MTU", "Module 05 এর সেই 1500, এখানে সরাসরি"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "/proc আর /sys এর তফাত",
          content: (
            <p>
              দুইটাই Kernel এর জানালা। <code>/proc</code> পুরনো, মূলত চলমান Process আর সাধারণ হিসাব
              নিয়ে। <code>/sys</code> নতুন আর বেশি গোছানো, Hardware আর Driver এর খুঁটিনাটি নিয়ে। দুইটাতেই
              কিছু File লেখাও যায়, আর লিখলে Kernel এর আচরণ সাথে সাথে বদলায়। তাই এখানে কিছু লেখার আগে
              ঠিক জানতে হবে কী করছেন। পড়া সবসময় নিরাপদ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "apt",
      subHeader: { index: "010", title: "Packages" },
      title: <SectionTitle>Program আসে কোথা থেকে: apt আর Package</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Windows এ একটা Program বসাতে আপনি একটা Website এ যান, একটা Installer নামান, Next Next
                চাপেন। Linux এ এর চেয়ে অনেক ভালো একটা ব্যবস্থা আছে। Ubuntu এর একটা বিশাল সরকারি গুদাম
                আছে, যাকে বলে <strong>Repository</strong>, যেখানে হাজার হাজার Program আগে থেকে পরীক্ষা
                করে, সই করে, সাজিয়ে রাখা। প্রতিটা Program একটা মোড়ানো প্যাকেটে থাকে, নাম{" "}
                <strong>Package</strong>, Ubuntu তে যার শেষে <code>.deb</code>। আর এই গুদাম থেকে
                Package এনে বসানো, সরানো আর নতুন রাখার Tool এর নাম <strong>apt</strong>।
              </ContentParagraph>
              <ContentParagraph>
                দোকানের সাথে মিলিয়ে ভাবুন। <code>apt update</code> মানে দোকানের নতুন মূল্যতালিকা আনা,
                কোনো জিনিস কেনা নয়। আপনার Server জানল কোন Package এর নতুন Version এসেছে।{" "}
                <code>apt upgrade</code> মানে সেই তালিকা দেখে পুরনো জিনিসগুলো সত্যি সত্যি নতুন দিয়ে
                বদলানো। তাই এই দুইটা প্রায় সবসময় একসাথে, আগে update, তারপর upgrade। Server এর প্রায় সব
                কাজে Administrator এর ক্ষমতা লাগে, তাই সামনে <code>sudo</code>, যার পুরো গল্প লেসন ০৪ এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "apt.txt",
          code: `deploy@island-vps-01:~$ sudo apt update
...
Hit:3 http://ports.ubuntu.com/ubuntu-ports noble-backports InRelease
Hit:4 http://ports.ubuntu.com/ubuntu-ports noble-security InRelease
Reading package lists...
Building dependency tree...
Reading state information...
All packages are up to date.

deploy@island-vps-01:~$ apt show ncdu
Package: ncdu
Version: 1.19-0.1
Section: universe/admin
Installed-Size: 158 kB
Depends: libc6 (>= 2.34), libncursesw6 (>= 6), libtinfo6 (>= 6)
Download-Size: 49.3 kB
APT-Sources: http://ports.ubuntu.com/ubuntu-ports noble/universe arm64 Packages
Description: ncurses disk usage viewer

deploy@island-vps-01:~$ sudo apt install -y ncdu
...
Unpacking ncdu (1.19-0.1) ...
Setting up ncdu (1.19-0.1) ...
deploy@island-vps-01:~$ which ncdu
/usr/bin/ncdu`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>noble-security</code> লাইনটা দেখুন। noble হলো 24.04 এর ডাকনাম, আর security মানে
                শুধু নিরাপত্তার Update এর আলাদা একটা তাক। আপনার VPS এ ঠিকানাটা{" "}
                <code>archive.ubuntu.com</code> বা Provider এর নিজের কোনো Mirror হতে পারে, আর{" "}
                <code>arm64</code> এর জায়গায় <code>amd64</code>। <code>Depends</code> লাইনটা বলছে এই
                Program চলতে আর কোন কোন Package লাগে। apt সেগুলোও নিজে থেকে এনে বসায়, এই হিসাব রাখাই তার
                সবচেয়ে বড় কাজ।
              </ContentParagraph>
              <ContentParagraph>
                এবার সরানো। এখানে একটা তফাত আছে, যেটা না জানলে একদিন নিজের হাতে লেখা Setting হারাবেন।
                অনুশীলনের Server এ Caddy বসানো ছিল, আর তার Caddyfile আমরা নিজেরা বদলে Island Tours এর
                Setting লিখেছিলাম, ১০৪ Byte এর একটা File। তারপর:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "remove-vs-purge.txt",
          code: `deploy@island-vps-01:~$ sudo apt remove -y caddy
deploy@island-vps-01:~$ ls -la /etc/caddy
-rw-r--r-- 1 root root  104 Oct 31 07:25 Caddyfile
deploy@island-vps-01:~$ dpkg -l caddy | tail -1
rc  caddy          2.6.2-6ubuntu0.24.04.3 arm64        Fast, lightweight web server with automatic HTTPS

deploy@island-vps-01:~$ sudo apt purge -y caddy
deploy@island-vps-01:~$ ls -la /etc/caddy
ls: cannot access '/etc/caddy': No such file or directory`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>remove</code> Program টা সরিয়েছে, কিন্তু আমাদের Caddyfile রেখে দিয়েছে। dpkg এর{" "}
                <code>rc</code> অবস্থাটার মানে ঠিক এটাই: Removed, কিন্তু Config এখনো আছে। আবার Install
                করলে Caddy পুরনো Setting নিয়েই উঠবে। <code>purge</code> Program আর তার Setting দুইটাই
                মুছেছে, পুরো Folder সহ। আমাদের হাতে লেখা Setting টাও গেল। তাই purge এর আগে সবসময় একটা
                কপি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Command", "কী করে", "কখন"],
          rows: [
            [mono("sudo apt update"), "Package এর তালিকা নতুন করে আনে, কিছু বসায় না", "অন্য যেকোনো apt কাজের আগে"],
            [mono("apt list --upgradable"), "কোন কোনটার নতুন Version এসেছে", "upgrade এর আগে একবার দেখে নিতে"],
            [mono("sudo apt upgrade"), "বসানো Package গুলো নতুন Version এ তোলে", "নিয়মিত, অন্তত সপ্তাহে একবার"],
            [mono("apt search, apt show"), "নাম দিয়ে খোঁজা, বিস্তারিত দেখা", "বসানোর আগে"],
            [mono("sudo apt install x"), "x আর তার যা যা লাগে, সব বসায়", "নতুন Program"],
            [mono("sudo apt remove x"), "Program সরায়, Setting রাখে", "পরে আবার লাগতে পারে"],
            [mono("sudo apt purge x"), "Program আর Setting দুইটাই মোছে", "একদম পরিষ্কার চাইলে, কপি রেখে"],
            [mono("sudo apt autoremove"), "আর কারো লাগে না এমন সঙ্গী Package মোছে", "মাঝে মাঝে পরিষ্কারের জন্য"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "apt নাকি apt-get",
          content: (
            <p>
              দুইটাই একই গুদাম থেকে একই কাজ করে। <code>apt</code> মানুষের জন্য, সুন্দর Progress Bar আর
              রঙ সহ, তবে এর Output এর চেহারা Version ভেদে বদলাতে পারে, তাই Script এ এর Output এর উপর
              ভরসা করা যায় না। Script আর Automation এ তাই <code>apt-get</code> লেখা হয়, যার আচরণ বছরের
              পর বছর একই থাকে। আর Security Update প্রতিদিন নিজে থেকে বসানোর ব্যবস্থা, যার নাম
              unattended-upgrades, সেটা চালু করবেন লেসন ০৩ এ, Server এর প্রথম ঘণ্টার কাজের তালিকায়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "package-pieces",
      subHeader: { index: "011", title: "Where Things Land" },
      title: <SectionTitle>Install এর পর টুকরোগুলো কোথায় গেল, আর Caddyfile কোথায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Program মানে একটা File নয়। Caddy আবার Install করে দেখা যাক প্যাকেটটা খুলে কোন
                জিনিস কোথায় বসল। <code>dpkg</code> হলো apt এর নিচের স্তরের Tool, যে প্রতিটা Package এর
                প্রতিটা File এর হিসাব রাখে। <code>dpkg -L</code> একটা Package এর সব File দেখায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "dpkg-L-caddy.txt",
          code: `deploy@island-vps-01:~$ dpkg -L caddy | grep -v share
/.
/etc
/etc/caddy
/etc/caddy/Caddyfile
/lib
diverted by base-files to: /lib.usr-is-merged
/lib/systemd
/lib/systemd/system
/lib/systemd/system/caddy-api.service
/lib/systemd/system/caddy.service
/usr
/usr/bin
/usr/bin/caddy
deploy@island-vps-01:~$ dpkg -L caddy | grep share | head -4
/usr/share
/usr/share/bash-completion
/usr/share/bash-completion/completions
/usr/share/bash-completion/completions/caddy
deploy@island-vps-01:~$ which caddy
/usr/bin/caddy
deploy@island-vps-01:~$ dpkg -S /usr/bin/ls
coreutils: /usr/bin/ls
deploy@island-vps-01:~$ ls -ld /var/lib/caddy /var/log/caddy
drwxr-x--- 4 caddy caddy 4096 Oct 31 07:25 /var/lib/caddy
drwxr-xr-x 2 caddy caddy 4096 Oct 31 07:25 /var/log/caddy`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FsPackagePiecesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের Module এর প্রশ্নের পুরো উত্তর এখন আপনার হাতে। Caddyfile থাকে{" "}
                <code>/etc/caddy/Caddyfile</code> এ। Program টা নিজে{" "}
                <code>/usr/bin/caddy</code>। কে আর কীভাবে Caddy কে চালু করবে, তার নিয়মপত্র{" "}
                <code>caddy.service</code>, যেটা পড়তে শিখবেন পরের লেসনে। Caddy যে Certificate নিজে নিয়ে
                আসে (Module 06 এর লেসন ০৮), সেগুলো তার নিজের Data, তাই <code>/var/lib/caddy</code>। আর
                Log যায় <code>/var/log/caddy</code> আর journald এ, লেসন ০৭ এ।
              </ContentParagraph>
              <ContentParagraph>
                <code>dpkg -L</code> এর তালিকায় <code>/lib/systemd/system</code> দেখে অবাক হবেন না।
                মনে আছে <code>/lib</code> একটা তীর, আসলে <code>/usr/lib</code>। দুইটা একই জায়গা। আর{" "}
                <code>diverted by base-files</code> লাইনটা সেই একত্র করার কাজেরই একটা হিসাব, Program
                এর কোনো টুকরো নয়। তালিকার উপরের <code>/.</code>, <code>/etc</code>,{" "}
                <code>/usr</code> এর মতো লাইনগুলো শুধু বলছে কোন কোন Folder এর ভেতর দিয়ে File গুলো গেছে।
              </ContentParagraph>
              <ContentParagraph>
                এর চেয়েও কাজের হলো পদ্ধতিটা, কারণ একদিন আপনাকে এমন একটা Server এ পাঠানো হবে যেটা অন্য
                কেউ সাজিয়েছে, কোনো নথি নেই। তখন যেকোনো Program এর Setting খুঁজবেন এই ক্রমে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>চলমান Program কে জিজ্ঞেস করুন।</strong> <code>pgrep</code> দিয়ে PID,
                  তারপর <code>/proc/PID/cmdline</code>। Program টা কোন Setting নিয়ে চলছে, প্রায়ই
                  সরাসরি লেখা থাকে। এটাই সবচেয়ে বিশ্বাসযোগ্য, কারণ এটা আসলে যা চলছে তার কথা।
                </ListItem>
                <ListItem>
                  <strong>Package এর তালিকা দেখুন।</strong> <code>dpkg -L নাম | grep /etc</code>।
                </ListItem>
                <ListItem>
                  <strong>Service এর নিয়মপত্র পড়ুন।</strong> <code>systemctl cat নাম</code>, পরের
                  লেসনে।
                </ListItem>
                <ListItem>
                  <strong>শেষ ভরসা খোঁজা।</strong> <code>sudo find /etc -name &apos;*নাম*&apos;</code>{" "}
                  আর <code>grep -ril নাম /etc</code>, এই লেসনের ১৪ নম্বর Section এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Ubuntu এর Caddy পুরনো",
          content: (
            <p>
              উপরে দেখছেন Version <code>2.6.2</code>, ২০২২ সালের। Ubuntu এর গুদামে একটা LTS এর জীবনজুড়ে
              বেশিরভাগ Program এর মূল Version আটকে থাকে, শুধু Security এর সারাই আসে। স্থিরতার জন্য এটা
              ভালো, কিন্তু Caddy এর মতো দ্রুত বদলানো Program এর নতুন সুবিধা আসে না। তাই Caddy নিজেদের
              একটা আলাদা Repository রাখে, আর Island Tours সেখান থেকেই নেয়। কীভাবে সেটা যোগ করতে হয়,{" "}
              <Link href="/devops/topic/vps-setup" className={linkClass}>
                এই Module এর শেষ লেসনে
              </Link>
              । Node.js এর বেলায়ও ঠিক একই কথা।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "working-with-files",
      subHeader: { index: "012", title: "Files" },
      title: <SectionTitle>File আর Folder নিয়ে কাজ: বানানো, কপি, সরানো, মোছা, Link</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার প্রতিদিনের কাজ। Home এ একটা <code>practice</code> Folder বানিয়ে তার ভেতরে সব করা
                হলো, যাতে ভুল হলেও ক্ষতি না হয়। প্রথম লাইনের Error টা ইচ্ছা করে রাখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "files.txt",
          code: `deploy@island-vps-01:~/practice$ mkdir notes/2026/october
mkdir: cannot create directory 'notes/2026/october': No such file or directory
deploy@island-vps-01:~/practice$ mkdir -p notes/2026/october
deploy@island-vps-01:~/practice$ touch notes/2026/october/day-1.txt
deploy@island-vps-01:~/practice$ echo "Caddy listens on 443" > notes/readme.txt
deploy@island-vps-01:~/practice$ cp notes/readme.txt notes/readme.bak
deploy@island-vps-01:~/practice$ mv notes/readme.bak notes/readme.old
deploy@island-vps-01:~/practice$ cp -r notes notes-copy
deploy@island-vps-01:~/practice$ ls
notes  notes-copy
deploy@island-vps-01:~/practice$ tree notes
notes
|-- 2026
|   \`-- october
|       \`-- day-1.txt
|-- readme.old
\`-- readme.txt

3 directories, 3 files
deploy@island-vps-01:~/practice$ rm notes-copy
rm: cannot remove 'notes-copy': Is a directory
deploy@island-vps-01:~/practice$ rm -r notes-copy
deploy@island-vps-01:~/practice$ ls
notes`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Command", "কী করে", "মনে রাখার কথা"],
          rows: [
            [mono("mkdir -p a/b/c"), "Folder বানায়, -p দিলে মাঝের সব সহ", "-p ছাড়া মাঝের Folder না থাকলে Error, যা উপরে দেখলেন"],
            [mono("touch file"), "খালি File বানায়, থাকলে শুধু সময়টা নতুন করে", ""],
            [mono("echo text > file"), "File এ লেখে, আগের সব মুছে", "> মানে নতুন করে, >> মানে শেষে যোগ"],
            [mono("cp a b"), "কপি করে", "Folder কপি করতে -r লাগে"],
            [mono("mv a b"), "সরায়, বা নাম বদলায়", "Linux এ নাম বদলানোর আলাদা Command নেই, mv ই সেটা"],
            [mono("rm file"), "File মোছে", "Recycle Bin নেই। মোছা মানে চিরতরে"],
            [mono("rm -r folder"), "Folder আর তার ভেতরের সব মোছে", "-i দিলে প্রতিটার আগে জিজ্ঞেস করে"],
            [mono("ln -s target name"), "একটা Symbolic Link, তীর বানায়", "নিচে বিস্তারিত"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "rm এর কোনো Undo নেই",
          content: (
            <p>
              Linux এর <code>rm</code> জিজ্ঞেস করে না, ফেরত দেয় না। <code>-f</code> যোগ করলে Error ও
              দেখায় না, চুপচাপ মুছে চলে যায়। আর <code>sudo</code> এর সাথে মিললে বাধা দেওয়ার মতো কেউ
              থাকে না। তিনটা অভ্যাস আপনাকে বাঁচাবে। এক, <code>rm</code> এর আগে একই Path দিয়ে{" "}
              <code>ls</code> চালিয়ে দেখুন ঠিক কী মুছতে যাচ্ছেন। দুই, <code>*</code> এর মতো Wildcard
              আর <code>sudo</code> একসাথে দেখলে থামুন আর আরেকবার পড়ুন। তিন, Prompt টা পড়ুন, কোন
              Server আর কোন Folder। একটা ভুল Space এর কারণে <code>rm -rf /srv /old</code> আর{" "}
              <code>rm -rf /srv/old</code> এর তফাত একটা পুরো Server।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Symbolic Link</strong> হলো একটা ছোট File, যার ভেতরে শুধু আরেকটা Path লেখা।
                Windows এর Shortcut এর মতো, তবে Program গুলো এটাকে আসল জিনিস হিসেবেই দেখে। ছোট করে
                Symlink বলে। এই লেসনের শুরুতে <code>/bin</code> যে তীর দেখলেন, সেটা এরকম একটা Symlink।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "symlink.txt",
          code: `deploy@island-vps-01:~/practice$ ln -s /etc/caddy/Caddyfile caddyfile-link
deploy@island-vps-01:~/practice$ ls -l caddyfile-link
lrwxrwxrwx 1 deploy deploy 20 Oct 31 07:43 caddyfile-link -> /etc/caddy/Caddyfile
deploy@island-vps-01:~/practice$ head -1 caddyfile-link
islandtours.example {
deploy@island-vps-01:~/practice$ touch .secret-note
deploy@island-vps-01:~/practice$ ls
caddyfile-link  notes
deploy@island-vps-01:~/practice$ ls -a
.  ..  .secret-note  caddyfile-link  notes
deploy@island-vps-01:~/practice$ file notes/readme.txt /usr/bin/caddy /etc/caddy /dev/null caddyfile-link
notes/readme.txt: ASCII text
/usr/bin/caddy:   ELF 64-bit LSB executable, ARM aarch64, version 1 (SYSV), ...
/etc/caddy:       directory
/dev/null:        character special (1/3)
caddyfile-link:   symbolic link to /etc/caddy/Caddyfile`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ Command টা, <code>file</code>, একটা লুকানো সত্যি দেখায়: Linux এ File এর নামের শেষে{" "}
                <code>.txt</code> বা <code>.exe</code> থাকা জরুরি নয়। File টা আসলে কী, সেটা নাম দেখে
                নয়, ভেতরের Byte দেখে বোঝা হয়। <code>/usr/bin/caddy</code> এর নামে কোনো শেষাংশ নেই,
                তবু <code>file</code> বলে এটা একটা চালানোর মতো Program, যাকে Linux এ ELF বলে।
              </ContentParagraph>
              <ContentParagraph>
                Symlink এর সবচেয়ে কাজের ব্যবহার Deploy এ, যেটা এই লেসনের Project Example এ দেখবেন।
                একটা ছোট সূক্ষ্মতা জেনে রাখুন। Symlink এর ভেতরে <code>cd</code> করলে{" "}
                <code>pwd</code> দেখায় Link এর নামটা, আর <code>pwd -P</code> দেখায় আসলে কোথায়
                দাঁড়িয়ে আছেন। <code>readlink -f</code> যেকোনো Link এর শেষ ঠিকানা বলে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "reading-editing",
      subHeader: { index: "013", title: "Read and Edit" },
      title: <SectionTitle>File পড়া আর বদলানো: cat, less, head, tail, nano</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Server এ কাজের বড় অংশ হলো File পড়া, বিশেষ করে Setting আর Log। কোন Tool কখন, সেটা নির্ভর
                করে File টা কত বড় আর আপনি কোন অংশ চান তার উপর।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>cat</code> পুরো File টা একবারে পর্দায় ঢেলে দেয়। ছোট File এর জন্য।
                </ListItem>
                <ListItem>
                  <code>less</code> বড় File খোলে, পাতা পাতা করে। Space এ পরের পাতা, <code>b</code> তে
                  আগের, <code>/শব্দ</code> লিখে খোঁজা, <code>n</code> এ পরের মিল, <code>G</code> তে
                  একদম শেষে, <code>q</code> তে বেরোনো। হাজার লাইনের Log এর জন্য এটা।
                </ListItem>
                <ListItem>
                  <code>head -n 3</code> প্রথম তিন লাইন, <code>tail -n 3</code> শেষ তিন লাইন।
                </ListItem>
                <ListItem>
                  <code>tail -f</code> শেষ লাইনগুলো দেখায়, তারপর থামে না, অপেক্ষা করে। নতুন লাইন এলেই
                  সাথে সাথে দেখায়। একটা Log এ সরাসরি চোখ রাখার জন্য। থামাতে Ctrl+C।
                </ListItem>
                <ListItem>
                  <code>wc -l</code> লাইন গোনে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "reading.txt",
          code: `deploy@island-vps-01:~$ head -n 3 /etc/passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
deploy@island-vps-01:~$ tail -n 3 /etc/passwd
deploy:x:1001:1001::/home/deploy:/bin/bash
caddy:x:999:996:Caddy web server:/var/lib/caddy:/usr/sbin/nologin
islandtours:x:997:995::/home/islandtours:/usr/sbin/nologin
deploy@island-vps-01:~$ wc -l /etc/passwd
27 /etc/passwd

# একটা Terminal এ tail -f চলছে, অন্য একটা Program সেকেন্ডে একটা করে লাইন লিখছে:
deploy@island-vps-01:~$ tail -n 5 -f /tmp/bookings.log
07:27:59 server started
07:28:00 booking request 1
07:28:01 booking request 2
07:28:02 booking request 3
^C`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>/etc/passwd</code> এর শেষ তিন লাইনে Island Tours এর তিনজনকে চিনতে পারছেন:{" "}
                <code>deploy</code>, <code>caddy</code> আর <code>islandtours</code>। শেষ দুইজনের Shell{" "}
                <code>/usr/sbin/nologin</code>, মানে এই নামে কেউ লগইন করতে পারে না। এরা মানুষ নয়, এরা
                Program চালানোর জন্য বানানো User। লেসন ০৪ এ এই পুরো লাইনটা পড়তে শিখবেন।
              </ContentParagraph>
              <ContentParagraph>
                বদলানোর জন্য Ubuntu তে আগে থেকে বসানো সবচেয়ে সহজ Editor <strong>nano</strong>।{" "}
                <code>nano notes/readme.txt</code> লিখলে File টা খোলে, সরাসরি লিখতে পারবেন। নিচে
                Shortcut গুলোর তালিকা দেখা যায়, যেখানে <code>^</code> মানে Ctrl। Ctrl+O চাপলে Save, তারপর
                Enter। Ctrl+X বেরোনো। Ctrl+W খোঁজা। Ctrl+K একটা পুরো লাইন কাটা। ব্যস, এটুকুতেই Server
                এর যেকোনো Setting বদলাতে পারবেন।
              </ContentParagraph>
              <ContentParagraph>
                <code>/etc</code> এর File বদলাতে Administrator এর ক্ষমতা লাগে, তাই{" "}
                <code>sudo nano /etc/caddy/Caddyfile</code>। কাজ শুরুর আগে একটা অভ্যাস করুন:{" "}
                <code>sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak</code>। ভুল হলে এক লাইনে
                আগের অবস্থায় ফেরা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ভুল করে vim এ ঢুকে পড়লে",
          content: (
            <p>
              অনেক Server এ, আর কিছু Command যেমন <code>git commit</code> এ, Default Editor হিসেবে{" "}
              <code>vim</code> খুলে যায়। vim শক্তিশালী, কিন্তু প্রথমবার এখান থেকে বেরোনোর রাস্তা পাওয়া
              কঠিন। বেরোতে চাইলে Esc চাপুন, তারপর লিখুন <code>:q!</code> আর Enter, কিছু Save না করে
              বেরিয়ে যাবেন। Save করে বেরোতে <code>:wq</code>। আর চিরকালের জন্য nano কে Default বানাতে
              চাইলে <code>sudo update-alternatives --config editor</code>।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "finding",
      subHeader: { index: "014", title: "Find" },
      title: <SectionTitle>খোঁজা: find, grep, আর কে জায়গা খাচ্ছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা Command দিয়ে প্রায় সব খোঁজা হয়ে যায়, আর দুইটা আলাদা প্রশ্নের উত্তর দেয়।{" "}
                <code>find</code> খোঁজে File টা কোথায়, নাম, সময়, আকার বা রকম দিয়ে।{" "}
                <code>grep</code> খোঁজে কোন File এর ভেতরে একটা লেখা আছে, আর কোন লাইনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "find.txt",
          code: `deploy@island-vps-01:~$ find /etc -name "Caddyfile"
/etc/caddy/Caddyfile
find: '/etc/credstore.encrypted': Permission denied
find: '/etc/ssl/private': Permission denied
find: '/etc/credstore': Permission denied

deploy@island-vps-01:~$ find /etc -name "Caddyfile" 2>/dev/null
/etc/caddy/Caddyfile

deploy@island-vps-01:~$ find /etc -maxdepth 1 -name "*.conf" | sort | head -4
/etc/adduser.conf
/etc/ca-certificates.conf
/etc/debconf.conf
/etc/deluser.conf

deploy@island-vps-01:~$ sudo find /var/log -name "*.log" -mmin -60
/var/log/dpkg.log
/var/log/apt/history.log
/var/log/apt/term.log
/var/log/alternatives.log
/var/log/auth.log
/var/log/kern.log`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমবার <code>find</code> উত্তরের সাথে তিনটা Permission denied দিল, কারণ{" "}
                <code>deploy</code> কিছু Folder এ ঢুকতে পারে না। দ্বিতীয়বার <code>2&gt;/dev/null</code>{" "}
                যোগ করে সেই Error গুলো আগের Section এর <code>/dev/null</code> এ ফেলে দেওয়া হলো, শুধু
                উত্তরটা রইল। <code>2</code> মানে Error এর ধারা, যার পুরো গল্প লেসন ০৭ এ।{" "}
                <code>-mmin -60</code> মানে গত ৬০ মিনিটে বদলেছে। কিছু ভাঙার পর কোন Log এ নতুন কিছু
                লেখা হয়েছে, এক লাইনে বের করার উপায় এটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "grep.txt",
          code: `deploy@island-vps-01:~$ grep -n "reverse_proxy" /etc/caddy/Caddyfile
2:	reverse_proxy 127.0.0.1:3000

deploy@island-vps-01:~$ grep -rn "PermitRootLogin" /etc/ssh/
/etc/ssh/sshd_config:42:#PermitRootLogin prohibit-password
/etc/ssh/sshd_config:90:# the setting of "PermitRootLogin prohibit-password".

deploy@island-vps-01:~$ grep -ril "islandtours" /etc 2>/dev/null
/etc/passwd
/etc/group
/etc/caddy/Caddyfile

deploy@island-vps-01:~$ grep -w "443" /etc/services
https		443/tcp				# http protocol over TLS/SSL
https		443/udp				# HTTP/3`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Option", "মানে"],
          rows: [
            [mono("grep -n"), "মিলের পাশে লাইন নম্বর"],
            [mono("grep -r"), "একটা Folder এর ভেতরের সব File এ, ভেতরের Folder সহ"],
            [mono("grep -i"), "বড় ছোট হাতের অক্ষরের তফাত না করে"],
            [mono("grep -l"), "শুধু File এর নাম, লাইন নয়"],
            [mono("grep -w"), "পুরো শব্দ মিলতে হবে, 443 খুঁজলে 4430 আসবে না"],
            [mono("find -name"), "নাম দিয়ে, * সহ চলে, তবে নামটা Quote এর ভেতরে রাখুন"],
            [mono("find -type f, -type d"), "শুধু File, বা শুধু Folder"],
            [mono("find -mmin -60, -mtime +7"), "গত ৬০ মিনিটে বদলেছে, বা ৭ দিনের বেশি পুরনো"],
            [mono("find -size +100M"), "100 MB এর চেয়ে বড়"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তৃতীয় grep টা খেয়াল করুন। <code>/etc/ssh/sshd_config</code> এ{" "}
                <code>PermitRootLogin</code> এর সামনে একটা <code>#</code>। Setting File এ{" "}
                <code>#</code> দিয়ে শুরু হওয়া লাইন হলো Comment, Program সেটা পড়ে না। মানে এটা শুধু
                Default টা দেখাচ্ছে, কেউ বদলায়নি। এই লাইন আসলে কী করে আর কীভাবে বন্ধ করতে হয়, লেসন ০৩ এ।
              </ContentParagraph>
              <ContentParagraph>
                এবার Server এর সবচেয়ে চেনা জরুরি অবস্থা: Disk ভরে গেছে। কোন Folder জায়গা খাচ্ছে, বের করে{" "}
                <code>du</code>, Disk Usage। <code>-s</code> মানে প্রতিটার মোট একটা সংখ্যা,{" "}
                <code>-h</code> মানে পড়ার মতো একক, আর <code>sort -h</code> সেগুলো ছোট থেকে বড় সাজায়,
                যাতে সবচেয়ে বড়টা একদম শেষে থাকে। তারপর বড়টার ভেতরে ঢুকে একই Command আবার, যতক্ষণ না
                অপরাধীকে পান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "du.txt",
          code: `deploy@island-vps-01:~$ sudo du -sh /var/* 2>/dev/null | sort -h
0	/var/lock
0	/var/run
4.0K	/var/local
4.0K	/var/mail
4.0K	/var/opt
8.0K	/var/backups
12K	/var/tmp
16K	/var/spool
1.8M	/var/cache
17M	/var/log
64M	/var/lib
deploy@island-vps-01:~$ sudo du -sh /var/log/* 2>/dev/null | sort -h | tail -3
100K	/var/log/dmesg
252K	/var/log/dpkg.log
17M	/var/log/journal

# একটা 200 MB এর File লুকিয়ে রাখা হলো, তারপর খুঁজে বের করা হলো:
deploy@island-vps-01:~$ fallocate -l 200M /tmp/big-upload.bin
deploy@island-vps-01:~$ sudo find / -xdev -type f -size +100M 2>/dev/null
/tmp/big-upload.bin`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "-xdev কেন",
          content: (
            <p>
              <code>find /</code> পুরো গাছ খোঁজে, আর গাছে <code>/proc</code> এর মতো জানালা আর অন্য
              Disk ও Mount করা থাকে। <code>-xdev</code> find কে বলে দেয়, যে Disk থেকে শুরু, তার সীমা পার
              হওয়া চলবে না। ফলে খোঁজা
              দ্রুত হয়, আর আপনি শুধু সেই Disk টার ভেতরে খোঁজেন যেটা ভরেছে। Disk ভরার পুরো তদন্ত, কোন
              File মুছে ফেলার পরেও জায়গা ফেরে না, আর এরকম আরও কিছু, লেসন ০৭ আর ০৮ এ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours: island-vps-01 এর পুরো মানচিত্র</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর দলে নতুন কেউ এলে প্রথম দিন তাঁকে একটা কাগজ দেওয়া হয়, যেখানে Server এর
                মানচিত্রটা আঁকা। নিয়মটা কঠিন: কোনো কিছু নিজের ইচ্ছা মতো জায়গায় রাখা যাবে না, সবকিছু FHS
                মেনে। কারণটা সোজা। রাত দুইটায় Server ঝামেলা করলে যে মানুষটা ঠিক করতে বসবেন, তিনি হয়তো
                জিনিসটা বানাননি। মানচিত্র মানলে তিনি আন্দাজ করেই সঠিক Folder এ পৌঁছে যাবেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FsTreeDiagram /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কী", "কোথায়", "কেন সেখানে"],
          rows: [
            [mono("Caddy এর Setting"), "/etc/caddy/Caddyfile", "Setting তাই /etc, আর Caddy এর Service ঠিক এটাই পড়ে"],
            [mono("API এর Secret"), "/etc/islandtours/api.env", "Setting, কিন্তু গোপন। শুধু App পড়তে পারে, লেসন ০৪ আর ০৫"],
            [mono("App এর Code"), "/srv/islandtours/releases/, current", "Server যা পরিবেশন করে তাই /srv, প্রতিটা Release আলাদা"],
            [mono("Caddy এর Log"), "/var/log/caddy/", "Log বদলাতে থাকে তাই /var/log, লেসন ০৭"],
            [mono("Certificate"), "/var/lib/caddy/", "Caddy এর নিজের Data, তাই /var/lib"],
            [mono("Container এর সবকিছু"), "/var/lib/docker/", "Docker এর নিজের Data। Docker এর Module এ"],
            [mono("রাতের Backup"), "/var/backups/islandtours/", "Backup এর জন্য রাখা জায়গা, লেসন ১০। একটা কপি বাইরেও যায়"],
            [mono("deploy এর Key"), "/home/deploy/.ssh/authorized_keys", "মানুষের নিজের জিনিস তাই /home, লেসন ০৩"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মানচিত্রের সবচেয়ে বুদ্ধিমান অংশটা <code>/srv/islandtours</code>। প্রতিটা Deploy একটা
                নতুন Folder এ যায়, যার নাম তারিখ আর সময়। পুরনোটা মোছা হয় না। আর{" "}
                <code>current</code> নামে একটা Symlink সবসময় চালু Release টাকে দেখায়। App চালানোর
                নিয়মপত্র সবসময় <code>current</code> এর ভেতর থেকে চালায়, তাই কোন Release চলবে সেটা ঠিক
                করে শুধু এই তীরটা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FsReleasesDiagram /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "releases.txt",
          code: `deploy@island-vps-01:~$ ls -l /srv/islandtours
lrwxrwxrwx 1 root root   41 Oct 31 07:25 current -> /srv/islandtours/releases/2026-10-31_0915
drwxr-xr-x 4 root root 4096 Oct 31 07:25 releases
deploy@island-vps-01:~$ readlink -f /srv/islandtours/current
/srv/islandtours/releases/2026-10-31_0915

# নতুন Deploy, বা Rollback, দুইটাই একই এক লাইন, শুধু Folder টা আলাদা:
sudo ln -sfn /srv/islandtours/releases/2026-10-29_1830 /srv/islandtours/current`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>ln -sfn</code> এর <code>-f</code> মানে আগের Link থাকলে সেটা বদলে দেওয়া হবে, আর{" "}
                <code>-n</code> মানে পুরনো Link টাকে Folder ভেবে তার ভেতরে নতুন Link বানানো হবে না। এই{" "}
                <code>-n</code> বাদ পড়ে যাওয়া Deploy Script এর একটা চেনা Bug। তীর ঘোরানোর পর App কে
                জানাতে হয় নতুন Code পড়তে, সেটা পরের লেসনের <code>systemctl restart</code>।
              </ContentParagraph>
              <ContentParagraph>
                মানচিত্রটা আপনার মাথায় কতটা বসেছে, নিচের Lab এ যাচাই করুন। প্রতিটা প্রশ্নের ভুল উত্তরগুলো
                বাস্তবে মানুষ সত্যিই দেয়, আর তাদের ব্যাখ্যা পড়াও শেখার অংশ।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FsWhereLab /> },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>অচেনা Server এ প্রথম দশ মিনিট</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর নতুন একজন সদস্যকে বলা হলো, Caddy কোন App এর দিকে Request পাঠায় আর তার Log
              কোথায়, একটু দেখে আসুন। এর বেশি কেউ তাঁকে কিছু বলেননি। তিনি যা করলেন, ঠিক সেই ক্রমে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "ঢুকে Prompt পড়লেন",
              description:
                "ssh দিয়ে ঢোকার পর Prompt দেখাল deploy@island-vps-01:~$। User deploy, যন্ত্র island-vps-01, Folder Home, আর $ মানে সাধারণ User। ঠিক Server এ এসেছেন।",
            },
            {
              title: "যন্ত্রটার পরিচয় নিলেন",
              description:
                "cat /etc/os-release বলল Ubuntu 24.04, nproc বলল 2, df -h / বলল Disk এর কতটা ভরা। কোন Distribution জানা থাকলে কোন Command চলবে তা জানা থাকে।",
            },
            {
              title: "চলমান Caddy কে খুঁজলেন",
              description:
                "pgrep -x caddy একটা PID দিল। /proc/সেই PID/cmdline বলল Caddy চলছে --config /etc/caddy/Caddyfile নিয়ে। আন্দাজ নয়, চলমান Program এর নিজের মুখের কথা।",
            },
            {
              title: "Setting টা পড়লেন",
              description:
                "cat /etc/caddy/Caddyfile। grep -n reverse_proxy দেখাল লাইন 2: সব Request যায় 127.0.0.1:3000 এ, মানে একই যন্ত্রের ভেতরের App এ। কিছু বদলাননি, শুধু পড়লেন।",
            },
            {
              title: "Program আর তার টুকরোগুলো দেখলেন",
              description:
                "which caddy বলল /usr/bin/caddy। dpkg -L caddy দেখাল Service এর নিয়মপত্র কোথায়। মানচিত্রের সাথে সব মিলে গেল: Program /usr এ, Setting /etc এ।",
            },
            {
              title: "চালু Code কোনটা",
              description:
                "ls -l /srv/islandtours দেখাল current তীরটা কোন Release কে দেখাচ্ছে। readlink -f পুরো ঠিকানা দিল। আজ সকালের Deploy টাই চলছে।",
            },
            {
              title: "Log খুঁজলেন",
              description:
                "ls /var/log/caddy, তারপর sudo tail -f /var/log/caddy/access.log। একটা Request পাঠিয়ে দেখলেন সাথে সাথে নতুন লাইন এলো। Ctrl+C দিয়ে থামালেন।",
            },
            {
              title: "জায়গার হিসাব রাখলেন",
              description:
                "sudo du -sh /var/* | sort -h। সবচেয়ে বড় /var/lib, কারণ Docker আর Database ওখানে। কোনো ঘর অস্বাভাবিক বড় নয়।",
            },
            {
              title: "যা দেখলেন, লিখে রাখলেন",
              description:
                "দলের নথিতে পাঁচ লাইন: Setting কোথায়, Code কোথায়, Log কোথায়, Backup কোথায়, আর এগুলো খুঁজে পাওয়ার Command। পরের নতুন মানুষটার দশ মিনিট লাগবে না, দুই মিনিট লাগবে।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও জানতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিচের Lab টা আগে করুন।</strong> ছয়টা ধাপে আজকের সবকিছু নিজের Linux এ একবার
                করবেন। পড়ে যা বোঝেন, হাতে করলে তা মনে থাকে।
              </ListItem>
              <ListItem>
                <strong>man hier</strong>, Linux এর নিজের লেখা Folder মানচিত্র। Terminal এ{" "}
                <code>man hier</code>, অথবা{" "}
                <a href="https://man7.org/linux/man-pages/man7/hier.7.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  man7.org/linux/man-pages/man7/hier.7.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Filesystem Hierarchy Standard 3.0</strong>, মূল নিয়মপত্র। কোনো Folder এর কাজ নিয়ে
                সন্দেহ হলে এখানে উত্তর।{" "}
                <a href="https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  refspecs.linuxfoundation.org/FHS_3.0
                </a>
              </ListItem>
              <ListItem>
                <strong>Ubuntu Server এর নথি</strong>, Package, Network, Security সবকিছুর সরকারি
                নির্দেশিকা।{" "}
                <a href="https://documentation.ubuntu.com/server/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  documentation.ubuntu.com/server
                </a>
                । কোন Version কতদিন Update পাবে:{" "}
                <a href="https://ubuntu.com/about/release-cycle" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  ubuntu.com/about/release-cycle
                </a>
              </ListItem>
              <ListItem>
                <strong>Multipass আর WSL এর নথি</strong>, অনুশীলনের Linux বসানোর সর্বশেষ Command।{" "}
                <a href="https://canonical.com/multipass/docs" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  canonical.com/multipass/docs
                </a>
                {" আর "}
                <a href="https://learn.microsoft.com/windows/wsl/install" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  learn.microsoft.com/windows/wsl/install
                </a>
              </ListItem>
              <ListItem>
                <strong>The Linux Command Line</strong>, William Shotts এর লেখা একটা পুরো বই, বিনামূল্যে।
                Shell এর ব্যাপারে এর চেয়ে ধৈর্যশীল শিক্ষক কম আছে।{" "}
                <a href="https://linuxcommand.org/tlcl.php" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  linuxcommand.org/tlcl.php
                </a>
              </ListItem>
              <ListItem>
                <strong>OverTheWire Bandit</strong>, একটা খেলা, যেখানে প্রতিটা ধাপ পার হতে হয় ঠিক আজকের
                Command গুলো দিয়ে: লুকানো File, find, grep।{" "}
                <a href="https://overthewire.org/wargames/bandit/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  overthewire.org/wargames/bandit
                </a>
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
                  Linux হলো Kernel, যে একা Hardware ছোঁয়। Kernel এর সাথে Shell, Tools, systemd আর apt
                  জুড়ে বানানো পুরো জিনিসটা Distribution। Island Tours চলে Ubuntu 24.04 LTS এ।
                </ListItem>
                <ListItem>
                  অনুশীলনের জন্য Multipass বা WSL2, আর আসল কাজের জন্য VPS: একটা বড় যন্ত্রকে Hypervisor
                  দিয়ে কাটা একটা Virtual Machine, যার ভেতরের OS আর root পুরোপুরি আপনার।
                </ListItem>
                <ListItem>
                  Prompt চারটা কথা বলে: কে, কোন যন্ত্রে, কোন Folder এ, আর $ নাকি #। বিপজ্জনক Command এর
                  আগে এটা পড়ুন।
                </ListItem>
                <ListItem>
                  pwd, ls, cd দিয়ে ঘোরাফেরা। / দিয়ে শুরু মানে Absolute Path, নইলে Relative। . এই
                  Folder, .. উপরের, ~ নিজের Home।
                </ListItem>
                <ListItem>
                  গাছ একটাই, শুরু / থেকে। Disk জোড়ে Mount দিয়ে, df -h দেখায় কোনটা কোথায় আর কতটা ভরা।
                </ListItem>
                <ListItem>
                  Program হলে /usr, Setting হলে /etc, বদলাতে থাকলে /var। নিজের App /srv এ, নিজের বানানো
                  Program /usr/local এ, অস্থায়ী /tmp এ।
                </ListItem>
                <ListItem>
                  /proc, /dev, /sys জানালা, Disk এ নেই। /proc/PID/cmdline বলে দেয় একটা Program কোন
                  Setting নিয়ে চলছে।
                </ListItem>
                <ListItem>
                  apt update তালিকা আনে, upgrade বসায়। remove Setting রাখে, purge মোছে। dpkg -L দেখায়
                  একটা Package এর টুকরো কোথায় কোথায়। Caddyfile থাকে /etc/caddy/Caddyfile এ।
                </ListItem>
                <ListItem>
                  rm এর Undo নেই। find খোঁজে File কোথায়, grep খোঁজে কোন File এ কী লেখা, আর du -sh |
                  sort -h বলে কে জায়গা খাচ্ছে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০২, Process Management & Systemd",
          content: (
            <p>
              আজ <code>/proc</code> এ একটা লাইন দেখে আমরা থেমে গিয়েছিলাম: Caddy এর <code>PPid: 1</code>।
              মানে Caddy কে আপনি চালু করেননি, Server চালু হতেই PID 1 নামের কেউ একজন তাকে জাগিয়ে দিয়েছে।
              আর Caddy কোনো কারণে মারা গেলে সেই একজনই তাকে আবার তোলে। সে কে, তার কাছে কীভাবে নিয়ম লেখা
              থাকে, আর আপনার নিজের my-tours App কে কীভাবে তার হাতে তুলে দেবেন যাতে Server Restart এর পরেও
              নিজে থেকে চালু হয়, এসব পরের লেসনে।{" "}
              <Link href="/devops/topic/process-management-systemd" className={linkClass}>
                Process Management & Systemd
              </Link>
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Kernel", "Linux এর মূল অংশ, একা Hardware ছোঁয়, বাকি সবাই তার কাছে চায়"],
      ["Distribution", "Kernel + Shell + Tools + systemd + apt, একসাথে সাজানো। যেমন Ubuntu"],
      ["Ubuntu LTS", "দুই বছর পর পর আসে, অন্তত পাঁচ বছর Security Update। Island Tours চলে 24.04 এ"],
      ["VPS", "Hypervisor দিয়ে কাটা একটা Virtual Machine, ভেতরের OS আর root আপনার"],
      ["Terminal, Shell", "Terminal জানালা, Shell (bash) সেই Program যে লাইন পড়ে আর চালায়"],
      ["Prompt", "user@host:folder$, শেষে # মানে root"],
      ["Absolute, Relative Path", "/ দিয়ে শুরু মানে গোড়া থেকে, নইলে এখন যেখানে আছেন সেখান থেকে"],
      [". .. ~", "এই Folder, এক ধাপ উপরে, নিজের Home"],
      ["Mount", "একটা Disk কে গাছের একটা Folder এ জুড়ে দেওয়া। df -h দেখায়"],
      ["/etc, /usr, /var", "Setting, Install করা Program, বদলাতে থাকা Data"],
      ["/srv, /usr/local, /tmp", "নিজের App, নিজের বসানো Program, অস্থায়ী"],
      ["/proc, /dev, /sys", "Kernel এর জানালা, Disk এ কিছু নেই"],
      ["apt update, upgrade", "তালিকা আনা, তারপর সত্যি বসানো"],
      ["apt remove, purge", "Setting রেখে সরানো, Setting সহ মোছা"],
      ["dpkg -L, dpkg -S", "Package এর সব File, একটা File কোন Package এর"],
      ["Symbolic Link", "আরেকটা Path কে দেখানো তীর। Deploy আর Rollback এর ভিত্তি"],
      ["find, grep, du", "File কোথায়, ভেতরে কী, কে কতটা জায়গা খাচ্ছে"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Ubuntu আর Linux এর সম্পর্ক নিয়ে কোন কথাটা ঠিক?",
        options: [
          {
            key: "A",
            text: "Ubuntu হলো Linux এর একটা নতুন Version",
            isCorrect: false,
            explanation: "Linux Kernel এর নিজের Version আছে, যেমন 6.8। Ubuntu তার Version নয়, তার উপর বানানো একটা পুরো ব্যবস্থা।",
          },
          {
            key: "B",
            text: "Ubuntu হলো Linux Kernel এর সাথে Shell, Tools, systemd আর apt জুড়ে বানানো একটা Distribution",
            isCorrect: true,
            explanation: "ঠিক। Kernel একা কিছু করে না। চারপাশের সবকিছু জুড়ে, পরীক্ষা করে যে প্যাকেজটা দেওয়া হয়, সেটাই Distribution।",
          },
          {
            key: "C",
            text: "Ubuntu আর Linux দুইটা আলাদা Operating System, একটার সাথে আরেকটার সম্পর্ক নেই",
            isCorrect: false,
            explanation: "Ubuntu এর ভেতরেই Linux Kernel চলে। uname -r চালালে Kernel এর Version দেখবেন।",
          },
          {
            key: "D",
            text: "Linux শুধু Server এর জন্য আর Ubuntu শুধু Desktop এর জন্য",
            isCorrect: false,
            explanation: "Ubuntu এর Server আর Desktop দুই রূপই আছে, আর Linux চলে ফোন থেকে বড় Data Center পর্যন্ত সবখানে।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা অচেনা Server এ Caddy চলছে। সে আসলে কোন Setting File নিয়ে চলছে, সবচেয়ে নির্ভরযোগ্যভাবে কীভাবে জানবেন?",
        options: [
          {
            key: "A",
            text: "নিজের Home Folder এ Caddyfile খুঁজে দেখা",
            isCorrect: false,
            explanation: "Caddy আপনার Home এর কথা জানেই না। সেখানে কিছু থাকলেও সেটা চলমান Caddy এর Setting না ও হতে পারে।",
          },
          {
            key: "B",
            text: "pgrep দিয়ে PID বের করে /proc/PID/cmdline পড়া",
            isCorrect: true,
            explanation: "ঠিক। এটা চলমান Program এর নিজের Command, যেখানে --config এর পরেই আসল Path লেখা। নথি বা আন্দাজ ভুল হতে পারে, এটা না।",
          },
          {
            key: "C",
            text: "/usr/bin/caddy File টা cat দিয়ে খুলে পড়া",
            isCorrect: false,
            explanation: "/usr/bin/caddy একটা ELF Program, পড়ার মতো Text নয়। আর Program এর ভেতরে আপনার Setting লেখা থাকে না।",
          },
          {
            key: "D",
            text: "/tmp এ খোঁজা, কারণ চলমান জিনিস সেখানে থাকে",
            isCorrect: false,
            explanation: "/tmp অস্থায়ী জিনিসের জায়গা। Setting রাখার জায়গা /etc।",
          },
        ],
      },
      {
        id: 3,
        text: "আপনি /var/log/caddy তে আছেন। cd ../../backups/islandtours চালানোর পর pwd কী দেখাবে?",
        options: [
          {
            key: "A",
            text: "/var/backups/islandtours",
            isCorrect: true,
            explanation: "ঠিক। প্রথম .. তে /var/log, দ্বিতীয় .. তে /var, তারপর backups আর islandtours।",
          },
          {
            key: "B",
            text: "/var/log/backups/islandtours",
            isCorrect: false,
            explanation: "এটা হতো একবার .. দিলে। এখানে দুইবার, তাই /var পর্যন্ত উঠতে হবে।",
          },
          {
            key: "C",
            text: "/backups/islandtours",
            isCorrect: false,
            explanation: "এটা হতো তিনবার .. দিলে, বা Path টা / দিয়ে শুরু হলে।",
          },
          {
            key: "D",
            text: "/var/log/caddy/backups/islandtours",
            isCorrect: false,
            explanation: "এটা হতো .. ছাড়া শুধু backups/islandtours লিখলে।",
          },
        ],
      },
      {
        id: 4,
        text: "sudo apt update আর sudo apt upgrade এর তফাত কী?",
        options: [
          {
            key: "A",
            text: "দুইটা একই, upgrade শুধু বেশি সময় নেয়",
            isCorrect: false,
            explanation: "একই নয়। একটা না চালিয়ে অন্যটা চালালে ফল আলাদা হয়।",
          },
          {
            key: "B",
            text: "update সব Package নতুন Version এ তোলে, upgrade Ubuntu এর পরের LTS এ নিয়ে যায়",
            isCorrect: false,
            explanation: "পরের LTS এ যাওয়ার আলাদা Tool আছে, do-release-upgrade। upgrade শুধু বসানো Package গুলো নতুন করে।",
          },
          {
            key: "C",
            text: "update শুধু কোন Package এর নতুন Version এসেছে তার তালিকা আনে, upgrade সত্যি সত্যি সেগুলো বসায়",
            isCorrect: true,
            explanation: "ঠিক। দোকানের নতুন মূল্যতালিকা আনা আর কেনাকাটা করা আলাদা কাজ। তাই আগে update, তারপর upgrade।",
          },
          {
            key: "D",
            text: "update শুধু Security এর জন্য, upgrade বাকি সবকিছুর জন্য",
            isCorrect: false,
            explanation: "Security Update ও upgrade দিয়েই বসে। update কিছুই বসায় না।",
          },
        ],
      },
      {
        id: 5,
        text: "Caddyfile এ নিজের Setting লেখার পর ভুল করে sudo apt purge caddy চালালেন। কী হলো?",
        options: [
          {
            key: "A",
            text: "শুধু Program টা গেল, Caddyfile আগের মতোই আছে",
            isCorrect: false,
            explanation: "এটা remove এর আচরণ। purge Setting ও মোছে।",
          },
          {
            key: "B",
            text: "Program আর আপনার বদলানো Caddyfile, দুইটাই মুছে গেল",
            isCorrect: true,
            explanation: "ঠিক। লেসনে ঠিক এটাই ঘটেছে, /etc/caddy Folder টাই আর নেই। এই কারণে purge এর আগে Setting এর কপি রাখা অভ্যাস।",
          },
          {
            key: "C",
            text: "কিছুই মুছল না, purge শুধু apt এর Cache পরিষ্কার করে",
            isCorrect: false,
            explanation: "Cache পরিষ্কারের Command apt clean। purge একটা Package কে তার Setting সহ সরায়।",
          },
          {
            key: "D",
            text: "Caddyfile টা নিজে থেকে /tmp এ সরে গেল, যাতে পরে ফেরত আনা যায়",
            isCorrect: false,
            explanation: "apt এরকম কোনো কপি রাখে না। Linux এ মোছা জিনিসের কোনো Recycle Bin নেই।",
          },
        ],
      },
      {
        id: 6,
        text: "/proc/meminfo File টা Disk এর কোথায় জমা থাকে?",
        options: [
          {
            key: "A",
            text: "/var/lib এর ভেতরে, Kernel প্রতি মিনিটে সেটা নতুন করে লেখে",
            isCorrect: false,
            explanation: "Disk এ এর কোনো কপি নেই। প্রতি মিনিটে লেখা হলে দেখা সংখ্যাগুলো পুরনো হতো।",
          },
          {
            key: "B",
            text: "কোথাও না। পড়ার মুহূর্তে Kernel সেটা বানিয়ে দেয়",
            isCorrect: true,
            explanation: "ঠিক। /proc একটা জানালা, যার ওপাশে Kernel এর খাতা খোলা। তাই প্রতিবার পড়লে তখনকার সংখ্যা পান।",
          },
          {
            key: "C",
            text: "/etc এ, কারণ এটা একটা Setting",
            isCorrect: false,
            explanation: "এটা Setting নয়, চলমান অবস্থার হিসাব। আর /etc এ /proc এর কিছু থাকে না।",
          },
          {
            key: "D",
            text: "Swap এ, কারণ এটা Memory নিয়ে",
            isCorrect: false,
            explanation: "Swap হলো RAM ভরে গেলে Disk এ বাড়তি জায়গা, লেসন ০৮। /proc এর সাথে এর সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "mkdir notes/2026/october চালালে No such file or directory বলছে, অথচ আপনি তো নতুন Folder ই বানাতে চাইছেন। কেন?",
        options: [
          {
            key: "A",
            text: "এই Folder এ লেখার Permission নেই",
            isCorrect: false,
            explanation: "Permission না থাকলে বার্তা হতো Permission denied।",
          },
          {
            key: "B",
            text: "মাঝের notes আর 2026 Folder দুইটা এখনো নেই, আর -p ছাড়া mkdir মাঝের Folder বানায় না",
            isCorrect: true,
            explanation: "ঠিক। mkdir -p notes/2026/october পুরো পথটা একবারে বানায়, আর আগে থেকে থাকলেও Error দেয় না।",
          },
          {
            key: "C",
            text: "october নামটা Linux এ নিষিদ্ধ",
            isCorrect: false,
            explanation: "/ আর শূন্য Byte ছাড়া প্রায় যেকোনো অক্ষর নামে চলে।",
          },
          {
            key: "D",
            text: "mkdir একবারে শুধু একটা স্তরের Folder বানাতে পারে, অন্য কোনো উপায় নেই",
            isCorrect: false,
            explanation: "উপায় আছে, -p। একটা Option না জানলে মনে হয় Tool টাই পারে না, তাই --help পড়ার অভ্যাস।",
          },
        ],
      },
      {
        id: 8,
        text: "Island Tours এর Server এ Alert এসেছে, Disk 95% ভরা। প্রথমে কোনটা চালানো সবচেয়ে কাজের?",
        options: [
          {
            key: "A",
            text: "sudo rm -rf /var/log/*",
            isCorrect: false,
            explanation: "কী মুছছেন না জেনে মোছা। জায়গা হয়তো Log খায়নি, আর সমস্যা তদন্তের প্রমাণও মুছে গেল।",
          },
          {
            key: "B",
            text: "sudo du -sh /var/* 2>/dev/null | sort -h",
            isCorrect: true,
            explanation: "ঠিক। আগে খুঁজুন কে জায়গা খাচ্ছে, তারপর সেই Folder এর ভেতরে একই Command, যতক্ষণ না আসল কারণ পান। সিদ্ধান্ত পরে।",
          },
          {
            key: "C",
            text: "sudo apt upgrade",
            isCorrect: false,
            explanation: "নতুন Package নামাতে আরও জায়গা লাগবে। ভরা Disk এ এটা উল্টো বিপদ ডাকতে পারে।",
          },
          {
            key: "D",
            text: "sudo reboot",
            isCorrect: false,
            explanation: "Restart এ /tmp হয়তো একটু খালি হবে, কিন্তু যে জিনিস জায়গা খাচ্ছে সে থেকেই যাবে, আর আপনি কিছু শিখলেন না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের Linux এ পুরো মানচিত্রটা ঘুরে দেখুন",
    subtitle: "ছয়টা ধাপ, Multipass, WSL2 বা VPS যেকোনোটায় চলবে",
    stepName: "LAB",
    steps: [
      {
        title: "একটা অনুশীলনের Linux চালু করুন",
        description:
          "Multipass দিয়ে practice নামের একটা Ubuntu 24.04 বানান আর ভেতরে ঢুকুন। Prompt টা পড়ে চারটা অংশ নিজে বলুন।",
      },
      {
        title: "গাছের উপর দিয়ে হাঁটুন",
        description:
          "pwd, ls /, cd দিয়ে /etc, /var/log আর Home এ ঘুরুন। প্রতিবার cd এর আগে মনে মনে বলুন pwd কী দেখাবে, তারপর মিলিয়ে নিন।",
      },
      {
        title: "সবকিছু File, নিজের চোখে",
        description:
          "/proc থেকে CPU, RAM আর uptime পড়ুন। cron এর PID খুঁজে তার cmdline আর PPid দেখুন। /dev/urandom থেকে কয়েকটা Byte আর /sys থেকে MTU।",
      },
      {
        title: "একটা Package বসান, টুকরোগুলো খুঁজুন",
        description:
          "tree আর caddy Install করুন। which, dpkg -L আর ls দিয়ে দেখুন কোন টুকরো কোথায় গেল। তারপর remove আর purge এর তফাত নিজে ঘটিয়ে দেখুন।",
      },
      {
        title: "my-tours এর ঘর বানান",
        description:
          "/srv/my-tours/releases, current Link, /etc/my-tours আর /var/backups/my-tours বানান। একটা নকল Deploy আর একটা Rollback করে readlink দিয়ে প্রমাণ রাখুন।",
      },
      {
        title: "খুঁজুন আর জায়গা মাপুন",
        description:
          "find আর grep দিয়ে Setting আর Log খুঁজুন। একটা বড় File লুকিয়ে রেখে du আর find দিয়ে তাকে ধরুন, তারপর মুছে দিন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-practice-linux.sh",
        language: "bash",
        code: `# আপনার Computer এ (Mac, Windows বা Linux), Multipass বসানোর পর:
multipass launch 24.04 --name practice --cpus 2 --memory 2G --disk 10G
multipass shell practice

# এখন আপনি ভেতরে। Prompt হবে ubuntu@practice:~$
whoami          # ubuntu
hostname        # practice
cat /etc/os-release | head -2
# PRETTY_NAME="Ubuntu 24.04.x LTS"
# NAME="Ubuntu"
uname -r        # Kernel এর Version, যেমন 6.8.0-xx-generic

# VPS ব্যবহার করলে: ssh root@আপনার_VPS_এর_IP, তারপর উপরের চারটা Command।`,
      },
      {
        filename: "2-walk-the-tree.sh",
        language: "bash",
        code: `pwd                       # /home/ubuntu (VPS এ root হলে /root)
ls /                      # প্রথম স্তরের ঘরগুলো
ls -la / | grep -- '->'   # bin, lib, sbin আসলে তীর
cd /etc && pwd            # /etc
ls | wc -l                # /etc এ কতগুলো জিনিস
cd /var/log && ls         # Log এর ঘর
cd ../..  && pwd          # আগে মনে মনে উত্তর দিন, তারপর দেখুন: /
cd ~      && pwd          # আবার Home এ
cd -                      # আগের জায়গা, / দেখাবে
ls -la ~                  # লুকানো .bashrc আর .profile দেখা যাচ্ছে`,
      },
      {
        filename: "3-everything-is-a-file.sh",
        language: "bash",
        code: `nproc                                   # CPU কয়টা
head -3 /proc/meminfo                   # RAM, kB তে
cat /proc/uptime                        # প্রথম সংখ্যা: কত সেকেন্ড ধরে চালু

P=$(pgrep -x cron); echo "cron এর PID: $P"
tr '\\0' ' ' < /proc/$P/cmdline; echo     # /usr/sbin/cron -f -P
grep PPid /proc/$P/status               # PPid: 1, কে চালু করেছে? পরের লেসন

echo "এটা কোথাও যাবে না" > /dev/null; echo "exit=$?"     # exit=0
head -c 8 /dev/urandom | od -An -tx1    # প্রতিবার আলাদা ৮টা Byte
grep -H . /sys/class/net/*/mtu          # Network Card এর MTU, সাধারণত 1500`,
      },
      {
        filename: "4-packages.sh",
        language: "bash",
        code: `sudo apt update
apt show tree | head -8
sudo apt install -y tree caddy

which tree caddy                  # /usr/bin/tree, /usr/bin/caddy
dpkg -L caddy | grep -v share     # Program, Setting আর Service এর নিয়মপত্র
ls -la /etc/caddy                 # Caddyfile
dpkg -S /usr/bin/ls               # coreutils: /usr/bin/ls

# remove বনাম purge, নিজের চোখে:
echo "# my change" | sudo tee -a /etc/caddy/Caddyfile
sudo apt remove -y caddy
ls -la /etc/caddy                 # Caddyfile আছে, আপনার লাইন সহ
dpkg -l caddy | tail -1           # শুরুতে rc
sudo apt purge -y caddy
ls -la /etc/caddy                 # No such file or directory`,
      },
      {
        filename: "5-my-tours-layout.sh",
        language: "bash",
        code: `sudo mkdir -p /srv/my-tours/releases/2026-11-01_1000 /etc/my-tours /var/backups/my-tours
sudo ln -sfn /srv/my-tours/releases/2026-11-01_1000 /srv/my-tours/current
tree /srv/my-tours
# /srv/my-tours
# ├── current -> /srv/my-tours/releases/2026-11-01_1000
# └── releases
#     └── 2026-11-01_1000

# নকল Deploy: নতুন Release, তীর ঘোরানো
sudo mkdir -p /srv/my-tours/releases/2026-11-02_1400
sudo ln -sfn /srv/my-tours/releases/2026-11-02_1400 /srv/my-tours/current
readlink -f /srv/my-tours/current        # .../2026-11-02_1400

# নকল Rollback: তীর আগের জায়গায়
sudo ln -sfn /srv/my-tours/releases/2026-11-01_1000 /srv/my-tours/current
readlink -f /srv/my-tours/current        # .../2026-11-01_1000

cd /srv/my-tours/current && pwd && pwd -P   # Link এর নাম, তারপর আসল ঠিকানা`,
      },
      {
        filename: "6-find-and-space.sh",
        language: "bash",
        code: `find /etc -maxdepth 1 -name "*.conf" | sort | head
find /etc -name "sshd_config" 2>/dev/null          # /etc/ssh/sshd_config
grep -rn "PermitRootLogin" /etc/ssh/ 2>/dev/null    # # দিয়ে শুরু মানে Comment
sudo find /var/log -name "*.log" -mmin -60          # গত এক ঘণ্টায় কে বদলেছে

df -h /                                             # Disk কতটা ভরা
sudo du -sh /var/* 2>/dev/null | sort -h            # কোন ঘর কতটা নিচ্ছে

# একটা বড় File লুকিয়ে রাখুন, তারপর ধরুন:
fallocate -l 200M /tmp/big-upload.bin
df -h /                                             # Used প্রায় 200M বাড়ল
sudo find / -xdev -type f -size +100M 2>/dev/null   # /tmp/big-upload.bin
rm /tmp/big-upload.bin
df -h /                                             # জায়গা ফিরে এলো`,
      },
    ],
    tip: "ধাপ ২ এ প্রতিটা cd এর আগে উত্তরটা মুখে বলার নিয়মটা বাদ দেবেন না। Relative Path এর হিসাব মাথায় বসানোর এর চেয়ে ভালো উপায় নেই, আর যেদিন Production এ একটা rm চালাবেন, সেদিন এই হিসাবটাই আপনাকে বাঁচাবে। ধাপ ৪ এর remove আর purge এর পরীক্ষাটাও একবার নিজের হাতে করুন। একটা Setting হারানোর অভিজ্ঞতা অনুশীলনের যন্ত্রে হওয়াই ভালো, আসল Server এ নয়।",
  },
  assignment: {
    title: "Mini Project: নিজের Server এর মানচিত্র আর my-tours এর ঘর",
    time: "৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>যন্ত্রটার পরিচয়পত্র:</strong> নিজের অনুশীলনের Linux চালু করুন। তারপর Command চালিয়ে
        একটা পাতায় লিখুন: Distribution আর Version, Kernel এর Version, CPU কয়টা, মোট RAM, Disk কত বড় আর
        কতটা ভরা, Hostname, আর আপনি কোন User। প্রতিটা উত্তরের পাশে যে Command দিয়ে পেয়েছেন সেটা।
      </span>,
      <span key="2">
        <strong>নিজের হাতে মানচিত্র:</strong> কাগজে বা যেকোনো Tool এ নিজের Server এর গাছটা আঁকুন, অন্তত
        বারোটা Path সহ। Caddy বসিয়ে তার Program, Setting, Service এর নিয়মপত্র, Data আর Log এর জায়গা চিহ্নিত
        করুন। প্রতিটা Path এর পাশে এক লাইনে লিখুন সেটা কেন ঠিক ওই ঘরে।
      </span>,
      <span key="3">
        <strong>my-tours এর ঘর, Deploy আর Rollback:</strong> Lab এর ধাপ ৫ এর মতো{" "}
        <code>/srv/my-tours</code>, <code>/etc/my-tours</code> আর <code>/var/backups/my-tours</code>{" "}
        বানান। দুইটা নকল Deploy আর একটা Rollback করুন, প্রতিবার <code>readlink -f</code> এর ফল সহ।
        তারপর ইচ্ছা করে <code>-n</code> ছাড়া <code>ln -sf</code> দিয়ে তীর ঘোরানোর চেষ্টা করুন, আর
        দেখান Link টা কোথায় তৈরি হলো আর কেন।
      </span>,
      <span key="4">
        <strong>Package গোয়েন্দা:</strong> <code>caddy</code>, <code>openssh-server</code> আর{" "}
        <code>cron</code>, এই তিনটার প্রত্যেকটার জন্য শুধু <code>which</code>, <code>dpkg -L</code>,{" "}
        <code>find</code>, <code>grep</code> আর <code>/proc</code> ব্যবহার করে একটা টেবিল বানান: Program
        কোথায়, Setting কোথায়, Service এর নিয়মপত্র কোথায়, Log কোথায় যায়, আর এখন চলছে কি না।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> আপনার এক বন্ধু সারাজীবন Windows ব্যবহার করেছেন,
        আজ প্রথম একটা Server এ ঢুকেছেন। তাঁকে বোঝান কেন এখানে C: Drive নেই, Setting, Program আর Log
        কোন তিন ঘরে থাকে আর কেন, আর তিনি যদি এমন একটা Server এ যান যেটা আগে কখনো দেখেননি, Caddyfile কোথায়
        আছে কোন তিনটা ধাপে নিজে খুঁজে বের করবেন।
      </span>,
    ],
    deliverables: [
      <span key="1">যন্ত্রের পরিচয়পত্র, প্রতিটা তথ্যের পাশে Command</span>,
      <span key="2">বারো Path এর মানচিত্র, প্রতিটার এক লাইনের কারণ সহ</span>,
      <span key="3">Deploy, Rollback আর ভুল ln এর Terminal Output, ব্যাখ্যা সহ</span>,
      <span key="4">তিন Package এর গোয়েন্দা টেবিল</span>,
      <span key="5">বন্ধুর জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
