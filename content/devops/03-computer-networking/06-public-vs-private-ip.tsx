/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  BoundaryLab,
  IpScopeLab,
} from "../../../components/course/topics/private-ip/animations";
import {
  InsideOutsideDiagram,
  PrivateRangesDiagram,
  ReuseDiagram,
} from "../../../components/course/topics/private-ip/diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const publicVsPrivateIpContent: TopicData = {
  id: "public-vs-private-ip",
  introduction: {
    badge: "MODULE 03 · LESSON 06",
    title: <SectionTitle>একটা যন্ত্র, দুইটা ঠিকানা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে একটা ছোট রহস্য রেখে এসেছিলাম। আপনি যখন নিজের যন্ত্রের IP দেখেন,
          পান 192.168.0.5 এর মতো একটা কিছু। কিন্তু একটা Website এ গিয়ে যদি জিজ্ঞেস
          করেন আমার IP কী, সে দেখায় সম্পূর্ণ আলাদা একটা সংখ্যা, যেমন 103.94.135.2।
          একই Laptop, অথচ দুইটা আলাদা ঠিকানা। কেন?
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন ঠিক এই প্রশ্নের উত্তর। একটা ঠিকানা আপনার বাসার ভেতরের, যাকে বলে
          Private IP। আরেকটা বাইরের দুনিয়া, মানে Internet আপনাকে যে ঠিকানায় চেনে,
          তার নাম Public IP। দুইটা কেন আলাদা, কোনটা কখন কাজে লাগে, আর সবচেয়ে মজার
          ব্যাপার, এই দুই ভাগ করাটা আসলে আগের লেসনের সেই ঠিকানা ফুরিয়ে যাওয়ার
          সমস্যার একটা চমৎকার সমাধান।
        </ContentParagraph>
        <ContentParagraph>
          ভয়ের কিছু নেই, নতুন কোনো কঠিন জিনিস নেই। শুধু একটা সহজ ছবি মাথায় বসাতে
          হবে, ভেতরের দুনিয়া আর বাইরের দুনিয়া, আর মাঝখানে দরজায় দাঁড়ানো Router।
          শেষে যেকোনো IP দেখলেই আপনি বলে দিতে পারবেন সেটা ভেতরের নাকি বাইরের।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "বাসার ভেতরে আপনার একটা ঠিকানা, যেটা প্রতিবেশীও ব্যবহার করে। বাইরের দুনিয়ায় পুরো বাসার একটাই ঠিকানা, যেটা পৃথিবীতে অনন্য। একটা ভেতরের নাম, একটা বাইরের পরিচয়।",
      author: "Computer Networking",
      role: "Lesson 06",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "two-worlds",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>ভেতরের দুনিয়া আর বাইরের দুনিয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা বাসার কথা ভাবুন। ভেতরে কয়েকজন মানুষ, প্রত্যেকের একটা ডাকনাম,
                যেটা দিয়ে বাসার লোকজন তাদের ডাকে। কিন্তু ডাকপিয়ন যখন বাইরে থেকে
                চিঠি আনে, সে ডাকনাম চেনে না, সে চেনে বাসার নম্বর। ভেতরের ডাকনাম আর
                বাইরের বাসা নম্বর, দুইটা দুই জগতের।
              </ContentParagraph>
              <ContentParagraph>
                Network এও ঠিক তেমন। আপনার বাসার ভেতরে Laptop, Phone, TV,
                প্রত্যেকের একটা করে ঠিকানা আছে, যেগুলো সাধারণত 192.168 দিয়ে শুরু।
                এগুলো ভেতরের ঠিকানা, নাম Private IP। এরা শুধু বাসার ভেতরের দুনিয়ায়
                কাজ করে। মাঝখানে Router দুই দিকেই এক পা রেখে দাঁড়িয়ে, আর তার
                বাইরের দিকে ISP এর দেওয়া একটাই ঠিকানা, নাম Public IP। বাইরের
                Internet পুরো বাসাটাকে চেনে শুধু ওই একটা Public IP তে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <InsideOutsideDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তাহলে সেই রহস্যের উত্তর পাওয়া গেল। আপনি যখন যন্ত্রে নিজের IP দেখেন,
              সে দেখায় ভেতরের ঠিকানা, 192.168.0.5, কারণ ওটাই আপনার যন্ত্র নিজে
              জানে। কিন্তু একটা Website যখন বলে আপনার IP 103.94.135.2, সে দেখছে
              বাইরে থেকে, তাই তার চোখে পড়ছে বাসার Public IP। দুইটাই আপনার, শুধু
              দুই দুনিয়া থেকে দেখা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Router এর ভেতরের ঠিকানাটার একটা নামও আছে",
          content: (
            <p>
              ছবিতে Router এর ভেতরের ঠিকানা 192.168.0.1, আর আপনার সব যন্ত্র বাইরে
              যেতে হলে প্রথমে এই ঠিকানায় চিঠি দেয়। এই দরজার ঠিকানাটাকে বলে Default
              Gateway, মানে বাইরে বেরোনোর দরজা। এটা নিয়ে একটা আলাদা লেসন আছে,
              আপাতত শুধু মনে রাখুন, বাসার প্রতিটা যন্ত্র বাইরে যাওয়ার সময় এই দরজা
              দিয়েই যায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "ranges",
      subHeader: { index: "002", title: "The Private Ranges" },
      title: <SectionTitle>তিনটা রিজার্ভ করা ব্লক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন প্রশ্ন, যেকোনো সংখ্যা কি Private হতে পারে? না। পুরো IP জগতের
                ভেতরে তিনটা নির্দিষ্ট ব্লক আলাদা করে রাখা আছে, শুধু ভেতরের ব্যবহারের
                জন্য। এই তিনটা ব্লকের ঠিকানা Internet এ কখনো ব্যবহার হয় না, তাই
                যেকোনো বাসা বা অফিস নিজের ভেতরে এগুলো কাউকে না জিজ্ঞেস করেই ব্যবহার
                করতে পারে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PrivateRangesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>10 দিয়ে শুরু:</strong> সবচেয়ে বড় ব্লক, প্রায় ১.৬ কোটি
                ঠিকানা। বড় কোম্পানি আর Cloud এ এটা প্রচুর দেখবেন।
              </ListItem>
              <ListItem>
                <strong>172.16 থেকে 172.31:</strong> মাঝের ব্লক। একটা ফাঁদ আছে,
                শুধু 172.16 থেকে 172.31 পর্যন্তই Private, 172.32 আর Private নয়।
              </ListItem>
              <ListItem>
                <strong>192.168 দিয়ে শুরু:</strong> সবচেয়ে চেনা, কারণ বাসার Router
                প্রায় সবসময় এই ব্লক থেকে ঠিকানা বিলি করে। আপনার Phone বা Laptop
                এর ঠিকানা প্রায় নিশ্চিত এখানেই পড়বে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে কয়েকটা সত্যিকারের ঠিকানা দিলাম। প্রতিটাতে চাপ দিয়ে দেখুন সেটা
              Private নাকি Public, আর হলে কোন ব্লকের। নিয়মটা কয়েকবার মিলিয়ে দেখলেই
              চোখে বসে যাবে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <IpScopeLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "reuse",
      subHeader: { index: "003", title: "Why Reuse Works" },
      title: <SectionTitle>একই ঠিকানা, কোটি বাসা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আগের লেসনের সুতোটা ধরি। মনে আছে, IPv4 এ মোট ঠিকানা প্রায় ৪.৩
                বিলিয়ন, আর সেটা দুনিয়ার যন্ত্রের সামনে ফুরিয়ে গেছে? Private IP এই
                সমস্যার একটা চতুর সমাধান। ভাবুন, প্রতিটা বাসার প্রতিটা যন্ত্রকে যদি
                একটা করে আসল Public ঠিকানা দিতে হতো, ঠিকানা কবেই শেষ হয়ে যেত।
              </ContentParagraph>
              <ContentParagraph>
                তার বদলে হলো কী, সবাই ভেতরে একই রকম Private ঠিকানা ব্যবহার করা শুরু
                করল। আপনার বাসার Laptop 192.168.0.5, আর আপনার প্রতিবেশীর বাসার
                Laptop ও ঠিক 192.168.0.5। তবু কোনো গণ্ডগোল হয় না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ReuseDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কেন গণ্ডগোল হয় না, সেটাই আসল কথা। ওই দুই 192.168.0.5 দুইটা সম্পূর্ণ
              আলাদা ভেতরের দুনিয়ায় থাকে, একে অপরকে দেখতেই পায় না। Internet কখনো
              এই ভেতরের ঠিকানা দেখে না, সে শুধু দুই বাসার আলাদা Public IP চেনে। তাই
              একই ভেতরের ঠিকানা কোটি কোটি বাসা একসাথে ব্যবহার করেও দিব্যি চলে, আর
              এভাবেই সীমিত Public ঠিকানা অনেক কম লাগে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কে আপনাকে Private IP টা দেয়",
          content: (
            <p>
              আপনি তো নিজে বসে 192.168.0.5 লেখেন না, ঠিকানাটা আপনাআপনি চলে আসে।
              এই কাজটা করে বাসার Router, নতুন কোনো যন্ত্র জুড়লেই সে একটা খালি Private
              ঠিকানা বেছে দিয়ে দেয়। এই স্বয়ংক্রিয় বিলি করার নাম DHCP, আর সেটা নিয়ে
              পরে একটা আলাদা লেসন আছে। আপাতত জানুন, ভেতরের ঠিকানা কেউ হাতে বসায় না,
              Router নিজে দেয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "public-face",
      subHeader: { index: "004", title: "The Public Face" },
      title: <SectionTitle>বাইরের দুনিয়া একটা ঠিকানা দেখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে আপনার Private ঠিকানা যদি বাসা না ছাড়ে, একটা অনুরোধ বাইরের
                সার্ভারে পৌঁছায় কীভাবে, আর সার্ভার উত্তরটা ফেরত পাঠায় কার কাছে? এই
                জাদুটা ঘটে Router এর সীমানায়। অনুরোধ বাইরে যাওয়ার ঠিক আগে Router
                খামের উৎস ঠিকানা বদলে দেয়, আপনার Private 192.168.0.5 এর জায়গায়
                বসিয়ে দেয় বাসার Public IP।
              </ContentParagraph>
              <ContentParagraph>
                ফলে সার্ভার কখনো আপনার ভেতরের ঠিকানা দেখেই না, সে দেখে শুধু বাসার
                Public IP, আর উত্তর সেখানেই পাঠায়। উত্তর ফিরে এলে Router তার মনে
                রাখা হিসাব দেখে বুঝে ফেলে এটা আসলে কোন যন্ত্রের, তারপর ভেতরে ঠিক
                জায়গায় পৌঁছে দেয়। নিচে ধাপে ধাপে দেখুন, প্রতি জায়গায় উৎস ঠিকানা
                কী।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <BoundaryLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এই ঠিকানা বদলানোর নাম NAT",
          content: (
            <p>
              সীমানায় Private থেকে Public এ ঠিকানা বদলে দেওয়া, আর উত্তর ফিরলে আবার
              ঠিক যন্ত্রে মিলিয়ে দেওয়া, এই পুরো কৌশলের নাম NAT। কীভাবে Router এত
              যন্ত্রের হিসাব একটা Public IP তে গুলিয়ে না ফেলে রাখে, সেটা একটা
              সুন্দর ব্যাপার, আর তার জন্য একটা আলাদা লেসন আছে। এই লেসনে শুধু এটুকু
              বুঝলেই হবে, বাইরের দুনিয়া আপনার Public IP দেখে, Private কখনো নয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "project",
      subHeader: { index: "005", title: "Project Example" },
      title: <SectionTitle>Public, Private আর Island Tours</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একজন Backend Developer হিসেবে Public আর Private IP এর তফাত রোজ
                কাজে লাগে, বিশেষ করে সার্ভার সাজানোর সময়। Island Tours চালাতে গিয়ে
                এটা কোথায় কোথায় সামনে আসে, দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ভেতরে Private, বাইরে Public:</strong> Island Tours এর API
                  আর Database একই ভেতরের Network এ, তাই তারা একে অপরের সাথে Private
                  IP দিয়ে কথা বলে, দ্রুত আর নিরাপদে। কিন্তু পর্যটকের ব্রাউজার
                  সার্ভারে পৌঁছায় সার্ভারের Public IP দিয়ে। Database এর কোনো Public
                  IP থাকেই না, তাই বাইরের কেউ সরাসরি তাতে হাত দিতে পারে না।
                </ListItem>
                <ListItem>
                  <strong>Log এ Public IP:</strong> কে বুকিং করল, আপনার Log এ তার
                  Public IP লেখা থাকে, Private নয়, কারণ পর্যটকের ভেতরের ঠিকানা তো
                  আপনার সার্ভার দেখেই না। একই অফিসের অনেক পর্যটক তাই Log এ একই
                  Public IP তে দেখা যেতে পারে, কারণ তারা এক দরজা দিয়ে বেরিয়েছে।
                </ListItem>
                <ListItem>
                  <strong>নিজের বানানো সার্ভারে বাইরে থেকে ঢোকা:</strong> ধরুন
                  বাসায় নিজের Laptop এ Island Tours চালিয়ে বন্ধুকে দেখাতে চান।
                  আপনার Laptop এর ঠিকানা 192.168 দিয়ে শুরু, Private, তাই বন্ধু
                  বাইরে থেকে সেটায় পৌঁছাতে পারবে না। এর জন্য Router কে আলাদা করে
                  বলে দিতে হয় কোন বাইরের অনুরোধ ভেতরের কোন যন্ত্রে পাঠাবে, যাকে বলে
                  Port Forwarding।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Private মানেই যথেষ্ট নিরাপদ নয়",
          content: (
            <p>
              Database বাইরে থেকে সরাসরি দেখা যায় না, এটা একটা ভালো সুরক্ষার স্তর,
              কিন্তু একমাত্র ভরসা নয়। ভেতরের Network এ ঢুকে পড়া কেউ কিন্তু ওই
              Private ঠিকানায় পৌঁছাতে পারে। তাই Private রাখা মানে দরজা আড়ালে রাখা,
              তালা লাগানো নয়। আসল তালা আসে Password, Firewall আর সঠিক Access
              নিয়ম থেকে, যেগুলো পরের মডিউলগুলোতে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "request-flow",
      subHeader: { index: "006", title: "Step-by-step Flow" },
      title: <SectionTitle>ভেতর থেকে বাইরে, একটা অনুরোধ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনার Private Laptop থেকে একটা অনুরোধ বাইরের একটা Public সার্ভারে গেল,
              আর উত্তর ফিরে এল। Public আর Private কোথায় কীভাবে কাজ করল, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Laptop অনুরোধ ছাড়ল",
              description:
                "উৎস আপনার Private IP 192.168.0.5, গন্তব্য সার্ভারের Public IP। অনুরোধ প্রথমে যায় বাসার দরজা, মানে Router এর ভেতরের ঠিকানায়।",
            },
            {
              title: "Router সীমানায় ঠিকানা বদলাল",
              description:
                "বাইরে পাঠানোর আগে Router উৎস ঠিকানা বদলে দিল, Private 192.168.0.5 এর জায়গায় বসাল বাসার Public IP 103.94.135.2। আর মনে রাখল, এই অনুরোধ আসলে Laptop এর। এটাই NAT, পরের লেসন।",
            },
            {
              title: "সার্ভারে পৌঁছাল",
              description:
                "সার্ভার দেখল অনুরোধ এসেছে 103.94.135.2 থেকে, মানে আপনার বাসার Public IP। আপনার Private ঠিকানা সে জানেই না, তাই উত্তর সে পাঠাবে ওই Public IP তেই।",
            },
            {
              title: "উত্তর বাসার দরজায় ফিরল",
              description:
                "উত্তর এল 103.94.135.2 এ। Router তার মনে রাখা হিসাব দেখল, বুঝল এই উত্তর Laptop এর জন্য, তাই গন্তব্য ঠিকানা আবার বদলে ভেতরের 192.168.0.5 বসাল।",
            },
            {
              title: "Laptop উত্তর পেল",
              description:
                "উত্তর ঠিক Laptop এ পৌঁছাল। পুরো যাত্রায় আপনার Private ঠিকানা একবারও বাসা ছাড়েনি, অথচ কথাবার্তা ঠিকঠাক হয়ে গেল। এটাই Public আর Private এর সুন্দর ভাগাভাগি।",
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
                <strong>নিজের দুই IP দেখুন</strong>, নিচের Lab এ কমান্ড আছে। আগে
                ভেতরের Private IP, তারপর একটা সাইটে গিয়ে বাইরের Public IP, আর
                দুইটা যে সত্যিই আলাদা, সেটা নিজের চোখে মিলিয়ে দেখুন।
              </ListItem>
              <ListItem>
                <strong>PowerCert Animated Videos</strong>, Public আর Private IP,
                আর NAT নিয়ে ছোট, সহজ Animation।{" "}
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
                <strong>Practical Networking</strong>, Search করুন: Private IP
                Addresses আর NAT। একটু ধীরে, গোড়া থেকে বোঝানো।{" "}
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
                একটা যন্ত্রের দুইটা ঠিকানা দেখা যেতে পারে, ভেতরের Private IP আর
                বাইরের দুনিয়ার Public IP। দুইটাই তার, শুধু দুই দিক থেকে দেখা।
              </ListItem>
              <ListItem>
                Private IP বাসার ভেতরের, তিনটা রিজার্ভ ব্লকের একটা: 10 দিয়ে শুরু,
                172.16 থেকে 172.31, আর 192.168 দিয়ে শুরু। বাসার Router এ প্রায়
                সবসময় 192.168।
              </ListItem>
              <ListItem>
                Public IP পুরো বাসার একটাই, ISP দেয়, আর পৃথিবীতে অনন্য। Internet
                বাসাটাকে এই ঠিকানাতেই চেনে।
              </ListItem>
              <ListItem>
                কোটি কোটি বাসা একই Private ঠিকানা (যেমন 192.168.0.5) ব্যবহার করেও
                ঠোকাঠুকি হয় না, কারণ Private ঠিকানা আলাদা আলাদা ভেতরের দুনিয়ায়
                থাকে। এভাবেই সীমিত IP বাঁচে।
              </ListItem>
              <ListItem>
                Router সীমানায় বসে অনুরোধের উৎস ঠিকানা Private থেকে Public এ বদলে
                দেয়, উত্তর ফিরলে আবার মিলিয়ে দেয়। এই কৌশলের নাম NAT, পরের লেসন।
              </ListItem>
              <ListItem>
                বাইরের সার্ভার শুধু আপনার Public IP দেখে, Private কখনো নয়। তাই
                Log এ Public IP থাকে, আর ভেতরের যন্ত্রে বাইরে থেকে সরাসরি পৌঁছানো
                যায় না।
              </ListItem>
              <ListItem>
                Private রাখা একটা ভালো সুরক্ষার স্তর, কিন্তু একমাত্র নয়। আসল
                নিরাপত্তা আসে Password, Firewall আর Access নিয়ম থেকে।
              </ListItem>
              <ListItem>
                পরের লেসন: একটা বড় Network কে ছোট ছোট ভাগে ভাগ করা, Subnet Mask।
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
        <span className="font-bold text-primary">Private IP</span>,
        "বাসার ভেতরের ঠিকানা, তিনটা রিজার্ভ ব্লকের একটা, Internet এ চলে না",
      ],
      [
        <span className="font-bold text-primary">Public IP</span>,
        "বাইরের দুনিয়া যে ঠিকানায় চেনে, ISP দেয়, পৃথিবীতে অনন্য",
      ],
      [
        <span className="font-bold text-primary">তিনটা ব্লক</span>,
        "10.x, 172.16 থেকে 172.31, আর 192.168.x, এগুলোই Private",
      ],
      [
        <span className="font-bold text-primary">পুনর্ব্যবহার</span>,
        "কোটি বাসা একই Private ঠিকানা ব্যবহার করে, আলাদা দুনিয়া বলে ঠোকাঠুকি নেই",
      ],
      [
        <span className="font-bold text-primary">Default Gateway</span>,
        "Router এর ভেতরের ঠিকানা, বাইরে বেরোনোর দরজা, পরের কয়েক লেসন",
      ],
      [
        <span className="font-bold text-primary">NAT</span>,
        "সীমানায় Private আর Public ঠিকানা বদলে দেওয়ার কৌশল, পরের লেসন",
      ],
      [
        <span className="font-bold text-primary">সার্ভার কী দেখে</span>,
        "শুধু আপনার Public IP, Private কখনো নয়, তাই Log এ Public IP",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "যন্ত্রে নিজের IP দেখে পেলেন 192.168.0.5, কিন্তু একটা সাইট দেখাল 103.94.135.2। কেন দুইটা আলাদা?",
        options: [
          {
            key: "A",
            text: "একটা ভুল, একটা ঠিক",
            isCorrect: false,
            explanation:
              "দুইটাই ঠিক। একটা ভেতরের Private ঠিকানা, একটা বাইরের দুনিয়ার Public ঠিকানা।",
          },
          {
            key: "B",
            text: "192.168.0.5 ভেতরের Private ঠিকানা, 103.94.135.2 বাইরের Public",
            isCorrect: true,
            explanation:
              "ঠিক। যন্ত্র নিজের ভেতরের ঠিকানা জানে, আর বাইরের সাইট দেখে বাসার Public IP। দুই দুনিয়া থেকে দেখা।",
          },
          {
            key: "C",
            text: "IP প্রতি সেকেন্ডে বদলায়, তাই",
            isCorrect: false,
            explanation:
              "এটা বদলানোর ব্যাপার নয়। একই সময়ে দুইটা ঠিকানা, একটা ভেতরের একটা বাইরের।",
          },
        ],
      },
      {
        id: 2,
        text: "নিচের কোনটা একটা Private IP?",
        options: [
          {
            key: "A",
            text: "8.8.8.8",
            isCorrect: false,
            explanation:
              "এটা Public, আর বেশ বিখ্যাত, Google এর একটা DNS সার্ভার। কোনো Private ব্লকে পড়ে না।",
          },
          {
            key: "B",
            text: "192.168.1.10",
            isCorrect: true,
            explanation:
              "ঠিক। 192.168 দিয়ে শুরু, তাই এটা Private, বাসার Router এর সবচেয়ে চেনা ব্লক।",
          },
          {
            key: "C",
            text: "103.94.135.2",
            isCorrect: false,
            explanation:
              "এটা Public, তিনটা Private ব্লকের কোনোটাতেই পড়ে না।",
          },
        ],
      },
      {
        id: 3,
        text: "আপনার আর প্রতিবেশীর Laptop, দুইটারই ঠিকানা 192.168.0.5। এতে কি গণ্ডগোল হবে?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, একই ঠিকানা দুইজনের হতে পারে না",
            isCorrect: false,
            explanation:
              "Private ঠিকানার বেলায় পারে। দুইটা আলাদা ভেতরের দুনিয়ায় থাকে, একে অপরকে দেখেই না।",
          },
          {
            key: "B",
            text: "না, দুইটা আলাদা ভেতরের দুনিয়ায়, Internet শুধু আলাদা Public IP দেখে",
            isCorrect: true,
            explanation:
              "ঠিক। এই কারণেই কোটি বাসা একই Private ঠিকানা ব্যবহার করে, আর সীমিত Public ঠিকানা বাঁচে।",
          },
          {
            key: "C",
            text: "হবে, যদি দুই বাসা পাশাপাশি হয়",
            isCorrect: false,
            explanation:
              "পাশাপাশি হলেও না। যতক্ষণ আলাদা Network, ততক্ষণ একই Private ঠিকানায় সমস্যা নেই।",
          },
        ],
      },
      {
        id: 4,
        text: "আপনি একটা সার্ভারে অনুরোধ পাঠালেন। সার্ভার আপনার কোন ঠিকানা দেখে?",
        options: [
          {
            key: "A",
            text: "আপনার Private IP, 192.168.0.5",
            isCorrect: false,
            explanation:
              "না, আপনার Private ঠিকানা বাসা ছাড়ে না। Router সীমানায় সেটা বদলে দেয়।",
          },
          {
            key: "B",
            text: "আপনার বাসার Public IP",
            isCorrect: true,
            explanation:
              "ঠিক। Router উৎস ঠিকানা Public এ বদলে দেয়, তাই সার্ভার শুধু Public IP দেখে। এই কারণেই Log এ Public IP থাকে।",
          },
          {
            key: "C",
            text: "দুইটাই, Private আর Public",
            isCorrect: false,
            explanation:
              "শুধু Public। ভেতরের Private ঠিকানা সার্ভার পর্যন্ত কখনো পৌঁছায় না।",
          },
        ],
      },
      {
        id: 5,
        text: "Private IP এর তিনটা ব্লক আলাদা করে রাখা হলো কেন?",
        options: [
          {
            key: "A",
            text: "যাতে সবাই ভেতরে একই ঠিকানা পুনর্ব্যবহার করে সীমিত Public IP বাঁচে",
            isCorrect: true,
            explanation:
              "ঠিক। IPv4 এর ৪.৩ বিলিয়ন ঠিকানা কম পড়ছিল, তাই ভেতরে পুনর্ব্যবহারযোগ্য Private ব্লক রাখা হলো।",
          },
          {
            key: "B",
            text: "কারণ Private ঠিকানা বেশি দ্রুত",
            isCorrect: false,
            explanation:
              "গতির ব্যাপার নয়। মূল কারণ ঠিকানা বাঁচানো, পুনর্ব্যবহার।",
          },
          {
            key: "C",
            text: "নিরাপত্তার জন্য, Private মানেই এনক্রিপ্টেড",
            isCorrect: false,
            explanation:
              "Private মানে এনক্রিপ্টেড নয়। এটা মূলত ঠিকানা বাঁচানোর কৌশল, নিরাপত্তা তার একটা পার্শ্ব লাভ মাত্র।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের Private আর Public IP",
    subtitle: "Terminal এ চারটা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "নিজের Private IP দেখুন",
        description:
          "আপনার যন্ত্রের ভেতরের ঠিকানা বের করুন। প্রায় নিশ্চিত এটা 192.168 বা 10 দিয়ে শুরু হবে, মানে একটা Private ঠিকানা।",
      },
      {
        title: "নিজের Public IP দেখুন",
        description:
          "এবার বাইরের দুনিয়া আপনাকে যে ঠিকানায় চেনে সেটা বের করুন। খেয়াল করুন এটা প্রথমটার সাথে মেলে না।",
      },
      {
        title: "বাইরে বেরোনোর দরজা দেখুন",
        description:
          "আপনার Default Gateway, মানে Router এর ভেতরের ঠিকানা বের করুন। এটাও একটা Private ঠিকানা, সাধারণত 192.168.0.1 এর মতো।",
      },
      {
        title: "কোন ব্লক, মিলিয়ে নিন",
        description:
          "আপনার Private IP টা উপরের তিনটা ব্লকের কোনটায় পড়ে, লিখে রাখুন। আর Public IP টা যে কোনোটাতেই পড়ে না, সেটাও দেখুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-private-ip.sh",
        language: "bash",
        code: `# আপনার ভেতরের Private IP
ipconfig getifaddr en0     # macOS, সাধারণত Wi-Fi
hostname -I                # Linux, সব ঠিকানা এক লাইনে
ip -4 addr show            # Linux, বিস্তারিত

# উত্তর সম্ভবত 192.168.x.x বা 10.x.x.x।
# এটাই আপনার ভেতরের দুনিয়ার ঠিকানা, বাইরে চলে না।`,
      },
      {
        filename: "2-public-ip.sh",
        language: "bash",
        code: `# বাইরের দুনিয়া আপনাকে যে ঠিকানায় চেনে
curl ifconfig.me
# অথবা
curl https://api.ipify.org
echo

# এই সংখ্যাটা এক নম্বরের সাথে মিলবে না।
# এটাই আপনার বাসার Public IP, পুরো বাসার একটাই।`,
      },
      {
        filename: "3-gateway.sh",
        language: "bash",
        code: `# বাইরে বেরোনোর দরজা, Router এর ভেতরের ঠিকানা
netstat -nr | grep default     # macOS
ip route | grep default        # Linux

# 'default' এর পাশের ঠিকানাটাই আপনার Default Gateway,
# যেমন 192.168.0.1। খেয়াল করুন এটাও একটা Private ঠিকানা,
# আপনার যন্ত্রের মতোই একই ভেতরের দুনিয়ার।`,
      },
      {
        filename: "4-which-block.md",
        language: "markdown",
        code: `# আপনার Private IP কোন ব্লকে, মিলিয়ে নিন

আপনার ভেতরের ঠিকানা নিন (Lab 1 থেকে), আর দেখুন কোনটায় পড়ে:

  10.0.0.0     থেকে  10.255.255.255    -> Private (বড় ব্লক)
  172.16.0.0   থেকে  172.31.255.255    -> Private (মাঝের ব্লক)
  192.168.0.0  থেকে  192.168.255.255   -> Private (বাসার ব্লক)

আপনার Public IP (Lab 2) উপরের কোনোটাতেই পড়বে না,
কারণ সেটা বাইরের দুনিয়ার, ভেতরের নয়।`,
      },
    ],
    tip: "দুই নম্বর পরীক্ষাটা সবচেয়ে চোখ খুলে দেয়, কারণ আপনি এক নিমেষে দেখতে পাবেন আপনার যন্ত্র নিজেকে যে ঠিকানায় চেনে (Private) আর বাইরের দুনিয়া আপনাকে যে ঠিকানায় চেনে (Public), দুইটা সম্পূর্ণ আলাদা। তখন এই লেসনের পুরো ব্যাপারটা আর বইয়ের কথা থাকে না, নিজের যন্ত্রে ঘটতে থাকা একটা বাস্তব জিনিস হয়ে যায়।",
  },
  assignment: {
    title: "Mini Project: দুই দুনিয়ার ঠিকানা",
    time: "৪৫ মিনিট",
    difficulty: "Beginner Friendly",
    tasks: [
      <span key="1">
        <strong>নিজের দুই ঠিকানা:</strong> Lab এর এক আর দুই নম্বর চালিয়ে আপনার
        Private IP আর Public IP পাশাপাশি লিখুন। দুইটা কি সত্যিই আলাদা? Private
        টা কোন সংখ্যা দিয়ে শুরু?
      </span>,
      <span key="2">
        <strong>কোন ব্লক:</strong> আপনার Private IP টা তিনটা ব্লকের কোনটায় পড়ে,
        Lab এর চার নম্বর দিয়ে মিলিয়ে লিখুন। আর এক লাইনে লিখুন, আপনার Public IP
        কেন কোনো ব্লকে পড়ে না।
      </span>,
      <span key="3">
        <strong>দরজা খুঁজুন:</strong> Lab এর তিন নম্বর দিয়ে আপনার Default Gateway
        বের করুন। এটা কি Private না Public? আপনার যন্ত্রের ঠিকানার সাথে এর প্রথম
        কয়েকটা সংখ্যা কি মেলে? কেন মেলে বলে মনে হয়?
      </span>,
      <span key="4">
        <strong>নিজের ভাষায় লিখুন (৫ লাইন):</strong> একজন বন্ধু জিজ্ঞেস করলেন,
        দুই বাসার Laptop এর ঠিকানা তো একই 192.168.0.5, তাহলে গণ্ডগোল হয় না কেন?
        তাঁকে সহজ ভাষায় বোঝান, ভেতরের দুনিয়া আর Public IP এর উদাহরণ দিয়ে।
      </span>,
    ],
    deliverables: [
      <span key="1">আপনার Private আর Public IP, পাশাপাশি</span>,
      <span key="2">Private IP কোন ব্লকে, আর Public কেন কোথাও পড়ে না</span>,
      <span key="3">আপনার Default Gateway, আর সেটা Private কি না</span>,
      <span key="4">একই Private ঠিকানায় গণ্ডগোল হয় না কেন, ৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
