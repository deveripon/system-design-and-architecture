import { Sketch, SketchBox, SketchText } from "../../sketch";

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
/* 1. তিনটা বাক্স, একই চিঠি, তিন রকম আচরণ                                       */
/* ------------------------------------------------------------------------- */

function Box3({
  x,
  title,
  sub,
  behavior,
}: {
  x: number;
  title: string;
  sub: string;
  behavior: "flood" | "one" | "route";
}) {
  const cx = x + 110;
  const devs = [
    { dx: x + 30, label: "A", target: false },
    { dx: x + 110, label: "B", target: true },
    { dx: x + 190, label: "C", target: false },
  ];
  return (
    <g>
      <SketchText x={cx} y={26} size={11} bold accent>
        {title}
      </SketchText>
      <SketchText x={cx} y={40} size={8} opacity={0.6} body>
        {sub}
      </SketchText>
      {/* the box */}
      <SketchBox
        x={x + 70}
        y={56}
        w={80}
        h={34}
        title={title}
        accent={behavior === "one" || behavior === "route"}
      />
      {/* devices */}
      {behavior !== "route" &&
        devs.map((d) => {
          const lit = behavior === "flood" || (behavior === "one" && d.target);
          return (
            <g key={d.label}>
              <rect
                x={d.dx - 20}
                y={140}
                width={40}
                height={28}
                fill={lit ? "var(--primary)" : "transparent"}
                fillOpacity={lit ? 0.12 : 0}
                stroke={lit ? "var(--primary)" : "currentColor"}
                strokeOpacity={lit ? 1 : 0.35}
                strokeWidth="1.1"
              />
              <SketchText x={d.dx} y={158} size={10} bold accent={lit}>
                {d.label}
              </SketchText>
              {/* line from box to device */}
              <line
                x1={cx}
                y1={90}
                x2={d.dx}
                y2={140}
                stroke={lit ? "var(--primary)" : "currentColor"}
                strokeOpacity={lit ? 0.9 : 0.25}
                strokeWidth={lit ? 1.6 : 1}
                strokeDasharray={lit ? undefined : "3 3"}
              />
            </g>
          );
        })}
      {behavior === "route" && (
        <g>
          <rect
            x={x + 30}
            y={140}
            width={70}
            height={28}
            fill="var(--primary)"
            fillOpacity={0.1}
            stroke="var(--primary)"
            strokeWidth="1.1"
          />
          <SketchText x={x + 65} y={158} size={9} bold accent>
            আপনার LAN
          </SketchText>
          <rect
            x={x + 130}
            y={140}
            width={70}
            height={28}
            fill="currentColor"
            fillOpacity={0.04}
            stroke="currentColor"
            strokeOpacity={0.4}
            strokeWidth="1.1"
            strokeDasharray="3 3"
          />
          <SketchText x={x + 165} y={158} size={9} opacity={0.7}>
            বাইরে, WAN
          </SketchText>
          <line
            x1={cx}
            y1={90}
            x2={x + 65}
            y2={140}
            stroke="var(--primary)"
            strokeOpacity={0.9}
            strokeWidth="1.6"
          />
          <line
            x1={cx}
            y1={90}
            x2={x + 165}
            y2={140}
            stroke="var(--primary)"
            strokeOpacity={0.9}
            strokeWidth="1.6"
            markerEnd="url(#tb-a)"
          />
        </g>
      )}
      <SketchText x={cx} y={186} size={8.5} opacity={0.7} body>
        {behavior === "flood"
          ? "সবাইকে চেঁচিয়ে বলে"
          : behavior === "one"
            ? "শুধু B কে দেয়"
            : "দুই Network জোড়ে"}
      </SketchText>
    </g>
  );
}

