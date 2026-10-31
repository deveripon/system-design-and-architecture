/**
 * What: Module 07 Lesson 06, Firewall Management with ufw. It explains what a firewall decides and
 * where (netfilter in the kernel, iptables and nftables underneath, ufw on top), why replies to the
 * server's own connections get in, how to turn ufw on without locking yourself out, the rule language,
 * deny against reject, rule order, source limits and limit, reading block logs, the Docker trap that
 * skips ufw, the provider's cloud firewall, and Island Tours' exact rule set.
 *
 * Why: A VPS has a public address from the first minute, so every listening program is one mistake
 * away from the whole internet. Every command output in this lesson was captured on a practice server
 * (Ubuntu 24.04 with systemd in a container) knocked on from a second machine, except the one block
 * log line, which a container cannot produce and is labelled as the shape a real VPS prints.
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
  DenyRejectLab,
  LimitLab,
  RuleOrderLab,
  UfwCommandLab,
} from "../../../components/course/topics/linux/ufw-animations";
import {
  DockerBypassDiagram,
  FirewallGateDiagram,
  LockoutSplit,
  StatefulSplit,
  TwoWallsDiagram,
  UfwLayersDiagram,
} from "../../../components/course/topics/linux/ufw-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

const lessonLink = (id: string, label: string) => (
  <Link href={`/devops/topic/${id}`} className="text-primary underline underline-offset-4">
    {label}
  </Link>
);

const external = (href: string, label: string) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary underline underline-offset-4"
  >
    {label}
  </a>
);

export const firewallUfwContent: TopicData = {
  id: "firewall-ufw",
  introduction: {
    badge: "MODULE 07 · LESSON 06",
    title: <SectionTitle>Server এর দরজায় একজন দারোয়ান</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          গতকাল রাতে আপনি নতুন VPS টা বানালেন, SSH Key বসালেন, Password Login বন্ধ করলেন।
          আজ সকালে কৌতূহলে একবার দেখলেন Server এ কে কোন Port এ শুনছে। তালিকায় একটা
          লাইন চোখে আটকে গেল: PostgreSQL শুনছে <code>0.0.0.0:5432</code> এ। দলের একজন কাল
          একটা দ্রুত পরীক্ষার জন্য Docker দিয়ে Database চালিয়েছিলেন, আর বন্ধ করতে ভুলে
          গেছেন। মানে আপনার Database এর দরজা এই মুহূর্তে পুরো পৃথিবীর দিকে খোলা।
        </ContentParagraph>
        <ContentParagraph>
          ভয় পাওয়ার মতো কথাটা হলো, এটা খুঁজে পেতে কাউকে আপনার নাম জানতে হয় না। একটা VPS
          জন্মের প্রথম মিনিট থেকেই একটা Public IP নিয়ে রাস্তায় দাঁড়িয়ে থাকে। লেসন ০৩ এ
          দেখেছেন, কয়েক মিনিটের মধ্যেই অচেনা যন্ত্র SSH এ টোকা দিতে শুরু করে। একই যন্ত্রগুলো
          5432, 6379, 3000 সহ সব পরিচিত দরজায় টোকা দেয়, দিনরাত, কোনো বিরতি ছাড়া।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন Firewall আসলে কী সিদ্ধান্ত নেয় আর কোথায় বসে নেয়, ufw কীভাবে
          Rule টা Kernel পর্যন্ত পৌঁছায়, নিজেকে তালাবন্ধ না করে কীভাবে চালু করতে হয়, Rule লেখা,
          সাজানো আর মোছার ভাষা, deny আর reject এর তফাত, limit, Block এর Log পড়া, Docker এর সেই
          ফাঁদ যা ufw কে না জানিয়েই দরজা খুলে দেয়, আর Provider এর Cloud Firewall দিয়ে বাইরে
          আরেকটা দেয়াল। শেষে Island Tours এর হুবহু Rule গুলো দেখবেন, আর নিজের my-tours এর জন্য
          লিখবেন।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনের প্রতিটা আউটপুট একটা Practice Server থেকে নেওয়া, যেটা লেসন ০১ এর মতো করে
          চালানো একটা Ubuntu 24.04, নাম <code>island-vps-01</code>। বাইরে থেকে টোকা দিয়েছে আরেকটা
          যন্ত্র, নাম <code>laptop</code>, আর একটা অচেনা যন্ত্র, নাম <code>stranger</code>। তাদের
          ঠিকানা একটা Practice Network এর: Server <code>172.21.0.2</code>, laptop{" "}
          <code>172.21.0.3</code>, stranger <code>172.21.0.4</code>। আপনার আসল VPS এ এর জায়গায়
          আসল Public IP দেখবেন, যেমন Island Tours এর <code>103.94.135.2</code>।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ভবনের দারোয়ান সবাইকে চেনেন না, চেনার দরকারও নেই। তাঁর হাতে একটা তালিকা থাকে: কোন দরজা কার জন্য খোলা। তালিকায় নাম না থাকলে উত্তর একটাই, এই দরজা দিয়ে ঢোকা যাবে না। আর ভবনের ভেতর থেকে কেউ বাইরে গিয়ে ফিরে এলে তিনি চিনে নেন, কারণ বেরোনোর সময় খাতায় নাম লেখা হয়েছিল।",
      author: "Firewall",
      role: "Lesson 06",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "what-is-firewall",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Firewall কী, আর একটা VPS এর কেন লাগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 05 এর লেসন ০৭ এ দেখেছেন, একটা Server এর ৬৫,৫৩৫ টা Port, আর প্রতিটা Port
                একটা দরজার মতো। কোনো Program যখন একটা Port এ Listen করে, তখন সেই দরজার পেছনে
                কেউ দাঁড়িয়ে থাকে। বাইরে থেকে আসা প্রতিটা Packet এর গায়ে লেখা থাকে সে কোন দরজায়
                যেতে চায়, অর্থাৎ Destination Port।
              </ContentParagraph>
              <ContentParagraph>
                Firewall না থাকলে নিয়মটা খুব সরল: কোনো Program যদি সব Interface এ শোনে, মানে{" "}
                <code>0.0.0.0</code> এ, তাহলে পৃথিবীর যে কেউ তার সাথে কথা বলতে পারে। আর মানুষ
                ভুল করে। একটা পরীক্ষার Server চালু রেখে ভুলে যায়, Docker এ একটা Port Publish করে,
                বা কোনো Program এর Default Setting ই সব Interface এ শোনা। Firewall হলো সেই
                দারোয়ান, যে এই ভুলগুলোর সামনে দাঁড়িয়ে থাকে।
              </ContentParagraph>
              <ContentParagraph>
                এক বাক্যে: <strong>Firewall হলো কিছু Rule এর একটা তালিকা, যা Kernel প্রতিটা
                Packet এর সাথে মিলিয়ে দেখে, আর কোনো Program সেই Packet দেখার আগেই ঠিক করে
                ঢুকতে দেবে কি না।</strong> এই আগেই শব্দটা জরুরি। Firewall আটকালে PostgreSQL
                জানতেই পারে না কেউ এসেছিল।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FirewallGateDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>তিনটা শব্দ এই লেসন জুড়ে বারবার আসবে, এখনই পরিষ্কার করে নিই।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Incoming আর Outgoing:</strong> Incoming মানে বাইরে থেকে কেউ আপনার Server
                  এ নতুন কথা শুরু করতে চাইছে, যেমন পর্যটকের Browser বা আপনার SSH। Outgoing মানে
                  আপনার Server নিজে বাইরে কাউকে ডাকছে, যেমন <code>apt update</code> বা Payment
                  Gateway। Server এর নিরাপত্তার প্রায় পুরোটাই Incoming নিয়ে।
                </ListItem>
                <ListItem>
                  <strong>Rule:</strong> একটা লাইন, যেমন Port 443 এ TCP এলে ঢুকতে দেওয়া। প্রতিটা Rule
                  এর একটা সিদ্ধান্ত থাকে: allow, deny, reject বা limit। চারটাই এই লেসনে আলাদা করে
                  দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>Default Policy:</strong> কোনো Rule না মিললে কী হবে। দুইটা দর্শন আছে। সব
                  খোলা রেখে খারাপগুলো বন্ধ করা, অথবা সব বন্ধ রেখে দরকারিগুলো খোলা। Server এ সবসময়
                  দ্বিতীয়টা, কারণ প্রথমটায় আপনাকে আগে থেকে সব খারাপ জিনিস জানতে হয়, যা অসম্ভব।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                বাসার কথা একবার ভাবুন। Module 03 এর NAT লেসনে দেখেছেন, বাসার Router এর NAT টেবিলে
                কোনো লাইন না থাকলে বাইরে থেকে আসা নতুন Connection ভেতরের কোনো যন্ত্রে পৌঁছাতেই
                পারে না। NAT অজান্তেই একটা Firewall এর কাজ করে দেয়। একটা VPS এর সামনে এরকম কিছু
                নেই। তার নিজের Public IP আছে, সে সরাসরি রাস্তার উপর। তাই এখানে দারোয়ানটা আপনাকে
                নিজে বসাতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের Firewall একটা Packet Filter",
          content: (
            <p>
              যে Firewall নিয়ে এই লেসন, সে Packet এর ভেতরের লেখা পড়ে না। সে দেখে শুধু খামের উপরের
              তথ্য: কোথা থেকে এলো (Source IP), কোথায় যাবে (Destination IP আর Port), কোন Protocol
              (TCP, UDP, ICMP), আর এটা কোনো চলমান কথোপকথনের অংশ কি না। এজন্য এর নাম Packet
              Filter। HTTP এর ভেতর পড়ে খারাপ Request আটকানোর যন্ত্রটা আলাদা জিনিস, তার নাম WAF
              (Web Application Firewall), যেমন Cloudflare এর। দুইটাই Firewall নামে ডাকা হয়, কিন্তু
              কাজ সম্পূর্ণ আলাদা।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Firewall একটা স্তর, পুরো নিরাপত্তা নয়",
          content: (
            <p>
              Firewall দুর্বল Password সারায় না, খোলা দরজার পেছনের Program এর Bug সারায় না, আর
              কোনো Program কে ভুল ঠিকানায় শোনা থেকে আটকায় না। সঠিক জবাব আগে থেকেই দুইটা: যে
              Program শুধু ভেতরের জন্য, সেটা শুধু <code>127.0.0.1</code> এ শুনবে (Module 05 এর
              লেসন ০৭), আর SSH চলবে শুধু Key দিয়ে (লেসন ০৩)। Firewall হলো তার উপরের স্তর, যাতে
              একটা ভুল হলেও দরজা খুলে না যায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "layers",
      subHeader: { index: "002", title: "Where It Lives" },
      title: <SectionTitle>দারোয়ান আসলে কোথায় দাঁড়িয়ে: netfilter, iptables আর ufw</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ufw শুনলে মনে হয় এটাই Firewall। আসলে ufw হলো তিন তলা উপরের একটা দোভাষী। আসল
                দারোয়ান বসে Kernel এর ভেতরে। নিচ থেকে উপরে তিনটা নাম চিনে নিন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>netfilter:</strong> Linux Kernel এর ভেতরের সেই অংশ, যেখান দিয়ে প্রতিটা
                  Packet যায় আর যেখানে Rule গুলো মেলানো হয়। Rule গুলো সাজানো থাকে কয়েকটা চেইনে।
                  এই লেসনের জন্য তিনটা চেইন যথেষ্ট: <code>INPUT</code>, এই যন্ত্রের নিজের জন্য আসা
                  Packet; <code>OUTPUT</code>, এই যন্ত্র থেকে বের হওয়া Packet; আর{" "}
                  <code>FORWARD</code>, যে Packet এই যন্ত্রের ভেতর দিয়ে অন্য কোথাও যাচ্ছে।
                </ListItem>
                <ListItem>
                  <strong>iptables আর nftables:</strong> netfilter এ Rule লেখার Tool। iptables
                  পুরনো আর বিখ্যাত, nftables তার নতুন উত্তরসূরি। Ubuntu 24.04 এ{" "}
                  <code>iptables</code> কমান্ডটা আসলে পেছনে nftables এ লেখে, নিচের আউটপুটে{" "}
                  <code>(nf_tables)</code> শব্দটা সেটাই বলছে।
                </ListItem>
                <ListItem>
                  <strong>ufw:</strong> Uncomplicated Firewall, Ubuntu এর নিজের সহজ মুখ। আপনি
                  লেখেন <code>ufw allow 443/tcp</code>, ufw সেটাকে iptables এর লম্বা Rule এ অনুবাদ
                  করে, আর আপনার Rule গুলো একটা ফাইলে লিখে রাখে যাতে Reboot এর পরও থাকে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <UfwLayersDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Practice Server এ ufw চালু করার পর নিচের তলায় কী বসল, সেটা নিজের চোখে দেখা যায়।{" "}
              <code>iptables -S INPUT</code> দেখায় INPUT চেইনের Rule গুলো, ঠিক যে ক্রমে Kernel
              মেলায়। সব কয়টা লাইন ufw নিজে বসিয়েছে, আপনাকে একটাও লিখতে হয়নি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "who-is-underneath.sh",
          code: `deploy@island-vps-01:~$ sudo ufw version
ufw 0.36.2
Copyright 2008-2023 Canonical Ltd.

deploy@island-vps-01:~$ sudo iptables -V
iptables v1.8.10 (nf_tables)

# ufw চালু হওয়ার পর INPUT চেইন: প্রথম লাইনে Default নীতি DROP, তারপর ufw এর নিজের চেইনগুলো
deploy@island-vps-01:~$ sudo iptables -S INPUT
-P INPUT DROP
-A INPUT -j ufw-before-logging-input
-A INPUT -j ufw-before-input
-A INPUT -j ufw-after-input
-A INPUT -j ufw-after-logging-input
-A INPUT -j ufw-reject-input
-A INPUT -j ufw-track-input`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম লাইনটা পড়ুন: <code>-P INPUT DROP</code>। P মানে Policy, Default। কোনো Rule না
              মিললে Packet ফেলে দেওয়া হবে। বাকি লাইনগুলো Packet কে ufw এর বানানো চেইনগুলোতে পাঠায়,
              আর তাদের একটা, <code>ufw-user-input</code>, এ থাকে আপনার নিজের লেখা Rule গুলো। ufw
              এর তিনটা ফাইল চিনে রাখুন: <code>/etc/default/ufw</code> এ Default নীতি,{" "}
              <code>/etc/ufw/user.rules</code> এ আপনার Rule, আর <code>/etc/ufw/before.rules</code>{" "}
              এ সেই Rule গুলো যা আপনার Rule এর আগে চলে। আর <code>ufw.service</code> নামের systemd
              Unit (লেসন ০২) Boot এর সময় সব আবার Kernel এ বসায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "একটা যন্ত্রে একজনই দারোয়ান",
          content: (
            <p>
              ufw চালু থাকা অবস্থায় হাতে <code>iptables</code> দিয়ে Rule বসাবেন না, আর একই
              যন্ত্রে firewalld এর মতো আরেকটা Firewall Manager চালাবেন না। দুইজন একই তালিকায়
              লিখলে একজন আরেকজনের লেখা মুছে দেয়, আর Reboot এর পর কোন Rule টিকে থাকবে তা কেউ বলতে
              পারে না। Fedora আর RHEL পরিবারে firewalld স্বাভাবিক, Ubuntu তে ufw। যে Server এ যেটা
              আছে, শুধু সেটাই ব্যবহার করুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "stateful",
      subHeader: { index: "003", title: "Stateful" },
      title: <SectionTitle>নিজের শুরু করা কথার উত্তর ঠিকই ঢোকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ধাঁধা দিয়ে শুরু করি। ufw এর Default নীতি deny incoming, মানে বাইরে থেকে আসা
                সবকিছু বাদ। অথচ Server যখন <code>apt update</code> চালায়, Ubuntu এর Server থেকে
                উত্তর আসে বাইরে থেকেই। Payment Gateway এর উত্তরও বাইরে থেকে আসে। তাহলে সেগুলো
                ঢোকে কীভাবে?
              </ContentParagraph>
              <ContentParagraph>
                উত্তর হলো, Kernel একটা খাতা রাখে, যার নাম conntrack, Connection Tracking। Module
                05 এ দেখেছেন, একটা TCP Connection এর পরিচয় চারটা সংখ্যা: দুই পাশের IP আর Port।
                Server নিজে যখন বাইরে কোনো Connection শুরু করে, Kernel খাতায় লিখে রাখে। উত্তর ফিরে
                এলে Firewall খাতা মিলিয়ে দেখে, এটা চেনা কথোপকথনের অংশ, তার নাম ESTABLISHED, আর
                ঢুকতে দেয়। আপনার লেখা কোনো Rule এর দরকার পড়ে না। যে Firewall এভাবে কথোপকথন মনে
                রাখে, তাকে বলে Stateful Firewall।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StatefulSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এটা বিশ্বাসের উপর ছেড়ে দেওয়ার দরকার নেই। ufw এর <code>ufw-before-input</code>{" "}
              চেইনের প্রথম কয়েকটা লাইন, যা আপনার নিজের Rule এর আগে চলে, পুরো ব্যাপারটা লিখে রেখেছে।
              আর পাশে একটা পরীক্ষা: Incoming সব বন্ধ থাকা অবস্থায় Server নিজে laptop এর একটা Port
              এ ডাকল, উত্তর এলো 200।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "before-your-rules.sh",
          code: `deploy@island-vps-01:~$ sudo iptables -S ufw-before-input | head -10
-N ufw-before-input
-A ufw-before-input -i lo -j ACCEPT
-A ufw-before-input -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
-A ufw-before-input -m conntrack --ctstate INVALID -j ufw-logging-deny
-A ufw-before-input -m conntrack --ctstate INVALID -j DROP
-A ufw-before-input -p icmp -m icmp --icmp-type 3 -j ACCEPT
-A ufw-before-input -p icmp -m icmp --icmp-type 11 -j ACCEPT
-A ufw-before-input -p icmp -m icmp --icmp-type 12 -j ACCEPT
-A ufw-before-input -p icmp -m icmp --icmp-type 8 -j ACCEPT
-A ufw-before-input -p udp -m udp --sport 67 --dport 68 -j ACCEPT

# Incoming সব বন্ধ, তবুও Server নিজে বাইরে ডাকলে উত্তর ফেরে
deploy@island-vps-01:~$ curl -s -o /dev/null -w "VPS -> laptop:8080 : %{http_code}\\n" http://laptop:8080/
VPS -> laptop:8080 : 200

# Server নিজের সাথে কথা বলে lo দিয়ে, সেখানে ufw প্রশ্নই করে না
deploy@island-vps-01:~$ curl -s -o /dev/null -w "from the VPS itself: %{http_code}\\n" http://127.0.0.1:3000/
from the VPS itself: 200`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>লাইনগুলো একটা একটা করে পড়ি।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>-i lo -j ACCEPT</code>: lo হলো Loopback, যন্ত্রের নিজের সাথে নিজের কথা বলার
                  রাস্তা, <code>127.0.0.1</code>। এখানে যা আসে সব ঢোকে। এজন্যই Caddy একই Server এ
                  <code> 127.0.0.1:3000</code> এর App কে ডাকতে পারে, ufw এ 3000 খোলা না থাকলেও।
                </ListItem>
                <ListItem>
                  <code>RELATED,ESTABLISHED -j ACCEPT</code>: খাতায় যার নাম আছে, সে ঢুকবে। ধাঁধার
                  উত্তর এই লাইনটাই।
                </ListItem>
                <ListItem>
                  <code>INVALID -j DROP</code>: যে Packet কোনো কথোপকথনের সাথেই মেলে না, যেমন হঠাৎ
                  আসা একটা ACK যার আগে কোনো SYN ছিল না, সেটা বাদ।
                </ListItem>
                <ListItem>
                  <code>icmp-type 3, 11, 12, 8</code>: কিছু ICMP বার্তা ঢুকতে দেওয়া হয়। Type 8 হলো
                  ping, তাই ufw চালু থাকলেও Server ping এর উত্তর দেয়। Type 3 এর একটা অংশ বলে Packet
                  বড় বেশি, ছোট করে পাঠাতে হবে, যা Module 05 এর MTU লেসনের Path MTU Discovery র জন্য
                  দরকার। ICMP পুরো বন্ধ করলে কিছু Connection রহস্যময়ভাবে আটকে যায়।
                </ListItem>
                <ListItem>
                  <code>--sport 67 --dport 68</code>: DHCP এর উত্তর (Module 03), যাতে Server নিজের
                  ঠিকানা পেতে পারে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ping-still-works.sh",
          code: `# ufw চালু, deny incoming, তবুও ping এর উত্তর আসে, কারণ icmp-type 8 আগেই ACCEPT
you@laptop:~$ ping -c 2 -W 2 island-vps-01
2 packets transmitted, 2 received, 0% packet loss, time 1002ms
rtt min/avg/max/mdev = 0.031/0.060/0.089/0.029 ms`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "who-listens",
      subHeader: { index: "004", title: "Look First" },
      title: <SectionTitle>তালা দেওয়ার আগে দেখুন কে কোন দরজায় শুনছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Rule লেখার আগে প্রথম কাজ হলো জানা, Server এ এখন কোন দরজাগুলোর পেছনে কেউ দাঁড়িয়ে।
                এর জন্য একটা কমান্ড, <code>ss -tlnp</code>। অক্ষরগুলোর মানে: t মানে TCP, l মানে
                শুধু যারা Listen করছে, n মানে নামের বদলে সংখ্যা দেখানো, p মানে কোন Process।{" "}
                <code>sudo</code> লাগে, নইলে অন্য User এর Process এর নাম দেখায় না। এই Tool এর
                পুরো গল্প লেসন ০৯ এ, এখানে শুধু তালিকাটা পড়তে শিখি।
              </ContentParagraph>
              <ContentParagraph>
                Practice Server এ পরীক্ষার জন্য কয়েকটা ছোট Program চালানো হয়েছিল, যারা Caddy, App,
                PostgreSQL আর Redis এর ভান করছে। সবাই ইচ্ছা করে <code>0.0.0.0</code> এ, যাতে ভুলটা
                দেখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "who-listens.sh",
          code: `deploy@island-vps-01:~$ sudo ss -tlnp
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      5            0.0.0.0:3000       0.0.0.0:*    users:(("python3",pid=134,fd=3))
LISTEN 0      5            0.0.0.0:6379       0.0.0.0:*    users:(("python3",pid=138,fd=3))
LISTEN 0      5            0.0.0.0:5432       0.0.0.0:*    users:(("python3",pid=136,fd=3))
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=128,fd=3),("systemd",pid=1,fd=48))
LISTEN 0      5            0.0.0.0:80         0.0.0.0:*    users:(("python3",pid=130,fd=3))
LISTEN 0      5            0.0.0.0:443        0.0.0.0:*    users:(("python3",pid=132,fd=3))
LISTEN 0      4096            [::]:22            [::]:*    users:(("sshd",pid=128,fd=4),("systemd",pid=1,fd=49))
# (Practice Container এর নিজের একটা DNS লাইন এখান থেকে বাদ দেওয়া হয়েছে)

# ufw চালুর আগে, বাইরে থেকে প্রতিটা দরজায় টোকা
you@laptop:~$ for p in 22 80 443 3000 5432 6379; do nc -vz -w 3 island-vps-01 $p; done
Connection to island-vps-01 (172.21.0.2) 22 port [tcp/ssh] succeeded!
Connection to island-vps-01 (172.21.0.2) 80 port [tcp/http] succeeded!
Connection to island-vps-01 (172.21.0.2) 443 port [tcp/https] succeeded!
Connection to island-vps-01 (172.21.0.2) 3000 port [tcp/*] succeeded!
Connection to island-vps-01 (172.21.0.2) 5432 port [tcp/postgresql] succeeded!
Connection to island-vps-01 (172.21.0.2) 6379 port [tcp/redis] succeeded!`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>Local Address</code> কলামটাই আসল। <code>0.0.0.0</code> মানে যন্ত্রের সব
                Interface, বাইরেরটাও। <code>127.0.0.1</code> মানে শুধু ভেতরে।{" "}
                <code>[::]</code> হলো IPv6 এর সব Interface। <code>nc -vz -w 3</code> এ z মানে শুধু
                দেখা দরজা খোলে কি না, v মানে কী হলো তা জানানো, আর w 3 মানে ৩ সেকেন্ডের বেশি অপেক্ষা না করা।
                ছয়টা দরজাই খুলে গেল। এখন প্রতিটা দরজার জন্য একটা প্রশ্ন: এটা কি বাইরের মানুষের
                জন্য?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Port", "কে শোনে", "বাইরে খোলা?", "কেন"],
          rows: [
            [mono("22/tcp"), "sshd", "হ্যাঁ, limit সহ", "আপনার নিজের ঢোকার পথ। Key ছাড়া ঢোকা যায় না (লেসন ০৩)"],
            [mono("80/tcp"), "Caddy", "হ্যাঁ", "কেউ http লিখলে HTTPS এ পাঠানো, আর Certificate নবীকরণের HTTP-01 Challenge"],
            [mono("443/tcp"), "Caddy", "হ্যাঁ", "আসল সাইট, HTTPS"],
            [mono("443/udp"), "Caddy", "হ্যাঁ", "HTTP/3, যা QUIC এর উপর চলে (Module 06)"],
            [mono("3000/tcp"), "App", "না", "শুধু Caddy ডাকবে, একই Server এর ভেতর থেকে"],
            [mono("5432/tcp"), "PostgreSQL", "কখনো না", "Database সরাসরি বাইরে থাকার কোনো কারণ নেই"],
            [mono("6379/tcp"), "Redis", "কখনো না", "Redis এর Default এ Password নেই, বাইরে খোলা মানে সর্বনাশ"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "প্রতিটা না এর দুইটা সমাধান, একটা নয়",
          content: (
            <p>
              যে দরজা বাইরের জন্য নয়, তার প্রথম সমাধান Program এর নিজের Setting: শুধু{" "}
              <code>127.0.0.1</code> এ শোনা। তখন বাইরে থেকে Packet এলেও দরজার পেছনে কেউ নেই।
              দ্বিতীয় সমাধান Firewall: ভুল করে কেউ <code>0.0.0.0</code> এ চালালেও দরজার সামনে
              দেয়াল। দুইটাই করুন। যেকোনো একটায় ভুল হবে, কোনো একদিন, আর সেদিন অন্যটা আপনাকে
              বাঁচাবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "first-look",
      subHeader: { index: "005", title: "Defaults" },
      title: <SectionTitle>ufw এর সাথে প্রথম দেখা: Status, Default নীতি আর IPv6</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Ubuntu Server এ ufw সাধারণত আগে থেকেই Install করা থাকে, কিন্তু বন্ধ। নতুন VPS এ
              প্রথম কমান্ডেই সেটা দেখা যায়। তারপর দেখুন Default নীতিগুলো কোথায় লেখা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "first-look.sh",
          code: `deploy@island-vps-01:~$ sudo ufw status
Status: inactive

# মন্তব্য আর ফাঁকা লাইন বাদ দিয়ে Default ফাইল
deploy@island-vps-01:~$ grep -v '^#' /etc/default/ufw | grep -v '^$'
IPV6=yes
DEFAULT_INPUT_POLICY="DROP"
DEFAULT_OUTPUT_POLICY="ACCEPT"
DEFAULT_FORWARD_POLICY="DROP"
DEFAULT_APPLICATION_POLICY="SKIP"
MANAGE_BUILTINS=no
IPT_SYSCTL=/etc/ufw/sysctl.conf
IPT_MODULES=""

# ফাইলে যা আছে, সেটাই কমান্ড দিয়ে নিশ্চিত করা। পরে কেউ পড়লে যেন উদ্দেশ্যটা বোঝে
deploy@island-vps-01:~$ sudo ufw default deny incoming
Default incoming policy changed to 'deny'
(be sure to update your rules accordingly)
deploy@island-vps-01:~$ sudo ufw default allow outgoing
Default outgoing policy changed to 'allow'
(be sure to update your rules accordingly)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>incoming deny:</strong> বাইরে থেকে নতুন কেউ এলে, কোনো Rule না মিললে, বাদ।
                  ফাইলে এর নাম DROP, আর deny মানে ঠিক এটাই, চুপচাপ ফেলে দেওয়া। একটু পরে reject এর
                  সাথে এর তফাত দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>outgoing allow:</strong> Server নিজে বাইরে যা খুশি ডাকতে পারে।
                </ListItem>
                <ListItem>
                  <strong>routed deny:</strong> এই যন্ত্রের ভেতর দিয়ে অন্য কোথাও যাওয়া Packet,
                  FORWARD চেইন। আপনার Server Router নয়, তাই বন্ধ। Docker এই চেইন ব্যবহার করে, আর
                  সেখান থেকেই একটা বড় ফাঁদ, ০১২ নম্বর অংশে।
                </ListItem>
                <ListItem>
                  <strong>
                    <code>(be sure to update your rules accordingly)</code>:
                  </strong>{" "}
                  ufw আপনাকে মনে করিয়ে দিচ্ছে, Default বন্ধ করলেন, এবার দরকারি দরজাগুলো খুলুন।
                  এখনো ufw বন্ধ, তাই কিছুই আটকায়নি। Default নীতি কাজ শুরু করে <code>ufw enable</code>{" "}
                  এর পর।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "IPV6=yes, পেছনের দরজা বন্ধ রাখার লাইন",
          content: (
            <p>
              বেশিরভাগ VPS এ এখন একটা IPv6 ঠিকানাও থাকে (Module 03 এর IP লেসন, Module 04 এর AAAA
              Record)। <code>IPV6=yes</code> থাকলে আপনি যে Rule ই লিখুন, ufw সেটার একটা IPv6 যমজও
              বানায়, তাই আউটপুটে Rule added এর নিচে Rule added (v6) আসে। কেউ যদি এটা{" "}
              <code>no</code> করে দেয়, ufw আর IPv6 ছোঁয় না। তখন IPv4 এ সব দরজা বন্ধ, অথচ IPv6
              ঠিকানা দিয়ে সব খোলা। Server এ IPv6 আছে কি না দেখতে <code>ip -6 addr</code>। থাকুক
              বা না থাকুক, এই লাইনটা <code>yes</code> ই রাখুন।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Outgoing ও কি বন্ধ করে দেওয়া উচিত? Practice Server এ একবার করে দেখা হয়েছিল। বন্ধ
              করার সাথে সাথে Server নিজে বাইরে কাউকে ডাকতে পারল না, curl ৩ সেকেন্ড অপেক্ষা করে
              Timeout এর Exit Code 28 দিল। খুলে দিতেই আবার 200।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deny-outgoing-breaks-things.sh",
          code: `deploy@island-vps-01:~$ sudo ufw default deny outgoing      # Default বদলের বার্তা বাদ
deploy@island-vps-01:~$ curl -s -o /dev/null -w "%{http_code}\\n" --max-time 3 http://laptop:8080/
000
deploy@island-vps-01:~$ echo $?
28

deploy@island-vps-01:~$ sudo ufw default allow outgoing
deploy@island-vps-01:~$ curl -s -o /dev/null -w "after allow: %{http_code}\\n" --max-time 3 http://laptop:8080/
after allow: 200`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Outgoing বন্ধ করা যায়, কিন্তু দাম আছে",
          content: (
            <p>
              Outgoing বন্ধ করলে ভাঙে <code>apt</code> এর Update, DNS এর প্রশ্ন, Let&apos;s Encrypt
              এর Certificate নবীকরণ, Payment Gateway, Email পাঠানো, Webhook, সবকিছু। খুব কড়া
              নিরাপত্তার জায়গায় মানুষ এটা করে, তখন প্রতিটা বাইরের গন্তব্য আলাদা করে খুলতে হয়।
              Island Tours এর মতো ছোট দলের জন্য Outgoing allow রাখাই স্বাভাবিক, আর এই লেসনের বাকি
              অংশে আমরা সেটাই ধরে নিচ্ছি।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "enable-safely",
      subHeader: { index: "006", title: "Enable Safely" },
      title: <SectionTitle>নিজেকে তালাবন্ধ না করে ufw চালু করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ufw এর সবচেয়ে বড় বিপদ কোনো আক্রমণকারী নয়, আপনি নিজে। Default deny incoming দিয়ে
                ufw চালু করলেন, অথচ SSH এর দরজা খুলতে ভুলে গেলেন। কী হয়, সেটা Practice Server এ
                ইচ্ছা করে ঘটানো হয়েছিল। ফলটা একটু অবাক করার মতো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "the-lockout-trap.sh",
          code: `# SSH এর কোনো Rule ছাড়াই, একটা চালু SSH Session এর ভেতর থেকে ufw চালু করা হলো
you@laptop:~$ ssh deploy@island-vps-01
deploy@island-vps-01:~$ sudo ufw default deny incoming
deploy@island-vps-01:~$ sudo ufw enable        # প্রশ্ন আর বার্তা এখানে বাদ, পুরোটা নিচে
deploy@island-vps-01:~$ sudo ufw status | head -1
Status: active
deploy@island-vps-01:~$ for i in 1 2 3; do echo same session still alive $i; sleep 1; done
same session still alive 1
same session still alive 2
same session still alive 3

# এবার নতুন একটা Terminal থেকে নতুন SSH
you@laptop:~$ ssh -o ConnectTimeout=5 deploy@island-vps-01
ssh: connect to host island-vps-01 port 22: Connection timed out`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                চালু Session টা মরল না। কেন, সেটা ০০৩ এ শিখেছেন: সেই Connection খাতায় আছে,
                ESTABLISHED, তাই তার Packet ঢুকতেই থাকে। আর এটাই ফাঁদ। সব ঠিকঠাক মনে হয়, আপনি
                নিশ্চিন্তে Terminal বন্ধ করেন। পরদিন সকালে নতুন Session আর ঢোকে না, কারণ নতুন
                Connection এর জন্য কোনো Rule নেই। তখন একমাত্র পথ Provider এর Dashboard এর Web
                Console।
              </ContentParagraph>
              <ContentParagraph>
                সঠিক ক্রমটা পাঁচ ধাপের, আর প্রতিবার ঠিক এভাবেই। ufw নিজেও সাবধান করে: SSH এর ভেতর
                থেকে <code>ufw enable</code> চালালে সে জিজ্ঞেস করে, চলমান SSH Connection ভাঙতে
                পারে, এগোবেন কি না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LockoutSplit /> },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "একটা SSH Session খোলা রাখুন",
              description:
                "পুরো কাজটা যে Session থেকে করছেন, সেটা কাজ শেষ হয়ে যাচাই না হওয়া পর্যন্ত বন্ধ করবেন না। এটাই আপনার নিরাপত্তার দড়ি।",
            },
            {
              title: "আগে SSH এর দরজা খুলুন",
              description:
                "sudo ufw allow OpenSSH, অথবা আরও ভালো sudo ufw limit OpenSSH। লেসন ০৩ এ SSH এর Port বদলে থাকলে Profile এর বদলে সেই নম্বরটা লিখুন, কারণ OpenSSH Profile মানে শুধু 22।",
            },
            {
              title: "চালুর আগে তালিকা মিলিয়ে নিন",
              description:
                "sudo ufw show added দেখায় যে Rule গুলো লেখা হয়েছে কিন্তু এখনো চালু হয়নি। SSH এর লাইনটা সেখানে আছে কি না চোখে দেখে নিন।",
            },
            {
              title: "ufw চালু করুন",
              description:
                "sudo ufw enable। প্রশ্ন এলে y। উত্তর আসবে Firewall is active and enabled on system startup, মানে এখন থেকে Reboot এর পরও চালু থাকবে।",
            },
            {
              title: "দ্বিতীয় Terminal থেকে প্রমাণ",
              description:
                "পুরনো Session খোলা রেখেই নতুন একটা Terminal এ আবার SSH করুন। ঢুকতে পারলে তবেই পুরনোটা বন্ধ করুন। না পারলে পুরনো Session থেকেই sudo ufw disable, তারপর ভুলটা খুঁজুন।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "enable-safely.sh",
          code: `# কোন App Profile আছে, আর OpenSSH মানে আসলে কী
deploy@island-vps-01:~$ sudo ufw app list
Available applications:
  OpenSSH
deploy@island-vps-01:~$ cat /etc/ufw/applications.d/openssh-server
[OpenSSH]
title=Secure shell server, an rshd replacement
description=OpenSSH is a free implementation of the Secure Shell protocol.
ports=22/tcp

# ১. দরজা খোলা, SSH আগে। ufw এখনো বন্ধ, তাই উত্তর Rules updated, চালু থাকলে Rule added
deploy@island-vps-01:~$ sudo ufw allow OpenSSH
Rules updated
Rules updated (v6)
deploy@island-vps-01:~$ sudo ufw allow 80/tcp
deploy@island-vps-01:~$ sudo ufw allow 443/tcp
deploy@island-vps-01:~$ sudo ufw allow 443/udp

# ২. চালুর আগে তালিকা
deploy@island-vps-01:~$ sudo ufw show added
Added user rules (see 'ufw status' for running firewall):
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp

# ৩. চালু। SSH Session এর ভেতর থেকে চালালে ufw জিজ্ঞেস করে
deploy@island-vps-01:~$ sudo ufw enable
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup

# ৪. দ্বিতীয় Terminal থেকে
you@laptop:~$ ssh deploy@island-vps-01 hostname
island-vps-01`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "তালাবন্ধ হয়ে গেলে: Web Console",
          content: (
            <p>
              প্রায় সব VPS Provider এর Dashboard এ একটা Browser Terminal থাকে, নাম ভিন্ন হতে পারে:
              Console, VNC, Browser Terminal। এটা আপনার Server এর পর্দায় সরাসরি বসার মতো, Network
              এর Port দিয়ে যায় না, তাই ufw একে আটকাতে পারে না। সেখানে <code>deploy</code> এর
              Password দিয়ে ঢুকে <code>sudo ufw allow OpenSSH</code> বা <code>sudo ufw disable</code>।
              এজন্যই <code>deploy</code> এর Password টা হারাবেন না, SSH এ Password বন্ধ থাকলেও
              Console আর sudo তে সেটা লাগে। কোথায় রাখবেন আর প্রথম দিনের পুরো প্রস্তুতি{" "}
              {lessonLink("ssh-security-keys", "লেসন ০৩")} আর{" "}
              {lessonLink("vps-setup", "লেসন ১১")} এ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "rule-language",
      subHeader: { index: "007", title: "Rule Language" },
      title: <SectionTitle>Rule লেখার ভাষা: যোগ, দেখা, মোছা, ঢোকানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ufw এর প্রতিটা Rule এর চেহারা প্রায় একই: <code>ufw সিদ্ধান্ত কী</code>। সিদ্ধান্ত চারটা,
              allow, deny, reject, limit। কী অংশটা যত নির্দিষ্ট করবেন, Rule তত সরু। নিচের টেবিলে
              সবচেয়ে কাজের রূপগুলো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কমান্ড", "মানে", "কখন"],
          rows: [
            [mono("sudo ufw allow 443/tcp"), "Port 443, শুধু TCP, সবার জন্য", "সবচেয়ে সাধারণ রূপ"],
            [mono("sudo ufw allow 443"), "Port 443, TCP আর UDP দুইটাই", "Protocol না লিখলে দুইটাই খোলে, সাবধান"],
            [mono("sudo ufw allow 6000:6007/tcp"), "একটা Port এর পরিসর", "পরিসরে Protocol বাধ্যতামূলক"],
            [mono("sudo ufw allow OpenSSH"), "App Profile এর Port গুলো", "Profile থাকলে, sudo ufw app list দেখুন"],
            [mono("sudo ufw allow from 203.0.113.0/24 to any port 22 proto tcp"), "শুধু ওই ঠিকানাগুলো থেকে, Port 22", "অফিসের ঠিকানা থেকে SSH"],
            [mono("sudo ufw deny from 198.51.100.7"), "ওই ঠিকানা থেকে সবকিছু", "একটা বিরক্তিকর যন্ত্র আটকানো"],
            [mono("sudo ufw allow in on eth0 to any port 443 proto tcp"), "শুধু eth0 Interface এ আসা", "একাধিক Network Card থাকলে"],
            [mono("sudo ufw allow 80/tcp comment 'Caddy, redirect to HTTPS'"), "Rule এর সাথে একটা মন্তব্য", "ছয় মাস পরের আপনার জন্য"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>203.0.113.0/24</code> লেখাটা Module 03 এর Subnet Mask লেসনের CIDR: প্রথম ২৪
                Bit এক, মানে <code>203.0.113.0</code> থেকে <code>203.0.113.255</code>, ২৫৬ টা
                ঠিকানা। একটাই ঠিকানা চাইলে শুধু ঠিকানাটা লিখুন, যেমন <code>198.51.100.7</code>।
              </ContentParagraph>
              <ContentParagraph>
                Rule চালু হওয়ার আগে দেখতে চাইলে <code>--dry-run</code>। ufw তখন কিছু বদলায় না, শুধু
                দেখায় iptables এ কী লিখত। আর চালু Rule দেখার তিনটা রূপ: <code>status</code>,{" "}
                <code>status verbose</code> যা Default নীতিও দেখায়, আর <code>status numbered</code>{" "}
                যা প্রতিটা Rule এর পাশে একটা নম্বর বসায়। মুছতে আর মাঝখানে ঢোকাতে এই নম্বরটাই লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "status-delete-insert.sh",
          code: `deploy@island-vps-01:~$ sudo ufw status verbose
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
443/udp (v6)               ALLOW IN    Anywhere (v6)

deploy@island-vps-01:~$ sudo ufw status numbered
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] OpenSSH                    ALLOW IN    Anywhere
[ 2] 80/tcp                     ALLOW IN    Anywhere
[ 3] 443/tcp                    ALLOW IN    Anywhere
[ 4] 443/udp                    ALLOW IN    Anywhere
[ 5] OpenSSH (v6)               ALLOW IN    Anywhere (v6)
[ 6] 80/tcp (v6)                ALLOW IN    Anywhere (v6)
[ 7] 443/tcp (v6)               ALLOW IN    Anywhere (v6)
[ 8] 443/udp (v6)               ALLOW IN    Anywhere (v6)

# পরের এক মুহূর্তে, যখন Rule 1 ছিল একটা deny (০০৯ নম্বর অংশে সেই গল্প)।
# নম্বর দিয়ে মুছলে ufw আগে দেখায় কী মুছবে, তারপর জিজ্ঞেস করে
deploy@island-vps-01:~$ sudo ufw delete 1
Deleting:
 deny from 172.21.0.4 to any port 80 proto tcp
Proceed with operation (y|n)? n
Aborted

# Rule টা হুবহু লিখেও মোছা যায়। এতে IPv4 আর IPv6 দুইটাই যায়
deploy@island-vps-01:~$ sudo ufw delete allow OpenSSH
Rule deleted
Rule deleted (v6)

# মাঝখানে, এখানে একদম উপরে, ঢোকানো
deploy@island-vps-01:~$ sudo ufw insert 1 deny from 172.21.0.4 to any port 80 proto tcp
Rule inserted

# কিছু না বদলে শুধু দেখা, iptables এ কী লিখত (আউটপুট ০০৯ নম্বর অংশে)
deploy@island-vps-01:~$ sudo ufw --dry-run allow from 203.0.113.0/24 to any port 22 proto tcp`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "একটা মোছার পর নম্বর বদলে যায়",
          content: (
            <p>
              Rule 3 মুছলে আগের Rule 4 এখন 3। তাই পরপর দুইটা নম্বর দিয়ে মুছতে চাইলে প্রতিবার আগে{" "}
              <code>sudo ufw status numbered</code> আবার চালান। নইলে দ্বিতীয়বার ভুল Rule টা মুছবেন,
              আর সেটা SSH এর হলে কী হবে, তা তো জানেন। Script এ মুছতে হলে নম্বরের বদলে হুবহু Rule
              টা লিখে মোছাই নিরাপদ। আর পুরো তালিকা মুছে শুরু থেকে করতে চাইলে{" "}
              <code>sudo ufw reset</code>, যা প্রশ্ন করে, পুরনো ফাইলগুলোর তারিখ লাগানো Backup রাখে,
              আর ufw বন্ধ করে দেয়।
            </p>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <UfwCommandLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "deny-reject",
      subHeader: { index: "008", title: "Deny vs Reject" },
      title: <SectionTitle>Deny আর Reject: চুপ থাকা আর মুখের উপর না বলা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটাই আটকায়, কিন্তু আটকানোর ধরন আলাদা, আর সেই তফাত বাইরে থেকে মাপা যায়। Practice
                Server এ 5432 এর উপর কোনো Rule ছিল না, তাই Default deny। আর 6379 এ বসানো হলো{" "}
                <code>reject</code>। দুইটা দরজার পেছনেই একটা Program শুনছিল। তারপর laptop থেকে দুইটায়
                টোকা, ঘড়ি ধরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "deny-vs-reject.sh",
          code: `deploy@island-vps-01:~$ sudo ufw reject 6379/tcp
Rule added
Rule added (v6)

you@laptop:~$ nc -vz -w 3 island-vps-01 5432     # Rule নেই, Default deny
nc: connect to island-vps-01 (172.21.0.2) port 5432 (tcp) timed out: Operation now in progress
  took 3008 ms
you@laptop:~$ nc -vz -w 3 island-vps-01 6379     # reject
nc: connect to island-vps-01 (172.21.0.2) port 6379 (tcp) failed: Connection refused
  took 3 ms

# তুলনার জন্য: ufw বন্ধ, আর Port 3000 এ কেউ শুনছে না
you@laptop:~$ nc -vz -w 3 island-vps-01 3000
nc: connect to island-vps-01 (172.21.0.2) port 3000 (tcp) failed: Connection refused`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>deny মানে DROP:</strong> Packet টা চুপচাপ ফেলে দেওয়া। কোনো উত্তর যায় না।
                  Client জানে না কী হলো, তাই সে অপেক্ষা করে, আবার পাঠায়, শেষে নিজের ধৈর্য ফুরালে
                  বলে timed out। এখানে nc এর ধৈর্য ছিল ৩ সেকেন্ড, তাই 3008 ms।
                </ListItem>
                <ListItem>
                  <strong>reject মানে উত্তর দিয়ে না বলা:</strong> ufw নিজে একটা RST বানিয়ে ফেরত
                  পাঠায় (Module 05 এর লেসন ০৮ এর RST)। Client সাথে সাথে জানে, দরজা বন্ধ। 3 ms।
                </ListItem>
                <ListItem>
                  <strong>খেয়াল করুন শেষ লাইনটা:</strong> Firewall না থাকলে আর দরজার পেছনে কেউ না
                  থাকলে Kernel নিজেই RST পাঠায়, আর বার্তা হুবহু reject এর মতো, Connection refused।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এর থেকে Debugging এর একটা সোনালি নিয়ম বেরিয়ে আসে, যা লেসন ০৯ এ আরও কাজে লাগবে।{" "}
                <strong>timed out</strong> মানে সাধারণত পথে কেউ Packet ফেলে দিচ্ছে: ufw, Provider
                এর Firewall, বা ভুল IP। <strong>Connection refused</strong> মানে যন্ত্র পর্যন্ত
                পৌঁছেছেন, কিন্তু সেই দরজায় কেউ শুনছে না, অথবা কেউ জেনেবুঝে না বলছে।
              </ContentParagraph>
              <ContentParagraph>
                কোনটা কখন? Public Internet এর দিকে deny। Scanner গুলো প্রতিটা বন্ধ দরজায় ৩ সেকেন্ড
                করে নষ্ট করে, আর জানতেও পারে না এখানে আদৌ কোনো যন্ত্র আছে কি না। ufw এর Default
                incoming ও এই কারণেই deny। reject মাঝে মাঝে কাজের নিজেদের ভেতরের Network এ, যেখানে
                নিজের Tool গুলোকে অপেক্ষা না করিয়ে দ্রুত ভুলটা দেখাতে চান।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DenyRejectLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "order",
      subHeader: { index: "009", title: "Rule Order" },
      title: <SectionTitle>ক্রম: প্রথম যে Rule মেলে, সিদ্ধান্ত তার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ufw এর Rule গুলো একটা তালিকা, আর Kernel প্রতিটা নতুন Packet কে উপর থেকে নিচে মেলায়।
                প্রথম যে Rule এ Port, Protocol আর Source সব মেলে, সেখানেই সিদ্ধান্ত। নিচের Rule গুলো
                আর দেখাই হয় না। আর ufw নতুন Rule সবসময় তালিকার শেষে বসায়। এই দুইটা কথা একসাথে
                একটা চেনা ভুল তৈরি করে।
              </ContentParagraph>
              <ContentParagraph>
                Practice Server এ ধরা যাক stranger (<code>172.21.0.4</code>) বারবার ওয়েবসাইটে
                বিরক্ত করছে। তাকে Port 80 এ আটকানোর Rule লেখা হলো। Rule যোগ হলো, কিন্তু stranger
                দিব্যি ঢুকে গেল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "first-match-wins.sh",
          code: `deploy@island-vps-01:~$ sudo ufw deny from 172.21.0.4 to any port 80 proto tcp
Rule added
deploy@island-vps-01:~$ sudo ufw status numbered
     To                         Action      From
     --                         ------      ----
[ 1] 80/tcp                     ALLOW IN    Anywhere
[ 2] 443/tcp                    ALLOW IN    Anywhere
[ 3] 443/udp                    ALLOW IN    Anywhere
[ 4] 6379/tcp                   REJECT IN   Anywhere
[ 5] 22/tcp                     ALLOW IN    172.21.0.3
[ 6] 80/tcp                     DENY IN     172.21.0.4
...

stranger:~$ nc -vz -w 3 island-vps-01 80       # deny লেখা আছে, তবুও
Connection to island-vps-01 (172.21.0.2) 80 port [tcp/http] succeeded!

# Rule 6 মুছে একদম উপরে, Rule 1 হিসেবে আবার বসানো
deploy@island-vps-01:~$ sudo ufw --force delete 6
Rule deleted
deploy@island-vps-01:~$ sudo ufw insert 1 deny from 172.21.0.4 to any port 80 proto tcp
Rule inserted
deploy@island-vps-01:~$ sudo ufw status numbered
[ 1] 80/tcp                     DENY IN     172.21.0.4
[ 2] 80/tcp                     ALLOW IN    Anywhere
...

stranger:~$ nc -vz -w 3 island-vps-01 80
nc: connect to island-vps-01 (172.21.0.2) port 80 (tcp) timed out: Operation now in progress
you@laptop:~$ nc -vz -w 3 island-vps-01 80      # বাকিরা আগের মতোই
Connection to island-vps-01 (172.21.0.2) 80 port [tcp/http] succeeded!`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমবার stranger এর Packet Rule 1 এ পৌঁছেই মিলে গেল, 80/tcp, Anywhere থেকে, ALLOW।
                Rule 6 পর্যন্ত যাওয়ার দরকারই পড়ল না। দ্বিতীয়বার deny টা সবার উপরে, তাই stranger
                সেখানেই থামল, আর বাকিরা Rule 1 পার হয়ে Rule 2 তে গিয়ে ঢুকল।{" "}
                <code>--force</code> মানে প্রশ্ন ছাড়াই মুছে ফেলা, Script এ কাজে লাগে, হাতে চালানোর সময়
                প্রশ্নটা থাকাই ভালো।
              </ContentParagraph>
              <ContentParagraph>
                নিয়মটা মনে রাখার মতো: <strong>নির্দিষ্ট Rule উপরে, সাধারণ Rule নিচে।</strong> কাউকে
                আলাদা করে আটকাতে হলে <code>insert 1</code>, শেষে যোগ নয়। আর নিচের তলায় আসলেও এই
                ক্রমটাই বসে, <code>iptables -S ufw-user-input</code> এ দেখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "the-order-underneath.sh",
          code: `deploy@island-vps-01:~$ sudo ufw --dry-run allow from 203.0.113.0/24 to any port 22 proto tcp | grep '^-A ufw-user-input' | head -3
-A ufw-user-input -p tcp --dport 80 -s 172.21.0.4 -j DROP
-A ufw-user-input -p tcp --dport 80 -j ACCEPT
-A ufw-user-input -p tcp --dport 443 -j ACCEPT`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RuleOrderLab /> },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "source-limit",
      subHeader: { index: "010", title: "Source and Limit" },
      title: <SectionTitle>শুধু চেনা ঠিকানা থেকে SSH, আর limit দিয়ে গতি কমানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              SSH এর দরজা পুরো পৃথিবীর জন্য খোলা রাখার দরকার কী, যদি আপনি সবসময় অফিস থেকেই ঢোকেন?
              Practice Server এ SSH খোলা রাখা হলো শুধু laptop এর ঠিকানার জন্য, আর সাধারণ OpenSSH
              Rule টা মুছে দেওয়া হলো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ssh-from-one-place.sh",
          code: `deploy@island-vps-01:~$ sudo ufw allow from 172.21.0.3 to any port 22 proto tcp
Rule added
deploy@island-vps-01:~$ sudo ufw delete allow OpenSSH
Rule deleted
Rule deleted (v6)

you@laptop:~$ nc -vz -w 3 island-vps-01 22
Connection to island-vps-01 (172.21.0.2) 22 port [tcp/ssh] succeeded!
stranger:~$ nc -vz -w 3 island-vps-01 22
nc: connect to island-vps-01 (172.21.0.2) port 22 (tcp) timed out: Operation now in progress`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "বাসার IP বদলায়, আর তখন আপনিই stranger",
          content: (
            <p>
              Module 03 এ দেখেছেন, বাসার Internet এর Public IP সাধারণত DHCP Lease এ আসে, আর অনেক
              ISP CGNAT এর পেছনে রাখে। আজ যে ঠিকানা থেকে SSH খুললেন, কাল সকালে Router Restart এর পর
              সেটা অন্য হতে পারে, আর আপনি নিজেই বাইরে। Source দিয়ে আটকানো তখনই নিরাপদ, যখন ঠিকানাটা
              সত্যিই স্থির: অফিসের Static IP, বা একটা VPN, যেমন WireGuard বা Tailscale, যার ঠিকানা
              বদলায় না। আর সবসময় Web Console এর পথটা মাথায় রাখুন।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবাই স্থির ঠিকানা পায় না। তখন দ্বিতীয় অস্ত্র <code>limit</code>। এটা দরজা খোলা রাখে,
                কিন্তু একই ঠিকানা থেকে খুব দ্রুত বারবার নতুন Connection এলে আটকে দেয়। ufw এর নিয়ম:
                শেষ ৩০ সেকেন্ডে ৬ বা তার বেশি নতুন চেষ্টা হলে, সেটা Reject। Practice Server এ stranger
                থেকে পরপর আটবার চেষ্টা করা হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "limit-in-action.sh",
          code: `deploy@island-vps-01:~$ sudo ufw limit 22/tcp
Rule added
Rule added (v6)

stranger:~$ for i in 1 2 3 4 5 6 7 8; do printf "try %s: " $i; nc -z -w 2 island-vps-01 22 && echo connected || echo "no answer"; done
try 1: connected
try 2: connected
try 3: connected
try 4: connected
try 5: connected
try 6: no answer
try 7: no answer
try 8: no answer

# নিচের তলায় limit আসলে কী: recent Module একই Source এর চেষ্টা গোনে
deploy@island-vps-01:~$ sudo iptables -S ufw-user-input | grep 'dport 22'
-A ufw-user-input -p tcp -m tcp --dport 22 -m conntrack --ctstate NEW -m recent --set --name DEFAULT --mask 255.255.255.255 --rsource
-A ufw-user-input -p tcp -m tcp --dport 22 -m conntrack --ctstate NEW -m recent --update --seconds 30 --hitcount 6 --name DEFAULT --mask 255.255.255.255 --rsource -j ufw-user-limit
-A ufw-user-input -p tcp -m tcp --dport 22 -j ufw-user-limit-accept
deploy@island-vps-01:~$ sudo iptables -S ufw-user-limit
-N ufw-user-limit
-A ufw-user-limit -m limit --limit 3/min -j LOG --log-prefix "[UFW LIMIT BLOCK] "
-A ufw-user-limit -j REJECT --reject-with icmp-port-unreachable

# ৩০ সেকেন্ড একদম চুপ থাকার পর একবার
stranger:~$ sleep 32; nc -vz -w 2 island-vps-01 22
Connection to island-vps-01 (172.21.0.2) 22 port [tcp/ssh] succeeded!`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম Rule টা প্রতিটা নতুন চেষ্টায় ঠিকানাটা একটা খাতায় লেখে (<code>--set</code>)।
                দ্বিতীয়টা দেখে শেষ ৩০ সেকেন্ডে এই ঠিকানার ৬ টা চেষ্টা জমেছে কি না (
                <code>--seconds 30 --hitcount 6</code>), জমলে পাঠায় <code>ufw-user-limit</code> এ, যা
                একটা Log লিখে Reject করে। একটা মজার আর গুরুত্বপূর্ণ ব্যাপার পরীক্ষার সময় ধরা পড়েছে।
                আটকে যাওয়ার পর একটা Loop ২ সেকেন্ড পরপর আবার চেষ্টা করছিল, আর দেড় মিনিটেও ঢুকতে
                পারেনি। কারণ আটকে যাওয়া চেষ্টাও খাতায় লেখা হয়। ছাড়া পেতে হলে পুরো ৩০ সেকেন্ড চুপ
                থাকতে হয়, তারপর প্রথম চেষ্টাতেই ঢোকা।
              </ContentParagraph>
              <ContentParagraph>
                limit আর লেসন ০৩ এর fail2ban এক জিনিস নয়। limit শুধু গোনে কতবার দরজায় টোকা পড়ল,
                Login সফল হলো কি না জানে না। fail2ban Log পড়ে ব্যর্থ Login দেখে, তারপর সেই ঠিকানা
                কিছুক্ষণের জন্য নিষিদ্ধ করে। আর আসল নিরাপত্তা এই দুইটার কোনোটাই নয়: SSH এ Password
                বন্ধ, শুধু Key। limit এর কাজ শুধু আওয়াজ আর CPU এর খরচ কমানো।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LimitLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নিজের Automation যেন নিজেকে আটকে না দেয়",
          content: (
            <p>
              Deploy Script বা CI যদি এক মিনিটে অনেকগুলো আলাদা SSH Connection খোলে, যেমন প্রতিটা
              কমান্ডের জন্য একটা করে, তাহলে limit আপনার নিজের Deploy কেই আটকাতে পারে। দুইটা উপায়:
              একটা Connection খুলে তার ভেতরে সব কমান্ড চালানো, অথবা CI এর স্থির ঠিকানাকে limit এর
              আগে, উপরে, আলাদা allow দেওয়া। CI আর Deploy এর গল্প পরে CI/CD Module এ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "logs",
      subHeader: { index: "011", title: "Block Logs" },
      title: <SectionTitle>Log পড়া: [UFW BLOCK] লাইনটা কী বলছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দারোয়ান কাউকে ফিরিয়ে দিলে একটা খাতায় লিখে রাখতে পারেন। ufw এর সেই খাতা Kernel এর
                Log। কতটা লিখবে, তা ঠিক করে <code>ufw logging</code>, পাঁচটা মাত্রায়: off, low, medium,
                high, full। Default low, যা মূলত আটকানো Packet লেখে। medium এ আরও কিছু, high আর full
                এ এত বেশি যে Disk ভরে যেতে পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "logging.sh",
          code: `deploy@island-vps-01:~$ sudo ufw logging medium
Logging enabled
deploy@island-vps-01:~$ sudo ufw status verbose | sed -n 2p
Logging: on (medium)

# rsyslog এর এই Rule টা [UFW দিয়ে শুরু হওয়া লাইনগুলো আলাদা ফাইলে পাঠায়
deploy@island-vps-01:~$ grep -v '^#' /etc/rsyslog.d/20-ufw.conf
:msg,contains,"[UFW " /var/log/ufw.log

# Log লেখার Rule নিজেও গতি বাঁধা: মিনিটে ৩ টা, একসাথে বড়জোর ১০ টা
deploy@island-vps-01:~$ sudo iptables -S ufw-after-logging-input
-N ufw-after-logging-input
-A ufw-after-logging-input -m limit --limit 3/min --limit-burst 10 -j LOG --log-prefix "[UFW BLOCK] "

# Log না হলেও গোনা হয়: Default DROP কতগুলো Packet ফেলল
deploy@island-vps-01:~$ sudo iptables -L INPUT -n -v | head -1
Chain INPUT (policy DROP 12 packets, 720 bytes)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লাইনগুলো দুই জায়গায় পাবেন: <code>{'sudo journalctl -k --grep "UFW BLOCK"'}</code>, কারণ
                এরা Kernel এর বার্তা (journalctl এর পুরো গল্প লেসন ০৭ এ), আর{" "}
                <code>/var/log/ufw.log</code>, যেখানে rsyslog এর উপরের Rule টা তাদের আলাদা করে রাখে।
              </ContentParagraph>
              <ContentParagraph>
                একটা সৎ কথা। Practice Server একটা Container, আর Linux নিরাপত্তার কারণে Container এর
                নিজস্ব Network থেকে Kernel Log এ এই লাইন লিখতে দেয় না। তাই নিচের লাইনটা ধরা হয়নি, এটা
                একটা আসল VPS যে চেহারায় লেখে সেই চেহারা, Island Tours এর ঠিকানা বসিয়ে। Packet ফেলা
                যে সত্যিই হয়েছে, তার প্রমাণ উপরের Counter এ, 12 টা Packet।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "ufw-block-line (একটা আসল VPS এ যেমন দেখায়, নমুনা)",
          code: `Oct 31 09:14:07 island-vps-01 kernel: [UFW BLOCK] IN=eth0 OUT= MAC=52:54:00:aa:10:01:52:54:00:bb:20:02:08:00 SRC=198.51.100.7 DST=103.94.135.2 LEN=60 TOS=0x00 PREC=0x00 TTL=52 ID=41377 DF PROTO=TCP SPT=51888 DPT=5432 WINDOW=64240 RES=0x00 SYN URGP=0`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["অংশ", "মানে", "এখানে কী বলছে"],
          rows: [
            [mono("IN=eth0 OUT="), "কোন Interface দিয়ে ঢুকল, কোথাও বেরোচ্ছে না", "বাইরের Network Card দিয়ে এসেছে, এই যন্ত্রের জন্যই"],
            [mono("SRC=198.51.100.7"), "কে পাঠাল", "একটা অচেনা ঠিকানা"],
            [mono("DST=103.94.135.2"), "কাকে পাঠাল", "Island Tours এর VPS"],
            [mono("PROTO=TCP"), "Protocol", "TCP"],
            [mono("SPT=51888"), "পাঠানোর Port", "ওপাশের Ephemeral Port (Module 05)"],
            [mono("DPT=5432"), "কোন দরজায়", "PostgreSQL খুঁজছিল"],
            [mono("TTL=52"), "আর কত Hop বাঁচবে", "কয়েক Hop দূর থেকে এসেছে (Module 02)"],
            [mono("SYN"), "TCP Flag", "নতুন Connection এর প্রথম টোকা"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "হাজার হাজার BLOCK দেখে ঘাবড়াবেন না",
          content: (
            <p>
              একটা Public IP তে দিনে হাজার হাজার অচেনা টোকা পড়া স্বাভাবিক, এটা Internet এর
              পটভূমির আওয়াজ। প্রতিটা দেখে তাড়া করার দরকার নেই। যা খুঁজবেন সেটা উল্টো: এমন DPT যা
              আপনার খোলা থাকার কথা। ধরুন পর্যটকরা বলছেন সাইট খুলছে না, আর Log এ{" "}
              <code>DPT=443</code> এর BLOCK, তাহলে Rule এ ভুল আপনার নিজের। আর খেয়াল রাখবেন, মিনিটে
              ৩ টার বেশি লাইন লেখা হয় না, তাই Log এ সব আটকানো Packet থাকে না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "docker-trap",
      subHeader: { index: "012", title: "Docker Trap" },
      title: <SectionTitle>Docker এর ফাঁদ: ufw জানেই না এমন খোলা দরজা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসনের শুরুর গল্পে ফিরি। দলের একজন Docker দিয়ে Database চালিয়েছিলেন,{" "}
                <code>-p 5432:5432</code> দিয়ে। ufw চালু, Default deny, 5432 এর কোনো Rule নেই। তাহলে
                তো ভয়ের কিছু নেই, তাই না? Practice Server এর ভেতরে Docker বসিয়ে ঠিক এটাই পরীক্ষা করা
                হয়েছিল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "docker-skips-ufw.sh",
          code: `# একটা ছোট Container, Port 5432 সব Interface এ Publish করা
deploy@island-vps-01:~$ docker run -d --name pg-oops -p 5432:5432 busybox:1.37 httpd -f -p 5432
deploy@island-vps-01:~$ docker ps --format "{{.Names}}  {{.Ports}}"
pg-oops  0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp

deploy@island-vps-01:~$ sudo ufw status | grep -c 5432
0

# ufw এ 5432 এর কোনো Rule নেই, Default deny। তবুও:
you@laptop:~$ nc -vz -w 3 island-vps-01 5432
Connection to island-vps-01 (172.21.0.2) 5432 port [tcp/postgresql] succeeded!`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দরজা খোলা। কারণটা Docker এর নিজের নথিতে পরিষ্কার লেখা: Port Publish করলে Docker
                Traffic কে <code>nat</code> টেবিলে ঘুরিয়ে দেয়, ufw যে INPUT আর OUTPUT চেইনে বসে
                থাকে তার আগেই। ফলে ufw এর Rule গুলো কোনো কাজেই আসে না। নিচের তলায় দেখলে দুইটা জিনিস
                চোখে পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "why-docker-skips-ufw.sh",
          code: `# ১. গন্তব্য বদলানোর নিয়ম: 5432 এ যা আসবে, তার গন্তব্য Container এর ঠিকানা
deploy@island-vps-01:~$ sudo iptables -t nat -S DOCKER | grep 5432
-A DOCKER ! -i docker0 -p tcp -m tcp --dport 5432 -j DNAT --to-destination 172.17.0.2:5432

# ২. গন্তব্য বদলে যাওয়া Packet যায় FORWARD এ, আর সেখানে Docker এর চেইন ufw এর আগে
deploy@island-vps-01:~$ sudo iptables -S FORWARD | head -6
-P FORWARD DROP
-A FORWARD -j DOCKER-USER
-A FORWARD -j DOCKER-FORWARD
-A FORWARD -j ufw-before-logging-forward
-A FORWARD -j ufw-before-forward
-A FORWARD -j ufw-after-forward`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DockerBypassDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মানে Packet টা কখনো INPUT চেইনে যায়ই না, যেখানে আপনার সব Rule। সমাধান Port টা শুধু{" "}
                <code>127.0.0.1</code> এ Publish করা। তখন বাইরে থেকে আসা Packet এর জন্য গন্তব্য
                বদলানোর নিয়মই তৈরি হয় না, আর Server এর ভেতর থেকে, যেমন Caddy বা আপনার SSH Tunnel
                থেকে, তবুও পৌঁছানো যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "publish-to-localhost.sh",
          code: `deploy@island-vps-01:~$ docker rm -f pg-oops
deploy@island-vps-01:~$ docker run -d --name pg-safe -p 127.0.0.1:5432:5432 busybox:1.37 httpd -f -p 5432
deploy@island-vps-01:~$ docker ps --format "{{.Names}}  {{.Ports}}"
pg-safe  127.0.0.1:5432->5432/tcp

# Server এর ভেতর থেকে পৌঁছায় (busybox এর ছোট Web Server, তাই 404, পৌঁছানোটাই আসল কথা)
deploy@island-vps-01:~$ curl -s -o /dev/null -w "from the VPS itself: %{http_code}\\n" http://127.0.0.1:5432/
from the VPS itself: 404

you@laptop:~$ nc -vz -w 3 island-vps-01 5432
nc: connect to island-vps-01 (172.21.0.2) port 5432 (tcp) timed out: Operation now in progress`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>সমাধান ১, শুধু ভেতরে Publish:</strong> <code>-p 127.0.0.1:5432:5432</code>,
                আর IPv6 এর জন্য Docker এর নথি <code>-p &apos;[::1]:5432:5432&apos;</code> ও দেখায়। এক
                সাবধানতা নথিতেই লেখা: Docker এর 28.0.0 এর আগের Version এ একই Switch এ থাকা যন্ত্র
                localhost এ Publish করা Port এও পৌঁছাতে পারত। তাই Docker হালনাগাদ রাখুন।
              </ListItem>
              <ListItem>
                <strong>সমাধান ২, Publish ই না করা:</strong> Database কে বাইরে আনারই দরকার নেই। App
                আর Database একই Docker Network এ থাকলে নিজেদের মধ্যে কথা বলে, কোনো Port Publish
                ছাড়াই। এটা Docker Module এর বিষয়।
              </ListItem>
              <ListItem>
                <strong>সমাধান ৩, DOCKER-USER চেইন:</strong> Docker এই খালি চেইনটা রেখে দেয় আপনার
                নিজের Filter Rule এর জন্য, যা Docker এর নিজের Rule এর আগে চলে। শক্তিশালী, কিন্তু হাতে
                iptables লিখতে হয়, তাই এখন শুধু নামটা চিনে রাখুন।
              </ListItem>
              <ListItem>
                <strong>সমাধান ৪, বাইরের দেয়াল:</strong> Provider এর Cloud Firewall Server এর বাইরে
                বসে, Docker এর এসব কারসাজি তার কাছে পৌঁছায় না। পরের অংশ।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "ufw এর status দেখে নিশ্চিন্ত হবেন না",
          content: (
            <p>
              Docker চলা Server এ ufw এর তালিকা পুরো সত্যি বলে না। আসল সত্যি দেখার দুইটা কমান্ড:{" "}
              <code>docker ps --format &quot;{"{{.Names}}  {{.Ports}}"}&quot;</code>, যেখানে{" "}
              <code>0.0.0.0:</code> দিয়ে শুরু যেকোনো লাইন মানে বাইরে খোলা, আর বাইরের কোনো যন্ত্র থেকে{" "}
              <code>nc -vz</code>। Firewall এর পরীক্ষা সবসময় বাইরে থেকে, ০১৪ নম্বর অংশে পুরোটা।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "cloud-firewall",
      subHeader: { index: "013", title: "Cloud Firewall" },
      title: <SectionTitle>Provider এর Cloud Firewall: দেয়ালের বাইরে আরেকটা দেয়াল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বেশিরভাগ VPS Provider তাদের Dashboard এ একটা Firewall দেয়, যা আপনার Server এর বাইরে,
                তাদের নিজের Network এ বসে। Packet আপনার Server এর Network Card পর্যন্ত আসার আগেই
                সেখানে থেমে যেতে পারে। নাম একেক জায়গায় একেক রকম: Cloud Firewall, Managed Firewall,
                AWS এ Security Group। কাজ এক।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TwoWallsDiagram /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "ufw", "Provider এর Cloud Firewall"],
          rows: [
            ["কোথায় বসে", "Server এর Kernel এ", "Provider এর Network এ, Server এর বাইরে"],
            ["কে বদলায়", "sudo আছে এমন যে কেউ, Server এ ঢুকে", "Dashboard এ ঢুকতে পারা মানুষ"],
            ["Server এর ভেতরের ভুলে", "ভুলের সাথে নিজেও ভাঙতে পারে", "টিকে থাকে"],
            ["Docker এর Publish করা Port", "দেখে না, পাশ কেটে যায়", "আটকায়"],
            ["limit, Log, সূক্ষ্ম Rule", "আছে", "সাধারণত সরল, Provider ভেদে"],
            ["অনেক Server এ একসাথে", "প্রতিটায় আলাদা", "একটা Group বানিয়ে সবগুলোয়"],
            ["Provider বদলালে", "সাথে যায়", "নতুন করে বানাতে হয়"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর VPS যেহেতু Hostinger এ, একটা উদাহরণ সেখান থেকে। Hostinger এর নিজের
                সাহায্য পাতা অনুযায়ী (২০২৬ সালের হিসাবে) ধাপগুলো এরকম। অন্য Provider এ নাম আর বোতামের
                জায়গা আলাদা হবে, তাই সবসময় আপনার নিজের Dashboard এ যা দেখাচ্ছে সেটাই বিশ্বাস করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Firewall এর পাতায় যান",
              description:
                "hPanel এ VPS অংশ, তারপর আপনার Server, তারপর বাম পাশের Security এর নিচে Firewall।",
            },
            {
              title: "একটা Firewall Group বানান",
              description:
                "Add Firewall চেপে একটা নাম দিন, যেমন island-web। Group হলো Rule এর একটা তালিকা, যা পরে এক বা একাধিক Server এ লাগানো যায়।",
            },
            {
              title: "Accept Rule যোগ করুন, SSH আগে",
              description:
                "Group এর Edit এ গিয়ে প্রতিটা Rule এ Action (accept, reject বা drop), Protocol, Port আর দরকার হলে Source। ক্রম: TCP 22, TCP 80, TCP 443, UDP 443। ufw এর মতোই, আগে নিজের দরজা।",
            },
            {
              title: "Server এ লাগান আর চালু করুন",
              description:
                "Group টা Server এ লাগানো না পর্যন্ত কিছুই হয় না। চালু হলে বাকি সব Traffic Default এ বাদ, IPv4 আর IPv6 দুইটাতেই। বদল কার্যকর হতে এক দুই মিনিট লাগতে পারে।",
            },
            {
              title: "বাইরে থেকে যাচাই",
              description:
                "laptop থেকে প্রতিটা Port এ nc -vz। খোলার কথা যেগুলো, সেগুলো succeeded, বাকিগুলো timed out। ভুল হলে Web Console তখনও কাজ করে, কারণ সেটা Network এর Port দিয়ে যায় না।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Defence in Depth: দুইটাই, একই Rule এ",
          content: (
            <p>
              দুইটা দেয়ালেই একই তালিকা রাখুন: 22, 80, 443/tcp আর 443/udp, বাকি সব বন্ধ। মনে হতে
              পারে একই কাজ দুইবার। আসলে প্রতিটা দেয়াল অন্যটার একটা নির্দিষ্ট ভুল ধরে। Docker
              কোনো Port খুলে দিলে বা কেউ রাতে <code>ufw disable</code> করে ভুলে গেলে বাইরেরটা
              দাঁড়িয়ে থাকে। Dashboard এ কেউ ভুল করে একটা Port খুলে দিলে ভেতরেরটা ধরে। নিরাপত্তার
              ভাষায় একে বলে Defence in Depth, স্তরে স্তরে প্রতিরক্ষা।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "verify",
      subHeader: { index: "014", title: "Hands-on" },
      title: <SectionTitle>বাইরে থেকে যাচাই, আর Reboot এর পরও টিকে থাকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                যে Firewall বাইরে থেকে পরীক্ষা করা হয়নি, সেটা একটা অনুমান মাত্র। <code>ufw status</code>{" "}
                বলে আপনি কী লিখেছেন, আর Docker এর গল্পে দেখলেন সেটা পুরো সত্যি নাও হতে পারে। আসল
                প্রশ্ন একটাই: বাইরের একজন মানুষ কোন দরজায় ঢুকতে পারে। তার উত্তর দেয় শুধু বাইরের
                একটা যন্ত্র।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "check-from-outside.sh",
          code: `# ufw চালুর পর, laptop থেকে, প্রতিটা দরজায় টোকা আর সময়
you@laptop:~$ for p in 22 80 443 3000 5432 6379; do nc -vz -w 3 island-vps-01 $p; done
Connection to island-vps-01 (172.21.0.2) 22 port [tcp/ssh] succeeded!
Connection to island-vps-01 (172.21.0.2) 80 port [tcp/http] succeeded!
Connection to island-vps-01 (172.21.0.2) 443 port [tcp/https] succeeded!
nc: connect to island-vps-01 (172.21.0.2) port 3000 (tcp) timed out: Operation now in progress
nc: connect to island-vps-01 (172.21.0.2) port 5432 (tcp) timed out: Operation now in progress
nc: connect to island-vps-01 (172.21.0.2) port 6379 (tcp) timed out: Operation now in progress`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা দরজা খোলা, তিনটা বন্ধ, ঠিক যেমন টেবিলে ঠিক করা হয়েছিল। এবার আরেকটা প্রশ্ন:
                Server Restart হলে Rule গুলো থাকে তো? Practice Server পুরো Reboot করে দেখা হলো।
                Reboot এর পর পরীক্ষার Program গুলো আর চলছিল না, তাই 3000 এর পেছনে কেউ নেই। তবুও
                উত্তর timed out, refused নয়, কারণ দেয়ালটা আগেই Packet ফেলে দিচ্ছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "after-reboot.sh",
          code: `deploy@island-vps-01:~$ systemctl is-enabled ufw
enabled
deploy@island-vps-01:~$ sudo reboot

# Reboot এর পর
deploy@island-vps-01:~$ sudo ufw status | head -1
Status: active
you@laptop:~$ nc -vz -w 3 island-vps-01 3000
nc: connect to island-vps-01 (172.21.0.2) port 3000 (tcp) timed out: Operation now in progress
you@laptop:~$ nc -vz -w 3 island-vps-01 22
Connection to island-vps-01 (172.21.0.2) 22 port [tcp/ssh] succeeded!

# Server এর নিজের চোখে: কোন Listen করা Port কোন Rule এর আওতায়।
# Reboot এর পর পরীক্ষার Program নেই, তাই শুধু sshd। নম্বরগুলো সেই সময়ের তালিকার।
deploy@island-vps-01:~$ sudo ufw show listening
tcp:
  22 * (sshd)
   [ 6] allow from 172.21.0.3 to any port 22 proto tcp
   [ 7] limit 22/tcp

tcp6:
  22 * (sshd)
   [12] limit 22/tcp

udp:`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "UDP দরজা আর অন্যের যন্ত্র",
          content: (
            <p>
              <code>nc -vz</code> TCP এর জন্য নির্ভরযোগ্য, কারণ TCP তে Handshake আছে, উত্তর আসে বা
              আসে না। UDP তে Handshake নেই (Module 05 এর UDP লেসন), তাই <code>nc -vzu</code> প্রায়
              সবসময় সফল দেখায়, দরজা খোলা হোক বা না হোক। 443/udp এর জন্য <code>ufw status</code>{" "}
              আর একটা HTTP/3 সমর্থিত Browser বা curl ভরসা। আর nmap এর মতো Port Scanner শুধু নিজের
              Server এ চালাবেন। অন্যের যন্ত্রে অনুমতি ছাড়া Scan করা Provider এর নিয়মে, আর অনেক
              দেশের আইনে, অপরাধ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর দেয়াল, প্রতিটা লাইনের কারণ সহ</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর VPS এর ufw নিচের মতো। তালিকাটা Practice Server এ হুবহু বসিয়ে তার আউটপুট
              নেওয়া, প্রতিটা Rule এর মন্তব্য সহ, যাতে ছয় মাস পরে কেউ পড়লে বোঝে কোন লাইন কেন আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "island-tours-ufw.sh",
          code: `deploy@island-vps-01:~$ sudo ufw default deny incoming
deploy@island-vps-01:~$ sudo ufw default allow outgoing
deploy@island-vps-01:~$ sudo ufw limit OpenSSH comment "SSH, deploy only, key login"
deploy@island-vps-01:~$ sudo ufw allow 80/tcp comment "Caddy, redirect to HTTPS"
deploy@island-vps-01:~$ sudo ufw allow 443/tcp comment "Caddy, HTTPS"
deploy@island-vps-01:~$ sudo ufw allow 443/udp comment "Caddy, HTTP/3"
deploy@island-vps-01:~$ sudo ufw enable

deploy@island-vps-01:~$ sudo ufw status verbose
Status: active
Logging: on (medium)
Default: deny (incoming), allow (outgoing), deny (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           LIMIT IN    Anywhere                   # SSH, deploy only, key login
80/tcp                     ALLOW IN    Anywhere                   # Caddy, redirect to HTTPS
443/tcp                    ALLOW IN    Anywhere                   # Caddy, HTTPS
443/udp                    ALLOW IN    Anywhere                   # Caddy, HTTP/3
22/tcp (OpenSSH (v6))      LIMIT IN    Anywhere (v6)              # SSH, deploy only, key login
80/tcp (v6)                ALLOW IN    Anywhere (v6)              # Caddy, redirect to HTTPS
443/tcp (v6)               ALLOW IN    Anywhere (v6)              # Caddy, HTTPS
443/udp (v6)               ALLOW IN    Anywhere (v6)              # Caddy, HTTP/3`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>প্রতিটা সিদ্ধান্তের পেছনের কারণ।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>SSH এ limit, Source বাঁধা নয়।</strong> দলের মানুষরা বাসা, অফিস আর ফোনের
                  Hotspot থেকে কাজ করেন, ঠিকানা স্থির নয়। তাই দরজা সবার জন্য খোলা, কিন্তু limit
                  দিয়ে গতি বাঁধা, আর আসল তালা হলো Key ছাড়া ঢোকা যায় না (লেসন ০৩)।
                </ListItem>
                <ListItem>
                  <strong>80 খোলা, যদিও সাইট শুধু HTTPS এ।</strong> কেউ http লিখলে Caddy তাকে 308
                  দিয়ে HTTPS এ পাঠায় (Module 06), আর Let&apos;s Encrypt এর HTTP-01 Challenge এই
                  Port দিয়েই আসে। 80 বন্ধ করলে Certificate নবীকরণ আটকে যেতে পারে।
                </ListItem>
                <ListItem>
                  <strong>443 দুইবার, TCP আর UDP।</strong> UDP টা HTTP/3 এর জন্য। এটা বন্ধ থাকলেও
                  সাইট চলে, Browser HTTP/2 তে নেমে আসে, শুধু HTTP/3 এর সুবিধা হারায়।
                </ListItem>
                <ListItem>
                  <strong>3000, 5432, 6379 এর কোনো Rule নেই।</strong> Default deny ই তাদের পাহারা।
                  তার উপর API এর Container Publish করা শুধু <code>127.0.0.1:3000</code> এ, যেখানে
                  Caddy ডাকে, আর PostgreSQL ও Redis একদমই Publish করা নয়। Database দেখতে হলে দল
                  SSH Tunnel ব্যবহার করে (লেসন ০৩)।
                </ListItem>
                <ListItem>
                  <strong>Hostinger এর Firewall এ হুবহু একই চারটা Rule।</strong> দুই দেয়াল, এক
                  তালিকা। একটা বদলালে অন্যটাও একই দিনে, আর বদলটা Server এর Runbook এ লেখা হয়
                  (লেসন ১১)।
                </ListItem>
                <ListItem>
                  <strong>Logging medium, আর মাসে একবার যাচাই।</strong> মাসের প্রথম সোমবার একজন বাইরে
                  থেকে nc দিয়ে ছয়টা দরজা পরীক্ষা করেন, আর <code>docker ps</code> এ কোনো{" "}
                  <code>0.0.0.0</code> আছে কি না দেখেন। শুরুর গল্পের মতো ভুল এভাবেই ধরা পড়ে, ক্ষতি
                  হওয়ার আগে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আপনার my-tours এর জন্যও একই তালিকা, শুধু এখনো Caddy না বসলে 80 আর 443 পরে খুলবেন।
                my-tours এর App লেসন ০২ এর মতো <code>my-tours-api.service</code> হিসেবে চলে, আর তার
                <code> api.env</code> এ <code>PORT=3000</code>। নিশ্চিত করুন সে শুধু{" "}
                <code>127.0.0.1</code> এ শোনে, তারপর বাইরে থেকে প্রমাণ করুন 3000 বন্ধ।
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
      title: <SectionTitle>দুইটা Packet, একই মুহূর্তে, দুইটা আলাদা পরিণতি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ঢাকার এক পর্যটক Island Tours এর পাতা খুলছেন, আর ঠিক সেই সেকেন্ডে পৃথিবীর অন্য প্রান্তের
              একটা Scanner খুঁজছে খোলা PostgreSQL। দুইটা Packet এর যাত্রা, পাশাপাশি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "পর্যটকের SYN রওনা দেয়",
              description:
                "গন্তব্য 103.94.135.2:443। বাসার Router এর NAT এর পর Source 203.0.113.25:62001 (Module 05)। একই সময়ে Scanner 198.51.100.7 থেকে 103.94.135.2:5432 এ একটা SYN পাঠায়।",
            },
            {
              title: "Provider এর Cloud Firewall",
              description:
                "পর্যটকের Packet: TCP 443 এর accept Rule মেলে, পার। Scanner এর Packet: 5432 এর কোনো Rule নেই, Default drop, এখানেই শেষ। Server জানতেও পারে না।",
            },
            {
              title: "Server এর eth0 তে পৌঁছানো",
              description:
                "পর্যটকের Packet Network Card থেকে Kernel এর netfilter এ ঢোকে, INPUT চেইন। কোনো Program এখনো কিছু জানে না।",
            },
            {
              title: "ufw এর আগের চেকগুলো",
              description:
                "lo থেকে নয়। খাতায় নেই, কারণ নতুন Connection, তাই ESTABLISHED নয়। INVALID ও নয়। তাই এগিয়ে যায় আপনার Rule এর দিকে।",
            },
            {
              title: "আপনার Rule, উপর থেকে নিচে",
              description:
                "22 এর limit মেলে না, 80 মেলে না, 443/tcp ALLOW মেলে। সিদ্ধান্ত: ঢুকতে দেওয়া। conntrack খাতায় নতুন লাইন লেখা হয়।",
            },
            {
              title: "Caddy এর হাতে",
              description:
                "Kernel Packet টা Port 443 এ শোনা Caddy এর Socket এ দেয়। Handshake, তারপর TLS (Module 06)।",
            },
            {
              title: "Caddy App কে ডাকে",
              description:
                "127.0.0.1:3000 এ, lo দিয়ে। ufw এর প্রথম লাইনই lo কে ঢুকতে দেয়, তাই 3000 এর কোনো Rule ছাড়াই কাজ হয়, অথচ বাইরে থেকে 3000 বন্ধ।",
            },
            {
              title: "উত্তর ফেরে, পরের Packet গুলো সোজা পার",
              description:
                "Outgoing allow, তাই উত্তর বেরিয়ে যায়। পর্যটকের পরের প্রতিটা Packet খাতায় পাওয়া যায়, ESTABLISHED, তাই আপনার Rule তালিকা পর্যন্ত যেতেই হয় না।",
            },
            {
              title: "আর যদি বাইরের দেয়ালে ভুল থাকত",
              description:
                "Scanner এর Packet Cloud Firewall পার হয়ে এলেও ufw এর কোনো Rule মেলে না, Default deny, চুপচাপ বাদ। একটা [UFW BLOCK] লাইন লেখা হয়, মিনিটে ৩ টার সীমার ভেতরে থাকলে। আর API এর Container 127.0.0.1 এ Publish করা, তাই Docker এর পথেও কোনো দরজা নেই।",
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
                <strong>নিচের Lab টা আগে করুন</strong>, নিজের Practice Server আর laptop দিয়ে।
                তালাবন্ধ হওয়া, deny আর reject এর সময়, ক্রমের ভুল, limit আর Docker এর ফাঁদ, সবকিছু
                নিজের হাতে ঘটানোর কোনো বিকল্প নেই।
              </ListItem>
              <ListItem>
                <strong>ufw এর man page</strong>, প্রতিটা কমান্ড আর তার সব রূপ এক জায়গায়। Terminal
                এ <code>man ufw</code>, অথবা{" "}
                {external("https://manpages.ubuntu.com/manpages/noble/en/man8/ufw.8.html", "manpages.ubuntu.com, ufw(8)")}
              </ListItem>
              <ListItem>
                <strong>Ubuntu Server এর Firewall নির্দেশিকা</strong>, ufw এর সাথে IP Masquerading আর
                Application Profile এর বিস্তারিত।{" "}
                {external("https://documentation.ubuntu.com/server/how-to/security/firewalls/", "documentation.ubuntu.com, Firewalls")}
              </ListItem>
              <ListItem>
                <strong>Docker এর Packet Filtering আর Firewall পাতা</strong>, ufw এর সাথে বিরোধ,
                DOCKER-USER চেইন আর localhost এ Publish করার সতর্কতা, Docker এর নিজের ভাষায়।{" "}
                {external("https://docs.docker.com/engine/network/packet-filtering-firewalls/", "docs.docker.com, Packet filtering and firewalls")}
              </ListItem>
              <ListItem>
                <strong>Hostinger এর Managed VPS Firewall নির্দেশিকা</strong>, Island Tours এর
                Provider এর Cloud Firewall বানানোর ধাপ। অন্য Provider এ তাদের নিজের নথি।{" "}
                {external("https://www.hostinger.com/support/8172641-how-to-use-a-managed-vps-firewall-at-hostinger/", "hostinger.com, managed VPS firewall")}
              </ListItem>
              <ListItem>
                <strong>Ubuntu Community এর UFW পাতা</strong>, অনেক উদাহরণ সহ, পুরনো Version এর
                কিছু কথাও আছে, তাই নিজের যন্ত্রে মিলিয়ে নেবেন।{" "}
                {external("https://help.ubuntu.com/community/UFW", "help.ubuntu.com, UFW")}
              </ListItem>
              <ListItem>
                <strong>netfilter প্রকল্প</strong>, iptables আর nftables এর বাড়ি, নিচের তলাটা গভীরে
                জানতে চাইলে।{" "}
                {external("https://www.netfilter.org/", "netfilter.org")}
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
                Firewall হলো Kernel এর ভেতরের একটা Rule তালিকা, যা প্রতিটা Packet কে কোনো Program
                দেখার আগেই ঢুকতে দেয় বা দেয় না। একটা VPS এর সামনে বাসার মতো NAT নেই, তাই এটা নিজে
                বসাতে হয়।
              </ListItem>
              <ListItem>
                আসল সিদ্ধান্ত হয় netfilter এ। iptables আর nftables সেখানে Rule লেখে, ufw তাদের সহজ
                মুখ। Rule থাকে <code>/etc/ufw/user.rules</code> এ, Boot এ বসায়{" "}
                <code>ufw.service</code>।
              </ListItem>
              <ListItem>
                Stateful: নিজের শুরু করা Connection এর উত্তর ESTABLISHED হিসেবে ঢোকে, lo সবসময় খোলা।
                তাই deny incoming দিয়েও Server বাইরে ডাকতে পারে, আর Caddy 127.0.0.1 এ App কে।
              </ListItem>
              <ListItem>
                আগে <code>ss -tlnp</code>, তারপর Rule। যে দরজা বাইরের নয়, তা শুধু 127.0.0.1 এ, আর
                Firewall এও বন্ধ। দুইটাই।
              </ListItem>
              <ListItem>
                চালুর ক্রম: Session খোলা রেখে আগে <code>allow OpenSSH</code> বা <code>limit</code>,
                তারপর <code>show added</code>, তারপর <code>enable</code>, তারপর দ্বিতীয় Terminal এ
                প্রমাণ। ভুল ক্রমে চালু Session বাঁচে, নতুন Session timed out।
              </ListItem>
              <ListItem>
                deny চুপচাপ ফেলে, Client পায় timed out। reject RST পাঠায়, Client পায় Connection
                refused। প্রথম যে Rule মেলে সিদ্ধান্ত তার, তাই নির্দিষ্ট Rule উপরে, <code>insert 1</code>।
              </ListItem>
              <ListItem>
                limit: একই ঠিকানা থেকে ৩০ সেকেন্ডে ৬ টা নতুন চেষ্টা হলে আটকায়, আর আটকানো চেষ্টাও
                গোনা হয়। Source দিয়ে বাঁধা তখনই, যখন ঠিকানা সত্যিই স্থির।
              </ListItem>
              <ListItem>
                Docker এর <code>-p 5432:5432</code> ufw কে পাশ কাটায়। শুধু 127.0.0.1 এ Publish করুন,
                বাইরে থেকে যাচাই করুন, আর Provider এর Cloud Firewall এ একই তালিকা রাখুন।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৭, System Logs",
          content: (
            <p>
              আজ দারোয়ান বসালেন, আর দেখলেন তিনি একটা খাতাও রাখেন, যার নাম Kernel এর Log। কিন্তু
              Server এ খাতা একটা নয়, অনেক। SSH এর ঢোকার চেষ্টা, Caddy এর প্রতিটা Request, আপনার
              App এর রাতে হঠাৎ বন্ধ হয়ে যাওয়ার কারণ, সবকিছু কোথাও না কোথাও লেখা থাকে। কোথায় থাকে,
              আর হাজার লাইনের ভিড় থেকে আসল লাইনটা কীভাবে খুঁজবেন, সেটাই পরের লেসন:{" "}
              {lessonLink("system-logs", "System Logs (journalctl, systemctl)")}।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Firewall", "Kernel এর Rule তালিকা, Program এর আগেই প্রতিটা Packet এর সিদ্ধান্ত"],
      ["Packet Filter", "শুধু খামের তথ্য দেখে: IP, Port, Protocol, অবস্থা। ভেতরের লেখা নয়"],
      ["netfilter", "Kernel এর যে অংশে Packet মেলানো হয়। চেইন: INPUT, OUTPUT, FORWARD"],
      ["iptables, nftables", "netfilter এ Rule লেখার Tool। Ubuntu 24.04 এ iptables পেছনে nf_tables"],
      ["ufw", "Ubuntu এর সহজ মুখ। Rule রাখে /etc/ufw/user.rules এ, Boot এ বসায় ufw.service"],
      ["Default Policy", "কোনো Rule না মিললে কী হবে। Server এ deny incoming, allow outgoing"],
      ["Stateful, conntrack", "চেনা কথোপকথনের Packet ESTABLISHED হিসেবে ঢোকে, Rule ছাড়াই"],
      ["Loopback, lo", "127.0.0.1, যন্ত্রের নিজের সাথে কথা। ufw সবসময় ঢুকতে দেয়"],
      ["deny", "DROP, চুপচাপ ফেলা। বাইরে থেকে timed out"],
      ["reject", "RST পাঠিয়ে না বলা। বাইরে থেকে Connection refused, প্রায় সাথে সাথে"],
      ["limit", "একই ঠিকানা থেকে ৩০ সেকেন্ডে ৬ টা নতুন চেষ্টা হলে আটকায়"],
      ["Rule এর ক্রম", "প্রথম যে Rule মেলে, সিদ্ধান্ত তার। নির্দিষ্ট Rule insert 1 দিয়ে উপরে"],
      ["App Profile", "Port এর একটা নাম দেওয়া তালিকা, যেমন OpenSSH মানে 22/tcp"],
      ["IPV6=yes", "প্রতিটা Rule এর IPv6 যমজ। no করলে IPv6 এর সব দরজা খোলা"],
      ["[UFW BLOCK]", "আটকানো Packet এর Log লাইন। SRC, DST, DPT পড়লেই গল্প বোঝা যায়"],
      ["Docker এর ফাঁদ", "-p দিয়ে Publish করা Port nat টেবিল দিয়ে ufw কে পাশ কাটায়। 127.0.0.1 এ Publish করুন"],
      ["Cloud Firewall", "Provider এর Network এ বসা বাইরের দেয়াল, Server এর ভুলে টিকে থাকে"],
      ["Defence in Depth", "একই তালিকা দুই দেয়ালে, যাতে এক স্তরের ভুলে দরজা খুলে না যায়"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "ufw এর Default deny incoming চালু। তবুও Server এ sudo apt update দিব্যি কাজ করছে, যদিও উত্তর আসছে বাইরে থেকে। কেন?",
        options: [
          {
            key: "A",
            text: "apt এর Port টা ufw নিজে থেকে খুলে রাখে",
            isCorrect: false,
            explanation: "ufw apt এর জন্য কোনো Port খোলে না। ufw status এ এমন কোনো Rule দেখবেন না।",
          },
          {
            key: "B",
            text: "Server নিজে Connection শুরু করেছে, তাই উত্তরগুলো ESTABLISHED হিসেবে খাতায় পাওয়া যায় আর ঢোকে",
            isCorrect: true,
            explanation:
              "ঠিক। ufw-before-input এর RELATED,ESTABLISHED লাইন নিজের শুরু করা কথোপকথনের উত্তর ঢুকতে দেয়। এটাই Stateful Firewall।",
          },
          {
            key: "C",
            text: "Outgoing allow মানে দুই দিকেই সব খোলা",
            isCorrect: false,
            explanation:
              "Outgoing allow শুধু বের হতে দেয়। ফেরার Packet ঢোকে conntrack এর কারণে, আলাদা নিয়মে।",
          },
          {
            key: "D",
            text: "ufw শুধু TCP আটকায়, apt চলে UDP তে",
            isCorrect: false,
            explanation: "ufw TCP আর UDP দুইটাই আটকায়, আর apt এর Download চলে TCP তে, HTTP বা HTTPS এ।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা নতুন VPS এ SSH দিয়ে ঢুকে প্রথমবার ufw চালু করবেন। কোন ক্রমটা নিরাপদ?",
        options: [
          {
            key: "A",
            text: "sudo ufw enable, তারপর sudo ufw allow OpenSSH",
            isCorrect: false,
            explanation:
              "চালু Session টা বাঁচবে, তাই ভুলটা চোখে পড়বে না। কিন্তু মাঝের মুহূর্তে অন্য কোনো Session বা Deploy ঢুকতে পারবে না, আর মাঝপথে Connection কাটলে আপনি বাইরে।",
          },
          {
            key: "B",
            text: "sudo ufw allow OpenSSH, sudo ufw show added, sudo ufw enable, তারপর পুরনো Session খোলা রেখে নতুন Terminal এ SSH করে দেখা",
            isCorrect: true,
            explanation:
              "ঠিক। আগে দরজা, তারপর তালিকা মিলানো, তারপর তালা, আর পুরনো Session বন্ধ করার আগে প্রমাণ।",
          },
          {
            key: "C",
            text: "sudo ufw enable, তারপর Terminal বন্ধ করে আবার ঢুকে দেখা",
            isCorrect: false,
            explanation: "এটাই ঠিক সেই ফাঁদ। নতুন Session timed out হবে, আর তখন শুধু Web Console ভরসা।",
          },
          {
            key: "D",
            text: "sudo ufw default allow incoming, তারপর sudo ufw enable",
            isCorrect: false,
            explanation: "তাহলে তালাবন্ধ হবেন না ঠিকই, কিন্তু Firewall টাও কিছু আটকাবে না।",
          },
        ],
      },
      {
        id: 3,
        text: "laptop থেকে nc -vz -w 3 দিয়ে একটা Port এ টোকা দিলেন। উত্তর এলো timed out। সবচেয়ে সম্ভাব্য অর্থ কোনটা?",
        options: [
          {
            key: "A",
            text: "Server এ ওই Port এ কোনো Program শুনছে না",
            isCorrect: false,
            explanation: "কেউ না শুনলে, আর পথে কেউ না আটকালে, Kernel সাথে সাথে RST পাঠায়, উত্তর হয় Connection refused।",
          },
          {
            key: "B",
            text: "পথে কেউ Packet টা চুপচাপ ফেলে দিচ্ছে, যেমন ufw এর deny, Provider এর Firewall, বা ভুল IP",
            isCorrect: true,
            explanation:
              "ঠিক। deny মানে DROP, কোনো উত্তর যায় না, তাই Client নিজের ধৈর্য ফুরানো পর্যন্ত অপেক্ষা করে।",
          },
          {
            key: "C",
            text: "ufw এ ওই Port এর জন্য reject Rule আছে",
            isCorrect: false,
            explanation: "reject RST পাঠায়, উত্তর আসে প্রায় সাথে সাথে, Connection refused।",
          },
          {
            key: "D",
            text: "Port টা খোলা, শুধু Server ধীর",
            isCorrect: false,
            explanation: "খোলা Port এ Handshake মিলিসেকেন্ডে হয়, ব্যস্ত Server হলেও ৩ সেকেন্ডে SYN-ACK প্রায় সবসময় আসে।",
          },
        ],
      },
      {
        id: 4,
        text: "ufw status numbered এ Rule 1 হলো 80/tcp ALLOW IN Anywhere। আপনি sudo ufw deny from 198.51.100.7 to any port 80 proto tcp চালালেন, সেটা বসল Rule 6 এ। 198.51.100.7 কি এখন Port 80 এ ঢুকতে পারবে?",
        options: [
          {
            key: "A",
            text: "না, deny সবসময় allow এর চেয়ে শক্তিশালী",
            isCorrect: false,
            explanation: "ufw এ শক্তিশালী দুর্বল বলে কিছু নেই, আছে শুধু ক্রম।",
          },
          {
            key: "B",
            text: "হ্যাঁ, কারণ Rule 1 আগেই মিলে যায় আর সিদ্ধান্ত সেখানেই। সারাতে deny টা insert 1 দিয়ে উপরে বসাতে হবে",
            isCorrect: true,
            explanation: "ঠিক। প্রথম যে Rule মেলে, সিদ্ধান্ত তার। Practice Server এ ঠিক এটাই দেখা গেছে।",
          },
          {
            key: "C",
            text: "না, ufw নিজে থেকে deny গুলো উপরে সাজিয়ে নেয়",
            isCorrect: false,
            explanation: "ufw নতুন Rule শেষে বসায়, নিজে থেকে কিছু সাজায় না।",
          },
          {
            key: "D",
            text: "Reboot এর পর আটকাবে",
            isCorrect: false,
            explanation: "Reboot এ একই ক্রমে একই Rule ফিরে আসে, তাই ফলও একই।",
          },
        ],
      },
      {
        id: 5,
        text: "ufw চালু, Default deny, 5432 এর কোনো Rule নেই। একজন docker run -p 5432:5432 postgres চালালেন। বাইরে থেকে 5432 এ কী হবে?",
        options: [
          {
            key: "A",
            text: "timed out, কারণ ufw এর Default deny",
            isCorrect: false,
            explanation: "ufw এর Rule থাকে INPUT চেইনে, আর এই Packet সেখানে যায়ই না।",
          },
          {
            key: "B",
            text: "খোলা পাওয়া যাবে, কারণ Docker nat টেবিলে গন্তব্য বদলে Packet কে FORWARD এ পাঠায়, ufw এর আগেই",
            isCorrect: true,
            explanation:
              "ঠিক। Docker এর নিজের নথি এটাকে ufw এর সাথে বিরোধ বলে। সমাধান -p 127.0.0.1:5432:5432, অথবা একদমই Publish না করা, আর বাইরে Cloud Firewall।",
          },
          {
            key: "C",
            text: "Connection refused, কারণ PostgreSQL এর Default শুধু localhost",
            isCorrect: false,
            explanation: "Container এর ভেতরে PostgreSQL তার নিজের Interface এ শোনে, আর Docker সেখানে পৌঁছে দেয়।",
          },
          {
            key: "D",
            text: "Docker চালু হতেই ufw বন্ধ হয়ে যাবে",
            isCorrect: false,
            explanation: "ufw চালুই থাকে, status ও active দেখায়। সমস্যা হলো সে এই Packet দেখেই না।",
          },
        ],
      },
      {
        id: 6,
        text: "SSH এ sudo ufw limit 22/tcp বসানো। একটা Script একই ঠিকানা থেকে প্রতি ২ সেকেন্ডে একবার SSH চেষ্টা করছে, আর ষষ্ঠবার থেকে আটকে গেছে। Script কি কিছুক্ষণ পর নিজে থেকে ঢুকতে পারবে?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, ৩০ সেকেন্ড পরে নিজে থেকে খুলে যায়",
            isCorrect: false,
            explanation:
              "৩০ সেকেন্ডের হিসাবটা প্রতিটা চেষ্টা থেকে গোনা হয়। Script থামে না বলে জানালাটা কখনো খালি হয় না।",
          },
          {
            key: "B",
            text: "না, কারণ আটকানো চেষ্টাও গোনা হয়। পুরো ৩০ সেকেন্ড চুপ থাকলে তবেই আবার ঢুকবে",
            isCorrect: true,
            explanation: "ঠিক। Practice Server এ ২ সেকেন্ড পরপর চেষ্টা করা Loop দেড় মিনিটেও ঢুকতে পারেনি, ৩২ সেকেন্ড চুপ থাকার পর প্রথম চেষ্টাতেই ঢুকেছে।",
          },
          {
            key: "C",
            text: "না, limit একবার আটকালে চিরদিনের জন্য নিষিদ্ধ করে",
            isCorrect: false,
            explanation: "চিরদিনের নিষেধ limit এর কাজ নয়, চুপ থাকলেই ছাড়া পায়।",
          },
          {
            key: "D",
            text: "হ্যাঁ, যদি Password ঠিক থাকে",
            isCorrect: false,
            explanation: "limit Login এর ফল জানে না, শুধু নতুন Connection এর সংখ্যা গোনে।",
          },
        ],
      },
      {
        id: 7,
        text: "একজন /etc/default/ufw এ IPV6=no করে দিলেন, কারণ মনে হলো IPv6 লাগে না। Server এর একটা IPv6 ঠিকানা আছে। কী ঝুঁকি তৈরি হলো?",
        options: [
          {
            key: "A",
            text: "কোনো ঝুঁকি নেই, IPv6 দিয়ে কেউ আসে না",
            isCorrect: false,
            explanation: "বহু Network আর ফোন এখন IPv6 ব্যবহার করে, আর Scanner রাও।",
          },
          {
            key: "B",
            text: "ufw আর IPv6 ছোঁবে না, তাই IPv4 এ বন্ধ সব দরজা IPv6 ঠিকানা দিয়ে খোলা থাকতে পারে",
            isCorrect: true,
            explanation: "ঠিক। একটা পেছনের দরজা। IPV6=yes রাখুন, প্রতিটা Rule এর v6 যমজ হবে।",
          },
          {
            key: "C",
            text: "IPv4 এর সব Rule ও কাজ করা বন্ধ করে দেবে",
            isCorrect: false,
            explanation: "IPv4 এর Rule আগের মতোই চলবে। সমস্যাটা শুধু IPv6 এর দিকে।",
          },
          {
            key: "D",
            text: "Server এর IPv6 ঠিকানা মুছে যাবে",
            isCorrect: false,
            explanation: "ufw ঠিকানা বদলায় না, শুধু Rule লেখে বা লেখে না।",
          },
        ],
      },
      {
        id: 8,
        text: "Provider এর Cloud Firewall আর ufw নিয়ে কোন কথাটা ঠিক?",
        options: [
          {
            key: "A",
            text: "Cloud Firewall থাকলে ufw বন্ধ রাখাই ভালো, দুইটা একসাথে ঝামেলা করে",
            isCorrect: false,
            explanation: "দুইটা আলাদা জায়গায় বসে, একে অপরের সাথে ঝগড়া করে না। একই তালিকা দুই জায়গায় রাখাই নিয়ম।",
          },
          {
            key: "B",
            text: "Cloud Firewall Server এর বাইরে বসে, তাই Docker এর Publish করা Port বা Server এর ভেতরের ভুলেও টিকে থাকে, আর ufw দেয় limit, Log আর সূক্ষ্ম Rule",
            isCorrect: true,
            explanation: "ঠিক। দুইটা দেয়াল, প্রতিটা অন্যটার একটা নির্দিষ্ট ভুল ধরে। একে বলে Defence in Depth।",
          },
          {
            key: "C",
            text: "Cloud Firewall এ ভুল করলে Web Console ও বন্ধ হয়ে যায়",
            isCorrect: false,
            explanation: "Web Console Network এর Port দিয়ে যায় না, তাই Firewall তাকে আটকায় না।",
          },
          {
            key: "D",
            text: "Cloud Firewall শুধু Outgoing Traffic নিয়ন্ত্রণ করে",
            isCorrect: false,
            explanation: "মূল কাজ Incoming আটকানো, ঠিক ufw এর মতো, শুধু Server এর বাইরে থেকে।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের Practice Server এ একটা দেয়াল তুলুন, তারপর ভাঙুন",
    subtitle: "দুইটা যন্ত্র লাগবে: Practice Server আর বাইরে থেকে টোকা দেওয়ার জন্য আপনার laptop",
    stepName: "LAB",
    steps: [
      {
        title: "দরজাগুলো চেনা",
        description:
          "Server এ পরীক্ষার জন্য তিনটা ছোট Program চালান যারা 3000, 5432 আর 6379 এ শোনে, ss -tlnp দিয়ে দেখুন, আর laptop থেকে ছয়টা দরজায় টোকা দিন। সব succeeded আসার কথা।",
      },
      {
        title: "নিরাপদ ক্রমে ufw চালু",
        description:
          "Default নীতি, আগে OpenSSH, তারপর 80, 443/tcp, 443/udp, show added, enable, আর পুরনো Session খোলা রেখে দ্বিতীয় Terminal এ SSH। laptop থেকে আবার টোকা: তিনটা succeeded, তিনটা timed out।",
      },
      {
        title: "deny আর reject এর সময় মাপা",
        description:
          "6379 এ reject বসিয়ে time দিয়ে 5432 আর 6379 দুইটায় টোকা দিন। একটায় প্রায় ৩ সেকেন্ড, অন্যটায় কয়েক মিলিসেকেন্ড আসার কথা।",
      },
      {
        title: "ক্রমের ভুল ঘটানো আর সারানো",
        description:
          "নিজের laptop এর ঠিকানাকে Port 80 এ deny করুন শেষে যোগ করে, দেখুন কাজ করে না। তারপর insert 1 দিয়ে উপরে বসান, দেখুন এবার আটকায়। শেষে Rule টা মুছে দিন।",
      },
      {
        title: "limit এর গোনা দেখা",
        description:
          "OpenSSH এর allow বদলে limit বসান, laptop থেকে পরপর আটবার টোকা দিন। পাঁচবার ঢোকার পর আটকানোর কথা। তারপর ৩২ সেকেন্ড চুপ থেকে একবার।",
      },
      {
        title: "Docker এর ফাঁদ নিজের চোখে",
        description:
          "Practice Server এ Docker থাকলে 5432 এ একটা ছোট Container Publish করুন, ufw এ কোনো Rule ছাড়াই laptop থেকে ঢুকে যাবে। তারপর 127.0.0.1 এ Publish করে দেখুন বন্ধ। শেষে সব পরিষ্কার।",
      },
    ],
    codeBlocks: [
      {
        filename: "0-prepare.sh",
        language: "bash",
        code: `# ===== Server এ (deploy@...) =====
# পরীক্ষার জন্য তিনটা ছোট Program, systemd এর অস্থায়ী Unit হিসেবে (লেসন ০২)
sudo systemd-run --unit=lab-app   python3 -m http.server 3000 --bind 0.0.0.0
sudo systemd-run --unit=lab-pg    python3 -m http.server 5432 --bind 0.0.0.0
sudo systemd-run --unit=lab-redis python3 -m http.server 6379 --bind 0.0.0.0

# কে কোথায় শুনছে। 22, 3000, 5432, 6379 দেখার কথা, সব 0.0.0.0 এ
sudo ss -tlnp

# এখন ufw বন্ধ কি না
sudo ufw status

# ===== laptop এ =====
# Server এর ঠিকানাটা একবার একটা Variable এ রাখুন। আসল VPS এ তার Public IP,
# লেসন ০১ এর Multipass Practice VM হলে multipass info এর IPv4 লাইনটা।
export SERVER=your-server-ip-here
ssh deploy@$SERVER hostname`,
      },
      {
        filename: "1-knock.sh",
        language: "bash",
        code: `# ===== laptop এ =====
# প্রতিটা দরজায় টোকা। ufw চালুর আগে আর পরে দুইবারই এটা চালাবেন।
# succeeded = খোলা, timed out = পথে কেউ ফেলে দিচ্ছে, refused = পৌঁছেছেন কিন্তু কেউ শুনছে না
for p in 22 80 443 3000 5432 6379; do
  nc -vz -w 3 "$SERVER" "$p"
done`,
      },
      {
        filename: "2-enable-safely.sh",
        language: "bash",
        code: `# ===== Server এ, একটা SSH Session থেকে। এই Session কাজ শেষ না হওয়া পর্যন্ত বন্ধ করবেন না =====
sudo ufw default deny incoming
sudo ufw default allow outgoing

# আগে নিজের দরজা। SSH এর Port বদলে থাকলে OpenSSH এর বদলে সেই নম্বর/tcp লিখুন
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp

# চালুর আগে চোখে দেখা, SSH এর লাইনটা আছে তো?
sudo ufw show added

# চালু। প্রশ্ন এলে y
sudo ufw enable
sudo ufw status verbose

# ===== laptop এর নতুন একটা Terminal এ, পুরনো Session খোলা রেখেই =====
ssh deploy@$SERVER hostname      # নাম এলে সব ঠিক। তারপর 1-knock.sh আবার চালান
# আশা: 22, 80, 443 এ succeeded (80 আর 443 এ কেউ না শুনলে refused, সেটাও ঠিক)
#       3000, 5432, 6379 এ timed out`,
      },
      {
        filename: "3-deny-vs-reject.sh",
        language: "bash",
        code: `# ===== Server এ =====
sudo ufw reject 6379/tcp
sudo ufw status numbered

# ===== laptop এ =====
# 5432 এর কোনো Rule নেই, তাই Default deny। 6379 এ reject।
time nc -vz -w 3 "$SERVER" 5432     # আশা: timed out, real প্রায় 3 সেকেন্ড
time nc -vz -w 3 "$SERVER" 6379     # আশা: Connection refused, real কয়েক মিলিসেকেন্ড

# ===== Server এ, পরিষ্কার =====
sudo ufw delete reject 6379/tcp`,
      },
      {
        filename: "4-order-and-limit.sh",
        language: "bash",
        code: `# ===== Server এ, SSH Session এর ভেতর থেকে =====
# SSH_CLIENT এর প্রথম শব্দ হলো যে ঠিকানা থেকে আপনি ঢুকেছেন, মানে Server এর চোখে আপনার laptop
export LAPTOP_IP=$(echo "$SSH_CLIENT" | cut -d' ' -f1)
echo "$LAPTOP_IP"

# ক্রমের ভুল: শেষে যোগ করা deny
sudo ufw deny from "$LAPTOP_IP" to any port 80 proto tcp
sudo ufw status numbered
# laptop থেকে: nc -vz -w 3 "$SERVER" 80   আশা: আগের মতোই ঢুকে যাবে (বা refused)

# সারানো: মুছে উপরে বসানো
sudo ufw delete deny from "$LAPTOP_IP" to any port 80 proto tcp
sudo ufw insert 1 deny from "$LAPTOP_IP" to any port 80 proto tcp
# laptop থেকে: nc -vz -w 3 "$SERVER" 80   আশা: timed out
sudo ufw delete deny from "$LAPTOP_IP" to any port 80 proto tcp

# limit: allow এর বদলে। আগে limit যোগ, তারপর allow মোছা, যাতে এক মুহূর্তও SSH এর Rule ছাড়া না থাকে
sudo ufw limit OpenSSH
sudo ufw delete allow OpenSSH
sudo ufw status

# ===== laptop এ =====
for i in 1 2 3 4 5 6 7 8; do
  printf "try %s: " "$i"; nc -z -w 2 "$SERVER" 22 && echo connected || echo "no answer"
done
# আশা: পাঁচবার connected, তারপর no answer। এখন ৩২ সেকেন্ড কিছু করবেন না:
sleep 32; nc -vz -w 2 "$SERVER" 22   # আশা: succeeded`,
      },
      {
        filename: "5-docker-trap-and-cleanup.sh",
        language: "bash",
        code: `# ===== Server এ, যদি Docker বসানো থাকে (না থাকলে এই অংশ বাদ, Docker Module এ ফিরবেন) =====
sudo systemctl stop lab-pg                      # 5432 খালি করা
docker run -d --name pg-oops -p 5432:5432 busybox:1.37 httpd -f -p 5432
docker ps --format "{{.Names}}  {{.Ports}}"     # আশা: 0.0.0.0:5432->5432/tcp
sudo ufw status | grep -c 5432                  # আশা: 0

# ===== laptop এ =====
nc -vz -w 3 "$SERVER" 5432                      # আশা: succeeded, ufw থাকা সত্ত্বেও

# ===== Server এ, সারানো =====
docker rm -f pg-oops
docker run -d --name pg-safe -p 127.0.0.1:5432:5432 busybox:1.37 httpd -f -p 5432
curl -s -o /dev/null -w "%{http_code}\\n" http://127.0.0.1:5432/   # আশা: 404, মানে পৌঁছেছে
# laptop থেকে: nc -vz -w 3 "$SERVER" 5432      আশা: timed out

# ===== শেষে পরিষ্কার =====
docker rm -f pg-safe
sudo systemctl stop lab-app lab-redis
# Practice Server হলে চাইলে সব মুছে নতুন করে শুরু: sudo ufw reset
# আসল VPS হলে reset করবেন না, 2-enable-safely.sh এর তালিকাটাই রেখে দিন`,
      },
    ],
    tip: "পরীক্ষা ২ এর পরে একটা কাজ ইচ্ছা করে করুন: পুরনো Session টা বন্ধ করার আগে থামুন আর নিজেকে জিজ্ঞেস করুন, নতুন Session ঢুকতে না পারলে আমার কাছে কোন পথ খোলা থাকবে। উত্তরটা যদি সাথে সাথে না আসে, তাহলে আসল VPS এ ufw চালুর আগে Provider এর Web Console এ একবার ঢুকে দেখে নিন সেটা কাজ করে আর deploy এর Password আপনার জানা। Firewall এর সব কৌশলের চেয়ে এই একটা অভ্যাস বেশি দামি, কারণ বাকি সব ভুল সারানো যায়, কিন্তু নিজের Server থেকে বাইরে থাকলে সারানোর সুযোগটাই থাকে না।",
  },
  assignment: {
    title: "Mini Project: my-tours এর দেয়াল, লিখিত আর প্রমাণিত",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>দরজার তালিকা বানান:</strong> নিজের Practice Server বা VPS এ <code>sudo ss -tlnp</code>{" "}
        চালিয়ে প্রতিটা Listen করা Port এর একটা টেবিল বানান: Port, কোন Program, কোন ঠিকানায়
        শুনছে (0.0.0.0 নাকি 127.0.0.1), বাইরে খোলা থাকা উচিত কি না, আর কেন। যেগুলো ভুল ঠিকানায়
        শুনছে, সেগুলোর Setting কোথায় বদলাবেন তাও লিখুন।
      </span>,
      <span key="2">
        <strong>my-tours এর ufw Script:</strong> একটা <code>firewall.sh</code> লিখুন যা Default
        নীতি, <code>limit OpenSSH</code>, 80/tcp, 443/tcp আর 443/udp বসায়, প্রতিটায় একটা{" "}
        <code>comment</code> সহ, আর শেষে <code>ufw show added</code> দেখিয়ে থামে, নিজে{" "}
        <code>enable</code> করে না। তারপর হাতে নিরাপদ ক্রমে চালু করুন আর{" "}
        <code>sudo ufw status verbose</code> এর আউটপুট জমা দিন।
      </span>,
      <span key="3">
        <strong>বাইরে থেকে প্রমাণ:</strong> laptop থেকে ছয়টা Port এ <code>nc -vz -w 3</code>{" "}
        চালিয়ে একটা টেবিল বানান: প্রত্যাশিত ফল, আসল ফল, মিলল কি না। তারপর Server Reboot করে আবার
        চালান, আর প্রমাণ করুন ufw ফিরে এসেছে আর ফলগুলো একই আছে।
      </span>,
      <span key="4">
        <strong>ভাঙুন, তারপর সারান:</strong> ইচ্ছা করে একটা দরজা ভুলভাবে খুলুন, হয় Docker এর{" "}
        <code>-p 5432:5432</code> দিয়ে, নয়তো একটা Program কে 0.0.0.0 তে চালিয়ে আর ufw এ{" "}
        <code>allow</code> দিয়ে। laptop থেকে প্রমাণ করুন দরজা খোলা, তারপর সঠিকভাবে সারান আর আবার
        প্রমাণ করুন। আসল VPS হলে Provider এর Cloud Firewall এ একই চারটা Rule বসান, না হলে কী কী
        বসাতেন তার একটা টেবিল লিখুন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন বলছেন, ufw তো চালু, তাই{" "}
        <code>docker run -p 5432:5432</code> দিয়ে Database চালালেও কোনো সমস্যা নেই। তাঁকে বোঝান
        কথাটা কেন ভুল, Packet আসলে কোন পথে যায়, বাইরে থেকে কীভাবে যাচাই করবেন, আর সমস্যাটা
        সারানোর দুইটা উপায়। শেষে এক লাইনে বলুন, timed out আর Connection refused দেখলে প্রথমে কী
        সন্দেহ করবেন।
      </span>,
    ],
    deliverables: [
      <span key="1">Port এর টেবিল, প্রতিটার পাশে খোলা থাকা উচিত কি না আর কারণ</span>,
      <span key="2">firewall.sh আর চালুর পর sudo ufw status verbose এর আউটপুট</span>,
      <span key="3">বাইরে থেকে nc এর ফলাফলের টেবিল, Reboot এর আগে আর পরে</span>,
      <span key="4">ভাঙা আর সারানোর আগে পরের প্রমাণ, আর Cloud Firewall এর Rule তালিকা</span>,
      <span key="5">দলের সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
