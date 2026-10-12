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
  dashed,
  size = 9.5,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  accent?: boolean;
  dashed?: boolean;
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
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <SketchText x={x + w / 2} y={y + h / 2 + 4} size={size} bold accent={accent}>
        {text}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. IP যা পাঠায়, আর যা পৌঁছাতে পারে                                          */
/* ------------------------------------------------------------------------- */

function Sent() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((n, i) => (
        <Box key={n} x={20 + i * 54} y={60} w={44} h={44} text={String(n)} accent size={13} />
      ))}
      <SketchText x={150} y={36} size={9} body opacity={0.75}>
        পাঁচটা Packet, ক্রম ধরে ছাড়া হলো
      </SketchText>
      <SketchText x={150} y={140} size={8.5} body opacity={0.7}>
        ১, ২, ৩, ৪, ৫
      </SketchText>
    </>
  );
}

function Arrived() {
  const cells = [
    { t: "1", note: "ঠিক আছে" },
    { t: "3", note: "আগে এলো" },
    { t: "2", note: "পরে এলো" },
    { t: "5", note: "ঠিক আছে" },
    { t: "5", note: "দুইবার" },
  ];
  return (
    <>
      {cells.map((c, i) => (
        <g key={i}>
          <Box x={20 + i * 54} y={60} w={44} h={44} text={c.t} size={13} accent={i === 0 || i === 3} dashed={i === 4} />
          <SketchText x={42 + i * 54} y={122} size={7.5} body opacity={0.75}>
            {c.note}
          </SketchText>
        </g>
      ))}
      <SketchText x={150} y={36} size={9} body opacity={0.75}>
        ওপাশে যা এসে পৌঁছাল
      </SketchText>
      <SketchText x={150} y={150} size={8.5} body accent>
        ৪ নম্বরটা পথে হারিয়ে গেছে
      </SketchText>
    </>
  );
}

