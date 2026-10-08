import { Sketch, SketchSplit, SketchText } from "../../sketch";

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

/* ------------------------------------------------------------------------- */
/* 1. Cache কোথায় কোথায় জমে                                                   */
/* ------------------------------------------------------------------------- */

const LAYERS = [
  { name: "Browser", sub: "নিজের ছোট খাতা", who: "আপনার হাতে" },
  { name: "Operating System", sub: "পুরো যন্ত্রের খাতা", who: "আপনার হাতে" },
  { name: "Router", sub: "বাসার সবার জন্য", who: "আপনার হাতে" },
  { name: "Resolver", sub: "ISP বা Public DNS", who: "আপনার হাতে নয়" },
];

export function CacheLayersDiagram() {
  const w = 160;
  const gap = 30;
  const startX = 20;
  const y = 70;
  return (
    <Sketch
      label="Diagram: চার জায়গায় চারটা খাতা"
      height={250}
      minWidth={820}
      viewBox="0 0 820 250"
      caption="একটা নামের উত্তর এক জায়গায় নয়, পথের চার জায়গায় মনে রাখা হয়। প্রথমে Browser নিজের খাতায় দেখে, না পেলে Operating System কে জিজ্ঞেস করে, তারপর বাসার Router, তারপর Resolver। যে আগে উত্তর জানে, সে ই দিয়ে দেয়, আর খোঁজা সেখানেই থামে। শুধু চারজনের কারো কাছেই না থাকলে তবেই Resolver পুরো হাঁটাটা হাঁটে। প্রথম তিনটা খাতা আপনি নিজে মুছতে পারেন, কিন্তু শেষেরটা অন্যের যন্ত্রে, সেটা আপনার হাতে নেই।"
    >
      <Arrow id="cl-a" />
      {LAYERS.map((l, i) => {
        const x = startX + i * (w + gap);
        const last = i === LAYERS.length - 1;
        return (
          <g key={l.name}>
            <rect
              x={x}
              y={y}
              width={w}
              height={70}
              fill={last ? "var(--primary)" : "currentColor"}
              fillOpacity={last ? 0.12 : 0.04}
              stroke={last ? "var(--primary)" : "currentColor"}
              strokeOpacity={last ? 1 : 0.45}
              strokeWidth="1.3"
            />
            <SketchText x={x + w / 2} y={y + 30} size={12} bold accent={last}>
              {l.name}
            </SketchText>
            <SketchText x={x + w / 2} y={y + 50} size={9} body opacity={0.7}>
              {l.sub}
            </SketchText>
            <SketchText x={x + w / 2} y={y + 94} size={8.5} body accent={last} opacity={last ? 1 : 0.6}>
              {l.who}
            </SketchText>
            {!last && (
              <line
                x1={x + w}
                y1={y + 35}
                x2={x + w + gap}
                y2={y + 35}
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#cl-a)"
              />
            )}
          </g>
        );
      })}
      <SketchText x={410} y={40} size={9} opacity={0.6} body>
        বাঁ থেকে ডানে জিজ্ঞেস করা হয়, যে আগে জানে সে ই উত্তর দেয়
      </SketchText>
      <SketchText x={410} y={210} size={9} accent body>
        চারজনের কারো কাছে না থাকলে তবেই Root, TLD, Authoritative এর হাঁটা
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. ছোট TTL বনাম বড় TTL                                                     */
/* ------------------------------------------------------------------------- */

function Lines({ rows }: { rows: { t: string; good: boolean }[] }) {
  return (
    <g>
      {rows.map((r, i) => (
        <g key={r.t}>
          <SketchText x={24} y={34 + i * 30} size={12} anchor="start" bold accent={r.good}>
            {r.good ? "+" : "!"}
          </SketchText>
          <SketchText x={44} y={34 + i * 30} size={10} anchor="start" body opacity={0.85}>
            {r.t}
          </SketchText>
        </g>
      ))}
    </g>
  );
}

export function TtlTradeoffSplit() {
  return (
    <SketchSplit
      label="Diagram: ছোট TTL, বড় TTL"
      caption="TTL ছোট রাখলে বদল দ্রুত সবার কাছে পৌঁছায়, কিন্তু সবাই ঘনঘন জিজ্ঞেস করে, তাই একটু ধীর আর Name Server এ চাপ বেশি। TTL বড় রাখলে উত্তর অনেকক্ষণ মনে থাকে, সাইট দ্রুত খোলে, কিন্তু কিছু বদলালে পুরনো উত্তর অনেকক্ষণ ঘুরে বেড়ায়। কোনোটাই সবসময় ঠিক নয়। সাধারণ দিনে বড়, বদলের আগে ছোট, এই অভ্যাসটাই আসল বুদ্ধি।"
      panels={[
        {
          title: "ছোট TTL",
          sub: "যেমন ৬০ থেকে ৩০০ সেকেন্ড",
          viewBox: "0 0 300 140",
          height: 140,
          children: (
            <Lines
              rows={[
                { t: "বদল কয়েক মিনিটে ছড়ায়", good: true },
                { t: "ভুল হলে দ্রুত ফেরানো যায়", good: true },
                { t: "ঘনঘন খোঁজ, একটু ধীর", good: false },
                { t: "Name Server এ চাপ বেশি", good: false },
              ]}
            />
          ),
        },
        {
          title: "বড় TTL",
          sub: "যেমন ১ ঘণ্টা থেকে ১ দিন",
          viewBox: "0 0 300 140",
          height: 140,
          children: (
            <Lines
              rows={[
                { t: "উত্তর প্রায় সবসময় হাতের কাছে", good: true },
                { t: "Name Server এ চাপ কম", good: true },
                { t: "বদল ছড়াতে ঘণ্টা বা দিন", good: false },
                { t: "ভুল হলে অনেকক্ষণ ভোগান্তি", good: false },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. সার্ভার বদলের সময়রেখা                                                   */
/* ------------------------------------------------------------------------- */

const TIMELINE = [
  { when: "১ থেকে ২ দিন আগে", what: "TTL ছোট করুন", sub: "যেমন ৩০০" },
  { when: "অপেক্ষা", what: "পুরনো TTL পার হতে দিন", sub: "আগের মানটা যত ছিল" },
  { when: "বদলের দিন", what: "IP বদলান", sub: "নতুন সার্ভারে" },
  { when: "যাচাই", what: "dig দিয়ে মিলিয়ে নিন", sub: "পুরনো সার্ভার চালু রাখুন" },
  { when: "কয়েক দিন পর", what: "TTL আবার বড় করুন", sub: "যেমন ৩৬০০" },
];

export function MigrationTimelineDiagram() {
  const w = 148;
  const gap = 12;
  const startX = 14;
  const y = 64;
  return (
    <Sketch
      label="Diagram: নিরাপদে IP বদলানোর সময়রেখা"
      height={210}
      minWidth={820}
      viewBox="0 0 820 210"
      caption="সার্ভার বদলানোর আগে পাঁচটা ধাপ, ক্রম অনুযায়ী। মূল চালাকিটা প্রথম দুই ধাপে। বদলের আগেই TTL ছোট করে ফেলুন, তারপর পুরনো বড় TTL টা শেষ হওয়া পর্যন্ত অপেক্ষা করুন, যাতে দুনিয়ার সব Cache এ এখন ছোট TTL বসে যায়। তারপর IP বদলালে কয়েক মিনিটেই সবাই নতুন ঠিকানা পায়। সব ঠিক থাকলে শেষে TTL আবার বড় করে দিন।"
    >
      <Arrow id="mt-a" />
      {TIMELINE.map((t, i) => {
        const x = startX + i * (w + gap);
        const accent = i === 2;
        return (
          <g key={t.what}>
            <SketchText x={x + w / 2} y={y - 12} size={8.5} body opacity={0.6}>
              {t.when}
            </SketchText>
            <rect
              x={x}
              y={y}
              width={w}
              height={62}
              fill={accent ? "var(--primary)" : "currentColor"}
              fillOpacity={accent ? 0.12 : 0.04}
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 1 : 0.45}
              strokeWidth="1.3"
            />
            <SketchText x={x + w / 2} y={y + 27} size={10} bold accent={accent}>
              {t.what}
            </SketchText>
            <SketchText x={x + w / 2} y={y + 46} size={8.5} body opacity={0.7}>
              {t.sub}
            </SketchText>
            {i < TIMELINE.length - 1 && (
              <line
                x1={x + w}
                y1={y + 31}
                x2={x + w + gap}
                y2={y + 31}
                stroke="var(--primary)"
                strokeWidth="1.2"
                markerEnd="url(#mt-a)"
              />
            )}
          </g>
        );
      })}
      <SketchText x={410} y={170} size={9} accent body>
        TTL আগে ছোট না করলে, বদলের পর পুরনো ঠিকানা ঘণ্টার পর ঘণ্টা ঘুরবে
      </SketchText>
    </Sketch>
  );
}
