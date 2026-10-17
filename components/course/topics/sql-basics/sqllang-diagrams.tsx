import { SKETCH_MONO, Sketch, SketchSplit, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* 1. SQL একটা ভাষা, PostgreSQL আর MySQL সেই ভাষা বোঝে এমন Program            */
/* ------------------------------------------------------------------------- */

const PROGRAMS = [
  { name: "PostgreSQL", sub: "এই ট্র্যাক এটা দিয়ে", accent: true },
  { name: "MySQL", sub: "আপনার ভিডিও এটা দিয়ে", accent: false },
  { name: "SQLite", sub: "ফোনের ভেতরের ছোট Database", accent: false },
  { name: "SQL Server", sub: "Microsoft এর", accent: false },
  { name: "Oracle", sub: "বড় Enterprise এর", accent: false },
];

export function LanguageVsProgramDiagram() {
  const progX = 600;
  const progW = 260;
  const progH = 46;
  const gap = 14;
  const top = 26;
  const midY = top + (PROGRAMS.length * (progH + gap) - gap) / 2;
  return (
    <Sketch
      label="SQL is a language, not a program"
      height={330}
      minWidth={860}
      viewBox="0 0 900 330"
      caption="বাম দিকে আপনি একটা বাক্য লিখছেন, যার ভাষা SQL। ডান দিকের পাঁচটা Program সবাই এই ভাষা বোঝে, আর প্রত্যেকে নিজের ডিস্কে নিজের Data রাখে। কেউ কারো অংশ না। MySQL শিখলে আপনি একটা Program চালানো শিখছেন, SQL শিখলে ভাষাটা, যেটা পাঁচটাতেই কাজে লাগে।"
    >
      <defs>
        <marker
          id="sqllang-arrow"
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

      {/* আপনি */}
      <rect x={30} y={midY - 40} width={150} height={80} fill="transparent" stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" />
      <SketchText x={105} y={midY - 8} size={12} bold>
        আপনি
      </SketchText>
      <SketchText x={105} y={midY + 14} size={10} body opacity={0.8}>
        একটা প্রশ্ন লিখলেন
      </SketchText>

      <line x1={184} y1={midY} x2={262} y2={midY} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#sqllang-arrow)" />

      {/* ভাষা */}
      <rect x={268} y={midY - 70} width={250} height={140} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={393} y={midY - 42} size={10} bold accent>
        ভাষা
      </SketchText>
      <SketchText x={393} y={midY - 10} size={22} bold accent>
        SQL
      </SketchText>
      <text x={393} y={midY + 20} textAnchor="middle" fontFamily={SKETCH_MONO} fontSize={9.5} fill="currentColor">
        SELECT title FROM tours;
      </text>
      <SketchText x={393} y={midY + 46} size={9.5} body opacity={0.8}>
        নিয়ম লেখা আছে ISO Standard এ
      </SketchText>

      {PROGRAMS.map((p, i) => {
        const y = top + i * (progH + gap);
        return (
          <g key={p.name}>
            <path
              d={`M 522 ${midY} C 560 ${midY}, 560 ${y + progH / 2}, ${progX - 4} ${y + progH / 2}`}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={p.accent ? 0.9 : 0.45}
              strokeWidth="1.2"
              markerEnd="url(#sqllang-arrow)"
            />
            <rect
              x={progX}
              y={y}
              width={progW}
              height={progH}
              fill={p.accent ? "var(--primary)" : "transparent"}
              fillOpacity={p.accent ? 0.1 : 0}
              stroke={p.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={p.accent ? 1 : 0.45}
              strokeWidth="1.2"
            />
            <SketchText x={progX + 14} y={y + 19} anchor="start" size={11.5} bold accent={p.accent}>
              {p.name}
            </SketchText>
            <SketchText x={progX + 14} y={y + 36} anchor="start" size={9.5} body opacity={0.75}>
              {p.sub}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কীভাবে বনাম কী: Declarative                                             */
/* ------------------------------------------------------------------------- */

const HOW_STEPS = [
  "১. প্রথম Row খুলুন",
  "২. দাম দেখুন, ১০০০০ এর কম?",
  "৩. কম হলে খাতায় লিখে রাখুন",
  "৪. পরের Row, আবার ২ নম্বর ধাপ",
  "৫. শেষ হলে খাতাটা দাম ধরে সাজান",
];

export function DeclarativeSplit() {
  return (
    <SketchSplit
      label="How vs What"
      caption="বাম দিকে আপনি কম্পিউটারকে প্রতিটা ধাপ বলে দিচ্ছেন, যেভাবে সাধারণ Program লেখা হয়। ডান দিকে আপনি শুধু বলছেন কী চাই। কোন Row আগে খুলবে, কোন শর্টকাট নেবে, সেই সিদ্ধান্ত DBMS নিজে নেয়। এই কারণেই একই Query দশ Row এর Table এও চলে, দশ কোটি Row এর Table এও।"
      panels={[
        {
          title: "How",
          sub: "প্রতিটা ধাপ আপনাকে বলতে হয়",
          viewBox: "0 0 340 250",
          height: 250,
          minWidth: 300,
          children: (
            <>
              {HOW_STEPS.map((step, i) => (
                <g key={step}>
                  <rect x={20} y={14 + i * 46} width={300} height={34} fill="transparent" stroke="currentColor" strokeOpacity={0.4} strokeWidth="1.1" />
                  <SketchText x={34} y={36 + i * 46} anchor="start" size={10.5} body>
                    {step}
                  </SketchText>
                </g>
              ))}
            </>
          ),
        },
        {
          title: "What",
          sub: "শুধু কী চাই, সেটা বলেন",
          viewBox: "0 0 340 250",
          height: 250,
          minWidth: 300,
          children: (
            <>
              <rect x={20} y={20} width={300} height={92} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.2" />
              <text x={36} y={50} fontFamily={SKETCH_MONO} fontSize={11} fill="currentColor">
                SELECT title, price_bdt
              </text>
              <text x={36} y={70} fontFamily={SKETCH_MONO} fontSize={11} fill="currentColor">
                FROM tours
              </text>
              <text x={36} y={90} fontFamily={SKETCH_MONO} fontSize={11} fill="currentColor">
                WHERE price_bdt {"<"} 10000 ORDER BY price_bdt;
              </text>
              <line x1={170} y1={116} x2={170} y2={146} stroke="var(--primary)" strokeWidth="1.3" />
              <rect x={60} y={150} width={220} height={74} fill="transparent" stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" strokeDasharray="4 3" />
              <SketchText x={170} y={176} size={11} bold>
                DBMS
              </SketchText>
              <SketchText x={170} y={198} size={10} body opacity={0.8}>
                কীভাবে খুঁজবে, নিজে ঠিক করে
              </SketchText>
            </>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. ছোট্ট ইতিহাস                                                            */
/* ------------------------------------------------------------------------- */

const MILESTONES = [
  { year: "1970", line1: "Codd এর Paper", line2: "Relational Model" },
  { year: "1970s", line1: "IBM এ SEQUEL", line2: "পরে নাম SQL" },
  { year: "1979", line1: "Oracle V2", line2: "প্রথম দিকের বিক্রি" },
  { year: "1986", line1: "ANSI Standard", line2: "আমেরিকার মান" },
  { year: "1987", line1: "ISO Standard", line2: "আন্তর্জাতিক মান" },
  { year: "1995", line1: "MySQL", line2: "প্রথম Release" },
  { year: "1996", line1: "PostgreSQL", line2: "এই নামে প্রথম" },
  { year: "2023", line1: "SQL:2023", line2: "সর্বশেষ Standard" },
];

export function SqlTimelineDiagram() {
  const left = 60;
  const right = 840;
  const axisY = 150;
  const step = (right - left) / (MILESTONES.length - 1);
  return (
    <Sketch
      label="Fifty years of one language"
      height={290}
      minWidth={860}
      viewBox="0 0 900 290"
      caption="SQL এর জন্ম PostgreSQL বা MySQL এর অনেক আগে। ভাষাটা আগে, Standard তারপর, আর আজকের জনপ্রিয় Program গুলো এসেছে আরও প্রায় দশ বছর পরে। তাই এগুলো ভাষাটার মালিক না, ভাষাটার ব্যবহারকারী।"
    >
      <line x1={left - 20} y1={axisY} x2={right + 20} y2={axisY} stroke="currentColor" strokeOpacity={0.4} strokeWidth="1.2" />
      {MILESTONES.map((m, i) => {
        const x = left + i * step;
        const above = i % 2 === 0;
        const programs = m.line1 === "MySQL" || m.line1 === "PostgreSQL";
        return (
          <g key={m.year + m.line1}>
            <circle cx={x} cy={axisY} r={6} fill={programs ? "var(--primary)" : "var(--card)"} stroke="var(--primary)" strokeWidth="1.4" />
            <line x1={x} y1={above ? axisY - 10 : axisY + 10} x2={x} y2={above ? axisY - 40 : axisY + 40} stroke="currentColor" strokeOpacity={0.3} strokeWidth="1" />
            <SketchText x={x} y={above ? axisY - 82 : axisY + 60} size={12} bold accent>
              {m.year}
            </SketchText>
            <SketchText x={x} y={above ? axisY - 64 : axisY + 78} size={10} body>
              {m.line1}
            </SketchText>
            <SketchText x={x} y={above ? axisY - 48 : axisY + 94} size={9.5} body opacity={0.7}>
              {m.line2}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Standard এর মূল অংশ, আর প্রতিটা Program এর নিজের সংযোজন                  */
/* ------------------------------------------------------------------------- */

const CORE = ["SELECT ... FROM ... WHERE", "JOIN, GROUP BY, ORDER BY", "INSERT, UPDATE, DELETE", "CREATE TABLE, PRIMARY KEY", "BEGIN, COMMIT, ROLLBACK"];
const PG_EXTRA = ["ILIKE", "price_bdt::text", "RETURNING", "ON CONFLICT", "jsonb"];
const MY_EXTRA = ["`backtick` নাম", "AUTO_INCREMENT", "ON DUPLICATE KEY", "DATE_FORMAT()", "LIKE তে ছোট বড় হাতের তফাত নেই"];

export function StandardCoreDiagram() {
  return (
    <Sketch
      label="One core, two accents"
      height={300}
      minWidth={860}
      viewBox="0 0 900 300"
      caption="মাঝের বাক্সটা Standard SQL, যা দুই Program এই হুবহু চলে, আর আপনার শেখার বেশিরভাগটা এটাই। দুই পাশে প্রত্যেকের নিজের সংযোজন, অনেকটা প্রমিত বাংলার সাথে আঞ্চলিক শব্দের মতো। একটা Program এর সংযোজন অন্যটায় সাধারণত চলে না।"
    >
      <rect x={300} y={30} width={300} height={240} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={450} y={58} size={11} bold accent>
        Standard SQL
      </SketchText>
      <SketchText x={450} y={78} size={9.5} body opacity={0.8}>
        দুই জায়গাতেই একই
      </SketchText>
      {CORE.map((c, i) => (
        <text key={c} x={450} y={112 + i * 30} textAnchor="middle" fontFamily={SKETCH_MONO} fontSize={10.5} fill="currentColor">
          {c}
        </text>
      ))}

      <rect x={30} y={50} width={240} height={200} fill="transparent" stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" strokeDasharray="4 3" />
      <SketchText x={150} y={76} size={11} bold>
        শুধু PostgreSQL এ
      </SketchText>
      {PG_EXTRA.map((c, i) => (
        <text key={c} x={150} y={106 + i * 28} textAnchor="middle" fontFamily={SKETCH_MONO} fontSize={10.5} fill="currentColor" fillOpacity={0.85}>
          {c}
        </text>
      ))}

      <rect x={630} y={50} width={240} height={200} fill="transparent" stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" strokeDasharray="4 3" />
      <SketchText x={750} y={76} size={11} bold>
        শুধু MySQL এ
      </SketchText>
      {MY_EXTRA.map((c, i) => (
        <SketchText key={c} x={750} y={106 + i * 28} size={i === 4 ? 9.5 : 10.5} body={i === 4} opacity={0.85}>
          {c}
        </SketchText>
      ))}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. পাঁচ পরিবারের Command                                                    */
/* ------------------------------------------------------------------------- */

const FAMILIES = [
  { short: "DDL", long: "Data Definition", words: "CREATE, ALTER, DROP", what: "কাঠামো বানায়", like: "নতুন তাক বানানো" },
  { short: "DML", long: "Data Manipulation", words: "INSERT, UPDATE, DELETE", what: "Data বদলায়", like: "তাকে বই রাখা, সরানো" },
  { short: "DQL", long: "Data Query", words: "SELECT", what: "শুধু পড়ে", like: "বই খুঁজে পড়া" },
  { short: "DCL", long: "Data Control", words: "GRANT, REVOKE", what: "অনুমতি ঠিক করে", like: "কার্ড কাকে দেবেন" },
  { short: "TCL", long: "Transaction Control", words: "BEGIN, COMMIT, ROLLBACK", what: "কাজ একসাথে বাঁধে", like: "হয় সব, নয়তো কিছুই না" },
];

export function CommandFamiliesDiagram() {
  const w = 160;
  const gap = 14;
  const startX = (900 - (FAMILIES.length * w + (FAMILIES.length - 1) * gap)) / 2;
  return (
    <Sketch
      label="Five families of SQL commands"
      height={250}
      minWidth={860}
      viewBox="0 0 900 250"
      caption="Island Tours কে একটা লাইব্রেরি ভাবুন। DDL দিয়ে তাক বানানো হয়, DML দিয়ে তাকে বই রাখা বা সরানো হয়, DQL দিয়ে বই খুঁজে পড়া হয়, DCL দিয়ে ঠিক হয় কে কোন তাকে হাত দিতে পারবে, আর TCL কয়েকটা কাজকে বেঁধে দেয় যাতে মাঝপথে থেমে গেলে কিছুই অর্ধেক না থাকে।"
    >
      {FAMILIES.map((f, i) => {
        const x = startX + i * (w + gap);
        const read = f.short === "DQL";
        return (
          <g key={f.short}>
            <rect x={x} y={24} width={w} height={200} fill={read ? "var(--primary)" : "transparent"} fillOpacity={read ? 0.08 : 0} stroke={read ? "var(--primary)" : "currentColor"} strokeOpacity={read ? 1 : 0.45} strokeWidth="1.2" />
            <SketchText x={x + w / 2} y={56} size={18} bold accent>
              {f.short}
            </SketchText>
            <SketchText x={x + w / 2} y={78} size={9} opacity={0.7}>
              {f.long}
            </SketchText>
            <line x1={x + 16} y1={92} x2={x + w - 16} y2={92} stroke="currentColor" strokeOpacity={0.2} />
            <SketchText x={x + w / 2} y={116} size={9.5} bold>
              {f.words}
            </SketchText>
            <SketchText x={x + w / 2} y={150} size={11} body>
              {f.what}
            </SketchText>
            <SketchText x={x + w / 2} y={190} size={9.5} body opacity={0.7}>
              {f.like}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. একটা Statement এর শরীর                                                  */
/* ------------------------------------------------------------------------- */

type TokenKind = "keyword" | "identifier" | "literal" | "operator" | "punct";

const TOKENS: { text: string; kind: TokenKind }[] = [
  { text: "SELECT", kind: "keyword" },
  { text: " ", kind: "punct" },
  { text: "title", kind: "identifier" },
  { text: ", ", kind: "punct" },
  { text: "price_bdt", kind: "identifier" },
  { text: " ", kind: "punct" },
  { text: "FROM", kind: "keyword" },
  { text: " ", kind: "punct" },
  { text: "tours", kind: "identifier" },
  { text: " ", kind: "punct" },
  { text: "WHERE", kind: "keyword" },
  { text: " ", kind: "punct" },
  { text: "price_bdt", kind: "identifier" },
  { text: " ", kind: "punct" },
  { text: "<", kind: "operator" },
  { text: " ", kind: "punct" },
  { text: "10000", kind: "literal" },
  { text: ";", kind: "punct" },
];

/** Which token each label points at, by index in TOKENS. */
const LABELS: { at: number; above: boolean; high?: boolean; title: string; note: string }[] = [
  { at: 0, above: true, title: "Keyword", note: "ভাষার নিজের শব্দ" },
  { at: 2, above: false, title: "Identifier", note: "Column এর নাম" },
  { at: 8, above: true, title: "Identifier", note: "Table এর নাম" },
  { at: 10, above: false, title: "Clause", note: "WHERE থেকে শর্তের শেষ" },
  { at: 14, above: true, title: "Operator", note: "তুলনা" },
  { at: 16, above: false, title: "Literal", note: "সরাসরি লেখা মান" },
  { at: 17, above: true, high: true, title: "Semicolon", note: "এখানে Statement শেষ" },
];

const KIND_COLOR: Record<TokenKind, string> = {
  keyword: "var(--primary)",
  identifier: "currentColor",
  literal: "var(--primary)",
  operator: "currentColor",
  punct: "currentColor",
};

export function StatementAnatomyDiagram() {
  const size = 17;
  const charW = size * 0.6;
  const total = TOKENS.reduce((n, t) => n + t.text.length, 0);
  const startX = (900 - total * charW) / 2;
  const baseY = 150;
  const placed = TOKENS.map((t, i) => {
    const before = TOKENS.slice(0, i).reduce((n, prev) => n + prev.text.length, 0);
    return { ...t, x: startX + before * charW, w: t.text.length * charW };
  });
  return (
    <Sketch
      label="Anatomy of one statement"
      height={290}
      minWidth={860}
      viewBox="0 0 900 290"
      caption="একটা SQL Statement কয়েক ধরনের টুকরো দিয়ে তৈরি। Keyword গুলো ভাষার নিজের শব্দ, Identifier গুলো আপনার Database এর জিনিসের নাম, Literal হলো আপনার হাতে লেখা মান, আর Semicolon বলে দেয় বাক্য এখানে শেষ। Clause হলো একটা Keyword থেকে শুরু হওয়া পুরো একটা অংশ।"
    >
      {placed.map((t, i) =>
        t.kind === "punct" ? (
          <text key={i} x={t.x} y={baseY} fontFamily={SKETCH_MONO} fontSize={size} fill="currentColor" xmlSpace="preserve">
            {t.text}
          </text>
        ) : (
          <g key={i}>
            <rect x={t.x - 2} y={baseY - size} width={t.w + 4} height={size + 8} fill={t.kind === "keyword" || t.kind === "literal" ? "var(--primary)" : "currentColor"} fillOpacity={t.kind === "keyword" || t.kind === "literal" ? 0.1 : 0.05} />
            <text x={t.x} y={baseY} fontFamily={SKETCH_MONO} fontSize={size} fontWeight={t.kind === "keyword" ? 700 : 400} fill={KIND_COLOR[t.kind]}>
              {t.text}
            </text>
          </g>
        ),
      )}

      {/* WHERE clause এর বন্ধনী */}
      {(() => {
        const from = placed[10].x;
        const to = placed[16].x + placed[16].w;
        return <path d={`M ${from} ${baseY + 14} V ${baseY + 22} H ${to} V ${baseY + 14}`} fill="none" stroke="var(--primary)" strokeOpacity={0.6} strokeWidth="1.2" />;
      })()}

      {LABELS.map((l) => {
        const t = placed[l.at];
        const cx = t.x + t.w / 2;
        const y1 = l.above ? baseY - size - 6 : baseY + (l.at === 10 ? 26 : 12);
        const y2 = l.above ? (l.high ? 38 : 76) : 214;
        return (
          <g key={`${l.at}-${l.title}`}>
            <line x1={cx} y1={y1} x2={cx} y2={y2} stroke="currentColor" strokeOpacity={0.35} strokeWidth="1" />
            <SketchText x={cx} y={l.above ? y2 - 22 : y2 + 16} size={10.5} bold accent>
              {l.title}
            </SketchText>
            <SketchText x={cx} y={l.above ? y2 - 6 : y2 + 32} size={9.5} body opacity={0.8}>
              {l.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
