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
/* 1. এক বিল্ডিং, অনেক ফ্ল্যাট                                                  */
/* ------------------------------------------------------------------------- */

const FLATS = [
  { port: "22", name: "sshd", what: "Terminal থেকে ঢোকা" },
  { port: "80", name: "nginx", what: "Web, খোলা খাম" },
  { port: "443", name: "nginx", what: "Web, বন্ধ খাম", hot: true },
  { port: "3000", name: "node", what: "Island Tours API" },
  { port: "5432", name: "postgres", what: "Database" },
  { port: "6379", name: "redis", what: "Cache" },
];

export function BuildingDiagram() {
  const rowH = 34;
  const top = 60;
  const h = top + FLATS.length * rowH + 40;
  return (
    <Sketch
      label="Diagram: এক ঠিকানা, ছয়টা দরজা"
      height={h}
      minWidth={820}
      viewBox={`0 0 820 ${h}`}
      caption="বিল্ডিংটার ঠিকানা একটাই, 103.94.135.2। কিন্তু ভেতরে ছয়টা Program চলছে, প্রত্যেকে নিজের ফ্ল্যাটে। চিঠির খামে তাই শুধু বিল্ডিংয়ের ঠিকানা লিখলে হয় না, ফ্ল্যাটের নম্বরও লিখতে হয়। ওই নম্বরটার নাম Port। গেটে বসা ম্যানেজার, মানে Kernel, খামের 443 দেখে ঠিক nginx এর দরজায় কড়া নাড়ে। ফ্ল্যাটের নম্বর ছাড়া চিঠিটা গেটেই পড়ে থাকত।"
    >
      {/* the letter */}
      <rect
        x={20}
        y={top + 60}
        width={150}
        height={64}
        fill="var(--primary)"
        fillOpacity={0.08}
        stroke="var(--primary)"
        strokeWidth="1.2"
      />
      <SketchText x={95} y={top + 78} size={8} opacity={0.6}>
        খাম
      </SketchText>
      <SketchText x={95} y={top + 96} size={11} bold>
        103.94.135.2
      </SketchText>
      <SketchText x={95} y={top + 113} size={11} bold accent>
        : 443
      </SketchText>
      <SketchText x={95} y={top + 140} size={8} opacity={0.6} body>
        বিল্ডিং : ফ্ল্যাট
      </SketchText>

      {/* the gate */}
      <line
        x1={170}
        y1={top + 92}
        x2={236}
        y2={top + 92}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#bd-a)"
      />
      <SketchBox
        x={240}
        y={top + 62}
        w={120}
        h={60}
        title="Kernel"
        sub="গেটের ম্যানেজার"
        accent
      />
      <SketchText x={300} y={top + 140} size={8} opacity={0.6} body>
        ফ্ল্যাটের নম্বর পড়ে
      </SketchText>

      {/* building */}
      <rect
        x={420}
        y={20}
        width={380}
        height={h - 40}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth="1.2"
      />
      <SketchText x={610} y={40} size={10} bold>
        103.94.135.2
      </SketchText>
      <SketchText x={610} y={53} size={8} opacity={0.55}>
        একটাই বিল্ডিং, একটাই ঠিকানা
      </SketchText>

      {FLATS.map((f, i) => {
        const y = top + i * rowH;
        return (
          <g key={f.port}>
            <rect
              x={436}
              y={y}
              width={348}
              height={rowH - 6}
              fill={f.hot ? "var(--primary)" : "transparent"}
              fillOpacity={f.hot ? 0.12 : 0}
              stroke={f.hot ? "var(--primary)" : "currentColor"}
              strokeOpacity={f.hot ? 1 : 0.3}
              strokeWidth="1"
            />
            <SketchText x={470} y={y + 18} size={10} bold accent={f.hot}>
              {f.port}
            </SketchText>
            <SketchText
              x={560}
              y={y + 18}
              size={10}
              anchor="start"
              bold={f.hot}
            >
              {f.name}
            </SketchText>
            <SketchText
              x={660}
              y={y + 18}
              size={8.5}
              anchor="start"
              opacity={0.65}
              body
            >
              {f.what}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={470} y={top - 8} size={7.5} opacity={0.5}>
        PORT
      </SketchText>
      <SketchText x={560} y={top - 8} size={7.5} anchor="start" opacity={0.5}>
        PROGRAM
      </SketchText>

      {/* manager to flat 443 */}
      <path
        d={`M 360 ${top + 92} L 400 ${top + 92} L 400 ${top + 2 * rowH + 14} L 436 ${top + 2 * rowH + 14}`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#bd-a)"
      />
      <Defs id="bd-a" accent />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Kernel এর ভেতরে খামটা বড় হয়                                              */
/* ------------------------------------------------------------------------- */

const LAYERS = [
  {
    name: "আপনার Program",
    sub: "node, Browser",
    adds: "Tour list দাও",
    note: "শুধু কথাটা লেখে",
  },
  {
    name: "Socket",
    sub: "দরজা, Syscall",
    adds: "",
    note: "Kernel এর হাতে তুলে দেয়",
  },
  {
    name: "Transport",
    sub: "TCP বা UDP",
    adds: "Port: 443 → 51234",
    note: "ফ্ল্যাটের নম্বর লেখে",
  },
  {
    name: "Network",
    sub: "IP",
    adds: "ঠিকানা: 103.94.135.2",
    note: "বিল্ডিংয়ের ঠিকানা লেখে",
  },
  {
    name: "Network Card",
    sub: "তার বা বাতাস",
    adds: "বিদ্যুৎ বা রেডিও",
    note: "বাইরে বেরিয়ে যায়",
  },
];

export function NetworkStackDiagram() {
  const rowH = 52;
  const top = 30;
  const h = top + LAYERS.length * rowH + 30;
  return (
    <Sketch
      label="Diagram: কথাটা নিচে নামতে নামতে খামে চড়ে"
      height={h}
      minWidth={820}
      viewBox={`0 0 820 ${h}`}
      caption="আপনার Program শুধু কথাটা লেখে। তারপর Socket দিয়ে Kernel এর হাতে দেয়, আর Kernel সিঁড়ি বেয়ে নামতে নামতে খামের উপরে একটা একটা করে লেখা যোগ করে। প্রথমে ফ্ল্যাটের নম্বর, তারপর বিল্ডিংয়ের ঠিকানা, তারপর সেটা বিদ্যুৎ হয়ে তারে ওঠে। ওপাশের মেশিনে ঠিক উল্টোটা হয়, সিঁড়ি বেয়ে উঠতে উঠতে খাম খোলা হয়। এই সিঁড়ির নাম Network Stack। ধাপগুলোর ভেতরে কী লেখা হয়, সেটা Module 05 এর পুরোটা। এখানে শুধু জানুন, সিঁড়িটা আছে, আর Port লেখার ধাপটা Kernel এর।"
    >
      <SketchText x={140} y={20} size={8} opacity={0.5}>
        সিঁড়ি, উপর থেকে নিচে
      </SketchText>
      <SketchText x={560} y={20} size={8} opacity={0.5}>
        খামের উপরে যা যোগ হলো
      </SketchText>
      {LAYERS.map((l, i) => {
        const y = top + i * rowH;
        const kernel = i >= 1 && i <= 3;
        return (
          <g key={l.name}>
            <SketchBox
              x={40}
              y={y}
              w={200}
              h={rowH - 10}
              title={l.name}
              sub={l.sub}
              accent={kernel}
            />
            <SketchText
              x={300}
              y={y + 24}
              size={8.5}
              anchor="start"
              opacity={0.7}
              body
            >
              {l.note}
            </SketchText>
            {i < LAYERS.length - 1 && (
              <line
                x1={140}
                y1={y + rowH - 10}
                x2={140}
                y2={y + rowH}
                stroke="currentColor"
                strokeOpacity={0.5}
                strokeWidth="1.2"
                markerEnd="url(#ns-a)"
              />
            )}
            {/* envelope grows: show every label accumulated so far */}
            <rect
              x={470}
              y={y + 4}
              width={320}
              height={rowH - 18}
              fill={kernel ? "var(--primary)" : "transparent"}
              fillOpacity={kernel ? 0.06 : 0}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth="1"
            />
            {LAYERS.slice(0, i + 1)
              .filter((x) => x.adds)
              .map((x, k) => (
                <SketchText
                  key={x.name}
                  x={480 + k * 105}
                  y={y + 25}
                  size={7.5}
                  anchor="start"
                  accent={x.name === l.name}
                  opacity={x.name === l.name ? 1 : 0.55}
                >
                  {x.adds.length > 18 ? x.adds.slice(0, 18) : x.adds}
                </SketchText>
              ))}
          </g>
        );
      })}
      <rect
        x={28}
        y={top + rowH - 4}
        width={224}
        height={3 * rowH - 4}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity={0.5}
        strokeWidth="1"
        strokeDasharray="5 4"
      />
      <SketchText
        x={140}
        y={top + 4 * rowH + 2}
        size={7.5}
        accent
        opacity={0.8}
      >
        এই তিন ধাপ Kernel এর
      </SketchText>
      <Defs id="ns-a" />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. localhost কখনো বাইরে যায় না                                               */
/* ------------------------------------------------------------------------- */

export function LoopbackSplitDiagram() {
  return (
    <SketchSplit
      label="Diagram: localhost আর আসল ঠিকানা"
      caption="বাম পাশে আপনি নিজের মেশিনে localhost:3000 লিখলেন। Kernel খামে 127.0.0.1 দেখে বুঝল, এটা তো এই বিল্ডিংয়েরই, আর গেট থেকেই ঘুরিয়ে ভেতরে ফ্ল্যাট 3000 এ দিয়ে দিল। Network Card পর্যন্ত খামটা গেলই না, তাই Wi-Fi বন্ধ থাকলেও কাজ করে। ডান পাশে Phone থেকে আসল ঠিকানায় চিঠি এলো, Card হয়ে গেটে, তারপর একই ফ্ল্যাটে। ফ্ল্যাট এক, রাস্তা আলাদা। আর এই কারণেই বন্ধুর মেশিনে localhost মানে বন্ধুর বিল্ডিং, আপনার নয়।"
      panels={[
        {
          title: "localhost:3000",
          sub: "127.0.0.1, নিজের কাছে চিঠি",
          viewBox: "0 0 320 190",
          height: 190,
          children: (
            <g>
              <SketchBox
                x={20}
                y={20}
                w={110}
                h={40}
                title="curl"
                sub="আপনার Terminal"
              />
              <SketchBox
                x={20}
                y={130}
                w={110}
                h={40}
                title="node"
                sub="ফ্ল্যাট 3000"
                accent
              />
              <SketchBox
                x={190}
                y={75}
                w={110}
                h={40}
                title="Kernel"
                sub="গেট"
                accent
              />
              <rect
                x={205}
                y={150}
                width={80}
                height={26}
                fill="transparent"
                stroke="currentColor"
                strokeOpacity={0.25}
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <SketchText x={245} y={167} size={8} opacity={0.4}>
                Network Card
              </SketchText>
              <SketchText x={245} y={186} size={7} opacity={0.45} body>
                খাম এখানে আসেই না
              </SketchText>
              <path
                d="M 130 40 L 190 85"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#lb-a)"
              />
              <path
                d="M 190 105 L 130 150"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#lb-a)"
              />
              <SketchText x={170} y={58} size={7.5} accent>
                127.0.0.1:3000
              </SketchText>
              <SketchText x={172} y={140} size={7.5} accent>
                ঘুরিয়ে ভেতরে
              </SketchText>
              <Defs id="lb-a" accent />
            </g>
          ),
        },
        {
          title: "192.168.0.12:3000",
          sub: "Phone থেকে, আসল ঠিকানায়",
          viewBox: "0 0 320 190",
          height: 190,
          children: (
            <g>
              <SketchBox
                x={20}
                y={20}
                w={110}
                h={40}
                title="Phone"
                sub="একই Wi-Fi"
              />
              <SketchBox
                x={20}
                y={130}
                w={110}
                h={40}
                title="node"
                sub="ফ্ল্যাট 3000"
                accent
              />
              <SketchBox
                x={190}
                y={75}
                w={110}
                h={40}
                title="Kernel"
                sub="গেট"
                accent
              />
              <rect
                x={205}
                y={20}
                width={80}
                height={26}
                fill="var(--primary)"
                fillOpacity={0.1}
                stroke="var(--primary)"
                strokeWidth="1"
              />
              <SketchText x={245} y={37} size={8} accent>
                Network Card
              </SketchText>
              <path
                d="M 130 33 L 205 33"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.6}
                strokeWidth="1.3"
                markerEnd="url(#lb-b)"
              />
              <path
                d="M 245 46 L 245 75"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.6}
                strokeWidth="1.3"
                markerEnd="url(#lb-b)"
              />
              <path
                d="M 190 105 L 130 150"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#lb-a)"
              />
              <SketchText x={165} y={26} size={7.5} opacity={0.7}>
                বাতাসে
              </SketchText>
              <SketchText x={172} y={140} size={7.5} accent>
                গেট থেকে ফ্ল্যাটে
              </SketchText>
              <Defs id="lb-b" />
            </g>
          ),
        },
      ]}
    />
  );
}
