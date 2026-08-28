/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CacheLab,
  WhoHasIpLab,
} from "../../../components/course/topics/arp/animations";
import {
  ArpCacheDiagram,
  ArpFlowDiagram,
  BroadcastVsUnicastSplit,
} from "../../../components/course/topics/arp/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const arpProtocolContent: TopicData = {
  id: "arp-protocol",
  introduction: {
    badge: "MODULE 03 · LESSON 04",
    title: <SectionTitle>এই IP টা কার, চেঁচিয়ে জিজ্ঞেস</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          গত লেসনে একটা ফাঁক রেখে এসেছিলাম। আপনার Laptop একটা যন্ত্রকে চিঠি
          পাঠাতে চায়, সে গন্তব্যের IP জানে। কিন্তু চিঠির খামে তো হাতে হাতে
          দেওয়ার MAC লিখতে হয়, আর সেই MAC টা সে জানে না। IP আছে, MAC নেই। এই
          ফাঁকটা কীভাবে ভরাট হয়, সেটাই এই লেসনের পুরো বিষয়।
        </ContentParagraph>
        <ContentParagraph>
          সমাধানটা মজার রকম সহজ, আর একদম মানুষের মতো। ধরুন একটা ভরা ঘরে আপনি
          রফিককে খুঁজছেন, কিন্তু জানেন না সে কোথায় বসা। আপনি কী করেন? চেঁচিয়ে
          বলেন, রফিক কোথায়? পুরো ঘর শোনে, কিন্তু উত্তর দেয় শুধু রফিক, হাত তুলে
          বলে, এই তো আমি।
        </ContentParagraph>
        <ContentParagraph>
          কম্পিউটারও ঠিক তাই করে। যন্ত্রটা পুরো LAN এ চেঁচিয়ে জিজ্ঞেস করে, এই
          IP টা কার, তার MAC কী? সবাই শোনে, কিন্তু উত্তর দেয় শুধু যার সেই IP।
          এই চেঁচিয়ে জিজ্ঞেস করার নিয়মটার নাম ARP, Address Resolution
          Protocol।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "IP জানা আছে, কিন্তু চিঠি পাঠাতে লাগে MAC। ARP পুরো LAN এ চেঁচিয়ে জিজ্ঞেস করে, এই IP টা কার? আর যার IP, সে ফিরিয়ে বলে তার MAC।",
      author: "Computer Networking",
      role: "Lesson 04",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "the-gap",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>IP আছে, MAC নেই, তাই ARP</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটু গুছিয়ে নিই কোথায় এসে দাঁড়িয়েছি। Lesson 03 এ দেখেছেন,
                চিঠি হাতে হাতে দিতে গন্তব্যের MAC লাগে, আর প্রতিটা Hop এ সেই MAC
                বদলায়। এখন প্রশ্ন, আপনার যন্ত্র পরের হাতের IP জানে, কিন্তু তার
                MAC পায় কোথা থেকে?
              </ContentParagraph>
              <ContentParagraph>
                IP টা সে জানে কারণ সেটা এসেছে নাম থেকে (DNS, Module 04) বা তার
                নিজের সেটিং থেকে, যেমন Gateway এর IP। কিন্তু MAC কোথাও লেখা নেই,
                কারণ MAC যন্ত্রের সাথে গাঁথা, আর যন্ত্র কখন LAN এ ঢুকল সে তো আগে
                থেকে জানা যায় না। তাই MAC জিজ্ঞেস করে নিতে হয়, ঠিক তখনই, যখন
                দরকার।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ArpFlowDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো ব্যাপারটা দুই ধাপ। প্রথম ধাপে A পুরো LAN এ একটা প্রশ্ন ছোড়ে,
              এই IP টা কার, তার MAC কী? এই প্রশ্নটা সবাই শোনে, কারণ A জানে না
              কার কাছে জিজ্ঞেস করবে। দ্বিতীয় ধাপে শুধু একজন উত্তর দেয়, যার সেই
              IP, সে ফিরিয়ে বলে তার MAC। ব্যস, এবার A এর কাছে IP আর MAC দুইটাই,
              চিঠি পাঠাতে পারে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "ARP মানে ঠিকানার অনুবাদক",
          content: (
            <p>
              ARP এর পুরো নাম Address Resolution Protocol, মানে ঠিকানা মিলিয়ে
              নেওয়ার নিয়ম। এর একটাই কাজ, একটা IP নিয়ে তার MAC বের করে দেওয়া,
              এই LAN এর ভেতরে। ভাবুন আপনার কাছে একজনের অফিসের ঠিকানা আছে, কিন্তু
              তাকে হাতে হাতে চিঠি দিতে হলে জানতে হবে সে ঠিক এই মুহূর্তে কোন
              ডেস্কে বসা। ARP সেই ডেস্ক নম্বরটা বের করে দেয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "broadcast",
      subHeader: { index: "002", title: "Broadcast" },
      title: <SectionTitle>প্রশ্ন সবার, উত্তর একজনের</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ARP এর প্রশ্ন আর উত্তর দুই রকমের চিঠি, আর এই তফাতটা বোঝা জরুরি।
                প্রশ্নটা যায় সবার কাছে, একে বলে Broadcast। উত্তরটা যায় শুধু
                একজনের কাছে, একে বলে Unicast।
              </ContentParagraph>
              <ContentParagraph>
                কেন এই তফাত? খুব সহজ কারণে। যখন A প্রশ্ন করে, তখন সে জানে না কার
                কাছে জিজ্ঞেস করবে, কারণ সে তো MAC ই জানে না, আর MAC ছাড়া কাউকে
                সরাসরি চিঠি দেওয়া যায় না। তাই বাধ্য হয়ে সবাইকে জিজ্ঞেস করে।
                কিন্তু C যখন উত্তর দেয়, তখন সে জানে কে জিজ্ঞেস করেছে, কারণ
                প্রশ্নের চিঠিতেই A এর MAC লেখা ছিল। তাই C সরাসরি A কেই ফিরিয়ে
                বলে, বাকিদের বিরক্ত করে না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <BroadcastVsUnicastSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে নিজে হাতে দেখুন। A কার MAC চায় বেছে দিন, তারপর চেঁচিয়ে
              জিজ্ঞেস করান। খেয়াল করুন, প্রশ্নটা তিনজনই শোনে, কিন্তু উত্তর দেয়
              শুধু একজন, যার সেই IP। বাকিরা শুনেই বোঝে এটা তাদের নয়, তাই চুপ
              থাকে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhoHasIpLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Broadcast LAN ছাড়ে না",
          content: (
            <p>
              একটা জরুরি কথা। এই চেঁচিয়ে জিজ্ঞেস করা শুধু LAN এর ভেতরেই থাকে,
              Router এটা বাইরে যেতে দেয় না। ভাবুন, যদি প্রতিটা ARP প্রশ্ন পুরো
              Internet এ চেঁচিয়ে যেত, তাহলে কোটি কোটি যন্ত্রের চেঁচামেচিতে সব
              বন্ধ হয়ে যেত। তাই Broadcast এর সীমানা LAN। এই কারণেই MAC ও LAN
              ছাড়ে না, যেমন Lesson 03 এ দেখেছিলেন, আর এই কারণেই ARP শুধু কাছের
              হাতবদলের জন্য, দূরের যাত্রার জন্য নয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "cache",
      subHeader: { index: "003", title: "The Cache" },
      title: <SectionTitle>একবার জিজ্ঞেস, তারপর মনে রাখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা প্রশ্ন নিশ্চয়ই মাথায় আসছে। প্রতিটা চিঠির আগে যদি চেঁচিয়ে
                জিজ্ঞেস করতে হয়, তাহলে LAN তো সারাক্ষণ চেঁচামেচিতে ভরে থাকবে।
                এটা তো অপচয়। ঠিক ধরেছেন, তাই যন্ত্র একটা চালাকি করে, উত্তরটা
                মনে রাখে।
              </ContentParagraph>
              <ContentParagraph>
                একবার কোনো IP এর MAC জেনে নিলে, যন্ত্র সেটা একটা ছোট টেবিলে লিখে
                রাখে, নাম ARP Cache। পরের বার ওই IP তে চিঠি পাঠাতে হলে আর
                জিজ্ঞেস করে না, সোজা টেবিল দেখে নেয়। এই টেবিলটাই আপনি গত লেসনে
                arp -a কমান্ডে দেখেছিলেন, প্রতিটা সারিতে একটা IP আর তার MAC।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ArpCacheDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের লাবে পুরো গল্পটা ধাপে ধাপে দেখুন। প্রথমবার Cache খালি, তাই
              চেঁচিয়ে জিজ্ঞেস করতে হয়, একটু দেরি। তারপর উত্তরটা Cache এ জমা
              হয়। দ্বিতীয়বার একই IP তে পাঠাতে হলে সোজা Cache থেকে, কোনো
              জিজ্ঞাসা ছাড়া।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CacheLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Cache মুছেও যায়, আর সেটা ইচ্ছে করেই",
          content: (
            <p>
              ARP Cache চিরকাল থাকে না, কিছুক্ষণ ব্যবহার না হলে সারিটা মুছে
              যায়। কেন? কারণ যন্ত্র বদলাতে পারে। ধরুন একটা IP আগে একটা Laptop
              এর ছিল, এখন সেই Laptop চলে গেছে, IP টা অন্য যন্ত্র পেয়েছে। পুরনো
              MAC ধরে রাখলে চিঠি ভুল জায়গায় যেত। তাই Cache সময়ে সময়ে ভুলে
              যায়, আর দরকারে আবার একবার জিজ্ঞেস করে নেয়। এই ভুলে যাওয়াটা
              সমস্যা নয়, বরং তাজা তথ্য রাখার উপায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "security",
      subHeader: { index: "004", title: "The Risk" },
      title: <SectionTitle>চেঁচিয়ে বিশ্বাস করার বিপদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ARP এর একটা সুন্দর সরলতা আছে, কিন্তু ওই সরলতাই একটা দুর্বলতা।
                ভাবুন, A চেঁচিয়ে জিজ্ঞেস করল এই IP টা কার। এখন যদি কোনো দুষ্টু
                যন্ত্র মিথ্যা বলে, ওই IP আমার, আমার MAC এই, তাহলে? A এর তো যাচাই
                করার উপায় নেই, সে সরল বিশ্বাসে উত্তরটা মেনে নেয়।
              </ContentParagraph>
              <ContentParagraph>
                এই মিথ্যা উত্তর দিয়ে অন্যের চিঠি নিজের কাছে টেনে নেওয়ার নাম
                ARP Spoofing বা ARP Poisoning। একটা দুষ্টু যন্ত্র Gateway এর IP
                এর মালিক সেজে বসতে পারে, তখন LAN এর সবার বাইরের চিঠি আগে তার হাত
                ঘুরে যায়, আর সে সব দেখে ফেলে। এটা একটা বাস্তব আক্রমণ, বিশেষ করে
                খোলা Public Wi-Fi তে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "তাহলে বাঁচার উপায় কী",
          content: (
            <p>
              মূল রক্ষাটা এই স্তরে নয়, উপরের স্তরে। ধরে নিন LAN নিরাপদ নয়, তাই
              গুরুত্বপূর্ণ কথা সবসময় খামবন্ধ করে পাঠান, মানে HTTPS দিয়ে, যেটা
              Module 06। তখন দুষ্টু যন্ত্র চিঠি নিজের কাছে টানলেও ভেতরের বন্ধ
              কথা পড়তে পারবে না। এই কারণেই খোলা Wi-Fi তে ব্যাংকের কাজ করার
              সময়ও HTTPS আপনাকে বাঁচায়। ARP নিজে ঠিক করা কঠিন, কারণ তার সরলতাই
              তার কাজের মূল। তাই সমাধান নিচের স্তর ঠিক করা নয়, উপরের স্তরে খাম
              বন্ধ রাখা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>ARP আর Island Tours</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ARP এত নিচের স্তরে যে একজন Backend Developer সাধারণত এটা নিয়ে
                ভাবেনও না, Kernel সব সামলায়। কিন্তু কয়েকটা জায়গায় এটা হঠাৎ
                কাজে লাগে, বিশেষ করে সমস্যা খোঁজার সময়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Datacenter এর ভেতরে ARP:</strong> Island Tours এর API
                  আর Database একই LAN এ, তাই তাদের মধ্যে প্রথম কথার আগে একবার
                  ARP হয়, API জেনে নেয় Database এর MAC। তারপর সেটা Cache এ
                  থাকে, আর হাজার হাজার Query কোনো ARP ছাড়াই দ্রুত যায়। এই
                  কারণেই LAN এর ভেতরের কথা এত দ্রুত।
                </ListItem>
                <ListItem>
                  <strong>প্রথম Request একটু ধীর:</strong> একটা সদ্য চালু হওয়া
                  সার্ভারের Cache খালি থাকে, তাই প্রথম কয়েকটা কথায় ARP লাগে,
                  সামান্য দেরি। তারপর Cache ভরে গেলে দ্রুত। এটা Module 02 এর
                  Cold Start এর ছবিরই আরেকটা ছোট টুকরো, এবার ARP এর স্তরে।
                </ListItem>
                <ListItem>
                  <strong>দুইটা যন্ত্র একই IP দাবি করলে:</strong> কখনো ভুল করে
                  দুইটা যন্ত্রকে একই IP দিলে, ARP এ দুইজন একই IP এর মালিক দাবি
                  করে, আর Network এলোমেলো হয়ে যায়, একবার এক যন্ত্র উত্তর দেয়,
                  একবার আরেকটা। এই চেনা সমস্যার নাম IP Conflict, আর এটা ধরা পড়ে
                  ঠিক এই ARP এর স্তরে।
                </ListItem>
                <ListItem>
                  <strong>খোলা Wi-Fi তে সাবধানতা:</strong> আপনি যদি একটা ক্যাফের
                  Wi-Fi তে বসে Island Tours এর Admin Panel এ ঢোকেন, ওই LAN এ কেউ
                  ARP Spoofing করে থাকতে পারে। তখন আপনাকে বাঁচায় শুধু HTTPS,
                  কারণ খাম বন্ধ থাকলে সে চিঠি টেনেও ভেতরটা পড়তে পারে না। এই
                  কারণেই Admin কাজ সবসময় HTTPS এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "পুরো ছবিটা এখন প্রায় সম্পূর্ণ",
          content: (
            <p>
              এই তিনটা লেসন মিলিয়ে LAN এর ভেতরে একটা চিঠি পৌঁছানোর পুরো গল্প
              এখন আপনার হাতে। নাম থেকে IP পাওয়া যায় (DNS, পরে)। সেই IP থেকে
              MAC বের করে ARP (এই লেসন)। সেই MAC দেখে Switch ঠিক Port এ পাঠায়
              (Lesson 02, 03)। তিনটা টুকরো, তিনটা লেসন, একটা নিখুঁত বিলি। পরের
              লেসনে আমরা IP নিজেই খুলে দেখব, কারণ এতক্ষণ IP কে শুধু একটা সংখ্যা
              ধরে নিয়েছি, এবার তার ভেতরের গঠন দেখব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "request-flow",
      subHeader: { index: "006", title: "Step-by-step Flow" },
      title: <SectionTitle>IP থেকে MAC, তারপর চিঠি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনার Laptop প্রথমবার Gateway (192.168.0.1) কে চিঠি পাঠাতে চায়।
              IP থেকে MAC বের করা থেকে চিঠি পাঠানো পর্যন্ত পুরোটা ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Cache দেখা, খালি",
              description:
                "Laptop প্রথমে নিজের ARP Cache দেখল, 192.168.0.1 এর MAC জানা আছে কিনা। প্রথমবার বলে খালি, Cache Miss।",
            },
            {
              title: "চেঁচিয়ে প্রশ্ন, Broadcast",
              description:
                "Laptop পুরো LAN এ একটা ARP প্রশ্ন ছাড়ল, এই 192.168.0.1 টা কার, তার MAC কী? প্রশ্নের চিঠিতে Laptop এর নিজের MAC ও লেখা।",
            },
            {
              title: "সবাই শোনে, একজন মেলে",
              description:
                "LAN এর সব যন্ত্র প্রশ্নটা পেল, নিজের IP এর সাথে মিলিয়ে দেখল। শুধু Router এর IP মিলল, বাকিরা চুপ করে চিঠি ফেলে দিল।",
            },
            {
              title: "Router উত্তর দিল, Unicast",
              description:
                "Router সরাসরি Laptop কেই ফিরিয়ে বলল, ওই IP আমার, আমার MAC এই। প্রশ্নে Laptop এর MAC ছিল বলে সরাসরি ফেরানো গেল।",
            },
            {
              title: "Cache এ লেখা হলো",
              description:
                "Laptop উত্তরটা ARP Cache এ লিখে রাখল, 192.168.0.1 মানে ওই MAC। এখন থেকে ওই IP তে পাঠাতে আর জিজ্ঞেস করতে হবে না।",
            },
            {
              title: "এবার আসল চিঠি",
              description:
                "Laptop এখন আসল চিঠির খামে গন্তব্যের MAC বসিয়ে পাঠাল। Switch সেই MAC দেখে ঠিক Port এ পৌঁছে দিল। IP থেকে MAC, তারপর বিলি, পুরো চক্র শেষ।",
            },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "resources",
      subHeader: { index: "007", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিজের ARP Cache দেখুন</strong>, নিচের Lab এ arp -a
                কমান্ড আছে। কয়েকটা সাইট খুলে আবার দেখুন, নতুন সারি এসেছে কিনা।
                Cache নিজের চোখে ভরতে দেখুন।
              </ListItem>
              <ListItem>
                <strong>PracticalNetworking</strong>, ARP Explained নামে একটা
                চমৎকার ভিডিও সিরিজ, ধাপে ধাপে।{" "}
                <a
                  href="https://www.youtube.com/@PracticalNetworking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  youtube.com/@PracticalNetworking
                </a>
              </ListItem>
              <ListItem>
                <strong>Wireshark দিয়ে দেখুন</strong>, উন্নত পাঠকদের জন্য।
                Wireshark খুলে arp লিখে Filter করুন, তারপর নিজের চোখে ARP এর
                প্রশ্ন আর উত্তর দেখুন, সত্যিকারের Packet এ।{" "}
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
    /* ---------------------------------------------------------------- 8 */
    {
      id: "recap",
      subHeader: { index: "008", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                সমস্যা: IP জানা আছে, কিন্তু চিঠি পাঠাতে লাগে MAC। ARP সেই IP
                থেকে MAC বের করে দেয়, LAN এর ভেতরে।
              </ListItem>
              <ListItem>
                ARP পুরো LAN এ চেঁচিয়ে জিজ্ঞেস করে, এই IP টা কার? সবাই শোনে,
                উত্তর দেয় শুধু যার সেই IP।
              </ListItem>
              <ListItem>
                প্রশ্নটা Broadcast, সবাইকে, কারণ কার কাছে জানি না। উত্তরটা
                Unicast, শুধু একজনকে, কারণ প্রশ্নে জিজ্ঞাসাকারীর MAC ছিল।
              </ListItem>
              <ListItem>
                Broadcast LAN ছাড়ে না, Router বাইরে যেতে দেয় না। তাই ARP শুধু
                কাছের হাতবদলের জন্য।
              </ListItem>
              <ListItem>
                উত্তরটা ARP Cache এ জমা থাকে, তাই প্রতিবার জিজ্ঞেস করতে হয় না।
                এটাই arp -a এর টেবিল। Cache কিছুক্ষণ পরে মুছে যায়, তাজা তথ্যের
                জন্য।
              </ListItem>
              <ListItem>
                ARP সরল বিশ্বাসে চলে, তাই মিথ্যা উত্তর দিয়ে চিঠি টেনে নেওয়া
                যায়, নাম ARP Spoofing। বাঁচার উপায় উপরের স্তরে খাম বন্ধ রাখা,
                মানে HTTPS।
              </ListItem>
              <ListItem>
                একই IP দুইজন দাবি করলে IP Conflict, আর সেটা ধরা পড়ে ARP এর
                স্তরে।
              </ListItem>
              <ListItem>
                পরের লেসন: এতক্ষণ IP কে শুধু একটা সংখ্যা ধরেছি। এবার IP নিজেই
                খুলে দেখব, তার ভেতরের গঠন, IPv4 আর IPv6।
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
        <span className="font-bold text-primary">ARP</span>,
        "IP থেকে MAC বের করার নিয়ম, LAN এর ভেতরে",
      ],
      [
        <span className="font-bold text-primary">ARP Request</span>,
        "চেঁচিয়ে প্রশ্ন, এই IP টা কার, সবাই শোনে",
      ],
      [
        <span className="font-bold text-primary">ARP Reply</span>,
        "যার সেই IP, সে ফিরিয়ে বলে তার MAC",
      ],
      [
        <span className="font-bold text-primary">Broadcast</span>,
        "সবাইকে একসাথে, কারণ কার কাছে জানি না",
      ],
      [
        <span className="font-bold text-primary">Unicast</span>,
        "শুধু একজনকে, কারণ এখন জানি কে জিজ্ঞেস করেছে",
      ],
      [
        <span className="font-bold text-primary">ARP Cache</span>,
        "IP থেকে MAC এর মনে রাখা টেবিল, arp -a",
      ],
      [
        <span className="font-bold text-primary">Cache Miss/Hit</span>,
        "প্রথমবার জিজ্ঞেস, পরের বার সোজা টেবিল থেকে",
      ],
      [
        <span className="font-bold text-primary">ARP Spoofing</span>,
        "মিথ্যা উত্তরে চিঠি টেনে নেওয়া, HTTPS বাঁচায়",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "আপনার Laptop এর কাছে গন্তব্যের IP আছে, কিন্তু চিঠি পাঠাতে পারছে না। কী দরকার, আর কে দেয়?",
        options: [
          {
            key: "A",
            text: "নাম দরকার, DNS দেয়",
            isCorrect: false,
            explanation: "নাম থেকে IP পাওয়া হয়ে গেছে। এখন IP আছে, দরকার MAC।",
          },
          {
            key: "B",
            text: "MAC দরকার, ARP বের করে দেয়",
            isCorrect: true,
            explanation:
              "চিঠি হাতে হাতে দিতে MAC লাগে। ARP সেই IP থেকে MAC বের করে, চেঁচিয়ে জিজ্ঞেস করে।",
          },
          { key: "C", text: "আরেকটা IP দরকার", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "ARP এর প্রশ্ন সবার কাছে যায় কেন?",
        options: [
          {
            key: "A",
            text: "কারণ ARP সবসময় সবাইকে বিরক্ত করে",
            isCorrect: false,
            explanation:
              "বিরক্ত করা উদ্দেশ্য নয়। বাধ্য হয়ে সবাইকে জিজ্ঞেস করে।",
          },
          {
            key: "B",
            text: "কারণ কার কাছে জিজ্ঞেস করবে সেটা এখনো জানে না, MAC ই তো খুঁজছে",
            isCorrect: true,
            explanation:
              "MAC ছাড়া কাউকে সরাসরি চিঠি দেওয়া যায় না, আর MAC টাই তো খোঁজা হচ্ছে। তাই বাধ্য হয়ে Broadcast।",
          },
          {
            key: "C",
            text: "কারণ Router সব চিঠি সবাইকে পাঠায়",
            isCorrect: false,
            explanation:
              "Router এর সাথে সম্পর্ক নেই, আর Router বরং Broadcast বাইরে যেতে দেয় না।",
          },
        ],
      },
      {
        id: 3,
        text: "একই IP তে দ্বিতীয়বার চিঠি পাঠাতে হলে কি আবার চেঁচিয়ে জিজ্ঞেস করতে হয়?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, প্রতিবার নতুন করে জিজ্ঞেস",
            isCorrect: false,
            explanation:
              "তাহলে LAN চেঁচামেচিতে ভরে যেত। প্রথমবারের উত্তর Cache এ থাকে।",
          },
          {
            key: "B",
            text: "না, প্রথমবারের উত্তর ARP Cache এ জমা থাকে, সোজা সেখান থেকে নেয়",
            isCorrect: true,
            explanation:
              "এটাই Cache Hit। এই কারণেই ARP প্রতিবার হয় না, শুধু প্রথমবার বা Cache মুছে গেলে।",
          },
          {
            key: "C",
            text: "না, MAC কখনো লাগেই না দ্বিতীয়বার",
            isCorrect: false,
            explanation:
              "MAC তো লাগেই, কিন্তু সেটা Cache থেকে পাওয়া যায়, নতুন করে জিজ্ঞেস করতে হয় না।",
          },
        ],
      },
      {
        id: 4,
        text: "ARP এর প্রশ্ন কি পুরো Internet এ চেঁচিয়ে যায়?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, তাই যেকোনো IP এর MAC পাওয়া যায়",
            isCorrect: false,
            explanation:
              "না, তাহলে কোটি যন্ত্রের চেঁচামেচিতে সব বন্ধ হতো। Router Broadcast বাইরে যেতে দেয় না।",
          },
          {
            key: "B",
            text: "না, Broadcast শুধু LAN এর ভেতরে, Router বাইরে যেতে দেয় না",
            isCorrect: true,
            explanation:
              "এই কারণেই ARP আর MAC দুইটাই LAN এর ভেতরের ব্যাপার। দূরের যাত্রা IP এর কাজ।",
          },
          { key: "C", text: "শুধু HTTPS হলে বাইরে যায়", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "খোলা Wi-Fi তে কেউ ARP Spoofing করে আপনার চিঠি নিজের কাছে টানছে। কী আপনাকে বাঁচায়?",
        options: [
          {
            key: "A",
            text: "কিছুই না, ARP ঠিক করা অসম্ভব",
            isCorrect: false,
            explanation:
              "ARP নিজে ঠিক করা কঠিন, কিন্তু উপরের স্তর আপনাকে বাঁচাতে পারে।",
          },
          {
            key: "B",
            text: "HTTPS, খাম বন্ধ থাকলে সে চিঠি টেনেও ভেতরটা পড়তে পারে না",
            isCorrect: true,
            explanation:
              "মূল রক্ষা নিচের স্তরে নয়, উপরের স্তরে। খাম বন্ধ থাকলে চিঠি টানলেও কথা গোপন থাকে।",
          },
          {
            key: "C",
            text: "নিজের MAC বদলে ফেলা",
            isCorrect: false,
            explanation:
              "নিজের MAC বদলানো এই সমস্যায় সাহায্য করে না। দরকার ভেতরের কথা বন্ধ রাখা, মানে HTTPS।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "ARP নিজের চোখে দেখুন",
    subtitle: "Terminal এ চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের ARP Cache দেখুন",
        description:
          "আপনার যন্ত্রের ARP Cache দেখুন, IP আর MAC এর জোড়াগুলো। এটাই ARP এর মনে রাখা টেবিল।",
      },
      {
        title: "Cache ভরতে দেখুন",
        description:
          "Cache মুছে দিয়ে একটা নতুন যন্ত্রে ping করুন, তারপর Cache আবার দেখুন। নতুন সারি এসেছে, ARP নিজের চোখে ঘটতে দেখলেন।",
      },
      {
        title: "Gateway সবচেয়ে চেনা",
        description:
          "আপনার ARP Cache এ প্রায় সবসময় Gateway থাকে, কারণ প্রতিটা বাইরের চিঠি তার হাত ঘোরে। খুঁজে বের করুন।",
      },
      {
        title: "Broadcast এর ঠিকানা",
        description:
          "ARP এর প্রশ্ন যায় একটা বিশেষ Broadcast ঠিকানায়, ff:ff:ff:ff:ff:ff, মানে সবাই। এটা কী, বুঝে নিন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-see-arp-cache.sh",
        language: "bash",
        code: `# আপনার ARP Cache, IP থেকে MAC এর মনে রাখা জোড়া
arp -a
# প্রতিটা লাইন এমন:
#   ? (192.168.0.1) at a4:83:e7:2b:11:0c on en0 ifscope [ethernet]
#     ^ IP              ^ সেই IP এর MAC        ^ কোন Card এ
#
# Linux এ আরও পরিষ্কার:
ip neigh
# প্রতিটা লাইন একটা IP আর তার MAC, ঠিক এই লেসনের টেবিল।`,
      },
      {
        filename: "2-watch-cache-fill.sh",
        language: "bash",
        code: `# Cache নিজের চোখে ভরতে দেখুন

# আগে দেখুন এখন কী আছে
arp -a | wc -l          # কয়টা সারি

# এবার এমন একটা LAN এর যন্ত্রে ping করুন যেটা এখনো Cache এ নেই
# (আপনার LAN এর একটা IP, যেমন Phone এর)
ping -c 2 192.168.0.6    # আপনার LAN এর একটা IP বসান

# আবার Cache দেখুন
arp -a | grep 192.168.0.6
# এবার ওই IP আর তার MAC হাজির! ping পাঠাতে ARP করতে হলো,
# আর উত্তরটা Cache এ জমা হলো। আপনি ARP ঘটতে দেখলেন।`,
      },
      {
        filename: "3-find-gateway.sh",
        language: "bash",
        code: `# আপনার Gateway এর IP
netstat -nr | grep default | awk '{print $2}'   # macOS
ip route | grep default | awk '{print $3}'       # Linux

# এবার সেই IP টা ARP Cache এ খুঁজুন
arp -a | grep "$(ip route | grep default | awk '{print $3}')"  # Linux
# macOS এ Gateway এর সংখ্যাটা নিয়ে:  arp -a | grep 192.168.0.1
#
# Gateway প্রায় সবসময় Cache এ থাকে, কারণ বাইরের প্রতিটা চিঠি
# তার হাত ঘোরে, তাই তার MAC বারবার লাগে। সে সবচেয়ে চেনা প্রতিবেশী।`,
      },
      {
        filename: "4-broadcast-address.md",
        language: "markdown",
        code: `# ARP এর প্রশ্ন যায় একটা বিশেষ ঠিকানায়

MAC এর জগতে একটা বিশেষ ঠিকানা আছে যেটা মানে "সবাই":

    ff:ff:ff:ff:ff:ff

এটাই Broadcast ঠিকানা। ARP এর প্রশ্ন এই ঠিকানায় পাঠানো হয়,
তাই LAN এর প্রতিটা যন্ত্র সেটা পায়।

ভাবুন, ff:ff:ff:ff:ff:ff মানে "এই চিঠি সবাই খোলো"।
একটা সাধারণ চিঠির গন্তব্যে থাকে একজনের MAC, কিন্তু ARP প্রশ্নের
গন্তব্যে থাকে এই "সবাই" ঠিকানা।

উত্তরটা কিন্তু এই ঠিকানায় যায় না, উত্তর যায় সরাসরি
জিজ্ঞাসাকারীর নিজের MAC এ। প্রশ্ন সবাইকে, উত্তর একজনকে,
এই পুরো লেসনের এক লাইনের সারমর্ম।`,
      },
    ],
    tip: "দুই নম্বর পরীক্ষাটা সবচেয়ে সন্তোষজনক, কারণ আপনি ARP কে সত্যি সত্যি ঘটতে দেখবেন। একটা IP তে ping করার আগে সেটা Cache এ নেই, ping করার পরে আছে। মানে ওই ping পাঠাতে আপনার যন্ত্রকে প্রথমে চেঁচিয়ে জিজ্ঞেস করতে হলো এই IP টা কার, উত্তর পেল, আর মনে রাখল। এই এক পরীক্ষায় পুরো লেসনটা আপনার নিজের Terminal এ জীবন্ত হয়ে ওঠে, বইয়ের ধারণা থেকে হাতের বাস্তব জিনিসে।",
  },
  assignment: {
    title: "Mini Project: ARP এর ময়নাতদন্ত",
    time: "৪৫ মিনিট",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>Cache এর ছবি:</strong> arp -a চালিয়ে আপনার এখনকার ARP Cache এর
        সব সারি লিখুন। কয়টা যন্ত্র চেনা? এদের মধ্যে Gateway টা কোনটা, চিহ্নিত
        করুন।
      </span>,
      <span key="2">
        <strong>ARP ঘটতে দেখুন:</strong> Lab এর দুই নম্বর চালিয়ে একটা নতুন IP
        তে ping এর আগে আর পরে Cache তুলনা করুন। নতুন সারিটা লিখুন, আর এক লাইনে
        বলুন কী ঘটল।
      </span>,
      <span key="3">
        <strong>IP আর MAC এর ভাগ্য:</strong> আপনার Cache থেকে একটা IP আর MAC
        জোড়া নিন। এক লাইনে লিখুন, ওই যন্ত্রটা যদি আপনার LAN ছেড়ে অন্য শহরে
        যায়, এই জোড়ার কোনটা বদলাবে আর কোনটা থাকবে, আর কেন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু জিজ্ঞেস করলেন,
        খোলা Wi-Fi তে ব্যাংকের সাইট খোলা কি নিরাপদ? ARP Spoofing আর HTTPS
        ব্যবহার করে তাঁকে বোঝান কেন ভরসাটা HTTPS এর উপর, LAN এর উপর নয়।
      </span>,
    ],
    deliverables: [
      <span key="1">ARP Cache এর সব সারি, Gateway চিহ্নিত</span>,
      <span key="2">ping এর আগে পরে Cache এর তফাত</span>,
      <span key="3">একটা IP MAC জোড়া, আর কোনটা বদলায় তার ব্যাখ্যা</span>,
      <span key="4">খোলা Wi-Fi আর HTTPS নিয়ে ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
