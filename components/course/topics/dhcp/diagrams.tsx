import { Sketch, SketchBox, SketchText } from "../../sketch";

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

/* ------------------------------------------------------------------------- */
/* 1. এক ধাক্কায় পুরো সেটিং হাতে                                              */
/* ------------------------------------------------------------------------- */

const CONFIG_ROWS = [
  { k: "IP", v: "192.168.0.5" },
  { k: "Subnet Mask", v: "255.255.255.0" },
  { k: "Gateway", v: "192.168.0.1" },
  { k: "DNS", v: "8.8.8.8" },
];

export function DhcpConfigDiagram() {
  return (
    <Sketch
      label="Diagram: নতুন যন্ত্র জুড়লেই পুরো সেটিং"
      height={300}
      minWidth={800}
      viewBox="0 0 800 300"
      caption="একটা নতুন যন্ত্র Network এ জুড়লে তার হাতে কিছুই থাকে না, IP নেই, Mask নেই, Gateway নেই। সে DHCP server কে জিজ্ঞেস করে, আর server এক ধাক্কায় পুরো সেটিং দিয়ে দেয়, IP, Subnet Mask, Default Gateway, এমনকি DNS পর্যন্ত। আপনি এর একটাও হাতে টাইপ করেন না, তাই Wi-Fi তে জোড়া লাগানোর সাথে সাথেই সব রেডি। DHCP server প্রায় সবসময় আপনার Router।"
    >
      <Arrow id="cfg-a" />

      {/* new device */}
      <SketchBox
        x={40}
        y={110}
        w={190}
        h={70}
        title="নতুন যন্ত্র"
        sub="IP: ? কিছুই নেই"
        dashed
      />

      {/* arrow to server */}
      <line
        x1={230}
        y1={145}
        x2={310}
        y2={145}
        stroke="var(--primary)"
        strokeWidth="1.3"
        markerEnd="url(#cfg-a)"
      />
      <SketchText x={270} y={135} size={8.5} body opacity={0.7}>
        একটা ঠিকানা দাও
      </SketchText>

      {/* DHCP server */}
      <rect
        x={312}
        y={104}
        width={150}
        height={82}
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeWidth="1.5"
      />
      <SketchText x={387} y={138} size={13} bold accent>
        DHCP Server
      </SketchText>
      <SketchText x={387} y={158} size={9} opacity={0.8} body>
        (আপনার Router)
      </SketchText>

      {/* arrow to config card */}
      <line
        x1={462}
        y1={145}
        x2={542}
        y2={145}
        stroke="var(--primary)"
        strokeWidth="1.3"
        markerEnd="url(#cfg-a)"
      />
      <SketchText x={502} y={135} size={8.5} body accent>
        পুরো সেটিং
      </SketchText>

      {/* config card */}
      <rect
        x={544}
        y={70}
        width={232}
        height={158}
        fill="currentColor"
        fillOpacity={0.04}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.3"
      />
      <SketchText x={660} y={94} size={9} opacity={0.55}>
        যা যা হাতে এল
      </SketchText>
      {CONFIG_ROWS.map((r, i) => {
        const y = 116 + i * 28;
        return (
          <g key={r.k}>
            <SketchText x={562} y={y} size={10} anchor="start" body opacity={0.7}>
              {r.k}
            </SketchText>
            <SketchText x={758} y={y} size={11} anchor="end" bold accent>
              {r.v}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. DHCP এর পুল, কে কোনটা পেল                                               */
/* ------------------------------------------------------------------------- */

const POOL = [
  { ip: "192.168.0.100", who: "Laptop", state: "taken" },
  { ip: "192.168.0.101", who: "Phone", state: "taken" },
  { ip: "192.168.0.102", who: "খালি", state: "free" },
  { ip: "192.168.0.103", who: "খালি", state: "free" },
  { ip: "192.168.0.104", who: "Printer (সংরক্ষিত)", state: "reserved" },
  { ip: "192.168.0.105", who: "খালি", state: "free" },
];

export function PoolDiagram() {
  const rowH = 38;
  const top = 54;
  const h = top + POOL.length * rowH + 20;
  return (
    <Sketch
      label="Diagram: DHCP এর ঠিকানার পুল"
      height={h}
      minWidth={640}
      viewBox={`0 0 640 ${h}`}
      caption="DHCP server এর হাতে একটা নির্দিষ্ট ঠিকানার পুল থাকে, যেমন 192.168.0.100 থেকে .105। সে একটা খাতায় লিখে রাখে কে কোনটা পেল, তাই কখনো দুইজনকে একই ঠিকানা দেয় না। কোনো যন্ত্র চলে গেলে আর তার Lease শেষ হলে ঠিকানাটা আবার খালি হয়ে পুলে ফিরে আসে, পরের কেউ পায়। আবার কিছু ঠিকানা সংরক্ষিত রাখা যায়, যেমন Printer টা যেন প্রতিবার একই ঠিকানা পায়, সেটা তার MAC দেখে ঠিক করা হয়।"
    >
      <SketchText x={90} y={38} size={9} anchor="start" opacity={0.55}>
        ঠিকানা
      </SketchText>
      <SketchText x={320} y={38} size={9} anchor="start" opacity={0.55}>
        কে পেল
      </SketchText>
      {POOL.map((p, i) => {
        const y = top + i * rowH;
        const accent = p.state === "taken";
        const reserved = p.state === "reserved";
        return (
          <g key={p.ip}>
            <rect
              x={30}
              y={y}
              width={580}
              height={rowH - 8}
              fill={
                accent
                  ? "var(--primary)"
                  : reserved
                    ? "currentColor"
                    : "transparent"
              }
              fillOpacity={accent ? 0.1 : reserved ? 0.05 : 0}
              stroke={accent || reserved ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent || reserved ? 0.9 : 0.25}
              strokeWidth="1.1"
              strokeDasharray={p.state === "free" ? "4 3" : undefined}
            />
            <SketchText
              x={90}
              y={y + 19}
              size={11}
              anchor="start"
              bold={accent || reserved}
              accent={accent || reserved}
              opacity={p.state === "free" ? 0.5 : 1}
            >
              {p.ip}
            </SketchText>
            <SketchText
              x={320}
              y={y + 19}
              size={10}
              anchor="start"
              body
              opacity={p.state === "free" ? 0.45 : 0.85}
            >
              {p.who}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
