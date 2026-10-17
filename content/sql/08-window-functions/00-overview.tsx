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

export const windowFunctionsOverviewContent: TopicData = {
  id: "window-functions-overview",
  introduction: {
    badge: "MODULE 08 · OVERVIEW",
    title: <SectionTitle>প্রতিটা Row থাকবে, পাশে বসবে পুরো ছবি</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 07 শেষে আপনি বড় প্রশ্নকে ছোট ধাপে ভাঙতে পারেন। একটা Query এর উত্তর আরেকটার
          ভেতরে বসান, লম্বা Report কে WITH দিয়ে নাম দেওয়া ধাপে লেখেন, আর দুইটা তালিকা যোগ বিয়োগ
          করেন। কিন্তু Report এর একটা ধরন এখনো ঝামেলার। প্রতিটা Row আলাদা করে দেখাতে হবে, আবার
          তার পাশেই বসাতে হবে অনেক Row থেকে হিসাব করা একটা সংখ্যা: সবার গড়, তালিকায় তার স্থান,
          আগের মাসের সংখ্যা, শুরু থেকে জমতে থাকা মোট।
        </ContentParagraph>
        <ContentParagraph>
          GROUP BY এখানে কাজে আসে না, কারণ সে Row গুলোকে গলিয়ে একটা করে ফেলে। প্রতিটা Column এর
          জন্য একটা করে Subquery লেখা যায়, কিন্তু Query লম্বা হয়, ধীর হয়, আর পড়া কঠিন হয়। এই
          মডিউল শেখায় SQL এর সেই হাতিয়ার, যেটা ঠিক এই কাজের জন্য বানানো: Window Function। এটা
          কোনো Row হারায় না, প্রতিটা Row এর জন্য একটা জানালা খোলে, আর সেই জানালা দিয়ে যে Row গুলো
          দেখা যায় তাদের উপর হিসাব করে। Analytics এর SQL আর SQL Interview, দুই জায়গাতেই এটাই
          সবচেয়ে বেশি আসা বিষয়।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা লেসন নয়, মডিউলের মানচিত্র। এখানে জানবেন মডিউলটা কেন দরকার, সাতটা লেসনে কী কী
          শিখবেন, না শিখলে কোথায় Error আসে বা কোথায় চুপচাপ ভুল উত্তর বেরোয়, কাজের জায়গায় এগুলো
          কোথায় লাগে, আর বাস্তবে আপনি ধাপে ধাপে কী কী করবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "স্কুলের রেজাল্ট শিটে প্রত্যেক ছাত্রের নিজের একটা লাইন থাকে। তবু সেই লাইনের পাশেই লেখা থাকে ক্লাসের গড়, ক্লাসে তার স্থান, আর আগের পরীক্ষা থেকে কত বাড়ল। গড় বের করতে কারো লাইন মুছে ফেলা হয় না।",
      author: "Window Functions",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>প্রতিটা Row চাই, পাশে সবার হিসাবও চাই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026, সপ্তাহের প্রথম কাজের দিন। ফারুক সাহেবের সাপ্তাহিক বৈঠক।
                গত সপ্তাহের লম্বা Report গুলো ধাপে ধাপে লেখা হয়েছিল বলে মালিক এবার সেগুলো নিজে পড়ে
                দেখেছেন, আর খুশি হয়ে আরও ছয়টা জিনিস চেয়েছেন। খেয়াল করলে দেখবেন, প্রতিটায় একই সাথে
                দুইটা জিনিস লাগে: প্রতিটা Row আলাদা করে, আর তার পাশে অনেক Row থেকে হিসাব করা একটা
                সংখ্যা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  প্রতিটা Booking এর পাশে সব Booking এর গড় টাকা, আর এই Booking টা গড়ের চেয়ে কত বেশি
                  বা কম।
                </ListItem>
                <ListItem>
                  Website এর প্রথম পাতার জন্য সেরা তিনটা Review, Rating ধরে সাজানো, প্রতিটার পাশে তার
                  স্থান।
                </ListItem>
                <ListItem>
                  প্রত্যেক Customer এর কোন Booking টা তাঁর প্রথম, কোনটা দ্বিতীয়, কোনটা তৃতীয়, যাতে
                  তৃতীয় Booking এ একটা ছাড় দেওয়া যায়।
                </ListItem>
                <ListItem>
                  মাসে মাসে confirmed আয়, আর পাশে শুরু থেকে জমতে থাকা মোট আয়, একটা Chart এর জন্য।
                </ListItem>
                <ListItem>প্রতি মাসে আগের মাসের তুলনায় আয় কত বাড়ল বা কমল।</ListItem>
                <ListItem>
                  মালিকের জন্য একটা ছক: প্রতি মাস এক লাইনে, আর confirmed, pending, cancelled আলাদা
                  আলাদা Column এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Module 07 পর্যন্ত জানলে তালিকাটা কেমন যায়, ভাবুন। প্রথম কাজের জন্য আপনি গড়টা একটা
                Scalar Subquery দিয়ে আনেন, চলে। দ্বিতীয় কাজে স্থানের জন্যও একটা Subquery লেখেন:
                আমার চেয়ে বেশি Rating কতজনের। তারপর সেরা তিনটা রাখতে শর্তটা WHERE এ বসানোর চেষ্টা
                করেন, আর সহকর্মীর কাছে শোনা rank() লিখে দেন। চালাতেই লাল লেখা আসে: window functions
                are not allowed in WHERE। যে জিনিসটা হিসাব করা গেল, সেটা দিয়েই কেন ছাঁকা গেল না, বোঝা
                যায় না।
              </ContentParagraph>
              <ContentParagraph>
                সহকর্মী তখন row_number() দেন, Error চলে যায়। কিন্তু চারটা Review এর Rating পাঁচ, আর
                এখানে PostgreSQL প্রথম স্থান দিল Review 5 কে। একই Data MySQL এ চালালে প্রথম স্থান পায়
                Review 1। একই প্রশ্ন, একই Data, অথচ সেরা Review দুই জায়গায় দুইটা। কোনটা সত্যি, কেউ
                বলতে পারে না, কারণ চারটাই আসলে সমান।
              </ContentParagraph>
              <ContentParagraph>
                আর শেষ চমকটা মাসের তুলনায়। আপনি প্রতি মাসের আয়ের পাশে আগের Row এর আয় বসিয়ে বিয়োগ
                করেন। September এর পাশে আসে -7100.00, আর Report এ লেখা হয়: আগস্টের চেয়ে September এ
                আয় সাত হাজার একশো টাকা কমেছে। আসলে আগস্টে কোনো confirmed Booking নেই, এপ্রিল থেকে
                আগস্ট পুরোটাই ফাঁকা। September কে তুলনা করা হয়েছে মার্চের সাথে, পাঁচ মাস আগের সাথে।
                কোনো Error নেই, শুধু একটা ভুল বাক্য।
              </ContentParagraph>
              <ContentParagraph>
                তিনটা দৃশ্যের মূল কথা একই। প্রতিটা Row থেকে অন্য Row গুলো দেখা যায়, কিন্তু ঠিক কোন
                Row গুলো দেখা যাবে, কোন ক্রমে, আর কতদূর পর্যন্ত, এটা স্পষ্ট করে না বললে Database
                নিজের মতো একটা উত্তর দেয়। কখনো Error, কখনো সমান দুইজনের একজনকে এগিয়ে রাখা, কখনো ভুল
                মাসের সাথে তুলনা।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল শেষে ফারুক সাহেবের ছয়টা কাজের প্রতিটা আপনি একটা Query তে লিখবেন, আর প্রতিটা
                Row কোন জানালা দিয়ে কোন Row গুলো দেখছে, সেটা আঙুল দিয়ে দেখিয়ে বোঝাতে পারবেন।
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
              Error টা কেন এল, দুই Database এ সেরা Review কেন আলাদা, আর September কেন মার্চের সাথে
              মিলল, এখানে ইচ্ছা করেই ব্যাখ্যা দেওয়া হয়নি। প্রতিটার কারণ আর সমাধান নির্দিষ্ট একটা
              লেসনে আছে, যেটা নিচের মানচিত্রে দেখবেন। মডিউল শেষে এই অংশটা আবার পড়ে দেখুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "big-picture",
      subHeader: { index: "002", title: "The Big Picture" },
      title: <SectionTitle>রেজাল্ট শিটের প্রতিটা Column</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                স্কুলের বার্ষিক রেজাল্ট শিটটা মনে করুন। প্রত্যেক ছাত্রের নিজের একটা লাইন, তাতে তার নাম
                আর নম্বর। কিন্তু সেই লাইনেই আরও কয়েকটা ঘর থাকে, যেগুলো শুধু তার নম্বর দেখে লেখা যায়
                না, পুরো ক্লাসের দিকে তাকাতে হয়। এই মডিউলের প্রতিটা লেসন সেই শিটের একটা করে ঘর।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ক্লাসের গড়:</strong> প্রতিটা লাইনের পাশে একই সংখ্যা, পুরো ক্লাস থেকে হিসাব
                  করা। কারো লাইন মুছে যায় না। এটাই Window Function এর মূল ধারণা, লেসন ১।
                </ListItem>
                <ListItem>
                  <strong>ক্লাসে স্থান:</strong> প্রথম, দ্বিতীয়, তৃতীয়। দুইজনের নম্বর সমান হলে দুইজনেই
                  কি প্রথম, পরের জন তৃতীয় না দ্বিতীয়, এই প্রশ্নের তিন রকম উত্তর, লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>শাখার ভেতরে স্থান:</strong> ক শাখায় প্রথম, খ শাখায় প্রথম, প্রতিটা শাখা
                  আলাদা করে গোনা। একটা জানালাকে দলে দলে ভাগ করা, লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>জমতে থাকা নম্বর:</strong> প্রথম পরীক্ষা, প্রথম দুই পরীক্ষা মিলিয়ে, প্রথম
                  তিন মিলিয়ে। প্রতিটা লাইনের জানালা উপর থেকে তার নিজের লাইন পর্যন্ত, লেসন ৪।
                </ListItem>
                <ListItem>
                  <strong>আগের পরীক্ষা থেকে কত বাড়ল:</strong> নিজের লাইন থেকে ঠিক আগের লাইনটা দেখা,
                  লেসন ৫।
                </ListItem>
                <ListItem>
                  <strong>প্রতি শাখার সেরা তিনজন</strong>, আর কে কে টানা কয়েকটা পরীক্ষায় উপস্থিত
                  ছিল, লেসন ৬।
                </ListItem>
                <ListItem>
                  <strong>বিষয় অনুযায়ী Column:</strong> বাংলা, ইংরেজি, অঙ্ক পাশাপাশি, যদিও খাতায়
                  প্রতিটা বিষয়ের নম্বর আলাদা লাইনে লেখা ছিল, লেসন ৭।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সবগুলোর পেছনে একটাই নীতি: <strong>Window Function কোনো Row মোছে না</strong>, প্রতিটা Row
                এর পাশে একটা নতুন Column বসায়, যেটা একটা জানালা দিয়ে দেখা কয়েকটা Row থেকে হিসাব করা।
                আর সেই জানালা তিনটা প্রশ্নের উত্তরে তৈরি হয়। কোন Row গুলো একই দলে, যার নাম PARTITION
                BY। দলের ভেতরে কোন ক্রমে, যার নাম ORDER BY। আর বর্তমান Row থেকে কতদূর পর্যন্ত দেখা যাবে,
                যার নাম Frame। তিনটার উত্তর আপনি না দিলে Database নিজে একটা ধরে নেয়, আর উপরের তিনটা
                চমক ঠিক সেখান থেকেই আসে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে প্রথম আর দ্বিতীয় কাজের একটা ছোট রূপ, একটা Query তেই। প্রতিটা Booking এর
                পাশে সব Booking এর গড়, আর টাকার অঙ্কে তার স্থান। SQL এর নিয়ম এখনই জানার দরকার নেই,
                শুধু Run চাপুন আর দেখুন, প্রতিটা Row তো আছেই, পাশে নতুন দুইটা Column ও আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Booking, পাশে গড় আর স্থান"
              query={`SELECT booking_id,
       total_bdt,
       round(avg(total_bdt) OVER (), 2) AS avg_all,
       rank() OVER (ORDER BY total_bdt DESC) AS rnk
FROM bookings
ORDER BY booking_id
LIMIT 6;`}
              caption="ছয়টা Row আসবে, প্রতিটায় avg_all একই, 24679.17, কারণ গড়টা চব্বিশটা Booking এর উপর। Booking 2 এর স্থান 1, যদিও তালিকায় আছে শুধু ছয়টা Row: জানালাটা LIMIT এর আগে পুরো চব্বিশটা Row দেখেছিল। Booking 2 আর Booking 14 দুইটাই 50000.00, তাই দুইটাই 1, আর পরের জন সরাসরি 3। Booking 6 এর 4 এসেছে কারণ 36000.00 এর আরও দুইটা Booking আছে, তিনজনই 4। কেন এমন, আর অন্য উপায়ে কী হয়, লেসন ১ আর ২ এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিয়েছে, এই মডিউল কী যোগ করে, পরের মডিউল কী চায়"
              caption="Module 07 শিখিয়েছে বড় প্রশ্নকে ছোট ধাপে ভাঙতে: একটা Query এর উত্তর আরেকটার ভেতরে, আর WITH দিয়ে নাম দেওয়া ধাপ। Module 08 প্রতিটা Row এর পাশে অনেক Row এর হিসাব বসায়, Row না হারিয়ে: গড়, স্থান, চলমান যোগফল, আগের Row এর সাথে তুলনা। এখানেই পড়ার দিকটা শেষ। Module 09 থেকে আপনি নিজের Table নিজে বানাবেন, ঠিক Data Type বেছে আর Constraint দিয়ে পাহারা বসিয়ে।"
              before={{
                tag: "Module 07",
                title: "Subqueries & CTEs",
                lines: ["Query এর ভেতরে Query", "WITH দিয়ে ধাপে ভাঙা", "দুই ফলাফল যোগ বিয়োগ"],
              }}
              current={{
                tag: "Module 08",
                title: "Window Functions",
                lines: ["Row না হারিয়ে হিসাব", "র‍্যাংক আর চলমান যোগফল", "আগের Row এর সাথে তুলনা"],
              }}
              after={{
                tag: "Module 09",
                title: "Tables & Constraints",
                lines: ["নিজের Table নিজে বানানো", "ঠিক Data Type বাছাই", "Constraint এর পাহারা"],
              }}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Module 07 এর Correlated Subquery দিয়ে প্রত্যেক Customer এর সবশেষ Booking বের করেছিলেন,
              প্রতিটা Row এর জন্য ভেতরের Query একবার করে চলত। এই মডিউলের পর একই প্রশ্ন একবারের হাঁটায়
              উত্তর পাবে, আর Query টা পড়তে হবে অনেক কম। আবার Window Function এর ফলাফল দিয়ে ছাঁকতে আপনার
              Module 07 এর WITH ই লাগবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "what-you-will-learn",
      subHeader: { index: "003", title: "What You Will Learn" },
      title: <SectionTitle>সাতটা লেসন, জানালার তিনটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। নিচে সাতটা লেসন আর তাদের প্রশ্ন।
              যেকোনোটায় চাপ দিলে সরাসরি সেখানে যাবেন, তবে প্রথমবার ক্রম ধরে যাওয়াই ভালো, কারণ প্রতিটা
              লেসন জানালার একটা করে অংশ যোগ করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              track="sql"
              moduleId="window-functions"
              questions={{
                "what-are-window-functions":
                  "প্রতিটা Row রেখেই পাশে সবার গড় বা মোট কীভাবে বসাবেন, GROUP BY এর সাথে এর পার্থক্য কোথায়, আর এর ফলাফল দিয়ে WHERE এ ছাঁকা যায় না কেন?",
                "ranking-functions":
                  "Row গুলোকে ক্রমিক নম্বর আর স্থান কীভাবে দেবেন, আর সমান দুইটা মানের কে কোন নম্বর পাবে, ROW_NUMBER, RANK আর DENSE_RANK কেন তিন রকম উত্তর দেয়?",
                "partition-by":
                  "প্রতিটা Tour, প্রতিটা Customer বা প্রতিটা মাসের ভেতরে আলাদা করে স্থান আর মোট কীভাবে হিসাব করবেন, আর দলের মোটে নিজের ভাগ কত, সেটা কীভাবে পাবেন?",
                "running-totals-frames":
                  "শুরু থেকে জমতে থাকা মোট আর শেষ তিনটা Row এর গড় কীভাবে বানাবেন, আর সমান মানের Row থাকলে চলমান যোগফল কেন হঠাৎ লাফ দেয়?",
                "lag-lead":
                  "আগের আর পরের Row এর মান পাশে এনে কীভাবে তুলনা করবেন, মাস থেকে মাসে কত বাড়ল, আর LAST_VALUE কেন প্রথমবার ভাঙা মনে হয়?",
                "top-n-gaps-islands":
                  "প্রতিটা দলের সেরা কয়েকটা কীভাবে বের করবেন, একই জিনিসের দুইটা Row থেকে নতুনটা কীভাবে রাখবেন, আর টানা কয়েক মাসের দল খোঁজার বিখ্যাত সমস্যাটা কীভাবে সমাধান করবেন?",
                pivoting:
                  "আলাদা লাইনে থাকা মানগুলোকে মাস ধরে এক লাইনে পাশাপাশি Column বানিয়ে কীভাবে ছক বানাবেন, আর উল্টো পথে Column কে আবার Row এ কীভাবে ফেরাবেন?",
              }}
              footer="সাতটা লেসন তিন ভাগে মনে রাখা সহজ। প্রথম তিনটা জানালার দুইটা প্রশ্ন শেখায়: কোন Row গুলো একসাথে, আর কোন ক্রমে। পরের দুইটা তৃতীয় প্রশ্নটা, বর্তমান Row থেকে কতদূর, আর তার উপর দাঁড়ানো চলমান যোগফল ও আগের পরের তুলনা। শেষ দুইটা সব মিলিয়ে কাজের Report বানায়, আর শেষেরটায় পুরো মডিউলের Recap।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনগুলো একটা গল্পের মতো পড়ুন। শুরু <strong>What a Window Function Is</strong>{" "}
                দিয়ে। এখানে আপনি দেখবেন একটা পরিচিত Aggregate, যেমন avg বা sum, এর পরে শুধু OVER ()
                লিখলেই সেটা আর Row গুলো গলায় না, প্রতিটা Row এর পাশে একই উত্তর বসায়। একই Data তে GROUP
                BY আর Window পাশাপাশি চালিয়ে দেখবেন কোথায় পার্থক্য। আর এখানেই প্রথম দৃশ্যের Error টার
                রহস্য মিটবে: Query এর কোন ধাপে জানালাগুলো খোলে, আর কেন WHERE তখনো সেগুলো দেখতে পায় না।
                সমাধানও সেখানে, Module 07 এর WITH দিয়ে একটা ধাপ বাড়িয়ে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় লেসন <strong>ROW_NUMBER, RANK and DENSE_RANK</strong> স্থান দেওয়া শেখায়। সমান
                দুইটা মান থাকলে তিনটা Function তিন রকম আচরণ করে, আর আপনি একটা টেবিলে তিনটাকে পাশাপাশি
                দেখবেন, Island Tours এর আসল সমান Rating, দাম আর সিটের উপর। দ্বিতীয় দৃশ্যের সমস্যাটাও এখানে
                মিটবে: ROW_NUMBER কেন সমান চারটা Review এর একটাকে নিজের মতো এগিয়ে দেয়, আর কীভাবে একটা
                নিশ্চিত ক্রম বসাতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয় লেসন <strong>PARTITION BY</strong> জানালাটাকে দলে দলে ভাগ করে। প্রতিটা Customer এর
                ভেতরে তাঁর Booking গুলোর ক্রম, প্রতিটা Tour এর ভেতরে স্থান, দলের মোটে নিজের ভাগ কত শতাংশ।
                একই Query তে আলাদা আলাদা দল দিয়ে কয়েকটা জানালা, আর একই প্রশ্নের উত্তর GROUP BY, Window আর
                Correlated Subquery দিয়ে তিনভাবে।
              </ContentParagraph>
              <ContentParagraph>
                চতুর্থ লেসন <strong>Running Totals and Window Frames</strong> জানালার তৃতীয় প্রশ্নটা
                খোলে: বর্তমান Row থেকে কতদূর। শুরু থেকে জমতে থাকা মোট, শেষ তিনটা Row এর গড়। আর এখানে আছে
                এই মডিউলের সবচেয়ে চুপচাপ ফাঁদটা: ORDER BY দিলে Database নিজে যে Frame ধরে নেয়, সমান মানের
                Row থাকলে সেটা চলমান যোগফলকে একসাথে কয়েক ধাপ লাফিয়ে দেয়। আসল Row দিয়ে নিজের চোখে দেখবেন,
                আর ROWS, RANGE আর GROUPS এর পার্থক্য দিয়ে সারাবেন।
              </ContentParagraph>
              <ContentParagraph>
                পঞ্চম লেসন <strong>LAG, LEAD, FIRST_VALUE and NTILE</strong> নিজের Row থেকে আগের বা পরের
                Row এর মান টেনে আনে। মাস থেকে মাসে আয়ের পরিবর্তন, একজন Customer এর দুইটা Booking এর মাঝে
                কত দিন, দামের ভিত্তিতে ট্যুরগুলোকে চার ভাগে ভাগ করা। আর LAST_VALUE কেন প্রথমবার মনে হয় সে
                কাজ করছে না, তার কারণটা লেসন ৪ এর সেই Frame।
              </ContentParagraph>
              <ContentParagraph>
                ষষ্ঠ লেসন <strong>Top-N per Group, Gaps and Islands</strong> Interview এর সবচেয়ে পরিচিত
                প্রশ্নগুলো সমাধান করে। প্রতিটা দলের সেরা কয়েকটা, যেটা Module 06 এর LATERAL আর Module 03 এর
                DISTINCT ON দিয়েও করা যায়, আর তিনটার তুলনা। একই জিনিসের দুইটা Row থেকে নতুনটা রাখা। আর
                ফাঁক আর দ্বীপের সমস্যা: Island Tours এর Booking গুলো আসলে দুইটা মৌসুমে, ডিসেম্বর থেকে মার্চ
                আর September থেকে October, মাঝে পাঁচ মাস ফাঁকা। তৃতীয় দৃশ্যের ভুল তুলনাটা এখান থেকেই ধরা
                যায়।
              </ContentParagraph>
              <ContentParagraph>
                শেষ লেসন <strong>Pivoting Rows into Columns</strong> মালিকের ছকটা বানায়: প্রতি মাস এক লাইনে,
                প্রতিটা অবস্থা আলাদা Column এ। Module 05 এর FILTER এর পুরনো কৌশল আবার আসবে, সাথে
                PostgreSQL এর crosstab, আর কেন SQL আগে থেকে Column এর সংখ্যা জানতে চায়। আর সবশেষে পুরো
                মডিউলের Recap: একটা Analytics Report, যেখানে স্থান, চলমান যোগফল, মাস থেকে মাসের পরিবর্তন আর
                প্রতি দলের সেরা, সব একসাথে কাজ করে।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউলে স্থান দেওয়ার প্রতিটা অনুশীলনে একটা নিশ্চিত ক্রম চাওয়া হবে, কারণ সমান মানের মধ্যে কে আগে,
                সেটা না বললে ফলাফল প্রতিবার এক নাও হতে পারে।
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
      title: <SectionTitle>Excel এ তো এক মিনিটের কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম আপত্তিটা প্রায় সবাই করেন: Data টা Excel এ নামিয়ে একটা Column টেনে দিলেই তো চলমান
                যোগফল, RANK Function দিলেই তো স্থান। ছোট একটা তালিকায় ঠিক তাই। কিন্তু তিনটা কারণে এই
                মডিউল তবু জরুরি। Data প্রতিদিন বদলায়, আর Excel এর হিসাব প্রতিবার নতুন করে করতে হয়, যেখানে
                Query টা যেকোনো সময় চালালে সেদিনের উত্তর দেয়। Dashboard আর Report Tool গুলো Excel চালায় না,
                সরাসরি Database এ SQL পাঠায়। আর লাখ লাখ Row Excel এ নামানোই যায় না, Database সেগুলো জায়গা
                ছেড়ে না নড়িয়েই হিসাব করে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় আপত্তি: Module 07 এর Subquery দিয়েই তো এগুলো পারি। অনেকগুলো পারেন, সত্যি। কিন্তু
                প্রতিটা নতুন Column এর জন্য একটা নতুন Subquery, আর প্রতিটা Subquery প্রতিটা Row এর জন্য আলাদা
                করে চলতে পারে। চলমান যোগফল বা আগের মাসের সাথে তুলনা Subquery দিয়ে লিখলে Query টা এত লম্বা
                আর জটিল হয় যে ভুলটা চোখে পড়ে না। Window Function একবারের হাঁটায় সবগুলো হিসাব করে, আর প্রতিটা
                জানালা এক লাইনে পড়া যায়।
              </ContentParagraph>
              <ContentParagraph>এই মডিউল বাদ দিয়ে এগোলে খরচটা কোথায় কোথায় দিতে হয়, দেখুন।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>হিসাবের জন্য Row হারানো।</strong> GROUP BY দিয়ে গড় আনলে প্রতিটা Booking হারিয়ে
                  যায়, Booking রাখলে গড় আসে না। দুইটা একসাথে চাইলে দুইটা Query, আর App এ সেগুলো জোড়া।
                </ListItem>
                <ListItem>
                  <strong>অন্যায্য স্থান।</strong> সমান চারজনের একজনকে প্রথম বলা, আর অন্য Database এ অন্য
                  একজনকে। Leaderboard বা পুরস্কারের তালিকায় এই ভুল মানুষের চোখে পড়ে।
                </ListItem>
                <ListItem>
                  <strong>লাফ দেওয়া চলমান যোগফল।</strong> সমান মানের Row থাকলে Chart এর রেখাটা একবারে কয়েক
                  ধাপ উঠে যায়, আর কেউ বলতে পারে না কেন।
                </ListItem>
                <ListItem>
                  <strong>ভুল মাসের সাথে তুলনা।</strong> আগের Row মানেই আগের মাস নয়। ফাঁকা মাসগুলো বাদ পড়ে
                  গেলে তুলনাটা চুপচাপ পাঁচ মাস পিছিয়ে যায়।
                </ListItem>
                <ListItem>
                  <strong>App এ লুপ।</strong> প্রতিটা দলের সেরা তিনটা বের করতে প্রতিটা দলের জন্য আলাদা Query,
                  একশো দলের জন্য একশোটা যাতায়াত।
                </ListItem>
              </ContentList>
              <ContentParagraph>আর কয়েকটা প্রচলিত ভুল ধারণা আছে, যেগুলো এই মডিউল ভাঙবে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Window Function কিছু Row বাদ দেয়।</strong> কখনো না। যতগুলো Row ঢোকে, ততগুলোই
                  বেরোয়। বাদ দিতে হলে আলাদা একটা ধাপ লাগে। লেসন ১।
                </ListItem>
                <ListItem>
                  <strong>ROW_NUMBER, RANK আর DENSE_RANK একই জিনিস।</strong> সমান মান না থাকলে একই উত্তর,
                  সমান থাকলেই তিনটা আলাদা। লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>PARTITION BY আর GROUP BY একই।</strong> দুইটাই দল বানায়, কিন্তু GROUP BY দলকে
                  একটা Row এ গলায়, PARTITION BY প্রতিটা Row রাখে। লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>চলমান যোগফল সবসময় এক Row করে বাড়ে।</strong> Database নিজে যে Frame ধরে নেয়, তাতে
                  সমান মানের সব Row একসাথে যোগ হয়। লেসন ৪।
                </ListItem>
                <ListItem>
                  <strong>LAST_VALUE পুরো তালিকার শেষ মান দেয়।</strong> সাধারণত বর্তমান Row পর্যন্ত দেখা
                  জানালার শেষ মান দেয়, যেটা প্রায়ই নিজের মানই। লেসন ৫।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা দলের সেরা তিনটা মানে লুপ।</strong> একটা Query তেই হয়, আর সেটা Interview এর
                  সবচেয়ে পরিচিত প্রশ্ন। লেসন ৬।
                </ListItem>
                <ListItem>
                  <strong>SQL নিজেই Data দেখে Column বানাতে পারে।</strong> পারে না, Query লেখার সময় Column
                  গুলো জানা থাকতে হয়। কেন, আর কীভাবে সামলাবেন, লেসন ৭।
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
              Window Function প্রতিটা Row রাখে, আর প্রতিটা Row এর জন্য একটা জানালা খোলে। জানালাটা তিনটা
              প্রশ্নে তৈরি: কোন Row গুলো একই দলে, কোন ক্রমে, আর বর্তমান Row থেকে কতদূর। যেকোনো Window
              Function পড়ার সময় এই তিনটার উত্তর মুখে বলুন। কোনোটা লেখা না থাকলে Database নিজে কী ধরে নিল,
              সেটাই প্রায় প্রতিটা চমকের উৎস।
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
              নিচের ছয়টা ঘটনা Island Tours এর মতো যেকোনো দলের কাজে বারবার আসে। একটা বেছে নিন, দেখুন
              এই মডিউল না জানলে ঘটনাটা কেমন যায় আর জানলে কেমন যায়, আর নিচে দেখুন কোন লেসনে উত্তরটা আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "window-in-where",
                  label: "WHERE এ rank() এর Error",
                  situation:
                    "সবচেয়ে দামি তিনটা ট্যুর দেখাতে লিখলেন WHERE rank() OVER (ORDER BY price_bdt DESC) <= 3। চালাতেই এল: window functions are not allowed in WHERE।",
                  without:
                    "আপনি ভাবেন rank() এর বানানে বা বন্ধনীতে ভুল, অনেকক্ষণ এদিক ওদিক বদলান। শেষে স্থানটা App এ হিসাব করে প্রথম তিনটা রাখেন।",
                  withIt:
                    "আপনি জানেন জানালাগুলো খোলে WHERE এর অনেক পরে, তাই WHERE তখনো স্থানটা দেখতে পায় না। স্থানসহ Query টা একটা WITH এর ভেতরে রাখেন, আর বাইরের Query তে WHERE rnk <= 3। তিনটা ট্যুর আসে।",
                  lessons: ["What a Window Function Is", "Top-N per Group, Gaps and Islands"],
                },
                {
                  id: "tied-reviews",
                  label: "সমান Rating, আলাদা প্রথম",
                  situation:
                    "Website এর সেরা Review দেখাতে row_number() দিয়ে স্থান দিলেন। চারটা Review এর Rating পাঁচ। PostgreSQL এ প্রথম হলো Review 5, Staging এর MySQL এ Review 1।",
                  without:
                    "দুই পরিবেশে দুই রকম পাতা দেখে দল ভাবে কোথাও Data আলাদা। আধা দিন খোঁজার পর বোঝা যায় Data একই, শুধু সমান চারটার ক্রম যে যার মতো।",
                  withIt:
                    "আপনি জানেন ROW_NUMBER সমান মানের মধ্যে নিজের মতো একটা ক্রম বেছে নেয়। প্রশ্নটা যদি সেরা Rating এর সবাই হয়, RANK দেন, চারজনই 1। একজনকেই লাগলে ORDER BY তে আরেকটা Column যোগ করেন, যেমন নতুন Review আগে।",
                  lessons: ["ROW_NUMBER, RANK and DENSE_RANK"],
                },
                {
                  id: "third-booking",
                  label: "তৃতীয় Booking এ ছাড়",
                  situation:
                    "মার্কেটিং চায় প্রত্যেক Customer এর তৃতীয় Booking এ দশ শতাংশ ছাড়। কোন Booking কার কততম, সেটা কোনো Column এ লেখা নেই।",
                  without:
                    "App প্রতিটা Booking এর জন্য সেই Customer এর আগের Booking গুনে দেখে। চব্বিশটা Booking এর জন্য চব্বিশটা আলাদা Query।",
                  withIt:
                    "আপনি প্রত্যেক Customer কে আলাদা দল ধরে Booking এর সময় ধরে ক্রমিক নম্বর দেন। একটা Query তেই Rahim Uddin এর Booking 1, 8 আর 17 পায় 1, 2 আর 3, আর তৃতীয়টা Booking 17।",
                  lessons: ["PARTITION BY", "ROW_NUMBER, RANK and DENSE_RANK"],
                },
                {
                  id: "running-revenue",
                  label: "জমতে থাকা আয়ের Chart",
                  situation:
                    "মালিক একটা Chart চান যেখানে রেখাটা প্রতি মাসে আগের সব মাসের আয় নিয়ে উপরে উঠবে। মাসিক আয় আপনার কাছে আছে: 75000, 92000, 19000, 57600, 50500, 129500।",
                  without:
                    "আপনি সংখ্যাগুলো Excel এ নিয়ে একটা Column টেনে যোগ করেন। পরের মাসে নতুন Booking এলে আবার নামাতে হয়, আবার টানতে হয়।",
                  withIt:
                    "আপনি মাসিক আয়ের পাশে sum() OVER (ORDER BY মাস) বসান। 75000 থেকে শুরু করে 167000, 186000, 243600, 294100, আর শেষে 423600, ঠিক মোট confirmed আয়। Query টা যেকোনো দিন চালালে সেদিনের রেখা।",
                  lessons: ["Running Totals and Window Frames"],
                },
                {
                  id: "wrong-month",
                  label: "September কমল কার তুলনায়",
                  situation:
                    "মাসিক Report এ প্রতিটা মাসের পাশে আগের Row এর আয় বসিয়ে বিয়োগ করলেন। September এর পাশে এল -7100.00। Report এ লেখা হলো: আগস্টের চেয়ে সাত হাজার একশো টাকা কম।",
                  without:
                    "মালিক আগস্টের ব্যবসা নিয়ে প্রশ্ন করেন, আর কেউ উত্তর দিতে পারে না, কারণ আগস্টে কোনো confirmed Booking ছিলই না।",
                  withIt:
                    "আপনি জানেন আগের Row মানে আগের মাস নয়। এপ্রিল থেকে আগস্ট ফাঁকা, তাই September এর আগের Row আসলে মার্চ। হয় আগের Row এর মাসটাও পাশে দেখান, নয়তো আগে সব মাসের একটা তালিকা বানিয়ে ফাঁকা মাসে শূন্য বসান, তারপর তুলনা।",
                  lessons: ["LAG, LEAD, FIRST_VALUE and NTILE", "Top-N per Group, Gaps and Islands"],
                },
                {
                  id: "status-grid",
                  label: "মাস বনাম অবস্থার ছক",
                  situation:
                    "মালিক চান একটা ছক: প্রতি মাস এক লাইনে, পাশে confirmed, pending আর cancelled এর সংখ্যা আলাদা Column এ। Database এ অবস্থা থাকে প্রতিটা Booking এর নিজের লাইনে।",
                  without:
                    "আপনি GROUP BY মাস আর অবস্থা দিয়ে নয়টা লাইন পান, প্রতিটায় একটা মাস আর একটা অবস্থা। তারপর Excel এর Pivot Table এ ঘুরিয়ে ছক বানান, প্রতি মাসে আবার।",
                  withIt:
                    "আপনি প্রতিটা অবস্থার জন্য একটা Column লেখেন, count(*) FILTER দিয়ে। ছয়টা মাস, ছয়টা লাইন। যেমন 2026-10 এ confirmed 5, pending 4, cancelled 0, আর 2026-01 এ 4, 0, 2।",
                  lessons: ["Pivoting Rows into Columns"],
                },
              ]}
              footer="প্রতিটা ঘটনার সংখ্যা Island Tours এর Sample Database এ সত্যি চালিয়ে পাওয়া। MySQL 8.4 এ কোথায় কী আলাদা, সেটা নিচে How to Study অংশে।"
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
                  <strong>Dashboard আর Report Tool।</strong> Metabase, Grafana বা যেকোনো BI Tool এ চলমান
                  যোগফল, গত মাসের তুলনায় পরিবর্তন, শীর্ষ দশের তালিকা, এগুলোর পেছনের SQL প্রায় সবসময় Window
                  Function দিয়ে লেখা।
                </ListItem>
                <ListItem>
                  <strong>Leaderboard আর স্থান।</strong> সেরা Seller, সবচেয়ে জনপ্রিয় ট্যুর, পরীক্ষার
                  মেধাতালিকা। সমান হলে কী হবে, সেটা ব্যবসার সিদ্ধান্ত, আর সেই সিদ্ধান্ত SQL এ লেখা হয় RANK
                  বা DENSE_RANK বেছে।
                </ListItem>
                <ListItem>
                  <strong>Data পরিষ্কার।</strong> একই Customer এর দুইটা Account, একই Event এর দুইবার আসা,
                  এমন ডুপ্লিকেট থেকে নতুনটা রেখে বাকিগুলো চিহ্নিত করা ROW_NUMBER দিয়েই হয়। আসল মোছার অংশটা
                  Module 10 এ।
                </ListItem>
                <ListItem>
                  <strong>সময়ের Data।</strong> দুইটা Order এর মাঝে কত দিন, একজন ব্যবহারকারী টানা কত দিন
                  App খুলেছেন, কোন সপ্তাহে বিক্রি থেমে ছিল। LAG আর ফাঁক দ্বীপের কৌশল ছাড়া এগুলো এক Query তে
                  হয় না।
                </ListItem>
                <ListItem>
                  <strong>Pagination এর নম্বর।</strong> তালিকার প্রতিটা Row এর পাশে তার ক্রমিক নম্বর, আর
                  কোন পাতায় সে পড়ে। তবে বড় তালিকায় কেন Module 03 এর Keyset Pagination ভালো, লেসন ২ সেটাও
                  বলবে।
                </ListItem>
                <ListItem>
                  <strong>Interview।</strong> প্রতিটা বিভাগের সবচেয়ে বেশি বেতন পাওয়া তিনজন, দ্বিতীয় সর্বোচ্চ,
                  টানা লগইনের সবচেয়ে লম্বা ধারা, মাসভিত্তিক বৃদ্ধি। SQL Interview এর সবচেয়ে বেশি আসা প্রশ্নগুলোর
                  বড় একটা অংশ এই মডিউল থেকে।
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
      title: <SectionTitle>Island Tours এর পাতাগুলোর পেছনে জানালা</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর মতো একটা দলে এই মডিউলের হাতিয়ারগুলো কোথায় কাজ করে, কয়েকটা জায়গা দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Review এর পাতা।</strong> সেরা Review গুলো Rating ধরে স্থানসহ, সমান হলে নতুনটা আগে।
                  লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>Customer এর পাতা।</strong> প্রতিটা Booking এর পাশে লেখা এটা তাঁর কততম Booking, আর
                  তৃতীয়টায় ছাড়ের চিহ্ন। লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>আয়ের Chart।</strong> মাসিক আয় আর জমতে থাকা মোট, একটাই Query থেকে। লেসন ৪।
                </ListItem>
                <ListItem>
                  <strong>মাসিক Report।</strong> প্রতি মাসের আয়, আগের মাসের তুলনায় পরিবর্তন, আর আগের মাসটা
                  আসলে কোন মাস, যাতে September আর মার্চের তুলনা আর কেউ আগস্ট বলে না পড়ে। লেসন ৫।
                </ListItem>
                <ListItem>
                  <strong>মৌসুমের হিসাব।</strong> কোন কোন টানা মাসে Booking এসেছে: ডিসেম্বর 2025 থেকে মার্চ
                  2026, চার মাসের একটা দ্বীপ, আর September থেকে October 2026, দুই মাসের আরেকটা। লেসন ৬।
                </ListItem>
                <ListItem>
                  <strong>মালিকের ছক।</strong> প্রতি মাস এক লাইনে, অবস্থাগুলো পাশাপাশি। লেসন ৭।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে মাসিক Report এর একটা টুকরো। প্রথম ধাপ m প্রতি মাসের confirmed আয় বের করে,
                Module 07 এর WITH দিয়ে। তারপর প্রতিটা মাসের পাশে দুইটা জানালা: একটা শুরু থেকে এই মাস পর্যন্ত
                যোগ করে, আরেকটা ঠিক আগের Row এর আয় এনে বিয়োগ করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাসিক আয়, জমতে থাকা মোট আর পরিবর্তন"
              query={`WITH m AS (
  SELECT date_trunc('month', booked_at) AS mon,
         sum(total_bdt) AS rev
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY 1
)
SELECT to_char(mon, 'YYYY-MM') AS ym,
       rev,
       sum(rev) OVER (ORDER BY mon) AS running,
       rev - lag(rev) OVER (ORDER BY mon) AS change
FROM m
ORDER BY mon;`}
              caption="ছয়টা মাস আসবে। running শুরু হয় 75000.00 দিয়ে আর শেষ হয় 423600.00 এ, যেটা ঠিক মোট confirmed আয়। change এর প্রথম ঘর ফাঁকা, কারণ ডিসেম্বর 2025 এর আগে কোনো Row নেই। এবার 2026-09 এর লাইনটা দেখুন: change -7100.00, কিন্তু তার আগের Row 2026-03, আগস্ট নয়। এই ফাঁদ আর তার সমাধান লেসন ৫ আর ৬ এ।"
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
                  একই Data তে একবার GROUP BY আর একবার Window চালিয়ে Row সংখ্যা মেলাবেন, আর নিজের চোখে দেখবেন
                  কোনটা Row গলায় আর কোনটা রাখে।
                </ListItem>
                <ListItem>
                  সমান Rating এর চারটা Review এ ROW_NUMBER, RANK আর DENSE_RANK পাশাপাশি বসিয়ে তিনটা উত্তর
                  তুলনা করবেন, তারপর একটা নিশ্চিত ক্রম বসাবেন।
                </ListItem>
                <ListItem>
                  সমান দৈর্ঘ্যের ট্যুরগুলোর উপর একটা চলমান যোগফল চালিয়ে লাফটা নিজে বানাবেন, তারপর Frame বদলে
                  সেটা সারাবেন।
                </ListItem>
                <ListItem>
                  মাসিক Report এ আগের মাসটার নামও পাশে বসিয়ে September আর মার্চের তুলনাটা ধরবেন, আর ফাঁকা
                  মাসগুলো পূরণ করবেন।
                </ListItem>
                <ListItem>
                  মালিকের ছকটা নিজে বানাবেন, আর তারপর সেটাকে আবার Row এ ফিরিয়ে দেখবেন একই সংখ্যা আসে কি না।
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
                "গড় আর প্রতিটা Row একসাথে চাইলে দুইটা Query চালিয়ে App এ জোড়া দেন",
                "window functions are not allowed in WHERE দেখে বুঝতে পারেন না কী করবেন",
                "স্থান দিতে যেকোনো একটা Function বসান, সমান হলে কী হয় ভাবেন না",
                "প্রতিটা Customer এর কততম Booking গুনতে প্রতি Booking এ আলাদা Query পাঠান",
                "চলমান যোগফল হঠাৎ লাফ দিলে কারণ খুঁজে পান না",
                "আগের Row এর সাথে তুলনাকে আগের মাসের সাথে তুলনা বলে ধরে নেন",
                "মাস বনাম অবস্থার ছক বানাতে Data নামিয়ে Excel এ ঘোরান",
              ]}
              after={[
                "প্রতিটা Row রেখে পাশে গড়, মোট বা স্থান একটা Query তেই বসান",
                "Window এর ফলাফল দিয়ে ছাঁকতে একটা WITH ধাপ যোগ করেন, আর কেন লাগে বোঝাতে পারেন",
                "সমান মানে কী হবে ঠিক করে ROW_NUMBER, RANK বা DENSE_RANK জেনেবুঝে বাছেন",
                "PARTITION BY দিয়ে প্রতিটা দলের ভেতরে আলাদা ক্রম আর মোট এক হাঁটায় হিসাব করেন",
                "Frame নিজে লিখে দেন, তাই সমান মানের Row এ চলমান যোগফল আর লাফ দেয় না",
                "LAG দিয়ে তুলনার সময় আগের Row টা কোন মাস, সেটাও দেখেন, আর ফাঁকা মাস পূরণ করেন",
                "Row কে Column আর Column কে Row বানিয়ে ছক তৈরি করেন, SQL এর ভেতরেই",
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
                এই মডিউলের মানদণ্ড হলো যেকোনো Window Function দেখে তার জানালাটা আঁকতে পারা। কেউ আপনাকে
                sum(rev) OVER (ORDER BY mon) দেখালে আপনি বলবেন, এখানে কোনো দল নেই, তাই পুরো ফলাফল একটাই
                জানালা। ক্রম মাস ধরে। আর Frame লেখা নেই, তাই Database ধরে নিয়েছে শুরু থেকে বর্তমান Row এর
                মান পর্যন্ত, সমান মানের সবগুলো Row সহ। মাসগুলো আলাদা বলে এখানে সমস্যা নেই, কিন্তু একই মাসে
                দুইটা Row থাকলে দুইটা একসাথে যোগ হতো।
              </ContentParagraph>
              <ContentParagraph>
                এটা পারলে আপনি একটা Window Function কে আর জাদু হিসেবে দেখবেন না, দেখবেন তিনটা প্রশ্নের
                উত্তর হিসেবে।
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
                <strong>আগে যা লাগবে।</strong> Module 05 এর Aggregate আর GROUP BY, কারণ প্রথম লেসনই সেই
                avg আর sum দিয়ে শুরু হয়, আর পুরো মডিউলের তুলনাটা GROUP BY এর সাথে। Module 07 এর WITH, কারণ
                Window এর ফলাফল দিয়ে ছাঁকতে প্রায় সবসময় একটা WITH লাগে। Module 04 এর date_trunc আর to_char,
                কারণ মাসভিত্তিক Report এর প্রতিটা Query মাস বানিয়েই শুরু হয়। আর Module 03 এর ORDER BY আর
                NULL, কারণ জানালার ক্রম আর LAG এর প্রথম ফাঁকা ঘর দুইটাই সেখান থেকে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>সময়।</strong> পুরো মডিউলের জন্য চার পাঁচ দিন ধরে রাখুন। সাতটা লেসন পড়তে মোট প্রায়
                পৌনে চার থেকে পৌনে পাঁচ ঘণ্টা লাগে। লেসন ৪ আর লেসন ৬ এর জন্য একটু বেশি সময় রাখুন। Frame
                ধারণাটা একবার পড়ে বসে না, আর ফাঁক দ্বীপের কৌশলটা প্রথমবার জাদুর মতো লাগে, দুইবার নিজে
                চালিয়ে দেখলে বসে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ক্রম।</strong> লেসন ১ থেকে ৩ ক্রম ধরে পড়ুন, কারণ সেখানে জানালার প্রথম দুইটা প্রশ্ন
                একটার পর একটা আসে। লেসন ৪ এর পরেই লেসন ৫, কারণ LAST_VALUE এর রহস্য লেসন ৪ এর Frame ছাড়া
                বোঝা যায় না। লেসন ৬ আগের সবগুলো একসাথে ব্যবহার করে। লেসন ৭ এর ছক বানানো আলাদাভাবেও পড়া
                যায়, তবে সেখানে পুরো মডিউলের Recap, তাই সেটা শেষে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>জানালাটা আঁকুন।</strong> এই মডিউলের সবচেয়ে বড় অনুশীলন একটাই: যেকোনো Window Function
                চালানোর আগে একটা Row বেছে মুখে বলুন, এই Row এর জানালায় কোন কোন Row আছে। তারপর চালিয়ে
                মিলিয়ে নিন। অনুমান না মিললে, ধরুন ভেবেছিলেন চলমান যোগফল এক Row করে বাড়বে অথচ তিনটা Row এ
                একই সংখ্যা এল, শেখার আসল জিনিসটা ঠিক সেখানে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Query বক্স আর অনুশীলন।</strong> প্রতিটা বক্স আগে যেমন আছে তেমন চালান, তারপর একটা
                জিনিস বদলান: RANK কে ROW_NUMBER, OVER () এর ভেতরে একটা PARTITION BY, বা ORDER BY তে একটা
                বাড়তি Column। অনুশীলনের বক্সে আগে নিজে অন্তত দুইবার চেষ্টা করুন, তারপর Hint, আর সবার শেষে
                Solution। আপনার Query সমাধানের মতো দেখতে না হলেও চলবে, ফলাফল এক হলেই সঠিক। বক্সের কোনো
                Query দশ সেকেন্ডের বেশি চললে বক্স সেটা থামিয়ে Database নতুন করে শুরু করে, তাই ভয় ছাড়াই
                পরীক্ষা করুন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>MySQL এর ভিডিও দেখছেন?</strong> MySQL এ Window Function এসেছে 8.0 থেকে, তাই 8.4
                এ এই মডিউলের বেশিরভাগ Query হুবহু চলে। এই পাতার মাসিক Report টা MySQL 8.4 এ চালিয়ে দেখা
                হয়েছে, date_trunc এর বদলে DATE_FORMAT দিয়ে, আর running আর change এর প্রতিটা সংখ্যা একই। তিনটা
                জিনিস যাচাই করে দেখা হয়েছে, যেগুলো মনে রাখার মতো। WHERE এ Window Function দিলে MySQL দেয়
                ERROR 3593, You cannot use the window function &apos;rank&apos; in this context। Frame এর GROUPS ধরনটা MySQL 8.4
                এ নেই, ERROR 1235 দেয়, যেখানে PostgreSQL এ আছে। আর সমান চারটা Review এর মধ্যে ROW_NUMBER
                এর প্রথম স্থান MySQL দিয়েছে Review 1 কে, PostgreSQL দিয়েছে Review 5 কে, যেটা দ্বিতীয় দৃশ্যের
                কারণ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>আটকে গেলে।</strong> প্রথমে Window Function টা সরিয়ে বাকি Query টা চালান, দেখুন
                জানালায় ঢোকার আগে কোন Row গুলো আছে। Error এ window functions are not allowed থাকলে
                ফলাফলটা একটা WITH এ রেখে বাইরে ছাঁকুন। স্থান অদ্ভুত লাগলে ORDER BY এর Column এ সমান মান আছে
                কি না দেখুন। চলমান যোগফল লাফ দিলে Frame লেখা আছে কি না দেখুন। আর আগের পরের তুলনা ভুল লাগলে
                আগের Row টার নিজের মানটাও পাশে বসিয়ে দেখুন, সেটা আসলে কোন Row।
              </ContentParagraph>
              <ContentParagraph>
                <strong>পরের ধাপ।</strong> এখান থেকে সোজা চলে যান প্রথম লেসনে,{" "}
                <strong>What a Window Function Is</strong>, যেখানে আপনি প্রথমবার একটা পরিচিত avg এর পরে OVER ()
                লিখবেন, আর দেখবেন চব্বিশটা Row এর একটাও হারায় না।
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
        "What a Window Function Is",
        "OVER দিলে Aggregate আর Row গলায় না, প্রতিটা Row এর পাশে হিসাব বসায়, আর জানালাগুলো WHERE এর পরে খোলে বলে ছাঁকতে একটা WITH লাগে",
      ],
      [
        "ROW_NUMBER, RANK and DENSE_RANK",
        "তিনটাই ক্রম দেয়, পার্থক্য শুধু সমান মানে, আর নিশ্চিত ক্রম চাইলে ORDER BY তে একটা অনন্য Column যোগ করতে হয়",
      ],
      [
        "PARTITION BY",
        "জানালাকে দলে দলে ভাগ করে প্রতিটা দলের ভেতরে আলাদা ক্রম আর মোট হিসাব হয়, কোনো Row না গলিয়ে",
      ],
      [
        "Running Totals and Window Frames",
        "Frame বলে বর্তমান Row থেকে কতদূর দেখা যাবে, আর না লিখলে সমান মানের Row গুলো একসাথে যোগ হয়ে চলমান যোগফল লাফ দেয়",
      ],
      [
        "LAG, LEAD, FIRST_VALUE and NTILE",
        "আগের আর পরের Row এর মান পাশে আনা যায়, তবে আগের Row মানেই আগের মাস নয়, আর LAST_VALUE এর জন্য Frame নিজে লিখতে হয়",
      ],
      [
        "Top-N per Group, Gaps and Islands",
        "প্রতিটা দলের সেরা কয়েকটা, ডুপ্লিকেট থেকে নতুনটা, আর টানা মাস বা দিনের দল, তিনটাই ক্রমিক নম্বরের কৌশলে এক Query তে",
      ],
      [
        "Pivoting Rows into Columns",
        "আলাদা লাইনের মানগুলো FILTER বা crosstab দিয়ে পাশাপাশি Column হয়, তবে Column গুলো Query লেখার সময়েই জানা থাকতে হয়",
      ],
    ],
  },
};
