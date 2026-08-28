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
/* 1. একটা MAC Address এর ভেতরে                                                */
/* ------------------------------------------------------------------------- */

const PAIRS = ["a4", "83", "e7", "2b", "11", "0c"];

export function MacAnatomyDiagram() {
  const w = 88;
  const gap = 10;
  const startX = (760 - (PAIRS.length * w + (PAIRS.length - 1) * gap)) / 2;
  return (
    <Sketch
      label="Diagram: a4:83:e7:2b:11:0c এর ভেতরে"
      height={230}
      minWidth={760}
      viewBox="0 0 760 230"
      caption="একটা MAC Address ছয় জোড়া সংখ্যা, মোট ৪৮টা Bit। বাঁ দিকের তিন জোড়া বলে কোন কোম্পানি Card টা বানিয়েছে, Apple, Samsung, Intel, প্রত্যেকের নিজের একটা কোড আছে। ডান দিকের তিন জোড়া ওই কোম্পানির দেওয়া একটা নম্বর, যাতে তাদের বানানো কোটি কোটি Card এর মধ্যে এই একটাকে আলাদা করা যায়। দুইটা মিলিয়ে পৃথিবীর প্রতিটা Network Card এর একটা অনন্য নম্বর, যেটা কারখানাতেই গেঁথে দেওয়া হয়।"
    >
      {PAIRS.map((p, i) => {
        const x = startX + i * (w + gap);
        const vendor = i < 3;
        return (
          <g key={i}>
            <rect
              x={x}
              y={70}
              width={w}
              height={54}
              fill={vendor ? "var(--primary)" : "currentColor"}
              fillOpacity={vendor ? 0.12 : 0.04}
              stroke={vendor ? "var(--primary)" : "currentColor"}
              strokeOpacity={vendor ? 1 : 0.4}
              strokeWidth="1.3"
            />
            <SketchText x={x + w / 2} y={104} size={18} bold accent={vendor}>
              {p}
            </SketchText>
          </g>
        );
      })}
      {/* group brackets */}
      <line
        x1={startX}
        y1={140}
        x2={startX + 3 * w + 2 * gap}
        y2={140}
        stroke="var(--primary)"
        strokeWidth="1.4"
      />
      <SketchText
        x={startX + (3 * w + 2 * gap) / 2}
        y={160}
        size={10}
        bold
        accent
      >
        কোম্পানির কোড
      </SketchText>
      <SketchText
        x={startX + (3 * w + 2 * gap) / 2}
        y={176}
        size={8.5}
        opacity={0.65}
        body
      >
        কে বানিয়েছে
      </SketchText>
      <line
        x1={startX + 3 * (w + gap)}
        y1={140}
        x2={startX + 6 * w + 5 * gap}
        y2={140}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.4"
      />
      <SketchText
        x={startX + 3 * (w + gap) + (3 * w + 2 * gap) / 2}
        y={160}
        size={10}
        bold
      >
        Card এর নম্বর
      </SketchText>
      <SketchText
        x={startX + 3 * (w + gap) + (3 * w + 2 * gap) / 2}
        y={176}
        size={8.5}
        opacity={0.65}
        body
      >
        ওই কোম্পানির ভেতরে অনন্য
      </SketchText>
      <SketchText x={380} y={40} size={9} opacity={0.55}>
        ৬ জোড়া, ৪৮ Bit, কারখানায় গাঁথা
      </SketchText>
      <SketchText x={380} y={212} size={8.5} opacity={0.55} body>
        প্রতিটা Network Card এর নিজের, পৃথিবীতে অনন্য
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. MAC নাম, IP ঠিকানা                                                       */
/* ------------------------------------------------------------------------- */

export function MacVsIpSplit() {
  return (
    <SketchSplit
      label="Diagram: হাতে হাতে বদলায়, ঠিকানা এক থাকে"
      caption="একটা চিঠির দুই ধরনের ঠিকানা ভাবুন। খামের উপরে লেখা চূড়ান্ত গন্তব্য, সেটা পুরো পথে এক থাকে, নাহলে চিঠি হারাবে। এটাই IP Address, শুরু থেকে শেষ। কিন্তু এক ডাকপিয়ন থেকে আরেক ডাকপিয়নের হাতে যাওয়ার মুহূর্তে, এই মুহূর্তে কে কাকে দিচ্ছে, সেটা প্রতিবার বদলায়। এটাই MAC Address, হাতে হাতে, এক ধাপের। IP বলে শেষমেশ কোথায়, MAC বলে এই মুহূর্তে ঠিক পাশের কে।"
      panels={[
        {
          title: "IP, চূড়ান্ত গন্তব্য",
          sub: "শুরু থেকে শেষ, এক",
          viewBox: "0 0 300 170",
          height: 170,
          children: (
            <g>
              <SketchBox x={20} y={30} w={80} h={36} title="আপনি" sub="" />
              <SketchBox
                x={200}
                y={30}
                w={80}
                h={36}
                title="Server"
                sub=""
                accent
              />
              <rect
                x={20}
                y={90}
                width={260}
                height={30}
                fill="var(--primary)"
                fillOpacity={0.1}
                stroke="var(--primary)"
                strokeWidth="1.2"
              />
              <SketchText x={150} y={109} size={11} accent bold>
                103.94.135.2
              </SketchText>
              <SketchText x={150} y={140} size={9} body opacity={0.7}>
                পুরো পথে একই ঠিকানা
              </SketchText>
              <SketchText x={150} y={156} size={8} body opacity={0.55}>
                চিঠির উপরের লেখা
              </SketchText>
            </g>
          ),
        },
        {
          title: "MAC, এই ধাপের",
          sub: "প্রতি Hop এ বদলায়",
          viewBox: "0 0 300 170",
          height: 170,
          children: (
            <g>
              <SketchBox x={10} y={30} w={64} h={34} title="আপনি" sub="" />
              <SketchBox
                x={118}
                y={30}
                w={64}
                h={34}
                title="Router"
                sub=""
                accent
              />
              <SketchBox x={226} y={30} w={64} h={34} title="পরের" sub="" />
              <line
                x1={74}
                y1={47}
                x2={118}
                y2={47}
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#mv-a)"
              />
              <line
                x1={182}
                y1={47}
                x2={226}
                y2={47}
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#mv-a)"
              />
              <SketchText x={96} y={90} size={8} accent>
                MAC ১
              </SketchText>
              <SketchText x={204} y={90} size={8} accent>
                MAC ২
              </SketchText>
              <SketchText x={150} y={120} size={9} body opacity={0.7}>
                প্রতি হাত বদলে নতুন MAC
              </SketchText>
              <SketchText x={150} y={150} size={8} body opacity={0.55}>
                এই মুহূর্তে ঠিক পাশের কে
              </SketchText>
              <Defs id="mv-a" accent />
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Switch এর টেবিল                                                          */
/* ------------------------------------------------------------------------- */

const TABLE = [
  { port: "Port ১", mac: "a4:83:e7:...:0c", dev: "Laptop" },
  { port: "Port ২", mac: "3c:22:fb:...:91", dev: "Phone" },
  { port: "Port ৩", mac: "b8:27:eb:...:4a", dev: "TV" },
  { port: "Port ৪", mac: "d0:37:45:...:e2", dev: "Printer" },
];

export function SwitchTableDiagram() {
  const rowH = 40;
  const top = 50;
  const h = top + TABLE.length * rowH + 30;
  return (
    <Sketch
      label="Diagram: Switch এর মুখস্থ টেবিল"
      height={h}
      minWidth={640}
      viewBox={`0 0 640 ${h}`}
      caption="Lesson 02 এ Switch এর যে চালাকির কথা বলেছিলাম, এই টেবিলটাই সেটা। Switch মনে রাখে কোন MAC কোন Port এ বসা যন্ত্রের। যখন কোনো চিঠি আসে, সে খামের গন্তব্যের MAC দেখে টেবিলে মেলায়, আর ঠিক সেই Port এই পাঠায়, বাকি কাউকে নয়। এই টেবিলের চাবি হলো MAC, আর এই কারণেই MAC ছাড়া Switch অন্ধ হয়ে যেত, সবাইকে কপি করে Hub এ পরিণত হতো।"
    >
      <SketchText x={100} y={30} size={9} anchor="start" opacity={0.55}>
        যে Port এ
      </SketchText>
      <SketchText x={280} y={30} size={9} anchor="start" opacity={0.55}>
        সেখানকার MAC
      </SketchText>
      <SketchText x={500} y={30} size={9} anchor="start" opacity={0.55}>
        মানে যন্ত্র
      </SketchText>
      {TABLE.map((r, i) => {
        const y = top + i * rowH;
        return (
          <g key={r.port}>
            <rect
              x={24}
              y={y}
              width={592}
              height={rowH - 8}
              fill={i === 0 ? "var(--primary)" : "transparent"}
              fillOpacity={i === 0 ? 0.08 : 0}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth="1"
            />
            <SketchText
              x={100}
              y={y + 20}
              size={10}
              anchor="start"
              bold
              accent={i === 0}
            >
              {r.port}
            </SketchText>
            <SketchText x={280} y={y + 20} size={10} anchor="start" body>
              {r.mac}
            </SketchText>
            <SketchText
              x={500}
              y={y + 20}
              size={9.5}
              anchor="start"
              opacity={0.7}
              body
            >
              {r.dev}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
