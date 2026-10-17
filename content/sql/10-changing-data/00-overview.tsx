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

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const changingDataOverviewContent: TopicData = {
  id: "changing-data-overview",
  introduction: {
    badge: "MODULE 10 · OVERVIEW",
    title: <SectionTitle>পড়ায় ভুল হলে উত্তর ভুল, লেখায় ভুল হলে সত্যটাই ভুল</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 09 শেষে আপনার হাতে নিজের বানানো Table আছে, আর প্রতিটা Column এ নিয়ম বসানো: কোন Type, কোনটা
          ফাঁকা থাকতে পারবে না, কোন মান চলবে না, কোন Table এর সাথে বাঁধা। কিন্তু Table গুলো এখনো প্রায় খালি,
          আর Island Tours এর আসল কাজ চলে Data লেখায়। প্রতিটা নতুন Customer একটা INSERT, প্রতিটা Booking কয়েকটা
          INSERT আর UPDATE, প্রতিটা বাতিল একটা UPDATE বা DELETE। এই মডিউল সেই লেখার কাজ শেখায়।
        </ContentParagraph>
        <ContentParagraph>
          পড়া আর লেখার মধ্যে একটা বড় পার্থক্য আছে, যেটা এই মডিউলের প্রতিটা পাতায় ফিরে আসবে। একটা ভুল SELECT
          শুধু আপনার পর্দায় একটা ভুল উত্তর দেখায়, আবার লিখলেই ঠিক হয়ে যায়। একটা ভুল UPDATE Database এর সত্যটাই
          বদলে দেয়, আর তারপর থেকে Website, Report আর প্রতিটা সহকর্মীর Query সেই ভুল সত্যটাই পড়ে। তাই এখানে
          শুধু Command শেখা নয়, লেখার আগে দেখে নেওয়া আর লেখার পরে গুনে নেওয়ার অভ্যাসও শেখা।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা লেসন নয়, মডিউলের মানচিত্র। এখানে জানবেন মডিউলটা কেন দরকার, সাতটা লেসনে কী কী শিখবেন, না
          শিখলে কোন ভুলগুলো কোনো Error ছাড়াই ঘটে যায়, আর কাজের জায়গায় এগুলো ঠিক কোথায় লাগে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "দোকানের হিসাবের খাতা পড়তে গিয়ে ভুল হলে আবার পড়লেই চলে। খাতায় ভুল লিখলে সেই ভুলটাই সবাই পড়েন, যতক্ষণ না কেউ খুঁজে বের করে কেটে ঠিক করেন। তাই ভালো হিসাবরক্ষক লেখার আগে একবার দেখেন, লেখার পরে একবার গোনেন।",
      author: "Changing Data",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>যে ভুলগুলোতে কোনো Error আসে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026, ফারুক সাহেবের সাপ্তাহিক বৈঠক। শীতের মৌসুম শুরু হচ্ছে, তাই এই সপ্তাহের
                তালিকায় চারটা কাজ, আর চারটাই Data লেখার কাজ। কোনো নতুন Table নয়, কোনো Report নয়, শুধু চালু
                Table গুলোতে Row ঢোকানো, বদলানো আর মোছা। কাজগুলো পড়লেন Developer তানিম, যিনি গত মাসে বাংলা Website
                এর Table বানিয়েছিলেন। সপ্তাহ শেষে চারটা কাজের প্রতিটায় একটা করে চমক এল।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>শীতের দাম।</strong> Chattogram অঞ্চলের ট্যুরগুলোর দাম 10 শতাংশ বাড়বে। তানিম একটা GUI
                  Tool এ UPDATE লিখলেন, দ্বিতীয় লাইনে WHERE region = &apos;Chattogram&apos;, তারপর তাড়ায় শুধু প্রথম
                  লাইনটা হাইলাইট করে চালালেন। উত্তর এল UPDATE 9, অথচ Chattogram এর ট্যুর ছয়টা। Sylhet Tea Garden
                  Tour এর দাম 7800.00 থেকে হলো 8580.00, Ratargul Swamp Boat Day এর 3500.00 থেকে 3850.00, Sundarbans
                  এর 18000.00 থেকে 19800.00। কোনো Error আসেনি, কারণ 8580.00 একটা পুরোপুরি বৈধ দাম।
                </ListItem>
                <ListItem>
                  <strong>তিনজন নতুন গাইড।</strong> Habib Rahman, Tasnim Ara আর Joynal Abedin যোগ দিচ্ছেন। তানিমের
                  Import Script প্রথমবার Network Timeout পেয়ে নিজে থেকে আবার চলল, অথচ প্রথমবারের তিনটা Row আসলে
                  ঢুকে গিয়েছিল। guides এ এখন আটজন নয়, এগারোজন। Habib Rahman দুইবার, guide_id 6 আর 9, আর কোন
                  ট্যুরে কোন Habib বসানো হয়েছে, কেউ নিশ্চিত নন।
                </ListItem>
                <ListItem>
                  <strong>Account বন্ধের অনুরোধ।</strong> Rahim Uddin তাঁর Account বন্ধ করতে বললেন। Support দলের
                  একজন customers থেকে তাঁর Row মুছতে গেলেন, আর Foreign Key ঠিক কাজটাই করল: DELETE থামল, কারণ তাঁর
                  Booking আছে। Error সরাতে তিনি আগে Rahim এর দুইটা Review, দুইটা Payment আর তিনটা Booking মুছলেন,
                  তারপর Customer কে। মাসের confirmed আয় 423600.00 থেকে নেমে এল 379600.00 এ। যে 44000.00 টাকা সত্যিই
                  ব্যাংকে ঢুকেছিল, তার কোনো রেকর্ড আর Database এ নেই।
                </ListItem>
                <ListItem>
                  <strong>পুরনো Customer দের আনা।</strong> পুরনো Booking Software থেকে 25 জন Customer আনা হলো, তাঁদের
                  পুরনো নম্বর 16 থেকে 40 সহ, যাতে পুরনো রসিদের নম্বর মেলে। পরের সকালে Website এ নতুন Sign-up এর
                  প্রথম পঁচিশটা চেষ্টাই থামল{" "}
                  <code className={CODE}>{'duplicate key value violates unique constraint "customers_pkey"'}</code>{" "}
                  দিয়ে, প্রতিবার পরের নম্বরে। ছাব্বিশতম মানুষটা প্রথম সফল হলেন, নম্বর 41 নিয়ে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                চারটা ঘটনার পেছনে একটাই শিক্ষা। Module 09 এর নিয়মগুলো দেখে একটা মান <strong>সম্ভব</strong> কি না,
                দেখে না আপনি সেটাই <strong>চেয়েছিলেন</strong> কি না। নয়টা ট্যুরের নতুন দাম সম্ভব, দুইবার ঢোকা গাইড
                সম্ভব, Payment ছাড়া একটা খালি মাস সম্ভব। যেখানে নিয়ম সত্যিই থামিয়েছে, যেমন Foreign Key আর
                Primary Key, সেখানেও মানুষ হয় নিয়মটাকে পাশ কাটিয়েছেন, নয়তো আসল কারণটা বোঝেননি। তাই লেখার কাজে
                Constraint যথেষ্ট নয়। লাগে লেখার সঠিক Command, আর লেখার আগে ও পরে কয়েকটা অভ্যাস: একই শর্তে আগে
                SELECT চালিয়ে দেখা, PostgreSQL কয়টা Row বদলাল সেটা পড়া, ঝুঁকির কাজ Transaction এর ভেতরে চালানো,
                দুইবার চললেও নিরাপদ এমন Statement লেখা, আর মোছার বদলে কখন চিহ্ন দিয়ে রাখতে হয় সেটা জানা।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল শেষে উপরের চারটা কাজ আপনি এমনভাবে করবেন যে চমকগুলোর একটাও আর ঘটবে না, আর ঘটে গেলে
                প্রথম পাঁচ মিনিটে কী করতে হয়, সেটাও জানবেন।
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
              প্রতিটা চমকের সমাধান এখানে ইচ্ছা করেই খুলে বলা হয়নি। দামের ভুলটা ঠিকভাবে লেখা লেসন ২ এ, আর ভুলটা
              আটকানো ও সামলানো লেসন ৭ এ। দুইবার চললেও নিরাপদ Import লেসন ৪ এ। মোছার বদলে চিহ্ন দিয়ে রাখা লেসন ৩
              এ। পুরনো নম্বরসহ আনা Data আর তার পরের Error লেসন ৫ আর ৬ এ। মডিউল শেষে এই অংশটা আবার পড়ুন, প্রতিটা
              চমকের কারণ আর সমাধান তখন নিজেই বলতে পারবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "big-picture",
      subHeader: { index: "002", title: "The Big Picture" },
      title: <SectionTitle>হিসাবের খাতায় লেখার সাত রকম কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা পুরনো পাইকারি দোকানের হিসাবের খাতা মনে করুন। খাতায় প্রতিদিন নানা রকম লেখা হয়, আর প্রতিটা রকমের
                নিজের নিয়ম আছে। মজার ব্যাপার হলো, এই মডিউলের সাতটা লেসন ঠিক এই সাত রকম লেখা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>নতুন লাইন যোগ:</strong> নতুন একজন খদ্দের, নতুন একটা বিক্রি। লেখার পরে খাতার পাশে রসিদের
                  নম্বরটা টুকে রাখা, যাতে পরে সেটা দিয়ে খোঁজা যায়। INSERT আর RETURNING, লেসন ১।
                </ListItem>
                <ListItem>
                  <strong>লেখা লাইন সংশোধন:</strong> দাম বদলেছে, ঠিকানা বদলেছে। কোন কোন লাইন বদলাবেন, সেটা ঠিক করাই
                  আসল কাজ। UPDATE, লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>কেটে দেওয়া, না পাশে বাতিল লেখা:</strong> কালি দিয়ে পুরো লাইন ঢেকে দিলে পরে আর পড়া যায় না।
                  অভিজ্ঞ হিসাবরক্ষক তাই লাইনের পাশে লেখেন বাতিল, আর লাইনটা পড়ার মতো রেখে দেন। DELETE আর Soft
                  Delete, লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>থাকলে সংশোধন, না থাকলে নতুন:</strong> খদ্দেরের নাম খাতায় থাকলে তাঁর বাকির ঘরে যোগ, না থাকলে
                  নতুন লাইন। দুইবার লিখলেও একই ফল। Upsert, লেসন ৪।
                </ListItem>
                <ListItem>
                  <strong>এক বান্ডিল স্লিপ একবারে তোলা:</strong> সারা সপ্তাহের হাজারটা বিক্রির স্লিপ এক বসায় খাতায়
                  তোলা, আর খাতার পুরোটা আরেকটা খাতায় কপি করা। COPY আর CSV, লেসন ৫।
                </ListItem>
                <ListItem>
                  <strong>আগে থেকে ছাপানো নম্বর আর নিজে বসা যোগফল:</strong> রসিদ বইয়ের প্রতিটা পাতায় নম্বর ছাপানো থাকে,
                  ছেঁড়া পাতার নম্বর আর ফেরে না। আর কিছু ঘর লিখতে হয় না, দাম আর পরিমাণ থেকে নিজেই হিসাব হয়। Sequence আর
                  Generated Column, লেসন ৬।
                </ListItem>
                <ListItem>
                  <strong>পুরো পাতা উল্টে লিখে ফেলা:</strong> একটা লাইন সংশোধন করতে গিয়ে পুরো পাতার প্রতিটা লাইনে
                  একই সংখ্যা বসিয়ে দেওয়া। সবচেয়ে ভয়ের ভুল, আর তার পরের উদ্ধার। UPDATE Without WHERE, লেসন ৭।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সবগুলোর পেছনে একটাই নীতি: <strong>লেখার আগে দেখুন, লেখার পরে গুনুন।</strong> UPDATE আর DELETE এর
                WHERE অংশ ঠিক সেই কাজ করে, যা SELECT এর WHERE করে: কোন Row গুলো, সেটা বাছে। তাই আগে একই WHERE দিয়ে
                SELECT চালিয়ে Row গুলো চোখে দেখুন। লেখার পরে PostgreSQL নিজেই জানায় কয়টা Row বদলেছে, যেমন UPDATE 6,
                আর সেই সংখ্যাটা আপনার প্রত্যাশার সাথে মেলান। RETURNING দিয়ে বদলানো Row গুলোই সাথে সাথে ফেরত আনুন।
                আর যে কাজ ফেরানো কঠিন, সেটা BEGIN এর ভেতরে চালান, যাতে সংখ্যা না মিললে ROLLBACK দিয়ে সব ফেরানো যায়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে তানিমের ভুলটা আবার ঘটানো হয়েছে, তবে Sample Table এ নয়, tours এর একটা কপিতে, যার নাম
                ov_tours। প্রথমে দেখা হয়েছে Chattogram এর ট্যুর কয়টা, তারপর WHERE ছাড়া UPDATE। UPDATE এর নিয়ম এখনই
                জানার দরকার নেই, শুধু Run চাপুন আর দুইটা সংখ্যা মেলান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা কপিতে তানিমের ভুল: দেখা হলো ছয়, বদলাল নয়"
              query={`DROP TABLE IF EXISTS ov_tours;
CREATE TABLE ov_tours AS
SELECT t.tour_id, t.title, d.region, t.price_bdt
FROM tours t
JOIN destinations d USING (destination_id);
SELECT count(*) AS chattogram_tours
FROM ov_tours
WHERE region = 'Chattogram';
UPDATE ov_tours
SET price_bdt = round(price_bdt * 1.10, 2);
SELECT tour_id, title, region, price_bdt
FROM ov_tours
ORDER BY tour_id;`}
              caption={`CREATE TABLE AS এর উত্তর SELECT 9, মানে নয়টা ট্যুর কপি হয়েছে। তারপর গোনা বলছে Chattogram এর ট্যুর 6টা, অথচ UPDATE এর উত্তর UPDATE 9। শেষ Table এ নয়টা দামই বেড়েছে: Sundarbans 19800.00, Sylhet Tea Garden 8580.00, Ratargul 3850.00, যাদের বাড়ার কথাই ছিল না। এবার SET লাইনের নিচে WHERE region = 'Chattogram' লাইনটা যোগ করে আবার চালান। উত্তর আসবে UPDATE 6, আর ওই তিনটা দাম আগের মতো 18000.00, 7800.00 আর 3500.00 থাকবে। প্রথম লাইনের DROP TABLE IF EXISTS প্রতিবার কপিটা নতুন করে বানায়, আর আসল tours Table এ এই বক্স কখনো হাত দেয় না, তাই যতবার খুশি চালান।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিয়েছে, এই মডিউল কী যোগ করে, পরের মডিউল কী চায়"
              caption="Module 09 এ আপনি Table বানিয়েছেন আর প্রতিটা Column এ নিয়ম বসিয়েছেন। Module 10 সেই Table গুলোতে Data ঢোকায়, বদলায় আর মোছে, আর প্রতিটা লেখায় Module 09 এর নিয়মগুলোই পাহারা দেয়। Module 11 এক ধাপ পিছিয়ে বড় প্রশ্নটা করে: কোন Table বানাবেন, কোন তথ্য কোথায় রাখবেন, যাতে লেখার কাজ সহজ আর নিরাপদ হয়।"
              before={{
                tag: "Module 09",
                title: "Tables & Constraints",
                lines: ["নিজের Table বানানো", "ঠিক Data Type বাছাই", "Constraint এর পাহারা"],
              }}
              current={{
                tag: "Module 10",
                title: "Changing Data",
                lines: ["INSERT, UPDATE, DELETE", "Upsert আর COPY", "লেখার আগে যাচাই"],
              }}
              after={{
                tag: "Module 11",
                title: "Database Design",
                lines: ["কোন Table, কেন", "Normalization", "Island Tours এর নকশা"],
              }}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলে আগের দুইটা মডিউলের জিনিস একসাথে কাজে লাগবে। প্রতিটা INSERT আর UPDATE এর ভাগ্য ঠিক করে
              Module 09 এর নিয়ম: একটা অসম্ভব মান দিলে Error টা আসে লেখার মুহূর্তেই, আর সেই Error পড়তে পারা এখানে
              রোজকার কাজ।{" "}
              <Link href="/sql/topic/basic-constraints" className={LINK}>
                NOT NULL, DEFAULT, UNIQUE and CHECK
              </Link>{" "}
              আর{" "}
              <Link href="/sql/topic/foreign-keys" className={LINK}>
                Foreign Keys and ON DELETE
              </Link>{" "}
              লেসনের Error গুলো এখানে বারবার দেখবেন। আর Module 07 এর Subquery আর CTE ফিরে আসে লেখার ভেতরে: অন্য
              Query এর ফল দিয়ে INSERT, আরেকটা Table দেখে UPDATE, আর একটা WITH এর ভেতরে INSERT করে তার ফল দিয়ে পরের
              কাজ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "what-you-will-learn",
      subHeader: { index: "003", title: "What You Will Learn" },
      title: <SectionTitle>সাতটা লেসন, লেখার প্রতিটা রকম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। যেকোনোটায় চাপ দিলে সরাসরি সেখানে যাবেন, তবে
              প্রথমবার ক্রম ধরে যাওয়াই ভালো, কারণ প্রথম তিনটা লেসনের তিনটা Command বাকি চারটা লেসনের ভিত্তি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              track="sql"
              moduleId="changing-data"
              questions={{
                insert:
                  "একটা আর অনেকগুলো Row কীভাবে ঢোকাবেন, Column এর তালিকা কেন সবসময় লিখবেন, অন্য Query এর ফল দিয়ে কীভাবে ঢোকাবেন, আর নতুন Row এর id সাথে সাথে কীভাবে ফেরত পাবেন?",
                update:
                  "ঠিক যে Row গুলো বদলানোর কথা, শুধু সেগুলোই কীভাবে বদলাবেন, আরেকটা Table দেখে কীভাবে বদলাবেন, আর বদলের আগে ও পরে কীভাবে যাচাই করবেন?",
                "delete-soft-delete":
                  "Row কীভাবে মুছবেন, Foreign Key মোছাকে কখন আটকায় আর কখন সাথে টেনে নেয়, আর কখন মোছার বদলে শুধু চিহ্ন দিয়ে রাখা উচিত?",
                upsert:
                  "থাকলে বদলানো আর না থাকলে ঢোকানো এক Statement এ কীভাবে করবেন, যাতে একই কাজ দুইবার চললেও ফল একই থাকে?",
                "bulk-loading":
                  "হাজার হাজার Row একবারে কীভাবে ঢোকাবেন, CSV তে কীভাবে বের করবেন, আর খারাপ লাইনসহ একটা File কে কীভাবে নিরাপদে আনবেন?",
                "generated-columns-sequences":
                  "যে Column নিজে থেকে হিসাব হয়, সেটা কীভাবে বানাবেন, id এর নম্বর আসলে কোথা থেকে আসে, আর পুরনো নম্বরসহ Data আনার পরে নম্বর কীভাবে ঠিক করবেন?",
                "update-without-where":
                  "WHERE ছাড়া UPDATE কীভাবে ঘটে যায়, কোন অভ্যাস সেটা আটকায়, আর ঘটে গেলে প্রথম কয়েক মিনিটে কী করবেন?",
              }}
              footer="সাতটা লেসন তিন ভাগে মনে রাখা সহজ। প্রথম তিনটা মূল তিন Command: INSERT, UPDATE আর DELETE। পরের তিনটা সেগুলোর উন্নত রূপ: দুইবার চললেও নিরাপদ লেখা, একবারে অনেক লেখা, আর নিজে থেকে বসা মান। শেষেরটা ভুল আটকানো আর সামলানো, আর তাতেই পুরো মডিউলের Recap।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনগুলো একটা গল্পের মতো পড়ুন। শুরু <strong>INSERT and RETURNING</strong> দিয়ে। Column এর
                তালিকা দিয়ে একটা Row, তারপর এক Statement এ অনেকগুলো Row, DEFAULT দিয়ে Database কে নিজের মান বসাতে
                দেওয়া, আর অন্য একটা Query এর ফল সরাসরি ঢোকানো, যাকে বলে INSERT ... SELECT। সবচেয়ে কাজের অংশ
                RETURNING: নতুন Row এর id সেই Statement থেকেই ফেরত পাওয়া, যাতে পরের Payment কোন Booking এর, সেটা
                আন্দাজ করতে না হয়। এখানে Module 09 এর প্রতিটা নিয়ম একবার করে ভাঙবেন, আর দেখবেন একটা Booking আর তার
                Payment একসাথে ঢোকানোর প্রথম ঝলক, যার পূর্ণ গল্প Module 12 এ।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় লেসন <strong>UPDATE</strong>। SET দিয়ে এক বা একাধিক Column, দামের মতো মান হিসাব করে বদলানো,
                আর WHERE দিয়ে ঠিক Row গুলো বাছা। tours এ region নেই, ওটা থাকে destinations এ, তাই Chattogram এর
                ট্যুর বদলাতে লাগে আরেকটা Table দেখে বদলানো: PostgreSQL এ UPDATE ... FROM, MySQL এ UPDATE ... JOIN।
                PostgreSQL 18 এর একটা নতুন সুবিধাও দেখবেন: RETURNING এ একই Row এর পুরনো আর নতুন মান পাশাপাশি, যেমন
                12500.00 থেকে 13750.00। আর সবচেয়ে জরুরি অভ্যাস: আগে SELECT, তারপর একই WHERE দিয়ে UPDATE।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয় লেসন <strong>DELETE and Soft Delete</strong>। DELETE ... WHERE, আরেকটা Table দেখে মোছা, আর
                Foreign Key কখন মোছা আটকায় আর কখন সাথে আরও Row মুছে দেয়, Module 09 এর ON DELETE এর সাথে মিলিয়ে।
                তারপর আসল প্রশ্নটা: সত্যিই মুছবেন, নাকি deleted_at নামের একটা Column এ সময় বসিয়ে Row টাকে শুধু
                লুকিয়ে রাখবেন? লুকানোর দাম কী, প্রতিটা Query তে তখন কী মনে রাখতে হয়, আর কেন Payment এর Row কখনো
                মোছা হয় না, Rahim Uddin এর ঘটনাটা দিয়েই।
              </ContentParagraph>
              <ContentParagraph>
                চতুর্থ লেসন <strong>Upsert: ON CONFLICT and ON DUPLICATE KEY</strong>। INSERT ... ON CONFLICT DO
                NOTHING আর DO UPDATE, যেখানে EXCLUDED নামের একটা বিশেষ নাম দিয়ে নতুন আসা মানটা ধরা যায়। কেন এর জন্য
                আগে একটা UNIQUE নিয়ম লাগে, না থাকলে কোন Error আসে, আর গোনার ঘর বা শেষবার দেখার সময় রাখার মতো রোজকার
                কাজ। সাথে MERGE, যেটা PostgreSQL 15 এ এসেছে আর 17 থেকে RETURNING ও নেয়, আর MySQL এর ON DUPLICATE KEY
                UPDATE ও REPLACE INTO এর পার্থক্য।
              </ContentParagraph>
              <ContentParagraph>
                পঞ্চম লেসন <strong>Bulk Loading with COPY and CSV</strong>। হাজার হাজার Row এক Command এ ঢোকানো আর
                বের করা, CSV এর Header, Delimiter আর ফাঁকা ঘরের নিয়ম, Server এর COPY আর psql এর{" "}
                <code className={CODE}>{"\\copy"}</code> এর পার্থক্য, আর খারাপ লাইনসহ File আনার নিরাপদ পথ: আগে একটা
                Staging Table এ, যাচাই, তারপর INSERT ... SELECT দিয়ে আসল Table এ। পরীক্ষার জন্য generate_series দিয়ে
                হাজার Row বানানোও এখানে, আর MySQL এর LOAD DATA।
              </ContentParagraph>
              <ContentParagraph>
                ষষ্ঠ লেসন <strong>Generated Columns and Sequences</strong>। এমন Column, যার মান অন্য Column থেকে
                নিজেই হিসাব হয়, আর কেউ ভুল করে আলাদা মান বসাতে পারে না। PostgreSQL 18 এ এর দুই রূপ, STORED আর
                VIRTUAL, আর 18 থেকে না বললে VIRTUAL। তারপর id এর নম্বরের উৎস Sequence: nextval, currval, setval, নম্বরে
                ফাঁক কেন পড়ে, আর পুরনো Customer দের ঘটনার সমাধান, Data আনার পরে Sequence কে সবচেয়ে বড় নম্বরে বসানো।
              </ContentParagraph>
              <ContentParagraph>
                শেষ লেসন <strong>UPDATE Without WHERE, and Recovery</strong>। তানিমের মতো একটা ঘটনা শুরু থেকে শেষ
                পর্যন্ত: কীভাবে ঘটে, WHERE ভুলে যাওয়া ছাড়াও আরও কোন দুই পথে ঘটে, কোন অভ্যাস আর Setting আটকায়, আর
                ঘটে গেলে কী করবেন। Transaction খোলা থাকলে ROLLBACK, বন্ধ হয়ে গেলে Backup বা নির্দিষ্ট মুহূর্তে
                ফেরানো, যার পূর্ণ গল্প Module 18 এ, আর প্রতিটা বদলের রেকর্ড রাখা Audit Table, Module 14 এ। লেসন শেষ হয়
                পুরো মডিউলের Recap দিয়ে: একটা Transaction এর ভেতরে কয়েকটা Booking ঢোকানো, বদলানো, Upsert আর মোছা, আর
                শেষে একটা যাচাইয়ের Query।
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
      title: <SectionTitle>ORM তো নিজেই লেখে, Backup তো আছেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম আপত্তি: Prisma, TypeORM বা Django এর মতো ORM তো Object Save করলেই INSERT আর UPDATE লিখে দেয়,
                নিজে লেখার কী দরকার? দরকার তিনটা কারণে। ORM এর একটা update many ডাকে শর্ত দিতে ভুলে গেলে ঠিক তানিমের
                ভুলটাই হয়, শুধু ভুলটা Code এর ভেতরে লুকানো থাকে। ORM কোন SQL পাঠাল, সেটা Log এ দেখা যায়, কিন্তু
                পড়তে না জানলে Log কিছুই বলে না। আর Upsert, হাজার Row একবারে ঢোকানো, বা পুরনো আর নতুন মান একসাথে
                ফেরত আনার মতো কাজে অনেক দল শেষে নিজেরাই SQL লেখেন। ORM আর Migration এর গল্প Module 17 এ।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় আপত্তি: ভুল হলে তো Backup আছে। আছে, কিন্তু কাল রাতের Backup ফেরালে পুরো Database কাল রাতে
                ফিরে যায়, আর তানিমের ভুলের আগে আজ সকালে যে Booking আর Payment এসেছিল, সেগুলোও চলে যায়। নির্দিষ্ট
                মুহূর্তে ফেরানোর ব্যবস্থাও আছে, Module 18 এ দেখবেন, কিন্তু তাতে সময় লাগে, অনেক সময় পুরো Website
                বন্ধ রাখতে হয়। Backup শেষ ভরসা, প্রথম নয়। প্রথম ভরসা হলো ভুলটা ঘটতে না দেওয়া, আর ঘটলে Transaction
                বন্ধ হওয়ার আগেই ধরা।
              </ContentParagraph>
              <ContentParagraph>এই মডিউল বাদ দিয়ে এগোলে খরচটা যেখানে দিতে হয়:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>চুপচাপ ভুল দাম।</strong> WHERE ছাড়া বা ভুল WHERE এর UPDATE, যার প্রতিটা নতুন মান বৈধ, তাই
                  কোনো নিয়ম থামায় না।
                </ListItem>
                <ListItem>
                  <strong>দুইবার ঢোকা Row।</strong> আবার চলা Script, দুইবার চাপা বোতাম, আর একই মানুষের দুইটা Row।
                </ListItem>
                <ListItem>
                  <strong>হারানো হিসাব।</strong> একটা Error সরাতে মোছা Payment, যার টাকা সত্যিই এসেছিল।
                </ListItem>
                <ListItem>
                  <strong>অর্ধেক আনা File।</strong> মাঝপথে থেমে যাওয়া Import, যার পরে কোন Row ঢুকেছে আর কোনটা নয়, কেউ
                  জানেন না।
                </ListItem>
                <ListItem>
                  <strong>রহস্যময় duplicate key।</strong> পুরনো নম্বরসহ Data আনার পরের সকালে নতুন Sign-up এর একের পর
                  এক Error।
                </ListItem>
              </ContentList>
              <ContentParagraph>আর কয়েকটা প্রচলিত ভুল ধারণা, যেগুলো এই মডিউল ভাঙবে:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>WHERE ভুলে গেলে Database সতর্ক করবে।</strong> PostgreSQL কোনো প্রশ্ন না করে চালিয়ে দেয়, আর
                  শুধু জানায় UPDATE 9। MySQL এ একটা Setting চালু থাকলে তবেই থামে। লেসন ৭।
                </ListItem>
                <ListItem>
                  <strong>নতুন id জানতে INSERT এর পরে SELECT max(id)।</strong> একই মুহূর্তে আরেকজন INSERT করলে দুইজনই
                  একই সবচেয়ে বড় নম্বর পান। RETURNING নিজের Row এর নম্বরই দেয়। লেসন ১।
                </ListItem>
                <ListItem>
                  <strong>ROLLBACK করলে id এর নম্বরও ফিরে আসে।</strong> আসে না, In Real Life অংশের বক্সটা দুইবার
                  চালালেই দেখবেন। লেসন ৬।
                </ListItem>
                <ListItem>
                  <strong>Upsert মানে আগে SELECT, তারপর দরকারমতো INSERT বা UPDATE।</strong> দুইটা Request একই সাথে এলে
                  দুইটাই দেখে কিছু নেই, দুইটাই ঢোকায়। ON CONFLICT কাজটা এক ধাপে করে। লেসন ৪।
                </ListItem>
                <ListItem>
                  <strong>হাজার Row ঢোকাতে হাজারটা INSERT।</strong> COPY একটা Command এ পুরো File আনে, আর একটা খারাপ
                  লাইনেও পুরোটা থামে, অর্ধেক ঢোকে না। লেসন ৫।
                </ListItem>
                <ListItem>
                  <strong>Customer চলে গেলে তাঁর সব Row মুছে দেওয়াই নিয়ম।</strong> Booking আর Payment ব্যবসার হিসাব,
                  সেগুলো থাকে। লেসন ৩।
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
              Constraint অসম্ভব Data আটকায়, ভুল অথচ সম্ভব বদল আটকাতে পারে না। সেই দায়িত্ব আপনার। প্রতিটা লেখার আগে
              চারটা প্রশ্ন মুখে বলুন: কোন Row গুলো বদলাবে, কয়টা বদলাবে, বদলের পরে সেগুলো দেখতে কেমন হবে, আর ভুল হলে
              কীভাবে ফেরাব। চারটার উত্তর জানা থাকলে তবেই Enter চাপুন।
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
              নিচের সাতটা ঘটনা যেকোনো দলের কাজে বারবার আসে। একটা বেছে নিন, দেখুন এই মডিউল না জানলে ঘটনাটা কেমন যায়
              আর জানলে কেমন যায়, আর কোন লেসনে উত্তরটা আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "new-booking-id",
                  label: "নতুন Booking এর নম্বর",
                  situation:
                    "Website এ একজন Customer Booking করলেন, আর App এর এখন সেই Booking এর নম্বর লাগবে, কারণ পরের লাইনে Payment এর Row এ booking_id বসাতে হবে। একই সেকেন্ডে আরেকজন Customer ও Booking করছেন।",
                  without:
                    "App INSERT এর পরে SELECT max(booking_id) দিয়ে নম্বর খোঁজে। প্রথমজনের Booking পেয়েছিল 25, দ্বিতীয়জনের 26, কিন্তু দুইটা Request ই max খুঁজে পায় 26। প্রথমজনের Payment গিয়ে বসে দ্বিতীয়জনের Booking এ, আর কোনো Error আসে না।",
                  withIt:
                    "আপনি লেখেন INSERT ... RETURNING booking_id। নম্বরটা আসে সেই Statement থেকেই, যেটা Row টা ঢুকিয়েছে, তাই অন্য কারো INSERT এর সাথে মেশার কোনো সুযোগ নেই।",
                  lessons: ["INSERT and RETURNING"],
                },
                {
                  id: "winter-price",
                  label: "শীতের দাম বাড়ানো",
                  situation:
                    "ফারুক সাহেব চান Chattogram অঞ্চলের সব ট্যুরের দাম 10 শতাংশ বাড়ুক। কিন্তু tours Table এ region নামের কোনো Column নেই, region থাকে destinations এ।",
                  without:
                    "কেউ হাতে ছয়টা tour_id খুঁজে ছয়টা আলাদা UPDATE লেখেন। একটা নম্বর ভুল টাইপ হয়, তাই একটা Sylhet এর ট্যুরের দাম বাড়ে আর একটা Chattogram এর ট্যুর বাদ পড়ে। পরের মাসে নতুন একটা Chattogram ট্যুর এলে তালিকাটা আবার হাতে বানাতে হয়।",
                  withIt:
                    "আপনি আগে একই শর্তে SELECT চালিয়ে ছয়টা ট্যুর চোখে দেখেন, তারপর UPDATE tours ... FROM destinations ... WHERE region = 'Chattogram' একবারে। উত্তর আসে UPDATE 6, আর আপনি সংখ্যাটা মিলিয়ে নেন।",
                  lessons: ["UPDATE"],
                },
                {
                  id: "close-account",
                  label: "Account বন্ধের অনুরোধ",
                  situation:
                    "Rahim Uddin Account বন্ধ করতে বললেন। তাঁর তিনটা Booking, দুইটা confirmed, দুইটা Payment মিলিয়ে 44000.00 টাকা, আর দুইটা Review আছে। customers থেকে তাঁর Row মুছতে গেলে Foreign Key আপত্তি করে।",
                  without:
                    "Error সরাতে আগে Review, Payment আর Booking মোছা হয়: DELETE 2, DELETE 2, DELETE 3, তারপর Customer এর DELETE 1। confirmed আয় 423600.00 থেকে নেমে আসে 379600.00 এ, আর হিসাবরক্ষক ব্যাংকের 44000.00 টাকার সাথে মেলানোর মতো কোনো Row খুঁজে পান না।",
                  withIt:
                    "আপনি Customer কে মোছেন না, তাঁর Row এ deleted_at এ সময় বসান, আর নাম, Email আর ফোনের জায়গায় পরিচয়হীন মান বসিয়ে দেন। Booking আর Payment যেমন ছিল তেমন থাকে, আয়ের Report 423600.00 ই দেখায়, আর Website তাঁকে আর দেখায় না।",
                  lessons: ["DELETE and Soft Delete"],
                },
                {
                  id: "import-twice",
                  label: "দুইবার চলা Import",
                  situation:
                    "তিনজন নতুন গাইডের তালিকা Import Script দিয়ে ঢোকানো হচ্ছে। প্রথমবার Network Timeout, Script নিজে থেকে আবার চলে, অথচ প্রথমবারের তিনটা Row আসলে ঢুকে গিয়েছিল।",
                  without:
                    "guides এ আটজনের জায়গায় এগারোজন। Habib Rahman এর দুইটা Row, guide_id 6 আর 9। কোন ট্যুরে কোন Habib, আর কোনটা মুছলে নিরাপদ, কেউ নিশ্চিত নন।",
                  withIt:
                    "phone Column এ UNIQUE নিয়ম আর Script এ INSERT ... ON CONFLICT (phone) DO NOTHING। দ্বিতীয়বার চললে psql জানায় INSERT 0 0, গাইড আটজনই থাকেন। Script যতবার খুশি চলুক, ফল একই।",
                  lessons: ["Upsert: ON CONFLICT and ON DUPLICATE KEY"],
                },
                {
                  id: "partner-csv",
                  label: "Partner এর বিশাল CSV",
                  situation:
                    "একটা Partner এজেন্সি তাঁদের কয়েক হাজার Customer এর তালিকা CSV File এ পাঠিয়েছেন। File এর কোথাও কোথাও তারিখের ঘর ফাঁকা, আর একটা লাইনে তারিখ উল্টো লেখা।",
                  without:
                    "একটা Script প্রতিটা লাইনের জন্য আলাদা INSERT চালায়, প্রতিটা নিজে নিজে Commit হয়। মাঝপথে উল্টো তারিখের লাইনে Script থামে। অর্ধেক Customer ঢুকে আছেন, অর্ধেক নেই, আর আবার চালালে প্রথম অর্ধেক দুইবার ঢোকে।",
                  withIt:
                    "আপনি COPY দিয়ে File টা আগে একটা Staging Table এ আনেন, যেখানে খারাপ লাইন খুঁজে ঠিক করেন। তারপর এক Transaction এ INSERT ... SELECT দিয়ে আসল Table এ। কোথাও Error হলে কিছুই ঢোকে না, অর্ধেক অবস্থা বলে কিছু থাকে না।",
                  lessons: ["Bulk Loading with COPY and CSV"],
                },
                {
                  id: "old-numbers",
                  label: "পুরনো নম্বরসহ আনা Data",
                  situation:
                    "পুরনো Software থেকে 25 জন Customer আনা হলো, তাঁদের পুরনো নম্বর 16 থেকে 40 সহ। পরের সকালে Website এ নতুন Sign-up শুরু হলো।",
                  without:
                    "প্রথম পঁচিশটা Sign-up থামে duplicate key value violates unique constraint \"customers_pkey\" দিয়ে, DETAIL এ Key (customer_id)=(16), তারপর 17, এভাবে প্রতিবার পরের নম্বরে। ছাব্বিশতম জন প্রথম সফল হন, নম্বর 41 নিয়ে।",
                  withIt:
                    "আপনি জানেন নম্বর দেয় একটা Sequence, যে আনা Row গুলোর খবর রাখে না। Data আনার সাথে সাথে setval দিয়ে Sequence কে সবচেয়ে বড় নম্বর 40 এ বসান, আর প্রথম নতুন Sign-up ই পায় 41।",
                  lessons: ["Generated Columns and Sequences", "Bulk Loading with COPY and CSV"],
                },
                {
                  id: "highlighted-line",
                  label: "শুধু হাইলাইট করা অংশ",
                  situation:
                    "একটা GUI Tool এ দুই লাইনের UPDATE লেখা, প্রথম লাইনে SET, দ্বিতীয় লাইনে WHERE region = 'Chattogram'। তাড়ায় শুধু প্রথম লাইনটা হাইলাইট করে চালানো হলো।",
                  without:
                    "Tool শুধু হাইলাইট করা অংশটাই পাঠায়, মানে WHERE ছাড়া UPDATE। উত্তর আসে UPDATE 9, আর কাজটা সাথে সাথে স্থায়ী। ততক্ষণে Website নয়টা ট্যুরেরই নতুন দাম দেখাচ্ছে।",
                  withIt:
                    "আপনি ঝুঁকির লেখা সবসময় BEGIN দিয়ে শুরু করেন। UPDATE 9 দেখে বোঝেন ছয় হওয়ার কথা, ROLLBACK চালান, আর বাইরের কেউ কিছু টের পান না। MySQL এ sql_safe_updates চালু থাকলে এমন UPDATE ঢোকার আগেই ERROR 1175 এ থামে।",
                  lessons: ["UPDATE Without WHERE, and Recovery"],
                },
              ]}
              footer="প্রতিটা ঘটনার সংখ্যা আর Error Island Tours এর Sample Database এ PostgreSQL 18 এ সত্যি চালিয়ে পাওয়া, আর MySQL এর অংশ MySQL 8.4 এ। MySQL এ আর কোথায় কী আলাদা, সেটা নিচে How to Study অংশে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এর বাইরেও কয়েকটা জায়গায় এই মডিউল নিয়মিত কাজে আসে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Admin Panel এর প্রতিটা বোতাম।</strong> Save, Edit, Cancel, Delete, প্রতিটা বোতামের পেছনে এই
                  মডিউলের একটা Command। বোতামটা কয়টা Row বদলায়, সেটা আপনিই ঠিক করেন।
                </ListItem>
                <ListItem>
                  <strong>Data ঠিক করার Script।</strong> পুরনো ভুল Data শুধরানো, নতুন Column এ পুরনো Row গুলোর মান
                  ভরা, যাকে দলে Backfill বলে। এগুলো প্রায় সবসময় বড় UPDATE, আর ঠিক এখানেই WHERE এর ভুল সবচেয়ে দামি।
                </ListItem>
                <ListItem>
                  <strong>Import আর Export।</strong> Partner এর File আনা, হিসাবরক্ষকের জন্য মাসের Payment CSV তে বের
                  করা, Test Server এ নকল Data ভরা।
                </ListItem>
                <ListItem>
                  <strong>রাতের জরুরি ফোন।</strong> কেউ ভুল কিছু বদলে ফেলেছেন, আর প্রথম প্রশ্ন: কোন Row, কয়টা, কখন, আর
                  কীভাবে ফেরানো যায়। এই মডিউলের শেষ লেসন ঠিক এই মুহূর্তের জন্য।
                </ListItem>
                <ListItem>
                  <strong>Interview।</strong> Upsert কীভাবে করবেন, DELETE আর Soft Delete এর পার্থক্য, আরেকটা Table
                  দেখে UPDATE, আর WHERE ছাড়া UPDATE চালিয়ে ফেললে কী করবেন। Backend Interview এর খুব পরিচিত প্রশ্ন।
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
      title: <SectionTitle>একটা Booking এর পেছনে চারটা লেখা</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Website এ একজন Customer যখন Book Now চাপেন, তাঁর চোখে সেটা একটা কাজ। Database এর চোখে সেটা কয়েকটা
                আলাদা লেখা, আর প্রতিটা আলাদা Table এ। Imran Kabir এখনো কোনো Booking করেননি, Sample Database এ তিনিই
                সেই Customer। ধরুন আজ সকালে তিনি Sajek Valley Cloud Trip এর 11 December 2026 এর Departure এ দুইটা সিট
                নিলেন, দাম 2 × 9500.00 = 19000.00 টাকা, আর bKash এ টাকা দিলেন। তাতে চারটা লেখা হয়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>bookings এ নতুন Row,</strong> status pending, আর RETURNING দিয়ে নতুন Booking এর নম্বর।
                </ListItem>
                <ListItem>
                  <strong>departures এ সিট কমানো,</strong> seats_left থেকে দুই বাদ। pending Booking ও সিট ধরে রাখে,
                  Sample Data তে ঠিক তাই হিসাব করা।
                </ListItem>
                <ListItem>
                  <strong>payments এ নতুন Row,</strong> যার booking_id আর টাকার অঙ্ক আসে ঠিক আগে ঢোকানো Booking থেকেই,
                  INSERT ... SELECT দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>bookings এর status বদল,</strong> pending থেকে confirmed।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে চারটা লেখাই সত্যি চলে, প্রতিটা RETURNING দিয়ে নিজের ফল দেখায়। কিন্তু পুরোটা BEGIN আর
                ROLLBACK এর মধ্যে, তাই শেষে সব ফিরে যায়, আর শেষ লাইনের গোনা প্রমাণ করে Sample Table আগের মতোই আছে।
                এই পাতার অন্য বক্সগুলোর সংখ্যা তাই বদলায় না। এখানেও Syntax এখনই জানার দরকার নেই, Run চাপুন আর চারটা
                ফল মিলিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Imran Kabir এর Booking: চারটা লেখা, তারপর ROLLBACK"
              query={`BEGIN;
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt, booked_at)
VALUES (15, 12, 2, 'pending', 19000.00, '2026-11-01 10:30:00+06')
RETURNING booking_id, customer_id, seats, status, total_bdt;
UPDATE departures
SET seats_left = seats_left - 2
WHERE departure_id = 12
RETURNING departure_id, starts_on, seats_left;
INSERT INTO payments (booking_id, amount_bdt, method, status, paid_at)
SELECT booking_id, total_bdt, 'bkash', 'paid', '2026-11-01 10:34:00+06'
FROM bookings
WHERE customer_id = 15 AND departure_id = 12
RETURNING payment_id, booking_id, amount_bdt, method;
UPDATE bookings
SET status = 'confirmed'
WHERE customer_id = 15 AND departure_id = 12
RETURNING booking_id, status;
ROLLBACK;
SELECT (SELECT count(*) FROM bookings) AS bookings,
       (SELECT count(*) FROM payments) AS payments,
       (SELECT seats_left FROM departures WHERE departure_id = 12) AS seats_left;`}
              caption={`প্রথম RETURNING দেখায় নতুন Booking এর নম্বর 25, status pending, টাকা 19000.00। দ্বিতীয়টায় Departure 12, তারিখ 2026-12-11, seats_left 18 থেকে কমে 16। তৃতীয়টায় Payment নম্বর 20, booking_id 25, টাকা 19000.00, bkash। চতুর্থটায় Booking 25 এখন confirmed। তারপর ROLLBACK, আর শেষ গোনা বলছে bookings 24, payments 19, seats_left 18: Sample Table ঠিক আগের মতো। এবার বক্সটা আরেকবার চালান। এবার Booking এর নম্বর 26 আর Payment এর 21, কারণ ROLLBACK Row ফেরায়, কিন্তু Sequence থেকে নেওয়া নম্বর ফেরায় না। কেন, সেটা লেসন ৬ এ। পাতাটা নতুন করে খুললে Database ও নতুন করে শুরু হয়, তখন আবার 25।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বক্সের প্রতিটা অংশ এই মডিউলের কোনো না কোনো লেসনের বিষয়, আর একটা অংশ পরের মডিউলের:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>INSERT ... RETURNING booking_id</code>: নতুন Row আর তার নম্বর এক ধাপে।
                  লেসন ১।
                </ListItem>
                <ListItem>
                  <code className={CODE}>SET seats_left = seats_left - 2</code>: পুরনো মান থেকে হিসাব করে বদল, আর
                  WHERE দিয়ে শুধু একটা Departure। লেসন ২।
                </ListItem>
                <ListItem>
                  <code className={CODE}>INSERT ... SELECT</code>: অন্য Query এর ফল দিয়ে নতুন Row, কোনো নম্বর হাতে
                  টাইপ না করে। লেসন ১।
                </ListItem>
                <ListItem>
                  <code className={CODE}>status = &apos;confirmed&apos;</code>: Booking এর জীবনের একটা ধাপ। আর
                  Booking বাতিল হলে Row মোছা হয় না, status হয় cancelled, যেমন Sample Data এর তিনটা Booking। এই ভাবনা
                  লেসন ৩ এ।
                </ListItem>
                <ListItem>
                  <code className={CODE}>BEGIN ... ROLLBACK</code>: চারটা লেখা হয় একসাথে টিকবে, নয়তো একটাও নয়। এখানে
                  শুধু ফেরানোর জন্য ব্যবহার, পুরো গল্প, মানে একই সিট দুইজন একসাথে চাইলে কী হয়, Module 12 এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>এই মডিউলে আপনি নিজে যা যা করবেন:</ContentParagraph>
              <ContentList>
                <ListItem>
                  INSERT এর পরে RETURNING দিয়ে নতুন id নেবেন, আর সেই id দিয়ে পরের Row ঢোকাবেন।
                </ListItem>
                <ListItem>
                  প্রতিটা UPDATE আর DELETE এর আগে একই WHERE দিয়ে SELECT চালাবেন, আর পরে উত্তরের সংখ্যা মেলাবেন।
                </ListItem>
                <ListItem>একটা Customer কে সত্যিই মুছবেন, আরেকজনকে শুধু চিহ্ন দিয়ে লুকাবেন, আর দুইটার তফাত গুনবেন।</ListItem>
                <ListItem>একই Upsert দুইবার চালিয়ে দেখবেন দ্বিতীয়বার কিছুই বদলায় না।</ListItem>
                <ListItem>
                  একটা CSV File COPY দিয়ে আনবেন, আর Data আনার পরে Sequence ঠিক করে নতুন Row ঢোকাবেন।
                </ListItem>
                <ListItem>
                  একটা কপি Table এ ইচ্ছা করে WHERE ছাড়া UPDATE চালাবেন, প্রথমে BEGIN এর ভেতরে, তারপর ফেরানোর অনুশীলন।
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
                "INSERT এ Column এর নাম না লিখে শুধু মানের তালিকা দেন, Column এর ক্রম মনে আছে ভেবে",
                "নতুন Row এর id জানতে আলাদা একটা SELECT max(id) চালান",
                "UPDATE আর DELETE সরাসরি লেখেন, আগে কোন Row গুলো বদলাবে না দেখে",
                "PostgreSQL কয়টা Row বদলাল, সেই সংখ্যাটা খেয়াল করেন না",
                "Foreign Key এর Error সরাতে বাঁধা Row গুলো আগে মুছে দেন",
                "থাকলে বদলানো আর না থাকলে ঢোকানোর কাজ দুইটা আলাদা Query তে করেন",
                "বড় File আনেন লাইন ধরে ধরে INSERT দিয়ে, আর মাঝপথে থামলে কী হয় জানেন না",
                "ভুল UPDATE চালিয়ে ফেললে প্রথম চিন্তা Backup থেকে সব ফেরানো",
              ]}
              after={[
                "প্রতিটা INSERT এ Column এর নাম লেখেন, আর DEFAULT এর কাজ Database কে করতে দেন",
                "RETURNING দিয়ে নতুন id আর বদলানো Row সেই Statement থেকেই ফেরত নেন",
                "আগে একই WHERE দিয়ে SELECT চালিয়ে Row গুলো দেখেন, তারপর লেখেন",
                "UPDATE 6 এর মতো উত্তরের সংখ্যা প্রত্যাশার সাথে মেলান, না মিললে থামেন",
                "মুছবেন না চিহ্ন দেবেন, কারণসহ ঠিক করেন, আর হিসাবের Row কখনো মোছেন না",
                "ON CONFLICT দিয়ে এমন লেখা লেখেন, যা দুইবার চললেও একই ফল দেয়",
                "COPY আর Staging Table দিয়ে বড় File আনেন, আর পরে Sequence ঠিক করেন",
                "ঝুঁকির লেখা BEGIN এর ভেতরে চালান, আর ভুল হলে প্রথমে ROLLBACK এর কথা ভাবেন",
              ]}
              footer="বাঁ দিকের প্রায় প্রতিটা অভ্যাস অভিজ্ঞ Developer দেরও একসময় ছিল, আর অনেকে সেটা শিখেছেন একটা খারাপ রাতের পরে। মডিউল শেষে ডান দিকের তালিকাটা দিয়ে নিজেকে যাচাই করুন, আর যেটায় দ্বিধা থাকে, তার লেসনে আবার ফিরে যান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলের মানদণ্ড হলো যেকোনো লেখার কাজ চারটা প্রশ্নের উত্তরসহ করতে পারা। ধরুন ফারুক সাহেব বললেন,
                Sylhet এর সব ট্যুর এক মাসের জন্য বন্ধ। আপনি বলবেন: কোন Row, যে ট্যুরগুলোর destination এর region
                Sylhet। কয়টা, আগে SELECT চালিয়ে দেখি, দুইটা: Sylhet Tea Garden Tour আর Ratargul Swamp Boat Day। বদলের
                পরে কেমন দেখাবে, RETURNING দিয়ে দেখি দুইটার is_active এখন false। আর ভুল হলে কীভাবে ফেরাব, পুরোটা BEGIN
                এর ভেতরে, উত্তর UPDATE 2 না হলে ROLLBACK।
              </ContentParagraph>
              <ContentParagraph>
                এটা পারলে আপনি লেখার Command কে আর ভয় পাবেন না, আবার হালকাভাবেও নেবেন না। আপনি জানবেন ঠিক কোন জায়গায়
                ভুল ঢোকে, আর প্রতিটা জায়গায় একটা করে পাহারা বসাতে পারবেন।
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
                <strong>আগে যা লাগবে।</strong> Module 09 এর তিনটা লেসন সবচেয়ে জরুরি:{" "}
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  NOT NULL, DEFAULT, UNIQUE and CHECK
                </Link>
                , কারণ প্রতিটা INSERT এর Error ওই নিয়মগুলো থেকেই আসে;{" "}
                <Link href="/sql/topic/primary-keys" className={LINK}>
                  Primary Keys: Identity, Serial, UUID
                </Link>
                , কারণ id এর নম্বর আর Sequence এর ভিত্তি সেখানে; আর{" "}
                <Link href="/sql/topic/foreign-keys" className={LINK}>
                  Foreign Keys and ON DELETE
                </Link>
                , কারণ DELETE এর লেসন তার উপর দাঁড়ায়। Module 09 এর{" "}
                <Link href="/sql/topic/drop-truncate-delete" className={LINK}>
                  DROP vs TRUNCATE vs DELETE
                </Link>{" "}
                লেসনে DELETE এর প্রথম পরিচয় হয়েছিল, এখানে সেটা পূর্ণ রূপে। আর Module 07 এর{" "}
                <Link href="/sql/topic/correlated-subqueries" className={LINK}>
                  Correlated Subqueries
                </Link>{" "}
                আর{" "}
                <Link href="/sql/topic/ctes" className={LINK}>
                  CTEs with WITH
                </Link>
                , কারণ INSERT ... SELECT আর আরেকটা Table দেখে UPDATE এর ভেতরে ঠিক সেই Query গুলোই বসে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>সময় আর ক্রম।</strong> পুরো মডিউলের জন্য তিন চার দিন ধরে রাখুন। সাতটা লেসন পড়তে মোট প্রায়
                তিন ঘণ্টা দশ মিনিট থেকে চার ঘণ্টা বিশ মিনিট লাগে, আর লেসন ২ আর ৪ এ একটু বেশি সময় রাখুন, কারণ আরেকটা
                Table দেখে UPDATE আর Upsert এর নিয়মগুলো নিজে চালিয়ে না দেখলে মনে থাকে না। লেসন ১, ২ আর ৩ ক্রম ধরে পড়ুন।
                ৪, ৫ আর ৬ যেকোনো ক্রমে চলে, তবে ৫ এর পরে ৬ পড়লে Sequence ঠিক করার কারণটা বেশি পরিষ্কার হয়। ৭ সবার শেষে,
                কারণ সেখানে আগের সবকিছু একসাথে লাগে, আর তাতেই পুরো মডিউলের Recap।
              </ContentParagraph>
              <ContentParagraph>
                <strong>আগে SELECT, তারপর লেখা।</strong> এই মডিউলের সবচেয়ে বড় অনুশীলন একটা অভ্যাস। প্রতিটা UPDATE বা
                DELETE লেখার আগে একই FROM আর WHERE দিয়ে একটা SELECT লিখুন, চালান, Row গুলো গুনুন। তারপর শুধু প্রথম
                লাইনটা বদলান: SELECT * এর জায়গায় UPDATE ... SET বা DELETE। WHERE অংশে একটা অক্ষরও না ছুঁয়ে। উত্তরের
                সংখ্যা যদি SELECT এর সংখ্যার সাথে না মেলে, থামুন, কারণ কোথাও কিছু ভুল আছে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Query বক্স আর অনুশীলন।</strong> এই মডিউলের বক্সগুলো সত্যি সত্যি লেখে, তাই তিনটা নিয়ম জেনে
                রাখুন। প্রথম, একই পাতার সব বক্স একটাই Database ভাগ করে, তাই এক বক্সের বদল পরের বক্স দেখে। সেজন্য
                Sample Table বদলানো প্রতিটা বক্স BEGIN দিয়ে শুরু আর ROLLBACK দিয়ে শেষ, যেমন উপরের Imran Kabir এর বক্স,
                আর অবাধে বদলানোর কাজ হয় লেসনের নামের ছোট অংশ দিয়ে শুরু হওয়া কপি Table এ, যেমন এই পাতার ov_tours।
                দ্বিতীয়, প্রতিটা লেসনের পাতা নিজের নতুন Sample Database পায়, তাই এক লেসনে যা বদলাবেন, পরের লেসনে তার
                কোনো ছাপ থাকবে না, আর পাতা নতুন করে খুললেও সব আগের মতো। তৃতীয়, কোনো Statement দশ সেকেন্ডের বেশি
                চললে বক্স Database নতুন করে শুরু করে, তখন এই পাতায় বানানো কপিগুলোও চলে যায়, বক্সগুলো আবার চালালেই
                ফিরে আসে। লেখার অনুশীলনে শুরুর Code একটা কপি Table বানায়, তারপর আপনার INSERT, UPDATE বা DELETE এর জন্য
                জায়গা, আর শেষে একটা যাচাইয়ের Query। আপনার লেখা মাঝখানে বসান, যাচাইয়ের Query টা শেষ লাইনেই রাখুন, কারণ
                বক্স সেটার ফলাফলই সমাধানের সাথে মেলায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>MySQL এর ভিডিও দেখছেন?</strong> এই পাতার দুইটা কাজ MySQL 8.4 এ চালিয়ে দেখা হয়েছে। ov_tours এর
                মতো কপিতে WHERE ছাড়া UPDATE এর উত্তর এসেছে Query OK, 9 rows affected, তার নিচে Rows matched: 9 Changed:
                9 Warnings: 0, মানে MySQL ও কোনো প্রশ্ন করে না। কিন্তু{" "}
                <code className={CODE}>SET sql_safe_updates = 1</code> চালানোর পরে একই UPDATE থেমেছে ERROR 1175 এ: You
                are using safe update mode and you tried to update a table without a WHERE that uses a KEY column।
                মজার ব্যাপার, কপি Table এ WHERE region = &apos;Chattogram&apos; দিয়েও একই Error এসেছে, কারণ region এ
                কোনো Index নেই। আসল tours এ WHERE destination_id IN (1, 2, 4, 5) চলেছে, কারণ Foreign Key এর জন্য MySQL
                ওই Column এ নিজেই Index বানিয়েছিল, আর ছয়টা Row বদলেছে। আরেকটা পার্থক্য: INSERT এর শেষে RETURNING
                লিখলে MySQL 8.4 দিয়েছে ERROR 1064, Syntax Error। MySQL এ নতুন id জানার উপায় LAST_INSERT_ID(), আর Upsert
                এর উপায় ON DUPLICATE KEY UPDATE, দুইটাই এই মডিউলের লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>আটকে গেলে।</strong> লেখার Error এ প্রথমে নিয়মের নামটা পড়ুন, যেমন customers_pkey মানে customers
                এর Primary Key, bookings_customer_id_fkey মানে bookings এর customer_id এর Foreign Key। তারপর DETAIL
                পড়ুন, সেখানে ঠিক কোন মানটা সমস্যা, লেখা থাকে। কোনো লেখা অদ্ভুত সংখ্যা দিলে, যেমন UPDATE 0, তাহলে
                WHERE অংশটা আলাদা করে SELECT হিসেবে চালান, প্রায় সবসময় দেখবেন শর্তটা আপনার ভাবনার চেয়ে কম বা বেশি Row
                ধরছে। আর একটা বক্স ভুল অবস্থায় চলে গেলে পাতাটা নতুন করে খুলুন, Database একদম শুরু থেকে আসবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>পরের ধাপ।</strong> এখান থেকে সোজা চলে যান প্রথম লেসনে,{" "}
                <Link href="/sql/topic/insert" className={LINK}>
                  INSERT and RETURNING
                </Link>
                , যেখানে আপনি প্রথমবার নিজের হাতে Row ঢোকাবেন, আর নতুন Row এর নম্বরটা সাথে সাথে ফেরত পাবেন।
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
        "INSERT and RETURNING",
        "Column এর নামসহ এক বা অনেক Row ঢোকানো, অন্য Query এর ফল দিয়ে ঢোকানো, আর RETURNING দিয়ে নতুন id সেই Statement থেকেই নেওয়া",
      ],
      [
        "UPDATE",
        "WHERE ঠিক করে কোন Row বদলাবে, আরেকটা Table দেখে বদলানো যায়, আর বদলের আগে SELECT ও পরে উত্তরের সংখ্যা মেলানো জরুরি",
      ],
      [
        "DELETE and Soft Delete",
        "DELETE Row মুছে ফেলে আর Foreign Key তাকে আটকায় বা সাথে টানে, আর অনেক সময় মোছার বদলে deleted_at দিয়ে চিহ্ন রাখাই ঠিক",
      ],
      [
        "Upsert: ON CONFLICT and ON DUPLICATE KEY",
        "থাকলে বদলানো আর না থাকলে ঢোকানো এক Statement এ, একটা UNIQUE নিয়মের উপর ভর করে, তাই দুইবার চললেও ফল একই",
      ],
      [
        "Bulk Loading with COPY and CSV",
        "COPY এক Command এ পুরো File আনে বা বের করে, আর খারাপ লাইনের File আগে Staging Table এ এনে যাচাই করতে হয়",
      ],
      [
        "Generated Columns and Sequences",
        "কিছু Column নিজে থেকে হিসাব হয়, id আসে Sequence থেকে, নম্বরে ফাঁক স্বাভাবিক, আর পুরনো নম্বরসহ Data আনার পরে setval লাগে",
      ],
      [
        "UPDATE Without WHERE, and Recovery",
        "সবচেয়ে ভয়ের ভুলটা কয়েকটা অভ্যাসে আটকানো যায়, আর ঘটলে প্রথম ভরসা খোলা Transaction এর ROLLBACK, শেষ ভরসা Backup",
      ],
    ],
  },
};
