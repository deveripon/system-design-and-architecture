import { Sketch, SketchText } from "../../sketch";

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
/* 1. কে কার উপরে, নামের শৃঙ্খল                                                */
/* ------------------------------------------------------------------------- */

const LEVELS = [
  { name: "ICANN", role: "পুরো ব্যবস্থার তদারক, TLD ঠিক করে, Registrar অনুমোদন দেয়", ex: "একটাই" },
  { name: "Registry", role: "একটা TLD এর আসল মালিক তালিকা রাখে", ex: "Verisign (.com)" },
  { name: "Registrar", role: "আপনার কাছে নাম বেচে, Registry তে নিবন্ধন করে", ex: "Namecheap, GoDaddy" },
  { name: "Registrant (আপনি)", role: "নামটা নিবন্ধন করে, মানে ভাড়া নেয়", ex: "Island Tours" },
];

export function HierarchyDiagram() {
  const boxH = 56;
  const gap = 24;
  const top = 20;
  const w = 460;
  const x = 90;
  const h = top + LEVELS.length * (boxH + gap);
  return (
    <Sketch
      label="Diagram: নামের পেছনে চার স্তর"
      height={h}
      minWidth={720}
      viewBox={`0 0 720 ${h}`}
      caption="একটা Domain Name এর পেছনে সাজানো চারটা স্তর। সবার উপরে ICANN, পুরো ব্যবস্থার তদারক করে আর ঠিক করে কোন TLD থাকবে। তার নিচে Registry, প্রতিটা TLD এর আসল মালিক তালিকা রাখে। তারপর Registrar, যে কোম্পানি আপনার কাছে নাম বেচে। আর সবার নিচে আপনি, Registrant, যে নামটা ভাড়া নেয়। উপর থেকে নিচে নামে নিয়ম আর কর্তৃত্ব, আর নিচ থেকে উপরে যায় আপনার টাকা আর নিবন্ধনের অনুরোধ।"
    >
      <Arrow id="hi-a" />
      <Arrow id="hi-up" faint />
      {LEVELS.map((l, i) => {
        const y = top + i * (boxH + gap);
        const accent = i === 2;
        return (
          <g key={l.name}>
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
            <SketchText x={x + 16} y={y + 24} size={12} anchor="start" bold accent={accent}>
              {l.name}
            </SketchText>
            <SketchText x={x + 16} y={y + 42} size={8.5} anchor="start" body opacity={0.7}>
              {l.role}
            </SketchText>
            <SketchText x={x + w - 14} y={y + 24} size={8.5} anchor="end" accent body>
              {l.ex}
            </SketchText>
            {i < LEVELS.length - 1 && (
              <line
                x1={x + w / 2}
                y1={y + boxH}
                x2={x + w / 2}
                y2={y + boxH + gap}
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#hi-a)"
              />
            )}
          </g>
        );
      })}
      {/* side labels */}
      <SketchText x={x + w + 40} y={top + 40} size={9} accent body>
        নিয়ম নিচে নামে
      </SketchText>
      <SketchText x={x - 40} y={h - 40} size={9} body opacity={0.6}>
        টাকা, নিবন্ধন উপরে যায়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. প্রতিটা TLD এর নিজের Registry                                            */
/* ------------------------------------------------------------------------- */

const TLDS = [
  { tld: ".com", registry: "Verisign", note: "সবচেয়ে চেনা, ব্যবসার জন্য" },
  { tld: ".org", registry: "PIR", note: "সংস্থা, অলাভজনক" },
  { tld: ".io", registry: "Identity Digital", note: "টেক স্টার্টআপে জনপ্রিয়" },
  { tld: ".bd", registry: "BTCL", note: "বাংলাদেশের নিজের (ccTLD)" },
];

export function TldTableDiagram() {
  const rowH = 38;
  const top = 54;
  const h = top + TLDS.length * rowH + 20;
  return (
    <Sketch
      label="Diagram: TLD আর তার Registry"
      height={h}
      minWidth={680}
      viewBox={`0 0 680 ${h}`}
      caption="TLD মানে নামের শেষ অংশ, যেমন .com বা .org। প্রতিটা TLD এর একটা করে Registry, যে সেই TLD এর সব নামের হিসাব রাখে। খেয়াল করুন, প্রতিটার নিয়ম আর দাম আলাদা, কারণ প্রত্যেকে আলাদা সংস্থা চালায়। .bd বাংলাদেশের নিজের TLD, যাকে বলে Country Code TLD, চালায় BTCL। কোন TLD বেছে নেবেন, সেটা তাই শুধু পছন্দ নয়, দাম আর নিয়মের ব্যাপারও।"
    >
      <SketchText x={70} y={38} size={9} anchor="start" opacity={0.55}>
        TLD
      </SketchText>
      <SketchText x={200} y={38} size={9} anchor="start" opacity={0.55}>
        কে চালায় (Registry)
      </SketchText>
      <SketchText x={420} y={38} size={9} anchor="start" opacity={0.55}>
        কোথায়
      </SketchText>
      {TLDS.map((t, i) => {
        const y = top + i * rowH;
        const hi = t.tld === ".bd";
        return (
          <g key={t.tld}>
            <rect
              x={30}
              y={y}
              width={620}
              height={rowH - 8}
              fill={hi ? "var(--primary)" : "transparent"}
              fillOpacity={hi ? 0.1 : 0}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth="1"
            />
            <SketchText x={70} y={y + 20} size={13} anchor="start" bold accent={hi}>
              {t.tld}
            </SketchText>
            <SketchText x={200} y={y + 20} size={11} anchor="start" body>
              {t.registry}
            </SketchText>
            <SketchText x={420} y={y + 20} size={9.5} anchor="start" opacity={0.7} body>
              {t.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
