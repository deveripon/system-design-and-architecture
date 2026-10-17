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

export const readingDataOverviewContent: TopicData = {
  id: "reading-data-overview",
  introduction: {
    badge: "MODULE 03 · OVERVIEW",
    title: <SectionTitle>Database কে প্রশ্ন করতে শেখা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          প্রথম দুই মডিউলে আপনি ঘরটা বানিয়েছেন। Module 01 এ জেনেছেন Database কী,
          Table আর Key কীভাবে তথ্য গুছিয়ে রাখে, আর SQL কোন ভাষা। Module 02 এ নিজের
          মেশিনে PostgreSQL বসিয়েছেন, psql আর একটা GUI দিয়ে তার সাথে কথা বলেছেন, আর
          Island Tours এর আটটা Table নিজের Database এ তুলেছেন। এখন আপনার সামনে একটা
          চালু Database, তাতে সত্যিকারের Data, আর একটা ফাঁকা Prompt।
        </ContentParagraph>
        <ContentParagraph>
          এই মডিউল থেকে আসল কাজ শুরু। এখানে আপনি নিজে SQL লিখবেন, প্রথম লাইন থেকে।
          একটা Database এর সাথে সবচেয়ে বেশি যে কাজটা হয়, সেটা হলো প্রশ্ন করা: কোন
          ট্যুরগুলো এখনো বিক্রি হচ্ছে, কাদের ফোন নম্বর নেই, নভেম্বরে কোন তারিখে সিট
          খালি আছে, সবচেয়ে সস্তা তিনটা ট্যুর কোনগুলো। এই প্রতিটা প্রশ্নের উত্তর
          একটা SELECT, আর এই মডিউলে আপনি SELECT এর প্রতিটা অংশ একটা একটা করে শিখবেন।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা লেসন নয়, মডিউলের মানচিত্র। এখানে জানবেন মডিউলটা কেন দরকার, নয়টা
          লেসনে কী কী শিখবেন, কেন এটা পুরো ট্র্যাকের মেরুদণ্ড, কাজের জায়গায় কোথায় লাগে,
          আর বাস্তবে আপনি ধাপে ধাপে কী কী করবেন। নিয়মগুলো এখানে শেখানো হবে না, শুধু
          দেখানো হবে কোন নিয়ম কোন লেসনে আছে আর কেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "লাইব্রেরিতে হাজার হাজার বই। লাইব্রেরিয়ান সব বই চেনেন, কিন্তু আপনি কী চান সেটা আপনাকেই বলতে হবে। যত পরিষ্কার করে চাইবেন, তত ঠিক বইটা হাতে পাবেন। SELECT হলো সেই চাওয়ার ভাষা।",
      author: "Reading Data",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>সোমবার সকালের পাঁচটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা সোমবার সকালের কথা ভাবুন। Island Tours এর অপারেশন ম্যানেজার
                ফারুক সাহেব অফিসে ঢুকেই আপনার দিকে এগিয়ে এলেন। তাঁর হাতে একটা কাগজ,
                তাতে পাঁচটা প্রশ্ন। প্রথম প্রশ্ন, সামনের কোন কোন তারিখে এখনো সিট খালি
                আছে, তারিখ অনুযায়ী সাজিয়ে। দ্বিতীয়, দশ হাজার টাকার নিচে কোন কোন
                ট্যুর আছে, সস্তাটা আগে। তৃতীয়, কোন Customer দের ফোন নম্বর আমাদের কাছে
                নেই, কারণ তাঁদের ফোন করে বুকিং নিশ্চিত করা যাচ্ছে না। চতুর্থ, আমাদের
                Customer রা কোন কোন শহর থেকে আসেন, একটা শহর একবারই। আর পঞ্চম, প্রতিটা
                ট্যুরের পাশে একটা লেবেল চাই, সস্তা, মাঝারি না দামি, একটা Email এর জন্য।
              </ContentParagraph>
              <ContentParagraph>
                SQL ভাসা ভাসা জানলে এই সকালটা কেমন যায়, অনেকেই জানেন। কিছু প্রশ্নের
                জন্য আপনি একটা GUI তে Table খোলেন, পুরোটা Copy করে Excel এ বসান, তারপর
                হাতে হাতে Filter আর Sort করেন। প্রথম প্রশ্নের তালিকায় একটা বন্ধ হয়ে
                যাওয়া ট্যুরের তারিখও থেকে যায়, কারণ departures Table এ সেই ট্যুর যে
                বন্ধ, তা লেখা থাকে না, থাকে আরেক Table এ। তৃতীয় প্রশ্নের জন্য আপনি
                আন্দাজে একটা Query লেখেন, সেটা কোনো Error ছাড়াই চলে আর একটা Row ও ফেরত
                দেয় না, অথচ পাঁচজনের নম্বর সত্যিই নেই। চতুর্থ প্রশ্নে Dhaka তালিকায়
                আসে ছয়বার। দুপুর পেরিয়ে যায়, আর উত্তরগুলোতে কতটা ভরসা করা যায়, আপনি
                নিজেই নিশ্চিত নন।
              </ContentParagraph>
              <ContentParagraph>
                এবার আরেকটা দৃশ্য। আপনি Island Tours এর Website এর Developer। ট্যুরের
                তালিকার Page বানাচ্ছেন: উপরে একটা Search Box, পাশে দামের Filter, দাম
                অনুযায়ী সাজানো, আর এক Page এ পাঁচটা করে ট্যুর। Page টা চালু হওয়ার
                পর তিনটা অভিযোগ আসে। Search Box এ ছোট হাতে saint লিখলে Saint Martin
                আসে না। দ্বিতীয় Page এ একটা ট্যুর আবার দেখা যায়, যেটা প্রথম Page এও
                ছিল। আর একই দামের দুইটা ট্যুর একেকবার একেক ক্রমে আসে। Code এ কোনো
                Error নেই, তিনটা সমস্যাই লুকিয়ে আছে SELECT এর ভেতরে।
              </ContentParagraph>
              <ContentParagraph>
                দুইটা দৃশ্যের মূল কথা একই। Database এ Data থাকা আর সেই Data থেকে ঠিক
                উত্তরটা বের করা, দুইটা আলাদা ব্যাপার। দ্বিতীয়টা করতে হয় প্রশ্নটা
                নিখুঁতভাবে লিখে: কোন Table থেকে, কোন Row, কোন Column, কোন ক্রমে, কতগুলো।
                আর সেই লেখার কয়েকটা সূক্ষ্ম জায়গা আছে, যেমন অজানা মান কীভাবে তুলনা
                হয়, বড় ছোট অক্ষর কখন আলাদা, ক্রম কখন নিশ্চিত, যেগুলো না জানলে ভুল
                উত্তরটা দেখতে একদম ঠিক উত্তরের মতোই লাগে।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল শেষে ফারুক সাহেবের পাঁচটা প্রশ্নের প্রতিটা আপনি এক একটা
                Query তে লিখবেন, কয়েক মিনিটে, আর প্রতিটা উত্তরের পেছনের যুক্তিও বলতে
                পারবেন। Website এর তিনটা অভিযোগও কোথা থেকে আসছে আর কীভাবে সারাবেন,
                জানবেন।
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
              বন্ধ ট্যুর, অজানা মান, বড় ছোট অক্ষর, Page এর ক্রম, এই কথাগুলো এখানে
              ইচ্ছা করেই ব্যাখ্যা ছাড়া রাখা হয়েছে। প্রতিটার কারণ আর সমাধান আছে
              নির্দিষ্ট একটা লেসনে, যেটা নিচের মানচিত্রে দেখবেন। মডিউল শেষে এই অংশটা
              আবার পড়লে দেখবেন প্রতিটা ভুল কেন হয়েছিল, আপনি এক নজরে বলে দিতে পারছেন।
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
                একটা বড় লাইব্রেরিতে ঢুকেছেন ভাবুন। হাজার হাজার বই, প্রতিটা তাকে নাম
                লেখা। লাইব্রেরিয়ান প্রতিটা বই চেনেন, কিন্তু আপনি কী চান সেটা নিজে না
                বললে তিনি কিছু আনবেন না। তাই আপনি একটা চিরকুটে লিখে দেন: ট্যুরের তাক
                থেকে, শুধু যেগুলো এখনো চালু, প্রতিটার নাম আর দাম লিখে দিন, সস্তাটা
                আগে, আর শুধু প্রথম তিনটা। লাইব্রেরিয়ান চিরকুট পড়ে ঠিক সেটাই এনে দেন।
              </ContentParagraph>
              <ContentParagraph>
                SELECT হলো সেই চিরকুট। চিরকুটের প্রতিটা অংশ SQL এর একটা শব্দ। কোন তাক
                থেকে, সেটা FROM। কোন বইগুলো, মানে কোন Row, সেটা WHERE। প্রতিটা বই থেকে
                কোন তথ্য, মানে কোন Column, সেটা SELECT এর ঠিক পরের তালিকা। কোন ক্রমে,
                সেটা ORDER BY। আর কতগুলো, সেটা LIMIT। এই মডিউলের নয়টা লেসন আসলে এই
                চিরকুটের একেকটা অংশকে ভালো করে লিখতে শেখা, আর লেখার সময় যে জায়গাগুলোতে
                সবাই ভুল করেন সেগুলো চিনে রাখা।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে সেই চিরকুটটাই SQL এ লেখা। নিয়মগুলো এখনো জানার দরকার নেই,
                শুধু Run চাপুন আর মিলিয়ে দেখুন, ইংরেজির মতো পড়া যায় এমন পাঁচটা লাইন
                ঠিক পাঁচটা চাওয়ার কথা বলছে কিনা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="লাইব্রেরিয়ানকে দেওয়া চিরকুট"
              query={`SELECT title, price_bdt
FROM tours
WHERE is_active
ORDER BY price_bdt
LIMIT 3;`}
              caption="ফলাফলে তিনটা ট্যুর আসবে: Ratargul Swamp Boat Day (3500.00), Sylhet Tea Garden Tour (7800.00) আর Cox's Bazar Beach Weekend (8500.00)। প্রতিটা লাইন একটা চাওয়া: কোন Column, কোন Table, কোন Row, কোন ক্রম, কতগুলো। এই মডিউলের প্রথম চার লেসন উপরের প্রথম তিন লাইন নিয়ে, আর পরের লেসনগুলো শেষ দুই লাইন আর তার চেয়েও বেশি কিছু নিয়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের সবচেয়ে বড় কথা আরেকটা: SELECT শুধু পড়ে, কিছু বদলায় না।
              আপনি যত খুশি Query চালান, Island Tours এর একটা Row ও নড়বে না। তাই এই
              মডিউল নির্ভয়ে পরীক্ষা করার জায়গা। Data বদলানো, মানে INSERT, UPDATE আর
              DELETE, আসবে অনেক পরে, Module 10 এ, যখন আপনি পড়তে এতটাই অভ্যস্ত হয়ে যাবেন
              যে বদলানোর আগে কী বদলাচ্ছেন তা নিজেই যাচাই করে নিতে পারবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিয়েছে, এই মডিউল কী যোগ করে, পরের মডিউল কী চায়"
              caption="Module 02 দিয়েছে কাজের জায়গা: নিজের মেশিনে চালু PostgreSQL, psql আর GUI, আর তাতে তোলা Island Tours এর আটটা Table। Module 03 সেই Table গুলোকে প্রশ্ন করতে শেখায়: কোন Row, কোন Column, কোন ক্রম, কতগুলো। Module 04 এই প্রশ্নের ভেতরের মানগুলোকে বদলে সাজাতে শেখাবে, যেমন লেখা ছোট বড় করা, তারিখ থেকে মাস বের করা, খালি জায়গায় বিকল্প বসানো। সেটা সবই ঘটবে এই মডিউলের SELECT এর ভেতরে।"
              before={{
                tag: "Module 02",
                title: "Setup & Tools",
                lines: ["নিজের মেশিনে PostgreSQL", "psql আর GUI Client", "Sample Database Load"],
              }}
              current={{
                tag: "Module 03",
                title: "Reading Data",
                lines: ["SELECT আর WHERE লেখা", "NULL আর ক্রম বোঝা", "Page আর লেবেল বানানো"],
              }}
              after={{
                tag: "Module 04",
                title: "Functions & Expressions",
                lines: ["লেখা আর সংখ্যা সাজানো", "তারিখ আর Time Zone", "NULL এর বদলে বিকল্প"],
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
      title: <SectionTitle>নয়টা লেসন, একটা চিরকুট</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। নিচে নয়টা লেসন আর
              তাদের প্রশ্ন। যেকোনোটায় চাপ দিলে সরাসরি সেখানে যাবেন, তবে প্রথমবার ক্রম
              ধরে যাওয়াই ভালো, কারণ প্রতিটা লেসন আগের লেসনের Query কে আরেকটু বড় করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              track="sql"
              moduleId="reading-data"
              questions={{
                "select-from":
                  "একটা Table থেকে নির্দিষ্ট কয়েকটা Column কীভাবে নেবেন, তাদের দিয়ে নতুন হিসাব কীভাবে করবেন, আর ফলাফলের Column এর নাম কীভাবে বদলাবেন?",
                "query-order":
                  "আপনি যে ক্রমে Query লেখেন, Database কেন সেই ক্রমে চালায় না, আর এই তফাত না জানলে কোন Error গুলো অবাক করে?",
                "where-filters":
                  "শর্ত দিয়ে শুধু দরকারি Row গুলো কীভাবে বাছবেন, আর AND আর OR একসাথে লিখলে কোনটা আগে খাটে?",
                "in-between-like":
                  "একটা তালিকার যেকোনো মান, একটা সীমার ভেতরের মান, আর নামের একটা অংশ মিলিয়ে Row কীভাবে খুঁজবেন?",
                "null-logic":
                  "অজানা মান মানে NULL এর সাথে তুলনা কেন অদ্ভুত আচরণ করে, আর ফাঁকা ঘরগুলো নির্ভুলভাবে কীভাবে খুঁজবেন?",
                "order-by":
                  "ফলাফল কীভাবে এক বা একাধিক Column ধরে সাজাবেন, আর ক্রমটা প্রতিবার একই থাকবে, সেটা কীভাবে নিশ্চিত করবেন?",
                "limit-pagination":
                  "প্রথম কয়েকটা Row কীভাবে নেবেন, পাতায় পাতায় কীভাবে দেখাবেন, আর বড় Table এ পাতা ভাগ করার ঠিক উপায় কোনটা?",
                "distinct":
                  "একই মান বারবার না দেখিয়ে আলাদা আলাদা মানগুলো কীভাবে দেখাবেন, আর DISTINCT কখন একটা লুকানো ভুলের লক্ষণ?",
                "case-expression":
                  "Query এর ভেতরেই যদি আর তাহলে লিখে প্রতিটা Row এর জন্য নতুন লেবেল কীভাবে বানাবেন?",
              }}
              footer="নয়টা লেসন তিন ভাগে মনে রাখা সহজ। প্রথম দুইটা চিরকুটের কাঠামো: কী চাইছেন আর Database সেটা কোন ক্রমে পড়ে। পরের তিনটা Row বাছাই: শর্ত, তালিকা আর সীমা, আর অজানা মান। শেষ চারটা উত্তরটাকে সাজানো: ক্রম, পাতা, আলাদা মান আর লেবেল। শেষ লেসনে পুরো মডিউলের একটা Recap আছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একই নয়টা লেসন একটা গল্প হিসেবে শুনুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>লেসন ১, SELECT and FROM:</strong> প্রথম লাইন থেকে শুরু।
                  একটা Table এর সব Column একসাথে দেখা, আর কেন আসল Code এ সব Column
                  একসাথে চাওয়া হয় না। দরকারি Column বেছে নেওয়া আর ইচ্ছামতো সাজানো,
                  Column দিয়ে হিসাব করা, যেমন সিট গুণ দাম, আর ফলাফলের Column কে নতুন
                  নাম দেওয়া। কোনো Table ছাড়াই SELECT দিয়ে ক্যালকুলেটরের মতো হিসাব, আর
                  Query সুন্দর করে লেখার অভ্যাস, যাতে ছয় মাস পরেও নিজে পড়তে পারেন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ২, The Logical Order of a Query:</strong> একটা অবাক
                  করা সত্য দিয়ে শুরু: আপনি Query লেখেন SELECT দিয়ে, কিন্তু Database
                  পড়ে FROM দিয়ে। লেখার ক্রম আর চলার ক্রম আলাদা। এই তফাতটা জানলে
                  অনেকগুলো রহস্যময় Error এক নিমেষে পরিষ্কার হয়ে যায়, যেমন ফলাফলের Column
                  কে দেওয়া নতুন নাম কেন শর্তের ভেতরে চেনে না, অথচ সাজানোর সময় চেনে।
                  একটা Lab এ একটা Query কে ধাপে ধাপে আসল Row এর উপর দিয়ে চলতে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৩, WHERE with AND, OR, NOT:</strong> এবার Row বাছাই।
                  সমান, বড়, ছোট, সমান নয়, এই তুলনাগুলো লেখা আর সংখ্যার পাশাপাশি লেখা,
                  তারিখ আর হ্যাঁ না মানের উপর চালানো। তারপর কয়েকটা শর্ত জোড়া দেওয়া,
                  আর সেই জায়গাটা যেখানে অনেকেই ভুল করেন: AND আর OR একসাথে লিখলে কোনটা
                  আগে খাটে, আর বন্ধনী না দিলে কীভাবে একদম অন্য প্রশ্নের উত্তর আসে।
                  বন্ধ হয়ে যাওয়া ট্যুরটা এখানে একটা ফাঁদ হিসেবে অপেক্ষা করছে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৪, IN, BETWEEN, LIKE and ILIKE:</strong> শর্ত লেখার
                  তিনটা শর্টকাট। একটা তালিকার যেকোনো মান মেলাতে IN, একটা সীমার ভেতরের
                  মান মেলাতে BETWEEN, আর নামের একটা অংশ মেলাতে LIKE আর ILIKE। এখানেই
                  সেই Search Box এর সমস্যার উত্তর, ছোট হাতের saint কেন Saint Martin
                  খুঁজে পায় না, আর MySQL এ কেন একই Query ভিন্ন আচরণ করে। তারিখের সীমায়
                  দিনের শেষ মুহূর্তটা হারিয়ে যাওয়ার ফাঁদটাও এখানে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৫, NULL and Three-valued Logic:</strong> এই মডিউলের
                  সবচেয়ে গুরুত্বপূর্ণ লেসন। NULL মানে শূন্য নয়, ফাঁকা লেখাও নয়, NULL
                  মানে অজানা। অজানার সাথে তুলনার উত্তর হ্যাঁ বা না নয়, অজানা। তাই
                  ফোন নম্বর নেই এমন Customer খুঁজতে সাধারণ সমান চিহ্ন কোনো কাজ করে না।
                  ফারুক সাহেবের তৃতীয় প্রশ্নের ভুলটা কেন হয়েছিল, আর IS NULL দিয়ে কীভাবে
                  ঠিক উত্তর আসে, এখানে দেখবেন। Island Tours এর Data তে কয়েকটা NULL
                  ইচ্ছা করেই রাখা আছে, ঠিক এই লেসনের জন্য।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৬, ORDER BY:</strong> উত্তর সাজানো। ছোট থেকে বড়, বড়
                  থেকে ছোট, একাধিক Column ধরে, হিসাব করা মান ধরে। NULL গুলো সাজানোর সময়
                  কোথায় বসে, আর PostgreSQL আর MySQL এ সেটা কেন উল্টো। আর সেই সূক্ষ্ম
                  কথাটা: ORDER BY না লিখলে Database কোনো ক্রমের কথা দেয় না, আর একই মানের
                  দুইটা Row এর ক্রম নিশ্চিত করতে একটা অনন্য Column যোগ করতে হয়। Website
                  এর দ্বিতীয় অভিযোগের অর্ধেক উত্তর এখানে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৭, LIMIT, OFFSET and Pagination:</strong> প্রথম কয়েকটা
                  Row নেওয়া, আর পাতায় পাতায় ভাগ করা। পাতা নম্বর থেকে কতগুলো Row বাদ
                  দিতে হবে তার হিসাব, বড় Table এ OFFSET কেন ধীর হয়ে যায়, পাতা উল্টানোর
                  মাঝে নতুন Row এলে কীভাবে একটা Row দুইবার দেখা যায়, আর এর পাকা সমাধান,
                  Keyset Pagination। Website এর দ্বিতীয় অভিযোগের বাকি অর্ধেক উত্তর এখানে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৮, DISTINCT:</strong> একই মান বারবার না দেখিয়ে আলাদা
                  আলাদা মানগুলো দেখা, যেমন Customer রা কোন কোন শহর থেকে আসেন। একাধিক
                  Column এর DISTINCT, NULL এর সাথে তার আচরণ, প্রতিটা দলের সর্বশেষটা
                  নেওয়ার জন্য PostgreSQL এর নিজস্ব DISTINCT ON, আর একটা সতর্কতা: কোনো
                  Query তে হঠাৎ DISTINCT লাগলে সেটা অনেক সময় অন্য কোনো ভুলের লক্ষণ।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৯, CASE Expressions:</strong> Query এর ভেতরে যদি আর
                  তাহলে। প্রতিটা ট্যুরের দাম দেখে সস্তা, মাঝারি বা দামি লেবেল বসানো,
                  Booking এর Status কে নিজের পছন্দের ক্রমে সাজানো, আর এই সিদ্ধান্তগুলো
                  SELECT, ORDER BY আর WHERE তিন জায়গাতেই লেখা। মডিউলের শেষ লেসন, তাই
                  এখানে একটা বড় Query থাকবে যেটা এই মডিউলের সব কিছু একসাথে ব্যবহার করে,
                  আর থাকবে পুরো মডিউলের Recap আর Module 04 এ যাওয়ার পথ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই মডিউলে একটা নতুন জিনিস প্রথমবার দেখবেন: অনুশীলনের বক্স। প্রতিটা
                লেসনে কয়েকটা কাজ দেওয়া থাকবে, যেমন দশ হাজার টাকার নিচের ট্যুরগুলো
                সস্তাটা আগে। আপনি নিজের Query লিখে Check চাপবেন, আর বক্সটা আপনার
                Query আর একটা লুকানো সমাধান দুইটাই একই Database এ চালিয়ে ফলাফল মিলিয়ে
                দেখবে। তাই আপনার Query দেখতে সমাধানের মতো না হলেও চলবে, ফলাফল এক হলেই
                সঠিক। ফলাফলের Column এর নাম আলাদা হলেও সমস্যা নেই, আর ক্রম গুনে দেখা
                হবে শুধু তখন, যখন কাজটাই ক্রম চায়। আটকে গেলে Hint আছে, তারপরও না
                মিললে Solution।
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
      title: <SectionTitle>SELECT তো সহজ, এত সময় কেন?</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা প্রশ্ন আপনার মনে আসতেই পারে। SELECT, FROM, WHERE, এই কয়েকটা শব্দ
                তো এক বিকেলেই শেখা যায়। তাহলে পুরো একটা মডিউল, নয়টা লেসন, পাঁচ ছয় দিন
                কেন? সরাসরি Join বা বড় Report এ চলে গেলে কী ক্ষতি?
              </ContentParagraph>
              <ContentParagraph>
                সৎ উত্তরটা হলো, SELECT এর শব্দগুলো সত্যিই সহজ, কিন্তু তাদের আচরণের
                কয়েকটা জায়গা মোটেও সহজ না। আর বিপদটা এই যে সেই জায়গাগুলোতে ভুল করলে
                কোনো Error আসে না। Query চলে, একটা উত্তরও আসে, শুধু উত্তরটা ভুল। একটা
                Error আপনাকে থামিয়ে দেয়, কিন্তু একটা ভুল উত্তর চুপচাপ একটা Report এ,
                একটা Dashboard এ, একটা Email এ চলে যায়, আর কেউ টেরও পায় না। এই মডিউল
                সেই নীরব ভুলগুলোর মানচিত্র।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল বাদ দিলে পরে কী কী দাম দিতে হয়, তার কয়েকটা উদাহরণ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পরের প্রতিটা মডিউল এর উপর দাঁড়িয়ে।</strong> Module 04 এর
                  Function, Module 05 এর যোগফল আর Group, Module 06 এর Join, Module 07 এর
                  Subquery, সবই আসলে এই মডিউলের SELECT এর ভেতরে নতুন কিছু বসানো।
                  ভিতটা নড়বড়ে থাকলে উপরের প্রতিটা তলা নড়বে।
                </ListItem>
                <ListItem>
                  <strong>ORM থাকলেও SELECT পড়তে হয়।</strong> আপনার App হয়তো Prisma বা
                  অন্য কোনো Tool দিয়ে Database এ কথা বলবে, আর সেই Tool নিজেই SELECT
                  লিখবে। কিন্তু কোনো Page ধীর হলে বা ভুল Data দেখালে আপনাকে Log খুলে
                  সেই SELECT পড়েই কারণ খুঁজতে হবে।
                </ListItem>
                <ListItem>
                  <strong>Page আর Search এর Bug।</strong> তালিকার Page এ একটা Row দুইবার
                  দেখা যাওয়া, Search এ বড় ছোট অক্ষরের গোলমাল, একই Query তে একেকবার
                  একেক ক্রম, এগুলো সবচেয়ে চেনা Bug গুলোর মধ্যে, আর সবগুলোর উৎস এই
                  মডিউলের কোনো না কোনো লেসনে।
                </ListItem>
                <ListItem>
                  <strong>Report এর ভুল সংখ্যা।</strong> NULL ঠিকমতো না সামলালে একটা গোনা
                  কম হয়, একটা তালিকা থেকে Row হারিয়ে যায়। ব্যবসার সিদ্ধান্ত সেই সংখ্যার
                  উপর নেওয়া হয়।
                </ListItem>
                <ListItem>
                  <strong>Interview।</strong> SQL এর প্রায় প্রতিটা Interview এ অন্তত একটা
                  প্রশ্ন NULL, ক্রম বা Pagination নিয়ে আসে, কারণ এগুলো দিয়েই সবচেয়ে
                  সহজে বোঝা যায় কেউ SQL শুধু মুখস্থ করেছেন, নাকি বোঝেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর কয়েকটা চেনা ভুল ধারণা, যেগুলো এই মডিউল ভেঙে দেবে, প্রতিটার পাশে
                লেখা কোন লেসনে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  ফলাফলের Column কে একটা নাম দিলে সেই নাম Query এর সব জায়গায় চলে। আসলে
                  না, কোথায় চলে আর কোথায় না, সেটা লেসন ২ এর বিষয়।
                </ListItem>
                <ListItem>
                  ফাঁকা ঘর খুঁজতে সমান চিহ্ন দিয়ে NULL লিখলেই হয়। আসলে সেটা কখনো কোনো
                  Row ফেরত দেয় না, কেন, সেটা লেসন ৫ এ।
                </ListItem>
                <ListItem>
                  Row গুলো যে ক্রমে ঢোকানো হয়েছিল, সেই ক্রমেই ফিরে আসে। আসলে Database এমন
                  কোনো কথা দেয় না, লেসন ৬ এ দেখবেন।
                </ListItem>
                <ListItem>
                  LIKE সব Database এ একই আচরণ করে। আসলে PostgreSQL আর MySQL এ বড় ছোট
                  অক্ষরের ব্যাপারে একদম আলাদা, লেসন ৪ এ।
                </ListItem>
                <ListItem>
                  OFFSET দিয়ে পাতা ভাগ করা সবসময় ঠিক আর দ্রুত। আসলে বড় Table এ এটা ধীর
                  আর মাঝে মাঝে ভুল, লেসন ৭ এ।
                </ListItem>
                <ListItem>
                  ফলাফলে একই Row দুইবার এলে DISTINCT লাগিয়ে দিলেই সমাধান। অনেক সময় সেটা
                  আসল ভুলটাকে লুকিয়ে ফেলে, লেসন ৮ এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা কথা ধরে রাখুন",
          content: (
            <p>
              একটা Query উত্তরটা কেমন হবে তার বর্ণনা, উত্তর বের করার ধাপের তালিকা নয়।
              আপনি বলেন কী চাই, কোন Table থেকে, কোন Row, কোন ক্রমে, আর Database নিজে
              ঠিক করে কীভাবে আনবে। আর উত্তরটা নিজেও একটা Table, Row আর Column দিয়ে
              বানানো। এই দুইটা কথা মাথায় থাকলে এই মডিউলের প্রতিটা নিয়ম, আর পরের
              মডিউলগুলোর প্রায় সবকিছু, যুক্তি দিয়ে বোঝা যায়, মুখস্থ করতে হয় না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "where-it-helps",
      subHeader: { index: "005", title: "Where It Helps" },
      title: <SectionTitle>যে মুহূর্তগুলোতে SELECT ই আসল উত্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে ছয়টা মুহূর্ত, যেগুলো একজন Developer, Analyst বা Backend Engineer
              এর জীবনে বারবার আসে। একটা বেছে নিন, দেখুন এই মডিউল না জানলে ঘটনাটা কেমন
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
                  id: "page-repeats",
                  label: "দ্বিতীয় Page এ পুরনো ট্যুর",
                  situation:
                    "Island Tours এর ট্যুরের তালিকা দাম অনুযায়ী সাজানো, এক Page এ পাঁচটা। একজন Customer অভিযোগ করলেন, দ্বিতীয় Page এ এমন একটা ট্যুর দেখলেন যেটা প্রথম Page এও ছিল, আর অন্য একটা ট্যুর কোথাও নেই।",
                  without:
                    "আপনি Frontend এর Code ঘাঁটেন, Cache দোষী কিনা ভাবেন, Page টা বারবার Reload করেন। কখনো ঠিক আসে, কখনো আসে না, আর সমস্যাটা আবার ফিরে আসে।",
                  withIt:
                    "আপনি সরাসরি SELECT টা দেখেন। তালিকায় একই দামের ট্যুর থাকলে তাদের নিজেদের মধ্যে ক্রম Database নিশ্চিত করে না। ORDER BY তে দামের পাশে tour_id যোগ করেন, ক্রম স্থির হয়, আর বড় তালিকার জন্য Keyset Pagination এর পরিকল্পনা করেন।",
                  lessons: ["ORDER BY", "LIMIT, OFFSET and Pagination"],
                },
                {
                  id: "search-case",
                  label: "Search Box এ saint",
                  situation:
                    "Website এর Search Box এ একজন লিখলেন saint, ছোট হাতে। কোনো ফলাফল এল না, অথচ Saint Martin এর দুইটা ট্যুর আছে। একই Code আপনার পুরনো MySQL Project এ ঠিকঠাক কাজ করত।",
                  without:
                    "আপনি ভাবেন Data তে কোনো গোলমাল, অথবা Search এর জন্য আলাদা কোনো Tool লাগবে। একজন পরামর্শ দেন সব নাম ছোট হাতে বদলে রাখতে।",
                  withIt:
                    "আপনি জানেন PostgreSQL এর LIKE বড় ছোট অক্ষর আলাদা ধরে, আর MySQL এর সাধারণ Setting এ ধরে না। LIKE এর জায়গায় ILIKE লেখেন, এক লাইনের বদলে সমস্যা শেষ, Data তে হাত দিতে হয় না।",
                  lessons: ["IN, BETWEEN, LIKE and ILIKE"],
                },
                {
                  id: "null-zero",
                  label: "শূন্য Customer, অথচ পাঁচজন",
                  situation:
                    "ফোন নম্বর নেই এমন Customer দের তালিকা চাই। আপনি লিখলেন phone = NULL। Query চলল, কোনো Error নেই, ফলাফলে শূন্য Row। Report এ লেখা হলো সবার নম্বর আছে।",
                  without:
                    "Report টা ম্যানেজারের কাছে চলে যায়। পরে কেউ হাতে গুনে দেখেন পাঁচজনের নম্বর নেই। Report এর উপর আস্থা কমে যায়, আর কেউ বুঝতে পারেন না Query তে ভুলটা কোথায়।",
                  withIt:
                    "আপনি জানেন NULL মানে অজানা, আর অজানার সাথে সমান চিহ্নের তুলনার উত্তরও অজানা, তাই WHERE সেই Row গুলো ফেলে দেয়। phone IS NULL লেখেন, পাঁচজন আসে, আর Report পাঠানোর আগে গুনে মিলিয়ে নেন।",
                  lessons: ["NULL and Three-valued Logic"],
                },
                {
                  id: "alias-error",
                  label: "column does not exist",
                  situation:
                    "আপনি SELECT এ price_bdt * seats কে total নাম দিলেন, তারপর WHERE total > 20000 লিখলেন। Error এল: column total does not exist। অথচ ঠিক উপরের লাইনেই total লেখা।",
                  without:
                    "আপনি নামটা বারবার বানান মিলিয়ে দেখেন, Quote দেন, Quote সরান। শেষে কোনোভাবে কাজ চালানোর মতো একটা উপায় পান, কিন্তু কেন হলো, বোঝেন না।",
                  withIt:
                    "আপনি জানেন Database আগে WHERE পড়ে, তারপর SELECT, তাই WHERE এর সময় total নামটার জন্মই হয়নি। শর্তে পুরো হিসাবটাই লেখেন, আর বোঝেন ORDER BY তে কেন একই নাম ঠিকই চলে।",
                  lessons: ["The Logical Order of a Query", "SELECT and FROM"],
                },
                {
                  id: "city-list",
                  label: "শহরের তালিকায় ছয়বার Dhaka",
                  situation:
                    "মার্কেটিং দল জানতে চায় Customer রা কোন কোন শহর থেকে আসেন, যাতে প্রতিটা শহরের জন্য আলাদা বিজ্ঞাপন বানানো যায়। আপনার তালিকায় Dhaka বারবার আসছে।",
                  without:
                    "আপনি তালিকাটা Excel এ নিয়ে হাতে হাতে একই নামগুলো মুছে দেন। পরের সপ্তাহে নতুন Customer এলে আবার একই কাজ।",
                  withIt:
                    "আপনি SELECT DISTINCT city লেখেন, প্রতিটা শহর একবার আসে, সাজানোও থাকে। আর জানেন অন্য কোনো Query তে হঠাৎ একই Row দুইবার এলে DISTINCT দিয়ে চাপা দেওয়ার আগে কারণটা খুঁজতে হয়।",
                  lessons: ["DISTINCT", "ORDER BY"],
                },
                {
                  id: "price-label",
                  label: "সস্তা, মাঝারি না দামি",
                  situation:
                    "একটা প্রচারের Email এর জন্য প্রতিটা ট্যুরের পাশে একটা লেবেল চাই: দশ হাজারের নিচে সস্তা, পনেরো হাজার পর্যন্ত মাঝারি, তার বেশি দামি। Database এ এমন কোনো Column নেই।",
                  without:
                    "আপনি তালিকা Export করে Excel এ একটা Formula লেখেন, আর প্রতি মাসে দাম বদলালে আবার পুরো কাজটা করেন। একবার একটা ট্যুরের লেবেল ভুলও চলে যায়।",
                  withIt:
                    "আপনি SELECT এর ভেতরেই একটা CASE লেখেন, দামের সীমা অনুযায়ী লেবেল বসে যায়, আর দাম বদলালেও পরেরবার Query চালালেই লেবেল ঠিক থাকে। চাইলে একই CASE দিয়ে তালিকাটা দামি থেকে সস্তা ক্রমেও সাজান।",
                  lessons: ["CASE Expressions"],
                },
              ]}
              footer="প্রতিটা মুহূর্তে না জানলে আর জানলের তফাত একটাই জায়গায়: Database কী করছে তা বোঝা। যিনি বোঝেন, তিনি ঘুরপথে না গিয়ে এক লাইনে সমস্যা সারান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আর এই মডিউলের জিনিসগুলো কাজের জায়গায় কোথায় কোথায় চোখে পড়বে, তার একটা
                তালিকা:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Backend এর API তে।</strong> প্রায় প্রতিটা তালিকার Endpoint
                  আসলে একটা SELECT: Filter মানে WHERE, Sort মানে ORDER BY, পাতা মানে
                  LIMIT আর OFFSET বা Cursor, Search মানে ILIKE বা তার চেয়ে বড় কিছু।
                </ListItem>
                <ListItem>
                  <strong>Admin Dashboard আর অভ্যন্তরীণ Tool এ।</strong> কোন Booking
                  pending, কাদের Email নেই, কোন ট্যুর বন্ধ, এসব প্রশ্ন প্রতিদিন আসে, আর
                  প্রতিটার উত্তর একটা ছোট SELECT।
                </ListItem>
                <ListItem>
                  <strong>ORM এর Log এ।</strong> Prisma, Drizzle বা অন্য কোনো Tool যে
                  SQL পাঠাচ্ছে তা Log এ দেখা যায়। সেখানে LIMIT, ORDER BY আর WHERE পড়তে
                  পারলে ধীর Page বা ভুল Data এর কারণ দ্রুত ধরা পড়ে।
                </ListItem>
                <ListItem>
                  <strong>Report আর BI Tool এ।</strong> Metabase বা অন্য কোনো Report
                  Tool এর পেছনেও SQL চলে, আর সেখানে NULL আর DISTINCT এর নিয়মই ঠিক করে
                  সংখ্যাটা সঠিক কিনা।
                </ListItem>
                <ListItem>
                  <strong>Data Export এ।</strong> কোনো দলকে একটা CSV পাঠাতে হলে, ঠিক
                  কোন Column, কোন Row, কোন ক্রমে, সেটা একটা SELECT দিয়েই ঠিক হয়।
                </ListItem>
                <ListItem>
                  <strong>Interview এ।</strong> NULL এর তুলনা, AND আর OR এর অগ্রাধিকার,
                  Pagination এর উপায়, Query চলার ক্রম, এগুলো SQL Interview এর সবচেয়ে
                  চেনা প্রশ্নের মধ্যে পড়ে।
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
      title: <SectionTitle>Island Tours এর প্রতিটা Page এর পেছনে একটা SELECT</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর মতো একটা ব্যবসায় দিনে হাজার হাজারবার Database কে প্রশ্ন
                করা হয়, আর তার প্রায় সবটাই এই মডিউলের SELECT। কয়েকটা উদাহরণ, প্রতিটা
                কোন লেসনের জিনিস ব্যবহার করে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ট্যুরের তালিকার Page:</strong> শুধু চালু ট্যুর, দাম অনুযায়ী
                  সাজানো, এক Page এ কয়েকটা। WHERE, ORDER BY আর LIMIT, লেসন ৩, ৬ আর ৭।
                </ListItem>
                <ListItem>
                  <strong>Search Box:</strong> ট্যুরের নামের একটা অংশ, বড় ছোট অক্ষর
                  নির্বিশেষে। ILIKE, লেসন ৪।
                </ListItem>
                <ListItem>
                  <strong>আমার Booking গুলো Page:</strong> একজন Customer এর নিজের
                  Booking, নতুনটা আগে, আর পুরনোগুলো আরও নিচে নামলে লোড হয়। WHERE,
                  উল্টো ক্রমে ORDER BY, আর Keyset Pagination, লেসন ৩, ৬ আর ৭।
                </ListItem>
                <ListItem>
                  <strong>Support দলের তালিকা:</strong> যাঁদের ফোন নম্বর নেই, তাঁদের Email
                  এ যোগাযোগ করতে হবে। IS NULL, লেসন ৫।
                </ListItem>
                <ListItem>
                  <strong>Admin এর Booking তালিকা:</strong> Status এর পাশে বাংলা লেবেল,
                  আর pending গুলো সবার উপরে। CASE, লেসন ৯।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                উপরের Support দলের তালিকাটা নিচের বক্সে চালিয়ে দেখুন। এটাই ফারুক
                সাহেবের তৃতীয় প্রশ্নের সঠিক উত্তর। লেখার নিয়মটা আসবে লেসন ৫ এ, এখন শুধু
                দেখুন পাঁচজনই আসছেন কিনা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যাঁদের ফোন নম্বর নেই"
              query={`SELECT full_name, city, country
FROM customers
WHERE phone IS NULL
ORDER BY full_name;`}
              caption="পাঁচজন আসবেন: Aiman Zulkifli, Mitu Rahman, Oliver Bennett, Priya Sharma আর Tanvir Ahmed। এবার শেষ লাইনের আগের লাইনে IS NULL এর জায়গায় = NULL লিখে আবার চালান। Query চলবে, কোনো Error আসবে না, অথচ একটা Row ও আসবে না। এই মডিউলের সবচেয়ে চেনা নীরব ভুলটা এটাই, আর লেসন ৫ এ এর কারণ দেখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আর এই মডিউলে আপনি নিজে বাস্তবে যা যা করবেন, ক্রম ধরে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  প্রতিটা লেসনের Query বক্সগুলো চালাবেন, তারপর নিজের মতো বদলে আবার
                  চালাবেন। বদলাতে ভয় নেই, এই মডিউলের Query কিছু বদলায় না, আর কোনো বক্স
                  গোলমাল হলে Reset চাপলেই শুরুর অবস্থা।
                </ListItem>
                <ListItem>
                  প্রতিটা লেসনের অনুশীলনের বক্সে নিজে Query লিখে Check চাপবেন। সব মিলিয়ে
                  চল্লিশটার বেশি কাজ, সহজ থেকে কঠিন, প্রতিটা লেসনের শেষে একটা Challenge।
                </ListItem>
                <ListItem>
                  প্রতিটা লেসনের Lab এর Drill গুলো নিজের psql এ চালাবেন, Module 02 এ তোলা
                  island_tours Database এর উপর। প্রতিটা Drill এর পাশে লেখা থাকবে কতগুলো
                  Row আসার কথা, তাই নিজেই মিলিয়ে নিতে পারবেন।
                </ListItem>
                <ListItem>
                  একটা ফাইল খুলে রাখবেন, যেমন my-queries.sql, আর প্রতিটা লেসনে নিজের
                  লেখা সবচেয়ে কাজের Query গুলো সেখানে টুকে রাখবেন, ওপরে একটা লাইনে
                  লিখে রাখবেন কোন প্রশ্নের উত্তর। মডিউল শেষে এটাই হবে আপনার নিজের হাতে
                  বানানো SELECT এর অভিধান।
                </ListItem>
                <ListItem>
                  মডিউল শেষে ফারুক সাহেবের পাঁচটা প্রশ্নে ফিরে আসবেন, আর প্রতিটা এক
                  একটা Query তে লিখবেন। এই পাঁচটা Query ই মডিউলের আসল পরীক্ষা।
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
                "অন্যের লেখা SELECT Copy করে চালান, নিজে লিখতে ভরসা পান না",
                "সব Column একসাথে চেয়ে তারপর চোখ দিয়ে খোঁজেন",
                "AND আর OR একসাথে লিখলে কী হবে আন্দাজে ছেড়ে দেন",
                "ফাঁকা ঘর খুঁজতে = NULL লেখেন আর শূন্য Row পেয়ে অবাক হন",
                "ভাবেন Row গুলো সবসময় একই ক্রমে ফেরে",
                "Page ভাগ করা মানে শুধু LIMIT আর OFFSET, এর বেশি কিছু জানেন না",
                "লেবেল বা ভাগ বানাতে Data Export করে Excel এ যান",
              ]}
              after={[
                "যেকোনো প্রশ্নকে FROM, WHERE, SELECT, ORDER BY আর LIMIT এ ভেঙে Query লিখতে পারেন",
                "Database কোন ক্রমে Query পড়ে তা জানেন, তাই নামের Error দেখে অবাক হন না",
                "বন্ধনী দিয়ে শর্তের অর্থ নিজের হাতে ঠিক করেন",
                "NULL কে অজানা হিসেবে ভাবেন আর IS NULL দিয়ে ঠিক Row খুঁজে পান",
                "ক্রম নিশ্চিত করতে একটা অনন্য Column যোগ করেন",
                "বড় তালিকায় OFFSET আর Keyset Pagination এর তফাত বোঝাতে পারেন",
                "CASE দিয়ে Query এর ভেতরেই লেবেল আর নিজের পছন্দের ক্রম বানান",
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
                এই মডিউলের মানদণ্ড হলো একটা Query পড়ে শোনাতে পারা। কাউকে একটা Query
                দেখিয়ে আপনি বলবেন, Database প্রথমে এই Table টা নেয়, তারপর এই শর্তে Row
                ছাঁকে, তারপর এই Column গুলো রাখে, তারপর এভাবে সাজায়, আর শেষে এতগুলো
                রাখে। আর বলবেন কোন লাইনটা বদলালে উত্তর কীভাবে বদলাবে, বিশেষ করে NULL
                থাকলে।
              </ContentParagraph>
              <ContentParagraph>
                এটা পারলে আপনি শুধু SQL লিখতে শেখেননি, SQL নিয়ে ভাবতে শিখেছেন। আর এই
                ট্র্যাকের লক্ষ্যও তাই, আপনি শুধু নিজে Query লিখবেন না, পাশের কাউকে বুঝিয়ে
                দিতে পারবেন কেন Query টা ঠিক, অথবা কোথায় ভুল।
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
                <strong>আগে যা লাগবে।</strong> Module 01 এর লেসন ৪ আর ৫, যেখানে Table,
                Row, Column আর SQL কী সেটা আছে। আর Module 02 শেষ করা থাকলে সবচেয়ে ভালো,
                কারণ তাহলে নিজের psql এ island_tours Database তৈরি আছে আর Lab এর Drill
                গুলো সেখানে চালাতে পারবেন। Module 02 এখনো শেষ না হলেও এই মডিউল শুরু
                করতে পারেন, লেসনের ভেতরের Query বক্স আর অনুশীলনের বক্স Browser এই চলে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>সময়।</strong> পুরো মডিউলের জন্য পাঁচ ছয় দিন ধরে রাখুন। নয়টা লেসন
                পড়তে মোট চার থেকে পাঁচ ঘণ্টা লাগে, তার সাথে অনুশীলন আর Drill। দিনে
                দুইটা লেসন যথেষ্ট, তার বেশি না। SELECT শেখা হয় হাত চালিয়ে, আর প্রতিটা
                লেসনের কাজগুলো নিজে না করলে পরের লেসনে গিয়ে আগের জিনিসগুলো ঝাপসা লাগবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ক্রম।</strong> লেসনগুলো ক্রম ধরে পড়ুন। প্রতিটা লেসনের Query
                আগের লেসনের Query কে বড় করে, আর লেসন ৫ এর NULL এর ধারণা পরের সব লেসনে
                ফিরে ফিরে আসে। একটা লেসন বাদ দিয়ে এগোলে পরের লেসনের কোনো উদাহরণ
                অকারণে কঠিন লাগবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Query বক্স।</strong> প্রতিটা বক্স আগে যেমন আছে তেমন চালান, তারপর
                একটা কিছু বদলান: একটা Column বাদ দিন, শর্তের সংখ্যাটা বদলান, ক্রম উল্টে
                দিন। প্রতিবার চালানোর আগে মনে মনে অনুমান করুন কী আসবে, তারপর মিলিয়ে
                দেখুন। অনুমান ভুল হলে সেখানেই আসল শেখা।
              </ContentParagraph>
              <ContentParagraph>
                <strong>অনুশীলনের বক্স।</strong> আগে নিজে চেষ্টা করুন, অন্তত দুইবার।
                তারপর Hint। Solution খুলুন সবার শেষে, আর খোলার পর সেটা Copy না করে
                নিজের হাতে লিখে আবার Check চাপুন। মনে রাখবেন, আপনার Query সমাধানের মতো
                দেখতে না হলেও চলবে, ফলাফল এক হলেই সঠিক।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Lab আর Quiz।</strong> Lab এর Drill গুলো নিজের psql এ চালান আর
                প্রতিটার পাশে লেখা Row এর সংখ্যার সাথে মিলিয়ে নিন। Quiz দিন লেসন শেষ
                করার পরের দিন, যাতে বোঝা যায় কতটা মনে আছে, শুধু কতটা এইমাত্র পড়েছেন তা
                নয়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>MySQL এর ভিডিও দেখছেন?</strong> সুখবর হলো, এই মডিউলের প্রায় সবকিছু
                MySQL এ হুবহু একই। পার্থক্য কয়েকটা জায়গায়, যেমন বড় ছোট অক্ষর নির্বিশেষে
                খোঁজা, NULL গুলো সাজানোর সময় কোথায় বসে, LIMIT এর একটা আলাদা লেখার ধরন, আর
                PostgreSQL এর DISTINCT ON। প্রতিটা পার্থক্য সংশ্লিষ্ট লেসনে আলাদা করে
                দেখানো থাকবে, যাচাই করা অবস্থায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>আটকে গেলে।</strong> প্রথমে Error টা পুরোটা পড়ুন, Module 02 এর লেসন
                ৭ এর মতো করে: কোন লাইনের কোন জায়গায়, আর কোনো HINT আছে কিনা। Error না
                এসে ভুল উত্তর এলে Query টাকে ছোট করুন: শর্তগুলো একটা একটা করে সরিয়ে
                দেখুন কোনটায় গিয়ে উত্তর বদলায়। আর NULL আছে এমন Column এর উপর শর্ত থাকলে
                সবার আগে সেটাই সন্দেহ করুন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>পরের ধাপ।</strong> এখান থেকে সোজা চলে যান প্রথম লেসনে,{" "}
                <strong>SELECT and FROM</strong>, যেখানে আপনি নিজের হাতে প্রথম SELECT
                লিখবেন, প্রথম লাইন থেকে।
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
        "SELECT and FROM",
        "FROM বলে কোন Table, SELECT বলে কোন Column আর কোন হিসাব, আর AS দিয়ে ফলাফলের Column কে নিজের পছন্দের নাম দেওয়া যায়",
      ],
      [
        "The Logical Order of a Query",
        "Database Query পড়ে FROM থেকে, তারপর WHERE, তারপর SELECT, তারপর ORDER BY আর LIMIT, তাই নতুন নাম WHERE এ চলে না কিন্তু ORDER BY তে চলে",
      ],
      [
        "WHERE with AND, OR, NOT",
        "WHERE শুধু সেই Row রাখে যেখানে শর্ত সত্য, আর AND আগে খাটে OR এর চেয়ে, তাই মেশানো শর্তে বন্ধনী দিয়ে নিজের অর্থ নিজে ঠিক করতে হয়",
      ],
      [
        "IN, BETWEEN, LIKE and ILIKE",
        "IN মেলায় তালিকা, BETWEEN মেলায় দুই প্রান্তসহ সীমা, LIKE মেলায় নামের অংশ, আর PostgreSQL এ বড় ছোট অক্ষর নির্বিশেষে খুঁজতে লাগে ILIKE",
      ],
      [
        "NULL and Three-valued Logic",
        "NULL মানে অজানা, তার সাথে যেকোনো তুলনার উত্তরও অজানা, তাই ফাঁকা ঘর খুঁজতে = NULL নয়, IS NULL লিখতে হয়",
      ],
      [
        "ORDER BY",
        "ORDER BY ছাড়া কোনো ক্রমের নিশ্চয়তা নেই, আর একই মানের Row এর ক্রম স্থির করতে শেষে একটা অনন্য Column যোগ করতে হয়",
      ],
      [
        "LIMIT, OFFSET and Pagination",
        "LIMIT নেয় প্রথম কয়েকটা Row, OFFSET বাদ দেয় আগের কয়েকটা, আর বড় তালিকায় শেষ দেখা Row থেকে পরেরগুলো আনা মানে Keyset Pagination বেশি দ্রুত আর নির্ভুল",
      ],
      [
        "DISTINCT",
        "DISTINCT একই Row বারবার না দেখিয়ে একবার দেখায়, আর হঠাৎ এর দরকার পড়লে আগে খুঁজে দেখতে হয় একই Row দুইবার আসছে কেন",
      ],
      [
        "CASE Expressions",
        "CASE প্রতিটা Row এর জন্য প্রথম সত্য শর্তের ফল বসায়, আর কোনোটা না মিললে ELSE, না থাকলে NULL, যা দিয়ে লেবেল আর নিজের পছন্দের ক্রম বানানো যায়",
      ],
    ],
  },
};
