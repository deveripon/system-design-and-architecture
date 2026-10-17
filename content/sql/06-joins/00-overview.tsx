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

export const joinsOverviewContent: TopicData = {
  id: "joins-overview",
  introduction: {
    badge: "MODULE 06 · OVERVIEW",
    title: <SectionTitle>আলাদা করে রাখা, আবার জোড়া দেওয়া</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 05 শেষে আপনি অনেক Row থেকে উত্তর বের করতে পারেন। মোট আয়, প্রতিটা
          অবস্থায় কতগুলো Booking, প্রতিটা মাসের হিসাব, সবার নিচে সর্বমোট। কিন্তু
          খেয়াল করুন, প্রতিটা Report এর দলগুলো ছিল নম্বর দিয়ে চেনা। departure_id 8,
          customer_id 1, tour_id 3। মালিক এই নম্বরগুলো পড়ে কিছুই বোঝেন না। তিনি
          জানতে চান কোন ট্যুর, কোন Customer, কোন Guide, নাম ধরে।
        </ContentParagraph>
        <ContentParagraph>
          নামগুলো Database এ আছে, শুধু অন্য Table এ। Booking এর Row এ থাকে Customer
          এর নম্বর, নাম থাকে customers Table এ। Departure এর Row এ থাকে ট্যুরের নম্বর,
          ট্যুরের নাম থাকে tours Table এ। Module 01 এ আপনি দেখেছিলেন, Data কে ইচ্ছা
          করেই কয়েকটা Table এ ভাগ করে রাখা হয়, আর Key দিয়ে একটা আরেকটাকে দেখায়। এই
          মডিউল শেখায় সেই ভাগ করা টুকরোগুলো Query এর সময় আবার জোড়া দিতে। এর নাম
          Join, আর সত্যিকারের প্রায় প্রতিটা Query তে অন্তত একটা Join থাকে।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা লেসন নয়, মডিউলের মানচিত্র। এখানে জানবেন মডিউলটা কেন দরকার,
          নয়টা লেসনে কী কী শিখবেন, না শিখলে কোথায় কোথায় Row নিঃশব্দে হারিয়ে যায় বা
          দুইবার গোনা হয়, কাজের জায়গায় এগুলো কোথায় লাগে, আর বাস্তবে আপনি ধাপে ধাপে কী
          কী করবেন। কোনো Join এর নিয়ম এখানে শেখানো হবে না, শুধু দেখানো হবে কোনটা
          কোন লেসনে আছে আর কেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "রসিদে খদ্দেরের নাম লেখা থাকে না, থাকে তাঁর খাতার নম্বর। নাম জানতে দোকানদার পাশের ঠিকানার খাতাটা খোলেন, সেই নম্বরের পাতাটা খোঁজেন, আর রসিদের পাশে নামটা লেখেন। Join ঠিক এই কাজটা করে, শুধু লাখো রসিদের জন্য একসাথে।",
      author: "Joins",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>সংখ্যাগুলো আছে, নামগুলো অন্য খাতায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার সকাল, সপ্তাহের প্রথম কাজের দিন। ফারুক সাহেবের সাপ্তাহিক বৈঠক।
                আগের সপ্তাহের Report গুলো ভালো হয়েছে, সংখ্যাগুলো মিলেছে, মোটের লাইনও আছে।
                কিন্তু মালিক Report এর পাশে লাল কালিতে একটা কথাই লিখে ফেরত পাঠিয়েছেন:
                নম্বর নয়, নাম চাই। তাই এবারের তালিকার প্রতিটা চাওয়ায় অন্তত দুইটা Table
                লাগবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  প্রতিটা ট্যুরের confirmed আয়, ট্যুরের নাম ধরে। আগের Report এ ছিল
                  departure_id ধরে, যেটা মালিকের কাছে অর্থহীন।
                </ListItem>
                <ListItem>
                  আগামী মাসের প্রতিটা Booking এর একটা তালিকা: Customer এর নাম, ট্যুরের
                  নাম, কোন জায়গায়, কবে রওনা, আর কোন Guide নিয়ে যাবেন।
                </ListItem>
                <ListItem>
                  যাঁরা Account খুলেছেন কিন্তু এখনো একটাও Booking করেননি, তাঁদের একটা
                  স্বাগত Email পাঠানো হবে। তাঁদের নাম চাই।
                </ListItem>
                <ListItem>
                  কোন জায়গায় এখনো কোনো ট্যুর নেই, যাতে সেখানে নতুন একটা ট্যুর বানানো
                  যায়।
                </ListItem>
                <ListItem>
                  এক পাতায় দুইটা তালিকা: কোন Guide এর হাতে এখনো কোনো ট্যুর নেই, আর কোন
                  ট্যুরের এখনো কোনো Guide নেই।
                </ListItem>
                <ListItem>
                  Website এর প্রতিটা ট্যুরের পাতায় তার পরের তারিখটা, অর্থাৎ 1 November
                  2026 বা তার পরের সবচেয়ে কাছের Departure।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শুধু Module 05 পর্যন্ত জানলে এই তালিকা কেমন যায়, ভাবুন। আপনি এক Table
                থেকে departure_id আর আয় বের করেন, আরেক Table থেকে ট্যুরের নাম, তারপর
                দুইটা Excel এ নিয়ে VLOOKUP দিয়ে মেলান। প্রতি সপ্তাহে একই কাজ হাতে হাতে।
                একদিন একটা নম্বর ভুল ঘরে বসে যায়, আর এক ট্যুরের আয় আরেক ট্যুরের নামের
                পাশে চলে যায়।
              </ContentParagraph>
              <ContentParagraph>
                এক সহকর্মী বলেন, SQL এই তো জোড়া দিতে পারে। আপনি একটা Join শিখে ফেলেন
                ইন্টারনেট দেখে, আর লিখে ফেলেন Booking এর তালিকা, Guide সহ। তালিকা
                ঠিকঠাক দেখায়, কোনো Error নেই। অথচ Farhana Akter এর Ratargul এর Booking টা
                তালিকায় নেই। কারণ সেই ট্যুরের এখনো কোনো Guide নেই, আর যে Join টা আপনি
                লিখেছেন, সেটা মিল না পাওয়া Row নিঃশব্দে ফেলে দেয়। শনিবার নৌকায় একজন
                যাত্রী কম গোনা হয়।
              </ContentParagraph>
              <ContentParagraph>
                এবার Guide দের তালিকা। কোন Guide এর হাতে ট্যুর নেই, জানতে আপনি একটা
                পরিচিত ধরন লেখেন: যাঁদের নম্বর ট্যুরের Guide তালিকায় নেই, NOT IN দিয়ে।
                উত্তর আসে শূন্য Row। আপনি ভাবেন সবাই ব্যস্ত। অথচ Nazmul Karim এর হাতে
                একটাও ট্যুর নেই। গোলমালটা NULL এর, যেটা Module 03 এ আপনি দেখেছিলেন, এবার
                অন্য চেহারায়।
              </ContentParagraph>
              <ContentParagraph>
                আর শেষ চমক আসে সিটের হিসাবে। প্রতিটা Departure এ কতগুলো সিট খালি আছে,
                তার মোট আপনি আগেই জানেন, 259টা। এবার একই হিসাব Booking এর সাথে জোড়া
                দিয়ে করেন, যাতে পাশে Booking এর সংখ্যাও দেখা যায়। মোট আসে 400। Error নেই,
                শুধু সংখ্যাটা ভুল, কারণ জোড়া দেওয়ার পর একটা Departure এর খালি সিট তার
                প্রতিটা Booking এর জন্য একবার করে গোনা হয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                তিনটা দৃশ্যের মূল কথা একই। দুইটা Table জোড়া দিলে ফলাফলে কতগুলো Row আসবে,
                কোন Row হারাবে, আর কোন Row কয়বার আসবে, এগুলো আগে থেকে বলা যায়, যদি
                নিয়মগুলো জানা থাকে। না জানলে Join কখনো Error দেয় না, শুধু চুপচাপ একটা ভুল
                উত্তর দেয়, যেটা দেখতে একদম ঠিক।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল শেষে ফারুক সাহেবের ছয়টা চাওয়ার প্রতিটা আপনি SQL এ লিখবেন, আর
                প্রতিটা Query চালানোর আগেই বলতে পারবেন কতগুলো Row আসবে আর কেন।
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
              Ratargul এর Booking কেন হারাল, NOT IN কেন শূন্য দিল, আর 259 কেন 400 হলো,
              এখানে ইচ্ছা করেই ব্যাখ্যা দেওয়া হয়নি। প্রতিটার কারণ আর সমাধান নির্দিষ্ট একটা
              লেসনে আছে, যেটা নিচের মানচিত্রে দেখবেন। মডিউল শেষে এই অংশটা আবার পড়লে
              তিনটা ভুলই আপনার কাছে স্পষ্ট লাগবে।
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
                একটা পুরনো দোকানের দুইটা খাতার কথা ভাবুন। একটা বিক্রির খাতা, যেখানে
                প্রতিটা লাইনে লেখা থাকে কোন খদ্দের নম্বর কী কিনলেন। আরেকটা ঠিকানার খাতা,
                যেখানে প্রতিটা খদ্দের নম্বরের পাশে তাঁর নাম আর ঠিকানা। নাম দুইবার লেখা হয়
                না, তাই একজন খদ্দের ঠিকানা বদলালে শুধু এক জায়গায় বদলাতে হয়। কিন্তু মাস
                শেষে কারো বিক্রির তালিকা চাইলে দোকানদারকে দুইটা খাতাই খুলতে হয়: প্রতিটা
                বিক্রির লাইনের নম্বর ধরে ঠিকানার খাতায় সেই নম্বরটা খুঁজে নামটা পাশে
                বসাতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                SQL এ এই খোঁজাটাই Join। দুইটা Table, আর একটা শর্ত যেটা বলে কোন Row এর
                সাথে কোন Row মিলবে, সাধারণত একদিকের Foreign Key আর অন্যদিকের Primary Key
                সমান হলে। কিন্তু দোকানদারকে কয়েকটা সিদ্ধান্তও নিতে হয়, আর এই মডিউলের
                প্রতিটা লেসন আসলে একটা সিদ্ধান্ত। যে খদ্দের এখনো কিছু কেনেননি, তাঁকে
                তালিকায় রাখবেন কি না। যে বিক্রির খদ্দের নম্বর ঠিকানার খাতায় নেই, সেটা কী
                হবে। প্রতিটা খদ্দেরকে প্রতিটা জিনিসের পাশে বসিয়ে একটা ছক বানাবেন কি না।
                একই খাতার দুইটা পাতা পাশাপাশি রাখবেন কি না। আর শুধু জানতে চাইবেন কেউ
                কিছু কিনেছেন কি না, কী কিনেছেন সেটা নয়।
              </ContentParagraph>
              <ContentParagraph>
                এই প্রতিটা সিদ্ধান্তের একটা নাম আছে: INNER, LEFT, FULL OUTER, CROSS, Self,
                Semi আর Anti, আর LATERAL। কোনটা কোন সিদ্ধান্ত, নিচের মানচিত্রে এক লাইনে
                লেখা আছে।
              </ContentParagraph>
              <ContentParagraph>
                একটা কথা আগে থেকে মনে রাখুন, কারণ পুরো মডিউল এর উপর দাঁড়িয়ে। প্রতিটা
                Join এর ফলাফলে কতগুলো Row আসবে, সেটা আগে থেকে বলা যায়। কোন Row মিল পেল না,
                সেটা হারাবে নাকি থাকবে, আর একদিকের একটা Row অন্যদিকের কতগুলো Row এর সাথে
                মিলবে। এই তিনটা প্রশ্নের উত্তর জানলে Join আর কখনো চমক দেয় না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে দুইটা Booking এর পূর্ণ ছবি, ছয়টা Table থেকে নাম জোড়া দিয়ে।
                নিয়মগুলো এখনো জানার দরকার নেই, শুধু Run চাপুন আর দেখুন, নম্বরের জায়গায়
                কীভাবে নাম বসে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ছয়টা Table, দুইটা Booking এর পূর্ণ ছবি"
              query={`SELECT b.booking_id,
       c.full_name  AS customer,
       t.title      AS tour,
       d.name       AS destination,
       dp.starts_on,
       g.full_name  AS guide,
       b.seats,
       b.status
FROM bookings b
JOIN customers c     ON c.customer_id = b.customer_id
JOIN departures dp   ON dp.departure_id = b.departure_id
JOIN tours t         ON t.tour_id = dp.tour_id
JOIN destinations d  ON d.destination_id = t.destination_id
LEFT JOIN guides g   ON g.guide_id = t.guide_id
WHERE b.booking_id IN (13, 21)
ORDER BY b.booking_id;`}
              caption="দুইটা Row আসবে। Booking 13: Nusrat Jahan, Saint Martin Island Escape, Saint Martin's Island, 2026-11-20, Guide Jamal Hossain। Booking 21: Farhana Akter, Ratargul Swamp Boat Day, Sylhet, 2026-11-21, আর Guide এর ঘর ফাঁকা, কারণ এই ট্যুরের এখনো কোনো Guide নেই। এবার শেষ Join এর LEFT শব্দটা মুছে আবার চালান: Booking 21 পুরো উধাও হয়ে যাবে, কোনো Error ছাড়া। কেন, সেটা লেসন ৩ আর ৭ এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিয়েছে, এই মডিউল কী যোগ করে, পরের মডিউল কী চায়"
              caption="Module 05 শিখিয়েছে অনেক Row থেকে উত্তর বের করতে, কিন্তু একটা Table এর ভেতরে, তাই দলগুলো চেনা হতো নম্বর দিয়ে। Module 06 কয়েকটা Table জোড়া দেয়, তাই একই হিসাবের পাশে এখন বসে নাম, আর যে Row এর কোনো জোড়া নেই, তাকেও খুঁজে পাওয়া যায়। Module 07 শেখাবে একটা Query কে আরেকটার ভেতরে বসাতে আর বড় Query কে নাম দেওয়া ধাপে ভাঙতে, যেটা জটিল Join কে সামলানোর পরের হাতিয়ার।"
              before={{
                tag: "Module 05",
                title: "Aggregation & Grouping",
                lines: ["অনেক Row থেকে এক উত্তর", "GROUP BY দিয়ে দলে ভাগ", "Report এর আসল হিসাব"],
              }}
              current={{
                tag: "Module 06",
                title: "Joins",
                lines: ["দুই Table এর Row জোড়া", "সংখ্যার পাশে আসল নাম", "যা নেই তা খুঁজে পাওয়া"],
              }}
              after={{
                tag: "Module 07",
                title: "Subqueries & CTEs",
                lines: ["Query এর ভেতরে Query", "WITH দিয়ে ধাপে ভাঙা", "দুই ফলাফল যোগ বিয়োগ"],
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
      title: <SectionTitle>নয়টা লেসন, দোকানদারের নয়টা সিদ্ধান্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। নিচে নয়টা লেসন আর তাদের
              প্রশ্ন। যেকোনোটায় চাপ দিলে সরাসরি সেখানে যাবেন, তবে প্রথমবার ক্রম ধরে
              যাওয়াই ভালো, কারণ প্রতিটা লেসন আগেরটার উপর একটা করে ধাপ বসায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              track="sql"
              moduleId="joins"
              questions={{
                "why-split-tables":
                  "Data কেন কয়েকটা Table এ ভাগ করে রাখা হয়, আর একটা প্রশ্নের জন্য কোন কোন Table লাগবে, সেটা Diagram দেখে কীভাবে ঠিক করবেন?",
                "inner-join":
                  "দুইটা Table এর মিলে যাওয়া Row গুলো পাশাপাশি কীভাবে বসাবেন, আর ট্যুরের নাম ধরে আয়ের হিসাব কীভাবে বের করবেন?",
                "left-right-join":
                  "যে Customer এখনো কিছু বুক করেননি, বা যে জায়গায় কোনো ট্যুর নেই, তাদের তালিকায় কীভাবে রাখবেন বা খুঁজে বের করবেন?",
                "full-outer-join":
                  "দুইটা তালিকা মেলাতে গিয়ে দুই দিকেই যে Row গুলোর জোড়া নেই, সেগুলো একসাথে কীভাবে দেখবেন?",
                "cross-join":
                  "প্রতিটা ট্যুরের পাশে প্রতিটা মাস বসিয়ে একটা ছক কীভাবে বানাবেন, আর ভুল করে 144 Row কোথা থেকে আসে?",
                "self-join":
                  "একই Table এর দুইটা Row কে পাশাপাশি কীভাবে বসাবেন, যেমন একই শহরের Customer জোড়া?",
                "multi-table-joins":
                  "পাঁচ ছয়টা Table একসাথে কীভাবে জোড়া দেবেন, আর শর্তটা ON এ না WHERE এ লিখলে উত্তর কেন বদলায়?",
                "semi-anti-join":
                  "কারো অন্তত একটা Booking আছে কি না, বা একটাও নেই কি না, এই প্রশ্নের সবচেয়ে নির্ভরযোগ্য উত্তর কীভাবে লিখবেন?",
                "lateral-join":
                  "প্রতিটা ট্যুরের পরের তারিখ বা প্রতিটা Customer এর শেষ দুইটা Booking, অর্থাৎ প্রতিটা Row এর জন্য আলাদা একটা ছোট Query, কীভাবে চালাবেন?",
              }}
              footer="নয়টা লেসন তিন ভাগে মনে রাখা সহজ। প্রথম তিনটা ভিত্তি: কেন ভাগ করা, মিল পাওয়া Row জোড়া দেওয়া, আর মিল না পাওয়া Row রেখে দেওয়া। মাঝের তিনটা বিশেষ আকার: দুই দিকের সব Row, প্রতিটার সাথে প্রতিটা, আর Table এর সাথে নিজেকে। শেষের তিনটা বাস্তব কাজের: অনেক Table এর শিকল, আছে কি নেই, আর প্রতিটা Row এর জন্য একটা ছোট Query। শেষ লেসনে পুরো মডিউলের একটা Recap আছে।"
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
                <strong>লেসন ১, Why Data Is Split Across Tables।</strong> শুরুটা প্রশ্ন
                দিয়ে, উত্তর দিয়ে নয়। সব কিছু একটা বড় Table এ রাখলে কী কী ভাঙে, সেটা Module
                01 এ একবার দেখেছিলেন, এখানে এক অংশে আবার মনে করানো হবে। তারপর আসল কাজ:
                Island Tours এর Diagram দেখে একটা প্রশ্নের জন্য কোন কোন Table লাগবে, কোন Key
                দিয়ে কোনটা কোনটাকে দেখায়, তার পরিকল্পনা। Table এর ছোট ডাকনাম, মানে Alias,
                আর ON ও USING এর সাথে প্রথম পরিচয়ও এখানে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ২, INNER JOIN।</strong> তারপর প্রথম পূর্ণ Join। প্রতিটা Booking
                এর পাশে Customer এর নাম। একদিকে একটা Row আর অন্যদিকে অনেকগুলো হলে কী হয়,
                সেটা এখানে দেখবেন: একজন Customer এর তিনটা Booking থাকলে তাঁর নাম তিনবার
                আসে। আর দেখবেন যাঁর কোনো Booking নেই, সেই Imran Kabir ফলাফল থেকে হারিয়ে
                যান। শেষে Module 05 এর সব বিদ্যা ফিরে আসে, এবার ট্যুরের নাম ধরে আয়ের
                হিসাব, যেটা আগের মডিউলে সম্ভব ছিল না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৩, LEFT and RIGHT JOIN।</strong> হারিয়ে যাওয়া Row গুলো ফিরিয়ে
                আনা। LEFT JOIN একদিকের সব Row রাখে, মিল না পেলে অন্য দিকের ঘরগুলো ফাঁকা
                রাখে। এই ফাঁকা ঘর দিয়েই খোঁজা যায় যা নেই: Booking ছাড়া Customer, ট্যুর
                ছাড়া জায়গা, Departure ছাড়া ট্যুর। আর এখানে একটা গোনার ফাঁদ খুলবে: Imran এর
                Booking গুনলে কেন 1 আসে, যেখানে আসার কথা 0।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৪, FULL OUTER JOIN।</strong> দুই দিকের সব Row একসাথে। দুইটা
                তালিকা মেলানোর কাজে এটা লাগে, যেখানে দুই দিকেই কিছু Row এর জোড়া নেই। Guide
                আর ট্যুর এর সবচেয়ে ভালো উদাহরণ: একজন Guide এর ট্যুর নেই, আর একটা ট্যুরের
                Guide নেই, দুইটাই একটা Query তে। MySQL এ এই Join নেই, তার বিকল্পও দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৫, CROSS JOIN and Accidental Cartesian Products।</strong>
                প্রতিটা Row এর সাথে প্রতিটা Row। ইচ্ছা করে করলে এটা দিয়ে Report এর ছক
                বানানো যায়, যেমন প্রতিটা ট্যুরের পাশে প্রতিটা মাস। ভুল করে করলে, মানে
                জোড়ার শর্ত লিখতে ভুলে গেলে, 9টা ট্যুর আর 16টা Departure থেকে আসে 144 Row,
                আর বড় Table এ কোটি Row।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৬, Self Joins।</strong> একই Table কে দুইটা আলাদা নামে দুইবার
                ডাকা। একই শহরের Customer জোড়া, একই জায়গার দুইটা ট্যুর, একজন Guide যিনি আরেক
                জনের আগে যোগ দিয়েছেন। জোড়াগুলো যাতে দুইবার না আসে, সেই ছোট কৌশলটাও এখানে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৭, Joining Many Tables, and ON vs WHERE।</strong> বাস্তব Query
                তে প্রায়ই চার পাঁচটা Table। Booking থেকে Customer, Departure, ট্যুর, জায়গা আর
                Guide। এখানে দুইটা বড় ফাঁদ খুলবে। একটা LEFT JOIN এর পরে সাধারণ JOIN বসালে
                আগের LEFT JOIN টা চুপচাপ নষ্ট হয়ে যায়, যেভাবে উপরে Booking 21 হারাল। আর
                জোড়ার পরে যোগফল কেন বেড়ে যায়, 259 এর জায়গায় 400, সেই রহস্যও এখানে খুলবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৮, Semi and Anti Joins with EXISTS।</strong> কখনো আপনি জানতে
                চান না কী মিলল, শুধু জানতে চান মিল আছে কি না। অন্তত একটা confirmed Booking
                আছে এমন Customer, বা একটাও ট্যুর নেই এমন Guide। EXISTS আর NOT EXISTS প্রথম
                থেকে শেখানো হবে, কারণ এর ভেতরে একটা ছোট Query বসে। আর NOT IN কেন শূন্য Row
                দিয়েছিল, তার পূর্ণ উত্তর এখানে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৯, LATERAL Joins।</strong> শেষে, এমন একটা Join যেটা বাঁ দিকের
                প্রতিটা Row দেখে তার জন্য আলাদা একটা ছোট Query চালায়। প্রতিটা ট্যুরের পরের
                তারিখ, প্রতিটা Customer এর শেষ দুইটা Booking। এই লেসনের শেষে পুরো মডিউলের
                Recap, যেখানে ফারুক সাহেবের চাওয়াগুলো থেকে একটা বড় Report পাঁচ ছয়টা Table
                জুড়ে লেখা হবে, আর তারপর Module 07 এর দরজা।
              </ContentParagraph>
              <ContentParagraph>
                একটা কথা জেনে রাখুন। Module 05 এর একটা Table এর সীমা এখানে শেষ। এই মডিউল
                থেকে প্রতিটা Query যত Table দরকার তত Table জোড়া দেবে। তবে Query এর ভেতরে
                Query, মানে Subquery, পুরোপুরি শেখানো হবে Module 07 এ। এখানে সেটা আসবে
                শুধু দুই জায়গায়, EXISTS এর ভেতরে আর LATERAL এর পরে, আর দুই জায়গাতেই একদম
                শুরু থেকে বুঝিয়ে দেওয়া হবে।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা Join লেসনে একটা Animation আছে, যেখানে আপনি নিজে দেখবেন কোন Row
                জোড়া পেল আর কোনটা একা পড়ে থাকল। তারিখ লাগলে ধরে নেওয়া হবে আজ 1 November
                2026, রবিবার।
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
      title: <SectionTitle>ORM ই তো জোড়া দেয়, তাহলে কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা আপত্তি প্রায়ই শোনা যায়: ORM এ একটা include লিখলেই সম্পর্কিত Data চলে
                আসে, অথবা Booking গুলো এনে প্রতিটার Customer আলাদা করে আনলেই হয়। ORM ভেতরে
                আসলে এই মডিউলের Join ই পাঠায়, তবু তিনটা কারণে Join নিজে বোঝা জরুরি। একটা
                একটা করে আনলে একশটা Booking এর জন্য একশ একটা Query যায়, যার নাম N+1, পুরো
                গল্প Module 17 এ। ORM INNER পাঠাচ্ছে নাকি LEFT, না জানলে জানবেন না কোন Row
                বাদ পড়ছে। আর Report এর SQL প্রায় সবসময় হাতে লেখা হয়।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল বাদ দিয়ে এগোলে খরচটা কোথায় কোথায় দিতে হয়, দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>হারিয়ে যাওয়া Row।</strong> INNER JOIN মিল না পাওয়া Row ফেলে দেয়।
                  Guide ছাড়া ট্যুরের Booking, Booking ছাড়া Customer, সবই তালিকা থেকে
                  উধাও। Error আসে না, তালিকাটা দেখতে সম্পূর্ণ লাগে।
                </ListItem>
                <ListItem>
                  <strong>দুইবার গোনা টাকা।</strong> একদিকের একটা Row অন্যদিকের অনেকগুলো
                  Row এর সাথে মিললে সেটা অনেকবার আসে। তারপর যোগ করলে একই টাকা বা একই সিট
                  বারবার যোগ হয়, 259 হয়ে যায় 400।
                </ListItem>
                <ListItem>
                  <strong>ভুল অনুপস্থিতি।</strong> যা নেই তা খুঁজতে NOT IN লিখলে, তালিকায় একটা
                  NULL থাকলেই উত্তর শূন্য। আপনি ভাবেন কেউ বাকি নেই, অথচ আছেন।
                </ListItem>
                <ListItem>
                  <strong>কোটি Row এর Query।</strong> জোড়ার শর্ত ভুলে গেলে প্রতিটা Row প্রতিটার
                  সাথে মেলে। ছোট Table এ সেটা 144 Row, বড় Table এ এমন একটা Query, যেটা
                  Server কে আটকে দেয়।
                </ListItem>
                <ListItem>
                  <strong>পরের মডিউলগুলো ঝাপসা।</strong> Module 07 এর Subquery, Module 08 এর
                  Window Function, Module 13 এর Query Plan, সবখানে ধরে নেওয়া হবে আপনি Join
                  পড়তে আর লিখতে পারেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর কয়েকটা প্রচলিত ভুল ধারণা আছে, যেগুলো এই মডিউল ভাঙবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Join করলে Row কমে।</strong> সবসময় নয়। এক দিকের একটা Row অন্য দিকের
                  অনেকগুলোর সাথে মিললে Row বাড়ে। 15 জন Customer আর তাঁদের Booking জোড়া দিলে
                  আসে 24 Row। লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>LEFT JOIN দিলেই বাঁ দিকের সব Row থাকবে।</strong> শুধু যতক্ষণ না ডান
                  দিকের কোনো Column এর শর্ত WHERE এ বসাচ্ছেন। বসালে LEFT JOIN আবার সাধারণ
                  Join এর মতো আচরণ করে। লেসন ৩ আর ৭।
                </ListItem>
                <ListItem>
                  <strong>LEFT JOIN এর পর COUNT(*) মানে মিল পাওয়া Row গোনা।</strong> না, মিল
                  না পাওয়া Row ও একটা Row, তাই Booking ছাড়া Customer এর জন্যও 1 আসে। লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>RIGHT JOIN ছাড়া কিছু Query লেখা যায় না।</strong> যায়। প্রতিটা RIGHT
                  JOIN কে Table এর ক্রম উল্টে LEFT JOIN হিসেবে লেখা যায়, আর বেশিরভাগ দল সেটাই
                  করে। লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>NOT IN আর NOT EXISTS একই জিনিস।</strong> NULL না থাকলে একই উত্তর
                  দেয়, NULL থাকলে নয়। লেসন ৮।
                </ListItem>
                <ListItem>
                  <strong>বাড়তি Row এলে DISTINCT দিলেই সমাধান।</strong> DISTINCT ভুলটা ঢেকে
                  দেয়, সারায় না, আর যোগফলের ভুল তাতে ঠিক হয় না। লেসন ৭ আর ৮।
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
              একটা Join দুইটা Table এর Row কে একটা শর্ত ধরে জোড়া দেয়। মিল পাওয়া প্রতিটা
              জোড়া ফলাফলে একটা Row হয়। মিল না পাওয়া Row INNER JOIN এ হারায়, OUTER JOIN এ
              থেকে যায় ফাঁকা ঘর নিয়ে। আর একটা Row যতগুলো Row এর সাথে মেলে, ফলাফলে ততবার
              আসে। এই তিনটা কথা মনে থাকলে যেকোনো Join চালানোর আগেই বলতে পারবেন কতগুলো Row
              আসবে।
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
              কাজে বারবার আসে। একটা বেছে নিন, দেখুন এই মডিউল না জানলে ঘটনাটা কেমন যায় আর
              জানলে কেমন যায়, আর নিচে দেখুন কোন লেসনে উত্তরটা আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "missing-booking",
                  label: "একটা Booking গায়েব",
                  situation:
                    "আগামী সপ্তাহের Guide দের জন্য Booking এর তালিকা বানালেন, প্রতিটার পাশে Guide এর নাম। Ratargul এর নৌকায় যাত্রী তিনজন, কিন্তু তালিকায় Farhana Akter এর Booking 21 নেই। কোনো Error আসেনি।",
                  without:
                    "আপনি Booking Table খুলে দেখেন 21 নম্বর ঠিকই আছে, confirmed। তারপর সন্দেহ করেন Date এর শর্তে গোলমাল, সেখানে খুঁজতে খুঁজতে বিকেল পার হয়ে যায়।",
                  withIt:
                    "আপনি জানেন guides এর সাথে সাধারণ JOIN মিল না পেলে Row ফেলে দেয়, আর Ratargul এর guide_id ফাঁকা। শেষ Join টা LEFT JOIN করেন, Booking 21 ফিরে আসে, Guide এর ঘর ফাঁকা নিয়ে।",
                  lessons: ["LEFT and RIGHT JOIN", "Joining Many Tables, and ON vs WHERE"],
                },
                {
                  id: "imran-one",
                  label: "Booking নেই, তবু গোনা 1",
                  situation:
                    "প্রতিটা Customer এর Booking সংখ্যা দেখাতে LEFT JOIN আর count(*) লিখলেন। Imran Kabir এর পাশে দেখাচ্ছে 1, অথচ তিনি একটাও বুক করেননি।",
                  without:
                    "আপনি ভাবেন Imran এর কোনো Booking কোথাও লুকিয়ে আছে, Booking Table এ তাঁর নম্বর ধরে খোঁজেন, কিছুই পান না। শেষে Report থেকে তাঁর লাইনটা হাতে মুছে দেন।",
                  withIt:
                    "আপনি জানেন LEFT JOIN Imran এর জন্য একটা Row রেখেছে, Booking এর ঘর ফাঁকা নিয়ে, আর count(*) সেই Row টাই গুনেছে। count(b.booking_id) লেখেন, ফাঁকা ঘর গোনা হয় না, আসে 0।",
                  lessons: ["LEFT and RIGHT JOIN"],
                },
                {
                  id: "not-in-empty",
                  label: "NOT IN দিল শূন্য Row",
                  situation:
                    "কোন Guide এর হাতে এখনো কোনো ট্যুর নেই, জানতে লিখলেন WHERE guide_id NOT IN (SELECT guide_id FROM tours)। উত্তর এল শূন্য Row।",
                  without:
                    "আপনি ধরে নেন সব Guide ব্যস্ত, আর নতুন ট্যুরের জন্য বাইরে থেকে একজন Guide খুঁজতে বলেন। অথচ Nazmul Karim বসে আছেন একটাও ট্যুর ছাড়া।",
                  withIt:
                    "আপনি জানেন tours এর guide_id তালিকায় একটা NULL আছে, Ratargul এর, আর NOT IN এর সামনে একটা NULL থাকলে কোনো Row সত্য হয় না। NOT EXISTS লেখেন, Nazmul Karim এর নাম আসে।",
                  lessons: ["Semi and Anti Joins with EXISTS"],
                },
                {
                  id: "fan-out",
                  label: "খালি সিট 259 নাকি 400",
                  situation:
                    "Departure গুলোর মোট খালি সিট 259। এবার একই হিসাব Booking এর সাথে জোড়া দিয়ে করলেন, যাতে পাশে Booking সংখ্যাও আসে। মোট খালি সিট দেখাল 400।",
                  without:
                    "আপনি ভাবেন কেউ Data বদলে দিয়েছেন, অথবা আগের হিসাবটাই ভুল ছিল। দুইটা সংখ্যার কোনটা মালিককে পাঠাবেন, বুঝতে পারেন না।",
                  withIt:
                    "আপনি জানেন একটা Departure এর যতগুলো Booking, জোড়ার পর তার Row ততবার আসে, তাই তার খালি সিটও ততবার যোগ হয়েছে। হিসাবটা আগে Departure ধরে করেন, তারপর জোড়া দেন, আবার আসে 259।",
                  lessons: ["Joining Many Tables, and ON vs WHERE", "INNER JOIN"],
                },
                {
                  id: "cartesian",
                  label: "360 Row কোথা থেকে",
                  situation:
                    "পুরনো একটা Query তে FROM bookings, customers লেখা, কিন্তু কেউ WHERE এর জোড়ার শর্তটা মুছে ফেলেছেন। 24টা Booking এর জায়গায় ফলাফলে 360 Row।",
                  without:
                    "আপনি ভাবেন Booking Table এ হঠাৎ অনেক Data এসেছে, অথবা কোনো Bug Row গুলো নকল করছে। Production Database এ সেই খোঁজ চালাতে গিয়ে আরও ধীর হয়ে যায় সব।",
                  withIt:
                    "আপনি এক নজরে চেনেন: 24 গুণ 15 সমান 360, প্রতিটা Booking প্রতিটা Customer এর সাথে জোড়া পেয়েছে। জোড়ার শর্তটা ফিরিয়ে দেন, আর পুরনো কমা দিয়ে লেখা ধরনটা বদলে JOIN ... ON লেখেন।",
                  lessons: ["CROSS JOIN and Accidental Cartesian Products"],
                },
                {
                  id: "next-departure",
                  label: "প্রতিটা ট্যুরের পরের তারিখ",
                  situation:
                    "Website এর প্রতিটা ট্যুরের পাতায় তার পরের Departure এর তারিখ দেখাতে হবে, 1 November 2026 থেকে। ট্যুর 9টা, কিন্তু একটার কোনো Departure নেই।",
                  without:
                    "আপনি সব Departure App এ এনে ট্যুর ধরে সাজিয়ে প্রথমটা বাছেন। প্রতিটা Page Load এ পুরো Departure Table আসে, আর Family Package এর পাতায় Error।",
                  withIt:
                    "আপনি LEFT JOIN LATERAL লেখেন, প্রতিটা ট্যুরের জন্য ছোট একটা Query তার পরের তারিখ আনে। 9টা Row আসে, আর Cox's Bazar Family Package এর ঘর ফাঁকা থাকে, পাতায় লেখা যায় শীঘ্রই আসছে।",
                  lessons: ["LATERAL Joins"],
                },
              ]}
              footer="প্রতিটা মুহূর্তে ভুলটা Error হিসেবে আসেনি। Join এর ভুল প্রায় সবসময় নিঃশব্দ: Row হারায়, বা বেড়ে যায়, বা শূন্য আসে। এই মডিউলের কাজ চালানোর আগেই সেই ভুলগুলো চিনতে শেখানো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Join আপনার কাজের দিনে যেখানে যেখানে দেখা দেবে, তার একটা তালিকা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা তালিকার Screen।</strong> Booking এর তালিকায় Customer এর নাম,
                  Order এর তালিকায় পণ্যের নাম, Ticket এর তালিকায় কর্মীর নাম। যেকোনো তালিকা
                  যেখানে নম্বরের জায়গায় নাম দেখা যায়, তার পেছনে একটা Join।
                </ListItem>
                <ListItem>
                  <strong>Report আর Dashboard।</strong> ট্যুর ধরে আয়, শহর ধরে Customer, Guide
                  ধরে Booking। Module 05 এর GROUP BY এর সাথে Join মিলিয়েই প্রায় প্রতিটা
                  ব্যবসার Report।
                </ListItem>
                <ListItem>
                  <strong>ORM আর API।</strong> include, with, relations, populate, নাম যাই হোক,
                  ভেতরে যায় Join। ORM এর তৈরি SQL দেখে কোন ধরনের Join গেল সেটা বুঝতে পারা
                  Backend Engineer এর রোজকার দক্ষতা।
                </ListItem>
                <ListItem>
                  <strong>Data পরিষ্কার রাখা।</strong> কোন Payment এর Booking নেই, কোন Booking
                  এর Customer মুছে গেছে, দুইটা System এর তালিকা মেলে কি না। এই প্রতিটা খোঁজ
                  একটা Anti Join বা FULL OUTER JOIN।
                </ListItem>
                <ListItem>
                  <strong>Interview।</strong> INNER আর LEFT এর পার্থক্য, কোনো Order দেননি এমন
                  Customer, প্রতিটা বিভাগের সবচেয়ে বেশি বেতন, একই শহরের জোড়া। Backend আর Data
                  দুই রকম Interview তেই সবচেয়ে বেশি আসা SQL প্রশ্ন।
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
      title: <SectionTitle>Island Tours এ Join কোথায় কোথায় চলে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Sample Database টা ইচ্ছা করেই এমনভাবে বানানো, যাতে এই
                মডিউলে এসে প্রতিটা অদ্ভুত Row একটা Join এর শিক্ষা হয়ে ওঠে। কয়েকটা জায়গা
                দেখুন, যেখানে এই মডিউলের Join গুলো চলে। এগুলো আপনার নিজের Project এও প্রায়
                হুবহু আসবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Booking Confirmation এর পাতা।</strong> একটা Booking এর সাথে Customer,
                  Departure, ট্যুর, জায়গা আর Guide, ছয়টা Table। Guide এর জোড়া LEFT JOIN, নইলে
                  Ratargul এর যাত্রীরা পাতাই দেখবেন না। লেসন ২ আর ৭।
                </ListItem>
                <ListItem>
                  <strong>ট্যুর ধরে আয়।</strong> Booking থেকে Departure, Departure থেকে ট্যুর,
                  তারপর GROUP BY ট্যুরের নাম। সাতটা ট্যুরে confirmed আয় আছে, সবচেয়ে বেশি Saint
                  Martin Island Escape এ, 125000.00 টাকা। লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>স্বাগত Email।</strong> Account আছে কিন্তু Booking নেই, এমন Customer:
                  এখন একজন, Imran Kabir। LEFT JOIN আর ফাঁকা ঘর, অথবা NOT EXISTS। লেসন ৩ আর ৮।
                </ListItem>
                <ListItem>
                  <strong>নতুন ট্যুরের পরিকল্পনা।</strong> কোন জায়গায় কোনো ট্যুর নেই: Kuakata।
                  কোন ট্যুরের কোনো Departure নেই: Cox&apos;s Bazar Family Package। লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>Guide বণ্টন।</strong> Guide আর ট্যুর এক তালিকায়, দুই দিকের ফাঁক সহ:
                  Nazmul Karim এর ট্যুর নেই, Ratargul Swamp Boat Day এর Guide নেই। FULL OUTER
                  JOIN এ মোট 10 Row। লেসন ৪।
                </ListItem>
                <ListItem>
                  <strong>ট্যুরের পাতার পরের তারিখ।</strong> প্রতিটা ট্যুরের জন্য 1 November
                  2026 বা তার পরের প্রথম Departure। আটটা ট্যুরের তারিখ আছে, Family Package এর
                  নেই। লেসন ৯।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে Module 05 এর একটা অসমাপ্ত কাজ শেষ হচ্ছে। আগের মডিউলে আয়ের
                হিসাব ছিল departure_id ধরে, কারণ ট্যুরের নাম অন্য Table এ। এবার তিনটা Table
                জোড়া দিয়ে একই হিসাব ট্যুরের নাম ধরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ট্যুরের নাম ধরে confirmed আয়"
              query={`SELECT t.title,
       count(*)         AS confirmed_bookings,
       sum(b.total_bdt) AS revenue_bdt
FROM bookings b
JOIN departures dp ON dp.departure_id = b.departure_id
JOIN tours t       ON t.tour_id = dp.tour_id
WHERE b.status = 'confirmed'
GROUP BY t.title
ORDER BY revenue_bdt DESC;`}
              caption="সাতটা Row আসবে। প্রথমে Saint Martin Island Escape, 5টা Booking আর 125000.00 টাকা, তারপর Cox's Bazar Beach Weekend 93500.00 আর Sundarbans Mangrove Cruise 90000.00। সাতটা আয় যোগ করলে আসে 423600.00, Module 05 এর সেই আসল আয়, এবার নাম সহ। যে দুইটা ট্যুর তালিকায় নেই, তাদের কোনো confirmed Booking নেই। তাদেরও শূন্য আয় সহ দেখাতে চাইলে কোন Join লাগবে, সেটা লেসন ৩ এ।"
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
                  প্রতিটা Query চালানোর আগে মনে মনে অনুমান করবেন কতগুলো Row আসবে, তারপর
                  চালিয়ে মিলিয়ে দেখবেন। এই মডিউলে এটাই সবচেয়ে বড় অভ্যাস।
                </ListItem>
                <ListItem>
                  প্রতিটা লেসনের Animation এ নিজে Row গুলো জোড়া দেবেন, আর দেখবেন কোনটা একা
                  পড়ে থাকে।
                </ListItem>
                <ListItem>
                  /sql/database পাতার Diagram টা পাশে খোলা রাখবেন, আর প্রতিটা প্রশ্নের জন্য
                  আগে Diagram এ পথটা আঙুল দিয়ে খুঁজবেন: কোন Table থেকে কোন Key ধরে কোথায়।
                </ListItem>
                <ListItem>
                  লেসন ৩, ৭ আর ৮ এ তিনটা নিঃশব্দ ভুল ইচ্ছা করে তৈরি করবেন, হারিয়ে যাওয়া
                  Row, দুইবার গোনা যোগফল আর শূন্য দেওয়া NOT IN, তারপর নিজের ভাষায় লিখে
                  রাখবেন কেন হলো।
                </ListItem>
                <ListItem>
                  শেষ লেসনের Recap এ ফারুক সাহেবের চাওয়াগুলো থেকে একটা বড় Report পাঁচ ছয়টা
                  Table জুড়ে লিখবেন, আর Notebook এ প্রতিটা Join এর পাশে লিখে রাখবেন কেন সেটা
                  INNER আর কেন LEFT।
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
                "দুইটা Table আলাদা করে বের করে Excel এ VLOOKUP দিয়ে মেলান",
                "Report এ নামের জায়গায় departure_id আর customer_id দেখান",
                "একটা Join লিখে ধরে নেন সব Row এসেছে, কোনটা হারাল খেয়াল করেন না",
                "Join এর পর যোগফল বেড়ে গেলে কারণ খুঁজে পান না",
                "যা নেই তা খুঁজতে NOT IN লেখেন, আর শূন্য Row কে সত্যি ধরে নেন",
                "বাড়তি Row এলে DISTINCT বসিয়ে দেন",
                "প্রতিটা Row এর জন্য আলাদা Query App থেকে পাঠান",
              ]}
              after={[
                "Diagram দেখে প্রশ্নের জন্য কোন Table লাগবে আর কোন Key দিয়ে জোড়া, আগে ঠিক করেন",
                "INNER JOIN দিয়ে নম্বরের পাশে নাম বসান, আর ট্যুরের নাম ধরে হিসাব করেন",
                "LEFT JOIN দিয়ে মিল না পাওয়া Row রাখেন, আর ফাঁকা ঘর দিয়ে যা নেই তা খোঁজেন",
                "Join চালানোর আগেই বলতে পারেন কতগুলো Row আসবে আর কোনটা কয়বার",
                "জোড়ার পরের দুইবার গোনা চিনে হিসাবটা সঠিক জায়গায় করেন",
                "আছে কি নেই জানতে EXISTS আর NOT EXISTS লেখেন, NULL এর ফাঁদ এড়িয়ে",
                "প্রতিটা Row এর জন্য ছোট Query দরকার হলে LATERAL দিয়ে একটা Query তেই সারেন",
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
                এই মডিউলের মানদণ্ড হলো একটা Join এর ফলাফল আগে থেকে বলে দিতে পারা। কেউ
                আপনাকে একটা Join দেখালে আপনি বলবেন, এখানে Customer 15 জন আর Booking 24টা,
                INNER JOIN দিলে আসবে 24 Row আর Imran বাদ পড়বেন, LEFT JOIN দিলে 25 Row আর
                Imran এর লাইনে Booking এর ঘর ফাঁকা। আর এই যোগফলটা ভুল, কারণ জোড়ার পরে একই
                Departure এর সিট কয়েকবার যোগ হয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                এটা পারলে আপনি Table গুলোকে একটা জালের মতো দেখতে শিখেছেন, আর পাশের কাউকে
                বোঝানোর আসল জিনিস সেটাই।
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
                <strong>আগে যা লাগবে।</strong> Module 01 এর লেসন ৪, যেখানে Primary Key আর
                Foreign Key প্রথম দেখেছিলেন, কারণ প্রতিটা Join সেই Key ধরেই চলে। Module 03
                এর NULL আর DISTINCT, কারণ ফাঁকা ঘর আর বাড়তি Row এই মডিউলের দুইটা প্রধান
                চরিত্র। আর Module 05 এর GROUP BY আর COUNT, কারণ Join এর পর প্রায় প্রতিটা
                Report এ সেগুলো ফিরে আসে। Module 02 শেষ করা থাকলে Lab এর Drill গুলো নিজের
                psql এ চালাতে পারবেন, না থাকলেও লেসনের বক্সগুলো Browser এই চলে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>সময়।</strong> পুরো মডিউলের জন্য পাঁচ ছয় দিন ধরে রাখুন। নয়টা লেসন
                পড়তে মোট প্রায় চার থেকে সাড়ে পাঁচ ঘণ্টা লাগে। লেসন ২, ৩ আর ৭ এর জন্য একটু
                বেশি সময় রাখুন। INNER আর LEFT এর পার্থক্য আর অনেক Table এর শিকল পোক্ত
                হলে বাকি লেসনগুলো অনেক সহজে আসে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ক্রম।</strong> লেসন ১ থেকে ৩ অবশ্যই ক্রম ধরে পড়ুন, কারণ পুরো মডিউলের
                ভিত্তি সেখানে। লেসন ৪ থেকে ৬ নিজেদের মধ্যে মোটামুটি স্বাধীন। লেসন ৭ আর ৮ আগের
                সবগুলো ধরে নেয়, আর লেসন ৯ এ পুরো মডিউলের Recap, তাই সেটা শেষে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Row গোনার অভ্যাস।</strong> এই মডিউলের সবচেয়ে বড় অনুশীলন একটাই:
                চালানোর আগে অনুমান করা কতগুলো Row আসবে। Customer 15, Booking 24, ট্যুর 9,
                Departure 16, Guide 5, জায়গা 7, এই কয়েকটা সংখ্যা মনে রাখুন। তারপর প্রতিটা
                Join এর আগে ভাবুন: মিল না পাওয়া Row হারাবে নাকি থাকবে, আর একটা Row কতগুলোর
                সাথে মিলবে। অনুমান না মিললে সেখানেই শেখার আসল জিনিসটা লুকিয়ে আছে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Query বক্স আর অনুশীলন।</strong> প্রতিটা বক্স আগে যেমন আছে তেমন
                চালান, তারপর একটা জিনিস বদলান: JOIN কে LEFT JOIN, একটা শর্ত WHERE থেকে ON এ।
                অনুশীলনের বক্সে আগে নিজে অন্তত দুইবার চেষ্টা করুন, তারপর Hint, আর সবার
                শেষে Solution। আপনার Query সমাধানের মতো দেখতে না হলেও চলবে, ফলাফল এক হলেই
                সঠিক। একই উত্তর Join দিয়েও আসে, EXISTS দিয়েও আসে, দুইটাই ঠিক।
              </ContentParagraph>
              <ContentParagraph>
                <strong>MySQL এর ভিডিও দেখছেন?</strong> ভিডিওর INNER, LEFT আর RIGHT join এর
                অংশটা এই মডিউলের লেসন ২ আর ৩ এর সাথে মেলে, আর সেখানে লেখার ধরন দুই Database
                এ প্রায় হুবহু এক। আলাদা জায়গাগুলোও যাচাই করা: MySQL 8.4 এ FULL OUTER JOIN
                নেই, লিখলে Syntax Error আসে, তাই লেসন ৪ এ তার বিকল্প দেখানো হবে। LATERAL
                MySQL 8.4 এ চলে, প্রতিটা ট্যুরের পরের তারিখের Query টা সেখানেও একই উত্তর দেয়।
                আর NOT IN এর NULL ফাঁদ MySQL এও হুবহু একই, শূন্য Row।
              </ContentParagraph>
              <ContentParagraph>
                <strong>আটকে গেলে।</strong> Row হারালে দেখুন কোন Join টা INNER, আর তার কোন
                দিকে মিল নেই। Row বাড়লে দেখুন কোন Join এ এক দিকের একটা Row অন্য দিকের অনেক
                Row এর সাথে মিলছে। আর হঠাৎ অনেক বেশি Row এলে দেখুন কোনো Join এর ON শর্ত
                বাদ পড়েছে কি না। প্রায় প্রতিটা Join এর ভুল এই তিনটার একটা।
                কোনটা, সেটা ধরতে প্রথম Table টা একা চালান, তারপর একটা করে Join যোগ করে
                প্রতিবার Row গুনুন। Island Tours এর
                Diagram এর পাতাটা, /sql/database, প্রতিটা Key এর পথ দেখায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>পরের ধাপ।</strong> এখান থেকে সোজা চলে যান প্রথম লেসনে,{" "}
                <strong>Why Data Is Split Across Tables</strong>, যেখানে আপনি Diagram দেখে
                প্রথমবার একটা প্রশ্নের পথ আঁকবেন, আর দেখবেন দুইটা Table কীভাবে একটা Key দিয়ে
                একে অপরকে চেনে।
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
        "Why Data Is Split Across Tables",
        "Data ভাগ করা থাকে যাতে প্রতিটা তথ্য এক জায়গায় থাকে, আর Key এর পথ ধরে Diagram এ আগে ঠিক করতে হয় একটা প্রশ্নের জন্য কোন Table গুলো লাগবে",
      ],
      [
        "INNER JOIN",
        "INNER JOIN শর্ত মেলা প্রতিটা জোড়ার জন্য একটা Row দেয়, মিল না পাওয়া Row ফেলে দেয়, আর এক দিকের একটা Row যতবার মেলে ততবার আসে",
      ],
      [
        "LEFT and RIGHT JOIN",
        "LEFT JOIN বাঁ দিকের সব Row রাখে, মিল না পেলে ডান দিকের ঘর ফাঁকা রাখে, আর সেই ফাঁকা ঘর দিয়েই যা নেই তা খোঁজা যায়",
      ],
      [
        "FULL OUTER JOIN",
        "FULL OUTER JOIN দুই দিকের সব Row রাখে, তাই দুইটা তালিকা মেলাতে গিয়ে দুই দিকের ফাঁক একসাথে দেখা যায়",
      ],
      [
        "CROSS JOIN and Accidental Cartesian Products",
        "CROSS JOIN প্রতিটা Row কে প্রতিটার সাথে জোড়ে, ইচ্ছা করে করলে ছক বানায়, আর শর্ত ভুলে গেলে Row গুণ হয়ে বিশাল হয়",
      ],
      [
        "Self Joins",
        "একই Table কে দুইটা আলাদা Alias এ দুইবার ডেকে তার দুইটা Row পাশাপাশি বসানো যায়",
      ],
      [
        "Joining Many Tables, and ON vs WHERE",
        "অনেক Table এর শিকলে একটা পরের INNER JOIN আগের LEFT JOIN নষ্ট করতে পারে, OUTER JOIN এর শর্ত ON এ না WHERE এ সেটা উত্তর বদলায়, আর জোড়ার পরের যোগফল দুইবার গুনতে পারে",
      ],
      [
        "Semi and Anti Joins with EXISTS",
        "আছে কি না জানতে EXISTS, নেই কি না জানতে NOT EXISTS, আর NOT IN এর তালিকায় একটা NULL থাকলে উত্তর সবসময় শূন্য",
      ],
      [
        "LATERAL Joins",
        "LATERAL বাঁ দিকের প্রতিটা Row দেখে তার জন্য আলাদা একটা ছোট Query চালায়, যেমন প্রতিটা ট্যুরের পরের তারিখ",
      ],
    ],
  },
};