export function ThreeBoxesDiagram() {
  return (
    <Sketch
      label="Diagram: একই চিঠি B এর জন্য, তিন বাক্স তিন রকম করে"
      height={210}
      minWidth={860}
      viewBox="0 0 860 210"
      caption="A একটা চিঠি পাঠাল, শুধু B এর জন্য। তিনটা বাক্স তিনভাবে সামলায়। Hub বোকা, সে চিঠিটা সবাইকে চেঁচিয়ে শোনায়, C ও পায়। Switch চালাক, সে মনে রাখে কে কোথায়, তাই শুধু B কে দেয়। আর Router সম্পূর্ণ আলাদা কাজ করে, সে এক Network কে আরেক Network এর সাথে জোড়ে, মানে আপনার LAN কে বাইরের WAN এর সাথে। প্রথম দুইটা LAN এর ভেতরের যন্ত্র জোড়ার, তৃতীয়টা LAN থেকে বাইরে বেরোনোর।"
    >
      <Box3 x={20} title="HUB" sub="বোকা, পুরনো" behavior="flood" />
      <Box3 x={300} title="SWITCH" sub="চালাক, LAN জোড়ে" behavior="one" />
      <Box3 x={580} title="ROUTER" sub="দুই Network জোড়ে" behavior="route" />
      <line
        x1={280}
        y1={110}
        x2={300}
        y2={110}
        stroke="currentColor"
        strokeOpacity={0.15}
        strokeWidth="1"
      />
      <line
        x1={560}
        y1={110}
        x2={580}
        y2={110}
        stroke="currentColor"
        strokeOpacity={0.15}
        strokeWidth="1"
      />
      <Defs id="tb-a" accent />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. বুদ্ধির সিঁড়ি                                                            */
/* ------------------------------------------------------------------------- */

const LADDER = [
  {
    name: "HUB",
    smart: "কিছুই মনে রাখে না",
    does: "যা আসে, সবাইকে কপি করে দেয়",
    when: "আজ আর ব্যবহার হয় না",
    w: 130,
  },
  {
    name: "SWITCH",
    smart: "একটা টেবিল মনে রাখে",
    does: "কে কোন তারে, মনে রেখে শুধু তাকে দেয়",
    when: "প্রতিটা LAN এ এটাই",
    w: 260,
    hot: true,
  },
  {
    name: "ROUTER",
    smart: "রাস্তার নকশা রাখে",
    does: "কোন Network কোন দিকে, বেছে পাঠায়",
    when: "LAN আর WAN এর মাঝে",
    w: 400,
    hot: true,
  },
];

export function IntelligenceLadderDiagram() {
  const rowH = 64;
  const top = 40;
  const h = top + LADDER.length * rowH + 24;
  return (
    <Sketch
      label="Diagram: বোকা থেকে চালাক, বুদ্ধির সিঁড়ি"
      height={h}
      minWidth={720}
      viewBox={`0 0 720 ${h}`}
      caption="তিনটা বাক্সকে বুদ্ধির সিঁড়ি হিসেবে ভাবুন। Hub সবচেয়ে বোকা, সে কিছুই মনে রাখে না, শুধু যা পায় সবাইকে কপি করে দেয়। Switch একধাপ চালাক, সে একটা টেবিল মনে রাখে, কে কোন তারে বসে, তাই শুধু ঠিক জনকে দেয়। Router সবচেয়ে আলাদা, সে আলাদা আলাদা Network এর মধ্যে রাস্তা বেছে দেয়। বুদ্ধি যত বেশি, কাজ তত নিখুঁত, আর অকারণ ভিড় তত কম।"
    >
      {LADDER.map((l, i) => {
        const y = top + i * rowH;
        return (
          <g key={l.name}>
            <rect
              x={20}
              y={y}
              width={l.w}
              height={rowH - 16}
              fill={l.hot ? "var(--primary)" : "transparent"}
              fillOpacity={l.hot ? 0.1 : 0}
              stroke={l.hot ? "var(--primary)" : "currentColor"}
              strokeOpacity={l.hot ? 1 : 0.4}
              strokeWidth="1.3"
            />
            <SketchText x={20 + 58} y={y + 22} size={12} bold accent={l.hot}>
              {l.name}
            </SketchText>
            <SketchText
              x={20 + l.w + 14}
              y={y + 12}
              size={9}
              anchor="start"
              bold
            >
              {l.smart}
            </SketchText>
            <SketchText
              x={20 + l.w + 14}
              y={y + 26}
              size={8.5}
              anchor="start"
              opacity={0.6}
              body
            >
              {l.does}
            </SketchText>
            <SketchText
              x={20 + l.w + 14}
              y={y + 40}
              size={8}
              anchor="start"
              accent={l.hot}
              opacity={l.hot ? 0.85 : 0.45}
            >
              {l.when}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. বাসার Router আসলে তিন যন্ত্র একসাথে                                       */
/* ------------------------------------------------------------------------- */

export function HomeBoxDiagram() {
  return (
    <Sketch
      label="Diagram: বাসার এক বাক্সে তিন যন্ত্র"
      height={260}
      minWidth={640}
      viewBox="0 0 640 260"
      caption="বাসায় যেটাকে আমরা Router বলি, সেটা আসলে একটা বাক্সে তিনটা যন্ত্র একসাথে। ভেতরে একটা Switch, যেটা তারের যন্ত্রগুলো জোড়ে। একটা Wi-Fi অংশ, যাকে বলে Access Point, যেটা বেতার যন্ত্রগুলো জোড়ে। আর একটা আসল Router, যেটা এই পুরো LAN কে বাইরের ISP এর সাথে জোড়ে। এই কারণেই একটা শব্দ, Router, নিয়ে এত গোলমাল, কারণ বাসার বাক্সটা আসলে তিন কাজ একসাথে করে।"
    >
      <rect
        x={30}
        y={30}
        width={580}
        height={200}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth="1.3"
      />
      <SketchText x={320} y={50} size={11} bold>
        বাসার একটা বাক্স, যাকে বলি Router
      </SketchText>

      <SketchBox
        x={70}
        y={90}
        w={130}
        h={54}
        title="Switch"
        sub="তারের যন্ত্র জোড়ে"
        accent
      />
      <SketchBox
        x={255}
        y={90}
        w={130}
        h={54}
        title="Wi-Fi AP"
        sub="বেতার যন্ত্র জোড়ে"
        accent
      />
      <SketchBox
        x={440}
        y={90}
        w={130}
        h={54}
        title="Router"
        sub="বাইরে জোড়ে"
        accent
      />

      {/* devices inside */}
      <SketchBox x={70} y={176} w={60} h={30} title="PC" sub="" />
      <SketchBox x={140} y={176} w={60} h={30} title="TV" sub="" />
      <SketchBox x={255} y={176} w={60} h={30} title="Phone" sub="" />
      <SketchBox x={325} y={176} w={60} h={30} title="Laptop" sub="" />
      <line
        x1={100}
        y1={144}
        x2={100}
        y2={176}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth="1.1"
      />
      <line
        x1={135}
        y1={144}
        x2={170}
        y2={176}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth="1.1"
      />
      <line
        x1={300}
        y1={144}
        x2={285}
        y2={176}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth="1.1"
      />
      <line
        x1={320}
        y1={144}
        x2={355}
        y2={176}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth="1.1"
      />

      {/* router to outside */}
      <line
        x1={505}
        y1={144}
        x2={505}
        y2={186}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#hb-a)"
      />
      <SketchText x={505} y={200} size={9} accent bold>
        ISP, বাইরে
      </SketchText>
      <SketchText x={505} y={214} size={8} opacity={0.6}>
        WAN এর দিকে
      </SketchText>

      {/* internal links between the three */}
      <line
        x1={200}
        y1={117}
        x2={255}
        y2={117}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth="1"
      />
      <line
        x1={385}
        y1={117}
        x2={440}
        y2={117}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth="1"
      />
      <Defs id="hb-a" accent />
    </Sketch>
  );
}
