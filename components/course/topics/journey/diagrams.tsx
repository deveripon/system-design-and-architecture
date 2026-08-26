import { Sketch, SketchText } from "../../sketch";

function Defs({ id, accent }: { id: string; accent?: boolean }) {
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
          fill={accent ? "var(--primary)" : "currentColor"}
          fillOpacity={accent ? 1 : 0.55}
        />
      </marker>
    </defs>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. পুরো যাত্রা, এক ছবিতে                                                    */
/* ------------------------------------------------------------------------- */

const ARC = [
  { label: "URL লেখা", sub: "Browser", side: "you" },
  { label: "নাম → নম্বর", sub: "DNS, Module 04", side: "you" },
  { label: "রাস্তা খোঁজা", sub: "ISP, IIG", side: "road" },
  { label: "দরজায় কড়া", sub: "Port 443", side: "server" },
  { label: "খাম বন্ধ", sub: "HTTPS, Module 06", side: "server" },
  { label: "API", sub: "Request পেল", side: "server" },
  { label: "Database", sub: "API এখন Client", side: "server" },
  { label: "Response", sub: "উত্তর তৈরি", side: "server" },
  { label: "ফিরতি পথ", sub: "একই সমুদ্র", side: "road" },
  { label: "পর্দায় ছবি", sub: "Browser আঁকল", side: "you" },
];

export function FullJourneyDiagram() {
  const cols = ARC.length;
  const w = 150;
  const gap = 16;
  const totalW = cols * w + (cols - 1) * gap;
  const startX = 30;
  const tone = (side: string) =>
    side === "server"
      ? "var(--primary)"
      : side === "road"
        ? "currentColor"
        : "currentColor";
  return (
    <Sketch
      label="Diagram: পুরো যাত্রা, শুরু থেকে শেষ"
      height={260}
      minWidth={totalW + 60}
      viewBox={`0 0 ${totalW + 60} 260`}
      caption="এই দশটা ধাপ মিলিয়ে একটা Request এর পুরো জীবন। বাঁ দিকের তিনটা আপনার দিক, মাঝেরগুলো রাস্তা আর সার্ভার, ডানেরটা আবার আপনি। ধূসর দুইটা ধাপ, নাম থেকে নম্বর আর খাম বন্ধ করা, এই মডিউলে শেখানো হয়নি, ওগুলো Module 04 আর 06 এর, তাই এখানে শুধু চিনিয়ে রাখা হলো। বাকি আটটা ধাপ আপনি এই মডিউলেই একটা একটা করে শিখেছেন, এবার শুধু একসাথে জোড়া লাগছে।"
    >
      {ARC.map((a, i) => {
        const x = startX + i * (w + gap);
        const y = 90;
        const t = tone(a.side);
        const faded = a.sub.includes("Module");
        return (
          <g key={a.label}>
            <rect
              x={x}
              y={y}
              width={w}
              height={54}
              fill={
                a.side === "server" && !faded ? "var(--primary)" : "transparent"
              }
              fillOpacity={a.side === "server" && !faded ? 0.1 : 0}
              stroke={t}
              strokeOpacity={faded ? 0.3 : a.side === "server" ? 1 : 0.5}
              strokeWidth="1.2"
              strokeDasharray={faded ? "4 3" : undefined}
            />
            <SketchText
              x={x + w / 2}
              y={y + 24}
              size={10}
              bold
              accent={a.side === "server" && !faded}
              opacity={faded ? 0.5 : 1}
            >
              {a.label}
            </SketchText>
            <SketchText
              x={x + w / 2}
              y={y + 40}
              size={8}
              opacity={faded ? 0.45 : 0.6}
              body
            >
              {a.sub}
            </SketchText>
            <SketchText x={x + w / 2} y={y - 10} size={9} bold accent>
              {toBnLocal(i + 1)}
            </SketchText>
            {i < cols - 1 && (
              <line
                x1={x + w}
                y1={y + 27}
                x2={x + w + gap}
                y2={y + 27}
                stroke="currentColor"
                strokeOpacity={0.4}
                strokeWidth="1.2"
                markerEnd="url(#fj-a)"
              />
            )}
          </g>
        );
      })}
      {/* return sweep */}
      <path
        d={`M ${startX + (cols - 1) * (w + gap) + w / 2} 165 Q ${totalW / 2} 235 ${startX + w / 2} 165`}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity={0.4}
        strokeWidth="1.2"
        strokeDasharray="5 4"
        markerEnd="url(#fj-b)"
      />
      <SketchText x={totalW / 2 + 20} y={225} size={9} accent opacity={0.75}>
        উত্তর একই পথে ফেরে, উল্টো দিকে
      </SketchText>
      <SketchText x={startX + 40} y={70} size={8} opacity={0.55}>
        আপনার দিক
      </SketchText>
      <SketchText
        x={startX + 3 * (w + gap) + 40}
        y={70}
        size={8}
        opacity={0.55}
      >
        সার্ভারের দিক
      </SketchText>
      <Defs id="fj-a" />
      <Defs id="fj-b" accent />
    </Sketch>
  );
}

function toBnLocal(n: number) {
  const d = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(n).replace(/\d/g, (x) => d[Number(x)]);
}

/* ------------------------------------------------------------------------- */
/* 2. কোন ধাপ কোন লেসনের                                                       */
/* ------------------------------------------------------------------------- */

const LEGS = [
  {
    leg: "URL এ নাম থেকে নম্বর",
    owner: "DNS",
    lesson: "Module 04",
    known: false,
  },
  {
    leg: "রাস্তা, ISP থেকে সমুদ্র",
    owner: "জোড়া নেটওয়ার্ক",
    lesson: "Lesson 01, 05",
    known: true,
  },
  {
    leg: "কে জিজ্ঞেস, কে উত্তর",
    owner: "Client আর Server",
    lesson: "Lesson 02",
    known: true,
  },
  {
    leg: "মেশিনের কোন Program",
    owner: "Port আর Socket",
    lesson: "Lesson 03",
    known: true,
  },
  {
    leg: "টুকরো, দেরি, চওড়া",
    owner: "Packet, Latency",
    lesson: "Lesson 04",
    known: true,
  },
  {
    leg: "খাম বন্ধ, নিরাপদ",
    owner: "HTTPS",
    lesson: "Module 06",
    known: false,
  },
  {
    leg: "API থেকে Database",
    owner: "ভূমিকা বদল",
    lesson: "Lesson 02",
    known: true,
  },
];

export function WhoOwnsWhatDiagram() {
  const rowH = 40;
  const top = 40;
  const h = top + LEGS.length * rowH + 26;
  return (
    <Sketch
      label="Diagram: প্রতিটা ধাপ, কোন লেসন"
      height={h}
      minWidth={760}
      viewBox={`0 0 760 ${h}`}
      caption="এই টেবিলটাই আসলে পুরো মডিউলের সূচিপত্র। প্রতিটা সারি যাত্রার একটা ধাপ, আর ডানে লেখা সেটা কোন লেসনে শিখেছেন। কমলা সারিগুলো আপনি ইতিমধ্যে জানেন, ধূসর দুইটা এখনো বাকি। মানে এই এক Request এর যাত্রা বুঝতে যা লাগে, তার প্রায় সবটাই আপনার হয়ে গেছে।"
    >
      <SketchText x={30} y={26} size={8} anchor="start" opacity={0.55}>
        যাত্রার ধাপ
      </SketchText>
      <SketchText x={430} y={26} size={8} anchor="start" opacity={0.55}>
        কী কাজ করে
      </SketchText>
      <SketchText x={620} y={26} size={8} anchor="start" opacity={0.55}>
        কোথায় শিখেছেন
      </SketchText>
      {LEGS.map((l, i) => {
        const y = top + i * rowH;
        return (
          <g key={l.leg}>
            <rect
              x={24}
              y={y}
              width={712}
              height={rowH - 8}
              fill={l.known ? "var(--primary)" : "transparent"}
              fillOpacity={l.known ? 0.06 : 0}
              stroke={l.known ? "var(--primary)" : "currentColor"}
              strokeOpacity={l.known ? 0.5 : 0.25}
              strokeWidth="1"
              strokeDasharray={l.known ? undefined : "4 3"}
            />
            <SketchText
              x={40}
              y={y + 20}
              size={10}
              anchor="start"
              bold={l.known}
              opacity={l.known ? 1 : 0.5}
            >
              {l.leg}
            </SketchText>
            <SketchText
              x={430}
              y={y + 20}
              size={9}
              anchor="start"
              opacity={l.known ? 0.75 : 0.45}
              body
            >
              {l.owner}
            </SketchText>
            <SketchText
              x={620}
              y={y + 20}
              size={9}
              anchor="start"
              accent={l.known}
              opacity={l.known ? 1 : 0.5}
              bold
            >
              {l.lesson}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. সময়টা আসলে কোথায় যায়                                                   */
/* ------------------------------------------------------------------------- */

const BUDGET = [
  { label: "নাম থেকে নম্বর", ms: 30, note: "প্রথমবার, DNS" },
  { label: "রাস্তা তৈরি, খাম বন্ধ", ms: 180, note: "কয়েকবার যাওয়া আসা" },
  { label: "সার্ভারের নিজের কাজ", ms: 40, note: "Database, হিসাব" },
  { label: "উত্তর ফেরা", ms: 60, note: "এক Latency" },
  { label: "Browser আঁকা", ms: 90, note: "পর্দায় বসানো" },
];

export function TimeBudgetDiagram() {
  const total = BUDGET.reduce((a, b) => a + b.ms, 0);
  const rowH = 46;
  const top = 46;
  const h = top + BUDGET.length * rowH + 40;
  const maxBar = 520;
  return (
    <Sketch
      label="Diagram: প্রায় ৪০০ ms কোথায় খরচ হয়"
      height={h}
      minWidth={780}
      viewBox={`0 0 780 ${h}`}
      caption="একটা Request এর মোট সময়টা কোথায় কোথায় যায়, তার একটা আনুমানিক ভাগ। খেয়াল করুন, সার্ভারের নিজের কাজ, মানে আপনার লেখা কোড, সবচেয়ে ছোট অংশ। বড় অংশটা রাস্তা তৈরি আর খাম বন্ধ করায়, মানে যাওয়া আসায়। এই কারণেই সাইট দ্রুত করার সবচেয়ে বড় কৌশল প্রায়ই কোড দ্রুত করা নয়, বরং যাওয়া আসা কমানো। সংখ্যাগুলো আনুমানিক, আর প্রথমবারের, কারণ পরের বার অনেক কিছু জমা থাকে।"
    >
      <SketchText x={30} y={28} size={8} anchor="start" opacity={0.55}>
        ধাপ
      </SketchText>
      <SketchText x={260} y={28} size={8} anchor="start" opacity={0.55}>
        আনুমানিক সময়
      </SketchText>
      {BUDGET.map((b, i) => {
        const y = top + i * rowH;
        const server = b.label.includes("সার্ভারের");
        return (
          <g key={b.label}>
            <SketchText x={30} y={y + 16} size={10} anchor="start" bold>
              {b.label}
            </SketchText>
            <SketchText
              x={30}
              y={y + 30}
              size={8}
              anchor="start"
              opacity={0.55}
              body
            >
              {b.note}
            </SketchText>
            <rect
              x={260}
              y={y + 2}
              width={(b.ms / total) * maxBar}
              height={22}
              fill={server ? "currentColor" : "var(--primary)"}
              fillOpacity={server ? 0.35 : 0.7}
            />
            <SketchText
              x={260 + (b.ms / total) * maxBar + 30}
              y={y + 18}
              size={10}
              bold
              accent={!server}
            >
              {toBnLocal(b.ms)} ms
            </SketchText>
          </g>
        );
      })}
      <line
        x1={260}
        y1={top + BUDGET.length * rowH + 4}
        x2={260 + maxBar}
        y2={top + BUDGET.length * rowH + 4}
        stroke="currentColor"
        strokeOpacity={0.2}
        strokeWidth="1"
      />
      <SketchText x={30} y={h - 12} size={9} anchor="start" opacity={0.7} body>
        মোট প্রায় {toBnLocal(total)} ms, আর তার বেশিরভাগ যাওয়া আসায়, কোডে নয়
      </SketchText>
    </Sketch>
  );
}
