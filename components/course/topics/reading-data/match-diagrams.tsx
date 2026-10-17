import { Sketch, SketchSplit, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* Shared bits                                                               */
/* ------------------------------------------------------------------------- */

function Arrow({ id, muted }: { id: string; muted?: boolean }) {
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
        <path
          d="M0,0 L7,3.5 L0,7 Z"
          fill={muted ? "currentColor" : "var(--primary)"}
          fillOpacity={muted ? 0.55 : 1}
        />
      </marker>
    </defs>
  );
}

function Chip({
  x,
  y,
  w,
  text,
  accent,
  faded,
}: {
  x: number;
  y: number;
  w: number;
  text: string;
  accent?: boolean;
  faded?: boolean;
}) {
  return (
    <g opacity={faded ? 0.35 : 1}>
      <rect
        x={x}
        y={y}
        width={w}
        height={26}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.12 : 0.04}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 0.9 : 0.4}
        strokeWidth="1.1"
      />
      <SketchText x={x + w / 2} y={y + 17} size={10.5} accent={accent} bold={accent}>
        {text}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. IN: একটা অতিথি তালিকা                                                    */
/* ------------------------------------------------------------------------- */

/** The first ten bookings by id, their real status, and which pass IN ('pending', 'cancelled'). */
const STATUS_ROWS: { id: number; status: string }[] = [
  { id: 5, status: "cancelled" },
  { id: 11, status: "confirmed" },
  { id: 12, status: "cancelled" },
  { id: 13, status: "confirmed" },
  { id: 14, status: "pending" },
  { id: 16, status: "confirmed" },
  { id: 17, status: "pending" },
  { id: 18, status: "cancelled" },
];

