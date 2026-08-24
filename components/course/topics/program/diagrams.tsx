import { Sketch, SketchBox, SketchSplit, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* 1. The whole journey, source file to a running Process                     */
/* ------------------------------------------------------------------------- */

export function SourceToProcessDiagram() {
  return (
    <Sketch
      label="Diagram: কাগজ থেকে জ্যান্ত Process"
      height={230}
      minWidth={860}
      viewBox="0 0 860 230"
      caption="উপরের সারিটা Disk এ পড়ে থাকা ফাইল, নিচের সারিটা RAM এ চলতে থাকা Process। মাঝখানের exec ধাপটাই সীমানা, আর ওই এক ধাপেই একটা মরা ফাইল জ্যান্ত হয়ে ওঠে।"
    >
      <SketchText x={16} y={26} size={9} anchor="start" opacity={0.55}>
        DISK, শুধু পড়ে থাকা ফাইল
      </SketchText>

      <SketchBox
        x={16}
        y={40}
        w={150}
        h={54}
        title="server.js"
        sub="আপনার লেখা Text"
      />
      <SketchBox
        x={216}
        y={40}
        w={150}
        h={54}
        title="Compiler / Node"
        sub="অনুবাদক"
      />
      <SketchBox
        x={416}
        y={40}
        w={170}
        h={54}
        title="Machine Code"
        sub="CPU যা বোঝে"
        accent
      />

      {/* disk row arrows */}
      <Arrow x1={166} x2={216} y={67} label="পড়ে" />
      <Arrow x1={366} x2={416} y={67} label="অনুবাদ" />

      {/* the boundary */}
      <line
        x1={16}
        y1={118}
        x2={844}
        y2={118}
        stroke="currentColor"
        strokeOpacity={0.25}
        strokeDasharray="5 4"
      />
      <SketchText x={636} y={78} size={10} accent bold anchor="start">
        exec()
      </SketchText>
      <SketchText x={636} y={92} size={9} anchor="start" opacity={0.6}>
        Kernel এখানে হাত দেয়
      </SketchText>
      <path
        d="M 586 67 L 620 67 L 620 179 L 586 179"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#program-arrow-accent)"
      />

      <SketchText x={16} y={142} size={9} anchor="start" opacity={0.55}>
        RAM, চলতে থাকা Process
      </SketchText>

      <SketchBox
        x={416}
        y={152}
        w={170}
        h={54}
        title="Process"
        sub="নিজের PID, নিজের Memory"
        accent
      />
      <SketchBox
        x={216}
        y={152}
        w={150}
        h={54}
        title="CPU"
        sub="Fetch, Decode, Execute"
      />
      <SketchBox
        x={16}
        y={152}
        w={150}
        h={54}
        title="Kernel"
        sub="Syscall এর উত্তর দেয়"
      />

      <Arrow x1={416} x2={366} y={179} reverse />
      <Arrow x1={216} x2={166} y={179} reverse />

      <defs>
        <marker
          id="program-arrow"
          markerWidth={8}
          markerHeight={8}
          refX={7}
          refY={3.5}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" fillOpacity={0.55} />
        </marker>
        <marker
          id="program-arrow-accent"
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
    </Sketch>
  );
}

function Arrow({
  x1,
  x2,
  y,
  label,
  reverse,
}: {
  x1: number;
  x2: number;
  y: number;
  label?: string;
  reverse?: boolean;
}) {
  const from = reverse ? x2 : x1;
  const to = reverse ? x1 : x2;
  return (
    <g>
      <line
        x1={from}
        y1={y}
        x2={to}
        y2={y}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.2"
        markerEnd="url(#program-arrow)"
      />
      {label && (
        <SketchText x={(x1 + x2) / 2} y={y - 8} size={9} opacity={0.6}>
          {label}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Two roads from source to instruction                                    */
/* ------------------------------------------------------------------------- */

export function CompileVsInterpretDiagram() {
  return (
    <SketchSplit
      label="Diagram: অনুবাদ আগে, নাকি চলার সময়"
      caption="Compiled ভাষায় অনুবাদের কাজটা একবার হয়, আপনার মেশিনে, ইউজারের কাছে যায় শুধু ফল। JavaScript এ অনুবাদক ইউজারের মেশিনেই থাকে, তাই চালানোর জন্য Node লাগে। এই একটা তফাত থেকেই পরে Docker Image এর সাইজ আর Cold Start এর সময় দুইটাই ব্যাখ্যা হয়ে যায়।"
      panels={[
        {
          title: "Compiled",
          sub: "Go, Rust, C",
          viewBox: "0 0 300 250",
          height: 250,
          children: (
            <g>
              <SketchBox
                x={70}
                y={10}
                w={160}
                h={40}
                title="main.go"
                sub="Source"
              />
              <Down x={150} y1={50} y2={78} label="একবার" />
              <SketchBox
                x={70}
                y={78}
                w={160}
                h={40}
                title="Compiler"
                sub="আপনার মেশিনে"
              />
              <Down x={150} y1={118} y2={146} />
              <SketchBox
                x={70}
                y={146}
                w={160}
                h={40}
                title="Binary"
                sub="সরাসরি Machine Code"
                accent
              />
              <Down x={150} y1={186} y2={214} />
              <SketchText x={150} y={228} size={10} accent bold>
                CPU সরাসরি চালায়
              </SketchText>
              <SketchText x={150} y={243} size={9} opacity={0.6}>
                চলার সময় কোনো অনুবাদক নেই
              </SketchText>
              <defs>
                <marker
                  id="pd-down"
                  markerWidth={8}
                  markerHeight={8}
                  refX={7}
                  refY={3.5}
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path
                    d="M0,0 L7,3.5 L0,7 Z"
                    fill="currentColor"
                    fillOpacity={0.55}
                  />
                </marker>
              </defs>
            </g>
          ),
        },
        {
          title: "Interpreted, JIT",
          sub: "JavaScript, Python",
          viewBox: "0 0 300 250",
          height: 250,
          children: (
            <g>
              <SketchBox
                x={70}
                y={10}
                w={160}
                h={40}
                title="server.js"
                sub="Source যেমন আছে"
              />
              <Down x={150} y1={50} y2={78} label="প্রতিবার" />
              <SketchBox x={20} y={78} w={260} h={108} title="" dashed />
              <SketchText x={150} y={96} size={9} accent bold>
                NODE, নিজেই একটা Program
              </SketchText>
              <SketchBox x={38} y={108} w={106} h={34} title="Parser" />
              <SketchBox x={156} y={108} w={106} h={34} title="V8 JIT" accent />
              <SketchText x={150} y={162} size={9} opacity={0.75} body>
                যে অংশ বারবার চলে
              </SketchText>
              <SketchText x={150} y={176} size={9} opacity={0.75} body>
                সেটাই Machine Code হয়
              </SketchText>
              <Down x={150} y1={186} y2={214} />
              <SketchText x={150} y={228} size={10} accent bold>
                CPU চালায় Node কে
              </SketchText>
              <SketchText x={150} y={243} size={9} opacity={0.6}>
                আপনার কোড Node এর ভেতরে
              </SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}

function Down({
  x,
  y1,
  y2,
  label,
}: {
  x: number;
  y1: number;
  y2: number;
  label?: string;
}) {
  return (
    <g>
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.2"
        markerEnd="url(#pd-down)"
      />
      {label && (
        <SketchText
          x={x + 10}
          y={(y1 + y2) / 2 + 4}
          size={9}
          anchor="start"
          opacity={0.6}
        >
          {label}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. What exec() actually puts in memory                                     */
/* ------------------------------------------------------------------------- */

const SEGMENTS = [
  {
    title: "Stack",
    sub: "Function call, Local Variable",
    note: "নিচের দিকে বাড়ে",
    accent: true,
  },
  {
    title: "ফাঁকা জায়গা",
    sub: "দুইজনের বেড়ে ওঠার জায়গা",
    note: "",
    dashed: true,
  },
  {
    title: "Heap",
    sub: "new, malloc, বড় Object",
    note: "উপরের দিকে বাড়ে",
    accent: true,
  },
  {
    title: "Data",
    sub: "Global Variable, ধ্রুব সংখ্যা",
    note: "সাইজ আগেই জানা",
  },
  {
    title: "Text",
    sub: "আপনার Machine Code",
    note: "Read Only, বদলানো যায় না",
  },
];

export function ProcessMemoryDiagram() {
  const rowH = 46;
  const top = 34;
  return (
    <Sketch
      label="Diagram: exec() এর পর Memory তে কী থাকে"
      height={top + SEGMENTS.length * rowH + 42}
      minWidth={620}
      viewBox={`0 0 620 ${top + SEGMENTS.length * rowH + 42}`}
      caption="Stack নামে নিচে, Heap ওঠে উপরে, আর মাঝের ফাঁকা জায়গাটা দুইজনে ভাগ করে নেয়। এই দুইটা যেদিন মাঝখানে এসে ধাক্কা খায়, সেদিনই Out of Memory। Text অংশটা Read Only, তাই কোনো Bug আপনার নিজের কোড বদলে দিতে পারে না।"
    >
      <SketchText x={16} y={20} size={9} anchor="start" opacity={0.55}>
        উঁচু ঠিকানা
      </SketchText>
      <SketchText
        x={16}
        y={top + SEGMENTS.length * rowH + 32}
        size={9}
        anchor="start"
        opacity={0.55}
      >
        নিচু ঠিকানা
      </SketchText>

      {SEGMENTS.map((seg, i) => {
        const y = top + i * rowH;
        return (
          <g key={seg.title}>
            <SketchBox
              x={120}
              y={y}
              w={330}
              h={rowH - 8}
              title={seg.title}
              sub={seg.sub}
              accent={seg.accent}
              dashed={seg.dashed}
            />
            {seg.note && (
              <SketchText
                x={468}
                y={y + rowH / 2}
                size={9}
                anchor="start"
                opacity={0.65}
                body
              >
                {seg.note}
              </SketchText>
            )}
          </g>
        );
      })}

      {/* growth arrows in the gap */}
      <path
        d="M 96 60 L 96 93"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#pm-arrow)"
      />
      <path
        d="M 96 138 L 96 105"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#pm-arrow)"
      />
      <defs>
        <marker
          id="pm-arrow"
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
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. ফাইলটার ভেতরে উঁকি                                                      */
/* ------------------------------------------------------------------------- */

const FILE_PARTS = [
  {
    title: "শুরুর ৪ Byte",
    sub: "7f 45 4c 46",
    note: "নাম লেখা আছে, ELF. এটুকু দেখেই Kernel বোঝে ফাইলটা চালানো যাবে",
    accent: true,
  },
  {
    title: "Entry Point",
    sub: "যেমন 0x401040",
    note: "শুরু কোন ঠিকানা থেকে, সেটা এখানে লেখা থাকে",
    accent: true,
  },
  {
    title: "সূচিপত্র",
    sub: "Program Header",
    note: "কোন অংশ Memory র কোথায় গিয়ে বসবে, তার তালিকা",
  },
  {
    title: ".text",
    sub: "Machine Code",
    note: "আপনার লেখা কোড, অনুবাদ হওয়ার পরে",
  },
  {
    title: ".rodata",
    sub: "না বদলানো লেখা",
    note: "যেমন আপনার console.log এর ভেতরের কথাগুলো",
  },
  {
    title: ".data",
    sub: "Global Variable",
    note: "যাদের শুরুর মান আগেই বসানো আছে",
  },
  {
    title: ".bss",
    sub: "শুধু একটা সংখ্যা",
    note: "কতটুকু ফাঁকা জায়গা লাগবে তার হিসাব, ফাইলে জায়গা নেয় না",
  },
];

export function ExecutableFileDiagram() {
  const rowH = 40;
  const top = 36;
  const h = top + FILE_PARTS.length * rowH + 24;
  return (
    <Sketch
      label="Diagram: চালানোর ফাইলটার ভেতরে কী আছে"
      height={h}
      minWidth={760}
      viewBox={`0 0 760 ${h}`}
      caption="ফাইলটা শুধু কোডের স্তূপ নয়। উপরে নাম লেখা আছে, তারপর একটা সূচিপত্র আছে, আর তারপর ভাগ করা খোপগুলো আছে। Kernel প্রথমে নাম দেখে, তারপর সূচিপত্র পড়ে, তারপর খোপগুলো Memory তে বসিয়ে দেয়। শেষ খোপটা মজার, .bss শুধু বলে রাখে কতটুকু ফাঁকা জায়গা লাগবে, তাই দশ লক্ষ শূন্যের জন্যও ফাইলটা এক Byte ও বড় হয় না।"
    >
      <SketchText x={16} y={22} size={9} anchor="start" opacity={0.55}>
        ফাইলের শুরু
      </SketchText>
      {FILE_PARTS.map((part, i) => {
        const y = top + i * rowH;
        return (
          <g key={part.title}>
            <SketchBox
              x={16}
              y={y}
              w={230}
              h={rowH - 8}
              title={part.title}
              sub={part.sub}
              accent={part.accent}
            />
            <line
              x1={246}
              y1={y + (rowH - 8) / 2}
              x2={272}
              y2={y + (rowH - 8) / 2}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth="1"
            />
            <SketchText
              x={280}
              y={y + (rowH - 8) / 2 + 4}
              size={10}
              anchor="start"
              opacity={0.75}
              body
            >
              {part.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. প্রত্যেকে ভাবে পুরো Memory তার একার                                     */
/* ------------------------------------------------------------------------- */

export function VirtualMemoryDiagram() {
  const frame = (x: number, on: boolean, label: string) => (
    <g key={x}>
      <rect
        x={x}
        y={244}
        width={86}
        height={44}
        fill={on ? "var(--primary)" : "transparent"}
        fillOpacity={on ? 0.12 : 0}
        stroke={on ? "var(--primary)" : "currentColor"}
        strokeOpacity={on ? 1 : 0.25}
        strokeWidth="1.2"
      />
      <SketchText
        x={x + 43}
        y={270}
        size={9}
        accent={on}
        opacity={on ? 1 : 0.4}
      >
        {label}
      </SketchText>
    </g>
  );

  return (
    <Sketch
      label="Diagram: একই ঠিকানা, আসলে আলাদা জায়গা"
      height={320}
      minWidth={860}
      viewBox="0 0 860 320"
      caption="দুইটা Process ই বিশ্বাস করে তাদের কোড আছে 0x400000 ঠিকানায়। দুইজনের কেউই মিথ্যা বলছে না, আর দুইজনের কেউই একে অন্যের জায়গায় হাত দিতে পারছে না। মাঝখানে বসে Kernel প্রতিবার ঠিকানাটা চুপচাপ বদলে দেয়, আর কেউ টেরও পায় না।"
    >
      {/* two processes */}
      <SketchText x={40} y={22} size={9} anchor="start" opacity={0.55}>
        PROCESS A, যা সে দেখে
      </SketchText>
      <SketchText x={480} y={22} size={9} anchor="start" opacity={0.55}>
        PROCESS B, যা সে দেখে
      </SketchText>

      <SketchBox
        x={40}
        y={34}
        w={300}
        h={40}
        title="0x400000"
        sub="আমার কোড"
        accent
      />
      <SketchBox
        x={40}
        y={82}
        w={300}
        h={40}
        title="0x700000"
        sub="আমার Heap"
      />
      <SketchBox
        x={480}
        y={34}
        w={300}
        h={40}
        title="0x400000"
        sub="আমার কোড"
        accent
      />
      <SketchBox
        x={480}
        y={82}
        w={300}
        h={40}
        title="0x700000"
        sub="আমার Heap"
      />

      {/* translator */}
      <rect
        x={40}
        y={152}
        width={740}
        height={40}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth="1.2"
        strokeDasharray="5 4"
      />
      <SketchText x={410} y={170} size={11} bold accent>
        KERNEL, ঠিকানা বদলে দেয়
      </SketchText>
      <SketchText x={410} y={184} size={9} opacity={0.65} body>
        প্রতিটা Process এর জন্য আলাদা একটা তালিকা রাখা থাকে
      </SketchText>

      {/* crossing arrows */}
      <path
        d="M 190 122 L 190 152"
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth="1.1"
      />
      <path
        d="M 630 122 L 630 152"
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth="1.1"
      />
      <path
        d="M 190 192 L 91 244"
        stroke="var(--primary)"
        strokeWidth="1.3"
        fill="none"
        markerEnd="url(#vm-arrow)"
      />
      <path
        d="M 630 192 L 591 244"
        stroke="var(--primary)"
        strokeWidth="1.3"
        fill="none"
        markerEnd="url(#vm-arrow)"
      />

      <SketchText x={40} y={232} size={9} anchor="start" opacity={0.55}>
        আসল RAM, যা সত্যি
      </SketchText>
      {frame(48, true, "A এর কোড")}
      {frame(148, false, "")}
      {frame(248, false, "")}
      {frame(348, false, "B এর Heap")}
      {frame(448, false, "")}
      {frame(548, true, "B এর কোড")}
      {frame(648, false, "")}
      {frame(748, false, "A এর Heap")}

      <defs>
        <marker
          id="vm-arrow"
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
    </Sketch>
  );
}
