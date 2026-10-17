import { Sketch, SketchText } from "../../sketch";

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
      strokeOpacity={accent ? 0.95 : 0.4}
      strokeWidth="1.2"
      strokeDasharray={dashed ? "5 4" : undefined}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 1. লেখার ক্রম বনাম চলার ক্রম                                                 */
/* ------------------------------------------------------------------------- */

const WRITTEN = ["SELECT  (DISTINCT)", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT / OFFSET"];
const LOGICAL = ["FROM", "WHERE", "GROUP BY", "HAVING", "SELECT", "DISTINCT", "ORDER BY", "LIMIT / OFFSET"];

/** Which written row feeds which logical row. SELECT (DISTINCT) feeds two. */
const LINKS: [number, number][] = [
  [0, 4],
  [0, 5],
  [1, 0],
  [2, 1],
  [3, 2],
  [4, 3],
  [5, 6],
  [6, 7],
];

export function WrittenVsLogicalDiagram() {
  const leftX = 50;
  const rightX = 520;
  const w = 200;
  const h = 32;
  const rowY = (i: number) => 64 + i * 44;
  return (
    <Sketch
      label="Written Order vs Logical Order"
      height={430}
      minWidth={780}
      viewBox="0 0 780 430"
      caption={
        <>
          বাঁ দিকে আপনি যে ক্রমে লেখেন, ডান দিকে PostgreSQL যে ক্রমে কাজটা বোঝে।
          বেশিরভাগ দাগ প্রায় সোজা, কিন্তু SELECT এর দাগ দুটো নিচে নেমে গেছে: আপনি সবার
          আগে লেখেন, অথচ সে কাজ পায় পঞ্চম আর ষষ্ঠ ধাপে। এই একটা উল্টো দাগই এই লেসনের
          প্রায় সব রহস্যের উত্তর।
        </>
      }
    >
      <Arrow id="qorder-written-arrow" />
      <Arrow id="qorder-written-arrow-muted" muted />
      <SketchText x={leftX + w / 2} y={36} size={11} bold>
        লেখার ক্রম
      </SketchText>
      <SketchText x={rightX + w / 2} y={36} size={11} bold accent>
        চলার ক্রম (Logical Order)
      </SketchText>

      {LINKS.map(([from, to]) => {
        const isSelect = from === 0;
        const y1 = rowY(from) + h / 2;
        const y2 = rowY(to) + h / 2;
        return (
          <path
            key={`${from}-${to}`}
            d={`M ${leftX + w + 4} ${y1} C ${leftX + w + 120} ${y1}, ${rightX - 120} ${y2}, ${rightX - 6} ${y2}`}
            fill="none"
            stroke={isSelect ? "var(--primary)" : "currentColor"}
            strokeOpacity={isSelect ? 0.95 : 0.45}
            strokeWidth={isSelect ? 1.8 : 1.2}
            markerEnd={isSelect ? "url(#qorder-written-arrow)" : "url(#qorder-written-arrow-muted)"}
          />
        );
      })}

      {WRITTEN.map((label, i) => (
        <g key={label}>
          <Box x={leftX} y={rowY(i)} w={w} h={h} accent={i === 0} />
          <SketchText x={leftX + w / 2} y={rowY(i) + 21} size={11.5} bold={i === 0} accent={i === 0}>
            {label}
          </SketchText>
        </g>
      ))}

      {LOGICAL.map((label, i) => {
        const isSelect = i === 4 || i === 5;
        return (
          <g key={label}>
            <Box x={rightX} y={rowY(i)} w={w} h={h} accent={isSelect} />
            <SketchText x={rightX - 18} y={rowY(i) + 21} size={10} anchor="end" opacity={0.6}>
              {String(i + 1)}
            </SketchText>
            <SketchText x={rightX + w / 2} y={rowY(i) + 21} size={11.5} bold={isSelect} accent={isSelect}>
              {label}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা Query, ধাপে ধাপে Row কমছে                                          */
/* ------------------------------------------------------------------------- */

const PIPE = [
  { clause: "FROM tours", rows: 9, cols: 9, note: "পুরো Table" },
  { clause: "WHERE is_active", rows: 8, cols: 9, note: "বন্ধ ট্যুর বাদ" },
  { clause: "SELECT …", rows: 8, cols: 2, note: "title, for_two" },
  { clause: "ORDER BY for_two DESC", rows: 8, cols: 2, note: "দামি আগে" },
  { clause: "LIMIT 3", rows: 3, cols: 2, note: "প্রথম তিনটা" },
];

export function ClausePipelineDiagram() {
  const step = 176;
  const x0 = 24;
  const cell = 9;
  const top = 70;
  return (
    <Sketch
      label="One Query, Step by Step"
      height={330}
      minWidth={900}
      viewBox="0 0 900 330"
      caption={
        <>
          SELECT title, price_bdt * 2 AS for_two FROM tours WHERE is_active ORDER BY
          for_two DESC LIMIT 3; এই Query টা চলার পথে Table টা কীভাবে বদলায়। প্রতিটা
          ছোট ঘর একটা Cell। WHERE Row কমায়, SELECT Column কমায় আর নতুন Column বানায়,
          ORDER BY শুধু সাজায়, আর LIMIT শেষে কেটে ছোট করে। সংখ্যাগুলো Sample Database
          এ আসলেই চালিয়ে পাওয়া।
        </>
      }
    >
      <Arrow id="qorder-pipe-arrow" />
      {PIPE.map((s, i) => {
        const x = x0 + i * step;
        const gridW = s.cols * cell;
        const gx = x + (140 - gridW) / 2;
        return (
          <g key={s.clause}>
            <SketchText x={x + 70} y={30} size={10.5} bold accent={i === 2}>
              {s.clause}
            </SketchText>
            <SketchText x={x + 70} y={48} size={9.5} body opacity={0.75}>
              {s.note}
            </SketchText>
            {Array.from({ length: s.rows }).map((_, r) =>
              Array.from({ length: s.cols }).map((__, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={gx + c * cell}
                  y={top + r * cell}
                  width={cell - 1.5}
                  height={cell - 1.5}
                  fill={i === 2 && c === 1 ? "var(--primary)" : "currentColor"}
                  fillOpacity={i === 2 && c === 1 ? 0.55 : 0.28}
                />
              ))
            )}
            <SketchText x={x + 70} y={top + 9 * cell + 30} size={11} bold>
              {`${s.rows} Row × ${s.cols} Column`}
            </SketchText>
            {i < PIPE.length - 1 && (
              <line
                x1={x + 146}
                y1={top + 40}
                x2={x + step - 6}
                y2={top + 40}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#qorder-pipe-arrow)"
              />
            )}
          </g>
        );
      })}
      <SketchText x={450} y={300} size={10} body opacity={0.75}>
        লেখায় SELECT প্রথমে, কিন্তু Table এর উপর সে হাত দেয় তৃতীয় ধাপে, Row ছাঁকা হয়ে যাওয়ার পরে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Alias কোথা থেকে দেখা যায়                                                   */
/* ------------------------------------------------------------------------- */

const TIMELINE = [
  { label: "FROM", pg: "", mysql: "", tone: "none" },
  { label: "WHERE", pg: "✗", mysql: "✗", tone: "no" },
  { label: "GROUP BY", pg: "✓", mysql: "✓", tone: "exception" },
  { label: "HAVING", pg: "✗", mysql: "✓", tone: "no" },
  { label: "SELECT", pg: "জন্ম", mysql: "জন্ম", tone: "birth" },
  { label: "DISTINCT", pg: "", mysql: "", tone: "none" },
  { label: "ORDER BY", pg: "✓*", mysql: "✓", tone: "yes" },
  { label: "LIMIT", pg: "", mysql: "", tone: "none" },
] as const;

export function AliasVisibilityDiagram() {
  const x0 = 30;
  const step = 110;
  const w = 96;
  return (
    <Sketch
      label="Where an Alias Can Be Used"
      height={300}
      minWidth={920}
      viewBox="0 0 920 300"
      caption={
        <>
          Alias এর জন্ম SELECT ধাপে। তার আগের ধাপগুলো নামটা চেনে না, পরের ধাপগুলো চেনে।
          দুটো ব্যতিক্রম মনে রাখুন। এক, GROUP BY আগে চললেও PostgreSQL আর MySQL দুজনেই
          সেখানে Alias মেনে নেয়। দুই, HAVING এ MySQL Alias মেনে নেয়,
          PostgreSQL নেয় না। WHERE এ কেউই নেয় না। সবগুলো ঘর আসল PostgreSQL 18 আর MySQL
          8.4 এ চালিয়ে যাচাই করা।
        </>
      }
    >
      <rect
        x={x0 + 4 * step - 6}
        y={58}
        width={4 * step + 2}
        height={70}
        fill="var(--primary)"
        fillOpacity={0.06}
        stroke="var(--primary)"
        strokeOpacity={0.4}
        strokeDasharray="5 4"
      />
      <SketchText x={x0 + 6 * step - 10} y={50} size={10} accent body>
        এখান থেকে Alias এর নাম চেনা যায়
      </SketchText>
      {TIMELINE.map((t, i) => {
        const x = x0 + i * step;
        const accent = t.tone === "birth";
        return (
          <g key={t.label}>
            <Box x={x} y={70} w={w} h={46} accent={accent} />
            <SketchText x={x + w / 2} y={98} size={11} bold accent={accent}>
              {t.label}
            </SketchText>
            {i < TIMELINE.length - 1 && (
              <line x1={x + w} y1={93} x2={x + step} y2={93} stroke="currentColor" strokeOpacity={0.4} />
            )}
            <SketchText x={x + w / 2} y={160} size={10} opacity={0.7}>
              PostgreSQL
            </SketchText>
            <SketchText
              x={x + w / 2}
              y={184}
              size={t.pg === "জন্ম" ? 11 : 15}
              bold
              body={t.pg === "জন্ম"}
              accent={t.pg.startsWith("✓") || t.pg === "জন্ম"}
              opacity={t.pg === "" ? 0.3 : 1}
            >
              {t.pg || "·"}
            </SketchText>
            <SketchText x={x + w / 2} y={218} size={10} opacity={0.7}>
              MySQL
            </SketchText>
            <SketchText
              x={x + w / 2}
              y={242}
              size={t.mysql === "জন্ম" ? 11 : 15}
              bold
              body={t.mysql === "জন্ম"}
              accent={t.mysql.startsWith("✓") || t.mysql === "জন্ম"}
              opacity={t.mysql === "" ? 0.3 : 1}
            >
              {t.mysql || "·"}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={460} y={280} size={9.5} body opacity={0.7}>
        * ORDER BY তে PostgreSQL শুধু একা দাঁড়ানো নাম মানে: ORDER BY for_two চলে, ORDER BY for_two + 1 চলে না
      </SketchText>
    </Sketch>
  );
}
