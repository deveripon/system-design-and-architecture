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
  CleanupStepsLab,
  RegexTesterLab,
} from "../../../components/course/topics/functions/regex-animations";
import {
  LikeVsRegexSplit,
  ModuleFourStoryDiagram,
  RegexAnatomyDiagram,
  RegexFunctionsDiagram,
} from "../../../components/course/topics/functions/regex-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em]";

const MESSY_PHONES = `FROM (VALUES
  (1, '01000-000101'),
  (2, '+880 1000 000102'),
  (3, '880-1000-000103'),
  (4, '(010) 0000 0104'),
  (5, '1000000105'),
  (6, '01000 00010'),
  (7, 'call 01000-000107')
) AS raw(id, typed)`;

export const regularExpressionsContent: TopicData = {
  id: "regular-expressions",
  introduction: {
    badge: "MODULE 04 · LESSON 06",
    title: <SectionTitle>যখন LIKE আর কুলায় না: Regular Expression</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Island Tours এর Support Desk এ রুমানা একটা পুরনো Excel ফাইল পেলেন। আগের বছরের
          মেলায় হাতে লেখা ফর্ম থেকে কেউ নাম আর ফোন নম্বর তুলেছিলেন। একই রকম নম্বর সেখানে
          সাত রকম চেহারায়: কেউ লিখেছেন 01000-000101, কেউ +880 1000 000102, কেউ বন্ধনী
          দিয়ে (010) 0000 0104, আর একজন নম্বরের আগে লিখে রেখেছেন call। Marketing চায় এই
          ফাইলটা Database এ তুলে সবাইকে একটা SMS পাঠাতে। কিন্তু SMS এর Gateway শুধু এক
          চেহারার নম্বর নেয়: +880 আর তারপর দশটা অঙ্ক।
        </ContentParagraph>
        <ContentParagraph>
          আগের লেসনগুলোর হাতিয়ার দিয়ে চেষ্টা করে দেখুন। LIKE জানে শুধু দুটো চিহ্ন, % আর
          _। সে বলতে পারে না যেকোনো অঙ্ক, বা ঠিক এগারোটা অঙ্ক, বা শুরুতে 880 অথবা 0।
          replace() একবারে একটা নির্দিষ্ট চিহ্ন বদলায়, তাই Dash, Space, বন্ধনী আর +
          মুছতে একটার ভেতরে একটা করে চারবার লিখতে হয়, তবু call শব্দটা থেকে যায়। এই
          লেসনে আপনি একটা নতুন ভাষা শিখবেন, যার নাম Regular Expression, সংক্ষেপে Regex।
          এটা দিয়ে লেখার আকার বর্ণনা করা যায়: কোন ধরনের চিহ্ন, কতগুলো, কোথায়।
        </ContentParagraph>
        <ContentParagraph>
          শেষে আপনি PostgreSQL এর চারটা Regex Operator আর সাতটা Function চিনবেন, একটা
          Pattern টুকরো টুকরো করে পড়তে পারবেন, এলোমেলো ফোন নম্বর এক চেহারায় আনতে পারবেন,
          আর জানবেন কোথায় Regex বিপদ ডেকে আনে। সাথে থাকবে এই মডিউলের শেষ হিসাব, যেখানে ছয়
          লেসনের সব Function মিলে একটা আসল Report বানাবে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "LIKE হলো ঠিকানা মিলিয়ে চিঠি খোঁজা। Regex হলো ডাকপিয়নকে অনুরোধ করা: এমন সব চিঠি আনুন যার খামে কোথাও চার অঙ্কের একটা Post Code লেখা আছে, ঠিকানা যাই হোক।",
      author: "Regular Expression",
      role: "Lesson 06",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>লেখার আকার বর্ণনা করার একটা ভাষা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ধরুন আপনি কাউকে ফোনে বলছেন কোন নম্বরগুলো খুঁজতে হবে। আপনি বলবেন না
                01000000101, কারণ আপনি একটা নির্দিষ্ট নম্বর চান না। আপনি বলবেন: শুরুতে শূন্য,
                তারপর এক, তারপর আরও নয়টা অঙ্ক, মাঝে আর কিছু না। এই কথাটাই একটা Regular
                Expression। নির্দিষ্ট একটা মান না, মানের একটা আকার, একটা ছাঁচ।
              </ContentParagraph>
              <ContentParagraph>
                Regular Expression কে ছোট করে Regex বলা হয়। এটা SQL এর নিজের আবিষ্কার না।
                ১৯৫০ এর দশকে আমেরিকান গণিতবিদ Stephen Cole Kleene এই ধারণার গাণিতিক রূপ দেন।
                পরে এটা Unix এর লেখা ঘাঁটার Tool গুলোর মাধ্যমে সবার হাতে আসে, যেমন grep, আর আজ
                প্রায় সব Programming Language এ আছে: JavaScript, Python, Java, আর আপনার Code
                Editor এর Find বক্সেও। তাই এখানে যা শিখবেন, তার বেশিরভাগ
                অন্য জায়গাতেও কাজে লাগবে। শুধু কিছু ছোট নিয়ম জায়গাভেদে আলাদা, সেগুলো আলাদা
                করে দেখানো হবে।
              </ContentParagraph>
              <ContentParagraph>
                Database এ Regex তিন ধরনের কাজে লাগে, আর এই লেসন সেই তিনটা ধরেই সাজানো:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>খোঁজা:</strong> কোন Row গুলোর লেখা একটা আকারের সাথে মেলে, WHERE এ।
                  যেমন যেসব মন্তব্যে নৌকা বা জাহাজের কথা আছে।
                </ListItem>
                <ListItem>
                  <strong>তুলে আনা:</strong> লম্বা লেখার ভেতর থেকে একটা অংশ বের করা। যেমন
                  Email থেকে @ এর আগের নামটা।
                </ListItem>
                <ListItem>
                  <strong>বদলানো:</strong> আকার মিলে যাওয়া অংশ অন্য কিছু দিয়ে বদলে দেওয়া।
                  যেমন ফোন নম্বর থেকে অঙ্ক ছাড়া সব মুছে ফেলা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা সতর্কবাণী দিয়ে শুরু করা ভালো। Regex খুব শক্তিশালী, আর সেই কারণেই সহজে
                পড়া যায় না। একটা লম্বা Pattern ছয় মাস পরে আপনি নিজেও বুঝবেন না। তাই এই লেসনের
                নিয়ম: যতটুকু দরকার ততটুকু, ছোট ছোট Pattern, আর প্রতিটা Pattern আগে কয়েকটা
                নমুনার উপর পরীক্ষা করে তারপর আসল Table এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের তিনটা শব্দ",
          content: (
            <ContentList>
              <ListItem>
                <strong>Pattern:</strong> Regex এ লেখা আকারটা, যেমন{" "}
                <code className={CODE}>^01\d{"{9}"}$</code>।
              </ListItem>
              <ListItem>
                <strong>Match:</strong> লেখার যে অংশটা Pattern এর সাথে মিলে গেল। একটা লেখায়
                কয়েকটা Match থাকতে পারে।
              </ListItem>
              <ListItem>
                <strong>Flag:</strong> Pattern এর আচরণ বদলানোর একটা ছোট অক্ষর। যেমন i দিলে বড়
                আর ছোট হাতের অক্ষরের পার্থক্য আর ধরা হয় না, আর g দিলে প্রথমটা না, সবগুলো মিল ধরা
                হয়।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "beyond-like",
      subHeader: { index: "002", title: "Beyond LIKE" },
      title: <SectionTitle>LIKE পুরো লেখা ঢাকে, Regex একটা মিল খোঁজে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Module 03 এর{" "}
                <Link href="/sql/topic/in-between-like" className={LINK}>
                  IN, BETWEEN, LIKE
                </Link>{" "}
                লেসনে আপনি দেখেছেন LIKE এর Pattern কে পুরো লেখাটা ঢাকতে হয়। শুধু Saint
                লিখলে Saint Martin Island Escape মেলে না, লাগে Saint%। Regex এর নিয়ম ঠিক
                উল্টো। Regex জানতে চায় লেখার ভেতরে কোথাও Pattern টা আছে কিনা। থাকলেই মেলে।
              </ContentParagraph>
              <ContentParagraph>
                এই একটা পার্থক্য থেকেই নতুনদের সবচেয়ে বেশি ভুল হয়। LIKE এ অভ্যস্ত হাত Regex
                লিখতে গিয়ে ভাবে Pattern পুরো লেখা মেলাচ্ছে, আসলে সে শুধু একটা টুকরো খুঁজছে।
                পুরো লেখা মেলাতে চাইলে Regex কে স্পষ্ট করে বলতে হয়, শুরুতে ^ আর শেষে $ দিয়ে।
                সেটা পঞ্চম অংশে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LikeVsRegexSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই শব্দ, দুই নিয়ম"
              query={`SELECT title FROM tours WHERE title LIKE 'Saint';

SELECT title FROM tours WHERE title ~ 'Saint';`}
              caption="প্রথম Query শূন্য Row দেয়, কারণ কোনো Title পুরোপুরি Saint না। দ্বিতীয়টা দুটো Row দেয়, Saint Martin Island Escape আর Saint Martin Luxury Stay, কারণ দুটোর ভেতরেই Saint আছে। ~ চিহ্নটার মানে Regex এর সাথে মেলে, সেটা পরের অংশে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "LIKE", "Regex"],
          rows: [
            ["কতটুকু মিলতে হবে", "পুরো লেখা", "লেখার যেকোনো একটা অংশ"],
            ["যেকোনো একটা অক্ষর", "_", "."],
            ["যত খুশি অক্ষর", "%", ".*"],
            ["নির্দিষ্ট কয়েকটা অক্ষরের একটা", "পারে না", "[abc]"],
            ["যেকোনো অঙ্ক", "পারে না", "\\d"],
            ["ঠিক কতবার", "পারে না", "{3}, {2,5}, +, ?"],
            ["এটা অথবা ওটা", "পারে না, দুটো LIKE আর OR লাগে", "(Tour|Trip)"],
            ["শুরু আর শেষ", "Pattern এর গঠন থেকেই", "^ আর $ নিজে লিখতে হয়"],
            ["নিরাপদ আর দ্রুত", "বেশি", "কম, পরে দেখবেন কেন"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কখন কোনটা",
          content: (
            <ContentParagraph>
              নিয়মটা সহজ। যা LIKE দিয়ে লেখা যায়, LIKE দিয়েই লিখুন: পড়তে সহজ, ভুল কম,
              আর Index এর সাহায্য পাওয়ার সম্ভাবনা বেশি। Regex নিন তখনই, যখন আকারটা LIKE এর
              দুই চিহ্ন দিয়ে বলা যায় না: অঙ্ক, সংখ্যা, এটা অথবা ওটা, বা কোনো অংশ তুলে আনা আর
              বদলানো।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "operators",
      subHeader: { index: "003", title: "The Four Operators" },
      title: <SectionTitle>~, ~*, !~ আর !~*</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                PostgreSQL এ Regex দিয়ে মেলানোর জন্য চারটা Operator আছে। দেখতে অদ্ভুত, কিন্তু
                মনে রাখার একটা সহজ কৌশল আছে: ঢেউয়ের মতো চিহ্নটা, ~, মানে মোটামুটি মেলে। তার
                সাথে * যোগ করলে বড় ছোট অক্ষর আর আলাদা ধরা হয় না। সামনে ! বসালে মানে উল্টো,
                মেলে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Operator", "মানে", "বড় ছোট অক্ষর"],
          rows: [
            [<code key="a" className={CODE}>~</code>, "Pattern এর সাথে মেলে", "আলাদা ধরে"],
            [<code key="b" className={CODE}>~*</code>, "Pattern এর সাথে মেলে", "আলাদা ধরে না"],
            [<code key="c" className={CODE}>!~</code>, "Pattern এর সাথে মেলে না", "আলাদা ধরে"],
            [<code key="d" className={CODE}>!~*</code>, "Pattern এর সাথে মেলে না", "আলাদা ধরে না"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চার Operator এর তিনটা"
              query={`SELECT title FROM tours WHERE title ~ 'bazar';

SELECT title FROM tours WHERE title ~* 'bazar';

SELECT count(*) FROM tours WHERE title !~ 'Saint';`}
              caption="প্রথমটা শূন্য, কারণ Title এ আছে বড় হাতের B দিয়ে Bazar। দ্বিতীয়টা দুটো Cox's Bazar ট্যুর আনে, কারণ ~* বড় ছোট অক্ষর এক ধরে। তৃতীয়টা বলে ৭, নয়টা ট্যুরের মধ্যে যে সাতটার নামে Saint নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এই চারটা Operator একটা true বা false দেয়, ঠিক = বা LIKE এর মতো। তাই এদের
                জায়গা মূলত WHERE এ। কিন্তু SELECT এর তালিকাতেও বসানো যায়, তখন প্রতিটা Row এর
                পাশে একটা true বা false Column আসে। Pattern পরীক্ষা করার সময় এটা খুব কাজের:
                কোন Row মিলল আর কোনটা মিলল না, দুটোই একসাথে চোখে পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                একটা কথা মনে রাখবেন। NULL এর সাথে Regex মেলানোর ফল NULL, ঠিক অন্য সব তুলনার
                মতো। তাই phone !~ &apos;^\+880&apos; লিখলে যাঁদের ফোন নম্বরই নেই, তাঁরা দুই দিক থেকেই
                বাদ পড়বেন। Module 03 এর{" "}
                <Link href="/sql/topic/null-logic" className={LINK}>
                  NULL লেসনের
                </Link>{" "}
                নিয়ম এখানেও খাটে, আর সমাধানও একই: OR phone IS NULL।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RegexTesterLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "classes",
      subHeader: { index: "004", title: "Characters and Classes" },
      title: <SectionTitle>একটা অক্ষর, কয়েকটার একটা, বা এক ধরনের</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Regex এর সবচেয়ে ছোট টুকরো হলো একটা অক্ষর। Saint Pattern এর মানে S, তারপর a,
                তারপর i, n, t, এই ক্রমে পাশাপাশি। এগুলো সাধারণ অক্ষর, নিজেকেই বোঝায়। কিন্তু
                কয়েকটা চিহ্নের বিশেষ মানে আছে। প্রথম তিনটা শিখে নিন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>.</code> একটা বিন্দু মানে যেকোনো একটা অক্ষর। T..r
                  মেলে Tour এর সাথে, কারণ মাঝে দুটো যেকোনো অক্ষর। Tr এর সাথে মেলে না, মাঝে
                  কিছু নেই।
                </ListItem>
                <ListItem>
                  <code className={CODE}>[AEIOU]</code> তৃতীয় বন্ধনী মানে ভেতরের যেকোনো একটা
                  অক্ষর, ঠিক একটা। [0-9] মানে 0 থেকে 9 এর যেকোনো একটা, [a-z] মানে যেকোনো একটা
                  ছোট হাতের ইংরেজি অক্ষর।
                </ListItem>
                <ListItem>
                  <code className={CODE}>[^S]</code> বন্ধনীর একদম শুরুতে ^ দিলে মানে উল্টে যায়:
                  S ছাড়া যেকোনো একটা অক্ষর। [^0-9] মানে অঙ্ক নয় এমন যেকোনো একটা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                কিছু অক্ষরের দল এত বেশি লাগে যে তাদের জন্য ছোট নাম আছে। এগুলো শুরু হয় \ দিয়ে,
                যাকে Backslash বলে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লিখবেন", "মানে", "উল্টোটা"],
          rows: [
            [<code key="a" className={CODE}>\d</code>, "যেকোনো একটা অঙ্ক, [0-9] এর মতো", <code key="a2" className={CODE}>\D</code>],
            [<code key="b" className={CODE}>\s</code>, "যেকোনো একটা ফাঁকা জায়গা: Space, Tab, নতুন লাইন", <code key="b2" className={CODE}>\S</code>],
            [<code key="c" className={CODE}>\w</code>, "শব্দের একটা অক্ষর: অক্ষর, অঙ্ক বা _", <code key="c2" className={CODE}>\W</code>],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বন্ধনী আর উল্টো বন্ধনী"
              query={`SELECT full_name FROM customers
WHERE full_name ~ '^[AEIOU]'
ORDER BY customer_id;

SELECT title FROM tours
WHERE title ~ '^[^S]'
ORDER BY tour_id;

SELECT 'Tour' ~ '^T..r$' AS dots, 'Tr' ~ '^T..r$' AS too_short;`}
              caption="প্রথমটা চারজন: Arif, Aiman, Oliver আর Imran, যাঁদের নাম স্বরবর্ণ দিয়ে শুরু। দ্বিতীয়টা চারটা ট্যুর যাদের নাম S দিয়ে শুরু না: দুটো Cox's Bazar, Bandarban আর Ratargul। ^ চিহ্নটা এখানে দুই জায়গায় দুই মানে: বন্ধনীর বাইরে লেখার শুরু, বন্ধনীর ভেতরে উল্টো। তৃতীয়টা দেখায় বিন্দু ঠিক একটা অক্ষর, তাই Tour মেলে, Tr মেলে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "এক ^, দুই মানে",
          content: (
            <ContentParagraph>
              ^ চিহ্নটা Regex এ দুটো একদম আলাদা কাজ করে। বন্ধনীর বাইরে, Pattern এর শুরুতে, ^
              মানে লেখার একদম শুরু। তৃতীয় বন্ধনীর ভেতরে প্রথম অক্ষর হিসেবে ^ মানে এগুলো
              ছাড়া। ^[AEIOU] বলে স্বরবর্ণ দিয়ে শুরু, আর [^AEIOU] বলে স্বরবর্ণ না এমন একটা
              অক্ষর, লেখার যেকোনো জায়গায়। এক চিহ্ন, অবস্থান দেখে মানে বুঝতে হয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "quantifiers",
      subHeader: { index: "005", title: "How Many" },
      title: <SectionTitle>কতবার: *, +, ? আর বাঁকা বন্ধনী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এতক্ষণ প্রতিটা টুকরো মানে ছিল ঠিক একটা অক্ষর। \d মানে একটা অঙ্ক, এগারো অঙ্কের
                নম্বর বোঝাতে তো এগারোবার \d লেখা যায় না। এখানে আসে Quantifier, যে বলে আগের
                টুকরোটা কতবার আসবে। Quantifier সবসময় ঠিক তার আগের টুকরোর উপর খাটে, পুরো
                Pattern এর উপর না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লিখবেন", "মানে", "উদাহরণ"],
          rows: [
            ["*", "শূন্য বা তার বেশি বার", "Tou*r মেলে Tor, Tour, Touur"],
            ["+", "এক বা তার বেশি বার", "\\d+ মানে অন্তত একটা অঙ্ক"],
            ["?", "শূন্য বা একবার, মানে থাকতেও পারে", "Tou?r মেলে Tor আর Tour"],
            ["{n}", "ঠিক n বার", "\\d{11} মানে ঠিক এগারোটা অঙ্ক"],
            ["{n,m}", "n থেকে m বার", "\\d{3,5} মানে তিন থেকে পাঁচটা অঙ্ক"],
            ["{n,}", "অন্তত n বার", "\\d{4,} মানে চারটা বা তার বেশি"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চারটা নম্বর, দুটো প্রশ্ন"
              query={`SELECT s,
       s ~ '^\\d{11}$' AS eleven_digits,
       s ~ '^01\\d+$'  AS starts_01
FROM (VALUES ('01000000101'),
             ('0100000010'),
             ('+8801000000101'),
             ('01000-000101')) AS t(s);`}
              caption="এখানে কোনো Table না, চারটা নমুনা লেখা। (VALUES ...) AS t(s) একটা ছোট অস্থায়ী Table বানায়, যার একটাই Column, নাম s। Pattern পরীক্ষার জন্য এটা সবচেয়ে ভালো জায়গা। ফল: শুধু প্রথমটা ঠিক এগারো অঙ্কের। প্রথম দুটো 01 দিয়ে শুরু আর তারপর শুধু অঙ্ক। শেষ দুটো কোনোটাই না, একটায় + আছে, আরেকটায় Dash।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ওপরের Query তে একটা নতুন জিনিস ইচ্ছা করে রাখা আছে। Database এর Table এ না
                গিয়ে কয়েকটা নমুনা লেখা হাতে বানিয়ে তার উপর Pattern চালানো। এই লেসনে এটা বারবার
                দেখবেন, কারণ Regex লেখার সবচেয়ে নিরাপদ অভ্যাস এটাই: আগে এমন কয়েকটা লেখা ঠিক
                করুন যেগুলো মিলতেই হবে, আর কয়েকটা যেগুলো কিছুতেই মিলবে না। Pattern তখনই ঠিক,
                যখন দুই দলই ঠিক ফল দেয়।
              </ContentParagraph>
              <ContentParagraph>
                * আর + এর একটা স্বভাব জেনে রাখুন। এরা লোভী, ইংরেজিতে Greedy: যতটা সম্ভব লম্বা
                অংশ নিয়ে নেয়। S.*e লিখলে Saint Martin Island Escape এ মিলটা প্রথম S থেকে শেষ e
                পর্যন্ত পুরো লেখা ধরে, মাঝের কোনো e তে থামে না। শুধু হ্যাঁ বা না জানতে চাইলে এতে
                কিছু আসে যায় না, কিন্তু অংশ তুলে আনার সময় এটা অবাক করতে পারে। দশম অংশে
                দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "anchors",
      subHeader: { index: "006", title: "Anchors" },
      title: <SectionTitle>^ আর $: শুরু আর শেষে বেঁধে দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                দ্বিতীয় অংশে দেখেছেন Regex নিজে থেকে লেখার যেকোনো জায়গায় মিল খোঁজে। নৌকাকে
                ঘাটে বাঁধতে যেমন নোঙর লাগে, Pattern কে লেখার শুরু বা শেষে বাঁধতে লাগে Anchor।
                Regex এ দুটো Anchor: ^ মানে লেখার একদম শুরু, $ মানে লেখার একদম শেষ। এরা কোনো
                অক্ষর মেলায় না, শুধু একটা অবস্থান বোঝায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>example</code> লেখার যেকোনো জায়গায় example।
                </ListItem>
                <ListItem>
                  <code className={CODE}>^example</code> লেখা শুরুই হবে example দিয়ে।
                </ListItem>
                <ListItem>
                  <code className={CODE}>example$</code> লেখা শেষ হবে example দিয়ে।
                </ListItem>
                <ListItem>
                  <code className={CODE}>^\d{"{11}"}$</code> শুরু থেকে শেষ পর্যন্ত পুরো লেখা ঠিক
                  এগারোটা অঙ্ক, আর কিছু না। দুই Anchor একসাথে দিলে Regex পুরো লেখা মেলায়, ঠিক
                  LIKE এর মতো।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Anchor ছাড়া আর Anchor সহ"
              query={`SELECT count(*) AS anywhere FROM customers WHERE email ~ 'example';

SELECT count(*) AS at_start FROM customers WHERE email ~ '^example';

SELECT count(*) AS at_end FROM customers WHERE email ~ 'example$';

SELECT full_name FROM customers
WHERE full_name ~ 'an$'
ORDER BY customer_id;`}
              caption="পনেরোটা Email এর সবগুলোতে example আছে, সবগুলো example দিয়ে শেষ, কিন্তু একটাও example দিয়ে শুরু না, তাই ১৫, ০ আর ১৫। শেষ Query টা তিনজনকে আনে যাঁদের নাম an দিয়ে শেষ: Nusrat Jahan, Mitu Rahman আর Kamal Hasan।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RegexAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  যেসব ট্যুরের নাম S দিয়ে শুরু আর Tour অথবা Trip দিয়ে শেষ, তাদের{" "}
                  <code className={CODE}>title</code> দেখান। একটাই Regex লিখুন, কোনো LIKE বা OR
                  ছাড়া। গোলাকার বন্ধনী আর | এর কাজ পরের অংশে বিস্তারিত, তবে এখনই চেষ্টা করে
                  দেখতে পারেন।
                </>
              }
              hint={
                <>
                  শুরুতে <code className={CODE}>^S</code>, মাঝে যেকোনো কিছু{" "}
                  <code className={CODE}>.*</code>, শেষে দুটোর একটা{" "}
                  <code className={CODE}>(Tour|Trip)$</code>।
                </>
              }
              solution={`SELECT title
FROM tours
WHERE title ~ '^S.*(Tour|Trip)$';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "groups",
      subHeader: { index: "007", title: "Groups, Alternation, Word Edges" },
      title: <SectionTitle>দল বাঁধা, এটা অথবা ওটা, আর পুরো শব্দ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                | চিহ্নটা মানে অথবা। Beach|Island মেলে যেখানে Beach আছে, অথবা Island আছে।
                গোলাকার বন্ধনী কয়েকটা টুকরোকে এক দলে বাঁধে। দল বাঁধার দুটো কারণ। প্রথমত,
                অথবা কতদূর পর্যন্ত খাটবে সেটা ঠিক করা: ^S.*(Tour|Trip)$ এ বন্ধনী না থাকলে মানে
                দাঁড়াত ^S.*Tour অথবা Trip$, যা একদম অন্য প্রশ্ন। দ্বিতীয়ত, পুরো দলের উপর
                Quantifier বসানো: (ab)+ মানে ab, abab, ababab।
              </ContentParagraph>
              <ContentParagraph>
                বন্ধনীর তৃতীয় একটা কাজও আছে, যেটা দশম আর একাদশ অংশে কাজে লাগবে: বন্ধনীর ভেতরে
                যা মেলে, Database সেটা আলাদা করে মনে রাখে। একে Capture বলে। পরে সেই অংশটা তুলে
                আনা যায়, বা বদলানোর সময় আবার বসানো যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এটা অথবা ওটা"
              query={`SELECT title FROM tours
WHERE title ~ '(Beach|Island)'
ORDER BY tour_id;`}
              caption="দুটো ট্যুর: Saint Martin Island Escape আর Cox's Bazar Beach Weekend। একই প্রশ্ন LIKE দিয়ে লিখতে দুটো LIKE আর একটা OR লাগত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার একটা ঝামেলা। মন্তব্যে tea শব্দ খুঁজতে গেলে tea লিখলেই হবে না, কারণ
                Regex লেখার যেকোনো জায়গায় মেলায়, তাই Steam আর teacher এর ভেতরের tea ও ধরা পড়বে।
                দরকার পুরো শব্দ। এর জন্য PostgreSQL এ তিনটা বিশেষ চিহ্ন আছে: \m মানে শব্দের
                শুরু, \M মানে শব্দের শেষ, আর \y মানে শব্দের শুরু বা শেষ যেকোনোটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরো শব্দ খোঁজা, আর \b এর ফাঁদ"
              query={`SELECT s,
       s ~* 'tea'        AS anywhere,
       s ~* '\\mtea\\M'    AS whole_word,
       s ~* '\\btea\\b'    AS with_b
FROM (VALUES ('Tea Garden'), ('Steam boat'), ('teacher')) AS t(s);`}
              caption="anywhere তিনটাতেই true, কারণ তিনটার ভেতরেই tea আছে। whole_word শুধু Tea Garden এ true। আর with_b তিনটাতেই false, এমনকি Tea Garden এও। কারণটা নিচের সতর্কবাণীতে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "PostgreSQL এ \\b মানে শব্দের সীমা না",
          content: (
            <ContentParagraph>
              JavaScript, Python বা MySQL থেকে আসা Developer রা শব্দের সীমার জন্য \b লেখেন।
              PostgreSQL এর Regex এ \b মানে একদম অন্য জিনিস: Backspace নামের একটা অদৃশ্য
              Control অক্ষর, যেটা সাধারণ লেখায় কখনো থাকে না। তাই \btea\b কোনো Error দেয় না,
              চুপচাপ সবসময় false দেয়। PostgreSQL এ পুরো শব্দের জন্য লিখুন \m আর \M, অথবা \y।
              PostgreSQL এর অফিসিয়াল Docs এর Regular Expression Escapes এর Table এ এটা লেখা
              আছে, আর ওপরের বক্সে নিজের চোখে দেখলেন।
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
                  যেসব Review এর মন্তব্যে boat অথবা ship শব্দটা আছে, বড় ছোট অক্ষর যাই হোক, তাদের{" "}
                  <code className={CODE}>review_id</code> আর{" "}
                  <code className={CODE}>comment</code> দেখান।
                </>
              }
              hint={
                <>
                  বড় ছোট অক্ষর না মানতে <code className={CODE}>~*</code>। দুটো শব্দের একটা:{" "}
                  <code className={CODE}>(boat|ship)</code>।
                </>
              }
              solution={`SELECT review_id, comment
FROM reviews
WHERE comment ~* '(boat|ship)';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "escaping",
      subHeader: { index: "008", title: "Escaping" },
      title: <SectionTitle>বিশেষ চিহ্নকে সাধারণ বানানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এতক্ষণে আপনি অনেকগুলো বিশেষ চিহ্ন দেখেছেন: . * + ? ^ $ | ( ) [ ] {"{ }"} আর \।
                সমস্যা হলো, আসল Data তেও এই চিহ্নগুলো থাকে। Email এ বিন্দু, ফোন নম্বরে + আর
                বন্ধনী। Pattern এ বিন্দু লিখলে Regex সেটাকে যেকোনো অক্ষর ধরে, আসল বিন্দু না। তাই
                mail.example Pattern টা mailXexample এর সাথেও মেলে।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান হলো চিহ্নের আগে একটা \ বসানো। \ জানিয়ে দেয় যে পরের চিহ্নটার বিশেষ মানে এখানে
                খাটবে না, চিহ্নটা শুধু নিজেকে বোঝাবে। \. মানে আসল বিন্দু, \+ মানে আসল +, \( মানে আসল বন্ধনী।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ঢিলেঢালা বিন্দু আর আসল বিন্দু"
              query={`SELECT s,
       s ~ 'mail.example'  AS loose,
       s ~ 'mail\\.example' AS exact
FROM (VALUES ('rahim.uddin@mail.example'),
             ('rahim.uddin@mailXexample')) AS t(s);

SELECT '+880' ~ '^+880' AS bad;`}
              caption="প্রথম Query তে loose দুটোতেই true, কারণ বিন্দু যেকোনো অক্ষর, X ও। exact শুধু আসল Email এ true। দ্বিতীয় Query ইচ্ছা করে ভাঙা: ^ এর পরে + বসালে + কে কাজ করার মতো কিছু থাকে না, তাই PostgreSQL থামে invalid regular expression: quantifier operand invalid দিয়ে। ঠিক লেখা হলো '^\\+880'।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Backslash একবারই",
          content: (
            <ContentParagraph>
              PostgreSQL এ সাধারণ Single Quote এর লেখার ভেতরে \ এর কোনো বিশেষ মানে নেই, এটা এখনকার
              PostgreSQL এর Default। তাই &apos;\d&apos; লিখলে Regex হাতে পায় ঠিক \d, যেমনটা চান। পুরনো
              কিছু ব্লগে E&apos;\\d&apos; এর মতো দুটো Backslash দেখবেন, সেটা E দিয়ে শুরু হওয়া বিশেষ
              লেখার নিয়ম, সাধারণ কাজে লাগে না। MySQL এ নিয়ম আলাদা, সেখানে দুটো লিখতে হয়।
              ত্রয়োদশ অংশে দেখবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "regex-functions",
      subHeader: { index: "009", title: "regexp_like and regexp_count" },
      title: <SectionTitle>Operator থেকে Function এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Operator শুধু বলে মেলে কিনা। অনেক সময় আরও কিছু জানতে হয়: কতবার মেলে, কোথায়
                মেলে, মেলা অংশটা কী, বা মেলা অংশটা বদলে কী দাঁড়ায়। এর জন্য PostgreSQL এর
                Regex Function গুলো। তাদের কয়েকটা PostgreSQL 15 এ যোগ হয়েছে, অন্য Database থেকে
                আসা লোকদের সুবিধার জন্য: regexp_like, regexp_count, regexp_instr আর
                regexp_substr। আপনার PostgreSQL 18 এ সবগুলোই আছে।
              </ContentParagraph>
              <ContentParagraph>
                সব Function এর প্রথম দুটো জিনিস একই: কোন লেখায় খুঁজবেন, আর কোন Pattern। অনেকের
                শেষে একটা Flag দেওয়া যায়, যেমন &apos;i&apos; দিলে বড় আর ছোট হাতের অক্ষর একই ধরা হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RegexFunctionsDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মেলে কিনা, আর কতবার"
              query={`SELECT title,
       regexp_like(title, 'bazar', 'i') AS mentions_bazar,
       regexp_count(title, 'a')         AS a_count,
       regexp_count(title, '\\S+')       AS words
FROM tours
ORDER BY tour_id;`}
              caption="regexp_like ঠিক ~* এর মতো true বা false দেয়, শুধু Flag টা লেখা যায় শব্দে। regexp_count গোনে Pattern কতবার মেলে: ছোট হাতের a কয়টা, আর \S+ কয়টা, মানে ফাঁকা জায়গা দিয়ে আলাদা কয়টা টুকরো, অর্থাৎ শব্দ। Ratargul Swamp Boat Day এ a আছে পাঁচটা, আর প্রায় সব ট্যুরের নাম চার শব্দের।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  যেসব ট্যুরের নাম ঠিক তিন শব্দের, তাদের <code className={CODE}>title</code>{" "}
                  দেখান। শব্দ মানে ফাঁকা জায়গা দিয়ে আলাদা করা টুকরো।
                </>
              }
              hint={
                <>
                  <code className={CODE}>regexp_count(title, &apos;\S+&apos;)</code> শব্দ গোনে।
                  WHERE এ সেটা 3 এর সমান কিনা দেখুন।
                </>
              }
              solution={`SELECT title
FROM tours
WHERE regexp_count(title, '\\S+') = 3;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "pulling-pieces",
      subHeader: { index: "010", title: "Pulling Pieces Out" },
      title: <SectionTitle>লেখার ভেতর থেকে অংশ তুলে আনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Lesson 01 এ আপনি split_part দিয়ে Email কে @ এ কেটে দুই ভাগ করেছিলেন। কাটার
                চিহ্ন যখন একটাই আর জানা, split_part ই সবচেয়ে সহজ। কিন্তু যখন অংশটা চেনা যায়
                তার আকার দেখে, কোনো নির্দিষ্ট কাটার চিহ্ন দিয়ে না, তখন Regex লাগে। তিনটা
                Function এখানে কাজের:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>regexp_substr(লেখা, Pattern):</strong> প্রথম যে অংশটা মেলে, সেটা একটা
                  লেখা হিসেবে। না মিললে NULL।
                </ListItem>
                <ListItem>
                  <strong>regexp_match(লেখা, Pattern):</strong> Pattern এর প্রতিটা গোলাকার
                  বন্ধনীতে যা মিলেছে, সব একসাথে একটা Array তে, মানে একটা তালিকায়। তালিকা থেকে
                  একটা নিতে চাইলে পেছনে [1], [2] লিখে সংখ্যা দিন। না মিললে NULL।
                </ListItem>
                <ListItem>
                  <strong>regexp_matches(লেখা, Pattern, &apos;g&apos;):</strong> প্রতিটা মিল
                  আলাদা একটা Row তে। এটা Row এর সংখ্যা বদলে দেয়, তাই সাবধানে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Email থেকে নাম আর পদবি"
              query={`SELECT email,
       regexp_substr(email, '^[^@]+') AS user_part,
       (regexp_match(email, '^([^.]+)\\.([^@]+)@'))[1] AS first_name,
       (regexp_match(email, '^([^.]+)\\.([^@]+)@'))[2] AS last_name
FROM customers
ORDER BY customer_id
LIMIT 4;

SELECT regexp_match('rahim.uddin@mail.example', '^([^.]+)\\.([^@]+)@') AS whole_array;

SELECT regexp_match('no at sign here', '^([^.]+)\\.([^@]+)@') AS no_match;`}
              caption="^[^@]+ মানে শুরু থেকে @ ছাড়া যত অক্ষর, তাই rahim.uddin। দ্বিতীয় Pattern এ দুটো বন্ধনী: প্রথমটা বিন্দুর আগের অংশ, দ্বিতীয়টা বিন্দু থেকে @ পর্যন্ত। regexp_match পুরো তালিকা দেয়, {rahim,uddin}, আর [1] বা [2] দিয়ে একটা বেছে নেওয়া যায়। Function কে বন্ধনীতে মুড়ে তারপর [1] লিখতে হয়, এটা PostgreSQL এর লেখার নিয়ম। শেষ Query তে Pattern মেলেনি, তাই NULL।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা লেখা থেকে অনেকগুলো Row"
              query={`SELECT regexp_split_to_table('Sajek Valley Cloud Trip', '\\s+') AS word;

SELECT regexp_matches('Crystal clear water and a very caring guide.',
                      '\\m[cg]\\w*', 'g') AS word;`}
              caption="regexp_split_to_table লেখাটাকে Pattern এর জায়গায় কাটে, প্রতিটা টুকরো একটা Row: চারটা শব্দ, চারটা Row। regexp_matches এর g Flag প্রতিটা মিল আলাদা Row তে দেয়: c বা g দিয়ে শুরু ছোট হাতের তিনটা শব্দ, clear, caring আর guide। Crystal আসেনি, কারণ তার C বড় হাতের।"
            />
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
                  ঢাকার Customer দের <code className={CODE}>customer_id</code> আর Email এর @ এর
                  আগের অংশটা <code className={CODE}>username</code> নামে দেখান,{" "}
                  <code className={CODE}>customer_id</code> অনুযায়ী সাজিয়ে। একটা Regex Function
                  দিয়ে লিখুন।
                </>
              }
              hint={
                <>
                  শুরু থেকে @ ছাড়া যত অক্ষর: <code className={CODE}>^[^@]+</code>। Function টা{" "}
                  <code className={CODE}>regexp_substr</code>, আর শহরের শর্ত WHERE এ।
                </>
              }
              solution={`SELECT customer_id, regexp_substr(email, '^[^@]+') AS username
FROM customers
WHERE city = 'Dhaka'
ORDER BY customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "replace",
      subHeader: { index: "011", title: "regexp_replace" },
      title: <SectionTitle>মেলা অংশ বদলে দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Regex এর সবচেয়ে বেশি ব্যবহার সম্ভবত এটা: regexp_replace(লেখা, Pattern, নতুন
                লেখা, Flag)। Pattern যেখানে মেলে, সেখানে নতুন লেখা বসায়। Lesson 01 এর replace()
                বদলায় একটা নির্দিষ্ট লেখা, regexp_replace বদলায় একটা আকার। তাই একবারেই সব
                Dash, Space আর বন্ধনী মোছা যায়, কারণ এদের সবার আকার একই: অঙ্ক না, \D।
              </ContentParagraph>
              <ContentParagraph>
                এখানে সবচেয়ে বড় ফাঁদটা g Flag। g না দিলে regexp_replace শুধু প্রথম মিলটা বদলায়,
                তারপর থেমে যায়। ফোন নম্বর থেকে অঙ্ক ছাড়া সব মুছতে গিয়ে g ভুলে গেলে শুধু প্রথম
                + টা যায়, বাকি সব থেকে যায়, আর কোনো Error আসে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="g Flag থাকলে আর না থাকলে"
              query={`SELECT s,
       regexp_replace(s, '\\D', '')      AS first_only,
       regexp_replace(s, '\\D', '', 'g') AS every_one
FROM (VALUES ('+880 1000-000101'), ('(010) 0000 0104')) AS t(s);

SELECT phone,
       regexp_replace(phone, '\\D', '', 'g') AS digits,
       regexp_replace(phone, '^\\+880', '0') AS local
FROM guides
ORDER BY guide_id;`}
              caption="প্রথম Query তে first_only থেকে শুধু প্রথম অ-অঙ্ক চিহ্নটা গেছে, + বা (। every_one থেকে সব গেছে। দ্বিতীয় Query তে পাঁচজন Guide এর নম্বর থেকে + মুছে শুধু অঙ্ক, আর শুরুর +880 কে 0 দিয়ে বদলে দেশের ভেতরের চেহারা: 01000000201।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                সপ্তম অংশে বলেছিলাম গোলাকার বন্ধনী যা মেলায় তা মনে রাখে। regexp_replace এর নতুন
                লেখায় \1 লিখলে প্রথম বন্ধনীর মিলটা ফিরে আসে, \2 লিখলে দ্বিতীয়টা। একে
                Backreference বলে। এটা দিয়ে লেখার টুকরো ওলটপালট করা যায়, বা একটা অংশ রেখে বাকিটা
                ঢেকে দেওয়া যায়। Customer এর Email কাউকে দেখাতে হলে পুরোটা না দেখিয়ে শুধু প্রথম
                অক্ষর রাখা একটা চেনা কৌশল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Backreference: রেখে দেওয়া আর ঢেকে দেওয়া"
              query={`SELECT email,
       regexp_replace(email, '^(.)[^@]*', '\\1***') AS masked
FROM customers
ORDER BY customer_id
LIMIT 3;

SELECT regexp_replace('Saint Martin Island Escape', '(\\w+) (\\w+)', '\\2 \\1') AS swapped;

SELECT regexp_replace('Too   much    walking', '\\s+', ' ', 'g') AS squeezed;`}
              caption="প্রথমটায় (.) প্রথম অক্ষরটা ধরে রাখে, [^@]* @ পর্যন্ত বাকিটা মেলায়, আর \\1*** প্রথম অক্ষরটা ফিরিয়ে এনে বাকিটা তিনটা তারা দিয়ে ঢাকে: r***@mail.example। দ্বিতীয়টায় প্রথম দুটো শব্দ জায়গা বদলায়: Martin Saint Island Escape। তৃতীয়টায় একাধিক Space কে একটা Space বানানো, ধোয়ামোছার খুব চেনা কাজ।"
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
                  প্রত্যেক Guide এর <code className={CODE}>full_name</code> আর তাঁর ফোন নম্বর থেকে
                  অঙ্ক ছাড়া সব মুছে <code className={CODE}>digits</code> নামে দেখান,{" "}
                  <code className={CODE}>guide_id</code> অনুযায়ী সাজিয়ে।
                </>
              }
              hint={
                <>
                  অঙ্ক নয় এমন সব: <code className={CODE}>\D</code>। সবগুলো বদলাতে চতুর্থ জায়গায়{" "}
                  <code className={CODE}>&apos;g&apos;</code> দিতে ভুলবেন না।
                </>
              }
              solution={`SELECT full_name, regexp_replace(phone, '\\D', '', 'g') AS digits
FROM guides
ORDER BY guide_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "cleanup",
      subHeader: { index: "012", title: "Real Cleanup Tasks" },
      title: <SectionTitle>রুমানার ফাইল: এলোমেলো নম্বর থেকে এক চেহারা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার লেসনের শুরুর সমস্যায় ফিরি। রুমানার ফাইলে সাতটা নম্বর, সাত চেহারায়। কাজটা
                তিন ধাপে ভাঙুন, আর প্রতিটা ধাপ নিজে একটা ছোট Regex:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ধাপ ১, ধোয়া:</strong> অঙ্ক ছাড়া সব মুছে ফেলা,{" "}
                  <code className={CODE}>regexp_replace(typed, &apos;\D&apos;, &apos;&apos;, &apos;g&apos;)</code>।
                </ListItem>
                <ListItem>
                  <strong>ধাপ ২, যাচাই:</strong> যা রইল সেটা বাংলাদেশের মোবাইল নম্বরের আকারে কিনা,{" "}
                  <code className={CODE}>^(880|0)1\d{"{9}"}$</code>। না মিললে থামুন।
                </ListItem>
                <ListItem>
                  <strong>ধাপ ৩, এক চেহারা:</strong> শেষের দশটা অঙ্কের আগে +880,{" "}
                  <code className={CODE}>&apos;+880&apos; || right(digits, 10)</code>।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ধাপ দুই সবচেয়ে জরুরি, আর এটাই সবাই বাদ দেয়। 1000000105 নম্বরটার শেষ দশ অঙ্কের
                আগে +880 বসালে একটা দেখতে সুন্দর নম্বর বের হয়, কিন্তু সেটা আসলে কার নম্বর কেউ
                জানে না। ভুল নম্বর সুন্দর করে লিখলেও ভুলই থাকে, আর সেখানে SMS গেলে অচেনা কারো ফোনে
                যায়। আকার না মিললে নম্বরটা আলাদা করে রাখুন, কাউকে দিয়ে হাতে যাচাই করান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CleanupStepsLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম দুই ধাপ, সব নম্বরে একসাথে"
              query={`SELECT typed,
       regexp_replace(typed, '\\D', '', 'g') AS digits,
       regexp_replace(typed, '\\D', '', 'g') ~ '^(880|0)1\\d{9}$' AS valid
FROM (VALUES ('01000-000101'),
             ('+880 1000 000102'),
             ('1000000105'),
             ('01000 00010'),
             ('call 01000-000107')) AS raw(typed);`}
              caption="পাঁচটা নম্বরের তিনটা valid। 1000000105 এর শুরুতে 0 বা 880 নেই, আর 01000 00010 এ অঙ্ক একটা কম। call 01000-000107 থেকে call শব্দটাও \\D এর সাথে চলে গেছে, কারণ অক্ষরগুলোও অঙ্ক না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ফোন নম্বরের মতো Email এর আকারও আংশিক যাচাই করা যায়। কিন্তু এখানে বিনয়ী হওয়া
                দরকার। সত্যিকারের সব বৈধ Email ঠিকঠাক ধরার মতো Regex এত লম্বা যে কেউ পড়তে পারে
                না। কাজের নিয়ম হলো ঢিলেঢালা একটা যাচাই: @ এর আগে কিছু আছে, @ একটাই, পরে একটা
                বিন্দুসহ Domain, আর কোথাও ফাঁকা জায়গা নেই। Email টা আসলে কাজ করে কিনা, সেটা
                জানার একমাত্র উপায় সেখানে একটা যাচাই Email পাঠানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Email এর ঢিলেঢালা যাচাই"
              query={`SELECT email,
       email ~ '^[^@\\s]+@[^@\\s]+\\.[a-z]+$' AS looks_ok
FROM (VALUES ('rahim.uddin@mail.example'),
             ('rahim.uddin@mail'),
             ('rahim uddin@mail.example'),
             ('@mail.example'),
             ('a@b@mail.example')) AS t(email);`}
              caption="শুধু প্রথমটা পার পায়। দ্বিতীয়টায় Domain এ বিন্দু নেই, তৃতীয়টায় নামে Space, চতুর্থটায় @ এর আগে কিছু নেই, পঞ্চমটায় দুটো @। [^@\\s] মানে @ না আর ফাঁকা জায়গা না এমন অক্ষর, বন্ধনীর ভেতরে \\s ও কাজ করে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                <strong>গতির কথা।</strong> এই ছোট Sample Database এ সব Query চোখের পলকে চলে।
                কিন্তু লাখ Row এর Table এ WHERE email ~ &apos;something&apos; চালালে PostgreSQL কে সাধারণত
                প্রতিটা Row খুলে Pattern মেলাতে হয়। সাধারণ Index, যেটা Module 13 এ শিখবেন, বেশিরভাগ
                Regex এ সাহায্য করে না, কারণ Regex লেখার মাঝখানেও মিল খোঁজে। এর জন্য PostgreSQL এর pg_trgm নামের
                একটা Extension আছে, যার বিশেষ Index ~ আর ~* এর খোঁজকেও দ্রুত করতে পারে। সেটা
                Module 15 এ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>নিরাপত্তার কথা।</strong> কখনো ব্যবহারকারীর লেখা Pattern সরাসরি Regex হিসেবে
                চালাবেন না। PostgreSQL এর Docs নিজেই সতর্ক করে যে এমন Regex বানানো যায়, যেটা
                শেষ হতে অনেক সময় আর Memory খায়। Search Box এর জন্য LIKE বা ILIKE নিরাপদ, কারণ
                তাদের ভাষা অনেক সরল। আর Search এর জন্য আসল ব্যবস্থা Full-text Search, সেটাও
                Module 15 এ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>SIMILAR TO এর কথা।</strong> PostgreSQL এ তৃতীয় একটা Pattern এর ভাষা আছে,
                SIMILAR TO, যেটা SQL Standard এর অংশ: LIKE এর মতো পুরো লেখা মেলায় আর % আর _ বোঝে,
                সাথে Regex এর | আর বন্ধনীও বোঝে। এটা দুই জগতের একটা অদ্ভুত মিশেল, আর নতুন কাজে এর
                দরকার পড়ে না। চিনে রাখুন, যাতে পুরনো Code এ দেখলে অবাক না হন, কিন্তু নিজে লিখুন
                LIKE অথবা Regex।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              orderMatters
              starter={`SELECT id, typed
${MESSY_PHONES}
ORDER BY id;`}
              task={
                <>
                  বক্সে রুমানার সাতটা নম্বর একটা অস্থায়ী Table এ দেওয়া আছে। শুধু বৈধ নম্বরগুলো
                  রাখুন, আর প্রতিটার <code className={CODE}>id</code> আর এক চেহারার নম্বর{" "}
                  <code className={CODE}>phone</code> নামে দেখান, যেমন +8801000000101।{" "}
                  <code className={CODE}>id</code> অনুযায়ী সাজান। বৈধ মানে অঙ্কগুলো 880 বা 0
                  দিয়ে শুরু, তারপর 1, তারপর ঠিক নয়টা অঙ্ক।
                </>
              }
              hint={
                <>
                  একই Expression দুই জায়গায় লাগবে:{" "}
                  <code className={CODE}>regexp_replace(typed, &apos;\D&apos;, &apos;&apos;, &apos;g&apos;)</code>।
                  SELECT এ তার ডান দিকের দশ অঙ্কের আগে +880, আর WHERE এ সেটা{" "}
                  <code className={CODE}>^(880|0)1\d{"{9}"}$</code> এর সাথে মেলে কিনা।
                </>
              }
              solution={`SELECT id, '+880' || right(regexp_replace(typed, '\\D', '', 'g'), 10) AS phone
${MESSY_PHONES}
WHERE regexp_replace(typed, '\\D', '', 'g') ~ '^(880|0)1\\d{9}$'
ORDER BY id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ Regex: একই ধারণা, আলাদা লেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এখনকার MySQL Regex এর জন্য ICU নামের একটা Library ব্যবহার করে, MySQL এর নিজের Docs
                এ সেটা লেখা আছে। ধারণাগুলো
                একই: বন্ধনী, Quantifier, Anchor, \d। কিন্তু লেখার নিয়মে কয়েকটা পার্থক্য আছে, আর
                তার দুটো চুপচাপ ভুল ফল দেয়। নিচের প্রতিটা কথা MySQL 8.4.11 এ island-tours.mysql.sql
                Load করে চালিয়ে দেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "PostgreSQL", "MySQL 8.4"],
          rows: [
            ["মেলে কিনা", "title ~ 'Bazar'", "title REGEXP 'Bazar' বা RLIKE"],
            ["মেলে না", "title !~ 'Saint'", "title NOT REGEXP 'Saint'"],
            ["বড় ছোট অক্ষর", "~ আলাদা ধরে, ~* ধরে না", "Collation এর উপর, Default এ আলাদা ধরে না"],
            ["Function", "regexp_like(title, 'x', 'i')", "REGEXP_LIKE(title, 'x', 'i'), 'c' দিলে আলাদা ধরে"],
            ["গোনা", "regexp_count", "নেই"],
            ["তুলে আনা", "regexp_substr, regexp_match", "REGEXP_SUBSTR"],
            ["বদলানো", "regexp_replace, সবগুলোর জন্য 'g'", "REGEXP_REPLACE, Default এই সবগুলো বদলায়"],
            ["Backreference", "\\1", "$1"],
            ["শব্দের সীমা", "\\m, \\M, \\y", "\\b"],
            ["লেখার ভেতরে Backslash", "একটা: '\\d'", "দুটো: '\\\\d'"],
            ["কেটে Row বানানো", "regexp_split_to_table", "নেই"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-regex.sql",
          code: `-- MySQL 8.4, island_tours (MySQL version)
SELECT title FROM tours WHERE title REGEXP 'bazar';
-- 2 rows: default collation ignores case

SELECT title FROM tours WHERE REGEXP_LIKE(title, 'bazar', 'c');
-- Empty set: 'c' makes it case-sensitive

SELECT 'abd' REGEXP '\\d' AS single_backslash;
-- 1 (!) MySQL turns '\\d' into 'd' before the regex sees it, and 'abd' has a d

SELECT 'abc' REGEXP '\\\\d' AS double_backslash;
-- 0, correct: '\\\\d' reaches the regex as \\d

SELECT REGEXP_REPLACE('+880 1000-000101', '[^0-9]', '') AS digits;
-- 8801000000101: every match replaced, no 'g' needed

SELECT REGEXP_REPLACE('rahim.uddin@mail.example', '^(.)[^@]*', '$1***') AS masked;
-- r***@mail.example ('\\\\1' would give 1***@mail.example)

SELECT REGEXP_COUNT('a a a', 'a');
-- ERROR 1305 (42000): FUNCTION island_tours.REGEXP_COUNT does not exist`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সবচেয়ে বিপজ্জনক পার্থক্য",
          content: (
            <ContentParagraph>
              MySQL এর লেখার ভেতরে \ একটা বিশেষ চিহ্ন। &apos;\d&apos; লিখলে MySQL লেখা পড়ার সময়েই \
              ফেলে দেয়, আর Regex হাতে পায় শুধু d। ফল: &apos;\d&apos; মানে অঙ্ক না, মানে d অক্ষর, আর কোনো
              Error ছাড়াই ভুল Row আসে। MySQL এ সবসময় দুটো লিখুন, &apos;\\d&apos;। PostgreSQL থেকে Query
              কপি করে MySQL এ নিলে প্রথম যাচাই এটাই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Support Desk: যেভাবেই লেখা হোক, নম্বর দিয়ে Customer খোঁজা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Island Tours এর Database এ ফোন নম্বর রাখা আছে এক চেহারায়, +8801000000108 এর মতো।
                কিন্তু ফোনে একজন Customer নিজের নম্বর বলেন নিজের মতো করে: 0100 0000 108।
                Support Desk এর মানুষটা হুবহু সেটাই টাইপ করেন। = দিয়ে খুঁজলে কিছুই আসবে না, কারণ
                দুটো লেখা আলাদা। LIKE দিয়েও না, কারণ মাঝে Space আছে।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান হলো দুই দিককেই একই চেহারায় আনা, তারপর তুলনা করা। দুই দিক থেকে অঙ্ক ছাড়া
                সব মুছুন, তারপর শুধু শেষের দশটা অঙ্ক মেলান। শুরুটা কেউ 0 লেখেন, কেউ 880, কেউ
                +880, কিন্তু শেষের দশটা সবসময় একই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Customer যেভাবে বললেন, সেভাবেই খুঁজুন"
              query={`SELECT full_name, phone
FROM customers
WHERE right(regexp_replace(phone, '\\D', '', 'g'), 10)
    = right(regexp_replace('0100 0000 108', '\\D', '', 'g'), 10);`}
              caption="একজনই মেলেন: Sumaiya Islam, +8801000000108। '0100 0000 108' এর জায়গায় '+880 1000-000108' বা '880 10000 00108' লিখে দেখুন, ফল একই থাকবে। যাঁদের phone NULL, regexp_replace তাঁদের জন্য NULL দেয়, তাই তাঁরা কখনো ভুল করে মেলেন না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                বাস্তবের Island Tours এ এই কাজটা আরেকটু ভালোভাবে করা হয়। প্রতিবার খোঁজার সময় সব
                Customer এর নম্বর ধোয়ার বদলে নম্বরটা ঢোকানোর সময়েই এক চেহারায় এনে রাখা হয়।
                তাহলে খোঁজা হয় সরাসরি =, আর সেখানে সাধারণ Index ও কাজ করে। নতুন Data ঢোকানোর সময়
                Regex দিয়ে ধোয়া, আর পুরনো এলোমেলো Data একবার ধুয়ে ঠিক করা, এটা Module 10 এর
                UPDATE এর কাজ। Regex এর আসল জায়গা তাই প্রায়ই দুটো: Data ঢোকার দরজায়, আর পুরনো
                Data পরিষ্কারের একবারের কাজে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Regex নিরাপদে লেখার সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "আগে নিজেকে জিজ্ঞেস করুন, LIKE দিয়ে হয় কিনা",
              description:
                "শুরু, শেষ বা ভেতরের একটা নির্দিষ্ট লেখা খুঁজলে LIKE বা ILIKE ই যথেষ্ট, পড়তে সহজ আর নিরাপদ। অঙ্ক, সংখ্যা, এটা অথবা ওটা, বা কোনো অংশ তুলে আনা আর বদলানো লাগলে তবেই Regex।",
            },
            {
              title: "মিলতেই হবে আর মিলবে না, দুই দলের নমুনা লিখুন",
              description:
                "তিন চারটা লেখা যেগুলো অবশ্যই মিলবে, আর তিন চারটা যেগুলো কিছুতেই মিলবে না। আসল Data থেকে নিন, আর অদ্ভুতগুলোও রাখুন: ফাঁকা লেখা, অতিরিক্ত Space, NULL।",
            },
            {
              title: "ছোট Pattern দিয়ে শুরু করুন",
              description:
                "একবারে পুরোটা না লিখে প্রথমে মূল টুকরোটা লিখুন, যেমন \\d{11}। তারপর একটা একটা করে যোগ করুন: Anchor, বন্ধনী, বিকল্প।",
            },
            {
              title: "(VALUES ...) এর উপর পরীক্ষা করুন",
              description:
                "SELECT s, s ~ 'pattern' FROM (VALUES (...), (...)) AS t(s)। প্রতিটা নমুনার পাশে true বা false দেখে মেলান আপনার দুই দলের সাথে।",
            },
            {
              title: "শুরু আর শেষ বেঁধে দিন, যদি পুরো লেখা মেলাতে চান",
              description:
                "Regex নিজে থেকে যেকোনো জায়গায় মেলায়। পুরো মানটা যাচাই করতে চাইলে ^ আর $ ভুলবেন না, নইলে 01000000101abc ও পার পেয়ে যাবে।",
            },
            {
              title: "আসল Table এ, প্রথমে শুধু দেখার জন্য",
              description:
                "WHERE এ বসানোর আগে SELECT এর তালিকায় true বা false Column হিসেবে চালান, কোন Row মিলছে নিজের চোখে দেখুন। বদলানোর কাজ হলে আগে regexp_replace এর ফল SELECT এ দেখুন, তারপর UPDATE।",
            },
            {
              title: "পাশে একটা মন্তব্য লিখে রাখুন",
              description:
                "Pattern এর পাশে এক লাইনে লিখুন এটা কী মেলায়, যেমন -- BD mobile: 880 or 0, then 1 and 9 digits। ছয় মাস পরের আপনি এর জন্য কৃতজ্ঞ থাকবেন।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যেসব ভুল সবাই একবার করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "ঠিক লেখা"],
          rows: [
            ["LIKE এর মতো ভাবা, Anchor ভুলে যাওয়া", "লেখার একটা অংশ মিললেই true", "^ আর $ দিয়ে বেঁধে দিন"],
            ["বিন্দু Escape না করা", "mail.example মেলে mailXexample এর সাথেও", "mail\\.example"],
            ["regexp_replace এ g ভুলে যাওয়া", "শুধু প্রথম মিলটা বদলায়, Error ছাড়া", "চতুর্থ জায়গায় 'g'"],
            ["PostgreSQL এ \\b লেখা", "চুপচাপ সবসময় false", "\\m ... \\M বা \\y"],
            ["~ দিয়ে বড় ছোট অক্ষর না মানার আশা", "bazar মেলে না Bazar এর সাথে", "~* বা 'i' Flag"],
            ["^ এর পরে + বা *", "invalid regular expression Error", "\\+ বা \\*"],
            ["MySQL এ একটা Backslash", "'\\d' হয়ে যায় 'd', ভুল Row আসে", "'\\\\d'"],
            ["আকার না মিললেও নম্বর বদলে দেওয়া", "দেখতে সুন্দর, আসলে ভুল নম্বর", "আগে যাচাই, না মিললে আলাদা রাখুন"],
            ["ব্যবহারকারীর লেখা Pattern চালানো", "ধীর বা ভারী Query এর ঝুঁকি", "Search এ LIKE বা Full-text Search"],
            ["একটা বিশাল Pattern এ সব যাচাই", "কেউ পড়তে পারে না, ভুল লুকিয়ে থাকে", "ছোট কয়েকটা Pattern, পাশে মন্তব্য"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও গভীরে যেতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Pattern Matching</strong>, PostgreSQL এর অফিসিয়াল Docs। LIKE, SIMILAR TO
                আর POSIX Regex, সব Function এর পুরো বিবরণ, Flag এর Table, আর \m, \M, \y এর
                Escape Table। Regex এর বিপদ নিয়ে সতর্কবাণীটাও এখানে।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/functions-matching.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/functions-matching.html
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL 15 এর Release Notes</strong>, যেখানে regexp_count, regexp_instr,
                regexp_like আর regexp_substr যোগ হওয়ার কথা লেখা।{" "}
                <a
                  href="https://www.postgresql.org/docs/release/15.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/release/15.0
                </a>
              </ListItem>
              <ListItem>
                <strong>pg_trgm</strong>, যে Extension ~ আর ~* এর খোঁজকেও Index দিয়ে দ্রুত করতে
                পারে। Module 15 এ বিস্তারিত।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/pgtrgm.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/pgtrgm.html
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL 8.4 এর Regular Expressions</strong>, REGEXP, REGEXP_LIKE,
                REGEXP_REPLACE, REGEXP_SUBSTR আর ICU এর নিয়ম।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/regexp.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  dev.mysql.com/doc/refman/8.4/en/regexp.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Regular expression</strong>, Wikipedia। এই ধারণার ইতিহাস আর বিভিন্ন Tool এ
                এর রূপ, একবার চোখ বুলিয়ে নেওয়ার মতো।{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Regular_expression"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  en.wikipedia.org/wiki/Regular_expression
                </a>
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 18 */
    {
      id: "module-recap",
      subHeader: { index: "018", title: "Module 04 Recap" },
      title: <SectionTitle>লেসনের শেষ, মডিউলের শেষ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রুমানার ফাইল এখন তিন ধাপের কাজ: ধোয়া, যাচাই, এক চেহারা। আর আপনার হাতে একটা নতুন
                ভাষা, যেটা দিয়ে লেখার আকার বলা যায়। এই লেসনের মূল কথাগুলো:
              </ContentParagraph>
              <ContentList>
                <ListItem>Regex লেখার যেকোনো জায়গায় মেলায়। পুরো লেখার জন্য ^ আর $।</ListItem>
                <ListItem>~ আর ~* মেলে কিনা, !~ আর !~* মেলে না কিনা। * মানে বড় ছোট অক্ষর এক।</ListItem>
                <ListItem>
                  . একটা যেকোনো অক্ষর, [ ] কয়েকটার একটা, \d \s \w চেনা দল। * + ? {"{n}"} বলে কতবার।
                </ListItem>
                <ListItem>
                  ( ) দল বাঁধে আর মনে রাখে, | মানে অথবা। PostgreSQL এ পুরো শব্দের জন্য \m \M, \b না।
                </ListItem>
                <ListItem>
                  regexp_substr আর regexp_match তুলে আনে, regexp_replace বদলায়, সবগুলোর জন্য g।
                </ListItem>
                <ListItem>
                  আগে নমুনায় পরীক্ষা, আকার না মিললে বদলাবেন না, আর ব্যবহারকারীর লেখা Pattern কখনো না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এর সাথেই Module 04 শেষ। ছয় লেসনে আপনি শিখলেন Row এর ভেতরের প্রতিটা মানকে কীভাবে
                গড়ে নিতে হয়। নিচের ছবি আর Table এ পুরো মডিউল এক নজরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ModuleFourStoryDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেসন", "মূল প্রশ্ন", "হাতিয়ার"],
          rows: [
            [
              <Link key="l1" href="/sql/topic/string-functions" className={LINK}>
                01 String Functions
              </Link>,
              "লেখা ধোয়া, কাটা আর জোড়া",
              "upper, trim, concat_ws, split_part, format",
            ],
            [
              <Link key="l2" href="/sql/topic/numeric-functions" className={LINK}>
                02 Numbers
              </Link>,
              "টাকার হিসাব ঠিক রাখা",
              "round, ceil, floor, numeric, ৫/২ এর ফাঁদ",
            ],
            [
              <Link key="l3" href="/sql/topic/date-time-functions" className={LINK}>
                03 Dates and Time Zones
              </Link>,
              "সময় আর অঞ্চল না গুলিয়ে ফেলা",
              "date_trunc, extract, interval, AT TIME ZONE",
            ],
            [
              <Link key="l4" href="/sql/topic/type-casting" className={LINK}>
                04 Casting
              </Link>,
              "এক Type থেকে আরেক Type",
              "CAST, ::, to_char, to_date",
            ],
            [
              <Link key="l5" href="/sql/topic/null-functions" className={LINK}>
                05 NULL Functions
              </Link>,
              "খালি ঘরের বদলে কিছু",
              "COALESCE, NULLIF, GREATEST, LEAST",
            ],
            [
              <Link key="l6" href="/sql/topic/regular-expressions" className={LINK}>
                06 Regular Expressions
              </Link>,
              "জটিল আকার খোঁজা আর বদলানো",
              "~, regexp_substr, regexp_replace",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সব একসাথে। নিচের Report টা Island Tours এর বাংলাদেশি Customer দের একটা তালিকা,
              যেটা একজন Manager কে দেখানো যায়। প্রতিটা Column একটা করে লেসনের হাতিয়ার: পদবি
              বড় হাতে আর নামের আগে (String), দেশের ভেতরের চেহারার ফোন বা no phone (Regex আর
              COALESCE), ঢেকে রাখা Email (Regex এর Backreference), যোগ দেওয়ার তারিখ মানুষের মতো
              করে (Date), আর 1 November 2026 পর্যন্ত কতদিন আর মোটামুটি কত মাস (Cast আর Number)।
              চালান, তারপর প্রতিটা Column কোন লেসনের, নিজে মিলিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Module 04 এর সব Function, একটা Report এ"
              query={`SELECT customer_id,
       upper(split_part(full_name, ' ', 2)) || ', ' || split_part(full_name, ' ', 1) AS sort_name,
       coalesce(regexp_replace(phone, '^\\+880', '0'), 'no phone')  AS local_phone,
       regexp_replace(email, '^(.)[^@]*', '\\1***')                  AS masked_email,
       to_char(joined_at, 'DD Mon YYYY')                            AS joined,
       DATE '2026-11-01' - joined_at::date                          AS days_as_member,
       round((DATE '2026-11-01' - joined_at::date) / 30.0, 1)       AS months_approx
FROM customers
WHERE country = 'Bangladesh'
  AND email ~ '^[a-z]+\\.[a-z]+@'
ORDER BY customer_id;`}
              caption="বারোজন বাংলাদেশি Customer। Tanvir Ahmed আর Mitu Rahman এর ফোন নেই, তাই no phone। Rahim Uddin সবচেয়ে পুরনো, 1 November 2026 পর্যন্ত ৩৬৪ দিন, প্রায় ১২.১ মাস। joined_at একটা timestamptz, তাই ::date ঢাকার সময় ধরে তারিখ বের করে, কারণ এই বক্সের সময় অঞ্চল Asia/Dhaka। / 30.0 লেখার কারণ Lesson 02 এর ভাগের ফাঁদ: / 30 লিখলে দশমিক হারিয়ে যেত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                <strong>নিজেকে যাচাই করুন।</strong> এই ছয়টা প্রশ্নের উত্তর কাউকে মুখে বোঝাতে
                পারলে Module 04 আপনার হয়ে গেছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>char_length আর octet_length একটা বাংলা শব্দে কেন আলাদা সংখ্যা দেয়?</ListItem>
                <ListItem>5 / 2 কেন 2, আর ঠিক উত্তর পাওয়ার তিনটা উপায় কী?</ListItem>
                <ListItem>
                  timestamptz এ একটা মুহূর্ত রাখা থাকে, তাহলে ঢাকা আর লন্ডনে একই Row আলাদা সময় কেন
                  দেখায়?
                </ListItem>
                <ListItem>WHERE এ একটা Column কে Cast করলে কোন জিনিসটা হারানোর ভয় থাকে?</ListItem>
                <ListItem>COALESCE আর NULLIF এর পার্থক্য এক লাইনে কী?</ListItem>
                <ListItem>
                  PostgreSQL এর Regex এ \b লিখলে কী হয়, আর MySQL এ &apos;\d&apos; লিখলে কী হয়?
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এতদিন প্রতিটা Query প্রতিটা Row আলাদা করে দেখেছে, আর প্রতিটা Row এর জন্য একটা
                উত্তর দিয়েছে। কিন্তু Manager এর সবচেয়ে বেশি প্রশ্ন আসলে অনেক Row মিলিয়ে একটা
                উত্তর চায়: মোট কত টাকা এল, প্রতিটা ট্যুরে কতগুলো Booking, কোন মাসে সবচেয়ে বেশি
                বিক্রি। পরের মডিউল ঠিক এটা নিয়ে:{" "}
                <Link href="/sql/topic/aggregation-grouping-overview" className={LINK}>
                  Module 05, Aggregation &amp; Grouping
                </Link>
                । সেখানে COUNT, SUM, AVG আর GROUP BY দিয়ে হাজার Row থেকে একটা উত্তর বের করবেন।
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
      ["Regex", "লেখার আকার বর্ণনা করার একটা ভাষা", "^(880|0)1\\d{9}$"],
      ["LIKE বনাম Regex", "LIKE পুরো লেখা ঢাকে, Regex একটা অংশ খোঁজে", "LIKE 'Saint' ০, ~ 'Saint' ২"],
      ["~ আর ~*", "মেলে কিনা, * দিলে বড় ছোট অক্ষর এক", "~* 'bazar', ২ Row"],
      ["!~ আর !~*", "মেলে না কিনা", "!~ 'Saint', ৭"],
      [". [ ] [^ ]", "যেকোনো একটা, কয়েকটার একটা, এগুলো ছাড়া", "^[AEIOU], ৪ জন"],
      ["\\d \\s \\w", "অঙ্ক, ফাঁকা জায়গা, শব্দের অক্ষর", "\\D মানে অঙ্ক না"],
      ["* + ? {n}", "আগের টুকরো কতবার", "\\d{11} মানে ঠিক এগারোটা অঙ্ক"],
      ["^ আর $", "শুরু আর শেষে বাঁধা", "~ 'an$', ৩ জন"],
      ["( ) আর |", "দল বাঁধা আর অথবা", "(Tour|Trip)$"],
      ["\\m \\M \\y", "PostgreSQL এ পুরো শব্দ, \\b না", "~* '\\mtea\\M'"],
      ["regexp_count", "কতবার মেলে", "\\S+ দিয়ে শব্দ গোনা"],
      ["regexp_substr, regexp_match", "মেলা অংশ বা বন্ধনীর টুকরো তুলে আনা", "(regexp_match(...))[2]"],
      ["regexp_replace", "বদলানো, সবগুলোর জন্য g, ফেরত আনতে \\1", "'\\D', '', 'g'"],
      ["MySQL", "REGEXP, দুটো Backslash, $1, regexp_count নেই", "'\\\\d'"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "title এর মান 'Saint Martin Island Escape'। title LIKE 'Martin' আর title ~ 'Martin', এই দুটো কী দেয়?",
        options: [
          {
            key: "A",
            text: "দুটোই true",
            isCorrect: false,
            explanation: "LIKE এর Pattern কে পুরো লেখা ঢাকতে হয়। শুধু Martin পুরো Title না, তাই LIKE false।",
          },
          {
            key: "B",
            text: "LIKE false, ~ true",
            isCorrect: true,
            explanation: "ঠিক। LIKE পুরো লেখা মেলায়, তাই %Martin% লাগত। Regex লেখার ভেতরে কোথাও Martin পেলেই true।",
          },
          {
            key: "C",
            text: "LIKE true, ~ false",
            isCorrect: false,
            explanation: "উল্টো বলা হয়েছে। Regex নিজে থেকে যেকোনো জায়গায় খোঁজে, তাই সেটাই true।",
          },
          {
            key: "D",
            text: "দুটোই false",
            isCorrect: false,
            explanation: "Regex এ কোনো Anchor নেই, তাই লেখার ভেতরের Martin যথেষ্ট।",
          },
        ],
      },
      {
        id: 2,
        text: "কোন লেখাটা '^\\d{11}$' এর সাথে মেলে?",
        options: [
          {
            key: "A",
            text: "01000-000101",
            isCorrect: false,
            explanation: "মাঝের Dash অঙ্ক না, আর ^ থেকে $ পর্যন্ত শুধু অঙ্ক থাকতে হবে।",
          },
          {
            key: "B",
            text: "+8801000000101",
            isCorrect: false,
            explanation: "শুরুর + অঙ্ক না, আর অঙ্কও তেরোটা।",
          },
          {
            key: "C",
            text: "01000000101",
            isCorrect: true,
            explanation: "ঠিক। শুরু থেকে শেষ পর্যন্ত ঠিক এগারোটা অঙ্ক, আর কিছু না।",
          },
          {
            key: "D",
            text: "0100000010",
            isCorrect: false,
            explanation: "এখানে অঙ্ক দশটা। {11} মানে ঠিক এগারো, কম বা বেশি না।",
          },
        ],
      },
      {
        id: 3,
        text: "PostgreSQL এ 'Tea Garden' ~ '\\bTea\\b' চালালে false আসে। কেন?",
        options: [
          {
            key: "A",
            text: "কারণ ~ বড় ছোট অক্ষর আলাদা ধরে",
            isCorrect: false,
            explanation: "Tea আর Tea একই রকম লেখা, বড় ছোট অক্ষরের কোনো পার্থক্য এখানে নেই।",
          },
          {
            key: "B",
            text: "কারণ PostgreSQL এ \\b মানে Backspace অক্ষর, শব্দের সীমা না",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL এর Regex এ শব্দের সীমার জন্য \\m, \\M বা \\y। \\b একটা অদৃশ্য Control অক্ষর, যা লেখায় থাকে না।",
          },
          {
            key: "C",
            text: "কারণ Pattern এ ^ আর $ নেই",
            isCorrect: false,
            explanation: "Anchor না থাকলে বরং যেকোনো জায়গায় মেলানো সহজ হয়। সমস্যাটা \\b এর মানে।",
          },
          {
            key: "D",
            text: "কারণ PostgreSQL এ \\ লিখতে হয় দুবার",
            isCorrect: false,
            explanation: "দুবার লিখতে হয় MySQL এ। PostgreSQL এর সাধারণ লেখায় একটা Backslash ই যথেষ্ট।",
          },
        ],
      },
      {
        id: 4,
        text: "regexp_replace('+880 1000-000101', '\\D', '') কী ফেরত দেয়?",
        options: [
          {
            key: "A",
            text: "8801000000101",
            isCorrect: false,
            explanation: "সব অ-অঙ্ক মুছতে চতুর্থ জায়গায় 'g' লাগত। এখানে g নেই।",
          },
          {
            key: "B",
            text: "880 1000-000101",
            isCorrect: true,
            explanation: "ঠিক। g ছাড়া regexp_replace শুধু প্রথম মিলটা বদলায়, এখানে শুরুর +। Space আর Dash থেকে যায়, আর কোনো Error আসে না।",
          },
          {
            key: "C",
            text: "একটা Error, কারণ নতুন লেখা ফাঁকা",
            isCorrect: false,
            explanation: "ফাঁকা লেখা দিয়ে বদলানো পুরোপুরি বৈধ, এটাই মোছার উপায়।",
          },
          {
            key: "D",
            text: "+880 1000-000101, কিছুই বদলায় না",
            isCorrect: false,
            explanation: "একটা মিল বদলায়, প্রথমটা।",
          },
        ],
      },
      {
        id: 5,
        text: "Email যাচাই করতে Pattern লেখা হলো 'mail.example'। এতে কী সমস্যা?",
        options: [
          {
            key: "A",
            text: "কোনো সমস্যা নেই",
            isCorrect: false,
            explanation: "বিন্দু Regex এ বিশেষ চিহ্ন, তাই এটা আসল Email ছাড়াও অন্য লেখার সাথে মেলে।",
          },
          {
            key: "B",
            text: "বিন্দু মানে যেকোনো অক্ষর, তাই mailXexample ও মেলে। লিখতে হবে mail\\.example",
            isCorrect: true,
            explanation: "ঠিক। \\ দিয়ে বিন্দুর বিশেষ মানে বাদ দিলে তবেই সেটা আসল বিন্দু।",
          },
          {
            key: "C",
            text: "Email এ বিন্দু থাকলে Regex Error দেয়",
            isCorrect: false,
            explanation: "Error দেয় না, এটাই বিপদ। চুপচাপ বেশি জিনিস মেলায়।",
          },
          {
            key: "D",
            text: "~ এর বদলে ~* লিখতে হবে",
            isCorrect: false,
            explanation: "~* শুধু বড় ছোট অক্ষরের নিয়ম বদলায়, বিন্দুর মানে না।",
          },
        ],
      },
      {
        id: 6,
        text: "নিচের কোনটা একটা লেখা থেকে একাধিক Row বানাতে পারে?",
        options: [
          {
            key: "A",
            text: "regexp_count",
            isCorrect: false,
            explanation: "এটা একটা সংখ্যা দেয়, প্রতিটা Row এর জন্য একটা।",
          },
          {
            key: "B",
            text: "regexp_substr",
            isCorrect: false,
            explanation: "এটা প্রথম মেলা অংশটা একটা লেখা হিসেবে দেয়, Row এর সংখ্যা বদলায় না।",
          },
          {
            key: "C",
            text: "regexp_split_to_table",
            isCorrect: true,
            explanation: "ঠিক। লেখাটা Pattern এর জায়গায় কেটে প্রতিটা টুকরো আলাদা Row এ দেয়। g Flag সহ regexp_matches ও একই কাজ করে।",
          },
          {
            key: "D",
            text: "regexp_like",
            isCorrect: false,
            explanation: "এটা শুধু true বা false দেয়।",
          },
        ],
      },
      {
        id: 7,
        text: "MySQL 8.4 এ SELECT 'abd' REGEXP '\\d' চালালে 1 আসে। কেন?",
        options: [
          {
            key: "A",
            text: "কারণ abd এ একটা অঙ্ক আছে",
            isCorrect: false,
            explanation: "abd এ কোনো অঙ্ক নেই। সমস্যা Pattern এ।",
          },
          {
            key: "B",
            text: "কারণ MySQL লেখা পড়ার সময় \\ ফেলে দেয়, Regex পায় শুধু d, আর abd এ d আছে",
            isCorrect: true,
            explanation: "ঠিক। MySQL এর লেখায় \\ একটা বিশেষ চিহ্ন। অঙ্ক বোঝাতে MySQL এ লিখতে হয় দুটো Backslash।",
          },
          {
            key: "C",
            text: "কারণ MySQL এর REGEXP সবসময় 1 দেয়",
            isCorrect: false,
            explanation: "মিল না পেলে 0 দেয়। 'abc' REGEXP দুই Backslash এর \\d চালালে 0 আসে।",
          },
          {
            key: "D",
            text: "কারণ MySQL এ \\d মানে অক্ষর",
            isCorrect: false,
            explanation: "সঠিকভাবে লিখলে MySQL এও \\d মানে অঙ্ক। লেখার নিয়মে Backslash হারিয়ে যায়।",
          },
        ],
      },
      {
        id: 8,
        text: "হাতে লেখা একটা ফোন নম্বর ধুয়ে অঙ্ক করার পর পাওয়া গেল 1000000105। এখন কী করা ঠিক?",
        options: [
          {
            key: "A",
            text: "শেষের দশ অঙ্কের আগে +880 বসিয়ে দেওয়া",
            isCorrect: false,
            explanation: "শুরুতে 0 বা 880 নেই, তাই আকার মেলে না। বসালে দেখতে ঠিক কিন্তু কার নম্বর কেউ জানে না।",
          },
          {
            key: "B",
            text: "শুরুতে 0 বসিয়ে দেওয়া, কারণ বেশিরভাগ নম্বর 0 দিয়ে শুরু",
            isCorrect: false,
            explanation: "এটা আন্দাজ। আন্দাজের নম্বরে SMS গেলে অচেনা কারো ফোনে যায়।",
          },
          {
            key: "C",
            text: "আকার মেলে না বলে আলাদা করে রাখা, হাতে যাচাইয়ের জন্য",
            isCorrect: true,
            explanation: "ঠিক। ধাপ দুই, যাচাই, এই জন্যই। আকার না মিললে বদলাবেন না।",
          },
          {
            key: "D",
            text: "Row টা মুছে ফেলা",
            isCorrect: false,
            explanation: "মুছলে তথ্য চিরতরে হারায়। আলাদা রাখলে পরে ঠিক নম্বরটা খুঁজে বসানো যায়।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: রুমানার মেলার ফাইল পরিষ্কার করা",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>নমুনার দুই দল:</strong> বাংলাদেশের মোবাইল নম্বরের জন্য পাঁচটা লেখা বানান যেগুলো
        মিলতেই হবে, আর পাঁচটা যেগুলো কিছুতেই মিলবে না। (VALUES ...) দিয়ে psql এ{" "}
        <code className={CODE}>^(880|0)1\d{"{9}"}$</code> চালিয়ে প্রতিটার ফল লিখুন। না মেলা দলে
        অন্তত একটা এমন রাখুন যেটা Anchor ছাড়া ভুল করে মিলে যেত।
      </span>,
      <span key="2">
        <strong>ধোয়ার Query:</strong> লেসনের সাতটা এলোমেলো নম্বর আর নিজের বানানো আরও পাঁচটা, মোট
        বারোটা নিয়ে এমন একটা Query লিখুন যেটা প্রতিটার পাশে digits, valid আর normalized দেখায়।
        valid false হলে normalized এর জায়গায় NULL দেখান, CASE দিয়ে।
      </span>,
      <span key="3">
        <strong>Email পর্যালোচনা:</strong> customers এর পনেরোটা Email এর প্রতিটার username থেকে
        প্রথম নাম আর পদবি আলাদা করুন regexp_match দিয়ে, তারপর একই কাজ split_part দিয়ে করে দেখান
        দুটো একই ফল দেয়। কোনটা আপনার কাছে পড়তে সহজ, এক লাইনে লিখুন।
      </span>,
      <span key="4">
        <strong>মন্তব্য বিশ্লেষণ:</strong> reviews এর প্রতিটা মন্তব্যের পাশে regexp_count দিয়ে শব্দের
        সংখ্যা দেখান, আর সবচেয়ে লম্বা মন্তব্যটা খুঁজে বের করুন। তারপর সেই একটা মন্তব্য
        regexp_split_to_table দিয়ে শব্দে ভেঙে দেখান। মন্তব্য নেই এমন দুটো Review এ regexp_count
        কী দেয়, আর কেন, এক লাইনে লিখুন।
      </span>,
      <span key="5">
        <strong>MySQL বন্ধুর জন্য:</strong> লেসনের Challenge এর সমাধানটা MySQL 8.4 এর জন্য লিখুন।
        কোন কোন জায়গা বদলাতে হলো, আর কেন, ছয় লাইনে লিখুন। MySQL হাতে থাকলে চালিয়ে দেখান।
      </span>,
    ],
    deliverables: [
      <span key="d1">দুই দলের দশটা নমুনা আর তাদের true বা false, psql থেকে কপি করা</span>,
      <span key="d2">বারোটা নম্বরের ধোয়ার Query আর তার Output</span>,
      <span key="d3">regexp_match আর split_part এর দুই Query, আর কোনটা সহজ তার এক লাইন</span>,
      <span key="d4">MySQL সংস্করণের Query আর ছয় লাইনের ব্যাখ্যা</span>,
    ],
  },
  practicalLab: {
    title: "Regex এর Drill",
    subtitle: "নিজের island_tours এ psql দিয়ে, প্রতিটার প্রত্যাশিত ফলসহ",
    stepName: "DRILL",
    steps: [
      {
        title: "psql খুলে island_tours এ ঢুকুন",
        description:
          "psql -d island_tours, অথবা Docker এ docker exec -it island-pg psql -U postgres -d island_tours। Module 02 এ Load করা Database টাই লাগবে। শেষ ফাইলে তারিখের হিসাব আছে, তাই প্রথমে SET TimeZone = 'Asia/Dhaka' চালিয়ে নিন।",
      },
      {
        title: "চার Operator",
        description:
          "প্রথম ফাইল চালান। ~ আর ~* এর ফল কেন আলাদা, আর !~ কেন ৭, প্রতিটার পাশের মন্তব্যের সাথে মেলান।",
      },
      {
        title: "বন্ধনী, Quantifier আর Anchor",
        description:
          "দ্বিতীয় আর তৃতীয় ফাইল চালান। \\b আর \\y এর পার্থক্যটা নিজের চোখে দেখুন, তারপর \\m (boat|ship) \\M এর জায়গায় শুধু (boat|ship) লিখে দেখুন ফল বদলায় কিনা।",
      },
      {
        title: "Function দিয়ে গোনা আর তুলে আনা",
        description:
          "চতুর্থ ফাইল চালান। regexp_match এর ফলকে বন্ধনীতে না মুড়ে [2] লিখলে কী Error আসে, একবার চেষ্টা করে দেখুন।",
      },
      {
        title: "বদলানো আর g Flag",
        description:
          "পঞ্চম ফাইল চালান। first_only আর every_one পাশাপাশি দেখে g এর কাজটা নিশ্চিত করুন।",
      },
      {
        title: "রুমানার ফাইল আর মডিউলের Report",
        description:
          "ষষ্ঠ ফাইল চালান। প্রথম Query তে পাঁচটা বৈধ নম্বর, দ্বিতীয়টায় বারোজন Customer। Report এর প্রতিটা Column কোন লেসনের, নিজে লিখে রাখুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-operators.sql",
        code: `SELECT title FROM tours WHERE title ~ 'Saint';            -- 2 rows
SELECT title FROM tours WHERE title ~ 'bazar';            -- 0 rows, case matters
SELECT title FROM tours WHERE title ~* 'bazar';           -- 2 rows
SELECT count(*) FROM tours WHERE title !~ 'Saint';        -- 7
SELECT title FROM tours WHERE title LIKE 'Saint';         -- 0 rows, LIKE covers the whole title`,
      },
      {
        language: "sql",
        filename: "02-classes-quantifiers.sql",
        code: `SELECT full_name FROM customers WHERE full_name ~ '^[AEIOU]';     -- 4 rows
SELECT title FROM tours WHERE title ~ '^[^S]';                     -- 4 rows
SELECT full_name, email FROM customers WHERE email ~ '^[a-z]{5}\\.'; -- 7 rows
SELECT full_name FROM customers WHERE full_name ~ 'an$';           -- 3 rows`,
      },
      {
        language: "sql",
        filename: "03-groups-edges.sql",
        code: `SELECT title FROM tours WHERE title ~ '(Beach|Island)';             -- 2 rows
SELECT title FROM tours WHERE title ~ '^S.*(Tour|Trip)$';           -- 2 rows
SELECT review_id, comment FROM reviews
WHERE comment ~* '\\m(boat|ship)\\M';                                 -- 2 rows
SELECT 'Sea Beach' ~ '\\bBeach\\b' AS with_b,
       'Sea Beach' ~ '\\yBeach\\y' AS with_y;                         -- f | t`,
      },
      {
        language: "sql",
        filename: "04-functions.sql",
        code: `SELECT title, regexp_count(title, '\\S+') AS words
FROM tours ORDER BY tour_id;                                        -- 9 rows

SELECT customer_id, regexp_substr(email, '^[^@]+') AS username
FROM customers WHERE city = 'Dhaka' ORDER BY customer_id;           -- 6 rows

SELECT (regexp_match(email, '^([^.]+)\\.([^@]+)@'))[2] AS last_part
FROM customers ORDER BY customer_id LIMIT 3;                        -- uddin, jahan, ahmed

SELECT regexp_split_to_table('Sajek Valley Cloud Trip', '\\s+');     -- 4 rows`,
      },
      {
        language: "sql",
        filename: "05-replace.sql",
        code: `SELECT full_name, regexp_replace(phone, '\\D', '', 'g') AS digits
FROM guides ORDER BY guide_id;                                      -- 5 rows

SELECT regexp_replace('+880 1000-000101', '\\D', '')      AS first_only,  -- 880 1000-000101
       regexp_replace('+880 1000-000101', '\\D', '', 'g') AS every_one;   -- 8801000000101

SELECT email, regexp_replace(email, '^(.)[^@]*', '\\1***') AS masked
FROM customers ORDER BY customer_id LIMIT 3;                        -- r***@mail.example ...`,
      },
      {
        language: "sql",
        filename: "06-cleanup-and-report.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

SELECT id, '+880' || right(regexp_replace(typed, '\\D', '', 'g'), 10) AS phone
${MESSY_PHONES}
WHERE regexp_replace(typed, '\\D', '', 'g') ~ '^(880|0)1\\d{9}$'
ORDER BY id;                                                        -- 5 rows: 1, 2, 3, 4, 7

SELECT customer_id,
       upper(split_part(full_name, ' ', 2)) || ', ' || split_part(full_name, ' ', 1) AS sort_name,
       coalesce(regexp_replace(phone, '^\\+880', '0'), 'no phone') AS local_phone,
       regexp_replace(email, '^(.)[^@]*', '\\1***') AS masked_email,
       to_char(joined_at, 'DD Mon YYYY') AS joined,
       DATE '2026-11-01' - joined_at::date AS days_as_member,
       round((DATE '2026-11-01' - joined_at::date) / 30.0, 1) AS months_approx
FROM customers
WHERE country = 'Bangladesh'
  AND email ~ '^[a-z]+\\.[a-z]+@'
ORDER BY customer_id;                                               -- 12 rows`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা ফাইলের শেষে নিজে একটা Pattern বদলে দেখুন, আর বদলের আগে আন্দাজ করুন কয়টা Row
        আসবে। আন্দাজ আর ফল মিলে গেলে বুঝবেন Pattern টা আপনি আসলে পড়তে পারছেন।
      </ContentParagraph>
    ),
  },
};
