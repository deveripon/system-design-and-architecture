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

/* ------------------------------------------------------------------------- */
/* 1. দুইটা পথ, একই মহাসড়ক                                                     */
/* ------------------------------------------------------------------------- */

export function TwoPathsDiagram() {
  return (
    <Sketch
      label="Diagram: Wi-Fi আর Mobile Data, দুই পথ"
      height={300}
      minWidth={820}
      viewBox="0 0 820 300"
      caption="আপনার ফোন Internet এ জোড়া লাগে দুইভাবে। উপরের পথে Wi-Fi, ফোন বাসার Router এ জোড়া লাগে, তারপর বাসার Network পার হয়ে বাইরে। নিচের পথে Mobile Data, ফোন একটা Cell Tower এ জোড়া লাগে, তারপর Carrier এর বিশাল Network পার হয়ে বাইরে। দুইটা আলাদা প্রবেশপথ, কিন্তু শেষে দুইটাই মেশে একই Internet এ। ফোন যেকোনো একটা পথ বেছে নেয়, আপনি টেরও পান না।"
    >
      <Arrow id="tp-a" />

      {/* phone */}
      <rect x={40} y={118} width={130} height={64} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" />
      <SketchText x={105} y={146} size={12} bold>
        আপনার ফোন
      </SketchText>
      <SketchText x={105} y={164} size={9} opacity={0.6} body>
        দুইটা পথই জানে
      </SketchText>

      {/* Wi-Fi path (up) */}
      <line x1={170} y1={135} x2={280} y2={70} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#tp-a)" />
      <SketchText x={210} y={92} size={8.5} accent body>
        Wi-Fi
      </SketchText>
      <rect x={282} y={44} width={150} height={52} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={357} y={66} size={11} bold accent>
        Wi-Fi Router
      </SketchText>
      <SketchText x={357} y={84} size={8.5} opacity={0.75} body>
        বাসার Network
      </SketchText>
      <line x1={432} y1={70} x2={560} y2={120} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#tp-a)" />

      {/* Mobile path (down) */}
      <line x1={170} y1={165} x2={280} y2={230} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#tp-a)" />
      <SketchText x={210} y={216} size={8.5} accent body>
        Mobile Data
      </SketchText>
      <rect x={282} y={204} width={150} height={52} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={357} y={226} size={11} bold accent>
        Cell Tower
      </SketchText>
      <SketchText x={357} y={244} size={8.5} opacity={0.75} body>
        Carrier Network
      </SketchText>
      <line x1={432} y1={230} x2={560} y2={180} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#tp-a)" />

      {/* internet (converge) */}
      <rect x={562} y={118} width={200} height={64} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" />
      <SketchText x={662} y={146} size={13} bold>
        Internet
      </SketchText>
      <SketchText x={662} y={164} size={9} opacity={0.6} body>
        দুই পথই এখানে মেশে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Mobile Data এর পথ, ভেতরে যা ঘটে                                          */
/* ------------------------------------------------------------------------- */

const CARRIER_STOPS = [
  { name: "ফোন", sub: "SIM দিয়ে পরিচয়" },
  { name: "Cell Tower", sub: "রেডিও সংযোগ" },
  { name: "Carrier Core", sub: "IP, Gateway, CGNAT" },
  { name: "Internet", sub: "বাকি দুনিয়া" },
];

export function CarrierPathDiagram() {
  const w = 168;
  const gap = 28;
  const startX = 20;
  const y = 74;
  return (
    <Sketch
      label="Diagram: Mobile Data, ভেতরে যা ঘটে"
      height={210}
      minWidth={820}
      viewBox="0 0 820 210"
      caption="Mobile Data তে বাসার Router এর ভূমিকাটা নেয় আপনার Carrier। ফোন SIM কার্ড দিয়ে নিজের পরিচয় দেয়, রেডিও দিয়ে জোড়া লাগে কাছের Cell Tower এ, আর সেখান থেকে পৌঁছায় Carrier এর বিশাল কেন্দ্রীয় Network এ। এই Carrier Core একাই অনেকগুলো কাজ করে, আপনাকে একটা IP দেয় (DHCP এর মতো), Gateway এর কাজ করে, আর CGNAT দিয়ে অনেক গ্রাহককে অল্প কিছু Public IP তে বাইরে বের করে। বাসায় যা কয়েকটা যন্ত্র করত, এখানে সেটাই Carrier করে বিশাল মাপে।"
    >
      <Arrow id="cp-a" />
      {CARRIER_STOPS.map((s, i) => {
        const x = startX + i * (w + gap);
        const accent = i === 2;
        return (
          <g key={s.name}>
            <rect
              x={x}
              y={y}
              width={w}
              height={64}
              fill={accent ? "var(--primary)" : "currentColor"}
              fillOpacity={accent ? 0.12 : 0.04}
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 1 : 0.4}
              strokeWidth={accent ? 1.4 : 1.2}
            />
            <SketchText x={x + w / 2} y={y + 30} size={12} bold accent={accent}>
              {s.name}
            </SketchText>
            <SketchText x={x + w / 2} y={y + 48} size={8.5} opacity={0.7} body>
              {s.sub}
            </SketchText>
            {i < CARRIER_STOPS.length - 1 && (
              <line
                x1={x + w}
                y1={y + 32}
                x2={x + w + gap}
                y2={y + 32}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#cp-a)"
              />
            )}
          </g>
        );
      })}
      <SketchText x={410} y={44} size={9} opacity={0.6} body>
        বাসার Router এর সব কাজ এখানে করে Carrier, বিশাল মাপে
      </SketchText>
      <SketchText x={410} y={172} size={9} accent body>
        তাই Mobile Data তে আপনি প্রায় সবসময় CGNAT এর পেছনে
      </SketchText>
    </Sketch>
  );
}
