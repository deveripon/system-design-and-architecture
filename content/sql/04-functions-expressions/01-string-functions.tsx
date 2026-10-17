import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlExercise } from "../../../components/course/sql/sql-exercise";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import {
  CleanupPipelineLab,
  StringToolLab,
} from "../../../components/course/topics/functions/str-animations";
import {
  CharVsByteDiagram,
  FunctionMachineDiagram,
  SplitPartDiagram,
  SubstringPositionsDiagram,
} from "../../../components/course/topics/functions/str-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const stringFunctionsContent: TopicData = {
  id: "string-functions",
  introduction: {
    badge: "MODULE 04 · LESSON 01",
    title: <SectionTitle>লেখাকে কাজের উপযোগী করা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 03 এ আপনি Database থেকে ঠিক যে Row আর যে Column দরকার, সেটা বের করতে
          শিখেছেন। কিন্তু বের করা Data সবসময় ব্যবহারের জন্য তৈরি অবস্থায় থাকে না। নাম আছে
          পুরোটা, অথচ SMS এ লাগবে শুধু প্রথম অংশ। ফোন নম্বর আছে +880 দিয়ে, অথচ SMS এর
          Gateway চায় 0 দিয়ে শুরু করা দেশি নম্বর। Booking এর নম্বর আছে 13, অথচ
          টিকিটে ছাপতে হবে IT-00013।
        </ContentParagraph>
        <ContentParagraph>
          এই কাজগুলোর জন্য SQL এর হাতে আছে একগাদা ছোট যন্ত্র, যাদের বলে Function। এই লেসনে
          আপনি লেখা নিয়ে কাজ করার Function গুলো শিখবেন, যাদের একসাথে বলে String Function।
          String মানে লেখা, অক্ষরের সারি। নাম, Email, ফোন নম্বর, ট্যুরের শিরোনাম, সবই
          String।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি লেখার দৈর্ঘ্য মাপতে পারবেন অক্ষরে আর Byte এ, বড় ছোট হাতের অক্ষর
          বদলাতে পারবেন, দুই পাশের বাড়তি ফাঁকা জায়গা কাটতে পারবেন, কয়েকটা লেখা জুড়তে
          পারবেন, লেখার ভেতর থেকে একটা অংশ কেটে নিতে বা খুঁজে বের করতে পারবেন, একটা চিহ্ন
          ধরে লেখা ভাগ করতে পারবেন, এক টুকরো লেখা বদলে আরেকটা বসাতে পারবেন, আর এই সব
          Function একটার ভেতরে আরেকটা বসিয়ে অগোছালো Data কে এক Query তেই পরিষ্কার করতে
          পারবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আপনার Table এ যা আছে, সেটা কাঁচামাল। আমরা সেই কাঁচামাল কেটে, ছেঁটে, জুড়ে মানুষের পড়ার মতো করে দিই, অথচ আসল Data তে একটা দাগও পড়ে না।",
      author: "upper, trim, split_part আর তাদের দল",
      role: "Lesson 01",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>SMS এর তালিকা, আর তিনটা অমিল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শীতের মৌসুমের আগে Island Tours এর Marketing এর দায়িত্বে থাকা সাদিয়া ঠিক
                করেছেন, Customer দের Email এর পাশাপাশি একটা SMS ও পাঠাবেন। কোম্পানি একটা
                SMS Gateway এর সাথে চুক্তি করেছে। Gateway মানে একটা বাইরের Service, যাকে
                নম্বর আর বার্তা দিলে সে ফোনে SMS পৌঁছে দেয়। Gateway এর নিয়ম তিনটা: নম্বর হবে
                দেশি ধরনে, 01 দিয়ে শুরু; বার্তার শুরুতে থাকবে Customer এর প্রথম নাম, যেমন
                প্রিয় Rahim; আর যাঁর Booking আছে, তাঁর বার্তায় থাকবে একটা Booking Code, যেমন
                IT-00013।
              </ContentParagraph>
              <ContentParagraph>
                Developer তানিম Database খুলে দেখলেন, তিনটা জিনিসের একটাও ঠিক সেই রূপে নেই।
                ফোন নম্বর রাখা আছে আন্তর্জাতিক ধরনে, +8801000000101। নাম রাখা আছে পুরোটা,
                Rahim Uddin। আর Booking এর নম্বর একটা সাধারণ সংখ্যা, 13। তানিমের প্রথম
                চিন্তা ছিল সব Data একটা Spreadsheet এ নামিয়ে হাতে হাতে ঠিক করা, অথবা App এর
                Code এ একটা Loop লিখে প্রতিটা Row আলাদা করে বদলানো।
              </ContentParagraph>
              <ContentParagraph>
                দুটো রাস্তাই কাজ করবে, কিন্তু দুটোরই দাম আছে। হাতে ঠিক করলে প্রতি মাসে আবার
                করতে হবে, আর ভুল হবেই। Code এ Loop লিখলে Data কে আগে Database থেকে বের করে
                আনতে হবে, তারপর বদলাতে হবে। অথচ PostgreSQL নিজেই Query চালানোর সময় এই কাজটা
                করে দিতে পারে, প্রতিটা Row এর জন্য, এক লাইনে। নিচের বক্সে তানিমের সমাধানটা
                আগে দেখে নিন। এখনই প্রতিটা শব্দ বোঝার দরকার নেই, পুরো লেসন জুড়ে একটা একটা
                করে খুলে দেখা হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের সমাধান, আগে একবার দেখে নিন"
              query={`SELECT full_name,
       split_part(full_name, ' ', 1) AS greeting_name,
       phone,
       replace(phone, '+880', '0')   AS sms_number
FROM customers
WHERE phone IS NOT NULL
ORDER BY customer_id
LIMIT 5;

SELECT booking_id,
       'IT-' || lpad(booking_id::text, 5, '0') AS booking_code
FROM bookings
ORDER BY booking_id
LIMIT 5;`}
              caption="প্রথম ফলাফলে পুরো নামের পাশে শুধু প্রথম নাম, আর +880 দিয়ে শুরু নম্বরের পাশে 01 দিয়ে শুরু নম্বর। দ্বিতীয় ফলাফলে 1 হয়ে গেছে IT-00001। Table এর ভেতরের Data একটুও বদলায়নি, বদলেছে শুধু ফলাফলে যা দেখানো হচ্ছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Function দেখানো মান বদলায়, রাখা মান না",
          content: (
            <ContentParagraph>
              এই লেসনের প্রতিটা Function একটা SELECT এর ভেতরে চলে, আর শুধু ফলাফলের মান তৈরি
              করে। customers Table এ phone এখনো +8801000000101 ই আছে। Data কে স্থায়ীভাবে
              বদলাতে চাইলে লাগবে UPDATE, যেটা Module 10 এর বিষয়। তাই এখানে আপনি যত খুশি
              পরীক্ষা করতে পারেন, কিছু নষ্ট হওয়ার ভয় নেই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-a-function-is",
      subHeader: { index: "002", title: "What a Function Is" },
      title: <SectionTitle>আখের রসের মেশিন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রাস্তার ধারের আখের রসের মেশিনের কথা ভাবুন। দোকানি একদিক দিয়ে একটা আখ ঢোকান,
                মেশিন নিজের নিয়মে চাপ দেয়, অন্যদিক দিয়ে রস বের হয়। দোকানিকে জানতে হয় না
                মেশিনের ভেতরে কোন চাকা কোনদিকে ঘোরে। তাঁর জানলেই চলে: কী ঢোকাতে হবে, আর কী
                বের হবে।
              </ContentParagraph>
              <ContentParagraph>
                SQL এর Function ঠিক এই রকম একটা মেশিন। Function এর একটা নাম আছে, যেমন upper।
                নামের পরে বন্ধনীর ভেতরে আপনি যা দেন, তাকে বলে Argument, মানে মেশিনে ঢোকানো
                কাঁচামাল। আর Function যা ফেরত দেয়, তাকে বলে Return Value, মানে বের হওয়া রস।
                upper(&apos;rahim uddin&apos;) এ upper হলো নাম, &apos;rahim uddin&apos; হলো
                Argument, আর &apos;RAHIM UDDIN&apos; হলো Return Value।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FunctionMachineDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কিছু Function একটার বেশি Argument নেয়, কমা দিয়ে আলাদা করে। split_part(email,
                &apos;@&apos;, 2) এ তিনটা Argument: কোন লেখা ভাগ করতে হবে, কোন চিহ্ন ধরে ভাগ
                করতে হবে, আর ভাগ করার পর কত নম্বর টুকরো চাই। প্রতিটা Function এর Argument
                এর সংখ্যা আর ক্রম নির্দিষ্ট। ক্রম উল্টে দিলে Function হয় ভুল উত্তর দেবে, নয়তো
                Error দেবে।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনের সব Function একটা বিশেষ ধরনের: প্রতিটা Row এর জন্য একবার চলে, আর
                সেই Row এর জন্য একটা মান ফেরত দেয়। পনেরোটা Customer থাকলে upper(full_name)
                পনেরো বার চলে, পনেরোটা আলাদা উত্তর দেয়। এদের বলে Scalar Function। আরেক ধরনের
                Function আছে যারা অনেকগুলো Row মিলিয়ে একটা উত্তর দেয়, যেমন count। তাদের বলে
                Aggregate Function, আর তারা Module 05 এর বিষয়।
              </ContentParagraph>
              <ContentParagraph>
                একটা Function আপনি বসাতে পারেন সেই সব জায়গায়, যেখানে একটা মান বসতে পারে।
                SELECT এর তালিকায় বসালে ফলাফলে নতুন Column আসে। WHERE এ বসালে Function এর
                ফলাফল দিয়ে Row ছাঁকা হয়। ORDER BY তে বসালে Function এর ফলাফল দিয়ে সাজানো
                হয়। নিচের বক্সে তিন জায়গাতেই Function একসাথে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Query তে তিন জায়গায় Function"
              query={`SELECT full_name,
       char_length(full_name) AS name_length
FROM customers
WHERE upper(city) = 'DHAKA'
ORDER BY char_length(full_name) DESC, full_name;`}
              caption="WHERE এ upper(city) প্রতিটা Row এর শহরকে বড় হাতের অক্ষরে বদলে তারপর DHAKA এর সাথে মেলায়। SELECT এ char_length নামের অক্ষর গোনে। ORDER BY তে একই char_length দিয়ে লম্বা নাম আগে সাজায়, সমান হলে নাম দিয়ে। ঢাকার ছয়জন আসবেন, Sumaiya Islam (১৩ অক্ষর) সবার আগে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আরেকটা নিয়ম শুরুতেই মনে রাখুন। প্রায় সব String Function এর ভেতরে NULL ঢুকলে
              বের হয় NULL। Module 03 এ আপনি দেখেছেন NULL মানে জানা নেই। জানা নেই এমন একটা
              নামের দৈর্ঘ্যও জানা নেই, তাকে বড় হাতের অক্ষরে লিখলেও জানা নেই। নিচের বক্সে Tanvir
              Ahmed এর ফোন নম্বর নেই, তাই তাঁর নম্বরের দৈর্ঘ্যও খালি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NULL ঢুকলে NULL বের হয়"
              query={`SELECT full_name,
       phone,
       char_length(phone) AS phone_length
FROM customers
WHERE customer_id IN (1, 3);`}
              caption="Rahim Uddin এর নম্বরের দৈর্ঘ্য ১৪ অক্ষর। Tanvir Ahmed এর phone NULL, তাই phone_length ও NULL। ব্যতিক্রম কয়েকটা আছে, যেমন concat আর concat_ws, তাদের কথা এই লেসনেই আসছে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "length",
      subHeader: { index: "003", title: "Length" },
      title: <SectionTitle>কত অক্ষর, কত Byte</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা লেখা কত লম্বা, এই সহজ প্রশ্নের দুটো আলাদা উত্তর আছে, আর দুটোই কাজে লাগে।
                প্রথম উত্তর হলো অক্ষরের সংখ্যা, মানুষ যেভাবে গোনে। দ্বিতীয় উত্তর হলো Byte এর
                সংখ্যা, Computer যেভাবে জায়গা মাপে। Module 01 এর DevOps ট্র্যাকে আপনি দেখেছেন
                একটা Byte হলো আটটা Bit, আর Computer সবকিছু Byte এ রাখে।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এ লেখা রাখা হয় UTF-8 নামের একটা নিয়মে। UTF-8 মানে Unicode অক্ষরকে
                Byte এ বদলানোর একটা পদ্ধতি। এই নিয়মে ইংরেজি প্রতিটা অক্ষর জায়গা নেয় এক Byte,
                কিন্তু বাংলা প্রতিটা অক্ষর জায়গা নেয় তিন Byte, আর একটা Emoji নেয় চার Byte। তাই
                Dhaka পাঁচ অক্ষর, পাঁচ Byte; কিন্তু ঢাকা চার অক্ষর, বারো Byte।
              </ContentParagraph>
              <ContentParagraph>
                ঢাকা তে চারটা অক্ষর কেন, তিনটা না? কারণ PostgreSQL এর হিসাবে ঢ একটা অক্ষর, া
                চিহ্নটা আলাদা একটা অক্ষর, ক আরেকটা, শেষের া আরেকটা। চোখে যেটাকে আমরা একটা
                ঢা দেখি, Unicode এর হিসাবে সেটা দুটো অক্ষর মিলে তৈরি। নিচের ছবিতে প্রতিটা
                অক্ষরের নিচে তার Byte গুলো দেখানো আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CharVsByteDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Function", "কী গোনে", "Dhaka", "ঢাকা"],
          rows: [
            ["char_length(x)", "অক্ষর", "5", "4"],
            ["length(x)", "অক্ষর, char_length এর আরেক নাম", "5", "4"],
            ["octet_length(x)", "Byte (Octet মানে আট Bit, এক Byte)", "5", "12"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অক্ষর বনাম Byte, নিজে মেপে দেখুন"
              query={`SELECT char_length('Dhaka')  AS dhaka_chars,
       octet_length('Dhaka') AS dhaka_bytes,
       char_length('ঢাকা')   AS bn_chars,
       octet_length('ঢাকা')  AS bn_bytes;

SELECT title,
       char_length(title) AS letters
FROM tours
ORDER BY letters DESC, title;`}
              caption="প্রথম ফলাফলে 5, 5, 4, 12। দ্বিতীয় ফলাফলে প্রতিটা ট্যুরের শিরোনাম কত অক্ষরের, সবচেয়ে লম্বা আগে। তিনটা শিরোনাম সমান ২৬ অক্ষরের, তাই তাদের ভেতরে ক্রম ঠিক হয়েছে নাম দিয়ে। নিজের নাম বাংলায় আর ইংরেজিতে বসিয়ে দুই রকম দৈর্ঘ্য মেপে দেখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>দুই রকম দৈর্ঘ্য বাস্তবে কোথায় লাগে, তিনটা উদাহরণ:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Form এর সীমা:</strong> Website এ নাম লেখার ঘরে যদি লেখা থাকে সর্বোচ্চ
                  ৫০ অক্ষর, সেটা অক্ষরের হিসাব। PostgreSQL এ varchar(50) Column ও অক্ষর গোনে,
                  Byte না। Column এর Type নিয়ে বিস্তারিত Module 09 এ।
                </ListItem>
                <ListItem>
                  <strong>SMS এর খরচ:</strong> একটা SMS এ ইংরেজিতে ১৬০ অক্ষর ধরে, কিন্তু বাংলা
                  থাকলে বার্তাটা Unicode এ যায়, তখন এক SMS এ ধরে ৭০ অক্ষর। সাদিয়ার বার্তা
                  বাংলায় হলে char_length দিয়ে আগে মেপে নেওয়া দরকার, কতগুলো SMS এর দাম লাগবে।
                </ListItem>
                <ListItem>
                  <strong>জায়গা আর গতি:</strong> Disk আর Network সবসময় Byte গোনে। লাখ লাখ Row এ
                  বাংলা লেখা থাকলে ইংরেজির প্রায় তিনগুণ জায়গা লাগে, octet_length দিয়ে সেটা আগে
                  থেকে আন্দাজ করা যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ: LENGTH মানে Byte",
          content: (
            <ContentParagraph>
              PostgreSQL এ length আর char_length একই জিনিস, দুটোই অক্ষর গোনে। MySQL এ তা না।
              সেখানে LENGTH(&apos;ঢাকা&apos;) দেয় 12, কারণ MySQL এর LENGTH গোনে Byte। অক্ষর
                গুনতে MySQL এ লিখতে হয় CHAR_LENGTH(&apos;ঢাকা&apos;), যেটা দেয় 4। MySQL এর
              কোনো ভিডিওতে LENGTH দেখলে মনে রাখবেন, বাংলা লেখায় সেখানে উত্তর তিনগুণ আসবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "changing-case",
      subHeader: { index: "004", title: "Changing Case" },
      title: <SectionTitle>বড় হাত, ছোট হাত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ইংরেজি অক্ষরের দুই রূপ: বড় হাতের (A, B, C) আর ছোট হাতের (a, b, c)। ইংরেজিতে
                এদের বলে Upper Case আর Lower Case। মানুষের চোখে Rahim আর rahim একই নাম, কিন্তু
                Computer এর চোখে দুটো আলাদা লেখা, কারণ R আর r আলাদা অক্ষর। PostgreSQL এ এই
                তিনটা Function অক্ষরের হাত বদলায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>upper(x)</code>: সব অক্ষর বড় হাতের। Name Tag, টিকিটের
                  উপরে নাম, বা কোড বানাতে কাজে লাগে।
                </ListItem>
                <ListItem>
                  <code className={CODE}>lower(x)</code>: সব অক্ষর ছোট হাতের। Email তুলনা করার
                  আগে, বা খোঁজার আগে দুই পাশ এক রকম করতে কাজে লাগে।
                </ListItem>
                <ListItem>
                  <code className={CODE}>initcap(x)</code>: প্রতিটা শব্দের প্রথম অক্ষর বড়,
                  বাকিগুলো ছোট। কেউ নাম সব ছোট হাতে বা সব বড় হাতে লিখে ফেললে সাজিয়ে দেখাতে কাজে
                  লাগে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                বাংলা লিপিতে বড় হাত ছোট হাত নেই। তাই upper(&apos;ঢাকা&apos;) দেয় ঢাকা, কোনো বদল
                ছাড়াই। আর initcap এর একটা দুর্বলতা আছে: সে শুধু বোঝে শব্দের শুরু কোথায়, নামের
                নিয়ম বোঝে না। McDonald কে সে বানায় Mcdonald, কারণ তার কাছে মাঝের D একটা সাধারণ
                অক্ষর। O&apos;Brien ঠিক থাকে, কারণ ঊর্ধ্বকমা চিহ্নের পরে সে নতুন শব্দ ধরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন রকম হাত বদল"
              query={`SELECT full_name,
       upper(full_name)   AS name_tag,
       lower(full_name)   AS lowered,
       initcap(lower(full_name)) AS fixed_again
FROM customers
ORDER BY customer_id
LIMIT 4;

SELECT initcap('mcdonald')     AS mc,
       initcap('o''brien')     AS ob,
       initcap('rahim UDDIN')  AS ru,
       upper('ঢাকা')           AS bn;`}
              caption="প্রথম ফলাফলে একই নাম তিন রূপে। দ্বিতীয় ফলাফলে initcap এর সীমা: mcdonald হলো Mcdonald, যেটা আসল বানান না। o'brien হলো O'Brien, rahim UDDIN হলো Rahim Uddin, আর ঢাকা যেমন ছিল তেমনই রইল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                হাত বদলের সবচেয়ে কাজের ব্যবহার হলো খোঁজা। ধরুন Support এ একজন Customer ফোন
                করে বললেন তাঁর Email হলো Rahim.Uddin@MAIL.example, বড় হাত মিশিয়ে। Database এ
                আছে সব ছোট হাতে। সরাসরি = দিয়ে মেলালে কিছুই পাওয়া যাবে না। দুই পাশে lower
                বসালে দুটোই ছোট হাতে বদলে যায়, তারপর তুলনা হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বড় হাত মেশানো Email দিয়ে খোঁজা"
              query={`SELECT full_name, email
FROM customers
WHERE email = 'Rahim.Uddin@MAIL.example';

SELECT full_name, email
FROM customers
WHERE lower(email) = lower('Rahim.Uddin@MAIL.example');`}
              caption="প্রথম Query শূন্য Row দেয়, কারণ R আর r আলাদা। দ্বিতীয়টা Rahim Uddin কে খুঁজে পায়। Module 03 এর ILIKE ও এই কাজ করে, কিন্তু lower এর সুবিধা হলো এটা সব Database এ চলে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ: তুলনা এমনিতেই বড় ছোট হাত মানে না",
          content: (
            <ContentParagraph>
              MySQL এর Default Collation (utf8mb4_0900_ai_ci) এ তুলনার সময় বড় ছোট হাত দেখা হয়
              না, তাই সেখানে email = &apos;Rahim.Uddin@MAIL.example&apos; সরাসরিই Rahim কে খুঁজে
              পায়। UPPER আর LOWER MySQL এও আছে, একই কাজ করে। কিন্তু INITCAP নেই: MySQL এ
              INITCAP লিখলে Error 1305 আসে, Function টা নেই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              orderMatters
              task={
                <>
                  টুরিস্টদের জন্য প্রতিটা Guide এর গলায় একটা Name Tag ঝুলবে, নামটা পুরোটা বড় হাতের
                  অক্ষরে। guides Table থেকে <code className={CODE}>guide_id</code> আর বড় হাতের{" "}
                  <code className={CODE}>full_name</code> বের করুন, এই দুটো Column, guide_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  সব অক্ষর বড় করার Function টার নাম ইংরেজিতে উপরের দিক বোঝায়।{" "}
                  <code className={CODE}>ORDER BY guide_id</code> দিতে ভুলবেন না।
                </>
              }
              solution={`SELECT guide_id, upper(full_name) AS name_tag
FROM guides
ORDER BY guide_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "trimming",
      subHeader: { index: "005", title: "Trimming Spaces" },
      title: <SectionTitle>চোখে না পড়া ফাঁকা জায়গা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Form এ লেখার সময় মানুষ প্রায়ই অজান্তে একটা বাড়তি ফাঁকা জায়গা দিয়ে ফেলেন। কেউ
                শহরের ঘরে লেখেন &quot; Dhaka&quot;, শুরুতে একটা Space। কেউ Copy Paste করেন,
                সাথে শেষে দুটো Space চলে আসে। চোখে দুটোই Dhaka, কিন্তু Database এর চোখে তিনটা
                আলাদা লেখা, কারণ Space ও একটা অক্ষর। তখন WHERE city = &apos;Dhaka&apos;
                লিখলে এই Row গুলো চুপচাপ বাদ পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                এই সমস্যার ওষুধ trim। trim(x) লেখার দুই পাশের ফাঁকা জায়গা কেটে ফেলে, মাঝের
                ফাঁকা জায়গায় হাত দেয় না। শুধু বাঁ দিক কাটতে ltrim, শুধু ডান দিক কাটতে rtrim।
                ফাঁকা জায়গা চোখে দেখা যায় না বলে নিচের বক্সে লেখার দুই পাশে বন্ধনী জুড়ে দেখানো
                হয়েছে, যাতে বোঝা যায় লেখাটা ঠিক কোথায় শুরু আর কোথায় শেষ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা Dhaka, একটাই আসল"
              query={`SELECT city,
       '[' || city || ']'       AS shown,
       city = 'Dhaka'           AS exact_match,
       trim(city) = 'Dhaka'     AS trimmed_match
FROM (VALUES ('Dhaka'), (' Dhaka'), ('Dhaka  ')) AS typed(city);

SELECT '[' || trim('  Dhaka  ')  || ']' AS both_sides,
       '[' || ltrim('  Dhaka  ') || ']' AS left_only,
       '[' || rtrim('  Dhaka  ') || ']' AS right_only;`}
              caption="প্রথম Query তে VALUES দিয়ে একটা ছোট অস্থায়ী তালিকা বানানো হয়েছে, যেন তিনজন তিনভাবে শহর লিখেছেন (VALUES এর নিয়ম Module 07 এ আসবে, এখন শুধু ফলাফল দেখুন)। exact_match শুধু প্রথমটার জন্য t, trimmed_match তিনটার জন্যই t। দ্বিতীয় Query তে বন্ধনীর ভেতরে দেখুন কোন পাশের ফাঁকা জায়গা গেল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                trim শুধু Space কাটে না, আপনি বলে দিলে অন্য অক্ষরও কাটে। তখন লেখার নিয়ম একটু
                লম্বা: trim(LEADING &apos;+&apos; FROM phone) মানে phone এর শুরু থেকে + চিহ্ন
                কেটে ফেলা। LEADING মানে শুরুর দিক, TRAILING মানে শেষের দিক, BOTH মানে দুই দিক।
                btrim(x, &apos;chars&apos;) একই কাজের ছোট রূপ, দুই দিক থেকে কাটে।
              </ContentParagraph>
              <ContentParagraph>
                একটা সূক্ষ্ম কথা: trim এ যে অক্ষরগুলো দেন, সেগুলো একটা তালিকা হিসেবে ধরা হয়,
                একটা শব্দ হিসেবে না। trim(BOTH &apos;+0&apos; FROM x) মানে দুই পাশ থেকে + বা
                0, যেটাই পাওয়া যায়, PostgreSQL কাটতে থাকে যতক্ষণ না অন্য কোনো অক্ষর আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Space ছাড়া অন্য অক্ষর কাটা"
              query={`SELECT phone,
       trim(LEADING '+' FROM phone) AS without_plus,
       btrim('xxDhakaxx', 'x')      AS btrimmed
FROM customers
WHERE customer_id = 1;`}
              caption="+8801000000101 থেকে শুরুর + গেল, বাকিটা রইল। btrim দুই পাশের x কেটে দিল Dhaka।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "আসল ওষুধ: ঢোকার মুখেই পরিষ্কার",
          content: (
            <ContentParagraph>
              প্রতিটা Query তে trim(city) লেখা একটা জোড়াতালি। আসল সমাধান হলো Data ঢোকার সময়ই
              পরিষ্কার করা, যাতে Table এ কখনো বাড়তি ফাঁকা জায়গা না ঢোকে। App এর Code এ
              trim করে তারপর INSERT (Module 10), আর Table এ একটা CHECK Constraint দিয়ে পাহারা
              বসানো (Module 09)। তা ছাড়া WHERE trim(city) = &apos;Dhaka&apos; এর মতো Column
              এর উপর Function বসালে বড় Table এ Index কাজে লাগে না, Query ধীর হয়। সেই গল্প
              Module 13 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "joining-text",
      subHeader: { index: "006", title: "Joining Text" },
      title: <SectionTitle>কয়েকটা লেখা জুড়ে একটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো লেখা পাশাপাশি জুড়ে একটা লেখা বানানোকে বলে Concatenation। PostgreSQL এ
                এর তিনটা উপায়, আর তিনটার আচরণ NULL এর সামনে তিন রকম। এই পার্থক্যটা না জানলে
                তালিকার কিছু লাইন হঠাৎ পুরো ফাঁকা আসে, কেউ বুঝতে পারে না কেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>a || b</code>: দুটো খাড়া দাগ, SQL Standard এর জোড়া
                  লাগানোর চিহ্ন। &apos;Rahim&apos; || &apos; &apos; || &apos;Uddin&apos; দেয় Rahim
                  Uddin। সংখ্যা জুড়লে সেটা নিজে থেকে লেখায় বদলে যায়: &apos;Seats: &apos; || 4
                  দেয় Seats: 4। কিন্তু একটা অংশও NULL হলে পুরো ফলাফল NULL।
                </ListItem>
                <ListItem>
                  <code className={CODE}>concat(a, b, …)</code>: যত খুশি Argument জোড়ে, আর
                  NULL পেলে তাকে বাদ দিয়ে বাকিগুলো জোড়ে, যেন সেখানে খালি লেখা ছিল।
                </ListItem>
                <ListItem>
                  <code className={CODE}>concat_ws(sep, a, b, …)</code>: ws মানে With Separator।
                  প্রথম Argument টা মাঝখানের চিহ্ন, যেটা প্রতিটা অংশের মাঝে বসে। NULL অংশটা
                  বাদ যায়, তার আগের চিহ্নটাও বাদ যায়। ঠিকানা বা যোগাযোগের লাইন বানাতে এটাই সবচেয়ে
                  কাজের।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেখার ধরন", "ফোন আছে (Rahim)", "ফোন নেই (Tanvir)"],
          rows: [
            ["full_name || ', ' || phone", "Rahim Uddin, +8801000000101", "NULL, পুরো লাইন হারাল"],
            ["concat(full_name, ', ', phone)", "Rahim Uddin, +8801000000101", "Tanvir Ahmed, (শেষে বাড়তি কমা)"],
            ["concat_ws(', ', full_name, phone)", "Rahim Uddin, +8801000000101", "Tanvir Ahmed"],
            ["MySQL: CONCAT(full_name, ', ', phone)", "Rahim Uddin, +8801000000101", "NULL, PostgreSQL এর concat এর উল্টো"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক লাইন, তিন উপায়, NULL এর সামনে তিন আচরণ"
              query={`SELECT full_name,
       full_name || ', ' || phone        AS with_pipes,
       concat(full_name, ', ', phone)    AS with_concat,
       concat_ws(', ', full_name, phone) AS with_concat_ws
FROM customers
WHERE customer_id IN (1, 3)
ORDER BY customer_id;

SELECT 'Seats: ' || 4               AS number_joined,
       concat('Tour ', 3, ' of ', 9) AS many_parts;`}
              caption="Rahim এর জন্য তিনটা একই। Tanvir এর জন্য with_pipes ফাঁকা (NULL), with_concat শেষে একটা ঝুলে থাকা কমা নিয়ে, with_concat_ws একদম পরিষ্কার। দ্বিতীয় Query দেখায় সংখ্যা জোড়ার সময় আলাদা করে কিছু বলতে হয় না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ || মানে জোড়া না, মানে OR",
          content: (
            <ContentParagraph>
              MySQL এ &apos;Rahim&apos; || &apos;Uddin&apos; চালালে আসে 0, সাথে Warning। কারণ
              MySQL এর Default নিয়মে || হলো Logical OR, দুই পাশকে সংখ্যা হিসেবে পড়ার চেষ্টা
              করে। MySQL 8.4 এ এই ব্যবহার Deprecated, মানে ভবিষ্যতে বাদ যাবে। MySQL এ লেখা
              জুড়তে সবসময় CONCAT বা CONCAT_WS লিখুন। আর মনে রাখুন, MySQL এর CONCAT একটা NULL
              পেলেই পুরো উত্তর NULL করে দেয়, PostgreSQL এর concat এর মতো NULL বাদ দেয় না।
              CONCAT_WS দুই Database এই NULL বাদ দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              orderMatters
              task={
                <>
                  Welcome Desk এর তালিকার জন্য প্রতিটা Customer এর একটা লাইন বানান: নাম, তারপর
                  একটা Space, তারপর বন্ধনীর ভেতরে শহর, যেমন{" "}
                  <code className={CODE}>Rahim Uddin (Dhaka)</code>। ফলাফলে শুধু এই একটা Column,
                  customer_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  তিন টুকরো জুড়তে হবে: full_name, তারপর <code className={CODE}>&apos; (&apos;</code>,
                  তারপর city, তারপর <code className={CODE}>&apos;)&apos;</code>। || বা concat,
                  যেকোনোটা চলবে, কারণ নাম বা শহর কোনোটাই NULL না।
                </>
              }
              solution={`SELECT full_name || ' (' || city || ')' AS label
FROM customers
ORDER BY customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "cutting",
      subHeader: { index: "007", title: "Cutting Pieces" },
      title: <SectionTitle>লেখার ভেতর থেকে একটা টুকরো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেক সময় পুরো লেখা লাগে না, লাগে একটা অংশ। টিকিটের ছোট জায়গায় ট্যুরের পুরো
                নাম ধরে না, প্রথম কয়েকটা অক্ষর দেখাতে হয়। ফোন নম্বরের শেষ চারটা অঙ্ক দেখিয়ে
                বাকিটা লুকাতে হয়। এই কাজের জন্য তিনটা Function, আর তিনটাই একটা জিনিসের উপর
                দাঁড়িয়ে: লেখার ভেতরে প্রতিটা অক্ষরের একটা অবস্থান আছে, যাকে বলে Position।
              </ContentParagraph>
              <ContentParagraph>
                SQL এ অবস্থান গোনা শুরু হয় ১ থেকে, শূন্য থেকে না। JavaScript বা Python জানা
                থাকলে এখানে সাবধান, কারণ সেখানে গোনা শুরু শূন্য থেকে। Saint Martin লেখায় S এর
                অবস্থান ১, মাঝের Space এর অবস্থান ৬, M এর অবস্থান ৭।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SubstringPositionsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <code className={CODE}>substring(x FROM start FOR count)</code>: start অবস্থান থেকে
                শুরু করে count টা অক্ষর। কমা দিয়েও লেখা যায়: substring(x, start, count), আর
                substr(x, start, count) একই জিনিস। FOR অংশ না দিলে start থেকে শেষ পর্যন্ত।
              </ListItem>
              <ListItem>
                <code className={CODE}>left(x, n)</code>: শুরু থেকে n টা অক্ষর।
              </ListItem>
              <ListItem>
                <code className={CODE}>right(x, n)</code>: শেষ থেকে n টা অক্ষর।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অবস্থান ধরে কাটা"
              query={`SELECT substring('Saint Martin Island Escape' FROM 7 FOR 6) AS sub_from_for,
       substring('Saint Martin Island Escape', 7, 6)       AS sub_commas,
       left('Saint Martin', 5)                             AS first_five,
       right('Saint Martin', 6)                            AS last_six;

SELECT title,
       CASE WHEN char_length(title) > 20
            THEN left(title, 20) || '...'
            ELSE title
       END AS ticket_title
FROM tours
ORDER BY tour_id;`}
              caption="প্রথম Query তে চারটা উত্তর: Martin, Martin, Saint, Martin। দ্বিতীয় Query টিকিটের জন্য: ২০ অক্ষরের বেশি লম্বা শিরোনাম কেটে শেষে তিনটা বিন্দু, ছোট শিরোনাম (Bandarban Hill Trek) যেমন ছিল তেমন। CASE আপনি Module 03 এ শিখেছেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              left আর right এ ঋণাত্মক সংখ্যা দিলে মানে উল্টে যায়। left(x, -3) মানে শেষের তিনটা
              বাদ দিয়ে বাকি সব, right(x, -6) মানে শুরুর ছয়টা বাদ দিয়ে বাকি সব। left(&apos;Saint
              Martin&apos;, -3) দেয় Saint Mar, right(&apos;Saint Martin&apos;, -6) দেয় Martin।
              এই কৌশলটা কাজের, কিন্তু অন্য Database এ একই রকম আচরণ আশা করবেন না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ: ঋণাত্মক সংখ্যার মানে আলাদা",
          content: (
            <ContentParagraph>
              MySQL এ LEFT(&apos;Saint Martin&apos;, -3) দেয় খালি লেখা, PostgreSQL এর মতো
              শেষের তিনটা বাদ দেয় না। আবার MySQL এর SUBSTRING(&apos;Saint Martin&apos;, -6)
              শেষ থেকে গুনে দেয় Martin, অথচ PostgreSQL এ substring(&apos;Saint Martin&apos;, -6)
              পুরো লেখাটাই ফেরত দেয়, কারণ সে শূন্যের আগের অবস্থানকে ফাঁকা ধরে। ঋণাত্মক সংখ্যা
              নিয়ে খেলার আগে নিজের Database এ একবার পরীক্ষা করে নিন। সাধারণ ধনাত্মক ব্যবহার
              (LEFT, RIGHT, SUBSTRING(x, 7, 6)) দুই জায়গায় হুবহু একই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              orderMatters
              task={
                <>
                  Mobile App এর ছোট কার্ডে ট্যুরের নামের শুধু প্রথম ১০টা অক্ষর ধরে। প্রতিটা ট্যুরের{" "}
                  <code className={CODE}>tour_id</code> আর শিরোনামের প্রথম ১০ অক্ষর বের করুন, কোনো
                  বিন্দু জোড়া ছাড়াই। এই দুটো Column, tour_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  শুরু থেকে নির্দিষ্ট সংখ্যক অক্ষর নেওয়ার সবচেয়ে ছোট উপায়টা হলো{" "}
                  <code className={CODE}>left(title, …)</code>।
                </>
              }
              solution={`SELECT tour_id, left(title, 10) AS short_title
FROM tours
ORDER BY tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "finding",
      subHeader: { index: "008", title: "Finding Text" },
      title: <SectionTitle>একটা চিহ্ন কোথায় আছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কাটার জন্য অবস্থান জানা চাই। কিন্তু প্রতিটা Row এ অবস্থান আলাদা। Rahim এর Email এ
                @ আছে ১২ নম্বর অবস্থানে, Nusrat এর Email এ ১৩ নম্বরে, কারণ তাঁর নাম লম্বা। তাই
                আগে খুঁজে বের করতে হয় চিহ্নটা কোথায়। এই কাজের Function দুটো, একই কাজ, লেখার
                ধরন আলাদা:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>position(&apos;@&apos; IN email)</code>: SQL Standard
                  এর লেখা।
                </ListItem>
                <ListItem>
                  <code className={CODE}>strpos(email, &apos;@&apos;)</code>: PostgreSQL এর
                  নিজস্ব লেখা, Argument এর ক্রম উল্টো: আগে বড় লেখা, পরে যেটা খুঁজছেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দুটোই প্রথমবার যেখানে পায় সেই অবস্থান ফেরত দেয়। না পেলে ফেরত দেয় 0, NULL না।
                তাই একটা লেখার ভেতরে কিছু আছে কিনা জানতেও position কাজে লাগে: position(...) &gt;
                0 মানে আছে। আর position এর উত্তর দিয়ে substring কে বলে দেওয়া যায় কোথায় থামতে
                হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="@ কোথায়, আর তার আগের অংশটা"
              query={`SELECT email,
       position('@' IN email) AS at_sign,
       substring(email FROM 1 FOR position('@' IN email) - 1) AS username
FROM customers
ORDER BY customer_id
LIMIT 4;

SELECT title
FROM tours
WHERE position('''' IN title) > 0
ORDER BY tour_id;`}
              caption="প্রথম Query তে প্রতিটা Email এ @ এর অবস্থান আলাদা (১২, ১৩, ১৩, ১৪), আর তার এক ঘর আগে পর্যন্ত কেটে নেওয়া হলো username। দ্বিতীয় Query খোঁজে কোন শিরোনামে ঊর্ধ্বকমা (') আছে। SQL এ লেখার ভেতরে একটা ' লিখতে দুটো পরপর লিখতে হয়, তাই চারটা ' দেখছেন। দুটো ট্যুর আসবে, দুটোই Cox's Bazar এর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              position আর substring মিলিয়ে username বের করা কাজ করে, কিন্তু লেখাটা লম্বা আর
              পড়তে কষ্ট। যখন কাজটা হলো একটা চিহ্ন ধরে লেখাকে ভাগ করা, তখন PostgreSQL এর হাতে আরও
              সহজ একটা Function আছে। সেটাই পরের অংশে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ: LOCATE আর INSTR",
          content: (
            <ContentParagraph>
              MySQL এ POSITION(&apos;@&apos; IN email) হুবহু চলে। সাথে আরও দুটো নাম আছে:
              LOCATE(&apos;@&apos;, email) আর INSTR(email, &apos;@&apos;), দুটোই একই উত্তর দেয় (Rahim
              এর বেলায় 12)। খেয়াল করুন LOCATE এ আগে খোঁজার জিনিস, INSTR এ আগে বড় লেখা। STRPOS
              MySQL এ নেই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "splitting",
      subHeader: { index: "009", title: "Splitting" },
      title: <SectionTitle>একটা চিহ্ন ধরে ভাগ করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রুটি ভাগ করার কথা ভাবুন। ছুরি যেখানে বসাবেন, রুটি সেখানে দুই টুকরো হবে, আর আপনি
                বলবেন কোন টুকরোটা চাই। split_part ঠিক এই কাজ করে। তিনটা Argument: কোন লেখা,
                কোন চিহ্নে ছুরি বসবে (এই চিহ্নকে বলে Delimiter), আর কত নম্বর টুকরো চাই।
              </ContentParagraph>
              <ContentParagraph>
                split_part(email, &apos;@&apos;, 1) দেয় @ এর আগের অংশ, মানে username।
                split_part(email, &apos;@&apos;, 2) দেয় পরের অংশ, মানে Domain। split_part(full_name,
                &apos; &apos;, 1) দেয় নামের প্রথম শব্দ, তানিমের SMS এর জন্য যেটা দরকার ছিল।
                ঋণাত্মক নম্বর দিলে গোনা শুরু হয় ডান দিক থেকে: -1 মানে শেষ টুকরো। আর যে নম্বরের
                টুকরো নেই, সেটা চাইলে আসে খালি লেখা, NULL না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SplitPartDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Email আর নাম ভাগ করা"
              query={`SELECT full_name,
       split_part(full_name, ' ', 1) AS first_name,
       split_part(full_name, ' ', 2) AS last_name,
       split_part(email, '@', 1)     AS username,
       split_part(email, '@', 2)     AS domain
FROM customers
ORDER BY customer_id
LIMIT 5;

SELECT split_part('rahim.uddin@mail.example', '@', -1)      AS last_piece,
       split_part('rahim.uddin@mail.example', '@', 3) = ''  AS third_is_empty;`}
              caption="প্রথম ফলাফলে প্রতিটা নাম দুই ভাগে, প্রতিটা Email দুই ভাগে। সব Email এর Domain একই, mail.example, কারণ এই Sample Data এর সব ঠিকানা বানানো। দ্বিতীয় Query তে -1 দেয় শেষ টুকরো mail.example, আর তিন নম্বর টুকরো চাইলে আসে খালি লেখা, তাই third_is_empty হলো t।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নামের ভাগ সবসময় এত সহজ না",
          content: (
            <ContentParagraph>
              Island Tours এর সব নাম দুই শব্দের, তাই split_part(full_name, &apos; &apos;, 2)
              এখানে শেষ নাম দেয়। কিন্তু বাস্তবে কারো নাম এক শব্দের (শুধু Mitu), কারো তিন শব্দের
              (Md. Kamal Hasan)। তখন দুই নম্বর টুকরো হয় খালি, নয়তো ভুল অংশ। তাই অনেক App নাম
              রাখে দুটো আলাদা Column এ, first_name আর last_name। Table ডিজাইনের এই সিদ্ধান্ত
              Module 11 এর বিষয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ: SPLIT_PART নেই, আছে SUBSTRING_INDEX",
          content: (
            <ContentParagraph>
              MySQL এ SPLIT_PART লিখলে Error 1305 আসে। তার বদলে আছে SUBSTRING_INDEX(x, delim,
              n), যার আচরণ একটু আলাদা: সে n টা চিহ্ন পর্যন্ত পুরোটা ফেরত দেয়। SUBSTRING_INDEX(email,
              &apos;@&apos;, 1) দেয় rahim.uddin, আর SUBSTRING_INDEX(email, &apos;@&apos;, -1) দেয়
              শেষ চিহ্নের পরের সবটা, mail.example। একটার বেশি চিহ্ন থাকলে দুটোর উত্তর আলাদা হয়ে
              যায়, তাই মাঝের টুকরো চাইলে MySQL এ দুবার SUBSTRING_INDEX লাগে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              orderMatters
              task={
                <>
                  ঢাকার Customer দের জন্য একটা Login তালিকা বানান: Email এর @ এর আগের অংশ (
                  <code className={CODE}>username</code>) আর নামের প্রথম শব্দ (
                  <code className={CODE}>first_name</code>), এই ক্রমে দুটো Column। শুধু যাঁদের city
                  হলো Dhaka, customer_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  দুটো Column ই split_part দিয়ে: একটায় চিহ্ন <code className={CODE}>&apos;@&apos;</code>,
                  অন্যটায় একটা Space। টুকরোর নম্বর দুই জায়গাতেই 1।
                </>
              }
              solution={`SELECT split_part(email, '@', 1)     AS username,
       split_part(full_name, ' ', 1) AS first_name
FROM customers
WHERE city = 'Dhaka'
ORDER BY customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "replacing",
      subHeader: { index: "010", title: "Replacing" },
      title: <SectionTitle>এক টুকরো সরিয়ে আরেক টুকরো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Word এ Find and Replace ব্যবহার করেছেন? replace ঠিক সেটাই। replace(x, from, to)
                লেখা x এর ভেতরে যতবার from পায়, সবখানে বসায় to। একবার না, সবগুলোতে। আর to যদি
                খালি লেখা হয়, তাহলে from টা শুধু মুছে যায়।
              </ContentParagraph>
              <ContentParagraph>
                তানিমের SMS এর নম্বরের কাজটা এখন পরিষ্কার: replace(phone, &apos;+880&apos;,
                &apos;0&apos;) মানে +880 এর জায়গায় 0। +8801000000101 হয়ে যায় 01000000101,
                ঠিক যেমনটা Gateway চায়। দুটো সতর্কতা: replace বড় ছোট হাত মানে, তাই bazar লিখে
                Bazar বদলানো যায় না; আর যে লেখা পাওয়া যায় না, তার জন্য কিছুই বদলায় না, কোনো Error
                ও আসে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Find and Replace, SQL এর ভেতরে"
              query={`SELECT full_name,
       phone,
       replace(phone, '+880', '0') AS local_phone
FROM customers
WHERE phone IS NOT NULL
ORDER BY customer_id
LIMIT 4;

SELECT replace('Cox''s Bazar Beach Weekend', 'Weekend', 'Getaway') AS renamed,
       replace('Cox''s Bazar', 'bazar', 'X')                       AS case_sensitive,
       replace('a-b-c', '-', '')                                   AS dashes_gone,
       translate('+880 1000-000101', ' -', '')                     AS translated;`}
              caption="প্রথম ফলাফলে প্রতিটা নম্বরের পাশে দেশি রূপ। দ্বিতীয় ফলাফলে: Weekend বদলে Getaway; bazar ছোট হাতে লেখা বলে কিছুই বদলায়নি; - চিহ্ন সবগুলো মুছে গেছে; আর translate একবারে Space আর - দুটোই মুছে দিয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষ লাইনের translate একটু আলাদা জিনিস। replace পুরো একটা শব্দ খোঁজে, translate খোঁজে
              আলাদা আলাদা অক্ষর। translate(x, &apos; -&apos;, &apos;&apos;) মানে x এর প্রতিটা Space
              আর প্রতিটা - মুছে ফেলা, কারণ তাদের বদলে বসানোর কোনো অক্ষর দেওয়া হয়নি। অনেকগুলো আলাদা
              চিহ্ন একবারে মুছতে translate সুবিধার। আরও জটিল Pattern মুছতে বা বদলাতে লাগে Regular
              Expression, যেটা এই Module এর শেষ লেসন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              orderMatters
              task={
                <>
                  SMS Gateway এর জন্য তালিকা: যাঁদের ফোন নম্বর আছে, শুধু তাঁদের{" "}
                  <code className={CODE}>full_name</code> আর দেশি ধরনের নম্বর, মানে শুরুর +880 এর
                  জায়গায় 0। এই দুটো Column, customer_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  নম্বর বদলাতে <code className={CODE}>replace(phone, &apos;+880&apos;, &apos;0&apos;)</code>।
                  আর যাঁদের নম্বর নেই তাঁদের বাদ দিতে WHERE এ সেই শর্তটা লাগবে যেটা Module 03 এর
                  NULL লেসনে শিখেছেন।
                </>
              }
              solution={`SELECT full_name, replace(phone, '+880', '0') AS local_phone
FROM customers
WHERE phone IS NOT NULL
ORDER BY customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "padding",
      subHeader: { index: "011", title: "Padding" },
      title: <SectionTitle>সমান মাপের কোড</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রেলের টিকিটের নম্বর বা ব্যাংকের হিসাব নম্বর সবসময় সমান মাপের হয়: 00007, 00013,
                01250। ছোট সংখ্যার বাঁ দিকে শূন্য বসিয়ে মাপ মেলানো হয়, যাতে ছাপলে সারিগুলো
                সোজা থাকে আর পড়তে ভুল না হয়। এই কাজকে বলে Padding, মানে ভরাট করা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>lpad(x, length, fill)</code>: বাঁ দিকে fill বসিয়ে x কে
                  ঠিক length অক্ষর লম্বা করে। fill না দিলে Space বসায়।
                </ListItem>
                <ListItem>
                  <code className={CODE}>rpad(x, length, fill)</code>: একই কাজ, ডান দিকে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা অবাক করা আচরণ মনে রাখুন: x যদি আগে থেকেই length এর চেয়ে লম্বা হয়, lpad
                সেটাকে কেটে ছোট করে দেয়। lpad(&apos;Dhaka&apos;, 3) দেয় Dha। তাই length টা
                এমন দিন যাতে সবচেয়ে বড় নম্বরও ধরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Booking Code বানানো, আর একটা ইচ্ছাকৃত Error"
              query={`SELECT lpad('7', 3, '0')      AS padded,
       rpad('Dhaka', 8, '.')  AS dotted,
       lpad('Dhaka', 3)       AS cut_short;

SELECT booking_id,
       'IT-' || lpad(booking_id::text, 5, '0') AS booking_code
FROM bookings
ORDER BY booking_id
LIMIT 4;

SELECT lpad(booking_id, 5, '0')
FROM bookings
LIMIT 1;`}
              caption="প্রথম দুটো Query কাজ করে: 007, Dhaka..., Dha, তারপর IT-00001 থেকে IT-00004। তৃতীয়টা ইচ্ছা করে ভুল: lpad শুধু লেখা নেয়, অথচ booking_id একটা সংখ্যা, তাই PostgreSQL বলে function lpad(integer, integer, unknown) does not exist। সমাধান দ্বিতীয় Query তে: booking_id::text, মানে সংখ্যাটাকে আগে লেখায় বদলে নেওয়া। এই :: এর পুরো গল্প Lesson 04 এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ: সংখ্যা দিলেও চলে",
          content: (
            <ContentParagraph>
              MySQL চুপচাপ সংখ্যাকে লেখায় বদলে নেয়, তাই সেখানে CONCAT(&apos;IT-&apos;,
              LPAD(booking_id, 5, &apos;0&apos;)) সরাসরি IT-00001 দেয়, কোনো Error ছাড়াই।
              PostgreSQL এ এই সুবিধা নেই, সেখানে ::text লিখতে হয়। PostgreSQL ইচ্ছা করেই কড়া:
              ভুল Type এ চুপচাপ কাজ চালানোর চেয়ে Error দেওয়া ভালো মনে করে।
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
                  প্রতিটা bKash Payment এর রসিদ নম্বর বানান: সামনে <code className={CODE}>PAY-</code>,
                  তারপর payment_id পাঁচ অঙ্কে, বাঁ দিকে শূন্য দিয়ে ভরা, যেমন{" "}
                  <code className={CODE}>PAY-00004</code>। সাথে <code className={CODE}>amount_bdt</code>।
                  এই দুটো Column, শুধু যেসব Payment এর method হলো bkash, payment_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  ঠিক Booking Code এর মতো: <code className={CODE}>&apos;PAY-&apos; || lpad(…::text, 5, &apos;0&apos;)</code>।
                  method এর মান ছোট হাতে লেখা: <code className={CODE}>&apos;bkash&apos;</code>।
                </>
              }
              solution={`SELECT 'PAY-' || lpad(payment_id::text, 5, '0') AS receipt,
       amount_bdt
FROM payments
WHERE method = 'bkash'
ORDER BY payment_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "format",
      subHeader: { index: "012", title: "format()" },
      title: <SectionTitle>ফাঁকা ঘর রাখা একটা চিঠি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বিয়ের দাওয়াতপত্রের কথা ভাবুন। ছাপাখানা একটা নমুনা ছাপে, যেখানে অতিথির নামের
                জায়গায় একটা ফাঁকা দাগ থাকে। তারপর প্রতিটা কার্ডে আলাদা নাম বসে। format ঠিক এই
                রকম: প্রথম Argument হলো চিঠির নমুনা, যার ভেতরে %s মানে একটা ফাঁকা ঘর। পরের
                Argument গুলো ক্রম অনুযায়ী সেই ঘরগুলোতে বসে।
              </ContentParagraph>
              <ContentParagraph>
                || দিয়েও একই কাজ করা যায়, কিন্তু অনেক টুকরো হলে ফাঁকা জায়গা আর উদ্ধৃতিচিহ্নে লেখাটা
                জট পাকিয়ে যায়। format এ পুরো বাক্যটা এক জায়গায় পড়া যায়, তাই ভুল ধরা সহজ। আর
                NULL পেলে %s সেখানে খালি রাখে, পুরো বাক্য হারায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নমুনা চিঠিতে নাম বসানো"
              query={`SELECT format('প্রিয় %s, %s থেকে আপনাকে স্বাগতম।',
              split_part(full_name, ' ', 1),
              city) AS welcome
FROM customers
ORDER BY customer_id
LIMIT 3;

SELECT format('%L', 'Cox''s Bazar') AS as_literal,
       format('%I', 'Tour Notes')   AS as_identifier,
       format('[%s]', NULL)         AS null_as_s,
       format('%L', NULL)           AS null_as_l;`}
              caption="প্রথম ফলাফলে তিনটা বাংলা স্বাগত বার্তা, প্রতিটায় আলাদা নাম আর শহর। দ্বিতীয় ফলাফলে আরও দুটো চিহ্ন: %L মান বসায় উদ্ধৃতিচিহ্নসহ, ভেতরের ' কে দুটো করে ('Cox''s Bazar'); %I বসায় নামের মতো করে, দরকার হলে ডাবল কোট দিয়ে মুড়ে। NULL পেলে %s খালি রাখে ([]), আর %L লেখে NULL শব্দটা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "%L আর %I কেন আছে",
          content: (
            <ContentParagraph>
              %L আর %I তৈরি হয়েছে Database এর ভেতরে SQL লেখা বানানোর জন্য, যেমন একটা Function
              যে নিজেই একটা Query তৈরি করে চালায়। তখন বাইরে থেকে আসা মান সরাসরি জুড়লে বিপদ, কারণ
              কেউ মানের ভেতরে &apos; চিহ্ন দিয়ে আপনার Query এর অর্থ বদলে দিতে পারে। এই আক্রমণের নাম
              SQL Injection। %L আর %I মানটাকে নিরাপদে মুড়ে দেয়। Database এর ভেতরের Function
              লেখা Module 14 এ, আর SQL Injection এর পুরো গল্প Module 16 এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ: FORMAT মানে একেবারে অন্য জিনিস",
          content: (
            <ContentParagraph>
              নাম এক হলেও MySQL এর FORMAT একটা সংখ্যা সাজানোর Function। FORMAT(12500, 2) দেয়
              12,500.00, হাজারের কমা আর দুই ঘর দশমিকসহ। PostgreSQL এর format এর মতো নমুনা চিঠির
              কাজ MySQL এ নেই, সেখানে CONCAT বা CONCAT_WS দিয়েই করতে হয়। PostgreSQL এ সংখ্যা
              সাজানোর কাজ করে to_char, যেটা এই Module এর Type Casting লেসনে আসবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "chaining",
      subHeader: { index: "013", title: "Toolbox and Chaining" },
      title: <SectionTitle>যন্ত্রের ভেতরে যন্ত্র</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এতক্ষণ যে Function গুলো দেখলেন, নিচের ল্যাবে সব এক জায়গায়। একটা আসল মান আর একটা
              Function বেছে নিন, দেখুন PostgreSQL ঠিক কী ফেরত দেয়। বিশেষ করে দেখুন হাতে লেখা শহরের
              উপর trim, বাংলা শহরের উপর char_length আর octet_length, আর Email এর উপর initcap কী
              অদ্ভুত কাজ করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <StringToolLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আসল শক্তি। একটা Function এর Return Value আরেকটা Function এর Argument হতে
                পারে। মানে একটা মেশিন থেকে বের হওয়া জিনিস সরাসরি পরের মেশিনে ঢোকানো যায়, যেমন
                কারখানার কনভেয়ার বেল্টে। initcap(trim(x)) মানে আগে x এর ফাঁকা জায়গা কাটা হয়, তারপর
                সেই ফলাফলের প্রতিটা শব্দের প্রথম অক্ষর বড় করা হয়।
              </ContentParagraph>
              <ContentParagraph>
                এই রকম Expression পড়ার একটাই নিয়ম: সবচেয়ে ভেতরের বন্ধনী আগে, তারপর বাইরের দিকে।
                লেখার সময়ও একই কৌশল: আগে ভেতরের ধাপটা লিখে চালান, ফলাফল ঠিক হলে তার চারপাশে
                পরের Function বসান, আবার চালান। নিচের ল্যাবে তিনটা অগোছালো মান ধাপে ধাপে পরিষ্কার
                হচ্ছে, প্রতি ধাপে Expression টা এক স্তর বাড়ছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CleanupPipelineLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Support Screen এর গোপনীয় তালিকা"
              query={`SELECT left(split_part(full_name, ' ', 1), 1)
       || left(split_part(full_name, ' ', 2), 1)          AS initials,
       left(email, 2) || '***@' || split_part(email, '@', 2) AS masked_email,
       left(phone, 6) || '*****' || right(phone, 2)       AS masked_phone
FROM customers
ORDER BY customer_id
LIMIT 5;`}
              caption="Support টিমের নতুন সদস্য Customer কে চিনতে পারবেন, কিন্তু পুরো Email বা ফোন নম্বর দেখবেন না। initials: নামের দুই শব্দ ভাগ করে প্রতিটার প্রথম অক্ষর (RU)। masked_email: প্রথম দুই অক্ষর, তারপর ***, তারপর Domain। masked_phone: শুরুর ছয়টা আর শেষের দুটো অঙ্ক, মাঝে তারা। Tanvir এর ফোন নেই, তাই তাঁর masked_phone NULL, কারণ || এর একটা অংশ NULL।"
            />
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
                  বিদেশি Customer দের জন্য একটা গোপনীয় তালিকা বানান, তিনটা Column এই ক্রমে:{" "}
                  <code className={CODE}>initials</code> (নামের দুই শব্দের প্রথম অক্ষর, যেমন PS),{" "}
                  <code className={CODE}>masked_email</code> (Email এর প্রথম দুই অক্ষর, তারপর{" "}
                  <code className={CODE}>***@</code>, তারপর Domain, যেমন pr***@mail.example), আর{" "}
                  <code className={CODE}>city</code> বড় হাতের অক্ষরে। শুধু যাঁদের country হলো
                  Bangladesh না, customer_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  উপরের বক্সের প্রথম দুই Column হুবহু কাজে লাগবে, শুধু তৃতীয়টা{" "}
                  <code className={CODE}>upper(city)</code>। শর্তটা{" "}
                  <code className={CODE}>country &lt;&gt; &apos;Bangladesh&apos;</code>।
                </>
              }
              solution={`SELECT left(split_part(full_name, ' ', 1), 1)
       || left(split_part(full_name, ' ', 2), 1)          AS initials,
       left(email, 2) || '***@' || split_part(email, '@', 2) AS masked_email,
       upper(city) AS city
FROM customers
WHERE country <> 'Bangladesh'
ORDER BY customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ লেখা সামলানো</SectionTitle>,
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
                Island Tours এর মতো একটা ব্যবসায় String Function রোজ কোথায় কাজে আসে, চারটা
                বাস্তব জায়গা:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>SMS আর Email এর তালিকা:</strong> প্রথম নাম দিয়ে সম্বোধন (split_part),
                  Gateway এর মাপে নম্বর (replace), বার্তার নমুনা (format)। Marketing প্রতি মাসে
                  একটা CSV চায়, আর একটা Query থেকেই সেটা তৈরি হয়।
                </ListItem>
                <ListItem>
                  <strong>খোঁজার বাক্স:</strong> কেউ বড় হাতে বা আগে পিছে ফাঁকা দিয়ে Email লিখলেও
                  যাতে খুঁজে পাওয়া যায়, তুলনার আগে দুই পাশে lower(trim(...))।
                </ListItem>
                <ListItem>
                  <strong>Support Screen:</strong> নতুন কর্মীর কাছে Customer এর পুরো Email আর ফোন
                  না দেখিয়ে আংশিক দেখানো (left, right, ***)। Customer এর গোপনীয়তা রক্ষা আর ভুল
                  করে Data ফাঁস হওয়া আটকানো।
                </ListItem>
                <ListItem>
                  <strong>রসিদ আর টিকিট:</strong> সমান মাপের Booking Code আর রসিদ নম্বর (lpad),
                  আর টিকিটের ছোট জায়গায় কাটা শিরোনাম (left)।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে সাদিয়ার পুরো SMS তালিকা একটা Query তে: কাকে পাঠাতে হবে, কোন নম্বরে, আর
                কী লিখে। ফোন নম্বর নেই এমন পাঁচজন বাদ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সাদিয়ার SMS তালিকা, এক Query তে"
              query={`SELECT replace(phone, '+880', '0') AS to_number,
       format('প্রিয় %s, Island Tours এর শীতের ট্যুর বুকিং শুরু হয়েছে!',
              split_part(full_name, ' ', 1)) AS message,
       char_length(format('প্রিয় %s, Island Tours এর শীতের ট্যুর বুকিং শুরু হয়েছে!',
              split_part(full_name, ' ', 1))) AS message_length
FROM customers
WHERE phone IS NOT NULL
ORDER BY customer_id;`}
              caption="দশটা Row, প্রতিটায় দেশি নম্বর, নাম বসানো বাংলা বার্তা, আর বার্তাটা কত অক্ষরের। বাংলা বার্তা এক SMS এ ৭০ অক্ষর পর্যন্ত ধরে, তাই message_length দেখে সাদিয়া আগেই জানবেন প্রতিটা বার্তা এক SMS এ ধরবে কিনা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "SQL এ করবেন, নাকি App এ?",
          content: (
            <ContentParagraph>
              নাম বড় হাতে দেখানো বা তারিখ সাজানোর মতো শুধু চোখের জন্য কাজ অনেক টিম App এর
              Frontend এ করে, কারণ সেখানে ভাষা আর দেশ অনুযায়ী সাজানো সহজ। কিন্তু Data পরিষ্কার
              করা, খোঁজার সময় তুলনা, Report আর CSV বানানো, আর এমন যেকোনো কাজ যেখানে হাজার Row
              App এ টেনে আনতে হতো, সেগুলো SQL এ করাই ভালো। Data যেখানে আছে, কাজটাও সেখানে হলে
              Network এ কম জিনিস আসা যাওয়া করে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>যেকোনো লেখা পরিষ্কারের ছয় ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নতুন কোনো লেখা বদলানোর কাজ এলে, যেমন Marketing একটা নতুন ধরনের তালিকা চাইল, এই ছয়
              ধাপে এগোলে প্রায় কখনো ভুল হয় না:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "কাঁচা Data দেখুন",
              description:
                "আগে শুধু Column টা কয়েকটা Row সহ SELECT করুন। কেমন দেখায়, কোথাও NULL আছে কিনা, কোথাও বাড়তি ফাঁকা জায়গা বা অদ্ভুত চিহ্ন আছে কিনা, চোখে দেখে নিন।",
            },
            {
              title: "শেষ রূপটা লিখে ফেলুন",
              description:
                "একটা Row এর জন্য ঠিক কী চাই, কাগজে লিখুন। যেমন: +8801000000101 থেকে 01000000101। লক্ষ্য পরিষ্কার না হলে Function বাছাই আন্দাজে হয়।",
            },
            {
              title: "Function বাছুন",
              description:
                "কাজটা কোন ধরনের: কাটা (left, substring, split_part), খোঁজা (position), বদলানো (replace, translate), জোড়া (||, concat_ws), মাপ মেলানো (lpad), নাকি হাত বদলানো (upper, lower)।",
            },
            {
              title: "এক Row এ পরীক্ষা",
              description:
                "WHERE customer_id = 1 দিয়ে একটা Row এ Function চালান। ফলাফল লক্ষ্যের সাথে মিলছে কিনা দেখুন। এখানে ভুল ধরা সবচেয়ে সস্তা।",
            },
            {
              title: "ভেতর থেকে বাইরে জুড়ুন",
              description:
                "একাধিক ধাপ লাগলে সবচেয়ে ভেতরের Function আগে লিখে চালান, তারপর তার চারপাশে পরের Function। প্রতি স্তরে একবার করে চালিয়ে দেখুন।",
            },
            {
              title: "ব্যতিক্রম পরীক্ষা",
              description:
                "এবার WHERE সরিয়ে সব Row এ চালান। NULL এর Row গুলো কী দিল, সবচেয়ে লম্বা আর সবচেয়ে ছোট মানগুলো কী দিল, Row এর সংখ্যা ঠিক আছে কিনা, একবার মিলিয়ে নিন।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো সবাই একবার করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী দেখবেন", "সমাধান"],
          rows: [
            [
              "|| দিয়ে জোড়া, একটা অংশ NULL",
              "কিছু Row এ পুরো লাইন ফাঁকা",
              "concat_ws বা concat, অথবা NULL এর ব্যবস্থা (Lesson 05 এর COALESCE)",
            ],
            [
              "MySQL এ LENGTH দিয়ে অক্ষর গোনা",
              "বাংলা লেখার দৈর্ঘ্য তিনগুণ",
              "MySQL এ CHAR_LENGTH",
            ],
            [
              "অবস্থান শূন্য থেকে গোনা",
              "এক অক্ষর কম বা বেশি কাটা",
              "SQL এ প্রথম অক্ষর ১, ছবি এঁকে গুনে নিন",
            ],
            [
              "replace এ বড় ছোট হাত না মেলা",
              "কিছুই বদলায় না, Error ও আসে না",
              "আসল বানান মিলিয়ে লিখুন, বা আগে lower",
            ],
            [
              "lpad এ সংখ্যা দেওয়া",
              "function lpad(integer, …) does not exist",
              "সংখ্যাটা আগে ::text",
            ],
            [
              "বাড়তি ফাঁকা জায়গা",
              "চোখে একই, = দিয়ে মেলে না",
              "'[' || x || ']' দিয়ে দেখুন, trim করুন, ঢোকার মুখে পরিষ্কার রাখুন",
            ],
            [
              "initcap দিয়ে নাম ঠিক করা",
              "McDonald হয়ে যায় Mcdonald",
              "মানুষ যেভাবে লিখেছেন সেভাবে রাখুন, শুধু অগোছালো Data তে initcap",
            ],
            [
              "MySQL এ || বা FORMAT",
              "|| দেয় 0, FORMAT দেয় সংখ্যার মতো সাজানো লেখা",
              "MySQL এ CONCAT, আর নমুনা চিঠির কাজও CONCAT দিয়ে",
            ],
            [
              "বড় Table এ WHERE এর Column এর উপর Function",
              "Query ধীর",
              "Data পরিষ্কার রাখুন, দরকার হলে Expression Index (Module 13)",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো ভুল নিজের চোখে"
              query={`SELECT full_name,
       'Name: ' || full_name || ', Phone: ' || phone AS fragile_line,
       concat_ws(', ', 'Name: ' || full_name, 'Phone: ' || phone) AS safe_line
FROM customers
WHERE customer_id IN (2, 3)
ORDER BY customer_id;

SELECT replace('Saint Martin', 'martin', 'M.') AS wrong_case,
       replace('Saint Martin', 'Martin', 'M.') AS right_case;`}
              caption="Tanvir Ahmed এর ফোন নেই বলে fragile_line পুরো হারায়, safe_line এ নামটা অন্তত থাকে। দ্বিতীয় Query তে ছোট হাতের martin কিছুই বদলায় না, ঠিক বানানের Martin বদলে হয় Saint M.।"
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
            <div className="space-y-4">
              <ContentList>
                <ListItem>
                  <a
                    className={LINK}
                    href="https://www.postgresql.org/docs/current/functions-string.html"
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: String Functions and Operators
                  </a>
                  : এই লেসনের প্রতিটা Function এর আসল সংজ্ঞা আর উদাহরণ এক পাতায়। এখানে আরও
                  অনেক Function আছে, যেমন repeat, reverse, md5। কোনো কাজের জন্য Function খুঁজতে
                  এই পাতায় Ctrl+F করে কাজের ইংরেজি নাম লিখুন।
                </ListItem>
                <ListItem>
                  <a
                    className={LINK}
                    href="https://dev.mysql.com/doc/refman/8.4/en/string-functions.html"
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Reference Manual: String Functions and Operators
                  </a>
                  : MySQL এর CONCAT, SUBSTRING_INDEX, LOCATE, FORMAT এর পুরো তালিকা। MySQL এর
                  কোনো কোর্স দেখলে পাশে খুলে রাখার মতো পাতা।
                </ListItem>
                <ListItem>
                  <a className={LINK} href="https://en.wikipedia.org/wiki/UTF-8" target="_blank" rel="noopener noreferrer">
                    Wikipedia: UTF-8
                  </a>
                  : অক্ষর কেন এক থেকে চার Byte জায়গা নেয়, তার নিয়ম আর ইতিহাস। বাংলা লেখা নিয়ে
                  কাজ করলে একবার পড়ে রাখা ভালো।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                DevOps ট্র্যাকের{" "}
                <Link className={LINK} href="/devops/topic/binary-and-data">
                  Binary, Bit and Byte
                </Link>{" "}
                লেসনে দেখানো আছে একটা Byte আসলে কী, আর লেখা কীভাবে সংখ্যা হয়ে Computer এ থাকে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 18 */
    {
      id: "recap",
      subHeader: { index: "018", title: "Recap" },
      title: <SectionTitle>এক নজরে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentList>
                <ListItem>
                  Function একটা মেশিন: Argument ঢোকে, Return Value বের হয়। String Function প্রতিটা
                  Row এর জন্য আলাদা চলে, আর বসতে পারে SELECT, WHERE, ORDER BY সবখানে।
                </ListItem>
                <ListItem>প্রায় সব Function এ NULL ঢুকলে NULL বের হয়। ব্যতিক্রম concat আর concat_ws।</ListItem>
                <ListItem>
                  char_length গোনে অক্ষর, octet_length গোনে Byte। বাংলা অক্ষর UTF-8 এ তিন Byte।
                  MySQL এর LENGTH গোনে Byte।
                </ListItem>
                <ListItem>upper, lower, initcap অক্ষরের হাত বদলায়। খোঁজার আগে দুই পাশে lower।</ListItem>
                <ListItem>trim, ltrim, rtrim দুই পাশের ফাঁকা জায়গা বা বলে দেওয়া অক্ষর কাটে।</ListItem>
                <ListItem>
                  || NULL পেলে পুরো লাইন হারায়, concat_ws NULL অংশ আর তার চিহ্ন বাদ দেয়। MySQL এ ||
                  মানে OR, আর CONCAT NULL পেলে NULL।
                </ListItem>
                <ListItem>
                  substring, left, right দিয়ে কাটা; অবস্থান শুরু ১ থেকে। position বা strpos বলে
                  একটা লেখা কোথায় আছে, না পেলে 0।
                </ListItem>
                <ListItem>
                  split_part একটা চিহ্ন ধরে ভাগ করে নির্দিষ্ট টুকরো দেয়; MySQL এ SUBSTRING_INDEX।
                </ListItem>
                <ListItem>replace সব জায়গায় বদলায়, বড় ছোট হাত মানে; translate আলাদা অক্ষর ধরে কাজ করে।</ListItem>
                <ListItem>lpad, rpad দিয়ে সমান মাপের কোড; সংখ্যা দিলে আগে ::text।</ListItem>
                <ListItem>format এ নমুনা লেখা আর %s, %L, %I; MySQL এর FORMAT সংখ্যা সাজায়।</ListItem>
                <ListItem>Function এর ভেতরে Function: ভেতর থেকে বাইরে পড়ুন, ভেতর থেকে বাইরে লিখুন।</ListItem>
              </ContentList>
              <ContentParagraph>
                পরের লেসনে লেখা ছেড়ে সংখ্যায় যাবেন: যোগ বিয়োগ, শতাংশ, টাকার হিসাব, দশমিক সামলানো,
                আর 5 কে 2 দিয়ে ভাগ করলে কেন 2 আসে। চলুন{" "}
                <Link className={LINK} href="/sql/topic/numeric-functions">
                  Numbers and the Integer Division Trap
                </Link>{" "}
                এ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["Function", "কাজ", "Island Tours এর উদাহরণ"],
    rows: [
      ["char_length / length", "অক্ষর গোনা", "char_length(title) দেয় 26"],
      ["octet_length", "Byte গোনা", "octet_length('ঢাকা') দেয় 12"],
      ["upper / lower / initcap", "অক্ষরের হাত বদল", "upper(full_name) দেয় RAHIM UDDIN"],
      ["trim / ltrim / rtrim / btrim", "দুই পাশ ছাঁটা", "trim(' Dhaka') দেয় Dhaka"],
      ["||", "জোড়া, NULL পেলে NULL", "full_name || ' (' || city || ')'"],
      ["concat / concat_ws", "জোড়া, NULL বাদ দিয়ে", "concat_ws(', ', full_name, phone)"],
      ["substring / left / right", "অবস্থান ধরে কাটা", "left(title, 10)"],
      ["position / strpos", "কোথায় আছে, না পেলে 0", "position('@' IN email) দেয় 12"],
      ["split_part", "চিহ্ন ধরে ভাগ", "split_part(email, '@', 2) দেয় mail.example"],
      ["replace / translate", "বদলানো বা মোছা", "replace(phone, '+880', '0')"],
      ["lpad / rpad", "মাপ মেলানো", "'IT-' || lpad(booking_id::text, 5, '0')"],
      ["format", "নমুনা লেখায় মান বসানো", "format('প্রিয় %s', split_part(full_name, ' ', 1))"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SELECT char_length('ঢাকা'), octet_length('ঢাকা'); PostgreSQL এ কী ফেরত দেবে?",
        options: [
          {
            key: "A",
            text: "3 আর 3",
            isCorrect: false,
            explanation: "চোখে তিনটা ধ্বনি মনে হলেও Unicode এর হিসাবে া চিহ্ন দুটো আলাদা অক্ষর, আর প্রতিটা বাংলা অক্ষর তিন Byte।",
          },
          {
            key: "B",
            text: "4 আর 12",
            isCorrect: true,
            explanation: "ঠিক। ঢ, া, ক, া মিলে চারটা অক্ষর, আর UTF-8 এ প্রতিটা তিন Byte করে, মোট ১২।",
          },
          {
            key: "C",
            text: "4 আর 4",
            isCorrect: false,
            explanation: "octet_length Byte গোনে, অক্ষর না। বাংলা অক্ষর এক Byte এ ধরে না।",
          },
          {
            key: "D",
            text: "12 আর 4",
            isCorrect: false,
            explanation: "উল্টো হয়ে গেছে। char_length অক্ষর গোনে (4), octet_length Byte গোনে (12)।",
          },
        ],
      },
      {
        id: 2,
        text: "Tanvir Ahmed এর phone NULL। SELECT full_name || ', ' || phone FROM customers WHERE customer_id = 3; কী দেবে?",
        options: [
          {
            key: "A",
            text: "Tanvir Ahmed,",
            isCorrect: false,
            explanation: "PostgreSQL এর concat এরকম দিত, কিন্তু || NULL পেলে বাকিটা রাখে না।",
          },
          {
            key: "B",
            text: "Tanvir Ahmed",
            isCorrect: false,
            explanation: "concat_ws এমন দিত। || NULL অংশ বাদ দেয় না।",
          },
          {
            key: "C",
            text: "NULL",
            isCorrect: true,
            explanation: "ঠিক। || এর একটা অংশ NULL হলে পুরো ফলাফল NULL, তাই পুরো লাইনটাই হারায়।",
          },
          {
            key: "D",
            text: "একটা Error",
            isCorrect: false,
            explanation: "কোনো Error আসে না, ঠিক এজন্যই ভুলটা চোখ এড়িয়ে যায়।",
          },
        ],
      },
      {
        id: 3,
        text: "substring('Saint Martin', 7, 6) কী ফেরত দেবে?",
        options: [
          {
            key: "A",
            text: "Martin",
            isCorrect: true,
            explanation: "ঠিক। অবস্থান গোনা শুরু ১ থেকে, ৬ নম্বরে Space, ৭ নম্বর থেকে ছয়টা অক্ষর মানে Martin।",
          },
          {
            key: "B",
            text: " Marti",
            isCorrect: false,
            explanation: "এটা হতো যদি গোনা শূন্য থেকে শুরু হতো। SQL এ প্রথম অক্ষরের অবস্থান ১।",
          },
          {
            key: "C",
            text: "Saint ",
            isCorrect: false,
            explanation: "এটা left('Saint Martin', 6)। substring এর প্রথম সংখ্যাটা শুরুর অবস্থান।",
          },
          {
            key: "D",
            text: "artin",
            isCorrect: false,
            explanation: "শুরুর অবস্থান এক ঘর বেশি ধরা হয়েছে। ৭ নম্বর অক্ষর M।",
          },
        ],
      },
      {
        id: 4,
        text: "Email থেকে Domain (@ এর পরের অংশ) বের করার সবচেয়ে সরল PostgreSQL উপায় কোনটা?",
        options: [
          {
            key: "A",
            text: "split_part(email, '@', 2)",
            isCorrect: true,
            explanation: "ঠিক। @ চিহ্ন ধরে ভাগ করে দ্বিতীয় টুকরো, মানে Domain।",
          },
          {
            key: "B",
            text: "right(email, 12)",
            isCorrect: false,
            explanation: "এই Sample Data তে কাকতালীয়ভাবে মিলতে পারে, কিন্তু Domain এর দৈর্ঘ্য সবার এক না। নির্দিষ্ট সংখ্যা দিয়ে কাটা ভঙ্গুর।",
          },
          {
            key: "C",
            text: "SUBSTRING_INDEX(email, '@', -1)",
            isCorrect: false,
            explanation: "এটা MySQL এর Function। PostgreSQL এ এই নামে কিছু নেই।",
          },
          {
            key: "D",
            text: "replace(email, '@', '')",
            isCorrect: false,
            explanation: "এটা শুধু @ চিহ্নটা মুছে দুই অংশ জোড়া লাগিয়ে দেয়, Domain আলাদা করে না।",
          },
        ],
      },
      {
        id: 5,
        text: "SELECT replace('Cox''s Bazar', 'bazar', 'X'); কী দেবে?",
        options: [
          {
            key: "A",
            text: "Cox's X",
            isCorrect: false,
            explanation: "replace বড় ছোট হাত মানে। bazar আর Bazar আলাদা লেখা।",
          },
          {
            key: "B",
            text: "Cox's Bazar",
            isCorrect: true,
            explanation: "ঠিক। ছোট হাতের bazar কোথাও নেই, তাই কিছুই বদলায় না, আর কোনো Error ও আসে না।",
          },
          {
            key: "C",
            text: "একটা Error, কারণ খোঁজার লেখা পাওয়া যায়নি",
            isCorrect: false,
            explanation: "না পেলে replace চুপচাপ আসল লেখাটাই ফেরত দেয়।",
          },
          {
            key: "D",
            text: "NULL",
            isCorrect: false,
            explanation: "কোনো Argument NULL না, তাই উত্তরও NULL না।",
          },
        ],
      },
      {
        id: 6,
        text: "SELECT lpad(booking_id, 5, '0') FROM bookings; PostgreSQL এ কী হবে?",
        options: [
          {
            key: "A",
            text: "00001, 00002, …",
            isCorrect: false,
            explanation: "MySQL এ এমন হতো। PostgreSQL সংখ্যাকে নিজে থেকে লেখায় বদলায় না।",
          },
          {
            key: "B",
            text: "Error: function lpad(integer, integer, unknown) does not exist",
            isCorrect: true,
            explanation: "ঠিক। lpad লেখা চায়। সমাধান lpad(booking_id::text, 5, '0')।",
          },
          {
            key: "C",
            text: "সব Row এ NULL",
            isCorrect: false,
            explanation: "NULL না, Query টা চলার আগেই Error দিয়ে থামে।",
          },
          {
            key: "D",
            text: "1, 2, 3, কোনো বদল ছাড়া",
            isCorrect: false,
            explanation: "PostgreSQL ভুল Type এ চুপচাপ কাজ চালায় না, Error দেয়।",
          },
        ],
      },
      {
        id: 7,
        text: "initcap(trim('  rAHIM uDDIN  ')) কোন ক্রমে কাজ করে, আর কী দেয়?",
        options: [
          {
            key: "A",
            text: "আগে initcap, তারপর trim; দেয় '  Rahim Uddin  '",
            isCorrect: false,
            explanation: "বাইরের Function শেষে চলে। ভেতরের trim আগে, তাই ফাঁকা জায়গা থাকে না।",
          },
          {
            key: "B",
            text: "আগে trim, তারপর initcap; দেয় Rahim Uddin",
            isCorrect: true,
            explanation: "ঠিক। সবচেয়ে ভেতরের বন্ধনী আগে: trim ফাঁকা কাটে, তারপর initcap প্রতিটা শব্দের প্রথম অক্ষর বড় আর বাকি ছোট করে।",
          },
          {
            key: "C",
            text: "দুটো একসাথে চলে; দেয় RAHIM UDDIN",
            isCorrect: false,
            explanation: "initcap সব বড় করে না, শুধু প্রথম অক্ষর। আর Function একটার পর একটা চলে, ভেতর থেকে বাইরে।",
          },
          {
            key: "D",
            text: "Error, কারণ Function এর ভেতরে Function দেওয়া যায় না",
            isCorrect: false,
            explanation: "দেওয়া যায়, আর এটাই String Function এর আসল শক্তি।",
          },
        ],
      },
      {
        id: 8,
        text: "একটা MySQL কোর্সে দেখলেন SELECT 'Rahim' || 'Uddin'; এটা MySQL 8.4 এর Default নিয়মে কী দেয়?",
        options: [
          {
            key: "A",
            text: "RahimUddin",
            isCorrect: false,
            explanation: "PostgreSQL এ এমন হতো। MySQL এর Default নিয়মে || হলো Logical OR।",
          },
          {
            key: "B",
            text: "0, সাথে Warning",
            isCorrect: true,
            explanation: "ঠিক। MySQL দুই পাশকে সংখ্যা হিসেবে পড়ে OR করে, আর এই ব্যবহার Deprecated বলে Warning দেয়। MySQL এ জোড়ার জন্য CONCAT।",
          },
          {
            key: "C",
            text: "একটা Syntax Error",
            isCorrect: false,
            explanation: "Error আসে না, Query চলে, শুধু অপ্রত্যাশিত উত্তর দেয়।",
          },
          {
            key: "D",
            text: "NULL",
            isCorrect: false,
            explanation: "কোনো অংশ NULL না। MySQL এখানে OR এর উত্তর দেয়, যেটা 0।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Marketing এর Export",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>পরিষ্কার নামের তালিকা:</strong> নিজের মেশিনের island_tours এ সব Customer এর জন্য
        তিনটা Column বানান: প্রথম নাম, শেষ নাম, আর নামের আদ্যক্ষর (যেমন RU)। কোন Function গুলো
        লাগল, ছোট করে লিখে রাখুন।
      </span>,
      <span key="2">
        <strong>SMS এর খরচ:</strong> সাদিয়ার বাংলা বার্তাটা নিজের মতো করে আবার লিখুন, প্রতিটা
        Customer এর নাম বসিয়ে। char_length দিয়ে মাপুন কোন বার্তা ৭০ অক্ষর ছাড়ায়, আর সেগুলো ছোট
        করার একটা উপায় বের করুন।
      </span>,
      <span key="3">
        <strong>রসিদ নম্বর:</strong> সব Payment এর জন্য রসিদ নম্বর বানান যেটাতে method টা বড় হাতে
        আর payment_id ছয় অঙ্কে থাকে, যেমন BKASH-000001। কোন Function কোন ক্রমে বসালেন, ভেতর থেকে
        বাইরে ব্যাখ্যা করুন।
      </span>,
      <span key="4">
        <strong>MySQL পাশাপাশি:</strong> Module 02 এ MySQL বসিয়ে থাকলে দ্বিতীয় আর তৃতীয় কাজটা
        MySQL এ লিখুন। কোথায় কোথায় Function এর নাম বা আচরণ বদলাতে হলো (split_part,
        ||, ::text), একটা ছোট টেবিলে লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> একজন বন্ধু বলছেন তাঁর Report এ কিছু Customer এর
        লাইন পুরো ফাঁকা আসছে। তাঁকে || আর concat_ws এর পার্থক্য দিয়ে ছয় লাইনে কারণ আর সমাধান
        বুঝিয়ে লিখুন।
      </span>,
    ],
    deliverables: [
      <span key="d1">নামের তালিকার Query আর প্রথম পাঁচ Row এর Output</span>,
      <span key="d2">বার্তার Query, আর ৭০ অক্ষর ছাড়ানো বার্তার তালিকা</span>,
      <span key="d3">রসিদ নম্বরের Query আর ভেতর থেকে বাইরের ব্যাখ্যা</span>,
      <span key="d4">PostgreSQL আর MySQL এর পার্থক্যের টেবিল</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ String Function ড্রিল",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "দৈর্ঘ্য মাপা",
        description:
          "psql এ island_tours এ ঢুকে প্রথম ফাইল চালান। বাংলা আর ইংরেজি শব্দের অক্ষর আর Byte এর সংখ্যা মিলিয়ে দেখুন, আর সবচেয়ে লম্বা শিরোনাম কোনগুলো।",
      },
      {
        title: "হাত বদল আর খোঁজা",
        description:
          "দ্বিতীয় ফাইলে upper, initcap আর lower দিয়ে খোঁজা। বড় হাত মেশানো Email দিয়ে প্রথম Query শূন্য, দ্বিতীয়টা এক Row দেবে।",
      },
      {
        title: "জোড়া আর NULL",
        description:
          "তৃতীয় ফাইলে ||, concat আর concat_ws পাশাপাশি। কোন Customer এর লাইন কোন উপায়ে হারায়, লিখে রাখুন।",
      },
      {
        title: "কাটা আর ভাগ",
        description:
          "চতুর্থ ফাইলে left, substring, position আর split_part। প্রতিটা Query এর পাশে লেখা Row সংখ্যা মিলিয়ে দেখুন।",
      },
      {
        title: "বদলানো আর মাপ মেলানো",
        description:
          "পঞ্চম ফাইলে replace, translate আর lpad। শেষ লাইনের Error টা ইচ্ছাকৃত, Error এর বার্তাটা পড়ে ঠিক করে আবার চালান।",
      },
      {
        title: "সব একসাথে",
        description:
          "ষষ্ঠ ফাইলে SMS তালিকা আর Support Screen এর গোপনীয় তালিকা। দুটো Query নিজে একবার ভেঙে ভেতর থেকে বাইরে চালিয়ে দেখুন প্রতিটা স্তর কী দেয়।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-length.sql",
        code: `SELECT char_length('Dhaka'), octet_length('Dhaka'),
       char_length('ঢাকা'),  octet_length('ঢাকা');
-- 5 | 5 | 4 | 12

SELECT title, char_length(title) AS letters
FROM tours
ORDER BY letters DESC, title
LIMIT 3;
-- (3 rows), তিনটাই 26 অক্ষরের`,
      },
      {
        language: "sql",
        filename: "02-case.sql",
        code: `SELECT guide_id, upper(full_name) FROM guides ORDER BY guide_id;
-- (5 rows), JAMAL HOSSAIN দিয়ে শুরু

SELECT full_name FROM customers
WHERE email = 'Rahim.Uddin@MAIL.example';
-- (0 rows)

SELECT full_name FROM customers
WHERE lower(email) = lower('Rahim.Uddin@MAIL.example');
-- (1 row): Rahim Uddin`,
      },
      {
        language: "sql",
        filename: "03-joining.sql",
        code: `SELECT full_name || ', ' || phone        AS with_pipes,
       concat(full_name, ', ', phone)    AS with_concat,
       concat_ws(', ', full_name, phone) AS with_concat_ws
FROM customers
ORDER BY customer_id;
-- (15 rows), ফোন নেই এমন ৫ জনের with_pipes ফাঁকা

SELECT count(*) FROM customers WHERE (full_name || ', ' || phone) IS NULL;
-- 5`,
      },
      {
        language: "sql",
        filename: "04-cutting.sql",
        code: `SELECT tour_id, left(title, 10) FROM tours ORDER BY tour_id;
-- (9 rows)

SELECT email, position('@' IN email) FROM customers ORDER BY customer_id LIMIT 3;
-- (3 rows): 12, 13, 13

SELECT split_part(email, '@', 1), split_part(full_name, ' ', 1)
FROM customers
WHERE city = 'Dhaka'
ORDER BY customer_id;
-- (6 rows), rahim.uddin | Rahim দিয়ে শুরু`,
      },
      {
        language: "sql",
        filename: "05-replace-pad.sql",
        code: `SELECT full_name, replace(phone, '+880', '0')
FROM customers
WHERE phone IS NOT NULL
ORDER BY customer_id;
-- (10 rows)

SELECT translate('+880 1000-000101', ' -', '');
-- +8801000000101

SELECT 'PAY-' || lpad(payment_id::text, 5, '0'), amount_bdt
FROM payments
WHERE method = 'bkash'
ORDER BY payment_id;
-- (7 rows), PAY-00001 দিয়ে শুরু

SELECT lpad(payment_id, 5, '0') FROM payments LIMIT 1;
-- ERROR: function lpad(integer, integer, unknown) does not exist`,
      },
      {
        language: "sql",
        filename: "06-together.sql",
        code: `SELECT replace(phone, '+880', '0') AS to_number,
       format('প্রিয় %s, Island Tours এর শীতের ট্যুর বুকিং শুরু হয়েছে!',
              split_part(full_name, ' ', 1)) AS message
FROM customers
WHERE phone IS NOT NULL
ORDER BY customer_id;
-- (10 rows)

SELECT left(split_part(full_name, ' ', 1), 1)
       || left(split_part(full_name, ' ', 2), 1) AS initials,
       left(email, 2) || '***@' || split_part(email, '@', 2) AS masked_email,
       upper(city) AS city
FROM customers
WHERE country <> 'Bangladesh'
ORDER BY customer_id;
-- (3 rows): PS, AZ, OB`,
      },
    ],
    tip: (
      <ContentParagraph>
        কোনো Function এর নাম ভুলে গেলে psql এ <code className={CODE}>\df *trim*</code> লিখুন: নামের
        ভেতরে trim আছে এমন সব Function এর তালিকা আসবে। আর একটা Function কী ফেরত দেয় সন্দেহ হলে,
        Table ছাড়াই <code className={CODE}>SELECT upper(&apos;test&apos;);</code> এর মতো এক লাইনে
        পরীক্ষা করে নিন।
      </ContentParagraph>
    ),
  },
};
