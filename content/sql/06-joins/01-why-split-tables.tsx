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
import { IslandToursDatabaseDiagram } from "../../../components/course/topics/island-tours/database-diagram";
import {
  JoinPathLab,
  PairingLab,
} from "../../../components/course/topics/joins/split-animations";
import {
  KeyLinksDiagram,
  OnVsUsingSplit,
  RepeatedCellsDiagram,
} from "../../../components/course/topics/joins/split-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const whySplitTablesContent: TopicData = {
  id: "why-split-tables",
  introduction: {
    badge: "MODULE 06 · LESSON 01",
    title: <SectionTitle>আলাদা করে রাখা, তারপর জোড়া লাগানো</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          গত দুই মডিউলে আপনি একটা Table থেকে প্রায় সব প্রশ্নের উত্তর বের করতে শিখেছেন: ছাঁকা, সাজানো,
          গোনা, দলে ভাগ করা। কিন্তু একটা জিনিস বারবার আটকে দিয়েছে। bookings Table এ Customer এর নাম
          নেই, আছে শুধু একটা নম্বর, customer_id। ট্যুরের নামও নেই, আছে departure_id। তাই Module 05 এর
          Report গুলোতে নামের জায়গায় নম্বর বসাতে হয়েছে, আর প্রতিবার লেখা ছিল &quot;নাম আসবে Module 06 এ&quot;।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই প্রতিশ্রুতির শুরু। প্রথমে দেখবেন, Database কেন ইচ্ছা করে নামটা আলাদা Table এ
          রাখে: সব কথা এক Table এ লিখলে কী কী ভাঙে। তারপর দেখবেন, আলাদা Table গুলো কীসের সুতোয় বাঁধা থাকে:
          Key। তারপর Island Tours এর মানচিত্র দেখে একটা প্রশ্নের জন্য কোন কোন Table লাগবে, সেটা আগে থেকে
          ঠিক করা শিখবেন। আর শেষে লিখবেন জীবনের প্রথম JOIN, যেটা প্রতিটা Booking এর পাশে তার Customer এর
          নাম বসিয়ে দেয়।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনের লক্ষ্য একটাই ছবি মাথায় বসানো: Join মানে দুই Table এর Row গুলোকে জোড়া লাগানো, যেখানে
          Key এর মান মেলে। কোন Row জোড়া পায় না তার কী হয়, কয়েকটা Table একসাথে কীভাবে জোড়া লাগে, এসব পরের
          লেসনগুলোর কাজ। আজকের কাজ ভিতটা শক্ত করা।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি কিছু বানাই না, শুধু মিলিয়ে দিই। এক Table এর একটা Row এর হাতে একটা নম্বর থাকে, আরেক Table এ সেই নম্বরের মালিক বসে থাকে। আমি দুজনকে খুঁজে পাশাপাশি বসাই। এই সহজ কাজটার জন্যই Database তার তথ্য টুকরো টুকরো করে রাখার সাহস পায়।",
      author: "JOIN",
      role: "Lesson 01",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>রবিবারের ফোনের তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026, রবিবার। Island Tours এর Operations Manager ফারুক সাহেবের সাপ্তাহিক
                বৈঠক চলছে। তিনি নতুন Developer তানিমকে বললেন, যে Booking গুলো এখনো pending, সেগুলোর Customer
                দের আজই ফোন করতে হবে। তাঁর দরকার একটা ছোট তালিকা: Booking নম্বর, Customer এর নাম, আর ফোন নম্বর।
              </ContentParagraph>
              <ContentParagraph>
                তানিম আত্মবিশ্বাস নিয়ে bookings Table খুললেন, WHERE status = &apos;pending&apos; লিখলেন, আর চারটা
                Row পেলেন: Booking 14, 17, 20 আর 24। কিন্তু Row গুলোতে নাম নেই, ফোনও নেই। আছে customer_id: 12,
                1, 9, 13। নামগুলো থাকে customers Table এ। তাই তানিম দ্বিতীয় একটা Query লিখলেন, customer_id 12 এর
                নাম আর ফোন। তারপর তৃতীয়টা, customer_id 1 এর জন্য। তারপর চতুর্থটা, পঞ্চমটা।
              </ContentParagraph>
              <ContentParagraph>
                চারটা Booking এর জন্য পাঁচটা Query, আর হাতে কপি করে করে একটা তালিকা। ফারুক সাহেব এরপর বললেন,
                সামনের সব Departure এর সব Booking এর জন্য একই তালিকা চাই, এগারোটা Booking। তারপর বললেন, প্রতি
                রবিবার এটা লাগবে। তানিম বুঝলেন, নম্বর দেখে আরেক Table এ গিয়ে খোঁজার কাজটা মানুষের হাতে চলতে
                পারে না।
              </ContentParagraph>
              <ContentParagraph>
                অথচ এই কাজটাই একটা Relational Database এর সবচেয়ে চেনা কাজ। এক Table এর Row এর হাতে যে নম্বর আছে,
                সেই নম্বর ধরে আরেক Table থেকে মালিককে খুঁজে এনে পাশে বসানো। এর নাম JOIN। তানিমের পাঁচটা Query
                আর হাতের কপি একটা মাত্র Query তে নেমে আসে, এগারোটা হোক বা এগারো লাখ।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু JOIN লেখার আগে একটা প্রশ্নের উত্তর জানা দরকার, যেটা তানিমের মনেও এসেছিল: নামটা bookings
                Table এই লিখে রাখলে তো এত ঝামেলা হতো না। Database ইচ্ছা করে কেন তথ্য টুকরো টুকরো করে রাখে?
                সেখান থেকেই শুরু।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের এক লাইন",
          content: (
            <ContentParagraph>
              প্রতিটা তথ্য এক জায়গায় একবার রাখা হয়, আর Key দিয়ে বাকিদের সাথে বাঁধা থাকে। উত্তর লাগলে JOIN সেই
              Key ধরে টুকরোগুলো আবার পাশাপাশি বসায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "one-wide-table",
      subHeader: { index: "002", title: "One Wide Table" },
      title: <SectionTitle>সব কথা এক Table এ লিখলে কী হতো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরুন Island Tours শুরু থেকেই একটা মাত্র বিশাল Table রাখত, নাম big_bookings। প্রতিটা Row একটা
                Booking, আর সেই Row এ Booking এর সাথে জড়িত সব কথা: Customer এর নাম, Email, ফোন, শহর, ট্যুরের নাম,
                দাম, যাত্রার তারিখ। দেখতে সুবিধার: একটা Table, কোনো খোঁজাখুঁজি নেই। নিচের ছবিতে Sample Database
                এর আসল পাঁচটা Booking এই চেহারায় সাজানো।
              </ContentParagraph>
              <ContentParagraph>
                এই আইডিয়া আপনি{" "}
                <Link href="/sql/topic/relational-model" className={LINK}>
                  Module 01 এর Relational Model লেসনে
                </Link>{" "}
                একবার দেখেছেন। এখানে সেটা আরেকবার দেখছি এক কারণে: JOIN কেন দরকার, সেটা পুরোপুরি বোঝা যায় তখনই, যখন
                বোঝা যায় JOIN না থাকলে আমাদের কী নিয়ে বাঁচতে হতো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RepeatedCellsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রঙিন ঘরগুলো একটাই জিনিস বলে: একই তথ্য একাধিকবার লেখা। পুরো ২৪টা Booking এ Rahim Uddin এর নাম,
                Email আর ফোন আসে তিনবার, কারণ তিনি তিনবার বুক করেছেন। Saint Martin Island Escape এর নাম আর দাম
                আসে সাতবার, কারণ সেই ট্যুরের সাতটা Booking। এই পুনরাবৃত্তি শুধু জায়গা নষ্ট করে না, তিন রকম বিপদ
                ডেকে আনে। Database এর ভাষায় এদের বলে Anomaly, মানে অসঙ্গতি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>বদলাতে গিয়ে বিপদ (Update Anomaly):</strong> Rahim ফোন নম্বর বদলালেন। big_bookings এ সেটা
                  তিনটা Row এ বদলাতে হবে। একটা ভুলে গেলে Database একই মানুষের দুটো ফোন নম্বর বলবে, আর কেউ জানবে না
                  কোনটা ঠিক। সাপোর্টের কেউ পুরনো নম্বরে ফোন দেবেন।
                </ListItem>
                <ListItem>
                  <strong>যোগ করতে গিয়ে বিপদ (Insert Anomaly):</strong> Cox&apos;s Bazar Family Package বিক্রির
                  জন্য তৈরি, কিন্তু এখনো তার কোনো Booking নেই। big_bookings এর প্রতিটা Row একটা Booking, তাই
                  Booking ছাড়া ট্যুরটা কোথাও লেখার জায়গাই নেই। Kuakata কে নতুন গন্তব্য হিসেবে যোগ করতেও একই সমস্যা।
                </ListItem>
                <ListItem>
                  <strong>মুছতে গিয়ে বিপদ (Delete Anomaly):</strong> Oliver Bennett এর দুটো Booking ই ধরুন কোনো
                  কারণে মুছে ফেলতে হলো। big_bookings থেকে তাঁর শেষ Row টা মুছে গেলে Oliver নিজেই হারিয়ে যান: তাঁর
                  Email, শহর, কবে Account খুলেছিলেন, কিছুই আর থাকে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তিনটা বিপদের মূল কারণ একটাই: এক Row এ কয়েকটা আলাদা জিনিসের কথা গাদাগাদি করে রাখা। একটা Booking,
                একজন মানুষ আর একটা ট্যুর, তিনটা আলাদা জিনিস, যাদের জীবন আলাদা। মানুষ ফোন বদলান Booking এর কথা না
                ভেবে, ট্যুরের দাম বদলায় কোনো মানুষের কথা না ভেবে। এক Row এ বাঁধলে একজনের বদল আরেকজনের ঘাড়ে পড়ে।
                এই সমস্যা কীভাবে নিয়ম মেনে ঠিক করতে হয়, তার পুরো বিদ্যার নাম Normalization, যেটা পাবেন{" "}
                <Link href="/sql/topic/normalization" className={LINK}>
                  Module 11 এ
                </Link>
                ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Spreadsheet এ অভ্যস্ত হলে সাবধান",
          content: (
            <ContentParagraph>
              Excel বা Google Sheets এ সব কথা এক Sheet এ রাখাই স্বাভাবিক লাগে, কারণ সেখানে খোঁজার কাজটা চোখ
              করে। Database এ এই অভ্যাস নিয়ে এলে প্রথম কয়েক মাস সব ঠিক থাকে, তারপর কোনো একদিন একই Customer এর
              দুটো ঠিকানা বা একই ট্যুরের দুটো দাম ধরা পড়ে, আর কোনটা সত্যি তা কেউ বলতে পারে না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "split-tables",
      subHeader: { index: "003", title: "Split Tables" },
      title: <SectionTitle>প্রতিটা কথা একবার, নিজের জায়গায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর আসল Database ঠিক উল্টো পথে হাঁটে। প্রতিটা আলাদা জিনিসের জন্য আলাদা Table, আর
                প্রতিটা কথা ঠিক একটা জায়গায়। Rahim এর নাম, Email আর ফোন আছে customers Table এর একটা মাত্র Row এ।
                Saint Martin Island Escape এর নাম আর দাম আছে tours Table এর একটা মাত্র Row এ। Booking এর Row এ
                তাঁদের নাম লেখা নেই, আছে শুধু একটা ছোট নম্বর, যেটা বলে &quot;এই Booking ওই Customer এর&quot;।
              </ContentParagraph>
              <ContentParagraph>
                এবার আগের তিনটা বিপদ আবার দেখুন। Rahim ফোন বদলালে একটা Row এর একটা ঘর বদলায়, আর তাঁর তিনটা
                Booking স্বয়ংক্রিয়ভাবে নতুন নম্বর দেখায়, কারণ তারা নম্বরটা নিজেরা রাখে না, Rahim এর Row থেকে নেয়।
                Booking ছাড়াই Family Package tours Table এ বসে আছে, Kuakata বসে আছে destinations এ। Oliver এর
                Booking মুছলেও customers এ Oliver থেকে যান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "এক চওড়া Table", "আলাদা Table (Island Tours যেমন)"],
          rows: [
            ["Rahim এর ফোন কতবার লেখা", "তিনবার, প্রতিটা Booking এ", "একবার, customers এ"],
            ["Saint Martin এর দাম কতবার লেখা", "সাতবার", "একবার, tours এ"],
            ["Rahim ফোন বদলালে", "তিনটা Row বদলাতে হবে, ভুলের সুযোগ", "একটা ঘর বদলায়, বাকিরা নিজে থেকে ঠিক"],
            ["Booking ছাড়া নতুন ট্যুর", "লেখার জায়গা নেই", "tours এ একটা Row"],
            ["শেষ Booking মুছলে", "Customer ও হারিয়ে যান", "Customer থেকে যান"],
            ["Booking এর পাশে নাম দেখতে", "সরাসরি, কারণ সব এক Row এ", "JOIN লাগে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষ লাইনটাই এই মডিউলের কারণ। আলাদা Table এর সব সুবিধার একটা দাম আছে: উত্তরটা ছড়িয়ে থাকে কয়েকটা
              Table এ। প্রশ্ন যদি হয় &quot;Booking 13 কার, তিনি কোন ট্যুরে যাচ্ছেন&quot;, তাহলে উত্তরের টুকরো আছে
              bookings, customers, departures আর tours এ। টুকরোগুলো আবার পাশাপাশি বসানোর কাজটাই JOIN। Database
              এই কাজটা এত দ্রুত আর নির্ভুলভাবে করতে পারে বলেই তথ্য টুকরো করে রাখা লাভজনক।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "keys",
      subHeader: { index: "004", title: "Keys Are the Links" },
      title: <SectionTitle>টুকরোগুলোকে যে সুতো বাঁধে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                টুকরো করে রাখা Table গুলো একে অপরকে চেনে Key দিয়ে। দুই রকম Key এর কথা Module 01 এ শুনেছেন, এখানে
                এক লাইনে আবার মনে করিয়ে দিই, কারণ JOIN পুরোপুরি এই দুটোর উপর দাঁড়িয়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Primary Key:</strong> একটা Table এ প্রতিটা Row এর নিজস্ব পরিচয় নম্বর, যেটা কখনো দুইবার
                  আসে না। customers Table এ customer_id 2 মানে একজনই মানুষ, Nusrat Jahan। ঠিক যেমন জাতীয়
                  পরিচয়পত্রের নম্বর একজন মানুষকেই চেনায়।
                </ListItem>
                <ListItem>
                  <strong>Foreign Key:</strong> আরেক Table এর Primary Key এর একটা কপি, যেটা বলে &quot;আমি ওই
                  Row এর সাথে যুক্ত&quot;। Booking 13 এর customer_id এ লেখা 2, মানে এই Booking টা customers এর Row 2
                  এর। ঠিক যেমন ট্রেনের টিকিটে যাত্রীর পরিচয়পত্রের নম্বর লেখা থাকে, পুরো জীবনবৃত্তান্ত না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের ছবিতে Booking 13 এর আসল Row। এই একটা Row থেকে দুটো তীর বের হয়ে দুটো আলাদা Table এ যায়, আর
                একটা তীর সেখান থেকে আরও এক ধাপ এগোয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <KeyLinksDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো Island Tours Database এ এমন তীর ঠিক সাতটা। প্রতিটা তীর Database এর ভেতরে একটা Foreign Key
              Constraint হিসেবে লেখা আছে, আর Database নিজেই তাদের তালিকা দিতে পারে। নিচের Query টা দেখতে একটু ভয়ের,
              কারণ এটা নিজেই কয়েকটা JOIN ব্যবহার করে Database এর নিজের হিসাবের খাতা পড়ে। এখন ভেতরটা বোঝার দরকার
              নেই, শুধু Run চাপুন আর ফলাফলটা দেখুন: কোন Table এর কোন Column কোন Table এর কোন Column কে দেখায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Island Tours এর সাতটা তীর"
              query={`SELECT kcu.table_name  AS from_table,
       kcu.column_name AS from_column,
       ccu.table_name  AS to_table,
       ccu.column_name AS to_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON kcu.constraint_name = tc.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY from_table, from_column;`}
              caption="সাতটা Row, প্রতিটা একটা Foreign Key: bookings থেকে customers আর departures এ, departures থেকে tours এ, payments আর reviews থেকে bookings এ, আর tours থেকে destinations আর guides এ। খেয়াল করুন, প্রতিটা জোড়ায় দুই দিকের Column এর নাম একই, যেমন customer_id আর customer_id। এই নামকরণের সুবিধা একটু পরে USING এ কাজে লাগবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "JOIN এর জন্য Foreign Key বাধ্যতামূলক না",
          content: (
            <ContentParagraph>
              Foreign Key Constraint Database কে পাহারা দিতে বলে: এমন customer_id ঢুকতে দিও না, যেটার কোনো
              Customer নেই। JOIN এর জন্য এই পাহারা লাগে না, যেকোনো দুটো Column এর মান মিলিয়েই Join হয়। তবে
              বাস্তবে প্রায় সব Join চলে ঠিক এই Foreign Key এর পথ ধরে, কারণ সেটাই Table গুলোর আসল সম্পর্ক। তাই JOIN
              লেখার আগে Foreign Key খোঁজাই সবচেয়ে ভালো অভ্যাস।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "reading-the-map",
      subHeader: { index: "005", title: "Reading the Map" },
      title: <SectionTitle>লেখার আগে পথ ঠিক করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অভিজ্ঞ Developer রা JOIN লেখার আগে একটা কাজ করেন, যেটা নতুনরা প্রায়ই বাদ দেন: Database এর মানচিত্র
                দেখে পথ ঠিক করা। মানচিত্র মানে নিচের মতো একটা ছবি, যেখানে প্রতিটা Table একটা বাক্স আর প্রতিটা
                Foreign Key একটা দাগ। এই ধরনের ছবিকে ER Diagram বলে, যার পুরো বিদ্যা Module 11 এ। আজ শুধু পড়তে
                শিখলেই চলবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                যেকোনো প্রশ্নের জন্য পথ ঠিক করার তিনটা ধাপ আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রশ্নটা কোথা থেকে শুরু:</strong> প্রশ্নটা কীসের সম্পর্কে? &quot;Booking 13 কার&quot;
                  প্রশ্নটা একটা Booking নিয়ে, তাই শুরু bookings থেকে।
                </ListItem>
                <ListItem>
                  <strong>উত্তরটা কোথায় থাকে:</strong> যে Column টা দেখাতে চান, সেটা কোন Table এ? Customer এর
                  নাম থাকে customers এ।
                </ListItem>
                <ListItem>
                  <strong>মাঝের দাগগুলো:</strong> মানচিত্রে শুরুর Table থেকে উত্তরের Table পর্যন্ত দাগ ধরে হাঁটুন।
                  পথে যে Table গুলো পড়ে, সবগুলো লাগবে, এমনকি যেগুলো থেকে কোনো Column দেখাবেন না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শেষ কথাটা সবচেয়ে গুরুত্বপূর্ণ। &quot;Booking 13 কোন ট্যুরের&quot; প্রশ্নে departures থেকে কিছু
                দেখানোর দরকার নেই, তবু departures লাগবে, কারণ Booking ট্যুরকে সরাসরি চেনে না। Booking চেনে একটা
                নির্দিষ্ট তারিখকে, আর তারিখ চেনে ট্যুরকে। মাঝের Table বাদ দিলে পথ ভেঙে যায়। নিচের ছোট খেলায় কয়েকটা
                প্রশ্ন বেছে দেখুন, কোনটায় কয়টা Table লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <JoinPathLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "পথের দৈর্ঘ্য Query এর দৈর্ঘ্য",
          content: (
            <ContentParagraph>
              পথে যতগুলো দাগ, Query তে ততগুলো JOIN। দুই Table মানে একটা JOIN, পাঁচ Table মানে চারটা। এই লেসনে
              আপনি শুধু এক দাগের পথ লিখবেন। লম্বা পথ এক Query তে লেখার কৌশল আর তার ফাঁদগুলো{" "}
              <Link href="/sql/topic/multi-table-joins" className={LINK}>
                Lesson 07
              </Link>{" "}
              এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "pairing-rows",
      subHeader: { index: "006", title: "Pairing Rows" },
      title: <SectionTitle>হাতে হাতে জোড়া লাগানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                JOIN লেখার আগে কাজটা একবার হাতে করে দেখা যাক, ঠিক তানিম যেভাবে করেছিলেন। Booking 13 এর Customer কে?
                প্রথম Query তে Booking এর Row থেকে customer_id পড়ি, দ্বিতীয় Query তে সেই নম্বর দিয়ে customers এ খুঁজি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই ধাপে খোঁজা"
              query={`SELECT booking_id, customer_id, departure_id
FROM bookings
WHERE booking_id = 13;

SELECT customer_id, full_name, phone
FROM customers
WHERE customer_id = 2;`}
              caption="প্রথম Query বলে Booking 13 এর customer_id 2। দ্বিতীয় Query তে সেই 2 বসিয়ে পাই Nusrat Jahan আর তাঁর ফোন। কাজটা হলো, কিন্তু দ্বিতীয় Query তে 2 সংখ্যাটা আপনাকে হাতে লিখতে হয়েছে, প্রথম ফলাফল দেখে। ২৪টা Booking হলে ২৪ বার।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                JOIN ঠিক এই কাজটাই করে, শুধু মানুষের হাত ছাড়া আর সব Row এর জন্য একসাথে। ভাবুন একটা বিয়েবাড়ির
                অভ্যর্থনা টেবিলের কথা। একজনের হাতে অতিথিদের কার্ড, প্রতিটা কার্ডে একটা টেবিল নম্বর। আরেকজনের কাছে
                টেবিলের তালিকা। প্রতিটা কার্ড হাতে নিয়ে তিনি টেবিল নম্বরটা মেলান, আর মিলে গেলে অতিথিকে সেই টেবিলে
                বসান। কার্ড আর টেবিল আলাদা খাতায় লেখা ছিল, নম্বর দুটোকে জোড়া লাগাল।
              </ContentParagraph>
              <ContentParagraph>
                Database এর ভাষায়: bookings এর প্রতিটা Row এর জন্য customers এ সেই Row খোঁজা হয়, যার customer_id
                Booking এর customer_id এর সমান। প্রতিটা মিল একটা জোড়া, আর প্রতিটা জোড়া ফলাফলের একটা Row। নিচের খেলায়
                কাজটা একটা একটা Booking করে চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PairingLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              খেলাটা শেষ পর্যন্ত চালালে তিনটা জিনিস চোখে পড়ে, যেগুলো এই পুরো মডিউল জুড়ে বারবার আসবে। এক, ফলাফলের
              প্রতিটা Row একটা জোড়া, তাই Rahim তিনবার আসেন, তিনটা Booking এর সাথে তিনটা জোড়া। দুই, Imran Kabir কোনো
              জোড়া পান না, কারণ কোনো Booking এর হাতে তাঁর নম্বর নেই। তিন, ভুল শর্ত দিলে Database কোনো আপত্তি করে না,
              শুধু ভুল জোড়া লাগায়। এই তিনটার প্রথমটা পরের লেসনে, দ্বিতীয়টা Lesson 03 এ, আর তৃতীয়টা এই লেসনের ON
              অংশেই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "first-join",
      subHeader: { index: "007", title: "Your First Join" },
      title: <SectionTitle>পাঁচটা Query থেকে একটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আসল জিনিস। নিচের Query টা প্রতিটা Booking এর পাশে তার Customer এর নাম বসায়। প্রথমবার পড়লে মনে
                হতে পারে অনেক নতুন শব্দ, কিন্তু আসলে নতুন শুধু তিনটা জিনিস। লাইন ধরে পড়ি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "first-join.sql",
          code: `SELECT b.booking_id, c.full_name             -- কোন Column দেখাব, কোন Table থেকে
FROM bookings b                                  -- শুরু bookings থেকে, ছোট নাম b
JOIN customers c                                 -- জোড়া লাগবে customers এর সাথে, ছোট নাম c
  ON c.customer_id = b.customer_id;              -- শর্ত: দুই দিকের customer_id সমান`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>JOIN customers:</strong> FROM এর Table এর সাথে আরেকটা Table যোগ করা। এখানে JOIN শব্দটা আসলে
                  INNER JOIN এর ছোট রূপ, যার পুরো গল্প{" "}
                  <Link href="/sql/topic/inner-join" className={LINK}>
                    পরের লেসনে
                  </Link>
                  ।
                </ListItem>
                <ListItem>
                  <strong>b আর c:</strong> Table এর ছোট নাম, যাকে Alias বলে। bookings কে b, customers কে c। একটু পরেই
                  এর আলাদা অংশ আছে।
                </ListItem>
                <ListItem>
                  <strong>ON:</strong> জোড়া লাগার শর্ত। কোন Row কোন Row এর সাথে জোড়া পাবে, সেটা এখানেই ঠিক হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                SELECT এ <code className={CODE}>b.booking_id</code> মানে bookings Table এর booking_id, আর{" "}
                <code className={CODE}>c.full_name</code> মানে customers Table এর full_name। ফলাফলে দুই Table এর
                Column পাশাপাশি বসে, যেন একটাই Table। এবার চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম JOIN"
              query={`SELECT b.booking_id, b.status, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
ORDER BY b.booking_id;`}
              caption="২৪টা Row, প্রতিটা Booking এর জন্য একটা, প্রতিটার পাশে তার Customer এর নাম। Booking 13 এর পাশে Nusrat Jahan, ঠিক যেমন দুই ধাপে খুঁজে পেয়েছিলেন। Booking 1, 8 আর 17 এর পাশে Rahim Uddin। একটা Query, কোনো হাতে লেখা নম্বর নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিজে লিখুন। উপরের Query টা দেখে লিখতে পারেন, কিন্তু চেষ্টা করুন প্রতিটা অংশ কেন আছে তা মনে মনে
              বলে লিখতে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  প্রতিটা Booking এর <code className={CODE}>booking_id</code> আর সেই Booking এর Customer এর{" "}
                  <code className={CODE}>full_name</code> দেখান। দুটো Column, এই ক্রমে। Row এর ক্রম যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  শুরু <code className={CODE}>FROM bookings b</code> থেকে, তারপর{" "}
                  <code className={CODE}>JOIN customers c ON c.customer_id = b.customer_id</code>।
                </>
              }
              solution={`SELECT b.booking_id, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "aliases",
      subHeader: { index: "008", title: "Table Aliases" },
      title: <SectionTitle>ছোট নাম, আর কোন Table এর Column</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এক Table এর Query তে Column এর নাম লিখলেই চলত, কারণ Column টা কোন Table এর, সেই প্রশ্ন ওঠে না।
                দুটো Table এলে প্রশ্নটা ওঠে। bookings আর customers দুটোতেই customer_id নামে Column আছে। SELECT এ শুধু
                customer_id লিখলে Database বুঝতে পারে না কোনটা চান। নিচে চালিয়ে দেখুন সে কী বলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই Table এ একই নাম"
              query={`SELECT customer_id, full_name
FROM bookings
JOIN customers ON customers.customer_id = bookings.customer_id;`}
              caption="ERROR: column reference &quot;customer_id&quot; is ambiguous। Ambiguous মানে দ্ব্যর্থক: দুইভাবে পড়া যায়। এখানে দুটো customer_id এর মান সবসময় সমান, তবু Database নিজে থেকে বেছে নেয় না, আপনাকে বলতে হয় কোনটা। ঠিক করতে প্রথম লাইনে লিখুন customers.customer_id, তারপর আবার চালান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Column এর আগে Table এর নাম আর একটা বিন্দু বসালে তাকে Qualified Name বলে, যেমন{" "}
                <code className={CODE}>customers.customer_id</code>। এতে আর কোনো দ্বিধা থাকে না। কিন্তু প্রতিটা
                Column এর আগে পুরো Table এর নাম লিখলে Query লম্বা হয়ে যায়, পড়তেও কষ্ট। তাই Table কে একটা ছোট নাম
                দেওয়া হয়, যাকে Table Alias বলে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>FROM bookings b</code> আর <code className={CODE}>FROM bookings AS b</code>{" "}
                  একই কথা। AS শব্দটা ঐচ্ছিক।
                </ListItem>
                <ListItem>
                  Alias সাধারণত Table এর নামের প্রথম অক্ষর: bookings এর b, customers এর c, tours এর t। দুটো Table এর
                  প্রথম অক্ষর এক হলে একটু লম্বা নাম নিন, যেমন departures এর d আর destinations এর dst।
                </ListItem>
                <ListItem>
                  একবার Alias দিলে সেই Query তে Table এর আসল নাম আর চলে না, শুধু Alias। এটা অনেককে প্রথমবার অবাক করে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Alias দেওয়ার পর আসল নাম"
              query={`SELECT bookings.booking_id, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;`}
              caption="ERROR: invalid reference to FROM-clause entry for table &quot;bookings&quot;। FROM এ bookings এর নাম এখন b, তাই এই Query র ভেতরে bookings নামটা আর কোনো Table কে চেনায় না। bookings.booking_id কে b.booking_id করলেই চলবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সব Column এর আগে Alias, নাম এক না হলেও",
          content: (
            <ContentParagraph>
              full_name শুধু customers এ আছে, তাই শুধু full_name লিখলেও Query চলবে। তবু অভিজ্ঞরা সব Column এর আগে
              Alias বসান। কারণ ছয় মাস পরে কেউ bookings এ full_name নামে নতুন একটা Column যোগ করলে Alias ছাড়া লেখা
              পুরনো Query টা হঠাৎ ambiguous Error দিয়ে থেমে যাবে। আর যিনি পরে Query টা পড়বেন, তিনিও এক নজরে বোঝেন
              কোন Column কোথা থেকে এল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              starter={`SELECT booking_id, customer_id, full_name
FROM bookings
JOIN customers ON customers.customer_id = bookings.customer_id;`}
              task={
                <>
                  নিচের Query টা ambiguous Error দেয়। ঠিক করুন: প্রতিটা Booking এর{" "}
                  <code className={CODE}>booking_id</code>, <code className={CODE}>customer_id</code> আর{" "}
                  <code className={CODE}>full_name</code>, এই তিনটা Column এই ক্রমে। Alias দিয়ে লিখুন, b আর c।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM bookings b JOIN customers c</code>, তারপর SELECT এ{" "}
                  <code className={CODE}>b.booking_id, b.customer_id, c.full_name</code>।
                </>
              }
              solution={`SELECT b.booking_id, b.customer_id, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "on-condition",
      subHeader: { index: "009", title: "The ON Condition" },
      title: <SectionTitle>কে কার সাথে জোড়া পাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                JOIN এর সবচেয়ে গুরুত্বপূর্ণ অংশ ON এর পরের শর্তটা। Database দুই Table এর প্রতিটা সম্ভাব্য জোড়া নিয়ে
                এই শর্ত পরীক্ষা করে, আর শুধু যেখানে শর্ত সত্য সেই জোড়াগুলো রাখে। বাস্তবে Database এর চেয়ে অনেক
                বুদ্ধিমান উপায়ে খোঁজে, সেটা Module 13 এ দেখবেন, কিন্তু ফলাফল ঠিক এই নিয়মের মতোই।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  শর্তে দুই পাশে কোনটা আগে লেখেন তাতে কিছু যায় আসে না।{" "}
                  <code className={CODE}>c.customer_id = b.customer_id</code> আর{" "}
                  <code className={CODE}>b.customer_id = c.customer_id</code> হুবহু একই জোড়া দেয়।
                </ListItem>
                <ListItem>
                  স্বাভাবিক শর্ত হলো Foreign Key = Primary Key: এক পাশে যে Column টা অন্য Table কে দেখায়, অন্য পাশে
                  সেই Table এর Primary Key। মানচিত্রের দাগ ঠিক এই জোড়াটাই বলে।
                </ListItem>
                <ListItem>
                  ON বাদ দিলে PostgreSQL Query টাই নেয় না: syntax error। কারণ শর্ত ছাড়া JOIN মানে প্রতিটা Row এর সাথে
                  প্রতিটা Row, যেটা একটা আলাদা জিনিস, নাম CROSS JOIN, যার লেসন{" "}
                  <Link href="/sql/topic/cross-join" className={LINK}>
                    Lesson 05
                  </Link>
                  ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সবচেয়ে বিপজ্জনক ভুলটা অবশ্য ON বাদ দেওয়া না, ভুল Column জোড়া দেওয়া। নিচের বক্সে একই Query দুইবার:
                একবার ঠিক জোড়া দিয়ে, একবার bookings এর booking_id কে ভুল করে customers এর customer_id এর সাথে মিলিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ঠিক জোড়া আর ভুল জোড়া"
              query={`SELECT count(*) AS right_pairs
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;

SELECT count(*) AS wrong_pairs
FROM bookings b
JOIN customers c ON c.customer_id = b.booking_id;

SELECT b.booking_id, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.booking_id
WHERE b.booking_id = 13;`}
              caption="ঠিক শর্তে ২৪টা জোড়া, ভুল শর্তে ১৫টা, আর কোনো Error নেই। ভুল শর্তে Booking 13 এর পাশে বসেছেন Shuvo Das, কারণ Database Booking এর নিজের নম্বর 13 কে Customer এর নম্বর ভেবেছে। অথচ Booking 13 আসলে Nusrat Jahan এর। দুটো Column ই সংখ্যা, তাই Database এর চোখে তুলনাটা পুরোপুরি বৈধ। কোন Column কোন Column এর সাথে মেলে, সেটা শুধু আপনি জানেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "প্রতিটা JOIN এর পর Row গুনুন",
          content: (
            <ContentParagraph>
              ভুল ON কে ধরার সবচেয়ে সহজ উপায় Row গোনা। bookings এ ২৪টা Row, প্রতিটা Booking এর ঠিক একজন Customer, তাই
              ঠিক Join এ ২৪টা জোড়াই আসার কথা। ১৫ বা ৩৬০ দেখলে থামুন, শর্তটা আবার পড়ুন। কতগুলো Row আসা উচিত, Query
              চালানোর আগেই মনে মনে আন্দাজ করার অভ্যাস এই মডিউলে সবচেয়ে কাজের অভ্যাস।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একটা নতুন জোড়া নিজে লিখুন। মানচিত্রে departures থেকে tours এ একটা দাগ আছে: departures এর tour_id
              দেখায় tours এর tour_id কে।
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
                  প্রতিটা Departure এর <code className={CODE}>departure_id</code>,{" "}
                  <code className={CODE}>starts_on</code>, আর সেই Departure যে ট্যুরের তার{" "}
                  <code className={CODE}>title</code>। তিনটা Column, এই ক্রমে। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM departures d JOIN tours t ON t.tour_id = d.tour_id</code>। কয়টা Row
                  আসা উচিত, আগে আন্দাজ করুন: departures এ কয়টা Row?
                </>
              }
              solution={`SELECT d.departure_id, d.starts_on, t.title
FROM departures d
JOIN tours t ON t.tour_id = d.tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "using",
      subHeader: { index: "010", title: "USING" },
      title: <SectionTitle>নাম এক হলে ছোট করে লেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর সাতটা Foreign Key এর প্রত্যেকটায় দুই পাশের Column এর নাম এক: customer_id আর
                customer_id, booking_id আর booking_id। এমন হলে ON এর একটা ছোট রূপ আছে, USING। শুধু Column এর নামটা
                বন্ধনীর ভেতর একবার লিখলেই হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "on-vs-using.sql",
          code: `-- ON দিয়ে
SELECT b.booking_id, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;

-- USING দিয়ে, একই জোড়া
SELECT b.booking_id, c.full_name
FROM bookings b
JOIN customers c USING (customer_id);`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দুটো Query একই জোড়া দেয়। পার্থক্যটা ধরা পড়ে <code className={CODE}>SELECT *</code> এ: ON দুই Table এর
              সব Column দেয়, তাই customer_id দুইবার আসে। USING জানে দুটোর মান সবসময় সমান, তাই একবারই রাখে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <OnVsUsingSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="SELECT * দুইভাবে"
              query={`SELECT *
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.booking_id = 13;

SELECT *
FROM bookings b
JOIN customers c USING (customer_id)
WHERE b.booking_id = 13;`}
              caption="প্রথম ফলাফলে ১৪টা Column, customer_id দুইবার: একবার bookings এর পরে, একবার customers এর শুরুতে। দ্বিতীয় ফলাফলে ১৩টা Column, customer_id একবার, সবার আগে। Row একটাই, Booking 13 আর Nusrat Jahan।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  USING চলে শুধু তখন, যখন দুই পাশের Column এর নাম হুবহু এক। ধরুন কোনো Database এ bookings এর Column
                  এর নাম customer আর customers এর customer_id। তখন ON ছাড়া উপায় নেই।
                </ListItem>
                <ListItem>
                  USING এর পরে মেলানোর Column টা Alias ছাড়াও লেখা যায়: শুধু customer_id লিখলে আর ambiguous Error আসে না,
                  কারণ দুটো এখন একটাই Column।
                </ListItem>
                <ListItem>
                  একটা আরও ছোট রূপ আছে, NATURAL JOIN, যেটা নাম মেলে এমন সব Column নিজে থেকে মিলিয়ে দেয়। শুনতে
                  আরামদায়ক, কিন্তু বিপজ্জনক। কেন, সেটা পরের লেসনে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই ট্র্যাকে দুটোই দেখবেন। শেখার সময় ON বেশি স্পষ্ট, কারণ কোন Column কোন Column এর সাথে মেলে সেটা চোখের
                সামনে থাকে। নাম এক হলে USING ছোট আর পরিষ্কার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  প্রতিটা Payment এর <code className={CODE}>payment_id</code>, তার{" "}
                  <code className={CODE}>method</code>, আর সেই Payment যে Booking এর তার{" "}
                  <code className={CODE}>status</code>। তিনটা Column, এই ক্রমে। এবার USING দিয়ে লিখুন। Row এর ক্রম
                  যেকোনো।
                </>
              }
              hint={
                <>
                  payments আর bookings দুটোতেই <code className={CODE}>booking_id</code> আছে:{" "}
                  <code className={CODE}>JOIN bookings b USING (booking_id)</code>। আর দুটোতেই status নামে Column আছে,
                  তাই b.status লিখতে ভুলবেন না।
                </>
              }
              solution={`SELECT p.payment_id, p.method, b.status
FROM payments p
JOIN bookings b USING (booking_id);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "result-table",
      subHeader: { index: "011", title: "The Result Table" },
      title: <SectionTitle>জোড়ার তালিকাও একটা Table</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এ দেখেছিলেন, প্রতিটা SELECT এর ফলাফল নিজেই একটা Table। JOIN এর বেলাতেও তাই। JOIN এর ফলাফল
                একটা নতুন অস্থায়ী Table, যার Column দুই Table থেকে আসে আর যার প্রতিটা Row একটা জোড়া। তাই এই ফলাফলের
                উপর আগের সব বিদ্যা খাটে: WHERE দিয়ে ছাঁকা, ORDER BY দিয়ে সাজানো, GROUP BY দিয়ে দলে ভাগ করা। নিচে
                শুধু Rahim এর Booking গুলো, তাঁর নাম দিয়ে খুঁজে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাম দিয়ে Booking খোঁজা"
              query={`SELECT b.booking_id, c.full_name, b.departure_id, b.status
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE c.full_name = 'Rahim Uddin'
ORDER BY b.booking_id;`}
              caption="তিনটা Row: Booking 1, 8 আর 17। WHERE এ এমন একটা Column ব্যবহার হয়েছে, full_name, যেটা bookings এ নেই, এসেছে JOIN এর মাধ্যমে customers থেকে। Module 05 এ এই প্রশ্নের জন্য আগে customer_id জানতে হতো। Rahim এর নাম তিনবার এসেছে, প্রতিটা জোড়ায় একবার। Database এ নামটা লেখা একবারই, ফলাফলে দেখায় তিনবার।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ কথাটা মনে রাখার মতো: Database এ একবার লেখা তথ্য JOIN এর ফলাফলে বারবার দেখা দিতে পারে। এটা
                পুনরাবৃত্তি না, কারণ এটা জমা থাকে না, শুধু দেখানো হয়। Rahim ফোন বদলালে পরের বার এই Query তিনটা Row এই
                নতুন নম্বর দেখাবে। এক দিকের একটা Row অন্য দিকের অনেক Row এর সাথে জোড়া পেলে তার কী প্রভাব, বিশেষ করে
                যোগফলে, সেটা পরের লেসনের বড় বিষয়।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা জিনিস ফলাফলে নেই, আর সেটা চোখে পড়ে শুধু গুনলে। নিচের বক্স দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কে নেই?"
              query={`SELECT count(*) AS pairs,
       count(DISTINCT b.customer_id) AS customers_in_result
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;

SELECT count(*) AS all_customers
FROM customers;`}
              caption="জোড়া ২৪টা, কিন্তু ফলাফলে আছেন ১৪ জন Customer, অথচ customers Table এ ১৫ জন। যিনি নেই তিনি Imran Kabir, যাঁর এখনো কোনো Booking নেই। জোড়া না পেলে তিনি এই ধরনের Join এর ফলাফলে আসেন না। এটা কখন ঠিক আর কখন বিপদ, আর তাঁকে কীভাবে ফলাফলে রাখা যায়, সেটা Lesson 02 আর 03 এর গল্প।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  প্রতিটা ট্যুরের <code className={CODE}>title</code> আর সেই ট্যুর যে জায়গায় যায় তার নাম, অর্থাৎ
                  destinations এর <code className={CODE}>name</code>। দুটো Column, এই ক্রমে। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  tours এর <code className={CODE}>destination_id</code> দেখায় destinations এর{" "}
                  <code className={CODE}>destination_id</code> কে। দুই Table এর প্রথম অক্ষর আলাদা, t আর d।
                </>
              }
              solution={`SELECT t.title, d.name
FROM tours t
JOIN destinations d ON d.destination_id = t.destination_id;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ফলাফলে নয়টা Row আসার কথা, প্রতিটা ট্যুরের জন্য একটা। Saint Martin&apos;s Island, Cox&apos;s Bazar আর
              Sylhet প্রতিটা দুইবার আসে, কারণ প্রতিটায় দুটো করে ট্যুর। আর destinations এর সাতটা জায়গার মধ্যে একটা,
              Kuakata, একবারও আসে না। কেন, সেটা এখন আপনি নিজেই বলতে পারবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "looking-ahead",
      subHeader: { index: "012", title: "Looking Ahead" },
      title: <SectionTitle>এক দাগ পেরিয়ে আরেক দাগ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শুরুর প্রশ্নটা মনে আছে? &quot;Booking 13 কোন ট্যুরের।&quot; মানচিত্রে পথটা দুই দাগের: bookings থেকে
                departures, departures থেকে tours। এক Query তে একটার পর একটা JOIN বসিয়ে পুরো পথটা হাঁটা যায়। নিচের
                বক্সটা শুধু এক ঝলক দেখার জন্য, পুরো কৌশল আর তার ফাঁদগুলো Lesson 07 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই দাগের পথ, এক ঝলক"
              query={`SELECT b.booking_id, t.title, d.starts_on
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t      ON t.tour_id      = d.tour_id
WHERE b.booking_id = 13;`}
              caption="Booking 13, Saint Martin Island Escape, যাত্রা 2026-11-20। departures থেকে শুধু তারিখটা দেখানো হয়েছে, কিন্তু Table টা না থাকলে পথ ভেঙে যেত। প্রতিটা নতুন JOIN আগের জোড়ার ফলাফলের সাথে আরেকটা Table জোড়া লাগায়, ঠিক মানচিত্রের দাগ ধরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের বাকি লেসনগুলো এই ভিতের উপর দাঁড়িয়ে। Lesson 02 এ INNER JOIN এর পুরো নিয়ম, আর জোড়া লাগার
              পরে GROUP BY দিয়ে নামসহ Report। Lesson 03 এ যাঁরা জোড়া পান না তাঁদের রাখার উপায়। তারপর দুই দিকেই
              রাখা, সব জোড়া একসাথে, একই Table কে নিজের সাথে জোড়া, লম্বা পথ, আর &quot;আছে কি নেই&quot; ধরনের প্রশ্ন।
              প্রতিটা লেসনে একই প্রশ্ন ফিরে আসবে: কোন Row কার সাথে জোড়া পায়, আর যে পায় না তার কী হয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ একই কথা, একটা বড় ব্যতিক্রমসহ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের প্রায় সব কিছু MySQL এ হুবহু চলে: JOIN ... ON, Table Alias, USING, আর USING এর পরে মেলানোর
                Column একবার আসা। Error এর লেখা আলাদা, অর্থ এক। একটা জায়গায় MySQL অনেক বেশি উদার, আর সেটাই বিপদ: ON
                ছাড়া JOIN।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ON ভুলে গেলে PostgreSQL কী করে"
              query={`SELECT b.booking_id, c.full_name
FROM bookings b
JOIN customers c;`}
              caption="PostgreSQL এখানে থামিয়ে দেয়। এই বক্সে লেখা আসে syntax error at end of input, আর psql এ একই Query দিলে আসে syntax error at or near &quot;;&quot;। দুটোর অর্থ এক: JOIN এর পরে ON বা USING আশা করছিল, পেল Query র শেষ। MySQL 8.4 এ ঠিক একই Query চলে, আর ৩৬০টা Row দেয়: ২৪টা Booking গুণ ১৫ জন Customer, প্রতিটা Booking এর সাথে প্রতিটা Customer।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["JOIN ... ON, Alias, USING", "চলে", "চলে, একই নিয়মে"],
            ["ON ছাড়া JOIN", "syntax error", "চলে, প্রতিটা Row এর সাথে প্রতিটা Row (৩৬০টা)"],
            ["একই নাম দুই Table এ", "column reference \"customer_id\" is ambiguous", "ERROR 1052: Column 'customer_id' in field list is ambiguous"],
            ["Alias এর পরে আসল নাম", "invalid reference to FROM-clause entry for table \"bookings\"", "ERROR 1054: Unknown column 'bookings.booking_id' in 'field list'"],
            ["USING এর পরে SELECT *", "মেলানোর Column একবার, সবার আগে", "একই: মেলানোর Column একবার, সবার আগে"],
            ["ভুল Column এর জোড়া", "কোনো Error নেই, ১৫টা ভুল জোড়া", "কোনো Error নেই, ১৫টা ভুল জোড়া"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ JOIN, INNER JOIN আর CROSS JOIN একই শব্দ",
          content: (
            <ContentParagraph>
              MySQL এর Manual নিজেই বলে, MySQL এ JOIN, CROSS JOIN আর INNER JOIN একে অপরের জায়গায় বসানো যায়, যদিও SQL
              Standard এ তারা আলাদা। তাই MySQL এ ON লিখতে ভুলে গেলে কোনো সতর্কতা আসে না, শুধু একটা বিশাল ফলাফল আসে।
              ছোট Table এ সেটা ৩৬০ Row, লাখ Row এর দুটো Table এ সেটা Server থামিয়ে দেওয়ার মতো। MySQL দিয়ে কোনো ভিডিও
              ফলো করলে প্রতিটা JOIN এর নিচে ON আছে কিনা, একবার চোখ বুলিয়ে নিন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Admin Panel এর প্রতিটা তালিকায় JOIN</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Admin Panel খুললে প্রায় কোনো তালিকাই এক Table থেকে আসে না। Booking এর তালিকায় Customer
                এর নাম দরকার, Payment এর তালিকায় Booking এর অবস্থা, Departure এর তালিকায় ট্যুরের নাম। প্রতিটা তালিকার
                পেছনে অন্তত একটা JOIN। হিসাব বিভাগের নাবিলা প্রতিদিন যে Payment এর তালিকা দেখেন, তার প্রথম সংস্করণে
                একটা মজার ভুল ছিল। নিচের বক্সের প্রথম Query টা চালান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাবিলার Payment তালিকা"
              query={`SELECT payment_id, status
FROM payments p
JOIN bookings b USING (booking_id);

SELECT p.payment_id, p.method, p.amount_bdt,
       p.status AS payment_status,
       b.status AS booking_status
FROM payments p
JOIN bookings b USING (booking_id)
ORDER BY p.payment_id;`}
              caption="প্রথম Query থামে: column reference &quot;status&quot; is ambiguous। payments এর status মানে টাকার অবস্থা (paid, refunded, failed), bookings এর status মানে Booking এর অবস্থা। নাম এক, অর্থ আলাদা। দ্বিতীয় Query দুটোকেই আলাদা নামে দেখায়: ১৯টা Row। Payment 5 refunded, তার Booking cancelled। Payment 13 failed, তার Booking pending। খেয়াল করুন, payment_id আর booking_id আলাদা নম্বর: Payment 13 আসলে Booking 14 এর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার এই লেসনের শুরুর কাজটা, ফারুক সাহেবের রবিবারের ফোনের তালিকা, যেটা তানিম পাঁচটা Query তে করেছিলেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              orderMatters
              task={
                <>
                  সব pending Booking এর <code className={CODE}>booking_id</code>, Customer এর{" "}
                  <code className={CODE}>full_name</code> আর <code className={CODE}>phone</code>। তিনটা Column, এই
                  ক্রমে, booking_id অনুযায়ী ছোট থেকে বড়।
                </>
              }
              hint={
                <>
                  JOIN এর পরে <code className={CODE}>WHERE b.status = &apos;pending&apos;</code>, শেষে{" "}
                  <code className={CODE}>ORDER BY b.booking_id</code>। চারটা Row আসা উচিত।
                </>
              }
              solution={`SELECT b.booking_id, c.full_name, c.phone
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.status = 'pending'
ORDER BY b.booking_id;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              চারটা Row: Kamal Hasan, Rahim Uddin, Priya Sharma আর Shuvo Das। Priya Sharma র ফোন NULL, তাঁকে ফোন করা যাবে
              না, Email করতে হবে। Module 04 এর COALESCE দিয়ে সেখানে &quot;No phone&quot; লেখা যায়। শেষে একটা কঠিন কাজ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              orderMatters
              task={
                <>
                  মালিক জানতে চান, October 2026 এ যে Booking গুলো এসে confirmed হয়েছে, সেগুলো কারা করেছেন আর কোন শহর
                  থেকে। দেখান <code className={CODE}>booking_id</code>, Customer এর{" "}
                  <code className={CODE}>full_name</code>, <code className={CODE}>city</code>, আর Booking এর{" "}
                  <code className={CODE}>booked_at</code>। চারটা Column, এই ক্রমে, booked_at অনুযায়ী পুরনো থেকে নতুন।
                  October মানে 1 October 2026 থেকে 1 November 2026 এর আগ পর্যন্ত।
                </>
              }
              hint={
                <>
                  দুটো শর্ত AND দিয়ে: <code className={CODE}>b.status = &apos;confirmed&apos;</code>, আর{" "}
                  <code className={CODE}>b.booked_at &gt;= &apos;2026-10-01&apos; AND b.booked_at &lt; &apos;2026-11-01&apos;</code>।
                  তারপর <code className={CODE}>ORDER BY b.booked_at</code>।
                </>
              }
              solution={`SELECT b.booking_id, c.full_name, c.city, b.booked_at
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.status = 'confirmed'
  AND b.booked_at >= '2026-10-01'
  AND b.booked_at <  '2026-11-01'
ORDER BY b.booked_at;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>যেকোনো দুই Table এর JOIN, ছয় ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নটা এক বাক্যে লিখুন",
              description:
                "যেমন: প্রতিটা pending Booking এর পাশে Customer এর নাম আর ফোন। কোন জিনিসের তালিকা চাই, সেটাই শুরুর Table।",
            },
            {
              title: "প্রতিটা Column কোথায় থাকে, খুঁজুন",
              description:
                "booking_id আর status থাকে bookings এ, full_name আর phone থাকে customers এ। দুই Table মানে একটা JOIN।",
            },
            {
              title: "মানচিত্রে দাগটা খুঁজুন",
              description:
                "bookings.customer_id দেখায় customers.customer_id কে। এটাই ON এর শর্ত: Foreign Key = Primary Key।",
            },
            {
              title: "FROM, JOIN, ON লিখুন",
              description:
                "FROM bookings b JOIN customers c ON c.customer_id = b.customer_id। দুই পাশের নাম এক হলে USING (customer_id) ও চলে।",
            },
            {
              title: "Column গুলো Alias সহ লিখুন",
              description:
                "SELECT b.booking_id, c.full_name, c.phone। দুই Table এ এক নামের Column থাকলে Alias ছাড়া ambiguous Error আসবে, আর অর্থও গুলিয়ে যাবে।",
            },
            {
              title: "চালানোর আগে Row গুনুন",
              description:
                "কয়টা Row আসা উচিত, আগে আন্দাজ করুন। প্রতিটা Booking এর ঠিক একজন Customer, তাই WHERE ছাড়া ২৪টা। অন্য সংখ্যা এলে ON আবার পড়ুন।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>প্রথম JOIN এর চেনা ভুলগুলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "ঠিক করার উপায়"],
          rows: [
            [
              "দুই Table এ এক নামের Column, Alias ছাড়া",
              "column reference is ambiguous",
              "b.customer_id বা c.customer_id লিখুন",
            ],
            [
              "Alias দেওয়ার পর Table এর আসল নাম",
              "invalid reference to FROM-clause entry",
              "পুরো Query তে শুধু Alias",
            ],
            ["ON লিখতে ভুলে যাওয়া", "PostgreSQL এ syntax error, MySQL এ সব জোড়া (৩৬০টা)", "প্রতিটা JOIN এর নিচে ON বা USING"],
            [
              "ON এ ভুল Column জোড়া",
              "কোনো Error নেই, ভুল উত্তর (২৪ এর জায়গায় ১৫)",
              "মানচিত্র দেখে Foreign Key = Primary Key, আর Row গোনা",
            ],
            ["মাঝের Table বাদ দেওয়া", "পথ নেই, Query লেখাই যায় না বা ভুল Column মেলে", "মানচিত্রে পুরো পথ হাঁটুন"],
            ["SELECT * দিয়ে JOIN", "একই নামের Column দুইবার, কোনটা কী বোঝা কঠিন", "দরকারি Column নাম ধরে লিখুন"],
            [
              "ধরে নেওয়া সবাই ফলাফলে আসবে",
              "জোড়া না পাওয়া Row (Imran, Kuakata) চুপচাপ বাদ",
              "Row গুনে মিলিয়ে দেখুন, বাকিটা Lesson 03",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজে ভুল করে দেখুন"
              query={`-- নিচের Query টা ঠিক আছে। একটা একটা করে ভুল ঢুকিয়ে দেখুন:
-- ১. SELECT এ b.status কে শুধু status লিখুন
-- ২. ON এর লাইনটা মুছে দিন
-- ৩. ON এ b.customer_id কে b.departure_id করুন
SELECT b.booking_id, b.status, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.status = 'cancelled';`}
              caption="ঠিক অবস্থায় তিনটা Row: Booking 5 (Sabbir Hossain), 12 (Oliver Bennett) আর 18 (Mitu Rahman)। প্রথম ভুলটা এখানে Error দেয় না, কারণ customers এ status নামে Column নেই, শুধু bookings এ আছে। দ্বিতীয়টায় syntax error। তৃতীয়টায় কোনো Error নেই, কিন্তু নামগুলো বদলে যায়, কারণ এবার Departure এর নম্বরকে Customer এর নম্বর ভাবা হচ্ছে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও গভীরে যেতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/tutorial-join.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Tutorial: Joins Between Tables
                  </a>
                  : আবহাওয়ার শহর আর তাপমাত্রার দুই Table দিয়ে Join এর ধারণা, এই লেসনের ঠিক পরের ধাপ পর্যন্ত।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/queries-table-expressions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Table Expressions
                  </a>
                  : Joined Tables অংশে ON, USING আর NATURAL এর আনুষ্ঠানিক সংজ্ঞা, আর USING কেন একই Column দুইবার দেখায়
                  না।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/join.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: JOIN Clause
                  </a>
                  : MySQL এ JOIN, INNER JOIN আর CROSS JOIN এর সমতা, আর USING এর Column কোন ক্রমে আসে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Join_(SQL)"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Join (SQL)
                  </a>
                  : সব ধরনের Join এক পাতায়, ছোট ছোট উদাহরণের Table সহ। পুরো মডিউলের জন্য ভালো সঙ্গী।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=8640s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, Joins এর অংশ
                  </a>
                  : কোর্সটা MySQL দিয়ে। সেখানে কোনো JOIN এর নিচে ON না থাকলে মনে রাখবেন, PostgreSQL সেটা চালাবে না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 18 */
    {
      id: "recap",
      subHeader: { index: "018", title: "Recap" },
      title: <SectionTitle>পাঁচ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  সব কথা এক চওড়া Table এ রাখলে একই তথ্য বারবার লেখা হয়, আর তিন রকম বিপদ আসে: বদলাতে, যোগ করতে আর মুছতে।
                </ListItem>
                <ListItem>
                  Island Tours প্রতিটা জিনিস আলাদা Table এ রাখে, প্রতিটা কথা একবার। দাম: উত্তর ছড়িয়ে থাকে কয়েকটা Table এ।
                </ListItem>
                <ListItem>
                  Table গুলো Key দিয়ে বাঁধা। Foreign Key আরেক Table এর Primary Key কে দেখায়। পুরো Database এ সাতটা এমন দাগ।
                </ListItem>
                <ListItem>
                  JOIN লেখার আগে মানচিত্রে পথ ঠিক করুন: শুরুর Table, উত্তরের Table, আর মাঝের সব Table।
                </ListItem>
                <ListItem>
                  JOIN মানে Row জোড়া লাগানো, যেখানে ON এর শর্ত সত্য। প্রতিটা জোড়া ফলাফলের একটা Row।
                </ListItem>
                <ListItem>
                  Alias Table এর ছোট নাম, আর এক নামের Column দুই Table এ থাকলে Alias বাধ্যতামূলক। Alias দেওয়ার পর আসল নাম
                  চলে না।
                </ListItem>
                <ListItem>
                  ON এ ভুল Column জোড়া দিলে Error আসে না, ভুল উত্তর আসে। প্রতিটা JOIN এর পর Row গুনুন।
                </ListItem>
                <ListItem>
                  দুই পাশের নাম এক হলে USING (column) চলে, আর তখন মেলানোর Column ফলাফলে একবার আসে।
                </ListItem>
                <ListItem>
                  MySQL ON ছাড়া JOIN কে প্রতিটা Row এর সাথে প্রতিটা Row বানিয়ে ফেলে, PostgreSQL থামিয়ে দেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আজ যে JOIN লিখলেন, তার পুরো নাম INNER JOIN। এর একটা নিয়ম এখনো খোলাখুলি বলা হয়নি, শুধু Imran আর Kuakata
                এর অনুপস্থিতিতে চোখে পড়েছে: জোড়া না পেলে Row ফলাফল থেকে বাদ। আর এক দিকের একটা Row অন্য দিকের অনেক
                Row পেলে কী হয়, বিশেষ করে টাকার যোগফলে। দুটোই পরের লেসনে,{" "}
                <Link href="/sql/topic/inner-join" className={LINK}>
                  INNER JOIN
                </Link>
                , যেখানে Module 05 এর Report গুলোতে অবশেষে নম্বরের জায়গায় নাম বসবে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "Island Tours এ"],
    rows: [
      ["এক চওড়া Table", "একই তথ্য বারবার, তিন রকম বিপদ", "Rahim এর ফোন ৩ বার, Saint Martin এর দাম ৭ বার"],
      ["Update Anomaly", "একটা কপি বদলাতে ভুলে গেলে Data দুই কথা বলে", "Rahim এর নতুন ফোন"],
      ["Insert Anomaly", "Booking ছাড়া জিনিস রাখার জায়গা নেই", "Family Package, Kuakata"],
      ["Delete Anomaly", "শেষ Booking এর সাথে মানুষও হারায়", "Oliver Bennett"],
      ["আলাদা Table", "প্রতিটা কথা একবার, নিজের জায়গায়", "customers, tours, bookings ..."],
      ["Primary Key", "Row এর নিজস্ব পরিচয়, কখনো দুইবার না", "customers.customer_id = 2"],
      ["Foreign Key", "আরেক Table এর Primary Key কে দেখায়", "bookings.customer_id = 2"],
      ["মানচিত্রে পথ", "শুরুর Table থেকে উত্তরের Table, মাঝের সবসহ", "bookings, departures, tours"],
      ["JOIN ... ON", "শর্ত মেলে এমন Row জোড়া লাগায়", "c.customer_id = b.customer_id"],
      ["Table Alias", "Table এর ছোট নাম, দেওয়ার পর আসল নাম চলে না", "bookings b, customers c"],
      ["Ambiguous Column", "এক নাম দুই Table এ, কোনটা বলতে হয়", "customer_id, status"],
      ["ভুল ON", "Error নেই, ভুল উত্তর", "২৪ এর জায়গায় ১৫ জোড়া"],
      ["USING", "নাম এক হলে ছোট রূপ, Column একবার", "USING (customer_id)"],
      ["জোড়া না পাওয়া Row", "এই Join এর ফলাফলে আসে না", "Imran Kabir, Kuakata"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Island Tours এর bookings Table এ Customer এর নাম না রেখে শুধু customer_id রাখা হয় কেন?",
        options: [
          {
            key: "A",
            text: "নাম রাখলে Table এ জায়গা কম পড়ে",
            isCorrect: false,
            explanation: "জায়গা একটা ছোট কারণ, আসল কারণ না। আসল সমস্যা একই তথ্যের অনেক কপি আর তাদের অমিল।",
          },
          {
            key: "B",
            text: "যাতে প্রতিটা তথ্য এক জায়গায় একবার থাকে, আর বদলালে একটা জায়গাতেই বদলাতে হয়",
            isCorrect: true,
            explanation:
              "ঠিক। নাম bookings এ রাখলে Rahim এর নাম তিনটা Row এ থাকত। আলাদা রাখলে একবার, আর তিনটা Booking সেখান থেকে নেয়।",
          },
          {
            key: "C",
            text: "PostgreSQL এক Table এ লেখা আর সংখ্যা একসাথে রাখতে দেয় না",
            isCorrect: false,
            explanation: "দেয়। bookings এ status লেখা আর seats সংখ্যা পাশাপাশিই আছে।",
          },
          {
            key: "D",
            text: "নাম গোপন রাখার জন্য",
            isCorrect: false,
            explanation: "নাম customers এ সবার দেখার মতোই আছে। গোপনীয়তার নিয়ম আলাদা বিষয়, Module 16 এ।",
          },
        ],
      },
      {
        id: 2,
        text: "Booking 13 এর Row এ customer_id এর মান 2। এই 2 টা কী?",
        options: [
          {
            key: "A",
            text: "bookings Table এর Primary Key",
            isCorrect: false,
            explanation: "bookings এর Primary Key হলো booking_id, যেটা এখানে 13।",
          },
          {
            key: "B",
            text: "একটা Foreign Key, যা customers Table এর যে Row এর Primary Key 2, তাকে দেখায়",
            isCorrect: true,
            explanation: "ঠিক। এই নম্বরটাই বলে Booking টা Nusrat Jahan এর, আর JOIN এই নম্বর ধরেই জোড়া লাগায়।",
          },
          {
            key: "C",
            text: "Booking এর সিটের সংখ্যা",
            isCorrect: false,
            explanation: "সিটের সংখ্যা থাকে seats Column এ। Booking 13 এ সেটাও 2, কিন্তু সেটা কাকতালীয়।",
          },
          {
            key: "D",
            text: "Customer কয়টা Booking করেছেন",
            isCorrect: false,
            explanation: "Booking এর সংখ্যা গুনতে হয় count(*) দিয়ে, কোনো Column এ জমা থাকে না।",
          },
        ],
      },
      {
        id: 3,
        text: "\"Booking 13 কোন ট্যুরের\" প্রশ্নের উত্তরের জন্য কোন কোন Table লাগবে?",
        options: [
          {
            key: "A",
            text: "শুধু bookings আর tours",
            isCorrect: false,
            explanation: "bookings এ tour_id নেই। Booking সরাসরি ট্যুরকে চেনে না, তাই দুটোর মাঝে কোনো দাগ নেই।",
          },
          {
            key: "B",
            text: "bookings, departures আর tours",
            isCorrect: true,
            explanation:
              "ঠিক। Booking চেনে একটা Departure কে, Departure চেনে ট্যুরকে। departures থেকে কিছু না দেখালেও পথের জন্য সেটা লাগবে।",
          },
          {
            key: "C",
            text: "bookings, customers আর tours",
            isCorrect: false,
            explanation: "customers এ ট্যুরের কোনো তথ্য নেই। এই পথে ট্যুরে পৌঁছানো যায় না।",
          },
          {
            key: "D",
            text: "Island Tours এর সব আটটা Table",
            isCorrect: false,
            explanation: "শুধু পথে পড়া Table গুলো লাগে। বেশি Table যোগ করলে ফলাফল ভুলও হতে পারে।",
          },
        ],
      },
      {
        id: 4,
        text: "FROM bookings b JOIN customers c ON c.customer_id = b.customer_id কী করে?",
        options: [
          {
            key: "A",
            text: "দুই Table কে স্থায়ীভাবে এক Table এ মিশিয়ে দেয়",
            isCorrect: false,
            explanation: "কিছুই স্থায়ী না। JOIN শুধু এই Query র ফলাফলের জন্য একটা অস্থায়ী Table বানায়, আসল Table অপরিবর্তিত।",
          },
          {
            key: "B",
            text: "প্রতিটা Booking কে সেই Customer এর Row এর সাথে জোড়া লাগায়, যার customer_id Booking এর customer_id এর সমান",
            isCorrect: true,
            explanation: "ঠিক। প্রতিটা মিল একটা জোড়া, প্রতিটা জোড়া ফলাফলের একটা Row। Sample Data তে ২৪টা।",
          },
          {
            key: "C",
            text: "প্রতিটা Booking এর সাথে প্রতিটা Customer জোড়া লাগায়",
            isCorrect: false,
            explanation: "সেটা হয় ON ছাড়া, যার নাম CROSS JOIN। ON এর শর্ত শুধু মিলে যাওয়া জোড়াগুলো রাখে।",
          },
          {
            key: "D",
            text: "customers থেকে শুধু তাঁদের দেখায় যাঁদের কোনো Booking নেই",
            isCorrect: false,
            explanation: "উল্টো। যাঁদের Booking নেই, যেমন Imran Kabir, তাঁরা এই Join এর ফলাফলে আসেনই না।",
          },
        ],
      },
      {
        id: 5,
        text: "column reference \"customer_id\" is ambiguous Error টা কী বলে?",
        options: [
          {
            key: "A",
            text: "customer_id নামে কোনো Column নেই",
            isCorrect: false,
            explanation: "Column না থাকলে Error হয় column does not exist। এখানে সমস্যা উল্টো: Column একটা না, দুটো।",
          },
          {
            key: "B",
            text: "দুটো Table এই customer_id আছে, আর আপনি বলেননি কোনটা চান",
            isCorrect: true,
            explanation: "ঠিক। b.customer_id বা c.customer_id লিখলেই চলে যায়, অথবা USING ব্যবহার করলে।",
          },
          {
            key: "C",
            text: "দুই Table এর customer_id এর মান মেলেনি",
            isCorrect: false,
            explanation: "মান না মিললে Error হয় না, শুধু সেই জোড়া ফলাফলে আসে না।",
          },
          {
            key: "D",
            text: "ON এর শর্ত ভুল",
            isCorrect: false,
            explanation: "ON ঠিক থাকলেও এই Error আসে, যদি SELECT এ Table ছাড়া customer_id লেখা হয়।",
          },
        ],
      },
      {
        id: 6,
        text: "FROM bookings b লেখার পর SELECT bookings.booking_id লিখলে PostgreSQL কী করে?",
        options: [
          {
            key: "A",
            text: "ঠিকমতো চালায়, কারণ bookings এখনো Table এর নাম",
            isCorrect: false,
            explanation: "Alias দেওয়ার পর এই Query র ভেতরে Table টার নাম শুধু b।",
          },
          {
            key: "B",
            text: "invalid reference to FROM-clause entry for table \"bookings\" Error দেয়",
            isCorrect: true,
            explanation: "ঠিক। b.booking_id লিখতে হবে। MySQL ও একই কারণে ERROR 1054 দেয়।",
          },
          {
            key: "C",
            text: "bookings Table টা দ্বিতীয়বার যোগ করে নেয়",
            isCorrect: false,
            explanation: "Database নিজে থেকে কোনো Table যোগ করে না। FROM এ যা আছে, শুধু তাই।",
          },
          {
            key: "D",
            text: "booking_id এর জায়গায় NULL দেখায়",
            isCorrect: false,
            explanation: "NULL না, Query টাই চলে না।",
          },
        ],
      },
      {
        id: 7,
        text: "ON c.customer_id = b.booking_id লিখলে কী হয়?",
        options: [
          {
            key: "A",
            text: "PostgreSQL Error দেয়, কারণ Column দুটোর নাম আলাদা",
            isCorrect: false,
            explanation: "নাম আলাদা হলেও দুটোই সংখ্যা, তাই তুলনা বৈধ। কোনো Error নেই।",
          },
          {
            key: "B",
            text: "কোনো Error ছাড়া ভুল জোড়া লাগে: Booking এর নিজের নম্বরকে Customer এর নম্বর ধরা হয়, ১৫টা ভুল জোড়া",
            isCorrect: true,
            explanation: "ঠিক। Booking 13 Shuvo Das এর নামে চলে যায়, আর Booking 16 থেকে 24 কোনো জোড়াই পায় না। Row গুনলে ধরা পড়ে।",
          },
          {
            key: "C",
            text: "ঠিক উত্তরই আসে, কারণ Database নিজে বুঝে নেয়",
            isCorrect: false,
            explanation: "Database কোন Column কোন Column এর সাথে মেলে তা জানে না। আপনি যা লেখেন, তাই করে।",
          },
          {
            key: "D",
            text: "০টা Row আসে",
            isCorrect: false,
            explanation: "১ থেকে ১৫ নম্বর Booking এর জন্য সমান নম্বরের Customer আছে, তাই ১৫টা Row আসে।",
          },
        ],
      },
      {
        id: 8,
        text: "JOIN customers c USING (customer_id) দিয়ে SELECT * করলে customer_id ফলাফলে কয়বার আসে?",
        options: [
          {
            key: "A",
            text: "দুইবার, প্রতিটা Table থেকে একবার",
            isCorrect: false,
            explanation: "এটা ON এর আচরণ, যেখানে মোট ১৪টা Column আসে।",
          },
          {
            key: "B",
            text: "একবার, সবার আগে",
            isCorrect: true,
            explanation: "ঠিক। USING জানে দুটোর মান সবসময় সমান, তাই একটা রাখে আর প্রথমে বসায়। মোট ১৩টা Column।",
          },
          {
            key: "C",
            text: "একবারও না",
            isCorrect: false,
            explanation: "মেলানোর Column বাদ যায় না, শুধু একবার আসে।",
          },
          {
            key: "D",
            text: "Booking এর সংখ্যার সমান বার",
            isCorrect: false,
            explanation: "এটা Row এর কথা, Column এর না। প্রতিটা Row এ customer_id একটা Column হিসেবে একবার।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: টুকরো থেকে তালিকা",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>চওড়া Table এর হিসাব:</strong> এই লেসনের প্রথম বড় Query র ফলাফল দেখে (বা কাগজে) বের করুন, big_bookings
        নামের একটা চওড়া Table এ Saint Martin Island Escape এর দাম কয়টা জায়গায় লেখা থাকত, আর দাম বদলালে কয়টা ঘর বদলাতে
        হতো। আলাদা Table এ কয়টা।
      </span>,
      <span key="2">
        <strong>তিনটা পথ:</strong> মানচিত্র দেখে নিচের তিনটা প্রশ্নের জন্য Table এর তালিকা আর প্রতিটা দাগের ON এর শর্ত লিখুন:
        Payment 13 কার টাকা; Review 4 কোন ট্যুরের; কোন Guide কোন জায়গায় ট্যুর করান।
      </span>,
      <span key="3">
        <strong>Review আর Booking:</strong> প্রতিটা Review এর review_id, rating, আর সেই Booking এর seats আর status, USING দিয়ে।
        কয়টা Row এল, আর কেন ঠিক সেই সংখ্যা।
      </span>,
      <span key="4">
        <strong>ভুল ON এর পরীক্ষা:</strong> bookings আর departures এর Join এ ON এ ইচ্ছা করে b.booking_id = d.departure_id
        লিখুন। কয়টা জোড়া এল, ঠিক Join এ কয়টা, আর পার্থক্যের কারণ তিন লাইনে।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> বিয়েবাড়ির কার্ড আর টেবিলের উদাহরণ দিয়ে একজন বন্ধুকে ছয় লাইনে বোঝান, Database
        কেন তথ্য আলাদা Table এ রাখে আর JOIN কী করে।
      </span>,
    ],
    deliverables: [
      <span key="d1">চওড়া আর আলাদা Table এ দামের কপির সংখ্যা</span>,
      <span key="d2">তিনটা প্রশ্নের Table এর তালিকা আর ON এর শর্ত</span>,
      <span key="d3">Review এর Query, তার ফলাফল আর Row সংখ্যার ব্যাখ্যা</span>,
      <span key="d4">ভুল আর ঠিক ON এর দুটো সংখ্যা আর ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ প্রথম JOIN",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "সাতটা তীর",
        description:
          "প্রথম ফাইল Foreign Key এর তালিকা দেয়। সাতটা Row মানচিত্রের সাতটা দাগের সাথে মিলিয়ে নিন। psql এ \\d bookings চালালেও নিচের দিকে Foreign-key constraints অংশে একই কথা দেখবেন।",
      },
      {
        title: "হাতে খোঁজা",
        description:
          "দ্বিতীয় ফাইলে দুই ধাপে Booking 13 এর Customer। দ্বিতীয় Query তে নম্বরটা আপনি হাতে বসাচ্ছেন, সেটা খেয়াল করুন।",
      },
      {
        title: "প্রথম JOIN",
        description: "তৃতীয় ফাইলে একই কাজ এক Query তে, ২৪টা Row, আর count(*) দিয়ে Row গোনা।",
      },
      {
        title: "Alias এর দুই Error",
        description:
          "চতুর্থ ফাইলের প্রথম আর শেষ Query Error দেবে। psql এ ON_ERROR_STOP বন্ধ রেখে চালান, দুটো Error এর লেখা খাতায় টুকে রাখুন।",
      },
      {
        title: "ON, USING আর ভুল ON",
        description:
          "পঞ্চম ফাইলে Booking 13 এর SELECT * দুইভাবে। psql এর হেডারে Column গুনুন: ১৪ আর ১৩। তারপর ভুল ON এর ১৫।",
      },
      {
        title: "নতুন তিনটা জোড়া",
        description:
          "ষষ্ঠ ফাইলে তিনটা ভিন্ন দাগের Join: ট্যুর থেকে জায়গা, Departure থেকে ট্যুর, Payment থেকে Booking। প্রতিটার Row সংখ্যা আগে আন্দাজ করুন, তারপর চালান।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-foreign-keys.sql",
        code: `SELECT kcu.table_name  AS from_table,
       kcu.column_name AS from_column,
       ccu.table_name  AS to_table,
       ccu.column_name AS to_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON kcu.constraint_name = tc.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY from_table, from_column;
-- (7 rows)`,
      },
      {
        language: "sql",
        filename: "02-by-hand.sql",
        code: `SELECT booking_id, customer_id, departure_id
FROM bookings
WHERE booking_id = 13;
-- (1 row): 13 | 2 | 8

SELECT customer_id, full_name, phone
FROM customers
WHERE customer_id = 2;
-- (1 row): 2 | Nusrat Jahan | +8801000000102`,
      },
      {
        language: "sql",
        filename: "03-first-join.sql",
        code: `SELECT b.booking_id, b.status, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
ORDER BY b.booking_id;
-- (24 rows), Booking 13 এর পাশে Nusrat Jahan

SELECT count(*) AS pairs
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;
-- (1 row): 24`,
      },
      {
        language: "sql",
        filename: "04-aliases.sql",
        code: `SELECT customer_id, full_name
FROM bookings
JOIN customers ON customers.customer_id = bookings.customer_id;
-- ERROR:  column reference "customer_id" is ambiguous

SELECT b.customer_id, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;
-- (24 rows)

SELECT bookings.booking_id, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;
-- ERROR:  invalid reference to FROM-clause entry for table "bookings"`,
      },
      {
        language: "sql",
        filename: "05-on-using.sql",
        code: `SELECT * FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.booking_id = 13;
-- (1 row), 14 columns, customer_id দুইবার

SELECT * FROM bookings b
JOIN customers c USING (customer_id)
WHERE b.booking_id = 13;
-- (1 row), 13 columns, customer_id একবার, সবার আগে

SELECT count(*) AS wrong_pairs
FROM bookings b
JOIN customers c ON c.customer_id = b.booking_id;
-- (1 row): 15`,
      },
      {
        language: "sql",
        filename: "06-new-pairs.sql",
        code: `SELECT t.title, d.name
FROM tours t
JOIN destinations d ON d.destination_id = t.destination_id;
-- (9 rows), Kuakata নেই

SELECT d.departure_id, d.starts_on, t.title
FROM departures d
JOIN tours t ON t.tour_id = d.tour_id;
-- (16 rows)

SELECT p.payment_id, p.method, b.status
FROM payments p
JOIN bookings b USING (booking_id);
-- (19 rows)`,
      },
    ],
    tip: (
      <ContentParagraph>
        psql এ একটা Query চালানোর আগে মনে মনে বলুন &quot;এখানে এতগুলো Row আসবে&quot;। মিললে এগিয়ে যান, না মিললে থামুন।
        এই ছোট অভ্যাসটা পুরো Joins মডিউলে আপনাকে চুপচাপ ভুল উত্তর থেকে বাঁচাবে।
      </ContentParagraph>
    ),
  },
};
