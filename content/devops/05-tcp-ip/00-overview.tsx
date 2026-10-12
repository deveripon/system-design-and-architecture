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

export const tcpIpOverviewContent: TopicData = {
  id: "tcp-ip-overview",
  introduction: {
    badge: "MODULE 05 · OVERVIEW",
    title: <SectionTitle>ঠিকানা পাওয়া গেল, এবার কথাটা পৌঁছাবে কীভাবে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের মডিউল শেষে আপনি একটা নামকে ঠিকানায় বদলাতে শিখেছেন। পর্যটক
          islandtours.example লিখলেন, DNS বলে দিল Server এর ঠিকানা 103.94.135.2।
          কিন্তু ঠিকানা জানা আর কথা পৌঁছানো এক জিনিস নয়। বন্ধুর বাসার ঠিকানা জানলেই
          তাঁর সাথে কথা হয়ে যায় না, কাউকে গিয়ে দরজায় টোকা দিতে হয়, ভেতর থেকে কাউকে
          সাড়া দিতে হয়, তারপর কথা চলে, আর শেষে বিদায় নিতে হয়।
        </ContentParagraph>
        <ContentParagraph>
          এই মডিউল ঠিক সেই অংশটা নিয়ে। ঠিকানা হাতে পাওয়ার পর থেকে Server এর ঠিক
          Program টার হাতে আপনার বুকিংয়ের প্রতিটা Byte নির্ভুল পৌঁছানো পর্যন্ত যা যা
          ঘটে, তার সবটা। এটা Internet এর সেই স্তর, যা প্রতিটা Request এ কাজ করে
          অথচ ভালো চললে কারো চোখে পড়ে না, আর খারাপ চললে এমন Error দেখায় যা প্রথমবার
          পড়ে কিছুই বোঝা যায় না।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা কোনো লেসন নয়, এটা মডিউলের মানচিত্র। এখানে আপনি জানবেন এই
          মডিউল কেন আছে, আটটা লেসনে কী কী শিখবেন, কেন শেখাটা জরুরি, কাজের জায়গায়
          কোথায় কোথায় লাগবে, আর বাস্তবে কীভাবে ব্যবহার করবেন। নতুন কোনো শব্দ দেখলে
          ঘাবড়াবেন না, এখানে শুধু নামটা শুনিয়ে রাখা হচ্ছে, বোঝানোর কাজটা করবে
          নির্দিষ্ট লেসন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ঠিকানা জানা মানে রাস্তাটা চেনা। কিন্তু মাল গুছিয়ে পাঠানো, পথে হারালে আবার পাঠানো, ঠিক মানুষের হাতে তুলে দেওয়া আর শেষে হিসাব মিলিয়ে বিদায় নেওয়া, এই কাজগুলো রাস্তা করে না। এগুলো করে এমন একজন, যাকে আপনি কখনো দেখেননি।",
      author: "TCP/IP & Transport Layer",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>সাইট খুলছে না, আর আপনি জানেন না কোথায় তাকাবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা দৃশ্য ভাবুন। আপনি নিজের App একটা Server এ তুলেছেন। নিজের
                ল্যাপটপে সব চলছিল। এখন Browser এ Server এর ঠিকানা লিখলেন, আর পাতাটা
                শুধু ঘুরছে, ঘুরছে, তারপর একটা Error। DNS ঠিক আছে, আগের মডিউলে শেখা
                dig দিয়ে আপনি নিজেই দেখে নিয়েছেন। App ও চালু, Server এ ঢুকে আপনি
                দেখেছেন। তাহলে সমস্যা কোথায়?
              </ContentParagraph>
              <ContentParagraph>
                আপনি Terminal এ একটা পরীক্ষা চালালেন, আর উত্তর এলো
                Connection refused। পরদিন আরেকটা Server এ একই পরীক্ষায় কোনো উত্তরই
                এলো না, অনেকক্ষণ পরে শুধু লিখল timed out। দুইটাই মানে কাজ হয়নি।
                কিন্তু এই দুইটা বার্তা দুইটা সম্পূর্ণ আলাদা সমস্যার কথা বলছে, আর
                সমাধানও দুই জায়গায়। একটায় দোষ আপনার App এর, অন্যটায় মাঝখানের একটা
                পাহারাদারের। যিনি এই মডিউল জানেন, তিনি বার্তাটা পড়েই বলে দিতে পারেন
                কোনটা। যিনি জানেন না, তিনি সব কিছু এলোমেলো Restart করতে থাকেন।
              </ContentParagraph>
              <ContentParagraph>
                এরকম আরও অনেক মুহূর্ত আছে, যেগুলো এই মডিউল ছাড়া রহস্যই থেকে যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  App চালু করতে গেলে লিখছে address already in use, অথচ আপনি
                  এইমাত্র আগেরটা বন্ধ করেছেন।
                </ListItem>
                <ListItem>
                  ল্যাপটপে App খুলছে, কিন্তু একই Wi-Fi এর ফোন থেকে খুলছে না।
                </ListItem>
                <ListItem>
                  দিনে কয়েকবার, কোনো নিয়ম ছাড়া, কিছু পর্যটক 502 দেখছেন, আর Log এ
                  লেখা ECONNRESET।
                </ListItem>
                <ListItem>
                  ছোট পাতা খুলছে, কিন্তু বড় ফাইল পাঠাতে গেলেই আটকে যাচ্ছে, তাও শুধু
                  VPN চালু থাকলে।
                </ListItem>
                <ListItem>
                  Cloud এর Dashboard জিজ্ঞেস করছে, আপনি Layer 4 Load Balancer চান
                  নাকি Layer 7, আর আপনি জানেন না সংখ্যা দুইটা কীসের।
                </ListItem>
                <ListItem>
                  Deploy করার ঠিক মুহূর্তে যাঁরা বুকিং করছিলেন, তাঁদের কয়েকজনের
                  বুকিং মাঝপথে হারিয়ে যাচ্ছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই ছয়টা সমস্যার একটাও আপনার Code এর Logic এ নয়। ছয়টাই ঘটে আপনার Code
                আর তারের মাঝখানের জায়গায়, যেখানে Operating System আপনার হয়ে চুপচাপ
                অনেক কাজ করে দেয়। এই মডিউল সেই জায়গাটার আলো জ্বালায়। শেষ করার পর
                উপরের প্রতিটা লাইন পড়ে আপনি জানবেন কী ঘটছে, কোন Command দিয়ে নিশ্চিত
                হবেন, আর কোথায় হাত দিলে ঠিক হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "উপরের শব্দগুলো এখন না বুঝলে কোনো সমস্যা নেই",
          content: (
            <p>
              Connection refused, ECONNRESET, Layer 4, এই শব্দগুলো এখানে ইচ্ছা করেই
              ব্যাখ্যা ছাড়া রাখা হয়েছে। এগুলো হলো সেই দরজা, যেগুলোর সামনে আপনি
              একদিন দাঁড়াবেনই। এই মডিউলের প্রতিটা লেসন এরকম একটা বা দুইটা দরজা খুলে
              দেয়। মডিউল শেষে এই পাতায় ফিরে এসে তালিকাটা আবার পড়বেন, দেখবেন
              প্রতিটা লাইন তখন পরিচিত লাগছে।
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
                একটা কুরিয়ার কোম্পানির কথা ভাবুন। আপনি শুধু পার্সেলটা কাউন্টারে
                দেন। এরপর একজন সেটা মাপমতো বাক্সে ভরেন, একজন গায়ে ঠিকানা লেখেন,
                একজন ট্রাকে তোলেন, পথে ট্রাক বদলায়, আর শেষে একজন ঠিক মানুষটার হাতে
                তুলে দিয়ে সই নেন। পথে একটা বাক্স হারালে কোম্পানি নিজেই আবার পাঠায়,
                আপনাকে জানতেও হয় না। প্রত্যেকে শুধু নিজের কাজটুকু জানেন, আর এই ভাগ
                করা কাজের জোরেই পার্সেল পৌঁছায়।
              </ContentParagraph>
              <ContentParagraph>
                Internet এ Data ঠিক এভাবেই যায়। কাজটা কয়েকটা ধাপে ভাগ করা, যাদের
                বলে Layer। আপনার Program শুধু বলে, এই কথাটা ওই ঠিকানায় পাঠাও। এরপর
                নিচের Layer গুলো কথাটা ছোট টুকরোয় কাটে, প্রতিটায় নম্বর বসায়, ঠিকানা
                লেখে, তারে ছাড়ে, হারালে আবার পাঠায়, আর ওপাশে ঠিক ক্রমে জোড়া লাগিয়ে
                ঠিক Program টার হাতে দেয়। এই পুরো ব্যবস্থার নাম TCP/IP, আর যে Layer
                টা ঠিক Program এর হাতে নির্ভুল পৌঁছে দেওয়ার দায়িত্ব নেয়, তার নাম
                Transport Layer। মডিউলের নামটা এখান থেকেই।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে পুরো মডিউল এক কথায় এই। ঠিকানা জানার পর দুইটা Program এর মধ্যে
                একটা কথা কীভাবে নির্ভুল পৌঁছায়, কে কোন কাজটা করে, আর কোন ধাপ ভাঙলে
                কী দেখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিল, এই মডিউল কী যোগ করে, পরেরটা কী চায়"
              caption="তিনটা মডিউল একটা শিকলের তিনটা আংটা। আগের মডিউল DNS আপনাকে একটা নাম থেকে একটা ঠিকানা এনে দিয়েছে, কিন্তু সেখানেই থেমে গেছে। এই মডিউল সেই ঠিকানা ধরে একটা নির্ভরযোগ্য লাইন খোলে, তার ভেতর দিয়ে Byte পাঠায় আর শেষে লাইনটা ভদ্রভাবে বন্ধ করে। পরের মডিউল HTTP & HTTPS ধরে নেয় এই লাইনটা আছে আর ঠিকঠাক কাজ করে, তারপর শেখায় লাইনের ভেতর দিয়ে Browser আর Server আসলে কোন ভাষায় কথা বলে। তাই এই মডিউল না বুঝলে পরের মডিউলের অনেক কথা, যেমন Connection খোলা রাখা বা HTTPS এর বাড়তি সময়, শূন্যে ঝুলে থাকবে।"
              before={{
                tag: "Module 04",
                title: "DNS",
                lines: ["নাম থেকে ঠিকানা", "কোন Server এ যেতে হবে", "এখানেই তার কাজ শেষ"],
              }}
              current={{
                tag: "Module 05",
                title: "TCP/IP & Transport",
                lines: ["ঠিকানা ধরে লাইন খোলা", "Byte নির্ভুল পৌঁছানো", "ঠিক Program এর হাতে দেওয়া"],
              }}
              after={{
                tag: "Module 06",
                title: "HTTP & HTTPS",
                lines: ["লাইনের ভেতরের ভাষা", "Request আর Response", "তালা দেওয়া লাইন, HTTPS"],
              }}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের মডিউলগুলোর সাথে এর সম্পর্কটাও এখানে বলে রাখা ভালো, কারণ এই
                মডিউল আসলে নতুন কিছু শুরু করে না, আগের টুকরোগুলোকে জোড়া লাগায়।
                Module 02 তে আপনি শুনেছিলেন Data ছোট ছোট Packet এ ভাগ হয়, ক্রম
                ভাঙতে পারে, একটা হারাতেও পারে, তবু ফাইল ঠিক থাকে। কীভাবে ঠিক থাকে,
                সেটা তখন বলা হয়নি। সেখানেই শুনেছিলেন Port মানে ফ্ল্যাটের নম্বর আর
                Socket মানে হাতে ধরা টেলিফোন। Module 03 এ দেখেছেন MAC Address, IP
                Address, Gateway আর NAT। প্রতিটা আলাদা লেসনে, আলাদা টুকরো হিসেবে।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউলে সেই সব টুকরো এক ছবিতে বসে। আপনি দেখবেন MAC, IP আর Port
                আসলে তিনটা আলাদা Layer এর তিনটা আলাদা ঠিকানা, কেন তিনটাই লাগে, আর
                একটা বুকিংয়ের Data ফোন থেকে Server পর্যন্ত যেতে কোন ঠিকানা কোথায়
                বদলায় আর কোনটা শেষ পর্যন্ত একই থাকে। আগে যা আলাদা আলাদা তথ্য ছিল, তা
                একটা যুক্তির শিকল হয়ে যাবে।
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
      title: <SectionTitle>আটটা লেসন, আটটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। নিচে আটটা লেসন আর তাদের প্রশ্ন।
              যেকোনোটায় চাপ দিলে সরাসরি সেই লেসনে চলে যাবেন, তবে প্রথমবার ক্রম
              ধরে পড়াই ভালো, কারণ প্রতিটা লেসন আগেরটার উপর দাঁড়িয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              moduleId="tcp-ip"
              questions={{
                "osi-model":
                  "এত বড় কাজটা কেন কয়েকটা Layer এ ভাগ করা, আর সাতটা Layer এর কোনটা কী করে?",
                "tcp-ip-model":
                  "বাস্তবে আপনার যন্ত্রে কোন চারটা Layer সত্যিই চলে, আর কোনটা কোথায় বসে থাকে?",
                "tcp-deep-dive":
                  "যে রাস্তা কোনো কথাই দেয় না, তার উপর দিয়ে TCP কীভাবে নির্ভুল ডেলিভারি দেয়?",
                "udp-deep-dive":
                  "যে Protocol কিছুই কথা দেয় না, তাকে DNS, ভিডিও কল আর গেম কেন বেছে নেয়?",
                "three-way-handshake":
                  "কথা শুরুর আগে দুই পক্ষ কীভাবে হাত মেলায়, আর না মিললে কোন তিন রকম ছবি দেখা যায়?",
                "packet-segment-frame":
                  "একই Data প্রতিটা Layer এ কোন নামে, কোন মোড়কে যায়, আর পথে কোন মোড়ক বদলায়?",
                "port-and-socket":
                  "একটাই ঠিকানা আর একটাই Port 443 দিয়ে একটা Server হাজারজনকে আলাদা রাখে কীভাবে?",
                "connection-close":
                  "কথা শেষে লাইনটা ভদ্রভাবে কীভাবে বন্ধ হয়, আর হঠাৎ কেটে গেলে কী দেখা যায়?",
              }}
              footer="আটটা লেসন তিন ভাগে পড়লে মনে রাখা সহজ। প্রথম দুইটা হলো মানচিত্র, কাজটা কীভাবে ভাগ করা। মাঝের দুইটা হলো দুই রকম বাহক, TCP আর UDP। শেষ চারটা হলো একটা Connection এর জীবন, জন্ম থেকে বিদায়, আর তার ভেতরের মোড়ক ও দরজা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একই আটটা লেসন একটা গল্প হিসেবে শুনুন, যাতে বোঝা যায় কোনটা
                কোনটার জন্য পথ তৈরি করে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>লেসন ১, OSI Model:</strong> শুরুতেই একটা মানচিত্র হাতে
                  পাবেন। Data পাঠানোর কাজটা এত বড় যে সেটা সাতটা তলায় ভাগ করা, আর
                  প্রতিটা তলা শুধু নিজের কাজ জানে। এই লেসনে আপনি সাতটা তলা এক এক
                  করে চিনবেন, কোন যন্ত্র কোন তলায় কাজ করে তা জানবেন, আর কাজের
                  জায়গায় Layer 4 বা Layer 7 শুনলে কী বোঝায় তা ধরতে পারবেন। সবচেয়ে
                  কাজের জিনিসটাও এখানে, সাইট না খুললে নিচের তলা থেকে উপরে উঠে উঠে
                  খোঁজার অভ্যাস।
                </ListItem>
                <ListItem>
                  <strong>লেসন ২, TCP/IP Model:</strong> মানচিত্র দেখার পর আসল
                  রাস্তায় নামবেন। সাত তলার নকশাটা বোঝার জন্য, কিন্তু আপনার যন্ত্রে
                  সত্যিই যা চলে তা চার Layer। এই লেসন দেখায় কোন Layer আপনার
                  Program এর ভেতরে, কোনটা Operating System এর Kernel এ, কোনটা
                  Network Card এ, আর একটা Request কীভাবে চার ধাপ নিচে নেমে ওপাশে
                  চার ধাপ উপরে ওঠে। এরপর থেকে বাকি সব লেসন এই চার Layer এর কোনো
                  একটার ভেতরে ঢোকে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৩, TCP Deep Dive:</strong> এবার সবচেয়ে গুরুত্বপূর্ণ
                  বাহকটা। নিচের রাস্তা কোনো কথা দেয় না, Packet হারায়, আগে পরে
                  পৌঁছায়। তার উপর বসে TCP প্রতিটা Byte এ নম্বর দেয়, প্রাপ্তির রসিদ
                  নেয়, হারালে আবার পাঠায়, আর ওপাশ বা রাস্তা যতটুকু নিতে পারে ততটুকুই
                  পাঠায়। Module 02 তে যে প্রশ্নটা ঝুলে ছিল, একটা Packet হারিয়েও ফাইল
                  ঠিক থাকে কীভাবে, তার পুরো উত্তর এখানে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৪, UDP Deep Dive:</strong> TCP এত কিছু করে দেখার
                  পর স্বাভাবিক প্রশ্ন আসে, তাহলে সবাই TCP ই নেয় না কেন। এই লেসন
                  উল্টো দিকটা দেখায়। UDP প্রায় কিছুই করে না, আর ঠিক সেই কারণেই DNS,
                  ভিডিও কল আর গেম তাকে চায়। আগের মডিউলে যে dig চালিয়েছিলেন, সেটা
                  কেন UDP তে যায় আর কখন TCP তে পালায়, সেটাও এখানে মিলবে। এই দুই
                  লেসন পাশাপাশি পড়লে যেকোনো কাজে কোনটা নেবেন সেই সিদ্ধান্ত নিতে
                  পারবেন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৫, Three-way Handshake:</strong> TCP তে কথা শুরুর
                  আগে দুই পক্ষ তিনটা ছোট বার্তায় হাত মেলায়। লেসন ৩ এ এটা শুধু এক
                  ঝলক দেখানো হয়, এখানে পুরোটা। সাথে শিখবেন Connection না হলে যে
                  তিনটা আলাদা ছবি দেখা যায়, আর প্রতিটার মানে কী। উপরে বলা
                  Connection refused আর timed out এর তফাতটা এই লেসনেই খোলে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৬, Packet, Segment, and Frame:</strong> এতক্ষণ আপনি
                  Packet, Segment, Frame তিনটা শব্দই শুনেছেন, প্রায় একই অর্থে। এই
                  লেসন বলে দেয় কোনটা কোন Layer এর নাম, নিচে নামার সময় কীভাবে একটার
                  উপর আরেকটা মোড়ক চড়ে, আর পথের প্রতিটা Router এ কোন মোড়ক ছিঁড়ে
                  নতুন হয় আর কোনটা শেষ পর্যন্ত অক্ষত থাকে। Module 03 এর MAC, ARP,
                  Gateway আর NAT এখানে এসে এক ছবিতে বসে। একটা মোড়কে কতটুকু ধরে,
                  সেই মাপের হিসাবও এখানে, যা VPN এর অদ্ভুত সমস্যাগুলো বোঝায়।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৭, Port & Socket:</strong> Module 02 তে Port ছিল
                  ফ্ল্যাটের নম্বর আর Socket ছিল হাতে ধরা টেলিফোন। এবার সেই ছবিটা
                  পূর্ণ হয়। একটাই Port 443 এ হাজারজন একসাথে কীভাবে কথা বলে, App
                  কোন ঠিকানায় কান পেতে থাকলে বাইরে থেকে পাওয়া যায় আর কোনটায় যায়
                  না, address already in use এলে দখলদারকে কীভাবে খুঁজবেন, আর
                  Firewall এ Port খোলা মানে আসলে কী।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৮, Connection Close:</strong> শেষ লেসন বিদায় নিয়ে।
                  কথা শেষে দুই পক্ষ কীভাবে ভদ্রভাবে লাইন রাখে, লাইন হঠাৎ কেটে গেলে
                  কোন Error আসে, চুপ থাকা লাইনকে মাঝপথে কারা মেরে ফেলে, আর Server
                  থামানোর সময় একটা বুকিংও নষ্ট না করার উপায়। এই লেসনের শেষে পুরো
                  মডিউলটা একটা বুকিংয়ের গল্প হিসেবে আবার বলা হয়, শুরু থেকে শেষ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আটটা লেসনেই একই দৃশ্য চলে, যাতে সব কিছু একটার সাথে আরেকটা মেলে।
                ঢাকার একজন পর্যটক ফোনে Island Tours খুলে একটা নৌকার আসন বুক করছেন।
                ফোনের ঠিকানা 192.168.1.20, বাসার Router এর বাইরের ঠিকানা
                203.0.113.25, আর Server 103.94.135.2 এর Port 443। প্রতিটা লেসন এই
                একই বুকিংকে নিজের দিক থেকে দেখে। তাই শেষ লেসনে পৌঁছে আপনার মাথায়
                আটটা আলাদা বিষয় থাকবে না, থাকবে একটাই যাত্রা, আট দিক থেকে দেখা।
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
      title: <SectionTitle>Framework তো সব করে দেয়, তবু কেন শিখব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রশ্নটা ন্যায্য। আপনি কখনো নিজে হাতে Byte এ নম্বর বসাবেন না, হারানো
                টুকরো আবার পাঠাবেন না। Operating System এই সব কাজ করে দেয়, আর
                Node.js বা Browser তার উপরে আরও এক স্তর আড়াল দেয়। তাহলে এত গভীরে
                যাওয়ার দরকার কী?
              </ContentParagraph>
              <ContentParagraph>
                সৎ উত্তর হলো, যতদিন সব ঠিক চলে ততদিন দরকার নেই। দরকার পড়ে যেদিন
                কিছু ভাঙে। আর এই স্তরের সমস্যাগুলোর একটা বিশেষ স্বভাব আছে, এরা
                নিজের নাম বলে না। আপনার Code এ ভুল থাকলে একটা লাইন নম্বর সহ Error
                আসে। এই স্তরে ভুল হলে আসে শুধু একটা ছোট শব্দ, যেমন ECONNRESET, অথবা
                কিছুই আসে না, শুধু অপেক্ষা। শব্দটার মানে না জানলে আপনি অনুমান করতে
                থাকবেন, আর অনুমানে ঘণ্টার পর ঘণ্টা যায়।
              </ContentParagraph>
              <ContentParagraph>
                না শিখলে পরে যা যা দাম দিতে হয়, সেগুলো এরকম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পরের মডিউলগুলো ভিত ছাড়া দাঁড়াবে:</strong> Module 06 এ
                  HTTP কেন একটা Connection খোলা রেখে বারবার ব্যবহার করে, HTTPS এ
                  প্রথমবার কেন একটু বেশি সময় লাগে, WebSocket কী, এসবই এই মডিউলের
                  Connection ধারণার উপর দাঁড়ানো। Linux এর মডিউলে Firewall আর Port
                  খোলা, Docker এর মডিউলে Port বাইরে আনা, Reverse Proxy আর Load
                  Balancer এর মডিউলে Timeout আর 502, Database এর মডিউলে Connection
                  Pool, সব জায়গায় এই মডিউলের শব্দ ফিরে আসবে।
                </ListItem>
                <ListItem>
                  <strong>Error পড়ে সমস্যা চেনা যাবে না:</strong> refused, timed
                  out, reset, broken pipe, address in use, এগুলো পাঁচটা আলাদা
                  গল্প। প্রতিটা বলে দেয় সমস্যাটা কোন পক্ষে আর কোন ধাপে। এই মডিউল
                  ছাড়া সবগুলোই শুধু কাজ করছে না।
                </ListItem>
                <ListItem>
                  <strong>Cloud এর সেটিং অন্ধের মতো বাছতে হবে:</strong> Security
                  Group এ কোন Port খুলবেন, Load Balancer এর Idle Timeout কত রাখবেন,
                  Health Check TCP হবে না HTTP, এই প্রশ্নগুলো প্রতিটা Cloud
                  Dashboard এ আছে। না বুঝে বাছলে কখনো সাইট বন্ধ থাকে, কখনো
                  Database পুরো Internet এর সামনে খোলা পড়ে থাকে।
                </ListItem>
                <ListItem>
                  <strong>গতির সমস্যা ভুল জায়গায় খুঁজবেন:</strong> একটা পাতা ধীর
                  হলে সময়টা কোথায় যাচ্ছে, নাম খোঁজায়, লাইন খোলায়, নাকি Server এর
                  ভাবনায়, তা আলাদা করে মাপা যায়। মাপতে না জানলে মানুষ Code
                  Optimize করে, অথচ সময়টা যাচ্ছিল বারবার নতুন করে লাইন খোলায়।
                </ListItem>
                <ListItem>
                  <strong>অন্যকে বোঝাতে পারবেন না:</strong> দলের নতুন কেউ, কোনো
                  গ্রাহক বা Interview এর প্রশ্নকর্তা জিজ্ঞেস করলে, Browser এ একটা
                  ঠিকানা লিখে Enter চাপলে কী হয়, এই মডিউল ছাড়া উত্তরের মাঝখানটা
                  ফাঁকা থেকে যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই মডিউল কয়েকটা প্রচলিত ভুল ধারণাও সরিয়ে দেয়, যেগুলো অনেকে বছরের পর
                বছর বয়ে বেড়ান।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ভুল ধারণা, এক Port এ একবারে একজনই ঢুকতে পারে:</strong>{" "}
                  তাহলে Port 443 এ একসাথে হাজারজন থাকতেন না। আসল নিয়মটা লেসন ৭ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, TCP তে একবার পাঠানো মানে ওপাশে একবারে
                  পাওয়া:</strong> TCP বার্তা চেনে না, চেনে শুধু Byte এর স্রোত। এই
                  ভুলটা Backend Code এ এমন Bug আনে যা নিজের মেশিনে কখনো ধরা পড়ে না।
                  লেসন ৩ এ নিজের চোখে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, UDP মানে খারাপ বা পুরনো:</strong> আজকের
                  সবচেয়ে নতুন Web Protocol টা UDP র উপরেই বানানো। কেন, তা লেসন ৪ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, সাইট না খুললে সবই Network এর দোষ:</strong>{" "}
                  Layer ধরে ধরে পরীক্ষা করলে দুই মিনিটে বলা যায় দোষটা তারের, পথের,
                  পাহারাদারের, নাকি আপনার App এর।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, OSI র সাত Layer মুখস্থ করাই শেখা:</strong>{" "}
                  মুখস্থ করে লাভ নেই। লাভ হয় যখন একটা সমস্যা দেখে বলতে পারেন এটা
                  কোন Layer এ, আর তাই কাকে জিজ্ঞেস করতে হবে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "পুরো মডিউলে একটাই ধারণা ধরে রাখুন",
          content: (
            <p>
              প্রতিটা Layer শুধু নিজের একটা কাজ করে, নিজের একটা ঠিকানা ব্যবহার করে,
              আর নিজের একটা মোড়ক চড়ায়। তাই যেকোনো সমস্যায় প্রথম প্রশ্ন সবসময় একই,
              এটা কোন Layer এর কাজ ছিল। এই একটা প্রশ্ন করতে শিখলে বাকি সব কিছু,
              কোন Command চালাবেন, কোন Error এর কী মানে, কোন সেটিং কোথায়, নিজে
              থেকেই জায়গায় বসে যায়। আটটা লেসন আসলে এই এক প্রশ্নের আট রকম অনুশীলন।
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
              নিচে ছয়টা সত্যিকারের মুহূর্ত, যেগুলো একজন Developer বা DevOps
              Engineer এর কাজে বারবার আসে। একটা একটা করে বেছে দেখুন, এই মডিউল না
              জানলে সেই মুহূর্তটা কেমন যায়, আর জানলে কেমন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "refused-vs-timeout",
                  label: "Deploy এর পর সাইট খুলছে না",
                  situation:
                    "আপনি নতুন Server এ App তুলেছেন। Browser এ খুলছে না। Terminal থেকে পরীক্ষা করলে একটা Server এ সাথে সাথে উত্তর আসে Connection refused, আরেকটায় অনেকক্ষণ কিছুই আসে না, শেষে timed out।",
                  without:
                    "দুইটাকেই একই সমস্যা ভেবে App Restart করেন, তারপর Server Restart করেন, তারপর DNS সন্দেহ করেন। ঘণ্টাখানেক পরে কাকতালীয়ভাবে ঠিক হয়, কিন্তু কেন হলো তা জানা হয় না।",
                  withIt:
                    "প্রথম বার্তা পড়েই জানেন, যন্ত্র পর্যন্ত পৌঁছানো গেছে, কিন্তু ওই Port এ কেউ কান পেতে নেই, তাই দেখতে হবে App চালু কি না আর কোন ঠিকানায় বসেছে। দ্বিতীয়টায় জানেন মাঝপথে কেউ চুপচাপ ফেলে দিচ্ছে, তাই সোজা Firewall বা Security Group এ যান।",
                  lessons: ["Three-way Handshake", "Port & Socket", "OSI Model"],
                },
                {
                  id: "bind-address",
                  label: "ল্যাপটপে চলে, ফোন থেকে চলে না",
                  situation:
                    "আপনার App ল্যাপটপের Browser এ localhost দিয়ে সুন্দর খুলছে। একই Wi-Fi এর ফোন থেকে ল্যাপটপের IP দিয়ে খুলতে গেলে খুলছে না। Docker এ তুললেও একই ঘটনা।",
                  without:
                    "Wi-Fi, Router আর ফোনকে দোষ দেন। শেষে কারো কাছ থেকে একটা সেটিং নকল করে বসান, যা কাজ করে, কিন্তু Production এ সেই একই সেটিং Database কে সবার সামনে খুলে দেয়।",
                  withIt:
                    "জানেন একটা Program কোন ঠিকানায় কান পেতে আছে সেটা আলাদা একটা সিদ্ধান্ত, আর শুধু নিজের যন্ত্রের ভেতরের ঠিকানায় বসলে বাইরে থেকে কেউ পাবে না। একটা Command এ দেখে নেন App কোথায় বসেছে, আর বুঝে ঠিক করেন কোনটা বাইরে খোলা থাকবে, কোনটা নয়।",
                  lessons: ["Port & Socket", "TCP/IP Model"],
                },
                {
                  id: "random-502",
                  label: "মাঝে মাঝে 502, কোনো নিয়ম নেই",
                  situation:
                    "Island Tours এ দিনে কয়েকবার কিছু পর্যটক 502 দেখছেন। আবার চেষ্টা করলে ঠিক। Server এর CPU, Memory সব স্বাভাবিক। Log এ শুধু একটা শব্দ, ECONNRESET।",
                  without:
                    "সমস্যাটা আবার ঘটানো যায় না বলে সপ্তাহের পর সপ্তাহ পড়ে থাকে। কেউ Server বড় করেন, কেউ Code এ Retry বসান, আসল কারণ থেকে যায়।",
                  withIt:
                    "জানেন চুপ করে থাকা একটা লাইনকে দুই পাশের দুই যন্ত্র দুই আলাদা সময়ে বন্ধ করে দিতে পারে। একজন যখন লাইনটা বন্ধ করছে, ঠিক সেই মুহূর্তে অন্যজন তাতে নতুন Request পাঠালে এই Error আসে। দুই জায়গার দুইটা Timeout মিলিয়ে দেখেন, আর একটা সংখ্যা বদলে সমস্যা শেষ।",
                  lessons: ["Connection Close", "TCP Deep Dive"],
                },
                {
                  id: "mtu-vpn",
                  label: "ছোট Request যায়, বড়টা আটকে যায়",
                  situation:
                    "অফিসের VPN চালু থাকলে Server এ ঢোকা যায়, ছোট পাতাও খোলে। কিন্তু বড় ফাইল পাঠাতে বা বড় উত্তর আনতে গেলেই সব থমকে যায়। VPN বন্ধ করলে সব ঠিক।",
                  without:
                    "ধরে নেন VPN ধীর, অথবা Server এর সমস্যা। ছোট জিনিস কেন যায় আর বড় কেন যায় না, তার কোনো ব্যাখ্যা মাথায় আসে না।",
                  withIt:
                    "জানেন প্রতিটা রাস্তায় একটা মোড়কে কতটুকু ধরবে তার একটা সীমা আছে, আর VPN নিজের একটা বাড়তি মোড়ক চড়িয়ে সেই জায়গা কমিয়ে দেয়। একটা ping পরীক্ষায় পথের সবচেয়ে সরু জায়গার মাপ বের করেন, আর ঠিক কোন সেটিং বদলাতে হবে তা বলে দিতে পারেন।",
                  lessons: ["Packet, Segment, and Frame", "TCP Deep Dive"],
                },
                {
                  id: "l4-l7",
                  label: "Layer 4 নাকি Layer 7",
                  situation:
                    "Cloud এ Load Balancer বানাতে গেলে প্রথম প্রশ্নই আসে, Network Load Balancer নেবেন নাকি Application Load Balancer। সভায় একজন বললেন, আমাদের Layer 7 লাগবে, কারণ URL দেখে ভাগ করতে হবে।",
                  without:
                    "সংখ্যা দুইটা মুখস্থ শব্দ হয়ে থাকে। যেটার দাম কম সেটা বাছেন, পরে দেখেন যা দরকার ছিল সেটা ওটা দিয়ে হয়ই না।",
                  withIt:
                    "জানেন সংখ্যাটা বলে দেয় যন্ত্রটা মোড়কের কত ভেতর পর্যন্ত খুলে দেখে। শুধু Port পর্যন্ত দেখলে সে দ্রুত কিন্তু URL চেনে না, পুরোটা খুললে সে URL, Header সব দেখে সিদ্ধান্ত নিতে পারে। নিজের দরকার মিলিয়ে বেছে নেন, আর সভায় কারণটাও বলতে পারেন।",
                  lessons: ["OSI Model", "TCP/IP Model"],
                },
                {
                  id: "restart",
                  label: "Restart এ বুকিং হারাচ্ছে",
                  situation:
                    "দুপুরে নতুন Version তুললেন। ঠিক সেই কয়েক সেকেন্ডে যাঁরা Pay চেপেছিলেন, তাঁদের কয়েকজন Error পেলেন। আর Server আবার চালু করতে গেলে প্রথমবার লিখল address already in use।",
                  without:
                    "Deploy রাত তিনটায় সরিয়ে নেন, আর Restart এর আগে কয়েক সেকেন্ড অপেক্ষার একটা নিয়ম বানান, কেন লাগে তা না জেনে।",
                  withIt:
                    "জানেন Server কে হঠাৎ মেরে ফেললে খোলা লাইনগুলো মাঝপথে কাটা পড়ে, আর ভদ্রভাবে থামালে চলতি Request গুলো শেষ হওয়ার সুযোগ পায়। জানেন বন্ধ হওয়ার পরেও একটা Port কিছুক্ষণ কেন আটকে থাকে। দিনের বেলাতেই নিশ্চিন্তে Deploy করেন।",
                  lessons: ["Connection Close", "Port & Socket"],
                },
              ]}
              footer="ছয়টা মুহূর্তের প্রতিটায় খেয়াল করুন, তফাতটা বুদ্ধির নয়, জানার। যিনি জানেন তিনি বেশি পরিশ্রম করছেন না, বরং কম করছেন, কারণ তিনি জানেন কোথায় তাকাতে হবে। নিচে লেখা লেসনের নামগুলো মনে রাখুন, মডিউল পড়ার সময় এই মুহূর্তগুলো আবার ফিরে আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর বাইরেও এই মডিউলের শব্দ আর ধারণা আপনার চোখে পড়বে এই জায়গাগুলোতে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Error বার্তায়:</strong> ECONNREFUSED, ETIMEDOUT,
                  ECONNRESET, EPIPE, EADDRINUSE, socket hang up। Node.js, Database
                  Driver, Redis Client, সব জায়গায় এই একই কয়েকটা শব্দ ঘুরে ফিরে
                  আসে।
                </ListItem>
                <ListItem>
                  <strong>Cloud Dashboard এ:</strong> Security Group এর Inbound
                  Rule, যেখানে লিখতে হয় Protocol TCP না UDP আর কোন Port। Load
                  Balancer এর Idle Timeout আর Health Check। VPC আর VPN এর MTU।
                </ListItem>
                <ListItem>
                  <strong>Config ফাইলে:</strong> App এর HOST আর PORT, Docker এর
                  Port বাইরে আনার লাইন, Reverse Proxy র Timeout, Database এর
                  Connection Pool এর মাপ, Keep-alive এর সময়।
                </ListItem>
                <ListItem>
                  <strong>Terminal এ:</strong> ping, traceroute, nc, curl এর
                  সময়ের হিসাব, কোন Port কে দখল করে আছে তা দেখার lsof আর ss,
                  Connection এর অবস্থা দেখার netstat, আর তারের উপর আসলে কী যাচ্ছে
                  তা দেখার tcpdump। প্রতিটা Command কোন লেসনে আসবে তা সেই লেসনেই
                  হাতে কলমে করানো হবে।
                </ListItem>
                <ListItem>
                  <strong>Browser এর Developer Tools এ:</strong> Network Tab এর
                  Timing এ একটা Request এর সময় কয়েক ভাগে দেখানো থাকে। তার মধ্যে
                  একটা ভাগ হলো লাইন খোলার সময়। এই মডিউলের পরে সেই ভাগটা আর শুধু
                  একটা রঙিন দাগ থাকবে না।
                </ListItem>
                <ListItem>
                  <strong>দলের আলাপে আর Interview এ:</strong> TCP আর UDP র তফাত,
                  Three-way Handshake, OSI র Layer, Port আর Socket এর তফাত, Browser
                  এ ঠিকানা লিখলে কী হয়। এগুলো Backend আর DevOps এর Interview এ
                  সবচেয়ে বেশি আসা প্রশ্নের মধ্যে পড়ে, আর সহকর্মীরা প্রতিদিনের
                  আলাপে এই শব্দগুলো ধরে নিয়েই কথা বলেন।
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
                Island Tours এ একজন পর্যটক একটা বুকিং করলে পর্দার পেছনে একটা নয়,
                কয়েকটা লাইন খোলে। ফোন থেকে সামনের Proxy পর্যন্ত একটা, Proxy থেকে
                App পর্যন্ত একটা, App থেকে Database পর্যন্ত একটা, App থেকে Redis
                পর্যন্ত একটা, আর Payment সেবার দিকে আরেকটা। প্রতিটা লাইনের জন্ম,
                জীবন আর বিদায় ঠিক এই মডিউলের নিয়মে চলে। তাই এই মডিউলের জ্ঞান Island
                Tours এ কোনো এক কোণায় নয়, প্রতিটা তীরচিহ্নের ভেতরে।
              </ContentParagraph>
              <ContentParagraph>
                দিনের কাজে এটা যেভাবে চেহারা নেয়, তার কয়েকটা নমুনা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কোন Port বাইরে খোলা, কোনটা নয়:</strong> বাইরের দুনিয়ার
                  জন্য খোলা শুধু 443 আর 80। App বসে আছে 3000 এ, কিন্তু সেটা শুধু
                  ভেতর থেকে পাওয়া যায়। Database আর Redis এর Port বাইরে থেকে একদমই
                  বন্ধ। এই সিদ্ধান্তটা Firewall এর নিয়মে লেখা, আর সেটা লিখতে হলে
                  জানতে হয় কোন Program কোন ঠিকানায় কান পেতে আছে।
                </ListItem>
                <ListItem>
                  <strong>Deploy এর সময় কেউ যেন বুকিং না হারান:</strong> নতুন
                  Version তোলার সময় পুরনো App কে জানানো হয় যে সে আর নতুন কাউকে নেবে না, হাতের কাজগুলো
                  শেষ করবে, তারপর থামবে। এই ভদ্র বিদায়টুকু Code এ লেখা থাকে, আর
                  কেন লাগে তা শেষ লেসনের বিষয়।
                </ListItem>
                <ListItem>
                  <strong>Timeout গুলো একটার সাথে আরেকটা মেলানো:</strong> Proxy
                  কতক্ষণ একটা চুপচাপ লাইন খোলা রাখবে আর App কতক্ষণ রাখবে, এই দুইটা
                  সংখ্যা ভুল ক্রমে থাকলে মাঝে মাঝে 502 আসে। সংখ্যা দুইটা কোনটা বড়
                  হওয়া উচিত, তা জানা থাকলে সমস্যাটা জন্মই নেয় না।
                </ListItem>
                <ListItem>
                  <strong>Database এর লাইন বারবার না খোলা:</strong> প্রতিটা
                  Request এ Database এর সাথে নতুন করে হাত মেলালে সময় নষ্ট হয়। তাই
                  কয়েকটা লাইন খুলে রেখে বারবার ব্যবহার করা হয়, যাকে বলে Connection
                  Pool। কেন এটা এত সময় বাঁচায়, তা Handshake এর লেসন পড়লে পরিষ্কার
                  হবে।
                </ListItem>
                <ListItem>
                  <strong>সমস্যা হলে নিচ থেকে উপরে খোঁজা:</strong> পর্যটক বললেন
                  সাইট খুলছে না। দল প্রথমে দেখে নাম থেকে ঠিকানা মিলছে কি না, তারপর
                  Server পর্যন্ত পৌঁছানো যাচ্ছে কি না, তারপর Port 443 এ লাইন খুলছে
                  কি না, আর শেষে App ঠিক উত্তর দিচ্ছে কি না। চারটা Command, চার
                  ধাপ, আর যে ধাপে আটকায় সমস্যা সেখানেই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আপনার নিজের my-tours এ এই মডিউল চলাকালীন আর তার ঠিক পরে আপনি নিজে
                হাতে যা যা করবেন, সেটা এরকম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  একটা ছোট Server চালাবেন, যা কোন ঠিকানায় আর কোন Port এ বসবে তা
                  Environment Variable থেকে পড়ে, আর না পেলে পরিষ্কার একটা বার্তা
                  দিয়ে থেমে যায়।
                </ListItem>
                <ListItem>
                  Terminal এ একটা Command লিখে দেখবেন আপনার যন্ত্রে এই মুহূর্তে কোন
                  Program কোন Port এ কান পেতে আছে, আর address already in use এলে
                  দখলদারকে খুঁজে বের করবেন।
                </ListItem>
                <ListItem>
                  একই App কে একবার শুধু নিজের যন্ত্রের জন্য আর একবার সবার জন্য খুলে
                  চালাবেন, আর ফোন থেকে পরীক্ষা করে তফাতটা নিজে দেখবেন।
                </ListItem>
                <ListItem>
                  curl দিয়ে একটা Request এর সময় ভাগ করে মাপবেন, নাম খোঁজায় কত,
                  লাইন খোলায় কত, উত্তর আসায় কত।
                </ListItem>
                <ListItem>
                  ইচ্ছা করে তিন রকম ব্যর্থতা ঘটাবেন, বন্ধ Port, আটকানো Port আর
                  পৌঁছানো যায় না এমন ঠিকানা, আর তিনটার বার্তা পাশাপাশি রেখে
                  চিনবেন।
                </ListItem>
                <ListItem>
                  নিজের Server কে একবার হঠাৎ মেরে আর একবার ভদ্রভাবে থামিয়ে দেখবেন
                  চলতি একটা Request এর কী হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এগুলোর কোনোটাই বড় কাজ নয়, প্রতিটা কয়েক মিনিটের। কিন্তু এই ছোট
                পরীক্ষাগুলোই পরে আসল Server এ আপনার হাত চালু রাখবে।
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
                "সাইট না খুললে কোথা থেকে খোঁজা শুরু করবেন তা জানা নেই",
                "refused, timed out আর reset তিনটাই শুধু কাজ করছে না",
                "Port আর Socket শব্দ দুইটা প্রায় একই মনে হয়",
                "Packet, Segment আর Frame যেকোনোটা যেকোনো জায়গায় বলেন",
                "TCP আর UDP র তফাত বলতে শুধু জানেন একটা নির্ভরযোগ্য, একটা দ্রুত",
                "Layer 4 আর Layer 7 শুনলে চুপ করে থাকেন",
                "Server Restart এর সময় কী ঘটে তা নিয়ে কখনো ভাবেননি",
              ]}
              after={[
                "নিচের Layer থেকে উপরে উঠে চার ধাপে সমস্যার জায়গা বের করতে পারেন",
                "Error এর শব্দটা পড়েই বলতে পারেন দোষ কোন পক্ষে আর কোন ধাপে",
                "বোঝাতে পারেন এক Port 443 এ হাজারজন কীভাবে আলাদা থাকে",
                "একটা ধরা Packet বাইরের মোড়ক থেকে ভেতর পর্যন্ত পড়তে পারেন",
                "যেকোনো কাজের জন্য যুক্তি দিয়ে TCP বা UDP বেছে নিতে পারেন",
                "Load Balancer বা Firewall এর সেটিং বুঝে বাছতে পারেন",
                "একটা বুকিংও নষ্ট না করে Server থামাতে আর চালু করতে পারেন",
              ]}
              footer="বাঁ দিকের তালিকায় নিজেকে পেলে লজ্জার কিছু নেই, অনেক বছর কাজ করা Developer ও এর অর্ধেক জায়গায় দাঁড়িয়ে থাকেন। ডান দিকের তালিকাটা মডিউল শেষে নিজেকে যাচাই করার জন্য রেখে দিন। যে লাইনটা তখনও পারছেন না মনে হবে, সেটার লেসনটা আরেকবার পড়ুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলে আপনার লক্ষ্য শব্দ চেনা নয়, অন্যকে বোঝাতে পারা। মান যাচাইয়ের
                একটা সহজ উপায় আছে। মডিউল শেষে এমন কাউকে বসান যিনি এসব জানেন না, আর
                একটা সাদা কাগজে এঁকে তাঁকে বোঝান, পর্যটক Pay চাপার পর থেকে Server
                উত্তর দেওয়া পর্যন্ত কী কী ঘটে। কোথায় লাইন খোলে, Data কোন মোড়কে যায়,
                পথে কী বদলায়, কে কাকে রসিদ দেয়, আর শেষে লাইন কীভাবে বন্ধ হয়।
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
                <strong>আগে যা জানা থাকা দরকার।</strong> এই মডিউল আগের চারটা
                মডিউলের উপর দাঁড়িয়ে। বিশেষ করে চারটা জিনিস ঝাপসা থাকলে আগে একবার
                চোখ বুলিয়ে নিন। Module 02 এর OS Networking লেসন, যেখানে Port আর
                Socket এর প্রথম পরিচয়। একই মডিউলের Packet, Latency, Bandwidth
                লেসন। Module 03 এর IP Address, MAC Address, Gateway আর NAT। আর
                Module 04 এর dig চালানোর অভ্যাস। এগুলো নতুন করে পড়ানো হবে না, শুধু
                নাম ধরে মনে করিয়ে দেওয়া হবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>কত সময় লাগবে।</strong> পুরো মডিউলের জন্য এক সপ্তাহ ধরুন।
                লেসনগুলোর গায়ে লেখা পড়ার সময় ১৫ থেকে ৬০ মিনিটের মধ্যে, কিন্তু
                সেটা শুধু পড়ার। Lab আর Assignment সহ প্রতিটা লেসনে এক থেকে দুই ঘণ্টা
                ধরলে বাস্তবসম্মত হবে। দিনে একটা লেসন, আর আট দিনের শেষে একদিন পুরোটা
                ঝালিয়ে নেওয়া, এই গতি ভালো কাজ করে। TCP Deep Dive আর Three-way
                Handshake সবচেয়ে ভারী, এ দুইটার জন্য একটু বাড়তি সময় রাখুন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ক্রম ভাঙবেন না।</strong> প্রথম দুই লেসন মানচিত্র, সেগুলো
                ছাড়া পরেরগুলোয় কোন কথাটা কোন Layer এর তা ধরতে কষ্ট হবে। লেসন ৩ এর
                আগে লেসন ৫ পড়লে Handshake এর সংখ্যাগুলো অর্থহীন লাগবে। আর লেসন ৮ এর
                শেষের পুরো মডিউলের গল্পটা তখনই কাজে লাগে যখন আগের সাতটা পড়া আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Terminal খোলা রেখে পড়ুন:</strong> প্রতিটা লেসনে আসল
                  Command আর তার আসল Output দেওয়া আছে। শুধু পড়ে গেলে অর্ধেক পাবেন।
                  নিজে চালান, নিজের সংখ্যাগুলো লেসনের সংখ্যার সাথে মিলিয়ে দেখুন।
                  আপনার ঠিকানা আর সময় আলাদা হবে, সেটাই স্বাভাবিক, আকারটা মিললেই
                  হলো।
                </ListItem>
                <ListItem>
                  <strong>Interactive অংশগুলো এড়িয়ে যাবেন না:</strong> প্রতিটা
                  লেসনে দুই তিনটা জায়গা আছে যেখানে আপনি নিজে বোতাম চেপে ধাপে ধাপে
                  এগোতে পারেন। সেখানে আগে নিজে অনুমান করুন পরের ধাপে কী হবে,
                  তারপর চাপুন। অনুমান ভুল হলে সেটাই সবচেয়ে ভালো শেখা।
                </ListItem>
                <ListItem>
                  <strong>Quiz এ ভুল উত্তরের ব্যাখ্যাও পড়ুন:</strong> প্রতিটা
                  প্রশ্নের প্রতিটা Option এর নিচে লেখা আছে কেন ঠিক বা কেন ভুল। ভুল
                  Option গুলো ইচ্ছা করে সেই ভুল ধারণা থেকে বানানো, যা মানুষ সত্যিই
                  করে।
                </ListItem>
                <ListItem>
                  <strong>কিছু Command আপনার যন্ত্রে নাও চলতে পারে:</strong>{" "}
                  লেসনগুলোতে macOS আর Linux দুইটার Command পাশাপাশি দেওয়া। কয়েকটা
                  শুধু Linux এ চলে, আর তারের উপরের Packet ধরার Command এ sudo লাগে।
                  যেটা চালাতে পারছেন না, তার নমুনা Output পড়ে এগিয়ে যান। Linux এর
                  মডিউলে নিজের Server পেলে এগুলো আবার চালিয়ে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>আটকে গেলে:</strong> আগে সেই লেসনের শেষের ৫ মিনিটের Recap
                  আর Summary ছকটা পড়ুন, প্রায়ই সেখানেই জট খোলে। তাতেও না হলে লেসন
                  যে আগের লেসনের নাম করেছে সেখানে ফিরে যান। এই মডিউলে প্রায় সব
                  বিভ্রান্তির মূল একটাই, কোন কাজটা কোন Layer এর তা গুলিয়ে ফেলা।
                  তাই নিজেকে জিজ্ঞেস করুন, এটা কোন Layer এর কথা হচ্ছে।
                </ListItem>
                <ListItem>
                  <strong>একটা খাতা রাখুন:</strong> প্রতিটা নতুন Error এর শব্দ আর
                  তার এক লাইনের মানে লিখে রাখুন, আর পাশে লিখুন কোন Command দিয়ে
                  সেটা যাচাই করা যায়। মডিউল শেষে এই এক পাতাই আপনার সবচেয়ে কাজের
                  নোট হবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মানচিত্র দেখা শেষ। এবার প্রথম লেসন খুলুন, <strong>OSI Model</strong>
                । সেখানে শুরু হবে একটা সহজ প্রশ্ন দিয়ে, একটা চিঠি লিখতে আপনাকে কেন
                জানতে হয় না ডাকঘরের গাড়ি কোন রাস্তায় যাবে।
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
        "OSI Model",
        "কাজটা সাত Layer এ ভাগ করা, প্রতিটার নিজের কাজ, আর সমস্যা খুঁজতে হয় নিচ থেকে উপরে",
      ],
      [
        "TCP/IP Model",
        "বাস্তবে চলে চার Layer, আর কোনটা আপনার Program এ, কোনটা Kernel এ, কোনটা Network Card এ",
      ],
      [
        "TCP Deep Dive",
        "নম্বর, রসিদ আর আবার পাঠানো দিয়ে অবিশ্বস্ত রাস্তায় নির্ভুল ডেলিভারি, আর TCP চেনে শুধু Byte এর স্রোত",
      ],
      [
        "UDP Deep Dive",
        "প্রায় কিছুই না করাটাই UDP র শক্তি, আর কোন কাজে TCP আর কোন কাজে UDP",
      ],
      [
        "Three-way Handshake",
        "SYN, SYN-ACK, ACK দিয়ে লাইন খোলা, আর না খুললে তিন রকম ছবির তিন রকম মানে",
      ],
      [
        "Packet, Segment, and Frame",
        "একই Data র তিন Layer এ তিন নাম, পথে Frame বদলায়, Packet টিকে থাকে, আর মাপের সীমা MTU",
      ],
      [
        "Port & Socket",
        "IP পৌঁছে দেয় যন্ত্রে, Port পৌঁছে দেয় Program এ, আর একটা Connection চেনা হয় চারটা তথ্য মিলিয়ে",
      ],
      [
        "Connection Close",
        "ভদ্র বিদায় FIN দিয়ে, হঠাৎ কাটা RST দিয়ে, আর Server থামাতে হয় চলতি কাজ শেষ করতে দিয়ে",
      ],
    ],
  },
};
