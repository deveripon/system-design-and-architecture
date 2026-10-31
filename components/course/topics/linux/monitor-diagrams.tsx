/**
 * What: The still diagrams for Module 07 Lesson 08, Monitoring Tools. They show the six vital
 * signs of a server and the tool that reads each, what a load average counts, the five header
 * lines of top, VIRT against RES against SHR, how free splits memory, and a deleted file that
 * still holds disk space.
 *
 * Why: Every one of these tools prints a wall of numbers, and a beginner cannot tell which
 * number matters. A picture that points at each number and says what it means turns that wall
 * into something the reader can read on their own server. The numbers in the top, memory and
 * disk pictures are the real ones captured on the lesson's practice server. Every marker id
 * starts with "monitor-" so two diagrams on the same page never share an id.
 */
import { SKETCH_MONO, Sketch, SketchSplit, SketchText } from "../../sketch";

function Arrow({ id, muted }: { id: string; muted?: boolean }) {
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
          fill={muted ? "currentColor" : "var(--primary)"}
          fillOpacity={muted ? 0.55 : 1}
        />
      </marker>
    </defs>
  );
}

/** A line of terminal text that keeps its spaces, so columns stay where the tool put them. */
function Mono({
  x,
  y,
  size = 10,
  accent,
  opacity,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  accent?: boolean;
  opacity?: number;
  children: React.ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={SKETCH_MONO}
      fontSize={size}
      xmlSpace="preserve"
      fill={accent ? "var(--primary)" : "currentColor"}
      fillOpacity={opacity}
    >
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. ছয়টা লক্ষণ, আর কোনটা কোন যন্ত্রে পড়া যায়                                    */
/* ------------------------------------------------------------------------- */

const VITALS = [
  { side: "left", y: 24, title: "CPU", question: "কাজ সামলাতে পারছে?", tools: "uptime · top · htop" },
  { side: "left", y: 150, title: "MEMORY", question: "জায়গা আছে, নাকি Swap এ নামছে?", tools: "free -h · top · vmstat" },
  { side: "left", y: 276, title: "PROCESSES", question: "কে এত খাচ্ছে?", tools: "ps · pidstat · systemd-cgtop" },
  { side: "right", y: 24, title: "DISK SPACE", question: "ভরে যাচ্ছে না তো?", tools: "df -h · df -i · du" },
  { side: "right", y: 150, title: "DISK I/O", question: "Disk কি সবাইকে দাঁড় করিয়ে রাখছে?", tools: "iostat · vmstat (b, wa)" },
  { side: "right", y: 276, title: "NETWORK", question: "Connection আর Traffic কেমন?", tools: "ss -s · ip -s link · sar" },
] as const;

export function VitalSignsDiagram() {
  return (
    <Sketch
      label="Diagram: একটা Server এর ছয়টা লক্ষণ"
      height={380}
      minWidth={900}
      viewBox="0 0 900 380"
      caption="ডাক্তার রোগী দেখলে জ্বর, নাড়ি আর রক্তচাপ মাপেন, পুরো শরীর কেটে দেখেন না। Server এর বেলাতেও তাই। ছয়টা প্রশ্নের উত্তর জানলেই বোঝা যায় Server সুস্থ কি না, আর অসুস্থ হলে সমস্যাটা কোন দিকে। প্রতিটা কার্ডের নিচে সেই যন্ত্রগুলোর নাম, যেগুলো দিয়ে এই লেসনে প্রশ্নটার উত্তর পড়বেন। সব যন্ত্র Ubuntu তে আগে থেকেই থাকে, শুধু iostat আর sar আসে sysstat Package এর সাথে।"
    >
      <Arrow id="monitor-vital-a" muted />

      {/* the server in the middle */}
      <rect x={345} y={140} width={210} height={100} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.5" />
      <SketchText x={450} y={172} size={11} bold accent>
        island-vps-01
      </SketchText>
      <SketchText x={450} y={194} size={9} opacity={0.8}>
        2 vCPU · 4 GB RAM · 80 GB
      </SketchText>
      <SketchText x={450} y={216} size={9} body opacity={0.8}>
        Island Tours এর VPS
      </SketchText>

      {VITALS.map((v) => {
        const x = v.side === "left" ? 20 : 620;
        const edgeX = v.side === "left" ? x + 260 : x;
        const targetX = v.side === "left" ? 345 : 555;
        const midY = v.y + 40;
        const targetY = 190 + (midY - 190) * 0.35;
        return (
          <g key={v.title}>
            <rect x={x} y={v.y} width={260} height={80} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" />
            <SketchText x={x + 130} y={v.y + 22} size={10} bold accent>
              {v.title}
            </SketchText>
            <SketchText x={x + 130} y={v.y + 44} size={9.5} body>
              {v.question}
            </SketchText>
            <SketchText x={x + 130} y={v.y + 65} size={8.5} opacity={0.75}>
              {v.tools}
            </SketchText>
            <line
              x1={edgeX}
              y1={midY}
              x2={targetX}
              y2={targetY}
              stroke="currentColor"
              strokeOpacity={0.4}
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Load average আসলে কী গোনে                                                */
/* ------------------------------------------------------------------------- */

function ProcBox({ x, y, label, accent, dashed }: { x: number; y: number; label: string; accent?: boolean; dashed?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={74}
        height={30}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.15 : 0.05}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 1 : 0.5}
        strokeWidth="1.2"
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <SketchText x={x + 37} y={y + 19} size={9} bold accent={accent}>
        {label}
      </SketchText>
    </g>
  );
}

export function LoadQueueDiagram() {
  return (
    <Sketch
      label="Diagram: Load average গোনে কারা কাজ করছে আর কারা অপেক্ষায়"
      height={340}
      minWidth={900}
      viewBox="0 0 900 340"
      caption="দুইটা কাউন্টারের একটা টিকিট ঘর ভাবুন। দুইজন টিকিট কাটছেন, তিনজন লাইনে দাঁড়িয়ে, আর একজন কাউন্টারে নেই, তিনি গেছেন কাগজ আনতে, ফিরলেই আবার লাইনে। Load average এই সবাইকে গোনে: যারা CPU তে চলছে (R), যারা CPU এর জন্য লাইনে (R), আর যারা Disk এর উত্তরের জন্য আটকে আছে (D)। ছবির হিসাবে Load 6, আর কাউন্টার দুইটা, তাই প্রতি Core এ 3। এই ছবির সংখ্যাগুলো বোঝানোর জন্য বানানো, লেসনের বাকি Output গুলো আসল।"
    >
      <Arrow id="monitor-load-a" />
      <Arrow id="monitor-load-m" muted />

      {/* the queue */}
      <SketchText x={170} y={40} size={9.5} body bold>
        CPU এর জন্য লাইনে (R)
      </SketchText>
      <ProcBox x={40} y={62} label="curl" />
      <ProcBox x={130} y={62} label="node" />
      <ProcBox x={220} y={62} label="gzip" />
      <line x1={300} y1={77} x2={392} y2={77} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" markerEnd="url(#monitor-load-m)" />

      {/* the counters */}
      <rect x={400} y={30} width={170} height={58} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={485} y={46} size={8.5} accent>
        CPU 0
      </SketchText>
      <ProcBox x={448} y={52} label="node" accent />
      <rect x={400} y={100} width={170} height={58} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={485} y={116} size={8.5} accent>
        CPU 1
      </SketchText>
      <ProcBox x={448} y={122} label="caddy" accent />
      <SketchText x={485} y={180} size={9.5} body bold accent>
        এখন চলছে (R)
      </SketchText>

      {/* the D state */}
      <SketchText x={170} y={218} size={9.5} body bold>
        Disk এর উত্তরের অপেক্ষায় (D)
      </SketchText>
      <ProcBox x={130} y={236} label="pg_dump" dashed />
      <line x1={210} y1={251} x2={392} y2={251} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" strokeDasharray="4 3" markerEnd="url(#monitor-load-m)" />
      {/* a disk drawn as a cylinder */}
      <ellipse cx={485} cy={230} rx={40} ry={9} fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.2" />
      <path d="M445,230 L445,268 A40,9 0 0 0 525,268 L525,230" fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.2" />
      <SketchText x={485} y={257} size={9} bold>
        Disk
      </SketchText>
      <SketchText x={170} y={292} size={8.5} body opacity={0.75}>
        CPU তে নেই, তবু Load এ গোনা হয়
      </SketchText>

      {/* the sum */}
      <rect x={610} y={30} width={270} height={250} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" />
      <SketchText x={745} y={58} size={9.5} body>
        চলছে 2 + লাইনে 3 + আটকে 1
      </SketchText>
      <SketchText x={745} y={92} size={20} bold accent>
        Load = 6
      </SketchText>
      <line x1={630} y1={110} x2={860} y2={110} stroke="currentColor" strokeOpacity={0.25} />
      <SketchText x={745} y={134} size={9.5} body>
        2 vCPU তে প্রতি Core এ 3
      </SketchText>
      <SketchText x={745} y={154} size={9} body opacity={0.8}>
        মানে প্রতিটা কাউন্টারের সামনে
      </SketchText>
      <SketchText x={745} y={170} size={9} body opacity={0.8}>
        গড়ে দুইজন অপেক্ষা করছেন
      </SketchText>
      <line x1={630} y1={188} x2={860} y2={188} stroke="currentColor" strokeOpacity={0.25} />
      <SketchText x={745} y={212} size={9}>
        load average: 6.02, 3.10, 1.20
      </SketchText>
      <SketchText x={745} y={234} size={8.5} body opacity={0.8}>
        ১, ৫ আর ১৫ মিনিটের গড়
      </SketchText>
      <SketchText x={745} y={256} size={9} body bold accent>
        প্রথমটা সবচেয়ে বড়, মানে বাড়ছে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. top এর মাথার পাঁচ লাইন                                                   */
/* ------------------------------------------------------------------------- */

const TOP_ROWS = [
  { y: 52, label: "সময়, কতক্ষণ চালু, Load", text: "top - 07:25:30 up  4:19,  0 user,  load average: 5.14, 3.28, 2.24", mark: "load average: 5.14, 3.28, 2.24" },
  { y: 86, label: "কয়টা Process, কে কোন State এ", text: "Tasks:  15 total,   2 running,  13 sleeping,   0 stopped,   0 zombie", mark: "" },
  { y: 120, label: "CPU এর সময় কোথায় যাচ্ছে", text: "%Cpu(s): 51.2 us,  4.7 sy,  0.0 ni, 41.9 id,  0.0 wa,  0.0 hi,  2.3 si,  0.0 st", mark: "51.2 us" },
  { y: 154, label: "RAM এর হিসাব, MiB তে", text: "MiB Mem :   5910.3 total,    981.2 free,   1726.8 used,   4036.1 buff/cache", mark: "" },
  { y: 188, label: "Swap, আর আসলে কত খালি", text: "MiB Swap:      0.0 total,      0.0 free,      0.0 used.   4183.6 avail Mem", mark: "4183.6 avail Mem" },
] as const;

/** Mono text at size 10 advances 6 units per character, so a substring's box can be computed. */
const TOP_X = 314;
const CHAR_W = 6;
function markBox(text: string, mark: string) {
  const at = text.indexOf(mark);
  return { x: TOP_X + at * CHAR_W - 3, w: mark.length * CHAR_W + 6 };
}

export function TopAnatomyDiagram() {
  return (
    <Sketch
      label="Diagram: top এর প্রথম পাঁচ লাইন, এক এক করে"
      height={330}
      minWidth={980}
      viewBox="0 0 980 330"
      caption="এটা লেসনের অনুশীলনের Server এর আসল top, যখন একটা Node App ইচ্ছা করে CPU পোড়াচ্ছিল। উপরের পাঁচ লাইন পুরো যন্ত্রের সারাংশ, নিচের টেবিল প্রতিটা Process এর হিসাব। প্রথমে সারাংশ পড়বেন, কারণ সেটাই বলে সমস্যাটা CPU তে, Memory তে, নাকি Disk এ। তারপর টেবিল বলে কে দায়ী। এখানে দায়ী একটাই, PID 198 এর node, 100% CPU, মানে পুরো একটা Core।"
    >
      <Arrow id="monitor-top-a" muted />
      <rect x={300} y={28} width={666} height={278} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.35} strokeWidth="1.2" />

      {TOP_ROWS.map((row) => (
        <g key={row.y}>
          <SketchText x={276} y={row.y} size={9.5} body anchor="end">
            {row.label}
          </SketchText>
          <line x1={282} y1={row.y - 3} x2={306} y2={row.y - 3} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.1" markerEnd="url(#monitor-top-a)" />
          <Mono x={TOP_X} y={row.y}>
            {row.text}
          </Mono>
        </g>
      ))}

      {/* highlight the parts the lesson keeps coming back to */}
      {TOP_ROWS.filter((row) => row.mark).map((row) => {
        const box = markBox(row.text, row.mark);
        return (
          <rect key={row.mark} x={box.x} y={row.y - 14} width={box.w} height={19} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeOpacity={0.7} />
        );
      })}

      <line x1={300} y1={214} x2={966} y2={214} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3 3" />
      <SketchText x={276} y={242} size={9.5} body anchor="end">
        প্রতিটা Process এর এক লাইন
      </SketchText>
      <line x1={282} y1={239} x2={306} y2={239} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.1" markerEnd="url(#monitor-top-a)" />
      <Mono x={314} y={242} opacity={0.75}>
        {"    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND"}
      </Mono>
      <Mono x={314} y={268} accent>
        {"    198 mytours   20   0  607596  53464  39228 R 100.0   0.9   0:13.46 node"}
      </Mono>
      <Mono x={314} y={290} opacity={0.75}>
        {"      1 root      20   0   21080  11744   8892 S   0.0   0.2   0:01.51 systemd"}
      </Mono>

      <SketchText x={140} y={290} size={9} body opacity={0.75}>
        চিহ্নিত তিনটা জায়গা আগে দেখুন
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. VIRT, RES আর SHR                                                         */
/* ------------------------------------------------------------------------- */

export function VirtResShrDiagram() {
  // Real values (KiB) from top on the practice server after the app took 300 MB.
  const scale = 760 / 914564;
  const virtW = 760;
  const resW = Math.round(358744 * scale);
  const shrW = Math.max(Math.round(39228 * scale), 22);
  const x0 = 70;
  return (
    <Sketch
      label="Diagram: একই Process এর তিনটা Memory সংখ্যা"
      height={270}
      minWidth={900}
      viewBox="0 0 900 270"
      caption="একই node Process, তিনটা আলাদা সংখ্যা। VIRT হলো যত Memory সে চেয়ে রেখেছে বা দেখতে পায়, যার বড় অংশ সে কখনো ছোঁয়ইনি, তাই VIRT দেখে ভয় পাওয়ার কিছু নেই। RES হলো যা এই মুহূর্তে সত্যিই RAM এ বসে আছে, Memory নিয়ে প্রশ্ন উঠলে এটাই দেখবেন। SHR হলো RES এর সেই অংশ যা অন্য Process এর সাথে ভাগ করা যায়, যেমন সবার ব্যবহার করা Library। সংখ্যাগুলো আসল, App টা 300 MB ধরে রাখার পরে নেওয়া।"
    >
      {/* VIRT outline */}
      <rect x={x0} y={100} width={virtW} height={46} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.2" strokeDasharray="5 4" />
      {/* RES filled */}
      <rect x={x0} y={100} width={resW} height={46} fill="var(--primary)" fillOpacity={0.2} stroke="var(--primary)" strokeWidth="1.3" />
      {/* SHR hatched inside RES */}
      <rect x={x0} y={100} width={shrW} height={46} fill="var(--primary)" fillOpacity={0.45} stroke="var(--primary)" strokeWidth="1.2" />

      {/* VIRT bracket above */}
      <path d={`M${x0},88 L${x0},78 L${x0 + virtW},78 L${x0 + virtW},88`} fill="none" stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.1" />
      <SketchText x={x0 + virtW / 2} y={50} size={10} bold>
        VIRT 914564 KiB, প্রায় 893 MB
      </SketchText>
      <SketchText x={x0 + virtW / 2} y={68} size={9} body opacity={0.8}>
        যত Memory চেয়ে রেখেছে বা দেখতে পায়, সবটা ব্যবহার করে না
      </SketchText>

      {/* RES bracket below */}
      <path d={`M${x0},158 L${x0},168 L${x0 + resW},168 L${x0 + resW},158`} fill="none" stroke="var(--primary)" strokeWidth="1.2" />
      <SketchText x={x0 + resW / 2 + 30} y={190} size={10} bold accent>
        RES 358744 KiB, প্রায় 350 MB
      </SketchText>
      <SketchText x={x0 + resW / 2 + 30} y={208} size={9} body>
        এই মুহূর্তে সত্যিই RAM এ আছে, এটাই আসল খরচ
      </SketchText>

      {/* SHR callout */}
      <line x1={x0 + shrW / 2} y1={146} x2={x0 + shrW / 2} y2={236} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1" />
      <SketchText x={x0 + shrW / 2 + 8} y={248} size={9.5} bold anchor="start">
        SHR 39228 KiB
      </SketchText>
      <SketchText x={x0 + shrW / 2 + 112} y={248} size={9} body anchor="start" opacity={0.8}>
        RES এর ভেতরের ভাগ করা অংশ, যেমন Library
      </SketchText>

      <SketchText x={x0 + virtW - 10} y={128} size={9} body anchor="end" opacity={0.75}>
        চাওয়া হয়েছে, কিন্তু RAM এ নেই
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. free এর সংখ্যাগুলো একটা দাগে                                              */
/* ------------------------------------------------------------------------- */

export function MemoryBarDiagram() {
  // Real numbers (MiB) from the first top on the practice server:
  // total 5910.3, free 1518.8, used 1673.8, buff/cache 3551.3, avail 4236.5.
  // procps 4 prints used as total minus available, so the reclaimable part of the
  // cache is avail minus free, and the rest of the cache sits inside "used".
  const total = 5910.3;
  const free = 1518.8;
  const used = 1673.8;
  const cache = 3551.3;
  const avail = 4236.5;
  const reclaim = avail - free;
  const stuck = cache - reclaim;
  const programs = used - stuck;
  const x0 = 60;
  const w = 780;
  const s = w / total;
  const a = x0 + programs * s;
  const b = a + stuck * s;
  const c = b + reclaim * s;
  const end = x0 + w;
  return (
    <Sketch
      label="Diagram: free -h এর পাঁচটা সংখ্যা, একটা দাগে"
      height={330}
      minWidth={900}
      viewBox="0 0 900 330"
      caption="উপরের দুইটা বন্ধনী free এর used আর buff/cache, নিচের দুইটা free আর available। লক্ষ্য করুন buff/cache এর বড় অংশ নিচের available বন্ধনীর ভেতরে পড়েছে। কারণ Linux খালি RAM ফেলে রাখে না, পড়া File গুলো Cache করে রাখে, আর কোনো Program এর দরকার হলেই সেই জায়গা ছেড়ে দেয়। তাই free ছোট দেখে ভয় পাবেন না, দেখবেন available। সংখ্যাগুলো লেসনের অনুশীলনের Server এর আসল top থেকে, আর ছাড়া যায় না এমন Cache এর ভাগটা সেখান থেকেই হিসাব করা, আনুমানিক।"
    >
      {/* the segments */}
      <rect x={x0} y={130} width={a - x0} height={44} fill="currentColor" fillOpacity={0.3} stroke="currentColor" strokeOpacity={0.6} />
      <rect x={a} y={130} width={b - a} height={44} fill="currentColor" fillOpacity={0.15} stroke="currentColor" strokeOpacity={0.6} />
      <rect x={b} y={130} width={c - b} height={44} fill="var(--primary)" fillOpacity={0.15} stroke="var(--primary)" strokeOpacity={0.8} />
      <rect x={c} y={130} width={end - c} height={44} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeOpacity={0.8} />

      <SketchText x={(x0 + a) / 2} y={157} size={8.5} body>
        Program গুলো
      </SketchText>
      <SketchText x={(a + b) / 2} y={152} size={8} body>
        আটকে থাকা
      </SketchText>
      <SketchText x={(a + b) / 2} y={165} size={8} body>
        Cache
      </SketchText>
      <SketchText x={(b + c) / 2} y={157} size={9} body accent>
        Cache, দরকার হলে ছেড়ে দেয়
      </SketchText>
      <SketchText x={(c + end) / 2} y={157} size={9} body accent>
        একদম খালি
      </SketchText>

      {/* above: used and buff/cache */}
      <path d={`M${x0},118 L${x0},104 L${b},104 L${b},118`} fill="none" stroke="currentColor" strokeOpacity={0.7} strokeWidth="1.2" />
      <SketchText x={(x0 + a) / 2} y={96} size={10} bold>
        used 1.6Gi
      </SketchText>
      <path d={`M${a},100 L${a},70 L${c},70 L${c},118`} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.1" strokeDasharray="4 3" />
      <SketchText x={(a + c) / 2 + 40} y={60} size={10} bold>
        buff/cache 3.5Gi
      </SketchText>

      {/* below: free and available */}
      <path d={`M${c},186 L${c},200 L${end},200 L${end},186`} fill="none" stroke="var(--primary)" strokeWidth="1.2" />
      <SketchText x={(c + end) / 2} y={218} size={10} bold accent>
        free 1.5Gi
      </SketchText>
      <path d={`M${b},186 L${b},240 L${end},240 L${end},222`} fill="none" stroke="var(--primary)" strokeWidth="1.4" />
      <SketchText x={(b + end) / 2} y={262} size={11} bold accent>
        available 4.1Gi
      </SketchText>
      <SketchText x={(b + end) / 2} y={282} size={9} body>
        নতুন Program আসলে এতটা পাবে, এটাই দেখার সংখ্যা
      </SketchText>

      <SketchText x={x0} y={300} size={8.5} body anchor="start" opacity={0.75}>
        total 5.8Gi = used + available
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. মুছে ফেলা File, যা এখনো জায়গা ধরে আছে                                     */
/* ------------------------------------------------------------------------- */

function FileIcon({ x, y, deleted }: { x: number; y: number; deleted?: boolean }) {
  return (
    <g>
      <path
        d={`M${x},${y} L${x + 34},${y} L${x + 46},${y + 12} L${x + 46},${y + 56} L${x},${y + 56} Z`}
        fill="currentColor"
        fillOpacity={0.05}
        stroke="currentColor"
        strokeOpacity={deleted ? 0.45 : 0.7}
        strokeWidth="1.2"
        strokeDasharray={deleted ? "4 3" : undefined}
      />
      <path d={`M${x + 34},${y} L${x + 34},${y + 12} L${x + 46},${y + 12}`} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth="1" />
    </g>
  );
}

export function DiskGhostSplit() {
  return (
    <SketchSplit
      label="Diagram: rm করলেন, তবু Disk খালি হলো না"
      caption="বাঁ দিকে, একটা 800 MB এর Log File মুছে দেওয়া হয়েছে, কিন্তু একটা Process তখনো সেটা খুলে রেখেছে। Folder থেকে নামটা চলে গেছে বলে du কিছু খুঁজে পায় না, অথচ df বলছে জায়গা এখনো ভরা, কারণ শেষ খোলা হাতটা না ছাড়া পর্যন্ত Linux আসল জায়গাটা ফেরত দেয় না। ডান দিকে, Process টা থামানোর পরে জায়গা ফিরে এলো। দুই পাশের সংখ্যাই অনুশীলনের Server এর আসল df আর du থেকে।"
      panels={[
        {
          title: "rm এর পরে",
          sub: "Process তখনো File টা খুলে রেখেছে",
          viewBox: "0 0 400 230",
          height: 230,
          children: (
            <>
              <Arrow id="monitor-ghost-a" />
              <FileIcon x={60} y={40} deleted />
              <SketchText x={83} y={118} size={8.5} opacity={0.8}>
                api.log (deleted)
              </SketchText>
              <rect x={230} y={46} width={140} height={44} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.3" />
              <SketchText x={300} y={65} size={9.5} bold accent>
                python3
              </SketchText>
              <SketchText x={300} y={81} size={8.5} opacity={0.8}>
                PID 338, fd 3
              </SketchText>
              <line x1={224} y1={68} x2={114} y2={68} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#monitor-ghost-a)" />
              <SketchText x={170} y={60} size={8.5} body accent>
                এখনো ধরে আছে
              </SketchText>
              <SketchText x={200} y={160} size={10} bold>
                df: Used 16G
              </SketchText>
              <SketchText x={200} y={182} size={10}>
                du /var/log/my-tours: 4.0K
              </SketchText>
              <SketchText x={200} y={208} size={9} body opacity={0.8}>
                দুই যন্ত্র দুই কথা বলছে
              </SketchText>
            </>
          ),
        },
        {
          title: "Process থামানোর পরে",
          sub: "শেষ হাতটা ছেড়ে দিল",
          viewBox: "0 0 400 230",
          height: 230,
          children: (
            <>
              <rect x={230} y={46} width={140} height={44} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.35} strokeWidth="1.2" strokeDasharray="4 3" />
              <SketchText x={300} y={72} size={9.5} body opacity={0.6}>
                (থেমে গেছে)
              </SketchText>
              <SketchText x={83} y={72} size={22} opacity={0.35}>
                ∅
              </SketchText>
              <SketchText x={200} y={160} size={10} bold accent>
                df: Used 15G
              </SketchText>
              <SketchText x={200} y={182} size={10} body>
                800 MB ফেরত এলো
              </SketchText>
              <SketchText x={200} y={208} size={9} body opacity={0.8}>
                এখন df আর du এক কথা বলে
              </SketchText>
            </>
          ),
        },
      ]}
    />
  );
}
