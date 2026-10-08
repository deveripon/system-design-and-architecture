import { Sketch, SketchSplit, SketchText } from "../../sketch";

function Arrow({ id, faint }: { id: string; faint?: boolean }) {
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
          fill={faint ? "currentColor" : "var(--primary)"}
          fillOpacity={faint ? 0.5 : 1}
        />
      </marker>
    </defs>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. একটা নাম আসলে একটা গাছের পথ                                              */
/* ------------------------------------------------------------------------- */

const PARTS = [
  { text: "www", label: "Host", sub: "কোন যন্ত্র" },
  { text: "islandtours", label: "Domain", sub: "আপনার কেনা নাম" },
  { text: "example", label: "TLD", sub: "শেষ অংশ" },
  { text: ".", label: "Root", sub: "সবার উপরে" },
];

export function NameTreeDiagram() {
  const w = 150;
  const gap = 18;
  const startX = (760 - (PARTS.length * w + (PARTS.length - 1) * gap)) / 2;
  return (
    <Sketch
      label="Diagram: নামটা ডান থেকে বাঁ পড়ুন"
      height={230}
      minWidth={760}
      viewBox="0 0 760 230"
      caption="www.islandtours.example নামটা আসলে একটা গাছের পথ, আর সেটা পড়তে হয় ডান থেকে বাঁয়ে, উপর থেকে নিচে। সবার ডানে একটা অদৃশ্য ফোঁটা থাকে, সেটাই Root, সবার উপরের স্তর। তারপর example, যেটা TLD। তারপর islandtours, আপনার কেনা Domain। আর সবার বাঁয়ে www, একটা নির্দিষ্ট যন্ত্র বা অংশ। এই উল্টো পড়াটাই DNS খোঁজার চাবি, কারণ খোঁজা শুরু হয় সবার উপরে, Root থেকে।"
    >
      <SketchText x={380} y={34} size={10} bold>
        www.islandtours.example
      </SketchText>
      {PARTS.map((p, i) => {
        const x = startX + i * (w + gap);
        const accent = i === 3;
        return (
          <g key={p.label}>
            <rect
              x={x}
              y={70}
              width={w}
              height={56}
              fill={accent ? "var(--primary)" : "currentColor"}
              fillOpacity={accent ? 0.12 : 0.05}
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 1 : 0.45}
              strokeWidth="1.3"
            />
            <SketchText x={x + w / 2} y={102} size={16} bold accent={accent}>
              {p.text}
            </SketchText>
            <SketchText x={x + w / 2} y={150} size={11} bold accent={accent}>
              {p.label}
            </SketchText>
            <SketchText x={x + w / 2} y={168} size={8.5} opacity={0.6} body>
              {p.sub}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={380} y={205} size={9} accent body>
        খোঁজা শুরু ডান দিক থেকে, সবার উপরের স্তর Root থেকে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. তিন স্তরের server, কে কী জানে                                            */
/* ------------------------------------------------------------------------- */

const TIERS = [
  {
    name: "Root Server",
    knows: "শুধু জানে কোন TLD কে চালায়",
    run: "প্রায় ১৩টা পরিচয়, দুনিয়াজুড়ে ছড়ানো",
  },
  {
    name: "TLD Server",
    knows: "জানে কোন Domain এর Authoritative কে",
    run: "সেই TLD এর Registry চালায় (যেমন .com এর Verisign)",
  },
  {
    name: "Authoritative Server",
    knows: "নামটার আসল Record রাখে, চূড়ান্ত উত্তর",
    run: "Domain এর মালিক ঠিক করে দেয়",
  },
];

export function TiersDiagram() {
  const boxH = 64;
  const gap = 28;
  const top = 20;
  const w = 480;
  const x = 60;
  const h = top + TIERS.length * (boxH + gap);
  return (
    <Sketch
      label="Diagram: তিন স্তর, কে কী জানে"
      height={h}
      minWidth={720}
      viewBox={`0 0 720 ${h}`}
      caption="DNS এর খোঁজা চলে তিন স্তরের server এ। সবার উপরে Root, সে কোনো নামের IP জানে না, শুধু জানে কোন TLD কে চালায়। মাঝে TLD server, সেও IP জানে না, শুধু জানে কোন Domain এর হিসাব কোন Authoritative server রাখে। আর সবার নিচে Authoritative server, এটাই সেই জায়গা যেখানে নামটার আসল Record থাকে, চূড়ান্ত উত্তর। উপরের দুইজন শুধু এক ধাপ নিচে পাঠিয়ে দেয়, যাকে বলে Referral, আর শেষের জন আসল উত্তর দেয়।"
    >
      <Arrow id="ti-a" />
      {TIERS.map((t, i) => {
        const y = top + i * (boxH + gap);
        const accent = i === 2;
        return (
          <g key={t.name}>
            <rect
              x={x}
              y={y}
              width={w}
              height={boxH}
              fill={accent ? "var(--primary)" : "currentColor"}
              fillOpacity={accent ? 0.12 : 0.04}
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 1 : 0.45}
              strokeWidth={accent ? 1.4 : 1.2}
            />
            <SketchText x={x + 16} y={y + 24} size={13} anchor="start" bold accent={accent}>
              {t.name}
            </SketchText>
            <SketchText x={x + 16} y={y + 43} size={9.5} anchor="start" body opacity={0.8}>
              {t.knows}
            </SketchText>
            <SketchText x={x + 16} y={y + 57} size={8} anchor="start" body opacity={0.55}>
              {t.run}
            </SketchText>
            {i < TIERS.length - 1 && (
              <line
                x1={x + w / 2}
                y1={y + boxH}
                x2={x + w / 2}
                y2={y + boxH + gap}
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#ti-a)"
              />
            )}
            {i < TIERS.length - 1 && (
              <SketchText x={x + w / 2 + 70} y={y + boxH + gap / 2 + 3} size={8} accent body>
                এক ধাপ নিচে পাঠায় (Referral)
              </SketchText>
            )}
          </g>
        );
      })}
      <SketchText x={x + w / 2} y={h - 6} size={9} accent body>
        শুধু শেষের Authoritative আসল উত্তর দেয়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Domain কে Hosting এর সাথে জোড়ার দুই উপায়                                */
/* ------------------------------------------------------------------------- */

function Way({
  rows,
  foot,
}: {
  rows: { top: string; sub: string; accent?: boolean }[];
  foot: string;
}) {
  return (
    <g>
      {rows.map((r, i) => {
        const y = 14 + i * 62;
        return (
          <g key={r.top}>
            <rect
              x={20}
              y={y}
              width={260}
              height={44}
              fill={r.accent ? "var(--primary)" : "currentColor"}
              fillOpacity={r.accent ? 0.12 : 0.04}
              stroke={r.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={r.accent ? 1 : 0.4}
              strokeWidth="1.2"
            />
            <SketchText x={150} y={y + 19} size={10.5} bold accent={r.accent}>
              {r.top}
            </SketchText>
            <SketchText x={150} y={y + 35} size={8.5} body opacity={0.7}>
              {r.sub}
            </SketchText>
            {i < rows.length - 1 && (
              <line
                x1={150}
                y1={y + 44}
                x2={150}
                y2={y + 62}
                stroke="var(--primary)"
                strokeWidth="1.2"
              />
            )}
          </g>
        );
      })}
      <SketchText x={150} y={14 + rows.length * 62 + 4} size={9} body accent>
        {foot}
      </SketchText>
    </g>
  );
}

export function ConnectWaysSplit() {
  return (
    <SketchSplit
      label="Diagram: Domain জোড়ার দুই উপায়"
      caption="আপনার কেনা নামকে Hosting এর সাথে জোড়ার দুইটা পথ। বাঁ দিকে Name Server বদলানো, এতে Hosting কোম্পানি নিজেই আপনার নামের Authoritative server হয়ে যায়, আর সব Record সে নিজে সামলায়। ডান দিকে Name Server যেমন আছে তেমন রেখে, বর্তমান DNS এ শুধু একটা বা দুইটা Record যোগ করা, যেটা Hosting এর দিকে দেখায়। দুইটাতেই শেষ ফল এক, নাম লিখলে আপনার সাইট খোলে। তফাত শুধু, DNS এর দায়িত্ব কার হাতে থাকে।"
      panels={[
        {
          title: "উপায় ১, Name Server বদল",
          sub: "পুরো DNS Hosting এর হাতে",
          viewBox: "0 0 300 222",
          height: 222,
          children: (
            <Way
              rows={[
                { top: "Registrar", sub: "Name Server বদলে দিলেন" },
                { top: "TLD Server", sub: "এখন Hosting এর দিকে পাঠায়" },
                { top: "Hosting এর DNS", sub: "Authoritative, Record নিজে বসায়", accent: true },
              ]}
              foot="সহজ, কিন্তু পুরনো Record সরাতে হয়"
            />
          ),
        },
        {
          title: "উপায় ২, Record যোগ",
          sub: "DNS আগের জায়গাতেই",
          viewBox: "0 0 300 222",
          height: 222,
          children: (
            <Way
              rows={[
                { top: "Registrar", sub: "Name Server অপরিবর্তিত" },
                { top: "বর্তমান DNS", sub: "Authoritative, আগের মতোই", accent: true },
                { top: "A বা CNAME Record", sub: "Hosting এর দিকে দেখায়" },
              ]}
              foot="নিয়ন্ত্রণ আপনার, Record হাতে বসাতে হয়"
            />
          ),
        },
      ]}
    />
  );
}
