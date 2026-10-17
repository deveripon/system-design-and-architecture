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
  JoinCountLab,
  JoinMatchLab,
} from "../../../components/course/topics/joins/inner-animations";
import {
  JoinAnatomyDiagram,
  JoinPairsDiagram,
  NaturalJoinTrapSplit,
  OneToManyRepeatDiagram,
} from "../../../components/course/topics/joins/inner-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const innerJoinContent: TopicData = {
  id: "inner-join",
  introduction: {
    badge: "MODULE 06 · LESSON 02",
    title: <SectionTitle>নম্বরের পাশে নাম: INNER JOIN</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          bookings Table খুললে আপনি দেখবেন Booking নম্বর, সিট, Status, আর customer_id নামে একটা নম্বর।
          কিন্তু কোথাও কোনো মানুষের নাম নেই। নামগুলো থাকে customers Table এ। আগের লেসনে আপনি দেখেছেন কেন
          Data এভাবে ভাগ করে রাখা হয়: একই নাম চব্বিশবার না লিখে একবার লেখা, আর বদলাতে হলে এক জায়গায়
          বদলানো। এই লেসনে আমরা উল্টো কাজটা শিখব: ভাগ করা Data কে প্রশ্নের সময় আবার পাশাপাশি বসানো।
        </ContentParagraph>
        <ContentParagraph>
          এই কাজের সবচেয়ে সাধারণ উপায় INNER JOIN। প্রতিটা Booking এর customer_id দেখে Database
          customers Table থেকে সেই নম্বরের মানুষটাকে খুঁজে আনে, আর দুটো Row কে জোড়া লাগিয়ে একটা Row
          বানায়। যার জোড়া পাওয়া যায় না, সে ফলাফলে আসেই না। এই শেষ কথাটা ছোট শোনালেও এটাই এই লেসনের
          সবচেয়ে গুরুত্বপূর্ণ নিয়ম, কারণ এর কারণে Report থেকে মানুষ, জায়গা আর ট্যুর চুপচাপ হারিয়ে যায়।
        </ContentParagraph>
        <ContentParagraph>
          শেষে আপনি জানবেন INNER JOIN লিখতে কী কী লাগে, ON আর USING এর তফাত, NATURAL JOIN কেন এড়িয়ে
          চলতে হয়, এক থেকে অনেক সম্পর্কে কেন একই নাম বারবার আসে, কোন Row হারায় আর কেন, JOIN এর পরে
          WHERE, ORDER BY আর GROUP BY কীভাবে বসে, আর ভুল ON কীভাবে Error ছাড়াই ভুল উত্তর দেয়। প্রতিটা কথা
          দেখবেন Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি দুই দিকের দুটো Row কে তখনই এক করি, যখন তাদের Key মেলে। মিল না পেলে আমি কিছু বানাই না, কাউকে খালি জায়গা দিয়েও রাখি না। তাই আমার ফলাফলে যা আছে সব সত্যি, কিন্তু যা নেই সেটার খবর আমি দিই না।",
      author: "INNER JOIN",
      role: "Lesson 02",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>নামের জায়গায় শুধু নম্বর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026, রবিবার। Island Tours এর Operations Manager ফারুক সাহেবের সাপ্তাহিক
                বৈঠক। তিনি নতুন Developer তানিমকে বললেন, এখনো pending থাকা Booking গুলোর একটা তালিকা দরকার,
                প্রতিটার পাশে Customer এর নাম, যাতে Support টিম একে একে ফোন করে পাকা করে নিতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                তানিম Module 03 থেকে জানেন কীভাবে bookings থেকে pending Row বের করতে হয়। Query চালিয়ে
                তিনি চারটা Row পেলেন, কিন্তু নামের জায়গায় শুধু নম্বর: customer_id 12, 1, 9, 13। ফারুক সাহেব
                নম্বর দিয়ে কী করবেন? তানিম তখন customers Table খুলে একটা একটা নম্বর খুঁজে নাম লিখে নিলেন,
                চারটা বলে কাজটা দুই মিনিটে হয়ে গেল।
              </ContentParagraph>
              <ContentParagraph>
                পরের সপ্তাহে ফারুক সাহেব চাইলেন গত এক বছরের সব Booking, নাম সহ। তখন Row শত শত। হাতে হাতে
                খোঁজা মানে ঘণ্টার পর ঘণ্টা, আর একটা ভুল নম্বর পড়লেই একজনের Booking আরেকজনের নামে চলে যাবে।
                এখানেই SQL এর JOIN আসে। তানিম যে কাজটা হাতে করছিলেন, প্রতিটা customer_id নিয়ে customers এ
                সেই নম্বরের মানুষ খোঁজা, ঠিক সেই কাজটা Database নিজে করে দেয়, এক Query তে, সব Row এর জন্য।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনে আমরা তানিমের হাতের কাজটাকেই ধাপে ধাপে SQL বানাব। শুরু করব সবচেয়ে সাধারণ ধরন দিয়ে,
                যার নাম INNER JOIN: দুই Table এর যে Row গুলোর Key মেলে, শুধু সেগুলো জোড়া লাগানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক লাইনে INNER JOIN",
          content: (
            <ContentParagraph>
              দুটো Table নিন, একটা শর্ত দিন যে কোন Column এর মান মিললে দুটো Row এক জোড়া। Database সব জোড়া
              খুঁজে বের করে, প্রতিটা জোড়াকে একটা Row বানায়। জোড়া না পাওয়া Row, যেকোনো দিকের হোক, ফলাফলে
              থাকে না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "pairing-idea",
      subHeader: { index: "002", title: "The Pairing Idea" },
      title: <SectionTitle>Key দেখে জোড়া মেলানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা স্কুলের কথা ভাবুন। হাজিরা খাতায় শুধু রোল নম্বর লেখা, আর আরেকটা খাতায় রোল নম্বরের পাশে
                ছাত্রের নাম। প্রধান শিক্ষক জানতে চাইলেন আজ কারা অনুপস্থিত, নাম সহ। একজন শিক্ষক হাজিরা খাতা
                থেকে একটা রোল নম্বর নেন, নামের খাতায় সেই নম্বর খোঁজেন, দুটো মিলিয়ে একটা লাইন লেখেন। তারপর পরের
                রোল নম্বর। এই মেলানোর কাজটাই JOIN।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এ হাজিরা খাতা হলো bookings, যেখানে প্রতিটা Booking এর পাশে customer_id। নামের খাতা
                হলো customers, যেখানে প্রতিটা customer_id এর পাশে নাম। দুটোতেই customer_id আছে, আর এই একই
                মান দুই Table কে যুক্ত করে। Module 01 এ আপনি এর নাম শিখেছেন: bookings এর customer_id একটা
                Foreign Key, যেটা customers এর Primary Key কে দেখায়। JOIN এই সম্পর্কটা ধরেই হাঁটে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের ছবিতে চারজন আসল Customer আর তাঁদের সাতটা আসল Booking। প্রতিটা দাগ একটা জোড়া। লক্ষ করুন
                Imran Kabir কে, তাঁর থেকে একটাও দাগ বের হয়নি।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JoinPairsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথমে দেখুন JOIN ছাড়া bookings দেখতে কেমন, তারপর একই Booking গুলো JOIN সহ। দ্বিতীয় Query এর
              খুঁটিনাটি পরের অংশে ভেঙে দেখব, এখন শুধু Run চাপুন আর দুটো ফলাফল মিলিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="JOIN ছাড়া: শুধু নম্বর"
              query={`SELECT booking_id, customer_id, seats, status
FROM bookings
ORDER BY booking_id
LIMIT 5;`}
              caption="পাঁচটা Booking, প্রতিটার পাশে customer_id 1 থেকে 5। কে বুক করেছেন, এখান থেকে বলার উপায় নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="JOIN সহ: নম্বরের জায়গায় নাম"
              query={`SELECT b.booking_id, c.full_name, b.seats, b.status
FROM bookings AS b
INNER JOIN customers AS c
  ON c.customer_id = b.customer_id
ORDER BY b.booking_id
LIMIT 5;`}
              caption="একই পাঁচটা Booking, এবার customer_id এর জায়গায় Rahim Uddin, Nusrat Jahan, Tanvir Ahmed, Farhana Akter আর Sabbir Hossain। Database প্রতিটা Booking এর customer_id নিয়ে customers এ সেই নম্বরের মানুষটাকে খুঁজে এনেছে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "anatomy",
      subHeader: { index: "003", title: "Anatomy" },
      title: <SectionTitle>INNER JOIN এর চারটা অংশ</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <JoinAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>FROM bookings AS b:</strong> প্রথম Table, আর তার জন্য একটা ছোট ডাকনাম, যাকে বলে Table
                  Alias। এরপর পুরো Query তে bookings না লিখে শুধু b লিখলেই চলে। AS শব্দটা ঐচ্ছিক,{" "}
                  <code className={CODE}>FROM bookings b</code> লিখলেও একই।
                </ListItem>
                <ListItem>
                  <strong>INNER JOIN customers AS c:</strong> দ্বিতীয় Table আর তার ডাকনাম। INNER শব্দটাও ঐচ্ছিক।
                  শুধু <code className={CODE}>JOIN</code> লিখলে PostgreSQL আর MySQL দুটোই সেটাকে INNER JOIN
                  ধরে। এই ট্র্যাকে বেশিরভাগ জায়গায় ছোট রূপটা দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>ON c.customer_id = b.customer_id:</strong> জোড়ার শর্ত। Database প্রতিটা সম্ভাব্য জোড়ার
                  জন্য এই শর্তটা পরীক্ষা করে, আর যেখানে সত্যি সেখানে জোড়া রাখে। সাধারণত শর্তটা হয় একদিকের
                  Foreign Key সমান অন্যদিকের Primary Key।
                </ListItem>
                <ListItem>
                  <strong>SELECT b.booking_id, c.full_name:</strong> জোড়া থেকে কোন Column দেখাতে হবে। এখন দুই
                  Table এর Column ই হাতের কাছে, তাই কোনটা কোন Table এর, ডাকনাম দিয়ে বলে দেওয়া ভালো অভ্যাস।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা কথা মনে রাখুন: INNER JOIN এ কোন Table আগে লিখলেন তাতে ফলাফলের Row বদলায় না। bookings JOIN
                customers আর customers JOIN bookings একই জোড়াগুলো দেয়, শুধু SELECT এ Column এর ক্রম আপনি যেমন
                লেখেন তেমন আসে। নিচে দুই দিক থেকে গুনে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই দিক থেকে একই জোড়া"
              query={`SELECT count(*) AS from_bookings_side
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;

SELECT count(*) AS from_customers_side
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id;`}
              caption="দুটোতেই 24। প্রতিটা Booking এর ঠিক একজন Customer, তাই চব্বিশটা জোড়া, যেদিক থেকেই লিখুন। ON এর দুই পাশও আপনি অদলবদল করতে পারেন, = দুই দিকেই একই।"
            />
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
                  তানিমের প্রথম কাজটা এবার আপনি করুন। সব pending Booking এর{" "}
                  <code className={CODE}>booking_id</code>, Customer এর{" "}
                  <code className={CODE}>full_name</code> আর <code className={CODE}>seats</code>, এই তিনটা
                  Column, booking_id অনুযায়ী ছোট থেকে বড়।
                </>
              }
              hint={
                <>
                  bookings কে customers এর সাথে <code className={CODE}>JOIN ... ON c.customer_id =
                  b.customer_id</code> দিয়ে জুড়ুন, তারপর <code className={CODE}>WHERE b.status =
                  &apos;pending&apos;</code> আর <code className={CODE}>ORDER BY b.booking_id</code>।
                </>
              }
              solution={`SELECT b.booking_id, c.full_name, b.seats
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.status = 'pending'
ORDER BY b.booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "watch-it-pair",
      subHeader: { index: "004", title: "Watch It Pair" },
      title: <SectionTitle>Row ধরে ধরে জোড়া লাগা দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Database ভেতরে আসলে কোন কৌশলে জোড়া খোঁজে, সেটা Module 13 এ Query Plan পড়ার সময় বিস্তারিত দেখবেন। এখন
                সবচেয়ে সহজ ছবিটা মাথায় রাখুন: বাম Table এর একটা একটা Row নেওয়া, ডান Table এ মিল খোঁজা, যত মিল
                তত নতুন Row। নিচের ল্যাবে নিজে ধাপে ধাপে চালান। তিনটা আসল জোড়া আছে, প্রতিটায় একটা করে হারিয়ে
                যাওয়া Row।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>customers ⋈ bookings:</strong> শেষে খেয়াল করুন Imran Kabir কোথায় গেলেন।
                </ListItem>
                <ListItem>
                  <strong>destinations ⋈ tours:</strong> Kuakata এর কী হলো, আর Saint Martin কয়বার এল।
                </ListItem>
                <ListItem>
                  <strong>tours ⋈ guides:</strong> Ratargul এর guide_id NULL, আর Nazmul Karim এর কোনো ট্যুর নেই।
                  দুজনেরই কী হলো, দেখুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JoinMatchLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "⋈ চিহ্নটা কী",
          content: (
            <ContentParagraph>
              বইয়ে আর Diagram এ JOIN বোঝাতে প্রায়ই ⋈ চিহ্ন ব্যবহার হয়, যার নাম bowtie। customers ⋈ bookings
              মানে দুটো Table কে জোড়া লাগানো। SQL এ এটা লেখার দরকার নেই, শুধু চিনে রাখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "columns-both-sides",
      subHeader: { index: "005", title: "Columns From Both Sides" },
      title: <SectionTitle>কোন Column কার, বলে দিন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                JOIN এর পরে হাতের কাছে দুই Table এর সব Column। বেশিরভাগ নাম শুধু এক Table এ আছে, যেমন full_name
                শুধু customers এ, seats শুধু bookings এ। এগুলো ডাকনাম ছাড়া লিখলেও Database বুঝে নেয়। কিন্তু
                customer_id দুই Table এই আছে। শুধু customer_id লিখলে Database জানে না আপনি কোনটার কথা বলছেন,
                আর অনুমান না করে সরাসরি Error দেয়।
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
              caption="ERROR: column reference &quot;customer_id&quot; is ambiguous। ambiguous মানে দুই রকম অর্থ হতে পারে। ঠিক করতে প্রথম লাইনে bookings.customer_id বা customers.customer_id লিখুন। এখানে দুটোর মান সবসময় এক, তবু Database নিজে বেছে নেয় না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এজন্যই অভিজ্ঞ Developer রা JOIN Query তে প্রতিটা Column এর আগে ডাকনাম লেখেন, নাম একটাই থাকুক
                বা দুটো। আজ শুধু customers এ phone আছে, কাল কেউ bookings এ contact_phone না রেখে phone নামেই
                একটা Column যোগ করলে আপনার পুরনো Query হঠাৎ ambiguous Error দিতে শুরু করবে। আগে থেকে ডাকনাম
                লিখে রাখলে এই বিপদ আসে না।
              </ContentParagraph>
              <ContentParagraph>
                এক Table এর সব Column চাইলে <code className={CODE}>b.*</code> লেখা যায়, তার সাথে অন্য Table এর
                বাছাই করা Column। নিচের Query তে bookings এর সাতটা Column আর customers থেকে শুধু নামটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একদিকের সব, অন্যদিকের একটা"
              query={`SELECT b.*, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
ORDER BY b.booking_id
LIMIT 3;`}
              caption="আটটা Column: bookings এর booking_id থেকে booked_at পর্যন্ত সাতটা, শেষে full_name। প্রথম Row: Booking 1, Rahim Uddin। Report এর জন্য এটা সুবিধার, তবে App এর Code এ * এর বদলে Column এর নাম লেখাই নিয়ম, Module 03 এ যেমন দেখেছেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              MySQL ও একই কারণে থামে, শুধু লেখাটা আলাদা: ERROR 1052 (23000): Column &apos;customer_id&apos; in
              field list is ambiguous। ডাকনাম, AS আর INNER JOIN এর লেখার নিয়ম দুই Database এ হুবহু এক।
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
                  প্রতিটা ট্যুরের নাম আর সে কোন জায়গায় যায়: tours এর <code className={CODE}>title</code> আর
                  destinations এর <code className={CODE}>name</code>, এই দুটো Column। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  tours এর <code className={CODE}>destination_id</code> হলো destinations এর Primary Key এর দিকে
                  Foreign Key। <code className={CODE}>ON d.destination_id = t.destination_id</code>।
                </>
              }
              solution={`SELECT t.title, d.name
FROM tours t
JOIN destinations d ON d.destination_id = t.destination_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "using",
      subHeader: { index: "006", title: "USING" },
      title: <SectionTitle>নাম এক হলে ছোট করে: USING</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Database এ একটা ভালো অভ্যাস মানা হয়েছে: Foreign Key এর নাম আর সে যে Primary
                Key কে দেখায়, দুটোর নাম এক। bookings এর customer_id দেখায় customers এর customer_id কে,
                departures এর tour_id দেখায় tours এর tour_id কে। নাম এক হলে ON এর বদলে একটা ছোট রূপ লেখা যায়:{" "}
                <code className={CODE}>USING (customer_id)</code>। মানে, দুই দিকে customer_id নামের যে Column আছে,
                তার মান মিললে জোড়া।
              </ContentParagraph>
              <ContentParagraph>
                USING এর একটা বাড়তি প্রভাব আছে। ON দিয়ে জুড়লে ফলাফলে customer_id দুইবার থাকে, দুই Table থেকে
                একবার করে। USING দিয়ে জুড়লে দুটো মিলে একটা Column হয়ে যায়, আর <code className={CODE}>SELECT *</code>{" "}
                লিখলে সেটা সবার আগে বসে। ফলে ডাকনাম ছাড়া শুধু customer_id লিখলেও আর ambiguous Error আসে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="USING: একটাই customer_id"
              query={`SELECT *
FROM bookings
JOIN customers USING (customer_id)
LIMIT 2;`}
              caption="প্রথম Column customer_id, একবারই। তারপর bookings এর বাকি ছয়টা Column, তারপর customers এর বাকি ছয়টা, মোট তেরোটা। ON দিয়ে একই কাজ করলে customer_id দুইবার আসত, চোদ্দটা Column।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "ON", "USING"],
          rows: [
            ["লেখা", "ON c.customer_id = b.customer_id", "USING (customer_id)"],
            ["Column এর নাম আলাদা হলে", "চলে", "চলে না, নাম দুই দিকে এক হতে হবে"],
            ["= ছাড়া অন্য শর্ত", "চলে, যেমন BETWEEN বা <", "চলে না, শুধু সমান"],
            ["ফলাফলে মিলের Column", "দুইবার, দুই Table থেকে", "একবার, মিলে যায়"],
            ["এই ট্র্যাকে", "বেশিরভাগ জায়গায়", "ছোট Query তে, নাম এক হলে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তাহলে কোনটা লিখবেন? ON সব জায়গায় চলে, আর শর্তটা চোখের সামনে থাকে, তাই এই ট্র্যাক ON কেই প্রধান
              হিসেবে ব্যবহার করে। USING সুন্দর, যখন নাম এক আর শর্ত শুধু সমান। দুটোই বৈধ SQL, PostgreSQL আর
              MySQL দুটোতেই চলে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "natural-join-trap",
      subHeader: { index: "007", title: "The NATURAL JOIN Trap" },
      title: <SectionTitle>যে JOIN নিজে শর্ত বানায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                USING এর চেয়েও ছোট একটা রূপ আছে, NATURAL JOIN, যেখানে কোনো শর্তই লিখতে হয় না। Database নিজে
                দেখে নেয় দুই Table এ একই নামের Column কোনগুলো, আর সবগুলো মিলতে হবে এমন শর্ত বানিয়ে নেয়। শুনতে
                আরামের, কিন্তু ঠিক এই “নিজে বানিয়ে নেওয়া” টাই বিপদ। কোন Column মেলানো হবে, সেটা Query তে লেখা
                থাকে না, থাকে Table এর গঠনে। গঠন বদলালে Query এর মানে বদলে যায়, কেউ টের পায় না।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এ একটা আসল উদাহরণ আছে। bookings আর payments দুটোতেই booking_id আছে, যেটা দিয়ে জোড়া
                লাগানোর কথা। কিন্তু দুটোতেই status নামে আরেকটা Column আছে, যাদের মানে একদম আলাদা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NaturalJoinTrapSplit /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NATURAL JOIN বনাম লেখা শর্ত"
              query={`SELECT count(*) AS natural_rows
FROM bookings NATURAL JOIN payments;

SELECT count(*) AS on_rows
FROM bookings b
JOIN payments p ON p.booking_id = b.booking_id;

SELECT count(*) AS customers_natural_guides
FROM customers NATURAL JOIN guides;`}
              caption="প্রথমটা 0, কারণ booking_id আর status দুটোই মিলতে হবে, আর confirmed কখনো paid এর সমান না। ঠিক শর্ত লিখলে 19, প্রতিটা Payment তার Booking এর সাথে। তৃতীয়টাও 0: customers আর guides এ full_name আর phone দুটো Column এর নাম মেলে, অথচ দুই Table এর মধ্যে কোনো সম্পর্কই নেই। কোনো ক্ষেত্রেই Error নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "NATURAL JOIN লিখবেন না",
          content: (
            <ContentParagraph>
              আজকের Table এ NATURAL JOIN ঠিক কাজ করলেও কাল কেউ দুই Table এ একই নামে একটা নতুন Column যোগ করলে,
              যেমন দুটোতেই created_at, Query টা চুপচাপ শূন্য বা ভুল Row দিতে শুরু করবে। শর্ত সবসময় নিজে লিখুন,
              ON দিয়ে, বা নাম এক হলে USING দিয়ে। MySQL এও NATURAL JOIN একইভাবে কাজ করে, আর একই ফাঁদে পড়ে:
              সেখানেও bookings NATURAL JOIN payments শূন্য Row দেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "one-to-many",
      subHeader: { index: "008", title: "One to Many" },
      title: <SectionTitle>একজন Customer, তিনটা Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                customers Table এ Rahim Uddin একটাই Row। কিন্তু তিনি তিনবার বুক করেছেন। JOIN প্রতিটা জোড়ার জন্য
                একটা Row বানায়, আর Rahim এর জোড়া তিনটা, তাই ফলাফলে তাঁর নাম তিনবার। এটাকে বলে এক থেকে অনেক
                সম্পর্ক, One to Many: একজন Customer এর অনেক Booking থাকতে পারে, কিন্তু একটা Booking এর
                Customer একজনই।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OneToManyRepeatDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Rahim Uddin এর সব Booking"
              query={`SELECT c.full_name, b.booking_id, b.seats, b.status
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
WHERE c.customer_id = 1
ORDER BY b.booking_id;`}
              caption="তিনটা Row, প্রতিটায় Rahim Uddin: Booking 1, 8 আর 17। নামের পুনরাবৃত্তি ভুল না, ফলাফলের প্রতিটা Row একটা Booking এর গল্প বলছে, আর প্রতিটা গল্পে একই মানুষ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই পুনরাবৃত্তি থেকে একটা সহজ হিসাব বের হয়, যেটা প্রতিটা JOIN লেখার পরে মাথায় করে নেওয়া উচিত।
                Foreign Key ধরে জুড়লে ফলাফলের Row সংখ্যা সাধারণত “অনেক” দিকের Row সংখ্যার সমান। bookings JOIN
                customers এ 24, কারণ Booking 24টা। tours JOIN destinations এ 9, কারণ ট্যুর 9টা। যদি সংখ্যাটা এর
                চেয়ে বেশি আসে, শর্তে গোলমাল আছে।
              </ContentParagraph>
              <ContentParagraph>
                পুনরাবৃত্তির একটা ফাঁদও আছে, যেটা পরে GROUP BY অংশে আবার আসবে। JOIN এর ফলাফলে count(*) গুনলে
                গোনা হয় জোড়া, মানুষ না। Rahim এর ফলাফলে count(*) তিন, যদিও তিনি একজন মানুষ।
              </ContentParagraph>
            </div>
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
                  Customer এর নাম দিয়ে খুঁজুন: Rahim Uddin এর সব Booking এর{" "}
                  <code className={CODE}>booking_id</code>, <code className={CODE}>departure_id</code> আর{" "}
                  <code className={CODE}>status</code>, booking_id অনুযায়ী। শর্তে customer_id ব্যবহার করবেন
                  না, নাম ব্যবহার করুন।
                </>
              }
              hint={
                <>
                  নামটা আছে customers এ, তাই আগে JOIN, তারপর{" "}
                  <code className={CODE}>WHERE c.full_name = &apos;Rahim Uddin&apos;</code>।
                </>
              }
              solution={`SELECT b.booking_id, b.departure_id, b.status
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE c.full_name = 'Rahim Uddin'
ORDER BY b.booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "unmatched-vanish",
      subHeader: { index: "009", title: "Unmatched Rows Vanish" },
      title: <SectionTitle>যাদের জোড়া নেই, তারা কোথায় গেল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার INNER JOIN এর সবচেয়ে গুরুত্বপূর্ণ নিয়ম: যে Row এর জোড়া নেই, সে ফলাফলে নেই। কোনো Error নেই,
                কোনো সতর্কবার্তা নেই, Row টা শুধু আসে না। Island Tours এর Sample Database এ এর চারটা উদাহরণ
                ইচ্ছা করে রাখা হয়েছে, যাতে আপনি নিজের চোখে দেখতে পারেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Imran Kabir:</strong> Account খুলেছেন, কিছু বুক করেননি। customers JOIN bookings এ তিনি
                  নেই।
                </ListItem>
                <ListItem>
                  <strong>Kuakata:</strong> Destination আছে, কোনো ট্যুর নেই। destinations JOIN tours এ Kuakata
                  নেই।
                </ListItem>
                <ListItem>
                  <strong>Ratargul Swamp Boat Day:</strong> ট্যুর আছে, guide_id NULL। tours JOIN guides এ এই ট্যুর
                  নেই, কারণ NULL কোনো কিছুর সমান না, Module 03 এ যেমন দেখেছেন।
                </ListItem>
                <ListItem>
                  <strong>Cox&apos;s Bazar Family Package:</strong> ট্যুর আছে, একটাও Departure নেই। tours JOIN
                  departures এ এই ট্যুর নেই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কতজন ঢুকল, কতজন রয়ে গেল"
              query={`SELECT count(*) AS customers FROM customers;

SELECT count(*) AS joined_rows,
       count(DISTINCT c.customer_id) AS customers_in_result
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id;

SELECT count(*) AS destinations FROM destinations;

SELECT count(*) AS joined_rows,
       count(DISTINCT d.destination_id) AS destinations_in_result
FROM destinations d
JOIN tours t ON t.destination_id = d.destination_id;

SELECT count(*) AS joined_rows,
       count(DISTINCT t.tour_id) AS tours_in_result
FROM tours t
JOIN departures d ON d.tour_id = t.tour_id;`}
              caption="15 জন Customer, কিন্তু JOIN এর ফলাফলে আলাদা Customer 14 জন: Imran নেই। 7টা Destination, ফলাফলে 6টা: Kuakata নেই। শেষটায় 16টা Departure জোড়া পেয়েছে, কিন্তু 9টা ট্যুরের মধ্যে আছে 8টা: Family Package নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই হারানোটা কখনো ঠিক, কখনো বিপদ। “যাঁরা বুক করেছেন তাঁদের তালিকা” চাইলে Imran কে বাদ দেওয়াই ঠিক।
              কিন্তু “সব Customer, আর কে কয়টা বুক করেছেন” চাইলে Imran এর পাশে 0 থাকার কথা, আর INNER JOIN তাঁকে
              চুপচাপ মুছে দেবে। নিচের Dhaka Report টা দেখুন, ছয়জনের জায়গায় পাঁচজন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Dhaka র Customer আর তাঁদের Booking"
              query={`SELECT full_name
FROM customers
WHERE city = 'Dhaka'
ORDER BY full_name;

SELECT c.full_name, b.booking_id, b.status
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
WHERE c.city = 'Dhaka'
ORDER BY c.full_name, b.booking_id;`}
              caption="প্রথম তালিকায় Dhaka র ছয়জন, Imran Kabir সহ। JOIN এর পরে এগারোটা Row, কিন্তু নাম পাঁচটা: Mitu, Nusrat, Rahim, Shuvo আর Sumaiya। Imran কোথাও নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "যাদের রাখতে চান, তাদের জন্য LEFT JOIN",
          content: (
            <ContentParagraph>
              জোড়া না থাকলেও একদিকের সব Row রাখতে চাইলে INNER JOIN না, LEFT JOIN লাগে। সেটা পরের লেসনের বিষয়:{" "}
              <Link href="/sql/topic/left-right-join" className={LINK}>
                LEFT and RIGHT JOIN
              </Link>
              । এখন শুধু অভ্যাসটা গড়ুন: প্রতিটা INNER JOIN লেখার পর নিজেকে জিজ্ঞেস করুন, যাদের জোড়া নেই
              তাদের হারানো কি ঠিক আছে?
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
                  প্রতিটা Guide আর তাঁর ট্যুর: guides এর <code className={CODE}>full_name</code> আর tours এর{" "}
                  <code className={CODE}>title</code>, আগে Guide এর নাম অনুযায়ী, তারপর ট্যুরের নাম অনুযায়ী।
                  Check চাপার আগে আন্দাজ করুন কয়টা Row আসবে, আর কে কে বাদ পড়বেন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>JOIN tours t ON t.guide_id = g.guide_id</code>, তারপর{" "}
                  <code className={CODE}>ORDER BY g.full_name, t.title</code>। Nazmul এর কোনো ট্যুর নেই, আর
                  Ratargul এর কোনো Guide নেই।
                </>
              }
              solution={`SELECT g.full_name, t.title
FROM guides g
JOIN tours t ON t.guide_id = g.guide_id
ORDER BY g.full_name, t.title;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "filter-and-sort",
      subHeader: { index: "010", title: "Filter and Sort" },
      title: <SectionTitle>JOIN এর পরে WHERE আর ORDER BY</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এ শেখা চলার ক্রম মনে আছে? প্রথমে FROM, তারপর WHERE। JOIN হলো FROM এর অংশ, তাই জোড়া
                লাগানোর কাজ সবার আগে হয়। এর মানে WHERE আর ORDER BY তে আপনি দুই Table এর যেকোনো Column ব্যবহার
                করতে পারেন: Customer এর শহর দিয়ে ছাঁকা, Departure এর তারিখ দিয়ে সাজানো, সব এক Query তে।
              </ContentParagraph>
              <ContentParagraph>
                INNER JOIN এ একটা সুবিধাও আছে: বাড়তি শর্ত ON এর ভেতরে লিখুন বা WHERE এ, ফলাফল একই। নিচের দুটো
                Query একই এগারোটা Row গোনে। তবে পরিষ্কার থাকার জন্য নিয়ম রাখুন: কোন Row কার সাথে জোড়া লাগবে,
                সেটা ON এ; কোন Row ফলাফলে থাকবে, সেটা WHERE এ। LEFT JOIN এ এই দুই জায়গার তফাত ফলাফল বদলে দেয়,
                সেটা দেখবেন{" "}
                <Link href="/sql/topic/multi-table-joins" className={LINK}>
                  Lesson 07
                </Link>{" "}
                এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শর্ত ON এ, নাকি WHERE এ"
              query={`SELECT count(*) AS condition_in_on
FROM bookings b
JOIN customers c
  ON c.customer_id = b.customer_id AND c.city = 'Dhaka';

SELECT count(*) AS condition_in_where
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE c.city = 'Dhaka';`}
              caption="দুটোই 11। INNER JOIN এ জোড়া না পাওয়া আর WHERE এ বাদ পড়া একই কথা, দুটোই Row কে ফলাফল থেকে সরায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সামনের Departure, ট্যুরের নাম সহ"
              query={`SELECT d.departure_id, d.starts_on, t.title, d.seats_left
FROM departures d
JOIN tours t ON t.tour_id = d.tour_id
WHERE d.starts_on >= DATE '2026-11-01'
  AND t.is_active
ORDER BY d.starts_on;`}
              caption="আটটা Departure। WHERE এ দুই Table এর শর্ত একসাথে: তারিখটা departures এর, is_active টা tours এর। বন্ধ থাকা Saint Martin Luxury Stay এর 14 February এর Departure বাদ পড়েছে। t.is_active শর্তটা সরিয়ে দিন, নয়টা আসবে।"
            />
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
                  1 November 2026 বা তার পরে যেসব Departure শুরু হবে, তাদের{" "}
                  <code className={CODE}>starts_on</code>, ট্যুরের <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>seats_left</code>, তারিখ অনুযায়ী আগে থেকে পরে। বন্ধ ট্যুর বাদ দেবেন না,
                  সবগুলো দেখান।
                </>
              }
              hint={
                <>
                  departures কে tours এর সাথে <code className={CODE}>ON t.tour_id = d.tour_id</code> দিয়ে জুড়ুন,{" "}
                  <code className={CODE}>WHERE d.starts_on &gt;= DATE &apos;2026-11-01&apos;</code>, তারপর তারিখ
                  অনুযায়ী সাজান।
                </>
              }
              solution={`SELECT d.starts_on, t.title, d.seats_left
FROM departures d
JOIN tours t ON t.tour_id = d.tour_id
WHERE d.starts_on >= DATE '2026-11-01'
ORDER BY d.starts_on;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "join-then-group",
      subHeader: { index: "011", title: "Join Then Group" },
      title: <SectionTitle>Module 05 যা পারেনি: নাম ধরে হিসাব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 05 এ আপনি প্রতিটা Customer এর Booking গুনেছেন, কিন্তু ফলাফলে ছিল শুধু customer_id, কারণ
                নামটা অন্য Table এ। এবার JOIN আছে। চলার ক্রমে JOIN আগে, GROUP BY পরে, তাই প্রথমে প্রতিটা Booking
                এর পাশে নাম বসে, তারপর নাম ধরে দল হয়।
              </ContentParagraph>
              <ContentParagraph>
                একটা খুঁটিনাটি খেয়াল করুন: GROUP BY তে শুধু নাম না, <code className={CODE}>c.customer_id,
                c.full_name</code> দুটোই। কারণ নাম অনন্য না। আজ Island Tours এ দুজন Rahim Uddin নেই, কিন্তু কাল
                আসতে পারেন, আর শুধু নাম ধরে দল করলে দুজনের Booking এক দলে মিশে যাবে। id দলকে আলাদা রাখে, নামটা
                শুধু দেখানোর জন্য। PostgreSQL এ Primary Key দিয়ে দল করলে সেই Table এর অন্য Column ও SELECT এ
                চলে, Module 05 এ যেমন দেখেছেন, তবু নামটা GROUP BY তে রাখা পড়তে সহজ আর MySQL এও নিরাপদ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Customer এর নাম আর Booking"
              query={`SELECT c.full_name,
       count(*)      AS bookings,
       sum(b.seats)  AS seats
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id, c.full_name
ORDER BY bookings DESC, c.full_name;`}
              caption="চোদ্দটা Row। সবার উপরে Rahim Uddin, তিনটা Booking, ছয়টা সিট। Imran Kabir নেই, কারণ INNER JOIN তাঁকে দল তৈরির আগেই বাদ দিয়েছে। তাঁকে 0 সহ দেখাতে LEFT JOIN লাগবে, পরের লেসনে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কখনো উত্তরটা দুই ধাপ দূরে থাকে। “কোন ট্যুরে কত আয়” প্রশ্নের টাকা আছে bookings এ, আর ট্যুরের নাম আছে
              tours এ, কিন্তু bookings সরাসরি tours কে চেনে না। Booking চেনে Departure কে, Departure চেনে ট্যুরকে।
              তাই দুটো JOIN পরপর: bookings থেকে departures, departures থেকে tours। একটার পর একটা JOIN লেখার পুরো
              নিয়ম{" "}
              <Link href="/sql/topic/multi-table-joins" className={LINK}>
                Lesson 07
              </Link>{" "}
              এ, এখন শুধু দেখুন প্রতিটা JOIN আগের ফলাফলের সাথে আরেকটা Table জুড়ছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা ট্যুরের confirmed আয়"
              query={`SELECT t.title, sum(b.total_bdt) AS revenue
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t      ON t.tour_id = d.tour_id
WHERE b.status = 'confirmed'
GROUP BY t.tour_id, t.title
ORDER BY revenue DESC;`}
              caption="সাতটা ট্যুর, সবার উপরে Saint Martin Island Escape, 125000.00। সবগুলোর যোগফল 423600.00, ঠিক Module 05 এর confirmed আয়। Family Package আর Luxury Stay নেই, কারণ তাদের কোনো confirmed Booking নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Guide কয়টা ট্যুর চালান"
              query={`SELECT g.full_name, count(*) AS tours
FROM guides g
JOIN tours t ON t.guide_id = g.guide_id
GROUP BY g.guide_id, g.full_name
ORDER BY g.full_name;`}
              caption="চারজন Guide, প্রত্যেকের দুটো করে ট্যুর। পাঁচ নম্বর Guide Nazmul Karim এর কোনো ট্যুর নেই, তাই তিনি তালিকায় নেই, 0 দিয়েও না।"
            />
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
                  যে Customer দের অন্তত দুটো Booking আছে (বাতিল সহ, সব গুনুন), তাঁদের{" "}
                  <code className={CODE}>full_name</code>, Booking এর সংখ্যা আর মোট সিট, নাম অনুযায়ী A থেকে Z।
                  তিনটা Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  JOIN, তারপর <code className={CODE}>GROUP BY c.customer_id, c.full_name</code>, দলের শর্ত{" "}
                  <code className={CODE}>HAVING count(*) &gt;= 2</code>, শেষে{" "}
                  <code className={CODE}>ORDER BY c.full_name</code>।
                </>
              }
              solution={`SELECT c.full_name, count(*) AS bookings, sum(b.seats) AS seats
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id, c.full_name
HAVING count(*) >= 2
ORDER BY c.full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "wrong-on",
      subHeader: { index: "012", title: "Wrong ON" },
      title: <SectionTitle>ভুল শর্ত, Error ছাড়া ভুল উত্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ON এ ভুল Column জোড়া দিলে Database আপত্তি করে না। দুটোই integer, তুলনা চলে, জোড়া তৈরি হয়। শুধু
                জোড়াগুলোর কোনো মানে থাকে না। নিচের Query তে ভুলে Customer এর নম্বরকে Booking এর নম্বরের সাথে
                মেলানো হয়েছে। সবচেয়ে ভয়ের কথা, প্রথম সাতটা Row দেখতে একদম ঠিক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ON: booking_id = customer_id"
              query={`SELECT b.booking_id, c.full_name
FROM bookings b
JOIN customers c ON c.customer_id = b.booking_id
ORDER BY b.booking_id;`}
              caption="পনেরোটা Row। Booking 1 থেকে 7 এর পাশে ঠিক মানুষই এসেছে, কারণ এই সাতটা Booking এর customer_id কাকতালীয়ভাবে Booking নম্বরের সমান। Booking 8 এর পাশে Sumaiya Islam, অথচ Booking 8 আসলে Rahim এর। আর 16 থেকে 24 নম্বর Booking পুরো উধাও।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরার উপায় সেই হিসাবটা, যেটা আগে শিখেছেন: Foreign Key ধরে জুড়লে Row এর সংখ্যা “অনেক” দিকের সমান।
                bookings এর সাথে customers জুড়লে 24 আসার কথা। 15 এসেছে মানে কোথাও গোলমাল। তাই প্রতিটা নতুন JOIN
                এর পরে একবার count(*) চালানো একটা ভালো অভ্যাস।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা ভুল হলো ON একদম ভুলে যাওয়া। PostgreSQL তখন Query টাই মানে না, syntax error দেয়, যেটা আসলে
                ভালো খবর। কিন্তু MySQL একই Query খুশি মনে চালায়, আর ON ছাড়া JOIN কে ধরে নেয় সবার সাথে সবার জোড়া:
                24 × 15 = 360টা Row। এর নাম Cartesian Product, পুরো গল্প{" "}
                <Link href="/sql/topic/cross-join" className={LINK}>
                  Lesson 05
                </Link>{" "}
                এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ON ভুলে গেলে"
              query={`SELECT count(*)
FROM bookings b
JOIN customers c;`}
              caption="এই বক্সে আসবে ERROR: syntax error at end of input, আর psql এ একই Query লিখলে syntax error at or near &quot;;&quot;। কথা একটাই: JOIN লিখলে ON বা USING লাগবেই। MySQL 8.4 এ একই Query 360 দেয়, কোনো Error ছাড়া, আমরা Docker এ চালিয়ে মিলিয়ে দেখেছি।"
            />
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JoinCountLab /> },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "beyond-equality",
      subHeader: { index: "013", title: "Beyond Equality" },
      title: <SectionTitle>ON এ সমান ছাড়া অন্য শর্তও চলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন পর্যন্ত সব JOIN এর শর্ত ছিল সমান চিহ্ন। কিন্তু ON এ যেকোনো সত্য মিথ্যা শর্ত লেখা যায়। একটা
                সত্যিকারের কাজ: Marketing টিম প্রতিটা ট্যুরকে একটা দামের স্তরে বসাতে চায়, Budget, Standard আর
                Premium। স্তরগুলোর সীমা একটা ছোট Table এ রাখা হলো, তারপর ট্যুরের দাম যে স্তরের সীমার ভেতরে পড়ে,
                সেই স্তরের সাথে জোড়া।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Query তে স্তরের Table টা আলাদা করে বানানো হয়নি, VALUES দিয়ে Query এর ভেতরেই কয়েকটা Row
                লেখা হয়েছে, আর AS band(name, low, high) দিয়ে তার নাম আর Column এর নাম দেওয়া হয়েছে। শর্তটা
                Module 03 এর অর্ধেক খোলা সীমা: low এর সমান বা বেশি, high এর কম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দামের স্তরের সাথে JOIN"
              query={`SELECT t.title, t.price_bdt, band.name AS band
FROM tours t
JOIN (VALUES ('Budget',       0,  10000),
             ('Standard', 10000,  20000),
             ('Premium',  20000, 1000000)) AS band(name, low, high)
  ON t.price_bdt >= band.low AND t.price_bdt < band.high
ORDER BY t.price_bdt;`}
              caption="নয়টা ট্যুর, প্রতিটা ঠিক একটা স্তরে: চারটা Budget, চারটা Standard, একটা Premium (Saint Martin Luxury Stay, 32000.00)। স্তরের সীমা কখনো একটার উপর আরেকটা পড়লে কোনো ট্যুর দুই স্তরে জোড়া পেত আর দুইবার আসত, তাই সীমা লেখার সময় সাবধান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই ধরনের JOIN এর নাম",
          content: (
            <ContentParagraph>
              সমান চিহ্নের শর্তকে বইয়ে বলে Equi Join, আর অন্য যেকোনো শর্তকে Non-equi Join বা Theta Join। নামগুলো
              মুখস্থের দরকার নেই, শুধু জানুন ON এ BETWEEN, &lt;, &gt;, এমনকি LIKE ও বসতে পারে। USING এ পারে না, সেটা
              শুধু সমান বোঝে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Admin Panel এর Booking তালিকা</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Admin Panel খুললে প্রথম যে Page আসে, সেটা সামনের Booking এর তালিকা। প্রতিটা Row তে
                Booking নম্বর, Customer এর নাম, ট্যুরের নাম, রওনার তারিখ, সিট আর Status। এই ছয়টা তথ্য চারটা আলাদা
                Table এ: bookings, customers, departures আর tours। Page টার পেছনে তাই একটা INNER JOIN এর শিকল।
              </ContentParagraph>
              <ContentParagraph>
                এখানে INNER JOIN ই ঠিক পছন্দ, কারণ প্রতিটা Booking এর Customer আর Departure থাকতেই হবে, Database এর
                Foreign Key সেটা নিশ্চিত করে। কোনো Booking এর জোড়া না পাওয়ার উপায় নেই, তাই কিছু হারানোর ভয়ও নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সামনের সব Booking, চার Table থেকে"
              query={`SELECT b.booking_id,
       c.full_name,
       t.title,
       d.starts_on,
       b.seats,
       b.status
FROM bookings b
JOIN customers  c ON c.customer_id  = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours      t ON t.tour_id      = d.tour_id
WHERE d.starts_on >= DATE '2026-11-01'
ORDER BY d.starts_on, b.booking_id;`}
              caption="বারোটা Booking, প্রথমটা 14 November এর Sylhet Tea Garden Tour এ Priya Sharma, pending। শেষটা 8 January 2027 এর Bandarban Hill Trek এ Oliver Bennett। Mitu Rahman এর বাতিল Booking ও আছে, Admin Panel এ Status দেখে চেনা যায়।"
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
                  Operations জানতে চায় কোন ট্যুরে সবচেয়ে বেশি সিট বিক্রি হয়েছে। বাতিল Booking বাদ দিয়ে প্রতিটা
                  ট্যুরের <code className={CODE}>title</code> আর বিক্রি হওয়া মোট সিট, শুধু যেসব ট্যুরে পাঁচ বা তার
                  বেশি সিট গেছে। বেশি সিট আগে; সমান হলে title অনুযায়ী।
                </>
              }
              hint={
                <>
                  bookings থেকে departures, departures থেকে tours, দুটো JOIN।{" "}
                  <code className={CODE}>WHERE b.status &lt;&gt; &apos;cancelled&apos;</code>,{" "}
                  <code className={CODE}>GROUP BY t.tour_id, t.title</code>,{" "}
                  <code className={CODE}>HAVING sum(b.seats) &gt;= 5</code>, তারপর{" "}
                  <code className={CODE}>ORDER BY</code> দুটো Column দিয়ে।
                </>
              }
              solution={`SELECT t.title, sum(b.seats) AS seats_sold
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t      ON t.tour_id = d.tour_id
WHERE b.status <> 'cancelled'
GROUP BY t.tour_id, t.title
HAVING sum(b.seats) >= 5
ORDER BY seats_sold DESC, t.title;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>যেকোনো INNER JOIN লেখার ছয় ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নটা Column এ ভাঙুন",
              description:
                "ফলাফলে কী কী দেখাতে হবে লিখে ফেলুন, যেমন Booking নম্বর, নাম, ট্যুরের নাম। প্রতিটার পাশে লিখুন সেটা কোন Table এ থাকে।",
            },
            {
              title: "Table গুলোর পথ খুঁজুন",
              description:
                "/sql/database এর ছবিতে দেখুন Table গুলো কোন Key দিয়ে যুক্ত। bookings থেকে tours এ সরাসরি পথ নেই, departures হয়ে যেতে হয়।",
            },
            {
              title: "FROM আর JOIN লিখুন, প্রতিটার ডাকনাম সহ",
              description:
                "সাধারণত যে Table এর প্রতিটা Row একটা উত্তর, সেটা দিয়ে শুরু করুন, যেমন প্রতিটা Booking এর জন্য একটা Row চাইলে FROM bookings b।",
            },
            {
              title: "প্রতিটা JOIN এর ON এ Key জোড়া দিন",
              description:
                "একদিকের Foreign Key সমান অন্যদিকের Primary Key। দুই পাশের Column এর নাম পড়ে মিলিয়ে নিন, booking_id আর customer_id গুলিয়ে ফেলা খুব সহজ।",
            },
            {
              title: "count(*) দিয়ে Row গুনে যাচাই করুন",
              description:
                "Foreign Key ধরে জুড়লে Row এর সংখ্যা অনেক দিকের সমান হওয়ার কথা। কম এলে কেউ হারিয়েছে, বেশি এলে শর্তে গোলমাল।",
            },
            {
              title: "তারপর WHERE, GROUP BY, ORDER BY",
              description:
                "জোড়া ঠিক হলে বাকিটা আগের মডিউলের মতোই। প্রতিটা Column এর আগে ডাকনাম, আর GROUP BY তে নামের সাথে id।",
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
          headers: ["ভুল", "কী হয়", "ঠিক উপায়"],
          rows: [
            [
              "দুই Table এ থাকা Column এর আগে ডাকনাম না দেওয়া",
              "column reference is ambiguous Error",
              "সব Column এর আগে b. বা c. লিখুন",
            ],
            [
              "ON এ ভুল Column জোড়া",
              "Error ছাড়া ভুল জোড়া, Row এর সংখ্যা উল্টাপাল্টা",
              "Foreign Key আর Primary Key এর নাম পড়ে মেলান, count(*) দিয়ে যাচাই",
            ],
            [
              "ON ভুলে যাওয়া",
              "PostgreSQL এ syntax error, MySQL এ সবার সাথে সবার জোড়া",
              "JOIN লিখলেই সাথে সাথে ON লিখুন",
            ],
            [
              "NATURAL JOIN ব্যবহার",
              "একই নামের সব Column মেলে, ভুল বা শূন্য ফলাফল",
              "শর্ত নিজে লিখুন, ON বা USING দিয়ে",
            ],
            [
              "যাদের জোড়া নেই তাদের হারানো টের না পাওয়া",
              "Report থেকে মানুষ, জায়গা, ট্যুর চুপচাপ বাদ",
              "নিজেকে জিজ্ঞেস করুন, হারানো কি ঠিক? না হলে LEFT JOIN",
            ],
            [
              "JOIN এর পরে count(*) দিয়ে মানুষ গোনা",
              "জোড়া গোনা হয়, একজন তিনবার গোনা পড়েন",
              "count(DISTINCT c.customer_id), বা আগে কী গুনছেন ভেবে নিন",
            ],
            [
              "শুধু নাম দিয়ে GROUP BY",
              "একই নামের দুজনের হিসাব এক দলে মিশে যায়",
              "GROUP BY c.customer_id, c.full_name",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়ার আর দেখার জন্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/tutorial-join.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL Tutorial: Joins Between Tables
                </a>
                : অফিসিয়াল টিউটোরিয়ালের ছোট আর পরিষ্কার অধ্যায়, আবহাওয়া আর শহরের দুটো Table দিয়ে।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/queries-table-expressions.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: Table Expressions
                </a>
                : Joined Tables অংশে INNER, ON, USING আর NATURAL এর পুরো নিয়ম, আর USING এর Column মিলে যাওয়ার কথা।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/join.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4 Reference: JOIN Clause
                </a>
                : MySQL এর JOIN এর লেখার নিয়ম, ON ছাড়া JOIN এর আচরণ সহ।
              </ListItem>
              <ListItem>
                <a href="https://en.wikipedia.org/wiki/Join_(SQL)" className={LINK} target="_blank" rel="noopener noreferrer">
                  Wikipedia: Join (SQL)
                </a>
                : সব ধরনের JOIN এক জায়গায়, ছোট ছোট উদাহরণ সহ।
              </ListItem>
              <ListItem>
                <a href="https://www.youtube.com/watch?v=hlGoQC332VM&t=8640s" className={LINK} target="_blank" rel="noopener noreferrer">
                  আপনার দেখা SQL Course, Joins অংশ (02:24:00 থেকে)
                </a>
                : MySQL দিয়ে INNER, LEFT আর RIGHT JOIN। লেখার নিয়ম এই লেসনের মতোই, শুধু মনে রাখবেন MySQL এ ON
                ছাড়া JOIN Error দেয় না।
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
      title: <SectionTitle>পাঁচ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  INNER JOIN দুই Table এর সেই Row গুলো জোড়া লাগায়, যাদের জন্য ON এর শর্ত সত্যি। প্রতিটা জোড়া একটা
                  Row। JOIN লিখলেই INNER JOIN বোঝায়।
                </ListItem>
                <ListItem>
                  ডাকনাম দিন, আর প্রতিটা Column এর আগে ডাকনাম লিখুন। দুই Table এ একই নাম থাকলে না লিখলে ambiguous
                  Error।
                </ListItem>
                <ListItem>
                  USING ছোট রূপ, নাম এক আর শর্ত সমান হলে। NATURAL JOIN এড়িয়ে চলুন, সে একই নামের সব Column মেলায়।
                </ListItem>
                <ListItem>
                  এক থেকে অনেক সম্পর্কে “এক” দিক পুনরাবৃত্ত হয়। Foreign Key ধরে জুড়লে Row এর সংখ্যা “অনেক” দিকের
                  সমান হওয়ার কথা, এটা দিয়ে নিজের JOIN যাচাই করুন।
                </ListItem>
                <ListItem>
                  যার জোড়া নেই সে ফলাফলে নেই: Imran, Kuakata, Ratargul, Family Package। রাখতে চাইলে LEFT JOIN।
                </ListItem>
                <ListItem>
                  JOIN হয় সবার আগে, তাই WHERE, GROUP BY, ORDER BY সব দুই Table এর Column দেখে। INNER JOIN এ বাড়তি
                  শর্ত ON বা WHERE তে, ফলাফল একই।
                </ListItem>
                <ListItem>
                  ভুল ON Error দেয় না, ভুল উত্তর দেয়। ON ভুলে গেলে PostgreSQL থামে, MySQL সবার সাথে সবার জোড়া
                  বানায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                পরের লেসনে প্রশ্নটা উল্টে যাবে: যাদের জোড়া নেই, তাদেরও রাখতে হলে কী করবেন, আর তাদের খুঁজে বের
                করবেন কীভাবে।{" "}
                <Link href="/sql/topic/left-right-join" className={LINK}>
                  LEFT and RIGHT JOIN
                </Link>{" "}
                এ সেখানেই Imran Kabir তাঁর 0 নিয়ে ফিরে আসবেন।
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
      ["INNER JOIN", "ON সত্যি হলে দুই Row এক জোড়া", "Booking এর পাশে Customer এর নাম"],
      ["JOIN", "INNER JOIN এর ছোট রূপ", "FROM bookings b JOIN customers c"],
      ["Table Alias", "Table এর ছোট ডাকনাম", "b, c, d, t"],
      ["ambiguous", "দুই Table এ একই Column, কোনটা বলা নেই", "customer_id"],
      ["USING", "নাম এক হলে ছোট শর্ত, Column মিলে একটা হয়", "USING (customer_id)"],
      ["NATURAL JOIN", "একই নামের সব Column মেলায়, এড়িয়ে চলুন", "bookings আর payments এ 0 Row"],
      ["One to Many", "এক দিক বারবার আসে", "Rahim Uddin তিনবার"],
      ["Row এর হিসাব", "FK ধরে জুড়লে অনেক দিকের সংখ্যা", "bookings JOIN customers = 24"],
      ["হারিয়ে যাওয়া Row", "জোড়া নেই মানে ফলাফলে নেই", "Imran, Kuakata, Ratargul, Family Package"],
      ["JOIN আর WHERE", "INNER JOIN এ শর্ত ON বা WHERE এ, একই ফল", "Dhaka র 11 Row"],
      ["JOIN আর GROUP BY", "id আর নাম দুটো দিয়ে দল", "প্রতিটা ট্যুরের আয়"],
      ["ভুল ON", "Error ছাড়া ভুল জোড়া", "booking_id = customer_id, 15 Row"],
      ["Non-equi Join", "ON এ সমান ছাড়া অন্য শর্ত", "দামের স্তর"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "INNER JOIN এর ফলাফলে কোন Row গুলো থাকে?",
        options: [
          {
            key: "A",
            text: "বাম Table এর সব Row, মিল থাকুক বা না থাকুক",
            isCorrect: false,
            explanation: "এটা LEFT JOIN এর আচরণ, পরের লেসনে। INNER JOIN মিল না পাওয়া Row রাখে না।",
          },
          {
            key: "B",
            text: "শুধু সেই জোড়াগুলো, যাদের জন্য ON এর শর্ত সত্যি",
            isCorrect: true,
            explanation: "ঠিক। প্রতিটা সত্যি জোড়া একটা Row, আর যে Row এর একটাও সত্যি জোড়া নেই সে বাদ।",
          },
          {
            key: "C",
            text: "দুই Table এর সব Row, একটার নিচে আরেকটা",
            isCorrect: false,
            explanation: "একটার নিচে আরেকটা বসানো UNION এর কাজ, Module 07 এ। JOIN পাশাপাশি বসায়।",
          },
          {
            key: "D",
            text: "সবার সাথে সবার জোড়া",
            isCorrect: false,
            explanation: "সেটা CROSS JOIN, Lesson 05 এ। INNER JOIN শর্ত দিয়ে জোড়া বাছাই করে।",
          },
        ],
      },
      {
        id: 2,
        text: "Imran Kabir এর কোনো Booking নেই। customers JOIN bookings ON ... এর ফলাফলে তিনি কীভাবে আসবেন?",
        options: [
          {
            key: "A",
            text: "একটা Row, Booking এর Column গুলো NULL",
            isCorrect: false,
            explanation: "NULL দিয়ে ভরা Row LEFT JOIN বানায়। INNER JOIN এ এমন Row তৈরি হয় না।",
          },
          {
            key: "B",
            text: "একটা Row, count 0 সহ",
            isCorrect: false,
            explanation: "0 আসতে হলে Row টা আগে থাকতে হবে। INNER JOIN এ তিনি দল তৈরির আগেই বাদ।",
          },
          {
            key: "C",
            text: "আসবেন না",
            isCorrect: true,
            explanation: "ঠিক। জোড়া নেই, তাই Row নেই, আর কোনো Error বা সতর্কবার্তাও নেই।",
          },
          {
            key: "D",
            text: "Error হবে, কারণ তাঁর Booking খুঁজে পাওয়া যায়নি",
            isCorrect: false,
            explanation: "মিল না পাওয়া Error না। Database চুপচাপ পরের Row এ চলে যায়।",
          },
        ],
      },
      {
        id: 3,
        text: "bookings এ 24টা Row, প্রতিটার customer_id একজন সত্যিকারের Customer কে দেখায়। bookings JOIN customers ON c.customer_id = b.customer_id কয়টা Row দেবে?",
        options: [
          { key: "A", text: "15", isCorrect: false, explanation: "15 হলো Customer এর সংখ্যা। কিন্তু জোড়া গোনা হয় Booking ধরে।" },
          { key: "B", text: "14", isCorrect: false, explanation: "14 জন আলাদা Customer ফলাফলে আছেন, কিন্তু Row গোনে জোড়া, মানুষ না।" },
          { key: "C", text: "24", isCorrect: true, explanation: "ঠিক। প্রতিটা Booking এর ঠিক একটা জোড়া, তাই Row এর সংখ্যা Booking এর সমান।" },
          { key: "D", text: "360", isCorrect: false, explanation: "360 হয় ON না থাকলে, সবার সাথে সবার জোড়া। এখানে শর্ত আছে।" },
        ],
      },
      {
        id: 4,
        text: "SELECT customer_id, full_name FROM bookings JOIN customers ON ... চালালে ERROR: column reference \"customer_id\" is ambiguous। কারণ কী?",
        options: [
          {
            key: "A",
            text: "customer_id দুই Table এই আছে, আর কোনটা চাই বলা হয়নি",
            isCorrect: true,
            explanation: "ঠিক। bookings.customer_id বা c.customer_id লিখে বলে দিলেই চলবে।",
          },
          {
            key: "B",
            text: "customer_id নামে কোনো Column নেই",
            isCorrect: false,
            explanation: "Column না থাকলে Error হতো does not exist। এখানে সমস্যা উল্টো, দুটো আছে।",
          },
          {
            key: "C",
            text: "JOIN এ SELECT এর Column দুই Table থেকে নেওয়া যায় না",
            isCorrect: false,
            explanation: "যায়, JOIN এর পুরো উদ্দেশ্যই সেটা। full_name customers থেকেই আসছে।",
          },
          {
            key: "D",
            text: "ON এর শর্ত ভুল",
            isCorrect: false,
            explanation: "শর্ত ঠিক থাকলেও এই Error আসবে। সমস্যা SELECT এর নামে।",
          },
        ],
      },
      {
        id: 5,
        text: "bookings NATURAL JOIN payments কেন শূন্য Row দেয়?",
        options: [
          {
            key: "A",
            text: "payments এ কোনো Row নেই",
            isCorrect: false,
            explanation: "payments এ 19টা Row আছে। ON দিয়ে জুড়লে 19টা জোড়াই আসে।",
          },
          {
            key: "B",
            text: "NATURAL JOIN booking_id আর status দুটোই মেলায়, আর দুই Table এর status এর মান কখনো এক হয় না",
            isCorrect: true,
            explanation: "ঠিক। confirmed বা pending কখনো paid বা failed এর সমান না, তাই কোনো জোড়া টেকে না।",
          },
          {
            key: "C",
            text: "NATURAL JOIN PostgreSQL এ চলে না",
            isCorrect: false,
            explanation: "চলে, Error ও দেয় না। সেটাই বিপদ, শূন্য Row চুপচাপ আসে।",
          },
          {
            key: "D",
            text: "booking_id এর মান দুই Table এ আলাদা ধরনের",
            isCorrect: false,
            explanation: "দুটোই integer, আর ON দিয়ে জুড়লে ঠিক মেলে।",
          },
        ],
      },
      {
        id: 6,
        text: "ON c.customer_id = b.customer_id এর বদলে USING (customer_id) লিখলে কী বদলায়?",
        options: [
          {
            key: "A",
            text: "কিছুই না, এমনকি Column এর সংখ্যাও না",
            isCorrect: false,
            explanation: "জোড়া একই, কিন্তু USING এ customer_id দুই দিক থেকে মিলে একটা Column হয়।",
          },
          {
            key: "B",
            text: "জোড়া একই, কিন্তু ফলাফলে customer_id একবারই থাকে, আর ডাকনাম ছাড়া লিখলেও ambiguous হয় না",
            isCorrect: true,
            explanation: "ঠিক। SELECT * এ USING এর Column সবার আগে, একবার।",
          },
          {
            key: "C",
            text: "USING মিল না পাওয়া Row ও রাখে",
            isCorrect: false,
            explanation: "না, USING শুধু শর্ত লেখার আরেকটা রূপ। JOIN এর ধরন একই থাকে।",
          },
          {
            key: "D",
            text: "USING দিয়ে BETWEEN এর মতো শর্তও লেখা যায়",
            isCorrect: false,
            explanation: "যায় না। USING শুধু একই নামের Column এর সমান শর্ত বোঝে, বাকি সব ON এ।",
          },
        ],
      },
      {
        id: 7,
        text: "INNER JOIN এ c.city = 'Dhaka' শর্তটা ON এর ভেতরে লিখলেন, আরেকবার WHERE এ। ফলাফল?",
        options: [
          {
            key: "A",
            text: "দুটো একই, 11টা Row",
            isCorrect: true,
            explanation: "ঠিক। INNER JOIN এ জোড়া না পাওয়া আর WHERE এ বাদ পড়া একই প্রভাব ফেলে। LEFT JOIN এ এটা বদলায়।",
          },
          {
            key: "B",
            text: "ON এ লিখলে 24, WHERE এ লিখলে 11",
            isCorrect: false,
            explanation: "সেই ধরনের তফাত LEFT JOIN এ হয়, INNER JOIN এ না।",
          },
          {
            key: "C",
            text: "ON এ লেখা যায় না, Error হবে",
            isCorrect: false,
            explanation: "ON এ AND দিয়ে যেকোনো শর্ত যোগ করা যায়।",
          },
          {
            key: "D",
            text: "WHERE এ লিখলে ছয়টা Row, Dhaka র মানুষের সংখ্যা",
            isCorrect: false,
            explanation: "ফলাফল গোনে জোড়া, মানুষ না। Dhaka র পাঁচজনের মোট এগারোটা Booking।",
          },
        ],
      },
      {
        id: 8,
        text: "প্রতিটা Customer এর Booking গুনতে GROUP BY c.full_name না লিখে GROUP BY c.customer_id, c.full_name কেন লেখা ভালো?",
        options: [
          {
            key: "A",
            text: "PostgreSQL শুধু নাম দিয়ে GROUP BY মানে না",
            isCorrect: false,
            explanation: "মানে। সমস্যাটা Error এর না, মানের।",
          },
          {
            key: "B",
            text: "নাম অনন্য না; একই নামের দুজনের Booking শুধু নাম ধরে দল করলে এক দলে মিশে যাবে",
            isCorrect: true,
            explanation: "ঠিক। id প্রতিটা মানুষকে আলাদা রাখে, নামটা শুধু দেখানোর জন্য।",
          },
          {
            key: "C",
            text: "এতে Query দ্রুত চলে",
            isCorrect: false,
            explanation: "গতি এখানে আসল কারণ না। কারণ হলো উত্তরের সঠিকতা।",
          },
          {
            key: "D",
            text: "id ছাড়া count(*) কাজ করে না",
            isCorrect: false,
            explanation: "count(*) যেকোনো দলে কাজ করে। প্রশ্নটা দলগুলো ঠিকমতো আলাদা হলো কিনা।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: নম্বরের জায়গায় নাম",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>Support এর ফোন তালিকা:</strong> সব pending Booking, Customer এর নাম আর ফোন নম্বর সহ, booking_id
        অনুযায়ী। কারো ফোন নম্বর না থাকলে কী দেখায়, লক্ষ করুন, আর Module 04 এর COALESCE দিয়ে সেখানে No phone
        বসান।
      </span>,
      <span key="2">
        <strong>হারানোদের খাতা:</strong> এই লেসনের চারটা হারিয়ে যাওয়া Row এর প্রতিটার জন্য দুটো Query লিখুন:
        একটা যেটা দেখায় Row টা আছে, আরেকটা INNER JOIN যেখানে সে নেই। চারটা জোড়া Query আর তাদের Row সংখ্যা।
      </span>,
      <span key="3">
        <strong>ভুল ON ধরুন:</strong> departures আর tours কে ইচ্ছা করে ভুল Column দিয়ে জুড়ুন (যেমন
        d.departure_id = t.tour_id)। কয়টা Row এল, কোন Row গুলো দেখতে ঠিক কিন্তু আসলে ভুল, আর count(*) দিয়ে কীভাবে
        ধরলেন, লিখুন।
      </span>,
      <span key="4">
        <strong>Destination এর আয়:</strong> প্রতিটা Destination এর নাম আর confirmed Booking থেকে মোট আয়, বেশি আয়
        আগে। কোন Destination তালিকায় নেই, আর কেন, দুই লাইনে লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> হাজিরা খাতা আর নামের খাতার উদাহরণ দিয়ে একজন বন্ধুকে ছয় লাইনে
        বোঝান INNER JOIN কী করে, আর কারা ফলাফল থেকে বাদ পড়ে।
      </span>,
    ],
    deliverables: [
      <span key="d1">pending Booking এর ফোন তালিকার Query আর ফলাফল</span>,
      <span key="d2">চার জোড়া Query আর তাদের Row সংখ্যা</span>,
      <span key="d3">ভুল ON এর Query, ফলাফল আর ধরার ব্যাখ্যা</span>,
      <span key="d4">Destination এর আয়ের Query আর বাদ পড়া Destination এর ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ INNER JOIN",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "প্রথম জোড়া",
        description:
          "প্রথম ফাইলের দুটো Query চালান: JOIN ছাড়া নম্বর, JOIN সহ নাম। Row এর সংখ্যা মিলিয়ে নিন।",
      },
      {
        title: "দুই দিক থেকে গোনা",
        description:
          "দ্বিতীয় ফাইলে একই JOIN দুই দিক থেকে। দুটোতেই 24 আসবে। তারপর ambiguous Error টা নিজে একবার দেখে নিন।",
      },
      {
        title: "হারিয়ে যাওয়া চারজন",
        description:
          "তৃতীয় ফাইলের প্রতিটা জোড়া Query তে আগে মোট, তারপর JOIN এর পরের সংখ্যা। কে হারাল, নাম ধরে খুঁজে বের করুন।",
      },
      {
        title: "NATURAL JOIN এর ফাঁদ",
        description:
          "চতুর্থ ফাইলে NATURAL JOIN আর ON পাশাপাশি। 0 আর 19 কেন, \\d bookings আর \\d payments দেখে নিজে ব্যাখ্যা করুন।",
      },
      {
        title: "নাম ধরে হিসাব",
        description:
          "পঞ্চম ফাইলে প্রতিটা Customer এর Booking আর প্রতিটা ট্যুরের আয়। সারির সংখ্যা মন্তব্যের সাথে মেলান।",
      },
      {
        title: "Admin Panel এর তালিকা",
        description:
          "ষষ্ঠ ফাইলে চার Table এর JOIN। শুরুতে TimeZone Dhaka বসানো আছে, যাতে তারিখগুলো এই লেসনের মতো আসে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-first-join.sql",
        code: `SELECT booking_id, customer_id, seats, status
FROM bookings
ORDER BY booking_id;
-- (24 rows), নামের জায়গায় নম্বর

SELECT b.booking_id, c.full_name, b.seats, b.status
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
ORDER BY b.booking_id;
-- (24 rows), প্রথম Row: 1 | Rahim Uddin | 2 | confirmed`,
      },
      {
        language: "sql",
        filename: "02-both-sides.sql",
        code: `SELECT count(*) FROM bookings b JOIN customers c ON c.customer_id = b.customer_id;
-- 24

SELECT count(*) FROM customers c JOIN bookings b ON b.customer_id = c.customer_id;
-- 24

SELECT customer_id, full_name
FROM bookings JOIN customers ON customers.customer_id = bookings.customer_id;
-- ERROR:  column reference "customer_id" is ambiguous`,
      },
      {
        language: "sql",
        filename: "03-vanishing.sql",
        code: `SELECT count(*) FROM customers;                                         -- 15
SELECT count(DISTINCT c.customer_id)
FROM customers c JOIN bookings b ON b.customer_id = c.customer_id;      -- 14, Imran নেই

SELECT count(*) FROM destinations;                                      -- 7
SELECT count(DISTINCT d.destination_id)
FROM destinations d JOIN tours t ON t.destination_id = d.destination_id; -- 6, Kuakata নেই

SELECT count(*) FROM tours;                                             -- 9
SELECT count(*) FROM tours t JOIN guides g ON g.guide_id = t.guide_id;  -- 8, Ratargul নেই
SELECT count(DISTINCT t.tour_id)
FROM tours t JOIN departures d ON d.tour_id = t.tour_id;                -- 8, Family Package নেই`,
      },
      {
        language: "sql",
        filename: "04-natural-trap.sql",
        code: `SELECT count(*) FROM bookings NATURAL JOIN payments;
-- 0, booking_id আর status দুটোই মেলাতে চায়

SELECT count(*) FROM bookings b JOIN payments p ON p.booking_id = b.booking_id;
-- 19

SELECT count(*) FROM bookings JOIN payments USING (booking_id);
-- 19`,
      },
      {
        language: "sql",
        filename: "05-group-by-name.sql",
        code: `SELECT c.full_name, count(*) AS bookings, sum(b.seats) AS seats
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id, c.full_name
ORDER BY bookings DESC, c.full_name;
-- (14 rows), প্রথম Row: Rahim Uddin | 3 | 6

SELECT t.title, sum(b.total_bdt) AS revenue
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t      ON t.tour_id = d.tour_id
WHERE b.status = 'confirmed'
GROUP BY t.tour_id, t.title
ORDER BY revenue DESC;
-- (7 rows), প্রথম Row: Saint Martin Island Escape | 125000.00`,
      },
      {
        language: "sql",
        filename: "06-admin-list.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

SELECT b.booking_id, c.full_name, t.title, d.starts_on, b.seats, b.status
FROM bookings b
JOIN customers  c ON c.customer_id  = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours      t ON t.tour_id      = d.tour_id
WHERE d.starts_on >= DATE '2026-11-01'
ORDER BY d.starts_on, b.booking_id;
-- (12 rows), প্রথম Row: 20 | Priya Sharma | Sylhet Tea Garden Tour | 2026-11-14 | 2 | pending`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা JOIN চালানোর আগে মুখে বলুন কয়টা Row আসা উচিত, আর কে বাদ পড়বে। চালানোর পর মিলিয়ে নিন। এই ছোট
        অভ্যাসটাই ভুল ON আর হারিয়ে যাওয়া Row ধরার সবচেয়ে দ্রুত উপায়।
      </ContentParagraph>
    ),
  },
};
