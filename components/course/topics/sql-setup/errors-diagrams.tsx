import { Sketch, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* 1. কে কথা বলছে: একটা Error কোন ধাপ থেকে আসে                                 */
/* ------------------------------------------------------------------------- */

const STAGES = [
  {
    title: "Shell",
    who: "আপনার Terminal",
    example: "command not found",
    meaning: "psql খুঁজেই পাওয়া যায়নি",
    pg: false,
  },
  {
    title: "Network",
    who: "Port এর দরজা",
    example: "Connection refused",
    meaning: "ওপাশে কেউ শুনছে না",
    pg: false,
  },
  {
    title: "Login",
    who: "PostgreSQL এর দারোয়ান",
    example: "FATAL: password ...",
    meaning: "পরিচয় মেলেনি",
    pg: true,
  },
  {
    title: "Parser",
    who: "বাক্য পড়ে",
    example: "syntax error at or near",
    meaning: "বাক্যটাই ভাঙা",
    pg: true,
  },
  {
    title: "Analyzer",
    who: "নাম মেলায়",
    example: "does not exist",
    meaning: "Table বা Column নেই",
    pg: true,
  },
  {
    title: "Executor",
    who: "কাজটা করে",
    example: "violates ... constraint",
    meaning: "Data বা নিয়মে আপত্তি",
    pg: true,
  },
];

export function ErrorSourcesDiagram() {
  const w = 148;
  const gap = 18;
  const x0 = 14;
  return (
    <Sketch
      label="কে কথা বলছে: একটা Error কোন ধাপ থেকে আসে"
      height={300}
      minWidth={1000}
      viewBox="0 0 1000 300"
      caption="আপনার Enter চাপা থেকে উত্তর আসা পর্যন্ত ছয়টা ধাপ। প্রথম দুটো PostgreSQL এর বাইরে: Shell আর Network। বাকি চারটা PostgreSQL এর ভেতরে। Error এর প্রথম কয়েকটা শব্দ দেখেই বলা যায় কোন ধাপ আপত্তি করেছে, আর সেটা জানলেই অর্ধেক সমাধান হয়ে যায়।"
    >
      <defs>
        <marker
          id="errors-sources-arrow"
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
        x={x0 + 2 * (w + gap) - 8}
        y={20}
        width={4 * w + 3 * gap + 16}
        height={262}
        fill="var(--primary)"
        fillOpacity={0.04}
        stroke="var(--primary)"
        strokeOpacity={0.4}
        strokeDasharray="5 4"
      />
      <SketchText x={x0 + 2 * (w + gap) + 4} y={38} anchor="start" size={10} bold accent>
        PostgreSQL এর ভেতরে
      </SketchText>
      <SketchText x={x0 + 4} y={38} anchor="start" size={10} opacity={0.7}>
        PostgreSQL এর বাইরে
      </SketchText>
      {STAGES.map((stage, i) => {
        const x = x0 + i * (w + gap);
        return (
          <g key={stage.title}>
            <rect
              x={x}
              y={58}
              width={w}
              height={64}
              fill={stage.pg ? "var(--primary)" : "currentColor"}
              fillOpacity={stage.pg ? 0.1 : 0.04}
              stroke={stage.pg ? "var(--primary)" : "currentColor"}
              strokeOpacity={stage.pg ? 0.9 : 0.45}
              strokeWidth="1.2"
            />
            <SketchText x={x + w / 2} y={84} size={12} bold accent={stage.pg}>
              {stage.title}
            </SketchText>
            <SketchText x={x + w / 2} y={104} size={10} body opacity={0.8}>
              {stage.who}
            </SketchText>
            {i < STAGES.length - 1 && (
              <line
                x1={x + w + 2}
                y1={90}
                x2={x + w + gap - 2}
                y2={90}
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#errors-sources-arrow)"
              />
            )}
            <line
              x1={x + w / 2}
              y1={124}
              x2={x + w / 2}
              y2={160}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeDasharray="3 3"
            />
            <rect
              x={x + 4}
              y={162}
              width={w - 8}
              height={42}
              fill="var(--card)"
              stroke="currentColor"
              strokeOpacity={0.3}
            />
            <SketchText x={x + w / 2} y={188} size={9.5}>
              {stage.example}
            </SketchText>
            <SketchText x={x + w / 2} y={232} size={10.5} body opacity={0.85}>
              {stage.meaning}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. SQLSTATE: পাঁচ অক্ষরের কোড, প্রথম দুটো অক্ষর পরিবার                       */
/* ------------------------------------------------------------------------- */

const CLASSES = [
  { code: "08", name: "Connection", bn: "যোগাযোগ ভেঙেছে", example: "08006" },
  { code: "22", name: "Data", bn: "মানটা ভুল ধরনের", example: "22P02, 22012" },
  { code: "23", name: "Integrity", bn: "Table এর নিয়ম ভেঙেছে", example: "23505, 23503" },
  { code: "25", name: "Transaction State", bn: "Transaction ভাঙা অবস্থায়", example: "25P02" },
  { code: "28", name: "Authorization", bn: "পরিচয় মেলেনি", example: "28P01, 28000" },
  { code: "3D", name: "Catalog Name", bn: "এই নামে Database নেই", example: "3D000" },
  { code: "40", name: "Transaction Rollback", bn: "আবার চেষ্টা করতে হবে", example: "40001, 40P01" },
  { code: "42", name: "Syntax / Access", bn: "বাক্য বা নাম ভুল", example: "42601, 42P01" },
  { code: "53", name: "Resources", bn: "Server এর সামর্থ্য শেষ", example: "53300" },
  { code: "57", name: "Operator", bn: "কেউ থামিয়ে দিয়েছে", example: "57014" },
];

export function SqlstateClassesDiagram() {
  const cols = 5;
  const cw = 184;
  const ch = 92;
  return (
    <Sketch
      label="SQLSTATE: প্রথম দুই অক্ষর বলে দেয় কোন পরিবারের Error"
      height={330}
      minWidth={960}
      viewBox="0 0 960 330"
      caption="প্রতিটা PostgreSQL Error এর সাথে একটা পাঁচ অক্ষরের SQLSTATE কোড থাকে। পুরো কোড মুখস্থ করার দরকার নেই। প্রথম দুই অক্ষর দেখলেই বোঝা যায় সমস্যাটা কোন জাতের: 23 মানে Table এর কোনো নিয়ম, 42 মানে বাক্য বা নাম, 28 মানে Login। এখানে শুধু সবচেয়ে বেশি দেখা পরিবারগুলো, পুরো তালিকা PostgreSQL এর Docs এর Appendix A তে।"
    >
      <SketchText x={480} y={26} size={12} bold>
        2 3 5 0 5
      </SketchText>
      <line x1={448} y1={34} x2={472} y2={34} stroke="var(--primary)" strokeWidth="2" />
      <line x1={480} y1={34} x2={514} y2={34} stroke="currentColor" strokeOpacity={0.5} strokeWidth="2" />
      <SketchText x={410} y={52} size={9.5} body accent anchor="end">
        পরিবার (Class)
      </SketchText>
      <SketchText x={526} y={52} size={9.5} body anchor="start" opacity={0.75}>
        পরিবারের ভেতরের নির্দিষ্ট কারণ
      </SketchText>
      {CLASSES.map((c, i) => {
        const x = 10 + (i % cols) * (cw + 4);
        const y = 72 + Math.floor(i / cols) * (ch + 22);
        const hot = c.code === "23" || c.code === "42";
        return (
          <g key={c.code}>
            <rect
              x={x}
              y={y}
              width={cw}
              height={ch}
              fill={hot ? "var(--primary)" : "currentColor"}
              fillOpacity={hot ? 0.1 : 0.04}
              stroke={hot ? "var(--primary)" : "currentColor"}
              strokeOpacity={hot ? 0.9 : 0.4}
              strokeWidth="1.2"
            />
            <SketchText x={x + 14} y={y + 28} anchor="start" size={18} bold accent={hot}>
              {c.code}
            </SketchText>
            <SketchText x={x + 52} y={y + 26} anchor="start" size={10} bold>
              {c.name}
            </SketchText>
            <SketchText x={x + 14} y={y + 54} anchor="start" size={10.5} body opacity={0.9}>
              {c.bn}
            </SketchText>
            <SketchText x={x + 14} y={y + 76} anchor="start" size={9} opacity={0.65}>
              {c.example}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Docs এর Synopsis পড়া                                                    */
/* ------------------------------------------------------------------------- */

const SYNOPSIS = [
  { text: "DROP TABLE", x: 40, kind: "literal" },
  { text: "[ IF EXISTS ]", x: 190, kind: "optional" },
  { text: "name", x: 388, kind: "yours" },
  { text: "[, ...]", x: 470, kind: "repeat" },
  { text: "[ CASCADE | RESTRICT ]", x: 590, kind: "choice" },
];

const SYN_NOTES: Record<string, { label: string; note: string }> = {
  literal: { label: "হুবহু লিখুন", note: "বড় হাতের শব্দ" },
  optional: { label: "[ ] মানে ঐচ্ছিক", note: "লিখলেও চলে, না লিখলেও" },
  yours: { label: "আপনার দেওয়া নাম", note: "এখানে Table এর নাম" },
  repeat: { label: "... মানে আরও দেওয়া যায়", note: "কমা দিয়ে কয়েকটা নাম" },
  choice: { label: "| মানে যেকোনো একটা", note: "দুটোর একটা, বা কোনোটাই না" },
};

export function SynopsisDiagram() {
  return (
    <Sketch
      label="Docs এর Synopsis লাইন কীভাবে পড়বেন"
      height={290}
      minWidth={900}
      viewBox="0 0 900 290"
      caption="psql এ \h DROP TABLE লিখলে, আর Docs এর DROP TABLE পাতার একদম উপরে, ঠিক এই লাইনটা দেখবেন। পাঁচটা চিহ্ন বুঝলেই PostgreSQL এর যেকোনো Command এর Synopsis পড়া যায়: [ ] ঐচ্ছিক, { } এর ভেতরে | দিয়ে আলাদা করা অংশ থেকে একটা বেছে নিতে হবে, আর ... মানে আগের অংশটা আরও দেওয়া যায়। বাকি সব চিহ্ন, যেমন বন্ধনী, হুবহু লিখতে হয়।"
    >
      <rect x={20} y={36} width={860} height={52} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.35} />
      {SYNOPSIS.map((part, i) => {
        const note = SYN_NOTES[part.kind];
        const accent = part.kind !== "literal";
        const width = part.text.length * 9.6;
        // Neighbouring labels sit on alternate rows so they never overlap.
        const labelY = 150 + (i % 2) * 48;
        return (
          <g key={part.text}>
            <SketchText x={part.x} y={68} anchor="start" size={16} bold={part.kind === "literal" || part.kind === "yours"} accent={accent}>
              {part.text}
            </SketchText>
            <line
              x1={part.x + width / 2}
              y1={92}
              x2={part.x + width / 2}
              y2={labelY - 18}
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 0.8 : 0.45}
              strokeDasharray="3 3"
            />
            <SketchText x={part.x + width / 2} y={labelY} size={10.5} body bold accent={accent}>
              {note.label}
            </SketchText>
            <SketchText x={part.x + width / 2} y={labelY + 20} size={10} body opacity={0.75}>
              {note.note}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={450} y={270} size={10.5} body opacity={0.85}>
        সম্ভাব্য একটা বাক্য: DROP TABLE IF EXISTS tour_notes, tour_drafts RESTRICT;
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. আটকে গেলে কোন ক্রমে সাহায্য খুঁজবেন                                     */
/* ------------------------------------------------------------------------- */

const LADDER = [
  { step: "১", title: "পুরো Error টা পড়ুন", note: "প্রথম লাইন, DETAIL, HINT, LINE আর ^ চিহ্ন" },
  { step: "২", title: "কে কথা বলছে, ঠিক করুন", note: "Shell, Network, Login, না আপনার SQL" },
  { step: "৩", title: "\\h আর Docs খুলুন", note: "নিজের Version এর পাতা, Synopsis আর Examples" },
  { step: "৪", title: "হুবহু Message দিয়ে খুঁজুন", note: "নিজের Table এর নাম বাদ দিয়ে, Quote এর ভেতরে" },
  { step: "৫", title: "ছোট একটা উদাহরণ বানান", note: "যত কম লাইনে Error টা আবার আসে" },
  { step: "৬", title: "মানুষ বা AI কে জিজ্ঞেস করুন", note: "উত্তরটা নিজে চালিয়ে যাচাই করে তবেই বিশ্বাস" },
];

export function HelpLadderDiagram() {
  return (
    <Sketch
      label="আটকে গেলে সাহায্যের সিঁড়ি"
      height={330}
      minWidth={980}
      viewBox="0 0 980 330"
      caption="নিচ থেকে উপরে না, উপর থেকে নিচে নামুন। প্রথম তিন ধাপে বেশিরভাগ সমস্যা মিটে যায়, আর কাউকে জিজ্ঞেস করতে হয় না। আর যখন জিজ্ঞেস করতেই হয়, তখন পাঁচ নম্বর ধাপের ছোট উদাহরণটা হাতে থাকলে উত্তর আসে দ্রুত, আর প্রায়ই বানাতে গিয়েই নিজে উত্তর পেয়ে যান।"
    >
      {LADDER.map((rung, i) => {
        const y = 18 + i * 50;
        const x = 20 + i * 30;
        return (
          <g key={rung.step}>
            <rect
              x={x}
              y={y}
              width={520}
              height={40}
              fill={i < 3 ? "var(--primary)" : "currentColor"}
              fillOpacity={i < 3 ? 0.1 : 0.04}
              stroke={i < 3 ? "var(--primary)" : "currentColor"}
              strokeOpacity={i < 3 ? 0.85 : 0.4}
              strokeWidth="1.2"
            />
            <SketchText x={x + 22} y={y + 26} size={14} bold accent={i < 3}>
              {rung.step}
            </SketchText>
            <SketchText x={x + 46} y={y + 25} anchor="start" size={12} body bold>
              {rung.title}
            </SketchText>
            <SketchText x={x + 536} y={y + 25} anchor="start" size={10} body opacity={0.75}>
              {rung.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. Module 02 এর পুরো পথ                                                    */
/* ------------------------------------------------------------------------- */

const STORY = [
  { n: "01", title: "PostgreSQL ইনস্টল", sub: "Server চালু, Port 5432" },
  { n: "02", title: "MySQL পাশাপাশি", sub: "ভিডিও ফলো করার জন্য" },
  { n: "03", title: "psql", sub: "Terminal থেকে কথা" },
  { n: "04", title: "GUI Client", sub: "চোখে দেখে কাজ" },
  { n: "05", title: "Database আর Schema", sub: "নাম কোথায় খোঁজা হয়" },
  { n: "06", title: "island_tours Load", sub: "আটটা Table, নিজের মেশিনে" },
  { n: "07", title: "Error পড়া", sub: "লাল লেখা মানে সূত্র" },
];

export function ModuleTwoStoryDiagram() {
  const w = 120;
  const gap = 14;
  return (
    <Sketch
      label="Module 02 এক নজরে"
      height={250}
      minWidth={1000}
      viewBox="0 0 1000 250"
      caption="সাতটা লেসন মিলে একটাই কাজ করেছে: আপনার নিজের মেশিনে একটা আসল, চালু Database, যেটার সাথে আপনি Terminal আর GUI দুইভাবেই কথা বলতে পারেন, যার ভেতরে Island Tours এর Data আছে, আর যেটা আপত্তি করলে আপনি তার কথা পড়তে পারেন। এবার প্রশ্ন করার পালা: Module 03।"
    >
      <defs>
        <marker
          id="errors-story-arrow"
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
        const x = 12 + i * (w + gap);
        const here = i === STORY.length - 1;
        return (
          <g key={s.n}>
            <SketchText x={x + w / 2} y={44} size={9} bold accent={here} opacity={here ? 1 : 0.6}>
              {`Lesson ${s.n}`}
            </SketchText>
            <rect
              x={x}
              y={56}
              width={w}
              height={70}
              fill={here ? "var(--primary)" : "currentColor"}
              fillOpacity={here ? 0.12 : 0.04}
              stroke={here ? "var(--primary)" : "currentColor"}
              strokeOpacity={here ? 1 : 0.45}
              strokeWidth="1.2"
            />
            <SketchText x={x + w / 2} y={86} size={11} body bold accent={here}>
              {s.title}
            </SketchText>
            <SketchText x={x + w / 2} y={108} size={9.5} body opacity={0.75}>
              {s.sub}
            </SketchText>
            {i < STORY.length - 1 && (
              <line
                x1={x + w + 2}
                y1={91}
                x2={x + w + gap - 2}
                y2={91}
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#errors-story-arrow)"
              />
            )}
          </g>
        );
      })}
      <path
        d="M 876 126 V 178 H 560"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
        strokeDasharray="5 4"
        markerEnd="url(#errors-story-arrow)"
      />
      <rect x={300} y={156} width={256} height={44} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeOpacity={0.8} />
      <SketchText x={428} y={176} size={11} bold accent>
        Module 03 · Reading Data
      </SketchText>
      <SketchText x={428} y={193} size={9.5} body opacity={0.85}>
        SELECT দিয়ে নিজের প্রশ্নের উত্তর
      </SketchText>
    </Sketch>
  );
}
