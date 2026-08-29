/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import { NatTableLab } from "../../../components/course/topics/nat/animations";
import {
  NatSwapDiagram,
  NatVsPatSplit,
  PortForwardDiagram,
} from "../../../components/course/topics/nat/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const natPatContent: TopicData = {
  id: "nat-pat",
  introduction: {
    badge: "MODULE 03 · LESSON 10",
    title: <SectionTitle>একটা ঠিকানা, শত যন্ত্র</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Public বনাম Private IP এর লেসনে দেখেছিলাম, একটা অনুরোধ বাইরে যাওয়ার সময়
          Router সীমানায় তার উৎস বদলে দেয়, আপনার Private IP এর জায়গায় বসায় বাসার
          একটাই Public IP। এই বদলে দেওয়ার নাম বলেছিলাম NAT, আর কথা দিয়েছিলাম তার
          ভেতরের হিসাব পরে দেখব। এই সেই লেসন।
        </ContentParagraph>
        <ContentParagraph>
          কিন্তু এখানে একটা মজার ধাঁধা আছে। আপনার Laptop, Phone, TV, সবাই বাইরে
          যাচ্ছে একই একটা Public IP দিয়ে। তাহলে যখন উত্তর ফিরে আসে ওই একই ঠিকানায়,
          Router কীভাবে বোঝে এই উত্তরটা ভেতরের ঠিক কার জন্য? এতগুলো যন্ত্র একটা
          ঠিকানার পেছনে, অথচ চিঠি কখনো গুলিয়ে যায় না। কীভাবে?
        </ContentParagraph>
        <ContentParagraph>
          উত্তরটা একটা সহজ কিন্তু চমৎকার বুদ্ধি, Port নম্বর দিয়ে আলাদা করা, যার
          নাম PAT। এই একটা কৌশলের জোরেই একটা মাত্র Public IP এর পেছনে শত শত যন্ত্র
          একসাথে চলতে পারে। এই লেসনে সেই বুদ্ধিটার ভেতরে ঢুকব।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "একটা দরজা, অথচ শত মানুষ যায় আসে, কেউ গুলিয়ে যায় না। কারণ প্রত্যেকের হাতে আলাদা একটা টোকেন নম্বর। NAT ঠিকানা বদলায়, আর সেই টোকেন নম্বরটা, মানে Port, বলে দেয় কে কে।",
      author: "Computer Networking",
      role: "Lesson 10",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "nat",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>সীমানায় ঠিকানা বদলে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের কথাটা একটু ঝালিয়ে নিই। আপনার ভেতরের ঠিকানা 192.168 দিয়ে শুরু,
                Private, বাইরের দুনিয়ায় এটা চলে না। তাই একটা অনুরোধ বাইরে যাওয়ার
                ঠিক আগে Router উৎস ঠিকানা বদলে দেয়, Private এর জায়গায় বসায় বাসার
                Public IP। এই বদলে দেওয়ার পুরো নাম Network Address Translation,
                সংক্ষেপে NAT।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু আসল খেলা শুধু IP নয়। Router উৎসের সাথে একটা Port নম্বরও
                বদলে দেয়। ভেতরে যা ছিল 192.168.0.5:51001, বাইরে বেরোয় সেটা
                103.94.135.2:40001 হয়ে। উত্তর যখন ওই Public ঠিকানা আর Port এ ফিরে
                আসে, Router উল্টো কাজ করে, আবার ভেতরের ঠিকানা বসিয়ে ঠিক যন্ত্রে
                পৌঁছে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NatSwapDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "NAT কেন দরকার হলো",
          content: (
            <p>
              মূল কারণ সেই পুরনো সমস্যা, IPv4 এর ঠিকানা ফুরিয়ে যাওয়া। প্রতিটা
              যন্ত্রকে একটা করে আসল Public IP দেওয়ার মতো ঠিকানা নেই। NAT সেই
              সমস্যার সমাধান, পুরো বাসার জন্য একটা Public IP, আর ভেতরে যত খুশি
              Private যন্ত্র। মনে আছে IPv6 এর কথা? IPv6 তে ঠিকানা এত বেশি যে এই
              কৌশল আর লাগে না, প্রতিটা যন্ত্র আসল ঠিকানা পেতে পারে। NAT মূলত IPv4
              কে টিকিয়ে রাখার একটা চতুর বুদ্ধি।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "puzzle",
      subHeader: { index: "002", title: "The Puzzle" },
      title: <SectionTitle>উত্তরটা ফিরল, কিন্তু কার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ধাঁধাটা সামনে আনি। ধরুন আপনার বাসায় পাঁচটা যন্ত্র, পাঁচজন
                একসাথে ইন্টারনেট চালাচ্ছে। NAT এর নিয়মে পাঁচজনই বাইরে যাচ্ছে ঠিক
                একই Public IP দিয়ে, ধরা যাক 103.94.135.2। বাইরের সার্ভারগুলো তাই
                সবাইকে দেখছে একই ঠিকানায়।
              </ContentParagraph>
              <ContentParagraph>
                এখন উত্তরগুলো ফিরে আসছে ওই একই 103.94.135.2 এ। কিন্তু Router কে তো
                ভেতরে সঠিক যন্ত্রে পৌঁছে দিতে হবে। এই উত্তরটা কি Laptop এর, নাকি
                Phone এর, নাকি TV এর? শুধু Public IP দেখে তো বলা অসম্ভব, কারণ সেটা
                তো সবার একই। তাহলে Router বোঝে কীভাবে? এখানেই আসে সেই চমৎকার বুদ্ধি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "একটা পুরনো বন্ধু ফিরে এল, Port",
          content: (
            <p>
              Module 02 এর OS Networking লেসনে Port নিয়ে কথা হয়েছিল, একটা Socket
              মানে IP আর Port মিলিয়ে, আর Port বলে দেয় কোন App বা কোন Connection।
              সেই Port ই এখানে ধাঁধার চাবি। Router প্রতিটা Connection কে একটা আলাদা
              Port নম্বর দিয়ে চিহ্নিত করে রাখে, তাই একই Public IP হলেও Port আলাদা,
              আর সেই Port দেখেই সে চেনে কোন উত্তর কার।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "pat",
      subHeader: { index: "003", title: "PAT, the Port Trick" },
      title: <SectionTitle>Port দিয়ে সবাইকে আলাদা রাখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বুদ্ধিটা এই। Router একটা খাতা রাখে, নাম NAT টেবিল। প্রতিটা
                Connection বাইরে যাওয়ার সময় সে একটা সারি লেখে, ভেতরের কোন
                ঠিকানা আর Port, তার বদলে বাইরে কোন Public Port দিল, আর কার সাথে
                কথা। যেহেতু প্রতিটা Connection আলাদা Public Port পায়, একই Public
                IP তেও কেউ কারো সাথে মেশে না।
              </ContentParagraph>
              <ContentParagraph>
                এই পুরো কৌশলের নাম PAT, Port Address Translation। অনেকে একে NAT
                Overload ও বলে, কারণ একটা Public IP কে অনেক Connection দিয়ে বোঝাই
                করা হয়। নিচের Lab এ টেবিলটা দেখুন, আর একটা উত্তর ফিরলে Router
                কীভাবে শুধু Port দেখে ঠিক যন্ত্র খুঁজে বের করে, নিজে চাপ দিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NatTableLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একই যন্ত্র, একাধিক Connection ও আলাদা",
          content: (
            <p>
              খেয়াল করুন, Lab এর প্রথম আর তৃতীয় সারি একই Laptop এর, দুইটা আলাদা
              ট্যাব বা App। তবু তাদের Public Port আলাদা (40001 আর 40003)। মানে Port
              শুধু যন্ত্র নয়, প্রতিটা আলাদা Connection কেও আলাদা রাখে। এই কারণেই
              একটা Public IP এর পেছনে শুধু অনেক যন্ত্র নয়, প্রতিটা যন্ত্রের অনেক
              Connection ও একসাথে দিব্যি চলে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "nat-vs-pat",
      subHeader: { index: "004", title: "NAT vs PAT" },
      title: <SectionTitle>এক এ এক, নাকি অনেক এ এক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা ছোট পরিষ্কার করা দরকার, NAT আর PAT এর তফাত। মূল ধারণা এক,
              ঠিকানা বদলে দেওয়া। কিন্তু কতজন একটা Public IP ভাগ করছে, সেখানে তফাত।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NatVsPatSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Basic NAT (এক এ এক):</strong> প্রতিটা Private IP এর জন্য
                একটা করে আলাদা Public IP। এতে ঠিকানা বাঁচে না, তাই ঘরে ব্যবহার হয়
                না বললেই চলে।
              </ListItem>
              <ListItem>
                <strong>PAT / NAT Overload (অনেক এ এক):</strong> অনেক Private IP
                একটাই Public IP ভাগ করে, Port দিয়ে আলাদা করা। বাসা আর অফিসের
                Router প্রায় সবসময় এটাই করে।
              </ListItem>
              <ListItem>
                <strong>রোজকার কথায় NAT মানে আসলে PAT:</strong> লোকজন সাধারণত NAT
                বললেই এই Overload বা PAT টাই বোঝায়, কারণ ঘরে ওটাই হয়। তাই দুইটা
                শব্দ প্রায়ই একসাথে ব্যবহার হয়।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "inbound",
      subHeader: { index: "005", title: "Inbound & Port Forwarding" },
      title: <SectionTitle>বাইরে থেকে ভেতরে ঢোকা যায় না, সহজে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PAT এর একটা মজার পার্শ্ব ফল আছে। টেবিলের সারি তৈরি হয় তখনই, যখন
                ভেতরের কেউ প্রথমে বাইরে অনুরোধ পাঠায়। তাই বাইরের কেউ যদি নিজে থেকে
                আপনার Public IP তে অনুরোধ পাঠায়, Router টেবিলে কোনো সারি খুঁজে পায়
                না, বুঝতে পারে না চিঠিটা ভেতরের কাকে দেবে, তাই ফেলে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                এটা আসলে একটা স্বাভাবিক সুরক্ষার দেয়াল, না চাইতেই পাওয়া। ভেতরের
                যন্ত্রগুলো বাইরে থেকে সরাসরি দেখা যায় না, কেউ যেচে এসে হানা দিতে
                পারে না। কিন্তু আপনি যদি সত্যিই ভেতরে একটা সার্ভার রাখতে চান, যেমন
                নিজের বানানো একটা Website বাইরের কাউকে দেখাতে, তখন?
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PortForwardDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তখন Router কে হাতে করে একটা নিয়ম বলে দিতে হয়, বাইরের এই Port এ যা
              আসবে, ভেতরের এই যন্ত্রের এই Port এ পাঠাও। এই নিয়মের নাম Port
              Forwarding। মানে আপনি নিজে হাতে একটা সারি বসিয়ে দিচ্ছেন, যেটা আগে
              থেকে ছিল না। এই একটা দরজা খুলে দিলে বাইরের অনুরোধ এবার ভেতরের ঠিক
              সার্ভারে পৌঁছাতে পারে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "project",
      subHeader: { index: "006", title: "Project Example" },
      title: <SectionTitle>NAT আর Island Tours</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                NAT আর PAT একজন Backend Developer এর অনেক চেনা সমস্যার পেছনে
                লুকিয়ে থাকে। Island Tours চালাতে গিয়ে এগুলো কোথায় সামনে আসে,
                দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>নিজের বানানো সার্ভার বাইরে থেকে খোলে না:</strong> বাসায়
                  Laptop এ Island Tours চালিয়ে বন্ধুকে লিংক দিলেন, কিন্তু তার কাছে
                  খোলে না। কারণ আপনার Laptop NAT এর পেছনে, বাইরে থেকে সরাসরি দেখা
                  যায় না। খুলতে হলে Port Forwarding লাগবে, নয়তো একটা সত্যিকারের
                  Public সার্ভারে (Cloud এ) তুলতে হবে।
                </ListItem>
                <ListItem>
                  <strong>Log এ একই IP তে অনেক ইউজার:</strong> একটা অফিসের অনেক
                  পর্যটক যদি একসাথে বুকিং করে, আপনার Log এ তারা সবাই একই Public IP
                  তে দেখা যেতে পারে, কারণ তারা এক NAT এর পেছনে। তাই শুধু IP দেখে
                  ইউজার আলাদা করা যায় না, এটা মাথায় রাখা জরুরি।
                </ListItem>
                <ListItem>
                  <strong>CGNAT, আপনার Public IP ও ভাগের:</strong> আজকাল অনেক ISP
                  নিজেরাই আরেক স্তর NAT বসায়, যাকে বলে CGNAT। তখন আপনার তথাকথিত
                  Public IP টাও আসলে অনেক গ্রাহকের সাথে ভাগ করা, পুরোপুরি নিজের নয়।
                  এই কারণে ঘর থেকে সরাসরি সার্ভার হোস্ট করা প্রায়ই কঠিন হয়ে পড়ে,
                  আর Cloud লাগে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "তাই সার্ভার Cloud এ, ঘরে নয়",
          content: (
            <p>
              এই পুরো NAT আর CGNAT এর গল্প একটা বড় কারণ, কেন আসল সার্ভার Cloud এ
              রাখা হয়, ঘরের যন্ত্রে নয়। Cloud এর সার্ভারের একটা সত্যিকারের Public
              IP থাকে, বাইরের যে কেউ সরাসরি পৌঁছাতে পারে, কোনো NAT এর দেয়াল মাঝে
              নেই। ঘরের Laptop যতই শক্তিশালী হোক, NAT এর পেছনে থাকায় সে দুনিয়ার
              সার্ভার হতে পারে না, বিশেষ ব্যবস্থা ছাড়া।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "request-flow",
      subHeader: { index: "007", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Connection PAT পার হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনার Laptop একটা Website খুলল। NAT টেবিল কোথায় কীভাবে কাজ করল, আর
              উত্তরটা ঠিক ফিরে এল কীভাবে, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Laptop একটা Connection খুলল",
              description:
                "Laptop একটা উৎস Port বেছে নিল, ধরা যাক 51001। মানে এই Connection এর পরিচয় 192.168.0.5:51001। (Socket মানে IP আর Port, OS Networking লেসন।)",
            },
            {
              title: "Router সারি লিখল, উৎস বদলাল",
              description:
                "সীমানায় Router উৎস বদলে দিল 103.94.135.2:40001 এ, আর টেবিলে একটা সারি লিখে রাখল, 40001 মানে ভেতরের 192.168.0.5:51001। এবার চিঠি বাইরে গেল।",
            },
            {
              title: "Server উত্তর দিল Public ঠিকানায়",
              description:
                "Server দেখল অনুরোধ এসেছে 103.94.135.2:40001 থেকে, তাই উত্তর সে পাঠাল ঠিক ওখানেই। আপনার Private ঠিকানা সে জানেই না।",
            },
            {
              title: "Router টেবিল দেখে ভেতরে ফেরাল",
              description:
                "উত্তর এল 103.94.135.2:40001 এ। Router শুধু Port 40001 টা দেখে টেবিলে মিলিয়ে বুঝল এটা 192.168.0.5:51001 এর, তাই গন্তব্য বদলে ভেতরের ঠিকানা বসিয়ে Laptop এ পৌঁছে দিল।",
            },
            {
              title: "বাকিরা আলাদা Port এ, নিরাপদে",
              description:
                "এর মধ্যে Phone এর Connection পেয়েছিল 40002, Laptop এর আরেক ট্যাব 40003। প্রতিটার আলাদা সারি, আলাদা Port। তাই এতগুলো চিঠি একই Public IP তে ফিরেও কখনো গুলিয়ে যায় না।",
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
                <strong>নিজের Connection গুলো দেখুন</strong>, নিচের Lab এ কমান্ড
                আছে। আপনার যন্ত্র এই মুহূর্তে কয়টা Connection খুলে রেখেছে, প্রতিটার
                উৎস Port আলাদা, সব নিজের চোখে দেখুন।
              </ListItem>
              <ListItem>
                <strong>PowerCert Animated Videos</strong>, NAT আর PAT নিয়ে ছোট,
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
                <strong>Practical Networking</strong>, Search করুন: NAT আর PAT।
                টেবিল ধরে ধরে পুরো ব্যাপারটা পরিষ্কার করে বোঝানো।{" "}
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
                NAT মানে সীমানায় ঠিকানা বদলে দেওয়া, ভেতরের Private IP এর বদলে বাসার
                Public IP। মূল কারণ, IPv4 এর ঠিকানা কম, তাই পুরো বাসার জন্য একটা।
              </ListItem>
              <ListItem>
                ধাঁধা, অনেক যন্ত্র একই Public IP তে, উত্তর ফিরলে Router বোঝে কীভাবে
                কার? উত্তর, Port নম্বর দিয়ে।
              </ListItem>
              <ListItem>
                PAT (Port Address Translation, বা NAT Overload) প্রতিটা Connection
                কে একটা আলাদা Public Port দেয়, আর NAT টেবিলে সারি লিখে রাখে।
              </ListItem>
              <ListItem>
                উত্তর ফিরলে Router শুধু Public Port দেখে টেবিলে মিলিয়ে ঠিক ভেতরের
                যন্ত্রে পাঠায়। একই যন্ত্রের একাধিক Connection ও আলাদা Port পায়।
              </ListItem>
              <ListItem>
                Basic NAT এক এ এক (আলাদা Public IP লাগে), PAT অনেক এ এক (একটা
                Public IP, Port দিয়ে আলাদা)। ঘরে প্রায় সবসময় PAT।
              </ListItem>
              <ListItem>
                টেবিলে সারি তৈরি হয় ভেতর থেকে অনুরোধ গেলে, তাই বাইরের অনুরোধ সরাসরি
                ঢোকে না, একটা স্বাভাবিক দেয়াল। ভেতরে সার্ভার রাখতে লাগে Port
                Forwarding।
              </ListItem>
              <ListItem>
                অনেক ISP আরেক স্তর NAT বসায় (CGNAT), তাই আপনার Public IP ও ভাগের।
                এই কারণে আসল সার্ভার Cloud এ রাখা হয়, ঘরে নয়। IPv6 তে NAT আর লাগে
                না।
              </ListItem>
              <ListItem>
                পরের লেসন: আপনার Phone টা মোবাইল Data দিয়ে কীভাবে Internet এ জোড়া
                লাগে।
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
        <span className="font-bold text-primary">NAT</span>,
        "সীমানায় ভেতরের Private IP কে বাসার Public IP তে বদলে দেওয়া",
      ],
      [
        <span className="font-bold text-primary">ধাঁধা</span>,
        "সবাই একই Public IP, উত্তর ফিরলে কার তা বোঝে কীভাবে",
      ],
      [
        <span className="font-bold text-primary">PAT</span>,
        "প্রতিটা Connection কে আলাদা Public Port, তাই কেউ মেশে না",
      ],
      [
        <span className="font-bold text-primary">NAT টেবিল</span>,
        "ভেতরের ঠিকানা:Port আর বাইরের Public Port এর জোড়ার খাতা",
      ],
      [
        <span className="font-bold text-primary">Basic vs Overload</span>,
        "এক এ এক (আলাদা Public IP) বনাম অনেক এ এক (Port দিয়ে)",
      ],
      [
        <span className="font-bold text-primary">Port Forwarding</span>,
        "বাইরের অনুরোধ ভেতরের সার্ভারে পাঠাতে হাতে বসানো নিয়ম",
      ],
      [
        <span className="font-bold text-primary">CGNAT</span>,
        "ISP এর আরেক স্তর NAT, আপনার Public IP ও ভাগের",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "NAT মূলত কোন সমস্যার সমাধান?",
        options: [
          {
            key: "A",
            text: "Internet ধীর হওয়ার",
            isCorrect: false,
            explanation:
              "গতির সমস্যা নয়। NAT এসেছে IPv4 এর ঠিকানা ফুরিয়ে যাওয়ার সমস্যার সমাধানে।",
          },
          {
            key: "B",
            text: "IPv4 এর ঠিকানা কম, তাই পুরো বাসার জন্য একটা Public IP",
            isCorrect: true,
            explanation:
              "ঠিক। প্রতিটা যন্ত্রকে আলাদা Public IP দেওয়ার মতো ঠিকানা নেই, তাই NAT দিয়ে একটা Public IP অনেকে ভাগ করে।",
          },
          {
            key: "C",
            text: "Password চুরি ঠেকানোর",
            isCorrect: false,
            explanation:
              "NAT নিরাপত্তার একটা পার্শ্ব লাভ দেয় ঠিকই, কিন্তু মূল কারণ ঠিকানা বাঁচানো।",
          },
        ],
      },
      {
        id: 2,
        text: "অনেক যন্ত্র একই Public IP তে বাইরে গেলে, উত্তর ফিরলে Router কীভাবে বোঝে কোনটা কার?",
        options: [
          {
            key: "A",
            text: "Public IP দেখে",
            isCorrect: false,
            explanation:
              "Public IP তো সবার একই, তাই শুধু সেটা দেখে বলা অসম্ভব।",
          },
          {
            key: "B",
            text: "Port নম্বর দেখে, NAT টেবিলে মিলিয়ে",
            isCorrect: true,
            explanation:
              "ঠিক। প্রতিটা Connection আলাদা Public Port পায়, Router সেই Port দেখে টেবিলে মিলিয়ে ভেতরের যন্ত্র চেনে।",
          },
          {
            key: "C",
            text: "যন্ত্রের নাম দেখে",
            isCorrect: false,
            explanation:
              "যন্ত্রের নাম চিঠির সাথে যায় না। আলাদা করার চাবি Port নম্বর।",
          },
        ],
      },
      {
        id: 3,
        text: "PAT (NAT Overload) আর Basic NAT এর মূল তফাত কী?",
        options: [
          {
            key: "A",
            text: "PAT এ অনেক Private IP একটা Public IP ভাগ করে, Port দিয়ে আলাদা",
            isCorrect: true,
            explanation:
              "ঠিক। Basic NAT এ প্রতিটা Private এর জন্য আলাদা Public লাগে, PAT এ একটা Public অনেকে ভাগ করে, Port দিয়ে আলাদা রাখা হয়।",
          },
          {
            key: "B",
            text: "PAT দ্রুত, Basic NAT ধীর",
            isCorrect: false,
            explanation:
              "গতির তফাত নয়। তফাত কতজন একটা Public IP ভাগ করছে।",
          },
          {
            key: "C",
            text: "কোনো তফাত নেই",
            isCorrect: false,
            explanation:
              "তফাত আছে। Basic NAT এক এ এক, PAT অনেক এ এক।",
          },
        ],
      },
      {
        id: 4,
        text: "বাইরের কেউ আপনার Public IP তে নিজে থেকে অনুরোধ পাঠালে সাধারণত কী হয়?",
        options: [
          {
            key: "A",
            text: "সরাসরি ভেতরের যন্ত্রে পৌঁছে যায়",
            isCorrect: false,
            explanation:
              "না। NAT টেবিলে কোনো সারি না থাকায় Router জানে না কাকে দেবে।",
          },
          {
            key: "B",
            text: "টেবিলে সারি না থাকায় Router ফেলে দেয়, একটা স্বাভাবিক দেয়াল",
            isCorrect: true,
            explanation:
              "ঠিক। সারি তৈরি হয় ভেতর থেকে অনুরোধ গেলে। তাই বাইরের যেচে আসা অনুরোধ ঢোকে না, ভেতরে সার্ভার রাখতে লাগে Port Forwarding।",
          },
          {
            key: "C",
            text: "পুরো Network ক্র্যাশ করে",
            isCorrect: false,
            explanation:
              "না। শুধু ওই অনুরোধটা ফেলে দেওয়া হয়, বাকি সব ঠিক চলে।",
          },
        ],
      },
      {
        id: 5,
        text: "কেন আসল সার্ভার সাধারণত ঘরের যন্ত্রে নয়, Cloud এ রাখা হয়?",
        options: [
          {
            key: "A",
            text: "ঘরের যন্ত্র NAT (আর প্রায়ই CGNAT) এর পেছনে, বাইরে থেকে সরাসরি পৌঁছানো যায় না",
            isCorrect: true,
            explanation:
              "ঠিক। Cloud সার্ভারের সত্যিকারের Public IP থাকে, বাইরের যে কেউ সরাসরি পৌঁছাতে পারে। ঘরের যন্ত্র NAT এর দেয়ালের পেছনে।",
          },
          {
            key: "B",
            text: "ঘরের যন্ত্র সবসময় ধীর",
            isCorrect: false,
            explanation:
              "গতির ব্যাপার নয়। মূল সমস্যা NAT এর পেছনে থাকায় বাইরে থেকে পৌঁছানো যায় না।",
          },
          {
            key: "C",
            text: "Cloud এ Internet ফ্রি",
            isCorrect: false,
            explanation:
              "Cloud ফ্রি নয়। আসল কারণ, সেখানে সত্যিকারের Public IP, কোনো NAT এর দেয়াল নেই।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের Connection আর Port",
    subtitle: "Terminal এ চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "Private আর Public, আবার",
        description:
          "আপনার ভেতরের IP আর বাইরের Public IP আবার দেখুন। বাসার সব যন্ত্র বাইরে যায় এই একই Public IP দিয়ে, সেটাই NAT।",
      },
      {
        title: "এই মুহূর্তের Connection গুলো",
        description:
          "আপনার যন্ত্র এখন কয়টা Connection খুলে রেখেছে দেখুন, আর প্রতিটার উৎস Port আলাদা কিনা লক্ষ করুন।",
      },
      {
        title: "একই সাইট, আলাদা Port",
        description:
          "একটা সাইট দুইটা ট্যাবে খুলে Connection গুলো দেখুন, একই গন্তব্য কিন্তু আপনার উৎস Port আলাদা।",
      },
      {
        title: "CGNAT এর আভাস",
        description:
          "আপনার Router এর WAN ঠিকানা আর curl দিয়ে পাওয়া Public IP মিলিয়ে দেখুন, আলাদা হলে সম্ভবত ISP আরেক স্তর NAT (CGNAT) বসিয়েছে।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-private-public.sh",
        language: "bash",
        code: `# ভেতরের Private IP
ipconfig getifaddr en0     # macOS
hostname -I                # Linux

# বাইরের Public IP (বাসার সব যন্ত্রে একই আসবে)
curl ifconfig.me
echo

# দুইটা আলাদা। সব যন্ত্র বাইরে যায় ওই একই Public IP দিয়ে, এটাই NAT।`,
      },
      {
        filename: "2-my-connections.sh",
        language: "bash",
        code: `# এই মুহূর্তে খোলা Connection গুলো, উৎস Port সহ
netstat -an | grep ESTABLISHED     # macOS/Linux
ss -tn                              # Linux, পরিষ্কার

# প্রতিটা লাইনে আপনার লোকাল ঠিকানা:Port আর দূরের ঠিকানা:Port।
# খেয়াল করুন আপনার Port গুলো সব আলাদা, প্রতিটা Connection এর নিজের।
# Router এগুলোকেই বাইরে আলাদা Public Port এ মেলায় (PAT)।`,
      },
      {
        filename: "3-same-site-two-tabs.sh",
        language: "bash",
        code: `# একটা সাইট দুই ট্যাবে খুলুন, তারপর:
ss -tn | grep :443      # Linux (HTTPS Connection গুলো)
netstat -an | grep 443  # macOS

# একই গন্তব্য (দূরের :443), কিন্তু আপনার উৎস Port দুইটা আলাদা।
# এই আলাদা Port ই দুই ট্যাবের উত্তর আলাদা রাখে, NAT এর ভেতরেও।`,
      },
      {
        filename: "4-cgnat-hint.md",
        language: "markdown",
        code: `# আপনি কি CGNAT এর পেছনে, আভাস নিন

দুইটা ঠিকানা মিলিয়ে দেখুন:

১. Router এর WAN ঠিকানা (Router এর Admin পেজে দেখা যায়)
২. curl ifconfig.me দিয়ে পাওয়া Public IP

  দুইটা এক হলে   -> আপনার একটা নিজের Public IP আছে
  দুইটা আলাদা হলে -> সম্ভবত ISP আরেক স্তর NAT বসিয়েছে (CGNAT),
                    মানে আপনার "Public" IP টাও অনেকের সাথে ভাগ করা

CGNAT এর পেছনে থাকলে ঘর থেকে সরাসরি সার্ভার হোস্ট করা কঠিন।`,
      },
    ],
    tip: "দুই নম্বর পরীক্ষাটা সবচেয়ে চোখ খুলে দেয়, কারণ ss বা netstat চালালে আপনি নিজের চোখে দেখতে পাবেন এই মুহূর্তে আপনার যন্ত্র কয়টা Connection খুলে রেখেছে, আর প্রতিটার উৎস Port আলাদা। এই আলাদা Port গুলোই সেই জিনিস, যেগুলোকে Router বাইরে আলাদা Public Port এ মেলায়, যাতে একটা Public IP এর পেছনে সব গুলিয়ে না যায়। উপরের NAT টেবিল Lab এ যা দেখলেন, তার আপনার দিকের অর্ধেকটা এখানে সত্যি সত্যি দেখা হয়ে যায়।",
  },
  assignment: {
    title: "Mini Project: এক IP এর পেছনে",
    time: "৫০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>দুই ঠিকানা:</strong> Lab এর এক নম্বর চালিয়ে আপনার Private আর
        Public IP লিখুন। এক লাইনে লিখুন, বাসার আর সব যন্ত্র বাইরে গেলে কোন IP
        দেখাবে, আর কেন।
      </span>,
      <span key="2">
        <strong>নিজের Connection:</strong> Lab এর দুই নম্বর দিয়ে আপনার খোলা
        Connection গুলোর মধ্যে তিনটার উৎস Port লিখুন। তিনটা কি আলাদা? এক লাইনে
        লিখুন কেন আলাদা হওয়া জরুরি।
      </span>,
      <span key="3">
        <strong>উত্তর কার:</strong> উপরের NAT টেবিল Lab এ 40002 আর 55555 এ উত্তর
        ফেরালে কী হয়, দুইটার ফল লিখুন। 55555 এর ক্ষেত্রে কী হলো, আর সেটা কেন একটা
        সুরক্ষা, ব্যাখ্যা করুন।
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু জিজ্ঞেস করলেন,
        বাসার ১০টা যন্ত্র একটাই Public IP তে চলে কীভাবে, উত্তর গুলিয়ে যায় না কেন?
        তাঁকে Port আর NAT টেবিলের উদাহরণ দিয়ে বোঝান।
      </span>,
    ],
    deliverables: [
      <span key="1">আপনার Private আর Public IP, আর সবার একই Public হওয়ার কারণ</span>,
      <span key="2">তিনটা Connection এর উৎস Port, আর আলাদা হওয়া কেন জরুরি</span>,
      <span key="3">40002 আর 55555 এর ফল, আর 55555 কেন সুরক্ষা</span>,
      <span key="4">এক Public IP তে অনেক যন্ত্র কীভাবে চলে, ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
