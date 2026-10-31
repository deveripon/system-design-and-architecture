/**
 * What: Module 07 Lesson 07, System Logs. Where every log line on an Ubuntu server goes, how to
 * read and filter it with journalctl, how to read a failed systemctl status and a crash loop, the
 * kernel's OOM killer, the text files in /var/log and Caddy's own logs, keeping logs from filling
 * the disk, and writing app logs that help at two in the morning.
 *
 * Why: Module 06 promised to say where the logs are, and every later lesson that breaks
 * something will send the reader here to find out why. Every command output in this file was
 * captured on the Ubuntu 24.04 practice server, and every lab script was run end to end before
 * it was pasted in.
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
  CrashReadLab,
  JournalFilterLab,
  PriorityPrefixLab,
} from "../../../components/course/topics/linux/logs-animations";
import {
  CrashLoopTimelineDiagram,
  GoodBadLogSplit,
  LogDiskSplit,
  LogFlowDiagram,
  LogLineAnatomyDiagram,
  StatusAnatomyDiagram,
} from "../../../components/course/topics/linux/logs-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

function Lesson({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-primary underline underline-offset-4">
      {children}
    </Link>
  );
}

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4"
    >
      {children}
    </a>
  );
}

export const systemLogsContent: TopicData = {
  id: "system-logs",
  introduction: {
    badge: "MODULE 07 · LESSON 07",
    title: <SectionTitle>Server কী বলেছিল, যখন কেউ দেখছিল না</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          রাত দুইটা দশ। চট্টগ্রাম থেকে একজন পর্যটক Island Tours এ সেন্ট মার্টিনের বুকিং
          দিতে গিয়ে একটা Error দেখলেন, আর সকালে একটা Email লিখলেন। আপনি সকাল নয়টায় সেটা
          পড়লেন। Server এখন দিব্যি চলছে, পাতা খুলছে, বুকিং হচ্ছে। সাত ঘণ্টা আগে কী
          হয়েছিল, সেটা দেখার কেউ ছিল না। কেউ ছিল না, শুধু একজন ছাড়া: Server নিজে, যে
          প্রতিটা ঘটনা চুপচাপ খাতায় লিখে রাখে।
        </ContentParagraph>
        <ContentParagraph>
          সেই খাতার নাম Log। আগের লেসনগুলোতে আপনি Server এ ঢুকেছেন, Service চালিয়েছেন,
          Permission আর Firewall সাজিয়েছেন। কিন্তু কিছু ভাঙলে প্রথম যে প্রশ্নটা করবেন,
          সেটা হলো কী হয়েছিল, আর তার উত্তর থাকে শুধু Log এ। Module 06 এর শেষে একটা কথা
          দিয়েছিলাম, Log খুঁজতে কোথায় যেতে হয় সেটা বলব। এই লেসন সেই কথা রাখার জন্য।
        </ContentParagraph>
        <ContentParagraph>
          শেষে আপনি জানবেন একটা Log লাইন কে লেখে আর কোথায় জমা হয়, <code>journalctl</code>{" "}
          দিয়ে হাজার লাইনের মধ্যে ঠিক দরকারি তিনটা কীভাবে বের করতে হয়, ব্যর্থ একটা{" "}
          <code>systemctl status</code> কীভাবে পড়তে হয়, একটা Crash Loop এ আসল কারণটা কোন
          লাইনে লুকিয়ে থাকে, Kernel কখন নিজে একটা Process মেরে ফেলে, Caddy এর Log কোথায়,
          Log কীভাবে নিঃশব্দে Disk ভরিয়ে ফেলে আর সেটা কীভাবে আটকাতে হয়, আর নিজের App এর
          Log কেমন হলে রাত দুইটায় সত্যিই কাজে লাগে। প্রতিটা ফলাফল Practice Server এ আসলে
          চালিয়ে নেওয়া।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ভালো Log একটা ভালো ডায়েরির মতো। কখন, কে, কী করল, আর কেন পারল না, এক লাইনে। খারাপ Log সেই ডায়েরি, যার পাতায় শুধু লেখা আছে আজ মনটা ভালো নেই।",
      author: "System Logs",
      role: "Lesson 07",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-logs",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>রাত দুইটা দশ, আর একমাত্র সাক্ষী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Server কে বাইরে থেকে দেখলে মনে হয় একটা বন্ধ বাক্স। ভেতরে কয়েকশো Process
                চলছে, প্রতি সেকেন্ডে Request আসছে, কেউ বুকিং দিচ্ছেন, কেউ Login করছেন, মাঝে
                মাঝে কেউ ভুল Password দিয়ে ঢোকার চেষ্টা করছে। এর কোনোটাই আপনি সরাসরি দেখেন
                না। আপনি দেখেন শুধু দুইটা জিনিস: এই মুহূর্তে বাক্সটা কেমন আছে, আর আগে কী
                ঘটেছিল তার লিখিত বিবরণ।
              </ContentParagraph>
              <ContentParagraph>
                প্রথমটা Monitoring, পরের লেসনে <code>top</code> আর <code>htop</code> দিয়ে
                শিখবেন। দ্বিতীয়টা Log। পার্থক্যটা মনে রাখার একটা সহজ উপায় আছে। Monitoring
                হলো রোগীর এখনকার তাপমাত্রা, Log হলো রোগীর গত রাতের বিবরণ যেটা নার্স খাতায়
                লিখে গেছেন। ডাক্তার সকালে এসে দুইটাই দেখেন, কিন্তু রাতে কী হয়েছিল সেটা
                তাপমাত্রা দেখে কখনো জানা যায় না।
              </ContentParagraph>
              <ContentParagraph>
                Log মানে একটা Program এর লেখা ছোট ছোট লাইন, প্রতিটায় একটা ঘটনা: আমি চালু
                হলাম, একটা Request এলো, Database এ পৌঁছাতে পারলাম না, আমাকে থামতে বলা হলো।
                প্রতিটা লাইনের সাথে সময় লেখা থাকে। তাই Log একসাথে তিনটা প্রশ্নের উত্তর দেয়:
                কী ঘটেছিল, কখন ঘটেছিল, আর কোনটার পরে কোনটা ঘটেছিল। শেষ প্রশ্নটাই সবচেয়ে
                দামি, কারণ সমস্যার কারণ প্রায় সবসময় তার ফলাফলের আগে ঘটে।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনে পুরো কাজটা একটা অভ্যাসে নামিয়ে আনব। কিছু ভাঙলে আপনি আন্দাজ করবেন
                না, Code খুলে বসবেন না, আগে জিজ্ঞেস করবেন Server কী বলেছিল। প্রায় সব সময়
                উত্তরটা একটা লাইনে লেখা থাকে, শুধু জানতে হয় কোন খাতায়, আর হাজার লাইনের ভিড়
                থেকে সেটা কীভাবে তুলে আনতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের Practice Server",
          content: (
            <p>
              সব ফলাফল নেওয়া হয়েছে লেসন ০১ এ বানানো ধরনের একটা Ubuntu 24.04 Practice Server
              থেকে, যার নাম <code>island-vps-01</code>। তাতে লেসন ০২ এর মতো একটা{" "}
              <code>my-tours-api.service</code> চলছে, সাথে Caddy। Server টা আসলে একটা
              Container এর ভেতরে চলছিল। যেখানে সেই কারণে ফলাফল আসল VPS থেকে আলাদা দেখায়,
              সেখানে এক লাইনে বলে দেওয়া আছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "two-places",
      subHeader: { index: "002", title: "Where Logs Live" },
      title: <SectionTitle>Log কোথায় থাকে: একটা Journal আর কিছু Text File</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পুরনো দিনে প্রতিটা Program নিজের মতো করে একটা Text File এ লিখত, আর কোন File
                কোথায় সেটা মুখস্থ রাখতে হতো। আজকের Ubuntu তে প্রায় সবকিছু এক জায়গায় জমা হয়।
                সেই জায়গার রক্ষকের নাম <strong>systemd-journald</strong>, ছোট করে journald।
                লেসন ০২ এর systemd পরিবারেরই একজন সদস্য, যার একমাত্র কাজ সবার লাইন সংগ্রহ
                করা।
              </ContentParagraph>
              <ContentParagraph>journald চারটা জায়গা থেকে লাইন পায়:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Kernel থেকে।</strong> Disk এর গোলমাল, Network Card এর খবর, আর
                  Memory ফুরিয়ে গেলে কাকে মারা হলো, সব।
                </ListItem>
                <ListItem>
                  <strong>systemd নিজে থেকে।</strong> কোন Service কখন চালু হলো, কখন থামল,
                  কতবার আবার চালু করা হলো।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Service এর stdout আর stderr থেকে।</strong> আপনার App যা
                  Print করে, systemd সেটা ধরে journald কে দেয়। এটাই সবচেয়ে বড় অংশ, পরের দুই
                  Section এ আলাদা করে দেখব।
                </ListItem>
                <ListItem>
                  <strong>syslog নামের পুরনো দরজা দিয়ে।</strong> sshd, sudo, cron এর মতো
                  পুরনো Program গুলো এই দরজা দিয়ে লেখে, journald সেটাও শোনে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                journald লাইনগুলো একটা Binary ফরম্যাটে রাখে, সাধারণ Text হিসেবে নয়। তাই{" "}
                <code>cat</code> দিয়ে পড়া যায় না, পড়তে হয় <code>journalctl</code> দিয়ে।
                বিনিময়ে প্রতিটা লাইনের সাথে অনেক তথ্য Index করা থাকে, যার জোরে পরে এক সেকেন্ডে
                ছাঁকা যায়। কোথায় রাখে, সেটা ঠিক হয় একটা Folder আছে কি না দেখে।{" "}
                <code>/var/log/journal</code> থাকলে Journal থাকে Disk এ, Reboot এর পরেও।
                না থাকলে থাকে <code>/run/log/journal</code> এ, যেটা Memory তে, Reboot এ
                মুছে যায়। Ubuntu 24.04 এ প্রথমটা আগে থেকেই থাকে, তাই আপনার Journal স্থায়ী।
              </ContentParagraph>
              <ContentParagraph>
                এরপর একটা কপি। Ubuntu journald কে বলে রেখেছে প্রতিটা লাইন rsyslog নামের আরেকটা
                Program কে দিতে, আর rsyslog সেগুলো পুরনো ধাঁচের Text File এ লেখে:{" "}
                <code>/var/log/syslog</code> এ প্রায় সব, <code>/var/log/auth.log</code> এ
                Login আর sudo, <code>/var/log/kern.log</code> এ Kernel এর কথা। একই লাইন তাই
                দুই জায়গায় থাকে। কেন? কারণ অনেক পুরনো Tool, অনেক অভ্যাস আর অনেক Monitoring
                ব্যবস্থা এখনো Text File পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LogFlowDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Practice Server এ নিজের চোখে দেখি। প্রথমে /var/log এর ভেতরটা, তারপর দুইটা
              Journal Folder, আর শেষে সেই ছোট্ট Setting যেটা কপি পাঠানোর নির্দেশ দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "where-logs-live.txt",
          code: `deploy@island-vps-01:~$ ls /var/log
README            auth.log       caddy    dpkg.log     journal   private  wtmp
alternatives.log  bootstrap.log  dmesg    faillog      kern.log  syslog
apt               btmp           dmesg.0  islandtours  lastlog   sysstat

deploy@island-vps-01:~$ ls -l /var/log/syslog /var/log/auth.log
-rw-r----- 1 syslog adm  2728 Oct 31 07:28 /var/log/auth.log
-rw-r----- 1 syslog adm 51131 Oct 31 07:28 /var/log/syslog

deploy@island-vps-01:~$ ls -ld /var/log/journal /run/log/journal
drwxr-sr-x+ 2 root systemd-journal   40 Oct 31 07:23 /run/log/journal
drwxr-sr-x+ 1 root systemd-journal 4096 Oct 31 07:23 /var/log/journal

deploy@island-vps-01:~$ journalctl --disk-usage
Archived and active journals take up 8.0M in the file system.

# Ubuntu নিজে এই ছোট File টা দিয়ে রেখেছে: প্রতিটা লাইনের কপি rsyslog কে দেওয়ার নির্দেশ
deploy@island-vps-01:~$ cat /usr/lib/systemd/journald.conf.d/syslog.conf
# Undo upstream commit 46b131574fdd7d77 for now. For details see
#  http://lists.freedesktop.org/archives/systemd-devel/2014-November/025550.html

[Journal]
ForwardToSyslog=yes`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "No journal files were opened, মানে আপনার অনুমতি নেই",
          content: (
            <div className="space-y-3">
              <p>
                সবার Log সবাই পড়তে পারে না, কারণ Log এ Login এর চেষ্টা, IP আর অনেক সময়
                ব্যক্তিগত তথ্য থাকে। উপরের <code>ls -l</code> এ দেখুন, syslog আর auth.log
                এর Group হলো <code>adm</code>, আর বাইরের কারো পড়ার অনুমতি নেই। journalctl
                এর নিয়মও একই। deploy যদি <code>adm</code> বা <code>systemd-journal</code>{" "}
                Group এ না থাকে, তাহলে এমন দেখায়:
              </p>
              <pre className="overflow-x-auto bg-muted/40 p-3 font-mono text-xs">{`deploy@island-vps-01:~$ journalctl -u caddy -n 2
Hint: You are currently not seeing messages from other users and the system.
      Users in groups 'adm', 'systemd-journal' can see all messages.
      Pass -q to turn off this notice.
No journal files were opened due to insufficient permissions.`}</pre>
              <p>
                সমাধান একবারই: <code>sudo usermod -aG adm deploy</code>, তারপর বেরিয়ে
                আবার SSH করে ঢোকা, কারণ নতুন Group নতুন Login থেকে কাজ করে। Group আর
                Permission এর পুরো গল্প লেসন ০৪ এ। প্রতিবার <code>sudo journalctl</code>{" "}
                লেখার চেয়ে এটা ভালো, কারণ Log পড়ার জন্য পুরো Server এর চাবি লাগার কথা নয়।
              </p>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "anatomy",
      subHeader: { index: "003", title: "Anatomy" },
      title: <SectionTitle>একটা লাইনের ভেতরে কী কী থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                journalctl যে লাইনগুলো দেখায়, তার প্রত্যেকটা একই ছাঁচে কাটা। একবার ছাঁচটা
                চিনলে হাজার লাইনের ভিড়েও চোখ ঠিক জায়গায় পড়ে। নিচের লাইনটা Practice Server এর
                আসল একটা লাইন, যেদিন my-tours-api চালু হতেই পড়ে যাচ্ছিল।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LogLineAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>সময়।</strong> Server এর নিজের ঘড়িতে। Island Tours এর Server এর ঘড়ি
                  UTC তে চলে, তাই এই 07:25 মানে ঢাকায় দুপুর 01:25। এই রূপান্তর নিয়ে সেকশন
                  ০০৭ এ আলাদা করে কথা হবে, কারণ ভুল হলে ভুল সময়ের Log খুঁজবেন।
                </ListItem>
                <ListItem>
                  <strong>Host।</strong> লাইনটা কোন যন্ত্রের। এক Server এ সবসময় একই, কিন্তু
                  অনেক Server এর Log এক জায়গায় জমা করলে এটাই বলে কোনটা কার।
                </ListItem>
                <ListItem>
                  <strong>Program আর PID।</strong> <code>node[502]</code> মানে Program এর নাম
                  node, আর Process নম্বর 502 (লেসন ০২)। লক্ষ করুন, এখানে my-tours-api লেখা
                  নেই, লেখা আছে node, কারণ আসল Program টা Node। Service এর নাম থাকে লুকানো
                  Field এ।
                </ListItem>
                <ListItem>
                  <strong>বার্তা।</strong> Program নিজে যা বলেছে, হুবহু।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                চোখে না পড়া অংশটাই আসল শক্তি। journald প্রতিটা লাইনের সাথে কয়েক ডজন Field
                রাখে: কোন Service এর, কোন User এর, কোন Boot এর, কতটা গুরুতর। দেখতে চাইলে{" "}
                <code>-o verbose</code>। নিচে একই বার্তার শেষবারের লাইনটা, তখন PID ছিল 551,
                পুরো চেহারায়। কয়েকটা লম্বা ID বাদ দেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "one-line-verbose.txt",
          code: `deploy@island-vps-01:~$ journalctl -u my-tours-api -o verbose -n 1 --grep "DATABASE_URL"
Sat 2026-10-31 07:25:37.419675 UTC [s=03b6a68d...;i=b60;b=f6453a4a...]
    PRIORITY=6
    _BOOT_ID=f6453a4a7b824e5d912b76cfd40c5e3c
    _HOSTNAME=island-vps-01
    SYSLOG_FACILITY=3
    _TRANSPORT=stdout
    SYSLOG_IDENTIFIER=node
    _UID=997
    _GID=995
    _COMM=node
    _EXE=/usr/bin/node
    _CMDLINE=/usr/bin/node /srv/my-tours/server.mjs
    _SYSTEMD_CGROUP=/system.slice/my-tours-api.service
    _SYSTEMD_UNIT=my-tours-api.service
    MESSAGE=Error: DATABASE_URL is not set
    _PID=551`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দুইটা Field আলাদা করে মনে রাখুন। <code>_SYSTEMD_UNIT</code> বলে লাইনটা কোন
              Service এর, আর <code>PRIORITY=6</code> বলে journald এটাকে কতটা গুরুতর ভেবেছে। 6
              মানে সাধারণ খবর, info। ভেতরে Error লেখা থাকলেও! এই অদ্ভুত ব্যাপারটা সেকশন ০০৮ এর
              সবচেয়ে বড় শিক্ষা, এখন শুধু চোখে রাখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "stdout",
      subHeader: { index: "004", title: "stdout to Journal" },
      title: <SectionTitle>App শুধু বলে, systemd লিখে রাখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিজের App এর Log কোথায় রাখবেন, এই প্রশ্নের সবচেয়ে ভালো উত্তর হলো: কোথাও না।
                App শুধু stdout এ Print করবে, ঠিক যেমন Terminal এ চালালে করে। বাকি কাজ systemd
                এর। লেসন ০২ এ যখন <code>my-tours-api.service</code> বানিয়েছেন, তখন systemd
                App টাকে চালু করার সময় তার stdout আর stderr এর অন্য প্রান্তটা journald এর
                হাতে দিয়ে রেখেছে। App টা জানেও না তার কথা কোথায় যাচ্ছে।
              </ContentParagraph>
              <ContentParagraph>
                এটা একটা ছোট সিদ্ধান্ত মনে হয়, কিন্তু অনেক ঝামেলা বাঁচায়। App কে কোনো Log
                File খুলতে হয় না, Permission নিয়ে ভাবতে হয় না, File কত বড় হলো সেটা দেখতে হয়
                না। প্রতিটা লাইনের সাথে সময়, PID আর Service এর নাম journald নিজে বসায়।
                পরে Docker Module এ দেখবেন Container ও ঠিক এই নিয়মে চলে, App stdout এ লেখে আর{" "}
                <code>docker logs</code> সেটা দেখায়। তাই এই অভ্যাস একবার গড়লে সব জায়গায় কাজে
                লাগে।
              </ContentParagraph>
              <ContentParagraph>
                Practice Server এর my-tours-api প্রতিটা ঘটনা একটা JSON লাইন হিসেবে Print করে।
                Log লেখার পুরো ব্যবস্থা এই ছোট একটা Function:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "/srv/my-tours/server.mjs (অংশ)",
          code: `// সব Log একটা JSON লাইন, যাতে পরে journalctl আর jq দিয়ে খোঁজা যায়।
function log(level, msg, fields = {}) {
  const line = JSON.stringify({ time: new Date().toISOString(), level, msg, ...fields });
  if (level === "error") process.stderr.write(line + "\\n");
  else process.stdout.write(line + "\\n");
}

// দরকারি Setting না থাকলে এখনই থামুন, পরে ভাঙার চেয়ে এখন ভাঙা ভালো।
for (const name of ["PORT", "DATABASE_URL"]) {
  if (!process.env[name]) throw new Error(\`\${name} is not set\`);
}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              App চালু হলো, দুইটা Request এলো, আর একটা বুকিং আটকে গেল। কোনো File খোলা ছাড়াই
              সব Journal এ পৌঁছে গেছে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "app-lines-in-journal.txt",
          code: `deploy@island-vps-01:~$ curl -s -H "X-Request-Id: req-7Q2M" http://127.0.0.1:3000/api/tours
ok
deploy@island-vps-01:~$ curl -s -H "X-Request-Id: req-9K1P" http://127.0.0.1:3000/api/boom
conflict
deploy@island-vps-01:~$ journalctl -u my-tours-api -n 4
Oct 31 07:45:50 island-vps-01 systemd[1]: Started my-tours-api.service - my-tours API.
Oct 31 07:45:50 island-vps-01 node[358]: {"time":"2026-10-31T07:45:50.464Z","level":"info","msg":"listening","port":3000}
Oct 31 07:45:51 island-vps-01 node[358]: {"time":"2026-10-31T07:45:51.746Z","level":"info","msg":"request","requestId":"req-7Q2M","method":"GET","path":"/api/tours","status":200}
Oct 31 07:45:51 island-vps-01 node[358]: {"time":"2026-10-31T07:45:51.757Z","level":"error","msg":"booking failed","requestId":"req-9K1P","path":"/api/boom","reason":"seat already taken"}`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "App যদি নিজের File এ লেখে?",
          content: (
            <p>
              অনেক পুরনো App বা Library নিজের একটা <code>app.log</code> খুলে সেখানে লেখে। তখন
              সেই লাইনগুলো Journal এ আসে না, journalctl এর কোনো Filter সেখানে কাজ করে না,
              আর File টা কত বড় হলো সেটা দেখার দায়িত্বও আপনার, যেটা সেকশন ০১৩ এ logrotate
              দিয়ে করবেন। নিজের নতুন App এ তাই সোজা নিয়ম: stdout এ লিখুন, বাকিটা systemd কে
              করতে দিন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "first-steps",
      subHeader: { index: "005", title: "journalctl Basics" },
      title: <SectionTitle>journalctl এর প্রথম পাঁচ মিনিট</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শুধু <code>journalctl</code> লিখলে Server এর জন্ম থেকে আজ পর্যন্ত সব লাইন
                খোলে, সবচেয়ে পুরনোটা আগে। Busy Server এ সেটা লাখ লাখ লাইন। তাই কেউ এভাবে
                চালায় না। আসলে কাজে লাগে এই কয়েকটা Option:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লিখুন", "কী হয়", "কখন"],
          rows: [
            [<code key="n">-n 20</code>, "শেষ বিশটা লাইন", "সদ্য কী হলো, এক নজরে"],
            [<code key="e">-e</code>, "Pager খুলে একদম শেষে নিয়ে যায়", "শেষ থেকে উপরে উঠে পড়তে"],
            [<code key="f">-f</code>, "নতুন লাইন আসতেই দেখায়, থামে না", "সমস্যাটা ঘটার সময় পাশে বসে দেখতে"],
            [<code key="r">-r</code>, "উল্টো ক্রম, নতুনটা আগে", "সবচেয়ে সাম্প্রতিক ঘটনা আগে চাইলে"],
            [<code key="np">--no-pager</code>, "Pager ছাড়া সোজা Terminal এ", "Copy করতে, বা অন্য Command এ পাঠাতে"],
            [<code key="o">-o short-iso</code>, "সময় ISO ফরম্যাটে, Timezone সহ", "অন্য Server বা Team এর সাথে মেলাতে"],
            [<code key="oc">-o cat</code>, "শুধু বার্তা, সময় আর নাম ছাড়া", "JSON লাইন jq তে পাঠাতে"],
            [<code key="ov">-o verbose</code>, "সব লুকানো Field", "কোন Filter কাজ করবে বুঝতে"],
            [<code key="oj">-o json</code>, "প্রতিটা লাইন একটা JSON", "Script বা অন্য Tool এর জন্য"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <code>-n</code> আর <code>-e</code> ছাড়া journalctl একটা Pager খোলে, যেটা আসলে{" "}
              <code>less</code>। ভেতরে চলাফেরার চাবিগুলো লেসন ০১ এ less এর সাথে যা শিখেছেন
              সেগুলোই: Space এক পাতা নিচে, <code>b</code> এক পাতা উপরে, <code>G</code>{" "}
              একদম শেষে, <code>g</code> একদম শুরুতে, <code>/</code> লিখে খোঁজা আর{" "}
              <code>n</code> দিয়ে পরেরটায় যাওয়া, <code>q</code> দিয়ে বেরোনো। এবার শেষ আটটা
              লাইন আর লাইভ দেখা, দুইটাই Practice Server থেকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "first-steps.txt",
          code: `deploy@island-vps-01:~$ journalctl -n 8 --no-pager
Oct 31 07:24:55 island-vps-01 systemd[1]: Started caddy.service - Caddy.
Oct 31 07:24:55 island-vps-01 dbus-daemon[82]: [system] Activating via systemd: service name='org.freedesktop.timedate1' unit='dbus-org.freedesktop.timedate1.service' requested by ':1.2' (uid=0 pid=427 comm="timedatectl" label="unconfined")
Oct 31 07:24:55 island-vps-01 systemd[1]: Starting systemd-timedated.service - Time & Date Service...
Oct 31 07:24:55 island-vps-01 dbus-daemon[82]: [system] Successfully activated service 'org.freedesktop.timedate1'
Oct 31 07:24:55 island-vps-01 systemd[1]: Started systemd-timedated.service - Time & Date Service.
Oct 31 07:25:01 island-vps-01 CRON[430]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)
Oct 31 07:25:01 island-vps-01 CRON[431]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Oct 31 07:25:01 island-vps-01 CRON[430]: pam_unix(cron:session): session closed for user root

# লাইভ দেখা: -n 0 মানে পুরনো কিছু নয়, শুধু এখন থেকে আসা লাইন।
# অন্য একটা Terminal থেকে দুইটা Request পাঠানো হলো, লাইনগুলো সাথে সাথে এলো।
deploy@island-vps-01:~$ journalctl -u my-tours-api -f -n 0
Oct 31 07:27:36 island-vps-01 node[592]: {"time":"2026-10-31T07:27:36.282Z","level":"info","msg":"request","requestId":"req-LIVE1","method":"GET","path":"/api/tours","status":200}
Oct 31 07:27:37 island-vps-01 node[592]: {"time":"2026-10-31T07:27:37.888Z","level":"error","msg":"booking failed","requestId":"req-LIVE2","path":"/api/boom","reason":"seat already taken"}
# এখানে Ctrl+C দিয়ে থামানো`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সমস্যা ঘটানোর সময় দুইটা Terminal",
          content: (
            <p>
              কোনো সমস্যা নিজে ঘটিয়ে দেখতে চাইলে একটা Terminal এ{" "}
              <code>journalctl -u my-tours-api -f</code> চালু রাখুন, আরেকটায় Request পাঠান বা
              Service Restart করুন। প্রতিটা কাজের সাথে সাথে কোন লাইন আসে সেটা দেখা, Log পড়া
              শেখার সবচেয়ে দ্রুত পথ। থামাতে <code>Ctrl+C</code>। এটা শুধু journalctl কে
              থামায়, Service এর কিছু হয় না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "which-program",
      subHeader: { index: "006", title: "Filter by Source" },
      title: <SectionTitle>কার লাইন: -u, -t, _PID আর -k</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে বেশি যে Filter লাগবে, সেটা হলো একটা নির্দিষ্ট Service এর লাইন। এর জন্য{" "}
                <code>-u</code>, মানে Unit। <code>journalctl -u my-tours-api</code> দুই রকম
                লাইন একসাথে দেখায়: App নিজে যা Print করেছে, আর systemd এই Service সম্পর্কে যা
                বলেছে (চালু হলো, পড়ে গেল, আবার চালু হলো)। দুইটাই দরকার, কারণ প্রথমটা বলে কেন,
                দ্বিতীয়টা বলে কী হলো।
              </ContentParagraph>
              <ContentParagraph>আরও কয়েকটা Filter, যেগুলো মাঝে মাঝে লাগে:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>-t node</code>, মানে Identifier। শুধু Program এর নিজের লাইন, systemd এর
                  লাইন বাদ। উপরের লাইনের <code>node[502]</code> এর node টাই এটা।
                </ListItem>
                <ListItem>
                  <code>_PID=592</code> একটা নির্দিষ্ট Process এর লাইন, আর{" "}
                  <code>_UID=997</code> একটা User এর সব Process এর লাইন। লুকানো Field এর নাম
                  আর মান লিখে দিলেই হয়, এভাবে যেকোনো Field দিয়ে ছাঁকা যায়।
                </ListItem>
                <ListItem>
                  <code>-k</code> শুধু Kernel এর লাইন। Memory ফুরানো বা Disk এর গোলমাল খুঁজতে
                  (সেকশন ০১১)।
                </ListItem>
                <ListItem>
                  একাধিক <code>-u</code> দিলে সবগুলোর লাইন সময়ের ক্রমে মিশে আসে। Caddy আর App
                  এর লাইন পাশাপাশি দেখতে এটা দারুণ: Caddy কখন Request টা App এর কাছে পাঠাল,
                  আর App ঠিক তখন কী বলল।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মেলানোর নিয়ম একটা: আলাদা ধরনের Filter একসাথে দিলে সবগুলো শর্ত মানতে হয়, আর একই
                ধরনের Filter দুইবার দিলে যেকোনো একটা মানলেই চলে। তাই{" "}
                <code>-u caddy -u my-tours-api</code> মানে দুইটার যেকোনো একটার লাইন, আর{" "}
                <code>-u caddy -p err</code> মানে Caddy এর লাইন এবং গুরুতর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "filter-by-source.txt",
          code: `# Caddy আর App এর লাইন, সময়ের ক্রমে মিশিয়ে। লম্বা লাইন ছোট করা, কয়েকটা Caddy লাইন বাদ।
deploy@island-vps-01:~$ journalctl -u caddy -u my-tours-api --since "07:26:20" --until "07:26:25"
Oct 31 07:26:23 island-vps-01 systemd[1]: Reloading caddy.service - Caddy...
Oct 31 07:26:23 island-vps-01 caddy[645]: {"level":"info","ts":1793431583.3318667,"msg":"using provided configuration","config_file":"/etc/caddy/Caddy...
Oct 31 07:26:23 island-vps-01 caddy[413]: {"level":"info","ts":1793431583.3423615,"logger":"http.log","msg":"server running","name":"srv0",...
Oct 31 07:26:23 island-vps-01 systemd[1]: Reloaded caddy.service - Caddy.
Oct 31 07:26:24 island-vps-01 node[592]: {"time":"2026-10-31T07:26:24.378Z","level":"info","msg":"request","requestId":"req-4H7T",...

# একটা User এর সব Process এর লাইন। এই Server এ mytours এর UID 997 (লেসন ০৪)
deploy@island-vps-01:~$ journalctl _UID=997 -n 2
Oct 31 07:27:36 island-vps-01 node[592]: {"time":"2026-10-31T07:27:36.282Z","level":"info","msg":"request","requestId":"req-LIVE1",...
Oct 31 07:27:37 island-vps-01 node[592]: {"time":"2026-10-31T07:27:37.888Z","level":"error","msg":"booking failed","requestId":"req-LIVE2",...

# শুধু Program এর নিজের লাইন, systemd এর লাইন বাদ, আর -o cat এ শুধু বার্তা
deploy@island-vps-01:~$ journalctl -u my-tours-api -t node -n 1 -o cat
{"time":"2026-10-31T07:26:29.909Z","level":"info","msg":"request","requestId":"70b8eb79-492e-4085-9aea-073d4dd39459","method":"GET","path":"/api/me","status":200}`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "when",
      subHeader: { index: "007", title: "Filter by Time" },
      title: <SectionTitle>কখনকার লাইন: --since, Boot আর ঢাকার সময়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পর্যটক বলেছেন রাত দুইটা দশে। আপনাকে ঠিক ওই সময়ের আশেপাশের লাইন চাই, আগে পরে
                কয়েক মিনিট। এর জন্য <code>--since</code> আর <code>--until</code>। এরা
                অনেক রকম ভাষা বোঝে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  পুরো তারিখ আর সময়: <code>{'--since "2026-10-31 07:25:31"'}</code>
                </ListItem>
                <ListItem>
                  শুধু সময়, মানে আজকের: <code>{'--since "07:26"'}</code>
                </ListItem>
                <ListItem>
                  পেছনের দিকে গুনে: <code>{'--since "10 min ago"'}</code>,{" "}
                  <code>{'--since "1 hour ago"'}</code>
                </ListItem>
                <ListItem>
                  শব্দে: <code>--since today</code>, <code>--since yesterday</code>
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার সেই ফাঁদ, যেটায় প্রায় সবাই একবার পড়েন। Server এর ঘড়ি UTC তে, আপনার আর
                পর্যটকের ঘড়ি ঢাকায়, যেটা UTC থেকে ছয় ঘণ্টা এগিয়ে। পর্যটকের রাত দুইটা দশ মানে
                Server এর হিসাবে আগের দিন রাত আটটা দশ, 20:10। কেউ যদি{" "}
                <code>{'--since "02:05"'}</code> লেখেন, তিনি ভুল ছয় ঘণ্টা খুঁজবেন আর কিছুই
                পাবেন না। দুইটা নিরাপদ উপায় আছে। হয় নিজে ছয় ঘণ্টা বিয়োগ করুন, নয়তো
                journalctl কে বলুন ঢাকার সময়ে ভাবতে, সামনে <code>TZ=Asia/Dhaka</code> বসিয়ে।
                তখন দেখানো সময় আর <code>--since</code> এর সময়, দুইটাই ঢাকার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "filter-by-time.txt",
          code: `# পুরো তারিখ আর সময় দিয়ে, এক সেকেন্ডের জানালা
deploy@island-vps-01:~$ journalctl -u my-tours-api --since "2026-10-31 07:25:31" --until "2026-10-31 07:25:32" | head -4
Oct 31 07:25:31 island-vps-01 systemd[1]: Started my-tours-api.service - my-tours API.
Oct 31 07:25:31 island-vps-01 node[502]: file:///srv/my-tours/server.mjs:13
Oct 31 07:25:31 island-vps-01 node[502]:   if (!process.env[name]) throw new Error(\`\${name} is not set\`);
Oct 31 07:25:31 island-vps-01 node[502]:                                 ^

# একই দুইটা লাইন, প্রথমে Server এর UTC তে, তারপর ঢাকার সময়ে (লম্বা লাইন ছোট করা)
deploy@island-vps-01:~$ journalctl -u my-tours-api -n 2 -o short-iso
2026-10-31T07:26:04+00:00 island-vps-01 node[592]: {"time":"2026-10-31T07:26:04.443Z","level":"error","msg":"booking failed",...
2026-10-31T07:26:04+00:00 island-vps-01 node[592]: {"time":"2026-10-31T07:26:04.447Z","level":"error","msg":"booking failed",...
deploy@island-vps-01:~$ TZ=Asia/Dhaka journalctl -u my-tours-api -n 2
Oct 31 13:26:04 island-vps-01 node[592]: {"time":"2026-10-31T07:26:04.443Z","level":"error","msg":"booking failed",...
Oct 31 13:26:04 island-vps-01 node[592]: {"time":"2026-10-31T07:26:04.447Z","level":"error","msg":"booking failed",...
# সামনের সময়টা ঢাকার হলো, কিন্তু App এর নিজের time Field বদলায়নি, সেটা সবসময় UTC

# ঢাকার সময় দিয়েই খোঁজা: TZ বসালে --since আর --until ও ঢাকার হিসাবে বোঝে
deploy@island-vps-01:~$ TZ=Asia/Dhaka journalctl -u my-tours-api --since "2026-10-31 13:26:04" --until "2026-10-31 13:26:05"
Oct 31 13:26:04 island-vps-01 node[592]: {"time":"2026-10-31T07:26:04.437Z","level":"info","msg":"request",...
Oct 31 13:26:04 island-vps-01 node[592]: {"time":"2026-10-31T07:26:04.443Z","level":"error","msg":"booking failed",...
Oct 31 13:26:04 island-vps-01 node[592]: {"time":"2026-10-31T07:26:04.447Z","level":"error","msg":"booking failed",...`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সময়ের আরেকটা মাপ হলো Boot। প্রতিবার Server চালু হওয়া একটা নতুন অধ্যায়।{" "}
                <code>-b</code> মানে এই Boot এর লাইন, <code>-b -1</code> মানে আগের Boot এর।
                Server হঠাৎ Reboot হয়ে গেলে প্রথম প্রশ্ন হয় ঠিক আগে কী ঘটেছিল, আর তার উত্তর{" "}
                <code>journalctl -b -1 -e</code>, আগের Boot এর একদম শেষ লাইনগুলো।{" "}
                <code>--list-boots</code> দেখায় কোন কোন Boot এর Log জমা আছে।
              </ContentParagraph>
              <ContentParagraph>
                Practice Server এ <code>--list-boots</code> সবসময় একটাই সারি দেখায়, এমনকি
                Restart এর পরেও। কারণ Container এর নিজের Kernel নেই, পুরো যন্ত্রের Kernel এর
                Boot ID টাই সে দেখে। আসল VPS এ প্রতিটা Reboot একটা নতুন সারি যোগ করে, আর
                চেহারাটা এমন হয়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "boots-on-a-real-vps.txt (চেহারা, সংখ্যা আপনার আলাদা)",
          code: `deploy@island-vps-01:~$ journalctl --list-boots
IDX BOOT ID                          FIRST ENTRY                 LAST ENTRY
 -2 4c1e9a7d2f6b4e0c9a1d3b5f7e2c8a40 Mon 2026-10-12 21:30:02 UTC Sun 2026-10-25 03:14:51 UTC
 -1 9b7d0e3c5a2f4d1e8c6b4a2e0f9d7c51 Sun 2026-10-25 03:16:20 UTC Thu 2026-10-30 22:41:07 UTC
  0 e2a4c6e8b0d24f6a8c0e2a4c6e8b0d2f Thu 2026-10-30 22:42:36 UTC Sat 2026-10-31 07:25:01 UTC

# আগের Boot এর একদম শেষ লাইনগুলো, Pager এ শেষে খোলে: বন্ধ হওয়ার আগে কী ঘটেছিল
deploy@island-vps-01:~$ journalctl -b -1 -e

# এই Boot এর সব warning আর তার চেয়ে গুরুতর লাইন
deploy@island-vps-01:~$ journalctl -b -p warning`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "priority-grep",
      subHeader: { index: "008", title: "Priority and Grep" },
      title: <SectionTitle>কতটা গুরুতর আর কোন শব্দ: -p আর --grep</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা লাইনের একটা Priority আছে, শূন্য থেকে সাত। সংখ্যা যত ছোট, ঘটনা তত গুরুতর।
              নামগুলো অনেক পুরনো, syslog এর যুগের, কিন্তু আজও সব জায়গায় একই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["সংখ্যা", "নাম", "মানে", "উদাহরণ"],
          rows: [
            ["0", "emerg", "পুরো যন্ত্র অচল", "Kernel Panic এর আগের কথা"],
            ["1", "alert", "এখনই কাউকে কিছু করতে হবে", "খুব কম দেখবেন"],
            ["2", "crit", "জরুরি অবস্থা", "Hardware এর গুরুতর ত্রুটি"],
            ["3", "err", "কিছু একটা ব্যর্থ হয়েছে", "Failed to start my-tours-api.service"],
            ["4", "warning", "এখনো চলছে, কিন্তু সাবধান", "Start request repeated too quickly"],
            ["5", "notice", "স্বাভাবিক, তবে উল্লেখযোগ্য", "Main process exited, status=1"],
            ["6", "info", "সাধারণ খবর", "Started caddy.service"],
            ["7", "debug", "খুঁটিনাটি, শুধু খুঁজতে বসলে", "সাধারণত বন্ধ থাকে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>-p err</code> দেখায় 3 আর তার চেয়ে গুরুতর সব, মানে 0 থেকে 3।{" "}
                <code>-p warning</code> দেখায় 0 থেকে 4। একটা সীমার ভেতরে চাইলে{" "}
                <code>-p warning..err</code>। শুনতে দারুণ লাগে: শুধু Error গুলো দেখানো। এবার
                সেই ফাঁদ, যেটার কথা সেকশন ০০৩ এ বলে রেখেছিলাম।
              </ContentParagraph>
              <ContentParagraph>
                App যা stdout বা stderr এ Print করে, journald সেটার Priority জানে না। লাইনের
                ভেতরে Error লেখা থাকুক বা level error, journald সবগুলোকে 6 দেয়, info। ফলে{" "}
                <code>journalctl -u my-tours-api -p err</code> চালালে App এর আসল Error লাইনটা
                আসে না, আসে শুধু systemd এর নিজের ঘোষণা যে Service চালু করা গেল না। নিচে
                Practice Server এর আসল ফলাফল, দুইবার: একবার Crash Loop এর পরে, একবার একটা
                আটকে যাওয়া বুকিং এর পরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "priority-trap.txt",
          code: `# এক: Crash Loop এর পরে শুধু গুরুতর লাইন চাওয়া হলো
deploy@island-vps-01:~$ journalctl -u my-tours-api -p err --since "07:25:00" --until "07:25:59"
Oct 31 07:25:38 island-vps-01 systemd[1]: Failed to start my-tours-api.service - my-tours API.
# পাঁচবার লেখা Error: DATABASE_URL is not set এর একটাও এলো না

# দুই: App একটা আটকে যাওয়া বুকিং এর লাইন লিখল, level error সহ
deploy@island-vps-01:~$ journalctl -u my-tours-api -n 1
Oct 31 07:45:51 island-vps-01 node[358]: {"time":"2026-10-31T07:45:51.757Z","level":"error","msg":"booking failed","requestId":"req-9K1P","path":"/api/boom","reason":"seat already taken"}
deploy@island-vps-01:~$ journalctl -u my-tours-api -p err --since "1 min ago"
-- No entries --

# কারণ: journald এর চোখে লাইনটা সাধারণ খবর, stderr এ লেখা হলেও
deploy@island-vps-01:~$ journalctl -u my-tours-api --grep "req-9K1P" -n 1 -o json | jq -c '{PRIORITY, _TRANSPORT}'
{"PRIORITY":"6","_TRANSPORT":"stdout"}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সারানোর উপায় খুব ছোট। systemd এর একটা পুরনো নিয়ম আছে: stdout এর কোনো লাইন যদি{" "}
              <code>&lt;3&gt;</code> দিয়ে শুরু হয়, journald সেই অংশটা কেটে নেয় আর লাইনটার
              Priority 3 বসায়। <code>&lt;4&gt;</code> হলে warning, <code>&lt;6&gt;</code> হলে
              info। তাই App এর log Function এ এক লাইন বদল:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "/srv/my-tours/server.mjs (Priority সহ)",
          code: `// লাইনের শুরুর <3>, <4>, <6> দেখে journald Priority বসায়: err, warning, info।
const PRIORITY = { error: "<3>", warn: "<4>", info: "<6>" };

function log(level, msg, fields = {}) {
  const line = JSON.stringify({ time: new Date().toISOString(), level, msg, ...fields });
  process.stdout.write(PRIORITY[level] + line + "\\n");
}`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "priority-fixed.txt",
          code: `deploy@island-vps-01:~$ sudo systemctl restart my-tours-api
deploy@island-vps-01:~$ curl -s -H "X-Request-Id: req-3T8W" http://127.0.0.1:3000/api/boom
conflict
deploy@island-vps-01:~$ journalctl -u my-tours-api -p err --since "1 min ago"
Oct 31 07:45:53 island-vps-01 node[378]: {"time":"2026-10-31T07:45:53.807Z","level":"error","msg":"booking failed","requestId":"req-3T8W","path":"/api/boom","reason":"seat already taken"}
# <3> টা journald কেটে নিয়েছে, লাইনে দেখা যায় না, কিন্তু Priority এখন 3`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PriorityPrefixLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা জিনিস মাথায় রাখুন। এক, এই Prefix শুধু systemd এর অধীনে চলার সময় কাটা পড়ে।
                Terminal এ সরাসরি <code>node server.mjs</code> চালালে লাইনের শুরুতে{" "}
                <code>&lt;6&gt;</code> দেখবেন, সেটা ভুল নয়। দুই, Caddy সহ অনেক Program এই
                Prefix দেয় না। Practice Server এ Caddy এর 502 এর লাইনটাও Priority 6। তাই এদের
                বেলায় Priority এর উপর ভরসা না করে শব্দ খুঁজতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                শব্দ খোঁজার জন্য <code>--grep</code>, ছোট করে <code>-g</code>। ভেতরে
                Regular Expression লেখা যায়। আর একটা চালাক নিয়ম আছে: খোঁজার শব্দ পুরোটা ছোট
                হাতের হলে বড় ছোট মানে না, একটাও বড় হাতের অক্ষর থাকলে হুবহু মেলায়। Practice
                Server এ পরীক্ষা করে দেখা:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "grep-case.txt",
          code: `# পুরোটা ছোট হাতের: বড় ছোট মানে না, তাই মিলল
deploy@island-vps-01:~$ journalctl -u my-tours-api --grep "database_url" -n 1
Oct 31 07:25:37 island-vps-01 node[551]: Error: DATABASE_URL is not set

# একটা বড় হাতের অক্ষর আছে: হুবহু মেলাতে চায়, তাই মিলল না
deploy@island-vps-01:~$ journalctl -u my-tours-api --grep "Database_URL" -n 1
-- No entries --

# নিজে ঠিক করে দিতে চাইলে
deploy@island-vps-01:~$ journalctl -u my-tours-api --grep "database_url" --case-sensitive=false -n 1
Oct 31 07:25:37 island-vps-01 node[551]: Error: DATABASE_URL is not set

# একটা নির্দিষ্ট Request এর লাইন, Module 06 এর X-Request-Id দিয়ে
deploy@island-vps-01:~$ journalctl -u my-tours-api --grep "req-9K1P"
Oct 31 07:26:04 island-vps-01 node[592]: {"time":"2026-10-31T07:26:04.447Z","level":"error","msg":"booking failed","requestId":"req-9K1P","path":"/api/boom","reason":"seat already taken"}`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JournalFilterLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "status",
      subHeader: { index: "009", title: "systemctl status" },
      title: <SectionTitle>systemctl status: প্রথম নজর, শেষ কথা নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কোনো Service এর গোলমাল সন্দেহ হলে প্রথম Command সবসময়{" "}
                <code>systemctl status</code>। লেসন ০২ এ এটা দিয়ে দেখেছেন Service চলছে কি না।
                এবার এটাকে একটা Error এর রিপোর্ট হিসেবে পড়ব। নিচে Practice Server এর ব্যর্থ
                my-tours-api এর status, লাইন ধরে ধরে মানে সহ।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StatusAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে কাজের লাইন হলো <code>Process</code> বা <code>Main PID</code> এর
                বন্ধনীর ভেতরটা। সেখানে দুই রকম কথা থাকতে পারে, আর দুইটার মানে একদম আলাদা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>code=exited, status=1/FAILURE</code> মানে Process নিজে বেরিয়ে গেছে, একটা
                  Exit Code দিয়ে (লেসন ০২)। কেউ তাকে মারেনি। কেন বেরোল, সেটা App নিজে বলে গেছে,
                  খুঁজতে হবে App এর লাইনে।
                </ListItem>
                <ListItem>
                  <code>code=killed, signal=KILL</code> মানে বাইরে থেকে কেউ মেরেছে। সাধারণত দুই
                  জনের একজন: Memory ফুরিয়ে যাওয়ায় Kernel (সেকশন ০১১), অথবা থামতে বলার পরেও
                  সময়মতো না থামায় systemd নিজে (লেসন ০২ এর TimeoutStopSec)। এক্ষেত্রে App এর
                  Log এ প্রায়ই কোনো Error থাকে না, কারণ App টা কিছু বলার সুযোগই পায়নি।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                systemd নিজেও কিছু Exit Code ব্যবহার করে, যখন সমস্যাটা App চালু হওয়ার আগেই
                ঘটে। এগুলো চিনে রাখলে এক নজরে বুঝবেন দোষ Unit File এর, App এর নয়। দুইটা
                Practice Server এ ইচ্ছা করে ঘটানো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "systemd-exit-codes.txt",
          code: `# ভুল Path: ExecStart=/usr/bin/nodee (status এর মাঝের তিনটা লাইন)
deploy@island-vps-01:~$ systemctl status typo-path
     Active: failed (Result: exit-code) since Sat 2026-10-31 07:29:53 UTC; 1s ago
   Duration: 25ms
    Process: 208 ExecStart=/usr/bin/nodee /srv/my-tours/server.mjs (code=exited, status=203/EXEC)

# ভুল User: User=mytour, অথচ আছে mytours
deploy@island-vps-01:~$ systemctl status typo-user
     Active: failed (Result: exit-code) since Sat 2026-10-31 07:29:53 UTC; 1s ago
   Duration: 13ms
    Process: 209 ExecStart=/usr/bin/node /srv/my-tours/server.mjs (code=exited, status=217/USER)
deploy@island-vps-01:~$ journalctl -u typo-user -n 3
Oct 31 07:29:53 island-vps-01 (node)[209]: typo-user.service: Failed to determine user credentials: No such process
Oct 31 07:29:53 island-vps-01 systemd[1]: typo-user.service: Main process exited, code=exited, status=217/USER
Oct 31 07:29:53 island-vps-01 systemd[1]: typo-user.service: Failed with result 'exit-code'.`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["status এ লেখা", "মানে", "কোথায় দেখবেন"],
          rows: [
            [<code key="1">status=1/FAILURE</code>, "App নিজে Error দিয়ে বেরিয়েছে", "journalctl -u, App এর লাইন"],
            [<code key="203">status=203/EXEC</code>, "ExecStart এর Program চালানোই যায়নি: ভুল Path বা Execute অনুমতি নেই", "Unit File এর ExecStart, লেসন ০৪"],
            [<code key="217">status=217/USER</code>, "User= এ লেখা User টা নেই", "Unit File এর User=, লেসন ০৪"],
            [<code key="k">signal=KILL</code>, "বাইরে থেকে মারা হয়েছে", "Result: oom-kill হলে Kernel, নইলে Stop Timeout"],
            [<code key="t">signal=TERM</code>, "কেউ থামতে বলেছিল, সাধারণত systemctl stop বা Restart", "আপনার বা অন্য কারো Command"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো Server এ কোন কোন Service পড়ে আছে, এক Command এ:{" "}
              <code>systemctl --failed</code>। সকালে Server এ ঢুকে প্রথমে এটা চালানোর অভ্যাস
              করুন। আর একটা Service সারানোর পর <code>systemctl reset-failed my-tours-api</code>{" "}
              তার ব্যর্থ থাকার দাগ আর Restart এর গোনা দুইটাই মুছে দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "failed-units.txt",
          code: `deploy@island-vps-01:~$ systemctl --failed
  UNIT                 LOAD   ACTIVE SUB    DESCRIPTION
● my-tours-api.service loaded failed failed my-tours API

Legend: LOAD   → Reflects whether the unit definition was properly loaded.
        ACTIVE → The high-level unit activation state, i.e. generalization of SUB.
        SUB    → The low-level unit activation state, values depend on unit type.

1 loaded units listed.`,
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "read-a-crash",
      subHeader: { index: "010", title: "Reading a Crash" },
      title: <SectionTitle>Crash পড়া: শেষ লাইন নয়, প্রথম Error</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার পুরো ঘটনাটা। Practice Server এ my-tours-api এর Environment File থেকে{" "}
                <code>DATABASE_URL</code> এর লাইনটা বাদ পড়েছিল। App টা লেসন ০৫ এর নিয়ম মেনে
                বানানো: দরকারি Setting না পেলে চালু হওয়ার মুহূর্তেই নিজে থেমে যায়, পরে
                অদ্ভুতভাবে ভাঙার চেয়ে এখনই পরিষ্কারভাবে ভাঙা ভালো। Unit File এ{" "}
                <code>Restart=on-failure</code> আছে, তাই systemd বারবার চালু করার চেষ্টা করল।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CrashLoopTimelineDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আসল Journal টা দেখতে এমন। প্রথম চেষ্টাটা পুরো দেখানো হলো, মাঝের তিনটা চেষ্টা হুবহু
              একই বলে বাদ, তারপর শেষটা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "crash-loop.txt",
          code: `deploy@island-vps-01:~$ journalctl -u my-tours-api --since "07:25:31" --until "07:25:39"
Oct 31 07:25:31 island-vps-01 systemd[1]: Started my-tours-api.service - my-tours API.
Oct 31 07:25:31 island-vps-01 node[502]: file:///srv/my-tours/server.mjs:13
Oct 31 07:25:31 island-vps-01 node[502]:   if (!process.env[name]) throw new Error(\`\${name} is not set\`);
Oct 31 07:25:31 island-vps-01 node[502]:                                 ^
Oct 31 07:25:31 island-vps-01 node[502]: Error: DATABASE_URL is not set
Oct 31 07:25:31 island-vps-01 node[502]:     at file:///srv/my-tours/server.mjs:13:33
Oct 31 07:25:31 island-vps-01 node[502]:     at ModuleJob.run (node:internal/modules/esm/module_job:195:25)
Oct 31 07:25:31 island-vps-01 node[502]:     at async ModuleLoader.import (node:internal/modules/esm/loader:336:24)
Oct 31 07:25:31 island-vps-01 node[502]:     at async loadESM (node:internal/process/esm_loader:34:7)
Oct 31 07:25:31 island-vps-01 node[502]:     at async handleMainPromise (node:internal/modules/run_main:106:12)
Oct 31 07:25:31 island-vps-01 node[502]: Node.js v18.19.1
Oct 31 07:25:31 island-vps-01 systemd[1]: my-tours-api.service: Main process exited, code=exited, status=1/FAILURE
Oct 31 07:25:32 island-vps-01 systemd[1]: my-tours-api.service: Failed with result 'exit-code'.
Oct 31 07:25:33 island-vps-01 systemd[1]: my-tours-api.service: Scheduled restart job, restart counter is at 1.
Oct 31 07:25:33 island-vps-01 systemd[1]: Started my-tours-api.service - my-tours API.
# ... 515, 527 আর 539 নম্বর চেষ্টা হুবহু একই, এখানে বাদ ...
Oct 31 07:25:37 island-vps-01 node[551]: Error: DATABASE_URL is not set
Oct 31 07:25:37 island-vps-01 node[551]:     at file:///srv/my-tours/server.mjs:13:33
Oct 31 07:25:37 island-vps-01 node[551]: Node.js v18.19.1
Oct 31 07:25:37 island-vps-01 systemd[1]: my-tours-api.service: Main process exited, code=exited, status=1/FAILURE
Oct 31 07:25:37 island-vps-01 systemd[1]: my-tours-api.service: Failed with result 'exit-code'.
Oct 31 07:25:38 island-vps-01 systemd[1]: my-tours-api.service: Scheduled restart job, restart counter is at 5.
Oct 31 07:25:38 island-vps-01 systemd[1]: my-tours-api.service: Start request repeated too quickly.
Oct 31 07:25:38 island-vps-01 systemd[1]: my-tours-api.service: Failed with result 'exit-code'.
Oct 31 07:25:38 island-vps-01 systemd[1]: Failed to start my-tours-api.service - my-tours API.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মানুষের স্বভাব শেষ লাইনটা পড়া, কারণ সেটাই সবার নিচে আর সবচেয়ে বড় করে চোখে পড়ে।
                এখানে শেষ লাইন বলছে Failed to start, তার আগেরটা Start request repeated too
                quickly। দুইটাই সত্যি, কিন্তু দুইটাই ফলাফল। কারণটা আছে উপরে, আর সেটা খোঁজার
                একটা পদ্ধতি আছে, প্রতিবার একই।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক, শেষ থেকে উপরে উঠুন।</strong>{" "}
                  <code>journalctl -u my-tours-api -n 50</code> বা <code>-e</code> দিয়ে শেষে
                  যান, তারপর উপরের দিকে পড়ুন।
                </ListItem>
                <ListItem>
                  <strong>দুই, systemd এর লাইন পার হয়ে যান।</strong> <code>systemd[1]</code>{" "}
                  দিয়ে শুরু হওয়া লাইনগুলো বলে কী হলো। আপনি খুঁজছেন App এর নিজের লাইন, যেটা{" "}
                  <code>node[PID]</code> দিয়ে শুরু।
                </ListItem>
                <ListItem>
                  <strong>তিন, App এর প্রথম Error লাইনটা ধরুন।</strong> এখানে{" "}
                  <code>Error: DATABASE_URL is not set</code>। একাধিক Error থাকলে সবচেয়ে আগেরটা
                  প্রায় সবসময় আসল, পরেরগুলো তার ধাক্কায় ঘটা।
                </ListItem>
                <ListItem>
                  <strong>চার, Stack এ নিজের File খুঁজুন।</strong>{" "}
                  <code>at file:///srv/my-tours/server.mjs:13:33</code> মানে আপনার File এর ১৩
                  নম্বর লাইন। <code>node:internal</code> দিয়ে শুরু ফ্রেমগুলো Node এর নিজের, ওগুলো
                  বাদ।
                </ListItem>
                <ListItem>
                  <strong>পাঁচ, Loop টা চিনুন।</strong> PID প্রতিবার বদলাচ্ছে (502, 515, 527 ...)
                  আর Restart এর গোনা বাড়ছে। মানে এটা একবারের ঘটনা নয়, যতবার চালু হবে ততবার
                  পড়বে। Restart করে লাভ নেই, কারণটা সারাতে হবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মাঝে মাঝে কারণ খুঁজতে পুরো Journal পড়তেও হয় না। Error এর লাইনটা চিনলে সোজা
                সেটাই চাওয়া যায়: <code>{'journalctl -u my-tours-api --since "10 min ago" --grep "Error:"'}</code>
                । খোঁজায় বড় হাতের E আছে, তাই হুবহু মেলায়, আর JSON লাইনের ছোট হাতের{" "}
                <code>{'"level":"error"'}</code> গুলো আসে না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CrashReadLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কারণ জানা গেল, এবার সারানো আর প্রমাণ করা। Environment File এ লাইনটা ফেরত দিন
              (লেসন ০৫), systemd এর গোনা শূন্য করুন, আবার চালু করুন, আর Journal এ App এর মুখে
              listening শুনুন। প্রমাণ ছাড়া সারানো সারানো নয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "fix-and-prove.txt",
          code: `# Environment File এ DATABASE_URL এর লাইনটা ফেরত দিন, Editor দিয়ে (লেসন ০৫)
deploy@island-vps-01:~$ sudoedit /etc/my-tours/api.env
deploy@island-vps-01:~$ sudo systemctl reset-failed my-tours-api
deploy@island-vps-01:~$ sudo systemctl restart my-tours-api
deploy@island-vps-01:~$ journalctl -u my-tours-api -n 2
Oct 31 07:26:02 island-vps-01 systemd[1]: Started my-tours-api.service - my-tours API.
Oct 31 07:26:03 island-vps-01 node[592]: {"time":"2026-10-31T07:26:03.100Z","level":"info","msg":"listening","port":3000}`,
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "oom",
      subHeader: { index: "011", title: "Kernel and OOM" },
      title: <SectionTitle>হঠাৎ উধাও: Kernel আর OOM Killer</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কিছু Crash এ App এর Log এ কোনো Error থাকে না। App একটা স্বাভাবিক লাইন লিখল,
                তারপর চুপ। পরের লাইন systemd এর, যে বলছে Process টা মারা গেছে। এর সবচেয়ে
                সাধারণ কারণ Memory। Module 01 এ দেখেছেন RAM সীমিত। সব Process মিলে RAM শেষ করে
                ফেললে Kernel এর সামনে আর কোনো উপায় থাকে না, সে একটা Process বেছে নিয়ে তাকে
                সাথে সাথে মেরে ফেলে, যাতে বাকি যন্ত্রটা বাঁচে। এই কাজের নাম OOM Killer, Out
                Of Memory থেকে।
              </ContentParagraph>
              <ContentParagraph>
                মারা হয় SIGKILL দিয়ে (লেসন ০২), যেটা ধরা যায় না, এড়ানো যায় না। তাই App কিছু
                বলার সুযোগ পায় না। গল্পটা লেখা থাকে দুই জায়গায়: systemd এর লাইনে আর Kernel এর
                লাইনে। Practice Server এ একটা ইচ্ছাকৃত Memory খেকো Service চালানো হয়েছিল, যাকে{" "}
                <code>MemoryMax=128M</code> দিয়ে 128 MB এর বেশি দেওয়া হয়নি। আসল VPS এ সীমাটা
                সাধারণত পুরো যন্ত্রের RAM, ঘটনা একই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "oom-kill.txt",
          code: `deploy@island-vps-01:~$ systemctl status memory-hog
× memory-hog.service - Memory hog for the logs lesson
     Loaded: loaded (/etc/systemd/system/memory-hog.service; static)
     Active: failed (Result: oom-kill) since Sat 2026-10-31 07:26:38 UTC; 1s ago
   Duration: 1.206s
    Process: 698 ExecStart=/usr/bin/node /usr/local/bin/memory-hog.mjs (code=killed, signal=KILL)
   Main PID: 698 (code=killed, signal=KILL)
        CPU: 523ms

deploy@island-vps-01:~$ journalctl -u memory-hog -n 5
Oct 31 07:26:38 island-vps-01 node[698]: holding 96 MB
Oct 31 07:26:38 island-vps-01 node[698]: holding 112 MB
Oct 31 07:26:38 island-vps-01 systemd[1]: memory-hog.service: A process of this unit has been killed by the OOM killer.
Oct 31 07:26:38 island-vps-01 systemd[1]: memory-hog.service: Main process exited, code=killed, status=9/KILL
Oct 31 07:26:38 island-vps-01 systemd[1]: memory-hog.service: Failed with result 'oom-kill'.

deploy@island-vps-01:~$ journalctl -k --grep "out of memory"
Oct 31 07:26:38 island-vps-01 kernel: Memory cgroup out of memory: Killed process 641337 (node) total-vm:736304kB, anon-rss:129624kB, file-rss:34816kB, shmem-rss:0kB, UID:0 pgtables:748kB oom_score_adj:0`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা চিহ্ন একসাথে দেখলে নিশ্চিত হবেন: status এ <code>Result: oom-kill</code>,
                Process এর পাশে <code>code=killed, signal=KILL</code>, আর Kernel এর লাইনে{" "}
                <code>Killed process ... (node)</code>। Kernel এর লাইনের PID আর systemd এর
                PID এখানে মেলে না, কারণ Practice Server টা Container, আর Kernel বাইরে থেকে
                Process টাকে অন্য নম্বরে দেখে। আসল VPS এ দুইটা একই নম্বর হয়। সীমা ছাড়া পুরো
                যন্ত্রের Memory ফুরালে Kernel এর লাইনটা শুরু হয়{" "}
                <code>Out of memory: Killed process</code> দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                এরপর কী করবেন, সেটা পরের লেসনের বিষয়: কোন Process কতটা Memory খাচ্ছে, সেটা{" "}
                <code>top</code> আর <code>free</code> দিয়ে দেখা, আর ছোট VPS এ Swap যোগ করা।
                এখানে শুধু চেনাটা শিখলেন, যাতে Log এ Error না থাকলে আপনি ভুল জায়গায় না খোঁজেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Kernel এর আরও দুইটা কথা যা Log এ খুঁজবেন",
          content: (
            <p>
              Disk ভরে গেলে App এর Log এ আসে <code>ENOSPC</code> বা{" "}
              <code>No space left on device</code>, তখন সেকশন ০১৩ আর পরের লেসনের{" "}
              <code>df -h</code>। আর Disk এর Hardware গোলমাল করলে <code>journalctl -k</code>{" "}
              এ I/O error দেখা যায়, যেটা দেখলে Provider এর Support এ কথা বলার সময়। Kernel এর
                Log সরাসরি পড়ার পুরনো Command <code>dmesg</code>, Ubuntu তে এটা চালাতে sudo
              লাগে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "var-log",
      subHeader: { index: "012", title: "Text Logs and Caddy" },
      title: <SectionTitle>/var/log এর Text File, আর Caddy এর Log</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                journalctl দিয়ে প্রায় সব হয়, তবু কয়েকটা Text File চিনে রাখা দরকার, কারণ
                অনেক টিউটোরিয়াল, অনেক Tool আর অনেক সহকর্মী এগুলোর নাম ধরেই কথা বলবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["File", "কী থাকে", "কখন খুলবেন"],
          rows: [
            [<code key="s">/var/log/syslog</code>, "প্রায় সব, journald থেকে আসা কপি", "journalctl হাতে না থাকলে, পুরনো অভ্যাসে"],
            [<code key="a">/var/log/auth.log</code>, "SSH Login, ব্যর্থ চেষ্টা, sudo, su", "কে কখন ঢুকল, কে ঢোকার চেষ্টা করছে (লেসন ০৩)"],
            [<code key="k">/var/log/kern.log</code>, "শুধু Kernel এর কথা", "Hardware বা Memory এর সন্দেহ"],
            [<code key="d">/var/log/dpkg.log</code>, "কোন Package কখন বসানো বা সরানো হলো", "Update এর পরে কিছু ভেঙেছে মনে হলে"],
            [<code key="ap">/var/log/apt/history.log</code>, "কে কোন apt Command চালিয়েছিল", "ওই একই প্রশ্ন, Command সহ"],
            [<code key="c">/var/log/caddy/</code>, "Caddy এর Access Log, যদি চালু করা থাকে", "কোন Request কখন এলো, কী উত্তর গেল"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Text File পড়ার Tool গুলো লেসন ০১ এর: <code>tail -n 20</code> শেষের লাইন,{" "}
              <code>tail -f</code> লাইভ দেখা, <code>less</code> চলাফেরা করে পড়া,{" "}
              <code>grep</code> শব্দ খোঁজা। পুরনো ঘোরানো File গুলো <code>.gz</code> হয়ে চাপা
              থাকে, সেগুলোয় খুঁজতে <code>zgrep</code>। Practice Server এর auth.log এ নিচের
              লাইনগুলো এসেছে, যখন কেউ admin আর oracle নামের User দিয়ে SSH করার চেষ্টা করল, যে
              User গুলো এই Server এ নেই। আসল VPS এ এরকম লাইন সারাদিন আসে, পৃথিবীর নানা IP
              থেকে, Bot রা অন্ধের মতো নাম আর Password আন্দাজ করে। লেসন ০৩ এ Password Login বন্ধ
              করেছেন বলে এগুলো নিয়ে ভয়ের কিছু নেই, কিন্তু চেনা দরকার।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "auth-log.txt",
          code: `deploy@island-vps-01:~$ tail -n 4 /var/log/auth.log
2026-10-31T07:27:22.306942+00:00 island-vps-01 sshd[784]: Invalid user admin from 127.0.0.1 port 53976
2026-10-31T07:27:22.317465+00:00 island-vps-01 sshd[784]: Connection closed by invalid user admin 127.0.0.1 port 53976 [preauth]
2026-10-31T07:27:22.616256+00:00 island-vps-01 sshd[787]: Invalid user oracle from 127.0.0.1 port 53978
2026-10-31T07:27:22.623000+00:00 island-vps-01 sshd[787]: Connection closed by invalid user oracle 127.0.0.1 port 53978 [preauth]

# একই ঘটনা Journal এ, ssh Service এর নামে
deploy@island-vps-01:~$ journalctl -u ssh -n 2
Oct 31 07:27:22 island-vps-01 sshd[787]: Invalid user oracle from 127.0.0.1 port 53978
Oct 31 07:27:22 island-vps-01 sshd[787]: Connection closed by invalid user oracle 127.0.0.1 port 53978 [preauth]

# কোন কোন নামে কতবার চেষ্টা হলো
deploy@island-vps-01:~$ grep "Invalid user" /var/log/auth.log | awk '{print $6}' | sort | uniq -c
      1 admin
      1 oracle`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লক্ষ করুন, Text File এর সময়ের ফরম্যাট আলাদা: পুরো ISO তারিখ, Microsecond আর
                Timezone সহ। Ubuntu 24.04 এর rsyslog এভাবেই লেখে, আর এটা মেলানোর জন্য
                journalctl এর <code>-o short-iso</code> এর চেয়েও পরিষ্কার।
              </ContentParagraph>
              <ContentParagraph>
                এবার Module 06 এর সেই প্রশ্ন, Caddy এর Log কোথায়। উত্তর দুই ভাগে। Caddy নিজের
                কাজের খবর (চালু হলো, Certificate নবীকরণ হলো, App এর সাথে কথা বলা গেল না)
                লেখে stderr এ, তাই সেগুলো Journal এ, <code>journalctl -u caddy</code> দিয়ে
                পড়বেন। আর প্রতিটা Request এর হিসাব, মানে Access Log, Caddy Default এ লেখেই না।
                Caddyfile এ <code>log</code> লিখে চালু করতে হয়, তখন সেটা আপনার বলে দেওয়া File
                এ JSON হয়ে জমে। Island Tours এর Caddyfile এ সেই অংশটা এমন (নমুনা, আসল Domain
                সহ):
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "/etc/caddy/Caddyfile (নমুনা)",
          code: `islandtours.example {
	reverse_proxy 127.0.0.1:3000

	# প্রতিটা Request এর হিসাব, JSON এ, এই File এ
	log {
		output file /var/log/caddy/access.log
		format json
	}
}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Practice Server এর Caddy তে একই <code>log</code> অংশ বসিয়ে একটা Request পাঠানো
              হয়েছিল, Port 80 এ, কারণ সেখানে কোনো Public Domain নেই। Access Log এর লাইনটা,{" "}
              <code>jq</code> দিয়ে সাজানো:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "caddy-access-log.txt",
          code: `deploy@island-vps-01:~$ curl -s -o /dev/null -H "X-Request-Id: req-4H7T" -H "User-Agent: island-check/1.0" http://127.0.0.1/tours/saint-martin
deploy@island-vps-01:~$ tail -n 1 /var/log/caddy/access.log | jq .
{
  "level": "info",
  "ts": 1793431584.3800852,
  "logger": "http.log.access.log0",
  "msg": "handled request",
  "request": {
    "remote_ip": "127.0.0.1",
    "remote_port": "54112",
    "proto": "HTTP/1.1",
    "method": "GET",
    "host": "127.0.0.1",
    "uri": "/tours/saint-martin",
    "headers": {
      "User-Agent": [
        "island-check/1.0"
      ],
      "Accept": [
        "*/*"
      ],
      "X-Request-Id": [
        "req-4H7T"
      ]
    }
  },
  "user_id": "",
  "duration": 0.005582554,
  "size": 3,
  "status": 200,
  "resp_headers": {
    "Server": [
      "Caddy"
    ],
    "Content-Length": [
      "3"
    ],
    "X-Request-Id": [
      "req-4H7T"
    ],
    "Date": [
      "Sat, 31 Oct 2026 07:26:24 GMT"
    ]
  }
}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই একটা লাইনে Module 06 এর অনেক কিছু একসাথে: Method, Path, Protocol, Header,
                Status আর কত সময় লাগল (<code>duration</code>, সেকেন্ডে)। আর দেখুন, Request এ{" "}
                <code>X-Request-Id: req-4H7T</code> ছিল, সেটা Access Log এ আছে, App এর লাইনেও
                আছে। এই সুতা ধরেই একটা Request কে Caddy থেকে App পর্যন্ত অনুসরণ করা যায়
                (Module 06 লেসন ০৪)।
              </ContentParagraph>
              <ContentParagraph>
                দুইটা ভালো খবর, দুইটাই Practice Server এ যাচাই করা। এক, Caddy Cookie আর
                Authorization Header এর মান Log এ লেখে না, খালি রাখে, তাই Session এর চাবি Log
                File এ পড়ে থাকে না। দুই, Caddy নিজের Access Log File নিজেই ঘোরায়: Default এ 100
                MiB হলে নতুন File, দশটা পর্যন্ত রাখে, ৯০ দিনের বেশি পুরনো মোছে। তাই Caddy এর
                File এর জন্য logrotate লাগে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "caddy-redacts-and-502.txt",
          code: `# Cookie আর Authorization পাঠানো হলো, Access Log এ তাদের মান নেই
deploy@island-vps-01:~$ curl -s -o /dev/null -H "Cookie: __Host-session=abc123" -H "Authorization: Bearer xyz" http://127.0.0.1/api/me
deploy@island-vps-01:~$ tail -n 1 /var/log/caddy/access.log | jq -c '.request.headers'
{"Authorization":[],"User-Agent":["curl/8.5.0"],"Accept":["*/*"],"Cookie":[]}

# App বন্ধ থাকলে Caddy 502 দেয়, আর কারণটা নিজের Journal এ লেখে
deploy@island-vps-01:~$ sudo systemctl stop my-tours-api
deploy@island-vps-01:~$ curl -s -o /dev/null -w "%{http_code}\\n" -H "X-Request-Id: req-2AM0" http://127.0.0.1/api/bookings
502
deploy@island-vps-01:~$ journalctl -u caddy --grep "connection refused" -n 1 -o cat | jq -c '{level, msg, status, uri: .request.uri, id: .request.headers["X-Request-Id"][0]}'
{"level":"error","msg":"dial tcp 127.0.0.1:3000: connect: connection refused","status":502,"uri":"/api/bookings","id":"req-2AM0"}`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Caddy এর error লাইনও Priority 6",
          content: (
            <p>
              উপরের 502 এর লাইনটা Caddy লিখেছে <code>{'"level":"error"'}</code> দিয়ে, কিন্তু
              Journal এ তার PRIORITY 6। তাই <code>journalctl -u caddy -p err</code> এই লাইন
              কখনো দেখাবে না। Caddy এর Error খুঁজতে লিখুন{" "}
              <code>{`journalctl -u caddy --grep '"level":"error"'`}</code>, অথবা{" "}
              <code>-o cat</code> দিয়ে jq তে পাঠান। Access Log এ সব 5xx এক সাথে দেখতে:{" "}
              <code>{"jq -c 'select(.status >= 500)' /var/log/caddy/access.log"}</code>।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "disk",
      subHeader: { index: "013", title: "Logs and Disk Space" },
      title: <SectionTitle>Log যেন Disk খেয়ে না ফেলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Log এর একটা বদভ্যাস আছে, সে শুধু বাড়ে। একটা Busy App দিনে কয়েকশো MB লিখতে
                পারে, আর কেউ না দেখলে একদিন Disk পুরো ভরে যায়। তখন যা ঘটে সেটা অদ্ভুত:
                Database লিখতে পারে না, App এর Upload ব্যর্থ হয়, এমনকি SSH এ ঢোকাও কঠিন হয়ে
                যায়, আর সবকিছুর মূলে একটা Log File যেটা কারো মনেই ছিল না। তাই Log এর সীমা
                বাঁধা Server বসানোর প্রথম দিনের কাজ।
              </ContentParagraph>
              <ContentParagraph>
                Journal এর বেলায় কাজটা সহজ, কারণ journald নিজেই একটা সীমা মানে। Default এ
                File System এর ১০ শতাংশ পর্যন্ত নেয়, আর অন্তত ১৫ শতাংশ খালি রাখে, দুইটাই
                সর্বোচ্চ 4G। সীমায় পৌঁছালে সবচেয়ে পুরনো অংশ মুছে জায়গা করে। নিজের মতো সীমা
                চাইলে মূল <code>/etc/systemd/journald.conf</code> এ হাত না দিয়ে একটা Drop-in
                File লিখুন, লেসন ০২ এর মতো একই নিয়মে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LogDiskSplit /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "journald-limits.txt",
          code: `deploy@island-vps-01:~$ journalctl --disk-usage
Archived and active journals take up 8.0M in the file system.

# এখনই পুরনো অংশ ছাঁটা, আকার দিয়ে বা বয়স দিয়ে।
# Practice Server টা নতুন, তাই ছাঁটার মতো কিছু ছিল না, freed 0B।
deploy@island-vps-01:~$ sudo journalctl --vacuum-size=200M
Vacuuming done, freed 0B of archived journals from /run/log/journal.
Vacuuming done, freed 0B of archived journals from /var/log/journal/bb34e21505094a108009f5ab781901de.
Vacuuming done, freed 0B of archived journals from /var/log/journal.
deploy@island-vps-01:~$ sudo journalctl --vacuum-time=14d
Vacuuming done, freed 0B of archived journals from /run/log/journal.
Vacuuming done, freed 0B of archived journals from /var/log/journal/bb34e21505094a108009f5ab781901de.

# স্থায়ী সীমা, Island Tours এর মতো। File টায় চারটা লাইন লিখুন, নিচে দেখানো।
deploy@island-vps-01:~$ sudo mkdir -p /etc/systemd/journald.conf.d
deploy@island-vps-01:~$ sudoedit /etc/systemd/journald.conf.d/islandtours.conf
deploy@island-vps-01:~$ sudo systemctl restart systemd-journald
deploy@island-vps-01:~$ systemd-analyze cat-config systemd/journald.conf | grep -A5 "islandtours.conf"
# /etc/systemd/journald.conf.d/islandtours.conf
[Journal]
Storage=persistent
SystemMaxUse=1G
SystemKeepFree=2G
MaxRetentionSec=1month`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Text File গুলো নিজে থেকে ছোট হয় না। তাদের দেখাশোনা করে <strong>logrotate</strong>
                , যাকে Ubuntu প্রতিদিন একবার চালায় একটা systemd Timer দিয়ে (Timer এর গল্প লেসন
                ১০ এ)। logrotate এর নিয়ম থাকে <code>/etc/logrotate.d/</code> এ, প্রতিটা
                Program এর জন্য একটা ছোট File। rsyslog এর File টা Ubuntu নিজে দিয়েছে, দেখলে
                পুরো ভাষাটা চেনা হয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "logrotate-defaults.txt",
          code: `# logrotate কে প্রতিদিন কে চালায়: একটা systemd Timer
deploy@island-vps-01:~$ systemctl list-timers logrotate.timer
NEXT                        LEFT LAST PASSED UNIT            ACTIVATES
Sun 2026-11-01 00:00:00 UTC  16h -         - logrotate.timer logrotate.service

deploy@island-vps-01:~$ ls /etc/logrotate.d/
alternatives  apt  btmp  dpkg  rsyslog  ufw  wtmp

deploy@island-vps-01:~$ cat /etc/logrotate.d/rsyslog
/var/log/syslog
/var/log/mail.log
/var/log/kern.log
/var/log/auth.log
/var/log/user.log
/var/log/cron.log
{
	rotate 4
	weekly
	missingok
	notifempty
	compress
	delaycompress
	sharedscripts
	postrotate
		/usr/lib/rsyslog/rsyslog-rotate
	endscript
}`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["নির্দেশ", "মানে"],
          rows: [
            [<code key="d">daily / weekly</code>, "কত দিন পরপর ঘোরাবে"],
            [<code key="r">rotate 14</code>, "পুরনো কপি কয়টা রাখবে, তার বেশি হলে সবচেয়ে পুরনোটা মোছে"],
            [<code key="c">compress</code>, "পুরনো কপি gzip দিয়ে চেপে ছোট করবে"],
            [<code key="dc">delaycompress</code>, "সদ্য ঘোরানোটা একদিন খোলা রাখবে, পরের বার চাপবে"],
            [<code key="m">missingok</code>, "File না থাকলে Error দেবে না"],
            [<code key="ne">notifempty</code>, "খালি File ঘোরাবে না"],
            [<code key="cr">create 0640 root adm</code>, "নতুন খালি File বানাবে এই Permission আর মালিকানায়"],
            [<code key="de">dateext</code>, "পুরনো কপির নামে সংখ্যার বদলে তারিখ বসাবে"],
            [<code key="ct">copytruncate</code>, "যে App File টা বন্ধ করতে জানে না, তার জন্য: কপি করে মূলটা খালি করে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর রাতের Backup নিজের একটা Text Log লেখে (লেসন ১০)। তার জন্য নিয়ম
              লিখে, আগে <code>-d</code> দিয়ে শুধু দেখা কী করত, তারপর <code>-f</code> দিয়ে এখনই
              একবার ঘোরানো, Practice Server এ:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "logrotate-islandtours.txt",
          code: `deploy@island-vps-01:~$ cat /etc/logrotate.d/islandtours
/var/log/islandtours/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 root adm
    dateext
}

# -d: শুধু বলে কী করত, কিছুই করে না
deploy@island-vps-01:~$ sudo logrotate -d /etc/logrotate.d/islandtours
warning: logrotate in debug mode does nothing except printing debug messages!  Consider using verbose mode (-v) instead if this is not what you want.

reading config file /etc/logrotate.d/islandtours
Reading state from file: /var/lib/logrotate/status
state file /var/lib/logrotate/status does not exist
Allocating hash table for state file, size 64 entries

Handling 1 logs

rotating pattern: /var/log/islandtours/*.log  after 1 days (14 rotations)
empty log files are not rotated, old logs are removed
considering log /var/log/islandtours/backup.log
Creating new state
  Now: 2026-10-31 07:27
  Last rotated at 2026-10-31 07:00
  log does not need rotating (log has already been rotated)
# নতুন File, তাই logrotate ধরে নেয় আজকেরটা হয়ে গেছে। কাল থেকে নিয়মমতো ঘুরবে।

# -f: এখনই একবার ঘোরানো, -v দিয়ে কী করল সেটা দেখে (মাঝের কয়েকটা লাইন বাদ)
deploy@island-vps-01:~$ sudo logrotate -f -v /etc/logrotate.d/islandtours
rotating pattern: /var/log/islandtours/*.log  forced from command line (14 rotations)
considering log /var/log/islandtours/backup.log
  log needs rotating
rotating log /var/log/islandtours/backup.log, log->rotateCount is 14
dateext suffix '-20261031'
renaming /var/log/islandtours/backup.log to /var/log/islandtours/backup.log-20261031
creating new /var/log/islandtours/backup.log mode = 0640 uid = 0 gid = 4

deploy@island-vps-01:~$ ls -l /var/log/islandtours/
total 4
-rw-r----- 1 root adm    0 Oct 31 07:27 backup.log
-rw-r--r-- 1 root root 270 Oct 31 07:27 backup.log-20261031`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Disk ভরে গেছে, তাড়াহুড়ায় rm নয়",
          content: (
            <div className="space-y-3">
              <p>
                রাত দুইটায় Disk ভরে গেলে প্রথম ইচ্ছা হয় সবচেয়ে বড় Log File টা মুছে ফেলা। কিন্তু
                কোনো Program যদি সেই File টা খোলা রেখে লিখতে থাকে, মুছলেও জায়গা ফেরত আসে না।
                নামটা Folder থেকে চলে যায়, কিন্তু File এর Data থাকে যতক্ষণ Program টা সেটা
                ধরে রাখে। Practice Server এ ৫০ MB এর একটা খোলা File মুছে দেখা:
              </p>
              <pre className="overflow-x-auto bg-muted/40 p-3 font-mono text-xs">{`deploy@island-vps-01:~$ sudo lsof -nP +L1
COMMAND PID USER   FD   TYPE DEVICE SIZE/OFF NLINK    NODE NAME
sleep   289 root    3w   REG  0,228 50000000     0 1989199 /var/log/demo/big.log (deleted)`}</pre>
              <p>
                <code>lsof +L1</code> দেখায় মুছে ফেলা অথচ খোলা File গুলো, তাদের আকার সহ।
                নিরাপদ পথ হলো File টা না মুছে খালি করা, <code>sudo truncate -s 0 &lt;file&gt;</code>
                , অথবা Program টা Restart করা। Journal এর বেলায় কখনো হাত দিয়ে File মুছবেন না,{" "}
                <code>journalctl --vacuum-size</code> ব্যবহার করুন।
              </p>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "good-logs",
      subHeader: { index: "014", title: "Writing Good Logs" },
      title: <SectionTitle>যে Log রাত দুইটায় কাজে লাগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ আপনি অন্যের লেখা Log পড়লেন। এবার নিজের App এর Log, যেটা একদিন আপনি
                নিজেই, ঘুম চোখে, পড়বেন। একই ঘটনা দুইভাবে লেখা যায়, আর তফাতটা রাত দুইটায়
                বোঝা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <GoodBadLogSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>সাতটা নিয়ম, প্রতিটার পেছনে একটা কারণ:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক লাইনে এক ঘটনা, একটা JSON।</strong> মানুষ পড়তে পারে, যন্ত্রও পারে।
                  Stack Trace এর মতো বহু লাইনের জিনিসও একটা Field এর ভেতরে রাখুন, নইলে প্রতিটা
                  লাইন আলাদা ঘটনা হয়ে যায়, যেমনটা উপরের Crash এ দেখলেন।
                </ListItem>
                <ListItem>
                  <strong>সময় UTC তে, ISO ফরম্যাটে।</strong>{" "}
                  <code>2026-10-30T20:10:04.447Z</code> নিয়ে কোনো সন্দেহ থাকে না। শেষের Z মানে
                  UTC। দেখানোর সময় ঢাকায় বদলানো যায়, উল্টোটা নয়।
                </ListItem>
                <ListItem>
                  <strong>একটা level, চার শব্দের মধ্যে।</strong> debug, info, warn, error, সবসময়
                  একই বানানে। আর error শুধু তখন, যখন কাউকে সত্যিই কিছু করতে হবে। সবকিছু error হলে
                  কোনোটাই error নয়।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা লাইনে requestId।</strong> Module 06 এর X-Request-Id। একটা
                  Request এর সব লাইন, Caddy থেকে App হয়ে Database পর্যন্ত, এক Command এ বের হয়।
                </ListItem>
                <ListItem>
                  <strong>মানুষ নয়, নম্বর।</strong> <code>userId: usr_42</code>, Email বা
                  ফোন নম্বর নয়। দরকার হলে Database এ খুঁজে নেবেন।
                </ListItem>
                <ListItem>
                  <strong>কোনো গোপন জিনিস কখনো নয়।</strong> Password, Cookie, Authorization
                  Header, <code>DATABASE_URL</code>, কার্ডের নম্বর, Token। Log File অনেক মানুষ
                  পড়ে, অনেক দিন থাকে, অনেক জায়গায় Copy হয়। লেসন ০৫ এর গোপন জিনিসের নিয়ম Log এর
                  জন্যও।
                </ListItem>
                <ListItem>
                  <strong>কারণ লিখুন, অনুভূতি নয়।</strong> <code>something went wrong</code>{" "}
                  এর বদলে <code>seat already taken</code>। পড়ে যেন বোঝা যায় পরের পদক্ষেপ কী।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এমন Log এর পুরস্কার হলো জিজ্ঞেস করা যায়। <code>-o cat</code> শুধু বার্তাটা দেয়,
                আর <code>jq</code> সেই JSON থেকে যা চান বের করে। Journal এ App এর JSON এর পাশে
                systemd এর সাধারণ লাইনও থাকে, তাই <code>fromjson?</code> দিয়ে যেগুলো JSON নয়
                সেগুলো চুপচাপ বাদ দেওয়া হয়। Practice Server এ সব আটকে যাওয়া বুকিং, শুধু সময়,
                requestId আর কারণ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "query-json-logs.txt",
          code: `deploy@island-vps-01:~$ journalctl -u my-tours-api -t node -o cat --since "07:20" --until "07:27" | jq -cR 'fromjson? | select(.level=="error") | {time, requestId, reason}'
{"time":"2026-10-31T07:26:04.443Z","requestId":"11e4f2c9-1cba-4081-98bf-6a6932f1f165","reason":"seat already taken"}
{"time":"2026-10-31T07:26:04.447Z","requestId":"req-9K1P","reason":"seat already taken"}
# প্রথমটার Request এ X-Request-Id ছিল না, তাই App নিজে একটা UUID বানিয়েছে`,
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, একটা রাতের 502</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসনের শুরুর সেই পর্যটক। তাঁর Email এ লেখা ছিল রাত দুইটা দশ, আর পর্দায়
                দেখেছিলেন 502 Bad Gateway। Module 06 এর লেসন ০৩ থেকে আপনি জানেন 502 লেখে
                মাঝের Reverse Proxy, যখন পেছনের App উত্তর দেয় না। তাই খোঁজা শুরু Caddy থেকে।
                Island Tours এর দল সেই সকালে যা যা করেছিল:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সময় ঠিক করা।</strong> ঢাকার 02:10 মানে Server এর 20:10, আগের দিন।
                  দলের নিয়ম, সময় নিয়ে কথা বললে সবসময় সাথে Timezone বলা।
                </ListItem>
                <ListItem>
                  <strong>Caddy কে জিজ্ঞেস করা।</strong>{" "}
                  <code>{`TZ=Asia/Dhaka journalctl -u caddy --since "02:05" --until "02:20" --grep '"level":"error"'`}</code>
                  । উত্তরে অনেকগুলো লাইন, সবগুলোতে <code>dial tcp 127.0.0.1:3000: connect:
                  connection refused</code>। মানে Caddy ঠিক ছিল, App এর দরজা বন্ধ ছিল।
                </ListItem>
                <ListItem>
                  <strong>App কে জিজ্ঞেস করা।</strong> Island Tours এর API চলে Docker এর ভেতরে,
                  তাই তার Log দেখার Command টা Docker Module এ শিখবেন। কিন্তু খোঁজার পদ্ধতি এই
                  লেসনেরই: ঠিক সেই সময়ে App এর প্রথম Error লাইন। সেখানে ছিল{" "}
                  <code>DATABASE_URL is not set</code>, আর তার আগের লাইনে একটা চালু হওয়ার খবর।
                </ListItem>
                <ListItem>
                  <strong>কেন ঠিক তখন, তার খোঁজ।</strong> ঠিক দুই মিনিট আগে, 20:08 UTC তে, রাতের
                  একটা Deploy হয়েছিল। Deploy এর ইতিহাস আর Environment File বদলের সময়, যেটা{" "}
                  <code>ls -l --time-style=full-iso /etc/islandtours/api.env</code> দেখায়, দুইটা
                  মিলে গেল: নতুন File এ একটা লাইন বাদ পড়েছিল, আর নতুন App টা চালু হতেই সেটা পড়ে
                  থেমে যাচ্ছিল।
                </ListItem>
                <ListItem>
                  <strong>সারানো আর প্রমাণ।</strong> লাইনটা ফেরত দেওয়া, Restart, তারপর Caddy এর
                  Access Log এ নতুন Request গুলো 200 দিয়ে ফিরছে কি না দেখা। পর্যটককে উত্তর গেল
                  সময় আর কারণ সহ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই রাতের পরে Island Tours Log নিয়ে কয়েকটা স্থায়ী সিদ্ধান্ত নেয়, যেগুলো এখনো চলছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  Journal স্থায়ী, সর্বোচ্চ 1G, Disk এ অন্তত 2G খালি, এক মাসের বেশি পুরনো নয়,
                  সবই <code>/etc/systemd/journald.conf.d/islandtours.conf</code> এ।
                </ListItem>
                <ListItem>
                  Caddy এর Access Log JSON এ <code>/var/log/caddy/access.log</code> এ, Caddy এর
                  নিজের ঘোরানোর নিয়মে। Cookie আর Authorization এর মান Caddy নিজেই বাদ দেয়।
                </ListItem>
                <ListItem>
                  API প্রতিটা ঘটনা একটা JSON লাইনে লেখে, Priority এর Prefix সহ, প্রতিটায়{" "}
                  <code>requestId</code>, কোনোটায় গোপন কিছু নয়। Error এর লাইনে কারণ লেখা থাকে।
                </ListItem>
                <ListItem>
                  <code>deploy</code> User <code>adm</code> Group এ, তাই Log পড়তে sudo লাগে না।
                </ListItem>
                <ListItem>
                  Backup এর নিজের Text Log logrotate এ, ১৪ দিন রাখা, চাপা অবস্থায়।
                </ListItem>
                <ListItem>
                  দলের একটা পাঁচ লাইনের Runbook, রাতে যে ই ফোন ধরুক, এই ক্রমে চালায়:{" "}
                  <code>systemctl --failed</code>, <code>journalctl -p warning -b -n 50</code>,
                  সন্দেহের Service এর <code>journalctl -u NAME -e</code>, Caddy এর error লাইন,
                  আর <code>df -h</code>।
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
      title: <SectionTitle>পর্যটকের Error থেকে আসল লাইন পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো লেসনটা একটা ক্রমে, যেটা যেকোনো Server এর যেকোনো গোলমালে খাটে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "অভিযোগটা সংখ্যায় বদলান",
              description:
                "কখন, কোন পাতায়, কী দেখলেন। রাত দুইটা দশ ঢাকা মানে 20:10 UTC, আগের দিন। 502 মানে Proxy পেছনের App কে পায়নি।",
            },
            {
              title: "Server এ ঢুকে বড় ছবিটা দেখুন",
              description:
                "ssh island, তারপর systemctl --failed। কোনো Service পড়ে আছে কি না, এক Command এ। deploy adm Group এ, তাই sudo লাগে না।",
            },
            {
              title: "সামনের দরজা থেকে শুরু করুন",
              description:
                "Request প্রথমে Caddy তে পৌঁছায়, তাই journalctl -u caddy, ঠিক সেই সময়ের, error এর লাইন --grep দিয়ে। connection refused মানে App এর দরজা বন্ধ ছিল।",
            },
            {
              title: "পেছনের Service এ যান",
              description:
                "journalctl -u my-tours-api --since আর --until দিয়ে সেই কয়েক মিনিট। systemctl status শুধু শেষ চেষ্টার সারাংশ দেখায়, তাই Journal টাই আসল।",
            },
            {
              title: "systemd এর লাইন পার হয়ে App এর প্রথম Error ধরুন",
              description:
                "শেষের Failed to start আর Start request repeated too quickly হলো ফলাফল। node[PID] দিয়ে শুরু প্রথম Error লাইনটাই কারণ।",
            },
            {
              title: "Error না থাকলে Kernel কে জিজ্ঞেস করুন",
              description:
                "Result: oom-kill বা signal=KILL দেখলে journalctl -k --grep \"out of memory\"। App কিছু না বলে উধাও হলে প্রায় সবসময় Memory।",
            },
            {
              title: "কেন এখন, তার খোঁজ",
              description:
                "কী বদলেছিল? apt/history.log এ Update, Deploy এর সময়, Environment File এর বদল। কারণের আগে প্রায় সবসময় একটা বদল থাকে।",
            },
            {
              title: "সারান, তারপর Log দিয়েই প্রমাণ করুন",
              description:
                "সারিয়ে reset-failed আর Restart। তারপর journalctl -u -f এ App এর listening, আর Caddy এর Access Log এ নতুন Request গুলো 200।",
            },
            {
              title: "পরের বারের জন্য লিখে রাখুন",
              description:
                "কোন Command দিয়ে কারণটা পেলেন, Runbook এ যোগ করুন। আর যে Log টা থাকলে আরও দ্রুত পেতেন, App এ সেটা যোগ করুন।",
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
                <strong>নিচের Lab টা আগে করুন।</strong> ছয়টা পরীক্ষায় Journal ঘুরে দেখা, নিজের
                App এর Log, Crash Loop ঘটিয়ে কারণ খোঁজা, Filter, OOM Kill আর Disk এর সীমা,
                সবই নিজের Practice Server এ।
              </ListItem>
              <ListItem>
                <strong>journalctl এর Man Page</strong>, প্রতিটা Option আর Filter এর পুরো তালিকা।
                Server এ <code>man journalctl</code>, অথবা{" "}
                <External href="https://man7.org/linux/man-pages/man1/journalctl.1.html">
                  man7.org/linux/man-pages/man1/journalctl.1.html
                </External>
              </ListItem>
              <ListItem>
                <strong>journald.conf</strong>, Storage, SystemMaxUse আর বাকি সীমার সংজ্ঞা আর
                Default মান।{" "}
                <External href="https://man7.org/linux/man-pages/man5/journald.conf.5.html">
                  man7.org/linux/man-pages/man5/journald.conf.5.html
                </External>
              </ListItem>
              <ListItem>
                <strong>systemd.exec</strong>, StandardOutput, SyslogLevelPrefix আর লাইনের
                শুরুর <code>&lt;3&gt;</code> এর নিয়ম।{" "}
                <External href="https://man7.org/linux/man-pages/man5/systemd.exec.5.html">
                  man7.org/linux/man-pages/man5/systemd.exec.5.html
                </External>
              </ListItem>
              <ListItem>
                <strong>systemd.time</strong>, <code>--since</code> আর <code>--until</code> কোন
                কোন ভাষা বোঝে।{" "}
                <External href="https://man7.org/linux/man-pages/man7/systemd.time.7.html">
                  man7.org/linux/man-pages/man7/systemd.time.7.html
                </External>
              </ListItem>
              <ListItem>
                <strong>logrotate</strong>, প্রতিটা নির্দেশের মানে।{" "}
                <External href="https://man7.org/linux/man-pages/man8/logrotate.8.html">
                  man7.org/linux/man-pages/man8/logrotate.8.html
                </External>
              </ListItem>
              <ListItem>
                <strong>Caddy এর log নির্দেশ</strong>, Access Log চালু করা, File এ লেখা আর
                ঘোরানোর Default।{" "}
                <External href="https://caddyserver.com/docs/caddyfile/directives/log">
                  caddyserver.com/docs/caddyfile/directives/log
                </External>
              </ListItem>
              <ListItem>
                <strong>jq এর Manual</strong>, JSON Log থেকে প্রশ্নের উত্তর বের করার ভাষা।{" "}
                <External href="https://jqlang.org/manual/">jqlang.org/manual</External>
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
                  Log হলো Server এর ডায়েরি: কী, কখন, কোনটার পরে কোনটা। Monitoring বলে এখন কেমন
                  আছে, Log বলে তখন কী হয়েছিল।
                </ListItem>
                <ListItem>
                  প্রায় সব লাইন যায় journald এর কাছে, জমে <code>/var/log/journal</code> এ, পড়া
                  হয় <code>journalctl</code> দিয়ে। Ubuntu একটা কপি rsyslog কে দেয়, যে{" "}
                  <code>/var/log/syslog</code> আর <code>auth.log</code> লেখে।
                </ListItem>
                <ListItem>
                  App শুধু stdout এ লিখবে, systemd সেটা Journal এ পৌঁছায়। Log পড়তে{" "}
                  <code>adm</code> Group এ থাকুন।
                </ListItem>
                <ListItem>
                  Filter চার রকম: কার (<code>-u</code>, <code>-t</code>, <code>-k</code>), কখন (
                  <code>--since</code>, <code>-b</code>), কতটা গুরুতর (<code>-p</code>), কোন শব্দ
                  (<code>--grep</code>)। Server এর সময় UTC, ঢাকার সময়ে খুঁজতে{" "}
                  <code>TZ=Asia/Dhaka</code>।
                </ListItem>
                <ListItem>
                  App আর Caddy এর লাইন Default এ Priority 6, তাই <code>-p err</code> এদের Error
                  দেখায় না। App এ <code>&lt;3&gt;</code> Prefix, Caddy তে <code>--grep</code>।
                </ListItem>
                <ListItem>
                  <code>systemctl status</code> প্রথম নজর, শুধু শেষ চেষ্টার লাইন। exited মানে App
                  নিজে বেরিয়েছে, killed মানে কেউ মেরেছে। 203 ভুল Path, 217 ভুল User।
                </ListItem>
                <ListItem>
                  Crash পড়ার নিয়ম: শেষ থেকে উপরে উঠুন, systemd এর লাইন পার হন, App এর প্রথম Error
                  ধরুন, Stack এ নিজের File খুঁজুন।
                </ListItem>
                <ListItem>
                  Error ছাড়া উধাও হলে <code>Result: oom-kill</code> আর{" "}
                  <code>journalctl -k</code>, মানে Memory শেষ।
                </ListItem>
                <ListItem>
                  journald নিজের সীমা মানে, Drop-in দিয়ে বদলান। Text File এর জন্য logrotate।
                  খোলা File মুছলে জায়গা ফেরে না।
                </ListItem>
                <ListItem>
                  ভালো Log: এক লাইনে এক JSON, UTC সময়, level, requestId, নম্বর দিয়ে মানুষ,
                  কোনো গোপন জিনিস নয়, আর কারণটা লেখা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৮, Monitoring Tools (top, htop)",
          content: (
            <p>
              Log আপনাকে বলল রাতে কী হয়েছিল। কিন্তু অনেক সমস্যা ঘটার আগেই চোখে পড়ে, যদি জানেন
              কোথায় তাকাতে হয়: CPU কতটা ব্যস্ত, Memory কতটা বাকি, Disk কতটা ভরা, কোন Process
              সবচেয়ে বেশি খাচ্ছে। এই লেসনে OOM Killer আর Disk ভরে যাওয়া দেখে এসেছেন, পরের লেসনে
              শিখবেন সেগুলো ঘটার আগেই ধরতে।{" "}
              <Lesson href="/devops/topic/monitoring-tools">Monitoring Tools (top, htop)</Lesson>
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Log", "Program এর লেখা সময় সহ ঘটনার লাইন, পরে কী হয়েছিল জানার একমাত্র পথ"],
      ["systemd-journald", "Kernel, systemd, Service আর syslog, সবার লাইন এক জায়গায় জমায়"],
      ["/var/log/journal", "থাকলে Journal স্থায়ী, না থাকলে /run এ, Reboot এ মোছে"],
      ["rsyslog", "Journal এর কপি নিয়ে /var/log/syslog, auth.log, kern.log লেখে"],
      ["adm Group", "এর সদস্যরা সবার Log পড়তে পারে, sudo ছাড়াই"],
      ["journalctl -u", "একটা Service এর লাইন, App এর নিজের আর systemd এর তার সম্পর্কে"],
      ["--since, --until", "সময় দিয়ে ছাঁকা। Server UTC তে, ঢাকার জন্য TZ=Asia/Dhaka"],
      ["-b, --list-boots", "এক Boot এর লাইন। -b -1 মানে আগের Boot, হঠাৎ Reboot এর পরে"],
      ["-p err", "Priority 0 থেকে 3। App আর Caddy এর stdout লাইন Default এ 6, তাই আসে না"],
      ["<3> Prefix", "stdout এর লাইনের শুরুতে, journald সেটা কেটে Priority 3 বসায়"],
      ["--grep", "শব্দ বা Regex খোঁজা। ছোট হাতের হলে বড় ছোট মানে না"],
      ["systemctl status", "অবস্থা আর শেষ চেষ্টার লাইন। exited নিজে বেরোনো, killed মারা পড়া"],
      ["203/EXEC, 217/USER", "systemd এর নিজের Code: ভুল ExecStart, অজানা User"],
      ["Crash পড়া", "শেষ থেকে উপরে, systemd পার হয়ে, App এর প্রথম Error"],
      ["OOM Killer", "Memory শেষে Kernel এর SIGKILL। App এর Log এ কিছু থাকে না, journalctl -k এ থাকে"],
      ["Caddy এর Log", "নিজের কাজ Journal এ, Access Log শুধু log লিখলে, File এ, নিজে ঘোরায়"],
      ["Disk এর সীমা", "journald এর Drop-in আর --vacuum, Text File এর জন্য logrotate"],
      ["ভালো Log", "এক লাইনে এক JSON, UTC, level, requestId, কোনো গোপন জিনিস নয়"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "my-tours-api শুধু console.log দিয়ে লেখে, কোনো Log File খোলে না। systemd এর অধীনে চললে সেই লাইনগুলো কোথায় পাবেন?",
        options: [
          {
            key: "A",
            text: "কোথাও না, Terminal না থাকলে console.log হারিয়ে যায়",
            isCorrect: false,
            explanation:
              "systemd App এর stdout আর stderr এর অন্য প্রান্ত journald কে দিয়ে রাখে, তাই কিছুই হারায় না।",
          },
          {
            key: "B",
            text: "Journal এ, journalctl -u my-tours-api দিয়ে",
            isCorrect: true,
            explanation:
              "ঠিক। systemd প্রতিটা লাইন journald এ পাঠায়, সময়, PID আর Service এর নাম সহ।",
          },
          {
            key: "C",
            text: "/srv/my-tours/app.log এ",
            isCorrect: false,
            explanation: "App নিজে File না খুললে এমন কোনো File তৈরি হয় না।",
          },
          {
            key: "D",
            text: "শুধু /var/log/auth.log এ",
            isCorrect: false,
            explanation: "auth.log এ Login আর sudo এর লাইন থাকে, App এর নয়।",
          },
        ],
      },
      {
        id: 2,
        text: "Crash Loop এর পরে Journal এর শেষ লাইন: Failed to start my-tours-api.service। তার আগেরটা: Start request repeated too quickly। এই দুইটা লাইন কী বলছে?",
        options: [
          {
            key: "A",
            text: "App এর ভেতরের Bug টা কী",
            isCorrect: false,
            explanation: "দুইটাই systemd এর লেখা, App এর ভেতরে কী হয়েছিল সেটা এরা জানে না।",
          },
          {
            key: "B",
            text: "systemd বারবার চেষ্টা করে হাল ছেড়ে দিয়েছে, কারণটা উপরে App এর লাইনে",
            isCorrect: true,
            explanation:
              "ঠিক। এগুলো ফলাফলের সারাংশ। কারণ খুঁজতে উপরে উঠে node[PID] দিয়ে শুরু প্রথম Error লাইন ধরতে হবে।",
          },
          {
            key: "C",
            text: "Server এর Memory শেষ",
            isCorrect: false,
            explanation: "Memory শেষ হলে Result: oom-kill আর signal=KILL দেখাত।",
          },
          {
            key: "D",
            text: "Unit File এ ভুল আছে",
            isCorrect: false,
            explanation:
              "Unit File এর ভুল হলে 203/EXEC বা 217/USER এর মতো Code দেখাত। এখানে App চালু হয়ে নিজে বেরিয়েছে, status=1।",
          },
        ],
      },
      {
        id: 3,
        text: "App স্পষ্টভাবে Error Print করছে, অথচ journalctl -u my-tours-api -p err এ সেই লাইন আসছে না। কেন?",
        options: [
          {
            key: "A",
            text: "journald Error লাইন জমা রাখে না",
            isCorrect: false,
            explanation: "জমা ঠিকই রাখে, -p ছাড়া চালালেই দেখা যায়।",
          },
          {
            key: "B",
            text: "stdout এর লাইন journald Default এ Priority 6 দেয়, ভেতরে Error লেখা থাকলেও",
            isCorrect: true,
            explanation:
              "ঠিক। App লাইনের শুরুতে <3> দিলে journald সেটাকে Priority 3 বসায়, নইলে --grep দিয়ে খুঁজতে হয়।",
          },
          {
            key: "C",
            text: "-p err শুধু Kernel এর লাইন দেখায়",
            isCorrect: false,
            explanation: "-p যেকোনো উৎসের লাইনে কাজ করে, systemd এর Failed to start তো দেখায়ই।",
          },
          {
            key: "D",
            text: "Error গুলো stderr এ গেছে, Journal এ নয়",
            isCorrect: false,
            explanation: "stderr ও Journal এ যায়, Priority সেখানেও Default এ 6।",
          },
        ],
      },
      {
        id: 4,
        text: "পর্যটক বললেন ঢাকার রাত দুইটা দশে সমস্যা হয়েছিল। Server এর ঘড়ি UTC তে। কোন Command ঠিক সময়ের লাইন দেখাবে?",
        options: [
          {
            key: "A",
            text: 'journalctl -u caddy --since "02:05" --until "02:20"',
            isCorrect: false,
            explanation: "এটা Server এর রাত দুইটা, মানে ঢাকার সকাল আটটা। ছয় ঘণ্টা ভুল।",
          },
          {
            key: "B",
            text: 'TZ=Asia/Dhaka journalctl -u caddy --since "02:05" --until "02:20"',
            isCorrect: true,
            explanation:
              "ঠিক। TZ বসালে journalctl সময়গুলো ঢাকার হিসেবে বোঝে আর দেখায়। নিজে ছয় ঘণ্টা বিয়োগ করে 20:05 লেখাও চলে, আগের দিনের তারিখ সহ।",
          },
          {
            key: "C",
            text: "journalctl -u caddy -b -1",
            isCorrect: false,
            explanation: "এটা আগের Boot এর লাইন দেখায়, সময়ের সাথে এর সম্পর্ক নেই।",
          },
          {
            key: "D",
            text: "journalctl -u caddy -n 200",
            isCorrect: false,
            explanation: "শেষ দুইশো লাইন, যেগুলো সাত ঘণ্টা পরের, রাত দুইটার নয়।",
          },
        ],
      },
      {
        id: 5,
        text: "status এ লেখা: Result: oom-kill আর Main PID: 698 (code=killed, signal=KILL)। App এর Log এ শেষ লাইন holding 112 MB, কোনো Error নেই। কী ঘটেছে?",
        options: [
          {
            key: "A",
            text: "কেউ ভুল করে kill -9 চালিয়েছে",
            isCorrect: false,
            explanation: "তাহলে Result: oom-kill লেখা থাকত না।",
          },
          {
            key: "B",
            text: "Memory ফুরিয়ে যাওয়ায় Kernel এর OOM Killer Process টা মেরেছে",
            isCorrect: true,
            explanation:
              "ঠিক। SIGKILL ধরা যায় না, তাই App কিছু লিখতে পারেনি। journalctl -k --grep \"out of memory\" এ Kernel এর লাইন পাবেন।",
          },
          {
            key: "C",
            text: "App নিজে Exit Code 9 দিয়ে বেরিয়েছে",
            isCorrect: false,
            explanation: "নিজে বেরোলে code=exited লেখা থাকত, killed নয়।",
          },
          {
            key: "D",
            text: "Disk ভরে গেছে",
            isCorrect: false,
            explanation: "Disk ভরলে App এর লাইনে ENOSPC বা No space left on device আসত।",
          },
        ],
      },
      {
        id: 6,
        text: "deploy হিসেবে journalctl -u caddy চালালে আসে: No journal files were opened due to insufficient permissions। সবচেয়ে ভালো সমাধান কোনটা?",
        options: [
          {
            key: "A",
            text: "sudo chmod 777 /var/log/journal",
            isCorrect: false,
            explanation: "এতে সবাই সবার Log পড়তে আর বদলাতে পারবে। কখনো নয় (লেসন ০৪)।",
          },
          {
            key: "B",
            text: "deploy কে adm Group এ যোগ করে আবার Login করা",
            isCorrect: true,
            explanation:
              "ঠিক। adm বা systemd-journal Group এর সদস্যরা সবার লাইন পড়তে পারে, পুরো Server এর চাবি ছাড়াই।",
          },
          {
            key: "C",
            text: "সবসময় root হিসেবে Login করা",
            isCorrect: false,
            explanation: "লেসন ০৩ এ root Login বন্ধ করেছেন, সেটা খোলার কারণ এটা নয়।",
          },
          {
            key: "D",
            text: "journald বন্ধ করে শুধু Text File পড়া",
            isCorrect: false,
            explanation: "Text File গুলোর Group ও adm, একই অনুমতি লাগবে।",
          },
        ],
      },
      {
        id: 7,
        text: "Disk 98 শতাংশ ভরা, /var/log/journal নিয়েছে 3.8G। এখনই জায়গা ফেরত পাওয়ার আর ভবিষ্যতে আটকানোর ঠিক উপায় কোনটা?",
        options: [
          {
            key: "A",
            text: "sudo rm -rf /var/log/journal/*",
            isCorrect: false,
            explanation:
              "journald File গুলো খোলা রাখে, হাত দিয়ে মুছলে জায়গা পুরো ফেরত নাও আসতে পারে, আর Journal ভাঙে।",
          },
          {
            key: "B",
            text: "journalctl --vacuum-size দিয়ে ছাঁটা, আর Drop-in এ SystemMaxUse বসানো",
            isCorrect: true,
            explanation:
              "ঠিক। vacuum এখনই পুরনো অংশ নিরাপদে মোছে, SystemMaxUse ভবিষ্যতে সীমা বেঁধে দেয়।",
          },
          {
            key: "C",
            text: "logrotate এ Journal এর নিয়ম লেখা",
            isCorrect: false,
            explanation: "logrotate Text File এর জন্য। Journal নিজের সীমা নিজে মানে।",
          },
          {
            key: "D",
            text: "Server Reboot করা",
            isCorrect: false,
            explanation: "Journal স্থায়ী, Reboot এর পরেও থাকে। কিছুই বদলাবে না।",
          },
        ],
      },
      {
        id: 8,
        text: "নিচের কোন Log লাইনটা রাত দুইটায় সবচেয়ে কাজে লাগবে?",
        options: [
          {
            key: "A",
            text: "booking failed!!",
            isCorrect: false,
            explanation: "কোন বুকিং, কোন Request, কেন, কখন, কিছুই বলে না।",
          },
          {
            key: "B",
            text: '{"time":"2026-10-30T20:10:04Z","level":"error","msg":"booking failed","requestId":"req-9K1P","reason":"seat already taken"}',
            isCorrect: true,
            explanation:
              "ঠিক। UTC সময়, level, কারণ আর requestId, যেটা দিয়ে Caddy থেকে App পর্যন্ত একই Request খোঁজা যায়।",
          },
          {
            key: "C",
            text: "10/31 2:10 AM error for tourist@mail.example",
            isCorrect: false,
            explanation: "সময় অস্পষ্ট, কারণ নেই, আর একজন মানুষের Email Log এ চলে গেছে।",
          },
          {
            key: "D",
            text: "error: something went wrong, session=Qm9va2luZ...",
            isCorrect: false,
            explanation: "কারণ নেই, আর Session এর মান Log এ, যেটা দিয়ে কেউ অন্যের হয়ে ঢুকতে পারে।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের Server এর Log নিজে পড়ুন, ভাঙুন আর সারান",
    subtitle: "ছয়টা পরীক্ষা, Practice Server এ deploy হিসেবে",
    stepName: "LAB",
    steps: [
      {
        title: "Journal এর সাথে পরিচয়",
        description:
          "adm Group এ যোগ হন, আবার Login করুন, তারপর Journal কত বড়, কোথায় থাকে, /var/log এ কী আছে আর কয়টা Boot জমা আছে দেখুন। প্রথম Command গুলো Permission এর Hint দিলে বুঝবেন কেন Group টা দরকার।",
      },
      {
        title: "কথা বলা একটা Service",
        description:
          "ছোট একটা log-demo App বসান, যেটা প্রতিটা ঘটনা JSON এ stdout এ লেখে। আরেকটা Terminal এ -f চালু রেখে দুইটা Request পাঠান। দেখবেন listening, request আর booking failed এর লাইন, আর -p err এ শুধু booking failed।",
      },
      {
        title: "ভাঙুন, কারণ খুঁজুন, সারান",
        description:
          "Environment File থেকে DATABASE_URL মুছে Restart দিন। status এ শুধু systemd এর সারাংশ, Journal এ উপরে উঠে App এর Error: DATABASE_URL is not set। লাইনটা ফেরত দিয়ে reset-failed, Restart, আর listening দেখে প্রমাণ করুন।",
      },
      {
        title: "Filter জোড়া লাগানো",
        description:
          "সময়, ঢাকার সময়, দুইটা Service একসাথে, Priority এর সীমা, একটা requestId, -o verbose আর jq। প্রতিটার পরে গুনে দেখুন কয়টা লাইন বাকি থাকল।",
      },
      {
        title: "OOM Kill নিজে ঘটান",
        description:
          "128 MB এর সীমা দেওয়া একটা Memory খেকো Service চালান। status এ Result: oom-kill, App এর শেষ কথা holding 112 MB, আর Kernel এর Killed process লাইন, তিনটা একসাথে মিলিয়ে নিন।",
      },
      {
        title: "Disk এর সীমা বাঁধুন",
        description:
          "Journal এর আকার দেখে পুরনো অংশ ছাঁটুন, Drop-in দিয়ে স্থায়ী সীমা বসান, আর একটা Text Log এর জন্য logrotate এর নিয়ম লিখে আগে -d দিয়ে দেখুন, তারপর -f দিয়ে ঘোরান। শেষে সব পরিষ্কার করুন।",
      },
    ],
    codeBlocks: [
      { filename: "1-meet-the-journal.sh", language: "bash", code: `# Practice Server এ deploy হিসেবে, একটা একটা লাইন করে চালান।

# ১. আগে দেখুন আপনি কোন কোন Group এ আছেন। adm না থাকলে অন্যদের Log দেখবেন না।
id
sudo usermod -aG adm "$USER"
# এবার exit দিয়ে বেরিয়ে আবার SSH করে ঢুকুন। নতুন Group নতুন Login থেকে কাজ করে।

# ২. Journal কত জায়গা নিচ্ছে, আর কোথায় থাকে
journalctl --disk-usage
ls -ld /var/log/journal /run/log/journal

# ৩. /var/log এ কী কী আছে, আর পড়ার অনুমতি কার
ls /var/log
ls -l /var/log/syslog /var/log/auth.log

# ৪. শেষ দশটা লাইন, আর কোন কোন Boot এর Log জমা আছে
journalctl -n 10 --no-pager
journalctl --list-boots --no-pager` },
      { filename: "2-a-service-that-talks.sh", language: "bash", code: `# Node না থাকলে আগে বসান: Ubuntu এর নিজের Package টাই যথেষ্ট
command -v node || { sudo apt update && sudo apt install -y nodejs; }

sudo mkdir -p /srv/log-demo /etc/log-demo

# ছোট একটা App: প্রতিটা ঘটনা একটা JSON লাইন হয়ে stdout এ যায়
sudo tee /srv/log-demo/server.mjs > /dev/null <<'EOF'
import http from "node:http";
import { randomUUID } from "node:crypto";

// লাইনের শুরুর <3>, <4>, <6> দেখে journald Priority বসায়: err, warning, info।
const PRIORITY = { error: "<3>", warn: "<4>", info: "<6>" };

function log(level, msg, fields = {}) {
  const line = JSON.stringify({ time: new Date().toISOString(), level, msg, ...fields });
  process.stdout.write(PRIORITY[level] + line + "\\n");
}

// দরকারি Setting না থাকলে এখনই থামুন। পরে ভাঙার চেয়ে এখন ভাঙা ভালো।
for (const name of ["PORT", "DATABASE_URL"]) {
  if (!process.env[name]) throw new Error(\`\${name} is not set\`);
}

const server = http.createServer((req, res) => {
  const requestId = req.headers["x-request-id"] ?? randomUUID();
  res.setHeader("X-Request-Id", requestId);
  if (req.url === "/api/boom") {
    log("error", "booking failed", { requestId, path: req.url, reason: "seat already taken" });
    res.writeHead(409).end("conflict\\n");
    return;
  }
  log("info", "request", { requestId, method: req.method, path: req.url, status: 200 });
  res.end("ok\\n");
});

server.listen(Number(process.env.PORT), "127.0.0.1", () => {
  log("info", "listening", { port: Number(process.env.PORT) });
});
EOF

# Setting গুলো আলাদা File এ। এখানে কোনো গোপন কিছু নেই, শুধু Demo এর ঠিকানা।
printf 'PORT=3100\\nDATABASE_URL=postgres://demo@127.0.0.1:5432/demo\\n' | sudo tee /etc/log-demo/api.env > /dev/null
sudo chmod 640 /etc/log-demo/api.env

sudo tee /etc/systemd/system/log-demo.service > /dev/null <<'EOF'
[Unit]
Description=Log demo for Module 07 Lesson 07

[Service]
# systemd নিজেই এই Service এর জন্য একটা অস্থায়ী User বানিয়ে নেয়
DynamicUser=yes
EnvironmentFile=/etc/log-demo/api.env
ExecStart=/usr/bin/node /srv/log-demo/server.mjs
Restart=on-failure
RestartSec=1
EOF

sudo systemctl daemon-reload
sudo systemctl start log-demo
sleep 1   # App টাকে Port খোলার এক মুহূর্ত সময় দিন
systemctl status log-demo --no-pager

# আরেকটা Terminal খুলে এটা চালু রাখুন, তারপর নিচের curl গুলো চালান:
#   journalctl -u log-demo -f
curl -s -H "X-Request-Id: req-LAB1" http://127.0.0.1:3100/api/tours
curl -s -H "X-Request-Id: req-LAB2" http://127.0.0.1:3100/api/boom

journalctl -u log-demo -n 4 --no-pager
journalctl -u log-demo -p err --no-pager` },
      { filename: "3-break-it.sh", language: "bash", code: `# DATABASE_URL লাইনটা মুছে দিন, তারপর Restart। App টা চালু হতেই পড়ে যাবে।
sudo sed -i '/^DATABASE_URL=/d' /etc/log-demo/api.env
sudo systemctl restart log-demo
sleep 8

# প্রথম দেখা: status শুধু systemd এর সারাংশ দেখায়
systemctl status log-demo --no-pager

# আসল কারণ খুঁজতে Journal এ উপরে উঠুন
journalctl -u log-demo -n 30 --no-pager

# অথবা সরাসরি ঝামেলা শুরুর পরের প্রথম Error লাইনটা।
# বড় হাতের E আছে, তাই খোঁজাটা হুবহু মেলাবে, "level":"error" লাইনগুলো আসবে না।
journalctl -u log-demo --since "2 min ago" --grep "Error:" --no-pager | head -n 1

# সারান: লাইনটা ফেরত দিন, systemd এর গোনা শূন্য করুন, আবার চালু করুন
echo 'DATABASE_URL=postgres://demo@127.0.0.1:5432/demo' | sudo tee -a /etc/log-demo/api.env > /dev/null
sudo systemctl reset-failed log-demo
sudo systemctl restart log-demo
sleep 2
journalctl -u log-demo -n 2 --no-pager` },
      { filename: "4-filters.sh", language: "bash", code: `# সময় দিয়ে
journalctl -u log-demo --since "10 min ago" --no-pager
journalctl -u log-demo --since today --until "1 min ago" --no-pager

# একই লাইন, ঢাকার সময়ে
TZ=Asia/Dhaka journalctl -u log-demo -n 3 --no-pager

# দুইটা Service একসাথে, সময়ের ক্রমে মিশিয়ে
journalctl -u log-demo -u ssh --since "1 hour ago" --no-pager

# কতটা গুরুতর: warning থেকে err পর্যন্ত, এই Boot এ
journalctl -b -p warning..err --no-pager

# একটা নির্দিষ্ট Request
journalctl -u log-demo --grep "req-LAB2" --no-pager

# একটা লাইনের সব লুকানো Field
journalctl -u log-demo -n 1 -o verbose --no-pager

# JSON লাইন গুলো jq দিয়ে ছাঁকা। JSON নয় এমন লাইন fromjson? চুপচাপ বাদ দেয়।
command -v jq || { sudo apt update && sudo apt install -y jq; }
journalctl -u log-demo -o cat --no-pager | jq -cR 'fromjson? | select(.level=="error") | {time, requestId, reason}'` },
      { filename: "5-oom.sh", language: "bash", code: `# প্রতি দশমাংশ সেকেন্ডে 16 MB নেয়, কখনো ছাড়ে না
sudo tee /usr/local/bin/memory-hog.mjs > /dev/null <<'EOF'
const hold = [];
setInterval(() => {
  hold.push(Buffer.alloc(16 * 1024 * 1024, 1));
  console.log(\`holding \${hold.length * 16} MB\`);
}, 100);
EOF

# এই Service কে 128 MB এর বেশি দেওয়া হবে না
sudo tee /etc/systemd/system/memory-hog.service > /dev/null <<'EOF'
[Unit]
Description=Memory hog for Module 07 Lesson 07

[Service]
ExecStart=/usr/bin/node /usr/local/bin/memory-hog.mjs
MemoryMax=128M
EOF

sudo systemctl daemon-reload
sudo systemctl start memory-hog
sleep 3

systemctl status memory-hog --no-pager           # Result: oom-kill
journalctl -u memory-hog -n 5 --no-pager         # App এর শেষ কথা, তারপর systemd
journalctl -k --grep "out of memory" --no-pager  # Kernel এর নিজের বয়ান

# পরিষ্কার
sudo rm /etc/systemd/system/memory-hog.service /usr/local/bin/memory-hog.mjs
sudo systemctl daemon-reload
sudo systemctl reset-failed memory-hog` },
      { filename: "6-disk.sh", language: "bash", code: `# Journal কত বড়, আর পুরনো অংশ ছাঁটা
journalctl --disk-usage
sudo journalctl --vacuum-time=14d

# স্থায়ী সীমা: একটা Drop-in File, মূল File এ হাত না দিয়ে
sudo mkdir -p /etc/systemd/journald.conf.d
sudo tee /etc/systemd/journald.conf.d/practice.conf > /dev/null <<'EOF'
[Journal]
SystemMaxUse=500M
SystemKeepFree=1G
MaxRetentionSec=1month
EOF
sudo systemctl restart systemd-journald
systemd-analyze cat-config systemd/journald.conf | tail -5

# একটা Text Log আর তার logrotate নিয়ম
sudo mkdir -p /var/log/log-demo
echo "$(date -u +%FT%TZ) nightly job ok" | sudo tee -a /var/log/log-demo/job.log > /dev/null
sudo tee /etc/logrotate.d/log-demo > /dev/null <<'EOF'
/var/log/log-demo/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 root adm
    dateext
}
EOF
sudo logrotate -d /etc/logrotate.d/log-demo     # শুধু বলে কী করত, কিছু করে না
sudo logrotate -f -v /etc/logrotate.d/log-demo  # এখনই একবার ঘুরিয়ে দেখুন
ls -l /var/log/log-demo/

# Lab শেষে সব পরিষ্কার
sudo systemctl stop log-demo
sudo rm -rf /etc/systemd/system/log-demo.service /srv/log-demo /etc/log-demo /var/log/log-demo /etc/logrotate.d/log-demo
sudo systemctl daemon-reload` },
    ],
    tip: "পরীক্ষা ৩ আর ৫ পাশাপাশি রেখে ভাবুন, কারণ দুইটাতেই Service পড়ে গেছে কিন্তু খোঁজার জায়গা আলাদা। প্রথমটায় App নিজে বলে গেছে কেন থামল, status=1/FAILURE, তাই উত্তর App এর লাইনে। দ্বিতীয়টায় App কিছু বলার সুযোগ পায়নি, signal=KILL, তাই উত্তর Kernel এর লাইনে। status এর এক শব্দ, exited না killed, বলে দেয় পরের Command টা কোনটা। এই এক অভ্যাসেই রাত দুইটার অর্ধেক সময় বেঁচে যায়।",
  },
  assignment: {
    title: "Mini Project: my-tours এর Log ব্যবস্থা আর রাত দুইটার Runbook",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>ঘটনার সময়রেখা:</strong> নিজের my-tours-api তে ইচ্ছা করে তিনটা আলাদা
        গোলমাল ঘটান: Environment এর একটা Setting বাদ, Unit File এ ExecStart এর Path ভুল, আর
        User= এ অজানা একটা নাম। প্রতিটার পরে শুধু Log পড়ে লিখুন কী হয়েছে, কোন লাইন থেকে
        বুঝলেন, আর status এর কোন Code টা দেখেছিলেন।
      </span>,
      <span key="2">
        <strong>ভালো Log বসান:</strong> my-tours-api এর Log কে এক লাইনে এক JSON বানান,
        প্রতিটায় UTC সময়, level, msg আর requestId (না এলে নিজে বানাবে), Priority এর Prefix
        সহ। Cookie, Authorization আর DATABASE_URL যে কোনোভাবেই Log এ না যায়, সেটা একটা ছোট
        পরীক্ষা লিখে প্রমাণ করুন, পরীক্ষাটা <code>spec/</code> Folder এ রাখুন।
      </span>,
      <span key="3">
        <strong>সীমা বাঁধুন:</strong> নিজের Server এ journald এর Drop-in লিখুন, Server এর
        Disk এর আকার দেখে SystemMaxUse ঠিক করুন আর কেন সেই সংখ্যা বেছেছেন এক লাইনে লিখুন।
        my-tours এর যেকোনো একটা Text Log এর জন্য logrotate এর নিয়ম লিখে <code>-d</code> এর
        ফলাফল জমা দিন।
      </span>,
      <span key="4">
        <strong>Runbook লিখুন:</strong> রাতে ফোন এলে যে ই ধরুক, সে যেন প্রথম দশ মিনিটে কী
        চালাবে জানে। পাঁচ থেকে সাতটা Command, প্রতিটার পাশে কী খুঁজছেন আর কী দেখলে পরের ধাপে
        যাবেন। সময় ঢাকা থেকে UTC তে বদলানোর নিয়মটাও রাখুন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের নতুন একজন সদস্য বললেন, Log খুলে
        দেখলাম শেষে লেখা Failed to start, তাই Server Restart দিয়েছি, কিন্তু আবার পড়ে যাচ্ছে।
        তাঁকে বোঝান শেষ লাইনটা কেন কারণ নয়, কারণটা কোথায় আর কীভাবে খুঁজবেন, Restart কেন কাজ
        করছে না, আর exited আর killed এর তফাত কী।
      </span>,
    ],
    deliverables: [
      <span key="1">তিনটা গোলমালের সময়রেখা, প্রতিটার মূল Log লাইন আর status এর Code সহ</span>,
      <span key="2">my-tours-api এর Log Function, আর গোপন জিনিস Log এ না যাওয়ার পরীক্ষা</span>,
      <span key="3">journald এর Drop-in, logrotate এর নিয়ম আর তার -d ফলাফল</span>,
      <span key="4">রাত দুইটার Runbook, পাঁচ থেকে সাতটা Command সহ</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
