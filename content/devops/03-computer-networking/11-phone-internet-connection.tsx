/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import { PathCompareLab } from "../../../components/course/topics/phone-net/animations";
import {
  CarrierPathDiagram,
  TwoPathsDiagram,
} from "../../../components/course/topics/phone-net/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const phoneInternetConnectionContent: TopicData = {
  id: "phone-internet-connection",
  introduction: {
    badge: "MODULE 03 · LESSON 11",
    title: <SectionTitle>ফোনটা কীভাবে অনলাইন হয়</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এটা এই মডিউলের শেষ লেসন, আর একটু আলাদা ধরনের। এখানে নতুন কোনো যন্ত্রপাতি
          নেই, বরং এতদিন যা যা শিখলেন, সবগুলোকে একসাথে কাজ করতে দেখব, আর সেটাও
          পৃথিবীর সবচেয়ে চেনা ঘটনায়, আপনার ফোন অনলাইন হওয়ায়।
        </ContentParagraph>
        <ContentParagraph>
          ফোন Internet এ জোড়া লাগে দুইভাবে, বাসায় Wi-Fi দিয়ে, আর বাইরে Mobile
          Data দিয়ে। আমরা দুইটা পথই ধাপে ধাপে দেখব, আর দেখবেন প্রতিটা ধাপে এই
          মডিউলের চেনা মুখ, MAC, ARP, IP, DHCP, Subnet, Gateway, NAT, একে একে ফিরে
          আসছে।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনার ফোন Wi-Fi তে জোড়া লাগল, এই কথাটা আর জাদু মনে হবে না।
          ভেতরে ঠিক কী কী ঘটল, আপনি একদম শুরু থেকে শেষ পর্যন্ত নিজে বলে দিতে
          পারবেন। এটাই এই পুরো মডিউলের আসল পুরস্কার।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আলাদা আলাদা করে সব শেখা হয়েছে, MAC, IP, DHCP, Gateway, NAT। এবার সেগুলো এক সুতোয় গাঁথার সময়। আর সুতোটা হলো আপনার হাতের ফোন, যেটা রোজ চুপচাপ এই পুরো নাটকটা মঞ্চস্থ করে।",
      author: "Computer Networking",
      role: "Lesson 11",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "two-paths",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>দুইটা পথ, একই গন্তব্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রোজ সকালে ঘুম থেকে উঠে ফোনের পর্দা খোলেন, আর সাথে সাথে সব চলে,
                বার্তা আসে, খবর আসে, ভিডিও চলে। এর পেছনে ফোনটা একটা কাজ করে ফেলেছে,
                Internet এ জোড়া লেগেছে। কীভাবে? দুইটা পথের যেকোনো একটা দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                বাসায় থাকলে ফোন সাধারণত Wi-Fi ধরে, মানে বাসার Router এ জোড়া লাগে।
                বাইরে বেরোলে Wi-Fi নেই, তখন ফোন Mobile Data ধরে, মানে কাছের একটা
                Cell Tower এ জোড়া লাগে। দুইটা সম্পূর্ণ আলাদা প্রবেশপথ, কিন্তু শেষে
                দুইটাই মেশে একই Internet এ।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TwoPathsDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "ফোন নিজেই পথ বেছে নেয়",
          content: (
            <p>
              মজার ব্যাপার, কোন পথ দিয়ে যাবে সেটা ফোন নিজে ঠিক করে, আপনাকে ভাবতে
              হয় না। সাধারণত Wi-Fi পেলে সেটাই বেছে নেয় (কারণ প্রায়ই দ্রুত আর সস্তা),
              না পেলে Mobile Data তে চলে যায়। হাঁটতে হাঁটতে বাসা থেকে বেরোলে ফোন
              চুপচাপ Wi-Fi ছেড়ে Mobile Data ধরে নেয়, আপনি টেরও পান না। এই পুরো
              লেসনে আমরা এই দুইটা পথের ভেতরে কী ঘটে, সেটাই খুলে দেখব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "wifi-path",
      subHeader: { index: "002", title: "The Wi-Fi Path" },
      title: <SectionTitle>Wi-Fi তে জোড়া লাগা, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি বাসায় ঢুকে Wi-Fi তে ফোন দিলেন। শূন্য থেকে পুরোপুরি অনলাইন হওয়া
              পর্যন্ত ঠিক কী ঘটে, দেখুন, আর খেয়াল করুন প্রতিটা ধাপে এই মডিউলের চেনা
              মুখ ফিরে আসছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "রেডিও সংযোগ (Password দিয়ে)",
              description:
                "ফোন Wi-Fi এর নাম খুঁজে পায়, Password দিয়ে জোড়া লাগে। এখন সে বাসার Network এর একজন সদস্য, ঠিক যেন তার নেটওয়ার্ক Card তারে জোড়া লাগল। কিন্তু এখনো তার কোনো IP নেই।",
            },
            {
              title: "DHCP পুরো সেটিং দিল (DORA)",
              description:
                "ফোন চেঁচিয়ে খোঁজে (Discover), Router অফার করে, ফোন বেছে চায় (Request), Router নিশ্চিত করে (Acknowledge)। এক ধাক্কায় ফোন পেল IP, Subnet Mask, Gateway আর DNS। এটাই DHCP লেসনের DORA।",
            },
            {
              title: "নিজের পাড়া চিনল",
              description:
                "IP আর Mask হাতে আসায় ফোন এখন জানে তার Network কতদূর (Subnet লেসন)। বাসার আরেকটা যন্ত্রের সাথে কথা বলতে হলে সে পরের হাতের MAC বের করে ARP দিয়ে, তারপর সরাসরি পৌঁছে দেয় (ARP আর MAC লেসন)।",
            },
            {
              title: "বাইরে যেতে Gateway আর NAT",
              description:
                "গন্তব্য নিজের পাড়ার না হলে ফোন চিঠিটা তুলে দেয় Default Gateway, মানে Router এর হাতে (Gateway লেসন)। Router সীমানায় ফোনের Private IP কে বাসার Public IP তে বদলে বাইরে পাঠায় (NAT লেসন)।",
            },
            {
              title: "অনলাইন",
              description:
                "ব্যস, ফোন এখন পুরোপুরি অনলাইন। এই কয়েক সেকেন্ডে সে এই মডিউলের প্রায় প্রতিটা ধারণা ব্যবহার করে ফেলল, আর আপনি শুধু দেখলেন Wi-Fi এর চিহ্নটা জ্বলে উঠল।",
            },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "mobile-path",
      subHeader: { index: "003", title: "The Mobile Data Path" },
      title: <SectionTitle>Mobile Data, Carrier ই সব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার বাইরে বেরোলেন, Wi-Fi নেই। ফোন Mobile Data ধরল। এখানে বাসার
                Router নেই, তাহলে DHCP, Gateway, NAT এর কাজগুলো কে করে? উত্তর,
                আপনার Carrier, মানে যে কোম্পানির SIM আপনার ফোনে।
              </ContentParagraph>
              <ContentParagraph>
                ফোন প্রথমে SIM কার্ড দিয়ে নিজের পরিচয় দেয়, তারপর রেডিও দিয়ে জোড়া
                লাগে কাছের একটা Cell Tower এ। সেখান থেকে পৌঁছায় Carrier এর বিশাল
                কেন্দ্রীয় Network এ। এই Carrier একাই বাসার Router এর সব ভূমিকা নেয়,
                আপনাকে একটা IP দেয়, Gateway এর কাজ করে, আর NAT দিয়ে বাইরে বের করে,
                শুধু বিশাল মাপে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CarrierPathDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "তাই Mobile Data তে আপনি প্রায় সবসময় CGNAT এর পেছনে",
          content: (
            <p>
              Carrier এর লাখ লাখ গ্রাহক, অথচ Public IP সীমিত। তাই তারা NAT এর উপরে
              আরেক স্তর NAT বসায়, সেই CGNAT, যেটা NAT লেসনে দেখেছিলেন। ফলে Mobile
              Data তে আপনার তথাকথিত Public IP টাও আসলে অনেক গ্রাহকের সাথে ভাগ করা।
              এই কারণেই Mobile Data থেকে সরাসরি কোনো সার্ভার হোস্ট করা প্রায় অসম্ভব,
              আর এই কারণেই দুইজন একই Carrier এর গ্রাহক অনেক সময় একই Public IP তে
              দেখা যায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "same-rest",
      subHeader: { index: "004", title: "Two Paths, Same Rest" },
      title: <SectionTitle>আলাদা শুধু শুরুটুকু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সবচেয়ে সুন্দর কথাটা। Wi-Fi আর Mobile Data দেখতে দুই দুনিয়া,
              কিন্তু আসলে এদের তফাত শুধু শুরুর কয়েক মিটারে, মানে কীভাবে জোড়া লাগল
              আর কে ঠিকানা দিল। একবার IP, Gateway আর DNS হাতে এলে, তারপরের পুরো গল্প
              হুবহু এক। নিচে টগল করে নিজে দেখুন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PathCompareLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই কারণেই App গুলো কিছু জানে না",
          content: (
            <p>
              আপনার WhatsApp বা YouTube কখনো জানে না আপনি Wi-Fi তে আছেন নাকি Mobile
              Data তে, আর জানার দরকারও নেই। কারণ তাদের কাছে সবকিছু একই রকম, একটা IP
              আছে, একটা Gateway আছে, DNS আছে, ব্যস। কোন পথে ঠিকানাটা এল, সেটা
              নিচের স্তরের ব্যাপার, App এর মাথাব্যথা নয়। এই পরিষ্কার ভাগাভাগির
              কারণেই একই App সব জায়গায় দিব্যি চলে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>দুই পথের পর্যটক আর Island Tours</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একজন পর্যটক Island Tours এর App খুলছেন, কখনো হোটেলের Wi-Fi তে,
                কখনো নিজের Mobile Data তে। আপনার সার্ভারের চোখে এটা কেমন দেখায়,
                দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সার্ভারের কাছে দুইটা এক:</strong> পর্যটক Wi-Fi তে থাকুন
                  বা Mobile Data তে, আপনার সার্ভারে অনুরোধটা একই রকম আসে, একটা IP
                  থেকে একটা HTTP অনুরোধ। সার্ভারকে কিছু আলাদা করতে হয় না, কারণ
                  শুরুর পথের তফাত সার্ভার পর্যন্ত পৌঁছায়ই না।
                </ListItem>
                <ListItem>
                  <strong>Log এ শুধু Public IP আলাদা:</strong> হোটেল Wi-Fi তে
                  এলে Log এ দেখবেন হোটেলের NAT এর Public IP, আর Mobile Data তে এলে
                  Carrier এর CGNAT এর Public IP। দুইটাই ভাগের, তাই একই IP তে অনেক
                  পর্যটক দেখা যেতে পারে। শুধু IP দিয়ে ইউজার আলাদা করা এখানেও ভুল।
                </ListItem>
                <ListItem>
                  <strong>ধীর হলে সন্দেহ কোথায়:</strong> App ধীর চললে মনে রাখবেন,
                  সমস্যা আপনার সার্ভারে নাও হতে পারে। পর্যটকের Mobile Data দুর্বল
                  হলে, বা হোটেলের Wi-Fi ভিড়ে ঠাসা হলে, শুরুর কয়েক মিটারেই দেরি
                  হয়ে যায়, যার উপর আপনার কোনো হাত নেই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "request-flow",
      subHeader: { index: "006", title: "Step-by-step Flow" },
      title: <SectionTitle>এক ট্যাপ থেকে Server পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ফোন অনলাইন হয়ে গেছে, এবার আপনি একটা App এ ট্যাপ করলেন। এই মডিউলের
              সব টুকরো এক সুতোয় গেঁথে, সেই এক ট্যাপ থেকে Server পর্যন্ত পুরো
              যাত্রা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "নাম থেকে ঠিকানা",
              description:
                "App একটা নাম নিয়ে শুরু করে, IP নয়। DHCP এর দেওয়া DNS কে জিজ্ঞেস করে নামটার IP বের করে। (DNS এর বিস্তারিত পরের মডিউল।)",
            },
            {
              title: "নিজের পাড়া নাকি বাইরে",
              description:
                "গন্তব্যের IP আর নিজের Subnet Mask মিলিয়ে ফোন দেখে গন্তব্য নিজের পাড়ার কি না। প্রায় সবসময় বাইরের, তাই চিঠি যাবে Gateway এর হাতে।",
            },
            {
              title: "Gateway আর NAT পার",
              description:
                "চিঠি যায় Gateway তে (Wi-Fi হলে বাসার Router, Mobile হলে Carrier)। সীমানায় NAT ফোনের Private IP কে Public IP তে বদলে, একটা Port সহ, বাইরে পাঠায়।",
            },
            {
              title: "দরজা থেকে দরজা, Server এ",
              description:
                "চিঠি এক Network এর দরজা থেকে পরের দরজা, ধাপে ধাপে গন্তব্য Server এর Network এ পৌঁছায়। প্রতি ধাপে চূড়ান্ত IP এক থাকে, পরের হাতের MAC বদলায়।",
            },
            {
              title: "উত্তর একই পথে ফিরে পর্দায়",
              description:
                "Server উত্তর দেয় ফোনের Public IP আর Port এ। NAT টেবিল দেখে সেটা ঠিক ফোনে ফেরে, দরজা থেকে দরজা, Gateway হয়ে, শেষে আপনার পর্দায় জিনিসটা ভেসে ওঠে।",
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
                <strong>নিজের দুই পথ মিলিয়ে দেখুন</strong>, নিচের Lab এ কমান্ড
                আছে। একবার Wi-Fi তে, একবার Mobile Data তে (Hotspot দিয়ে), আপনার IP
                আর Public IP মিলিয়ে দেখুন, কীভাবে বদলায়।
              </ListItem>
              <ListItem>
                <strong>PowerCert Animated Videos</strong>, Wi-Fi আর Cellular
                Network কীভাবে কাজ করে, ছোট সহজ Animation।{" "}
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
                <strong>Practical Networking</strong>, এই মডিউলের সব বিষয়ের গভীর,
                পরিষ্কার সিরিজ। একবার পুরোটা ঘুরে এলে ভিত পাকা হয়ে যাবে।{" "}
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
    /* ---------------------------------------------------------------- 8 */
    {
      id: "recap",
      subHeader: { index: "008", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন, আর পুরো মডিউল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  ফোন Internet এ জোড়া লাগে দুইভাবে, Wi-Fi (বাসার Router) আর Mobile
                  Data (Cell Tower আর Carrier)। ফোন নিজেই একটা পথ বেছে নেয়।
                </ListItem>
                <ListItem>
                  Wi-Fi তে জোড়া লাগার ধাপ: রেডিও সংযোগ, DHCP তে পুরো সেটিং (DORA),
                  Subnet দিয়ে পাড়া চেনা, বাইরে যেতে Gateway আর NAT।
                </ListItem>
                <ListItem>
                  Mobile Data তে বাসার Router এর সব কাজ করে Carrier, বিশাল মাপে।
                  SIM দিয়ে পরিচয়, Cell Tower দিয়ে সংযোগ, আর প্রায় সবসময় CGNAT এর
                  পেছনে।
                </ListItem>
                <ListItem>
                  দুই পথের তফাত শুধু শুরুতে, কে ঠিকানা দিল আর কীভাবে জোড়া লাগল।
                  একবার IP, Gateway, DNS হাতে এলে বাকি সব হুবহু এক, তাই App কিছু
                  জানে না।
                </ListItem>
                <ListItem>
                  সার্ভারের কাছে Wi-Fi আর Mobile Data এক রকম দেখায়, শুধু Log এ
                  Public IP আলাদা, দুইটাই ভাগের।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর এখানেই Module 03 শেষ। এবার একবার পেছন ফিরে দেখুন, কত দূর এলেন।
                শুরু করেছিলেন LAN, Switch আর Router দিয়ে, তারপর MAC আর ARP, তারপর
                IP, Public বনাম Private, Subnet Mask, Gateway, DHCP, আর NAT। আজ এই
                সবগুলো একসাথে গেঁথে আপনি বলে দিতে পারেন একটা ফোন কীভাবে অনলাইন হয়।
                একটা যন্ত্র কীভাবে দুনিয়ার সাথে কথা বলে, তার পুরো ছবিটা এখন আপনার
                হাতে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["শব্দ", "এক লাইনে"],
    rows: [
      [
        <span className="font-bold text-primary">দুই পথ</span>,
        "Wi-Fi (বাসার Router) আর Mobile Data (Cell Tower, Carrier)",
      ],
      [
        <span className="font-bold text-primary">Wi-Fi জোড়া</span>,
        "রেডিও সংযোগ, DHCP (DORA), Subnet, Gateway, NAT",
      ],
      [
        <span className="font-bold text-primary">Mobile Data</span>,
        "Carrier ই DHCP, Gateway, NAT সব করে, বিশাল মাপে",
      ],
      [
        <span className="font-bold text-primary">SIM</span>,
        "Mobile Data তে ফোনের পরিচয়, Carrier এর কাছে",
      ],
      [
        <span className="font-bold text-primary">CGNAT</span>,
        "Mobile Data তে Public IP প্রায় সবসময় অনেকের সাথে ভাগ",
      ],
      [
        <span className="font-bold text-primary">আলাদা শুধু শুরু</span>,
        "IP পাওয়ার পর DNS, Gateway, NAT, hops সব দুই পথেই এক",
      ],
      [
        <span className="font-bold text-primary">সার্ভারের চোখে</span>,
        "দুই পথ একই অনুরোধ, শুধু Log এ Public IP আলাদা",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "ফোন Wi-Fi আর Mobile Data এর মধ্যে কোন পথে যাবে, কে ঠিক করে?",
        options: [
          {
            key: "A",
            text: "প্রতিবার আপনাকে হাতে বেছে দিতে হয়",
            isCorrect: false,
            explanation:
              "না, ফোন নিজেই ঠিক করে। সাধারণত Wi-Fi পেলে সেটা, না পেলে Mobile Data।",
          },
          {
            key: "B",
            text: "ফোন নিজেই বেছে নেয়, সাধারণত Wi-Fi আগে",
            isCorrect: true,
            explanation:
              "ঠিক। ফোন চুপচাপ পথ বেছে নেয়, বাসা থেকে বেরোলে Wi-Fi ছেড়ে Mobile Data ধরে, আপনি টেরও পান না।",
          },
          {
            key: "C",
            text: "সার্ভার ঠিক করে দেয়",
            isCorrect: false,
            explanation:
              "সার্ভারের এতে কোনো ভূমিকা নেই। পথ বাছাই ফোনের নিজের কাজ।",
          },
        ],
      },
      {
        id: 2,
        text: "Wi-Fi তে জোড়া লাগার পর ফোন IP, Mask, Gateway আর DNS কীভাবে পায়?",
        options: [
          {
            key: "A",
            text: "DHCP এর DORA কথোপকথন দিয়ে, Router থেকে",
            isCorrect: true,
            explanation:
              "ঠিক। Discover, Offer, Request, Acknowledge, চারটা ধাপে ফোন এক ধাক্কায় পুরো সেটিং পায়।",
          },
          {
            key: "B",
            text: "SIM কার্ড থেকে",
            isCorrect: false,
            explanation:
              "SIM Mobile Data তে পরিচয় দেয়। Wi-Fi তে সেটিং আসে DHCP থেকে।",
          },
          {
            key: "C",
            text: "আপনি হাতে বসান",
            isCorrect: false,
            explanation:
              "না, আপনি কিছু বসান না। DHCP আপনাআপনি দেয়।",
          },
        ],
      },
      {
        id: 3,
        text: "Mobile Data তে বাসার Router এর কাজগুলো (IP দেওয়া, Gateway, NAT) কে করে?",
        options: [
          {
            key: "A",
            text: "আপনার ফোন নিজেই",
            isCorrect: false,
            explanation:
              "না, ফোন গ্রাহক। এই কাজগুলো করে Carrier।",
          },
          {
            key: "B",
            text: "আপনার Carrier, বিশাল মাপে",
            isCorrect: true,
            explanation:
              "ঠিক। Mobile Data তে Carrier ই একাই DHCP, Gateway আর NAT এর ভূমিকা নেয়, শুধু লাখ লাখ গ্রাহকের জন্য।",
          },
          {
            key: "C",
            text: "গন্তব্য সার্ভার",
            isCorrect: false,
            explanation:
              "সার্ভারের এতে ভূমিকা নেই। এটা আপনার Carrier এর কাজ।",
          },
        ],
      },
      {
        id: 4,
        text: "Wi-Fi আর Mobile Data এর মধ্যে আসলে কী আলাদা?",
        options: [
          {
            key: "A",
            text: "শুধু শুরুটা, কীভাবে জোড়া লাগল আর কে ঠিকানা দিল",
            isCorrect: true,
            explanation:
              "ঠিক। একবার IP, Gateway, DNS হাতে এলে তারপরের সব, DNS থেকে Server পর্যন্ত, হুবহু এক।",
          },
          {
            key: "B",
            text: "পুরো ব্যাপারটাই আলাদা",
            isCorrect: false,
            explanation:
              "না, শুধু শুরুর কয়েক মিটার আলাদা। বাকি পুরো যাত্রা এক।",
          },
          {
            key: "C",
            text: "Mobile Data তে DNS লাগে না",
            isCorrect: false,
            explanation:
              "DNS দুই পথেই লাগে। নাম থেকে IP বের করার কাজ একই।",
          },
        ],
      },
      {
        id: 5,
        text: "একজন পর্যটক কখনো হোটেল Wi-Fi, কখনো Mobile Data তে Island Tours খোলেন। সার্ভার কী দেখে?",
        options: [
          {
            key: "A",
            text: "দুইবার সম্পূর্ণ আলাদা ধরনের অনুরোধ",
            isCorrect: false,
            explanation:
              "না। সার্ভারের কাছে দুইটা একই রকম অনুরোধ, শুরুর পথের তফাত সার্ভার পর্যন্ত পৌঁছায় না।",
          },
          {
            key: "B",
            text: "একই রকম অনুরোধ, শুধু Log এ Public IP আলাদা",
            isCorrect: true,
            explanation:
              "ঠিক। হোটেলের NAT এর IP বনাম Carrier এর CGNAT এর IP, শুধু এটুকুই আলাদা। বাকি সব এক।",
          },
          {
            key: "C",
            text: "কিছুই দেখে না, কারণ Mobile Data তে সার্ভার কাজ করে না",
            isCorrect: false,
            explanation:
              "Mobile Data তেও সার্ভার ঠিক কাজ করে। শুধু Public IP আলাদা আসে।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের দুই পথ মিলিয়ে দেখুন",
    subtitle: "Terminal আর ফোন দিয়ে চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "এখন কোন পথে আছেন",
        description:
          "আপনার যন্ত্র এই মুহূর্তে Wi-Fi তে নাকি অন্য কিছুতে, আর তার IP কী, দেখুন।",
      },
      {
        title: "Wi-Fi তে Public IP",
        description:
          "Wi-Fi তে থাকা অবস্থায় আপনার Public IP বের করুন, লিখে রাখুন।",
      },
      {
        title: "Mobile Data তে Public IP",
        description:
          "ফোনের Mobile Data দিয়ে Hotspot চালু করে তাতে যন্ত্র জুড়ুন, তারপর আবার Public IP দেখুন, আগেরটার সাথে মেলান।",
      },
      {
        title: "DNS কে দিল",
        description:
          "দুই পথেই আপনার DNS কে, দেখুন, আর খেয়াল করুন সেটাও DHCP বা Carrier এর দেওয়া।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-which-path.sh",
        language: "bash",
        code: `# এখন কোন সংযোগে, আর IP কী
# macOS: কোন Interface চালু (en0 সাধারণত Wi-Fi)
ifconfig en0 | grep "inet "
networksetup -listallhardwareports

# Linux:
nmcli device status        # কোনটা connected, কোন ধরন
ip -4 addr show

# আপনার ভেতরের IP দেখুন, Wi-Fi হলে সাধারণত 192.168.x।`,
      },
      {
        filename: "2-public-ip-wifi.sh",
        language: "bash",
        code: `# Wi-Fi তে থাকা অবস্থায় Public IP
curl ifconfig.me
echo

# এটা লিখে রাখুন। এটাই বাসার NAT এর Public IP,
# বাসার সব যন্ত্র বাইরে যায় এই ঠিকানায়।`,
      },
      {
        filename: "3-public-ip-mobile.sh",
        language: "bash",
        code: `# ফোনের Mobile Data দিয়ে Hotspot চালু করুন,
# যন্ত্রটা সেই Hotspot এ জুড়ুন, তারপর আবার:
curl ifconfig.me
echo

# এবারেরটা আগের Wi-Fi এর Public IP এর সাথে মিলবে না।
# এটা Carrier এর (প্রায়ই CGNAT এর) Public IP।
# একই যন্ত্র, দুই পথ, দুই Public IP।`,
      },
      {
        filename: "4-my-dns.sh",
        language: "bash",
        code: `# আপনার DNS কে দিল
scutil --dns | grep nameserver | head   # macOS
nmcli device show | grep DNS            # Linux
cat /etc/resolv.conf | grep nameserver  # অনেক Linux এ

# দুই পথেই DNS এর ঠিকানা আসে আপনাআপনি,
# Wi-Fi তে DHCP থেকে, Mobile Data তে Carrier থেকে।
# আপনি কখনো এটা হাতে বসাননি।`,
      },
    ],
    tip: "তিন নম্বর পরীক্ষাটা সবচেয়ে মজার, কারণ একই যন্ত্রে শুধু পথ বদলে আপনি দুইটা আলাদা Public IP পাবেন, একটা বাসার NAT এর, একটা Carrier এর CGNAT এর। তখন এই লেসনের মূল কথাটা হাতে কলমে সত্যি হয়ে ওঠে, শুরুর পথটাই শুধু আলাদা। আর মজার ব্যাপার, curl ifconfig.me কমান্ডটা দুইবার হুবহু এক, শুধু নিচের পথটা বদলেছে, অথচ ফল বদলে গেল, ঠিক যেমনটা হওয়ার কথা।",
  },
  assignment: {
    title: "Mini Project: এক যন্ত্র, দুই পথ",
    time: "৪৫ মিনিট",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>দুই Public IP:</strong> Lab এর দুই আর তিন নম্বর চালিয়ে Wi-Fi আর
        Mobile Data তে আপনার Public IP পাশাপাশি লিখুন। দুইটা কি আলাদা? এক লাইনে
        লিখুন কেন আলাদা।
      </span>,
      <span key="2">
        <strong>কে কী দিল:</strong> Wi-Fi তে আপনার IP, Gateway আর DNS কে দিল, আর
        Mobile Data তে কে দিল, দুইটা পাশাপাশি লিখুন। ভূমিকাটা কার হাতে বদলে গেল?
      </span>,
      <span key="3">
        <strong>কী এক থাকল:</strong> উপরের PathCompareLab এ দুই পথে টগল করে দেখুন
        কোন অংশটা বদলায় না। সেই না বদলানো অংশটা কী কী নিয়ে গঠিত, লিখুন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ থেকে ৭ লাইন):</strong> একজন বন্ধুকে বোঝান,
        একটা ফোন Wi-Fi তে দিলে ভেতরে ধাপে ধাপে কী কী ঘটে যন্ত্রটা অনলাইন হওয়া
        পর্যন্ত। এই মডিউলের চেনা শব্দগুলো (DHCP, Gateway, NAT) ব্যবহার করুন।
      </span>,
    ],
    deliverables: [
      <span key="1">Wi-Fi আর Mobile Data তে আপনার দুই Public IP, আর কেন আলাদা</span>,
      <span key="2">দুই পথে IP, Gateway, DNS কে দিল, পাশাপাশি</span>,
      <span key="3">দুই পথে যা এক থাকে, তার তালিকা</span>,
      <span key="4">ফোন Wi-Fi তে অনলাইন হওয়ার পুরো গল্প, ৫ থেকে ৭ লাইনে</span>,
    ],
  },
};
