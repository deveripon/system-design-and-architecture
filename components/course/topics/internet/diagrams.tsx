import { Sketch, SketchBox, SketchSplit, SketchText } from "../../sketch";

/* Shared arrowhead: one filled triangle facing +x, orient="auto" does the aiming. */
function Defs({ id, accent }: { id: string; accent?: boolean }) {
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
          fill={accent ? "var(--primary)" : "currentColor"}
          fillOpacity={accent ? 1 : 0.55}
        />
      </marker>
    </defs>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. নেটওয়ার্কের নেটওয়ার্ক                                                   */
/* ------------------------------------------------------------------------- */

/** A small cluster of machines hanging off one box. */
function Cluster({
  x,
  y,
  label,
  sub,
  machines,
  accent,
}: {
  x: number;
  y: number;
  label: string;
  sub: string;
  machines: string[];
  accent?: boolean;
}) {
  const w = 190;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={118}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.25}
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <SketchText x={x + 10} y={y + 16} size={9} anchor="start" opacity={0.6}>
        {sub}
      </SketchText>
      <SketchBox
        x={x + 55}
        y={y + 26}
        w={80}
        h={30}
        title={label}
        accent={accent}
      />
      {machines.map((m, i) => {
        const mx = x + 14 + i * 56;
        return (
          <g key={`${m}-${i}`}>
            <line
              x1={x + 95}
              y1={y + 56}
              x2={mx + 24}
              y2={y + 82}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth="1"
            />
            <rect
              x={mx}
              y={y + 82}
              width={48}
              height={24}
              fill="transparent"
              stroke="currentColor"
              strokeOpacity={0.4}
              strokeWidth="1"
            />
            <SketchText x={mx + 24} y={y + 98} size={8} opacity={0.8}>
              {m}
            </SketchText>
          </g>
        );
      })}
    </g>
  );
}

export function NetworkOfNetworksDiagram() {
  return (
    <Sketch
      label="Diagram: নেটওয়ার্কের নেটওয়ার্ক"
      height={330}
      minWidth={900}
      viewBox="0 0 900 330"
      caption="নিচের তিনটা খোপের প্রত্যেকটা একটা আলাদা নেটওয়ার্ক, আলাদা মালিকের। আপনার বাসার Router আপনার, GP এর টাওয়ার GP এর, Singapore এর Datacenter আরেক কোম্পানির। উপরের মোটা লাইনগুলো এই নেটওয়ার্কগুলোকে জোড়া লাগায়। এই জোড়া লাগানোটাই Internet, মানে Inter Network, নেটওয়ার্কগুলোর মাঝখানের জিনিস। কেউ পুরোটার মালিক নয়।"
    >
      {/* the joining lines, drawn first so boxes sit on top */}
      <path
        d="M 150 60 L 450 60"
        stroke="var(--primary)"
        strokeWidth="2.4"
        fill="none"
      />
      <path
        d="M 450 60 L 750 60"
        stroke="var(--primary)"
        strokeWidth="2.4"
        fill="none"
      />
      <path
        d="M 150 60 Q 450 0 750 60"
        stroke="var(--primary)"
        strokeWidth="1.2"
        strokeDasharray="5 4"
        fill="none"
      />
      <SketchText x={450} y={22} size={9} accent opacity={0.8}>
        একটা রাস্তা বন্ধ হলে অন্যটা আছে
      </SketchText>

      {/* the junction points */}
      {[150, 450, 750].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={60} r={7} fill="var(--primary)" />
          <line
            x1={cx}
            y1={67}
            x2={cx}
            y2={100}
            stroke="var(--primary)"
            strokeWidth="1.4"
          />
        </g>
      ))}
      <SketchText x={450} y={86} size={9} accent bold>
        INTERNET, মাঝখানের জোড়াগুলো
      </SketchText>

      <Cluster
        x={55}
        y={100}
        sub="আপনার বাসা, আপনার মালিকানা"
        label="Router"
        machines={["Laptop", "Phone", "TV"]}
      />
      <Cluster
        x={355}
        y={100}
        sub="Grameenphone, তাদের মালিকানা"
        label="ISP"
        machines={["Tower", "Tower", "Tower"]}
      />
      <Cluster
        x={655}
        y={100}
        sub="Singapore Datacenter, আরেক কোম্পানি"
        label="Switch"
        machines={["Server", "Server", "Tours"]}
        accent
      />

      <SketchText x={450} y={250} size={10} opacity={0.7} body>
        তিনটা নেটওয়ার্ক, তিনজন মালিক, কিন্তু আপনার Phone থেকে Tours সার্ভার
        পর্যন্ত একটানা রাস্তা
      </SketchText>
      <SketchText x={450} y={270} size={10} opacity={0.7} body>
        কারণ তিনজনই একই নিয়মে কথা বলতে রাজি হয়েছেন
      </SketchText>
      <SketchText x={450} y={305} size={9} opacity={0.5}>
        Inter + Network = Internet
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. তার থাকলেই কথা হয় না, নিয়ম লাগে                                        */
/* ------------------------------------------------------------------------- */

function Device({
  x,
  y,
  name,
  maker,
  accent,
}: {
  x: number;
  y: number;
  name: string;
  maker: string;
  accent?: boolean;
}) {
  return (
    <SketchBox
      x={x}
      y={y}
      w={96}
      h={40}
      title={name}
      sub={maker}
      accent={accent}
    />
  );
}

