import { Sketch, SketchBox, SketchSplit, SketchText } from "../../sketch";

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
/* 1. পুরো পথের মানচিত্র                                                       */
/* ------------------------------------------------------------------------- */

const STOPS = [
  { x: 60, y: 210, label: "Phone", sub: "Cox’s Bazar", medium: "রেডিও" },
  { x: 180, y: 150, label: "Tower", sub: "GP", medium: "তামা / Fiber" },
  { x: 320, y: 120, label: "ISP", sub: "GP core, Dhaka", medium: "Fiber" },
  { x: 440, y: 100, label: "IIG", sub: "দেশের গেট", medium: "Fiber" },
  { x: 560, y: 150, label: "Cable", sub: "সমুদ্রের নিচে", medium: "কাচ, আলো" },
  { x: 700, y: 120, label: "Singtel", sub: "Singapore", medium: "Fiber" },
  { x: 820, y: 190, label: "Server", sub: "Datacenter", medium: "তার" },
];

export function JourneyMapDiagram() {
  return (
    <Sketch
      label="Diagram: Cox’s Bazar থেকে Singapore, পুরো পথ"
      height={300}
      minWidth={900}
      viewBox="0 0 900 300"
      caption="একটা বুকিং এর Packet এই পুরো পথটা পাড়ি দেয়, আর প্রতিটা থামার জায়গায় মাধ্যম বদলায়। Phone থেকে টাওয়ারে যায় বাতাসে রেডিও হয়ে, টাওয়ার থেকে শহরে তামা বা Fiber এ, সমুদ্র পার হয় কাচের তারে আলো হয়ে। কিন্তু যেটা যায়, সেই তথ্যটা বদলায় না, শুধু বাহনটা বদলায়। মাঝের প্রতিটা বাক্স একটা Router, যে খামের ঠিকানা দেখে ঠিক করে পরের কোন দিকে ঠেলবে। কেউ পুরো পথ জানে না, প্রত্যেকে শুধু পরের একটা ধাপ জানে।"
    >
      {/* the route line */}
      {STOPS.slice(0, -1).map((s, i) => {
        const n = STOPS[i + 1];
        const sea = s.label === "IIG" || s.label === "Cable";
        return (
          <path
            key={i}
            d={`M ${s.x} ${s.y} Q ${(s.x + n.x) / 2} ${(s.y + n.y) / 2 - 24} ${n.x} ${n.y}`}
            fill="none"
            stroke={sea ? "var(--primary)" : "currentColor"}
            strokeOpacity={sea ? 0.8 : 0.4}
            strokeWidth={sea ? 2 : 1.4}
            markerEnd="url(#jm-a)"
          />
        );
      })}

      {/* sea band */}
      <rect
        x={452}
        y={230}
        width={196}
        height={22}
        fill="var(--primary)"
        fillOpacity={0.06}
        stroke="var(--primary)"
        strokeOpacity={0.3}
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <SketchText x={550} y={245} size={8} accent opacity={0.8}>
        সমুদ্র
      </SketchText>

      {STOPS.map((s) => {
        const hot = s.label === "Phone" || s.label === "Server";
        return (
          <g key={s.label}>
            <rect
              x={s.x - 34}
              y={s.y - 16}
              width={68}
              height={32}
              fill={hot ? "var(--primary)" : "transparent"}
              fillOpacity={hot ? 0.12 : 0}
              stroke={hot ? "var(--primary)" : "currentColor"}
              strokeOpacity={hot ? 1 : 0.45}
              strokeWidth="1.2"
            />
            <SketchText x={s.x} y={s.y - 1} size={10} bold accent={hot}>
              {s.label}
            </SketchText>
            <SketchText x={s.x} y={s.y + 11} size={7} opacity={0.6}>
              {s.sub}
            </SketchText>
            <SketchText x={s.x} y={s.y - 24} size={7.5} accent opacity={0.75}>
              {s.medium}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={110} y={288} size={8} opacity={0.5} anchor="start">
        প্রতিটা তীর একটা Hop, প্রতিটা বাক্স একটা Router
      </SketchText>
      <Defs id="jm-a" />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা Router ঠিক কী করে                                                   */
/* ------------------------------------------------------------------------- */

export function RouterHopDiagram() {
  return (
    <Sketch
      label="Diagram: এক Router এর চার ধাপ"
      height={280}
      minWidth={820}
      viewBox="0 0 820 280"
      caption="একটা Router আসলে রাস্তার একটা মোড়, যেখানে একজন ট্রাফিক পুলিশ দাঁড়িয়ে। সে Packet এর ভেতরটা পড়ে না, শুধু খামের গন্তব্যের ঠিকানা দেখে। তারপর নিজের একটা তালিকা মেলায়, এই ঠিকানার জন্য কোন দিকে পাঠাতে হবে। TTL সংখ্যাটা এক কমায়, যাতে কোনো Packet ভুল করে চিরকাল ঘুরতে না থাকে। তারপর পরের Router এর দিকে ঠেলে দেয়। ব্যস, এই চারটা কাজ, কোটি কোটি বার সেকেন্ডে।"
    >
      <SketchBox
        x={20}
        y={110}
        w={110}
        h={50}
        title="আসা Packet"
        sub="গন্তব্য: Singtel"
        accent
      />
      <line
        x1={130}
        y1={135}
        x2={186}
        y2={135}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.3"
        markerEnd="url(#rh-a)"
      />

      <rect
        x={190}
        y={40}
        width={420}
        height={200}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth="1.2"
      />
      <SketchText x={400} y={30} size={10} bold>
        ROUTER, ট্রাফিক পুলিশ
      </SketchText>
      {[
        {
          n: "১",
          t: "গন্তব্যের ঠিকানা পড়ে",
          s: "ভেতরের কথা নয়, শুধু খামের ঠিকানা",
        },
        { n: "২", t: "তালিকা মেলায়", s: "এই ঠিকানা মানে পূর্ব দিকের তার" },
        { n: "৩", t: "TTL এক কমায়", s: "৬৪ থেকে ৬৩, চিরকাল ঘোরা ঠেকাতে" },
        { n: "৪", t: "পরের দিকে ঠেলে", s: "পরের Router এর হাতে" },
      ].map((step, i) => {
        const y = 56 + i * 44;
        return (
          <g key={step.n}>
            <circle
              cx={214}
              cy={y + 10}
              r={11}
              fill="var(--primary)"
              fillOpacity={0.12}
              stroke="var(--primary)"
              strokeWidth="1"
            />
            <SketchText x={214} y={y + 14} size={10} bold accent>
              {step.n}
            </SketchText>
            <SketchText x={236} y={y + 8} size={10} anchor="start" bold>
              {step.t}
            </SketchText>
            <SketchText
              x={236}
              y={y + 22}
              size={8}
              anchor="start"
              opacity={0.6}
              body
            >
              {step.s}
            </SketchText>
          </g>
        );
      })}

      <line
        x1={610}
        y1={135}
        x2={666}
        y2={135}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#rh-b)"
      />
      <SketchBox
        x={670}
        y={110}
        w={120}
        h={50}
        title="পরের Router"
        sub="TTL এখন ৬৩"
        accent
      />
      <Defs id="rh-a" />
      <Defs id="rh-b" accent />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. মাধ্যম বদলায়, তথ্য বদলায় না                                             */
/* ------------------------------------------------------------------------- */

export function MediumChangeDiagram() {
  return (
    <SketchSplit
      label="Diagram: বাহন তিন রকম, যাত্রী এক"
      caption="একই ১০১১০০১ তথ্যটা তিনটা আলাদা বাহনে চড়ে। বাতাসে সেটা রেডিও তরঙ্গ, তামার তারে বিদ্যুতের ওঠানামা, কাচের তারে আলোর জ্বলা নেভা। বাহন পুরোপুরি আলাদা, কিন্তু যাত্রীটা, মানে বিটগুলো, হুবহু এক থাকে। প্রতিটা মোড়ে যন্ত্র শুধু এক বাহন থেকে আরেক বাহনে যাত্রীকে তুলে দেয়, যাত্রীকে বদলায় না। এই কারণেই আপনার Wi-Fi এর তথ্য সমুদ্রের তারেও একই তথ্য থেকে যায়।"
      panels={[
        {
          title: "বাতাসে",
          sub: "Wi-Fi, Mobile",
          viewBox: "0 0 300 150",
          height: 150,
          children: (
            <g>
              <path
                d="M 20 90 Q 45 55 70 90 Q 95 125 120 90 Q 145 55 170 90 Q 195 125 220 90 Q 245 55 270 90"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.6"
              />
              <SketchText x={150} y={40} size={9} accent bold>
                রেডিও তরঙ্গ
              </SketchText>
              <SketchText x={150} y={125} size={9} body>
                1 0 1 1 0 0 1
              </SketchText>
              <SketchText x={150} y={142} size={7.5} opacity={0.6} body>
                ওঠানামায় বিট
              </SketchText>
            </g>
          ),
        },
        {
          title: "তামার তারে",
          sub: "Ethernet",
          viewBox: "0 0 300 150",
          height: 150,
          children: (
            <g>
              <path
                d="M 20 90 L 60 90 L 60 60 L 100 60 L 100 90 L 140 90 L 140 60 L 180 60 L 180 90 L 220 90 L 220 60 L 270 60"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.6"
              />
              <SketchText x={150} y={40} size={9} accent bold>
                বিদ্যুৎ
              </SketchText>
              <SketchText x={150} y={125} size={9} body>
                1 0 1 1 0 0 1
              </SketchText>
              <SketchText x={150} y={142} size={7.5} opacity={0.6} body>
                উঁচু নিচু ভোল্টেজে বিট
              </SketchText>
            </g>
          ),
        },
        {
          title: "কাচের তারে",
          sub: "Fiber, সমুদ্র",
          viewBox: "0 0 300 150",
          height: 150,
          children: (
            <g>
              {[40, 90, 140, 190, 240].map((x, i) => (
                <circle
                  key={x}
                  cx={x}
                  cy={90}
                  r={i % 2 === 0 ? 9 : 4}
                  fill="var(--primary)"
                  fillOpacity={i % 2 === 0 ? 0.6 : 0.15}
                  stroke="var(--primary)"
                  strokeWidth="1"
                />
              ))}
              <line
                x1={20}
                y1={90}
                x2={270}
                y2={90}
                stroke="currentColor"
                strokeOpacity={0.25}
                strokeWidth="1"
              />
              <SketchText x={150} y={40} size={9} accent bold>
                আলো
              </SketchText>
              <SketchText x={150} y={125} size={9} body>
                1 0 1 1 0 0 1
              </SketchText>
              <SketchText x={150} y={142} size={7.5} opacity={0.6} body>
                জ্বলা নেভায় বিট
              </SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}
