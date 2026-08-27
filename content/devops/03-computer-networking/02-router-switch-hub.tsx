/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  HubVsSwitchLab,
  WhichBoxLab,
} from "../../../components/course/topics/rsh/animations";
import {
  HomeBoxDiagram,
  IntelligenceLadderDiagram,
  ThreeBoxesDiagram,
} from "../../../components/course/topics/rsh/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const routerSwitchHubContent: TopicData = {
  id: "router-switch-hub",
  introduction: {
    badge: "MODULE 03 · LESSON 02",
    title: <SectionTitle>ভেতরে জোড়ে একজন, বাইরে জোড়ে আরেকজন</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে দেখেছেন LAN হলো আপনার নিজের ছোট দুনিয়া, আর বাইরে বেরোনোর
          একটাই দরজা, Router। কিন্তু ওই ছোট দুনিয়ার ভেতরে যন্ত্রগুলো একে অন্যের
          সাথে জোড়া লাগে কীসে? আর সেই দরজাটা, Router, ঠিক কী করে যেটা ভেতরের
          যন্ত্র করতে পারে না? এই লেসনে আমরা সেই যন্ত্রগুলোর সাথে পরিচিত হব।
        </ContentParagraph>
        <ContentParagraph>
          তিনটা যন্ত্রের নাম আপনি শুনে থাকবেন, Hub, Switch আর Router। অনেকে এই
          তিনটাকে একই জিনিসের তিনটা নাম ভাবেন, কিন্তু আসলে এরা তিনটা আলাদা কাজের
          যন্ত্র, আর একটা বুদ্ধির সিঁড়িতে সাজানো। একটা বোকা, একটা চালাক, আর
          একটা সম্পূর্ণ আলাদা ধরনের কাজ করে।
        </ContentParagraph>
        <ContentParagraph>
          একটা অফিস বিল্ডিং ভাবুন। ভেতরে এক তলার সব ঘরের মধ্যে চিঠি বিলি করার
          জন্য একজন পিয়ন আছেন, যিনি জানেন কে কোন ঘরে বসে। আর বিল্ডিং থেকে
          বাইরের শহরে চিঠি পাঠানোর জন্য আছে একটা Post Office এর গাড়ি। এই
          দুইজনের কাজ আলাদা, আর দুইজনকে গুলিয়ে ফেললে চিঠি পৌঁছায় না। Switch
          হলো সেই পিয়ন, আর Router সেই গাড়ি।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "Switch এক Network এর ভেতরের যন্ত্রগুলোকে জোড়ে, আর প্রত্যেককে ঠিক তার চিঠি দেয়। Router দুইটা আলাদা Network কে জোড়ে। একটা ভেতরের কাজ, একটা সীমানা পার হওয়ার।",
      author: "Computer Networking",
      role: "Lesson 02",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "three",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>তিনটা বাক্স, তিন রকম আচরণ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে সহজ উপায় হলো, একই একটা কাজ দিয়ে তিনটা যন্ত্রকে পরীক্ষা
                করা। ধরুন LAN এ চারটা যন্ত্র, A, B, C, D। A একটা চিঠি পাঠাতে
                চায়, শুধু B এর জন্য। তিনটা যন্ত্র এই একই কাজ তিনভাবে সামলায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ThreeBoxesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Hub, বোকা যন্ত্র:</strong> Hub মনে রাখে না কে কোথায়
                বসে। তাই A এর চিঠি এলে সে সেটা বাকি সবাইকে কপি করে দেয়, B, C, D
                সবাই পায়। ভাবুন একটা ঘরে একজন চেঁচিয়ে বলছেন, রফিক কোথায়? সবাই
                শুনল, কিন্তু উত্তর দিল শুধু রফিক। এটা কাজ করে, কিন্তু অকারণ
                ভিড়, আর গোপন কথাও সবাই শুনে ফেলে। আজ Hub আর ব্যবহার হয় না,
                শুধু ইতিহাসে আছে।
              </ListItem>
              <ListItem>
                <strong>Switch, চালাক যন্ত্র:</strong> Switch একটা টেবিলে মনে
                রাখে কে কোন তারে বসে। তাই A এর চিঠি শুধু B এর কাছেই যায়, C আর D
                কিছুই টের পায় না। এটাই আজকের প্রতিটা LAN এর আসল কাজের যন্ত্র,
                সেই পিয়ন যিনি জানেন কে কোন ঘরে। কম ভিড়, বেশি গোপনীয়তা, বেশি
                গতি।
              </ListItem>
              <ListItem>
                <strong>Router, সীমানার যন্ত্র:</strong> Router একদম আলাদা কাজ
                করে। সে এক LAN এর ভেতরের যন্ত্র জোড়ে না, বরং দুইটা আলাদা
                Network কে জোড়ে। আপনার বাসার LAN কে বাইরের WAN এর সাথে, ঠিক
                Lesson 01 এর সেই এক দরজা। ভেতরের চিঠি Switch সামলায়, বাইরের
                চিঠি Router।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "দুইটা শব্দ মনে রাখলেই চলবে",
          content: (
            <p>
              Hub এর কথা শুধু ইতিহাস হিসেবে জানুন, আজ আর লাগে না। আসল দুইটা হলো
              Switch আর Router। Switch ভেতরে জোড়ে, এক LAN এর যন্ত্রগুলোকে।
              Router বাইরে জোড়ে, দুইটা আলাদা Network কে। ভেতরে Switch, বাইরে
              Router, এই এক লাইন গেঁথে নিলে এই লেসনের অর্ধেক হয়ে গেল।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "ladder",
      subHeader: { index: "002", title: "The Ladder" },
      title: <SectionTitle>বোকা থেকে চালাক, বুদ্ধির সিঁড়ি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তিনটা যন্ত্রকে একটা বুদ্ধির সিঁড়ি হিসেবে ভাবলে মনে রাখা সহজ। যত
              উপরে, তত বেশি মনে রাখে, আর তত নিখুঁত কাজ করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IntelligenceLadderDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Hub কিছুই মনে রাখে না, তাই সবাইকে কপি করে, সবচেয়ে বোকা। Switch
              একটা টেবিল মনে রাখে, কে কোন তারে, তাই শুধু ঠিক জনকে দেয়। আর
              Router রাস্তার নকশা রাখে, কোন Network কোন দিকে, তাই আলাদা Network
              এর মধ্যে বেছে পাঠায়। বুদ্ধি যত বেশি, অকারণ ভিড় তত কম, আর কাজ তত
              দ্রুত। এই কারণেই সময়ের সাথে Hub মরে গেছে আর Switch রাজত্ব করছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Switch মনে রাখে কীভাবে, সেই টেবিলের চাবি কী",
          content: (
            <p>
              Switch যে টেবিলে মনে রাখে কে কোন তারে বসে, সেই টেবিলের চাবি একটা
              বিশেষ ঠিকানা, প্রতিটা Network Card এর নিজস্ব একটা নম্বর। এই
              নম্বরটার নাম MAC Address, আর সেটাই পরের লেসনের পুরো বিষয়। আপাতত
              শুধু জানুন, Switch এর চালাকির পেছনে একটা টেবিল আছে, আর সেই টেবিল
              কোন চাবিতে সাজানো, সেটা Lesson 03 এ দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "hub-vs-switch",
      subHeader: { index: "003", title: "See It" },
      title: <SectionTitle>Hub সবাইকে, Switch শুধু একজনকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Hub আর Switch এর তফাতটা হাতে ধরে দেখুন। মোড বদলে A থেকে যেকোনো
              একজনকে চিঠি পাঠান, আর দেখুন কে কে পায়। Hub মোডে অকারণে সবাই পায়,
              Switch মোডে শুধু গন্তব্য।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HubVsSwitchLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "কেন এটা শুধু গতির নয়, নিরাপত্তারও ব্যাপার",
          content: (
            <p>
              Hub এ সবাই সবার চিঠি পেত, মানে চাইলে যে কেউ অন্যের কথা শুনে ফেলতে
              পারত। Switch এ চিঠি শুধু গন্তব্যে যায়, তাই আড়ি পাতা কঠিন। এই
              কারণেই Switch শুধু দ্রুতই নয়, নিরাপদও। অবশ্য এর মানে এই নয় যে
              LAN এ সব নিরাপদ, তাই আজও গুরুত্বপূর্ণ কথা HTTPS দিয়ে খামবন্ধ রাখা
              হয়, যেটা Module 06। কিন্তু Switch থেকে Hub এ ফিরে যাওয়া মানেই এক
              ধাপ পিছিয়ে যাওয়া, গতিতেও, নিরাপত্তায়ও।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "home-box",
      subHeader: { index: "004", title: "Your Home Box" },
      title: <SectionTitle>বাসার Router আসলে তিন যন্ত্র</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন একটা গোলমাল পরিষ্কার করি যেটা প্রায় সবাইকে ভোগায়। এই লেসনে
                বললাম Router বাইরে জোড়ে আর Switch ভেতরে জোড়ে। কিন্তু বাসায় তো
                একটাই বাক্স, যাকে আমরা Router বলি, আর সেটা তো ভেতরের যন্ত্রও
                জোড়ে, বাইরেও জোড়ে। তাহলে?
              </ContentParagraph>
              <ContentParagraph>
                উত্তরটা হলো, বাসার ওই বাক্সটা আসলে একটা যন্ত্র নয়, একটা বাক্সে
                তিনটা যন্ত্র একসাথে। আমরা অভ্যাসে পুরোটাকে Router বলি, কিন্তু
                ভেতরে তিনটা আলাদা কাজ চলছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HomeBoxDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>ভেতরে একটা Switch:</strong> বাক্সের পেছনে কয়েকটা তারের
                গর্ত থাকে, যেখানে PC বা TV তারে জোড়া লাগানো যায়। ওই গর্তগুলো
                আসলে একটা Switch, যেটা তারের যন্ত্রগুলোকে জোড়ে আর প্রত্যেককে
                ঠিক তার চিঠি দেয়।
              </ListItem>
              <ListItem>
                <strong>ভেতরে একটা Wi-Fi অংশ:</strong> বেতার যন্ত্র, মানে Phone
                আর Laptop, জোড়ে আরেকটা অংশ, যার নাম Access Point। এটা Switch এর
                মতোই কাজ, শুধু তারের বদলে বাতাসে।
              </ListItem>
              <ListItem>
                <strong>ভেতরে একটা আসল Router:</strong> আর এই পুরো LAN কে বাইরের
                ISP এর সাথে জোড়ে আসল Router অংশটা। এটাই সেই দরজা, LAN থেকে WAN।
                বাক্সের সবচেয়ে গুরুত্বপূর্ণ কাজ এটাই, তাই পুরো বাক্সের নাম হয়ে
                গেছে Router।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই কারণেই শব্দটা নিয়ে এত বিভ্রান্তি",
          content: (
            <p>
              যখন কেউ বলে বাসার Router, তখন সে আসলে এই তিন যন্ত্রের বাক্সটা
              বোঝায়। কিন্তু যখন Networking এর বই বলে Router, তখন সে শুধু সেই এক
              অংশটা বোঝায় যেটা Network জোড়ে। দুইটা এক শব্দ, দুই মানে। এই
              তফাতটা জানলে পরের লেসনগুলোতে আর গুলিয়ে ফেলবেন না, আর অফিসে যখন
              সত্যিকারের আলাদা Switch আর আলাদা Router দেখবেন, বুঝবেন কেন সেখানে
              দুইটা আলাদা যন্ত্র।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "which-box",
      subHeader: { index: "005", title: "Your Turn" },
      title: <SectionTitle>কোন কাজে কোন বাক্স</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিয়মটা বসেছে কিনা দেখি। নিচে পাঁচটা কাজ, প্রতিটায় বলুন কোন
              যন্ত্র লাগবে। মনে রাখুন, ভেতরে জোড়া Switch, বাইরে জোড়া Router,
              সবাইকে শোনানো সেকেলে Hub।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhichBoxLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "project",
      subHeader: { index: "006", title: "Project Example" },
      title: (
        <SectionTitle>Island Tours এর Datacenter এ কোন বাক্স</SectionTitle>
      ),
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর সার্ভার একটা Datacenter এ। সেখানে এই যন্ত্রগুলো
                সত্যিই আছে, আর আগের লেসনের LAN আর WAN এর তফাতটা এদের কাজেই ধরা
                পড়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Rack এর ভেতরে Switch:</strong> একই Rack এ API সার্ভার
                  আর Database সার্ভার পাশাপাশি। এদের জোড়ে একটা Switch, তাই API
                  আর Database এর কথা এক Switch পার হয়েই পৌঁছায়, কয়েক
                  মাইক্রোসেকেন্ডে। এই কারণেই Lesson 01 এ বলা সেই দ্রুত LAN,
                  বাস্তবে এটা একটা Switch।
                </ListItem>
                <ListItem>
                  <strong>Datacenter এর গেটে Router:</strong> পর্যটকের Request
                  বাইরের WAN থেকে আসে, আর Datacenter এ ঢোকার মুখে একটা Router
                  সেটাকে ভেতরের Network এ নিয়ে আসে। এটাই সেই সীমানা, বাইরের
                  দুনিয়া থেকে ভেতরের LAN।
                </ListItem>
                <ListItem>
                  <strong>Hub কোথাও নেই:</strong> কোনো আধুনিক Datacenter এ Hub
                  নেই, কারণ Hub মানে প্রতিটা সার্ভারের চিঠি বাকি সবাই শুনে
                  ফেলবে, যেটা ধীর আর অনিরাপদ। হাজার সার্ভারের জায়গায় Hub থাকলে
                  ভিড়েই সব থেমে যেত।
                </ListItem>
                <ListItem>
                  <strong>একই ছবি আপনার বাসায়:</strong> আপনার my-tours যখন
                  Laptop এ চলে, আপনার বাসার সেই এক বাক্স তিনটা কাজই করছে। Switch
                  দিয়ে Phone থেকে Laptop এ Test করা যায়, আর Router দিয়ে একদিন
                  Deploy করা সার্ভারে পৌঁছানো যায়। ছোট আর বড়, একই যন্ত্রের
                  গল্প।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Cloud এ এই যন্ত্রগুলো লুকানো, কিন্তু আছে",
          content: (
            <p>
              AWS বা DigitalOcean এ সার্ভার ভাড়া নিলে আপনি Switch বা Router
              ছুঁতে পারেন না, ওগুলো Cloud কোম্পানি সামলায়। কিন্তু ধারণাগুলো
              হুবহু থাকে, শুধু নাম বদলায়। Cloud এ Switch এর জায়গায় থাকে
              Virtual Network বা VPC, আর Router এর জায়গায় থাকে Internet
              Gateway। Module 12 এ যখন Cloud এ ঢুকব, এই লেসনের ছবিটাই ফিরে আসবে,
              শুধু নতুন নামে। তাই যন্ত্রটা না দেখলেও কাজটা বোঝা জরুরি।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "request-flow",
      subHeader: { index: "007", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা চিঠি, ভেতর থেকে বাইরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনার Laptop থেকে একটা Website এর Request কোন যন্ত্রের হাত ঘুরে
              বাইরে যায়, ধাপে ধাপে দেখুন। প্রতিটা ধাপে খেয়াল করুন, এটা Switch
              এর কাজ নাকি Router এর।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Laptop চিঠি ছাড়ল",
              description:
                "Laptop বুঝল গন্তব্য বাইরের দুনিয়ায়, তাই চিঠিটা LAN এর দরজা, মানে বাসার বাক্সের দিকে পাঠাল।",
            },
            {
              title: "ভেতরের Switch অংশ ধরল",
              description:
                "যদি Laptop তারে জোড়া থাকে, বাক্সের Switch অংশ চিঠিটা ধরে বুঝল এটা বাইরের, তাই Router অংশের হাতে দিল। যদি Wi-Fi তে থাকে, Access Point অংশ একই কাজ করল।",
            },
            {
              title: "Router অংশ সীমানায়",
              description:
                "Router অংশ চিঠিটা নিল, আর বুঝল এটা LAN ছেড়ে WAN এ যাবে। এখানেই ভেতর শেষ, বাইরে শুরু।",
            },
            {
              title: "ISP এর দিকে",
              description:
                "Router চিঠিটা ISP এর তারে তুলে দিল। এখন থেকে Lesson 05 এর সেই WAN যাত্রা, Router থেকে Router, সমুদ্রের তার পর্যন্ত।",
            },
            {
              title: "বাইরের প্রতিটা Hop এ Router",
              description:
                "বাইরের দুনিয়ায় প্রতিটা মোড়ে একটা করে বড় Router, প্রত্যেকে দুইটা Network জোড়ে, আর চিঠিটাকে পরের Network এর দিকে বেছে পাঠায়।",
            },
            {
              title: "গন্তব্যের LAN এ ঢোকা",
              description:
                "শেষে গন্তব্য Datacenter এর Router চিঠিটাকে ভেতরের LAN এ নিল, আর সেখানকার Switch সেটাকে ঠিক সার্ভারে পৌঁছে দিল। বাইরে Router, ভেতরে Switch, আবার।",
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
                <strong>PowerCert Animated Videos</strong>, Hub vs Switch vs
                Router নিয়ে ছোট Animation, একদম পরিষ্কার।{" "}
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
                <strong>নিজের বাক্স খুলুন</strong>, বাসার Router এর পেছনটা
                দেখুন। কয়টা তারের গর্ত (LAN Ports)? ওগুলোই Switch অংশ। আর একটা
                আলাদা রঙের গর্ত (WAN বা Internet)? ওটাই Router অংশের বাইরের
                দরজা।
              </ListItem>
              <ListItem>
                <strong>Computerphile</strong>, Search করুন: Switches and
                Routers, আর How Routers Work।{" "}
                <a
                  href="https://www.youtube.com/@Computerphile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  youtube.com/@Computerphile
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
                তিনটা যন্ত্র, একটা বুদ্ধির সিঁড়ি। Hub বোকা, Switch চালাক,
                Router সীমানার।
              </ListItem>
              <ListItem>
                Hub মনে রাখে না, তাই সবাইকে কপি করে দেয়। ভিড়, আর অনিরাপদ। আজ
                আর ব্যবহার হয় না, শুধু ইতিহাস।
              </ListItem>
              <ListItem>
                Switch একটা টেবিল মনে রাখে, কে কোন তারে বসে, তাই শুধু ঠিক জনকে
                দেয়। প্রতিটা LAN এর আসল কাজের যন্ত্র, সেই পিয়ন।
              </ListItem>
              <ListItem>
                Router দুইটা আলাদা Network জোড়ে, আপনার LAN কে বাইরের WAN এর
                সাথে। Lesson 01 এর সেই এক দরজা।
              </ListItem>
              <ListItem>
                এক লাইনে: ভেতরে জোড়া Switch, বাইরে জোড়া Router। এই দুইটা গেঁথে
                নিলেই চলবে।
              </ListItem>
              <ListItem>
                বাসার Router আসলে তিন যন্ত্র এক বাক্সে, Switch, Wi-Fi Access
                Point, আর আসল Router। এই কারণেই শব্দটা নিয়ে এত বিভ্রান্তি।
              </ListItem>
              <ListItem>
                Datacenter এ Rack এর ভেতরে Switch, গেটে Router, Hub কোথাও নেই।
                Cloud এ এগুলো লুকানো, নাম বদলে VPC আর Internet Gateway।
              </ListItem>
              <ListItem>
                পরের লেসন: Switch যে টেবিলে মনে রাখে কে কোন তারে, সেই টেবিলের
                চাবি, প্রতিটা Network Card এর নিজস্ব ঠিকানা, MAC Address।
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
        <span className="font-bold text-primary">Hub</span>,
        "বোকা, সবাইকে কপি করে দেয়, আজ অচল",
      ],
      [
        <span className="font-bold text-primary">Switch</span>,
        "চালাক, টেবিল মনে রেখে শুধু ঠিক জনকে দেয়",
      ],
      [
        <span className="font-bold text-primary">Router</span>,
        "দুইটা আলাদা Network জোড়ে, LAN থেকে WAN",
      ],
      [
        <span className="font-bold text-primary">LAN Port</span>,
        "বাক্সের তারের গর্ত, আসলে Switch অংশ",
      ],
      [
        <span className="font-bold text-primary">Access Point</span>,
        "Wi-Fi অংশ, বেতার যন্ত্র জোড়ে",
      ],
      [
        <span className="font-bold text-primary">বাসার Router</span>,
        "আসলে তিন যন্ত্র এক বাক্সে",
      ],
      [
        <span className="font-bold text-primary">ভেতরে বনাম বাইরে</span>,
        "Switch ভেতরের যন্ত্র, Router সীমানা",
      ],
      [
        <span className="font-bold text-primary">Cloud এ</span>,
        "Switch মানে VPC, Router মানে Internet Gateway",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "A একটা চিঠি পাঠাল শুধু B এর জন্য। একটা Hub এ কে কে পায়?",
        options: [
          {
            key: "A",
            text: "শুধু B",
            isCorrect: false,
            explanation:
              "শুধু B পায় Switch এ। Hub মনে রাখে না কে কোথায়, তাই সবাইকে কপি করে।",
          },
          {
            key: "B",
            text: "B, C, D সবাই, কারণ Hub মনে রাখে না কে কোথায়",
            isCorrect: true,
            explanation:
              "এই অকারণ ভিড় আর গোপন কথা সবার শোনা, এই কারণেই Hub আজ অচল।",
          },
          {
            key: "C",
            text: "কেউ না, Hub চিঠি ফেলে দেয়",
            isCorrect: false,
            explanation:
              "Hub চিঠি ফেলে না, বরং উল্টো, সে সবাইকে দেয়। সমস্যা সেটাই।",
          },
        ],
      },
      {
        id: 2,
        text: "একই LAN এর ভেতরে দশটা যন্ত্র জোড়া লাগাতে, আর প্রত্যেককে শুধু তার চিঠি দিতে, কোন যন্ত্র?",
        options: [
          {
            key: "A",
            text: "Router",
            isCorrect: false,
            explanation:
              "Router দুইটা আলাদা Network জোড়ে, এক LAN এর ভেতরের কাজ নয়। ভেতরের কাজ Switch এর।",
          },
          {
            key: "B",
            text: "Switch",
            isCorrect: true,
            explanation:
              "একই LAN এর ভেতরে যন্ত্র জোড়া আর ঠিক জনকে চিঠি, এটাই Switch, সেই পিয়ন।",
          },
          {
            key: "C",
            text: "Hub",
            isCorrect: false,
            explanation:
              "Hub পারত, কিন্তু সবাইকে কপি করে, তাই ধীর আর অনিরাপদ। আজ Switch ই ব্যবহার হয়।",
          },
        ],
      },
      {
        id: 3,
        text: "আপনার বাসার LAN কে বাইরের Internet এর সাথে জোড়ে কোন অংশ?",
        options: [
          {
            key: "A",
            text: "Switch অংশ",
            isCorrect: false,
            explanation:
              "Switch শুধু ভেতরের যন্ত্র জোড়ে, বাইরে পার হতে পারে না। বাইরে জোড়ে Router অংশ।",
          },
          {
            key: "B",
            text: "Router অংশ, দুইটা Network এর সীমানা",
            isCorrect: true,
            explanation:
              "LAN থেকে WAN, দুইটা আলাদা Network জোড়া, এটাই Router এর কাজ, সেই এক দরজা।",
          },
          {
            key: "C",
            text: "Wi-Fi Access Point",
            isCorrect: false,
            explanation:
              "Access Point বেতার যন্ত্র জোড়ে, কিন্তু সেটাও ভেতরের কাজ। বাইরে জোড়ে Router।",
          },
        ],
      },
      {
        id: 4,
        text: "বাসার এক বাক্সকে Router বলি, অথচ সেটা ভেতরের যন্ত্রও জোড়ে। কীভাবে?",
        options: [
          {
            key: "A",
            text: "বাক্সটা আসলে একটা Switch, Router নয়",
            isCorrect: false,
            explanation:
              "একটা যন্ত্র নয়, তিনটা একসাথে। শুধু Switch বললেও ভুল হবে।",
          },
          {
            key: "B",
            text: "বাক্সটা তিন যন্ত্র একসাথে, Switch, Wi-Fi AP, আর আসল Router",
            isCorrect: true,
            explanation:
              "সবচেয়ে গুরুত্বপূর্ণ অংশ Router বলে পুরো বাক্সের নাম Router হয়ে গেছে। ভেতরে তিন কাজ চলছে।",
          },
          {
            key: "C",
            text: "বাসার Router বাইরে জোড়ে না, শুধু ভেতরে",
            isCorrect: false,
            explanation:
              "উল্টো, সে বাইরেও জোড়ে ভেতরেও জোড়ে, কারণ তিন যন্ত্র এক বাক্সে।",
          },
        ],
      },
      {
        id: 5,
        text: "দুই শহরের দুইটা আলাদা অফিস LAN কে যুক্ত করতে হবে। কোন যন্ত্র?",
        options: [
          {
            key: "A",
            text: "একটা বড় Switch",
            isCorrect: false,
            explanation:
              "Switch শুধু এক LAN এর ভেতরে কাজ করে, Network পার হতে পারে না। আলাদা LAN জোড়া Router এর কাজ।",
          },
          {
            key: "B",
            text: "Router, কারণ দুইটা আলাদা Network জোড়া লাগছে",
            isCorrect: true,
            explanation:
              "আলাদা Network, এমনকি আলাদা শহর, এটাই Router এর কাজ। ভেতরে Switch, সীমানায় Router।",
          },
          {
            key: "C",
            text: "দুইটা Hub পাশাপাশি",
            isCorrect: false,
            explanation:
              "Hub মনে রাখে না, Network ও পার হয় না। আলাদা Network জোড়া সবসময় Router।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "আপনার নিজের বাক্স আর LAN দেখুন",
    subtitle: "বাসার Router আর Terminal, পাঁচটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "বাক্সের তিন অংশ চিনুন",
        description:
          "বাসার Router এর পেছনটা দেখুন। তারের গর্তগুলো (Switch), আলাদা রঙের WAN গর্ত (Router এর দরজা), আর গায়ে Wi-Fi এর নাম (Access Point)।",
      },
      {
        title: "আপনার Gateway ই আসল Router",
        description:
          "Terminal এ Gateway এর ঠিকানা বের করুন। ওই ঠিকানাটাই বাক্সের Router অংশ, LAN এর দরজা।",
      },
      {
        title: "LAN এর বাসিন্দা, Switch যাদের জোড়ে",
        description:
          "arp টেবিলে আপনার LAN এর যন্ত্রগুলো দেখুন। এরা সবাই একই Switch এ জোড়া, একই ভেতরের দুনিয়ায়।",
      },
      {
        title: "ভেতরে এক Hop, বাইরে অনেক",
        description:
          "নিজের Gateway তে traceroute করুন, তারপর একটা বাইরের সার্ভারে। ভেতরে এক ধাপ, বাইরে অনেক Router।",
      },
      {
        title: "Router এর Admin পাতা",
        description:
          "Browser এ Gateway এর ঠিকানা লিখে Router এর Admin পাতায় ঢুকুন, দেখুন সেখানে LAN আর WAN আলাদা করে দেখানো।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-know-your-box.md",
        language: "markdown",
        code: `# বাসার Router এর পেছনটা একবার ভালো করে দেখুন

খুঁজে বের করুন:

  তারের গর্ত, কয়েকটা একই রঙের      → এগুলো LAN Ports, মানে Switch অংশ
                                       এখানে PC, TV তারে জোড়া লাগে

  একটা আলাদা রঙের গর্ত (WAN/Internet) → এটা Router অংশের বাইরের দরজা
                                       এখানে ISP এর তার ঢোকে

  গায়ে লেখা Wi-Fi এর নাম (SSID)      → এটা Access Point অংশ
                                       বেতার যন্ত্র এখানে জোড়ে

তিনটা অংশ, এক বাক্স। এই এক নজরেই এই লেসনের পুরো ছবি।`,
      },
      {
        filename: "2-your-router-address.sh",
        language: "bash",
        code: `# আপনার Gateway, মানে বাক্সের Router অংশের ঠিকানা
netstat -nr | grep default      # macOS
ip route | grep default         # Linux
# সাধারণত 192.168.0.1 বা 192.168.1.1

# এই ঠিকানাটাই আপনার LAN এর দরজা, আর বাক্সের Router অংশ।
# আপনার LAN এর প্রতিটা যন্ত্র বাইরে যেতে এই ঠিকানায় চিঠি দেয়।
# এই এক ঠিকানা Lesson 01 এর "এক দরজা", আর Lesson 08 এর Default Gateway।`,
      },
      {
        filename: "3-lan-neighbours.sh",
        language: "bash",
        code: `# আপনার LAN এর যন্ত্রগুলো, যাদের Switch অংশ জোড়ে
arp -a
# প্রতিটা লাইন আপনার LAN এর একটা যন্ত্র।
# এরা সবাই একই Switch এ জোড়া, একই ভেতরের দুনিয়ায়।

# খেয়াল করুন, প্রতিটা লাইনে একটা অদ্ভুত ঠিকানা আছে,
# যেমন a4:83:e7:2b:11:0c। এটাই MAC Address,
# Switch এর টেবিলের চাবি, আর পরের লেসনের বিষয়।`,
      },
      {
        filename: "4-inside-one-outside-many.sh",
        language: "bash",
        code: `# ভেতরের দুনিয়া, নিজের Gateway তে
traceroute -q 1 192.168.0.1     # আপনার Gateway এর সংখ্যা বসান
# মাত্র একটা লাইন। LAN এর ভেতরে, এক Switch পার হয়েই পৌঁছাল।

# বাইরের দুনিয়া, দূরের সার্ভারে
traceroute -q 1 google.com
# অনেক লাইন। প্রতিটা লাইন একটা Router, প্রত্যেকে দুইটা Network জোড়ে।

# ভেতরে এক ধাপ (Switch), বাইরে অনেক ধাপ (Router)।
# এই তফাতটাই দুইটা যন্ত্রের কাজের তফাত, নিজের চোখে।`,
      },
      {
        filename: "5-admin-page.md",
        language: "markdown",
        code: `# Router এর Admin পাতায় ঢুকুন (সাবধানে, কিছু বদলাবেন না)

১. Browser এ Gateway এর ঠিকানা লিখুন, যেমন http://192.168.0.1
২. Login লাগতে পারে, বাক্সের গায়ে বা ম্যানুয়ালে ডিফল্ট পাসওয়ার্ড থাকে
৩. ভেতরে খুঁজুন এই শব্দগুলো:

   LAN Settings      → ভেতরের দুনিয়া, Switch অংশ যা জোড়ে
   WAN Settings      → বাইরের দরজা, Router অংশের ISP সংযোগ
   Connected Devices → আপনার LAN এর সব বাসিন্দা এক তালিকায়
   Wireless / Wi-Fi  → Access Point অংশের সেটিং

এই চারটা মেনু আসলে এই লেসনের তিন যন্ত্র, পর্দায় সাজানো।
শুধু দেখুন, কিছু বদলাবেন না, কারণ ভুল সেটিং এ Internet বন্ধ হতে পারে।`,
      },
    ],
    tip: "চার নম্বর পরীক্ষাটা সবচেয়ে পরিষ্কারভাবে দুইটা যন্ত্রের তফাত দেখায়। নিজের Gateway তে traceroute দিলে মাত্র এক লাইন, কারণ সেটা LAN এর ভেতরে, এক Switch পার হয়েই শেষ। কিন্তু বাইরের সার্ভারে দিলে অনেক লাইন, প্রতিটা একটা Router, কারণ প্রতিবার একটা Network থেকে আরেকটায় যেতে হচ্ছে। এই এক পরীক্ষায় আপনি চোখে দেখবেন ভেতরের কাজ কত ছোট আর বাইরের যাত্রা কত লম্বা, আর কেন ভেতরের জন্য Switch যথেষ্ট কিন্তু বাইরের জন্য Router লাগে।",
  },
  assignment: {
    title: "Mini Project: আপনার বাক্সের ময়নাতদন্ত",
    time: "১ ঘণ্টা",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>বাক্সের তিন অংশ:</strong> বাসার Router এর একটা ছবি তুলুন বা এঁকে
        ফেলুন। তার উপরে তিনটা অংশ চিহ্নিত করুন: LAN Ports (Switch), WAN Port
        (Router), আর Wi-Fi (Access Point)। প্রতিটার পাশে এক লাইনে লিখুন সে কী
        জোড়ে।
      </span>,
      <span key="2">
        <strong>ভেতরে এক, বাইরে অনেক:</strong> Lab এর চার নম্বর দুইটা traceroute
        চালিয়ে লাইন সংখ্যা লিখুন। ভেতরের কত, বাইরের কত? এই তফাত থেকে Switch আর
        Router এর কাজের তফাত এক লাইনে লিখুন।
      </span>,
      <span key="3">
        <strong>my-tours এর যন্ত্র ভাবুন:</strong> আপনার my-tours যখন একদিন
        সত্যিকারের সার্ভারে থাকবে, তখন কোন কথাগুলো Switch এর মধ্য দিয়ে যাবে
        (ভেতরে) আর কোনগুলো Router পার হবে (বাইরে)? অন্তত তিনটা করে লিখুন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু বললেন, Switch
        আর Router তো একই জিনিস, দুইটাই তো চিঠি এদিক ওদিক পাঠায়। তাঁকে তফাতটা
        বোঝান, পিয়ন আর Post Office এর গাড়ির উদাহরণ ব্যবহার করতে পারেন।
      </span>,
    ],
    deliverables: [
      <span key="1">বাক্সের ছবি, তিন অংশ চিহ্নিত</span>,
      <span key="2">ভেতরের আর বাইরের traceroute লাইন সংখ্যা, আর তফাত</span>,
      <span key="3">my-tours এর Switch আর Router এর কথার ভাগ</span>,
      <span key="4">Switch বনাম Router নিয়ে ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
