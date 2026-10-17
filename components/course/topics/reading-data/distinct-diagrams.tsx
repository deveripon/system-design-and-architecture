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
  label,
  accent,
  faded,
  struck,
  size = 10.5,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  accent?: boolean;
  faded?: boolean;
  struck?: boolean;
  size?: number;
}) {
  return (
    <g opacity={faded ? 0.45 : 1}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.12 : 0.03}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 0.9 : 0.35}
        strokeWidth="1"
      />
      <SketchText x={x + 10} y={y + h / 2 + 4} anchor="start" size={size} accent={accent}>
        {label}
      </SketchText>
      {struck && (
        <line
          x1={x + 6}
          y1={y + h / 2}
          x2={x + w - 6}
          y2={y + h / 2}
          stroke="currentColor"
          strokeOpacity={0.6}
          strokeWidth="1.2"
        />
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. পনেরো Row থেকে চারটা আলাদা মান                                           */
/* ------------------------------------------------------------------------- */

/** customers.country in customer_id order, exactly as the sample data holds it. */
const COUNTRIES = [
  "Bangladesh", "Bangladesh", "Bangladesh", "Bangladesh", "Bangladesh",
  "Bangladesh", "Bangladesh", "Bangladesh", "India", "Malaysia",
  "United Kingdom", "Bangladesh", "Bangladesh", "Bangladesh", "Bangladesh",
];

const UNIQUE_COUNTRIES = [
  { name: "Bangladesh", times: 12 },
  { name: "India", times: 1 },
  { name: "Malaysia", times: 1 },
  { name: "United Kingdom", times: 1 },
];

export function DistinctFunnelDiagram() {
  const rowH = 20;
  const top = 46;
  const leftX = 40;
  const rightX = 520;
  const rightTop = 120;
  const rightGap = 46;
  // The first time each value appears is the row DISTINCT keeps.
  const firstSeen = new Set(COUNTRIES.map((c) => COUNTRIES.indexOf(c)));

  return (
    <Sketch
      label="Diagram: SELECT country বনাম SELECT DISTINCT country"
      height={380}
      minWidth={760}
      viewBox="0 0 800 380"
      caption="বাঁদিকে customers Table এর country Column, পনেরোটা Row, যেভাবে Data তে আছে। DISTINCT প্রতিটা মান প্রথমবার দেখলে রাখে, পরেরবার একই মান এলে বাদ দেয়। ডানে যা থাকে সেটাই উত্তর: চারটা আলাদা দেশ। কোন মান কতবার ছিল, সেটা DISTINCT এর উত্তরে আর থাকে না।"
    >
      <Arrow id="distinct-funnel-arrow" />
      <SketchText x={leftX} y={26} anchor="start" size={11} bold>
        SELECT country (15 rows)
      </SketchText>
      {COUNTRIES.map((c, i) => (
        <Cell
          key={i}
          x={leftX}
          y={top + i * rowH}
          w={190}
          h={rowH - 3}
          label={c}
          accent={firstSeen.has(i)}
          struck={!firstSeen.has(i)}
          faded={!firstSeen.has(i)}
          size={10}
        />
      ))}

      <line
        x1={260}
        y1={200}
        x2={490}
        y2={200}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#distinct-funnel-arrow)"
      />
      <SketchText x={375} y={188} size={12} bold accent>
        DISTINCT
      </SketchText>
      <SketchText x={375} y={222} size={10} body opacity={0.8}>
        প্রথমবার দেখা মান রাখা হয়
      </SketchText>
      <SketchText x={375} y={238} size={10} body opacity={0.8}>
        আবার দেখা মান বাদ
      </SketchText>

      <SketchText x={rightX} y={rightTop - 22} anchor="start" size={11} bold accent>
        SELECT DISTINCT country (4 rows)
      </SketchText>
      {UNIQUE_COUNTRIES.map((u, i) => (
        <g key={u.name}>
          <Cell x={rightX} y={rightTop + i * rightGap} w={200} h={30} label={u.name} accent size={11} />
          <SketchText x={rightX + 210} y={rightTop + i * rightGap + 19} anchor="start" size={9.5} body opacity={0.7}>
            {u.times === 1 ? "১ বার ছিল" : "১২ বার ছিল"}
          </SketchText>
        </g>
      ))}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. DISTINCT পুরো Row দেখে                                                   */
/* ------------------------------------------------------------------------- */

/** destinations (region, kind) in destination_id order. */
const DESTINATIONS: [string, string][] = [
  ["Chattogram", "island"],
  ["Chattogram", "beach"],
  ["Khulna", "forest"],
  ["Chattogram", "hills"],
  ["Chattogram", "hills"],
  ["Sylhet", "tea_garden"],
  ["Barishal", "beach"],
];

function uniqueOf(values: string[]) {
  return Array.from(new Set(values)).sort();
}

export function WholeRowDiagram() {
  const regions = uniqueOf(DESTINATIONS.map((d) => d[0]));
  const kinds = uniqueOf(DESTINATIONS.map((d) => d[1]));
  const pairs = uniqueOf(DESTINATIONS.map((d) => `${d[0]} | ${d[1]}`));
  const columns = [
    { title: "DISTINCT region", note: `${regions.length} rows`, items: regions, x: 30, w: 170 },
    { title: "DISTINCT kind", note: `${kinds.length} rows`, items: kinds, x: 250, w: 170 },
    { title: "DISTINCT region, kind", note: `${pairs.length} rows`, items: pairs, x: 470, w: 290 },
  ];

  return (
    <Sketch
      label="Diagram: একই সাত Row, তিন রকম DISTINCT"
      height={330}
      minWidth={780}
      viewBox="0 0 800 330"
      caption="destinations Table এর সাতটা Row থেকে। শুধু region চাইলে চারটা, শুধু kind চাইলে পাঁচটা, আর দুটো একসাথে চাইলে ছয়টা। কারণ DISTINCT কোনো একটা Column দেখে না, SELECT এ যতগুলো Column আছে সবগুলো মিলিয়ে পুরো Row দেখে। সাত Row এর মধ্যে শুধু Chattogram আর hills এর জোড়াটা দুইবার আছে, তাই সেটাই একবার বাদ যায়।"
    >
      {columns.map((col) => (
        <g key={col.title}>
          <SketchText x={col.x} y={30} anchor="start" size={11} bold accent>
            {col.title}
          </SketchText>
          <SketchText x={col.x} y={48} anchor="start" size={9.5} opacity={0.7}>
            {col.note}
          </SketchText>
          {col.items.map((item, i) => (
            <Cell key={item} x={col.x} y={62 + i * 34} w={col.w} h={26} label={item} accent />
          ))}
        </g>
      ))}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. DISTINCT ON: প্রতিটা দলের প্রথম Row                                       */
/* ------------------------------------------------------------------------- */

/** Real bookings of customers 1, 2 and 6, newest first, as ORDER BY customer_id, booked_at DESC sorts them. */
const GROUPS: { customer: string; rows: { id: number; status: string; at: string }[] }[] = [
  {
    customer: "customer 1, Rahim Uddin",
    rows: [
      { id: 17, status: "pending", at: "2026-10-08 09:15" },
      { id: 8, status: "confirmed", at: "2026-02-20 11:20" },
      { id: 1, status: "confirmed", at: "2025-12-20 10:15" },
    ],
  },
  {
    customer: "customer 2, Nusrat Jahan",
    rows: [
      { id: 13, status: "confirmed", at: "2026-09-15 21:10" },
      { id: 2, status: "confirmed", at: "2025-12-28 20:02" },
    ],
  },
  {
    customer: "customer 6, Mitu Rahman",
    rows: [
      { id: 18, status: "cancelled", at: "2026-09-28 23:30" },
      { id: 6, status: "confirmed", at: "2026-01-25 22:40" },
    ],
  },
];

/** Where each customer's block starts: 50, then each block's rows plus a gap. */
const BLOCK_TOPS = GROUPS.map((_, i) =>
  GROUPS.slice(0, i).reduce((top, g) => top + 34 + g.rows.length * 30 + 14, 50)
);
const DIAGRAM_HEIGHT =
  BLOCK_TOPS[BLOCK_TOPS.length - 1] + 34 + GROUPS[GROUPS.length - 1].rows.length * 30 + 14;

export function DistinctOnDiagram() {
  const blocks = GROUPS.map((g, i) => ({ ...g, y: BLOCK_TOPS[i] }));
  const y = DIAGRAM_HEIGHT;

  return (
    <Sketch
      label="Diagram: DISTINCT ON (customer_id), সবচেয়ে নতুন Booking আগে"
      height={y + 10}
      minWidth={760}
      viewBox={`0 0 800 ${y + 10}`}
      caption="ORDER BY customer_id, booked_at DESC প্রথমে Row গুলোকে Customer অনুযায়ী দলে সাজায়, আর প্রতিটা দলের ভেতরে সবচেয়ে নতুন Booking কে উপরে আনে। তারপর DISTINCT ON (customer_id) প্রতিটা দলের ঠিক প্রথম Row টা রাখে, বাকিগুলো ফেলে দেয়। তাই কোন Row টা থাকবে সেটা ঠিক করে ORDER BY, DISTINCT ON নিজে না।"
    >
      <Arrow id="distinct-on-arrow" />
      <SketchText x={30} y={26} anchor="start" size={11} bold>
        ORDER BY customer_id, booked_at DESC
      </SketchText>
      <SketchText x={560} y={26} anchor="start" size={11} bold accent>
        DISTINCT ON রাখে
      </SketchText>
      {blocks.map((b) => (
        <g key={b.customer}>
          <SketchText x={30} y={b.y + 14} anchor="start" size={10} opacity={0.75}>
            {b.customer}
          </SketchText>
          {b.rows.map((r, i) => {
            const rowY = b.y + 24 + i * 30;
            const kept = i === 0;
            return (
              <g key={r.id}>
                <Cell x={30} y={rowY} w={420} h={24} label="" accent={kept} faded={!kept} struck={!kept} />
                <g opacity={kept ? 1 : 0.45}>
                  <SketchText x={42} y={rowY + 16} anchor="start" size={10} accent={kept}>
                    {`booking ${r.id}`}
                  </SketchText>
                  <SketchText x={150} y={rowY + 16} anchor="start" size={10} accent={kept}>
                    {r.status}
                  </SketchText>
                  <SketchText x={270} y={rowY + 16} anchor="start" size={10} accent={kept}>
                    {r.at}
                  </SketchText>
                </g>
                {kept && (
                  <>
                    <line
                      x1={460}
                      y1={rowY + 12}
                      x2={550}
                      y2={rowY + 12}
                      stroke="var(--primary)"
                      strokeWidth="1.3"
                      markerEnd="url(#distinct-on-arrow)"
                    />
                    <Cell x={560} y={rowY} w={210} h={24} label={`booking ${r.id}, ${r.status}`} accent size={10} />
                  </>
                )}
              </g>
            );
          })}
        </g>
      ))}
    </Sketch>
  );
}
