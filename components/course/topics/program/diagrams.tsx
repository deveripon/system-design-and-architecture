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
        d="M 586 67 L 620 67 L 620 150 L 596 150"
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
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path
            d="M0,0 L6,3 L0,6"
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeWidth="1.2"
          />
        </marker>
        <marker
          id="program-arrow-accent"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path
            d="M0,0 L6,3 L0,6"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.4"
          />
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
                  markerWidth="7"
                  markerHeight="7"
                  refX="3"
                  refY="6"
                  orient="auto"
                >
                  <path
                    d="M0,0 L3,6 L6,0"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity={0.5}
                    strokeWidth="1.2"
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
        d="M 96 52 L 96 96"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#pm-arrow)"
      />
      <path
        d="M 96 176 L 96 132"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#pm-arrow)"
      />
      <defs>
        <marker
          id="pm-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="3"
          refY="5"
          orient="auto"
        >
          <path
            d="M0,0 L3,5 L6,0"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.4"
          />
        </marker>
      </defs>
    </Sketch>
  );
}
