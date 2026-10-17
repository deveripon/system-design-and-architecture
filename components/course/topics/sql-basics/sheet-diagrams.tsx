import { Sketch, SketchBox, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* 1. একটা ফাইল, অনেক কপি: কোনটা আসল?                                          */
/* ------------------------------------------------------------------------- */

const OFFICE_FILES = [
  "bookings.xlsx",
  "bookings_final.xlsx",
  "bookings_final_v2.xlsx",
];
const AGENT_FILES = [
  "bookings_final.xlsx",
  "bookings (1).xlsx",
  "bookings_final_REAL.xlsx",
];

function FileList({
  x,
  title,
  sub,
  files,
  seats,
}: {
  x: number;
  title: string;
  sub: string;
  files: string[];
  seats: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={40}
        width={260}
        height={230}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth="1.2"
      />
      <SketchText x={x + 130} y={64} size={11} bold>
        {title}
      </SketchText>
      <SketchText x={x + 130} y={82} size={9.5} body opacity={0.7}>
        {sub}
      </SketchText>
      {files.map((file, i) => {
        const last = i === files.length - 1;
        return (
          <g key={file}>
            <rect
              x={x + 20}
              y={98 + i * 30}
              width={220}
              height={22}
              fill={last ? "var(--primary)" : "transparent"}
              fillOpacity={last ? 0.1 : 0}
              stroke={last ? "var(--primary)" : "currentColor"}
              strokeOpacity={last ? 0.9 : 0.3}
            />
            <SketchText
              x={x + 30}
              y={113 + i * 30}
              size={10}
              anchor="start"
              accent={last}
              opacity={last ? 1 : 0.75}
            >
              {file}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={x + 130} y={214} size={10} body opacity={0.8}>
        Saint Martin, ২০ নভেম্বর
      </SketchText>
      <SketchText x={x + 130} y={240} size={13} bold accent>
        {seats}
      </SketchText>
    </g>
  );
}

/**
 * The same bookings file lives on two machines and in a chat thread, and each
 * copy has drifted. Nobody can say which one is true.
 */
export function VersionChaosDiagram() {
  return (
    <Sketch
      label="একটা ফাইল, অনেক কপি"
      height={300}
      minWidth={820}
      viewBox="0 0 860 300"
      caption="অফিসের ল্যাপটপে একটা কপি, এজেন্টের ফোনে আরেকটা, আর WhatsApp এর চ্যাটে আরও দুটো। প্রতিটা কপি কেউ না কেউ একটু একটু বদলেছেন। একই ট্যুরের একই তারিখের জন্য এক ফাইল বলছে ১টা সিট বাকি, আরেক ফাইল বলছে ৩টা। ফাইল নিজে কখনো বলবে না কোনটা আসল।"
    >
      <FileList
        x={30}
        title="অফিসের ল্যাপটপ"
        sub="সকালে ঠিক করা ফাইল"
        files={OFFICE_FILES}
        seats="১টা সিট বাকি"
      />
      <FileList
        x={570}
        title="এজেন্টের ফোন"
        sub="গতকাল WhatsApp এ পাওয়া কপি"
        files={AGENT_FILES}
        seats="৩টা সিট বাকি"
      />
      <SketchText x={430} y={140} size={40} bold accent>
        ?
      </SketchText>
      <SketchText x={430} y={172} size={10.5} body>
        কোনটা সত্যি?
      </SketchText>
      <line
        x1={300}
        y1={155}
        x2={385}
        y2={155}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeDasharray="4 3"
      />
      <line
        x1={475}
        y1={155}
        x2={560}
        y2={155}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeDasharray="4 3"
      />
      <SketchText x={430} y={232} size={9.5} body opacity={0.75}>
        Email আর WhatsApp এ ঘোরাঘুরি
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Sheet এর প্রতিটা সমস্যা, আর Database এ তার উত্তর                         */
/* ------------------------------------------------------------------------- */

const WISHES = [
  { problem: "একই Customer তিন বানানে", feature: "Primary Key, UNIQUE", where: "Module 09" },
  { problem: "একই দাম চল্লিশ জায়গায় লেখা", feature: "Normalization", where: "Module 11" },
  { problem: "ঘরে যা খুশি লেখা যায়", feature: "Data Type, CHECK", where: "Module 09" },
  { problem: "শেষ সিট দুইজনের কাছে বিক্রি", feature: "Transaction, Lock", where: "Module 12" },
  { problem: "Sheet গুলো একে অপরকে চেনে না", feature: "Foreign Key, JOIN", where: "Module 06" },
  { problem: "সবাই সবার ফোন নম্বর দেখে", feature: "Role, GRANT", where: "Module 16" },
  { problem: "কে কী বদলেছে কেউ জানে না", feature: "Audit Log", where: "Module 16" },
  { problem: "ভুলে মোছা, ল্যাপটপ নষ্ট", feature: "Backup, Restore", where: "Module 18" },
  { problem: "লাখ Row এ সব ধীর", feature: "Index", where: "Module 13" },
  { problem: "Website এ একসাথে অনেক মানুষ", feature: "Client আর Server", where: "Lesson 06" },
];

/**
 * The wish list the lesson ends on: every spreadsheet pain on the left, the
 * database feature that answers it on the right, and where the track teaches it.
 */
export function WishListDiagram() {
  const top = 56;
  const row = 38;
  return (
    <Sketch
      label="সমস্যা থেকে সমাধান"
      height={top + WISHES.length * row + 20}
      minWidth={820}
      viewBox={`0 0 880 ${top + WISHES.length * row + 20}`}
      caption="বাঁ দিকে Spreadsheet এর প্রতিটা ব্যথা, ডান দিকে Database এর যে জিনিসটা সেই ব্যথা সারায়, আর সেটা এই ট্র্যাকের কোথায় শিখবেন। পুরো ট্র্যাকটাকে এই তালিকার লম্বা উত্তর হিসেবেও পড়া যায়।"
    >
      <defs>
        <marker
          id="sheet-wish-arrow"
          markerWidth={8}
          markerHeight={8}
          refX={7}
          refY={3.5}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--primary)" />
        </marker>
      </defs>
      <SketchText x={30} y={30} size={10} bold anchor="start" opacity={0.7}>
        SPREADSHEET এর ব্যথা
      </SketchText>
      <SketchText x={500} y={30} size={10} bold anchor="start" accent>
        DATABASE এর উত্তর
      </SketchText>
      <SketchText x={850} y={30} size={10} bold anchor="end" opacity={0.7}>
        কোথায় শিখবেন
      </SketchText>
      {WISHES.map((wish, i) => {
        const y = top + i * row;
        return (
          <g key={wish.problem}>
            <rect
              x={20}
              y={y}
              width={380}
              height={28}
              fill="transparent"
              stroke="currentColor"
              strokeOpacity={0.3}
            />
            <SketchText x={34} y={y + 19} size={11} body anchor="start">
              {wish.problem}
            </SketchText>
            <line
              x1={408}
              y1={y + 14}
              x2={486}
              y2={y + 14}
              stroke="var(--primary)"
              strokeWidth="1.3"
              markerEnd="url(#sheet-wish-arrow)"
            />
            <rect
              x={492}
              y={y}
              width={250}
              height={28}
              fill="var(--primary)"
              fillOpacity={0.08}
              stroke="var(--primary)"
              strokeOpacity={0.7}
            />
            <SketchText x={506} y={y + 18} size={11} bold anchor="start" accent>
              {wish.feature}
            </SketchText>
            <SketchText x={850} y={y + 18} size={10} anchor="end" opacity={0.75}>
              {wish.where}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. পুরনো Sheet এর Column গুলো কোন Table এ গেল                               */
/* ------------------------------------------------------------------------- */

const SHEET_COLUMNS = [
  { name: "Booked on", table: "bookings", column: "booked_at" },
  { name: "Customer", table: "customers", column: "full_name" },
  { name: "Phone", table: "customers", column: "phone" },
  { name: "Tour", table: "tours", column: "title" },
  { name: "Price", table: "tours", column: "price_bdt" },
  { name: "Tour date", table: "departures", column: "starts_on" },
  { name: "Seats", table: "bookings", column: "seats" },
  { name: "Total", table: "bookings", column: "total_bdt" },
  { name: "Paid", table: "payments", column: "method, status" },
  { name: "Rating", table: "reviews", column: "rating" },
];

const TABLES = ["customers", "tours", "departures", "bookings", "payments", "reviews"];

/**
 * Every column of the old booking sheet, and the table in the Island Tours
 * database where that fact now lives exactly once.
 */
export function SheetToTablesDiagram() {
  const colTop = 60;
  const colRow = 36;
  const tableTop = 50;
  const tableRow = 64;
  const tableY = (name: string) => tableTop + TABLES.indexOf(name) * tableRow;
  return (
    <Sketch
      label="পুরনো Sheet থেকে নতুন Table"
      height={440}
      minWidth={820}
      viewBox="0 0 880 440"
      caption="বাঁ দিকে পুরনো Booking Sheet এর দশটা Column, ডান দিকে Island Tours Database এর ছয়টা Table। একটা বড় Sheet ভেঙে ছয় জায়গায় গেছে, কারণ প্রতিটা তথ্য একটা নির্দিষ্ট জিনিসের: ফোন নম্বর মানুষের, দাম ট্যুরের, তারিখ যাত্রার। দাগের পাশে লেখা Column এর নাম, Table এর ভেতরে যে নামে এখন তথ্যটা থাকে।"
    >
      <defs>
        <marker
          id="sheet-map-arrow"
          markerWidth={8}
          markerHeight={8}
          refX={7}
          refY={3.5}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--primary)" />
        </marker>
      </defs>
      <rect
        x={20}
        y={20}
        width={200}
        height={colTop + SHEET_COLUMNS.length * colRow - 22}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeDasharray="4 3"
      />
      <SketchText x={120} y={42} size={10.5} bold>
        bookings_final.xlsx
      </SketchText>
      {SHEET_COLUMNS.map((col, i) => {
        const y = colTop + i * colRow;
        const ty = tableY(col.table) + 22;
        return (
          <g key={col.name}>
            <rect
              x={36}
              y={y}
              width={168}
              height={26}
              fill="transparent"
              stroke="currentColor"
              strokeOpacity={0.35}
            />
            <SketchText x={48} y={y + 17} size={10.5} anchor="start">
              {col.name}
            </SketchText>
            <path
              d={`M 206 ${y + 13} C 420 ${y + 13}, 470 ${ty}, 636 ${ty}`}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={0.55}
              strokeWidth="1.1"
              markerEnd="url(#sheet-map-arrow)"
            />
          </g>
        );
      })}
      {TABLES.map((name) => {
        const y = tableY(name);
        const cols = SHEET_COLUMNS.filter((c) => c.table === name)
          .map((c) => c.column)
          .join(", ");
        return (
          <g key={name}>
            <SketchBox x={640} y={y} w={220} h={44} title={name} sub={cols} accent />
          </g>
        );
      })}
    </Sketch>
  );
}
