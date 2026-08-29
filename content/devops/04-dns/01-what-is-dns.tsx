/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import { DnsLookupLab } from "../../../components/course/topics/dns/animations";
import {
  LookupPathDiagram,
  PhonebookDiagram,
} from "../../../components/course/topics/dns/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const whatIsDnsContent: TopicData = {
  id: "what-is-dns",
  introduction: {
    badge: "MODULE 04 · LESSON 01",
    title: <SectionTitle>Internet এর ফোনবুক</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          গত দুইটা মডিউল জুড়ে একটা কথা বারবার এসেছে, আপনি নাম লেখেন, কিন্তু
          কম্পিউটার চেনে সংখ্যা, মানে IP Address। মাঝখানে কেউ একজন নামটাকে সংখ্যায়
          বদলে দেয়, আর প্রতিবার বলেছি, সেই কেউ একজন হলো DNS, Module 04। এই সেই
          মডিউল, আর এটাই তার শুরুর লেসন।
        </ContentParagraph>
        <ContentParagraph>
          DNS কে সবচেয়ে সহজভাবে ভাবা যায় Internet এর একটা বিশাল ফোনবুক হিসেবে।
          ফোনবুকে আপনি নাম দেখে নম্বর বের করেন, তাই না? DNS ঠিক তেমন, আপনি একটা নাম
          দেন, যেমন islandtours.example, আর সে ফেরত দেয় তার IP Address, যেমন
          103.94.135.2। আপনার শুধু নামটা মনে রাখলেই চলে, সংখ্যাটা DNS মনে রাখে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন পুরো ছবিটা দেয়, DNS আসলে কী আর কেন দরকার। আর কীভাবে সে এত বড়
          কাজটা সামলায়, সেই চমৎকার যন্ত্রের ভেতরটা এই মডিউলের পরের লেসনগুলোর
          বিষয়। আপাতত মূল ধারণাটা মাথায় বসিয়ে নিই।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "মানুষ নাম মনে রাখে, কম্পিউটার সংখ্যা চেনে। এই দুইজনের মাঝে দাঁড়িয়ে যে চুপচাপ নামকে সংখ্যায় বদলে দেয়, তার নাম DNS। Internet এর সবচেয়ে বড়, সবচেয়ে কম আলোচিত ফোনবুক।",
      author: "DNS",
      role: "Lesson 01",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "phonebook",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>নাম আর সংখ্যার মাঝের সেতু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা সমস্যা দিয়ে শুরু করি। আপনি যখন কোথাও যেতে চান, লেখেন একটা
                নাম, google.com বা islandtours.example। কিন্তু আগের মডিউলে
                দেখেছিলেন, চিঠি আসলে যায় IP Address এ, মানে 142.250.194.14 এর মতো
                একটা সংখ্যায়। তাহলে আপনার লেখা নামটা এই সংখ্যায় বদলাল কীভাবে? এই
                বদলে দেওয়ার কাজটাই DNS এর।
              </ContentParagraph>
              <ContentParagraph>
                DNS এর পুরো নাম Domain Name System। নামটা ভারী শোনালেও কাজটা সহজ,
                নাম নিয়ে তার সংখ্যা ফেরত দেওয়া। ঠিক একটা ফোনবুকের মতো, যেখানে নাম
                দেখে নম্বর বের করেন। পার্থক্য শুধু, এই ফোনবুক পুরো Internet এর, আর
                এতে কোটি কোটি নাম।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PhonebookDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা শব্দ পরিষ্কার করে নিই, Domain Name",
          content: (
            <p>
              islandtours.example এর মতো নামগুলোকে বলে Domain Name, বা সংক্ষেপে
              Domain। এটাই মানুষের চেনা ঠিকানা, যেটা মুখে বলা যায়, মনে রাখা যায়।
              DNS এর পুরো কাজ এই Domain Name কে তার IP Address এ বদলে দেওয়া, যাকে
              বলে Resolve করা। তাই কেউ যদি বলে নামটা Resolve হচ্ছে না, বুঝবেন DNS
              নামটার সংখ্যা বের করতে পারছে না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "why-names",
      subHeader: { index: "002", title: "Why Names" },
      title: <SectionTitle>সংখ্যা থাকতে নাম কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা প্রশ্ন আসতে পারে, সংখ্যা দিয়েই যদি কাজ হয়, তাহলে নাম আর DNS
                এর ঝামেলা কেন? কারণ কয়েকটা, আর প্রতিটাই জরুরি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>মানুষ সংখ্যা মনে রাখতে পারে না:</strong> google.com মনে
                  রাখা সহজ, 142.250.194.14 নয়। শত শত সাইটের সংখ্যা মুখস্থ রাখা
                  অসম্ভব, কিন্তু নাম দিব্যি মনে থাকে।
                </ListItem>
                <ListItem>
                  <strong>সংখ্যা বদলায়, নাম থাকে:</strong> একটা সাইট সার্ভার
                  বদলালে তার IP বদলে যায়, কিন্তু নাম এক থাকে। DNS এ শুধু নতুন
                  সংখ্যাটা বসিয়ে দিলেই হয়, ব্যবহারকারীর কিছু বদলাতে হয় না, তারা
                  একই নাম লেখে।
                </ListItem>
                <ListItem>
                  <strong>এক নাম, অনেক সংখ্যা:</strong> বড় সাইটের পেছনে অনেকগুলো
                  সার্ভার থাকতে পারে, অনেকগুলো IP। এক নামের নিচে সেগুলো রেখে ভিড়
                  ভাগ করা যায়, ব্যবহারকারী টেরও পায় না। এটা নাম ছাড়া সম্ভব হতো না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নাম মানে একটা স্তর, আর স্তর মানে স্বাধীনতা",
          content: (
            <p>
              এই যে নাম আর সংখ্যাকে আলাদা রাখা, এটা আসলে একটা স্তর যোগ করা, আর সেই
              স্তরই স্বাধীনতা দেয়। নামটা এক রেখে পেছনের সংখ্যা যখন খুশি বদলানো যায়,
              সার্ভার সরানো যায়, বাড়ানো যায়, কমানো যায়, কেউ কিছু টের পায় না।
              সফটওয়্যারে এই ধারণাটা বারবার ফিরে আসবে, একটা স্থির নামের পেছনে
              পরিবর্তনশীল বাস্তবতা লুকিয়ে রাখা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "lookup",
      subHeader: { index: "003", title: "The Basic Lookup" },
      title: <SectionTitle>নাম দিলে সংখ্যা ফেরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কাজটা আসলে খুব সহজ একটা প্রশ্ন উত্তর। আপনার যন্ত্র একটা DNS server
                কে জিজ্ঞেস করে, এই নামটার IP কী? আর সে উত্তর দেয়। এই DNS server টা,
                যাকে বলে Resolver, আপনি নিজে বসাননি, DHCP আপনাকে এটার ঠিকানা দিয়ে
                দিয়েছিল, মনে আছে? আগের মডিউলে দেখা সেই পুরো সেটিং এর একটা অংশ ছিল
                এই DNS।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ কয়েকটা নামে চাপ দিয়ে দেখুন, প্রতিটার পেছনে DNS একটা
                করে IP ফেরত দিচ্ছে, আর সেই সংখ্যাটা আপনি কখনো নিজে জানতেন না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DnsLookupLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "IP হাতে এলে বাকিটা চেনা পথ",
          content: (
            <p>
              খেয়াল করুন, DNS এর কাজ এখানেই শেষ, নাম থেকে সংখ্যা বের করে দেওয়া।
              একবার আপনার যন্ত্রের হাতে IP চলে এলে, এরপরের পুরোটা আগের মডিউলের চেনা
              গল্প। নিজের পাড়া নাকি বাইরে সেটা Subnet Mask দেখে, বাইরে হলে Gateway,
              তারপর NAT, তারপর দরজা থেকে দরজা Server এ। মানে DNS শুধু যাত্রার প্রথম
              ধাপ, ঠিকানাটা জোগাড় করা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "not-one-book",
      subHeader: { index: "004", title: "Not One Book" },
      title: <SectionTitle>একটা বই নয়, বিশাল এক ব্যবস্থা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফোনবুকের তুলনাটা সুন্দর, কিন্তু একটা জায়গায় ভুল বোঝাতে পারে।
                সত্যিকারের DNS একটা মোটা বই নয়, যেখানে দুনিয়ার সব নাম এক জায়গায়
                লেখা। সেটা অসম্ভব হতো, কোটি কোটি নাম, প্রতি সেকেন্ডে বদল, একটা বই এ
                সামলানো যেত না।
              </ContentParagraph>
              <ContentParagraph>
                তাই DNS আসলে ছড়ানো, অনেকগুলো server মিলে একটা বিশাল ব্যবস্থা, যেখানে
                কোন নামের হিসাব কে রাখে সেটা ভাগ করা। আপনার Resolver এই জগতে খোঁজ
                করে উত্তরটা বের করে আনে। কীভাবে খোঁজে, কে কোথায় হিসাব রাখে, সেই
                পুরো ভেতরের গল্পই এই মডিউলের পরের কয়েকটা লেসন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LookupPathDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একই প্রশ্ন বারবার নয়, মনে রাখা হয়",
          content: (
            <p>
              আরেকটা জিনিস আগেভাগে জেনে রাখুন। প্রতিবার একই নামের জন্য পুরো জগতে
              খোঁজা হয় না, সেটা ধীর হতো। একবার উত্তর পেলে আপনার যন্ত্র আর Resolver
              সেটা কিছুক্ষণ মনে রেখে দেয়, যাকে বলে Cache। তাই দ্বিতীয়বার একই নাম
              লিখলে উত্তর প্রায় সাথে সাথে আসে। এই মনে রাখা কতক্ষণ থাকে, কীভাবে কাজ
              করে, তার একটা আলাদা লেসন আছে এই মডিউলে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>DNS আর Island Tours</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours কে দুনিয়ার সামনে আনতে গেলেই DNS সামনে চলে আসে, কারণ
                মানুষ আপনার সার্ভারের সংখ্যা মনে রাখবে না, একটা নাম চাইবে। কোথায়
                কোথায় লাগে, দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা নাম দরকার:</strong> মানুষ 103.94.135.2 টাইপ করবে
                  না, তারা islandtours.example এর মতো একটা নাম চাইবে। এই নামটা
                  আপনাকে জোগাড় করতে হয়, আর তারপর DNS এ বলে দিতে হয় নামটা কোন IP তে
                  যাবে। নামটা কার কাছ থেকে কেনা হয়, সেটা পরের লেসন।
                </ListItem>
                <ListItem>
                  <strong>সার্ভার বদলালে শুধু DNS বদলান:</strong> ধরুন Island
                  Tours বড় হলো, নতুন সার্ভারে সরালেন, IP বদলে গেল। ব্যবহারকারীকে
                  কিছু জানাতে হয় না, শুধু DNS এ নতুন সংখ্যাটা বসিয়ে দিন। তারা একই
                  নাম লেখে, চুপচাপ নতুন সার্ভারে পৌঁছে যায়।
                </ListItem>
                <ListItem>
                  <strong>নামের নিচে সংখ্যা বসানো, সেটাই Record:</strong> islandtours.example
                  নামটা কোন IP তে যাবে, সেই লেখাটাকে বলে DNS Record (যেমন IPv4 এর
                  জন্য A Record, যেটা IP Address লেসনে নাম শুনেছিলেন)। এই Record কী,
                  কত রকম, তার একটা পুরো লেসন আছে এই মডিউলে।
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
      title: <SectionTitle>নাম লেখা থেকে পেজ আসা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি Browser এ islandtours.example লিখে Enter চাপলেন। DNS কোথায়
              কীভাবে কাজ করল, আর তারপর আগের মডিউলের চেনা পথ কীভাবে ধরল, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "নাম আছে, সংখ্যা নেই",
              description:
                "আপনি একটা নাম লিখলেন, islandtours.example। কিন্তু চিঠি পাঠাতে তো IP লাগে, আর সেটা এখনো Browser এর কাছে নেই। তাই প্রথম কাজ, নামটার IP জোগাড় করা।",
            },
            {
              title: "Resolver কে জিজ্ঞেস",
              description:
                "Browser তার Resolver কে (DHCP এর দেওয়া DNS server) জিজ্ঞেস করল, islandtours.example এর IP কী? আগে Cache এ দেখল, না পেলে DNS এর জগতে খোঁজ করল।",
            },
            {
              title: "IP ফেরত এল",
              description:
                "DNS উত্তর দিল, 103.94.135.2। এবার Browser এর হাতে ঠিকানা আছে। DNS এর কাজ এখানেই শেষ, বাকিটা অন্য গল্প।",
            },
            {
              title: "এবার আগের মডিউলের পথ",
              description:
                "IP হাতে এসে যাওয়ায় Browser এখন চেনা পথে নামে। গন্তব্য নিজের পাড়ার নয়, তাই Gateway, তারপর NAT, তারপর দরজা থেকে দরজা গন্তব্য Server এ।",
            },
            {
              title: "পেজ পর্দায়",
              description:
                "Server উত্তর দিল, উত্তর একই পথে ফিরে এল, আর পেজটা আপনার পর্দায় ভেসে উঠল। পুরো ঘটনায় DNS ছিল শুধু প্রথম পা, নামটাকে সংখ্যায় বদলে দেওয়া।",
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
                <strong>নিজে একটা নাম Resolve করুন</strong>, নিচের Lab এ কমান্ড
                আছে। একটা নাম দিয়ে তার IP বের করুন, তারপর সেই IP তে সরাসরি গিয়ে
                দেখুন একই জায়গায় পৌঁছায়, নাম আর সংখ্যা একই দরজা।
              </ListItem>
              <ListItem>
                <strong>PowerCert Animated Videos</strong>, DNS কীভাবে কাজ করে,
                ছোট সহজ Animation দিয়ে।{" "}
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
                <strong>DNSimple, How DNS Works</strong>, একটা কমিক আকারে DNS এর
                পুরো গল্প, বিগিনারদের জন্য চমৎকার।{" "}
                <a
                  href="https://howdns.works"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  howdns.works
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
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  DNS হলো Internet এর ফোনবুক, একটা Domain Name দিলে তার IP Address
                  ফেরত দেয়। এই বদলে দেওয়াকে বলে Resolve করা।
                </ListItem>
                <ListItem>
                  নাম দরকার কারণ, মানুষ সংখ্যা মনে রাখতে পারে না, IP বদলালেও নাম এক
                  থাকে, আর এক নামের পেছনে অনেক IP রাখা যায়।
                </ListItem>
                <ListItem>
                  আপনার যন্ত্র নামটা একটা Resolver কে জিজ্ঞেস করে, যেটা DHCP আপনাকে
                  দিয়েছিল। উত্তর পেলে বাকিটা আগের মডিউলের চেনা পথ, Gateway, NAT,
                  Server।
                </ListItem>
                <ListItem>
                  DNS একটা মোটা বই নয়, অনেক server মিলে ছড়ানো একটা বিশাল ব্যবস্থা।
                  উত্তর কিছুক্ষণ মনে রাখা হয় (Cache), তাই দ্বিতীয়বার দ্রুত।
                </ListItem>
                <ListItem>
                  DNS যাত্রার শুধু প্রথম ধাপ, নামকে সংখ্যায় বদলে দেওয়া। তারপরের সব
                  আগের মডিউলে শেখা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার সামনে কী আছে, একটু আভাস দিই। এই মডিউলে আমরা খুলব, একটা নাম কে
                বেচে আর কে হিসাব রাখে (Domain, Registrar, Registry), Resolver
                ঠিক কীভাবে খোঁজে (Root, TLD, Authoritative server), উত্তর কতক্ষণ
                মনে থাকে (Cache আর TTL), নামের নিচে কত রকম তথ্য বসে (DNS Records),
                আর শেষে পুরো যাত্রাটা এক সুতোয় (Complete DNS Journey)। ফোনবুকের
                ভেতরে ঢোকার সময় এবার।
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
        <span className="font-bold text-primary">DNS</span>,
        "Internet এর ফোনবুক, নাম থেকে IP Address বের করে",
      ],
      [
        <span className="font-bold text-primary">Domain Name</span>,
        "মানুষের চেনা নাম, যেমন islandtours.example",
      ],
      [
        <span className="font-bold text-primary">Resolve</span>,
        "একটা নামকে তার IP Address এ বদলে দেওয়া",
      ],
      [
        <span className="font-bold text-primary">Resolver</span>,
        "যাকে নাম জিজ্ঞেস করা হয়, DHCP এর দেওয়া DNS server",
      ],
      [
        <span className="font-bold text-primary">কেন নাম</span>,
        "মনে রাখা সহজ, IP বদলালেও এক থাকে, এক নামে অনেক IP",
      ],
      [
        <span className="font-bold text-primary">ছড়ানো ব্যবস্থা</span>,
        "একটা বই নয়, অনেক server মিলে, উত্তর Cache এ রাখা হয়",
      ],
      [
        <span className="font-bold text-primary">DNS এর ভূমিকা</span>,
        "যাত্রার প্রথম ধাপ, নামকে সংখ্যায় বদলানো",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "DNS মূলত কী কাজ করে?",
        options: [
          {
            key: "A",
            text: "Website টা দ্রুত লোড করে",
            isCorrect: false,
            explanation:
              "গতির কাজ নয়। DNS এর কাজ নাম থেকে IP বের করা।",
          },
          {
            key: "B",
            text: "একটা Domain Name কে তার IP Address এ বদলে দেয়",
            isCorrect: true,
            explanation:
              "ঠিক। DNS হলো Internet এর ফোনবুক, নাম দিলে সংখ্যা ফেরত দেয়। এটাকে Resolve করা বলে।",
          },
          {
            key: "C",
            text: "Website এর ছবি সংরক্ষণ করে",
            isCorrect: false,
            explanation:
              "না, DNS ফাইল রাখে না। সে শুধু নাম থেকে IP বের করে দেয়।",
          },
        ],
      },
      {
        id: 2,
        text: "সংখ্যা দিয়েই যদি চিঠি যায়, তাহলে নাম আর DNS কেন দরকার?",
        options: [
          {
            key: "A",
            text: "নাম মনে রাখা সহজ, আর IP বদলালেও নাম এক থাকে",
            isCorrect: true,
            explanation:
              "ঠিক। মানুষ google.com মনে রাখে, 142.250.194.14 নয়। আর সার্ভার বদলে IP বদলালেও নামটা এক থাকে।",
          },
          {
            key: "B",
            text: "নাম ছাড়া Internet কাজ করে না",
            isCorrect: false,
            explanation:
              "কারিগরিভাবে সংখ্যা দিয়েই কাজ চলে। নাম মানুষের সুবিধার জন্য, আর বদল সামলাতে।",
          },
          {
            key: "C",
            text: "নাম সংখ্যার চেয়ে দ্রুত",
            isCorrect: false,
            explanation:
              "গতির ব্যাপার নয়। নামের আসল লাভ মনে রাখা সহজ আর পেছনের সংখ্যা স্বাধীনভাবে বদলানো যায়।",
          },
        ],
      },
      {
        id: 3,
        text: "আপনার যন্ত্র কোন নামের IP জিজ্ঞেস করে কার কাছে, আর সেটা কোথা থেকে জানল?",
        options: [
          {
            key: "A",
            text: "গন্তব্য সার্ভারকে, নিজে খুঁজে",
            isCorrect: false,
            explanation:
              "না। গন্তব্যের IP তো এখনো জানা নেই, তাই সরাসরি তাকে জিজ্ঞেস করা যায় না।",
          },
          {
            key: "B",
            text: "একটা Resolver কে, যার ঠিকানা DHCP দিয়েছিল",
            isCorrect: true,
            explanation:
              "ঠিক। DHCP আপনাকে IP, Gateway এর সাথে একটা DNS server ও দিয়েছিল, সেটাই আপনার Resolver।",
          },
          {
            key: "C",
            text: "আপনার নিজের হাতে বসানো একটা তালিকা",
            isCorrect: false,
            explanation:
              "সাধারণত আপনি কিছু বসান না। Resolver এর ঠিকানা DHCP আপনাআপনি দিয়ে দেয়।",
          },
        ],
      },
      {
        id: 4,
        text: "DNS কি একটা মোটা বই যেখানে দুনিয়ার সব নাম এক জায়গায় লেখা?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, একটা কেন্দ্রীয় বিশাল ফাইল",
            isCorrect: false,
            explanation:
              "না। কোটি কোটি নাম, প্রতি সেকেন্ডে বদল, একটা বই এ সামলানো অসম্ভব।",
          },
          {
            key: "B",
            text: "না, অনেক server মিলে ছড়ানো একটা ব্যবস্থা",
            isCorrect: true,
            explanation:
              "ঠিক। DNS ছড়ানো, কোন নামের হিসাব কে রাখে সেটা ভাগ করা। কীভাবে খোঁজে, পরের লেসন।",
          },
          {
            key: "C",
            text: "না, প্রতিটা Website নিজে নিজের বই রাখে",
            isCorrect: false,
            explanation:
              "ঠিক এমন নয়। এটা একটা সাজানো ছড়ানো ব্যবস্থা, যার গঠন পরের লেসনে দেখবেন।",
          },
        ],
      },
      {
        id: 5,
        text: "DNS থেকে IP পাওয়ার পর কী হয়?",
        options: [
          {
            key: "A",
            text: "DNS ই বাকি সব করে দেয়",
            isCorrect: false,
            explanation:
              "না। DNS এর কাজ IP বের করেই শেষ। এরপর অন্য অংশ কাজে নামে।",
          },
          {
            key: "B",
            text: "IP হাতে নিয়ে আগের মডিউলের পথ, Gateway, NAT, Server",
            isCorrect: true,
            explanation:
              "ঠিক। DNS শুধু প্রথম ধাপ। IP পেলে তারপর Subnet, Gateway, NAT দিয়ে চেনা পথে Server এ পৌঁছানো।",
          },
          {
            key: "C",
            text: "আবার নতুন করে নাম খোঁজা শুরু হয়",
            isCorrect: false,
            explanation:
              "না, একবার IP পেলে আর নাম লাগে না, সরাসরি ওই IP তে যাওয়া হয়।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজে একটা নাম Resolve করুন",
    subtitle: "Terminal এ চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "একটা নামের IP বের করুন",
        description:
          "একটা Domain Name দিয়ে তার IP Address বের করুন, নিজের চোখে দেখুন নাম থেকে সংখ্যা।",
      },
      {
        title: "আপনার Resolver কে",
        description:
          "যে DNS server আপনাকে উত্তর দিচ্ছে, তার ঠিকানা দেখুন। এটাই আপনার Resolver, DHCP এর দেওয়া।",
      },
      {
        title: "এক নাম, একাধিক IP",
        description:
          "একটা বড় সাইটের নাম দিয়ে দেখুন, একটা নামের পেছনে একাধিক IP আসছে কি না।",
      },
      {
        title: "নাম আর IP একই দরজা",
        description:
          "একটা নামের IP বের করে, সেই IP তে সরাসরি গিয়ে দেখুন একই জায়গায় পৌঁছায়।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-resolve.sh",
        language: "bash",
        code: `# একটা নামের IP বের করুন
dig +short google.com          # শুধু IP গুলো দেখায়
# অথবা
nslookup google.com

# উত্তরে যে সংখ্যাটা আসবে, সেটাই google.com এর IP।
# এই সংখ্যাটা আপনি কখনো নিজে জানতেন না, DNS বের করে দিল।`,
      },
      {
        filename: "2-my-resolver.sh",
        language: "bash",
        code: `# কোন DNS server আপনাকে উত্তর দিচ্ছে
scutil --dns | grep nameserver | head    # macOS
cat /etc/resolv.conf | grep nameserver   # অনেক Linux
nmcli device show | grep DNS             # Linux (NetworkManager)

# এই ঠিকানাটাই আপনার Resolver।
# খেয়াল করুন, এটা আপনি বসাননি, DHCP দিয়েছিল।`,
      },
      {
        filename: "3-many-ips.sh",
        language: "bash",
        code: `# এক নামের পেছনে একাধিক IP
dig +short github.com
dig +short netflix.com

# বড় সাইটে প্রায়ই কয়েকটা IP ফেরত আসে।
# এক নামের নিচে অনেক সার্ভার, যাতে ভিড় ভাগ করা যায়।
# কোনটা বেছে নেবে, সেটা এই মডিউলের পরের কথা।`,
      },
      {
        filename: "4-name-and-ip.sh",
        language: "bash",
        code: `# নাম আর IP একই দরজা, মিলিয়ে দেখুন
dig +short example.com          # ধরুন পেলেন 93.184.215.14

# এবার সেই IP তে সরাসরি যান (নাম ছাড়া):
curl -I http://93.184.215.14    # আপনার পাওয়া IP বসান

# একই সাড়া আসবে, কারণ নাম আর IP একই জায়গায় নিয়ে যায়।
# DNS শুধু নামটাকে ওই সংখ্যায় বদলে দিয়েছিল।`,
      },
    ],
    tip: "চার নম্বর পরীক্ষাটা সবচেয়ে চোখ খুলে দেয়, কারণ আপনি প্রথমে নাম দিয়ে IP বের করবেন, তারপর সেই IP তে সরাসরি গিয়ে দেখবেন একই জায়গায় পৌঁছাচ্ছেন। তখন পরিষ্কার বোঝা যায়, নাম আর সংখ্যা আসলে একই দরজার দুই রূপ, আর DNS শুধু নামটাকে সংখ্যায় অনুবাদ করে দেয়, ব্যস। এই ছোট পরীক্ষাটা DNS কে বিমূর্ত ধারণা থেকে হাতে ছোঁয়া একটা জিনিসে বদলে দেয়।",
  },
  assignment: {
    title: "Mini Project: ফোনবুক ঘেঁটে দেখা",
    time: "৪০ মিনিট",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>তিনটা নাম:</strong> Lab এর এক নম্বর দিয়ে তিনটা চেনা সাইটের নাম আর
        তাদের IP বের করে লিখুন। সংখ্যাগুলো কি আপনি আগে জানতেন?
      </span>,
      <span key="2">
        <strong>আপনার Resolver:</strong> Lab এর দুই নম্বর দিয়ে আপনার DNS server এর
        ঠিকানা লিখুন। এক লাইনে লিখুন, এই ঠিকানাটা আপনার যন্ত্রে কে বসিয়েছিল আর
        কখন।
      </span>,
      <span key="3">
        <strong>এক নাম, কত IP:</strong> Lab এর তিন নম্বর দিয়ে একটা বড় সাইটের কয়টা
        IP পেলেন লিখুন। এক লাইনে লিখুন, এক নামের পেছনে অনেক IP রাখার সুবিধা কী।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু জিজ্ঞেস করলেন,
        আমি তো google.com লিখি, কম্পিউটার নাকি সংখ্যা চেনে, তাহলে কাজটা হয় কীভাবে?
        তাঁকে ফোনবুকের উদাহরণ দিয়ে DNS বোঝান।
      </span>,
    ],
    deliverables: [
      <span key="1">তিনটা নাম আর তাদের IP</span>,
      <span key="2">আপনার Resolver এর ঠিকানা, আর কে বসিয়েছিল</span>,
      <span key="3">একটা বড় সাইটের IP সংখ্যা, আর অনেক IP এর সুবিধা</span>,
      <span key="4">DNS কী আর কেন, ফোনবুকের উদাহরণে ৫ লাইন</span>,
    ],
  },
};
