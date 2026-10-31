/**
 * What: Module 07 Lesson 03, SSH and Security Keys. It teaches what SSH does, how SSH trusts a
 * server (host keys, known_hosts, trust on first use), why keys beat passwords and how a key
 * login works, making and protecting a key, getting it onto a server, the first hour on a new
 * VPS with sshd hardening, the Ubuntu 24.04 socket, reading login attempts, the ~/.ssh/config
 * file, copying files and tunnels, and what to do with keys beyond one server.
 *
 * Why: Every later lesson starts with "log in to the server". This lesson makes that login
 * safe and understood, with real output captured from two Ubuntu 24.04 practice machines (a
 * laptop and a server), so the reader sees exactly what each command prints.
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
  ConnectStepLab,
  KeyPermissionLab,
  LockoutLab,
} from "../../../components/course/topics/linux/ssh-animations";
import {
  ConfigOrderDiagram,
  HostKeyTrustSplit,
  KeyFilesDiagram,
  KeyLoginDiagram,
  SshOverviewDiagram,
  TunnelDiagram,
} from "../../../components/course/topics/linux/ssh-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const linkClass = "text-primary underline underline-offset-4";

export const sshSecurityKeysContent: TopicData = {
  id: "ssh-security-keys",
  introduction: {
    badge: "MODULE 07 · LESSON 03",
    title: <SectionTitle>দূরের একটা যন্ত্রের চাবি, যা আপনার পকেট ছাড়ে না</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Island Tours এর জন্য নতুন একটা VPS কেনা হলো। Provider এর ইমেইলে লেখা এলো তিনটা জিনিস:
          ঠিকানা 103.94.135.2, User root, আর বলা হলো SSH দিয়ে ঢুকুন। Server টা এখন
          Internet এ, পৃথিবীর যে কেউ তার Port 22 এ টোকা দিতে পারে। আর সত্যিই দেয়। নতুন
          একটা Server চালু হওয়ার অনেক সময় কয়েক মিনিটের মধ্যেই তার Log এ অচেনা ঠিকানা থেকে
          admin, test, ubuntu নামে Login এর চেষ্টা দেখা যায়। এগুলো কোনো মানুষ নয়, সারা দিন
          Internet ঘুরে বেড়ানো Program, যারা লাখ লাখ Password অনুমান করে দেখে।
        </ContentParagraph>
        <ContentParagraph>
          আগের দুই লেসনে আপনি Server এর ভেতরে ঘুরে দেখেছেন, Folder আর Process চিনেছেন। কিন্তু
          একটা প্রশ্ন এড়িয়ে যাওয়া হয়েছিল: আপনি ওই দূরের যন্ত্রের ভেতরে ঢুকছেন কীভাবে, আর
          অন্য কেউ যেন না ঢুকতে পারে, সেটা নিশ্চিত হচ্ছে কীভাবে? এই লেসন সেই দরজা নিয়ে। দরজার
          নাম SSH।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন SSH আসলে কী কী কাজ করে, প্রথমবার Connect করলে যে
          Fingerprint এর প্রশ্নটা আসে তার মানে কী, Password এর বদলে Key কেন আর Key দিয়ে Login
          ভেতরে ভেতরে কীভাবে হয়, নিজের Key বানানো আর তাকে নিরাপদ রাখা, Key টা Server এ বসানোর
          তিনটা উপায়, নতুন VPS এর প্রথম এক ঘণ্টায় কী কী করতে হয় আর কোন ক্রমে, যাতে নিজেকে বাইরে
          আটকে না ফেলেন, Server এ কারা টোকা দিচ্ছে সেটা পড়া, ~/.ssh/config দিয়ে কাজ সহজ করা,
          ফাইল পাঠানো, আর বন্ধ Port এর Database এ নিরাপদে পৌঁছানোর সুড়ঙ্গ। এই লেসনের প্রতিটা
          Output একটা আসল Ubuntu 24.04 Server থেকে নেওয়া।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "বাড়ির চাবির কপি বানিয়ে দশজনকে দিলে কে কখন ঢুকছে আর জানা যায় না। SSH এর Key এর বেলায় চাবিটা থাকে শুধু আপনার কাছে, দরজায় লাগানো থাকে একটা তালা, যেটা শুধু সেই চাবিতেই খোলে। তালার কপি যত খুশি বিলান, চাবিটা কখনো পকেট থেকে বের করবেন না।",
      author: "SSH",
      role: "Lesson 03",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>SSH, দূরের যন্ত্রের Terminal নিজের Laptop এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা VPS এর কোনো পর্দা নেই, কোনো Keyboard নেই। সেটা একটা Data Center এর তাকে
                বসানো একটা যন্ত্রের ভেতরের একটা ভাগ, হাজার কিলোমিটার দূরে। তাকে কাজ করাতে হলে
                আপনার দরকার এমন একটা ব্যবস্থা, যাতে আপনার Laptop এর Terminal এ যা লিখবেন, সেটা
                দূরের ওই যন্ত্রে চলবে, আর ফলাফল ফিরে আসবে আপনার পর্দায়। মনে হবে আপনি Server এর
                সামনেই বসে আছেন।
              </ContentParagraph>
              <ContentParagraph>
                এই ব্যবস্থার নাম SSH, পুরো নাম Secure Shell। এর দুইটা অংশ। আপনার Laptop এ চলে
                একটা Client, যার নাম <code>ssh</code>। Server এ সারাক্ষণ চলে একটা Server
                Program, যার নাম <code>sshd</code>, শেষের d মানে Daemon, অর্থাৎ পেছনে চুপচাপ চলতে
                থাকা একটা Process (লেসন ০২)। sshd সাধারণত TCP Port 22 এ শোনে। আপনি যখন লেখেন{" "}
                <code>ssh deploy@103.94.135.2</code>, Laptop এর ssh সেই Port এ একটা TCP Connection
                খোলে, ঠিক Module 05 এর Three-way Handshake দিয়ে, তারপর দুই পাশ নিজেদের মধ্যে কথা
                শুরু করে।
              </ContentParagraph>
              <ContentParagraph>
                SSH আসার আগে এই কাজ হতো Telnet দিয়ে। Telnet ও দূরের Terminal দিত, কিন্তু সব কথা
                যেত খোলা, Module 06 এর সেই খোলা পোস্টকার্ডের মতো। আপনার Password পর্যন্ত পথের যে
                কেউ পড়তে পারত। SSH তিনটা কাজ একসাথে করে, আর পুরো লেসনটা আসলে এই তিনটা কাজ বোঝা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কথা গোপন রাখা।</strong> Connection খোলার পরপরই দুই পাশ একটা Key
                  Exchange করে একটা গোপন চাবি বানায়, Module 06 এর HTTPS এর মতোই। এরপর আপনার প্রতিটা
                  অক্ষর আর Server এর প্রতিটা Output তালাবন্ধ হয়ে যায়।
                </ListItem>
                <ListItem>
                  <strong>Server কে চেনা।</strong> আপনি যে যন্ত্রের সাথে কথা বলছেন, সেটা সত্যিই
                  আপনার Server, মাঝখানের কোনো প্রতারক নয়। এর জন্য আছে Host Key, পরের দুই অংশে।
                </ListItem>
                <ListItem>
                  <strong>আপনাকে চেনা।</strong> Server জানতে চায় আপনি কে, আর আপনাকে ঢুকতে দেওয়া
                  হবে কি না। এর জন্য Password বা Key, অংশ ০০৪ থেকে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SshOverviewDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের Output কোথা থেকে, আর আপনি কোথায় অনুশীলন করবেন",
          content: (
            <div className="space-y-3">
              <p>
                এই লেসনের Output গুলো দুইটা আসল Ubuntu 24.04 যন্ত্র থেকে নেওয়া: একটার নাম
                laptop, একটার নাম island-vps-01। যে একটা Block নমুনা, তার নামের পাশে নমুনা লেখা। শুধু দুইটা ঠিকানা বদলানো হয়েছে, যাতে গল্পটা
                মেলে: Server এর ভেতরের ঠিকানার জায়গায় Island Tours এর 103.94.135.2, আর Laptop এর
                ঠিকানার জায়গায় পর্যটকের বাসার Public IP 203.0.113.25 (Module 05)। Login এর পরে
                Ubuntu যে লম্বা স্বাগত বার্তা দেখায়, সেটা ছেঁটে ফেলা হয়েছে।
              </p>
              <p>
                অনুশীলনের জন্য আপনার দুইটা যন্ত্র লাগবে, একটা Laptop আর একটা Server। Server টা
                হতে পারে একটা আসল VPS, নিজের Laptop এর ভেতরের একটা Virtual Machine, বা Docker এর
                দুইটা Container, তিনটা উপায়ই{" "}
                <Link href="/devops/topic/linux-filesystem" className={linkClass}>
                  লেসন ০১
                </Link>{" "}
                এ দেখানো আছে। একদম শেষের Lab এ Docker দিয়ে দুইটা যন্ত্র বানানোর পুরো Script
                দেওয়া আছে, সেখানে এই লেসনের প্রতিটা ধাপ নিজে করে দেখতে পারবেন। আর একটা নতুন VPS
                কেনা থেকে শুরু করে তার ওপর App চালু করা পর্যন্ত পুরো কাজটা ধাপে ধাপে আছে{" "}
                <Link href="/devops/topic/vps-setup" className={linkClass}>
                  লেসন ১১, VPS Setup
                </Link>{" "}
                এ। সেখানে SSH এর অংশটা এই লেসনকেই ধাপ হিসেবে চালায়।
              </p>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "host-key",
      subHeader: { index: "002", title: "Host Key" },
      title: <SectionTitle>প্রথম দেখা: Server এর পরিচয়পত্র মিলিয়ে নেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 06 এ দেখেছেন, Browser একটা অচেনা Website কে বিশ্বাস করে কারণ একটা CA সেই
                Website এর Certificate এ সই করে জামিন দিয়েছে। SSH এ কোনো CA নেই। তাহলে আপনার
                Laptop কীভাবে জানবে যে 103.94.135.2 এ যে উত্তর দিচ্ছে, সেটা সত্যিই Island Tours এর
                Server, ক্যাফের Wi-Fi এ বসে থাকা কোনো প্রতারক নয়?
              </ContentParagraph>
              <ContentParagraph>
                উত্তর হলো Host Key। প্রতিটা SSH Server প্রথমবার চালু হওয়ার সময় নিজের জন্য একটা
                Key Pair বানায়, Module 06 এর Lesson 08 এর সেই Private Key আর Public Key এর জোড়া।
                এগুলো থাকে <code>/etc/ssh/</code> Folder এ, নাম{" "}
                <code>ssh_host_ed25519_key</code> (Private, শুধু root পড়তে পারে) আর{" "}
                <code>ssh_host_ed25519_key.pub</code> (Public)। প্রতিটা Connection এ Server তার
                Public Host Key দেখায় আর Private টা দিয়ে একটা সই করে প্রমাণ দেয় যে সেই Key তার
                নিজের। Key টা লম্বা, তাই মানুষের মেলানোর সুবিধার জন্য তাকে ছোট করে একটা
                Fingerprint বানানো হয়, একটা SHA256 Hash।
              </ContentParagraph>
              <ContentParagraph>
                প্রথমবার Connect করলে আপনার Laptop এই Fingerprint আগে কখনো দেখেনি, আর জামিন দেওয়ার
                কেউ নেই। তাই ssh থেমে আপনাকে জিজ্ঞেস করে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "first-connection.txt",
          code: `you@laptop:~$ ssh root@103.94.135.2
The authenticity of host '103.94.135.2 (103.94.135.2)' can't be established.
ED25519 key fingerprint is SHA256:h09SOc4FQw2H5l3y0VyxfLEuljJ+lmhKtCghOw+Wo6I.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '103.94.135.2' (ED25519) to the list of known hosts.
# এরপর আপনাকে চেনার পালা, সেটা অংশ ০০৪ এ`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা লাইন পড়ি। প্রথম লাইন বলছে এই Server কে চেনা যাচ্ছে না। দ্বিতীয় লাইনে Server
                যে Host Key দেখাল তার Fingerprint। তৃতীয় লাইন বলছে অন্য কোনো নামেও এই Key আগে
                দেখা হয়নি। চতুর্থ লাইনে প্রশ্ন। এখানে বেশিরভাগ মানুষ চোখ বন্ধ করে yes লেখেন, আর
                ঠিক এখানেই নিরাপত্তার পুরো ভিত্তিটা দাঁড়ায় বা ভাঙে। কারণ এই yes মানে আপনি নিজে জামিন
                দিচ্ছেন: হ্যাঁ, এই Fingerprint টাই আমার Server এর।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে মিলিয়ে নেবেন কীভাবে? Server এর আসল Fingerprint এমন একটা পথে দেখতে হবে, যেটা
                এই SSH Connection এর ওপর নির্ভর করে না। প্রায় প্রতিটা VPS Provider এর Dashboard এ
                একটা Web Console থাকে, নাম আলাদা হতে পারে (Console, Browser Terminal, VNC), যেটা
                Browser এর ভেতরেই Server এর পর্দা খুলে দেয়। সেখানে ঢুকে এই Command চালান:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "real-fingerprint.txt",
          code: `root@island-vps-01:~# ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
256 SHA256:h09SOc4FQw2H5l3y0VyxfLEuljJ+lmhKtCghOw+Wo6I root@island-vps-01 (ED25519)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা Fingerprint হুবহু এক: <code>h09SOc4F...Wo6I</code>। এখন yes বলা নিরাপদ।
                অক্ষর ধরে ধরে পুরোটা মেলানো কঠিন লাগলে অন্তত শুরুর আর শেষের ছয় সাতটা অক্ষর মেলান,
                প্রতারকের পক্ষে দুই মাথা মেলানো একটা Key বানানো কার্যত অসম্ভব।
              </ContentParagraph>
              <ContentParagraph>
                yes বলার পর ssh এই Key টা আপনার Laptop এর <code>~/.ssh/known_hosts</code> ফাইলে লিখে
                রাখে। এটা আপনার চেনা Server দের খাতা। পরের প্রতিটা Connection এ ssh খাতা খুলে মিলিয়ে
                দেখে, আর মিললে আর কিছু জিজ্ঞেস করে না। এই পদ্ধতির নাম Trust On First Use, প্রথম
                দেখায় বিশ্বাস। দুর্বল জায়গা একটাই, সেই প্রথম দেখাটা, তাই সেখানেই সাবধান হওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HostKeyTrustSplit /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "known-hosts.txt",
          code: `you@laptop:~$ cat ~/.ssh/known_hosts
|1|MnwiveERvSK8ZN8CBFRtnxj9Tmk=|J5IkKEhS09lUl85zfZ2Neojjg48= ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJt6EnzBx+o++2q4GKSMbzB8MoGRkvS07WSRqwMoPgSD
# ... আরও দুইটা লাইন, একই Server এর RSA আর ECDSA Host Key

you@laptop:~$ ssh-keygen -F 103.94.135.2 | head -2
# Host 103.94.135.2 found: line 1
|1|MnwiveERvSK8ZN8CBFRtnxj9Tmk=|J5IkKEhS09lUl85zfZ2Neojjg48= ssh-ed25519 AAAAC3Nza...`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "লাইনের শুরুর |1| কী?",
          content: (
            <p>
              Ubuntu তে ssh নিজে থেকে Server এর নাম বা ঠিকানাটা Hash করে লেখে, তাই ফাইল খুলে বোঝা
              যায় না কোন লাইন কোন Server এর। কেউ আপনার Laptop এর ফাইল চুরি করলেও আপনি কোন কোন
              Server এ যান, সেই তালিকা পাবে না। macOS এ সাধারণত Hash ছাড়াই লেখা থাকে, ঠিকানাটা
              সরাসরি পড়া যায়। দুই ক্ষেত্রেই নির্দিষ্ট Server খুঁজতে <code>ssh-keygen -F ঠিকানা</code>{" "}
              আর মুছতে <code>ssh-keygen -R ঠিকানা</code> ব্যবহার করুন, হাতে ফাইল ঘাঁটার দরকার নেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "host-changed",
      subHeader: { index: "003", title: "Changed Host Key" },
      title: <SectionTitle>সবচেয়ে ভয়ের সতর্কবার্তা, আর তার সঠিক জবাব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কয়েক সপ্তাহ পরে একদিন Island Tours এর দল Server টা মুছে নতুন করে বানাল, একই ঠিকানা
              রেখে। পরদিন সকালে আপনি অভ্যাসমতো Connect করতে গেলেন, আর Terminal ভরে গেল এই লেখায়:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "host-key-changed.txt",
          code: `you@laptop:~$ ssh root@103.94.135.2
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ED25519 key sent by the remote host is
SHA256:p4jt9Yek7we0ykowBHjpV9cR5W8hw6/tSfvPxeHDB28.
Please contact your system administrator.
Add correct host key in /home/you/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /home/you/.ssh/known_hosts:3
  remove with:
  ssh-keygen -f '/home/you/.ssh/known_hosts' -R '103.94.135.2'
Host key for 103.94.135.2 has changed and you have requested strict checking.
Host key verification failed.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বার্তাটা নিজেই দুইটা সম্ভাবনার কথা বলছে। হয় মাঝখানে কেউ বসে আছে আর নিজের Key
                দেখাচ্ছে, নয়তো Server এর Host Key সত্যিই বদলেছে। ssh নিজে থেকে কোনোটা ধরে নেয় না,
                সোজা থেমে যায়। খেয়াল করুন, এই অবস্থায় আপনার Password বা Key এর সই কিছুই পাঠানো হয়নি,
                কারণ Server কে চেনার ধাপটা পার হওয়ার আগে আপনাকে চেনার ধাপ শুরুই হয় না।
              </ContentParagraph>
              <ContentParagraph>
                Host Key সত্যিই বদলায় এই কয়েকটা কারণে: Server মুছে নতুন করে বানানো (আমাদের গল্প),
                Provider একটা পুরনো ঠিকানা নতুন কারো Server কে দিয়েছে, আর আপনি সেই ঠিকানায়
                আগে অন্য Server এ যেতেন, অথবা কেউ জেনেবুঝে Host Key নতুন করে বানিয়েছে। তিনটা কারণই
                নিরীহ। কিন্তু প্রতারকের বেলায়ও স্ক্রিনে ঠিক এই লেখাই আসবে। তাই সঠিক জবাব সবসময়
                একই তিন ধাপ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কারণটা জানুন।</strong> দলের কেউ কি Server নতুন করে বানিয়েছে? Provider
                  কি কিছু জানিয়েছে? কারণ না জানলে থামুন।
                </ListItem>
                <ListItem>
                  <strong>নতুন Fingerprint অন্য পথে মিলিয়ে নিন।</strong> Provider এর Web Console এ
                  ঢুকে <code>ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub</code> চালান। সেখানে
                  যদি <code>p4jt9Yek...DB28</code> আসে, তাহলে উপরের বার্তায় যেটা দেখাচ্ছে সেটাই সত্যি।
                </ListItem>
                <ListItem>
                  <strong>মিললে তবেই পুরনো লাইন মুছুন</strong>, আর আবার Connect করে নতুন Key টা
                  গ্রহণ করুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "remove-old-host-key.txt",
          code: `you@laptop:~$ ssh-keygen -R 103.94.135.2
# Host 103.94.135.2 found: line 1
# Host 103.94.135.2 found: line 2
# Host 103.94.135.2 found: line 3
/home/you/.ssh/known_hosts updated.
Original contents retained as /home/you/.ssh/known_hosts.old

you@laptop:~$ ssh root@103.94.135.2
# আবার সেই প্রথম দেখার প্রশ্ন আসবে, এবার নতুন Fingerprint p4jt9Yek...DB28 মিলিয়ে yes`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "যে অভ্যাসটা কখনো করবেন না",
          content: (
            <p>
              Internet এ এই সতর্কবার্তার সমাধান হিসেবে প্রায়ই দেখবেন{" "}
              <code>StrictHostKeyChecking no</code> লিখে দিতে, বা <code>known_hosts</code> ফাইলটা
              পুরো মুছে দিতে। দুইটাই আপনার Laptop এর ধোঁয়ার Alarm খুলে ফেলার মতো: আগুন লাগলে আর
              কেউ জানাবে না। প্রতারক মাঝে বসলে ssh চুপচাপ তার Key গ্রহণ করবে, আর আপনি সেই
              Connection এ sudo র Password টাও লিখে ফেলবেন। একটা নির্দিষ্ট Server এর জন্য
              ssh-keygen -R ছাড়া আর কিছু দরকার নেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "password-vs-key",
      subHeader: { index: "004", title: "Password vs Key" },
      title: <SectionTitle>আপনাকে চেনা: Password হারে কেন, Key জেতে কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Server কে চেনা হলো, এবার Server এর পালা আপনাকে চেনার। সবচেয়ে পরিচিত উপায় Password।
                সমস্যা হলো, Password মানে এমন একটা গোপন কথা যা প্রতিবার আপনি Server কে বলে দেন।
                Server সেটা মিলিয়ে দেখে। আর যে কেউ, যতবার খুশি, একটা অনুমান পাঠিয়ে দেখতে পারে মেলে
                কি না। Internet এর Bot রা ঠিক এটাই করে, দিনরাত।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Log টা Practice Server এ ইচ্ছা করে বানানো: deploy নামে তিনবার ভুল Password,
                আর একবার admin নামে, যে নামে কোনো User ই নেই। আসল VPS এ ঠিক এই চেহারার লাইন আসবে,
                শুধু ঠিকানাগুলো হবে সারা পৃথিবীর অচেনা IP, আর সংখ্যায় দিনে শত শত, কখনো হাজার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "auth-log-password-attempts.txt",
          code: `deploy@island-vps-01:~$ sudo grep -E "Failed password|Invalid user|Connection closed" /var/log/auth.log | tail -n 6
2026-10-31T07:28:02.842807+00:00 island-vps-01 sshd[700]: Failed password for deploy from 203.0.113.25 port 57864 ssh2
2026-10-31T07:28:07.439536+00:00 island-vps-01 sshd[700]: message repeated 2 times: [ Failed password for deploy from 203.0.113.25 port 57864 ssh2]
2026-10-31T07:28:08.149521+00:00 island-vps-01 sshd[700]: Connection closed by authenticating user deploy 203.0.113.25 port 57864 [preauth]
2026-10-31T07:28:08.711865+00:00 island-vps-01 sshd[702]: Invalid user admin from 203.0.113.25 port 52720
2026-10-31T07:28:10.204228+00:00 island-vps-01 sshd[702]: Failed password for invalid user admin from 203.0.113.25 port 52720 ssh2
2026-10-31T07:28:10.921772+00:00 island-vps-01 sshd[702]: Connection closed by invalid user admin 203.0.113.25 port 52720 [preauth]`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Key এর পদ্ধতি। আপনার Laptop এ থাকে একটা Key Pair। Public অংশটা আপনি আগে থেকে
                Server এর একটা ফাইলে রেখে আসেন, যার নাম <code>authorized_keys</code>, মানে যাদের
                ঢুকতে দেওয়া হবে তাদের তালিকা। Login এর সময় Server আপনার কাছে কোনো গোপন কথা চায়
                না। চায় একটা প্রমাণ: এই Connection এর নিজস্ব কিছু তথ্যে আপনার Private Key দিয়ে সই
                করে দেখান। Server সেই সই আপনার Public Key দিয়ে যাচাই করে। Module 06 Lesson 08 এর
                সেই Sign আর Verify, এবার আপনাকে চেনার কাজে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <KeyLoginDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ssh কে <code>-v</code> দিলে সে প্রতিটা ধাপ বলে বলে চলে। পুরো Output অনেক লম্বা, নিচে
              শুধু দরকারি লাইনগুলো, পরপর:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ssh-verbose.txt",
          code: `you@laptop:~$ ssh -v deploy@103.94.135.2 true 2>&1 | grep -E "Connecting|established|protocol version|kex: algorithm|Server host key|is known|can continue|Offering|accepts|Authenticated"
debug1: Connecting to 103.94.135.2 [103.94.135.2] port 22.
debug1: Connection established.
debug1: Remote protocol version 2.0, remote software version OpenSSH_9.6p1 Ubuntu-3ubuntu13.20
debug1: kex: algorithm: sntrup761x25519-sha512@openssh.com
debug1: Server host key: ssh-ed25519 SHA256:p4jt9Yek7we0ykowBHjpV9cR5W8hw6/tSfvPxeHDB28
debug1: Host '103.94.135.2' is known and matches the ED25519 host key.
debug1: Authentications that can continue: publickey
debug1: Offering public key: /home/you/.ssh/id_ed25519 ED25519 SHA256:iTjwJb0lpsxfvJRCHL+EDEoE2qh6Ufousi4wkT3ZvJg explicit agent
debug1: Server accepts key: /home/you/.ssh/id_ed25519 ED25519 SHA256:iTjwJb0lpsxfvJRCHL+EDEoE2qh6Ufousi4wkT3ZvJg explicit agent
Authenticated to 103.94.135.2 ([103.94.135.2]:22) using "publickey".`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম দুই লাইন TCP। তৃতীয় লাইনে দুই পাশের Version। চতুর্থ লাইনে Key Exchange এর
                Algorithm, <code>sntrup761x25519</code>: Module 06 এ যে X25519 দেখেছিলেন তার সাথে
                ভবিষ্যতের Quantum কম্পিউটারের বিরুদ্ধে টেকসই আরেকটা পদ্ধতি জোড়া দেওয়া, ঠিক
                HTTPS এর X25519MLKEM768 এর মতো চিন্তা। পরের দুই লাইনে Server এর Host Key আর
                known_hosts এর সাথে মিলে যাওয়া। তারপর Server বলছে কোন কোন পদ্ধতিতে ঢোকা যাবে, এখানে
                শুধু publickey। শেষ তিন লাইনে Key দেখানো, Server এর রাজি হওয়া, আর সই যাচাইয়ের পরে
                ঢুকে পড়া।
              </ContentParagraph>
              <ContentParagraph>
                দুই পদ্ধতির তফাতটা এক লাইনে: Password এ গোপন জিনিসটা প্রতিবার Server এর কাছে যায়,
                Key এ গোপন জিনিসটা কখনো আপনার যন্ত্র ছাড়ে না। এর ফলে আরও তিনটা সুবিধা আসে। Bot রা
                অনুমান করার কিছু পায় না, কারণ একটা Ed25519 Key অনুমান করে মেলানো কার্যত অসম্ভব।
                একটা Key কয়েকটা Server এ রাখলেও কোনো একটা Server চুরি হলে চোর পায় শুধু Public Key,
                যা দিয়ে কোথাও ঢোকা যায় না। আর একজন সহকর্মী দল ছাড়লে শুধু তার Public Key এর লাইনটা
                মুছলেই হয়, বাকি সবার Password বদলাতে হয় না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "make-key",
      subHeader: { index: "005", title: "Make a Key" },
      title: <SectionTitle>নিজের Key Pair বানানো, ssh-keygen দিয়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Key বানানো হয় আপনার নিজের Laptop এ, কখনো Server এ নয়, কারণ Private Key টা যেখানে
                জন্মায় সেখানেই থাকার কথা। macOS, Linux আর Windows 10 এর পরের সব Windows এ ssh আর
                ssh-keygen আগে থেকেই থাকে, Windows এ PowerShell খুললেই চলে। Command একটাই:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ssh-keygen.txt",
          code: `you@laptop:~$ ssh-keygen -t ed25519 -C "you@laptop"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/you/.ssh/id_ed25519):
Created directory '/home/you/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/you/.ssh/id_ed25519
Your public key has been saved in /home/you/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:iTjwJb0lpsxfvJRCHL+EDEoE2qh6Ufousi4wkT3ZvJg you@laptop
The key's randomart image is:
+--[ED25519 256]--+
|.oo . .          |
|.+ . = +         |
|oo++o X +        |
|+ +BoB B +       |
|..o+B.+ S        |
|+ Eo.o + .       |
|o.. . . .        |
|o...             |
|++ ..            |
+----[SHA256]-----+`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা অংশের মানে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>-t ed25519</code> মানে Key এর ধরন। Ed25519 আজকের Default পছন্দ: ছোট, দ্রুত,
                  আর নিরাপদ। খুব পুরনো কোনো যন্ত্র Ed25519 না বুঝলে তখন{" "}
                  <code>-t rsa -b 4096</code> দিয়ে একটা RSA Key বানাবেন, তার আগে নয়।
                </ListItem>
                <ListItem>
                  <code>-C</code> এর পরের লেখাটা একটা মন্তব্য, Key এর গায়ে লাগানো নামফলক। এটা
                  Public Key এর শেষে লেখা থাকে, তাই পরে Server এর authorized_keys খুলে বোঝা যায় কোন
                  লাইনটা কার কোন যন্ত্রের। ইমেইল না দিয়ে মানুষ আর যন্ত্রের নাম দেওয়াই কাজের, যেমন
                  you@laptop বা you@office-pc।
                </ListItem>
                <ListItem>
                  ফাইলের নাম জিজ্ঞেস করলে Enter চাপলেই Default নাম <code>~/.ssh/id_ed25519</code>{" "}
                  নেয়। এই নামে থাকলে ssh নিজেই খুঁজে পায়।
                </ListItem>
                <ListItem>
                  Passphrase হলো Private Key ফাইলটার নিজের তালা, পরের অংশে বিস্তারিত। দুইবার
                  চাইবে, লেখার সময় পর্দায় কিছু দেখা যাবে না, এটাই স্বাভাবিক।
                </ListItem>
                <ListItem>
                  Fingerprint টা এই Key এর ছোট পরিচয়, ঠিক Host Key এর মতো। পরে Server এর Log এ যখন
                  দেখবেন কে ঢুকল, সেখানে এই Fingerprint ই লেখা থাকবে।
                </ListItem>
                <ListItem>
                  Randomart এর ছবিটা একই Fingerprint কে চোখে দেখার মতো করে আঁকা। কাজের দিক থেকে এর
                  কোনো ভূমিকা নেই, উপেক্ষা করতে পারেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "key-files.txt",
          code: `you@laptop:~$ ls -la ~/.ssh
total 16
drwx------ 2 you you 4096 Oct 31 07:25 .
drwxr-x--- 3 you you 4096 Oct 31 07:25 ..
-rw------- 1 you you  444 Oct 31 07:25 id_ed25519
-rw-r--r-- 1 you you   92 Oct 31 07:25 id_ed25519.pub

you@laptop:~$ cat ~/.ssh/id_ed25519.pub
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJxpVDlIygXvdewOpZ33nWh4lZTe5gMm/UUfGIR+6f+Y you@laptop`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা ফাইল তৈরি হলো। <code>id_ed25519</code> হলো Private Key, Permission{" "}
                <code>-rw-------</code>, মানে শুধু আপনি পড়তে আর লিখতে পারেন। এর ভেতরটা এই লেসনে
                ইচ্ছা করে দেখানো হয়নি, আর আপনিও কখনো কাউকে দেখাবেন না, কোনো Chat এ, কোনো Ticket এ,
                কোনো Screenshot এ। <code>id_ed25519.pub</code> হলো Public Key, এক লাইনের ফাইল, তিনটা
                অংশ: ধরন (<code>ssh-ed25519</code>), Key নিজে (লম্বা লেখাটা), আর আপনার মন্তব্য। এটা
                দেখানো একদম নিরাপদ, উপরে যেমন দেখানো হলো।
              </ContentParagraph>
              <ContentParagraph>
                একটা নিয়ম শুরু থেকেই মেনে চলুন: প্রতিটা যন্ত্রের জন্য আলাদা Key। Laptop এর জন্য
                একটা, অফিসের Desktop এর জন্য আরেকটা। একটা Private Key এক যন্ত্র থেকে আরেক যন্ত্রে
                কপি করবেন না। তাহলে কোনো একটা যন্ত্র হারালে শুধু সেই যন্ত্রের Key টা বাতিল করলেই চলে,
                বাকিগুলো যেমন ছিল তেমনই কাজ করে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "passphrase-agent",
      subHeader: { index: "006", title: "Passphrase and Agent" },
      title: <SectionTitle>Key এর নিজের তালা, আর বারবার না লেখার উপায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরুন আপনার Laptop চুরি হলো, বা কেউ একটা ক্ষতিকর Package এর মাধ্যমে আপনার Home Folder
                এর ফাইল কপি করে নিল। Private Key ফাইলটা তার হাতে চলে গেল। Passphrase না থাকলে সেই
                ফাইল দিয়েই সে আপনার প্রতিটা Server এ ঢুকে পড়বে। Passphrase থাকলে ফাইলটা নিজেই
                তালাবন্ধ, সেটা খুলতে Passphrase লাগবে, আর এতে আপনি সময় পান সব Server থেকে Key টা
                বাতিল করার। তাই Passphrase দিন, আর এমন কিছু দিন যা মনে রাখতে পারবেন, যেমন চার পাঁচটা
                অসংলগ্ন শব্দ পাশাপাশি।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু প্রতিবার ssh চালানোর সময় Passphrase লেখা বিরক্তিকর, আর বিরক্তিকর নিয়ম মানুষ
                এড়িয়ে চলে। সমাধানের নাম ssh-agent। এটা একটা ছোট Process, যা আপনার Login থাকা পর্যন্ত
                চলে। আপনি একবার Passphrase দিয়ে Key টা তার হাতে দেন, সে খোলা Key টা নিজের Memory তে
                রাখে, আর এরপর প্রতিটা ssh সই করানোর জন্য তার কাছেই যায়। ফাইলটা Disk এ তালাবন্ধই
                থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ssh-agent.txt",
          code: `# Linux এ সাধারণত Login এর সাথেই একটা Agent চালু থাকে। না থাকলে এই Terminal এর জন্য একটা:
you@laptop:~$ eval "$(ssh-agent -s)"
Agent pid 1187

you@laptop:~$ ssh-add ~/.ssh/id_ed25519
Enter passphrase for /home/you/.ssh/id_ed25519:
Identity added: /home/you/.ssh/id_ed25519 (you@laptop)

you@laptop:~$ ssh-add -l
256 SHA256:iTjwJb0lpsxfvJRCHL+EDEoE2qh6Ufousi4wkT3ZvJg you@laptop (ED25519)

# এখন থেকে এই Login এ ssh আর Passphrase চাইবে না
you@laptop:~$ ssh deploy@103.94.135.2 'whoami'
deploy`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা অপারেটিং সিস্টেমে Agent কে আরেকটু আরামদায়ক করার নিজস্ব উপায় আছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>macOS:</strong> Passphrase টা Keychain এ রেখে দেওয়া যায়, তাহলে Restart এর
                  পরেও আর চাইবে না। একবার চালান{" "}
                  <code>ssh-add --apple-use-keychain ~/.ssh/id_ed25519</code>, আর{" "}
                  <code>~/.ssh/config</code> এ সবার উপরে লিখুন <code>Host *</code>, তার নিচে{" "}
                  <code>AddKeysToAgent yes</code> আর <code>UseKeychain yes</code>। GitHub এর নথিতে
                  এই একই Setting দেওয়া আছে।
                </ListItem>
                <ListItem>
                  <strong>Windows:</strong> OpenSSH Authentication Agent নামে একটা Windows Service
                  আছে, প্রথমবার সেটা চালু করে Automatic করে দিলে ssh-add কাজ করে।
                </ListItem>
                <ListItem>
                  <strong>Linux Desktop:</strong> বেশিরভাগ Desktop এ Login এর সাথে একটা Agent নিজে
                  থেকেই চলে। <code>ssh-add -l</code> চালিয়ে দেখুন, The agent has no identities
                  এলে Agent আছে, শুধু Key দেওয়া হয়নি।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ssh -A, Agent Forwarding: সুবিধা যত, ঝুঁকিও তত",
          content: (
            <p>
              <code>ssh -A</code> দিলে আপনার Laptop এর Agent এর দরজাটা Server এর ভেতরেও খুলে যায়,
              যাতে Server থেকে আরেক জায়গায় (যেমন GitHub এ) আপনার Key দিয়ে যাওয়া যায়। কিন্তু সেই
              সময়ে ওই Server এর root যে কেউ আপনার Agent দিয়ে সই করিয়ে নিতে পারে, আপনার প্রতিটা
              Server এ ঢুকতে পারে। নিজের পুরোপুরি বিশ্বাসের Server ছাড়া এটা চালু করবেন না। Server
              থেকে GitHub এ যাওয়ার নিরাপদ উপায় Deploy Key, অংশ ০১৪ তে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "permissions",
      subHeader: { index: "007", title: "File Permissions" },
      title: <SectionTitle>Key ফাইলের Permission: ssh নিজেই পাহারাদার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SSH খুব খুঁতখুঁতে, আর সেটা ইচ্ছা করেই। কোনো Key ফাইল যদি অন্যরা পড়তে বা বদলাতে পারে,
                তাহলে ssh বা sshd সেটা ব্যবহারই করতে রাজি হয় না। Permission এর সংখ্যাগুলোর পুরো অর্থ
                পরের লেসনে, এখানে শুধু কোন ফাইলে কোন মান, আর ভুল হলে কী দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ফাইল বা Folder", "কোথায়", "মান", "কেন"],
          rows: [
            [<code key="1">~/.ssh/</code>, "Laptop আর Server দুই জায়গায়", <code key="2">700</code>, "শুধু মালিক ভেতরে ঢুকতে আর লিখতে পারেন"],
            [<code key="3">~/.ssh/id_ed25519</code>, "Laptop", <code key="4">600</code>, "Private Key, অন্য কেউ পড়তে পারলেই সব শেষ"],
            [<code key="5">~/.ssh/id_ed25519.pub</code>, "Laptop", <code key="6">644</code>, "Public, পড়লে কোনো ক্ষতি নেই"],
            [<code key="7">~/.ssh/authorized_keys</code>, "Server", <code key="8">600</code>, "কেউ লিখতে পারলে নিজের Key ঢুকিয়ে দিত"],
            [<code key="9">~/.ssh/config</code>, "Laptop", <code key="10">600</code>, "আপনার Server দের তালিকা, অন্যের জানার দরকার নেই"],
            [<code key="11">/home/deploy</code>, "Server", <code key="12">750</code>, "অন্যরা লিখতে পারলে .ssh টাই বদলে দিত"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Laptop এ Private Key এর Permission ভুল হলে ssh নিজেই চিৎকার করে, আর Key টা ফেলে দেয়:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "unprotected-private-key.txt",
          code: `you@laptop:~$ chmod 644 ~/.ssh/id_ed25519
# Agent ছাড়া চালানো, যাতে ssh ফাইলটাই খোলে
you@laptop:~$ SSH_AUTH_SOCK= ssh -i ~/.ssh/id_ed25519 -o IdentitiesOnly=yes deploy@103.94.135.2
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for '/home/you/.ssh/id_ed25519' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "/home/you/.ssh/id_ed25519": bad permissions
deploy@103.94.135.2: Permission denied (publickey).

you@laptop:~$ chmod 600 ~/.ssh/id_ed25519      # সারানো`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Server এর দিকে ভুল হলে ঘটনাটা আরও বিভ্রান্তিকর, কারণ আপনার Terminal এ আসল কারণটা
                কখনো আসে না। sshd নিরাপত্তার খাতিরে বাইরের কাউকে বলে না কেন ঢুকতে দিল না। আপনি দেখেন
                শুধু Permission denied, আর আসল কারণ লেখা থাকে Server এর Log এ। deploy এর
                authorized_keys এ সবাই লিখতে পারলে (Mode 666) Log এ এই লাইন আসে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "strict-modes-log.txt",
          code: `deploy@island-vps-01:~$ sudo grep "Authentication refused" /var/log/auth.log | tail -n 2
2026-10-31T07:29:43.033636+00:00 island-vps-01 sshd[876]: Authentication refused: bad ownership or modes for file /home/deploy/.ssh/authorized_keys
2026-10-31T07:29:43.735050+00:00 island-vps-01 sshd[891]: Authentication refused: bad ownership or modes for directory /home/deploy`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ চারটা জায়গার Permission নিজে বদলে দেখুন কোনটায় Login আটকায়, আর কে কোথায়
              কী লেখে। একটা জিনিস খেয়াল করবেন: অন্যরা শুধু পড়তে পারলে (644, 755) sshd আটকায় না, আটকায়
              অন্যরা লিখতে পারলে। তবুও প্রস্তাবিত মানগুলোই রাখুন, যার যতটুকু দরকার তার বেশি কাউকে
              দেবেন না।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <KeyPermissionLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "install-key",
      subHeader: { index: "008", title: "Install the Key" },
      title: <SectionTitle>Public Key টা Server এ বসানোর তিনটা উপায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Key দিয়ে ঢুকতে হলে আপনার Public Key এর লাইনটা Server এ সেই User এর{" "}
                <code>~/.ssh/authorized_keys</code> ফাইলে থাকতে হবে, যে User হিসেবে ঢুকবেন। ফাইলটা
                সাধারণ লেখা: প্রতি লাইনে একটা Public Key, ঠিক আপনার .pub ফাইলের মতো। লাইনটা পৌঁছানোর
                তিনটা উপায় আছে, পরিস্থিতি অনুযায়ী বেছে নেবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>VPS বানানোর সময়, Provider এর Dashboard এ।</strong> সবচেয়ে ভালো উপায়।
                  প্রায় প্রতিটা Provider Server বানানোর পাতায় SSH Key যোগ করার জায়গা রাখে। সেখানে
                  আপনার .pub ফাইলের পুরো লাইনটা Paste করেন, আর Provider সেটা নতুন Server এর root এর
                  authorized_keys এ বসিয়ে দেয়। এতে Server জন্ম থেকেই Password ছাড়া Key দিয়ে চলে।
                  এই পথটা ধাপে ধাপে আছে{" "}
                  <Link href="/devops/topic/vps-setup" className={linkClass}>
                    লেসন ১১
                  </Link>{" "}
                  এ।
                </ListItem>
                <ListItem>
                  <strong>ssh-copy-id দিয়ে।</strong> Server এ আপনি অন্য কোনো উপায়ে ঢুকতে পারলে,
                  Password দিয়ে হোক বা আরেকটা Key দিয়ে, এই একটা Command নিজেই সব করে: Server এ ঢোকে,
                  .ssh Folder না থাকলে বানায়, Permission ঠিক করে, আর লাইনটা যোগ করে। আগে থেকে থাকা
                  Key দ্বিতীয়বার যোগ করে না।
                </ListItem>
                <ListItem>
                  <strong>হাতে, Console থেকে।</strong> Password Login বন্ধ, আর আপনার একমাত্র পথ
                  Provider এর Web Console, এমন অবস্থায়। Console এ ঢুকে ফাইলটা নিজে খুলে লাইনটা Paste
                  করেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Island Tours এ নতুন একটা অফিসের যন্ত্র যোগ হলো। সেই যন্ত্রের জন্য একটা নতুন Key
                বানানো হলো, আর Laptop এর পুরনো Key দিয়ে ঢুকে ssh-copy-id দিয়ে নতুনটা বসানো হলো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ssh-copy-id.txt",
          code: `you@laptop:~$ ssh-copy-id -i ~/.ssh/id_office.pub deploy@103.94.135.2
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/you/.ssh/id_office.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'deploy@103.94.135.2'"
and check to make sure that only the key(s) you wanted were added.

# Server এ এখন দুইটা লাইন, মন্তব্য দেখেই চেনা যায় কোনটা কোন যন্ত্রের
deploy@island-vps-01:~$ awk '{print $1, substr($2,1,24) "...", $3}' ~/.ssh/authorized_keys
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... you@laptop
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... you@office-pc`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Password দিয়ে প্রথমবার বসালে Output প্রায় একই, শুধু মাঝখানে একবার deploy এর Password
              চাইবে, আর সেটাই হবে ওই Server এ Password দিয়ে শেষ Login। হাতে বসানোর পথটা এরকম, Server
              এ সেই User হিসেবে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "install-key-by-hand.sh",
          code: `# Server এ, যে User হিসেবে ঢুকবেন সেই User হিসেবে (Console থেকে)
mkdir -p ~/.ssh && chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys          # আপনার .pub ফাইলের পুরো একটা লাইন Paste, Save
chmod 600 ~/.ssh/authorized_keys

# root হিসেবে অন্য User এর জন্য করলে, শেষে মালিকানা ঠিক করতে ভুলবেন না
chown -R deploy:deploy /home/deploy/.ssh`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <KeyFilesDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একটা লাইনের সামনে শর্ত বসানো যায়",
          content: (
            <p>
              authorized_keys এর একটা লাইনের সামনে কিছু শর্ত লেখা যায়, যেমন{" "}
              <code>from=&quot;203.0.113.0/24&quot;</code> মানে এই Key শুধু ওই ঠিকানাগুলো থেকে চলবে,
              আর <code>restrict</code> মানে এই Key দিয়ে Tunnel, Agent Forwarding এসব বন্ধ। একটা
              স্বয়ংক্রিয় যন্ত্রের Key, যেমন CI এর Deploy Key, এভাবে বেঁধে রাখলে সেটা চুরি হলেও
              ক্ষতির সীমা ছোট থাকে। বিস্তারিত তালিকা <code>man sshd</code> এর AUTHORIZED_KEYS FILE
              FORMAT অংশে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "first-hour-users",
      subHeader: { index: "009", title: "First Hour: Users" },
      title: <SectionTitle>নতুন VPS এর প্রথম ঘণ্টা, ভাগ ১: root থেকে deploy তে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নতুন VPS এ প্রথম Login হয় root হিসেবে, কারণ তখন আর কোনো User থাকে না। root মানে
                সব ক্ষমতা: একটা ভুল টাইপে পুরো Server মুছে ফেলা যায়, আর root এর Key চুরি গেলে চোরও
                পায় সব ক্ষমতা। তাই প্রথম ঘণ্টার কাজ হলো নিজের জন্য একটা সাধারণ User বানানো, তাকে
                দরকারমতো root এর ক্ষমতা ধার নেওয়ার অনুমতি দেওয়া, আর তারপর root এর সরাসরি দরজা বন্ধ
                করা। Island Tours এ সেই User এর নাম deploy। পুরো ক্রমটা:
              </ContentParagraph>
              <ContentList>
                <ListItem>Package গুলো হালনাগাদ করা।</ListItem>
                <ListItem>deploy User বানানো, sudo Group এ রাখা।</ListItem>
                <ListItem>root এর authorized_keys deploy এর কাছে কপি করা।</ListItem>
                <ListItem>
                  নতুন একটা Terminal এ deploy হিসেবে ঢুকে sudo পরীক্ষা করা,{" "}
                  <strong>পুরনো root Session খোলা রেখে</strong>।
                </ListItem>
                <ListItem>তারপর sshd এর নিয়ম কড়া করা, পরের অংশে।</ListItem>
              </ContentList>
              <ContentParagraph>
                ক্রমটা গুরুত্বপূর্ণ। প্রথমে নতুন দরজা বানাবেন আর পরীক্ষা করবেন, তারপরে পুরনো দরজা
                বন্ধ করবেন, উল্টোটা কখনো নয়। প্রথম কাজ হালনাগাদ, কারণ Image টা তৈরি হওয়ার পর থেকে
                যত Security Fix এসেছে, তার কোনোটাই এখনো বসেনি:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "first-update.sh",
          code: `root@island-vps-01:~# apt update && apt upgrade -y
# Package এর তালিকা নামবে, তারপর যা যা পুরনো সেগুলো হালনাগাদ হবে
root@island-vps-01:~# ls /var/run/reboot-required 2>/dev/null && reboot
# এই ফাইলটা থাকলে Kernel বা গুরুত্বপূর্ণ কিছু বদলেছে, একবার Restart দিন`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার deploy User। Ubuntu তে <code>adduser</code> সব প্রশ্ন জিজ্ঞেস করে করে কাজটা করে।
              এখানে যে Password দেবেন, সেটা SSH Login এর জন্য নয়, Login হবে Key দিয়ে। এই Password
              লাগবে শুধু sudo চালানোর সময়, যাতে কেউ আপনার Key দিয়ে ঢুকে পড়লেও root এর ক্ষমতা না পায়।
              তাই একটা শক্ত Password দিন আর Password Manager এ রাখুন। নাম, ফোন নম্বরের প্রশ্নগুলোয় শুধু
              Enter চাপলেই চলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "adduser-deploy.txt",
          code: `root@island-vps-01:~# adduser deploy
info: Adding user \`deploy' ...
info: Selecting UID/GID from range 1000 to 59999 ...
info: Adding new group \`deploy' (1001) ...
info: Adding new user \`deploy' (1001) with group \`deploy (1001)' ...
info: Creating home directory \`/home/deploy' ...
info: Copying files from \`/etc/skel' ...
New password:
Retype new password:
passwd: password updated successfully
Changing the user information for deploy
Enter the new value, or press ENTER for the default
	Full Name []:
	Room Number []:
	Work Phone []:
	Home Phone []:
	Other []:
Is the information correct? [Y/n] Y
info: Adding new user \`deploy' to supplemental / extra groups \`users' ...
info: Adding user \`deploy' to group \`users' ...

root@island-vps-01:~# usermod -aG sudo deploy
root@island-vps-01:~# id deploy
uid=1001(deploy) gid=1001(deploy) groups=1001(deploy),27(sudo),100(users)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>usermod -aG sudo deploy</code> deploy কে sudo নামের Group এ যোগ করে, আর
                Ubuntu তে এই Group এর সদস্যরা sudo দিয়ে root এর কাজ করতে পারে। <code>-a</code> মানে
                যোগ করা, বাদ দিলে deploy আগের সব Group থেকে বেরিয়ে যেত, তাই এই অক্ষরটা ভুলবেন না।
                User, Group আর sudo র পুরো গল্প পরের লেসনে। এখানে UID 1001 এসেছে কারণ Practice
                Server এ আগে থেকে একটা User ছিল, আপনার VPS এ সম্ভবত 1000 দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                এবার Key। Provider আপনার Key টা root এর <code>/root/.ssh/authorized_keys</code> এ
                বসিয়েছিল। পুরো .ssh Folder টা deploy এর Home এ কপি করে মালিকানা deploy কে দিয়ে দিন।
                <code>rsync --archive</code> Permission গুলো হুবহু রাখে, আর{" "}
                <code>--chown</code> মালিক বদলে দেয়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "copy-key-to-deploy.txt",
          code: `root@island-vps-01:~# rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
root@island-vps-01:~# ls -la /home/deploy/.ssh
total 12
drwx------ 2 deploy deploy 4096 Oct 31 07:26 .
drwxr-x--- 3 deploy deploy 4096 Oct 31 07:27 ..
-rw------- 1 deploy deploy   92 Oct 31 07:26 authorized_keys`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখন সবচেয়ে গুরুত্বপূর্ণ মুহূর্ত। root এর Terminal টা বন্ধ করবেন না। Laptop এ একটা{" "}
              <strong>নতুন</strong> Terminal খুলে deploy হিসেবে ঢুকুন আর sudo পরীক্ষা করুন। এখানে
              কিছু না মিললে পুরনো Terminal টা দিয়ে সারাবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "second-session-test.txt",
          code: `you@laptop:~$ ssh deploy@103.94.135.2
deploy@island-vps-01:~$ whoami; groups
deploy
deploy sudo users
deploy@island-vps-01:~$ sudo whoami
[sudo] password for deploy:
root`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              deploy Key দিয়ে ঢুকল, sudo তার Password চেয়ে root হলো। এখন নিরাপদে পরের ধাপে যাওয়া
              যায়। নিচের Lab এ ধাপগুলো নিজের পছন্দমতো ক্রমে চালু করে দেখুন কখন কখন নিজেকে বাইরে
              আটকে ফেলছেন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LockoutLab /> },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "first-hour-sshd",
      subHeader: { index: "010", title: "First Hour: sshd" },
      title: <SectionTitle>নতুন VPS এর প্রথম ঘণ্টা, ভাগ ২: দরজার নিয়ম কড়া করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                sshd এর নিয়ম লেখা থাকে <code>/etc/ssh/sshd_config</code> ফাইলে। কিন্তু এই ফাইলটা
                সরাসরি না বদলানোই ভালো, কারণ Package হালনাগাদের সময় এটা নিয়ে ঝামেলা হয়। Ubuntu তে
                মূল ফাইলের শুরুর দিকে একটা লাইন আছে যা <code>/etc/ssh/sshd_config.d/</code> Folder
                এর সব <code>.conf</code> ফাইল পড়ে নেয়। নিজের নিয়ম সেখানে আলাদা একটা ফাইলে রাখুন।
                তিনটা Setting ই আসল কাজ করে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>PasswordAuthentication no</code>: Password দিয়ে SSH Login বন্ধ, কারো জন্যই
                  নয়। Bot রা অনুমান করার কিছু পায় না।
                </ListItem>
                <ListItem>
                  <code>KbdInteractiveAuthentication no</code>: Password চাওয়ার আরেকটা পেছনের দরজা,
                  এটাও বন্ধ। Ubuntu তে এটা আগে থেকেই no, তবুও নিজের ফাইলে লিখে রাখা ভালো।
                </ListItem>
                <ListItem>
                  <code>PermitRootLogin no</code>: root নামে সরাসরি SSH বন্ধ, Key থাকলেও। Ubuntu র
                  Default হলো prohibit-password, মানে Key দিয়ে root চলে। আমরা পুরোটাই বন্ধ করছি,
                  যাতে সব কাজ deploy হয়ে sudo দিয়ে হয়, আর Log এ থাকে কে কী করল।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "/etc/ssh/sshd_config.d/10-hardening.conf",
          code: `# Island Tours: key-only login, no root over SSH
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
PubkeyAuthentication yes`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফাইলের নামের শুরুর 10 টা খেয়াল করুন, এটা সাজসজ্জা নয়। sshd একই Setting একাধিকবার
                পেলে প্রথমবার যে মান পায় সেটাই রাখে, পরেরগুলো চুপচাপ উপেক্ষা করে। আর Folder এর
                ফাইলগুলো পড়ে নামের বর্ণক্রমে। অনেক Provider এর Ubuntu Image এ cloud-init নামের একটা
                যন্ত্র Server বানানোর সময় <code>50-cloud-init.conf</code> নামে একটা ফাইল রেখে যায়,
                আর Server টা Password দিয়ে বানানো হলে তাতে লেখা থাকতে পারে{" "}
                <code>PasswordAuthentication yes</code>। আপনার ফাইলের নাম তার পরে এলে আপনার no
                কোনো কাজই করবে না। Practice Server এ দুইটা নাম দিয়েই চালিয়ে দেখা হলো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "first-value-wins.txt",
          code: `root@island-vps-01:~# ls /etc/ssh/sshd_config.d/
50-cloud-init.conf  99-hardening.conf
root@island-vps-01:~# sshd -T | grep -Ei "^(passwordauthentication|permitrootlogin) "
permitrootlogin no
passwordauthentication yes          # ফাঁদ: 50 আগে পড়া হয়েছে, তার yes টিকে গেছে

root@island-vps-01:~# mv /etc/ssh/sshd_config.d/99-hardening.conf /etc/ssh/sshd_config.d/10-hardening.conf
root@island-vps-01:~# sshd -T | grep -Ei "^(passwordauthentication|permitrootlogin) "
permitrootlogin no
passwordauthentication no`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ConfigOrderDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে দুইটা আলাদা Command এর তফাত মনে রাখুন। <code>sshd -T</code> সব ফাইল মিলিয়ে
                শেষ পর্যন্ত যে মানগুলো দাঁড়ায় সেগুলো ছাপে, ছোট হাতের অক্ষরে। <code>sshd -t</code>{" "}
                শুধু পরীক্ষা করে লেখায় ভুল আছে কি না, ঠিক থাকলে কিছুই ছাপে না। নিয়ম বদলানোর পরে
                প্রতিবার ক্রম একই: আগে -t দিয়ে বানান পরীক্ষা, তারপর Reload, তারপর -T দিয়ে আসল মান
                দেখা। একটা অক্ষর ভুল হলে -t ঠিক কোন ফাইলের কোন লাইন বলে দেয়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "sshd-test-and-reload.txt",
          code: `deploy@island-vps-01:~$ sudo sshd -t
/etc/ssh/sshd_config.d/10-hardening.conf: line 6: Bad configuration option: PermitRootLogn
/etc/ssh/sshd_config.d/10-hardening.conf: terminating, 1 bad configuration options

deploy@island-vps-01:~$ sudo systemctl reload ssh
Job for ssh.service failed.
See "systemctl status ssh.service" and "journalctl -xeu ssh.service" for details.
deploy@island-vps-01:~$ systemctl is-active ssh
active                                   # পুরনো নিয়মেই চলছে, কেউ বাইরে আটকায়নি

# বানান ঠিক করার পর
deploy@island-vps-01:~$ sudo sshd -t && sudo systemctl reload ssh && echo reloaded
reloaded`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভুল ফাইলে Reload ব্যর্থ হলো, কিন্তু sshd পুরনো নিয়মেই চলতে থাকল। এটা Ubuntu র একটা
                সুরক্ষা: <code>systemctl status ssh</code> খুললে দেখবেন ExecReload এর আগে{" "}
                <code>/usr/sbin/sshd -t</code> চলে। তবুও নিজে আগে -t চালানোর অভ্যাস রাখুন, কারণ
                Restart এ এই সুরক্ষা সবসময় এভাবে কাজ করে না, আর অন্য Distribution এ এটা নাও থাকতে
                পারে।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা স্বস্তির কথা: Reload বা এমনকি Restart এ আগে থেকে খোলা SSH Session গুলো কাটে
                না। Practice Server এ একটা Session খোলা রেখে sshd Restart করা হলো, Session টা
                দিব্যি চলতে থাকল। এই কারণেই পুরনো Terminal খোলা রেখে কাজ করা নিরাপদ জাল। এবার
                পরীক্ষা, Laptop এর নতুন Terminal থেকে, তিনভাবে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "three-login-tests.txt",
          code: `# deploy, Key দিয়ে: চলবে
you@laptop:~$ ssh deploy@103.94.135.2 'echo ok as $(whoami)'
ok as deploy

# root, Key দিয়ে: বন্ধ
you@laptop:~$ ssh root@103.94.135.2
root@103.94.135.2: Permission denied (publickey).

# deploy, শুধু Password দিয়ে: বন্ধ, Password চাওয়াই হয় না
you@laptop:~$ ssh -o PubkeyAuthentication=no deploy@103.94.135.2
deploy@103.94.135.2: Permission denied (publickey).

# Server এর Log এ root এর চেষ্টাটা
deploy@island-vps-01:~$ sudo grep "ROOT LOGIN" /var/log/auth.log | tail -n 1
2026-10-31T07:29:15.679541+00:00 island-vps-01 sshd[787]: ROOT LOGIN REFUSED FROM 203.0.113.25 port 38004`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Permission denied এর পরের Bracket টা পড়তে শিখুন, এটা Server এর খোলা দরজার তালিকা।
              আগে Password চালু থাকতে লেখা ছিল <code>(publickey,password)</code>, এখন শুধু{" "}
              <code>(publickey)</code>। অর্থাৎ Password দিয়ে চেষ্টা করার সুযোগই আর নেই। তিনটা
              পরীক্ষা পাস হলে তবেই পুরনো root Terminal টা বন্ধ করুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "port-logs-updates",
      subHeader: { index: "011", title: "Port, Logs, Patches" },
      title: <SectionTitle>কারা টোকা দিচ্ছে, Port 22 বদলাবেন কি না, আর নিজে থেকে Patch</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Password বন্ধ করার পরেও Bot রা টোকা দেওয়া থামাবে না, কারণ তারা জানে না আপনার দরজা
                বন্ধ। তফাত শুধু এই যে এখন তাদের প্রতিটা চেষ্টা নিশ্চিত ব্যর্থ। কারা টোকা দিচ্ছে দেখার
                দুইটা জায়গা, দুইটাতেই একই ঘটনা:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "who-is-knocking.sh",
          code: `# পুরনো ধরনের লেখা ফাইল, rsyslog লেখে
sudo grep sshd /var/log/auth.log | tail -n 20

# systemd এর Journal, ssh Service এর সব লাইন, শেষ এক ঘণ্টা (লেসন ০৭)
sudo journalctl -u ssh --since "1 hour ago"

# কে কে সফলভাবে ঢুকেছে, কোন Key দিয়ে
sudo grep "Accepted publickey" /var/log/auth.log | tail -n 5
# 2026-10-31T07:27:51.156111+00:00 island-vps-01 sshd[668]: Accepted publickey for deploy from 203.0.113.25 port 54726 ssh2: ED25519 SHA256:iTjwJb0lpsxfvJRCHL+EDEoE2qh6Ufousi4wkT3ZvJg

# কোন ঠিকানা থেকে সবচেয়ে বেশি ব্যর্থ চেষ্টা
sudo grep -E "Invalid user|Failed password" /var/log/auth.log | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Accepted publickey লাইনের শেষের Fingerprint টা সবচেয়ে কাজের জিনিস। এটা বলে কোন
                Key দিয়ে ঢোকা হলো, আর যেহেতু প্রতিটা যন্ত্রের Key আলাদা, তাই বোঝা যায় কোন যন্ত্র থেকে।
                অচেনা কোনো Fingerprint দেখলে সেটা জরুরি অবস্থা।
              </ContentParagraph>
              <ContentParagraph>
                <strong>fail2ban:</strong> এটা একটা Program, যা এই Log পড়ে, আর একই ঠিকানা থেকে কয়েকবার
                ব্যর্থ হলে Firewall এ সেই ঠিকানা কিছুক্ষণের জন্য আটকে দেয়। Password চালু থাকলে এটা
                জরুরি। Key Only Server এ এর কাজ মূলত Log পরিষ্কার রাখা আর sshd এর ওপর চাপ কমানো,
                নিরাপত্তা আসছে Key থেকেই। Firewall এর পুরো গল্প{" "}
                <Link href="/devops/topic/firewall-ufw" className={linkClass}>
                  লেসন ০৬
                </Link>{" "}
                এ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Port 22 বদলাবেন?</strong> অনেকে sshd কে 2222 বা অন্য কোনো Port এ সরিয়ে দেন।
                এতে Log এর আবর্জনা অনেক কমে, কারণ বেশিরভাগ Bot শুধু 22 এ টোকা দেয়। কিন্তু এটা
                নিরাপত্তা নয়, যে খুঁজতে চায় সে কয়েক সেকেন্ডে সব Port ঘুরে খোলা Port পেয়ে যায়।
                নিরাপত্তা আসে Key থেকে। তাই এটা ঐচ্ছিক, আর করলে Ubuntu 24.04 এর একটা নতুন নিয়ম জেনে
                করবেন।
              </ContentParagraph>
              <ContentParagraph>
                Ubuntu 24.04 এ sshd নিজে সারাক্ষণ Port এ বসে থাকে না। Port 22 এ শোনে systemd এর{" "}
                <code>ssh.socket</code>, আর প্রথম Connection এলে সে sshd কে চালু করে দেয়। ফলে
                sshd_config এ Port বদলে শুধু Reload দিলে কিছুই বদলায় না। systemd কে নতুন করে পড়তে
                বলতে হয় আর Socket টা Restart দিতে হয়। Practice Server এ দেখা গেল ঠিক এটাই:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ssh-socket-port.txt",
          code: `deploy@island-vps-01:~$ systemctl status ssh.socket --no-pager | head -6
● ssh.socket - OpenBSD Secure Shell server socket
     Loaded: loaded (/usr/lib/systemd/system/ssh.socket; enabled; preset: enabled)
     Active: active (listening) since Sat 2026-10-31 07:23:41 UTC; 14s ago
   Triggers: ● ssh.service
     Listen: 0.0.0.0:22 (Stream)
             [::]:22 (Stream)

# Port বদলানোর আগে Firewall এ নতুন Port খুলুন (লেসন ০৬), নইলে নিজেই আটকে যাবেন
deploy@island-vps-01:~$ echo "Port 2222" | sudo tee /etc/ssh/sshd_config.d/05-port.conf
Port 2222
deploy@island-vps-01:~$ sudo systemctl reload ssh
deploy@island-vps-01:~$ sudo ss -tlnp | grep -E ":22 |:2222 " | awk '{print $4}'
0.0.0.0:22                         # Reload এ কিছুই বদলায়নি
[::]:22

deploy@island-vps-01:~$ sudo systemctl daemon-reload
deploy@island-vps-01:~$ sudo systemctl restart ssh.socket
deploy@island-vps-01:~$ sudo ss -tlnp | grep -E ":22 |:2222 " | awk '{print $4}'
0.0.0.0:2222                       # এবার বদলেছে
[::]:2222

# systemd নিজে থেকে এই ফাইলটা বানিয়েছে, sshd_config এর Port পড়ে
deploy@island-vps-01:~$ cat /run/systemd/generator/ssh.socket.d/addresses.conf
# Automatically generated by sshd-socket-generator

[Socket]
ListenStream=
ListenStream=0.0.0.0:2222
ListenStream=[::]:2222`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Port বদলালে Laptop থেকে <code>ssh -p 2222 deploy@103.94.135.2</code> দিতে হবে, বা
                ~/.ssh/config এ Port লিখে রাখতে হবে (অংশ ০১২)। Island Tours Port 22 ই রেখেছে, কারণ
                Key Only Server এ Log এর আবর্জনা সামলানো সহজ, আর অদ্ভুত Port মনে রাখার ঝামেলা দলের
                সবার।
              </ContentParagraph>
              <ContentParagraph>
                <strong>নিজে থেকে Security Patch:</strong> Server এর সবচেয়ে বড় ঝুঁকি প্রায়ই কোনো
                জটিল আক্রমণ নয়, বরং মাসের পর মাস হালনাগাদ না করা একটা Package, যার দুর্বলতা সবার
                জানা। Ubuntu তে <code>unattended-upgrades</code> নামে একটা Package প্রতিদিন নিজে থেকে
                Security Update বসায়। অনেক Cloud Image এ এটা আগে থেকেই চালু থাকে। না থাকলে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "unattended-upgrades.txt",
          code: `deploy@island-vps-01:~$ sudo apt install -y unattended-upgrades
deploy@island-vps-01:~$ sudo dpkg-reconfigure -plow unattended-upgrades   # প্রশ্নে Yes

deploy@island-vps-01:~$ cat /etc/apt/apt.conf.d/20auto-upgrades
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";

# কোন উৎসের Update নিজে বসবে: Default এ শুধু Security
deploy@island-vps-01:~$ grep -n '"\${distro_id}' /etc/apt/apt.conf.d/50unattended-upgrades | head -2
7:	"\${distro_id}:\${distro_codename}";
8:	"\${distro_id}:\${distro_codename}-security";

# কখন চলবে, systemd এর দুইটা Timer (লেসন ১০)
deploy@island-vps-01:~$ systemctl list-timers "apt-daily*" --no-pager
NEXT                        LEFT LAST PASSED UNIT                    ACTIVATES
Sat 2026-10-31 18:30:02 UTC  10h -         - apt-daily.timer         apt-daily.service
Sun 2026-11-01 06:33:51 UTC  23h -         - apt-daily-upgrade.timer apt-daily-upgrade.service`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Restart লাগে কি না, কে জানাবে",
          content: (
            <p>
              Kernel এর মতো কিছু Update বসলেও পুরোপুরি কাজ করে Restart এর পরে। তখন{" "}
              <code>/var/run/reboot-required</code> ফাইলটা তৈরি হয়, আর Login এর সময় Ubuntu
              জানায় System restart required। Island Tours মাসে একবার শান্ত সময়ে এটা দেখে Restart
              দেয়, আর এর আগে নিশ্চিত হয় যে সব Service নিজে থেকে চালু হবে (লেসন ০২)।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "ssh-config",
      subHeader: { index: "012", title: "~/.ssh/config" },
      title: <SectionTitle>~/.ssh/config: লম্বা Command এর ডাকনাম, আর Connection বাঁচিয়ে রাখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিবার <code>ssh deploy@103.94.135.2</code> লেখা, কোন Key কোন Server এর মনে রাখা,
              কয়েক দিনেই এটা বোঝা হয়ে যায়। Laptop এর <code>~/.ssh/config</code> ফাইলে প্রতিটা Server
              এর জন্য একটা ডাকনাম আর তার Setting লিখে রাখুন:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "~/.ssh/config",
          code: `Host island
    HostName 103.94.135.2
    User deploy
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
    ServerAliveInterval 30
    ServerAliveCountMax 3`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "use-the-alias.txt",
          code: `you@laptop:~$ chmod 600 ~/.ssh/config
you@laptop:~$ ssh island hostname
island-vps-01

# ssh আসলে কোন মানগুলো ব্যবহার করবে, Connect না করেই দেখা
you@laptop:~$ ssh -G island | grep -Ei "^(hostname|user|port|identityfile|identitiesonly|serveraliveinterval|serveralivecountmax) "
user deploy
hostname 103.94.135.2
port 22
identitiesonly yes
serveralivecountmax 3
serveraliveinterval 30
identityfile ~/.ssh/id_ed25519`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা লাইনের কাজ: <code>Host</code> হলো ডাকনাম, <code>HostName</code> আসল ঠিকানা
                বা Domain, <code>User</code> কে হয়ে ঢুকবেন, <code>IdentityFile</code> কোন Private Key।
                এখন থেকে <code>ssh island</code>, <code>scp ফাইল island:</code>,{" "}
                <code>rsync ... island:</code>, সব জায়গায় ডাকনামটাই চলে। দুইটা লাইন আলাদা করে
                বোঝার মতো, কারণ দুইটাই বাস্তবের দুইটা রহস্যময় সমস্যা সারায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>IdentitiesOnly yes:</strong> Agent এ অনেকগুলো Key থাকলে ssh সবগুলো একটার পর
                একটা দেখাতে থাকে। sshd একটা Connection এ কয়েকবারের বেশি ভুল Key দেখতে দেয় না,
                Default এ ছয়বার। সঠিক Key টা সাত নম্বরে থাকলে আপনি ঢোকার আগেই Server Connection
                কেটে দেয়। Practice এ Agent এ সাতটা অচেনা Key রেখে চেষ্টা করলে এই Output আসে। এই
                লাইনটা ssh কে বলে শুধু IdentityFile এর Key টাই দেখাতে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "too-many-keys.txt",
          code: `you@laptop:~$ ssh-add -l | wc -l
7
you@laptop:~$ ssh deploy@103.94.135.2
Received disconnect from 103.94.135.2 port 22:2: Too many authentication failures
Disconnected from 103.94.135.2 port 22`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>ServerAliveInterval 30:</strong>{" "}
                <Link href="/devops/topic/connection-close" className={linkClass}>
                  Module 05 এর Lesson 08
                </Link>{" "}
                মনে করুন। বাসার Router এর NAT টেবিল, অফিসের Firewall, সবাই কিছুক্ষণ চুপ থাকা
                Connection ভুলে যায়। আপনি SSH খুলে কফি আনতে গেলেন, ফিরে এসে Enter চাপলেন, আর
                Terminal কিছুক্ষণ থমকে থেকে লিখল <code>client_loop: send disconnect: Broken pipe</code>।
                মাঝের কেউ আপনার চুপ থাকা Connection টা ফেলে দিয়েছে। এই লাইনটা ssh কে বলে প্রতি তিরিশ
                সেকেন্ডে তালাবন্ধ পথে একটা ছোট খবর পাঠাতে, যাতে Connection কখনো চুপ না থাকে।{" "}
                <code>ServerAliveCountMax 3</code> মানে পরপর তিনবার উত্তর না এলে ssh নিজেই বুঝে নেয়
                Connection মরে গেছে, অনন্তকাল ঝুলে থাকে না।
              </ContentParagraph>
              <ContentParagraph>
                ফাইলের সবার উপরে <code>Host *</code> লিখে তার নিচে যা রাখবেন, সেটা সব Server এ খাটবে,
                যেমন macOS এর Keychain এর দুইটা লাইন। মনে রাখবেন, এখানেও প্রথম মানটাই টেকে, তাই
                নির্দিষ্ট Server এর Block গুলো উপরে, আর <code>Host *</code> এর সাধারণ নিয়ম একদম নিচে
                রাখাই নিরাপদ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "files-tunnels",
      subHeader: { index: "013", title: "Files and Tunnels" },
      title: <SectionTitle>ফাইল পাঠানো, আর বন্ধ Port এ পৌঁছানোর সুড়ঙ্গ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SSH এর তালাবন্ধ পথ শুধু Terminal এর জন্য নয়। একই পথে ফাইল পাঠানো যায়, আর অন্য
                Program এর কথাও পার করানো যায়। ফাইলের জন্য তিনটা যন্ত্র, তিন রকম কাজে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>scp</code>: একটা বা কয়েকটা ফাইল একবার পাঠানো, <code>cp</code> এর মতো।
                </ListItem>
                <ListItem>
                  <code>rsync</code>: একটা পুরো Folder পাঠানো, আর পরের বার শুধু যা বদলেছে সেটুকু।
                  Deploy এর মতো বারবারের কাজের জন্য এটাই।
                </ListItem>
                <ListItem>
                  <code>sftp</code>: Server এর ফাইলগুলো ঘুরে দেখে দেখে আনা নেওয়া। FileZilla বা
                  Cyberduck এর মতো Program গুলো ভেতরে এটাই ব্যবহার করে, আলাদা কোনো FTP Server লাগে
                  না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "scp-and-rsync.txt",
          code: `# একটা ফাইল
you@laptop:~$ scp my-tours/package.json island:/home/deploy/

# পুরো Folder, প্রথমবার: সব যায়
you@laptop:~$ rsync -avz my-tours/ island:/home/deploy/my-tours/
sending incremental file list
created directory /home/deploy/my-tours
./
README.txt
package.json
src/
src/server.js

sent 354 bytes  received 128 bytes  321.33 bytes/sec
total size is 68  speedup is 0.14

# একটা ফাইল বদলে আবার: শুধু সেটাই যায়
you@laptop:~$ echo "// v2" >> my-tours/src/server.js
you@laptop:~$ rsync -avz my-tours/ island:/home/deploy/my-tours/
sending incremental file list
src/server.js

sent 239 bytes  received 42 bytes  562.00 bytes/sec
total size is 74  speedup is 0.26

# Laptop এ মুছে ফেলা ফাইল Server থেকেও মুছতে --delete, আগে -n দিয়ে মহড়া
you@laptop:~$ rm my-tours/README.txt
you@laptop:~$ rsync -avzn --delete my-tours/ island:/home/deploy/my-tours/
sending incremental file list
deleting README.txt
./

sent 148 bytes  received 41 bytes  126.00 bytes/sec
total size is 54  speedup is 0.29 (DRY RUN)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                rsync এর দুইটা ফাঁদ জেনে রাখুন। প্রথমটা শেষের Slash: <code>my-tours/</code> মানে
                Folder এর ভেতরের জিনিসগুলো, আর <code>my-tours</code> মানে Folder টা নিজে। দ্বিতীয়টা
                দিলে Server এ <code>/home/deploy/my-tours/my-tours/</code> তৈরি হয়ে যায়। দ্বিতীয় ফাঁদ{" "}
                <code>--delete</code>: ভুল Folder এ দিলে Server এর দরকারি ফাইল মুছে যায়, তাই সবসময়
                আগে <code>-n</code> দিয়ে মহড়া দিন, উপরে যেমন DRY RUN লেখা।
              </ContentParagraph>
              <ContentParagraph>
                এবার সুড়ঙ্গ। Island Tours এর PostgreSQL শোনে শুধু Server এর ভেতরের ঠিকানা{" "}
                <code>127.0.0.1:5432</code> এ, আর Firewall এও 5432 খোলা নেই, থাকা উচিতও না। কিন্তু
                মাঝে মাঝে Laptop এর কোনো Database Tool দিয়ে Data দেখতে হয়। Port খুলে দেওয়া মানে
                Database কে পুরো Internet এর সামনে দাঁড় করানো। তার বদলে SSH এর Local Port
                Forwarding, <code>ssh -L</code>:
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TunnelDiagram /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ssh-tunnel.txt",
          code: `# Server এ PostgreSQL কোথায় শোনে
deploy@island-vps-01:~$ sudo ss -tlnp | grep 5432
LISTEN 0      200        127.0.0.1:5432       0.0.0.0:*    users:(("postgres",pid=3612,fd=7))
LISTEN 0      200            [::1]:5432          [::]:*    users:(("postgres",pid=3612,fd=6))

# Laptop থেকে সরাসরি: বন্ধ
you@laptop:~$ nc -vz -w 3 103.94.135.2 5432
nc: connect to 103.94.135.2 port 5432 (tcp) failed: Connection refused
you@laptop:~$ pg_isready -h 103.94.135.2 -p 5432
103.94.135.2:5432 - no response

# আলাদা একটা Terminal এ সুড়ঙ্গটা চালু রাখুন (-N মানে কোনো Command নয়, শুধু সুড়ঙ্গ)
you@laptop:~$ ssh -N -L 5433:127.0.0.1:5432 island

# প্রথম Terminal এ ফিরে: Laptop এর 5433 এ এখন Server এর Database
you@laptop:~$ pg_isready -h 127.0.0.1 -p 5433
127.0.0.1:5433 - accepting connections
you@laptop:~$ ss -tlnp | grep 5433
LISTEN 0      128        127.0.0.1:5433       0.0.0.0:*    users:(("ssh",pid=1239,fd=5))
LISTEN 0      128            [::1]:5433          [::]:*    users:(("ssh",pid=1239,fd=4))

# কাজ শেষে সুড়ঙ্গের Terminal এ Ctrl+C`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>-L 5433:127.0.0.1:5432</code> পড়ুন বাঁ থেকে ডানে: আমার Laptop এর 5433 এ যা
                আসবে, Server এ পৌঁছে সেটা যাবে <code>127.0.0.1:5432</code> এ। এখানে 127.0.0.1 মানে
                Server এর নিজের ভেতরের ঠিকানা, কারণ শেষ অংশটা Server এর দিক থেকে পড়া হয় (Module 05
                এর Lesson 07 এর Bind Address মনে করুন)। Laptop এ 5432 না নিয়ে 5433 নেওয়া হলো, যাতে
                Laptop এ নিজের কোনো PostgreSQL চললে তার সাথে ধাক্কা না লাগে। ss এর Output দেখাচ্ছে
                Laptop এর 5433 এ আসলে বসে আছে ssh নিজে।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা কাছের আত্মীয়: <code>ssh -J</code> বা config এর <code>ProxyJump</code>। কোনো
                প্রতিষ্ঠানে ভেতরের Server গুলোয় সরাসরি ঢোকা যায় না, আগে একটা পাহারাদার Server এ
                ঢুকতে হয়, যাকে বলে Bastion বা Jump Host। <code>ssh -J bastion deploy@ভেতরের-server</code>{" "}
                এক Command এ দুই ধাপ পার করে, আর আপনার Private Key বা Agent কোনোটাই মাঝের Server এ
                যায় না, তাই এটা ssh -A এর চেয়ে নিরাপদ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "beyond-one-server",
      subHeader: { index: "014", title: "Keys in Real Life" },
      title: <SectionTitle>GitHub, Deploy Key, চুরি যাওয়া Key, আর বাইরে আটকে পড়লে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>GitHub এ আপনার Key:</strong> একই Public Key দিয়ে GitHub এ Code Push করা যায়।
                GitHub এর Settings এর SSH and GPG keys পাতায় .pub ফাইলের লাইনটা Paste করুন। তারপর
                পরীক্ষা করুন <code>ssh -T git@github.com</code> দিয়ে। প্রথমবার GitHub এর নিজের Host
                Key এর প্রশ্ন আসবে, আর এখানেও মেলানোর নিয়ম একই: GitHub তার Fingerprint গুলো নিজের নথিতে
                প্রকাশ করে, সেখানে মিলিয়ে yes দিন। সফল হলে GitHub আপনার Username ধরে একটা বার্তা দেয়,
                যার চেহারা এরকম (নমুনা, এই লেখার যন্ত্র থেকে GitHub এ Connect করা হয়নি):
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "github-test.txt (নমুনা)",
          code: `you@laptop:~$ ssh -T git@github.com
Hi your-username! You've successfully authenticated, but GitHub does not provide shell access.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Deploy Key, Server এর নিজের Key:</strong> Server কে যদি GitHub থেকে Code
                টানতে হয়, তাহলে আপনার ব্যক্তিগত Key টা Server এ কপি করবেন না। আপনার Key দিয়ে আপনার
                সব Repository তে লেখা যায়। তার বদলে Server এ, deploy User হিসেবে, Server এর নিজের
                একটা নতুন Key বানান, Passphrase ছাড়া কারণ কেউ সেখানে বসে টাইপ করবে না, আর তার Public
                অংশটা GitHub এ শুধু ওই একটা Repository র Settings এর Deploy keys পাতায় যোগ করুন,
                Write Access ছাড়া। এখন Server চুরি গেলেও চোর পায় শুধু একটা Repository পড়ার অনুমতি।{" "}
                <Link href="/devops/topic/vps-setup" className={linkClass}>
                  লেসন ১১
                </Link>{" "}
                এ my-tours এর Code এভাবেই Server এ নামানো হবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Laptop হারালে বা Key ফাঁস হলে:</strong> ধরুন অফিসের যন্ত্রটা চুরি গেল।
                Passphrase থাকলে আপনার হাতে সময় আছে, কিন্তু অপেক্ষা করবেন না। প্রতিটা Server এর
                authorized_keys থেকে সেই যন্ত্রের লাইনটা মুছুন, GitHub থেকেও মুছুন, তারপর Log দেখুন ওই
                Fingerprint দিয়ে সম্প্রতি কেউ ঢুকেছে কি না। এখানে Key এর মন্তব্যটা কাজে আসে, লাইন খুঁজে
                পাওয়া যায় এক Command এ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "revoke-a-key.txt",
          code: `deploy@island-vps-01:~$ grep -n "office-pc" ~/.ssh/authorized_keys | cut -c1-40
2:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAII
deploy@island-vps-01:~$ cp ~/.ssh/authorized_keys ~/.ssh/authorized_keys.bak
deploy@island-vps-01:~$ sed -i "/ you@office-pc$/d" ~/.ssh/authorized_keys
deploy@island-vps-01:~$ awk '{print $3}' ~/.ssh/authorized_keys
you@laptop

# সেই Key দিয়ে চেষ্টা করলে এখন
you@laptop:~$ ssh -i ~/.ssh/id_office -o IdentitiesOnly=yes deploy@103.94.135.2
deploy@103.94.135.2: Permission denied (publickey).

# ওই Key এর Fingerprint দিয়ে কেউ ঢুকেছিল কি না
deploy@island-vps-01:~$ sudo grep "Accepted publickey" /var/log/auth.log | grep "SHA256:ফাঁস-হওয়া-Key-এর-Fingerprint"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কেউ সত্যিই ঢুকে থাকলে ব্যাপারটা আর শুধু একটা Key এর নয়। সেই User যা যা পড়তে পারত,
                যেমন Environment ফাইলের Secret গুলো, সব বদলাতে হবে (লেসন ০৫), আর Server টা নতুন করে
                বানানোই সবচেয়ে নিরাপদ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>নিজেকে বাইরে আটকে ফেললে:</strong> নিয়ম কড়া করতে গিয়ে ভুল হলো, পুরনো Session
                ও বন্ধ, এখন Permission denied ছাড়া কিছু আসে না। আতঙ্কের কিছু নেই, Provider এর Web
                Console আপনার পেছনের দরজা, কারণ সেটা SSH ব্যবহারই করে না, সরাসরি Server এর পর্দা
                দেখায়। ক্রমটা সাধারণত এরকম:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Provider এর Dashboard থেকে Console খুলুন",
              description:
                "Server এর পাতায় Console, Browser Terminal বা VNC নামের বোতাম। এখানে Login হয় User আর Password দিয়ে, SSH এর নিয়ম এখানে খাটে না।",
            },
            {
              title: "Password জানা না থাকলে Provider এর Reset ব্যবহার করুন",
              description:
                "বেশিরভাগ Provider root এর Password নতুন করে বসানোর ব্যবস্থা রাখে, কেউ কেউ Recovery Mode এ Boot করায়। আপনার Provider এর নথিতে যে নাম আছে, সেটাই মানুন।",
            },
            {
              title: "ভুলটা খুঁজুন আর সারান",
              description:
                "sshd -T দিয়ে আসল মানগুলো দেখুন, ls -la দিয়ে authorized_keys আর তার Folder এর Permission দেখুন, journalctl -u ssh দিয়ে শেষ Error পড়ুন। বেশিরভাগ সময় কারণ তিনটার একটা: Key কপি হয়নি, Permission ভুল, বা Firewall এ Port বন্ধ।",
            },
            {
              title: "Laptop থেকে আবার পরীক্ষা, Console খোলা রেখে",
              description:
                "Console বন্ধ করার আগে Laptop থেকে ssh দিয়ে ঢুকে দেখুন। ঢুকতে পারলে তবেই Console বন্ধ। কিছু Provider Console এর Password Reset এর পরে নিজে থেকে PasswordAuthentication চালু করে দেয়, তাই sshd -T দিয়ে আবার মিলিয়ে নিন।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর দরজার নিয়মপত্র</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর VPS এ ঢোকা নিয়ে দলের একটা লেখা নিয়মপত্র আছে, আর নতুন কেউ দলে এলে
                প্রথম দিন সেটা পড়েন। এই লেসনের প্রতিটা অংশ সেখানে একটা করে সিদ্ধান্ত হয়ে আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ঢোকার পথ একটাই।</strong> deploy User, Key দিয়ে। root নামে SSH বন্ধ,
                  Password Login বন্ধ। নিয়মগুলো থাকে <code>/etc/ssh/sshd_config.d/10-hardening.conf</code>{" "}
                  এ, আর প্রতিটা পরিবর্তনের পরে sshd -T এর Output Runbook এ মিলিয়ে দেখা হয়।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা যন্ত্রের আলাদা Key, নামসহ।</strong> deploy এর authorized_keys এ
                  প্রতিটা লাইনের মন্তব্যে মানুষ আর যন্ত্রের নাম। কেউ নতুন Laptop নিলে নতুন Key, পুরনোটা
                  সেদিনই মোছা হয়। দল ছাড়লে তার সব লাইন মোছা আর Log এ শেষ Login দেখা Offboarding এর
                  প্রথম কাজ।
                </ListItem>
                <ListItem>
                  <strong>Host Key এর Fingerprint লেখা থাকে Runbook এ।</strong> Server বানানোর দিন
                  Provider এর Console থেকে নেওয়া। নতুন সদস্য প্রথম Connection এর সময় সেটা মিলিয়ে yes
                  দেন। Server নতুন করে বানালে Runbook আগে হালনাগাদ হয়, তারপর দলকে জানানো হয়, যাতে
                  HOST IDENTIFICATION HAS CHANGED দেখে কেউ অবাক না হন।
                </ListItem>
                <ListItem>
                  <strong>Database আর Redis শুধু সুড়ঙ্গ দিয়ে।</strong> 5432 আর 6379 কখনো Firewall এ
                  খোলা হয় না। Data দেখতে হলে <code>ssh -N -L 5433:127.0.0.1:5432 island</code>।
                </ListItem>
                <ListItem>
                  <strong>Server এর নিজের Key আলাদা।</strong> Code নামাতে GitHub এ একটা Read Only
                  Deploy Key, শুধু একটা Repository র জন্য। কারো ব্যক্তিগত Key Server এ কখনো যায় না,
                  আর Agent Forwarding বন্ধ।
                </ListItem>
                <ListItem>
                  <strong>Patch নিজে থেকে, Restart মাসে একবার।</strong> unattended-upgrades চালু,
                  আর মাসের প্রথম রবিবার ভোরে reboot-required দেখে Restart। fail2ban ও আছে, মূলত Log
                  পরিষ্কার রাখার জন্য।
                </ListItem>
                <ListItem>
                  <strong>আটকে পড়ার পরিকল্পনা আগে থেকে।</strong> Provider এর Console এ ঢোকার পথ
                  Runbook এ লেখা, আর Provider এর Account এ দুইজনের Access আছে, যাতে একজন ছুটিতে থাকলেও
                  দরজা খোলা যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নতুন একটা Server এ এই সব কিছু শুরু থেকে বসানো, তার ওপর Firewall, my-tours App, Caddy
                আর Backup চালু করা পর্যন্ত পুরো পথটা ধাপে ধাপে আছে{" "}
                <Link href="/devops/topic/vps-setup" className={linkClass}>
                  লেসন ১১
                </Link>{" "}
                এ। সেখানে SSH এর ধাপগুলো ঠিক এই লেসনের ক্রমেই আসবে।
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
      title: <SectionTitle>সকালের একটা ssh island, Enter থেকে Prompt পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি বাসায় বসে Laptop খুললেন আর লিখলেন <code>ssh island</code>। প্রথম Prompt টা আসার
              আগের এক সেকেন্ডের কম সময়ে যা যা ঘটে, পরপর।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ConnectStepLab /> },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "ssh ডাকনামটা খোলে",
              description:
                "~/.ssh/config এ Host island পেয়ে জানে: ঠিকানা 103.94.135.2, User deploy, Key ~/.ssh/id_ed25519, প্রতি 30 সেকেন্ডে খবর পাঠাতে হবে।",
            },
            {
              title: "TCP Connection, Port 22",
              description:
                "Laptop 192.168.1.20 থেকে একটা Ephemeral Port নিয়ে SYN পাঠায়। বাসার Router NAT করে Source বানায় 203.0.113.25। Three-way Handshake শেষে Server এর ssh.socket Connection টা sshd এর হাতে দেয়।",
            },
            {
              title: "Version আর Key Exchange",
              description:
                "দুই পাশ জানায় দুইজনই SSH 2.0 বলে। তারপর sntrup761x25519 দিয়ে একটা গোপন চাবি তৈরি হয়। এর পর থেকে তারের ওপর সব কিছু তালাবন্ধ।",
            },
            {
              title: "Server নিজের পরিচয় দেয়",
              description:
                "Server তার Ed25519 Host Key দেখায় আর তার Private অংশ দিয়ে সই করে প্রমাণ দেয়। Laptop known_hosts খুলে দেখে এই ঠিকানার Key হুবহু মেলে। মিলল, কোনো প্রশ্ন নেই।",
            },
            {
              title: "Server জানায় কোন দরজা খোলা",
              description:
                "Authentications that can continue: publickey। Password এর কথা তালিকাতেই নেই।",
            },
            {
              title: "Laptop একটা Public Key দেখায়",
              description:
                "IdentitiesOnly থাকায় শুধু id_ed25519 এর Public অংশ, Fingerprint SHA256:iTjwJb0l...ZvJg। Private Key Laptop এর Agent এর ভেতরেই থাকে।",
            },
            {
              title: "Server তালিকা আর পাহারা দুইটাই দেখে",
              description:
                "deploy এর Home, .ssh আর authorized_keys এ অন্য কেউ লিখতে পারে কি না দেখে। তারপর ফাইলে এই Key খোঁজে। পেল, তাই বলে: সই করে প্রমাণ দিন।",
            },
            {
              title: "Agent সই করে",
              description:
                "এই Connection এর নিজস্ব তথ্যে Agent Private Key দিয়ে সই করে ssh এর হাতে দেয়। Passphrase আগেই একবার দেওয়া ছিল, তাই এখন কিছু চাইল না।",
            },
            {
              title: "Server যাচাই করে আর লিখে রাখে",
              description:
                "Public Key দিয়ে সই মিলল। auth.log এ যোগ হলো: Accepted publickey for deploy from 203.0.113.25 ... SHA256:iTjwJb0l...ZvJg।",
            },
            {
              title: "Shell, আর তারপর চুপচাপ পাহারা",
              description:
                "deploy হিসেবে একটা bash চালু হয়, পর্দায় আসে deploy@island-vps-01:~$। এরপর আপনি চুপ থাকলেও ssh প্রতি 30 সেকেন্ডে একটা খবর পাঠায়, যাতে মাঝের Router এর NAT টেবিল Connection টা ভুলে না যায়।",
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
                <strong>নিচের Lab টা আগে করুন</strong>, Docker এর দুইটা Container এ এই লেসনের প্রতিটা
                ধাপ নিজের হাতে, ভুলগুলো সহ। নিজের হাতে একবার নিজেকে বাইরে আটকানো আর ফিরে আসার কোনো
                বিকল্প নেই।
              </ListItem>
              <ListItem>
                <strong>OpenSSH এর Manual Page</strong>, ssh, sshd_config আর ssh-keygen এর প্রতিটা
                Setting এর সঠিক সংজ্ঞা। Terminal এ <code>man sshd_config</code>, অথবা{" "}
                <a href="https://man.openbsd.org/sshd_config" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  man.openbsd.org/sshd_config
                </a>
                {", "}
                <a href="https://man.openbsd.org/ssh" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  man.openbsd.org/ssh
                </a>
                {" আর "}
                <a href="https://man.openbsd.org/ssh-keygen" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  man.openbsd.org/ssh-keygen
                </a>
              </ListItem>
              <ListItem>
                <strong>Ubuntu Server এর OpenSSH নথি</strong>, Ubuntu তে sshd বসানো, Setting আর
                Socket নিয়ে।{" "}
                <a
                  href="https://documentation.ubuntu.com/server/how-to/security/openssh-server/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  documentation.ubuntu.com/server/how-to/security/openssh-server
                </a>
              </ListItem>
              <ListItem>
                <strong>GitHub এর SSH নথি</strong>, Key বানানো, macOS Keychain এর Setting আর Deploy
                Key।{" "}
                <a
                  href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Generating a new SSH key
                </a>
                {" আর "}
                <a
                  href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Managing deploy keys
                </a>
              </ListItem>
              <ListItem>
                <strong>Mozilla এর OpenSSH নির্দেশিকা</strong>, একটা বড় প্রতিষ্ঠান তাদের Server এ কোন
                Setting কেন রাখে, যুক্তি সহ।{" "}
                <a href="https://infosec.mozilla.org/guidelines/openssh" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  infosec.mozilla.org/guidelines/openssh
                </a>
              </ListItem>
              <ListItem>
                <strong>আপনার VPS Provider এর নথি</strong>, SSH Key যোগ করা আর Web Console এর পাতা।
                প্রতিটা Provider এর বোতামের নাম আলাদা, আপনার Dashboard এ যা লেখা সেটাই মানুন।
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
                SSH তিনটা কাজ করে: কথা তালাবন্ধ রাখে, Server কে চেনে, আপনাকে চেনে। Laptop এ ssh,
                Server এ sshd, মাঝে TCP Port 22।
              </ListItem>
              <ListItem>
                Server চেনা হয় Host Key দিয়ে। SSH এ CA নেই, প্রথম দেখায় Fingerprint টা আপনি নিজে
                Provider এর Console এ মিলিয়ে নেন, তারপর known_hosts মনে রাখে। HOST IDENTIFICATION
                HAS CHANGED এলে কারণ জেনে, অন্য পথে মিলিয়ে, তবেই ssh-keygen -R।
              </ListItem>
              <ListItem>
                Password এ গোপন কথা প্রতিবার Server এ যায়, আর যে কেউ অনুমান করতে পারে। Key এ Server
                চায় একটা সই, Private Key কখনো আপনার যন্ত্র ছাড়ে না।
              </ListItem>
              <ListItem>
                Key বানান ssh-keygen -t ed25519 -C দিয়ে, প্রতিটা যন্ত্রে আলাদা, Passphrase সহ, আর
                ssh-agent কে দিন যাতে বারবার লিখতে না হয়। Private Key 600, ~/.ssh 700,
                authorized_keys 600।
              </ListItem>
              <ListItem>
                Public Key Server এ বসে authorized_keys এ: VPS বানানোর সময়, ssh-copy-id দিয়ে, বা
                Console থেকে হাতে।
              </ListItem>
              <ListItem>
                প্রথম ঘণ্টার ক্রম: হালনাগাদ, deploy বানানো আর sudo, Key কপি, নতুন Terminal এ পরীক্ষা,
                তারপর 10-hardening.conf এ Password আর root বন্ধ। sshd -t, Reload, sshd -T, আর পুরনো
                Session খোলা রেখে তিনটা পরীক্ষা।
              </ListItem>
              <ListItem>
                sshd প্রথম মানটা রাখে, তাই নিজের ফাইলের নাম 50-cloud-init.conf এর আগে আসা চাই। Ubuntu
                24.04 এ Port বদলাতে daemon-reload আর ssh.socket Restart, আর আগে Firewall।
              </ListItem>
              <ListItem>
                ~/.ssh/config এ ডাকনাম, IdentitiesOnly আর ServerAliveInterval। ফাইল পাঠাতে scp আর
                rsync, বন্ধ Port এর Database এ পৌঁছাতে ssh -L। Server এর জন্য আলাদা Read Only Deploy
                Key, আর আটকে পড়লে Provider এর Web Console।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৪, Permissions, Users, and Groups",
          content: (
            <p>
              এই লেসনে বারবার কিছু সংখ্যা এসেছে, 600, 700, 750, আর কিছু শব্দ, sudo Group, deploy এর
              Home, root। sshd কেন 666 এ রেগে যায় কিন্তু 644 এ যায় না, deploy আসলে কোন কোন Group এর
              সদস্য আর তাতে কী বদলায়, sudo কাকে কতটুকু ক্ষমতা দেয়, আর Island Tours এর App এর জন্য
              islandtours নামের আলাদা একটা User কেন, যে কখনো Login ই করে না। পরের লেসনে Linux এর
              User, Group আর Permission এর পুরো খাতাটা খুলে দেখব। পরের লেসন: Permissions, Users,
              and Groups।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["SSH", "দূরের যন্ত্রের তালাবন্ধ Terminal। Client ssh, Server sshd, TCP Port 22"],
      ["Host Key", "Server এর নিজের Key Pair, /etc/ssh এ। প্রতিটা Connection এ Server এটা দিয়ে পরিচয় প্রমাণ করে"],
      ["Fingerprint", "লম্বা Key এর ছোট SHA256 পরিচয়, মানুষের মেলানোর জন্য"],
      ["known_hosts", "Laptop এর চেনা Server দের খাতা। না মিললে HOST IDENTIFICATION HAS CHANGED"],
      ["Trust On First Use", "SSH এ CA নেই। প্রথমবার আপনি অন্য পথে মিলিয়ে জামিন দেন"],
      ["Key Login", "Server একটা সই চায়, Private Key কখনো যন্ত্র ছাড়ে না"],
      ["ssh-keygen -t ed25519", "নতুন Key Pair, প্রতিটা যন্ত্রে আলাদা, -C তে মানুষ আর যন্ত্রের নাম"],
      ["Passphrase", "Private Key ফাইলের নিজের তালা। চুরি হলে সময় কেনে"],
      ["ssh-agent", "খোলা Key Memory তে রাখে, বারবার Passphrase লাগে না। ssh -A সাবধানে"],
      ["authorized_keys", "Server এ যাদের ঢুকতে দেওয়া হবে তাদের Public Key, প্রতি লাইনে একটা, Mode 600"],
      ["ssh-copy-id", "Public Key Server এ বসানোর সহজ Command, আগে থেকে থাকা Key আবার যোগ করে না"],
      ["deploy আর sudo", "নিজের জন্য সাধারণ User, sudo Group এ। Password শুধু sudo র জন্য"],
      ["10-hardening.conf", "PasswordAuthentication no, PermitRootLogin no। ছোট সংখ্যার নাম, কারণ প্রথম মান টেকে"],
      ["sshd -t আর sshd -T", "-t বানান পরীক্ষা, -T শেষ পর্যন্ত দাঁড়ানো আসল মান"],
      ["ssh.socket", "Ubuntu 24.04 এ Port 22 এ শোনে systemd। Port বদলাতে daemon-reload আর Socket Restart"],
      ["~/.ssh/config", "ডাকনাম, IdentitiesOnly আর ServerAliveInterval এর জায়গা"],
      ["ssh -L", "Laptop এর একটা Port থেকে Server এর ভেতরের Port পর্যন্ত তালাবন্ধ সুড়ঙ্গ"],
      ["Deploy Key", "Server এর নিজের Key, GitHub এ একটা Repository, শুধু পড়ার অনুমতি"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "নতুন Server এ প্রথমবার ssh করলে The authenticity of host can't be established কেন আসে?",
        options: [
          {
            key: "A",
            text: "Server এর Certificate এর মেয়াদ শেষ",
            isCorrect: false,
            explanation: "SSH এ Certificate বা CA এর ব্যবস্থাই নেই। এটা HTTPS এর ধারণা।",
          },
          {
            key: "B",
            text: "আপনার Laptop এর known_hosts এ এই Server এর Host Key নেই, আর SSH এ জামিন দেওয়ার কোনো CA নেই",
            isCorrect: true,
            explanation:
              "ঠিক। এটা Trust On First Use এর প্রথম দেখা। Provider এর Console এ ssh-keygen -lf চালিয়ে Fingerprint মিলিয়ে তবেই yes।",
          },
          {
            key: "C",
            text: "Server এ আপনার Public Key বসানো হয়নি",
            isCorrect: false,
            explanation:
              "এই প্রশ্ন আসে Server কে চেনার ধাপে, আপনাকে চেনার ধাপ তখনো শুরুই হয়নি। Key না থাকলে পরে Permission denied আসত।",
          },
          {
            key: "D",
            text: "Port 22 এ Firewall আটকে দিয়েছে",
            isCorrect: false,
            explanation:
              "Firewall আটকালে TCP Connection ই হতো না, Server এর Fingerprint দেখার সুযোগই আসত না।",
          },
        ],
      },
      {
        id: 2,
        text: "সকালে ssh করতেই REMOTE HOST IDENTIFICATION HAS CHANGED এলো। প্রথমে কী করবেন?",
        options: [
          {
            key: "A",
            text: "known_hosts ফাইলটা পুরো মুছে আবার চেষ্টা",
            isCorrect: false,
            explanation:
              "এতে সব Server এর মনে রাখা পরিচয় মুছে যায়, আর মাঝে সত্যিই কেউ থাকলে আপনি নিজে তাকে বিশ্বাস করে বসবেন।",
          },
          {
            key: "B",
            text: "StrictHostKeyChecking no দিয়ে ঢুকে পড়া",
            isCorrect: false,
            explanation: "এটা ধোঁয়ার Alarm খুলে ফেলার মতো। প্রতারক থাকলে ssh চুপচাপ তার Key মেনে নেবে।",
          },
          {
            key: "C",
            text: "কারণ জেনে, Provider এর Console এ নতুন Fingerprint মিলিয়ে, মিললে তবেই ssh-keygen -R",
            isCorrect: true,
            explanation:
              "ঠিক। Server নতুন করে বানানোর মতো নিরীহ কারণেও এটা আসে, আর আক্রমণেও ঠিক এটাই আসে। অন্য পথে মিলিয়ে দেখাই একমাত্র তফাত করার উপায়।",
          },
          {
            key: "D",
            text: "Password দিয়ে ঢুকে দেখা Server ঠিক আছে কি না",
            isCorrect: false,
            explanation:
              "Host Key না মিললে ssh থামিয়ে দেয়, আর জোর করে ঢুকলে Password টা হয়তো প্রতারকের হাতেই দিয়ে দিচ্ছেন।",
          },
        ],
      },
      {
        id: 3,
        text: "Key দিয়ে Login এর সময় Laptop থেকে Server এর কাছে কী কী যায়?",
        options: [
          {
            key: "A",
            text: "Private Key, তালাবন্ধ অবস্থায়",
            isCorrect: false,
            explanation: "Private Key কোনো অবস্থাতেই যন্ত্র ছাড়ে না, তালাবন্ধ হয়েও না।",
          },
          {
            key: "B",
            text: "Public Key আর এই Connection এর তথ্যে করা একটা সই",
            isCorrect: true,
            explanation:
              "ঠিক। Server Public Key দিয়ে authorized_keys এ খোঁজে আর সইটা যাচাই করে। সইটা শুধু এই Connection এর জন্য, অন্য কোথাও কাজে লাগে না।",
          },
          {
            key: "C",
            text: "Passphrase",
            isCorrect: false,
            explanation: "Passphrase শুধু আপনার Laptop এ Private Key ফাইলের তালা খোলে। Server কখনো দেখে না।",
          },
          {
            key: "D",
            text: "deploy এর Password এর Hash",
            isCorrect: false,
            explanation: "Key Login এ Password এর কোনো ভূমিকা নেই, Hash ও না।",
          },
        ],
      },
      {
        id: 4,
        text: "Private Key ফাইলের Permission 644 হলে কী হয়?",
        options: [
          {
            key: "A",
            text: "কিছুই না, শুধু একটা সতর্কবার্তা আসে আর Login হয়ে যায়",
            isCorrect: false,
            explanation: "সতর্কবার্তার পরে ssh Key টা ফেলে দেয়: This private key will be ignored।",
          },
          {
            key: "B",
            text: "ssh নিজেই Key টা উপেক্ষা করে, আর Server বলে Permission denied",
            isCorrect: true,
            explanation:
              "ঠিক। UNPROTECTED PRIVATE KEY FILE বলে ssh Key টা ব্যবহার করে না। chmod 600 দিলে সারে। Agent এ আগে থেকে Load থাকলে অবশ্য এটা চোখে নাও পড়তে পারে।",
          },
          {
            key: "C",
            text: "Server এর Log এ bad ownership or modes আসে",
            isCorrect: false,
            explanation:
              "সেটা আসে Server এর দিকের ফাইল ভুল হলে। Laptop এর Key ভুল হলে Server পর্যন্ত Key ই পৌঁছায় না।",
          },
          {
            key: "D",
            text: "Key টা নিজে থেকে মুছে যায়",
            isCorrect: false,
            explanation: "ssh কখনো আপনার ফাইল মোছে না, শুধু ব্যবহার করতে রাজি হয় না।",
          },
        ],
      },
      {
        id: 5,
        text: "50-cloud-init.conf এ লেখা PasswordAuthentication yes, আর আপনার 99-hardening.conf এ no। sshd -T কী বলবে?",
        options: [
          {
            key: "A",
            text: "no, কারণ শেষে পড়া ফাইলের মান টেকে",
            isCorrect: false,
            explanation: "অনেক Program এ তাই হয়, কিন্তু sshd এর নিয়ম উল্টো।",
          },
          {
            key: "B",
            text: "yes, কারণ sshd প্রথম পাওয়া মানটা রাখে আর 50 নামের ফাইল আগে পড়া হয়",
            isCorrect: true,
            explanation:
              "ঠিক। কোনো Error ছাড়াই Password খোলা থেকে যায়। নিজের ফাইলের নাম 10-hardening.conf রাখুন আর sshd -T দিয়ে মিলিয়ে নিন।",
          },
          {
            key: "C",
            text: "sshd চালুই হবে না, কারণ দুইটা মান সাংঘর্ষিক",
            isCorrect: false,
            explanation: "sshd এটাকে ভুল মনে করে না, পরের মানগুলো চুপচাপ উপেক্ষা করে। এই কারণেই ফাঁদটা বিপজ্জনক।",
          },
          {
            key: "D",
            text: "মূল sshd_config যা বলে, সেটাই",
            isCorrect: false,
            explanation:
              "মূল ফাইলের শুরুতেই Include লাইন, তাই Folder এর ফাইলগুলো মূল ফাইলের বাকি লাইনের আগে পড়া হয়।",
          },
        ],
      },
      {
        id: 6,
        text: "sshd এর নিয়ম বদলানোর পরে সবচেয়ে নিরাপদ ক্রম কোনটা?",
        options: [
          {
            key: "A",
            text: "Restart, তারপর একমাত্র Terminal টা বন্ধ করে নতুন করে Login",
            isCorrect: false,
            explanation: "নিয়মে ভুল থাকলে আপনি বাইরে আটকে যাবেন, আর ফেরার পথ শুধু Web Console।",
          },
          {
            key: "B",
            text: "sshd -t, তারপর Reload, তারপর sshd -T, তারপর পুরনো Session খোলা রেখে নতুন Terminal এ Login পরীক্ষা",
            isCorrect: true,
            explanation:
              "ঠিক। বানান আগে ধরা পড়ে, আসল মান দেখা যায়, আর পুরনো Session টা থাকে নিরাপদ জাল হয়ে, কারণ Reload বা Restart এ খোলা Session কাটে না।",
          },
          {
            key: "C",
            text: "Server Restart দিয়ে দেখা সব ঠিক আছে কি না",
            isCorrect: false,
            explanation: "এতে আপনার নিজের Session ও যায়, আর ভুল থাকলে Server ফিরে আসে আপনাকে বাইরে রেখে।",
          },
          {
            key: "D",
            text: "sshd_config মুছে নতুন করে লেখা",
            isCorrect: false,
            explanation:
              "মূল ফাইল না ছুঁয়ে sshd_config.d তে নিজের ফাইল রাখাই নিয়ম, যাতে হালনাগাদের সময় ঝামেলা না হয়।",
          },
        ],
      },
      {
        id: 7,
        text: "Ubuntu 24.04 এ sshd_config এ Port 2222 লিখে Reload দিলেন, কিন্তু sshd এখনো 22 এ। কেন?",
        options: [
          {
            key: "A",
            text: "Port 22 বদলানো যায় না",
            isCorrect: false,
            explanation: "যায়, শুধু Ubuntu 24.04 এ পথটা আলাদা।",
          },
          {
            key: "B",
            text: "Port এ শোনে systemd এর ssh.socket। daemon-reload দিয়ে নতুন Port পড়াতে হয়, তারপর ssh.socket Restart",
            isCorrect: true,
            explanation:
              "ঠিক। sshd-socket-generator sshd_config এর Port পড়ে Socket এর Setting বানায়। আর এর আগে Firewall এ নতুন Port খুলতে ভুলবেন না।",
          },
          {
            key: "C",
            text: "Firewall নতুন Port আটকে রেখেছে",
            isCorrect: false,
            explanation: "Firewall আটকালে বাইরে থেকে Connect হতো না, কিন্তু ss এ Server নিজে কোন Port এ শুনছে সেটা Firewall বদলায় না।",
          },
          {
            key: "D",
            text: "PasswordAuthentication চালু থাকায়",
            isCorrect: false,
            explanation: "Port আর Login এর পদ্ধতির মধ্যে কোনো সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 8,
        text: "Laptop এর Database Tool দিয়ে Server এর PostgreSQL দেখতে চান, যেটা শুধু 127.0.0.1:5432 এ শোনে। সঠিক উপায়?",
        options: [
          {
            key: "A",
            text: "Firewall এ 5432 খুলে PostgreSQL কে 0.0.0.0 এ শোনানো",
            isCorrect: false,
            explanation: "এতে Database পুরো Internet এর সামনে দাঁড়ায়। Island Tours এ এটা কখনো করা হয় না।",
          },
          {
            key: "B",
            text: "ssh -N -L 5433:127.0.0.1:5432 island, তারপর Tool কে 127.0.0.1:5433 এ যুক্ত করা",
            isCorrect: true,
            explanation:
              "ঠিক। SSH এর তালাবন্ধ পথ দিয়ে Laptop এর 5433 থেকে Server এর ভেতরের 5432 পর্যন্ত সুড়ঙ্গ। কোনো নতুন Port খুলতে হয় না।",
          },
          {
            key: "C",
            text: "ssh -A দিয়ে Agent Forwarding চালু করা",
            isCorrect: false,
            explanation: "Agent Forwarding Key ধার দেয়, Port পার করায় না। আর এটা ঝুঁকিপূর্ণ।",
          },
          {
            key: "D",
            text: "scp দিয়ে Database এর ফাইল Laptop এ নামানো",
            isCorrect: false,
            explanation: "চলমান Database এর ফাইল কপি করলে ভাঙা কপি আসে, আর এটা Data দেখার উপায়ও নয়।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "দুইটা যন্ত্রে SSH, প্রথম দেখা থেকে সুড়ঙ্গ পর্যন্ত",
    subtitle: "Docker এর দুইটা Container, একটা Laptop আর একটা Server",
    stepName: "LAB",
    steps: [
      {
        title: "দুইটা যন্ত্র বানান",
        description:
          "Docker দিয়ে দুইটা Ubuntu 24.04 Container: একটা laptop, একটা island-vps-01 নামে Server। দুইটা Terminal খুলে রাখুন। আসল VPS থাকলে সেটাও চলবে, তখন Server এর নাম বদলে নিন।",
      },
      {
        title: "Key বানান আর Agent কে দিন",
        description:
          "Laptop এ Passphrase সহ Ed25519 Key, ফাইল দুইটার Permission দেখুন, তারপর ssh-agent এ Load করে ssh-add -l দিয়ে মিলিয়ে নিন।",
      },
      {
        title: "প্রথম দেখা, আর পরিচয় বদলে যাওয়া",
        description:
          "Server এ deploy বানান আর আসল Fingerprint লিখে রাখুন। Laptop থেকে প্রথমবার Connect করে মিলিয়ে yes দিন। তারপর Server এর Host Key নতুন করে বানিয়ে বড় সতর্কবার্তাটা নিজের চোখে দেখুন, আর সঠিকভাবে সারান।",
      },
      {
        title: "Key বসান আর ভুল Permission ঘটান",
        description:
          "ssh-copy-id দিয়ে Key বসান, ssh -v দিয়ে দেখুন Key দিয়ে ঢোকা হলো। তারপর Private Key এর Permission ইচ্ছা করে খুলে দিয়ে ssh এর রাগ দেখুন, আর ঠিক করুন।",
      },
      {
        title: "দরজা কড়া করুন, ফাঁদ সহ",
        description:
          "50-cloud-init.conf এর ফাঁদটা নিজে বানান, 99 নামের ফাইলে নিয়ম লিখে দেখুন কাজ করে না, নাম বদলে 10 করুন। sshd -t, Reload, আর পুরনো Session খোলা রেখে তিনটা Login পরীক্ষা।",
      },
      {
        title: "ডাকনাম, rsync আর সুড়ঙ্গ",
        description:
          "~/.ssh/config এ island ডাকনাম, rsync দিয়ে একটা Folder দুইবার পাঠিয়ে তফাত দেখুন, আর Server এর ভেতরে শুধু 127.0.0.1 এ শোনা একটা Port এ ssh -L দিয়ে পৌঁছান।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-practice-setup.sh",
        language: "bash",
        code: `# আপনার নিজের যন্ত্রে, যেখানে Docker আছে। একবারই চালান।
# দুইটা Ubuntu 24.04 Container: একটা আপনার Laptop এর ভূমিকায়, একটা Server এর।
docker network create ssh-lab
docker run -d --name ssh-lab-server --hostname island-vps-01 --network ssh-lab ubuntu:24.04 sleep infinity
docker run -d --name ssh-lab-laptop --hostname laptop --network ssh-lab ubuntu:24.04 sleep infinity

# Server এ OpenSSH Server বসানো আর চালু করা
docker exec ssh-lab-server bash -c '
  apt-get update -qq && apt-get install -y -qq openssh-server rsync sudo netcat-openbsd >/dev/null &&
  mkdir -p /run/sshd && /usr/sbin/sshd && echo server-ready'

# Laptop এ শুধু SSH Client, আর আপনার নামে একজন সাধারণ User
docker exec ssh-lab-laptop bash -c '
  apt-get update -qq && apt-get install -y -qq openssh-client rsync netcat-openbsd >/dev/null &&
  useradd -m -s /bin/bash you && echo laptop-ready'

# এবার দুইটা আলাদা Terminal খুলুন
docker exec -it -u you -w /home/you ssh-lab-laptop bash   # Terminal ১: আপনার Laptop
docker exec -it ssh-lab-server bash                       # Terminal ২: Server, root হিসেবে,
                                                          # ঠিক Provider এর Web Console এর মতো

# সব শেষে পরিষ্কার করতে
docker rm -f ssh-lab-laptop ssh-lab-server && docker network rm ssh-lab`,
      },
      {
        filename: "2-make-key.sh",
        language: "bash",
        code: `# Terminal ১ (Laptop)। একটা Passphrase দিন, যেটা মনে থাকবে।
ssh-keygen -t ed25519 -C "you@laptop"     # ফাইলের নামে শুধু Enter
ls -la ~/.ssh
# -rw------- 1 you you  444 ... id_ed25519        <- Private, শুধু আপনি
# -rw-r--r-- 1 you you   92 ... id_ed25519.pub    <- Public, সবাই পড়তে পারে
cat ~/.ssh/id_ed25519.pub                 # এটা দেখানো নিরাপদ

eval "$(ssh-agent -s)"                    # এই Terminal এর জন্য একটা Agent
ssh-add ~/.ssh/id_ed25519                 # Passphrase একবার চাইবে
ssh-add -l
# 256 SHA256:... you@laptop (ED25519)`,
      },
      {
        filename: "3-first-meeting.sh",
        language: "bash",
        code: `# Terminal ২ (Server, root): deploy User আর Server এর আসল Fingerprint
adduser deploy                 # একটা Password দিন, শুধু sudo আর প্রথম Key কপির জন্য
usermod -aG sudo deploy
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
# 256 SHA256:6OAZLy...3tsE root@island-vps-01 (ED25519)   <- কাগজে লিখে রাখুন

# Terminal ১ (Laptop): প্রথমবার Connect
ssh deploy@ssh-lab-server
# ED25519 key fingerprint is SHA256:6OAZLy...3tsE   <- কাগজের সাথে মিলিয়ে yes
# তারপর deploy এর Password। ঢুকে whoami, তারপর exit।

# Terminal ২ (Server): যেন Server টা নতুন করে বানানো হলো
rm /etc/ssh/ssh_host_* && ssh-keygen -A && kill -HUP $(cat /run/sshd.pid)
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub      # নতুন Fingerprint, এটাও লিখুন

# Terminal ১ (Laptop): আবার Connect
ssh deploy@ssh-lab-server
# @    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
# ...
# Host key verification failed.
# নতুন Fingerprint টা কাগজের দ্বিতীয় লাইনের সাথে মেলে? তবেই:
ssh-keygen -R ssh-lab-server`,
      },
      {
        filename: "4-install-key.sh",
        language: "bash",
        code: `# Terminal ১ (Laptop)
ssh-copy-id deploy@ssh-lab-server        # নতুন Fingerprint মিলিয়ে yes, তারপর শেষবারের মতো Password
# Number of key(s) added: 1

ssh deploy@ssh-lab-server 'whoami'       # এবার কোনো Password চাইবে না
ssh -v deploy@ssh-lab-server true 2>&1 | grep -E "Offering|accepts|Authenticated"
# debug1: Offering public key: /home/you/.ssh/id_ed25519 ED25519 SHA256:... agent
# debug1: Server accepts key: /home/you/.ssh/id_ed25519 ED25519 SHA256:... agent
# Authenticated to ssh-lab-server ([172.x.x.x]:22) using "publickey".

# ইচ্ছা করে Private Key এর Permission খুলে দিন, Agent ছাড়া চেষ্টা করুন
chmod 644 ~/.ssh/id_ed25519
SSH_AUTH_SOCK= ssh deploy@ssh-lab-server true
# Permissions 0644 for '/home/you/.ssh/id_ed25519' are too open.
# Load key "/home/you/.ssh/id_ed25519": bad permissions
# (Password এখনো চালু, তাই Password চাইবে: Ctrl+C দিন)
chmod 600 ~/.ssh/id_ed25519`,
      },
      {
        filename: "5-harden.sh",
        language: "bash",
        code: `# Terminal ২ (Server, root)
# অনেক Provider এর Image এ cloud-init এমন একটা ফাইল রেখে যায়। এখানে নিজে বানিয়ে ফাঁদটা দেখছি।
echo "PasswordAuthentication yes" > /etc/ssh/sshd_config.d/50-cloud-init.conf

cat > /etc/ssh/sshd_config.d/99-hardening.conf <<'EOF'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
EOF
sshd -T | grep -E "^(passwordauthentication|permitrootlogin) "
# permitrootlogin no
# passwordauthentication yes        <- ফাঁদ: 50 আগে পড়া হয়েছে

mv /etc/ssh/sshd_config.d/99-hardening.conf /etc/ssh/sshd_config.d/10-hardening.conf
sshd -T | grep -E "^(passwordauthentication|permitrootlogin) "
# permitrootlogin no
# passwordauthentication no

sshd -t && kill -HUP $(cat /run/sshd.pid)
# আসল VPS এ এই লাইনের বদলে: sudo sshd -t && sudo systemctl reload ssh

# Terminal ১ (Laptop): পুরনো Session বন্ধ করবেন না, তিনটা পরীক্ষা
ssh deploy@ssh-lab-server 'echo key login works'     # key login works
ssh -o PubkeyAuthentication=no deploy@ssh-lab-server  # Permission denied (publickey).
ssh root@ssh-lab-server                               # Permission denied (publickey).`,
      },
      {
        filename: "6-config-rsync-tunnel.sh",
        language: "bash",
        code: `# Terminal ২ (Server): ভেতরে শুধু 127.0.0.1:5432 এ শোনা একটা নকল "Database"
while true; do echo "hello from 127.0.0.1:5432 on island-vps-01" | nc -l -q 1 127.0.0.1 5432; done &

# Terminal ১ (Laptop): একটা ডাকনাম
cat >> ~/.ssh/config <<'EOF'
Host island
    HostName ssh-lab-server
    User deploy
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
    ServerAliveInterval 30
EOF
chmod 600 ~/.ssh/config
ssh island hostname                      # island-vps-01

# একটা Folder পাঠান, একটা ফাইল বদলে আবার পাঠান, দেখুন দ্বিতীয়বার শুধু সেটাই যায়
mkdir -p my-tours/src && echo "console.log(1)" > my-tours/src/server.js && echo "{}" > my-tours/package.json
rsync -avz my-tours/ island:/home/deploy/my-tours/
echo "// v2" >> my-tours/src/server.js
rsync -avz my-tours/ island:/home/deploy/my-tours/

# সরাসরি 5432: বন্ধ
nc -vz -w 3 ssh-lab-server 5432          # ... failed: Connection refused

# তৃতীয় একটা Terminal খুলুন (আবার Laptop), সেখানে সুড়ঙ্গ চালু রাখুন:
#   docker exec -it -u you -w /home/you ssh-lab-laptop bash
#   ssh -N -L 5433:127.0.0.1:5432 island     (কিছু দেখাবে না, চলতে থাকবে)
# Terminal ১ এ ফিরে:
nc -w 3 127.0.0.1 5433                   # hello from 127.0.0.1:5432 on island-vps-01
# শেষে সুড়ঙ্গের Terminal এ Ctrl+C`,
      },
    ],
    tip: "পরীক্ষা ৩ আর ৫ পাশাপাশি রেখে ভাবুন, কারণ দুইটাতেই আপনি ssh কে থামতে দেখেছেন, কিন্তু দুই জায়গায় দুই কারণে। ৩ নম্বরে ssh থেমেছে Server কে চিনতে না পেরে, আপনাকে চেনার ধাপ শুরুই হয়নি। ৫ নম্বরে Server আপনাকে চিনতে রাজি হয়নি, কারণ যে দরজা দিয়ে চেষ্টা করছেন সেটা আপনি নিজেই বন্ধ করেছেন। বাস্তবে যেকোনো SSH সমস্যায় প্রথম প্রশ্ন এটাই: কোন ধাপে থামল। ssh -v এর Output এ শেষ সফল লাইনটা খুঁজুন। Host is known এর আগে থামলে সমস্যা Network বা Host Key এ, তার পরে থামলে সমস্যা আপনার Key, Permission বা sshd এর নিয়মে। আর মনে রাখবেন, Server এর দিকের আসল কারণ আপনার Terminal এ কখনো আসে না, সেটা আছে Server এর auth.log এ।",
  },
  assignment: {
    title: "Mini Project: my-tours এর Server এ ঢোকার নিয়মপত্র",
    time: "৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>নিজের Key আর Agent:</strong> নিজের Laptop এ Passphrase সহ একটা Ed25519 Key
        বানান, মন্তব্যে নিজের আর যন্ত্রের নাম দিয়ে। আপনার অপারেটিং সিস্টেমের নিয়মে Agent এমনভাবে
        সাজান যাতে Restart এর পরেও বারবার Passphrase লিখতে না হয়। <code>ls -la ~/.ssh</code> আর{" "}
        <code>ssh-add -l</code> এর Output জমা দিন, আর এক লাইনে লিখুন Passphrase টা কোথায় রাখা আছে।
      </span>,
      <span key="2">
        <strong>প্রথম ঘণ্টা, পুরোটা:</strong> Lab এর Practice Server এ, বা আসল VPS থাকলে সেখানে,
        অংশ ০০৯ আর ০১০ এর পুরো ক্রমটা নিজে করুন: হালনাগাদ, deploy, sudo, Key কপি, নতুন Terminal এ
        পরীক্ষা, 10-hardening.conf, sshd -t, Reload। শেষে <code>sudo sshd -T</code> এর
        passwordauthentication আর permitrootlogin লাইন দুইটা, আর তিনটা Login পরীক্ষার Output জমা দিন।
      </span>,
      <span key="3">
        <strong>Fingerprint মেলানো, আর ভাঙা:</strong> Server এর আসল Fingerprint Console বা Server এর
        Terminal থেকে নিন, প্রথম Connection এ মিলিয়ে yes দিন। তারপর Host Key নতুন করে বানিয়ে
        সতর্কবার্তাটা ঘটান আর সঠিক তিন ধাপে সারান। দুইটা Fingerprint আর সতর্কবার্তার Output জমা দিন,
        আর তিন লাইনে লিখুন কীভাবে নিশ্চিত হলেন যে নতুনটা আসল।
      </span>,
      <span key="4">
        <strong>my-tours এর Access নিয়মপত্র:</strong> এক পাতার একটা Runbook লিখুন: Server এর Host
        Key Fingerprint, কে কে কোন Key দিয়ে ঢুকতে পারে, নতুন সহকর্মী যোগ করার ধাপ, কেউ দল ছাড়লে বা
        Laptop হারালে কী কী করতে হবে, আর বাইরে আটকে পড়লে Console দিয়ে ফেরার ধাপ। সাথে দিন{" "}
        <code>my-tours</code> ডাকনামের একটা <code>~/.ssh/config</code> Block, আর নিজের Database এ
        পৌঁছানোর ssh -L Command।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন নতুন সদস্য লিখেছেন, Password দিয়েই
        তো দিব্যি ঢুকছি, Key এর ঝামেলা কেন? আর আজ সকালে ঢুকতে গেলে বড় করে লিখল HOST IDENTIFICATION
        HAS CHANGED, yes চাপলেই তো হয়ে যায়, তাই না? তাঁকে দশ লাইনে বোঝান Password আর Key এর আসল
        তফাত কোথায়, Host Key কী পাহারা দেয়, আর ওই সতর্কবার্তা দেখলে ঠিক কোন তিনটা কাজ করতে হয়।
      </span>,
    ],
    deliverables: [
      <span key="1">ls -la ~/.ssh আর ssh-add -l এর Output, Passphrase কোথায় রাখা তার এক লাইন</span>,
      <span key="2">sshd -T এর দুইটা লাইন আর তিনটা Login পরীক্ষার Output</span>,
      <span key="3">দুইটা Fingerprint, সতর্কবার্তার Output, আর যাচাইয়ের তিন লাইন</span>,
      <span key="4">my-tours এর এক পাতার Access Runbook, config Block আর ssh -L Command সহ</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
