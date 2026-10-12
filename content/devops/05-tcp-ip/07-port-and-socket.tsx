import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  FourTupleLab,
  ReachabilityLab,
} from "../../../components/course/topics/tcp/port-animations";
import {
  BindAddressDiagram,
  FourTupleDiagram,
  ListenVsConnectedSplit,
  PortRangesDiagram,
  ReverseProxyDiagram,
} from "../../../components/course/topics/tcp/port-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

export const portAndSocketContent: TopicData = {
  id: "port-and-socket",
  introduction: {
    badge: "MODULE 05 · LESSON 07",
    title: <SectionTitle>এক ঠিকানা, হাজার দরজা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আপনি নিজের ল্যাপটপে একটা App বানালেন। localhost:3000 খুললে দিব্যি
          চলছে। তারপর সেটা একটা Server এ তুললেন, সেখানে ঢুকে curl করলেন, সেখানেও
          চলছে। কিন্তু নিজের ফোন থেকে Server এর IP দিয়ে খুলতে গেলে কিছুই আসে না।
          ঘণ্টাখানেক Firewall ঘাঁটলেন, কিছুই বদলাল না। পরদিন App টা আবার চালু
          করতে গেলেন, এবার নতুন একটা লাল লাইন, EADDRINUSE, address already in
          use।
        </ContentParagraph>
        <ContentParagraph>
          এই দুইটা ঘটনা প্রায় প্রতিটা Developer এর জীবনে প্রথম মাসেই ঘটে, আর
          দুইটারই উত্তর এক জায়গায়, Port আর Socket এ। Module 02 এর OS Networking
          লেসনে আপনি এই দুইটা শব্দের সাথে পরিচিত হয়েছিলেন, Port মানে ফ্ল্যাটের
          নম্বর আর Socket মানে হাতে ধরা টেলিফোন। সেটা ছিল প্রথম পরিচয়। এই মডিউলে
          আপনি এর মধ্যে TCP, UDP আর Handshake শিখে ফেলেছেন, তাই এবার ভেতরে ঢোকার
          সময়।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন Port এর নম্বরগুলো কীভাবে ভাগ করা, একটা মাত্র
          Port 443 দিয়ে একটা Server কীভাবে হাজার মানুষের সাথে একসাথে কথা বলে,
          0.0.0.0 আর 127.0.0.1 এর তফাত কেন আপনার একটা পুরো বিকেল বাঁচাবে, একটা
          Port কে দখল করে আছে তা কীভাবে খুঁজবেন, Firewall আর Security Group এ
          Port খোলা মানে আসলে কী, আর একটাই 443 এর পেছনে কীভাবে অনেকগুলো App
          বসানো হয়। সবটা নিজের Terminal এ দেখে দেখে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "একটা বড় অফিসের একটাই ঠিকানা, একটাই রিসেপশনের ফোন নম্বর। তবু একই মুহূর্তে শত শত মানুষ সেই এক নম্বরেই কথা বলছে, আর কারো কথা কারো সাথে মিশছে না। কারণ অপারেটর প্রতিটা কল চেনে শুধু অফিসের নম্বর দিয়ে নয়, কে ফোন করেছে সেটা মিলিয়ে।",
      author: "Port & Socket",
      role: "Lesson 07",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-ports",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>IP পৌঁছে দেয় যন্ত্রে, Port পৌঁছে দেয় Program এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটু পেছনে ফিরি। Module 03 এ শিখেছেন, IP Address একটা যন্ত্রকে
                চেনায়। একটা Packet এর গায়ে গন্তব্যের IP লেখা থাকে, আর Router রা
                সেটা দেখে দেখে Packet টাকে ঠিক যন্ত্রের দরজায় পৌঁছে দেয়। কিন্তু
                যন্ত্রের দরজায় পৌঁছানোর পর একটা নতুন প্রশ্ন ওঠে, যেটার উত্তর IP
                দিতে পারে না। এই যন্ত্রের ভেতরে একসাথে পঞ্চাশটা Program চলছে।
                Packet টা কার?
              </ContentParagraph>
              <ContentParagraph>
                আপনার ল্যাপটপের কথাই ভাবুন। এই মুহূর্তে Browser এ দশটা Tab খোলা,
                পাশে একটা গান বাজছে, একটা Chat App চালু, আর পেছনে আপনার Dev
                Server। সবার IP একটাই, কারণ যন্ত্র একটাই। তবু YouTube এর ভিডিও
                কখনো Chat App এ গিয়ে পড়ে না। কেউ একজন প্রতিটা আসা Packet কে ঠিক
                Program এর হাতে তুলে দিচ্ছে। সেই কেউ হলো Kernel, আর যে সংখ্যাটা
                দেখে সে এটা করে তার নাম Port।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউলের আগের লেসনগুলোর সাথে এটা জুড়ে নিন। TCP আর UDP এর
                লেসনে Header এর প্রথম দুইটা ঘর দেখেছিলেন, Source Port আর
                Destination Port। এই দুইটা ঘর থাকে Transport Layer এর Header এ,
                মানে Segment বা Datagram এর গায়ে, IP Header এ নয়। ভাগটা
                পরিষ্কার। Internet Layer এর কাজ এক যন্ত্র থেকে আরেক যন্ত্রে
                পৌঁছানো, তাই তার ঠিকানা IP। Transport Layer এর কাজ এক Program
                থেকে আরেক Program এ পৌঁছানো, তাই তার ঠিকানা Port।
              </ContentParagraph>
              <ContentParagraph>
                আর Port এর সর্বোচ্চ নম্বর ৬৫৫৩৫ কেন, সেটাও এখন আপনি নিজেই বলতে
                পারবেন। Header এ প্রতিটা Port এর জন্য জায়গা রাখা ১৬ Bit। Module
                01 এর Binary লেসনের হিসাব মনে করুন, ১৬টা Bit দিয়ে ২ এর ঘাত ১৬,
                মানে ৬৫৫৩৬টা আলাদা সংখ্যা লেখা যায়, ০ থেকে ৬৫৫৩৫। কোনো কমিটি
                বসে ঠিক করেনি যে এতগুলো Port দরকার, Header এ জায়গাই এতটুকু।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Port কোনো যন্ত্রাংশ নয়, শুধু একটা সংখ্যা",
          content: (
            <p>
              নতুনদের একটা সাধারণ ভুল হলো Port কে একটা ছিদ্র বা প্লাগের মতো কিছু
              ভাবা, কারণ ল্যাপটপের গায়ে USB Port বা HDMI Port নামে আসল ছিদ্র আছে।
              Network এর Port এর সাথে তার কোনো সম্পর্ক নেই। এটা Kernel এর খাতায়
              লেখা একটা সংখ্যা মাত্র। সব Port এর সব Data একই তার বা একই Wi-Fi
              দিয়ে আসে, একই Network Card দিয়ে ঢোকে। ভাগাভাগিটা হয় যন্ত্রের ভেতরে,
              Kernel যখন Header পড়ে দেখে কোন সংখ্যা লেখা। তাই Port খোলা বা বন্ধ
              বললে আসলে বোঝায়, ওই সংখ্যার জন্য আসা Data কেউ নিচ্ছে কি না, আর
              তাকে ঢুকতে দেওয়া হচ্ছে কি না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "ranges",
      subHeader: { index: "002", title: "Port Ranges" },
      title: <SectionTitle>৬৫৫৩৬টা নম্বর, তিনটা পাড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা শহরের বাড়ির নম্বরের কথা ভাবুন। শহরের একদম মাঝখানের কিছু
                ঠিকানা সবাই চেনে, থানা, হাসপাতাল, ডাকঘর। সেগুলো যে কেউ চাইলেই
                নিতে পারে না। তার বাইরে বিশাল আবাসিক এলাকা, যেখানে যে কেউ বাড়ি
                করতে পারে। আর শহরের এক প্রান্তে আছে হোটেল পাড়া, যেখানে কেউ
                স্থায়ীভাবে থাকে না, এক রাতের জন্য ঘর নেয় আর সকালে ছেড়ে দেয়।
                Port এর নম্বরগুলো ঠিক এই তিন ভাগে সাজানো।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PortRangesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Well Known Port, ০ থেকে ১০২৩:</strong> এদের আরেক নাম
                  System Port। পৃথিবীজুড়ে সবাই মেনে নিয়েছে যে Web থাকবে 80 আর
                  443 এ, SSH থাকবে 22 এ, DNS থাকবে 53 তে। এই তালিকা রাখে IANA
                  নামের সংস্থা, সেই একই সংস্থা যাকে DNS মডিউলে Root Zone এর
                  দায়িত্বে দেখেছিলেন। Linux এ এই পাড়ার Port এ বসতে root এর
                  অনুমতি লাগে, যেটা নিয়ে একটু পরে আলাদা করে কথা হবে।
                </ListItem>
                <ListItem>
                  <strong>Registered Port, ১০২৪ থেকে ৪৯১৫১:</strong> এদের আরেক
                  নাম User Port। বড় Software গুলো এখানে নিজের জন্য একটা নম্বর
                  IANA তে লিখিয়ে রাখে, যেমন MySQL 3306, PostgreSQL 5432। কিন্তু
                  এটা শুধু একটা ভদ্রতার তালিকা, কোনো তালা নয়। যে কোনো Program,
                  root ছাড়াই, এই পাড়ার যে কোনো ফাঁকা Port এ বসতে পারে। আপনার
                  Dev Server এর 3000, 5173 বা 8080 সব এই পাড়ার।
                </ListItem>
                <ListItem>
                  <strong>Ephemeral Port, ৪৯১৫২ থেকে ৬৫৫৩৫:</strong> Ephemeral
                  মানে ক্ষণস্থায়ী। এদের আরেক নাম Dynamic Port। এগুলো কারো নামে
                  লেখা নয়। আপনার যন্ত্র যখন Client হয়ে কোথাও Connection খোলে,
                  তখন তার নিজেরও একটা ফেরার Port লাগে, নইলে উত্তর কোথায় আসবে।
                  Kernel এই পাড়া থেকে একটা ফাঁকা নম্বর তুলে দেয়, আর Connection
                  শেষ হলে সেটা আবার ফাঁকা হয়ে যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই তালিকাটা আপনার যন্ত্রেই একটা সাধারণ Text ফাইলে রাখা আছে, নাম
                /etc/services। macOS আর Linux দুইটাতেই আছে। খুলে দেখুন, একদম
                পড়ার মতো একটা ফাইল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "etc-services.sh",
          code: `grep -E "^(ssh|smtp|domain|http|https|mysql)[[:space:]]" /etc/services

# ssh              22/udp     # SSH Remote Login Protocol
# ssh              22/tcp     # SSH Remote Login Protocol
# smtp             25/tcp     # Simple Mail Transfer
# domain           53/udp     # Domain Name Server
# domain           53/tcp     # Domain Name Server
# http             80/tcp     www www-http # World Wide Web HTTP
# https           443/tcp     # http protocol over TLS/SSL
# mysql          3306/tcp     # MySQL

# বাঁ দিকে নাম, মাঝে নম্বর আর Protocol, ডানে মানুষের জন্য একটা টীকা।
# DNS এর নাম এখানে domain, কারণ ফাইলটা অনেক পুরনো।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Port এর নম্বর শুধু একটা রীতি, কোনো নিশ্চয়তা নয়",
          content: (
            <p>
              Port 443 এ HTTPS থাকে, এটা সবাই মেনে চলে বলে সত্যি, কোনো যন্ত্র
              এটা জোর করে মানায় না। আপনি চাইলে SSH কে 443 এ বসাতে পারেন, বা
              একটা Website কে 22 এ। Kernel শুধু দেখে কোন Program কোন নম্বর
              চেয়েছে, ভেতরে কী ভাষায় কথা হবে তা নিয়ে তার কোনো মাথাব্যথা নেই।
              /etc/services ফাইলটাও শুধু একটা নামের তালিকা, lsof এর মতো Tool রা
              সংখ্যার বদলে নাম দেখাতে এটা ব্যবহার করে। এর দুইটা বাস্তব ফল আছে।
              এক, কোনো Port খোলা দেখে ধরে নেবেন না ভেতরে কী চলছে, যাচাই করুন।
              দুই, SSH কে 22 থেকে সরিয়ে 2222 এ নিলে আপনি নিরাপদ হয়ে যান না,
              শুধু স্বয়ংক্রিয় আক্রমণের ভিড়টা একটু কমে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "common-ports",
      subHeader: { index: "003", title: "Common Ports" },
      title: <SectionTitle>যে নম্বরগুলো আপনার চোখে বারবার পড়বে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Port এর নম্বর মুখস্থ করার জিনিস নয়, কাজ করতে করতে এমনিই মনে গেঁথে
              যায়। তবু একটা তালিকা একবার দেখে রাখা ভালো, কারণ Hosting এর Panel,
              Cloud এর Security Group, Docker এর ফাইল আর Error Message এ ঠিক এই
              সংখ্যাগুলোই ঘুরেফিরে আসে। প্রতিটার পাশে লেখা আছে এই কোর্সের কোথায়
              তার সাথে আগে দেখা হয়েছে বা পরে হবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Port", "Protocol", "কে বসে", "কোথায় দেখা হবে"],
          rows: [
            [mono("22"), "TCP", "SSH", "Terminal থেকে Server এ ঢোকা, Linux মডিউল"],
            [mono("25"), "TCP", "SMTP", "এক Mail Server থেকে আরেকটায় চিঠি, DNS মডিউলের MX Record"],
            [mono("53"), "UDP ও TCP", "DNS", "পুরো Module 04, আর UDP লেসনের TC Flag"],
            [mono("67, 68"), "UDP", "DHCP", "Module 03 এর DORA"],
            [mono("80"), "TCP", "HTTP", "এনক্রিপশন ছাড়া Web, আজকাল মূলত 443 এ পাঠিয়ে দেওয়ার জন্য"],
            [mono("123"), "UDP", "NTP", "যন্ত্রের ঘড়ি মেলানো"],
            [mono("443"), "TCP ও UDP", "HTTPS", "আজকের প্রায় সব সাইট। UDP 443 এ চলে HTTP/3"],
            [mono("465, 587"), "TCP", "SMTP Submission", "App থেকে Email পাঠানো"],
            [mono("993"), "TCP", "IMAPS", "Email পড়া"],
            [mono("3306"), "TCP", "MySQL", "Database মডিউল"],
            [mono("5432"), "TCP", "PostgreSQL", "Island Tours এর Database"],
            [mono("6379"), "TCP", "Redis", "Cache আর Queue"],
            [mono("27017"), "TCP", "MongoDB", "Database মডিউল"],
            [mono("3000, 5173, 8000, 8080"), "TCP", "Dev Server", "Node, Vite, Python, Java এর অভ্যাসের Port"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছকে দুইটা জিনিস খেয়াল করুন। প্রথমত, Browser এ আপনি কখনো 443 লেখেন
                না, কারণ https লেখা দেখলে Browser নিজেই 443 ধরে নেয়, আর http
                দেখলে 80। Port লিখতে হয় শুধু তখন, যখন সেটা এই রীতির বাইরে, যেমন
                localhost:3000। দ্বিতীয়ত, 53 আর 443 এর পাশে দুইটা Protocol ই
                লেখা। এটা পরের অংশের একটা জরুরি কথার দিকে নিয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Database এর Port গুলো কখনো Internet এর দিকে খোলা নয়",
          content: (
            <p>
              3306, 5432, 6379, 27017, এই চারটা নম্বর পৃথিবীর সব আক্রমণকারীর
              মুখস্থ। স্বয়ংক্রিয় Program রা দিনরাত পুরো Internet এর প্রতিটা IP
              তে এই Port গুলোয় কড়া নেড়ে বেড়ায়, আর কোথাও খোলা পেলে Password
              আন্দাজ করতে শুরু করে। প্রতি বছর যত Database চুরির খবর আসে তার একটা
              বড় অংশের শুরু এখানেই, একটা Database যার Port বাইরের দিকে খোলা ছিল।
              নিয়মটা সহজ। Database এ কথা বলবে শুধু আপনার App, আর App টা থাকে একই
              যন্ত্রে বা একই Private Network এ। তাই Database বসবে 127.0.0.1 এ বা
              Private IP তে, আর Firewall এ ওই Port বাইরের জন্য বন্ধ থাকবে। কীভাবে,
              সেটা এই লেসনের বাকি অংশ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "socket-address",
      subHeader: { index: "004", title: "Socket" },
      title: <SectionTitle>Socket মানে IP আর Port, দুইটা একসাথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                OS Networking লেসনে Socket কে বলা হয়েছিল হাতে ধরা টেলিফোন, Kernel
                যে জিনিসটা Program এর হাতে তুলে দেয় কথা বলার জন্য। সেই ছবিটা ঠিক
                আছে, এবার তাতে একটা জিনিস যোগ করুন। প্রতিটা টেলিফোনের একটা নম্বর
                থাকে। Socket এর সেই নম্বরটা হলো একটা IP আর একটা Port এর জোড়া,
                মাঝে কোলন দিয়ে লেখা, যেমন 103.94.135.2:443। এই জোড়াটাকে বলে
                Socket Address।
              </ContentParagraph>
              <ContentParagraph>
                দুইটা অংশই দরকার, একটা বাদ দিলে ঠিকানা অসম্পূর্ণ। শুধু IP বললে
                বোঝায় কোন বিল্ডিং, কিন্তু কোন ফ্ল্যাট তা বলা হয়নি। শুধু Port
                বললে বোঝায় ফ্ল্যাট ৪৪৩, কিন্তু কোন বিল্ডিংয়ের? পৃথিবীর প্রতিটা
                যন্ত্রেরই একটা করে Port 443 আছে। তাই কেউ যখন বলে, আমার App টা
                3000 এ চলছে, কথাটা আসলে আধখানা। পুরো কথাটা হলো কোন IP র 3000 এ।
                এই আধখানা কথাটাই এই লেসনের শুরুর সেই সমস্যার জন্ম দেয়, আর একটু
                পরেই সেখানে পৌঁছাব।
              </ContentParagraph>
              <ContentParagraph>
                এখানে শব্দ নিয়ে একটা ছোট জট আছে, যেটা খুলে নেওয়া ভালো। মানুষ
                Socket শব্দটা দুই অর্থে ব্যবহার করে। এক অর্থে Socket হলো সেই
                জিনিসটা যা Program এর হাতে থাকে, যা দিয়ে সে পড়ে আর লেখে। Code এ
                আপনি এটাকেই দেখেন, যেমন Node এ একটা socket Object। আরেক অর্থে
                Socket মানে শুধু ঠিকানাটা, IP আর Port এর জোড়া। দুই অর্থ একই
                জিনিসের দুই দিক, একটা হলো টেলিফোনটা আর আরেকটা তার নম্বর।
                প্রসঙ্গ দেখে বুঝে নিতে হয় কোনটা বলা হচ্ছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "TCP এর Port আর UDP এর Port দুইটা আলাদা খাতা",
          content: (
            <p>
              TCP 53 আর UDP 53 একই Port নয়। Kernel এর কাছে TCP এর জন্য একটা
              খাতা আর UDP এর জন্য আরেকটা খাতা, দুইটাতেই ০ থেকে ৬৫৫৩৫। একটা
              Packet এলে Kernel আগে IP Header এ দেখে ভেতরে TCP না UDP, তারপর সেই
              অনুযায়ী খাতা খোলে। তাই একই নম্বরে একটা TCP Program আর একটা UDP
              Program পাশাপাশি বসতে পারে, কোনো ঝামেলা ছাড়া। DNS Server ঠিক এটাই
              করে, আর UDP লেসনে দেখেছিলেন কেন তার দুইটাই লাগে। এই কারণেই একটা
              Port এর পুরো পরিচয় দিতে Protocol সহ বলতে হয়, 443/tcp বা 53/udp,
              ঠিক যেভাবে /etc/services এ লেখা। Firewall এর নিয়মেও তাই Port এর
              পাশে সবসময় Protocol বেছে দিতে হয়।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "tcp-and-udp-same-number.sh",
          code: `# একই নম্বরে দুইজন, একজন TCP তে আর একজন UDP তে
nc -l 5977 & T=$!        # TCP
nc -u -l 5977 & U=$!     # UDP
sleep 1

lsof -nP -i :5977
# COMMAND   PID     USER   FD   TYPE  ...  NODE NAME
# nc      20509  devripon   3u  IPv4  ...  TCP  *:5977 (LISTEN)
# nc      20510  devripon   3u  IPv4  ...  UDP  *:5977

# দুইটা আলাদা Process, একই নম্বর, কোনো Error নেই।
# UDP র সারিতে LISTEN লেখা নেই, কারণ UDP তে Connection বলে কিছু নেই।

kill $T $U`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "four-tuple",
      subHeader: { index: "005", title: "The 4-tuple" },
      title: <SectionTitle>এক Port 443, তবু হাজারজন একসাথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন সেই প্রশ্নটা, যেটা এই লেসনের সবচেয়ে জরুরি, আর যেটা না বুঝে
                অনেকে বছরের পর বছর কাজ করে যায়। OS Networking লেসনে পড়েছিলেন,
                এক ফ্ল্যাটে দুইজন বসে না, মানে এক Port এ একসাথে একটা Program ই
                Listen করতে পারে। অথচ Island Tours এর Server এ Port 443 একটাই,
                আর ছুটির মৌসুমে সেখানে একই মুহূর্তে দশ হাজার পর্যটক। সবাই একই
                IP র একই Port এ আসছেন। Server তাঁদের আলাদা রাখে কীভাবে? প্রতিজনের
                জন্য কি আলাদা Port লাগে?
              </ContentParagraph>
              <ContentParagraph>
                লাগে না। উত্তরটা লুকিয়ে আছে একটা সাধারণ পর্যবেক্ষণে। একটা
                Connection এর দুইটা প্রান্ত, আর প্রতিটা প্রান্তের একটা করে Socket
                Address। তাই একটা Connection কে পুরোপুরি চেনাতে লাগে চারটা
                সংখ্যা: কার IP থেকে, কার Port থেকে, কোন IP তে, কোন Port এ। এই
                চারটাকে একসাথে বলে 4-tuple। Kernel একটা Connection কে শুধু
                গন্তব্যের Port দিয়ে চেনে না, চারটা মিলিয়ে চেনে।
              </ContentParagraph>
              <ContentParagraph>
                একটা বড় অফিসের রিসেপশনের কথা ভাবুন। অফিসের ফোন নম্বর একটাই। তবু
                একসাথে একশোটা কল চলে, কারণ অপারেটরের বোর্ডে প্রতিটা কল চেনা যায়
                কে ফোন করেছে সেই নম্বর দিয়ে। দুইজন আলাদা মানুষ একই অফিসে ফোন
                করলে তাঁদের নিজেদের নম্বর আলাদা, তাই কল দুইটাও আলাদা। Server এর
                Port 443 হলো অফিসের সেই একটা নম্বর, আর প্রতিটা Client এর IP আর
                Port হলো ফোন করা মানুষটার নিজের নম্বর।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FourTupleDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TCP Deep Dive লেসনে দেখেছেন, প্রতিটা Segment এর Header এ Source
                Port আর Destination Port থাকে, আর তাকে মুড়ে রাখা IP Packet এর
                Header এ থাকে Source IP আর Destination IP। মানে প্রতিটা আসা
                Segment নিজের গায়েই চারটা সংখ্যা বয়ে আনে। Kernel সেই চারটা
                মিলিয়ে তার খাতায় খোঁজে, এই চার সংখ্যার Connection টা কার, আর
                Data টা ঠিক সেই Socket এ ফেলে দেয়। নিচে নিজে কয়েকজন Client এনে
                দেখুন খাতাটা কীভাবে ভরে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FourTupleLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab থেকে তিনটা সিদ্ধান্ত নিজের করে নিন, কারণ এই তিনটাই পরে বারবার
                কাজে লাগবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>নতুন Client এলে Server এ নতুন Port খরচ হয় না।</strong>{" "}
                  দশ হাজার পর্যটক মানে দশ হাজার সারি, কিন্তু সব সারিতে Server
                  এর দিকের Port সেই একই 443। তাই একটা Server এ কতজন একসাথে
                  থাকতে পারবে তার সীমা ৬৫৫৩৫ নয়। সীমা ঠিক করে Memory, CPU আর
                  একটা Process কতগুলো Socket খোলা রাখতে পারে, যেটা নিয়ে একটু
                  পরে কথা হবে।
                </ListItem>
                <ListItem>
                  <strong>
                    Port এর নম্বর শুধু একটা যন্ত্রের ভেতরে আলাদা হলেই চলে।
                  </strong>{" "}
                  দুইজন পর্যটকের ফোন একই Ephemeral Port বেছে নিলে কিছু যায় আসে
                  না, কারণ তাঁদের IP আলাদা।
                </ListItem>
                <ListItem>
                  <strong>
                    একই Client একই Server এ অনেকগুলো Connection খুলতে পারে।
                  </strong>{" "}
                  Browser আসলে তাই করে। একটা পাতা আনতে সে একই সাইটে একসাথে
                  কয়েকটা Connection খোলে, প্রতিটা আলাদা Source Port থেকে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                অনেক জায়গায় 5-tuple শব্দটাও দেখবেন। ওটা এই চারটার সাথে পঞ্চম
                একটা জিনিস, Protocol, মানে TCP না UDP। আগের অংশে দেখলেন TCP আর
                UDP র খাতা আলাদা, তাই পুরো পরিচয়ে Protocol ও লাগে। Firewall,
                Load Balancer আর NAT এর Documentation এ 5-tuple কথাটা খুব চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "NAT এর খাতাটা আসলে এই একই খাতা",
          content: (
            <p>
              Module 03 এর NAT লেসনে দেখেছিলেন, Router একটা ছক রাখে, ভেতরের কোন
              IP আর Port বাইরের কোন Port হয়ে বেরিয়েছে। এখন বুঝবেন সেটা কেন কাজ
              করে। আমাদের পর্যটকের ফোন ভেতরে 192.168.1.20 এর Port 51514 থেকে
              রওনা দেয়। Router সেটাকে বদলে করে 203.0.113.25 এর Port 62001।
              Island Tours এর Server শুধু এই দ্বিতীয় জোড়াটাই দেখে। একই বাসার
              আরেকটা ফোন একই সময়ে একই সাইট খুললে Router তাকে দেবে 62002। Server
              এর চোখে এরা একই IP র দুইটা আলাদা Port, মানে দুইটা আলাদা 4-tuple,
              ঠিক যেন একই ফোনের দুইটা Tab। NAT পুরোটাই দাঁড়িয়ে আছে এই এক
              নিয়মের উপর, চারটার একটা আলাদা হলেই Connection আলাদা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "listen-vs-connected",
      subHeader: { index: "006", title: "Two Kinds of Socket" },
      title: <SectionTitle>দরজার ঘণ্টা আর কথা বলার লাইন এক জিনিস নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                4-tuple বোঝার পর একটা খটকা থেকে যায়। Server এর Program তো একটাই
                Socket খুলেছিল, listen(443) বলে। তাহলে দশ হাজার Connection এর
                Data সে কোন Socket দিয়ে পড়ে? সব কি ওই একটা দিয়েই আসে?
              </ContentParagraph>
              <ContentParagraph>
                না। Server এর হাতে আসলে দুই রকম Socket থাকে। প্রথমটা সে নিজে
                বানায়, যেটা দিয়ে সে Port এ বসে। এর নাম Listening Socket। এটা
                দোকানের দরজার ঘণ্টার মতো, কেউ এলে বাজে, কিন্তু ঘণ্টার সাথে কেউ
                কথা বলে না। Three-way Handshake লেসনে দেখেছেন, SYN, SYN-ACK আর
                ACK শেষ হলে Kernel তৈরি Connection টাকে একটা সারিতে রাখে, যার
                নাম Accept Queue। Program তখন accept() নামের Syscall দিয়ে সারি
                থেকে একটা তুলে নেয়, আর Kernel তার হাতে একটা একদম নতুন Socket
                দেয়, শুধু ওই একজন Client এর জন্য। এর নাম Connected Socket।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ListenVsConnectedSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তফাতটা এক লাইনে। Listening Socket এর ঠিকানার শুধু নিজের অর্ধেকটা
                ভরা, ওপাশে কে তা ফাঁকা, কারণ সে যে কারো জন্য অপেক্ষা করছে।
                Connected Socket এর চারটা ঘরই ভরা। Node এ আপনি এই দুইটাকেই দেখেন,
                শুধু নাম আলাদা। server Object টা হলো Listening Socket এর মোড়ক,
                আর প্রতিটা Request এর সাথে আসা req.socket হলো একটা Connected
                Socket।
              </ContentParagraph>
              <ContentParagraph>
                এটা নিজের চোখে দেখা যায়। নিচের Output টা একটা Node Server এর,
                যেটা Port 3977 এ বসে আছে আর যাতে দুইজন Client যুক্ত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "listening-and-connected.sh",
          code: `lsof -nP -iTCP:3977

# COMMAND   PID   FD   TYPE  NODE NAME
# node    20400  12u   IPv4  TCP  127.0.0.1:3977 (LISTEN)
# node    20400  13u   IPv4  TCP  127.0.0.1:3977->127.0.0.1:57256 (ESTABLISHED)
# node    20400  14u   IPv4  TCP  127.0.0.1:3977->127.0.0.1:57257 (ESTABLISHED)
# nc      20423   3u   IPv4  TCP  127.0.0.1:57257->127.0.0.1:3977 (ESTABLISHED)
# nc      20424   3u   IPv4  TCP  127.0.0.1:57256->127.0.0.1:3977 (ESTABLISHED)

# প্রথম সারি: Listening Socket, তীর নেই, ওপাশ ফাঁকা।
# দ্বিতীয় আর তৃতীয়: একই Process (PID 20400) এর দুইটা Connected Socket।
#   নিজের দিকে দুইটাতেই 3977, ওপাশে দুইটা আলাদা Port।
# শেষ দুইটা: দুই Client এর দিক থেকে একই দুইটা Connection, উল্টো করে লেখা।

# FD ঘরের 12, 13, 14 খেয়াল করুন। প্রতিটা Socket Process এর কাছে
# একটা করে File Descriptor, ঠিক একটা খোলা ফাইলের মতো।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক Port এ একজনই বসে, কথাটার পুরো রূপ",
          content: (
            <p>
              এখন পুরনো নিয়মটা ঠিক করে বলা যায়। একটা IP আর Port এর জোড়ায় একসাথে
              একটাই Listening Socket থাকতে পারে। Connected Socket কিন্তু একই
              Port এ যত খুশি হতে পারে, কারণ তাদের প্রত্যেকের ওপাশের অর্ধেক
              আলাদা। তাই এক ফ্ল্যাটে দুইজন বসে না কথাটা Listen করার বেলায় সত্যি,
              কথা বলার বেলায় নয়। ESTABLISHED শব্দটা আপনি Handshake লেসন থেকে
              চেনেন, আর LISTEN ও। এই দুইটা State ই এখন দুই রকম Socket এর সাথে
              মিলে গেল।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "ephemeral",
      subHeader: { index: "007", title: "The Client Side" },
      title: <SectionTitle>Client এর Port টা কে ঠিক করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ Server এর দিকটা দেখলেন। Client এর দিকে একটা মজার জিনিস
                ঘটে, যেটা আপনি কখনো নিজে করেননি অথচ প্রতিদিন হাজারবার হয়। আপনি
                যখন curl বা Browser দিয়ে কোথাও যান, গন্তব্যের Port আপনি জানেন,
                443। কিন্তু নিজের দিকের Port টা কখনো বলে দেন না। সেটা Kernel
                নিজে বেছে নেয়, Ephemeral পাড়া থেকে একটা ফাঁকা নম্বর তুলে।
                Program শুধু বলে, আমাকে ওখানে যুক্ত করে দিন, আর Kernel বাকিটা সামলায়।
              </ContentParagraph>
              <ContentParagraph>
                এই নম্বরটা curl আপনাকে দেখাতে পারে। একই কমান্ড দুইবার চালালে
                দেখবেন দুইবার দুইটা আলাদা Port, কারণ দুইটা আলাদা Connection।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "my-ephemeral-port.sh",
          code: `F="local %{local_ip}:%{local_port} -> remote %{remote_ip}:%{remote_port}\\n"
curl -s -o /dev/null -w "$F" https://example.com
curl -s -o /dev/null -w "$F" https://example.com

# local 192.168.0.103:57271 -> remote 172.66.147.243:443
# local 192.168.0.103:57272 -> remote 172.66.147.243:443
#       ^ আপনার Private IP   ^ Kernel এর দেওয়া সাময়িক Port, প্রতিবার আলাদা

# আপনার যন্ত্রে Ephemeral পাড়াটা কোথা থেকে কোথায়
sysctl net.inet.ip.portrange.first net.inet.ip.portrange.last   # macOS
# net.inet.ip.portrange.first: 49152
# net.inet.ip.portrange.last: 65535

cat /proc/sys/net/ipv4/ip_local_port_range                      # Linux
# সাধারণত 32768  60999`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                খেয়াল করুন, Linux এর পাড়াটা IANA র বলা ৪৯১৫২ থেকে শুরু নয়, ৩২৭৬৮
                থেকে। IANA র ভাগটা একটা সুপারিশ, আর প্রতিটা Operating System
                নিজের মতো একটা পরিসর বেছে নিয়েছে। macOS আর Windows মোটামুটি
                সুপারিশ মেনে চলে, Linux একটু বড় পাড়া রাখে। এটা জানা থাকলে একটা
                সূক্ষ্ম ভুল এড়ানো যায়। আপনার App কে যদি 32768 এর উপরের কোনো
                Port এ বসান, যেমন 40000, তাহলে কোনো একদিন চালু করার সময় দেখতে
                পারেন Port টা আগেই দখল, কারণ Kernel সেটা কোনো বেরিয়ে যাওয়া
                Connection কে সাময়িকভাবে দিয়ে রেখেছে। নিজের Service এর জন্য তাই
                ১০২৪ থেকে ৩২৭৬৭ এর মধ্যে একটা নম্বর বেছে নেওয়াই নিরাপদ।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা জিনিস Output এ চোখে পড়ার মতো। local এর IP টা 192.168 দিয়ে
                শুরু, মানে Private। example.com এর Server কিন্তু এই ঠিকানা কখনো
                দেখে না। মাঝখানে Router এর NAT এটাকে বদলে নিজের Public IP আর
                নিজের বেছে নেওয়া একটা Port বসিয়ে দেয়। তাই একটা Connection এর
                4-tuple দুই প্রান্তে দুই রকম দেখায়, আর দুইটাই নিজের জায়গায় ঠিক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Port 0 চাইলে Kernel যেকোনো একটা ফাঁকা Port দেয়",
          content: (
            <p>
              Server ও চাইলে Kernel কে বেছে নিতে দিতে পারে। listen এ Port হিসেবে
              0 দিলে Kernel একটা ফাঁকা Port তুলে দেয়, আর Program পরে জিজ্ঞেস করে
              জেনে নেয় কোনটা পেল। Test চালানোর সময় এটা খুব কাজে লাগে, কারণ
              একসাথে দশটা Test দশটা Server চালালেও কারো সাথে কারো Port এ ঠোকাঠুকি
              লাগে না। এই যন্ত্রে চালিয়ে দেখা গেছে Node এ Port 0 চেয়ে 57270
              পাওয়া গিয়েছিল, মানে সেই Ephemeral পাড়ারই একটা নম্বর। Port 0
              নিজে কখনো কোনো আসল Connection এর ঠিকানা হয় না, এটা শুধু যেকোনো
              একটা দিন বলার সংকেত।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "bind-address",
      subHeader: { index: "008", title: "Bind Address" },
      title: <SectionTitle>0.0.0.0 আর 127.0.0.1, যে তফাত একটা বিকেল বাঁচায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনের শুরুর সেই প্রথম সমস্যায় ফেরা যাক। App টা Server এর
                ভেতর থেকে curl করলে চলে, কিন্তু বাইরে থেকে খোলে না। Socket
                Address এর অংশে বলেছিলাম, 3000 এ চলছে কথাটা আধখানা, কারণ IP টা
                বলা হয়নি। এখন সেই বাকি আধখানা।
              </ContentParagraph>
              <ContentParagraph>
                একটা যন্ত্রের একটাই IP থাকে, এই ধারণাটা প্রায় কখনো সত্যি নয়।
                আপনার ল্যাপটপেরই এই মুহূর্তে অন্তত দুইটা আছে। একটা Wi-Fi এর,
                যেমন 192.168.0.103, যেটা দিয়ে বাইরের দুনিয়া আপনাকে পায়। আরেকটা
                127.0.0.1, যাকে OS Networking লেসনে Loopback নামে চিনেছিলেন, যে
                ঠিকানা কখনো যন্ত্রের বাইরে যায় না। একটা Cloud Server এর সাধারণত
                তিনটা থাকে, Loopback, একটা Private IP আর একটা Public IP। প্রতিটা
                IP একটা আলাদা দরজা।
              </ContentParagraph>
              <ContentParagraph>
                Program যখন একটা Port এ বসে, সে শুধু Port টা বলে না, কোন দরজায়
                কান পাতবে সেটাও বলে। এই দ্বিতীয় তথ্যটার নাম Bind Address, আর
                bind() Syscall এর নাম এখান থেকেই। আপনি এটা না লিখলে Framework
                নিজের একটা পছন্দ বসিয়ে দেয়, আর সমস্যাটা ঠিক সেখানেই, কারণ আপনি
                জানেনই না কী বসানো হলো।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <BindAddressDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>127.0.0.1 (বা localhost):</strong> শুধু ভেতরের দরজা।
                  একই যন্ত্রের অন্য Program ছাড়া কেউ পৌঁছাতে পারবে না। যা কিছু
                  বাইরের দুনিয়ার দেখার দরকার নেই তার জন্য এটাই ঠিক জায়গা:
                  Database, Cache, আর Reverse Proxy র পেছনে থাকা App।
                </ListItem>
                <ListItem>
                  <strong>একটা নির্দিষ্ট IP, যেমন 10.0.0.5:</strong> শুধু ওই এক
                  দরজা। Server এর Private IP তে Bind করলে একই Private Network এর
                  অন্য Server রা পৌঁছাতে পারবে, Internet পারবে না।
                </ListItem>
                <ListItem>
                  <strong>0.0.0.0:</strong> এটা কোনো আসল ঠিকানা নয়, এটা একটা
                  সংকেত, যার মানে আমার যত IPv4 ঠিকানা আছে সবগুলোতে। Tool গুলো
                  এটাকে অনেক সময় তারকা দিয়ে দেখায়, *:3000। IPv6 এ একই সংকেত দুইটা
                  কোলন, :: দিয়ে লেখা হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার প্রমাণ। নিচের ছোট Server টা Host আর Port দুইটাই Environment
                Variable থেকে নেয়, আর কোনোটা না পেলে সোজা থেমে যায়। ইচ্ছা করেই
                কোনো ডিফল্ট মান রাখা হয়নি, কারণ চুপচাপ একটা ভুল ডিফল্ট নিয়ে চলার
                চেয়ে শুরুতেই থেমে যাওয়া অনেক ভালো। প্রতিটা Connection এলে সে
                ছাপায় কে কোথা থেকে কোথায় এলো, মানে পুরো 4-tuple।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "server.js",
          code: `const http = require("node:http");

const host = process.env.HOST;
const port = Number(process.env.PORT);
if (!host || !Number.isInteger(port)) {
  throw new Error("HOST and PORT must be set, for example HOST=127.0.0.1 PORT=3000");
}

const server = http.createServer((req, res) => {
  const s = req.socket; // এই Client এর Connected Socket
  console.log(
    "connection:",
    s.remoteAddress + ":" + s.remotePort,
    "->",
    s.localAddress + ":" + s.localPort,
  );
  res.end("hello from pid " + process.pid + "\\n");
});

server.on("error", (err) => {
  console.error("listen failed:", err.code, err.message);
  process.exit(1);
});

server.listen(port, host, () => {
  const a = server.address(); // Listening Socket এর ঠিকানা
  console.log("listening on", a.address + ":" + a.port, "pid", process.pid);
});`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "bind-experiment.sh",
          code: `LAN=$(ipconfig getifaddr en0)      # macOS এ Wi-Fi এর IP
# Linux এ:  LAN=$(hostname -I | cut -d" " -f1)

# ---- পরীক্ষা ১: শুধু ভেতরের দরজা
HOST=127.0.0.1 PORT=3977 node server.js & SP=$!
sleep 1
# listening on 127.0.0.1:3977 pid 20081

curl -s http://127.0.0.1:3977/
# hello from pid 20081

curl -s -m 3 http://$LAN:3977/ ; echo "curl exit=$?"
# curl exit=7      <- 7 মানে Connection refused
# একই যন্ত্র, একই Port, একই চালু App। শুধু দরজাটা আলাদা, তাই refused।

kill $SP ; sleep 1

# ---- পরীক্ষা ২: সব দরজা
HOST=0.0.0.0 PORT=3977 node server.js & SP=$!
sleep 1
# listening on 0.0.0.0:3977 pid 20092

curl -s http://$LAN:3977/
# hello from pid 20092
curl -s http://127.0.0.1:3977/
# hello from pid 20092

lsof -nP -iTCP:3977 -sTCP:LISTEN
# node  20092 ... TCP *:3977 (LISTEN)       <- তারকা মানে সব দরজা
# আগের বার এখানে লেখা ছিল 127.0.0.1:3977

kill $SP`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম পরীক্ষাটাই লেসনের শুরুর রহস্যের উত্তর। App চলছে, Port ঠিক,
                তবু refused, কারণ App ভেতরের দরজায় কান পেতে আছে আর আপনি এসেছেন
                বাইরের দরজায়। Kernel এর চোখে বাইরের দরজার Port 3977 এ কেউ নেই,
                তাই সে Handshake লেসনে দেখা সেই RST পাঠিয়ে দেয়। আর Server এর
                ভেতরে বসে curl localhost করলে সব ঠিক দেখায়, কারণ তখন আপনি ভেতরের
                দরজা দিয়েই ঢুকছেন। এই কারণেই মানুষ ভাবে App তো চলছে, দোষ নিশ্চয়ই
                Firewall এর।
              </ContentParagraph>
              <ContentParagraph>
                কোন Framework ডিফল্টে কোথায় বসে তা Tool ভেদে আলাদা, আর Version
                ভেদে বদলায়ও, তাই মুখস্থ না করে চালু হওয়ার সময় Terminal এ যা
                ছাপা হয় সেটা পড়ুন। সেখানে Local আর Network নামে দুইটা ঠিকানা
                দেখালে বুঝবেন সব দরজা খোলা। শুধু localhost দেখালে বুঝবেন ভেতরের
                দরজাই খোলা। অনেক Dev Server, যেমন Vite, নিরাপত্তার জন্য ডিফল্টে
                শুধু localhost এ বসে, আর ফোন থেকে দেখতে চাইলে আলাদা করে --host
                দিতে হয়। সবচেয়ে নির্ভরযোগ্য উপায় হলো অনুমান না করে lsof বা ss
                দিয়ে দেখে নেওয়া, যেমনটা উপরে করলেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "0.0.0.0 সব সমস্যার সমাধান নয়, অর্ধেক সময় এটাই সমস্যা",
          content: (
            <p>
              বাইরে থেকে খুলছে না দেখে সব কিছু 0.0.0.0 তে বসিয়ে দেওয়াটা একটা
              চেনা অভ্যাস, আর বিপজ্জনক। Database, Redis, Admin Panel বা Debug
              এর Port 0.0.0.0 তে বসলে আর Firewall এ একটা ফাঁক থাকলেই সেটা পুরো
              Internet এর সামনে খোলা। নিয়মটা উল্টো দিক থেকে ভাবুন। প্রতিটা
              Service এর ডিফল্ট হোক 127.0.0.1, আর শুধু সেই একটা বা দুইটা
              Service 0.0.0.0 তে যাক যাদের সত্যিই বাইরের দুনিয়ার সাথে কথা বলতে
              হয়। সাধারণ একটা Server এ সেটা শুধু Reverse Proxy আর SSH। নিজের
              ল্যাপটপেও এটা খাটে। ক্যাফের Wi-Fi এ বসে 0.0.0.0 তে চলা Dev Server
              ওই Wi-Fi এর সবাই খুলতে পারে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "docker",
      subHeader: { index: "009", title: "Containers" },
      title: <SectionTitle>Docker এ একই গল্প, আরেক ধাপ ভেতরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Docker এর পুরো মডিউল পরে আসবে, কিন্তু Bind Address এর এই ফাঁদটা
                Docker এ এত বেশি মানুষকে ধরে যে এখানেই একবার দেখে রাখা দরকার।
                এখনকার জন্য এটুকু জানলেই চলবে: Container হলো আপনার যন্ত্রের
                ভেতরে একটা আলাদা করে রাখা ছোট পরিবেশ, যার নিজের Network আছে।
                নিজের Network মানে নিজের IP, নিজের Port এর খাতা, আর সবচেয়ে
                জরুরি, নিজের আলাদা 127.0.0.1।
              </ContentParagraph>
              <ContentParagraph>
                বিল্ডিংয়ের উপমায় ভাবলে, Container হলো আপনার বিল্ডিংয়ের ভেতরে আরেকটা
                ছোট বিল্ডিং। ছোট বিল্ডিংয়ের ভেতরের দরজা শুধু ছোট বিল্ডিংয়ের
                বাসিন্দাদের জন্য। এখান থেকে দুইটা ফল বেরোয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>
                    Container এর ভেতরের App কে 0.0.0.0 তে বসতে হয়।
                  </strong>{" "}
                  App যদি Container এর ভেতরে 127.0.0.1 এ বসে, তাহলে সে শুধু ওই
                  Container এর ভেতর থেকে পৌঁছানো যায়। আপনার নিজের যন্ত্রও তখন
                  বাইরের লোক। ল্যাপটপে চলত, Docker এ তুলতেই বন্ধ, এই অভিযোগের
                  সবচেয়ে সাধারণ কারণ এটাই।
                </ListItem>
                <ListItem>
                  <strong>
                    Container এর Port আর আপনার যন্ত্রের Port আলাদা খাতা।
                  </strong>{" "}
                  Container এর ভেতরে 3000 এ কিছু বসলে আপনার যন্ত্রের 3000 এ কিছুই
                  বসে না। দুইটাকে জুড়তে হয় আলাদা করে বলে, যাকে বলে Port
                  Publishing বা Port Mapping। Module 03 এর Port Forwarding এর
                  সাথে এটা হুবহু এক ধারণা, শুধু Router এর জায়গায় Docker।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "docker-ports.sh",
          code: `# -p  HOST_PORT:CONTAINER_PORT
docker run -p 8080:3000 my-tours
#             ^^^^ আপনার যন্ত্রের Port     ^^^^ Container এর ভেতরের Port
# এখন যন্ত্রের 8080 এ যা আসে Docker সেটা Container এর 3000 এ পৌঁছে দেয়।
# Browser এ খুলবেন localhost:8080, 3000 নয়।

# শুধু -p 8080:3000 লিখলে যন্ত্রের দিকে Bind হয় 0.0.0.0 তে, মানে সব দরজায়।
# শুধু নিজের যন্ত্র থেকে চাইলে IP সহ লিখুন:
docker run -p 127.0.0.1:8080:3000 my-tours

# কোন Container কোন Port বাইরে দিয়েছে
docker ps
# PORTS ঘরে দেখাবে:  0.0.0.0:8080->3000/tcp

# আর Container এর ভেতরের App কে সব দরজায় বসাতে
docker run -e HOST=0.0.0.0 -e PORT=3000 -p 127.0.0.1:8080:3000 my-tours`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "docker-compose এর ports লাইনটা একটা Firewall এর ফুটো হতে পারে",
          content: (
            <p>
              অনেক Tutorial এ Database এর জন্য লেখা থাকে ports এ 5432:5432। এর
              মানে যন্ত্রের সব দরজায় 5432 খুলে দেওয়া। Linux Server এ Docker
              নিজে Kernel এর Firewall নিয়মে সরাসরি লাইন বসায়, আর সেই লাইনগুলো
              ufw এর মতো সহজ Firewall Tool এর নিয়মের আগে কাজ করে। ফলে ufw তে
              5432 বন্ধ দেখালেও বাইরে থেকে সেটা খোলা থাকতে পারে। নিরাপদ অভ্যাস
              দুইটা। Database এর Port একদমই বাইরে না দেওয়া, কারণ একই Compose
              ফাইলের App তাকে ভেতরের Network দিয়েই পায়। আর নিজে দেখার জন্য
              দিতেই হলে 127.0.0.1:5432:5432 লেখা। তারপর বাইরের একটা যন্ত্র থেকে
              nc দিয়ে যাচাই করে নেওয়া, যেটা একটু পরে শিখবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "eaddrinuse",
      subHeader: { index: "010", title: "EADDRINUSE" },
      title: <SectionTitle>address already in use, আর দখলদারকে খুঁজে বের করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনের শুরুর দ্বিতীয় সমস্যা। আপনি App চালু করতে গেলেন আর
                পেলেন EADDRINUSE। নামটা ভেঙে পড়লে আর ভয় লাগে না। E মানে Error,
                ADDR মানে Address, INUSE মানে ব্যবহার হচ্ছে। Kernel বলছে, আপনি
                যে IP আর Port এর জোড়াটা চাইলেন, সেখানে আগে থেকেই একটা Listening
                Socket আছে, আর এক জোড়ায় দুইটা হয় না। Error টা ইচ্ছা করে Address
                বলে, Port নয়, কারণ দখল হয় পুরো জোড়াটা।
              </ContentParagraph>
              <ContentParagraph>
                নিজে বানিয়ে দেখুন। আগের অংশের Server টা একবার চালু রেখে আরেকটা
                Terminal এ হুবহু একই কমান্ড আবার চালান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "eaddrinuse.sh",
          code: `HOST=127.0.0.1 PORT=3977 node server.js & SP=$!
sleep 1
HOST=127.0.0.1 PORT=3977 node server.js
# listen failed: EADDRINUSE listen EADDRINUSE: address already in use 127.0.0.1:3977

# ---- কে বসে আছে?  macOS আর Linux দুইটাতেই চলে
lsof -nP -iTCP:3977 -sTCP:LISTEN
# COMMAND   PID     USER   FD   TYPE  ...  NAME
# node    20081 devripon   12u  IPv4  ...  TCP 127.0.0.1:3977 (LISTEN)
#         ^^^^^ এই সংখ্যাটাই দরকার, Process ID

# ---- Linux এ আরও চলতি উপায়
ss -ltnp | grep 3977          # l=listening t=tcp n=সংখ্যায় p=process
sudo ss -ltnp | grep 3977     # অন্য ইউজারের Process হলে sudo ছাড়া নাম দেখায় না

# ---- Windows এ (PowerShell বা cmd)
netstat -ano | findstr :3977  # শেষ ঘরে PID
tasklist /FI "PID eq 20081"   # PID টা কোন Program

# ---- Process টা আসলে কী, দেখে নিন, তারপর থামান
ps -p 20081 -o pid,command
kill 20081                    # ভদ্রভাবে থামতে বলা (SIGTERM)
# Windows:  taskkill /PID 20081 /F`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                lsof নামটা এসেছে list open files থেকে। Socket ও যেহেতু Process
                এর কাছে একটা খোলা ফাইলের মতো, lsof তাকেও দেখায়। -n আর -P দুইটা
                Flag সবসময় দিন, এরা IP আর Port কে নামে বদলাতে মানা করে। না দিলে
                lsof প্রতিটা IP র জন্য উল্টো DNS খোঁজে আর কমান্ডটা অনেকক্ষণ ঝুলে
                থাকে, আর Port 3306 এর জায়গায় mysql লেখা দেখে আপনি খুঁজে পান না।
              </ContentParagraph>
              <ContentParagraph>
                দখলদার সাধারণত এই চারজনের একজন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আপনার নিজের আগের Process:</strong> সবচেয়ে সাধারণ।
                  Terminal টা বন্ধ করেছিলেন কিন্তু Server টা থামেনি, বা Editor
                  এর আরেকটা জানালায় সেটা এখনো চলছে।
                </ListItem>
                <ListItem>
                  <strong>একটা Watch Mode এর সন্তান Process:</strong> nodemon
                  বা এই জাতীয় Tool যে Process চালায়, মূল Tool টা মরলেও সেটা
                  কখনো কখনো থেকে যায়।
                </ListItem>
                <ListItem>
                  <strong>একদম অন্য একটা Program:</strong> যন্ত্রে আগে থেকেই
                  কিছু একটা ওই নম্বরে বসে। macOS এ AirPlay Receiver Port 5000 আর
                  7000 নিয়ে রাখে, যে কারণে Python এর Flask চালাতে গিয়ে অনেকে
                  প্রথম দিনেই আটকান। উপরের lsof Output এও ControlCenter কে 7000
                  এ দেখা গেছে।
                </ListItem>
                <ListItem>
                  <strong>কেউ না, শুধু একটা সদ্য মরা Connection এর ছায়া:</strong>{" "}
                  Server থামিয়ে সাথে সাথে চালু করলে কখনো কখনো এই Error আসে অথচ
                  lsof কাউকে দেখায় না। এটা TIME_WAIT নামের একটা State এর কাজ,
                  আর এটা পরের লেসন Connection Close এর মূল গল্প। এখন শুধু জেনে
                  রাখুন, বেশির ভাগ Server Framework, Node সহ, SO_REUSEADDR নামের
                  একটা সুইচ চালু রেখে এটা এড়িয়ে যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "না দেখে kill -9 নয়, আর Port বদলে পালানোও নয়",
          content: (
            <p>
              Internet এ এই Error এর সবচেয়ে চলতি উত্তর হলো এক লাইনে Port এর সব
              কিছু kill -9 করে দেওয়া। দুইটা কারণে এটা খারাপ অভ্যাস। প্রথমত, আপনি
              দেখেননি কাকে মারছেন। নিজের ল্যাপটপে সেটা একটা পুরনো Dev Server,
              কিন্তু একটা আসল Server এ সেটা চালু থাকা Production App বা Database
              হতে পারে। আগে ps দিয়ে দেখুন Process টা কী। দ্বিতীয়ত, -9 মানে
              SIGKILL, যেটা Process কে কিছু গুছিয়ে নেওয়ার সুযোগ দেয় না। সাধারণ
              kill আগে চেষ্টা করুন। আর উল্টো ভুলটাও করবেন না, মানে Port 3000
              ব্যস্ত দেখে চুপচাপ 3001 এ চলে যাওয়া। তাতে পুরনো Process টা থেকেই
              যায়, Memory খায়, আর কিছুদিন পরে আপনি আবিষ্কার করেন যন্ত্রে একই
              App এর ছয়টা পুরনো কপি চলছে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একটা অদ্ভুত অবস্থা: দুইজন একই Port এ, Error ছাড়াই",
          content: (
            <p>
              এই লেসনের পরীক্ষা চালানোর সময় macOS এ একটা জিনিস ধরা পড়েছে, যেটা
              জেনে রাখলে একদিন অনেক সময় বাঁচবে। একটা Server 127.0.0.1:3977 এ
              চালু থাকা অবস্থায় আরেকটা Server 0.0.0.0:3977 এ চালু করা গেছে, কোনো
              EADDRINUSE ছাড়াই। lsof এ দুইটাই LISTEN দেখিয়েছে। তখন localhost এ
              করা অনুরোধ গেছে প্রথমটায়, আর Wi-Fi এর IP তে করা অনুরোধ গেছে
              দ্বিতীয়টায়, কারণ Kernel সবচেয়ে নির্দিষ্ট মিলটা বেছে নেয়। Linux
              সাধারণত এই অবস্থা হতে দেয় না আর EADDRINUSE দেয়। শিক্ষাটা হলো, Code
              বদলালেন অথচ Browser এ পুরনো উত্তর আসছে, এমন হলে lsof দিয়ে দেখুন
              ওই Port এ আসলে কয়জন বসে আছে আর কে কোন দরজায়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "privileged",
      subHeader: { index: "011", title: "Privileged Ports" },
      title: <SectionTitle>১০২৪ এর নিচে বসতে অনুমতি লাগে কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                OS Networking লেসনে এক লাইনে বলা হয়েছিল, ১০২৪ এর নিচের Port এ
                সাধারণ ইউজার বসতে পারে না, EACCES আসে। এবার কেন, আর Production এ
                তাহলে 443 এ কীভাবে বসা হয়।
              </ContentParagraph>
              <ContentParagraph>
                নিয়মটা এসেছে সেই সময় থেকে, যখন একটা বড় কম্পিউটার অনেক মানুষ ভাগ
                করে ব্যবহার করত। ভাবুন বিশ্ববিদ্যালয়ের একটা যন্ত্রে একশো ছাত্রের
                Account। তাদের যে কেউ যদি Port 25 এ একটা নকল Mail Server বা Port
                23 এ একটা নকল Login Program বসাতে পারত, অন্যদের Password চুরি
                করা হতো এক মিনিটের কাজ। তাই নিয়ম হলো, চেনা Service এর Port গুলোতে
                শুধু যন্ত্রের প্রশাসক, মানে root, বসতে পারবে। ওই Port এ কিছু
                উত্তর দিলে ধরে নেওয়া যেত সেটা প্রশাসকের বসানো আসল Service। এই
                কারণে ০ থেকে ১০২৩ কে Privileged Port ও বলা হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "privileged-port.sh",
          code: `HOST=127.0.0.1 PORT=80 node server.js
# listen failed: EACCES listen EACCES: permission denied 127.0.0.1:80

# EACCES  = অনুমতি নেই।   EADDRINUSE = কেউ আগে থেকে বসে আছে।
# দুইটা আলাদা Error, আলাদা সমাধান। গুলিয়ে ফেলবেন না।

# Linux এ সীমাটা কোথায়, দেখা যায়
sysctl net.ipv4.ip_unprivileged_port_start
# net.ipv4.ip_unprivileged_port_start = 1024

# একটা নির্দিষ্ট Program কে শুধু এই একটা ক্ষমতা দেওয়া, পুরো root নয় (Linux)
sudo setcap 'cap_net_bind_service=+ep' /usr/bin/node`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে আসল Server এ App কীভাবে 443 এ পৌঁছায়? সোজা উত্তর, sudo
                দিয়ে node চালানো, সবচেয়ে খারাপ উত্তর। root হিসেবে চলা একটা App এ
                একটা নিরাপত্তার ফাঁক পেলে আক্রমণকারী পুরো যন্ত্রের মালিক হয়ে
                যায়। বাস্তবে চারটা পথ ব্যবহার হয়, ভালো থেকে চলনসই ক্রমে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সামনে Reverse Proxy:</strong> সবচেয়ে প্রচলিত। nginx
                  বা Caddy 80 আর 443 এ বসে, আর আপনার App সাধারণ ইউজার হিসেবে
                  127.0.0.1:3000 এ। nginx নিজে root হিসেবে শুধু Port টা নেয়,
                  তারপর আসল কাজ করে কম ক্ষমতার একটা ইউজার হয়ে। এই লেসনের শেষ
                  দিকে এর ছবি আছে।
                </ListItem>
                <ListItem>
                  <strong>Capability:</strong> Linux এ root এর ক্ষমতা ছোট ছোট
                  টুকরোয় ভাগ করা। cap_net_bind_service নামের টুকরোটা শুধু নিচু
                  Port এ বসার অনুমতি দেয়, আর কিছু নয়। উপরের setcap কমান্ড এটাই
                  করে।
                </ListItem>
                <ListItem>
                  <strong>Service Manager:</strong> systemd নিজে root হিসেবে
                  Port টা খুলে তৈরি Socket টা আপনার App এর হাতে দিতে পারে। Linux
                  মডিউলে systemd এর সাথে পরিচয় হবে।
                </ListItem>
                <ListItem>
                  <strong>সীমাটাই নামিয়ে দেওয়া:</strong>{" "}
                  ip_unprivileged_port_start এর মান কমিয়ে দিলে সবাই নিচু Port এ
                  বসতে পারে। Container এর ভেতরে এটা প্রায়ই করা থাকে, কারণ
                  সেখানে যন্ত্রটা আর অনেক মানুষের ভাগের নয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "macOS এ এই নিয়মটা আধখানা, তাই ল্যাপটপ আর Server এ ফল আলাদা হতে পারে",
          content: (
            <p>
              উপরের EACCES টা এই যন্ত্রে, macOS এ, 127.0.0.1 এর Port 80 চেয়ে
              পাওয়া। কিন্তু একই যন্ত্রে HOST=0.0.0.0 দিয়ে Port 80 চাইলে Server
              টা sudo ছাড়াই চালু হয়ে গেছে। নতুন macOS সব দরজার জন্য এই পুরনো
              নিয়মটা তুলে দিয়েছে, শুধু নির্দিষ্ট ঠিকানার বেলায় রেখেছে। Linux
              Server এ কিন্তু দুই ক্ষেত্রেই EACCES পাবেন। এখান থেকে একটা বড়
              শিক্ষা নিন। আমার ল্যাপটপে চলেছে মানেই Server এ চলবে, এই ধারণা
              Port এর বেলায় খাটে না, কারণ নিয়মটা Kernel এর, আর দুই যন্ত্রের
              Kernel আলাদা।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "limits",
      subHeader: { index: "012", title: "Limits" },
      title: <SectionTitle>কখন Port ফুরায়, কখন Socket ফুরায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                4-tuple এর অংশে বলেছিলাম, Server এ নতুন Client এলে Port খরচ হয়
                না। তাহলে কি Port কখনো ফুরায় না? ফুরায়, কিন্তু উল্টো দিকে, Client
                এর দিকে। আর Server এর দিকে ফুরায় অন্য একটা জিনিস। দুইটাই আসল
                Production এ দেখা যায়, আর দুইটার Error Message দেখে চিনতে পারা
                দরকার।
              </ContentParagraph>
              <ContentParagraph>
                <strong>প্রথম সীমা, Ephemeral Port Exhaustion।</strong> Exhaustion
                মানে ফুরিয়ে যাওয়া। 4-tuple এর চারটা ঘরের কথা ভাবুন। একটা Client
                যখন বারবার একই গন্তব্যে যায়, তখন তিনটা ঘর স্থির: নিজের IP,
                গন্তব্যের IP, গন্তব্যের Port। বদলাতে পারে শুধু একটা, নিজের Source
                Port। আর সেটা আসে Ephemeral পাড়া থেকে, Linux এ যার আকার প্রায়
                আটাশ হাজার। মানে একটা যন্ত্র থেকে একটা নির্দিষ্ট IP আর Port এ
                একসাথে আটাশ হাজারের বেশি Connection খোলাই যায় না।
              </ContentParagraph>
              <ContentParagraph>
                একজন মানুষের ল্যাপটপে এটা কখনো ঘটে না। ঘটে সেই যন্ত্রে যে নিজে
                অনেকের হয়ে একটা জায়গায় Client হয়। তিনটা চেনা উদাহরণ: একটা
                Reverse Proxy যে সব অনুরোধ পেছনের একটাই App এ পাঠায়, একটা App
                যে প্রতিটা অনুরোধে Database বা অন্য একটা API তে নতুন Connection
                খোলে আর বন্ধ করে, আর একটা Load Test Tool। পরের লেসনে দেখবেন বন্ধ
                হওয়া Connection এর Port কিছুক্ষণ TIME_WAIT এ আটকে থাকে, তাই
                দ্রুত খোলা আর বন্ধ করলে পাড়াটা আরও তাড়াতাড়ি ফুরায়। তখন যে Error
                আসে তার নাম EADDRNOTAVAIL, address not available, বা Linux এ
                cannot assign requested address।
              </ContentParagraph>
              <ContentParagraph>
                সমাধানটা আপনি আগের লেসনগুলো থেকেই জানেন। প্রতিবার নতুন Connection
                না খুলে খোলা Connection আবার ব্যবহার করা, মানে Keep-Alive আর
                Connection Pool। Handshake লেসনে এটা ছিল সময় বাঁচানোর কৌশল, এখন
                দেখলেন এটা Port বাঁচানোর কৌশলও। পঞ্চাশটা Connection এর একটা Pool
                দিয়ে লাখ লাখ অনুরোধ পাঠানো যায়, খরচ মাত্র পঞ্চাশটা Port।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দ্বিতীয় সীমা, File Descriptor।</strong> Linux আর macOS এ
                একটা Process এর কাছে প্রতিটা খোলা জিনিস, ফাইল হোক বা Socket,
                একটা ছোট সংখ্যা দিয়ে চেনা যায়, যার নাম File Descriptor, সংক্ষেপে
                fd। lsof এর Output এ FD ঘরে 12, 13, 14 দেখেছিলেন, ওগুলোই। প্রতিটা
                Process কতগুলো fd খোলা রাখতে পারবে তার একটা সীমা আছে, আর অনেক
                Linux এ ডিফল্ট সীমাটা মাত্র ১০২৪। দশ হাজার পর্যটক মানে দশ হাজার
                Connected Socket, মানে দশ হাজার fd। সীমা ছুঁলে Error আসে EMFILE,
                too many open files, আর Server নতুন কাউকে নিতে পারে না, যদিও CPU
                আর Memory দুইটাই ফাঁকা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "limits.sh",
          code: `# এই Shell থেকে চালু হওয়া Process কতগুলো fd খুলতে পারে
ulimit -n        # নরম সীমা, যেটা কার্যকর
ulimit -Hn       # শক্ত সীমা, নরমটা এর বেশি তোলা যায় না
# সংখ্যাটা যন্ত্রভেদে আলাদা। অনেক Linux এ নরম সীমা 1024।

# একটা চালু Process এখন কয়টা খুলে রেখেছে
lsof -p 20081 | wc -l

# Linux এ চালু Process এর আসল সীমা
cat /proc/20081/limits | grep "open files"

# এই Shell এর জন্য সীমা তোলা
ulimit -n 65536

# Linux এ কয়টা Ephemeral Port আছে, হিসাব করে
cat /proc/sys/net/ipv4/ip_local_port_range
# 32768  60999      ->  60999 - 32768 + 1 = 28232 টা`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Error", "পুরো কথা", "আসল মানে", "প্রথমে কী দেখবেন"],
          rows: [
            [mono("EADDRINUSE"), "address already in use", "এই IP আর Port এ আগে থেকেই কেউ Listen করছে", "lsof বা ss দিয়ে দখলদার"],
            [mono("EACCES"), "permission denied", "১০২৪ এর নিচের Port, root ছাড়া", "Port নম্বর, আর কোন ইউজার"],
            [mono("EADDRNOTAVAIL"), "address not available", "যে IP চাইলেন তা এই যন্ত্রের নয়, বা Ephemeral Port ফুরিয়েছে", "Bind এর IP, তারপর Connection Pool"],
            [mono("EMFILE"), "too many open files", "Process এর File Descriptor এর সীমা শেষ", "ulimit -n, আর কোথাও Socket বন্ধ হচ্ছে না কি না"],
            [mono("ECONNREFUSED"), "connection refused", "ওই IP আর Port এ কেউ Listen করছে না", "App চালু তো, Bind Address কী"],
            [mono("ETIMEDOUT"), "operation timed out", "কোনো উত্তরই আসেনি", "Firewall বা Security Group"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "প্রথম চারটা Server চালু করতে গিয়ে, শেষ দুইটা Client হয়ে যেতে গিয়ে",
          content: (
            <p>
              ছকটা দুই ভাগে পড়ুন। EADDRINUSE আর EACCES আসে bind বা listen এর
              সময়, মানে আপনি বসতে গিয়ে পারেননি। ECONNREFUSED আর ETIMEDOUT আসে
              connect এর সময়, মানে আপনি কারো কাছে যেতে গিয়ে পারেননি। শেষ
              দুইটার তফাত Three-way Handshake লেসনে বিস্তারিত দেখেছেন: refused
              মানে ওপাশ থেকে RST এসেছে, timeout মানে SYN এর কোনো জবাবই আসেনি।
              এই লেসন তাতে যোগ করল কেন RST আসে, Port এ কেউ নেই বলে, অথবা কেউ
              আছে কিন্তু অন্য দরজায়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "firewall",
      subHeader: { index: "013", title: "Firewall" },
      title: <SectionTitle>Port খোলা মানে আসলে তিনটা গেট পার হওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Port খোলা আছে কি না, এই প্রশ্নটা শুনতে সহজ, কিন্তু এর ভেতরে
                তিনটা আলাদা প্রশ্ন লুকানো। বাইরের একটা অনুরোধকে আপনার App
                পর্যন্ত পৌঁছাতে তিনটা গেট পার হতে হয়, আর তিনটার দায়িত্ব তিন
                জায়গায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>গেট ১, Firewall:</strong> অনুরোধটাকে যন্ত্রে ঢুকতে
                  দেওয়া হচ্ছে তো? Firewall হলো গেটের দারোয়ান, যার হাতে একটা
                  তালিকা, কোন Port এ কে ঢুকতে পারবে। তালিকায় না থাকলে সে চুপচাপ
                  ফিরিয়ে দেয়, কোনো উত্তর না দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>গেট ২, Process:</strong> ওই Port এ কোনো Program আদৌ
                  Listen করছে তো?
                </ListItem>
                <ListItem>
                  <strong>গেট ৩, Bind Address:</strong> সে কি এই দরজায় কান
                  পেতেছে, নাকি শুধু ভেতরের দরজায়?
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Firewall আবার দুই জায়গায় থাকতে পারে, আর দুইটাই পার হতে হয়। একটা
                যন্ত্রের ভেতরে, Kernel এর অংশ হিসেবে। Linux এ এটা সাধারণত ufw বা
                firewalld নামের Tool দিয়ে চালানো হয়। আরেকটা যন্ত্রের বাইরে,
                Cloud এর Network এ, Packet যন্ত্রে পৌঁছানোর আগেই। AWS এ এর নাম
                Security Group, অন্য Cloud এ Firewall Rule বা Network Security
                Group, DigitalOcean আর Hetzner এ Cloud Firewall। নাম আলাদা হলেও
                প্রতিটা নিয়মে একই তিনটা ঘর থাকে, আর এই তিনটা এখন আপনি পুরোপুরি
                পড়তে পারেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Protocol", "Port", "Source", "কেন"],
          rows: [
            ["TCP", mono("22"), "শুধু আপনার নিজের IP", "SSH। পুরো পৃথিবীর জন্য খোলা রাখলে দিনরাত Password আন্দাজের চেষ্টা চলে"],
            ["TCP", mono("80"), "0.0.0.0/0, মানে সবাই", "HTTP, যাতে 443 এ পাঠিয়ে দেওয়া যায় আর SSL Certificate যাচাই হয়"],
            ["TCP", mono("443"), "0.0.0.0/0, মানে সবাই", "HTTPS, আসল সাইট"],
            ["UDP", mono("443"), "0.0.0.0/0, ঐচ্ছিক", "HTTP/3 চালু করলে"],
            ["TCP", mono("3000, 5432, 6379"), "কোনো নিয়মই নয়", "App আর Database ভেতরের জিনিস, বাইরে থেকে পৌঁছানোর দরকার নেই"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Source ঘরের 0.0.0.0/0 টা Subnet লেসনের CIDR লেখা, /0 মানে কোনো
                Bit ই মেলাতে হবে না, তাই সব IP। এখানে 0.0.0.0 এর মানে Bind
                Address এর 0.0.0.0 থেকে একটু আলাদা, সেখানে ছিল আমার সব ঠিকানা,
                এখানে পৃথিবীর সব ঠিকানা। দুই জায়গাতেই এটা সব বোঝানোর সংকেত।
                Firewall এর ডিফল্ট নিয়ম সাধারণত, যা তালিকায় নেই তা বন্ধ। তাই
                আপনার কাজ শুধু যেটুকু দরকার সেটুকু খোলা। উপরের ছকটাই একটা সাধারণ
                Web Server এর পুরো তালিকা।
              </ContentParagraph>
              <ContentParagraph>
                এবার তিনটা গেট নিয়ে নিজে খেলুন। চারটা সুইচ ঘুরিয়ে দেখুন কোন
                অবস্থায় কোন Error আসে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ReachabilityLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাইরে থেকে একটা Port এ পৌঁছানো যায় কি না দেখার সবচেয়ে সহজ Tool
                হলো nc, পুরো নাম netcat। -z দিলে সে শুধু Handshake টা করে দেখে,
                কোনো Data পাঠায় না, আর -v দিলে ফলটা লিখে জানায়। তিন রকম ফল পাওয়া
                যায়, আর তিনটা তিন গেটের কথা বলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "probe-a-port.sh",
          code: `# -G 3 মানে Connect এর জন্য সর্বোচ্চ ৩ সেকেন্ড (macOS)। Linux এ -w 3 লিখুন।

# ১. খোলা, কেউ Listen করছে
nc -vz -G 3 example.com 443
# Connection to example.com port 443 [tcp/https] succeeded!

# ২. পৌঁছানো গেছে, কিন্তু Port এ কেউ নেই
nc -vz -G 3 127.0.0.1 3999
# nc: connectx to 127.0.0.1 port 3999 (tcp) failed: Connection refused
# সাথে সাথে উত্তর। গেট ২ বা ৩ এ আটকেছে।

# ৩. কোনো উত্তরই নেই
nc -vz -G 3 example.com 81
# nc: connectx to example.com port 81 (tcp) failed: Operation timed out
# তিন সেকেন্ড নীরবতা, তারপর হাল ছাড়া। গেট ১ এ আটকেছে।

# Linux এ যন্ত্রের ভেতরের Firewall এ Port খোলা (ufw থাকলে)
sudo ufw allow 443/tcp
sudo ufw status`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "যাচাই সবসময় বাইরে থেকে, আর সবসময় ভেতর থেকে বাইরের দিকে খুঁজুন",
          content: (
            <p>
              বাইরে থেকে খুলছে না, এই সমস্যায় একটা নির্দিষ্ট ক্রম ধরে এগোলে পাঁচ
              মিনিটে উত্তর পাওয়া যায়। এক, Server এর ভেতরে lsof বা ss দিয়ে দেখুন
              Port এ কেউ Listen করছে কি না, আর কোন ঠিকানায়। কেউ না থাকলে গেট ২,
              127.0.0.1 দেখালে গেট ৩। দুই, Server এর ভেতর থেকেই তার নিজের Public
              বা Private IP দিয়ে curl করুন, localhost দিয়ে নয়। তিন, বাইরের একটা
              যন্ত্র থেকে nc করুন। refused পেলে আবার গেট ২ বা ৩। timed out পেলে
              গেট ১, তখন আগে যন্ত্রের Firewall, তারপর Cloud এর Security Group
              দেখুন। নিজের ল্যাপটপের Browser দিয়ে পরীক্ষা সবার শেষে। DNS মডিউলের
              Propagation লেসনেও একই কথা ছিল, উৎস থেকে নিজের দিকে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "reverse-proxy",
      subHeader: { index: "014", title: "Many Apps, One Port" },
      title: <SectionTitle>একটাই 443, তার পেছনে তিনটা App</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের সব টুকরো এবার একটা বাস্তব প্রশ্নে এসে মেলে। Island
                Tours এর একটাই Server, একটাই Public IP। তাতে চালাতে হবে তিনটা
                জিনিস: মূল সাইট, Admin Panel আর একটা API। তিনটাই পর্যটকের বা
                কর্মীর Browser এ খুলতে হবে https দিয়ে, কোনো Port না লিখে, মানে
                443 এ। কিন্তু 443 একটাই, আর এক জোড়ায় একটাই Listening Socket।
                তিনটা App একই Port এ বসবে কীভাবে?
              </ContentParagraph>
              <ContentParagraph>
                বসবে না। 443 এ বসবে মাত্র একটা Program, যার একমাত্র কাজ সামনে
                দাঁড়িয়ে অনুরোধ নেওয়া আর ঠিক App এর কাছে পৌঁছে দেওয়া। একটা বড়
                অফিসের অভ্যর্থনা টেবিলের কথা ভাবুন। সবাই একই দরজা দিয়ে ঢোকে,
                অভ্যর্থনাকারী জিজ্ঞেস করেন কার কাছে এসেছেন, তারপর ভেতরের ঠিক
                ঘরে পাঠিয়ে দেন। এই Program টার নাম Reverse Proxy, আর nginx,
                Caddy, Traefik সবাই এই কাজ করে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ReverseProxyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অভ্যর্থনাকারী কীভাবে জানে কে কার কাছে এসেছে? TCP বা IP দিয়ে নয়,
                কারণ তিনটা নামের IP আর Port হুবহু এক। সে জানে অনুরোধের ভেতরে লেখা
                নামটা পড়ে, যাকে বলে Host Header। DNS মডিউলের শেষ লেসনে ঠিক এই
                Host Header দিয়েই Tenant চিনেছিলেন, মনে আছে? এটা Application
                Layer এর তথ্য, আর এই কারণেই OSI লেসনের সেই ভাষায় Reverse Proxy
                কে বলা হয় Layer 7 এর জিনিস। শুধু Port দেখে ভাগ করলে সেটা হতো
                Layer 4।
              </ContentParagraph>
              <ContentParagraph>
                ছবিটায় এই লেসনের প্রায় সব ধারণা একসাথে আছে। মিলিয়ে নিন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Bind Address:</strong> শুধু Proxy বসে 0.0.0.0 তে। তিনটা
                  App আর Database সব 127.0.0.1 এ, তাই বাইরে থেকে সরাসরি 3000 বা
                  5432 এ পৌঁছানোর কোনো পথই নেই।
                </ListItem>
                <ListItem>
                  <strong>Privileged Port:</strong> ১০২৪ এর নিচে বসে শুধু Proxy।
                  App গুলো সাধারণ ইউজার হিসেবে উঁচু Port এ চলে, root ছাড়াই।
                </ListItem>
                <ListItem>
                  <strong>দুইটা আলাদা Connection:</strong> পর্যটকের Connection
                  শেষ হয় Proxy তে। Proxy তারপর নিজে Client হয়ে App এর কাছে আরেকটা
                  Connection খোলে, নিজের একটা Ephemeral Port থেকে। তাই App এর
                  খাতায় Client এর IP দেখায় 127.0.0.1, পর্যটকের আসল IP নয়। আসল
                  IP টা Proxy একটা Header এ লিখে পাঠায়, যেটা HTTP মডিউলে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>Port Exhaustion:</strong> Proxy থেকে একটা App এ যাওয়ার
                  পথটাই সেই জায়গা, যেখানে তিনটা ঘর স্থির আর শুধু Source Port
                  বদলায়। তাই ব্যস্ত Proxy তে পেছনের দিকে Keep-Alive চালু রাখা
                  জরুরি।
                </ListItem>
                <ListItem>
                  <strong>Firewall:</strong> বাইরের জন্য খোলা শুধু 22, 80 আর
                  443। বাকি সব বন্ধ, দুই স্তরে, Bind Address এও আর Firewall এও।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "nginx",
          filename: "islandtours.conf",
          code: `# এখন শুধু আকারটা দেখুন, nginx এর পুরো মডিউল পরে আসছে।
# SSL Certificate এর লাইনগুলো এখানে বাদ দেওয়া।

server {
    listen 443 ssl;                       # 0.0.0.0:443, সব দরজায়
    server_name islandtours.example;      # Host Header এ এই নাম এলে
    location / {
        proxy_pass http://127.0.0.1:3000; # তাহলে ভেতরের এই App এ যাবে
    }
}

server {
    listen 443 ssl;                       # একই Port, আরেকটা নাম
    server_name admin.islandtours.example;
    location / {
        proxy_pass http://127.0.0.1:3001;
    }
}

# দুইটা server ব্লক, কিন্তু Listening Socket একটাই, nginx এর।
# নাম দেখে ভাগ হয় nginx এর ভেতরে, Kernel এ নয়।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একই যন্ত্রে কথা বলার আরেকটা পথ, যেখানে Port ই লাগে না",
          content: (
            <p>
              Config ফাইলে কখনো কখনো IP আর Port এর জায়গায় একটা ফাইলের পথ দেখবেন,
              যেমন unix:/run/app.sock। এটা Unix Domain Socket। একই যন্ত্রের
              দুইটা Program যখন কথা বলে, তখন IP, Port, Segment, এসবের কোনো দরকার
              নেই, কারণ Data যন্ত্র ছেড়ে যাচ্ছেই না। তখন ঠিকানা হিসেবে একটা
              ফাইলের নাম ব্যবহার করা যায়, আর কে ওই ফাইলে লিখতে পারবে তা ফাইলের
              সাধারণ অনুমতি দিয়েই ঠিক হয়। PostgreSQL, Docker আর অনেক App Server
              এই পথ ব্যবহার করে। ব্যবহার করার জিনিসটা সেই একই Socket, শুধু
              ঠিকানার ধরন আলাদা। Socket আর Port যে এক জিনিস নয়, এটা তার সবচেয়ে
              পরিষ্কার প্রমাণ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Port এর মানচিত্র</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Server হাতে পেলে একজন অভিজ্ঞ মানুষ প্রথম যে কাজটা করেন তা
                হলো একটা ছক বানানো: কোন Port এ কে বসে, কোন দরজায়, আর কে তার কাছে
                পৌঁছাতে পারে। এই ছকটাকে বলা যায় Port Map। Island Tours এর Server
                103.94.135.2 এর Port Map টা এরকম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Port", "কে", "Bind Address", "Firewall এ", "কে পৌঁছায়"],
          rows: [
            [mono("22/tcp"), "sshd", "0.0.0.0", "শুধু অফিসের IP", "দলের Developer রা"],
            [mono("80/tcp"), "nginx", "0.0.0.0", "সবার জন্য খোলা", "যে কেউ, সাথে সাথে 443 এ পাঠানো হয়"],
            [mono("443/tcp"), "nginx", "0.0.0.0", "সবার জন্য খোলা", "সব পর্যটক"],
            [mono("3000/tcp"), "মূল সাইট (node)", "127.0.0.1", "নিয়ম নেই, বন্ধ", "শুধু nginx"],
            [mono("3001/tcp"), "Admin Panel (node)", "127.0.0.1", "নিয়ম নেই, বন্ধ", "শুধু nginx"],
            [mono("5432/tcp"), "PostgreSQL", "127.0.0.1", "নিয়ম নেই, বন্ধ", "শুধু দুইটা node App"],
            [mono("6379/tcp"), "Redis", "127.0.0.1", "নিয়ম নেই, বন্ধ", "শুধু দুইটা node App"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ছক থেকে চারটা সিদ্ধান্ত পড়া যায়, আর প্রতিটার পেছনে একটা কারণ
                আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>বাইরের দিকে মাত্র তিনটা Port।</strong> যত কম দরজা খোলা,
                  তত কম জায়গা পাহারা দিতে হয়। আক্রমণকারীর কাছে প্রতিটা খোলা Port
                  একটা করে চেষ্টার সুযোগ।
                </ListItem>
                <ListItem>
                  <strong>ভেতরের সব কিছু দুই স্তরে বন্ধ।</strong> 5432 এ Bind
                  Address 127.0.0.1, আবার Firewall এও কোনো নিয়ম নেই। একদিন কেউ
                  ভুল করে Firewall খুলে ফেললেও Database বাইরে থেকে অদৃশ্যই থাকে,
                  আর কেউ ভুল করে Bind Address বদলালেও Firewall আটকায়। একটা ভুল
                  একা কখনো দুর্ঘটনা ঘটাতে পারে না।
                </ListItem>
                <ListItem>
                  <strong>Port আর Host আসে Environment Variable থেকে।</strong>{" "}
                  App এর Code এ কোথাও 3000 লেখা নেই। একই Code ল্যাপটপে, Test এ আর
                  Production এ তিন রকম Port এ চলে, শুধু Config বদলে। আর Variable
                  না থাকলে App চালুই হয় না, চুপচাপ একটা আন্দাজের Port নিয়ে বসে
                  না।
                </ListItem>
                <ListItem>
                  <strong>একসাথে কতজন, তার সীমা জানা।</strong> ছুটির মৌসুমে দশ
                  হাজার পর্যটক মানে nginx এ দশ হাজার Connected Socket, সব 443
                  এ। তাই nginx এর fd সীমা আগে থেকেই তুলে রাখা, আর nginx থেকে node
                  এ যাওয়ার পথে Keep-Alive চালু, যাতে Ephemeral Port না ফুরায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর আমাদের সেই পর্যটক? তাঁর ফোনের 192.168.1.20 এর Port 51514
                থেকে যে Connection রওনা দিয়েছিল, বাসার Router তাকে করেছে
                203.0.113.25 এর 62001, আর সেটা এসে পৌঁছেছে 103.94.135.2 এর 443
                এ, nginx এর হাতে। nginx তারপর নিজের একটা Ephemeral Port থেকে
                127.0.0.1 এর 3000 এ দ্বিতীয় একটা Connection খুলেছে। বুকিংটা
                Database এ লিখতে node তৃতীয় একটা খুলেছে 127.0.0.1 এর 5432 এ। একটা
                বুকিং, তিনটা Connection, তিনটা আলাদা 4-tuple।
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
      title: <SectionTitle>একটা বুকিং, Port আর Socket এর চোখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো যাত্রাটা এবার শুধু Port আর Socket এর দিক থেকে, ধাপে ধাপে।
              প্রতিটা ধাপে খেয়াল করুন কোন Socket তৈরি হলো আর চারটা সংখ্যা কী
              দাঁড়াল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Server চালু হওয়ার সময়, তিনটা Listening Socket",
              description:
                "পর্যটক আসার অনেক আগেই nginx বসেছে 0.0.0.0:443 এ, node বসেছে 127.0.0.1:3000 এ, PostgreSQL বসেছে 127.0.0.1:5432 এ। তিনটা Listening Socket, তিনটারই ওপাশ ফাঁকা। Kernel এর খাতায় তিনটা লাইন।",
            },
            {
              title: "ফোন একটা Socket চায়, Kernel একটা Port দেয়",
              description:
                "পর্যটক বুকিং বোতামে চাপ দিলেন। Browser 103.94.135.2:443 এ Connect করতে বলল। ফোনের Kernel Ephemeral পাড়া থেকে 51514 তুলে দিল। ফোনের দিকে 4-tuple হলো 192.168.1.20:51514 থেকে 103.94.135.2:443।",
            },
            {
              title: "Router এ Source এর জোড়াটা বদলায়",
              description:
                "বাসার Router এর NAT Source কে বদলে করল 203.0.113.25:62001, আর নিজের ছকে লিখে রাখল কোনটা কার। Internet এর বাকি পথে এই নতুন জোড়াটাই চলে।",
            },
            {
              title: "গেট ১, Firewall",
              description:
                "Packet পৌঁছাল Island Tours এর Network এ। Security Group এর তালিকায় TCP 443 সবার জন্য খোলা, তাই ঢুকতে দেওয়া হলো। একই Packet 5432 এর জন্য হলে এখানেই চুপচাপ হারিয়ে যেত।",
            },
            {
              title: "গেট ২ আর ৩, Listening Socket মিলল",
              description:
                "Kernel দেখল গন্তব্য 103.94.135.2:443। খাতায় 0.0.0.0:443 এ nginx এর Listening Socket আছে, আর 0.0.0.0 মানে এই দরজাও। Handshake শেষ হলো, Connection গেল Accept Queue তে।",
            },
            {
              title: "accept, একটা নতুন Connected Socket",
              description:
                "nginx accept করল, Kernel তার হাতে একটা নতুন Socket দিল, একটা নতুন File Descriptor সহ। তার 4-tuple: 203.0.113.25:62001 থেকে 103.94.135.2:443। Listening Socket টা আগের মতোই পরের জনের অপেক্ষায়।",
            },
            {
              title: "nginx নিজে Client হয়",
              description:
                "nginx অনুরোধের Host Header পড়ে দেখল islandtours.example, মানে ভেতরের 3000। সে 127.0.0.1:3000 এ একটা Connection খুলল, নিজের একটা Ephemeral Port থেকে। node এর দিকে আবার একই ঘটনা, accept, নতুন Connected Socket।",
            },
            {
              title: "node যায় Database এ",
              description:
                "বুকিং লিখতে node তার Connection Pool থেকে একটা আগে থেকে খোলা Connection নিল, 127.0.0.1:5432 এ। নতুন Handshake নেই, নতুন Port ও খরচ হলো না।",
            },
            {
              title: "উত্তর ফেরে একই চার সংখ্যা উল্টে",
              description:
                "উত্তরের প্রতিটা Segment এ Source আর Destination জায়গা বদল করে। Server থেকে বেরোয় 103.94.135.2:443 থেকে 203.0.113.25:62001 এ। Router ছক দেখে সেটাকে আবার 192.168.1.20:51514 করে ফোনে পাঠায়। ফোনের Kernel 51514 দেখে ঠিক ওই Tab এর Socket এ Data ফেলে।",
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
                <strong>নিজের যন্ত্রের খাতাটা</strong>, নিচের Lab এর প্রথম
                পরীক্ষায় দেখবেন আপনার যন্ত্রে এই মুহূর্তে কারা কোন Port এ বসে।
                অচেনা নাম পেলে খুঁজে দেখুন, এটাই সবচেয়ে ভালো পাঠ।
              </ListItem>
              <ListItem>
                <strong>IANA Service Name and Port Number Registry</strong>, Port
                এর সরকারি তালিকা, যেখান থেকে /etc/services আসে।{" "}
                <a
                  href="https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  iana.org/assignments/service-names-port-numbers
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 6335</strong>, তিন পাড়ার ভাগটা যেখানে লেখা। পুরোটা
                পড়ার দরকার নেই, শুধু ছয় নম্বর অংশটা।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc6335"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc6335
                </a>
              </ListItem>
              <ListItem>
                <strong>Node.js এর net Module এর Documentation</strong>, listen,
                address আর Socket এর remoteAddress, remotePort যেখানে ব্যাখ্যা
                করা।{" "}
                <a
                  href="https://nodejs.org/api/net.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  nodejs.org/api/net.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Beej&apos;s Guide to Network Programming</strong>, socket,
                bind, listen, accept এই চারটা Syscall নিয়ে সবচেয়ে বিখ্যাত আর
                সবচেয়ে মজা করে লেখা বই, বিনামূল্যে।{" "}
                <a
                  href="https://beej.us/guide/bgnet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  beej.us/guide/bgnet
                </a>
              </ListItem>
              <ListItem>
                <strong>Docker এর Port Publishing এর পাতা</strong>, -p এর সব
                রূপ আর Firewall এর সাথে তার সম্পর্ক।{" "}
                <a
                  href="https://docs.docker.com/engine/network/packet-filtering-firewalls/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  docs.docker.com/engine/network/packet-filtering-firewalls
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
                  IP পৌঁছে দেয় যন্ত্রে, Port পৌঁছে দেয় যন্ত্রের ভেতরের Program
                  এ। Port একটা ১৬ Bit এর সংখ্যা, Transport Layer এর Header এ
                  লেখা, ০ থেকে ৬৫৫৩৫।
                </ListItem>
                <ListItem>
                  তিন পাড়া: Well Known (০ থেকে ১০২৩, root লাগে), Registered (১০২৪
                  থেকে ৪৯১৫১, আপনার App), Ephemeral (৪৯১৫২ থেকে ৬৫৫৩৫, Client এর
                  সাময়িক Port, Linux এ ৩২৭৬৮ থেকে)।
                </ListItem>
                <ListItem>
                  Port এর নম্বর শুধু রীতি। TCP আর UDP র খাতা আলাদা, তাই পুরো
                  পরিচয় 443/tcp।
                </ListItem>
                <ListItem>
                  Socket Address মানে IP আর Port এর জোড়া। একটা Connection মানে
                  চারটা সংখ্যা, 4-tuple, আর Protocol সহ 5-tuple। চারটার একটা
                  আলাদা হলেই Connection আলাদা, তাই এক Port 443 এ হাজারজন।
                </ListItem>
                <ListItem>
                  Server এর হাতে একটা Listening Socket আর প্রতি Client এ একটা
                  Connected Socket। এক জোড়ায় Listening Socket একটাই হয়, নইলে
                  EADDRINUSE।
                </ListItem>
                <ListItem>
                  Bind Address ঠিক করে কোন দরজা খোলা। 127.0.0.1 শুধু ভেতরে,
                  0.0.0.0 সব দরজায়। ভেতরে চলে বাইরে চলে না, এর প্রথম সন্দেহ
                  এটাই। Container এর ভেতরে App কে 0.0.0.0 তে বসতে হয়।
                </ListItem>
                <ListItem>
                  পৌঁছাতে তিন গেট: Firewall, Process, Bind Address। timed out
                  মানে প্রথমটা, refused মানে পরের দুইটার একটা।
                </ListItem>
                <ListItem>
                  ফুরায় দুইটা জিনিস। Client এর দিকে Ephemeral Port
                  (EADDRNOTAVAIL), Server এর দিকে File Descriptor (EMFILE)।
                  দুইটারই প্রথম ওষুধ Connection আবার ব্যবহার করা।
                </ListItem>
                <ListItem>
                  একটা 443 এর পেছনে অনেক App বসাতে সামনে Reverse Proxy, যে Host
                  Header পড়ে ভেতরের 127.0.0.1 এর আলাদা আলাদা Port এ পাঠায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই মডিউলে এ পর্যন্ত আপনি একটা Connection এর জন্ম দেখেছেন
                Handshake এ, তার ভেতরে Data চলা দেখেছেন TCP তে, তার মোড়কগুলো
                দেখেছেন Packet, Segment আর Frame এ, আর এই লেসনে দেখলেন তার
                ঠিকানা। একটা জিনিস বাকি, তার মৃত্যু। এই লেসনে দুইবার TIME_WAIT
                শব্দটা এসেছে, একবার EADDRINUSE এর ছায়া হিসেবে আর একবার Port
                ফুরানোর কারণ হিসেবে, আর দুইবারই বলা হয়েছে পরে বলব। পরের লেসন
                Connection Close (FIN, ACK) সেই পরে। সেখানে দেখবেন একটা
                Connection ভদ্রভাবে কীভাবে শেষ হয়, অভদ্রভাবে শেষ হলে ECONNRESET
                কেন আসে, আর বন্ধ হওয়ার পরেও একটা Port কেন কিছুক্ষণ আটকে থাকে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে", "মনে রাখার কথা"],
    rows: [
      ["Port", "যন্ত্রের ভেতরে কোন Program, তার সংখ্যা", "১৬ Bit, ০ থেকে ৬৫৫৩৫, Transport Header এ"],
      ["Well Known Port", "০ থেকে ১০২৩", "22, 53, 80, 443। বসতে root লাগে"],
      ["Registered Port", "১০২৪ থেকে ৪৯১৫১", "3000, 3306, 5432, 6379। যে কেউ বসতে পারে"],
      ["Ephemeral Port", "Client এর সাময়িক Port", "Kernel বেছে দেয়, Linux এ ৩২৭৬৮ থেকে ৬০৯৯৯"],
      ["Socket Address", "IP আর Port এর জোড়া", "শুধু Port বললে কথাটা আধখানা"],
      ["4-tuple", "Source IP, Source Port, Dest IP, Dest Port", "একটা আলাদা হলেই আলাদা Connection"],
      ["Listening Socket", "নতুন Client এর অপেক্ষায় থাকা Socket", "এক IP আর Port এ একটাই"],
      ["Connected Socket", "একজন Client এর সাথে কথা বলার Socket", "একই Port এ যত খুশি, প্রতিটা একটা fd"],
      ["Bind Address", "কোন IP তে Listen করা হবে", "127.0.0.1 ভেতরে, 0.0.0.0 সব দরজায়"],
      ["EADDRINUSE", "জোড়াটা আগে থেকেই দখল", "lsof -nP -iTCP:PORT -sTCP:LISTEN"],
      ["EACCES", "১০২৪ এর নিচে, root ছাড়া", "Reverse Proxy বা Capability"],
      ["EADDRNOTAVAIL / EMFILE", "Ephemeral Port বা fd শেষ", "Keep-Alive, Pool, ulimit -n"],
      ["Firewall, Security Group", "Protocol, Port আর Source এর তালিকা", "শুধু 22, 80, 443 খোলা"],
      ["Reverse Proxy", "একটা 443 এর পেছনে অনেক App", "Host Header দেখে ভাগ, Layer 7"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Island Tours এর Server এ Port 443 একটাই, অথচ একই মুহূর্তে দশ হাজার পর্যটক যুক্ত। Kernel তাঁদের Connection গুলো আলাদা রাখে কীভাবে?",
        options: [
          {
            key: "A",
            text: "প্রতিটা পর্যটককে Server এ একটা করে আলাদা Port দিয়ে",
            isCorrect: false,
            explanation:
              "না। Server এর দিকে সবার Port সেই একই 443। নতুন Client এলে Server এ নতুন Port খরচ হয় না।",
          },
          {
            key: "B",
            text: "চারটা সংখ্যা একসাথে মিলিয়ে: Source IP, Source Port, Destination IP, Destination Port",
            isCorrect: true,
            explanation:
              "ঠিক। এটাই 4-tuple। গন্তব্যের দুইটা সবার এক হলেও প্রতিটা Client এর IP বা Port আলাদা, তাই প্রতিটা Connection আলাদা।",
          },
          {
            key: "C",
            text: "একজনের কথা শেষ হলে তবে পরের জনকে নিয়ে",
            isCorrect: false,
            explanation:
              "একসাথে হাজার হাজার Connected Socket খোলা থাকতে পারে, সারি ধরে একজন একজন নয়।",
          },
        ],
      },
      {
        id: 2,
        text: "আপনার App Server এ চলছে। Server এর ভেতরে curl localhost:3000 কাজ করে, কিন্তু বাইরে থেকে nc করলে সাথে সাথে Connection refused আসে। সবচেয়ে সম্ভাব্য কারণ কী?",
        options: [
          {
            key: "A",
            text: "Cloud এর Security Group এ Port 3000 বন্ধ",
            isCorrect: false,
            explanation:
              "Firewall বন্ধ থাকলে সাধারণত কোনো উত্তরই আসে না, তাই লক্ষণ হতো timed out, সাথে সাথে refused নয়।",
          },
          {
            key: "B",
            text: "App টা 127.0.0.1 এ Bind করা, তাই বাইরের দরজায় কেউ Listen করছে না",
            isCorrect: true,
            explanation:
              "ঠিক। ভেতরে চলে, বাইরে থেকে সাথে সাথে refused, এই জোড়া লক্ষণ প্রায় সবসময় Bind Address। lsof বা ss এ 127.0.0.1:3000 দেখলে নিশ্চিত।",
          },
          {
            key: "C",
            text: "DNS এখনো ছড়ায়নি",
            isCorrect: false,
            explanation: "IP দিয়ে সরাসরি পরীক্ষা করা হচ্ছে, DNS এখানে নেই।",
          },
        ],
      },
      {
        id: 3,
        text: "listen(3000, \"0.0.0.0\") এ 0.0.0.0 এর মানে কী?",
        options: [
          {
            key: "A",
            text: "এই যন্ত্রের যত IPv4 ঠিকানা আছে সবগুলোতে Listen করা",
            isCorrect: true,
            explanation:
              "ঠিক। এটা কোনো আসল ঠিকানা নয়, একটা সংকেত। lsof এটাকে তারকা দিয়ে দেখায়, *:3000।",
          },
          {
            key: "B",
            text: "শুধু localhost এ Listen করা",
            isCorrect: false,
            explanation: "সেটা 127.0.0.1। 0.0.0.0 তার উল্টো, সবচেয়ে খোলা পছন্দ।",
          },
          {
            key: "C",
            text: "কোথাও Listen না করা",
            isCorrect: false,
            explanation: "শূন্য দেখে এমন মনে হলেও মানেটা সব ঠিকানা।",
          },
        ],
      },
      {
        id: 4,
        text: "App চালু করতে গিয়ে EADDRINUSE পেলেন। প্রথম কাজ কোনটা হওয়া উচিত?",
        options: [
          {
            key: "A",
            text: "Port টা 3001 করে দেওয়া",
            isCorrect: false,
            explanation:
              "তাতে পুরনো Process টা থেকেই যায়, আর কিছুদিন পরে যন্ত্রে একই App এর অনেকগুলো পুরনো কপি জমে।",
          },
          {
            key: "B",
            text: "lsof বা ss দিয়ে দেখা ওই Port এ কোন Process বসে আছে, তারপর সেটা কী তা জেনে সিদ্ধান্ত নেওয়া",
            isCorrect: true,
            explanation:
              "ঠিক। আগে দেখুন কে, তারপর থামান। না দেখে kill -9 করলে একদিন চালু Database মেরে ফেলবেন।",
          },
          {
            key: "C",
            text: "sudo দিয়ে আবার চালানো",
            isCorrect: false,
            explanation:
              "sudo অনুমতির সমস্যা (EACCES) সারায়, দখলের সমস্যা নয়। root হলেও দখল করা জোড়ায় বসা যায় না।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা DNS Server একই সাথে TCP 53 আর UDP 53 এ Listen করছে, কোনো EADDRINUSE ছাড়াই। কেন সম্ভব?",
        options: [
          {
            key: "A",
            text: "DNS এর জন্য একটা বিশেষ ছাড় আছে",
            isCorrect: false,
            explanation: "কোনো ছাড় নয়, যে কোনো Port নম্বরে এটা করা যায়।",
          },
          {
            key: "B",
            text: "TCP আর UDP র Port এর খাতা আলাদা, তাই 53/tcp আর 53/udp দুইটা আলাদা Port",
            isCorrect: true,
            explanation:
              "ঠিক। Kernel আগে দেখে Protocol কোনটা, তারপর সেই খাতায় Port খোঁজে। এই কারণেই Firewall এর নিয়মে Port এর পাশে Protocol লিখতে হয়।",
          },
          {
            key: "C",
            text: "এটা সম্ভব নয়, দুইটা আলাদা যন্ত্র লাগে",
            isCorrect: false,
            explanation: "একই যন্ত্রে একই নম্বরে nc দিয়ে নিজেই করে দেখতে পারেন।",
          },
        ],
      },
      {
        id: 6,
        text: "একটা ব্যস্ত Reverse Proxy হঠাৎ পেছনের App এ যাওয়ার সময় cannot assign requested address (EADDRNOTAVAIL) দিতে শুরু করল। কী ফুরিয়েছে, আর আসল সমাধান কী?",
        options: [
          {
            key: "A",
            text: "Server এর Port 443 ফুরিয়েছে, আরেকটা Port খুলতে হবে",
            isCorrect: false,
            explanation: "443 ফুরায় না, সেটা একটাই আর সব Connected Socket সেটাই ভাগ করে।",
          },
          {
            key: "B",
            text: "Proxy র Ephemeral Port ফুরিয়েছে, কারণ সে প্রতিটা অনুরোধে নতুন Connection খুলছে। সমাধান পেছনের দিকে Keep-Alive বা Connection Pool",
            isCorrect: true,
            explanation:
              "ঠিক। Proxy থেকে একটা App এ যেতে 4-tuple এর তিনটা ঘর স্থির, বদলায় শুধু Source Port, আর সেই পাড়ায় আছে মাত্র হাজার ত্রিশেক নম্বর। Connection আবার ব্যবহার করলে খরচ নেমে আসে হাতে গোনা কয়েকটায়।",
          },
          {
            key: "C",
            text: "Disk ভরে গেছে",
            isCorrect: false,
            explanation: "এই Error টা ঠিকানা নিয়ে, Disk নিয়ে নয়।",
          },
        ],
      },
      {
        id: 7,
        text: "একটা App ল্যাপটপে node দিয়ে চালালে ঠিক চলে। Docker এ docker run -p 8080:3000 দিয়ে চালালে localhost:8080 এ কিছুই আসে না। App এর Log বলছে listening on 127.0.0.1:3000। সমস্যা কোথায়?",
        options: [
          {
            key: "A",
            text: "Container এর ভেতরের 127.0.0.1 শুধু Container এর নিজের, তাই App কে Container এর ভেতরে 0.0.0.0 তে বসতে হবে",
            isCorrect: true,
            explanation:
              "ঠিক। Container এর নিজের আলাদা Loopback আছে। Docker যে অনুরোধ ভেতরে পাঠায় তা Container এর চোখে বাইরে থেকে আসা, আর 127.0.0.1 এ বসা App সেটা শোনে না।",
          },
          {
            key: "B",
            text: "-p তে সংখ্যা দুইটা উল্টো লিখতে হতো, 3000:8080",
            isCorrect: false,
            explanation:
              "ক্রমটা ঠিকই আছে, আগে যন্ত্রের Port, পরে Container এর। উল্টালে যন্ত্রের 3000 কে Container এর 8080 এ জোড়া হতো, যেখানে কেউ নেই।",
          },
          {
            key: "C",
            text: "Docker এ Port 3000 ব্যবহার করা যায় না",
            isCorrect: false,
            explanation: "যে কোনো Port ব্যবহার করা যায়।",
          },
        ],
      },
      {
        id: 8,
        text: "Island Tours এর Server এ PostgreSQL কে নিরাপদ রাখার সবচেয়ে ভালো ব্যবস্থা কোনটা?",
        options: [
          {
            key: "A",
            text: "0.0.0.0:5432 এ বসানো আর একটা খুব শক্ত Password দেওয়া",
            isCorrect: false,
            explanation:
              "শক্ত Password ভালো, কিন্তু Port টা পুরো Internet এর সামনে খোলা রাখার কোনো কারণই নেই। যে দরজা নেই তাতে কেউ কড়া নাড়তে পারে না।",
          },
          {
            key: "B",
            text: "Port টা 5432 থেকে বদলে 15432 করা",
            isCorrect: false,
            explanation: "নম্বর বদলালে শুধু ভিড় কমে। পুরো Port পরিসর খুঁজে দেখতে কয়েক মিনিট লাগে।",
          },
          {
            key: "C",
            text: "127.0.0.1:5432 এ Bind করা, আর Firewall এও 5432 এর জন্য কোনো নিয়ম না রাখা",
            isCorrect: true,
            explanation:
              "ঠিক। দুই স্তরের সুরক্ষা। একটা ভুল হলেও অন্যটা আটকায়, আর App একই যন্ত্রে বলে তার কোনো অসুবিধা হয় না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের যন্ত্রের Port আর Socket নিজের চোখে",
    subtitle: "Terminal এ ছয়টা পরীক্ষা, দুইটা Terminal লাগবে",
    stepName: "LAB",
    steps: [
      {
        title: "কে কোন Port এ বসে",
        description:
          "আপনার যন্ত্রে এই মুহূর্তে যত Listening Socket আছে তার তালিকা বের করুন, আর প্রতিটার Bind Address পড়ুন।",
      },
      {
        title: "নিজের একটা Server, Config বাইরে থেকে",
        description:
          "একটা ছোট Node Server লিখুন যে HOST আর PORT নেয় Environment Variable থেকে আর প্রতিটা Connection এর 4-tuple ছাপায়।",
      },
      {
        title: "দুই Bind Address, দুই ফল",
        description:
          "একই Server একবার 127.0.0.1 এ আর একবার 0.0.0.0 তে চালিয়ে নিজের Wi-Fi এর IP দিয়ে পৌঁছানোর চেষ্টা করুন।",
      },
      {
        title: "EADDRINUSE আর EACCES নিজে বানান",
        description:
          "একই Port এ দুইবার চালিয়ে দখলদারকে খুঁজে বের করুন, তারপর Port 80 চেয়ে অনুমতির Error দেখুন।",
      },
      {
        title: "Listening আর Connected পাশাপাশি",
        description:
          "দুইটা Client খোলা রেখে lsof আর netstat দিয়ে একই Port এ তিনটা Socket দেখুন।",
      },
      {
        title: "বাইরে থেকে Port পরীক্ষা, আর নিজের সীমা",
        description:
          "nc দিয়ে খোলা, refused আর timed out তিন রকম ফল দেখুন, তারপর নিজের যন্ত্রের Ephemeral পরিসর আর fd সীমা বের করুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-who-listens.sh",
        language: "bash",
        code: `# macOS আর Linux দুইটাতেই
lsof -nP -iTCP -sTCP:LISTEN
# COMMAND     PID     USER   FD   TYPE  ...  NAME
# rapportd    479 devripon    5u  IPv4  ...  TCP *:49152 (LISTEN)
# stable      522 devripon   40u  IPv4  ...  TCP 127.0.0.1:9277 (LISTEN)
# ControlCe   527 devripon   10u  IPv4  ...  TCP *:7000 (LISTEN)

# NAME ঘরটা পড়ুন।
#   *:7000          -> সব দরজায়, Wi-Fi এর অন্যরাও পৌঁছাতে পারে
#   127.0.0.1:9277  -> শুধু এই যন্ত্র

# Linux এ
ss -ltnp          # TCP
ss -lunp          # UDP

# Windows এ
# netstat -ano | findstr LISTENING

# প্রশ্ন: তালিকায় কয়টা তারকা দিয়ে শুরু? প্রতিটার সত্যিই কি
# বাইরের দুনিয়ার দরকার আছে?`,
      },
      {
        filename: "2-server.js",
        language: "javascript",
        code: `const http = require("node:http");

const host = process.env.HOST;
const port = Number(process.env.PORT);
if (!host || !Number.isInteger(port)) {
  throw new Error("HOST and PORT must be set, for example HOST=127.0.0.1 PORT=3000");
}

const server = http.createServer((req, res) => {
  const s = req.socket;
  console.log(
    "connection:",
    s.remoteAddress + ":" + s.remotePort,
    "->",
    s.localAddress + ":" + s.localPort,
  );
  res.end("hello from pid " + process.pid + "\\n");
});

server.on("error", (err) => {
  console.error("listen failed:", err.code, err.message);
  process.exit(1);
});

server.listen(port, host, () => {
  const a = server.address();
  console.log("listening on", a.address + ":" + a.port, "pid", process.pid);
});

// আগে কোনো Variable ছাড়া চালান:  node 2-server.js
// Error দিয়ে থেমে যাবে। এটাই চাওয়া, ভুল ডিফল্ট নিয়ে চুপচাপ চলা নয়।`,
      },
      {
        filename: "3-bind.sh",
        language: "bash",
        code: `LAN=$(ipconfig getifaddr en0)                 # macOS
# LAN=$(hostname -I | cut -d" " -f1)          # Linux
echo "আমার Wi-Fi IP: $LAN"

HOST=127.0.0.1 PORT=3977 node 2-server.js & SP=$!
sleep 1
curl -s http://127.0.0.1:3977/               # hello from pid ...
curl -s -m 3 http://$LAN:3977/ ; echo "exit=$?"
# exit=7  ->  Connection refused. App চালু, Port ঠিক, শুধু দরজা ভুল।
kill $SP ; sleep 1

HOST=0.0.0.0 PORT=3977 node 2-server.js & SP=$!
sleep 1
curl -s http://$LAN:3977/                    # এবার উত্তর আসে
# Server এর Log এ দেখুন:
# connection: 192.168.0.103:57190 -> 192.168.0.103:3977
# একই Wi-Fi তে থাকা ফোনের Browser এ http://<LAN>:3977 খুলে দেখুন,
# Log এ ফোনের IP আর তার Ephemeral Port দেখাবে।
kill $SP`,
      },
      {
        filename: "4-two-errors.sh",
        language: "bash",
        code: `HOST=127.0.0.1 PORT=3977 node 2-server.js &
sleep 1

# একই জোড়ায় দ্বিতীয়জন
HOST=127.0.0.1 PORT=3977 node 2-server.js
# listen failed: EADDRINUSE listen EADDRINUSE: address already in use 127.0.0.1:3977

# দখলদার কে
lsof -nP -iTCP:3977 -sTCP:LISTEN
# node  20081 ...  TCP 127.0.0.1:3977 (LISTEN)
PID=$(lsof -ti tcp:3977 -sTCP:LISTEN)
ps -p $PID -o pid,command      # আগে দেখুন, তারপর
kill $PID

# এবার অনুমতির Error
HOST=127.0.0.1 PORT=80 node 2-server.js
# listen failed: EACCES listen EACCES: permission denied 127.0.0.1:80

# দুই Error এর কারণ আর সমাধান নিজের ভাষায় লিখে রাখুন।`,
      },
      {
        filename: "5-three-sockets.sh",
        language: "bash",
        code: `HOST=127.0.0.1 PORT=3977 node 2-server.js & SP=$!
sleep 1

# দুইটা Client, ছয় সেকেন্ড করে লাইন ধরে রাখে
(sleep 6 | nc 127.0.0.1 3977 > /dev/null) &
(sleep 6 | nc 127.0.0.1 3977 > /dev/null) &
sleep 1

lsof -nP -iTCP:3977
# node  ... TCP 127.0.0.1:3977 (LISTEN)
# node  ... TCP 127.0.0.1:3977->127.0.0.1:57256 (ESTABLISHED)
# node  ... TCP 127.0.0.1:3977->127.0.0.1:57257 (ESTABLISHED)
# nc    ... TCP 127.0.0.1:57257->127.0.0.1:3977 (ESTABLISHED)
# nc    ... TCP 127.0.0.1:57256->127.0.0.1:3977 (ESTABLISHED)

netstat -anp tcp | grep 3977        # macOS।  Linux এ: ss -tan | grep 3977
# tcp4  0  0  127.0.0.1.3977   127.0.0.1.57257  ESTABLISHED
# tcp4  0  0  127.0.0.1.3977   *.*              LISTEN
# macOS এর netstat IP আর Port এর মাঝে কোলনের বদলে ডট দেয়।

# ছয় সেকেন্ড পরে আবার চালান। ESTABLISHED সারিগুলোর জায়গায়
# TIME_WAIT দেখতে পারেন। ওটাই পরের লেসনের গল্প।
kill $SP`,
      },
      {
        filename: "6-probe-and-limits.sh",
        language: "bash",
        code: `# তিন রকম ফল।  Linux এ -G 3 এর জায়গায় -w 3
nc -vz -G 3 example.com 443     # succeeded!
nc -vz -G 3 127.0.0.1 3999      # Connection refused, সাথে সাথে
nc -vz -G 3 example.com 81      # Operation timed out, ৩ সেকেন্ড পরে

# আমার Client Port কোনটা ছিল
curl -s -o /dev/null -w "local %{local_ip}:%{local_port}\\n" https://example.com
curl -s -o /dev/null -w "local %{local_ip}:%{local_port}\\n" https://example.com

# Ephemeral পরিসর
sysctl net.inet.ip.portrange.first net.inet.ip.portrange.last   # macOS
# cat /proc/sys/net/ipv4/ip_local_port_range                    # Linux

# File Descriptor এর সীমা
ulimit -n
ulimit -Hn

# হিসাব করুন: আপনার যন্ত্র থেকে example.com এর 443 এ একসাথে
# সর্বোচ্চ কয়টা Connection খোলা সম্ভব? কোন সীমাটা আগে আটকাবে?`,
      },
    ],
    tip: "তিন নম্বর পরীক্ষাটা সবচেয়ে মন দিয়ে করুন, আর সম্ভব হলে সত্যিই ফোন দিয়ে পৌঁছানোর চেষ্টা করুন। 127.0.0.1 এ থাকা অবস্থায় ফোনে কিছু আসবে না, 0.0.0.0 তে গেলেই আসবে, অথচ দুই ক্ষেত্রেই আপনার ল্যাপটপের Browser এ সব ঠিক। এই একটা অভিজ্ঞতা হাতে থাকলে ভবিষ্যতে যখনই কেউ বলবে আমার যন্ত্রে তো চলছে, আপনি প্রথমেই জিজ্ঞেস করবেন কোন ঠিকানায় Bind করা, আর lsof এর এক লাইনে উত্তর বের করে দেবেন। পরীক্ষা শেষে lsof -nP -iTCP:3977 চালিয়ে নিশ্চিত হোন কোনো Server পেছনে চালু থেকে যায়নি।",
  },
  assignment: {
    title: "Mini Project: my-tours এর Port Map আর একটা Debug রানবুক",
    time: "৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>নিজের যন্ত্রের Port Map:</strong> lsof বা ss দিয়ে আপনার যন্ত্রের
        সব Listening Socket এর একটা ছক বানান। ঘর থাকবে পাঁচটা: Port, Protocol,
        Process, Bind Address, আর বাইরের দুনিয়ার এটা দরকার কি না। অন্তত দুইটা
        অচেনা Process খুঁজে বের করুন সেগুলো কী।
      </span>,
      <span key="2">
        <strong>my-tours এর Port Map আঁকুন:</strong> আপনার my-tours এ থাকবে একটা
        Reverse Proxy, একটা Web App, একটা API, PostgreSQL আর Redis। Island Tours
        এর ছকের মতো একটা ছক বানান, প্রতিটার Port, Bind Address, Firewall নিয়ম আর
        কে পৌঁছাতে পারে। প্রতিটা 0.0.0.0 এর পাশে এক লাইনে লিখুন কেন সেটা 127.0.0.1
        হতে পারল না।
      </span>,
      <span key="3">
        <strong>Config বাইরে আনুন:</strong> Lab এর Server টাকে বাড়িয়ে একটা
        /whoami পথ যোগ করুন, যেটা উত্তরে Client এর IP আর Port, আর Server এর IP
        আর Port ফেরত দেয়। HOST আর PORT আসবে Environment Variable থেকে, Code এ
        কোনো সংখ্যা বা ডিফল্ট থাকবে না। একই Wi-Fi এর আরেকটা যন্ত্র থেকে ডেকে
        উত্তরটা জমা দিন।
      </span>,
      <span key="4">
        <strong>পাঁচটা Error, পাঁচটা রোগ নির্ণয়:</strong> EADDRINUSE, EACCES,
        ECONNREFUSED, ETIMEDOUT আর EMFILE। প্রতিটার জন্য লিখুন কোন অবস্থায় আসে,
        তিন গেটের বা দুই সীমার কোনটার সাথে সম্পর্ক, আর প্রথম কোন কমান্ডটা
        চালাবেন। প্রথম চারটা নিজে বানিয়ে আসল Error লাইনটা সাথে দিন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় লিখুন (৮ লাইন):</strong> একজন নতুন সহকর্মী জিজ্ঞেস
        করলেন, একটা Port এ তো একটাই Program বসতে পারে, তাহলে আমাদের Server এর
        443 এ একসাথে হাজার মানুষ কীভাবে থাকে, আর একই 443 এ তিনটা সাইটই বা কীভাবে
        চলে? তাঁকে Listening Socket, Connected Socket, 4-tuple আর Reverse Proxy
        দিয়ে বোঝান, কোনো উপমা সহ।
      </span>,
    ],
    deliverables: [
      <span key="1">নিজের যন্ত্রের Port Map, পাঁচ ঘরের ছকে</span>,
      <span key="2">my-tours এর Port Map, প্রতিটা 0.0.0.0 এর কারণ সহ</span>,
      <span key="3">/whoami সহ Server এর Code আর আরেক যন্ত্র থেকে পাওয়া উত্তর</span>,
      <span key="4">পাঁচ Error এর রোগ নির্ণয়ের ছক, চারটার আসল Error লাইন সহ</span>,
      <span key="5">সহকর্মীর জন্য ৮ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
