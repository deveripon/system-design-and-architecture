import { Sketch, SketchBox, SketchSplit, SketchText } from "../../sketch";

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
/* 1. ভেতরের দুনিয়া আর বাইরের দুনিয়া                                          */
/* ------------------------------------------------------------------------- */

const INSIDE_DEVICES = [
  { name: "Laptop", ip: "192.168.0.5" },
  { name: "Phone", ip: "192.168.0.6" },
  { name: "TV", ip: "192.168.0.7" },
];

export function InsideOutsideDiagram() {
  return (
    <Sketch
      label="Diagram: ভেতরে Private, বাইরে একটা Public"
      height={330}
      minWidth={860}
      viewBox="0 0 860 330"
      caption="একটা বাসার দুইটা দুনিয়া। ভেতরের দুনিয়ায় Laptop, Phone, TV, প্রত্যেকের নিজের একটা Private IP, যেগুলো 192.168 দিয়ে শুরু। মাঝখানে Router দুই দিকেই এক পা রেখে দাঁড়িয়ে, ভেতরের দিকে তার একটা Private ঠিকানা (192.168.0.1), আর বাইরের দিকে ISP এর দেওয়া একটাই Public ঠিকানা (103.94.135.2)। বাইরের Internet পুরো বাসাটাকে চেনে শুধু ওই একটা Public IP দিয়ে, ভেতরের কে কোনটা সেটা সে জানে না।"
    >
      <Arrow id="io-a" />

      {/* boundary */}
      <line
        x1={352}
        y1={40}
        x2={352}
        y2={296}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth="1.3"
        strokeDasharray="5 4"
      />
      <SketchText x={352} y={30} size={8.5} opacity={0.6} body>
        সীমানা
      </SketchText>

      {/* inside world */}
      <SketchText x={186} y={30} size={10} bold anchor="middle">
        বাসার ভেতর (LAN)
      </SketchText>
      <rect
        x={30}
        y={44}
        width={300}
        height={244}
        fill="currentColor"
        fillOpacity={0.03}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth="1.2"
      />
      {INSIDE_DEVICES.map((d, i) => (
        <SketchBox
          key={d.ip}
          x={70}
          y={68 + i * 66}
          w={220}
          h={48}
          title={d.name}
          sub={d.ip}
        />
      ))}
      <SketchText x={186} y={278} size={8.5} accent bold>
        সবাই Private, বাইরে থেকে দেখা যায় না
      </SketchText>

      {/* router at the gate */}
      <rect
        x={378}
        y={132}
        width={120}
        height={80}
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeWidth="1.4"
      />
      <SketchText x={438} y={158} size={12} bold accent>
        Router
      </SketchText>
      <SketchText x={438} y={177} size={8.5} opacity={0.8} body>
        ভেতরে 192.168.0.1
      </SketchText>
      <SketchText x={438} y={193} size={8.5} opacity={0.8} body>
        বাইরে 103.94.135.2
      </SketchText>

      {/* inside -> router */}
      <line
        x1={330}
        y1={172}
        x2={378}
        y2={172}
        stroke="var(--primary)"
        strokeWidth="1.3"
        markerEnd="url(#io-a)"
      />

      {/* outside world */}
      <SketchText x={660} y={30} size={10} bold anchor="middle">
        বাইরের দুনিয়া (Internet)
      </SketchText>
      <rect
        x={556}
        y={148}
        width={104}
        height={48}
        fill="currentColor"
        fillOpacity={0.05}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.2"
      />
      <SketchText x={608} y={177} size={11} bold>
        Internet
      </SketchText>
      <SketchBox
        x={700}
        y={148}
        w={128}
        h={48}
        title="Server"
        sub="103.20.5.8"
        accent
      />
      <line
        x1={498}
        y1={172}
        x2={556}
        y2={172}
        stroke="var(--primary)"
        strokeWidth="1.3"
        markerEnd="url(#io-a)"
      />
      <line
        x1={660}
        y1={172}
        x2={700}
        y2={172}
        stroke="var(--primary)"
        strokeWidth="1.3"
        markerEnd="url(#io-a)"
      />
      <SketchText x={660} y={214} size={8.5} accent bold>
        Internet পুরো বাসাকে চেনে একটা Public IP তে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. তিনটা রিজার্ভ করা Private ব্লক                                          */
/* ------------------------------------------------------------------------- */

const RANGES = [
  {
    range: "10.0.0.0  থেকে  10.255.255.255",
    note: "প্রায় ১.৬ কোটি ঠিকানা, বড় কোম্পানি আর Cloud এ",
    accent: false,
  },
  {
    range: "172.16.0.0  থেকে  172.31.255.255",
    note: "প্রায় ১০ লাখ, মাঝারি Network এ",
    accent: false,
  },
  {
    range: "192.168.0.0  থেকে  192.168.255.255",
    note: "প্রায় ৬৫ হাজার, বাসার Router এ প্রায় সবসময় এটাই",
    accent: true,
  },
];

export function PrivateRangesDiagram() {
  const rowH = 74;
  const top = 24;
  const h = top + RANGES.length * rowH + 10;
  return (
    <Sketch
      label="Diagram: তিনটা Private ব্লক, যেকোনো বাসা ব্যবহার করতে পারে"
      height={h}
      minWidth={720}
      viewBox={`0 0 720 ${h}`}
      caption="পুরো IP জগতের ভেতরে তিনটা ব্লক আলাদা করে রাখা আছে Private এর জন্য। এই ঠিকানাগুলো Internet এ কখনো ব্যবহার হয় না, তাই যেকোনো বাসা বা অফিস নিজের ভেতরে এগুলো কাউকে না জিজ্ঞেস করেই ব্যবহার করতে পারে। বাসার Router প্রায় সবসময় শেষ ব্লকটা, মানে 192.168 দিয়ে শুরু ঠিকানা বিলি করে, তাই ওটা সবচেয়ে চেনা।"
    >
      {RANGES.map((r, i) => {
        const y = top + i * rowH;
        return (
          <g key={r.range}>
            <rect
              x={30}
              y={y}
              width={660}
              height={rowH - 16}
              fill={r.accent ? "var(--primary)" : "currentColor"}
              fillOpacity={r.accent ? 0.1 : 0.03}
              stroke={r.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={r.accent ? 1 : 0.35}
              strokeWidth="1.3"
            />
            <SketchText
              x={52}
              y={y + 26}
              size={15}
              anchor="start"
              bold
              accent={r.accent}
            >
              {r.range}
            </SketchText>
            <SketchText
              x={52}
              y={y + 46}
              size={9.5}
              anchor="start"
              body
              opacity={0.65}
            >
              {r.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. একই Private IP, দুই বাসা, কোনো ঠোকাঠুকি নেই                              */
/* ------------------------------------------------------------------------- */

function House({ publicIp, arrowId }: { publicIp: string; arrowId: string }) {
  return (
    <g>
      <Arrow id={arrowId} />
      <rect
        x={30}
        y={26}
        width={240}
        height={64}
        fill="currentColor"
        fillOpacity={0.04}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth="1.2"
      />
      <SketchText x={150} y={52} size={12} bold>
        Laptop
      </SketchText>
      <SketchText x={150} y={72} size={12} accent bold>
        192.168.0.5
      </SketchText>

      <line
        x1={150}
        y1={90}
        x2={150}
        y2={116}
        stroke="var(--primary)"
        strokeWidth="1.3"
        markerEnd={`url(#${arrowId})`}
      />

      <rect
        x={60}
        y={116}
        width={180}
        height={44}
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      <SketchText x={150} y={135} size={9} opacity={0.75} body>
        Public IP
      </SketchText>
      <SketchText x={150} y={151} size={12} accent bold>
        {publicIp}
      </SketchText>
    </g>
  );
}

export function ReuseDiagram() {
  return (
    <SketchSplit
      label="Diagram: একই ভেতরের ঠিকানা, আলাদা বাসা"
      caption="খেয়াল করুন, দুই বাসাতেই Laptop এর ঠিকানা হুবহু একই, 192.168.0.5। তবু কোনো গণ্ডগোল হয় না, কারণ এই ঠিকানা দুইটা দুই আলাদা ভেতরের দুনিয়ায় বাস করে, একে অপরকে দেখতেও পায় না। Internet শুধু বাসার বাইরের Public IP চেনে, আর সেই দুইটা আলাদা। এই কারণেই পৃথিবীর কোটি কোটি বাসা একই 192.168 ঠিকানা ব্যবহার করেও ঠিকঠাক চলে, আর এটাই সীমিত IP বাঁচানোর মূল কৌশল।"
      panels={[
        {
          title: "বাসা A",
          sub: "নিজের ভেতরের দুনিয়া",
          viewBox: "0 0 300 176",
          height: 176,
          children: <House publicIp="103.94.135.2" arrowId="reuse-a" />,
        },
        {
          title: "বাসা B",
          sub: "আলাদা ভেতরের দুনিয়া",
          viewBox: "0 0 300 176",
          height: 176,
          children: <House publicIp="45.120.8.9" arrowId="reuse-b" />,
        },
      ]}
    />
  );
}
