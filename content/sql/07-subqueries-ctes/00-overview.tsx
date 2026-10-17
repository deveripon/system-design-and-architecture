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

export const subqueriesCtesOverviewContent: TopicData = {
  id: "subqueries-ctes-overview",
  introduction: {
    badge: "MODULE 07 · OVERVIEW",
    title: <SectionTitle>বড় প্রশ্ন, ছোট ছোট ধাপ</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 06 শেষে আপনি যেকোনো কয়েকটা Table জোড়া দিতে পারেন, আর জানেন কোন Row
          হারাবে আর কোন Row দুইবার আসবে। নামের পাশে সংখ্যা বসানো এখন আপনার কাছে সহজ। কিন্তু
          ব্যবসার আসল প্রশ্নগুলো প্রায়ই এক ধাপের হয় না। গড়ের চেয়ে দামি ট্যুর কোনগুলো, এই
          প্রশ্নের ভেতরে আরেকটা প্রশ্ন লুকিয়ে আছে: গড়টা কত। প্রতিটা Customer গড়ে কত খরচ
          করেন, এর ভেতরেও দুইটা ধাপ: আগে প্রত্যেকের মোট, তারপর সেই মোটগুলোর গড়।
        </ContentParagraph>
        <ContentParagraph>
          এই মডিউল শেখায় SQL এ এমন প্রশ্নগুলো ধাপে ধাপে বানাতে। একটা Query এর উত্তরকে
          আরেকটা Query এর ভেতরে বসানো, যার নাম Subquery। লম্বা Query কে নাম দেওয়া ছোট
          ধাপে ভাঙা, যার নাম CTE। এমন একটা ধাপ, যেটা নিজের আগের উত্তর থেকে পরেরটা বানায়,
          যার নাম Recursive CTE। আর দুইটা তৈরি তালিকাকে যোগ, মিল বা বিয়োগ করা, যাদের বলে
          Set Operation। সত্যিকারের কাজের লম্বা Report গুলো ঠিক এই হাতিয়ারগুলো দিয়েই লেখা
          হয়, আর এগুলো জানলেই সেগুলো পড়া যায়।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা লেসন নয়, মডিউলের মানচিত্র। এখানে জানবেন মডিউলটা কেন দরকার, সাতটা
          লেসনে কী কী শিখবেন, না শিখলে কোথায় Error আসে বা কোথায় চুপচাপ ভুল সংখ্যা বেরোয়,
          কাজের জায়গায় এগুলো কোথায় লাগে, আর বাস্তবে আপনি ধাপে ধাপে কী কী করবেন। কোনো
          নিয়ম এখানে শেখানো হবে না, শুধু দেখানো হবে কোনটা কোন লেসনে আছে আর কেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "শিক্ষক বোর্ডে বড় অঙ্কটা একবারে করেন না। আগে এক কোণে লেখেন: ক, গড় দাম। তারপর লেখেন: খ, যেগুলো ক এর চেয়ে বেশি। শেষ লাইনে শুধু ক আর খ এর নাম। ছাত্ররা প্রতিটা ধাপ আলাদা করে মিলিয়ে নিতে পারে, আর কোথায় ভুল, এক নজরে চোখে পড়ে।",
      author: "Subqueries & CTEs",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>প্রশ্নের ভেতরে আরেকটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026, সপ্তাহের প্রথম কাজের দিন। ফারুক সাহেবের সাপ্তাহিক
                বৈঠক। আগের সপ্তাহের Report গুলোয় এবার নামগুলো ঠিকঠাক এসেছে, মালিক খুশি। তাই
                এবার তিনি একটু বড় প্রশ্ন পাঠিয়েছেন। খেয়াল করলে দেখবেন, প্রতিটা প্রশ্নের
                ভেতরে আরেকটা ছোট প্রশ্ন লুকিয়ে আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  কোন ট্যুরগুলোর দাম সব ট্যুরের গড় দামের চেয়ে বেশি? ভেতরের প্রশ্ন: গড় দামটা
                  কত।
                </ListItem>
                <ListItem>
                  একজন Customer গড়ে মোট কত টাকার Booking করেন? ভেতরের প্রশ্ন: প্রত্যেকের
                  মোট কত।
                </ListItem>
                <ListItem>
                  কোন Guide এর হাতে এখনো কোনো ট্যুর নেই? ভেতরের প্রশ্ন: কোন কোন Guide এর
                  হাতে ট্যুর আছে।
                </ListItem>
                <ListItem>
                  প্রত্যেক Customer এর সবশেষ Booking কোনটা? ভেতরের প্রশ্ন: এই Customer এর
                  সবশেষ সময়টা কখন, প্রতিটা Customer এর জন্য আলাদা করে।
                </ListItem>
                <ListItem>
                  ডিসেম্বরের ৩১টা দিনের একটা তালিকা, প্রতিটা দিনের পাশে সেদিন কোনো যাত্রা আছে
                  কি না। ভেতরের প্রশ্ন: ডিসেম্বরের সব তারিখ, যেগুলোর বেশিরভাগ কোনো Table এ নেই।
                </ListItem>
                <ListItem>
                  সব Customer আর সব Guide এর একটা ফোনের তালিকা, SMS পাঠানোর জন্য। ভেতরের
                  প্রশ্ন: দুইটা আলাদা তালিকা এক করা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শুধু Module 06 পর্যন্ত জানলে এই তালিকা কেমন যায়, ভাবুন। গড় দামটা আপনি আগে
                একটা Query দিয়ে বের করেন, 13477.78, তারপর সংখ্যাটা হাতে কপি করে দ্বিতীয়
                Query তে বসান। পরের মাসে একটা ট্যুরের দাম বদলায়, গড়ও বদলায়, কিন্তু আপনার
                দ্বিতীয় Query তে পুরনো সংখ্যাটাই বসে থাকে। Report চলতে থাকে, শুধু ভুল উত্তর
                দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                এক সহকর্মী বলেন, Query এর ভেতরেই আরেকটা Query লেখা যায়। আপনি চেষ্টা করেন:
                Saint Martin এর ট্যুরের চেয়ে দামি ট্যুরগুলো, ভেতরের Query দিয়ে Saint Martin
                এর ট্যুরের দাম এনে। চালাতেই লাল লেখা আসে: more than one row returned by a
                subquery used as an expression। আপনি বুঝতে পারেন না কোন Row এর কথা বলছে।
              </ContentParagraph>
              <ContentParagraph>
                এবার গড় খরচ। আপনি Booking এর মোট টাকার গড় নেন, আসে 24679.17। হিসাব বিভাগ
                বলে সংখ্যাটা 42307.14। দুইজনেই নিজের Query দেখিয়ে বলেন আমারটা ঠিক। আসলে দুইটা
                সংখ্যাই সঠিক, শুধু দুইটা আলাদা প্রশ্নের উত্তর। একটা প্রতিটা Booking এর গড়, আরেকটা
                প্রতিটা Customer এর মোটের গড়। কোনটা মালিক চেয়েছেন, সেটা কেউ খেয়াল করেনি।
              </ContentParagraph>
              <ContentParagraph>
                আর শেষ চমকটা টাকার যোগফলে। bKash আর Nagad এর paid Payment এক তালিকায়, Card আর
                Bank এর আরেক তালিকায়, দুইটা UNION দিয়ে জুড়ে যোগ করেন। আসে 296600.00। Payment
                এর পাতায় মোট দেখাচ্ছে 423600.00। কোনো Error নেই, কোনো Payment মোছা হয়নি। অথচ এক
                লাখ সাতাশ হাজার টাকা হিসাব থেকে উধাও।
              </ContentParagraph>
              <ContentParagraph>
                তিনটা দৃশ্যের মূল কথা একই। Query এর ভেতরে Query লেখা যায়, কিন্তু ভেতরের Query টা
                কোন আকারের উত্তর ফেরত দিচ্ছে, একটা মান, একটা তালিকা, নাকি পুরো একটা Table, আর
                দুইটা ফলাফল জোড়ার সময় একই রকম Row এর কী হয়, এগুলো না জানলে Query কখনো Error
                দেয়, আর কখনো চুপচাপ একটা ভুল সংখ্যা দেয়।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল শেষে ফারুক সাহেবের ছয়টা প্রশ্নের প্রতিটা আপনি একটাই Query তে লিখবেন, আর
                প্রতিটা ধাপের উত্তর আলাদা করে চালিয়ে মিলিয়ে নিতে পারবেন।
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
              Error টা কেন এল, দুই গড় কেন আলাদা, আর UNION এ টাকা কোথায় গেল, এখানে ইচ্ছা করেই
              ব্যাখ্যা দেওয়া হয়নি। প্রতিটার কারণ আর সমাধান নির্দিষ্ট একটা লেসনে আছে, যেটা নিচের
              মানচিত্রে দেখবেন। মডিউল শেষে এই অংশটা আবার পড়লে তিনটা দৃশ্যই আপনার কাছে স্পষ্ট
              লাগবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "big-picture",
      subHeader: { index: "002", title: "The Big Picture" },
      title: <SectionTitle>বোর্ডের এক কোণে রাফ হিসাব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অঙ্কের ক্লাসটা মনে করুন। শিক্ষক একটা বড় অঙ্ক বোর্ডে একবারে করেন না। এক কোণে
                প্রথম ধাপটা করে উত্তরের পাশে একটা নাম দেন, ক। তারপর পরের ধাপে ক এর উত্তরটা
                ব্যবহার করেন, আর সেটার নাম দেন খ। শেষ লাইনে থাকে শুধু ক আর খ। কোনো ছাত্রের
                উত্তর না মিললে তিনি প্রতিটা ধাপ আলাদা করে মেলান, আর ভুলটা এক নজরে ধরা পড়ে। এই
                মডিউলের চারটা ধারণা এই ক্লাসেরই চারটা অভ্যাস।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Subquery:</strong> একটা ছোট অঙ্কের উত্তর সরাসরি বড় অঙ্কের ভেতরে
                  বসিয়ে দেওয়া। ভেতরের উত্তরটা হতে পারে একটা মান, যেমন গড় দাম, হতে পারে একটা
                  তালিকা, যেমন ট্যুর আছে এমন Guide দের নম্বর, আবার হতে পারে পুরো একটা Table।
                </ListItem>
                <ListItem>
                  <strong>CTE:</strong> প্রতিটা ধাপ আগে নাম দিয়ে লিখে রাখা, ক, খ, গ, তারপর শেষ
                  লাইনে নাম ধরে ব্যবহার করা। SQL এ এটা লেখা হয় WITH দিয়ে, আর পড়া যায় উপর থেকে
                  নিচে, গল্পের মতো।
                </ListItem>
                <ListItem>
                  <strong>Recursive CTE:</strong> এমন একটা ধাপ, যেটা নিজের আগের উত্তর থেকে পরেরটা
                  বানায়, যতক্ষণ না থামার শর্ত মেলে। ১ ডিসেম্বর থেকে পরের দিন, তার পরের দিন,
                  ৩১ তারিখে থামা। অথবা একটা পরিবারের গাছে বাবা থেকে ছেলে, ছেলে থেকে নাতি।
                </ListItem>
                <ListItem>
                  <strong>Set Operation:</strong> দুইটা তৈরি তালিকাকে যোগ করা, দুইটায় যা মিলে
                  শুধু সেটা রাখা, বা একটা থেকে আরেকটা বাদ দেওয়া। স্কুলের সেটের অঙ্কের মতো,
                  শুধু এখানে সেটের সদস্য হলো Query এর Row।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                চারটার পেছনে একটাই নীতি: <strong>একটা Query এর উত্তরও একটা Table</strong>। আর
                Table যেখানে বসতে পারে, সেখানে একটা Query এর উত্তরও বসতে পারে। তাই এই মডিউলে
                প্রতিটা ভেতরের Query লেখার আগে একটা প্রশ্ন করবেন: এর উত্তরের আকার কেমন, একটা
                মান, এক Column এর একটা তালিকা, নাকি অনেক Column এর পুরো Table। আকার ঠিক থাকলে
                Query চলে, আকার ভুল হলে হয় Error আসে, নয়তো উত্তর চুপচাপ ভুল হয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে প্রথম প্রশ্নটার উত্তর, একটা Query তেই। গড় দামটা আর হাতে কপি করতে হয়
                না, ভেতরের Query টা প্রতিবার নতুন করে হিসাব করে। SQL এর নিয়ম এখনই জানার দরকার
                নেই, শুধু Run চাপুন আর দেখুন। তারপর বন্ধনীর ভেতরের লাইনটা আলাদা করে চালিয়ে
                দেখুন, সেটা একা কী ফেরত দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="গড়ের চেয়ে দামি ট্যুর"
              query={`SELECT title, price_bdt
FROM tours
WHERE price_bdt > (SELECT avg(price_bdt) FROM tours)
ORDER BY price_bdt DESC;`}
              caption="চারটা ট্যুর আসবে: Saint Martin Luxury Stay 32000.00, Sundarbans Mangrove Cruise 18000.00, Cox's Bazar Family Package 15500.00 আর Bandarban Hill Trek 14000.00। বন্ধনীর ভেতরের SELECT avg(price_bdt) FROM tours আলাদা চালালে একটাই মান আসে, 13477.777777777778, আর বাইরের Query সেই মানের সাথে প্রতিটা ট্যুরের দাম তুলনা করে। এই ধরনটা পুরোপুরি শেখাবে লেসন ১।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিয়েছে, এই মডিউল কী যোগ করে, পরের মডিউল কী চায়"
              caption="Module 06 শিখিয়েছে কয়েকটা Table জোড়া দিয়ে নামের পাশে সংখ্যা বসাতে আর যা নেই তা খুঁজে পেতে। Module 07 সেই Query গুলোকে জুড়ে বড় প্রশ্ন বানায়: একটা Query এর উত্তর আরেকটার ভেতরে, নাম দেওয়া ধাপে লম্বা Report, আর দুইটা ফলাফলের যোগ বিয়োগ। Module 08 শেখাবে Window Function, যেটা এই মডিউলের অনেক Subquery কে আরও ছোট আর দ্রুত করে, Row না হারিয়েই।"
              before={{
                tag: "Module 06",
                title: "Joins",
                lines: ["দুই Table এর Row জোড়া", "সংখ্যার পাশে আসল নাম", "যা নেই তা খুঁজে পাওয়া"],
              }}
              current={{
                tag: "Module 07",
                title: "Subqueries & CTEs",
                lines: ["Query এর ভেতরে Query", "WITH দিয়ে ধাপে ভাঙা", "দুই ফলাফল যোগ বিয়োগ"],
              }}
              after={{
                tag: "Module 08",
                title: "Window Functions",
                lines: ["Row না হারিয়ে হিসাব", "র‍্যাংক আর চলমান যোগফল", "আগের Row এর সাথে তুলনা"],
              }}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              DevOps ট্র্যাক বা কোনো Backend কোডে একটা লম্বা SQL Report দেখে যদি কখনো মনে হয়ে
              থাকে এটা পড়া অসম্ভব, এই মডিউলের পর সেটা আর মনে হবে না। প্রায় প্রতিটা লম্বা Query
              আসলে কয়েকটা ছোট Query এর শিকল, আর প্রতিটা ধাপ আলাদা করে চালিয়ে দেখা যায় সে কী
              ফেরত দেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "what-you-will-learn",
      subHeader: { index: "003", title: "What You Will Learn" },
      title: <SectionTitle>সাতটা লেসন, ভেতরের Query এর চার জায়গা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। নিচে সাতটা লেসন আর তাদের প্রশ্ন।
              যেকোনোটায় চাপ দিলে সরাসরি সেখানে যাবেন, তবে প্রথমবার ক্রম ধরে যাওয়াই ভালো, কারণ
              প্রতিটা লেসন আগেরটার উপর একটা করে ধাপ বসায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              track="sql"
              moduleId="subqueries-ctes"
              questions={{
                "scalar-subqueries":
                  "গড়ের চেয়ে দামি ট্যুর বের করতে গড়টা Query এর ভেতরেই কীভাবে হিসাব করবেন, আর ভেতরের Query একটার বেশি Row দিলে Error কেন আসে?",
                "in-exists-any-all":
                  "আরেকটা Query এর তালিকার সাথে মিলিয়ে কীভাবে ছাঁকবেন, আর NOT IN এর তালিকায় একটা NULL থাকলে উত্তর কেন শূন্য হয়ে যায়?",
                "correlated-subqueries":
                  "প্রতিটা Customer এর নিজের সবশেষ Booking বের করতে ভেতরের Query কীভাবে বাইরের Row টা দেখে, আর সেটা কখন ধীর হয়?",
                "derived-tables":
                  "আগে প্রত্যেকের মোট, তারপর সেই মোটগুলোর গড়, এমন দুই ধাপের হিসাব FROM এর ভেতরে একটা Query কে Table বানিয়ে কীভাবে করবেন?",
                ctes:
                  "লম্বা একটা Report কে WITH দিয়ে নাম দেওয়া ধাপে কীভাবে ভাঙবেন, যাতে উপর থেকে নিচে পড়া যায় আর প্রতিটা ধাপ আলাদা করে মেলানো যায়?",
                "recursive-ctes":
                  "ডিসেম্বরের প্রতিটা দিন, বা একটা গাছের মতো কাঠামোর প্রতিটা স্তর, নিজেকেই ডাকা একটা Query দিয়ে কীভাবে বানাবেন, আর সেটা কোথায় থামবে?",
                "set-operations":
                  "দুইটা তালিকা কীভাবে যোগ, মিল আর বিয়োগ করবেন, আর UNION কেন চুপচাপ টাকার যোগফল কমিয়ে দিতে পারে?",
              }}
              footer="সাতটা লেসন তিন ভাগে মনে রাখা সহজ। প্রথম চারটা দেখায় ভেতরের Query কোথায় কোথায় বসে: একটা মানের জায়গায়, একটা তালিকার জায়গায়, প্রতিটা Row এর জন্য আলাদা করে, আর একটা Table এর জায়গায়। পরের দুইটা ধাপগুলোকে নাম দেয়: সাধারণ CTE আর নিজেকে ডাকা CTE। শেষেরটা দুইটা পুরো ফলাফল জোড়ে, আর সেখানেই পুরো মডিউলের Recap।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনগুলো একটা গল্পের মতো পড়ুন। শুরু <strong>Scalar Subqueries</strong> দিয়ে,
                সবচেয়ে সহজ রূপ: এমন একটা ভেতরের Query, যেটা ঠিক একটা মান ফেরত দেয়। সেই মান বসে
                যেখানে একটা সংখ্যা বা লেখা বসতে পারে, WHERE এর তুলনায়, SELECT এর একটা Column হিসেবে,
                বা HAVING এ। এখানেই আপনি দেখবেন Saint Martin এর Error টা কেন এল: ভেতরের Query একটা
                মান দেওয়ার কথা, দিয়েছে দুইটা, কারণ Saint Martin এ দুইটা ট্যুর আছে। আর সেটা সারানোর
                রাস্তা, আর প্রতিটা রাস্তার অর্থ।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় লেসন <strong>IN, EXISTS, ANY and ALL</strong> ভেতরের Query কে একটা মানের
                বদলে একটা তালিকা হিসেবে ব্যবহার করে। কোনো মান তালিকায় আছে কি না, তালিকার যেকোনো
                একটার চেয়ে বড় কি না, সবগুলোর চেয়ে বড় কি না। এখানেই NOT IN আর NULL এর ফাঁদটা পুরো
                খুলে দেখানো হবে, যেটা Module 03 আর Module 06 এ শুধু উঁকি দিয়েছিল। আর থাকবে এমন একটা
                অবাক করা নিয়ম: ফাঁকা তালিকার সবগুলোর চেয়ে বড় হওয়া সবসময় সত্য।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয় লেসন <strong>Correlated Subqueries</strong> এ ভেতরের Query প্রথমবার বাইরের Row
                টা দেখতে পায়। প্রতিটা Customer এর জন্য ভেতরের Query তাঁর নিজের সবশেষ সময়টা খোঁজে, তাই
                উত্তর প্রতিটা Row এ আলাদা। একটা ধাপে ধাপে চলা ছবিতে দেখবেন Database কীভাবে এটা ভাবে,
                আর কখন এই ধরন ধীর হয়, আর তখন একে Join বা পরের মডিউলের Window Function দিয়ে কীভাবে
                লেখা যায়।
              </ContentParagraph>
              <ContentParagraph>
                চতুর্থ লেসন <strong>Derived Tables</strong> ভেতরের Query কে FROM এ বসায়, যেখানে সে
                পুরো একটা অস্থায়ী Table। দুই গড়ের রহস্যটা এখানেই মেটে: আগে প্রত্যেকের মোট, তারপর
                সেই মোটগুলোর গড়। আর Module 06 এর লেসন ৭ এ যে দুইবার গোনা টাকার সমস্যা দেখেছিলেন, তার
                সবচেয়ে পরিষ্কার সমাধানও এখানে: জোড়ার আগেই হিসাবটা সেরে ফেলা।
              </ContentParagraph>
              <ContentParagraph>
                পঞ্চম লেসন <strong>CTEs with WITH</strong> একই কাজ করে, শুধু অনেক বেশি পড়ার মতো করে।
                প্রতিটা ধাপ উপরে নাম দিয়ে লেখা, নিচের ধাপ উপরের নাম ব্যবহার করে, আর একটা ধাপ দুইবার
                ব্যবহারও করা যায়। এখানে দেখবেন CTE আর Derived Table এর পার্থক্য কোথায়, আর PostgreSQL
                কখন একটা CTE কে আলাদা করে হিসাব করে রাখে আর কখন বাকি Query এর সাথে মিশিয়ে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                ষষ্ঠ লেসন <strong>Recursive CTEs</strong> এ একটা CTE নিজেকেই ডাকে। প্রথম Row দিয়ে
                শুরু, তারপর প্রতিবার আগের Row থেকে পরেরটা, যতক্ষণ না থামার শর্ত মেলে। এতে ডিসেম্বরের
                ৩১টা তারিখ বানানো যায়, যাদের বেশিরভাগ কোনো Table এ নেই। আর এতে গাছের মতো কাঠামো
                হাঁটা যায়। Sample Database এ কোনো গাছ নেই, তাই লেসনটা নিজেই একটা ছোট গাছ বানিয়ে নেবে,
                আর দেখাবে Query কখনো না থামলে কী হয়, আর কীভাবে থামাবেন।
              </ContentParagraph>
              <ContentParagraph>
                শেষ লেসন <strong>UNION, INTERSECT and EXCEPT</strong> দুইটা পুরো ফলাফলকে জোড়ে: যোগ,
                মিল আর বিয়োগ। এখানেই হারানো এক লাখ সাতাশ হাজার টাকার রহস্য মিটবে, UNION আর UNION ALL
                এর একটা ছোট পার্থক্যে। আর সবশেষে পুরো মডিউলের Recap: একটা Report, নাম দেওয়া ধাপের
                শিকলে লেখা, যেখানে এই মডিউলের প্রায় প্রতিটা হাতিয়ার একসাথে কাজ করে।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা লেসনে Browser এই চলা Query বক্স আর অনুশীলন আছে। অনুশীলনে আপনার Query সমাধানের
                মতো দেখতে না হলেও চলবে, ফলাফল এক হলেই সঠিক ধরা হয়। এই মডিউলে সেটা বিশেষ করে কাজে
                লাগে, কারণ একই প্রশ্নের উত্তর প্রায়ই Subquery দিয়েও আসে, Join দিয়েও, CTE দিয়েও।
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
      title: <SectionTitle>দুইটা Query চালিয়ে App এ মেলালেই তো হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা আপত্তি প্রায়ই শোনা যায়: গড় দামটা একটা Query দিয়ে এনে App এর একটা Variable এ
                রাখলাম, তারপর দ্বিতীয় Query তে পাঠালাম, সমস্যা কোথায়? ছোট কাজে সমস্যা নেই। কিন্তু
                তিনটা কারণে এই মডিউল তবু জরুরি। দুইটা Query এর মাঝখানে Data বদলে যেতে পারে, তখন
                দ্বিতীয় Query একটা পুরনো উত্তরের উপর দাঁড়ায়। প্রতিটা Customer এর জন্য আলাদা Query
                পাঠালে চৌদ্দ জনের জন্য চৌদ্দটা যাতায়াত, হাজার জনের জন্য হাজারটা। আর Report এর SQL,
                যেটা মালিক বা হিসাব বিভাগ পড়েন, প্রায় সবসময় একটাই লম্বা Query, যেটা কোনো App ছাড়াই
                চলে।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা আপত্তি: পরের মডিউলের Window Function তো এসব পারে। অনেকটাই পারে, আর Module 08
                এ আপনি দেখবেন। কিন্তু Window Function বসে একটা Query এর ভেতরে, আর সেই Query কে পরের
                ধাপে ছাঁকতে আবার একটা Subquery বা CTE লাগে। এই মডিউলটা Window Function এর জন্যও
                ভিত্তি।
              </ContentParagraph>
              <ContentParagraph>এই মডিউল বাদ দিয়ে এগোলে খরচটা কোথায় কোথায় দিতে হয়, দেখুন।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>হাতে কপি করা সংখ্যা।</strong> একটা Query এর উত্তর আরেকটায় বসাতে না পারলে
                  সংখ্যাটা হাতে বসাতে হয়। সংখ্যাটা বদলালে Report ভুল হয়, আর কেউ টের পায় না।
                </ListItem>
                <ListItem>
                  <strong>ভুল প্রশ্নের সঠিক উত্তর।</strong> প্রতি Booking এর গড় আর প্রতি Customer
                  এর গড়, দুইটাই সঠিক সংখ্যা। দুই ধাপের হিসাব লিখতে না জানলে আপনি যেটা লিখতে পারেন
                  সেটাই দেন, যেটা চাওয়া হয়েছিল সেটা নয়।
                </ListItem>
                <ListItem>
                  <strong>শূন্য উত্তরের ভুল আশ্বাস।</strong> NOT IN এর তালিকায় একটা NULL থাকলে উত্তর
                  শূন্য। আপনি ভাবেন সব Guide ব্যস্ত, অথচ একজন বসে আছেন।
                </ListItem>
                <ListItem>
                  <strong>হারানো টাকা।</strong> দুইটা তালিকা UNION দিয়ে জুড়লে একই রকম Row একটাই
                  থাকে। টাকার তালিকায় একই অঙ্ক দুইবার থাকা খুব স্বাভাবিক, আর UNION সেটা নিঃশব্দে মুছে
                  দেয়।
                </ListItem>
                <ListItem>
                  <strong>পড়া যায় না এমন Query।</strong> বন্ধনীর ভেতরে বন্ধনী, তার ভেতরে আরেকটা,
                  এমন Query লেখা যায়, কিন্তু ছয় মাস পরে কেউ পড়তে পারে না, আপনি নিজেও না। CTE না জানলে
                  লম্বা Report মানেই জট।
                </ListItem>
              </ContentList>
              <ContentParagraph>আর কয়েকটা প্রচলিত ভুল ধারণা আছে, যেগুলো এই মডিউল ভাঙবে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Subquery মানেই ধীর।</strong> সবসময় নয়। PostgreSQL অনেক Subquery কে নিজেই
                  Join এ বদলে নেয়। কোনটা ধীর আর কেন, দেখবেন লেসন ৩ এ।
                </ListItem>
                <ListItem>
                  <strong>ভেতরের Query সবসময় একটা মান দেয়।</strong> না। সে একটা মান, একটা তালিকা বা
                  পুরো একটা Table দিতে পারে, আর কোন আকার কোথায় বসে, সেটাই প্রথম চার লেসনের মূল কথা।
                </ListItem>
                <ListItem>
                  <strong>NOT IN আর NOT EXISTS একই জিনিস।</strong> তালিকায় একটা NULL থাকলেই দুইটা
                  আলাদা উত্তর দেয়। লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>CTE সবসময় দ্রুত, বা সবসময় আলাদা করে হিসাব হয়।</strong> দুইটার কোনোটাই
                  সবসময় সত্য নয়। PostgreSQL কখন কোনটা করে, লেসন ৫।
                </ListItem>
                <ListItem>
                  <strong>নিজেকে ডাকা Query শুধু গাছের জন্য, আর বিপজ্জনক।</strong> তারিখের তালিকা,
                  সংখ্যার তালিকা, পথ খোঁজা, সবখানে কাজে লাগে, আর থামার শর্ত ঠিক থাকলে নিরাপদ। লেসন ৬।
                </ListItem>
                <ListItem>
                  <strong>UNION আর UNION ALL একই।</strong> একটা একই রকম Row মুছে দেয়, আরেকটা রাখে।
                  সেই ছোট পার্থক্যেই এক লাখ সাতাশ হাজার টাকা। লেসন ৭।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা কথা মনে রাখুন",
          content: (
            <p>
              একটা Query এর উত্তরও একটা Table, আর Table যেখানে বসতে পারে, সেখানে Query এর উত্তরও
              বসতে পারে। ভেতরের Query লেখার আগে তার আকারটা ঠিক করুন: একটা মান, এক Column এর তালিকা,
              নাকি পুরো Table। আকার ঠিক থাকলে বাকিটা প্রায় নিজে থেকেই মেলে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "where-it-helps",
      subHeader: { index: "005", title: "Where It Helps" },
      title: <SectionTitle>কাজের জায়গায় ঠিক কোন মুহূর্তগুলোতে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের ছয়টা ঘটনা Island Tours এর মতো যেকোনো দলের কাজে বারবার আসে। একটা বেছে নিন,
              দেখুন এই মডিউল না জানলে ঘটনাটা কেমন যায় আর জানলে কেমন যায়, আর নিচে দেখুন কোন লেসনে
              উত্তরটা আছে। প্রতিটা সংখ্যা Sample Database এ চালিয়ে মেলানো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "more-than-one-row",
                  label: "একটার বেশি Row এর Error",
                  situation:
                    "Saint Martin এর ট্যুরের চেয়ে দামি সব ট্যুর দেখাতে লিখলেন WHERE price_bdt > (SELECT price_bdt FROM tours WHERE destination_id = 1)। চালাতেই এল: more than one row returned by a subquery used as an expression।",
                  without:
                    "আপনি ভাবেন বন্ধনীর ভেতরে কিছু ভুল লিখেছেন, পুরো Query টা মুছে আবার লেখেন, একই Error। শেষে দামটা হাতে দেখে সংখ্যাটা বসিয়ে দেন।",
                  withIt:
                    "আপনি জানেন তুলনার জায়গায় ঠিক একটা মান লাগে, আর Saint Martin এ দুইটা ট্যুর আছে, 12500 আর 32000। প্রশ্নটা আসলে কী চায় ঠিক করেন: সস্তাটার চেয়ে দামি হলে min, দামিটার চেয়েও দামি হলে max।",
                  lessons: ["Scalar Subqueries"],
                },
                {
                  id: "two-averages",
                  label: "গড় খরচ দুই রকম",
                  situation:
                    "মালিক জানতে চাইলেন একজন Customer গড়ে কত টাকার Booking করেন। আপনি avg(total_bdt) দিলেন, 24679.17। হিসাব বিভাগ বলছে 42307.14।",
                  without:
                    "দুই পক্ষ নিজের Query দেখিয়ে তর্ক করেন। শেষে কম সংখ্যাটাই Report এ যায়, কারণ সেটা আগে এসেছিল।",
                  withIt:
                    "আপনি জানেন প্রথমটা প্রতি Booking এর গড়, চব্বিশটা Booking এর উপর। প্রশ্নটা প্রতি Customer এর, তাই আগে প্রত্যেকের মোট বের করে একটা Table বানান, তারপর সেই চৌদ্দটা মোটের গড়: 42307.14।",
                  lessons: ["Derived Tables", "CTEs with WITH"],
                },
                {
                  id: "not-in-zero",
                  label: "NOT IN দিল শূন্য",
                  situation:
                    "যে Guide দের হাতে এখনো কোনো ট্যুর নেই, তাঁদের নতুন ট্যুরের প্রস্তাব পাঠানো হবে। লিখলেন WHERE guide_id NOT IN (SELECT guide_id FROM tours)। উত্তর শূন্য Row।",
                  without:
                    "আপনি ধরে নেন সব Guide ব্যস্ত, প্রস্তাবটা আর যায় না। Nazmul Karim একটাও ট্যুর ছাড়া অপেক্ষা করতে থাকেন।",
                  withIt:
                    "আপনি জানেন tours এর guide_id তালিকায় Ratargul এর একটা NULL আছে, আর NOT IN এর তালিকায় একটা NULL থাকলে কোনো Row সত্য হয় না। NOT EXISTS লেখেন, উত্তর আসে Nazmul Karim।",
                  lessons: ["IN, EXISTS, ANY and ALL"],
                },
                {
                  id: "latest-booking",
                  label: "প্রত্যেকের শেষ Booking",
                  situation:
                    "Customer দের পাতায় প্রত্যেকের সবশেষ Booking এর নম্বর আর তারিখ দেখাতে হবে। GROUP BY দিয়ে max(booked_at) পান, কিন্তু সেই Booking এর নম্বরটা আর আসে না।",
                  without:
                    "App প্রতিটা Customer এর জন্য আলাদা একটা Query পাঠায়। চৌদ্দজনের জন্য চৌদ্দটা যাতায়াত, Customer বাড়লে পাতাটা ধীর হতে থাকে।",
                  withIt:
                    "আপনি একটা Correlated Subquery লেখেন: যে Booking এর সময় এই Customer এর নিজের সবশেষ সময়ের সমান। একটাই Query, চৌদ্দটা Row, প্রতি Customer এ একটা।",
                  lessons: ["Correlated Subqueries"],
                },
                {
                  id: "empty-days",
                  label: "ফাঁকা দিনসহ ক্যালেন্ডার",
                  situation:
                    "Guide দের জন্য ডিসেম্বরের একটা ক্যালেন্ডার চাই, ৩১টা দিনই থাকবে, যেদিন যাত্রা নেই সেদিনও। departures Table এ ডিসেম্বরের তারিখ মাত্র তিনটা: 4, 11 আর 18।",
                  without:
                    "Query থেকে তিনটা Row আসে। বাকি আঠাশটা দিন আপনি Excel এ হাতে বসান, আর পরের মাসে আবার।",
                  withIt:
                    "আপনি WITH RECURSIVE দিয়ে ১ থেকে ৩১ তারিখের ৩১টা Row বানান, তারপর departures এর সাথে LEFT JOIN। ৩১টা দিন আসে, তিনটায় যাত্রার তথ্য, বাকিগুলো ফাঁকা।",
                  lessons: ["Recursive CTEs"],
                },
                {
                  id: "union-lost-money",
                  label: "UNION এ টাকা হারাল",
                  situation:
                    "bKash আর Nagad এর paid Payment এক তালিকায়, Card আর Bank এর আরেক তালিকায়, দুইটা UNION দিয়ে জুড়ে যোগ করলেন: 296600.00। Payment এর পাতায় মোট 423600.00।",
                  without:
                    "আপনি সন্দেহ করেন কিছু Payment হারিয়েছে, একটা একটা করে খুঁজতে থাকেন। কোনোটাই হারায়নি।",
                  withIt:
                    "আপনি জানেন UNION একই রকম Row একটাই রাখে, আর 25000.00 বা 36000.00 এর মতো অঙ্ক কয়েকবার আছে। সতেরোটা Row থেকে বারোটা থেকে গেছে। UNION ALL লেখেন, সতেরোটা Row, 423600.00।",
                  lessons: ["UNION, INTERSECT and EXCEPT"],
                },
              ]}
              footer="প্রতিটা ঘটনার সংখ্যা Island Tours এর Sample Database এ সত্যি চালিয়ে পাওয়া। Saint Martin এর Error আর NOT IN এর শূন্য উত্তর MySQL 8.4 এও হুবহু একই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর বাইরেও কয়েকটা জায়গায় এই মডিউলের জিনিসগুলো নিয়মিত দেখা যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Report আর Dashboard এর SQL।</strong> Metabase, Grafana বা যেকোনো BI Tool
                  এ যে লম্বা Query গুলো সংখ্যার কার্ড বানায়, তার অনেকগুলোই WITH দিয়ে শুরু হয়, আর
                  প্রতিটা ধাপ একটা নাম।
                </ListItem>
                <ListItem>
                  <strong>ORM এর বানানো SQL।</strong> অনেক ORM একটা তালিকা দিয়ে ছাঁকতে বললে ভেতরে IN
                  বা EXISTS সহ Subquery পাঠায়। Log এ সেই SQL দেখে বুঝতে পারা Debug করার অর্ধেক কাজ।
                </ListItem>
                <ListItem>
                  <strong>Data পরিষ্কারের Script।</strong> কোন Booking এর Payment নেই, কোন Customer এর
                  দুইটা Account, কোন তালিকায় কী বাড়তি, এগুলো প্রায়ই EXCEPT বা NOT EXISTS দিয়ে খোঁজা হয়।
                  Data বদলানোর অংশটা Module 10 এ।
                </ListItem>
                <ListItem>
                  <strong>গাছের মতো Data।</strong> Category এর ভেতরে Category, কর্মীর উপরে ম্যানেজার,
                  মন্তব্যের উত্তরে মন্তব্য, এগুলো Recursive CTE ছাড়া এক Query তে পড়া যায় না।
                </ListItem>
                <ListItem>
                  <strong>দুই System এর হিসাব মেলানো।</strong> Payment Gateway এর তালিকা আর নিজের
                  Database এর তালিকা, কোনটা কোথায় নেই, EXCEPT দিয়ে এক লাইনে।
                </ListItem>
                <ListItem>
                  <strong>Interview।</strong> দ্বিতীয় সর্বোচ্চ দাম, নিজের দলের গড়ের চেয়ে বেশি পাওয়া
                  মানুষ, তালিকা থেকে হারানো নম্বর, এই প্রশ্নগুলো SQL Interview এর পরিচিত মুখ, আর
                  প্রতিটার উত্তর এই মডিউলের কোনো একটা লেসনে।
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
      title: <SectionTitle>Island Tours এর ভেতরে ধাপে ধাপে লেখা Query</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর মতো একটা দলে এই মডিউলের হাতিয়ারগুলো কোথায় কাজ করে, কয়েকটা জায়গা
                দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ট্যুরের পাতার চিহ্ন।</strong> যে ট্যুরের দাম সব ট্যুরের গড়ের চেয়ে বেশি,
                  তার পাশে একটা Premium চিহ্ন। গড়টা প্রতিবার ভেতরের Query হিসাব করে, তাই নতুন ট্যুর
                  যোগ হলে চিহ্নগুলো নিজে থেকেই ঠিক থাকে। লেসন ১।
                </ListItem>
                <ListItem>
                  <strong>Customer এর পাতা।</strong> প্রত্যেকের সবশেষ Booking, একটাই Query তে, একটা
                  Correlated Subquery দিয়ে। লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>মালিকের মাসিক Report।</strong> প্রত্যেকের মোট খরচ, তার গড়, আর গড়ের চেয়ে
                  বেশি খরচ করা Customer, তিনটা নাম দেওয়া ধাপে লেখা একটা WITH Query। লেসন ৪ আর ৫।
                </ListItem>
                <ListItem>
                  <strong>Guide দের ক্যালেন্ডার।</strong> মাসের প্রতিটা দিন, যাত্রা থাক বা না থাক,
                  একটা Recursive CTE থেকে। লেসন ৬।
                </ListItem>
                <ListItem>
                  <strong>SMS এর তালিকা।</strong> Customer আর Guide দের নাম আর ফোন এক তালিকায়, UNION
                  ALL দিয়ে, 15 আর 5 মিলে 20 জন। আর হিসাব মেলাতে, কোন Departure এর একটাও Booking নেই,
                  EXCEPT দিয়ে, উত্তর একটা: Departure 16, Saint Martin Luxury Stay এর ফেব্রুয়ারির
                  তারিখটা। লেসন ৭।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে মালিকের Report এর একটা টুকরো, তিনটা ধাপে। প্রথম ধাপ spend প্রত্যেক
                Customer এর confirmed খরচ বের করে, দ্বিতীয় ধাপ avg_spend সেই খরচগুলোর গড়, আর শেষ
                লাইন দুইটা ধাপের নাম ধরে গড়ের চেয়ে বেশি খরচ করা Customer দের তালিকা দেয়। পড়ে
                দেখুন, উপর থেকে নিচে প্রায় বাংলা বাক্যের মতো পড়া যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাম দেওয়া তিন ধাপের Report"
              query={`WITH spend AS (
  SELECT customer_id, sum(total_bdt) AS confirmed_bdt
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY customer_id
), avg_spend AS (
  SELECT avg(confirmed_bdt) AS avg_bdt FROM spend
)
SELECT c.full_name, s.confirmed_bdt
FROM spend s
JOIN customers c USING (customer_id)
WHERE s.confirmed_bdt > (SELECT avg_bdt FROM avg_spend)
ORDER BY s.confirmed_bdt DESC;`}
              caption="ছয়জন Customer আসবেন, Nusrat Jahan 75000.00 থেকে শুরু করে, শেষে তিনজন 36000.00 করে। confirmed Booking আছে বারোজনের, তাঁদের খরচের গড় 35300.00, আর এই ছয়জন তার উপরে। শেষ লাইনটা মুছে শুধু SELECT * FROM spend লিখে চালালে দেখবেন প্রথম ধাপ একা কী দেয়। প্রতিটা ধাপ এভাবে আলাদা করে মেলানো যায়, আর এটাই CTE এর সবচেয়ে বড় সুবিধা। পুরো গল্প লেসন ৪ আর ৫ এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এই মডিউলে আপনি নিজে যা যা করবেন:</ContentParagraph>
              <ContentList>
                <ListItem>
                  ফারুক সাহেবের ছয়টা প্রশ্নের প্রতিটা একটাই Query তে লিখবেন, আর প্রতিটার ভেতরের
                  Query আলাদা চালিয়ে দেখবেন সে কী আকারের উত্তর দেয়।
                </ListItem>
                <ListItem>
                  Saint Martin এর Error টা নিজে বানাবেন, তারপর তিনভাবে সারাবেন, আর প্রতিটা সমাধান
                  আসলে কোন প্রশ্নের উত্তর, সেটা মিলিয়ে দেখবেন।
                </ListItem>
                <ListItem>
                  একই প্রশ্ন একবার Subquery দিয়ে, একবার Join দিয়ে, একবার CTE দিয়ে লিখে তিনটার উত্তর
                  মেলাবেন।
                </ListItem>
                <ListItem>
                  একটা Recursive CTE ইচ্ছা করে না থামার মতো লিখে দেখবেন কী হয়, তারপর থামার শর্ত
                  বসাবেন।
                </ListItem>
                <ListItem>
                  UNION আর UNION ALL দিয়ে একই তালিকার যোগফল দুইভাবে বের করে হারানো টাকাটা নিজের চোখে
                  দেখবেন।
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
                "একটা Query এর উত্তর হাতে কপি করে আরেকটা Query তে বসান",
                "more than one row এর Error দেখে বুঝতে পারেন না কোন Row এর কথা",
                "দুই ধাপের হিসাব লিখতে না পেরে এক ধাপের গড়টাই দিয়ে দেন",
                "যা নেই তা খুঁজতে NOT IN লেখেন, আর শূন্য উত্তরকে সত্যি ধরে নেন",
                "প্রতিটা Customer এর জন্য App থেকে আলাদা Query পাঠান",
                "লম্বা Query মানে বন্ধনীর ভেতরে বন্ধনী, যেটা পরে আর কেউ পড়তে পারে না",
                "দুইটা তালিকা জুড়তে UNION লেখেন, আর যোগফল কমে গেলে কারণ খুঁজে পান না",
              ]}
              after={[
                "ভেতরের Query লেখার আগে তার আকার ঠিক করেন: একটা মান, একটা তালিকা, নাকি পুরো Table",
                "একটা মানের জায়গায় একাধিক Row এলে প্রশ্নটা আবার পড়ে ঠিক করেন কোন মানটা চাই",
                "আগে প্রত্যেকের মোট, তারপর মোটের গড়, এমন হিসাব FROM বা WITH এ ধাপে ধাপে লেখেন",
                "NULL থাকতে পারে এমন তালিকায় NOT EXISTS লেখেন, আর কেন, সেটা বোঝাতে পারেন",
                "প্রতিটা Row এর নিজের হিসাব একটা Correlated Subquery বা Join দিয়ে এক Query তে সারেন",
                "লম্বা Report WITH দিয়ে নাম দেওয়া ধাপে লেখেন, আর প্রতিটা ধাপ আলাদা চালিয়ে মেলান",
                "UNION আর UNION ALL এর মধ্যে জেনেবুঝে বাছেন, আর দরকার হলে INTERSECT বা EXCEPT দেন",
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
                এই মডিউলের মানদণ্ড হলো একটা লম্বা Query কে টুকরো করে পড়তে পারা। কেউ আপনাকে চল্লিশ
                লাইনের একটা Report দেখালে আপনি বলবেন, প্রথম ধাপ প্রত্যেক Customer এর মোট দেয়, এর
                আকার একটা Table, প্রতি Customer এ একটা Row। দ্বিতীয় ধাপ সেই মোটগুলোর গড়, এর আকার
                একটা মান। শেষ লাইন দুইটা নাম ধরে গড়ের চেয়ে বেশি মোটগুলো দেয়। আর এখানে UNION না
                দিয়ে UNION ALL হওয়া উচিত, কারণ একই অঙ্কের দুইটা Payment দুইটা আলাদা টাকা।
              </ContentParagraph>
              <ContentParagraph>
                এটা পারলে আপনি একটা Query কে একটা শিকলের মতো দেখতে শিখেছেন, যার প্রতিটা কড়া আলাদা
                করে পরীক্ষা করা যায়। পাশের কাউকে লম্বা SQL বোঝানোর আসল কৌশল ঠিক এটাই।
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
                <strong>আগে যা লাগবে।</strong> Module 05 এর GROUP BY আর গড়, কারণ এই মডিউলের অর্ধেক
                ভেতরের Query আসলে একটা ছোট GROUP BY। Module 06 এর Join, বিশেষ করে লেসন ৭ এর দুইবার
                গোনা টাকা আর লেসন ৮ এর EXISTS, কারণ এখানে সেগুলো নতুন চেহারায় ফিরে আসে। আর Module 03
                এর NULL, কারণ NOT IN এর ফাঁদটা পুরোটাই NULL এর খেলা। Module 02 শেষ করা থাকলে Lab এর
                Drill গুলো নিজের psql এ চালাতে পারবেন, না থাকলেও লেসনের বক্সগুলো Browser এই চলে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>সময়।</strong> পুরো মডিউলের জন্য চার পাঁচ দিন ধরে রাখুন। সাতটা লেসন পড়তে মোট
                প্রায় সাড়ে তিন থেকে সাড়ে চার ঘণ্টা লাগে। লেসন ৩ আর লেসন ৬ এর জন্য একটু বেশি সময়
                রাখুন। ভেতরের Query বাইরের Row দেখে, আর নিজেকে ডাকা Query, এই দুইটা ধারণা একবার পড়ে
                বসে না, দুইবার চালিয়ে দেখলে বসে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ক্রম।</strong> লেসন ১ থেকে ৪ ক্রম ধরে পড়ুন, কারণ সেখানে ভেতরের Query এক জায়গা
                থেকে আরেক জায়গায় সরে: মান, তালিকা, প্রতি Row, তারপর Table। লেসন ৫ এর পরেই লেসন ৬,
                কারণ নিজেকে ডাকা CTE সাধারণ CTE ধরে নেয়। লেসন ৭ আলাদাভাবেও পড়া যায়, তবে সেখানে পুরো
                মডিউলের Recap, তাই সেটা শেষে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>আকার আগে।</strong> এই মডিউলের সবচেয়ে বড় অনুশীলন একটাই: ভেতরের Query লেখার
                আগে তার আকার মনে মনে বলা। একটা মান, এক Column এর তালিকা, নাকি পুরো Table। তারপর
                ভেতরের Query টা একা চালিয়ে মিলিয়ে নিন। অনুমান না মিললে, ধরুন একটা মান ভেবেছিলেন অথচ
                দুইটা Row এল, শেখার আসল জিনিসটা ঠিক সেখানে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Query বক্স আর অনুশীলন।</strong> প্রতিটা বক্স আগে যেমন আছে তেমন চালান, তারপর
                একটা জিনিস বদলান: UNION কে UNION ALL, NOT IN কে NOT EXISTS, একটা CTE এর শেষ লাইন মুছে
                শুধু সেই ধাপটা। অনুশীলনের বক্সে আগে নিজে অন্তত দুইবার চেষ্টা করুন, তারপর Hint, আর
                সবার শেষে Solution। আপনার Query সমাধানের মতো দেখতে না হলেও চলবে, ফলাফল এক হলেই
                সঠিক। একই উত্তর Subquery দিয়েও আসে, Join দিয়েও, CTE দিয়েও, তিনটাই ঠিক।
              </ContentParagraph>
              <ContentParagraph>
                <strong>MySQL এর ভিডিও দেখছেন?</strong> ভিডিওর Nested Query এর অংশটা এই মডিউলের লেসন
                ১ আর ২ এর সাথে মেলে। MySQL 8.4 এ কয়েকটা জিনিস যাচাই করে দেখা হয়েছে। WITH আর WITH
                RECURSIVE চলে, ডিসেম্বরের ৩১টা দিন একই উত্তর দেয়। INTERSECT আর EXCEPT চলে। একটার বেশি
                Row এর Error সেখানে আসে ERROR 1242, Subquery returns more than 1 row নামে, আর NOT IN
                এর শূন্য উত্তর হুবহু একই। দুইটা পার্থক্য মনে রাখার মতো। FROM এর ভেতরের Query কে
                MySQL এ সবসময় একটা নাম দিতে হয়, নইলে ERROR 1248, যেখানে PostgreSQL 18 নাম ছাড়াও চালায়।
                আর IN এর ভেতরের Query তে LIMIT দিলে MySQL ERROR 1235 দেয়, PostgreSQL দেয় না। নিজেকে
                ডাকা Query এর একটা সীমাও আছে, cte_max_recursion_depth, শুরুতে 1000।
              </ContentParagraph>
              <ContentParagraph>
                <strong>আটকে গেলে।</strong> প্রথমে ভেতরের Query টা একা চালান, তার উত্তর আর আকার
                দেখুন। Error এ more than one row থাকলে ভেতরের Query একটা মানের জায়গায় অনেকগুলো
                দিচ্ছে। উত্তর অপ্রত্যাশিতভাবে শূন্য হলে তালিকায় কোনো NULL আছে কি না দেখুন। যোগফল কম
                এলে কোথাও UNION আছে কি না, বেশি এলে কোথাও জোড়ার পর যোগ হয়েছে কি না। আর লম্বা CTE এ
                উত্তর ভুল এলে শেষ লাইনটা বদলে একটা একটা ধাপ আলাদা চালান, যেখানে প্রথম ভুল সংখ্যা
                আসে, সমস্যা সেই ধাপে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>পরের ধাপ।</strong> এখান থেকে সোজা চলে যান প্রথম লেসনে,{" "}
                <strong>Scalar Subqueries</strong>, যেখানে আপনি প্রথমবার একটা Query এর উত্তর আরেকটা
                Query এর ভেতরে বসাবেন, আর Saint Martin এর Error টা নিজে বানিয়ে নিজেই সারাবেন।
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
        "Scalar Subqueries",
        "যে ভেতরের Query ঠিক একটা মান দেয়, সে একটা সংখ্যা বা লেখার জায়গায় বসে, আর একটার বেশি Row দিলে Error আসে",
      ],
      [
        "IN, EXISTS, ANY and ALL",
        "ভেতরের Query একটা তালিকা দিলে IN, ANY, ALL আর EXISTS দিয়ে তার সাথে মেলানো যায়, আর NOT IN এর তালিকায় একটা NULL থাকলে উত্তর শূন্য",
      ],
      [
        "Correlated Subqueries",
        "যে ভেতরের Query বাইরের Row দেখে, সে প্রতিটা Row এর জন্য আলাদা উত্তর দেয়, আর দরকার হলে Join বা Window Function দিয়ে একই কাজ দ্রুত করা যায়",
      ],
      [
        "Derived Tables",
        "FROM এর ভেতরের Query একটা অস্থায়ী Table, তাই আগে প্রত্যেকের মোট আর তারপর মোটের গড়, এমন দুই ধাপের হিসাব সেখানে হয়",
      ],
      [
        "CTEs with WITH",
        "WITH দিয়ে প্রতিটা ধাপ নাম দিয়ে উপরে লেখা যায়, তাই লম্বা Report উপর থেকে নিচে পড়া যায় আর প্রতিটা ধাপ আলাদা মেলানো যায়",
      ],
      [
        "Recursive CTEs",
        "WITH RECURSIVE একটা শুরুর Row থেকে বারবার পরের Row বানায় যতক্ষণ না থামার শর্ত মেলে, তাই তারিখের তালিকা আর গাছের মতো Data পড়া যায়",
      ],
      [
        "UNION, INTERSECT and EXCEPT",
        "দুইটা ফলাফল যোগ, মিল আর বিয়োগ করা যায়, আর UNION একই রকম Row মুছে দেয় বলে টাকার তালিকায় UNION ALL লাগে",
      ],
    ],
  },
};