export function ProtocolAgreementDiagram() {
  return (
    <SketchSplit
      label="Diagram: তার এক, নিয়ম আলাদা"
      caption="বাম পাশে তিনটা মেশিন একই তারে জোড়া, কিন্তু প্রত্যেকে নিজের মতো করে কথা বলছে, তাই কেউ কাউকে বোঝে না। ডান পাশে একই তিনটা মেশিন, একই তার, শুধু তিনজনই একটা সাধারণ নিয়মে কথা বলতে রাজি হয়েছে। এই নিয়মটার নাম Protocol, আর Internet এর সাধারণ নিয়মটার নাম TCP/IP। তারটা Internet বানায় না, রাজি হওয়াটা বানায়।"
      panels={[
        {
          title: "নিয়ম ছাড়া",
          sub: "তার আছে, কথা নেই",
          viewBox: "0 0 320 200",
          height: 200,
          children: (
            <g>
              <line
                x1={20}
                y1={100}
                x2={300}
                y2={100}
                stroke="currentColor"
                strokeOpacity={0.4}
                strokeWidth="2"
              />
              <Device x={12} y={20} name="Laptop" maker="Apple" />
              <Device x={112} y={130} name="Server" maker="Linux" />
              <Device x={212} y={20} name="Phone" maker="Android" />
              {[60, 160, 260].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1={x === 160 ? 130 : 60}
                  x2={x}
                  y2={100}
                  stroke="currentColor"
                  strokeOpacity={0.4}
                  strokeWidth="1.2"
                />
              ))}
              <SketchText x={60} y={80} size={8} opacity={0.6}>
                ??!#
              </SketchText>
              <SketchText x={160} y={122} size={8} opacity={0.6}>
                %$@~
              </SketchText>
              <SketchText x={260} y={80} size={8} opacity={0.6}>
                ...?
              </SketchText>
              <SketchText x={160} y={190} size={9} opacity={0.6} body>
                তিনটা ভাষা, কেউ কাউকে বোঝে না
              </SketchText>
            </g>
          ),
        },
        {
          title: "একই নিয়মে রাজি",
          sub: "তার একই, এবার কথা হয়",
          viewBox: "0 0 320 200",
          height: 200,
          children: (
            <g>
              <line
                x1={20}
                y1={100}
                x2={300}
                y2={100}
                stroke="var(--primary)"
                strokeWidth="2"
              />
              <Device x={12} y={20} name="Laptop" maker="Apple" accent />
              <Device x={112} y={130} name="Server" maker="Linux" accent />
              <Device x={212} y={20} name="Phone" maker="Android" accent />
              {[60, 160, 260].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1={x === 160 ? 130 : 60}
                  x2={x}
                  y2={100}
                  stroke="var(--primary)"
                  strokeWidth="1.2"
                />
              ))}
              <rect
                x={100}
                y={90}
                width={120}
                height={20}
                fill="var(--primary)"
                fillOpacity={0.12}
                stroke="var(--primary)"
                strokeWidth="1"
              />
              <SketchText x={160} y={104} size={9} accent bold>
                TCP/IP
              </SketchText>
              <SketchText x={160} y={190} size={9} opacity={0.7} body>
                Apple, Linux, Android, সবাই একই নিয়মে
              </SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Web আর Internet এক জিনিস নয়                                             */
/* ------------------------------------------------------------------------- */

const RIDERS = [
  { name: "Web", sub: "Browser এ যা দেখেন" },
  { name: "Email", sub: "Gmail, Outlook" },
  { name: "Video Call", sub: "Zoom, Meet" },
  { name: "Game", sub: "PUBG, Free Fire" },
  { name: "SSH", sub: "সার্ভারে ঢোকা" },
];

export function InternetVsWebDiagram() {
  const colW = 150;
  const gap = 14;
  const startX = (900 - (RIDERS.length * colW + (RIDERS.length - 1) * gap)) / 2;
  return (
    <Sketch
      label="Diagram: Internet এর উপরে কী কী চলে"
      height={250}
      minWidth={900}
      viewBox="0 0 900 250"
      caption="নিচের মোটা পাটাতনটা Internet, মানে জোড়া লাগানো নেটওয়ার্ক আর সাধারণ নিয়ম। তার উপরে যা কিছু চলে, Web তার মধ্যে একটা মাত্র। Facebook বন্ধ হয়ে গেলে Web এর একটা জিনিস বন্ধ হয়েছে, Internet নয়, তাই তখনো আপনার Email আসে আর Video Call চলে। আর Wi-Fi এর তার খুলে দিলে পাটাতনটাই নেই, তখন উপরের সবকিছু একসাথে থেমে যায়।"
    >
      {RIDERS.map((r, i) => {
        const x = startX + i * (colW + gap);
        return (
          <g key={r.name}>
            <SketchBox
              x={x}
              y={40}
              w={colW}
              h={54}
              title={r.name}
              sub={r.sub}
              accent={i === 0}
            />
            <line
              x1={x + colW / 2}
              y1={94}
              x2={x + colW / 2}
              y2={132}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth="1.2"
            />
          </g>
        );
      })}
      <SketchText x={450} y={26} size={9} opacity={0.55}>
        Internet এর উপরে চলা কয়েকটা জিনিস
      </SketchText>

      <rect
        x={startX - 20}
        y={132}
        width={RIDERS.length * colW + (RIDERS.length - 1) * gap + 40}
        height={70}
        fill="var(--primary)"
        fillOpacity={0.1}
        stroke="var(--primary)"
        strokeWidth="1.6"
      />
      <SketchText x={450} y={162} size={13} accent bold>
        INTERNET
      </SketchText>
      <SketchText x={450} y={182} size={9} opacity={0.75} body>
        জোড়া লাগানো নেটওয়ার্ক + সাধারণ নিয়ম (TCP/IP)
      </SketchText>

      <SketchText x={450} y={232} size={9} opacity={0.55} body>
        Web হলো এই পাটাতনের উপরে চলা একটা জিনিস, পাটাতনটা নয়
      </SketchText>
      <Defs id="ivw-arrow" />
    </Sketch>
  );
}