export function InListDiagram() {
  const passes = (s: string) => s === "pending" || s === "cancelled";
  return (
    <Sketch
      label="IN: তালিকায় নাম থাকলেই ঢুকতে পারবে"
      height={330}
      minWidth={760}
      viewBox="0 0 760 330"
      caption={
        <>
          বাম দিকে bookings এর কয়েকটা আসল Row। মাঝের দরজায় একটা তালিকা ঝোলানো:
          pending আর cancelled। প্রতিটা Row এর status তালিকার কোনো একটা মানের সাথে
          মিললে সে ডান দিকে পৌঁছায়, না মিললে সেখানেই থেমে যায়। দরজাটা আসলে
          কয়েকটা = আর OR এর সংক্ষিপ্ত রূপ।
        </>
      }
    >
      <Arrow id="match-in-arrow" />
      <Arrow id="match-in-arrow-muted" muted />
      <SketchText x={110} y={24} size={10} bold opacity={0.7}>
        bookings
      </SketchText>
      {STATUS_ROWS.map((row, i) => {
        const y = 38 + i * 34;
        const ok = passes(row.status);
        return (
          <g key={row.id}>
            <Chip x={20} y={y} w={180} text={`#${row.id}  ${row.status}`} accent={ok} faded={!ok} />
            <line
              x1={204}
              y1={y + 13}
              x2={ok ? 600 : 300}
              y2={y + 13}
              stroke={ok ? "var(--primary)" : "currentColor"}
              strokeOpacity={ok ? 0.75 : 0.3}
              strokeWidth="1.2"
              strokeDasharray={ok ? undefined : "4 3"}
              markerEnd={ok ? "url(#match-in-arrow)" : "url(#match-in-arrow-muted)"}
            />
            {ok && <Chip x={604} y={y} w={140} text={`#${row.id}`} accent />}
          </g>
        );
      })}
      <rect
        x={330}
        y={30}
        width={200}
        height={272}
        fill="var(--card)"
        stroke="var(--primary)"
        strokeWidth="1.4"
      />
      <SketchText x={430} y={60} size={11} bold accent>
        WHERE status IN (
      </SketchText>
      <SketchText x={430} y={92} size={11}>
        &apos;pending&apos;,
      </SketchText>
      <SketchText x={430} y={116} size={11}>
        &apos;cancelled&apos;
      </SketchText>
      <SketchText x={430} y={140} size={11} bold accent>
        )
      </SketchText>
      <line x1={350} y1={162} x2={510} y2={162} stroke="currentColor" strokeOpacity={0.25} />
      <SketchText x={430} y={190} size={10} body opacity={0.8}>
        মানে ঠিক এটাই:
      </SketchText>
      <SketchText x={430} y={216} size={10}>
        status = &apos;pending&apos;
      </SketchText>
      <SketchText x={430} y={236} size={10} accent bold>
        OR
      </SketchText>
      <SketchText x={430} y={256} size={10}>
        status = &apos;cancelled&apos;
      </SketchText>
      <SketchText x={674} y={24} size={10} bold accent>
        ফলাফল
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. BETWEEN: দুই মাথাই ভেতরে                                                  */
/* ------------------------------------------------------------------------- */

const PRICES: { title: string; price: number }[] = [
  { title: "Ratargul", price: 3500 },
  { title: "Sylhet", price: 7800 },
  { title: "Cox's Bazar Weekend", price: 8500 },
  { title: "Sajek", price: 9500 },
  { title: "Saint Martin Escape", price: 12500 },
  { title: "Bandarban", price: 14000 },
  { title: "Family Package", price: 15500 },
  { title: "Sundarbans", price: 18000 },
  { title: "Luxury Stay", price: 32000 },
];

export function BetweenRangeDiagram() {
  const x0 = 50;
  const x1 = 830;
  const max = 34000;
  const px = (v: number) => x0 + ((x1 - x0) * v) / max;
  const lo = 8500;
  const hi = 12500;
  return (
    <Sketch
      label="BETWEEN 8500 AND 12500: দুই সীমাও ভেতরে"
      height={260}
      minWidth={880}
      viewBox="0 0 880 260"
      caption={
        <>
          নয়টা ট্যুরের আসল দাম একটা সংখ্যার রেখায়। BETWEEN এর দুই মাথা ভরাট বৃত্ত,
          মানে 8500 আর 12500 নিজেরাও শর্তের ভেতরে। তাই Cox&apos;s Bazar Beach Weekend
          (ঠিক 8500) আর Saint Martin Island Escape (ঠিক 12500) দুটোই ফলাফলে আসে,
          মোট তিনটা ট্যুর।
        </>
      }
    >
      <line x1={x0} y1={150} x2={x1} y2={150} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      {[0, 5000, 10000, 15000, 20000, 25000, 30000].map((v) => (
        <g key={v}>
          <line x1={px(v)} y1={145} x2={px(v)} y2={155} stroke="currentColor" strokeOpacity={0.4} />
          <SketchText x={px(v)} y={174} size={9} opacity={0.6}>
            {v.toLocaleString("en-US")}
          </SketchText>
        </g>
      ))}
      <rect
        x={px(lo)}
        y={136}
        width={px(hi) - px(lo)}
        height={28}
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeOpacity={0.6}
      />
      <circle cx={px(lo)} cy={150} r={6} fill="var(--primary)" />
      <circle cx={px(hi)} cy={150} r={6} fill="var(--primary)" />
      <SketchText x={px(lo)} y={210} size={10} bold accent>
        8500
      </SketchText>
      <SketchText x={px(hi)} y={210} size={10} bold accent>
        12500
      </SketchText>
      <SketchText x={(px(lo) + px(hi)) / 2} y={232} size={10} body accent>
        সীমা দুটো সহ, &gt;= 8500 AND &lt;= 12500
      </SketchText>
      {PRICES.map((p, i) => {
        const inside = p.price >= lo && p.price <= hi;
        const y = i % 2 === 0 ? 92 : 62;
        return (
          <g key={p.title}>
            <line
              x1={px(p.price)}
              y1={y + 6}
              x2={px(p.price)}
              y2={146}
              stroke={inside ? "var(--primary)" : "currentColor"}
              strokeOpacity={inside ? 0.8 : 0.3}
              strokeDasharray="3 3"
            />
            <circle
              cx={px(p.price)}
              cy={150}
              r={4}
              fill={inside ? "var(--primary)" : "currentColor"}
              fillOpacity={inside ? 1 : 0.5}
            />
            <SketchText x={px(p.price)} y={y} size={9.5} accent={inside} bold={inside} opacity={inside ? 1 : 0.65}>
              {p.title}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Timestamp এর ফাঁদ                                                         */
/* ------------------------------------------------------------------------- */

export function TimestampTrapDiagram() {
  // Day 0 is 12 Oct 00:00; one day is 200 units wide.
  const x0 = 40;
  const day = 200;
  const at = (dayIndex: number, hour: number, minute = 0) => x0 + day * dayIndex + (day * (hour + minute / 60)) / 24;
  const bookings = [
    { id: 22, label: "#22  12 Oct 08:30", x: at(0, 8, 30) },
    { id: 23, label: "#23  13 Oct 20:55", x: at(1, 20, 55) },
    { id: 24, label: "#24  14 Oct 11:05", x: at(2, 11, 5) },
  ];
  const oct14 = at(2, 0);
  const oct15 = at(3, 0);
  return (
    <Sketch
      label="BETWEEN '2026-10-01' AND '2026-10-14': শেষ দিনটা প্রায় পুরোটাই বাদ"
      height={330}
      minWidth={900}
      viewBox="0 0 900 330"
      caption={
        <>
          booked_at শুধু তারিখ না, তারিখের সাথে ঘণ্টা মিনিটও রাখে। শর্তে
          &apos;2026-10-14&apos; লিখলে PostgreSQL সেটাকে পড়ে ১৪ অক্টোবরের রাত
          ১২টা, মানে 2026-10-14 00:00:00+06। তাই BETWEEN এর জানালা ঠিক সেই মুহূর্তে
          বন্ধ হয়ে যায়, আর ১৪ তারিখ সকাল ১১টা ৫ মিনিটের Booking #24 বাইরে পড়ে।
          নিচের জানালা শেষ হয় ১৫ তারিখের রাত ১২টার ঠিক আগে, তাই পুরো ১৪ তারিখ ভেতরে।
        </>
      }
    >
      <Arrow id="match-time-arrow" />
      <line x1={30} y1={120} x2={870} y2={120} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" markerEnd="url(#match-time-arrow)" />
      {[
        { x: at(1, 0), label: "13 Oct 00:00" },
        { x: oct14, label: "14 Oct 00:00" },
        { x: oct15, label: "15 Oct 00:00" },
      ].map((t) => (
        <g key={t.label}>
          <line x1={t.x} y1={112} x2={t.x} y2={128} stroke="currentColor" strokeOpacity={0.6} />
          <SketchText x={t.x} y={146} size={9.5} opacity={0.75}>
            {t.label}
          </SketchText>
        </g>
      ))}
      {bookings.map((b) => {
        const missed = b.id === 24;
        return (
          <g key={b.id}>
            <circle cx={b.x} cy={120} r={6} fill={missed ? "var(--destructive)" : "var(--primary)"} />
            <SketchText x={b.x} y={96} size={10} bold accent={!missed}>
              {b.label}
            </SketchText>
          </g>
        );
      })}

      {/* BETWEEN window */}
      <rect x={30} y={182} width={oct14 - 30} height={30} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.5} />
      <line x1={oct14} y1={176} x2={oct14} y2={218} stroke="var(--destructive)" strokeWidth="2" />
      <SketchText x={(30 + oct14) / 2} y={202} size={10}>
        BETWEEN &apos;2026-10-01&apos; AND &apos;2026-10-14&apos;
      </SketchText>
      <SketchText x={oct14 + 110} y={202} size={10} body>
        এখানেই শেষ, #24 বাদ
      </SketchText>

      {/* Half-open window */}
      <rect x={30} y={248} width={oct15 - 30} height={30} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeOpacity={0.8} />
      <line x1={oct15} y1={242} x2={oct15} y2={284} stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 3" />
      <SketchText x={(30 + oct15) / 2} y={268} size={10} accent bold>
        &gt;= &apos;2026-10-01&apos; AND &lt; &apos;2026-10-15&apos;
      </SketchText>
      <SketchText x={oct15} y={304} size={9.5} body accent>
        ১৫ তারিখ শুরু হওয়ার ঠিক আগ পর্যন্ত
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Pattern এর গঠন                                                            */
/* ------------------------------------------------------------------------- */

function PatternRow({
  y,
  pattern,
  text,
  covers,
}: {
  y: number;
  pattern: string;
  text: string;
  /** For each pattern token, how many characters of text it covers. */
  covers: { token: string; chars: number }[];
}) {
  const cell = 22;
  const x0 = 40;
  // Where each token starts, as a count of characters covered before it.
  const starts = covers.map((_, i) => covers.slice(0, i).reduce((sum, c) => sum + c.chars, 0));
  return (
    <g>
      <SketchText x={x0} y={y - 52} size={10} anchor="start" bold accent>
        LIKE &apos;{pattern}&apos;
      </SketchText>
      {text.split("").map((ch, i) => (
        <g key={i}>
          <rect x={x0 + i * cell} y={y - 34} width={cell - 2} height={26} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.35} />
          <SketchText x={x0 + i * cell + (cell - 2) / 2} y={y - 16} size={11}>
            {ch === " " ? "␣" : ch}
          </SketchText>
        </g>
      ))}
      {covers.map((c, i) => {
        const start = starts[i];
        const wild = c.token === "%" || c.token === "_";
        const xs = x0 + start * cell;
        const w = Math.max(c.chars * cell - 2, 18);
        return (
          <g key={i}>
            <rect
              x={xs}
              y={y}
              width={w}
              height={22}
              fill={wild ? "var(--primary)" : "currentColor"}
              fillOpacity={wild ? 0.14 : 0.08}
              stroke={wild ? "var(--primary)" : "currentColor"}
              strokeOpacity={0.7}
            />
            <SketchText x={xs + w / 2} y={y + 15} size={11} bold accent={wild}>
              {c.token}
            </SketchText>
          </g>
        );
      })}
    </g>
  );
}

export function PatternAnatomyDiagram() {
  return (
    <SketchSplit
      label="Pattern আর লেখা, অক্ষরে অক্ষরে মিলিয়ে দেখা"
      caption={
        <>
          উপরের সারি আসল লেখা, নিচের সারি Pattern এর টুকরো। % যত খুশি অক্ষর ঢেকে দেয়,
          শূন্যটাও চলে। _ ঢাকে ঠিক একটা অক্ষর, কম বা বেশি না। বাকি অক্ষরগুলো হুবহু
          মিলতে হয়। আর পুরো লেখাটা ঢাকা না পড়লে মিল হয় না, LIKE সবসময় পুরো লেখার সাথে
          মেলায়।
        </>
      }
      panels={[
        {
          title: "'Saint%'",
          sub: "শুরুটা Saint, বাকিটা যা খুশি",
          viewBox: "0 0 600 120",
          height: 120,
          minWidth: 560,
          children: (
            <PatternRow
              y={90}
              pattern="Saint%"
              text="Saint Martin Island"
              covers={[
                { token: "S", chars: 1 },
                { token: "a", chars: 1 },
                { token: "i", chars: 1 },
                { token: "n", chars: 1 },
                { token: "t", chars: 1 },
                { token: "%", chars: 14 },
              ]}
            />
          ),
        },
        {
          title: "'_a%'",
          sub: "প্রথম অক্ষর যেকোনো, দ্বিতীয়টা a",
          viewBox: "0 0 600 120",
          height: 120,
          minWidth: 560,
          children: (
            <PatternRow
              y={90}
              pattern="_a%"
              text="Rahim Uddin"
              covers={[
                { token: "_", chars: 1 },
                { token: "a", chars: 1 },
                { token: "%", chars: 9 },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
