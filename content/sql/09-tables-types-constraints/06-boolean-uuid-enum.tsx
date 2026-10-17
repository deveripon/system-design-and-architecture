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
  BooleanInputLab,
  ChooseWayLab,
  EnumChangeLab,
  UuidOrderLab,
} from "../../../components/course/topics/ddl/buenum-animations";
import {
  BooleanStatesDiagram,
  GuessableIdDiagram,
  ThreeWaysDiagram,
  UuidAnatomyDiagram,
} from "../../../components/course/topics/ddl/buenum-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

const THEORY_SQL = `DROP TABLE IF EXISTS buenum_tickets_v0;
CREATE TABLE buenum_tickets_v0 (
  ticket_no  integer,
  passenger  text,
  breakfast  text,
  seat_class text
);
INSERT INTO buenum_tickets_v0 VALUES
  (1, 'Rahim Uddin',    'Yes',   'cabin'),
  (2, 'Nusrat Jahan',   'yes',   'Cabin'),
  (3, 'Tanvir Ahmed',   'Y',     'economy'),
  (4, 'Farhana Akter',  '1',     'cabn'),
  (5, 'Sabbir Hossain', 'হ্যাঁ',  'deck'),
  (6, 'Mitu Rahman',    'no',    'Economy');

-- কতজন নাশতা চেয়েছেন?
SELECT count(*) FILTER (WHERE breakfast = 'Yes') AS breakfast_yes,
       count(*) AS tickets
FROM buenum_tickets_v0;

-- কোন শ্রেণিতে কত Ticket?
SELECT seat_class, count(*) AS tickets
FROM buenum_tickets_v0
GROUP BY seat_class
ORDER BY seat_class;`;

const WAYS_SETUP_SQL = `DROP TABLE IF EXISTS buenum_way_enum, buenum_way_check, buenum_way_lookup, buenum_statuses;
DROP TYPE IF EXISTS buenum_status;

-- পথ ১: enum Type
CREATE TYPE buenum_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TABLE buenum_way_enum (
  booking_id integer NOT NULL,
  status     buenum_status NOT NULL
);

-- পথ ২: text আর CHECK, Island Tours এর bookings যেভাবে
CREATE TABLE buenum_way_check (
  booking_id integer NOT NULL,
  status     text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- পথ ৩: Lookup Table, তালিকাটা নিজেই Data
CREATE TABLE buenum_statuses (
  code       text PRIMARY KEY,
  label      text NOT NULL,
  sort_order smallint NOT NULL
);
INSERT INTO buenum_statuses VALUES
  ('pending',   'পেমেন্টের অপেক্ষায়', 1),
  ('confirmed', 'নিশ্চিত',           2),
  ('cancelled', 'বাতিল',             3);
CREATE TABLE buenum_way_lookup (
  booking_id integer NOT NULL,
  status     text NOT NULL REFERENCES buenum_statuses (code)
);

-- তিনটাতেই একটা ঠিক Row
INSERT INTO buenum_way_enum   VALUES (1, 'confirmed');
INSERT INTO buenum_way_check  VALUES (1, 'confirmed');
INSERT INTO buenum_way_lookup VALUES (1, 'confirmed');

SELECT 'enum' AS way, count(*) AS rows FROM buenum_way_enum
UNION ALL SELECT 'check', count(*) FROM buenum_way_check
UNION ALL SELECT 'lookup', count(*) FROM buenum_way_lookup;`;

const PROJECT_SQL = `DROP TABLE IF EXISTS buenum_ferry_tickets;
DROP TYPE IF EXISTS buenum_ferry_class;

-- ধাপ ১: শ্রেণির তালিকা, সস্তা থেকে দামি ক্রমে
CREATE TYPE buenum_ferry_class AS ENUM ('deck', 'economy', 'cabin');

-- ধাপ ২: Ticket এর Table
CREATE TABLE buenum_ferry_tickets (
  ticket_ref         uuid PRIMARY KEY DEFAULT uuidv7(),
  booking_id         integer NOT NULL,
  seat_class         buenum_ferry_class NOT NULL DEFAULT 'economy',
  breakfast_included boolean NOT NULL DEFAULT false,
  issued_at          timestamptz NOT NULL DEFAULT now()
);

-- ধাপ ৩: Saint Martin Island Escape এর প্রতিটা confirmed Booking এ একটা Ticket
INSERT INTO buenum_ferry_tickets (booking_id, seat_class, breakfast_included)
SELECT b.booking_id,
       CASE WHEN b.seats >= 3 THEN 'cabin'
            WHEN b.seats = 2  THEN 'economy'
            ELSE 'deck' END::buenum_ferry_class,
       b.seats >= 3
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
WHERE d.tour_id = 1 AND b.status = 'confirmed'
ORDER BY b.booking_id;

-- ধাপ ৪: শ্রেণি অনুযায়ী হিসাব
SELECT seat_class, count(*) AS tickets,
       count(*) FILTER (WHERE breakfast_included) AS with_breakfast
FROM buenum_ferry_tickets
GROUP BY seat_class
ORDER BY seat_class;`;

