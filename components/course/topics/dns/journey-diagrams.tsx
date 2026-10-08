import { Sketch, SketchText } from "../../sketch";

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

function Node({
  x,
  y,
  w,
  h = 50,
  top,
  sub,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  top: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.1 : 0.04}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 1 : 0.45}
        strokeWidth="1.3"
      />
      <SketchText x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} size={10} bold accent={accent}>
        {top}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 14} size={8.5} body opacity={0.7}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

function Num({ x, y, n }: { x: number; y: number; n: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} fill="var(--primary)" fillOpacity={0.15} stroke="var(--primary)" strokeWidth="1" />
      <SketchText x={x} y={y + 3.5} size={8.5} bold accent>
        {n}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. পুরো যাত্রা, এক ছবিতে                                                    */
/* ------------------------------------------------------------------------- */

export function FullJourneyDiagram() {
  return (
    <Sketch
      label="Diagram: নাম থেকে IP, পুরো যাত্রা"
      height={400}
      minWidth={860}
      viewBox="0 0 860 400"
      caption="এই মডিউলের আটটা লেসন এই একটা ছবিতে। বাঁ দিকের সারিটা আপনার নিজের দিক, Browser, Operating System আর Router, প্রত্যেকের নিজের ছোট Cache। মাঝখানে Recursive Resolver, যে আসল খাটুনিটা করে। ডান দিকে তিন স্তরের server, যারা নামের দুনিয়ার আসল হিসাব রাখে। সংখ্যাগুলো ধরে পড়ুন। ১ থেকে ৩ এ প্রশ্নটা একটা একটা Cache পার হয়ে Resolver এ পৌঁছায়। ৪ থেকে ৬ এ Resolver উপর থেকে নিচে হাঁটে, Root, TLD, Authoritative। ৭ এ উত্তরটা একই পথে ফিরে আসে, আর পথের প্রতিটা স্তর সেটা নিজের খাতায় তুলে রাখে। যেকোনো স্তরে উত্তর আগে থেকে জানা থাকলে যাত্রাটা সেখানেই থেমে যায়।"
    >
      <Arrow id="fj-a" />

      {/* আপনার দিক */}
      <SketchText x={110} y={28} size={9} opacity={0.55}>
        আপনার দিক
      </SketchText>
      <Node x={30} y={44} w={160} top="Browser" sub="নিজের Cache" />
      <Node x={30} y={140} w={160} top="Operating System" sub="Stub Resolver, hosts ফাইল" />
      <Node x={30} y={236} w={160} top="Router" sub="Forwarder" />
      <line x1={110} y1={94} x2={110} y2={138} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#fj-a)" />
      <line x1={110} y1={190} x2={110} y2={234} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#fj-a)" />
      <Num x={128} y={116} n="১" />
      <Num x={128} y={212} n="২" />

      {/* Resolver */}
      <SketchText x={430} y={28} size={9} opacity={0.55}>
        যে খোঁজে
      </SketchText>
      <Node x={335} y={130} w={190} h={72} top="Recursive Resolver" sub="খোঁজে, মনে রাখে" accent />
      <line x1={190} y1={254} x2={333} y2={186} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#fj-a)" />
      <Num x={262} y={206} n="৩" />

      {/* তিন স্তর */}
      <SketchText x={745} y={28} size={9} opacity={0.55}>
        যারা হিসাব রাখে
      </SketchText>
      <Node x={660} y={44} w={170} top="Root Server" sub="TLD কোথায়, জানে" />
      <Node x={660} y={140} w={170} top="TLD Server" sub="Name Server কে, জানে" />
      <Node x={660} y={236} w={170} top="Authoritative" sub="আসল Record এখানে" />
      <line x1={525} y1={146} x2={658} y2={76} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#fj-a)" />
      <line x1={525} y1={166} x2={658} y2={166} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#fj-a)" />
      <line x1={525} y1={186} x2={658} y2={256} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#fj-a)" />
      <Num x={586} y={100} n="৪" />
      <Num x={592} y={154} n="৫" />
      <Num x={586} y={232} n="৬" />

      {/* ফেরা */}
      <path
        d="M 430 204 L 430 330 L 112 330 L 112 290"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.3"
        strokeDasharray="5 4"
        markerEnd="url(#fj-a)"
      />
      <Num x={270} y={330} n="৭" />
      <SketchText x={270} y={356} size={8.5} body accent>
        উত্তর ফেরে, পথে সবাই Cache এ রাখে
      </SketchText>
      <SketchText x={745} y={318} size={8.5} body opacity={0.65}>
        Registrar এ লেখা Name Server
      </SketchText>
      <SketchText x={745} y={334} size={8.5} body opacity={0.65}>
        ঠিক করে TLD কাকে দেখাবে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কে কী রাখে, আর আপনি কোথায় কী বদলান                                      */
/* ------------------------------------------------------------------------- */

const CAST = [
  { who: "Registry", holds: "একটা TLD এর সব নামের তালিকা", you: "সরাসরি কিছু নয়", lesson: "লেসন ২" },
  { who: "Registrar", holds: "আপনার মালিকানা, আর Name Server এর নাম", you: "নবায়ন, Name Server বদল", lesson: "লেসন ২, ৩" },
  { who: "DNS সেবা (Authoritative)", holds: "আপনার সব Record আর TTL", you: "Record যোগ, বদল, মোছা", lesson: "লেসন ৩, ৬, ৭" },
  { who: "Recursive Resolver", holds: "কিছুক্ষণের জন্য উত্তরের নকল", you: "কোনটা ব্যবহার করবেন", lesson: "লেসন ৪, ৫" },
  { who: "Hosting বা সার্ভার", holds: "আসল Website", you: "IP টা Record এ বসান", lesson: "লেসন ৩, ৭" },
];

export function WhoHoldsWhatDiagram() {
  const rowH = 40;
  const top = 54;
  const h = top + CAST.length * rowH + 16;
  return (
    <Sketch
      label="Diagram: কার কাছে কী থাকে, আর আপনি কোথায় কী বদলান"
      height={h}
      minWidth={860}
      viewBox={`0 0 860 ${h}`}
      caption="DNS এ ভুলের সবচেয়ে বড় উৎস হলো ভুল জায়গায় হাত দেওয়া। তাই পুরো দলটাকে একবার এক ছকে দেখে নিন। পাঁচটা পক্ষ, প্রত্যেকের কাছে আলাদা জিনিস থাকে, আর প্রত্যেকের কাছে আপনি আলাদা জিনিস বদলাতে পারেন। Name Server বদলাতে হয় Registrar এ। Record বদলাতে হয় DNS সেবায়, মানে Name Server যেখানে দেখাচ্ছে সেখানে। Resolver এ আপনি কিছু বদলাতে পারেন না, শুধু বেছে নিতে পারেন কোনটা ব্যবহার করবেন। কোনো সমস্যায় পড়লে প্রথম প্রশ্ন হওয়া উচিত, এই তথ্যটা এই পাঁচজনের কার কাছে থাকে।"
    >
      <SketchText x={40} y={38} size={9} anchor="start" opacity={0.55}>
        কে
      </SketchText>
      <SketchText x={250} y={38} size={9} anchor="start" opacity={0.55}>
        তার কাছে যা থাকে
      </SketchText>
      <SketchText x={540} y={38} size={9} anchor="start" opacity={0.55}>
        আপনি সেখানে যা করেন
      </SketchText>
      <SketchText x={760} y={38} size={9} anchor="start" opacity={0.55}>
        কোথায় শিখেছেন
      </SketchText>
      {CAST.map((c, i) => {
        const y = top + i * rowH;
        return (
          <g key={c.who}>
            <rect
              x={24}
              y={y}
              width={812}
              height={rowH - 8}
              fill={i % 2 === 0 ? "currentColor" : "transparent"}
              fillOpacity={0.03}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth="1"
            />
            <SketchText x={40} y={y + 21} size={10} anchor="start" bold accent>
              {c.who}
            </SketchText>
            <SketchText x={250} y={y + 21} size={9.5} anchor="start" body>
              {c.holds}
            </SketchText>
            <SketchText x={540} y={y + 21} size={9.5} anchor="start" body bold>
              {c.you}
            </SketchText>
            <SketchText x={760} y={y + 21} size={9} anchor="start" body opacity={0.7}>
              {c.lesson}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
