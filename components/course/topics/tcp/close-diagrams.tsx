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
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  accent?: boolean;
  size?: number;
  dashed?: boolean;
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
/* 1. চার ধাপের বিদায়, দুই পাশের State সহ                                     */
/* ------------------------------------------------------------------------- */

const CLOSE_STEPS = [
  { y: 128, dir: "right", flag: "FIN", detail: "seq=5001", note: "আমার আর কিছু পাঠানোর নেই" },
  { y: 188, dir: "left", flag: "ACK", detail: "ack=5002", note: "শুনেছি, আপনার দিক বন্ধ" },
  { y: 268, dir: "left", flag: "FIN", detail: "seq=9001", note: "আমারও পাঠানো শেষ" },
  { y: 328, dir: "right", flag: "ACK", detail: "ack=9002", note: "শুনেছি, বিদায়" },
] as const;

const LEFT_STATES = [
  { y: 96, text: "ESTABLISHED" },
  { y: 160, text: "FIN_WAIT_1" },
  { y: 230, text: "FIN_WAIT_2" },
  { y: 362, text: "TIME_WAIT" },
  { y: 410, text: "CLOSED" },
];

const RIGHT_STATES = [
  { y: 96, text: "ESTABLISHED" },
  { y: 160, text: "CLOSE_WAIT" },
  { y: 300, text: "LAST_ACK" },
  { y: 362, text: "CLOSED" },
];

