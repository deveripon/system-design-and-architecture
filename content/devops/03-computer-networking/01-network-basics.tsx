/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  InsideOrOutLab,
  ScaleLab,
} from "../../../components/course/topics/netbasics/animations";
import {
  LanVsWanSplit,
  NestedNetworksDiagram,
  ScaleLadderDiagram,
} from "../../../components/course/topics/netbasics/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const networkBasicsContent: TopicData = {
  id: "network-basics",
  introduction: {
    badge: "MODULE 03 · LESSON 01",
    title: <SectionTitle>নিজের উঠান আর বাইরের রাস্তা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের মডিউলে আমরা একটা Request কে সৈকত থেকে Singapore পর্যন্ত অনুসরণ
          করেছি। পুরো পথে একটা শব্দ বারবার এসেছে, ঠিকানা। কিন্তু ঠিকানা আসলে কী,
          কীভাবে কাজ করে, দুইটা মেশিন একে অন্যকে খুঁজে পায় কীভাবে, এসব আমরা ধরে
          নিয়ে এগিয়ে গেছি। এই মডিউল পুরোটাই সেই ধরে নেওয়া জিনিসটা খুলে দেখার,
          মানে Networking এর ভেতরের কারিগরি।
        </ContentParagraph>
        <ContentParagraph>
          কিন্তু গভীরে ঢোকার আগে একটা সহজ কিন্তু শক্তিশালী ধারণা দরকার, যেটা এই
          পুরো মডিউলের ভিত্তি। আর সেটা হলো, একটা Network এর আকার তার স্বভাব বদলে
          দেয়। আপনার বাসার ছোট Network আর গোটা Internet, দুইটাই Network, কিন্তু
          দুইটা সম্পূর্ণ আলাদা চরিত্রের।
        </ContentParagraph>
        <ContentParagraph>
          একটা উদাহরণে ভাবুন। আপনার বাসার উঠান আর শহরের রাস্তা, দুইটাই জায়গা
          যেখানে হাঁটা যায়। কিন্তু উঠানটা আপনার, সেখানে আপনি নিশ্চিন্তে হাঁটেন,
          চেনা সবাই। রাস্তাটা সবার, সেখানে আপনি একটু সাবধানে হাঁটেন, অচেনা ভিড়।
          Network ও ঠিক এমন, আর এই লেসনে আমরা এই দুই দুনিয়ার তফাতটা বুঝব।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "একটা Network এর আকারই ঠিক করে দেয় সেটা কতটা দ্রুত, কার মালিকানায়, আর কতটা নিরাপদ। ভেতরের ছোট দুনিয়া সবদিক থেকে সস্তা, বাইরের বড় দুনিয়া সবদিক থেকে দামি।",
      author: "Computer Networking",
      role: "Lesson 01",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "what",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>আকার অনুযায়ী নেটওয়ার্কের নাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 02 এর প্রথম লেসনে দেখেছিলেন, দুই বা তার বেশি মেশিন কথা
                বলতে পারলেই সেটা একটা Network। কিন্তু সব Network এক নয়। একটা
                Network কতটুকু এলাকা জুড়ে ছড়ানো, তার উপর তার একটা নাম বদলায়,
                আর সেই নামের সাথে তার পুরো চরিত্রও বদলায়।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে ছোট থেকে সবচেয়ে বড়, কয়েকটা নাম আছে। কিন্তু ঘাবড়াবেন
                না, নামগুলো মুখস্থ করার দরকার নেই। শুধু দুইটা সত্যিকারের কাজে
                লাগে, আর বাকিগুলো শুধু চিনে রাখলেই হবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ScaleLadderDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>LAN, Local Area Network:</strong> এটাই সবচেয়ে বেশি
                লাগবে। এক বিল্ডিং, এক বাসা, এক অফিসের ছোট Network। আপনার বাসার
                Wi-Fi একটা LAN, যেখানে Laptop, Phone, TV সব একটা Router এ জোড়া।
                এটা আপনার নিজের, দ্রুত, আর মোটামুটি চেনা।
              </ListItem>
              <ListItem>
                <strong>WAN, Wide Area Network:</strong> এটাও খুব লাগবে। দেশ,
                মহাদেশ, বা গোটা পৃথিবী জুড়ে ছড়ানো বিশাল Network। Internet
                নিজেই পৃথিবীর সবচেয়ে বড় WAN। এটা কারো একার নয়, ধীর, আর অচেনা।
              </ListItem>
              <ListItem>
                <strong>MAN, Metropolitan Area Network:</strong> এটা মাঝামাঝি,
                এক শহরজুড়ে। আপনার ISP এর শহরের জালটা মোটামুটি একটা MAN। নামটা
                চিনে রাখুন, কিন্তু কাজে LAN আর WAN এর মতো ঘনঘন আসবে না।
              </ListItem>
              <ListItem>
                <strong>PAN, Personal Area Network:</strong> সবচেয়ে ছোট, আপনার
                শরীরের কাছাকাছি। Phone আর Bluetooth Earbud এর মধ্যেকার সংযোগটা
                একটা PAN। এটাও শুধু চিনে রাখার জন্য।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "পুরো মডিউলে শুধু দুইটা শব্দ মনে রাখলেই চলবে",
          content: (
            <p>
              LAN আর WAN। LAN মানে আপনার নিজের ছোট দুনিয়া, বাসা বা অফিস। WAN
              মানে বাইরের বিশাল দুনিয়া, Internet। এই পুরো মডিউলের প্রায়
              প্রতিটা লেসন আসলে একটা প্রশ্নের উত্তর, LAN এর ভেতরে জিনিস কীভাবে
              চলে, আর LAN থেকে WAN এ বেরোনোর সময় কী কী লাগে। বাকি নামগুলো ভুলে
              গেলেও ক্ষতি নেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "scale",
      subHeader: { index: "002", title: "Visual Explanation" },
      title: <SectionTitle>এলাকা বাড়ালে সবকিছু বদলায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নাম মুখস্থ করার চেয়ে জরুরি হলো বোঝা, আকার বদলালে কী কী বদলায়।
              নিচের হাতলটা টানুন, এক ঘর থেকে গোটা পৃথিবী পর্যন্ত, আর দেখুন
              প্রতিটা ধাপে চারটা জিনিস কীভাবে বদলে যায়, গতি, মালিকানা, বিশ্বাস,
              আর খরচ।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ScaleLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা প্যাটার্ন নিশ্চয়ই চোখে পড়েছে। এলাকা যত বড় হয়, ততই সবকিছু
              খারাপ দিকে যায়। দূরত্ব বাড়ে বলে দেরি বাড়ে, Lesson 04 এ Latency
              তে যা দেখেছিলেন। মালিকানা আপনার হাত থেকে অন্যের হাতে যায়। অচেনা
              মানুষ ঢুকে পড়ে, তাই নিরাপত্তার চিন্তা বাড়ে। আর রাস্তা ভাড়া করতে
              হয় বলে টাকা লাগে। এই চারটা একসাথে বাড়ে, এলাকার সাথে সাথে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "lan-vs-wan",
      subHeader: { index: "003", title: "Inside vs Outside" },
      title: <SectionTitle>ভেতরের দুনিয়া, বাইরের দুনিয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার শুধু দুইটার উপর মন দিই, LAN আর WAN, কারণ বাকি মডিউল এই
                দুইটার চারপাশেই ঘোরে। এদের তফাতটা শুধু আকারের নয়, চরিত্রের।
                একটা আপনার নিজের উঠান, একটা বাইরের রাস্তা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LanVsWanSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই তফাতটা নিছক তত্ত্ব নয়, প্রতিদিনের সিদ্ধান্তে ঢোকে। আপনার
              বাসায় দুইটা যন্ত্রের মধ্যে বড় ফাইল পাঠানো এক পলকে হয়, কারণ সেটা
              LAN এ থাকে, আর Internet বন্ধ থাকলেও চলে। কিন্তু একটা Website খুলতে
              সময় লাগে, কারণ সেটা WAN এ যায়। একই কাজ, শুধু এক জায়গায় ভেতরে,
              আরেক জায়গায় বাইরে, আর সেই তফাতেই সব বদলে যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একটা কথা যেটা এই মডিউলের পরে বারবার লাগবে",
          content: (
            <p>
              যেকোনো দুইটা যন্ত্রের কথা শুনে নিজেকে জিজ্ঞেস করুন, এই কথাটা কি
              একই LAN এ থাকছে, নাকি WAN এ বেরোচ্ছে? উত্তরটা সাথে সাথে অনেক কিছু
              বলে দেয়। ভেতরে থাকলে দ্রুত, বিনামূল্যে, নিরাপদ। বাইরে গেলে ধীর,
              Data খরচ, আর সাবধানতা দরকার। ভালো ইঞ্জিনিয়াররা তাই যতটা সম্ভব কাজ
              LAN এ রাখেন, আর WAN এ যাওয়াটা কমান।
            </p>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <InsideOrOutLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "nested",
      subHeader: { index: "004", title: "Nested" },
      title: <SectionTitle>আপনার Laptop কোথায় বসে আছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                LAN আর WAN আলাদা দুইটা জিনিস নয় যেন দুইটা আলাদা জগৎ। বরং একটা
                আরেকটার ভেতরে বসানো, ঠিক যেমন বাসা থাকে পাড়ার ভেতরে, পাড়া থাকে
                শহরের ভেতরে, শহর থাকে দেশের ভেতরে। আপনার Laptop একা কোথাও ভাসছে
                না, সে কয়েকটা স্তরের ভেতরে বসে আছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NestedNetworksDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই ছবিটা মাথায় গেঁথে নিন, কারণ পরের প্রতিটা লেসন আসলে এই
              স্তরগুলোর কোনো একটা সীমানা নিয়ে। Lesson 03, MAC Address, LAN এর
              ভেতরে যন্ত্র চেনার ব্যাপার। Lesson 05, IP Address, পুরো Internet
              জুড়ে ঠিকানা। Lesson 08, Gateway, LAN থেকে WAN এ বেরোনোর সেই
              দরজাটা, ছবিতে যেটা Router। প্রতিটা লেসন এই ছবির একটা সীমানা পার
              হওয়ার গল্প।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Router হলো ভেতর আর বাইরের সীমানা",
          content: (
            <p>
              ছবিতে খেয়াল করুন, LAN থেকে বাইরে বেরোনোর একটাই পথ, Router। আপনার
              বাসার সব যন্ত্রের বাইরের দুনিয়ায় যাওয়ার একমাত্র দরজা এই Router।
              ভেতরের কথা Router পর্যন্ত গিয়েই ঘুরে আসে, আর বাইরের কথা Router
              দিয়ে বেরোয়। এই দরজাটার আসল নাম Default Gateway, আর তার পুরো কাজ
              Lesson 08 এ। আপাতত শুধু মনে রাখুন, ভেতর আর বাইরের মাঝখানে একটা
              দরজা আছে, আর প্রতিটা যন্ত্র জানে সেই দরজা কোথায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>Island Tours এর LAN আর WAN</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই LAN আর WAN এর তফাত Island Tours এর গঠনে সরাসরি ঢুকে আছে, আর
                একজন Backend Developer হিসেবে আপনি প্রতিদিন এই সিদ্ধান্তগুলো
                নেবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>API আর Database এক LAN এ:</strong> Island Tours এর API
                  আর PostgreSQL একই Datacenter এ, একই ছোট Network এ, মানে একটা
                  LAN এ। এই কারণেই API আর Database এর মধ্যে কথা এত দ্রুত, কয়েক
                  মিটার তার। যদি Database অন্য শহরে WAN এর ওপারে থাকত, প্রতিটা
                  Query তে সমুদ্র পার হতে হতো, আর সাইট অচল হয়ে যেত।
                </ListItem>
                <ListItem>
                  <strong>Database বাইরের দুনিয়া থেকে লুকানো:</strong> Lesson
                  03 এ দেখেছিলেন Database শুধু 127.0.0.1 এ শোনে। এখন কারণটা
                  পরিষ্কার, Database কে LAN এর ভেতরে রাখা হয়, বাইরের WAN থেকে
                  সে অদৃশ্য। বাইরের কেউ তার কাছে পৌঁছাতেই পারে না, কারণ সে
                  ভেতরের দুনিয়ার বাসিন্দা।
                </ListItem>
                <ListItem>
                  <strong>শুধু API বাইরে খোলা:</strong> পর্যটকরা WAN থেকে আসেন,
                  তাই একটা দরজা বাইরে খোলা রাখতেই হয়, সেটা API। কিন্তু ওই এক
                  দরজাতেই সব পাহারা, কারণ ওটাই ভেতর আর বাইরের সীমানা। ভেতরের
                  বাকি সবকিছু, Database, Cache, LAN এর নিরাপদ ভেতরে।
                </ListItem>
                <ListItem>
                  <strong>bKash আরেক LAN, তাই WAN পেরিয়ে:</strong> bKash এর
                  সার্ভার তাদের নিজের LAN এ, Dhaka তে। Island Tours এর API থেকে
                  সেখানে যেতে হলে WAN পেরোতে হয়, এক LAN থেকে বেরিয়ে আরেক LAN এ
                  ঢোকা। এই কারণেই বাইরের প্রতিটা কোম্পানির সাথে কথায় ধীরগতি,
                  Timeout, আর নিরাপত্তার বাড়তি চিন্তা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা নিয়ম যা সারাজীবন কাজে লাগবে",
          content: (
            <p>
              যা কিছু একসাথে কাজ করে আর দ্রুত কথা বলা দরকার, সেগুলো একই LAN এ
              রাখুন। API আর Database, API আর Cache, এরা এক LAN এ থাকলে দ্রুত আর
              নিরাপদ। আর বাইরের দুনিয়ার জন্য যত কম দরজা খোলা যায় তত ভালো, কারণ
              প্রতিটা খোলা দরজা একটা ঝুঁকি। ভেতরে যত বেশি, বাইরে যত কম, তত দ্রুত
              আর তত নিরাপদ। এই এক নীতি থেকেই বড় বড় System এর নকশা শুরু হয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "request-flow",
      subHeader: { index: "006", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা কথা কখন LAN ছাড়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটক বুকিং করলেন। সেই এক বুকিং এ কথাটা কখন LAN এ থাকে আর কখন WAN
              এ বেরোয়, ধাপে ধাপে দেখুন। প্রতিটা সীমানা পার হওয়ার সাথে সাথে গতি
              আর নিরাপত্তা বদলায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Phone থেকে বাসার Router",
              description:
                "পর্যটকের Phone প্রথমে তার নিজের LAN এর Router এ কথা দিল। এই ধাপটা LAN এর ভেতরে, দ্রুত।",
            },
            {
              title: "Router LAN ছাড়ল, WAN এ ঢুকল",
              description:
                "Router বুঝল এই কথা বাইরের, তাই সেটা ISP এর দিকে ঠেলল। এখানেই LAN শেষ, WAN শুরু। গতি কমল, অচেনা দুনিয়া শুরু।",
            },
            {
              title: "সমুদ্র পেরিয়ে Singapore",
              description:
                "পুরো WAN যাত্রা, ISP, IIG, সমুদ্রের তার। এটাই বাইরের দুনিয়া, সবচেয়ে ধীর অংশ, Lesson 05 এর পথ।",
            },
            {
              title: "Datacenter এর গেট, আবার একটা LAN",
              description:
                "Singapore এ পৌঁছে কথাটা Datacenter এর নিজের LAN এ ঢুকল। এখন আবার ভেতরের দুনিয়া, তাদের LAN।",
            },
            {
              title: "API আর Database, একই LAN এ",
              description:
                "API Database কে জিজ্ঞেস করল। দুইটাই এক LAN এ, তাই এই কথা আবার দ্রুত, কয়েক মিটার তার। WAN এর ধীরগতি এখানে নেই।",
            },
            {
              title: "উত্তর একই পথে, LAN, WAN, LAN",
              description:
                "উত্তর Datacenter এর LAN থেকে বেরিয়ে WAN পেরিয়ে আবার পর্যটকের LAN এ ঢুকল, তারপর Phone এ। প্রতিটা সীমানায় গতি আর নিরাপত্তা বদলাল।",
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
                <strong>PowerCert Animated Videos</strong>, LAN, WAN, MAN নিয়ে
                ছোট ছোট Animation, একদম বিগিনারদের জন্য।{" "}
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
                <strong>নিজের LAN দেখুন</strong>, বাসার Wi-Fi এর Router এর Admin
                পাতায় ঢুকুন (সাধারণত 192.168.0.1), দেখুন আপনার LAN এ এই
                মুহূর্তে কয়টা যন্ত্র যুক্ত। প্রতিটা আপনার ভেতরের দুনিয়ার
                বাসিন্দা।
              </ListItem>
              <ListItem>
                <strong>Computerphile</strong>, Search করুন: LAN and WAN, আর
                Local Networks।{" "}
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
                একটা Network এর আকার তার চরিত্র বদলে দেয়। ছোট থেকে বড়, নাম
                বদলায়: PAN, LAN, MAN, WAN।
              </ListItem>
              <ListItem>
                শুধু দুইটা সত্যিই লাগবে। LAN মানে আপনার নিজের ছোট দুনিয়া, বাসা
                বা অফিস। WAN মানে বাইরের বিশাল দুনিয়া, আর Internet নিজেই
                সবচেয়ে বড় WAN।
              </ListItem>
              <ListItem>
                এলাকা বড় হলে চারটা জিনিস একসাথে খারাপ দিকে যায়: দেরি বাড়ে,
                মালিকানা হাতছাড়া হয়, অচেনা মানুষ ঢোকে, আর টাকা লাগে।
              </ListItem>
              <ListItem>
                LAN হলো নিজের উঠান, দ্রুত, বিনামূল্যে, নিরাপদ। WAN হলো বাইরের
                রাস্তা, ধীর, ভাড়া করা, অচেনা।
              </ListItem>
              <ListItem>
                Network গুলো একটা আরেকটার ভেতরে বসানো, আপনার LAN বসে আছে ISP এর
                ভেতরে, ISP বসে আছে Internet এর ভেতরে।
              </ListItem>
              <ListItem>
                LAN থেকে বাইরে বেরোনোর একটাই দরজা, Router, যার আসল নাম Default
                Gateway, বিস্তারিত Lesson 08 এ।
              </ListItem>
              <ListItem>
                ভালো নকশার নিয়ম: একসাথে কাজ করা জিনিস এক LAN এ রাখুন (API আর
                Database), আর বাইরের জন্য যত কম দরজা খোলা যায় তত নিরাপদ।
              </ListItem>
              <ListItem>
                পরের লেসন: এই LAN এর ভেতরে যন্ত্রগুলো জোড়া লাগে কীসে? Router,
                Switch আর Hub, তিনটা যন্ত্র, তিন রকম কাজ।
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
        <span className="font-bold text-primary">Network</span>,
        "দুই বা তার বেশি মেশিন, যারা কথা বলতে পারে",
      ],
      [
        <span className="font-bold text-primary">LAN</span>,
        "Local, এক বাসা বা অফিস, আপনার নিজের দ্রুত দুনিয়া",
      ],
      [
        <span className="font-bold text-primary">WAN</span>,
        "Wide, দেশ বা পৃথিবীজুড়ে, বাইরের বড় দুনিয়া",
      ],
      [
        <span className="font-bold text-primary">MAN</span>,
        "Metropolitan, এক শহরজুড়ে, মাঝামাঝি",
      ],
      [
        <span className="font-bold text-primary">PAN</span>,
        "Personal, শরীরের কাছে, Bluetooth এর মতো",
      ],
      [
        <span className="font-bold text-primary">Internet</span>,
        "পৃথিবীর সবচেয়ে বড় WAN, কারো মালিকানায় নয়",
      ],
      [
        <span className="font-bold text-primary">Default Gateway</span>,
        "LAN থেকে বাইরে বেরোনোর দরজা, মানে Router, Lesson 08",
      ],
      [
        <span className="font-bold text-primary">ভেতর বনাম বাইরে</span>,
        "LAN দ্রুত নিরাপদ বিনামূল্যে, WAN ধীর অচেনা ভাড়া",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "আপনার বাসার Wi-Fi এ Laptop থেকে Printer এ Print করলেন। এটা কোন ধরনের Network এ ঘটল?",
        options: [
          {
            key: "A",
            text: "WAN, কারণ Internet ব্যবহার হলো",
            isCorrect: false,
            explanation:
              "Internet ব্যবহারই হয়নি। দুইটাই আপনার বাসার ভেতরে, কথাটা বাইরে যায়নি।",
          },
          {
            key: "B",
            text: "LAN, দুইটাই একই বাসার ছোট Network এ",
            isCorrect: true,
            explanation:
              "ভেতরের দুনিয়া। এই কারণেই Internet বন্ধ থাকলেও Print হয়, আর দ্রুত হয়।",
          },
          {
            key: "C",
            text: "MAN, কারণ Router ব্যবহার হলো",
            isCorrect: false,
            explanation:
              "Router থাকলেই MAN হয় না। MAN মানে পুরো শহরজুড়ে। এটা এক বাসা, তাই LAN।",
          },
        ],
      },
      {
        id: 2,
        text: "এলাকা বড় হলে একটা Network এ কী ঘটে?",
        options: [
          {
            key: "A",
            text: "সবকিছু দ্রুত আর সস্তা হয়",
            isCorrect: false,
            explanation:
              "উল্টো। বড় হলে দূরত্ব বাড়ে, তাই ধীর, আর রাস্তা ভাড়া করতে হয়, তাই দামি।",
          },
          {
            key: "B",
            text: "দেরি বাড়ে, মালিকানা হাতছাড়া হয়, অচেনা মানুষ ঢোকে, টাকা লাগে",
            isCorrect: true,
            explanation:
              "এই চারটা একসাথে খারাপ দিকে যায়। তাই ভালো নকশা কাজ যতটা সম্ভব LAN এ রাখে।",
          },
          {
            key: "C",
            text: "কিছুই বদলায় না, শুধু নাম বদলায়",
            isCorrect: false,
            explanation:
              "নাম তো বদলায়ই, কিন্তু চরিত্রও বদলায়, আর সেটাই আসল কথা।",
          },
        ],
      },
      {
        id: 3,
        text: "Island Tours এর Database কে বাইরের দুনিয়া থেকে লুকিয়ে LAN এর ভেতরে রাখা হয় কেন?",
        options: [
          {
            key: "A",
            text: "বাইরে রাখলে বেশি টাকা লাগত",
            isCorrect: false,
            explanation:
              "টাকার ব্যাপার নয় মূলত। LAN এ রাখলে দ্রুত আর নিরাপদ, বাইরের কেউ পৌঁছাতেই পারে না।",
          },
          {
            key: "B",
            text: "LAN এ থাকলে API এর সাথে দ্রুত কথা হয়, আর বাইরের কেউ পৌঁছাতে পারে না",
            isCorrect: true,
            explanation:
              "ভেতরের দুনিয়া দ্রুত আর নিরাপদ। এই কারণেই Database শুধু 127.0.0.1 এ শোনে, Lesson 03।",
          },
          {
            key: "C",
            text: "Database বাইরে চলতেই পারে না",
            isCorrect: false,
            explanation:
              "পারে, কিন্তু সেটা বিপজ্জনক আর ধীর। তাই ইচ্ছে করে LAN এর ভেতরে রাখা হয়।",
          },
        ],
      },
      {
        id: 4,
        text: "আপনার LAN থেকে বাইরের দুনিয়ায় যাওয়ার দরজা কোনটা?",
        options: [
          {
            key: "A",
            text: "প্রতিটা যন্ত্রের নিজের দরজা",
            isCorrect: false,
            explanation:
              "না, সবার জন্য একটাই দরজা। ভেতরের সব যন্ত্র সেই এক দরজা দিয়েই বাইরে যায়।",
          },
          {
            key: "B",
            text: "Router, যার আসল নাম Default Gateway",
            isCorrect: true,
            explanation:
              "ভেতর আর বাইরের সীমানা। ভেতরের কথা এখান পর্যন্ত ঘুরে আসে, বাইরের কথা এখান দিয়ে বেরোয়। বিস্তারিত Lesson 08।",
          },
          {
            key: "C",
            text: "আপনার ISP এর অফিস",
            isCorrect: false,
            explanation:
              "ISP আরও দূরে। আপনার LAN এর ঠিক সীমানায় বসা দরজাটা হলো আপনার Router।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা কাজ দ্রুত আর নিরাপদ করতে চাইলে, LAN আর WAN এর দৃষ্টিতে কী করবেন?",
        options: [
          {
            key: "A",
            text: "যতটা সম্ভব WAN ব্যবহার করব",
            isCorrect: false,
            explanation:
              "WAN ধীর আর অচেনা। বেশি WAN মানে বেশি দেরি আর বেশি ঝুঁকি।",
          },
          {
            key: "B",
            text: "একসাথে কাজ করা জিনিস এক LAN এ রাখব, বাইরের জন্য কম দরজা খোলা রাখব",
            isCorrect: true,
            explanation:
              "ভেতরে যত বেশি, বাইরে যত কম, তত দ্রুত আর তত নিরাপদ। বড় System এর নকশা এই নীতিতেই শুরু।",
          },
          {
            key: "C",
            text: "সব যন্ত্র আলাদা আলাদা শহরে রাখব",
            isCorrect: false,
            explanation:
              "তাহলে সব কথা WAN এ যাবে, সবচেয়ে খারাপ। কাছে রাখলেই ভালো।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের LAN আর WAN দেখুন",
    subtitle: "Terminal আর Router, পাঁচটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের LAN এর সীমানা দেখুন",
        description:
          "আপনার Laptop এর ভেতরের ঠিকানা আর আপনার Gateway এর ঠিকানা বের করুন। এই দুইটা মিলে আপনার LAN কোথায় শুরু আর শেষ, তা বলে দেয়।",
      },
      {
        title: "LAN এর বাসিন্দা গুনুন",
        description:
          "আপনার LAN এ এই মুহূর্তে কয়টা যন্ত্র যুক্ত, খুঁজে দেখুন। প্রতিটা আপনার ভেতরের দুনিয়ার বাসিন্দা।",
      },
      {
        title: "LAN বনাম WAN এর গতি",
        description:
          "নিজের Gateway তে ping করুন, তারপর একটা দূরের সার্ভারে। ভেতরের আর বাইরের গতির তফাত সংখ্যায় দেখুন।",
      },
      {
        title: "ভেতরের কথা Internet ছাড়াই",
        description:
          "Wi-Fi এর Internet বন্ধ রেখে (বা তার খুলে) LAN এর ভেতরে ping করে দেখুন এখনো চলে কিনা।",
      },
      {
        title: "বাইরে বেরোনোর দরজা",
        description:
          "traceroute চালিয়ে প্রথম লাইনটা দেখুন, ওটাই আপনার Gateway, ভেতর আর বাইরের সীমানা।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-my-lan-edge.sh",
        language: "bash",
        code: `# আপনার নিজের ভেতরের ঠিকানা, LAN এর ভেতরে আপনি কোথায়
ipconfig getifaddr en0          # macOS, Wi-Fi
hostname -I | awk '{print $1}'  # Linux
# 192.168.x.x এর মতো একটা সংখ্যা। এটা শুধু আপনার LAN এ কাজ করে।

# আপনার LAN এর দরজা, মানে Gateway
netstat -nr | grep default      # macOS
ip route | grep default         # Linux
# সাধারণত 192.168.0.1 বা 192.168.1.1, ওটাই আপনার Router।
#
# আপনার ঠিকানা আর Gateway এর ঠিকানা প্রায় একই রকম শুরু হয় (192.168.x)।
# এই মিলটাই বলে দেয় আপনারা একই LAN এ। এই সংখ্যার মানে Lesson 07, Subnet।`,
      },
      {
        filename: "2-count-lan-devices.sh",
        language: "bash",
        code: `# আপনার LAN এ এখন কারা যুক্ত
# সহজ উপায়: Router এর Admin পাতা, Browser এ Gateway এর ঠিকানা লিখুন
#   http://192.168.0.1   (আপনার Gateway এর সংখ্যা বসান)
#   তারপর "Connected Devices" বা "DHCP Clients" খুঁজুন

# Terminal থেকেও দেখা যায়, arp টেবিলে LAN এর চেনা যন্ত্র থাকে
arp -a
# প্রতিটা লাইন আপনার LAN এর একটা বাসিন্দা, তাদের ঠিকানা সহ।
# এরা সবাই আপনার ভেতরের দুনিয়ার, বাইরের কেউ এখানে নেই।
# arp আসলে কী করে, সেটা Lesson 04।`,
      },
      {
        filename: "3-lan-vs-wan-speed.sh",
        language: "bash",
        code: `# ভেতরের গতি: নিজের Gateway তে ping
ping -c 5 192.168.0.1           # আপনার Gateway এর সংখ্যা বসান
# time= প্রায় ১ ms এর কম বা কাছাকাছি। ভেতরের দুনিয়া, বিদ্যুৎ গতি।

# বাইরের গতি: দূরের সার্ভারে ping
ping -c 5 8.8.8.8
# time= অনেক বেশি, ২০ থেকে ২০০ ms। বাইরের দুনিয়া, দূরত্বের দাম।

# একই কমান্ড, দুইটা গন্তব্য, দুই দুনিয়া।
# ভেতরের ping বাইরেরটার চেয়ে দশ থেকে একশো গুণ দ্রুত।
# এই এক তফাতই বলে দেয় কেন জিনিস LAN এ রাখলে দ্রুত।`,
      },
      {
        filename: "4-inside-works-offline.sh",
        language: "bash",
        code: `# ভেতরের দুনিয়া Internet ছাড়াও চলে, প্রমাণ করুন

# প্রথমে Wi-Fi এর Internet বন্ধ করুন, বা Ethernet তার খুলুন।
# (Wi-Fi নিজে চালু থাকুক, শুধু বাইরের লাইন বন্ধ)

# LAN এর ভেতরে ping, নিজের Gateway তে
ping -c 3 192.168.0.1
# এখনো চলে! কারণ এই কথা LAN এর ভেতরেই, বাইরে যায় না।

# এবার বাইরের দুনিয়ায়
ping -c 3 8.8.8.8
# চলবে না, "Network is unreachable"।
#
# একই মেশিন, একই মুহূর্ত। ভেতরের কথা চলছে, বাইরেরটা বন্ধ।
# এটাই LAN আর WAN এর সবচেয়ে পরিষ্কার তফাত, নিজের চোখে।`,
      },
      {
        filename: "5-the-door-out.sh",
        language: "bash",
        code: `# LAN থেকে বাইরে বেরোনোর প্রথম ধাপ সবসময় Gateway
traceroute -q 1 8.8.8.8 | head -3
# ১ নম্বর লাইন: 192.168.x.x, ওটাই আপনার Router, LAN এর দরজা।
# ২ নম্বর লাইন থেকে: আপনার ISP, মানে WAN শুরু।
#
# খেয়াল করুন, প্রতিটা বাইরের যাত্রা এই এক দরজা দিয়েই শুরু হয়।
# আপনার LAN এর যেকোনো যন্ত্র বাইরে যেতে চাইলে, প্রথমে এই Gateway।
# এই দরজার পুরো কাজ Lesson 08 এ, আপাতত শুধু চিনে রাখুন,
# ১ নম্বর লাইনটাই আপনার ভেতর আর বাইরের সীমানা।`,
      },
    ],
    tip: "তিন আর চার নম্বর পরীক্ষা পরপর করুন, কারণ ওই দুইটাই LAN আর WAN এর তফাতটা হাতে ধরিয়ে দেয়। ভেতরের ping এক মিলিসেকেন্ডের কম, বাইরেরটা একশো গুণ বেশি, আর Internet বন্ধ করলে ভেতরেরটা দিব্যি চলে বাইরেরটা মরে যায়। এই দুইটা একবার নিজের চোখে দেখলে LAN আর WAN আর কখনো গুলিয়ে ফেলবেন না, আর যেকোনো কথা শুনে সাথে সাথে বুঝবেন সেটা ভেতরে থাকছে নাকি বাইরে যাচ্ছে।",
  },
  assignment: {
    title: "Mini Project: আপনার নিজের Network এর মানচিত্র",
    time: "১ ঘণ্টা",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>LAN এর সীমানা আঁকুন:</strong> Lab এর এক নম্বর কমান্ড চালিয়ে
        আপনার ঠিকানা আর Gateway লিখুন। তারপর একটা ছবি আঁকুন: মাঝে Router,
        চারপাশে আপনার LAN এর যন্ত্রগুলো, আর Router থেকে একটা তীর বাইরের WAN এর
        দিকে।
      </span>,
      <span key="2">
        <strong>গতির তফাত মাপুন:</strong> Lab এর তিন নম্বর দুইটা ping চালিয়ে
        ভেতরের আর বাইরের গড় সময় লিখুন। বাইরেরটা ভেতরেরটার কতগুণ? এক লাইনে
        লিখুন কেন এত তফাত।
      </span>,
      <span key="3">
        <strong>my-tours কে দুই ভাগে ভাবুন:</strong> আপনার my-tours এর কোন কোন
        অংশ LAN এ থাকা উচিত (একসাথে কাজ করে, দ্রুত দরকার) আর কোনটা বাইরে খোলা
        রাখতে হবে (ইউজার আসে)? অন্তত তিনটা করে লিখুন, কারণ সহ।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু বললেন, আমার সব
        সার্ভার আলাদা আলাদা দেশে রাখলে ভালো হবে, তাই না? তাঁকে LAN আর WAN এর
        দৃষ্টিতে বোঝান কেন এটা প্রায়ই খারাপ বুদ্ধি।
      </span>,
    ],
    deliverables: [
      <span key="1">আপনার LAN এর আঁকা ছবি, ঠিকানা আর Gateway সহ</span>,
      <span key="2">ভেতরের আর বাইরের ping এর তফাত, আর কারণ</span>,
      <span key="3">my-tours এর LAN আর WAN অংশের ভাগ, কারণ সহ</span>,
      <span key="4">সব সার্ভার আলাদা দেশে রাখা নিয়ে ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
