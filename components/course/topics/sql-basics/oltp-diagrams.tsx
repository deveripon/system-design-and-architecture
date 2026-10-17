import { Sketch, SketchBox, SketchSplit, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* 1. দুই ধরনের কাজ: অনেক ছোট লেনদেন বনাম একটা বড় প্রশ্ন                       */
/* ------------------------------------------------------------------------- */

const TABLE_X = 150;
const TABLE_Y = 30;
const TABLE_W = 130;
const ROW_H = 18;
const ROWS = 8;

function MiniTable({ lit }: { lit: (row: number) => boolean }) {
  return (
    <g>
      <rect
        x={TABLE_X}
        y={TABLE_Y - 20}
        width={TABLE_W}
        height={20}
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="currentColor"
        strokeOpacity={0.45}
      />
      <SketchText x={TABLE_X + TABLE_W / 2} y={TABLE_Y - 6} size={9.5} bold accent>
        bookings
      </SketchText>
      {Array.from({ length: ROWS }, (_, i) => (
        <rect
          key={i}
          x={TABLE_X}
          y={TABLE_Y + i * ROW_H}
          width={TABLE_W}
          height={ROW_H}
          fill={lit(i) ? "var(--primary)" : "transparent"}
          fillOpacity={lit(i) ? 0.28 : 0}
          stroke="currentColor"
          strokeOpacity={0.35}
        />
      ))}
    </g>
  );
}

/**
 * OLTP: অনেক মানুষ, প্রত্যেকে একটা দুটো Row ছোঁয়। OLAP: একজন মানুষ, একটা
 * প্রশ্ন, পুরো Table।
 */
export function OltpOlapSplit() {
  const people = [0, 1, 2, 3, 4];
  const targets = [1, 3, 4, 6, 7];
  return (
    <SketchSplit
      label="Two Kinds of Work: OLTP vs OLAP"
      caption="বাঁয়ে OLTP: পাঁচজন Customer একসাথে, প্রত্যেকের কাজ এক বা দুটো নির্দিষ্ট Row তে, আর প্রত্যেকে উত্তরের জন্য অপেক্ষা করছেন মিলিসেকেন্ডে। ডানে OLAP: একজন Accountant, একটা প্রশ্ন, কিন্তু উত্তর বের করতে পুরো Table পড়তে হয়, আর ফল একটাই সংখ্যা।"
      panels={[
        {
          title: "OLTP",
          sub: "অনেক মানুষ, ছোট ছোট কাজ",
          viewBox: "0 0 300 210",
          height: 210,
          children: (
            <>
              <defs>
                <marker
                  id="oltp-split-arrow"
                  markerWidth={7}
                  markerHeight={7}
                  refX={6}
                  refY={3}
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path d="M0,0 L6,3 L0,6 Z" fill="var(--primary)" />
                </marker>
              </defs>
              {people.map((p) => {
                const y = 28 + p * 34;
                const ty = TABLE_Y + targets[p] * ROW_H + ROW_H / 2;
                return (
                  <g key={p}>
                    <circle cx={30} cy={y} r={9} fill="none" stroke="currentColor" strokeOpacity={0.6} />
                    <line
                      x1={42}
                      y1={y}
                      x2={TABLE_X - 4}
                      y2={ty}
                      stroke="var(--primary)"
                      strokeWidth={1.2}
                      markerEnd="url(#oltp-split-arrow)"
                    />
                  </g>
                );
              })}
              <MiniTable lit={(i) => targets.includes(i)} />
              <SketchText x={TABLE_X + TABLE_W / 2} y={200} size={10} body>
                প্রতিটা কাজ একটা Row, মিলিসেকেন্ডে
              </SketchText>
            </>
          ),
        },
        {
          title: "OLAP",
          sub: "একজন মানুষ, বড় প্রশ্ন",
          viewBox: "0 0 300 210",
          height: 210,
          children: (
            <>
              <defs>
                <marker
                  id="olap-split-arrow"
                  markerWidth={7}
                  markerHeight={7}
                  refX={6}
                  refY={3}
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path d="M0,0 L6,3 L0,6 Z" fill="var(--primary)" />
                </marker>
              </defs>
              <circle cx={30} cy={100} r={12} fill="none" stroke="var(--primary)" strokeWidth={1.4} />
              <SketchText x={30} y={128} size={8.5} opacity={0.8}>
                Accountant
              </SketchText>
              <path
                d={`M 46 100 L ${TABLE_X - 4} ${TABLE_Y + 2} M 46 100 L ${TABLE_X - 4} ${TABLE_Y + ROWS * ROW_H - 2}`}
                stroke="var(--primary)"
                strokeOpacity={0.5}
                strokeWidth={1.2}
                fill="none"
              />
              <line
                x1={46}
                y1={100}
                x2={TABLE_X - 4}
                y2={TABLE_Y + (ROWS * ROW_H) / 2}
                stroke="var(--primary)"
                strokeWidth={1.4}
                markerEnd="url(#olap-split-arrow)"
              />
              <MiniTable lit={() => true} />
              <rect
                x={TABLE_X + 4}
                y={TABLE_Y + ROWS * ROW_H + 8}
                width={TABLE_W - 8}
                height={22}
                fill="var(--primary)"
                fillOpacity={0.1}
                stroke="var(--primary)"
              />
              <SketchText x={TABLE_X + TABLE_W / 2} y={TABLE_Y + ROWS * ROW_H + 23} size={10} bold accent>
                SUM = 423600.00
              </SketchText>
              <SketchText x={TABLE_X + TABLE_W / 2} y={208} size={10} body>
                সব Row পড়ে একটা উত্তর
              </SketchText>
            </>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Row Store বনাম Column Store, একই Data দুইভাবে সাজানো                      */
/* ------------------------------------------------------------------------- */

const SAMPLE = [
  { id: "13", customer: "2", status: "confirmed", total: "25000.00" },
  { id: "14", customer: "12", status: "pending", total: "50000.00" },
  { id: "15", customer: "13", status: "confirmed", total: "25500.00" },
  { id: "16", customer: "14", status: "confirmed", total: "36000.00" },
];

const COLS = [
  { key: "id", label: "booking_id", w: 60 },
  { key: "customer", label: "customer_id", w: 60 },
  { key: "status", label: "status", w: 74 },
  { key: "total", label: "total_bdt", w: 74 },
] as const;

/**
 * একই চারটা Booking। বাঁয়ে Row Store: প্রতিটা Row এর সব ঘর পাশাপাশি জমা।
 * ডানে Column Store: প্রতিটা Column এর সব মান পাশাপাশি জমা।
 */
export function RowColumnStorageDiagram() {
  const stripW = COLS.reduce((sum, c) => sum + c.w, 0);
  const leftX = 40;
  const rightX = 500;
  const top = 70;
  const cell = 26;
  return (
    <Sketch
      label="Row Store vs Column Store"
      height={330}
      minWidth={900}
      viewBox="0 0 900 330"
      caption="একই চারটা Booking দুইভাবে Disk এ রাখা। বাঁয়ে Row Store, যেমন PostgreSQL আর MySQL: একটা Booking এর সব ঘর এক জায়গায়, তাই একটা Booking পুরো পড়া বা লেখা এক টানে হয়। ডানে Column Store, যেমন ClickHouse, BigQuery বা DuckDB: একটা Column এর সব মান এক জায়গায়, তাই সব total_bdt যোগ করতে শুধু একটা ফালি পড়লেই চলে। রং করা অংশটুকুই SUM(total_bdt) এর জন্য পড়তে হয়।"
    >
      <SketchText x={leftX} y={30} anchor="start" size={12} bold accent>
        Row Store
      </SketchText>
      <SketchText x={leftX} y={50} anchor="start" size={10.5} body opacity={0.85}>
        একটা Row এর সব ঘর পাশাপাশি
      </SketchText>
      {SAMPLE.map((row, r) => {
        let x = leftX;
        return (
          <g key={row.id}>
            {COLS.map((col) => {
              const cx = x;
              x += col.w;
              return (
                <g key={col.key}>
                  <rect
                    x={cx}
                    y={top + r * (cell + 12)}
                    width={col.w}
                    height={cell}
                    fill="var(--primary)"
                    fillOpacity={0.22}
                    stroke="currentColor"
                    strokeOpacity={0.4}
                  />
                  <SketchText x={cx + col.w / 2} y={top + r * (cell + 12) + 17} size={10}>
                    {row[col.key]}
                  </SketchText>
                </g>
              );
            })}
            <SketchText x={leftX + stripW + 10} y={top + r * (cell + 12) + 17} anchor="start" size={9} opacity={0.7}>
              Row {r + 1}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={leftX} y={top + 4 * (cell + 12) + 18} anchor="start" size={10.5} body>
        SUM(total_bdt) এর জন্যও পুরো চারটা Row পড়তে হয়
      </SketchText>

      <line x1={450} y1={20} x2={450} y2={310} stroke="currentColor" strokeOpacity={0.2} strokeDasharray="4 4" />

      <SketchText x={rightX} y={30} anchor="start" size={12} bold accent>
        Column Store
      </SketchText>
      <SketchText x={rightX} y={50} anchor="start" size={10.5} body opacity={0.85}>
        একটা Column এর সব মান পাশাপাশি
      </SketchText>
      {COLS.map((col, c) => {
        const y = top + c * (cell + 12);
        const lit = col.key === "total";
        return (
          <g key={col.key}>
            <SketchText x={rightX} y={y + 17} anchor="start" size={9.5} opacity={0.8}>
              {col.label}
            </SketchText>
            {SAMPLE.map((row, r) => (
              <g key={row.id}>
                <rect
                  x={rightX + 86 + r * 74}
                  y={y}
                  width={74}
                  height={cell}
                  fill={lit ? "var(--primary)" : "transparent"}
                  fillOpacity={lit ? 0.28 : 0}
                  stroke={lit ? "var(--primary)" : "currentColor"}
                  strokeOpacity={lit ? 1 : 0.35}
                />
                <SketchText x={rightX + 86 + r * 74 + 37} y={y + 17} size={10} opacity={lit ? 1 : 0.6}>
                  {row[col.key]}
                </SketchText>
              </g>
            ))}
          </g>
        );
      })}
      <SketchText x={rightX} y={top + 4 * (cell + 12) + 18} anchor="start" size={10.5} body>
        SUM(total_bdt) শুধু শেষ ফালিটা পড়ে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Report কোথায় চলবে: মূল Database, Replica, নাকি Warehouse                  */
/* ------------------------------------------------------------------------- */

/**
 * Island Tours এর Data কীভাবে লেনদেনের Database থেকে Report এর জায়গায় যায়।
 */
export function ReportHomesDiagram() {
  return (
    <Sketch
      label="Where Reports Run"
      height={330}
      minWidth={940}
      viewBox="0 0 940 330"
      caption="App শুধু মূল Database এ লেখে, এটাই OLTP এর জায়গা। তার একটা হুবহু Copy, Read Replica, প্রায় সাথে সাথে আপডেট হয়, আর হালকা Report সেখানে চলতে পারে (Module 19)। আরও বড় হলে প্রতি রাতে ETL নামের একটা কাজ Data তুলে নিয়ে Data Warehouse এ সাজিয়ে রাখে, যেখানে Dashboard চলে (Module 20)। প্রতিটা ধাপে Report তাজা থাকে একটু কম, কিন্তু মূল Database এর উপর চাপ থাকে একটু কম।"
    >
      <defs>
        <marker
          id="oltp-homes-arrow"
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

      <SketchBox x={20} y={130} w={150} h={56} title="Island Tours API" sub="Booking, Payment" />
      <SketchBox x={250} y={130} w={170} h={56} title="Primary PostgreSQL" sub="OLTP" accent />
      <SketchBox x={520} y={40} w={170} h={56} title="Read Replica" sub="প্রায় সাথে সাথে Copy" />
      <SketchBox x={520} y={230} w={170} h={56} title="Data Warehouse" sub="Columnar, OLAP" />
      <SketchBox x={770} y={40} w={150} h={56} title="হালকা Report" sub="Metabase, Admin Page" />
      <SketchBox x={770} y={230} w={150} h={56} title="Dashboard" sub="মাসিক আয়, Trend" />

      <line x1={172} y1={158} x2={246} y2={158} stroke="var(--primary)" strokeWidth={1.4} markerEnd="url(#oltp-homes-arrow)" />
      <SketchText x={209} y={150} size={9}>
        লেখা আর পড়া
      </SketchText>

      <path d="M 420 145 H 470 V 68 H 516" fill="none" stroke="var(--primary)" strokeWidth={1.4} markerEnd="url(#oltp-homes-arrow)" />
      <SketchText x={470} y={60} size={9}>
        Replication
      </SketchText>

      <path d="M 420 172 H 470 V 258 H 516" fill="none" stroke="var(--primary)" strokeWidth={1.4} strokeDasharray="5 4" markerEnd="url(#oltp-homes-arrow)" />
      <SketchText x={470} y={290} size={9}>
        প্রতি রাতে ETL
      </SketchText>

      <line x1={692} y1={68} x2={766} y2={68} stroke="var(--primary)" strokeWidth={1.4} markerEnd="url(#oltp-homes-arrow)" />
      <line x1={692} y1={258} x2={766} y2={258} stroke="var(--primary)" strokeWidth={1.4} markerEnd="url(#oltp-homes-arrow)" />

      <SketchText x={335} y={215} size={10} body>
        এখানে শুধু লেনদেন
      </SketchText>
      <SketchText x={605} y={118} size={9.5} body opacity={0.85}>
        কয়েক সেকেন্ড পিছিয়ে থাকতে পারে
      </SketchText>
      <SketchText x={605} y={308} size={9.5} body opacity={0.85}>
        গতকাল রাত পর্যন্ত তাজা
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. পুরো Module 01 একটা গল্পে                                                */
/* ------------------------------------------------------------------------- */

const STORY = [
  { n: "01", title: "Spreadsheets Break", line: "ফাইলে আর কাজ চলে না" },
  { n: "02", title: "Database & DBMS", line: "Data পাহারা দেওয়া Program" },
  { n: "03", title: "Kinds of Databases", line: "কাজ বুঝে ধরন বাছাই" },
  { n: "04", title: "Relational Model", line: "Table, Row আর Key" },
  { n: "05", title: "What SQL Is", line: "Database এর সাথে কথার ভাষা" },
  { n: "06", title: "App to Database", line: "Connection, Query, Result" },
  { n: "07", title: "OLTP vs OLAP", line: "লেনদেন আর বিশ্লেষণ" },
];

/**
 * সাতটা লেসন একটার উপর আরেকটা দাঁড়িয়ে, শেষে Module 02 এর দরজা।
 */
export function ModuleStoryDiagram() {
  const w = 190;
  const h = 64;
  const pos = (i: number) =>
    i < 4 ? { x: 30 + i * 230, y: 40 } : { x: 30 + (6 - i) * 230 + 230, y: 190 };
  return (
    <Sketch
      label="Module 01 in One Picture"
      height={360}
      minWidth={940}
      viewBox="0 0 940 360"
      caption="প্রতিটা লেসন আগেরটার একটা প্রশ্নের উত্তর। ফাইল কেন ভাঙে, তাই Database। Database অনেক রকম, তাই আমরা Relational বেছে নিলাম। Relational এর ভাষা SQL। App সেই ভাষায় Connection দিয়ে কথা বলে। আর সেই কথা দুই রকম, লেনদেন আর বিশ্লেষণ। এবার পালা নিজের মেশিনে PostgreSQL চালানোর, Module 02।"
    >
      <defs>
        <marker
          id="oltp-story-arrow"
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
      {STORY.map((s, i) => {
        const { x, y } = pos(i);
        const here = s.n === "07";
        return (
          <g key={s.n}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={here ? "var(--primary)" : "transparent"}
              fillOpacity={here ? 0.1 : 0}
              stroke={here ? "var(--primary)" : "currentColor"}
              strokeOpacity={here ? 1 : 0.45}
              strokeWidth={1.2}
            />
            <SketchText x={x + 12} y={y + 22} anchor="start" size={10} bold accent>
              {`Lesson ${s.n}`}
            </SketchText>
            <SketchText x={x + 12} y={y + 38} anchor="start" size={10.5} bold>
              {s.title}
            </SketchText>
            <SketchText x={x + 12} y={y + 55} anchor="start" size={10} body opacity={0.85}>
              {s.line}
            </SketchText>
          </g>
        );
      })}
      {[0, 1, 2].map((i) => {
        const a = pos(i);
        return (
          <line
            key={`top-${i}`}
            x1={a.x + w + 4}
            y1={a.y + h / 2}
            x2={a.x + 230 - 4}
            y2={a.y + h / 2}
            stroke="var(--primary)"
            strokeWidth={1.3}
            markerEnd="url(#oltp-story-arrow)"
          />
        );
      })}
      <path
        d={`M ${pos(3).x + w / 2} ${pos(3).y + h + 4} V ${pos(4).y - 4}`}
        stroke="var(--primary)"
        strokeWidth={1.3}
        fill="none"
        markerEnd="url(#oltp-story-arrow)"
      />
      {[4, 5].map((i) => {
        const a = pos(i);
        return (
          <line
            key={`bottom-${i}`}
            x1={a.x - 4}
            y1={a.y + h / 2}
            x2={a.x - 230 + w + 4}
            y2={a.y + h / 2}
            stroke="var(--primary)"
            strokeWidth={1.3}
            markerEnd="url(#oltp-story-arrow)"
          />
        );
      })}
      <path
        d={`M ${pos(6).x + w / 2} ${pos(6).y + h + 4} V 300`}
        stroke="var(--primary)"
        strokeWidth={1.3}
        strokeDasharray="5 4"
        fill="none"
        markerEnd="url(#oltp-story-arrow)"
      />
      <rect x={pos(6).x - 10} y={304} width={w + 20} height={44} fill="transparent" stroke="var(--primary)" strokeDasharray="4 3" />
      <SketchText x={pos(6).x + w / 2} y={322} size={10.5} bold accent>
        Module 02 · Setup & Tools
      </SketchText>
      <SketchText x={pos(6).x + w / 2} y={340} size={10} body>
        নিজের মেশিনে PostgreSQL
      </SketchText>
    </Sketch>
  );
}