export const booleanUuidEnumContent: TopicData = {
  id: "boolean-uuid-enum",
  introduction: {
    badge: "MODULE 09 · LESSON 06",
    title: <SectionTitle>হ্যাঁ বা না, পৃথিবীতে একটাই নাম, আর বাঁধা তালিকা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের তিনটা লেসনে আপনি সংখ্যা, লেখা আর সময়ের Type চিনেছেন। প্রায় সব Column এই তিন পরিবারের কোনো একটায় পড়ে।
          কিন্তু রোজকার Table এ আরও তিন ধরনের Column বারবার ফিরে আসে, যেগুলো text বা integer দিয়েও বানানো যায়, অথচ
          বানালে চুপচাপ ঝামেলা শুরু হয়। একটা হলো হ্যাঁ বা না এর প্রশ্ন: ট্যুরটা চালু কিনা, নাশতা আছে কিনা। একটা হলো
          এমন একটা পরিচয় নম্বর, যেটা আন্দাজ করা যায় না আর পৃথিবীর কোথাও আরেকটা তৈরি হবে না। আর একটা হলো কয়েকটা
          নির্দিষ্ট মানের তালিকা: pending, confirmed, cancelled, এর বাইরে কিছু না।
        </ContentParagraph>
        <ContentParagraph>
          এই তিনটা কাজের জন্য PostgreSQL এর তিনটা Type আছে: boolean, uuid আর enum। প্রতিটা ছোট, কিন্তু প্রতিটা একটা
          নির্দিষ্ট ধরনের ভুলকে Database এর দরজাতেই আটকে দেয়। এই লেসনে আপনি তিনটাকেই গোড়া থেকে চিনবেন: ভেতরে কী জমা
          থাকে, কী লেখা গ্রহণ করে আর কী ফিরিয়ে দেয়, কোথায় ব্যবহার করা উচিত আর কোথায় না।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি boolean Column বানিয়ে তার উপর ঠিকভাবে প্রশ্ন করতে পারবেন, gen_random_uuid() আর uuidv7() এর
          পার্থক্য বুঝে uuid Column বানাতে পারবেন, enum Type বানিয়ে বদলাতে পারবেন, আর একটা নির্দিষ্ট মানের তালিকার জন্য
          enum, CHECK আর Lookup Table এর মধ্যে কোনটা কখন, সেটা যুক্তি দিয়ে বেছে নিতে পারবেন। MySQL এ এই তিনটা কেমন,
          সেটাও আসল Output সহ দেখবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমরা তিনজন ছোট, কিন্তু কাজ বড়। একজন নিশ্চিত করি হ্যাঁ মানে হ্যাঁ, আর কিছু না। একজন এমন নাম দিই, যা পৃথিবীতে আর কারও নেই। আরেকজন দরজায় দাঁড়িয়ে তালিকা মিলিয়ে দেখি, তালিকার বাইরের কাউকে ঢুকতে দিই না।",
      author: "boolean, uuid আর enum",
      role: "Lesson 06",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>তানিমের ফেরি Ticket এর Table</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Island Tours এবার Saint Martin এর ট্যুরের সাথে জাহাজের Ticket ও দেবে। Manager ফারুক
                সাহেব তানিমকে বললেন, প্রতিটা Ticket এ লাগবে যাত্রীর নাম, নাশতা নেবেন কিনা, আর বসার শ্রেণি: deck, economy
                বা cabin। Customer কে একটা Link পাঠানো হবে, যেটা খুললে Ticket দেখা যাবে।
              </ContentParagraph>
              <ContentParagraph>
                তানিম আগের লেসনগুলোর মতো করে একটা Table বানালেন। নাশতার Column আর শ্রেণির Column, দুটোই text, কারণ text এ
                সব লেখা যায়। Ticket এর নম্বর integer, 1, 2, 3 করে। Data ঢুকল পুরনো Spreadsheet থেকে কপি করে, যেখানে
                একেকজন কর্মী একেক ভাবে লিখেছিলেন। নিচের বক্সে ঠিক সেই Table টা আছে। চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সব কিছু text আর integer দিয়ে"
              query={THEORY_SQL}
              caption="প্রথম ফলাফল: breakfast_yes 1, tickets 6। অথচ ছয়জনের পাঁচজনই নাশতা চেয়েছেন, শুধু লিখেছেন Yes, yes, Y, 1 আর হ্যাঁ। দ্বিতীয় ফলাফলে ৬টা Row: Cabin, Economy, cabin, cabn, deck, economy, প্রতিটায় 1। তিনটা শ্রেণি, অথচ Report বলছে ছয়টা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রান্নাঘর Report দেখে একজনের নাশতা বানাল, জাহাজে পাঁচজন নাশতা চাইলেন। শ্রেণির Report দেখে জাহাজ কোম্পানি
                বুঝতেই পারল না cabn নামে কোন শ্রেণি আছে। আর তৃতীয় ঝামেলাটা ধরা পড়ল একদিন পরে। ফারহানা আক্তার তাঁর Ticket
                এর Link পেলেন, যার শেষে লেখা 4। কৌতূহলে তিনি শেষের 4 বদলে 5 লিখলেন, আর খুলে গেল সাব্বির হোসেনের Ticket,
                নাম আর শ্রেণি সহ।
              </ContentParagraph>
              <ContentParagraph>
                তিনটা ঝামেলার কোনোটাই SQL এর ভুল না, কোনো Error ও আসেনি। ভুলটা Type বাছাইয়ে। text Column যেকোনো লেখা নিয়ে
                নেয়, তাই হ্যাঁ বোঝানোর পাঁচ রকম লেখা আর শ্রেণির ভুল বানান সবই চুপচাপ জমা হয়েছে। আর 1, 2, 3 করে বাড়া নম্বর
                সবাই আন্দাজ করতে পারে। এই লেসনের তিনটা Type ঠিক এই তিনটা জায়গার জন্য বানানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের তিনটা Type, এক লাইনে",
          content: (
            <ContentList>
              <ListItem>
                <strong>boolean:</strong> শুধু সত্য, মিথ্যা আর অজানা (NULL)। হ্যাঁ বোঝানোর পাঁচ রকম লেখা ঢোকার সময়েই একটা মানে
                পরিণত হয়, আর বাজে লেখা ঢুকতেই পারে না।
              </ListItem>
              <ListItem>
                <strong>uuid:</strong> ১২৮ Bit এর একটা পরিচয়, যেটা আন্দাজ করা কার্যত অসম্ভব আর যেকোনো জায়গায় তৈরি করা যায়,
                কোনো কেন্দ্রীয় গণনা ছাড়াই।
              </ListItem>
              <ListItem>
                <strong>enum:</strong> আপনার নিজের বানানো একটা Type, যেটা শুধু ঘোষণা করা কয়েকটা মান নেয়, ঘোষণার ক্রমে সাজে, আর
                তালিকার বাইরের যেকোনো লেখা ফিরিয়ে দেয়।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "boolean-type",
      subHeader: { index: "002", title: "The boolean Type" },
      title: <SectionTitle>boolean: হ্যাঁ, না, আর জানি না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঘরের বাতির সুইচের কথা ভাবুন। সুইচ হয় চালু, নয় বন্ধ, মাঝামাঝি কিছু নেই। boolean ঠিক এমন একটা Type: এর মান হয়
                true (সত্য, হ্যাঁ), নয় false (মিথ্যা, না)। নামটা এসেছে গণিতবিদ George Boole এর নাম থেকে, যিনি সত্য আর মিথ্যার
                বীজগণিত লিখেছিলেন।
              </ContentParagraph>
              <ContentParagraph>
                তবে Database এ একটা তৃতীয় অবস্থাও আছে, যেটা সুইচে নেই: NULL, মানে অজানা। একটা জরিপের ফর্ম ভাবুন, যেখানে
                প্রশ্ন ছিল “নাশতা নেবেন?”, আর কেউ ঘরটা ফাঁকা রেখে দিয়েছেন। তিনি হ্যাঁ বলেননি, না ও বলেননি। সেই উত্তর true ও
                না, false ও না, সেটা NULL। Module 03 এর{" "}
                <Link href="/sql/topic/null-logic" className={LINK}>
                  NULL Logic
                </Link>{" "}
                লেসনে যে তিন মানের যুক্তি দেখেছিলেন, boolean Column এ সেটাই সবচেয়ে সরাসরি দেখা যায়।
              </ContentParagraph>
              <ContentParagraph>
                জায়গা লাগে মাত্র ১ Byte, integer এর চার ভাগের এক ভাগ। কিন্তু আসল লাভটা জায়গায় না, অর্থে। একটা boolean Column
                দেখলেই যে কেউ বোঝেন এখানে একটা হ্যাঁ বা না এর প্রশ্নের উত্তর আছে। text Column দেখে সেটা বোঝা যায় না, আর
                integer Column এ কেউ একদিন 2 লিখে বসবেন।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর Database এ আপনি এমন একটা Column আগেই দেখেছেন: <code className={CODE}>tours.is_active</code>,
                যেটা বলে ট্যুরটা এখন বিক্রি হচ্ছে কিনা। নিচের বক্সে সেটা পড়ুন, তারপর information_schema থেকে দেখুন Column টা
                কীভাবে সংজ্ঞায়িত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Island Tours এর boolean Column"
              query={`SELECT tour_id, title, is_active
FROM tours
ORDER BY tour_id;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tours' AND column_name = 'is_active';

SELECT pg_column_size(true) AS bool_bytes,
       pg_column_size(1)    AS int_bytes;`}
              caption="প্রথম ফলাফলে ৯টা ট্যুর, শুধু ৮ নম্বর Saint Martin Luxury Stay এর পাশে f, বাকি সবার পাশে t। দ্বিতীয়টায় is_active, boolean, NO, true: মানে Column টা boolean, ফাঁকা রাখা যায় না, আর কিছু না বললে true। তৃতীয়টায় bool_bytes 1, int_bytes 4।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লক্ষ করুন, psql আর এই Query বক্স true কে দেখায় t, false কে f। এটা শুধু দেখানোর ধরন। আপনার App যখন Driver দিয়ে
                একই Column পড়ে, সাধারণত নিজের ভাষার true আর false পায়। SQL এর ভেতরে মান লেখার সবচেয়ে পরিষ্কার উপায় হলো
                উদ্ধৃতি ছাড়া TRUE আর FALSE, কারণ PostgreSQL এর Documentation এ এটাই SQL Standard এর পছন্দের লেখা।
              </ContentParagraph>
              <ContentParagraph>
                is_active এর সংজ্ঞায় দুটো জিনিস ইচ্ছা করে রাখা: <code className={CODE}>NOT NULL</code> আর{" "}
                <code className={CODE}>DEFAULT true</code>। NOT NULL না থাকলে Column টায় তিনটা অবস্থা থাকত, আর “চালু কিনা জানি
                না” কথাটার কোনো ব্যবসায়িক মানে নেই। একটা ট্যুর হয় বিক্রি হচ্ছে, নয় হচ্ছে না। তাই বেশিরভাগ boolean Column এর
                স্বাভাবিক রূপ হলো <code className={CODE}>boolean NOT NULL DEFAULT false</code> বা{" "}
                <code className={CODE}>DEFAULT true</code>। NOT NULL আর DEFAULT এর পুরো গল্প পরের লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "boolean Column এর নাম",
          content: (
            <ContentParagraph>
              নাম এমন রাখুন, যেটা একটা হ্যাঁ বা না এর প্রশ্নের মতো পড়া যায়: <code className={CODE}>is_active</code>,{" "}
              <code className={CODE}>has_window</code>, <code className={CODE}>can_refund</code>,{" "}
              <code className={CODE}>breakfast_included</code>। তাহলে <code className={CODE}>WHERE is_active</code> পড়তে
              বাংলা বাক্যের মতো লাগে: যেখানে চালু। <code className={CODE}>status</code> বা{" "}
              <code className={CODE}>flag</code> এর মতো নাম boolean এ দেবেন না, পড়ে বোঝা যায় না true মানে কী। আর নাম
              কখনো না বাচক রাখবেন না, যেমন <code className={CODE}>is_not_cancelled</code>: তখন{" "}
              <code className={CODE}>NOT is_not_cancelled</code> পড়তে মাথা ঘোরে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "boolean-inputs",
      subHeader: { index: "003", title: "What boolean Accepts" },
      title: <SectionTitle>কোন লেখা boolean হয়, কোনটা হয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিমের Spreadsheet এ হ্যাঁ লেখা ছিল পাঁচ রকমে। boolean Column থাকলে কী হতো? PostgreSQL এর Documentation বলে,
                boolean লেখা হিসেবে true অবস্থার জন্য চারটা শব্দ চেনে: <code className={CODE}>true</code>,{" "}
                <code className={CODE}>yes</code>, <code className={CODE}>on</code>, <code className={CODE}>1</code>। আর false
                এর জন্য চারটা: <code className={CODE}>false</code>, <code className={CODE}>no</code>,{" "}
                <code className={CODE}>off</code>, <code className={CODE}>0</code>। সাথে তিনটা নিয়ম:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>বড় হাতের বা ছোট হাতের অক্ষর কিছু বদলায় না।</strong> YES, Yes, yes সবই true।
                </ListItem>
                <ListItem>
                  <strong>আগে পরের ফাঁকা জায়গা বাদ পড়ে।</strong> &apos; TRUE &apos; ও true।
                </ListItem>
                <ListItem>
                  <strong>শব্দের শুরুর অংশ চলে, যদি সেটা থেকে একটাই শব্দ বোঝা যায়।</strong> t, tr, y, ye সব true; f, n, of সব
                  false। কিন্তু o চলে না, কারণ o দিয়ে on আর off দুটোই শুরু হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                যা-ই লেখা হোক, জমা থাকে একটাই জিনিস: সত্য অথবা মিথ্যা। ফেরত দেখানোর সময় সবসময় t বা f। তাই পাঁচ রকম লেখা ঢোকার
                মুহূর্তেই এক হয়ে যায়, পরে গোনার সময় আর কোনো গোলমাল থাকে না। নিচের ছবিতে পুরো মানচিত্রটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <BooleanStatesDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <BooleanInputLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আটটা লেখা, দুটো মান"
              query={`SELECT 'yes'::boolean    AS a,
       'off'::boolean    AS b,
       '1'::boolean      AS c,
       'f'::boolean      AS d,
       ' TRUE '::boolean AS e,
       'tr'::boolean     AS f,
       'Y'::boolean      AS g,
       'n'::boolean      AS h;

-- সংখ্যা থেকে রূপান্তর আলাদা নিয়মে চলে
SELECT 1::boolean AS one, 0::boolean AS zero, 2::boolean AS two,
       true::int  AS t_as_int, false::int AS f_as_int;`}
              caption="প্রথম ফলাফল: t f t f t t t f। দ্বিতীয়টায় one t, zero f, two t, t_as_int 1, f_as_int 0। লক্ষ করুন, উদ্ধৃতি ছাড়া integer 2 কে boolean করলে t আসে, কারণ সংখ্যা থেকে রূপান্তরের নিয়ম হলো শূন্য মানে false, বাকি সব true। কিন্তু উদ্ধৃতির ভেতরের '2' একটা লেখা, আর লেখা হিসেবে 2 তালিকায় নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার এমন লেখা, যেটা PostgreSQL ফিরিয়ে দেয়। Error এর লেখাটা মন দিয়ে পড়ুন, কারণ এই একই ধরনের Error আপনি
              uuid আর enum এও দেখবেন। SQLSTATE কোড 22P02, মানে invalid text representation: লেখাটা এই Type এর কোনো মানের
              মতো দেখতে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অস্পষ্ট লেখা"
              query={`SELECT 'o'::boolean;`}
              caption="ERROR: invalid input syntax for type boolean: o। এক অক্ষরের o থেকে on বোঝানো হলো নাকি off, PostgreSQL আন্দাজ করে না। 'o' এর জায়গায় 'yess', '2', 'null' বা খালি '' লিখেও চালিয়ে দেখুন, প্রতিবার একই Error।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পুরনো Data তে বাংলা হ্যাঁ বা না থাকলে সরাসরি boolean করা যায় না, Error আসবে। তখন আগে CASE দিয়ে নিজের তালিকা
                বানিয়ে অনুবাদ করে নিতে হয়। <code className={CODE}>lower(trim(...))</code> আগে বসালে বড় হাতের অক্ষর আর বাড়তি
                ফাঁকা জায়গার ঝামেলাও চলে যায়। যে লেখা কোনো তালিকায় পড়ে না, CASE সেখানে NULL দেয়, আর সেটাই সৎ উত্তর: জানা নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বাংলা উত্তর অনুবাদ করা"
              query={`SELECT answer,
       CASE
         WHEN lower(trim(answer)) IN ('yes', 'y', '1', 'true', 'হ্যাঁ') THEN true
         WHEN lower(trim(answer)) IN ('no', 'n', '0', 'false', 'না')    THEN false
       END AS breakfast
FROM (VALUES ('Yes'), ('yes'), ('Y'), ('1'), ('হ্যাঁ'), ('no'), ('জানি না')) AS s(answer);`}
              caption="৭টা Row। প্রথম পাঁচটায় t, no তে f, আর জানি না এর পাশে ফাঁকা, মানে NULL। তানিমের Spreadsheet এর হ্যাঁ বোঝানো পাঁচ রকম লেখা এখন একটাই মান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              starter={`SELECT answer
FROM (VALUES ('Yes'), ('n'), ('ON'), ('0'), (' true '), ('F')) AS s(answer);`}
              task={
                <>
                  বক্সের Query টা পুরনো Form এর ছয়টা উত্তর দেখায়। প্রতিটা লেখার পাশে একটা দ্বিতীয় Column যোগ করুন, যেখানে সেই
                  লেখাটা boolean এ রূপান্তরিত। Column দুটো: answer আর breakfast। ক্রম কোনো ব্যাপার না।
                </>
              }
              hint={
                <>
                  ছয়টা লেখাই PostgreSQL এর চেনা তালিকায় আছে, তাই CASE লাগবে না।{" "}
                  <code className={CODE}>answer::boolean</code> বা <code className={CODE}>CAST(answer AS boolean)</code> দুটোই
                  চলে।
                </>
              }
              solution={`SELECT answer, answer::boolean AS breakfast
FROM (VALUES ('Yes'), ('n'), ('ON'), ('0'), (' true '), ('F')) AS s(answer);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "boolean-questions",
      subHeader: { index: "004", title: "Asking boolean Questions" },
      title: <SectionTitle>boolean Column দিয়ে প্রশ্ন করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                boolean Column নিজেই একটা শর্ত। WHERE এর পরে শর্ত বসে, আর শর্তের ফল সত্য বা মিথ্যা। তাই{" "}
                <code className={CODE}>WHERE is_active</code> লিখলেই যথেষ্ট, <code className={CODE}>WHERE is_active = true</code>{" "}
                লেখার দরকার নেই। দুটো একই কাজ করে, কিন্তু প্রথমটা পড়তে সহজ। উল্টোটা চাইলে{" "}
                <code className={CODE}>WHERE NOT is_active</code>।
              </ContentParagraph>
              <ContentParagraph>
                গোনার জন্য তিনটা চেনা কৌশল কাজে লাগে। <code className={CODE}>count(*) FILTER (WHERE is_active)</code> শুধু চালু
                Row গোনে (Module 05 এ শিখেছিলেন)। <code className={CODE}>sum(is_active::int)</code> একই উত্তর দেয়, কারণ true
                কে integer করলে 1, false কে 0। আর দুটো বিশেষ Aggregate আছে শুধু boolean এর জন্য:{" "}
                <code className={CODE}>bool_and()</code> বলে সবগুলো true কিনা, <code className={CODE}>bool_or()</code> বলে
                অন্তত একটা true কিনা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চালু আর বন্ধ ট্যুর গোনা"
              query={`SELECT title, is_active
FROM tours
WHERE NOT is_active;

SELECT count(*) FILTER (WHERE is_active)     AS active,
       count(*) FILTER (WHERE NOT is_active) AS inactive,
       sum(is_active::int)                   AS active_by_sum,
       bool_and(is_active)                   AS all_active,
       bool_or(NOT is_active)                AS any_inactive
FROM tours;

SELECT is_active, count(*) AS tours
FROM tours
GROUP BY is_active
ORDER BY is_active;`}
              caption="প্রথম ফলাফলে ১টা Row: Saint Martin Luxury Stay, f। দ্বিতীয়টায় active 8, inactive 1, active_by_sum 8, all_active f, any_inactive t। তৃতীয়টায় f আগে (1টা), t পরে (8টা): সাজানোর সময় false আসে true এর আগে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার NULL এর পালা। Column এ NULL থাকতে পারলে <code className={CODE}>WHERE NOT breakfast</code> NULL Row গুলো
                বাদ দেয়, কারণ NOT NULL এর ফলও NULL, আর WHERE শুধু সত্য Row রাখে। “নাশতা চাননি” আর “উত্তর দেননি” তখন আলাদা
                হয়ে যায়, যেটা অনেক সময় ঠিক, কিন্তু না জেনে করলে ভুল গোনা হয়। এই জন্য SQL এ চারটা বিশেষ তুলনা আছে, যেগুলো
                কখনো NULL ফেরত দেয় না: <code className={CODE}>IS TRUE</code>, <code className={CODE}>IS NOT TRUE</code>,{" "}
                <code className={CODE}>IS FALSE</code> আর <code className={CODE}>IS UNKNOWN</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন অবস্থার পুরো ছক"
              query={`SELECT v,
       v IS TRUE     AS is_true,
       v IS NOT TRUE AS is_not_true,
       v IS FALSE    AS is_false,
       v IS UNKNOWN  AS is_unknown,
       NOT v         AS not_v
FROM (VALUES (true), (false), (NULL::boolean)) AS s(v);`}
              caption="৩টা Row। শেষ Row এ v ফাঁকা, মানে NULL: সেখানে is_true f, is_not_true t, is_false f, is_unknown t, আর not_v ফাঁকা। IS দিয়ে লেখা চারটা তুলনা সবসময় t বা f দেয়, কিন্তু NOT v এর ফল NULL থেকে যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "যে প্রশ্নে NULL ও ধরতে হবে",
          content: (
            <ContentParagraph>
              “যাঁরা নাশতা চাননি, তাঁদের সবাইকে জানিয়ে দিন যে জাহাজে খাবার কিনতে হবে” এমন প্রশ্নে উত্তর না দেওয়া মানুষগুলোও
              দরকার। তখন <code className={CODE}>WHERE breakfast IS NOT TRUE</code> লিখুন, যেটা false আর NULL দুটোই ধরে।{" "}
              <code className={CODE}>WHERE NOT breakfast</code> শুধু false ধরে। আর <code className={CODE}>= NULL</code>{" "}
              কখনো সত্য হয় না, NULL খুঁজতে <code className={CODE}>IS NULL</code> বা <code className={CODE}>IS UNKNOWN</code>।
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
                  প্রতিটা অঞ্চলের (<code className={CODE}>destinations.region</code>) হিসাব চাই: সেই অঞ্চলে কতগুলো চালু ট্যুর
                  আছে, আর সেই অঞ্চলের সব ট্যুরই চালু কিনা। যে অঞ্চলে কোনো ট্যুরই নেই, সেটা বাদ। Column তিনটা: region,
                  active_tours, all_active। অঞ্চলের নাম অনুযায়ী সাজান।
                </>
              }
              hint={
                <>
                  tours কে destinations এর সাথে JOIN করুন, region অনুযায়ী GROUP BY।{" "}
                  <code className={CODE}>count(*) FILTER (WHERE t.is_active)</code> আর{" "}
                  <code className={CODE}>bool_and(t.is_active)</code>।
                </>
              }
              solution={`SELECT ds.region,
       count(*) FILTER (WHERE t.is_active) AS active_tours,
       bool_and(t.is_active) AS all_active
FROM tours t
JOIN destinations ds ON ds.destination_id = t.destination_id
GROUP BY ds.region
ORDER BY ds.region;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "beyond-boolean",
      subHeader: { index: "005", title: "When boolean Is Not Enough" },
      title: <SectionTitle>যখন boolean ভুল পছন্দ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                boolean এত সহজ যে অনেকে সবকিছুতেই boolean বসান। তিনটা পরিস্থিতিতে সেটা পরে বিপদ ডাকে। প্রথমটা সবচেয়ে
                সাধারণ: একটা জিনিসের অবস্থা বোঝাতে কয়েকটা boolean। ধরুন Payment এর জন্য তিনটা Column: is_paid, is_refunded,
                is_failed। তিনটা boolean মানে আটটা সম্ভাব্য মিলন, অথচ অর্থবহ অবস্থা মাত্র তিনটা। বাকি পাঁচটা অর্থহীন, কিন্তু
                Database সেগুলোও খুশিমনে জমা রাখে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা boolean, আটটা মিলন"
              query={`DROP TABLE IF EXISTS buenum_pay_flags;
CREATE TABLE buenum_pay_flags (
  payment_id  integer NOT NULL,
  is_paid     boolean NOT NULL,
  is_refunded boolean NOT NULL,
  is_failed   boolean NOT NULL
);
INSERT INTO buenum_pay_flags VALUES
  (1,  true,  false, false),
  (5,  true,  true,  false),
  (13, false, false, true),
  (98, true,  true,  true),
  (99, false, false, false);

SELECT payment_id, is_paid, is_refunded, is_failed,
       is_paid::int + is_refunded::int + is_failed::int AS flags_on
FROM buenum_pay_flags
ORDER BY payment_id;

-- Island Tours এর আসল payments: একটা status Column
SELECT status, count(*) AS payments
FROM payments
GROUP BY status
ORDER BY status;`}
              caption="প্রথম ফলাফলে ৫টা Row। 98 নম্বর একসাথে paid, refunded আর failed, যেটা অসম্ভব। 99 নম্বরে তিনটাই f, সেটা কোন অবস্থা কেউ জানে না। দ্বিতীয় ফলাফলে আসল payments এর তিনটা অবস্থা: failed 1, paid 17, refunded 1। একটা Column, তিনটা অনুমোদিত মান, অর্থহীন মিলনের কোনো সুযোগই নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়মটা মনে রাখুন: একটা জিনিসের অবস্থা যদি একসাথে একটাই হতে পারে, তাহলে সেটা কয়েকটা boolean না, একটা Column
                যার মান একটা নির্দিষ্ট তালিকা থেকে আসে। সেই তালিকা কীভাবে রাখবেন, সেটাই এই লেসনের তৃতীয় অংশ: enum, CHECK
                বা Lookup Table।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় পরিস্থিতি: boolean একটা ঘটনার খবর দেয়, কিন্তু কখন ঘটল সেটা হারিয়ে ফেলে।{" "}
                <code className={CODE}>is_cancelled boolean</code> বলে Booking বাতিল কিনা। কিন্তু একমাস পরে কেউ জিজ্ঞেস
                করবেন, কবে বাতিল হলো? তখন উত্তর নেই। <code className={CODE}>cancelled_at timestamptz</code> রাখলে দুটো
                প্রশ্নেরই উত্তর মেলে: NULL মানে বাতিল হয়নি, একটা সময় থাকলে বাতিল হয়েছে, আর সেটা কখন।{" "}
                <code className={CODE}>cancelled_at IS NOT NULL</code> নিজেই একটা boolean। আগের লেসনে{" "}
                <Link href="/sql/topic/date-time-types" className={LINK}>
                  Date &amp; Time Types
                </Link>{" "}
                এ timestamptz ভালোভাবে চিনেছেন।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয় পরিস্থিতি: “অজানা” যখন সত্যিই একটা আলাদা উত্তর। ধরুন Customer কে জিজ্ঞেস করা হয়েছে, তিনি Newsletter
                চান কিনা। হ্যাঁ, না, আর এখনো জিজ্ঞেস করা হয়নি, তিনটাই আলাদা অর্থ, আর আইনের চোখেও আলাদা। এখানে NULL রাখা
                boolean চলে, কিন্তু তখন প্রতিটা Query তে IS TRUE বা IS NOT TRUE সাবধানে লিখতে হয়। অনেক দল এমন ক্ষেত্রে তিন
                মানের একটা তালিকাই পছন্দ করে: yes, no, not_asked। পড়তে পরিষ্কার, ভুল গোনার সুযোগ কম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পরিস্থিতি", "boolean দিয়ে", "ভালো বিকল্প"],
          rows: [
            ["সত্যিই হ্যাঁ বা না, অজানা অর্থহীন", "boolean NOT NULL DEFAULT false", "এটাই ঠিক, boolean রাখুন"],
            ["একটা জিনিসের একটাই অবস্থা, তিন বা বেশি রকম", "is_paid, is_refunded, is_failed", "একটা status Column, তালিকা থেকে মান"],
            ["ঘটনা ঘটেছে কিনা, আর কখন", "is_cancelled", "cancelled_at timestamptz, NULL মানে ঘটেনি"],
            ["হ্যাঁ, না, আর এখনো জানা নেই", "NULL রাখা boolean", "তিন মানের তালিকা, অথবা খুব সাবধানে NULL"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "what-is-uuid",
      subHeader: { index: "006", title: "What a UUID Is" },
      title: <SectionTitle>uuid: এমন একটা নাম, যা আর কারও নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ব্যাংকের লাইনে দাঁড়ালে একটা টোকেন দেয়: 41, 42, 43। ছোট, পড়তে সহজ, আর একটা কাউন্টার থেকে আসে বলে কখনো একই
                নম্বর দুজন পায় না। এখন পর্যন্ত Island Tours এর সব id এমন: GENERATED ALWAYS AS IDENTITY, 1, 2, 3 করে। কিন্তু
                টোকেনের দুটো দুর্বলতা আছে। এক, পরের নম্বরটা সবাই জানে: 42 এর পরে 43। দুই, নম্বর দিতে পারে শুধু সেই একটা
                কাউন্টার। দুটো শাখা আলাদা করে টোকেন দিলে দুজনই 42 পাবেন।
              </ContentParagraph>
              <ContentParagraph>
                UUID মানে Universally Unique Identifier, সারা পৃথিবীতে অনন্য একটা পরিচয়। এটা ১২৮ Bit এর একটা সংখ্যা, লেখা হয়
                ৩২টা Hex অঙ্কে (0 থেকে 9 আর a থেকে f), পাঁচ ভাগে, মাঝে হাইফেন: ৮টা, ৪টা, ৪টা, ৪টা, ১২টা। যেমন{" "}
                <code className={CODE}>a69655ac-fb1c-4f2d-9860-ec3bd1265430</code>। কিছু System এ একে GUID বলে, Globally
                Unique Identifier, মানে একই জিনিস। PostgreSQL এর uuid Type এই ১২৮ Bit কে ১৬ Byte এ জমা রাখে।
              </ContentParagraph>
              <ContentParagraph>
                এর জাদুটা হলো আকারে। ১২৮ Bit এ এত বেশি সম্ভাব্য মান যে এলোমেলোভাবে বানানো দুটো UUID মিলে যাওয়ার আশা কার্যত
                শূন্য, কোনো কাউন্টার ছাড়াই। তাই আপনার App, একজন Customer এর ফোন, বা অন্য একটা Database, যে কেউ নিজে নিজে
                UUID বানাতে পারে, কাউকে জিজ্ঞেস না করেই। PostgreSQL এর Documentation ও এই কথাই বলে: একটা Sequence শুধু
                একটা Database এর ভেতরে অনন্য, UUID সবখানে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GuessableIdDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে UUID কোথায় কাজে লাগে? তিনটা চেনা জায়গায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>বাইরের মানুষ যে পরিচয় দেখেন:</strong> Ticket এর Link, Invoice এর নম্বর, ফাইল ডাউনলোডের ঠিকানা। ক্রমিক
                  নম্বর থাকলে ফারহানার মতো যে কেউ পরের নম্বর চেষ্টা করতে পারেন, আর প্রতিদিন কত Booking হচ্ছে সেটাও প্রতিযোগীরা
                  নম্বর দেখে আন্দাজ করতে পারেন। UUID এ পাশের মান বলে কিছু নেই।
                </ListItem>
                <ListItem>
                  <strong>Database এর বাইরে আগে থেকে id দরকার:</strong> App একটা Booking আর তার Payment একসাথে বানাতে চায়, Database
                  এ পাঠানোর আগেই দুটোকে একই id দিয়ে জুড়তে চায়। অথবা ফোনের App ইন্টারনেট ছাড়া Booking নেয়, পরে Server এ পাঠায়।
                </ListItem>
                <ListItem>
                  <strong>কয়েকটা Database এর Data মেলানো:</strong> ঢাকা আর চট্টগ্রামের দুটো অফিস আলাদা Database চালালে দুই জায়গাতেই
                  Booking 42 থাকবে। UUID হলে একসাথে মেলালেও কোনো সংঘর্ষ নেই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "UUID তালা নয়",
          content: (
            <ContentParagraph>
              ফারহানার ঘটনার আসল সমাধান UUID না, অনুমতি যাচাই। Server কে প্রতিটা Request এ দেখতে হবে, যিনি Ticket টা চাইছেন,
              সেটা আসলে তাঁর কিনা। UUID শুধু আন্দাজ করাটা অসম্ভব করে দেয়। কিন্তু Link একবার কারও হাতে গেলে, চ্যাটে বা
              স্ক্রিনশটে, তিনি সেটা খুলতে পারবেন, যদি না Server বাধা দেয়। তাই দুটোই লাগে: আন্দাজ করা যায় না এমন পরিচয়,
              আর প্রতিবার মালিকানা যাচাই। নিরাপত্তার এই দিকটা Module 16 এ বিস্তারিত।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার হাতে কলমে। PostgreSQL এ এলোমেলো UUID বানায় <code className={CODE}>gen_random_uuid()</code>। নিচের বক্সে
              দুটো বানান, তারপর দেখুন uuid কোন কোন লেখা গ্রহণ করে, আর text হিসেবে রাখলে কত জায়গা লাগে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম UUID"
              query={`SELECT gen_random_uuid() AS first_id, gen_random_uuid() AS second_id;

-- একই UUID তিনভাবে লেখা
SELECT 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11'::uuid   AS upper_case,
       '{a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11}'::uuid AS braces,
       'a0eebc999c0b4ef8bb6d6bb9bd380a11'::uuid       AS no_hyphens;

-- uuid আর text, কত Byte
DROP TABLE IF EXISTS buenum_sizes;
CREATE TABLE buenum_sizes (as_uuid uuid, as_text text);
INSERT INTO buenum_sizes VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
SELECT pg_column_size(as_uuid) AS uuid_bytes,
       pg_column_size(as_text) AS text_bytes
FROM buenum_sizes;`}
              caption="প্রথম ফলাফলের দুটো মান প্রতিবার Run এ নতুন, তাই আপনার পর্দায় যা দেখছেন তা আর কেউ কখনো দেখবেন না। দ্বিতীয় ফলাফলে তিনটা Column এ হুবহু একই লেখা: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11, ছোট হাতের অক্ষরে, হাইফেন সহ। শেষ ফলাফলে uuid_bytes 16, text_bytes 37।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো জিনিস লক্ষ করুন। প্রথমত, uuid Type ঢোকার সময় বড় হাতের অক্ষর, বন্ধনী, হাইফেন ছাড়া লেখা সব গ্রহণ করে,
                কিন্তু ফেরত দেয় সবসময় একটাই চেহারায়। boolean এর মতোই: ঢোকার পথে অনেক রকম, জমা থাকে একটা মান। তাই{" "}
                <code className={CODE}>WHERE ticket_ref = &apos;A0EE...&apos;</code> আর ছোট হাতের লেখা একই Row খুঁজে পায়।
                text Column এ রাখলে এই দুটো আলাদা লেখা হতো, আর খোঁজা ব্যর্থ হতো।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়ত, জায়গা। uuid হিসেবে ১৬ Byte, একই জিনিস text হিসেবে ৩৭ Byte, দ্বিগুণের বেশি। লাখ লাখ Row আর তার
                উপরের Index মিলিয়ে এই পার্থক্য বড় হয়ে যায়। তাই UUID কখনো text এ রাখবেন না। তবে তুলনাটা integer এর সাথেও
                করুন: integer ৪ Byte, bigint ৮ Byte। UUID বিনামূল্যে আসে না, কিন্তু text এর চেয়ে অনেক সস্তা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা অঙ্ক কম"
              query={`SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1'::uuid;`}
              caption="ERROR: invalid input syntax for type uuid, সেই চেনা 22P02। শেষ ভাগে ১২টার জায়গায় ১১টা অঙ্ক। uuid Column এ ভুল দৈর্ঘ্য, ভুল অক্ষর (যেমন g বা z) কিছুই ঢুকতে পারে না। text Column এ পারত।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "making-uuids",
      subHeader: { index: "007", title: "Making UUIDs: v4 and v7" },
      title: <SectionTitle>gen_random_uuid() আর uuidv7()</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                UUID বানানোর নিয়ম একটা না, কয়েকটা, প্রতিটার একটা Version নম্বর আছে। আজকের মান RFC 9562 নামের নথিতে লেখা,
                সেখানে আটটা Version। রোজকার কাজে আপনার দরকার মাত্র দুটো: Version 4, যেটা পুরো এলোমেলো, আর Version 7, যেটার
                শুরুতে সময় বসানো। প্রতিটা UUID নিজের Version নিজের গায়ে লিখে রাখে: তৃতীয় ভাগের প্রথম অঙ্কটাই Version।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>gen_random_uuid():</strong> Version 4, PostgreSQL 13 থেকে কোনো Extension ছাড়াই আছে। তার আগে UUID
                  বানাতে uuid-ossp বা pgcrypto নামের Extension লাগত, পুরনো Tutorial এ সেই কারণেই ওগুলো দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>uuidv4():</strong> PostgreSQL 18 এ যোগ হওয়া একই কাজের দ্বিতীয় নাম, যাতে লেখা দেখেই Version বোঝা যায়।
                </ListItem>
                <ListItem>
                  <strong>uuidv7():</strong> Version 7, PostgreSQL 18 এ নতুন। প্রথম ৪৮ Bit এ বানানোর মুহূর্ত, 1970 থেকে গোনা
                  মিলিসেকেন্ডে, তারপর মিলিসেকেন্ডের ভগ্নাংশ, বাকিটা এলোমেলো। চাইলে{" "}
                  <code className={CODE}>uuidv7(interval &apos;-1 day&apos;)</code> লিখে সময়টা সরিয়েও নেওয়া যায়।
                </ListItem>
                <ListItem>
                  <strong>uuid_extract_version() আর uuid_extract_timestamp():</strong> PostgreSQL 17 থেকে। প্রথমটা Version
                  বলে, দ্বিতীয়টা v7 (বা পুরনো v1) থেকে বানানোর সময় বের করে, v4 হলে NULL দেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই Page এর Query বক্স PostgreSQL 18 চালায়, তাই চারটা Function ই এখানে আছে। নিচের ছবিতে দুটো আসল মান, অঙ্ক ধরে
                ধরে ভাঙা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UuidAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা UUID কে প্রশ্ন করা"
              query={`SELECT uuid_extract_timestamp('01a14992-63d6-75d9-b2d2-4004355f555e') AS made_at,
       uuid_extract_version('01a14992-63d6-75d9-b2d2-4004355f555e')   AS v7_version,
       uuid_extract_version('a69655ac-fb1c-4f2d-9860-ec3bd1265430')   AS v4_version,
       uuid_extract_timestamp('a69655ac-fb1c-4f2d-9860-ec3bd1265430') AS v4_time;

SELECT uuidv7() AS now_id,
       uuid_extract_timestamp(uuidv7(interval '-1 day')) AS yesterday_time;`}
              caption="প্রথম ফলাফল সবসময় একই: made_at 2026-10-17 17:14:53.014+06, v7_version 7, v4_version 4, v4_time ফাঁকা, কারণ v4 এ কোনো সময় নেই। দ্বিতীয় ফলাফল আপনার Run এর মুহূর্তের উপর নির্ভর করে: now_id এর শুরু আজকের সময় থেকে, yesterday_time ঠিক চব্বিশ ঘণ্টা আগের।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আসল পার্থক্যটা। v7 এর শুরুতে সময়, আর সময় শুধু সামনে এগোয়। তাই পরপর বানানো v7 গুলো মান হিসেবেও বড় হতে
                থাকে: সাজালে তৈরির ক্রমেই সাজে। v4 পুরো এলোমেলো, সাজালে ক্রম হারিয়ে যায়। নিচের বক্সে একই কাজ দুইভাবে: পাঁচটা
                Row, প্রতিটার পাশে একটা UUID, তারপর UUID অনুযায়ী সাজানো। n হলো কোনটা কত নম্বরে তৈরি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সাজালে কী হয়"
              query={`SELECT n, gen_random_uuid() AS v4
FROM generate_series(1, 5) AS n
ORDER BY v4;

SELECT n, uuidv7() AS v7
FROM generate_series(1, 5) AS n
ORDER BY v7;`}
              caption="প্রথম ফলাফলে n এর ক্রম এলোমেলো, প্রতিবার Run এ আলাদা। দ্বিতীয় ফলাফলে n সবসময় 1, 2, 3, 4, 5: v7 অনুযায়ী সাজানো মানেই তৈরির ক্রমে সাজানো। আরেকটা জিনিস দেখুন: দ্বিতীয় ফলাফলের পাঁচটা মানের শুরুর বারোটা অঙ্ক প্রায় একই, কারণ সবগুলো একই মিলিসেকেন্ডের আশেপাশে তৈরি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UuidOrderLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই পার্থক্য কেন গুরুত্বপূর্ণ? uuid Column এ সাধারণত একটা Index থাকে, বিশেষ করে যখন সেটা Primary Key। Index
                মানগুলোকে সাজিয়ে রাখে, অনেকটা অভিধানের মতো। v7 এ নতুন মান সবসময় শেষে বসে, তাই Index শুধু এক কিনারে বাড়ে,
                যেন অভিধানের শেষ পাতায় নতুন শব্দ লেখা। v4 এ নতুন মান যেকোনো পাতায় ঢোকে, তাই পুরনো পাতাগুলো বারবার খুলতে আর
                ভাগ করতে হয়। ছোট Table এ এটা টেরই পাবেন না। কোটি Row আর প্রতি সেকেন্ডে অনেক INSERT হলে পার্থক্যটা চোখে পড়ে।
                Primary Key হিসেবে uuid এর পুরো হিসাব{" "}
                <Link href="/sql/topic/primary-keys" className={LINK}>
                  Lesson 08
                </Link>{" "}
                এ, আর Index এর ভেতরের গল্প Module 13 এ।
              </ContentParagraph>
              <ContentParagraph>
                তবে v7 এর একটা দাম আছে, ছবিতেই দেখেছেন: মান দেখেই যে কেউ জেনে যান কখন তৈরি হয়েছে। Customer এর অ্যাকাউন্ট কবে
                খোলা হলো, একটা ফাইল কবে আপলোড হলো, এসব কখনো কখনো গোপন রাখার মতো তথ্য। যে পরিচয় বাইরের মানুষ দেখবেন আর যেখানে
                সময় ফাঁস হওয়া সমস্যা, সেখানে v4। যেখানে Database এর ভেতরের কাজ আর লেখার গতি গুরুত্বপূর্ণ, সেখানে v7।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "gen_random_uuid() / uuidv4()", "uuidv7()"],
          rows: [
            ["Version", "4", "7"],
            ["কবে থেকে PostgreSQL এ", "gen_random_uuid 13 থেকে, uuidv4 18 থেকে", "18 থেকে"],
            ["ভেতরে কী", "প্রায় পুরোটা এলোমেলো (১২২ Bit)", "শুরুতে মিলিসেকেন্ডের সময়, বাকিটা এলোমেলো"],
            ["সাজালে", "তৈরির ক্রম হারায়", "তৈরির ক্রমেই সাজে"],
            ["Index এ নতুন মান", "যেকোনো জায়গায়", "শেষে"],
            ["মান দেখে সময় জানা যায়", "না", "হ্যাঁ, uuid_extract_timestamp() দিয়ে"],
            ["ভালো কোথায়", "বাইরের মানুষ দেখেন এমন Token, যেখানে সময় গোপন", "অনেক INSERT হয় এমন Table এর Key"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষে পুরনো পথটা। অনেক পুরনো Project এ এখনো <code className={CODE}>uuid-ossp</code> Extension আর{" "}
              <code className={CODE}>uuid_generate_v4()</code> দেখবেন। সেটা কাজ করে, কিন্তু PostgreSQL 13 থেকে v4 এর জন্য আর
              দরকার নেই। এই Page এর Query বক্স শুধু ছয়টা নির্দিষ্ট Extension চালাতে পারে, uuid-ossp তাদের মধ্যে নেই। নিচের
              বক্সে চেষ্টা করে দেখুন কী বলে, তারপর একটা আসল PostgreSQL 18 Server এর psql এ একই কাজ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এখানে uuid-ossp নেই"
              query={`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`}
              caption="ERROR: extension uuid-ossp is not available, সাথে HINT: The extension must first be installed on the system where PostgreSQL is running। এটা এই বক্সের সীমা, আপনার নিজের PostgreSQL এর না। Docker এর postgres:18 Image এ uuid-ossp আগে থেকেই আছে, নিচে তার আসল Output।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql-postgres-18-uuid-ossp.sql",
          code: `-- postgres:18 Container এর psql, PostgreSQL 18.6
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION

SELECT uuid_generate_v4() AS v4, uuid_generate_v1() AS v1;
--                   v4                  |                  v1
-- --------------------------------------+--------------------------------------
--  ac00b00c-aebe-4d85-9667-853fa48cd049 | d85b4ac0-ca1c-11f1-ad99-ca60d79ec83e

SELECT uuid_extract_version(uuid_generate_v1()) AS v,
       uuid_extract_timestamp(uuid_generate_v1()) AS ts;
--  v |              ts
-- ---+-------------------------------
--  1 | 2026-10-17 17:21:06.295424+06

-- v4 আর v1 এর মান প্রতিবার নতুন; Version আর সময়ের ধরনটা লক্ষ করুন`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Version 1 কেন এড়াবেন",
          content: (
            <ContentParagraph>
              uuid-ossp এর Documentation নিজেই সাবধান করে: uuid_generate_v1() বানানোর সময় Computer এর MAC Address আর সময়
              ব্যবহার করে, তাই মান দেখে বোঝা যায় কোন যন্ত্রে আর কখন তৈরি। নতুন কাজে v1 এর দরকার নেই। এলোমেলো চাইলে
              gen_random_uuid(), সময় অনুযায়ী সাজানো চাইলে uuidv7()। MySQL এর UUID() ও Version 1 দেয়, অংশ 013 এ দেখবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "uuid-column",
      subHeader: { index: "008", title: "A uuid Column" },
      title: <SectionTitle>Table এ uuid Column বসানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                uuid Column এর সবচেয়ে চেনা রূপ হলো <code className={CODE}>uuid NOT NULL DEFAULT gen_random_uuid()</code>।
                DEFAULT মানে INSERT এ Column টার নাম না বললে PostgreSQL নিজেই একটা UUID বানিয়ে বসিয়ে দেয়। কিন্তু App চাইলে
                নিজের বানানো UUID ও পাঠাতে পারে, তখন DEFAULT চুপ থাকে। এই দুটো পথ একসাথে খোলা থাকাটাই UUID এর বড় সুবিধা।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে তানিমের Ticket Table এর নতুন রূপের প্রথম ধাপ: ticket_no এর জায়গায় ticket_ref। দুটো Row এ নিজে
                থেকে, একটায় App এর পাঠানো বড় হাতের UUID। তারপর বন্ধনী দেওয়া চেহারায় সেটা খুঁজে দেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DEFAULT gen_random_uuid()"
              query={`DROP TABLE IF EXISTS buenum_tickets;
CREATE TABLE buenum_tickets (
  ticket_ref uuid NOT NULL DEFAULT gen_random_uuid(),
  passenger  text NOT NULL
);

-- ticket_ref না বললে PostgreSQL নিজে বানায়
INSERT INTO buenum_tickets (passenger) VALUES ('Rahim Uddin'), ('Nusrat Jahan');

-- App নিজের বানানো UUID পাঠাতে পারে
INSERT INTO buenum_tickets (ticket_ref, passenger)
VALUES ('A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11', 'Tanvir Ahmed');

SELECT ticket_ref, passenger FROM buenum_tickets;

SELECT passenger
FROM buenum_tickets
WHERE ticket_ref = '{a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11}';`}
              caption="প্রথম ফলাফলে ৩টা Row। প্রথম দুটোর ticket_ref এলোমেলো, প্রতিবার নতুন। তৃতীয়টায় a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11, ছোট হাতের অক্ষরে, যদিও পাঠানো হয়েছিল বড় হাতে। দ্বিতীয় ফলাফলে ১টা Row: Tanvir Ahmed, বন্ধনী দেওয়া লেখাতেও খুঁজে পাওয়া গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="uuid কে সংখ্যার সাথে তুলনা"
              query={`SELECT passenger FROM buenum_tickets WHERE ticket_ref = 5;`}
              caption="ERROR: operator does not exist: uuid = integer, সাথে HINT: You might need to add explicit type casts। আগের বক্স চালানো না থাকলে আগে সেটা চালান। পুরনো Code এ যেখানে id ছিল সংখ্যা, uuid এ বদলানোর পরে এমন Query এই Error দেয়, আর সেটা ভালো: চুপচাপ ভুল উত্তরের চেয়ে জোরে Error অনেক ভালো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DEFAULT এ কোনটা বসাবেন, gen_random_uuid() নাকি uuidv7()? আগের অংশের তুলনাই উত্তর। Table এ যদি অনেক Row আসে আর
                uuid Column টাই Key, uuidv7()। যদি মানটা বাইরের মানুষ দেখবেন আর তৈরির সময় জানানো ঠিক না, gen_random_uuid()।
                অনেক দল দুটোই রাখে: ভেতরের Key একটা, বাইরে দেখানোর Token আলাদা।
              </ContentParagraph>
              <ContentParagraph>
                একটা ছোট কিন্তু কাজের তথ্য: information_schema তে column_default পড়লে DEFAULT এর লেখাটা দেখা যায়, যেমন{" "}
                <code className={CODE}>gen_random_uuid()</code>। boolean এর DEFAULT লিখুন <code className={CODE}>false</code>{" "}
                বা <code className={CODE}>&apos;no&apos;</code>, PostgreSQL দুটোকেই বুঝে <code className={CODE}>false</code>{" "}
                হিসেবে জমা রাখে, column_default এ দেখায় false। পরের Exercise এর Check ঠিক এটাই পড়ে।
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
              starter={`DROP TABLE IF EXISTS ex3_buenum_vouchers;

-- এখানে CREATE TABLE ex3_buenum_vouchers লিখুন

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'ex3_buenum_vouchers'
ORDER BY ordinal_position;`}
              task={
                <>
                  Island Tours উপহার Voucher বিক্রি শুরু করছে। <code className={CODE}>ex3_buenum_vouchers</code> নামে একটা Table
                  বানান, এই ক্রমে তিনটা Column: <code className={CODE}>voucher_code</code> uuid, ফাঁকা রাখা যাবে না, নিজে থেকে
                  gen_random_uuid() দিয়ে ভরবে; <code className={CODE}>amount_bdt</code> numeric(10, 2), ফাঁকা রাখা যাবে না;{" "}
                  <code className={CODE}>is_redeemed</code> boolean, ফাঁকা রাখা যাবে না, শুরুতে false। শেষের Check Query টা
                  যেমন আছে তেমনই রাখুন।
                </>
              }
              hint={
                <>
                  তিনটা Column এই ছাঁচে: <code className={CODE}>নাম Type NOT NULL DEFAULT মান</code>। amount_bdt এ DEFAULT নেই।
                  DEFAULT এ Function বসাতে বন্ধনী সহ লিখুন: <code className={CODE}>gen_random_uuid()</code>।
                </>
              }
              solution={`SELECT * FROM (VALUES
  ('voucher_code', 'uuid', 'NO', 'gen_random_uuid()'),
  ('amount_bdt', 'numeric', 'NO', NULL),
  ('is_redeemed', 'boolean', 'NO', 'false')
) AS v(column_name, data_type, is_nullable, column_default);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "enum-types",
      subHeader: { index: "009", title: "enum Types" },
      title: <SectionTitle>enum: শুধু তালিকার মানগুলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ওয়েবসাইটের Form এর Dropdown মেনুর কথা ভাবুন। “বসার শ্রেণি” লেখা ঘরে ক্লিক করলে তিনটা বিকল্প: deck,
                economy, cabin। এর বাইরে কিছু লেখার উপায় নেই, তাই cabn বা Cabin এর মতো বানান আসতেই পারে না। enum, পুরো নাম
                enumerated type, Database এর ভেতরে ঠিক এই Dropdown। আপনি একবার বলে দেন কোন কোন মান চলবে, PostgreSQL সেই
                তালিকা দিয়ে একটা নতুন Type বানায়, আর যেকোনো Column সেই Type নিতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                এখন পর্যন্ত আপনি শুধু PostgreSQL এর দেওয়া Type ব্যবহার করেছেন: integer, text, boolean। enum প্রথম Type যেটা
                আপনি নিজে বানান, <code className={CODE}>CREATE TYPE</code> দিয়ে। ধাপ দুটো: আগে Type, তারপর সেই Type দিয়ে
                Column।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "enum-anatomy.sql",
          code: `-- ধাপ ১: Type বানান, মানগুলো যে ক্রমে লিখবেন সেটাই তাদের ক্রম
CREATE TYPE buenum_seat_class AS ENUM ('deck', 'economy', 'cabin');

-- ধাপ ২: যেকোনো Column এ সেই Type
CREATE TABLE buenum_cabins (
  passenger  text NOT NULL,
  seat_class buenum_seat_class NOT NULL
);`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম enum"
              query={`DROP TABLE IF EXISTS buenum_cabins;
DROP TYPE IF EXISTS buenum_seat_class;

CREATE TYPE buenum_seat_class AS ENUM ('deck', 'economy', 'cabin');
CREATE TABLE buenum_cabins (
  passenger  text NOT NULL,
  seat_class buenum_seat_class NOT NULL
);

INSERT INTO buenum_cabins VALUES
  ('Rahim', 'cabin'), ('Nusrat', 'deck'), ('Tanvir', 'economy'), ('Farhana', 'deck');

SELECT passenger, seat_class
FROM buenum_cabins
ORDER BY seat_class, passenger;`}
              caption="৪টা Row: Farhana deck, Nusrat deck, Tanvir economy, Rahim cabin। ক্রমটা লক্ষ করুন: বর্ণমালায় cabin আগে আসত, কিন্তু এখানে deck আগে, cabin শেষে, কারণ Type বানানোর সময় সেই ক্রমে লেখা হয়েছিল। শুরুতে DROP TABLE আগে, DROP TYPE পরে: Table টা Type এর উপর নির্ভর করে, তাই আগে Table সরাতে হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার তালিকার বাইরের কিছু ঢোকানোর চেষ্টা। দুটো জিনিস দেখার আছে: সম্পূর্ণ নতুন শব্দ, আর চেনা শব্দ কিন্তু বড় হাতের
              অক্ষরে। boolean অক্ষরের ছাঁদ নিয়ে মাথা ঘামায় না, enum ঘামায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তালিকার বাইরে"
              query={`INSERT INTO buenum_cabins VALUES ('Sabbir', 'Cabin');`}
              caption="ERROR: invalid input value for enum buenum_seat_class: Cabin, SQLSTATE 22P02। আগের বক্স চালানো না থাকলে আগে সেটা চালান। Cabin আর cabin enum এর চোখে দুটো আলাদা লেখা, আর তালিকায় আছে শুধু ছোট হাতেরটা। 'Cabin' এর জায়গায় 'first' লিখে দেখুন, একই Error।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভেতরে কী জমা থাকে? প্রতিটা Row এ লেখাটা না, একটা ৪ Byte এর ইশারা, যেটা Database এর একটা তালিকার দিকে দেখায়।
                সেই তালিকার নাম <code className={CODE}>pg_enum</code>, PostgreSQL এর একটা System Catalog, মানে Database নিজের
                সম্পর্কে যে Table গুলোতে তথ্য রাখে। তাই cabin হোক বা private_cabin, প্রতিটা Row এ জায়গা একই: ৪ Byte। একেকটা
                মানের লেখা সর্বোচ্চ ৬৩ Byte পর্যন্ত হতে পারে, আর মানগুলো case sensitive, ফাঁকা জায়গাও গোনা হয়।
              </ContentParagraph>
              <ContentParagraph>
                psql এ <code className={CODE}>\dT+</code> লিখলে আপনার বানানো Type গুলো দেখা যায়। আসল PostgreSQL 18 এ এই লেসনের
                Type টার জন্য Output:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql-dT-plus.txt",
          code: `island_tours=# \\dT+ buenum_seat_class
                                              List of data types
 Schema |       Name        |   Internal name   | Size | Elements |  Owner   | Access privileges | Description
--------+-------------------+-------------------+------+----------+----------+-------------------+-------------
 public | buenum_seat_class | buenum_seat_class | 4    | deck    +| postgres |                   |
        |                   |                   |      | economy +|          |                   |
        |                   |                   |      | cabin    |          |                   |
(1 row)`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              orderMatters
              starter={`DROP TABLE IF EXISTS ex4_buenum_cabins;
DROP TYPE IF EXISTS ex4_buenum_seat_class;

-- এখানে CREATE TYPE আর CREATE TABLE লিখুন

INSERT INTO ex4_buenum_cabins VALUES ('Rahim', 'cabin'), ('Nusrat', 'deck'), ('Tanvir', 'economy');

SELECT passenger, seat_class, pg_typeof(seat_class)::text AS type
FROM ex4_buenum_cabins
ORDER BY seat_class;`}
              task={
                <>
                  একটা enum Type বানান <code className={CODE}>ex4_buenum_seat_class</code>, তিনটা মান সস্তা থেকে দামি ক্রমে:
                  deck, economy, cabin। তারপর <code className={CODE}>ex4_buenum_cabins</code> Table: passenger text, ফাঁকা নয়;
                  seat_class সেই enum, ফাঁকা নয়। INSERT আর শেষের Check Query যেমন আছে রাখুন। ঠিক হলে Check এর ফলাফল সস্তা
                  থেকে দামি ক্রমে আসবে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>CREATE TYPE ex4_buenum_seat_class AS ENUM (...)</code>, মানগুলো একক উদ্ধৃতিতে, সঠিক
                  ক্রমে। Type না বানিয়ে text আর CHECK দিলে সাজানো হবে বর্ণমালায়, আর type Column এ text আসবে।
                </>
              }
              solution={`SELECT * FROM (VALUES
  ('Nusrat', 'deck', 'ex4_buenum_seat_class'),
  ('Tanvir', 'economy', 'ex4_buenum_seat_class'),
  ('Rahim', 'cabin', 'ex4_buenum_seat_class')
) AS v(passenger, seat_class, type);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "enum-order",
      subHeader: { index: "010", title: "Order and Catalog" },
      title: <SectionTitle>enum এর ক্রম, তুলনা আর ভেতরের তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                enum এর সবচেয়ে কাজের গুণ তার ক্রম। মানগুলো যে ক্রমে ঘোষণা করেছেন, সেটাই তাদের বড় ছোটর হিসাব। তাই ORDER BY
                ঘোষণার ক্রমে সাজায়, আর <code className={CODE}>&lt;</code>, <code className={CODE}>&gt;</code>,{" "}
                <code className={CODE}>min()</code>, <code className={CODE}>max()</code> সবই সেই ক্রম মানে।{" "}
                <code className={CODE}>seat_class &gt; &apos;deck&apos;</code> মানে deck এর চেয়ে দামি সব শ্রেণি। text Column এ
                এই প্রশ্ন বর্ণমালা দিয়ে বিচার হতো, যার কোনো ব্যবসায়িক মানে নেই।
              </ContentParagraph>
              <ContentParagraph>
                তালিকাটা পড়ার তিনটা Function আছে: <code className={CODE}>enum_range()</code> পুরো তালিকা একটা Array তে দেয়,{" "}
                <code className={CODE}>enum_first()</code> আর <code className={CODE}>enum_last()</code> প্রথম আর শেষ মান। এগুলো
                Type জানতে চায়, Row না, তাই লেখা হয় <code className={CODE}>NULL::buenum_seat_class</code>: “এই Type এর একটা
                ফাঁকা মান”, শুধু Type টা জানানোর জন্য। আর pg_enum সরাসরি পড়লে প্রতিটা মানের ক্রমের চাবি দেখা যায়, নাম{" "}
                <code className={CODE}>enumsortorder</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ঘোষণার ক্রম"
              query={`DROP TABLE IF EXISTS buenum_cabins;
DROP TYPE IF EXISTS buenum_seat_class;
CREATE TYPE buenum_seat_class AS ENUM ('deck', 'economy', 'cabin');
CREATE TABLE buenum_cabins (passenger text NOT NULL, seat_class buenum_seat_class NOT NULL);
INSERT INTO buenum_cabins VALUES
  ('Rahim', 'cabin'), ('Nusrat', 'deck'), ('Tanvir', 'economy'), ('Farhana', 'deck');

-- deck এর চেয়ে দামি শ্রেণির যাত্রী
SELECT passenger FROM buenum_cabins WHERE seat_class > 'deck' ORDER BY passenger;

SELECT min(seat_class) AS cheapest, max(seat_class) AS dearest FROM buenum_cabins;

SELECT enum_range(NULL::buenum_seat_class) AS all_values,
       enum_first(NULL::buenum_seat_class) AS first_value,
       enum_last(NULL::buenum_seat_class)  AS last_value;

SELECT enumlabel, enumsortorder
FROM pg_enum
WHERE enumtypid = 'buenum_seat_class'::regtype
ORDER BY enumsortorder;`}
              caption="প্রথম ফলাফলে ২টা নাম: Rahim, Tanvir। দ্বিতীয়টায় cheapest deck, dearest cabin। তৃতীয়টায় {deck,economy,cabin}, deck, cabin। চতুর্থটায় ৩টা Row: deck 1, economy 2, cabin 3। এই সংখ্যাগুলোই ক্রমের আসল চাবি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ক্রমের সাথে আসে কড়াকড়ি। প্রতিটা enum একটা আলাদা Type, তাই দুটো আলাদা enum এর মান তুলনা করা যায় না, দুটোতেই
                cabin নামের মান থাকলেও। একইভাবে text Column এর সাথে enum Column সরাসরি মেলানো যায় না। PostgreSQL এর
                Documentation একে বলে Type Safety। দুটো জায়গাতেই উপায় একটা: দুই পাশকেই text বানিয়ে তুলনা করুন, যেমন{" "}
                <code className={CODE}>seat_class::text</code>। মনে রাখবেন, text বানালে ক্রমটাও text এর হয়ে যায়, মানে বর্ণমালার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো enum, একই শব্দ"
              query={`DROP TYPE IF EXISTS buenum_e1;
DROP TYPE IF EXISTS buenum_e2;
CREATE TYPE buenum_e1 AS ENUM ('cabin');
CREATE TYPE buenum_e2 AS ENUM ('cabin');

SELECT 'cabin'::buenum_e1::text = 'cabin'::buenum_e2::text AS same_text;

SELECT 'cabin'::buenum_e1 = 'cabin'::buenum_e2 AS same_value;`}
              caption="প্রথম Query তে same_text t, কারণ দুই পাশই text। দ্বিতীয়টায় ERROR: operator does not exist: buenum_e1 = buenum_e2। একই বানান, কিন্তু PostgreSQL এর কাছে দুটো আলাদা জগতের মান। Island Tours এর bookings.status এর মতো text Column কে কোনো enum Column এর সাথে JOIN করতেও একই Error আসে, তখন enum পাশে ::text বসান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "উদ্ধৃতির লেখা কেন নিজে থেকে চলে",
          content: (
            <ContentParagraph>
              <code className={CODE}>WHERE seat_class = &apos;deck&apos;</code> লিখলে Error আসে না, কারণ উদ্ধৃতির ভেতরের লেখার
              শুরুতে কোনো Type থাকে না, PostgreSQL পাশের Column দেখে সেটাকে enum হিসেবে পড়ে নেয়। কিন্তু একটা text Column, বা
              CASE এর মতো একটা Expression যার ফল ইতিমধ্যে text, সেটা নিজে থেকে enum হয় না। এই পার্থক্যটা অংশ 016 এর একটা
              চেনা ভুলের মূলে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "changing-enum",
      subHeader: { index: "011", title: "Changing an enum" },
      title: <SectionTitle>enum বদলানো: যোগ করা সহজ, মোছা কঠিন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ব্যবসা বদলায়, তালিকাও বদলায়। জাহাজ কোম্পানি একদিন business শ্রেণি চালু করবে, cabin এর নাম বদলে private_cabin
                রাখবে। enum বদলানোর Command হলো <code className={CODE}>ALTER TYPE</code>, আর তার তিনটা রূপ এখানে কাজের:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>ADD VALUE &apos;নতুন&apos;</code>: নতুন মান, জায়গা না বললে একদম শেষে।
                </ListItem>
                <ListItem>
                  <code className={CODE}>ADD VALUE &apos;নতুন&apos; BEFORE &apos;পুরনো&apos;</code> বা{" "}
                  <code className={CODE}>AFTER</code>: নির্দিষ্ট জায়গায়। <code className={CODE}>IF NOT EXISTS</code> লিখলে মানটা
                  আগে থেকে থাকলে Error এর বদলে শুধু একটা NOTICE।
                </ListItem>
                <ListItem>
                  <code className={CODE}>RENAME VALUE &apos;পুরনো&apos; TO &apos;নতুন&apos;</code>: নাম বদল, জায়গা একই থাকে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এ প্রতিটা Statement এর পরে pg_enum এর আসল অবস্থা দেখুন। বিশেষ করে enumsortorder এর সংখ্যাগুলো লক্ষ
                করুন: মাঝখানে বসানোর জন্য PostgreSQL ভগ্নাংশ ব্যবহার করে, যাতে পুরনো কোনো মানের নম্বর বদলাতে না হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <EnumChangeLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ADD VALUE আর RENAME VALUE"
              query={`DROP TABLE IF EXISTS buenum_cabins;
DROP TYPE IF EXISTS buenum_seat_class;
CREATE TYPE buenum_seat_class AS ENUM ('economy', 'cabin');

ALTER TYPE buenum_seat_class ADD VALUE 'suite';
ALTER TYPE buenum_seat_class ADD VALUE 'deck' BEFORE 'economy';
ALTER TYPE buenum_seat_class ADD VALUE 'business' AFTER 'economy';
ALTER TYPE buenum_seat_class ADD VALUE IF NOT EXISTS 'deck';
ALTER TYPE buenum_seat_class RENAME VALUE 'cabin' TO 'private_cabin';

SELECT enumlabel, enumsortorder
FROM pg_enum
WHERE enumtypid = 'buenum_seat_class'::regtype
ORDER BY enumsortorder;

ALTER TYPE buenum_seat_class ADD VALUE 'deck';`}
              caption="pg_enum এ ৫টা Row: deck 0, economy 1, business 1.5, private_cabin 2, suite 3। IF NOT EXISTS সহ deck আবার যোগ করায় কিছু হয়নি। শেষের লাইনে IF NOT EXISTS নেই, তাই ERROR: enum label deck already exists, SQLSTATE 42710।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার উল্টো দিক। একটা মান মুছতে চাইলে কী হবে? PostgreSQL এর Documentation সোজা বলে দেয়: enum থেকে মান সরানো
                যায় না, ক্রমও বদলানো যায় না, Type টা মুছে নতুন করে বানানো ছাড়া। কারণটা বুঝুন: কোনো Row এ সেই মান থাকতে পারে, আর
                মানটা মুছে গেলে সেই Row এর ৪ Byte এর ইশারা কোথাও দেখাবে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মান মোছার চেষ্টা"
              query={`DROP TABLE IF EXISTS buenum_rides;
DROP TYPE IF EXISTS buenum_ride_status;
CREATE TYPE buenum_ride_status AS ENUM ('booked', 'boarding', 'sailed', 'lost');

ALTER TYPE buenum_ride_status DROP VALUE 'lost';`}
              caption="ERROR: dropping an enum value is not implemented, SQLSTATE 0A000, মানে feature not supported। মজার ব্যাপার হলো PostgreSQL DROP VALUE লেখাটা চেনে, শুধু কাজটা কখনো বানানো হয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে উপায়? চার ধাপের একটা স্থানান্তর। ধরুন জাহাজের যাত্রার অবস্থার তালিকায় lost নামে একটা মান ছিল, যেটা আর
                লাগবে না। প্রথমে lost বাদ দিয়ে একটা নতুন Type বানান। তারপর Column টাকে নতুন Type এ সরান, প্রতিটা মানকে আগে text,
                তারপর নতুন Type বানিয়ে: <code className={CODE}>USING status::text::নতুন_type</code>। তারপর পুরনো Type মুছুন, আর
                নতুনটার নাম বদলে পুরনো নাম দিন। ALTER COLUMN TYPE এর পুরো গল্প{" "}
                <Link href="/sql/topic/alter-table" className={LINK}>
                  Lesson 10
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
              title="মান সরানোর আসল পথ"
              query={`DROP TABLE IF EXISTS buenum_rides;
DROP TYPE IF EXISTS buenum_ride_status;
DROP TYPE IF EXISTS buenum_ride_status_v2;
CREATE TYPE buenum_ride_status AS ENUM ('booked', 'boarding', 'sailed', 'lost');
CREATE TABLE buenum_rides (ride_id integer NOT NULL, status buenum_ride_status NOT NULL);
INSERT INTO buenum_rides VALUES (1, 'booked'), (2, 'sailed'), (3, 'sailed');

-- ১. lost ছাড়া নতুন Type
CREATE TYPE buenum_ride_status_v2 AS ENUM ('booked', 'boarding', 'sailed');
-- ২. Column কে নতুন Type এ, text হয়ে
ALTER TABLE buenum_rides
  ALTER COLUMN status TYPE buenum_ride_status_v2
  USING status::text::buenum_ride_status_v2;
-- ৩. পুরনো Type মুছুন
DROP TYPE buenum_ride_status;
-- ৪. নতুনটাকে পুরনো নাম দিন
ALTER TYPE buenum_ride_status_v2 RENAME TO buenum_ride_status;

SELECT ride_id, status, pg_typeof(status) AS type
FROM buenum_rides
ORDER BY ride_id;

SELECT enum_range(NULL::buenum_ride_status) AS values_now;`}
              caption="প্রথম ফলাফলে ৩টা Row: 1 booked, 2 sailed, 3 sailed, প্রতিটার type buenum_ride_status। দ্বিতীয়টায় {booked,boarding,sailed}, lost আর নেই। কোনো Row এ যদি তখনো lost থাকত, ধাপ ২ এ ERROR: invalid input value for enum buenum_ride_status_v2: lost আসত, তাই আগে সেই Row গুলো অন্য মানে বদলে নিতে হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আরও দুটো নিয়ম জানা থাকা দরকার, দুটোই চলমান Database এ কাজ করার সময় সামনে আসে। প্রথমটা Type মোছা নিয়ে: কোনো
              Column যতক্ষণ Type টা ব্যবহার করছে, <code className={CODE}>DROP TYPE</code> Error দেয় (SQLSTATE 2BP01), আর HINT
              এ বলে DROP ... CASCADE এর কথা। CASCADE সেই Column গুলোও মুছে দেবে, তাই সেটা প্রায় কখনোই আপনি চান না। দ্বিতীয়টা
              Transaction নিয়ে: BEGIN এর পরে ADD VALUE করলে নতুন মানটা COMMIT না হওয়া পর্যন্ত ব্যবহার করা যায় না। এই বক্সে
              Transaction এর ভেতরে Error দেখানো নিরাপদ না, তাই নিচে আসল PostgreSQL 18 এর psql থেকে দুটোই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql-postgres-18-enum-rules.sql",
          code: `-- postgres:18 Container এর psql, PostgreSQL 18.6
CREATE TYPE buenum_seat_class AS ENUM ('deck', 'economy', 'cabin');

BEGIN;
ALTER TYPE buenum_seat_class ADD VALUE 'business' AFTER 'economy';
SELECT 'business'::buenum_seat_class;
-- ERROR:  unsafe use of new value "business" of enum type buenum_seat_class
-- HINT:  New enum values must be committed before they can be used.
ROLLBACK;

BEGIN;
ALTER TYPE buenum_seat_class ADD VALUE 'business' AFTER 'economy';
COMMIT;
SELECT 'business'::buenum_seat_class;
--  buenum_seat_class
-- -------------------
--  business

-- Type ব্যবহার হচ্ছে, তাই মোছা যায় না
CREATE TABLE buenum_x (v buenum_seat_class);
DROP TYPE buenum_seat_class;
-- ERROR:  cannot drop type buenum_seat_class because other objects depend on it
-- DETAIL:  column v of table buenum_x depends on type buenum_seat_class
-- HINT:  Use DROP ... CASCADE to drop the dependent objects too.`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              orderMatters
              starter={`DROP TYPE IF EXISTS ex5_buenum_seat_class;
CREATE TYPE ex5_buenum_seat_class AS ENUM ('economy', 'cabin');

-- এখানে ALTER TYPE লিখুন

SELECT enumlabel
FROM pg_enum
WHERE enumtypid = 'ex5_buenum_seat_class'::regtype
ORDER BY enumsortorder;`}
              task={
                <>
                  জাহাজ কোম্পানির নতুন তালিকা মেলাতে হবে। শুরুর Type এ আছে economy আর cabin। ALTER TYPE দিয়ে: সবার আগে deck যোগ
                  করুন, economy আর cabin এর মাঝে business যোগ করুন, আর cabin এর নাম বদলে private_cabin রাখুন। Check Query তে
                  ক্রম হতে হবে: deck, economy, business, private_cabin।
                </>
              }
              hint={
                <>
                  তিনটা Statement: <code className={CODE}>ADD VALUE &apos;deck&apos; BEFORE &apos;economy&apos;</code>,{" "}
                  <code className={CODE}>ADD VALUE &apos;business&apos; AFTER &apos;economy&apos;</code>, আর{" "}
                  <code className={CODE}>RENAME VALUE &apos;cabin&apos; TO &apos;private_cabin&apos;</code>। BEFORE বা AFTER না
                  দিলে business শেষে বসবে।
                </>
              }
              solution={`SELECT * FROM (VALUES ('deck'), ('economy'), ('business'), ('private_cabin')) AS v(enumlabel);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "three-ways",
      subHeader: { index: "012", title: "enum vs CHECK vs Lookup Table" },
      title: <SectionTitle>একই নিয়মের তিনটা পথ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                “এই Column এ শুধু এই কয়েকটা মান চলবে” নিয়মটা PostgreSQL এ তিনভাবে লেখা যায়। enum আপনি এই মাত্র শিখলেন। দ্বিতীয়
                পথ আপনি প্রথম দিন থেকেই দেখছেন, শুধু খেয়াল করেননি: Island Tours এর{" "}
                <code className={CODE}>bookings.status</code> একটা text Column, সাথে{" "}
                <code className={CODE}>CHECK (status IN (&apos;pending&apos;, &apos;confirmed&apos;, &apos;cancelled&apos;))</code>।
                CHECK মানে একটা শর্ত, প্রতিটা নতুন বা বদলানো Row কে যেটা পার হতে হয়। তৃতীয় পথ হলো Lookup Table: অনুমোদিত মানগুলো
                একটা আলাদা ছোট Table এর Row, আর মূল Column সেই Table এর দিকে REFERENCES দিয়ে দেখায়।
              </ContentParagraph>
              <ContentParagraph>
                CHECK এর পুরো গল্প পরের লেসন{" "}
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  Basic Constraints
                </Link>{" "}
                এ, REFERENCES এর পুরো গল্প{" "}
                <Link href="/sql/topic/foreign-keys" className={LINK}>
                  Lesson 09
                </Link>{" "}
                এ। এখানে দুটোকেই শুধু একটা কাজে দেখবেন: ভুল বানান আটকানো। ছবিতে তিনটা পথ পাশাপাশি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ThreeWaysDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই নিয়ম, তিনটা Table"
              query={WAYS_SETUP_SQL}
              caption="শেষে ৩টা Row: enum 1, check 1, lookup 1। তিনটা Table ই ঠিক মান confirmed নিয়েছে। পরের বক্সগুলোর জন্য এই বক্সটা আগে চালিয়ে রাখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল বানান, তিনটা আলাদা Error"
              query={`INSERT INTO buenum_way_enum VALUES (2, 'confirmd');`}
              caption="ERROR: invalid input value for enum buenum_status: confirmd, SQLSTATE 22P02। এবার buenum_way_enum এর জায়গায় buenum_way_check লিখে চালান: ERROR: new row for relation buenum_way_check violates check constraint buenum_way_check_status_check, 23514। তারপর buenum_way_lookup: ERROR: insert or update on table buenum_way_lookup violates foreign key constraint buenum_way_lookup_status_fkey, DETAIL: Key (status)=(confirmd) is not present in table buenum_statuses, 23503।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তিনটাই ভুল আটকায়, তাহলে পার্থক্য কোথায়? পার্থক্য আসে তালিকাটা বদলানোর দিনে, আর মানগুলোর সাথে বাড়তি কিছু রাখতে
              চাইলে। Lookup Table এ নতুন অবস্থা যোগ করা মানে Database এর গঠন বদলানো না, শুধু একটা INSERT। আর লেবেল, যেমন
              বাংলা নাম, সাথেই রাখা যায়। নিচের বক্সে waitlisted নামে একটা নতুন অবস্থা যোগ হচ্ছে, কোনো ALTER ছাড়াই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Lookup Table এ নতুন মান মানে একটা INSERT"
              query={`INSERT INTO buenum_statuses VALUES ('waitlisted', 'অপেক্ষমাণ তালিকা', 4);
INSERT INTO buenum_way_lookup VALUES (3, 'waitlisted');

SELECT w.booking_id, w.status, s.label
FROM buenum_way_lookup w
JOIN buenum_statuses s ON s.code = w.status
ORDER BY w.booking_id;`}
              caption="২টা Row: 1 confirmed নিশ্চিত, 3 waitlisted অপেক্ষমাণ তালিকা। “একই নিয়ম, তিনটা Table” বক্সটা আগে চালানো থাকতে হবে। একই কাজ enum এ হলে ALTER TYPE লাগত, CHECK এ Constraint মুছে নতুন করে লিখতে হতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "enum", "text + CHECK", "Lookup Table"],
          rows: [
            ["তালিকা থাকে", "Type এর ভেতরে, pg_enum এ", "Table এর সংজ্ঞায়", "আলাদা Table এর Row হিসেবে"],
            ["নতুন মান যোগ", "ALTER TYPE ADD VALUE", "Constraint মুছে নতুন করে (Lesson 10)", "একটা INSERT"],
            ["মান বাদ দেওয়া", "সরাসরি যায় না, নতুন Type এ স্থানান্তর", "Constraint বদলান, আগে পুরনো Row ঠিক করুন", "Row মুছুন বা is_active এর মতো Column দিয়ে বন্ধ"],
            ["ক্রম", "ঘোষণার ক্রম, ORDER BY নিজে মানে", "বর্ণমালা, নিজের ক্রম চাইলে CASE", "sort_order Column দিয়ে, JOIN করে"],
            ["বাড়তি তথ্য (লেবেল, রং)", "রাখা যায় না", "রাখা যায় না", "যত খুশি Column"],
            ["কয়েকটা Table এ একই তালিকা", "একটা Type, সবাই ব্যবহার করে", "প্রতিটা Table এ আবার লিখতে হয়", "সবাই একই Table এর দিকে দেখায়"],
            ["প্রতি Row এ জায়গা", "৪ Byte", "লেখার দৈর্ঘ্য অনুযায়ী", "code এর দৈর্ঘ্য অনুযায়ী"],
            ["অন্য Database এ নেওয়া", "PostgreSQL এর নিজস্ব, MySQL এর ENUM অন্যরকম", "প্রায় সব Database এ একই", "প্রায় সব Database এ একই"],
            ["ভুল বানানে Error", "22P02", "23514", "23503"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours কেন bookings.status এ CHECK বেছে নিল? তালিকাটা ছোট, তিনটা মান, শুধু একটা Table এ লাগে, বছরে
                বদলানোর সম্ভাবনা কম, আর একই Schema MySQL এর ফাইলেও প্রায় হুবহু লেখা যায়। এই অবস্থায় CHECK সবচেয়ে সহজ পথ। কিন্তু
                যেদিন Admin Panel থেকে কর্মীরা নিজেরাই নতুন অবস্থা যোগ করতে চাইবেন, বা প্রতিটা অবস্থার বাংলা নাম আর রং দেখাতে
                হবে, সেদিন Lookup Table এ যাওয়াই যুক্তিসঙ্গত। নিচের Lab এ আপনার নিজের Column এর জন্য প্রশ্নগুলোর উত্তর দিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ChooseWayLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              orderMatters
              starter={`DROP TABLE IF EXISTS ex6_buenum_booking_status;
CREATE TABLE ex6_buenum_booking_status (
  code       text PRIMARY KEY,
  label      text NOT NULL,
  sort_order smallint NOT NULL
);
INSERT INTO ex6_buenum_booking_status VALUES
  ('pending',   'পেমেন্টের অপেক্ষায়', 1),
  ('confirmed', 'নিশ্চিত',           2),
  ('cancelled', 'বাতিল',             3);

-- এখানে আপনার SELECT লিখুন`}
              task={
                <>
                  বক্সের শুরুটা একটা Lookup Table বানায়, যেখানে প্রতিটা Booking অবস্থার বাংলা লেবেল আর একটা ক্রম আছে। এর নিচে
                  একটা SELECT লিখুন, যেটা প্রতিটা অবস্থার বাংলা লেবেল আর সেই অবস্থায় কতগুলো Booking আছে দেখায়। Column দুটো:
                  label, bookings। সাজানো হবে sort_order অনুযায়ী, বর্ণমালায় না।
                </>
              }
              hint={
                <>
                  bookings কে <code className={CODE}>ex6_buenum_booking_status</code> এর সাথে JOIN করুন,{" "}
                  <code className={CODE}>ON s.code = b.status</code>। GROUP BY তে label আর sort_order দুটোই রাখুন, যাতে ORDER BY
                  sort_order লেখা যায়।
                </>
              }
              solution={`SELECT * FROM (VALUES
  ('পেমেন্টের অপেক্ষায়', 4),
  ('নিশ্চিত', 17),
  ('বাতিল', 3)
) AS v(label, bookings);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ boolean, UUID আর ENUM</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি যে MySQL কোর্সটা দেখছেন, সেখানে এই তিনটা জিনিস দেখতে একই রকম, কিন্তু ভেতরে অনেক আলাদা। তিনটা পার্থক্যই
                রোজকার Query তে চুপচাপ ভুল উত্তর দিতে পারে, তাই এক এক করে দেখুন। নিচের সব Output MySQL 8.4.11 এ, এই ট্র্যাকের
                island-tours.mysql.sql Load করা Database এ।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>BOOLEAN আসলে TINYINT(1):</strong> MySQL এর Documentation বলে BOOL আর BOOLEAN হলো TINYINT(1) এর আরেক নাম।
                  শূন্য মানে false, বাকি সব true। Island Tours এর MySQL ফাইলে is_active লেখা BOOLEAN, কিন্তু MySQL সেটা জমা রাখে
                  tinyint(1) হিসেবে। ফলে এই Column এ 2 বা -5 ও ঢোকে। TRUE শব্দটা আসলে শুধু 1, তাই{" "}
                  <code className={CODE}>WHERE breakfast = TRUE</code> 2 আর -5 কে বাদ দেয়, অথচ{" "}
                  <code className={CODE}>WHERE breakfast IS TRUE</code> বা শুধু <code className={CODE}>WHERE breakfast</code>{" "}
                  তাদের ধরে। লেখা হিসেবে &apos;yes&apos; ঢোকে না, Error 1366।
                </ListItem>
                <ListItem>
                  <strong>আলাদা uuid Type নেই:</strong> <code className={CODE}>UUID()</code> Function আছে, যেটা Documentation
                  অনুযায়ী Version 1 মান দেয়: সময় আর যন্ত্রের পরিচয় দিয়ে বানানো। জমা রাখার দুটো চেনা পথ:{" "}
                  <code className={CODE}>CHAR(36)</code>, মানে পুরো লেখাটা, অথবা <code className={CODE}>BINARY(16)</code>, মানে ১৬
                  Byte এর কাঁচা রূপ, <code className={CODE}>UUID_TO_BIN()</code> দিয়ে বানানো আর{" "}
                  <code className={CODE}>BIN_TO_UUID()</code> দিয়ে পড়া। দ্বিতীয় Argument এ 1 দিলে সময়ের অংশগুলোর জায়গা বদলে
                  যায়, যাতে মানগুলো সময়ের ক্রমে সাজে আর Index এ সুবিধা হয়, ঠিক PostgreSQL এর v7 এর ভাবনা।
                </ListItem>
                <ListItem>
                  <strong>ENUM একটা Column এর অংশ, আলাদা Type না:</strong> তালিকাটা লেখা হয় Column এর পাশেই,{" "}
                  <code className={CODE}>ENUM(&apos;deck&apos;, &apos;economy&apos;, &apos;cabin&apos;)</code>। প্রতিটা মানের একটা
                  ক্রমিক নম্বর থাকে, 1 থেকে শুরু। Default Collation অক্ষরের ছাঁদ মানে না, তাই &apos;ECONOMY&apos; ঢুকে economy হয়ে
                  যায়, আর সংখ্যা 2 দিলে দ্বিতীয় মানটা বসে। ORDER BY সাজায় সেই নম্বর ধরে। Strict Mode এ তালিকার বাইরের মান Error
                  1265 দেয়। Strict Mode বন্ধ থাকলে সেটা একটা Warning দিয়ে ফাঁকা লেখা হিসেবে ঢুকে যায়, যার নম্বর 0। নতুন মান যোগ
                  হয় <code className={CODE}>ALTER TABLE ... MODIFY</code> দিয়ে পুরো তালিকা আবার লিখে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-session.sql",
          code: `-- MySQL 8.4.11, island-tours.mysql.sql Load করা
SELECT COLUMN_TYPE FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'island_tours' AND TABLE_NAME = 'tours' AND COLUMN_NAME = 'is_active';
-- tinyint(1)

SELECT TRUE, FALSE, TRUE + TRUE;
-- 1 | 0 | 2

CREATE TABLE buenum_flags (id INT NOT NULL, breakfast BOOLEAN);
INSERT INTO buenum_flags VALUES (1, TRUE), (2, FALSE), (3, 2), (4, -5), (5, NULL);
SELECT id FROM buenum_flags WHERE breakfast = TRUE;
-- 1                (শুধু একটা Row)
SELECT id FROM buenum_flags WHERE breakfast IS TRUE;
-- 1, 3, 4          (তিনটা Row)
INSERT INTO buenum_flags VALUES (6, 'yes');
-- ERROR 1366 (HY000): Incorrect integer value: 'yes' for column 'breakfast' at row 1
INSERT INTO buenum_flags VALUES (7, 300);
-- ERROR 1264 (22003): Out of range value for column 'breakfast' at row 1

SELECT UUID() AS v1, LENGTH(UUID()) AS chars, LENGTH(UUID_TO_BIN(UUID())) AS bytes,
       IS_UUID('not-a-uuid') AS ok;
-- 48078716-ca1f-11f1-b379-02057a4d8303 | 36 | 16 | 0
-- তৃতীয় ভাগ 11f1 এর প্রথম অঙ্ক 1: Version 1

CREATE TABLE buenum_tickets (
  ticket_ref BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1)) PRIMARY KEY,
  passenger  VARCHAR(100) NOT NULL
);
INSERT INTO buenum_tickets (passenger) VALUES ('Rahim Uddin'), ('Nusrat Jahan');
SELECT BIN_TO_UUID(ticket_ref, 1) AS ticket_ref, passenger FROM buenum_tickets;
-- 48090376-ca1f-11f1-b379-02057a4d8303 | Rahim Uddin
-- 4809150a-ca1f-11f1-b379-02057a4d8303 | Nusrat Jahan

CREATE TABLE buenum_cabins (
  passenger  VARCHAR(100) NOT NULL,
  seat_class ENUM('deck', 'economy', 'cabin') NOT NULL
);
INSERT INTO buenum_cabins VALUES
  ('Rahim', 'cabin'), ('Nusrat', 'deck'), ('Tanvir', 'ECONOMY'), ('Farhana', 2);
SELECT passenger, seat_class, seat_class + 0 AS idx FROM buenum_cabins ORDER BY seat_class;
-- Nusrat  | deck    | 1
-- Tanvir  | economy | 2
-- Farhana | economy | 2
-- Rahim   | cabin   | 3
INSERT INTO buenum_cabins VALUES ('Sabbir', 'first');
-- ERROR 1265 (01000): Data truncated for column 'seat_class' at row 1

ALTER TABLE buenum_cabins MODIFY seat_class ENUM('deck', 'economy', 'business', 'cabin') NOT NULL;
SELECT passenger, seat_class, seat_class + 0 AS idx FROM buenum_cabins ORDER BY seat_class;
-- Nusrat  | deck    | 1
-- Tanvir  | economy | 2
-- Farhana | economy | 2
-- Rahim   | cabin   | 4      (মাঝে business ঢোকায় cabin এর নম্বর 3 থেকে 4)`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["boolean", "আলাদা Type, শুধু true, false, NULL", "TINYINT(1), যেকোনো ছোট সংখ্যা ঢোকে"],
            ["লেখা হিসেবে 'yes'", "true হয়", "Error 1366"],
            ["= TRUE", "সব true Row", "শুধু যেখানে ঠিক 1"],
            ["uuid Type", "আছে, ১৬ Byte", "নেই, CHAR(36) বা BINARY(16)"],
            ["UUID বানানো", "gen_random_uuid() (v4), uuidv7()", "UUID() (v1)"],
            ["সময়ের ক্রমে সাজানো", "uuidv7()", "UUID_TO_BIN(UUID(), 1)"],
            ["enum", "CREATE TYPE, আলাদা Type, অনেক Table এ", "Column এর ভেতরে ENUM(...)"],
            ["অক্ষরের ছাঁদ", "'Cabin' Error দেয়", "'ECONOMY' ঢুকে economy হয়"],
            ["তালিকার বাইরের মান", "সবসময় Error 22P02", "Strict Mode এ Error 1265, না হলে ফাঁকা লেখা"],
            ["নতুন মান যোগ", "ALTER TYPE ADD VALUE", "ALTER TABLE ... MODIFY পুরো তালিকা"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL ভিডিও দেখে PostgreSQL এ লেখার সময়",
          content: (
            <ContentParagraph>
              ভিডিওতে <code className={CODE}>is_active TINYINT(1)</code> বা <code className={CODE}>BOOLEAN</code> দেখলে
              PostgreSQL এ লিখুন <code className={CODE}>boolean NOT NULL DEFAULT false</code>, আর{" "}
              <code className={CODE}>= 1</code> এর জায়গায় শুধু Column এর নাম। <code className={CODE}>CHAR(36)</code> এ UUID
              দেখলে PostgreSQL এ <code className={CODE}>uuid</code>, আর <code className={CODE}>DEFAULT (UUID())</code> এর জায়গায়{" "}
              <code className={CODE}>DEFAULT gen_random_uuid()</code> বা <code className={CODE}>uuidv7()</code>। Column এর পাশে{" "}
              <code className={CODE}>ENUM(...)</code> দেখলে হয় আগে CREATE TYPE বানান, নয়তো text আর CHECK লিখুন, অংশ 012 এর
              তুলনা দেখে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>তানিমের Ticket Table, এবার ঠিক Type এ</SectionTitle>,
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
                ফারুক সাহেব তানিমকে থিওরির Table টা আবার বানাতে বললেন, এবার এই লেসনের তিনটা Type দিয়ে। জাহাজ কোম্পানির নিয়ম:
                তিন বা বেশি আসনের দল পাবে cabin আর নাশতা, দুজন পাবেন economy, একা যাত্রী deck। Ticket দেওয়া হবে Saint Martin
                Island Escape (tour_id 1) এর প্রতিটা confirmed Booking এ, আগের আর সামনের সব যাত্রা মিলিয়ে, কারণ জাহাজ কোম্পানি
                পুরনো যাত্রার হিসাবও চায়।
              </ContentParagraph>
              <ContentParagraph>
                তানিম প্রতিটা Column এর জন্য একটা করে প্রশ্ন করলেন। Ticket এর পরিচয়: বাইরের মানুষ Link এ দেখবেন, আন্দাজ করা যাবে
                না, আর অনেক Ticket আসবে, তাই uuid, DEFAULT uuidv7()। নাশতা: শুধু হ্যাঁ বা না, অজানা অর্থহীন, তাই boolean NOT
                NULL DEFAULT false। শ্রেণি: তিনটা স্থির মান, একটা স্বাভাবিক ক্রম আছে (সস্তা থেকে দামি), তাই enum। booking_id
                সাধারণ integer। আসল Table এ এর পাশে <code className={CODE}>REFERENCES bookings (booking_id)</code> বসত, যাতে না
                থাকা Booking এর Ticket না হয়। সেটা Lesson 09 এর বিষয়, তাই এই বক্সে ইচ্ছা করে রাখা হয়নি, যাতে এই অনুশীলনের Table
                Island Tours এর আসল Table গুলোর সাথে বাঁধা না পড়ে। PRIMARY KEY এর পুরো গল্প Lesson 08 এ, এখানে শুধু জানুন এটা
                Column টাকে অনন্য আর বাধ্যতামূলক করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Ticket Table, তিনটা Type সহ"
              query={PROJECT_SQL}
              caption="শেষে ৩টা Row, ঘোষণার ক্রমে: deck 2 টিকিট 0 নাশতা, economy 2 আর 0, cabin 1 আর 1। পাঁচটা confirmed Booking, পাঁচটা Ticket। CASE এর শেষে ::buenum_ferry_class খেয়াল করুন, ওটা না থাকলে কী হয়, অংশ 016 এ দেখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Customer এর Link আর একটা যাচাই"
              query={`SELECT c.full_name, t.seat_class, t.breakfast_included,
       'https://islandtours.example/ticket/' || t.ticket_ref AS ticket_link
FROM buenum_ferry_tickets t
JOIN bookings b  ON b.booking_id = t.booking_id
JOIN customers c ON c.customer_id = b.customer_id
ORDER BY t.ticket_ref;

SELECT count(*) AS tickets,
       count(DISTINCT ticket_ref) AS unique_refs,
       min(uuid_extract_version(ticket_ref)) AS version
FROM buenum_ferry_tickets;`}
              caption="আগের বক্সটা চালানো থাকতে হবে। প্রথম ফলাফলে ৫টা Row: Rahim Uddin economy, Nusrat Jahan cabin, Tanvir Ahmed deck, Nusrat Jahan economy, Tanvir Ahmed deck, Booking এর ক্রমে, কারণ v7 অনুযায়ী সাজানো মানে তৈরির ক্রমে সাজানো। Link গুলো প্রতিবার নতুন। দ্বিতীয় ফলাফলে tickets 5, unique_refs 5, version 7।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার থিওরির তিনটা ঝামেলা ফিরে দেখুন। নাশতার পাঁচ রকম লেখা এখন অসম্ভব, Column এ শুধু t বা f। শ্রেণির ভুল বানান
              ঢুকতেই পারে না, নিচের বক্সটা চালিয়ে দেখুন। আর Link এর শেষে আর 4 বা 5 নেই, আছে এমন একটা মান যার পাশের মান বলে
              কিছু নেই। (ফারহানার ঘটনা পুরো ঠেকাতে Server এর অনুমতি যাচাই তো লাগবেই।)
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল শ্রেণি আর ঢোকে না"
              query={`INSERT INTO buenum_ferry_tickets (booking_id, seat_class) VALUES (8, 'first');`}
              caption="ERROR: invalid input value for enum buenum_ferry_class: first। থিওরির text Column এ cabn চুপচাপ ঢুকে গিয়েছিল, এখানে Database দরজাতেই আটকে দিল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              orderMatters
              starter={`DROP TABLE IF EXISTS ch_buenum_tickets;
DROP TYPE IF EXISTS ch_buenum_class;

-- এখানে CREATE TYPE, CREATE TABLE আর INSERT লিখুন

SELECT seat_class, count(*) AS tickets,
       count(*) FILTER (WHERE breakfast) AS with_breakfast,
       count(DISTINCT ticket_ref) AS unique_refs
FROM ch_buenum_tickets
GROUP BY seat_class
ORDER BY seat_class;`}
              task={
                <>
                  এবার সামনের সব যাত্রার Ticket, সব ট্যুর মিলিয়ে। বানান: enum <code className={CODE}>ch_buenum_class</code>{" "}
                  (deck, economy, cabin, এই ক্রমে) আর Table <code className={CODE}>ch_buenum_tickets</code>, চারটা Column:
                  ticket_ref uuid, ফাঁকা নয়, নিজে থেকে uuidv7(); booking_id integer, ফাঁকা নয়; seat_class সেই enum, ফাঁকা নয়;
                  breakfast boolean, ফাঁকা নয়, শুরুতে false। তারপর একটা INSERT ... SELECT দিয়ে প্রতিটা confirmed Booking এ একটা
                  Ticket, যার Departure এর starts_on 1 November 2026 বা তার পরে। নিয়ম আগের মতো: ৩ বা বেশি আসন cabin আর নাশতা, ২
                  আসন economy, ১ আসন deck। শেষের Check Query যেমন আছে রাখুন।
                </>
              }
              hint={
                <>
                  bookings কে departures এর সাথে JOIN করুন,{" "}
                  <code className={CODE}>WHERE b.status = &apos;confirmed&apos; AND d.starts_on &gt;= DATE &apos;2026-11-01&apos;</code>।
                  CASE এর পুরোটা বন্ধনীতে রেখে শেষে <code className={CODE}>::ch_buenum_class</code>, আর নাশতার জন্য{" "}
                  <code className={CODE}>b.seats &gt;= 3</code>। enum এর ক্রম ভুল হলে Check এর Row গুলোর ক্রম ভুল আসবে।
                </>
              }
              solution={`SELECT * FROM (VALUES
  ('deck', 1, 0, 1),
  ('economy', 3, 0, 3),
  ('cabin', 3, 3, 3)
) AS v(seat_class, tickets, with_breakfast, unique_refs);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>নতুন Column এর Type বাছাইয়ের সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Column টা কোন প্রশ্নের উত্তর, এক বাক্যে বলুন",
              description:
                "“ট্যুরটা চালু কিনা”, “Ticket এর পরিচয়”, “বসার শ্রেণি”। উত্তরটা হ্যাঁ বা না হলে boolean এর দিকে, একটা পরিচয় হলে uuid বা integer এর দিকে, কয়েকটার মধ্যে একটা হলে তালিকার দিকে।",
            },
            {
              title: "হ্যাঁ বা না হলে: অজানার কোনো মানে আছে কি?",
              description:
                "না থাকলে boolean NOT NULL DEFAULT false (বা true)। থাকলে আগে ভাবুন তিন মানের তালিকা ভালো কিনা। আর কখন ঘটল জানতে হলে boolean না, একটা timestamptz।",
            },
            {
              title: "একটা জিনিসের অবস্থা বোঝাতে কয়েকটা boolean লাগছে কি?",
              description:
                "is_paid, is_refunded, is_failed এর মতো হলে থামুন। একসাথে একটাই অবস্থা হলে সেটা একটা status Column, তালিকা থেকে মান।",
            },
            {
              title: "পরিচয় হলে: বাইরের মানুষ দেখবেন কি, বা Database এর বাইরে তৈরি হবে কি?",
              description:
                "দুটোর কোনোটাই না হলে integer বা bigint IDENTITY যথেষ্ট আর সস্তা। কোনোটা হলে uuid, কখনো text না।",
            },
            {
              title: "uuid হলে: v4 নাকি v7?",
              description:
                "অনেক INSERT আর Index এর গতি গুরুত্বপূর্ণ হলে uuidv7()। মান দেখে তৈরির সময় জানা গেলে সমস্যা হলে gen_random_uuid()। পুরনো Server এ PostgreSQL 18 না থাকলে uuidv7() নেই, তখন v4।",
            },
            {
              title: "তালিকা হলে: enum, CHECK নাকি Lookup Table?",
              description:
                "তালিকা বদলাবে বা লেবেল লাগবে: Lookup Table। স্থির, কিন্তু ক্রম বা কয়েকটা Table এ ভাগাভাগি দরকার: enum। ছোট, স্থির, এক Table এ: CHECK।",
            },
            {
              title: "বানিয়ে ভুল ঢোকানোর চেষ্টা করুন",
              description:
                "প্রতিটা নতুন Column এ একটা করে বাজে মান INSERT করে দেখুন: 'maybe', একটা ভাঙা UUID, ভুল বানানের শ্রেণি। Error না এলে আপনার নিয়মে ফাঁক আছে।",
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
          headers: ["ভুল", "যা ঘটে", "ঠিক উপায়"],
          rows: [
            ["হ্যাঁ বা না রাখতে text বা integer", "Yes, Y, 1, হ্যাঁ সব আলাদা লেখা হিসেবে জমা, গোনা ভুল", "boolean, আর পুরনো Data CASE দিয়ে অনুবাদ"],
            ["WHERE is_active = true", "কাজ করে, কিন্তু বাড়তি লেখা", "WHERE is_active"],
            ["NULL রাখা boolean এ WHERE NOT flag", "NULL Row গুলো চুপচাপ বাদ পড়ে", "দরকার হলে WHERE flag IS NOT TRUE"],
            ["একটা অবস্থার জন্য কয়েকটা boolean", "অর্থহীন মিলন জমা হয় (paid আর failed একসাথে)", "একটা status Column, তালিকা থেকে মান"],
            ["UUID কে text এ রাখা", "দ্বিগুণের বেশি জায়গা, বড় হাতের লেখায় খোঁজা ব্যর্থ", "uuid Type"],
            ["uuid কে তালা ভাবা", "Link হাতে পেলে যে কেউ খোলেন", "Server এ প্রতিবার মালিকানা যাচাই"],
            ["গোপন সময়ের জায়গায় uuidv7()", "uuid_extract_timestamp() দিয়ে তৈরির সময় ফাঁস", "সেখানে gen_random_uuid()"],
            ["enum এ বড় হাতের বা ভুল বানান", "22P02 invalid input value for enum", "তালিকার বানান হুবহু, ছোট হাতের নাম রাখার অভ্যাস"],
            ["DROP TYPE আগে, DROP TABLE পরে", "2BP01 cannot drop type because other objects depend on it", "আগে Table, তারপর Type"],
            ["CASE এর ফল সরাসরি enum Column এ", "42804 column is of type ... but expression is of type text", "CASE এর শেষে ::type_name"],
            ["enum থেকে মান মোছার চেষ্টা", "0A000 dropping an enum value is not implemented", "নতুন Type বানিয়ে Column সরানো"],
            ["text Column কে enum Column এর সাথে JOIN", "42883 operator does not exist: text = ...", "enum পাশে ::text"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দশ নম্বর ভুলটা সবচেয়ে বেশি দেখা যায়, কারণ VALUES দিয়ে INSERT করলে কোনো সমস্যা হয় না, শুধু INSERT ... SELECT এ
              হয়। উদ্ধৃতির লেখা নিজে থেকে enum হয়, কিন্তু CASE এর ফল ততক্ষণে text হয়ে গেছে। নিচের বক্সে ঠিক এই ভুলটা আছে।
              চালান, Error পড়ুন, তারপর ঠিক করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={`DROP TABLE IF EXISTS buenum_tour_sizes;
DROP TYPE IF EXISTS buenum_size;
CREATE TYPE buenum_size AS ENUM ('small', 'medium', 'large');
CREATE TABLE buenum_tour_sizes (
  tour_id integer NOT NULL,
  size    buenum_size NOT NULL
);

INSERT INTO buenum_tour_sizes (tour_id, size)
SELECT tour_id,
       CASE WHEN max_seats < 15 THEN 'small'
            WHEN max_seats < 25 THEN 'medium'
            ELSE 'large' END
FROM tours;

SELECT size, count(*) AS tours
FROM buenum_tour_sizes
GROUP BY size
ORDER BY size;`}
              caption="ERROR: column size is of type buenum_size but expression is of type text, সাথে HINT: You will need to rewrite or cast the expression। ELSE 'large' END এর ঠিক পরে ::buenum_size বসিয়ে আবার চালান। ঠিক হলে ৩টা Row: small 2, medium 5, large 2।"
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
                    href="https://www.postgresql.org/docs/current/datatype-boolean.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Boolean Type
                  </a>
                  : কোন লেখা true আর false হিসেবে গৃহীত, শুরুর অংশের নিয়ম, আর কেন Output সবসময় t বা f।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/datatype-uuid.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: UUID Type
                  </a>
                  : uuid কী, কোন কোন চেহারায় লেখা গ্রহণ করে, আর কেন Sequence এর চেয়ে বেশি জায়গায় অনন্য।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-uuid.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: UUID Functions
                  </a>
                  : gen_random_uuid(), uuidv4(), uuidv7() আর দুটো extract Function এর আনুষ্ঠানিক বর্ণনা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/datatype-enum.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Enumerated Types
                  </a>
                  : enum এর ক্রম, Type Safety, ৪ Byte আর ৬৩ Byte এর সীমা, আর কেন মান মোছা যায় না।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-altertype.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: ALTER TYPE
                  </a>
                  : ADD VALUE, BEFORE, AFTER, IF NOT EXISTS, RENAME VALUE, আর Transaction এর ভেতরে নতুন মানের নিয়ম।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/release/18.0/"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 18 Release Notes
                  </a>
                  : যেখানে uuidv7() আর uuidv4() যোগ হওয়ার কথা লেখা আছে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/numeric-type-syntax.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Numeric Data Type Syntax
                  </a>
                  : BOOL আর BOOLEAN যে TINYINT(1) এর আরেক নাম, সেটা এখানে লেখা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/miscellaneous-functions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Miscellaneous Functions
                  </a>
                  : UUID(), UUID_TO_BIN(), BIN_TO_UUID() আর IS_UUID(), swap flag সহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/enum.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: The ENUM Type
                  </a>
                  : ক্রমিক নম্বর, ফাঁকা লেখার Error মান, Strict Mode আর সাজানোর নিয়ম।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : কোর্সটা MySQL দিয়ে। Data Type এর অংশে BOOLEAN বা ENUM দেখলে অংশ 013 এর তুলনাটা পাশে রাখুন, আর প্রতিটা উদাহরণ
                  PostgreSQL এ এই লেসনের মতো করে লিখে দেখুন।
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
                  boolean এর তিন অবস্থা: true, false আর NULL (অজানা)। জায়গা ১ Byte। অজানার মানে না থাকলে NOT NULL DEFAULT
                  false বা true।
                </ListItem>
                <ListItem>
                  লেখা হিসেবে true: true, yes, on, 1; false: false, no, off, 0; অক্ষরের ছাঁদ আর আগে পরের ফাঁকা জায়গা মানে না,
                  স্পষ্ট শুরুর অংশও চলে। Output সবসময় t বা f। অন্য কিছু 22P02।
                </ListItem>
                <ListItem>
                  WHERE flag, WHERE NOT flag, count(*) FILTER, bool_and, bool_or। NULL ধরতে IS TRUE, IS NOT TRUE, IS UNKNOWN।
                </ListItem>
                <ListItem>
                  একটা জিনিসের একটাই অবস্থা হলে কয়েকটা boolean না, একটা status। কখন ঘটল জানতে boolean না, timestamptz।
                </ListItem>
                <ListItem>
                  uuid: ১২৮ Bit, ৩২ Hex অঙ্ক, ৮-৪-৪-৪-১২, জায়গা ১৬ Byte (text এ ৩৭)। আন্দাজ করা যায় না, যেকোনো জায়গায় বানানো
                  যায়। কিন্তু তালা না, অনুমতি যাচাই আলাদা।
                </ListItem>
                <ListItem>
                  gen_random_uuid() বা uuidv4() মানে এলোমেলো v4; uuidv7() (PostgreSQL 18) শুরুতে সময়, তাই তৈরির ক্রমে সাজে আর
                  Index এ শেষে বসে, তবে সময় ফাঁস করে।
                </ListItem>
                <ListItem>
                  enum: CREATE TYPE ... AS ENUM, ঘোষণার ক্রমই ক্রম, ৪ Byte, case sensitive, অন্য enum বা text এর সাথে সরাসরি
                  তুলনা না।
                </ListItem>
                <ListItem>
                  ALTER TYPE দিয়ে ADD VALUE (BEFORE, AFTER, IF NOT EXISTS) আর RENAME VALUE। মান মোছা যায় না: নতুন Type, USING
                  ::text::নতুন, পুরনো মুছে নাম বদল।
                </ListItem>
                <ListItem>
                  একই নিয়মের তিন পথ: enum (স্থির, ক্রম, ভাগাভাগি), CHECK (ছোট, স্থির, এক Table), Lookup Table (বদলায়, লেবেল
                  লাগে)। MySQL এ BOOLEAN হলো TINYINT(1), uuid Type নেই, ENUM Column এর ভেতরে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে আপনি বারবার এমন জিনিস দেখেছেন যা Type এর কাজ না, কিন্তু Type এর পাশে বসে: NOT NULL, DEFAULT, PRIMARY
                KEY, CHECK, REFERENCES। Type বলে একটা Column এ কোন ধরনের মান চলে। এগুলো বলে সেই ধরনের ভেতরেও কোন মান চলবে আর
                কোনটা না: ফাঁকা রাখা যাবে কিনা, দুটো Row এ একই মান হতে পারবে কিনা, দাম ঋণাত্মক হতে পারবে কিনা। এদের নাম
                Constraint, আর এদের দিয়েই শুরু পরের লেসন{" "}
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  Basic Constraints
                </Link>
                ।
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
      ["boolean", "true, false আর NULL, ১ Byte", "tours.is_active: ৮টা t, ১টা f"],
      ["গৃহীত লেখা", "true/yes/on/1, false/no/off/0, স্পষ্ট শুরুর অংশ, ছাঁদ আর ফাঁকা মানে না", "'tr' মানে t, 'o' মানে Error"],
      ["boolean প্রশ্ন", "WHERE flag, FILTER, bool_and, bool_or", "অঞ্চলে চালু ট্যুর: Chattogram 5 আর f"],
      ["NULL সাবধানে", "IS TRUE, IS NOT TRUE, IS UNKNOWN কখনো NULL দেয় না", "NULL এ is_not_true t"],
      ["boolean নয়", "একটা অবস্থা মানে একটা status, কখন মানে timestamptz", "payments.status: paid 17, refunded 1, failed 1"],
      ["uuid", "১২৮ Bit, ৮-৪-৪-৪-১২, ১৬ Byte", "text হিসেবে ৩৭ Byte"],
      ["gen_random_uuid()", "এলোমেলো v4, PostgreSQL 13 থেকে", "সাজালে তৈরির ক্রম হারায়"],
      ["uuidv7()", "শুরুতে সময়, PostgreSQL 18 থেকে, সময় ফাঁস করে", "ফেরি Ticket এর ticket_ref"],
      ["uuid তালা নয়", "আন্দাজ ঠেকায়, অনুমতি যাচাই আলাদা", "ফারহানার 4 থেকে 5"],
      ["enum", "CREATE TYPE ... AS ENUM, ঘোষণার ক্রম, ৪ Byte", "deck, economy, cabin"],
      ["enum বদল", "ADD VALUE, BEFORE, AFTER, RENAME VALUE, মোছা যায় না", "business এর enumsortorder 1.5"],
      ["তিন পথ", "enum, CHECK, Lookup Table, তিনটা Error কোড", "bookings.status এ CHECK"],
      ["MySQL", "BOOLEAN হলো TINYINT(1), uuid Type নেই, ENUM Column এ", "is_active এর COLUMN_TYPE tinyint(1)"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SELECT 'o'::boolean; চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "t আসে, কারণ o মানে on",
            isCorrect: false,
            explanation: "o দিয়ে on আর off দুটোই শুরু হয়। শুরুর অংশ তখনই চলে যখন সেটা থেকে একটাই শব্দ বোঝা যায়।",
          },
          {
            key: "B",
            text: "f আসে, কারণ o মানে off",
            isCorrect: false,
            explanation: "একই কারণে ভুল। PostgreSQL দুটোর মধ্যে আন্দাজ করে একটা বেছে নেয় না।",
          },
          {
            key: "C",
            text: "ERROR: invalid input syntax for type boolean, কারণ o অস্পষ্ট",
            isCorrect: true,
            explanation: "ঠিক। on আর off দুটোই o দিয়ে শুরু, তাই লেখাটা কোনো একটা মানে পৌঁছায় না, ফলে 22P02। of বা on লিখলে চলত।",
          },
          {
            key: "D",
            text: "NULL আসে, কারণ লেখাটা চেনা যায়নি",
            isCorrect: false,
            explanation: "চেনা না গেলে PostgreSQL NULL বসিয়ে দেয় না, Error দেয়। চুপচাপ NULL হলে ভুল Data ঢুকে যেত।",
          },
        ],
      },
      {
        id: 2,
        text: "breakfast একটা boolean Column, যেখানে NULL ও আছে। কোন শর্ত false আর NULL দুটো Row ই রাখে?",
        options: [
          {
            key: "A",
            text: "WHERE NOT breakfast",
            isCorrect: false,
            explanation: "NOT NULL এর ফলও NULL, আর WHERE শুধু সত্য Row রাখে, তাই NULL Row বাদ পড়ে।",
          },
          {
            key: "B",
            text: "WHERE breakfast = false OR breakfast = NULL",
            isCorrect: false,
            explanation: "= NULL কখনো সত্য হয় না, তাই দ্বিতীয় অংশ কিছুই ধরে না। ফল WHERE NOT breakfast এর মতোই।",
          },
          {
            key: "C",
            text: "WHERE breakfast IS FALSE",
            isCorrect: false,
            explanation: "IS FALSE শুধু false Row এ সত্য, NULL এ মিথ্যা।",
          },
          {
            key: "D",
            text: "WHERE breakfast IS NOT TRUE",
            isCorrect: true,
            explanation: "ঠিক। IS NOT TRUE false এ সত্য, NULL এও সত্য, শুধু true তে মিথ্যা। আর এটা কখনো NULL ফেরত দেয় না।",
          },
        ],
      },
      {
        id: 3,
        text: "MySQL এ breakfast BOOLEAN Column এ 1, 0, 2 আর -5 আছে। WHERE breakfast = TRUE কয়টা Row দেয়?",
        options: [
          {
            key: "A",
            text: "১টা, শুধু যেখানে 1",
            isCorrect: true,
            explanation: "ঠিক। MySQL এ TRUE মানে শুধু সংখ্যা 1, আর BOOLEAN আসলে TINYINT(1)। 2 আর -5 true বলে গণ্য হলেও 1 এর সমান না। সবগুলো ধরতে WHERE breakfast IS TRUE বা শুধু WHERE breakfast।",
          },
          {
            key: "B",
            text: "৩টা, 1, 2 আর -5",
            isCorrect: false,
            explanation: "এটা WHERE breakfast IS TRUE এর উত্তর। = TRUE সংখ্যার সমতা দেখে, তাই শুধু 1।",
          },
          {
            key: "C",
            text: "কোনোটাই না, কারণ 2 ঢোকার সময়েই Error হতো",
            isCorrect: false,
            explanation: "TINYINT এর সীমার ভেতরে যেকোনো সংখ্যা ঢোকে। 300 দিলে Error 1264 আসত, 2 বা -5 এ না।",
          },
          {
            key: "D",
            text: "৪টা, কারণ সবগুলোই সংখ্যা",
            isCorrect: false,
            explanation: "0 কে MySQL false ধরে, আর = TRUE শুধু 1 এর সাথে মেলে।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা Table এ প্রতি সেকেন্ডে অনেক Row আসে, আর uuid Column টাই তার Key। মান দেখে তৈরির সময় জানা গেলে কোনো সমস্যা নেই। DEFAULT এ কোনটা সবচেয়ে মানানসই?",
        options: [
          {
            key: "A",
            text: "gen_random_uuid()",
            isCorrect: false,
            explanation: "চলবে, কিন্তু এলোমেলো মান Index এর যেকোনো জায়গায় ঢোকে, অনেক INSERT এ সেটা খরচ বাড়ায়। সময় গোপন রাখার দরকার নেই, তাই এখানে এর বিশেষ সুবিধা নেই।",
          },
          {
            key: "B",
            text: "uuidv7()",
            isCorrect: true,
            explanation: "ঠিক। শুরুতে সময় থাকায় নতুন মান সবসময় Index এর শেষে বসে, আর সময় ফাঁস হওয়া এখানে সমস্যা না। PostgreSQL 18 লাগে।",
          },
          {
            key: "C",
            text: "uuid_generate_v1()",
            isCorrect: false,
            explanation: "এর জন্য uuid-ossp Extension লাগে, আর Documentation অনুযায়ী এটা যন্ত্রের MAC Address ও প্রকাশ করে। নতুন কাজে দরকার নেই।",
          },
          {
            key: "D",
            text: "md5(random()::text)",
            isCorrect: false,
            explanation: "এটা uuid না, একটা text Hash। uuid Column এ সরাসরি বসানোও যায় না, আর কোনো ক্রমও নেই।",
          },
        ],
      },
      {
        id: 5,
        text: "Ticket এর Link এ ক্রমিক নম্বরের জায়গায় uuid বসানো হলো। এখন কোন কথাটা সত্য?",
        options: [
          {
            key: "A",
            text: "এখন আর অনুমতি যাচাইয়ের দরকার নেই",
            isCorrect: false,
            explanation: "Link কারও হাতে পৌঁছালে, চ্যাটে বা স্ক্রিনশটে, তিনি খুলতে পারবেন। Server কে তবুও দেখতে হবে Ticket টা আসলে কার।",
          },
          {
            key: "B",
            text: "পাশের নম্বর আন্দাজ করে অন্যের Ticket খোঁজা কার্যত অসম্ভব, কিন্তু মালিকানা যাচাই তবুও লাগবে",
            isCorrect: true,
            explanation: "ঠিক। uuid আন্দাজ ঠেকায়, তালার কাজ করে না। দুটো একসাথে লাগে।",
          },
          {
            key: "C",
            text: "uuid এনক্রিপ্ট করা থাকে, তাই কেউ পড়তে পারে না",
            isCorrect: false,
            explanation: "uuid কোনো এনক্রিপশন না। v7 থেকে তো তৈরির সময়ও পড়া যায়।",
          },
          {
            key: "D",
            text: "uuid দুজনের একই হতে পারে, তাই এটা আরও অনিরাপদ",
            isCorrect: false,
            explanation: "এলোমেলো দুটো UUID মিলে যাওয়ার আশা কার্যত শূন্য, এটাই uuid এর মূল সুবিধা।",
          },
        ],
      },
      {
        id: 6,
        text: "CREATE TYPE size AS ENUM ('small', 'medium', 'large'); একটা Table এ large, small, medium আছে। ORDER BY size কী ক্রমে দেয়?",
        options: [
          {
            key: "A",
            text: "large, medium, small, বর্ণমালায়",
            isCorrect: false,
            explanation: "এটা text এর ক্রম। enum বর্ণমালা মানে না।",
          },
          {
            key: "B",
            text: "যে ক্রমে Row ঢুকেছে",
            isCorrect: false,
            explanation: "ORDER BY থাকলে ঢোকার ক্রমের কোনো ভূমিকা নেই।",
          },
          {
            key: "C",
            text: "small, medium, large, ঘোষণার ক্রমে",
            isCorrect: true,
            explanation: "ঠিক। enum এর বড় ছোট ঠিক হয় CREATE TYPE এ মানগুলো যে ক্রমে লেখা, সেই ক্রমে। pg_enum এর enumsortorder সেই ক্রমের চাবি।",
          },
          {
            key: "D",
            text: "Error, কারণ enum সাজানো যায় না",
            isCorrect: false,
            explanation: "সাজানো যায়, আর সেটাই enum এর বড় সুবিধা। min(), max(), <, > সবই চলে।",
          },
        ],
      },
      {
        id: 7,
        text: "একটা enum থেকে lost মানটা বাদ দিতে হবে। সঠিক পথ কোনটা?",
        options: [
          {
            key: "A",
            text: "ALTER TYPE ... DROP VALUE 'lost'",
            isCorrect: false,
            explanation: "PostgreSQL লেখাটা চেনে, কিন্তু উত্তর দেয় ERROR: dropping an enum value is not implemented।",
          },
          {
            key: "B",
            text: "DELETE FROM pg_enum WHERE enumlabel = 'lost'",
            isCorrect: false,
            explanation: "System Catalog হাতে বদলানো বিপজ্জনক, যে Row এ lost আছে তার ইশারা কোথাও দেখাবে না। কখনো করবেন না।",
          },
          {
            key: "C",
            text: "ALTER TYPE ... RENAME VALUE 'lost' TO ''",
            isCorrect: false,
            explanation: "নাম বদলালে মানটা থেকেই যায়, শুধু নতুন নামে। বাদ পড়ে না।",
          },
          {
            key: "D",
            text: "lost ছাড়া নতুন Type বানিয়ে USING status::text::নতুন দিয়ে Column সরানো, পুরনো Type মুছে নাম বদল",
            isCorrect: true,
            explanation: "ঠিক। আগে নিশ্চিত করুন কোনো Row এ lost নেই, না হলে স্থানান্তরের সময় invalid input value for enum Error আসবে।",
          },
        ],
      },
      {
        id: 8,
        text: "Admin Panel থেকে কর্মীরা নিজেরাই নতুন Booking অবস্থা যোগ করবেন, আর প্রতিটার একটা বাংলা নাম আর রং দেখাতে হবে। কোন পথ?",
        options: [
          {
            key: "A",
            text: "enum, কারণ এটা সবচেয়ে কম জায়গা নেয়",
            isCorrect: false,
            explanation: "নতুন মান মানে প্রতিবার ALTER TYPE, আর enum এ বাংলা নাম বা রং রাখার জায়গা নেই।",
          },
          {
            key: "B",
            text: "Lookup Table, কারণ নতুন মান মানে শুধু একটা INSERT, আর লেবেল আর রং পাশে Column হিসেবে রাখা যায়",
            isCorrect: true,
            explanation: "ঠিক। তালিকা যখন বদলায় আর সাথে বাড়তি তথ্য লাগে, তখন তালিকাটা Data হওয়াই স্বাভাবিক। দাম একটাই: নাম দেখাতে JOIN।",
          },
          {
            key: "C",
            text: "text আর CHECK, কারণ Island Tours এ তাই আছে",
            isCorrect: false,
            explanation: "প্রতিটা নতুন অবস্থায় Constraint মুছে নতুন করে লিখতে হবে, আর লেবেল রাখার জায়গা নেই। Island Tours এর তালিকা স্থির বলে CHECK সেখানে ঠিক।",
          },
          {
            key: "D",
            text: "কয়েকটা boolean Column, প্রতিটা অবস্থার জন্য একটা",
            isCorrect: false,
            explanation: "অর্থহীন মিলন জমা হবে, আর প্রতিটা নতুন অবস্থায় নতুন Column লাগবে। অংশ 005 এর ভুল।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Saint Martin এর হোটেল ঘরের Table",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner to Intermediate",
    tasks: [
      <span key="1">
        <strong>ঘরের Table নকশা:</strong> Island Tours এখন Saint Martin এর হোটেল ঘরও দেবে। <code className={CODE}>hw_rooms</code>{" "}
        নামে একটা Table বানান: ঘরের পরিচয় (uuid, কোন Version কেন, এক লাইনে লিখুন), সমুদ্রমুখী কিনা, এসি আছে কিনা, ঘরের ধরন
        (single, double, family, এই ক্রমে)। প্রতিটা boolean Column এ NOT NULL আর DEFAULT রাখবেন কিনা, কারণ সহ লিখুন।
      </span>,
      <span key="2">
        <strong>পুরনো Data অনুবাদ:</strong> হোটেলের পুরনো তালিকায় সমুদ্রমুখী Column এ লেখা আছে Yes, yes, হ্যাঁ, Y, No, না আর ফাঁকা।
        VALUES দিয়ে এই সাতটা লেখা বানিয়ে একটা CASE লিখুন, যেটা প্রতিটাকে true, false বা NULL বানায়। তারপর দেখান, সরাসরি
        ::boolean করলে কোন লেখাগুলোতে Error আসে।
      </span>,
      <span key="3">
        <strong>v4 বনাম v7 পরীক্ষা:</strong> generate_series দিয়ে ১০০০টা Row বানান, প্রতিটায় gen_random_uuid() আর uuidv7()।
        দুটো আলাদা Query তে গুনে দেখুন, প্রতিটা Column অনুযায়ী সাজালে কতগুলো Row তাদের তৈরির ক্রমের জায়গাতেই থাকে। তারপর
        uuid_extract_timestamp() দিয়ে v7 এর সময় দেখুন।
      </span>,
      <span key="4">
        <strong>enum এর জীবনচক্র:</strong> Task 1 এর ঘরের ধরনের enum এ suite যোগ করুন family এর পরে, double এর নাম বদলে twin রাখুন,
        তারপর single বাদ দিন অংশ 011 এর চার ধাপের স্থানান্তরে। প্রতিটা ধাপের পরে pg_enum পড়ে ফলাফল লিখে রাখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> বাতির সুইচ, জাতীয় পরিচয়পত্রের মতো এলোমেলো নম্বর, আর Form এর Dropdown, এই তিনটা
        উদাহরণ দিয়ে একজন বন্ধুকে বোঝান boolean, uuid আর enum কী, আর কেন text Column দিয়ে এই তিনটা কাজ করা বিপদ।
      </span>,
    ],
    deliverables: [
      <span key="d1">hw_rooms এর CREATE TYPE আর CREATE TABLE, প্রতিটা Column এর পাশে এক লাইনের কারণ</span>,
      <span key="d2">অনুবাদের CASE Query, তার ৭টা Row, আর Error দেওয়া লেখার তালিকা</span>,
      <span key="d3">v4 আর v7 এর দুটো গোনার Query আর দুটো সংখ্যা</span>,
      <span key="d4">enum এর প্রতিটা ধাপের Statement আর pg_enum এর ফলাফল</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ boolean, uuid আর enum",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ। নিজের PostgreSQL 18 লাগবে, কারণ uuidv7() 18 এ নতুন।",
    stepName: "DRILL",
    steps: [
      {
        title: "boolean এর লেখা",
        description:
          "প্রথম ফাইলের তিনটা Query। প্রথমটায় t f t f t t t f, দ্বিতীয়টায় 22P02 Error, তৃতীয়টায় তিন অবস্থার ছক।",
      },
      {
        title: "boolean দিয়ে প্রশ্ন",
        description:
          "দ্বিতীয় ফাইলে চালু 8, বন্ধ 1, সব চালু নয়। তারপর অঞ্চল অনুযায়ী ৩টা Row: Chattogram 5 f, Khulna 1 t, Sylhet 2 t।",
      },
      {
        title: "uuid চেনা",
        description:
          "তৃতীয় ফাইলের শুরুতে SET TIME ZONE রাখুন। তৈরির সময় 2026-10-17 17:14:53.014+06, Version 4, দুই চেহারার UUID সমান, আর ১৬ বনাম ৩৭ Byte।",
      },
      {
        title: "v4 আর v7 সাজানো",
        description:
          "চতুর্থ ফাইলে v7 অনুযায়ী সাজালে n সবসময় 1 থেকে 5। v4 এর ক্রম প্রতিবার আলাদা, v7 এর সবসময় 1,2,3,4,5।",
      },
      {
        title: "enum এর জীবনচক্র",
        description:
          "পঞ্চম ফাইলে pg_enum এর ৫টা Row: deck 0, economy 1, business 1.5, private_cabin 2, suite 3। তারপর ঘোষণার ক্রমে ৩ যাত্রী, আর Cabin এ Error।",
      },
      {
        title: "তিন পথ, তিন Error",
        description:
          "ষষ্ঠ ফাইলে তিনটা Table, তারপর একই ভুল বানান তিনটা আলাদা Error দেয়: 22P02, 23514, 23503। শেষে Lookup Table এ waitlisted, কোনো ALTER ছাড়াই।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-boolean-inputs.sql",
        code: `SELECT 'yes'::boolean AS a, 'off'::boolean AS b, '1'::boolean AS c, 'f'::boolean AS d,
       ' TRUE '::boolean AS e, 'tr'::boolean AS f, 'Y'::boolean AS g, 'n'::boolean AS h;
-- t | f | t | f | t | t | t | f

SELECT 'o'::boolean;
-- ERROR:  invalid input syntax for type boolean: "o"

SELECT v, v IS TRUE AS is_true, v IS NOT TRUE AS is_not_true, v IS UNKNOWN AS is_unknown
FROM (VALUES (true), (false), (NULL::boolean)) AS s(v);
-- (3 rows)
--  t | t | f | f
--  f | f | t | f
--    | f | t | t`,
      },
      {
        language: "sql",
        filename: "02-boolean-questions.sql",
        code: `SELECT count(*) FILTER (WHERE is_active)     AS active,
       count(*) FILTER (WHERE NOT is_active) AS inactive,
       bool_and(is_active)                   AS all_active
FROM tours;
-- 8 | 1 | f

SELECT ds.region,
       count(*) FILTER (WHERE t.is_active) AS active_tours,
       bool_and(t.is_active)               AS all_active
FROM tours t
JOIN destinations ds ON ds.destination_id = t.destination_id
GROUP BY ds.region
ORDER BY ds.region;
-- (3 rows)
--  Chattogram | 5 | f
--  Khulna     | 1 | t
--  Sylhet     | 2 | t`,
      },
      {
        language: "sql",
        filename: "03-uuid-basics.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

SELECT uuid_extract_timestamp('01a14992-63d6-75d9-b2d2-4004355f555e') AS made_at,
       uuid_extract_version('a69655ac-fb1c-4f2d-9860-ec3bd1265430')   AS v4_version;
-- 2026-10-17 17:14:53.014+06 | 4

SELECT 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11'::uuid
     = '{a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11}'::uuid AS same;
-- t

CREATE TABLE buenum_sizes (as_uuid uuid, as_text text);
INSERT INTO buenum_sizes VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
SELECT pg_column_size(as_uuid) AS uuid_bytes, pg_column_size(as_text) AS text_bytes
FROM buenum_sizes;
-- 16 | 37
DROP TABLE buenum_sizes;`,
      },
      {
        language: "sql",
        filename: "04-uuid-order.sql",
        code: `SELECT n, uuidv7() AS v7
FROM generate_series(1, 5) AS n
ORDER BY v7;
-- (5 rows), n এর ক্রম 1, 2, 3, 4, 5; UUID গুলো প্রতিবার নতুন

SELECT string_agg(n::text, ',' ORDER BY v4) AS order_after_sort
FROM (SELECT n, gen_random_uuid() AS v4 FROM generate_series(1, 5) AS n) AS s;
-- প্রতিবার আলাদা, যেমন একবার এসেছিল 2,3,5,1,4

SELECT string_agg(n::text, ',' ORDER BY v7) AS order_after_sort
FROM (SELECT n, uuidv7() AS v7 FROM generate_series(1, 5) AS n) AS s;
-- 1,2,3,4,5`,
      },
      {
        language: "sql",
        filename: "05-enum-lifecycle.sql",
        code: `DROP TABLE IF EXISTS buenum_cabins;
DROP TYPE IF EXISTS buenum_seat_class;
CREATE TYPE buenum_seat_class AS ENUM ('economy', 'cabin');
ALTER TYPE buenum_seat_class ADD VALUE 'suite';
ALTER TYPE buenum_seat_class ADD VALUE 'deck' BEFORE 'economy';
ALTER TYPE buenum_seat_class ADD VALUE 'business' AFTER 'economy';
ALTER TYPE buenum_seat_class RENAME VALUE 'cabin' TO 'private_cabin';

SELECT enumlabel, enumsortorder
FROM pg_enum
WHERE enumtypid = 'buenum_seat_class'::regtype
ORDER BY enumsortorder;
-- (5 rows)
--  deck 0 | economy 1 | business 1.5 | private_cabin 2 | suite 3

CREATE TABLE buenum_cabins (passenger text NOT NULL, seat_class buenum_seat_class NOT NULL);
INSERT INTO buenum_cabins VALUES ('Rahim', 'private_cabin'), ('Nusrat', 'deck'), ('Tanvir', 'business');
SELECT passenger, seat_class FROM buenum_cabins ORDER BY seat_class;
-- Nusrat deck | Tanvir business | Rahim private_cabin

INSERT INTO buenum_cabins VALUES ('Sabbir', 'Cabin');
-- ERROR:  invalid input value for enum buenum_seat_class: "Cabin"

DROP TABLE buenum_cabins;
DROP TYPE buenum_seat_class;`,
      },
      {
        language: "sql",
        filename: "06-three-ways.sql",
        code: `${WAYS_SETUP_SQL}
-- enum 1 | check 1 | lookup 1

INSERT INTO buenum_way_enum VALUES (2, 'confirmd');
-- ERROR:  invalid input value for enum buenum_status: "confirmd"
INSERT INTO buenum_way_check VALUES (2, 'confirmd');
-- ERROR:  new row for relation "buenum_way_check" violates check constraint "buenum_way_check_status_check"
INSERT INTO buenum_way_lookup VALUES (2, 'confirmd');
-- ERROR:  insert or update on table "buenum_way_lookup" violates foreign key constraint "buenum_way_lookup_status_fkey"

INSERT INTO buenum_statuses VALUES ('waitlisted', 'অপেক্ষমাণ তালিকা', 4);
INSERT INTO buenum_way_lookup VALUES (3, 'waitlisted');
SELECT w.booking_id, w.status, s.label
FROM buenum_way_lookup w
JOIN buenum_statuses s ON s.code = w.status
ORDER BY w.booking_id;
-- 1 confirmed নিশ্চিত | 3 waitlisted অপেক্ষমাণ তালিকা

DROP TABLE buenum_way_enum, buenum_way_check, buenum_way_lookup, buenum_statuses;
DROP TYPE buenum_status;`,
      },
    ],
  },
};
