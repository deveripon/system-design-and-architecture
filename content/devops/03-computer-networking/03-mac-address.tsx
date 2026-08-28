/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  HopMacLab,
  SwitchLearnLab,
} from "../../../components/course/topics/mac/animations";
import {
  MacAnatomyDiagram,
  MacVsIpSplit,
  SwitchTableDiagram,
} from "../../../components/course/topics/mac/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const macAddressContent: TopicData = {
  id: "mac-address",
  introduction: {
    badge: "MODULE 03 · LESSON 03",
    title: <SectionTitle>প্রতিটা Card এর জন্মদাগ</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে Switch এর একটা চালাকির কথা বলেছিলাম, সে একটা টেবিলে মনে
          রাখে কে কোন তারে বসে। কিন্তু সেই টেবিলে কী দিয়ে সে যন্ত্রগুলোকে আলাদা
          করে চেনে? দুইটা একই মডেলের Laptop তো দেখতে হুবহু এক। Switch তাদের
          গুলিয়ে ফেলে না কেন? উত্তরটা এই লেসনের বিষয়, MAC Address।
        </ContentParagraph>
        <ContentParagraph>
          ব্যাপারটা এমন, পৃথিবীর প্রতিটা Network Card, মানে যে অংশটা দিয়ে একটা
          যন্ত্র তারে বা Wi-Fi তে জোড়া লাগে, তার একটা নিজস্ব নম্বর আছে। নম্বরটা
          কারখানাতেই গেঁথে দেওয়া হয়, জন্মদাগের মতো, আর পৃথিবীতে আর কোনো Card
          এর ঠিক ওই নম্বর নেই। আপনার Laptop, আপনার Phone, প্রত্যেকের আলাদা।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন ছোট, কিন্তু একটা পুরনো ধাঁধার উত্তর এখানে আছে। Module 02 এ
          বলেছিলাম, একটা চিঠির চূড়ান্ত গন্তব্য পুরো পথে এক থাকে, কিন্তু হাতে
          হাতে দেওয়ার ঠিকানা প্রতি ধাপে বদলায়, আর সেই বদলে যাওয়া ঠিকানার নাম
          MAC। এবার সেটা পুরোপুরি পরিষ্কার হবে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "IP Address বলে চিঠিটা শেষমেশ কোথায় যাবে। MAC Address বলে এই মুহূর্তে ঠিক পাশের কার হাতে দিতে হবে। একটা চূড়ান্ত গন্তব্য, একটা পরের হাত।",
      author: "Computer Networking",
      role: "Lesson 03",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "what",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা MAC Address এর ভেতরে কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা MAC Address দেখতে এমন, a4:83:e7:2b:11:0c। ছয় জোড়া সংখ্যা
                আর অক্ষর, কোলন দিয়ে আলাদা করা। প্রতিটা জোড়া একটা Byte, তাই মোট
                ছয় Byte, মানে ৪৮টা Bit। সংখ্যাগুলো ০ থেকে ৯ আর a থেকে f
                পর্যন্ত, কারণ এটা Hexadecimal, যেটা Lesson 01 এ দেখেছিলেন।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু ছয় জোড়াটা এলোমেলো নয়, তার একটা গঠন আছে। প্রথম তিন
                জোড়া বলে কোন কোম্পানি Card টা বানিয়েছে, আর শেষ তিন জোড়া ওই
                কোম্পানির দেওয়া একটা নম্বর।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MacAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              মজার ব্যাপার, প্রথম তিন জোড়া দিয়ে আপনি বলে দিতে পারেন কোন
              কোম্পানির Card। Apple, Samsung, Intel, প্রত্যেকের নিজের একটা কোড
              আছে, আর সেই কোড একটা পাবলিক তালিকায় লেখা থাকে। তাই a4:83:e7 দেখে
              জানা যায় এটা কোন কোম্পানির। আর শেষ তিন জোড়া দিয়ে ওই কোম্পানি
              তাদের বানানো কোটি কোটি Card এর মধ্যে এই একটাকে আলাদা করে। দুইটা
              মিলিয়ে পৃথিবীতে অনন্য।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "MAC এর সবচেয়ে জরুরি দুইটা কথা",
          content: (
            <p>
              এক, এটা Hardware এর সাথে গাঁথা, কারখানায় বসানো, তাই এটা যন্ত্রের
              একটা স্থায়ী পরিচয়, ঠিক জন্মদাগের মতো। দুই, এটা সমতল, মানে এর
              ভেতরে কোনো এলাকার হিসাব নেই। a4:83:e7 দেখে বলা যায় কোন কোম্পানি,
              কিন্তু যন্ত্রটা কোন দেশে বা কোন শহরে, তার কোনো ইঙ্গিত নেই। এই সমতল
              ব্যাপারটাই পরে গুরুত্বপূর্ণ হবে, যখন IP এর সাথে তুলনা করব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "switch-table",
      subHeader: { index: "002", title: "The Switch Table" },
      title: <SectionTitle>Switch এর সেই মুখস্থ টেবিল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার আগের লেসনের সুতো ধরি। Switch একটা টেবিলে মনে রাখে কে কোন Port
              এ বসা, বলেছিলাম। এখন বলতে পারি সেই টেবিলের চাবি ঠিক কী, MAC
              Address। টেবিলের প্রতিটা সারিতে লেখা থাকে, এই MAC ওয়ালা যন্ত্র এই
              Port এ বসা।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SwitchTableDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              যখন একটা চিঠি আসে, তার খামে গন্তব্যের MAC লেখা থাকে। Switch সেই
              MAC টেবিলে খোঁজে, পেলে ঠিক সেই Port এ পাঠায়, বাকি কাউকে নয়। MAC
              ছাড়া Switch এই টেবিল বানাতেই পারত না, আর তখন সে অন্ধের মতো সবাইকে
              কপি করে Hub এ পরিণত হতো। মানে Switch এর পুরো চালাকিটা এই MAC এর
              উপর দাঁড়িয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কিন্তু Switch টেবিলটা পায় কোথা থেকে",
          content: (
            <p>
              কেউ Switch এ বসে টেবিল লিখে দেয় না। Switch নিজে শেখে, আর সেটা
              একটা সুন্দর সহজ উপায়ে, প্রতিটা চিঠির উৎস MAC দেখে। নিচের লাবে ঠিক
              এই শেখার প্রক্রিয়াটা দেখবেন, খালি টেবিল থেকে ভরা টেবিল পর্যন্ত।
            </p>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SwitchLearnLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "mac-vs-ip",
      subHeader: { index: "003", title: "MAC vs IP" },
      title: <SectionTitle>নাম আর ঠিকানা, দুই কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার এই লেসনের সবচেয়ে জরুরি কথা, MAC আর IP এর তফাত। দুইটাই
                ঠিকানা, কিন্তু দুই সম্পূর্ণ আলাদা কাজের। এই তফাতটা বুঝলে অনেক
                কিছু জায়গামতো বসে যায়।
              </ContentParagraph>
              <ContentParagraph>
                একটা চিঠির কথা ভাবুন যেটা কয়েকজন ডাকপিয়নের হাত ঘুরে যায়।
                খামের উপরে লেখা চূড়ান্ত ঠিকানা পুরো পথে এক থাকে, নাহলে চিঠি
                হারিয়ে যাবে। এটাই IP Address, চূড়ান্ত গন্তব্য, শুরু থেকে শেষ।
                কিন্তু এক ডাকপিয়ন থেকে পরের ডাকপিয়নের হাতে দেওয়ার মুহূর্তে,
                এই মুহূর্তে ঠিক কে কাকে দিচ্ছে, সেটা প্রতিবার আলাদা। এটাই MAC,
                এই এক ধাপের, হাতে হাতে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MacVsIpSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>IP চূড়ান্ত গন্তব্য, MAC পরের হাত:</strong> IP বলে
                চিঠিটা শেষমেশ কোথায় পৌঁছাবে। MAC বলে এই মুহূর্তে ঠিক পাশের কার
                হাতে দিতে হবে, পরের এক ধাপ।
              </ListItem>
              <ListItem>
                <strong>IP এক থাকে, MAC বদলায়:</strong> পুরো পথে IP একই, কিন্তু
                প্রতিটা Router চিঠি পেয়ে পুরনো MAC ফেলে নতুন বসায়, কারণ পরের
                হাত এখন অন্য কেউ।
              </ListItem>
              <ListItem>
                <strong>MAC সমতল, IP এলাকাভিত্তিক:</strong> MAC এ কোনো এলাকার
                হিসাব নেই, তাই সেটা দিয়ে দূরের পথ খোঁজা যায় না। IP এলাকা
                অনুযায়ী সাজানো, তাই সেটা দিয়ে পথ চেনা যায়। এই কারণেই দূরের
                যাত্রায় IP লাগে, আর কাছের হাতবদলে MAC। IP এর গঠন Lesson 05।
              </ListItem>
            </ContentList>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HopMacLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এবার M02 এর সেই ঝুলে থাকা প্রশ্নের উত্তর",
          content: (
            <p>
              Module 02 এর Lesson 05 এ বলেছিলাম, চূড়ান্ত গন্তব্য এক থাকে কিন্তু
              হাতে হাতে দেওয়ার ঠিকানা বদলায়, আর সেটা Module 03 এ বুঝবেন। এই
              সেই জায়গা। চূড়ান্ত গন্তব্যটা IP, পুরো পথে এক। হাতে হাতে দেওয়ার
              ঠিকানাটা MAC, প্রতি Hop এ নতুন। দুইটা দুই কাজ করে বলেই একটা চিঠি
              হাজার কিলোমিটার পাড়ি দিয়েও ঠিক জায়গায় পৌঁছায়, আর প্রতিটা
              মাঝের যন্ত্র জানে পরের হাত ঠিক কার।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "how-learned",
      subHeader: { index: "004", title: "One Gap" },
      title: <SectionTitle>একটা ফাঁক, যেটা পরের লেসন ভরবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন একটা প্রশ্ন নিশ্চয়ই মাথায় এসেছে। আপনি যখন একটা Website
                খোলেন, আপনি তো IP বা MAC কিছুই লেখেন না, শুধু একটা নাম। আর ধরুন
                আপনার Laptop বাসার Router কে চিঠি দিতে চায়, সে Router এর IP
                জানে, কিন্তু চিঠির খামে তো পরের হাতের MAC লিখতে হবে। সেই MAC টা
                সে পায় কোথা থেকে?
              </ContentParagraph>
              <ContentParagraph>
                এটা একটা সত্যিকারের ফাঁক, আর এটাই পরের লেসনের পুরো বিষয়।
                ব্যাপারটা এমন, আপনার যন্ত্র জানে পরের হাতের IP, কিন্তু চিঠি
                পাঠাতে দরকার তার MAC। এই IP থেকে MAC বের করার কাজটা করে একটা ছোট
                প্রোটোকল, যার নাম ARP। সে মূলত LAN এ চেঁচিয়ে জিজ্ঞেস করে, এই IP
                টা কার, তার MAC কী? আর যার সেই IP, সে উত্তর দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "তাহলে ছবিটা এখন দাঁড়াল",
          content: (
            <p>
              IP আপনি জানেন, সেটা নাম থেকে আসে (DNS, Module 04)। কিন্তু চিঠি
              হাতে হাতে দিতে লাগে MAC। IP থেকে সেই MAC বের করে ARP, পরের লেসন।
              তারপর Switch সেই MAC দেখে ঠিক Port এ পাঠায়, এই লেসন। তিনটা টুকরো,
              তিনটা লেসন, আর একসাথে জোড়া লাগলে একটা চিঠি LAN এর ভেতরে ঠিক
              জায়গায় পৌঁছায়। পরের লেসনে আমরা এই ARP এর চেঁচিয়ে জিজ্ঞেস করাটা
              দেখব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>MAC আর Island Tours</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একজন Backend Developer হিসেবে আপনি MAC নিয়ে রোজ মাথা ঘামাবেন
                না, কারণ এটা অনেক নিচের স্তরের ব্যাপার, Kernel আর যন্ত্র
                সামলায়। কিন্তু কয়েকটা জায়গায় এটা হঠাৎ সামনে চলে আসে, আর তখন
                না জানলে বিপদ।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একই LAN এ MAC, বাইরে গেলে হারিয়ে যায়:</strong>{" "}
                  Island Tours এর API আর Database একই LAN এ, তাই তারা MAC দিয়ে
                  হাতে হাতে কথা বলে, দ্রুত। কিন্তু পর্যটকের Phone এর MAC কখনো
                  Singapore পর্যন্ত পৌঁছায় না, সেটা প্রথম Router এই মুছে যায়।
                  সার্ভার পর্যটকের MAC জানতেই পারে না, শুধু IP জানে।
                </ListItem>
                <ListItem>
                  <strong>Log এ MAC নয়, IP:</strong> এই কারণেই আপনার সার্ভারের
                  Log এ ইউজারের IP থাকে, MAC নয়। MAC LAN ছাড়ে না, তাই দূরের
                  ইউজারকে চিনতে IP ই একমাত্র সূত্র। কেউ যদি বলে MAC দিয়ে ইউজার
                  ট্র্যাক করব, সে ভুল ভাবছে, দূরের ইউজারের MAC আপনার কাছে
                  পৌঁছায়ই না।
                </ListItem>
                <ListItem>
                  <strong>Cloud এ MAC দিয়ে License:</strong> কিছু পুরনো
                  Software License যাচাই করত MAC দিয়ে, ধরে নিত MAC কখনো বদলায়
                  না। কিন্তু Cloud এ যন্ত্র বদলালে MAC ও বদলায়, তাই এমন License
                  Cloud এ ভেঙে পড়ে। এটা একটা চেনা ফাঁদ, আর MAC এর স্বভাব জানলে
                  এড়ানো যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MAC নিরাপত্তার ভরসা নয়",
          content: (
            <p>
              অনেকে ভাবেন MAC যেহেতু কারখানায় গাঁথা, সেটা দিয়ে নিরাপত্তা
              বানানো যায়, যেমন শুধু চেনা MAC কে ঢুকতে দেওয়া। কিন্তু MAC আসলে
              Software দিয়ে বদলে ফেলা যায়, যাকে বলে MAC Spoofing। তাই MAC কে
              পরিচয়ের সুবিধা হিসেবে ব্যবহার করা যায়, কিন্তু নিরাপত্তার একমাত্র
              ভরসা হিসেবে নয়। আসল নিরাপত্তা আসে অন্য স্তর থেকে, যেমন HTTPS আর
              সঠিক Authentication, যেগুলো পরের মডিউলগুলোতে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "request-flow",
      subHeader: { index: "006", title: "Step-by-step Flow" },
      title: <SectionTitle>এক LAN এ একটা চিঠি, MAC দিয়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনার Laptop বাসার আরেকটা যন্ত্রকে সরাসরি চিঠি দিল, একই LAN এর
              ভেতরে। MAC কীভাবে কাজে লাগল, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Laptop গন্তব্যের MAC বসাল",
              description:
                "Laptop চিঠির খামে দুইটা MAC লিখল, উৎস নিজের, গন্তব্য পরের যন্ত্রের। কীভাবে সে গন্তব্যের MAC পেল, সেটা ARP, পরের লেসন।",
            },
            {
              title: "চিঠি Switch এ পৌঁছাল",
              description:
                "তার বা Wi-Fi দিয়ে চিঠি বাসার বাক্সের Switch অংশে গেল। Switch খামের গন্তব্যের MAC পড়ল।",
            },
            {
              title: "Switch টেবিলে মেলাল",
              description:
                "Switch তার মুখস্থ টেবিলে ওই MAC খুঁজল, পেল এটা Port ৩ এর যন্ত্র। উৎস MAC দেখে সে Laptop এর Port ও মনে রাখল, যদি আগে না জানত।",
            },
            {
              title: "ঠিক Port এ পাঠাল",
              description:
                "Switch চিঠিটা শুধু Port ৩ এ পাঠাল, বাকি কাউকে নয়। MAC ছিল বলেই এই নিখুঁত বিলি সম্ভব হলো।",
            },
            {
              title: "গন্তব্য নিজের MAC চিনল",
              description:
                "Port ৩ এর যন্ত্র চিঠি পেল, খামের গন্তব্যের MAC নিজের সাথে মিলিয়ে দেখল, মিলল, তাই চিঠিটা গ্রহণ করল। মিললে নেয়, না মিললে ফেলে দেয়।",
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
                <strong>নিজের MAC দেখুন</strong>, নিচের Lab এ কমান্ড আছে। তারপর
                প্রথম তিন জোড়া একটা MAC Lookup সাইটে বসিয়ে দেখুন আপনার Card
                কোন কোম্পানির। বেশিরভাগ সময় আপনার Laptop এর ব্র্যান্ডই আসবে।
              </ListItem>
              <ListItem>
                <strong>PowerCert Animated Videos</strong>, MAC Address আর IP
                Address এর তফাত নিয়ে ছোট Animation।{" "}
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
                <strong>Computerphile</strong>, Search করুন: MAC Addresses, আর
                MAC vs IP।{" "}
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
                প্রতিটা Network Card এর একটা স্থায়ী নম্বর, MAC Address, ৪৮ Bit,
                ছয় জোড়া Hex। কারখানায় গাঁথা, পৃথিবীতে অনন্য।
              </ListItem>
              <ListItem>
                প্রথম তিন জোড়া কোন কোম্পানি বানিয়েছে, শেষ তিন জোড়া ওই
                কোম্পানির ভেতরে অনন্য নম্বর।
              </ListItem>
              <ListItem>
                MAC সমতল, এতে কোনো এলাকার হিসাব নেই। এই কারণেই দূরের পথ খোঁজা
                যায় না MAC দিয়ে।
              </ListItem>
              <ListItem>
                Switch এর মুখস্থ টেবিলের চাবি MAC। Switch নিজে শেখে, প্রতিটা
                চিঠির উৎস MAC দেখে, খালি টেবিল থেকে ভরা টেবিল।
              </ListItem>
              <ListItem>
                IP চূড়ান্ত গন্তব্য, পুরো পথে এক। MAC পরের হাত, প্রতি Hop এ
                নতুন। প্রতিটা Router পুরনো MAC ফেলে নতুন বসায়, IP ছোঁয় না।
              </ListItem>
              <ListItem>
                MAC LAN ছাড়ে না, তাই দূরের ইউজারের MAC আপনার সার্ভার জানে না,
                শুধু IP জানে। Log এ তাই IP, MAC নয়।
              </ListItem>
              <ListItem>
                MAC বদলে ফেলা যায় (Spoofing), তাই এটা নিরাপত্তার একমাত্র ভরসা
                নয়।
              </ListItem>
              <ListItem>
                পরের লেসন: IP জানা আছে, কিন্তু পরের হাতের MAC বের করতে হবে। সেই
                কাজটা করে ARP, LAN এ চেঁচিয়ে জিজ্ঞেস করে এই IP টা কার।
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
        <span className="font-bold text-primary">MAC Address</span>,
        "Network Card এর স্থায়ী নম্বর, ৪৮ Bit, কারখানায় গাঁথা",
      ],
      [
        <span className="font-bold text-primary">কোম্পানির কোড</span>,
        "প্রথম তিন জোড়া, কে বানিয়েছে",
      ],
      [
        <span className="font-bold text-primary">সমতল</span>,
        "MAC এ এলাকার হিসাব নেই, তাই দূরের পথ খোঁজা যায় না",
      ],
      [
        <span className="font-bold text-primary">Switch টেবিল</span>,
        "MAC থেকে Port, Switch নিজে শেখে উৎস MAC দেখে",
      ],
      [
        <span className="font-bold text-primary">IP বনাম MAC</span>,
        "IP চূড়ান্ত গন্তব্য (এক থাকে), MAC পরের হাত (বদলায়)",
      ],
      [
        <span className="font-bold text-primary">MAC LAN ছাড়ে না</span>,
        "প্রতি Router এ মুছে নতুন বসে, দূরে পৌঁছায় না",
      ],
      [
        <span className="font-bold text-primary">MAC Spoofing</span>,
        "MAC বদলে ফেলা যায়, তাই নিরাপত্তার ভরসা নয়",
      ],
      [
        <span className="font-bold text-primary">ARP</span>,
        "IP থেকে পরের হাতের MAC বের করে, পরের লেসন",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা MAC Address এর প্রথম তিন জোড়া কী বলে?",
        options: [
          {
            key: "A",
            text: "যন্ত্রটা কোন দেশে আছে",
            isCorrect: false,
            explanation:
              "MAC সমতল, এতে কোনো এলাকার হিসাব নেই। দেশ বা শহর MAC থেকে জানা যায় না।",
          },
          {
            key: "B",
            text: "কোন কোম্পানি Card টা বানিয়েছে",
            isCorrect: true,
            explanation:
              "প্রথম তিন জোড়া কোম্পানির কোড। a4:83:e7 দেখে বলা যায় কোন কোম্পানি, একটা পাবলিক তালিকা আছে।",
          },
          { key: "C", text: "যন্ত্রটা কত পুরনো", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "একটা Router একটা চিঠি পেল। সে IP আর MAC এর মধ্যে কোনটা বদলায়?",
        options: [
          {
            key: "A",
            text: "IP বদলায়, MAC এক থাকে",
            isCorrect: false,
            explanation:
              "উল্টো। চূড়ান্ত গন্তব্য IP এক থাকে পুরো পথে, নাহলে চিঠি হারাত।",
          },
          {
            key: "B",
            text: "MAC বদলায়, IP এক থাকে",
            isCorrect: true,
            explanation:
              "প্রতি Router পুরনো MAC ফেলে নতুন বসায়, কারণ পরের হাত এখন অন্য কেউ। চূড়ান্ত IP ছোঁয় না।",
          },
          {
            key: "C",
            text: "দুইটাই বদলায়",
            isCorrect: false,
            explanation:
              "IP বদলালে চূড়ান্ত গন্তব্য হারিয়ে যেত। শুধু হাতে হাতের ঠিকানা MAC বদলায়।",
          },
        ],
      },
      {
        id: 3,
        text: "Switch তার টেবিলটা কীভাবে বানায়, কে কোন Port এ?",
        options: [
          {
            key: "A",
            text: "কেউ বসে হাতে লিখে দেয়",
            isCorrect: false,
            explanation: "কেউ লিখে দেয় না। Switch নিজে শেখে, একদম নিজে থেকে।",
          },
          {
            key: "B",
            text: "প্রতিটা চিঠির উৎস MAC দেখে নিজে শেখে",
            isCorrect: true,
            explanation:
              "চিঠি এলে Switch উৎস MAC আর কোন Port থেকে এলো মিলিয়ে শিখে ফেলে। খালি টেবিল থেকে ভরা।",
          },
          { key: "C", text: "ISP থেকে টেবিল ডাউনলোড করে", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "পর্যটক Singapore এর সার্ভারে বুকিং করলেন। সার্ভার কি পর্যটকের Phone এর MAC জানে?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, চিঠির সাথে MAC ও যায়",
            isCorrect: false,
            explanation:
              "না। MAC প্রথম Router এই মুছে যায়, LAN ছাড়ে না। দূর পর্যন্ত পৌঁছায় না।",
          },
          {
            key: "B",
            text: "না, MAC LAN ছাড়ে না, সার্ভার শুধু IP জানে",
            isCorrect: true,
            explanation:
              "এই কারণেই Log এ IP থাকে, MAC নয়। দূরের ইউজারকে MAC দিয়ে চেনা যায় না।",
          },
          {
            key: "C",
            text: "হ্যাঁ, যদি HTTPS ব্যবহার হয়",
            isCorrect: false,
            explanation:
              "HTTPS এর সাথে MAC এর সম্পর্ক নেই। MAC এমনিতেই LAN ছাড়ে না।",
          },
        ],
      },
      {
        id: 5,
        text: "একজন বলল, শুধু চেনা MAC কে ঢুকতে দিয়ে Network পুরো নিরাপদ করব। এটা কি যথেষ্ট?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, MAC তো কারখানায় গাঁথা, বদলায় না",
            isCorrect: false,
            explanation:
              "MAC Software দিয়ে বদলে ফেলা যায়, যাকে বলে Spoofing। তাই এটা একমাত্র ভরসা হতে পারে না।",
          },
          {
            key: "B",
            text: "না, MAC বদলে ফেলা যায়, তাই এটা একা যথেষ্ট নয়",
            isCorrect: true,
            explanation:
              "MAC পরিচয়ের সুবিধা দেয়, কিন্তু নিরাপত্তার একমাত্র স্তর নয়। আসল ভরসা HTTPS আর Authentication।",
          },
          {
            key: "C",
            text: "হ্যাঁ, MAC পৃথিবীতে অনন্য বলে নিরাপদ",
            isCorrect: false,
            explanation:
              "অনন্য হলেও বদলানো যায়। অনন্যতা আর অপরিবর্তনীয়তা এক জিনিস নয়।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের MAC আর Switch এর টেবিল দেখুন",
    subtitle: "Terminal এ চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের MAC দেখুন",
        description:
          "আপনার Laptop এর Network Card এর MAC বের করুন, আর ছয় জোড়া সংখ্যাটা লক্ষ করুন।",
      },
      {
        title: "কোন কোম্পানির Card",
        description:
          "MAC এর প্রথম তিন জোড়া একটা Lookup সাইটে বসিয়ে দেখুন আপনার Card কোন কোম্পানির।",
      },
      {
        title: "LAN এর প্রতিবেশীদের MAC",
        description:
          "arp টেবিলে আপনার LAN এর যন্ত্রগুলোর MAC দেখুন। এরা সবাই আপনার ভেতরের দুনিয়ার।",
      },
      {
        title: "Wi-Fi আর তারের MAC আলাদা",
        description:
          "আপনার Laptop এর একাধিক Network Card থাকলে (Wi-Fi আর Ethernet), প্রত্যেকের আলাদা MAC দেখুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-my-mac.sh",
        language: "bash",
        code: `# আপনার সব Network Card আর তাদের MAC
ifconfig | grep ether           # macOS
ip link | grep link/ether       # Linux
# ether এর পরের সংখ্যাটাই MAC, যেমন a4:83:e7:2b:11:0c

# শুধু Wi-Fi কার্ডের (সাধারণত en0 বা wlan0)
ifconfig en0 | grep ether       # macOS
# ছয় জোড়া সংখ্যা, কোলন দিয়ে আলাদা। এটাই আপনার Card এর জন্মদাগ।`,
      },
      {
        filename: "2-who-made-it.md",
        language: "markdown",
        code: `# আপনার Card কোন কোম্পানির, প্রথম তিন জোড়া দিয়ে বের করুন

১. আপনার MAC এর প্রথম তিন জোড়া নিন, যেমন a4:83:e7
২. একটা MAC Vendor Lookup সাইটে যান, যেমন:
     https://maclookup.app
     বা Google এ লিখুন: "a4:83:e7 mac vendor"
৩. যে কোম্পানির নাম আসবে, সেটাই আপনার Card বানিয়েছে

বেশিরভাগ সময় আপনার Laptop এর ব্র্যান্ডই আসবে (Apple, Dell, ...),
কারণ তারাই Card টা বসিয়েছে। এই তিন জোড়াকে বলে OUI,
মানে কোম্পানির অনন্য কোড।`,
      },
      {
        filename: "3-neighbours-mac.sh",
        language: "bash",
        code: `# আপনার LAN এর যন্ত্রগুলোর MAC, Switch যাদের টেবিলে রাখে
arp -a
# প্রতিটা লাইনে একটা IP আর তার পাশে একটা MAC।
# যেমন: ? (192.168.0.1) at a4:83:e7:2b:11:0c on en0
#
# এখানে আপনি IP আর MAC এর জোড়া দেখছেন, যেটা আসলে ARP এর ফল,
# পরের লেসনের বিষয়। এই টেবিলই আপনার যন্ত্রের নিজের ছোট মেমো,
# কোন IP এর পাশে কোন MAC, যাতে বারবার জিজ্ঞেস করতে না হয়।`,
      },
      {
        filename: "4-two-cards.sh",
        language: "bash",
        code: `# একটা Laptop এ প্রায়ই একাধিক Network Card, প্রত্যেকের আলাদা MAC
# macOS:
networksetup -listallhardwareports
# প্রতিটা Port এর নিচে তার নিজের Ethernet Address, মানে MAC

# Linux:
ip link
# eth0, wlan0, প্রত্যেকের নিজের link/ether

# খেয়াল করুন, Wi-Fi আর তারের Card এর MAC সম্পূর্ণ আলাদা।
# কারণ MAC যন্ত্রের নয়, প্রতিটা Card এর নিজের।
# একই Laptop, দুইটা Card, দুইটা MAC।`,
      },
    ],
    tip: "দুই নম্বর পরীক্ষাটা সবচেয়ে মজার, কারণ আপনি নিজের চোখে দেখবেন MAC এর ভেতরে সত্যিই একটা কোম্পানির পরিচয় লুকানো। আপনার MAC এর প্রথম তিন জোড়া একটা Lookup সাইটে বসালেই আপনার Laptop এর ব্র্যান্ডের নাম বেরিয়ে আসবে, আর তখন বুঝবেন এই সংখ্যাটা এলোমেলো নয়, তার একটা গঠন আছে। এই ছোট পরীক্ষাটা MAC কে বিমূর্ত সংখ্যা থেকে একটা বাস্তব জিনিসে বদলে দেয়।",
  },
  assignment: {
    title: "Mini Project: MAC এর ময়নাতদন্ত",
    time: "৪৫ মিনিট",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>নিজের সব MAC:</strong> Lab এর এক আর চার নম্বর চালিয়ে আপনার
        Laptop এর প্রতিটা Network Card এর MAC লিখুন। কয়টা Card পেলেন? Wi-Fi আর
        তারেরটা কি আলাদা?
      </span>,
      <span key="2">
        <strong>কোম্পানি খুঁজুন:</strong> প্রতিটা MAC এর প্রথম তিন জোড়া Lookup
        সাইটে বসিয়ে কোম্পানির নাম লিখুন। আপনার Laptop এর ব্র্যান্ডের সাথে মিলল?
      </span>,
      <span key="3">
        <strong>IP আর MAC জোড়া:</strong> arp -a চালিয়ে আপনার LAN এর তিনটা
        যন্ত্রের IP আর MAC লিখুন। তারপর এক লাইনে লিখুন, এই দুইটার মধ্যে কোনটা এই
        যন্ত্র LAN ছাড়লে বদলে যাবে, আর কেন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু বললেন, IP আর
        MAC তো একই জিনিস, দুইটাই ঠিকানা। তাঁকে তফাতটা বোঝান, ডাকপিয়নের হাতে
        হাতে চিঠি দেওয়ার উদাহরণ ব্যবহার করতে পারেন।
      </span>,
    ],
    deliverables: [
      <span key="1">আপনার সব Network Card আর তাদের MAC</span>,
      <span key="2">প্রতিটা MAC এর কোম্পানির নাম</span>,
      <span key="3">তিনটা IP আর MAC জোড়া, আর কোনটা বদলায় তার ব্যাখ্যা</span>,
      <span key="4">IP বনাম MAC নিয়ে ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
