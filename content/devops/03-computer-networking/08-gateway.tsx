/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import { RouteDecisionLab } from "../../../components/course/topics/gateway/animations";
import {
  DoorToDoorDiagram,
  GatewayDoorDiagram,
} from "../../../components/course/topics/gateway/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const gatewayContent: TopicData = {
  id: "gateway",
  introduction: {
    badge: "MODULE 03 · LESSON 08",
    title: <SectionTitle>বাইরে বেরোনোর দরজা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          গত দুইটা লেসনে একটা কথা বারবার বলে এসেছি, গন্তব্য যদি আপনার Network এর
          না হয়, তাহলে চিঠিটা তুলে দিতে হয় Default Gateway এর হাতে, আর সেটা পরের
          লেসন। এই সেই পরের লেসন। যে জিনিসটার কথা দুইবার প্রতিশ্রুতি দিয়ে রেখেছিলাম,
          এবার তার সাথে পুরোপুরি পরিচয়।
        </ContentParagraph>
        <ContentParagraph>
          Gateway আসলে খুব সহজ একটা জিনিস, আপনার Network থেকে বাইরের দুনিয়ায়
          বেরোনোর দরজা। ভেতরের যন্ত্ররা নিজেদের মধ্যে সরাসরি কথা বলে, কিন্তু বাইরের
          যেকোনো জায়গায় যেতে হলে সবাই এই একটা দরজা দিয়েই বেরোয়। দরজাটা প্রায়
          সবসময় আপনার বাসার Router।
        </ContentParagraph>
        <ContentParagraph>
          লেসনটা ছোট, কিন্তু জিনিসটা বড়। এই দরজাটা আছে বলেই আপনার বসার ঘরের Laptop
          থেকে পৃথিবীর অন্য প্রান্তের একটা সার্ভারে পৌঁছানো যায়। দরজা বন্ধ হলে
          ভেতরের সব ঠিক চলে, কিন্তু বাইরের কিছুতেই পৌঁছানো যায় না।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "Subnet Mask বলে গন্তব্য আমার পাড়ার কি না। যদি না হয়, তাহলে চিঠি কোথায় যাবে? একটাই জায়গায়, দরজায়। Default Gateway সেই দরজা, বাইরের পুরো দুনিয়ায় বেরোনোর একমাত্র পথ।",
      author: "Computer Networking",
      role: "Lesson 08",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "the-door",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Network এর একটা দরজা লাগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনে দেখেছিলাম, একটা যন্ত্র চিঠি পাঠানোর আগে Subnet Mask
                দিয়ে মেপে দেখে গন্তব্য তার নিজের পাড়ার কি না। একই পাড়ার হলে সরাসরি
                পৌঁছে দেয়। কিন্তু আলাদা পাড়ার হলে? সে তো দূরের পাড়ার পথ চেনে না।
                তখন সে কী করে?
              </ContentParagraph>
              <ContentParagraph>
                খুব সহজ কাজ করে, চিঠিটা তুলে দেয় একটা দরজার হাতে। এই দরজার নাম
                Gateway। একটা বড় ভবনের কথা ভাবুন, ভেতরের লোকজন এক তলা থেকে আরেক
                তলায় নিজেরাই যায়, কিন্তু ভবনের বাইরে যেতে হলে সবাই একটা মূল ফটক
                দিয়ে বেরোয়। Gateway ঠিক সেই মূল ফটক, আপনার Network থেকে বাইরের
                দুনিয়ায় বেরোনোর একমাত্র পথ।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <GatewayDoorDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              খেয়াল করুন, দরজার নিজেরও একটা IP আছে, এখানে 192.168.0.1, আর সেটা
              আপনার যন্ত্রেরই মতো একই Network এর একটা ঠিকানা। এটা জরুরি, কারণ দরজা
              যদি আপনার পাড়াতেই না থাকত, আপনি তার কাছেই পৌঁছাতে পারতেন না। তাই
              Gateway সবসময় আপনার নিজের Network এর ভেতরের একটা যন্ত্র, যাকে আপনি
              সরাসরি ধরতে পারেন, আর যে বাইরের সাথে জোড়া লাগানো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "দরজা মানে সাধারণত আপনার Router",
          content: (
            <p>
              বাসায় এই দরজার কাজটা করে আপনার Router, কারণ সে দুই দিকেই জোড়া, ভেতরে
              আপনার সব যন্ত্রের সাথে, আর বাইরে ISP এর সাথে। Public বনাম Private IP
              এর লেসনে এই Router কেই দুই মুখওয়ালা হিসেবে দেখেছিলেন, ভেতরে একটা
              Private ঠিকানা আর বাইরে একটা Public। সেই ভেতরের ঠিকানাটাই আপনার
              Default Gateway।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "default",
      subHeader: { index: "002", title: "Default Gateway" },
      title: <SectionTitle>Default মানে অন্য সব কিছু এখানে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নামটার মধ্যে Default শব্দটা কেন? কারণ এই দরজার নিয়মটা এমন, যা কিছু
                আমার নিজের পাড়ার নয়, তার সবটা এই দরজায় পাঠাও। আপনার যন্ত্র দুনিয়ার
                সব Network এর পথ মুখস্থ রাখে না, সেটা অসম্ভব। সে শুধু দুইটা জিনিস
                জানে, নিজের পাড়া, আর বাকি সবের জন্য একটা Default দরজা।
              </ContentParagraph>
              <ContentParagraph>
                তাই সিদ্ধান্তটা খুব সহজ হয়ে যায়। গন্তব্য নিজের পাড়ার হলে সরাসরি,
                নাহলে সোজা Default Gateway এর হাতে, প্রশ্ন শেষ। প্রতিটা যন্ত্রের
                একটাই Default Gateway থাকে। নিচের Lab এ কয়েকটা গন্তব্য বেছে দেখুন,
                কোনটা সরাসরি যায় আর কোনটা দরজা দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RouteDecisionLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই দরজার ঠিকানা কে বসায়",
          content: (
            <p>
              আপনি নিজে বসে Default Gateway লেখেন না, নতুন যন্ত্র Network এ ঢুকলেই
              সেটা আপনাআপনি জানা হয়ে যায়। Private IP এর মতো এই দরজার ঠিকানাও
              যন্ত্রকে দিয়ে দেয় Router, একই স্বয়ংক্রিয় ব্যবস্থায়, যার নাম DHCP।
              সেটা নিয়ে ঠিক পরের লেসন। আপাতত জানুন, আপনার যন্ত্র জন্ম থেকেই জানে
              তার দরজা কোনটা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "door-to-door",
      subHeader: { index: "003", title: "Door to Door" },
      title: <SectionTitle>দরজা থেকে দরজা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা প্রশ্ন এবার মাথায় আসতে পারে। আপনার দরজা তো শুধু চিঠিটা বাইরে
                বের করে দিল, কিন্তু দূরের সার্ভার পর্যন্ত পুরো পথ তো সে জানে না।
                তাহলে চিঠি পৌঁছায় কীভাবে? উত্তরটা সুন্দর, প্রতিটা Network এর নিজের
                একটা দরজা আছে।
              </ContentParagraph>
              <ContentParagraph>
                আপনার চিঠি আপনার দরজা দিয়ে বেরিয়ে পৌঁছায় ISP এর Network এ, সেখানে
                তার নিজের দরজা সেটাকে আরও এগিয়ে দেয় পরের Network এ, তার দরজা আবার
                পরের দিকে। কেউই পুরো পথ জানে না, প্রত্যেকে শুধু জানে পরের দরজা
                কোনটা। এভাবে দরজা থেকে দরজা, ধাপে ধাপে, চিঠি ঠিক গন্তব্যের Network
                এ গিয়ে পৌঁছায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DoorToDoorDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এটাই সেই Hop by Hop যাত্রা",
          content: (
            <p>
              Module 02 এ একটা চিঠির Hop by Hop যাত্রার কথা মনে আছে? এই দরজা থেকে
              দরজা যাওয়াটাই সেই যাত্রা। প্রতিটা দরজা, মানে প্রতিটা Router, চিঠিটা
              পেয়ে ঠিক এক ধাপ এগিয়ে দেয় পরের দরজায়। MAC এর লেসনে দেখেছিলেন,
              চূড়ান্ত গন্তব্য IP পুরো পথে এক থাকে, কিন্তু পরের হাতের MAC প্রতি ধাপে
              বদলায়। এই দরজাগুলোই সেই বদলে যাওয়া পরের হাত।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "project",
      subHeader: { index: "004", title: "Project Example" },
      title: <SectionTitle>Gateway আর Island Tours</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Gateway এর ব্যাপারটা সাধারণত চুপচাপ কাজ করে, কিন্তু যেদিন গড়বড়
                করে, সেদিন একজন Backend Developer এর ঘুম হারাম হয়ে যায়। Island
                Tours চালাতে গিয়ে এটা কোথায় সামনে আসে, দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Database এ পৌঁছায়, Internet এ নয়:</strong> একটা চেনা
                  দৃশ্য, আপনার সার্ভার Island Tours এর Database এ ঠিকঠাক পৌঁছাচ্ছে
                  (কারণ ওরা এক Subnet এ, সরাসরি), কিন্তু বাইরের কোনো API তে পৌঁছাতে
                  পারছে না। প্রায় সবসময় এর মানে একটাই, Default Gateway ভুল বা
                  নেই। ভেতরের সব ঠিক, বাইরের দরজা বন্ধ।
                </ListItem>
                <ListItem>
                  <strong>Container এরও দরজা লাগে:</strong> Docker এ একটা Container
                  চালালে সেটারও একটা Default Gateway থাকে, যেটা দিয়ে সে Container
                  এর ছোট Network থেকে বাইরে বেরোয়। তাই Container থেকে Internet এ
                  পৌঁছানো না গেলে প্রথমেই তার Gateway মিলিয়ে দেখতে হয়।
                </ListItem>
                <ListItem>
                  <strong>প্রথম Hop সবসময় দরজা:</strong> কোথায় ধীর হচ্ছে বুঝতে
                  traceroute চালালে দেখবেন প্রথম Hop টা প্রায় সবসময় আপনার Default
                  Gateway। এটাই প্রমাণ করে, বাইরের যেকোনো যাত্রার প্রথম পা পড়ে ওই
                  দরজায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Internet নেই মানেই দরজা মিলিয়ে দেখুন",
          content: (
            <p>
              যখনই দেখবেন একটা যন্ত্র নিজের LAN এ সব করতে পারছে কিন্তু বাইরে
              পৌঁছাতে পারছে না, সন্দেহের প্রথম জায়গা হওয়া উচিত Default Gateway।
              হয় ঠিকানাটা ভুল বসেছে, নয়তো দরজা নিজেই ডাউন। এটা এত সাধারণ একটা
              সমস্যা যে অভিজ্ঞ লোকজন Internet নেই শুনলেই আগে Gateway আর তারপর DNS
              মিলিয়ে দেখে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "request-flow",
      subHeader: { index: "005", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা চিঠি দরজা পার হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনার Laptop বাইরের একটা সার্ভারে চিঠি পাঠাচ্ছে। Default Gateway
              কোথায় কীভাবে কাজ করল, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "নিজের পাড়ার কি না, মেপে দেখল",
              description:
                "Laptop Subnet Mask দিয়ে দেখল গন্তব্য তার Network এর নয়, বাইরের। তাই সরাসরি যাওয়া যাবে না, দরজা লাগবে।",
            },
            {
              title: "চিঠি গেল Gateway এর দিকে",
              description:
                "খামে চূড়ান্ত গন্তব্য সার্ভারের IP ই থাকল, কিন্তু এই মুহূর্তে চিঠি হাতে হাতে দিতে হবে Gateway কে। তাই Laptop আগে Gateway এর MAC বের করল (ARP, আগের লেসন), তারপর সেই MAC এ চিঠিটা দিল।",
            },
            {
              title: "Gateway পরের দরজায় এগিয়ে দিল",
              description:
                "Gateway, মানে Router, চিঠি পেয়ে দেখল এটা তার নিজের কোনো পাড়ার নয়, তাই সে চিঠিটা এগিয়ে দিল পরের Network এর দরজায়। চূড়ান্ত IP ছুঁলো না, শুধু পরের হাতের MAC বসাল।",
            },
            {
              title: "দরজা থেকে দরজা, গন্তব্যে",
              description:
                "প্রতিটা Network এর দরজা এভাবে এক ধাপ করে এগিয়ে দিল, যতক্ষণ না চিঠি গন্তব্য সার্ভারের Network এ পৌঁছাল। সেখানকার দরজা তখন সরাসরি সার্ভারে পৌঁছে দিল।",
            },
            {
              title: "উত্তর একই পথে ফিরল",
              description:
                "সার্ভার উত্তর পাঠাল, আর সেই উত্তরও ঠিক এভাবে দরজা থেকে দরজা ঘুরে আপনার Gateway হয়ে Laptop এ ফিরে এল। প্রতিটা যাত্রার দুই প্রান্তেই একটা করে দরজা।",
            },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "resources",
      subHeader: { index: "006", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিজের দরজা দেখুন</strong>, নিচের Lab এ কমান্ড আছে। তারপর
                একটা traceroute চালিয়ে দেখুন প্রথম Hop টাই আপনার Gateway, আর
                তারপর কীভাবে দরজা থেকে দরজা এগোয়।
              </ListItem>
              <ListItem>
                <strong>PowerCert Animated Videos</strong>, Default Gateway আর
                Router কীভাবে চিঠি এগিয়ে দেয়, ছোট সহজ Animation।{" "}
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
                <strong>Practical Networking</strong>, Search করুন: Default
                Gateway আর Routing। গোড়া থেকে পরিষ্কার করে বোঝানো।{" "}
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
    /* ---------------------------------------------------------------- 7 */
    {
      id: "recap",
      subHeader: { index: "007", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                Default Gateway হলো আপনার Network থেকে বাইরের দুনিয়ায় বেরোনোর
                দরজা, প্রায় সবসময় আপনার Router।
              </ListItem>
              <ListItem>
                দরজার নিজের একটা IP আছে, আর সেটা আপনার নিজের Network এর একটা
                ঠিকানা (যেমন 192.168.0.1), যাতে আপনি সরাসরি তার কাছে পৌঁছাতে
                পারেন।
              </ListItem>
              <ListItem>
                Default মানে, যা কিছু নিজের পাড়ার নয় তার সবটা এই দরজায় যায়।
                যন্ত্র শুধু নিজের পাড়া আর একটা Default দরজা জানে, দুনিয়ার সব পথ
                নয়।
              </ListItem>
              <ListItem>
                গন্তব্য নিজের Network এর হলে সরাসরি, নাহলে Default Gateway এর হাতে।
                এই সিদ্ধান্ত আসে Subnet Mask থেকে (আগের লেসন)।
              </ListItem>
              <ListItem>
                প্রতিটা Network এর নিজের দরজা আছে। চিঠি দরজা থেকে দরজা, ধাপে ধাপে
                গন্তব্যে পৌঁছায়। এটাই সেই Hop by Hop যাত্রা।
              </ListItem>
              <ListItem>
                একটা যন্ত্র LAN এ সব পারছে কিন্তু বাইরে পারছে না মানে প্রায়
                নিশ্চিত Gateway ভুল বা ডাউন, ডিবাগে প্রথমেই এটা দেখুন।
              </ListItem>
              <ListItem>
                পরের লেসন: এই Gateway আর Private IP আপনার যন্ত্রে কে বসিয়ে দেয়,
                DHCP।
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
        <span className="font-bold text-primary">Gateway</span>,
        "Network থেকে বাইরে বেরোনোর দরজা, সাধারণত Router",
      ],
      [
        <span className="font-bold text-primary">Default</span>,
        "যা কিছু নিজের পাড়ার নয়, তার সব এই দরজায় যায়",
      ],
      [
        <span className="font-bold text-primary">দরজার IP</span>,
        "আপনার নিজের Network এর একটা ঠিকানা, যেমন 192.168.0.1",
      ],
      [
        <span className="font-bold text-primary">সিদ্ধান্ত</span>,
        "নিজের পাড়া হলে সরাসরি, নাহলে Gateway, ঠিক করে Subnet Mask",
      ],
      [
        <span className="font-bold text-primary">দরজা থেকে দরজা</span>,
        "প্রতিটা Network এর নিজের দরজা, চিঠি Hop by Hop এগোয়",
      ],
      [
        <span className="font-bold text-primary">ডিবাগ</span>,
        "LAN চলে বাইরে চলে না মানে Gateway ভুল বা ডাউন",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Default Gateway জিনিসটা আসলে কী?",
        options: [
          {
            key: "A",
            text: "একটা Website যেখানে সব Network লেখা থাকে",
            isCorrect: false,
            explanation:
              "না। Gateway একটা যন্ত্র, আপনার Network থেকে বাইরে বেরোনোর দরজা, সাধারণত Router।",
          },
          {
            key: "B",
            text: "আপনার Network থেকে বাইরে বেরোনোর দরজা, সাধারণত Router",
            isCorrect: true,
            explanation:
              "ঠিক। বাইরের যেকোনো জায়গায় যাওয়ার চিঠি এই দরজা দিয়েই বেরোয়।",
          },
          {
            key: "C",
            text: "আপনার যন্ত্রের একটা বিশেষ Password",
            isCorrect: false,
            explanation:
              "Gateway এর সাথে Password এর সম্পর্ক নেই। এটা বাইরে বেরোনোর দরজা।",
          },
        ],
      },
      {
        id: 2,
        text: "নামের মধ্যে Default শব্দটা কী বোঝায়?",
        options: [
          {
            key: "A",
            text: "যা কিছু নিজের পাড়ার নয়, তার সব এই দরজায় যায়",
            isCorrect: true,
            explanation:
              "ঠিক। যন্ত্র সব পথ জানে না, তাই নিজের পাড়া ছাড়া বাকি সব কিছুর জন্য এই একটা Default দরজা।",
          },
          {
            key: "B",
            text: "এটা সবচেয়ে দ্রুত দরজা",
            isCorrect: false,
            explanation:
              "গতির ব্যাপার নয়। Default মানে বাকি সব কিছুর জন্য নির্ধারিত দরজা।",
          },
          {
            key: "C",
            text: "এটা মুছে ফেলা যায় না",
            isCorrect: false,
            explanation:
              "মুছে ফেলার ব্যাপার নয়। Default মানে অন্য সব গন্তব্যের জন্য এটাই ঠিকানা।",
          },
        ],
      },
      {
        id: 3,
        text: "Gateway এর IP কেন আপনার নিজের Network এর একটা ঠিকানা হয়?",
        options: [
          {
            key: "A",
            text: "যাতে আপনি তার কাছে সরাসরি পৌঁছাতে পারেন",
            isCorrect: true,
            explanation:
              "ঠিক। দরজা যদি আপনার পাড়ায় না থাকত, আপনি তার কাছেই যেতে পারতেন না। তাই সে একই Network এ।",
          },
          {
            key: "B",
            text: "কারণ Gateway এর কোনো IP লাগে না",
            isCorrect: false,
            explanation:
              "Gateway এর IP লাগে, আর সেটা আপনার Network এর ভেতরের একটা ঠিকানা।",
          },
          {
            key: "C",
            text: "কারণ Gateway সবসময় 8.8.8.8",
            isCorrect: false,
            explanation:
              "না, 8.8.8.8 একটা বাইরের Public ঠিকানা। Gateway আপনার ভেতরের, যেমন 192.168.0.1।",
          },
        ],
      },
      {
        id: 4,
        text: "192.168.0.5 (Mask /24) থেকে 8.8.8.8 এ চিঠি যাবে কীভাবে?",
        options: [
          {
            key: "A",
            text: "সরাসরি, কারণ দুইটাই IP",
            isCorrect: false,
            explanation:
              "না। 8.8.8.8 আপনার Network এর নয়, তাই সরাসরি যাওয়া যায় না।",
          },
          {
            key: "B",
            text: "Default Gateway এর হাতে যাবে, কারণ গন্তব্য নিজের পাড়ার নয়",
            isCorrect: true,
            explanation:
              "ঠিক। 8.8.8.8 বাইরের Network, তাই চিঠি যায় Default Gateway তে, আর দরজা বাকিটা সামলায়।",
          },
          {
            key: "C",
            text: "চিঠি পাঠানো যাবে না",
            isCorrect: false,
            explanation:
              "যাবে, শুধু সরাসরি নয়। Default Gateway দিয়ে বাইরে বেরিয়ে ঠিক পৌঁছাবে।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা সার্ভার তার Database (এক Subnet) এ পৌঁছাচ্ছে, কিন্তু Internet এ নয়। প্রথম সন্দেহ কোথায়?",
        options: [
          {
            key: "A",
            text: "Database নষ্ট",
            isCorrect: false,
            explanation:
              "Database তো ঠিকঠাক পৌঁছাচ্ছে, সমস্যা বাইরে যাওয়ায়। তাই সন্দেহ অন্য জায়গায়।",
          },
          {
            key: "B",
            text: "Default Gateway ভুল বা ডাউন",
            isCorrect: true,
            explanation:
              "ঠিক। ভেতরে (এক Subnet) সব চলছে কিন্তু বাইরে যাচ্ছে না, মানে বাইরের দরজায় সমস্যা, মানে Gateway।",
          },
          {
            key: "C",
            text: "সার্ভারের CPU কম",
            isCorrect: false,
            explanation:
              "CPU এর সাথে এর সম্পর্ক নেই। LAN চলে বাইরে চলে না মানে Gateway।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের দরজা খুঁজুন",
    subtitle: "Terminal এ চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের Default Gateway দেখুন",
        description:
          "আপনার যন্ত্রের দরজার ঠিকানা বের করুন। প্রায় নিশ্চিত এটা 192.168.0.1 বা 192.168.1.1 এর মতো হবে।",
      },
      {
        title: "দরজায় Ping করুন",
        description:
          "Gateway এ Ping করে দেখুন সে সাড়া দেয় কি না। এটা আপনার আর বাইরের দুনিয়ার মাঝের প্রথম ধাপ।",
      },
      {
        title: "দরজাটা আপনার পাড়ার কি না",
        description:
          "Gateway এর ঠিকানা আর আপনার নিজের IP এর প্রথম কয়েকটা সংখ্যা মিলিয়ে দেখুন, একই Network এ পড়ে কি না।",
      },
      {
        title: "দরজা থেকে দরজা দেখুন",
        description:
          "traceroute চালিয়ে দেখুন প্রথম Hop টাই আপনার Gateway, তারপর চিঠি কীভাবে দরজা থেকে দরজা এগোয়।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-my-gateway.sh",
        language: "bash",
        code: `# আপনার Default Gateway
ip route | grep default        # Linux, দেখাবে: default via 192.168.0.1 ...
netstat -nr | grep default     # macOS

# 'default via' এর পরের ঠিকানাটাই আপনার দরজা।
# এটাই সেই জায়গা যেখানে বাইরের সব চিঠি প্রথমে যায়।`,
      },
      {
        filename: "2-ping-gateway.sh",
        language: "bash",
        code: `# দরজা সাড়া দেয় কি না
ping -c 4 192.168.0.1     # আপনার Gateway এর ঠিকানা বসান

# সাড়া এলে বুঝবেন দরজা পর্যন্ত পথ ঠিক আছে।
# সাড়া না এলে সমস্যা একদম কাছেই, LAN বা Router এ।`,
      },
      {
        filename: "3-same-network.md",
        language: "markdown",
        code: `# দরজা কি আপনার পাড়ার, মিলিয়ে দেখুন

আপনার IP আর Gateway এর প্রথম তিন অংশ (/24 এ) মেলা উচিত:

  আপনার IP:  192.168.0.5
  Gateway:   192.168.0.1
             ^^^^^^^^^^^ প্রথম তিন অংশ এক -> এক Network

মিললে ঠিক আছে। না মিললে আপনি দরজার কাছেই পৌঁছাতে পারবেন না,
আর তখন বাইরের কিছুতেই যাওয়া যাবে না।`,
      },
      {
        filename: "4-traceroute.sh",
        language: "bash",
        code: `# চিঠি দরজা থেকে দরজা কীভাবে যায়, দেখুন
traceroute google.com     # Linux/macOS
tracert google.com        # Windows

# প্রথম লাইনটা (Hop 1) প্রায় সবসময় আপনার Default Gateway।
# তারপরের প্রতিটা লাইন একটা করে পরের দরজা, মানে পরের Router,
# যতক্ষণ না গন্তব্যে পৌঁছায়। এটাই দরজা থেকে দরজা যাত্রা।`,
      },
    ],
    tip: "চার নম্বর পরীক্ষাটা সবচেয়ে সুন্দর, কারণ traceroute আপনাকে দরজা থেকে দরজা যাত্রাটা নিজের চোখে দেখায়। প্রথম Hop টা আপনার নিজের দরজা, তারপর প্রতিটা লাইন একটা করে পরের Network এর দরজা, ঠিক উপরের ছবির মতো। তখন Gateway আর বিমূর্ত ধারণা থাকে না, প্রতিটা চিঠি সত্যিই যে দরজায় দরজায় ঘুরে গন্তব্যে যায়, সেটা হাতে কলমে দেখা হয়ে যায়।",
  },
  assignment: {
    title: "Mini Project: দরজার খোঁজ",
    time: "৪০ মিনিট",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>নিজের দরজা:</strong> Lab এর এক নম্বর চালিয়ে আপনার Default
        Gateway এর ঠিকানা লিখুন। তারপর দুই নম্বর দিয়ে তাতে Ping করে দেখুন সাড়া
        দেয় কি না।
      </span>,
      <span key="2">
        <strong>এক পাড়া কি না:</strong> আপনার IP আর Gateway এর ঠিকানা পাশাপাশি
        লিখুন। প্রথম তিন অংশ কি মেলে? এক লাইনে লিখুন কেন মেলা জরুরি।
      </span>,
      <span key="3">
        <strong>দরজা থেকে দরজা:</strong> Lab এর চার নম্বর দিয়ে একটা Website এ
        traceroute চালান। প্রথম Hop টা কি আপনার Gateway? মোট কয়টা দরজা (Hop)
        পার হয়ে গন্তব্যে পৌঁছাল, লিখুন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু বললেন, আমার
        Laptop এ সব App খোলে কিন্তু কোনো Website আসে না। Gateway এর ধারণা দিয়ে
        তাঁকে বোঝান প্রথমে কী মিলিয়ে দেখা উচিত আর কেন।
      </span>,
    ],
    deliverables: [
      <span key="1">আপনার Gateway এর ঠিকানা, আর Ping এর ফল</span>,
      <span key="2">IP আর Gateway পাশাপাশি, আর কেন এক Network এ থাকা জরুরি</span>,
      <span key="3">traceroute এর প্রথম Hop আর মোট Hop সংখ্যা</span>,
      <span key="4">Internet নেই সমস্যায় Gateway কেন প্রথম সন্দেহ, ৫ লাইন</span>,
    ],
  },
};
