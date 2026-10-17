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
  ReportPlacementLab,
  RowColumnScanLab,
  WorkloadSorterLab,
} from "../../../components/course/topics/sql-basics/oltp-animations";
import {
  ModuleStoryDiagram,
  OltpOlapSplit,
  ReportHomesDiagram,
  RowColumnStorageDiagram,
} from "../../../components/course/topics/sql-basics/oltp-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";

export const oltpVsOlapContent: TopicData = {
  id: "oltp-vs-olap",
  introduction: {
    badge: "MODULE 01 · LESSON 07",
    title: <SectionTitle>একই Database, দুই রকম প্রশ্ন</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          মঙ্গলবার সকাল সোয়া দশটা। Nusrat Jahan ঢাকায় বসে ফোনে Island Tours খুলে
          Saint Martin ট্যুরের ২০ নভেম্বরের তারিখে দুইটা সিট বুক করলেন। বুক করুন
          বোতাম চাপার পর তিনি স্ক্রিনের দিকে তাকিয়ে আছেন। এক সেকেন্ডের মধ্যে
          নিশ্চিত হওয়ার বার্তা না এলে তিনি আবার চাপবেন, অথবা বিরক্ত হয়ে অ্যাপটাই
          বন্ধ করে দেবেন।
        </ContentParagraph>
        <ContentParagraph>
          ঠিক সেই মুহূর্তে Island Tours এর অফিসে Accountant সাহেব একটা প্রশ্ন নিয়ে
          বসেছেন। গত বছর প্রতি মাসে আসলে কত টাকা এসেছে, আর কোন Destination থেকে
          সবচেয়ে বেশি। উত্তরটা তাঁর দরকার আজ বিকেলের মিটিংয়ের আগে। কয়েক সেকেন্ড,
          এমনকি এক মিনিট লাগলেও তাঁর কোনো সমস্যা নেই।
        </ContentParagraph>
        <ContentParagraph>
          দুজনেই একই Database কে প্রশ্ন করছেন, একই Table থেকে উত্তর চাইছেন। অথচ
          প্রশ্ন দুটোর চরিত্র একেবারে আলাদা। Nusrat এর কাজ ছোট, ঠিক দুই একটা
          Row নিয়ে, আর সেটা হতে হবে চোখের পলকে। Accountant এর কাজ বিশাল, বছরের সব
          Booking পড়ে শেষে একটা ছোট Table বানানো। প্রথম ধরনের কাজের নাম OLTP,
          দ্বিতীয়টার নাম OLAP।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি জানবেন এই দুই নামের মানে কী, দুই ধরনের কাজ Database এর
          ভেতরে কেন এত আলাদা আচরণ করে, Data কে Disk এ সারি ধরে রাখা আর কলাম ধরে
          রাখার তফাত কী, একটা ভারী Report কীভাবে Customer দের Booking ধীর করে
          দিতে পারে, আর বড় কোম্পানিগুলো Report কে লেনদেনের Database থেকে কোথায়
          সরিয়ে রাখে। এটা Module 01 এর শেষ লেসন, তাই শেষে পুরো মডিউলটা একসাথে
          জোড়া লাগিয়ে দেখব, আর তারপর Module 02 এর দরজায় পৌঁছাব।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "দোকানের ক্যাশ কাউন্টারে প্রতিটা বিক্রি এক মুহূর্তে খাতায় ওঠে, কারণ পেছনে লাইনে মানুষ দাঁড়িয়ে। মাস শেষে মালিক সেই খাতা নিয়ে রাতে বসেন, পুরো মাসের হিসাব মেলাতে। খাতা একটাই, কাজ দুটো একেবারে আলাদা।",
      author: "OLTP আর OLAP",
      role: "Lesson 07",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "two-questions",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>দোকানের কাউন্টার আর মাস শেষের খাতা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পাড়ার একটা মুদি দোকানের কথা ভাবুন। সারাদিন কাউন্টারে একজন বসে
                থাকেন। কেউ এক কেজি চাল নিলেন, কেউ একটা সাবান। প্রতিটা বিক্রির
                পর দোকানি খাতায় এক লাইন লেখেন, কী বিক্রি হলো, কত টাকা। এই লেখাটা
                হয় খুব দ্রুত, কারণ পেছনে আরও তিনজন দাঁড়িয়ে আছেন। আর লেখাটা
                নির্ভুল হতে হয়, কারণ এক টাকার ভুল মানে দিন শেষে ক্যাশ মিলবে না।
              </ContentParagraph>
              <ContentParagraph>
                মাস শেষে দোকানের মালিক রাতে সেই খাতা নিয়ে বসেন। এবার প্রশ্ন একদম
                আলাদা। এই মাসে মোট কত বিক্রি হলো? কোন জিনিস সবচেয়ে বেশি চলেছে?
                গত মাসের তুলনায় বাড়ল না কমল? এই প্রশ্নের উত্তর দিতে তাঁকে পুরো
                মাসের প্রতিটা পাতা উল্টাতে হয়, যোগ করতে হয়, ভাগ করতে হয়। কেউ তাঁর
                পেছনে দাঁড়িয়ে নেই। এক ঘণ্টা লাগলেও ক্ষতি নেই। কিন্তু খাতায় নতুন
                কিছু তিনি লেখেন না, শুধু পড়েন আর হিসাব করেন।
              </ContentParagraph>
              <ContentParagraph>
                একই খাতা, দুই রকম ব্যবহার। দোকানির কাজকে বলা যায় লেনদেন, ইংরেজিতে
                Transaction। একটা ব্যবসায়িক ঘটনা, যেটা ঘটে আর সাথে সাথে খাতায়
                ওঠে। মালিকের কাজকে বলা যায় বিশ্লেষণ, ইংরেজিতে Analysis। অনেকগুলো
                ঘটনা একসাথে দেখে একটা বড় ছবি বের করা।
              </ContentParagraph>
              <ContentParagraph>
                Database এর জগতে এই দুই ধরনের কাজের দুইটা নাম আছে। লেনদেনের কাজ
                হলো OLTP, Online Transaction Processing। বিশ্লেষণের কাজ হলো OLAP,
                Online Analytical Processing। নাম দুটো শুনতে প্রায় একই, একটা অক্ষর
                শুধু আলাদা, কিন্তু এই একটা অক্ষর ঠিক করে দেয় Database টা কীভাবে
                সাজানো হবে, কোন মেশিনে চলবে, আর কোন ভুল সবচেয়ে বিপজ্জনক।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এ ফেরা যাক। Nusrat এর Booking হলো দোকানের কাউন্টার।
                Accountant এর মাসিক হিসাব হলো মালিকের খাতা মেলানো। দুটোই একই
                bookings Table ছোঁয়, কিন্তু একটা ছোঁয় দুই একটা Row, আরেকটা ছোঁয়
                সবগুলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "দুইটা প্রশ্নেই আসল তফাত ধরা পড়ে",
          content: (
            <div className="space-y-3">
              <p>
                যেকোনো Database এর কাজ দেখে দুইটা প্রশ্ন করুন। এক, কেউ কি এই
                মুহূর্তে স্ক্রিনের সামনে উত্তরের জন্য অপেক্ষা করছেন? দুই, উত্তর
                বের করতে কয়টা Row ছুঁতে হবে, হাতে গোনা কয়েকটা নাকি প্রায় সবগুলো?
              </p>
              <p>
                কেউ অপেক্ষা করছেন আর কয়েকটা Row, তাহলে OLTP। কেউ তাড়ায় নেই আর
                প্রায় সব Row, তাহলে OLAP। এই লেসনের বাকি সবকিছু এই দুই প্রশ্ন
                থেকেই বেরিয়ে আসে।
              </p>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "oltp",
      subHeader: { index: "002", title: "OLTP" },
      title: <SectionTitle>OLTP: প্রতি মুহূর্তের লেনদেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                OLTP এর পুরো নাম Online Transaction Processing। শব্দগুলো একটা
                একটা করে খুলে দেখা যাক, কারণ প্রতিটা শব্দেরই একটা ছোট ইতিহাস আছে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Online</strong> শব্দটা দেখে Internet মনে হতে পারে, কিন্তু
                এখানে মানে অন্য। কম্পিউটারের শুরুর যুগে অনেক কাজ চলত Batch এ, মানে
                দিনভর কাগজে কাজ জমিয়ে রাতে একসাথে কম্পিউটারে ঢোকানো হতো, আর ফল
                পাওয়া যেত পরদিন। Online মানে ছিল উল্টোটা: মানুষ কম্পিউটারের সামনে
                বসে আছেন, কাজটা এখনই হবে, ফল এখনই দেখবেন। ব্যাংকের কাউন্টার আর
                বিমানের টিকিট বিক্রির System ছিল এমন কাজের প্রথম বড় উদাহরণ। আজও
                Online এর মানে সেটাই, কেউ একজন অপেক্ষা করছেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Transaction</strong> শব্দটার এই কোর্সে দুইটা মানে পাবেন,
                তাই এখনই আলাদা করে রাখা ভালো। প্রথম মানে ব্যবসার ভাষায়, একটা
                লেনদেন: একটা Booking, একটা Payment, একটা Refund। দ্বিতীয় মানে
                Database এর ভাষায়, কয়েকটা কাজের এমন একটা গুচ্ছ যেটা হয় পুরোটা হবে,
                নয়তো একটাও হবে না। যেমন Booking এর Row ঢোকানো আর খালি সিটের সংখ্যা
                কমানো, এই দুটো একসাথে হতে হবে। দ্বিতীয় মানেটা আপনি গভীরভাবে শিখবেন
                Module 12 এ। এখানে প্রথম মানেটাই যথেষ্ট, তবে দেখবেন দুটো মানে আসলে
                পাশাপাশি হাঁটে, কারণ প্রতিটা ব্যবসায়িক লেনদেন Database এ একটা
                Transaction হয়ে ঢোকে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Processing</strong> মানে সামলানো। সব মিলিয়ে OLTP মানে
                দাঁড়ায়: মানুষ অপেক্ষা করছেন এমন অবস্থায় একের পর এক ছোট ছোট লেনদেন
                সামলানো।
              </ContentParagraph>
              <ContentParagraph>একটা OLTP কাজকে চেনার সাতটা লক্ষণ:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>অনেক মানুষ একসাথে।</strong> শীতের মৌসুমে Island Tours এ
                  একই মিনিটে কয়েকশো মানুষ ট্যুর দেখছেন, কেউ বুক করছেন, কেউ টাকা
                  দিচ্ছেন। Database কে এদের সবাইকে একসাথে সামলাতে হয়।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা কাজ হাতে গোনা কয়েকটা Row ছোঁয়।</strong> Nusrat
                  এর Booking একটা নতুন Row ঢোকায় আর একটা Row এর খালি সিটের সংখ্যা
                  বদলায়। ব্যস। সেই Row গুলো খোঁজা হয় একটা নির্দিষ্ট চাবি দিয়ে,
                  যেমন booking_id বা email। এই চাবির নাম Primary Key, যেটা আপনি
                  Lesson 04 এ দেখেছেন।
                </ListItem>
                <ListItem>
                  <strong>পড়া আর লেখা দুটোই।</strong> খালি সিট দেখানো হলো পড়া,
                  Booking ঢোকানো হলো লেখা। OLTP তে লেখা অনেক, আর লেখা মানেই সাবধানে
                  থাকা।
                </ListItem>
                <ListItem>
                  <strong>এই মুহূর্তের অবস্থা দরকার।</strong> ট্যুরের পাতায় যে
                  খালি সিট দেখানো হবে, সেটা হতে হবে এখনকার সংখ্যা। পাঁচ মিনিট আগের
                  সংখ্যা দেখালে দুজন একই শেষ সিট বুক করতে চাইবেন।
                </ListItem>
                <ListItem>
                  <strong>উত্তর মিলিসেকেন্ডে।</strong> একটা Booking এর পুরো যাত্রায়
                  Database এর ভাগ সাধারণত কয়েক মিলিসেকেন্ড। কারণ এর উপর আরও Network,
                  API আর Payment এর সময় যোগ হবে, আর সব মিলিয়ে Customer এর ধৈর্যের
                  সীমা এক দুই সেকেন্ড।
                </ListItem>
                <ListItem>
                  <strong>নির্ভুলতায় কোনো ছাড় নেই।</strong> টাকা দুইবার কাটা,
                  একই সিট দুইজনকে বিক্রি, Payment হয়ে গেল অথচ Booking নেই, এগুলো
                  ছোট ভুল না, এগুলো ব্যবসার ক্ষতি আর মানুষের ভোগান্তি।
                </ListItem>
                <ListItem>
                  <strong>Table গুলো এমনভাবে সাজানো যাতে একই তথ্য দুই জায়গায় না
                  থাকে।</strong> ট্যুরের দাম থাকে শুধু tours Table এ, প্রতিটা
                  Booking এ নয়। দাম বদলাতে হলে এক জায়গায় বদলালেই হয়। এই সাজানোর
                  নিয়মের নাম Normalization, পুরোটা শিখবেন Module 11 এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Island Tours এ OLTP কাজের উদাহরণ চারদিকে: একজন নতুন Customer এর
                Account খোলা, একটা ট্যুরের পাতায় খালি সিট দেখানো, একটা Booking,
                bKash থেকে Payment সফলের খবর এলে Booking কে confirmed করা, কেউ
                Booking বাতিল করলে সিট ফেরত দেওয়া, একজন Customer তাঁর ফোন নম্বর
                বদলালেন। প্রতিটার পেছনে একজন মানুষ, প্রতিটা ছোট, প্রতিটা এখনই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "OLTP এর ভুল মানে টাকার ভুল",
          content: (
            <p>
              Report এ একটা ভুল সংখ্যা এলে কেউ ধরে ফেলেন, Query ঠিক করে আবার চালানো
              হয়। কিন্তু OLTP তে ভুল হলে সেটা ঘটে যায় একজন সত্যিকারের মানুষের সাথে,
              তাঁর টাকা আর তাঁর ছুটির পরিকল্পনা নিয়ে। তাই লেনদেনের Database এ গতি
              যতটা জরুরি, নির্ভুলতা তার চেয়েও বেশি জরুরি। এই নির্ভুলতা রক্ষার
              যন্ত্রগুলো, Constraint, Transaction আর Lock, আপনি Module 09 আর Module
              12 এ ধাপে ধাপে শিখবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "olap",
      subHeader: { index: "003", title: "OLAP" },
      title: <SectionTitle>OLAP: পেছনে তাকিয়ে বড় প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                OLAP এর পুরো নাম Online Analytical Processing। Analytical মানে
                বিশ্লেষণমূলক। নামটা তৈরি করেছিলেন Edgar F. Codd, ১৯৯৩ সালে। এই
                মানুষটার নাম আপনি Lesson 04 এ শুনেছেন, তিনিই Relational Model এর
                জনক। মজার ব্যাপার, যে মানুষ লেনদেনের Database এর ভিত্তি গড়েছিলেন,
                তিনিই পরে বললেন বিশ্লেষণের কাজের জন্য আলাদা ভাবনা দরকার।
              </ContentParagraph>
              <ContentParagraph>
                এখানে Online এর মানে একটু অন্য রকম। মানুষ কাজটা নিজে বসে বসে
                ঘাঁটাঘাঁটি করেন, একটা প্রশ্নের উত্তর দেখে পরের প্রশ্ন করেন। আগের
                দিনে এমন একটা Report এর জন্য কয়েক দিন অপেক্ষা করতে হতো, Online
                মানে সেই অপেক্ষা কমে সেকেন্ড বা মিনিটে নেমে আসা। কিন্তু মিলিসেকেন্ড
                কেউ আশা করেন না।
              </ContentParagraph>
              <ContentParagraph>একটা OLAP কাজকে চেনার লক্ষণগুলো:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>অল্প কয়েকজন মানুষ।</strong> Accountant, Marketing এর
                  একজন, কোম্পানির মালিক, Data নিয়ে কাজ করেন এমন একজন Analyst।
                  হাজার Customer না, হাতে গোনা কয়েকজন।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা প্রশ্ন বিশাল পরিমাণ Row পড়ে।</strong> গত এক বছরের
                  সব Booking, সব Payment, সব Review। আর পড়ার পর সেগুলোকে দলে ভাগ করা
                  হয়, যোগ, গড় বা গোনা হয়। এই যোগ আর গোনার কাজের নাম Aggregation,
                  আর তার জন্য SQL এর SUM, COUNT, AVG এর মতো Function আপনি শিখবেন
                  Module 05 এ।
                </ListItem>
                <ListItem>
                  <strong>প্রায় শুধু পড়া।</strong> Report বানাতে গিয়ে কেউ Booking
                  বদলান না। OLAP এর Data বদলায় শুধু নতুন ইতিহাস যোগ হলে।
                </ListItem>
                <ListItem>
                  <strong>ইতিহাস দরকার, এই মুহূর্ত না।</strong> গত মাসের আয় জানতে
                  এই সেকেন্ডের Booking লাগে না। গতকাল রাত পর্যন্ত Data হলেই চলে।
                </ListItem>
                <ListItem>
                  <strong>উত্তর সেকেন্ডে বা মিনিটে।</strong> একটা বড় Report দশ সেকেন্ড
                  নিলেও কেউ অভিযোগ করেন না। তবে সেই দশ সেকেন্ড Database এর উপর যে
                  চাপ ফেলে, সেটাই এই লেসনের সবচেয়ে গুরুত্বপূর্ণ সমস্যা, Section 008 এ
                  দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>অনেক উৎসের Data একসাথে।</strong> Booking এর Data থাকে
                  Database এ, বিজ্ঞাপনের খরচ থাকে Facebook এ, খরচের হিসাব থাকে
                  Accounting Software এ। ভালো একটা বিশ্লেষণ প্রায়ই এগুলো মিলিয়ে করতে
                  হয়।
                </ListItem>
                <ListItem>
                  <strong>Table গুলো সাজানো পড়ার সুবিধা দেখে।</strong> OLTP তে
                  একই তথ্য দুই জায়গায় না রাখার নিয়ম ছিল। OLAP এ প্রায়ই উল্টোটা,
                  জেনেশুনে তথ্য কপি করে রাখা হয় যাতে পড়ার সময় কম Table জোড়া দিতে
                  হয়। Section 011 এ এর একটা উদাহরণ দেখবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Island Tours এ OLAP প্রশ্নের উদাহরণ: প্রতি মাসে কত আয় হলো, কোন
                Destination সবচেয়ে বেশি টাকা আনল, কোন ট্যুর সবচেয়ে বেশি বাতিল হয়,
                ঢাকার Customer রা কোন জায়গা বেশি পছন্দ করেন, প্রতিটা ট্যুরের গড়
                Rating কত, আগামী শীতে কত চাহিদা হতে পারে। এর একটারও উত্তরের জন্য
                কেউ মোবাইল হাতে দাঁড়িয়ে নেই, আর প্রতিটার জন্য প্রায় সব Row পড়তে হয়।
              </ContentParagraph>
              <ContentParagraph>
                OLAP এর ফল সাধারণত মানুষ দেখেন দুইভাবে। একটা হলো Report, একটা
                নির্দিষ্ট প্রশ্নের নির্দিষ্ট উত্তর, যেমন অক্টোবরের আয়ের Table।
                আরেকটা হলো Dashboard, একটা পাতায় কয়েকটা Chart আর সংখ্যা, যেটা
                প্রতিদিন নিজে থেকে আপডেট হয়। Dashboard বানানোর Software গুলোকে বলে
                BI Tool, Business Intelligence, যেমন Metabase, Power BI বা Looker
                Studio। এরা সবাই ভেতরে ভেতরে Database কে SQL এ প্রশ্ন করে, ঠিক
                আপনি যেভাবে শিখছেন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "side-by-side",
      subHeader: { index: "004", title: "Side by Side" },
      title: <SectionTitle>দুইটা কাজ পাশাপাশি রাখলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথমে ছবিতে দেখুন। বাঁয়ে পাঁচজন Customer, প্রত্যেকের তীর গিয়ে
              পড়েছে Table এর একটা করে Row তে। ডানে একজন Accountant, তাঁর তীর ছড়িয়ে
              গেছে পুরো Table জুড়ে, আর শেষে বেরিয়েছে একটাই সংখ্যা। সংখ্যাটা
              কাল্পনিক না, Island Tours এর সব confirmed Booking এর মোট টাকা, একটু পরে
              নিজেই Query চালিয়ে এটা বের করবেন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OltpOlapSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একটা Table এ সব তফাত একসাথে। এই Table টা একবার ভালো করে পড়ে
              রাখুন, Interview তে OLTP আর OLAP এর তফাত জিজ্ঞেস করলে প্রায় এই
              উত্তরটাই আশা করা হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["যা দেখছি", "OLTP", "OLAP"],
          rows: [
            [<strong key="a">কে ব্যবহার করেন</strong>, "হাজার হাজার Customer, App এর মাধ্যমে", "কয়েকজন Analyst, Accountant, মালিক"],
            [<strong key="b">প্রতিটা কাজে কয়টা Row</strong>, "এক থেকে কয়েকটা, চাবি দিয়ে খোঁজা", "হাজার থেকে কোটি, প্রায় পুরো Table"],
            [<strong key="c">পড়া না লেখা</strong>, "দুটোই, লেখা অনেক", "প্রায় শুধু পড়া"],
            [<strong key="d">কোন Data</strong>, "এই মুহূর্তের অবস্থা", "মাস বা বছরের ইতিহাস"],
            [<strong key="e">উত্তরের সময়</strong>, "মিলিসেকেন্ড", "সেকেন্ড থেকে মিনিট"],
            [<strong key="f">একসাথে কতগুলো কাজ</strong>, "শত শত, হাজার হাজার", "হাতে গোনা কয়েকটা"],
            [<strong key="g">সবচেয়ে বড় ভয়</strong>, "ভুল লেনদেন, দুইবার বিক্রি, হারানো টাকা", "ধীর Report, ভুল হিসাব"],
            [<strong key="h">Table এর নকশা</strong>, "একই তথ্য এক জায়গায় (Normalized)", "পড়ার সুবিধায় কপি করা তথ্য (Denormalized)"],
            [<strong key="i">Disk এ সাজানো</strong>, "Row ধরে (Row Store)", "প্রায়ই Column ধরে (Column Store)"],
            [<strong key="j">Island Tours এ উদাহরণ</strong>, "Booking, Payment, খালি সিট দেখানো", "মাসিক আয়, জনপ্রিয় Destination, গড় Rating"],
            [<strong key="k">চেনা Software</strong>, "PostgreSQL, MySQL, SQL Server, Oracle", "ClickHouse, BigQuery, Snowflake, Redshift, DuckDB"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একটা Database, দুটো কাজ, এটাই শুরুতে স্বাভাবিক",
          content: (
            <p>
              Table এর শেষ লাইন দেখে ভাববেন না যে OLAP এর জন্য প্রথম দিন থেকেই
              আলাদা Software লাগে। Island Tours এর মতো ছোট বা মাঝারি কোম্পানিতে
              PostgreSQL একাই দুটো কাজ চালায়, আর ভালোভাবেই চালায়। আলাদা System
              লাগে যখন Data অনেক বড় হয়ে যায় বা Report মূল Database কে ধীর করতে শুরু
              করে। কখন সেই সময় আসে, সেটা Section 009 এ দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "sort-the-work",
      subHeader: { index: "005", title: "Sort the Work" },
      title: <SectionTitle>আটটা কাজ, আপনি বলুন কোনটা কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নাম মনে রাখার চেয়ে চিনতে পারা বেশি জরুরি। নিচে Island Tours এর আটটা
              সত্যিকারের কাজ। প্রতিটার পাশে OLTP বা OLAP বেছে নিন। বেছে নেওয়ার
              সাথে সাথে উত্তর, কয়টা Row ছুঁতে হয়, কত ঘন ঘন কাজটা হয়, আর কেন, সব
              দেখতে পাবেন। ভুল হলে মন খারাপের কিছু নেই, ভুলটা কেন হলো সেটা পড়াই
              আসল শেখা।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WorkloadSorterLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                খেয়াল করেছেন হয়তো, দুই একটা কাজ প্রথম দেখায় দ্বিধায় ফেলে। যেমন
                bKash এর Payment এর খবর। এটা টাকার ব্যাপার, তাই মনে হতে পারে বড়
                হিসাব, OLAP। কিন্তু কাজটা আসলে একটা Booking এর একটা Payment, একটা
                Row ঢোকানো আর একটা Row বদলানো, আর সেটা হতে হবে এখনই। টাকা জড়িত
                থাকলেই কাজ বড় হয় না। কাজ বড় হয় কয়টা Row ছুঁতে হয় তা দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                উল্টো দিকে CEO এর Dashboard দেখতে ছোট, মাত্র কয়েকটা সংখ্যা। কিন্তু
                প্রতিটা সংখ্যার পেছনে হাজার হাজার Row পড়া হয়েছে। উত্তর ছোট হলেই
                কাজ ছোট হয় না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "see-it",
      subHeader: { index: "006", title: "See It Yourself" },
      title: <SectionTitle>নিজের চোখে দুই রকম Query</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Island Tours এর আসল Database এ দুই রকম কাজ নিজেই চালিয়ে দেখুন।
                নিচের প্রতিটা বক্সে সত্যিকারের PostgreSQL চলছে, আপনার Browser এর
                ভেতরে। আপনি এখনো SELECT লেখা শেখেননি, সেটা Module 03 এর কাজ। এখন
                শুধু Run চাপুন আর দুইটা জিনিস খেয়াল করুন: কয়টা Row উত্তর হিসেবে এলো,
                আর সেই উত্তর বের করতে Database কে কয়টা Row দেখতে হয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম বক্সটা দুইটা OLTP পড়া। একটা Booking কে তার নম্বর দিয়ে খোঁজা,
                আর একটা তারিখে কয়টা সিট খালি সেটা দেখা। ট্যুরের পাতা খুললেই App
                Database কে ঠিক এমন প্রশ্ন করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="OLTP: একটা Booking, একটা তারিখ"
              query={`SELECT booking_id, customer_id, departure_id, seats, status, total_bdt
FROM bookings
WHERE booking_id = 13;

SELECT departure_id, tour_id, starts_on, seats_left
FROM departures
WHERE departure_id = 9;`}
              caption="দুইটা Query, দুইটা ফল, প্রতিটায় একটা করে Row। Booking 13 হলো Nusrat Jahan (customer_id 2) এর, Saint Martin এর ২০ নভেম্বরের তারিখে দুইটা সিট। আর Departure 9 মানে Saint Martin এর ১৮ ডিসেম্বরের তারিখ, সেখানে ১৯টা সিট খালি। নিচের লেখার বক্স চালানোর পর এই বক্স আবার চালালে সংখ্যাটা কমে যাবে, কারণ এই পাতার সব বক্স একই Database ব্যবহার করে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Query একটা Row ফেরত দিল, আর Database কে আসলে সেই একটা Row
                ই খুঁজে বের করতে হয়েছে। booking_id হলো bookings Table এর Primary
                Key, আর Primary Key এর পাশে Database নিজে থেকেই একটা সূচি বানিয়ে
                রাখে, যার নাম Index। বইয়ের শেষের সূচি দেখে যেমন সরাসরি পাতায় যাওয়া
                যায়, Index দেখে Database সরাসরি Row এ চলে যায়। দশ লাখ Booking থাকলেও
                এই Query মিলিসেকেন্ডের ভেতরে শেষ হয়। Index কীভাবে কাজ করে তা পুরোটা
                দেখবেন Module 13 এ।
              </ContentParagraph>
              <ContentParagraph>
                এবার একটা OLTP লেখা। Imran Kabir এখনো কিছু বুক করেননি। ধরুন তিনি
                Saint Martin এর ১৮ ডিসেম্বরের তারিখে দুইটা সিট নিলেন। Database এ
                দুইটা কাজ একসাথে হতে হবে: সেই তারিখের খালি সিট দুইটা কমবে, আর একটা
                নতুন Booking এর Row ঢুকবে। BEGIN আর COMMIT এর মাঝে রাখা মানে, এই দুটো
                হয় একসাথে হবে, নয়তো একটাও না। এটাই Transaction এর Database এর
                মানে, যার কথা Section 002 এ বলেছিলাম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="OLTP: একটা Booking লেখা"
              query={`BEGIN;

UPDATE departures
SET seats_left = seats_left - 2
WHERE departure_id = 9;

INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (15, 9, 2, 'pending', 25000.00)
RETURNING booking_id, status, total_bdt;

COMMIT;

SELECT departure_id, seats_left
FROM departures
WHERE departure_id = 9;`}
              caption="ফলের লাইনগুলো পরপর পড়ুন। BEGIN মানে গুচ্ছ শুরু। UPDATE 1 মানে একটা Row বদলেছে। তারপর নতুন Booking এর নম্বর 25, status pending। COMMIT মানে গুচ্ছটা পাকা হলো। শেষ Query দেখায় খালি সিট ১৯ থেকে ১৭ হয়েছে। আবার Run চাপলে আরও দুইটা কমবে, Reset চাপলে সব আগের মতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Accountant এর আসনে বসুন। প্রশ্ন: প্রতি মাসে confirmed Booking
                থেকে কত টাকা এসেছে। এখানে মাস মানে Booking টা যে মাসে করা হয়েছিল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="OLAP: মাসে মাসে আয়"
              query={`SELECT date_trunc('month', booked_at)::date AS month,
       count(*) AS bookings,
       sum(total_bdt) AS revenue_bdt
FROM bookings
WHERE status = 'confirmed'
GROUP BY 1
ORDER BY 1;`}
              caption="উত্তর ছয়টা Row, প্রতিটা একটা মাস। কিন্তু এই ছয়টা Row বানাতে Database কে bookings এর প্রতিটা Row পড়তে হয়েছে, status দেখে বাছাই করতে হয়েছে, মাস ধরে দলে ভাগ করে যোগ করতে হয়েছে। ছয়টা মাসের আয় যোগ করলে দাঁড়ায় ৪,২৩,৬০০ টাকা, ঠিক আগের ছবির সংখ্যা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন bookings Table এ মাত্র ২৪টা Row আছে, তাই এই Query টা চোখের পলকে
                শেষ হয়। কিন্তু চিন্তা করুন Island Tours পাঁচ বছর চলার পর, পঞ্চাশ লাখ
                Booking নিয়ে। প্রথম বক্সের Query তখনও একটা Row ই খুঁজবে, তখনও
                মিলিসেকেন্ড। এই বক্সের Query কে তখন পঞ্চাশ লাখ Row পড়তে হবে। Data
                বাড়লে OLTP Query প্রায় একই থাকে, OLAP Query Data এর সাথে সাথে বড় হয়।
                এই একটা বাক্যই পুরো লেসনের ভিত্তি।
              </ContentParagraph>
              <ContentParagraph>
                শেষ বক্সটা আরও বড় প্রশ্ন: কোন Destination থেকে কত আয়। এর উত্তর
                bookings এ নেই। Booking জানে Departure, Departure জানে Tour, Tour
                জানে Destination। তাই চারটা Table জোড়া দিতে হয়। Table জোড়া দেওয়ার
                নাম JOIN, Module 06 এর পুরো বিষয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="OLAP: Destination অনুযায়ী আয়"
              query={`SELECT ds.name AS destination,
       count(*) AS bookings,
       sum(b.total_bdt) AS revenue_bdt
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t ON t.tour_id = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id
WHERE b.status = 'confirmed'
GROUP BY ds.name
ORDER BY revenue_bdt DESC;`}
              caption="Saint Martin's Island সবার উপরে, ১,২৫,০০০ টাকা। সাতটা Destination এর মধ্যে ছয়টা এসেছে। Kuakata নেই, কারণ সেখানে এখনো কোনো ট্যুরই নেই। ইচ্ছা করে রাখা এই ফাঁকটা Module 06 এ আবার ফিরে আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ মাসিক আয়ের Query",
          content: (
            <div className="space-y-3">
              <p>
                date_trunc Function আর <code>::date</code> লেখার ধরন PostgreSQL এর
                নিজস্ব। MySQL এ date_trunc নেই, তার বদলে DATE_FORMAT দিয়ে মাসের
                প্রথম দিন বানানো হয়। আর MySQL এ GROUP BY তে Column এর দেওয়া নাম
                (Alias) সরাসরি লেখা যায়।
              </p>
              <pre className="overflow-x-auto font-mono text-[0.75rem] leading-relaxed">
{`SELECT DATE_FORMAT(booked_at, '%Y-%m-01') AS month,
       COUNT(*) AS bookings,
       SUM(total_bdt) AS revenue_bdt
FROM bookings
WHERE status = 'confirmed'
GROUP BY month
ORDER BY month;`}
              </pre>
              <p>
                MySQL এর ভিডিও দেখার সময় এমন পার্থক্য পেলে ঘাবড়াবেন না। ধারণা একই,
                শুধু Function এর নাম আলাদা। পুরো তুলনা Lesson 05 আর Module 21 এ।
              </p>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "row-vs-column",
      subHeader: { index: "007", title: "Row vs Column" },
      title: <SectionTitle>একই Data, Disk এ দুইভাবে সাজানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ আমরা Table কে দেখছিলাম ছকের মতো, Row আর Column। কিন্তু Disk
                এ ছক বলে কিছু নেই। Disk হলো একটা লম্বা ফিতার মতো, যেখানে Byte এর পর
                Byte পরপর লেখা থাকে। তাই Database কে ঠিক করতে হয়, ছকের ঘরগুলো ফিতায়
                কোন ক্রমে বসাবে। দুইটা স্বাভাবিক উপায় আছে, আর এই একটা সিদ্ধান্তই ঠিক
                করে Database টা OLTP তে ভালো হবে না OLAP এ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>প্রথম উপায়, Row ধরে।</strong> দোকানের খাতার মতো, প্রতিটা
                লাইনে একটা বিক্রির সব তথ্য, তারিখ, জিনিস, দাম, পাশাপাশি। Database এর
                ভাষায় একটা Booking এর booking_id, customer_id, status, total_bdt সব
                ঘর পরপর জমা থাকে, তারপর পরের Booking এর সব ঘর। এর নাম Row Store, বা
                Row-oriented Storage। PostgreSQL, MySQL, SQL Server, Oracle মূলত
                এভাবেই Data রাখে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দ্বিতীয় উপায়, Column ধরে।</strong> ধরুন দোকানি প্রতিটা
                তথ্যের জন্য আলাদা খাতা রাখেন। একটা খাতায় শুধু তারিখ, একটায় শুধু
                জিনিসের নাম, একটায় শুধু দাম। মাস শেষে মোট বিক্রি জানতে মালিক শুধু
                দামের খাতাটা খোলেন, বাকিগুলো ছোঁনও না। Database এর ভাষায় সব Booking
                এর total_bdt পরপর এক জায়গায়, সব status আরেক জায়গায়। এর নাম Column
                Store, বা Column-oriented Storage। ClickHouse, BigQuery, Snowflake,
                Amazon Redshift আর DuckDB এভাবে Data রাখে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RowColumnStorageDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ Island Tours এর প্রথম আটটা Booking আছে, Sample Database
              থেকে হুবহু নেওয়া। Storage বদলান, প্রশ্ন বদলান, আর দেখুন প্রতিবার কোন
              ঘরগুলো পড়তে হচ্ছে, মোট কয়টা ঘর, আর কয়টা আলাদা জায়গা থেকে। চারটা
              মিশ্রণই একবার করে চালিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RowColumnScanLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফলটা সোজা কথায় বলা যায়। পুরো একটা Booking লাগলে, যেমন OLTP তে
                প্রায় সবসময় লাগে, Row Store এক জায়গা থেকে এক টানে দিয়ে দেয়।
                অনেকগুলো Row এর একটা দুটো Column লাগলে, যেমন OLAP এ প্রায় সবসময়
                লাগে, Column Store শুধু সেই ফালিগুলো পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                Column Store এর আরেকটা বড় সুবিধা আছে, চাপ দিয়ে ছোট করা, যাকে বলে
                Compression। status Column এর কথা ভাবুন। লাখ লাখ Row এ মান মাত্র
                তিন রকম: pending, confirmed, cancelled। একই রকম মান পাশাপাশি থাকলে
                সেগুলোকে খুব ছোট করে লেখা যায়, যেমন একটা confirmed আর পাশে লেখা
                পরের দুইশো Row এও এটাই। কম Byte মানে Disk থেকে কম পড়া, আর কম পড়া
                মানে দ্রুত Report।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "ভাষা একই, ভেতরের সাজানো আলাদা",
          content: (
            <p>
              Column Store গুলোও SQL বোঝে। BigQuery বা ClickHouse এ আপনি প্রায় একই
              SELECT, JOIN আর GROUP BY লিখবেন যা এই কোর্সে শিখছেন, শুধু কিছু
              Function এর নাম আর লেখার ধরন আলাদা, ঠিক যেমন PostgreSQL আর MySQL এ
              আলাদা। তাই SQL শেখা মানে একসাথে দুই জগতের দরজাই খোলা। আলাদা শুধু
              ভেতরে Data সাজানোর উপায়, আর তার ফলে কোন কাজে কে দ্রুত।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "why-reports-hurt",
      subHeader: { index: "008", title: "Why Reports Hurt" },
      title: <SectionTitle>ভারী Report কেন Booking কে ধীর করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আসল সমস্যাটা। ধরুন Island Tours বড় হয়েছে, পঞ্চাশ লাখ Booking।
                শুক্রবার সন্ধ্যা, শীতের ছুটির আগে সবচেয়ে ভিড়ের সময়। ঠিক তখন
                Marketing এর একজন পুরো তিন বছরের Data ধরে একটা বিশাল Report চালালেন,
                মূল Database এর উপরেই। কয়েক মিনিটের মধ্যে Customer রা অভিযোগ করতে
                শুরু করলেন, বুক করুন চাপলে ঘুরতেই থাকে।
              </ContentParagraph>
              <ContentParagraph>
                অনেকে প্রথমে ভাবেন, Report টা নিশ্চয়ই Table টা আটকে রেখেছে, তাই
                Booking ঢুকতে পারছে না। PostgreSQL এ ব্যাপারটা তা না। PostgreSQL এর
                নিজের Documentation এ লেখা আছে, পড়া কখনো লেখাকে আটকায় না, আর লেখা
                কখনো পড়াকে আটকায় না। এটা সম্ভব হয় একটা কৌশলে, যার নাম MVCC, যেটা
                Module 12 এ শিখবেন। তাহলে ধীর হলো কেন?
              </ContentParagraph>
              <ContentParagraph>
                কারণ মেশিন একটাই, আর তার সম্পদ সীমিত। দোকানের উদাহরণে ফিরুন। মালিক
                যদি ভিড়ের সময় কাউন্টারের একমাত্র টেবিলে বসে মাসের খাতা মেলাতে শুরু
                করেন, কেউ কাউকে আটকাচ্ছে না, তবু দোকানির হাত চলছে ধীরে, কারণ টেবিল,
                আলো আর মনোযোগ ভাগ হয়ে গেছে। Database এর ক্ষেত্রে ভাগ হয় তিনটা
                জিনিস:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>CPU:</strong> পঞ্চাশ লাখ Row যোগ আর ভাগ করতে Processor
                  ব্যস্ত থাকে। Booking এর ছোট কাজগুলোকেও Processor এর সময়ের জন্য
                  লাইনে দাঁড়াতে হয়।
                </ListItem>
                <ListItem>
                  <strong>Disk:</strong> Report Disk থেকে বিপুল পরিমাণ Data পড়ছে।
                  Booking এর ছোট পড়া আর লেখাগুলোও একই Disk এ যেতে চায়।
                </ListItem>
                <ListItem>
                  <strong>Memory:</strong> Database বারবার লাগে এমন Data Memory তে
                  রেখে দেয়, যাতে Disk এ যেতে না হয়। বিশাল Report সেই জায়গায় ভাগ বসায়,
                  ফলে ট্যুরের পাতার জন্য দরকারি Data কে আবার Disk থেকে আনতে হতে পারে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এর বাইরে দুইটা সূক্ষ্ম বিপদ আছে, যেগুলো এখন শুধু নাম শুনে রাখুন।
                প্রথমটা, অনেকক্ষণ খোলা থাকা একটা Query PostgreSQL এর পরিষ্কারের কাজ,
                VACUUM, কে পুরনো Row সরাতে বাধা দেয়, ফলে Table ফুলে ওঠে (Module 18)।
                দ্বিতীয়টা, ঠিক সেই সময়ে কেউ Table এর গঠন বদলাতে চাইলে, যেমন একটা
                নতুন Column যোগ করা, সেই বদলটা লম্বা Report শেষ হওয়ার অপেক্ষায় থাকে,
                আর তার পেছনে বাকি সব Query ও লাইনে দাঁড়িয়ে যায় (Module 12 আর Module
                17)। দুটোই সত্যিকারের Production এ ঘটে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "একটা ভুল Report পুরো দিন নষ্ট করতে পারে",
          content: (
            <p>
              Report এ একটা ছোট ভুল, যেমন দুইটা Table জোড়া দেওয়ার শর্ত ভুলে যাওয়া,
              Query কে লক্ষ গুণ বড় করে দিতে পারে। প্রতিটা Booking এর সাথে প্রতিটা
              Customer জুড়ে যায়, পঞ্চাশ লাখ গুণ লাখ। এই ভুলের নাম Cartesian
              Product, Module 06 এ নিজের চোখে দেখবেন। এমন একটা Query মূল Database এ
              চললে সেটা ঘণ্টার পর ঘণ্টা মেশিনকে ব্যস্ত রাখে। এই কারণেই অভিজ্ঞ দলগুলো
              Report চালানোর জায়গা মূল Database থেকে আলাদা করে রাখে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "where-reports-run",
      subHeader: { index: "009", title: "Where Reports Run" },
      title: <SectionTitle>Report এর জন্য আলাদা ঘর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কোম্পানি যত বড় হয়, Report কে তত দূরে সরানো হয়। ধাপগুলো প্রায় সব
                কোম্পানিতে একই ক্রমে আসে, আর প্রতিটা ধাপে কিছু পাওয়া যায়, কিছু দিতে
                হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ধাপ এক, একই Database, ফাঁকা সময়ে।</strong> Report চলে মূল
                  Database এই, কিন্তু রাতে, যখন Booking প্রায় নেই। বাড়তি কোনো
                  খরচ নেই, বাড়তি কোনো System নেই। ছোট কোম্পানির জন্য এটাই সঠিক
                  শুরু, Island Tours এখন এখানেই।
                </ListItem>
                <ListItem>
                  <strong>ধাপ দুই, Read Replica।</strong> মূল Database এর একটা
                  হুবহু Copy, আরেকটা Server এ, যেটা প্রতিটা পরিবর্তন প্রায় সাথে সাথে
                  নিজের মধ্যে চালিয়ে নেয়। এই Copy তে শুধু পড়া যায়, লেখা যায় না।
                  Report সেখানে চললে মূল Database টেরই পায় না। দাম হলো আরেকটা Server,
                  আর Copy টা কয়েক মুহূর্ত পিছিয়ে থাকতে পারে, যাকে বলে Replication Lag।
                  আরেকটা সূক্ষ্ম কথা, PostgreSQL এর Replica তে খুব লম্বা Query কখনো
                  কখনো মাঝপথে বাতিল হয়ে যায়, কারণ মূল Database থেকে আসা পরিবর্তন
                  চালাতে গিয়ে Query এর সাথে সংঘর্ষ হয়। এর সমাধান আর দামাদামি Module 19
                  এ।
                </ListItem>
                <ListItem>
                  <strong>ধাপ তিন, Data Warehouse।</strong> Report এর জন্য পুরো
                  আলাদা একটা Database, সাধারণত Column Store। প্রতি রাতে বা প্রতি
                  ঘণ্টায় একটা কাজ মূল Database থেকে Data তুলে এনে এখানে সাজিয়ে রাখে।
                  কোটি Row এর Report সেকেন্ডে চলে, আর Facebook এর বিজ্ঞাপন খরচ বা
                  Accounting Software এর Data ও এখানে এনে মেলানো যায়। দাম হলো আরেকটা
                  System চালানো, আর Data পুরো তাজা না থাকা।
                </ListItem>
                <ListItem>
                  <strong>আরেকটা পথ, একটাই System দুই কাজে।</strong> কিছু নতুন
                  Database দুই ধরনের কাজ একসাথে ভালোভাবে করার দাবি করে, এদের বলে
                  HTAP, Hybrid Transactional and Analytical Processing। নামটা চিনে
                  রাখুন, তবে এখনকার বেশিরভাগ কোম্পানি উপরের তিন ধাপের পথেই হাঁটে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ReportHomesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ একই ভারী মাসিক Report চারটা জায়গায় চালিয়ে দেখুন। প্রতিবার
              খেয়াল করুন তিনটা জিনিস কীভাবে বদলায়: মূল Database কতটা ব্যস্ত,
              Customer এর Booking কেমন চলে, আর Report এর সংখ্যা কতটা তাজা।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ReportPlacementLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কোন ধাপে আছেন, সেটা বোঝার সহজ নিয়ম",
          content: (
            <div className="space-y-3">
              <p>
                রাতের Report সকালের আগে শেষ হয়ে যাচ্ছে আর দিনের বেলা কেউ ভারী Query
                চালাচ্ছেন না, তাহলে ধাপ এক যথেষ্ট, বাড়তি কিছু বানাবেন না।
              </p>
              <p>
                দিনের বেলাতেও Report লাগছে, বা Report চলার সময় Booking ধীর হচ্ছে,
                তাহলে ধাপ দুই, Read Replica।
              </p>
              <p>
                Data এত বড় যে Replica তেও Report মিনিটের পর মিনিট চলে, বা অনেক উৎসের
                Data মেলাতে হচ্ছে, তাহলে ধাপ তিন, Data Warehouse।
              </p>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "etl",
      subHeader: { index: "010", title: "ETL and the Warehouse" },
      title: <SectionTitle>ETL: লেনদেনের Data কে Report এর Data বানানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Data Warehouse এ Data নিজে থেকে আসে না। কাউকে তুলে আনতে হয়। এই
                তুলে আনার কাজটার নাম ETL, তিনটা ধাপের তিনটা আদ্যক্ষর।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Extract, তুলে আনা।</strong> মূল Database থেকে গতকালের
                  নতুন আর বদলানো Row গুলো পড়া। Island Tours এ যেমন গতকালের সব
                  Booking, Payment আর Review।
                </ListItem>
                <ListItem>
                  <strong>Transform, বদলে সাজানো।</strong> Report এর সুবিধামতো রূপ
                  দেওয়া। যেমন প্রতিটা Booking এর পাশে ট্যুরের নাম, Destination এর নাম
                  আর Customer এর শহর লিখে দেওয়া, যাতে পরে বারবার Table জোড়া দিতে না
                  হয়। বাতিল Booking আলাদা করে চিহ্ন দেওয়া। টাকার অঙ্ক এক এককে আনা।
                </ListItem>
                <ListItem>
                  <strong>Load, ঢেলে দেওয়া।</strong> সাজানো Data Warehouse এর
                  Table এ ঢোকানো।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আজকাল অনেক দল ক্রমটা একটু বদলে নেয়: আগে কাঁচা Data সরাসরি Warehouse
                এ ঢেলে দেয়, তারপর Warehouse এর ভেতরেই SQL দিয়ে সাজায়। এর নাম ELT,
                Extract, Load, তারপর Transform। BigQuery বা Snowflake এর মতো শক্তিশালী
                Warehouse এ এটা সুবিধাজনক, কারণ সাজানোর কাজটাও SQL এ হয়, আর সেটা
                আপনি এই কোর্সেই শিখছেন। দুটোর তুলনা Module 20 এ।
              </ContentParagraph>
              <ContentParagraph>
                আরও দুইটা শব্দ কাছাকাছি ঘোরে, চিনে রাখুন। Data Warehouse হলো সাজানো,
                গোছানো, Table আকারের Data, যেখানে প্রশ্ন করার জন্য সব প্রস্তুত। Data
                Lake হলো তার চেয়ে কাঁচা একটা গুদাম, যেখানে যেকোনো রূপের ফাইল জমা রাখা
                হয়, পরে কাজে লাগানোর জন্য। Island Tours এর এখন এর কোনোটাই লাগে না,
                কিন্তু চাকরির জগতে এই শব্দগুলো প্রতিদিন শুনবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Warehouse এর সংখ্যা কখনো পুরো তাজা না",
          content: (
            <p>
              রাত দুইটায় ETL চলে, এর মানে সকাল দশটায় Dashboard এ দেখা আয় আসলে গতকাল
              রাত পর্যন্ত। আজকের Booking গুলো সেখানে নেই। Report এর জন্য এটা
              ঠিকঠাক, কিন্তু কেউ যদি Warehouse থেকে ট্যুরের পাতায় খালি সিট দেখানোর
              চেষ্টা করেন, ভুল সংখ্যা দেখাবে। তাই নিয়ম সোজা: যা এই মুহূর্তের হতে
              হবে, তা আসবে মূল Database থেকে। যা ইতিহাস, তা আসবে Warehouse থেকে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "shaped-differently",
      subHeader: { index: "011", title: "Shaped Differently" },
      title: <SectionTitle>দুই কাজের জন্য দুই রকম নকশা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর মূল Database এ আটটা Table। একটা Booking নিজের ভেতরে
                জানে শুধু কে বুক করেছেন (customer_id) আর কোন তারিখে (departure_id)।
                ট্যুরের নাম জানতে Departure এ যেতে হয়, সেখান থেকে Tour এ, সেখান থেকে
                Destination এ। প্রতিটা তথ্য ঠিক এক জায়গায় আছে। লেনদেনের জন্য এটা
                আদর্শ, কারণ একটা ট্যুরের নাম বদলালে এক জায়গায় বদলালেই হয়, আর কোথাও
                পুরনো নাম রয়ে যায় না।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু Report এর জন্য এই নকশা একটু ক্লান্তিকর। প্রতিটা প্রশ্নে চার
                পাঁচটা Table জোড়া দিতে হয়, আর কোটি Row তে সেই জোড়া দেওয়া ভারী। তাই
                Warehouse এ সাধারণত একটা চওড়া Table বানানো হয়, যেখানে প্রতিটা Booking
                এর পাশে তার ট্যুরের নাম, Destination আর Customer এর শহর আগে থেকেই
                লেখা থাকে। এমন Table কে বলে Fact Table, কারণ প্রতিটা Row একটা ঘটে
                যাওয়া ঘটনা, একটা Fact। আর তার চারপাশে কিছু ছোট বর্ণনার Table থাকে,
                যেমন তারিখের Table, ট্যুরের Table, এদের বলে Dimension Table। ছবিতে
                মাঝখানে Fact আর চারপাশে Dimension দেখতে তারার মতো লাগে, তাই এই নকশার
                নাম Star Schema।
              </ContentParagraph>
              <ContentParagraph>
                নিচে একটাই Booking, booking_id 13, দুই চেহারায়। বাঁয়ের Column এ মূল
                Database এ যেভাবে আছে, ডানে Warehouse এ যেভাবে থাকতে পারে। ডানের
                মানগুলো বানানো নয়, নিচের Lab এর পাঁচ নম্বর Query চালালে ঠিক এগুলোই
                আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["তথ্য", "মূল Database এ (OLTP)", "Warehouse এর Fact Table এ (OLAP)"],
          rows: [
            ["Booking", "booking_id 13", "booking_id 13"],
            ["কে বুক করেছেন", "শুধু customer_id 2, নাম আর শহর customers Table এ", "customer_city: Dhaka, সরাসরি এই Row এ"],
            ["কোন ট্যুর", "শুধু departure_id 8, বাকিটা তিন Table দূরে", "tour: Saint Martin Island Escape"],
            ["কোথায়", "destinations Table এ, তিন ধাপ জোড়া দিয়ে", "destination: Saint Martin's Island"],
            ["কবে রওনা", "departures Table এ", "starts_on: 2026-11-20"],
            ["কবে বুক", "booked_at এর পুরো সময়", "booked_month: 2026-09-01, মাস ধরে আগেই কাটা"],
            ["কত টাকা", "total_bdt 25000.00", "total_bdt 25000.00"],
            ["ট্যুরের নাম বদলালে", "এক জায়গায় বদলালেই হয়", "পুরনো Row এ পুরনো নাম থেকে যায়, ETL ঠিক করে"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "কপি করা খারাপ, আবার কখনো দরকারি",
          content: (
            <p>
              Lesson 01 এ দেখেছেন, Spreadsheet এ একই দাম দশ জায়গায় লেখা থাকলে একটা
              বদলাতে ভুললেই সর্বনাশ। Warehouse এ সেই কপি করাই জেনেশুনে করা হয়। তফাত
              হলো, Warehouse এ কোনো Customer কিছু লেখেন না, শুধু ETL লেখে, আর প্রতি
              রাতে নিয়ম মেনে পুরোটা আবার মিলিয়ে নেয়। নিয়ন্ত্রিত কপি সমস্যা না,
              অনিয়ন্ত্রিত কপি সমস্যা। এই কপি করার নাম Denormalization, Module 11 এ
              এর পুরো হিসাব পাবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "mistakes",
      subHeader: { index: "012", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো বারবার হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>ভিড়ের সময় মূল Database এ ভারী Report।</strong> সবচেয়ে
                চেনা ভুল। সমাধান: Report রাতে চালানো, অথবা Replica তে। আর কে কোথায়
                ভারী Query চালাতে পারবেন, সেটা Permission দিয়ে আটকে রাখা, Module 16
                এ শিখবেন।
              </ListItem>
              <ListItem>
                <strong>বাতিল Booking কেও আয় ধরে ফেলা।</strong> Island Tours এর
                সব Booking এর total_bdt যোগ করলে আসে ৫,৯২,৩০০ টাকা। কিন্তু এর মধ্যে
                pending আর cancelled ও আছে। শুধু confirmed ধরলে আসল অঙ্ক ৪,২৩,৬০০
                টাকা। তফাত প্রায় এক লাখ সত্তর হাজার, আর এমন ভুল কেউ টের না পেয়েই
                মিটিংয়ে চলে যায়। OLAP এর ভুল শব্দ করে না, চুপচাপ ভুল সংখ্যা দেয়।
              </ListItem>
              <ListItem>
                <strong>Replica থেকে পড়ে ভাবা Data এই মুহূর্তের।</strong> একজন
                Customer এইমাত্র বুক করলেন, আর পরের পাতায় তাঁর Booking এর তালিকা
                এলো Replica থেকে। Replica তখনও এক সেকেন্ড পিছিয়ে, তাই নতুন Booking টা
                নেই। Customer ভাবলেন বুকিং হয়নি, আবার বুক করলেন। যা সাথে সাথে দেখাতে
                হবে, তা মূল Database থেকে পড়তে হয়।
              </ListItem>
              <ListItem>
                <strong>Warehouse থেকে লেনদেনের সিদ্ধান্ত।</strong> খালি সিট বা
                Payment এর অবস্থা Warehouse থেকে দেখানো। Warehouse এর Data গতকালের,
                তাই সিদ্ধান্তও ভুল হবে।
              </ListItem>
              <ListItem>
                <strong>প্রতিটা Report এর জন্য মূল Database এ নতুন Index।</strong>
                Index পড়াকে দ্রুত করে, কিন্তু প্রতিটা Index প্রতিটা লেখাকে একটু ধীর
                করে, কারণ প্রতিটা নতুন Booking এর সাথে প্রতিটা Index ও আপডেট করতে
                হয়। Report এর জন্য দশটা Index বানালে Booking ধীর হয়ে যায়। এর হিসাব
                Module 13 এ।
              </ListItem>
              <ListItem>
                <strong>OLAP মানে অন্য কোনো ভাষা ভাবা।</strong> অনেকে ভাবেন Data
                Warehouse শিখতে আলাদা কিছু শিখতে হবে। আসলে সেখানেও SQL, একই SELECT,
                একই JOIN, একই GROUP BY। এই কোর্সের প্রতিটা Module সেখানেও কাজে লাগবে।
              </ListItem>
              <ListItem>
                <strong>OLTP আর OLAP কে SQL আর NoSQL এর সাথে গুলিয়ে ফেলা।</strong>
                OLTP আর OLAP হলো কাজের ধরন। SQL আর NoSQL হলো Database এর ধরন। একটা
                SQL Database দুই কাজই করতে পারে, একটা NoSQL Database ও লেনদেনের কাজে
                ব্যবহার হতে পারে। Lesson 03 এর Database এর ধরনগুলো আর এই লেসনের কাজের
                ধরনগুলো দুইটা আলাদা প্রশ্নের উত্তর।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "project",
      subHeader: { index: "013", title: "Project Example" },
      title: <SectionTitle>Island Tours এ কোন Table গরম, কোন প্রশ্ন ভারী</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Database এর সব Table সমান ব্যস্ত না। কিছু Table প্রতিটা Booking
                এ ছোঁয়া হয়, কিছু প্রায় স্থির। এই হিসাবটা জানা থাকলে বোঝা যায় কোথায়
                সাবধান হতে হবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সবচেয়ে গরম, departures:</strong> প্রতিটা ট্যুরের পাতা খোলায়
                  seats_left পড়া হয়, প্রতিটা Booking এ বদলায়। শেষ সিটের জন্য
                  একসাথে দুইজন লড়লে যুদ্ধটা হয় এই Table এর একটা Row এ। Module 12 এর
                  Double-booking লেসন পুরোটা এই একটা Row নিয়ে।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা লেনদেনে লেখা, bookings আর payments:</strong> নতুন
                  Row ঢোকে, status বদলায়। টাকার হিসাব, তাই এখানে কোনো Row কখনো মুছে
                  ফেলা হয় না, শুধু status বদলায়, যেমন refunded বা cancelled।
                </ListItem>
                <ListItem>
                  <strong>প্রায় স্থির, destinations, guides আর tours:</strong>
                  মাঝেমধ্যে নতুন ট্যুর যোগ হয় বা দাম বদলায়। বেশিরভাগ সময় শুধু পড়া হয়।
                </ListItem>
                <ListItem>
                  <strong>OLAP এর খাদ্য, bookings, payments আর reviews এর
                  ইতিহাস:</strong> মাসিক আয়, বাতিলের হার, গড় Rating, সব প্রশ্ন এই
                  তিনটা Table এর পুরো ইতিহাস পড়ে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার Island Tours বড় হতে থাকলে Report এর ব্যবস্থা কীভাবে বদলাবে, তার
                একটা বাস্তব পরিকল্পনা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এখন, কয়েক হাজার Booking:</strong> সব Report মূল
                  PostgreSQL এই। Accountant এর মাসিক Report আর CEO এর Dashboard চলে
                  রাত তিনটায়, একটা নির্ধারিত কাজ হিসেবে, ফল সকালে Email এ। দিনের বেলা
                  ভারী Query চালানোর অনুমতি কারো নেই।
                </ListItem>
                <ListItem>
                  <strong>পরের ধাপ, কয়েক লাখ Booking আর দিনের বেলা Report এর
                  চাহিদা:</strong> একটা Read Replica। Metabase এর মতো BI Tool যুক্ত হয়
                  শুধু Replica তে, মূল Database এর ঠিকানা সে জানেই না। Replica এর
                  ঠিকানা আর Password আসে Environment Variable থেকে, কোডে লেখা থাকে না।
                </ListItem>
                <ListItem>
                  <strong>তার পরের ধাপ, কোটি Row আর Marketing এর Data মেলানোর
                  দরকার:</strong> রাতের ETL দিয়ে একটা Data Warehouse, Booking এর
                  Fact Table আর তার চারপাশে Dimension Table। মূল Database তখন শুধু
                  লেনদেনের জন্য।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                খেয়াল করুন, তিন ধাপের কোনোটাতেই Booking এর কোড বদলায়নি। App সবসময় মূল
                Database এ লেখে আর মূল Database থেকে এই মুহূর্তের Data পড়ে। বদলেছে
                শুধু Report কোথা থেকে পড়ে। ভালো নকশার লক্ষণ এটাই, একটা অংশ বড় হলে বাকি
                অংশ নাড়াতে হয় না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "request-flow",
      subHeader: { index: "014", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Booking এর যাত্রা, ট্যাপ থেকে Dashboard পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো লেসনটা একটা গল্পে। Nusrat এর Booking টা কীভাবে প্রথমে একটা
              লেনদেন হয়ে মূল Database এ ঢোকে, আর কীভাবে পরে একটা সংখ্যা হয়ে মালিকের
              Dashboard এ পৌঁছায়। ধরে নিচ্ছি Island Tours তখন তৃতীয় ধাপে, তার একটা
              Data Warehouse আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "বুক করুন চাপা",
              description:
                "Nusrat ফোনে বুক করুন চাপলেন। Request টা Island Tours এর API তে পৌঁছাল। এই মুহূর্ত থেকে ঘড়ি চলছে, তিনি স্ক্রিনের দিকে তাকিয়ে আছেন।",
            },
            {
              title: "খালি সিট যাচাই, একটা Row",
              description:
                "API মূল PostgreSQL কে জিজ্ঞেস করল departure 8 এ কয়টা সিট খালি। Primary Key এর Index ধরে Database সরাসরি একটা Row এ গেল। কয়েক মিলিসেকেন্ড। এটা OLTP পড়া।",
            },
            {
              title: "একটা Transaction এ দুইটা লেখা",
              description:
                "BEGIN, seats_left থেকে দুই বাদ, bookings এ নতুন Row status pending নিয়ে, COMMIT। দুইটা লেখা একসাথে পাকা হলো। এটা OLTP লেখা, আর এর নির্ভুলতার উপর টাকা আর সিটের হিসাব দাঁড়িয়ে।",
            },
            {
              title: "Payment এর খবর",
              description:
                "bKash থেকে খবর এলো টাকা পাওয়া গেছে। আরেকটা ছোট Transaction: payments এ একটা Row, Booking এর status confirmed। Nusrat এর স্ক্রিনে নিশ্চিত হওয়ার বার্তা।",
            },
            {
              title: "দিনভর এমন হাজারো লেনদেন",
              description:
                "সারাদিন একই ধরনের ছোট ছোট কাজ চলে, প্রতিটা কয়েকটা Row নিয়ে। মূল Database এর পুরো মনোযোগ এদের দিকে। কোনো ভারী Report তাকে বিরক্ত করছে না।",
            },
            {
              title: "রাত দুইটা, Extract",
              description:
                "ETL এর কাজ চালু হলো। গতকাল যেসব Booking, Payment আর Review নতুন এসেছে বা বদলেছে, সেগুলো তুলে আনল। মূল Database এর জন্য এটা একবারের একটা মাঝারি পড়া, ফাঁকা সময়ে।",
            },
            {
              title: "Transform, চওড়া Row বানানো",
              description:
                "প্রতিটা Booking এর পাশে ট্যুরের নাম, Destination, Customer এর শহর আর বুকিংয়ের মাস লেখা হলো। Nusrat এর Booking হয়ে গেল একটা Fact Row: Dhaka, Saint Martin Island Escape, Saint Martin's Island, ২৫,০০০ টাকা।",
            },
            {
              title: "Load, Warehouse এ জমা",
              description:
                "সাজানো Row গুলো Warehouse এর Fact Table এ ঢুকল, Column ধরে সাজানো আর চাপ দিয়ে ছোট করা অবস্থায়।",
            },
            {
              title: "সকালে Dashboard, একটা বড় প্রশ্ন",
              description:
                "মালিক সকালে Dashboard খুললেন। BI Tool Warehouse কে SQL এ প্রশ্ন করল: এই মাসে Destination অনুযায়ী আয়। Warehouse শুধু destination আর total_bdt এর ফালি পড়ল, কোটি Row হলেও সেকেন্ডে উত্তর। এটা OLAP।",
            },
            {
              title: "দুই জগৎ, কেউ কাউকে বিরক্ত করেনি",
              description:
                "Nusrat এর Booking মিলিসেকেন্ডে হয়েছিল, মালিকের Report সেকেন্ডে। একজনের কাজ আরেকজনের কাজকে ধীর করেনি, কারণ দুটো চলেছে আলাদা জায়গায়, আলাদা সময়ে। মালিক শুধু জানেন, Dashboard এর সংখ্যা গতকাল রাত পর্যন্ত।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "module-recap",
      subHeader: { index: "015", title: "Module 01 Recap" },
      title: <SectionTitle>পুরো Module 01, একটা গল্পে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি Module 01 এর শেষে এসে দাঁড়িয়েছেন। সাতটা লেসন আলাদা আলাদা মনে
                হতে পারে, কিন্তু আসলে এগুলো একটাই গল্প, যেখানে প্রতিটা লেসন আগের
                লেসনের রেখে যাওয়া প্রশ্নের উত্তর দেয়। গল্পটা একবার পুরোটা দেখে নিন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ModuleStoryDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>
                    <Link href="/sql/topic/why-not-spreadsheets" className={LINK}>
                      Lesson 01, Why Spreadsheets and Files Break:
                    </Link>
                  </strong>{" "}
                  Island Tours শুরু করেছিল একটা Spreadsheet দিয়ে। একই Customer
                  তিনভাবে লেখা, দুইজন একসাথে লিখে একজনের কাজ মুছে দেওয়া, দাম দশ জায়গায়
                  কপি করা, কোনো নিয়ম নেই, কোনো পাহারা নেই। প্রশ্ন রেখে গেল: এমন কিছু
                  কি আছে যা এই সবকিছু সামলায়?
                </ListItem>
                <ListItem>
                  <strong>
                    <Link href="/sql/topic/what-is-a-database" className={LINK}>
                      Lesson 02, What a Database and a DBMS Are:
                    </Link>
                  </strong>{" "}
                  উত্তর হলো Database, সাজানো Data, আর DBMS, সেই Program যে Data কে
                  Disk এ নিরাপদে রাখে, দ্রুত খুঁজে দেয়, নিয়ম মানায়, অনেক মানুষকে একসাথে
                  সামলায় আর পাহারা দেয়। প্রশ্ন রেখে গেল: Database কি একটাই রকম?
                </ListItem>
                <ListItem>
                  <strong>
                    <Link href="/sql/topic/kinds-of-databases" className={LINK}>
                      Lesson 03, Kinds of Databases:
                    </Link>
                  </strong>{" "}
                  না, অনেক রকম। Relational, Document, Key-Value, Graph, Columnar,
                  Time-series, Vector, প্রতিটা নির্দিষ্ট আকারের Data আর নির্দিষ্ট
                  প্রশ্নের জন্য। আমরা শুরু করছি Relational দিয়ে, কারণ বেশিরভাগ ব্যবসার
                  Data এর আকার সেটাই, আর বাকিগুলো বুঝতেও এর ভিত্তি লাগে।
                </ListItem>
                <ListItem>
                  <strong>
                    <Link href="/sql/topic/relational-model" className={LINK}>
                      Lesson 04, The Relational Model:
                    </Link>
                  </strong>{" "}
                  Relational মানে Data থাকে Table এ, Row আর Column এ, আর Primary Key
                  দিয়ে প্রতিটা Row এর পরিচয়, Foreign Key দিয়ে এক Table এর সাথে আরেক
                  Table এর সম্পর্ক। একটা Booking থেকে চাবি ধরে ধরে Customer, Tour,
                  Destination পর্যন্ত যাওয়া যায়। প্রশ্ন রেখে গেল: এই Table গুলোকে
                  প্রশ্ন করব কোন ভাষায়?
                </ListItem>
                <ListItem>
                  <strong>
                    <Link href="/sql/topic/what-is-sql" className={LINK}>
                      Lesson 05, What SQL Is:
                    </Link>
                  </strong>{" "}
                  SQL, Relational Database এর সাথে কথা বলার ভাষা। আপনি বলেন কী
                  চান, কীভাবে আনতে হবে সেটা Database ঠিক করে। SQL ভাষা, আর PostgreSQL
                  আর MySQL সেই ভাষায় কথা বলা দুইটা Program, প্রত্যেকের নিজস্ব টান
                  আছে। প্রশ্ন রেখে গেল: একটা App সেই ভাষায় Database কে কীভাবে পায়?
                </ListItem>
                <ListItem>
                  <strong>
                    <Link href="/sql/topic/app-database-conversation" className={LINK}>
                      Lesson 06, How an App Talks to a Database:
                    </Link>
                  </strong>{" "}
                  Browser কখনো সরাসরি Database এ যায় না। Browser কথা বলে API এর সাথে,
                  API একটা Connection খুলে Port 5432 এ PostgreSQL এর সাথে, Query এর
                  লেখা পাঠায়, Database সেটা বুঝে, পরিকল্পনা করে, চালায়, আর Row ফেরত
                  দেয়। প্রশ্ন রেখে গেল: সব Query কি একই রকম?
                </ListItem>
                <ListItem>
                  <strong>Lesson 07, এই লেসন:</strong> না। কিছু Query লেনদেন, ছোট,
                  এখনই, নির্ভুল, OLTP। কিছু Query বিশ্লেষণ, বিশাল, ইতিহাস ঘেঁটে,
                  OLAP। দুটোর চরিত্র এত আলাদা যে বড় হলে তাদের আলাদা জায়গায় রাখতে হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই সাতটা লেসনের পর আপনি এমন কিছু জানেন যা অনেক বছর ধরে কোড লেখা
                Developer ও গুছিয়ে বলতে পারেন না: Database কেন আছে, কোন সমস্যার
                সমাধান করে, তার ভেতরে Data কীভাবে সাজানো, তাকে কোন ভাষায় প্রশ্ন করতে
                হয়, App কীভাবে তার কাছে পৌঁছায়, আর কোন ধরনের প্রশ্ন তার জন্য হালকা,
                কোনটা ভারী।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "শিখেছেন কিনা যাচাইয়ের সবচেয়ে ভালো উপায়: কাউকে শেখান",
          content: (
            <div className="space-y-3">
              <p>
                একজন বন্ধুকে, যিনি প্রোগ্রামিং করেন না, পাঁচ মিনিটে এই সাতটা প্রশ্নের
                উত্তর দিন। প্রতিটা প্রশ্নের উত্তর একটা লেসনে আছে। কোনোটায় আটকে গেলে
                সেই লেসনে ফিরে যান।
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Excel থাকতে Database লাগে কেন?</li>
                <li>Database আর PostgreSQL কি একই জিনিস?</li>
                <li>MongoDB আর PostgreSQL এর মধ্যে মূল তফাত কী?</li>
                <li>Table, Row, Column আর Key দিয়ে একটা ট্যুর বুকিং কীভাবে রাখা হয়?</li>
                <li>SQL আর MySQL এর তফাত কী?</li>
                <li>Website এর বোতাম চাপলে Database পর্যন্ত কথাটা কীভাবে পৌঁছায়?</li>
                <li>মাসিক Report কেন Customer এর Booking কে ধীর করতে পারে?</li>
              </ol>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "next-module",
      subHeader: { index: "016", title: "Next: Module 02" },
      title: <SectionTitle>এবার নিজের মেশিনে PostgreSQL</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলের সব Query আপনি চালিয়েছেন Browser এর ভেতরের একটা
                PostgreSQL এ। শেখার জন্য চমৎকার, কিছু ইনস্টল করতে হয়নি। কিন্তু
                বাস্তবে Database চলে একটা Server হিসেবে, আপনার কম্পিউটারে বা Cloud এ,
                আর Developer তার সাথে কথা বলেন Terminal থেকে, একটা Tool দিয়ে যার নাম
                psql, অথবা একটা GUI Tool দিয়ে। চাকরিতে প্রথম দিনই এই কাজটা লাগবে।
              </ContentParagraph>
              <ContentParagraph>
                Module 02 ঠিক এই জায়গাটা নিয়ে। সেখানে আপনি যা যা করবেন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  macOS, Windows, Linux বা Docker, নিজের পছন্দমতো উপায়ে PostgreSQL
                  ইনস্টল করে দেখবেন সেটা সত্যিই চলছে।
                </ListItem>
                <ListItem>
                  যে MySQL ভিডিও বা কোর্স ফলো করছেন, সেটার সাথে তাল রাখতে চাইলে
                  MySQL ও পাশে বসাবেন।
                </ListItem>
                <ListItem>
                  psql দিয়ে Connect করবেন, তার ছোট ছোট নিজস্ব Command শিখবেন, আর
                  pgAdmin, DBeaver বা TablePlus এর মতো GUI Tool চিনবেন।
                </ListItem>
                <ListItem>
                  একটা Server এর ভেতরে Database, Database এর ভেতরে Schema, Schema এর
                  ভেতরে Table, এই সাজানোটা বুঝবেন। Lesson 02 এ শুধু নামটা শুনেছিলেন।
                </ListItem>
                <ListItem>
                  এই মডিউলে যে Island Tours Database দেখলেন, সেটা নামিয়ে নিজের
                  PostgreSQL এ Load করবেন, যাতে Module 03 থেকে সব Query নিজের মেশিনেও
                  চালাতে পারেন।
                </ListItem>
                <ListItem>
                  Error Message এর প্রতিটা অংশ পড়তে শিখবেন, আর আটকে গেলে অফিসিয়াল
                  Docs থেকে নিজে উত্তর বের করবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                প্রস্তুতি হিসেবে শুধু দুইটা জিনিস দেখে রাখুন: কম্পিউটারে নতুন
                Software ইনস্টলের অনুমতি আছে কিনা, আর এক দুই GB খালি জায়গা আছে কিনা।
                শুরু করুন{" "}
                <Link href="/sql/topic/sql-setup-overview" className={LINK}>
                  Module 02 এর Overview
                </Link>{" "}
                দিয়ে, সেখানে পুরো মডিউলের মানচিত্র আছে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়তে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিজে চালান</strong>, এই লেসনের সবচেয়ে ভালো Resource হলো
                উপরের চারটা Query বক্স আর নিচের Lab। মাসিক আয়ের Query টা একবার
                নিজে বদলে দেখুন, confirmed এর জায়গায় pending লিখে।
              </ListItem>
              <ListItem>
                <strong>The Island Tours Database</strong>, এই ট্র্যাকের Sample
                Database এর সব Table, Column আর ইচ্ছা করে রাখা অদ্ভুত Data এক পাতায়।{" "}
                <Link href="/sql/database" className={LINK}>
                  /sql/database
                </Link>
              </ListItem>
              <ListItem>
                <strong>Wikipedia, Online transaction processing</strong>, OLTP এর
                সংজ্ঞা আর ইতিহাস।{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Online_transaction_processing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  en.wikipedia.org/wiki/Online_transaction_processing
                </a>
              </ListItem>
              <ListItem>
                <strong>Wikipedia, Online analytical processing</strong>, OLAP এর
                ধারণা, আর Codd কীভাবে ১৯৯৩ সালে নামটা দিয়েছিলেন।{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Online_analytical_processing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  en.wikipedia.org/wiki/Online_analytical_processing
                </a>
              </ListItem>
              <ListItem>
                <strong>Wikipedia, Column-oriented DBMS</strong>, Row Store আর Column
                Store এর তুলনা, ছবি সহ।{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Column-oriented_DBMS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  en.wikipedia.org/wiki/Column-oriented_DBMS
                </a>
              </ListItem>
              <ListItem>
                <strong>Wikipedia, Data warehouse আর Star schema</strong>, Warehouse,
                Fact Table আর Dimension Table এর ধারণা।{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Data_warehouse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  en.wikipedia.org/wiki/Data_warehouse
                </a>
                {", "}
                <a
                  href="https://en.wikipedia.org/wiki/Star_schema"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  en.wikipedia.org/wiki/Star_schema
                </a>
              </ListItem>
              <ListItem>
                <strong>Wikipedia, Extract, transform, load</strong>, ETL এর তিন ধাপ
                আর তার আধুনিক রূপ।{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Extract,_transform,_load"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  en.wikipedia.org/wiki/Extract,_transform,_load
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL Documentation, Hot Standby</strong>, Replica তে
                Query চালানো, আর লম্বা Query কেন বাতিল হতে পারে। এখন পুরোটা বোঝার
                দরকার নেই, Module 19 এর আগে একবার চোখ বুলিয়ে নিন।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/hot-standby.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/hot-standby.html
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL Documentation, MVCC এর ভূমিকা</strong>, যেখানে
                লেখা আছে পড়া কেন লেখাকে আটকায় না।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/mvcc-intro.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/mvcc-intro.html
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
                  একই Database কে দুই রকম প্রশ্ন করা হয়। লেনদেন, OLTP, আর বিশ্লেষণ,
                  OLAP।
                </ListItem>
                <ListItem>
                  চেনার দুই প্রশ্ন: কেউ কি এখন অপেক্ষা করছেন, আর কয়টা Row ছুঁতে হবে।
                </ListItem>
                <ListItem>
                  OLTP: অনেক মানুষ, প্রতিটা কাজ কয়েকটা Row, পড়া আর লেখা, এই মুহূর্তের
                  Data, মিলিসেকেন্ড, আর নির্ভুলতায় কোনো ছাড় নেই।
                </ListItem>
                <ListItem>
                  OLAP: অল্প মানুষ, প্রতিটা প্রশ্ন প্রায় সব Row, প্রায় শুধু পড়া,
                  ইতিহাস, সেকেন্ড বা মিনিট।
                </ListItem>
                <ListItem>
                  Data বাড়লে OLTP Query প্রায় একই থাকে, OLAP Query Data এর সাথে বড়
                  হয়।
                </ListItem>
                <ListItem>
                  Row Store একটা Row এর সব ঘর পাশাপাশি রাখে, লেনদেনে ভালো। Column Store
                  একটা Column এর সব মান পাশাপাশি রাখে, Report এ ভালো, আর চাপ দিয়ে ছোটও
                  করা যায়।
                </ListItem>
                <ListItem>
                  PostgreSQL এ পড়া লেখাকে আটকায় না, তবু ভারী Report একই মেশিনের CPU,
                  Disk আর Memory ভাগ করে নিয়ে Booking ধীর করে।
                </ListItem>
                <ListItem>
                  Report সরানোর তিন ধাপ: একই Database রাতে, Read Replica, Data
                  Warehouse। প্রতিটা ধাপে মূল Database এর চাপ কমে, Report এর তাজা থাকা
                  কমে।
                </ListItem>
                <ListItem>
                  ETL মানে Extract, Transform, Load। Warehouse এ Data সাজানো হয় পড়ার
                  সুবিধা দেখে, জেনেশুনে কপি করে, Star Schema তে।
                </ListItem>
                <ListItem>
                  যা এই মুহূর্তের হতে হবে তা মূল Database থেকে। যা ইতিহাস, তা Report
                  এর জায়গা থেকে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এখানেই Module 01 শেষ। আপনি এখন জানেন Database কেন আছে আর কীভাবে
                ভাবে। পরের ধাপ তাকে নিজের হাতে চালানো। দেখা হবে Module 02 এ, যেখানে
                প্রথম কাজই হবে নিজের কম্পিউটারে PostgreSQL চালু করা।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "কোথায় দেখবেন"],
    rows: [
      ["OLTP", "অনেক মানুষের ছোট ছোট লেনদেন, কয়েকটা Row, এখনই", "Booking, Payment, খালি সিট দেখানো"],
      ["OLAP", "অল্প মানুষের বড় প্রশ্ন, প্রায় সব Row, ইতিহাস ঘেঁটে", "মাসিক আয়, Dashboard, পূর্বাভাস"],
      ["Online", "মানুষ অপেক্ষা করছেন, Batch এর উল্টো", "OLTP আর OLAP দুই নামেই"],
      ["Transaction", "ব্যবসার একটা লেনদেন, Database এ সব হবে নয়তো কিছুই না", "BEGIN আর COMMIT এর মাঝের কাজ"],
      ["Aggregation", "অনেক Row থেকে যোগ, গড়, গোনা", "SUM, COUNT, AVG, Module 05"],
      ["Row Store", "একটা Row এর সব ঘর পাশাপাশি", "PostgreSQL, MySQL"],
      ["Column Store", "একটা Column এর সব মান পাশাপাশি, Compression সহ", "ClickHouse, BigQuery, DuckDB"],
      ["Read Replica", "মূল Database এর শুধু পড়ার Copy, একটু পিছিয়ে", "Module 19"],
      ["Data Warehouse", "Report এর জন্য আলাদা, সাজানো Database", "BigQuery, Snowflake, Redshift"],
      ["ETL আর ELT", "মূল Database থেকে Warehouse এ Data তোলা, সাজানো, ঢালা", "রাতের নির্ধারিত কাজ, Module 20"],
      ["Star Schema", "মাঝে Fact Table, চারপাশে Dimension Table", "Warehouse এর নকশা"],
      ["BI Tool", "SQL দিয়ে প্রশ্ন করে Chart আর Dashboard বানানোর Software", "Metabase, Power BI, Looker Studio"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Island Tours এর নিচের কোন কাজটা OLTP?",
        options: [
          {
            key: "A",
            text: "গত বছরের প্রতি মাসের আয়ের Report",
            isCorrect: false,
            explanation: "সারা বছরের সব Booking পড়ে যোগ করতে হয়, কেউ সাথে সাথে অপেক্ষা করছেন না। এটা OLAP।",
          },
          {
            key: "B",
            text: "একজন Customer একটা তারিখে দুইটা সিট বুক করছেন",
            isCorrect: true,
            explanation: "ঠিক। একটা Row বদলায় আর একটা Row ঢোকে, আর Customer স্ক্রিনের সামনে অপেক্ষা করছেন। আদর্শ OLTP।",
          },
          {
            key: "C",
            text: "প্রতিটা ট্যুরের শুরু থেকে আজ পর্যন্ত গড় Rating এর Dashboard",
            isCorrect: false,
            explanation: "সব Review পড়ে গড় করতে হয়, আর গতকালের Data হলেও চলে। এটা OLAP।",
          },
          {
            key: "D",
            text: "তিন বছরের Booking দিয়ে আগামী শীতের চাহিদার পূর্বাভাস",
            isCorrect: false,
            explanation: "বিশাল ইতিহাস একসাথে পড়া, এটা OLAP এর সবচেয়ে ভারী ধরনের কাজ।",
          },
        ],
      },
      {
        id: 2,
        text: "OLTP নামের Online শব্দটার আসল মানে কী?",
        options: [
          {
            key: "A",
            text: "Database টা Internet এ যুক্ত",
            isCorrect: false,
            explanation: "নামটা Internet এর অনেক আগের। Online এখানে Internet বোঝায় না।",
          },
          {
            key: "B",
            text: "Database টা Cloud এ চলে",
            isCorrect: false,
            explanation: "Cloud বা নিজের Server, দুই জায়গাতেই OLTP হয়। নামের সাথে এর সম্পর্ক নেই।",
          },
          {
            key: "C",
            text: "একজন মানুষ সামনে বসে অপেক্ষা করছেন আর কাজটা এখনই হচ্ছে, রাতে জমিয়ে করা Batch এর উল্টো",
            isCorrect: true,
            explanation: "ঠিক। শুরুর যুগে অনেক কাজ জমিয়ে রাতে একসাথে চালানো হতো। Online মানে সেই অপেক্ষা ছাড়া, এখনই।",
          },
          {
            key: "D",
            text: "Server কখনো বন্ধ হয় না",
            isCorrect: false,
            explanation: "সবসময় চালু থাকা আলাদা বিষয়, তাকে বলে Availability। নামের Online সেটা বোঝায় না।",
          },
        ],
      },
      {
        id: 3,
        text: "booking_id দিয়ে একটা পুরো Booking পড়ার কাজে Row Store কেন ভালো?",
        options: [
          {
            key: "A",
            text: "কারণ Row Store এ Data চাপ দিয়ে বেশি ছোট করা থাকে",
            isCorrect: false,
            explanation: "Compression এ বরং Column Store এগিয়ে। Row Store এর সুবিধা অন্য জায়গায়।",
          },
          {
            key: "B",
            text: "কারণ একটা Booking এর সব ঘর পাশাপাশি এক জায়গায় থাকে, তাই এক টানে পুরোটা পাওয়া যায়",
            isCorrect: true,
            explanation: "ঠিক। Column Store এ একই Booking এর ঘরগুলো আলাদা আলাদা Column এর ফালিতে ছড়ানো, জোড়া দিতে অনেক জায়গায় যেতে হয়।",
          },
          {
            key: "C",
            text: "কারণ Row Store SQL বোঝে আর Column Store বোঝে না",
            isCorrect: false,
            explanation: "দুটোই SQL বোঝে। তফাত শুধু Disk এ Data সাজানোয়।",
          },
          {
            key: "D",
            text: "কারণ Row Store এ Index বানানো যায় না",
            isCorrect: false,
            explanation: "Row Store এ Index খুবই স্বাভাবিক, Primary Key এর Index তো নিজে থেকেই তৈরি হয়।",
          },
        ],
      },
      {
        id: 4,
        text: "পঞ্চাশ লাখ Booking এর total_bdt যোগ করতে Column Store কেন অনেক দ্রুত?",
        options: [
          {
            key: "A",
            text: "শুধু total_bdt এর ফালিটা পড়তে হয়, বাকি Column ছুঁতে হয় না, আর একই রকম মান পাশাপাশি থাকায় চাপ দিয়ে ছোটও করা যায়",
            isCorrect: true,
            explanation: "ঠিক। কম Byte পড়া মানে কম সময়। Row Store এ প্রতিটা Row এর সব ঘরই আসত।",
          },
          {
            key: "B",
            text: "Column Store এ যোগফল আগে থেকেই হিসাব করে রাখা থাকে",
            isCorrect: false,
            explanation: "সাধারণভাবে না। প্রশ্ন এলে তখনই যোগ হয়, শুধু পড়ার পরিমাণ কম।",
          },
          {
            key: "C",
            text: "Column Store কোনো Disk ব্যবহার করে না",
            isCorrect: false,
            explanation: "Column Store ও Disk এ Data রাখে। তার সুবিধা সাজানোর ধরনে।",
          },
          {
            key: "D",
            text: "Column Store এ বাতিল Booking থাকে না",
            isCorrect: false,
            explanation: "কী থাকবে তা Data র ব্যাপার, Storage এর না।",
          },
        ],
      },
      {
        id: 5,
        text: "ভিড়ের সময় মূল PostgreSQL এ একটা বিশাল Report চালালে Booking ধীর হয় মূলত কেন?",
        options: [
          {
            key: "A",
            text: "Report এর SELECT পুরো Table Lock করে রাখে, তাই Booking এর UPDATE ঢুকতে পারে না",
            isCorrect: false,
            explanation: "PostgreSQL এ পড়া কখনো লেখাকে আটকায় না, MVCC এর কারণে। Lock এখানে মূল কারণ না।",
          },
          {
            key: "B",
            text: "Report আর Booking একই মেশিনের CPU, Disk আর Memory এর জন্য প্রতিযোগিতা করে",
            isCorrect: true,
            explanation: "ঠিক। কেউ কাউকে আটকাচ্ছে না, কিন্তু সম্পদ একটাই, ভাগ হয়ে যায়। তাই Report কে অন্য জায়গায় সরানো হয়।",
          },
          {
            key: "C",
            text: "Report চলার সময় Database নতুন Connection নেয় না",
            isCorrect: false,
            explanation: "Report চললেও নতুন Connection নেওয়া যায়।",
          },
          {
            key: "D",
            text: "Report Data মুছে ফেলে",
            isCorrect: false,
            explanation: "Report শুধু পড়ে, কিছু মোছে না।",
          },
        ],
      },
      {
        id: 6,
        text: "একজন Customer এইমাত্র বুক করে পরের পাতায় নিজের Booking এর তালিকায় সেটা দেখলেন না। পাতাটা Read Replica থেকে পড়ছিল। সবচেয়ে সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "Booking টা আসলে হয়নি",
            isCorrect: false,
            explanation: "Booking মূল Database এ ঠিকই লেখা হয়েছে।",
          },
          {
            key: "B",
            text: "Replica তে লেখা যায় না বলে Booking টা হারিয়ে গেছে",
            isCorrect: false,
            explanation: "লেখা হয় মূল Database এ, Replica সেটা পরে নিজের মধ্যে নেয়। হারায় না।",
          },
          {
            key: "C",
            text: "Replica মূল Database থেকে কয়েক মুহূর্ত পিছিয়ে ছিল, নতুন Booking তখনও পৌঁছায়নি",
            isCorrect: true,
            explanation: "ঠিক, এর নাম Replication Lag। যা সাথে সাথে দেখাতে হবে, তা মূল Database থেকে পড়তে হয়।",
          },
          {
            key: "D",
            text: "Replica শুধু রাতে আপডেট হয়",
            isCorrect: false,
            explanation: "রাতে আপডেট হয় ETL দিয়ে চলা Warehouse। Replica প্রায় সাথে সাথে আপডেট হয়।",
          },
        ],
      },
      {
        id: 7,
        text: "Island Tours এ সব Booking এর total_bdt যোগ করলে আসে ৫,৯২,৩০০ টাকা, অথচ Accountant বলছেন আসল আয় ৪,২৩,৬০০ টাকা। তফাতটা কোথা থেকে?",
        options: [
          {
            key: "A",
            text: "Database এর যোগে ভুল আছে",
            isCorrect: false,
            explanation: "Database এর যোগ ঠিক আছে। প্রশ্নটাই ভুল ছিল।",
          },
          {
            key: "B",
            text: "প্রথম সংখ্যায় pending আর cancelled Booking ও ধরা হয়েছে, আসল আয়ে শুধু confirmed",
            isCorrect: true,
            explanation: "ঠিক। কোন Row গুনবেন সেটা ব্যবসার সিদ্ধান্ত, আর OLAP এর এমন ভুল কোনো Error দেখায় না, চুপচাপ ভুল সংখ্যা দেয়।",
          },
          {
            key: "C",
            text: "Payment Table এর টাকা যোগ হয়নি",
            isCorrect: false,
            explanation: "দুই সংখ্যাই bookings এর total_bdt থেকে। তফাত কোন Row ধরা হলো তাতে।",
          },
          {
            key: "D",
            text: "Column Store আর Row Store আলাদা ফল দেয়",
            isCorrect: false,
            explanation: "Storage যাই হোক, একই প্রশ্নের উত্তর একই। তফাত প্রশ্নে।",
          },
        ],
      },
      {
        id: 8,
        text: "মালিক সকাল দশটায় Warehouse এর Dashboard এ আজকের সকালের Booking গুলো দেখতে পাচ্ছেন না। কেন, আর এটা কি সমস্যা?",
        options: [
          {
            key: "A",
            text: "ETL রাতে চলে, তাই Warehouse গতকাল রাত পর্যন্ত তাজা। Report এর জন্য এটা স্বাভাবিক, শুধু সাথে সাথে দরকারি কিছু Warehouse থেকে দেখানো যাবে না",
            isCorrect: true,
            explanation: "ঠিক। Warehouse ইতিহাসের জায়গা। এই মুহূর্তের সংখ্যা আসবে মূল Database থেকে।",
          },
          {
            key: "B",
            text: "Warehouse এ Booking লেখা নিষেধ, তাই কখনো আসবে না",
            isCorrect: false,
            explanation: "ETL প্রতি রাতে নতুন Data ঢোকায়, আজকেরগুলো আজ রাতে আসবে।",
          },
          {
            key: "C",
            text: "Column Store নতুন Row রাখতে পারে না",
            isCorrect: false,
            explanation: "রাখতে পারে। দেরিটা ETL এর সময়সূচির কারণে।",
          },
          {
            key: "D",
            text: "Dashboard ভেঙে গেছে, এখনই ঠিক করতে হবে",
            isCorrect: false,
            explanation: "এটা নকশার স্বাভাবিক আচরণ, ভাঙা না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "দুই রকম Query নিজে চালিয়ে দেখা",
    subtitle: "এই পাতার যেকোনো Query বক্সে Paste করে চালান, Module 02 এর পর psql এও",
    stepName: "LAB",
    steps: [
      {
        title: "তিনটা OLTP পড়া",
        description:
          "একটা Booking নম্বর দিয়ে, একটা তারিখের খালি সিট, আর একজন Customer এর Email দিয়ে তাঁর সব Booking। খেয়াল করুন প্রতিটা উত্তর কত ছোট।",
      },
      {
        title: "একটা OLTP লেখা",
        description:
          "BEGIN আর COMMIT এর মাঝে সিট কমানো আর নতুন Booking ঢোকানো। আগে আর পরে খালি সিটের সংখ্যা মিলিয়ে দেখুন। শেষে Reset চাপুন।",
      },
      {
        title: "status অনুযায়ী মোট টাকা",
        description:
          "confirmed, pending আর cancelled আলাদা আলাদা গুনে আর যোগ করে দেখুন, আয়ের ফাঁদটা কোথায়।",
      },
      {
        title: "মাসিক আয়",
        description:
          "লেসনের OLAP Query নিজে চালান, তারপর confirmed এর জায়গায় pending লিখে আবার চালিয়ে তুলনা করুন।",
      },
      {
        title: "একটা Booking কে Fact Row বানানো",
        description:
          "পাঁচটা Table জোড়া দিয়ে booking_id 13 কে একটা চওড়া Row বানান, ঠিক যেমন ETL এর Transform ধাপে হয়।",
      },
      {
        title: "কোন ট্যুর বেশি বাতিল হয়",
        description:
          "প্রতিটা ট্যুরে মোট Booking আর বাতিল Booking পাশাপাশি গুনে দেখুন। এটা একটা ছোট OLAP প্রশ্ন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-oltp-reads.sql",
        language: "sql",
        code: `-- একটা Booking, তার নম্বর দিয়ে
SELECT booking_id, customer_id, departure_id, seats, status, total_bdt
FROM bookings
WHERE booking_id = 13;

-- একটা তারিখে কয়টা সিট খালি
SELECT departure_id, tour_id, starts_on, seats_left
FROM departures
WHERE departure_id = 9;

-- একজন Customer এর সব Booking, তাঁর Email দিয়ে
SELECT b.booking_id, b.status, b.seats, d.starts_on
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
WHERE c.email = 'rahim.uddin@mail.example'
ORDER BY d.starts_on;

-- শেষ Query এর ফল: booking 1 (confirmed, 2026-01-15),
-- booking 8 (confirmed, 2026-03-06), booking 17 (pending, 2026-12-04)`,
      },
      {
        filename: "2-oltp-write.sql",
        language: "sql",
        code: `-- আগে: departure 9 এ seats_left 19
SELECT departure_id, seats_left FROM departures WHERE departure_id = 9;

BEGIN;

UPDATE departures
SET seats_left = seats_left - 2
WHERE departure_id = 9;

INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (15, 9, 2, 'pending', 25000.00)
RETURNING booking_id, status, total_bdt;

COMMIT;

-- পরে: seats_left 17, আর নতুন booking_id 25
SELECT departure_id, seats_left FROM departures WHERE departure_id = 9;`,
      },
      {
        filename: "3-revenue-by-status.sql",
        language: "sql",
        code: `SELECT status,
       count(*) AS bookings,
       sum(total_bdt) AS total_bdt
FROM bookings
GROUP BY status
ORDER BY status;

--  status    | bookings | total_bdt
-- -----------+----------+-----------
--  cancelled |        3 |  51500.00
--  confirmed |       17 | 423600.00
--  pending   |        4 | 117200.00
-- তিনটা যোগ করলে 592300.00, অথচ আসল আয় শুধু confirmed এর 423600.00`,
      },
      {
        filename: "4-monthly-revenue.sql",
        language: "sql",
        code: `-- PostgreSQL
SELECT date_trunc('month', booked_at)::date AS month,
       count(*) AS bookings,
       sum(total_bdt) AS revenue_bdt
FROM bookings
WHERE status = 'confirmed'
GROUP BY 1
ORDER BY 1;

-- MySQL এ একই প্রশ্ন (date_trunc নেই, DATE_FORMAT দিয়ে মাসের প্রথম দিন)
-- SELECT DATE_FORMAT(booked_at, '%Y-%m-01') AS month,
--        COUNT(*) AS bookings,
--        SUM(total_bdt) AS revenue_bdt
-- FROM bookings
-- WHERE status = 'confirmed'
-- GROUP BY month
-- ORDER BY month;`,
      },
      {
        filename: "5-flatten-one-booking.sql",
        language: "sql",
        code: `-- ETL এর Transform ধাপ যা করে, একটা Booking এর জন্য
SELECT b.booking_id,
       date_trunc('month', b.booked_at)::date AS booked_month,
       c.city AS customer_city,
       t.title AS tour,
       ds.name AS destination,
       d.starts_on,
       b.seats,
       b.total_bdt
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t ON t.tour_id = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id
WHERE b.booking_id = 13;

-- ফল: 13 | 2026-09-01 | Dhaka | Saint Martin Island Escape
--      | Saint Martin's Island | 2026-11-20 | 2 | 25000.00`,
      },
      {
        filename: "6-cancellations-per-tour.sql",
        language: "sql",
        code: `SELECT t.title,
       count(*) FILTER (WHERE b.status = 'cancelled') AS cancelled,
       count(*) AS all_bookings
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t ON t.tour_id = d.tour_id
GROUP BY t.title
ORDER BY cancelled DESC, t.title;

-- তিনটা ট্যুরে একটা করে বাতিল: Cox's Bazar Beach Weekend,
-- Saint Martin Island Escape আর Sajek Valley Cloud Trip।
-- MySQL এ FILTER নেই, তার বদলে SUM(b.status = 'cancelled') বা CASE লিখতে হয়।`,
      },
    ],
    tip: (
      <p>
        প্রতিটা Query চালানোর আগে আন্দাজ করুন, উত্তর কয়টা Row হবে আর Database কে
        কয়টা Row দেখতে হবে। তারপর চালিয়ে মিলিয়ে নিন। এই অভ্যাসটাই পরে Module 13
        এ ধীর Query ধরার সবচেয়ে বড় অস্ত্র হবে।
      </p>
    ),
  },
  assignment: {
    title: "Mini Project: Island Tours এর জন্য একটা Report পরিকল্পনা",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>দশটা কাজ বাছাই করুন:</strong> Island Tours এর এমন দশটা কাজ লিখুন
        যা লেসনে নেই, যেমন একজন Guide এর ফোন নম্বর বদলানো বা সবচেয়ে বেশি টাকা
        খরচ করা পাঁচজন Customer। প্রতিটার পাশে OLTP বা OLAP লিখুন, আর দুইটা
        প্রশ্নের উত্তর দিয়ে কারণ দিন: কেউ কি অপেক্ষা করছেন, আর কয়টা Row ছুঁতে হবে।
      </span>,
      <span key="2">
        <strong>আয়ের ফাঁদ ধরুন:</strong> Lab এর তিন আর চার নম্বর Query চালান।
        তারপর মাসিক আয়ের Query তে confirmed এর জায়গায় pending লিখে আবার চালান।
        তিনটা ফলের Screenshot বা Copy রাখুন, আর তিন লাইনে লিখুন Accountant কে কোন
        সংখ্যা দেবেন আর কেন।
      </span>,
      <span key="3">
        <strong>একটা Fact Table এর নকশা:</strong> Lab এর পাঁচ নম্বর Query দেখে কাগজে
        একটা fact_bookings Table এর নকশা করুন। কোন কোন Column থাকবে, প্রতিটা মূল
        Database এর কোন Table থেকে আসবে, আর কোন Column গুলো জেনেশুনে কপি করা।
        অন্তত আটটা Column।
      </span>,
      <span key="4">
        <strong>তিন ধাপের পরিকল্পনা:</strong> Island Tours এর জন্য এক পাতার একটা
        পরিকল্পনা লিখুন। এখন, এক লাখ Booking হলে, আর এক কোটি Booking হলে Report
        কোথায় চলবে, কে কোথায় Connect করবেন, Data কতটা তাজা থাকবে, আর কোন সংকেত
        দেখলে পরের ধাপে যাবেন।
      </span>,
      <span key="5">
        <strong>শেখান (৮ লাইন):</strong> একজন বন্ধু দোকান চালান, প্রোগ্রামিং জানেন
        না। দোকানের ক্যাশ কাউন্টার আর মাস শেষের খাতার উদাহরণ দিয়ে তাঁকে OLTP আর
        OLAP বোঝান, আর বলুন কেন ভিড়ের সময় কাউন্টারের টেবিলে বসে খাতা মেলানো খারাপ
        বুদ্ধি।
      </span>,
    ],
    deliverables: [
      <span key="1">দশটা কাজের তালিকা, প্রতিটার পাশে OLTP বা OLAP আর দুই প্রশ্নের উত্তর</span>,
      <span key="2">তিনটা Query এর ফল আর Accountant এর জন্য তিন লাইনের সিদ্ধান্ত</span>,
      <span key="3">fact_bookings এর নকশা, প্রতিটা Column এর উৎস সহ</span>,
      <span key="4">তিন ধাপের Report পরিকল্পনা, এক পাতায়</span>,
      <span key="5">বন্ধুর জন্য আট লাইনের ব্যাখ্যা</span>,
    ],
  },
};
