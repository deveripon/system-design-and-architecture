/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  LayerDebugLab,
  LayerExplorerLab,
  WhichLayerLab,
} from "../../../components/course/topics/tcp/osi-animations";
import {
  DeviceLayerDiagram,
  LbLayerSplit,
  OsiStackDiagram,
  PeerTalkDiagram,
  WhyLayersSplit,
  WrapPreviewDiagram,
} from "../../../components/course/topics/tcp/osi-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const osiModelContent: TopicData = {
  id: "osi-model",
  introduction: {
    badge: "MODULE 05 · LESSON 01",
    title: <SectionTitle>সাত তলার একটা মানচিত্র</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আপনি এতদিনে অনেক কিছু আলাদা আলাদা করে শিখেছেন। MAC Address, IP
          Address, Port, Router, Switch, NAT, DNS। প্রতিটা নিজের লেসনে পরিষ্কার
          ছিল। কিন্তু একটা প্রশ্ন হয়তো মনে খচখচ করছে। একটা Request এর গায়ে MAC
          ও লাগে, IP ও লাগে, Port ও লাগে, তিনটাই কেন? কোনটা কার কাজে লাগে? আর
          এরা একে অপরের সাথে ঠিক কীভাবে জোড়া লাগে?
        </ContentParagraph>
        <ContentParagraph>
          তারপর আছে সেই কথাগুলো, যা কাজের জায়গায় প্রতিদিন শোনা যায় কিন্তু কেউ
          বুঝিয়ে বলে না। Cloud এর Dashboard জিজ্ঞেস করছে Layer 4 Load Balancer
          চান নাকি Layer 7। সহকর্মী বলছেন এটা Layer 3 এর সমস্যা, App এর নয়।
          Cloudflare লিখেছে তারা L7 আক্রমণ ঠেকায়। এই সংখ্যাগুলো আসে কোথা থেকে?
        </ContentParagraph>
        <ContentParagraph>
          সব প্রশ্নের উত্তর একটাই ছবিতে, যার নাম OSI Model। এটা নতুন কোনো
          প্রযুক্তি নয়, এটা একটা মানচিত্র। আপনি যা যা শিখেছেন তার প্রতিটাকে এই
          মানচিত্রে একটা করে তলায় বসানো যায়, আর বসানোর পর হঠাৎ দেখা যায় কে কার
          উপর দাঁড়িয়ে আছে। এই লেসন শেষে আপনি সাতটা তলার প্রতিটার কাজ নিজের
          ভাষায় বলতে পারবেন, যেকোনো যন্ত্র বা Error শুনে বলতে পারবেন সেটা কোন
          তলার, আর সাইট না খুললে নিচ থেকে উপরে এক তলা এক তলা করে পরীক্ষা করে
          সমস্যাটা ঠিক কোথায় তা বের করতে পারবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "একটা চিঠি লিখতে আপনাকে জানতে হয় না ডাকঘরের গাড়ি কোন রাস্তায় যাবে। গাড়িচালককে জানতে হয় না চিঠিতে কী লেখা। প্রত্যেকে শুধু নিজের কাজটুকু জানে, আর এই কারণেই চিঠিটা পৌঁছায়।",
      author: "OSI Model",
      role: "Lesson 01",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-layers",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা কাজ এত বড় যে একজনে পারে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা সহজ দৃশ্য দিয়ে শুরু করি। ঢাকার এক পর্যটক ফোনে Island Tours
                খুলে একটা নৌকার আসন বুক করলেন। পর্দায় একটা বোতামে চাপ, ব্যস। এখন
                ভাবুন, এই একটা চাপকে হাজার কিলোমিটার দূরের একটা Server পর্যন্ত
                পৌঁছাতে কতগুলো আলাদা সমস্যার সমাধান করতে হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  বুকিং এর তথ্যটা এমন একটা আকারে সাজাতে হবে যা Server বোঝে।
                </ListItem>
                <ListItem>
                  পথে যেন কেউ পড়তে না পারে, তাই তথ্যে তালা মারতে হবে।
                </ListItem>
                <ListItem>
                  বড় তথ্য ছোট টুকরোয় ভাগ করতে হবে, কোনো টুকরো হারালে আবার পাঠাতে
                  হবে, আর ওপাশে ক্রম ঠিক রেখে জোড়া লাগাতে হবে।
                </ListItem>
                <ListItem>
                  Server এ অনেক Program চলছে, তার মধ্যে ঠিক যেটা বুকিং নেয় সেটার
                  হাতে পৌঁছাতে হবে।
                </ListItem>
                <ListItem>
                  পৃথিবীর লক্ষ লক্ষ Network এর ভেতর দিয়ে Server এর Network পর্যন্ত
                  একটা পথ খুঁজতে হবে।
                </ListItem>
                <ListItem>
                  প্রতিটা ধাপে ঠিক পাশের যন্ত্রটাকে, মানে প্রথমে বাসার Router কে,
                  খুঁজে তার হাতে দিতে হবে।
                </ListItem>
                <ListItem>
                  আর সবশেষে 0 আর 1 গুলোকে Wi-Fi এর তরঙ্গ, তারের বিদ্যুৎ বা Fiber
                  এর আলো বানিয়ে সত্যি সত্যি ছাড়তে হবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সাতটা সমস্যা, আর প্রতিটা নিজেই একটা বিশাল বিষয়। এখন কল্পনা করুন
                Island Tours এর Programmer কে এই সাতটাই নিজে লিখতে হচ্ছে। তিনি
                বুকিং এর Form বানাতে বসেছেন, অথচ তাঁকে জানতে হচ্ছে Wi-Fi এর তরঙ্গ
                কোন কম্পাঙ্কে কাঁপে। আর যেদিন পর্যটক Wi-Fi ছেড়ে Mobile Data
                ধরবেন, সেদিন পুরো App টা অচল, কারণ তরঙ্গ ছাড়ার নিয়মটাই বদলে
                গেছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhyLayersSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মানুষ এই ধরনের সমস্যা হাজার বছর ধরে একই উপায়ে সমাধান করে এসেছে,
                কাজ ভাগ করে। একটা কুরিয়ার কোম্পানির কথা ভাবুন। আপনি একটা চিঠি
                লেখেন। কাউন্টারের কর্মী সেটা খামে ভরে ঠিকানা লেখেন। বাছাই ঘরের
                কর্মী ঠিকানা দেখে ঠিক করেন কোন শহরের বস্তায় যাবে। গাড়িচালক বস্তা
                নিয়ে পরের শহরে যান। আর রাস্তাটা শুধু গাড়িকে চলতে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                এখানে সুন্দর ব্যাপারটা হলো, কেউ কারো কাজ জানে না, জানার দরকারও
                নেই। আপনি জানেন না চিঠি কোন রাস্তায় যাবে। গাড়িচালক জানেন না
                চিঠিতে কী লেখা। রাস্তা জানে না গাড়িতে কী আছে। তবু চিঠিটা
                পৌঁছায়। আর কোম্পানি যদি কাল গাড়ির বদলে বিমানে পাঠানো শুরু করে,
                আপনার চিঠি লেখার নিয়ম একটুও বদলায় না।
              </ContentParagraph>
              <ContentParagraph>
                Network ঠিক এভাবেই বানানো। পুরো কাজটা কয়েকটা তলায় ভাগ করা, আর
                প্রতিটা তলাকে বলা হয় একটা <strong>Layer</strong>। প্রতিটা Layer
                একটাই কাজ করে, আর সেই কাজের একটা লিখিত নিয়ম থাকে যাকে বলে{" "}
                <strong>Protocol</strong>। Protocol মানে দুই পক্ষের মধ্যে আগে
                থেকে ঠিক করা কথা বলার নিয়ম, যেমন ফোনে আগে হ্যালো বলা। Module 02
                তে Internet এর প্রথম লেসনে এই শব্দটা আপনি প্রথম শুনেছিলেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Layer মানে একটা কাজ, যা সে নিচের তলার ভরসায় করে",
          content: (
            <p>
              পুরো লেসনটা এই এক বাক্যের বিস্তার। প্রতিটা Layer একটাই প্রশ্নের
              উত্তর দেয়, যেমন কোন Program, কোন যন্ত্র, কোন পথ। নিজের উত্তরটুকু
              দিয়ে বাকি কাজ সে নিচের তলার হাতে তুলে দেয়, আর ধরে নেয় নিচের তলা
              সেটা পারবে। এই ভরসার কারণেই Island Tours এর Programmer শুধু বুকিং
              নিয়ে ভাবতে পারেন, আর Wi-Fi এর Engineer শুধু তরঙ্গ নিয়ে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "contract",
      subHeader: { index: "002", title: "The Contract" },
      title: <SectionTitle>তলাগুলোর মধ্যে তিনটা নিয়ম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কাজ ভাগ করলেই হয় না, ভাগগুলো একসাথে চলার জন্য কয়েকটা নিয়ম লাগে।
                Network এর Layer গুলো তিনটা নিয়ম মেনে চলে। এই তিনটা বুঝলে সাতটা
                তলা মুখস্থ করার দরকার পড়ে না, কারণ প্রতিটা তলা একই নিয়মে চলে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>নিয়ম এক, প্রতিটা তলা শুধু ঠিক নিচের তলার সেবা নেয়।</strong>{" "}
                  কুরিয়ারের কাউন্টার কর্মী চিঠিটা বাছাই ঘরে দেন, সোজা গাড়িচালকের
                  হাতে নয়। তেমনি আপনার Program তথ্যটা দেয় Transport Layer কে,
                  সরাসরি Wi-Fi কে নয়। তলা টপকানো হয় না।
                </ListItem>
                <ListItem>
                  <strong>নিয়ম দুই, প্রতিটা তলা ওপাশের একই তলার সাথে কথা বলে।</strong>{" "}
                  আপনার চিঠি পড়েন প্রাপক, মাঝের কেউ নয়। তেমনি ফোনের Browser এর
                  পাঠানো HTTP Request বোঝে Server এর Web Program, আর ফোনের TCP এর
                  কথা বোঝে Server এর TCP। এক তলার ভাষা অন্য তলা পড়ার চেষ্টাও করে
                  না।
                </ListItem>
                <ListItem>
                  <strong>নিয়ম তিন, উপরের তলার জিনিস নিচের তলার কাছে শুধু একটা বাক্স।</strong>{" "}
                  গাড়িচালক বস্তা খুলে চিঠি পড়েন না। তেমনি IP জানে না সে যে তথ্য
                  বইছে সেটা একটা বুকিং, একটা ছবি নাকি একটা Email। তার কাছে সবই
                  কিছু Byte, যা একটা ঠিকানায় পৌঁছে দিতে হবে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PeerTalkDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির দুই রকম রেখা একসাথে মাথায় রাখাটা প্রথমে একটু অদ্ভুত লাগে,
                তাই একটা চেনা উদাহরণ দিই। দুই দেশের দুই প্রধানমন্ত্রী চিঠিতে কথা
                বলছেন। দুজনের মনে হয় তাঁরা একে অপরের সাথেই কথা বলছেন, আর কথার
                বিষয়টা শুধু তাঁরা দুজনই বোঝেন। কিন্তু চিঠিটা আসলে যায় সচিবের
                হাতে, সচিব থেকে অনুবাদক, অনুবাদক থেকে ডাক বিভাগ, তারপর বিমানে
                ওপাশের ডাক বিভাগ, অনুবাদক, সচিব হয়ে ওপাশের প্রধানমন্ত্রী।
                আনুভূমিক আলাপটা ধারণা, উপর নিচের যাত্রাটা বাস্তব। দুইটাই সত্যি।
              </ContentParagraph>
              <ContentParagraph>
                এবার নামটার কথা। ১৯৭০ এর দশকে প্রতিটা কম্পিউটার কোম্পানির নিজস্ব
                Network ব্যবস্থা ছিল, আর এক কোম্পানির যন্ত্র আরেক কোম্পানির
                যন্ত্রের সাথে কথা বলতে পারত না। এই জট খুলতে আন্তর্জাতিক মান
                সংস্থা ISO একটা সাধারণ নকশা বানায়, যা ১৯৮৪ সালে প্রকাশিত হয়।
                তার নাম <strong>OSI Model</strong>, পুরো নাম Open Systems
                Interconnection। Open Systems মানে যেকোনো কোম্পানির যন্ত্র,
                Interconnection মানে একে অপরের সাথে জোড়া লাগা। নকশাটা পুরো কাজকে
                সাতটা Layer এ ভাগ করে আর বলে দেয় কোন তলার দায়িত্ব কী।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "OSI একটা মানচিত্র, রাস্তা নয়",
          content: (
            <p>
              শুরুতেই একটা কথা পরিষ্কার থাকা ভালো, নইলে পরে ধাক্কা লাগে। আজকের
              Internet OSI Model দিয়ে বানানো নয়। Internet চলে TCP/IP নামের
              আরেকটা ব্যবস্থায়, যাতে তলা সাতটা নয়, চারটা, আর সেটাই পরের লেসনের
              বিষয়। তাহলে OSI শিখছেন কেন? কারণ পৃথিবীর সব Network এর মানুষ কথা
              বলে OSI এর সংখ্যায়। Layer 2 Switch, Layer 4 Load Balancer, Layer 7
              Firewall, এই সংখ্যাগুলো সব OSI এর। মানচিত্র রাস্তা নয়, কিন্তু
              মানচিত্র ছাড়া কাউকে পথ বোঝানো যায় না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "seven-layers",
      subHeader: { index: "003", title: "Seven Layers" },
      title: <SectionTitle>সাতটা তলা, এক নজরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার পুরো মানচিত্রটা একবার দেখে নিই। প্রতিটা তলা আলাদা করে খুলব
              একটু পরে, এখন শুধু সাজানোটা চোখে বসান। সংখ্যা গোনা হয় নিচ থেকে,
              তাই Layer 1 সবচেয়ে নিচে, যন্ত্রাংশের কাছে, আর Layer 7 সবচেয়ে উপরে,
              মানুষের কাছে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OsiStackDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছকে একটা নতুন শব্দ আছে, টুকরোর নাম। Module 02 তে শিখেছিলেন বড়
                তথ্য ছোট টুকরোয় ভাগ হয়ে যায়, আর তখন সব টুকরোকেই Packet বলা
                হয়েছিল। সেটা কথ্য ভাষা, আর ভুলও নয়। কিন্তু নিখুঁত ভাষায় প্রতিটা
                তলা নিজের টুকরোকে একটা আলাদা নামে ডাকে। Layer 4 এ Segment, Layer
                3 এ Packet, Layer 2 এ Frame, Layer 1 এ Bit। এই নামগুলোর সাধারণ
                নাম <strong>PDU</strong>, মানে Protocol Data Unit, সোজা কথায় ওই
                তলার একটা টুকরো। নামগুলো এখন শুধু চিনে রাখুন, কোন নামের ভেতরে কী
                থাকে তা নিয়ে এই Module এর ছয় নম্বর লেসন পুরোটাই।
              </ContentParagraph>
              <ContentParagraph>
                সাতটা নাম ক্রমে মনে রাখার জন্য ইংরেজিতে দুইটা চালু বাক্য আছে,
                যাদের প্রতিটা শব্দের প্রথম অক্ষর একটা তলার প্রথম অক্ষর। নিচ থেকে
                উপরে, <strong>P</strong>lease <strong>D</strong>o{" "}
                <strong>N</strong>ot <strong>T</strong>hrow <strong>S</strong>
                ausage <strong>P</strong>izza <strong>A</strong>way, মানে
                Physical, Data Link, Network, Transport, Session, Presentation,
                Application। উপর থেকে নিচে, <strong>A</strong>ll{" "}
                <strong>P</strong>eople <strong>S</strong>eem <strong>T</strong>o{" "}
                <strong>N</strong>eed <strong>D</strong>ata <strong>P</strong>
                rocessing। তবে মুখস্থের চেয়ে ভালো উপায় হলো প্রতিটা তলার কাজটা
                বোঝা, তখন ক্রমটা নিজে থেকেই মনে থাকে, কারণ এই ক্রম ছাড়া আর কোনো
                ক্রমে কাজটা হয় না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ যেকোনো তলায় চাপ দিয়ে তার সব কথা একসাথে দেখুন। শুরু
                করুন Layer 4 দিয়ে, কারণ এই পুরো Module এর নায়ক সে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LayerExplorerLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সাতটা তলাকে তিন ভাগে ভাবলে সহজ হয়",
          content: (
            <p>
              নিচের দুই তলা, Layer 1 আর 2, একটা Network এর ভেতরের ব্যাপার, মানে
              আপনার ঘরের ভেতরে ফোন থেকে Router পর্যন্ত। মাঝের দুই তলা, Layer 3
              আর 4, পুরো পথের ব্যাপার, মানে আপনার যন্ত্র থেকে পৃথিবীর ওপাশের
              যন্ত্রের ঠিক Program পর্যন্ত। আর উপরের তিন তলা, Layer 5, 6 আর 7,
              শুধু দুই প্রান্তের Program এর ব্যাপার, মাঝপথের কোনো যন্ত্র এগুলো
              নিয়ে মাথা ঘামায় না। একজন DevOps Engineer এর দিনের বেশিরভাগ সমস্যা
              পড়ে Layer 3, 4 আর 7 এ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "layer-1",
      subHeader: { index: "004", title: "Layer 1" },
      title: <SectionTitle>Physical: রাস্তাটা নিজে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে নিচ থেকে শুরু করি, কারণ এর উপরেই বাকি সব দাঁড়িয়ে। Module
                01 এ শিখেছিলেন কম্পিউটারের ভেতরে সব তথ্য শেষ পর্যন্ত 0 আর 1,
                যাদের বলে Bit। কিন্তু একটা 0 বা 1 তো কোনো জিনিস নয় যে তার দিয়ে
                গড়িয়ে যাবে। তাকে এমন কিছুতে বদলাতে হয় যা সত্যিই এক জায়গা থেকে
                আরেক জায়গায় যেতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Physical Layer</strong> এর কাজ ঠিক এটুকুই। Bit কে একটা
                সংকেত বানিয়ে ছাড়া, আর ওপাশে সেই সংকেত থেকে আবার Bit বের করা।
                সংকেতটা তিন রকমের হয়। তামার তারে বিদ্যুতের ওঠানামা, Fiber Optic
                তারে আলোর জ্বলা নেভা, আর Wi-Fi বা Mobile Network এ বাতাসে Radio
                তরঙ্গ। Module 02 তে যে সমুদ্রের তলার Cable দেখেছিলেন, সেটা এই
                তলারই জিনিস।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এই তলার টুকরো:</strong> Bit। এখানে কোনো গঠন নেই, শুধু
                  0 আর 1 এর একটা স্রোত।
                </ListItem>
                <ListItem>
                  <strong>এই তলার ঠিকানা:</strong> নেই। রাস্তা জানে না গাড়ি কার
                  বাড়ি যাবে। তারে যা ছাড়া হয়, তারের ওপাশে ঠিক সেটাই পৌঁছায়।
                </ListItem>
                <ListItem>
                  <strong>এই তলার যন্ত্র:</strong> তার, তারের মাথার Connector,
                  Antenna, আর Hub। Module 03 এ দেখেছিলেন Hub এক তার দিয়ে আসা
                  সংকেত হুবহু বাকি সব তারে ছেড়ে দেয়, কিছু না পড়ে। না পড়ার কারণ
                  এখন পরিষ্কার, সে Layer 1 এর যন্ত্র, পড়ার মতো কিছু সে বোঝেই
                  না।
                </ListItem>
                <ListItem>
                  <strong>এই তলা যা ঠিক করে:</strong> তারের ভেতরে কয়টা সুতা, কত
                  Volt কে 1 ধরা হবে, Wi-Fi কোন কম্পাঙ্কে চলবে, এক সেকেন্ডে কত
                  Bit যাবে। Module 02 তে শেখা Bandwidth এর ছাদটা এই তলাই বেঁধে
                  দেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই তলা ভাঙলে কী দেখবেন? তার খোলা, Wi-Fi বন্ধ, Router এর বাতি
                নেভা, ফোনে Signal এর দাগ একটা। আর লক্ষণটা হলো, কিছুই কাজ করে না,
                কোনো সাইট নয়, এমনকি নিজের Router ও নয়। হাস্যকর শোনালেও বড়
                কোম্পানিতেও বহু ঘণ্টার Debugging শেষ হয় এই আবিষ্কারে যে একটা তার
                ঢিলা ছিল। তাই পরীক্ষা সবসময় এখান থেকে শুরু।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "layer-1.sh",
          code: `# macOS: Wi-Fi এর Interface সাধারণত en0
ifconfig en0
#   en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
#       ether a4:83:e7:12:9c:01
#       inet 192.168.1.20 netmask 0xffffff00 broadcast 192.168.1.255
#       media: autoselect
#       status: active        <-- এই লাইনটাই Layer 1 এর খবর

# Linux এ একই কাজ
ip link show
#   state UP মানে জোড়া আছে, state DOWN মানে নেই

# status: active   মানে তার বা Wi-Fi জোড়া আছে, সংকেত যাচ্ছে আসছে
# status: inactive মানে রাস্তাই নেই, উপরের কোনো পরীক্ষার মানে নেই`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Cloud এ Layer 1 কোথায় গেল",
          content: (
            <p>
              আপনি যখন Cloud এ একটা Server ভাড়া নেন, তার, Connector, Switch এর
              বাতি, এসব আপনি কখনো দেখেন না। তার মানে এই নয় যে Layer 1 নেই। সেটা
              আছে, শুধু অন্য কারো দায়িত্বে, Data Center এর Engineer দের। এই
              কারণে Cloud এ কাজ করা একজন DevOps Engineer এর কাছে Layer 1 আর 2
              প্রায় অদৃশ্য, আর তাঁর দুনিয়া শুরু হয় Layer 3 থেকে। কিন্তু নিজের
              ল্যাপটপ আর অফিসের Network এ এই তলা পুরোপুরি আপনার।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "layer-2",
      subHeader: { index: "005", title: "Layer 2" },
      title: <SectionTitle>Data Link: পাশের যন্ত্র পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Layer 1 আমাদের একটা রাস্তা দিল যাতে Bit চলে। কিন্তু একটা Wi-Fi এ
                তো শুধু দুইটা যন্ত্র থাকে না। বাসার Wi-Fi তে আপনার ফোন, ল্যাপটপ,
                টিভি, সবাই একই বাতাসে কথা বলছে। ফোন যখন কিছু Bit ছাড়ে, সবাই
                সেটা শোনে। তাহলে কে বুঝবে এটা কার জন্য? আর Bit এর স্রোতে কোথায়
                একটা বার্তা শুরু আর কোথায় শেষ?
              </ContentParagraph>
              <ContentParagraph>
                এই দুই প্রশ্নের উত্তর দেয় <strong>Data Link Layer</strong>। সে
                Bit গুলোকে একটা গোছানো প্যাকেটে বাঁধে, যার নাম{" "}
                <strong>Frame</strong>। প্রতিটা Frame এর শুরুতে লেখা থাকে কার
                কাছে যাচ্ছে আর কে পাঠাচ্ছে, আর সেই ঠিকানাটাই হলো Module 03 এ
                শেখা <strong>MAC Address</strong>। Frame এর শেষে থাকে একটা
                যাচাইয়ের সংখ্যা, যা দিয়ে প্রাপক বোঝে পথে কোনো Bit উল্টে গেছে কি
                না। উল্টে গেলে সে Frame টা ফেলে দেয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এই তলার টুকরো:</strong> Frame।
                </ListItem>
                <ListItem>
                  <strong>এই তলার ঠিকানা:</strong> MAC Address, যেমন পর্যটকের
                  ফোনের a4:83:e7:12:9c:01 আর তাঁর Router এর c8:3a:35:4b:10:fe।
                </ListItem>
                <ListItem>
                  <strong>এই তলার যন্ত্র:</strong> Switch, Wi-Fi এর Access Point,
                  আর প্রতিটা যন্ত্রের Network Card। Module 03 এ দেখেছিলেন Switch
                  মনে রাখে কোন MAC কোন তারে, আর Frame শুধু সেই তারেই পাঠায়। সে
                  Frame এর MAC পড়তে পারে বলেই Hub এর চেয়ে বুদ্ধিমান, আর এই পড়তে
                  পারাটাই তাকে Layer 2 এর যন্ত্র বানায়।
                </ListItem>
                <ListItem>
                  <strong>এই তলার Protocol:</strong> তারের জন্য Ethernet, বাতাসের
                  জন্য Wi-Fi, যার কারিগরি নাম 802.11। আর ARP, যা Module 03 এ
                  শিখেছেন, IP থেকে MAC খুঁজে দেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই তলার সবচেয়ে জরুরি সীমাটা মনে রাখুন, কারণ এর উপরেই পরের তলার
                দরকারটা দাঁড়িয়ে। Layer 2 শুধু <strong>একই Network এর ভেতরে</strong>{" "}
                কাজ করে। MAC Address দিয়ে আপনার ফোন বাসার Router পর্যন্ত পৌঁছাতে
                পারে, কিন্তু Router পার হয়ে একটা Frame ও যায় না। Router Frame টা
                খোলে, ভেতরের জিনিস বের করে, তারপর পরের রাস্তার জন্য একদম নতুন
                একটা Frame বানায়, নতুন MAC দিয়ে। তাই Island Tours এর Server কখনো
                পর্যটকের ফোনের MAC জানতে পারে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "layer-2.sh",
          code: `# নিজের MAC Address
ifconfig en0 | grep ether
#       ether a4:83:e7:12:9c:01

# পাশের কোন কোন যন্ত্রের MAC আপনার যন্ত্র এই মুহূর্তে জানে
arp -a
#   ? (192.168.1.1) at c8:3a:35:4b:10:fe on en0 ifscope [ethernet]
#   ? (192.168.1.20) at a4:83:e7:12:9c:01 on en0 ifscope permanent [ethernet]

# Linux এ
ip neigh

# প্রথম লাইনটা আপনার Router। তার IP র পাশে একটা MAC আছে মানে Layer 2 ঠিক।
# MAC এর জায়গায় (incomplete) দেখালে আপনার যন্ত্র জিজ্ঞেস করেছে
# কিন্তু কেউ উত্তর দেয়নি, মানে ওই যন্ত্রটা এই Network এ নেই বা চুপ।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Layer 1 আর 2 প্রায়ই একসাথে আসে",
          content: (
            <p>
              Wi-Fi বা Ethernet আসলে একটা নাম নয়, দুই তলার একটা জোড়া। Wi-Fi এর
              মান একদিকে বলে তরঙ্গ কোন কম্পাঙ্কে কীভাবে কাঁপবে, যা Layer 1, আর
              অন্যদিকে বলে Frame এর গঠন কেমন হবে আর কে কখন কথা বলবে, যা Layer 2।
              আপনার ল্যাপটপের Network Card ও দুই তলার কাজই করে। তাই অনেক সময়
              এই দুইটাকে একসাথে ধরে একটাই তলা বলা হয়, আর TCP/IP Model ঠিক তাই
              করেছে, যা পরের লেসনে দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "layer-3",
      subHeader: { index: "006", title: "Layer 3" },
      title: <SectionTitle>Network: Network থেকে Network এ পথ খোঁজা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Layer 2 আমাদের পাশের যন্ত্র পর্যন্ত পৌঁছে দিল, কিন্তু সেখানেই
                থেমে গেল। অথচ Island Tours এর Server পর্যটকের ঘরে নেই, আছে
                বহুদূরের একটা Data Center এ, মাঝখানে ডজনখানেক আলাদা Network।
                MAC Address দিয়ে এই পথ খোঁজা অসম্ভব, কারণ MAC এ কোনো ভৌগোলিক
                তথ্য নেই। একটা MAC দেখে বলার উপায় নেই যন্ত্রটা পাশের ঘরে নাকি
                পৃথিবীর উল্টো পিঠে।
              </ContentParagraph>
              <ContentParagraph>
                এখানেই দরকার পড়ে আরেক রকম ঠিকানার, যাতে জায়গার তথ্য থাকে। Module
                03 এ শিখেছিলেন <strong>IP Address</strong> এর দুই ভাগ, Network
                অংশ আর Host অংশ, ঠিক যেমন ডাক ঠিকানায় আগে শহর, তারপর বাড়ি। এই
                ভাগের কারণেই পথ খোঁজা সম্ভব হয়, কারণ পথের প্রতিটা মোড় শুধু
                দেখে, এই ঠিকানা কোন Network এর, আর সেদিকে কোন রাস্তা যায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Network Layer</strong> এর কাজ এটাই, এক Network থেকে আরেক
                Network হয়ে তথ্যকে শেষ গন্তব্যের যন্ত্র পর্যন্ত পৌঁছানো। পথের
                প্রতিটা মোড়ে পরের রাস্তা বেছে নেওয়াকে বলে{" "}
                <strong>Routing</strong>, আর এই তলার টুকরোর নাম{" "}
                <strong>Packet</strong>।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এই তলার ঠিকানা:</strong> IP Address। পর্যটকের ফোনের
                  192.168.1.20, তাঁর Router এর বাইরের 203.0.113.25, আর Island
                  Tours এর Server এর 103.94.135.2।
                </ListItem>
                <ListItem>
                  <strong>এই তলার যন্ত্র:</strong> Router। সে Frame খুলে ভেতরের
                  Packet এর গন্তব্য IP পড়ে, নিজের Routing Table মিলিয়ে পরের পথ
                  ঠিক করে। Packet পর্যন্ত খুলে পড়ে বলেই Router Layer 3 এর
                  যন্ত্র। Module 02 তে যাকে ট্রাফিক পুলিশ বলেছিলাম, সে এই তলায়
                  দাঁড়িয়ে।
                </ListItem>
                <ListItem>
                  <strong>এই তলার Protocol:</strong> IP, যার দুই সংস্করণ IPv4 আর
                  IPv6। আর ICMP, যা IP র সহকারী, পথে কিছু ভুল হলে খবর পাঠায়।
                  আপনার চেনা ping আর traceroute দুইটাই ICMP ব্যবহার করে, তাই
                  এরা Layer 3 পরীক্ষার যন্ত্র।
                </ListItem>
                <ListItem>
                  <strong>এই তলায় যা ঘটে:</strong> Module 03 এর Subnet, Gateway
                  আর NAT, সবই এখানকার। ফোন Subnet Mask দিয়ে ঠিক করে গন্তব্য
                  নিজের Network এ নাকি বাইরে, বাইরে হলে Gateway তে পাঠায়, আর
                  Router সীমানায় ভেতরের IP বদলে বাইরের IP বসায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার এই তলার সবচেয়ে জরুরি স্বভাবটা, যা না জানলে পরের তিন লেসন
                বোঝা যাবে না। IP কোনো কথা দেয় না। সে Packet টা পৌঁছানোর চেষ্টা
                করে, কিন্তু পৌঁছাল কি না তা দেখে না। পথে কোনো Router ব্যস্ত
                থাকলে Packet টা ফেলে দিতে পারে, আর IP সেটা কাউকে জানায়ও না। দুইটা
                Packet দুই পথে গিয়ে উল্টো ক্রমে পৌঁছাতে পারে। এই স্বভাবকে বলে{" "}
                <strong>Best Effort</strong>, মানে যতটা পারি চেষ্টা করব, তার
                বেশি কিছু নয়। Module 02 তে পোস্টকার্ডের উদাহরণে ঠিক এটাই
                দেখেছিলেন, একটা হারায়, ক্রম ভাঙে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "layer-3.sh",
          code: `# ধাপ ১: নিজের Router পর্যন্ত (Router এর IP পাবেন: route -n get default)
ping -c 2 192.168.1.1
#   2 packets transmitted, 2 packets received, 0.0% packet loss
#   round-trip min/avg/max/stddev = 2.030/2.396/2.763/0.367 ms

# ধাপ ২: Internet এর একটা চেনা IP পর্যন্ত
ping -c 3 1.1.1.1
#   64 bytes from 1.1.1.1: icmp_seq=2 ttl=58 time=5.786 ms
#   3 packets transmitted, 3 packets received, 0.0% packet loss
#   round-trip min/avg/max/stddev = 3.412/4.356/5.786/1.028 ms

# ধাপ ৩: পথের প্রতিটা Router, মানে প্রতিটা Layer 3 যন্ত্র
traceroute -m 4 -q 1 1.1.1.1
#    1  192.168.1.1    3.205 ms     <-- বাসার Router
#    2  10.105.16.1    3.002 ms     <-- ISP র ভেতরের Router
#    3  172.30.80.1    2.491 ms
#    4  ...

# এখানে নাম নয়, সরাসরি IP ব্যবহার করা হয়েছে ইচ্ছা করে।
# নাম দিলে আগে DNS লাগত, আর তখন বোঝা যেত না দোষ DNS এর নাকি পথের।
# ধাপ ১ ঠিক কিন্তু ধাপ ২ ব্যর্থ হলে সমস্যা Router এর বাইরে, ISP র দিকে।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ping ব্যর্থ মানেই Server বন্ধ নয়",
          content: (
            <p>
              ping একটা Layer 3 এর পরীক্ষা, আর অনেক Server ইচ্ছা করে ICMP এর
              উত্তর দেয় না। Cloud এর Security Group এ ICMP আলাদা করে খুলে না
              দিলে ping এর উত্তর আসে না, অথচ একই Server এ সাইট দিব্যি চলে। তাই
              ping সফল হলে আপনি নিশ্চিত যে Layer 3 পর্যন্ত ঠিক। কিন্তু ping
              ব্যর্থ হলে সেটা প্রমাণ নয়, শুধু একটা ইঙ্গিত। তখন এক তলা উপরে উঠে
              Port এর পরীক্ষাটা করুন, যা একটু পরেই দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "layer-4",
      subHeader: { index: "007", title: "Layer 4" },
      title: <SectionTitle>Transport: ঠিক Program এর দরজায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Layer 3 Packet টাকে ঠিক যন্ত্র পর্যন্ত পৌঁছে দিল। কিন্তু কাজ শেষ
                হয়নি, দুইটা বড় ফাঁক রয়ে গেছে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম ফাঁক, যন্ত্রের ভেতরে কে নেবে? Island Tours এর Server এ
                একসাথে অনেক Program চলছে, Web Server, Database, SSH। IP Address
                শুধু যন্ত্রটাকে চেনে, ভেতরের Program কে নয়। Module 02 তে এর
                সমাধান দেখেছিলেন, যন্ত্রটা একটা বিল্ডিং আর প্রতিটা Program এর
                একটা ফ্ল্যাট নম্বর আছে, যার নাম <strong>Port</strong>।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় ফাঁক, Layer 3 কোনো কথা দেয় না। Packet হারাতে পারে, ক্রম
                ভাঙতে পারে। অথচ একটা বুকিং এর অর্ধেক পৌঁছালে চলবে না, আর টাকার
                অঙ্কের দুই টুকরো উল্টো ক্রমে জোড়া লাগলে সর্বনাশ। কাউকে তো এই
                অনির্ভরযোগ্য রাস্তার উপর একটা নির্ভরযোগ্য ব্যবস্থা বানাতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                এই দুই ফাঁকই ভরাট করে <strong>Transport Layer</strong>। তার কাজ
                হলো এক যন্ত্রের একটা Program থেকে আরেক যন্ত্রের একটা Program
                পর্যন্ত তথ্য পৌঁছানো। এই তলায় দুইজন কর্মী আছে, আর আপনার Program
                বেছে নেয় কাকে দিয়ে কাজ করাবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>TCP</strong>, যত্নশীল কর্মী। সে আগে ওপাশের সাথে একটা
                  সংযোগ বানায়, প্রতিটা টুকরোয় নম্বর দেয়, প্রাপ্তি স্বীকার না এলে
                  আবার পাঠায়, আর ওপাশে ক্রম ঠিক করে সাজায়। Web, Email, Database,
                  SSH, যেখানে একটা Byte ও হারানো চলবে না, সেখানে TCP। তার
                  টুকরোর নাম <strong>Segment</strong>।
                </ListItem>
                <ListItem>
                  <strong>UDP</strong>, দ্রুত কর্মী। সে শুধু Port টা জুড়ে দিয়ে
                  ছেড়ে দেয়, পৌঁছাল কি না দেখে না। Video Call, Game আর DNS এর
                  ছোট প্রশ্নে, যেখানে দেরির চেয়ে একটা টুকরো হারানো ভালো, সেখানে
                  UDP। তার টুকরোর নাম <strong>Datagram</strong>।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই দুইজনকে নিয়েই পরের সাতটা লেসন। TCP কীভাবে কথা রাখে, UDP কেন
                রাখে না আর সেটা কেন কখনো কখনো ভালো, সংযোগ কীভাবে খোলে আর বন্ধ
                হয়, সবই সামনে। আজ শুধু জায়গাটা চিনে রাখুন। এই তলার ঠিকানা Port,
                এই তলার যন্ত্র Firewall, Cloud এর Security Group, NAT আর Layer 4
                Load Balancer, কারণ এরা সবাই IP র সাথে Port দেখে সিদ্ধান্ত নেয়।
                Module 03 এর PAT, যেখানে Router Port দিয়ে ঘরের যন্ত্রগুলো আলাদা
                রাখে, সেটা তাই Layer 4 পর্যন্ত পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "layer-4.sh",
          code: `# nc (netcat) দিয়ে একটা Port এ শুধু TCP সংযোগ খোলার চেষ্টা, কোনো তথ্য পাঠানো ছাড়া
# -v বিস্তারিত দেখায়, -z শুধু সংযোগ পরীক্ষা, -G 3 তিন সেকেন্ড অপেক্ষা (Linux এ -w 3)

# ১. Port খোলা, একটা Program শুনছে
nc -vz -G 3 example.com 443
#   Connection to example.com port 443 [tcp/https] succeeded!

# ২. যন্ত্র আছে, কিন্তু ওই Port এ কেউ শুনছে না
nc -vz -G 3 localhost 9
#   nc: connectx to localhost port 9 (tcp) failed: Connection refused

# ৩. মাঝখানে কেউ Packet চুপচাপ ফেলে দিচ্ছে
nc -vz -G 3 example.com 81
#   nc: connectx to example.com port 81 (tcp) failed: Operation timed out

# তিনটা উত্তর, তিনটা আলাদা গল্প:
#   succeeded  = Layer 4 পর্যন্ত সব ঠিক
#   refused    = যন্ত্র সাথে সাথে বলেছে "এই দরজায় কেউ নেই" (Program বন্ধ)
#   timed out  = কোনো উত্তরই আসেনি (Firewall বা Security Group আটকাচ্ছে)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "refused আর timed out এর তফাতটা আজই মনে গেঁথে নিন",
          content: (
            <p>
              কাজের জীবনে এই দুইটা বার্তা আপনি শত শত বার দেখবেন, Program এর Log
              এ ECONNREFUSED আর ETIMEDOUT নামে। Connection refused মানে দরজায়
              টোকা পড়েছে আর ভেতর থেকে সাথে সাথে উত্তর এসেছে, এখানে কেউ থাকে না।
              উত্তরটা এক মুহূর্তে আসে, আর তার মানে যন্ত্রটা চালু, পথ খোলা, শুধু
              Program টা চলছে না বা অন্য Port এ চলছে। Timed out মানে টোকা দিয়ে
              দাঁড়িয়ে আছেন আর কোনো সাড়াই নেই। তার মানে টোকাটা দরজা পর্যন্ত
              পৌঁছায়ইনি, মাঝপথে একটা Firewall সেটা ফেলে দিয়েছে, অথবা যন্ত্রটাই
              বন্ধ। প্রথমটায় Server এ ঢুকে Program দেখুন, দ্বিতীয়টায় Firewall
              আর Security Group দেখুন। কেন একটায় সাথে সাথে উত্তর আসে আর
              অন্যটায় আসে না, তার ভেতরের কারণ পাবেন Three-way Handshake এর
              লেসনে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "layer-5-6",
      subHeader: { index: "008", title: "Layer 5 & 6" },
      title: <SectionTitle>Session আর Presentation: আলাপ আর তার রূপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Layer 4 পর্যন্ত এসে তথ্য ঠিক Program এর হাতে পৌঁছে গেছে। এর উপরের
                তিন তলা আর Network এর যন্ত্রপাতির ব্যাপার নয়, এরা পুরোপুরি দুই
                প্রান্তের Program এর ভেতরের ব্যাপার। সৎভাবে বলি, এই তিনটার মধ্যে
                Layer 5 আর 6 সবচেয়ে ঝাপসা, আর বাস্তবে এদের আলাদা করে দেখা যায়
                না। তবু কাজ দুইটা সত্যিই আছে, তাই কাজ হিসেবে বুঝে নিন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Session Layer, Layer 5।</strong> ফোনে কথা বলার সময় শুধু
                শব্দ পাঠানোই সব নয়। আলাপটার একটা শুরু আছে, হ্যালো, কে বলছেন।
                একটা শেষ আছে, রাখছি। মাঝে লাইন কেটে গেলে আবার ফোন করে বলেন,
                হ্যাঁ, যেখানে ছিলাম। এই পুরো আলাপটাকে বলে একটা{" "}
                <strong>Session</strong>, আর তার শুরু, চালু রাখা আর শেষ করার
                দায়িত্ব এই তলার। একটা Session এর ভেতরে অনেকগুলো বার্তা আসা যাওয়া
                করতে পারে, আর দুই পক্ষই মনে রাখে তারা একই আলাপের ভেতরে আছে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Presentation Layer, Layer 6।</strong> এই তলার প্রশ্নটা
                হলো, তথ্যটা কোন রূপে যাবে। এখানে তিনটা আলাদা কাজ পড়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Encoding:</strong> অক্ষর, সংখ্যা, ছবিকে Byte এ বদলানোর
                  নিয়ম। Module 01 এ দেখেছিলেন ইংরেজি A একটা Byte, 41, আর বাংলা
                  আ তিনটা Byte, e0 a6 86, UTF-8 নিয়মে। দুই পক্ষ একই নিয়ম না
                  মানলে পর্দায় হিজিবিজি অক্ষর আসে। JSON, JPEG, PNG, এগুলোও
                  তথ্যের রূপ, তাই এই তলার।
                </ListItem>
                <ListItem>
                  <strong>Compression:</strong> পাঠানোর আগে তথ্য ছোট করা, যেমন
                  gzip। Server বলে দেয় সে ছোট করে পাঠিয়েছে, আর Browser খুলে
                  নেয়।
                </ListItem>
                <ListItem>
                  <strong>Encryption:</strong> তথ্যে তালা মারা, যাতে পথের কেউ
                  পড়তে না পারে। HTTPS এর S টা এই কাজই করে, <strong>TLS</strong>{" "}
                  নামের Protocol দিয়ে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                TLS এর নামটা দুই তলাতেই এলো, আর এটা ভুল নয়। TLS শুরুতে দুই পক্ষের
                মধ্যে একটা গোপন চাবি ঠিক করে আর একটা Session খোলে, যা Layer 5 এর
                মতো কাজ। তারপর সেই চাবি দিয়ে প্রতিটা তথ্যে তালা মারে, যা Layer 6
                এর কাজ। তাই কেউ বলেন TLS Layer 5 এ, কেউ বলেন 6 এ, কেউ বলেন দুইটার
                মাঝামাঝি। তিনজনই ঠিক। আপনার যা মনে রাখা দরকার তা হলো, TLS বসে
                Transport এর উপরে আর Application এর নিচে, অর্থাৎ TCP সংযোগ খোলার
                পরে আর HTTP র কথা শুরুর আগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "layer-5-6.sh",
          code: `# Layer 6, Encoding: একই অক্ষর, কয়টা Byte
echo -n "A" | xxd
#   00000000: 41                    A
echo -n "আ" | xxd
#   00000000: e0a6 86               ...

# Layer 6, Compression আর রূপ: Server নিজেই বলে দেয়
curl -sI --compressed https://www.wikipedia.org | grep -i "content-type\\|content-encoding"
#   content-type: text/html
#   content-encoding: gzip

# Layer 6, Encryption: তালাটা কোন সংস্করণের, Certificate ঠিক আছে তো
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | grep -E "Protocol|Verify return"
#   Protocol: TLSv1.3
#   Verify return code: 0 (ok)

# Layer 5, Session: একই আলাপ আবার ধরা যায় কি না
echo | openssl s_client -tls1_2 -reconnect -connect example.com:443 -servername example.com 2>/dev/null \\
  | grep -E "^(New|Reused),"
#   New, TLSv1.2, Cipher is ECDHE-ECDSA-CHACHA20-POLY1305
#   Reused, TLSv1.2, Cipher is ECDHE-ECDSA-CHACHA20-POLY1305
#   Reused, TLSv1.2, Cipher is ECDHE-ECDSA-CHACHA20-POLY1305
# প্রথমবার New, মানে নতুন আলাপ। এরপর Reused, মানে পুরনো আলাপটাই আবার ধরা হয়েছে,
# নতুন করে চাবি ঠিক করতে হয়নি। এটাই Session এর ধারণা।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Layer 5, 6 আর 7 কে একসাথে ভাবা দোষের নয়",
          content: (
            <p>
              বাস্তবের Program এ এই তিন তলার কাজ আলাদা আলাদা টুকরোয় থাকে না।
              আপনার Browser একাই Session রাখে, তথ্যের রূপ ঠিক করে, তালা মারে আর
              HTTP তে কথা বলে। এই কারণে TCP/IP Model এই তিনটাকে একটাই তলা ধরেছে,
              যার নাম Application। আর কাজের জায়গায় মানুষ যখন বলে Layer 7, তারা
              প্রায় সবসময় এই তিনটাকে মিলিয়েই বোঝায়। তাই Layer 5 আর 6 এর নাম আর
              কাজ জানুন, কিন্তু কোনো জিনিস ঠিক 5 এ নাকি 6 এ তা নিয়ে তর্কে সময়
              নষ্ট করবেন না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "layer-7",
      subHeader: { index: "009", title: "Layer 7" },
      title: <SectionTitle>Application: Program যে ভাষায় কথা বলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে উপরের তলায় পৌঁছে গেছি, আর এখানে প্রায় সবাই একটা ভুল করে,
                তাই সেটা দিয়েই শুরু করি। Application Layer মানে আপনার App নয়।
                Chrome, WhatsApp, Island Tours এর App, এরা কেউ Layer 7 নয়। এরা
                Program, যারা Layer 7 <em>ব্যবহার করে</em>।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Application Layer</strong> হলো সেই ভাষা, যাতে দুই
                Program একে অপরের কাছে সেবা চায় আর দেয়। Browser যখন একটা পাতা
                চায়, সে একটা নির্দিষ্ট নিয়মে লেখে, GET /tours, আর Server একটা
                নির্দিষ্ট নিয়মে উত্তর দেয়, 200 OK। এই নিয়মটার নাম HTTP, আর এটাই
                Layer 7 এর Protocol। Chrome বদলে Firefox ব্যবহার করলে Program
                বদলায়, কিন্তু ভাষাটা একই থাকে, আর সেই কারণেই যেকোনো Browser
                যেকোনো Server এর সাথে কথা বলতে পারে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>HTTP আর HTTPS:</strong> Web এর ভাষা। পরের Module
                  পুরোটাই এটা নিয়ে।
                </ListItem>
                <ListItem>
                  <strong>DNS:</strong> নাম থেকে IP জানার ভাষা, যা আপনি Module 04
                  এ পুরোটা শিখেছেন। অনেকে অবাক হন যে DNS Layer 7, কারণ মনে হয়
                  এটা তো Network এর নিচের দিকের জিনিস। কিন্তু DNS আসলে একটা সেবা,
                  যেখানে একটা Program আরেকটা Program কে প্রশ্ন করে আর উত্তর পায়।
                  নিচের তলাগুলো ব্যবহার করে বলেই সে উপরের তলার।
                </ListItem>
                <ListItem>
                  <strong>SMTP, IMAP:</strong> Email পাঠানো আর পড়ার ভাষা। Module
                  04 এ MX Record এর সময় SMTP র নাম শুনেছেন।
                </ListItem>
                <ListItem>
                  <strong>SSH:</strong> দূরের Server এর Terminal এ ঢোকার ভাষা।
                </ListItem>
                <ListItem>
                  <strong>আরও:</strong> FTP, WebSocket, gRPC, Database এর নিজস্ব
                  Protocol, যেমন PostgreSQL এর। আপনার App যখন Database এ প্রশ্ন
                  পাঠায়, সেটাও একটা Layer 7 আলাপ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই তলার ঠিকানা আর সংখ্যা নয়, মানুষের পড়ার মতো নাম। URL, Domain,
                Email ঠিকানা। আর এই তলার সমস্যার চেহারাও আলাদা। নিচের তলা ভাঙলে
                কোনো উত্তরই আসে না। Layer 7 এ সমস্যা হলে উত্তর আসে, কিন্তু
                উত্তরটা খারাপ খবর। 404 মানে এই নামে কিছু নেই, 500 মানে Program
                নিজে ভেঙেছে, 502 মানে সামনের Proxy পেছনের App কে পাচ্ছে না। একটা
                সংখ্যাসহ উত্তর পাওয়া মানেই নিচের ছয় তলা তাদের কাজ ঠিকঠাক করেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "layer-7.sh",
          code: `# -s চুপচাপ, -I শুধু উত্তরের Header
curl -sI https://example.com | head -3
#   HTTP/2 200
#   date: Mon, 12 Oct 2026 05:42:44 GMT
#   content-type: text/html; charset=utf-8

# যে পাতা নেই
curl -sI https://example.com/nope | head -1
#   HTTP/2 404

# 200 আর 404 দুইটাই প্রমাণ করে নিচের ছয় তলা ঠিক আছে।
# 404 হলো Server এর Program এর উত্তর: "আপনার কথা বুঝেছি, কিন্তু এই নামে কিছু নেই।"

# DNS ও Layer 7 এর একটা আলাপ: একটা প্রশ্ন, একটা উত্তর
dig +short example.com | head -2
#   172.66.147.243
#   104.20.23.154`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "নিচের তলা ভাঙলে নীরবতা, উপরের তলা ভাঙলে খারাপ খবর",
          content: (
            <p>
              এই একটা পর্যবেক্ষণ আপনাকে বহু সময় বাঁচাবে। Browser যদি বলে এই
              সাইটে পৌঁছানো যাচ্ছে না, বা চাকা ঘুরতেই থাকে, তাহলে সমস্যা Layer 1
              থেকে 4 এর কোথাও, কারণ কোনো উত্তরই ফেরেনি। Browser যদি তালা নিয়ে
              সতর্কবার্তা দেখায়, সমস্যা Layer 6 এ। আর যদি একটা পাতা আসে যাতে
              লেখা 404, 500 বা 502, তাহলে Network পুরোপুরি ঠিক, সমস্যা Server
              এর Program এ। শুধু Error টা কেমন দেখতে, সেটা দেখেই অর্ধেক তলা বাদ
              দিয়ে দেওয়া যায়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "addresses-and-wrapping",
      subHeader: { index: "010", title: "Three Addresses" },
      title: <SectionTitle>তিন তলা, তিন ঠিকানা, তিন মোড়ক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসনের শুরুতে একটা প্রশ্ন রেখেছিলাম। একটা Request এর গায়ে MAC ও
                লাগে, IP ও লাগে, Port ও লাগে, তিনটাই কেন? সাত তলা দেখার পর উত্তরটা
                এখন নিজে থেকেই বেরিয়ে আসে। তিনটা ঠিকানা তিনটা আলাদা তলার, আর
                প্রতিটা একটা আলাদা প্রশ্নের উত্তর দেয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Port, Layer 4:</strong> যন্ত্রের ভেতরে কোন Program?
                  এই ঠিকানার অর্থ শুধু একটা যন্ত্রের ভেতরে। পুরো পথে এটা বদলায়
                  না, একমাত্র NAT এর সীমানা ছাড়া।
                </ListItem>
                <ListItem>
                  <strong>IP Address, Layer 3:</strong> পৃথিবীর কোন যন্ত্র? এই
                  ঠিকানার অর্থ পুরো Internet জুড়ে। শুরু থেকে শেষ পর্যন্ত গন্তব্য
                  IP একই থাকে, আর পথের প্রতিটা Router এটা দেখেই পথ ঠিক করে।
                </ListItem>
                <ListItem>
                  <strong>MAC Address, Layer 2:</strong> এই মুহূর্তে পাশের কোন
                  যন্ত্রের হাতে দেব? এই ঠিকানার অর্থ শুধু একটা Network এর
                  ভেতরে। প্রতিটা Hop এ এটা পুরো বদলে যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা চিঠির সাথে মিলিয়ে নিন। খামের উপরে লেখা থাকে শহর আর বাড়ির
                ঠিকানা, সেটা IP। তার সাথে লেখা থাকে কার নামে, কোন ফ্ল্যাটে, সেটা
                Port। আর চিঠিটা যখন এক ডাকঘর থেকে আরেক ডাকঘরে যায়, প্রতিবার সেটা
                একটা নতুন বস্তায় ভরা হয়, যার গায়ে শুধু লেখা থাকে পরের ডাকঘরের
                নাম। সেই বস্তার লেবেলটা MAC। বস্তা বদলায়, খাম বদলায় না।
              </ContentParagraph>
              <ContentParagraph>
                এর সাথে আছে চতুর্থ একটা ঠিকানা, যা মানুষের জন্য, নাম। Layer 7 এ
                আপনি লেখেন islandtours.example। DNS সেই নামকে IP তে বদলায়, যা
                Layer 3 এর। আর ARP সেই পথের প্রথম Hop এর IP কে MAC এ বদলায়, যা
                Layer 2 এর। অর্থাৎ Module 04 এর পুরো DNS আর Module 03 এর ARP
                আসলে একই ধরনের কাজ করে, উপরের তলার ঠিকানাকে নিচের তলার ঠিকানায়
                অনুবাদ।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WrapPreviewDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিটা তিন ঠিকানার গল্পকেই আরেকভাবে দেখায়। প্রতিটা তলা তথ্যের
                সামনে নিজের ঠিকানাসহ একটা অংশ জুড়ে দেয়, যাকে বলে{" "}
                <strong>Header</strong>। আর উপরের তলা থেকে যা এসেছিল, তাকে সে
                বলে <strong>Payload</strong>, মানে বহন করার মাল। Module 02 তে
                OS Networking এর লেসনে বলা হয়েছিল Kernel এর ভেতরে খামটা তৈরি হয়।
                সেই খাম আসলে একটা নয়, খামের ভেতরে খাম, তার ভেতরে খাম।
              </ContentParagraph>
              <ContentParagraph>
                এই মোড়ক পরানোর নাম <strong>Encapsulation</strong>, আর ওপাশে
                একটা একটা করে খোলার নাম <strong>Decapsulation</strong>। পথের
                প্রতিটা যন্ত্র ঠিক ততটুকুই খোলে যতটুকু তার কাজে লাগে। Switch শুধু
                বাইরের মোড়কটা দেখে, Router তার ভেতরেরটা পর্যন্ত, আর সবগুলো মোড়ক
                খুলে আসল তথ্য পর্যন্ত পৌঁছায় শুধু Server। ঠিক এই কথাটাই পরের
                অংশের ছবি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এখানে শুধু ধারণাটা, হিসাবটা পরে",
          content: (
            <p>
              প্রতিটা Header এ ঠিক কত Byte, একটা Frame এ সর্বোচ্চ কতটুকু ধরে,
              বড় তথ্য কীভাবে কাটা হয়, আর পথের প্রতিটা Hop এ ঠিক কোন মোড়কটা
              ফেলে নতুন বানানো হয়, এসব নিয়ে এই Module এর ছয় নম্বর লেসন, Packet,
              Segment, and Frame। আজ শুধু এটুকু রাখুন, নিচে নামার সময় মোড়ক
              বাড়ে, উপরে ওঠার সময় খোলে, আর প্রতিটা মোড়কের একটা নিজস্ব নাম আর
              নিজস্ব ঠিকানা আছে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "devices",
      subHeader: { index: "011", title: "Devices" },
      title: <SectionTitle>কোন যন্ত্র কোন তলার, আর তার মানে কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Network এর মানুষ যন্ত্রের নাম বলার সময় প্রায়ই একটা সংখ্যা জুড়ে
              দেন, Layer 2 Switch, Layer 3 Switch, Layer 4 Firewall। এই সংখ্যার
              মানে খুব সোজা। যন্ত্রটা মোড়কের কত তলা পর্যন্ত খুলে পড়ে আর সেই
              তথ্য দিয়ে সিদ্ধান্ত নেয়। যত উপরে পড়ে, তত বেশি জানে, তত সূক্ষ্ম
              সিদ্ধান্ত নিতে পারে, আর তত বেশি কাজ করতে হয়।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DeviceLayerDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Hub, Repeater, তার, Layer 1:</strong> সংকেত নকল করে
                  বা বাড়িয়ে দেয়। কিছুই পড়ে না।
                </ListItem>
                <ListItem>
                  <strong>Switch, Access Point, Layer 2:</strong> Frame এর MAC
                  পড়ে ঠিক করে কোন তারে পাঠাবে। IP কী তা সে জানেই না।
                </ListItem>
                <ListItem>
                  <strong>Router, Layer 3:</strong> Packet এর IP পড়ে পরের পথ
                  ঠিক করে। Port বা ভেতরের তথ্য দেখে না।
                </ListItem>
                <ListItem>
                  <strong>Layer 3 Switch:</strong> এমন Switch যা Routing ও করতে
                  পারে। বড় অফিস আর Data Center এ থাকে। নামটা শুনে ঘাবড়াবেন না,
                  এটা শুধু বলছে যন্ত্রটা IP পর্যন্ত পড়ে।
                </ListItem>
                <ListItem>
                  <strong>Firewall, Security Group, NAT, Layer 4:</strong> IP র
                  সাথে Port আর TCP নাকি UDP তা দেখে। নিয়ম হয় এরকম, Port 443 এ
                  সবাই আসতে পারবে, Port 22 এ শুধু অফিসের IP। Cloud এর Security
                  Group ঠিক এই তলার জিনিস, তাই সেখানে আপনি শুধু IP আর Port
                  লিখতে পারেন, URL লিখতে পারেন না।
                </ListItem>
                <ListItem>
                  <strong>L7 Load Balancer, Reverse Proxy, WAF, API Gateway, Layer 7:</strong>{" "}
                  একদম ভেতরের তথ্য পর্যন্ত পড়ে। কোন Host, কোন Path, কোন Header,
                  এমনকি Request এর ভেতরে সন্দেহজনক কিছু আছে কি না। WAF মানে Web
                  Application Firewall, যা Layer 7 এ বসে খারাপ Request আটকায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার Module 03 এর একটা পুরনো ধাঁধা মিটিয়ে দিই। সেখানে শিখেছিলেন
                বাসার যে বাক্সটাকে সবাই Router বলে, তার ভেতরে আসলে কয়েকটা যন্ত্র
                একসাথে আছে। এখন সেটা তলার ভাষায় বলা যায়। তার Antenna আর তারের
                Port গুলো Layer 1। তার ভেতরের Switch আর Access Point Layer 2। তার
                Routing এর অংশ Layer 3। তার NAT আর Firewall Layer 4। আর সে যে
                DHCP দিয়ে IP বিলি করে আর DNS এর প্রশ্ন এগিয়ে দেয়, সেগুলো Layer 7
                এর সেবা। একটা বাক্স, কিন্তু প্রায় সব তলার কাজ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "পুরো সাত তলা থাকে শুধু দুই প্রান্তে",
          content: (
            <p>
              ছবিতে একটা জিনিস চোখে পড়ার মতো। পথের মাঝের সাধারণ যন্ত্রগুলো,
              Switch আর Router, Layer 3 এর উপরে তাকায়ই না। পর্যটকের ফোন থেকে
              Island Tours এর Server পর্যন্ত পনেরোটা Router থাকতে পারে, আর তাদের
              কেউ জানে না ভেতরে একটা বুকিং যাচ্ছে নাকি একটা ছবি। Port, TCP, TLS,
              HTTP, এসব বোঝে শুধু দুই প্রান্তের দুই যন্ত্র। এই নকশার কারণেই
              Internet এত বড় হতে পেরেছে। মাঝের যন্ত্রগুলো সরল আর দ্রুত, আর নতুন
              কোনো App বানাতে মাঝের একটা Router ও বদলাতে হয় না। পরের লেসনে এই
              ধারণাটার নাম জানবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "l4-vs-l7",
      subHeader: { index: "012", title: "L4 vs L7" },
      title: <SectionTitle>কাজের জায়গায় যে সংখ্যাগুলো শুনবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                OSI Model শেখার সবচেয়ে বড় লাভ হলো একটা ভাষা পাওয়া। Cloud এর
                Dashboard, Documentation, সহকর্মীদের আলাপ, সব জায়গায় Layer এর
                সংখ্যা ছড়িয়ে আছে, আর কেউ ধরে নেয় আপনি জানেন। সবচেয়ে বেশি যে
                জোড়াটা শুনবেন তা হলো L4 আর L7, তাই এটা দিয়েই শুরু।
              </ContentParagraph>
              <ContentParagraph>
                আগে শব্দটা। <strong>Load Balancer</strong> হলো এমন একটা যন্ত্র বা
                সেবা, যা সামনে দাঁড়িয়ে আসা Request গুলো পেছনের কয়েকটা Server এর
                মধ্যে ভাগ করে দেয়, যাতে কোনো একটার উপর সব চাপ না পড়ে। এটা নিয়ে
                পরে আলাদা Module আছে। আজকের প্রশ্ন শুধু এটুকু, ভাগ করার সিদ্ধান্ত
                সে কোন তথ্য দেখে নেয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LbLayerSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার বাকি কথাগুলো, যা আপনি সত্যিকারের Dashboard আর Documentation
                এ দেখবেন। প্রতিটার পাশে তার মানেটা রাখলাম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Layer 4 Load Balancer:</strong> IP আর Port দেখে পুরো
                  সংযোগটা একটা Server এ পাঠায়। AWS এ এর নাম Network Load
                  Balancer। Database, Game Server, বা যেকোনো TCP আর UDP সেবার
                  সামনে বসে।
                </ListItem>
                <ListItem>
                  <strong>Layer 7 Load Balancer:</strong> HTTP Request খুলে Host,
                  Path, Header দেখে ভাগ করে। AWS এ এর নাম Application Load
                  Balancer। Web আর API র সামনে বসে।
                </ListItem>
                <ListItem>
                  <strong>TLS Termination:</strong> যে যন্ত্র HTTPS এর তালা
                  খোলে। L7 Load Balancer বা Reverse Proxy কে ভেতরটা পড়তে হলে
                  তালা তাকেই খুলতে হয়, তাই Certificate বসে তার উপরে।
                </ListItem>
                <ListItem>
                  <strong>L3/L4 DDoS আর L7 DDoS:</strong> আক্রমণ কোন তলায়।
                  প্রথমটায় আক্রমণকারী বিপুল পরিমাণ অর্থহীন Packet পাঠিয়ে রাস্তা
                  আর সংযোগের জায়গা ভরে ফেলে। দ্বিতীয়টায় সে দেখতে একদম আসল
                  Request পাঠায়, যেমন বারবার Search, যাতে Server এর Program
                  ক্লান্ত হয়। দ্বিতীয়টা ধরা কঠিন, কারণ প্রতিটা Request আলাদা
                  করে দেখলে নিরীহ।
                </ListItem>
                <ListItem>
                  <strong>Layer 7 Firewall বা WAF:</strong> Request এর ভেতরের লেখা
                  পড়ে খারাপটা আটকায়। সাধারণ Firewall শুধু IP আর Port দেখে, তাই
                  Port 443 খোলা থাকলে তার ভেতর দিয়ে কী যাচ্ছে সে বোঝে না।
                </ListItem>
                <ListItem>
                  <strong>Layer 2 Network, Layer 3 Network:</strong> দুইটা Server
                  একই Layer 2 তে আছে মানে তারা একই Network এ, মাঝে কোনো Router
                  নেই। Layer 3 দিয়ে জোড়া মানে মাঝে Routing আছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই ভাষা আপনি আসলে এর মধ্যেই একবার ব্যবহার করেছেন, না জেনে। Module
                04 এ Cloudflare এর লেসনে কমলা মেঘ আর ধূসর মেঘ দেখেছিলেন। ধূসর মেঘে
                Cloudflare শুধু DNS এর উত্তর দেয় আর সরে যায়। কমলা মেঘে সে আপনার
                সাইটের সামনে একটা Layer 7 Proxy হয়ে বসে, তালা খোলে, Request পড়ে,
                Cache করে, খারাপ Request আটকায়। আর ঠিক সেই কারণেই কমলা মেঘ শুধু
                Web এর জন্য কাজ করে, SSH বা Email এর জন্য নয়। সে HTTP র ভাষা
                বোঝে, অন্য Layer 7 ভাষা নয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "L4 নাকি L7, বাছবেন কীভাবে",
          content: (
            <p>
              নিজেকে একটাই প্রশ্ন করুন, সিদ্ধান্ত নিতে কি Request এর ভেতরটা
              জানা দরকার? যদি চান /api আর /images আলাদা Server এ যাক, বা একটা IP
              তে অনেকগুলো Domain চালাতে চান, বা Cookie দেখে একই মানুষকে একই
              Server এ রাখতে চান, তাহলে Layer 7। আর যদি শুধু চান Port 5432 এর
              সব সংযোগ কয়েকটা Database এর মধ্যে ভাগ হোক, বা সেবাটা HTTP ই নয়,
              তাহলে Layer 4। মনে রাখার সূত্র, L4 দ্রুত কিন্তু অন্ধ, L7 চোখ খোলা
              কিন্তু বেশি পরিশ্রমী।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "map-not-machine",
      subHeader: { index: "013", title: "Map, Not Machine" },
      title: <SectionTitle>মানচিত্রটা যেখানে বাস্তবের সাথে মেলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ সব কিছু সুন্দরভাবে একটা করে তলায় বসেছে। এখন সৎ হওয়ার
                সময়। বাস্তবের Network OSI এর সাত খোপে নিখুঁতভাবে বসে না, আর এটা
                আগে থেকে না জানলে পরে মনে হবে আপনি কিছু ভুল বুঝেছেন। ভুল
                বোঝেননি। OSI লেখা হয়েছিল একটা আদর্শ নকশা হিসেবে, আর Internet
                বানানো হয়েছে তার আগে থেকে চলে আসা TCP/IP দিয়ে, যা এই নকশা মেনে
                তৈরি নয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ARP কোন তলায়?</strong> সে Layer 3 এর ঠিকানা, IP, নিয়ে
                  Layer 2 এর ঠিকানা, MAC, খুঁজে দেয়। তাই সে দুই তলার মাঝখানে
                  দাঁড়িয়ে। কেউ বলেন Layer 2, কেউ ঠাট্টা করে বলেন Layer 2.5।
                </ListItem>
                <ListItem>
                  <strong>TLS কোন তলায়?</strong> আগেই দেখেছেন, 5 আর 6 এর মাঝে।
                </ListItem>
                <ListItem>
                  <strong>ICMP কোন তলায়?</strong> সে IP র ভেতরে চড়ে যায়, যেমন
                  TCP যায়, কিন্তু কাজ করে IP র সহকারী হিসেবে। তাকে Layer 3 ধরা
                  হয়।
                </ListItem>
                <ListItem>
                  <strong>DNS কোন তলায়?</strong> Layer 7, যদিও সে পুরো Network
                  এর একটা ভিত্তি।
                </ListItem>
                <ListItem>
                  <strong>Layer 5 আর 6 এর আলাদা Protocol কোথায়?</strong> প্রায়
                  নেই। বাস্তবে এই কাজগুলো Program এর ভেতরেই হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তাহলে OSI কি অকেজো? একদমই না, শুধু তার কাজটা ঠিকভাবে বুঝতে হবে।
                OSI কোনো নিয়ম নয় যা যন্ত্র মেনে চলে, OSI একটা চিন্তার কাঠামো যা
                মানুষ ব্যবহার করে। এটা আপনাকে তিনটা জিনিস দেয়। এক, একটা ভাষা,
                যাতে পৃথিবীর যেকোনো Engineer এর সাথে কথা বলা যায়। দুই, একটা
                তাক, যেখানে নতুন যেকোনো Protocol বা যন্ত্র শিখলে সেটা বসিয়ে রাখা
                যায়। তিন, Debugging এর একটা ক্রম, যা একটু পরেই দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                এবার কয়েকটা ভুল ধারণা, যেগুলো নতুনদের মধ্যে খুব চালু। নিজে যখন
                কাউকে শেখাবেন, এগুলো আগেভাগে ভেঙে দিলে তাঁর অনেক সময় বাঁচবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ভুল: Internet OSI Model এ চলে।</strong> ঠিক: Internet
                  চলে TCP/IP তে। OSI শুধু বোঝানোর মানচিত্র।
                </ListItem>
                <ListItem>
                  <strong>ভুল: Application Layer মানে আমার App।</strong> ঠিক:
                  এটা সেই ভাষা যাতে App গুলো কথা বলে, যেমন HTTP।
                </ListItem>
                <ListItem>
                  <strong>ভুল: প্রতিটা Packet সাত তলাই পার হয় প্রতিটা যন্ত্রে।</strong>{" "}
                  ঠিক: শুধু দুই প্রান্তে। Router এ তিন তলা, Switch এ দুই।
                </ListItem>
                <ListItem>
                  <strong>ভুল: উপরের তলা বেশি গুরুত্বপূর্ণ।</strong> ঠিক: কোনো
                  তলাই অন্যটার চেয়ে বড় নয়। উপরেরটা নিচেরটা ছাড়া অচল, নিচেরটা
                  উপরেরটা ছাড়া অর্থহীন।
                </ListItem>
                <ListItem>
                  <strong>ভুল: সাতটা নাম মুখস্থ করলেই OSI শেখা হলো।</strong> ঠিক:
                  নাম নয়, প্রতিটা তলা কোন প্রশ্নের উত্তর দেয় সেটা জানাই আসল।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের খেলাটা সেই শেষ কথাটারই অনুশীলন। বারোটা চেনা জিনিস, প্রতিটা
                কোন তলার, বলুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhichLayerLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Layer 8 নামে একটা ঠাট্টা চালু আছে",
          content: (
            <p>
              কোনো Engineer যদি হেসে বলেন এটা Layer 8 এর সমস্যা, ঘাবড়াবেন না,
              আট নম্বর কোনো তলা নেই। এটা একটা পুরনো রসিকতা, আর Layer 8 মানে
              কীবোর্ডের সামনে বসা মানুষটা। অর্থাৎ যন্ত্র ঠিকই আছে, ভুলটা করেছে
              ব্যবহারকারী, যেমন ভুল Password বা ভুল ঠিকানা লেখা। রসিকতা হলেও
              কথাটা কাজের, কারণ বহু সমস্যার শেষ সত্যিই সেখানে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "debugging",
      subHeader: { index: "014", title: "Debugging by Layer" },
      title: <SectionTitle>সাইট খুলছে না, নিচ থেকে উপরে উঠুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সেই অংশ যার জন্য এই পুরো মানচিত্রটা শেখা। সাইট খুলছে না,
                এই অভিযোগটা সবচেয়ে অস্পষ্ট অভিযোগ, কারণ সাতটা তলার যেকোনোটা
                ভাঙলে পর্যটক ঠিক এই একই কথা বলেন। নতুন মানুষ তখন এলোমেলোভাবে
                এটা ওটা চেষ্টা করেন, Server Restart দেন, Code বদলান, DNS এ হাত
                দেন। অভিজ্ঞ মানুষ একটা প্রশ্ন করেন, কোন তলায়?
              </ContentParagraph>
              <ContentParagraph>
                নিয়মটা তলার প্রথম নিয়ম থেকেই আসে। প্রতিটা তলা নিচের তলার ভরসায়
                চলে। তাই নিচের তলা ভাঙা থাকলে উপরের সব পরীক্ষাই ব্যর্থ হবে, আর
                সেগুলো দেখে কিছুই বোঝা যাবে না। সুতরাং নিচ থেকে শুরু করুন, আর এক
                তলা ঠিক প্রমাণ হলে তবেই উপরে উঠুন। যে তলায় প্রথম ব্যর্থ হবেন,
                সমস্যা সেখানেই। প্রতিটা তলার জন্য একটা করে কমান্ড মনে রাখলেই
                চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "ladder.sh",
          code: `#!/bin/bash
# ব্যবহার: ./ladder.sh example.com 443
HOST=$1
PORT=$2
if [ -z "$PORT" ]; then echo "usage: ./ladder.sh <host> <port>"; exit 1; fi

IF=$(route -n get default | awk '/interface/{print $2}')   # কোন Interface দিয়ে বাইরে যাই
GW=$(route -n get default | awk '/gateway/{print $2}')     # Router এর IP

echo "L1   $(ifconfig $IF | grep status)"
echo "L2   $(arp -n $GW)"
echo "L3a  $(ping -c 2 -q $GW | grep loss)"
echo "L3b  $(ping -c 2 -q 1.1.1.1 | grep loss)"
echo "DNS  $(dig +short $HOST | head -1)"
echo "L4   $(nc -vz -G 3 $HOST $PORT 2>&1)"
echo "L6   $(echo | openssl s_client -connect $HOST:$PORT -servername $HOST 2>/dev/null | grep 'Verify return')"
echo "L7   $(curl -sI -m 5 https://$HOST:$PORT | head -1)"

# সব ঠিক থাকলে উত্তর:
#   L1   status: active
#   L2   ? (192.168.1.1) at c8:3a:35:4b:10:fe on en0 ifscope [ethernet]
#   L3a  2 packets transmitted, 2 packets received, 0.0% packet loss
#   L3b  2 packets transmitted, 2 packets received, 0.0% packet loss
#   DNS  172.66.147.243
#   L4   Connection to example.com port 443 [tcp/https] succeeded!
#   L6   Verify return code: 0 (ok)
#   L7   HTTP/2 200

# Linux এ তিনটা বদল: Interface আর Gateway পাবেন "ip route show default" থেকে,
# L1 এ "ip link show", L2 এ "ip neigh", আর nc তে -G এর বদলে -w।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Script টা উপর থেকে নিচে পড়লে তলাগুলো নিচ থেকে উপরে ওঠে, আর
                মাঝখানে একটা লাইন আছে যার গায়ে তলার সংখ্যা নেই, DNS। সেটা ইচ্ছা
                করে। DNS নিজে Layer 7 এর সেবা, কিন্তু নাম দিয়ে কোথাও যেতে হলে
                Port এ টোকা দেওয়ার আগেই IP টা জানা লাগে। তাই ক্রমে সে বসে Layer
                3 আর 4 এর মাঝে। Layer 3 এর পরীক্ষায় আমরা ইচ্ছা করে নাম নয়, সরাসরি
                IP ব্যবহার করেছি, যাতে DNS এর দোষ পথের ঘাড়ে না পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                এবার নিজে খেলে দেখুন। নিচে সাতটা ঘটনা, আর সাতটাতেই পর্যটকের
                অভিযোগ হুবহু এক।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LayerDebugLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা কমান্ড আছে যা একবারে কয়েকটা তলার খবর দেয়, সময়ের হিসাবে।
                curl কে বললে সে জানিয়ে দেয় প্রতিটা ধাপ কখন শেষ হলো। Module 02 এর
                শেষ লেসনে সময় কোথায় যায় দেখেছিলেন, এবার সেই হিসাবটা তলা ধরে
                পড়ুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "timing-by-layer.sh",
          code: `curl -s -o /dev/null -w 'dns        %{time_namelookup}
tcp        %{time_connect}
tls        %{time_appconnect}
first_byte %{time_starttransfer}
total      %{time_total}
' https://www.wikipedia.org

#   dns        0.120846    <-- নাম থেকে IP পাওয়া শেষ (Layer 7 এর DNS সেবা)
#   tcp        0.175552    <-- TCP সংযোগ তৈরি শেষ (Layer 4)
#   tls        0.238471    <-- তালার চাবি ঠিক করা শেষ (Layer 5 আর 6)
#   first_byte 0.311130    <-- Server এর উত্তরের প্রথম Byte (Layer 7)
#   total      0.675132    <-- পুরো পাতা নামা শেষ

# প্রতিটা সংখ্যা শুরু থেকে গোনা সেকেন্ড, তাই বিয়োগ করলে প্রতিটা তলার নিজের সময়:
#   TCP = 0.175 - 0.120 = 0.055 সেকেন্ড
#   TLS = 0.238 - 0.175 = 0.063 সেকেন্ড
# কোন সংখ্যাটা অস্বাভাবিক বড়, সেটাই বলে দেয় ধীরগতির কারণ কোন তলায়।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "তাড়া থাকলে মাঝখান থেকে শুরু করুন",
          content: (
            <p>
              নিচ থেকে উপরে ওঠা সবচেয়ে নির্ভুল, কিন্তু সবসময় সবচেয়ে দ্রুত নয়।
              অভিজ্ঞরা প্রায়ই Layer 4 থেকে শুরু করেন, nc দিয়ে Port এ একটা টোকা।
              এটা সফল হলে এক ধাক্কায় প্রমাণ হয়ে যায় Layer 1 থেকে 4 সবই ঠিক, আর
              তখন শুধু উপরের দিকে খুঁজতে হয়। ব্যর্থ হলে নিচের দিকে নামতে হয়।
              একটা পরীক্ষায় সম্ভাবনার অর্ধেক বাদ। আর একদম উপরের curl যদি 200
              দেয়, তাহলে সাত তলাই ঠিক, সমস্যাটা সম্ভবত পর্যটকের নিজের যন্ত্রে বা
              তাঁর Network এ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর প্রতিটা অংশ কোন তলায়</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Architecture এর ছবিটা এখন নতুন চোখে দেখুন।
                প্রতিটা বাক্স আসলে একটা নির্দিষ্ট তলা পর্যন্ত কাজ করে, আর সেটা
                জানলে বোঝা যায় কোন বাক্সে কোন ধরনের নিয়ম বসানো সম্ভব আর কোনটায়
                নয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Cloudflare, Layer 7 আর তার নিচে:</strong> পর্যটকের
                  Request প্রথমে এখানে আসে। Cloudflare তালা খোলে, Request পড়ে,
                  ছবি Cache থেকে দেয়, আর খারাপ Request আটকায়, যা Layer 7 এর কাজ।
                  একই সাথে সে অর্থহীন Packet এর বন্যাও ঠেকায়, যা Layer 3 আর 4
                  এর কাজ।
                </ListItem>
                <ListItem>
                  <strong>Server এর Firewall, Layer 4:</strong> নিয়ম মাত্র তিনটা।
                  Port 443 আর 80 সবার জন্য খোলা। Port 22, মানে SSH, শুধু দলের
                  নির্দিষ্ট IP থেকে। বাকি সব বন্ধ। এই Firewall জানে না কোন পাতা
                  চাওয়া হচ্ছে, সে শুধু IP আর Port দেখে।
                </ListItem>
                <ListItem>
                  <strong>Reverse Proxy, Layer 7:</strong> Port 443 এ শোনে, তালা
                  খোলে, তারপর Host আর Path দেখে Request টা Server এর ভেতরেই Port
                  3000 এ চলা App এর কাছে পাঠায়। App টা নিজে কখনো বাইরের দুনিয়ার
                  সামনে আসে না।
                </ListItem>
                <ListItem>
                  <strong>App, Layer 7:</strong> HTTP র ভাষায় বুকিং এর Request
                  বোঝে আর উত্তর দেয়। নিচের ছয় তলার কিছুই তাকে জানতে হয় না, সে
                  শুধু Kernel কে বলে, এই Port এ শুনব।
                </ListItem>
                <ListItem>
                  <strong>Database, Port 5432:</strong> App এর সাথে তার নিজের
                  Layer 7 ভাষায় কথা বলে। কিন্তু Firewall এ এই Port বাইরের জন্য
                  বন্ধ, তাই Internet থেকে কেউ এখানে টোকাই দিতে পারে না। Layer 4
                  এর একটা নিয়ম পুরো Database কে আড়াল করে রেখেছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার একটা সত্যিকারের রাতের গল্প। শুক্রবার সন্ধ্যায় পর্যটকরা
                জানালেন সাইট খুলছে না। দলের নতুন সদস্য প্রথমেই App Restart দিতে
                যাচ্ছিলেন। অভিজ্ঞ সদস্য থামালেন আর নিজের ল্যাপটপ থেকে তিনটা
                কমান্ড চালালেন। ping এ Server এর উত্তর এলো, তাই Layer 3 ঠিক। nc
                দিয়ে Port 443 এ টোকা দিতেই সাথে সাথে উত্তর, Connection refused।
                তৃতীয় কমান্ডের দরকারই পড়ল না। refused মানে যন্ত্র চালু, পথ খোলা,
                Firewall ও আটকাচ্ছে না, শুধু Port 443 এ কেউ শুনছে না। অর্থাৎ
                Reverse Proxy বন্ধ হয়ে গেছে। Server এ ঢুকে দেখা গেল একটা Config
                বদলের পর সেটা আর চালু হয়নি। App টা পুরো সময় Port 3000 এ দিব্যি
                চলছিল, তাকে Restart দিলে কিছুই বদলাত না। সময় লাগল তিন মিনিট।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "আগে তলা, তারপর সমাধান",
          content: (
            <p>
              গল্পের শিক্ষাটা একটা অভ্যাস। কোনো কিছু ভাঙলে প্রথম কাজ সারানো নয়,
              প্রথম কাজ হলো তলাটা খুঁজে বের করা। App Restart, Code বদল, DNS এ
              হাত দেওয়া, প্রতিটা একটা নির্দিষ্ট তলার সমাধান, আর ভুল তলায় সমাধান
              প্রয়োগ করলে সমস্যা তো সারেই না, বরং নতুন একটা যোগ হয়। দলের ভেতরে
              কথা বলার সময়ও তলার নাম ব্যবহার করুন। সাইট ডাউন বলার বদলে বলুন,
              Layer 3 ঠিক আছে, Port 443 refused দিচ্ছে। এই এক বাক্য শুনে পুরো
              দল জানে কোথায় তাকাতে হবে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা বুকিং, সাত তলা নেমে সাত তলা উঠে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটক ফোনে Book Now চাপলেন। ফোনের IP 192.168.1.20, Server এর IP
              103.94.135.2। এবার একই বুকিং কে প্রতিটা তলা ধরে অনুসরণ করি, প্রথমে
              ফোনে উপর থেকে নিচে, তারপর Server এ নিচ থেকে উপরে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Layer 7, Browser একটা HTTP Request লেখে",
              description:
                "Browser HTTP র নিয়মে লেখে POST /bookings, সাথে কোন নৌকা, কয়টা আসন। এর আগে সে DNS দিয়ে islandtours.example নামটাকে 103.94.135.2 তে বদলে নিয়েছে।",
            },
            {
              title: "Layer 6 আর 5, তথ্য সাজানো হয় আর তালা পড়ে",
              description:
                "বুকিং এর তথ্য JSON রূপে, UTF-8 এ লেখা হয়। তারপর TLS, যার Session আগেই খোলা, পুরোটায় তালা মারে। এখন থেকে পথের কেউ ভেতরটা পড়তে পারবে না।",
            },
            {
              title: "Layer 4, TCP Port জোড়ে আর নম্বর দেয়",
              description:
                "Kernel এর TCP তালা মারা তথ্যকে Segment এ ভরে। গায়ে লেখে উৎস Port 51514 আর গন্তব্য Port 443, সাথে একটা ক্রমিক নম্বর, যাতে হারালে আবার পাঠানো যায়।",
            },
            {
              title: "Layer 3, IP ঠিকানা জোড়ে",
              description:
                "Segment টা একটা Packet এ ঢোকে। গায়ে লেখা হয় উৎস 192.168.1.20 আর গন্তব্য 103.94.135.2। ফোন Subnet Mask দেখে বোঝে গন্তব্য বাইরের, তাই Packet যাবে Gateway তে।",
            },
            {
              title: "Layer 2, পাশের যন্ত্রের MAC জোড়ে",
              description:
                "Packet টা একটা Frame এ ঢোকে। গন্তব্য MAC হিসেবে লেখা হয় Router এর c8:3a:35:4b:10:fe, Server এর নয়, কারণ Layer 2 শুধু পাশের যন্ত্র চেনে। এই MAC ফোন পেয়েছে ARP দিয়ে।",
            },
            {
              title: "Layer 1, Bit গুলো তরঙ্গ হয়ে বাতাসে",
              description:
                "Wi-Fi এর যন্ত্রাংশ Frame এর প্রতিটা Bit কে Radio তরঙ্গ বানিয়ে ছাড়ে। Router এর Antenna সেটা ধরে আবার Bit বানায়।",
            },
            {
              title: "পথে, প্রতিটা Router তিন তলা ওঠে আর নামে",
              description:
                "বাসার Router Frame খোলে, Packet এর IP পড়ে, উৎস IP বদলে নিজের 203.0.113.25 বসায়, তারপর পরের রাস্তার জন্য নতুন Frame বানায়। পথের প্রতিটা Router একই কাজ করে, শুধু Layer 3 পর্যন্ত উঠে। Layer 4 এর উপরের কিছুই কেউ খোলে না।",
            },
            {
              title: "Server এ, Layer 1 থেকে 4, মোড়ক খোলা শুরু",
              description:
                "Server এর Network Card সংকেত থেকে Bit, Bit থেকে Frame বানায়। MAC নিজের দেখে Frame খোলে। IP নিজের দেখে Packet খোলে। TCP Segment এর Port 443 দেখে বোঝে এটা Reverse Proxy র, ক্রম ঠিক করে আর প্রাপ্তি স্বীকার পাঠায়।",
            },
            {
              title: "Server এ, Layer 5 থেকে 7, বুকিং টা পড়া হয়",
              description:
                "Reverse Proxy TLS এর তালা খোলে, JSON টা পড়ার মতো হয়, আর HTTP Request দেখে সে বোঝে এটা /bookings এর, তাই Port 3000 এর App কে দেয়। App বুকিং টা Database এ লেখে আর 201 Created উত্তর দেয়। উত্তরটা ঠিক একই পথে, উল্টো দিকে, সাত তলা নেমে সাত তলা উঠে পর্যটকের পর্দায় পৌঁছায়।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই নয় ধাপের প্রতিটা আপনি আগে শিখেছেন",
          content: (
            <p>
              আবার ধাপগুলো পড়ুন আর খেয়াল করুন, একটাও নতুন নয়। HTTP Request
              Module 02 এর, DNS Module 04 এর, Port আর Socket Module 02 এর, IP,
              Subnet, Gateway, NAT, ARP আর MAC সব Module 03 এর। আজ যা নতুন তা
              শুধু সাজানোটা, কে কার উপরে বসে আর কে কার হাতে কাজ তুলে দেয়। OSI
              Model এর আসল মূল্য এখানেই। এটা নতুন তথ্য দেয় না, জানা তথ্যগুলোকে
              একটা কাঠামোয় বসায়, আর তখন পুরো ছবিটা একসাথে চোখে পড়ে।
            </p>
          ),
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
                <strong>নিজের Terminal</strong>, সবচেয়ে ভালো শিক্ষক। নিচের Lab
                এর ছয়টা পরীক্ষা করলে প্রতিটা তলাকে নিজের চোখে একবার করে দেখা
                হয়ে যাবে।
              </ListItem>
              <ListItem>
                <strong>Practical Networking, Packet Traveling</strong>, একটা
                Packet কীভাবে Switch আর Router পার হয় তার ধাপে ধাপে লেখা আর
                ভিডিও। OSI এর সবচেয়ে পরিষ্কার ব্যাখ্যাগুলোর একটা।{" "}
                <a
                  href="https://www.practicalnetworking.net/series/packet-traveling/packet-traveling/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  practicalnetworking.net/series/packet-traveling
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare Learning, What is the OSI Model</strong>, সাত
                তলার ছোট আর ছবিসহ পরিচয়, সাথে L3, L4 আর L7 আক্রমণের ব্যাখ্যা।{" "}
                <a
                  href="https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cloudflare.com/learning, OSI Model
                </a>
              </ListItem>
              <ListItem>
                <strong>AWS, What is the OSI Model</strong>, Cloud এর চোখে একই
                বিষয়, যেখানে দেখবেন কোন AWS সেবা কোন তলায়।{" "}
                <a
                  href="https://aws.amazon.com/what-is/osi-model/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  aws.amazon.com/what-is/osi-model
                </a>
              </ListItem>
              <ListItem>
                <strong>Wireshark</strong>, বিনামূল্যের একটা Program যা আপনার
                যন্ত্র দিয়ে যাওয়া প্রতিটা Frame ধরে তার ভেতরের তলাগুলো একটা একটা
                করে খুলে দেখায়। এই Module এর পরের লেসনগুলোতে এর মতো করে Packet
                পড়া শিখবেন।{" "}
                <a
                  href="https://www.wireshark.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  wireshark.org
                </a>
              </ListItem>
              <ListItem>
                <strong>মূল দলিল, ITU-T X.200</strong>, OSI Model এর আসল মানটা,
                যা ISO 7498 এর সমান। পড়তে শুকনো, কিন্তু জেনে রাখুন উৎসটা
                কোথায়।{" "}
                <a
                  href="https://www.itu.int/rec/T-REC-X.200-199407-I/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  itu.int/rec/T-REC-X.200
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
            <ContentList>
              <ListItem>
                Network এর কাজ এত বড় যে সেটা তলায় তলায় ভাগ করা। প্রতিটা{" "}
                <strong>Layer</strong> একটাই কাজ করে আর বাকিটা নিচের তলার ভরসায়
                ছেড়ে দেয়।
              </ListItem>
              <ListItem>
                তিন নিয়ম: প্রতিটা তলা শুধু ঠিক নিচের তলার সেবা নেয়, ওপাশের একই
                তলার সাথে কথা বলে, আর উপরের তলার জিনিসকে না খুলে একটা বাক্স
                হিসেবে বয়।
              </ListItem>
              <ListItem>
                <strong>OSI Model</strong> এর সাত তলা, নিচ থেকে: Physical, Data
                Link, Network, Transport, Session, Presentation, Application।
              </ListItem>
              <ListItem>
                Layer 1 Bit কে সংকেত বানায়। Layer 2 MAC দিয়ে পাশের যন্ত্রে Frame
                পৌঁছায়। Layer 3 IP দিয়ে Network থেকে Network এ Packet পৌঁছায়।
                Layer 4 Port দিয়ে ঠিক Program এ পৌঁছায়, TCP বা UDP তে।
              </ListItem>
              <ListItem>
                Layer 5 আলাপ ধরে রাখে, Layer 6 তথ্যের রূপ ঠিক করে আর তালা মারে,
                Layer 7 হলো সেই ভাষা যাতে Program গুলো কথা বলে। বাস্তবে এই তিনটা
                একসাথে থাকে।
              </ListItem>
              <ListItem>
                MAC, IP আর Port তিনটা আলাদা তলার ঠিকানা, তাই তিনটাই লাগে। MAC
                প্রতি Hop এ বদলায়, IP পুরো পথে একই, Port যন্ত্রের ভেতরের।
              </ListItem>
              <ListItem>
                যন্ত্রের Layer মানে সে কত তলা পর্যন্ত পড়ে। Hub 1, Switch 2,
                Router 3, Firewall আর Security Group 4, Reverse Proxy আর WAF 7।
                পুরো সাত তলা শুধু দুই প্রান্তে।
              </ListItem>
              <ListItem>
                L4 Load Balancer IP আর Port দেখে, L7 Load Balancer Request এর
                ভেতরটা পড়ে।
              </ListItem>
              <ListItem>
                OSI একটা মানচিত্র। আসল Internet চলে TCP/IP তে, আর ARP, TLS এর
                মতো কিছু জিনিস এক খোপে বসে না।
              </ListItem>
              <ListItem>
                সাইট না খুললে নিচ থেকে উপরে উঠুন: ifconfig, arp, ping, dig, nc,
                openssl, curl। প্রথম যেটা ব্যর্থ, সমস্যা সেই তলায়। refused মানে
                Program নেই, timed out মানে পথে কেউ আটকাচ্ছে।
              </ListItem>
              <ListItem>
                পরের লেসন: TCP/IP Model। আজকের সাত তলার মানচিত্রের পাশে বসবে চার
                তলার সেই ব্যবস্থা, যা দিয়ে Internet সত্যিই বানানো, আর দেখবেন
                প্রতিটা তলা আপনার যন্ত্রের ঠিক কোথায় থাকে।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      [
        <span className="font-bold text-primary">Layer</span>,
        "একটা কাজ, যা সে নিচের তলার ভরসায় করে",
      ],
      [
        <span className="font-bold text-primary">OSI Model</span>,
        "সাত তলার একটা মানচিত্র, ISO এর বানানো, বোঝানো আর কথা বলার জন্য",
      ],
      [
        <span className="font-bold text-primary">Layer 1, Physical</span>,
        "Bit কে তার, আলো বা তরঙ্গের সংকেত বানানো। ঠিকানা নেই",
      ],
      [
        <span className="font-bold text-primary">Layer 2, Data Link</span>,
        "MAC দিয়ে একই Network এর পাশের যন্ত্রে Frame। Switch",
      ],
      [
        <span className="font-bold text-primary">Layer 3, Network</span>,
        "IP দিয়ে Network থেকে Network এ Packet, Best Effort। Router",
      ],
      [
        <span className="font-bold text-primary">Layer 4, Transport</span>,
        "Port দিয়ে ঠিক Program এ, TCP র Segment বা UDP র Datagram",
      ],
      [
        <span className="font-bold text-primary">Layer 5 আর 6</span>,
        "আলাপ ধরে রাখা, আর Encoding, Compression, Encryption। TLS এখানে",
      ],
      [
        <span className="font-bold text-primary">Layer 7, Application</span>,
        "Program এর কথা বলার ভাষা: HTTP, DNS, SMTP, SSH। App নিজে নয়",
      ],
      [
        <span className="font-bold text-primary">Encapsulation</span>,
        "নামার পথে প্রতিটা তলা নিজের Header জুড়ে একটা মোড়ক পরায়",
      ],
      [
        <span className="font-bold text-primary">L4 আর L7 Load Balancer</span>,
        "প্রথমটা IP আর Port দেখে, দ্বিতীয়টা Host, Path আর Header পড়ে",
      ],
      [
        <span className="font-bold text-primary">Connection refused</span>,
        "যন্ত্র আছে, কিন্তু ওই Port এ কোনো Program শুনছে না",
      ],
      [
        <span className="font-bold text-primary">Timed out</span>,
        "কোনো উত্তরই আসেনি, পথে Firewall আটকাচ্ছে বা যন্ত্র বন্ধ",
      ],
      [
        <span className="font-bold text-primary">নিচ থেকে উপরে</span>,
        "ifconfig, arp, ping, dig, nc, openssl, curl। প্রথম ব্যর্থতাই উত্তর",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Network এর কাজকে Layer এ ভাগ করার সবচেয়ে বড় লাভ কোনটা?",
        options: [
          {
            key: "A",
            text: "তথ্য দ্রুত যায়",
            isCorrect: false,
            explanation:
              "Layer গতি বাড়ায় না, বরং প্রতিটা মোড়ক একটু বাড়তি Byte যোগ করে। লাভটা অন্য জায়গায়।",
          },
          {
            key: "B",
            text: "প্রতিটা তলা নিজের কাজটুকু জানলেই চলে, আর একটা তলা বদলালে বাকিগুলো ছুঁতে হয় না",
            isCorrect: true,
            explanation:
              "ঠিক। এই কারণেই Wi-Fi ছেড়ে Mobile Data ধরলে App বদলাতে হয় না, আর App লেখককে তরঙ্গ নিয়ে ভাবতে হয় না।",
          },
          {
            key: "C",
            text: "Layer থাকলে Packet হারায় না",
            isCorrect: false,
            explanation:
              "Packet হারানো ঠেকায় একটা নির্দিষ্ট Protocol, TCP। Layer এ ভাগ করা নিজে কিছু ঠেকায় না।",
          },
        ],
      },
      {
        id: 2,
        text: "MAC Address, IP Address আর Port যথাক্রমে কোন তিন Layer এর ঠিকানা?",
        options: [
          {
            key: "A",
            text: "Layer 1, 2, 3",
            isCorrect: false,
            explanation: "Layer 1 এর কোনো ঠিকানাই নেই, সে শুধু সংকেত বয়।",
          },
          {
            key: "B",
            text: "Layer 2, 3, 4",
            isCorrect: true,
            explanation:
              "ঠিক। MAC পাশের যন্ত্র চেনে (Data Link), IP পৃথিবীর যন্ত্র চেনে (Network), Port যন্ত্রের ভেতরের Program চেনে (Transport)।",
          },
          {
            key: "C",
            text: "Layer 3, 4, 7",
            isCorrect: false,
            explanation: "Layer 7 এর ঠিকানা নাম আর URL, Port নয়।",
          },
        ],
      },
      {
        id: 3,
        text: "একটা Router কে Layer 3 এর যন্ত্র বলা হয় কেন?",
        options: [
          {
            key: "A",
            text: "কারণ তার তিনটা Port থাকে",
            isCorrect: false,
            explanation: "Port এর সংখ্যার সাথে Layer এর সম্পর্ক নেই।",
          },
          {
            key: "B",
            text: "কারণ সে মোড়ক খুলে IP Address পর্যন্ত পড়ে আর সেটা দেখে পথ ঠিক করে, তার উপরে তাকায় না",
            isCorrect: true,
            explanation:
              "ঠিক। যন্ত্রের Layer মানে সে সর্বোচ্চ কত তলা পর্যন্ত পড়ে। Router Packet এর IP পড়ে, Port বা ভেতরের তথ্য নয়।",
          },
          {
            key: "C",
            text: "কারণ সে Internet এর তিন নম্বর ধাপে থাকে",
            isCorrect: false,
            explanation: "পথে তার অবস্থানের সাথে নয়, সে কী পড়ে তার সাথে সম্পর্ক।",
          },
        ],
      },
      {
        id: 4,
        text: "nc দিয়ে Port 443 পরীক্ষা করে সাথে সাথে পেলেন Connection refused। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "যন্ত্রটা চালু আর পৌঁছানো যাচ্ছে, কিন্তু ওই Port এ কোনো Program শুনছে না",
            isCorrect: true,
            explanation:
              "ঠিক। উত্তরটা সাথে সাথে এসেছে মানে যন্ত্র নিজেই বলেছে এখানে কেউ নেই। Layer 3 পর্যন্ত ঠিক, সমস্যা Layer 4 এ, Program চালু করতে হবে।",
          },
          {
            key: "B",
            text: "Firewall Packet ফেলে দিচ্ছে",
            isCorrect: false,
            explanation:
              "Firewall চুপচাপ ফেলে দিলে কোনো উত্তরই আসে না, তখন দেখা যায় timed out।",
          },
          {
            key: "C",
            text: "DNS নামটা খুঁজে পায়নি",
            isCorrect: false,
            explanation:
              "DNS ব্যর্থ হলে nc সংযোগের চেষ্টা পর্যন্তই পৌঁছাত না, বার্তাটা নাম না পাওয়া নিয়ে হতো।",
          },
        ],
      },
      {
        id: 5,
        text: "Browser এ একটা পাতা এলো যাতে লেখা 502 Bad Gateway। সমস্যা কোন দিকে?",
        options: [
          {
            key: "A",
            text: "Layer 1, তার খোলা",
            isCorrect: false,
            explanation: "তার খোলা থাকলে কোনো উত্তরই আসত না, একটা সংখ্যাসহ পাতা তো দূরের কথা।",
          },
          {
            key: "B",
            text: "Layer 3, পথ নেই",
            isCorrect: false,
            explanation: "পথ না থাকলে উত্তরটা ফিরতেই পারত না।",
          },
          {
            key: "C",
            text: "Layer 7, নিচের ছয় তলা ঠিক আছে, সামনের Proxy পেছনের App কে পাচ্ছে না",
            isCorrect: true,
            explanation:
              "ঠিক। সংখ্যাসহ একটা উত্তর পাওয়া মানেই Network কাজ করছে। এবার App এর Log দেখার পালা।",
          },
        ],
      },
      {
        id: 6,
        text: "আপনি চান /api দিয়ে শুরু হওয়া Request এক দল Server এ যাক আর /images আরেক দলে। কোন Load Balancer লাগবে?",
        options: [
          {
            key: "A",
            text: "Layer 4, কারণ সেটা দ্রুত",
            isCorrect: false,
            explanation:
              "Layer 4 শুধু IP আর Port দেখে। দুই রকম Request ই একই Port 443 এ আসে, তাই সে তফাত করতে পারবে না।",
          },
          {
            key: "B",
            text: "Layer 7, কারণ Path দেখতে হলে Request এর ভেতরটা পড়তে হয়",
            isCorrect: true,
            explanation:
              "ঠিক। Path আছে HTTP Request এর ভেতরে, যা Application Layer এর তথ্য। সেটা পড়তে তালাও তাকেই খুলতে হবে।",
          },
          {
            key: "C",
            text: "যেকোনোটা, দুইটাই একই কাজ করে",
            isCorrect: false,
            explanation: "দুইটা আলাদা তলা পর্যন্ত পড়ে, তাই আলাদা সিদ্ধান্ত নিতে পারে।",
          },
        ],
      },
      {
        id: 7,
        text: "Application Layer বলতে আসলে কী বোঝায়?",
        options: [
          {
            key: "A",
            text: "Chrome বা WhatsApp এর মতো App গুলো",
            isCorrect: false,
            explanation:
              "এটাই সবচেয়ে চালু ভুল। App গুলো Layer 7 ব্যবহার করে, তারা নিজেরা Layer 7 নয়।",
          },
          {
            key: "B",
            text: "সেই Protocol গুলো, যাতে Program রা একে অপরের কাছে সেবা চায় আর দেয়, যেমন HTTP আর DNS",
            isCorrect: true,
            explanation:
              "ঠিক। Chrome বদলে Firefox নিলে Program বদলায়, HTTP একই থাকে। তলাটা হলো ভাষাটা।",
          },
          {
            key: "C",
            text: "Server এর Operating System",
            isCorrect: false,
            explanation: "Operating System এর Kernel মূলত Layer 3 আর 4 এর কাজ করে।",
          },
        ],
      },
      {
        id: 8,
        text: "সাইট খুলছে না। Debugging নিচের তলা থেকে শুরু করা হয় কেন?",
        options: [
          {
            key: "A",
            text: "কারণ নিচের তলার কমান্ডগুলো ছোট",
            isCorrect: false,
            explanation: "কমান্ডের দৈর্ঘ্য কারণ নয়।",
          },
          {
            key: "B",
            text: "কারণ প্রতিটা তলা নিচের তলার উপর নির্ভর করে, তাই নিচেরটা ভাঙা থাকলে উপরের সব পরীক্ষা এমনিতেই ব্যর্থ হয়",
            isCorrect: true,
            explanation:
              "ঠিক। Wi-Fi বন্ধ থাকলে curl ও ব্যর্থ, ping ও ব্যর্থ, আর সেগুলো দেখে আসল কারণ বোঝা যায় না। প্রথম যে তলা ব্যর্থ হয়, সমস্যা সেখানেই।",
          },
          {
            key: "C",
            text: "কারণ সমস্যা সবসময় Layer 1 এই থাকে",
            isCorrect: false,
            explanation: "সমস্যা যেকোনো তলায় হতে পারে। ক্রমটা শুধু খোঁজাকে নির্ভুল করে।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "প্রতিটা তলা নিজের চোখে একবার",
    subtitle: "Terminal এ ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের তিন ঠিকানা খুঁজুন",
        description:
          "নিজের যন্ত্রের MAC, IP আর Router এর ঠিকানা বের করে প্রতিটা কোন তলার তা লিখুন।",
      },
      {
        title: "সিঁড়িটা একবার পুরো উঠুন",
        description:
          "ladder.sh চালিয়ে একটা চালু সাইটের জন্য নিচ থেকে উপরে আটটা পরীক্ষার উত্তর দেখুন।",
      },
      {
        title: "একটা তলা ইচ্ছা করে ভাঙুন",
        description:
          "নিজের যন্ত্রে একটা ছোট Server চালু আর বন্ধ করে refused, succeeded, 200 আর 404 নিজে তৈরি করুন।",
      },
      {
        title: "refused আর timed out পাশাপাশি",
        description:
          "একই কমান্ডে দুই রকম ব্যর্থতা দেখুন, আর কোনটায় কত সময় লাগে মাপুন।",
      },
      {
        title: "তালার তলাটা দেখুন",
        description:
          "একটা সাইটের Certificate কার, কবে পর্যন্ত, আর মেয়াদ শেষ হলে পরীক্ষাটা কোন তলায় ব্যর্থ হয় দেখুন।",
      },
      {
        title: "সময়কে তলা ধরে ভাগ করুন",
        description:
          "curl এর সময়ের হিসাব থেকে বের করুন DNS, TCP, TLS আর Server এর উত্তরে আলাদা করে কত লাগল।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-my-three-addresses.sh",
        language: "bash",
        code: `# কোন Interface দিয়ে বাইরে যাচ্ছেন, আর Router কে
route -n get default | grep -E "gateway|interface"
#       gateway: 192.168.1.1
#     interface: en0

# Layer 2 এর ঠিকানা (MAC) আর Layer 3 এর ঠিকানা (IP), একই জায়গায়
ifconfig en0 | grep -E "ether|inet "
#       ether a4:83:e7:12:9c:01
#       inet 192.168.1.20 netmask 0xffffff00 broadcast 192.168.1.255

# Router এর Layer 2 ঠিকানা, যা আপনার যন্ত্র ARP দিয়ে শিখেছে
arp -n 192.168.1.1
#   ? (192.168.1.1) at c8:3a:35:4b:10:fe on en0 ifscope [ethernet]

# Linux এ: ip route show default, ip addr show, ip neigh
# আপনার সংখ্যাগুলো আলাদা হবে, এখানে লেসনের উদাহরণের মান দেখানো।
# খাতায় লিখুন: কোনটা MAC, কোনটা IP, আর দুইটার মধ্যে কোনটা Router পার হলে বদলাবে।`,
      },
      {
        filename: "2-climb-the-ladder.sh",
        language: "bash",
        code: `# লেসনের ladder.sh একটা ফাইলে রেখে চালানোর অনুমতি দিন
chmod +x ladder.sh

# একটা চালু সাইট
./ladder.sh example.com 443
#   L1   status: active
#   L2   ? (192.168.1.1) at c8:3a:35:4b:10:fe on en0 ifscope [ethernet]
#   L3a  2 packets transmitted, 2 packets received, 0.0% packet loss
#   L3b  2 packets transmitted, 2 packets received, 0.0% packet loss
#   DNS  172.66.147.243
#   L4   Connection to example.com port 443 [tcp/https] succeeded!
#   L6   Verify return code: 0 (ok)
#   L7   HTTP/2 200

# এবার এমন একটা সাইট যার Certificate ইচ্ছা করে মেয়াদোত্তীর্ণ রাখা (পরীক্ষার জন্য বানানো)
./ladder.sh expired.badssl.com 443
#   L4   Connection to expired.badssl.com port 443 [tcp/https] succeeded!
#   L6       Verify return code: 10 (certificate has expired)
#   L7
# Layer 4 পর্যন্ত সব ঠিক, Layer 6 এ ব্যর্থ, আর তার উপরের Layer 7 এ কোনো উত্তরই নেই।
# প্রথম ব্যর্থতাই আসল কারণ, উপরের ফাঁকা লাইনটা শুধু তার ফল।`,
      },
      {
        filename: "3-break-one-layer.sh",
        language: "bash",
        code: `# Port টা একবার ঠিক করে নিন, পরের সব কমান্ড এটাই ব্যবহার করবে
export LAB_PORT=8765

# ১. এখনো কিছু চালু নেই
nc -vz -G 2 localhost $LAB_PORT
#   nc: connectx to localhost port 8765 (tcp) failed: Connection refused
#   (লাইনটা দুইবার এলে অবাক হবেন না, একবার IPv6 আর একবার IPv4 এর চেষ্টা)

# ২. একটা ছোট Web Server চালু করুন (আরেকটা Terminal এ, একটা ফাঁকা Folder এ)
mkdir -p site && echo "hello" > site/index.html
cd site && python3 -m http.server $LAB_PORT

# ৩. প্রথম Terminal এ ফিরে, একই পরীক্ষা
nc -vz -G 2 localhost $LAB_PORT
#   Connection to localhost port 8765 [tcp/ultraseek-http] succeeded!

# ৪. Layer 4 ঠিক, এবার Layer 7
curl -sI http://localhost:$LAB_PORT/ | head -1
#   HTTP/1.0 200 OK
curl -sI http://localhost:$LAB_PORT/nope | head -1
#   HTTP/1.0 404 File not found

# ৫. Server বন্ধ করুন (দ্বিতীয় Terminal এ Ctrl+C), আবার পরীক্ষা
nc -vz -G 2 localhost $LAB_PORT
#   nc: connectx to localhost port 8765 (tcp) failed: Connection refused

# এক মিনিটে আপনি নিজে তিনটা অবস্থা বানালেন:
# refused (Layer 4 এ কেউ নেই), 200 (সাত তলাই ঠিক), 404 (Layer 7 এর খারাপ খবর)।`,
      },
      {
        filename: "4-refused-vs-timeout.sh",
        language: "bash",
        code: `# refused: নিজের যন্ত্রের একটা বন্ধ Port
time nc -vz -G 5 localhost 9
#   nc: connectx to localhost port 9 (tcp) failed: Connection refused
#   real    0m0.005s      <-- চোখের পলকে

# timed out: একটা Server, যার Firewall Port 81 এর Packet চুপচাপ ফেলে দেয়
time nc -vz -G 5 example.com 81
#   nc: connectx to example.com port 81 (tcp) failed: Operation timed out
#   real    0m10.010s     <-- পুরো অপেক্ষার পর (IPv6 আর IPv4, প্রতিটায় ৫ সেকেন্ড)

# সময়ের তফাতটাই আসল শিক্ষা।
# refused এ কেউ একজন উত্তর দিয়েছে, তাই সাথে সাথে জানা গেল।
# timed out এ কেউ কিছু বলেনি, তাই আপনার যন্ত্র অপেক্ষা করে হাল ছেড়েছে।
# Linux এ -G এর বদলে -w লিখুন।`,
      },
      {
        filename: "5-the-lock-layer.sh",
        language: "bash",
        code: `# Certificate টা কার নামে, কে দিয়েছে, কবে থেকে কবে পর্যন্ত
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | openssl x509 -noout -subject -issuer -dates
#   subject=CN=example.com
#   issuer=C=US, O=SSL Corporation, CN=Cloudflare TLS Issuing ECC CA 3
#   notBefore=Sep 26 22:49:11 2026 GMT
#   notAfter=Dec 25 22:56:35 2026 GMT

# তালাটা কোন সংস্করণের আর যাচাই পাস করল কি না
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | grep -E "Protocol|Verify return"
#   Protocol: TLSv1.3
#   Verify return code: 0 (ok)

# মেয়াদ শেষ হওয়া Certificate এ একই পরীক্ষা
echo | openssl s_client -connect expired.badssl.com:443 -servername expired.badssl.com 2>/dev/null \\
  | grep "Verify return"
#   Verify return code: 10 (certificate has expired)

# তারিখগুলো আপনি যেদিন চালাবেন সেদিনের মতো আসবে।
# notAfter এর তারিখটা পার হলে Browser সতর্কবার্তা দেখায়, যদিও নিচের চার তলা তখনো নিখুঁত।`,
      },
      {
        filename: "6-time-per-layer.sh",
        language: "bash",
        code: `curl -s -o /dev/null -w 'dns        %{time_namelookup}
tcp        %{time_connect}
tls        %{time_appconnect}
first_byte %{time_starttransfer}
total      %{time_total}
' https://www.wikipedia.org
#   dns        0.120846
#   tcp        0.175552
#   tls        0.238471
#   first_byte 0.311130
#   total      0.675132

# একই কমান্ড আবার চালান। dns এর সংখ্যাটা অনেক ছোট হয়ে যাবে,
# কারণ উত্তরটা এখন Cache এ (Module 04 এর DNS Cache)।

# এবার তিনটা আলাদা সাইটে চালিয়ে একটা ছক বানান:
#   সাইট | DNS | TCP (tcp - dns) | TLS (tls - tcp) | Server (first_byte - tls)
# কোন সাইটে কোন তলা সবচেয়ে বেশি সময় নিচ্ছে?
# দূরের Server এ TCP আর TLS দুইটাই বাড়ে, কারণ দুইটাতেই কয়েকবার আসা যাওয়া লাগে।`,
      },
    ],
    tip: "তিন নম্বর পরীক্ষাটা বাদ দেবেন না, কারণ এটাই একমাত্র যেখানে আপনি নিজে একটা তলা ভাঙছেন আর জোড়া লাগাচ্ছেন। Server চালু করার আগে refused, চালু করার পর succeeded, বন্ধ করার পর আবার refused, এই তিনটা উত্তর নিজের হাতে তৈরি করলে Connection refused কথাটা আর কখনো ভয়ের মনে হবে না। এরপর যখনই কোনো Log এ ECONNREFUSED দেখবেন, আপনি জানবেন এর মানে শুধু এটুকু, ওই Port এ এই মুহূর্তে কেউ শুনছে না। আর পুরো Lab শেষে ladder.sh ফাইলটা রেখে দিন, কাজের জীবনে এটা বারবার লাগবে।",
  },
  assignment: {
    title: "Mini Project: নিজের Network এর সাত তলার খাতা",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>সাত তলার ছক বানান:</strong> নিজের হাতে একটা ছক আঁকুন, সাত সারি।
        প্রতিটা তলার জন্য লিখুন কাজ এক লাইনে, টুকরোর নাম, ঠিকানা, একটা Protocol,
        একটা যন্ত্র, আর এই কোর্সের কোন লেসনে সেটা শিখেছেন। লেসন না দেখে প্রথমে
        চেষ্টা করুন, তারপর মিলিয়ে নিন।
      </span>,
      <span key="2">
        <strong>নিজের যন্ত্রের খাতা:</strong> Lab এর এক আর দুই নম্বর পরীক্ষা
        নিজের যন্ত্রে চালান। নিজের MAC, IP, Router এর IP আর MAC লিখুন, আর
        ladder.sh এর পুরো উত্তরটা নিজের পছন্দের তিনটা সাইটের জন্য টুকে রাখুন।
      </span>,
      <span key="3">
        <strong>রায় দিন:</strong> নিচের ছয়টা অবস্থার প্রতিটায় সমস্যা কোন তলায়,
        আর পরের কমান্ড কোনটা চালাবেন, লিখুন। (ক) ping 1.1.1.1 চলে, কিন্তু ping
        example.com বলে নাম পাওয়া যায়নি। (খ) nc বলে Operation timed out। (গ) nc
        বলে Connection refused। (ঘ) Browser বলে Certificate এর মেয়াদ শেষ। (ঙ)
        পাতায় লেখা 500 Internal Server Error। (চ) ifconfig এ status: inactive।
      </span>,
      <span key="4">
        <strong>Island Tours এর জন্য বেছে দিন:</strong> তিনটা চাহিদার প্রতিটায়
        কোন তলার যন্ত্র লাগবে আর কেন, লিখুন। (ক) Port 5432 যেন শুধু App Server
        এর IP থেকে খোলা থাকে। (খ) admin.islandtours.example আর islandtours.example
        একই IP তে, কিন্তু আলাদা App এ যাবে। (গ) Search এ বারবার অস্বাভাবিক লেখা
        পাঠানো Request আটকাতে হবে।
      </span>,
      <span key="5">
        <strong>শেখান (১০ লাইন):</strong> এমন একজন বন্ধুকে চিঠি লিখুন যিনি
        কখনো OSI Model এর নাম শোনেননি। কুরিয়ার বা নিজের বানানো অন্য একটা তুলনা
        দিয়ে বোঝান Layer কেন দরকার, MAC, IP আর Port তিনটা কেন লাগে, আর সাইট না
        খুললে নিচ থেকে উপরে ওঠার নিয়মটা কী। কোনো ইংরেজি সংজ্ঞা নকল না করে নিজের
        ভাষায়।
      </span>,
    ],
    deliverables: [
      <span key="1">নিজের হাতে আঁকা সাত তলার ছক, ছয়টা ঘর ভরা</span>,
      <span key="2">নিজের চার ঠিকানা আর তিন সাইটের ladder.sh এর উত্তর</span>,
      <span key="3">ছয় অবস্থার রায়, তলা আর পরের কমান্ড সহ</span>,
      <span key="4">তিন চাহিদার জন্য তলা আর যন্ত্রের নাম, কারণ সহ</span>,
      <span key="5">বন্ধুর জন্য ১০ লাইনের ব্যাখ্যা, নিজের তুলনা দিয়ে</span>,
    ],
  },
};
