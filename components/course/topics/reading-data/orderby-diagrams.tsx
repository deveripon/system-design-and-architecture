import { Sketch, SketchSplit, SketchText } from "../../sketch";

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

function Box({
  x,
  y,
  w,
  h,
  accent,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent?: boolean;
  dashed?: boolean;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill={accent ? "var(--primary)" : "currentColor"}
      fillOpacity={accent ? 0.1 : 0.03}
      stroke={accent ? "var(--primary)" : "currentColor"}
      strokeOpacity={accent ? 0.9 : 0.4}
      strokeWidth="1.2"
      strokeDasharray={dashed ? "5 4" : undefined}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 1. কয়েকটা Column দিয়ে সাজানো: প্রথম চাবি দল বানায়, পরেরটা দলের ভেতরে সাজায়    */
/* ------------------------------------------------------------------------- */

const COUNTRIES = [
  { name: "Bangladesh", rows: 12 },
  { name: "India", rows: 1 },
  { name: "Malaysia", rows: 1 },
  { name: "United Kingdom", rows: 1 },
];

const BD_CITIES = [
  { name: "Barishal", rows: 1 },
  { name: "Chattogram", rows: 2 },
  { name: "Dhaka", rows: 6 },
  { name: "Khulna", rows: 1 },
  { name: "Rajshahi", rows: 1 },
  { name: "Sylhet", rows: 1 },
];

/** Where each group starts, counted in rows from the top of its column. */
function withOffsets<T extends { rows: number }>(groups: T[]) {
  return groups.map((g, i) => ({
    ...g,
    start: groups.slice(0, i).reduce((sum, prev) => sum + prev.rows, 0),
  }));
}

const DHAKA_NAMES = [
  "Imran Kabir",
  "Mitu Rahman",
  "Nusrat Jahan",
  "Rahim Uddin",
  "Shuvo Das",
  "Sumaiya Islam",
];

export function SortKeysDiagram() {
  const top = 70;
  const unit = 17;
  return (
    <Sketch
      label="ORDER BY country, city, full_name"
      height={380}
      minWidth={900}
      viewBox="0 0 900 380"
      caption="প্রথম চাবি country পনেরো জন Customer কে চারটা দলে ভাগ করে। দ্বিতীয় চাবি city শুধু একই দেশের ভেতরে কাজ করে, যেমন Bangladesh এর বারোজনকে ছয়টা শহরে। তৃতীয় চাবি full_name শুধু একই শহরের ভেতরে, যেমন Dhaka এর ছয়জন। আগের চাবিতে যাঁরা আলাদা হয়ে গেছেন, পরের চাবি তাঁদের আর ছোঁয় না।"
    >
      <Arrow id="orderby-keys-arrow" />
      {[
        { x: 40, label: "চাবি ১: country" },
        { x: 330, label: "চাবি ২: city" },
        { x: 620, label: "চাবি ৩: full_name" },
      ].map((c) => (
        <SketchText key={c.label} x={c.x + 110} y={40} size={11} bold accent body>
          {c.label}
        </SketchText>
      ))}

      {withOffsets(COUNTRIES).map((c) => {
        const y = top + c.start * unit;
        const h = c.rows * unit;
        return (
          <g key={c.name}>
            <Box x={40} y={y} w={220} h={h - 4} accent={c.name === "Bangladesh"} />
            <SketchText x={150} y={y + h / 2} size={10.5} accent={c.name === "Bangladesh"}>
              {`${c.name} (${c.rows})`}
            </SketchText>
          </g>
        );
      })}

      {withOffsets(BD_CITIES).map((c) => {
        const y = top + c.start * unit;
        const h = c.rows * unit;
        return (
          <g key={c.name}>
            <Box x={330} y={y} w={220} h={h - 4} accent={c.name === "Dhaka"} />
            <SketchText x={440} y={y + h / 2 + 1} size={10} accent={c.name === "Dhaka"}>
              {`${c.name} (${c.rows})`}
            </SketchText>
          </g>
        );
      })}

      {DHAKA_NAMES.map((n, i) => {
        const y = top + 3 * unit + i * unit;
        return (
          <g key={n}>
            <Box x={620} y={y} w={220} h={unit - 4} accent />
            <SketchText x={630} y={y + 10} size={9.5} anchor="start" accent>
              {`${i + 1}. ${n}`}
            </SketchText>
          </g>
        );
      })}

      <line
        x1={262}
        y1={top + 100}
        x2={326}
        y2={top + 100}
        stroke="var(--primary)"
        strokeWidth="1.3"
        markerEnd="url(#orderby-keys-arrow)"
      />
      <line
        x1={552}
        y1={top + 3 * unit + 50}
        x2={616}
        y2={top + 3 * unit + 50}
        stroke="var(--primary)"
        strokeWidth="1.3"
        markerEnd="url(#orderby-keys-arrow)"
      />
      <SketchText x={150} y={top + 15 * unit + 30} size={9.5} opacity={0.7} body>
        দেশ অনুযায়ী চার দল
      </SketchText>
      <SketchText x={440} y={top + 15 * unit + 30} size={9.5} opacity={0.7} body>
        Bangladesh এর ভেতরে শহর
      </SketchText>
      <SketchText x={730} y={top + 15 * unit + 30} size={9.5} opacity={0.7} body>
        Dhaka এর ভেতরে নাম
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. NULL কোথায় বসে: PostgreSQL বনাম MySQL                                    */
/* ------------------------------------------------------------------------- */

function NullColumn({
  x,
  title,
  values,
}: {
  x: number;
  title: string;
  values: (string | null)[];
}) {
  return (
    <g>
      <SketchText x={x + 50} y={22} size={10} bold>
        {title}
      </SketchText>
      {values.map((v, i) => (
        <g key={`${title}-${i}`}>
          <Box x={x} y={34 + i * 26} w={100} h={22} accent={v === null} dashed={v === null} />
          <SketchText x={x + 50} y={49 + i * 26} size={10} accent={v === null}>
            {v ?? "NULL"}
          </SketchText>
        </g>
      ))}
    </g>
  );
}

export function NullPlacementSplit() {
  return (
    <SketchSplit
      label="ORDER BY guide_id: NULL কোথায় বসে"
      caption="একই Query, একই Data, কিন্তু দুই Database NULL কে দুই জায়গায় বসায়। PostgreSQL NULL কে সবচেয়ে বড় মান ধরে, তাই ASC তে নিচে আর DESC তে উপরে। MySQL ধরে সবচেয়ে ছোট, তাই ঠিক উল্টো। দুটো ফলাফলই এই লেসনের Container এ চালিয়ে দেখা।"
      panels={[
        {
          title: "PostgreSQL",
          sub: "NULL সবচেয়ে বড়",
          viewBox: "0 0 260 170",
          height: 170,
          children: (
            <>
              <NullColumn x={10} title="ASC" values={["1", "2", "3", "4", null]} />
              <NullColumn x={150} title="DESC" values={[null, "4", "3", "2", "1"]} />
            </>
          ),
        },
        {
          title: "MySQL",
          sub: "NULL সবচেয়ে ছোট",
          viewBox: "0 0 260 170",
          height: 170,
          children: (
            <>
              <NullColumn x={10} title="ASC" values={[null, "1", "2", "3", "4"]} />
              <NullColumn x={150} title="DESC" values={["4", "3", "2", "1", null]} />
            </>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. ORDER BY কখন চলে: SELECT এর পরে, LIMIT এর আগে                             */
/* ------------------------------------------------------------------------- */

const STEPS = [
  { title: "FROM", sub: "কোন Table" },
  { title: "WHERE", sub: "কোন Row থাকবে" },
  { title: "SELECT", sub: "Column আর Alias তৈরি" },
  { title: "ORDER BY", sub: "এখানে সাজানো", accent: true },
  { title: "LIMIT", sub: "উপরের কয়েকটা" },
];

export function OrderByStepDiagram() {
  const w = 150;
  const gap = 28;
  return (
    <Sketch
      label="Query চলার ক্রমে ORDER BY এর জায়গা"
      height={200}
      minWidth={900}
      viewBox="0 0 900 200"
      caption="Database আগে Row খুঁজে বের করে, তারপর SELECT এর Column আর Alias বানায়, তারপর সাজায়, আর সবশেষে দরকার হলে উপর থেকে কয়েকটা কেটে নেয়। ORDER BY যেহেতু SELECT এর পরে চলে, তাই সে SELECT এ দেওয়া Alias চিনতে পারে, যেটা WHERE পারে না। পুরো ক্রমটা এই মডিউলের Lesson 02 তে।"
    >
      <Arrow id="orderby-step-arrow" />
      {STEPS.map((s, i) => {
        const x = 20 + i * (w + gap);
        return (
          <g key={s.title}>
            <Box x={x} y={60} w={w} h={64} accent={s.accent} />
            <SketchText x={x + w / 2} y={88} size={12} bold accent={s.accent}>
              {s.title}
            </SketchText>
            <SketchText x={x + w / 2} y={108} size={9.5} body opacity={0.8} accent={s.accent}>
              {s.sub}
            </SketchText>
            <SketchText x={x + w / 2} y={42} size={9} opacity={0.6}>
              {`ধাপ ${i + 1}`}
            </SketchText>
            {i < STEPS.length - 1 && (
              <line
                x1={x + w + 3}
                y1={92}
                x2={x + w + gap - 3}
                y2={92}
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#orderby-step-arrow)"
              />
            )}
          </g>
        );
      })}
      <path
        d={`M ${20 + 2 * (w + gap) + w / 2} 128 V 160 H ${20 + 3 * (w + gap) + w / 2} V 130`}
        fill="none"
        stroke="var(--primary)"
        strokeDasharray="4 3"
        strokeWidth="1.2"
        markerEnd="url(#orderby-step-arrow)"
      />
      <SketchText x={20 + 2.5 * (w + gap) + w / 2} y={178} size={9.5} body accent>
        Alias এখানে জন্মায়, ORDER BY তাকে দেখতে পায়
      </SketchText>
    </Sketch>
  );
}
