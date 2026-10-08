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

function Node({
  x,
  y,
  w,
  h = 56,
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
      <SketchText x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} size={10.5} bold accent={accent}>
        {top}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 15} size={8.5} body opacity={0.7}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. আপনার যন্ত্র, Resolver, আর বাকি দুনিয়া                                   */
/* ------------------------------------------------------------------------- */

export function StubRecursiveDiagram() {
  return (
    <Sketch
      label="Diagram: কে প্রশ্ন করে, কে খাটে"
      height={300}
      minWidth={820}
      viewBox="0 0 820 300"
      caption="DNS এর খোঁজে তিনটা পক্ষ। বাঁ দিকে আপনার যন্ত্র, যার ভেতরে একটা ছোট অংশ আছে, নাম Stub Resolver। সে নিজে কিছু খোঁজে না, শুধু একটা প্রশ্ন পাঠায় আর উত্তরের অপেক্ষা করে। মাঝখানে Recursive Resolver, আসল খাটুনিটা তার। সে একে একে Root, TLD আর Authoritative server এর কাছে যায়, আর শেষে পুরো উত্তরটা নিয়ে ফেরে। ডান দিকের তিনজন কখনো আপনার যন্ত্রের সাথে সরাসরি কথা বলে না, তারা শুধু Resolver কে চেনে।"
    >
      <Arrow id="sr-a" />
      <Node x={20} y={112} w={170} h={70} top="আপনার যন্ত্র" sub="Stub Resolver" />
      <Node x={310} y={112} w={190} h={70} top="Recursive Resolver" sub="যে ঘুরে ঘুরে খোঁজে" accent />
      <Node x={630} y={30} w={170} h={50} top="Root Server" />
      <Node x={630} y={122} w={170} h={50} top="TLD Server" />
      <Node x={630} y={214} w={170} h={50} top="Authoritative" />

      <line x1={190} y1={136} x2={308} y2={136} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#sr-a)" />
      <SketchText x={249} y={126} size={8.5} accent bold>
        ১টা প্রশ্ন
      </SketchText>
      <line x1={310} y1={160} x2={192} y2={160} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#sr-a)" />
      <SketchText x={249} y={178} size={8.5} body opacity={0.7}>
        পুরো উত্তর
      </SketchText>

      <line x1={500} y1={126} x2={628} y2={58} stroke="var(--primary)" strokeWidth="1.2" markerEnd="url(#sr-a)" />
      <line x1={500} y1={147} x2={628} y2={147} stroke="var(--primary)" strokeWidth="1.2" markerEnd="url(#sr-a)" />
      <line x1={500} y1={168} x2={628} y2={236} stroke="var(--primary)" strokeWidth="1.2" markerEnd="url(#sr-a)" />
      <SketchText x={556} y={78} size={8.5} accent bold>
        ১
      </SketchText>
      <SketchText x={562} y={139} size={8.5} accent bold>
        ২
      </SketchText>
      <SketchText x={556} y={222} size={8.5} accent bold>
        ৩
      </SketchText>

      <SketchText x={105} y={210} size={8.5} body opacity={0.65}>
        শুধু জিজ্ঞেস করে
      </SketchText>
      <SketchText x={405} y={210} size={8.5} body accent>
        খোঁজে, মনে রাখে, উত্তর দেয়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. দুই ধরনের প্রশ্ন                                                         */
/* ------------------------------------------------------------------------- */

function Talk({
  id,
  left,
  right,
  ask,
  reply,
  foot,
}: {
  id: string;
  left: string;
  right: string;
  ask: string;
  reply: string;
  foot: string;
}) {
  return (
    <>
      <Arrow id={id} />
      <Node x={10} y={30} w={110} h={46} top={left} />
      <Node x={180} y={30} w={110} h={46} top={right} accent />
      <line x1={120} y1={44} x2={178} y2={44} stroke="var(--primary)" strokeWidth="1.3" markerEnd={`url(#${id})`} />
      <line x1={180} y1={62} x2={122} y2={62} stroke="var(--primary)" strokeWidth="1.3" markerEnd={`url(#${id})`} />
      <SketchText x={150} y={108} size={8.5} opacity={0.55}>
        প্রশ্ন
      </SketchText>
      <SketchText x={150} y={126} size={9.5} body bold>
        {ask}
      </SketchText>
      <SketchText x={150} y={156} size={8.5} opacity={0.55}>
        উত্তর
      </SketchText>
      <SketchText x={150} y={174} size={9.5} body bold accent>
        {reply}
      </SketchText>
      <SketchText x={150} y={206} size={8.5} body opacity={0.7}>
        {foot}
      </SketchText>
    </>
  );
}

export function QueryStyleSplit() {
  return (
    <SketchSplit
      label="Diagram: Recursive প্রশ্ন আর Iterative প্রশ্ন"
      caption="একই খোঁজের ভেতরে দুই রকম কথোপকথন চলে। বাঁ দিকে আপনার যন্ত্র Resolver কে বলছে, পুরো কাজটা আপনি করে দিন, আমাকে শুধু শেষ উত্তরটা দিন। এটা Recursive প্রশ্ন, আর এর উত্তর সবসময় সম্পূর্ণ, হয় IP, নয়তো একটা পরিষ্কার না। ডান দিকে Resolver নিজে Root বা TLD কে জিজ্ঞেস করছে, আর তারা পুরো উত্তর না দিয়ে শুধু বলছে পরের কার কাছে যেতে হবে। এটা Iterative প্রশ্ন, আর এর উত্তর প্রায়ই একটা দিকনির্দেশ। Resolver সেই দিকনির্দেশ ধরে নিজেই পরের জনের কাছে যায়।"
      panels={[
        {
          title: "Recursive প্রশ্ন",
          sub: "আপনার যন্ত্র থেকে Resolver এ",
          viewBox: "0 0 300 222",
          height: 222,
          children: (
            <Talk
              id="qs-a"
              left="যন্ত্র"
              right="Resolver"
              ask="পুরো উত্তরটা এনে দিন"
              reply="এই নিন IP, 103.94.135.2"
              foot="উত্তর সম্পূর্ণ, খাটুনি Resolver এর"
            />
          ),
        },
        {
          title: "Iterative প্রশ্ন",
          sub: "Resolver থেকে Root, TLD তে",
          viewBox: "0 0 300 222",
          height: 222,
          children: (
            <Talk
              id="qs-b"
              left="Resolver"
              right="Root"
              ask="এই নামটা চেনেন?"
              reply="আমি না, ওই TLD কে বলুন"
              foot="উত্তর একটা দিকনির্দেশ, বাকিটা নিজে"
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. প্রশ্নটা আসলে কার কার হাত ঘোরে                                           */
/* ------------------------------------------------------------------------- */

const CHAIN = [
  { top: "Browser, App", sub: "নামটা চায়" },
  { top: "Operating System", sub: "Stub Resolver" },
  { top: "Router", sub: "Forwarder, শুধু এগিয়ে দেয়" },
  { top: "ISP র Resolver", sub: "আসল Recursive Resolver", accent: true },
];

export function ResolverChainDiagram() {
  const w = 172;
  const gap = 30;
  const startX = 20;
  return (
    <Sketch
      label="Diagram: বাসার WiFi তে প্রশ্নটার পথ"
      height={220}
      minWidth={820}
      viewBox="0 0 820 220"
      caption="বাসার সাধারণ WiFi তে প্রশ্নটা আসল Resolver এ পৌঁছানোর আগে কয়েকটা হাত ঘোরে। Browser প্রথমে Operating System কে জিজ্ঞেস করে। Operating System প্রশ্নটা পাঠায় সেই DNS ঠিকানায় যেটা DHCP দিয়েছিল, আর বাসার Network এ সেটা প্রায় সবসময় Router এর নিজের ঠিকানা, যেমন 192.168.1.1। কিন্তু Router নিজে খোঁজে না, সে শুধু একজন Forwarder, প্রশ্নটা এগিয়ে দেয় আপনার ISP র Resolver এর কাছে। খাটুনিটা শুরু হয় সেখান থেকে। তাই নিজের যন্ত্রে DNS হিসেবে Router এর ঠিকানা দেখলে অবাক হবেন না, আসল Resolver তার এক ধাপ পেছনে।"
    >
      <Arrow id="rc-a" />
      {CHAIN.map((c, i) => {
        const x = startX + i * (w + gap);
        return (
          <g key={c.top}>
            <Node x={x} y={70} w={w} h={62} top={c.top} sub={c.sub} accent={c.accent} />
            {i < CHAIN.length - 1 && (
              <line
                x1={x + w}
                y1={101}
                x2={x + w + gap - 2}
                y2={101}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#rc-a)"
              />
            )}
          </g>
        );
      })}
      <SketchText x={410} y={40} size={9} body opacity={0.6}>
        প্রতিটা ধাপে আগে নিজের Cache দেখা হয়, না থাকলে তবেই পরের জনের কাছে
      </SketchText>
      <SketchText x={410} y={172} size={9} body accent>
        আপনি DNS বদলালে আসলে শেষের বাক্সটাই বদলান, বাকি পথ একই থাকে
      </SketchText>
    </Sketch>
  );
}
