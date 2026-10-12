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
  body,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  accent?: boolean;
  size?: number;
  body?: boolean;
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
      <SketchText x={x + w / 2} y={y + h / 2 + 4} size={size} bold accent={accent} body={body}>
        {text}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. একটা বিশাল Program, নাকি ভাগ করা কাজ                                      */
/* ------------------------------------------------------------------------- */

const ALL_JOBS = [
  "বুকিং এর তথ্য সাজানো",
  "তথ্য তালা মারা",
  "টুকরো করা, হারালে আবার পাঠানো",
  "পৃথিবীজুড়ে পথ খোঁজা",
  "পাশের যন্ত্রের MAC খোঁজা",
  "Wi-Fi এর তরঙ্গ বানানো",
];

function OneBlob() {
  return (
    <>
      <rect
        x={20}
        y={16}
        width={260}
        height={212}
        fill="currentColor"
        fillOpacity={0.04}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.3"
      />
      <SketchText x={150} y={38} size={9.5} bold>
        Booking App
      </SketchText>
      {ALL_JOBS.map((j, i) => (
        <SketchText key={j} x={36} y={64 + i * 26} size={9} anchor="start" body opacity={0.8}>
          {`• ${j}`}
        </SketchText>
      ))}
      <SketchText x={150} y={248} size={8.5} body opacity={0.7}>
        Wi-Fi বদলে Mobile Data হলে পুরো App নতুন করে লিখতে হবে
      </SketchText>
    </>
  );
}

const SPLIT_JOBS = [
  { who: "App", job: "বুকিং এর তথ্য সাজানো", accent: true },
  { who: "TLS", job: "তথ্য তালা মারা" },
  { who: "TCP", job: "টুকরো করা, আবার পাঠানো" },
  { who: "IP", job: "পৃথিবীজুড়ে পথ খোঁজা" },
  { who: "Wi-Fi", job: "পাশের যন্ত্র, তরঙ্গ" },
];

