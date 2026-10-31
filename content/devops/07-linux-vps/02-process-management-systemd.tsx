/**
 * What: Module 07 Lesson 02, Process Management and systemd. It teaches what a process is on a
 * Linux server (PID, PPID, the tree, states, jobs, signals, exit codes), then hands the reader's
 * my-tours API to systemd as a real service: the unit file line by line, systemctl, reading
 * status, graceful stop, crash restarts and start limits, and the boot chain that brings the app
 * back after a reboot.
 *
 * Why: Module 06 ended with a promise to say who starts the app when the server boots. This
 * lesson answers it, and it does so with output captured on an Ubuntu 24.04 practice server
 * (systemd 255), so every status line, exit code and journal line the reader meets here is one
 * they will meet on their own VPS.
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
  RestartLoopLab,
  SignalLab,
  StopTimelineLab,
  UnitFileLab,
} from "../../../components/course/topics/linux/systemd-animations";
import {
  BootChainDiagram,
  CaretakerSplit,
  ProcessStatesDiagram,
  ProcessTreeDiagram,
  StopTimelineDiagram,
  UnitLocationsDiagram,
} from "../../../components/course/topics/linux/systemd-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const linkClass = "text-primary underline underline-offset-4";

export const processManagementSystemdContent: TopicData = {
  id: "process-management-systemd",
  introduction: {
    badge: "MODULE 07 · LESSON 02",
    title: <SectionTitle>App টা চলছে, কিন্তু কে তাকে দেখে রাখছে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আপনি প্রথমবার নিজের VPS এ my-tours বসালেন। SSH দিয়ে ঢুকলেন, Folder এ গেলেন,
          লিখলেন <code>node server.mjs</code>। Terminal এ লেখা এলো, Server চালু। Browser এ
          খুলে দেখলেন, সব ঠিক। খুশি মনে Laptop বন্ধ করলেন। পাঁচ মিনিট পরে বন্ধু ফোন করে
          বললেন, সাইট তো খুলছে না।
        </ContentParagraph>
        <ContentParagraph>
          পরদিন একটু চালাকি করলেন: <code>nohup node server.mjs &amp;</code>। এবার Laptop বন্ধ
          করলেও App বেঁচে রইল। তিন দিন সব ভালো। চতুর্থ রাতে একটা অদ্ভুত Request এ App
          Crash করল, আর সকাল পর্যন্ত কেউ টের পেল না। তারপর এক সোমবার VPS Provider
          রক্ষণাবেক্ষণের জন্য Server Reboot দিলেন। Server উঠে এলো, কিন্তু App উঠল না,
          কারণ App কে চালু করার কথা কেউ জানত না।
        </ContentParagraph>
        <ContentParagraph>
          Module 06 এর শেষে একটা প্রশ্ন রাখা ছিল: Server চালু হলে App কে কে চালু করে দেয়?
          এই লেসন সেই প্রশ্নের পুরো উত্তর। প্রথম অর্ধেকে আপনি Process কে নিজের চোখে
          চিনবেন: তার নম্বর, তার বাবা, তার অবস্থা, তাকে Signal পাঠানো আর তার শেষ Exit Code।
          দ্বিতীয় অর্ধেকে my-tours কে তুলে দেবেন systemd এর হাতে, যে Linux এর প্রথম Process
          আর সব Service এর অভিভাবক। শেষে আপনার App Crash করলে নিজে উঠে আসবে, Deploy এর
          সময় ভদ্রভাবে থামবে, আর Reboot এর পর কাউকে কিছু বলতে হবে না।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "দোকানের কর্মচারী অসুস্থ হলে ম্যানেজার আরেকজনকে বসান, সকালে দোকান খোলার সময় নিজে এসে তালা খোলেন, আর বন্ধের সময় খেয়াল রাখেন শেষ খদ্দেরের হিসাবটা যেন মিটে যায়। আপনার Server এ সেই ম্যানেজারের নাম systemd।",
      author: "systemd",
      role: "Lesson 02",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-processes",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>App চালানো আর App চালু রাখা এক জিনিস নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 01 এ একটা ছবি দেখেছিলেন: Program হলো রান্নার বই, আর Process হলো চুলায়
                বসানো হাঁড়ি। <code>server.mjs</code> একটা ফাইল, Disk এ চুপচাপ পড়ে থাকে। আপনি
                যখন <code>node server.mjs</code> লেখেন, Kernel সেই বই দেখে একটা হাঁড়ি চুলায়
                বসায়: Memory দেয়, একটা নম্বর দেয়, CPU তে সময় দেয়। সেই চলন্ত জিনিসটাই
                Process। ফাইলটা একটা, কিন্তু একই ফাইল থেকে একসাথে দশটা Process চলতে পারে। পুরো
                গল্পটা{" "}
                <Link href="/devops/topic/how-a-program-runs" className={linkClass}>
                  How a Program Runs
                </Link>{" "}
                লেসনে আছে।
              </ContentParagraph>
              <ContentParagraph>
                নিজের Laptop এ Process নিয়ে কেউ মাথা ঘামায় না। Terminal খোলা থাকলে App চলে,
                বন্ধ করলে থামে, আর সেটাই আপনি চান। Server এ নিয়মটা উল্টো। সেখানে App কে চলতে
                হবে আপনি না থাকলেও: রাতে, ছুটির দিনে, আপনার Laptop বন্ধ থাকলে, Server Reboot
                হলে, App নিজে একবার পড়ে গেলেও। তাই Server এ দুইটা প্রশ্ন আলাদা। প্রথমটা হলো
                App টা চালাব কীভাবে, যেটা সহজ। দ্বিতীয়টা হলো App টা চালু রাখবে কে, আর এই
                প্রশ্নের উত্তরই এই লেসন।
              </ContentParagraph>
              <ContentParagraph>লেসনটা দুই ভাগে চলবে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রথম ভাগ, Process কে চেনা।</strong> PID আর PPID, Process এর গাছ,
                  STAT কলামের অক্ষরগুলো, Zombie আর Orphan, Background Job, SSH কেটে গেলে কী হয়,
                  Signal আর Exit Code। এগুলো না জানলে systemd এর প্রতিটা লাইন মুখস্থ জাদুমন্ত্র
                  মনে হবে।
                </ListItem>
                <ListItem>
                  <strong>দ্বিতীয় ভাগ, Process কে systemd এর হাতে তুলে দেওয়া।</strong> Unit
                  ফাইল কী আর কোথায় থাকে, my-tours এর জন্য একটা লেখা, systemctl দিয়ে চালানো আর
                  থামানো, status পড়া, ভদ্রভাবে থামানো, Crash হলে আবার চালু, Crash Loop থামানো,
                  আর Boot এর পর কে কাকে চালু করে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এই লেসনের জন্য systemd সহ একটা Linux লাগবে",
          content: (
            <p>
              লেসন ০১ এ Practice এর জন্য Linux পাওয়ার কয়েকটা পথ দেখেছেন। এই লেসনের জন্য
              Multipass এর একটা Ubuntu VM বা সত্যিকারের একটা VPS নিন। সাধারণ একটা Docker
              Container এ চলবে না, কারণ Container সাধারণত systemd ছাড়াই চলে, আর systemctl
              লিখলে বলবে System has not been booted with systemd। এই লেসনের প্রতিটা Output
              নেওয়া হয়েছে Ubuntu 24.04 LTS চলা একটা Practice Server থেকে, যার নাম
              island-vps-01 আর systemd এর Version 255। আপনার PID, সময় আর Memory এর সংখ্যা
              আলাদা হবে, কিন্তু চেহারা আর শব্দগুলো এগুলোই থাকবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "pid-tree",
      subHeader: { index: "002", title: "PID and the Tree" },
      title: <SectionTitle>PID, PPID, আর একটা গাছ যার গোড়ায় PID 1</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Kernel প্রতিটা Process কে একটা নম্বর দেয়, যাকে বলে PID, Process ID। নম্বরটা
                শুধু ওই Process এর জীবনকালের জন্য। Process শেষ হলে নম্বরটা খালি হয়, পরে আরেকজন
                পেতে পারে। তাই গতকালের PID 441 আর আজকের PID 441 একই Process নয়।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা Process কে কেউ না কেউ জন্ম দিয়েছে। Shell এ আপনি একটা কমান্ড লিখলে Shell
                নিজের একটা কপি বানায়, আর সেই কপি আপনার Program হয়ে যায় (Module 01 এর fork আর
                exec)। যে জন্ম দিল সে বাবা, তার নম্বর PPID, Parent PID। সবচেয়ে কাজের প্রথম
                কমান্ডটা হলো নিজের Shell এর নম্বর দেখা। <code>$$</code> মানে এই Shell এর PID,
                আর <code>$PPID</code> মানে তার বাবার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ echo "my shell PID: $$"; echo "its parent: $PPID"
my shell PID: 708
its parent: 707

deploy@island-vps-01:~$ ps -o pid,ppid,user,stat,cmd -p $$,$PPID
    PID    PPID USER     STAT CMD
    707     696 deploy   S    sshd: deploy@pts/0
    708     707 deploy   Ss   -bash`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনার bash এর বাবা একটা sshd, মানে SSH Server এর একটা অংশ, যে আপনার Connection
                টা সামলাচ্ছে। <code>-bash</code> এর সামনের ছোট্ট দাগটা Login Shell এর চিহ্ন, মানে
                এই Shell টা Login এর সময় জন্মেছে, আর সে Login এর Setting ফাইলগুলো পড়েছে (লেসন ০৫
                এ এর গুরুত্ব বুঝবেন)। sshd এর বাবা কে? এভাবে উপরে উঠতে থাকলে শেষে সবাই একজনের
                কাছে পৌঁছায়। পুরো গাছ একসাথে দেখতে <code>ps -ef --forest</code> বা{" "}
                <code>pstree -p</code>। নিচের Output টা নেওয়া হয়েছে এই লেসনের মাঝামাঝি my-tours
                Service বসানোর পরে, তাই গাছে একটা node ও আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ ps -efww --forest
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 07:29 ?        00:00:02 /sbin/init
root          24       1  0 07:29 ?        00:00:00 /usr/lib/systemd/systemd-journald
root          73       1  0 07:29 ?        00:00:00 /usr/sbin/cron -f -P
message+      74       1  0 07:29 ?        00:00:00 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
syslog        81       1  0 07:29 ?        00:00:00 /usr/sbin/rsyslogd -n -iNONE
root         127       1  0 07:29 ?        00:00:00 sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups
root         696     127  5 07:46 ?        00:00:00  \\_ sshd: deploy [priv]
deploy       707     696  0 07:46 ?        00:00:00      \\_ sshd: deploy@pts/0
deploy       708     707 41 07:46 pts/0    00:00:00          \\_ -bash
deploy       717     708  0 07:46 pts/0    00:00:00              \\_ ps -efww --forest
mytours      609       1  0 07:36 ?        00:00:00 /usr/bin/node /srv/my-tours/server.mjs

deploy@island-vps-01:~$ pstree -pA
systemd(1)-+-cron(73)
           |-dbus-daemon(74)
           |-node(609)-+-{node}(610)
           |           |-{node}(611)
           |           |-{node}(612)
           |           |-{node}(613)
           |           |-{node}(614)
           |           |-{node}(615)
           |           |-{node}(616)
           |           |-{node}(617)
           |           |-{node}(618)
           |           \`-{node}(619)
           |-rsyslogd(81)-+-{rsyslogd}(85)
           |              |-{rsyslogd}(86)
           |              \`-{rsyslogd}(87)
           |-sshd(127)---sshd(696)---sshd(707)---bash(708)---pstree(718)
           \`-systemd-journal(24)

# Practice Server টা একটা Container এ চলে। সেখানে SSH Client এর দুইটা লাইন ছিল, যেগুলো
# একটা আসল VPS এ থাকে না (সেটা আপনার Laptop এর Process), তাই বাদ দেওয়া হয়েছে।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                গাছের গোড়ায় PID 1। <code>ps</code> তাকে দেখায় <code>/sbin/init</code> নামে,
                আর <code>pstree</code> দেখায় আসল নামে, <code>systemd</code>। Ubuntu তে{" "}
                <code>/sbin/init</code> আসলে systemd এর দিকে একটা Symlink। Kernel Boot হয়ে প্রথম
                যে Process চালায়, সে এটাই, তাই তার নম্বর ১। বাকি সব Process তার বংশধর। কোনো
                Process এর বাবা মরে গেলে Kernel সেই এতিম Process কে PID 1 এর কোলে তুলে দেয়, যাকে
                বলে Orphan। একটু পরে নিজের চোখে দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                <code>{"{node}(610)"}</code> বা <code>{"{rsyslogd}(85)"}</code> এর মতো বাঁকা
                বন্ধনীর ভেতরের নামগুলো আলাদা Process নয়, একই Process এর Thread। Module 01 এর
                Process vs Thread লেসনের সেই রান্নাঘর আর কয়েকজন রাঁধুনি। একটা ছোট node এর ভেতরেও
                দশটা Thread, কেন, সেটা Module 08 এর প্রথম লেসনে। আর খেয়াল করুন node এর বাবা
                সরাসরি PID 1, কোনো Shell নয়। কারণটা এই লেসনের দ্বিতীয় ভাগ।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProcessTreeDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিদিনের কাজে সবচেয়ে বেশি লিখবেন <code>ps aux</code>। এটা সব User এর সব
                Process দেখায়, BSD ধাঁচের কলামে। Memory অনুযায়ী সাজিয়ে প্রথম কয়েকটা দেখলে এক
                নজরে বোঝা যায় কে সবচেয়ে বেশি জায়গা খাচ্ছে। নিচের Output টা my-tours Service
                চালু হওয়ার পরে নেওয়া, যেটা আপনি এই লেসনের মাঝামাঝি বানাবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ ps aux --sort=-%mem | head -5
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
mytours      609  0.0  0.7 606616 46712 ?        Ssl  07:36   0:00 /usr/bin/node /srv/my-tours/server.mjs
root          24  0.0  0.2  66588 14984 ?        S<s  07:29   0:00 /usr/lib/systemd/systemd-journald
root           1  0.2  0.1  21140 11864 ?        Ss   07:29   0:02 /sbin/init
root         637  7.1  0.1  13944  7952 ?        Ss   07:46   0:00 sshd: deploy [priv]

# শুধু node নামের Process গুলো, নিজের পছন্দের কলাম সহ
deploy@island-vps-01:~$ ps -o pid,ppid,user,stat,etime,cmd -C node
    PID    PPID USER     STAT     ELAPSED CMD
    609       1 mytours  Ssl        09:32 /usr/bin/node /srv/my-tours/server.mjs

# নাম দিয়ে শুধু PID খোঁজা
deploy@island-vps-01:~$ pgrep -a node
609 /usr/bin/node /srv/my-tours/server.mjs`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কলাম", "মানে", "কখন কাজে লাগে"],
          rows: [
            [<code key="u">USER</code>, "Process টা কোন User হয়ে চলছে", "App কি root হয়ে চলছে? চললে বিপদ, লেসন ০৪"],
            [<code key="p">PID</code>, "Process এর নম্বর", "kill আর systemctl এর সাথে মেলাতে"],
            [<code key="c">%CPU</code>, "জীবনকালের গড় CPU ব্যবহার, এই মুহূর্তের নয়", "এই মুহূর্তেরটা দেখতে top, লেসন ০৮"],
            [<code key="m">%MEM</code>, "মোট RAM এর কত ভাগ RSS", "কে Memory খাচ্ছে, এক নজরে"],
            [<code key="v">VSZ</code>, "Process যত Memory র ঠিকানা দাবি করেছে, KB তে", "প্রায়ই বিশাল দেখায়, ঘাবড়াবেন না"],
            [<code key="r">RSS</code>, "আসলে RAM এ যতটা বসে আছে, KB তে", "আসল Memory খরচ, এটাই দেখবেন"],
            [<code key="t">TTY</code>, "কোন Terminal এর সাথে বাঁধা। ? মানে কোনোটার সাথে নয়", "Service এর TTY সবসময় ?"],
            [<code key="s">STAT</code>, "Process এর অবস্থা, পরের Section এ", "Z বা D জমছে কি না"],
            [<code key="st">START</code>, "কখন শুরু হয়েছিল", "App কি এইমাত্র Restart হয়েছে?"],
            [<code key="ti">TIME</code>, "এ পর্যন্ত মোট কত CPU সময় খেয়েছে", "কে চুপচাপ CPU খাচ্ছে"],
            [<code key="cm">COMMAND</code>, "পুরো কমান্ড, Argument সহ", "কোন ফাইল থেকে চলছে, কোন node"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সব কিছু /proc এ লেখা আছে",
          content: (
            <p>
              ps এই সব তথ্য বানিয়ে বলে না, পড়ে আনে <code>/proc/PID/</code> Folder থেকে, যেটা
              Kernel প্রতিটা Process এর জন্য বানিয়ে রাখে (লেসন ০১ এ /proc এর কথা পড়েছেন)।{" "}
              <code>grep State /proc/609/status</code> লিখলে দেখবেন{" "}
              <code>State: S (sleeping)</code>। আর <code>sudo readlink /proc/609/cwd</code>{" "}
              দেখায় App কোন Folder এ দাঁড়িয়ে আছে, <code>/srv/my-tours</code>। একটা মজার জিনিস:
              deploy হয়ে mytours এর Process এর <code>/proc/609/exe</code> পড়তে চাইলে আসে
              cannot read symbolic link, Permission denied, আর sudo দিয়ে পড়লে আসে{" "}
              <code>/usr/bin/node</code>। অন্য User এর Process এর ভেতরের খবর সবার জন্য খোলা
              নয়, লেসন ০৪ এ এর কারণ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "states",
      subHeader: { index: "003", title: "Process States" },
      title: <SectionTitle>R, S, D, T, Z: STAT কলামের অক্ষরগুলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                STAT কলামের প্রথম অক্ষর বলে Process এখন কী করছে। মনে রাখার মতো পাঁচটা অক্ষর
                আছে, আর অবাক করা কথা হলো একটা সুস্থ Server এ প্রায় সব Process বেশিরভাগ সময় S
                অবস্থায় থাকে, মানে ঘুমিয়ে। একটা Web Server এর কাজই হলো Request এর অপেক্ষা করা,
                আর অপেক্ষা মানে ঘুম। Request এলে Kernel তাকে জাগায়, কয়েক মিলিসেকেন্ড R, তারপর
                আবার S।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProcessStatesDiagram /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["অক্ষর", "নাম", "মানে", "কখন চিন্তা করবেন"],
          rows: [
            [<code key="r">R</code>, "Running", "CPU তে চলছে, বা CPU পাওয়ার লাইনে দাঁড়িয়ে", "অনেকগুলো R অনেকক্ষণ মানে CPU কম পড়ছে"],
            [<code key="s">S</code>, "Sleeping", "কিছুর অপেক্ষায় ঘুম: Network, Timer, Input। Signal পেলে জাগে", "কখনো না, এটাই স্বাভাবিক"],
            [<code key="d">D</code>, "Uninterruptible", "Disk বা Network Storage এর উত্তরের অপেক্ষা, Signal দিয়েও জাগানো যায় না", "অনেকক্ষণ D মানে Disk ধীর বা আটকে, লেসন ০৮"],
            [<code key="t">T</code>, "Stopped", "কেউ থামিয়ে রেখেছে, Ctrl+Z বা SIGSTOP দিয়ে", "Server এ ভুলে থামিয়ে রাখা Job"],
            [<code key="z">Z</code>, "Zombie", "মরে গেছে, কিন্তু বাবা এখনো Exit Code পড়েনি", "জমতে থাকলে বাবার Code এ Bug"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম অক্ষরের পরে আরও কিছু অক্ষর থাকে, সেগুলো বাড়তি খবর। উপরের Output এ node
                এর STAT ছিল <code>Ssl</code>: S মানে ঘুমিয়ে, s মানে সে একটা Session এর প্রধান,
                আর l মানে তার ভেতরে কয়েকটা Thread। bash এর <code>Ss+</code> এ{" "}
                <code>+</code> মানে Terminal এর সামনের সারির Process। journald এর{" "}
                <code>S&lt;s</code> এ <code>&lt;</code> মানে সাধারণের চেয়ে বেশি অগ্রাধিকার, আর N
                দেখলে বুঝবেন কম অগ্রাধিকার।
              </ContentParagraph>
              <ContentParagraph>
                Zombie নামটা ভয়ের, কিন্তু জিনিসটা সরল। একটা Process মরে গেলে Kernel তার Memory
                সাথে সাথে ফেরত নেয়, কিন্তু একটা ছোট চিরকুট রেখে দেয়: কে ছিল, কোন Exit Code দিয়ে
                গেল। বাবা যখন <code>wait</code> দিয়ে খবরটা পড়ে নেয়, চিরকুটও মুছে যায়। বাবা যদি
                কখনো না পড়ে, চিরকুটটা থেকে যায়, সেটাই Zombie। নিচে একটা Python Program ইচ্ছা
                করে ঠিক এই ভুলটা করছে: একটা সন্তান বানাল, সন্তান সাথে সাথে মরল, আর বাবা খবর না
                নিয়ে ঘুমাতে গেল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ python3 -c "import os,time
pid=os.fork()
if pid==0: os._exit(3)
time.sleep(60)" &

deploy@island-vps-01:~$ ps -o pid,ppid,stat,cmd --ppid $! -p $!
    PID    PPID STAT CMD
    318     316 S+   python3 -c import os,time pid=os.fork() if pid==0: os._exit
    320     318 Z+   [python3] <defunct>

# বাবাকে থামিয়ে দিন। সন্তান এতিম হলো, PID 1 তাকে কোলে নিয়ে চিরকুটটা পড়ে ফেলল।
deploy@island-vps-01:~$ kill $!
deploy@island-vps-01:~$ echo "zombies left: $(ps -eo stat | grep -c ^Z)"
zombies left: 0`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Zombie কে kill করা যায় না",
          content: (
            <p>
              Zombie আগেই মৃত, তাই তাকে SIGKILL পাঠালেও কিছু হয় না। দুইটা চিরকুট কোনো ক্ষতি
              করে না। ক্ষতি হয় যখন একটা বাবা Process হাজার হাজার সন্তান বানায় আর কারো খবর নেয়
              না, তখন PID এর তালিকা ভরে যায়। সমাধান সবসময় বাবার দিকে: তার Code ঠিক করা, নয়তো
              বাবাকে থামানো, যাতে PID 1 এতিমদের দায়িত্ব নিয়ে চিরকুটগুলো মুছে দেয়। ঠিক উপরের
              Output এ যা ঘটল।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "jobs",
      subHeader: { index: "004", title: "Jobs and Hangup" },
      title: <SectionTitle>&amp;, Ctrl+Z, jobs, আর SSH কেটে গেলে কী হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Shell এ একটা কমান্ড লিখলে সেটা সামনের সারিতে, মানে Foreground এ চলে: শেষ না হওয়া
                পর্যন্ত আপনি নতুন কিছু লিখতে পারেন না। কমান্ডের শেষে <code>&amp;</code> দিলে
                সেটা পেছনের সারিতে, Background এ যায়, আর Shell সাথে সাথে আপনাকে নতুন লাইন দেয়।
                Shell এই Background কাজগুলোর একটা তালিকা রাখে, নাম Job। নিজের Shell এ এগুলো
                নিয়ে খেলতে পারেন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>jobs -l</code> তালিকা দেখায়, Job নম্বর আর PID সহ।
                </ListItem>
                <ListItem>
                  চলন্ত Foreground কমান্ডে <code>Ctrl+Z</code> চাপলে সেটা থেমে যায়, অবস্থা T।
                </ListItem>
                <ListItem>
                  <code>bg %1</code> থেমে থাকা Job 1 কে Background এ আবার চালায়।{" "}
                  <code>fg %1</code> তাকে সামনের সারিতে ফিরিয়ে আনে।
                </ListItem>
                <ListItem>
                  <code>kill %1</code> মানে Job 1 এর Process কে SIGTERM।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ sleep 600 &
deploy@island-vps-01:~$ sleep 700 &
deploy@island-vps-01:~$ jobs -l
[1]-   225 Running                 sleep 600 &
[2]+   226 Running                 sleep 700 &

# Ctrl+Z যা করে, এখানে সেটা Signal দিয়ে করা: Job 1 কে থামানো
deploy@island-vps-01:~$ kill -STOP %1
[1]+  Stopped                 sleep 600

deploy@island-vps-01:~$ ps -o pid,ppid,stat,cmd --ppid $$
    PID    PPID STAT CMD
    225     223 T    sleep 600
    226     223 S    sleep 700

deploy@island-vps-01:~$ kill -CONT %1; kill %1 %2
[1]+  Terminated              sleep 600
[2]-  Terminated              sleep 700`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আসল প্রশ্ন, যেটা ভূমিকার গল্পে আপনাকে কাবু করেছিল। SSH Connection কেটে গেলে
                Background Job এর কী হয়? Practice Server এ একটা পরীক্ষা চালানো হলো। SSH দিয়ে
                ঢুকে দুইটা কমান্ড দেওয়া হলো, একটা সাধারণ <code>&amp;</code> দিয়ে, আরেকটা{" "}
                <code>nohup</code> দিয়ে। তারপর Connection টা মাঝপথে কেটে দেওয়া হলো, যেমন Laptop
                বন্ধ করলে বা Wi-Fi চলে গেলে হয়। এরপর আরেকটা Session থেকে deploy এর সব Process
                দেখা হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `# প্রথম Session এ, তারপর Connection কেটে দেওয়া হলো
sleep 901 &
nohup sleep 902 > /dev/null 2>&1 &

# দ্বিতীয় Session থেকে দেখা
deploy@island-vps-01:~$ ps -o pid,ppid,stat,cmd -u deploy
    PID    PPID STAT CMD
    261       1 S    sleep 902`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>sleep 901</code> নেই, মরে গেছে। Connection কাটলে Terminal টা চলে যায়, আর
                Kernel সেই Terminal এর Session এর Process গুলোকে SIGHUP পাঠায়, Hangup, মানে
                ফোন রেখে দেওয়া। SIGHUP এর Default নিয়ম হলো মরে যাওয়া। <code>nohup</code> এর
                কাজ শুধু একটা: Process কে SIGHUP উপেক্ষা করতে শেখানো। তাই <code>sleep 902</code>{" "}
                বেঁচে গেছে। তার বাবা bash মরে গেছে, তাই PPID এখন ১। উপরে যে Orphan এর কথা
                বলেছিলাম, এই সেই।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে কি nohup দিয়েই সমস্যার সমাধান? না। nohup শুধু একটা বিপদ থেকে বাঁচায়,
                SSH কেটে যাওয়া। App Crash করলে কেউ আবার চালু করে না। Server Reboot হলে কেউ চালু
                করে না। App চলে আপনার নিজের User হয়ে। Log যায় <code>nohup.out</code> নামের একটা
                ফাইলে যেটা কেউ ঘোরায় না, ভরতে থাকে। আর থামাতে হলে আপনাকে PID খুঁজে বের করতে হয়।
                tmux বা screen এর মতো যন্ত্রও একই দলের: একটা লম্বা Database Migration চালানোর
                জন্য দারুণ, যাতে SSH কাটলেও কাজ না থামে, কিন্তু একটা Service চালানোর জায়গা নয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "signals",
      subHeader: { index: "005", title: "Signals and Exit Codes" },
      title: <SectionTitle>Signal পাঠানো, আর ফেরত আসা সংখ্যাটা পড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা চলন্ত Process কে বাইরে থেকে কিছু বলার উপায় একটাই, Signal। Signal হলো একটা
                ছোট নম্বরওয়ালা খবর, যা Kernel Process এর হাতে দেয়। Module 01 এ Ctrl+C এর
                পেছনের SIGINT দেখেছেন, আর Module 05 এর Connection Close লেসনে দেখেছেন Server
                থামানোর সময় SIGTERM কীভাবে একটা বুকিং বাঁচায়। এখন পুরো ছবিটা।
              </ContentParagraph>
              <ContentParagraph>
                Signal পাঠানোর কমান্ডের নাম <code>kill</code>, যদিও সে সবসময় মারে না। নাম দেখে
                ভুল বুঝবেন না: <code>kill</code> মানে Signal পাঠানো, আর কোন Signal সেটা আপনি বলে
                দেন। কিছু না বললে যায় SIGTERM।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ kill -l | head -3
 1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP
 6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM

kill 441            # SIGTERM, ভদ্র অনুরোধ
kill -TERM 441      # একই কথা, নাম দিয়ে
kill -15 441        # একই কথা, নম্বর দিয়ে
kill -9 441         # SIGKILL, কোনো কথা নেই
pkill -f server.mjs # কমান্ড লাইনে server.mjs আছে এমন সবাইকে SIGTERM
killall node        # node নামের সবাইকে SIGTERM, সাবধানে
# Node 24 আর পরের Version নিজের নাম MainThread দেখায়, তখন নামে খোঁজা
# killall বা ps -C node কিছুই পায় না। pkill -f বা systemctl ভরসা (লেসন ১১)।`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Signal", "নম্বর", "কে পাঠায়", "ধরা যায়?", "Default আচরণ"],
          rows: [
            [<code key="h">SIGHUP</code>, "1", "Terminal বা SSH বন্ধ হলে", "হ্যাঁ", "মরে যাওয়া। অনেক Daemon এটাকে Config আবার পড়ার ইশারা ধরে"],
            [<code key="i">SIGINT</code>, "2", "Ctrl+C", "হ্যাঁ", "মরে যাওয়া"],
            [<code key="t">SIGTERM</code>, "15", "systemctl stop, Reboot, Docker stop, kill", "হ্যাঁ", "মরে যাওয়া। ধরলে গুছিয়ে বেরোনোর সুযোগ"],
            [<code key="k">SIGKILL</code>, "9", "kill -9, systemd এর ধৈর্য ফুরালে, OOM Killer", "না", "Kernel নিজে মুছে দেয়"],
            [<code key="s">SIGSTOP</code>, "19", "kill -STOP। Ctrl+Z পাঠায় SIGTSTP", "না", "থেমে থাকা, STAT হয় T"],
            [<code key="c">SIGCONT</code>, "18", "fg, bg, kill -CONT", "হ্যাঁ", "থেমে থাকা Process আবার চলে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Process মরার সময় একটা সংখ্যা রেখে যায়, Exit Code। নিজে বেরোলে সংখ্যাটা Program
                নিজে ঠিক করে: শূন্য মানে সব ঠিক, বাকি সব মানে কিছু একটা গোলমাল। আর Signal এ মরলে
                Shell একটা বাঁধা নিয়মে সংখ্যা বানায়: ১২৮ যোগ Signal এর নম্বর। Practice Server এ
                চারটা Signal দিয়ে চারটা <code>sleep</code> মেরে নিয়মটা মিলিয়ে দেখা হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ sleep 300 & kill $!;       wait $!; echo "SIGTERM -> exit code $?"
SIGTERM -> exit code 143
deploy@island-vps-01:~$ sleep 300 & kill -INT $!;  wait $!; echo "SIGINT  -> exit code $?"
SIGINT  -> exit code 130
deploy@island-vps-01:~$ sleep 300 & kill -KILL $!; wait $!; echo "SIGKILL -> exit code $?"
bash: line 3:   294 Killed                  sleep 300
SIGKILL -> exit code 137
deploy@island-vps-01:~$ sleep 300 & kill -HUP $!;  wait $!; echo "SIGHUP  -> exit code $?"
bash: line 4:   295 Hangup                  sleep 300
SIGHUP  -> exit code 129`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SignalLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "kill -9 প্রথম অস্ত্র নয়, শেষ অস্ত্র",
          content: (
            <p>
              কোনো App আটকে আছে মনে হলে অনেকে সরাসরি <code>kill -9</code> লেখেন। SIGKILL কে
              Program জানতেও পারে না, তাই কিছু গোছানোর সুযোগ পায় না: চলমান Request গুলো কাটা পড়ে,
              অর্ধেক লেখা ফাইল অর্ধেকই থাকে, Lock ফাইল পড়ে থাকে, পরেরবার App চালু হতে গিয়ে
              আটকে যায়। নিয়মটা হলো আগে SIGTERM, কয়েক সেকেন্ড অপেক্ষা, তারপরও না থামলে
              SIGKILL। ঠিক এই নিয়মটাই systemd নিজে মেনে চলে, Section 012 এ দেখবেন। আর Log এ 137
              দেখলে মনে রাখবেন, কেউ না কেউ SIGKILL দিয়েছে। প্রায়ই সেটা Memory ফুরিয়ে যাওয়ায়
              Kernel এর OOM Killer, যার খোঁজ পাবেন লেসন ০৭ এর Log এ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "service-manager",
      subHeader: { index: "006", title: "Why a Service Manager" },
      title: <SectionTitle>কেন একজন অভিভাবক লাগে, আর কেন সেটা systemd</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Server এ দীর্ঘ সময় চলা Program কে বলে Service, পুরনো নাম Daemon। প্রতিটা
                Service এর জন্য কিছু কাজ সবসময় করতে হয়, আর এই কাজগুলো App এর নিজের নয়:
              </ContentParagraph>
              <ContentList>
                <ListItem>Server চালু হলে ঠিক ক্রমে চালু করা, Network তৈরির পরে।</ListItem>
                <ListItem>সঠিক User হয়ে, সঠিক Folder এ, সঠিক Environment নিয়ে চালানো।</ListItem>
                <ListItem>Crash করলে একটু থেমে আবার চালু করা, কিন্তু অনন্তকাল নয়।</ListItem>
                <ListItem>থামানোর সময় আগে SIGTERM দেওয়া, ধৈর্য ধরা, তারপর দরকার হলে SIGKILL।</ListItem>
                <ListItem>App যা কিছু Terminal এ লেখে, সময় সহ এক জায়গায় জমা রাখা।</ListItem>
                <ListItem>
                  যেকোনো সময় বলতে পারা: চলছে কি না, কবে থেকে, কোন PID, কত Memory।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CaretakerSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই কাজের জন্য কয়েকটা যন্ত্র আছে। Module 01 এ শুনেছেন Island Tours একসময় pm2
                দিয়ে API চালাত, Deploy এর সময় pm2 পুরনো Process কে SIGTERM পাঠাত। pm2 হলো
                Node এর জন্য বানানো একটা Process Manager, অনেক VPS এ আজও চলে। supervisord পুরনো
                আরেকটা। Docker নিজেও Container আবার চালু করতে পারে। কিন্তু এদের প্রত্যেকেরও
                একজন অভিভাবক লাগে, কারণ Reboot এর পর pm2 বা Docker কে কে চালু করবে? উত্তর
                সবসময় একই: systemd। <code>pm2 startup</code> কমান্ড আসলে একটা systemd Unit
                বানিয়ে দেয়, আর Docker নিজে চলে <code>docker.service</code> হিসেবে।
              </ContentParagraph>
              <ContentParagraph>
                তাই my-tours এর জন্য আমরা মাঝের লোক বাদ দিয়ে সরাসরি systemd ব্যবহার করব। সে আগে
                থেকেই আছে, PID 1 হিসেবে Boot থেকে শেষ পর্যন্ত জেগে থাকে, প্রতিটা Service এর Log
                Journal এ রাখে, আর Ubuntu, Debian, Fedora, Rocky, প্রায় সব আধুনিক Linux এ একই ভাবে
                কাজ করে। একবার শিখলে সব জায়গায় চলবে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "units",
      subHeader: { index: "007", title: "Units and Targets" },
      title: <SectionTitle>Unit, Target, আর ফাইলগুলো কোথায় থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                systemd যা কিছু সামলায়, তার প্রতিটাকে বলে Unit। প্রতিটা Unit একটা ছোট লেখা
                ফাইল, আর ফাইলের নামের শেষাংশ বলে দেয় সে কোন জাতের। এই লেসন মূলত Service নিয়ে,
                বাকিদের নাম চিনে রাখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Unit এর জাত", "উদাহরণ", "কী করে"],
          rows: [
            [<code key="s">.service</code>, "my-tours-api.service, caddy.service", "একটা Program চালায় আর দেখে রাখে"],
            [<code key="so">.socket</code>, "ssh.socket", "একটা Port এ কান পেতে থাকে, কেউ এলে Service কে জাগায়। Ubuntu 24.04 এ SSH এভাবে চলে, লেসন ০৩"],
            [<code key="t">.timer</code>, "islandtours-backup.timer", "নির্দিষ্ট সময়ে একটা Service চালায়, cron এর আধুনিক ভাই, লেসন ১০"],
            [<code key="ta">.target</code>, "multi-user.target", "কয়েকটা Unit এর একটা দল, Boot এর একটা মাইলফলক"],
            [<code key="m">.mount</code>, "home.mount", "একটা Disk কে একটা Folder এ জোড়া দেয়"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Target গুলো Boot এর মাইলফলকের মতো। <code>basic.target</code> মানে প্রাথমিক
                ব্যবস্থা তৈরি, <code>network-online.target</code> মানে Network সত্যিই ব্যবহারযোগ্য,{" "}
                <code>multi-user.target</code> মানে পুরোদস্তুর Server, Graphics ছাড়া। একটা
                VPS সাধারণত multi-user.target পর্যন্তই যায়। আপনার Service কে কোন মাইলফলকের সাথে
                জুড়বেন, সেটা Section 014 এর বিষয়।
              </ContentParagraph>
              <ContentParagraph>
                Unit ফাইল থাকে কয়েকটা নির্দিষ্ট Folder এ, আর কোনটা কার, সেটা জানা খুব জরুরি।
                Package এর সাথে আসা ফাইল থাকে <code>/usr/lib/systemd/system/</code> এ। নিজের লেখা
                ফাইল রাখবেন <code>/etc/systemd/system/</code> এ। একই নামের ফাইল দুই জায়গায় থাকলে
                /etc এরটা জেতে। লেসন ০১ এর নিয়মটাই এখানে খাটে: /usr Package এর, /etc আপনার।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <UnitLocationsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা আসল Unit পড়ে দেখা যাক, Ubuntu নিজে cron এর জন্য যেটা দিয়েছে।{" "}
              <code>systemctl cat</code> ফাইলটার পথ সহ পুরোটা দেখায়, Drop-in থাকলে সেগুলো সহ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "ini",
          filename: "systemctl cat cron",
          code: `# /usr/lib/systemd/system/cron.service
[Unit]
Description=Regular background program processing daemon
Documentation=man:cron(8)
After=remote-fs.target nss-user-lookup.target

[Service]
EnvironmentFile=-/etc/default/cron
ExecStart=/usr/sbin/cron -f -P $EXTRA_OPTS
IgnoreSIGPIPE=false
KillMode=process
Restart=on-failure
SyslogFacility=cron

[Install]
WantedBy=multi-user.target`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                তিনটা অংশ, তিনটা বর্গবন্ধনীর মাথা: <code>[Unit]</code> এ পরিচয় আর ক্রম,{" "}
                <code>[Service]</code> এ আসল কাজ, <code>[Install]</code> এ Boot এর সাথে জোড়া।
                আপনার নিজের ফাইলও ঠিক এই তিন ভাগে লিখবেন।
              </ListItem>
              <ListItem>
                <code>EnvironmentFile=-/etc/default/cron</code> এর সামনের বিয়োগ চিহ্নটা খেয়াল
                করুন। এর মানে ফাইলটা না থাকলেও চলবে। চিহ্ন ছাড়া লিখলে ফাইল না থাকলে Service
                চালুই হবে না, আর my-tours এর জন্য আমরা ঠিক সেটাই চাই।
              </ListItem>
              <ListItem>
                <code>-f</code> মানে Foreground এ থাকা। systemd এর যুগে Program নিজে Background এ
                পালায় না, systemd তাকে সামনে রেখেই দেখাশোনা করে।
              </ListItem>
              <ListItem>
                <code>Restart=on-failure</code> আর <code>WantedBy=multi-user.target</code>, দুইটাই
                একটু পরে আপনার নিজের ফাইলে লিখবেন।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "unit-anatomy",
      subHeader: { index: "008", title: "Unit File Anatomy" },
      title: <SectionTitle>my-tours-api.service, লাইন ধরে ধরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই ফাইলটাই my-tours কে একটা আসল Service বানাবে। ষোলোটা লাইন, আর প্রতিটা লাইন
              উপরের ছয়টা কাজের কোনো একটার উত্তর। নিচের Lab এ যেকোনো লাইনে চাপ দিলে দেখবেন সে কী
              করে আর না থাকলে কী ভাঙে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "ini",
          filename: "/etc/systemd/system/my-tours-api.service",
          code: `[Unit]
Description=my-tours API (Node.js)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=mytours
Group=mytours
WorkingDirectory=/srv/my-tours
EnvironmentFile=/etc/my-tours/api.env
ExecStart=/usr/bin/node /srv/my-tours/server.mjs
Restart=on-failure
RestartSec=2
TimeoutStopSec=15

[Install]
WantedBy=multi-user.target`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <UnitFileLab /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Type", "কখন", "systemd কখন ধরে নেয় Service চালু"],
          rows: [
            [<code key="s">simple</code>, "Node, Python, Go এর Server, যারা Foreground এ চলে", "Process টা জন্ম নেওয়া মাত্র"],
            [<code key="e">exec</code>, "simple এর মতোই, একটু কড়া", "Program টা সত্যিই চালু হতে পারলে। ভুল Path এ start কমান্ড নিজেই ব্যর্থ বলবে"],
            [<code key="n">notify</code>, "যে Program নিজে systemd কে জানায় আমি তৈরি", "Program এর পাঠানো READY খবর এলে"],
            [<code key="o">oneshot</code>, "একবার চলে শেষ হয় এমন কাজ, যেমন রাতের Backup", "কাজ শেষ হলে, লেসন ১০"],
            [<code key="f">forking</code>, "পুরনো Daemon, যারা নিজে Background এ চলে যায়", "বাবা Process বেরিয়ে গেলে"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "active মানে জন্মেছে, তৈরি নয়",
          content: (
            <p>
              Type=simple এ systemd Process জন্ম নেওয়া মাত্র তাকে active ধরে। কিন্তু node এর
              Code পড়ে Port এ বসতে কয়েকশো মিলিসেকেন্ড লাগে। Practice Server এ{" "}
              <code>sudo systemctl restart my-tours-api</code> এর ঠিক পরের মুহূর্তে curl
              বলেছে Connection refused, exit code 7, আর এক সেকেন্ড পরে একই curl পেয়েছে{" "}
              <code>{'{"status":"ok"}'}</code>। তাই Deploy Script এ restart এর পরে সরাসরি
              সফল ধরে নেবেন না, কয়েকবার /health জিজ্ঞেস করে নিশ্চিত হবেন। যে App নিজে বলে দিতে
              পারে আমি তৈরি, তার জন্য Type=notify, তখন systemd সেই খবরের অপেক্ষা করে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "পরে কখনো App লেখার সময় মাথায় রাখুন",
          content: (
            <p>
              systemd এর সাথে সবচেয়ে ভালো মানায় এমন App যে তিনটা কাজ করে। এক, Foreground এ চলে,
              নিজে Background এ পালায় না। দুই, Log লেখে Terminal এ, মানে stdout আর stderr এ,
              কোনো ফাইলে নয়, বাকিটা systemd আর Journal সামলায় (লেসন ০৭)। তিন, SIGTERM ধরে
              ভদ্রভাবে বেরোয়। আমাদের <code>server.mjs</code> তিনটাই করে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "install-service",
      subHeader: { index: "009", title: "Hands-on: Install" },
      title: <SectionTitle>হাতে কলমে: my-tours কে একটা Service বানানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমে App টা। এটা my-tours এর সবচেয়ে ছোট রূপ, কিন্তু একটা আসল Service এর মতো
                আচরণ করে: সব Setting Environment থেকে পড়ে, না পেলে চালুই হয় না, শুধু{" "}
                <code>127.0.0.1</code> এ শোনে যাতে বাইরের কেউ সরাসরি না পৌঁছায় (বাইরের দরজা পরে
                Caddy হবে), আর SIGTERM পেলে চলমান Request শেষ করে বেরোয়। একটা ইচ্ছা করে ধীর
                Route <code>/slow</code> আছে, ভদ্রভাবে থামানো পরীক্ষার জন্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "server.mjs",
          code: `// my-tours API, the smallest version that behaves like a real service.
// সব Setting আসে Environment থেকে। না থাকলে চালুই হবে না।
import http from "node:http";

const port = Number(process.env.PORT);
const graceMs = Number(process.env.SHUTDOWN_GRACE_MS);
if (!port) throw new Error("PORT is not set");
if (!graceMs) throw new Error("SHUTDOWN_GRACE_MS is not set");

const tours = [
  { slug: "saint-martin", title: "Saint Martin Island Escape" },
  { slug: "sundarbans-cruise", title: "Sundarbans Mangrove Cruise" },
];

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok", pid: process.pid }));
  }
  if (req.url === "/api/tours") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(tours));
  }
  if (req.url === "/slow") {
    // একটা ধীর Request, Graceful Shutdown পরীক্ষার জন্য
    return setTimeout(() => res.end("slow booking done\\n"), 5000);
  }
  res.writeHead(404).end();
});

server.listen(port, "127.0.0.1", () => {
  console.log(\`my-tours api listening on 127.0.0.1:\${port}, pid \${process.pid}\`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, finishing open requests");
  server.close(() => {
    console.log("all requests done, exiting with code 0");
    process.exit(0);
  });
  server.closeIdleConnections();
  setTimeout(() => {
    console.log("grace period over, exiting with code 1");
    process.exit(1);
  }, graceMs).unref();
});`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর সাথে একটা Environment ফাইল, <code>api.env</code>। এতে কোনো গোপন কথা নেই, শুধু
                Setting। গোপন কথা কীভাবে রাখতে হয়, সেটা লেসন ০৫ এর বিষয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "api.env",
          code: `NODE_ENV=production
PORT=3000
SHUTDOWN_GRACE_MS=10000`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Practice Server এ আসল কাজটা, deploy User হয়ে, sudo দিয়ে। নিচের Output এ
                প্রতিটা লাইনের আগে <code>+</code> চিহ্নটা Shell এর <code>set -x</code> এর, যাতে
                দেখা যায় ঠিক কোন কমান্ড চলল। <code>server.mjs</code>, <code>api.env</code> আর Unit
                ফাইলটা আগে থেকে deploy এর Home Folder এ রাখা ছিল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `+ which node
/usr/bin/node
+ sudo useradd --system --no-create-home --shell /usr/sbin/nologin mytours
+ sudo install -d -o root -g mytours -m 750 /srv/my-tours
+ sudo install -o root -g mytours -m 640 /home/deploy/server.mjs /srv/my-tours/server.mjs
+ sudo install -d -o root -g mytours -m 750 /etc/my-tours
+ sudo install -o root -g mytours -m 640 /home/deploy/api.env /etc/my-tours/api.env
+ sudo install -o root -g root -m 644 /home/deploy/my-tours-api.service /etc/systemd/system/my-tours-api.service
+ sudo systemctl daemon-reload
+ systemctl is-enabled my-tours-api
disabled
+ systemctl is-active my-tours-api
inactive
+ sudo systemctl enable --now my-tours-api
Created symlink /etc/systemd/system/multi-user.target.wants/my-tours-api.service → /etc/systemd/system/my-tours-api.service.
+ systemctl is-enabled my-tours-api
enabled
+ systemctl is-active my-tours-api
active
+ curl -s http://127.0.0.1:3000/health
{"status":"ok","pid":441}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>which node</strong> বলে দেয় কোন node চলবে। Unit ফাইলের ExecStart এ ঠিক এই
                পুরো Path টাই লিখবেন।
              </ListItem>
              <ListItem>
                <strong>useradd --system</strong> একটা আলাদা User বানাল, mytours, যার Home Folder
                নেই আর Login করার Shell নেই। App এর জন্য আলাদা আর কম ক্ষমতার একজন। কেন, আর{" "}
                <code>install</code> এর <code>-o -g -m</code> মানে Owner, Group আর Permission
                কেন এমন, তার পুরো গল্প লেসন ০৪ এ। এখন শুধু এটুকু: ফাইলগুলো root এর, mytours শুধু
                পড়তে পারে, বদলাতে পারে না।
              </ListItem>
              <ListItem>
                <strong>daemon-reload</strong> systemd কে Unit ফাইলগুলো আবার পড়তে বলে। নতুন ফাইল
                রাখলে বা পুরনো বদলালে প্রতিবার লাগে।
              </ListItem>
              <ListItem>
                <strong>enable --now</strong> আসলে দুইটা কাজ একসাথে। enable করল, Output এর
                Created symlink লাইনটা দেখুন: multi-user.target.wants Folder এ একটা Symlink
                বসল। আর <code>--now</code> সাথে সাথে start ও দিল।
              </ListItem>
              <ListItem>
                শেষে <strong>curl</strong> দিয়ে নিজের Server থেকেই নিজের App এ একটা Request। উত্তর
                এলো, আর তাতে PID 441। এই সংখ্যাটা মনে রাখুন, একটু পরে বদলে যাবে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "status=203/EXEC: সবচেয়ে চেনা প্রথম ভুল",
          content: (
            <div className="space-y-3">
              <p>
                নিজের Laptop এ Node বসাতে অনেকে nvm ব্যবহার করেন। তখন node থাকে Home Folder এর
                ভেতরে, যেমন <code>/home/deploy/.nvm/versions/node/v22.11.0/bin/node</code>। এই
                Path Unit ফাইলে লিখলে দুইটা বিপদ। Version বদলালে Path বদলায়, আর mytours User
                deploy এর Home Folder এ ঢুকতেই পারে না। Practice Server এ এমন একটা Path দিয়ে
                Service চালু করার চেষ্টার ফল:
              </p>
              <pre className="font-mono text-[0.6875rem] overflow-x-auto">
                {`× wrongpath-demo.service
     Active: failed (Result: exit-code) since Sat 2026-10-31 07:30:12 UTC; 1s ago
    Process: 411 ExecStart=/home/deploy/.nvm/versions/node/v22.11.0/bin/node ... (code=exited, status=203/EXEC)`}
              </pre>
              <p>
                203/EXEC মানে systemd Program টা চালাতেই পারেনি: ফাইল নেই, বা চালানোর অনুমতি
                নেই। Server এ Node বসাবেন সবার জন্য, এমন জায়গায় যেটা <code>/usr/bin</code> এর
                মতো। লেসন ১১ এ সঠিক পদ্ধতিতে বসানো দেখবেন। তারপর <code>which node</code> যা
                বলে, ExecStart এ সেটাই।
              </p>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "status",
      subHeader: { index: "010", title: "Reading status" },
      title: <SectionTitle>systemctl status পড়তে শেখা, লাইন ধরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কোনো Service এর খবর জানতে প্রথম কমান্ড সবসময় একটাই। নিচের Output টা sudo দিয়ে
              নেওয়া, কারণ শেষের Log লাইনগুলো দেখতে অনুমতি লাগে, সেটা একটু পরে বলছি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ sudo systemctl status my-tours-api
● my-tours-api.service - my-tours API (Node.js)
     Loaded: loaded (/etc/systemd/system/my-tours-api.service; enabled; preset: enabled)
     Active: active (running) since Sat 2026-10-31 07:26:11 UTC; 15s ago
   Main PID: 441 (node)
      Tasks: 11 (limit: 7039)
     Memory: 12.4M (peak: 15.2M)
        CPU: 161ms
     CGroup: /system.slice/my-tours-api.service
             └─441 /usr/bin/node /srv/my-tours/server.mjs

Oct 31 07:26:11 island-vps-01 systemd[1]: Started my-tours-api.service - my-tours API (Node.js).
Oct 31 07:26:11 island-vps-01 node[441]: my-tours api listening on 127.0.0.1:3000, pid 441

# Practice Server টা একটা Container এ চলে বলে আসল CGroup লাইনের শুরুতে একটা লম্বা
# Container ID ছিল, সেটা বাদ দেওয়া হয়েছে। একটা সাধারণ VPS এ লাইনটা ঠিক এরকমই দেখায়।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>প্রথম লাইনের বিন্দু:</strong> সবুজ <code>●</code> মানে চলছে, সাদা{" "}
                <code>○</code> মানে বন্ধ, লাল <code>×</code> মানে ব্যর্থ। তারপর Unit এর নাম আর
                আপনার লেখা Description।
              </ListItem>
              <ListItem>
                <strong>Loaded:</strong> systemd ফাইলটা কোথা থেকে পড়েছে, আর সে enabled কি না,
                মানে Boot এ চালু হবে কি না। <code>preset: enabled</code> হলো Distribution এর
                পরামর্শ, আপনার সিদ্ধান্ত নয়, উপেক্ষা করতে পারেন।
              </ListItem>
              <ListItem>
                <strong>Active:</strong> সবচেয়ে জরুরি লাইন। <code>active (running)</code>, কবে
                থেকে, কতক্ষণ। এই সময়টা ছোট দেখলে সন্দেহ করুন, App হয়তো এইমাত্র Restart হয়েছে।
              </ListItem>
              <ListItem>
                <strong>Main PID:</strong> systemd যে Process টাকে মূল ধরে। stop এর SIGTERM প্রথমে
                এর কাছেই যায়।
              </ListItem>
              <ListItem>
                <strong>Tasks:</strong> Process আর Thread মিলিয়ে কতগুলো। একটা সাধারণ node এর
                ভেতরেই ১১টা, কারণ Node নিজের কাজের জন্য কয়েকটা Thread রাখে। কেন, সেটা Module 08
                এর প্রথম লেসনে।
              </ListItem>
              <ListItem>
                <strong>Memory আর CPU:</strong> এই Service এর সব Process মিলিয়ে, peak মানে এ
                পর্যন্ত সর্বোচ্চ।
              </ListItem>
              <ListItem>
                <strong>CGroup:</strong> Service এর পুরো পরিবার। App যদি নিজের সন্তান Process
                বানায়, তারাও এখানে আসবে, আর stop দিলে systemd পুরো পরিবারকে থামায়, কেউ এতিম হয়ে
                পড়ে থাকে না। তাই nohup এর মতো পালানোর পথ এখানে নেই।
              </ListItem>
              <ListItem>
                <strong>শেষের লাইনগুলো:</strong> এই Service এর Journal এর শেষ কয়েকটা লাইন। App এর{" "}
                <code>console.log</code> সরাসরি এখানে চলে এসেছে, <code>node[441]</code> নাম সহ।
                Log নিয়ে পুরো লেসন ০৭ এ।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "sudo ছাড়া Log লাইন আসে না কেন",
          content: (
            <p>
              deploy হয়ে sudo ছাড়া <code>systemctl status my-tours-api</code> লিখলে উপরের সব
                লাইন আসে, শুধু শেষের Log গুলো আসে না। অন্য User এর Service এর Log পড়ার অনুমতি
              সবার নেই। deploy এর <code>id</code> দেখলে Group পাবেন শুধু deploy আর sudo। deploy
              কে <code>adm</code> বা <code>systemd-journal</code> Group এ যোগ করলে sudo ছাড়াই
              পড়তে পারবে। Group যোগ করা লেসন ০৪ এ, Journal লেসন ০৭ এ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "systemctl",
      subHeader: { index: "011", title: "Daily systemctl" },
      title: <SectionTitle>প্রতিদিনের systemctl, আর enable বনাম start</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কমান্ড", "কী করে", "কখন"],
          rows: [
            [<code key="1">systemctl status NAME</code>, "পুরো খবর, শেষ কয়েক লাইন Log সহ", "সব সমস্যার প্রথম ধাপ"],
            [<code key="2">sudo systemctl start NAME</code>, "এখনই চালু", "Service বন্ধ আছে"],
            [<code key="3">sudo systemctl stop NAME</code>, "এখনই থামানো, SIGTERM দিয়ে", "রক্ষণাবেক্ষণ"],
            [<code key="4">sudo systemctl restart NAME</code>, "থামানো, তারপর নতুন Process চালু", "নতুন Code বা নতুন env এর পরে"],
            [<code key="5">sudo systemctl reload NAME</code>, "Process না থামিয়ে App কে Config আবার পড়ানো", "Caddy এর মতো যারা পারে, তাদের জন্য"],
            [<code key="6">sudo systemctl enable NAME</code>, "Boot এ চালু হবে, Symlink বসায়", "নতুন Service একবার"],
            [<code key="7">sudo systemctl disable NAME</code>, "Boot এ আর চালু হবে না", "Service অবসরে"],
            [<code key="8">sudo systemctl daemon-reload</code>, "systemd কে Unit ফাইলগুলো আবার পড়ানো", "Unit ফাইল বদলানোর পরে প্রতিবার"],
            [<code key="9">systemctl is-active NAME</code>, "শুধু একটা শব্দ, আর Exit Code", "Script এ পরীক্ষার জন্য"],
            [<code key="10">systemctl --failed</code>, "যারা ব্যর্থ অবস্থায় আছে", "Server এ ঢুকেই একবার"],
            [<code key="11">systemctl list-units --type=service --state=running</code>, "এখন কোন Service চলছে", "Server টা চিনতে"],
            [<code key="12">systemctl show NAME -p Restart</code>, "একটা Setting এর আসল মান, Default সহ", "নিশ্চিত হতে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে বেশি গুলিয়ে যায় enable আর start। দুইটা আলাদা প্রশ্নের উত্তর। start
                প্রশ্ন করে এখন চলছে কি না, enable প্রশ্ন করে Boot এর পর চলবে কি না। চারটা
                মিশ্রণই সম্ভব, আর Installation এর Output এ আপনি প্রথম আর শেষটা দেখেছেন:
                disabled আর inactive থেকে enabled আর active।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["is-enabled", "is-active", "এখন", "Reboot এর পরে"],
          rows: [
            ["disabled", "inactive", "বন্ধ", "বন্ধ। নতুন বসানো Service এর অবস্থা"],
            ["disabled", "active", "চলছে", "বন্ধ! শুধু start দিয়েছেন, enable ভুলে গেছেন। সবচেয়ে বিপজ্জনক মিশ্রণ"],
            ["enabled", "inactive", "বন্ধ", "চলবে। ইচ্ছা করে থামিয়ে রেখেছেন, বা Crash করে থেমে আছে"],
            ["enabled", "active", "চলছে", "চলবে। যা চাই"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আরও দুইটা আসল বার্তা, যেগুলো আপনি প্রথম সপ্তাহেই দেখবেন। প্রথমটা আসে Unit ফাইল
              বদলে daemon-reload ভুলে গেলে। দ্বিতীয়টা আসে এমন Service কে reload করতে চাইলে যে
              reload জানে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `# Unit ফাইলে RestartSec বদলানো হলো, daemon-reload দেওয়া হয়নি
deploy@island-vps-01:~$ sudo systemctl restart my-tours-api
Warning: The unit file, source configuration file or drop-ins of my-tours-api.service changed on disk. Run 'systemctl daemon-reload' to reload units.

deploy@island-vps-01:~$ sudo systemctl reload my-tours-api
Failed to reload my-tours-api.service: Job type reload is not applicable for unit my-tours-api.service.
deploy@island-vps-01:~$ echo $?
3

deploy@island-vps-01:~$ systemctl show my-tours-api -p Restart -p RestartUSec -p TimeoutStopUSec -p KillSignal -p User
Restart=on-failure
RestartUSec=3s
TimeoutStopUSec=15s
User=mytours
KillSignal=15`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম বার্তাটা শুধু সতর্কবাণী। Restart হয়েছে, কিন্তু পুরনো Setting দিয়ে, কারণ
                systemd এখনো পুরনো ফাইলটাই মনে রেখেছে। এই ভুলে মানুষ ঘণ্টার পর ঘণ্টা ভাবেন আমার
                বদলটা কাজ করছে না কেন।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়টায় systemd বলছে my-tours এর Unit এ reload এর কোনো উপায় লেখা নেই।
                Reload তখনই সম্ভব যখন Unit এ <code>ExecReload=</code> থাকে আর Program নিজে Process না
                থামিয়ে Config আবার পড়তে জানে। Caddy জানে, তাই Island Tours এ Caddyfile বদলানোর পর{" "}
                <code>systemctl reload caddy</code> দেওয়া হয়, একটা Connection ও কাটে না। আমাদের
                ছোট App জানে না, তার জন্য restart। আর শেষের <code>systemctl show</code> দেখাচ্ছে
                systemd এর চোখে আসল মান, Default গুলো সহ। KillSignal=15 মানে stop এ SIGTERM।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ systemctl list-units --type=service --state=running --no-legend
  cron.service             loaded active running Regular background program processing daemon
  dbus.service             loaded active running D-Bus System Message Bus
  my-tours-api.service     loaded active running my-tours API (Node.js)
  rsyslog.service          loaded active running System Logging Service
  ssh.service              loaded active running OpenBSD Secure Shell server
  systemd-journald.service loaded active running Journal Service

deploy@island-vps-01:~$ systemctl --failed
  UNIT LOAD ACTIVE SUB DESCRIPTION

0 loaded units listed.

# Deploy Script এর ভেতরে: চলছে কি না, শুধু Exit Code দিয়ে
systemctl is-active --quiet my-tours-api || echo "my-tours-api is down"`,
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "graceful-stop",
      subHeader: { index: "012", title: "Stopping Gracefully" },
      title: <SectionTitle>ভদ্রভাবে থামানো, আর যে থামতে চায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>systemctl stop</code> দিলে systemd তিনটা ধাপ মেনে চলে, Section 005 এর সেই
                নিয়মটাই। এক, Service এর Process কে SIGTERM পাঠায়। দুই, অপেক্ষা করে, সর্বোচ্চ{" "}
                <code>TimeoutStopSec</code> পর্যন্ত, যেটা না লিখলে ৯০ সেকেন্ড। তিন, তখনো কেউ বেঁচে
                থাকলে SIGKILL। Default এ systemd CGroup এর সবাইকে Signal পাঠায়, শুধু Main PID কে
                নয়, এই আচরণের নাম <code>KillMode=control-group</code>।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম পরীক্ষা: একটা ধীর বুকিং চলার মাঝখানে stop। <code>/slow</code> Route টা ৫
                সেকেন্ড নেয়, আর Request পাঠানোর ১ সেকেন্ড পরে stop দেওয়া হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ curl -s http://127.0.0.1:3000/slow &
deploy@island-vps-01:~$ date +%T; sudo systemctl stop my-tours-api; date +%T
07:26:35
slow booking done
07:26:39

deploy@island-vps-01:~$ sudo journalctl -u my-tours-api -n 5 -o short-iso
2026-10-31T07:26:35+00:00 island-vps-01 systemd[1]: Stopping my-tours-api.service - my-tours API (Node.js)...
2026-10-31T07:26:35+00:00 island-vps-01 node[441]: SIGTERM received, finishing open requests
2026-10-31T07:26:39+00:00 island-vps-01 node[441]: all requests done, exiting with code 0
2026-10-31T07:26:39+00:00 island-vps-01 systemd[1]: my-tours-api.service: Deactivated successfully.
2026-10-31T07:26:39+00:00 island-vps-01 systemd[1]: Stopped my-tours-api.service - my-tours API (Node.js).`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>systemctl stop</code> কমান্ডটা নিজেই ৪ সেকেন্ড আটকে রইল, ৩৫ থেকে ৩৯। ঠিক
                ততক্ষণ, যতক্ষণ বুকিং শেষ হতে লাগল। বুকিংয়ের উত্তর এসেছে <code>slow booking done</code>,
                তারপর App নিজে শূন্য দিয়ে বেরিয়েছে, systemd লিখেছে Deactivated successfully।
                কেউ কিছু হারায়নি। Module 05 এর Graceful Shutdown এর পুরো আয়োজনটা এখানে কাজ করছে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় পরীক্ষা: একটা জেদি Program, যে SIGTERM পেয়ে শুধু একটা লাইন লেখে আর চলতে
                থাকে। এর Unit এ <code>TimeoutStopSec=5</code> রাখা হলো, যাতে অপেক্ষা ছোট হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ date +%T; sudo systemctl stop stubborn-demo; date +%T
07:26:50
07:26:56

deploy@island-vps-01:~$ sudo journalctl -u stubborn-demo -o short-iso | tail -8
2026-10-31T07:26:50+00:00 island-vps-01 systemd[1]: Stopping stubborn-demo.service - A program that ignores SIGTERM...
2026-10-31T07:26:50+00:00 island-vps-01 node[606]: got SIGTERM, ignoring it
2026-10-31T07:26:55+00:00 island-vps-01 systemd[1]: stubborn-demo.service: State 'stop-sigterm' timed out. Killing.
2026-10-31T07:26:55+00:00 island-vps-01 systemd[1]: stubborn-demo.service: Killing process 606 (node) with signal SIGKILL.
2026-10-31T07:26:55+00:00 island-vps-01 systemd[1]: stubborn-demo.service: Main process exited, code=killed, status=9/KILL
2026-10-31T07:26:55+00:00 island-vps-01 systemd[1]: stubborn-demo.service: Failed with result 'timeout'.
2026-10-31T07:26:55+00:00 island-vps-01 systemd[1]: Stopped stubborn-demo.service - A program that ignores SIGTERM.

# Container বলে এখানে CGroup নিয়ে একটা বাড়তি সতর্কবার্তার লাইন ছিল, সেটা বাদ দেওয়া হয়েছে।`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StopTimelineDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তৃতীয় একটা রকমও আছে, আর সেটাই সবচেয়ে ধোঁকাবাজ: যে App এর SIGTERM Handler একদম
                নেই। Practice Server এ এমন একটা App থামালে systemd লিখল{" "}
                <code>Deactivated successfully</code>, Result success। কারণ systemd এর হিসাবে
                SIGTERM এ মরা একটা পরিষ্কার মৃত্যু। কিন্তু সেই মুহূর্তে যত Request চলছিল, সব কাটা
                পড়েছে। systemd এর success মানে শুধু Process টা থেমেছে, ভালোভাবে থেমেছে এমন নয়।
              </ContentParagraph>
              <ContentParagraph>
                দুইটা সময় একসাথে মিলিয়ে রাখতে হয়। App এর নিজের ধৈর্য,{" "}
                <code>SHUTDOWN_GRACE_MS=10000</code>, মানে ১০ সেকেন্ডে কাজ শেষ না হলে App নিজেই
                বেরিয়ে যাবে। আর systemd এর ধৈর্য, <code>TimeoutStopSec=15</code>। প্রথমটা সবসময়
                দ্বিতীয়টার চেয়ে ছোট, যাতে App নিজের শর্তে বেরোয় আর systemd কে কখনো SIGKILL দিতে
                না হয়। Module 05 এ Keep-Alive Timeout এর ক্ষেত্রে একই নিয়ম দেখেছিলেন: পেছনের জনের
                ধৈর্য আর সামনের জনের ধৈর্য এমনভাবে সাজানো যাতে কেউ কারো মাঝপথে দরজা বন্ধ না
                করে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StopTimelineLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Reboot ও একটা stop",
          content: (
            <p>
              <code>sudo reboot</code> দিলে systemd প্রতিটা Service কে ঠিক এভাবেই থামায়, SIGTERM
              দিয়ে, ধৈর্য ধরে। Practice Server Reboot এর ঠিক আগের Journal এ my-tours এর লাইনগুলো
              ছিল: SIGTERM received, all requests done, exiting with code 0। তাই Graceful
              Shutdown শুধু Deploy এর জন্য নয়, প্রতিটা Reboot আর প্রতিটা Provider রক্ষণাবেক্ষণের
              জন্যও।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "restart",
      subHeader: { index: "013", title: "Crash and Restart" },
      title: <SectionTitle>Crash, নিজে নিজে আবার চালু, আর Crash Loop</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>Restart=</code> লাইন ঠিক করে Process থেমে গেলে systemd তাকে আবার চালু
                করবে কি না। কোনটা বেছে নেবেন, তা বুঝতে একটা শব্দ জানতে হবে: পরিষ্কার মৃত্যু।
                systemd এর চোখে পরিষ্কার মানে Exit Code শূন্য, অথবা SIGHUP, SIGINT, SIGTERM বা
                SIGPIPE এ মৃত্যু। বাকি সব, যেমন Exit Code ১ বা SIGKILL, হলো ব্যর্থতা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Restart=", "কখন আবার চালু করে", "কার জন্য"],
          rows: [
            [<code key="n">no</code>, "কখনো না। এটাই Default", "একবারের কাজ"],
            [<code key="f">on-failure</code>, "ব্যর্থ মৃত্যুতে: Exit Code শূন্য নয়, অপরিষ্কার Signal, Timeout", "বেশিরভাগ Web Service, my-tours"],
            [<code key="a">on-abnormal</code>, "শুধু Signal আর Timeout এ, ভুল Exit Code এ নয়", "যে App ইচ্ছা করে ভুল Code দিয়ে বেরোয়"],
            [<code key="s">on-success</code>, "শুধু পরিষ্কার মৃত্যুতে", "খুব কম লাগে"],
            [<code key="al">always</code>, "যেভাবেই থামুক, শুধু systemctl stop ছাড়া", "যাকে কোনো অবস্থাতেই থামতে দেওয়া যাবে না"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম পরীক্ষা, একটা আসল Crash এর অভিনয়: App এর Main PID কে SIGKILL। কেউ systemctl
              ব্যবহার করেনি, তাই systemd এর কাছে এটা অপ্রত্যাশিত মৃত্যু।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ systemctl show my-tours-api -p MainPID -p NRestarts
MainPID=543
NRestarts=0
deploy@island-vps-01:~$ sudo kill -9 $(systemctl show -p MainPID --value my-tours-api)
deploy@island-vps-01:~$ sleep 3; systemctl show my-tours-api -p MainPID -p NRestarts
MainPID=658
NRestarts=1

deploy@island-vps-01:~$ sudo journalctl -u my-tours-api -n 4 -o short-iso
2026-10-31T07:27:08+00:00 island-vps-01 systemd[1]: my-tours-api.service: Main process exited, code=killed, status=9/KILL
2026-10-31T07:27:08+00:00 island-vps-01 systemd[1]: my-tours-api.service: Failed with result 'signal'.
2026-10-31T07:27:10+00:00 island-vps-01 systemd[1]: my-tours-api.service: Scheduled restart job, restart counter is at 1.
2026-10-31T07:27:10+00:00 island-vps-01 systemd[1]: Started my-tours-api.service - my-tours API (Node.js).`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মৃত্যু ০৭:২৭:০৮ এ, নতুন জন্ম ০৭:২৭:১০ এ, মাঝে ঠিক <code>RestartSec=2</code> এর দুই
                সেকেন্ড। PID 543 থেকে 658, আর <code>NRestarts</code> গুনে রাখছে কতবার এমন হলো। এই
                সংখ্যাটা বাড়তে থাকলে বুঝবেন App চুপচাপ মরছে আর উঠছে, যদিও বাইরে থেকে সব ঠিক মনে
                হয়।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় পরীক্ষাটা একটা ফাঁদ দেখায়। এবার SIGKILL নয়, সাধারণ <code>kill</code>,
                মানে SIGTERM। আমাদের App SIGTERM ধরে ভদ্রভাবে শূন্য দিয়ে বেরোয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ sudo kill $(systemctl show -p MainPID --value my-tours-api)
deploy@island-vps-01:~$ sleep 4; systemctl show my-tours-api -p NRestarts -p ActiveState -p Result
NRestarts=0
ActiveState=inactive
Result=success`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                App আর ফিরে আসেনি। শূন্য দিয়ে বেরোনো মানে সফল সমাপ্তি, আর{" "}
                <code>on-failure</code> শুধু ব্যর্থতায় আবার চালু করে। তাই Server এ কখনো হাতে{" "}
                <code>kill</code> দিয়ে Service থামাবেন না, systemctl দিয়ে থামান আর চালান, যাতে
                systemd জানে কী ঘটছে। আর যদি এমন কিছু চালান যাকে কোনো অবস্থাতেই থেমে থাকতে দেওয়া
                যাবে না, সেখানে <code>Restart=always</code>।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয় পরীক্ষা, সবচেয়ে বাস্তব। কেউ ভুল করে <code>api.env</code> থেকে PORT এর
                লাইনটা মুছে ফেললেন, তারপর restart দিলেন। App চালু হয়েই নিজের নিয়মে মরে যায়,
                কারণ PORT ছাড়া সে চলবে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ sudo sed -i "/^PORT=/d" /etc/my-tours/api.env
deploy@island-vps-01:~$ sudo systemctl restart my-tours-api

deploy@island-vps-01:~$ systemctl status my-tours-api | head -5
● my-tours-api.service - my-tours API (Node.js)
     Loaded: loaded (/etc/systemd/system/my-tours-api.service; enabled; preset: enabled)
     Active: activating (auto-restart) (Result: exit-code) since Sat 2026-10-31 07:27:33 UTC; 1s ago
    Process: 739 ExecStart=/usr/bin/node /srv/my-tours/server.mjs (code=exited, status=1/FAILURE)
   Main PID: 739 (code=exited, status=1/FAILURE)

deploy@island-vps-01:~$ sudo journalctl -u my-tours-api -n 30 -o cat | grep -v "^    at " | tail -9
file:///srv/my-tours/server.mjs:7
if (!port) throw new Error("PORT is not set");
                 ^
Error: PORT is not set
Node.js v18.19.1
my-tours-api.service: Main process exited, code=exited, status=1/FAILURE
my-tours-api.service: Failed with result 'exit-code'.
my-tours-api.service: Scheduled restart job, restart counter is at 4.
Started my-tours-api.service - my-tours API (Node.js).

# ৪০ সেকেন্ড পরে
deploy@island-vps-01:~$ systemctl show my-tours-api -p NRestarts
NRestarts=14`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>activating (auto-restart)</code> মানে systemd পরের চেষ্টার অপেক্ষায়। আর
                Journal এ আসল কারণটা একদম পরিষ্কার: <code>Error: PORT is not set</code>। এই কারণেই
                App কে শুরুতেই চেঁচিয়ে মরতে শেখানো হয়েছিল। একটা Fallback Port এ চুপচাপ চালু হলে
                সমস্যাটা অনেক পরে, অনেক অদ্ভুত চেহারায় ধরা পড়ত।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু ৪০ সেকেন্ডে ১৪ বার! systemd এর একটা নিয়ম আছে যা এমন Crash Loop থামানোর কথা:
                Start Limit। Default এ ১০ সেকেন্ডের মধ্যে ৫ বারের বেশি চালু করতে চাইলে systemd হাল
                ছেড়ে দেয়। কিন্তু আমাদের প্রতিটা চক্র প্রায় ৩ সেকেন্ডের, ১ সেকেন্ড App চালু হয়ে
                মরতে, ২ সেকেন্ড RestartSec। কোনো ১০ সেকেন্ডের জানালায় ৫ বার হয় না, তাই systemd
                কখনো থামে না। Log ভরতে থাকে, CPU খরচ হতে থাকে। সীমাটা নিজের মতো করে দিতে হয়,
                একটা Drop-in দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `# sudo systemctl edit my-tours-api একটা Editor খুলে ঠিক এই ফাইলটাই বানায়।
# এখানে Editor ছাড়া একই কাজ, যাতে পুরোটা দেখা যায়।
deploy@island-vps-01:~$ sudo mkdir -p /etc/systemd/system/my-tours-api.service.d
deploy@island-vps-01:~$ printf "[Unit]\\nStartLimitIntervalSec=60\\nStartLimitBurst=5\\n" \\
  | sudo tee /etc/systemd/system/my-tours-api.service.d/override.conf
deploy@island-vps-01:~$ sudo systemctl daemon-reload

deploy@island-vps-01:~$ systemctl cat my-tours-api | tail -4
# /etc/systemd/system/my-tours-api.service.d/override.conf
[Unit]
StartLimitIntervalSec=60
StartLimitBurst=5

deploy@island-vps-01:~$ sudo systemctl reset-failed my-tours-api
deploy@island-vps-01:~$ sudo systemctl restart my-tours-api
deploy@island-vps-01:~$ sleep 20; systemctl status my-tours-api | head -5
× my-tours-api.service - my-tours API (Node.js)
     Loaded: loaded (/etc/systemd/system/my-tours-api.service; enabled; preset: enabled)
    Drop-In: /etc/systemd/system/my-tours-api.service.d
             └─override.conf
     Active: failed (Result: exit-code) since Sat 2026-10-31 07:28:37 UTC; 489ms ago

deploy@island-vps-01:~$ sudo journalctl -u my-tours-api -o cat | grep "systemd\\|Start request" | tail -3
my-tours-api.service: Scheduled restart job, restart counter is at 5.
my-tours-api.service: Start request repeated too quickly.
Failed to start my-tours-api.service - my-tours API (Node.js).`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ৬০ সেকেন্ডে ৫ বারের নিয়ম। পাঁচবার চালু হওয়ার পর ষষ্ঠ চেষ্টায় systemd বলল{" "}
                <code>Start request repeated too quickly</code>, আর Service গেল failed এ। এখন সে
                নিজে আর চেষ্টা করবে না। কেউ কারণটা ঠিক করবেন, তারপর <code>reset-failed</code> দিয়ে
                ব্যর্থতার হিসাব মুছবেন, তারপর start। Failed অবস্থা খারাপ শোনায়, কিন্তু অনন্ত লুপের
                চেয়ে অনেক ভালো: <code>systemctl --failed</code> এ ধরা পড়ে, Monitoring এ Alarm
                বাজানো যায়।
              </ContentParagraph>
              <ContentParagraph>
                খেয়াল করুন Start Limit এর লাইন দুইটা <code>[Unit]</code> অংশে, <code>[Service]</code>{" "}
                এ নয়। আর মূল ফাইলে হাত না দিয়ে আলাদা Drop-in ফাইলে রাখা হলো। পরে কেউ মূল ফাইল
                বদলালেও এই বদলটা আলাদা থেকে যায়, আর <code>systemctl cat</code> দুইটাই একসাথে দেখায়।
                Drop-in মুছে মূল অবস্থায় ফিরতে <code>sudo systemctl revert my-tours-api</code>।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RestartLoopLab /> },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "boot",
      subHeader: { index: "014", title: "Boot and Hardening" },
      title: <SectionTitle>Server চালু হলে App কে চালু করে, আর একটু শক্ত করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Module 06 এর প্রশ্নের সরাসরি উত্তর। বিদ্যুতের বোতাম চাপা থেকে আপনার App চালু
                হওয়া পর্যন্ত একটা শিকল আছে, আর শিকলের প্রতিটা কড়া আগেরটাকে জাগায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <BootChainDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              enable এর পুরো কাজটা একটা Symlink, Installation এর Output এ দেখেছেন। Folder টা খুলে
              দেখলে বোঝা যায় Boot এ কারা কারা চালু হবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ ls -l /etc/systemd/system/multi-user.target.wants/
lrwxrwxrwx 1 root root 36 Oct 31 07:15 cron.service -> /usr/lib/systemd/system/cron.service
lrwxrwxrwx 1 root root 40 Oct 31 07:26 my-tours-api.service -> /etc/systemd/system/my-tours-api.service
lrwxrwxrwx 1 root root 39 Oct 31 07:16 rsyslog.service -> /usr/lib/systemd/system/rsyslog.service
lrwxrwxrwx 1 root root 35 Oct 31 07:16 ufw.service -> /usr/lib/systemd/system/ufw.service
# আরও কয়েকটা লাইন ছিল, ছোট রাখতে বাদ দেওয়া

deploy@island-vps-01:~$ systemctl list-dependencies --reverse my-tours-api
my-tours-api.service
● └─multi-user.target
●   └─graphical.target`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রমাণটা নিজের চোখে দেখার উপায় একটাই: Reboot। Practice Server বন্ধ করে আবার চালু
              করা হলো, Boot এর পরে কেউ কোনো কমান্ড দেয়নি, তারপর SSH দিয়ে ঢুকে দেখা হলো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `# Reboot এর আগে
deploy@island-vps-01:~$ systemctl show -p MainPID my-tours-api
MainPID=1098

# VPS এ এখানে লিখবেন sudo reboot। Practice Server টা Container বলে
# তাকে বাইরে থেকে বন্ধ করে আবার চালু করা হয়েছিল, ফল একই।

# Reboot এর পরে, নতুন SSH Session
deploy@island-vps-01:~$ systemctl is-active my-tours-api
active
deploy@island-vps-01:~$ systemctl show -p MainPID -p ActiveEnterTimestamp my-tours-api
MainPID=77
ActiveEnterTimestamp=Sat 2026-10-31 07:29:08 UTC
deploy@island-vps-01:~$ curl -s 127.0.0.1:3000/health
{"status":"ok","pid":77}

deploy@island-vps-01:~$ systemd-analyze critical-chain my-tours-api.service
my-tours-api.service @1.372s
└─basic.target @1.267s
  └─sockets.target @1.266s
    └─ssh.socket @1.265s
      └─sysinit.target @1.236s`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PID 1098 থেকে 77। এত ছোট নম্বর কারণ Boot এর একদম শুরুর দিকেই, প্রায় দেড়
                সেকেন্ডের মাথায় systemd App টাকে চালু করেছে, যখন অন্য খুব বেশি Process জন্মায়নি।{" "}
                <code>critical-chain</code> দেখাচ্ছে কোন কোন ধাপের পরে App এর পালা এসেছিল আর
                প্রতিটা ধাপ Boot শুরুর কত পরে তৈরি হয়েছিল। সত্যিকারের VPS এ Reboot দিলে SSH
                Connection কেটে যাবে, আধা মিনিট থেকে এক মিনিট পরে আবার ঢুকতে পারবেন, Firmware আর
                Kernel এর ধাপে একটু সময় লাগে।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে উত্তরটা এক বাক্যে: Server চালু হলে Kernel systemd কে চালায়, systemd ধাপে ধাপে
                multi-user.target এ পৌঁছায়, আর সেই Target এর wants Folder এ যাদের Symlink আছে,
                তাদের সবাইকে চালু করে। আপনার App তাদের একজন, কারণ আপনি একবার enable দিয়েছিলেন।
              </ContentParagraph>
              <ContentParagraph>
                শেষে একটু নিরাপত্তা। systemd চাইলে App এর চারপাশে কয়েকটা দেয়াল তুলে দিতে পারে, App
                এর Code না বদলেই। <code>systemd-analyze security</code> প্রতিটা Service কে ০ থেকে
                ১০ এর একটা নম্বর দেয়, যত কম তত নিরাপদ। আরেকটা Drop-in দিয়ে চারটা লাইন যোগ করে
                আগে আর পরে মাপা হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: `deploy@island-vps-01:~$ systemd-analyze security my-tours-api | tail -1
→ Overall exposure level for my-tours-api.service: 9.2 UNSAFE :-{

deploy@island-vps-01:~$ printf "[Service]\\nNoNewPrivileges=true\\nPrivateTmp=true\\nProtectSystem=strict\\nProtectHome=true\\n" \\
  | sudo tee /etc/systemd/system/my-tours-api.service.d/hardening.conf
deploy@island-vps-01:~$ sudo systemctl daemon-reload && sudo systemctl restart my-tours-api
deploy@island-vps-01:~$ sleep 1; curl -s 127.0.0.1:3000/health
{"status":"ok","pid":315}

deploy@island-vps-01:~$ systemd-analyze security my-tours-api | tail -1
→ Overall exposure level for my-tours-api.service: 8.3 EXPOSED :-(`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <code>NoNewPrivileges=true</code>: App বা তার কোনো সন্তান কখনো বেশি ক্ষমতা নিতে
                পারবে না, যেমন sudo চালিয়ে root হওয়া।
              </ListItem>
              <ListItem>
                <code>PrivateTmp=true</code>: App একটা নিজস্ব /tmp পায়, অন্যদের ফাইল দেখতে পায় না।
              </ListItem>
              <ListItem>
                <code>ProtectSystem=strict</code>: পুরো ফাইল সিস্টেম App এর জন্য শুধু পড়ার। App
                কোথাও লিখতে চাইলে, যেমন ছবি Upload এর Folder, সেটা{" "}
                <code>ReadWritePaths=/srv/my-tours/uploads</code> দিয়ে আলাদা করে খুলে দিতে হয়।
              </ListItem>
              <ListItem>
                <code>ProtectHome=true</code>: /home আর /root App এর চোখে নেই।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নম্বরটাকে লক্ষ্য বানাবেন না",
          content: (
            <p>
              ৯.২ থেকে ৮.৩, আর App আগের মতোই চলছে। একই Practice Server এ Ubuntu র নিজের cron আর
              ssh এর নম্বর ৯.৬। নম্বরটা একটা তালিকা মাত্র, কোন কোন দেয়াল তোলা যায়। প্রতিটা
              দেয়াল যোগ করে App চালিয়ে পরীক্ষা করুন, কারণ একটা দেয়াল বেশি হলে App চুপচাপ কোনো
              ফাইল লিখতে না পেরে ভাঙতে পারে। শুরুতে এই চারটা লাইনই যথেষ্ট, আর সবচেয়ে বড় দেয়ালটা
              আপনি আগেই তুলেছেন: <code>User=mytours</code>।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, এক সোমবারের Reboot</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এক সোমবার ভোরে Island Tours এর Provider একটা ইমেইল পাঠালেন: রাত ২টা থেকে ২টা ১৫
                এর মধ্যে Hardware রক্ষণাবেক্ষণের জন্য সব VPS Reboot হবে। দলের কেউ রাত জাগেননি।
                সকালে Dashboard এ শুধু দেখা গেল island-vps-01 এর Uptime কয়েক ঘণ্টা, আর সাইট
                সারারাত চলেছে, Reboot এর দুই মিনিট ছাড়া। কারণটা এই লেসনের পাঁচটা সিদ্ধান্ত।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>যা কিছু দীর্ঘ সময় চলে, সবই একটা Unit।</strong> island-vps-01 এ চলে{" "}
                  <code>ssh</code>, <code>caddy.service</code>, <code>docker.service</code>,{" "}
                  <code>cron.service</code> আর রাতের Backup এর{" "}
                  <code>islandtours-backup.timer</code>। সবগুলো enabled, তাই Reboot এর পর systemd
                  নিজে সবাইকে তোলে। NestJS API, PostgreSQL আর Redis চলে Docker Container এ।
                  Container গুলোকে আবার চালু করে Docker নিজে, আর Docker কে চালু করে systemd। দুই
                  স্তরের অভিভাবক, Docker Module এ ভেতরেরটা খুলবেন।
                </ListItem>
                <ListItem>
                  <strong>nohup নিষিদ্ধ।</strong> একবার এক জরুরি Hotfix এর সময় কেউ একটা ছোট
                  Script nohup দিয়ে চালিয়ে রেখেছিলেন। পরের Reboot এ সেটা আর ওঠেনি, আর তিন দিন কেউ
                  টের পাননি যে বুকিংয়ের নিশ্চিতকরণ ইমেইল যাচ্ছে না। তখন থেকে নিয়ম, Server এ কিছু
                  চালু রাখতে হলে সেটা একটা Unit, আর তার নাম README তে লেখা।
                </ListItem>
                <ListItem>
                  <strong>Config বদলালে reload, Code বদলালে restart।</strong> Caddyfile এ নতুন
                  একটা Redirect যোগ হলে দল <code>sudo systemctl reload caddy</code> দেয়, কোনো
                  Connection কাটে না। restart দিলে চলমান সব HTTPS Connection কেটে যেত।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Service এর একটা Start Limit আর একটা Alarm।</strong> কোনো
                  Service failed এ গেলে Monitoring সেটা ধরে আর দলের Chat এ খবর দেয়। অনন্ত Crash
                  Loop এ পড়ে থাকা Service এর চেয়ে স্পষ্ট failed অনেক ভালো, কারণ তাকে দেখা যায়।
                </ListItem>
                <ListItem>
                  <strong>Graceful Shutdown এর সময় দুই জায়গায় মেলানো।</strong> App এর{" "}
                  <code>SHUTDOWN_GRACE_MS</code> সবসময় যে তাকে থামায় তার সময়সীমার চেয়ে ছোট।
                  সেই রাতের Reboot এ চলমান তিনটা বুকিং ঠিকঠাক শেষ হয়ে তারপর Process থেমেছিল,
                  Journal এ তার প্রমাণ আছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Module 01 এ শুনেছিলেন Island Tours এর API pm2 চালাত। সেটা ছিল প্রথম দিকের কথা।
                পরে দল API কে Container এ নিয়ে গেছে, কিন্তু নিচের স্তরটা কখনো বদলায়নি। pm2 এর
                যুগে pm2 কে চালু করত systemd, আজ Docker কে চালু করে systemd। যন্ত্র বদলায়, PID 1
                বদলায় না।
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
      title: <SectionTitle>my-tours-api এর এক জীবন, ফাইল থেকে Reboot পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই লেসনে যা যা ঘটালেন, সেগুলো একটা গল্পে সাজালে এরকম দাঁড়ায়। প্রতিটা ধাপে কে কাজটা
              করছে, সেটা খেয়াল করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "আপনি একটা Unit ফাইল লেখেন",
              description:
                "/etc/systemd/system/my-tours-api.service, তিন অংশে: পরিচয় আর ক্রম, আসল কাজ, Boot এর সাথে জোড়া। তারপর daemon-reload, যাতে systemd ফাইলটা পড়ে।",
            },
            {
              title: "enable একটা Symlink বসায়, --now চালু করে",
              description:
                "multi-user.target.wants Folder এ my-tours-api.service এর একটা Symlink। এটাই Boot এর সাথে চিরস্থায়ী জোড়া। একই কমান্ডে start ও হয়ে যায়।",
            },
            {
              title: "systemd App এর জন্য ঘর সাজায়",
              description:
                "নিজের একটা কপি বানিয়ে তাতে User আর Group mytours করে, Folder /srv/my-tours এ নিয়ে যায়, api.env থেকে Environment ভরে, তারপর exec করে /usr/bin/node হয়ে যায়। PID 441, PPID 1, TTY নেই।",
            },
            {
              title: "App চলে, Log যায় Journal এ",
              description:
                "App শুধু 127.0.0.1:3000 এ শোনে। তার console.log সরাসরি Journal এ যায়, node[441] নামে, Time সহ। status এক নজরে সব বলে।",
            },
            {
              title: "রাতে একবার Crash",
              description:
                "কোনো কারণে Process টা SIGKILL এ মরে। systemd দেখে এটা ব্যর্থ মৃত্যু, Restart=on-failure, তাই ২ সেকেন্ড অপেক্ষা করে নতুন Process চালায়। নতুন PID, NRestarts বাড়ে, পর্যটকরা হয়তো দুই সেকেন্ডের একটা Error দেখেন।",
            },
            {
              title: "Deploy, মানে restart",
              description:
                "নতুন Code বসিয়ে sudo systemctl restart। systemd SIGTERM পাঠায়, App নতুন Request নেওয়া বন্ধ করে, চলমান বুকিং শেষ করে, শূন্য দিয়ে বেরোয়। তারপর systemd নতুন Code দিয়ে নতুন Process চালায়।",
            },
            {
              title: "Provider এর Reboot",
              description:
                "systemd সবাইকে SIGTERM দিয়ে ভদ্রভাবে থামায়, TimeoutStopSec পর্যন্ত ধৈর্য ধরে। তারপর মেশিন বন্ধ।",
            },
            {
              title: "Boot এর শিকল",
              description:
                "Firmware, Bootloader, Kernel, তারপর PID 1 systemd। systemd multi-user.target এ পৌঁছায়, wants Folder এর Symlink দেখে my-tours-api কে চালু করে। দেড় সেকেন্ডের মাথায় App আবার উঠে গেছে, কেউ কিছু বলেনি।",
            },
            {
              title: "একটা ভুল Config, একটা Crash Loop",
              description:
                "কেউ api.env থেকে PORT মুছে restart দিলেন। App চালু হয়েই PORT is not set বলে মরে। systemd আবার চালায়, আবার মরে। Start Limit ৬০ সেকেন্ডে ৫ বার পার হতেই systemd থামে: Start request repeated too quickly, Service failed।",
            },
            {
              title: "মানুষ ঠিক করেন, systemd আবার চালায়",
              description:
                "systemctl status আর journalctl কারণটা দেখায়। PORT ফিরিয়ে দিয়ে reset-failed, তারপর start। App আবার active, আর failed তালিকা খালি।",
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
                <strong>নিচের Lab টা আগে করুন।</strong> ছয়টা পরীক্ষায় এই লেসনের প্রতিটা Output
                নিজের Server এ ঘটাবেন। systemd পড়ে শেখার চেয়ে ভেঙে শেখা অনেক দ্রুত।
              </ListItem>
              <ListItem>
                <strong>systemd.service এর নথি</strong>, Type, Restart, RestartSec, TimeoutStopSec
                আর পরিষ্কার মৃত্যুর পুরো সংজ্ঞা।{" "}
                <a
                  href="https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  freedesktop.org/.../systemd.service.html
                </a>
              </ListItem>
              <ListItem>
                <strong>systemd.unit এর নথি</strong>, After, Wants, WantedBy, Drop-in Folder আর
                Unit ফাইল খোঁজার Folder গুলোর ক্রম।{" "}
                <a
                  href="https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  freedesktop.org/.../systemd.unit.html
                </a>
                {" আর stop এর নিয়মের জন্য "}
                <a
                  href="https://www.freedesktop.org/software/systemd/man/latest/systemd.kill.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  systemd.kill
                </a>
              </ListItem>
              <ListItem>
                <strong>systemctl এর নথি</strong>, প্রতিটা কমান্ড আর তার Exit Code।{" "}
                <a
                  href="https://www.freedesktop.org/software/systemd/man/latest/systemctl.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  freedesktop.org/.../systemctl.html
                </a>
              </ListItem>
              <ListItem>
                <strong>signal(7)</strong>, সব Signal এর তালিকা, কোনটা ধরা যায় আর কোনটা যায় না।{" "}
                <a
                  href="https://man7.org/linux/man-pages/man7/signal.7.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  man7.org/linux/man-pages/man7/signal.7.html
                </a>
                {" আর ps এর সব কলাম আর STAT অক্ষরের জন্য "}
                <a
                  href="https://man7.org/linux/man-pages/man1/ps.1.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  ps(1)
                </a>
              </ListItem>
              <ListItem>
                <strong>ArchWiki এর systemd পাতা</strong>, Arch এর জন্য লেখা হলেও সব Linux এ
                খাটে, উদাহরণে ভরা।{" "}
                <a
                  href="https://wiki.archlinux.org/title/Systemd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  wiki.archlinux.org/title/Systemd
                </a>
              </ListItem>
              <ListItem>
                <strong>নিজের Server এর man page</strong>, Internet ছাড়াই:{" "}
                <code>man systemd.service</code>, <code>man systemctl</code>,{" "}
                <code>man 7 signal</code>। আর কোনো Setting এর আসল মান জানতে{" "}
                <code>systemctl show</code>।
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
            <ContentList>
              <ListItem>
                প্রতিটা Process এর একটা PID আর একটা বাবা, PPID। সবার গোড়ায় PID 1, systemd। বাবা
                মরলে এতিম Process PID 1 এর কাছে যায়।
              </ListItem>
              <ListItem>
                ps aux এ RSS আসল Memory, STAT অবস্থা। প্রায় সব Process S, ঘুমিয়ে। D অনেকক্ষণ
                মানে Disk আটকে, Z মানে বাবা Exit Code পড়েনি।
              </ListItem>
              <ListItem>
                &amp; দিয়ে চালানো Job SSH কাটলে SIGHUP এ মরে। nohup শুধু SIGHUP থেকে বাঁচায়,
                Crash বা Reboot থেকে নয়।
              </ListItem>
              <ListItem>
                kill মানে Signal পাঠানো। SIGTERM ধরা যায়, SIGKILL যায় না। Signal এ মৃত্যুর Exit
                Code ১২৮ যোগ Signal নম্বর: 143, 130, 137, 129।
              </ListItem>
              <ListItem>
                systemd এর কাছে সব কিছু Unit। নিজের Unit থাকে /etc/systemd/system এ, বদলের পর
                daemon-reload, ছোট বদল Drop-in দিয়ে।
              </ListItem>
              <ListItem>
                start মানে এখন, enable মানে Boot এ। enable আসলে multi-user.target.wants এ একটা
                Symlink।
              </ListItem>
              <ListItem>
                stop মানে SIGTERM, TimeoutStopSec পর্যন্ত অপেক্ষা, তারপর SIGKILL। App এর নিজের
                Grace সময় systemd এর সময়ের চেয়ে ছোট রাখুন।
              </ListItem>
              <ListItem>
                Restart=on-failure ব্যর্থ মৃত্যুতে আবার চালায়, শূন্য দিয়ে বেরোলে নয়। Crash Loop
                থামাতে Start Limit, আর ঠিক করার পরে reset-failed।
              </ListItem>
              <ListItem>
                Server চালু হলে Kernel systemd কে চালায়, systemd multi-user.target এ পৌঁছে enabled
                সব Service চালু করে। আপনার App তাদের একজন।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৩, SSH & Security Keys",
          content: (
            <p>
              পুরো লেসনে আপনি একটা কাজ বারবার করেছেন, কিন্তু কখনো প্রশ্ন করেননি: Server এ
              ঢুকেছেন SSH দিয়ে। প্রথম Output এই দেখেছেন আপনার bash এর বাবা একটা sshd। কিন্তু
              Server কীভাবে বুঝল আপনিই deploy, কোনো Password ছাড়া? আর একই দরজায় সারা দুনিয়ার
              Bot প্রতি মিনিটে ধাক্কা দিচ্ছে, তাদের কীভাবে বাইরে রাখবেন? পরের লেসন সেই দরজা
              নিয়ে: Key Pair বানানো, Password Login বন্ধ করা, আর নতুন একটা VPS এর প্রথম এক ঘণ্টা।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["PID, PPID", "Process এর নম্বর আর তার বাবার নম্বর। জীবনকাল পর্যন্তই"],
      ["PID 1", "systemd, Kernel এর চালানো প্রথম Process, সবার পূর্বপুরুষ আর এতিমদের আশ্রয়"],
      ["STAT", "R চলছে, S ঘুম, D Disk এর অটল অপেক্ষা, T থামানো, Z মৃত কিন্তু খবর পড়া বাকি"],
      ["Job, &, nohup", "Shell এর Background কাজ। SSH কাটলে SIGHUP, nohup শুধু সেটা ঠেকায়"],
      ["Signal", "Process কে দেওয়া নম্বরওয়ালা খবর। kill পাঠায়, Default SIGTERM"],
      ["SIGTERM বনাম SIGKILL", "ভদ্র অনুরোধ, ধরা যায়, বনাম Kernel এর মুছে ফেলা, ধরা যায় না"],
      ["Exit Code", "শূন্য মানে ঠিক। Signal এ মৃত্যু হলে ১২৮ যোগ নম্বর, 137 মানে SIGKILL"],
      ["Unit", "systemd এর সামলানো যেকোনো জিনিস: service, socket, timer, target, mount"],
      ["Unit ফাইলের জায়গা", "/usr/lib/systemd/system Package এর, /etc/systemd/system আপনার, .d Drop-in"],
      ["daemon-reload", "Unit ফাইল বদলানোর পর systemd কে আবার পড়তে বলা"],
      ["enable বনাম start", "Boot এ চালু হবে, মানে Symlink, বনাম এখনই চালু"],
      ["TimeoutStopSec", "SIGTERM এর পর SIGKILL পর্যন্ত ধৈর্য। Default ৯০ সেকেন্ড"],
      ["Restart=on-failure", "ব্যর্থ মৃত্যুতে আবার চালু। শূন্য দিয়ে বা SIGTERM এ মরলে নয়"],
      ["Start Limit", "অল্প সময়ে বেশিবার চালু হলে systemd হাল ছাড়ে, Default ১০ সেকেন্ডে ৫ বার"],
      ["203/EXEC", "ExecStart এর Program চালানোই যায়নি: ভুল Path বা অনুমতি নেই"],
      ["multi-user.target", "পুরোদস্তুর Server এর মাইলফলক। এর wants এ থাকা সবাই Boot এ চালু হয়"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "ps এ দেখলেন আপনার node Process এর PPID হলো 1। এর সবচেয়ে সম্ভাব্য মানে কোনটা?",
        options: [
          {
            key: "A",
            text: "Process টা Kernel নিজে চালিয়েছে, তাই সেটা বিপজ্জনক",
            isCorrect: false,
            explanation: "PID 1 Kernel নয়, systemd। Kernel এর নিজের কাজগুলো এভাবে দেখায় না।",
          },
          {
            key: "B",
            text: "systemd এটাকে চালু করেছে, অথবা এর আসল বাবা মরে যাওয়ায় PID 1 এটাকে নিয়ে নিয়েছে",
            isCorrect: true,
            explanation:
              "ঠিক। Service হিসেবে চললে বাবা সরাসরি systemd। আর nohup এর পরীক্ষায় দেখেছেন, বাবা bash মরলে এতিম Process ও PID 1 এর কাছে যায়।",
          },
          {
            key: "C",
            text: "Process টা একটা Zombie",
            isCorrect: false,
            explanation: "Zombie চেনা যায় STAT কলামের Z দিয়ে, PPID দিয়ে নয়।",
          },
          {
            key: "D",
            text: "Process টা প্রথম চালু হওয়া Program, তাই তার নিজের PID ও 1",
            isCorrect: false,
            explanation: "PPID হলো বাবার নম্বর। এই Process এর নিজের PID আলাদা।",
          },
        ],
      },
      {
        id: 2,
        text: "Docker বা systemd এর Log এ দেখলেন একটা Process এর Exit Code 137। কী ঘটেছিল?",
        options: [
          {
            key: "A",
            text: "Program নিজে 137 দিয়ে বেরিয়েছে, কারণ তার কাজ শেষ",
            isCorrect: false,
            explanation: "কাজ শেষ হলে Program শূন্য দেয়। 137 একটা নিয়মে বানানো সংখ্যা।",
          },
          {
            key: "B",
            text: "Process টা SIGKILL এ মরেছে, ১২৮ যোগ ৯",
            isCorrect: true,
            explanation:
              "ঠিক। Practice Server এ kill -KILL এর পরে ঠিক 137 এসেছে। প্রায়ই কারণ Memory ফুরানো বা কারো ধৈর্য ফুরানো।",
          },
          {
            key: "C",
            text: "Process টা Ctrl+C তে থেমেছে",
            isCorrect: false,
            explanation: "Ctrl+C মানে SIGINT, নম্বর ২, Exit Code 130।",
          },
          {
            key: "D",
            text: "Process টা SIGTERM ধরে ভদ্রভাবে বেরিয়েছে",
            isCorrect: false,
            explanation: "ভদ্রভাবে বেরোলে সাধারণত শূন্য। Handler ছাড়া SIGTERM এ মরলে 143।",
          },
        ],
      },
      {
        id: 3,
        text: "VPS এ node server.mjs & লিখে Laptop বন্ধ করলেন। একটু পরে App নেই। কেন?",
        options: [
          {
            key: "A",
            text: "& দিলে Process টা Background এ যায়, আর Background Process নিজে থেকে থেমে যায়",
            isCorrect: false,
            explanation: "Background Process ঘণ্টার পর ঘণ্টা চলতে পারে, যতক্ষণ Terminal বেঁচে আছে।",
          },
          {
            key: "B",
            text: "SSH Connection কাটায় Terminal এর Session এর Process গুলো SIGHUP পেয়েছে, আর SIGHUP এর Default আচরণ মরে যাওয়া",
            isCorrect: true,
            explanation:
              "ঠিক। Practice Server এর পরীক্ষায় & দেওয়া sleep মরেছে, আর nohup দেওয়াটা বেঁচে গেছে।",
          },
          {
            key: "C",
            text: "Server Laptop এর Battery থেকে চলে",
            isCorrect: false,
            explanation: "Server নিজের Data Center এ চলে, আপনার Laptop শুধু SSH দিয়ে কথা বলছিল।",
          },
          {
            key: "D",
            text: "systemd সব Background Process মেরে ফেলে",
            isCorrect: false,
            explanation: "systemd আপনার Shell এর Job এ হাত দেয়নি। Hangup টা এসেছে Terminal চলে যাওয়ায়।",
          },
        ],
      },
      {
        id: 4,
        text: "নতুন Service এ শুধু sudo systemctl start দিলেন, সব চলছে। Reboot এর পর দেখলেন App বন্ধ। কী বাদ পড়েছিল?",
        options: [
          {
            key: "A",
            text: "daemon-reload",
            isCorrect: false,
            explanation: "daemon-reload ফাইল পড়ায়, Boot এ চালু হওয়ার সাথে তার সম্পর্ক নেই।",
          },
          {
            key: "B",
            text: "Restart=on-failure",
            isCorrect: false,
            explanation: "Restart শুধু Crash এর পরে কাজ করে। Reboot এর পর Service এর চালুই হওয়ার কথা আসে enable থেকে।",
          },
          {
            key: "C",
            text: "systemctl enable, যেটা multi-user.target.wants এ Symlink বসায়",
            isCorrect: true,
            explanation:
              "ঠিক। disabled আর active, সবচেয়ে বিপজ্জনক মিশ্রণ। একবারে দুইটা কাজের জন্য enable --now।",
          },
          {
            key: "D",
            text: "App এর SIGTERM Handler",
            isCorrect: false,
            explanation: "Handler থামার সময় কাজে লাগে, চালু হওয়ার সময় নয়।",
          },
        ],
      },
      {
        id: 5,
        text: "Unit ফাইলে TimeoutStopSec=15 রাখা, আর App SIGTERM পেয়ে কিছুই করে না, চলতেই থাকে। stop দেওয়ার পর কী হবে?",
        options: [
          {
            key: "A",
            text: "stop চিরকাল আটকে থাকবে",
            isCorrect: false,
            explanation: "systemd এর ধৈর্যের একটা সীমা আছে, সেটাই TimeoutStopSec।",
          },
          {
            key: "B",
            text: "১৫ সেকেন্ড পরে systemd SIGKILL পাঠাবে, Result হবে timeout",
            isCorrect: true,
            explanation:
              "ঠিক। Practice Server এর জেদি App এর Journal: State stop-sigterm timed out. Killing, তারপর status=9/KILL আর Failed with result timeout।",
          },
          {
            key: "C",
            text: "systemd সাথে সাথে SIGKILL পাঠাবে",
            isCorrect: false,
            explanation: "প্রথমে সবসময় SIGTERM আর অপেক্ষা। SIGKILL শেষ অস্ত্র।",
          },
          {
            key: "D",
            text: "systemd App টাকে আবার চালু করবে",
            isCorrect: false,
            explanation: "stop মানে আপনি থামাতে চেয়েছেন। systemctl stop এর পরে কোনো Restart নিয়ম কাজ করে না।",
          },
        ],
      },
      {
        id: 6,
        text: "Restart=on-failure রাখা Service এর PID খুঁজে কেউ হাতে kill দিলেন, App SIGTERM ধরে শূন্য দিয়ে বেরোল। এরপর?",
        options: [
          {
            key: "A",
            text: "২ সেকেন্ড পরে systemd আবার চালু করবে",
            isCorrect: false,
            explanation: "শূন্য দিয়ে বেরোনো ব্যর্থতা নয়, তাই on-failure কাজ করে না।",
          },
          {
            key: "B",
            text: "App বন্ধ থাকবে, ActiveState inactive, Result success",
            isCorrect: true,
            explanation:
              "ঠিক। Practice Server এ NRestarts শূন্যই ছিল। তাই Service থামাতে আর চালাতে সবসময় systemctl, কখনো হাতের kill নয়।",
          },
          {
            key: "C",
            text: "Service failed হবে আর systemctl --failed এ দেখাবে",
            isCorrect: false,
            explanation: "পরিষ্কার মৃত্যু failed নয়। Result success।",
          },
          {
            key: "D",
            text: "Server Reboot হবে",
            isCorrect: false,
            explanation: "একটা Service এর মৃত্যু Server কে Reboot করায় না।",
          },
        ],
      },
      {
        id: 7,
        text: "Unit ফাইলে RestartSec বদলে sudo systemctl restart দিলেন। একটা Warning এলো আর বদলটা কাজ করছে না। কী ভুলেছেন?",
        options: [
          {
            key: "A",
            text: "sudo systemctl daemon-reload",
            isCorrect: true,
            explanation:
              "ঠিক। systemd পুরনো ফাইলটাই মনে রেখেছিল, Warning এ সে নিজেই বলে দিয়েছে Run systemctl daemon-reload।",
          },
          {
            key: "B",
            text: "sudo systemctl enable",
            isCorrect: false,
            explanation: "enable শুধু Boot এর সাথে জোড়ে, ফাইল আবার পড়ায় না।",
          },
          {
            key: "C",
            text: "sudo systemctl reload",
            isCorrect: false,
            explanation: "reload App কে তার Config আবার পড়তে বলে, Unit ফাইল নয়। আমাদের App reload জানেও না।",
          },
          {
            key: "D",
            text: "Server Reboot",
            isCorrect: false,
            explanation: "Reboot এ কাজ হবে, কারণ Boot এ systemd সব ফাইল পড়ে। কিন্তু এক লাইনের কাজে Reboot অকারণ।",
          },
        ],
      },
      {
        id: 8,
        text: "status এ লেখা code=exited, status=203/EXEC। প্রথমে কী পরীক্ষা করবেন?",
        options: [
          {
            key: "A",
            text: "App এর Code এ কোনো Exception আছে কি না",
            isCorrect: false,
            explanation: "App এর Code পর্যন্ত যাওয়াই হয়নি। Exception হলে সাধারণত status=1/FAILURE।",
          },
          {
            key: "B",
            text: "ExecStart এর Program এর Path সঠিক কি না আর User টা সেটা চালাতে পারে কি না",
            isCorrect: true,
            explanation:
              "ঠিক। 203/EXEC মানে systemd Program টা চালাতেই পারেনি। nvm এর Home Folder এর Path এর সবচেয়ে চেনা কারণ। which node দেখে পুরো Path দিন।",
          },
          {
            key: "C",
            text: "Port 3000 এ অন্য কেউ বসে আছে কি না",
            isCorrect: false,
            explanation: "সেটা হলে App চালু হয়ে EADDRINUSE বলে মরত, status=1।",
          },
          {
            key: "D",
            text: "Firewall এ Port খোলা আছে কি না",
            isCorrect: false,
            explanation: "Firewall বাইরের Request আটকায়, Program চালু হওয়া নয়।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "my-tours কে নিজের Server এ Service বানান, তারপর ভাঙুন",
    subtitle: "Multipass এর Ubuntu VM বা আপনার VPS এ, deploy User হয়ে",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের Process গাছ চিনুন",
        description:
          "নিজের Shell এর PID আর PPID বের করুন, পুরো গাছ দেখুন, আর PID 1 থেকে আপনার Shell পর্যন্ত প্রতিটা ধাপ কে, সেটা লিখে ফেলুন।",
      },
      {
        title: "Job, Signal আর Exit Code",
        description:
          "নিজের Shell এ লাইন ধরে ধরে লিখুন: Background Job চালান, থামান, আবার চালান। চারটা Signal দিয়ে চারটা sleep মারুন আর প্রতিটার Exit Code মিলিয়ে দেখুন ১২৮ যোগ নম্বরের নিয়ম খাটে কি না। তারপর SSH কাটার পরীক্ষাটা করুন।",
      },
      {
        title: "App টা তৈরি রাখুন",
        description:
          "server.mjs Home Folder এ রাখুন। আগে হাতে চালিয়ে দেখুন PORT ছাড়া চালু হয় না, আর PORT দিলে চলে।",
      },
      {
        title: "Service বসান আর চালান",
        description:
          "mytours User, দুইটা Folder, env ফাইল আর Unit ফাইল বসিয়ে enable --now। status পড়ুন, curl দিয়ে /health দেখুন, আর is-enabled ও is-active দুইটাই লিখে রাখুন।",
      },
      {
        title: "থামান, মারুন, ভাঙুন",
        description:
          "একটা ধীর Request চলার মাঝে stop দিন। kill -9 দিয়ে Crash ঘটিয়ে Restart দেখুন। হাতের kill এ কী হয় দেখুন। PORT মুছে Crash Loop বানান, Start Limit বসিয়ে থামান, তারপর ঠিক করুন।",
      },
      {
        title: "Reboot আর একটু শক্ত করা",
        description:
          "sudo reboot দিয়ে আবার ঢুকে প্রমাণ করুন App নিজে উঠেছে। তারপর hardening Drop-in বসিয়ে systemd-analyze security এর নম্বর আগে আর পরে মাপুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-process-tree.sh",
        language: "bash",
        code: `# ১. আপনি কে, আর আপনার বাবা কে
echo "my shell PID: $$"; echo "its parent: $PPID"
ps -o pid,ppid,user,stat,cmd -p $$,$PPID

# ২. পুরো গাছ, দুইভাবে
ps -ef --forest
pstree -p

# ৩. কে সবচেয়ে বেশি Memory নিচ্ছে
ps aux --sort=-%mem | head -5

# ৪. PID 1 আসলে কে
ps -o pid,cmd -p 1
readlink -f /sbin/init       # দেখাবে /usr/lib/systemd/systemd

# দেখার কথা: আপনার bash এর বাবা একটা sshd, তার বাবা আরেকটা sshd,
# আর একদম উপরে systemd(1)। আপনার গাছের প্রতিটা ধাপ খাতায় লিখুন।`,
      },
      {
        filename: "2-jobs-signals.sh",
        language: "bash",
        code: `# এই ফাইলটা bash দিয়ে Script হিসেবে চালাবেন না। লাইন ধরে ধরে নিজের Shell এ লিখুন,
# কারণ Job এর হিসাব আর Stopped এর খবর শুধু Interactive Shell রাখে।

# ১. Job: চালানো, থামানো, আবার চালানো
sleep 600 &
sleep 700 &
jobs -l
kill -STOP %1        # Ctrl+Z এর কাজ
jobs -l              # [1] Stopped
ps -o pid,stat,cmd --ppid $$     # sleep 600 এর STAT হবে T
kill -CONT %1; kill %1 %2

# ২. Signal আর Exit Code: ১২৮ যোগ Signal নম্বর
sleep 300 & kill $!;       wait $!; echo "SIGTERM -> $?"   # 143
sleep 300 & kill -INT $!;  wait $!; echo "SIGINT  -> $?"   # 130
sleep 300 & kill -KILL $!; wait $!; echo "SIGKILL -> $?"   # 137
sleep 300 & kill -HUP $!;  wait $!; echo "SIGHUP  -> $?"   # 129

# ৩. SSH কাটলে কী হয়: এই দুইটা লাইন দিয়ে SSH Window টা জোর করে বন্ধ করুন
sleep 901 &
nohup sleep 902 > /dev/null 2>&1 &
# তারপর নতুন করে SSH দিয়ে ঢুকে দেখুন কে বেঁচে আছে, আর তার PPID কত
ps -o pid,ppid,stat,cmd -u "$USER" | grep "[s]leep"
pkill -u "$USER" -x sleep    # পরিষ্কার করে ফেলুন`,
      },
      {
        filename: "3-server.mjs",
        language: "javascript",
        code: `// ~/server.mjs হিসেবে রাখুন। আগে হাতে চালিয়ে দেখুন:
//   node ~/server.mjs                                 -> Error: PORT is not set
//   PORT=3000 SHUTDOWN_GRACE_MS=10000 node ~/server.mjs -> listening on 127.0.0.1:3000
import http from "node:http";

const port = Number(process.env.PORT);
const graceMs = Number(process.env.SHUTDOWN_GRACE_MS);
if (!port) throw new Error("PORT is not set");
if (!graceMs) throw new Error("SHUTDOWN_GRACE_MS is not set");

const tours = [
  { slug: "saint-martin", title: "Saint Martin Island Escape" },
  { slug: "sundarbans-cruise", title: "Sundarbans Mangrove Cruise" },
];

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok", pid: process.pid }));
  }
  if (req.url === "/api/tours") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(tours));
  }
  if (req.url === "/slow") {
    return setTimeout(() => res.end("slow booking done\\n"), 5000);
  }
  res.writeHead(404).end();
});

server.listen(port, "127.0.0.1", () => {
  console.log(\`my-tours api listening on 127.0.0.1:\${port}, pid \${process.pid}\`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, finishing open requests");
  server.close(() => {
    console.log("all requests done, exiting with code 0");
    process.exit(0);
  });
  server.closeIdleConnections();
  setTimeout(() => {
    console.log("grace period over, exiting with code 1");
    process.exit(1);
  }, graceMs).unref();
});`,
      },
      {
        filename: "4-install-service.sh",
        language: "bash",
        code: `set -euo pipefail
NODE_BIN="$(command -v node)"     # Unit ফাইলে পুরো Path লাগবে
echo "node is at $NODE_BIN"

# ১. App এর নিজের User, Login ছাড়া (লেসন ০৪)
sudo useradd --system --no-create-home --shell /usr/sbin/nologin mytours

# ২. Code আর Setting, root এর মালিকানায়, mytours শুধু পড়তে পারে
sudo install -d -o root -g mytours -m 750 /srv/my-tours /etc/my-tours
sudo install -o root -g mytours -m 640 ~/server.mjs /srv/my-tours/server.mjs
printf "NODE_ENV=production\\nPORT=3000\\nSHUTDOWN_GRACE_MS=10000\\n" \\
  | sudo install -o root -g mytours -m 640 /dev/stdin /etc/my-tours/api.env

# ৩. Unit ফাইল
sudo tee /etc/systemd/system/my-tours-api.service > /dev/null <<UNIT
[Unit]
Description=my-tours API (Node.js)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=mytours
Group=mytours
WorkingDirectory=/srv/my-tours
EnvironmentFile=/etc/my-tours/api.env
ExecStart=$NODE_BIN /srv/my-tours/server.mjs
Restart=on-failure
RestartSec=2
TimeoutStopSec=15

[Install]
WantedBy=multi-user.target
UNIT

# ৪. systemd কে ফাইল পড়ানো, Boot এর সাথে জোড়া, আর এখনই চালু করা
sudo systemctl daemon-reload
systemctl is-enabled my-tours-api || true      # disabled
sudo systemctl enable --now my-tours-api       # Created symlink ...
sleep 1
systemctl is-enabled my-tours-api              # enabled
systemctl is-active my-tours-api               # active
sudo systemctl status my-tours-api --no-pager
curl -s http://127.0.0.1:3000/health; echo     # {"status":"ok","pid":...}`,
      },
      {
        filename: "5-stop-crash-loop.sh",
        language: "bash",
        code: `# ১. ভদ্রভাবে থামানো: ধীর Request চলার মাঝে stop
curl -s http://127.0.0.1:3000/slow &
sleep 1; date +%T; sudo systemctl stop my-tours-api; date +%T; wait
sudo journalctl -u my-tours-api -n 5 -o short-iso   # SIGTERM received ... exiting with code 0
sudo systemctl start my-tours-api

# ২. Crash: SIGKILL, তারপর systemd নিজে চালায়
systemctl show my-tours-api -p MainPID -p NRestarts
sudo kill -9 "$(systemctl show -p MainPID --value my-tours-api)"
sleep 3; systemctl show my-tours-api -p MainPID -p NRestarts   # নতুন PID, NRestarts=1

# ৩. ফাঁদ: হাতের kill, মানে SIGTERM, তারপর?
sudo kill "$(systemctl show -p MainPID --value my-tours-api)"
sleep 4; systemctl show my-tours-api -p ActiveState -p Result  # inactive, success
sudo systemctl start my-tours-api

# ৪. Crash Loop: PORT মুছে দিন
sudo sed -i "/^PORT=/d" /etc/my-tours/api.env
sudo systemctl restart my-tours-api
sleep 30; systemctl show my-tours-api -p NRestarts   # বাড়তেই থাকবে

# ৫. Start Limit বসান, তারপর আবার দেখুন
sudo mkdir -p /etc/systemd/system/my-tours-api.service.d
printf "[Unit]\\nStartLimitIntervalSec=60\\nStartLimitBurst=5\\n" \\
  | sudo tee /etc/systemd/system/my-tours-api.service.d/override.conf
sudo systemctl daemon-reload
sudo systemctl reset-failed my-tours-api; sudo systemctl restart my-tours-api
sleep 20; systemctl status my-tours-api --no-pager | head -5   # failed
sudo journalctl -u my-tours-api -o cat | grep "Start request"  # repeated too quickly

# ৬. সারিয়ে তুলুন
echo "PORT=3000" | sudo tee -a /etc/my-tours/api.env
sudo systemctl reset-failed my-tours-api; sudo systemctl start my-tours-api
systemctl is-active my-tours-api      # active`,
      },
      {
        filename: "6-reboot-harden.sh",
        language: "bash",
        code: `# ১. Reboot এর আগে PID লিখে রাখুন, তারপর Reboot
systemctl show -p MainPID my-tours-api
sudo reboot
# এক মিনিট পরে আবার SSH দিয়ে ঢুকুন, তারপর:
systemctl is-active my-tours-api
systemctl show -p MainPID -p ActiveEnterTimestamp my-tours-api
systemd-analyze critical-chain my-tours-api.service
curl -s 127.0.0.1:3000/health; echo

# ২. নিরাপত্তার নম্বর, আগে
systemd-analyze security my-tours-api | tail -1

# ৩. চারটা দেয়াল, আলাদা Drop-in এ
printf "[Service]\\nNoNewPrivileges=true\\nPrivateTmp=true\\nProtectSystem=strict\\nProtectHome=true\\n" \\
  | sudo tee /etc/systemd/system/my-tours-api.service.d/hardening.conf
sudo systemctl daemon-reload && sudo systemctl restart my-tours-api
sleep 1                                 # Type=simple: restart ফেরে App তৈরি হওয়ার আগেই
curl -s 127.0.0.1:3000/health; echo     # App কি এখনো চলছে?

# ৪. নিরাপত্তার নম্বর, পরে, আর পুরো মিলিত Unit
systemd-analyze security my-tours-api | tail -1
systemctl cat my-tours-api`,
      },
    ],
    tip: "পরীক্ষা ৫ এর দুইটা অংশ পাশাপাশি রেখে ভাবুন, কারণ এই লেসনের সবচেয়ে কাজের শিক্ষা ওখানেই। kill -9 এর পরে App দুই সেকেন্ডে ফিরে এলো, অথচ সাধারণ kill এর পরে চিরতরে বন্ধ রইল। পার্থক্যটা App এর নয়, systemd এর চোখের: একটা ব্যর্থ মৃত্যু, আরেকটা পরিষ্কার বিদায়। Production এ যখন কেউ বলবেন Service টা আপনা আপনি বন্ধ হয়ে গেছে, প্রথম প্রশ্ন হবে কীভাবে থেমেছিল, আর systemctl status এর Active আর Process লাইনদুটো সেই উত্তর লিখে রাখে।",
  },
  assignment: {
    title: "Mini Project: my-tours কে Production এর মতো চালানো",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>নিজের Server এর গাছ আঁকুন:</strong> pstree -p এর Output দেখে কাগজে আপনার Server
        এর Process গাছ আঁকুন, PID 1 থেকে আপনার Shell পর্যন্ত, আর my-tours এর node পর্যন্ত।
        প্রতিটা Process এর পাশে এক লাইনে লিখুন সে কে, কে তাকে চালু করেছে, আর আপনি Logout করলে
        সে বাঁচবে কি না।
      </span>,
      <span key="2">
        <strong>Signal এর খাতা:</strong> SIGHUP, SIGINT, SIGTERM, SIGKILL আর SIGSTOP, পাঁচটার
        প্রতিটা একটা sleep এর উপর চালান। একটা টেবিলে লিখুন: Exit Code কত, STAT কী হলো, ধরা যায়
        কি না, আর বাস্তবে কে এই Signal পাঠায়। তারপর SSH কাটার পরীক্ষাটা করে প্রমাণ দিন কোন
        Process বাঁচল আর তার PPID কত হলো।
      </span>,
      <span key="3">
        <strong>my-tours-api.service বসান:</strong> নিজের Practice Server এ পুরো Service টা বসান।
        জমা দিন Unit ফাইল, sudo systemctl status এর Output, curl এর উত্তর, আর Reboot এর আগে ও পরের
        MainPID আর ActiveEnterTimestamp, যাতে বোঝা যায় কেউ হাতে চালু করেনি।
      </span>,
      <span key="4">
        <strong>তিনভাবে ভাঙুন, তিনভাবে সারান:</strong> এক, ExecStart এ ভুল Path দিয়ে
        203/EXEC। দুই, api.env থেকে PORT মুছে Crash Loop, Start Limit সহ আর ছাড়া। তিন, App এর
        SIGTERM Handler সরিয়ে আর TimeoutStopSec=5 দিয়ে একটা ধীর Request চলার মাঝে stop। প্রতিটার
        status এর Active লাইন আর Journal এর আসল কারণের লাইনটা জমা দিন, আর পাশে এক লাইনে লিখুন
        কীভাবে ঠিক করলেন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন নতুন সদস্য লিখেছেন, আমি তো
        nohup দিয়ে চালাই, দিব্যি চলে, systemd শিখে কী হবে? তাঁকে বোঝান nohup ঠিক কোন একটা
        বিপদ থেকে বাঁচায় আর কোন তিনটা থেকে বাঁচায় না, enable আর start এর তফাত কী, আর একদিন
        status এ failed দেখলে প্রথম দুইটা কমান্ড কোনটা লিখবেন।
      </span>,
    ],
    deliverables: [
      <span key="1">Process গাছের ছবি, প্রতিটা Process এর এক লাইনের ব্যাখ্যা সহ</span>,
      <span key="2">পাঁচ Signal এর টেবিল আর SSH কাটার পরীক্ষার Output</span>,
      <span key="3">Unit ফাইল, status, curl, আর Reboot এর আগে ও পরের প্রমাণ</span>,
      <span key="4">তিনটা ভাঙনের status লাইন, Journal এর কারণ, আর সমাধান</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
