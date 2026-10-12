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
  sub,
  accent,
  size = 9.5,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  sub?: string;
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
      <SketchText
        x={x + w / 2}
        y={sub ? y + h / 2 - 2 : y + h / 2 + 4}
        size={size}
        bold
        accent={accent}
      >
        {text}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 13} size={8} body opacity={0.7}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. UDP Header, আট Byte, চারটা ঘর                                            */
/* ------------------------------------------------------------------------- */

const UDP_FIELDS = [
  { name: "Source Port", sub: "51514", note: "উত্তর কোন ফ্ল্যাটে ফিরবে" },
  { name: "Destination Port", sub: "53", note: "কোন ফ্ল্যাটে যাবে" },
  { name: "Length", sub: "Header + Data", note: "পুরো Datagram কত Byte" },
  { name: "Checksum", sub: "ভাঙা কি না", note: "পথে Bit উল্টেছে কি না" },
];

const TCP_ONLY = [
  "Sequence Number",
  "Acknowledgment Number",
  "Flags (SYN, ACK, FIN, RST)",
  "Window Size",
  "Options (MSS, SACK)",
];

export function UdpHeaderDiagram() {
  const w = 150;
  const startX = 40;
  return (
    <Sketch
      label="Diagram: UDP Header এর চারটা ঘর, আর TCP তে যা বাড়তি ছিল"
      height={330}
      minWidth={840}
      viewBox="0 0 840 330"
      caption="উপরের সারিটাই পুরো UDP Header। চারটা ঘর, প্রতিটা ২ Byte, মোট ৮ Byte। প্রথম দুই ঘর Port, যা আপনি OS Networking এর লেসন থেকে ফ্ল্যাটের নম্বর হিসেবে চেনেন। তৃতীয় ঘর বলে পুরো Datagram কত বড়। চতুর্থ ঘর একটা Checksum, যা দিয়ে গ্রহীতা বোঝে পথে কোনো Bit উল্টে গেছে কি না। এর পরেই আপনার Data। নিচের সারিতে সেই ঘরগুলো যা আগের লেসনে TCP Header এ দেখেছেন আর UDP তে একেবারেই নেই। Sequence Number নেই, তাই ক্রম ঠিক করার উপায় নেই। Acknowledgment নেই, তাই পৌঁছাল কি না জানার উপায় নেই। Window নেই, তাই গতি কমাতে বলার উপায় নেই। UDP এর সব আচরণ এই না থাকা ঘরগুলো থেকেই আসে।"
    >
      <SketchText x={startX} y={30} size={9} anchor="start" opacity={0.6}>
        UDP Header, মোট ৮ Byte
      </SketchText>
      {UDP_FIELDS.map((f, i) => {
        const x = startX + i * w;
        return (
          <g key={f.name}>
            <Box x={x} y={42} w={w} h={50} text={f.name} sub={f.sub} accent />
            <SketchText x={x + w / 2} y={110} size={8.5} body opacity={0.75}>
              {f.note}
            </SketchText>
            <SketchText x={x + w / 2} y={126} size={8} opacity={0.5}>
              ২ Byte
            </SketchText>
          </g>
        );
      })}
      <Box x={startX + 4 * w} y={42} w={160} h={50} text="Data" sub="আপনার বার্তা" />
      <SketchText x={startX + 4 * w + 80} y={110} size={8.5} body opacity={0.75}>
        Application যা পাঠাল
      </SketchText>

      <line x1={40} y1={150} x2={800} y2={150} stroke="currentColor" strokeOpacity={0.2} strokeDasharray="4 4" />

      <SketchText x={startX} y={178} size={9} anchor="start" opacity={0.6}>
        TCP Header এ ছিল (কমপক্ষে ২০ Byte), UDP তে নেই
      </SketchText>
      {TCP_ONLY.map((t, i) => {
        const bw = 148;
        const x = startX + i * (bw + 5);
        return (
          <g key={t}>
            <rect
              x={x}
              y={192}
              width={bw}
              height={40}
              fill="transparent"
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
            <SketchText x={x + bw / 2} y={216} size={8} opacity={0.6}>
              {t}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={420} y={266} size={9.5} body accent>
        ঘর নেই মানে কাজটাও নেই: ক্রম, প্রাপ্তি স্বীকার, আবার পাঠানো, গতি নিয়ন্ত্রণ
      </SketchText>
      <SketchText x={420} y={288} size={9} body opacity={0.7}>
        এগুলো দরকার হলে আপনার Application কে নিজে বানিয়ে নিতে হবে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. TCP এর আলাপ আর UDP এর পোস্টকার্ড                                         */
/* ------------------------------------------------------------------------- */

function Lifelines({ bottom }: { bottom: number }) {
  return (
    <>
      <Box x={20} y={10} w={80} h={28} text="Client" size={9} />
      <Box x={200} y={10} w={80} h={28} text="Server" size={9} />
      <line x1={60} y1={38} x2={60} y2={bottom} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3 3" />
      <line x1={240} y1={38} x2={240} y2={bottom} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3 3" />
    </>
  );
}

function Msg({
  y,
  text,
  toRight,
  marker,
  strong,
}: {
  y: number;
  text: string;
  toRight: boolean;
  marker: string;
  strong?: boolean;
}) {
  return (
    <g>
      <line
        x1={toRight ? 64 : 236}
        y1={y}
        x2={toRight ? 236 : 64}
        y2={y + 8}
        stroke={strong ? "var(--primary)" : "currentColor"}
        strokeOpacity={strong ? 1 : 0.55}
        strokeWidth="1.3"
        markerEnd={strong ? `url(#${marker})` : undefined}
      />
      <SketchText x={150} y={y - 3} size={8} bold={strong} accent={strong} opacity={strong ? 1 : 0.65}>
        {text}
      </SketchText>
    </g>
  );
}

function TcpTalk() {
  const rows = [
    { t: "SYN", r: true },
    { t: "SYN-ACK", r: false },
    { t: "ACK", r: true },
    { t: "Data", r: true, s: true },
    { t: "ACK", r: false },
    { t: "FIN", r: true },
    { t: "ACK, FIN", r: false },
    { t: "ACK", r: true },
  ];
  return (
    <>
      <Arrow id="udp-talk-a" />
      <Lifelines bottom={290} />
      {rows.map((r, i) => (
        <Msg key={i} y={62 + i * 28} text={r.t} toRight={r.r} marker="udp-talk-a" strong={r.s} />
      ))}
      <SketchText x={150} y={306} size={8.5} body opacity={0.75}>
        একটা বার্তার জন্য আটটা যাওয়া আসা
      </SketchText>
    </>
  );
}

function UdpCard() {
  return (
    <>
      <Arrow id="udp-talk-b" />
      <Lifelines bottom={290} />
      <Msg y={62} text="Data" toRight marker="udp-talk-b" strong />
      <SketchText x={150} y={130} size={8.5} body opacity={0.75}>
        ব্যস, এটুকুই
      </SketchText>
      <SketchText x={150} y={170} size={8.5} body opacity={0.6}>
        আগে কোনো পরিচয় পর্ব নেই
      </SketchText>
      <SketchText x={150} y={188} size={8.5} body opacity={0.6}>
        পরে কোনো প্রাপ্তি স্বীকার নেই
      </SketchText>
      <SketchText x={150} y={206} size={8.5} body opacity={0.6}>
        শেষে কোনো বিদায় নেই
      </SketchText>
      <SketchText x={150} y={306} size={8.5} body accent>
        একটা বার্তার জন্য একটাই Datagram
      </SketchText>
    </>
  );
}

export function TalkVsPostcardSplit() {
  return (
    <SketchSplit
      label="Diagram: একই বার্তা, TCP দিয়ে আর UDP দিয়ে"
      caption="বাঁ দিকে TCP। আসল কথাটা (Data) পাঠানোর আগে তিনটা বার্তায় পরিচয় পর্ব সারতে হয়, যাকে বলে Handshake, আর যা নিয়ে পরের লেসন। Data পৌঁছালে ওপাশ থেকে ACK আসে। কথা শেষে আবার FIN দিয়ে ভদ্রভাবে বিদায়। এক লাইনের একটা প্রশ্নের জন্যও এই পুরো আনুষ্ঠানিকতা। ডান দিকে UDP। কোনো পরিচয় নেই, কোনো বিদায় নেই, শুধু বার্তাটা ছুড়ে দেওয়া। পৌঁছাল কি না UDP জানে না, জানার চেষ্টাও করে না। ছোট একটা প্রশ্ন আর ছোট একটা উত্তরের কাজে, যেমন DNS, এই তফাতটাই সবকিছু।"
      panels={[
        {
          title: "TCP",
          sub: "ফোনে আলাপ",
          viewBox: "0 0 300 320",
          height: 320,
          children: <TcpTalk />,
        },
        {
          title: "UDP",
          sub: "ডাকবাক্সে পোস্টকার্ড",
          viewBox: "0 0 300 320",
          height: 320,
          children: <UdpCard />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. TCP যা দেয়, UDP তে সেটা কার কাজ                                         */
/* ------------------------------------------------------------------------- */

const JOBS = [
  { job: "পাঠানোর আগে পরিচয় (Connection)", tcp: "Handshake", udp: "নেই, সোজা পাঠায়" },
  { job: "পৌঁছাল কি না জানা", tcp: "ACK", udp: "নিজে উত্তরের অপেক্ষা করুন" },
  { job: "হারালে আবার পাঠানো", tcp: "Retransmission", udp: "নিজে Timeout আর Retry" },
  { job: "ক্রম ঠিক রাখা", tcp: "Sequence Number", udp: "নিজে নম্বর বসান" },
  { job: "একই জিনিস দুইবার এলে ফেলা", tcp: "Sequence Number", udp: "নিজে ID মিলিয়ে দেখুন" },
  { job: "গ্রহীতা হাঁপিয়ে গেলে থামা", tcp: "Flow Control", udp: "নেই, বাড়তিটা ফেলে দেওয়া হয়" },
  { job: "রাস্তায় জ্যাম হলে ধীরে চলা", tcp: "Congestion Control", udp: "নিজে গতি বেঁধে দিন" },
  { job: "বার্তার সীমানা মনে রাখা", tcp: "নেই, Byte Stream", udp: "আছে, এক Datagram এক বার্তা" },
];

export function WhoDoesTheJobDiagram() {
  const rowH = 36;
  const top = 54;
  const h = top + JOBS.length * rowH + 14;
  return (
    <Sketch
      label="Diagram: TCP যা নিজে করত, UDP তে সেটা কার কাজ"
      height={h}
      minWidth={840}
      viewBox={`0 0 840 ${h}`}
      caption="আগের লেসনে TCP এর যত গুণ শিখেছেন, বাঁ দিকের ঘরে সেগুলোই। মাঝের ঘরে TCP কোন কৌশলে কাজটা করত। ডান দিকে UDP তে সেই কাজের কী হয়। প্রায় প্রতিটা সারিতে উত্তর একটাই, কাজটা UDP করে না, দরকার হলে আপনার Application কে করতে হবে। শুধু শেষ সারিটা উল্টো। TCP বার্তার সীমানা ভুলে যায়, UDP মনে রাখে। এই ছকটা মাথায় থাকলে UDP কখন নেবেন সেই প্রশ্নটা সহজ হয়ে যায়: এই কাজগুলোর কয়টা আপনার সত্যিই দরকার, আর কয়টা আপনি নিজে আরও ভালোভাবে করতে পারবেন।"
    >
      <SketchText x={40} y={38} size={9} anchor="start" opacity={0.55}>
        কাজ
      </SketchText>
      <SketchText x={370} y={38} size={9} anchor="start" opacity={0.55}>
        TCP তে
      </SketchText>
      <SketchText x={560} y={38} size={9} anchor="start" opacity={0.55}>
        UDP তে
      </SketchText>
      {JOBS.map((r, i) => {
        const y = top + i * rowH;
        const last = i === JOBS.length - 1;
        return (
          <g key={r.job}>
            <rect
              x={24}
              y={y}
              width={792}
              height={rowH - 8}
              fill={last ? "var(--primary)" : i % 2 === 0 ? "currentColor" : "transparent"}
              fillOpacity={last ? 0.08 : 0.03}
              stroke={last ? "var(--primary)" : "currentColor"}
              strokeOpacity={last ? 0.8 : 0.25}
              strokeWidth="1"
            />
            <SketchText x={40} y={y + 19} size={9.5} anchor="start" body bold>
              {r.job}
            </SketchText>
            <SketchText x={370} y={y + 19} size={9} anchor="start" opacity={0.8}>
              {r.tcp}
            </SketchText>
            <SketchText x={560} y={y + 19} size={9.5} anchor="start" body bold accent>
              {r.udp}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. DNS: আগে UDP, উত্তর না আঁটলে TCP                                          */
/* ------------------------------------------------------------------------- */

const DNS_STEPS = [
  { t: "১. প্রশ্ন, UDP তে, Port 53", r: true, s: true },
  { t: "২. উত্তর, কিন্তু TC Flag চালু (কাটা পড়েছে)", r: false, s: true },
  { t: "৩. SYN, SYN-ACK, ACK (TCP Handshake)", r: true, s: false },
  { t: "৪. একই প্রশ্ন আবার, এবার TCP তে", r: true, s: true },
  { t: "৫. পুরো উত্তর, যত বড়ই হোক", r: false, s: true },
];

export function DnsFallbackDiagram() {
  return (
    <Sketch
      label="Diagram: DNS প্রথমে UDP তে চেষ্টা করে, না আঁটলে TCP তে যায়"
      height={330}
      minWidth={760}
      viewBox="0 0 760 330"
      caption="DNS এর প্রায় সব প্রশ্ন আর উত্তর ছোট, তাই স্বাভাবিক পথ হলো ধাপ ১ আর একটা সাধারণ উত্তর, দুইটা Datagram এ কাজ শেষ। কিন্তু কখনো উত্তরটা এত বড় হয় যে একটা UDP Datagram এ আঁটে না, যেমন অনেকগুলো TXT Record। তখন সার্ভার উত্তরটা কেটে ছোট করে পাঠায় আর Header এ TC নামের একটা Flag চালু করে দেয়, যার মানে Truncated, কাটা পড়েছে। Client এই Flag দেখে বোঝে পুরো উত্তর পায়নি, তখন সে একই সার্ভারের সাথে TCP Connection খোলে আর একই প্রশ্ন আবার করে। TCP তে আকারের সেই সীমা নেই। তাই DNS সার্ভারের Port 53 UDP আর TCP দুইটাতেই খোলা থাকা চাই।"
    >
      <Arrow id="udp-dns-a" />
      <Box x={60} y={20} w={150} h={36} text="আপনার যন্ত্র" sub="192.168.1.20" />
      <Box x={550} y={20} w={150} h={36} text="DNS Resolver" sub="1.1.1.1 : 53" accent />
      <line x1={135} y1={56} x2={135} y2={300} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3 3" />
      <line x1={625} y1={56} x2={625} y2={300} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3 3" />
      {DNS_STEPS.map((s, i) => {
        const y = 92 + i * 46;
        return (
          <g key={s.t}>
            <line
              x1={s.r ? 140 : 620}
              y1={y}
              x2={s.r ? 620 : 140}
              y2={y + 10}
              stroke={s.s ? "var(--primary)" : "currentColor"}
              strokeOpacity={s.s ? 1 : 0.5}
              strokeWidth="1.4"
              strokeDasharray={s.s ? undefined : "5 4"}
              markerEnd={s.s ? "url(#udp-dns-a)" : undefined}
            />
            <SketchText x={380} y={y - 5} size={9.5} body bold={s.s} accent={i === 1}>
              {s.t}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={40} y={102} size={8} anchor="start" opacity={0.55}>
        UDP
      </SketchText>
      <SketchText x={40} y={240} size={8} anchor="start" opacity={0.55}>
        TCP
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. কারা UDP ব্যবহার করে, আর কেন                                             */
/* ------------------------------------------------------------------------- */

const USERS = [
  { who: "DNS", port: "53", why: "ছোট প্রশ্ন, ছোট উত্তর। Handshake এর খরচ প্রশ্নের চেয়ে বেশি" },
  { who: "DHCP", port: "67, 68", why: "যন্ত্রের তখনো IP ই নেই, Connection খোলার উপায় নেই" },
  { who: "NTP", port: "123", why: "ঘড়ি মেলানো। দেরিতে পৌঁছানো সময় ভুল সময়" },
  { who: "Voice, Video Call", port: "বদলায়", why: "দেরিতে আসা শব্দ কাজে লাগে না, ফেলে দেওয়াই ভালো" },
  { who: "Online Game", port: "বদলায়", why: "পুরনো অবস্থান আবার পাঠিয়ে লাভ নেই, নতুনটা চাই" },
  { who: "QUIC, HTTP/3", port: "443", why: "নির্ভরযোগ্যতা নিজে বানায়, TCP এর চেয়ে ভালোভাবে" },
  { who: "WireGuard VPN", port: "51820", why: "ভেতরের TCP নিজেই নির্ভরযোগ্য, দুইবার দরকার নেই" },
  { who: "StatsD, Syslog", port: "8125, 514", why: "একটা Metric হারালে ক্ষতি নেই, App ধীর হলে ক্ষতি" },
];

export function UdpUsersDiagram() {
  const rowH = 36;
  const top = 54;
  const h = top + USERS.length * rowH + 14;
  return (
    <Sketch
      label="Diagram: কারা UDP ব্যবহার করে, আর প্রত্যেকের নিজের কারণ"
      height={h}
      minWidth={840}
      viewBox={`0 0 840 ${h}`}
      caption="UDP কে অনেকে TCP এর সস্তা সংস্করণ ভাবেন। এই তালিকা দেখলে বোঝা যায় ব্যাপারটা উল্টো, Internet এর সবচেয়ে জরুরি কিছু কাজ UDP র উপর দাঁড়িয়ে। আর প্রত্যেকে UDP বেছেছে আলাদা কারণে। কারো কাছে Handshake এর খরচটা বেশি (DNS)। কারো পক্ষে Connection খোলাই সম্ভব নয় (DHCP)। কারো কাছে দেরিতে আসা Data মূল্যহীন (Call, Game, NTP)। কেউ নির্ভরযোগ্যতা নিজের মতো করে বানাতে চায় (QUIC)। আর কেউ চায় পাঠানোর কাজটা যেন কখনো মূল Application কে আটকে না রাখে (StatsD)। Port এর ঘরে বদলায় মানে নির্দিষ্ট Port নেই, দুই পক্ষ প্রতিবার ঠিক করে নেয়।"
    >
      <SketchText x={40} y={38} size={9} anchor="start" opacity={0.55}>
        কে
      </SketchText>
      <SketchText x={230} y={38} size={9} anchor="start" opacity={0.55}>
        UDP Port
      </SketchText>
      <SketchText x={340} y={38} size={9} anchor="start" opacity={0.55}>
        UDP কেন
      </SketchText>
      {USERS.map((r, i) => {
        const y = top + i * rowH;
        return (
          <g key={r.who}>
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
            <SketchText x={40} y={y + 19} size={9.5} anchor="start" bold>
              {r.who}
            </SketchText>
            <SketchText x={230} y={y + 19} size={9.5} anchor="start" bold accent>
              {r.port}
            </SketchText>
            <SketchText x={340} y={y + 19} size={9} anchor="start" body opacity={0.8}>
              {r.why}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. Amplification: ছোট প্রশ্ন, জাল ঠিকানা, বড় উত্তর                          */
/* ------------------------------------------------------------------------- */

export function AmplificationDiagram() {
  return (
    <Sketch
      label="Diagram: জাল ফেরত ঠিকানা দিয়ে অন্যের ঘাড়ে বড় উত্তর চাপানো"
      height={300}
      minWidth={800}
      viewBox="0 0 800 300"
      caption="আক্রমণকারী একটা খোলা UDP সার্ভারে (ধরুন যেকারো প্রশ্নের উত্তর দেয় এমন একটা DNS Resolver) ছোট্ট একটা প্রশ্ন পাঠায়। কিন্তু Packet এর Source IP র জায়গায় সে নিজের ঠিকানা না লিখে লেখে শিকারের ঠিকানা। UDP তে কোনো Handshake নেই, তাই সার্ভারের যাচাই করার উপায় নেই প্রশ্নটা সত্যিই ওই ঠিকানা থেকে এসেছে কি না। সার্ভার সরল মনে বড় একটা উত্তর পাঠিয়ে দেয় শিকারের কাছে, যে কিছুই চায়নি। ৬০ Byte এর প্রশ্নে ৩০০০ Byte এর উত্তর হলে আক্রমণকারীর শক্তি পঞ্চাশ গুণ বেড়ে গেল, এটাই Amplification। হাজারটা সার্ভার দিয়ে একসাথে করলে শিকারের Network ডুবে যায়। TCP তে এটা করা যায় না, কারণ জাল ঠিকানায় SYN-ACK ফিরলে Handshake কখনো শেষই হয় না।"
    >
      <Arrow id="udp-amp-a" />
      <Box x={40} y={40} w={170} h={48} text="আক্রমণকারী" sub="আসল IP লুকানো" />
      <Box x={320} y={40} w={170} h={48} text="খোলা UDP সার্ভার" sub="যে কারো প্রশ্নের উত্তর দেয়" />
      <Box x={320} y={200} w={170} h={48} text="শিকার" sub="103.94.135.2" accent />

      <line x1={210} y1={64} x2={316} y2={64} stroke="var(--primary)" strokeWidth="1.2" markerEnd="url(#udp-amp-a)" />
      <SketchText x={264} y={50} size={8.5} body accent>
        ছোট প্রশ্ন
      </SketchText>
      <SketchText x={264} y={84} size={8} opacity={0.7}>
        60 Byte
      </SketchText>

      <line x1={405} y1={88} x2={405} y2={196} stroke="var(--primary)" strokeWidth="5" strokeOpacity={0.85} markerEnd="url(#udp-amp-a)" />
      <SketchText x={420} y={138} size={9} body bold accent anchor="start">
        বড় উত্তর, 3000 Byte
      </SketchText>
      <SketchText x={420} y={156} size={8.5} body opacity={0.7} anchor="start">
        শিকার এটা চায়ইনি
      </SketchText>

      <rect x={560} y={34} width={210} height={84} fill="transparent" stroke="currentColor" strokeOpacity={0.4} strokeDasharray="4 3" />
      <SketchText x={665} y={54} size={8.5} opacity={0.6}>
        প্রশ্নের Packet এ লেখা
      </SketchText>
      <SketchText x={665} y={76} size={9} bold accent>
        Source IP: 103.94.135.2
      </SketchText>
      <SketchText x={665} y={96} size={8.5} body opacity={0.75}>
        জাল, এটা শিকারের ঠিকানা
      </SketchText>
      <line x1={560} y1={64} x2={494} y2={64} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="3 3" />

      <SketchText x={665} y={216} size={9} body opacity={0.8}>
        Handshake নেই,
      </SketchText>
      <SketchText x={665} y={234} size={9} body opacity={0.8}>
        তাই ঠিকানা যাচাইয়ের সুযোগ নেই
      </SketchText>
    </Sketch>
  );
}
