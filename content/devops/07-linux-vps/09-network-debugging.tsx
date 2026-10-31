/**
 * What: Module 07 Lesson 09, Network Debugging. It teaches how to find where a network
 * request breaks, from outside the server inward, one layer at a time: the machine's own
 * address and route, reachability, DNS on the server, who is listening (ss), connection
 * states, bind addresses, port checks with nc, curl from inside and outside, a TLS check,
 * tcpdump, and how to read each error message.
 *
 * Why: "The site is down" is a symptom, not a diagnosis, and guessing wastes the night.
 * Every output in this lesson was captured on the practice server (Ubuntu 24.04 in a
 * container, given the scenario's addresses), so the reader sees exactly what the tools
 * print. Where a real VPS would differ, the lesson says so.
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
  NetdebugErrorLab,
  NetdebugOutsideInLab,
  NetdebugSsLab,
} from "../../../components/course/topics/linux/netdebug-animations";
import {
  NetdebugBindSplit,
  NetdebugCheckpointsDiagram,
  NetdebugDecisionTreeDiagram,
  NetdebugLayersDiagram,
  NetdebugSsLineDiagram,
  NetdebugWireSplit,
} from "../../../components/course/topics/linux/netdebug-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const linkClass = "text-primary underline underline-offset-4";

export const networkDebuggingContent: TopicData = {
  id: "network-debugging",
  introduction: {
    badge: "MODULE 07 · LESSON 09",
    title: <SectionTitle>সাইট খুলছে না, এবার কোথা থেকে শুরু করবেন</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          রাত সাড়ে নয়টা। দলের Chat এ একটা বার্তা এলো: সাইট খুলছে না। সাথে একটা ছবি,
          Browser এর ধূসর পাতায় লেখা This site can&apos;t be reached। এই মুহূর্তে
          অনেকে যা করেন, সেটা হলো সব Restart করে দেওয়া। App Restart, Caddy Restart,
          কিছু না হলে পুরো Server Reboot। কখনো কাজ হয়, বেশিরভাগ সময় হয় না, আর যখন হয়
          তখনও কেউ জানে না আসলে কী ভেঙেছিল। পরের সপ্তাহে একই জিনিস আবার ভাঙে।
        </ContentParagraph>
        <ContentParagraph>
          সাইট খুলছে না কথাটা একটা উপসর্গ, রোগ নয়। একজন পর্যটকের ফোন থেকে আপনার App
          পর্যন্ত পথে অন্তত সাতটা চৌকি আছে: নামকে ঠিকানায় বদলানো, ঠিকানা পর্যন্ত পথ,
          Provider এর Firewall, Server এর নিজের Firewall, Caddy, TLS এর তালা, আর
          শেষে App। যেকোনো একটা ভাঙলেই পর্যটক একই ধূসর পাতা দেখেন। আপনার কাজ হলো
          কোন চৌকিটা ভেঙেছে সেটা খুঁজে বের করা, অনুমান করে নয়, প্রমাণ দিয়ে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি সেই খোঁজার পদ্ধতিটা শিখবেন, আর প্রতিটা ধাপের যন্ত্র নিজের
          হাতে চালাবেন: <code>ip</code>, <code>ping</code>, <code>traceroute</code>,{" "}
          <code>dig</code>, <code>ss</code>, <code>netstat</code>, <code>lsof</code>,{" "}
          <code>nc</code>, <code>curl</code>, <code>openssl</code> আর{" "}
          <code>tcpdump</code>। এই লেসনের প্রতিটা Output একটা practice server থেকে
          নেওয়া, যেখানে Ubuntu 24.04 চলছে, Caddy চলছে, my-tours এর App চলছে, আর
          ঠিকানাগুলো Island Tours এর মতোই সাজানো। শেষে আপনি যেকোনো Error এর বার্তা
          পড়ে বলতে পারবেন কোন স্তরে সমস্যা, আর প্রথম কোন কমান্ডটা চালাতে হবে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ডাক্তার জ্বর শুনেই ওষুধ লেখেন না। আগে থার্মোমিটার, তারপর প্রশ্ন, তারপর পরীক্ষা, প্রতিটা ধাপে কয়েকটা কারণ বাদ পড়ে। Network এর রোগও এভাবেই ধরা হয়। প্রতিটা কমান্ড একটা প্রশ্ন, আর প্রতিটা উত্তর অর্ধেক সম্ভাবনা বাদ দেয়।",
      author: "Network Debugging",
      role: "Lesson 09",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "method",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>উপসর্গ থেকে রোগ: বাইরে থেকে ভেতরে, এক স্তর করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 05 এ আপনি দেখেছেন একটা Request কতগুলো স্তর পার হয়। নাম থেকে IP,
                IP থেকে পথ, পথের শেষে একটা Port, Port এর ভেতরে TLS এর তালা, তালার
                ভেতরে HTTP এর কথা। Network Debugging মানে এই স্তরগুলোকে একটা একটা করে
                পরীক্ষা করা। প্রতিটা স্তরের জন্য একটা নির্দিষ্ট প্রশ্ন আছে, আর সেই প্রশ্নের
                উত্তর দেওয়ার জন্য এক দুইটা যন্ত্র।
              </ContentParagraph>
              <ContentParagraph>
                ক্রমটা গুরুত্বপূর্ণ। নিচের স্তর ভাঙলে উপরের স্তরের পরীক্ষা কোনো কাজের
                নয়। DNS যদি ভুল ঠিকানা দেয়, তাহলে TLS পরীক্ষা করছেন ভুল Server এর।
                Port যদি বন্ধ থাকে, HTTP এর Status Code আসবেই না। তাই পরীক্ষা হয় এক
                দিক থেকে: আগে নাম, তারপর পথ, তারপর Port, তারপর TLS, শেষে HTTP। প্রথম যে
                স্তরে উত্তর ভুল আসে, সমস্যা সেখানে, আর সেখানেই আপনি থামবেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetdebugLayersDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় নিয়মটা দিক নিয়ে: বাইরে থেকে ভেতরে। পর্যটক যেখানে দাঁড়িয়ে
                আছেন, প্রথম পরীক্ষা সেখান থেকে, মানে আপনার নিজের Laptop থেকে, Server
                এর বাইরে। কারণ পর্যটকের অভিজ্ঞতা বাইরের। Server এর ভেতরে বসে সব ঠিক
                দেখলেও পর্যটক ভুক্তভোগী হতে পারেন, যদি মাঝের কোনো চৌকি বন্ধ থাকে। আর
                বাইরে থেকে কোথায় আটকাচ্ছে বোঝার পর আপনি জানবেন Server এ ঢুকে ঠিক কোন
                জিনিসটা দেখতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয় নিয়ম, সবচেয়ে কঠিন: কিছু বদলানোর আগে প্রমাণ। Restart একটা বদল।
                Firewall খুলে দেওয়া একটা বদল। প্রতিটা বদল আগের অবস্থার প্রমাণ মুছে দেয়।
                App এর Crash এর কারণ লেখা ছিল যে Log এ, Restart এর পর সেটা খুঁজতে হয়
                অনেক নিচে। তাই প্রথমে দেখুন, লিখে রাখুন, তারপর বদলান। একটা Restart
                যদি করতেই হয়, অন্তত আগে <code>systemctl status</code> এর Output টা
                কপি করে রাখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের practice server",
          content: (
            <p>
              এখানে দেখানো প্রতিটা Output একটা Ubuntu 24.04 Container থেকে নেওয়া, যার
              নাম island-vps-01, যাতে systemd, Caddy, Redis আর my-tours এর App চলছে।
              তার Network এমনভাবে সাজানো যে Server এর ঠিকানা 103.94.135.2, ঠিক Island
              Tours এর মতো, আর বাইরের Laptop টা একই Network এর 103.94.135.77। আসল
              VPS এর সাথে যেখানে তফাত আছে, সেখানে আলাদা করে বলা আছে। আপনি নিজের
              practice server এ, Lesson 01 এর যেকোনো পথে বানানো, প্রতিটা কমান্ড চালাতে
              পারবেন। অনেক যন্ত্র আগে থেকে থাকে না; দরকার হলে{" "}
              <code>sudo apt install dnsutils netcat-openbsd tcpdump traceroute mtr-tiny net-tools lsof psmisc</code>{" "}
              দিয়ে একবারে বসিয়ে নিন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "map",
      subHeader: { index: "002", title: "The Map" },
      title: <SectionTitle>পথের মানচিত্র: কোন চৌকি, কোন কমান্ড, কোথা থেকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                খোঁজা শুরুর আগে মানচিত্রটা মাথায় থাকা চাই। Module 06 এর শেষ লেসনে
                পুরো যাত্রাটা আপনি Browser এর চোখে দেখেছেন। এবার একই পথ, কিন্তু
                Server চালানো মানুষের চোখে। প্রশ্ন একটাই: পথের কোন জায়গা কোন কমান্ড দিয়ে
                পরীক্ষা করা যায়, আর কোথা থেকে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetdebugCheckpointsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মানচিত্রে একটা খাড়া দেয়াল আছে, VPS এর দেয়াল। দেয়ালের বাঁয়ে যা আছে,
                মানে Internet আর Provider এর Cloud Firewall, Server এর ভেতর থেকে আপনি
                দেখতে পান না। Provider এর Firewall Packet ফেলে দিলে Server জানতেও
                পারে না যে কেউ এসেছিল। তাই ওই অংশ পরীক্ষা করার একমাত্র উপায় বাইরে
                দাঁড়িয়ে টোকা দেওয়া।
              </ContentParagraph>
              <ContentParagraph>
                দেয়ালের ডানে যা আছে, ufw, Caddy, App আর Database, সেগুলো দুই দিক থেকেই
                পরীক্ষা করা যায়। আর এখানেই সবচেয়ে কাজের কৌশলটা: একই প্রশ্ন দুই জায়গা
                থেকে করা। ধরুন Server এর ভেতর থেকে <code>curl</code> করলে Caddy ঠিক উত্তর
                দেয়, কিন্তু Laptop থেকে করলে দেয় না। তাহলে Caddy আর App নির্দোষ, দোষ
                দেয়ালের কাছাকাছি কোথাও: ufw, Provider এর Firewall, বা DNS। এক জোড়া
                পরীক্ষায় অর্ধেক মানচিত্র বাদ।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনের বাকি অংশ এই মানচিত্র ধরেই এগোবে। প্রথমে Server নিজেকে কীভাবে
                দেখে, তার ঠিকানা আর রাস্তা। তারপর পথ, তারপর DNS, তারপর লেসনের সবচেয়ে
                বড় অংশ, Port: কে শুনছে, কে কার সাথে কথা বলছে, আর বাইরে থেকে দরজায়
                টোকা দিলে কী উত্তর আসে। তারপর curl দিয়ে HTTP, openssl দিয়ে TLS, আর
                সবশেষে tcpdump, যখন অন্য সব যন্ত্র মিথ্যা বলছে মনে হয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "ip",
      subHeader: { index: "003", title: "Address and Route" },
      title: <SectionTitle>Server নিজেকে কীভাবে দেখে: ip a আর ip route</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কোনো Server এ ঢুকে প্রথম যে প্রশ্ন করবেন: আমার ঠিকানা কী, আর বাইরে
                যাওয়ার দরজা কোনটা। Module 03 এ এই দুইটা জিনিস আপনি শিখেছেন: IP Address
                আর Default Gateway। Linux এ দুইটাই দেখায় একটা যন্ত্র, <code>ip</code>।
                পুরনো লেখায় <code>ifconfig</code> আর <code>route</code> দেখবেন, সেগুলো
                net-tools নামের পুরনো Package এর, নতুন Ubuntu তে প্রায়ই থাকেই না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ip-a.txt",
          code: `deploy@island-vps-01:~$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0@if132: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether ba:d4:29:80:10:33 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 103.94.135.2/24 brd 103.94.135.255 scope global eth0
       valid_lft forever preferred_lft forever

deploy@island-vps-01:~$ ip -br a          # একই তথ্য, এক লাইনে একটা Interface
lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0@if132       UP             103.94.135.2/24`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে দুইটা Interface, মানে Network এর সাথে যুক্ত হওয়ার দুইটা দরজা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>lo</strong>, Loopback। এটা কোনো তারের সাথে যুক্ত নয়, যন্ত্রের
                  নিজের ভেতরের দরজা। <code>127.0.0.1</code> এ পাঠানো সব কিছু এই দরজা দিয়ে
                  বেরিয়ে আবার এই যন্ত্রেই ঢোকে। Module 03 এর ip-address লেসনে এর নাম
                  শুনেছেন। Caddy যখন App কে <code>127.0.0.1:3000</code> এ ডাকে, পুরো কথা
                  এই দরজার ভেতরেই হয়, বাইরের কোনো তারে যায় না।
                </ListItem>
                <ListItem>
                  <strong>eth0</strong>, আসল Network Card। <code>state UP</code> মানে তার
                  যুক্ত আর চালু। <code>inet 103.94.135.2/24</code> মানে এই দরজার IPv4
                  ঠিকানা 103.94.135.2, আর <code>/24</code> হলো Subnet Mask, Module 03 এর
                  ভাষায় প্রথম তিনটা Octet Network এর। <code>link/ether</code> এর পাশের
                  সংখ্যাটা এই Card এর MAC Address।
                </ListItem>
                <ListItem>
                  <strong>mtu 1500</strong>, এক Frame এ সর্বোচ্চ কত Byte যাবে। Module 05
                  এর packet-segment-frame লেসনে এটা দেখেছেন। VPN বা কিছু Cloud Network এ
                  এই সংখ্যা ছোট হয়, আর তখন বড় Response আটকে যাওয়ার মতো অদ্ভুত সমস্যা হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আসল VPS এ কী দেখবেন, সেটা Provider এর উপর নির্ভর করে। Hostinger,
                DigitalOcean বা Hetzner এর মতো বেশিরভাগ VPS এ Public IP টা সরাসরি এই
                Card এ বসানো থাকে, ঠিক উপরের মতো, সাথে একটা IPv6 ঠিকানাও প্রায়ই। কিছু
                Cloud এ, যেমন AWS এ, Card এ থাকে একটা Private IP, যেমন{" "}
                <code>172.31.x.x</code>, আর Public IP টা Provider এর Network এ NAT দিয়ে
                জোড়া। তখন <code>ip a</code> এ নিজের Public IP খুঁজে পাবেন না, আর সেটা
                স্বাভাবিক। Interface এর নামও আলাদা হতে পারে: <code>ens3</code>,{" "}
                <code>enp1s0</code>, <code>eth0</code>, সবই একই জিনিস।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ip-route.txt",
          code: `deploy@island-vps-01:~$ ip route
default via 103.94.135.1 dev eth0
103.94.135.0/24 dev eth0 proto kernel scope link src 103.94.135.2

# একটা নির্দিষ্ট ঠিকানায় যেতে Kernel কোন পথ বেছে নেবে, সরাসরি জিজ্ঞেস করুন
deploy@island-vps-01:~$ ip route get 1.1.1.1
1.1.1.1 via 103.94.135.1 dev eth0 src 103.94.135.2 uid 1001
    cache
deploy@island-vps-01:~$ ip route get 103.94.135.77
103.94.135.77 dev eth0 src 103.94.135.2 uid 1001
    cache
deploy@island-vps-01:~$ ip route get 127.0.0.1
local 127.0.0.1 dev lo src 127.0.0.1 uid 1001
    cache <local>`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Routing Table মাত্র দুই লাইনের, আর দুইটাই Module 03 এর পুরনো বন্ধু।
                দ্বিতীয় লাইনের মানে, <code>103.94.135.0/24</code> এর যেকোনো ঠিকানা নিজের
                পাড়ায়, তাই সেখানে Packet যায় eth0 দিয়ে সরাসরি। প্রথম লাইনের মানে, বাকি সব
                কিছু, অর্থাৎ পুরো Internet এর Packet, যায় <code>103.94.135.1</code> এর হাতে।
                এটাই Default Gateway, বাইরে যাওয়ার একমাত্র দরজা।
              </ContentParagraph>
              <ContentParagraph>
                <code>ip route get</code> এই টেবিলটা আপনার হয়ে পড়ে দেয়। 1.1.1.1 পাড়ার
                বাইরে, তাই <code>via 103.94.135.1</code>। 103.94.135.77 পাড়ার ভেতরে, তাই
                কোনো via নেই, সরাসরি। আর 127.0.0.1 এর জবাবে <code>local</code>, মানে
                তারে যাবেই না। যখন কোনো ঠিকানায় যাওয়া যাচ্ছে না, এই এক লাইন বলে দেয়
                অন্তত Kernel নিজে জানে কোন দিকে পাঠাতে হবে। <code>default</code> লাইনটা
                না থাকলে বাইরের সব ঠিকানায় যাওয়ার চেষ্টাতেই আসবে{" "}
                <code>Network is unreachable</code>, তারে একটা Packet ও যাবে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ip এর ছোট রূপ মনে রাখার দরকার নেই",
          content: (
            <p>
              <code>ip a</code> আসলে <code>ip address show</code>, <code>ip r</code> হলো{" "}
              <code>ip route</code>, <code>ip -br a</code> এর br মানে brief। IPv6 এর জন্য
              সামনে <code>-6</code> দিন: <code>ip -6 route</code>। আর একটা প্রশ্নের উত্তর
              মনে রাখুন: এই Server এর Public IP কী, Card এ না থাকলে? তখন বাইরের কাউকে
              জিজ্ঞেস করতে হয়, যেমন <code>curl -4 https://ifconfig.me</code>, কারণ
              Server নিজে NAT এর ওপাশের ঠিকানা জানে না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "reach",
      subHeader: { index: "004", title: "Reachability" },
      title: <SectionTitle>পথ আছে তো: ping, traceroute আর mtr</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>ping</code> সবচেয়ে পুরনো আর সবচেয়ে ভুল বোঝা যন্ত্র। এটা ICMP নামের
                একটা আলাদা Protocol এ ছোট একটা Echo Request পাঠায়, আর ওপাশ জীবিত থাকলে
                Echo Reply ফেরত দেয়। TCP নয়, Port নয়, শুধু এই প্রশ্ন: এই ঠিকানায় কেউ
                আছে কি, আর আসা যাওয়ায় কত সময় লাগে। আমাদের Laptop থেকে Server এ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ping.txt",
          code: `you@laptop:~$ ping -c 4 103.94.135.2
PING 103.94.135.2 (103.94.135.2) 56(84) bytes of data.
64 bytes from 103.94.135.2: icmp_seq=1 ttl=64 time=0.867 ms
64 bytes from 103.94.135.2: icmp_seq=2 ttl=64 time=0.182 ms
64 bytes from 103.94.135.2: icmp_seq=3 ttl=64 time=0.049 ms
64 bytes from 103.94.135.2: icmp_seq=4 ttl=64 time=0.046 ms

--- 103.94.135.2 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3106ms
rtt min/avg/max/mdev = 0.046/0.286/0.867/0.339 ms

# একই পাড়ার এমন একটা ঠিকানা, যেখানে কোনো যন্ত্রই নেই
you@laptop:~$ ping -c 3 103.94.135.9
PING 103.94.135.9 (103.94.135.9) 56(84) bytes of data.
From 103.94.135.77 icmp_seq=1 Destination Host Unreachable
From 103.94.135.77 icmp_seq=2 Destination Host Unreachable
From 103.94.135.77 icmp_seq=3 Destination Host Unreachable`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম Output এর প্রতিটা ঘর পড়তে শিখুন। <code>icmp_seq</code> হলো ক্রম
                নম্বর; মাঝখান থেকে কোনো নম্বর হারালে সেই Packet হারিয়েছে।{" "}
                <code>ttl=64</code> হলো Time To Live, প্রতিটা Router এটা এক কমায়;
                এখানে 64 মানে মাঝে কোনো Router নেই, আমরা একই পাড়ায়। <code>time</code>{" "}
                হলো Round Trip, যাওয়া আর আসা মিলিয়ে। প্রথমটা একটু বেশি, কারণ সেই সময়ে
                ARP দিয়ে MAC খোঁজা হয়েছে (Module 03)। শেষ লাইনের{" "}
                <code>0% packet loss</code> সবচেয়ে কাজের সংখ্যা।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় Output এ উত্তর এসেছে আমাদের নিজের Laptop থেকেই,{" "}
                <code>From 103.94.135.77</code>। Laptop ARP দিয়ে তিনবার জিজ্ঞেস করেছে
                103.94.135.9 কার, কেউ সাড়া দেয়নি, তাই সে নিজেই বলছে Destination Host
                Unreachable। একই পাড়ার কোনো ঠিকানায় এই বার্তা মানে ওখানে এখন কোনো
                যন্ত্র চালু নেই। একটু পরে দেখবেন TCP এর ভাষায় এর নাম No route to host।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ping এর উত্তর না আসা মানে Server মৃত, এমন নয়",
          content: (
            <p>
              অনেক Firewall আর অনেক Cloud Provider ইচ্ছা করে ICMP ফেলে দেয়। Azure এর
              মতো কিছু Cloud এ ping Default এ কাজই করে না। তাই ping এর উত্তর না এলে শুধু
              এটুকু জানলেন যে ICMP ফেরেনি। Website বেঁচে আছে কি না জানতে Port এ টোকা
              দিন, <code>nc -vz</code> দিয়ে, যেটা একটু পরে শিখবেন। উল্টোটাও সত্যি: ping
              এর উত্তর এলেই Website ঠিক আছে তা নয়। যন্ত্র বেঁচে আছে, App মরে থাকতে পারে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>traceroute</code> একটা ধাপ এগিয়ে যায়: শুধু পৌঁছানো নয়, কোন কোন
                Router হয়ে পৌঁছানো। Module 02 এ আপনি দেখেছেন একটা Packet Hop থেকে Hop এ
                যায়। traceroute ইচ্ছা করে প্রথম Packet এর TTL রাখে 1, দ্বিতীয়টার 2,
                এভাবে বাড়ায়। TTL শূন্য হলে যে Router Packet টা ফেলে দেয়, সে একটা ছোট
                ICMP বার্তায় জানায় আমি এখানে ফেলেছি। সেই বার্তাগুলো সাজালেই পথের মানচিত্র।
              </ContentParagraph>
              <ContentParagraph>
                এখন একটা সত্যিকারের ফাঁদ দেখুন, যেটা practice server এ ঠিক এভাবেই ঘটেছে।
                Server এ ufw চালু, Default এ বাইরের সব আসা বন্ধ, শুধু 22, 80 আর 443 খোলা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "traceroute.txt",
          code: `you@laptop:~$ traceroute -n 103.94.135.2
traceroute to 103.94.135.2 (103.94.135.2), 30 hops max, 60 byte packets
 1  * * *
 2  * * *
 3  * * *
 ...                       (30 পর্যন্ত একই, ছোট করা)
30  * * *

# একই গন্তব্য, কিন্তু UDP এর বদলে TCP SYN, খোলা Port 443 এ
you@laptop:~$ sudo traceroute -n -T -p 443 103.94.135.2
traceroute to 103.94.135.2 (103.94.135.2), 30 hops max, 60 byte packets
 1  103.94.135.2  0.117 ms  0.020 ms  0.037 ms`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম traceroute দেখে মনে হয় পথ পুরো ভাঙা, তিরিশ ধাপ জুড়ে শুধু তারা।
                অথচ Server এক Hop দূরে আর পুরোপুরি সুস্থ। কারণ Linux এর traceroute
                Default এ UDP Packet পাঠায় 33434 এর মতো উঁচু Port এ, আর ufw সেগুলো
                চুপচাপ ফেলে দিচ্ছে। দ্বিতীয়টায় <code>-T -p 443</code> দিয়ে traceroute কে বলা
                হলো Probe হিসেবে TCP SYN পাঠাতে, Port 443 এ, যেটা Firewall খোলা রেখেছে। এক লাইনে উত্তর।
              </ContentParagraph>
              <ContentParagraph>
                শিক্ষাটা লিখে রাখার মতো: traceroute এর তারা মানে সেই Hop থেকে উত্তর
                আসেনি, পথ ভাঙা নয়। Internet এর অনেক Router নিজের পরিচয় দেয় না। মাঝের
                কয়েকটা Hop এ তারা আর তারপর আবার সংখ্যা দেখলে সব ঠিক আছে। শেষের দিকে
                তারা শুরু হয়ে আর না থামলে, শেষ সংখ্যাওয়ালা Hop এর পরেই কোথাও আটকাচ্ছে।
                আর সন্দেহ হলে সবসময় যে Port টা আসলে দরকার, সেই Port দিয়ে TCP traceroute
                চালান।
              </ContentParagraph>
              <ContentParagraph>
                <code>mtr</code> হলো traceroute আর ping এর মিশ্রণ। এটা পথের প্রতিটা Hop
                এ বারবার Packet পাঠিয়ে একটা জীবন্ত টেবিল দেখায়: প্রতিটা Hop এর Loss% আর
                গড় সময়। কোনো বিশেষ সময়ে সাইট ধীর বা মাঝে মাঝে আটকায়, এমন অভিযোগে mtr
                সবচেয়ে কাজের, কারণ একবারের traceroute ক্ষণস্থায়ী সমস্যা ধরতে পারে না।
                Ubuntu তে <code>sudo apt install mtr-tiny</code>, তারপর{" "}
                <code>mtr -rwc 50 example.com</code> চালালে পঞ্চাশবার মেপে একটা Report
                দেয়। একটা সাবধানতা: মাঝের কোনো Hop এ Loss% দেখালেও শেষ Hop এ Loss 0
                হলে আসলে কোনো ক্ষতি নেই। সেই Router শুধু নিজের কাছে পাঠানো ICMP এর উত্তর
                দিতে কিপটে, পার হয়ে যাওয়া Packet সে ঠিকই পাঠাচ্ছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "practice server এর একটা সীমা, খোলাখুলি",
          content: (
            <p>
              এই লেসনের practice network একটা Docker Network, যার বাইরে যাওয়ার পথ Docker
              এর নিজের যন্ত্র দিয়ে। সেই পথ TTL শেষ হওয়ার ICMP বার্তা ফেরত দেয় না, তাই
              সেখান থেকে example.com এ traceroute করলে প্রথম Hop এর পর সব তারা আসে, আর
              ping এর সময়ও বাস্তবের চেয়ে অনেক কম দেখায়। এজন্য এখানে Internet এর পথের
              কোনো traceroute বা mtr Output দেখানো হয়নি। আসল VPS এ বা বাসার ল্যাপটপে
              চালালে আপনি দশ পনেরোটা Hop এর পুরো তালিকা দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "dns",
      subHeader: { index: "005", title: "DNS on the Server" },
      title: <SectionTitle>Server এর চোখে DNS: resolv.conf, resolved আর /etc/hosts</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 04 এ আপনি দেখেছেন একটা নাম কীভাবে IP তে বদলায়। এবার প্রশ্নটা
                Server এর দিক থেকে: আপনার App যখন Payment Gateway বা কোনো API কে নাম
                দিয়ে ডাকে, তখন এই Server কোন Resolver কে জিজ্ঞেস করে? উত্তর লেখা থাকে
                একটা ফাইলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "resolver.txt",
          code: `deploy@island-vps-01:~$ grep -v '^#' /etc/resolv.conf
nameserver 127.0.0.53
options edns0 trust-ad
search .

deploy@island-vps-01:~$ resolvectl status          # ছোট করা
Global
         Protocols: -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
Current DNS Server: 1.1.1.1
       DNS Servers: 1.1.1.1 9.9.9.9

deploy@island-vps-01:~$ dig example.com +noall +answer +stats
example.com.		49	IN	A	172.66.147.243
example.com.		49	IN	A	104.20.23.154
;; Query time: 4 msec
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>/etc/resolv.conf</code> বলছে Resolver হলো <code>127.0.0.53</code>,
                নিজের যন্ত্রের ভেতরের একটা ঠিকানা। এটা systemd-resolved নামের একটা ছোট
                Service, Ubuntu তে Default এ চলে। Module 04 এর recursive-resolver লেসনের
                ভাষায় এটা একটা Stub Resolver: নিজে খোঁজে না, প্রশ্নটা আসল Resolver এর
                কাছে পাঠায়, আর উত্তর কিছুক্ষণ মনে রাখে। আসল Resolver কারা, সেটা বলে{" "}
                <code>resolvectl status</code>: এখানে 1.1.1.1 আর 9.9.9.9। বেশিরভাগ VPS এ
                এই জায়গায় Provider এর নিজের Resolver থাকে, DHCP বা Cloud এর Setting
                থেকে আসা।
              </ContentParagraph>
              <ContentParagraph>
                <code>dig</code> এর শেষ লাইনটা দেখুন: <code>SERVER: 127.0.0.53</code>।
                তার মানে dig ও এই Stub কেই জিজ্ঞেস করেছে। আর 49 সংখ্যাটা TTL, Module 04
                এর dns-cache-ttl লেসনের সেই ঘড়ি, এই উত্তর আর কত সেকেন্ড বিশ্বাসযোগ্য।
              </ContentParagraph>
              <ContentParagraph>
                এবার একটা সূক্ষ্ম কিন্তু খুব কাজের পার্থক্য। আপনার App কিন্তু dig এর মতো
                সরাসরি DNS কে জিজ্ঞেস করে না। Node, curl, Python সবাই Operating System এর
                একটা সাধারণ পথ দিয়ে নাম খোঁজে, আর সেই পথ আগে দেখে{" "}
                <code>/etc/hosts</code> ফাইল, তারপর DNS। কোন ক্রমে দেখবে, সেটা লেখা থাকে{" "}
                <code>/etc/nsswitch.conf</code> এ। এই পথটা হাতে চালানোর কমান্ড হলো{" "}
                <code>getent hosts</code>। নিচে দেখুন একটা নামকে কে কী বলে, যখন{" "}
                <code>/etc/hosts</code> এ একটা লাইন যোগ করা আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "hosts-vs-dns.txt",
          code: `deploy@island-vps-01:~$ grep hosts /etc/nsswitch.conf
hosts:          files dns          # আগে files, মানে /etc/hosts; তারপর dns

deploy@island-vps-01:~$ grep islandtours /etc/hosts
127.0.0.1 islandtours.example

# App যেভাবে খোঁজে
deploy@island-vps-01:~$ getent hosts islandtours.example
127.0.0.1       islandtours.example

# Internet এর আসল DNS কে সরাসরি জিজ্ঞেস করলে
deploy@island-vps-01:~$ dig @1.1.1.1 islandtours.example +noall +comments | grep status
;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 11396`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই নাম, দুই উত্তর। App এর কাছে নামটা 127.0.0.1, কারণ /etc/hosts আগে
                দেখা হয়। Internet এর কাছে নামটা নেই, NXDOMAIN, কারণ .example একটা সংরক্ষিত
                নাম। বাস্তবে এর উল্টো ঘটনা অনেক বেশি ভোগায়: মাসখানেক আগে কেউ পরীক্ষার
                জন্য /etc/hosts এ Payment Gateway এর পুরনো IP লিখে রেখেছিলেন, ভুলে
                গেছেন। Gateway IP বদলেছে, dig ঠিক নতুন IP দেখাচ্ছে, অথচ App বারবার
                timed out পাচ্ছে। dig দিয়ে কখনো এই ভুল ধরা পড়বে না, getent দিয়ে পড়বে।
              </ContentParagraph>
              <ContentParagraph>
                Ubuntu তে আরেকটা খুঁটিনাটি জানা দরকার। systemd-resolved নিজেও /etc/hosts
                পড়ে, তাই শুধু <code>dig islandtours.example</code> লিখলে, যেটা 127.0.0.53
                কে জিজ্ঞেস করে, practice server এ সেই hosts এর লাইনটাই ফেরত এসেছে।
                Internet আসলে কী বলে জানতে হলে নির্দিষ্ট Resolver এর নাম দিন:{" "}
                <code>dig @1.1.1.1</code>। নিয়মটা সহজ করে রাখুন: App কী দেখছে জানতে{" "}
                <code>getent hosts</code>, দুনিয়া কী দেখছে জানতে{" "}
                <code>dig @1.1.1.1</code>, আর দুইটা না মিললে সন্দেহ করুন /etc/hosts কে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Server এর ভেতরে DNS সমস্যার তিনটা চেনা চেহারা",
          content: (
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <code>Temporary failure in name resolution</code>: Resolver এর কাছেই
                পৌঁছানো যাচ্ছে না। <code>resolvectl status</code> আর{" "}
                <code>systemctl status systemd-resolved</code> দেখুন।
              </li>
              <li>
                শুধু একটা নাম ভুল IP দিচ্ছে: <code>/etc/hosts</code> আর{" "}
                <code>getent hosts</code> মিলিয়ে দেখুন।
              </li>
              <li>
                Record বদলেছেন কিন্তু Server পুরনোটাই দেখছে: Cache।{" "}
                <code>sudo resolvectl flush-caches</code>, আর Module 04 এর TTL এর
                অপেক্ষাটা মনে করুন।
              </li>
            </ul>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "ss-listen",
      subHeader: { index: "006", title: "Who Is Listening" },
      title: <SectionTitle>কে কোন দরজায় শুনছে: ss -tlnp</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনের সবচেয়ে কাজের কমান্ড। Module 05 এর port-and-socket লেসনে
                আপনি শিখেছেন একটা Server Program একটা Port এ বসে শোনে, LISTEN অবস্থায়।
                একটা Linux Server এ এই মুহূর্তে কারা কারা শুনছে, কোন ঠিকানায়, কোন Port
                এ, আর তারা কোন Program, এক কমান্ডে দেখায় <code>ss</code>, মানে Socket
                Statistics।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ss-tlnp.txt",
          code: `deploy@island-vps-01:~$ sudo ss -tlnp          # Docker এর নিজস্ব একটা লাইন বাদ
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      4096   127.0.0.53%lo:53         0.0.0.0:*    users:(("systemd-resolve",pid=602,fd=15))
LISTEN 0      4096      127.0.0.54:53         0.0.0.0:*    users:(("systemd-resolve",pid=602,fd=17))
LISTEN 0      4096       127.0.0.1:2019       0.0.0.0:*    users:(("caddy",pid=1391,fd=3))
LISTEN 0      511          0.0.0.0:8080       0.0.0.0:*    users:(("node",pid=909,fd=24))
LISTEN 0      511        127.0.0.1:6379       0.0.0.0:*    users:(("redis-server",pid=883,fd=6))
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=930,fd=3),("systemd",pid=1,fd=92))
LISTEN 0      511        127.0.0.1:3000       0.0.0.0:*    users:(("node",pid=1220,fd=24))
LISTEN 0      511            [::1]:6379          [::]:*    users:(("redis-server",pid=883,fd=7))
LISTEN 0      4096               *:443              *:*    users:(("caddy",pid=1391,fd=7))
LISTEN 0      4096               *:80               *:*    users:(("caddy",pid=1391,fd=9))
LISTEN 0      4096            [::]:22            [::]:*    users:(("sshd",pid=930,fd=4),("systemd",pid=1,fd=93))`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                চারটা অক্ষর, চারটা প্রশ্ন। <code>-t</code> মানে শুধু TCP।{" "}
                <code>-l</code> মানে শুধু যারা শুনছে, LISTEN। <code>-n</code> মানে Port
                আর ঠিকানা সংখ্যাতেই দেখানো, নাম খোঁজার ঝামেলায় না যাওয়া। <code>-p</code> মানে প্রতিটা
                Socket কোন Process এর। <code>sudo</code> লাগে কারণ অন্য User এর Process
                এর নাম Kernel সবাইকে বলে না। একটা লাইন ধরে ঘরগুলো পড়ি।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetdebugSsLineDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে গুরুত্বপূর্ণ ঘর Local Address। এর IP অংশটা বলে Program টা কোন
                দরজায় বসে আছে, আর এর মানে চার রকম:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>127.0.0.1</code> বা <code>[::1]</code>: শুধু ভেতরের দরজায়। এই
                  যন্ত্রের Program ছাড়া কেউ পৌঁছাতে পারবে না। App, Redis আর Caddy এর
                  Admin Port 2019 এখানে, ঠিক যেমন থাকা উচিত।
                </ListItem>
                <ListItem>
                  <code>0.0.0.0</code>: সব IPv4 দরজায়। বাইরে থেকে কেউ এলে, Firewall
                  ছেড়ে দিলে, পৌঁছে যাবে। 22 এখানে, কারণ SSH বাইরে থেকেই দরকার। আর
                  8080 এ একটা node, যেটা নিয়ে একটু পরে কথা আছে।
                </ListItem>
                <ListItem>
                  <code>[::]</code>: সব IPv6 দরজায়। 22 এর দ্বিতীয় লাইনটা তাই।
                </ListItem>
                <ListItem>
                  <code>*</code>: সব দরজায়, IPv4 আর IPv6 দুইটাতেই, এক Socket এ। Caddy এর
                  80 আর 443 এভাবে বসে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর <code>127.0.0.53%lo</code> এর <code>%lo</code> মানে এই ঠিকানা শুধু lo
                Interface এ বাঁধা। এগুলো আগের অংশের systemd-resolved।
              </ContentParagraph>
              <ContentParagraph>
                এবার Process ঘরে দুইটা অবাক করা জিনিস। প্রথমত Port 22 এর পাশে দুইটা নাম,{" "}
                <code>sshd</code> আর <code>systemd</code>, pid 1। Ubuntu 24.04 এ SSH
                Socket Activation দিয়ে চলে: systemd নিজে দরজায় বসে থাকে, আর প্রথম কেউ
                এলে তখন sshd চালু করে একই Socket তার হাতে দেয়। তাই একই দরজা দুইজনের
                তালিকায়। কেউ ঢোকার আগে চালালে শুধু systemd দেখতেন। Lesson 03 এ এটা
                বিস্তারিত আছে। দ্বিতীয়ত
                Caddy এর একটা Port 2019, শুধু 127.0.0.1 এ। এটা Caddy এর Admin API, যেখান
                দিয়ে Config বদলানো যায়। ভেতরে থাকা ঠিক আছে, বাইরে খোলা থাকলে বিপদ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ss-filters.txt",
          code: `# sudo ছাড়া, deploy হিসেবে: অন্যদের Process এর নাম ফাঁকা
deploy@island-vps-01:~$ ss -tlnp | grep -E ':(22|3000|8080) '
LISTEN 0      511          0.0.0.0:8080       0.0.0.0:*    users:(("node",pid=909,fd=24))
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*
LISTEN 0      511        127.0.0.1:3000       0.0.0.0:*
LISTEN 0      4096            [::]:22            [::]:*

# একটা নির্দিষ্ট Port, grep ছাড়াই ss এর নিজের Filter দিয়ে
deploy@island-vps-01:~$ sudo ss -tlnp 'sport = :3000'
State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0      511        127.0.0.1:3000      0.0.0.0:*    users:(("node",pid=1220,fd=24))

# UDP তে কে 443 এ শুনছে: HTTP/3
deploy@island-vps-01:~$ sudo ss -ulnp 'sport = :443'
State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
UNCONN 0      0                  *:443             *:*    users:(("caddy",pid=1391,fd=8))`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম Output টা ভালো করে দেখুন। deploy হিসেবে sudo ছাড়া চালালে শুধু
                deploy এর নিজের Process টার নাম এসেছে, 8080 এর node। 22 আর 3000 এর লাইন
                আছে, কিন্তু Process ঘর ফাঁকা। কেউ যদি sudo ছাড়া চালিয়ে বলেন 3000 এ কে
                আছে বোঝা যাচ্ছে না, উত্তর হলো sudo দিন। UDP তে LISTEN বলে কোনো অবস্থা
                নেই, তাই শোনা Socket দেখায় <code>UNCONN</code>। Module 06 এর HTTP/3 এর
                জন্য Caddy UDP 443 এ বসে আছে, এই লাইনটা সেটার প্রমাণ।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর আসল VPS এ একটা তফাত চোখে পড়বে। সেখানে API চলে Docker এর
                ভেতরে, আর Docker সেটাকে <code>127.0.0.1:3000</code> এ Publish করে। তখন
                Process ঘরে node এর বদলে লেখা থাকে <code>docker-proxy</code>, কারণ Server
                এর দিক থেকে ওই Port টা Docker এর একটা ছোট Program ধরে রাখে আর ভেতরের
                Container এ পাঠায়। আসল node টা Container এর ভেতরে, তার নিজের Network এ।
                Docker এর Module এ এটা খুলে দেখবেন। আপাতত মনে রাখুন: docker-proxy দেখলে
                প্রশ্ন হলো কোন Container, আর তার উত্তর দেয় <code>docker ps</code>।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetdebugSsLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "ss-states",
      subHeader: { index: "007", title: "Connection States" },
      title: <SectionTitle>কে কার সাথে কথা বলছে: ss -tanp আর State গুলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>-l</code> এর বদলে <code>-a</code> দিলে ss শুধু শোনা দরজা নয়, এই
                মুহূর্তের সব কথোপকথন দেখায়। Module 05 এর connection-close লেসনের State
                গুলো এখানে নিজের চোখে দেখবেন। Laptop থেকে তিনটা Connection খোলা রেখে আর
                Server থেকে কয়েকবার App কে ডেকে নেওয়া ছবি:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ss-tanp.txt",
          code: `deploy@island-vps-01:~$ sudo ss -tanp state established
Recv-Q Send-Q         Local Address:Port            Peer Address:Port Process
0      0                  127.0.0.1:41408              127.0.0.1:3000  users:(("caddy",pid=1391,fd=14))
0      0                  127.0.0.1:3000               127.0.0.1:41408 users:(("node",pid=1220,fd=25))
0      0      [::ffff:103.94.135.2]:443   [::ffff:103.94.135.77]:37898 users:(("caddy",pid=1391,fd=10))
0      0      [::ffff:103.94.135.2]:443   [::ffff:103.94.135.77]:37908 users:(("caddy",pid=1391,fd=12))
0      0      [::ffff:103.94.135.2]:443   [::ffff:103.94.135.77]:37896 users:(("caddy",pid=1391,fd=11))

deploy@island-vps-01:~$ sudo ss -tn state time-wait | head -4
Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
0      0          127.0.0.1:41380    127.0.0.1:3000
0      0          127.0.0.1:41382    127.0.0.1:3000
0      0          127.0.0.1:41386    127.0.0.1:3000

# কোন State এ কয়টা, এক লাইনে গোনা
deploy@island-vps-01:~$ ss -tan | awk 'NR>1 {print $1}' | sort | uniq -c | sort -rn
     15 LISTEN
      5 TIME-WAIT
      5 ESTAB

deploy@island-vps-01:~$ ss -s | head -2
Total: 77
TCP:   131 (estab 5, closed 111, orphaned 0, timewait 5)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম তালিকায় পুরো পথটা দেখা যাচ্ছে। নিচের তিনটা লাইন বাইরের Laptop
                থেকে Caddy এর 443 এ তিনটা Connection। উপরের দুইটা লাইন একই Connection এর
                দুই মাথা: Caddy একটা Ephemeral Port 41408 থেকে App এর 3000 এ যুক্ত, আর
                App এর দিক থেকে উল্টোটা। Module 05 এ যে Keep-Alive Connection এর কথা
                শুনেছেন, Caddy আর App এর মাঝে খোলা রাখা, সেটা এই লাইন দুইটা।
              </ContentParagraph>
              <ContentParagraph>
                <code>[::ffff:103.94.135.2]</code> দেখে ঘাবড়াবেন না। Caddy একটাই Socket এ
                IPv4 আর IPv6 দুইটা শোনে, তাই IPv4 এর Connection ও তার কাছে IPv6 এর মোড়কে
                আসে। <code>::ffff:</code> এর পরের অংশটাই আসল IPv4 ঠিকানা।
              </ContentParagraph>
              <ContentParagraph>
                <code>state</code> এর পরে নাম দিয়ে Filter করা যায়:{" "}
                <code>established</code>, <code>time-wait</code>,{" "}
                <code>close-wait</code>, <code>listening</code>। আর Port দিয়েও:{" "}
                <code>{"'( dport = :5432 )'"}</code> মানে যে Connection গুলোর ওপাশের Port
                5432, অর্থাৎ PostgreSQL এর দিকে যাচ্ছে। Database এর Connection Pool এ
                এখন কয়টা খোলা, এক কমান্ডে উত্তর:{" "}
                <code>{"sudo ss -tnp state established '( dport = :5432 )' | wc -l"}</code>।
              </ContentParagraph>
              <ContentParagraph>
                গোনার কমান্ডটা মুখস্থ রাখার মতো, কারণ Production এ সংখ্যাই কথা বলে।
                কয়েকটা চেনা ছবি আর তাদের মানে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>অনেক TIME-WAIT, শান্তভাবে ওঠানামা করছে:</strong> স্বাভাবিক।
                  যে আগে Connection বন্ধ করে, অপেক্ষাটা তার ঘাড়ে পড়ে, আর কিছুক্ষণ পর
                  নিজেই মুছে যায়। এখানে Server নিজেই curl দিয়ে App কে ডেকেছে আর curl আগে
                  বন্ধ করেছে, তাই TIME-WAIT গুলো Server এর খাতায়।
                </ListItem>
                <ListItem>
                  <strong>CLOSE-WAIT বাড়ছেই, কমছে না:</strong> নিজের Code এর দোষ। ওপাশ
                  বিদায় বলেছে, আপনার Program Socket বন্ধ করছে না। Module 05 এর
                  connection-close লেসনের সেই Leak। <code>-p</code> দিয়ে দেখুন কোন Process।
                </ListItem>
                <ListItem>
                  <strong>SYN-RECV অনেক:</strong> Handshake এর অর্ধেকে আটকে থাকা
                  Connection। হয় App এত ব্যস্ত যে নিতে পারছে না, নয়তো কেউ ইচ্ছা করে
                  অর্ধেক Handshake পাঠিয়ে Server কে ব্যস্ত রাখছে।
                </ListItem>
                <ListItem>
                  <strong>ESTAB হঠাৎ অনেক বেশি:</strong> ভিড় বেড়েছে, বা কোনো Client
                  Connection খুলে আর বন্ধ করছে না। <code>-p</code> আর Peer Address দেখে
                  কে বা কারা, সেটা বের করুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "netstat-lsof",
      subHeader: { index: "008", title: "netstat, lsof, fuser" },
      title: <SectionTitle>পুরনো netstat, আর Port কে ধরে আছে খোঁজা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Internet এর পুরনো লেখা, Stack Overflow এর উত্তর আর অনেক মানুষের
                অভ্যাসে আপনি <code>netstat</code> দেখবেন। এটা ss এর পূর্বসূরি, একই প্রশ্নের
                উত্তর দেয়, Flag গুলোও প্রায় এক। নতুন Ubuntu তে এটা প্রায়ই আগে থেকে থাকে
                না, <code>sudo apt install net-tools</code> লাগে। ss নতুন, দ্রুত, আর হাজার
                হাজার Connection এর Server এও সাথে সাথে উত্তর দেয়। তবুও netstat পড়তে
                জানা দরকার, কারণ পুরনো Server আর পুরনো Runbook এ এটাই থাকবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "netstat-lsof.txt",
          code: `deploy@island-vps-01:~$ sudo netstat -tlnp | grep -v 127.0.0.5          # ছোট করা
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.1:2019          0.0.0.0:*               LISTEN      1391/caddy
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN      909/node
tcp        0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN      883/redis-server 12
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1/init
tcp        0      0 127.0.0.1:3000          0.0.0.0:*               LISTEN      1220/node
tcp6       0      0 ::1:6379                :::*                    LISTEN      883/redis-server 12
tcp6       0      0 :::443                  :::*                    LISTEN      1391/caddy
tcp6       0      0 :::80                   :::*                    LISTEN      1391/caddy
tcp6       0      0 :::22                   :::*                    LISTEN      1/init

# একটা Port কে কে ধরে আছে, User এর নাম সহ
deploy@island-vps-01:~$ sudo lsof -nP -i :3000
COMMAND  PID    USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
node    1220 mytours   24u  IPv4 2362096      0t0  TCP 127.0.0.1:3000 (LISTEN)

deploy@island-vps-01:~$ sudo fuser -v 3000/tcp
                     USER        PID ACCESS COMMAND
3000/tcp:            mytours    1220 F.... node`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                netstat এর Flag আর ss এর Flag প্রায় হুবহু এক:{" "}
                <code>netstat -tlnp</code> আর <code>ss -tlnp</code> একই প্রশ্ন।
                পার্থক্যগুলো ছোট: netstat IPv6 আলাদা লাইনে tcp6 লিখে দেখায়, pid 1 কে
                ডাকে init, আর Process এর নাম কেটে ছোট করে। Redis এর লাইনের শেষে{" "}
                <code>12</code> সংখ্যাটা আসলে কাটা পড়া নামের অংশ, ভয় পাওয়ার কিছু নেই।
              </ContentParagraph>
              <ContentParagraph>
                <code>lsof</code> নামটা এসেছে list open files থেকে। Module 01 এ শুনেছেন
                Linux এ সবকিছুই File, আর একটা Socket ও একটা খোলা File। তাই lsof Port
                দিয়েও খুঁজতে পারে, আর একটা বাড়তি জিনিস দেয় যা ss দেয় না: User এর নাম,
                এখানে <code>mytours</code>। <code>-n</code> আর <code>-P</code> এর কাজ নাম আর
                Port এর নাম খোঁজা বন্ধ রাখা, যাতে উত্তর তাড়াতাড়ি আসে। <code>fuser</code> আরও
                ছোট, শুধু বলে কোন pid। এর <code>-k</code> Flag সেই Process কে মেরেও ফেলতে
                পারে, যেটা প্রায় কখনোই প্রথম পদক্ষেপ হওয়া উচিত নয়।
              </ContentParagraph>
              <ContentParagraph>
                এই যন্ত্রগুলোর সবচেয়ে চেনা কাজ একটা Error এর উত্তর খোঁজা। আপনি my-tours
                এর App হাতে চালাতে গেলেন, আর পেলেন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "eaddrinuse.txt",
          code: `deploy@island-vps-01:~$ PORT=3000 HOST=127.0.0.1 node /srv/my-tours/server.mjs
Error: listen EADDRINUSE: address already in use 127.0.0.1:3000

deploy@island-vps-01:~$ sudo ss -tlnp 'sport = :3000'
State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0      511        127.0.0.1:3000      0.0.0.0:*    users:(("node",pid=1220,fd=24))

deploy@island-vps-01:~$ systemctl status my-tours-api --no-pager | head -3
● my-tours-api.service - my-tours API
     Loaded: loaded (/etc/systemd/system/my-tours-api.service; enabled; preset: enabled)
     Active: active (running) since ...`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রহস্য তিন কমান্ডে শেষ। Port 3000 এ আগে থেকেই একটা node বসে আছে, আর সেটা
                Lesson 02 এ বানানো <code>my-tours-api.service</code>, systemd যেটা চালু
                রেখেছে। আপনি হাতে দ্বিতীয় একটা কপি চালাতে চাইছিলেন। এখানে সমাধান{" "}
                <code>kill 1220</code> নয়, কারণ systemd সাথে সাথে আবার চালু করবে, আর
                কেন চালু করল ভেবে আপনি আরও বিভ্রান্ত হবেন। সমাধান হলো Service কে Service
                এর পথে থামানো, <code>sudo systemctl stop my-tours-api</code>, অথবা হাতে
                চালানোর সময় অন্য Port নেওয়া। আর এই Error এর আরেকটা চেনা উৎস Module 05
                এর connection-close লেসনে আছে: সদ্য বন্ধ হওয়া Server এর TIME_WAIT।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "bind",
      subHeader: { index: "009", title: "Bind Address" },
      title: <SectionTitle>127.0.0.1 না 0.0.0.0: Firewall খোলা, তবুও refused</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 05 এর port-and-socket লেসনে একটা কথা ছিল: App 3000 এ চলছে কথাটা
                আধখানা, পুরো কথা হলো কোন IP র 3000 এ। ss এর Local Address ঘর ঠিক এই
                প্রশ্নের উত্তর। এবার হাতে কলমে দেখি এর ফল কী। একটা ছোট Program একসাথে
                দুইটা Server চালায়: একটা 127.0.0.1 এ, একটা 0.0.0.0 এ। Server এর ufw এ দুইটা
                Port ই খুলে দেওয়া হলো, তারপর Laptop থেকে টোকা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "bind-experiment.txt",
          code: `deploy@island-vps-01:~$ LAB_PORT_LOCAL=47891 LAB_PORT_PUBLIC=47892 node 3-bind.mjs &
local-only  listening on 127.0.0.1:47891
everyone    listening on 0.0.0.0:47892

deploy@island-vps-01:~$ sudo ss -tlnp '( sport = :47891 or sport = :47892 )'
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      511          0.0.0.0:47892      0.0.0.0:*    users:(("node",pid=1541,fd=25))
LISTEN 0      511        127.0.0.1:47891      0.0.0.0:*    users:(("node",pid=1541,fd=24))

deploy@island-vps-01:~$ sudo ufw allow 47891/tcp && sudo ufw allow 47892/tcp
Rule added
Rule added (v6)
Rule added
Rule added (v6)

you@laptop:~$ nc -vz -w 3 103.94.135.2 47891
nc: connect to 103.94.135.2 port 47891 (tcp) failed: Connection refused
you@laptop:~$ nc -vz -w 3 103.94.135.2 47892
Connection to 103.94.135.2 47892 port [tcp/*] succeeded!
you@laptop:~$ curl -s http://103.94.135.2:47892/
everyone answered GET / from 103.94.135.77`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetdebugBindSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Firewall দুইটা দরজাই খুলে দিয়েছে, তবুও 47891 এ refused। কারণ Firewall
                শুধু ঠিক করে কে ঢুকতে পারবে, ভেতরে কেউ আছে কি না সেটা ঠিক করে না। Laptop
                এর SYN পৌঁছেছে eth0 এর দরজায়, 103.94.135.2 এ। কিন্তু সেই দরজার 47891
                এ কেউ বসে নেই, যে বসে আছে সে শুধু lo এর দরজায়। তাই Kernel সাথে সাথে RST
                দিয়ে না বলেছে।
              </ContentParagraph>
              <ContentParagraph>
                এই একটা ভুল দুই দিকেই রাত জাগায়। এক দিকে, একজন নতুন Developer App কে
                127.0.0.1 এ চালিয়ে বাইরে থেকে খুঁজে পাচ্ছেন না, আর ঘণ্টাখানেক Firewall
                নিয়ে টানাটানি করছেন। অন্য দিকে, আরও বিপজ্জনক, কেউ Database বা Redis কে
                0.0.0.0 এ বসিয়ে দিয়েছেন সুবিধার জন্য, আর এখন একটাই রক্ষাকবচ, Firewall।
                একটা Rule ভুল হলেই Database Internet এ খোলা। প্রতি বছর হাজার হাজার Redis
                আর MongoDB ঠিক এভাবে চুরি হয়।
              </ContentParagraph>
              <ContentParagraph>
                practice server এর ss তালিকায় এমন একটা জিনিস আছে, খেয়াল করেছেন? Port
                8080 এ একটা node, 0.0.0.0 এ, deploy এর চালানো। কারো পরীক্ষার জন্য চালু
                করা, তারপর ভুলে যাওয়া। ufw চালু হওয়ার আগে সেটা Internet থেকে সরাসরি
                পৌঁছানো যেত, Laptop থেকে <code>nc</code> করে দেখা গেছে succeeded। এমন
                ভুলে যাওয়া Server সাধারণত পুরনো Code চালায়, Update পায় না, আর আক্রমণের
                সবচেয়ে সহজ দরজা হয়। সমাধান Firewall এ বন্ধ করা নয়, বন্ধ করা তো
                দ্বিতীয় স্তর। সমাধান Server টাই থামানো। নিয়মটা লিখে রাখুন: ss এর
                তালিকায় 0.0.0.0, <code>*</code> বা <code>[::]</code> এ যা আছে, তার প্রতিটার
                পাশে একটা কারণ লিখতে পারতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Docker এর Container এ এর উল্টো ফাঁদ",
          content: (
            <p>
              Container এর ভেতরে App যদি 127.0.0.1 এ বসে, তাহলে Container এর বাইরে থেকে,
              এমনকি একই Server থেকেও, তাকে পাওয়া যায় না, কারণ Container এর নিজের
              Loopback আলাদা। তখন curl বলে <code>Empty reply from server</code> বা{" "}
              <code>Connection reset by peer</code>। Container এর ভেতরে App কে 0.0.0.0 এ
              বসাতে হয়, আর Server এর দিকে Publish করতে হয় <code>127.0.0.1:3000:3000</code>{" "}
              দিয়ে, যাতে বাইরে খোলা না থাকে। আর Docker এর Publish করা Port যে ufw কে পাশ
              কাটিয়ে যায়, সেই বড় ফাঁদটা{" "}
              <Link href="/devops/topic/firewall-ufw" className={linkClass}>
                Lesson 06
              </Link>{" "}
              এ আছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 10 */
    {
      id: "nc",
      subHeader: { index: "010", title: "Knocking on the Port" },
      title: <SectionTitle>দরজায় টোকা: nc -vz, আর refused বনাম timed out</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>nc</code>, পুরো নাম netcat, Network এর সুইস ছুরি। এর অনেক কাজের
                মধ্যে আমাদের দরকার একটা: <code>-z</code> মানে শুধু Connection খোলার
                চেষ্টা, কোনো তথ্য পাঠানো নয়, আর <code>-v</code> মানে ফলাফলটা জানানো।{" "}
                <code>-w 3</code> মানে তিন সেকেন্ডের বেশি অপেক্ষা নয়। একটা Port এ TCP
                Handshake হয় কি না, এটা তার সবচেয়ে সোজা পরীক্ষা। ufw চালুর আগে Laptop থেকে
                Server এর ছয়টা Port:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "nc-before-ufw.txt",
          code: `you@laptop:~$ for p in 22 80 443 3000 6379 8080; do nc -vz -w 3 103.94.135.2 $p; done
Connection to 103.94.135.2 22 port [tcp/ssh] succeeded!
Connection to 103.94.135.2 80 port [tcp/http] succeeded!
Connection to 103.94.135.2 443 port [tcp/https] succeeded!
nc: connect to 103.94.135.2 port 3000 (tcp) failed: Connection refused
nc: connect to 103.94.135.2 port 6379 (tcp) failed: Connection refused
Connection to 103.94.135.2 8080 port [tcp/http-alt] succeeded!`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ss এর তালিকার সাথে হুবহু মেলে। 22, 80, 443 সব দরজায় বসা, তাই
                succeeded। 3000 আর 6379 শুধু ভেতরে, তাই refused। আর 8080, সেই ভুলে যাওয়া
                Server, বাইরে থেকে খোলা। এবার ufw চালু করা হলো, Default deny, শুধু
                OpenSSH, 80/tcp, 443/tcp আর 443/udp খোলা। একই কাজ আবার, এবার সময় মেপে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "nc-after-ufw.txt",
          code: `# প্রতিটা কমান্ডের উপরের মন্তব্যে কত সময় লেগেছে
# প্রায় 0 সেকেন্ড
you@laptop:~$ nc -vz -w 5 103.94.135.2 443
Connection to 103.94.135.2 443 port [tcp/https] succeeded!
# পুরো 5 সেকেন্ড
you@laptop:~$ nc -vz -w 5 103.94.135.2 3000
nc: connect to 103.94.135.2 port 3000 (tcp) timed out: Operation now in progress
# পুরো 5 সেকেন্ড
you@laptop:~$ nc -vz -w 5 103.94.135.2 8080
nc: connect to 103.94.135.2 port 8080 (tcp) timed out: Operation now in progress

# এবার 8080 এর জন্য deny নয়, reject Rule
deploy@island-vps-01:~$ sudo ufw reject 8080/tcp
Rule added
Rule added (v6)
you@laptop:~$ nc -vz -w 5 103.94.135.2 8080
nc: connect to 103.94.135.2 port 8080 (tcp) failed: Connection refused

# যে ঠিকানায় কোনো যন্ত্রই নেই
you@laptop:~$ nc -vz -w 5 103.94.135.9 443
nc: connect to 103.94.135.9 port 443 (tcp) failed: No route to host`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Port 3000 এর দুই Output পাশাপাশি রাখুন। ufw এর আগে refused, এক মুহূর্তে।
                ufw এর পরে timed out, পুরো পাঁচ সেকেন্ড পর। Port একই, App একই, বদলেছে
                শুধু মাঝখানে একটা Firewall। আর এই পার্থক্যটাই এই লেসনের সবচেয়ে দামি
                শিক্ষা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Connection refused</strong> মানে উত্তর এসেছে, আর উত্তরটা না।
                  ওপাশের Kernel একটা RST পাঠিয়েছে। তার মানে যন্ত্রটা আছে, পথ আছে, আর
                  মাঝে কেউ Packet ফেলছে না। সমস্যা Server এর ভেতরে: ওই Port এ কেউ শুনছে
                  না, বা ভুল দরজায় শুনছে। অথবা একটা REJECT Rule, যেটা ইচ্ছা করে RST পাঠায়।
                </ListItem>
                <ListItem>
                  <strong>Connection timed out</strong> মানে কোনো উত্তরই আসেনি। পথের কেউ
                  Packet টা চুপচাপ ফেলে দিয়েছে। প্রায় সবসময় একটা Firewall: Server এর ufw,
                  Provider এর Cloud Firewall, বা অফিসের Network এর Firewall। অথবা DNS ভুল
                  IP দিচ্ছে আর সেই IP এর যন্ত্র চুপ থাকে।
                </ListItem>
                <ListItem>
                  <strong>No route to host</strong> মানে SYN তারে নামতেই পারেনি, অথবা কোনো
                  Router ICMP দিয়ে জানিয়েছে ওই ঠিকানায় পৌঁছানো যাবে না। একই পাড়ায় হলে
                  ওই ঠিকানায় কেউ নেই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ufw এর deny আর reject এর পার্থক্যও এখানে দেখা গেল। deny চুপচাপ ফেলে দেয়,
                ফলে timed out। reject ফেরত একটা RST পাঠায়, ফলে refused। বাইরের দুনিয়ার
                জন্য deny ভালো, কারণ আক্রমণকারী বুঝতে পারে না ওখানে কিছু আছে কি না, আর
                তাকে প্রতিটা Port এ সময় নষ্ট করতে হয়। ভেতরের Network এ reject কখনো
                ভালো, কারণ ভুল Client টা সাথে সাথে জানে, ঝুলে থাকে না। তারে আসলে কী
                ঘটছে, ছবিতে:
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetdebugWireSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনার App এর Log এ এই একই তিনটা ঘটনা অন্য নামে আসে। Node এর একটা ছোট
                Program একই চার রকম ঠিকানায় Connection খোলার চেষ্টা করলে যা ছাপে,
                সময় সহ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "node-error-codes.txt",
          code: `# Server এ এখন: 47892 এ ufw reject Rule, 47891 এর কোনো allow নেই, মানে Default deny
you@laptop:~$ PROBE_TIMEOUT_MS=5000 node 6-probe.mjs 103.94.135.2:443 103.94.135.2:47892 \\
                    103.94.135.2:47891 103.94.135.9:443 no-such-host.invalid:443
103.94.135.2:443                 4 ms  connected
103.94.135.2:47892               1 ms  ECONNREFUSED
103.94.135.2:47891            5002 ms  ETIMEDOUT (no answer at all)
103.94.135.9:443              3113 ms  EHOSTUNREACH
no-such-host.invalid:443       468 ms  ENOTFOUND`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সময়ের ঘরটা আলাদা করে দেখুন, কারণ Log এ প্রায়ই শুধু সময়টা থাকে। দুই
              মিলিসেকেন্ডে ব্যর্থ মানে কেউ সক্রিয়ভাবে না বলেছে। ঠিক Timeout এর সমান সময়ে
              ব্যর্থ মানে কেউ উত্তরই দেয়নি। তিন সেকেন্ডের কাছাকাছি EHOSTUNREACH হলো ARP এর
              তিনবারের চেষ্টা। আর ENOTFOUND এ Server এর দিকে তারে কিছুই যায়নি, শুধু DNS এর
              একটা প্রশ্ন গেছে আর না উত্তর এসেছে; সময়টা সেই প্রশ্নের।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "macOS এর nc একটু অন্যভাবে লেখে",
          content: (
            <p>
              Laptop যদি Mac হয়, তার nc এর বার্তা একটু আলাদা, যেমন refused এর বদলে{" "}
              <code>nc: connectx to 103.94.135.2 port 3000 (tcp) failed: Connection refused</code>।
              শব্দগুলো একই, তাই মানেও একই। nc না থাকলে curl দিয়েও একই প্রশ্ন করা যায়:{" "}
              <code>curl -v telnet://103.94.135.2:443</code> Connection খুললে{" "}
              <code>Connected to</code> লেখে, তারপর Ctrl+C দিয়ে বেরিয়ে আসুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 11 */
    {
      id: "curl",
      subHeader: { index: "011", title: "curl, Inside and Out" },
      title: <SectionTitle>curl দিয়ে সমস্যাকে ভাগ করা: App, Caddy, তারপর বাইরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Port খোলা প্রমাণ হলো, এবার HTTP এর পালা। Module 06 এ curl কে আপনি
                Browser এর বদলি হিসেবে চিনেছেন। এখানে তার একটা নতুন ভূমিকা: সমস্যাকে
                টুকরো টুকরো করে ভাগ করা। একই পাতা তিনবার চাওয়া হয়, প্রতিবার পথের একটা
                বেশি অংশ পার হয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "curl-inside-out.txt",
          code: `# ধাপ ১, Server এর ভেতরে: শুধু App, Caddy কে বাদ দিয়ে
deploy@island-vps-01:~$ curl -sS http://127.0.0.1:3000/health
{"status":"ok"}

# ধাপ ২, Server এর ভেতরে: Caddy হয়ে, TLS সহ, কিন্তু DNS আর বাইরের Firewall বাদ
deploy@island-vps-01:~$ curl -sSI --cacert caddy-local-root.crt \\
    --resolve islandtours.example:443:127.0.0.1 https://islandtours.example/health
HTTP/2 200
alt-svc: h3=":443"; ma=2592000
content-type: application/json
date: Sat, 31 Oct 2026 07:29:41 GMT
server: Caddy

# ধাপ ৩, বাইরে থেকে: পুরো পথ, Firewall সহ, সময় মেপে
you@laptop:~$ curl -sS -o /dev/null --cacert caddy-local-root.crt \\
    --resolve islandtours.example:443:103.94.135.2 \\
    -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} first_byte=%{time_starttransfer} total=%{time_total} code=%{http_code}\\n' \\
    https://islandtours.example/tours/saint-martin
dns=0.000015 connect=0.002008 tls=0.008532 first_byte=0.012917 total=0.013083 code=200`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা ধাপের রহস্য <code>--resolve</code> এ। এটা curl কে বলে দেয়, এই নামের
                জন্য DNS কে জিজ্ঞেস করার দরকার নেই, সরাসরি এই IP তে যেতে হবে। Module 04 এর dns-propagation
                লেসনে এর কথা ছিল। নামটা কিন্তু Request এ থাকে, Host Header এ আর TLS এর
                SNI তে, তাই Caddy ঠিক Site টা বেছে নেয়, Certificate ও মেলে। ধাপ ২ এ
                127.0.0.1 দিয়ে আমরা ভেতর থেকেই Caddy কে পরীক্ষা করেছি, বাইরের সব কিছু
                বাদ দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                এবার যুক্তিটা দেখুন। ধাপ ১ ব্যর্থ হলে App এর দোষ। ধাপ ১ পাস কিন্তু ধাপ
                ২ ব্যর্থ হলে Caddy এর দোষ, তার Config বা Certificate। ধাপ ২ পাস কিন্তু ধাপ
                ৩ ব্যর্থ হলে দোষ দেয়ালের কাছে: ufw, Provider এর Firewall। আর ধাপ ৩ পাস
                কিন্তু Browser এ ব্যর্থ হলে বাকি থাকে একটাই জিনিস যা ধাপ ৩ বাদ দিয়েছিল:
                DNS। চারটা পরীক্ষায় পুরো পথ ভাগ হয়ে গেল।
              </ContentParagraph>
              <ContentParagraph>
                <code>-w</code> এর সংখ্যাগুলো Module 06 এর https-journey লেসনে আপনি
                পড়েছেন। মনে করিয়ে দিই: প্রতিটা সংখ্যা শুরু থেকে মাপা। connect বিয়োগ dns
                হলো TCP Handshake, tls বিয়োগ connect হলো TLS Handshake, first_byte বিয়োগ
                tls হলো Server এর ভাবার সময়। একটা ধীর সাইটে কোন ধাপটা ধীর, এখান থেকে
                সরাসরি পড়া যায়।
              </ContentParagraph>
              <ContentParagraph>
                এবার একই তিন ধাপ, কিন্তু App টা বন্ধ। Production এ সবচেয়ে বেশি দেখা
                Error টা নিজের হাতে ঘটাই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "502.txt",
          code: `deploy@island-vps-01:~$ sudo systemctl stop my-tours-api

deploy@island-vps-01:~$ curl -sS -i --cacert caddy-local-root.crt \\
    --resolve islandtours.example:443:127.0.0.1 https://islandtours.example/health
HTTP/2 502
alt-svc: h3=":443"; ma=2592000
server: Caddy
content-length: 0

deploy@island-vps-01:~$ curl -sS http://127.0.0.1:3000/health
curl: (7) Failed to connect to 127.0.0.1 port 3000 after 0 ms: Couldn't connect to server

# Caddy এর নিজের ভাষায়, কী হয়েছিল (JSON লাইন, ছোট করা)
deploy@island-vps-01:~$ journalctl -u caddy -n 1 -o cat
{"level":"error","logger":"http.log.error","msg":"dial tcp 127.0.0.1:3000: connect: connection refused",
 "request":{"remote_ip":"127.0.0.1","method":"GET","host":"islandtours.example","uri":"/health",...},
 "status":502}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                502 এর মানে Module 06 এর methods-status-codes লেসনে শিখেছেন: Gateway,
                মানে মাঝের জন, পেছনের জনের কাছ থেকে ঠিক উত্তর পায়নি। এখানে প্রমাণ তিনটা।
                Caddy 502 দিচ্ছে। App কে সরাসরি ডাকলে refused। আর Caddy এর Log এ ঠিক সেই
                শব্দ: <code>dial tcp 127.0.0.1:3000: connect: connection refused</code>।
                Caddy আর curl একই কথা বলছে, শুধু নিজের নিজের ভাষায়। 502 দেখলে প্রথম
                কমান্ড তাই সবসময় একটা: Server এ ঢুকে App কে সরাসরি ডাকা। Log পড়ার পুরো
                পদ্ধতি{" "}
                <Link href="/devops/topic/system-logs" className={linkClass}>
                  Lesson 07
                </Link>{" "}
                এ।
              </ContentParagraph>
              <ContentParagraph>
                বাইরে থেকে দেখলে আরও দুইটা চেনা ব্যর্থতা ঘটানো গেল, Caddy থামিয়ে আর ufw
                থেকে 443/tcp এর Rule মুছে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "curl-outside-failures.txt",
          code: `# Caddy থামানো: দরজায় কেউ নেই
you@laptop:~$ curl -sS -m 5 --resolve islandtours.example:443:103.94.135.2 https://islandtours.example/
curl: (7) Failed to connect to islandtours.example port 443 after 0 ms: Couldn't connect to server

# Caddy চালু, কিন্তু ufw থেকে 443/tcp মুছে ফেলা: পথে কেউ ফেলে দিচ্ছে
you@laptop:~$ curl -sS -m 5 --resolve islandtours.example:443:103.94.135.2 https://islandtours.example/
curl: (28) Connection timed out after 5004 milliseconds

# নামটাই খুঁজে পাওয়া যায় না
you@laptop:~$ curl -sS http://islandtours.invalid/
curl: (6) Could not resolve host: islandtours.invalid`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                curl এর বন্ধনীর সংখ্যাটা তার Exit Code, আর প্রতিটা একটা নির্দিষ্ট স্তরের
                নাম। Script এ <code>echo $?</code> দিয়ে এই সংখ্যাই পাবেন। সবচেয়ে বেশি
                দেখা কয়েকটা, practice server এ ঘটানো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["curl এর কোড", "বার্তা", "স্তর আর মানে"],
          rows: [
            ["6", "Could not resolve host", "DNS: নামটা IP তে বদলানো যায়নি"],
            ["7", "Failed to connect ... Couldn't connect to server", "Port: refused, বা No route to host। -v দিলে কোনটা লেখা থাকে"],
            ["28", "Connection timed out after ... milliseconds", "Port বা পথ: কেউ উত্তর দেয়নি, প্রায়ই Firewall"],
            ["35", "SSL routines::wrong version number", "TLS: https দিয়ে এমন Port এ গেছেন যেটা শুধু http বোঝে"],
            ["52", "Empty reply from server", "App: Connection খুলেছে, একটা Byte ও না দিয়ে বন্ধ"],
            ["56", "Recv failure: Connection reset by peer", "App বা মাঝের জন: কথার মাঝে RST"],
            ["60", "SSL certificate problem: ...", "TLS: Certificate বিশ্বাস করা যায়নি, কারণ লেখা থাকে"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "curl-protocol-mismatch.txt",
          code: `# https দিয়ে App এর সাধারণ http Port এ
deploy@island-vps-01:~$ curl -sS https://127.0.0.1:3000/health
curl: (35) OpenSSL/3.0.13: error:0A00010B:SSL routines::wrong version number

# উল্টোটা: http দিয়ে Caddy এর 443 এ
deploy@island-vps-01:~$ curl -sS http://127.0.0.1:443/
Client sent an HTTP request to an HTTPS server.

# এমন একটা Server, যে Request পেয়েই Socket ফেলে দেয়
deploy@island-vps-01:~$ curl -sS http://127.0.0.1:3002/
curl: (52) Empty reply from server`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "-k একটা চোখ বন্ধ করে দেয়",
          content: (
            <p>
              Certificate এর Error এড়াতে অনেকে curl এ <code>-k</code> বা{" "}
              <code>--insecure</code> দেন। Debug এর এক মুহূর্তে এটা চলে, কারণ আপনি জানতে
              চান Certificate বাদে বাকি সব ঠিক আছে কি না। কিন্তু এটা কোনো Script এ, কোনো
              Health Check এ, কোনো App এর Code এ থাকতে পারে না। Certificate এর মেয়াদ শেষ
              হলে ঠিক এই পরীক্ষাগুলোরই সবার আগে লাল হওয়ার কথা ছিল। practice server এ
              আমরা <code>-k</code> এর বদলে Caddy এর নিজের Root Certificate টা{" "}
              <code>--cacert</code> দিয়ে দিয়েছি, কারণ সেখানে কোনো Public Domain নেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 12 */
    {
      id: "tls",
      subHeader: { index: "012", title: "TLS from the Server" },
      title: <SectionTitle>তালা ঠিক আছে তো: openssl s_client</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 06 এর certificates-keys লেসনে <code>openssl s_client</code> দিয়ে
                example.com এর Certificate পড়েছেন। একই যন্ত্র নিজের Server এর বেলায় আরও
                কাজের, কারণ এখানে HTTP এর আগেই থেমে শুধু TLS টা পরীক্ষা করা যায়। Server
                এর ভেতর থেকে, Caddy কে সরাসরি:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "openssl-check.txt",
          code: `deploy@island-vps-01:~$ openssl s_client -connect 127.0.0.1:443 -servername islandtours.example \\
    -CAfile caddy-local-root.crt -brief </dev/null
CONNECTION ESTABLISHED
Protocol version: TLSv1.3
Ciphersuite: TLS_AES_128_GCM_SHA256
Peer certificate:
Hash used: SHA256
Signature type: ECDSA
Verification: OK
Server Temp Key: X25519, 253 bits

# Certificate এর তারিখ আর নাম, এক নজরে
deploy@island-vps-01:~$ openssl s_client -connect 127.0.0.1:443 -servername islandtours.example </dev/null 2>/dev/null \\
    | openssl x509 -noout -issuer -dates -ext subjectAltName
issuer=CN = Caddy Local Authority - ECC Intermediate
notBefore=Oct 31 07:25:35 2026 GMT
notAfter=Oct 31 19:25:35 2026 GMT
X509v3 Subject Alternative Name: critical
    DNS:islandtours.example

# Caddy যে নাম চেনে না, সেই নাম চাইলে
deploy@island-vps-01:~$ openssl s_client -connect 127.0.0.1:443 -servername shop.example -brief </dev/null
...:error:0A000438:SSL routines:ssl3_read_bytes:tlsv1 alert internal error:...:SSL alert number 80`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম Output এর দুইটা লাইন খুঁজুন: <code>Protocol version</code> আর{" "}
                <code>Verification: OK</code>। দুইটাই থাকলে তালা ঠিক আছে। দ্বিতীয়
                কমান্ডে <code>notAfter</code> বলে Certificate কবে মরবে, আর{" "}
                <code>subjectAltName</code> বলে এটা কোন কোন নামের জন্য। practice server এ
                Public Domain নেই বলে Caddy এখানে নিজের বানানো একটা ছোট CA ব্যবহার করছে,{" "}
                <code>tls internal</code> দিয়ে, যার Certificate মাত্র বারো ঘণ্টার। আসল
                Island Tours এ issuer এর জায়গায় Let&apos;s Encrypt এর নাম থাকবে, আর মেয়াদ
                কয়েক মাস, Module 06 এ যেমন দেখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয় কমান্ডটা একটা চেনা ভুল ধরতে শেখায়। <code>-servername</code> হলো SNI,
                Client কোন নামের Site চাইছে। Caddy <code>shop.example</code> নামের কোনো
                Site চেনে না, তাই Handshake এর শুরুতেই Alert 80 পাঠিয়ে না বলেছে। নতুন
                Domain যোগ করার পর এই Error দেখলে প্রথম সন্দেহ: Caddyfile এ নামটা লিখেছেন
                তো, আর Caddy Reload হয়েছে তো? আর <code>-servername</code> দিতে ভুললে
                অনেক Server ভুল Certificate দেখায়, তাই এটা সবসময় দিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Certificate এর মেয়াদ শেষ হলে প্রায়ই দোষ Port 80 এর",
          content: (
            <p>
              Caddy নিজেই Certificate নবীকরণ করে, তবু কখনো কখনো মেয়াদ শেষ হয়ে যায়।
              সবচেয়ে চেনা কারণ: Let&apos;s Encrypt এর HTTP-01 পরীক্ষা Port 80 দিয়ে আসে
              (Module 06 L08), আর কেউ ভেবেছিলেন আমরা তো শুধু https চালাই, 80 বন্ধ করে
              দিই। তখন নবীকরণ চুপচাপ ব্যর্থ হয়, আর মাস দুয়েক পর একদিন সকালে সাইট লাল।
              Certificate এর সমস্যা দেখলে <code>sudo ufw status</code> এ 80/tcp আছে কি না,
              আর <code>journalctl -u caddy</code> এ নবীকরণের কোনো Error আছে কি না, দুইটাই
              দেখুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 13 */
    {
      id: "tcpdump",
      subHeader: { index: "013", title: "tcpdump" },
      title: <SectionTitle>tcpdump: যখন সবাই মিথ্যা বলছে মনে হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কখনো কখনো দুই পাশের গল্প মেলে না। Laptop বলে timed out, অথচ Server এর
                ufw এ Port খোলা, Caddy শুনছেও। তখন একটাই প্রশ্ন বাকি: Packet টা আদৌ
                Server এ পৌঁছাচ্ছে কি? এর উত্তর দেয় <code>tcpdump</code>, যেটা তারে যা
                আসে আর যায় তার প্রতিটা Packet দেখায়। Module 05 এ আপনি এটা দিয়ে SYN আর FIN
                দেখেছেন। এবার Server এ চালিয়ে তিনটা ঘটনা একসাথে ধরা হলো: Laptop থেকে
                ufw এ deny করা 3000, reject করা 8080, আর খোলা 443।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "tcpdump-three-cases.txt",
          code: `deploy@island-vps-01:~$ sudo tcpdump -i eth0 -n 'tcp and (port 3000 or port 8080 or port 443) and host 103.94.135.77'
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes

# ১. deny করা 3000: একই SYN চারবার, প্রায় এক সেকেন্ড পরপর, কোনো উত্তর নেই
07:29:17.144792 IP 103.94.135.77.39748 > 103.94.135.2.3000: Flags [S], seq 265736818, win 64240, length 0
07:29:18.219834 IP 103.94.135.77.39748 > 103.94.135.2.3000: Flags [S], seq 265736818, win 64240, length 0
07:29:19.227611 IP 103.94.135.77.39748 > 103.94.135.2.3000: Flags [S], seq 265736818, win 64240, length 0
07:29:20.252696 IP 103.94.135.77.39748 > 103.94.135.2.3000: Flags [S], seq 265736818, win 64240, length 0

# ২. reject করা 8080: SYN, আর দেড় মিলিসেকেন্ডে RST
07:29:21.156624 IP 103.94.135.77.40928 > 103.94.135.2.8080: Flags [S], seq 3687044725, win 64240, length 0
07:29:21.158304 IP 103.94.135.2.8080 > 103.94.135.77.40928: Flags [R.], seq 0, ack 3687044726, win 0, length 0

# ৩. খোলা 443: পুরো Handshake, তারপর nc বিদায় নেয়
07:29:21.176948 IP 103.94.135.77.57412 > 103.94.135.2.443: Flags [S], seq 2130917118, win 64240, length 0
07:29:21.177150 IP 103.94.135.2.443 > 103.94.135.77.57412: Flags [S.], seq 1587447144, ack 2130917119, win 65160, length 0
07:29:21.177257 IP 103.94.135.77.57412 > 103.94.135.2.443: Flags [.], ack 1, win 502, length 0
07:29:21.181469 IP 103.94.135.77.57412 > 103.94.135.2.443: Flags [F.], seq 1, ack 1, win 502, length 0
07:29:21.183171 IP 103.94.135.2.443 > 103.94.135.77.57412: Flags [.], ack 2, win 510, length 0
07:29:21.200460 IP 103.94.135.2.443 > 103.94.135.77.57412: Flags [F.], seq 1, ack 2, win 510, length 0
07:29:21.200524 IP 103.94.135.77.57412 > 103.94.135.2.443: Flags [.], ack 2, win 502, length 0
# (options অংশ ছোট করা হয়েছে, বাকি সব আসল)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম ঘটনাটা সবচেয়ে কাজের শিক্ষা দেয়। SYN গুলো Server এর eth0 তে পৌঁছেছে,
                tcpdump নিজের চোখে দেখছে। তবুও কোনো উত্তর যায়নি। tcpdump Packet দেখে
                Firewall এর আগে, তাই এই ছবির মানে: Packet এসেছে, তারপর ufw ফেলে দিয়েছে।
                যদি tcpdump এ SYN একদমই না দেখা যেত, তাহলে Packet Server এ পৌঁছানোর আগেই
                কেউ ফেলেছে, মানে Provider এর Firewall বা পথের কেউ। এই একটা পার্থক্য
                দেয়ালের দুই পাশের মধ্যে রায় দিয়ে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                Flag গুলো Module 05 এর মতোই: <code>[S]</code> SYN,{" "}
                <code>[S.]</code> SYN-ACK, <code>[.]</code> শুধু ACK,{" "}
                <code>[F.]</code> FIN, <code>[R.]</code> RST। তৃতীয় ঘটনায় পুরো জীবনচক্র
                দেখা যাচ্ছে, Handshake থেকে বিদায় পর্যন্ত, চল্লিশ মিলিসেকেন্ডের কম সময়ে।
              </ContentParagraph>
              <ContentParagraph>
                tcpdump এর কয়েকটা অভ্যাস যা কাজ সহজ করে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>-n</code> সবসময়। না দিলে tcpdump প্রতিটা IP এর নাম খুঁজতে DNS কে
                  জিজ্ঞেস করে, আর ব্যস্ত Server এ নিজেই Network এ ভিড় বাড়ায়।
                </ListItem>
                <ListItem>
                  <code>-i any</code> দিলে সব Interface একসাথে, lo সহ। Caddy আর App এর
                  মাঝের কথা দেখতে <code>sudo tcpdump -ni lo port 3000</code>।
                </ListItem>
                <ListItem>
                  Filter ছোট রাখুন: <code>port 443</code>, <code>host 203.0.113.25</code>,
                  দুইটা জুড়তে <code>and</code>। শুধু নতুন Connection দেখতে{" "}
                  <code>{"'tcp[tcpflags] & tcp-syn != 0'"}</code>।
                </ListItem>
                <ListItem>
                  <code>-c 20</code> মানে বিশটা Packet ধরার পর থেমে যাওয়া। ব্যস্ত Server এ Filter
                  ছাড়া tcpdump চালালে Screen এক সেকেন্ডে ভরে যায়।
                </ListItem>
                <ListItem>
                  <code>-w capture.pcap</code> দিয়ে ফাইলে রাখুন, তারপর নিজের Laptop এ
                  Wireshark এ খুলে আরাম করে দেখুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "tcpdump এর ফাইলে মানুষের তথ্য থাকে",
          content: (
            <p>
              443 এর Packet Encrypted, ভেতরের কথা পড়া যায় না। কিন্তু lo তে Caddy আর App
              এর মাঝের কথা সাধারণ HTTP, তাতে Cookie, Login এর তথ্য, পর্যটকের নাম আর ফোন
              নম্বর সবই সাদা চোখে থাকে। তাই <code>-w</code> দিয়ে রাখা ফাইল কাজ শেষে মুছে
              দিন, কাউকে পাঠানোর আগে ভাবুন, আর কখনো Git এ রাখবেন না। IP ঠিকানাও ব্যক্তিগত
              তথ্য হিসেবে গণ্য হয় অনেক দেশের আইনে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 14 */
    {
      id: "decode",
      subHeader: { index: "014", title: "Reading the Error" },
      title: <SectionTitle>সব জোড়া লাগানো: বার্তা দেখে স্তর, স্তর দেখে কমান্ড</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ প্রতিটা যন্ত্র আলাদা করে দেখলেন। আসল রাতে কিন্তু কেউ বলবে না কোন
                যন্ত্র চালাতে হবে। আপনার হাতে আসবে একটা বার্তা, কোনো পর্যটকের Screenshot
                বা App এর Log এর একটা লাইন। সেখান থেকে শুরু। নিচের গাছটা পুরো লেসনকে একটা
                সিদ্ধান্তের ক্রমে সাজায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetdebugDecisionTreeDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আর বার্তা দেখে সরাসরি স্তর চেনার জন্য একটা ছোট অভিধান। প্রতিটা বার্তা বেছে
                নিয়ে দেখুন কোন স্তর ভেঙেছে, তারে কী ঘটেছে, কোন কারণ বেশি সম্ভব, আর প্রথম
                কমান্ড কোনটা, কোথা থেকে চালাবেন। Module 06 এর https-journey লেসনে একই
                ধরনের তালিকা ছিল Browser এর চোখে। এটা Server চালানো মানুষের চোখে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetdebugErrorLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "চারটা প্রশ্ন, যেকোনো Network সমস্যায়",
          content: (
            <ul className="list-disc pl-5 space-y-1">
              <li>আমি কোথা থেকে পরীক্ষা করছি, আর পর্যটক কোথা থেকে?</li>
              <li>নামটা কোন IP দিচ্ছে, আর সেটা কি ঠিক IP?</li>
              <li>Port এ টোকা দিলে উত্তর কী: succeeded, refused, নাকি timed out?</li>
              <li>Server এর ভেতর থেকে একই জিনিস চাইলে কী হয়?</li>
            </ul>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, মোবাইল ডেটায় সাইট খুলছে না</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এক মঙ্গলবার রাতে Island Tours এর Support এ কয়েকটা বার্তা এলো, সাইট
                খুলছে না। অদ্ভুত ব্যাপার, অফিসের সবার কাছে সাইট দিব্যি চলছে। Uptime Check
                ও সবুজ। দায়িত্বে থাকা Engineer প্রথমে অনুমানের দিকে যাননি, এই লেসনের
                পদ্ধতি ধরে এগিয়েছেন। নিচের ঘটনাটা শেখানোর জন্য সাজানো, কিন্তু প্রতিটা
                ধাপ এমন যা বাস্তবে বারবার ঘটে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কারা পারছেন না, তা আগে জানা।</strong> অভিযোগকারী তিনজনই ফোনে,
                  মোবাইল ডেটায়। Wi-Fi তে গেলে তাঁদেরও চলে। মানে সমস্যা সবার নয়, একটা
                  নির্দিষ্ট পথের। Engineer নিজের ফোন Wi-Fi বন্ধ করে খুললেন, সাইট আসেনি।
                  সমস্যাটা এখন হাতে ধরা যায়।
                </ListItem>
                <ListItem>
                  <strong>স্তর ১, DNS।</strong> <code>dig +short islandtours.example A</code>{" "}
                  দিল 103.94.135.2, ঠিক আছে। কিন্তু <code>dig +short islandtours.example AAAA</code>{" "}
                  ও একটা উত্তর দিল, <code>2001:db8::7334</code>। Module 04 এর dns-records
                  লেসনের সেই AAAA Record, IPv6 এর ঠিকানা। এখানে একটা ধারণা এলো: যে
                  মোবাইল Network IPv6 দেয়, সেখানে ফোন আগে IPv6 এ যাওয়ার চেষ্টা করে।
                  অফিসের Wi-Fi তে IPv6 নেই, তাই সেখানে সবাই IPv4 এ যায়।
                </ListItem>
                <ListItem>
                  <strong>স্তর ৩, Port, দুই রাস্তায় আলাদা করে।</strong> একটা IPv6 আছে এমন
                  যন্ত্র থেকে <code>curl -4 -sI https://islandtours.example</code> দিল
                  200। একই জায়গা থেকে{" "}
                  <code>curl -6 -sI --connect-timeout 5 https://islandtours.example</code>{" "}
                  দিল <code>curl: (28)</code>, timed out। refused নয়, timed out। মানে
                  IPv6 এর পথে কেউ Packet ফেলছে।
                </ListItem>
                <ListItem>
                  <strong>Server এর ভেতরে।</strong> <code>ip -6 a</code> এ ঠিকানাটা আছে।{" "}
                  <code>sudo ss -tlnp &apos;sport = :443&apos;</code> এ Caddy{" "}
                  <code>*:443</code> এ, মানে IPv6 এও শুনছে। <code>sudo ufw status</code> এ
                  443/tcp এর পাশে (v6) লাইনটাও আছে। ভেতরের সব ঠিক।
                </ListItem>
                <ListItem>
                  <strong>রায় দিল tcpdump।</strong> Server এ{" "}
                  <code>sudo tcpdump -ni any &apos;ip6 and tcp port 443&apos;</code> চালিয়ে
                  ফোন থেকে আবার চেষ্টা। একটা SYN ও এলো না। Packet Server এ পৌঁছানোর আগেই
                  কেউ ফেলছে, মানে দেয়ালের বাইরে। Provider এর Dashboard খুলে দেখা গেল সেদিন
                  বিকেলে Cloud Firewall এর Rule গুলো নতুন করে সাজানো হয়েছিল, আর 443 এর
                  Rule এ Source লেখা শুধু IPv4 এর সব ঠিকানা, IPv6 এর জন্য কোনো Rule নেই।
                </ListItem>
                <ListItem>
                  <strong>সারানো আর প্রমাণ।</strong> IPv6 এর জন্য 443 আর 80 এর Rule যোগ
                  হলো। আবার <code>curl -6 -sI</code>, এবার 200। ফোন থেকেও চলল। পুরো কাজে
                  পঁচিশ মিনিট, কোনো Restart ছাড়া, আর শেষে স্পষ্ট জানা গেল কী ভেঙেছিল।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এরপর Island Tours তিনটা জিনিস বদলেছে। Uptime Check এখন IPv4 আর IPv6
                দুই পথে আলাদা করে সাইট দেখে, কারণ আগেরটা শুধু IPv4 দেখত বলে সবুজ ছিল।
                Firewall এর যেকোনো বদলের পর বাইরে থেকে একটা ছোট Script চালানো নিয়ম, যেটা
                দুই পথে 80 আর 443 এ টোকা দেয়। আর Runbook এ একটা নতুন লাইন: কিছু মানুষ পারছেন
                কিছু মানুষ পারছেন না, এমন অভিযোগে প্রথমে খুঁজুন দুই দলের মধ্যে কী আলাদা,
                Network, দেশ, IPv6, ISP।
              </ContentParagraph>
              <ContentParagraph>
                এবার আপনার পালা। নিচে ছয়টা ঘটনা, প্রতিটায় একটা লুকানো দোষ। বাইরে থেকে শুরু
                করে ভেতরে যান, আর প্রথম লাল পরীক্ষাটা খুঁজুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetdebugOutsideInLab /> },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>সাইট খুলছে না: দশ ধাপের নিয়ম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              যেকোনো &quot;কাজ করছে না&quot; অভিযোগে এই ক্রমটা মেনে চলুন। প্রতিটা ধাপ আগের
              ধাপের উত্তরের উপর দাঁড়ানো, আর বেশিরভাগ রাতে পাঁচ ছয় ধাপের মধ্যেই উত্তর
              মেলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "অভিযোগটা নিখুঁত করুন",
              description:
                "কে, কোথা থেকে, কখন থেকে, ঠিক কোন বার্তা। সবাই পারছেন না, নাকি কিছু মানুষ? Screenshot চেয়ে নিন। ERR_CONNECTION_TIMED_OUT আর 502 একই অভিযোগ নয়।",
            },
            {
              title: "নিজে বাইরে থেকে ঘটান",
              description:
                "নিজের Laptop থেকে, Server এ না ঢুকে, পর্যটকের মতো করে। নিজে ঘটাতে না পারলে আগে খুঁজুন আপনার আর পর্যটকের মধ্যে কী আলাদা: Network, IPv6, দেশ।",
            },
            {
              title: "নাম থেকে IP",
              description:
                "dig +short islandtours.example, A আর AAAA দুইটাই। উত্তর 103.94.135.2 না হলে থামুন, সমস্যা DNS এ।",
            },
            {
              title: "Port এ টোকা",
              description:
                "nc -vz -w 5 103.94.135.2 443। succeeded হলে এগোন। refused হলে Server এ কেউ শুনছে না। timed out হলে পথে কেউ ফেলছে।",
            },
            {
              title: "TLS",
              description:
                "openssl s_client -connect 103.94.135.2:443 -servername islandtours.example -brief। Verification: OK না এলে Certificate এর তারিখ আর নাম দেখুন।",
            },
            {
              title: "HTTP এর Status",
              description:
                "curl -sI https://islandtours.example। 200 হলে Network ঠিক, সমস্যা App এর ভেতরে। 502 বা 504 হলে Server এ ঢুকুন।",
            },
            {
              title: "Server এ ঢুকে কে শুনছে",
              description:
                "ssh island, তারপর sudo ss -tlnp। Caddy 443 এ আছে? App 127.0.0.1:3000 এ আছে? ঠিক Port এ, ঠিক ঠিকানায়?",
            },
            {
              title: "ভেতর থেকে একই প্রশ্ন",
              description:
                "curl 127.0.0.1:3000/health, তারপর curl --resolve islandtours.example:443:127.0.0.1। ভেতর থেকে চলে আর বাইরে থেকে না চললে ufw আর Provider এর Firewall দেখুন।",
            },
            {
              title: "Packet আদৌ আসছে কি",
              description:
                "দুই পাশের গল্প না মিললে sudo tcpdump -ni any port 443, আর বাইরে থেকে আবার চেষ্টা। SYN না এলে দোষ দেয়ালের বাইরে।",
            },
            {
              title: "সারানোর পর বাইরে থেকে প্রমাণ, আর লিখে রাখা",
              description:
                "যে পরীক্ষাটা লাল ছিল, বাইরে থেকে সেটাই আবার চালিয়ে সবুজ দেখুন। তারপর তিন লাইনে লিখুন: কী দেখা গেছিল, কারণ কী ছিল, আর কী বদলালে আবার হবে না।",
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
                <strong>নিচের Lab টা আগে করুন</strong>, কারণ refused আর timed out এর
                পার্থক্য একবার নিজের হাতে ঘটালে আর ভুলবেন না।
              </ListItem>
              <ListItem>
                <strong>ss এর man page</strong>, সব Flag আর Filter এর ভাষা, state আর
                sport, dport এর পুরো নিয়ম। Terminal এ <code>man ss</code>, অথবা{" "}
                <a href="https://man7.org/linux/man-pages/man8/ss.8.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  man7.org/linux/man-pages/man8/ss.8.html
                </a>
              </ListItem>
              <ListItem>
                <strong>ip route এর man page</strong>, Routing Table পড়া আর{" "}
                <code>ip route get</code>।{" "}
                <a href="https://man7.org/linux/man-pages/man8/ip-route.8.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  man7.org/linux/man-pages/man8/ip-route.8.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Everything curl</strong>, curl এর লেখকের লেখা পুরো বই, বিনামূল্যে।
                --resolve, -w আর Exit Code এর অধ্যায়গুলো এই লেসনের সাথে সরাসরি মেলে।{" "}
                <a href="https://everything.curl.dev/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  everything.curl.dev
                </a>
                {" আর Error Code এর পুরো তালিকা "}
                <a href="https://curl.se/libcurl/c/libcurl-errors.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  curl.se/libcurl/c/libcurl-errors.html
                </a>
              </ListItem>
              <ListItem>
                <strong>tcpdump এর man page</strong>, Filter এর ভাষা সহ।{" "}
                <a href="https://www.tcpdump.org/manpages/tcpdump.1.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  tcpdump.org/manpages/tcpdump.1.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Ubuntu 24.04 এর dig আর resolvectl</strong>, যে Version আপনার
                Server এ আছে, তার নথি।{" "}
                <a href="https://manpages.ubuntu.com/manpages/noble/man1/dig.1.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  dig
                </a>
                {", "}
                <a href="https://manpages.ubuntu.com/manpages/noble/man1/resolvectl.1.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  resolvectl
                </a>
              </ListItem>
              <ListItem>
                <strong>এই Track এর আগের লেসন</strong>, যেগুলোর উপর এই লেসন দাঁড়িয়ে:{" "}
                <Link href="/devops/topic/port-and-socket" className={linkClass}>
                  Port and Socket
                </Link>
                {", "}
                <Link href="/devops/topic/connection-close" className={linkClass}>
                  Connection Close
                </Link>
                {", "}
                <Link href="/devops/topic/https-journey" className={linkClass}>
                  Full HTTPS Journey
                </Link>
                {"।"}
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
                  সাইট খুলছে না একটা উপসর্গ। পদ্ধতি: বাইরে থেকে ভেতরে, এক স্তর করে,
                  DNS, পথ, Port, TLS, HTTP। প্রথম যে স্তর ভাঙে, সেখানে থামুন। বদলানোর আগে
                  প্রমাণ।
                </ListItem>
                <ListItem>
                  <code>ip a</code> বলে Server এর ঠিকানা, <code>ip route</code> বলে বাইরে
                  যাওয়ার দরজা। <code>ip route get</code> বলে একটা নির্দিষ্ট ঠিকানায় কোন
                  পথে যাবে।
                </ListItem>
                <ListItem>
                  ping শুধু ICMP দেখে, অনেক জায়গায় বন্ধ। traceroute এর তারা মানে উত্তর
                  আসেনি, পথ ভাঙা নয়; দরকারি Port দিয়ে <code>traceroute -T -p 443</code>।
                </ListItem>
                <ListItem>
                  App দেখে <code>getent hosts</code> এর উত্তর, /etc/hosts আগে। দুনিয়া দেখে{" "}
                  <code>dig @1.1.1.1</code>। দুইটা না মিললে /etc/hosts সন্দেহ করুন।
                </ListItem>
                <ListItem>
                  <code>sudo ss -tlnp</code>: কে কোন দরজায় শুনছে। 127.0.0.1 মানে শুধু
                  ভেতর থেকে, 0.0.0.0 বা <code>*</code> মানে সবার জন্য। খোলা প্রতিটার পাশে
                  একটা কারণ চাই।
                </ListItem>
                <ListItem>
                  <code>ss -tan</code> আর State গোনা: TIME-WAIT স্বাভাবিক, বাড়তে থাকা
                  CLOSE-WAIT নিজের Code এর দোষ। পুরনো netstat একই কাজ করে, lsof আর fuser
                  বলে কে Port ধরে আছে।
                </ListItem>
                <ListItem>
                  refused মানে উত্তর এসেছে আর সেটা না, Server এর ভেতরে সমস্যা। timed out
                  মানে কোনো উত্তর নেই, পথে কেউ ফেলছে। No route মানে ওখানে কেউ নেই।
                </ListItem>
                <ListItem>
                  curl দিয়ে পথ ভাগ করুন: App সরাসরি, তারপর <code>--resolve</code> দিয়ে
                  ভেতর থেকে Caddy, তারপর বাইরে থেকে। 502 দেখলে প্রথমে App কে সরাসরি ডাকুন।
                </ListItem>
                <ListItem>
                  <code>openssl s_client -servername</code> TLS কে আলাদা করে পরীক্ষা করে।
                  tcpdump বলে Packet আদৌ পৌঁছাচ্ছে কি না, আর সেটাই দেয়ালের দুই পাশের রায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর, Cron & Scheduled Tasks",
          content: (
            <p>
              এই লেসনের সব কাজ আপনি হাতে করেছেন, কারণ কেউ একটা সমস্যা জানিয়েছিল। কিন্তু
              Server এর অনেক কাজ কেউ জানানোর অপেক্ষায় থাকে না: প্রতি রাতে Database এর
              Backup, প্রতি সপ্তাহে পুরনো Log মোছা, প্রতি ঘণ্টায় Certificate এর মেয়াদ
              দেখা, এমনকি এই লেসনের ছোট পরীক্ষার Script টা প্রতি পাঁচ মিনিটে বাইরে থেকে
              চালানো। এই কাজগুলো নির্দিষ্ট সময়ে নিজে থেকে চালানোর ব্যবস্থাই পরের লেসন:{" "}
              <Link href="/devops/topic/cron-jobs" className={linkClass}>
                Cron &amp; Scheduled Tasks
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
      ["Outside in", "পর্যটকের জায়গা থেকে শুরু, তারপর ভেতরে; প্রথম যে স্তর ভাঙে সেখানে থামা"],
      ["ip a, ip route", "Server এর ঠিকানা আর বাইরে যাওয়ার দরজা, ip route get দিয়ে নির্দিষ্ট পথ"],
      ["ping", "ICMP দিয়ে বেঁচে আছে কি না; উত্তর না এলে Server মৃত নয়, ICMP বন্ধ হতে পারে"],
      ["traceroute -T -p 443", "খোলা Port দিয়ে পথের Hop; তারা মানে উত্তর নেই, পথ ভাঙা নয়"],
      ["getent vs dig", "App /etc/hosts আগে দেখে, dig সরাসরি DNS; দুনিয়ার উত্তর dig @1.1.1.1"],
      ["127.0.0.53", "Ubuntu এর systemd-resolved, Stub Resolver; আসল Resolver দেখায় resolvectl status"],
      ["ss -tlnp", "কে কোন দরজায় শুনছে, Process সহ; অন্যের Process দেখতে sudo"],
      ["ss -tan, State", "চলমান Connection; TIME-WAIT স্বাভাবিক, জমতে থাকা CLOSE-WAIT নিজের Bug"],
      ["lsof, fuser", "কোন Process আর কোন User একটা Port ধরে আছে; EADDRINUSE এর উত্তর"],
      ["Bind address", "127.0.0.1 শুধু ভেতর থেকে, 0.0.0.0 আর * সবার জন্য; Firewall খোলা হলেও ভুল দরজায় refused"],
      ["Connection refused", "RST এসেছে; কেউ শুনছে না বা REJECT Rule। Node এ ECONNREFUSED, curl (7)"],
      ["Connection timed out", "উত্তর নেই; Firewall DROP বা ভুল IP। Node এ ETIMEDOUT, curl (28)"],
      ["No route to host", "ওই ঠিকানায় কেউ নেই বা Router না বলেছে। Node এ EHOSTUNREACH"],
      ["curl --resolve", "DNS বাদ দিয়ে নির্দিষ্ট IP তে যাওয়া, নাম আর SNI ঠিক রেখে; পথ ভাগ করার যন্ত্র"],
      ["502 from Caddy", "Caddy ঠিক, পেছনের App নেই; প্রথমে curl 127.0.0.1:3000"],
      ["openssl s_client", "শুধু TLS পরীক্ষা; -servername না দিলে ভুল Certificate বা Alert"],
      ["tcpdump", "Packet আদৌ পৌঁছায় কি না; Firewall এর আগে দেখে, তাই দেয়ালের ভেতর না বাইরে বলে দেয়"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Laptop থেকে nc -vz -w 5 103.94.135.2 443 চালালে পাঁচ সেকেন্ড পর timed out আসে। সবচেয়ে সম্ভাব্য অর্থ কোনটা?",
        options: [
          {
            key: "A",
            text: "Caddy চলছে না",
            isCorrect: false,
            explanation:
              "Caddy না চললে Kernel সাথে সাথে RST দিত, তাই আসত refused, timed out নয়।",
          },
          {
            key: "B",
            text: "পথের কোনো Firewall Packet টা চুপচাপ ফেলে দিচ্ছে",
            isCorrect: true,
            explanation:
              "ঠিক। কোনো উত্তর না আসা মানে কেউ DROP করছে: ufw, Provider এর Cloud Firewall, বা DNS এর ভুল IP এর চুপ থাকা যন্ত্র।",
          },
          {
            key: "C",
            text: "DNS নামটা খুঁজে পাচ্ছে না",
            isCorrect: false,
            explanation:
              "এখানে নাম নয়, IP দিয়েই টোকা দেওয়া হয়েছে। DNS এর সমস্যা হলে আসত Could not resolve host।",
          },
          {
            key: "D",
            text: "Certificate এর মেয়াদ শেষ",
            isCorrect: false,
            explanation:
              "nc শুধু TCP Handshake দেখে, TLS এ পৌঁছায়ই না। Certificate এর সমস্যা এই পরীক্ষায় ধরা পড়ে না।",
          },
        ],
      },
      {
        id: 2,
        text: "my-tours এর App 127.0.0.1:3000 এ চলছে, আর ufw এ 3000/tcp allow করা আছে। বাইরে থেকে nc দিয়ে 3000 এ টোকা দিলে কী আসবে?",
        options: [
          {
            key: "A",
            text: "succeeded, কারণ Firewall খোলা",
            isCorrect: false,
            explanation:
              "Firewall শুধু ঢুকতে দেয়। eth0 এর দরজায় 3000 এ কেউ বসে নেই, App বসে আছে শুধু lo তে।",
          },
          {
            key: "B",
            text: "timed out",
            isCorrect: false,
            explanation:
              "Packet ফেলার মতো কেউ নেই, Firewall তো ছেড়ে দিয়েছে। Kernel উত্তর দেবে।",
          },
          {
            key: "C",
            text: "Connection refused",
            isCorrect: true,
            explanation:
              "ঠিক। SYN পৌঁছায়, কিন্তু 103.94.135.2:3000 এ কোনো Socket শুনছে না, তাই Kernel RST দেয়। practice server এ ঠিক এটাই ঘটেছে।",
          },
          {
            key: "D",
            text: "No route to host",
            isCorrect: false,
            explanation:
              "Server টা আছে আর পৌঁছানো যায়, তাই route নিয়ে কোনো সমস্যা নেই।",
          },
        ],
      },
      {
        id: 3,
        text: "deploy হিসেবে sudo ছাড়া ss -tlnp চালালে বেশিরভাগ লাইনের Process ঘর ফাঁকা। কেন?",
        options: [
          {
            key: "A",
            text: "ওই Socket গুলোর কোনো Process নেই",
            isCorrect: false,
            explanation:
              "প্রতিটা LISTEN Socket কোনো না কোনো Process এর। sudo দিলেই নাম দেখা যায়।",
          },
          {
            key: "B",
            text: "অন্য User এর Process এর তথ্য Kernel সাধারণ User কে দেয় না",
            isCorrect: true,
            explanation:
              "ঠিক। deploy শুধু নিজের Process গুলোর নাম দেখে। Caddy, Redis, my-tours এর App অন্য User এর, তাই sudo লাগে।",
          },
          {
            key: "C",
            text: "-p Flag শুধু UDP তে কাজ করে",
            isCorrect: false,
            explanation: "-p TCP আর UDP দুইটাতেই কাজ করে।",
          },
          {
            key: "D",
            text: "ss পুরনো, netstat লাগবে",
            isCorrect: false,
            explanation:
              "netstat এর ও একই নিয়ম, অন্যের Process দেখতে তারও root লাগে।",
          },
        ],
      },
      {
        id: 4,
        text: "বাইরে থেকে https://islandtours.example দিলে HTTP/2 502, server: Caddy আসে। প্রথম কোন কমান্ডটা চালাবেন?",
        options: [
          {
            key: "A",
            text: "sudo systemctl restart caddy",
            isCorrect: false,
            explanation:
              "Caddy নিজে ঠিক আছে, সে-ই 502 লিখে পাঠাচ্ছে। Restart প্রমাণ মুছে দেয় আর কিছু সারায় না।",
          },
          {
            key: "B",
            text: "Server এ ঢুকে curl -sS http://127.0.0.1:3000/health",
            isCorrect: true,
            explanation:
              "ঠিক। 502 মানে Caddy পেছনের App এর কাছ থেকে উত্তর পায়নি। App কে সরাসরি ডাকলেই জানা যায় সে আছে কি না, আর ঠিক Port এ কি না।",
          },
          {
            key: "C",
            text: "dig +short islandtours.example",
            isCorrect: false,
            explanation:
              "502 টা Caddy পাঠিয়েছে, মানে DNS, Port আর TLS সব পার হয়ে গেছে। DNS এ সমস্যা থাকলে Caddy পর্যন্ত পৌঁছাতেই পারতেন না।",
          },
          {
            key: "D",
            text: "sudo ufw allow 3000/tcp",
            isCorrect: false,
            explanation:
              "Caddy আর App একই যন্ত্রে, lo দিয়ে কথা বলে। ufw এখানে বাধা নয়, আর 3000 বাইরে খুলে দেওয়া বিপজ্জনক।",
          },
        ],
      },
      {
        id: 5,
        text: "traceroute -n 103.94.135.2 এ তিরিশটা লাইনেই শুধু তারা, অথচ সাইট দিব্যি চলছে। এর সবচেয়ে সঠিক ব্যাখ্যা কোনটা?",
        options: [
          {
            key: "A",
            text: "পথ ভাঙা, সাইটটা Cache থেকে আসছে",
            isCorrect: false,
            explanation:
              "পথ ভাঙা থাকলে কোনো নতুন Request ই পৌঁছাত না।",
          },
          {
            key: "B",
            text: "traceroute এর UDP Probe গুলো Firewall ফেলে দিচ্ছে; TCP দিয়ে খোলা Port এ চালালে Hop দেখা যাবে",
            isCorrect: true,
            explanation:
              "ঠিক। Linux এর traceroute Default এ উঁচু UDP Port এ Probe পাঠায়, যেগুলো ufw এর Default deny ফেলে দেয়। traceroute -T -p 443 এ practice server এক Hop এ উত্তর দিয়েছে।",
          },
          {
            key: "C",
            text: "Server এর IPv6 বন্ধ",
            isCorrect: false,
            explanation: "এখানে IPv4 ঠিকানায় traceroute চলছে, IPv6 এর কোনো ভূমিকা নেই।",
          },
          {
            key: "D",
            text: "Server এর ping বন্ধ, তাই traceroute কাজ করবে না কখনো",
            isCorrect: false,
            explanation:
              "traceroute TTL শেষ হওয়ার বার্তা দিয়ে কাজ করে, আর TCP মোডে খোলা Port এর SYN-ACK দিয়েও গন্তব্য চেনে।",
          },
        ],
      },
      {
        id: 6,
        text: "dig +short islandtours.example দিচ্ছে 103.94.135.9, অথচ Server আসলে 103.94.135.2। nc -vz 103.94.135.2 443 succeeded। পর্যটকের Browser কেন ব্যর্থ?",
        options: [
          {
            key: "A",
            text: "Caddy এর Certificate ভুল",
            isCorrect: false,
            explanation:
              "Browser ঠিক Server এ পৌঁছালে তবেই Certificate এর প্রশ্ন আসে। এখানে সে পৌঁছাচ্ছেই না।",
          },
          {
            key: "B",
            text: "Browser নামের জন্য DNS এর উত্তর মানে আর ভুল IP তে যায়; IP দিয়ে করা nc DNS কে পাশ কাটিয়েছে",
            isCorrect: true,
            explanation:
              "ঠিক। নিজের পরীক্ষা কোন ঠিকানায় যাচ্ছে সেটা না দেখলে এই ভুল ধরা পড়ে না। Record ঠিক করুন, TTL পর্যন্ত অপেক্ষা মাথায় রাখুন।",
          },
          {
            key: "C",
            text: "ufw এ 443 বন্ধ",
            isCorrect: false,
            explanation: "সঠিক IP তে nc succeeded, মানে 443 খোলা।",
          },
          {
            key: "D",
            text: "App 127.0.0.1 এ বসে আছে",
            isCorrect: false,
            explanation:
              "App এর জায়গা ঠিকই আছে। পর্যটক Caddy পর্যন্তই পৌঁছাচ্ছেন না।",
          },
        ],
      },
      {
        id: 7,
        text: "ss -tan এ দেখা যাচ্ছে my-tours এর node Process এর শত শত CLOSE-WAIT, আর সংখ্যা বাড়ছেই। কার দোষ?",
        options: [
          {
            key: "A",
            text: "Client দের, তারা ঠিকমতো বন্ধ করছে না",
            isCorrect: false,
            explanation:
              "CLOSE-WAIT মানে Client ঠিকই FIN পাঠিয়ে বিদায় বলেছে। এবার বন্ধ করার পালা আপনার Program এর।",
          },
          {
            key: "B",
            text: "Kernel এর, TIME-WAIT এর মতো নিজে থেকে মুছে যাবে",
            isCorrect: false,
            explanation:
              "TIME-WAIT নিজে মোছে, CLOSE-WAIT মোছে না। Process যতক্ষণ চলবে, ততক্ষণ থাকবে।",
          },
          {
            key: "C",
            text: "নিজের Code এর, Socket বন্ধ করা হচ্ছে না",
            isCorrect: true,
            explanation:
              "ঠিক। Module 05 এর connection-close লেসনের সেই Leak। কোন জায়গায় Connection খুলে বন্ধ করা হচ্ছে না, Code এ খুঁজতে হবে।",
          },
          {
            key: "D",
            text: "ufw এর, Connection আটকে দিচ্ছে",
            isCorrect: false,
            explanation:
              "Firewall Connection এর State বানায় না। এগুলো সফলভাবে খোলা আর ওপাশ থেকে বন্ধ হওয়া Connection।",
          },
        ],
      },
      {
        id: 8,
        text: "my-tours এর App হাতে চালাতে গেলে আসে EADDRINUSE: address already in use 127.0.0.1:3000। সবচেয়ে ভালো প্রথম পদক্ষেপ কোনটা?",
        options: [
          {
            key: "A",
            text: "sudo fuser -k 3000/tcp দিয়ে Port এর Process মেরে ফেলা",
            isCorrect: false,
            explanation:
              "কে ধরে আছে না জেনে মারা ঝুঁকিপূর্ণ। systemd এর Service হলে আবার চালু হবে, আর অন্য কিছু হলে সেটা ভেঙে দেবেন।",
          },
          {
            key: "B",
            text: "sudo ss -tlnp 'sport = :3000' দিয়ে কে ধরে আছে দেখা",
            isCorrect: true,
            explanation:
              "ঠিক। প্রথমে প্রমাণ। প্রায়ই দেখা যায় systemd এর my-tours-api নিজেই চলছে, তখন সমাধান systemctl stop, বা হাতে অন্য Port নেওয়া।",
          },
          {
            key: "C",
            text: "Server Reboot",
            isCorrect: false,
            explanation:
              "Reboot এর পর systemd আবার একই Service চালু করবে, আর আপনি কিছুই শিখবেন না।",
          },
          {
            key: "D",
            text: "App কে 0.0.0.0:3000 এ চালানো",
            isCorrect: false,
            explanation:
              "0.0.0.0 এর মধ্যে 127.0.0.1 ও পড়ে, তাই একই সংঘাত হবে, আর সাথে App বাইরে খুলে যাওয়ার ঝুঁকি।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের practice server এ Network ভাঙুন, তারপর খুঁজে বের করুন",
    subtitle: "ছয়টা পরীক্ষা, একটা Server আর আপনার Laptop",
    stepName: "LAB",
    steps: [
      {
        title: "Server কে চিনুন",
        description:
          "ঠিকানা, Gateway, Resolver আর তিনটা ঠিকানার পথ লিখে নিন। ip route get 1.1.1.1 এ via আর ip route get 127.0.0.1 এ local দেখবেন।",
      },
      {
        title: "কে শুনছে, তার তালিকা",
        description:
          "sudo দিয়ে আর ছাড়া ss -tlnp চালিয়ে তুলনা করুন। প্রতিটা লাইনের পাশে লিখুন ভেতরের না বাইরের, আর বাইরের হলে কেন।",
      },
      {
        title: "দুই দরজার পরীক্ষা",
        description:
          "একটা Program দুইটা Server চালায়, একটা 127.0.0.1 এ, একটা 0.0.0.0 এ। Laptop থেকে প্রথমটায় refused, দ্বিতীয়টায় succeeded দেখবেন, Firewall খোলা থাকলেও।",
      },
      {
        title: "deny বনাম reject, সময় মেপে",
        description:
          "একই Port এ একবার ufw deny, একবার reject দিয়ে Laptop থেকে টোকা দিন। পাঁচ সেকেন্ডের timed out আর মিলিসেকেন্ডের refused, আর tcpdump এ তার কারণ দেখবেন।",
      },
      {
        title: "ভেতর থেকে বাইরে, তারপর 502",
        description:
          "Caddy এর এক লাইনের Reverse Proxy বসিয়ে তিন ধাপে curl করুন, তারপর App থামিয়ে 502 আর Caddy এর Log এর connection refused মিলিয়ে নিন।",
      },
      {
        title: "Error এর নাম মুখস্থ নয়, ঘটিয়ে দেখা",
        description:
          "একটা Node Script চারটা ঠিকানায় চেষ্টা করে ECONNREFUSED, ETIMEDOUT, EHOSTUNREACH আর ENOTFOUND ছাপবে, প্রতিটার সময় সহ।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-map.sh",
        language: "bash",
        code: `# Server এ চালান। প্রতিটা কমান্ডের পরে Output টা নিজের খাতায় লিখুন।
ip -br a                        # কোন Interface, কোন ঠিকানা
ip route                        # default via ... লাইনটাই Gateway
ip route get 1.1.1.1            # বাইরের ঠিকানা: via Gateway দেখবেন
ip route get 127.0.0.1          # নিজের ভেতরে: local দেখবেন
grep -v '^#' /etc/resolv.conf   # Ubuntu তে nameserver 127.0.0.53
resolvectl status | head -8     # আসল Resolver কারা
getent hosts example.com        # App যেভাবে নাম খোঁজে
dig +short example.com          # DNS কে সরাসরি
# প্রশ্ন: আপনার Server এর Public IP কি ip a তে আছে? না থাকলে কেন?`,
      },
      {
        filename: "2-listeners.sh",
        language: "bash",
        code: `# Server এ চালান, প্রথমে sudo ছাড়া, তারপর sudo দিয়ে
ss -tlnp
sudo ss -tlnp
sudo ss -ulnp

# শুধু যারা বাইরের দিকে খোলা, মানে 127. বা [::1] নয়
sudo ss -tlnp | awk 'NR==1 || ($4 !~ /^127\\./ && $4 !~ /^\\[::1\\]/)'

# একটা নির্দিষ্ট Port কে ধরে আছে, তিনভাবে
sudo ss -tlnp 'sport = :22'
sudo lsof -nP -i :22
sudo fuser -v 22/tcp
# Ubuntu 24.04 এ 22 এর পাশে systemd দেখলে অবাক হবেন না, Lesson 03 দেখুন।`,
      },
      {
        filename: "3-bind.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT_LOCAL=47891 LAB_PORT_PUBLIC=47892 node 3-bind.mjs
// একই Program, দুইটা Server: একটা শুধু ভেতরের দরজায় (127.0.0.1), একটা সব দরজায় (0.0.0.0)।
import http from "node:http";

const localPort = Number(process.env.LAB_PORT_LOCAL);
const publicPort = Number(process.env.LAB_PORT_PUBLIC);
if (!localPort || !publicPort) {
  throw new Error("LAB_PORT_LOCAL and LAB_PORT_PUBLIC must be set");
}

function answer(name) {
  return (req, res) => {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    res.end(\`\${name} answered \${req.method} \${req.url} from \${req.socket.remoteAddress}\\n\`);
  };
}

http.createServer(answer("local-only")).listen(localPort, "127.0.0.1", () =>
  console.log(\`local-only  listening on 127.0.0.1:\${localPort}\`),
);
http.createServer(answer("everyone")).listen(publicPort, "0.0.0.0", () =>
  console.log(\`everyone    listening on 0.0.0.0:\${publicPort}\`),
);

// তারপর Laptop থেকে, SERVER_IP এ আপনার Server এর ঠিকানা রেখে:
//   export SERVER_IP=203.0.113.10      (নিজের Server এর IP বসান)
//   nc -vz -w 3 "$SERVER_IP" 47891     ->  Connection refused
//   nc -vz -w 3 "$SERVER_IP" 47892     ->  succeeded (ufw চালু থাকলে আগে allow দিন)`,
      },
      {
        filename: "4-drop-vs-reject.sh",
        language: "bash",
        code: `# শুরুর আগে: ufw চালু আর OpenSSH খোলা থাকতে হবে (Lesson 06 এর প্রথম ধাপগুলো)।
# 3-bind.mjs এখনো চলছে ধরে নেওয়া হলো। Port গুলো Environment Variable থেকে।
export LAB_PORT_PUBLIC=47892

# ক. Server এ: deny, মানে Packet চুপচাপ ফেলে দেওয়া
sudo ufw deny "$LAB_PORT_PUBLIC/tcp"
#    Laptop এ:
time nc -vz -w 5 "$SERVER_IP" "$LAB_PORT_PUBLIC"      # প্রায় 5 সেকেন্ড, timed out

# খ. Server এ: deny সরিয়ে reject, মানে সাথে সাথে না বলে দেওয়া
sudo ufw delete deny "$LAB_PORT_PUBLIC/tcp"
sudo ufw reject "$LAB_PORT_PUBLIC/tcp"
#    Laptop এ:
time nc -vz -w 5 "$SERVER_IP" "$LAB_PORT_PUBLIC"      # প্রায় সাথে সাথে, refused

# গ. দুইবারই Server এ পাশের Terminal এ এটা চালু রাখুন, আর Flag মিলিয়ে নিন
sudo tcpdump -ni any "tcp port $LAB_PORT_PUBLIC"
#    deny:   শুধু [S] বারবার
#    reject: [S] তারপর [R.]

# ঘ. পরিষ্কার করা
sudo ufw delete reject "$LAB_PORT_PUBLIC/tcp"
sudo ufw status numbered`,
      },
      {
        filename: "5-inside-out.sh",
        language: "bash",
        code: `# Server এ। Caddy না থাকলে: sudo apt install caddy
# (Ubuntu এর নিজের ভান্ডারের Caddy পুরনো, এই পরীক্ষার জন্য যথেষ্ট।
#  Production এর জন্য Caddy এর নিজের ভান্ডার, Lesson 11 এ।)
export LAB_PORT_LOCAL=47891 LAB_PROXY_PORT=47893

# ক. এক লাইনের Reverse Proxy: LAB_PROXY_PORT এ শোনে, ভেতরের App কে দেয়
caddy reverse-proxy --from ":$LAB_PROXY_PORT" --to "127.0.0.1:$LAB_PORT_LOCAL" > /tmp/rp.log 2>&1 &

# খ. ধাপ ১: App সরাসরি      ধাপ ২: Caddy হয়ে
curl -sS "http://127.0.0.1:$LAB_PORT_LOCAL/"
curl -sS -i "http://127.0.0.1:$LAB_PROXY_PORT/health" | head -3   # HTTP/1.1 200 OK, Server: Caddy

# গ. App থামান (3-bind.mjs এর Terminal এ Ctrl+C), তারপর আবার
curl -sS -i "http://127.0.0.1:$LAB_PROXY_PORT/health" | head -3   # HTTP/1.1 502 Bad Gateway
grep -o '"msg":"dial[^"]*"' /tmp/rp.log | tail -1
#   "msg":"dial tcp 127.0.0.1:47891: connect: connection refused"

# ঘ. পরিষ্কার করা
kill %1`,
      },
      {
        filename: "6-probe.mjs",
        language: "javascript",
        code: `// চালান:  PROBE_TIMEOUT_MS=5000 node 6-probe.mjs 203.0.113.10:443 203.0.113.10:47891 no-such-host.invalid:443
// প্রতিটা ঠিকানায় একটা TCP Connection খোলার চেষ্টা করে, আর ঠিক কোন Error এলো সেটা ছাপে।
import net from "node:net";

const timeoutMs = Number(process.env.PROBE_TIMEOUT_MS);
if (!timeoutMs) throw new Error("PROBE_TIMEOUT_MS is not set");

const targets = process.argv.slice(2);
if (targets.length === 0) throw new Error("Give at least one host:port to probe");

for (const target of targets) {
  const [host, port] = target.split(":");
  const started = Date.now();
  const result = await new Promise((done) => {
    const socket = net.connect({ host, port: Number(port), timeout: timeoutMs });
    socket.on("connect", () => { socket.destroy(); done("connected"); });
    socket.on("timeout", () => { socket.destroy(); done("ETIMEDOUT (no answer at all)"); });
    socket.on("error", (err) => done(err.code));
  });
  console.log(\`\${target.padEnd(28)} \${String(Date.now() - started).padStart(5)} ms  \${result}\`);
}

// চারটা ফলাফল ঘটাতে: খোলা Port (443 বা 22), deny করা Port, reject করা Port,
// আর একটা অস্তিত্বহীন নাম। একই Network এ খালি একটা ঠিকানা দিলে EHOSTUNREACH ও দেখবেন।`,
      },
    ],
    tip: "পরীক্ষা ৩ আর ৪ পাশাপাশি রেখে একটা ছোট টেবিল বানান: Port, Firewall এর অবস্থা, App কোন দরজায়, আর nc কী বলল। চারটা সারি হবে, আর প্রতিটা সারির উত্তর আলাদা। এই টেবিলটা যদি আপনি না দেখে আবার বানাতে পারেন, তাহলে Production এর বেশিরভাগ Port এর রহস্য আপনার কাছে আর রহস্য থাকবে না। কারণ রাত দুইটায় আসা প্রায় প্রতিটা Network এর অভিযোগ শেষ পর্যন্ত এই চারটা সারির একটায় গিয়ে পড়ে।",
  },
  assignment: {
    title: "Mini Project: my-tours এর জন্য Network এর পরিচয়পত্র আর একটা পরীক্ষার Script",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>Server এর Network পরিচয়পত্র:</strong> নিজের practice server বা VPS
        এর জন্য এক পাতার একটা দলিল লিখুন। তাতে থাকবে: ঠিকানা আর Gateway, Resolver,
        আর <code>sudo ss -tlnp</code> ও <code>sudo ss -ulnp</code> এর প্রতিটা লাইন, সাথে
        তিনটা ঘর, Process আর User, ভেতরের না বাইরের, আর বাইরের হলে কেন। এমন কিছু
        পেলে যার কারণ আপনি জানেন না, সেটা খুঁজে বের করুন আর দরকার না থাকলে থামিয়ে দিন।
      </span>,
      <span key="2">
        <strong>সঙ্গীর সাথে ভাঙা আর খোঁজা:</strong> একজন সঙ্গীকে আপনার practice
        server এ নিচের পাঁচটার যেকোনো একটা গোপনে ঘটাতে বলুন: App থামানো, ufw থেকে 443
        এর Rule মোছা, App এর PORT বদলানো, /etc/hosts এ একটা ভুল লাইন, Caddy থামানো।
        আপনি শুধু এই লেসনের দশ ধাপ মেনে খুঁজবেন। প্রতিটা কমান্ড আর তার Output লিখে
        রাখুন, আর বলুন প্রথম কোন পরীক্ষা লাল হয়েছিল। তিনবার করুন, প্রতিবার আলাদা দোষ।
      </span>,
      <span key="3">
        <strong>netcheck.sh লিখুন:</strong> একটা Bash Script, যেটা Laptop থেকে চলে আর
        দুইটা Environment Variable পড়ে, <code>CHECK_DOMAIN</code> আর{" "}
        <code>CHECK_IP</code>; কোনোটা না থাকলে পরিষ্কার বার্তা দিয়ে থামে, কোনো
        Default মান ছাড়া। Script টা পাঁচটা স্তর পরীক্ষা করে প্রতিটার পাশে PASS বা FAIL
        লিখবে: dig এর উত্তর CHECK_IP এর সাথে মেলে কি না, nc দিয়ে 443, openssl এর
        Verification, curl এর Status, আর curl এর <code>-w</code> দিয়ে মোট সময়। প্রথম
        FAIL এ থেমে বলবে কোন স্তর। example.com আর একটা বন্ধ Port দিয়ে দুইবার চালিয়ে
        দুইটা Output জমা দিন।
      </span>,
      <span key="4">
        <strong>tcpdump এর প্রমাণপত্র:</strong> নিজের Server এ তিনটা Capture নিন:
        deny করা Port, reject করা Port, আর খোলা Port এ একটা পুরো Connection। প্রতিটা
        Output এর প্রতিটা লাইনের পাশে এক লাইনে লিখুন কে কাকে কী পাঠাল আর কেন। শেষে দুই
        লাইনে লিখুন, Laptop timed out বললে tcpdump এ SYN দেখা যাওয়া আর না যাওয়ার
        মানে কী।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন নতুন সদস্য রাত এগারোটায়
        লিখলেন, সাইট খুলছে না, আমি সব Restart করে দিচ্ছি। তাঁকে দশ লাইনে বোঝান কেন আগে
        খোঁজা দরকার, পাঁচটা স্তর কী কী, refused আর timed out এর পার্থক্য কী আর কেন সেটা
        অর্ধেক মানচিত্র বাদ দেয়, আর 502 দেখলে প্রথম কোন কমান্ড।
      </span>,
    ],
    deliverables: [
      <span key="1">Server এর Network পরিচয়পত্র, প্রতিটা খোলা Socket এর কারণ সহ</span>,
      <span key="2">তিনটা খোঁজার খাতা: কমান্ড, Output আর প্রথম লাল পরীক্ষা</span>,
      <span key="3">netcheck.sh আর তার দুইটা Output</span>,
      <span key="4">তিনটা tcpdump Capture, লাইন ধরে ব্যাখ্যা সহ</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
