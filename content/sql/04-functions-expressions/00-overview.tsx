import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  BeforeAfterSplit,
  ModuleBridgeDiagram,
  ModuleRoadmap,
} from "../../../components/course/topics/overview/module-overview";
import { RealLifeLab } from "../../../components/course/topics/overview/overview-animations";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const functionsExpressionsOverviewContent: TopicData = {
  id: "functions-expressions-overview",
  introduction: {
    badge: "MODULE 04 · OVERVIEW",
    title: <SectionTitle>ঠিক উত্তরকে কাজের উত্তরে বদলানো</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 03 শেষে আপনি Database কে প্রশ্ন করতে পারেন। কোন Table থেকে, কোন
          Row, কোন Column, কোন ক্রমে, কতগুলো, সবই আপনি নিজের হাতে লিখতে পারেন।
          ফারুক সাহেবের সোমবার সকালের পাঁচটা প্রশ্নের প্রতিটা এখন আপনার কাছে এক
          একটা SELECT।
        </ContentParagraph>
        <ContentParagraph>
          কিন্তু একটা ব্যাপার এতদিন খেয়াল করেননি হয়তো। আপনার প্রতিটা উত্তর Table
          এ যেভাবে মান রাখা আছে, ঠিক সেভাবেই ফেরত এসেছে। দাম এসেছে 12500.00, সময়
          এসেছে 2025-12-20 10:15:00+06, ফোন নম্বর না থাকলে এসেছে একটা ফাঁকা ঘর।
          উত্তর ঠিক, কিন্তু কাঁচা। মানুষের হাতে দেওয়ার মতো নয়, আর অনেক সময় হিসাবের
          জন্যও যথেষ্ট নয়। এই মডিউল সেই কাঁচা মানগুলোকে আকার দিতে শেখায়: লেখা
          পরিষ্কার করা, টাকার হিসাব নির্ভুল করা, তারিখ আর সময় ঠিক Time Zone এ দেখানো,
          এক ধরনের মানকে আরেক ধরনে বদলানো, ফাঁকা জায়গায় বিকল্প বসানো, আর নকশা
          মিলিয়ে লেখা খোঁজা।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা লেসন নয়, মডিউলের মানচিত্র। এখানে জানবেন মডিউলটা কেন দরকার,
          ছয়টা লেসনে কী কী শিখবেন, না শিখলে কোথায় কোথায় চুপচাপ ভুল হয়, কাজের
          জায়গায় এগুলো কোথায় লাগে, আর বাস্তবে আপনি ধাপে ধাপে কী কী করবেন। Function
          গুলো এখানে শেখানো হবে না, শুধু দেখানো হবে কোনটা কোন লেসনে আছে আর কেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "থান কাপড় যতই ভালো হোক, গায়ে দেওয়া যায় না। দর্জি মাপ নেন, কাটেন, জোড়া দেন, তবেই সেটা পোশাক হয়। Database এর মানগুলোও থান কাপড়, আর Function হলো দর্জির কাঁচি, ফিতা আর সুঁই।",
      author: "Functions & Expressions",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>উত্তর ঠিক, কিন্তু কাজে লাগছে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আবার একটা সোমবার। ফারুক সাহেব আগের সপ্তাহের Query গুলো দেখে খুশি,
                উত্তরগুলো ঠিক ছিল। এবার তিনি এসেছেন অন্য রকম একটা অনুরোধ নিয়ে।
                কোম্পানির মালিকের জন্য একটা মাসিক Report বানাতে হবে, যেটা সরাসরি
                একটা Email এ যাবে। তাঁর তালিকায় ছয়টা চাওয়া।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  Customer দের তালিকায় শহরের নাম যেন সব এক রকম দেখায়, আর Email এর
                  শুধু শেষ অংশটা, মানে কোন Domain থেকে আসছেন, আলাদা একটা Column এ।
                </ListItem>
                <ListItem>
                  প্রতিটা Booking এর পাশে একজনের ভাগে কত টাকা পড়ল, দুই দশমিক পর্যন্ত।
                  আর একটা Booking এ গড়ে কতগুলো সিট।
                </ListItem>
                <ListItem>
                  Booking এর তারিখ লেখা থাকবে মানুষের মতো করে, যেমন 01 Oct 2026, আর
                  সেটা যেন ঢাকার তারিখ হয়, অন্য কোনো দেশের নয়।
                </ListItem>
                <ListItem>
                  প্রতিটা আসন্ন ট্যুর ছাড়তে আর কত দিন বাকি।
                </ListItem>
                <ListItem>
                  ফোন নম্বর না থাকলে ফাঁকা ঘর নয়, লেখা থাকবে No phone।
                </ListItem>
                <ListItem>
                  আর যাঁদের ফোন নম্বর বাংলাদেশের নিয়মে লেখা নয়, তাঁদের আলাদা করে
                  চিহ্নিত করা, যাতে কেউ ফোন করে ঠিক করে নিতে পারেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শুধু SELECT জানলে এই Report টা কেমন যায়, ভাবুন। আপনি Data বের করে
                Excel এ নেন, তারপর সেখানে একটা একটা করে Formula লেখেন। গড় সিটের হিসাব
                SQL এ নিজে করতে গিয়ে আপনি মোট সিটকে Booking এর সংখ্যা দিয়ে ভাগ
                করেন, আর উত্তর আসে 2। Report এ সেটাই যায়। অথচ আসল গড় 2.21, আর
                ভুলটা কোনো Error দেখায়নি, কারণ দুইটা পূর্ণ সংখ্যার ভাগে PostgreSQL
                দশমিকের অংশ ফেলে দেয়। তারিখের Column টা আরেকজন Server থেকে বের করেন,
                যেটা UTC সময়ে চলে, আর রাত বারোটার পরের কয়েক ঘণ্টার Booking গুলো
                Report এ চলে যায় আগের দিনে। ফাঁকা ফোনের ঘরগুলো Email এ দেখতে লাগে
                যেন কিছু ভুলে বাদ পড়েছে। আর ফোন নম্বর মেলাতে গিয়ে আপনি একটা একটা
                করে চোখ দিয়ে দেখেন।
              </ContentParagraph>
              <ContentParagraph>
                এবার আরেকটা দৃশ্য। আপনি Island Tours এর Backend এ কাজ করছেন। একটা
                ফর্ম থেকে সিটের সংখ্যা আসে লেখা হিসেবে, আর একদিন কেউ লিখে দেন
                two। Query টা ভেঙে পড়ে এমন একটা Error দিয়ে, যার অর্থ প্রথমবার পড়ে
                বোঝা যায় না। আরেক জায়গায় প্রতিটা ট্যুরের বাতিলের হার বের করতে
                বাতিল Booking কে মোট Booking দিয়ে ভাগ করছেন, আর যে ট্যুরের একটাও
                Booking নেই, সেখানে Query থেমে যায় শূন্য দিয়ে ভাগের Error এ। পুরো
                Page টা খোলে না, শুধু একটা ট্যুরের জন্য।
              </ContentParagraph>
              <ContentParagraph>
                দুইটা দৃশ্যের মূল কথা একই। Database থেকে ঠিক Row আনা যথেষ্ট নয়। সেই
                Row গুলোর ভেতরের মানকে ঠিকভাবে বদলাতে, মেলাতে আর হিসাব করতে জানতে
                হয়। আর এখানেও কয়েকটা জায়গা আছে, যেমন পূর্ণ সংখ্যার ভাগ, Time Zone,
                অজানা মান, ধরন না মেলা, যেগুলো না জানলে ভুল উত্তরটা দেখতে ঠিকই লাগে।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল শেষে ফারুক সাহেবের পুরো Report টা আপনি একটা Query তে লিখবেন,
                Excel ছাড়া, আর প্রতিটা Column এর হিসাব কেন ঠিক, সেটাও বলতে পারবেন।
                Backend এর দুইটা Error ও কোথা থেকে আসে আর কীভাবে আটকাবেন, জানবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এখনই সব বুঝতে হবে না",
          content: (
            <p>
              গড় কেন 2 এল, তারিখ কেন আগের দিনে গেল, two কেন Query ভাঙল, শূন্য দিয়ে
              ভাগ কেন থামিয়ে দিল, এখানে ইচ্ছা করেই ব্যাখ্যা দেওয়া হয়নি। প্রতিটার
              কারণ আর সমাধান আছে নির্দিষ্ট একটা লেসনে, যেটা নিচের মানচিত্রে দেখবেন।
              মডিউল শেষে এই অংশটা আবার পড়লে প্রতিটা ভুলের কারণ আপনি এক লাইনে বলে
              দিতে পারবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "big-picture",
      subHeader: { index: "002", title: "The Big Picture" },
      title: <SectionTitle>পুরো মডিউল, এক কথায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একজন দর্জির কথা ভাবুন। দোকানে থান কাপড় আসে, লম্বা আর এক রকম। সেটা
                দিয়ে পোশাক বানাতে দর্জির হাতে কয়েকটা যন্ত্র থাকে। ফিতা দিয়ে মাপ নেন,
                কাঁচি দিয়ে কাটেন, বাড়তি সুতো ছেঁটে ফেলেন, ছেঁড়া জায়গায় তালি দেন,
                আর কখনো একটা ছাঁচ মিলিয়ে দেখেন নকশাটা ঠিক আছে কিনা। কাপড় একই থাকে,
                কিন্তু হাত থেকে বের হয় এমন কিছু, যা মানুষ পরতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                SQL এ Function হলো সেই যন্ত্র। একটা Function কিছু মান নেয়, যেমন একটা
                নাম, একটা দাম বা একটা সময়, আর বদলে একটা নতুন মান ফেরত দেয়, যেমন বড়
                হাতের নাম, গোল করা দাম, বা শুধু মাসটা। SELECT যেখানে যেখানে একটা মান
                বসাতে দেয়, Function সেখানেই বসে: ফলাফলের Column এ, WHERE এর শর্তে,
                ORDER BY এর ক্রমে। আর গুরুত্বপূর্ণ কথা, Function Table এর আসল মানে
                হাত দেয় না। Table এ যা ছিল তাই থাকে, বদলায় শুধু আপনার হাতে আসা
                উত্তরটা।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউলের ছয়টা লেসন আসলে দর্জির ছয় রকম যন্ত্র চেনা। লেখা কাটা আর
                জোড়া দেওয়া, সংখ্যার মাপ আর গোল করা, ক্যালেন্ডার আর ঘড়ি, এক ধরনের মানকে
                আরেক ধরনে বদলানো, ফাঁকা জায়গায় তালি, আর নকশার ছাঁচ। নিচের বক্সে একটা
                ছোট নমুনা: বিদেশি তিনজন Customer এর শহর বড় হাতে, Email থেকে শুধু
                Domain, আর ফোন না থাকলে No phone। নিয়মগুলো এখনো জানার দরকার নেই,
                শুধু Run চাপুন আর দেখুন, একটা কাঁচা Table থেকে কেমন পরিপাটি একটা
                তালিকা বের হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="থান কাপড় থেকে পোশাক"
              query={`SELECT full_name,
       upper(city)               AS city,
       split_part(email, '@', 2) AS email_domain,
       coalesce(phone, 'No phone') AS phone
FROM customers
WHERE country <> 'Bangladesh'
ORDER BY customer_id;`}
              caption="তিনটা Row আসবে: Priya Sharma, Aiman Zulkifli আর Oliver Bennett, শহর KOLKATA, KUALA LUMPUR আর LONDON, Domain তিনজনেরই mail.example, আর ফোনের ঘরে No phone। এবার customers Table টা আবার শুধু SELECT * দিয়ে দেখুন: শহরগুলো আগের মতোই ছোট হাতে লেখা আছে। Function শুধু উত্তর বদলায়, Table নয়। upper লেসন ১ এ, coalesce লেসন ৫ এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিয়েছে, এই মডিউল কী যোগ করে, পরের মডিউল কী চায়"
              caption="Module 03 দিয়েছে প্রশ্ন করার ক্ষমতা: কোন Row, কোন Column, কোন ক্রম, কতগুলো। Module 04 সেই প্রতিটা Row এর ভেতরের মানগুলোকে বদলাতে আর হিসাব করতে শেখায়, এক Row এর ভেতরে। Module 05 এর পর এক Row ছেড়ে অনেক Row একসাথে ধরবে: মোট, গড়, সর্বোচ্চ, আর মাস ধরে ভাগ। সেই হিসাবগুলোর ভেতরেও এই মডিউলের Function গুলোই লাগবে, যেমন মাস বের করা আর গড়কে গোল করা।"
              before={{
                tag: "Module 03",
                title: "Reading Data",
                lines: ["SELECT আর WHERE লেখা", "NULL আর ক্রম বোঝা", "Page আর লেবেল বানানো"],
              }}
              current={{
                tag: "Module 04",
                title: "Functions & Expressions",
                lines: ["লেখা আর সংখ্যা সাজানো", "তারিখ আর Time Zone", "NULL এর বদলে বিকল্প"],
              }}
              after={{
                tag: "Module 05",
                title: "Aggregation & Grouping",
                lines: ["অনেক Row থেকে এক উত্তর", "GROUP BY দিয়ে দলে ভাগ", "Report এর আসল হিসাব"],
              }}
            />
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "what-you-will-learn",
      subHeader: { index: "003", title: "What You Will Learn" },
      title: <SectionTitle>ছয়টা লেসন, ছয় রকম যন্ত্র</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। নিচে ছয়টা লেসন আর
              তাদের প্রশ্ন। যেকোনোটায় চাপ দিলে সরাসরি সেখানে যাবেন, তবে প্রথমবার ক্রম
              ধরে যাওয়াই ভালো, কারণ পরের লেসনগুলো আগের লেসনের Function গুলো ব্যবহার
              করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              track="sql"
              moduleId="functions-expressions"
              questions={{
                "string-functions":
                  "নামের আগে পিছের বাড়তি জায়গা, বড় ছোট অক্ষর, Email থেকে Domain, দুইটা লেখা জোড়া দেওয়া, এসব লেখার কাজ SQL এর ভেতরেই কীভাবে করবেন?",
                "numeric-functions":
                  "৫ কে ২ দিয়ে ভাগ করলে কেন ২ আসে, টাকার হিসাব কীভাবে নির্ভুল রাখবেন, আর দাম গোল করার কোন উপায়টা কখন ঠিক?",
                "date-time-functions":
                  "একটা সময় থেকে মাস বা দিন কীভাবে বের করবেন, দুইটা তারিখের ফারাক কীভাবে মাপবেন, আর ঢাকা আর UTC এর হিসাব কখনো না গুলিয়ে কীভাবে রাখবেন?",
                "type-casting":
                  "লেখাকে সংখ্যা, সংখ্যাকে লেখা, লেখাকে তারিখ কীভাবে বানাবেন, আর কোন রূপান্তর PostgreSQL মেনে নেয় না?",
                "null-functions":
                  "ফাঁকা মানের জায়গায় একটা বিকল্প কীভাবে বসাবেন, শূন্য দিয়ে ভাগের Error কীভাবে আটকাবেন, আর কয়েকটা মানের মধ্যে বড় বা ছোটটা কীভাবে নেবেন?",
                "regular-expressions":
                  "LIKE দিয়ে যে নকশা ধরা যায় না, যেমন বিভিন্নভাবে লেখা ফোন নম্বর, সেগুলো কীভাবে খুঁজবেন, যাচাই করবেন আর এক রকম করবেন?",
              }}
              footer="ছয়টা লেসন দুই ভাগে মনে রাখা সহজ। প্রথম তিনটা তিন রকম মানের যন্ত্র: লেখা, সংখ্যা, আর তারিখ ও সময়। পরের তিনটা সব রকম মানের সাথে কাজ করে: এক ধরন থেকে আরেক ধরনে যাওয়া, অজানা মান সামলানো, আর নকশা মেলানো। শেষ লেসনে পুরো মডিউলের একটা Recap আছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনগুলোকে একটা গল্প হিসেবে দেখা যাক, কারণ প্রতিটা লেসন পরের
                লেসনের জন্য জমি তৈরি করে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ১, String Functions।</strong> প্রথমে আসে লেখা, কারণ
                Database এ সবচেয়ে বেশি থাকে লেখাই: নাম, শহর, Email, ফোন। এখানে আপনি
                প্রথমবার দেখবেন Function আসলে কী, একটা মান ঢোকে আর একটা মান বের হয়।
                তারপর লেখা মাপা, বড় ছোট করা, আগে পিছের বাড়তি জায়গা ছাঁটা, দুইটা লেখা
                জোড়া দেওয়া, আর একটা লেখা থেকে একটা অংশ কেটে নেওয়া, যেমন Email থেকে
                Domain। একটা মজার জিনিসও দেখবেন: ঢাকা শব্দে অক্ষর চারটা হলেও Byte
                অনেক বেশি, কারণ বাংলা অক্ষর রাখতে বেশি জায়গা লাগে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ২, Numbers and the Integer Division Trap।</strong> তারপর
                সংখ্যা, কারণ Island Tours এর প্রায় প্রতিটা প্রশ্নই শেষে গিয়ে টাকা।
                এখানেই ফারুক সাহেবের গড় সিটের রহস্য খুলবে: দুইটা পূর্ণ সংখ্যার ভাগে
                কেন দশমিক হারিয়ে যায়, আর তিনটা আলাদা উপায়ে কীভাবে সেটা আটকানো যায়।
                সাথে গোল করা, ওপরে বা নিচে টেনে নেওয়া, আর টাকার হিসাব কেন সবসময়
                numeric ধরনে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৩, Dates, Times and Time Zones।</strong> এই মডিউলের সবচেয়ে
                বড় লেসন, আর কারণটা সহজ: সময় নিয়ে ভুল হয় সবচেয়ে বেশি, আর সেই ভুল ধরা
                পড়ে সবচেয়ে দেরিতে। একটা সময় থেকে মাস, সপ্তাহের দিন বের করা, দুইটা
                তারিখের মাঝে কত দিন, কোনো তারিখের সাথে তিন দিন যোগ করা, তারিখকে
                মানুষের পড়ার মতো করে লেখা। আর সবচেয়ে জরুরি অংশ, Time Zone: একটা মুহূর্ত
                ঢাকায় যখন রাত একটা, লন্ডনে তখন আগের দিনের সন্ধ্যা, আর Database সেটা
                কীভাবে সামলায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৪, Casting Between Types।</strong> প্রথম তিন লেসনে আপনি
                তিন রকম মানের সাথে কাজ করেছেন। এবার তাদের মাঝে যাতায়াত: লেখা থেকে
                সংখ্যা, সংখ্যা থেকে লেখা, লেখা থেকে তারিখ। Backend এর দৃশ্যের two
                এর রহস্য এখানে খুলবে, আর দেখবেন কেন PostgreSQL ধরন না মিললে চুপচাপ
                কিছু একটা আন্দাজ করে না, Error দিয়ে থামিয়ে দেয়, আর কেন সেটা আসলে
                ভালো।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৫, COALESCE, NULLIF, GREATEST, LEAST।</strong> Module 03
                এ আপনি শিখেছেন NULL মানে অজানা, আর তাকে কীভাবে খুঁজতে হয়। এবার তাকে
                সামলানো: ফাঁকা ফোনের জায়গায় No phone, Guide না থাকলে একটা লেখা, আর
                শূন্য দিয়ে ভাগের আগে শূন্যকে NULL বানিয়ে Query কে বাঁচানো। Backend এর
                দ্বিতীয় Error টার সমাধান এখানে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৬, Regular Expressions।</strong> শেষে আসে সবচেয়ে ধারালো
                যন্ত্র। LIKE দিয়ে আপনি শুরু, শেষ বা মাঝের একটা টুকরো মেলাতে পারেন,
                কিন্তু ফোন নম্বর কি শুধু অঙ্ক দিয়ে লেখা, শুরুতে কি +880, সেটা LIKE
                দিয়ে বলা যায় না। Regular Expression দিয়ে যায়। এই লেসনের শেষে পুরো
                মডিউলের Recap, যেখানে ফারুক সাহেবের Report টা একটা Query তে লেখা হবে,
                আর তারপর পরের মডিউলের দরজা।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা লেসনে আগের মতোই Query বক্স আর অনুশীলনের বক্স আছে। অনুশীলনের বক্সে
                আপনার Query আর লেসনের সমাধান একই Database এ চলে, আর দুই ফলাফল মেলানো
                হয়। এই মডিউলে একটা সুবিধা যোগ হয়েছে: সংখ্যার উত্তর তুলনা হয় মানের
                হিসাবে, তাই 45000.00 আর 45000 একই উত্তর ধরা হয়। আর তারিখের অনুশীলনে
                ধরে নেওয়া হবে আজ 1 November 2026, যাতে উত্তরটা প্রতিদিন একই থাকে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "why-learn-it",
      subHeader: { index: "004", title: "Why Learn It" },
      title: <SectionTitle>Excel এ করে নিলেই তো হয়, তাহলে কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা আপত্তি প্রায়ই শোনা যায়: Data টা বের করে Excel এ নিলেই তো সব
                করা যায়, অথবা App এর Code এ একটু JavaScript লিখলেই হয়। কথাটা পুরো
                ভুল নয়। কিছু সাজানোর কাজ, যেমন একটা তারিখ কোন ভাষায় দেখাবে, App এর
                হাতে থাকাই ভালো, আর লেসনগুলোতেও সেটা বলা আছে। কিন্তু হিসাব, ছাঁকা আর
                মেলানোর কাজ Database এর ভেতরে করার তিনটা বড় কারণ আছে। প্রথমত, শর্তে
                Function লাগলে, যেমন ঢাকার তারিখে অক্টোবরের Booking, সেটা Database
                এর ভেতরে না করলে পুরো Table টা আগে বাইরে আনতে হয়। দ্বিতীয়ত, একই
                হিসাব পাঁচ জায়গায় পাঁচভাবে হলে পাঁচটা আলাদা উত্তর আসে। তৃতীয়ত, Excel
                এর হাতের কাজ পরের মাসে আবার হাতে করতে হয়, Query একবার লিখলে প্রতি মাসে
                চলে।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল বাদ দিয়ে এগোলে খরচটা কোথায় কোথায় দিতে হয়, দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>চুপচাপ ভুল সংখ্যা।</strong> পূর্ণ সংখ্যার ভাগে গড় 2.21 এর
                  জায়গায় 2 আসে, কোনো Error ছাড়া। টাকা float এ হিসাব করলে শেষ দশমিকে
                  পয়সা এদিক ওদিক হয়। এগুলো Report এ চলে যায়, আর কেউ টের পান মাসের শেষে
                  হিসাব না মেলায়।
                </ListItem>
                <ListItem>
                  <strong>ভুল দিনের হিসাব।</strong> Time Zone না বুঝলে মধ্যরাতের পরের
                  Booking আগের দিনে যায়, নতুন মাসের প্রথম রাতের Booking আগের মাসে। দৈনিক আর
                  মাসিক সংখ্যা ছোট ছোট পরিমাণে ভুল হয়, যেটা খুঁজে বের করা সবচেয়ে কঠিন।
                </ListItem>
                <ListItem>
                  <strong>হঠাৎ ভেঙে পড়া Page।</strong> শূন্য দিয়ে ভাগ বা ভুল ধরনের
                  একটা মান পুরো Query থামিয়ে দেয়। একটা ট্যুরের জন্য পুরো Dashboard বন্ধ।
                </ListItem>
                <ListItem>
                  <strong>অপরিষ্কার Data র সাথে লড়াই।</strong> নামের শেষে একটা বাড়তি
                  জায়গা, ছোট বড় অক্ষরের মিশেল, পাঁচ রকমে লেখা ফোন নম্বর। এগুলো না
                  সামলাতে পারলে একই মানুষ দুইবার গোনা হন, অথবা খুঁজে পাওয়া যায় না।
                </ListItem>
                <ListItem>
                  <strong>পরের মডিউলগুলো ঝাপসা।</strong> Module 05 এর মাসিক Report,
                  Module 08 এর মাস থেকে মাসের তুলনা, Module 13 এর Index, সবখানে এই
                  মডিউলের Function গুলো ধরে নেওয়া হবে। date_trunc না জানলে মাস ধরে ভাগ
                  করা যায় না, cast না জানলে অনেক Error এর মানে বোঝা যায় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর কয়েকটা প্রচলিত ভুল ধারণা আছে, যেগুলো এই মডিউল ভাঙবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ভাগ মানেই দশমিক উত্তর।</strong> না, PostgreSQL এ দুইটা পূর্ণ
                  সংখ্যার ভাগ পূর্ণ সংখ্যাই দেয়। লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>Database সব সময় UTC তে দেখায়, তাই Time Zone App এর মাথাব্যথা।</strong>{" "}
                  না, timestamptz একটা মুহূর্ত রাখে, আর দেখায় Connection এর Time Zone
                  অনুযায়ী। একই Row দুই জায়গা থেকে দেখলে দুই রকম লাগতে পারে। লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>Database নিজেই বুঝে নেবে কোনটা সংখ্যা।</strong> PostgreSQL
                  অনেক জায়গায় বুঝে নেয়, আবার অনেক জায়গায় ইচ্ছা করেই নেয় না, আর
                  সেই সীমাটা জানা দরকার। লেসন ৪।
                </ListItem>
                <ListItem>
                  <strong>NULL এর সাথে কিছু যোগ করলে NULL টা উপেক্ষা হয়।</strong> না,
                  বেশিরভাগ হিসাবে একটা NULL পুরো উত্তরকে NULL বানিয়ে দেয়, যতক্ষণ না
                  আপনি নিজে একটা বিকল্প বসান। লেসন ৫।
                </ListItem>
                <ListItem>
                  <strong>Regular Expression শুধু Programmer দের জন্য।</strong> আসলে
                  এটা কয়েকটা চিহ্নের একটা ছোট ভাষা, আর ফোন বা Email এর মতো Data পরিষ্কার
                  করতে প্রায় প্রতিটা Data র কাজে লাগে। লেসন ৬।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই মডিউলের একটাই মূল কথা",
          content: (
            <p>
              একটা Function মান নেয় আর একটা নতুন মান দেয়, Table এ হাত না দিয়ে। আর
              প্রতিটা মানের একটা ধরন আছে: লেখা, সংখ্যা, তারিখ, সময়। কোন Function কোন
              ধরনের মান নেয় আর কোন ধরন ফেরত দেয়, সেটা জানলেই অর্ধেক ভুল আগেই আটকে
              যায়। পূর্ণ সংখ্যার ভাগ, Time Zone, two এর Error, তিনটাই আসলে ধরনের গল্প।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "where-it-helps",
      subHeader: { index: "005", title: "Where It Helps" },
      title: <SectionTitle>কাজের জায়গায় ঠিক কোন মুহূর্তগুলোতে লাগবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে ছয়টা মুহূর্ত, যেগুলো একজন Developer, Analyst বা Backend Engineer এর
              কাজে বারবার আসে। একটা বেছে নিন, দেখুন এই মডিউল না জানলে ঘটনাটা কেমন
              যায় আর জানলে কেমন যায়, আর নিচে দেখুন কোন লেসনে উত্তরটা আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "average-two",
                  label: "গড় সিট 2, আসলে 2.21",
                  situation:
                    "মাসিক Report এ একটা Booking এ গড়ে কতগুলো সিট, সেটা বের করতে আপনি মোট সিট 53 কে Booking এর সংখ্যা 24 দিয়ে ভাগ করলেন। উত্তর এল 2। কোনো Error নেই, Report চলে গেল।",
                  without:
                    "পরে কেউ ক্যালকুলেটরে হিসাব করে দেখেন উত্তর হওয়া উচিত 2.21। আপনি Query টা বারবার দেখেন, ভাগের চিহ্নটা তো ঠিকই আছে। শেষে অনুমান করেন Database এর কোনো গোলমাল।",
                  withIt:
                    "আপনি জানেন দুইটা পূর্ণ সংখ্যার ভাগে PostgreSQL দশমিক ফেলে দেয়। একটা মানকে numeric এ বদলে নেন, তারপর round দিয়ে দুই দশমিকে আনেন। উত্তর 2.21, আর পরের Report গুলোতে এই ভুল আর হয় না।",
                  lessons: ["Numbers and the Integer Division Trap", "Casting Between Types"],
                },
                {
                  id: "midnight-booking",
                  label: "রাত একটার Booking আগের দিনে",
                  situation:
                    "একজন Customer ঢাকার সময় রাত একটায় একটা Booking করলেন। দৈনিক Report এ সেটা দেখাল আগের দিনের তারিখে। Report টা চলে এমন একটা Server থেকে, যার Time Zone UTC।",
                  without:
                    "আপনি ভাবেন Customer ভুল তারিখে Booking করেছেন, অথবা App এর ঘড়ি ভুল। নতুন মাসের প্রথম রাতের কয়েকটা Booking আগের মাসে চলে যায়, আর মাসিক সংখ্যা প্রতিবার সামান্য ভুল থাকে।",
                  withIt:
                    "আপনি জানেন timestamptz একটা মুহূর্ত রাখে আর দেখায় Connection এর Time Zone অনুযায়ী, আর ঢাকা UTC র চেয়ে ছয় ঘণ্টা এগিয়ে। Report এর Query তে AT TIME ZONE 'Asia/Dhaka' দিয়ে ঢাকার তারিখ বের করেন, তারপর তারিখ ধরে ভাগ করেন।",
                  lessons: ["Dates, Times and Time Zones"],
                },
                {
                  id: "blank-phone",
                  label: "Email এ ফাঁকা ঘর",
                  situation:
                    "Customer দের একটা তালিকা Email এ যাচ্ছে। পাঁচজনের ফোনের ঘর ফাঁকা, কারণ তাঁদের নম্বর জানা নেই। মালিক জানতে চাইলেন, তালিকাটা কি অর্ধেক কাটা পড়েছে?",
                  without:
                    "আপনি তালিকাটা Excel এ নিয়ে ফাঁকা ঘরগুলোতে হাতে হাতে লিখে দেন। পরের মাসে আবার একই কাজ। আর একদিন একটা ঘর বাদ পড়ে যায়।",
                  withIt:
                    "আপনি Query তে লেখেন coalesce(phone, 'No phone')। NULL এর জায়গায় লেখাটা বসে, আর বাকিদের নম্বর যেমন ছিল তেমনই থাকে। Report প্রতি মাসে নিজে থেকেই পরিষ্কার আসে।",
                  lessons: ["COALESCE, NULLIF, GREATEST, LEAST"],
                },
                {
                  id: "division-by-zero",
                  label: "division by zero",
                  situation:
                    "Dashboard এ প্রতিটা ট্যুরের বাতিলের হার দেখানো হয়: বাতিল Booking ভাগ মোট Booking। নতুন একটা ট্যুর যোগ হলো, তার একটাও Booking নেই। পুরো Dashboard খুলতেই ERROR: division by zero।",
                  without:
                    "আপনি নতুন ট্যুরটাকে আপাতত তালিকা থেকে বাদ দিয়ে দেন, আর পরের প্রতিটা নতুন ট্যুরে একই ঘটনা ঘটে। কেউ একজন পরামর্শ দেন App এর Code এ একটা try catch বসাতে।",
                  withIt:
                    "আপনি ভাগের নিচের সংখ্যাটাকে NULLIF দিয়ে লেখেন, যাতে শূন্য হলে সেটা NULL হয়ে যায়। শূন্য দিয়ে ভাগের বদলে উত্তর আসে NULL, আর COALESCE দিয়ে সেখানে লিখে দেন কোনো Booking নেই।",
                  lessons: ["COALESCE, NULLIF, GREATEST, LEAST", "Numbers and the Integer Division Trap"],
                },
                {
                  id: "invalid-input",
                  label: "invalid input syntax",
                  situation:
                    "একটা ফর্ম থেকে সিটের সংখ্যা আসে লেখা হিসেবে। একদিন কেউ সংখ্যার জায়গায় লিখলেন two। Backend এর Query থেমে গেল একটা Error দিয়ে: invalid input syntax for type integer।",
                  without:
                    "আপনি Error টার কোন অংশে কী বলছে বুঝতে পারেন না। Google এ খুঁজে একটা উপায় পান যেটা Error টা লুকিয়ে ফেলে, আর ভুল মানটা চুপচাপ শূন্য হয়ে Database এ চলে যায়।",
                  withIt:
                    "আপনি জানেন PostgreSQL লেখা থেকে সংখ্যা বানাতে পারেনি, আর সেটা ইচ্ছা করেই থেমেছে। মান Database এ যাওয়ার আগেই যাচাই করেন, আর সত্যিই রূপান্তর লাগলে ঠিক কোথায় CAST বসবে আর কোন মান সেটা মানবে না, জানেন।",
                  lessons: ["Casting Between Types"],
                },
                {
                  id: "messy-phones",
                  label: "পাঁচ রকমে লেখা ফোন নম্বর",
                  situation:
                    "পুরনো একটা Spreadsheet থেকে কয়েকশো Customer আমদানি হলো। ফোন নম্বর কেউ লিখেছেন শুরুতে +880 দিয়ে, কেউ শূন্য দিয়ে, কেউ মাঝে Space বা ড্যাশ চিহ্ন দিয়ে। আর নামের শেষে মাঝে মাঝে বাড়তি জায়গা।",
                  without:
                    "একই মানুষকে নম্বর দিয়ে খুঁজলে পাওয়া যায় না, আর দুইবার আমদানি হলে একজন দুইজন হয়ে যান। আপনি একটা একটা করে হাতে ঠিক করতে বসেন।",
                  withIt:
                    "আপনি trim দিয়ে বাড়তি জায়গা ছাঁটেন, regexp_replace দিয়ে অঙ্ক ছাড়া সব চিহ্ন সরিয়ে নম্বরগুলো এক রকম করেন, আর একটা Pattern দিয়ে খুঁজে বের করেন কোন নম্বর তবু নিয়মে মিলছে না, যাতে কেউ সেগুলো ফোন করে ঠিক করে নিতে পারেন।",
                  lessons: ["String Functions", "Regular Expressions"],
                },
              ]}
              footer="প্রতিটা মুহূর্তে ভুলটা Error হিসেবে আসেনি, অথবা এসেছে এমন Error হিসেবে যার মানে প্রথমবার বোঝা যায় না। এই মডিউলের কাজ ঠিক এই দুই রকম ভুল চিনতে শেখানো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলের Function গুলো আপনার কাজের দিনে যেখানে যেখানে দেখা দেবে,
                তার একটা তালিকা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Report আর Dashboard।</strong> Metabase, Grafana বা যেকোনো
                  BI Tool এর প্রতিটা চার্টের পেছনে একটা SQL। মাস ধরে ভাগ করতে
                  date_trunc, দশমিক ঠিক রাখতে round, ফাঁকা ঘরে লেখা বসাতে coalesce।
                </ListItem>
                <ListItem>
                  <strong>Backend এর Code।</strong> Node.js বা অন্য কোনো ভাষার App
                  থেকে পাঠানো Query তে প্রায়ই lower দিয়ে Email মেলানো, interval দিয়ে
                  মেয়াদ হিসাব, আর cast দিয়ে মান মেলানো থাকে। ORM ব্যবহার করলেও এই
                  Function গুলোই তার ভেতরে চলে।
                </ListItem>
                <ListItem>
                  <strong>Error Message।</strong> invalid input syntax for type
                  integer, division by zero, operator does not exist: text = integer,
                  function does not exist। এই মডিউলের পর প্রতিটা দেখে আপনি বলতে
                  পারবেন কোন ধরন কোথায় মেলেনি।
                </ListItem>
                <ListItem>
                  <strong>Data পরিষ্কার করার কাজ।</strong> নতুন কোনো CSV বা পুরনো
                  System থেকে Data আনার পর trim, lower, regexp_replace আর cast দিয়ে
                  সবকিছু এক রকম করা, প্রায় প্রতিটা Data Migration এর প্রথম দিনের কাজ।
                </ListItem>
                <ListItem>
                  <strong>Time Zone এর Bug।</strong> যেকোনো App যার Customer একাধিক
                  দেশে, সেখানে একদিন না একদিন তারিখের একটা Bug আসবেই। কে খুঁজে বের
                  করবেন, সেটা নির্ভর করে কে timestamptz আর AT TIME ZONE বোঝেন।
                </ListItem>
                <ListItem>
                  <strong>Interview।</strong> পূর্ণ সংখ্যার ভাগ কেন দশমিক হারায়, NULL
                  থাকলে যোগফলে কী হয়, একটা Timestamp থেকে মাস বের করে তারিখ ধরে ভাগ
                  করুন, এই প্রশ্নগুলো Backend আর Data দুই রকম Interview তেই খুব
                  সাধারণ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "in-real-life",
      subHeader: { index: "006", title: "In Real Life" },
      title: <SectionTitle>Island Tours এ এই Function গুলো কোথায় চলে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর মতো একটা ব্যবসায় এই মডিউলের Function গুলো কোথায়
                কোথায় লুকিয়ে থাকে, কয়েকটা জায়গা দেখুন। এগুলো আপনার নিজের Project
                এও প্রায় হুবহু আসবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Booking নিশ্চিত হওয়ার Email।</strong> তারিখ লেখা থাকে 01 Oct
                  2026 এর মতো করে, ঢাকার সময়ে, আর মোট টাকার পাশে একজনের ভাগে কত পড়ল।
                  to_char, round আর Time Zone, তিনটা লেসনের জিনিস এক Email এ।
                </ListItem>
                <ListItem>
                  <strong>ট্যুরের Search।</strong> কেউ ছোট হাতে লিখুন বা বড় হাতে, আগে
                  পিছে Space দিন বা না দিন, ফলাফল যেন একই আসে। lower আর trim, লেসন ১।
                </ListItem>
                <ListItem>
                  <strong>Admin এর তালিকা।</strong> যে ট্যুরের Guide এখনো ঠিক হয়নি,
                  সেখানে ফাঁকা ঘরের বদলে লেখা থাকে Guide not assigned। coalesce, লেসন ৫।
                </ListItem>
                <ListItem>
                  <strong>যাত্রার আগের Reminder।</strong> কোন ট্যুর ছাড়তে আর তিন দিন বাকি,
                  সেই Customer দের তালিকা। তারিখের বিয়োগ আর interval, লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>ফোন নম্বর যাচাই।</strong> নতুন Customer যোগ হওয়ার পর একটা
                  Query খুঁজে দেয় কার নম্বর বাংলাদেশের নিয়মে লেখা নয়, যাতে কেউ যোগাযোগ
                  করে ঠিক করে নিতে পারেন। Regular Expression, লেসন ৬।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে ফারুক সাহেবের Report এর একটা টুকরো। অক্টোবরের প্রথম পাঁচটা
                Booking, তারিখ মানুষের মতো করে লেখা, আর প্রতিটার পাশে একজনের ভাগ। এই বক্সের
                PostgreSQL ঢাকার Time Zone এ চলে, তাই তারিখগুলো ঢাকার তারিখ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফারুক সাহেবের Report এর একটা টুকরো"
              query={`SELECT booking_id,
       to_char(booked_at, 'DD Mon YYYY') AS booked_on,
       total_bdt,
       round(total_bdt / seats, 2)      AS per_seat
FROM bookings
WHERE booked_at >= DATE '2026-10-01'
ORDER BY booked_at
LIMIT 5;`}
              caption="পাঁচটা Row আসবে, booking_id 14, 16, 19, 17 আর 20, তারিখ 01 Oct 2026 থেকে 10 Oct 2026 পর্যন্ত। প্রথম Row এ মোট 50000.00, একজনের ভাগে 12500.00। to_char লেসন ৩ এ, round লেসন ২ এ। এই মডিউল শেষে পুরো Report টা, গড় সিট আর ফোনের যাচাইসহ, আপনি নিজে লিখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলে আপনি নিজে যা যা করবেন, ক্রম ধরে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  প্রতিটা লেসনের Query বক্স চালাবেন, তারপর একটা Function বদলে দেখবেন
                  উত্তর কীভাবে বদলায়, যেমন upper এর জায়গায় lower, বা round এর জায়গায়
                  trunc।
                </ListItem>
                <ListItem>
                  অনুশীলনের বক্সে নিজে Query লিখে Check চাপবেন। তারিখের অনুশীলনে ধরে
                  নেবেন আজ 1 November 2026, কারণ now() প্রতিদিন আলাদা উত্তর দেয়।
                </ListItem>
                <ListItem>
                  লেসন ৩ এ নিজের psql এ SHOW TimeZone চালিয়ে দেখবেন আপনার মেশিন কোন Time
                  Zone এ আছে, আর একই Booking দুইটা আলাদা Time Zone এ দেখবেন।
                </ListItem>
                <ListItem>
                  প্রতিটা লেসনের Lab এর Drill গুলো নিজের island_tours Database এ চালিয়ে
                  Row এর সংখ্যা মিলিয়ে নেবেন।
                </ListItem>
                <ListItem>
                  শেষ লেসনের Recap এ পুরো মাসিক Report টা একটা Query তে লিখবেন, আর
                  নিজের Notebook এ প্রতিটা Column এর পাশে লিখে রাখবেন কোন Function আর
                  কেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "before-and-after",
      subHeader: { index: "007", title: "Before and After" },
      title: <SectionTitle>এই মডিউল আপনাকে কোথা থেকে কোথায় নিয়ে যাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <BeforeAfterSplit
              before={[
                "Query এর উত্তর Excel এ নিয়ে সেখানে Formula দিয়ে সাজান",
                "ভাগের উত্তরে দশমিক না এলে বুঝতে পারেন না কেন",
                "সময়ের Column দেখে নিশ্চিত হতে পারেন না সেটা কোন দেশের সময়",
                "ফাঁকা ঘরগুলো Report এ যেমন আছে তেমনই চলে যায়",
                "invalid input syntax দেখলে কোথায় ভুল খুঁজবেন জানেন না",
                "অপরিষ্কার নাম আর ফোন নম্বর হাতে হাতে ঠিক করেন",
                "একই হিসাব প্রতিবার নতুন করে করেন, কখনো একটু আলাদা উত্তর আসে",
              ]}
              after={[
                "লেখা, সংখ্যা আর তারিখ SQL এর ভেতরেই সাজিয়ে দরকারি আকারে আনেন",
                "পূর্ণ সংখ্যার ভাগের ফাঁদ চেনেন, আর টাকার হিসাব numeric এ রাখেন",
                "timestamptz আর AT TIME ZONE দিয়ে ঠিক দেশের তারিখ বের করেন",
                "coalesce আর NULLIF দিয়ে অজানা মান আর শূন্য দিয়ে ভাগ সামলান",
                "Error দেখে বলতে পারেন কোন মানের ধরন কোথায় মেলেনি, আর কোথায় CAST বসবে",
                "trim, lower আর Regular Expression দিয়ে Data এক রকম করেন",
                "পুরো একটা মাসিক Report একটা Query তে লেখেন, যেটা প্রতি মাসে একই হিসাব দেয়",
              ]}
              footer="বাঁ দিকের প্রায় প্রতিটা অভ্যাস অভিজ্ঞ মানুষেরও একসময় ছিল। মডিউল শেষে ডান দিকের তালিকাটা দিয়ে নিজেকে যাচাই করুন, আর যেটায় দ্বিধা থাকে, তার লেসনে আবার ফিরে যান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলের মানদণ্ড হলো একটা Column এর হিসাব ব্যাখ্যা করতে পারা।
                কাউকে একটা Report দেখিয়ে আপনি বলবেন, এই Column এ দুইটা পূর্ণ সংখ্যার
                ভাগ, তাই আগে একটাকে numeric এ বদলেছি। এই তারিখটা ঢাকার, কারণ Time
                Zone বলে দিয়েছি। এই ঘরে No phone, কারণ মানটা অজানা ছিল। আর বলবেন
                কোন একটা লাইন বাদ দিলে উত্তরটা কীভাবে চুপচাপ ভুল হয়ে যেত।
              </ContentParagraph>
              <ContentParagraph>
                এটা পারলে আপনি শুধু Function এর নাম শেখেননি, মানের ধরন নিয়ে ভাবতে
                শিখেছেন। আর সেটাই পাশের কাউকে বোঝানোর আসল জিনিস: কোন উত্তর কেন ঠিক,
                আর কোন ঠিক দেখতে উত্তর আসলে ভুল।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "how-to-study",
      subHeader: { index: "008", title: "How to Study" },
      title: <SectionTitle>এই মডিউল কীভাবে পড়লে সবচেয়ে বেশি পাবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>আগে যা লাগবে।</strong> Module 03 পুরোটা, বিশেষ করে লেসন ৫ এর
                NULL আর লেসন ৯ এর CASE। এই মডিউলের অনেক জায়গায় ধরে নেওয়া হবে আপনি
                SELECT, WHERE, ORDER BY আর LIMIT নিজে লিখতে পারেন, আর NULL মানে অজানা।
                Module 02 শেষ করা থাকলে Lab এর Drill গুলো নিজের psql এ চালাতে পারবেন,
                না থাকলেও লেসনের বক্সগুলো Browser এই চলে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>সময়।</strong> পুরো মডিউলের জন্য তিন চার দিন ধরে রাখুন। ছয়টা লেসন
                পড়তে মোট প্রায় তিন থেকে চার ঘণ্টা লাগে, সবচেয়ে বেশি লেসন ৩ এ, তারিখ আর
                Time Zone এ। সেই লেসনটার জন্য একটা পুরো দিন রাখুন, তাড়াহুড়ো করবেন না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ক্রম।</strong> লেসন ১ থেকে ৩ মোটামুটি স্বাধীন, তবু ক্রম ধরেই
                পড়ুন। লেসন ৪ প্রথম তিনটাকে একসাথে বাঁধে, কারণ সেখানে লেখা, সংখ্যা আর
                তারিখের মাঝে যাতায়াত। লেসন ৫ Module 03 এর NULL এর পরের ধাপ। আর লেসন ৬
                লেসন ১ এর লেখার কাজকে আরও ধারালো করে, তাই সেটা সবার শেষে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Query বক্স।</strong> প্রতিটা বক্স আগে যেমন আছে তেমন চালান, তারপর
                একটা Function এর একটা মান বদলান। round এর দশমিকের সংখ্যা, date_trunc এর
                month কে week, Time Zone এর নাম। চালানোর আগে মনে মনে অনুমান করুন কী আসবে,
                তারপর মিলিয়ে দেখুন। এই মডিউলে অনুমান ভুল হওয়ার জায়গা অনেক, আর
                সেগুলোই সবচেয়ে বেশি শেখায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>অনুশীলনের বক্স।</strong> আগে নিজে চেষ্টা করুন, অন্তত দুইবার।
                তারপর Hint, আর সবার শেষে Solution। মনে রাখবেন, আপনার Query সমাধানের মতো
                দেখতে না হলেও চলবে, ফলাফল এক হলেই সঠিক, আর সংখ্যার উত্তরে শেষের বাড়তি
                শূন্য ধরা হয় না। তারিখের অনুশীলনে now() না লিখে প্রশ্নে বলা তারিখটা
                লিখুন, নইলে আপনার উত্তর প্রতিদিন বদলাবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Lab আর Quiz।</strong> Lab এর Drill গুলো নিজের psql এ চালান আর
                প্রতিটার পাশে লেখা Row এর সংখ্যার সাথে মিলিয়ে নিন। একটা ব্যাপার খেয়াল
                রাখবেন: সময়ের Drill এ আপনার psql এর উত্তর নির্ভর করবে আপনার মেশিনের
                Time Zone এর উপর, আর লেসন ৩ ঠিক সেটাই শেখায়। Quiz দিন লেসন শেষ করার
                পরের দিন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>MySQL এর ভিডিও দেখছেন?</strong> এই মডিউলে MySQL আর PostgreSQL এর
                পার্থক্য আগের মডিউলের চেয়ে বেশি, কারণ Function এর নামই অনেক জায়গায়
                আলাদা। লেখা জোড়া দেওয়া, তারিখ সাজানো, NULL এর বিকল্প, পূর্ণ সংখ্যার ভাগ,
                Regular Expression, প্রতিটার MySQL রূপ সংশ্লিষ্ট লেসনে পাশাপাশি দেখানো
                থাকবে, যাচাই করা অবস্থায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>আটকে গেলে।</strong> function does not exist দেখলে প্রথমে দেখুন
                Function এ যে মান দিয়েছেন তার ধরন কী, কারণ PostgreSQL একই নামের
                Function কে ধরন দেখে চেনে। psql এ \df দিয়ে একটা Function এর কোন কোন
                রূপ আছে দেখা যায়, আর অফিসিয়াল Docs এর Functions and Operators অধ্যায়ে
                প্রতিটা Function এর উদাহরণ আছে। Error না এসে ভুল উত্তর এলে Query টাকে
                ছোট করুন, একটা Column আলাদা করে চালান, আর দেখুন কোন ধাপে মানটা বদলে
                যাচ্ছে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>পরের ধাপ।</strong> এখান থেকে সোজা চলে যান প্রথম লেসনে,{" "}
                <strong>String Functions</strong>, যেখানে আপনি প্রথমবার দেখবেন একটা
                Function আসলে কী, আর লেখা নিয়ে কাজ শুরু করবেন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["লেসন", "এক লাইনে যা নিয়ে ফিরবেন"],
    rows: [
      [
        "String Functions",
        "Function মান নেয় আর নতুন মান দেয়, আর লেখা মাপা, ছাঁটা, বড় ছোট করা, জোড়া দেওয়া আর কেটে নেওয়ার কাজ SQL এর ভেতরেই হয়, Table না বদলে",
      ],
      [
        "Numbers and the Integer Division Trap",
        "দুইটা পূর্ণ সংখ্যার ভাগ PostgreSQL এ পূর্ণ সংখ্যাই দেয়, তাই দশমিক দরকার হলে একটা মানকে numeric বানাতে হয়, আর টাকা সবসময় numeric এ",
      ],
      [
        "Dates, Times and Time Zones",
        "timestamptz একটা মুহূর্ত রাখে আর দেখায় Connection এর Time Zone অনুযায়ী, তাই কোন দেশের তারিখ চাই সেটা AT TIME ZONE দিয়ে নিজে বলে দিতে হয়",
      ],
      [
        "Casting Between Types",
        "CAST বা :: দিয়ে এক ধরনের মান আরেক ধরনে যায়, আর যে মান রূপান্তর মানে না সেখানে PostgreSQL Error দিয়ে থামে, চুপচাপ আন্দাজ করে না",
      ],
      [
        "COALESCE, NULLIF, GREATEST, LEAST",
        "COALESCE অজানা মানের জায়গায় বিকল্প বসায়, NULLIF একটা মানকে NULL বানিয়ে শূন্য দিয়ে ভাগ আটকায়, আর GREATEST আর LEAST কয়েকটা মানের মধ্যে বড় আর ছোটটা দেয়",
      ],
      [
        "Regular Expressions",
        "LIKE যে নকশা ধরতে পারে না, Regular Expression তা পারে, আর তা দিয়ে লেখা খোঁজা, যাচাই করা আর এক রকম করা যায়",
      ],
    ],
  },
};
