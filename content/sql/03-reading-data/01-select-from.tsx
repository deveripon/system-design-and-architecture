import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlExercise } from "../../../components/course/sql/sql-exercise";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  AliasLab,
  ColumnPickerLab,
  SpotTheBugLab,
} from "../../../components/course/topics/reading-data/select-animations";
import {
  NameLevelsDiagram,
  ProjectionDiagram,
  RowByRowDiagram,
  SelectAnatomyDiagram,
} from "../../../components/course/topics/reading-data/select-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.9em] text-foreground";

export const selectFromContent: TopicData = {
  id: "select-from",
  introduction: {
    badge: "MODULE 03 · LESSON 01",
    title: <SectionTitle>SELECT আর FROM: Database কে প্রথম প্রশ্ন</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          দুই মডিউল ধরে আপনি Database চিনেছেন, নিজের মেশিনে PostgreSQL বসিয়েছেন, psql
          খুলেছেন, আর Island Tours এর Data Load করেছেন। এতদিন Query বক্সে আমরা বলেছি,
          শুধু Run চাপুন আর দেখুন, লেখার নিয়ম পরে আসবে। সেই পরে এখন। এই লেসন থেকে
          Query আপনি নিজে লিখবেন।
        </ContentParagraph>
        <ContentParagraph>
          শুরু হচ্ছে SQL এর সবচেয়ে বেশি লেখা বাক্য দিয়ে: SELECT। পৃথিবীর প্রায় প্রতিটা
          App এ প্রতি সেকেন্ডে হাজার হাজার SELECT চলে। ট্যুরের তালিকা দেখানো, Customer
          খোঁজা, মাস শেষের হিসাব, সবকিছুর শুরু এখানে। আজ আপনি শিখবেন একটা Table থেকে
          কোন কোন Column নেবেন, সেগুলো দিয়ে কীভাবে নতুন হিসাব বানাবেন, ফলাফলের Column
          কে কীভাবে নাম দেবেন, আর কোন ছোট্ট ভুল কোনো Error না দেখিয়েই ভুল উত্তর দেয়।
        </ContentParagraph>
        <ContentParagraph>
          পুরো লেসনে বারোটা Query বক্স আর ছয়টা অনুশীলন আছে। অনুশীলনে আপনি নিজে Query
          লিখবেন, Check চাপলে আসল PostgreSQL আপনার উত্তর যাচাই করে দেবে। পড়ার চেয়ে
          লেখায় বেশি সময় দিন। SQL হাত দিয়ে শেখার জিনিস।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "রেস্টুরেন্টে মেনু দেখে আপনি বলেন, ভাত আর ডাল দিন। পুরো রান্নাঘর চান না, পুরো মেনুও না, শুধু যা দরকার। SELECT ঠিক এভাবে কথা বলে: কোন Table থেকে, কোন কোন Column।",
      author: "SELECT",
      role: "Lesson 01",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>মালিকের প্রথম প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সোমবার সকাল। Island Tours এর মালিক রুমানা আপা নতুন Brochure ছাপাবেন। তিনি
                আপনাকে ডেকে বললেন: আমাদের সব ট্যুরের নাম আর দাম একটা তালিকায় দিন তো।
                আপনি জানেন তথ্যটা আছে tours Table এ। Table এ নয়টা ট্যুর, আর প্রতিটা ট্যুরের
                নয়টা Column: নম্বর, নাম, কোন জায়গায়, কোন Guide, কত দিন, দাম, কত সিট, চালু
                কিনা, কবে যোগ হয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                রুমানা আপার দরকার এর মধ্যে মাত্র দুটো Column: নাম আর দাম। বাকি সাতটা দেখালে
                তালিকা ভারী হবে, আর guide_id এর মতো নম্বর তাঁর কোনো কাজেও লাগবে না। তাহলে
                Database কে আপনি বলবেন ঠিক এটুকু: tours Table থেকে title আর price_bdt চাই।
                SQL এ সেই কথাটা লিখলে হয়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "first-question.sql",
          code: `SELECT title, price_bdt
FROM tours;`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রায় ইংরেজি বাক্যের মতো পড়া যায়: Select title and price, from tours। এটাই
                SQL এর বড় সুবিধা, যেটা Module 01 এর Lesson 05 এ দেখেছেন: আপনি বলেন কী চান,
                কীভাবে খুঁজে আনবে সেটা Database এর মাথাব্যথা। আপনাকে বলতে হয় না কোন ফাইলের
                কোন জায়গা থেকে পড়বে, কয়টা Row আছে, বা কোন ক্রমে পড়বে।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনে আমরা এই ছোট্ট বাক্যটাকে টুকরো টুকরো করে দেখব। প্রতিটা অংশ কী করে,
                কোথায় নিয়ম কড়া আর কোথায় ঢিলা, আর কোন কোন ভাবে এটাকে বড় করা যায়। Row ছাঁকা,
                মানে শুধু কিছু ট্যুর বেছে নেওয়া, আজকের বিষয় না, সেটা Lesson 03 এর WHERE।
                আজ আমরা সব Row নেব, আর ঠিক করব কোন Column দেখাব আর কীভাবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই লেসনের Query কোথায় চালাবেন",
          content: (
            <ContentParagraph>
              দুই জায়গাতেই চলে। লেসনের ভেতরের Query বক্সে আসল PostgreSQL চলছে, Sample
              Database সহ, কিছু ইনস্টল ছাড়াই। আর Module 02 শেষ করে থাকলে নিজের Terminal এ
              psql -d island_tours খুলে একই Query লিখে দেখুন। দুই জায়গায় একই উত্তর আসবে,
              শুধু psql সংখ্যাগুলো ডান দিকে সাজিয়ে দেখায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "anatomy",
      subHeader: { index: "002", title: "Anatomy" },
      title: <SectionTitle>পাঁচ টুকরোর একটা বাক্য</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <SelectAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>SELECT</strong> একটা Keyword, মানে SQL এর নিজের সংরক্ষিত শব্দ।
                  Database কে জানায় এটা পড়ার বাক্য, কিছু বদলানোর না।
                </ListItem>
                <ListItem>
                  <strong>SELECT list</strong> হলো SELECT আর FROM এর মাঝের অংশ: কোন কোন
                  Column চাই, কমা দিয়ে আলাদা করা। একটা হতে পারে, দশটাও হতে পারে।
                </ListItem>
                <ListItem>
                  <strong>FROM</strong> আরেকটা Keyword, যার পরে আসে Table এর নাম। এই অংশকে
                  বলে FROM Clause। Clause মানে বাক্যের একটা অংশ, যার নিজের একটা কাজ আছে।
                </ListItem>
                <ListItem>
                  <strong>tours</strong> হলো যে Table থেকে পড়ব। Module 02 এর Lesson 05 এর
                  কথা মনে করুন: শুধু tours লিখলেও PostgreSQL search_path ধরে public.tours
                  খুঁজে পায়।
                </ListItem>
                <ListItem>
                  <strong>Semicolon (;)</strong> বাক্যের দাঁড়ি। psql এ Semicolon না দিলে
                  Query যায়ই না, psql অপেক্ষা করে আরও লেখার। Query বক্সে একটা Query হলে
                  Semicolon না দিলেও চলে, তবু অভ্যাসটা রাখুন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে Run চাপুন। তারপর title আর price_bdt এর জায়গা বদলে, বা
                duration_days যোগ করে আবার চালান। কিছু ভাঙবে না, Reset চাপলে সব আগের মতো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম SELECT"
              query={`SELECT title, price_bdt
FROM tours;`}
              caption="নয়টা Row, দুটো Column। রুমানা আপার তালিকা তৈরি। লক্ষ করুন বন্ধ হয়ে যাওয়া Saint Martin Luxury Stay ও আছে, কারণ আমরা কোনো ট্যুর বাদ দিতে বলিনি। বাদ দেওয়া শিখবেন Lesson 03 এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "বড় হাত, ছোট হাত, লাইন ভাঙা",
          content: (
            <ContentParagraph>
              SQL এর Keyword বড় বা ছোট যেকোনো হাতে লেখা যায়: SELECT, select, Select সব এক।
              Quote ছাড়া Table আর Column এর নামও PostgreSQL ছোট হাতের অক্ষরে বদলে নেয়, তাই
              TOURS লিখলেও tours পায়। আর পুরো Query এক লাইনে লিখুন বা দশ লাইনে, Database এর
              কাছে একই। এই ট্র্যাকে Keyword বড় হাতে আর নাম ছোট হাতে লেখা হবে, শুধু পড়ার
              সুবিধার জন্য। Section 009 এ লেখার ধরন নিয়ে পুরো আলোচনা আছে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "star",
      subHeader: { index: "003", title: "SELECT *" },
      title: <SectionTitle>তারা চিহ্ন: সব Column একসাথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নতুন একটা Table হাতে পেলে প্রথম প্রশ্ন: এর ভেতরে কী আছে? প্রতিটা Column এর নাম
                জানা না থাকলে তালিকা বানাবেন কীভাবে? এর জন্য আছে তারা চিহ্ন, *। SELECT list
                এ * লিখলে মানে, সব Column চাই, Table এ যে ক্রমে বানানো হয়েছিল সেই ক্রমে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা Table এর পুরোটা দেখা"
              query={`SELECT *
FROM destinations;`}
              caption="সাতটা জায়গা, চারটা Column: destination_id, name, region, kind। Kuakata আছে, যদিও সেখানে এখনো কোনো ট্যুর নেই। destinations বদলে guides লিখে দেখুন, পাঁচজন Guide আর তাঁদের পাঁচটা Column আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঘুরে দেখার জন্য * চমৎকার। psql এ নতুন Database এ ঢুকে প্রথম কাজই হয় SELECT *
                FROM কোনো একটা Table, সাথে LIMIT দিয়ে কয়েকটা Row, যেটা Lesson 07 এ শিখবেন।
                কিন্তু App এর Code এ, মানে যে Query প্রতিদিন হাজারবার চলবে, সেখানে * প্রায়
                সবসময় ভুল সিদ্ধান্ত। তিনটা কারণ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>যা লাগে না তাও আসে।</strong> Website এর ট্যুর তালিকায় লাগে নাম আর
                  দাম। * পাঠাবে created_at, max_seats সবকিছু। নয়টা Row এ তফাত চোখে পড়ে না,
                  কিন্তু দশ লাখ Row আর বিশটা Column এ Network আর Memory দুটোই অকারণে খরচ হয়।
                </ListItem>
                <ListItem>
                  <strong>গোপন তথ্য বেরিয়ে যায়।</strong> customers Table এ phone আছে। আজ
                  SELECT * দিয়ে Support পাতা বানালেন। কাল কেউ Table এ password_hash Column
                  যোগ করলেন। আপনার Code এক অক্ষর না বদলেও সেই Column এখন সব জায়গায় যাচ্ছে।
                </ListItem>
                <ListItem>
                  <strong>Table বদলালে Code ভাঙে।</strong> * এর Column এর সংখ্যা আর ক্রম Table
                  এর উপর নির্ভর করে। কেউ একটা Column যোগ করলে বা সরালে, যে Code তিন নম্বর
                  Column কে দাম ধরে নিয়েছিল, সে চুপচাপ ভুল মান পড়বে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিয়মটা এক লাইনে",
          content: (
            <ContentParagraph>
              নিজে দেখার জন্য *, App এর জন্য Column এর নাম লিখে। এই ট্র্যাকে Island Tours এর API
              এর নিয়মও তাই: প্রতিটা Query তে Column এর নাম গুনে লেখা, কোথাও SELECT * না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "picking-columns",
      subHeader: { index: "004", title: "Picking Columns" },
      title: <SectionTitle>যে Column চাই, যে ক্রমে চাই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SELECT list এ আপনি যে Column গুলো যে ক্রমে লিখবেন, ফলাফল ঠিক সেভাবেই আসবে।
                Table এ title দুই নম্বর Column আর price_bdt ছয় নম্বর, কিন্তু আপনি
                price_bdt আগে লিখলে ফলাফলে দাম আসবে প্রথমে। Table এর ভেতরের ক্রম শুধু *
                এর জন্য গুরুত্বপূর্ণ।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ tours এর নয়টা Column আছে। যেগুলো চান সেগুলোয় চাপ দিন, যে ক্রমে
                চাপবেন সেই ক্রমে SELECT লেখা হবে আর ফলাফল সাজবে। নিচের Data হুবহু Sample
                Database এর।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ColumnPickerLab /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Column এর ক্রম আপনার হাতে"
              query={`SELECT city, full_name
FROM customers;`}
              caption="customers Table এ full_name আগে, city পরে। কিন্তু এখানে city আগে লেখা হয়েছে, তাই ফলাফলেও শহর আগে। পনেরোজন Customer, কারো একটাও বাদ যায়নি। এবার email যোগ করে তিনটা Column দেখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো ছোট কৌতূহল, যেগুলো প্রায়ই প্রশ্ন হয়ে আসে। এক, একই Column দুইবার চাওয়া
                যায়: SELECT title, title, tour_id FROM tours; চালালে title পাশাপাশি দুবার আসে,
                দুটোরই নাম title। কাজে খুব কম লাগে, কিন্তু এতে বোঝা যায় SELECT list আসলে
                একটা তালিকা মাত্র, প্রতিটা ঘর আলাদা করে ভরা হয়। দুই, Column এর নামের বানান
                Table এ যেমন আছে তেমনই হতে হবে, তবে বড় ছোট হাত Quote ছাড়া কোনো ব্যাপার না:
                TITLE আর title একই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  Support টিমের একটা তালিকা লাগবে: প্রতিটা Customer এর{" "}
                  <code className={CODE}>full_name</code>, <code className={CODE}>email</code>{" "}
                  আর <code className={CODE}>country</code>, ঠিক এই ক্রমে। সব Customer চাই।
                </>
              }
              hint={
                <>
                  Table এর নাম customers। SELECT এর পরে তিনটা Column কমা দিয়ে, তারপর FROM।
                </>
              }
              solution={`SELECT full_name, email, country
FROM customers;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "result-table",
      subHeader: { index: "005", title: "A New Table" },
      title: <SectionTitle>ফলাফলও একটা Table, তবে ক্ষণিকের</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SELECT এর উত্তর দেখতে একটা Table এর মতো: মাথায় Column এর নাম, নিচে Row। আসলেও
                তাই। SQL এর জগতে প্রতিটা Query এর ফলাফল একটা Table, যাকে বলে Result Set। শুধু
                তফাত এটুকু, এই Table কোথাও জমা থাকে না। তৈরি হয়, আপনার কাছে পাঠানো হয়, তারপর
                হারিয়ে যায়।
              </ContentParagraph>
              <ContentParagraph>
                তাই Column বাছাই করাকে ভাবুন খাড়া দিকে কাঁচি চালানো হিসেবে। বড় Table থেকে
                দুটো খাড়া ফালি কেটে নিয়ে নতুন একটা ছোট Table বানানো। আসল Table এর গায়ে একটা
                আঁচড়ও লাগে না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProjectionDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "SELECT কখনো কিছু বদলায় না",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                যত খুশি SELECT চালান, Table এর Data একটুও বদলাবে না। এই কারণে নতুন শেখার
                সময় SELECT সবচেয়ে নিরাপদ খেলার মাঠ। Data বদলানোর বাক্য আলাদা: INSERT,
                UPDATE, DELETE, যেগুলো Module 10 এ আসবে, আর সেখানে সাবধানতার নিয়মও আলাদা।
              </ContentParagraph>
              <ContentParagraph>
                আর ফলাফল যেহেতু একটা Table, পরের মডিউলগুলোতে দেখবেন একটা Query এর ফলাফলকে
                আরেকটা Query এর FROM এ বসানো যায়, ঠিক Table এর মতো। সেটা Module 07 এর
                Subquery। আজকের ভিত্তিটা সেখানেই কাজে লাগবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আসল Table এর মতো ফলাফলের প্রতিটা Column এরও একটা নাম আর একটা Type আছে। psql এ
                Query এর শেষে Semicolon এর বদলে \gdesc লিখলে Query চালানো হয় না, শুধু ফলাফলের
                Column গুলোর নাম আর Type দেখায়। নতুন হিসাবের Column কোন Type এর হলো, জানতে
                খুব কাজের:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql",
          code: `island_tours=# SELECT title, price_bdt * 2 AS couple_price, duration_days * 24 AS hours FROM tours \\gdesc
    Column    |  Type
--------------+---------
 title        | text
 couple_price | numeric
 hours        | integer
(3 rows)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              price_bdt ছিল numeric, তাই দুই দিয়ে গুণ করেও numeric। duration_days ছিল smallint,
              24 দিয়ে গুণ করে হয়েছে integer। Type কেন এত গুরুত্বপূর্ণ, আর টাকা কেন সবসময়
              numeric এ রাখা হয়, সেই পুরো গল্প Module 09 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "expressions",
      subHeader: { index: "006", title: "Expressions" },
      title: <SectionTitle>Column দিয়ে হিসাব: নতুন Column বানানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রুমানা আপা তালিকা দেখে বললেন, বেশিরভাগ মানুষ জোড়ায় যান। প্রতিটা ট্যুরে দুইজনের
                দামটাও পাশে দিন। Table এ দুইজনের দামের কোনো Column নেই, থাকার দরকারও নেই,
                কারণ সেটা price_bdt থেকেই হিসাব করা যায়। SELECT list এ শুধু Column এর নাম না,
                হিসাবও লেখা যায়। এমন হিসাবকে বলে Expression।
              </ContentParagraph>
              <ContentParagraph>
                যোগ (+), বিয়োগ (-), গুণ (*), ভাগ (/) আর ভাগশেষ (%), পাঁচটাই চলে। আর এখানে গুণের
                চিহ্নও সেই *। SELECT * এ তারাটা একা দাঁড়ায় বলে মানে সব Column, আর price_bdt * 2
                তে দুই পাশে কিছু আছে বলে মানে গুণ। Database প্রসঙ্গ দেখে বোঝে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RowByRowDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুইজনের দাম আর মোট ঘণ্টা"
              query={`SELECT title,
       price_bdt,
       price_bdt * 2,
       duration_days * 24
FROM tours;`}
              caption="Saint Martin Island Escape এর দাম 12500.00, দুইজনের 25000.00, আর তিন দিনে 72 ঘণ্টা। লক্ষ করুন নতুন দুটো Column এর নাম ?column?। আমরা নাম দিইনি, তাই PostgreSQL একটা সাধারণ নাম বসিয়েছে। নাম দেওয়া শিখবেন পরের Section এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা ছোট্ট ফাঁদ, যেটা স্কুলের অঙ্ক থেকেই চেনা। প্রতি জনের সাথে ৫০০ টাকা
                Service Charge যোগ হবে, আর দাম দেখাতে হবে দুইজনের। price_bdt * 2 + 500 লিখলে
                কী হয়? SQL অঙ্কের সেই পুরনো নিয়ম মানে: গুণ আর ভাগ আগে, যোগ আর বিয়োগ পরে। তাই
                এটা দুইজনের দামের সাথে একবারই ৫০০ যোগ করে। দুইজনের প্রত্যেকের জন্য ৫০০ চাইলে
                Bracket লাগবে: (price_bdt + 500) * 2।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Bracket এর দাম ৫০০ টাকা"
              query={`SELECT title,
       price_bdt * 2 + 500   AS couple_plus_fee,
       (price_bdt + 500) * 2 AS couple_each_fee
FROM tours;

SELECT 2 + 3 * 4, (2 + 3) * 4;`}
              caption="Saint Martin Island Escape এ প্রথম Column 25500.00, দ্বিতীয় 26000.00, পার্থক্য ঠিক ৫০০ টাকা। নিচের ছোট Query তে 14 আর 20। সন্দেহ হলেই Bracket দিন, বাড়তি Bracket কখনো ক্ষতি করে না, আর পরে যিনি পড়বেন তাঁর জন্য উদ্দেশ্যটা পরিষ্কার হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটু অস্বস্তির জায়গা। প্রতি দিনের দাম কত, জানতে চাইলেন রুমানা আপা।
                price_bdt কে duration_days দিয়ে ভাগ করলেই হয়। চালিয়ে দেখুন উত্তর কেমন আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতি দিনের দাম"
              query={`SELECT title,
       price_bdt / duration_days
FROM tours;`}
              caption="Saint Martin Island Escape: 4166.6666666666666667। হিসাব ঠিক, কিন্তু Brochure এ এভাবে ছাপানো যায় না। দুই ঘর দশমিকে গোল করা শিখবেন Module 04 এ, round দিয়ে। আজ শুধু মনে রাখুন, ভাগের উত্তরে এত দশমিক আসতে পারে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "হিসাব হয় প্রতিটা Row এ আলাদা করে",
          content: (
            <ContentParagraph>
              price_bdt * 2 মানে পুরো Column একসাথে গুণ না। PostgreSQL একটা একটা Row এর কাছে
              যায়, সেই Row এর price_bdt নিয়ে গুণ করে, তারপর পরের Row। নয়টা Row, নয়বার হিসাব।
              একটা Row এর হিসাব আরেকটা Row জানে না। সব Row মিলিয়ে একটা যোগফল বা গড়, সেটা
              আলাদা ধরনের কাজ, Module 05 এর SUM আর AVG।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              task={
                <>
                  Hotel বুক করতে রাত গুনতে হয়, দিন না। প্রতিটা ট্যুরের{" "}
                  <code className={CODE}>title</code>,{" "}
                  <code className={CODE}>duration_days</code>, আর কত রাত থাকতে হবে সেটা দেখান।
                  রাত সবসময় দিনের চেয়ে এক কম।
                </>
              }
              hint={
                <>
                  তিন নম্বর Column একটা Expression: duration_days থেকে 1 বিয়োগ। Ratargul Swamp
                  Boat Day এক দিনের, তাই সেখানে উত্তর 0 আসবে।
                </>
              }
              solution={`SELECT title, duration_days, duration_days - 1
FROM tours;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "aliases",
      subHeader: { index: "007", title: "Aliases" },
      title: <SectionTitle>AS: ফলাফলের Column কে নাম দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ?column? নাম দেখে রুমানা আপা বুঝবেন না কোনটা কী। আর দুটো ?column? পাশাপাশি থাকলে
                আপনিও গুলিয়ে ফেলবেন। Column কে নাম দিতে Expression এর পরে লিখুন AS আর নতুন
                নামটা। এই নামকে বলে Alias, মানে ডাকনাম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "alias.sql",
          code: `SELECT title,
       price_bdt * 2 AS couple_price
FROM tours;`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন দ্বিতীয় Column এর মাথায় লেখা থাকবে couple_price। কয়েকটা নিয়ম জানলে
                Alias নিয়ে কখনো আটকাবেন না:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>AS লেখা ঐচ্ছিক।</strong> price_bdt * 2 couple_price লিখলেও চলে।
                  তবু AS লিখুন, পড়তে পরিষ্কার, আর Section 010 এ দেখবেন AS বাদ দেওয়ার অভ্যাস
                  থেকে একটা বিপজ্জনক ভুল জন্মায়। PostgreSQL এর Docs ও বলে, কিছু নাম Keyword এর
                  সাথে মিলে গেলে AS লাগবেই।
                </ListItem>
                <ListItem>
                  <strong>Quote ছাড়া নাম ছোট হাতের হয়ে যায়।</strong> AS CouplePrice লিখলে
                  PostgreSQL নাম রাখে coupleprice। এটা Table এর নামের সেই একই নিয়ম।
                </ListItem>
                <ListItem>
                  <strong>Space বা বড় হাত রাখতে Double Quote।</strong> AS{" "}
                  {`"Couple Price"`} লিখলে নাম হুবহু থাকে, Space আর বড় হাত সহ। মানুষের পড়ার
                  Report এ কাজের।
                </ListItem>
                <ListItem>
                  <strong>Single Quote কখনো না।</strong> PostgreSQL এ Single Quote মানে লেখা
                  (Text), নাম না। AS {`'Couple Price'`} লিখলে Syntax Error। MySQL এটা মেনে
                  নেয়, তাই MySQL এর ভিডিও থেকে আসা Query এখানে প্রায়ই ভাঙে।
                </ListItem>
                <ListItem>
                  <strong>Alias শুধু ফলাফলের নাম।</strong> tours Table এর Column এর নাম একটুও
                  বদলায় না। Query শেষ, Alias ও শেষ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <AliasLab /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চার রকম নাম, একসাথে"
              query={`SELECT title,
       price_bdt * 2 AS couple_price,
       price_bdt * 2 "Couple Price",
       price_bdt * 2 AS CouplePrice
FROM tours;`}
              caption={`তিনটা Column এ একই সংখ্যা, শুধু নাম আলাদা: couple_price, Couple Price, আর coupleprice। শেষেরটা লক্ষ করুন, বড় হাতের C আর P হারিয়ে গেছে। দ্বিতীয়টায় AS নেই, তবু চলেছে। এবার যেকোনো একটা Alias Single Quote দিয়ে লিখে Error টা নিজের চোখে দেখুন।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা স্বাভাবিক চেষ্টা, যেটা প্রায় সবাই একবার করেন: আগের Column এ দেওয়া নাম
                দিয়ে পরের Column এ হিসাব। যেমন price_bdt * 2 AS couple_price, তারপর
                couple_price + 500। মনে হয় চলা উচিত, কিন্তু চলে না:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql",
          code: `island_tours=# SELECT price_bdt * 2 AS couple_price, couple_price + 500 FROM tours;
ERROR:  column "couple_price" does not exist
LINE 1: SELECT price_bdt * 2 AS couple_price, couple_price + 500 FRO...
                                              ^`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কারণ Alias জন্মায় ফলাফল বানানোর একদম শেষ মুহূর্তে। SELECT list এর অন্য Column
                গুলো হিসাব হওয়ার সময় couple_price নামটা তখনো কারো জানা নেই, তাই PostgreSQL তাকে
                tours এর একটা Column ভেবে খোঁজে আর পায় না। MySQL ও একই কথা বলে: Unknown column
                couple_price in field list। আপাতত সমাধান সোজা: হিসাবটা আবার লিখুন, price_bdt * 2
                + 500। Alias ঠিক কখন জন্মায় আর কোথায় কোথায় তাকে ডাকা যায়, সেটাই পরের লেসনের
                মূল প্রশ্ন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই ট্র্যাকের নাম রাখার নিয়ম",
          content: (
            <ContentParagraph>
              ছোট হাতের অক্ষর আর শব্দের মাঝে Underscore: couple_price, total_hours,
              full_revenue। Table আর Column এর নামও এভাবে, Alias ও। এই ধরনকে বলে snake_case।
              Quote লাগে না, দুই Database এ একই রকম আসে, আর App এর Code এ ধরতেও সহজ। শুধু
              মানুষের পড়ার Report এ Double Quote দিয়ে সুন্দর নাম রাখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  একটা তারিখে কোনো ট্যুর পুরো ভরে গেলে কত টাকা আসবে? প্রতিটা ট্যুরের{" "}
                  <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>max_seats</code> গুণ{" "}
                  <code className={CODE}>price_bdt</code>, দ্বিতীয় Column এর নাম দিন{" "}
                  <code className={CODE}>full_revenue</code>।
                </>
              }
              hint={
                <>
                  Expression এর পরে AS full_revenue। Check শুধু মান মেলায়, নাম না, তাই নামটা
                  নিজে মিলিয়ে নিন: ফলাফলের মাথায় full_revenue দেখছেন তো?
                </>
              }
              solution={`SELECT title, max_seats * price_bdt AS full_revenue
FROM tours;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "without-from",
      subHeader: { index: "008", title: "Without FROM" },
      title: <SectionTitle>FROM ছাড়া SELECT: Database কে ক্যালকুলেটর বানানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FROM কি সবসময় লাগে? PostgreSQL এ না। Table থেকে কিছু না পড়লে FROM বাদ দেওয়া
                যায়। তখন SELECT হয়ে যায় একটা ক্যালকুলেটর, যার উত্তর এক Row এর একটা Table।
                ছোট হিসাব পরীক্ষা করতে, বা কোনো Function কী ফেরত দেয় দেখতে এটা খুব কাজের।
                Module 02 এ SELECT version(); চালিয়েছিলেন, মনে আছে? সেটাও FROM ছাড়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ক্যালকুলেটর SELECT"
              query={`SELECT 2 + 2;

SELECT 12500 * 3 AS three_people,
       'Saint Martin' AS place,
       7 / 2 AS int_div,
       7.0 / 2 AS num_div,
       7 % 2 AS remainder;`}
              caption="প্রথম উত্তর 4, নাম ?column?। দ্বিতীয়টায় সাবধানে দেখুন: 7 / 2 এর উত্তর 3, আর 7.0 / 2 এর উত্তর 3.5000000000000000। দুটো পূর্ণ সংখ্যা ভাগ করলে PostgreSQL দশমিক ফেলে দেয়। এই ফাঁদের পুরো গল্প Module 04 এ, আজ শুধু চিনে রাখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লক্ষ করুন {`'Saint Martin'`} Single Quote এর ভেতরে। এটা একটা Literal, মানে
                সরাসরি লেখা মান। Text এর Literal সবসময় Single Quote এ, সংখ্যার Literal Quote
                ছাড়া। Table থেকে পড়া Query তেও Literal বসানো যায়। তখন প্রতিটা Row এর পাশে
                একই মান বসে। কোনো Partner কোম্পানিকে CSV পাঠাতে গিয়ে একটা স্থির Column লাগলে,
                যেমন মুদ্রার নাম, এভাবেই দেওয়া হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Row এর পাশে একই লেখা"
              query={`SELECT title, 'BDT' AS currency, price_bdt
FROM tours;`}
              caption="নয়টা Row এর প্রতিটায় currency Column এ BDT। Table এ এমন কোনো Column নেই, Query নিজে বানিয়েছে। 'BDT' থেকে Single Quote সরিয়ে চালিয়ে দেখুন: PostgreSQL তখন BDT নামের Column খুঁজবে, আর পাবে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ 7 / 2 এর উত্তর আলাদা",
          content: (
            <ContentParagraph>
              MySQL 8.4 এ SELECT 7 / 2; চালালে আসে 3.5000, কারণ MySQL এর / সবসময় দশমিক ভাগ
              করে। পূর্ণ সংখ্যার ভাগ চাইলে MySQL এ লিখতে হয় 7 DIV 2, যার উত্তর 3। একই Query দুই
              Database এ দুই উত্তর দেয়, আর কোনোটাই Error দেখায় না। MySQL এর ভিডিও দেখে
              PostgreSQL এ অনুশীলন করলে ভাগের জায়গাগুলোয় বিশেষ চোখ রাখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "style",
      subHeader: { index: "009", title: "Writing Style" },
      title: <SectionTitle>এমনভাবে লিখুন যাতে ছয় মাস পরেও পড়া যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Database এর কাছে নিচের দুটো Query হুবহু এক। মানুষের কাছে না। Query লেখা হয়
                একবার, পড়া হয় অনেকবার: Code Review এ, Bug খুঁজতে, ছয় মাস পরে নিজে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "hard-to-read.sql",
          code: `select title,price_bdt*2 couple_price,duration_days*24 from tours`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "easy-to-read.sql",
          code: `-- Brochure এর জন্য: প্রতিটা ট্যুরের নাম, দুইজনের দাম আর মোট ঘণ্টা
SELECT title,
       price_bdt * 2      AS couple_price,
       duration_days * 24 AS total_hours
FROM tours;`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Keyword বড় হাতে, নাম ছোট হাতে।</strong> SELECT, FROM, AS চোখে আলাদা
                  হয়ে ভেসে ওঠে, তাই কাঠামোটা এক নজরে বোঝা যায়।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Clause নতুন লাইনে।</strong> SELECT এক লাইনে, FROM আরেক
                  লাইনে। পরে WHERE, ORDER BY যোগ হলে প্রতিটা নিজের লাইন পাবে।
                </ListItem>
                <ListItem>
                  <strong>অনেক Column হলে একটা Column এক লাইনে।</strong> কোনো Column বাদ
                  দিতে বা যোগ করতে একটা লাইন মুছলেই হয়, আর Git এর Diff এও পরিষ্কার দেখা যায়।
                </ListItem>
                <ListItem>
                  <strong>অপারেটরের দুই পাশে Space।</strong> price_bdt * 2, price_bdt*2 না।
                </ListItem>
                <ListItem>
                  <strong>Comment দিয়ে কেন লিখুন।</strong> দুই Dash দিয়ে শুরু করলে সেই লাইনের
                  বাকিটা Database পড়েই না। কয়েক লাইনের Comment এর জন্য স্ল্যাশ আর তারা দিয়ে খোলা
                  আর তারা আর স্ল্যাশ দিয়ে বন্ধ করা যায়। কী করছে সেটা Query নিজেই বলে, Comment
                  এ লিখুন কেন করছে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কমা লাইনের শুরুতে, কিছু টিমের পছন্দ",
          content: (
            <ContentParagraph>
              কিছু টিম কমা লাইনের শেষে না রেখে পরের লাইনের শুরুতে রাখে। তাতে শেষ Column মুছতে
              গিয়ে বাড়তি কমা থেকে যাওয়ার ভুল কম হয়, যেটা Section 010 এ দেখবেন। দুটো ধরনই
              চলে। যে টিমে কাজ করবেন, তাদের ধরন মেনে চলুন, এক Project এ দুই রকম না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "when-it-fails",
      subHeader: { index: "010", title: "When It Fails" },
      title: <SectionTitle>সাতটা ভুল, একটা চুপচাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম সপ্তাহে যে ভুলগুলো সবাই করে, সেগুলো আগে থেকে চিনে রাখলে প্রতিটা Error
                দেখে আধা মিনিটে ঠিক করতে পারবেন। Error পড়ার পুরো কৌশল আছে Module 02 এর{" "}
                <Link href="/sql/topic/errors-and-help" className={LINK}>
                  Reading Errors and Finding Help
                </Link>{" "}
                লেসনে। এখানে শুধু SELECT এর নিজের ভুলগুলো। Lab এ প্রতিটা Query দেখে আগে নিজে
                আন্দাজ করুন কী হবে, তারপর উত্তর খুলুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SpotTheBugLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম ভুলটাই সবচেয়ে ভয়ের, তাই সেটা নিজে চালিয়ে দেখুন। title আর price_bdt এর
                মাঝের কমাটা নেই। Error আশা করছেন, তাই না?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="হারানো কমা"
              query={`SELECT title price_bdt
FROM tours;`}
              caption="কোনো Error নেই। একটাই Column, নাম price_bdt, আর তার ভেতরে দাম না, ট্যুরের নাম! কমা না থাকায় PostgreSQL ধরে নিয়েছে price_bdt হলো title এর Alias, AS ছাড়া। এখন কমাটা বসিয়ে আবার চালান, দুটো Column ফিরে আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Error দেওয়া ভুল ভালো, চুপচাপ ভুল বিপজ্জনক",
          content: (
            <ContentParagraph>
              Syntax Error দেখলে আপনি সাথে সাথে থামেন আর ঠিক করেন। কিন্তু হারানো কমার Query
              দিব্যি চলে, App এ চলে যায়, আর কেউ টের পায় না যে দামের জায়গায় নাম যাচ্ছে।
              প্রতিটা নতুন Query চালিয়ে ফলাফলের Column এর নাম আর সংখ্যা একবার গুনে মিলিয়ে নিন।
              আর Alias এ সবসময় AS লিখুন, তাহলে AS ছাড়া একটা নাম চোখে পড়লেই সন্দেহ জাগবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "qualified-names",
      subHeader: { index: "011", title: "Qualified Names" },
      title: <SectionTitle>পুরো নাম, আর Table এর ডাকনাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                title লিখলে PostgreSQL বোঝে কোন title, কারণ FROM এ Table একটাই। কিন্তু চিঠির
                ঠিকানার মতো Column এর একটা পুরো ঠিকানাও আছে: Schema, Table, Column, মাঝে বিন্দু।
                tours.title মানে tours Table এর title, আর public.tours.title আরও পুরো। এমন
                নামকে বলে Qualified Name।
              </ContentParagraph>
              <ContentParagraph>
                আজ একটা Table নিয়ে কাজ করছি বলে এটা বাড়তি মনে হবে। কিন্তু Module 06 এ যখন
                tours আর destinations একসাথে জোড়া দেবেন, দুই Table এই থাকবে কোনো না কোনো _id
                Column, তখন কোনটা কার, সেটা বলতেই হবে। তাই নিয়মটা আজ শিখে রাখা।
              </ContentParagraph>
              <ContentParagraph>
                লম্বা নাম বারবার লেখা ক্লান্তিকর, তাই FROM এ Table কেও একটা ডাকনাম দেওয়া যায়:
                FROM tours AS t। তারপর পুরো Query তে tours এর জায়গায় t। এটাকে বলে Table Alias।
                একটা নিয়ম মনে রাখুন: ডাকনাম দেওয়ার পর সেই Query তে আসল নাম tours আর চলে না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NameLevelsDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনভাবে একই Column"
              query={`SELECT tours.title, public.tours.price_bdt
FROM tours;

SELECT t.title, t.price_bdt
FROM tours AS t;`}
              caption="দুটো Query ই নয়টা ট্যুরের নাম আর দাম দেয়। এবার দ্বিতীয়টায় t.price_bdt বদলে tours.price_bdt লিখুন: PostgreSQL বলবে invalid reference to FROM-clause entry for table tours, আর HINT এ মনে করিয়ে দেবে ডাকনাম t ব্যবহার করতে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  <code className={CODE}>destinations</code> Table কে{" "}
                  <code className={CODE}>d</code> ডাকনাম দিন, আর ডাকনাম দিয়ে প্রতিটা জায়গার{" "}
                  <code className={CODE}>name</code> আর <code className={CODE}>region</code>{" "}
                  দেখান।
                </>
              }
              hint={
                <>
                  FROM destinations AS d, আর SELECT এ d.name, d.region। AS বাদ দিয়ে FROM
                  destinations d লিখলেও চলে।
                </>
              }
              solution={`SELECT d.name, d.region
FROM destinations AS d;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "mysql",
      subHeader: { index: "012", title: "In MySQL" },
      title: <SectionTitle>একই SELECT, MySQL এ কোথায় আলাদা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SELECT আর FROM এর মূল কাঠামো দুই Database এ হুবহু এক, তাই MySQL এর ভিডিওর
                SELECT অংশ নির্ভয়ে দেখুন। তবে খুঁটিনাটি কয়েক জায়গায় আলাদা, আর সেগুলো Error না
                দিয়ে ভিন্ন উত্তর দেয় বলে আগে থেকে জানা ভালো। নিচের প্রতিটা সারি PostgreSQL 18
                আর MySQL 8.4 এ চালিয়ে মেলানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["নাম ছাড়া হিসাবের Column", "?column?", "পুরো Expression, যেমন price_bdt * 2"],
            ["AS CouplePrice", "coupleprice (ছোট হাতের)", "CouplePrice (যেমন লেখা)"],
            ["AS 'Couple Price' (Single Quote)", "Syntax Error", "চলে, নাম Couple Price"],
            ['AS "Couple Price" (Double Quote)', "চলে, নাম Couple Price", "চলে, নাম Couple Price"],
            ["নামের জন্য Backtick", "চলে না", "চলে: `Couple Price`"],
            ['SELECT "Title" FROM tours', "Error: column Title নেই", "প্রতিটা Row এ শুধু Title শব্দটা"],
            ["SELECT 7 / 2", "3", "3.5000 (পূর্ণ সংখ্যার ভাগ: 7 DIV 2)"],
            ["price_bdt / duration_days", "4166.6666666666666667", "4166.666667"],
            ["SELECT title FROM TOURS", "চলে, নাম ছোট হাতে বদলায়", "Linux এ Error, Table এর নামে বড় ছোট হাত আলাদা"],
            ["SELECT FROM tours (Column ছাড়া)", "নয়টা খালি Row", "Syntax Error"],
            ["is_active এর মান", "t আর f", "1 আর 0"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              MySQL এর ভিডিও থেকে একটা Query PostgreSQL এ আনার সময় সবচেয়ে বেশি লাগে Quote বদলানো।
              নিচে একই প্রশ্ন দুই Database এর ভাষায়। দুটোই চালিয়ে দেখা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-style.sql (MySQL 8.4)",
          code: `SELECT title AS 'Tour Name',
       price_bdt / duration_days AS \`Per Day\`
FROM tours;
-- Saint Martin Island Escape | 4166.666667`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "postgres-style.sql (PostgreSQL 18)",
          code: `SELECT title AS "Tour Name",
       price_bdt / duration_days AS "Per Day"
FROM tours;
-- Saint Martin Island Escape | 4166.6666666666666667`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দুটো Alias এর Quote বদলেছে, Single Quote আর Backtick দুটোই হয়েছে Double Quote।
              বাকি Query হুবহু এক। আর উত্তরের দশমিকের ঘর আলাদা, যেটা Module 04 এ round দিয়ে
              দুই Database এই এক রকম করা শিখবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Table এর নামে বড় হাত, ছোট হাত",
          content: (
            <ContentParagraph>
              MySQL এর Docs অনুযায়ী Table এর নামে বড় ছোট হাতের তফাত নির্ভর করে
              lower_case_table_names Setting এর উপর, যার Default Unix আর Linux এ 0, Windows
              এ 1, আর macOS এ 2। তাই TOURS লেখা Query আপনার Windows Laptop এ চলে, আর Linux
              Server এ Deploy হয়ে ভাঙে। Column এর নাম আর Column এর Alias এ তফাত কোনো
              প্ল্যাটফর্মেই নেই। সহজ সমাধান: Table এর নাম সবসময় যেমন বানানো হয়েছে, ঠিক তেমনই
              লিখুন, ছোট হাতে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "challenge",
      subHeader: { index: "013", title: "Challenge" },
      title: <SectionTitle>সব মিলিয়ে একটা Query</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আজকের সবকিছু একসাথে লাগবে: Column বাছা, Expression আর Alias। আগে নিজে
                লিখুন, তিন মিনিট চেষ্টার আগে Hint খুলবেন না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              task={
                <>
                  পরিবারের ট্যুরের নতুন Brochure। প্রতিটা ট্যুরের জন্য চারটা Column, এই ক্রমে:{" "}
                  <code className={CODE}>title</code>, একজনের দাম{" "}
                  <code className={CODE}>price_bdt</code>, চারজনের পরিবারের দাম (নাম দিন{" "}
                  <code className={CODE}>family_of_four</code>), আর ট্যুরটা মোট কত ঘণ্টার (নাম
                  দিন <code className={CODE}>hours</code>)।
                </>
              }
              hint={
                <>
                  দুটো Expression: price_bdt * 4 আর duration_days * 24, প্রতিটার পরে AS আর
                  নাম। Column এর ক্রম ঠিক রাখুন।
                </>
              }
              solution={`SELECT title,
       price_bdt,
       price_bdt * 4      AS family_of_four,
       duration_days * 24 AS hours
FROM tours;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Challenge পেরোলে নিচের খালি মাঠে নিজের প্রশ্ন বানিয়ে চালান। bookings এ কী আছে?
              payments এ? প্রতিটা Table এ একবার SELECT * চালিয়ে দেখুন, তারপর শুধু দরকারি
              Column গুলো রেখে Query ছোট করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খোলা মাঠ"
              query={`SELECT booking_id, seats, total_bdt, status
FROM bookings;`}
              caption="চব্বিশটা Booking। status এ তিন রকম মান দেখবেন: confirmed, pending আর cancelled। শুধু confirmed গুলো বেছে নেওয়া হবে Lesson 03 এর প্রথম কাজ।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর পাতাগুলোর পেছনের SELECT</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Website আর ভেতরের Admin প্যানেলের প্রায় প্রতিটা পাতা খোলার সময়
                পেছনে একটা SELECT চলে। নিচে কয়েকটা পাতা আর তাদের Query এর সবচেয়ে সরল রূপ।
                আসল Query তে এর সাথে WHERE (Lesson 03), ORDER BY (Lesson 06) আর LIMIT (Lesson 07)
                যোগ হয়, কিন্তু মেরুদণ্ড এটাই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পাতা", "কে দেখেন", "Query এর মূল অংশ", "Row"],
          rows: [
            ["ট্যুরের তালিকা", "Website এর পর্যটক", "SELECT tour_id, title, duration_days, price_bdt FROM tours", "9"],
            ["Customer তালিকা", "Support টিম", "SELECT customer_id, full_name, email, phone FROM customers", "15"],
            ["Guide তালিকা", "Operations", "SELECT full_name, language, hired_on FROM guides", "5"],
            ["Booking এক নজরে", "হিসাব বিভাগ", "SELECT booking_id, total_bdt, status FROM bookings", "24"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো জিনিস লক্ষ করুন। এক, কোনো পাতাতেই SELECT * নেই। ট্যুরের তালিকার পাতায়
                guide_id বা created_at পর্যটকের কোনো কাজে লাগে না, তাই সেগুলো চাওয়াই হয় না।
                Customer তালিকার phone যায় শুধু Support টিমের পাতায়, যেখানে সত্যিই লাগে।
              </ContentParagraph>
              <ContentParagraph>
                দুই, Column এর নাম সরাসরি App এর Code এর অংশ হয়ে যায়। Island Tours এর API যখন
                এই Query চালায়, প্রতিটা Row আসে একটা JavaScript Object হয়ে, যার Key হলো
                ফলাফলের Column এর নাম। কেউ যদি Query তে AS TourName লেখেন, PostgreSQL নামটা
                বানাবে tourname, আর Frontend এর row.TourName পাবে undefined। এই কারণে Island
                Tours এর নিয়ম, সব Alias snake_case এ। Module 17 এ Node.js থেকে Query চালানোর
                সময় এই ব্যাপারটা নিজের চোখে দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  Operations টিমের নতুন পাতা: প্রতিটা Guide এর নাম, কোন ভাষায় ট্যুর করান, আর কবে
                  যোগ দিয়েছেন। Column তিনটা, এই ক্রমে: <code className={CODE}>full_name</code>{" "}
                  নাম দিন <code className={CODE}>guide</code>,{" "}
                  <code className={CODE}>language</code> নাম দিন{" "}
                  <code className={CODE}>speaks</code>, আর{" "}
                  <code className={CODE}>hired_on</code> যেমন আছে।
                </>
              }
              hint={
                <>
                  Table guides। দুটো Column এর পরে AS আর নতুন নাম, তৃতীয়টা নাম ছাড়াই। পাঁচজন
                  Guide আসবেন।
                </>
              }
              solution={`SELECT full_name AS guide,
       language  AS speaks,
       hired_on
FROM guides;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা SELECT, Enter থেকে ফলাফল পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              উদাহরণ: SELECT title, price_bdt * 2 AS couple_price FROM tours; psql এ লিখে Enter
              চাপলেন। এরপর যা যা ঘটে, আর কোন ধাপে কোন ভুল ধরা পড়ে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "psql Semicolon দেখে পাঠায়",
              description:
                "Semicolon না থাকলে psql অপেক্ষা করে, প্রম্পট বদলে -# হয়। Semicolon পেলে পুরো লেখাটা Text হিসেবে Server এ পাঠায়, আপনার খোলা Connection দিয়ে।",
            },
            {
              title: "Parser ব্যাকরণ মেলায়",
              description:
                "SELECT এর পরে কিছু, তারপর FROM, তারপর নাম, এই কাঠামো ঠিক আছে কিনা। বাড়তি কমা বা Single Quote এর Alias এখানেই আটকায়: syntax error at or near। হারানো কমা এখানে ধরা পড়ে না, কারণ ব্যাকরণে সেটা বৈধ Alias।",
            },
            {
              title: "নাম খোঁজা হয়",
              description:
                "tours নামটা search_path ধরে খোঁজা হয়, পাওয়া যায় public.tours। না পেলে relation does not exist। তারপর title আর price_bdt সেই Table এ আছে কিনা দেখা হয়, না থাকলে column does not exist আর সম্ভব হলে একটা HINT।",
            },
            {
              title: "Planner পরিকল্পনা করে",
              description:
                "কোনো শর্ত নেই, তাই পুরো Table শুরু থেকে শেষ পড়াই একমাত্র পথ। এই পরিকল্পনার নাম Seq Scan। পরিকল্পনা পড়তে শিখবেন Module 13 এ।",
            },
            {
              title: "Executor প্রতিটা Row এ কাজ করে",
              description:
                "শুরুর আগে দেখে নেয় আপনার Role এর tours পড়ার অনুমতি আছে কিনা। তারপর একটা একটা Row পড়ে, সেই Row এর title নেয়, price_bdt কে দুই দিয়ে গুণ করে, আর দুই ঘরের একটা নতুন Row বানায়।",
            },
            {
              title: "ফলাফল ফেরত আসে",
              description:
                "আগে আসে Column এর বিবরণ, নাম title আর couple_price, তারপর নয়টা Row, শেষে কতগুলো Row তার হিসাব। tours Table এ কিছুই বদলায়নি।",
            },
            {
              title: "psql সাজিয়ে দেখায়",
              description:
                "Column এর নাম মাথায়, নিচে দাগ, সংখ্যা ডান দিকে সাজানো, আর শেষে (9 rows)। GUI বা Query বক্স একই ফলাফল নিজের মতো করে আঁকে।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে অভ্যাসগুলো শুরুতেই বাদ দেবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>App এর Code এ SELECT *।</strong> অপ্রয়োজনীয় Data, গোপন Column ফাঁস, আর
                Table বদলালে চুপচাপ ভাঙা। দেখার জন্য *, App এর জন্য নাম ধরে।
              </ListItem>
              <ListItem>
                <strong>AS বাদ দেওয়ার অভ্যাস।</strong> AS ছাড়া Alias বৈধ, কিন্তু তাতে হারানো
                কমার ভুল চোখে পড়ে না। সবসময় AS।
              </ListItem>
              <ListItem>
                <strong>Alias এ Single Quote।</strong> PostgreSQL এ Syntax Error। নামের জন্য
                Double Quote, লেখার জন্য Single Quote।
              </ListItem>
              <ListItem>
                <strong>CamelCase Alias।</strong> AS TotalPrice হয়ে যায় totalprice, আর App এর
                Code এ মিল পায় না। snake_case ব্যবহার করুন।
              </ListItem>
              <ListItem>
                <strong>ফলাফলের ক্রমের উপর ভরসা।</strong> আজকের সব ফলাফল tour_id এর ক্রমে
                এসেছে, কিন্তু সেটা কাকতালীয়। ORDER BY না লিখলে Database কোনো ক্রমের কথা দেয় না।
                Lesson 06 এ এর পুরো কারণ।
              </ListItem>
              <ListItem>
                <strong>Alias কে Table এর বদল ভাবা।</strong> AS couple_price দিয়ে tours এ নতুন
                Column তৈরি হয় না। Table বদলানো Module 09 এর ALTER TABLE এর কাজ।
              </ListItem>
              <ListItem>
                <strong>ভাগের উত্তর না দেখে বিশ্বাস করা।</strong> 7 / 2 PostgreSQL এ 3, MySQL এ
                3.5000। যেখানে ভাগ আছে, একটা উদাহরণ হাতে হিসাব করে মিলিয়ে নিন।
              </ListItem>
              <ListItem>
                <strong>psql এ Semicolon ভুলে যাওয়া।</strong> প্রম্পট =# থেকে -# হয়ে গেলে বুঝুন
                psql আরও লেখার অপেক্ষায়। একটা Semicolon লিখে Enter দিন।
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
                <strong>Querying a Table</strong>, PostgreSQL এর নিজের Tutorial এর SELECT অংশ।
                ছোট, সরল, আর আজকের লেসনের সাথে মিলিয়ে পড়ার মতো।{" "}
                <a href="https://www.postgresql.org/docs/current/tutorial-select.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/docs/current/tutorial-select.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Select Lists</strong>, Column এর নাম, AS, আর নাম না দিলে PostgreSQL কী নাম
                বসায় তার অফিসিয়াল ব্যাখ্যা।{" "}
                <a href="https://www.postgresql.org/docs/current/queries-select-lists.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/docs/current/queries-select-lists.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Lexical Structure</strong>, Keyword, নাম, Quote আর বড় ছোট হাতের নিয়ম।
                Double Quote কেন নাম আর Single Quote কেন লেখা, তার মূল উৎস।{" "}
                <a href="https://www.postgresql.org/docs/current/sql-syntax-lexical.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/docs/current/sql-syntax-lexical.html
                </a>
              </ListItem>
              <ListItem>
                <strong>SELECT Reference</strong>, পুরো SELECT এর Synopsis। এখন সবটা বুঝবেন না,
                কিন্তু Module 02 এ শেখা Synopsis পড়ার কৌশল দিয়ে একবার চোখ বুলিয়ে নিন। এই মডিউল শেষে
                আবার পড়লে অর্ধেকের বেশি চেনা লাগবে।{" "}
                <a href="https://www.postgresql.org/docs/current/sql-select.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/docs/current/sql-select.html
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL SELECT Statement</strong>, MySQL 8.4 এর Docs।{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/select.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  dev.mysql.com/doc/refman/8.4/en/select.html
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL Identifier Case Sensitivity</strong>, কোন প্ল্যাটফর্মে Table এর নামে
                বড় ছোট হাত আলাদা, তার পুরো তালিকা।{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/identifier-case-sensitivity.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  dev.mysql.com/doc/refman/8.4/en/identifier-case-sensitivity.html
                </a>
              </ListItem>
              <ListItem>
                <strong>একটা পূর্ণ SQL ভিডিও কোর্স</strong>, MySQL দিয়ে বানানো। এই লিংক সরাসরি
                SELECT এর অংশে নিয়ে যায়। দেখার সময় Section 012 এর তালিকা পাশে রাখুন।{" "}
                <a href="https://www.youtube.com/watch?v=hlGoQC332VM&t=4384s" target="_blank" rel="noopener noreferrer" className={LINK}>
                  youtube.com/watch?v=hlGoQC332VM
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
                <ListItem>SELECT list বলে কোন Column চাই, FROM বলে কোন Table থেকে। শেষে Semicolon।</ListItem>
                <ListItem>* মানে সব Column, Table এর ক্রমে। দেখার জন্য ভালো, App এর Code এ না।</ListItem>
                <ListItem>Column যে ক্রমে লিখবেন, ফলাফল সেই ক্রমে। Row একটাও বাদ যায় না।</ListItem>
                <ListItem>ফলাফল নিজেই একটা ক্ষণিকের Table। SELECT কখনো কিছু বদলায় না।</ListItem>
                <ListItem>Expression প্রতিটা Row এ আলাদা করে হিসাব হয়: price_bdt * 2, duration_days * 24।</ListItem>
                <ListItem>নাম না দিলে PostgreSQL দেয় ?column?। AS দিয়ে নাম দিন, snake_case এ।</ListItem>
                <ListItem>Quote ছাড়া নাম ছোট হাতের হয়, Double Quote হুবহু রাখে, Single Quote নামের জন্য না।</ListItem>
                <ListItem>FROM ছাড়া SELECT একটা ক্যালকুলেটর। 7 / 2 PostgreSQL এ 3।</ListItem>
                <ListItem>হারানো কমা Error দেয় না, Alias বানায়। এটাই সবচেয়ে বিপজ্জনক ভুল।</ListItem>
                <ListItem>tours.title পুরো নাম, FROM tours AS t দিলে t.title, তারপর আর tours না।</ListItem>
              </ContentList>
              <ContentParagraph>
                একটা প্রশ্ন রেখে যাই। আপনি লিখেছেন SELECT আগে, FROM পরে। কিন্তু Database কি
                আসলেও SELECT আগে পড়ে? ভাবুন: কোন Column আছে, সেটা জানার আগে Table টা কোথায়,
                সেটা জানতে হয় না? এই প্রশ্নের উত্তরেই লুকিয়ে আছে কেন কিছু Alias কোথাও চলে আর
                কোথাও চলে না। পরের লেসন{" "}
                <Link href="/sql/topic/query-order" className={LINK}>
                  The Logical Order of a Query
                </Link>{" "}
                ঠিক এটা নিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "উদাহরণ"],
    rows: [
      ["SELECT list", "কোন Column চাই, কমা দিয়ে, যে ক্রমে চাই", "SELECT title, price_bdt"],
      ["FROM", "কোন Table থেকে", "FROM tours"],
      ["*", "সব Column, Table এর ক্রমে, শুধু দেখার জন্য", "SELECT * FROM destinations"],
      ["Result Set", "ফলাফল একটা ক্ষণিকের Table, আসল Table অক্ষত", "নয়টা Row, দুটো Column"],
      ["Expression", "প্রতিটা Row এ আলাদা হিসাব", "price_bdt * 2"],
      ["?column?", "নাম না দেওয়া হিসাবের Column এর নাম", "SELECT 2 + 2"],
      ["AS (Column Alias)", "ফলাফলের Column এর নাম", "price_bdt * 2 AS couple_price"],
      ["Quote এর নিয়ম", "নাম Double Quote এ, লেখা Single Quote এ", "AS \"Couple Price\", 'BDT'"],
      ["Case Folding", "Quote ছাড়া নাম ছোট হাতের হয়", "AS CouplePrice থেকে coupleprice"],
      ["FROM ছাড়া SELECT", "ক্যালকুলেটর, এক Row এর উত্তর", "SELECT 7 / 2 থেকে 3"],
      ["Qualified Name", "Schema.Table.Column", "public.tours.title"],
      ["Table Alias", "FROM এ Table এর ডাকনাম", "FROM tours AS t, t.title"],
      ["হারানো কমা", "Error ছাড়া ভুল Alias", "SELECT title price_bdt"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SELECT title, price_bdt FROM tours; চালালে কী আসবে? (tours এ নয়টা ট্যুর আর নয়টা Column)",
        options: [
          {
            key: "A",
            text: "নয়টা Row, দুটো Column",
            isCorrect: true,
            explanation: "ঠিক। Column বাছাই করলে Row কমে না, শুধু খাড়া দিকে কাটা হয়। Row ছাঁকতে লাগবে WHERE।",
          },
          {
            key: "B",
            text: "দুটো Row, নয়টা Column",
            isCorrect: false,
            explanation: "SELECT list Column বাছে, Row না। Row আর Column এর জায়গা উল্টে গেছে।",
          },
          {
            key: "C",
            text: "দুটো Row, দুটো Column",
            isCorrect: false,
            explanation: "কোনো শর্ত দেওয়া হয়নি, তাই সব নয়টা ট্যুরই আসবে।",
          },
          {
            key: "D",
            text: "tours Table থেকে বাকি সাতটা Column মুছে যাবে",
            isCorrect: false,
            explanation: "SELECT কখনো কিছু বদলায় না। ফলাফল একটা আলাদা ক্ষণিকের Table।",
          },
        ],
      },
      {
        id: 2,
        text: "একজন লিখলেন SELECT title price_bdt FROM tours; (মাঝে কমা নেই)। PostgreSQL কী করবে?",
        options: [
          {
            key: "A",
            text: "syntax error দেখাবে",
            isCorrect: false,
            explanation: "এটাই বিপদ: ব্যাকরণে এটা বৈধ, তাই কোনো Error আসে না।",
          },
          {
            key: "B",
            text: "একটাই Column দেবে, নাম price_bdt, ভেতরে ট্যুরের নাম",
            isCorrect: true,
            explanation: "ঠিক। কমা না থাকায় price_bdt হয়ে গেছে title এর Alias, কারণ AS লেখা ঐচ্ছিক।",
          },
          {
            key: "C",
            text: "দুটো Column দেবে, কমা নিজে বসিয়ে",
            isCorrect: false,
            explanation: "Database অনুমান করে কমা বসায় না। যা লেখা, সেভাবেই পড়ে।",
          },
          {
            key: "D",
            text: "শুধু price_bdt এর Column দেবে",
            isCorrect: false,
            explanation: "নামটা price_bdt ঠিকই, কিন্তু ভেতরের মান title এর। এখানেই ফাঁদ।",
          },
        ],
      },
      {
        id: 3,
        text: "PostgreSQL এ SELECT title, price_bdt * 2 FROM tours; চালালে দ্বিতীয় Column এর নাম কী হবে?",
        options: [
          {
            key: "A",
            text: "price_bdt",
            isCorrect: false,
            explanation: "শুধু Column লিখলে তার নাম থাকে। হিসাব করা Column এর জন্য PostgreSQL আলাদা নাম দেয়।",
          },
          {
            key: "B",
            text: "price_bdt * 2",
            isCorrect: false,
            explanation: "এটা MySQL এর আচরণ। PostgreSQL পুরো Expression কে নাম বানায় না।",
          },
          {
            key: "C",
            text: "?column?",
            isCorrect: true,
            explanation: "ঠিক। নাম না দিলে জটিল Expression এর জন্য PostgreSQL একটা সাধারণ নাম বসায়। AS দিয়ে নাম দিন।",
          },
          {
            key: "D",
            text: "Error, কারণ নাম দিতেই হবে",
            isCorrect: false,
            explanation: "নাম দেওয়া বাধ্যতামূলক না, শুধু ভালো অভ্যাস।",
          },
        ],
      },
      {
        id: 4,
        text: "SELECT price_bdt * 2 AS CouplePrice FROM tours; PostgreSQL এ ফলাফলের Column এর নাম কী?",
        options: [
          {
            key: "A",
            text: "CouplePrice",
            isCorrect: false,
            explanation: "MySQL এ এমন আসে। PostgreSQL Quote ছাড়া নাম ছোট হাতের অক্ষরে বদলায়।",
          },
          {
            key: "B",
            text: "coupleprice",
            isCorrect: true,
            explanation: "ঠিক। বড় হাত রাখতে চাইলে Double Quote: AS \"CouplePrice\"। সহজ পথ snake_case: couple_price।",
          },
          {
            key: "C",
            text: "couple_price",
            isCorrect: false,
            explanation: "PostgreSQL নিজে Underscore বসায় না, শুধু ছোট হাতের করে।",
          },
          {
            key: "D",
            text: "?column?",
            isCorrect: false,
            explanation: "AS দিয়ে নাম দেওয়া হয়েছে, তাই ?column? আসবে না।",
          },
        ],
      },
      {
        id: 5,
        text: "App এর Code এ SELECT * না লিখে Column এর নাম লেখার সবচেয়ে বড় কারণ কোনটা নয়?",
        options: [
          {
            key: "A",
            text: "Table এ নতুন গোপন Column যোগ হলে সেটা অজান্তে বেরিয়ে যেতে পারে",
            isCorrect: false,
            explanation: "এটা সত্যিকারের কারণ। password_hash এর মতো Column চুপচাপ সব জায়গায় চলে যায়।",
          },
          {
            key: "B",
            text: "অপ্রয়োজনীয় Data আনতে Network আর Memory খরচ হয়",
            isCorrect: false,
            explanation: "এটাও সত্যিকারের কারণ, বড় Table এ বিশেষ করে।",
          },
          {
            key: "C",
            text: "SELECT * Table এর Data বদলে দিতে পারে",
            isCorrect: true,
            explanation: "ঠিক ধরেছেন, এটা কারণ না, কারণ এটা মিথ্যা। কোনো SELECT ই Data বদলায় না।",
          },
          {
            key: "D",
            text: "Column যোগ বা সরালে Code এর ধরে নেওয়া ক্রম ভেঙে যায়",
            isCorrect: false,
            explanation: "এটাও সত্যিকারের কারণ। * এর Column এর ক্রম Table এর উপর নির্ভর করে।",
          },
        ],
      },
      {
        id: 6,
        text: "SELECT 7 / 2; PostgreSQL আর MySQL 8.4 এ কী দেয়?",
        options: [
          {
            key: "A",
            text: "দুটোতেই 3.5",
            isCorrect: false,
            explanation: "PostgreSQL এ দুটো পূর্ণ সংখ্যার ভাগ পূর্ণ সংখ্যা দেয়।",
          },
          {
            key: "B",
            text: "PostgreSQL এ 3, MySQL এ 3.5000",
            isCorrect: true,
            explanation: "ঠিক। MySQL এর / সবসময় দশমিক ভাগ, পূর্ণ সংখ্যার ভাগ সেখানে 7 DIV 2।",
          },
          {
            key: "C",
            text: "PostgreSQL এ 3.5000, MySQL এ 3",
            isCorrect: false,
            explanation: "উল্টো হয়ে গেছে।",
          },
          {
            key: "D",
            text: "দুটোতেই Error, কারণ FROM নেই",
            isCorrect: false,
            explanation: "দুই Database এই FROM ছাড়া SELECT চলে।",
          },
        ],
      },
      {
        id: 7,
        text: "MySQL এর ভিডিও থেকে নেওয়া SELECT title AS 'Tour Name' FROM tours; PostgreSQL এ চালালে কী হবে, আর ঠিক করবেন কীভাবে?",
        options: [
          {
            key: "A",
            text: "চলবে, কোনো বদল লাগবে না",
            isCorrect: false,
            explanation: "MySQL এ চলে, PostgreSQL এ না।",
          },
          {
            key: "B",
            text: "Syntax Error, ঠিক করতে Single Quote বদলে Double Quote দিন",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL এ Single Quote মানে লেখা, নাম না। AS \"Tour Name\" লিখলে চলবে।",
          },
          {
            key: "C",
            text: "Syntax Error, ঠিক করতে Backtick দিন",
            isCorrect: false,
            explanation: "Backtick MySQL এর জিনিস, PostgreSQL এ চলে না।",
          },
          {
            key: "D",
            text: "চলবে, কিন্তু নাম আসবে ছোট হাতে tour name",
            isCorrect: false,
            explanation: "Single Quote এর Alias PostgreSQL এ চলেই না।",
          },
        ],
      },
      {
        id: 8,
        text: "SELECT t.title, tours.price_bdt FROM tours AS t; চালালে কী হবে?",
        options: [
          {
            key: "A",
            text: "চলবে, t আর tours দুটোই একই Table",
            isCorrect: false,
            explanation: "একই Table, কিন্তু ডাকনাম দেওয়ার পর সেই Query তে আসল নাম আর চলে না।",
          },
          {
            key: "B",
            text: "Error: invalid reference to FROM-clause entry for table \"tours\"",
            isCorrect: true,
            explanation: "ঠিক। HINT এ PostgreSQL নিজেই বলে দেয় t ব্যবহার করতে। t.price_bdt লিখলে ঠিক।",
          },
          {
            key: "C",
            text: "শুধু title আসবে, price_bdt বাদ যাবে",
            isCorrect: false,
            explanation: "Database কোনো Column চুপচাপ বাদ দেয় না, Error দেয়।",
          },
          {
            key: "D",
            text: "tours Table এর নাম বদলে t হয়ে যাবে",
            isCorrect: false,
            explanation: "Table Alias শুধু এই Query এর ভেতরের ডাকনাম। আসল নাম বদলায় না।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর চারটা পাতার Query",
    time: "৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>Website এর তালিকা:</strong> নিজের island_tours এ psql খুলে একটা Query লিখুন যা
        প্রতিটা ট্যুরের title, duration_days আর price_bdt দেখায়, নাম দিন tour, days আর price।
        ফলাফলে নয়টা Row এসেছে কিনা দেখে নিন।
      </span>,
      <span key="2">
        <strong>Support এর তালিকা:</strong> customers থেকে full_name, email, phone আর city নিন।
        তারপর তিন লাইনে লিখুন, এই পাতার জন্য কেন SELECT * লেখা ঠিক হতো না।
      </span>,
      <span key="3">
        <strong>হিসাবের প্রশ্ন:</strong> প্রতিটা ট্যুরের title, max_seats, price_bdt আর পুরো ভরে
        গেলে আয় (full_revenue) দেখান। ফলাফল চোখে দেখে লিখুন কোন ট্যুরের full_revenue সবচেয়ে
        বেশি। সাজিয়ে দেখানো শিখবেন Lesson 06 এ, আজ চোখই ভরসা।
      </span>,
      <span key="4">
        <strong>Bug Hunt:</strong> Section 010 এর সাতটা Query নিজের psql এ একটা একটা করে চালান।
        প্রতিটার Error বা অদ্ভুত ফলাফল Copy করুন, আর পাশে এক লাইনে লিখুন কেন হলো আর কীভাবে ঠিক
        করবেন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> এক বন্ধু MySQL এর ভিডিও দেখে SQL শিখছেন। তাঁকে
        ছয় লাইনে বোঝান PostgreSQL এ এসে কোন তিনটা জিনিসে তিনি হোঁচট খাবেন: Single Quote এর
        Alias, CamelCase Alias, আর 7 / 2 এর উত্তর।
      </span>,
    ],
    deliverables: [
      <span key="d1">প্রথম তিনটা Task এর Query আর psql এর Output, প্রতিটার শেষে Row এর সংখ্যাসহ</span>,
      <span key="d2">SELECT * কেন না, তার তিন লাইনের ব্যাখ্যা</span>,
      <span key="d3">সবচেয়ে বেশি full_revenue এর ট্যুরের নাম আর অঙ্ক</span>,
      <span key="d4">সাতটা Query এর Error বা ফলাফল, প্রতিটার পাশে এক লাইনের কারণ</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ প্রথম SELECT এর মহড়া",
    subtitle: "Module 02 এ Load করা island_tours এ, একটা একটা করে চালান",
    stepName: "DRILL",
    steps: [
      {
        title: "Database এ ঢুকুন",
        description:
          "Terminal এ psql -d island_tours লিখুন (Docker এ চালালে docker exec -it island-pg psql -U postgres -d island_tours)। প্রম্পটে island_tours=# দেখলে ঠিক জায়গায় আছেন।",
      },
      {
        title: "প্রথম দেখা",
        description:
          "প্রথম কোডের দুটো Query চালান। Row এর সংখ্যা মন্তব্যের সংখ্যার সাথে মেলান। না মিললে Sample Database আবার Load করুন, Module 02 এর Lesson 06 অনুযায়ী।",
      },
      {
        title: "Column বাছা আর ক্রম বদলানো",
        description:
          "দ্বিতীয় কোডে একই Customer দুই ক্রমে দেখুন। লক্ষ করুন Row এর সংখ্যা একই, শুধু Column এর জায়গা বদলেছে।",
      },
      {
        title: "Expression আর Alias",
        description:
          "তৃতীয় আর চতুর্থ কোড চালান। ?column? কোথায় আসে, আর Alias দিলে কী বদলায়, দুটো Output পাশাপাশি রেখে দেখুন। TourName এর নাম কী এল, খেয়াল করুন।",
      },
      {
        title: "ভুল ইচ্ছা করে",
        description:
          "পঞ্চম কোডের তিনটা Query একটা একটা করে লিখে চালান। দুটো Error দেবে, একটা দেবে না। Error এর LINE আর ^ চিহ্ন কোথায় আঙুল তুলছে দেখুন।",
      },
      {
        title: "পুরো নাম আর ডাকনাম",
        description:
          "ষষ্ঠ কোডে একই Data তিনভাবে চেয়ে দেখুন। শেষে \\q দিয়ে বেরিয়ে আসুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-first-look.sql",
        code: `SELECT * FROM destinations;   -- (7 rows), চারটা Column
SELECT * FROM tours;          -- (9 rows), নয়টা Column`,
      },
      {
        language: "sql",
        filename: "02-pick-columns.sql",
        code: `SELECT full_name, city FROM customers;      -- (15 rows)
SELECT city, full_name FROM customers;      -- একই 15 Row, শহর আগে
SELECT full_name, language FROM guides;     -- (5 rows)`,
      },
      {
        language: "sql",
        filename: "03-expressions.sql",
        code: `SELECT title, price_bdt, price_bdt * 2, duration_days * 24
FROM tours;
-- (9 rows), শেষের দুটো Column এর নাম ?column?
-- Saint Martin Island Escape | 12500.00 | 25000.00 | 72

SELECT title, price_bdt / duration_days FROM tours;
-- Saint Martin Island Escape | 4166.6666666666666667`,
      },
      {
        language: "sql",
        filename: "04-aliases.sql",
        code: `SELECT title              AS tour,
       price_bdt * 2      AS couple_price,
       duration_days * 24 AS "Total Hours"
FROM tours;
-- (9 rows), Column: tour | couple_price | Total Hours

SELECT title AS TourName FROM tours;
-- Column এর নাম আসে tourname, বড় হাত হারিয়ে যায়`,
      },
      {
        language: "sql",
        filename: "05-on-purpose-errors.sql",
        code: `SELECT titel FROM tours;
-- ERROR:  column "titel" does not exist
-- LINE 1: SELECT titel FROM tours;
--                ^
-- HINT:  Perhaps you meant to reference the column "tours.title".

SELECT title, FROM tours;
-- ERROR:  syntax error at or near "FROM"

SELECT title price_bdt FROM tours;
-- কোনো Error নেই! একটাই Column, নাম price_bdt, ভেতরে ট্যুরের নাম (9 rows)`,
      },
      {
        language: "sql",
        filename: "06-qualified-names.sql",
        code: `SELECT tours.title, public.tours.price_bdt FROM tours;   -- (9 rows)
SELECT t.title, t.price_bdt FROM tours AS t;              -- (9 rows)
SELECT d.name, d.region FROM destinations d;              -- (7 rows), AS ছাড়াও চলে`,
      },
    ],
    tip: (
      <ContentParagraph>
        psql এ একটা Query ফাইলে রেখে \i 03-expressions.sql দিয়ে চালাতে পারেন, Module 02 এর
        psql লেসনে যেমন দেখেছেন। তবে আজ হাতে লিখে চালান। আঙুলে SELECT এর কাঠামো বসে যাওয়াটাই
        আজকের আসল লাভ।
      </ContentParagraph>
    ),
  },
};
