/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  AddressInspectorLab,
  OctetBinaryLab,
} from "../../../components/course/topics/ip/animations";
import {
  AddressScaleDiagram,
  IPv4AnatomyDiagram,
  IPv4vsIPv6Split,
  IPv6CompressionDiagram,
  NetworkHostDiagram,
} from "../../../components/course/topics/ip/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const ipAddressContent: TopicData = {
  id: "ip-address",
  introduction: {
    badge: "MODULE 03 · LESSON 05",
    title: <SectionTitle>যন্ত্রের নিজের ঠিকানা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          গত কয়েকটা লেসন ধরে একটা শব্দ বারবার এসেছে, IP Address। বলেছিলাম, এটা
          চিঠির চূড়ান্ত গন্তব্য, যেটা পুরো পথে এক থাকে, শুরু থেকে শেষ। MAC যেখানে
          শুধু পাশের হাতের কথা বলে, IP সেখানে বলে শেষমেশ কোথায় পৌঁছাতে হবে,
          দুনিয়ার যেকোনো কোণায়। কিন্তু এতদিন আমরা IP এর ভেতরটা খুলে দেখিনি।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে সেটাই করব। একটা IP Address দেখতে ঠিক কেমন, তার ভেতরে কী লুকানো
          আছে, আর কেন তার দুইটা আলাদা রূপ, IPv4 আর IPv6। সবচেয়ে মজার প্রশ্নটা
          হলো, একটা রূপ থাকতে দ্বিতীয় রূপটা বানানো লাগল কেন? উত্তরটা একটা সত্যিকারের
          সংকটের গল্প, দুনিয়ায় ঠিকানা ফুরিয়ে যাওয়ার গল্প।
        </ContentParagraph>
        <ContentParagraph>
          ভয় পাবেন না, এখানে জটিল কিছু নেই। আমরা একদম শুরু থেকে যাব, একটা সংখ্যা
          কেন 255 এর বেশি হয় না সেখান থেকে, আর প্রতিটা ধাপ নিজের চোখে দেখার একটা
          করে উপায় থাকবে। শেষে একটা IP দেখলেই আপনি বলে দিতে পারবেন সেটা কোন রূপের,
          কীভাবে গড়া, আর কেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "MAC বলে এই মুহূর্তে পাশের কে। IP বলে শেষমেশ কোথায়, দুনিয়ার যেকোনো প্রান্তে। আর সেই দুনিয়াটা এত বড় হয়ে গেছে যে পুরনো ঠিকানার ভাণ্ডার আর কুলায় না, তাই নতুন একটা এল।",
      author: "Computer Networking",
      role: "Lesson 05",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "what",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা IP Address আসলে কী দেখতে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি নিশ্চয়ই কোথাও এমন সংখ্যা দেখেছেন, 192.168.0.5। এটাই একটা IP
                Address, তার সবচেয়ে চেনা রূপ, যাকে বলে IPv4। দেখতে চারটা সংখ্যা,
                মাঝে ফোঁটা দিয়ে আলাদা করা। প্রথমে মনে হয় এলোমেলো, কিন্তু এর
                পুরোটাই সাজানো, আর সেই সাজানোটা বুঝলে অনেক কিছু পরিষ্কার হয়ে যায়।
              </ContentParagraph>
              <ContentParagraph>
                একটা জিনিস আগে খেয়াল করুন, প্রতিটা সংখ্যা 0 থেকে 255 এর মধ্যে
                থাকে, কখনো এর বাইরে যায় না। কেন? কারণ প্রতিটা সংখ্যা আসলে একটা
                Byte, মানে ৮টা Bit, যেটা আপনি Lesson 01 এ দেখেছিলেন। ৮টা Bit
                দিয়ে সবচেয়ে ছোট বানানো যায় 0, আর সবচেয়ে বড় 255, তার বেশি ধরে
                না। চারটা Byte মিলিয়ে মোট ৩২টা Bit, আর এই ৩২ Bit ই একটা যন্ত্রের
                পুরো ঠিকানা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <IPv4AnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তাহলে ঠিকানাটা কীসের জন্য? একদম সহজ কথায়, যাতে উত্তর ফিরে আসতে
              পারে। আপনি যখন কোনো সার্ভারে অনুরোধ পাঠান, সার্ভারকে তো জানতে হবে
              উত্তরটা কোথায় ফেরত দেবে। আপনার যন্ত্রের IP ই সেই ফেরত ঠিকানা। ঠিক
              যেমন চিঠির খামে নিজের ঠিকানা না লিখলে জবাব আসে না, তেমন। প্রতিটা
              যন্ত্রের একটা IP লাগে, যাতে দুনিয়া তাকে খুঁজে পায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একটু নিজে হাতে দেখা যাক, কেন একটা সংখ্যা 255 এর বেশি হতে পারে
              না। নিচের ঘরগুলোতে চাপ দিয়ে Bit জ্বালান আর নেভান, আর দেখুন সংখ্যাটা
              কীভাবে গড়ে ওঠে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OctetBinaryLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "IP আর MAC, একটু মিলিয়ে নিন",
          content: (
            <p>
              আগের লেসনে MAC দেখেছিলেন, সেটা কারখানায় গাঁথা, সমতল, আর LAN ছাড়ে
              না। IP এর স্বভাব উল্টো। IP যন্ত্রকে দেওয়া হয়, বসানো, তাই বদলানো
              যায়। আর IP এলাকাভিত্তিক, মানে এর ভেতরে কোন এলাকা সেই হিসাব লুকানো
              আছে, তাই এটা দিয়ে দূরের পথ খোঁজা যায়। এই এলাকার হিসাবটা পরের
              অংশে দেখব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "two-halves",
      subHeader: { index: "002", title: "Two Halves" },
      title: <SectionTitle>ঠিকানার দুই ভাগ, এলাকা আর বাসা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ডাকঠিকানার কথা ভাবুন। সেখানে একটা অংশ বলে কোন এলাকা, কোন
                মহল্লা, আর একটা অংশ বলে সেই মহল্লার ঠিক কোন বাসা। ডাকপিয়ন প্রথমে
                এলাকা ধরে এগোয়, ঠিক এলাকায় পৌঁছে তারপর বাসা খোঁজে। তাকে দুনিয়ার
                প্রতিটা বাসার নাম মুখস্থ রাখতে হয় না, শুধু এলাকা চিনলেই হয়।
              </ContentParagraph>
              <ContentParagraph>
                IP Address ও ঠিক তেমন, দুই ভাগ। বাঁ দিকের অংশ বলে কোন Network,
                মানে কোন এলাকা। ডান দিকের অংশ বলে সেই Network এর ঠিক কোন যন্ত্র,
                মানে কোন বাসা। এই ভাগ থাকে বলেই একটা Router শুধু Network অংশ দেখে
                পথ ঠিক করতে পারে, দুনিয়ার প্রতিটা যন্ত্রের নাম তার মনে রাখতে হয়
                না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NetworkHostDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই এলাকাভিত্তিক গড়নটাই MAC আর IP এর বড় তফাত। MAC সমতল, তার ভেতরে
              কোনো এলাকার হিসাব নেই, তাই সেটা দিয়ে দূরের পথ খোঁজা যায় না। IP
              এলাকা অনুযায়ী সাজানো, তাই দূরের যাত্রায় Router রা IP দেখেই দিক ঠিক
              করে। এই কারণেই দূরের পথে IP লাগে, আর কাছের হাতবদলে MAC।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ভাগটা ঠিক কোথায় পড়ে?",
          content: (
            <p>
              এখন প্রশ্ন আসতে পারে, 192.168.0.5 এর মধ্যে Network অংশ কতটুকু আর
              Host অংশ কতটুকু, লাইনটা ঠিক কোথায় টানা? এটা একটা চমৎকার প্রশ্ন, আর
              এর পুরো উত্তর একটা আলাদা লেসন, Subnet Mask। আপাতত শুধু এটুকু মনে
              রাখুন, প্রতিটা IP এর ভেতরে একটা Network অংশ আর একটা Host অংশ আছে,
              আর কোথায় ভাগ পড়বে সেটা ঠিক করে Subnet Mask, পরের লেসনগুলোতে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "why-ran-out",
      subHeader: { index: "003", title: "Running Out" },
      title: <SectionTitle>কেন IPv4 ফুরিয়ে গেল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সেই সংকটের গল্প। IPv4 এ মোট ৩২টা Bit, মনে আছে তো। ৩২টা Bit
                দিয়ে সব মিলিয়ে বানানো যায় প্রায় ৪৩০ কোটি আলাদা ঠিকানা,
                ইংরেজিতে যাকে বলে 4.3 বিলিয়ন। যেদিন এই ব্যবস্থা বানানো হয়েছিল,
                তখন এত সংখ্যা অকল্পনীয় বড় মনে হতো, কে ভাবতে পেরেছিল এত যন্ত্র
                হবে।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু হিসাবটা উল্টে গেল। আজ পৃথিবীতে শুধু মানুষই ৮০০ কোটির বেশি,
                আর প্রত্যেকের হাতে একাধিক যন্ত্র, Phone, Laptop, ঘড়ি, টিভি,
                ঘরের নানা জিনিস, সব Internet এ। যন্ত্রের সংখ্যা ঠিকানার সংখ্যাকে
                অনেক আগেই ছাড়িয়ে গেছে। ফল যা হওয়ার তাই হলো, ২০১১ সালের দিকে
                উপরের স্তরের নতুন IPv4 ঠিকানার ভাণ্ডার আনুষ্ঠানিকভাবে শেষ হয়ে
                গেল।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <AddressScaleDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই সমস্যা সামলাতে দুইটা আলাদা পথ নেওয়া হয়েছে। একটা হলো অস্থায়ী
              বুদ্ধি, অনেক যন্ত্র মিলে একটা ঠিকানা ভাগ করে ব্যবহার করে, যাতে
              বাইরের দুনিয়ায় কম ঠিকানা লাগে। এই কৌশলের নাম NAT, আর বাসার ভেতরের
              আলাদা ঠিকানার গল্প, দুইটাই পরের লেসনগুলোর বিষয়। আর দ্বিতীয় পথটা
              হলো আসল সমাধান, একটা সম্পূর্ণ নতুন আর বড় ঠিকানা ব্যবস্থা বানানো,
              যার নাম IPv6। সেটাই এই লেসনের পরের অংশ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "সংখ্যাটা কেন এত জরুরি",
          content: (
            <p>
              ৪.৩ বিলিয়ন শুনতে বিশাল, কিন্তু দুনিয়ার যন্ত্রের সামনে সেটা ছোট
              হয়ে গেছে। এই একটা সীমা থেকেই IPv6 এর জন্ম, NAT এর জন্ম, বাসার
              ভেতরের আলাদা ঠিকানার জন্ম, সব। তাই এই সংখ্যাটা মনে রাখলে পরের
              কয়েকটা লেসন কেন দরকার, সেটা নিজে থেকেই বোঝা যাবে। সবগুলো আসলে একই
              সমস্যার নানা উত্তর।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "ipv6",
      subHeader: { index: "004", title: "IPv6" },
      title: <SectionTitle>IPv6, অনেক বড় ঠিকানা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                IPv4 এর সমস্যা ছিল সংখ্যায় ছোট, তাই সমাধানটা সোজা, আরও বড় ঠিকানা
                বানাও। IPv6 তে ৩২ Bit এর জায়গায় পুরো ১২৮টা Bit। এই তফাতটা যত
                ছোট শোনায়, ফল তত ছোট নয়। ঠিকানার সংখ্যা দ্বিগুণ বা চারগুণ নয়,
                এটা এমন বড় হয়ে যায় যে লিখতে গেলে সংখ্যাটা প্রায় অর্থহীন মনে হয়,
                ৩৪০ আনডেসিলিয়ন, মানে ৩৪০ এর পরে ৩৬টা শূন্য।
              </ContentParagraph>
              <ContentParagraph>
                এত বড় সংখ্যা মাথায় ধরানো কঠিন, তাই একটা তুলনা দিই। IPv6 এ এত
                ঠিকানা আছে যে পৃথিবীর প্রতিটা মানুষকে আলাদা করে গোটা IPv4 Internet
                এর সমান করে ঠিকানা দিলেও ফুরাবে না। কার্যত এটা কখনো শেষ হবে না,
                অন্তত আমাদের চিন্তার সীমার মধ্যে।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু এত বড় সংখ্যা তো আর 192.168.0.5 এর মতো ছোট করে লেখা যায় না।
                তাই IPv6 লেখা হয় অন্যভাবে, আটটা দলে, প্রতিটা দল চারটা Hex অক্ষরের,
                মাঝে কোলন দিয়ে আলাদা। যেমন 2001:0db8:85a3:0000:0000:8a2e:0370:7334।
                লম্বা, তাই না? এই কারণেই একে ছোট করে লেখার নিয়ম আছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <IPv6CompressionDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>শুরুর শূন্য বাদ:</strong> প্রতিটা দলের সামনের শূন্যগুলো
                ফেলে দেওয়া যায়। যেমন 0db8 লেখা যায় শুধু db8, আর 0000 লেখা যায়
                শুধু 0। অর্থ একই থাকে।
              </ListItem>
              <ListItem>
                <strong>টানা শূন্য :: দিয়ে:</strong> একটানা যত শূন্যের দল আছে,
                তার পুরোটা একবার দুই কোলন দিয়ে বদলে দেওয়া যায়। তাই মাঝের
                0000:0000 হয়ে যায় শুধু একটা ::।
              </ListItem>
              <ListItem>
                <strong>:: একবারই:</strong> এই দুই কোলন পুরো ঠিকানায় একবারই
                ব্যবহার করা যায়। দুইবার করলে কেউ আর বুঝত না ঠিক কয়টা শূন্যের দল
                কোথায় লুকানো। একবার থাকলে বাকিটা গুনে বের করা যায়।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা চেনা IPv6, ::1",
          content: (
            <p>
              সবচেয়ে ছোট আর চেনা IPv6 ঠিকানা হলো ::1। এই দুই কোলন মানে সামনের সব
              দলই শূন্য, শুধু শেষে একটা 1। এটার একটা বিশেষ মানে আছে, নিজের সাথে
              নিজে, যাকে বলে loopback। IPv4 তে এই একই কাজ করে 127.0.0.1। মানে
              দুইটা আসলে যমজ, দুই প্রজন্মের দুই রূপ। localhost বললে যন্ত্র এদেরই
              বোঝে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "side-by-side",
      subHeader: { index: "005", title: "Side by Side" },
      title: <SectionTitle>পাশাপাশি রাখলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার দুইটা এক জায়গায় রাখি, যাতে তফাতটা এক নজরে বোঝা যায়। মূল কথা
              একটাই, দুইটা একই কাজ করে, একটা যন্ত্রকে ঠিকানা দেয় যাতে উত্তর ফিরে
              আসে। তফাত শুধু আকারে আর লেখার ধরনে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <IPv4vsIPv6Split /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা স্বাভাবিক প্রশ্ন, IPv6 যদি এত ভালো, তাহলে সবাই একদিনে বদলে
              নিল না কেন? কারণ Internet এত বড় যে একদিনে সবকিছু বদলানো অসম্ভব।
              তাই দুইটা এখন পাশাপাশি চলে, বেশিরভাগ যন্ত্র আর সার্ভার দুইটাই বোঝে,
              যাকে বলে Dual Stack। ধীরে ধীরে IPv6 বাড়ছে, কিন্তু IPv4 এখনো
              সর্বত্র। তাই একজন Developer হিসেবে আপনাকে দুইটার সাথেই পরিচিত থাকতে
              হবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে কয়েকটা সত্যিকারের ঠিকানা দিলাম। প্রতিটাতে চাপ দিয়ে দেখুন, সে
              কোন রূপের, কীভাবে গড়া। একটা নিয়ম নিজেই ধরা পড়বে, বিরামচিহ্ন দেখেই
              চেনা যায়, ফোঁটা মানে IPv4, কোলন মানে IPv6।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <AddressInspectorLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "project",
      subHeader: { index: "006", title: "Project Example" },
      title: <SectionTitle>IP আর Island Tours</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একজন Backend Developer হিসেবে IP আপনার রোজকার সঙ্গী, MAC এর মতো
                লুকিয়ে থাকা কিছু নয়। Island Tours এর সার্ভার চালাতে গিয়ে IP
                কোথায় কোথায় সামনে আসে, দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সার্ভারের নিজের IP:</strong> Island Tours এর API যে
                  যন্ত্রে চলে, তার একটা IP আছে, যেটা দিয়ে দুনিয়া তাকে খুঁজে পায়।
                  আজকের Cloud এ প্রায়ই একটা IPv4 আর একটা IPv6 দুইটাই থাকে, যাতে
                  পুরনো আর নতুন দুই ধরনের ইউজারই পৌঁছাতে পারে।
                </ListItem>
                <ListItem>
                  <strong>Log এ ইউজারের IP:</strong> কে কখন বুকিং করল, আপনার Log
                  এ তার IP লেখা থাকে, MAC নয়, কারণ MAC তো LAN ছাড়ে না। এই IP
                  কখনো IPv4 রূপে আসবে, কখনো IPv6 রূপে, ইউজার কীভাবে এসেছে তার উপর
                  নির্ভর করে। তাই আপনার কোডকে দুই রূপই সামলাতে জানতে হবে।
                </ListItem>
                <ListItem>
                  <strong>ভেতরের যন্ত্রদের IP:</strong> API আর Database যদি একই
                  ভেতরের Network এ থাকে, তারা 192.168 বা 10 দিয়ে শুরু হওয়া
                  ভেতরের IP দিয়ে কথা বলে। এই ভেতরের ঠিকানা বাইরে থেকে দেখা যায় না,
                  কেন সেটা পরের লেসন, Public আর Private IP।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Log এ কখনো মেশানো রূপ দেখবেন",
          content: (
            <p>
              একটা সার্ভার যখন IPv4 আর IPv6 দুইটাই বোঝে, তখন Log এ কখনো এমন
              অদ্ভুত রূপ দেখতে পারেন, ::ffff:103.94.135.2। ভয় পাবেন না, এটা আসলে
              একটা IPv4 ঠিকানাকেই IPv6 এর মোড়কে লিখে রাখা, যাতে এক ব্যবস্থায়
              দুইটা সামলানো যায়। মানেটা একই, শুধু লেখার ধরন মেশানো। কোডে IP মেলাতে
              গেলে এই রূপটা যেন আপনাকে চমকে না দেয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "request-flow",
      subHeader: { index: "007", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা অনুরোধ IP ধরে যেভাবে চলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি Island Tours এর সাইটে ঢুকলেন। IPv4 নাকি IPv6, কোনটা ব্যবহার
              হবে, আর সেটা কীভাবে ঠিক হয়, ধাপে ধাপে দেখি। আগের লেসনের ARP আর MAC
              এখানে আবার আসবে, তাই টুকরোগুলো জোড়া লাগবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "নাম থেকে IP চাওয়া",
              description:
                "আপনি একটা নাম লেখেন, IP নয়। নাম থেকে IP বের করে DNS, যেটা Module 04 এর বিষয়। মজার কথা, একটা নামের নিচে দুই ধরনের ঠিকানাই থাকতে পারে, IPv4 এর জন্য একটা (নাম A) আর IPv6 এর জন্য একটা (নাম AAAA)।",
            },
            {
              title: "যন্ত্র একটা বেছে নেয়",
              description:
                "আপনার যন্ত্র আর সার্ভার দুইজনেই IPv6 বুঝলে সাধারণত IPv6 বেছে নেওয়া হয়, নাহলে IPv4 তে নামে। এই বেছে নেওয়াটা নিজে থেকেই হয়, আপনি টেরও পান না। ফল যাই হোক, এখন হাতে একটা গন্তব্য IP আছে।",
            },
            {
              title: "খামে দুই IP বসে",
              description:
                "যন্ত্র চিঠির খামে দুইটা IP লেখে, উৎস আপনার নিজের IP আর গন্তব্য সার্ভারের IP। এই দুইটা পুরো পথে এক থাকে, শুরু থেকে শেষ, কারণ এটাই চূড়ান্ত ঠিকানা।",
            },
            {
              title: "প্রতি Router দিক ঠিক করে",
              description:
                "প্রতিটা Router গন্তব্য IP এর Network অংশ দেখে ঠিক করে পরের দিক কোনটা। এই এলাকাভিত্তিক গড়নের কারণেই সে দুনিয়ার প্রতিটা যন্ত্র না চিনেও ঠিক পথে ঠেলে দিতে পারে।",
            },
            {
              title: "প্রতি Hop এ MAC লাগে",
              description:
                "কিন্তু IP একা এক Hop পার হতে পারে না, পরের হাতে দিতে লাগে সেই হাতের MAC। IP থেকে সেই MAC বের করে ARP, তারপর MAC পৌঁছে দেয়। IP দিক ঠিক করে, ARP অনুবাদ করে, MAC পৌঁছে দেয়, বিস্তারিত আগের লেসনে দেখেছেন।",
            },
            {
              title: "উত্তর উল্টো পথে",
              description:
                "গন্তব্য IP মিলল, সার্ভার অনুরোধ নিল আর উত্তর তৈরি করল। উত্তর ফেরে ঠিক উল্টো দিকে, এবার উৎস আর গন্তব্য IP জায়গা বদল করে, কারণ এখন সার্ভার পাঠাচ্ছে আর আপনি পাচ্ছেন।",
            },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "resources",
      subHeader: { index: "008", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিজের IP দেখুন</strong>, নিচের Lab এ কমান্ড আছে। আপনার
                যন্ত্রের IPv4 আর IPv6 দুইটাই বের করে গঠনটা এই লেসনের সাথে মিলিয়ে
                দেখুন, বিশেষ করে IPv6 টা কত লম্বা।
              </ListItem>
              <ListItem>
                <strong>PowerCert Animated Videos</strong>, IP Address আর IPv4 বনাম
                IPv6 নিয়ে ছোট, সহজ Animation।{" "}
                <a
                  href="https://www.youtube.com/@PowerCertAnimatedVideos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  youtube.com/@PowerCertAnimatedVideos
                </a>
              </ListItem>
              <ListItem>
                <strong>Practical Networking</strong>, Search করুন: IP Addressing।
                একটু ধীরে, একদম গোড়া থেকে বোঝানো।{" "}
                <a
                  href="https://www.youtube.com/@PracticalNetworking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  youtube.com/@PracticalNetworking
                </a>
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "recap",
      subHeader: { index: "009", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                IP Address একটা যন্ত্রের ঠিকানা, যাতে উত্তর ফিরে আসতে পারে। এর
                চেনা রূপ IPv4, যেমন 192.168.0.5।
              </ListItem>
              <ListItem>
                IPv4 এ চারটা সংখ্যা, প্রতিটা একটা Byte, মানে ৮ Bit, তাই প্রতিটা
                0 থেকে 255। চারটা মিলে মোট ৩২ Bit।
              </ListItem>
              <ListItem>
                প্রতিটা IP এর দুই ভাগ, Network অংশ (কোন এলাকা) আর Host অংশ (কোন
                যন্ত্র)। এই কারণেই Router শুধু এলাকা দেখে পথ ঠিক করে। ভাগ কোথায়,
                বলে Subnet Mask, পরের লেসন।
              </ListItem>
              <ListItem>
                ৩২ Bit দিয়ে সব মিলিয়ে ৪.৩ বিলিয়ন ঠিকানা, যেটা দুনিয়ার যন্ত্রের
                সামনে ফুরিয়ে গেছে। এটাই IPv6 আর NAT দরকার হওয়ার মূল কারণ।
              </ListItem>
              <ListItem>
                IPv6 এ ১২৮ Bit, কার্যত অফুরান ঠিকানা। লেখা হয় আটটা দলে, Hex অক্ষরে,
                কোলন দিয়ে আলাদা। শুরুর শূন্য বাদ আর টানা শূন্য :: দিয়ে ছোট করা যায়।
              </ListItem>
              <ListItem>
                চেনার সহজ নিয়ম, ফোঁটা মানে IPv4, কোলন মানে IPv6। 127.0.0.1 আর ::1
                একই কাজ করে, নিজের সাথে নিজে, loopback।
              </ListItem>
              <ListItem>
                আজও দুইটা পাশাপাশি চলে (Dual Stack), তাই Developer কে দুই রূপই
                জানতে হয়। Log এ ইউজারের IP থাকে, কখনো মেশানো রূপেও।
              </ListItem>
              <ListItem>
                পরের লেসন: বাসার ভেতরের IP আর বাইরের IP আলাদা কেন, Public বনাম
                Private IP।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["শব্দ", "এক লাইনে"],
    rows: [
      [
        <span className="font-bold text-primary">IP Address</span>,
        "যন্ত্রের ঠিকানা, যাতে উত্তর ফিরে আসতে পারে",
      ],
      [
        <span className="font-bold text-primary">IPv4</span>,
        "চারটা সংখ্যা, প্রতিটা 0 থেকে 255, মোট ৩২ Bit",
      ],
      [
        <span className="font-bold text-primary">Octet</span>,
        "IPv4 এর প্রতিটা সংখ্যা, একটা Byte, ৮ Bit, তাই সর্বোচ্চ 255",
      ],
      [
        <span className="font-bold text-primary">Network / Host</span>,
        "ঠিকানার দুই ভাগ, কোন এলাকা আর সেই এলাকার কোন যন্ত্র",
      ],
      [
        <span className="font-bold text-primary">IPv4 এর সীমা</span>,
        "৪.৩ বিলিয়ন ঠিকানা, দুনিয়ার যন্ত্রের সামনে ফুরিয়ে গেছে",
      ],
      [
        <span className="font-bold text-primary">IPv6</span>,
        "১২৮ Bit, কার্যত অফুরান, Hex দল, কোলন দিয়ে আলাদা",
      ],
      [
        <span className="font-bold text-primary">::</span>,
        "IPv6 তে একটানা শূন্যের দল, ছোট করে লেখা, একবারই",
      ],
      [
        <span className="font-bold text-primary">loopback</span>,
        "নিজের সাথে নিজে, IPv4 তে 127.0.0.1, IPv6 তে ::1",
      ],
      [
        <span className="font-bold text-primary">Dual Stack</span>,
        "একই যন্ত্র IPv4 আর IPv6 দুইটাই বোঝে",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "IPv4 এর প্রতিটা সংখ্যা কেন সর্বোচ্চ 255, এর বেশি নয়?",
        options: [
          {
            key: "A",
            text: "255 এর পরে গোল সংখ্যা নেই বলে",
            isCorrect: false,
            explanation:
              "ব্যাপারটা গোল সংখ্যার নয়, Bit এর। প্রতিটা সংখ্যা একটা Byte, ৮ Bit ধরে।",
          },
          {
            key: "B",
            text: "প্রতিটা সংখ্যা একটা Byte, মানে ৮ Bit, আর ৮ Bit এর সর্বোচ্চ 255",
            isCorrect: true,
            explanation:
              "ঠিক। আটটা Bit সবই জ্বালালে হয় 255। 256 এর জন্য ৯ম একটা Bit লাগত, যেটা একটা Byte এ নেই।",
          },
          {
            key: "C",
            text: "ISP 255 এর বেশি দিতে চায় না বলে",
            isCorrect: false,
            explanation:
              "এটা ISP এর সিদ্ধান্ত নয়, এটা গঠনের সীমা। ৮ Bit এর বেশি একটা Byte ধরতেই পারে না।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা ঠিকানায় ফোঁটার বদলে কোলন দেখলে সেটা কোন রূপের?",
        options: [
          {
            key: "A",
            text: "IPv4",
            isCorrect: false,
            explanation:
              "উল্টো। ফোঁটা মানে IPv4, ছোট, চারটা সংখ্যা। কোলন নয়।",
          },
          {
            key: "B",
            text: "IPv6",
            isCorrect: true,
            explanation:
              "ঠিক। কোলন মানে IPv6, বড়, আটটা দল Hex অক্ষরে। এটাই চেনার সবচেয়ে সহজ নিয়ম।",
          },
          {
            key: "C",
            text: "কোলন থাকলে সেটা IP নয়, MAC",
            isCorrect: false,
            explanation:
              "MAC এ কোলন থাকে ঠিকই, কিন্তু MAC ছয় জোড়া, আর IPv6 আটটা দল। প্রসঙ্গ দেখে আলাদা করা যায়। এখানে কথা IP নিয়ে, কোলন মানে IPv6।",
          },
        ],
      },
      {
        id: 3,
        text: "IPv6 বানানো লাগল কেন?",
        options: [
          {
            key: "A",
            text: "IPv4 এর ৪.৩ বিলিয়ন ঠিকানা দুনিয়ার যন্ত্রের সামনে ফুরিয়ে গেছে",
            isCorrect: true,
            explanation:
              "ঠিক। ৩২ Bit এর সীমা ৪.৩ বিলিয়ন, আর যন্ত্র তার চেয়ে অনেক বেশি হয়ে গেছে। তাই বড় ঠিকানা দরকার হলো।",
          },
          {
            key: "B",
            text: "IPv4 খুব ধীর ছিল, IPv6 দ্রুত",
            isCorrect: false,
            explanation:
              "গতির সমস্যা নয়। সমস্যা ছিল সংখ্যা, ঠিকানা ফুরিয়ে যাওয়া।",
          },
          {
            key: "C",
            text: "IPv4 হ্যাক হয়ে গিয়েছিল",
            isCorrect: false,
            explanation:
              "নিরাপত্তার গল্প নয়। মূল কারণ একটাই, ঠিকানা ফুরিয়ে যাওয়া।",
          },
        ],
      },
      {
        id: 4,
        text: "2001:db8:85a3::8a2e:370:7334 এর মাঝের :: কী বোঝায়?",
        options: [
          {
            key: "A",
            text: "ঠিকানাটা এখানে শেষ",
            isCorrect: false,
            explanation:
              "না, এটা শেষ নয়। :: এর পরেও দল আছে। এটা একটা ছোট করে লেখার চিহ্ন।",
          },
          {
            key: "B",
            text: "একটানা কয়েকটা শূন্যের দল, ছোট করে লেখা",
            isCorrect: true,
            explanation:
              "ঠিক। পুরো রূপে ওখানে থাকত 0000:0000, সেই টানা শূন্যগুলোকে :: দিয়ে ছোট করা হয়েছে। পুরো ঠিকানায় একবারই এটা করা যায়।",
          },
          {
            key: "C",
            text: "দুইটা আলাদা ঠিকানা জোড়া দেওয়া",
            isCorrect: false,
            explanation:
              "একটাই ঠিকানা। :: মানে মাঝখানে একগাদা শূন্য বাদ দেওয়া, দুইটা ঠিকানা নয়।",
          },
        ],
      },
      {
        id: 5,
        text: "127.0.0.1 আর ::1 এর মধ্যে সম্পর্ক কী?",
        options: [
          {
            key: "A",
            text: "একটা ভুল, দুইটা একসাথে থাকতে পারে না",
            isCorrect: false,
            explanation:
              "দুইটাই ঠিক, আর একসাথেই থাকে। একটা IPv4 রূপ, একটা IPv6 রূপ।",
          },
          {
            key: "B",
            text: "দুইটাই loopback, নিজের সাথে নিজে, শুধু দুই প্রজন্মের দুই রূপ",
            isCorrect: true,
            explanation:
              "ঠিক। 127.0.0.1 হলো IPv4 এর loopback, ::1 হলো IPv6 এর। দুইটাই যন্ত্রকে নিজের দিকে ফেরায়, localhost বললে এদেরই বোঝায়।",
          },
          {
            key: "C",
            text: "::1 হলো 127.0.0.1 এর পরের যন্ত্র",
            isCorrect: false,
            explanation:
              "এরা পরপর কোনো যন্ত্র নয়। দুইটাই একই মানে বহন করে, নিজের সাথে নিজে, দুই রূপে।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের IP, আর একটা Byte এর ভেতর",
    subtitle: "Terminal এ চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের IPv4 দেখুন",
        description:
          "আপনার যন্ত্রের IPv4 ঠিকানা বের করুন। সম্ভবত 192.168 বা 10 দিয়ে শুরু, মানে এটা আপনার ভেতরের Network এর ঠিকানা।",
      },
      {
        title: "নিজের IPv6 দেখুন",
        description:
          "একই যন্ত্রের IPv6 ঠিকানা বের করুন। খেয়াল করুন এটা কত লম্বা, আর কোলন দিয়ে আটটা দলে ভাগ করা।",
      },
      {
        title: "একটা নামের নিচে দুই ঠিকানা",
        description:
          "একটা Website এর নামের নিচে IPv4 (A) আর IPv6 (AAAA) দুইটাই আছে কি না দেখুন। এটা আসলে DNS, Module 04, কিন্তু দুই রূপ নিজের চোখে দেখার সহজ উপায়।",
      },
      {
        title: "একটা সংখ্যাকে Bit এ দেখুন",
        description:
          "192 বা 255 কে binary তে দেখুন, আর উপরের Octet Lab এর সাথে মিলিয়ে নিন। 255 মানে আটটাই এক।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-my-ipv4.sh",
        language: "bash",
        code: `# আপনার IPv4 ঠিকানা
ipconfig getifaddr en0     # macOS, সাধারণত Wi-Fi
hostname -I                # Linux, সব ঠিকানা এক লাইনে
ip -4 addr show            # Linux, বিস্তারিত

# উত্তর সম্ভবত 192.168.x.x বা 10.x.x.x এর মতো।
# এটা আপনার ভেতরের Network এর ঠিকানা, বাইরের নয়,
# কেন আলাদা সেটা পরের লেসন।`,
      },
      {
        filename: "2-my-ipv6.sh",
        language: "bash",
        code: `# আপনার IPv6 ঠিকানা
ifconfig en0 | grep inet6      # macOS
ip -6 addr show                # Linux

# একাধিক লাইন আসতে পারে। fe80: দিয়ে শুরুরটা একটা বিশেষ
# IPv6, যেটা শুধু আপনার নিজের LAN এর ভেতরে কাজ করে।
# খেয়াল করুন কোলন আর আটটা দল, ঠিক লেসনের মতো।`,
      },
      {
        filename: "3-a-and-aaaa.sh",
        language: "bash",
        code: `# একটা নামের নিচে IPv4 (A) আর IPv6 (AAAA)
dig google.com A          # IPv4 ঠিকানাগুলো
dig google.com AAAA       # IPv6 ঠিকানাগুলো
# dig না থাকলে: nslookup -type=AAAA google.com

# একই নাম, কিন্তু দুই ধরনের ঠিকানা ফেরত আসে।
# এটাই Dual Stack, দুই প্রজন্ম পাশাপাশি।
# নাম থেকে IP বের করার পুরো গল্প DNS, Module 04।`,
      },
      {
        filename: "4-byte-in-bits.sh",
        language: "bash",
        code: `# একটা সংখ্যা binary তে, নিজের চোখে দেখুন
python3 -c "print(format(192, '08b'))"   # 11000000
python3 -c "print(format(255, '08b'))"   # 11111111
python3 -c "print(format(5,   '08b'))"   # 00000101

# 255 মানে আটটাই এক, সর্বোচ্চ। উপরের Octet Lab এ
# ঠিক এই সংখ্যাগুলোতে চাপ দিয়ে একই জিনিস দেখতে পারেন।`,
      },
    ],
    tip: "তিন নম্বর পরীক্ষাটা সবচেয়ে চোখ খুলে দেয়, কারণ একটা মাত্র নামের নিচে আপনি একই সাথে IPv4 আর IPv6 দুইটা রূপই দেখতে পাবেন, পাশাপাশি। তখন Dual Stack ব্যাপারটা আর বইয়ের কথা থাকে না, নিজের চোখে দেখা একটা বাস্তব জিনিস হয়ে যায়। আর চার নম্বরটা মিলিয়ে নিলে বোঝা যায়, 255 এর সীমাটা কোনো নিয়ম নয়, সেটা ৮ Bit এর স্বাভাবিক ফল।",
  },
  assignment: {
    title: "Mini Project: IP এর ময়নাতদন্ত",
    time: "৪৫ মিনিট",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>নিজের দুই ঠিকানা:</strong> Lab এর এক আর দুই নম্বর চালিয়ে আপনার
        যন্ত্রের IPv4 আর IPv6 লিখুন। কোনটা ছোট, কোনটা বড়? IPv6 টায় কয়টা কোলন
        গুনলেন?
      </span>,
      <span key="2">
        <strong>Byte ভেঙে দেখুন:</strong> আপনার IPv4 এর প্রথম সংখ্যাটা নিন, আর
        Lab এর চার নম্বর দিয়ে সেটাকে binary তে লিখুন। কয়টা Bit জ্বালানো?
        মিলিয়ে দেখুন যোগফল আসলেই ওই সংখ্যা হয় কি না।
      </span>,
      <span key="3">
        <strong>দুই রূপ এক নামে:</strong> Lab এর তিন নম্বর দিয়ে একটা Website এর
        A আর AAAA দেখুন। দুইটা রূপই পেলেন? এক লাইনে লিখুন, ফোঁটা আর কোলন দেখে
        কোনটা কোন রূপ বুঝলেন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু জিজ্ঞেস করলেন,
        IPv4 থাকতে IPv6 বানানো লাগল কেন? তাঁকে সহজ ভাষায় বোঝান, ৪.৩ বিলিয়ন আর
        দুনিয়ার যন্ত্রের সংখ্যার তুলনা দিয়ে।
      </span>,
    ],
    deliverables: [
      <span key="1">আপনার IPv4 আর IPv6 ঠিকানা, পাশাপাশি</span>,
      <span key="2">একটা সংখ্যার binary রূপ আর যোগফলের হিসাব</span>,
      <span key="3">একটা নামের A আর AAAA, আর কোনটা কোন রূপ</span>,
      <span key="4">IPv6 কেন দরকার, ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
