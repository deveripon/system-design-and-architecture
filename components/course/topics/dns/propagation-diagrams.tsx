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

function Box({
  x,
  y,
  w,
  h = 34,
  text,
  accent,
  size = 9.5,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  accent?: boolean;
  size?: number;
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
      <SketchText x={x + w / 2} y={y + h / 2 + 4} size={size} bold accent={accent}>
        {text}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. ভুল ধারণা আর আসল ঘটনা                                                    */
/* ------------------------------------------------------------------------- */

const SPOTS = [40, 125, 210];

function Myth() {
  return (
    <>
      <Arrow id="pg-a" />
      <Box x={90} y={20} w={120} text="আপনার DNS" accent />
      {SPOTS.map((x) => (
        <g key={x}>
          <line x1={150} y1={54} x2={x + 25} y2={118} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#pg-a)" />
          <Box x={x} y={120} w={50} text="Resolver" size={7.5} />
        </g>
      ))}
      <SketchText x={150} y={90} size={8.5} body accent>
        নতুন IP ঠেলে পাঠানো হচ্ছে
      </SketchText>
      <SketchText x={150} y={184} size={8.5} body opacity={0.7}>
        এমন কিছু ঘটে না
      </SketchText>
    </>
  );
}

function Truth() {
  const left = ["আর ২ মিনিট", "আর ৪০ মিনিট", "মেয়াদ শেষ"];
  return (
    <>
      <Arrow id="pg-b" />
      <Box x={90} y={20} w={120} text="আপনার DNS" accent />
      {SPOTS.map((x, i) => (
        <g key={x}>
          <Box x={x} y={120} w={50} text="Resolver" size={7.5} accent={i === 2} />
          <SketchText x={x + 25} y={170} size={7.5} body opacity={i === 2 ? 1 : 0.7} accent={i === 2}>
            {left[i]}
          </SketchText>
        </g>
      ))}
      <line x1={235} y1={118} x2={176} y2={56} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#pg-b)" />
      <SketchText x={150} y={90} size={8.5} body accent>
        মেয়াদ ফুরালে সে নিজে এসে জিজ্ঞেস করে
      </SketchText>
      <SketchText x={150} y={196} size={8.5} body opacity={0.7}>
        প্রত্যেকের ঘড়ি আলাদা
      </SketchText>
    </>
  );
}

export function PropagationMythSplit() {
  return (
    <SketchSplit
      label="Diagram: Propagation শব্দটা যা বোঝায়, আর যা আসলে ঘটে"
      caption="Propagation মানে ছড়িয়ে পড়া, আর শব্দটা শুনে বাঁ দিকের ছবিটাই মনে আসে, যেন আপনার নতুন Record একটা ঢেউয়ের মতো পৃথিবীর সব Resolver এ গিয়ে পৌঁছাচ্ছে। বাস্তবে এমন কিছুই ঘটে না। আপনার DNS কাউকে কিছু পাঠায় না, সে শুধু বসে থাকে আর কেউ জিজ্ঞেস করলে উত্তর দেয়। আসল ঘটনা ডান দিকে। প্রতিটা Resolver এর খাতায় পুরনো উত্তরটা নিজের একটা মেয়াদ নিয়ে বসে আছে। যার মেয়াদ যখন ফুরায়, সে তখন নিজে এসে নতুন করে জিজ্ঞেস করে, আর তখনই নতুন উত্তরটা পায়। তাই বদলটা সবার কাছে একসাথে পৌঁছায় না, এক এক জনের কাছে এক এক সময়ে।"
      panels={[
        {
          title: "ভুল ধারণা",
          sub: "বদলটা ঠেলে ছড়ানো হয়",
          viewBox: "0 0 300 210",
          height: 210,
          children: <Myth />,
        },
        {
          title: "আসল ঘটনা",
          sub: "পুরনো Cache একে একে মরে",
          viewBox: "0 0 300 210",
          height: 210,
          children: <Truth />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন বদলে কতক্ষণ                                                          */
/* ------------------------------------------------------------------------- */

const WAITS = [
  { what: "চালু Record এর Value বদল (A, CNAME, MX)", wait: "Record টার আগের TTL পর্যন্ত", why: "পুরনো উত্তর Cache এ আছে" },
  { what: "একদম নতুন নাম যোগ", wait: "প্রায় সাথে সাথে", why: "কারো Cache এ কিছুই নেই" },
  { what: "নতুন নাম, কিন্তু আগে কেউ খুঁজেছিল", wait: "Negative TTL পর্যন্ত", why: "নেই উত্তরটা Cache এ আছে" },
  { what: "Record মুছে ফেলা", wait: "Record টার TTL পর্যন্ত", why: "মোছার পরেও Cache এ থাকে" },
  { what: "Name Server বদল", wait: "কয়েক ঘণ্টা থেকে ২ দিন", why: "TLD এর NS এর TTL ২ দিন" },
  { what: "Proxied Record এর পেছনের সার্ভার বদল", wait: "কয়েক সেকেন্ড", why: "বাইরের IP বদলায়ই না" },
];

export function WaitTableDiagram() {
  const rowH = 38;
  const top = 54;
  const h = top + WAITS.length * rowH + 16;
  return (
    <Sketch
      label="Diagram: কোন বদলে কতক্ষণ অপেক্ষা"
      height={h}
      minWidth={840}
      viewBox={`0 0 840 ${h}`}
      caption="সব DNS বদলে একই সময় লাগে না, আর ২৪ থেকে ৪৮ ঘণ্টা কথাটা শুধু একটা ক্ষেত্রেই খাটে। অপেক্ষার সময় নির্ভর করে একটাই প্রশ্নের উপর, মানুষের Cache এ এই মুহূর্তে কী আছে, আর তার মেয়াদ কত বাকি। চালু একটা Record বদলালে অপেক্ষা সেই Record এর আগের TTL পর্যন্ত। একদম নতুন নাম যোগ করলে প্রায় কোনো অপেক্ষাই নেই, কারণ কারো খাতায় পুরনো কিছু নেই। সবচেয়ে লম্বা অপেক্ষা Name Server বদলে, কারণ সেই তথ্যটা থাকে TLD server এ, যার TTL আপনার হাতে নয় আর সাধারণত দুই দিন।"
    >
      <SketchText x={40} y={38} size={9} anchor="start" opacity={0.55}>
        কী বদলালেন
      </SketchText>
      <SketchText x={400} y={38} size={9} anchor="start" opacity={0.55}>
        সর্বোচ্চ অপেক্ষা
      </SketchText>
      <SketchText x={610} y={38} size={9} anchor="start" opacity={0.55}>
        কারণ
      </SketchText>
      {WAITS.map((r, i) => {
        const y = top + i * rowH;
        return (
          <g key={r.what}>
            <rect
              x={24}
              y={y}
              width={792}
              height={rowH - 8}
              fill={i % 2 === 0 ? "currentColor" : "transparent"}
              fillOpacity={0.03}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth="1"
            />
            <SketchText x={40} y={y + 20} size={9.5} anchor="start" body bold>
              {r.what}
            </SketchText>
            <SketchText x={400} y={y + 20} size={9.5} anchor="start" body bold accent>
              {r.wait}
            </SketchText>
            <SketchText x={610} y={y + 20} size={9} anchor="start" body opacity={0.75}>
              {r.why}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. যাচাইয়ের ক্রম, উৎস থেকে নিজের দিকে                                      */
/* ------------------------------------------------------------------------- */

const ORDER = [
  { top: "Authoritative", sub: "উৎস, সত্যটা এখানে" },
  { top: "Public Resolver", sub: "1.1.1.1, 8.8.8.8" },
  { top: "নিজের Resolver", sub: "ISP বা Router" },
  { top: "Operating System", sub: "যন্ত্রের Cache" },
  { top: "Browser", sub: "সবচেয়ে শেষে" },
];

export function CheckOrderDiagram() {
  const w = 142;
  const gap = 20;
  const startX = (840 - (ORDER.length * w + (ORDER.length - 1) * gap)) / 2;
  return (
    <Sketch
      label="Diagram: যাচাই করুন উৎস থেকে নিজের দিকে"
      height={210}
      minWidth={840}
      viewBox="0 0 840 210"
      caption="বদল ঠিকঠাক হয়েছে কি না দেখতে গিয়ে প্রায় সবাই ভুল দিক থেকে শুরু করে, Browser খুলে। অথচ Browser হলো পুরো শিকলের সবচেয়ে দূরের আর সবচেয়ে বেশি Cache ওয়ালা জায়গা। সঠিক দিক ঠিক উল্টো। আগে উৎসকে জিজ্ঞেস করুন, মানে Authoritative server কে সরাসরি। সে ঠিক উত্তর দিলে আপনার কাজ নিখুঁত, বাকি সবটাই অপেক্ষা। সে ভুল উত্তর দিলে অপেক্ষা করে লাভ নেই, Record টাই ভুল বসানো। তারপর এক ধাপ করে নিজের দিকে আসুন। যে ধাপে গিয়ে প্রথম পুরনো উত্তর পাবেন, Cache টা সেখানেই।"
    >
      <Arrow id="co-a" />
      {ORDER.map((o, i) => {
        const x = startX + i * (w + gap);
        const first = i === 0;
        return (
          <g key={o.top}>
            <SketchText x={x + w / 2} y={52} size={9} accent={first} bold opacity={first ? 1 : 0.55}>
              {`ধাপ ${["১", "২", "৩", "৪", "৫"][i]}`}
            </SketchText>
            <rect
              x={x}
              y={64}
              width={w}
              height={60}
              fill={first ? "var(--primary)" : "currentColor"}
              fillOpacity={first ? 0.1 : 0.04}
              stroke={first ? "var(--primary)" : "currentColor"}
              strokeOpacity={first ? 1 : 0.45}
              strokeWidth="1.3"
            />
            <SketchText x={x + w / 2} y={91} size={10} bold accent={first}>
              {o.top}
            </SketchText>
            <SketchText x={x + w / 2} y={109} size={8.5} body opacity={0.7}>
              {o.sub}
            </SketchText>
            {i < ORDER.length - 1 && (
              <line
                x1={x + w}
                y1={94}
                x2={x + w + gap - 2}
                y2={94}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#co-a)"
              />
            )}
          </g>
        );
      })}
      <SketchText x={420} y={164} size={9} body accent>
        প্রথম ধাপ ঠিক থাকলে আপনার কাজ শেষ, এরপর যা বাকি তা শুধু সময়
      </SketchText>
    </Sketch>
  );
}