function ManyLayers() {
  return (
    <>
      {SPLIT_JOBS.map((s, i) => {
        const y = 16 + i * 43;
        return (
          <g key={s.who}>
            <rect
              x={20}
              y={y}
              width={260}
              height={36}
              fill={s.accent ? "var(--primary)" : "currentColor"}
              fillOpacity={s.accent ? 0.1 : 0.04}
              stroke={s.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={s.accent ? 1 : 0.45}
              strokeWidth="1.3"
            />
            <SketchText x={34} y={y + 22} size={9.5} anchor="start" bold accent={s.accent}>
              {s.who}
            </SketchText>
            <SketchText x={96} y={y + 22} size={9} anchor="start" body opacity={0.8}>
              {s.job}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={150} y={248} size={8.5} body accent>
        নিচের তলা বদলালে উপরের কেউ টেরই পায় না
      </SketchText>
    </>
  );
}

export function WhyLayersSplit() {
  return (
    <SketchSplit
      label="Diagram: সব কাজ এক জায়গায়, নাকি তলায় তলায় ভাগ"
      caption="বাঁ দিকে এমন একটা দুনিয়া যেখানে Layer বলে কিছু নেই। Booking App কে একা সব জানতে হয়, বুকিং এর তথ্য কীভাবে সাজাবে থেকে শুরু করে Wi-Fi এর তরঙ্গ কীভাবে বানাবে পর্যন্ত। এই দুনিয়ায় ফোন Wi-Fi ছেড়ে Mobile Data ধরলেই App টা অচল, কারণ তরঙ্গ বানানোর নিয়ম বদলে গেছে। ডান দিকে আসল দুনিয়া। কাজটা তলায় তলায় ভাগ করা, প্রতিটা তলা শুধু নিজের একটা কাজ জানে আর ঠিক নিচের তলাকে বলে, এটা পৌঁছে দিন। এতে লাভ দুইটা। App লেখককে Network এর কিছুই জানতে হয় না, আর নিচের যেকোনো তলা বদলে ফেলা যায় উপরের কাউকে না ছুঁয়ে। OSI Model হলো এই তলাগুলোর একটা মানচিত্র।"
      panels={[
        {
          title: "Layer ছাড়া",
          sub: "একজনকে সব জানতে হয়",
          viewBox: "0 0 300 260",
          height: 260,
          children: <OneBlob />,
        },
        {
          title: "Layer সহ",
          sub: "প্রত্যেকের একটাই কাজ",
          viewBox: "0 0 300 260",
          height: 260,
          children: <ManyLayers />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 2. সাত তলা, এক নজরে                                                         */
/* ------------------------------------------------------------------------- */

const LAYERS = [
  { n: 7, name: "Application", job: "Program যে ভাষায় সেবা চায় আর পায়", unit: "Data", addr: "নাম, URL", ex: "HTTP, DNS, SMTP, SSH" },
  { n: 6, name: "Presentation", job: "Data এর রূপ: Encoding, Compression, Encryption", unit: "Data", addr: "নেই", ex: "TLS, UTF-8, JPEG, gzip" },
  { n: 5, name: "Session", job: "একটা আলাপ খোলা, চালু রাখা, বন্ধ করা", unit: "Data", addr: "নেই", ex: "TLS Session, RPC, SOCKS" },
  { n: 4, name: "Transport", job: "যন্ত্রের ভেতরের ঠিক Program পর্যন্ত পৌঁছানো", unit: "Segment, Datagram", addr: "Port", ex: "TCP, UDP" },
  { n: 3, name: "Network", job: "এক Network থেকে আরেক Network এ পথ খোঁজা", unit: "Packet", addr: "IP Address", ex: "IP, ICMP" },
  { n: 2, name: "Data Link", job: "একই Network এর পাশের যন্ত্র পর্যন্ত পৌঁছানো", unit: "Frame", addr: "MAC Address", ex: "Ethernet, Wi-Fi, ARP" },
  { n: 1, name: "Physical", job: "Bit কে সংকেত বানিয়ে তার বা বাতাসে ছাড়া", unit: "Bit", addr: "নেই", ex: "তামার তার, Fiber, Radio" },
];

export function OsiStackDiagram() {
  const rowH = 44;
  const top = 56;
  const h = top + LAYERS.length * rowH + 40;
  return (
    <Sketch
      label="Diagram: OSI Model এর সাত Layer"
      height={h}
      minWidth={940}
      viewBox={`0 0 940 ${h}`}
      caption="এই ছকটাই পুরো লেসনের মানচিত্র, তাই একবার ধীরে পড়ে নিন। সংখ্যা নিচ থেকে উপরে বাড়ে, Layer 1 সবচেয়ে নিচে আর Layer 7 সবচেয়ে উপরে, তাই ছবিতে 7 উপরে আঁকা। প্রতিটা সারিতে চারটা প্রশ্নের উত্তর আছে। এই তলার কাজ কী, এই তলায় তথ্যের টুকরোকে কী নামে ডাকা হয়, এই তলা কোন ঠিকানা দিয়ে গন্তব্য চেনে, আর কোন চেনা Protocol এখানে কাজ করে। খেয়াল করুন রং করা তিনটা সারি। Layer 2, 3 আর 4 এর প্রত্যেকের নিজের একটা ঠিকানা আছে, MAC, IP আর Port, আর এই তিনটাই আপনি আগের Module গুলোতে আলাদা আলাদা করে শিখে এসেছেন। আজ শুধু তাদের এক সারিতে বসানো হচ্ছে।"
    >
      <SketchText x={40} y={38} size={9} anchor="start" opacity={0.55}>
        Layer
      </SketchText>
      <SketchText x={196} y={38} size={9} anchor="start" opacity={0.55}>
        কাজ
      </SketchText>
      <SketchText x={520} y={38} size={9} anchor="start" opacity={0.55}>
        টুকরোর নাম
      </SketchText>
      <SketchText x={650} y={38} size={9} anchor="start" opacity={0.55}>
        ঠিকানা
      </SketchText>
      <SketchText x={760} y={38} size={9} anchor="start" opacity={0.55}>
        চেনা উদাহরণ
      </SketchText>
      {LAYERS.map((l, i) => {
        const y = top + i * rowH;
        const hasAddr = l.n >= 2 && l.n <= 4;
        return (
          <g key={l.n}>
            <rect
              x={24}
              y={y}
              width={892}
              height={rowH - 8}
              fill={hasAddr ? "var(--primary)" : "currentColor"}
              fillOpacity={hasAddr ? 0.07 : 0.03}
              stroke={hasAddr ? "var(--primary)" : "currentColor"}
              strokeOpacity={hasAddr ? 0.7 : 0.25}
              strokeWidth="1"
            />
            <SketchText x={40} y={y + 23} size={12} anchor="start" bold accent>
              {String(l.n)}
            </SketchText>
            <SketchText x={64} y={y + 23} size={10.5} anchor="start" bold>
              {l.name}
            </SketchText>
            <SketchText x={196} y={y + 23} size={9.5} anchor="start" body opacity={0.85}>
              {l.job}
            </SketchText>
            <SketchText x={520} y={y + 23} size={9.5} anchor="start" bold>
              {l.unit}
            </SketchText>
            <SketchText x={650} y={y + 23} size={9.5} anchor="start" bold accent={hasAddr} opacity={hasAddr ? 1 : 0.5}>
              {l.addr}
            </SketchText>
            <SketchText x={760} y={y + 23} size={9} anchor="start" opacity={0.75}>
              {l.ex}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={470} y={h - 14} size={9} body accent>
        উপরের তিন তলা Program এর ভেতরে, নিচের চার তলা Kernel, Driver আর যন্ত্রাংশে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. পাশাপাশি কথা, আসলে উপর নিচে যাওয়া                                        */
/* ------------------------------------------------------------------------- */

const NAMES = ["Application", "Presentation", "Session", "Transport", "Network", "Data Link", "Physical"];

export function PeerTalkDiagram() {
  const boxH = 30;
  const gap = 8;
  const top = 56;
  const lx = 90;
  const rx = 610;
  const w = 160;
  const bottom = top + NAMES.length * (boxH + gap);
  return (
    <Sketch
      label="Diagram: প্রতিটা Layer ভাবে সে ওপাশের একই Layer এর সাথে কথা বলছে"
      height={bottom + 70}
      minWidth={860}
      viewBox={`0 0 860 ${bottom + 70}`}
      caption="বাঁ দিকে পর্যটকের ফোন, ডান দিকে Island Tours এর Server, দুই যন্ত্রেই একই সাত তলা। ছবিতে দুই রকম রেখা আছে আর এই দুইয়ের তফাতটাই Layer এর মূল কথা। ফোঁটা ফোঁটা আনুভূমিক রেখাগুলো হলো প্রতিটা তলার ধারণা। ফোনের Transport Layer মনে করে সে সোজা Server এর Transport Layer এর সাথে কথা বলছে, আর দুজন একই ভাষা বোঝে, যেমন TCP। কিন্তু বাস্তবে কোনো তলাই সরাসরি ওপাশে পৌঁছাতে পারে না, একমাত্র সবচেয়ে নিচের তলা ছাড়া। আসল পথটা মোটা রেখায় আঁকা। তথ্য ফোনে উপর থেকে নিচে নামে, তার বা বাতাস দিয়ে ওপাশে যায়, তারপর Server এ নিচ থেকে উপরে ওঠে। প্রতিটা তলা নিচের তলার হাতে কাজ তুলে দিয়ে ধরে নেয়, বাকিটা সে সামলাবে।"
    >
      <Arrow id="osi-peer-a" />
      <SketchText x={lx + w / 2} y={38} size={10} bold accent>
        পর্যটকের ফোন
      </SketchText>
      <SketchText x={rx + w / 2} y={38} size={10} bold accent>
        Island Tours Server
      </SketchText>
      {NAMES.map((n, i) => {
        const y = top + i * (boxH + gap);
        return (
          <g key={n}>
            <Box x={lx} y={y} w={w} h={boxH} text={`${7 - i}  ${n}`} size={9} />
            <Box x={rx} y={y} w={w} h={boxH} text={`${7 - i}  ${n}`} size={9} />
            <line
              x1={lx + w + 6}
              y1={y + boxH / 2}
              x2={rx - 6}
              y2={y + boxH / 2}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          </g>
        );
      })}
      <SketchText x={430} y={top + 3 * (boxH + gap) + 12} size={9} body opacity={0.8}>
        ধারণা: একই তলা, একই ভাষা (যেমন TCP)
      </SketchText>
      <SketchText x={430} y={top + 0 * (boxH + gap) + 12} size={9} body opacity={0.8}>
        ধারণা: একই ভাষা (যেমন HTTP)
      </SketchText>
      <path
        d={`M ${lx - 26} ${top + 6} L ${lx - 26} ${bottom + 20} L ${rx + w + 26} ${bottom + 20} L ${rx + w + 26} ${top + 8}`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.8"
        markerEnd="url(#osi-peer-a)"
      />
      <SketchText x={lx - 38} y={top + 130} size={9} body accent anchor="end">
        নামে
      </SketchText>
      <SketchText x={rx + w + 38} y={top + 130} size={9} body accent anchor="start">
        ওঠে
      </SketchText>
      <SketchText x={430} y={bottom + 40} size={9.5} body accent>
        আসল পথ: তার, Wi-Fi, Fiber, মাঝের সব Router
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. মোড়কের ভেতর মোড়ক, শুধু এক ঝলক                                           */
/* ------------------------------------------------------------------------- */

const WRAPS = [
  { layer: "Layer 7 থেকে 5", name: "Data", parts: [{ t: "বুকিং এর তথ্য", w: 200, data: true }] },
  {
    layer: "Layer 4",
    name: "Segment",
    parts: [
      { t: "Port", w: 80 },
      { t: "বুকিং এর তথ্য", w: 200, data: true },
    ],
  },
  {
    layer: "Layer 3",
    name: "Packet",
    parts: [
      { t: "IP", w: 80 },
      { t: "Port", w: 80 },
      { t: "বুকিং এর তথ্য", w: 200, data: true },
    ],
  },
  {
    layer: "Layer 2",
    name: "Frame",
    parts: [
      { t: "MAC", w: 80 },
      { t: "IP", w: 80 },
      { t: "Port", w: 80 },
      { t: "বুকিং এর তথ্য", w: 200, data: true },
      { t: "যাচাই", w: 60 },
    ],
  },
];

export function WrapPreviewDiagram() {
  const rowH = 52;
  const top = 30;
  const right = 760;
  const h = top + WRAPS.length * rowH + 44;
  return (
    <Sketch
      label="Diagram: নামার পথে প্রতিটা তলা নিজের একটা মোড়ক পরায়"
      height={h}
      minWidth={840}
      viewBox={`0 0 840 ${h}`}
      caption="তথ্য যখন উপর থেকে নিচে নামে, প্রতিটা তলা সেটাকে না খুলে তার সামনে নিজের দরকারি তথ্যটুকু জুড়ে দেয়, যাকে বলে Header। Layer 4 জোড়ে Port, যাতে ওপাশে ঠিক Program টা খুঁজে পাওয়া যায়। Layer 3 জোড়ে IP Address, যাতে পৃথিবীজুড়ে পথ খোঁজা যায়। Layer 2 জোড়ে MAC Address, যাতে পাশের যন্ত্রটা পর্যন্ত পৌঁছানো যায়, আর শেষে একটা যাচাইয়ের সংখ্যা। রং করা অংশটা, মানে আসল বুকিং এর তথ্য, পুরো পথে একই থাকে, শুধু তার চারপাশের মোড়ক বাড়ে। মোড়কের সাথে সাথে নামও বদলায়, Data থেকে Segment, Packet, তারপর Frame। এই মোড়ক পরানোকে বলে Encapsulation। এখানে শুধু ধারণাটা রাখুন, প্রতিটা মোড়কে ঠিক কত Byte আর পথে কোনটা বদলায়, তা নিয়ে এই Module এ একটা আস্ত লেসন আছে।"
    >
      {WRAPS.map((r, i) => {
        const y = top + i * rowH;
        const total = r.parts.reduce((s, p) => s + p.w, 0);
        const hasTrailer = r.parts[r.parts.length - 1].t === "যাচাই";
        const start = right - total - (hasTrailer ? 0 : 60);
        const offsets = r.parts.map((_, k) => start + r.parts.slice(0, k).reduce((sum, q) => sum + q.w, 0));
        return (
          <g key={r.name}>
            <SketchText x={30} y={y + 18} size={9} anchor="start" opacity={0.6}>
              {r.layer}
            </SketchText>
            <SketchText x={30} y={y + 33} size={10.5} anchor="start" bold accent>
              {r.name}
            </SketchText>
            {r.parts.map((p, k) => {
              const px = offsets[k];
              return (
                <g key={p.t}>
                  <rect
                    x={px}
                    y={y + 6}
                    width={p.w}
                    height={32}
                    fill={p.data ? "var(--primary)" : "currentColor"}
                    fillOpacity={p.data ? 0.12 : 0.04}
                    stroke={p.data ? "var(--primary)" : "currentColor"}
                    strokeOpacity={p.data ? 1 : 0.45}
                    strokeWidth="1.2"
                  />
                  <SketchText x={px + p.w / 2} y={y + 26} size={9} bold={!p.data} body={p.data} accent={p.data}>
                    {p.t}
                  </SketchText>
                </g>
              );
            })}
          </g>
        );
      })}
      <SketchText x={420} y={h - 14} size={9} body opacity={0.75}>
        ওপাশে ঠিক উল্টো ক্রমে একটা একটা করে মোড়ক খোলা হয়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. কোন যন্ত্র কত তলা পর্যন্ত পড়ে                                             */
/* ------------------------------------------------------------------------- */

const DEVICES = [
  { name: "তার, Hub", top: 1, note: "শুধু সংকেত" },
  { name: "Switch", top: 2, note: "MAC পড়ে" },
  { name: "Router", top: 3, note: "IP পড়ে" },
  { name: "Firewall", top: 4, note: "IP আর Port" },
  { name: "L4 Load Balancer", top: 4, note: "IP আর Port" },
  { name: "L7 Load Balancer", top: 7, note: "URL, Header" },
  { name: "ফোন, Server", top: 7, note: "সব তলা" },
];

export function DeviceLayerDiagram() {
  const colW = 104;
  const left = 92;
  const cellH = 30;
  const top = 34;
  const base = top + 7 * cellH;
  return (
    <Sketch
      label="Diagram: কোন যন্ত্র মোড়কের কত তলা পর্যন্ত খুলে পড়ে"
      height={base + 78}
      minWidth={880}
      viewBox={`0 0 880 ${base + 78}`}
      caption="একটা যন্ত্র কোন Layer এর, কথাটার মানে হলো সে মোড়কের সর্বোচ্চ কত তলা পর্যন্ত খুলে পড়ে সিদ্ধান্ত নেয়। প্রতিটা স্তম্ভ নিচ থেকে সেই তলা পর্যন্ত উঠেছে। Hub শুধু সংকেত নকল করে, কিছুই পড়ে না, তাই Layer 1। Switch Frame খুলে MAC Address পড়ে, তাই Layer 2। Router তার উপরে Packet খুলে IP Address পড়ে, তাই Layer 3। সাধারণ Firewall আর Cloud এর Security Group IP এর সাথে Port ও দেখে, তাই Layer 4 পর্যন্ত। L7 Load Balancer, Reverse Proxy আর WAF একদম উপরের তথ্য পর্যন্ত পড়ে, মানে কোন URL, কোন Header। খেয়াল করুন, যে যন্ত্র যত উপরে পড়ে সে নিচের সব তলাও বোঝে। আর মাঝপথের বেশিরভাগ যন্ত্র Layer 3 এর উপরে তাকায়ই না, পুরো সাত তলা থাকে শুধু দুই প্রান্তের যন্ত্রে।"
    >
      {[7, 6, 5, 4, 3, 2, 1].map((n, i) => (
        <g key={n}>
          <line
            x1={left - 10}
            y1={top + i * cellH}
            x2={left + DEVICES.length * colW}
            y2={top + i * cellH}
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth="1"
          />
          <SketchText x={left - 20} y={top + i * cellH + 20} size={10} anchor="end" bold opacity={0.7}>
            {`L${n}`}
          </SketchText>
        </g>
      ))}
      <line x1={left - 10} y1={base} x2={left + DEVICES.length * colW} y2={base} stroke="currentColor" strokeOpacity={0.4} strokeWidth="1.2" />
      {DEVICES.map((d, i) => {
        const x = left + i * colW + 14;
        const y = base - d.top * cellH;
        const full = d.top === 7;
        return (
          <g key={d.name}>
            <rect
              x={x}
              y={y + 3}
              width={colW - 28}
              height={d.top * cellH - 3}
              fill={full ? "var(--primary)" : "currentColor"}
              fillOpacity={full ? 0.12 : 0.07}
              stroke={full ? "var(--primary)" : "currentColor"}
              strokeOpacity={full ? 1 : 0.5}
              strokeWidth="1.3"
            />
            <SketchText x={x + (colW - 28) / 2} y={y + 22} size={10} bold accent={full}>
              {`L${d.top}`}
            </SketchText>
            <SketchText x={x + (colW - 28) / 2} y={base + 20} size={8.5} bold>
              {d.name}
            </SketchText>
            <SketchText x={x + (colW - 28) / 2} y={base + 36} size={8.5} body opacity={0.7}>
              {d.note}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={440} y={base + 62} size={9} body accent>
        যত উপরে পড়ে তত বেশি বোঝে, আর তত বেশি সময় আর খরচ লাগে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. L4 আর L7 Load Balancer                                                    */
/* ------------------------------------------------------------------------- */

function LbPanel({
  id,
  sees,
  hidden,
  routes,
}: {
  id: string;
  sees: string[];
  hidden: string[];
  routes: { rule: string; to: string }[];
}) {
  return (
    <>
      <Arrow id={id} />
      <SketchText x={20} y={22} size={8.5} anchor="start" opacity={0.6}>
        যা দেখতে পায়
      </SketchText>
      {sees.map((s, i) => (
        <SketchText key={s} x={20} y={42 + i * 17} size={9} anchor="start" bold accent>
          {s}
        </SketchText>
      ))}
      <SketchText x={170} y={22} size={8.5} anchor="start" opacity={0.6}>
        যা দেখতে পায় না
      </SketchText>
      {hidden.map((s, i) => (
        <SketchText key={s} x={170} y={42 + i * 17} size={9} anchor="start" body opacity={0.6}>
          {s}
        </SketchText>
      ))}
      <Box x={90} y={118} w={120} h={30} text="Load Balancer" accent size={9} />
      {routes.map((r, i) => {
        const x = 20 + i * 140;
        return (
          <g key={r.to}>
            <line
              x1={150}
              y1={148}
              x2={x + 60}
              y2={196}
              stroke="var(--primary)"
              strokeWidth="1.3"
              markerEnd={`url(#${id})`}
            />
            <Box x={x} y={198} w={120} h={30} text={r.to} size={8.5} />
            <SketchText x={x + 60} y={244} size={8.5} body opacity={0.8}>
              {r.rule}
            </SketchText>
          </g>
        );
      })}
    </>
  );
}

export function LbLayerSplit() {
  return (
    <SketchSplit
      label="Diagram: L4 Load Balancer আর L7 Load Balancer এর তফাত"
      caption="Cloud এর Dashboard এ Load Balancer বানাতে গেলে প্রথম প্রশ্নটাই হয়, Layer 4 নাকি Layer 7। সংখ্যা দুইটা OSI Model থেকেই এসেছে, আর মানেটা সোজা, যন্ত্রটা মোড়কের কত তলা পর্যন্ত খুলে পড়বে। বাঁ দিকের L4 Load Balancer শুধু Transport Layer পর্যন্ত পড়ে। সে দেখে কোন IP থেকে কোন Port এ সংযোগ এলো, আর সেই দেখেই পুরো সংযোগটা একটা Server এ পাঠিয়ে দেয়। ভেতরের তথ্য সে খোলে না, তাই সে দ্রুত আর যেকোনো TCP বা UDP সেবার জন্য চলে, কিন্তু কোন পাতা চাওয়া হয়েছে তা জানে না। ডান দিকের L7 Load Balancer একদম Application Layer পর্যন্ত পড়ে। সে জানে কোন Host, কোন Path, কোন Cookie, তাই একই ঠিকানায় আসা Request কে ভেতরের বিষয় দেখে আলাদা Server এ পাঠাতে পারে। তার দাম হলো বেশি কাজ, আর HTTPS এর তালা তাকেই খুলতে হয়।"
      panels={[
        {
          title: "Layer 4",
          sub: "IP আর Port দেখে",
          viewBox: "0 0 300 256",
          height: 256,
          children: (
            <LbPanel
              id="osi-lb-a"
              sees={["Source IP", "Destination IP", "Port 443", "TCP না UDP"]}
              hidden={["কোন Host", "কোন Path", "কোন Cookie", "Header"]}
              routes={[
                { rule: "পালা করে", to: "Server A" },
                { rule: "পালা করে", to: "Server B" },
              ]}
            />
          ),
        },
        {
          title: "Layer 7",
          sub: "Request এর ভেতরটা পড়ে",
          viewBox: "0 0 300 256",
          height: 256,
          children: (
            <LbPanel
              id="osi-lb-b"
              sees={["IP আর Port", "Host", "Path", "Cookie, Header"]}
              hidden={["কিছুই লুকানো নয়", "তালা সে নিজে খোলে"]}
              routes={[
                { rule: "/api দিয়ে শুরু হলে", to: "API Server" },
                { rule: "/images হলে", to: "Image Server" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
