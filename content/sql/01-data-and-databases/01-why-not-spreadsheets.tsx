import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CopiedPriceLab,
  SheetSpotLab,
  TwoEditorsLab,
} from "../../../components/course/topics/sql-basics/sheet-animations";
import {
  SheetToTablesDiagram,
  VersionChaosDiagram,
  WishListDiagram,
} from "../../../components/course/topics/sql-basics/sheet-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";

export const whyNotSpreadsheetsContent: TopicData = {
  id: "why-not-spreadsheets",
  introduction: {
    badge: "MODULE 01 · LESSON 01",
    title: <SectionTitle>যে Sheet একদিন আর সামলাতে পারল না</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          প্রায় প্রতিটা ছোট ব্যবসার Data এর গল্প একই ভাবে শুরু হয়। একটা Excel
          ফাইল, বা একটা Google Sheet। প্রথম মাসে সেটা দারুণ চলে। তারপর একদিন
          দেখা যায় একই Customer এর নাম তিন রকম বানানে লেখা, একই ট্যুরের দুটো দাম
          চলছে, আর শেষ সিটটা দুইজনের কাছে বিক্রি হয়ে গেছে। কেউ ইচ্ছা করে কোনো ভুল
          করেননি। Sheet টাই এমন ভুল আটকানোর জন্য তৈরি হয়নি।
        </ContentParagraph>
        <ContentParagraph>
          এই ট্র্যাকের প্রথম লেসন তাই SQL দিয়ে শুরু হচ্ছে না, শুরু হচ্ছে একটা
          প্রশ্ন দিয়ে: Spreadsheet এ এমন কী নেই, যার জন্য পৃথিবীর প্রায় প্রতিটা
          App এর পেছনে একটা Database বসানো থাকে? উত্তরটা আপনি একটা একটা করে
          নিজের চোখে দেখবেন। শেষে আপনার হাতে থাকবে একটা তালিকা, আমরা একটা
          Data রাখার জায়গার কাছে আসলে কী কী চাই। পুরো ট্র্যাকটা সেই তালিকার
          লম্বা উত্তর।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি সব কিছু লিখে রাখতে পারি, কিন্তু কোনো কিছুর দায়িত্ব নিতে পারি না। কে কী লিখল, দুইজন একসাথে লিখলে কার কথা থাকবে, ভুল কিছু লিখলে আটকাব কিনা, এসব আমার কাজ না।",
      author: "Spreadsheet",
      role: "Lesson 01",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "scene",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>যে Sheet দিয়ে ব্যবসা শুরু হলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা গল্প কল্পনা করুন। Island Tours এর প্রথম শীতকাল। প্রতিষ্ঠাতা
                নিজেই ফোন ধরেন, নিজেই Booking নেন, নিজেই হিসাব রাখেন। হিসাব রাখার
                জন্য তিনি একটা Google Sheet খুললেন, নাম দিলেন Bookings। গল্পটা
                বানানো, কিন্তু এর প্রতিটা ঘটনা বাস্তবে হাজারো ছোট ব্যবসায় প্রতি
                সপ্তাহে ঘটে।
              </ContentParagraph>
              <ContentParagraph>
                Spreadsheet জিনিসটা আসলে একটা ঘর কাটা খাতা। আড়াআড়ি প্রতিটা
                সারিকে বলে Row, খাড়া প্রতিটা সারিকে বলে Column, আর একটা Row আর
                একটা Column যেখানে মেলে সেই ছোট ঘরটাকে বলে Cell। প্রতিষ্ঠাতা প্রথম
                Row এ Column এর নামগুলো লিখলেন: কবে Booking হলো, Customer এর নাম,
                ফোন নম্বর, কোন ট্যুর, কোন তারিখে যাত্রা, কয়টা সিট, একজনের দাম,
                মোট টাকা, আর টাকা কীভাবে এল। তারপর প্রতিটা নতুন Booking এর জন্য
                নিচে একটা করে নতুন Row।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম মৌসুমে Booking হলো ত্রিশটার মতো। একজন মানুষ লেখেন, একজন
                মানুষ পড়েন। কোনো সমস্যা নেই। আর সত্যি বলতে, শুরুতে এর চেয়ে ভালো
                পছন্দ খুব কমই ছিল।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>খরচ নেই:</strong> Google Sheet বিনামূল্যে, Excel প্রায়
                  সবার কম্পিউটারে আগে থেকেই আছে।
                </ListItem>
                <ListItem>
                  <strong>শেখার কিছু নেই:</strong> খাতার মতো দেখতে, তাই প্রথম দিন
                  থেকেই সবাই ব্যবহার করতে পারেন।
                </ListItem>
                <ListItem>
                  <strong>কোনো নিয়ম নেই:</strong> যেকোনো ঘরে যেকোনো কিছু লেখা
                  যায়। শুরুতে এটা স্বাধীনতার মতো লাগে। এই লেসনের শেষে দেখবেন,
                  বড় হওয়ার পর এটাই সবচেয়ে বড় দুর্বলতা।
                </ListItem>
                <ListItem>
                  <strong>হিসাব নিজে হয়:</strong> একটা Formula লিখে দিলে মোট
                  টাকা নিজে থেকে যোগ হয়ে যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় মৌসুমে ব্যবসা বড় হলো। একটা Facebook Page, একটা ছোট
                Website, অফিসে একজন কর্মী, মাঠে একজন এজেন্ট যিনি সরাসরি
                পর্যটকদের সাথে বসে Booking নেন, আর মাসের শেষে একজন হিসাবরক্ষক।
                টাকা আসতে লাগল bKash, Nagad আর Card এ। Booking এর সংখ্যা তিনশো
                ছাড়াল। আর তখন থেকে Sheet টা একটু একটু করে ভাঙতে শুরু করল।
              </ContentParagraph>
              <ContentParagraph>
                ঠিক চারটা জিনিস বদলেছিল, আর প্রতিটা Sheet এর একটা আলাদা দুর্বলতায়
                আঘাত করল:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>লেখার মানুষ বাড়ল:</strong> একজনের জায়গায় তিনজন, কখনো
                  একই সময়ে। এতে আসে একই মানুষের নানা বানান আর একসাথে লেখার
                  সংঘর্ষ।
                </ListItem>
                <ListItem>
                  <strong>Row বাড়ল:</strong> ত্রিশ থেকে তিনশো, তারপর হাজার। এতে
                  আসে কপি করা তথ্যের অমিল আর ধীরগতি।
                </ListItem>
                <ListItem>
                  <strong>Sheet বাড়ল:</strong> Bookings এর পাশে Payments, Tours,
                  Guides। এতে আসে Sheet গুলোর মধ্যে সম্পর্কের প্রশ্ন।
                </ListItem>
                <ListItem>
                  <strong>বাইরের দুনিয়া Data চাইল:</strong> Website এ খালি সিট
                  দেখাতে হবে, রাত দুইটাতেও Booking নিতে হবে। এতে আসে একটা
                  Program কে Data দেওয়ার প্রশ্ন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                পরের সেকশনগুলোতে এই চারটা পরিবর্তন থেকে জন্মানো প্রতিটা সমস্যা
                আলাদা করে দেখবেন। প্রতিটার শেষে এক লাইনে বলা থাকবে Database কীভাবে
                সেটা সামলায়, আর এই ট্র্যাকের কোথায় সেটা বিস্তারিত শিখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসন Spreadsheet এর বিরুদ্ধে না",
          content: (
            <p>
              Spreadsheet একটা দারুণ Tool, আর এই লেসনের শেষে একটা পুরো সেকশন আছে
              কখন সেটাই সঠিক পছন্দ। এখানে প্রশ্নটা ভালো না খারাপ নিয়ে না। প্রশ্ন
              হলো, কোন মুহূর্তে একটা খাতা আর একটা ব্যবসার Data সামলানোর মতো থাকে
              না, আর ঠিক কোন কোন জায়গায় সে ব্যর্থ হয়। এই জায়গাগুলো চিনলে আপনি
              বুঝবেন Database এর প্রতিটা Feature কেন আছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "spot",
      subHeader: { index: "002", title: "Spot the Problems" },
      title: <SectionTitle>Sheet টা দেখুন, ভুলগুলো খুঁজুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে Island Tours এর Booking Sheet এর একটা টুকরো, দ্বিতীয় মৌসুমের
              মাঝামাঝি সময়ের। প্রথম দেখায় সব ঠিক মনে হবে। এতে দশটা ভুল লুকিয়ে
              আছে, যেগুলোর একটাও কেউ ইচ্ছা করে করেননি। পড়া চালিয়ে যাওয়ার আগে
              নিজে খুঁজে দেখুন, প্রতিটা Row কে অন্য Row গুলোর সাথে মিলিয়ে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SheetSpotLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দশটা ভুল দেখতে আলাদা, কিন্তু খেয়াল করলে এরা তিনটা পরিবারে পড়ে।
                এই তিনটা পরিবার মনে রাখুন, কারণ এই লেসনের বাকিটা আর পরের পুরো
                ট্র্যাক এই তিনটা ঘিরে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একই জিনিস নানাভাবে লেখা:</strong> একই মানুষের দুই রকম
                  নাম, একই ফোন নম্বরের দুই রকম লেখা, একই তারিখের দুই রকম ধরন।
                  মানুষ চোখ দিয়ে দেখে বোঝেন এগুলো একই, কিন্তু Sheet এর কাছে এগুলো
                  সম্পূর্ণ আলাদা লেখা।
                </ListItem>
                <ListItem>
                  <strong>ভুল মান ঢুকে পড়া:</strong> সিটের ঘরে five, মাইনাস এক,
                  ফাঁকা ফোন নম্বর, হাতে ভুল হিসাব করা Total। Sheet কাউকে থামায়নি,
                  কারণ তার কোনো নিয়ম জানা নেই।
                </ListItem>
                <ListItem>
                  <strong>কপি করা তথ্যের অমিল:</strong> একই ট্যুরের দাম প্রতিটা
                  Row এ আলাদা করে লেখা, আর দাম বদলানোর সময় কয়েকটা Row বাদ পড়ে
                  গেছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সবচেয়ে বিপজ্জনক ব্যাপারটা হলো, এই ভুলগুলোর কোনোটাই চিৎকার করে না।
                Sheet কোনো Error দেখায় না। ভুলগুলো চুপচাপ বসে থাকে, আর মাস শেষে
                আয়ের হিসাব বা Customer এর সংখ্যার মতো কোনো একটা গুরুত্বপূর্ণ
                উত্তরকে নিঃশব্দে ভুল করে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "identity",
      subHeader: { index: "003", title: "Identity" },
      title: <SectionTitle>একজন মানুষ, তিনটা নাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Sheet একজন Customer কে চেনে শুধু তাঁর নামের লেখা দিয়ে। আর লেখা
                মানুষ ভেদে বদলায়। অফিসের কর্মী লেখেন Rahim Uddin, এজেন্ট তাড়াহুড়ায়
                লেখেন rahim udin, আরেকদিন কেউ নামের শেষে একটা ফাঁকা জায়গা রেখে দেন,
                যেটা চোখেই পড়ে না। মানুষের কাছে তিনটাই একজন। Sheet এর কাছে তিনজন
                আলাদা মানুষ।
              </ContentParagraph>
              <ContentParagraph>
                এর ফল কয়েকটা খুব বাস্তব প্রশ্নে ধরা পড়ে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আমাদের Customer কতজন?</strong> আলাদা নাম গুনলে সংখ্যাটা
                  আসলের চেয়ে বেশি আসে, কারণ একই মানুষ কয়েকবার গোনা হয়।
                </ListItem>
                <ListItem>
                  <strong>Rahim সাহেব কয়টা ট্যুর করেছেন?</strong> তিনবার ঘুরে
                  এলে তিনি হয়তো একটা ছাড় পাওয়ার যোগ্য। কিন্তু নাম ধরে খুঁজলে
                  Sheet একটা ট্যুর কম দেখাবে, আর তিনি ছাড়টা পাবেন না।
                </ListItem>
                <ListItem>
                  <strong>এই নম্বরে আগে কেউ বুক করেছেন?</strong> একটা Row এ
                  +8801000000102, আরেকটায় 01000000102। একই নম্বর, কিন্তু খুঁজতে
                  গেলে একটা আরেকটাকে খুঁজে পায় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মূল সমস্যাটা নামের বানান না। মূল সমস্যা হলো, Sheet এ একজন মানুষের
                এমন কোনো পরিচয় নেই যেটা কখনো বদলায় না আর অন্য কারো হতে পারে না।
                আমরা মানুষকে চিনি নাম দিয়ে, কিন্তু নাম আসলে পরিচয় হিসেবে খুব দুর্বল:
                দুইজনের একই নাম হতে পারে, আর একজনের নাম নানাভাবে লেখা হতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                Database এখানে দুটো কাজ করে। প্রথমত, প্রতিটা Customer কে একটা
                নম্বর দেয় যেটা কখনো বদলায় না, যেমন customer_id 1। পরের সব Booking
                সেই নম্বর দিয়ে Customer কে চেনে, নামের বানান দিয়ে না। এমন একটা
                Column, যার মান প্রতিটা Row এ আলাদা আর যেটা দিয়ে Row টাকে নিশ্চিত
                চেনা যায়, তার নাম Primary Key। দ্বিতীয়ত, Database কে বলে রাখা যায়
                যে একই Email দুইজনের হতে পারবে না। কেউ আবার একই Email দিয়ে নতুন
                Customer বানাতে গেলে Database সেটা ফিরিয়ে দেবে। এটা আপনি এই লেসনের
                শেষের দিকে নিজে চালিয়ে দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Sheet এর জোড়াতালি, আর তার সীমা",
          content: (
            <p>
              Spreadsheet এও কিছু উপায় আছে: TRIM দিয়ে বাড়তি ফাঁকা জায়গা কাটা,
              Dropdown দিয়ে নাম বাছাই করানো, ফোনের Column এর একটা নির্দিষ্ট ধরন
              ঠিক করা। এগুলো কাজে লাগে, কিন্তু সবগুলোই ঐচ্ছিক। কাউকে না কাউকে
              মনে করে বসাতে হয়, আর অন্য জায়গা থেকে Paste করা লেখা অনেক সময় এই
              নিয়মগুলো পাশ কাটিয়ে যায়। Database এ পরিচয় আর নিয়ম Data এর সাথেই
              বাঁধা থাকে, কেউ চাইলেও এড়াতে পারেন না। Primary Key কীভাবে কাজ করে
              তা লেসন ০৪ এ দেখবেন, আর নিজে বানানো শিখবেন Module 09 এ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "copies",
      subHeader: { index: "004", title: "Copies Drift" },
      title: <SectionTitle>একই কথা চল্লিশ জায়গায় লেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Booking Sheet এ প্রতিটা Row এ ট্যুরের দাম লেখা থাকে। Saint Martin
                এর ট্যুরে চল্লিশটা Booking মানে চল্লিশটা Row এ একই সংখ্যা, 12500।
                দেখতে নিরীহ। সমস্যা শুরু হয় যেদিন জাহাজের ভাড়া বাড়ে আর দাম
                13000 করতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                অফিসের কর্মী একটা একটা Row এ গিয়ে দাম বদলাতে শুরু করলেন। পঁয়ত্রিশ
                নম্বরে পৌঁছানোর সময় ফোন এল, তিনি উঠে গেলেন। বাকি পাঁচটা Row এ
                পুরনো দাম রয়ে গেল। এখন Sheet এ একই ট্যুরের দুটো দাম। কোনটা ঠিক?
                Sheet জানে না। নিচের Lab এ নিজে একবার দাম বদলে দেখুন, দুই
                পদ্ধতিতে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CopiedPriceLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই সমস্যার দুটো নাম আছে, যেগুলো পরে Database Design এর আলোচনায়
                বারবার আসবে। একই তথ্যের একাধিক কপি থাকাকে বলে Redundancy। আর
                সেই কপিগুলোর কিছু বদলে কিছু পুরনো রয়ে যাওয়াকে বলে Update
                Anomaly, মানে বদলানোর সময়ের অসঙ্গতি। প্রথমটা কারণ, দ্বিতীয়টা ফল।
              </ContentParagraph>
              <ContentParagraph>
                Database এর উত্তরটা খুব সরল একটা নিয়ম: প্রতিটা তথ্য থাকবে ঠিক এক
                জায়গায়। ট্যুরের দাম থাকবে ট্যুরের Row তে, একবার। Booking শুধু বলে
                রাখবে সে কোন ট্যুরের, দামটা নিজের কাছে কপি করবে না। দাম বদলাতে
                হলে বদলাবেন একটা ঘর, আর যে যেখান থেকেই দাম পড়ুক, নতুনটাই পাবে।
                এই নিয়মটাকে ধাপে ধাপে কাজে লাগানোর পদ্ধতির নাম Normalization,
                যেটা Module 11 এর বড় অংশ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "সব কপি খারাপ না: অতীতের ছবি আর বর্তমানের তথ্য",
          content: (
            <p>
              Island Tours এর Database এ bookings Table এর total_bdt Column এ
              প্রতিটা Booking এর মোট টাকা আলাদা করে লেখা থাকে। এটা কি একই ভুল?
              না। Rahim সাহেব যেদিন বুক করেছিলেন, সেদিন তিনি 25000 টাকা দিয়েছেন।
              পরে ট্যুরের দাম বাড়লে তাঁর পুরনো Booking এর টাকা বদলে যাওয়া উচিত না।
              ট্যুরের দাম একটা বর্তমানের তথ্য, এটা থাকবে এক জায়গায়। কিন্তু একটা
              Booking এ কত টাকা নেওয়া হয়েছিল, সেটা অতীতের একটা ঘটনার ছবি, যেটা আর
              বদলাবে না। কোন কপি ইচ্ছাকৃত আর কোনটা দুর্ঘটনা, এই পার্থক্য করতে পারা
              Database Design এর একটা আসল দক্ষতা। Module 11 এর Denormalization
              লেসনে এটা বিস্তারিত আছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "rules",
      subHeader: { index: "005", title: "No Rules" },
      title: <SectionTitle>ঘরে যা খুশি লেখা যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Spreadsheet এর একটা ঘর কোনো প্রশ্ন করে না। সিটের Column এ কেউ
                লিখলেন five, ঘর নিয়ে নিল। কেউ ভুল করে লিখলেন -1, নিয়ে নিল। ফোনের
                ঘর ফাঁকা রাখলেন, আপত্তি নেই। তারিখ একজন লিখলেন 15 Jan, আরেকজন
                15/01/2026, দুটোই চলল। Total একজন Formula দিয়ে বানালেন, আরেকজন
                মাথায় হিসাব করে টাইপ করলেন, আর ভুল করলেন।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা ভুল মান পরে কোনো একটা হিসাব নষ্ট করে। সিটের যোগফল করলে
                five বাদ পড়ে, কারণ Spreadsheet এর SUM লেখাকে সংখ্যা ভাবে না আর
                চুপচাপ এড়িয়ে যায়। মাইনাস এক সিট আয় থেকে টাকা কমিয়ে দেয়। ফাঁকা
                ফোন নম্বর দেখে বোঝা যায় না, নম্বর আসলে নেই, নাকি কেউ লিখতে ভুলে
                গেছেন।
              </ContentParagraph>
              <ContentParagraph>
                একটা Database এ প্রতিটা Column এর জন্য আগে থেকে নিয়ম লিখে রাখা যায়,
                আর সেই নিয়ম তারপর প্রতিটা নতুন Row এর উপর খাটে, কে লিখছে বা কোন
                Program থেকে লিখছে তাতে কিছু যায় আসে না:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Data Type:</strong> seats Column এ শুধু পূর্ণসংখ্যা
                  থাকবে। five লিখতে গেলে Database সাথে সাথে ফিরিয়ে দেবে। Type হলো
                  একটা Column কী ধরনের মান রাখতে পারে তার ঘোষণা: সংখ্যা, লেখা,
                  তারিখ, হ্যাঁ বা না।
                </ListItem>
                <ListItem>
                  <strong>NOT NULL:</strong> কোনো Column খালি রাখা যাবে না, এই
                  নিয়ম। যেমন প্রতিটা Booking এর একজন Customer থাকতেই হবে। NULL মানে
                  এখানে মান অজানা, এই ধারণাটা Module 03 এ ভালো করে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>CHECK:</strong> নিজের বানানো যেকোনো শর্ত। যেমন seats শূন্যের
                  চেয়ে বড় হতে হবে, বা status হবে শুধু pending, confirmed অথবা
                  cancelled।
                </ListItem>
                <ListItem>
                  <strong>UNIQUE:</strong> এই Column এর মান দুটো Row এ এক হতে পারবে
                  না, যেমন Email।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই নিয়মগুলোর একসাথে একটা নাম আছে, Constraint, মানে বাঁধন। এগুলো
                নিজে লেখা শিখবেন Module 09 এ। আজ শুধু এটুকু মনে রাখুন: Sheet এ
                নিয়ম মানুষের মনে থাকে, Database এ নিয়ম Data এর সাথে লেখা থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Database নিলেই সব ভুল বন্ধ হয় না",
          content: (
            <p>
              Database শুধু সেই ভুলগুলো আটকায়, যেগুলোর নিয়ম আপনি লিখে দিয়েছেন।
              কেউ যদি ভুল করে অন্য কারো ফোন নম্বর লেখেন, সেটা দেখতে একদম ঠিক
              একটা নম্বর, তাই কোনো নিয়মই সেটা ধরবে না। Database আপনাকে নিয়ম
              বসানোর জায়গা দেয়, কোন নিয়ম বসাবেন সেটা আপনার সিদ্ধান্ত। ভালো Design
              মানে ঠিক নিয়মগুলো বেছে নেওয়া।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "two-editors",
      subHeader: { index: "006", title: "Two at Once" },
      title: <SectionTitle>একই ফাইলে দুইজন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেখার মানুষ যখন একজন থেকে তিনজন হলো, তখন সবচেয়ে কঠিন সমস্যাটা এল।
                এটা দুই রূপে দেখা দেয়, ফাইলটা কীভাবে ভাগ করা হচ্ছে তার উপর
                নির্ভর করে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>প্রথম রূপ, ফাইলের কপি ঘোরাঘুরি।</strong> Excel ফাইল থাকে
                অফিসের ল্যাপটপে। এজেন্টের দরকার হলে কেউ WhatsApp এ পাঠিয়ে দেন।
                এজেন্ট নিজের কপিতে কয়েকটা Booking যোগ করেন, অফিসের কর্মী নিজের
                কপিতে আরও কয়েকটা। সন্ধ্যায় দুটো আলাদা ফাইল, দুটোই কিছুটা ঠিক,
                কোনোটাই পুরো ঠিক না। এরপর আসে ফাইলের নামের সেই চেনা মিছিল:
                final, final_v2, final_REAL।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <VersionChaosDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>দ্বিতীয় রূপ, একটাই Live Sheet।</strong> এর সমাধান হিসেবে
                সবাই একই Google Sheet ব্যবহার শুরু করলেন। এখন কপি একটাই, সবাই
                একই জিনিস দেখেন, এমনকি অন্যের Cursor ও দেখা যায়। সমস্যা মিটল?
                পুরোপুরি না। শেষ সিটের গল্পটা ধাপে ধাপে দেখুন, তারপর একই ঘটনা
                Database এ দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TwoEditorsLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভুলটা কোথায় হলো, সেটা খুব সূক্ষ্ম। দুইজন কর্মীই ঠিক কাজ করেছেন:
                দেখেছেন সিট আছে, তারপর লিখেছেন। গোলমালটা হলো দেখা আর লেখা দুটো
                আলাদা মুহূর্ত, আর মাঝের ফাঁকে পৃথিবী বদলে গেছে। একজনের দেখার পর
                আর লেখার আগে অন্যজন লিখে ফেলেছেন। যখন একটা কাজের ফল নির্ভর করে
                দুইজনের মধ্যে কে আগে পৌঁছাল তার উপর, তাকে বলে Race Condition, দৌড়ের
                মতো অবস্থা।
              </ContentParagraph>
              <ContentParagraph>
                Live Sheet এই দৌড়টা থামাতে পারে না, কারণ সে শুধু লেখা জমা রাখে।
                দেখা আর লেখাকে একসাথে বেঁধে এক অবিভাজ্য কাজ বানানোর কোনো উপায়
                তার নেই। Database এর কাছে আছে। সে কয়েকটা ধাপকে একটা Transaction
                হিসেবে চালাতে পারে, মানে হয় সবগুলো ধাপ হবে, নয়তো একটাও না। আর
                দরকার হলে একটা Row আটকে রাখতে পারে, যাকে বলে Lock, যাতে এক
                Transaction শেষ না হওয়া পর্যন্ত অন্য কেউ সেই Row বদলাতে না পারে।
                এগুলো Module 12 এর বিষয়, আর সেখানে Island Tours এর ঠিক এই
                Double Booking Bug টাই চারটা উপায়ে সারানো হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "পর্দায় দেখা আর আসল অবস্থা এক না",
          content: (
            <p>
              অন্যের Cursor দেখা গেলে মনে হয় সবাই সব জানেন। কিন্তু এজেন্ট যখন
              সিটের সংখ্যা দেখলেন, তখনকার সংখ্যাটা তাঁর মাথায় রয়ে গেল। পরের দুই
              সেকেন্ডে কী বদলাল, সেটা তাঁর সিদ্ধান্তে আর ঢোকেনি। তাই সমস্যাটা
              পর্দার না, সিদ্ধান্তের। যিনি শেষ সিদ্ধান্ত নেবেন, যেমন Database, তাঁকে
              লেখার মুহূর্তেই আবার দেখে নিতে হবে, আর ওই মুহূর্তে আর কাউকে বদলাতে
              দেওয়া যাবে না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "links",
      subHeader: { index: "007", title: "No Links" },
      title: <SectionTitle>আলাদা Sheet, জোড়া লাগানো মানুষের মাথায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ব্যবসা বড় হলে একটা Sheet এ সব রাখা যায় না, তাই একই ফাইলে নতুন
                Sheet খোলা হলো: Tours এ ট্যুরের তালিকা আর দাম, Payments এ bKash আর
                Card এর Statement থেকে কপি করা টাকার তালিকা। এখন প্রশ্ন, কোন
                Payment কোন Booking এর?
              </ContentParagraph>
              <ContentParagraph>
                হিসাবরক্ষক মাসের শেষে বসেন আর চোখ দিয়ে মেলান: এই 25000 টাকা এসেছে
                +8801000000101 থেকে, Bookings Sheet এ এই নম্বর খুঁজি, পেলাম Rahim
                Uddin, Saint Martin, দুটো সিট, মিলে গেছে। একটা মেলাতে এক মিনিট।
                তিনশো Payment মেলাতে পুরো একটা দিন। আর যেখানে নাম বা নম্বর অন্যভাবে
                লেখা, সেখানে মেলে না।
              </ContentParagraph>
              <ContentParagraph>
                Spreadsheet এর VLOOKUP বা XLOOKUP এর মতো Formula এই খোঁজাটা
                কিছুটা নিজে করতে পারে, কিন্তু তারা খোঁজে লেখা মিলিয়ে। rahim udin আর
                Rahim Uddin মেলে না। কেউ Tours Sheet এ একটা ট্যুরের নাম বদলে দিলে
                পুরনো Booking গুলোর খোঁজ ভেঙে যায়। কেউ একটা ট্যুরের Row মুছে দিলে
                সেই ট্যুরের Booking গুলো এমন একটা ট্যুরের দিকে আঙুল তুলে থাকে, যেটা
                আর নেই। Sheet গুলোর মধ্যে সম্পর্কটা আসলে কোথাও লেখা নেই, আছে
                মানুষের মাথায় আর কয়েকটা ভঙ্গুর Formula তে।
              </ContentParagraph>
              <ContentParagraph>
                Database এ সম্পর্কটা নিজেই Data এর অংশ। প্রতিটা Booking Row এ লেখা
                থাকে customer_id 1, মানে এই Booking টা সেই Customer এর যার নম্বর ১।
                অন্য Table এর Primary Key কে দেখানো এমন Column কে বলে Foreign Key।
                আর Database এর কাছে Foreign Key একটা প্রতিশ্রুতি: এমন কোনো Booking
                সে রাখবে না যার Customer নেই, আর যে Customer এর Booking আছে তাঁকে
                সে চুপচাপ মুছতে দেবে না। দুটো Table কে এই সম্পর্ক ধরে জোড়া দিয়ে
                একসাথে পড়ার নাম JOIN। Foreign Key কী সেটা লেসন ০৪ এ দেখবেন, আর
                JOIN এর জন্য পুরো Module 06।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "access",
      subHeader: { index: "008", title: "Access and History" },
      title: <SectionTitle>কে দেখল, কে বদলাল, কে মুছল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>কে দেখতে পারে।</strong> Booking Sheet এ প্রতিটা পর্যটকের
                নাম আর ফোন নম্বর। Guide দের তাঁদের নিজেদের ট্যুরের যাত্রীদের তালিকা
                দরকার, তাই তাঁদেরও Sheet টা Share করা হলো। এখন প্রতিটা Guide প্রতিটা
                পর্যটকের ফোন নম্বর দেখতে পান, যাঁদের সাথে তাঁদের কোনো সম্পর্ক নেই।
                Sheet দেখার অনুমতি দেওয়া হয় পুরো ফাইলে। কোনো Sheet বা কয়েকটা ঘর
                বদলানো আটকানো যায় ঠিকই, কিন্তু প্রত্যেকে শুধু নিজের ট্যুরের Row
                দেখবেন, এমন নিয়ম একটা Sheet এর ভেতরে বসানোর সহজ উপায় নেই। আর কেউ ভুল করে Link
                টা Anyone with the link করে দিলে, Link যার হাতে যাবে সে সবার নম্বর
                পাবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>কে কী বদলেছে।</strong> Arif Chowdhury এর Booking এ দাম কেন
                17500? কে লিখেছিলেন, কবে, ইচ্ছা করে না ভুলে? Google Sheet এর
                Version History আছে, কিন্তু হাজার হাজার ছোট পরিবর্তনের ভেতর থেকে
                একটা ঘরের ইতিহাস খুঁজে বের করা কঠিন। আর ল্যাপটপের Excel ফাইলে এমন
                কোনো ইতিহাসই সাধারণত থাকে না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>কী হারাতে পারে।</strong> কেউ শুধু Customer এর Column টা
                সিলেক্ট করে নাম অনুযায়ী সাজালেন, আর সতর্কবার্তা না পড়েই এগিয়ে
                গেলেন। নামগুলো নতুন ক্রমে বসল, কিন্তু পাশের ফোন নম্বর আর ট্যুর আগের
                জায়গায় রয়ে গেল। এখন প্রতিটা Row এ একজনের নাম আর অন্যজনের ট্যুর।
                কেউ ভুল করে একটা Row মুছে দিলেন। কারো ল্যাপটপ চুরি হলো, আর সাথে গেল
                একমাত্র কপি। আর একটা পুরনো কপি দিয়ে নতুনটা Overwrite হয়ে গেলে
                মাঝের সব কাজ হারায়।
              </ContentParagraph>
              <ContentParagraph>
                Database এর প্রতিটার জন্য আলাদা ব্যবস্থা আছে। কাকে কোন Table এ কী
                করতে দেওয়া হবে, এমনকি কে কোন Row দেখবেন, সেটা ঠিক করা যায় Role আর
                Permission দিয়ে। কে কখন কী বদলেছে, সেটা নিজে থেকে লিখে রাখা যায় একটা
                Audit Log এ। দুটোই Module 16 এ। আর Data নিয়মিত Backup হয়, দরকার
                হলে গতকাল বিকেল চারটার অবস্থায় ফিরে যাওয়া যায়, যেটা Module 18 এর
                বিষয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "scale",
      subHeader: { index: "009", title: "Size" },
      title: <SectionTitle>Row যখন লাখ ছাড়ায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Spreadsheet এর একটা শক্ত সীমা আছে। Microsoft এর নিজের হিসাবে Excel
                এর একটা Worksheet এ সর্বোচ্চ 1,048,576টা Row আর 16,384টা Column
                থাকতে পারে। Google Sheet এর ও একটা ফাইলে মোট Cell এর সংখ্যার সীমা
                আছে। তবে সীমায় পৌঁছানোর অনেক আগেই আরেকটা জিনিস ঘটে: সব ধীর হয়ে
                যায়।
              </ContentParagraph>
              <ContentParagraph>
                কারণটা বোঝা সহজ। Spreadsheet পুরো ফাইলটা একবারে খুলে Memory তে
                রাখে। একটা Formula বদলালে তার উপর নির্ভর করা সব হিসাব আবার হয়। কোনো
                নাম খুঁজতে গেলে উপর থেকে নিচ পর্যন্ত প্রতিটা Row এক এক করে দেখা হয়।
                ত্রিশটা Row এ এটা চোখের পলকে হয়। পাঁচ বছরের Booking, প্রতিটার
                Payment আর Review মিলিয়ে কয়েক লাখ Row এ ফাইল খুলতেই সময় লাগে, আর
                তিনজন একসাথে কাজ করলে আরও বেশি।
              </ContentParagraph>
              <ContentParagraph>
                Database Data রাখে Disk এ, আর প্রতিটা প্রশ্নের জন্য শুধু দরকারি অংশটুকু
                পড়ে। বইয়ের শেষের সূচির মতো আলাদা একটা গোছানো তালিকা রেখে দেওয়া যায়,
                যাতে কোনো নাম খুঁজতে পুরো বই উল্টাতে না হয়। এই সূচির নাম Index।
                সঠিক Index থাকলে কোটি Row এর মধ্যেও একটা Booking খুঁজে পেতে
                মিলিসেকেন্ড লাগে। কীভাবে, সেটা Module 13 এ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "app",
      subHeader: { index: "010", title: "Apps Need Data" },
      title: <SectionTitle>Website যখন একই Data চায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ পরিবর্তনটা সবচেয়ে বড়। Island Tours চাইল পর্যটকরা Website থেকে
                নিজেরাই খালি সিট দেখে বুক করবেন, রাত দুইটায়ও, আর শীতের এক ছুটির
                সকালে পঞ্চাশজন একসাথে। এখন Data পড়বে আর লিখবে একটা Program, মানুষ
                না। আর Program এর চাহিদা একদম আলাদা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একসাথে অনেকে:</strong> একটা ফাইল মূলত বানানো হয়েছে একবারে
                  একজন খুলবে বলে। দুটো Program একই ফাইলে একসাথে লিখতে গেলে একজনের
                  লেখা আরেকজনের লেখা মুছে দিতে পারে, এমনকি ফাইলটাই নষ্ট হয়ে যেতে
                  পারে।
                </ListItem>
                <ListItem>
                  <strong>সবসময় চালু:</strong> কারো ল্যাপটপ বন্ধ থাকলে ফাইলও বন্ধ।
                  Website এর দরকার এমন কিছু যা দিনরাত চলছে আর ডাক দিলেই সাড়া দেয়।
                </ListItem>
                <ListItem>
                  <strong>সঠিক আর সঙ্গতিপূর্ণ উত্তর:</strong> পঞ্চাশজনের প্রত্যেককে
                  এমন একটা উত্তর দিতে হবে যেটা ওই মুহূর্তে সত্যি, আর কারো Booking
                  যেন অন্যের Booking কে নষ্ট না করে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Google Sheet এর একটা API আছে, মানে একটা Program চাইলে Sheet এ পড়তে
                আর লিখতে পারে। ছোট কাজে, যেমন একটা Form থেকে জমা পড়া উত্তর তুলে
                রাখতে, এটা ভালো চলে। কিন্তু সেখানে কতবার ডাকা যাবে তার সীমা আছে, আর
                আগের সেকশনের দেখা আর লেখাকে একসাথে বাঁধার কোনো উপায় সেখানেও নেই।
                একটা Booking System এর ভার বইবার জন্য এটা তৈরি হয়নি।
              </ContentParagraph>
              <ContentParagraph>
                দরকার এমন একটা Program, যেটা দিনরাত চলছে, অনেক Program এর প্রশ্ন
                একসাথে শুনছে, প্রত্যেককে সঠিক উত্তর দিচ্ছে, আর নিয়ম ভাঙে এমন কিছু
                লিখতে দিচ্ছে না। DevOps ট্র্যাকের{" "}
                <Link href="/devops/topic/client-server-isp" className={LINK}>
                  Client Server লেসনে
                </Link>{" "}
                যে Server এর কথা পড়েছিলেন, এটা ঠিক সেই রকম একটা Server, শুধু তার
                কাজ Data সামলানো। এর নাম Database Server, আর এর ভেতরের Program টাকে
                বলে DBMS। পরের লেসন পুরোটা এই নিয়ে। App ঠিক কীভাবে এই Server এর সাথে
                কথা বলে, সেটা এই মডিউলের লেসন ০৬ এ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "when-sheets-fine",
      subHeader: { index: "011", title: "When a Sheet Is Right" },
      title: <SectionTitle>Spreadsheet কখন ঠিক জিনিস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এতক্ষণ Spreadsheet এর দুর্বলতা দেখলেন। এবার ন্যায্য দিকটা। অনেক কাজে
              Spreadsheet এখনো সেরা পছন্দ, আর Database বসানো সেখানে বাড়াবাড়ি। নিচের
              তালিকায় দুটোকে পাশাপাশি রাখা হলো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পরিস্থিতি", "Spreadsheet", "Database"],
          rows: [
            ["একজন মানুষ, ছোট একটা তালিকা", "সেরা, মিনিটে তৈরি", "বাড়াবাড়ি"],
            ["একবারের একটা হিসাব বা বিশ্লেষণ", "সেরা, চোখের সামনে Formula", "দরকার নেই"],
            ["ট্যুরের বাজেট বা পরিকল্পনা", "সেরা", "দরকার নেই"],
            ["কয়েকজন একসাথে লিখবেন", "ঝুঁকি, সংঘর্ষ আর অমিল", "এর জন্যই তৈরি"],
            ["একটা App বা Website Data পড়বে লিখবে", "প্রায় অচল", "এর জন্যই তৈরি"],
            ["টাকা, সিট বা মজুদের হিসাব", "নিঃশব্দ ভুলের ঝুঁকি", "Constraint আর Transaction"],
            ["প্রতিদিন Row বাড়ছে, বছরের পর বছর", "ধীর, শেষে সীমায় আটকায়", "Index দিয়ে দ্রুত"],
            ["কে কী দেখবেন তা নিয়ন্ত্রণ", "পুরো ফাইল বা কিছুই না", "Table আর Row ধরে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা সহজ মাপকাঠি মনে রাখতে পারেন। নিচের পাঁচটা কথার দুটো বা তার বেশি
                সত্যি হলে, সময় হয়েছে Database এ যাওয়ার:
              </ContentParagraph>
              <ContentList>
                <ListItem>একজনের বেশি মানুষ নিয়মিত লেখেন।</ListItem>
                <ListItem>একটা App, Website বা অন্য কোনো Program এই Data ব্যবহার করবে।</ListItem>
                <ListItem>Data তে টাকা, সিট, মজুদ বা অন্য কিছু গোনা হয়, যেখানে ভুল দামি।</ListItem>
                <ListItem>Row প্রতিদিন বাড়ছে, আর কয়েক বছর রাখতে হবে।</ListItem>
                <ListItem>সবাইকে সব কিছু দেখতে দেওয়া যাবে না।</ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "বাস্তবে দুটোই একসাথে চলে",
          content: (
            <p>
              বড় কোম্পানিগুলো Spreadsheet ছেড়ে দেয়নি। আসল Data থাকে Database এ,
              আর সেটাই সব প্রশ্নের চূড়ান্ত উত্তর, যাকে বলে Source of Truth, মানে
              সত্যের উৎস। কারো একটা বিশ্লেষণ করতে হলে Database থেকে একটা Query
              চালিয়ে ফলাফল CSV ফাইলে নামিয়ে নেন, তারপর Spreadsheet এ খুলে নিজের
              মতো কাটাছেঁড়া করেন। Spreadsheet তখন পড়ার আর ভাবার জায়গা, আসল
              খাতা না। এই ট্র্যাক শেষে আপনি ঠিক এই কাজটা করতে পারবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "wish-list",
      subHeader: { index: "012", title: "The Wish List" },
      title: <SectionTitle>আমরা আসলে কী চাই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই লেসনের প্রতিটা ব্যর্থতা উল্টে দিলে একটা চাওয়ার তালিকা দাঁড়ায়। আমরা
              এমন একটা Data রাখার জায়গা চাই, যেটা প্রতিটা জিনিসকে নিশ্চিত চেনে,
              প্রতিটা তথ্য এক জায়গায় রাখে, ভুল মান ঢুকতে দেয় না, একসাথে অনেকে লিখলেও
              গুলিয়ে যায় না, Table গুলোর সম্পর্ক নিজে মনে রাখে, কে কী দেখবে তা
              নিয়ন্ত্রণ করে, কিছু হারালে ফিরিয়ে আনতে পারে, বড় হলেও দ্রুত থাকে, আর
              Program এর সাথে কথা বলতে পারে। নিচের ছবিতে প্রতিটা চাওয়ার পাশে Database
              এর উত্তরের নাম আর সেটা কোথায় শিখবেন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WishListDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই তালিকার প্রতিটা উত্তর যে Software একসাথে দেয়, তার নাম Database
              Management System, ছোট করে DBMS। PostgreSQL, MySQL, SQLite এরা সবাই
              DBMS। তবে একটা কথা মনে রাখুন: DBMS এগুলো করার ক্ষমতা দেয়, নিজে থেকে
              করে না। কোন Column এর মান অনন্য হবে, কোন নিয়ম খাটবে, কে কী দেখবেন,
              এসব আপনাকেই বলে দিতে হয়। কীভাবে বলতে হয়, সেটাই এই পুরো ট্র্যাক।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "see-it",
      subHeader: { index: "013", title: "See It Yourself" },
      title: <SectionTitle>নিজের চোখে দেখুন: Database নিয়ম মানায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার কথা থেকে কাজে। নিচের বক্সগুলোতে একটা আসল PostgreSQL Database
                চলছে, আপনার Browser এর ভেতরেই, Island Tours এর Data সহ। আপনি এখনো
                SQL শেখেননি, আর শেখার দরকারও নেই। শুধু Run চাপুন আর ফলাফলটা দেখুন।
                প্রতিটা লাইনের মানে Module 03 থেকে ধীরে ধীরে শিখবেন।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম বক্সে ট্যুরগুলোর দাম। খেয়াল করুন, প্রতিটা ট্যুরের দাম লেখা আছে
                ঠিক একবার, ট্যুরের নিজের Row তে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা দাম এক জায়গায়"
              query={`SELECT tour_id, title, price_bdt
FROM tours;`}
              caption="ফলাফলে নয়টা ট্যুর, প্রতিটার একটাই দাম। কোনো Booking এর ভেতরে দামের কপি নেই, Booking শুধু বলে রাখে সে কোন তারিখের কোন ট্যুরের।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার ইচ্ছা করে ভুল করুন। নিচের বক্স একটা নতুন Booking লিখতে চায়, যেখানে
              সিটের সংখ্যা -2। Sheet হলে চুপচাপ নিয়ে নিত। Run চেপে দেখুন Database কী
              বলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাইনাস সিট"
              query={`INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (1, 8, -2, 'confirmed', 0);`}
              caption={
                <>
                  ফলাফল একটা লাল ERROR: new row for relation &quot;bookings&quot;
                  violates check constraint &quot;bookings_seats_check&quot;। মানে নতুন
                  Row টা bookings Table এর seats এর নিয়ম ভাঙছে, তাই লেখা হয়নি। -2
                  বদলে 2 করে আবার চালান, এবার INSERT 1 দেখবেন। তারপর -2 এর জায়গায়
                  &apos;five&apos; লিখে দেখুন, আরেক রকম Error আসবে, কারণ seats Column এ
                  শুধু সংখ্যা থাকতে পারে।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পরের বক্সে Rahim Uddin কে আবার নতুন Customer হিসেবে ঢোকানোর চেষ্টা,
              ভুল বানানে, কিন্তু তাঁর আগের Email দিয়ে। ঠিক যেমনটা Sheet এ rahim udin
              এর বেলায় ঘটেছিল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই মানুষ, নতুন বানান"
              query={`INSERT INTO customers (full_name, email, city)
VALUES ('Rahim Udin', 'rahim.uddin@mail.example', 'Dhaka');`}
              caption={
                <>
                  ERROR: duplicate key value violates unique constraint
                  &quot;customers_email_key&quot;। এই Email আগে থেকেই আছে, আর Email
                  এর Column এ নিয়ম বসানো আছে যে দুটো Row এ একই মান থাকতে পারবে না।
                  তাই নতুন বানানের একজন বানানো Customer এর জন্ম হলো না।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষ বক্সে এমন একজন Customer এর নামে Booking, যিনি Database এ নেই।
              customer_id 99 এর কোনো মানুষ নেই, কারণ Customer আছেন মাত্র পনেরোজন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এমন Customer যিনি নেই"
              query={`INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (99, 8, 2, 'confirmed', 25000);`}
              caption={
                <>
                  ERROR: insert or update on table &quot;bookings&quot; violates
                  foreign key constraint &quot;bookings_customer_id_fkey&quot;।
                  Booking এর customer_id কে customers Table এর একজন সত্যিকারের
                  Customer কে দেখাতেই হবে। Sheet এ এমন একটা Row অনায়াসে ঢুকে যেত,
                  আর মাসের পর মাস কেউ টের পেতেন না যে এই Booking কারো না।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              চারটা বক্সের তিনটাতে Database বলেছে না, আর প্রতিবার ভুল Data তৈরি
              হওয়ার আগেই। Sheet এর দশটা ভুলের বেশিরভাগ এভাবেই জন্মের মুহূর্তে আটকে
              যেত। একটা জিনিস খেয়াল করুন, Error গুলো ভয়ের কিছু না। প্রতিটা Error
              আপনাকে ঠিক বলে দেয় কোন Table এর কোন নিয়ম ভাঙা হচ্ছিল। Error পড়ার
              অভ্যাস Module 02 এর একটা পুরো লেসন। কিছু বদলে ফেলে আগের অবস্থায় ফিরতে
              চাইলে যেকোনো বক্সের Reset চাপুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর পুরনো Sheet আজ কোথায়</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরনো Booking Sheet এর প্রতিটা Column আজও আছে, শুধু এক জায়গায় না।
              প্রতিটা তথ্য গেছে সেই জিনিসের Table এ, যে জিনিসের সেটা আসলে। নিচের
              ছবিতে প্রতিটা Column কে তার নতুন ঠিকানা পর্যন্ত অনুসরণ করুন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SheetToTablesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভাগটা এলোমেলো না, প্রতিটার পেছনে একটা প্রশ্ন আছে: এই তথ্যটা কার?
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>নাম আর ফোন মানুষের:</strong> তাই customers এ, প্রতিটা
                  মানুষ একবার। Rahim সাহেব দশবার বুক করলেও তাঁর ফোন নম্বর লেখা
                  থাকবে একবার।
                </ListItem>
                <ListItem>
                  <strong>নাম আর দাম ট্যুরের:</strong> তাই tours এ। দাম বদলানো মানে
                  একটা ঘর বদলানো।
                </ListItem>
                <ListItem>
                  <strong>যাত্রার তারিখ আর খালি সিট একটা নির্দিষ্ট যাত্রার:</strong>{" "}
                  তাই departures এ। একটা ট্যুর বছরে অনেকবার হয়, প্রতিবার তার নিজের
                  তারিখ আর নিজের সিটের হিসাব।
                </ListItem>
                <ListItem>
                  <strong>কয়টা সিট, কত টাকা, কোন অবস্থায়, এগুলো একটা Booking এর:</strong>{" "}
                  তাই bookings এ। মোট টাকা এখানে ইচ্ছা করে রাখা, কারণ এটা বুক করার
                  দিনের ছবি, আগের সেকশনে যেমন দেখেছেন।
                </ListItem>
                <ListItem>
                  <strong>টাকা কীভাবে এল, সেটা একটা Payment এর:</strong> তাই payments
                  এ। একটা Booking এর জন্য একাধিক চেষ্টা হতে পারে, যেমন একটা ব্যর্থ
                  bKash Payment আর তারপর একটা সফল Card Payment।
                </ListItem>
                <ListItem>
                  <strong>রেটিং একটা Review এর:</strong> তাই reviews এ, আর একটা
                  Booking এর সর্বোচ্চ একটা Review।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা বড় Sheet থেকে ছয়টা Table বানানোর এই চিন্তাটাই Database Design।
                এখন শুধু ভাবনাটা দেখলেন। এর নিয়মগুলো লেসন ০৪ এ নাম পাবে, আর পুরো
                Island Tours Database শূন্য থেকে নিজে ডিজাইন করবেন Module 11 এর
                শেষ লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "request-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>শেষ সিটের Booking, এবার Database এর যুগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো লেসনটা একটা গল্পে। ২০ নভেম্বরের Saint Martin যাত্রায় একটা সিট
              বাকি। Rahim Uddin Website থেকে বুক করছেন, আর ঠিক একই সময়ে Farhana
              Akter ও। প্রতিটা ধাপে খেয়াল করুন, লেসনের কোন সমস্যাটা এখানে আর ঘটতে
              পারছে না, আর কেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "খালি সিট দেখা",
              description:
                "Rahim সাহেব Website খুললেন। Website এর পেছনের App Database কে জিজ্ঞেস করল, ২০ নভেম্বরের যাত্রায় কয়টা সিট বাকি। উত্তর এল departures Table এর একটা Row থেকে, যেখানে সংখ্যাটা লেখা আছে একবার। কারো ল্যাপটপের পুরনো কপি থেকে না।",
            },
            {
              title: "পরিচয় নিশ্চিত",
              description:
                "Rahim সাহেব Login করে আছেন, তাই App জানে তিনি customer_id 1। নাম আবার টাইপ করতে হয় না, তাই বানানের ভুলের সুযোগও নেই।",
            },
            {
              title: "Booking শুরু, একসাথে বাঁধা কাজ",
              description:
                "তিনি বুক করুন চাপলেন। App একটা Transaction খুলল: সিট দেখা, Booking লেখা আর সিট কমানো, তিনটা ধাপ এখন একটা অবিভাজ্য কাজ।",
            },
            {
              title: "Row আটকানো",
              description:
                "Database যাত্রার Row টায় Lock বসাল। একই মুহূর্তে Farhana আপার Booking ও এই Row চাইল, Database তাকে অপেক্ষা করতে বলল।",
            },
            {
              title: "নিয়ম যাচাই",
              description:
                "নতুন Booking Row লেখার আগে Database নিজের নিয়মগুলো মিলিয়ে নিল। সিট শূন্যের বেশি তো? status এর মান অনুমোদিত তো? customer_id 1 এর মানুষ আছেন তো? যাত্রাটা সত্যিই আছে তো? সব ঠিক।",
            },
            {
              title: "লেখা আর সিট কমানো",
              description:
                "bookings এ নতুন Row বসল, আর departures এ সিট ১ থেকে ০ হলো। দাম এল tours থেকে, যেখানে সেটা একবারই লেখা।",
            },
            {
              title: "কাজ শেষ, Lock খোলা",
              description:
                "Transaction শেষ হলো, Database সব কিছু Disk এ পাকাপাকি লিখে দিল, আর Row এর Lock উঠে গেল। এখন বিদ্যুৎ চলে গেলেও Booking টা হারাবে না।",
            },
            {
              title: "দ্বিতীয়জন সঠিক উত্তর পেলেন",
              description:
                "এবার Farhana আপার Booking Row টা পড়ল আর দেখল সিট ০। Booking লেখা হলো না। তাঁর পর্দায় সাথে সাথে বার্তা এল এই তারিখে সিট নেই, সাথে পরের তারিখের প্রস্তাব। কেউ জেটিতে গিয়ে ফেরত আসবেন না।",
            },
            {
              title: "পরে হিসাব মেলানো",
              description:
                "মাসের শেষে হিসাবরক্ষককে আর চোখ দিয়ে Payment মেলাতে হয় না। প্রতিটা Payment Row এ লেখা আছে সে কোন booking_id এর, তাই একটা Query তেই পুরো মাসের হিসাব বেরিয়ে আসে।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>ভুল ধারণা, যেগুলো শুরুতে প্রায় সবার থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Database মানে একটা বড় Excel:</strong> দেখতে দুটোই Row আর
                Column, তাই এই ভুলটা স্বাভাবিক। কিন্তু Database এর আসল কাজগুলো
                চোখে দেখা যায় না: নিয়ম পাহারা দেওয়া, একসাথে অনেকের কাজ সামলানো,
                হারানো থেকে বাঁচানো, আর Program এর সাথে কথা বলা।
              </ListItem>
              <ListItem>
                <strong>Google Sheet Share করলেই Database এর কাজ হয়ে যায়:</strong>{" "}
                Share করলে কপির সমস্যা মেটে, কিন্তু শেষ সিটের দৌড়, নিয়মহীন ঘর আর
                সবাইকে সব দেখানোর সমস্যা থেকেই যায়।
              </ListItem>
              <ListItem>
                <strong>এখন Sheet চলুক, পরে Database এ যাব:</strong> যত দেরি, তত
                বেশি অগোছালো Data সরাতে হয়। পরে সরানোর সময় সবচেয়ে কষ্টের কাজ হলো
                একই মানুষের পাঁচ রকম বানান খুঁজে একজন বানানো। যত আগে, তত কম
                পরিষ্কার করতে হয়।
              </ListItem>
              <ListItem>
                <strong>Data Validation দিয়ে দিলেই যথেষ্ট:</strong> Spreadsheet এর
                নিয়ম ঐচ্ছিক, কেউ বসান কেউ বসান না, আর Paste বা Import অনেক সময় তা
                এড়িয়ে যায়। Database এর নিয়ম এড়ানোর উপায় নেই।
              </ListItem>
              <ListItem>
                <strong>প্রতি শুক্রবার একটা CSV নামিয়ে রাখি, এটাই Backup:</strong>{" "}
                বৃহস্পতিবার রাতে কিছু হারালে পুরো সপ্তাহের কাজ গেল। আর সেই CSV থেকে
                সব কিছু আসলে ফিরিয়ে আনা যায় কিনা, সেটা কেউ কখনো পরীক্ষা করেননি।
                সত্যিকারের Backup আর Restore Module 18 এ।
              </ListItem>
              <ListItem>
                <strong>Database নিলে আর কোনো ভুল Data ঢুকবে না:</strong> শুধু সেই
                ভুল আটকাবে যার নিয়ম লেখা আছে। দেখতে ঠিক কিন্তু আসলে ভুল মান, যেমন
                অন্য কারো ফোন নম্বর, কোনো নিয়মই ধরতে পারে না।
              </ListItem>
              <ListItem>
                <strong>Database এ গেলে Spreadsheet পুরোপুরি ছাড়তে হবে:</strong> না।
                Database হবে সত্যের উৎস, আর বিশ্লেষণের জন্য সেখান থেকে Data নামিয়ে
                Spreadsheet এ খোলা খুবই স্বাভাবিক।
              </ListItem>
            </ContentList>
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
                <strong>নিজে করে দেখুন</strong>, এই লেসনের সবচেয়ে ভালো Resource
                নিচের Lab। একটা অগোছালো Sheet এ SUM এর ভুল উত্তর আর Database এর
                ফিরিয়ে দেওয়া Error নিজের হাতে একবার দেখলে পার্থক্যটা আর কখনো ভুলবেন
                না।
              </ListItem>
              <ListItem>
                <strong>আপনি যে MySQL কোর্সটা দেখছেন</strong>, এর শুরুর অংশে
                Database আর DBMS কী, সেটা বলা আছে। ভিডিওটা MySQL দিয়ে, আর এই ট্র্যাক
                PostgreSQL দিয়ে, কিন্তু এই লেসনের ধারণাগুলো দুটোতেই হুবহু এক।{" "}
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  youtube.com/watch?v=hlGoQC332VM
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL Tutorial, Concepts</strong>, PostgreSQL এর
                অফিসিয়াল Docs এর ছোট্ট একটা পাতা, যেখানে Table, Row আর Column এর
                মৌলিক ধারণা আছে। পরের লেসনগুলোর ভূমিকা হিসেবে পড়ে রাখতে পারেন।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/tutorial-concepts.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/tutorial-concepts.html
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL Docs, Constraints</strong>, NOT NULL, UNIQUE,
                CHECK আর Foreign Key, আজ যে নিয়মগুলোর কথা শুনলেন তাদের পুরো তালিকা।
                এখনই সব বোঝার দরকার নেই, শুধু দেখে রাখুন কত রকম নিয়ম বসানো যায়।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/ddl-constraints.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/ddl-constraints.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Excel specifications and limits</strong>, Microsoft এর
                নিজের পাতা, যেখানে একটা Worksheet এর Row আর Column এর সীমা লেখা।{" "}
                <a
                  href="https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  support.microsoft.com, Excel specifications and limits
                </a>
              </ListItem>
              <ListItem>
                <strong>Wikipedia, Database</strong>, Database এর ইতিহাস আর নানা
                ধরনের একটা ভালো সারাংশ। লেসন ০২ আর ০৩ এর আগে একবার চোখ বুলিয়ে নিতে
                পারেন।{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Database"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  en.wikipedia.org/wiki/Database
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
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  Spreadsheet একটা ঘর কাটা খাতা: Row, Column আর Cell। ছোট, এক
                  মানুষের কাজে এটা দারুণ।
                </ListItem>
                <ListItem>
                  ব্যবসা বড় হলে চারটা জিনিস বদলায়: লেখার মানুষ, Row এর সংখ্যা, Sheet
                  এর সংখ্যা, আর Data চাওয়া Program। প্রতিটা Sheet এর একটা আলাদা
                  দুর্বলতায় আঘাত করে।
                </ListItem>
                <ListItem>
                  Sheet মানুষকে চেনে নামের লেখা দিয়ে। Database দেয় এমন একটা পরিচয়
                  যেটা কখনো বদলায় না, Primary Key, আর বলে রাখতে পারে কোন মান অনন্য
                  হবে, UNIQUE।
                </ListItem>
                <ListItem>
                  একই তথ্যের অনেক কপি, Redundancy, একদিন অমিলে গড়ায়, Update
                  Anomaly। নিয়ম হলো একটা তথ্য, একটা জায়গা। তবে অতীতের একটা ঘটনার ছবি,
                  যেমন বুক করার দিনের টাকা, ইচ্ছা করে আলাদা রাখা হয়।
                </ListItem>
                <ListItem>
                  Sheet এর ঘর যা খুশি নেয়। Database এ Data Type, NOT NULL, CHECK আর
                  UNIQUE এর মতো Constraint ভুল মান জন্মের আগেই আটকায়।
                </ListItem>
                <ListItem>
                  দুইজন একসাথে দেখলে আর লিখলে Race Condition হয়, আর শেষ সিট
                  দুইজনের কাছে যায়। Database এর উত্তর Transaction আর Lock।
                </ListItem>
                <ListItem>
                  Sheet গুলোর সম্পর্ক থাকে মানুষের মাথায়। Database এ সম্পর্ক লেখা
                  থাকে Foreign Key তে, আর জোড়া দেওয়া হয় JOIN দিয়ে।
                </ListItem>
                <ListItem>
                  কে কী দেখবেন, কে কী বদলালেন, কিছু হারালে ফেরত, আর লাখ Row এও
                  গতি, প্রতিটার জন্য Database এর আলাদা ব্যবস্থা আছে: Permission,
                  Audit Log, Backup আর Index।
                </ListItem>
                <ListItem>
                  Spreadsheet বাদ যায় না। Database হয় সত্যের উৎস, Spreadsheet হয়
                  বিশ্লেষণের জায়গা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে বারবার একটা নাম এসেছে, যেটা এখনো ঠিকমতো পরিচয় পায়নি:
                Database, আর তার পেছনের Program, DBMS। Database আর DBMS কি একই জিনিস?
                Database Server কোথায় চলে, আর একটা Server এর ভেতরে কয়টা Database
                থাকতে পারে? আজকের চাওয়ার তালিকার প্রতিটা কাজ DBMS এর ভেতরে কোন অংশ
                করে? পরের লেসন, What a Database and a DBMS Are, ঠিক এই প্রশ্নগুলোর
                উত্তর দিয়ে শুরু হবে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["সমস্যা", "Sheet এ যা ঘটে", "Database এর উত্তর", "কোথায় শিখবেন"],
    rows: [
      ["একই মানুষ নানা বানানে", "একজন Customer কয়েকজন হয়ে যান", "Primary Key, UNIQUE", "লেসন ০৪, Module 09"],
      ["একই তথ্যের অনেক কপি", "কিছু কপি বদলায়, কিছু পুরনো থাকে", "এক তথ্য এক জায়গায়, Normalization", "Module 11"],
      ["নিয়মহীন ঘর", "five, -1, ফাঁকা ঘর চুপচাপ ঢোকে", "Data Type, NOT NULL, CHECK", "Module 09"],
      ["দুইজন একসাথে", "শেষ সিট দুইবার বিক্রি", "Transaction, Lock", "Module 12"],
      ["Sheet এর মধ্যে সম্পর্ক", "চোখ দিয়ে মেলানো, ভঙ্গুর Formula", "Foreign Key, JOIN", "লেসন ০৪, Module 06"],
      ["সবাই সব দেখে", "পুরো ফাইল Share করতে হয়", "Role, Permission", "Module 16"],
      ["কে কী বদলাল", "উত্তর খুঁজে পাওয়া কঠিন", "Audit Log", "Module 16"],
      ["হারানো আর নষ্ট হওয়া", "একমাত্র কপি গেলে সব গেল", "Backup, Restore", "Module 18"],
      ["বড় হলে ধীর", "প্রতিটা খোঁজ পুরো ফাইল জুড়ে", "Index", "Module 13"],
      ["App এর Data দরকার", "ফাইল একসাথে অনেকের জন্য না", "Database Server, DBMS", "লেসন ০২, লেসন ০৬"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Sheet এ একই Customer কে কেউ Rahim Uddin আর কেউ rahim udin লিখেছেন। এর মূল সমস্যাটা কী?",
        options: [
          {
            key: "A",
            text: "কর্মীরা টাইপ করতে অসাবধান, তাঁদের প্রশিক্ষণ দিলেই মিটে যাবে",
            isCorrect: false,
            explanation:
              "প্রশিক্ষণ ভুল কমায়, কিন্তু যতদিন পরিচয় নামের লেখার উপর নির্ভর করে, ততদিন কোনো একদিন আবার ঘটবে।",
          },
          {
            key: "B",
            text: "Sheet এ মানুষের এমন কোনো পরিচয় নেই যেটা কখনো বদলায় না আর অন্য কারো হতে পারে না",
            isCorrect: true,
            explanation:
              "ঠিক। Sheet মানুষকে চেনে লেখা দিয়ে, আর লেখা বদলায়। Database প্রতিটা Customer কে একটা স্থায়ী নম্বর দেয়, Primary Key, আর সব Booking সেই নম্বর দিয়ে Customer কে চেনে।",
          },
          {
            key: "C",
            text: "Spreadsheet ছোট হাতের অক্ষর বোঝে না",
            isCorrect: false,
            explanation:
              "Spreadsheet ছোট হাতের অক্ষর ঠিকই দেখায়। সমস্যা হলো দুটো আলাদা লেখাকে সে দুটো আলাদা মান হিসেবেই দেখে।",
          },
          {
            key: "D",
            text: "নামের Column টা খুব ছোট",
            isCorrect: false,
            explanation: "Column এর মাপের সাথে এর কোনো সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 2,
        text: "Saint Martin এর দাম চল্লিশটা Row এ লেখা ছিল। দাম বদলানোর সময় পঁয়ত্রিশটা Row বদলানো হলো, পাঁচটা বাদ পড়ল। এই অবস্থার নাম কী?",
        options: [
          {
            key: "A",
            text: "Race Condition",
            isCorrect: false,
            explanation: "Race Condition হয় দুইজন একসাথে কাজ করলে। এখানে একজনই কাজ করেছেন, শুধু কাজটা অর্ধেক থেকে গেছে।",
          },
          {
            key: "B",
            text: "Foreign Key Violation",
            isCorrect: false,
            explanation: "Foreign Key এর সাথে এর সম্পর্ক নেই। এখানে সমস্যা একই তথ্যের কপি নিয়ে।",
          },
          {
            key: "C",
            text: "Redundancy থেকে জন্মানো Update Anomaly",
            isCorrect: true,
            explanation:
              "ঠিক। একই তথ্যের অনেক কপি রাখা হলো Redundancy, আর কপিগুলোর কিছু বদলে কিছু পুরনো থেকে যাওয়া হলো Update Anomaly। সমাধান দামটা এক জায়গায় রাখা।",
          },
          {
            key: "D",
            text: "Data Type এর ভুল",
            isCorrect: false,
            explanation: "12500 আর 13000 দুটোই সঠিক ধরনের সংখ্যা। সমস্যা মানের ধরনে না, একই তথ্যের দুই রকম মানে।",
          },
        ],
      },
      {
        id: 3,
        text: "Island Tours এ ট্যুরের দাম বাড়ানো হলো, কিন্তু bookings Table এর total_bdt এ পুরনো Booking এর টাকা বদলাল না। এটা কি একটা Bug?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, সব কপি বাদ দিয়ে Booking এ ট্যুরের বর্তমান দাম দেখানো উচিত",
            isCorrect: false,
            explanation: "তাহলে দাম বাড়লে পুরনো Customer দের আগে দেওয়া টাকার হিসাবও বদলে যেত, যেটা মিথ্যা।",
          },
          {
            key: "B",
            text: "না, total_bdt হলো বুক করার দিনে নেওয়া টাকার ছবি, অতীতের একটা ঘটনা যেটা আর বদলানোর কথা না",
            isCorrect: true,
            explanation:
              "ঠিক। ট্যুরের বর্তমান দাম এক জায়গায় থাকে, tours এ। কিন্তু একটা Booking এ কত টাকা নেওয়া হয়েছিল, সেটা ইচ্ছা করে আলাদা রাখা হয়। কোন কপি ইচ্ছাকৃত আর কোনটা দুর্ঘটনা, সেটা চেনা Design এর দক্ষতা।",
          },
          {
            key: "C",
            text: "হ্যাঁ, Database এ কখনো কোনো তথ্য দুই জায়গায় থাকা উচিত না",
            isCorrect: false,
            explanation: "নিয়মটা হলো একটা তথ্য এক জায়গায়। বুক করার দিনের টাকা আর আজকের দাম দুটো আলাদা তথ্য।",
          },
          {
            key: "D",
            text: "বোঝা যায় না, কারণ Database নিজে থেকে দাম বদলাতে পারে না",
            isCorrect: false,
            explanation: "প্রশ্নটা ক্ষমতার না, ঠিক কোনটা হওয়া উচিত তার। এখানে না বদলানোটাই সঠিক আচরণ।",
          },
        ],
      },
      {
        id: 4,
        text: "দুইজন কর্মী একই Google Sheet এ একসাথে দেখলেন একটা সিট বাকি, আর দুজনেই Booking লিখলেন। ভবিষ্যতে এটা আটকানোর সঠিক উপায় কোনটা?",
        options: [
          {
            key: "A",
            text: "সবাইকে লেখার আগে একবার Page Refresh করতে বলা",
            isCorrect: false,
            explanation:
              "Refresh এর পরেও দেখা আর লেখার মাঝে একটা ফাঁক থাকে, আর সেই ফাঁকে অন্যজন লিখে ফেলতে পারেন। দৌড়টা ছোট হয়, শেষ হয় না।",
          },
          {
            key: "B",
            text: "দেখা আর লেখাকে একটা অবিভাজ্য কাজ বানানো, যেখানে কাজ চলার সময় আর কেউ ওই Row বদলাতে পারবে না",
            isCorrect: true,
            explanation:
              "ঠিক। এটাই Transaction আর Lock এর কাজ। Database লেখার মুহূর্তে সিট আবার দেখে, আর ওই মুহূর্তে অন্যকে অপেক্ষা করায়। Module 12 এ বিস্তারিত।",
          },
          {
            key: "C",
            text: "দুজনকে আলাদা আলাদা Sheet দেওয়া",
            isCorrect: false,
            explanation: "তাহলে কেউই অন্যজনের Booking দেখতে পেতেন না, আর একই সিট আরও সহজে দুইবার বিক্রি হতো।",
          },
          {
            key: "D",
            text: "একটা Formula দিয়ে সিটের সংখ্যা নিজে থেকে হিসাব করানো",
            isCorrect: false,
            explanation: "Formula সংখ্যাটা ঠিক রাখে, কিন্তু দুইজনের একই সময়ের সিদ্ধান্ত আটকাতে পারে না।",
          },
        ],
      },
      {
        id: 5,
        text: "নিচের কোন কাজে Spreadsheet ই সবচেয়ে ভালো পছন্দ?",
        options: [
          {
            key: "A",
            text: "একটা Website এর Booking, যেখানে একসাথে অনেকে বুক করেন",
            isCorrect: false,
            explanation: "একসাথে অনেক মানুষ আর একটা Program, এটা ঠিক Database এর কাজ।",
          },
          {
            key: "B",
            text: "Database থেকে নামানো গত মাসের Booking এর CSV নিয়ে একজন বিশ্লেষক একবারের একটা হিসাব করবেন",
            isCorrect: true,
            explanation:
              "ঠিক। একজন মানুষ, একবারের কাজ, আসল Data নিরাপদে Database এ। Spreadsheet এখানে ভাবার আর হিসাব করার চমৎকার জায়গা।",
          },
          {
            key: "C",
            text: "কয়েক বছরের সব Payment এর মূল হিসাব, যেটা হিসাবরক্ষক আর Auditor দুজনেই দেখবেন",
            isCorrect: false,
            explanation: "টাকার মূল খাতা, বছরের পর বছর, একাধিক মানুষ, এর প্রতিটা Database এর দিকে ইঙ্গিত করে।",
          },
          {
            key: "D",
            text: "তিনজন কর্মী যে সিটের হিসাব রোজ বদলান",
            isCorrect: false,
            explanation: "কয়েকজন লেখেন আর গোনার ভুল দামি, দুটোই Database এ যাওয়ার সংকেত।",
          },
        ],
      },
      {
        id: 6,
        text: "bookings Table এ seats এর জায়গায় 'five' লিখে INSERT চালালে PostgreSQL Error দিল। কোন জিনিসটা এটা আটকাল?",
        options: [
          {
            key: "A",
            text: "UNIQUE Constraint",
            isCorrect: false,
            explanation: "UNIQUE আটকায় একই মান দুই Row এ থাকা। এখানে প্রশ্নটা মানের ধরন নিয়ে।",
          },
          {
            key: "B",
            text: "Foreign Key",
            isCorrect: false,
            explanation: "Foreign Key দেখে অন্য Table এর Row আছে কিনা। seats অন্য কোনো Table কে দেখায় না।",
          },
          {
            key: "C",
            text: "Column এর Data Type, কারণ seats এ শুধু পূর্ণসংখ্যা থাকতে পারে",
            isCorrect: true,
            explanation:
              "ঠিক। seats Column এর Type smallint, তাই PostgreSQL বলে invalid input syntax for type smallint। লেখা সেখানে ঢুকতেই পারে না।",
          },
          {
            key: "D",
            text: "Primary Key",
            isCorrect: false,
            explanation: "Primary Key হলো booking_id, Row এর পরিচয়। seats এর মানের সাথে তার সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "customer_id 99 দিয়ে একটা Booking লেখার চেষ্টা Error দিল, কারণ এমন কোনো Customer নেই। এই নিয়মের নাম কী?",
        options: [
          {
            key: "A",
            text: "Foreign Key, যেটা নিশ্চিত করে যে Booking এর customer_id সত্যিকারের একজন Customer কে দেখায়",
            isCorrect: true,
            explanation:
              "ঠিক। Error এ নামটাই লেখা: bookings_customer_id_fkey। fkey মানে Foreign Key। Sheet এ এমন একটা মালিকহীন Booking অনায়াসে ঢুকে যেত।",
          },
          {
            key: "B",
            text: "CHECK, যেটা দেখে সংখ্যাটা ১ থেকে ১৫ এর মধ্যে কিনা",
            isCorrect: false,
            explanation:
              "এমন কোনো CHECK নেই। নতুন Customer যোগ হলে ১৬ ও বৈধ হবে। নিয়মটা অন্য Table এ সত্যিকারের Row থাকা নিয়ে।",
          },
          {
            key: "C",
            text: "NOT NULL",
            isCorrect: false,
            explanation: "মানটা ফাঁকা না, 99 লেখা আছে। সমস্যা হলো 99 নম্বরের কেউ নেই।",
          },
          {
            key: "D",
            text: "Data Type",
            isCorrect: false,
            explanation: "99 একটা সঠিক পূর্ণসংখ্যা, ধরনে কোনো ভুল নেই।",
          },
        ],
      },
      {
        id: 8,
        text: "একজন মালিক বললেন, প্রতি শুক্রবার পুরো Sheet এর একটা CSV নামিয়ে রাখি, তাই আমার Backup আছে। এর সবচেয়ে বড় দুর্বলতা কী?",
        options: [
          {
            key: "A",
            text: "CSV ফাইল খুলতে বিশেষ Software লাগে",
            isCorrect: false,
            explanation: "CSV প্রায় যেকোনো Program এ খোলে। দুর্বলতা অন্য জায়গায়।",
          },
          {
            key: "B",
            text: "কোনো দুর্বলতা নেই, সাপ্তাহিক কপিই যথেষ্ট",
            isCorrect: false,
            explanation: "বৃহস্পতিবার রাতে সব হারালে পুরো সপ্তাহের Booking আর Payment গেল। একটা Booking ব্যবসার জন্য এটা অনেক বড় ক্ষতি।",
          },
          {
            key: "C",
            text: "CSV এ সংখ্যা রাখা যায় না",
            isCorrect: false,
            explanation: "CSV এ সংখ্যা, লেখা, তারিখ সবই রাখা যায়।",
          },
          {
            key: "D",
            text: "শেষ কপির পরের সব কাজ হারানোর ঝুঁকি, আর সেই কপি থেকে সত্যিই সব ফিরিয়ে আনা যায় কিনা তা কখনো পরীক্ষা না হওয়া",
            isCorrect: true,
            explanation:
              "ঠিক। কতটা Data হারানো চলে আর ফিরিয়ে আনাটা সত্যিই কাজ করে কিনা, Backup এর এই দুটো প্রশ্নই আসল। Database এর Backup, যেকোনো মুহূর্তে ফিরে যাওয়া আর Restore এর মহড়া Module 18 এ।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Sheet আর Database পাশাপাশি",
    subtitle: "একটা Spreadsheet আর এই পাতার Query বক্সে ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "অগোছালো Sheet টা নিজে বানান",
        description:
          "প্রথম Code বক্সের লেখাগুলো কপি করে একটা নতুন Google Sheet বা Excel ফাইলের A1 ঘরে Paste করুন। Google Sheet এ Paste করার পর Data মেনু থেকে Split text to columns বেছে নিলে কমা ধরে Column আলাদা হয়ে যাবে। Excel এ ফাইলটা .csv নামে Save করে খুললেও একই কাজ হয়। এটা লেসনের সেই Sheet, দশটা ভুল সহ। Paste এর পর খেয়াল করুন, কিছু ফোন নম্বরের শুরুর + বা 0 হারিয়ে যেতে পারে, কারণ Spreadsheet সেগুলোকে সংখ্যা ভেবে নিজে থেকে বদলে দেয়। এটাও একটা নিঃশব্দ বদল, যেটা Database এ text Column এ কখনো ঘটে না।",
      },
      {
        title: "Sheet কে প্রশ্ন করুন",
        description:
          "দ্বিতীয় Code বক্সের Formula গুলো যেকোনো ফাঁকা ঘরে লিখুন। সিটের যোগফল আসবে 12, অথচ five সহ হওয়ার কথা ছিল 17, আর -1 তো এমনিতেই ভুল। আলাদা নামের তালিকায় Rahim Uddin আর rahim udin দুজন আলাদা মানুষ হয়ে বসে থাকবেন। কোনো Error আসবে না, এটাই আসল শিক্ষা।",
      },
      {
        title: "Database কে একই ভুল খাওয়ানোর চেষ্টা",
        description:
          "এই লেসনের যেকোনো Query বক্সে তৃতীয় Code বক্সের Statement গুলো একটা একটা করে চালান। প্রতিবার শুধু একটা Statement রাখুন, কারণ প্রথম Error এ বক্স থেমে যায়। প্রতিটা Error এর শেষে উদ্ধৃতি চিহ্নের ভেতরের নামটা লিখে রাখুন: কোন নিয়ম ভাঙা হলো।",
      },
      {
        title: "একটা দাম, একটা জায়গা",
        description:
          "চতুর্থ Code বক্সটা চালান। একটা UPDATE দিয়ে Saint Martin Island Escape এর দাম 13000 হবে, আর পরের SELECT এ নতুন দাম দেখবেন। Sheet এ এই একই কাজে প্রতিটা Booking Row এ হাত দিতে হতো। কাজ শেষে Reset চেপে Database আগের অবস্থায় ফিরিয়ে নিন।",
      },
      {
        title: "একটা Booking এর পুরো ছবি",
        description:
          "পঞ্চম Code বক্সটা চালান। এখনো এর ভাষা বোঝার দরকার নেই, এটা চারটা Table জোড়া দিয়ে Booking নম্বর ১ এর পুরো ছবি আনে: Rahim Uddin, Saint Martin Island Escape, যাত্রা 2026-01-15, দুটো সিট, 25000.00 টাকা। Sheet এ এই সব তথ্য এক Row এ কপি হয়ে বসে থাকত। এখানে প্রতিটা আছে নিজের Table এ, আর দরকারের মুহূর্তে জোড়া লাগে।",
      },
      {
        title: "নিজের ভাষায় লিখে রাখুন",
        description:
          "একটা কাগজে দুটো Column করুন, Sheet আর Database। Lab এ যে যে ভুল Sheet চুপচাপ নিয়েছে আর Database ফিরিয়ে দিয়েছে, প্রতিটা এক লাইনে লিখুন। এই তালিকাটা নিচের Assignment এর প্রথম ধাপে কাজে লাগবে।",
      },
    ],
    codeBlocks: [
      {
        language: "csv",
        filename: "bookings_sheet.csv",
        code: `Booked on,Customer,Phone,Tour,Tour date,Seats,Price,Total,Paid
2025-12-20,Rahim Uddin,+8801000000101,Saint Martin Escape,15 Jan,2,12500,25000,bKash
2025-12-28,Nusrat Jahan,01000000102,Saint Martin Escape,15/01/2026,4,12500,50000,Card
2026-01-05,Farhana Akter,+8801000000104,Cox's Bazar Weekend,23 Jan,3,8500,25500,bKash
2026-01-10,rahim udin,+8801000000101,Saint Martin Escape,12 Feb,1,12500,12500,Nagad
2026-01-25,Mitu Rahman,,Sundarbans Cruise,5 Feb,five,18000,36000,Card
2026-01-28,Arif Chowdhury,+8801000000107,Sundarbans Cruise,5 Feb,1,17500,17500,?
2026-02-20,Rahim Uddin,+8801000000101,Sajek Cloud Trip,6 Mar,2,9500,18000,bKash
2026-03-01,Sumaiya Islam,+8801000000108,Bandarban Trek,19 Mar,-1,14000,-14000,Card`,
      },
      {
        language: "text",
        filename: "spreadsheet formulas",
        code: `=SUM(F2:F9)
  সিটের যোগফল। five লেখাটা বাদ পড়ে, ফল আসে 12।

=COUNTA(F2:F9)
  সিটের ঘরে কয়টা মান আছে: 8। অর্থাৎ ঘর আছে আটটা, কিন্তু যোগ হয়েছে সাতটা।

=UNIQUE(B2:B9)
  আলাদা আলাদা Customer এর নাম। Rahim Uddin আর rahim udin দুজন হয়ে আসবেন।
  (Excel এর পুরনো সংস্করণে UNIQUE না থাকলে Data মেনুর Remove Duplicates দিয়ে দেখুন।)`,
      },
      {
        language: "sql",
        filename: "break-the-rules.sql",
        code: `-- একটা একটা করে চালান। প্রতিটা আলাদা নিয়ম ভাঙে।

-- ১. সিটের সংখ্যা কথায়
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (1, 8, 'five', 'confirmed', 25000);
-- ERROR: invalid input syntax for type smallint: "five"

-- ২. মাইনাস সিট
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (1, 8, -2, 'confirmed', 0);
-- ERROR: ... violates check constraint "bookings_seats_check"

-- ৩. এমন status যেটা অনুমোদিত না
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (1, 8, 2, 'paid', 25000);
-- ERROR: ... violates check constraint "bookings_status_check"

-- ৪. একই Email দিয়ে নতুন Customer
INSERT INTO customers (full_name, email, city)
VALUES ('Rahim Udin', 'rahim.uddin@mail.example', 'Dhaka');
-- ERROR: duplicate key value violates unique constraint "customers_email_key"

-- ৫. এমন Customer যিনি নেই
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (99, 8, 2, 'confirmed', 25000);
-- ERROR: ... violates foreign key constraint "bookings_customer_id_fkey"`,
      },
      {
        language: "sql",
        filename: "one-price-one-place.sql",
        code: `UPDATE tours
SET price_bdt = 13000
WHERE tour_id = 1;

SELECT tour_id, title, price_bdt
FROM tours
WHERE tour_id = 1;

-- UPDATE 1
--  tour_id | title                      | price_bdt
-- ---------+----------------------------+-----------
--  1       | Saint Martin Island Escape | 13000.00`,
      },
      {
        language: "sql",
        filename: "one-booking-whole-picture.sql",
        code: `SELECT b.booking_id, c.full_name, t.title, d.starts_on, b.seats, b.total_bdt
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t ON t.tour_id = d.tour_id
WHERE b.booking_id = 1;

--  booking_id | full_name   | title                      | starts_on  | seats | total_bdt
-- ------------+-------------+----------------------------+------------+-------+-----------
--  1          | Rahim Uddin | Saint Martin Island Escape | 2026-01-15 | 2     | 25000.00`,
      },
    ],
    tip: "তৃতীয় ধাপটা তাড়াহুড়া না করে করুন, আর প্রতিটা Error পুরোটা পড়ুন। প্রতিটা Error এ উদ্ধৃতি চিহ্নের ভেতরে নিয়মের একটা নাম আছে, যেমন bookings_seats_check বা customers_email_key। নামটা পড়েই বোঝা যায় কোন Table এর কোন Column এর কোন নিয়ম। Production এ একটা App যখন হঠাৎ কোনো Booking লিখতে পারে না, Developer রা ঠিক এই নামটা দেখেই প্রথম সূত্র পান। আর মনে রাখবেন, Sheet এ একই পাঁচটা ভুল পাঁচবার চুপচাপ ঢুকে যেত।",
  },
  assignment: {
    title: "Mini Project: একটা সত্যিকারের Sheet এর ময়নাতদন্ত",
    time: "৬০-৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>একটা আসল Sheet খুঁজুন:</strong> আপনার পরিচিত কোনো দোকান, কোচিং
        সেন্টার, ক্লাব বা অফিস যে Spreadsheet এ হিসাব রাখে, তার একটা কপি নিন।
        না পেলে Lab এর bookings_sheet.csv ব্যবহার করুন। কারো ব্যক্তিগত তথ্য থাকলে
        নাম আর নম্বর বদলে নিন।
      </span>,
      <span key="2">
        <strong>ভুলগুলোকে পরিবারে ভাগ করুন:</strong> Sheet এ যত সমস্যা পাবেন,
        প্রতিটাকে লেসনের তিন পরিবারের একটায় বসান: একই জিনিস নানাভাবে লেখা, ভুল মান
        ঢুকে পড়া, কপি করা তথ্যের অমিল। প্রতিটা ভুলের পাশে লিখুন সেটা কোন হিসাবকে
        ভুল করবে।
      </span>,
      <span key="3">
        <strong>কপি খুঁজুন:</strong> Sheet এ কোন কোন তথ্য বারবার লেখা হচ্ছে তার
        তালিকা করুন। প্রতিটার জন্য ঠিক করুন সেটা কোন জিনিসের তথ্য, যেমন মানুষের,
        পণ্যের, না লেনদেনের। কোন কপিগুলো অতীতের ছবি হিসেবে ইচ্ছা করে রাখা উচিত, সেটাও
        আলাদা করে চিহ্নিত করুন।
      </span>,
      <span key="4">
        <strong>Sheet থেকে Table এর খসড়া:</strong> লেসনের Sheet থেকে Table এর ছবির
        মতো করে আপনার Sheet এর প্রতিটা Column কে একটা Table এ পাঠান। Table গুলোর নাম
        দিন আর প্রতিটা Table এ কোন কোন Column থাকবে লিখুন। নিখুঁত হওয়ার দরকার নেই,
        Module 11 এ এটাই আবার ঠিকঠাক করবেন।
      </span>,
      <span key="5">
        <strong>মালিককে একটা চিঠি (১০ লাইন):</strong> Sheet এর মালিককে নিজের ভাষায়
        বোঝান তাঁর Sheet কখন পর্যন্ত চলবে আর কোন দিন থেকে তাঁর Database দরকার।
        লেসনের পাঁচটা মাপকাঠির কোনগুলো তাঁর ক্ষেত্রে সত্যি, সেটা উল্লেখ করুন। আর
        কোন কাজে তিনি Spreadsheet রেখে দিতে পারেন, সেটাও বলুন।
      </span>,
    ],
    deliverables: [
      <span key="1">যে Sheet টা নিয়ে কাজ করলেন তার একটা ছোট বর্ণনা, বা Lab এর CSV ব্যবহার করলে সেটার উল্লেখ</span>,
      <span key="2">তিন পরিবারে ভাগ করা ভুলের তালিকা, প্রতিটার পাশে কোন হিসাব ভাঙবে</span>,
      <span key="3">বারবার লেখা তথ্যের তালিকা, ইচ্ছাকৃত কপিগুলো আলাদা করে চিহ্নিত</span>,
      <span key="4">Table এর খসড়া: Table এর নাম আর প্রতিটার Column</span>,
      <span key="5">মালিকের জন্য ১০ লাইনের চিঠি</span>,
    ],
  },
};
