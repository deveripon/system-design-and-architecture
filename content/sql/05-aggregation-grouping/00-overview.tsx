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

export const aggregationGroupingOverviewContent: TopicData = {
  id: "aggregation-grouping-overview",
  introduction: {
    badge: "MODULE 05 · OVERVIEW",
    title: <SectionTitle>হাজার Row থেকে একটা উত্তর</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 04 শেষে আপনি প্রতিটা Row এর ভেতরের মানকে আকার দিতে পারেন। লেখা
          পরিষ্কার করা, টাকার হিসাব নির্ভুল রাখা, ঢাকার তারিখ বের করা, ফাঁকা ঘরে
          একটা বিকল্প বসানো, সবই এখন আপনার হাতে। কিন্তু খেয়াল করুন, এতদিন আপনার
          প্রতিটা Query এর উত্তরে যতগুলো Row ঢুকেছে, প্রায় ততগুলো Row ই বের হয়েছে।
          চব্বিশটা Booking ঢুকলে চব্বিশটা লাইন, হয়তো একটু ছাঁকা, একটু সাজানো।
        </ContentParagraph>
        <ContentParagraph>
          অথচ ব্যবসার বেশিরভাগ প্রশ্ন এরকম নয়। মালিক জানতে চান না চব্বিশটা
          Booking এর প্রতিটা কী, তিনি জানতে চান মোট কত টাকা এল, গড়ে একটা Booking এ
          কতজন যান, কোন মাসে বিক্রি বেশি, আর কোন পদ্ধতিতে বেশি টাকা আসে। এগুলো
          অনেক Row থেকে একটা উত্তর, অথবা প্রতিটা দলের জন্য একটা উত্তর। এই মডিউল
          ঠিক সেটাই শেখায়: অনেক Row কে গুনে, যোগ করে, গড় করে একটা সংখ্যায় আনা, Row
          গুলোকে দলে ভাগ করা, দল ছাঁকা, এক দলের ভেতরে আলাদা আলাদা জিনিস গোনা,
          উপমোট আর সর্বমোট বসানো, আর একটা দলের সব মান এক লাইনে জোড়া দেওয়া।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা লেসন নয়, মডিউলের মানচিত্র। এখানে জানবেন মডিউলটা কেন দরকার,
          ছয়টা লেসনে কী কী শিখবেন, না শিখলে কোথায় কোথায় চুপচাপ ভুল সংখ্যা Report এ
          চলে যায়, কাজের জায়গায় এগুলো কোথায় লাগে, আর বাস্তবে আপনি ধাপে ধাপে কী কী
          করবেন। কোনো Function বা নিয়ম এখানে শেখানো হবে না, শুধু দেখানো হবে কোনটা
          কোন লেসনে আছে আর কেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "দিনশেষে দোকানদার এক একটা রসিদ পড়ে শোনান না। তিনি রসিদগুলো জিনিস ধরে আলাদা আলাদা গাদা করেন, প্রতিটা গাদা গোনেন আর যোগ করেন, তারপর খাতার নিচে লেখেন আজকের মোট। মালিক শুধু ওই শেষ লাইনটাই পড়েন।",
      author: "Aggregation & Grouping",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>Row অনেক, কিন্তু প্রশ্ন একটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মাসের প্রথম দিন। ফারুক সাহেব আগের মাসের Report টা পেয়ে খুশি, তারিখগুলো
                এখন ঢাকার, দামগুলো দুই দশমিকে, ফাঁকা ঘরে লেখা No phone। কিন্তু মালিক
                Report টা দেখে একটা কথাই বলেছেন: এত লাইন পড়ার সময় আমার নেই, আমাকে
                শুধু সংখ্যাগুলো দিন। তাই ফারুক সাহেব এবার এসেছেন একেবারে অন্য রকম একটা
                তালিকা নিয়ে, যার প্রতিটা চাওয়ার উত্তর একটা বা কয়েকটা সংখ্যা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  এখন পর্যন্ত মোট কতগুলো Booking, মোট কতগুলো সিট, আর একটা Booking এ
                  গড়ে কতজন।
                </ListItem>
                <ListItem>
                  confirmed, pending আর cancelled, প্রতিটা অবস্থায় কতগুলো Booking আর
                  কত টাকা। আর আসল আয় কত, মানে শুধু confirmed এর টাকা।
                </ListItem>
                <ListItem>
                  মাস ধরে হিসাব: প্রতি মাসে কতগুলো Booking এল, তার কতগুলো confirmed, আর
                  confirmed থেকে কত টাকা। সবার নিচে একটা সর্বমোটের লাইন।
                </ListItem>
                <ListItem>
                  bKash, Nagad, Card আর Bank, কোন পদ্ধতিতে কতগুলো Payment আর কত টাকা।
                </ListItem>
                <ListItem>
                  কোন Departure এ চারজনের বেশি সিট ধরা আছে, যাতে Guide আগে থেকে বড়
                  নৌকা ঠিক করতে পারেন।
                </ListItem>
                <ListItem>
                  কোন Customer রা একবারের বেশি বুক করেছেন, আর প্রতিজনের পাশে তাঁর
                  Booking নম্বরগুলো এক লাইনে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শুধু Module 04 পর্যন্ত জানলে এই তালিকা কেমন যায়, ভাবুন। আপনি সব
                Booking বের করে Excel এ নেন, তারপর হাতে হাতে Filter দিয়ে গোনেন। মোট
                আয় লিখতে গিয়ে সব Booking এর টাকা যোগ করেন, আসে 592300.00, আর সেটাই
                Report এ যায়। অথচ তার ভেতরে বাতিল হওয়া Booking এর টাকাও আছে, আর
                অপেক্ষায় থাকা Booking এর টাকাও। আসল আয় 423600.00। কোনো Error আসেনি,
                সংখ্যাটা দেখতেও ঠিক লেগেছে, শুধু উত্তরটা অন্য একটা প্রশ্নের।
              </ContentParagraph>
              <ContentParagraph>
                এক সহকর্মী পাশ থেকে বলেন, SQL দিয়েই তো গোনা যায়। আপনি চেষ্টা করেন,
                প্রতিটা অবস্থার পাশে তার সংখ্যা চাই, তাই লেখেন status আর একটা গোনার
                Function পাশাপাশি। PostgreSQL থেমে যায় এমন একটা Error দিয়ে, যার মানে
                প্রথমবার পড়ে বোঝা যায় না: column &quot;bookings.status&quot; must appear in
                the GROUP BY clause or be used in an aggregate function। এরপর একবারের
                বেশি বুক করা Customer খুঁজতে গোনার শর্তটা WHERE এ বসান, আর আসে আরেকটা
                Error: aggregate functions are not allowed in WHERE।
              </ContentParagraph>
              <ContentParagraph>
                এবার আরেকটা দৃশ্য। আপনি Island Tours এর Admin Panel বানাচ্ছেন। উপরে
                চারটা ছোট কার্ড থাকবে: মোট Booking, মোট সিট, গড় সিট, আর বাতিলের হার।
                সহজ পথটা মনে হয় সব Booking App এ নিয়ে এসে JavaScript এ একটা Loop চালানো।
                চব্বিশটা Booking এ সেটা চলে যায়। কিন্তু Island Tours যেদিন বড় হবে, সেদিন
                প্রতিবার Panel খোলার সময় লাখো Row Database থেকে Network পেরিয়ে App এ
                আসবে, শুধু চারটা সংখ্যা বের করার জন্য। আর Customer গোনার একটা কার্ডে
                কেউ ভুল করে ফোন নম্বর গুনে ফেলেন, দেখায় 10, অথচ Customer 15 জন, কারণ
                পাঁচজনের ফোন নম্বর নেই।
              </ContentParagraph>
              <ContentParagraph>
                দুই দৃশ্যের মূল কথা একই। প্রশ্নটা যখন অনেক Row নিয়ে, তখন উত্তরটা
                Database কে দিয়েই বের করাতে হয়, আর সেই কাজের কয়েকটা নিজস্ব নিয়ম আছে।
                কোনটা গোনা হবে আর কোনটা বাদ পড়বে, কোন শর্ত দলের আগে বসবে আর কোনটা
                পরে, আর ফলাফলে কোন Column থাকতে পারে আর কোনটা পারে না। নিয়মগুলো না
                জানলে কখনো Error আসে, আর কখনো, যেটা আরও বিপজ্জনক, ভুল সংখ্যাটাই
                নিঃশব্দে Report এ চলে যায়।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল শেষে ফারুক সাহেবের ছয়টা চাওয়ার প্রতিটা আপনি SQL এ লিখবেন,
                Excel ছাড়া, আর প্রতিটা সংখ্যার পাশে বলতে পারবেন কোন Row গোনা হয়েছে আর
                কোনগুলো ইচ্ছা করে বাদ দেওয়া হয়েছে। দুইটা Error ও কোথা থেকে আসে, এক
                লাইনে বলে দিতে পারবেন।
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
              592300 আর 423600 এর ফারাক কোথা থেকে, দুইটা Error এর মানে কী, আর ফোন
              গুনলে কেন 10 আসে, এখানে ইচ্ছা করেই ব্যাখ্যা দেওয়া হয়নি। প্রতিটার কারণ
              আর সমাধান নির্দিষ্ট একটা লেসনে আছে, যেটা নিচের মানচিত্রে দেখবেন। মডিউল
              শেষে এই অংশটা আবার পড়লে প্রতিটা ভুলের কারণ আপনি এক লাইনে বলে দিতে
              পারবেন।
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
                একটা মুদি দোকানের দিনশেষের হিসাবের কথা ভাবুন। সারাদিন প্রতিটা বিক্রির
                জন্য একটা করে রসিদ কাটা হয়েছে। রাতে দোকানদার রসিদগুলো এক জায়গায়
                নেন। প্রথমে গোনেন আজ কতগুলো রসিদ, আর সব মিলিয়ে কত টাকা। তারপর রসিদগুলো
                জিনিস ধরে আলাদা গাদা করেন: চালের রসিদ এক গাদায়, ডালের আরেক গাদায়।
                প্রতিটা গাদার জন্য আলাদা করে গোনেন আর যোগ করেন। যে গাদায় দুই তিনটা
                মাত্র রসিদ, সেগুলো খাতায় তোলেন না। কোনো গাদার ভেতরে নগদ আর বাকি আলাদা
                করে গোনেন। খাতার প্রতিটা অংশের নিচে একটা উপমোট লেখেন, আর একেবারে নিচে
                দিনের সর্বমোট। আর কখনো একজন বাঁধা খদ্দেরের সব রসিদের নম্বর এক লাইনে লিখে
                রাখেন।
              </ContentParagraph>
              <ContentParagraph>
                SQL এ রসিদ মানে Row, আর এই মডিউলের ছয়টা লেসন আসলে দোকানদারের ওই ছয়টা
                কাজ। সব রসিদ গুনে বা যোগ করে একটা সংখ্যা বের করা, যাকে বলে Aggregate।
                রসিদগুলো জিনিস ধরে গাদা করা, যাকে বলে GROUP BY। ছোট গাদা বাদ দেওয়া, যেটা
                করে HAVING। এক গাদার ভেতরে আলাদা আলাদা জিনিস গোনা, যার নাম Conditional
                Aggregation। উপমোট আর সর্বমোট বসানো, যেটা করে ROLLUP। আর এক গাদার সব
                মান এক লাইনে জোড়া দেওয়া, যেটা করে string_agg।
              </ContentParagraph>
              <ContentParagraph>
                একটা কথা আগে থেকে মনে রাখুন, কারণ পুরো মডিউল এর উপর দাঁড়িয়ে। Aggregate
                দিলে অনেক Row ঢোকে আর একটা Row বের হয়। GROUP BY দিলে প্রতিটা দলের জন্য
                একটা করে Row বের হয়। তাই ফলাফলে যা থাকবে, তার প্রতিটা হয় দলটাকে চেনায়,
                নয়তো দলটার হিসাব দেয়। এর বাইরের কোনো Column ফলাফলে রাখা যায় না, কারণ
                একটা দলে বিশটা Row থাকলে বিশটা আলাদা মানের কোনটা দেখানো হবে, Database
                জানে না। উপরের প্রথম Error টা ঠিক এই কথাটাই বলছিল।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে মালিকের চাওয়া সেই চারটা কার্ডের সংখ্যা, একটা Query তে, আর
                সাথে আসল আয়। নিয়মগুলো এখনো জানার দরকার নেই, শুধু Run চাপুন আর দেখুন,
                চব্বিশটা Booking থেকে কীভাবে একটা মাত্র Row বের হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চব্বিশটা Row থেকে একটা Row"
              query={`SELECT count(*)                  AS bookings,
       sum(seats)                AS seats,
       round(avg(seats), 2)      AS avg_seats,
       sum(total_bdt) FILTER (WHERE status = 'confirmed') AS confirmed_bdt,
       count(*) FILTER (WHERE status = 'cancelled')      AS cancelled
FROM bookings;`}
              caption="একটা মাত্র Row আসবে: 24টা Booking, 53টা সিট, গড়ে 2.21 জন, confirmed থেকে আয় 423600.00, আর বাতিল 3টা। count, sum আর avg লেসন ১ এ, FILTER লেসন ৪ এ। round আর numeric ভাগ আপনি Module 04 এ দেখেছেন। এবার চতুর্থ লাইন থেকে শুধু FILTER (WHERE status = 'confirmed') অংশটা মুছে আবার চালান: confirmed_bdt এর ঘরে আসবে 592300.00, যেটা আসল আয় নয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিয়েছে, এই মডিউল কী যোগ করে, পরের মডিউল কী চায়"
              caption="Module 04 শিখিয়েছে এক Row এর ভেতরের মান বদলাতে আর হিসাব করতে। Module 05 অনেক Row একসাথে ধরে: গোনা, যোগ, গড়, আর দলে ভাগ করে প্রতিটা দলের হিসাব। এই মডিউলের প্রতিটা দল চেনা হবে একটা নম্বর দিয়ে, যেমন departure_id বা customer_id, কারণ নামগুলো থাকে অন্য Table এ। Module 06 সেই দুই Table জোড়া দিতে শেখাবে, আর তখন একই হিসাবের পাশে বসবে ট্যুরের নাম আর Customer এর নাম।"
              before={{
                tag: "Module 04",
                title: "Functions & Expressions",
                lines: ["লেখা আর সংখ্যা সাজানো", "তারিখ আর Time Zone", "NULL এর বদলে বিকল্প"],
              }}
              current={{
                tag: "Module 05",
                title: "Aggregation & Grouping",
                lines: ["অনেক Row থেকে এক উত্তর", "GROUP BY দিয়ে দলে ভাগ", "Report এর আসল হিসাব"],
              }}
              after={{
                tag: "Module 06",
                title: "Joins",
                lines: ["দুই Table এর Row জোড়া", "সংখ্যার পাশে আসল নাম", "যা নেই তা খুঁজে পাওয়া"],
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
      title: <SectionTitle>ছয়টা লেসন, দোকানদারের ছয়টা কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। নিচে ছয়টা লেসন আর তাদের
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
              moduleId="aggregation-grouping"
              questions={{
                "aggregate-functions":
                  "অনেক Row থেকে একটা সংখ্যা কীভাবে বের করবেন, আর COUNT(*) আর COUNT(phone) কেন আলাদা উত্তর দেয়?",
                "group-by":
                  "প্রতিটা অবস্থা, প্রতিটা মাস বা প্রতিটা Departure এর জন্য আলাদা আলাদা হিসাব কীভাবে বের করবেন, আর ফলাফলে কোন Column রাখা যায়?",
                "having-vs-where":
                  "দল বানানোর আগে ছাঁকবেন নাকি পরে, আর একবারের বেশি বুক করা Customer খুঁজতে শর্তটা কোথায় বসবে?",
                "conditional-aggregation":
                  "একই Query তে confirmed, pending আর cancelled আলাদা আলাদা Column এ কীভাবে গুনবেন, আর বাতিলের হার কীভাবে বের করবেন?",
                "rollup-cube":
                  "মাসিক Report এ প্রতিটা অংশের উপমোট আর সবার নিচে সর্বমোট, একটা Query তেই কীভাবে বসাবেন?",
                "string-array-agg":
                  "একজন Customer এর সব Booking নম্বর বা একটা Booking এর সব Payment পদ্ধতি এক লাইনে কীভাবে জোড়া দেবেন?",
              }}
              footer="ছয়টা লেসন দুই ভাগে মনে রাখা সহজ। প্রথম তিনটা হিসাবের মূল কাঠামো: গোনা আর যোগ, দলে ভাগ, আর দল ছাঁকা। পরের তিনটা সেই কাঠামোর উপর Report কে ধারালো করে: এক দলে কয়েক রকম গোনা, উপমোট আর সর্বমোট, আর তালিকা জোড়া দেওয়া। শেষ লেসনে পুরো মডিউলের একটা Recap আছে।"
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
                <strong>লেসন ১, COUNT, SUM, AVG, MIN, MAX।</strong> প্রথমে আসে সবচেয়ে
                সরল কাজ, পুরো Table কে একটা সংখ্যায় আনা। কতগুলো Booking, মোট কত টাকা,
                গড়ে কতজন, সবচেয়ে সস্তা আর সবচেয়ে দামি ট্যুর কত। এখানেই ফোনের রহস্য খুলবে:
                COUNT(*) গোনে Row, আর COUNT(phone) গোনে শুধু সেই Row গুলো যেখানে ফোন
                জানা আছে। Module 03 এর NULL এখানে আবার দেখা দেবে, কারণ এই Function গুলো
                NULL কে নিঃশব্দে বাদ দেয়। আর লেসনের শেষে দেখবেন, একটা Aggregate এর
                পাশে একটা সাধারণ Column বসালে কেন Error আসে, যেটা পরের লেসনের দরজা।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ২, GROUP BY।</strong> তারপর গাদা করা। একটা সংখ্যা নয়, প্রতিটা
                দলের জন্য একটা করে সংখ্যা: প্রতিটা অবস্থায় কতগুলো Booking, প্রতিটা
                Payment পদ্ধতিতে কত টাকা, প্রতিটা দেশ থেকে কতজন Customer, আর Module 04
                এর date_trunc দিয়ে প্রতিটা মাসে কত বিক্রি। সেই প্রথম Error টার মানে এখানে
                পুরো পরিষ্কার হবে, আর জানবেন ফলাফলে কোন Column রাখা যায় আর কেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৩, HAVING vs WHERE।</strong> দল বানানো গেল, এবার ছাঁকা।
                কিছু শর্ত প্রতিটা Row এর উপর, যেমন শুধু confirmed Booking, আর কিছু শর্ত
                পুরো দলের উপর, যেমন যাঁদের Booking দুইটা বা তার বেশি। প্রথমটা বসে WHERE এ,
                দলের আগে। দ্বিতীয়টা বসে HAVING এ, দলের পরে। দ্বিতীয় Error টার উত্তর এখানে।
                Module 03 এ যে লজিক্যাল ক্রম শিখেছিলেন, এখানে তার আসল কাজ দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৪, Conditional Aggregation and FILTER।</strong> এবার Report
                ধারালো হয়। প্রতিটা Departure এর জন্য একটা Row, আর তার পাশে confirmed,
                pending আর cancelled তিনটা আলাদা Column, একটাই Query তে। আসল আয় আর মোট
                টাকার ফারাক এখানেই সমাধান হবে, আর Module 04 এর পূর্ণ সংখ্যার ভাগের ফাঁদ
                আবার দেখা দেবে, এবার বাতিলের হার বের করতে গিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৫, ROLLUP, CUBE and GROUPING SETS।</strong> মাসিক Report এ
                শুধু প্রতিটা মাসের লাইন যথেষ্ট নয়, নিচে একটা সর্বমোটও চাই, আর কখনো প্রতিটা
                অংশের উপমোট। এই লেসন সেগুলো একটা Query তেই বসাতে শেখায়, আর শেখায় উপমোটের
                লাইনে যে ফাঁকা ঘর আসে, সেটা অজানা মান নয়, একটা চিহ্ন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>লেসন ৬, string_agg and array_agg।</strong> শেষে, একটা দলের সব মান
                এক লাইনে। একবারের বেশি বুক করা প্রতিটা Customer এর পাশে তাঁর Booking
                নম্বরগুলো, কমা দিয়ে জোড়া। এই লেসনের শেষে পুরো মডিউলের Recap, যেখানে
                ফারুক সাহেবের ছয়টা চাওয়ার একটা বড় অংশ একটা Report এ লেখা হবে, আর
                তারপর Joins এর দরজা।
              </ContentParagraph>
              <ContentParagraph>
                একটা সীমা আগে থেকে জেনে রাখুন। এই মডিউলের প্রতিটা অনুশীলন একটা মাত্র
                Table এর উপর। তাই দলগুলো চেনা হবে নম্বর দিয়ে, যেমন departure_id 10 বা
                customer_id 1, ট্যুরের নাম বা Customer এর নাম দিয়ে নয়। নামগুলো থাকে অন্য
                Table এ, আর দুই Table জোড়া দেওয়া Module 06 এর কাজ। এটা ইচ্ছা করেই, যাতে
                এক সময়ে একটাই নতুন জিনিস শিখতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা লেসনে আগের মতোই Query বক্স আর অনুশীলনের বক্স আছে। অনুশীলনের
                বক্সে আপনার Query আর লেসনের সমাধান একই Database এ চলে, আর দুই ফলাফল
                মেলানো হয়। সংখ্যার উত্তর তুলনা হয় মানের হিসাবে, তাই 2.21 আর 2.2100 একই
                উত্তর ধরা হয়। আর তারিখ লাগলে ধরে নেওয়া হবে আজ 1 November 2026।
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
      title: <SectionTitle>App এ গুনে নিলেই তো হয়, তাহলে কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা আপত্তি প্রায়ই শোনা যায়: সব Row App এ এনে একটা Loop চালালেই গোনা
                হয়ে যায়, অথবা ORM এর একটা count Function আছে, অথবা Dashboard এর Tool টা
                নিজেই যোগ করে দেয়। কথাগুলো পুরো ভুল নয়, আর ORM বা Tool গুলো ভেতরে আসলে
                এই মডিউলের SQL ই পাঠায়। কিন্তু হিসাবটা Database এর ভেতরে করার তিনটা বড়
                কারণ আছে। প্রথমত, লাখো Row বাইরে না এনে শুধু উত্তরটা আনা অনেক দ্রুত,
                কারণ Network এ যায় একটা Row, লাখটা নয়। দ্বিতীয়ত, একই সংখ্যা পাঁচ জায়গায়
                পাঁচভাবে গোনা হলে পাঁচটা আলাদা উত্তর আসে, আর কোনটা ঠিক কেউ জানেন না।
                তৃতীয়ত, Tool যে SQL লেখে, সেটা কখন ভুল সংখ্যা দেখাচ্ছে বুঝতে হলে আপনাকে
                নিজেকেই নিয়মগুলো জানতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল বাদ দিয়ে এগোলে খরচটা কোথায় কোথায় দিতে হয়, দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>চুপচাপ ভুল মোট।</strong> বাতিল আর অপেক্ষায় থাকা Booking এর টাকা
                  আয়ের সাথে যোগ হয়ে যায়, 423600 এর জায়গায় 592300। Error আসে না, সংখ্যাটা
                  দেখতে ঠিক লাগে, আর ভুলটা ধরা পড়ে অনেক পরে, হিসাব না মিললে।
                </ListItem>
                <ListItem>
                  <strong>ভুল গোনা।</strong> একটা Column গুনলে সেটার ফাঁকা ঘরগুলো বাদ পড়ে।
                  Customer 15 জন, কিন্তু ফোন গুনে 10। গড়ের হিসাবেও NULL বাদ পড়ে, আর কেউ
                  যদি ধরে নেন সেটা শূন্য হিসেবে গোনা হয়েছে, গড়টা ভুল পড়েন।
                </ListItem>
                <ListItem>
                  <strong>বোঝা যায় না এমন Error।</strong> must appear in the GROUP BY
                  clause আর aggregate functions are not allowed in WHERE, দুইটাই নতুনদের
                  সবচেয়ে বেশি আটকায়। নিয়ম না জানলে Error এড়াতে মানুষ এমন কিছু করে বসেন,
                  যা Error টা সরায় কিন্তু উত্তরটা বদলে দেয়।
                </ListItem>
                <ListItem>
                  <strong>ধীর Dashboard।</strong> গোনার জন্য সব Row App এ আনা হলে Data
                  বাড়ার সাথে Page টা ধীর হতে থাকে, আর একদিন Timeout হয়।
                </ListItem>
                <ListItem>
                  <strong>পরের মডিউলগুলো ঝাপসা।</strong> Module 06 এর Join এর পর প্রায়
                  প্রতিটা Report এ GROUP BY থাকবে। Module 07 এর Subquery, Module 08 এর
                  Window Function, Module 22 এর Interview এর প্রশ্ন, সবখানে ধরে নেওয়া হবে
                  আপনি দলে ভাগ করে হিসাব করতে পারেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর কয়েকটা প্রচলিত ভুল ধারণা আছে, যেগুলো এই মডিউল ভাঙবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>COUNT(phone) মানে সব Customer গোনা।</strong> না, এটা গোনে শুধু
                  যাঁদের ফোন জানা। Row গুনতে COUNT(*)। লেসন ১।
                </ListItem>
                <ListItem>
                  <strong>গড় বের করার সময় NULL শূন্য ধরা হয়।</strong> না, avg NULL কে
                  পুরো বাদ দেয়, ভাগের নিচের সংখ্যাতেও ধরে না। লেসন ১।
                </ListItem>
                <ListItem>
                  <strong>GROUP BY দিলে ফলাফল সাজানো আসে।</strong> সব সময় নয়। ক্রম চাইলে
                  ORDER BY লিখতেই হয়, Module 03 এর সেই পুরনো নিয়ম। লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>WHERE আর HAVING একই কাজ করে, যেকোনোটা দিলেই হয়।</strong> না,
                  একটা Row ছাঁকে দলের আগে, আরেকটা দল ছাঁকে দলের পরে। ভুল জায়গায় বসালে
                  কখনো Error, কখনো অপ্রয়োজনীয় বাড়তি কাজ। লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা অবস্থার জন্য আলাদা Query লিখতে হয়।</strong> না, একটা
                  Query তেই কয়েকটা শর্তে আলাদা আলাদা গোনা যায়। লেসন ৪।
                </ListItem>
                <ListItem>
                  <strong>সর্বমোটের লাইনের ফাঁকা ঘর মানে Data হারিয়েছে।</strong> না, ROLLUP
                  ওই ঘর ফাঁকা রাখে চিহ্ন হিসেবে, যে এটা সব দল মিলিয়ে। লেসন ৫।
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
              Aggregate অনেক Row নেয় আর একটা মান দেয়। GROUP BY Row গুলোকে দলে ভাগ করে,
              আর প্রতিটা দলের জন্য একটা Row দেয়। তাই ফলাফলের প্রতিটা Column হয় দলটাকে
              চেনায়, নয়তো দলটার হিসাব দেয়। এই এক নিয়ম মনে থাকলে প্রথম Error টা আর
              কখনো অবাক করবে না, আর কোন শর্ত WHERE এ আর কোনটা HAVING এ, সেটাও নিজে
              থেকে বের হয়ে আসবে।
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
              কাজে বারবার আসে। একটা বেছে নিন, দেখুন এই মডিউল না জানলে ঘটনাটা কেমন যায়
              আর জানলে কেমন যায়, আর নিচে দেখুন কোন লেসনে উত্তরটা আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "count-phone",
                  label: "Customer 15, Card এ 10",
                  situation:
                    "Admin Panel এর একটা Card এ মোট Customer দেখানোর কথা। যিনি Query লিখেছেন, তিনি লিখেছেন count(phone)। Card এ দেখাচ্ছে 10। অথচ Customer Table এ Row 15টা।",
                  without:
                    "আপনি ভাবেন পাঁচজন Customer কোথাও মুছে গেছেন। Table খুলে গুনে দেখেন 15ই আছে। তারপর সন্দেহ করেন Card এর Code এ গোলমাল, আর সেখানে ঘণ্টা খানেক খোঁজেন।",
                  withIt:
                    "আপনি জানেন একটা Column গুনলে তার NULL গুলো বাদ পড়ে, আর পাঁচজনের ফোন নম্বর নেই। count(*) লিখে দেন, Card দেখায় 15। আর যদি সত্যিই জানতে চান কতজনের ফোন আছে, তখন count(phone) ই ঠিক প্রশ্ন।",
                  lessons: ["COUNT, SUM, AVG, MIN, MAX"],
                },
                {
                  id: "group-by-error",
                  label: "must appear in the GROUP BY",
                  situation:
                    "প্রতিটা অবস্থায় কতগুলো Booking, জানতে আপনি লিখলেন SELECT status, count(*) FROM bookings। PostgreSQL থামল: column \"bookings.status\" must appear in the GROUP BY clause or be used in an aggregate function।",
                  without:
                    "আপনি Error টা Google এ খোঁজেন, একটা উত্তরে দেখেন status এর চারপাশে max() বসিয়ে দিলে Error চলে যায়। চলে যায়ও, কিন্তু উত্তরে আসে একটাই Row, তিন অবস্থার আলাদা সংখ্যা নয়।",
                  withIt:
                    "আপনি জানেন count(*) চব্বিশটা Row কে একটা Row বানাচ্ছে, তাই তার পাশে status এর চব্বিশটা মানের কোনটা বসবে, Database জানে না। GROUP BY status যোগ করেন, তিনটা Row আসে: cancelled 3, confirmed 17, pending 4।",
                  lessons: ["GROUP BY"],
                },
                {
                  id: "aggregate-in-where",
                  label: "aggregate in WHERE",
                  situation:
                    "একবারের বেশি বুক করা Customer দের একটা ছাড়ের Email পাঠানো হবে। আপনি লিখলেন WHERE count(*) >= 2। Error এল: aggregate functions are not allowed in WHERE।",
                  without:
                    "আপনি সব Customer এর Booking সংখ্যা App এ এনে সেখানে ছাঁকেন। কাজ হয়, কিন্তু প্রতিবার পুরো তালিকা আনতে হয়, আর Query টা Database এর ভেতরে আর আবার ব্যবহার করা যায় না।",
                  withIt:
                    "আপনি জানেন WHERE চলে দল বানানোর আগে, তখনো গোনার মতো কিছু তৈরি হয়নি। শর্তটা সরিয়ে HAVING count(*) >= 2 এ বসান। নয়জন Customer আসেন, তাঁদের মধ্যে customer_id 1 এর তিনটা Booking।",
                  lessons: ["HAVING vs WHERE"],
                },
                {
                  id: "revenue-mix",
                  label: "আয় 592300, আসলে 423600",
                  situation:
                    "মাসিক Report এ মোট আয় দেখাতে আপনি সব Booking এর total_bdt যোগ করলেন। উত্তর 592300.00। হিসাবরক্ষক বলছেন Bank এ তো এত টাকা আসেনি।",
                  without:
                    "আপনি Payment এর হিসাব আর Booking এর হিসাব মেলাতে বসেন, ফারাক খুঁজে পান না। তারপর প্রতিটা অবস্থার জন্য তিনটা আলাদা Query লিখে Excel এ পাশাপাশি বসান।",
                  withIt:
                    "আপনি এক Query তেই confirmed, pending আর cancelled এর টাকা আলাদা Column এ বের করেন, FILTER দিয়ে। পাশাপাশি দেখা যায় 423600, 117200 আর 51500, যোগ করলে 592300। আয় মানে শুধু প্রথমটা।",
                  lessons: ["Conditional Aggregation and FILTER"],
                },
                {
                  id: "grand-total",
                  label: "সবার নিচে সর্বমোট",
                  situation:
                    "মালিক চান মাসিক Report এর প্রতিটা মাসের লাইনের নিচে একটা সর্বমোটের লাইন, আর অবস্থা ধরে হিসাবের নিচেও একটা মোট।",
                  without:
                    "আপনি দুইটা Query লেখেন, একটা মাস ধরে আর একটা মোটের জন্য, তারপর Excel এ জোড়া দেন। পরের মাসে কেউ একটা Query বদলান কিন্তু অন্যটা নয়, আর মোটের সাথে লাইনগুলোর যোগফল মেলে না।",
                  withIt:
                    "আপনি GROUP BY তে ROLLUP লেখেন। একই Query থেকে প্রতিটা অবস্থার লাইন আর নিচে মোট 24টা Booking, 592300.00 টাকা আসে, আর মোটটা সবসময় লাইনগুলোর সাথে মেলে, কারণ দুইটা একই হিসাব থেকে আসছে।",
                  lessons: ["ROLLUP, CUBE and GROUPING SETS"],
                },
                {
                  id: "one-line-list",
                  label: "সব Booking নম্বর এক লাইনে",
                  situation:
                    "Support এর একটা Screen এ প্রতিটা ফিরে আসা Customer এর পাশে তাঁর সব Booking নম্বর দেখাতে হবে, যেমন 1, 8, 17। প্রতিটা Booking আলাদা Row হলে Screen টা লম্বা আর অগোছালো।",
                  without:
                    "আপনি সব Row App এ এনে Customer ধরে একটা Map বানান, তারপর Loop চালিয়ে নম্বরগুলো জোড়া দেন। কাজ হয়, কিন্তু প্রতিটা Screen এর জন্য একই Code আবার লিখতে হয়।",
                  withIt:
                    "আপনি GROUP BY customer_id এর সাথে string_agg লেখেন, ভেতরে ORDER BY দিয়ে। প্রতিজন Customer এর জন্য একটা Row, আর পাশে 1, 8, 17 এর মতো একটা লেখা, ক্রম ঠিক রেখে।",
                  lessons: ["string_agg and array_agg", "GROUP BY"],
                },
              ]}
              footer="প্রতিটা মুহূর্তে ভুলটা হয় Error হিসেবে আসেনি, নয়তো এসেছে এমন Error হিসেবে যার মানে প্রথমবার বোঝা যায় না। এই মডিউলের কাজ এই দুই রকম ভুল চিনতে আর আটকাতে শেখানো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলের হিসাবগুলো আপনার কাজের দিনে যেখানে যেখানে দেখা দেবে, তার একটা
                তালিকা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Dashboard আর BI Tool।</strong> Metabase, Grafana, Looker বা
                  যেকোনো চার্টের পেছনের SQL এ প্রায় সবসময় একটা GROUP BY থাকে, আর মোটের
                  লাইনে একটা sum বা count। চার্টের সংখ্যা ভুল দেখালে সেই SQL টাই খুলে পড়তে
                  হয়।
                </ListItem>
                <ListItem>
                  <strong>Admin Panel আর API।</strong> উপরের ছোট Card গুলো, তালিকার পাশের
                  সংখ্যার Badge, একটা stats Endpoint, সবই এই মডিউলের Query। ORM দিয়ে লিখলেও
                  ভেতরে যায় count আর GROUP BY।
                </ListItem>
                <ListItem>
                  <strong>হিসাব মেলানো।</strong> মাস শেষে Payment পদ্ধতি ধরে মোট বের করা,
                  Bank এর হিসাবের সাথে মেলানো, কোন অবস্থার টাকা কোথায় গেল খোঁজা। Finance এর
                  প্রতিটা প্রশ্ন একটা GROUP BY।
                </ListItem>
                <ListItem>
                  <strong>Data Analyst এর রোজকার কাজ।</strong> কোন মাসে বিক্রি বেশি, কোন
                  দেশ থেকে বেশি Customer, কতজন ফিরে আসেন। Analyst এর চাকরির প্রায় প্রতিটা
                  প্রশ্ন শুরু হয় এখান থেকে।
                </ListItem>
                <ListItem>
                  <strong>Error Message।</strong> must appear in the GROUP BY clause,
                  aggregate functions are not allowed in WHERE, আর MySQL এর
                  only_full_group_by। এই মডিউলের পর প্রতিটা দেখে আপনি বলতে পারবেন কোন
                  Column বা কোন শর্ত ভুল জায়গায়।
                </ListItem>
                <ListItem>
                  <strong>Interview।</strong> প্রতিটা বিভাগে কর্মীর সংখ্যা, দুইটার বেশি
                  Order দেওয়া Customer, WHERE আর HAVING এর পার্থক্য, COUNT(*) আর
                  COUNT(column) এর পার্থক্য। Backend আর Data দুই রকম Interview তেই এগুলো
                  খুব সাধারণ প্রশ্ন।
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
      title: <SectionTitle>Island Tours এ এই হিসাবগুলো কোথায় চলে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর মতো একটা ব্যবসায় এই মডিউলের হিসাবগুলো কোথায় কোথায়
                লুকিয়ে থাকে, কয়েকটা জায়গা দেখুন। এগুলো আপনার নিজের Project এও প্রায়
                হুবহু আসবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Admin Panel এর উপরের Card।</strong> মোট Booking 24, মোট সিট 53,
                  গড়ে 2.21 জন, বাতিলের হার 12.5 শতাংশ। চারটা সংখ্যা, একটা Query। লেসন ১
                  আর ৪।
                </ListItem>
                <ListItem>
                  <strong>মালিকের মাসিক Report।</strong> প্রতিটা মাসের Booking, তার কতগুলো
                  confirmed, confirmed থেকে কত টাকা, আর সবার নিচে মোট। date_trunc দিয়ে মাস,
                  FILTER দিয়ে আলাদা গোনা, ROLLUP দিয়ে মোট। লেসন ২, ৪ আর ৫।
                </ListItem>
                <ListItem>
                  <strong>Payment এর হিসাব মেলানো।</strong> bKash আর Card এ 7টা করে
                  Payment, Nagad এ 3টা, Bank এ 2টা, আর প্রতিটা পদ্ধতিতে কত টাকা। হিসাবরক্ষক
                  প্রতি মাসে এটাই Bank এর হিসাবের সাথে মেলান। লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>Guide এর প্রস্তুতি।</strong> কোন Departure এ চারজনের বেশি সিট
                  ধরা আছে, বাতিলগুলো বাদ দিয়ে। এখন তিনটা: departure_id 1, 8 আর 10। লেসন ৩
                  আর ৪।
                </ListItem>
                <ListItem>
                  <strong>ফিরে আসা Customer।</strong> নয়জন Customer একবারের বেশি বুক
                  করেছেন, customer_id 1 তিনবার। Support Screen এ প্রতিজনের পাশে তাঁর Booking
                  নম্বরগুলো এক লাইনে। লেসন ৩ আর ৬।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে মালিকের মাসিক Report এর একটা টুকরো। প্রতিটা মাসে কতগুলো
                Booking, তার কতগুলো confirmed, আর confirmed থেকে কত টাকা। এই বক্সের
                PostgreSQL ঢাকার Time Zone এ চলে, তাই মাসগুলো ঢাকার মাস।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মালিকের মাসিক Report এর একটা টুকরো"
              query={`SELECT to_char(date_trunc('month', booked_at), 'Mon YYYY') AS month,
       count(*)                                          AS bookings,
       count(*) FILTER (WHERE status = 'confirmed')      AS confirmed,
       sum(total_bdt) FILTER (WHERE status = 'confirmed') AS confirmed_bdt
FROM bookings
GROUP BY date_trunc('month', booked_at)
ORDER BY date_trunc('month', booked_at);`}
              caption="ছয়টা Row আসবে, Dec 2025 থেকে Oct 2026। সবচেয়ে বেশি Booking Oct 2026 এ, 9টা, যার 5টা confirmed, আর confirmed থেকে 129500.00 টাকা। ছয় মাসের confirmed টাকা যোগ করলে আসে 423600.00, উপরের বক্সের আসল আয়। GROUP BY লেসন ২ এ, FILTER লেসন ৪ এ, আর নিচের সর্বমোটের লাইনটা লেসন ৫ এ যোগ হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                খেয়াল করুন, Report টায় শুধু মাস আর সংখ্যা, কোনো ট্যুরের নাম নেই। ট্যুরের
                নাম থাকে tours Table এ, আর Booking থেকে সেখানে পৌঁছাতে মাঝে departures
                Table পেরোতে হয়। সেই পথটা Module 06 এর। এই মডিউলে যা শিখবেন, Joins
                শেখার পর হুবহু সেখানেও খাটবে, শুধু GROUP BY তে একটা নাম যোগ হবে।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউলে আপনি নিজে যা যা করবেন, ক্রম ধরে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  প্রতিটা লেসনের Query বক্স চালাবেন, তারপর একটা জিনিস বদলে দেখবেন উত্তর
                  কীভাবে বদলায়, যেমন count(*) এর জায়গায় count(phone), বা GROUP BY এর
                  Column টা।
                </ListItem>
                <ListItem>
                  অনুশীলনের বক্সে নিজে Query লিখে Check চাপবেন। একটা মাত্র Table নিয়ে
                  কাজ, তাই দলগুলো চিনবেন id দিয়ে।
                </ListItem>
                <ListItem>
                  লেসন ২ আর ৩ এ দুইটা Error ইচ্ছা করে তৈরি করবেন, তারপর প্রতিটার বার্তা
                  পড়ে নিজের ভাষায় লিখে রাখবেন সেটা কী বলছে।
                </ListItem>
                <ListItem>
                  প্রতিটা লেসনের Lab এর Drill গুলো নিজের island_tours Database এ চালিয়ে
                  Row আর সংখ্যা মিলিয়ে নেবেন।
                </ListItem>
                <ListItem>
                  শেষ লেসনের Recap এ ফারুক সাহেবের চাওয়াগুলো থেকে একটা Report একটা Query
                  তে লিখবেন, আর নিজের Notebook এ প্রতিটা সংখ্যার পাশে লিখে রাখবেন কোন Row
                  গোনা হয়েছে আর কোনগুলো বাদ।
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
                "Data বের করে Excel এ নিয়ে হাতে হাতে গোনেন আর যোগ করেন",
                "সব Row এর টাকা যোগ করে সেটাকেই আয় বলে ধরে নেন",
                "একটা Column গুনে ভাবেন সব Row গোনা হলো",
                "must appear in the GROUP BY দেখলে Error সরানোর উপায় খোঁজেন, কারণ নয়",
                "দলের উপর শর্ত WHERE এ লেখেন, আর আটকে যান",
                "প্রতিটা অবস্থার জন্য আলাদা Query লিখে পাশাপাশি বসান",
                "মোটের লাইন আলাদা করে হিসাব করেন, আর কখনো সেটা লাইনগুলোর সাথে মেলে না",
              ]}
              after={[
                "count, sum, avg, min আর max দিয়ে অনেক Row কে একটা উত্তরে আনেন",
                "আয় আর মোট টাকার ফারাক জানেন, আর FILTER দিয়ে দুইটাই এক Query তে দেখান",
                "COUNT(*) আর COUNT(column) এর ফারাক জানেন, আর NULL কোথায় বাদ পড়ে বোঝেন",
                "GROUP BY দিয়ে দলে ভাগ করেন, আর ফলাফলে কোন Column রাখা যায় জানেন",
                "Row এর শর্ত WHERE এ আর দলের শর্ত HAVING এ রাখেন, কারণসহ",
                "এক Query তে কয়েক রকম গোনা আর হার বের করেন, ভাগের ফাঁদ এড়িয়ে",
                "ROLLUP দিয়ে উপমোট আর সর্বমোট বসান, আর string_agg দিয়ে তালিকা জোড়া দেন",
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
                এই মডিউলের মানদণ্ড হলো একটা সংখ্যার পেছনের হিসাব ব্যাখ্যা করতে পারা।
                কাউকে Report এর একটা সংখ্যা দেখিয়ে আপনি বলবেন, এখানে শুধু confirmed
                Booking এর টাকা যোগ হয়েছে, তাই এটা 423600, 592300 নয়। এই গড়ে ফাঁকা মানগুলো
                বাদ গেছে। এই তালিকায় শুধু সেই দলগুলো আছে, যাদের Booking দুইটা বা তার বেশি,
                আর সেই শর্তটা HAVING এ, কারণ গোনা শেষ হওয়ার আগে সেটা জানা যায় না।
              </ContentParagraph>
              <ContentParagraph>
                এটা পারলে আপনি শুধু কয়েকটা Function এর নাম শেখেননি, অনেক Row নিয়ে ভাবতে
                শিখেছেন: কোন Row গুলো দলে ঢুকছে, দলটা কীভাবে তৈরি হচ্ছে, আর প্রতিটা
                সংখ্যা ঠিক কোন প্রশ্নের উত্তর। পাশের কাউকে বোঝানোর আসল জিনিস সেটাই।
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
                <strong>আগে যা লাগবে।</strong> Module 03 পুরোটা, বিশেষ করে লেসন ২ এর
                Query চলার লজিক্যাল ক্রম, লেসন ৫ এর NULL, লেসন ৮ এর DISTINCT আর লেসন ৯ এর
                CASE। Module 04 থেকে লাগবে date_trunc, round, আর পূর্ণ সংখ্যার ভাগের ফাঁদ,
                কারণ গড় আর হারের হিসাবে সেগুলো বারবার ফিরে আসবে। Module 02 শেষ করা থাকলে
                Lab এর Drill গুলো নিজের psql এ চালাতে পারবেন, না থাকলেও লেসনের বক্সগুলো
                Browser এই চলে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>সময়।</strong> পুরো মডিউলের জন্য তিন চার দিন ধরে রাখুন। ছয়টা লেসন
                পড়তে মোট প্রায় তিন থেকে চার ঘণ্টা লাগে। লেসন ২ আর ৩ এর জন্য একটু বেশি
                সময় রাখুন, কারণ GROUP BY এর নিয়ম আর WHERE বনাম HAVING এর ফারাক পুরো
                মডিউলের ভিত্তি। এই দুইটা পোক্ত হলে বাকি চারটা অনেক সহজে আসে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ক্রম।</strong> লেসন ১ থেকে ৩ অবশ্যই ক্রম ধরে পড়ুন, কারণ প্রতিটা
                আগেরটার উপর দাঁড়ানো: আগে একটা সংখ্যা, তারপর প্রতিটা দলের সংখ্যা, তারপর দল
                ছাঁকা। লেসন ৪ থেকে ৬ আগের তিনটা ধরে নেয়, আর নিজেদের মধ্যে মোটামুটি
                স্বাধীন, তবু ক্রম ধরে পড়াই ভালো, কারণ Recap আছে শেষ লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Query বক্স।</strong> প্রতিটা বক্স আগে যেমন আছে তেমন চালান। তারপর
                চালানোর আগে মনে মনে অনুমান করুন, কতগুলো Row আসবে। এই মডিউলে Row এর সংখ্যা
                অনুমান করাটাই সবচেয়ে বড় অনুশীলন: GROUP BY status দিলে কয়টা, GROUP BY
                customer_id দিলে কয়টা, HAVING যোগ করলে কয়টা কমবে। অনুমান মিললে বুঝবেন দলটা
                কীভাবে তৈরি হচ্ছে, সেটা আপনি দেখতে পাচ্ছেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>অনুশীলনের বক্স।</strong> আগে নিজে চেষ্টা করুন, অন্তত দুইবার। তারপর
                Hint, আর সবার শেষে Solution। মনে রাখবেন, আপনার Query সমাধানের মতো দেখতে না
                হলেও চলবে, ফলাফল এক হলেই সঠিক, Column এর নাম যাই দিন। সংখ্যার উত্তরে শেষের
                বাড়তি শূন্য ধরা হয় না। আর যেখানে প্রশ্নে ক্রমের কথা বলা আছে, সেখানে ORDER
                BY ছাড়া উত্তর মিলবে না, কারণ GROUP BY নিজে কোনো ক্রমের কথা দেয় না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Lab আর Quiz।</strong> Lab এর Drill গুলো নিজের psql এ চালান আর
                প্রতিটার পাশে লেখা Row আর সংখ্যার সাথে মিলিয়ে নিন। মাস ধরে হিসাবের Drill এ
                আপনার psql এর উত্তর নির্ভর করবে মেশিনের Time Zone এর উপর, কারণ কোন Booking
                কোন মাসে পড়বে সেটা Time Zone ঠিক করে, যা আপনি Module 04 এ দেখেছেন। Quiz দিন
                লেসন শেষ করার পরের দিন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>MySQL এর ভিডিও দেখছেন?</strong> ভিডিওর GROUP BY, COUNT, MAX, SUM
                আর HAVING এর অংশটা এই মডিউলের লেসন ১ থেকে ৩ এর সাথে মেলে। কয়েকটা জায়গায়
                MySQL আলাদা: MySQL 8.4 এ ONLY_FULL_GROUP_BY নিয়ম শুরু থেকেই চালু, তাই
                PostgreSQL এর মতোই দলের বাইরের Column এ Error দেয়, শুধু বার্তাটা আলাদা।
                FILTER নেই, তার বদলে লেখা হয় SUM(CASE ...) বা SUM(status =
                &apos;confirmed&apos;)। উপমোটের জন্য ROLLUP লেখা হয় WITH ROLLUP দিয়ে, আর
                string_agg এর জায়গায় GROUP_CONCAT। প্রতিটার MySQL রূপ সংশ্লিষ্ট লেসনে
                পাশাপাশি দেখানো থাকবে, যাচাই করা অবস্থায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>আটকে গেলে।</strong> Error এলে আগে দেখুন ফলাফলের প্রতিটা Column হয়
                GROUP BY তে আছে, নয়তো একটা Aggregate এর ভেতরে আছে কিনা। শর্তে count বা
                sum থাকলে সেটা HAVING এ যাবে, WHERE এ নয়। আর Error না এসে ভুল সংখ্যা এলে
                GROUP BY আর Aggregate সরিয়ে শুধু WHERE সহ Query টা চালান, দেখুন কোন Row
                গুলো আসলে দলে ঢুকছে। প্রায় প্রতিটা ভুল সংখ্যার কারণ ভুল Row ঢোকা, ভুল গোনা
                নয়। অফিসিয়াল Docs এর Aggregate Functions আর GROUP BY অংশেও প্রতিটার উদাহরণ
                আছে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>পরের ধাপ।</strong> এখান থেকে সোজা চলে যান প্রথম লেসনে,{" "}
                <strong>COUNT, SUM, AVG, MIN, MAX</strong>, যেখানে আপনি প্রথমবার অনেক Row
                থেকে একটা উত্তর বের করবেন, আর দেখবেন ফোন গুনলে কেন 10 আসে।
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
        "COUNT, SUM, AVG, MIN, MAX",
        "Aggregate অনেক Row থেকে একটা মান দেয়, NULL কে নিঃশব্দে বাদ দেয়, আর COUNT(*) Row গোনে কিন্তু COUNT(column) গোনে শুধু জানা মানগুলো",
      ],
      [
        "GROUP BY",
        "GROUP BY Row গুলোকে দলে ভাগ করে প্রতিটা দলের জন্য একটা Row দেয়, তাই ফলাফলের প্রতিটা Column হয় দলটাকে চেনায়, নয়তো তার হিসাব দেয়",
      ],
      [
        "HAVING vs WHERE",
        "WHERE দলের আগে প্রতিটা Row ছাঁকে, HAVING দলের পরে পুরো দল ছাঁকে, তাই গোনা বা যোগের উপর শর্ত সবসময় HAVING এ",
      ],
      [
        "Conditional Aggregation and FILTER",
        "FILTER বা CASE দিয়ে এক Query তেই কয়েক রকম শর্তে আলাদা আলাদা গোনা যায়, আর তাতে আয় আর মোট টাকার মতো ফারাক পাশাপাশি দেখা যায়",
      ],
      [
        "ROLLUP, CUBE and GROUPING SETS",
        "ROLLUP আর তার আত্মীয়রা একই Query তে উপমোট আর সর্বমোট বসায়, আর মোটের লাইনের ফাঁকা ঘর অজানা মান নয়, সব দল মিলিয়ে হিসাবের চিহ্ন",
      ],
      [
        "string_agg and array_agg",
        "একটা দলের সব মান এক লাইনে বা একটা Array তে জোড়া দেওয়া যায়, ভেতরের ORDER BY দিয়ে ক্রম ঠিক রেখে",
      ],
    ],
  },
};