export function CloseSequenceDiagram() {
  const lx = 250;
  const rx = 590;
  return (
    <Sketch
      label="Diagram: একটা Connection এর চার ধাপের বিদায়"
      height={440}
      minWidth={840}
      viewBox="0 0 840 440"
      caption="বাঁ দিকে পর্যটকের ফোন, ডান দিকে Island Tours এর Server। এখানে ফোন আগে বিদায় বলছে, তাই ফোন হলো Active Closer আর Server হলো Passive Closer। মাঝের চারটা তীর চারটা Segment। প্রথম দুইটা মিলে ফোন থেকে Server এর দিকের রাস্তাটা বন্ধ হয়, শেষ দুইটা মিলে Server থেকে ফোনের দিকের রাস্তাটা। দুই পাশে লেখা নামগুলো State, মানে সেই মুহূর্তে Kernel এর খাতায় Connection টার অবস্থা। খেয়াল করুন, দ্বিতীয় আর তৃতীয় তীরের মাঝে একটা ফাঁক আছে। ওই সময়টায় Server এখনো তথ্য পাঠাতে পারে, এটাই Half Close। আর সবার শেষে ফোন সোজা CLOSED হয় না, আগে কিছুক্ষণ TIME_WAIT এ দাঁড়িয়ে থাকে।"
    >
      <Arrow id="close-seq-a" />
      <Box x={lx - 110} y={24} w={220} h={40} text="ফোন 192.168.1.20:51514" accent />
      <Box x={rx - 110} y={24} w={220} h={40} text="Server 103.94.135.2:443" />
      <SketchText x={lx} y={80} size={8.5} body opacity={0.7}>
        Active Closer, আগে বিদায় বলে
      </SketchText>
      <SketchText x={rx} y={80} size={8.5} body opacity={0.7}>
        Passive Closer, পরে বলে
      </SketchText>
      <line x1={lx} y1={88} x2={lx} y2={420} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={88} x2={rx} y2={420} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />

      {CLOSE_STEPS.map((s, i) => {
        const from = s.dir === "right" ? lx + 4 : rx - 4;
        const to = s.dir === "right" ? rx - 6 : lx + 6;
        return (
          <g key={s.y}>
            <line x1={from} y1={s.y} x2={to} y2={s.y} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#close-seq-a)" />
            <SketchText x={420} y={s.y - 8} size={10.5} bold accent>
              {`${["১", "২", "৩", "৪"][i]}. ${s.flag}  ${s.detail}`}
            </SketchText>
            <SketchText x={420} y={s.y + 15} size={8.5} body opacity={0.75}>
              {s.note}
            </SketchText>
          </g>
        );
      })}

      {LEFT_STATES.map((s) => (
        <SketchText key={s.text} x={lx - 16} y={s.y + 4} size={9.5} anchor="end" bold accent={s.text === "TIME_WAIT"}>
          {s.text}
        </SketchText>
      ))}
      {RIGHT_STATES.map((s) => (
        <SketchText key={s.text} x={rx + 16} y={s.y + 4} size={9.5} anchor="start" bold accent={s.text === "CLOSE_WAIT"}>
          {s.text}
        </SketchText>
      ))}

      <SketchText x={rx + 16} y={226} size={8.5} anchor="start" body opacity={0.75}>
        এই ফাঁকে Server এখনো
      </SketchText>
      <SketchText x={rx + 16} y={240} size={8.5} anchor="start" body opacity={0.75}>
        তথ্য পাঠাতে পারে
      </SketchText>
      <SketchText x={lx - 16} y={380} size={8.5} anchor="end" body opacity={0.75}>
        2MSL অপেক্ষা
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. TIME_WAIT কেন, দুইটা কারণ                                               */
/* ------------------------------------------------------------------------- */

function LostAck() {
  const lx = 60;
  const rx = 240;
  return (
    <>
      <Arrow id="close-tw-a" />
      <Box x={lx - 44} y={10} w={88} h={28} text="ফোন" accent size={9} />
      <Box x={rx - 44} y={10} w={88} h={28} text="Server" size={9} />
      <line x1={lx} y1={38} x2={lx} y2={226} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={38} x2={rx} y2={226} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />

      <line x1={rx - 4} y1={66} x2={lx + 6} y2={66} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#close-tw-a)" />
      <SketchText x={150} y={60} size={9} bold accent>
        FIN
      </SketchText>

      <line x1={lx + 4} y1={100} x2={170} y2={100} stroke="var(--primary)" strokeWidth="1.4" strokeDasharray="4 3" />
      <SketchText x={186} y={104} size={12} bold accent>
        ✕
      </SketchText>
      <SketchText x={118} y={94} size={9} bold accent>
        ACK
      </SketchText>
      <SketchText x={150} y={120} size={8} body opacity={0.75}>
        শেষ ACK পথে হারাল
      </SketchText>

      <line x1={rx - 4} y1={152} x2={lx + 6} y2={152} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#close-tw-a)" />
      <SketchText x={150} y={146} size={9} bold accent>
        FIN আবার
      </SketchText>

      <line x1={lx + 4} y1={188} x2={rx - 6} y2={188} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#close-tw-a)" />
      <SketchText x={150} y={182} size={9} bold accent>
        ACK আবার
      </SketchText>
      <SketchText x={150} y={214} size={8} body opacity={0.75}>
        ফোন TIME_WAIT এ ছিল বলেই চিনতে পারল
      </SketchText>
    </>
  );
}

function LatePacket() {
  return (
    <>
      <Arrow id="close-tw-b" />
      <Box x={16} y={10} w={268} h={30} text="একই চার সংখ্যা: 51514 থেকে 443" size={8.5} />
      <Box x={16} y={64} w={120} h={44} text="পুরনো Connection" size={8.5} dashed />
      <Box x={164} y={64} w={120} h={44} text="নতুন Connection" size={8.5} accent />
      <SketchText x={76} y={124} size={8} body opacity={0.7}>
        বন্ধ হয়ে গেছে
      </SketchText>
      <SketchText x={224} y={124} size={8} body opacity={0.7}>
        এইমাত্র খোলা
      </SketchText>
      <path d="M 76 150 C 76 196, 224 196, 224 114" fill="none" stroke="var(--primary)" strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#close-tw-b)" />
      <Box x={36} y={150} w={80} h={26} text="দেরি করা Segment" size={7.5} />
      <SketchText x={150} y={214} size={8} body opacity={0.75}>
        পথে আটকে থাকা পুরনো Segment নতুনটায় ঢুকে পড়ত
      </SketchText>
    </>
  );
}

export function TimeWaitReasonsSplit() {
  return (
    <SketchSplit
      label="Diagram: TIME_WAIT না থাকলে যে দুইটা বিপদ হতো"
      caption="TIME_WAIT কোনো ভুল বা বাড়তি দেরি নয়, এটা দুইটা আসল বিপদ ঠেকায়। বাঁ দিকে প্রথমটা। ফোনের পাঠানো শেষ ACK টা পথে হারিয়ে গেলে Server উত্তর না পেয়ে FIN আবার পাঠায়। ফোন যদি ততক্ষণে Connection টা খাতা থেকে মুছে ফেলত, তাহলে এই FIN দেখে সে বলত এটা আবার কে, আর RST পাঠিয়ে দিত। TIME_WAIT এ দাঁড়িয়ে থাকে বলেই ফোন FIN টা চিনতে পারে আর ভদ্রভাবে আবার ACK দেয়। ডান দিকে দ্বিতীয়টা। পুরনো Connection এর কোনো Segment পথে কোথাও আটকে থেকে দেরিতে পৌঁছাতে পারে। এর মধ্যে ঠিক একই IP আর Port দিয়ে নতুন Connection খুলে গেলে পুরনো Segment টা নতুনটার তথ্যে মিশে যেত। TIME_WAIT ওই চার সংখ্যার জোড়াটাকে কিছুক্ষণ তালা মেরে রাখে, যতক্ষণ না পথের সব পুরনো Segment মরে যায়।"
      panels={[
        {
          title: "কারণ এক",
          sub: "শেষ ACK হারালে আবার দেওয়া",
          viewBox: "0 0 300 230",
          height: 230,
          children: <LostAck />,
        },
        {
          title: "কারণ দুই",
          sub: "পুরনো Segment যেন নতুনে না ঢোকে",
          viewBox: "0 0 300 230",
          height: 230,
          children: <LatePacket />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. FIN আর RST, ভদ্র বিদায় আর ফোন আছড়ে রাখা                                */
/* ------------------------------------------------------------------------- */

function PoliteClose() {
  const lx = 60;
  const rx = 240;
  const rows = [
    { y: 70, dir: "right", t: "FIN" },
    { y: 104, dir: "left", t: "ACK" },
    { y: 138, dir: "left", t: "FIN" },
    { y: 172, dir: "right", t: "ACK" },
  ];
  return (
    <>
      <Arrow id="close-fr-a" />
      <Box x={lx - 44} y={10} w={88} h={28} text="A" accent size={9} />
      <Box x={rx - 44} y={10} w={88} h={28} text="B" size={9} />
      <line x1={lx} y1={38} x2={lx} y2={196} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={38} x2={rx} y2={196} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      {rows.map((r) => (
        <g key={r.y}>
          <line
            x1={r.dir === "right" ? lx + 4 : rx - 4}
            y1={r.y}
            x2={r.dir === "right" ? rx - 6 : lx + 6}
            y2={r.y}
            stroke="var(--primary)"
            strokeWidth="1.4"
            markerEnd="url(#close-fr-a)"
          />
          <SketchText x={150} y={r.y - 6} size={9} bold accent>
            {r.t}
          </SketchText>
        </g>
      ))}
      <SketchText x={150} y={216} size={8} body opacity={0.75}>
        পথে থাকা সব তথ্য পৌঁছায়, কিছু হারায় না
      </SketchText>
    </>
  );
}

function AbruptClose() {
  const lx = 60;
  const rx = 240;
  return (
    <>
      <Arrow id="close-fr-b" />
      <Box x={lx - 44} y={10} w={88} h={28} text="A" accent size={9} />
      <Box x={rx - 44} y={10} w={88} h={28} text="B" size={9} />
      <line x1={lx} y1={38} x2={lx} y2={120} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={38} x2={rx} y2={120} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={lx + 4} y1={90} x2={rx - 6} y2={90} stroke="var(--primary)" strokeWidth="1.8" markerEnd="url(#close-fr-b)" />
      <SketchText x={150} y={82} size={10} bold accent>
        RST
      </SketchText>
      <SketchText x={lx} y={140} size={8.5} bold>
        CLOSED
      </SketchText>
      <SketchText x={rx} y={140} size={8.5} bold>
        CLOSED
      </SketchText>
      <SketchText x={150} y={166} size={8} body opacity={0.75}>
        উত্তর নেই, অপেক্ষা নেই, TIME_WAIT নেই
      </SketchText>
      <SketchText x={150} y={186} size={8} body opacity={0.75}>
        না পাঠানো আর না পড়া তথ্য ফেলে দেওয়া হয়
      </SketchText>
      <SketchText x={150} y={216} size={8} body accent>
        B এর Program দেখে ECONNRESET
      </SketchText>
    </>
  );
}

export function FinVsRstSplit() {
  return (
    <SketchSplit
      label="Diagram: FIN দিয়ে ভদ্র বিদায়, RST দিয়ে হঠাৎ কেটে দেওয়া"
      caption="একটা Connection দুইভাবে শেষ হতে পারে। বাঁ দিকে FIN দিয়ে ভদ্র বিদায়, যেখানে দুই পক্ষই আগে নিজের বাকি কথা শেষ করে, তারপর একে অপরকে জানিয়ে ফোন রাখে। এতে চারটা Segment লাগে, কিন্তু একটা Byte ও হারায় না। ডান দিকে RST, মানে Reset। এটা কথার মাঝখানে ফোন আছড়ে রেখে দেওয়ার মতো। একটাই Segment যায়, তার কোনো উত্তর লাগে না, আর দুই পাশই সাথে সাথে Connection টা খাতা থেকে মুছে ফেলে। যে তথ্য তখনো পাঠানো বাকি ছিল বা পৌঁছে গিয়েও পড়া হয়নি, সেটা ফেলে দেওয়া হয়। অন্য পাশের Program তখন একটা Error পায়, যার নাম ECONNRESET।"
      panels={[
        {
          title: "FIN",
          sub: "চার Segment, কিছু হারায় না",
          viewBox: "0 0 300 230",
          height: 230,
          children: <PoliteClose />,
        },
        {
          title: "RST",
          sub: "এক Segment, সব শেষ",
          viewBox: "0 0 300 230",
          height: 230,
          children: <AbruptClose />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Idle Timeout এর দৌড়, কে আগে Connection ফেলে                             */
/* ------------------------------------------------------------------------- */

export function IdleTimeoutRaceDiagram() {
  const x0 = 250;
  const scale = 7.2; // এক সেকেন্ড = 7.2 একক
  const lb = 60;
  const badApp = 5;
  const goodApp = 65;
  return (
    <Sketch
      label="Diagram: Load Balancer আর App, কে আগে চুপচাপ Connection ফেলে দেয়"
      height={330}
      minWidth={840}
      viewBox="0 0 840 330"
      caption="Load Balancer আর আপনার App এর মাঝে Connection গুলো বারবার ব্যবহারের জন্য খোলা রাখা হয়। কিন্তু দুই পক্ষেরই একটা করে Idle Timeout আছে, মানে কতক্ষণ চুপ থাকলে সে Connection টা বন্ধ করে দেবে। উপরের সারিতে App এর Timeout ৫ সেকেন্ড আর Load Balancer এর ৬০। App আগে বন্ধ করে, কিন্তু Load Balancer এখনো মনে করে Connection টা ভালো আছে। ঠিক সেই মুহূর্তে একজন পর্যটকের Request এলে Load Balancer সেটা মরা Connection এ পাঠায়, উত্তরে পায় RST, আর পর্যটক দেখেন 502। নিচের সারিতে App এর Timeout ৬৫ সেকেন্ড, Load Balancer এর চেয়ে বেশি। এবার সবসময় Load Balancer ই আগে বন্ধ করে, আর যে নিজে বন্ধ করেছে সে তো জানে ওটা বন্ধ। তাই ভুল Connection এ Request যাওয়ার সুযোগই থাকে না। নিয়মটা এক লাইনের: পেছনের জনের ধৈর্য সামনের জনের চেয়ে বেশি হতে হবে।"
    >
      <SketchText x={x0} y={34} size={9} anchor="start" opacity={0.55}>
        শেষ Request এর পর চুপচাপ কাটা সময়, সেকেন্ডে
      </SketchText>
      {[0, 15, 30, 45, 60, 75].map((t) => (
        <g key={t}>
          <line x1={x0 + t * scale} y1={44} x2={x0 + t * scale} y2={290} stroke="currentColor" strokeOpacity={0.12} />
          <SketchText x={x0 + t * scale} y={306} size={8.5} opacity={0.6}>
            {String(t)}
          </SketchText>
        </g>
      ))}

      {/* সারি ১, ভুল সাজানো */}
      <SketchText x={28} y={74} size={10} anchor="start" body bold accent>
        ভুল সাজানো
      </SketchText>
      <SketchText x={28} y={98} size={9} anchor="start" body opacity={0.8}>
        Load Balancer, ৬০ সেকেন্ড
      </SketchText>
      <rect x={x0} y={86} width={lb * scale} height={16} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeOpacity={0.45} />
      <SketchText x={28} y={126} size={9} anchor="start" body opacity={0.8}>
        App, ৫ সেকেন্ড
      </SketchText>
      <rect x={x0} y={114} width={badApp * scale} height={16} fill="var(--primary)" fillOpacity={0.25} stroke="var(--primary)" />
      <rect
        x={x0 + badApp * scale}
        y={84}
        width={(lb - badApp) * scale}
        height={48}
        fill="var(--destructive)"
        fillOpacity={0.08}
        stroke="var(--destructive)"
        strokeOpacity={0.6}
        strokeDasharray="4 3"
      />
      <SketchText x={x0 + ((lb + badApp) / 2) * scale} y={150} size={9} body>
        এই পুরো সময়টা বিপদের: App বন্ধ করে দিয়েছে, Load Balancer জানে না
      </SketchText>

      {/* সারি ২, ঠিক সাজানো */}
      <SketchText x={28} y={196} size={10} anchor="start" body bold accent>
        ঠিক সাজানো
      </SketchText>
      <SketchText x={28} y={220} size={9} anchor="start" body opacity={0.8}>
        Load Balancer, ৬০ সেকেন্ড
      </SketchText>
      <rect x={x0} y={208} width={lb * scale} height={16} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeOpacity={0.45} />
      <SketchText x={28} y={248} size={9} anchor="start" body opacity={0.8}>
        App, ৬৫ সেকেন্ড
      </SketchText>
      <rect x={x0} y={236} width={goodApp * scale} height={16} fill="var(--primary)" fillOpacity={0.25} stroke="var(--primary)" />
      <SketchText x={x0 + 30 * scale} y={274} size={9} body>
        Load Balancer নিজেই আগে বন্ধ করে, তাই মরা Connection এ কিছু পাঠায় না
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. পুরো Module, এক বুকিং এর গল্পে                                           */
/* ------------------------------------------------------------------------- */

const STORY = [
  { n: "০১", name: "OSI Model", gave: "সাত তলার মানচিত্র", detail: "কোন কাজ কোন তলার" },
  { n: "০২", name: "TCP/IP Model", gave: "আসল চার তলা", detail: "App, Kernel, NIC কে কোথায়" },
  { n: "০৩", name: "TCP Deep Dive", gave: "হারালে আবার পাঠানো", detail: "Sequence, ACK, Window" },
  { n: "০৪", name: "UDP Deep Dive", gave: "বুকিং এর আগে DNS প্রশ্ন", detail: "দ্রুত, কিন্তু নিশ্চয়তা নেই" },
  { n: "০৫", name: "Three-way Handshake", gave: "Connection খোলা", detail: "SYN, SYN-ACK, ACK" },
  { n: "০৬", name: "Packet, Segment, Frame", gave: "মোড়কের ভেতর মোড়ক", detail: "প্রতি Hop এ Frame নতুন" },
  { n: "০৭", name: "Port ও Socket", gave: "51514 থেকে 443", detail: "চার সংখ্যায় এক Connection" },
  { n: "০৮", name: "Connection Close", gave: "ভদ্র বিদায়", detail: "FIN, ACK, TIME_WAIT" },
];

export function ModuleStoryDiagram() {
  const w = 186;
  const h = 86;
  const gapX = 16;
  const gapY = 30;
  const startX = (840 - (4 * w + 3 * gapX)) / 2;
  return (
    <Sketch
      label="Diagram: আট লেসন, একটা বুকিং"
      height={300}
      minWidth={840}
      viewBox="0 0 840 300"
      caption="এই Module এর আটটা লেসন আটটা আলাদা বিষয় নয়, একটাই ঘটনার আটটা দিক। একজন পর্যটক Island Tours এ একটা আসন বুক করলেন, আর সেই একটা বুকিং এর পেছনে আটটা লেসনেরই কিছু না কিছু কাজ করেছে। প্রতিটা ঘরে লেখা আছে সেই লেসন বুকিংটাকে কী দিয়েছে। উপরের সারি থেকে নিচের সারিতে চোখ বুলালে পুরো গল্পটা একবারে মনে পড়ে যাবে। কাউকে শেখাতে গেলেও এই ছবিটাই সবচেয়ে ভালো শুরু।"
    >
      {STORY.map((s, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = startX + col * (w + gapX);
        const y = 28 + row * (h + gapY);
        const last = i === STORY.length - 1;
        return (
          <g key={s.n}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={last ? "var(--primary)" : "currentColor"}
              fillOpacity={last ? 0.1 : 0.04}
              stroke={last ? "var(--primary)" : "currentColor"}
              strokeOpacity={last ? 1 : 0.45}
              strokeWidth="1.3"
            />
            <SketchText x={x + 12} y={y + 20} size={9} anchor="start" opacity={0.6}>
              {`লেসন ${s.n}`}
            </SketchText>
            <SketchText x={x + 12} y={y + 40} size={10} anchor="start" bold accent={last}>
              {s.name}
            </SketchText>
            <SketchText x={x + 12} y={y + 59} size={9.5} anchor="start" body bold accent>
              {s.gave}
            </SketchText>
            <SketchText x={x + 12} y={y + 75} size={8.5} anchor="start" body opacity={0.7}>
              {s.detail}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={420} y={278} size={9} body accent>
        পরের Module এ এই পাকা রাস্তার উপর দিয়ে যে কথাটা যায়, সেই HTTP
      </SketchText>
    </Sketch>
  );
}
