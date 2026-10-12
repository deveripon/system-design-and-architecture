/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  LayerFaultLab,
  StackWalkLab,
  WhichLayerLab,
} from "../../../components/course/topics/tcp/tcpip-animations";
import {
  DemuxKeysDiagram,
  HourglassDiagram,
  OsiToTcpIpDiagram,
  RouterTouchesDiagram,
  WhereLayersLiveDiagram,
} from "../../../components/course/topics/tcp/tcpip-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const tcpIpModelContent: TopicData = {
  id: "tcp-ip-model",
  introduction: {
    badge: "MODULE 05 · LESSON 02",
    title: <SectionTitle>মানচিত্র দেখা হলো, এবার আসল রাস্তায় নামি</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি OSI Model এর সাতটা Layer একটা একটা করে চিনেছেন। এবার
          একটা ছোট পরীক্ষা করুন। Terminal খুলে{" "}
          <code>curl -v https://example.com</code> চালান আর যা যা লেখা আসে মন দিয়ে
          পড়ুন। দেখবেন নাম থেকে IP বের হলো, তারপর একটা IP আর Port এ Connection
          হলো, তারপর TLS, তারপর HTTP। কিন্তু কোথাও Session Layer বা Presentation
          Layer নামে কিছু নেই। আপনার Operating System এর Code খুঁজলেও এই দুই
          নামের কিছু পাবেন না।
        </ContentParagraph>
        <ContentParagraph>
          কারণটা সহজ। OSI হলো একটা মানচিত্র, যা দিয়ে মানুষ Network নিয়ে কথা বলে।
          আর যে রাস্তা দিয়ে আপনার Packet সত্যিই যায়, সেটা বানানো হয়েছে আরেকটা
          নকশায়, যার নাম TCP/IP Model। এতে Layer চারটা, আর এই চারটার প্রতিটার Code
          আপনার ফোনে, Laptop এ আর প্রতিটা Server এ এই মুহূর্তে চলছে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন চার Layer কোনটা কী প্রশ্নের উত্তর দেয়, OSI এর
          সাতের সাথে চার কীভাবে মেলে, কেন সবাই এখনো Layer 4 আর Layer 7 বলে, একটা
          যন্ত্রের ভেতরে কোন Layer ঠিক কোথায় বসে থাকে, একটা Request কীভাবে চার
          Layer বেয়ে নামে আর ওপারে চার Layer বেয়ে ওঠে, পথের Router কেন শুধু নিচের
          দুই Layer ছোঁয়, আর কোনো কিছু কাজ না করলে কোন Layer এ ভেঙেছে তা কীভাবে
          চার ধাপে বের করবেন। আগের চার Module এ যা যা শিখেছেন, MAC, IP, Port,
          DNS, সব এই লেসনে এসে একটা ছবিতে নিজের জায়গা পাবে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "একটা বাড়ির নকশা সাত পাতায় আঁকা হতে পারে, কিন্তু মিস্ত্রি বাড়িটা বানান চার ধাপে, ভিত, দেয়াল, ছাদ, রং। নকশা আর বাড়ি দুইটাই সত্যি, শুধু একটায় থাকা যায়।",
      author: "TCP/IP",
      role: "Lesson 02",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "map-vs-road",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>মানচিত্র একটা, রাস্তা আরেকটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরুন আপনি ঢাকা থেকে সেন্ট মার্টিন যাবেন। একটা ভ্রমণ বইয়ে পুরো
                যাত্রাটা সাত ভাগে লেখা, বাসা থেকে বের হওয়া, বাস স্ট্যান্ডে যাওয়া,
                টিকিট কাটা, বাসে ওঠা, টেকনাফে নামা, জাহাজ ঘাটে যাওয়া, জাহাজে ওঠা।
                বইটা চমৎকার, কারণ এটা পড়লে যে কেউ বুঝবে যাত্রায় কী কী কাজ আছে।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু বাস্তবে আপনি এভাবে সাত ভাগে কিছু করেন না। আপনি একটা App এ
                টিকিট কাটেন, সেই App ই বাস আর জাহাজ দুইটা বুক করে দেয়। রিকশাওয়ালা
                আপনাকে স্ট্যান্ডে নামিয়ে দেন। বাস কোম্পানি টেকনাফ পর্যন্ত নেয়।
                জাহাজ কোম্পানি দ্বীপে পৌঁছায়। বাস্তবে কাজটা ভাগ হয়েছে চার জনের
                মধ্যে, কারণ বইয়ের কয়েকটা ধাপ একই জন একসাথে সেরে ফেলে।
              </ContentParagraph>
              <ContentParagraph>
                OSI আর TCP/IP এর সম্পর্ক হুবহু এই রকম। OSI হলো সেই ভ্রমণ বই, যা
                কাজগুলোকে সাত ভাগে সুন্দর করে সাজিয়ে দেখায়। TCP/IP হলো সেই চার জন,
                যারা কাজটা সত্যিই করে। কাজ একই, ভাগ করার ধরন আলাদা। আগের লেসনে
                আপনি বইটা পড়েছেন, আজ সেই চার জনের সাথে পরিচিত হবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Model মানে কী, আর দুইটা Model কেন",
          content: (
            <p>
              Model মানে একটা জটিল জিনিসকে বোঝার জন্য আঁকা সরল ছবি। Network এ একটা
              বার্তা পাঠাতে অনেকগুলো আলাদা কাজ করতে হয়, আর Model সেই কাজগুলোকে
              কয়েকটা স্তরে ভাগ করে দেখায়, যাতে প্রতিটা স্তর শুধু নিজের কাজ নিয়ে
              ভাবে। এই স্তরগুলোকেই বলে Layer। OSI Model বানানো হয়েছিল একটা আদর্শ
              নকশা হিসেবে, কাগজে আগে। TCP/IP Model এসেছে উল্টো পথে, আগে কাজ করা
              Code লেখা হয়েছে, পরে সেই Code কে চার স্তরে বর্ণনা করা হয়েছে। তাই
              একটা শেখায় কীভাবে ভাবতে হয়, আরেকটা দেখায় কী সত্যিই চলছে। আপনার
              দুইটাই লাগবে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নামটা নিয়ে একটা কথা আগেই পরিষ্কার করে রাখি, কারণ এখানে প্রায় সবাই
              একবার হোঁচট খায়। TCP/IP শুনে মনে হয় এতে দুইটাই জিনিস আছে, TCP আর
              IP। আসলে এটা একটা পুরো পরিবারের নাম। এই পরিবারে TCP আর IP ছাড়াও UDP,
              ICMP, ARP, DNS, HTTP, আরও শত শত Protocol আছে। সবচেয়ে বিখ্যাত দুই
              সদস্যের নামে পুরো পরিবারের নাম হয়ে গেছে, যেমন কোনো দোকানের নাম হয়
              মালিক দুই ভাইয়ের নামে। তাই কেউ যখন বলে আমার Server এর TCP/IP Stack,
              সে বোঝায় ওই যন্ত্রের পুরো Networking এর ব্যবস্থা। Stack মানে একটার
              উপর আরেকটা সাজানো স্তূপ, আর Layer গুলো ঠিক সেভাবেই সাজানো।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "history",
      subHeader: { index: "002", title: "Where It Came From" },
      title: <SectionTitle>দুই লাইনের ইতিহাস, আর কেন TCP/IP জিতল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ইতিহাস মুখস্থ করার দরকার নেই, কিন্তু তিনটা তারিখ জানলে বুঝবেন কেন
                আজ পৃথিবীতে দুইটা Model পাশাপাশি টিকে আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>১৯৬৯:</strong> আমেরিকার কয়েকটা বিশ্ববিদ্যালয়ের কম্পিউটার
                  জোড়া দিয়ে ARPANET নামে একটা পরীক্ষামূলক Network চালু হয়। Module
                  02 এর প্রথম লেসনে যে Network of Networks এর কথা পড়েছেন, তার
                  শুরু এখান থেকে।
                </ListItem>
                <ListItem>
                  <strong>১৯৭৪:</strong> Vint Cerf আর Bob Kahn নামে দুই গবেষক একটা
                  লেখা প্রকাশ করেন, যেখানে আলাদা আলাদা Network কে জোড়া দেওয়ার একটা
                  সাধারণ নিয়মের কথা বলা হয়। সেই নিয়ম থেকেই পরে TCP আর IP আলাদা
                  হয়ে জন্ম নেয়।
                </ListItem>
                <ListItem>
                  <strong>১ জানুয়ারি ১৯৮৩:</strong> ARPANET এর সব যন্ত্র এক দিনে
                  পুরনো নিয়ম ছেড়ে TCP/IP তে চলে যায়। অনেকে এই দিনটাকেই Internet এর
                  জন্মদিন বলেন।
                </ListItem>
                <ListItem>
                  <strong>১৯৮৪:</strong> আন্তর্জাতিক মান সংস্থা ISO তাদের সাত Layer
                  এর OSI Model প্রকাশ করে। খেয়াল করুন, ততদিনে TCP/IP এক বছর ধরে
                  সত্যিকারের যন্ত্রে চলছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই শেষ তথ্যটাই পুরো গল্প। OSI ছিল কমিটির বানানো, খুব যত্নে ভাবা,
                কিন্তু কাগজে। তার নিজের Protocol গুলো তৈরি হতে হতে TCP/IP ততদিনে
                বিনা পয়সায় Unix Operating System এর সাথে ছড়িয়ে পড়েছে, আর
                বিশ্ববিদ্যালয় থেকে কোম্পানি সবাই সেটা ব্যবহার করছে। যা হাতের কাছে
                আছে আর কাজ করে, মানুষ সেটাই নেয়। তাই OSI এর Protocol গুলো হারিয়ে
                গেল, কিন্তু তার সাত Layer এর ভাষাটা থেকে গেল, কারণ কথা বলার জন্য
                সেটা সত্যিই ভালো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই ইতিহাস আপনার কী কাজে লাগবে",
          content: (
            <p>
              কাউকে শেখানোর সময় এই প্রশ্নটা আসবেই, দুইটা Model থাকলে আমি কোনটা
              শিখব। উত্তরটা এখন আপনি এক বাক্যে দিতে পারবেন। যন্ত্র চলে TCP/IP তে,
              মানুষ কথা বলে OSI এর সংখ্যায়। একটা বাদ দিলে হয় আপনি বুঝবেন না যন্ত্রে
              কী হচ্ছে, নয়তো বুঝবেন না সহকর্মী কী বলছেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "four-layers",
      subHeader: { index: "003", title: "The Four Layers" },
      title: <SectionTitle>চার Layer, চারটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                চার Layer এর নাম মুখস্থ করার আগে একটা চিঠির কথা ভাবুন। আপনি
                চট্টগ্রামে থাকা বন্ধুকে একটা চিঠি পাঠাবেন। কাজটা শেষ করতে চারটা
                আলাদা প্রশ্নের উত্তর লাগে, আর প্রতিটা প্রশ্নের উত্তর দেয় আলাদা
                একজন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>চিঠিতে কী লিখব, কোন ভাষায়?</strong> এটা আপনার আর বন্ধুর
                  ব্যাপার। ডাকঘরের এতে কিছু আসে যায় না।
                </ListItem>
                <ListItem>
                  <strong>ওই বাড়ির কোন ফ্ল্যাটে, আর সাধারণ ডাকে নাকি রেজিস্ট্রি
                  করে?</strong> রেজিস্ট্রি করলে প্রাপ্তি স্বীকার আসে, হারালে আবার
                  পাঠানো হয়। সাধারণ ডাকে এসব কিছু নেই, কিন্তু ঝামেলাও কম।
                </ListItem>
                <ListItem>
                  <strong>কোন শহরের কোন বাড়ি?</strong> খামের উপরের ঠিকানা। ডাক
                  বিভাগ শুধু এটুকু দেখেই চিঠিটা এক শহর থেকে আরেক শহরে নিয়ে যায়।
                </ListItem>
                <ListItem>
                  <strong>এই ডাকঘর থেকে পরের ডাকঘর পর্যন্ত কীসে যাবে?</strong>{" "}
                  কখনো ভ্যান, কখনো ট্রেন, কখনো নৌকা। প্রতি ধাপে বাহন বদলায়, চিঠি
                  বদলায় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                TCP/IP এর চার Layer ঠিক এই চার প্রশ্নের উত্তর, একই ক্রমে, উপর থেকে
                নিচে। এবার আসল নামগুলো বসাই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Layer", "যে প্রশ্নের উত্তর দেয়", "ঠিকানা হিসেবে যা ব্যবহার করে", "Data র নাম", "চেনা উদাহরণ"],
          rows: [
            [
              <strong>Application</strong>,
              "কথাটার অর্থ কী, কোন ভাষায়",
              "নাম আর URL, যেমন islandtours.example",
              "Data বা Message",
              "HTTP, DNS, TLS, SSH, SMTP",
            ],
            [
              <strong>Transport</strong>,
              "ওই যন্ত্রের কোন Program, আর কতটা যত্নে",
              "Port, যেমন 443",
              "Segment (TCP), Datagram (UDP)",
              "TCP, UDP",
            ],
            [
              <strong>Internet</strong>,
              "পৃথিবীর কোন যন্ত্র, আর কোন পথে",
              "IP Address, যেমন 103.94.135.2",
              "Packet",
              "IP, ICMP",
            ],
            [
              <strong>Link</strong>,
              "পাশের যন্ত্র পর্যন্ত কীভাবে",
              "MAC Address",
              "Frame",
              "Ethernet, Wi-Fi, ARP",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার প্রতিটা Layer কে একটু সময় দিই। প্রতিটার সাথে দেখবেন আগের কোনো
                না কোনো লেসন জুড়ে যাচ্ছে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Application Layer।</strong> এখানে থাকে সেই Program গুলো
                যেগুলো আপনি নিজে চালান বা লেখেন, আর তাদের নিজেদের মধ্যে কথা বলার
                নিয়ম। Browser আর Web Server কথা বলে HTTP তে। আপনার Laptop আর
                Resolver কথা বলে DNS এ, যা আপনি পুরো Module 04 জুড়ে দেখেছেন। এই
                Layer জানে একটা বুকিং মানে কী, একটা Record মানে কী। কিন্তু সে
                জানে না বার্তাটা তারে যাবে না বাতাসে, কয়টা Router পার হবে, পথে
                কিছু হারাবে কি না। সে শুধু নিচের Layer কে বলে, এটা ওই ঠিকানায়
                পৌঁছে দাও।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Transport Layer।</strong> Module 02 এর OS Networking
                লেসনে একটা যন্ত্রকে আপনি বিল্ডিং হিসেবে দেখেছিলেন, আর Port ছিল
                ফ্ল্যাটের নম্বর। সেই ফ্ল্যাটের নম্বর এই Layer এর জিনিস। IP Address
                Packet কে ঠিক বিল্ডিং পর্যন্ত আনে, কিন্তু বিল্ডিংয়ে একসাথে অনেক
                Program চলছে, Browser, একটা Game, একটা Chat App। কোন Program এর
                জন্য এই Data, সেটা ঠিক করে Port। এই Layer এর দ্বিতীয় কাজ হলো ঠিক
                করা কতটা যত্ন নেওয়া হবে। TCP হলো রেজিস্ট্রি ডাক, সে হারানো টুকরো
                আবার পাঠায় আর ক্রম ঠিক রাখে। UDP হলো সাধারণ ডাক, পাঠিয়ে দিল, বাকিটা
                ভাগ্য। এই দুইটা নিয়ে পরের দুইটা পুরো লেসন আছে, তাই এখানে শুধু
                এটুকু মনে রাখুন যে পছন্দটা এই Layer এ হয়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Internet Layer।</strong> এই Layer এর কাজ একটাই, একটা
                Packet কে পৃথিবীর যেকোনো যন্ত্র থেকে যেকোনো যন্ত্রে নিয়ে যাওয়া, তা
                মাঝখানে যত আলাদা Network ই থাকুক। এর ঠিকানা IP Address, যা আপনি
                Module 03 এ খুঁটিয়ে দেখেছেন। Module 02 এর How Data Travels লেসনে
                যে Router কে প্রতি মোড়ের ট্রাফিক পুলিশ বলা হয়েছিল, সে এই Layer এর
                কর্মী। এই Layer কোনো প্রতিশ্রুতি দেয় না। Packet হারাতে পারে, দেরিতে
                আসতে পারে, আগে পরে হয়ে যেতে পারে। সে শুধু চেষ্টা করে, একে বলে Best
                Effort। যত্ন নেওয়ার দায়িত্ব তার উপরের Layer এর।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Link Layer।</strong> একটা Packet কে পৃথিবী পার করাতে হলে
                আগে তাকে পাশের যন্ত্র পর্যন্ত তো পৌঁছাতে হবে। আপনার ফোন থেকে বাসার
                Router, Router থেকে ISP র যন্ত্র, প্রতিটা এক ধাপের যাত্রা এই Layer
                এর কাজ। এর ঠিকানা MAC Address, আর কোন IP র MAC কী তা বের করে ARP,
                দুইটাই Module 03 এ দেখেছেন। মাধ্যমটা হতে পারে তামার তার, Wi-Fi,
                Mobile Data বা সমুদ্রের নিচের Optical Fiber। Link Layer এই পার্থক্য
                নিজের ভেতরে লুকিয়ে রাখে, উপরের Layer জানতেই পারে না নিচে কী চলছে।
                অন্য বইয়ে এই Layer এর নাম Network Access বা Network Interface
                দেখলে ঘাবড়াবেন না, একই জিনিস।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "প্রতিটা Layer তার উপরের Layer কে একটা সেবা দেয়",
          content: (
            <p>
              Layer গুলোকে আলাদা চার জন না ভেবে একটা শিকল হিসেবে ভাবুন, যেখানে
              প্রত্যেকে নিচের জনের সেবা নেয় আর উপরের জনকে সেবা দেয়। Link বলে, আমি
              একটা Frame পাশের যন্ত্রে পৌঁছে দেব। Internet সেই সেবা বারবার ব্যবহার
              করে বলে, আমি একটা Packet পৃথিবীর যেকোনো IP তে পৌঁছানোর চেষ্টা করব।
              Transport সেই চেষ্টার উপর দাঁড়িয়ে বলে, আমি ঠিক Program টার হাতে দেব,
              আর TCP হলে হারানো কিছু থাকবে না। Application সেই ভরসায় শুধু নিজের
              কথাটা লেখে। কেউ নিচের জনের কাজ নিজে করে না, আর উপরের জনের কাজ নিয়ে
              ভাবেও না। এই বাক্যটা কাউকে বোঝাতে পারলে আপনি TCP/IP Model বোঝাতে
              পেরেছেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "osi-mapping",
      subHeader: { index: "004", title: "OSI vs TCP/IP" },
      title: <SectionTitle>সাত কীভাবে চার হলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আগের লেসনের সাতটা Layer হারিয়ে যায়নি, শুধু কয়েকটা জোড়া লেগে গেছে।
              নিচের ছবিতে বাঁ পাশে সাত, ডান পাশে চার, আর মাঝের দাগগুলো দেখাচ্ছে
              কোনটা কোনটার সাথে মিলেছে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OsiToTcpIpDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিতে দুইটা জায়গায় জোড়া লেগেছে, আর দুই জায়গার কারণ আলাদা। কারণ
                দুইটা বুঝলে মিলটা আর মুখস্থ করতে হবে না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>উপরের তিনটা কেন এক হলো।</strong> OSI তে Session Layer এর
                কাজ ছিল দুই পক্ষের কথোপকথনটা শুরু করা, চালু রাখা আর শেষ করা।
                Presentation Layer এর কাজ ছিল Data কে এমন রূপে সাজানো যা দুই পক্ষই
                বোঝে, যেমন Encoding, Compression আর Encryption। OSI ভেবেছিল এই
                কাজগুলো আলাদা আলাদা স্তর করবে। বাস্তবে দেখা গেল একটা Program নিজেই
                তিনটা কাজ সেরে ফেলে। আপনার Browser ই ঠিক করে আপনি Login করা আছেন কি
                না, যা Session এর কাজ। সে ই Data কে JSON বা HTML হিসেবে পড়ে আর TLS
                দিয়ে তালা মারে, যা Presentation এর কাজ। আর সে ই HTTP তে কথা বলে, যা
                Application এর কাজ। তিনটা কাজ একই Program এর ভেতরে, তাই TCP/IP
                এদের আলাদা করার চেষ্টাই করেনি। পুরোটার নাম দিয়েছে Application
                Layer।
              </ContentParagraph>
              <ContentParagraph>
                <strong>নিচের দুইটা কেন এক হলো।</strong> OSI তে Physical Layer হলো
                তার, আলো বা Radio তরঙ্গে Bit পাঠানো, আর Data Link Layer হলো সেই
                Bit গুলোকে Frame এ সাজিয়ে MAC Address দিয়ে পাশের যন্ত্রে পাঠানো।
                TCP/IP এর নকশাকারীরা ইচ্ছা করেই এই অংশে নাক গলাননি। তাঁদের কথা
                ছিল, নিচে যা ই থাকুক, সে যদি একটা IP Packet পাশের যন্ত্রে পৌঁছে
                দিতে পারে, আমাদের চলবে। তাই তাঁরা পুরো নিচের অংশটাকে একটাই বাক্স
                ধরেছেন, Link Layer। এই উদাসীনতাই পরে আশীর্বাদ হয়েছে, কারণ Wi-Fi
                বা 4G এর মতো নতুন প্রযুক্তি আসার সময় উপরের কিছুই বদলাতে হয়নি।
              </ContentParagraph>
              <ContentParagraph>
                <strong>মাঝের দুইটা হুবহু মেলে।</strong> OSI এর Layer 4 আর TCP/IP
                এর Transport একই জিনিস। OSI এর Layer 3, যার নাম Network, সেটাই
                TCP/IP তে Internet Layer, শুধু নামটা আলাদা। এই দুই Layer ই Network
                এর মেরুদণ্ড, আর এই Module এর বাকি লেসনগুলো মূলত এই দুইটা নিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "সংখ্যা OSI এর, যন্ত্র TCP/IP এর",
          content: (
            <p>
              এটা সবচেয়ে বেশি গুলিয়ে ফেলার জায়গা, তাই আলাদা করে বলছি। কর্মক্ষেত্রে
              আপনি সবসময় শুনবেন Layer 2 Switch, Layer 3 Router, Layer 4 Load
              Balancer, Layer 7 Load Balancer। এই সংখ্যাগুলো সব OSI এর সাত Layer
              থেকে নেওয়া, যদিও যন্ত্রগুলো চলে TCP/IP তে। TCP/IP এর চার Layer কে
              কেউ সংখ্যা দিয়ে ডাকে না। কেউ কখনো বলে না Layer 4 মানে Application,
              কারণ চার Layer এর হিসাবে গুনলে সেটাই হতো। তাই নিয়মটা সরল। সংখ্যা
              শুনলে OSI এর তালিকায় গুনুন। Layer 7 মানে Application, Layer 4 মানে
              Transport, Layer 3 মানে Internet, Layer 2 মানে Link। Layer 5 আর 6
              প্রায় কেউ বলে না, কারণ বাস্তবে ওই দুইটা Layer 7 এর ভেতরেই ঢুকে গেছে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["মানুষ যা বলে", "OSI এর Layer", "TCP/IP এর Layer", "যন্ত্রটা যা দেখে সিদ্ধান্ত নেয়"],
          rows: [
            ["Layer 2 Switch", "Data Link", "Link", "MAC Address"],
            ["Layer 3 Router, Layer 3 Firewall", "Network", "Internet", "IP Address"],
            ["Layer 4 Load Balancer, Security Group", "Transport", "Transport", "IP Address আর Port"],
            ["Layer 7 Load Balancer, Reverse Proxy, WAF", "Application", "Application", "URL, Header, Cookie, Domain এর নাম"],
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "five-layer",
      subHeader: { index: "005", title: "The Five-layer Version" },
      title: <SectionTitle>কোথাও পাঁচ Layer লেখা দেখলে ঘাবড়াবেন না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি অন্য কোনো বই বা ভিডিও খুললে একটা জিনিস দেখে থমকে যেতে পারেন।
                কেউ লিখেছে TCP/IP এর চার Layer, কেউ লিখেছে পাঁচ। দুই জনের কেউ ভুল
                নয়। পার্থক্য শুধু এক জায়গায়, সবার নিচের Layer টা।
              </ContentParagraph>
              <ContentParagraph>
                চার Layer এর সংস্করণে নিচে একটাই বাক্স, Link। পাঁচ Layer এর
                সংস্করণে সেই বাক্সটাকে ভেঙে দুইটা করা হয়, Data Link আর Physical,
                হুবহু OSI এর নিচের দুইটার মতো। উপরের তিনটা, Application, Transport
                আর Network, যেমন ছিল তেমনই থাকে। বিশ্ববিদ্যালয়ের বেশির ভাগ পাঠ্যবই
                এই পাঁচ Layer এর সংস্করণে পড়ায়, কারণ তার আর Signal এর ব্যাপারটা
                Frame আর MAC Address এর ব্যাপার থেকে আলাদা করে শেখানো সহজ।
              </ContentParagraph>
              <ContentParagraph>
                চার Layer এর সংস্করণটা সরকারি বলা যায়। Internet এর নিয়মগুলো যে
                দলিলে লেখা থাকে তাদের বলে RFC, মানে Request for Comments। RFC 1122
                নামের দলিলে প্রতিটা যন্ত্রের জন্য কী কী মানতে হবে তা লেখা আছে, আর
                সেখানে Layer চারটাই, নামগুলোও এই, Link, Internet, Transport,
                Application। এই Course এ আমরা তাই চারটাই ধরব।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["OSI, সাত", "পাঠ্যবই, পাঁচ", "RFC 1122, চার", "অন্য যে নামে দেখবেন"],
          rows: [
            ["Application, Presentation, Session", "Application", "Application", "Process Layer"],
            ["Transport", "Transport", "Transport", "Host to Host"],
            ["Network", "Network", "Internet", "Internetwork, IP Layer"],
            ["Data Link", "Data Link", "Link", "Network Access, Network Interface"],
            ["Physical", "Physical", "Link এর ভেতরেই", "Hardware"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "পরীক্ষায় বা Interview তে এই প্রশ্ন এলে",
          content: (
            <p>
              কেউ জিজ্ঞেস করলে TCP/IP তে কয়টা Layer, সংখ্যা বলে থেমে যাবেন না।
              বলুন, মূল দলিল অনুযায়ী চারটা, Link, Internet, Transport আর
              Application। অনেক বই নিচের Layer টাকে Data Link আর Physical এ ভাগ
              করে পাঁচটা দেখায়। এই এক বাক্যে প্রশ্নকর্তা বুঝে যাবেন আপনি মুখস্থ
              করেননি, বুঝেছেন। নাম নিয়েও একই কথা। Internet Layer আর Network Layer
              একই জিনিস, Link আর Network Access একই জিনিস।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "hourglass",
      subHeader: { index: "006", title: "The Hourglass" },
      title: <SectionTitle>সব রাস্তা IP দিয়ে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার দেখি কোন Layer এ কোন কোন Protocol থাকে। Protocol মানে দুই পক্ষের
                মধ্যে আগে থেকে ঠিক করা কথা বলার নিয়ম, যা Module 02 এর প্রথম লেসনেই
                দেখেছেন। তালিকাটা সাজালে একটা মজার আকার বের হয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HourglassDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Application Layer এ:</strong> HTTP আর HTTPS (Website আর
                  API), DNS (নাম থেকে ঠিকানা), SMTP আর IMAP (ইমেইল), SSH (দূরের
                  Server এ ঢোকা), FTP আর SFTP (ফাইল পাঠানো), NTP (ঘড়ি মেলানো),
                  DHCP (IP বিলি করা, Module 03 এ দেখেছেন), WebSocket (দুই দিকে
                  চালু থাকা কথোপকথন), TLS (Encryption)। আপনি নিজে একটা Protocol
                  বানালে সেটাও এখানে বসবে।
                </ListItem>
                <ListItem>
                  <strong>Transport Layer এ:</strong> মূলত দুইটা, TCP আর UDP। উপরের
                  প্রতিটা Protocol এদের একটা বেছে নেয়। HTTP, SSH, SMTP নেয় TCP।
                  DNS, DHCP, NTP নেয় UDP। নতুন HTTP/3 চলে QUIC এর উপর, আর QUIC
                  নিজে চলে UDP এর উপর। এসব UDP র লেসনে বিস্তারিত আসবে।
                </ListItem>
                <ListItem>
                  <strong>Internet Layer এ:</strong> IP, যার দুইটা সংস্করণ, IPv4
                  আর IPv6। সাথে আছে ICMP, যা IP র সহকারী। পথে কোনো সমস্যা হলে
                  Router এই ICMP দিয়েই খবর পাঠায়, আর <code>ping</code> আর{" "}
                  <code>traceroute</code> এটাই ব্যবহার করে।
                </ListItem>
                <ListItem>
                  <strong>Link Layer এ:</strong> Ethernet (তারের Network), Wi-Fi
                  (যার কারিগরি নাম IEEE 802.11), Mobile Data র 4G আর 5G, Optical
                  Fiber, আর ARP, যা একটা IP র MAC Address বের করে দেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার ছবিটার আকার আবার দেখুন। উপরে চওড়া, নিচে চওড়া, মাঝখানে সরু।
                সেই সরু জায়গায় একটাই নাম, IP। এই আকারটাকে বলে Hourglass, মানে
                বালিঘড়ি, আর সরু জায়গাটাকে বলে Narrow Waist, মানে সরু কোমর। এটা
                কাকতালীয় নয়, এটা Internet এর সবচেয়ে গুরুত্বপূর্ণ নকশার সিদ্ধান্ত।
              </ContentParagraph>
              <ContentParagraph>
                ভাবুন এতে কী সুবিধা হলো। ২০০৪ সালে কেউ যখন একদম নতুন ধরনের একটা App
                বানাল, তাকে পৃথিবীর একটা Router ও বদলাতে হয়নি, কারণ তার App শেষ
                পর্যন্ত IP Packet ই পাঠায়, আর Router শুধু IP Packet চেনে। আবার
                যখন 4G এলো, তারপর 5G, তখন পৃথিবীর একটা Website ও নতুন করে লিখতে
                হয়নি, কারণ নতুন Radio টা শুধু IP Packet বয়ে নিতে শিখেছে, উপরে কী
                আছে তা জানার দরকার পড়েনি। উপরের দল আর নিচের দল কেউ কাউকে না
                জানিয়ে নিজের মতো এগোতে পারে, কারণ মাঝখানে একটা জিনিস স্থির আছে।
                Module 03 এর শেষ লেসনে দেখেছিলেন, ফোন Wi-Fi থেকে Mobile Data য়
                গেলে শুধু শুরুটুকু বদলায়। সেটা এই বালিঘড়িরই ফল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সরু কোমরের দাম, কোমরটা নিজে বদলানো প্রায় অসম্ভব",
          content: (
            <p>
              সবাই একটা জিনিসের উপর নির্ভর করলে সেই জিনিসটা বদলানো ভয়ানক কঠিন হয়ে
              যায়। IP Address লেসনে পড়েছেন IPv4 এর ঠিকানা ফুরিয়ে গেছে আর তার
              সমাধান IPv6। IPv6 তৈরি হয়েছে নব্বইয়ের দশকে, অথচ আজও পৃথিবীর Traffic এর একটা বড় অংশ IPv4 এ চলে। কারণ কোমর বদলাতে হলে উপরের প্রতিটা Program
              আর নিচের প্রতিটা Router কে একসাথে নতুনটা শিখতে হয়। এই জন্যই NAT এর
              মতো জোড়াতালি এত বছর টিকে আছে। নকশার যে সিদ্ধান্ত উপর আর নিচকে মুক্ত
              করেছে, সেটাই মাঝখানটাকে জমাট করে দিয়েছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "demux",
      subHeader: { index: "007", title: "Who Is Above Me" },
      title: <SectionTitle>প্রতিটা Layer কীভাবে জানে উপরে কাকে দেবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বালিঘড়ির ছবি দেখে একটা প্রশ্ন মনে আসা উচিত। IP র উপরে TCP ও আছে,
                UDP ও আছে। TCP র উপরে HTTP ও আছে, SSH ও আছে। তাহলে Server এ একটা
                Packet এসে পৌঁছালে সে কীভাবে জানে এটা কার জন্য? কেউ তো আর মুখে বলে
                দেয় না।
              </ContentParagraph>
              <ContentParagraph>
                একটা বড় অফিসের ডাক বিভাগের কথা ভাবুন। গেটে চিঠি এলে দারোয়ান দেখে
                কোন ভবন। ভবনের রিসেপশন দেখে কোন বিভাগ। বিভাগের সহকারী দেখে কোন
                কর্মকর্তা। প্রতিটা ধাপে খামের উপর একটা ছোট লেখা থাকে যা শুধু সেই
                ধাপের মানুষের কাজে লাগে। Network এ ঠিক এটাই হয়। প্রতিটা Layer তার
                Header এ একটা ছোট ঘর রাখে, যাতে লেখা থাকে ভেতরের জিনিসটা উপরের কোন
                জনের।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DemuxKeysDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>EtherType, Link থেকে Internet এ:</strong> Frame এর Header
                  এ দুই Byte এর একটা ঘর। সেখানে <code>0x0800</code> থাকলে ভেতরে
                  IPv4, <code>0x86DD</code> থাকলে IPv6, আর <code>0x0806</code>{" "}
                  থাকলে ARP। ARP লেসনে যে প্রশ্ন আর উত্তরের Frame দেখেছিলেন,
                  Network card সেগুলোকে আলাদা করে চেনে এই সংখ্যা দেখেই।
                </ListItem>
                <ListItem>
                  <strong>Protocol Number, Internet থেকে Transport এ:</strong> IP
                  Header এ এক Byte এর একটা ঘর। <code>6</code> মানে TCP,{" "}
                  <code>17</code> মানে UDP, <code>1</code> মানে ICMP। এই তালিকা
                  আপনার যন্ত্রেই একটা ফাইলে লেখা আছে, নিচে দেখাচ্ছি।
                </ListItem>
                <ListItem>
                  <strong>Port, Transport থেকে Application এ:</strong> TCP বা UDP
                  Header এর Destination Port। Kernel নিজের খাতায় দেখে এই Port এ কোন
                  Program শুনছে, আর Data টা তার Socket এ রেখে দেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দ্বিতীয় আর তৃতীয় তালিকাটা আপনি নিজের চোখে দেখতে পারেন। macOS আর
                Linux দুইটাতেই এই দুইটা ফাইল আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "the-keys.sh",
          code: `# IP Header এর Protocol ঘরে কোন সংখ্যা মানে কে
grep -E "^(icmp|tcp|udp)[[:space:]]" /etc/protocols
#   icmp    1    ICMP    # internet control message protocol
#   tcp     6    TCP     # transmission control protocol
#   udp     17   UDP     # user datagram protocol

# কোন Port সাধারণত কোন Application এর
grep -E "^(ssh|domain|https)[[:space:]]" /etc/services
#   ssh       22/udp     # SSH Remote Login Protocol
#   ssh       22/tcp     # SSH Remote Login Protocol
#   domain    53/udp     # Domain Name Server
#   domain    53/tcp     # Domain Name Server
#   https    443/udp     # http protocol over TLS/SSL
#   https    443/tcp     # http protocol over TLS/SSL`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় তালিকায় একটা জিনিস খেয়াল করুন। একই Port দুইবার লেখা, একবার{" "}
                <code>/tcp</code> দিয়ে, একবার <code>/udp</code> দিয়ে। কারণ TCP র
                443 আর UDP র 443 দুইটা সম্পূর্ণ আলাদা দরজা। আগে Protocol Number
                দিয়ে ঠিক হয় TCP না UDP, তারপর তার নিজের Port এর তালিকায় খোঁজা হয়।
                Port আর Socket এর লেসনে এটা আবার আসবে।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা জিনিস। <code>/etc/services</code> ফাইলটা শুধু একটা তালিকা,
                কোনো আইন নয়। 443 এ HTTPS চলে কারণ সবাই একমত হয়েছে, কেউ বাধ্য করেনি।
                আপনি চাইলে 443 এ SSH চালাতে পারেন। তাই Port দেখে শুধু আন্দাজ করা
                যায় ভেতরে কী আছে, নিশ্চিত হওয়া যায় না। এই জন্যই আগের টেবিলে Layer
                4 আর Layer 7 এর যন্ত্র আলাদা। Layer 4 এর যন্ত্র শুধু Port পর্যন্ত
                দেখে, আর Layer 7 এর যন্ত্র ভেতরের কথাটা খুলে পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "where-layers-live",
      subHeader: { index: "008", title: "Inside One Machine" },
      title: <SectionTitle>একটা যন্ত্রের ভেতরে কোন Layer কোথায় থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ Layer গুলো ছিল ছবির বাক্স। এবার একটা জরুরি প্রশ্ন, এই চারটা
                বাক্স আপনার Laptop এর ভেতরে ঠিক কোথায়? উত্তরটা জানলে পরে বুঝবেন
                কোন সমস্যা আপনার Code বদলে সারে, কোনটা Server এর Setting বদলে, আর
                কোনটা আপনার হাতেই নেই।
              </ContentParagraph>
              <ContentParagraph>
                Module 01 এর Operating System লেসনে দেখেছিলেন যন্ত্রের ভেতরটা দুই
                ভাগে ভাগ করা। User space, যেখানে আপনার চালানো সব Program থাকে, আর
                Kernel, মানে Operating System এর কেন্দ্র, যার হাতে Hardware এর
                নিয়ন্ত্রণ। একটা Program সরাসরি Network card ছুঁতে পারে না, তাকে
                System Call করে Kernel কে অনুরোধ করতে হয়। চার Layer এই দুই ভাগের
                উপর ঠিক এভাবে বসে আছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhereLayersLiveDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Application Layer থাকে User space এ:</strong> Browser,
                  Node.js, Nginx, curl, আপনার লেখা API, সবই সাধারণ Program। HTTP
                  বোঝার Code এদের ভেতরে। TLS এর Encryption ও এদের ভেতরে, OpenSSL
                  এর মতো একটা Library দিয়ে। এই কারণেই TCP/IP Model এ TLS কে
                  Application Layer এ ধরা হয়, Kernel এর চোখে TLS এর তালা মারা Data
                  আর সাধারণ Data র কোনো তফাত নেই।
                </ListItem>
                <ListItem>
                  <strong>Transport আর Internet Layer থাকে Kernel এ:</strong> TCP,
                  UDP আর IP র পুরো Code Operating System এর অংশ। হারানো টুকরো আবার
                  পাঠানো, ক্রম মেলানো, Routing table দেখে পথ ঠিক করা, সব Kernel
                  করে। আপনি JavaScript বা Python এ যত ভালো Code ই লিখুন, এই
                  কাজগুলো আপনার Code এর এক লাইনেও হয় না।
                </ListItem>
                <ListItem>
                  <strong>Link Layer থাকে Network card আর তার Driver এ:</strong>{" "}
                  Network card কে সংক্ষেপে বলে NIC, Network Interface Card। Driver
                  হলো ছোট একটা Program যা Kernel কে শেখায় ওই নির্দিষ্ট card এর
                  সাথে কীভাবে কথা বলতে হয়। Frame বানানো, MAC Address বসানো, তারে
                  বা বাতাসে Signal ছাড়া, এই অংশের কাজ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর User space আর Kernel এর মাঝের দাগটা? সেটাই Socket। OS Networking
                লেসনে Socket কে বলা হয়েছিল হাতে ধরা টেলিফোন। এখন তার ঠিক অবস্থানটা
                দেখতে পাচ্ছেন। Socket হলো Application Layer আর Transport Layer এর
                মাঝের দরজা। আপনার Program টেলিফোনে কথা বলে, আর তারের ওপারে কী হয়
                তা সে জানে না।
              </ContentParagraph>
              <ContentParagraph>
                কথাটা প্রমাণ করা যায়। নিচে একটা ছোট Node.js Server, যা Connection
                এলে ছাপায় সে নিজে কী কী জানে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "layers.mjs",
          code: `import net from "node:net";

// ঠিকানা আর Port আসে Environment থেকে, Code এ লেখা নয়
const host = process.env.DEMO_HOST;
const port = Number(process.env.DEMO_PORT);
if (!host || !port) {
  throw new Error("DEMO_HOST and DEMO_PORT must be set");
}

const server = net.createServer((socket) => {
  // Kernel এর Transport Layer একটা তৈরি Connection হাতে তুলে দিল
  console.log("Transport gave me a connection:");
  console.log("  from", socket.remoteAddress + ":" + socket.remotePort);
  console.log("  to  ", socket.localAddress + ":" + socket.localPort);

  socket.on("data", (chunk) => {
    // এখানে যা আসে তা শুধুই Application এর Data, কোনো Header নেই
    console.log("Application data:", JSON.stringify(chunk.toString()));
    socket.end("BOOKED seat 4\\n");
  });
});

server.listen(port, host, () => {
  console.log("listening on", host + ":" + port);
});`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "run-layers.sh",
          code: `# প্রথম Terminal এ Server চালান
DEMO_HOST=127.0.0.1 DEMO_PORT=3000 node layers.mjs
#   listening on 127.0.0.1:3000

# দ্বিতীয় Terminal এ একটা বার্তা পাঠান
printf 'BOOK boat-7 seat 4\\n' | nc 127.0.0.1 3000
#   BOOKED seat 4

# প্রথম Terminal এ এবার দেখবেন
#   Transport gave me a connection:
#     from 127.0.0.1:57196
#     to   127.0.0.1:3000
#   Application data: "BOOK boat-7 seat 4\\n"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Output টা মন দিয়ে দেখুন, কারণ এতে পুরো Model টা ধরা আছে। আপনার
                Program জানে ওপারের IP আর Port, কারণ Kernel তাকে জানিয়েছে। কিন্তু
                সে জানে না কোন MAC Address দিয়ে এসেছে, কয়টা Router পার হয়েছে,
                Data কয় টুকরোয় ভাগ হয়ে এসেছিল, কোনো টুকরো হারিয়ে আবার এসেছে কি
                না। <code>data</code> তে সে পেয়েছে শুধু সেই লেখাটা যা ওপারের
                Program পাঠিয়েছিল। নিচের তিন Layer এর সব Header Kernel আর Network
                card খুলে ফেলে দিয়েছে, আপনার Code পর্যন্ত পৌঁছানোর আগেই। 57196
                সংখ্যাটা আপনার যন্ত্রে আলাদা হবে, কারণ ওটা Kernel এর বেছে নেওয়া
                একটা সাময়িক Port।
              </ContentParagraph>
              <ContentParagraph>
                উল্টো দিকটাও দেখা যায়। Kernel তার নিজের Layer গুলোর হিসাব রাখে, আর
                সেই হিসাব আপনি পড়তে পারেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "kernel-counters.sh",
          code: `# macOS: Kernel এর Internet Layer এ পর্যন্ত কত Packet এসেছে
netstat -s -p ip | head -4
#   ip:
#       898952 total packets received
#           0 bad header checksum
#           110547 headers (2211140 bytes) checksummed in software

# Transport Layer এর UDP অংশের হিসাব
netstat -s -p udp | head -4
#   udp:
#       115428 datagrams received
#           0 with incomplete header
#           0 with bad data length field

# Linux এ একই তথ্য
#   netstat -s | head -30
#   cat /proc/net/snmp`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এই ভাগটা জানলে তিন ধরনের সমস্যা আলাদা করতে পারবেন",
          content: (
            <p>
              কোনো সমস্যা Application Layer এ হলে আপনি Code বা Program এর Config
              বদলে সারান, যেমন ভুল URL, ভুল Header, মেয়াদ শেষ Certificate। সমস্যা
              Transport বা Internet Layer এ হলে Code বদলে লাভ নেই, তখন বদলাতে হয়
              Operating System এর Setting, Firewall এর নিয়ম বা Network এর নকশা,
              যেমন কোন Port খোলা, কোন IP থেকে আসা যাবে, Kernel একসাথে কয়টা
              Connection রাখবে। আর সমস্যা Link Layer এ হলে Cloud এ সেটা আপনার
              হাতেই নেই, ওটা Hosting কোম্পানির দায়িত্ব, আপনি শুধু Support কে
              জানাতে পারেন। একটা ভুল ধারণা এখানেই ভাঙে। অনেকে ভাবেন তাঁর Node.js
              Code থেকে TCP ধীর হচ্ছে। TCP তাঁর Code এ চলেই না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "stack-walk",
      subHeader: { index: "009", title: "Down and Up" },
      title: <SectionTitle>একটা Request, চার Layer নিচে, চার Layer উপরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার চার Layer কে একসাথে কাজ করতে দেখি। একজন পর্যটক ঢাকায় বসে ফোনে{" "}
                <code>https://islandtours.example</code> খুলে ৭ নম্বর নৌকার ৪ নম্বর
                আসন বুক করলেন। ফোনের ভেতরে বার্তাটা Application Layer এ তৈরি হয়,
                তারপর এক Layer করে নিচে নামে। প্রতিটা Layer সামনে নিজের একটা Header
                জুড়ে দেয়, ঠিক যেমন একটা চিঠি আগে খামে ঢোকে, খাম ঢোকে ডাকের বস্তায়,
                বস্তা ওঠে ভ্যানে। ওপারে Server এ ঠিক উল্টো ঘটে, প্রতিটা Layer নিজের
                মোড়কটা খুলে ভেতরেরটা উপরে তুলে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                নামার সময় মোড়ক পরানোকে বলে Encapsulation, আর ওঠার সময় মোড়ক খোলাকে
                বলে Decapsulation। আগের লেসনে এই দুই শব্দ একবার শুনেছেন, আর কত
                Byte এর কোন Header, MTU কী, এসব হিসাব নিয়ে Packet, Segment and
                Frame নামে আলাদা একটা লেসন আছে। আজ শুধু চলাটা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StackWalkLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab টা শেষ পর্যন্ত চালিয়ে থাকলে চারটা জিনিস চোখে পড়ার কথা। এগুলো
                নিজের ভাষায় বলতে পারলে এই লেসনের অর্ধেক আপনার হয়ে গেছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা Layer শুধু নিজের Header পড়ে:</strong> ফোনের TCP
                  যে Header লিখেছে, সেটা পড়ে শুধু Server এর TCP। ফোনের IP যা
                  লিখেছে, পড়ে পথের Router আর Server এর IP। প্রতিটা Layer আসলে
                  ওপারের ঠিক নিজের সমান Layer এর সাথে কথা বলছে। একই Layer এর এই দুই
                  পক্ষকে বলে Peer।
                </ListItem>
                <ListItem>
                  <strong>নিচের Layer এর কাছে উপরের সবটাই শুধু মাল:</strong> IP র
                  চোখে TCP Header আর Data মিলে একটাই বোঝা, যাকে বলে Payload। সে
                  খুলেও দেখে না ভেতরে কী। Frame এর চোখে পুরো IP Packet টাই Payload।
                  এই না দেখাটাই Layer গুলোকে স্বাধীন রাখে।
                </ListItem>
                <ListItem>
                  <strong>তিন ঠিকানা তিন Layer এ:</strong> MAC Address বলে পরের
                  যন্ত্র কোনটা, তাই প্রতি মোড়ে বদলায়। IP Address বলে শেষ গন্তব্য
                  কোনটা, তাই পুরো পথে প্রায় একই থাকে। Port বলে গন্তব্য যন্ত্রের
                  কোন Program। তিনটা মিলে একটা পূর্ণ ঠিকানা, আর এতদিন আলাদা আলাদা
                  লেসনে শেখা তিনটা জিনিস এখানে এসে এক জায়গায় দাঁড়াল।
                </ListItem>
                <ListItem>
                  <strong>শেষে যা বের হয় তা শুরুর সাথে হুবহু এক:</strong> মাঝখানে
                  তিনটা Header যোগ হলো, কয়েকবার Frame বদলাল, NAT ঠিকানা বদলাল,
                  তবু Server এর Program ঠিক সেই লেখাটাই পেল যা Browser লিখেছিল।
                  নিচের তিন Layer এর পুরো অস্তিত্বের উদ্দেশ্য এটাই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "উত্তরটা ফেরে একই পথে, শুধু দিক উল্টো",
          content: (
            <p>
              Server বুকিং নিশ্চিত করে যে উত্তর পাঠায়, সেটাও এই একই চার Layer বেয়ে
              নামে, এবার Server এর দিকে। Source আর Destination জায়গা বদল করে, Port
              443 থেকে 51514 তে, IP 103.94.135.2 থেকে পর্যটকের বাসার Public IP
              203.0.113.25 তে। বাসার Router তার NAT এর খাতা দেখে সেটাকে আবার
              192.168.1.20 তে ফিরিয়ে দেয়, ঠিক যেমন NAT লেসনে দেখেছিলেন। তারপর ফোনে
              চার Layer বেয়ে উঠে Browser এর হাতে পৌঁছায়। একটা পাতা খুলতে এই
              নামা ওঠা শত শত বার হয়, আর পুরোটা শেষ হয় এক সেকেন্ডের ভগ্নাংশে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "routers-touch",
      subHeader: { index: "010", title: "End to End" },
      title: <SectionTitle>পথের Router কোন Layer পর্যন্ত খোলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab এ মাঝের কলামটা খেয়াল করেছেন? পথের Router এ উপরের দুইটা ঘর ফাঁকা
                ছিল। এটা ভুল নয়, এটাই নকশা। ডাক বিভাগের কর্মী খামের উপরের ঠিকানা
                পড়েন, খাম খুলে চিঠি পড়েন না। চিঠিতে কী লেখা তা জানেন শুধু প্রেরক
                আর প্রাপক।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RouterTouchesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই নকশার একটা নাম আছে, End to End Principle। সহজ ভাষায়, বুদ্ধির
                কাজগুলো হবে দুই প্রান্তে, আর মাঝখানের Network থাকবে যতটা সম্ভব সরল।
                মাঝখান শুধু Packet এগিয়ে দেবে, আর কিছু নয়। শুনতে ছোট কথা, কিন্তু
                এর তিনটা বড় ফল আছে, আর তিনটাই পরের লেসনগুলোতে বারবার ফিরে আসবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Router ইচ্ছামতো Packet ফেলে দিতে পারে:</strong> কোনো
                  Router এ ভিড় বেশি হলে সে বাড়তি Packet চুপচাপ ফেলে দেয়, কাউকে
                  জিজ্ঞেসও করে না। এতে কিছু ভাঙে না, কারণ হারানো Packet আবার
                  পাঠানোর দায়িত্ব Router এর নয়, দুই প্রান্তের TCP র। পরের লেসনে
                  দেখবেন TCP কীভাবে টের পায় কিছু হারিয়েছে।
                </ListItem>
                <ListItem>
                  <strong>Router কিছু মনে রাখে না:</strong> একটা সাধারণ Router এর
                  কাছে প্রতিটা Packet নতুন, আগের Packet এর সাথে তার কোনো সম্পর্ক
                  সে জানে না। Connection বলে যে জিনিস, সেটা আছে শুধু দুই প্রান্তের
                  Kernel এর খাতায়। তাই মাঝপথে একটা Router বদলে গেলেও Connection
                  ভাঙে না, Packet অন্য পথে ঘুরে যায়, যা Module 02 তে No Center
                  Lab এ দেখেছিলেন।
                </ListItem>
                <ListItem>
                  <strong>নতুন কিছু বানাতে মাঝখানের অনুমতি লাগে না:</strong> দুই
                  প্রান্তে নতুন Program বসালেই নতুন সেবা চালু। এটা বালিঘড়িরই
                  আরেক দিক।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার সৎ হয়ে বলি, বাস্তবের Network এই নিয়ম পুরোপুরি মানে না। মাঝপথে
                এমন কিছু যন্ত্র আছে যারা নিচের দুই Layer এ থেমে থাকে না, আরও উপরে
                উঠে দেখে। এদের আপনি আগে থেকেই চেনেন, শুধু Layer এর ভাষায় এবার
                সাজিয়ে নিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["যন্ত্র", "কোন Layer পর্যন্ত খোলে", "কী দেখে, কী করে", "কোথায় দেখেছেন"],
          rows: [
            ["Switch", "Link", "MAC Address দেখে ঠিক তারে Frame পাঠায়", "Module 03, Router, Switch, Hub"],
            ["Router", "Internet", "IP Address দেখে পরের মোড় ঠিক করে", "Module 02, How Data Travels"],
            ["NAT করা বাসার Router", "Transport", "IP র সাথে Port ও বদলায়, খাতায় লিখে রাখে", "Module 03, NAT ও PAT"],
            ["Firewall, Security Group", "Transport", "IP আর Port দেখে ঢুকতে দেয় বা আটকায়", "এই Module এ, Port ও Socket লেসনে"],
            ["Layer 4 Load Balancer", "Transport", "Connection গুলো কয়েকটা Server এ ভাগ করে", "পরের Module গুলোতে"],
            ["Reverse Proxy, CDN, Layer 7 Load Balancer", "Application", "পুরো HTTP খুলে পড়ে, URL আর Header দেখে সিদ্ধান্ত নেয়", "Module 04, Cloudflare এর Proxy"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "যে যন্ত্র Application Layer পর্যন্ত ওঠে, সে আসলে পথের যন্ত্র নয়, একটা প্রান্ত",
          content: (
            <p>
              টেবিলের শেষ সারিটা বিশেষ। Cloudflare এর লেসনে কমলা মেঘ চালু করলে কী
              হতো মনে করুন। পর্যটকের Browser আসলে Cloudflare এর সাথে Connection
              করত, আর Cloudflare আলাদা একটা Connection করত আপনার Server এর সাথে।
              মানে সেখানে দুইটা আলাদা TCP Connection, দুইটা আলাদা End to End
              যাত্রা। Proxy টা প্রথম যাত্রার শেষ প্রান্ত আর দ্বিতীয় যাত্রার শুরু।
              সে চার Layer ই রাখে। এই জন্য আপনার Server এর Log এ পর্যটকের IP না
              এসে Proxy র IP আসে, আর আসল IP জানতে আলাদা একটা HTTP Header পড়তে
              হয়। কারণটা এখন Layer এর ভাষায় বলতে পারবেন। IP হলো Internet Layer এর
              তথ্য, আর দ্বিতীয় যাত্রার Internet Layer এ প্রেরক Proxy নিজেই।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "swap-layers",
      subHeader: { index: "011", title: "Swappable Layers" },
      title: <SectionTitle>একটা Layer বদলান, বাকিরা টেরও পাবে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনে পড়েছেন Layer এ ভাগ করার মূল কারণ হলো একটা অংশ বদলালে
                যেন বাকিগুলো না ভাঙে। TCP/IP তে এই কথাটা শুধু তত্ত্ব নয়, আপনি
                প্রতিদিন এটা ঘটতে দেখেন, খেয়াল না করেই। চারটা উদাহরণ দিই, প্রতিটায়
                একটা করে Layer বদলাচ্ছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Link Layer বদল:</strong> আপনি বাসা থেকে বের হলেন, ফোন
                  Wi-Fi ছেড়ে Mobile Data ধরল। পুরো Link Layer বদলে গেল, নতুন
                  মাধ্যম, নতুন পাশের যন্ত্র। অথচ Facebook App এ একটা লাইন Code ও
                  বদলাতে হয়নি।
                </ListItem>
                <ListItem>
                  <strong>Internet Layer বদল:</strong> আপনার ISP আজ IPv4 এর বদলে
                  IPv6 দিয়ে Packet পাঠাতে শুরু করল। Browser একই, HTTP একই, TCP
                  একই। শুধু মাঝের ঠিকানার ধরনটা আলাদা।
                </ListItem>
                <ListItem>
                  <strong>Transport Layer বদল:</strong> পুরনো HTTP চলত TCP র উপর।
                  নতুন HTTP/3 চলে QUIC এর উপর, যা UDP ব্যবহার করে। আপনি একই
                  Website খুলছেন, একই URL, একই পাতা। নিচে পুরো Transport বদলে
                  গেছে, আপনি টেরও পাননি।
                </ListItem>
                <ListItem>
                  <strong>Application Layer বদল:</strong> একই TCP Connection এর
                  উপর দিয়ে HTTP যেতে পারে, SSH যেতে পারে, Database এর নিজের
                  Protocol যেতে পারে। TCP র কাছে সবই শুধু Byte এর ধারা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই স্বাধীনতা থেকে একটা মজার জিনিস বের হয়, যা পরে VPN আর Docker এ
                বারবার দেখবেন। একটা Layer এর পুরো Packet কে আরেকটা Packet এর Data
                হিসেবে ভরে পাঠানো যায়। VPN ঠিক এটাই করে। সে আপনার আসল IP Packet টা
                পুরোটা নিয়ে আরেকটা UDP Datagram এর ভেতরে ঢুকিয়ে VPN Server এ
                পাঠায়। মানে IP র ভেতরে UDP, তার ভেতরে আবার IP। এর নাম Tunnel, আর
                এটা সম্ভব হয় শুধু এই কারণে যে নিচের Layer উপরের মালটা খুলে দেখে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নিজেকে যাচাই করুন, দশটা জিনিস কোন Layer এর",
          content: (
            <p>
              Layer চেনার সবচেয়ে ভালো উপায় হলো আগে থেকে চেনা জিনিসগুলোকে তাদের
              ঘরে বসানো। নিচের খেলায় দশটা জিনিস আসবে, যার সবগুলো আপনি আগের কোনো
              না কোনো লেসনে দেখেছেন। প্রতিটার Layer বলুন। কয়েকটা ইচ্ছা করে একটু
              চালাকি করে রাখা, যেমন DNS আর TLS।
            </p>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhichLayerLab /> },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "read-real-output",
      subHeader: { index: "012", title: "Seeing the Layers" },
      title: <SectionTitle>একটা Command এর Output এ চার Layer খুঁজে বের করুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসনের শুরুতে আপনাকে <code>curl -v</code> চালাতে বলেছিলাম। এবার
                সেই Output এ ফিরে যাই, কারণ এখন আপনি প্রতিটা লাইনের পাশে একটা
                Layer এর নাম লিখতে পারবেন। <code>curl</code> হলো Terminal থেকে
                একটা URL এ Request পাঠানোর Program, আর <code>-v</code> মানে
                verbose, অর্থাৎ ভেতরে কী কী হচ্ছে সব দেখাও।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "curl-by-layer.sh",
          code: `curl -sv -o /dev/null https://example.com

# * Host example.com:443 was resolved.
# * IPv4: 172.66.147.243, 104.20.23.154
#       Application Layer: DNS নাম থেকে IP বের করল

# *   Trying 172.66.147.243:443...
#       Internet Layer এর ঠিকানা (IP) আর Transport Layer এর ঠিকানা (Port)

# * Connected to example.com (172.66.147.243) port 443
#       Transport Layer: TCP Connection তৈরি হলো

# * (304) (OUT), TLS handshake, Client hello (1):
# * (304) (IN), TLS handshake, Server hello (2):
# * SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256
#       Application Layer: TLS, Program এর ভেতরের Library র কাজ

# * ALPN: server accepted h2
# > GET / HTTP/2
# < HTTP/2 200
#       Application Layer: HTTP, আসল কথোপকথন`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                খেয়াল করুন, Link Layer এর কোনো লাইন নেই। <code>curl</code> একটা
                User space এর Program, সে Frame বা MAC Address কখনো দেখেই না। এটাই
                আগের Section এর কথার প্রমাণ। Link Layer দেখতে হলে আপনাকে যন্ত্রের
                কাছে আলাদা করে জিজ্ঞেস করতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                <code>curl</code> আরেকটা কাজ পারে যা খুব কাজের। সে বলে দিতে পারে
                কোন ধাপে কতটা সময় গেছে। Module 02 এর শেষ লেসনে একটা Request এর সময়
                কোথায় যায় তার একটা হিসাব দেখেছিলেন। এবার সেই হিসাব নিজে মাপুন, Layer
                ধরে ধরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "time-by-layer.sh",
          code: `curl -s -o /dev/null \\
  -w 'dns        %{time_namelookup}s\\ntcp        %{time_connect}s\\ntls        %{time_appconnect}s\\nfirst byte %{time_starttransfer}s\\n' \\
  https://example.com

#   dns        0.001743s    নাম থেকে IP বের হলো            (Application, DNS)
#   tcp        0.005415s    TCP Connection তৈরি হলো         (Transport)
#   tls        0.014097s    TLS এর তালা চাবি ঠিক হলো         (Application, TLS)
#   first byte 0.023089s    Server এর উত্তরের প্রথম Byte এলো  (Application, HTTP)

# প্রতিটা সংখ্যা শুরু থেকে গোনা, তাই একটা থেকে আগেরটা বাদ দিলে
# সেই ধাপের নিজের সময় পাবেন। উপরের মাপে TCP নিল প্রায় ৪ মিলিসেকেন্ড,
# TLS নিল প্রায় ৯, আর Server ভেবে উত্তর দিতে নিল প্রায় ৯।
# আপনার সংখ্যা আলাদা হবে, এটাই স্বাভাবিক।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সাইট ধীর, এই অভিযোগের প্রথম উত্তর এই চার লাইন",
          content: (
            <p>
              কেউ বলল সাইটটা ধীর। আন্দাজ করার আগে এই Command টা চালান। DNS এর
              সংখ্যা বড় হলে সমস্যা Resolver বা Record এ, আগের Module এ ফিরে যান।
              TCP র সংখ্যা বড় হলে Server অনেক দূরে বা পথে সমস্যা, Code বদলে এটা
              সারবে না। TLS এর সংখ্যা বড় হলে Certificate বা TLS এর Setting
              দেখুন। আর প্রথম তিনটা ছোট অথচ first byte বড় হলে Network নির্দোষ,
              আপনার Application বা Database ই ধীর। চারটা সংখ্যা, চারটা আলাদা দল,
              চারটা আলাদা সমাধান।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "debug-by-layer",
      subHeader: { index: "013", title: "Debugging by Layer" },
      title: <SectionTitle>কাজ করছে না, কোন Layer এ ভাঙল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই পুরো Model এর সবচেয়ে বড় ব্যবহারিক লাভ এখানে। সাইট খুলছে না, এই
                বাক্যটার পেছনে শত রকম কারণ থাকতে পারে। Layer এর জ্ঞান না থাকলে
                মানুষ এলোমেলো জিনিস চেষ্টা করে, Server restart দেয়, Code বদলায়,
                Router বন্ধ করে চালু করে। Layer এর জ্ঞান থাকলে আপনি চারটা প্রশ্ন
                করেন, নিচ থেকে উপরে, আর প্রথম যে প্রশ্নের উত্তর না হয় সেখানে থামেন।
              </ContentParagraph>
              <ContentParagraph>
                নিচ থেকে শুরু করার কারণটা সরল। প্রতিটা Layer তার নিচের Layer এর
                উপর দাঁড়িয়ে আছে। ভিত না থাকলে ছাদ পরীক্ষা করে লাভ নেই। আগের লেসনে
                সাত Layer ধরে এই একই পদ্ধতি দেখেছেন, এখানে সেটা চার ধাপে নেমে
                এসেছে, আর এই চার ধাপই আপনি বাস্তবে প্রতিদিন ব্যবহার করবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "CHECK",
          steps: [
            {
              title: "Link: যন্ত্রটা Network এ জোড়া আছে তো?",
              description: (
                <span>
                  macOS এ <code>ifconfig en0</code>, Linux এ{" "}
                  <code>ip addr show</code>। দেখুন <code>status: active</code>{" "}
                  আছে কি না আর <code>inet</code> এর পাশে একটা IP আছে কি না। না
                  থাকলে এখানেই থামুন, সমস্যা তার, Wi-Fi বা DHCP তে।
                </span>
              ),
            },
            {
              title: "Internet: ওই IP তে Packet পৌঁছায় তো?",
              description: (
                <span>
                  আগে নিজের Gateway কে <code>ping</code> করুন, তারপর বাইরের একটা
                  IP কে, যেমন <code>ping -c 2 1.1.1.1</code>, তারপর গন্তব্য Server
                  এর IP কে। যেখানে প্রথম উত্তর আসা বন্ধ হয়, সমস্যা সেখানে। কোন মোড়ে
                  থামছে দেখতে <code>traceroute</code> চালান।
                </span>
              ),
            },
            {
              title: "Transport: ওই Port এ Connection হয় তো?",
              description: (
                <span>
                  <code>nc -vz 103.94.135.2 443</code>। <code>nc</code> হলো
                  netcat, একটা ছোট Program যা শুধু একটা Connection খুলে দেখে হলো
                  কি না। <code>succeeded</code> এলে এই Layer ঠিক আছে।{" "}
                  <code>Connection refused</code> এলে ওই Port এ কেউ শুনছে না। কোনো
                  উত্তরই না এসে সময় ফুরালে মাঝপথে Firewall আটকাচ্ছে।
                </span>
              ),
            },
            {
              title: "Application: ঠিক উত্তরটা আসে তো?",
              description: (
                <span>
                  <code>curl -I https://islandtours.example</code>। এবার নাম
                  ব্যবহার করুন, IP নয়, তাহলে DNS আর TLS ও পরীক্ষা হয়ে যায়।{" "}
                  <code>200</code> এলে সব ঠিক। <code>Could not resolve host</code>{" "}
                  এলে DNS, Certificate এর অভিযোগ এলে TLS, আর <code>500</code> বা{" "}
                  <code>502</code> এলে আপনার Application নিজেই।
                </span>
              ),
            },
          ],
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LayerFaultLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই চার ধাপ চালালে পর্দায় কিছু বাঁধা Error বার্তা আসে। এগুলো দেখে ভয়
              পাওয়ার কিছু নেই, বরং প্রতিটা বার্তা আপনাকে সোজা বলে দিচ্ছে কোন Layer
              এ ভেঙেছে। নিচের টেবিলটা হাতের কাছে রাখুন, কারণ আগামী বছরগুলোতে এই
              বার্তাগুলো আপনি শত শত বার দেখবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পর্দায় যা দেখবেন", "Layer", "আসল মানে", "প্রথমে কোথায় দেখবেন"],
          rows: [
            [
              <code>Network is unreachable</code>,
              "Link বা Internet",
              "যন্ত্রের কাছে বাইরে যাওয়ার কোনো পথই নেই",
              "Wi-Fi বা তার, IP পেয়েছে কি না, Gateway",
            ],
            [
              <code>No route to host</code>,
              "Internet",
              "ওই IP পর্যন্ত যাওয়ার পথ পাওয়া যায়নি",
              "Routing, Subnet, মাঝের Firewall",
            ],
            [
              <span>
                <code>Request timeout</code> (ping এ)
              </span>,
              "Internet",
              "Packet গেছে, কিন্তু উত্তর ফেরেনি",
              "traceroute, আর মনে রাখুন অনেক Server ইচ্ছা করে ping এর উত্তর দেয় না",
            ],
            [
              <span>
                <code>Connection refused</code>, Node.js এ <code>ECONNREFUSED</code>
              </span>,
              "Transport",
              "যন্ত্রটা আছে, কিন্তু ওই Port এ কেউ শুনছে না",
              "Server এ Program টা চলছে কি না, ঠিক Port এ কি না",
            ],
            [
              <span>
                <code>Operation timed out</code>, Node.js এ <code>ETIMEDOUT</code>
              </span>,
              "Transport",
              "Connection এর অনুরোধের কোনো উত্তরই আসেনি",
              "Firewall, Security Group, ভুল IP",
            ],
            [
              <span>
                <code>Connection reset by peer</code>, <code>ECONNRESET</code>
              </span>,
              "Transport",
              "চালু Connection ওপার থেকে হঠাৎ কেটে দেওয়া হয়েছে",
              "Server এর Program বন্ধ হলো কি না, মাঝের Proxy র Timeout",
            ],
            [
              <code>Could not resolve host</code>,
              "Application (DNS)",
              "নাম থেকে IP ই বের করা যায়নি",
              "Module 04 এর যাচাইয়ের ধাপ, dig",
            ],
            [
              <code>SSL certificate problem</code>,
              "Application (TLS)",
              "Connection হয়েছে, কিন্তু Certificate মানা যাচ্ছে না",
              "Certificate এর মেয়াদ, নাম মিলছে কি না",
            ],
            [
              <span>
                <code>502 Bad Gateway</code>, <code>504 Gateway Timeout</code>
              </span>,
              "Application (HTTP)",
              "সামনের Proxy পৌঁছেছে, কিন্তু পেছনের App উত্তর দেয়নি",
              "Reverse Proxy র পেছনের App চালু কি না",
            ],
            [
              <span>
                <code>404</code>, <code>500</code>
              </span>,
              "Application (HTTP)",
              "Network এর সব ঠিক, App নিজেই এই উত্তর দিয়েছে",
              "Application এর Log",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ping চলে মানে সাইট চলে না, আর ping চলে না মানে সাইট বন্ধ না",
          content: (
            <p>
              এই ভুলটা এত বেশি হয় যে আলাদা করে বলা দরকার। <code>ping</code> শুধু
              Internet Layer পরীক্ষা করে, সে কোনো Port ছোঁয়ই না। তাই ping এর উত্তর
              এলে শুধু এটুকু প্রমাণ হয় যে যন্ত্রটা জীবিত আর পথ ঠিক আছে। তার উপরের
              দুই Layer, মানে Port খোলা কি না আর App উত্তর দিচ্ছে কি না, কিছুই
              প্রমাণ হয় না। উল্টোটাও সত্যি। অনেক Server আর Cloud এর Firewall ইচ্ছা
              করে ICMP আটকে রাখে, ফলে ping ব্যর্থ হয় অথচ সাইট দিব্যি চলে। তাই ping
              ব্যর্থ হলেই Server বন্ধ ধরে নেবেন না, এক ধাপ উপরে উঠে{" "}
              <code>nc</code> দিয়ে Port টা দেখুন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "in-the-wild",
      subHeader: { index: "014", title: "Words You Will Meet" },
      title: <SectionTitle>কাজের জায়গায় যে শব্দগুলো শুনবেন, আর পাঁচটা ভুল ধারণা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Hosting এর Dashboard, Cloud এর Documentation বা সহকর্মীর মুখে কিছু
                শব্দ বারবার আসবে, যেগুলো আসলে এই চার Layer এরই অন্য নাম। আগে থেকে
                চিনে রাখলে প্রথম দিন থমকে যাবেন না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Network Stack বা TCP/IP Stack:</strong> একটা যন্ত্রের
                  Kernel এর ভেতরের Transport আর Internet Layer এর Code, অনেক সময়
                  Driver সহ। কেউ বললে Linux এর Network Stack tune করেছি, সে
                  Kernel এর Setting বদলেছে, Code নয়।
                </ListItem>
                <ListItem>
                  <strong>L4 আর L7:</strong> Layer 4 আর Layer 7 এর সংক্ষেপ। AWS এ
                  Network Load Balancer হলো L4, সে শুধু IP আর Port দেখে। Application
                  Load Balancer হলো L7, সে URL আর Header দেখে। দাম, গতি আর
                  ক্ষমতা, তিনটাই আলাদা।
                </ListItem>
                <ListItem>
                  <strong>Security Group, Firewall Rule:</strong> একটা নিয়মে সাধারণত
                  তিনটা জিনিস থাকে, Protocol (TCP না UDP), Port আর কোন IP থেকে।
                  প্রথমটা IP Header এর Protocol ঘর, দ্বিতীয়টা Transport এর,
                  তৃতীয়টা Internet এর। মানে একটা Security Group আসলে Layer 3 আর 4
                  এর একটা ছাঁকনি।
                </ListItem>
                <ListItem>
                  <strong>Protocol: TCP, Port: 443, Source: 0.0.0.0/0:</strong>{" "}
                  Dashboard এ এই রকম একটা লাইন দেখলে পড়ুন এভাবে, যেকোনো IP থেকে
                  আসা TCP র 443 Port এর Packet ঢুকতে দাও। 0.0.0.0/0 মানে সব ঠিকানা,
                  যা Subnet Mask এর লেসনের CIDR।
                </ListItem>
                <ListItem>
                  <strong>Payload আর Header:</strong> Header হলো একটা Layer এর
                  নিজের লেখা তথ্য, Payload হলো তার বয়ে নেওয়া মাল। এক Layer এর
                  Header আর Payload মিলে নিচের Layer এর Payload হয়।
                </ListItem>
                <ListItem>
                  <strong>Overhead:</strong> আসল Data ছাড়া বাড়তি যা পাঠাতে হয়,
                  মানে Header গুলো। প্রতিটা Layer কিছু Overhead যোগ করে।
                </ListItem>
                <ListItem>
                  <strong>Host:</strong> Network এর শেষ প্রান্তের যেকোনো যন্ত্র,
                  যার চার Layer ই আছে। ফোন, Laptop, Server সবাই Host। Router Host
                  নয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার পাঁচটা ভুল ধারণা, যা নতুনদের প্রায় সবার থাকে। কাউকে শেখানোর
                সময় এগুলো আগেই ভেঙে দিলে তাঁর অনেক সময় বাঁচবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ভুল ১, OSI পুরনো, তাই শেখার দরকার নেই:</strong> OSI এর
                  Protocol গুলো হারিয়েছে, কিন্তু তার সংখ্যাগুলো প্রতিদিনের ভাষা।
                  L4 আর L7 না বুঝলে Load Balancer বেছে নিতেই পারবেন না।
                </ListItem>
                <ListItem>
                  <strong>ভুল ২, TCP/IP মানে শুধু TCP আর IP:</strong> এটা পুরো
                  পরিবারের নাম। UDP দিয়ে চলা DNS ও TCP/IP র অংশ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ৩, DNS একটা আলাদা Layer:</strong> DNS একটা
                  Application Layer এর সেবা। তফাত শুধু এই যে অন্য Application গুলো
                  কাজ শুরুর আগে তাকে একবার ডাকে।
                </ListItem>
                <ListItem>
                  <strong>ভুল ৪, প্রতিটা জিনিস ঠিক একটা Layer এ বসে:</strong>{" "}
                  বেশির ভাগ বসে, কয়েকটা বসে না। ARP কে কেউ Link এ ধরে, কেউ Link আর
                  Internet এর মাঝে। TLS কে OSI তে কেউ 5 এ, কেউ 6 এ রাখে। এই তর্কে
                  সময় দেবেন না। Model একটা সাহায্য, আদালত নয়। জরুরি হলো জিনিসটা কী
                  কাজ করে আর কার উপর নির্ভর করে তা জানা।
                </ListItem>
                <ListItem>
                  <strong>ভুল ৫, আমার Code ই Packet পাঠায়:</strong> আপনার Code
                  Socket এ Data লেখে। Packet বানায় আর পাঠায় Kernel। এই কারণে একই
                  Code দুই Server এ দুই রকম আচরণ করতে পারে, যদি তাদের Kernel এর
                  Setting আলাদা হয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর চার Layer, আর কোনটা কার হাতে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর একজন Engineer হিসেবে আপনার জানা দরকার চার Layer এর
                কোনটায় আপনার কতটা হাত আছে। কারণ রাত দুইটায় বুকিং বন্ধ হয়ে গেলে
                আপনাকে মিনিটের মধ্যে ঠিক করতে হবে কাকে ডাকবেন, নিজেকে, Hosting
                কোম্পানিকে, নাকি কাউকেই না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Application Layer, পুরোটাই আপনার:</strong> পর্যটকের
                  Browser এ চলা Frontend, Server এ চলা Node.js এর API, তার সামনের
                  Reverse Proxy, TLS Certificate, DNS Record। এখানে কিছু ভাঙলে
                  দায় আর সমাধান দুইটাই আপনার দলের। App টা নিজে শোনে Port 3000 এ,
                  আর Reverse Proxy শোনে 443 এ, তারপর ভেতরে 3000 এ পাঠায়। মানে
                  একই Server এর ভেতরে Application Layer এর দুইটা Program, যাদের
                  মাঝে আরেকটা ছোট TCP Connection।
                </ListItem>
                <ListItem>
                  <strong>Transport Layer, Setting আপনার, Code নয়:</strong> কোন
                  Port খোলা থাকবে তা ঠিক করেন আপনি, Firewall বা Security Group
                  দিয়ে। Island Tours এ বাইরের দুনিয়ার জন্য খোলা শুধু 443 আর 80।
                  3000 বাইরে থেকে বন্ধ, কারণ পর্যটকের সেখানে সরাসরি যাওয়ার দরকার
                  নেই। Database এর Port ও বাইরে থেকে বন্ধ। TCP কীভাবে চলবে তা
                  Kernel এর ব্যাপার, আপনি বড়জোর কয়েকটা সংখ্যা বদলাতে পারেন।
                </ListItem>
                <ListItem>
                  <strong>Internet Layer, ঠিকানা আপনার, পথ নয়:</strong> Server এর
                  Public IP 103.94.135.2 আপনি Hosting থেকে নিয়েছেন আর DNS এ
                  বসিয়েছেন। কিন্তু ঢাকার একজন পর্যটকের Packet কোন কোন Router ঘুরে
                  আসবে তা ঠিক করে পথের ISP রা। পথ ধীর হলে আপনি পথ বদলাতে পারেন না,
                  কিন্তু Server কে পর্যটকের কাছাকাছি আনতে পারেন, বা সামনে একটা CDN
                  বসাতে পারেন।
                </ListItem>
                <ListItem>
                  <strong>Link Layer, আপনার হাতে প্রায় কিছুই নেই:</strong> Server
                  এর Network card, Data Center এর Switch আর তার, সব Hosting
                  কোম্পানির। পর্যটকের দিকে তাঁর Wi-Fi বা Mobile Data, সেটাও আপনার
                  নয়। এখানে ভাঙলে আপনি শুধু Status Page দেখতে আর Support কে
                  লিখতে পারেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই ভাগ থেকে একটা ব্যবহারিক নিয়ম বের হয়। পর্যটকের অভিযোগ এলে আগে
                বের করুন কোন Layer, তারপর দেখুন সেটা কার। দ্বীপে বসা একজন পর্যটকের
                দুর্বল Mobile Signal আপনি সারাতে পারবেন না, ওটা Link Layer আর
                আপনার নয়। কিন্তু আপনি Application Layer এ পাতাটা হালকা করতে পারেন,
                যাতে দুর্বল Link এও সেটা খোলে। নিজের Layer এ থেকে অন্যের Layer এর
                দুর্বলতা সামলানো, DevOps এর অর্ধেক কাজ আসলে এটাই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ঘটনার সময় দলকে এভাবে জানান",
          content: (
            <p>
              বুকিং কাজ করছে না, এই বার্তা দলকে কিছুই বলে না। এর বদলে লিখুন,
              Server এর IP তে ping যাচ্ছে, 443 এ Connection হচ্ছে, কিন্তু curl এ
              502 আসছে, তাই সমস্যা Reverse Proxy র পেছনের App এ। এই এক বাক্যে
              তিনটা Layer বাদ পড়ে গেল, আর যে জানে সে সোজা ঠিক জায়গায় হাত দেবে।
              Layer এর ভাষায় কথা বলতে পারাটাই একজন নতুন আর একজন অভিজ্ঞ Engineer
              এর সবচেয়ে চোখে পড়া তফাত।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা বুকিং, দুই দিকের চার Layer, দশ ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো লেসনটা এবার একটা যাত্রায় সাজাই, সব আসল সংখ্যা সহ। পর্যটকের ফোন
              192.168.1.20, বাসার Router 192.168.1.1 যার বাইরের ঠিকানা
              203.0.113.25, আর Island Tours এর Server 103.94.135.2। ধরে নিন DNS
              এর কাজ আগেই শেষ, ফোন Server এর IP জানে, আর TCP Connection ও তৈরি।
              Connection টা কীভাবে তৈরি হয় সেটা Three-way Handshake লেসনের বিষয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Application, ফোনে: Browser কথাটা লেখে",
              description:
                "পর্যটক Book চাপলেন। Browser HTTP র ভাষায় লিখল POST /bookings, সাথে নৌকা আর আসনের তথ্য। তারপর TLS Library সেটায় তালা মারল। Browser এবার এই Byte গুলো Socket এ লিখে দিল, আর তার কাজ আপাতত শেষ।",
            },
            {
              title: "Transport, ফোনের Kernel এ: TCP Header বসে",
              description:
                "Kernel এর TCP Byte গুলোকে একটা Segment এ ভরল। Header এ লিখল Source Port 51514, Destination Port 443, আর একটা Sequence Number, যাতে ওপারে ক্রম মেলানো যায়।",
            },
            {
              title: "Internet, ফোনের Kernel এ: IP Header বসে, পথ ঠিক হয়",
              description:
                "IP সামনে আরেকটা Header বসাল, Source 192.168.1.20, Destination 103.94.135.2, Protocol 6। তারপর Routing table দেখল। গন্তব্য নিজের Subnet এর বাইরে, তাই পাঠাতে হবে Gateway 192.168.1.1 এ।",
            },
            {
              title: "Link, ফোনের Wi-Fi card এ: Frame তৈরি হয়",
              description:
                "Wi-Fi card ARP এর খাতা থেকে Gateway র MAC নিল আর Frame Header বসাল, Source a4:83:e7:12:9c:01, Destination c8:3a:35:4b:10:fe, EtherType 0x0800। তারপর পুরোটা Radio তরঙ্গ হয়ে বাতাসে গেল।",
            },
            {
              title: "বাসার Router: Frame খোলে, NAT করে, নতুন Frame বানায়",
              description:
                "Router Frame খুলে IP Header পড়ল। সে NAT করে, তাই Source কে বদলে করল 203.0.113.25 আর নিজের বেছে নেওয়া একটা Port, আর খাতায় লিখে রাখল কে আসলে পাঠিয়েছিল। তারপর ISP র দিকের নতুন একটা Frame এ ভরে পাঠাল।",
            },
            {
              title: "পথের Router গুলো: শুধু IP পড়ে, এগিয়ে দেয়",
              description:
                "প্রতিটা Router একই কাজ করল। পুরনো Frame ফেলে দিল, Destination IP দেখে পরের মোড় বেছে নিল, নতুন Frame বানাল। ভেতরের TCP Segment আর Data কেউ ছুঁয়েও দেখল না।",
            },
            {
              title: "Link, Server এ: Frame খোলা হয়",
              description:
                "শেষ Frame টা Server এর Network card এ পৌঁছাল। Destination MAC নিজের, তাই সে Frame Header খুলে ফেলল। EtherType 0x0800 দেখে ভেতরের Packet টা Kernel এর IP কে দিল।",
            },
            {
              title: "Internet, Server এর Kernel এ: IP Header খোলা হয়",
              description:
                "IP দেখল Destination 103.94.135.2, মানে এই যন্ত্রই। সে Header খুলে ফেলল, আর Protocol ঘরে 6 দেখে ভেতরের Segment টা TCP কে দিল।",
            },
            {
              title: "Transport, Server এর Kernel এ: TCP মেলায়, ACK পাঠায়",
              description:
                "TCP Sequence Number মিলিয়ে দেখল সব ঠিকঠাক এসেছে, আর ফোনকে প্রাপ্তি স্বীকার পাঠাল। Destination Port 443, তাই Data গেল সেই Socket এ যেখানে Reverse Proxy শুনছে।",
            },
            {
              title: "Application, Server এ: কথাটা পড়া হয়",
              description:
                "Reverse Proxy TLS এর তালা খুলল আর পেল সেই লেখাটা, POST /bookings। সে এটা ভেতরে Port 3000 এ থাকা Node.js App কে দিল। App আসনটা বুক করল আর উত্তর লিখল। সেই উত্তর এবার এই দশ ধাপই উল্টো দিকে পার হয়ে পর্যটকের পর্দায় পৌঁছাবে।",
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
                <strong>নিজের যন্ত্রে চার Layer দেখুন</strong>, নিচের Lab এ ছয়টা
                পরীক্ষা আছে। প্রতিটা একটা করে Layer কে আলাদা করে দেখায়। পড়ার চেয়ে
                এটা দশ গুণ বেশি মনে থাকবে।
              </ListItem>
              <ListItem>
                <strong>RFC 1122</strong>, যে দলিলে চার Layer এর নাম আর প্রতিটা
                Host এর কী কী মানতে হবে তা লেখা। পুরোটা পড়ার দরকার নেই, শুধু
                Section 1.1.3 পড়ুন, এক পাতায় চার Layer এর মূল সংজ্ঞা।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc1122"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc1122
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare Learning Center, What is TCP/IP</strong>, ছোট,
                ছবি সহ একটা লেখা।{" "}
                <a
                  href="https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cloudflare.com/learning/ddos/glossary/tcp-ip
                </a>
              </ListItem>
              <ListItem>
                <strong>Beej&apos;s Guide to Network Programming</strong>, Socket
                দিয়ে Program লেখার সবচেয়ে বন্ধুসুলভ বই, বিনা পয়সায়। শুরুর দুই
                অধ্যায় এই লেসনের সাথে মেলে।{" "}
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
                <strong>Wireshark</strong>, একটা Program যা আপনার যন্ত্র দিয়ে যাওয়া
                প্রতিটা Packet ধরে Layer ধরে ধরে খুলে দেখায়। একটা Packet এ Click
                করলে চারটা Layer চারটা ভাঁজে দেখা যায়। Packet, Segment and Frame
                লেসনে এটা দিয়েই কাজ হবে।{" "}
                <a
                  href="https://www.wireshark.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  wireshark.org
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
                  OSI হলো মানচিত্র, TCP/IP হলো আসল রাস্তা। যন্ত্র চলে TCP/IP র চার
                  Layer এ, মানুষ কথা বলে OSI এর সংখ্যায়।
                </ListItem>
                <ListItem>
                  চার Layer চারটা প্রশ্নের উত্তর। Link, পাশের যন্ত্র পর্যন্ত
                  কীভাবে। Internet, পৃথিবীর কোন যন্ত্র। Transport, সেই যন্ত্রের
                  কোন Program আর কতটা যত্নে। Application, কথাটার অর্থ কী।
                </ListItem>
                <ListItem>
                  OSI এর উপরের তিনটা মিলে Application, কারণ একই Program তিন কাজই
                  করে। নিচের দুইটা মিলে Link, কারণ TCP/IP নিচের মাধ্যম নিয়ে মাথা
                  ঘামায় না। কিছু বই Link কে ভেঙে পাঁচ Layer দেখায়।
                </ListItem>
                <ListItem>
                  সব কিছু IP র উপর দিয়ে যায়। এই সরু কোমরের জন্যই নতুন App আর নতুন
                  Network প্রযুক্তি একে অপরকে না জানিয়ে আসতে পারে।
                </ListItem>
                <ListItem>
                  উপরে কাকে দিতে হবে তা বলে তিনটা ছোট সংখ্যা, EtherType, Protocol
                  Number আর Port।
                </ListItem>
                <ListItem>
                  Application থাকে আপনার Program এ, Transport আর Internet থাকে
                  Kernel এ, Link থাকে Network card এ। মাঝের দরজাটা Socket।
                </ListItem>
                <ListItem>
                  পাঠানোর সময় প্রতিটা Layer একটা Header যোগ করে, পাওয়ার সময় একটা
                  করে খোলে। শেষে যা বের হয় তা শুরুর সাথে হুবহু এক।
                </ListItem>
                <ListItem>
                  পথের Router শুধু নিচের দুই Layer ছোঁয়। বুদ্ধি থাকে দুই প্রান্তে,
                  এটাই End to End Principle। Proxy চার Layer ই রাখে, তাই সে নিজেই
                  একটা প্রান্ত।
                </ListItem>
                <ListItem>
                  কিছু ভাঙলে নিচ থেকে উপরে চার প্রশ্ন, ifconfig, ping, nc, curl।
                  প্রথম যেটা ব্যর্থ, সমস্যা সেই Layer এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আপনি এখন পুরো কাঠামোটা জানেন। পরের লেসন থেকে আমরা একটা একটা করে
                ঘরে ঢুকব, আর শুরু হবে সবচেয়ে ব্যস্ত ঘরটা দিয়ে। Internet Layer কোনো
                প্রতিশ্রুতি দেয় না, Packet হারায়, আগে পরে হয়, তবু আপনার বুকিং কখনো
                অর্ধেক পৌঁছায় না। এই অসম্ভব কাজটা যে করে তার নাম TCP। পরের লেসন,
                TCP Deep Dive, সেখানে দেখবেন একটা অনির্ভরযোগ্য রাস্তার উপর কীভাবে
                একটা নির্ভরযোগ্য কথোপকথন বানানো হয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["TCP/IP Model", "চার Layer এর নকশা, যা প্রতিটা যন্ত্রে সত্যিই চলছে"],
      ["OSI আর TCP/IP", "একই কাজের দুই রকম ভাগ, সাত আর চার। সংখ্যা OSI এর, Code TCP/IP র"],
      ["Application Layer", "কথার অর্থ। HTTP, DNS, TLS, SSH। থাকে আপনার Program এ"],
      ["Transport Layer", "কোন Program আর কতটা যত্নে। TCP, UDP, Port। থাকে Kernel এ"],
      ["Internet Layer", "পৃথিবীর কোন যন্ত্র, কোন পথে। IP, ICMP। থাকে Kernel এ"],
      ["Link Layer", "পাশের যন্ত্র পর্যন্ত। Ethernet, Wi-Fi, MAC, ARP। থাকে Network card এ"],
      ["পাঁচ Layer এর সংস্করণ", "Link কে Data Link আর Physical এ ভাগ করলে পাঁচ, বাকি সব একই"],
      ["Hourglass", "উপরে অনেক Protocol, নিচে অনেক মাধ্যম, মাঝে শুধু IP"],
      ["EtherType, Protocol Number, Port", "তিনটা সংখ্যা, যা বলে দেয় ভেতরের জিনিস উপরের কার"],
      ["Socket", "Application আর Transport এর মাঝের দরজা, User space আর Kernel এর সীমানা"],
      ["Encapsulation", "নামার সময় প্রতি Layer এ Header যোগ, ওঠার সময় খোলা"],
      ["End to End Principle", "বুদ্ধি দুই প্রান্তে, মাঝখান সরল। Router শুধু নিচের দুই Layer ছোঁয়"],
      ["Layer ধরে Debug", "নিচ থেকে উপরে, ifconfig, ping, nc, curl। প্রথম ব্যর্থটাই উত্তর"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "OSI Model আর TCP/IP Model এর সম্পর্ক সবচেয়ে ঠিকভাবে কোনটা বলে?",
        options: [
          {
            key: "A",
            text: "TCP/IP পুরনো হয়ে গেছে, এখন সব যন্ত্র OSI তে চলে",
            isCorrect: false,
            explanation:
              "উল্টো। OSI এর নিজের Protocol গুলো কখনো ছড়ায়নি। যন্ত্র চলে TCP/IP তে।",
          },
          {
            key: "B",
            text: "দুইটা একই কাজের দুই রকম ভাগ। যন্ত্র চলে TCP/IP তে, আর মানুষ Layer এর সংখ্যা বলে OSI থেকে",
            isCorrect: true,
            explanation:
              "ঠিক। তাই Layer 7 Load Balancer কথাটা OSI এর সংখ্যা, অথচ যন্ত্রটা TCP/IP তে চলে।",
          },
          {
            key: "C",
            text: "দুইটা আলাদা Network, একটা থেকে আরেকটায় যেতে Gateway লাগে",
            isCorrect: false,
            explanation: "এরা Network নয়, একই Network কে বোঝার দুইটা ছবি।",
          },
        ],
      },
      {
        id: 2,
        text: "OSI এর Session, Presentation আর Application, এই তিন Layer TCP/IP তে একটা Application Layer হয়ে গেল কেন?",
        options: [
          {
            key: "A",
            text: "কারণ বাস্তবে একই Program এই তিন কাজই নিজে করে, আলাদা স্তর লাগে না",
            isCorrect: true,
            explanation:
              "ঠিক। Browser নিজেই Login মনে রাখে, Data সাজায়, TLS এর তালা মারে আর HTTP তে কথা বলে।",
          },
          {
            key: "B",
            text: "কারণ ওই তিন কাজ এখন আর কেউ করে না",
            isCorrect: false,
            explanation: "কাজগুলো এখনো হয়, শুধু আলাদা Layer এ নয়।",
          },
          {
            key: "C",
            text: "কারণ Router এর পক্ষে সাতটা Layer খোলা ধীর",
            isCorrect: false,
            explanation: "Router উপরের Layer গুলো খোলেই না, তাই এর সাথে সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 3,
        text: "Cloud এর Dashboard এ লেখা Layer 4 Load Balancer। সে সিদ্ধান্ত নিতে কী দেখে?",
        options: [
          {
            key: "A",
            text: "URL আর Cookie",
            isCorrect: false,
            explanation: "ওগুলো Application Layer এর তথ্য, দেখে Layer 7 এর যন্ত্র।",
          },
          {
            key: "B",
            text: "IP Address আর Port",
            isCorrect: true,
            explanation:
              "ঠিক। Layer 4 মানে OSI এর Transport। সে TCP বা UDP Header পর্যন্ত পড়ে, তার ভেতরের HTTP খোলে না।",
          },
          {
            key: "C",
            text: "MAC Address",
            isCorrect: false,
            explanation: "MAC দেখে Layer 2 এর যন্ত্র, মানে Switch।",
          },
        ],
      },
      {
        id: 4,
        text: "আপনার Node.js Server এর data Event এ যা আসে তাতে কোনো IP Header বা TCP Header থাকে না। কেন?",
        options: [
          {
            key: "A",
            text: "Node.js সেগুলো নিজে কেটে ফেলে দেয়",
            isCorrect: false,
            explanation: "Node.js এর হাতে সেগুলো পৌঁছায়ই না।",
          },
          {
            key: "B",
            text: "Transport আর Internet Layer Kernel এ থাকে। Kernel নিজের Header খুলে শুধু Data টা Socket এ রাখে",
            isCorrect: true,
            explanation:
              "ঠিক। Socket হলো Kernel আর আপনার Program এর মাঝের দরজা, আর দরজার এপারে আসে শুধু Application এর Data।",
          },
          {
            key: "C",
            text: "localhost এ Header লাগে না বলে",
            isCorrect: false,
            explanation: "localhost এও TCP আর IP Header তৈরি হয়, শুধু যন্ত্রের বাইরে যায় না।",
          },
        ],
      },
      {
        id: 5,
        text: "ঢাকা থেকে Island Tours এর Server পর্যন্ত পথে থাকা একটা সাধারণ Router একটা Packet এর কোন পর্যন্ত খুলে দেখে?",
        options: [
          {
            key: "A",
            text: "IP Header পর্যন্ত, গন্তব্য ঠিকানা পড়ে পরের মোড় ঠিক করে",
            isCorrect: true,
            explanation:
              "ঠিক। সে Frame খোলে, IP পড়ে, নতুন Frame বানায়। TCP Header আর Data সে ছোঁয় না। এটাই End to End Principle।",
          },
          {
            key: "B",
            text: "পুরো HTTP Request পর্যন্ত",
            isCorrect: false,
            explanation: "এটা করে Reverse Proxy বা CDN, সাধারণ Router নয়।",
          },
          {
            key: "C",
            text: "শুধু Frame এর MAC Address, তার বেশি কিছু নয়",
            isCorrect: false,
            explanation: "শুধু MAC পর্যন্ত দেখে Switch। Router এক Layer উপরে ওঠে।",
          },
        ],
      },
      {
        id: 6,
        text: "Server এর IP তে ping এর উত্তর আসছে, কিন্তু nc -vz দিয়ে Port 443 এ Connection refused আসছে। সমস্যাটা কোথায়?",
        options: [
          {
            key: "A",
            text: "Link Layer এ, Server এর তার খোলা",
            isCorrect: false,
            explanation: "তার খোলা থাকলে ping এর উত্তরই আসত না।",
          },
          {
            key: "B",
            text: "Transport Layer এ, যন্ত্রটা জীবিত কিন্তু 443 এ কোনো Program শুনছে না",
            isCorrect: true,
            explanation:
              "ঠিক। ping প্রমাণ করেছে Link আর Internet ঠিক আছে। refused মানে Kernel সাথে সাথে না বলেছে, কারণ ওই Port এ কেউ নেই।",
          },
          {
            key: "C",
            text: "DNS এ, নামটা ভুল IP দিচ্ছে",
            isCorrect: false,
            explanation: "এখানে পরীক্ষা হয়েছে IP দিয়ে, নাম ব্যবহারই হয়নি।",
          },
        ],
      },
      {
        id: 7,
        text: "IP Header এর Protocol ঘরে 17 লেখা। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "Packet টা ১৭টা Router পার হয়েছে",
            isCorrect: false,
            explanation: "Router গোনার জন্য আলাদা ঘর আছে, যার নাম TTL।",
          },
          {
            key: "B",
            text: "ভেতরে একটা UDP Datagram আছে, তাই Kernel এটা UDP কে দেবে",
            isCorrect: true,
            explanation:
              "ঠিক। 6 মানে TCP, 17 মানে UDP, 1 মানে ICMP। এই সংখ্যা দেখেই Internet Layer ঠিক করে উপরে কাকে দেবে।",
          },
          {
            key: "C",
            text: "গন্তব্য Port 17",
            isCorrect: false,
            explanation: "Port লেখা থাকে Transport Layer এর Header এ, IP Header এ নয়।",
          },
        ],
      },
      {
        id: 8,
        text: "5G আসার পর পৃথিবীর Website গুলো নতুন করে লিখতে হয়নি। কোন নকশার জন্য এটা সম্ভব হলো?",
        options: [
          {
            key: "A",
            text: "সব Application আর সব মাধ্যমের মাঝে একটাই জিনিস, IP। নতুন মাধ্যম শুধু IP Packet বইতে শিখলেই হয়",
            isCorrect: true,
            explanation:
              "ঠিক। এটাই বালিঘড়ির সরু কোমর। Link Layer বদলালে উপরের Layer টেরও পায় না।",
          },
          {
            key: "B",
            text: "5G আসলে HTTP র একটা নতুন সংস্করণ",
            isCorrect: false,
            explanation: "5G হলো Link Layer এর প্রযুক্তি, HTTP র সাথে তার সম্পর্ক নেই।",
          },
          {
            key: "C",
            text: "Website গুলো Mobile Network ব্যবহারই করে না",
            isCorrect: false,
            explanation: "ব্যবহার করে, শুধু জানতে পারে না নিচে কোন মাধ্যম।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের যন্ত্রে চারটা Layer আলাদা করে দেখুন",
    subtitle: "Terminal এ ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "এক Command এ চার Layer",
        description:
          "curl -v এর Output এর প্রতিটা লাইনের পাশে Layer এর নাম লিখুন, আর দেখুন কোন Layer এর কোনো লাইন নেই।",
      },
      {
        title: "একবারে একটা Layer পরীক্ষা",
        description:
          "ifconfig, ping, nc আর curl দিয়ে নিচ থেকে উপরে চার Layer আলাদা করে যাচাই করুন।",
      },
      {
        title: "তিনটা সংখ্যার তালিকা",
        description:
          "নিজের যন্ত্রের ফাইলে Protocol Number আর Port এর তালিকা খুঁজে বের করুন।",
      },
      {
        title: "Kernel এর খাতা",
        description:
          "netstat দিয়ে দেখুন Kernel তার নিজের Layer গুলোতে কত Packet গুনেছে।",
      },
      {
        title: "Application যা দেখে, আর যা দেখে না",
        description:
          "একটা ছোট Node.js Server চালিয়ে দেখুন আপনার Code এর হাতে ঠিক কী পৌঁছায়।",
      },
      {
        title: "পথের Router শুধু IP চেনে",
        description:
          "traceroute দিয়ে পথের Router গুলো দেখুন, আর Layer ধরে সময় মাপুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-four-layers-one-command.sh",
        language: "bash",
        code: `curl -sv -o /dev/null https://example.com 2>&1 | head -12

# * Host example.com:443 was resolved.            <- Application (DNS)
# * IPv4: 172.66.147.243, 104.20.23.154
# *   Trying 172.66.147.243:443...                <- Internet (IP) + Transport (Port)
# * Connected to example.com (...) port 443       <- Transport (TCP)
# * (304) (OUT), TLS handshake, Client hello (1): <- Application (TLS)
# ...
# কাজ: প্রতিটা লাইনের পাশে Layer এর নাম লিখুন।
# প্রশ্ন: কোন Layer এর একটাও লাইন নেই, আর কেন?
# (উত্তর: Link। curl একটা User space এর Program, সে Frame দেখেই না।)`,
      },
      {
        filename: "2-one-layer-at-a-time.sh",
        language: "bash",
        code: `# ১. Link: Network card চালু? MAC আর IP আছে?
ifconfig en0 | grep -E "ether|inet |status|mtu"
#   en0: flags=8863<UP,BROADCAST,...> mtu 1500
#       ether 72:22:69:2a:f6:c1          <- Link Layer এর ঠিকানা
#       inet 192.168.0.103 netmask ...   <- Internet Layer এর ঠিকানা
#       status: active
# Linux এ:  ip addr show

# ২. Internet: IP পর্যন্ত পৌঁছানো যায়? (কোনো Port নেই)
ping -c 2 example.com
#   2 packets transmitted, 2 packets received, 0.0% packet loss

# ৩. Transport: Port 443 এ Connection হয়?
nc -vz example.com 443
#   Connection to example.com port 443 [tcp/https] succeeded!

# ৪. Application: ঠিক উত্তর আসে?
curl -sI https://example.com | head -1
#   HTTP/2 200

# এবার একটা বন্ধ Port এ তৃতীয় ধাপটা চালান আর তফাত দেখুন
nc -vz localhost 9
#   nc: connectx to localhost port 9 (tcp) failed: Connection refused`,
      },
      {
        filename: "3-the-three-numbers.sh",
        language: "bash",
        code: `# IP Header এর Protocol ঘরের তালিকা
grep -E "^(icmp|tcp|udp|ipv6)[[:space:]]" /etc/protocols
#   icmp    1     ICMP    # internet control message protocol
#   tcp     6     TCP     # transmission control protocol
#   udp     17    UDP     # user datagram protocol
#   ipv6    41    IPV6    # ipv6

# Port এর তালিকা, কোনটা সাধারণত কার
grep -E "^(ssh|domain|https)[[:space:]]" /etc/services
#   ssh       22/tcp
#   domain    53/udp
#   https    443/tcp
#   ...

# নিজে খুঁজুন: smtp, ntp আর postgresql কোন Port এ, আর TCP না UDP?
grep -E "^(smtp|ntp|postgresql)[[:space:]]" /etc/services`,
      },
      {
        filename: "4-kernel-counters.sh",
        language: "bash",
        code: `# Kernel এর Internet Layer এর হিসাব
netstat -s -p ip | head -6
#   ip:
#       898952 total packets received
#           0 bad header checksum
#           ...

# একটা Website খুলুন, তারপর আবার চালান।
# total packets received এর সংখ্যা বেড়ে গেছে।
# আপনার কোনো Program এই গোনার কাজ করেনি, করেছে Kernel।

# UDP র হিসাব। একটা dig চালিয়ে আগে পরে মিলিয়ে দেখুন।
netstat -s -p udp | head -3
dig +short example.com > /dev/null
netstat -s -p udp | head -3

# Linux এ
#   netstat -s | head -30
#   cat /proc/net/snmp`,
      },
      {
        filename: "5-what-the-app-sees.sh",
        language: "bash",
        code: `# Section 008 এর layers.mjs ফাইলটা একটা Folder এ রাখুন, তারপর

# ভুল করে Environment ছাড়া চালালে সে জোরে ব্যর্থ হয়, এটাই চাই
node layers.mjs
#   Error: DEMO_HOST and DEMO_PORT must be set

# প্রথম Terminal
DEMO_HOST=127.0.0.1 DEMO_PORT=3000 node layers.mjs
#   listening on 127.0.0.1:3000

# দ্বিতীয় Terminal
printf 'BOOK boat-7 seat 4\\n' | nc 127.0.0.1 3000
#   BOOKED seat 4

# প্রথম Terminal এ দেখুন
#   Transport gave me a connection:
#     from 127.0.0.1:57196      <- IP আর Port, Kernel জানিয়েছে
#     to   127.0.0.1:3000
#   Application data: "BOOK boat-7 seat 4\\n"

# প্রশ্ন: Output এ MAC Address, Sequence Number বা TTL কোথাও আছে?
# নেই, কারণ ওগুলো নিচের Layer এর, আর Socket এর এপারে আসে না।`,
      },
      {
        filename: "6-routers-and-timing.sh",
        language: "bash",
        code: `# পথের Router গুলো, প্রতিটা শুধু Internet Layer পর্যন্ত ওঠে
traceroute -n -m 8 -q 1 example.com
#    1  192.168.0.1     3.126 ms      <- বাসার Router
#    2  10.105.16.1     2.488 ms      <- ISP র ভেতরের Router
#    3  172.30.80.1     3.254 ms
#    ...
#    8  172.66.147.243  4.012 ms      <- গন্তব্য
# প্রতিটা লাইন একটা Router, আর প্রতিটা শুধু IP Header পড়েছে।
# -n মানে নাম খুঁজো না, শুধু IP দেখাও। -q 1 মানে প্রতি মোড়ে একবার মাপো।

# Layer ধরে সময়
curl -s -o /dev/null \\
  -w 'dns %{time_namelookup}s\\ntcp %{time_connect}s\\ntls %{time_appconnect}s\\nfirst byte %{time_starttransfer}s\\n' \\
  https://example.com
#   dns 0.001743s
#   tcp 0.005415s
#   tls 0.014097s
#   first byte 0.023089s

# বাড়তি, যদি sudo থাকে: একটা আসল Packet এর Layer গুলো দেখুন
#   sudo tcpdump -i en0 -c 1 -e -n 'tcp port 443'
# -e দিলে Frame এর MAC Address ও দেখায়। এক লাইনে পাবেন
# MAC (Link), IP (Internet) আর Port (Transport), তিনটাই পাশাপাশি।`,
      },
    ],
    tip: "দুই নম্বর পরীক্ষাটা কয়েকবার করুন, যতক্ষণ না চারটা Command আপনার আঙুলে বসে যায়। ifconfig, ping, nc, curl, এই ক্রমে, নিচ থেকে উপরে। এরপর যেদিন সত্যিই কিছু ভাঙবে, আপনি ঘাবড়ে গিয়ে এলোমেলো কিছু চেষ্টা করবেন না, এই চারটা চালাবেন, আর দুই মিনিটের মধ্যে বলতে পারবেন কোন Layer এ সমস্যা। আর পাঁচ নম্বর পরীক্ষাটা কাউকে শেখানোর সময় সবচেয়ে কাজের। তাঁকে শুধু জিজ্ঞেস করুন, আপনার Code কি MAC Address দেখতে পাচ্ছে। যখন তিনি দেখবেন পাচ্ছে না, Layer কথাটা তাঁর কাছে আর বইয়ের শব্দ থাকবে না।",
  },
  assignment: {
    title: "Mini Project: একটা Request এর Layer মানচিত্র",
    time: "৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>নিজের যন্ত্রের চার ঠিকানা:</strong> একটা ছকে লিখুন আপনার যন্ত্রের
        MAC Address, IP Address, Gateway র IP, আর একটা চালু Connection এর Port
        (যেমন Lab এর পাঁচ নম্বর পরীক্ষার সাময়িক Port)। প্রতিটার পাশে লিখুন এটা
        কোন Layer এর ঠিকানা, আর কোন Command দিয়ে পেলেন।
      </span>,
      <span key="2">
        <strong>সাত থেকে চার:</strong> আগের লেসনের সাতটা Layer এর নাম বাঁ দিকে
        লিখুন, ডান দিকে TCP/IP র চারটা। দাগ টেনে মেলান। তারপর নিজের ভাষায় দুই
        লাইনে লিখুন উপরের তিনটা কেন এক হলো আর নিচের দুইটা কেন এক হলো।
      </span>,
      <span key="3">
        <strong>পনেরোটা জিনিস, চারটা ঘর:</strong> এগুলোকে ঠিক Layer এ বসান। HTTP,
        Wi-Fi, TCP, 192.168.1.20, Port 3000, ARP, DNS, ICMP, UDP, Ethernet, TLS,
        SSH, MAC Address, Router, Switch। শেষ দুইটার জন্য লিখুন যন্ত্রটা কোন
        Layer পর্যন্ত খোলে।
      </span>,
      <span key="4">
        <strong>পাঁচটা Error, পাঁচটা রায়:</strong> প্রতিটার জন্য লিখুন কোন Layer
        এ ভেঙেছে, আর প্রথমে কোন Command চালাবেন। (ক) Could not resolve host। (খ)
        Connection refused। (গ) ping এ Request timeout কিন্তু সাইট খুলছে। (ঘ)
        502 Bad Gateway। (ঙ) Operation timed out।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> ধরুন আপনার একজন বন্ধু মাত্র
        Programming শিখছেন আর জিজ্ঞেস করলেন, আমি fetch লিখলে Data কীভাবে Server
        এ যায়। চিঠির উদাহরণ ব্যবহার করে চার Layer দিয়ে তাঁকে বোঝান। শর্ত একটাই,
        লেখায় কোথাও Encapsulation শব্দটা ব্যবহার করতে পারবেন না, ধারণাটা নিজের
        ভাষায় বলতে হবে।
      </span>,
    ],
    deliverables: [
      <span key="1">চার ঠিকানার ছক, Layer আর Command সহ</span>,
      <span key="2">সাত থেকে চার এর মিল, আর দুই জোড়ার কারণ</span>,
      <span key="3">পনেরোটা জিনিস চার Layer এ সাজানো</span>,
      <span key="4">পাঁচ Error এর Layer আর প্রথম Command</span>,
      <span key="5">বন্ধুর জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
