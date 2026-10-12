import { Sketch, SketchText } from "../../sketch";

function Cell({
  x,
  y,
  w,
  h = 44,
  top,
  sub,
  accent,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  top: string;
  sub?: string;
  accent?: boolean;
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
      <SketchText x={x + w / 2} y={sub ? y + h / 2 - 2 : y + h / 2 + 4} size={10} bold accent={accent}>
        {top}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 13} size={9} opacity={0.75} accent={accent}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/** একটা বন্ধনী, যা নিচ থেকে কয়েকটা ঘরকে এক নামে বেঁধে দেখায়। */
function Brace({
  x1,
  x2,
  y,
  text,
  sub,
  accent,
}: {
  x1: number;
  x2: number;
  y: number;
  text: string;
  sub?: string;
  accent?: boolean;
}) {
  const stroke = accent ? "var(--primary)" : "currentColor";
  return (
    <g>
      <path
        d={`M${x1},${y} L${x1},${y + 8} L${x2},${y + 8} L${x2},${y}`}
        fill="none"
        stroke={stroke}
        strokeOpacity={accent ? 1 : 0.55}
        strokeWidth="1.3"
      />
      <SketchText x={(x1 + x2) / 2} y={y + 24} size={10} bold accent={accent}>
        {text}
      </SketchText>
      {sub && (
        <SketchText x={(x1 + x2) / 2} y={y + 38} size={8.5} body opacity={0.75}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. প্রতিটা Layer এ একই জিনিসের আলাদা নাম                                   */
/* ------------------------------------------------------------------------- */

const NAMES = [
  { layer: "Application", unit: "Data / Message", adds: "নিজের ভাষার কথা, যেমন HTTP", addr: "URL, Host নাম", who: "আপনার Program" },
  { layer: "Transport (TCP)", unit: "Segment", adds: "TCP Header, ২০ Byte", addr: "Port Number", who: "Kernel" },
  { layer: "Transport (UDP)", unit: "Datagram", adds: "UDP Header, ৮ Byte", addr: "Port Number", who: "Kernel" },
  { layer: "Internet", unit: "Packet", adds: "IP Header, ২০ Byte", addr: "IP Address", who: "Kernel" },
  { layer: "Link", unit: "Frame", adds: "Header ১৪ Byte, Trailer ৪ Byte", addr: "MAC Address", who: "Network Card" },
  { layer: "Physical", unit: "Bits", adds: "কিছুই না, শুধু সংকেত", addr: "ঠিকানা নেই", who: "তার, Fiber, Radio" },
];

export function PduNamesDiagram() {
  const rowH = 38;
  const top = 54;
  const h = top + NAMES.length * rowH + 14;
  return (
    <Sketch
      label="Diagram: কোন Layer এ কী নাম, আর কে কী জুড়ে দেয়"
      height={h}
      minWidth={860}
      viewBox={`0 0 860 ${h}`}
      caption="একই বার্তা উপর থেকে নিচে নামতে নামতে পাঁচবার নাম বদলায়। নামগুলো মুখস্থ করার জিনিস নয়, প্রতিটা নাম আসলে বলে দেয় এই মুহূর্তে জিনিসটার গায়ে কোন কোন মোড়ক আছে। Segment বললে বোঝায় Data র গায়ে শুধু TCP Header। Packet বললে বোঝায় তার উপর IP Header ও আছে। Frame বললে বোঝায় সবার বাইরে Ethernet এর মোড়কটাও লেগে গেছে। তৃতীয় ঘরটা দেখায় প্রতিটা Layer কী জুড়ে দেয়, চতুর্থটা দেখায় সেই মোড়কে কোন ধরনের ঠিকানা লেখা থাকে, আর শেষ ঘরটা দেখায় আপনার যন্ত্রের কোন অংশ কাজটা করে।"
    >
      <SketchText x={36} y={38} size={9} anchor="start" opacity={0.55}>
        Layer
      </SketchText>
      <SketchText x={200} y={38} size={9} anchor="start" opacity={0.55}>
        এখানে নাম
      </SketchText>
      <SketchText x={350} y={38} size={9} anchor="start" opacity={0.55}>
        যা জুড়ে দেয়
      </SketchText>
      <SketchText x={580} y={38} size={9} anchor="start" opacity={0.55}>
        মোড়কে যে ঠিকানা
      </SketchText>
      <SketchText x={720} y={38} size={9} anchor="start" opacity={0.55}>
        কাজটা কে করে
      </SketchText>
      {NAMES.map((r, i) => {
        const y = top + i * rowH;
        return (
          <g key={r.layer}>
            <rect
              x={20}
              y={y}
              width={820}
              height={rowH - 8}
              fill={i % 2 === 0 ? "currentColor" : "transparent"}
              fillOpacity={0.03}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth="1"
            />
            <SketchText x={36} y={y + 20} size={9.5} anchor="start" bold>
              {r.layer}
            </SketchText>
            <SketchText x={200} y={y + 20} size={10.5} anchor="start" bold accent>
              {r.unit}
            </SketchText>
            <SketchText x={350} y={y + 20} size={9.5} anchor="start" body>
              {r.adds}
            </SketchText>
            <SketchText x={580} y={y + 20} size={9.5} anchor="start" body>
              {r.addr}
            </SketchText>
            <SketchText x={720} y={y + 20} size={9} anchor="start" body opacity={0.75}>
              {r.who}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. খামের ভেতর খাম                                                          */
/* ------------------------------------------------------------------------- */

export function NestedUnitsDiagram() {
  // ঘরগুলো মাপ অনুযায়ী আঁকা নয়, নইলে ১৪৬০ এর পাশে ৪ দেখাই যেত না।
  const y = 44;
  const eth = { x: 40, w: 120 };
  const ip = { x: 160, w: 110 };
  const tcp = { x: 270, w: 110 };
  const data = { x: 380, w: 320 };
  const fcs = { x: 700, w: 100 };
  return (
    <Sketch
      label="Diagram: একটা Frame এর ভেতরে কী কী আছে"
      height={250}
      minWidth={840}
      viewBox="0 0 840 250"
      caption="উপরের সারিটা তারে যাওয়া একটা পুরো Frame, বাঁ থেকে ডানে ঠিক যে ক্রমে Byte গুলো যায়। নিচের তিনটা বন্ধনী দেখায় কোন অংশটুকুর নাম কী। সবচেয়ে ভেতরে Data, তার গায়ে TCP Header লাগলে সেটা Segment। Segment এর গায়ে IP Header লাগলে সেটা Packet। Packet এর সামনে Ethernet Header আর পেছনে FCS লাগলে সেটা Frame। খেয়াল করুন, প্রতিটা Layer এর কাছে ভেতরের পুরো জিনিসটা শুধুই মাল, যাকে বলে Payload। IP র কাছে পুরো Segment টাই Payload, সে তার ভেতরে তাকায় না। ছবির ঘরগুলো আসল মাপ অনুযায়ী আঁকা নয়, সংখ্যাগুলো আসল।"
    >
      <Cell x={eth.x} y={y} w={eth.w} top="Ethernet Header" sub="14 Byte" />
      <Cell x={ip.x} y={y} w={ip.w} top="IP Header" sub="20 Byte" />
      <Cell x={tcp.x} y={y} w={tcp.w} top="TCP Header" sub="20 Byte" />
      <Cell x={data.x} y={y} w={data.w} top="Data" sub="সর্বোচ্চ 1460 Byte" accent />
      <Cell x={fcs.x} y={y} w={fcs.w} top="FCS" sub="4 Byte" />

      <Brace x1={tcp.x + 4} x2={data.x + data.w - 4} y={98} text="Segment" sub="20 + 1460 = 1480 Byte" accent />
      <Brace x1={ip.x + 4} x2={data.x + data.w - 4} y={146} text="Packet" sub="20 + 1480 = 1500 Byte" />
      <Brace x1={eth.x + 4} x2={fcs.x + fcs.w - 4} y={194} text="Frame" sub="14 + 1500 + 4 = 1518 Byte" />

      <SketchText x={eth.x + eth.w / 2} y={32} size={8.5} body opacity={0.7}>
        সামনের মোড়ক
      </SketchText>
      <SketchText x={fcs.x + fcs.w / 2} y={32} size={8.5} body opacity={0.7}>
        পেছনের মোড়ক, Trailer
      </SketchText>
      <SketchText x={data.x + data.w / 2} y={32} size={8.5} body accent>
        আসল কথাটুকু
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. MTU আর MSS, একই ছবিতে                                                   */
/* ------------------------------------------------------------------------- */

export function MtuMssDiagram() {
  const y = 96;
  return (
    <Sketch
      label="Diagram: MTU মাপে কোনটুকু, MSS মাপে কোনটুকু"
      height={250}
      minWidth={840}
      viewBox="0 0 840 250"
      caption="এই দুইটা সংখ্যা সবাই গুলিয়ে ফেলে, অথচ তফাতটা এক ছবিতেই ধরা যায়। MTU হলো Link Layer এর সীমা, একটা Frame এর ভেতরে সর্বোচ্চ কত বড় Packet ধরে। সাধারণ Ethernet এ সেটা ১৫০০ Byte, আর এই হিসাবে IP Header ও পড়ে। Ethernet এর নিজের Header আর FCS এর মধ্যে পড়ে না, তাই সেগুলো ভাঙা রেখায় আঁকা। MSS হলো Transport Layer এর সীমা, একটা Segment এ সর্বোচ্চ কত Byte Data ধরে। ১৫০০ থেকে IP Header এর ২০ আর TCP Header এর ২০ বাদ দিলে থাকে ১৪৬০। তাই MSS সবসময় MTU থেকে ৪০ কম, আর MTU কমলে MSS ও সাথে সাথে কমে।"
    >
      <Cell x={40} y={y} w={110} top="Ethernet Header" sub="14 Byte" dashed />
      <Cell x={150} y={y} w={120} top="IP Header" sub="20 Byte" />
      <Cell x={270} y={y} w={120} top="TCP Header" sub="20 Byte" />
      <Cell x={390} y={y} w={300} top="Data" sub="1460 Byte" accent />
      <Cell x={690} y={y} w={110} top="FCS" sub="4 Byte" dashed />

      {/* MTU, উপরে */}
      <path d="M150,84 L150,74 L690,74 L690,84" fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.3" />
      <SketchText x={420} y={64} size={11} bold>
        MTU = 1500 Byte
      </SketchText>
      <SketchText x={420} y={46} size={8.5} body opacity={0.75}>
        একটা Frame এ সর্বোচ্চ কত বড় Packet ধরে, Link এর সীমা
      </SketchText>

      {/* MSS, নিচে */}
      <Brace x1={390} x2={690} y={148} text="MSS = 1460 Byte" sub="একটা Segment এ সর্বোচ্চ কত Data, TCP র সীমা" accent />

      <SketchText x={95} y={160} size={8.5} body opacity={0.6}>
        MTU তে গোনা হয় না
      </SketchText>
      <SketchText x={745} y={160} size={8.5} body opacity={0.6}>
        MTU তে গোনা হয় না
      </SketchText>
      <SketchText x={420} y={224} size={9.5} body>
        MSS = MTU বিয়োগ IP Header (20) বিয়োগ TCP Header (20)
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Tunnel আর VPN এর মোড়ক কত জায়গা খায়                                    */
/* ------------------------------------------------------------------------- */

const TUNNELS = [
  { name: "সাধারণ Ethernet", extra: 0, left: 1500, note: "বাড়তি মোড়ক নেই" },
  { name: "PPPoE (অনেক Broadband)", extra: 8, left: 1492, note: "PPPoE Header" },
  { name: "IP in IP Tunnel", extra: 20, left: 1480, note: "আরেকটা IP Header" },
  { name: "GRE Tunnel", extra: 24, left: 1476, note: "IP + GRE Header" },
  { name: "VXLAN (Docker Overlay)", extra: 50, left: 1450, note: "Ethernet + IP + UDP + VXLAN" },
  { name: "WireGuard VPN", extra: 80, left: 1420, note: "IP + UDP + WireGuard, IPv6 ধরে" },
];

export function TunnelOverheadDiagram() {
  const rowH = 40;
  const top = 50;
  const barX = 250;
  const barW = 400;
  const h = top + TUNNELS.length * rowH + 14;
  return (
    <Sketch
      label="Diagram: বাড়তি মোড়ক যত, ভেতরের জায়গা তত কম"
      height={h}
      minWidth={860}
      viewBox={`0 0 860 ${h}`}
      caption="তারটা একই, একটা Frame এ ১৫০০ Byte ই ধরে। কিন্তু মাঝখানে কেউ যদি আপনার Packet কে আরেকটা মোড়কে ঢুকিয়ে পাঠায়, সেই মোড়কের জায়গাটা ওই ১৫০০ থেকেই কাটা যায়। রঙিন অংশটা বাড়তি মোড়ক, আর সংখ্যাটা হলো আপনার নিজের Packet এর জন্য যা বাকি রইল। PPPoE তে ৮ Byte গেলে থাকে ১৪৯২। WireGuard এ ৮০ Byte গেলে থাকে ১৪২০। এই কারণেই VPN চালু করলে বা Container এর Overlay Network এ MTU ছোট দেখা যায়। রঙিন অংশগুলো বোঝার সুবিধার জন্য বড় করে আঁকা, আসল অনুপাতে এগুলো চোখেই পড়ত না।"
    >
      <SketchText x={30} y={34} size={9} anchor="start" opacity={0.55}>
        কোন পথে
      </SketchText>
      <SketchText x={barX} y={34} size={9} anchor="start" opacity={0.55}>
        ১৫০০ Byte কীভাবে ভাগ হলো
      </SketchText>
      <SketchText x={676} y={34} size={9} anchor="start" opacity={0.55}>
        বাড়তি মোড়কে কী আছে
      </SketchText>
      {TUNNELS.map((t, i) => {
        const y = top + i * rowH;
        const extraW = t.extra === 0 ? 0 : 34 + t.extra * 1.1;
        return (
          <g key={t.name}>
            <SketchText x={30} y={y + 19} size={9.5} anchor="start" body bold>
              {t.name}
            </SketchText>
            {t.extra > 0 && (
              <>
                <rect
                  x={barX}
                  y={y}
                  width={extraW}
                  height={28}
                  fill="var(--primary)"
                  fillOpacity={0.14}
                  stroke="var(--primary)"
                  strokeWidth="1.3"
                />
                <SketchText x={barX + extraW / 2} y={y + 18} size={9.5} bold accent>
                  {String(t.extra)}
                </SketchText>
              </>
            )}
            <rect
              x={barX + extraW}
              y={y}
              width={barW - extraW}
              height={28}
              fill="currentColor"
              fillOpacity={0.04}
              stroke="currentColor"
              strokeOpacity={0.45}
              strokeWidth="1.3"
            />
            <SketchText x={barX + extraW + (barW - extraW) / 2} y={y + 18} size={10} bold>
              {`আপনার Packet এর জন্য ${t.left}`}
            </SketchText>
            <SketchText x={676} y={y + 19} size={8.5} anchor="start" body opacity={0.75}>
              {t.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. tcpdump এর একটা লাইন, Layer ধরে ভেঙে                                    */
/* ------------------------------------------------------------------------- */

const CAPTURE = [
  { unit: "Frame", text: "a4:83:e7:12:9c:01 > c8:3a:35:4b:10:fe", means: "কোন MAC থেকে কোন MAC, ফোন থেকে Router" },
  { unit: "Frame", text: "ethertype IPv4 (0x0800)", means: "Frame এর ভেতরে কী আছে, একটা IPv4 Packet" },
  { unit: "Frame", text: "length 86", means: "FCS বাদে পুরো Frame, ৮৬ Byte" },
  { unit: "Packet", text: "ttl 64", means: "আর কয়টা Router পেরোতে পারবে" },
  { unit: "Packet", text: "flags [DF]", means: "পথে এটাকে ভাঙা নিষেধ" },
  { unit: "Packet", text: "proto TCP (6)", means: "Packet এর ভেতরে কী আছে, একটা TCP Segment" },
  { unit: "Packet", text: "length 72", means: "পুরো Packet, ৮৬ থেকে Ethernet এর ১৪ বাদ" },
  { unit: "Packet", text: "192.168.1.20 > 103.94.135.2", means: "কোন IP থেকে কোন IP" },
  { unit: "Segment", text: ".51514 > .443", means: "IP র পরের সংখ্যা দুইটা Port" },
  { unit: "Segment", text: "Flags [P.], seq 1000:1032", means: "Data সহ Segment, ১০০০ থেকে ১০৩১ নম্বর Byte" },
  { unit: "Data", text: "length 32", means: "আসল Data, ৭২ থেকে দুই Header এর ৪০ বাদ" },
];

export function CaptureLineDiagram() {
  const rowH = 32;
  const top = 50;
  const h = top + CAPTURE.length * rowH + 14;
  return (
    <Sketch
      label="Diagram: tcpdump এর এক লাইনে তিনটা Layer"
      height={h}
      minWidth={860}
      viewBox={`0 0 860 ${h}`}
      caption="tcpdump -e -nn -v দিয়ে একটা Frame ধরলে যে লম্বা লাইনটা আসে, সেটা প্রথমবার দেখলে হিজিবিজি মনে হয়। আসলে এটা বাইরে থেকে ভেতরের দিকে সাজানো, ঠিক যে ক্রমে মোড়ক খোলা হয়। প্রথমে Frame এর কথা, তারপর Packet এর, তারপর Segment এর, সবার শেষে Data কত Byte। বাঁ দিকের ঘরটা বলে দেয় লেখাটুকু কোন মোড়কের। তিনটা length এর দিকে আলাদা করে তাকান, ৮৬, ৭২ আর ৩২। প্রতিটা ধাপে একটা করে Header এর মাপ বাদ যাচ্ছে, ১৪, তারপর ৪০। এই বিয়োগটাই Decapsulation, সংখ্যায়।"
    >
      <SketchText x={30} y={34} size={9} anchor="start" opacity={0.55}>
        কোন মোড়কের
      </SketchText>
      <SketchText x={130} y={34} size={9} anchor="start" opacity={0.55}>
        লাইনে যা লেখা
      </SketchText>
      <SketchText x={470} y={34} size={9} anchor="start" opacity={0.55}>
        মানে
      </SketchText>
      {CAPTURE.map((c, i) => {
        const y = top + i * rowH;
        const accent = c.unit === "Data";
        return (
          <g key={c.text}>
            <rect
              x={20}
              y={y}
              width={820}
              height={rowH - 6}
              fill={accent ? "var(--primary)" : i % 2 === 0 ? "currentColor" : "transparent"}
              fillOpacity={accent ? 0.08 : 0.03}
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 0.8 : 0.25}
              strokeWidth="1"
            />
            <SketchText x={30} y={y + 17} size={9.5} anchor="start" bold accent={accent} opacity={accent ? 1 : 0.7}>
              {c.unit}
            </SketchText>
            <SketchText x={130} y={y + 17} size={9.5} anchor="start" bold accent={accent}>
              {c.text}
            </SketchText>
            <SketchText x={470} y={y + 17} size={9.5} anchor="start" body>
              {c.means}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
