/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import { DoraLab } from "../../../components/course/topics/dhcp/animations";
import {
  DhcpConfigDiagram,
  PoolDiagram,
} from "../../../components/course/topics/dhcp/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const dhcpContent: TopicData = {
  id: "dhcp",
  introduction: {
    badge: "MODULE 03 · LESSON 09",
    title: <SectionTitle>কে বসিয়ে দিল সব</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          গত তিনটা লেসন খেয়াল করুন। IP এর লেসন শেষে বলেছিলাম, ভেতরের ঠিকানা কেউ
          হাতে বসায় না, Router নিজে দেয়। Public বনাম Private আর Gateway এর লেসনেও
          একই কথা এসেছে, আর প্রতিবার বলেছি, এই স্বয়ংক্রিয় ব্যবস্থার নাম DHCP,
          পরের লেসন। এই সেই লেসন।
        </ContentParagraph>
        <ContentParagraph>
          একটা সহজ কথা দিয়ে শুরু করি। আপনি যখন একটা Wi-Fi তে জোড়া লাগান, সাথে
          সাথে আপনার যন্ত্র একটা IP পেয়ে যায়, একটা Subnet Mask পায়, একটা Default
          Gateway পায়, এমনকি DNS পর্যন্ত পায়। অথচ এর একটাও আপনি হাতে টাইপ করেন
          না। এই পুরো সেটিং কে বসিয়ে দিল? উত্তর, DHCP।
        </ContentParagraph>
        <ContentParagraph>
          DHCP আসলে একটা ছোট কথোপকথন, নতুন যন্ত্র আর Network এর মাঝে চারটা কথার
          আদান প্রদান। লেসনটা ছোট, কিন্তু এই কথোপকথনটাই কারণ, যার জন্য Network
          এমনি এমনি কাজ করে বলে মনে হয়। এবার দেখব ঠিক কী কী কথা হয়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "নতুন যন্ত্রের হাতে কিছুই নেই, না ঠিকানা, না দরজা। সে শুধু চেঁচিয়ে জিজ্ঞেস করে, কেউ আছে? আর কেউ একজন পুরো সেটিং হাতে ধরিয়ে দেয়। সেই কেউ একজনের নাম DHCP।",
      author: "Computer Networking",
      role: "Lesson 09",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "what",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>এক ধাক্কায় পুরো সেটিং</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা হোটেলে ঢোকার কথা ভাবুন। আপনি কিছুই জানেন না, কোন ঘর, কোন তলা,
                বেরোনোর পথ কোথায়। Reception এ গেলে তারা এক ধাক্কায় সব দিয়ে দেয়,
                একটা ঘরের চাবি, কোন তলা তার তথ্য, বেরোনোর দরজা কোথায়, দরকারে কাকে
                ফোন করবেন তার নম্বর। আপনাকে কিছুই ঠিক করতে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                একটা নতুন যন্ত্র Network এ ঢুকলে তার অবস্থাও ঠিক তেমন, হাতে কিছুই
                নেই। DHCP হলো সেই Reception। যন্ত্র জিজ্ঞেস করা মাত্র সে এক ধাক্কায়
                পুরো সেটিং দিয়ে দেয়, IP (ঘরের চাবি), Subnet Mask (কোন তলা), Default
                Gateway (বেরোনোর দরজা), আর DNS (ফোন নম্বর)। এই DHCP এর কাজটা প্রায়
                সবসময় করে আপনার Router।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DhcpConfigDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              DHCP এর পুরো নাম Dynamic Host Configuration Protocol। নামটা ভয়
              দেখালেও মানেটা সহজ। Dynamic মানে ঠিকানা আপনাআপনি বদলাতে বা নতুন করে
              দেওয়া যায়, Host মানে যন্ত্র, Configuration মানে সেটিং, আর Protocol
              মানে দুইজনের মানা একটা নিয়ম। মিলিয়ে, যন্ত্রকে আপনাআপনি সেটিং দেওয়ার
              একটা নিয়ম। এই আপনাআপনি দেওয়াটা কীভাবে হয়, সেটাই পরের অংশ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "কেন এটা এত জরুরি",
          content: (
            <p>
              ভাবুন DHCP না থাকলে কী হতো। প্রতিটা Phone, Laptop, নতুন যন্ত্রে আপনাকে
              হাতে করে IP, Mask, Gateway আর DNS বসাতে হতো, আর খেয়াল রাখতে হতো যেন
              দুইজনের ঠিকানা এক না হয়। একটা ক্যাফেতে বসে Wi-Fi ধরা প্রায় অসম্ভব হয়ে
              যেত। DHCP আছে বলেই যেকোনো যন্ত্র যেকোনো Network এ ঢুকে সাথে সাথে কাজ
              করতে পারে, কাউকে কিছু জিজ্ঞেস না করেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "dora",
      subHeader: { index: "002", title: "The DORA Handshake" },
      title: <SectionTitle>চারটা কথায় ঠিকানা পাওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঠিকানা পাওয়ার পুরো ব্যাপারটা চারটা কথার আদান প্রদান, আর তার একটা
                সহজ নাম আছে, DORA। চারটা ধাপের প্রথম অক্ষর দিয়ে, Discover, Offer,
                Request, Acknowledge। একবার বুঝলে আর ভুলবেন না।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে মজার জায়গাটা হলো শুরুটা। নতুন যন্ত্রের তো নিজের কোনো IP
                নেই, DHCP server কোথায় সেটাও সে জানে না। তাহলে কাকে জিজ্ঞেস করবে?
                সে পুরো Network এ চেঁচিয়ে জিজ্ঞেস করে, যাকে বলে Broadcast, সবাইকে
                একসাথে ডাক। নিচের Lab এ চারটা ধাপে চাপ দিয়ে দেখুন কে কাকে কী বলে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DoraLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "দুইটা কথা কেন Broadcast",
          content: (
            <p>
              খেয়াল করলেন, চারটার মধ্যে যন্ত্রের দুইটা কথা (Discover আর Request)
              পুরো Network এ Broadcast হয়? কারণ প্রথমে যন্ত্রের নিজের ঠিকানাই নেই,
              তাই সরাসরি কাউকে বলা সম্ভব না, চেঁচানো ছাড়া উপায় নেই। আর Request
              Broadcast হয় অন্য কারণে, একাধিক server থাকলে যেন বাকিরা বুঝে যায় তাদের
              অফার নেওয়া হয়নি, তারা নিজেদের ঠিকানা ফেরত রাখতে পারে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "lease",
      subHeader: { index: "003", title: "The Lease" },
      title: <SectionTitle>ঠিকানা ধার, চিরদিনের নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা জিনিস খেয়াল করেছেন হয়তো, শেষ ধাপে server বলল ঠিকানাটা ২৪
                ঘণ্টার জন্য। মানে DHCP এর দেওয়া ঠিকানা আপনার চিরদিনের সম্পত্তি নয়,
                এটা ধার, একটা নির্দিষ্ট সময়ের জন্য। এই ধারের নাম Lease, ঠিক ভাড়া
                বাসার মতো।
              </ContentParagraph>
              <ContentParagraph>
                Lease এর সময় শেষ হওয়ার আগেই যন্ত্র চুপচাপ server কে বলে রাখে, আমি
                এখনো আছি, ঠিকানাটা রাখতে চাই, একে বলে Renew। আর যদি যন্ত্র চলে যায়
                আর ফিরে না আসে, Lease শেষ হলে ঠিকানাটা আবার খালি হয়ে যায়, পুলে
                ফিরে আসে, পরের কেউ পায়। এই কারণেই একই ঠিকানা বারবার ব্যবহার হতে
                পারে, আর এই কারণেই আপনার IP মাঝে মাঝে বদলে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Lease আছে বলেই ঠিকানা ফুরায় না",
          content: (
            <p>
              ধরুন একটা ক্যাফেতে দিনে ৫০০ জন আসে যায়, কিন্তু একসাথে বসে মাত্র ৩০
              জন। Lease আছে বলেই ক্যাফের DHCP কে ৫০০টা ঠিকানা রাখতে হয় না, ৩০ থেকে
              ৪০টাই যথেষ্ট। কেউ চলে গেলে তার ঠিকানা কিছুক্ষণ পর ফেরত আসে, পরের কেউ
              পায়। ঠিকানা ভাড়া দেওয়া, ফেরত নেওয়া, আবার ভাড়া দেওয়া, এই চক্রই
              সীমিত ঠিকানা দিয়ে অনেক যন্ত্র সামলানোর চাবি।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "pool",
      subHeader: { index: "004", title: "The Pool" },
      title: <SectionTitle>একটা খাতা, কে কোনটা পেল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DHCP server কীভাবে নিশ্চিত হয় যে দুইজনকে একই ঠিকানা দিচ্ছে না?
                কারণ তার হাতে একটা নির্দিষ্ট ঠিকানার পুল থাকে, যেমন 192.168.0.100
                থেকে .200, আর সে একটা খাতায় লিখে রাখে কে কোনটা পেল। নতুন কাউকে
                দেওয়ার সময় সে খাতা দেখে একটা খালি ঠিকানা বেছে নেয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PoolDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Dynamic (সাধারণ):</strong> বেশিরভাগ যন্ত্র পুল থেকে যে
                কোনো একটা খালি ঠিকানা পায়, আর সেটা সময়ে সময়ে বদলাতে পারে। Phone,
                Laptop, অতিথির যন্ত্র, এরা এমন।
              </ListItem>
              <ListItem>
                <strong>Reservation (সংরক্ষিত):</strong> কিছু যন্ত্রকে সবসময় একই
                ঠিকানা দেওয়া যায়, তাদের MAC দেখে চিনে। যেমন Printer টা যেন প্রতিবার
                192.168.0.104 ই পায়, যাতে তার ঠিকানা কখনো না বদলায়।
              </ListItem>
              <ListItem>
                <strong>Static (হাতে বসানো):</strong> আবার কিছু যন্ত্রে ঠিকানা হাতে
                বসিয়ে দেওয়া হয়, DHCP কে বাদ দিয়েই। সাধারণত সার্ভার আর জরুরি
                যন্ত্রে, যাদের ঠিকানা কখনো বদলানো চলবে না।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>DHCP আর Island Tours</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DHCP সাধারণত নীরবে কাজ করে, কিন্তু সার্ভার সাজানোর সময় এর সিদ্ধান্ত
                জরুরি হয়ে ওঠে। Island Tours চালাতে গিয়ে এটা কোথায় সামনে আসে,
                দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সার্ভারের ঠিকানা বদলানো চলবে না:</strong> Island Tours এর
                  API আর Database এর ঠিকানা যদি DHCP এর মতো বদলে যেত, তাহলে একে
                  অপরকে খুঁজে পেত না, সব ভেঙে পড়ত। তাই সার্ভারকে দেওয়া হয় Static
                  ঠিকানা বা DHCP Reservation, যাতে তার ঠিকানা কখনো না নড়ে।
                </ListItem>
                <ListItem>
                  <strong>Container ও DHCP এর মতো ঠিকানা পায়:</strong> Docker এ একটা
                  Container চালু হলে সেও আপনাআপনি একটা ভেতরের ঠিকানা পায়, ঠিক DHCP
                  এর ধাঁচে। তাই Container এর ঠিকানা কেন এমন, কীভাবে এল, সেটা বুঝতে
                  এই একই ধারণা কাজে লাগে।
                </ListItem>
                <ListItem>
                  <strong>169.254 দেখা মানে DHCP ব্যর্থ:</strong> একটা চেনা বিপদ,
                  একটা যন্ত্রের ঠিকানা যদি 169.254 দিয়ে শুরু হয়, তার মানে সে DHCP
                  server কে খুঁজেই পায়নি, তাই বাধ্য হয়ে নিজে একটা অকেজো ঠিকানা
                  বসিয়েছে। এই ঠিকানায় কোথাও পৌঁছানো যায় না। এমন দেখলেই বুঝবেন,
                  DHCP তে সমস্যা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নতুন যন্ত্র অনলাইন হচ্ছে না, প্রথমে DHCP দেখুন",
          content: (
            <p>
              যখনই দেখবেন একটা নতুন যন্ত্র Network এ জুড়ছে কিন্তু কোনো ঠিকানাই
              পাচ্ছে না, বা 169.254 এর মতো অকেজো ঠিকানা পাচ্ছে, প্রথম সন্দেহ হওয়া
              উচিত DHCP। হয় server ডাউন, নয়তো পুল ভরে গেছে (সব ঠিকানা বিলি হয়ে
              গেছে), নয়তো যন্ত্র আর server এর মাঝে পথ বন্ধ। ঠিকানা না পেলে যন্ত্র
              কিছুই করতে পারে না, তাই এটা একদম গোড়ার সমস্যা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "request-flow",
      subHeader: { index: "006", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা যন্ত্র চালু হয়ে অনলাইন হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি একটা নতুন Laptop Wi-Fi তে জোড়া লাগালেন। হাতে কিছু না থাকা
              অবস্থা থেকে পুরোপুরি অনলাইন হওয়া পর্যন্ত, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "চেঁচিয়ে খোঁজা (Discover)",
              description:
                "Laptop এর হাতে কোনো IP নেই। সে পুরো Network এ Broadcast করে জিজ্ঞেস করল, কোনো DHCP server আছে? একটা ঠিকানা দরকার।",
            },
            {
              title: "অফার আসা (Offer)",
              description:
                "DHCP server (Router) তার পুল থেকে একটা খালি ঠিকানা বেছে অফার করল, 192.168.0.5, সাথে Mask, Gateway আর DNS, পুরো সেটিং একসাথে।",
            },
            {
              title: "বেছে চাওয়া (Request)",
              description:
                "Laptop অফারটা পছন্দ করে Broadcast করে জানাল, আমি 192.168.0.5 টাই নিচ্ছি। একাধিক server থাকলে বাকিরা এতে বুঝল তাদের অফার নেওয়া হয়নি।",
            },
            {
              title: "নিশ্চিত করা (Acknowledge)",
              description:
                "server নিশ্চিত করল, ঠিকানাটা এখন Laptop এর, ২৪ ঘণ্টার Lease এ। এবার Laptop এর হাতে IP, Mask, Gateway, DNS সব আছে।",
            },
            {
              title: "এবার আসল কাজ",
              description:
                "সব সেটিং হাতে আসায় Laptop এখন সত্যিকারের কাজে নামতে পারে। এবার কোনো নাম খুলতে গেলে সে DNS কে জিজ্ঞেস করবে, তারপর Gateway দিয়ে বাইরে বেরোবে। DHCP এর কাজ এখানেই শেষ, বাকি সব শুরু।",
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
                <strong>নিজের Lease দেখুন</strong>, নিচের Lab এ কমান্ড আছে। আপনার
                যন্ত্র DHCP থেকে ঠিক কী কী পেয়েছে, IP, Mask, Gateway, DNS আর কত
                সময়ের Lease, সব নিজের চোখে দেখুন।
              </ListItem>
              <ListItem>
                <strong>PowerCert Animated Videos</strong>, DHCP আর DORA নিয়ে ছোট,
                সহজ Animation।{" "}
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
                <strong>Practical Networking</strong>, Search করুন: DHCP। ধাপে ধাপে
                পুরো DORA আর Lease এর ব্যাখ্যা।{" "}
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
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                DHCP নতুন যন্ত্রকে আপনাআপনি পুরো সেটিং দেয়, IP, Subnet Mask,
                Default Gateway আর DNS, এক ধাক্কায়। এই কাজ প্রায় সবসময় করে
                Router।
              </ListItem>
              <ListItem>
                ঠিকানা পাওয়া হয় চারটা ধাপে, DORA: Discover (চেঁচিয়ে খোঁজা), Offer
                (server অফার করে), Request (একটা বেছে চাওয়া), Acknowledge (server
                নিশ্চিত করে)।
              </ListItem>
              <ListItem>
                যন্ত্রের নিজের ঠিকানা না থাকায় Discover আর Request পুরো Network এ
                Broadcast হয়, সবাইকে ডাক।
              </ListItem>
              <ListItem>
                দেওয়া ঠিকানা চিরদিনের নয়, একটা সময়ের জন্য ধার, নাম Lease। শেষের
                আগে Renew হয়, নাহলে ঠিকানা পুলে ফিরে যায়, পরের কেউ পায়।
              </ListItem>
              <ListItem>
                server একটা পুল আর খাতা রাখে, তাই দুইজনকে একই ঠিকানা দেয় না।
                সাধারণ যন্ত্র Dynamic, সার্ভার প্রায়ই Static বা Reservation (MAC
                দেখে একই ঠিকানা)।
              </ListItem>
              <ListItem>
                169.254 দিয়ে শুরু ঠিকানা মানে যন্ত্র DHCP server খুঁজে পায়নি, একটা
                অকেজো ঠিকানা বসিয়েছে। নতুন যন্ত্র অনলাইন না হলে প্রথমে DHCP দেখুন।
              </ListItem>
              <ListItem>
                পরের লেসন: অনেক ভেতরের যন্ত্র কীভাবে একটা Public IP ভাগ করে বাইরে
                যায়, NAT আর PAT।
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
        <span className="font-bold text-primary">DHCP</span>,
        "নতুন যন্ত্রকে আপনাআপনি IP, Mask, Gateway আর DNS দেয়",
      ],
      [
        <span className="font-bold text-primary">DORA</span>,
        "চার ধাপ: Discover, Offer, Request, Acknowledge",
      ],
      [
        <span className="font-bold text-primary">Broadcast</span>,
        "যন্ত্রের ঠিকানা না থাকায় Discover আর Request সবাইকে ডাকে",
      ],
      [
        <span className="font-bold text-primary">Lease</span>,
        "ঠিকানা ধার, নির্দিষ্ট সময়ের, শেষের আগে Renew হয়",
      ],
      [
        <span className="font-bold text-primary">Pool</span>,
        "server এর ঠিকানার ভাণ্ডার আর খাতা, দুইজনকে এক ঠিকানা নয়",
      ],
      [
        <span className="font-bold text-primary">Reservation</span>,
        "MAC দেখে একটা যন্ত্রকে সবসময় একই ঠিকানা",
      ],
      [
        <span className="font-bold text-primary">169.254</span>,
        "DHCP পাওয়া যায়নি, যন্ত্রের বসানো অকেজো ঠিকানা",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "নতুন যন্ত্র Wi-Fi তে জুড়লে IP, Mask, Gateway আর DNS কে দেয়?",
        options: [
          {
            key: "A",
            text: "আপনাকে হাতে বসাতে হয়",
            isCorrect: false,
            explanation:
              "না, আপনি কিছুই টাইপ করেন না। DHCP আপনাআপনি পুরো সেটিং দিয়ে দেয়।",
          },
          {
            key: "B",
            text: "DHCP, প্রায় সবসময় আপনার Router",
            isCorrect: true,
            explanation:
              "ঠিক। DHCP এক ধাক্কায় IP, Mask, Gateway আর DNS দেয়, আর এই কাজ সাধারণত Router করে।",
          },
          {
            key: "C",
            text: "গন্তব্য সার্ভার",
            isCorrect: false,
            explanation:
              "না, দূরের সার্ভারের সাথে এর সম্পর্ক নেই। এটা আপনার নিজের Network এর DHCP এর কাজ।",
          },
        ],
      },
      {
        id: 2,
        text: "DORA এর চারটা ধাপ কী কী?",
        options: [
          {
            key: "A",
            text: "Discover, Offer, Request, Acknowledge",
            isCorrect: true,
            explanation:
              "ঠিক। যন্ত্র খোঁজে (Discover), server অফার করে (Offer), যন্ত্র বেছে চায় (Request), server নিশ্চিত করে (Acknowledge)।",
          },
          {
            key: "B",
            text: "Download, Open, Run, Add",
            isCorrect: false,
            explanation:
              "না, এগুলো DHCP এর ধাপ নয়। মনে রাখুন DORA: Discover, Offer, Request, Acknowledge।",
          },
          {
            key: "C",
            text: "Connect, Login, Sync, Close",
            isCorrect: false,
            explanation:
              "না। DHCP এর চারটা ধাপ হলো DORA।",
          },
        ],
      },
      {
        id: 3,
        text: "নতুন যন্ত্রের প্রথম কথা (Discover) Broadcast হয় কেন?",
        options: [
          {
            key: "A",
            text: "কারণ Broadcast দ্রুত",
            isCorrect: false,
            explanation:
              "গতির ব্যাপার নয়। কারণ যন্ত্রের তখনো নিজের ঠিকানা নেই, server কোথায় তাও জানে না।",
          },
          {
            key: "B",
            text: "যন্ত্রের নিজের ঠিকানা নেই, server কোথায় তাও জানে না, তাই সবাইকে ডাকে",
            isCorrect: true,
            explanation:
              "ঠিক। কাউকে সরাসরি বলার উপায় নেই, তাই পুরো Network এ চেঁচিয়ে জিজ্ঞেস করা ছাড়া উপায় নেই।",
          },
          {
            key: "C",
            text: "কারণ DHCP সবসময় Broadcast এই চলে",
            isCorrect: false,
            explanation:
              "সব ধাপ Broadcast নয়। server এর অফার আর নিশ্চিত করা সরাসরি হতে পারে। Discover Broadcast হয় ঠিকানা না থাকার কারণে।",
          },
        ],
      },
      {
        id: 4,
        text: "DHCP এর দেওয়া ঠিকানার Lease শেষ হয়ে গেলে আর যন্ত্র ফিরে না এলে কী হয়?",
        options: [
          {
            key: "A",
            text: "ঠিকানাটা চিরদিন ওই যন্ত্রের হয়ে থাকে",
            isCorrect: false,
            explanation:
              "না। DHCP এর ঠিকানা ধার, চিরদিনের নয়। Lease শেষ হলে ফেরত যায়।",
          },
          {
            key: "B",
            text: "ঠিকানাটা পুলে ফিরে যায়, পরের কেউ পায়",
            isCorrect: true,
            explanation:
              "ঠিক। এই ফেরত আসা আর আবার বিলি হওয়ার চক্রই সীমিত ঠিকানায় অনেক যন্ত্র সামলায়।",
          },
          {
            key: "C",
            text: "পুরো Network বন্ধ হয়ে যায়",
            isCorrect: false,
            explanation:
              "না। শুধু ওই একটা ঠিকানা খালি হয়, বাকি সব ঠিক চলে।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা যন্ত্রের ঠিকানা 169.254 দিয়ে শুরু। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "যন্ত্রটা খুব দ্রুত Network এ আছে",
            isCorrect: false,
            explanation:
              "উল্টো। 169.254 মানে যন্ত্র DHCP খুঁজে পায়নি, তাই একটা অকেজো ঠিকানা বসিয়েছে।",
          },
          {
            key: "B",
            text: "DHCP server খুঁজে পায়নি, তাই নিজে একটা অকেজো ঠিকানা বসিয়েছে",
            isCorrect: true,
            explanation:
              "ঠিক। এই ঠিকানায় কোথাও পৌঁছানো যায় না। এমন দেখলেই বুঝবেন DHCP তে সমস্যা।",
          },
          {
            key: "C",
            text: "এটা একটা Public IP",
            isCorrect: false,
            explanation:
              "না, এটা Public নয়। এটা DHCP ব্যর্থ হলে যন্ত্রের নিজের বসানো একটা বিশেষ অকেজো ঠিকানা।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের DHCP Lease",
    subtitle: "Terminal এ চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "DHCP থেকে কী কী পেলেন",
        description:
          "আপনার যন্ত্র DHCP থেকে যা যা পেয়েছে দেখুন, IP, Mask, Gateway আর DNS, সব একসাথে।",
      },
      {
        title: "DHCP server কে",
        description:
          "যে server আপনাকে ঠিকানা দিল তার ঠিকানা বের করুন। প্রায় নিশ্চিত এটা আপনার Gateway, মানে Router ই।",
      },
      {
        title: "Lease কত সময়ের",
        description:
          "আপনার ঠিকানার Lease কত সময়ের, দেখুন। এই সময় পার হওয়ার আগেই যন্ত্র চুপচাপ Renew করে।",
      },
      {
        title: "DHCP server আর Gateway এক কি না",
        description:
          "DHCP server আর Default Gateway এর ঠিকানা মিলিয়ে দেখুন, বেশিরভাগ বাসায় দুইটা একই যন্ত্র।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-my-lease.sh",
        language: "bash",
        code: `# DHCP থেকে পাওয়া পুরো সেটিং
ipconfig getpacket en0     # macOS, DHCP এর পুরো প্যাকেট দেখায়

# Linux এ:
cat /var/lib/NetworkManager/*.lease 2>/dev/null
nmcli device show | grep -Ei "IP4|DHCP"

# খেয়াল করুন: yiaddr বা IP4.ADDRESS হলো আপনার পাওয়া IP,
# router হলো Gateway, domain_name_server হলো DNS।`,
      },
      {
        filename: "2-dhcp-server.sh",
        language: "bash",
        code: `# কোন server আপনাকে ঠিকানা দিল
ipconfig getpacket en0 | grep server_identifier   # macOS
nmcli device show | grep DHCP4                     # Linux

# server_identifier এর পাশের ঠিকানাটাই আপনার DHCP server।
# বেশিরভাগ সময় এটা আপনার Router, যেমন 192.168.0.1।`,
      },
      {
        filename: "3-lease-time.sh",
        language: "bash",
        code: `# Lease কত সময়ের
ipconfig getpacket en0 | grep lease_time           # macOS

# lease_time সেকেন্ডে দেখায়, যেমন 86400 মানে ২৪ ঘণ্টা।
# এই সময় শেষের আগেই যন্ত্র নিজে থেকে Renew করে,
# যাতে ঠিকানাটা হাতছাড়া না হয়।`,
      },
      {
        filename: "4-server-vs-gateway.md",
        language: "markdown",
        code: `# DHCP server আর Gateway কি একই যন্ত্র, মিলিয়ে দেখুন

দুইটা ঠিকানা পাশাপাশি রাখুন:

  DHCP server:      192.168.0.1   (Lab 2 থেকে)
  Default Gateway:  192.168.0.1   (Gateway লেসনের কমান্ড)

বেশিরভাগ বাসায় দুইটা একই, কারণ কাজ দুইটাই করে একটাই যন্ত্র,
আপনার Router। সে একদিকে ঠিকানা বিলি করে (DHCP), আরেকদিকে
বাইরে বেরোনোর দরজা (Gateway)।`,
      },
    ],
    tip: "এক নম্বর পরীক্ষাটা সবচেয়ে চোখ খুলে দেয়, কারণ macOS এ ipconfig getpacket চালালে আপনি DHCP এর পুরো উত্তরটা একসাথে দেখতে পাবেন, IP, Mask, Gateway আর DNS, সব এক জায়গায়। তখন বোঝা যায় এই চারটা জিনিস আসলে একসাথে, এক ধাক্কায় এসেছিল, আর আপনি এর একটাও হাতে বসাননি। DORA এর সেই Acknowledge ধাপের ফলটা এখানে হাতে কলমে দেখা হয়ে যায়।",
  },
  assignment: {
    title: "Mini Project: নিজের Lease এর ময়নাতদন্ত",
    time: "৪০ মিনিট",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>পুরো সেটিং:</strong> Lab এর এক নম্বর চালিয়ে আপনার IP, Mask,
        Gateway আর DNS একসাথে লিখুন। এই চারটার একটাও কি আপনি কখনো হাতে বসিয়েছিলেন?
      </span>,
      <span key="2">
        <strong>server আর দরজা:</strong> Lab এর দুই আর চার নম্বর দিয়ে আপনার DHCP
        server আর Default Gateway এর ঠিকানা পাশাপাশি লিখুন। দুইটা কি এক? এক লাইনে
        লিখুন কেন এমন হয়।
      </span>,
      <span key="3">
        <strong>Lease:</strong> Lab এর তিন নম্বর দিয়ে আপনার Lease কত সময়ের বের
        করুন (ঘণ্টায় লিখুন)। এক লাইনে লিখুন, Lease শেষ হওয়ার আগে যন্ত্র কী করে
        যাতে ঠিকানা হাতছাড়া না হয়।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু জিজ্ঞেস করলেন,
        নতুন Phone Wi-Fi তে দিলেই সাথে সাথে চলে কীভাবে, কেউ তো কিছু টাইপ করে না?
        তাঁকে DORA আর DHCP এর উদাহরণ দিয়ে বোঝান।
      </span>,
    ],
    deliverables: [
      <span key="1">আপনার IP, Mask, Gateway, DNS, একসাথে</span>,
      <span key="2">DHCP server আর Gateway এর ঠিকানা, আর এক হওয়ার কারণ</span>,
      <span key="3">আপনার Lease এর সময় আর Renew এর ব্যাখ্যা</span>,
      <span key="4">নতুন যন্ত্র কীভাবে আপনাআপনি চলে, ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
