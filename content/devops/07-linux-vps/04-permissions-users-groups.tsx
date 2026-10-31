/**
 * What: Module 07 Lesson 04, Permissions, Users and Groups. It teaches how Linux knows who is
 * who (users, UIDs, groups, /etc/passwd, /etc/group, /etc/shadow), root and sudo, human users
 * against service users, reading `ls -l`, the nine permission bits and the order the kernel
 * checks them, r, w and x on files against directories, octal modes, chmod, chown, chgrp,
 * umask, setuid, setgid, the sticky bit, ACLs, and a method for every "Permission denied".
 *
 * Why: Every later lesson in this module (environment files, systemd services, logs, cron) ends
 * in a question of who may read or write what. Each command and output here was run on the
 * Ubuntu 24.04 practice server of this module, so the reader sees the exact text their own
 * server will print, and the lab scripts were run end to end before they were written down.
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
  PermAccessLab,
  PermModeLab,
  PermUmaskLab,
} from "../../../components/course/topics/linux/perm-animations";
import {
  PermBitsDiagram,
  PermCheckOrderDiagram,
  PermFileVsDirSplit,
  PermIdentityDiagram,
  PermLsAnatomyDiagram,
  PermPathWalkDiagram,
  PermSudoFlowDiagram,
} from "../../../components/course/topics/linux/perm-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

const linkClass = "text-primary underline underline-offset-4";

export const permissionsUsersGroupsContent: TopicData = {
  id: "permissions-users-groups",
  introduction: {
    badge: "MODULE 07 · LESSON 04",
    title: <SectionTitle>এই File টা কার, আর কে কী করতে পারবে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          শুক্রবার রাতে Island Tours এর দলের একজন নতুন সদস্য প্রথমবার Server এ ঢুকলেন।
          তিনি দেখতে চাইলেন API কোন Database এ যুক্ত হয়, তাই লিখলেন{" "}
          <code>cat /etc/islandtours/api.env</code>। উত্তর এলো এক লাইনের:
          Permission denied। তিনি ভাবলেন Server এ কিছু একটা ভেঙেছে। আসলে কিছুই
          ভাঙেনি। Server ঠিক যা করার কথা, তাই করেছে। ওই File এ Database এর
          Password আছে, আর Server জানে এই মুহূর্তে কে প্রশ্ন করছেন আর তাঁর সেটা
          দেখার অধিকার আছে কি না।
        </ContentParagraph>
        <ContentParagraph>
          আগের লেসনে আপনি SSH দিয়ে নিজের Server এ ঢুকেছেন, <code>deploy</code> নামে
          একটা User বানিয়েছেন, আর root এর সরাসরি Login বন্ধ করেছেন। তখন বলা হয়েছিল
          User আর sudo নিয়ে বিস্তারিত পরে হবে। সেই পরে এখন। একটা Linux Server এ
          একসাথে অনেকে থাকে: আপনি, আপনার দলের মানুষ, আর তার চেয়েও বেশি Program।
          Caddy, API, Database, প্রত্যেকে আলাদা একজন বাসিন্দা। কে কোন ঘরে ঢুকতে
          পারবে, কোন কাগজ পড়তে পারবে, কোনটা বদলাতে পারবে, এই হিসাবটাই Permission।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি <code>ls -l</code> এর যেকোনো লাইন এক নজরে পড়তে পারবেন,
          মানুষের জন্য আর Service এর জন্য আলাদা User বানাতে পারবেন, sudo কে ঠিক
          যতটুকু দরকার ততটুকু ক্ষমতা দিতে পারবেন, chmod আর chown দিয়ে একটা App এর
          Folder গুলো নিরাপদে সাজাতে পারবেন, আর যেকোনো Permission denied দেখে পাঁচটা
          প্রশ্নে বের করতে পারবেন ঠিক কোথায় আটকেছে। প্রতিটা Command এর Output এই
          Module এর Ubuntu 24.04 Practice Server থেকে নেওয়া, আপনার Server এও প্রায়
          হুবহু এটাই দেখবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "একটা হোটেলে প্রত্যেক অতিথি নিজের ঘরের চাবি পান, রাঁধুনি রান্নাঘরের, হিসাবরক্ষক অফিসের। ম্যানেজারের কাছে সব ঘরের চাবি থাকে, কিন্তু ভালো ম্যানেজার সেটা পকেটে রাখেন, দরকার ছাড়া বের করেন না। Linux এর Permission ঠিক এই হোটেল।",
      author: "Linux",
      role: "Lesson 04",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা Server, অনেক বাসিন্দা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিজের Laptop এ আপনি সম্ভবত একাই থাকেন, তাই User আর Permission নিয়ে
                কখনো ভাবতে হয়নি। কিন্তু Linux জন্ম থেকেই এমন যন্ত্রের জন্য তৈরি, যেখানে
                একসাথে অনেকে কাজ করে। Module 01 এর{" "}
                <Link href="/devops/topic/operating-system-basics" className={linkClass}>
                  Operating System
                </Link>{" "}
                লেসনে দেখেছিলেন, OS হলো সেই ব্যবস্থাপক যে সবার মাঝে Memory, CPU আর
                File ভাগ করে দেয়। ভাগ করতে হলে তাকে জানতে হয় কে কে আছে, আর কার কতটুকু
                পাওয়ার কথা।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর Server এ কারা থাকে, একবার গুনে দেখি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>মানুষ:</strong> {mono("deploy")}, দলের Admin, যিনি SSH দিয়ে
                  ঢোকেন, নতুন Release বসান, Config বদলান।
                </ListItem>
                <ListItem>
                  <strong>API এর Process:</strong> {mono("islandtours")}, একজন User
                  যার কোনো মানুষ নেই। তার একমাত্র কাজ API চালানো। সে Config পড়বে, ছবি
                  জমা রাখবে, আর কিছু না।
                </ListItem>
                <ListItem>
                  <strong>Caddy:</strong> {mono("caddy")}, আরেকজন মানুষহীন User।
                  HTTPS এর Certificate রাখে, বাইরের Request সামলায়। API এর Password তার
                  দেখার দরকার নেই।
                </ListItem>
                <ListItem>
                  <strong>root:</strong> সবার উপরে, যার জন্য কোনো দরজাই বন্ধ নয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এখন ভাবুন, সবাই যদি root হয়ে চলত। Caddy তে একটা নিরাপত্তা ত্রুটি পাওয়া
                গেল, আক্রমণকারী Caddy কে দিয়ে নিজের Command চালাতে পারল। Caddy যেহেতু
                root, আক্রমণকারী এখন পুরো Server এর মালিক: Database এর Password, সব
                পর্যটকের তথ্য, SSH এর চাবি, সব। কিন্তু Caddy যদি নিজের ছোট্ট{" "}
                <code>caddy</code> User হয়ে চলে, আক্রমণকারী ঠিক ততটুকুই পাবে যতটুকু
                Caddy পায়। ক্ষতি আছে, কিন্তু সেটা একটা ঘরে আটকে থাকে।
              </ContentParagraph>
              <ContentParagraph>
                এই চিন্তাটার একটা নাম আছে, <strong>Least Privilege</strong>, মানে
                সবচেয়ে কম অধিকার। প্রত্যেকে ঠিক ততটুকু পাবে যতটুকু তার কাজের জন্য
                লাগে, এক ফোঁটাও বেশি নয়। এই লেসনের প্রতিটা Command আসলে এই এক
                নীতিকে বাস্তবে বসানোর হাতিয়ার।
              </ContentParagraph>
              <ContentParagraph>
                পুরো ব্যবস্থাটা তিনটা প্রশ্নে দাঁড়িয়ে আছে, আর লেসনটাও এই তিন ভাগে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কে:</strong> প্রতিটা Process কোন User আর কোন কোন Group এর
                  হয়ে চলছে। এটা User আর Group এর অংশ, সেকশন ২ থেকে ৬।
                </ListItem>
                <ListItem>
                  <strong>কী:</strong> প্রতিটা File আর Directory র গায়ে কী লেবেল লাগানো
                  আছে: মালিক কে, Group কোনটা, আর নয়টা Permission Bit। এটা সেকশন ৭ থেকে
                  ১৩।
                </ListItem>
                <ListItem>
                  <strong>মেলানো:</strong> Kernel কীভাবে এই দুইটা মিলিয়ে হ্যাঁ বা না
                  বলে, আর না বললে আপনি কীভাবে খুঁজে বের করবেন কোথায় আটকাল। এটা সেকশন
                  ১৪।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "নিজের Practice Server এ পাশাপাশি চালান",
          content: (
            <p>
              এই লেসনের প্রতিটা Command আপনার নিজের Practice Server এ চালান, সেটা{" "}
              <Link href="/devops/topic/linux-filesystem" className={linkClass}>
                লেসন ০১
              </Link>{" "}
              এর Multipass VM হোক, WSL হোক, বা ভাড়া করা একটা VPS। আপনি{" "}
              <code>deploy</code> হয়ে ঢুকবেন, যেভাবে{" "}
              <Link href="/devops/topic/ssh-security-keys" className={linkClass}>
                লেসন ০৩
              </Link>{" "}
              এ সাজিয়েছিলেন। Output এর UID আর GID এর সংখ্যা আপনার যন্ত্রে একটু আলাদা
              হতে পারে, বাকিটা একই থাকবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "users",
      subHeader: { index: "002", title: "Users and UID" },
      title: <SectionTitle>User আসলে একটা সংখ্যা, নামটা মানুষের সুবিধার জন্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমে সবচেয়ে সহজ প্রশ্ন: আমি এখন কে? <code>id</code> Command টা উত্তর
                দেয়, আর উত্তরের ভেতরেই এই লেসনের অর্ধেকটা লুকিয়ে আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deploy@island-vps-01",
          code: String.raw`deploy@island-vps-01:~$ id
uid=1001(deploy) gid=1001(deploy) groups=1001(deploy),27(sudo),100(users)

deploy@island-vps-01:~$ whoami
deploy`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লক্ষ করুন, প্রতিটা নামের আগে একটা সংখ্যা। <code>uid=1001(deploy)</code>{" "}
                মানে এই User এর আসল পরিচয় 1001, আর deploy শুধু সেই সংখ্যার একটা ডাকনাম।
                এই সংখ্যার নাম <strong>UID</strong>, User Identifier। Kernel নাম চেনে
                না, চেনে শুধু সংখ্যা। Disk এ প্রতিটা File এর গায়েও নাম নয়, মালিকের UID
                লেখা থাকে। <code>ls -l</code> যখন মালিকের নাম দেখায়, সে আসলে সংখ্যাটা
                নিয়ে একটা তালিকায় খুঁজে নামটা বসিয়ে দেয়। <code>-n</code> দিলে এই
                অনুবাদটা আর করে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "names-are-numbers.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo ls -l /etc/islandtours
-rw-r----- 1 root islandtours 52 Oct 31 07:25 api.env

deploy@island-vps-01:~$ sudo ls -ln /etc/islandtours
-rw-r----- 1 0 996 52 Oct 31 07:25 api.env`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সেই নাম আর সংখ্যার তালিকাটা কোথায়? <code>/etc/passwd</code> নামের একটা
                সাধারণ Text File এ। নামে Password থাকলেও এখানে কোনো Password নেই, সেটা
                ইতিহাসের একটা চিহ্ন, যা নিয়ে সেকশন ৪ এ কথা হবে। প্রতিটা লাইন একজন
                User, আর লাইনটা কোলন দিয়ে সাতটা ঘরে ভাগ করা। পুরো File না খুলে
                নির্দিষ্ট User এর লাইন দেখতে <code>getent passwd</code> ব্যবহার করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "getent-passwd.sh",
          code: String.raw`deploy@island-vps-01:~$ getent passwd root deploy islandtours caddy
root:x:0:0:root:/root:/bin/bash
deploy:x:1001:1001:Island Tours admin,,,:/home/deploy:/bin/bash
islandtours:x:999:996::/nonexistent:/usr/sbin/nologin
caddy:x:997:995:Caddy web server:/var/lib/caddy:/usr/sbin/nologin`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ঘর", "deploy এর লাইনে", "মানে"],
          rows: [
            [mono("১. নাম"), <code key="1">deploy</code>, "মানুষ যে নামে ডাকে, Login এ যা লেখেন"],
            [mono("২. Password"), <code key="2">x</code>, "x মানে আসল Password এখানে নেই, /etc/shadow তে আছে"],
            [mono("৩. UID"), <code key="3">1001</code>, "Kernel এর কাছে এই User এর আসল পরিচয়"],
            [mono("৪. GID"), <code key="4">1001</code>, "এই User এর মূল Group (Primary Group) এর নম্বর"],
            [mono("৫. বিবরণ"), <code key="5">Island Tours admin,,,</code>, "যা খুশি, সাধারণত পুরো নাম। পুরনো নাম GECOS"],
            [mono("৬. Home"), <code key="6">/home/deploy</code>, "Login করলে এখানে পৌঁছান, ব্যক্তিগত File এর জায়গা"],
            [mono("৭. Shell"), <code key="7">/bin/bash</code>, "Login এর পর কোন Program চলবে। nologin মানে Login চলবে না"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                UID গুলো এলোমেলো নয়, Ubuntu তিনটা পাড়ায় ভাগ করে রাখে। এই ভাগটা জানলে
                যেকোনো <code>/etc/passwd</code> দেখে এক নজরে বলতে পারবেন কোনটা মানুষ
                আর কোনটা Program।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>0:</strong> শুধু root। এই একটা সংখ্যার জন্য Kernel সাধারণ
                  নিয়ম প্রায় মানেই না। নাম যা-ই হোক, UID 0 মানেই root।
                </ListItem>
                <ListItem>
                  <strong>1 থেকে 999:</strong> System User, মানে Program এর জন্য
                  বানানো User। <code>islandtours</code> পেয়েছে 999, <code>caddy</code>{" "}
                  পেয়েছে 997। এদের সাধারণত কোনো মানুষ নেই, Login ও নেই।
                </ListItem>
                <ListItem>
                  <strong>1000 আর তার উপরে:</strong> মানুষ। Ubuntu প্রথম মানুষ User কে
                  1000 দেয়। এই Practice Server এ 1000 নম্বরটা আগেই{" "}
                  <code>ubuntu</code> নামের একটা User নিয়ে রেখেছিল, তাই deploy পেয়েছে
                  1001।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আপনার VPS এ ubuntu নামের User আছে কি না দেখুন",
          content: (
            <p>
              অনেক Cloud আর VPS এর Ubuntu Image এ আগে থেকেই <code>ubuntu</code> নামের
              একটা User থাকে, আর সে sudo Group এ থাকে। <code>getent group sudo</code>{" "}
              চালালে দেখবেন <code>sudo:x:27:ubuntu,deploy</code> এর মতো একটা লাইন। যে
              User আপনি ব্যবহার করেন না, তার হাতে sudo রাখা মানে একটা বাড়তি দরজা খোলা
              রাখা। হয় সেটা দিয়েই কাজ করুন, নয়তো বন্ধ করে দিন:{" "}
              <code>sudo usermod -L -s /usr/sbin/nologin ubuntu</code>। মুছতে চাইলে
              আগে নিশ্চিত হন তার Home এ দরকারি কিছু নেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "groups",
      subHeader: { index: "003", title: "Groups" },
      title: <SectionTitle>Group, একসাথে অনেককে একই চাবি দেওয়ার উপায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরুন Island Tours এ তিনজন Admin। তিনজনকেই sudo দিতে হবে, তিনজনকেই
                Release Folder এ লেখার অধিকার দিতে হবে। প্রতিটা File এ তিনজনের নাম
                আলাদা করে লেখা ঝামেলার, আর চতুর্থজন যোগ দিলে সব File আবার বদলাতে হবে।
                তার বদলে একটা দল বানান, দলকে অধিকার দিন, আর মানুষকে দলে ঢোকান বা বের
                করুন। এই দলের নাম <strong>Group</strong>, আর তার সংখ্যার নাম{" "}
                <strong>GID</strong>।
              </ContentParagraph>
              <ContentParagraph>
                Group এর তালিকা থাকে <code>/etc/group</code> এ। প্রতিটা লাইনে চারটা ঘর:
                নাম, Password এর জায়গা (প্রায় কখনো ব্যবহার হয় না), GID, আর সদস্যদের
                তালিকা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "getent-group.sh",
          code: String.raw`deploy@island-vps-01:~$ getent group sudo deploy islandtours
sudo:x:27:ubuntu,deploy
deploy:x:1001:
islandtours:x:996:

deploy@island-vps-01:~$ groups
deploy sudo users`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে একটা জিনিস প্রথমবার দেখলে খটকা লাগে। <code>deploy</code> Group এর
                সদস্য তালিকা খালি, অথচ <code>groups</code> বলছে deploy এই Group এ আছেন।
                কারণ একজন User দুই রকমভাবে Group এ থাকতে পারেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Primary Group:</strong> প্রতিটা User এর ঠিক একটা। এর GID লেখা
                  থাকে <code>/etc/passwd</code> এর চতুর্থ ঘরে, Group এর সদস্য তালিকায়
                  নয়। User যখন নতুন File বানান, সেই File এর Group হয় এটাই। Ubuntu প্রতিটা
                  মানুষ User এর জন্য তার নিজের নামে একটা Group বানায়, এর নাম User
                  Private Group।
                </ListItem>
                <ListItem>
                  <strong>Supplementary Group:</strong> বাড়তি সদস্যপদ, যতগুলো খুশি।{" "}
                  <code>sudo</code> আর <code>users</code> deploy এর Supplementary Group,
                  তাই এদের নাম <code>/etc/group</code> এর সদস্য তালিকায় আছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                কাউকে একটা Group এ যোগ করার Command হলো <code>usermod -aG</code>। এখানে
                একটা অক্ষর ভুলে যাওয়া Server এ সবচেয়ে প্রচলিত দুর্ঘটনাগুলোর একটা।{" "}
                <code>-G</code> একা থাকলে মানে, Supplementary Group এর পুরো তালিকা এখন
                থেকে ঠিক এটা, আগের সব বাদ। <code>-a</code> (append) সাথে থাকলে মানে,
                পুরনো তালিকা যেমন আছে থাকবে, শুধু এটা যোগ হবে। <code>-a</code> বাদ দিলে
                কী হয়, একটা পরীক্ষার User দিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "usermod-trap.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo usermod -aG sudo trial; id trial
uid=1002(trial) gid=1002(trial) groups=1002(trial),27(sudo),100(users)

deploy@island-vps-01:~$ sudo usermod -G ops trial; id trial
uid=1002(trial) gid=1002(trial) groups=1002(trial),1003(ops)
# -a ছাড়া: sudo আর users দুইটাই হারিয়ে গেল, শুধু ops রইল`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিজের উপর -G চালালে নিজেই sudo হারাবেন",
          content: (
            <p>
              <code>sudo usermod -G docker deploy</code> লিখে Enter চাপলেন, আর deploy
              এখন শুধু docker Group এ। sudo Group নেই, তাই পরের বার sudo চাইলে উত্তর
              আসবে deploy is not in the sudoers file। যদি এটাই Server এর একমাত্র Admin
              হয়, তাহলে আপনি নিজের Server থেকে নিজেকে তালা মেরে দিলেন। ফিরতে হবে Provider
              এর Web Console দিয়ে। তাই আঙুলে গেঁথে নিন: Group যোগ করতে সবসময়{" "}
              <code>-aG</code>, অথবা আরও নিরাপদ <code>sudo gpasswd -a deploy docker</code>,
              যেটা শুধু যোগই করতে পারে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় চমকটা আরও সূক্ষ্ম। কাউকে Group এ যোগ করলেন, <code>id</code>{" "}
                বলছে তিনি এখন সদস্য, অথচ তাঁর খোলা Terminal এ নতুন অধিকারটা কাজ করছে না।
                কারণটা Module 01 এর{" "}
                <Link href="/devops/topic/how-a-program-runs" className={linkClass}>
                  Program কীভাবে চলে
                </Link>{" "}
                লেসনের সাথে জড়িত। Group এর তালিকা Process এর গায়ে বসে Login এর মুহূর্তে,
                আর প্রতিটা Child Process সেটা উত্তরাধিকার সূত্রে পায়। পরে File এ কী বদলাল,
                চলমান Process তা জানে না। নিচে একটা Process আগে থেকে চলছিল, তারপর User
                কে <code>ops</code> Group এ যোগ করা হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "stale-groups.sh",
          code: String.raw`root@island-vps-01:~# id guest                       # File এর হিসাব, নতুন
uid=1002(guest) gid=1002(guest) groups=1002(guest),100(users),1003(team),1004(ops)

root@island-vps-01:~# grep ^Groups /proc/<PID>/status   # চলমান Process এর হিসাব, পুরনো
Groups:	100 1002 1003
# 1004 (ops) নেই। এই Process যতক্ষণ চলবে, ops এর অধিকার পাবে না।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সমাধান সহজ: SSH থেকে বেরিয়ে আবার ঢুকুন। Service এর ক্ষেত্রে, মানে কোনো
              Program কে নতুন Group এ যোগ করলে, সেই Service টা Restart করুন। এই একটা
              কথা জানা না থাকলে মানুষ আধা ঘণ্টা ধরে ঠিকঠাক Permission এর দিকে তাকিয়ে
              থাকেন আর ভাবেন কেন কাজ করছে না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "shadow",
      subHeader: { index: "004", title: "Passwords" },
      title: <SectionTitle>/etc/shadow, যেখানে Password এর ছাপ লুকানো থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পুরনো দিনে Password এর ছাপ সত্যিই <code>/etc/passwd</code> এর দ্বিতীয়
                ঘরে থাকত। সমস্যা হলো, এই File সবাইকে পড়তে দিতে হয়, কারণ প্রতিটা Program
                কে UID থেকে নাম খুঁজতে হয়। তাই যে কেউ সবার Password এর ছাপ কপি করে নিয়ে
                ধীরে সুস্থে অনুমান করে মেলাতে পারত। সমাধান হিসেবে ছাপগুলো সরানো হলো আলাদা
                একটা File এ, যেটা শুধু root পড়তে পারে: <code>/etc/shadow</code>।
                দুইটা File এর লেবেল পাশাপাশি দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "shadow.sh",
          code: String.raw`deploy@island-vps-01:~$ ls -l /etc/passwd /etc/group /etc/shadow
-rw-r--r-- 1 root root    670 Oct 31 07:33 /etc/group
-rw-r--r-- 1 root root   1223 Oct 31 07:33 /etc/passwd
-rw-r----- 1 root shadow  648 Oct 31 07:33 /etc/shadow

deploy@island-vps-01:~$ cat /etc/shadow
cat: /etc/shadow: Permission denied

deploy@island-vps-01:~$ sudo grep -E '^(root|deploy|islandtours):' /etc/shadow
root:*:20750:0:99999:7:::
deploy:$y$j9T$<salt>$<hash>:20757:0:99999:7:::
islandtours:!:20757::::::`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় ঘরটাই আসল। এখানে তিন রকম জিনিস দেখতে পাবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>$y$j9T$...</code>: একটা আসল Password এর ছাপ। শুরুর{" "}
                  <code>$y$</code> বলে কোন পদ্ধতিতে ছাপ তৈরি, এখানে yescrypt, যা Ubuntu
                  24.04 এর Default। ছাপ থেকে Password ফেরত পাওয়া যায় না। Login এর সময়
                  আপনার লেখা Password থেকে আবার ছাপ বানিয়ে মেলানো হয়।{" "}
                  <code>&lt;salt&gt;</code> আর <code>&lt;hash&gt;</code> এখানে ইচ্ছা করে
                  ঢেকে রাখা, আসল ছাপ কখনো কোথাও কপি করবেন না।
                </ListItem>
                <ListItem>
                  <code>!</code>: Password দিয়ে Login বন্ধ। islandtours এর কোনো
                  Password নেই, থাকার দরকারও নেই।
                </ListItem>
                <ListItem>
                  <code>*</code>: কখনো Password বসানোই হয়নি। Ubuntu তে root এর ঘরে এটা
                  থাকে, কারণ root হিসেবে সরাসরি ঢোকার কথা নয়, ঢুকবেন sudo দিয়ে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                পুরো লাইন পড়ার দরকার কমই হয়। এক লাইনে অবস্থা জানতে{" "}
                <code>passwd -S</code> আছে। দ্বিতীয় ঘরে P মানে Password বসানো আছে, L মানে
                তালা দেওয়া (Locked)।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "passwd-status.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo passwd -S deploy
deploy P 2026-10-31 0 99999 7 -1

deploy@island-vps-01:~$ sudo passwd -S islandtours
islandtours L 2026-10-31 -1 -1 -1 -1`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "SSH Key থাকলে deploy এর Password কেন লাগে",
          content: (
            <p>
              লেসন ০৩ এ SSH দিয়ে Password Login বন্ধ করেছেন, ঢোকেন শুধু Key দিয়ে। তবুও
              deploy এর একটা Password থাকা দরকার, কারণ sudo সেটাই চায়। এটা দুইটা
              আলাদা দরজা: SSH Key দিয়ে Server এ ঢোকা, আর Password দিয়ে root এর ক্ষমতা
              নেওয়া। চোর যদি কোনোভাবে আপনার খোলা Terminal পেয়েও যায়, sudo এর Password
              না জেনে বড় কিছু করতে পারবে না। তাই Password টা লম্বা রাখুন আর Password
              Manager এ রাখুন, কোনো Command এ লিখবেন না। বদলাতে চাইলে{" "}
              <code>passwd</code> লিখে Enter, সে চোখের আড়ালে জিজ্ঞেস করবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "creating-users",
      subHeader: { index: "005", title: "Human and Service Users" },
      title: <SectionTitle>মানুষের জন্য এক রকম User, Program এর জন্য আরেক রকম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                User বানানোর দুইটা Command আছে, আর নাম প্রায় একই বলে মানুষ গুলিয়ে
                ফেলেন। <code>useradd</code> হলো নিচের তলার যন্ত্র, যা বলবেন ঠিক ততটুকুই
                করে, নিজে থেকে কিছু না। <code>adduser</code> হলো Debian আর Ubuntu এর
                বন্ধুসুলভ মোড়ক: Home Directory বানায়, সেখানে শুরুর File কপি করে, আর
                মানুষ User হলে Password জিজ্ঞেস করে। মানুষের জন্য adduser, Script আর
                Service User এর জন্য useradd, এই নিয়মে চললে ভুল কম হবে।
              </ContentParagraph>
              <ContentParagraph>
                নিচে একজন নতুন সাপোর্ট সদস্যের জন্য User বানানো হলো। আপনার Server এ
                Option ছাড়া চালালে adduser দুইবার Password চাইবে, তারপর নাম আর ফোন নম্বর
                ধরনের কয়েকটা প্রশ্ন করবে, যেগুলো Enter চেপে পার হতে পারেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "adduser.sh",
          code: `deploy@island-vps-01:~$ sudo adduser --comment "Rafi, support" rafi
info: Adding user \`rafi' ...
info: Selecting UID/GID from range 1000 to 59999 ...
info: Adding new group \`rafi' (1005) ...
info: Adding new user \`rafi' (1005) with group \`rafi (1005)' ...
info: Creating home directory \`/home/rafi' ...
info: Copying files from \`/etc/skel' ...
info: Adding new user \`rafi' to supplemental / extra groups \`users' ...
info: Adding user \`rafi' to group \`users' ...

deploy@island-vps-01:~$ sudo ls -la /home/rafi
drwxr-x--- 2 rafi rafi 4096 Oct 31 07:27 .
-rw-r--r-- 1 rafi rafi  220 Oct 31 07:27 .bash_logout
-rw-r--r-- 1 rafi rafi 3771 Oct 31 07:27 .bashrc
-rw-r--r-- 1 rafi rafi  807 Oct 31 07:27 .profile`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দেখুন adduser কী কী করল: নিজের নামে একটা Group (User Private Group),
                1000 এর উপরের একটা UID, <code>/home/rafi</code>, আর{" "}
                <code>/etc/skel</code> থেকে তিনটা শুরুর File। Home Directory র Mode{" "}
                <code>drwxr-x---</code>, মানে অন্য মানুষ User রা এখানে উঁকিও দিতে পারবেন
                না। Ubuntu 21.04 থেকে এটাই Default। Ubuntu 24.04 এর adduser এ বিবরণের
                জন্য <code>--comment</code> লিখুন, পুরনো লেখায় <code>--gecos</code>{" "}
                দেখবেন, সেটা এখন বাতিলের পথে।
              </ContentParagraph>
              <ContentParagraph>
                এবার Program এর জন্য User। Island Tours এর API যে User হয়ে চলে, তার
                দরকার একটা UID আর একটা Group, ব্যস। Home লাগবে না, Login লাগবে না,
                Password লাগবে না। ঠিক এটাই বলুন useradd কে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "service-user.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo useradd --system --no-create-home \
    --home-dir /nonexistent --shell /usr/sbin/nologin islandtours

deploy@island-vps-01:~$ getent passwd islandtours
islandtours:x:999:996::/nonexistent:/usr/sbin/nologin

deploy@island-vps-01:~$ id islandtours
uid=999(islandtours) gid=996(islandtours) groups=996(islandtours)

deploy@island-vps-01:~$ sudo su - islandtours
su: warning: cannot change directory to /nonexistent: No such file or directory
This account is currently not available.`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Option", "কী করে", "কেন"],
          rows: [
            [<code key="1">--system</code>, "1000 এর নিচের একটা UID দেয়", "এক নজরে বোঝা যায় এটা Program, মানুষ নয়"],
            [<code key="2">--no-create-home</code>, "Home Directory বানায় না", "Program এর ব্যক্তিগত ঘর লাগে না"],
            [<code key="3">--home-dir /nonexistent</code>, "Home হিসেবে এমন পথ লেখে যা নেই", "Debian এর প্রথা, পরিষ্কার বোঝায় এখানে কেউ থাকে না"],
            [<code key="4">--shell /usr/sbin/nologin</code>, "Login এর চেষ্টা করলে বিনয়ের সাথে না বলে", "কেউ এই User হয়ে Shell পাবে না, SSH দিয়েও না"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ লাইনটা খেয়াল করুন: This account is currently not available। root
                হয়েও su দিয়ে islandtours এর Shell পাওয়া গেল না, কারণ তার Shell হলো
                nologin, যার একমাত্র কাজ এই বাক্যটা বলে বেরিয়ে যাওয়া। তাহলে
                islandtours হয়ে কোনো কিছু পরীক্ষা করবেন কীভাবে? <code>sudo -u</code>{" "}
                দিয়ে, যা Shell ছাড়াই একটা নির্দিষ্ট Command সেই User হয়ে চালায়। এই
                লেসনের সব পরীক্ষা এভাবেই হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "sudo-u.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo -u islandtours whoami
islandtours

deploy@island-vps-01:~$ sudo -u islandtours sh -c 'echo hi > /srv/test.txt'
sh: 1: cannot create /srv/test.txt: Permission denied`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কেউ দল ছেড়ে গেলে কী করবেন, সেটাও জেনে রাখুন, কারণ এটা সবচেয়ে বেশি
                অবহেলিত কাজ। ধাপগুলো এই ক্রমে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আগে তালা:</strong> <code>sudo usermod -L rafi</code> Password
                  বন্ধ করে, <code>sudo usermod -s /usr/sbin/nologin rafi</code> Shell বন্ধ
                  করে। কিন্তু মনে রাখুন, SSH Key দিয়ে Login Password তালা মানে না। তাই
                  তাঁর <code>~/.ssh/authorized_keys</code> থেকে Key মুছুন (লেসন ০৩)।
                </ListItem>
                <ListItem>
                  <strong>খোলা Session বন্ধ:</strong> <code>who</code> দিয়ে দেখুন তিনি
                  এখনো ঢুকে আছেন কি না, থাকলে <code>sudo pkill -u rafi</code>।
                </ListItem>
                <ListItem>
                  <strong>তারপর মোছা:</strong> <code>sudo userdel -r rafi</code> User আর
                  তাঁর Home দুইটাই মোছে। Home এ দরকারি কিছু থাকলে আগে কপি করে নিন।
                </ListItem>
                <ListItem>
                  <strong>ফেলে যাওয়া File:</strong> User মুছে গেলে তাঁর অন্য জায়গার
                  File গুলো মালিকের নামের জায়গায় শুধু সংখ্যা দেখায়, কারণ নামটা আর তালিকায়
                  নেই। <code>sudo find / -xdev -nouser</code> এই অনাথ File গুলো খুঁজে দেয়।
                  পরে কেউ একই UID পেলে এগুলোর মালিক হয়ে যাবেন, তাই এগুলো সামলান।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "root-and-sudo",
      subHeader: { index: "006", title: "root and sudo" },
      title: <SectionTitle>root আর sudo, পুরো চাবির গোছা আর একটা চাবি ধার নেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                UID 0 এর জন্য Kernel এর আচরণ আলাদা। root যখন কোনো File পড়তে বা লিখতে
                চায়, Kernel সাধারণ Permission Bit গুলো দেখেই না, সোজা হ্যাঁ বলে। root
                অন্যের File এর মালিক বদলাতে পারে, যেকোনো Process থামাতে পারে, Port 80 এর
                মতো ছোট Port এ বসতে পারে। ভুল একটা Command, যেমন একটা ভুল জায়গায়{" "}
                <code>rm -rf</code>, root হয়ে চালালে থামানোর কেউ নেই।
              </ContentParagraph>
              <ContentParagraph>
                তাই নিয়ম হলো: root হয়ে বসে থাকবেন না। সাধারণ User হয়ে কাজ করবেন, আর
                যে নির্দিষ্ট Command এর জন্য root লাগে, শুধু সেটার আগে{" "}
                <code>sudo</code> লিখবেন। এতে তিনটা লাভ। প্রতিটা বড় কাজের আগে একবার
                থামতে হয়। কে কখন কী চালালেন তার হিসাব থাকে। আর কাকে কতটুকু ক্ষমতা দেবেন,
                সেটা ঠিক করা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PermSudoFlowDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                sudo এর নিয়মের খাতা হলো <code>/etc/sudoers</code>। Ubuntu তে এর আসল
                কাজের লাইন মাত্র দুইটা, আর একটা লাইন যা আরও নিয়ম কোথা থেকে আসবে তা
                বলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "/etc/sudoers (কাজের লাইনগুলো)",
          code: String.raw`root    ALL=(ALL:ALL) ALL
%sudo   ALL=(ALL:ALL) ALL
@includedir /etc/sudoers.d`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় লাইনটা অংশ ধরে পড়ি, কারণ নিজের নিয়ম লিখতে এই গঠনটাই লাগবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>%sudo</code>: শুরুর % মানে এটা একটা Group। sudo Group এর
                  সবাই। % না থাকলে এটা একজন User এর নাম।
                </ListItem>
                <ListItem>
                  প্রথম <code>ALL</code>: কোন Host এ। একটা Server এর জন্য সবসময় ALL।
                </ListItem>
                <ListItem>
                  <code>(ALL:ALL)</code>: কার হয়ে চালাতে পারবেন। কোলনের আগে User, পরে
                  Group। এখানে যে কারো হয়ে।
                </ListItem>
                <ListItem>
                  শেষ <code>ALL</code>: কোন Command। এখানে যেকোনো Command।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তাই কাউকে Admin বানানো মানে তাঁকে sudo Group এ যোগ করা, যা লেসন ০৩ এ{" "}
                <code>usermod -aG sudo deploy</code> দিয়ে করেছিলেন। কে কী পারেন, সেটা
                দেখার Command হলো <code>sudo -l</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "sudo-l.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo -l -U deploy
Matching Defaults entries for deploy on island-vps-01:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User deploy may run the following commands on island-vps-01:
    (ALL : ALL) ALL`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা বাস্তব প্রয়োজন। Island Tours এর Deploy Script নতুন Release
                বসানোর পর Caddy কে Reload করতে বলে। Script টা চলে Password ছাড়া, কেউ
                সামনে বসে থাকেন না। সহজ উপায় মনে হয় deploy কে পুরো Password ছাড়া sudo
                দিয়ে দেওয়া। সেটা করবেন না, কারণ তখন deploy এর SSH Key চুরি হওয়া মানে
                সরাসরি root চুরি হওয়া। তার বদলে ঠিক একটা Command এর জন্য একটা সরু নিয়ম
                লিখুন, আলাদা File এ, <code>/etc/sudoers.d/</code> এর ভেতরে।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে জরুরি নিয়ম: sudoers এর কোনো File কখনো সাধারণ Editor দিয়ে সরাসরি
                বদলাবেন না। একটা বানান ভুল হলে sudo পুরো খাতাটাই পড়তে পারবে না, আর তখন
                কেউই sudo চালাতে পারবেন না, যার মানে ভুলটা সারানোর ক্ষমতাও আর নেই।{" "}
                <code>visudo</code> এই ফাঁদ থেকে বাঁচায়: আগে পরীক্ষা করে, ঠিক থাকলে
                তবেই বসায়। নিচে একটা ঠিক File আর একটা ভাঙা File, দুইটাই পরীক্ষা করা হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "sudoers-drop-in.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo visudo -f /etc/sudoers.d/deploy-caddy
# Editor খুলবে, এই দুইটা লাইন লিখে Save করুন:
# deploy may reload Caddy without typing a password, and nothing else without one
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl reload caddy

deploy@island-vps-01:~$ sudo visudo -c
/etc/sudoers: parsed OK
/etc/sudoers.d/README: parsed OK
/etc/sudoers.d/deploy-caddy: parsed OK

deploy@island-vps-01:~$ sudo -l -U deploy | tail -2
    (ALL : ALL) ALL
    (root) NOPASSWD: /usr/bin/systemctl reload caddy

# একটা কোলন বাদ পড়লে visudo কী বলে:
deploy@island-vps-01:~$ sudo visudo -c -f /tmp/bad
/tmp/bad:1:46: syntax error
deploy ALL=(root) NOPASSWD /usr/bin/systemctl
                                             ^`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার প্রমাণ। <code>sudo -k</code> জমা থাকা Password ভুলিয়ে দেয়, যাতে
                পরীক্ষাটা সৎ হয়। sudo একবার Password নিলে ১৫ মিনিট মনে রাখে, এটা না
                করলে সবকিছুই Password ছাড়া চলবে আর আপনি ভুল সিদ্ধান্তে পৌঁছাবেন।{" "}
                <code>-n</code> মানে Password চাইতে হলে চুপচাপ ব্যর্থ হওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "prove-the-rule.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo -k
deploy@island-vps-01:~$ sudo -n /usr/bin/systemctl reload caddy && echo "reload ok, no password asked"
reload ok, no password asked

deploy@island-vps-01:~$ sudo -n /usr/bin/systemctl restart caddy
sudo: a password is required

deploy@island-vps-01:~$ sudo journalctl _COMM=sudo -o short-iso --no-pager | grep systemctl | tail -2
2026-10-31T07:25:47+00:00 island-vps-01 sudo[537]:   deploy : PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/systemctl reload caddy
2026-10-31T07:25:47+00:00 island-vps-01 sudo[551]:   deploy : a password is required ; PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/systemctl restart caddy`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Command", "কী করে", "কখন"],
          rows: [
            [<code key="1">sudo CMD</code>, "একটা Command root হয়ে চালায়", "প্রতিদিনের Admin কাজ"],
            [<code key="2">sudo -u islandtours CMD</code>, "অন্য একজন User হয়ে চালায়", "Service User এর চোখে কী দেখা যায় পরীক্ষা করতে"],
            [<code key="3">sudo -i</code>, "root এর পুরো Login Shell খোলে", "পরপর অনেক root কাজ। শেষ হলেই exit"],
            [<code key="4">su - rafi</code>, "rafi এর Password দিয়ে তাঁর Shell এ ঢোকে", "প্রায় কখনো না। অন্যের Password জানা নিজেই একটা সমস্যা"],
            [<code key="5">sudo -l</code>, "আমি কী কী চালাতে পারি", "নতুন Server এ, বা নিয়ম বদলের পর"],
            [<code key="6">sudo -k</code>, "জমা থাকা Password ভুলে যায়", "পরীক্ষার আগে, বা Terminal ছেড়ে ওঠার আগে"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "sudoers.d এর File এর নিয়ম, আর NOPASSWD এ পুরো পথ",
          content: (
            <p>
              <code>/etc/sudoers.d</code> এর File এর মালিক root হতে হবে, Mode 440, আর
              নামে কোনো বিন্দু বা শেষে ~ থাকা চলবে না, নইলে sudo সেই File চুপচাপ উপেক্ষা
              করে। NOPASSWD নিয়মে Command এর পুরো পথ লিখুন (<code>/usr/bin/systemctl</code>),
              আর যতটা সম্ভব নির্দিষ্ট Argument সহ। শুধু <code>/usr/bin/systemctl</code>{" "}
              লিখে ছেড়ে দিলে deploy Password ছাড়া যেকোনো Service থামাতে, চালু করতে
              পারবেন। আর কখনো এমন Command কে NOPASSWD দেবেন না যা দিয়ে অন্য Command চালানো
              যায়, যেমন একটা Editor, <code>less</code>, বা <code>bash</code> নিজেই।
              এগুলোর ভেতর থেকে একটা Shell খুলে ফেলা যায়, আর সেই Shell হবে root।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "ls-l",
      subHeader: { index: "007", title: "Reading ls -l" },
      title: <SectionTitle>ls -l এর একটা লাইন, দশটা ঘর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ কে নিয়ে কথা হলো। এবার কী: প্রতিটা File এর গায়ে লাগানো লেবেল।
                লেবেলটা পড়ার সবচেয়ে চেনা উপায় <code>ls -l</code>। প্রথমবার দেখলে
                লাইনটা দুর্বোধ্য একটা সংকেত মনে হয়, কিন্তু আসলে এটা একটা ছোট্ট ছক।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PermLsAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম অক্ষরটা File এর ধরন বলে। বেশিরভাগ সময় দেখবেন <code>-</code> আর{" "}
                <code>d</code>, কিন্তু Server এ ঘুরলে বাকিগুলোর সাথেও দেখা হবে। লেসন ০১
                এ বলা হয়েছিল Linux এ সবকিছুই File, এই অক্ষরটাই সেই কথার প্রমাণ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "file-types.sh",
          code: String.raw`deploy@island-vps-01:~$ ls -ld /srv/islandtours /etc/islandtours/api.env /etc/localtime \
    /dev/null /run/systemd/journal/socket
crw-rw-rw-  1 root   root        1, 3 Oct 31 07:23 /dev/null
-rw-r-----  1 root   islandtours   52 Oct 31 07:25 /etc/islandtours/api.env
lrwxrwxrwx  1 root   root          27 Oct 31 07:15 /etc/localtime -> /usr/share/zoneinfo/Etc/UTC
srw-rw-rw-  1 root   root           0 Oct 31 07:23 /run/systemd/journal/socket
drwxr-x---+ 4 deploy islandtours 4096 Oct 31 07:25 /srv/islandtours`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রথম অক্ষর", "ধরন", "উদাহরণ"],
          rows: [
            [mono("-"), "সাধারণ File", "api.env, main.js, Caddyfile"],
            [mono("d"), "Directory", "/srv/islandtours"],
            [mono("l"), "Symbolic Link, অন্য একটা পথের দিকে ইশারা", "/etc/localtime, Release এর current"],
            [mono("c"), "Character Device, Byte ধরে কথা বলা যন্ত্র", "/dev/null, Terminal"],
            [mono("b"), "Block Device, Disk এর মতো যন্ত্র", "একটা VPS এ /dev/vda"],
            [mono("s"), "Socket, দুইটা Process এর কথা বলার দরজা", "Journal এর Socket, Docker এর Socket"],
            [mono("p"), "Named Pipe, একমুখী নল", "mkfifo দিয়ে বানানো"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ লাইনের Mode এর পরে একটা ছোট্ট <code>+</code> আছে, খেয়াল করেছেন?
                ওটা বলছে এই Directory তে বাড়তি একটা নিয়ম আছে, যার নাম ACL। সেকশন ১৩ এ
                এর দেখা পাবেন। আর Symbolic Link এর Mode সবসময় <code>lrwxrwxrwx</code> দেখায়, আর সেটা
                নিয়ে চিন্তার কিছু নেই। Link এর নিজের Permission কেউ দেখে না। Kernel
                Link ধরে আসল File এ পৌঁছায় আর সেখানকার Permission দেখে।
              </ContentParagraph>
              <ContentParagraph>
                একটা File এর পুরো লেবেল এক জায়গায় দেখতে চাইলে <code>stat</code> আছে।
                এটা Mode কে অঙ্কে আর অক্ষরে দুইভাবেই দেখায়, আর মালিক আর Group কে নাম আর
                সংখ্যা দুইভাবেই। Permission এর তর্ক মেটাতে এর চেয়ে ভালো সাক্ষী নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "stat.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo stat /etc/islandtours/api.env
  File: /etc/islandtours/api.env
  Size: 52        	Blocks: 8          IO Block: 4096   regular file
Device: 0,238	Inode: 1984447     Links: 1
Access: (0640/-rw-r-----)  Uid: (    0/    root)   Gid: (  996/islandtours)
Access: 2026-10-31 07:26:01.171207563 +0000
Modify: 2026-10-31 07:25:55.289148964 +0000
Change: 2026-10-31 07:25:55.292148012 +0000
 Birth: 2026-10-31 07:25:55.289148964 +0000

# অনেকগুলো File এর লেবেল এক লাইনে করে:
deploy@island-vps-01:~$ sudo stat -c '%a %A %U:%G %n' /srv/islandtours /etc/islandtours/api.env /tmp
750 drwxr-x--- deploy:islandtours /srv/islandtours
640 -rw-r----- root:islandtours /etc/islandtours/api.env
1777 drwxrwxrwt root:root /tmp`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "the-check",
      subHeader: { index: "008", title: "The Check" },
      title: <SectionTitle>Kernel কীভাবে হ্যাঁ বা না বলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার দুইটা অর্ধেক জোড়া লাগাই। একটা Process কোনো File খুলতে চাইলে Kernel
                এর হাতে দুইটা জিনিস থাকে: Process এর পরিচয়পত্র (তার UID আর Group এর
                তালিকা, যা <code>id</code> দেখায়) আর File এর লেবেল (মালিক, Group, নয়টা
                Bit, যা <code>ls -l</code> দেখায়)। খেয়াল করুন, প্রশ্নটা কখনো আপনি কে
                নয়, প্রশ্নটা এই Process টা কে। API এর ভেতর থেকে File খোলা হলে Process টা
                islandtours, আপনি deploy হলেও।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PermIdentityDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নয়টা Bit তিনটা দলে ভাগ, কিন্তু Kernel কখনো তিনটা দলই একসাথে দেখে না।
                সে একটা ক্রমে প্রশ্ন করে, আর যে দল প্রথম মেলে, শুধু সেই দলের তিনটা Bit
                দিয়ে সিদ্ধান্ত নেয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PermCheckOrderDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ক্রমের সবচেয়ে অবাক করা ফলটা নিজের চোখে দেখুন। একটা File এর মালিক
                deploy, কিন্তু Mode এমন যে মালিকের ঘর ফাঁকা আর বাকি সবার ঘর ভরা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "owner-gets-less.sh",
          code: String.raw`deploy@island-vps-01:/srv/lab$ ls -l notes/schedule.txt
----rwxrwx 1 deploy deploy 18 Oct 31 07:26 notes/schedule.txt

deploy@island-vps-01:/srv/lab$ cat notes/schedule.txt
cat: notes/schedule.txt: Permission denied

deploy@island-vps-01:/srv/lab$ sudo -u guest cat notes/schedule.txt
boat leaves 07:00`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                guest পড়তে পারলেন, অথচ মালিক deploy পারলেন না। Kernel প্রথম প্রশ্নেই
                দেখল Process এর UID আর মালিকের UID এক, তাই মালিকের ঘরের <code>---</code>{" "}
                দিয়েই সিদ্ধান্ত নিয়ে ফেলল, Other এর দিকে আর তাকাল না। বাস্তবে কেউ ইচ্ছা
                করে এমন Mode বসায় না, কিন্তু এটা মাথায় গেঁথে দেয় যে তিনটা দল যোগ হয় না,
                একটা বেছে নেওয়া হয়।
              </ContentParagraph>
              <ContentParagraph>
                মালিক অবশ্য নিজের File এর Mode বদলাতে পারেন, যেকোনো সময়। তাই এই
                নিষেধাজ্ঞা মালিকের কাছে শুধু একটা ভদ্র অনুরোধ, দেয়াল নয়। মালিক হওয়ার
                আসল ক্ষমতা এটাই: Bit গুলো বদলানোর অধিকার, যা Group বা Other এর কারো নেই।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "file-vs-dir",
      subHeader: { index: "009", title: "Files vs Directories" },
      title: <SectionTitle>r, w, x: File এ এক মানে, Directory তে আরেক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                File এ তিনটা অক্ষরের মানে সোজা: পড়া, লেখা, চালানো। গোলমাল বাধে
                Directory তে, আর Server এর বেশিরভাগ Permission denied এর শিকড়ও এখানেই।
                একটা Directory কে ভাবুন একটা ফোনবুকের মতো: ভেতরে শুধু নাম আর সেই নামের
                File টা Disk এর কোথায় আছে তার ঠিকানা। এই ছবিটা মাথায় থাকলে তিনটা অক্ষর
                নিজে থেকেই বোঝা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PermFileVsDirSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তিনটা পরীক্ষা, প্রতিটা একটা করে ভুল ধারণা ভাঙবে। প্রথমটায়
                Directory তে Other এর জন্য শুধু r, x নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "r-without-x.sh",
          code: String.raw`deploy@island-vps-01:/srv/lab$ chmod 744 notes; ls -ld notes
drwxr--r-- 2 deploy deploy 4096 Oct 31 07:26 notes

deploy@island-vps-01:/srv/lab$ sudo -u guest ls -l notes
ls: cannot access 'notes/schedule.txt': Permission denied
total 0
-????????? ? ? ? ?            ? schedule.txt

deploy@island-vps-01:/srv/lab$ sudo -u guest cat notes/schedule.txt
cat: notes/schedule.txt: Permission denied`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ফোনবুকের পাতা পড়া গেল, তাই নামটা দেখা গেল: schedule.txt। কিন্তু x নেই,
              মানে নামের পাশের ঠিকানা ধরে ভেতরে যাওয়ার অনুমতি নেই। তাই ls নামটা ছাড়া আর
              কিছুই জানে না, বাকি সব প্রশ্নবোধক চিহ্ন। আর cat পুরোপুরি ব্যর্থ। দ্বিতীয়
              পরীক্ষায় উল্টোটা: x আছে, r নেই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "x-without-r.sh",
          code: String.raw`deploy@island-vps-01:/srv/lab$ chmod 711 notes; ls -ld notes
drwx--x--x 2 deploy deploy 4096 Oct 31 07:26 notes

deploy@island-vps-01:/srv/lab$ sudo -u guest ls notes
ls: cannot open directory 'notes': Permission denied

deploy@island-vps-01:/srv/lab$ sudo -u guest cat notes/schedule.txt
boat leaves 07:00`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফোনবুকের পাতা পড়তে দেওয়া হলো না, তাই তালিকা দেখা গেল না। কিন্তু নামটা
                যিনি আগে থেকেই জানেন, তিনি x এর জোরে সরাসরি সেই File এ পৌঁছে গেলেন। এই
                কারণে অনেক Server এ Home Directory বা ভাগ করা Folder এ <code>711</code>{" "}
                দেখবেন: ভেতরে কী আছে সেটা গোপন, কিন্তু নির্দিষ্ট পথ জানলে যাওয়া যায়।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয় পরীক্ষাটাই সবচেয়ে গুরুত্বপূর্ণ, কারণ এটা প্রায় সবাইকে চমকে দেয়।
                একটা File এর মালিক deploy, Mode <code>644</code>, মানে guest সেটা বদলাতে
                পারবেন না। কিন্তু File টা যে Directory তে, সেখানে guest এর Group এর
                লেখার অধিকার আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "delete-needs-dir-w.sh",
          code: String.raw`deploy@island-vps-01:~$ ls -ld /srv/lab/shared; ls -l /srv/lab/shared
drwxrwxr-x 2 deploy team 4096 Oct 31 07:26 /srv/lab/shared
-rw-r--r-- 1 deploy deploy 11 Oct 31 07:26 price.txt

deploy@island-vps-01:~$ sudo -u guest sh -c 'echo 99 >> /srv/lab/shared/price.txt'
sh: 1: cannot create /srv/lab/shared/price.txt: Permission denied

deploy@island-vps-01:~$ sudo -u guest rm -f /srv/lab/shared/price.txt && echo "guest deleted it"
guest deleted it`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                guest File টার একটা অক্ষরও বদলাতে পারলেন না, অথচ পুরো File টাই মুছে
                দিলেন। ফোনবুকের ছবিতে ফিরে যান: মোছা মানে ফোনবুক থেকে একটা নাম কেটে
                দেওয়া। সেটা ফোনবুকের পরিবর্তন, File এর নয়। তাই মুছতে, নতুন File বানাতে
                বা নাম বদলাতে লাগে Directory র w (সাথে x), File এর নিজের Permission এখানে
                কোনো ভূমিকাই রাখে না। এই চমক থামানোর উপায় একটা বিশেষ Bit, Sticky Bit,
                যা সেকশন ১৩ এ দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "x চালানোর জন্য, কিন্তু Script এ r ও লাগে",
          content: (
            <p>
              একটা Binary Program, যেমন <code>/usr/bin/ls</code>, চালাতে শুধু x লাগে,
              কারণ Kernel নিজেই সেটা Memory তে তোলে। কিন্তু একটা Shell Script, যেমন{" "}
              <code>deploy.sh</code>, আসলে bash পড়ে পড়ে চালায়। bash আপনার হয়েই চলে,
              তাই আপনার r না থাকলে সে Script পড়তে পারবে না। Script এর জন্য তাই r আর x
              দুইটাই লাগে, যেমন <code>750</code> বা <code>755</code>।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "octal",
      subHeader: { index: "010", title: "Octal Modes" },
      title: <SectionTitle>640, 755, 600: তিন অঙ্কে পুরো লেবেল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নয়টা অক্ষর বারবার লেখা ক্লান্তিকর, তাই সবাই তিনটা অঙ্কে বলে। Module 01
                এর{" "}
                <Link href="/devops/topic/binary-and-data" className={linkClass}>
                  Binary
                </Link>{" "}
                লেসন মনে আছে? তিনটা Bit দিয়ে 0 থেকে 7 পর্যন্ত আটটা সংখ্যা লেখা যায়।
                প্রতিটা দলের তিনটা Bit কে একটা অঙ্কে বসালেই হলো, আর এই আট ঘরের অঙ্ক
                ব্যবস্থার নাম Octal।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PermBitsDiagram /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Mode", "অক্ষরে", "কোথায় দেখবেন", "এক কথায়"],
          rows: [
            [mono("644"), <code key="1">rw-r--r--</code>, "সাধারণ File, Caddyfile", "মালিক বদলান, বাকিরা পড়েন"],
            [mono("640"), <code key="2">rw-r-----</code>, "api.env, App এর Code", "মালিক বদলান, Group পড়ে, বাকিরা কিছু না"],
            [mono("600"), <code key="3">rw-------</code>, "Private Key, authorized_keys", "শুধু মালিক"],
            [mono("755"), <code key="4">rwxr-xr-x</code>, "/usr/bin, সাধারণ Directory", "সবাই ঢোকেন আর দেখেন, মালিক বদলান"],
            [mono("750"), <code key="5">rwxr-x---</code>, "/srv/islandtours, Home", "মালিক আর Group, বাইরের কেউ না"],
            [mono("700"), <code key="6">rwx------</code>, "~/.ssh, Backup", "শুধু মালিক"],
            [mono("440"), <code key="7">r--r-----</code>, "/etc/sudoers.d এর File", "কেউ বদলাতে পারবে না, পড়তে পারে মালিক আর Group"],
            [mono("777"), <code key="8">rwxrwxrwx</code>, "কোথাও না", "সবাই সব পারে। Server এ এটা প্রায় সবসময় ভুল"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ নয়টা সুইচ নিয়ে নিজে খেলুন। File আর Directory বদলে একই অঙ্কের
              মানে কীভাবে পাল্টায় দেখুন, আর 777, 1777, 2775, 4755 চেপে বিশেষ Bit গুলোর
              সাথে প্রথম পরিচয়টা সেরে নিন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PermModeLab /> },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "chmod-chown",
      subHeader: { index: "011", title: "chmod, chown, chgrp" },
      title: <SectionTitle>লেবেল বদলানো: chmod, chown আর chgrp</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেবেলের তিনটা অংশ, বদলানোর তিনটা Command। নয়টা Bit বদলায়{" "}
                <code>chmod</code>, মালিক বদলায় <code>chown</code>, Group বদলায়{" "}
                <code>chgrp</code>। chmod দুই ভাষায় কথা বলে। অঙ্কের ভাষায় পুরো Mode
                একবারে বসিয়ে দেন, যেমন <code>chmod 640 api.env</code>। অক্ষরের ভাষায়
                শুধু যা বদলাতে চান সেটা বলেন, বাকিটা যেমন ছিল থাকে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কার:</strong> <code>u</code> মালিক (user), <code>g</code>{" "}
                  Group, <code>o</code> বাকিরা (other), <code>a</code> সবাই।
                </ListItem>
                <ListItem>
                  <strong>কী করবেন:</strong> <code>+</code> যোগ, <code>-</code> বাদ,{" "}
                  <code>=</code> ঠিক এটাই, বাকিগুলো মুছে।
                </ListItem>
                <ListItem>
                  <strong>কোন অক্ষর:</strong> <code>r</code>, <code>w</code>,{" "}
                  <code>x</code>।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "chmod-symbolic.sh",
          code: String.raw`deploy@island-vps-01:~$ chmod u+x deploy.sh; ls -l deploy.sh
-rwxrw-r-- 1 deploy deploy 0 Oct 31 07:26 deploy.sh

deploy@island-vps-01:~$ chmod g-w,o= deploy.sh; ls -l deploy.sh
-rwxr----- 1 deploy deploy 0 Oct 31 07:26 deploy.sh

deploy@island-vps-01:~$ chmod 640 deploy.sh; ls -l deploy.sh
-rw-r----- 1 deploy deploy 0 Oct 31 07:26 deploy.sh`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার পুরো একটা Folder এর ভেতরে সবকিছুর Mode বদলানো, যেখানে মানুষ সবচেয়ে
                বেশি ভুল করেন। <code>-R</code> মানে ভেতরের সব কিছুতে, আর অভ্যাসবশে লোকে
                লেখেন <code>chmod -R 755</code>। Directory গুলোর জন্য 755 ঠিক আছে, কিন্তু
                সাথে সাথে প্রতিটা সাধারণ File ও চালানোর যোগ্য হয়ে গেল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "chmod-recursive.sh",
          code: String.raw`deploy@island-vps-01:~$ chmod -R 755 site; find site -printf '%M %p\n'
drwxr-xr-x site
drwxr-xr-x site/css
-rwxr-xr-x site/css/app.css      # CSS File চালানোর যোগ্য, অর্থহীন আর অগোছালো
-rwxr-xr-x site/index.html

# ঠিক পথ: Directory আর File আলাদা করে, find দিয়ে
deploy@island-vps-01:~$ find site -type d -exec chmod 750 {} +
deploy@island-vps-01:~$ find site -type f -exec chmod 640 {} +
deploy@island-vps-01:~$ find site -printf '%M %p\n'
drwxr-x--- site
drwxr-x--- site/css
-rw-r----- site/css/app.css
-rw-r----- site/index.html

# আরেক পথ: বড় হাতের X, মানে x শুধু Directory তে (আর আগে থেকে চালানোর যোগ্য File এ)
deploy@island-vps-01:~$ chmod -R u=rwX,g=rX,o= site2; find site2 -printf '%M %p\n'
drwxr-x--- site2
drwxr-x--- site2/css
-rw-r----- site2/css/app.css
-rw-r----- site2/index.html`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "বড় হাতের X এর একটা ফাঁদ",
          content: (
            <p>
              <code>X</code> File এ x তখনও বসায়, যখন সেই File আগে থেকেই কারো জন্য
              চালানোর যোগ্য ছিল। তাই ভুল করে <code>chmod -R 755</code> চালানোর পর{" "}
              <code>u=rwX</code> দিয়ে সারাতে গেলে কিছুই সারবে না, File গুলো চালানোর যোগ্যই
              থেকে যাবে। একবার ভুল হয়ে গেলে উপরের <code>find -type f</code> পথটাই
              নির্ভরযোগ্য।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মালিক বদলানোর নিয়ম Bit বদলানোর চেয়ে কড়া। আপনি নিজের File এর Mode যত
                খুশি বদলাতে পারেন, কিন্তু নিজের File অন্য কাউকে দিয়ে দিতে পারেন না। কেন?
                কারণ তাহলে যে কেউ একটা বিশাল File বানিয়ে অন্যের নামে লিখে দিয়ে তাঁর Disk
                এর ভাগ ভরিয়ে দিতে পারত, বা এমন একটা File অন্যের নামে রাখতে পারত যা দেখে
                মনে হয় তিনিই বানিয়েছেন। তাই <code>chown</code> শুধু root পারে। chgrp
                মালিক নিজে পারেন, কিন্তু শুধু এমন Group এ, যেটার তিনি নিজে সদস্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "chown-rules.sh",
          code: String.raw`deploy@island-vps-01:~$ chown guest deploy.sh
chown: changing ownership of 'deploy.sh': Operation not permitted

deploy@island-vps-01:~$ chgrp team deploy.sh && ls -l deploy.sh      # deploy team এর সদস্য
-rw-r----- 1 deploy team 0 Oct 31 07:26 deploy.sh

deploy@island-vps-01:~$ chgrp islandtours deploy.sh                    # সদস্য নন
chgrp: changing group of 'deploy.sh': Operation not permitted

# root হয়ে একসাথে মালিক আর Group, পুরো Folder এ:
deploy@island-vps-01:~$ sudo chown -R deploy:islandtours /srv/islandtours/releases`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নতুন Directory বানানোর সময় তিনটা আলাদা Command (<code>mkdir</code>,{" "}
                <code>chown</code>, <code>chmod</code>) না লিখে একটাতেই সারার উপায় আছে:{" "}
                <code>install -d</code>। এটা Directory বানায় আর সাথে সাথে মালিক, Group
                আর Mode বসিয়ে দেয়। মাঝের কোনো মুহূর্তে Directory টা ভুল Mode এ থাকে না,
                তাই Script এ এটাই বেশি নিরাপদ। এই লেসনের Lab এ সব Directory এভাবেই বানানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "install-d.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo install -d -m 750 -o root -g islandtours /etc/islandtours
deploy@island-vps-01:~$ sudo stat -c '%a %A %U:%G %n' /etc/islandtours
750 drwxr-x--- root:islandtours /etc/islandtours`,
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "umask",
      subHeader: { index: "012", title: "umask" },
      title: <SectionTitle>umask, নতুন File জন্মের সময়ই কোন Mode পাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা File বানানোর পর chmod করতে কেউ মনে রাখে না। তাই একটা নতুন File
                জন্মের মুহূর্তে কী Mode পাবে, সেটা ঠিক করে প্রতিটা Process এর একটা
                Setting, নাম <strong>umask</strong>। Program নতুন File এর জন্য সাধারণত{" "}
                <code>666</code> চায় (সবার জন্য পড়া আর লেখা) আর Directory র জন্য{" "}
                <code>777</code>। umask হলো এই প্রস্তাব থেকে কোন Bit গুলো কেটে ফেলা হবে,
                তার তালিকা। এটা বিয়োগ নয়, Bit কাটা। তাই 666 থেকে 027 কাটলে 640, কোনো
                অঙ্ক কখনো ঋণাত্মক হয় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "umask.sh",
          code: String.raw`deploy@island-vps-01:~$ umask; umask -S
0002
u=rwx,g=rwx,o=rx

deploy@island-vps-01:~$ touch a.txt; mkdir a-dir
deploy@island-vps-01:~$ (umask 027; touch b.txt; mkdir b-dir)
deploy@island-vps-01:~$ ls -l
drwxrwxr-x 2 deploy deploy 4096 Oct 31 07:26 a-dir
-rw-rw-r-- 1 deploy deploy    0 Oct 31 07:26 a.txt
drwxr-x--- 2 deploy deploy 4096 Oct 31 07:26 b-dir
-rw-r----- 1 deploy deploy    0 Oct 31 07:26 b.txt

deploy@island-vps-01:~$ grep -E '^UMASK|^USERGROUPS_ENAB|^HOME_MODE' /etc/login.defs
UMASK		022
HOME_MODE	0750
USERGROUPS_ENAB yes`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                deploy এর umask 002, যদিও <code>/etc/login.defs</code> এ লেখা 022। কারণটা
                তৃতীয় লাইনে: <code>USERGROUPS_ENAB yes</code>। Ubuntu এর নিয়ম হলো, যে
                মানুষ User এর নিজের নামে একটা Group আছে (User Private Group), তার umask
                থেকে Group এর w কাটা হবে না। নিজের নামের Group এ যেহেতু তিনি একাই, এতে
                কোনো ক্ষতি নেই। root আর বেশিরভাগ Service এর umask 022।
              </ContentParagraph>
              <ContentParagraph>
                Server এর App এর জন্য ভালো পছন্দ <code>027</code>: নতুন File হবে 640,
                নতুন Directory 750, বাইরের কেউ কিছুই দেখবে না। systemd দিয়ে চালানো
                Service এ এটা বসানোর জায়গা Unit File এর <code>UMask=0027</code> লাইন,
                যা{" "}
                <Link href="/devops/topic/process-management-systemd" className={linkClass}>
                  লেসন ০২
                </Link>{" "}
                এর Unit File এ যোগ করতে পারেন। নিচের Lab এ বিভিন্ন umask এর ফল মিলিয়ে
                দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PermUmaskLab /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "service-umask.sh",
          code: String.raw`# একই User (islandtours), দুইভাবে চালিয়ে একটা করে File বানানো হলো:
deploy@island-vps-01:~$ ls -l /srv/islandtours/uploads
-rw-r----- 1 islandtours islandtours 0 Oct 31 07:27 from-service.txt   # systemd, UMask=0027
-rw-rw-r-- 1 islandtours islandtours 2 Oct 31 07:31 ok.json            # Terminal থেকে sudo -u`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই দুই লাইন একটা বড় শিক্ষা দেয়। একই User, একই Folder, অথচ Mode আলাদা,
              কারণ umask User এর নয়, Process এর। Terminal থেকে sudo -u দিয়ে চালানো
              Command যে umask পেল, সেটা নির্ভর করে কোন Shell থেকে চালানো হলো আর sudo এর
              নিজের Setting এর উপর, তাই আপনার যন্ত্রে সেটা 664 না হয়ে 644 ও হতে পারে।
              systemd এর UMask=0027 কিন্তু প্রতিবার একই ফল দেয়। Production এ App
              সবসময় systemd দিয়ে চলবে, তাই যে Mode এ File জন্মাবে তা ঠিক করুন Unit File
              এ, কারো Shell এর অভ্যাসের উপর ছেড়ে দেবেন না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "special-bits",
      subHeader: { index: "013", title: "Special Bits and ACL" },
      title: <SectionTitle>setuid, setgid, Sticky Bit আর ACL</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নয়টা Bit এর আগে আরও তিনটা Bit আছে, যেগুলো Octal এ চার নম্বর অঙ্ক হয়ে
                সামনে বসে, যেমন <code>2750</code> বা <code>1777</code>। এদের দেখা মেলে
                কম, কিন্তু যেখানে মেলে সেখানে বড় কাজ করে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>setuid (4):</strong> একটা Program File এ বসানো থাকলে, যে-ই
                চালান, Program টা চলবে File এর মালিক হয়ে। <code>passwd</code> এর উদাহরণটাই
                সবচেয়ে পরিষ্কার: নিজের Password বদলাতে <code>/etc/shadow</code> এ লিখতে
                হয়, যেটা শুধু root পারে। তাই passwd File টার মালিক root আর তাতে setuid
                বসানো, সাধারণ User চালালেও passwd চলে root হয়ে, আর নিজের নিয়মে শুধু
                সেই User এর লাইনটাই বদলায়। sudo নিজেও ঠিক এভাবে কাজ করে। ls -l এ মালিকের
                x এর জায়গায় <code>s</code> দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "setuid.sh",
          code: String.raw`deploy@island-vps-01:~$ ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root 72056 May 30  2024 /usr/bin/passwd

# পুরো Server এ setuid File গুলো, একটা পরিষ্কার তালিকা রাখার মতো জিনিস
deploy@island-vps-01:~$ sudo find / -xdev -perm -4000 -type f 2>/dev/null | sort
/usr/bin/chfn
/usr/bin/chsh
/usr/bin/gpasswd
/usr/bin/mount
/usr/bin/newgrp
/usr/bin/passwd
/usr/bin/su
/usr/bin/sudo
/usr/bin/umount
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই তালিকাটা একবার নিজের Server এ দেখে রাখুন। প্রতিটা setuid root File
                একটা সম্ভাব্য দরজা, কারণ এর ভেতরের একটা Bug মানে root। পরে কোনোদিন
                তালিকায় অচেনা কিছু দেখলে, বিশেষ করে <code>/tmp</code> বা কারো Home এ,
                সেটা ভাঙচুরের লক্ষণ হতে পারে। নিজে কখনো নিজের Script এ setuid বসাবেন না,
                Linux Script এর setuid মানেই না, আর যে ক্ষেত্রে মানে সেখানে সেটা বিপদ।
                দরকার হলে sudo এর একটা সরু নিয়ম লিখুন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>setgid (2):</strong> Directory তে এর কাজটাই দরকারি। setgid
                Directory র ভেতরে যে-ই নতুন File বানান, সেই File এর Group হয় Directory র
                Group, বানানো মানুষের নিজের Group নয়। দলের ভাগ করা Folder এ এটাই চাই।
                ls -l এ Group এর x এর জায়গায় <code>s</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "setgid-dir.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo -u guest touch /srv/lab/shared/before.txt
deploy@island-vps-01:~$ sudo chmod 2775 /srv/lab/shared; ls -ld /srv/lab/shared
drwxrwsr-x 2 deploy team 4096 Oct 31 07:26 /srv/lab/shared
deploy@island-vps-01:~$ sudo -u guest touch /srv/lab/shared/after.txt
deploy@island-vps-01:~$ ls -l /srv/lab/shared
-rw-rw-r-- 1 guest team  0 Oct 31 07:26 after.txt     # Directory র Group পেল
-rw-rw-r-- 1 guest guest 0 Oct 31 07:26 before.txt    # guest এর নিজের Group`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Sticky Bit (1):</strong> সেকশন ৯ এর চমকটা মনে আছে? যার Directory
                তে লেখার অধিকার আছে, সে অন্যের File ও মুছতে পারে। Sticky Bit বসানো
                Directory তে নিয়ম বদলে যায়: শুধু File এর মালিক (বা Directory র মালিক, বা
                root) সেটা মুছতে বা নাম বদলাতে পারবেন। <code>/tmp</code> এর{" "}
                <code>drwxrwxrwt</code> এর শেষের <code>t</code> টা এটাই। সবাই সেখানে
                লিখতে পারে, কিন্তু কেউ অন্যের File মুছতে পারে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "sticky.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo chmod +t /srv/lab/shared; ls -ld /srv/lab/shared
drwxrwxr-t 2 deploy team 4096 Oct 31 07:26 /srv/lab/shared

deploy@island-vps-01:~$ sudo -u guest rm -f /srv/lab/shared/price.txt
rm: cannot remove '/srv/lab/shared/price.txt': Operation not permitted`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ছোট্ট সংকেত: বড় হাতের <code>S</code> বা <code>T</code> দেখলে
                বুঝবেন বিশেষ Bit টা বসানো আছে কিন্তু নিচের x নেই। সাধারণত এটা ভুলের লক্ষণ,
                Lab এ সুইচ টিপে দেখতে পারেন।
              </ContentParagraph>
              <ContentParagraph>
                এবার শেষ হাতিয়ার, <strong>ACL</strong> (Access Control List)। মালিক,
                Group, Other, এই তিন ঘর মাঝে মাঝে কম পড়ে। ধরুন Caddy কে Island Tours এর{" "}
                <code>public</code> Folder থেকে শুধু HTML পড়তে দিতে হবে। caddy মালিক নন,
                islandtours Group এও নেই, তাই তিনি Other, আর Other এর জন্য কিছুই খোলা নেই।
                Other খুলে দিলে Server এর সবাই পড়তে পারবে। caddy কে Group এ ঢোকালে কী হয়,
                সেটা সেকশন ১৪ এ দেখবেন, ফলাফল ভালো না। ACL দিয়ে একটা নির্দিষ্ট User কে,
                নির্দিষ্ট File এ, নির্দিষ্ট অধিকার দেওয়া যায়, বাকি লেবেলে হাত না দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "acl.sh",
          code: String.raw`deploy@island-vps-01:~$ R=/srv/islandtours/releases/2026-10-31-1
deploy@island-vps-01:~$ sudo setfacl -m u:caddy:x /srv/islandtours /srv/islandtours/releases "$R"
deploy@island-vps-01:~$ sudo setfacl -m u:caddy:rx "$R/public"
deploy@island-vps-01:~$ sudo setfacl -m u:caddy:r  "$R/public/index.html"

deploy@island-vps-01:~$ ls -l "$R/public"
-rw-r-----+ 1 deploy islandtours 22 Oct 31 07:26 index.html      # শেষের + মানে ACL আছে

deploy@island-vps-01:~$ getfacl "$R/public/index.html"
# file: srv/islandtours/releases/2026-10-31-1/public/index.html
# owner: deploy
# group: islandtours
user::rw-
user:caddy:r--
group::r--
mask::r--
other::---`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <code>user:caddy:r--</code> লাইনটাই নতুন: শুধু caddy এর জন্য পড়ার অধিকার।
              পথের উপরের Directory গুলোতে caddy পেয়েছে শুধু x, মানে সে পার হয়ে যেতে
              পারবে কিন্তু ভেতরে কী আছে দেখতে পারবে না। <code>mask</code> হলো ACL এর
              সব বাড়তি অধিকারের একটা ছাদ, এর বেশি কেউ পাবে না। ACL শক্তিশালী, কিন্তু
              লুকানো: ls -l শুধু একটা ছোট্ট + দেখায়। তাই প্রথম পছন্দ সবসময় সাধারণ মালিক,
              Group আর Mode। যখন সেটা দিয়ে কাজটা পরিষ্কারভাবে হয় না, তখন ACL, আর তার
              কথা Server এর নোটে লিখে রাখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "debugging",
      subHeader: { index: "014", title: "Debugging Permission denied" },
      title: <SectionTitle>Permission denied, পাঁচ প্রশ্নে খুঁজে বের করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Server এর জীবনে এই বার্তাটা অসংখ্যবার দেখবেন, কখনো Terminal এ, কখনো App
                এর Log এ। Node এর App এ এটা দেখতে এরকম:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "the API log",
          code: String.raw`Error: EACCES: permission denied, open '/srv/islandtours/current/dist/cache.json'
  errno: -13,
  syscall: 'open',
  code: 'EACCES',
  path: '/srv/islandtours/current/dist/cache.json'`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                EACCES হলো Kernel এর ভাষায় Permission denied, আর -13 তার নম্বর। এই
                মুহূর্তে বেশিরভাগ মানুষের হাত চলে যায় <code>chmod 777</code> এর দিকে।
                থামুন। আন্দাজে কিছু বদলানোর আগে পাঁচটা প্রশ্নের উত্তর দিন, ক্রমানুসারে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>১. Process টা কে?</strong> আপনি নন, App টা। systemd এর Unit
                  File এর <code>User=</code> লাইন, বা{" "}
                  <code>ps -o user,group,pid,cmd -C node</code> বলে দেবে। Caddy এর ক্ষেত্রে
                  উত্তর এরকম:{" "}
                  <code>caddy caddy 514 /usr/bin/caddy run --environ --config /etc/caddy/Caddyfile</code>
                </ListItem>
                <ListItem>
                  <strong>২. ঠিক কোন কাজটা ব্যর্থ?</strong> Error এর syscall আর path
                  দেখুন। <code>open</code> একটা File খোলা, কিন্তু সেটা পড়ার জন্য না লেখার
                  জন্য? cache.json লেখার চেষ্টা, কারণ App Cache লিখতে চায়।
                </ListItem>
                <ListItem>
                  <strong>৩. পথের কোন দরজায় আটকাল?</strong> <code>namei -l</code> পুরো পথ
                  ধরে প্রতিটা Directory র লেবেল দেখায়। নতুন File বানানোর সময় File টা তো
                  এখনো নেই, তাই দেখতে হবে তার Directory তে w আর x আছে কি না।
                </ListItem>
                <ListItem>
                  <strong>৪. Process এর চোখে কী দেখা যায়?</strong>{" "}
                  <code>sudo -u islandtours</code> দিয়ে ঠিক একই কাজটা হাতে করে দেখুন।
                  root হয়ে পরীক্ষা করলে সবই কাজ করবে, আর আপনি কিছুই শিখবেন না।
                </ListItem>
                <ListItem>
                  <strong>৫. সবচেয়ে ছোট সমাধান কোনটা?</strong> যে একটা Directory বা File
                  এ আটকেছে, শুধু সেখানে, শুধু সেই User বা Group কে, শুধু দরকারি অক্ষরটা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                উদাহরণের App এর ক্ষেত্রে তিন নম্বর প্রশ্নেই উত্তর মিলে যায়:{" "}
                <code>dist</code> এর মালিক deploy, Mode 2750, islandtours পায় শুধু Group এর
                r-x, w নেই। আর সেটা ঠিকই আছে, কারণ Code এর Folder এ App এর লেখার কথাই নয়।
                সমাধান Permission বদলানো নয়, App কে বলা Cache রাখুক নিজের লেখার জায়গায়,
                যেমন <code>/var/cache/islandtours</code>, যেটার মালিক islandtours নিজে।
                অনেক সময় Permission denied এর আসল উত্তর হলো App ভুল জায়গায় লিখছে।
              </ContentParagraph>
              <ContentParagraph>
                এবার তিন নম্বর প্রশ্নটা ভালো করে দেখি, কারণ এটাই সবচেয়ে বেশি চোখ এড়ায়।
                Error এ File এর নাম থাকে, তাই মানুষ সেই File এর Mode দেখেন, দেখেন সব ঠিক
                আছে, আর হতবাক হন। আসলে আটকেছে পথের অনেক আগের একটা Directory তে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PermPathWalkDiagram /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "namei.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo -u caddy cat /srv/islandtours/current/public/index.html
cat: /srv/islandtours/current/public/index.html: Permission denied

deploy@island-vps-01:~$ namei -l /srv/islandtours/current/public/index.html
f: /srv/islandtours/current/public/index.html
drwxr-xr-x root   root        /
drwxr-xr-x root   root        srv
drwxr-x--- deploy islandtours islandtours          # caddy এখানে Other, Other এর ---
lrwxrwxrwx root   root        current -> /srv/islandtours/releases/2026-10-31-1
drwxr-xr-x root   root          /
drwxr-xr-x root   root          srv
drwxr-x--- deploy islandtours   islandtours
drwxr-s--- deploy islandtours   releases
drwxr-s--- deploy islandtours   2026-10-31-1
drwxr-s--- deploy islandtours public
-rw-r----- deploy islandtours index.html`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                namei Link ও খুলে দেখায়: <code>current</code> কোথায় নির্দেশ করে, আর সেই
                পথের প্রতিটা ধাপ। এখন সমাধানের দুইটা পথ, আর প্রথমটা লোভনীয় কিন্তু ভুল।
                caddy কে islandtours Group এ যোগ করে দিলেই তো সে Group এর অধিকার পাবে, আর
                index.html পড়তে পারবে। দেখুন আর কী কী পড়তে পারে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "group-shortcut.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo usermod -aG islandtours caddy
deploy@island-vps-01:~$ sudo -u caddy cat /srv/islandtours/current/public/index.html
<h1>Island Tours</h1>
deploy@island-vps-01:~$ sudo -u caddy cat /etc/islandtours/api.env | head -1
NODE_ENV=production                   # Database এর Password সহ পুরো File, Caddy এখন পড়তে পারে

deploy@island-vps-01:~$ sudo gpasswd -d caddy islandtours
Removing user caddy from group islandtours`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Group এ ঢোকানো মানে সেই Group এর সব কিছু দিয়ে দেওয়া, শুধু যা দরকার তা
              নয়। Caddy তে কোনোদিন একটা ত্রুটি পাওয়া গেলে আক্রমণকারী এখন API এর
              Password ও পেত। ঠিক সমাধানটা সেকশন ১৩ এর ACL: caddy শুধু পথ পার হওয়ার x আর
              public এর ভেতরের r পায়, আর কিছু না। ACL বসানোর পর আবার পরীক্ষা করলে index.html
              খোলে, api.env খোলে না। নিচের Lab এ এই হিসাবটা নিজে করুন: কে, কোন পথে, কী করতে
              চায়, আর Kernel ঠিক কোন ধাপে কী বলে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PermAccessLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "chmod 777 কেন কখনো উত্তর নয়",
          content: (
            <p>
              777 মানে Server এর প্রতিটা User আর প্রতিটা Process এই File বদলাতে পারবে, আর
              Directory হলে তার ভেতরে যা খুশি রাখতে আর যেকোনো File মুছতে পারবে। আজ Server
              এ হয়তো আপনি একাই, কিন্তু Process তো অনেক। Caddy, API, একটা পুরনো Plugin,
              যেকোনো একটায় ত্রুটি পাওয়া গেলে আক্রমণকারী সেই 777 Folder এ নিজের Code রেখে
              দিতে পারবে, আর পরের বার আপনার App সেটাই চালাবে। 777 Error টা সারায় না, শুধু
              প্রশ্নটা চাপা দেয়। আসল উত্তর সবসময় উপরের পাঁচ প্রশ্নের পাঁচ নম্বরটা: ঠিক
              কার, ঠিক কোথায়, ঠিক কোন অক্ষর লাগবে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Mode ঠিক, তবুও Permission denied হলে",
          content: (
            <p>
              বিরল কিন্তু হয়। তিনটা জিনিস মাথায় রাখুন। প্রথমত, Group এর অধিকার এইমাত্র
              দিয়েছেন অথচ Process টা পুরনো, তাই Restart বা আবার Login লাগবে (সেকশন ৩)।
              দ্বিতীয়ত, Disk টা Read-only করে Mount করা থাকতে পারে, তখন Error হয় Read-only
              file system, যা <code>mount</code> দেখালে বোঝা যায়। তৃতীয়ত, Ubuntu তে
              AppArmor নামে আরেকটা পাহারাদার কিছু Program এর উপর বাড়তি নিয়ম বসায়, তার
              নিষেধ Journal এ <code>apparmor=&quot;DENIED&quot;</code> হিসেবে দেখা যায়।
              Log পড়া নিয়ে বিস্তারিত{" "}
              <Link href="/devops/topic/system-logs" className={linkClass}>
                লেসন ০৭
              </Link>{" "}
              এ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, কোন Folder কার</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার পুরো লেসনটা একটা আসল Server এর নকশায় বসাই। Island Tours এর VPS এ
                প্রতিটা গুরুত্বপূর্ণ জায়গার মালিক, Group আর Mode নিচের ছকে, আর প্রতিটার
                পাশে কারণ। এই ছকটা দলের Wiki তে রাখা থাকে, আর নতুন কেউ এলে প্রথম দিন এটাই
                পড়েন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পথ", "মালিক:Group", "Mode", "কেন এমন"],
          rows: [
            [<code key="1">/srv/islandtours</code>, "deploy:islandtours", mono("750"), "deploy Release বসান, API পড়ে, বাইরের কেউ ঢোকে না"],
            [<code key="2">/srv/islandtours/releases</code>, "deploy:islandtours", mono("2750"), "setgid: deploy যা বসান তার Group আপনা থেকে islandtours"],
            [<code key="3">.../dist/*.js</code>, "deploy:islandtours", mono("640"), "API পড়ে কিন্তু বদলাতে পারে না। ভাঙা API নিজের Code বদলাতে পারবে না"],
            [<code key="4">/srv/islandtours/uploads</code>, "islandtours:islandtours", mono("750"), "API এর একমাত্র লেখার জায়গা, পর্যটকের ছবি এখানে"],
            [<code key="5">/etc/islandtours</code>, "root:islandtours", mono("750"), "Config এর Folder, বদলাতে sudo লাগে"],
            [<code key="6">/etc/islandtours/api.env</code>, "root:islandtours", mono("640"), "Secret, API পড়ে, deploy ও sudo ছাড়া পড়তে পারেন না"],
            [<code key="7">/etc/caddy/Caddyfile</code>, "root:root", mono("644"), "Caddy পড়ে, বদলাতে sudo। এতে Secret নেই"],
            [<code key="8">/var/lib/caddy</code>, "caddy:caddy", mono("750"), "Certificate আর তার Private Key, শুধু Caddy এর"],
            [<code key="9">/var/backups/islandtours</code>, "root:root", mono("700"), "পুরো Database এর কপি, পর্যটকের ব্যক্তিগত তথ্য সহ"],
            [<code key="10">/home/deploy/.ssh</code>, "deploy:deploy", mono("700"), "authorized_keys 600, না হলে SSH Key মানবে না (লেসন ০৩)"],
            [<code key="11">/etc/sudoers.d/deploy-caddy</code>, "root:root", mono("440"), "deploy শুধু Caddy Reload করতে পারেন Password ছাড়া"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই নকশার পেছনে চারটা সিদ্ধান্ত, যেগুলো যেকোনো App এ কাজে লাগবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>যে চালায় আর যে বসায়, তারা আলাদা।</strong> Code এর মালিক deploy,
                  চালায় islandtours। তাই API তে কোনো ত্রুটি দিয়ে আক্রমণকারী ঢুকলেও নিজের
                  Code বদলে স্থায়ী ঘাঁটি গাড়তে পারবে না। একই User মালিক আর চালক হলে এই
                  দেয়ালটা থাকে না।
                </ListItem>
                <ListItem>
                  <strong>লেখার জায়গা একটা, আর সেটা নাম ধরে।</strong> API লিখতে পারে শুধু{" "}
                  <code>uploads</code> এ। অন্য কোথাও লেখার চেষ্টা মানেই একটা Bug, আর
                  EACCES সেটা সাথে সাথে ধরিয়ে দেয়।
                </ListItem>
                <ListItem>
                  <strong>Secret এর চারপাশে দুইটা দেয়াল।</strong> api.env নিজে 640, আর তার
                  Folder ও 750, দুইটাই Other এর জন্য বন্ধ। এক জায়গায় ভুল হলেও অন্যটা
                  আটকায়।
                </ListItem>
                <ListItem>
                  <strong>মানুষের ক্ষমতা ধার করা, স্থায়ী নয়।</strong> deploy sudo এর
                  Group এ আছেন কিন্তু প্রতিবার Password দেন, Script শুধু একটা সরু নিয়ম পায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা সূক্ষ্ম কথা, যা আপনি{" "}
                <Link href="/devops/topic/environment-variables" className={linkClass}>
                  পরের লেসনে
                </Link>{" "}
                কাজে লাগাবেন। App যখন systemd দিয়ে চলে আর তার Unit File এ{" "}
                <code>EnvironmentFile=</code> লেখা থাকে, File টা পড়ে systemd নিজে, root
                হয়ে, App চালু করার আগে। তারপর User বদলে App চালায়। তাই App নিজে File টা না
                পড়লে Mode 600 আর মালিক root:root হলেও চলে, আর সেটা আরও কড়া। Practice
                Server এ এটা পরীক্ষা করা হয়েছে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "environmentfile-is-read-by-systemd.sh",
          code: String.raw`deploy@island-vps-01:~$ sudo ls -l /etc/permtest/test.env
-rw------- 1 root root 24 Oct 31 07:27 /etc/permtest/test.env

# Unit: User=islandtours, EnvironmentFile=/etc/permtest/test.env,
#       ExecStart প্রথমে Variable টা দেখায়, তারপর নিজে File টা পড়তে চায়
deploy@island-vps-01:~$ sudo journalctl -u permtest.service -o cat --no-pager
Starting permtest.service...
got hello-from-env as islandtours
cat: /etc/permtest/test.env: Permission denied
permtest.service: Deactivated successfully.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Variable টা পৌঁছে গেছে, অথচ Process নিজে File খুলতে পারছে না। Island Tours
              তবুও api.env কে root:islandtours 640 রাখে, কারণ Docker দিয়ে চলা API (Docker
              Module এ দেখবেন) আর মাঝে মাঝে হাতে চালানো Migration Script ও এটা পড়ে। দুইটাই
              ঠিক পথ, শুধু জেনে বেছে নিন কে আসলে File টা খোলে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>API চালু হওয়া থেকে প্রথম ছবি জমা পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সকালে Island Tours এর API চালু হলো, আর কিছুক্ষণ পরে একজন পর্যটক Saint
              Martin এর একটা ছবি Upload করলেন। এই পুরো সময়ে Kernel কতবার Permission দেখল,
              আর প্রতিবার কী মিলিয়ে দেখল, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "systemd Config পড়ে, root হয়ে",
              description:
                "Unit File এ EnvironmentFile=/etc/islandtours/api.env। systemd নিজে root, তাই File এর Mode যা-ই হোক পড়তে পারে। DATABASE_URL আর বাকি Variable গুলো সে হাতে রাখে।",
            },
            {
              title: "systemd User বদলায়",
              description:
                "Unit File এর User=islandtours আর Group=islandtours। systemd নতুন Process এর পরিচয়পত্র বসায়: UID 999, GID 996, Group এর তালিকা শুধু islandtours। UMask=0027 ও বসে। এরপর আর root নেই।",
            },
            {
              title: "Node Code খোলে",
              description:
                "Process খুলতে চায় /srv/islandtours/current/dist/main.js। Kernel পথ হাঁটে: / আর srv এ Other এর x, islandtours, releases আর Release এর Folder এ Group এর x। শেষে main.js এর Group এর r। খোলা গেল, শুধু পড়ার জন্য।",
            },
            {
              title: "পর্যটক ছবি পাঠান",
              description:
                "Caddy HTTPS এর তালা খুলে Request টা 127.0.0.1:3000 এ API কে দিল (Module 06)। API ছবিটা লিখতে চায় /srv/islandtours/uploads/bk_7Q2M9X-1.jpg এ।",
            },
            {
              title: "Kernel Directory র w দেখে",
              description:
                "File টা এখনো নেই, তাই প্রশ্নটা uploads Directory কে নিয়ে। মালিক islandtours, আর Process এর UID ও 999। মালিকের Bit rwx, তাই w আর x দুইটাই আছে। File তৈরি হলো।",
            },
            {
              title: "নতুন File এর লেবেল বসে",
              description:
                "মালিক হলো Process এর UID, islandtours। Group হলো Process এর Group (uploads এ setgid নেই)। Mode হলো 666 থেকে umask 027 কাটা, মানে 640।",
            },
            {
              title: "একটা ভুল চেষ্টা থামানো হয়",
              description:
                "একটা পুরনো Code পথ ছবির ছোট সংস্করণ রাখতে চাইল dist এর ভেতরে। dist এ islandtours এর শুধু Group এর r-x, w নেই। Kernel EACCES ফেরত দিল, API এর Log এ লাইন পড়ল, আর দল জানল Code টা ভুল জায়গায় লিখছে।",
            },
            {
              title: "deploy পরে Log দেখেন",
              description:
                "deploy SSH দিয়ে ঢুকে ছবিটা দেখতে চাইলেন। uploads এর মালিক islandtours, Mode 750, deploy সেই Group এ নেই, তাই Other, তাই বন্ধ। তিনি লিখলেন sudo ls, Password দিলেন, আর Journal এ লেখা থাকল কে কখন দেখলেন।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও গভীরে যেতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিচের Lab টা আগে করুন</strong>, ছয়টা Script এ এই লেসনের প্রতিটা
                চমক নিজের Server এ ঘটবে। Permission পড়ে শেখা যায় না, ভেঙে শেখা যায়।
              </ListItem>
              <ListItem>
                <strong>path_resolution(7)</strong>, Kernel কীভাবে একটা পথ হাঁটে আর প্রতিটা
                ধাপে কী দেখে, তার আসল বর্ণনা। সেকশন ১৪ এর ছবিটা এখান থেকেই।{" "}
                <a
                  href="https://man7.org/linux/man-pages/man7/path_resolution.7.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  man7.org/linux/man-pages/man7/path_resolution.7.html
                </a>
              </ListItem>
              <ListItem>
                <strong>chmod(1) আর GNU coreutils এর File permissions অধ্যায়</strong>,
                অক্ষরের ভাষা, বড় হাতের X আর বিশেষ Bit এর পুরো নিয়ম।{" "}
                <a
                  href="https://www.gnu.org/software/coreutils/manual/html_node/File-permissions.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  gnu.org coreutils: File permissions
                </a>
              </ListItem>
              <ListItem>
                <strong>sudoers এর Manual</strong>, নিয়মের ভাষা, Defaults আর কোন Command
                কে NOPASSWD দেওয়া বিপজ্জনক।{" "}
                <a
                  href="https://www.sudo.ws/docs/man/sudoers.man/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  sudo.ws/docs/man/sudoers.man
                </a>
              </ListItem>
              <ListItem>
                <strong>Ubuntu Server এর User management গাইড</strong>, adduser, Group,
                Password নীতি আর Home Directory র নিরাপত্তা।{" "}
                <a
                  href="https://documentation.ubuntu.com/server/how-to/security/user-management/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  documentation.ubuntu.com/server: User management
                </a>
              </ListItem>
              <ListItem>
                <strong>ArchWiki: File permissions and attributes</strong>, Ubuntu না
                হলেও Linux এর এই অংশের সবচেয়ে গোছানো লেখা, ACL সহ।{" "}
                <a
                  href="https://wiki.archlinux.org/title/File_permissions_and_attributes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  wiki.archlinux.org: File permissions and attributes
                </a>
              </ListItem>
              <ListItem>
                <strong>systemd.exec(5)</strong>, Service এর User, Group, UMask আর
                EnvironmentFile এর সঠিক আচরণ।{" "}
                <a
                  href="https://man7.org/linux/man-pages/man5/systemd.exec.5.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  man7.org/linux/man-pages/man5/systemd.exec.5.html
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
                  প্রতিটা Process একটা পরিচয়পত্র নিয়ে চলে (UID, GID, Group এর তালিকা),
                  আর প্রতিটা File এর গায়ে একটা লেবেল (মালিক, Group, নয়টা Bit)। Permission
                  মানে Kernel এর এই দুইটা মিলিয়ে দেখা।
                </ListItem>
                <ListItem>
                  Kernel নাম চেনে না, সংখ্যা চেনে। নাম আর সংখ্যার তালিকা{" "}
                  <code>/etc/passwd</code> আর <code>/etc/group</code> এ, Password এর ছাপ
                  root এর তালাবন্ধ <code>/etc/shadow</code> এ।
                </ListItem>
                <ListItem>
                  মানুষের জন্য adduser, Program এর জন্য{" "}
                  <code>useradd --system --shell /usr/sbin/nologin</code>। Group এ যোগ
                  করতে সবসময় <code>-aG</code>, আর নতুন Group পেতে আবার Login বা Restart।
                </ListItem>
                <ListItem>
                  root এর জন্য সাধারণ নিয়ম খাটে না, তাই root হয়ে বসে থাকা নয়, sudo দিয়ে
                  একটা একটা Command। sudoers বদলান শুধু visudo দিয়ে, আর Script এর জন্য
                  একটা Command এর সরু নিয়ম।
                </ListItem>
                <ListItem>
                  Kernel ক্রমে দেখে: root, মালিক, (ACL), Group, Other। প্রথম যেটা মেলে,
                  শুধু সেটার Bit।
                </ListItem>
                <ListItem>
                  Directory তে r মানে নাম দেখা, w মানে নাম যোগ আর মোছা, x মানে পার হওয়া।
                  মুছতে লাগে Directory র w, File এর নয়। পথের প্রতিটা Directory তে x লাগে।
                </ListItem>
                <ListItem>
                  r=4, w=2, x=1। 644, 640, 600, 755, 750, 700 চিনে রাখুন। chmod Bit বদলায়,
                  chown শুধু root, chgrp নিজের Group এ। নতুন Folder এ install -d।
                </ListItem>
                <ListItem>
                  umask নতুন File এর Mode ঠিক করে, আর সেটা Process এর, User এর নয়। Service
                  এ UMask=0027।
                </ListItem>
                <ListItem>
                  setuid মানে মালিক হয়ে চলা, setgid Directory মানে নতুন File Directory র
                  Group পায়, Sticky মানে শুধু মালিক মুছতে পারেন। ACL একজন নির্দিষ্ট User কে
                  নির্দিষ্ট অধিকার দেয়।
                </ListItem>
                <ListItem>
                  Permission denied এ পাঁচ প্রশ্ন: Process কে, কোন কাজ, পথের কোন দরজা
                  (namei -l), Process এর চোখে (sudo -u), সবচেয়ে ছোট সমাধান। কখনো 777 নয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৫, Environment Variables",
          content: (
            <p>
              এই লেসনে বারবার একটা File এর কথা এসেছে, <code>api.env</code>, যার মালিক root
              আর Group islandtours, আর যাকে নিয়ে এত সাবধানতা কারণ ভেতরে Database এর
              Password। কিন্তু সেই File এর ভেতরে কী লেখা থাকে, App সেটা কীভাবে পায়, আর
              একটা Secret কোথায় কোথায় ফাঁস হতে পারে, সেই প্রশ্নগুলো এখনো খোলা।{" "}
              <Link href="/devops/topic/environment-variables" className={linkClass}>
                পরের লেসন, Environment Variables
              </Link>
              , ঠিক সেখান থেকে শুরু করবে। আর এই লেসনের মালিক, Group আর Mode এর নকশাটা
              পুরো একটা Server এ সত্যি সত্যি বসাবেন এই Module এর শেষ লেসনে,{" "}
              <Link href="/devops/topic/vps-setup" className={linkClass}>
                VPS Setup, End to End
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
      ["UID", "Kernel এর কাছে User এর আসল পরিচয়। 0 root, 1 থেকে 999 Program, 1000 থেকে মানুষ"],
      ["/etc/passwd", "নাম, UID, GID, Home আর Shell এর তালিকা। সবাই পড়তে পারে, Password নেই"],
      ["/etc/shadow", "Password এর ছাপ। শুধু root পড়ে। ! বা * মানে Password দিয়ে Login নেই"],
      ["Primary Group", "প্রতিটা User এর একটা, নতুন File এর Group এটাই হয়"],
      ["Supplementary Group", "বাড়তি সদস্যপদ। যোগ করতে usermod -aG, -a ছাড়া পুরনোগুলো মুছে যায়"],
      ["Service User", "useradd --system, কোনো Home বা Login নেই। প্রতিটা Program এর নিজের"],
      ["sudo", "একটা Command root হয়ে। নিয়ম /etc/sudoers আর sudoers.d এ, বদলান visudo দিয়ে"],
      ["ls -l", "ধরন, নয়টা Bit, Link, মালিক, Group, আকার, সময়, নাম"],
      ["যাচাইয়ের ক্রম", "root, মালিক, ACL, Group, Other। প্রথম যা মেলে, শুধু তার Bit"],
      ["Directory র rwx", "r নাম দেখা, w নাম যোগ আর মোছা, x পার হওয়া"],
      ["Octal", "r=4, w=2, x=1। 640 মানে মালিক rw, Group r, বাকিরা কিছু না"],
      ["chmod, chown, chgrp", "Bit, মালিক, Group বদলানো। chown শুধু root"],
      ["umask", "নতুন File এর প্রস্তাব থেকে কাটা Bit। Process এর Setting, Service এ UMask="],
      ["setuid, setgid, Sticky", "মালিক হয়ে চলা, Directory র Group পাওয়া, শুধু মালিক মুছতে পারা"],
      ["ACL", "নির্দিষ্ট User কে নির্দিষ্ট অধিকার। setfacl, getfacl, ls -l এ +"],
      ["namei -l", "পথের প্রতিটা ধাপের লেবেল, Permission denied ধরার প্রধান হাতিয়ার"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "ls -l দেখাচ্ছে -rw-r----- 1 root islandtours api.env। islandtours User হয়ে চলা API এই File নিয়ে কী করতে পারবে?",
        options: [
          {
            key: "A",
            text: "পড়তে আর বদলাতে দুইটাই",
            isCorrect: false,
            explanation: "বদলানোর w আছে শুধু মালিকের ঘরে, আর মালিক root, islandtours নয়।",
          },
          {
            key: "B",
            text: "শুধু পড়তে",
            isCorrect: true,
            explanation:
              "ঠিক। API মালিক নয়, কিন্তু islandtours Group এর সদস্য। তাই Kernel Group এর তিনটা Bit দেখে, r-- । পড়া চলবে, লেখা চলবে না।",
          },
          {
            key: "C",
            text: "কিছুই না, কারণ মালিক root",
            isCorrect: false,
            explanation: "মালিক root হলেও Group এর Bit আলাদা করে অধিকার দেয়। Group মেলে বলে r পাওয়া যায়।",
          },
          {
            key: "D",
            text: "চালাতে পারবে, কারণ এটা Config",
            isCorrect: false,
            explanation: "কোনো ঘরেই x নেই। আর Config File চালানোর জিনিসও নয়, পড়ার জিনিস।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা File এর মালিক deploy আর Mode ----rwxrwx (077)। deploy কি এটা পড়তে পারবেন?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, কারণ Other এর ঘরে r আছে আর deploy ও তো বাকিদের একজন",
            isCorrect: false,
            explanation:
              "Kernel মালিককে চিনে ফেলার পর আর নিচের দলে নামে না। deploy এর জন্য Other এর ঘর বিবেচনাই হয় না।",
          },
          {
            key: "B",
            text: "না। Kernel মালিকের ঘরের --- দিয়েই সিদ্ধান্ত নেয়",
            isCorrect: true,
            explanation:
              "ঠিক। প্রথম যে দল মেলে, শুধু সেটার Bit। মালিক মিলে গেছে, তাই ---, Permission denied। তবে মালিক চাইলে chmod দিয়ে নিজের Bit বদলে নিতে পারেন।",
          },
          {
            key: "C",
            text: "হ্যাঁ, মালিক সবসময় নিজের File পড়তে পারেন",
            isCorrect: false,
            explanation: "মালিক Mode বদলাতে পারেন, কিন্তু Mode না বদলানো পর্যন্ত মালিকের Bit ই তাঁর অধিকার।",
          },
          {
            key: "D",
            text: "শুধু sudo দিয়ে",
            isCorrect: false,
            explanation: "sudo দিয়ে root হলে পড়া যাবে, কিন্তু প্রশ্নটা deploy নিজে পারবেন কি না। পারবেন না।",
          },
        ],
      },
      {
        id: 3,
        text: "একটা Directory র Mode drwx--x--x (711)। guest নামের একজন সাধারণ User ভেতরের File এর নাম জানেন। তিনি কী পারবেন?",
        options: [
          {
            key: "A",
            text: "ls দিয়ে তালিকা দেখতে পারবেন, কিন্তু File খুলতে পারবেন না",
            isCorrect: false,
            explanation: "উল্টো। তালিকা দেখতে লাগে r, যেটা guest এর নেই।",
          },
          {
            key: "B",
            text: "তালিকা দেখতে পারবেন না, কিন্তু জানা নামের File এর নিজের Permission অনুমতি দিলে সেটা খুলতে পারবেন",
            isCorrect: true,
            explanation:
              "ঠিক। x মানে পথ পার হওয়া। নাম জানা থাকলে সরাসরি পৌঁছানো যায়, তালিকা না দেখেও। Lab এ ঠিক এটাই হয়েছে: ls ব্যর্থ, cat সফল।",
          },
          {
            key: "C",
            text: "কিছুই পারবেন না",
            isCorrect: false,
            explanation: "Other এর x আছে, আর x দিয়েই ভেতরের জানা File এ পৌঁছানো যায়।",
          },
          {
            key: "D",
            text: "ভেতরে নতুন File বানাতে পারবেন",
            isCorrect: false,
            explanation: "নতুন File বানাতে Directory র w লাগে, Other এর ঘরে w নেই।",
          },
        ],
      },
      {
        id: 4,
        text: "price.txt এর মালিক deploy, Mode 644। এর Directory র Mode 775, Group team, আর guest সেই team এ আছেন। guest কী করতে পারবেন?",
        options: [
          {
            key: "A",
            text: "File টা বদলাতে পারবেন না, মুছতেও পারবেন না",
            isCorrect: false,
            explanation: "মোছা File এর অধিকার নয়, Directory র। Directory তে guest এর Group এর w আছে।",
          },
          {
            key: "B",
            text: "File টা বদলাতে পারবেন না, কিন্তু পুরো File টা মুছে দিতে পারবেন",
            isCorrect: true,
            explanation:
              "ঠিক। মোছা মানে Directory র তালিকা থেকে নাম কাটা, তাই লাগে Directory র w আর x। Directory তে Sticky Bit বসালে এটা বন্ধ হয়।",
          },
          {
            key: "C",
            text: "File টা বদলাতে আর মুছতে দুইটাই পারবেন",
            isCorrect: false,
            explanation: "File এর Other আর Group এর ঘরে w নেই, তাই ভেতরের লেখা বদলানো যাবে না।",
          },
          {
            key: "D",
            text: "শুধু পড়তে পারবেন",
            isCorrect: false,
            explanation: "পড়তে পারবেন ঠিকই, কিন্তু Directory র w এর জোরে মুছতেও পারবেন, যেটা এখানে আসল শিক্ষা।",
          },
        ],
      },
      {
        id: 5,
        text: "একজন Admin চালালেন sudo usermod -G docker deploy। এরপর কী হবে?",
        options: [
          {
            key: "A",
            text: "deploy আগের সব Group এর সাথে docker Group ও পাবেন",
            isCorrect: false,
            explanation: "সেটা হয় -aG দিলে। -a ছাড়া -G পুরো তালিকাটা বদলে দেয়।",
          },
          {
            key: "B",
            text: "deploy শুধু docker এ থাকবেন, sudo Group হারাবেন, আর পরের বার sudo কাজ করবে না",
            isCorrect: true,
            explanation:
              "ঠিক। -G মানে Supplementary Group এর তালিকা এটা। এটাই একমাত্র Admin হলে Server এ ফেরার পথ Provider এর Web Console।",
          },
          {
            key: "C",
            text: "Command টা Error দেবে, কারণ -a নেই",
            isCorrect: false,
            explanation: "কোনো Error হয় না, চুপচাপ তালিকা বদলে যায়। এই নীরবতাই বিপদ।",
          },
          {
            key: "D",
            text: "deploy এর Primary Group docker হয়ে যাবে",
            isCorrect: false,
            explanation: "Primary Group বদলায় ছোট হাতের -g। -G শুধু Supplementary তালিকা বদলায়।",
          },
        ],
      },
      {
        id: 6,
        text: "deploy কে islandtours Group এ যোগ করা হলো, id deploy তে Group টা দেখাও যাচ্ছে। তবুও deploy এর খোলা SSH Session এ Permission denied আসছে। কেন?",
        options: [
          {
            key: "A",
            text: "Group এ যোগ করার Command কাজ করেনি",
            isCorrect: false,
            explanation: "id দেখাচ্ছে Group আছে, তাই /etc/group ঠিকঠাক বদলেছে।",
          },
          {
            key: "B",
            text: "চলমান Process এর Group এর তালিকা Login এর সময় বসেছিল, পরের বদল সে জানে না",
            isCorrect: true,
            explanation:
              "ঠিক। /proc/<PID>/status এর Groups লাইনে নতুন Group নেই। বেরিয়ে আবার SSH করলে, বা Service হলে Restart করলে, নতুন তালিকা বসবে।",
          },
          {
            key: "C",
            text: "Group এর অধিকার পেতে চব্বিশ ঘণ্টা লাগে",
            isCorrect: false,
            explanation: "কোনো অপেক্ষার সময় নেই। নতুন Login এ সাথে সাথে পাওয়া যায়।",
          },
          {
            key: "D",
            text: "File টার Mode বদলাতে হবে",
            isCorrect: false,
            explanation: "Mode ঠিক থাকলেও পুরনো Process নতুন Group এর অধিকার পায় না। সমস্যা Process এর পরিচয়পত্রে।",
          },
        ],
      },
      {
        id: 7,
        text: "Caddy কে Island Tours এর public Folder এর HTML পড়তে দিতে হবে, কিন্তু /etc/islandtours/api.env নয়। সবচেয়ে ভালো উপায় কোনটা?",
        options: [
          {
            key: "A",
            text: "caddy কে islandtours Group এ যোগ করা",
            isCorrect: false,
            explanation:
              "তাহলে caddy islandtours Group এর সব অধিকার পাবে, api.env সহ। লেসনে ঠিক এটাই পরীক্ষা করে দেখা গেছে।",
          },
          {
            key: "B",
            text: "public আর তার উপরের Folder গুলো chmod 777 করে দেওয়া",
            isCorrect: false,
            explanation: "Server এর সবাই তখন সেখানে লিখতে আর মুছতে পারবে। সমস্যা সারে না, বড় হয়।",
          },
          {
            key: "C",
            text: "ACL দিয়ে caddy কে পথের Directory তে শুধু x, আর public এর ভেতরে শুধু r দেওয়া",
            isCorrect: true,
            explanation:
              "ঠিক। শুধু caddy, শুধু ওই পথ, শুধু দরকারি অক্ষর। api.env এর Folder এ caddy এখনো Other, তাই বন্ধ।",
          },
          {
            key: "D",
            text: "পুরো /srv/islandtours এর মালিক caddy করে দেওয়া",
            isCorrect: false,
            explanation: "তাহলে Caddy App এর Code বদলাতেও পারবে, আর deploy নতুন Release বসাতে পারবেন না।",
          },
        ],
      },
      {
        id: 8,
        text: "একটা systemd Service এ User=islandtours আর EnvironmentFile=/etc/app/app.env, যার Mode 600 আর মালিক root:root। কী হবে?",
        options: [
          {
            key: "A",
            text: "Service চালুই হবে না, কারণ islandtours File টা পড়তে পারে না",
            isCorrect: false,
            explanation: "EnvironmentFile পড়ে systemd নিজে, User বদলানোর আগে, root হয়ে।",
          },
          {
            key: "B",
            text: "Variable গুলো App এ পৌঁছাবে, কিন্তু App নিজে File টা খুলতে চাইলে Permission denied পাবে",
            isCorrect: true,
            explanation:
              "ঠিক। Practice Server এ পরীক্ষায় Variable এসেছে, আর cat দিয়ে File খোলা ব্যর্থ হয়েছে। App নিজে File না পড়লে এটাই সবচেয়ে কড়া ব্যবস্থা।",
          },
          {
            key: "C",
            text: "systemd চুপচাপ Mode বদলে 644 করে দেবে",
            isCorrect: false,
            explanation: "systemd কখনো আপনার File এর Mode বদলায় না।",
          },
          {
            key: "D",
            text: "App root হয়ে চলবে, কারণ File এর মালিক root",
            isCorrect: false,
            explanation: "App চলবে Unit File এর User= হিসেবে। File এর মালিক কে, তাতে Process এর পরিচয় বদলায় না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের Server এ Permission ভাঙুন আর সারান",
    subtitle: "ছয়টা Script, Practice Server এ deploy হয়ে চালান",
    stepName: "LAB",
    steps: [
      {
        title: "আমি কে",
        description:
          "id, getent আর তিনটা File এর লেবেল দেখুন। /etc/shadow সাধারণভাবে পড়তে গিয়ে Permission denied নিজের চোখে দেখুন, তারপর sudo দিয়ে শুধু নিজের লাইনের শুরুটা।",
      },
      {
        title: "মানুষ আর Service এর User",
        description:
          "deploy কে sudo Group এ, islandtours কে System User হিসেবে বানান। nologin এর বার্তা দেখুন, আর একটা পরীক্ষার User এ -a ভুলে যাওয়ার ফল দেখে মুছে ফেলুন।",
      },
      {
        title: "Directory র তিন চমক",
        description:
          "r ছাড়া x, x ছাড়া r, মালিক পায় সবচেয়ে কম, Directory র w দিয়ে অন্যের File মোছা, Sticky Bit আর setgid, সব একে একে ঘটান।",
      },
      {
        title: "Island Tours এর মতো Folder সাজানো",
        description:
          "install -d দিয়ে মালিক, Group আর Mode সহ Folder বানান। তারপর একটা ছোট পরীক্ষক দিয়ে প্রমাণ করুন কে কী পারে আর কী পারে না।",
      },
      {
        title: "একটা Permission denied ধরা",
        description:
          "caddy কে index.html পড়তে দিন না, namei -l দিয়ে আটকানোর জায়গা খুঁজুন। Group এর শর্টকাট কত বেশি দিয়ে ফেলে দেখুন, তারপর ACL দিয়ে ঠিকটা করুন।",
      },
      {
        title: "একটা সরু sudo নিয়ম",
        description:
          "visudo দিয়ে পরীক্ষা করে একটা নিয়ম বসান যা শুধু my-tours-api Restart করতে দেয় Password ছাড়া। sudo -k দিয়ে প্রমাণ করুন আর কিছু Password ছাড়া চলে না, তারপর Journal এ লাইনগুলো দেখুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-who-am-i.sh",
        language: "bash",
        code: String.raw`# ১. আমি কে, আর Server আমাকে কীভাবে চেনে
id
whoami
getent passwd root "$USER"
getent group sudo
ls -l /etc/passwd /etc/group /etc/shadow
cat /etc/shadow            # সাধারণ User হিসেবে: Permission denied
sudo grep "^$USER:" /etc/shadow | cut -c1-20

# যা দেখার কথা (সংখ্যা আপনার আলাদা হতে পারে):
# uid=1001(deploy) gid=1001(deploy) groups=1001(deploy),27(sudo),100(users)
# -rw-r----- 1 root shadow  648 Oct 31 07:33 /etc/shadow
# cat: /etc/shadow: Permission denied
# deploy:$y$j9T$...         <- yescrypt এর ছাপের শুরু`,
      },
      {
        filename: "2-users-and-groups.sh",
        language: "bash",
        code: String.raw`# ২. মানুষের জন্য User, Service এর জন্য User
id deploy >/dev/null 2>&1 || sudo adduser --comment "Island Tours admin" deploy
sudo usermod -aG sudo deploy
sudo useradd --system --no-create-home --home-dir /nonexistent \
  --shell /usr/sbin/nologin islandtours
getent passwd deploy islandtours
id islandtours
sudo su - islandtours      # This account is currently not available.

# -a ভুলে গেলে কী হয়, একটা ফেলে দেওয়ার মতো User দিয়ে দেখুন
sudo adduser --disabled-password --comment "test" trial >/dev/null
sudo groupadd -f ops
sudo usermod -aG sudo trial; id trial
sudo usermod -G ops trial;   id trial      # sudo Group হারিয়ে গেল
sudo userdel -r trial

# যা দেখার কথা:
# islandtours:x:999:996::/nonexistent:/usr/sbin/nologin
# uid=1002(trial) gid=1002(trial) groups=1002(trial),27(sudo),100(users)
# uid=1002(trial) gid=1002(trial) groups=1002(trial),1003(ops)`,
      },
      {
        filename: "3-directory-bits.sh",
        language: "bash",
        code: String.raw`# ৩. Directory তে r, w, x আর তিনটা চমক
sudo adduser --disabled-password --comment "second user" guest >/dev/null
sudo install -d -m 755 -o deploy -g deploy /srv/lab/notes
echo "boat leaves 07:00" | sudo -u deploy tee /srv/lab/notes/schedule.txt >/dev/null
cd /srv/lab

sudo chmod 744 notes                           # r আছে, x নেই
sudo -u guest ls -l notes                      # -????????? ? ? ? ? schedule.txt
sudo -u guest cat notes/schedule.txt           # Permission denied

sudo chmod 711 notes                           # x আছে, r নেই
sudo -u guest ls notes                         # cannot open directory
sudo -u guest cat notes/schedule.txt           # boat leaves 07:00

sudo chmod 755 notes
sudo chmod 077 notes/schedule.txt              # মালিক পায় সবচেয়ে কম
sudo -u deploy cat notes/schedule.txt          # Permission denied
sudo -u guest  cat notes/schedule.txt          # boat leaves 07:00

# মুছতে লাগে Directory র w, File এর না
sudo groupadd -f team
sudo usermod -aG team deploy
sudo usermod -aG team guest
sudo install -d -m 775 -o deploy -g team /srv/lab/shared
echo "price 4500" | sudo -u deploy tee /srv/lab/shared/price.txt >/dev/null
sudo chmod 644 /srv/lab/shared/price.txt
sudo -u guest sh -c 'echo 99 >> /srv/lab/shared/price.txt'   # Permission denied
sudo -u guest rm -f /srv/lab/shared/price.txt && echo "guest deleted it"

# Sticky Bit এই চমক থামায়
sudo chmod +t /srv/lab/shared
echo "price 4500" | sudo -u deploy tee /srv/lab/shared/price.txt >/dev/null
sudo -u guest rm -f /srv/lab/shared/price.txt   # Operation not permitted

# setgid Directory: ভেতরের নতুন File পায় Directory র Group
sudo chmod -t /srv/lab/shared
sudo -u guest touch /srv/lab/shared/before.txt
sudo chmod 2775 /srv/lab/shared
sudo -u guest touch /srv/lab/shared/after.txt
ls -l /srv/lab/shared
# -rw-rw-r-- 1 guest  team    0 ... after.txt
# -rw-rw-r-- 1 guest  guest   0 ... before.txt`,
      },
      {
        filename: "4-island-tours-layout.sh",
        language: "bash",
        code: String.raw`# ৪. Island Tours এর মতো করে Folder সাজানো, তারপর প্রমাণ
R=/srv/islandtours/releases/2026-10-31-1
sudo install -d -m 750  -o deploy -g islandtours /srv/islandtours
# 2 মানে setgid: deploy যা বানাবেন, তার Group হবে islandtours, deploy নয়
sudo install -d -m 2750 -o deploy -g islandtours /srv/islandtours/releases "$R" "$R/dist"
sudo install -d -m 750 -o islandtours -g islandtours /srv/islandtours/uploads
sudo install -d -m 750 -o root -g islandtours /etc/islandtours
sudo install -d -m 700 -o root -g root /var/backups/islandtours
echo 'console.log("api")' | sudo -u deploy tee "$R/dist/main.js" >/dev/null
sudo chmod 640 "$R/dist/main.js"
sudo ln -sfn "$R" /srv/islandtours/current
printf 'NODE_ENV=production\nPORT=3000\n' | sudo tee /etc/islandtours/api.env >/dev/null
sudo chown root:islandtours /etc/islandtours/api.env
sudo chmod 640 /etc/islandtours/api.env

stat -c '%a %A %U:%G %n' /srv/islandtours /srv/islandtours/releases "$R/dist/main.js" \
  /srv/islandtours/uploads /etc/islandtours /etc/islandtours/api.env /var/backups/islandtours

# কে কী পারে, একটা ছোট পরীক্ষক দিয়ে
t() { u=$1; shift; if sudo -u "$u" sh -c "$*" >/dev/null 2>&1; then echo "OK      $u: $*"; else echo "DENIED  $u: $*"; fi; }
t islandtours "cat /etc/islandtours/api.env"
t islandtours "echo X >> /etc/islandtours/api.env"
t islandtours "cat /srv/islandtours/current/dist/main.js"
t islandtours "echo X >> /srv/islandtours/current/dist/main.js"
t islandtours "touch /srv/islandtours/uploads/boat-photo.jpg"
t deploy      "cat /etc/islandtours/api.env"
t deploy      "ls /var/backups/islandtours"

# যা দেখার কথা:
# 750 drwxr-x--- deploy:islandtours /srv/islandtours
# 2750 drwxr-s--- deploy:islandtours /srv/islandtours/releases
# 640 -rw-r----- deploy:islandtours /srv/islandtours/releases/2026-10-31-1/dist/main.js
# 750 drwxr-x--- islandtours:islandtours /srv/islandtours/uploads
# 750 drwxr-x--- root:islandtours /etc/islandtours
# 640 -rw-r----- root:islandtours /etc/islandtours/api.env
# 700 drwx------ root:root /var/backups/islandtours
# OK      islandtours: cat /etc/islandtours/api.env
# DENIED  islandtours: echo X >> /etc/islandtours/api.env
# OK      islandtours: cat /srv/islandtours/current/dist/main.js
# DENIED  islandtours: echo X >> /srv/islandtours/current/dist/main.js
# OK      islandtours: touch /srv/islandtours/uploads/boat-photo.jpg
# DENIED  deploy: cat /etc/islandtours/api.env
# DENIED  deploy: ls /var/backups/islandtours`,
      },
      {
        filename: "5-debug-denied.sh",
        language: "bash",
        code: String.raw`# ৫. একটা Permission denied ধরে ধরে সারানো
# Caddy এখনো বসানো না থাকলে তার জায়গায় একটা caddy User বানিয়ে নিন
id caddy >/dev/null 2>&1 || sudo useradd --system --no-create-home \
  --home-dir /nonexistent --shell /usr/sbin/nologin caddy
R=/srv/islandtours/releases/2026-10-31-1
sudo install -d -m 2750 -o deploy -g islandtours "$R/public"
echo "<h1>Island Tours</h1>" | sudo -u deploy tee "$R/public/index.html" >/dev/null
sudo chmod 640 "$R/public/index.html"

sudo -u caddy cat /srv/islandtours/current/public/index.html   # Permission denied
namei -l /srv/islandtours/current/public/index.html             # কোথায় আটকাল

# সহজ কিন্তু ভুল সমাধান: caddy কে islandtours Group এ দেওয়া
sudo usermod -aG islandtours caddy
sudo -u caddy cat /etc/islandtours/api.env | head -1    # Secret ও পড়ে ফেলল
sudo gpasswd -d caddy islandtours

# ঠিক সমাধান: শুধু যতটুকু দরকার, ACL দিয়ে
sudo setfacl -m u:caddy:x /srv/islandtours /srv/islandtours/releases "$R"
sudo setfacl -m u:caddy:rx "$R/public"
sudo setfacl -m u:caddy:r  "$R/public/index.html"
sudo -u caddy cat /srv/islandtours/current/public/index.html   # <h1>Island Tours</h1>
sudo -u caddy cat /etc/islandtours/api.env                     # এখনো Permission denied
getfacl "$R/public/index.html"                                 # user:caddy:r--`,
      },
      {
        filename: "6-sudo-rule.sh",
        language: "bash",
        code: String.raw`# ৬. deploy এর জন্য একটা সরু sudo নিয়ম
sudo -l -U deploy
printf '%s\n' \
  '# deploy may restart the my-tours API without a password, nothing more' \
  'deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart my-tours-api' \
  > /tmp/deploy-my-tours
sudo visudo -cf /tmp/deploy-my-tours          # আগে পরীক্ষা, তারপর বসানো
sudo install -m 440 -o root -g root /tmp/deploy-my-tours /etc/sudoers.d/deploy-my-tours
rm /tmp/deploy-my-tours
sudo visudo -c
sudo -l -U deploy | tail -2

sudo -k                                         # জমা থাকা Password ভুলে যেতে বলুন
sudo -n /usr/bin/systemctl restart my-tours-api  # Password চাইবে না
sudo -n /usr/bin/systemctl restart cron          # a password is required
sudo journalctl _COMM=sudo -n 6 --no-pager -o short-iso

# যা দেখার কথা:
# /tmp/deploy-my-tours: parsed OK
#     (ALL : ALL) ALL
#     (root) NOPASSWD: /usr/bin/systemctl restart my-tours-api
# Failed to restart my-tours-api.service: Unit my-tours-api.service not found.
#    ^ লেসন ০২ এর Service এখনো না থাকলে এটা আসবে। আসল কথা: Password চায়নি।
# sudo: a password is required
# ... deploy : PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/systemctl restart my-tours-api
# ... deploy : a password is required ; PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/systemctl restart cron`,
      },
    ],
    tip: "Script ৩ আর ৫ পাশাপাশি রেখে ভাবুন, কারণ পুরো লেসনের সবচেয়ে কাজের শিক্ষা এই দুইটার মাঝখানে। Script ৩ দেখায় Kernel কী মেলায়: Directory তে x মানে পার হওয়া, w মানে নাম যোগ আর মোছা। Script ৫ দেখায় সেই জ্ঞান দিয়ে কীভাবে একটা আসল Permission denied সারাতে হয়: আন্দাজে chmod নয়, namei -l দিয়ে ঠিক দরজাটা খুঁজে বের করা, তারপর ঠিক সেই দরজায় ঠিক সেই User কে ঠিক সেই অক্ষর। Group এর শর্টকাটটা কেন বিপজ্জনক, সেটা Script ৫ এর মাঝের লাইনে নিজের চোখে দেখেছেন। পরের বার কেউ বলবে সহজ, ওকে Group এ ঢুকিয়ে দিন, আপনি জানবেন প্রথম প্রশ্নটা কী: ওই Group এ আর কী কী আছে।",
  },
  assignment: {
    title: "Mini Project: my-tours এর Permission এর নকশা",
    time: "৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>my-tours এর নকশা কাগজে:</strong> আপনার my-tours API চলবে{" "}
        <code>mytours</code> নামের System User হয়ে, Code থাকবে{" "}
        <code>/srv/my-tours</code> এ, Config <code>/etc/my-tours/api.env</code> এ, আর
        Upload এর জন্য একটা Folder। Project Example এর ছকের মতো একটা ছক বানান: প্রতিটা
        পথের মালিক, Group, Mode, আর এক লাইনে কারণ।
      </span>,
      <span key="2">
        <strong>নকশাটা বসান:</strong> নিজের Practice Server এ <code>mytours</code> User
        বানান, তারপর শুধু <code>install -d</code>, <code>chown</code> আর{" "}
        <code>chmod</code> দিয়ে ছকটা বাস্তবে বসান। Release Folder এ setgid দিতে ভুলবেন
        না। Lab এর ছোট পরীক্ষক <code>t</code> দিয়ে অন্তত আটটা প্রমাণ দিন: কে কী পারে আর
        কী পারে না, আপনার ছকের সাথে মিলিয়ে।
      </span>,
      <span key="3">
        <strong>একটা পাহারাদার Script:</strong> <code>check-perms.sh</code> লিখুন যা
        তিনটা জিনিস খুঁজে বের করে আর পেলে Exit Code 1 দেয়: <code>/srv/my-tours</code> এর
        ভেতরে Other এর জন্য লেখা যায় এমন কিছু (<code>find -perm -o+w</code>),{" "}
        <code>/etc/my-tours</code> এর ভেতরে Other পড়তে পারে এমন কিছু, আর{" "}
        <code>/srv/my-tours</code> এর ভেতরে মালিকহীন File (<code>-nouser</code>)। একটা
        ভুল ইচ্ছা করে বসিয়ে প্রমাণ করুন Script সেটা ধরে।
      </span>,
      <span key="4">
        <strong>sudo নিয়ম আর setuid তালিকা:</strong> deploy এর জন্য একটা নিয়ম লিখুন যা
        Password ছাড়া শুধু <code>systemctl restart my-tours-api</code> আর{" "}
        <code>systemctl status my-tours-api</code> চালাতে দেয়, visudo দিয়ে পরীক্ষা করে।
        তারপর নিজের Server এর সব setuid File এর তালিকা বানান, আর প্রতিটার পাশে এক লাইনে
        লিখুন এটা কেন setuid হতে হয়।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন নতুন সদস্য লিখেছেন, App
        এর Log এ EACCES আসছে, আমি uploads Folder টা chmod 777 করে দিলাম, এখন কাজ করছে।
        তাঁকে বোঝান কেন এটা বিপজ্জনক, পাঁচ প্রশ্নে কীভাবে আসল কারণটা খুঁজতেন, আর এই
        ক্ষেত্রে ঠিক সমাধানটা কোন একটা Command হতো।
      </span>,
    ],
    deliverables: [
      <span key="1">my-tours এর মালিক, Group আর Mode এর ছক, প্রতিটা সারির কারণ সহ</span>,
      <span key="2">নকশা বসানোর Command গুলো আর আটটা পরীক্ষার Output</span>,
      <span key="3">check-perms.sh, আর একটা ধরা পড়া ভুলের Output</span>,
      <span key="4">sudoers.d এর File, visudo -c এর Output, আর setuid এর তালিকা ব্যাখ্যা সহ</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
