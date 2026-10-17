import { Sketch, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* Shared bits                                                               */
/* ------------------------------------------------------------------------- */

function Arrow({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
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
  );
}

function Cell({
  x,
  y,
  w,
  h,
  text,
  accent,
  head,
  dim,
  size = 10,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  accent?: boolean;
  head?: boolean;
  dim?: boolean;
  size?: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? (head ? 0.18 : 0.08) : head ? 0.06 : 0.015}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 0.8 : 0.3}
        strokeWidth="1"
      />
      <SketchText
        x={x + 7}
        y={y + h / 2 + 3.5}
        anchor="start"
        size={size}
        bold={head}
        accent={accent && head}
        opacity={dim ? 0.35 : 0.9}
      >
        {text}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. একটা SELECT এর অংশগুলো                                                 */
/* ------------------------------------------------------------------------- */

const PARTS = [
  { text: "SELECT", w: 92, label: "Keyword", sub: "আমি পড়তে চাই", accent: false },
  { text: "title, price_bdt", w: 196, label: "SELECT list", sub: "কোন কোন Column", accent: true },
  { text: "FROM", w: 72, label: "Keyword", sub: "কোথা থেকে", accent: false },
  { text: "tours", w: 92, label: "Table", sub: "কোন Table", accent: true },
  { text: ";", w: 40, label: "শেষ", sub: "বাক্য শেষ", accent: false },
];

export function SelectAnatomyDiagram() {
  const gap = 14;
  const total = PARTS.reduce((s, p) => s + p.w, 0) + gap * (PARTS.length - 1);
  const start = (880 - total) / 2;
  // Where each part begins: the widths of every part before it, plus the gaps.
  const starts = PARTS.map(
    (_, i) => start + PARTS.slice(0, i).reduce((s, p) => s + p.w + gap, 0),
  );
  return (
    <Sketch
      label="Anatomy of a SELECT"
      height={210}
      minWidth={760}
      viewBox="0 0 880 210"
      caption="সবচেয়ে ছোট পূর্ণ SELECT এর পাঁচটা টুকরো। SELECT আর FROM হলো Keyword, মানে SQL এর নিজের শব্দ। মাঝখানের দুটো ঘর আপনি নিজে ভরেন: কোন Column চাই, আর কোন Table থেকে। শেষের Semicolon বলে দেয় বাক্যটা এখানে শেষ।"
    >
      {PARTS.map((part, i) => {
        const px = starts[i];
        return (
          <g key={part.text}>
            <rect
              x={px}
              y={48}
              width={part.w}
              height={52}
              fill={part.accent ? "var(--primary)" : "currentColor"}
              fillOpacity={part.accent ? 0.1 : 0.04}
              stroke={part.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={part.accent ? 0.9 : 0.45}
              strokeWidth="1.3"
            />
            <SketchText x={px + part.w / 2} y={79} size={14} bold accent={part.accent}>
              {part.text}
            </SketchText>
            <line
              x1={px + part.w / 2}
              y1={104}
              x2={px + part.w / 2}
              y2={128}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeDasharray="3 3"
            />
            <SketchText x={px + part.w / 2} y={146} size={9.5} bold accent={part.accent}>
              {part.label}
            </SketchText>
            <SketchText x={px + part.w / 2} y={166} size={10} body opacity={0.8}>
              {part.sub}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. পুরো Table থেকে শুধু বাছাই করা Column                                    */
/* ------------------------------------------------------------------------- */

const TOUR_COLUMNS = [
  "tour_id",
  "title",
  "destination_id",
  "guide_id",
  "duration_days",
  "price_bdt",
  "max_seats",
  "is_active",
];

const TOUR_ROWS = [
  ["1", "Saint Martin Island…", "1", "1", "3", "12500.00", "20", "t"],
  ["2", "Cox's Bazar Beach…", "2", "2", "2", "8500.00", "30", "t"],
  ["3", "Sundarbans Mangrove…", "3", "3", "3", "18000.00", "16", "t"],
  ["4", "Sajek Valley Cloud…", "4", "1", "2", "9500.00", "18", "t"],
];

const PICKED = new Set(["title", "price_bdt"]);

export function ProjectionDiagram() {
  const widths = [50, 132, 82, 58, 82, 72, 64, 58];
  const x0 = 20;
  const y0 = 46;
  const h = 26;
  const resultX = 712;
  const resultWidths = [150, 84];
  return (
    <Sketch
      label="Picking Columns From a Table"
      height={330}
      minWidth={960}
      viewBox="0 0 980 330"
      caption="বাম দিকে tours Table এর আটটা Column (আসলে নয়টা, created_at জায়গার অভাবে বাদ রাখা হয়েছে) আর প্রথম চারটা Row। SELECT title, price_bdt শুধু রঙ করা দুটো Column তুলে নিয়ে ডান দিকে নতুন একটা ছোট Table বানায়। Row একটাও বাদ যায়নি, নয়টা Row ই আসে, শুধু Column কমেছে। আসল tours Table এ কোনো বদল হয় না।"
    >
      <Arrow id="select-projection-arrow" />
      <SketchText x={x0} y={30} anchor="start" size={10} bold>
        tours (পুরো Table)
      </SketchText>
      {TOUR_COLUMNS.map((col, c) => {
        const cx = x0 + widths.slice(0, c).reduce((s, w) => s + w, 0);
        return (
          <g key={col}>
            <Cell x={cx} y={y0} w={widths[c]} h={h} text={col} head accent={PICKED.has(col)} size={8.5} />
            {TOUR_ROWS.map((row, r) => (
              <Cell
                key={r}
                x={cx}
                y={y0 + h * (r + 1)}
                w={widths[c]}
                h={h}
                text={row[c]}
                accent={PICKED.has(col)}
                dim={!PICKED.has(col)}
                size={9}
              />
            ))}
          </g>
        );
      })}
      <SketchText x={x0} y={y0 + h * 5 + 20} anchor="start" size={9.5} opacity={0.6}>
        … আরও ৫টা Row, মোট ৯টা
      </SketchText>

      <path
        d={`M ${x0 + 600} ${y0 + 75} C 650 ${y0 + 75}, 660 ${y0 + 75}, ${resultX - 12} ${y0 + 75}`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#select-projection-arrow)"
      />
      <SketchText x={x0 + 652} y={y0 + 62} size={9.5} accent bold>
        SELECT
      </SketchText>
      <SketchText x={x0 + 652} y={y0 + 98} size={9} opacity={0.75}>
        title, price_bdt
      </SketchText>

      <SketchText x={resultX} y={30} anchor="start" size={10} bold accent>
        ফলাফল (নতুন Table)
      </SketchText>
      {["title", "price_bdt"].map((col, c) => {
        const cx = resultX + (c === 0 ? 0 : resultWidths[0]);
        const source = TOUR_COLUMNS.indexOf(col);
        return (
          <g key={col}>
            <Cell x={cx} y={y0} w={resultWidths[c]} h={h} text={col} head accent size={9} />
            {TOUR_ROWS.map((row, r) => (
              <Cell key={r} x={cx} y={y0 + h * (r + 1)} w={resultWidths[c]} h={h} text={row[source]} accent size={9} />
            ))}
          </g>
        );
      })}
      <SketchText x={resultX} y={y0 + h * 5 + 20} anchor="start" size={9.5} opacity={0.6}>
        … নয়টা Row ই আসে, Column শুধু দুটো
      </SketchText>
      <SketchText x={490} y={300} size={10} body opacity={0.8}>
        Column বাছাই করা মানে খাড়া দিকে কাটা। Row ছাঁকা (WHERE) আসবে Lesson 03 এ।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Expression প্রতিটা Row এর জন্য আলাদা করে                                */
/* ------------------------------------------------------------------------- */

const EXPR_ROWS = [
  { title: "Saint Martin Island Escape", price: "12500.00", out: "25000.00" },
  { title: "Cox's Bazar Beach Weekend", price: "8500.00", out: "17000.00" },
  { title: "Ratargul Swamp Boat Day", price: "3500.00", out: "7000.00" },
];

export function RowByRowDiagram() {
  return (
    <Sketch
      label="An Expression Runs Once per Row"
      height={250}
      minWidth={820}
      viewBox="0 0 860 250"
      caption="SELECT title, price_bdt * 2 FROM tours লিখলে PostgreSQL প্রতিটা Row এর কাছে গিয়ে সেই Row এর price_bdt নিয়ে দুই দিয়ে গুণ করে, তারপর পরের Row তে যায়। গুণফল কোথাও জমা থাকে না, শুধু এই ফলাফলের জন্য তৈরি হয়। Column এর নাম দেননি বলে PostgreSQL নাম দিয়েছে ?column?।"
    >
      <Arrow id="select-row-arrow" />
      <SketchText x={40} y={36} anchor="start" size={10} bold>
        tours এর একেকটা Row
      </SketchText>
      <SketchText x={600} y={36} anchor="start" size={10} bold accent>
        ফলাফলের Row
      </SketchText>
      {EXPR_ROWS.map((row, i) => {
        const y = 56 + i * 58;
        return (
          <g key={row.title}>
            <Cell x={40} y={y} w={210} h={30} text={row.title} size={9.5} />
            <Cell x={250} y={y} w={84} h={30} text={row.price} accent size={10} />
            <line
              x1={344}
              y1={y + 15}
              x2={414}
              y2={y + 15}
              stroke="var(--primary)"
              strokeWidth="1.3"
              markerEnd="url(#select-row-arrow)"
            />
            <rect x={424} y={y} width={120} height={30} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeOpacity={0.6} />
            <SketchText x={484} y={y + 19} size={10} accent>
              {row.price} × 2
            </SketchText>
            <line
              x1={550}
              y1={y + 15}
              x2={592}
              y2={y + 15}
              stroke="var(--primary)"
              strokeWidth="1.3"
              markerEnd="url(#select-row-arrow)"
            />
            <Cell x={600} y={y} w={140} h={30} text={row.title.split(" ").slice(0, 2).join(" ") + "…"} size={9.5} />
            <Cell x={740} y={y} w={84} h={30} text={row.out} accent size={10} />
          </g>
        );
      })}
      <SketchText x={430} y={236} size={10} body opacity={0.8}>
        নয়টা Row, তাই গুণ হয় নয়বার। Table এর price_bdt একটুও বদলায় না।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. পুরো নাম আর Table এর ডাকনাম                                             */
/* ------------------------------------------------------------------------- */

export function NameLevelsDiagram() {
  const parts = [
    { text: "public", label: "Schema", x: 120 },
    { text: "tours", label: "Table", x: 300 },
    { text: "title", label: "Column", x: 480 },
  ];
  return (
    <Sketch
      label="Qualified Names and Table Aliases"
      height={260}
      minWidth={760}
      viewBox="0 0 860 260"
      caption="উপরে একটা Column এর পুরো ঠিকানা: Schema, Table, Column, মাঝে বিন্দু। সাধারণত শুধু title লিখলেই চলে, কারণ Table একটাই। নিচে FROM tours AS t লিখে Table কে একটা ছোট ডাকনাম দেওয়া হয়েছে। ডাকনাম দেওয়ার পর সেই Query তে tours নামটা আর চলে না, শুধু t চলে।"
    >
      <Arrow id="select-alias-arrow" />
      {parts.map((p, i) => (
        <g key={p.text}>
          <rect x={p.x - 70} y={40} width={140} height={44} fill="var(--primary)" fillOpacity={i === 2 ? 0.12 : 0.05} stroke="var(--primary)" strokeOpacity={0.7} strokeWidth="1.2" />
          <SketchText x={p.x} y={67} size={14} bold accent={i === 2}>
            {p.text}
          </SketchText>
          <SketchText x={p.x} y={104} size={9.5} opacity={0.75}>
            {p.label}
          </SketchText>
          {i < 2 && (
            <SketchText x={p.x + 90} y={68} size={18} bold>
              .
            </SketchText>
          )}
        </g>
      ))}
      <SketchText x={690} y={60} anchor="start" size={10} body>
        public.tours.title
      </SketchText>
      <SketchText x={690} y={80} anchor="start" size={9.5} body opacity={0.7}>
        এক Column এর পুরো ঠিকানা
      </SketchText>

      <rect x={50} y={140} width={300} height={44} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} />
      <SketchText x={200} y={167} size={12}>
        FROM tours AS t
      </SketchText>
      <path d="M 350 162 H 470" fill="none" stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#select-alias-arrow)" />
      <rect x={480} y={140} width={300} height={44} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeOpacity={0.7} />
      <SketchText x={630} y={167} size={12} accent>
        SELECT t.title, t.price_bdt
      </SketchText>
      <SketchText x={200} y={206} size={9.5} body opacity={0.75}>
        tours এর ডাকনাম t
      </SketchText>
      <SketchText x={630} y={206} size={9.5} body opacity={0.75}>
        এরপর এই Query তে শুধু t, tours না
      </SketchText>
    </Sketch>
  );
}
