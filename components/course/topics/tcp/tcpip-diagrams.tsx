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

function Box({
  x,
  y,
  w,
  h = 34,
  text,
  sub,
  accent,
  dashed,
  size = 10,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  sub?: string;
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
        <SketchText x={x + w / 2} y={y + h / 2 + 13} size={8.5} body opacity={0.75}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. OSI এর সাত, TCP/IP এর চার                                                */
/* ------------------------------------------------------------------------- */

const OSI_ROWS = [
  { n: "L7", name: "Application" },
  { n: "L6", name: "Presentation" },
  { n: "L5", name: "Session" },
  { n: "L4", name: "Transport" },
  { n: "L3", name: "Network" },
  { n: "L2", name: "Data Link" },
  { n: "L1", name: "Physical" },
];

const TCPIP_GROUPS = [
  { name: "Application", from: 0, to: 2, eg: "HTTP, DNS, TLS, SSH", unit: "Data" },
  { name: "Transport", from: 3, to: 3, eg: "TCP, UDP", unit: "Segment / Datagram" },
  { name: "Internet", from: 4, to: 4, eg: "IP, ICMP", unit: "Packet" },
  { name: "Link", from: 5, to: 6, eg: "Ethernet, Wi-Fi, ARP", unit: "Frame" },
];

export function OsiToTcpIpDiagram() {
  const top = 56;
  const rowH = 36;
  const step = 44;
  const rowY = (i: number) => top + i * step;
  return (
    <Sketch
      label="Diagram: OSI এর সাত Layer, TCP/IP এর চার Layer"
      height={400}
      minWidth={840}
      viewBox="0 0 840 400"
      caption="বাঁ দিকে আগের লেসনের সাত Layer, ডান দিকে আজকের চার Layer। দুইটা আলাদা জিনিস নয়, একই কাজের দুই রকম ভাগ। OSI এর উপরের তিনটা Layer, মানে Application, Presentation আর Session, TCP/IP তে মিলে একটাই Application Layer। কারণ বাস্তবে এই তিন কাজ একই Program নিজে করে, আলাদা করে কেউ করে না। মাঝের দুইটা হুবহু মেলে, Transport থাকে Transport, আর Network এর নাম শুধু বদলে হয় Internet। নিচের দুইটা, Data Link আর Physical, মিলে হয় Link Layer, কারণ TCP/IP তার নিচে কোন তার বা কোন Radio আছে তা নিয়ে মাথাই ঘামায় না। সংখ্যাগুলো খেয়াল করুন। মানুষ যখন Layer 4 বা Layer 7 বলে, সংখ্যাটা আসে বাঁ দিকের তালিকা থেকে, যদিও যন্ত্রের ভেতরে চলে ডান দিকেরটা।"
    >
      <SketchText x={230} y={36} size={10} bold opacity={0.7}>
        OSI Model, মানচিত্র
      </SketchText>
      <SketchText x={610} y={36} size={10} bold accent>
        TCP/IP Model, আসল রাস্তা
      </SketchText>
      {OSI_ROWS.map((r, i) => (
        <g key={r.n}>
          <SketchText x={104} y={rowY(i) + 22} size={9} anchor="end" opacity={0.6}>
            {r.n}
          </SketchText>
          <Box x={120} y={rowY(i)} w={220} h={rowH} text={r.name} />
        </g>
      ))}
      {TCPIP_GROUPS.map((g) => {
        const y = rowY(g.from);
        const h = rowY(g.to) + rowH - y;
        return (
          <g key={g.name}>
            <line x1={340} y1={y} x2={500} y2={y} stroke="var(--primary)" strokeOpacity={0.6} strokeWidth="1" strokeDasharray="3 3" />
            <line x1={340} y1={y + h} x2={500} y2={y + h} stroke="var(--primary)" strokeOpacity={0.6} strokeWidth="1" strokeDasharray="3 3" />
            <rect
              x={500}
              y={y}
              width={220}
              height={h}
              fill="var(--primary)"
              fillOpacity={0.1}
              stroke="var(--primary)"
              strokeWidth="1.3"
            />
            <SketchText x={610} y={y + h / 2 - 2} size={11} bold accent>
              {g.name}
            </SketchText>
            <SketchText x={610} y={y + h / 2 + 13} size={8.5} opacity={0.8}>
              {g.eg}
            </SketchText>
            <SketchText x={732} y={y + h / 2 + 4} size={8.5} anchor="start" opacity={0.7}>
              {g.unit}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={420} y={384} size={9} body opacity={0.75}>
        সাতটা নাম মুখস্থ রাখুন কথা বলার জন্য, চারটা মনে রাখুন কাজ করার জন্য
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. বালিঘড়ি, সব কিছু IP এর উপর দিয়ে যায়                                     */
/* ------------------------------------------------------------------------- */

const APPS = [
  { name: "HTTP", over: "tcp" },
  { name: "SSH", over: "tcp" },
  { name: "SMTP", over: "tcp" },
  { name: "WebSocket", over: "tcp" },
  { name: "DNS", over: "udp" },
  { name: "NTP", over: "udp" },
];

const LINKS = ["Ethernet", "Wi-Fi", "4G / 5G", "Optical Fiber", "Satellite"];

export function HourglassDiagram() {
  const appW = 110;
  const appGap = 14;
  const appX = (i: number) => 55 + i * (appW + appGap);
  const linkW = 130;
  const linkGap = 14;
  const linkX = (i: number) => 67 + i * (linkW + linkGap);
  const tcp = { x: 240, w: 160 };
  const udp = { x: 440, w: 160 };
  const ip = { x: 330, w: 180 };
  return (
    <Sketch
      label="Diagram: বালিঘড়ি, উপরে অনেক, নিচে অনেক, মাঝখানে একটাই"
      height={380}
      minWidth={840}
      viewBox="0 0 840 380"
      caption="ছবিটা দেখতে বালিঘড়ির মতো, আর এই আকারটাই Internet এর সবচেয়ে বড় নকশার সিদ্ধান্ত। উপরে Application Layer এ হাজারটা Protocol, প্রতিদিন নতুন তৈরি হচ্ছে। নিচে Link Layer এ নানা রকম তার আর Radio, সেখানেও নতুন প্রযুক্তি আসছে। কিন্তু মাঝখানের সরু কোমরে একটাই জিনিস, IP। উপরের সবাই শেষ পর্যন্ত IP Packet হয়ে যায়, আর নিচের সবাই শুধু IP Packet বয়ে নিতে জানে। এই কারণে নতুন একটা App বানাতে পৃথিবীর কোনো Router বদলাতে হয় না, আর 5G আসার সময় কোনো Website নতুন করে লিখতে হয়নি। দুই পাশ স্বাধীনভাবে বদলাতে পারে, কারণ মাঝখানটা বদলায় না।"
    >
      <Arrow id="tcpip-hg" />
      <SketchText x={55} y={30} size={9} anchor="start" opacity={0.6}>
        Application Layer, প্রতিদিন নতুন কিছু
      </SketchText>
      {APPS.map((a, i) => {
        const target = a.over === "tcp" ? tcp : udp;
        return (
          <g key={a.name}>
            <Box x={appX(i)} y={40} w={appW} text={a.name} />
            <line
              x1={appX(i) + appW / 2}
              y1={74}
              x2={target.x + target.w / 2}
              y2={128}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth="1"
            />
          </g>
        );
      })}
      <SketchText x={55} y={150} size={9} anchor="start" opacity={0.6}>
        Transport Layer
      </SketchText>
      <Box x={tcp.x} y={130} w={tcp.w} text="TCP" sub="নির্ভরযোগ্য, ক্রম ঠিক রাখে" h={40} />
      <Box x={udp.x} y={130} w={udp.w} text="UDP" sub="হালকা, কোনো প্রতিশ্রুতি নেই" h={40} />
      <line x1={tcp.x + tcp.w / 2} y1={170} x2={ip.x + 60} y2={212} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#tcpip-hg)" />
      <line x1={udp.x + udp.w / 2} y1={170} x2={ip.x + 120} y2={212} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#tcpip-hg)" />
      <SketchText x={55} y={238} size={9} anchor="start" accent bold>
        Internet Layer, সরু কোমর
      </SketchText>
      <Box x={ip.x} y={214} w={ip.w} h={40} text="IP" sub="সবাই এখান দিয়ে যায়" accent />
      <SketchText x={55} y={298} size={9} anchor="start" opacity={0.6}>
        Link Layer, নতুন প্রযুক্তি আসতেই থাকে
      </SketchText>
      {LINKS.map((l, i) => (
        <g key={l}>
          <line
            x1={ip.x + ip.w / 2}
            y1={254}
            x2={linkX(i) + linkW / 2}
            y2={308}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth="1"
          />
          <Box x={linkX(i)} y={310} w={linkW} text={l} />
        </g>
      ))}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. কোন Layer যন্ত্রের কোথায় থাকে                                            */
/* ------------------------------------------------------------------------- */

export function WhereLayersLiveDiagram() {
  return (
    <Sketch
      label="Diagram: চার Layer, একটা যন্ত্রের ভেতরে কে কোথায়"
      height={370}
      minWidth={840}
      viewBox="0 0 840 370"
      caption="চার Layer কোনো কাল্পনিক ভাগ নয়, আপনার Laptop বা Server এর ভেতরে প্রতিটার একটা আসল ঠিকানা আছে। সবার উপরে User space, যেখানে আপনার নিজের Program চলে, Browser, Node.js, curl। Application Layer পুরোটাই এখানে, আর TLS এর Encryption ও এখানেই হয়, Program এর ভেতরের একটা Library দিয়ে। মাঝখানে Kernel, মানে Operating System এর কেন্দ্র। Transport আর Internet Layer, অর্থাৎ TCP, UDP আর IP এর পুরো Code এখানে লেখা আছে, আপনি কখনো লেখেননি, লিখবেনও না। সবার নিচে Network card আর তার Driver, এটাই Link Layer। User space আর Kernel এর মাঝের দাগটাই Socket। আপনার Program এই দাগের ওপারে কিছু দেখতে পায় না, সে শুধু Socket এ Data দেয় আর Socket থেকে Data নেয়।"
    >
      <Arrow id="tcpip-wl" />
      {/* User space */}
      <rect x={150} y={30} width={540} height={84} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.3} strokeWidth="1" strokeDasharray="4 3" />
      <SketchText x={136} y={68} size={9.5} anchor="end" bold opacity={0.75}>
        User space
      </SketchText>
      <SketchText x={136} y={84} size={8.5} anchor="end" body opacity={0.6}>
        আপনার Code
      </SketchText>
      <Box x={180} y={48} w={480} h={48} text="Application Layer" sub="Browser, Node.js, Nginx, curl, আর তাদের ভেতরের TLS Library" accent />
      <SketchText x={704} y={68} size={8.5} anchor="start" body opacity={0.75}>
        এখানে আপনি
      </SketchText>
      <SketchText x={704} y={82} size={8.5} anchor="start" body opacity={0.75}>
        Code লেখেন
      </SketchText>

      {/* Socket boundary */}
      <line x1={150} y1={132} x2={690} y2={132} stroke="var(--primary)" strokeWidth="1.6" />
      <SketchText x={420} y={127} size={9} bold accent>
        Socket, দুই জগতের মাঝের দরজা (System Call)
      </SketchText>
      <line x1={420} y1={98} x2={420} y2={112} stroke="var(--primary)" strokeWidth="1.3" />
      <line x1={420} y1={134} x2={420} y2={152} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#tcpip-wl)" />

      {/* Kernel */}
      <rect x={150} y={148} width={540} height={120} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.3} strokeWidth="1" strokeDasharray="4 3" />
      <SketchText x={136} y={202} size={9.5} anchor="end" bold opacity={0.75}>
        Kernel
      </SketchText>
      <SketchText x={136} y={218} size={8.5} anchor="end" body opacity={0.6}>
        OS এর Code
      </SketchText>
      <Box x={180} y={160} w={480} h={42} text="Transport Layer" sub="TCP, UDP, Port এর তালিকা, Connection এর খাতা" />
      <Box x={180} y={214} w={480} h={42} text="Internet Layer" sub="IP, Routing table, কোন পথে পাঠাবে" />
      <SketchText x={704} y={196} size={8.5} anchor="start" body opacity={0.75}>
        OS এর সাথে আসে,
      </SketchText>
      <SketchText x={704} y={210} size={8.5} anchor="start" body opacity={0.75}>
        আপনি শুধু Setting
      </SketchText>
      <SketchText x={704} y={224} size={8.5} anchor="start" body opacity={0.75}>
        বদলাতে পারেন
      </SketchText>

      {/* Hardware */}
      <rect x={150} y={284} width={540} height={66} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.3} strokeWidth="1" strokeDasharray="4 3" />
      <SketchText x={136} y={314} size={9.5} anchor="end" bold opacity={0.75}>
        Hardware
      </SketchText>
      <SketchText x={136} y={330} size={8.5} anchor="end" body opacity={0.6}>
        Driver সহ
      </SketchText>
      <Box x={180} y={296} w={480} h={42} text="Link Layer" sub="Network card (NIC), তার Driver, MAC Address, তার বা Wi-Fi" />
      <SketchText x={704} y={314} size={8.5} anchor="start" body opacity={0.75}>
        যন্ত্রের সাথে আসে,
      </SketchText>
      <SketchText x={704} y={328} size={8.5} anchor="start" body opacity={0.75}>
        Cloud এ দেখাই যায় না
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. পথের Router কোন Layer পর্যন্ত খোলে                                       */
/* ------------------------------------------------------------------------- */

const STACK = ["Application", "Transport", "Internet", "Link"];
const NODES = [
  { name: "পর্যটকের ফোন", sub: "192.168.1.20", layers: 4 },
  { name: "বাসার Router", sub: "192.168.1.1", layers: 2 },
  { name: "ISP এর Router", sub: "পথের মোড়", layers: 2 },
  { name: "Island Tours Server", sub: "103.94.135.2", layers: 4 },
];

export function RouterTouchesDiagram() {
  const colW = 150;
  const gap = 56;
  const startX = (840 - (NODES.length * colW + (NODES.length - 1) * gap)) / 2;
  const colX = (i: number) => startX + i * (colW + gap);
  const rowY = (i: number) => 70 + i * 46;
  return (
    <Sketch
      label="Diagram: দুই প্রান্তে চার Layer, মাঝপথে মাত্র দুই"
      height={340}
      minWidth={840}
      viewBox="0 0 840 340"
      caption="এই ছবিটা পুরো লেসনের সবচেয়ে জরুরি ছবি। দুই প্রান্তের যন্ত্রে, মানে পর্যটকের ফোনে আর Island Tours এর Server এ, চারটা Layer ই আছে। কিন্তু মাঝপথের Router গুলোতে আছে শুধু নিচের দুইটা। Router একটা Frame খোলে, ভেতরের IP Packet এর গন্তব্য ঠিকানা পড়ে, ঠিক করে পরের কোন দিকে পাঠাবে, তারপর নতুন Frame এ মুড়ে পাঠিয়ে দেয়। Packet এর ভেতরে TCP আছে না UDP, তার ভেতরে HTTP আছে না অন্য কিছু, Router তা খুলেও দেখে না। তাই TCP আর HTTP এর চোখে মাঝখানে কেউ নেই, ফোন সরাসরি Server এর সাথে কথা বলছে। ছবির দুইটা ভাঙা দাগ সেটাই দেখাচ্ছে। এই নকশার নাম End to End Principle, বুদ্ধি থাকবে দুই প্রান্তে, মাঝখানটা থাকবে সরল।"
    >
      <Arrow id="tcpip-rt" />
      {NODES.map((n, i) => (
        <g key={n.name}>
          <SketchText x={colX(i) + colW / 2} y={36} size={10} body bold accent={n.layers === 4}>
            {n.name}
          </SketchText>
          <SketchText x={colX(i) + colW / 2} y={52} size={8.5} opacity={0.65}>
            {n.sub}
          </SketchText>
          {STACK.map((l, j) => {
            const present = j >= 4 - n.layers;
            if (!present) return null;
            return (
              <Box
                key={l}
                x={colX(i)}
                y={rowY(j)}
                w={colW}
                h={34}
                text={l}
                accent={n.layers === 4 && j < 2}
                size={9.5}
              />
            );
          })}
          {i < NODES.length - 1 && (
            <line
              x1={colX(i) + colW}
              y1={rowY(3) + 17}
              x2={colX(i + 1) - 2}
              y2={rowY(3) + 17}
              stroke="var(--primary)"
              strokeWidth="1.4"
              markerEnd="url(#tcpip-rt)"
            />
          )}
        </g>
      ))}
      {/* end to end dashed lines */}
      <line x1={colX(0) + colW} y1={rowY(0) + 17} x2={colX(3)} y2={rowY(0) + 17} stroke="var(--primary)" strokeWidth="1.2" strokeDasharray="5 4" />
      <SketchText x={420} y={rowY(0) + 12} size={9} body accent>
        HTTP এর চোখে, সরাসরি কথা
      </SketchText>
      <line x1={colX(0) + colW} y1={rowY(1) + 17} x2={colX(3)} y2={rowY(1) + 17} stroke="var(--primary)" strokeWidth="1.2" strokeDasharray="5 4" />
      <SketchText x={420} y={rowY(1) + 12} size={9} body accent>
        TCP এর চোখে, সরাসরি কথা
      </SketchText>
      <SketchText x={420} y={rowY(3) + 62} size={9} body opacity={0.75}>
        আসল যাত্রাটা হয় নিচ দিয়ে, এক Router থেকে পরের Router এ, প্রতিবার নতুন Frame এ
      </SketchText>
      <SketchText x={420} y={rowY(3) + 80} size={9} body opacity={0.75}>
        Router শুধু Internet Layer পর্যন্ত উঠে ঠিকানাটা পড়ে, তার উপরে আর ওঠে না
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. প্রতিটা Layer কীভাবে জানে উপরে কাকে দেবে                                 */
/* ------------------------------------------------------------------------- */

const KEYS = [
  {
    layer: "Link Layer",
    where: "Frame এর Header এ",
    key: "EtherType 0x0800",
    means: "ভেতরে IPv4 Packet আছে",
    give: "Internet Layer কে দাও",
  },
  {
    layer: "Internet Layer",
    where: "IP Header এ",
    key: "Protocol 6",
    means: "ভেতরে TCP Segment আছে",
    give: "TCP কে দাও",
  },
  {
    layer: "Transport Layer",
    where: "TCP Header এ",
    key: "Destination Port 443",
    means: "443 এ যে শুনছে তার জন্য",
    give: "সেই Program কে দাও",
  },
];

export function DemuxKeysDiagram() {
  const w = 230;
  const gap = 30;
  const startX = (840 - (KEYS.length * w + (KEYS.length - 1) * gap)) / 2;
  return (
    <Sketch
      label="Diagram: তিনটা ছোট সংখ্যা, যা বলে দেয় উপরে কাকে দিতে হবে"
      height={250}
      minWidth={840}
      viewBox="0 0 840 250"
      caption="Server এ একটা Frame এসে পৌঁছাল। সেটা নিচ থেকে উপরে উঠবে, কিন্তু প্রতিটা Layer কীভাবে জানে উপরের কোন জনকে দিতে হবে? উত্তর হলো, প্রতিটা Header এ একটা ছোট ঘর আছে যেখানে লেখা থাকে ভেতরের জিনিসটা কার। Frame এর Header এ EtherType নামের ঘরে 0x0800 লেখা থাকলে Network card বোঝে ভেতরে IPv4 আছে। IP Header এ Protocol নামের ঘরে 6 লেখা থাকলে Kernel বোঝে ভেতরে TCP, আর 17 থাকলে UDP। TCP Header এ Destination Port এ 443 লেখা থাকলে Kernel খুঁজে দেখে 443 এ কোন Program শুনছে, আর Data টা তাকেই দেয়। একটা Port নম্বর আসলে এই তিন ধাপের শেষ ধাপ, এর বেশি কিছু নয়।"
    >
      <Arrow id="tcpip-dk" />
      {KEYS.map((k, i) => {
        const x = startX + i * (w + gap);
        return (
          <g key={k.layer}>
            <SketchText x={x + w / 2} y={36} size={9} bold opacity={0.65}>
              {`ধাপ ${["১", "২", "৩"][i]}, ${k.layer}`}
            </SketchText>
            <rect x={x} y={48} width={w} height={150} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
            <SketchText x={x + w / 2} y={74} size={9} body opacity={0.7}>
              {k.where}
            </SketchText>
            <rect x={x + 24} y={86} width={w - 48} height={34} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.3" />
            <SketchText x={x + w / 2} y={108} size={10.5} bold accent>
              {k.key}
            </SketchText>
            <SketchText x={x + w / 2} y={146} size={9} body opacity={0.8}>
              {k.means}
            </SketchText>
            <SketchText x={x + w / 2} y={176} size={9.5} body bold accent>
              {k.give}
            </SketchText>
            {i < KEYS.length - 1 && (
              <line
                x1={x + w}
                y1={122}
                x2={x + w + gap - 2}
                y2={122}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#tcpip-dk)"
              />
            )}
          </g>
        );
      })}
      <SketchText x={420} y={228} size={9} body opacity={0.75}>
        নিচ থেকে উপরে, প্রতিটা Layer নিজের Header খুলে ফেলে দেয় আর ভেতরেরটা উপরে তুলে দেয়
      </SketchText>
    </Sketch>
  );
}