export function BestEffortSplit() {
  return (
    <SketchSplit
      label="Diagram: IP যা পাঠায়, আর ওপাশে যা পৌঁছাতে পারে"
      caption="IP এর কাজ একটাই, একটা Packet কে ঠিকানা দেখে পরের Router এর দিকে ঠেলে দেওয়া। Packet টা পৌঁছাল কি না, IP তার খোঁজ রাখে না। এই নীতির নাম Best Effort, মানে চেষ্টা করব, কথা দিচ্ছি না। ফলে চার রকম গোলমাল ঘটতে পারে, আর ডান দিকের ছবিতে তার তিনটা একসাথে দেখা যাচ্ছে। ৩ নম্বর ২ এর আগে এসে গেছে, কারণ দুইটা আলাদা পথে গিয়েছিল। ৪ নম্বর একটা ভিড়ে ঠাসা Router এ ফেলে দেওয়া হয়েছে। ৫ নম্বর দুইবার এসেছে। চতুর্থ গোলমালটা ছবিতে দেখানো যায় না, পথে কোনো একটা Bit উল্টে যাওয়া। TCP এর পুরো কাজ হলো ডান দিকের এই এলোমেলো স্তূপ থেকে বাঁ দিকের নিখুঁত সারিটা আবার বানিয়ে আপনার Program এর হাতে দেওয়া।"
      panels={[
        {
          title: "পাঠানো হলো",
          sub: "Sender এর দিক",
          viewBox: "0 0 300 170",
          height: 170,
          children: <Sent />,
        },
        {
          title: "পৌঁছাল",
          sub: "Receiver এর দিক, TCP এর আগে",
          viewBox: "0 0 300 170",
          height: 170,
          children: <Arrived />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা Connection এর পুরো জীবন                                             */
/* ------------------------------------------------------------------------- */

const LIFE = [
  { y: 96, dir: 1, label: "SYN", phase: 0 },
  { y: 120, dir: -1, label: "SYN-ACK", phase: 0 },
  { y: 144, dir: 1, label: "ACK", phase: 0 },
  { y: 196, dir: 1, label: "Data, Seq 1", phase: 1 },
  { y: 220, dir: -1, label: "ACK 1001", phase: 1 },
  { y: 244, dir: -1, label: "Data, Seq 1", phase: 1 },
  { y: 268, dir: 1, label: "ACK 1001", phase: 1 },
  { y: 320, dir: 1, label: "FIN", phase: 2 },
  { y: 344, dir: -1, label: "ACK, FIN", phase: 2 },
  { y: 368, dir: 1, label: "ACK", phase: 2 },
];

const PHASES = [
  { y: 78, h: 82, name: "১. খোলা", sub: "Three-way Handshake", where: "লেসন ০৫" },
  { y: 178, h: 106, name: "২. কথা বলা", sub: "Data আর ACK", where: "এই লেসন" },
  { y: 302, h: 82, name: "৩. বন্ধ করা", sub: "FIN আর ACK", where: "লেসন ০৮" },
];

export function ConnectionLifeDiagram() {
  const lx = 300;
  const rx = 660;
  return (
    <Sketch
      label="Diagram: একটা TCP Connection এর তিন পর্ব"
      height={410}
      minWidth={840}
      viewBox="0 0 840 410"
      caption="প্রতিটা TCP Connection এর জীবন তিন পর্বে ভাগ। প্রথমে দুই পক্ষ তিনটা ছোট বার্তা দিয়ে পরিচয় সারে, এর নাম Three-way Handshake, আর তার জন্য আলাদা একটা লেসন আছে। শেষে দুই পক্ষ ভদ্রভাবে বিদায় নেয়, সেটারও আলাদা লেসন। এই লেসনের বিষয় মাঝের পর্বটা, যেখানে আসল কথা হয়। খেয়াল করুন মাঝের পর্বে তীর দুই দিকেই যাচ্ছে। TCP Connection একমুখী রাস্তা নয়, দুই লেনের রাস্তা। ফোন Server কে Data পাঠায় আর Server তার প্রাপ্তি স্বীকার করে, আবার Server ফোনকে Data পাঠায় আর ফোন তার প্রাপ্তি স্বীকার করে। দুই দিকের হিসাব সম্পূর্ণ আলাদা, দুইটা আলাদা Sequence Number দিয়ে রাখা।"
    >
      <Arrow id="tcp-life-a" />
      {PHASES.map((p, i) => (
        <g key={p.name}>
          <rect
            x={24}
            y={p.y}
            width={792}
            height={p.h}
            fill={i === 1 ? "var(--primary)" : "currentColor"}
            fillOpacity={i === 1 ? 0.06 : 0.025}
            stroke={i === 1 ? "var(--primary)" : "currentColor"}
            strokeOpacity={i === 1 ? 0.6 : 0.2}
            strokeWidth="1"
          />
          <SketchText x={44} y={p.y + 26} size={11} anchor="start" body bold accent={i === 1}>
            {p.name}
          </SketchText>
          <SketchText x={44} y={p.y + 44} size={9} anchor="start" opacity={0.75}>
            {p.sub}
          </SketchText>
          <SketchText x={44} y={p.y + 60} size={8.5} anchor="start" body opacity={0.6}>
            {p.where}
          </SketchText>
        </g>
      ))}
      <Box x={lx - 80} y={24} w={160} text="ফোন 192.168.1.20:51514" size={8.5} />
      <Box x={rx - 80} y={24} w={160} text="Server 103.94.135.2:443" size={8.5} />
      <line x1={lx} y1={58} x2={lx} y2={392} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="3 4" />
      <line x1={rx} y1={58} x2={rx} y2={392} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="3 4" />
      {LIFE.map((a, i) => (
        <g key={i}>
          <line
            x1={a.dir === 1 ? lx + 4 : rx - 4}
            y1={a.y}
            x2={a.dir === 1 ? rx - 6 : lx + 6}
            y2={a.y}
            stroke="var(--primary)"
            strokeOpacity={a.phase === 1 ? 1 : 0.6}
            strokeWidth="1.3"
            markerEnd="url(#tcp-life-a)"
          />
          <SketchText x={(lx + rx) / 2} y={a.y - 5} size={8.5} bold accent={a.phase === 1} opacity={a.phase === 1 ? 1 : 0.75}>
            {a.label}
          </SketchText>
        </g>
      ))}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Stream, বার্তার সীমানা নেই                                                */
/* ------------------------------------------------------------------------- */

function Wrote() {
  const msgs = ["BOOK seat=12;", "BOOK seat=13;", "BOOK seat=14;"];
  return (
    <>
      <SketchText x={150} y={28} size={9} body opacity={0.75}>
        তিনবার write() ডাকা হলো
      </SketchText>
      {msgs.map((m, i) => (
        <g key={m}>
          <SketchText x={24} y={66 + i * 44} size={8} anchor="start" opacity={0.6}>
            {`write ${i + 1}`}
          </SketchText>
          <Box x={80} y={46 + i * 44} w={196} h={32} text={m} accent size={9} />
        </g>
      ))}
      <SketchText x={150} y={196} size={8.5} body opacity={0.7}>
        আপনার মাথায় এগুলো তিনটা আলাদা বার্তা
      </SketchText>
    </>
  );
}

function ReadBack() {
  return (
    <>
      <SketchText x={150} y={28} size={9} body opacity={0.75}>
        ওপাশে data ঘটনা এলো একবার
      </SketchText>
      <SketchText x={24} y={66} size={8} anchor="start" opacity={0.6}>
        chunk 1
      </SketchText>
      <Box x={24} y={76} w={252} h={36} text="BOOK seat=12;BOOK seat=13;BOOK seat=14;" size={7.5} />
      <SketchText x={150} y={138} size={8.5} body accent>
        ৩৯ Byte, একটাই টুকরো
      </SketchText>
      <line x1={24} y1={156} x2={276} y2={156} stroke="currentColor" strokeOpacity={0.25} />
      <SketchText x={150} y={176} size={8.5} body opacity={0.7}>
        অন্য দিন এটাই আসতে পারে ২০ আর ১৯ Byte এ ভাগ হয়ে
      </SketchText>
      <SketchText x={150} y={196} size={8.5} body opacity={0.7}>
        TCP শুধু Byte এর ক্রম রাখে, বার্তার সীমানা নয়
      </SketchText>
    </>
  );
}

export function StreamVsMessagesSplit() {
  return (
    <SketchSplit
      label="Diagram: আপনি লেখেন বার্তা, TCP বয়ে নেয় Byte এর স্রোত"
      caption="এই ছবিটা Backend Developer দের সবচেয়ে বেশি ভোগায়, তাই ভালো করে দেখুন। বাঁ দিকে আপনার Program তিনবার write() ডেকে তিনটা আলাদা বার্তা লিখেছে। ডান দিকে ওপাশের Program সেগুলো পেয়েছে একটাই টুকরো হিসেবে, তিনটা জোড়া লাগানো। এটা কোনো ত্রুটি নয়, TCP ঠিক এভাবেই কাজ করে। TCP এর কাছে আপনার লেখা হলো একটা লম্বা Byte এর স্রোত, যাকে বলে Byte Stream। সে প্রতিটা Byte ঠিক ক্রমে পৌঁছে দেওয়ার কথা দেয়, কিন্তু কোন Byte কোন write() থেকে এসেছিল তা মনে রাখে না। আপনি পানির কলে তিন গ্লাস পানি ঢাললে ওপাশে তিন গ্লাস বের হয় না, একটা ধারা বের হয়। গ্লাসের মাপ ফিরে পেতে হলে আপনাকেই একটা নিয়ম বানাতে হবে, যাকে বলে Framing।"
      panels={[
        {
          title: "যা লিখলেন",
          sub: "Sender Program",
          viewBox: "0 0 300 210",
          height: 210,
          children: <Wrote />,
        },
        {
          title: "যা পড়া হলো",
          sub: "Receiver Program",
          viewBox: "0 0 300 210",
          height: 210,
          children: <ReadBack />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 4. দুইটা আলাদা ব্রেক: Flow Control আর Congestion Control                    */
/* ------------------------------------------------------------------------- */

function FlowPanel() {
  return (
    <>
      <Arrow id="tcp-fc-a" />
      <Box x={16} y={40} w={84} text="Sender" />
      <Box x={200} y={40} w={84} text="Receiver" accent />
      <line x1={102} y1={50} x2={196} y2={50} stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.3" />
      <SketchText x={150} y={44} size={7.5} opacity={0.7}>
        Data
      </SketchText>
      <line x1={198} y1={66} x2={106} y2={66} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#tcp-fc-a)" />
      <SketchText x={150} y={82} size={8} bold accent>
        Window = 16384
      </SketchText>
      <rect x={200} y={104} width={84} height={70} fill="transparent" stroke="var(--primary)" strokeWidth="1.3" />
      <rect x={200} y={128} width={84} height={46} fill="var(--primary)" fillOpacity={0.25} />
      <SketchText x={242} y={120} size={7.5} body accent>
        খালি জায়গা
      </SketchText>
      <SketchText x={242} y={156} size={7.5} body>
        না পড়া Data
      </SketchText>
      <SketchText x={96} y={132} size={8.5} body opacity={0.8}>
        Receiver নিজে বলে দেয়
      </SketchText>
      <SketchText x={96} y={148} size={8.5} body opacity={0.8}>
        তার Buffer এ কত জায়গা বাকি
      </SketchText>
      <SketchText x={150} y={200} size={8.5} body accent>
        যাকে বাঁচায়: ওপাশের Program
      </SketchText>
    </>
  );
}

function CongestionPanel() {
  return (
    <>
      <Box x={16} y={40} w={84} text="Sender" accent />
      <Box x={200} y={40} w={84} text="Receiver" />
      <path
        d="M100,50 L130,50 L146,54 L154,54 L170,50 L200,50 M100,64 L130,64 L146,60 L154,60 L170,64 L200,64"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth="1.3"
      />
      <SketchText x={150} y={84} size={7.5} body opacity={0.75}>
        পথের সবচেয়ে সরু জায়গা
      </SketchText>
      <rect x={16} y={104} width={84} height={70} fill="transparent" stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={58} y={134} size={9} bold accent>
        cwnd
      </SketchText>
      <SketchText x={58} y={152} size={7.5} body accent>
        নিজের অনুমান
      </SketchText>
      <SketchText x={204} y={126} size={8.5} body opacity={0.8}>
        পথের Router রা কিছু বলে না
      </SketchText>
      <SketchText x={204} y={142} size={8.5} body opacity={0.8}>
        Sender আন্দাজ করে, Packet
      </SketchText>
      <SketchText x={204} y={158} size={8.5} body opacity={0.8}>
        হারালে বোঝে পথ ভরে গেছে
      </SketchText>
      <SketchText x={150} y={200} size={8.5} body accent>
        যাকে বাঁচায়: মাঝের Network
      </SketchText>
    </>
  );
}

export function FlowVsCongestionSplit() {
  return (
    <SketchSplit
      label="Diagram: TCP এর দুইটা আলাদা ব্রেক"
      caption="TCP দুইটা সম্পূর্ণ আলাদা কারণে গতি কমায়, আর এই দুইটাকে মানুষ প্রায়ই গুলিয়ে ফেলে। বাঁ দিকে Flow Control। এখানে সমস্যা ওপাশের Program, যে Data আসার গতিতে পড়তে পারছে না। সমাধান সোজা, Receiver প্রতিটা ACK এর সাথে Header এর Window ঘরে লিখে দেয় তার Buffer এ আর কত Byte ধরবে, আর Sender তার বেশি পাঠায় না। ডান দিকে Congestion Control। এখানে সমস্যা মাঝের পথ, যেখানে কোনো Router এর লাইন ভরে গেছে। Router রা Sender কে কিছু বলে না, তাই Sender কে নিজে আন্দাজ করতে হয়। সে নিজের কাছে আরেকটা সংখ্যা রাখে, Congestion Window বা cwnd, যা সে আস্তে আস্তে বাড়ায় আর Packet হারালে কমায়। যেকোনো মুহূর্তে Sender পাঠাতে পারে এই দুই সংখ্যার মধ্যে যেটা ছোট, তার সমান।"
      panels={[
        {
          title: "Flow Control",
          sub: "Receiver জানায়, rwnd",
          viewBox: "0 0 300 214",
          height: 214,
          children: <FlowPanel />,
        },
        {
          title: "Congestion Control",
          sub: "Sender আন্দাজ করে, cwnd",
          viewBox: "0 0 300 214",
          height: 214,
          children: <CongestionPanel />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 5. Head of Line Blocking                                                    */
/* ------------------------------------------------------------------------- */

const HOL = [
  { n: "1", state: "done" },
  { n: "2", state: "lost" },
  { n: "3", state: "held" },
  { n: "4", state: "held" },
  { n: "5", state: "held" },
];

export function HeadOfLineDiagram() {
  const w = 96;
  const gap = 18;
  const startX = 120;
  return (
    <Sketch
      label="Diagram: একটা হারানো Segment পেছনের সবাইকে আটকে রাখে"
      height={230}
      minWidth={840}
      viewBox="0 0 840 230"
      caption="TCP কথা দিয়েছে Byte গুলো ঠিক ক্রমে আপনার Program এর হাতে দেবে। এই কথা রাখতে গিয়ে একটা দাম দিতে হয়। ছবিতে ২ নম্বর Segment পথে হারিয়ে গেছে, কিন্তু ৩, ৪ আর ৫ ঠিকঠাক পৌঁছে গেছে। Kernel এই তিনটাকে নিজের Buffer এ ধরে রাখবে, আপনার Program কে দেবে না, যতক্ষণ না ২ নম্বর আবার এসে ফাঁকটা ভরাট করে। লাইনের সামনের একজন আটকে গেলে পেছনের সবাই আটকে যায়, তাই এর নাম Head of Line Blocking। সাধারণ একটা Download এ এটা টের পাওয়া যায় না। কিন্তু একটা Connection দিয়ে যখন অনেকগুলো আলাদা জিনিস একসাথে যায়, যেমন HTTP/2 এ একটা পাতার ছবি, CSS আর JavaScript, তখন একটা ছবির একটা হারানো Segment বাকি সবকিছুকেও দাঁড় করিয়ে দেয়।"
    >
      <SketchText x={60} y={96} size={9} body opacity={0.7}>
        Kernel এর
      </SketchText>
      <SketchText x={60} y={112} size={9} body opacity={0.7}>
        Receive Buffer
      </SketchText>
      {HOL.map((s, i) => {
        const x = startX + i * (w + gap);
        const lost = s.state === "lost";
        const done = s.state === "done";
        return (
          <g key={s.n}>
            <rect
              x={x}
              y={70}
              width={w}
              height={56}
              fill={done ? "var(--primary)" : "currentColor"}
              fillOpacity={done ? 0.12 : lost ? 0 : 0.05}
              stroke={done ? "var(--primary)" : "currentColor"}
              strokeOpacity={done ? 1 : 0.5}
              strokeWidth="1.3"
              strokeDasharray={lost ? "4 3" : undefined}
            />
            <SketchText x={x + w / 2} y={94} size={11} bold accent={done} opacity={lost ? 0.5 : 1}>
              {`Segment ${s.n}`}
            </SketchText>
            <SketchText x={x + w / 2} y={112} size={8.5} body accent={done} opacity={lost ? 0.9 : 0.75}>
              {done ? "Program কে দেওয়া হয়েছে" : lost ? "এখনো আসেনি" : "এসেছে, আটকে আছে"}
            </SketchText>
          </g>
        );
      })}
      <line x1={startX + w + gap / 2} y1={56} x2={startX + w + gap / 2} y2={140} stroke="var(--primary)" strokeWidth="1.4" strokeDasharray="5 4" />
      <SketchText x={startX + w + gap / 2} y={46} size={8.5} body accent>
        Program এই দাগ পর্যন্ত পড়তে পারে
      </SketchText>
      <SketchText x={420} y={176} size={9.5} body accent>
        ২ নম্বর ফিরে না আসা পর্যন্ত ৩, ৪, ৫ হাতে থেকেও নেই
      </SketchText>
      <SketchText x={420} y={198} size={8.5} body opacity={0.7}>
        ক্রম ঠিক রাখার দাম এটাই
      </SketchText>
    </Sketch>
  );
}
