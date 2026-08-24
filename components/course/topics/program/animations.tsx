"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function Panel({
  label,
  title,
  children,
  footer,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <figure className="my-10 border border-border bg-card">
      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 border-b border-border bg-muted/30">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </span>
      </figcaption>
      <div className="p-5 md:p-8">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed">
          {footer}
        </div>
      )}
    </figure>
  );
}

function Controls({
  running,
  finished,
  onPlay,
  onStep,
  onReset,
  extra,
}: {
  running: boolean;
  finished: boolean;
  onPlay: () => void;
  onStep: () => void;
  onReset: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <button
        onClick={onPlay}
        className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors"
      >
        {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        {running ? "Pause" : finished ? "আবার" : "Play"}
      </button>
      <button
        onClick={onStep}
        className="inline-flex items-center gap-2 px-4 py-2 border border-border font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <SkipForward className="w-3 h-3" />
        Step
      </button>
      {extra}
      <button
        onClick={onReset}
        aria-label="Reset"
        className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Enter চাপা থেকে main() চলা পর্যন্ত                                      */
/* ------------------------------------------------------------------------- */

type Seg = "text" | "data" | "heap" | "stack";

type StartFrame = {
  stage: string;
  who: "shell" | "kernel" | "cpu";
  pid: string | null;
  segs: Seg[];
  note: string;
};

const START: StartFrame[] = [
  {
    stage: "আপনি Enter চাপলেন",
    who: "shell",
    pid: null,
    segs: [],
    note: "Terminal এ node server.js লিখে Enter চাপলেন। এই মুহূর্তে server.js নিছক একটা ফাইল, Disk এ চুপচাপ পড়ে আছে।",
  },
  {
    stage: "Shell নিজের একটা কপি বানাল",
    who: "shell",
    pid: "৪৮২১",
    segs: ["text", "data", "heap", "stack"],
    note: "fork() দিয়ে Shell নিজের হুবহু একটা কপি বানায়, আর কপিটা নতুন একটা PID পায়। মজার কথা, এই মুহূর্তে নতুন Process টা এখনো Shell ই, Node নয়।",
  },
  {
    stage: "কপিটা বলল, আমি এখন Node",
    who: "kernel",
    pid: "৪৮২১",
    segs: [],
    note: "exec() করলে Kernel ওই Process এর ভেতরের সবকিছু মুছে ফেলে। PID টা কিন্তু একই থাকে। খোলসটা রয়ে গেল, ভেতরের মানুষটা বদলে গেল।",
  },
  {
    stage: "Binary পড়ে Segment বসানো হলো",
    who: "kernel",
    pid: "৪৮২১",
    segs: ["text", "data"],
    note: "Kernel node ফাইলটার Header পড়ে জেনে নেয় কোন অংশ কোথায় বসবে। Machine Code যায় Text এ, আগে থেকে জানা সংখ্যাগুলো যায় Data তে।",
  },
  {
    stage: "Library গুলো জোড়া লাগল",
    who: "kernel",
    pid: "৪৮২১",
    segs: ["text", "data"],
    note: "Node একা চলে না, তার libc আর libuv দরকার। Dynamic Linker ওগুলো খুঁজে এনে ঠিকানাগুলো মিলিয়ে দেয়। এই ধাপে ফাইল না পেলেই সেই চেনা এরর, shared library not found।",
  },
  {
    stage: "CPU Entry Point এ লাফ দিল",
    who: "cpu",
    pid: "৪৮২১",
    segs: ["text", "data", "stack"],
    note: "Kernel একটা Stack বানিয়ে দেয়, তারপর Program Counter কে Entry Point এর ঠিকানায় বসিয়ে দেয়। এরপর থেকে CPU শুধু তার চেনা কাজটাই করে যায়, Fetch, Decode, Execute।",
  },
  {
    stage: "আপনার কোড চলছে",
    who: "cpu",
    pid: "৪৮২১",
    segs: ["text", "data", "heap", "stack"],
    note: "Node এবার server.js পড়ে, আর Object বানাতে গিয়ে Heap এ জায়গা নেয়। এতক্ষণে ফাইলটা সত্যিই একটা Process, তার নিজের PID আর নিজের Memory নিয়ে।",
  },
  {
    stage: "শেষে একটা সংখ্যা ফেরত",
    who: "kernel",
    pid: null,
    segs: [],
    note: "Program শেষ হলে সে একটা Exit Code ফেরত দেয়, শূন্য মানে সব ঠিক আছে। Kernel Memory ফেরত নিয়ে নেয়, আর Shell আবার আপনার জন্য অপেক্ষা করতে থাকে।",
  },
];

const SEG_META: { key: Seg; name: string; sub: string }[] = [
  { key: "stack", name: "Stack", sub: "Function Call" },
  { key: "heap", name: "Heap", sub: "Object" },
  { key: "data", name: "Data", sub: "Global" },
  { key: "text", name: "Text", sub: "Machine Code" },
];

const WHO_LABEL: Record<StartFrame["who"], string> = {
  shell: "Shell",
  kernel: "Kernel",
  cpu: "CPU",
};

export function ProgramStartLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  const finished = i >= START.length - 1;
  const running = playing && !finished;

  const advance = useCallback(
    () => setI((v) => Math.min(v + 1, START.length - 1)),
    [],
  );

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(advance, 2600);
    return () => clearTimeout(id);
  }, [running, i, advance]);

  const frame = START[i];

  return (
    <Panel
      label="Animation story"
      title="node server.js লেখার পর ভেতরে কী ঘটে"
      footer="খেয়াল করার মতো ব্যাপার হলো, fork আর exec আলাদা দুইটা ধাপ। এই ফাঁকটা ইচ্ছে করেই রাখা, কারণ ওই মুহূর্তেই Shell ঠিক করে দিতে পারে নতুন Program টা কোন ফোল্ডারে চলবে, কোন Environment Variable পাবে, আর তার Output কোথায় যাবে।"
    >
      <Controls
        running={running}
        finished={finished}
        onPlay={() => {
          if (finished) setI(0);
          setPlaying((p) => !p);
        }}
        onStep={() => {
          setPlaying(false);
          setI((v) => (v >= START.length - 1 ? 0 : v + 1));
        }}
        onReset={() => {
          setPlaying(false);
          setI(0);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6 md:gap-8">
        {/* stage list */}
        <ol className="space-y-1">
          {START.map((s, idx) => {
            const active = idx === i;
            const done = idx < i;
            return (
              <li
                key={s.stage}
                className={cn(
                  "flex items-start gap-3 px-3 py-2 border transition-colors duration-200",
                  active
                    ? "border-primary bg-primary/10"
                    : done
                      ? "border-border bg-muted/20"
                      : "border-transparent",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[10px] pt-0.5 w-5 shrink-0",
                    active ? "text-primary" : "text-muted-foreground/50",
                  )}
                >
                  {toBn(idx + 1)}
                </span>
                <span
                  className={cn(
                    "text-sm leading-snug",
                    active
                      ? "text-foreground"
                      : done
                        ? "text-muted-foreground"
                        : "text-muted-foreground/45",
                  )}
                >
                  {s.stage}
                </span>
                {active && (
                  <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.15em] text-primary shrink-0 pt-1">
                    {WHO_LABEL[frame.who]}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* memory image */}
        <div className="border border-border bg-background p-4">
          <div className="flex items-baseline justify-between mb-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
              Memory
            </span>
            <span className="font-mono text-[10px] text-primary">
              PID {frame.pid ?? "নেই"}
            </span>
          </div>
          <div className="space-y-1.5">
            {SEG_META.map((seg) => {
              const on = frame.segs.includes(seg.key);
              return (
                <div
                  key={seg.key}
                  className={cn(
                    "flex items-baseline gap-2 px-3 py-2 border transition-all duration-300",
                    on
                      ? "border-primary/50 bg-primary/10"
                      : "border-dashed border-border/60 bg-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[11px] font-bold",
                      on ? "text-primary" : "text-muted-foreground/30",
                    )}
                  >
                    {seg.name}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[9px]",
                      on ? "text-muted-foreground" : "text-muted-foreground/25",
                    )}
                  >
                    {on ? seg.sub : "খালি"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <motion.p
        key={i}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="mt-6 pt-5 border-t border-border text-sm text-muted-foreground leading-relaxed"
      >
        {frame.note}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন লাইনে Kernel কে ডাকতে হয়                                           */
/* ------------------------------------------------------------------------- */

type TraceLine = {
  code: string;
  kernel: string | null;
  why: string;
};

const PURE: TraceLine[] = [
  {
    code: "let total = 0;",
    kernel: null,
    why: "একটা সংখ্যা Memory তে বসানো। CPU নিজেই পারে।",
  },
  {
    code: "for (let i = 0; i < 1e7; i++)",
    kernel: null,
    why: "লাখ লাখ বার ঘুরছে, তবু পুরোটাই CPU এর নিজের কাজ।",
  },
  {
    code: "  total += i * 2;",
    kernel: null,
    why: "গুণ আর যোগ, দুইটাই CPU এর ভেতরেই হয়ে যায়।",
  },
  {
    code: "const answer = total;",
    kernel: null,
    why: "এখনো Kernel এর দরকার পড়েনি একবারও।",
  },
  {
    code: "console.log(answer);",
    kernel: "write(1, ...)",
    why: "এইবার লাগল। পর্দায় লিখতে হলে Kernel কেই বলতে হয়, কারণ পর্দাটা আপনার একার নয়।",
  },
];

const IO: TraceLine[] = [
  {
    code: "const fs = require('fs');",
    kernel: 'openat("fs.js")',
    why: "Module খুঁজে বের করতে গিয়েই ফাইল খুলতে হলো।",
  },
  {
    code: "const data = fs.readFileSync('tours.json');",
    kernel: 'openat("tours.json")',
    why: "ফাইল খোলার অনুমতি আছে কিনা, সেটা Kernel ছাড়া কেউ বলতে পারে না।",
  },
  {
    code: "  // Disk থেকে আসছে",
    kernel: "read(3, ...)",
    why: "আসল পড়াটা এখানে। এই ধাপে Process টা অপেক্ষায় বসে থাকে, আর CPU অন্য কাজ ধরে।",
  },
  {
    code: "const tours = JSON.parse(data);",
    kernel: null,
    why: "Parse করা পুরোপুরি CPU এর কাজ, তাই এখানে Kernel লাগে না।",
  },
  {
    code: "http.createServer(...).listen(3000)",
    kernel: "bind(3000), listen()",
    why: "Port দখল করাও Kernel এর হাতে, নাহলে দুইজন একই Port নিয়ে টানাটানি করত।",
  },
];

export function SyscallTraceLab() {
  const reduce = useReducedMotion();
  const [io, setIo] = useState(false);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  const lines = io ? IO : PURE;
  const finished = i >= lines.length - 1;
  const running = playing && !finished;

  const advance = useCallback(
    () => setI((v) => Math.min(v + 1, lines.length - 1)),
    [lines.length],
  );

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(advance, 2200);
    return () => clearTimeout(id);
  }, [running, i, advance]);

  const calls = lines.slice(0, i + 1).filter((l) => l.kernel).length;
  const line = lines[i];

  return (
    <Panel
      label="Interactive"
      title="কোন লাইনে Kernel এর দরজায় কড়া নাড়তে হয়"
      footer="নিয়মটা এক লাইনে বলা যায়। নিজের Memory র ভেতরে যা কিছু, সেটা আপনার Program নিজেই করতে পারে। এর বাইরের সবকিছু, মানে ফাইল, Network, সময়, পর্দা, অন্য Process, সবকিছুর জন্য Kernel কে বলতে হয়। প্রতিটা Syscall এ CPU কে User Mode থেকে Kernel Mode এ যেতে হয়, আর ফিরে আসতে হয়। এই যাওয়া আসাটা সস্তা নয়, তাই ভালো কোড কম Syscall এ বেশি কাজ করে।"
    >
      <Controls
        running={running}
        finished={finished}
        onPlay={() => {
          if (finished) setI(0);
          setPlaying((p) => !p);
        }}
        onStep={() => {
          setPlaying(false);
          setI((v) => (v >= lines.length - 1 ? 0 : v + 1));
        }}
        onReset={() => {
          setPlaying(false);
          setI(0);
        }}
        extra={
          <button
            onClick={() => {
              setIo((v) => !v);
              setI(0);
              setPlaying(false);
            }}
            className={cn(
              "px-4 py-2 border font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors",
              io
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {io ? "ফাইল পড়া" : "শুধু হিসাব"}
          </button>
        }
      />

      <div className="border border-border bg-background">
        {lines.map((l, idx) => {
          const active = idx === i;
          const past = idx < i;
          return (
            <div
              key={l.code}
              className={cn(
                "grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-4 py-3 border-b border-border last:border-b-0 transition-colors duration-200",
                active ? "bg-primary/10" : "bg-transparent",
              )}
            >
              <code
                className={cn(
                  "font-mono text-xs sm:text-[13px] break-words",
                  active
                    ? "text-foreground"
                    : past
                      ? "text-muted-foreground"
                      : "text-muted-foreground/40",
                )}
              >
                {l.code}
              </code>
              <span
                className={cn(
                  "font-mono text-[10px] whitespace-nowrap self-center",
                  !l.kernel
                    ? active || past
                      ? "text-muted-foreground/70"
                      : "text-muted-foreground/25"
                    : active || past
                      ? "text-primary font-bold"
                      : "text-primary/30",
                )}
              >
                {l.kernel ? `→ ${l.kernel}` : "user mode"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
            এ পর্যন্ত Syscall
          </div>
          <div className="font-mono text-2xl font-bold text-primary">
            {toBn(calls)}
          </div>
        </div>
        <motion.p
          key={`${io}-${i}`}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex-1 min-w-[240px] text-sm text-muted-foreground leading-relaxed"
        >
          {line.why}
        </motion.p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. এক লাইন কোড কীভাবে সংখ্যা হয়ে যায়                                      */
/* ------------------------------------------------------------------------- */

type Stage = {
  name: string;
  what: string;
  lines: string[];
  mono: boolean;
  note: string;
  /** Drawn as SVG. A tree built from slashes is ASCII art, which this project bans. */
  tree?: boolean;
};

function ParseTree() {
  const node = (x: number, y: number, label: string, accent?: boolean) => (
    <g key={`${x}-${y}`}>
      <rect
        x={x - 34}
        y={y - 14}
        width={68}
        height={28}
        fill={accent ? "var(--primary)" : "transparent"}
        fillOpacity={accent ? 0.12 : 0}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 1 : 0.4}
        strokeWidth="1.2"
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize={12}
        fontWeight={700}
        fill={accent ? "var(--primary)" : "currentColor"}
      >
        {label}
      </text>
    </g>
  );
  const link = (x1: number, y1: number, x2: number, y2: number) => (
    <line
      key={`${x1}-${y1}-${x2}-${y2}`}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="currentColor"
      strokeOpacity={0.35}
      strokeWidth="1.2"
    />
  );
  return (
    <svg
      viewBox="0 0 420 180"
      style={{ minWidth: 340, height: 180 }}
      className="w-full text-muted-foreground"
      role="img"
      aria-label="কোন কাজটা আগে হবে, তার গাছ"
    >
      {link(210, 34, 110, 76)}
      {link(210, 34, 310, 76)}
      {link(310, 104, 240, 146)}
      {link(310, 104, 380, 146)}
      {node(210, 20, "=")}
      {node(110, 90, "total")}
      {node(310, 90, "*", true)}
      {node(240, 160, "price")}
      {node(380, 160, "2")}
    </svg>
  );
}

const STAGES: Stage[] = [
  {
    name: "আপনি যা লিখলেন",
    what: "মানুষের ভাষা",
    lines: ["total = price * 2"],
    mono: true,
    note: "একটা লাইন, যেটা পড়ে আপনি সাথে সাথে বুঝে ফেলেন। কম্পিউটার এখান থেকে কিছুই বোঝে না, কারণ তার কাছে এটা নিছক কতগুলো অক্ষর।",
  },
  {
    name: "শব্দে ভাগ করা",
    what: "প্রথম কাজ",
    lines: ["[ total ]  [ = ]  [ price ]  [ * ]  [ 2 ]"],
    mono: true,
    note: "প্রথমে লাইনটাকে টুকরো টুকরো করে নেওয়া হয়, ঠিক যেভাবে আপনি একটা বাক্য পড়ার সময় শব্দগুলো আলাদা করে চেনেন। এখনো কিছু বোঝা হয়নি, শুধু ভাগ করা হয়েছে।",
  },
  {
    name: "মানে বোঝা",
    what: "কোনটা আগে",
    lines: [],
    tree: true,
    mono: true,
    note: "এবার ঠিক করা হয় কোন কাজটা আগে হবে। গুণটা নিচে বসেছে, তাই সেটা আগে হবে, আর বসানোর কাজটা উপরে, তাই সেটা শেষে। স্কুলে শেখা নিয়মটাই, গুণ আগে, বসানো পরে।",
  },
  {
    name: "CPU এর নির্দেশ",
    what: "ছোট ছোট ধাপ",
    lines: [
      "price এর মানটা তুলে আনো",
      "সেটাকে ২ দিয়ে গুণ করো",
      "ফলটা total এ রেখে দাও",
    ],
    mono: false,
    note: "একটা লাইন ভেঙে তিনটা নির্দেশ হয়ে গেল। CPU একবারে বড় কিছু করতে পারে না, সে শুধু এরকম ছোট ছোট কাজ একটার পর একটা করে যায়। Lesson 02 এ এই ধাপগুলোই দেখেছেন।",
  },
  {
    name: "আসলে যা জমা থাকে",
    what: "শুধু সংখ্যা",
    lines: ["8b 05 2a 00", "d1 e0", "89 05 1c 00"],
    mono: true,
    note: "প্রতিটা নির্দেশ শেষমেশ কতগুলো সংখ্যা, আর সংখ্যাগুলো Bit, মানে শূন্য আর এক। Lesson 01 এ যেটা বলেছিলাম, সবকিছুই আসলে Bit, সেটা এখানে চোখে দেখা যাচ্ছে। উপরের সংখ্যাগুলো উদাহরণ, আসল সংখ্যা CPU ভেদে আলাদা হয়।",
  },
];

export function CompilerStagesLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  const finished = i >= STAGES.length - 1;
  const running = playing && !finished;

  const advance = useCallback(
    () => setI((v) => Math.min(v + 1, STAGES.length - 1)),
    [],
  );

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(advance, 3000);
    return () => clearTimeout(id);
  }, [running, i, advance]);

  const stage = STAGES[i];

  return (
    <Panel
      label="Animation story"
      title="এক লাইন কোড ধাপে ধাপে সংখ্যা হয়ে যাচ্ছে"
      footer="পুরো অনুবাদটা এক লাফে হয় না, ধাপে ধাপে হয়। প্রতিটা ধাপে জিনিসটা একটু করে মানুষের ভাষা থেকে দূরে সরে যায়, আর কম্পিউটারের ভাষার দিকে এগোয়। Compiler শব্দটা শুনতে যত কঠিন লাগে, ভেতরের কাজটা আসলে এই কয়েকটা ধাপই।"
    >
      <Controls
        running={running}
        finished={finished}
        onPlay={() => {
          if (finished) setI(0);
          setPlaying((p) => !p);
        }}
        onStep={() => {
          setPlaying(false);
          setI((v) => (v >= STAGES.length - 1 ? 0 : v + 1));
        }}
        onReset={() => {
          setPlaying(false);
          setI(0);
        }}
      />

      {/* stage rail */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {STAGES.map((s, idx) => (
          <div
            key={s.name}
            className={cn(
              "px-3 py-1.5 border font-mono text-[9px] uppercase tracking-[0.1em] transition-colors duration-200",
              idx === i
                ? "border-primary bg-primary/10 text-primary"
                : idx < i
                  ? "border-border text-muted-foreground"
                  : "border-dashed border-border/60 text-muted-foreground/35",
            )}
          >
            {toBn(idx + 1)}. {s.name}
          </div>
        ))}
      </div>

      <div className="border border-border bg-background">
        <div className="flex items-baseline gap-3 px-5 py-3 border-b border-border bg-muted/20">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
            {stage.name}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">
            {stage.what}
          </span>
        </div>
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="p-5 md:p-8 overflow-x-auto"
        >
          {stage.tree && <ParseTree />}
          {stage.lines.map((line, idx) => (
            <div
              key={idx}
              className={cn(
                "whitespace-pre text-foreground",
                stage.mono
                  ? "font-mono text-sm md:text-base"
                  : "text-sm md:text-base",
                idx > 0 && "mt-1",
              )}
            >
              {stage.mono ? line : `${toBn(idx + 1)}. ${line}`}
            </div>
          ))}
        </motion.div>
      </div>

      <motion.p
        key={`note-${i}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="mt-6 text-sm text-muted-foreground leading-relaxed"
      >
        {stage.note}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Program কে থামতে বলার তিনটা রাস্তা                                      */
/* ------------------------------------------------------------------------- */

type StopFrame = {
  alive: boolean;
  inflight: number;
  served: number;
  lost: number;
  note: string;
};

type StopMode = {
  badge: string;
  signal: string;
  sub: string;
  good: boolean;
  frames: StopFrame[];
};

const STOP_MODES: StopMode[] = [
  {
    badge: "SIGTERM",
    signal: "Handler নেই",
    sub: "pm2 stop, কোড কিছু করেনি",
    good: false,
    frames: [
      {
        alive: true,
        inflight: 2,
        served: 0,
        lost: 0,
        note: "দুইজন ইউজার বুকিং পাঠিয়েছেন, সার্ভার কাজ করছে।",
      },
      {
        alive: true,
        inflight: 2,
        served: 0,
        lost: 0,
        note: "SIGTERM এলো, মানে ভদ্রভাবে বলা হলো, কাজ গুছিয়ে বেরিয়ে আসুন।",
      },
      {
        alive: false,
        inflight: 0,
        served: 0,
        lost: 2,
        note: "কিন্তু কোডে কেউ এই কথাটা শোনার ব্যবস্থা রাখেনি। শুনতে না পেলে ডিফল্ট নিয়ম চালু হয়, আর Process সাথে সাথেই মরে যায়।",
      },
      {
        alive: false,
        inflight: 0,
        served: 0,
        lost: 2,
        note: "দুইজন ইউজারই খালি হাতে ফিরলেন। তাঁদের বুকিং অর্ধেক হয়ে থেমে গেল।",
      },
    ],
  },
  {
    badge: "SIGTERM",
    signal: "Handler আছে",
    sub: "কোড কথাটা শুনেছে",
    good: true,
    frames: [
      {
        alive: true,
        inflight: 2,
        served: 0,
        lost: 0,
        note: "একই অবস্থা, দুইজন ইউজার অপেক্ষায় আছেন।",
      },
      {
        alive: true,
        inflight: 2,
        served: 0,
        lost: 0,
        note: "একই SIGTERM এলো। তফাত শুধু এটুকু, এবার কোডে শোনার ব্যবস্থা রাখা আছে।",
      },
      {
        alive: true,
        inflight: 2,
        served: 0,
        lost: 0,
        note: "সার্ভার নতুন Request নেওয়া বন্ধ করে দিল, কিন্তু হাতে থাকা দুইটা শেষ করার জন্য সময় নিল।",
      },
      {
        alive: false,
        inflight: 0,
        served: 2,
        lost: 0,
        note: "দুইজনই উত্তর পেলেন, তারপর Database এর Connection বন্ধ করে Process শূন্য Exit Code দিয়ে বিদায় নিল।",
      },
    ],
  },
  {
    badge: "SIGKILL",
    signal: "kill -9",
    sub: "ধরার কোনো উপায় নেই",
    good: false,
    frames: [
      {
        alive: true,
        inflight: 2,
        served: 0,
        lost: 0,
        note: "আবার একই শুরু, দুইজন ইউজার অপেক্ষায়।",
      },
      {
        alive: true,
        inflight: 2,
        served: 0,
        lost: 0,
        note: "এবার এলো SIGKILL। এটা অনুরোধ নয়, এটা সরাসরি বিদ্যুৎ কেটে দেওয়ার মতো।",
      },
      {
        alive: false,
        inflight: 0,
        served: 0,
        lost: 2,
        note: "এই Signal টা কোড দিয়ে ধরা যায় না, তাই Handler থাকলেও কোনো লাভ হতো না। Kernel Process টাকে সাথে সাথেই মুছে দেয়।",
      },
      {
        alive: false,
        inflight: 0,
        served: 0,
        lost: 2,
        note: "কোনো গোছানো নেই, কোনো বিদায় নেই। দুইজন ইউজারই খালি হাতে ফিরলেন।",
      },
    ],
  },
];

export function StopSignalLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  const total = STOP_MODES[0].frames.length;
  const finished = i >= total - 1;
  const running = playing && !finished;

  const advance = useCallback(
    () => setI((v) => Math.min(v + 1, total - 1)),
    [total],
  );

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(advance, 2800);
    return () => clearTimeout(id);
  }, [running, i, advance]);

  return (
    <Panel
      label="Interactive"
      title="একই সার্ভার, থামানোর তিন রকম, তিন রকম ফল"
      footer="docker stop আর pm2 stop দুইটাই আগে SIGTERM পাঠায়, তারপর কয়েক সেকেন্ড অপেক্ষা করে, আর তাতেও Process না মরলে শেষে SIGKILL পাঠায়। অর্থাৎ ভদ্র সুযোগটা আপনাকে দেওয়াই হয়। মাঝের কলামের কাজটুকু কোডে করা না থাকলে প্রতিটা Deploy এ কিছু ইউজার খালি হাতে ফেরেন, আর Log এ তার কোনো চিহ্নও থাকে না।"
    >
      <Controls
        running={running}
        finished={finished}
        onPlay={() => {
          if (finished) setI(0);
          setPlaying((p) => !p);
        }}
        onStep={() => {
          setPlaying(false);
          setI((v) => (v >= total - 1 ? 0 : v + 1));
        }}
        onReset={() => {
          setPlaying(false);
          setI(0);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STOP_MODES.map((mode) => {
          const f = mode.frames[i];
          return (
            <div
              key={mode.badge + mode.signal}
              className={cn(
                "border p-4 transition-colors duration-300",
                f.served > 0
                  ? "border-accent/60 bg-accent/5"
                  : f.lost > 0
                    ? "border-border bg-muted/20"
                    : "border-border",
              )}
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-1">
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold uppercase tracking-[0.15em]",
                    mode.good ? "text-accent" : "text-primary",
                  )}
                >
                  {mode.badge}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                  {mode.signal}
                </span>
              </div>
              <div className="font-mono text-[9px] text-muted-foreground/70 mb-4">
                {mode.sub}
              </div>

              {/* the process itself */}
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2 border mb-3 transition-colors duration-300",
                  f.alive
                    ? "border-primary/50 bg-primary/10"
                    : "border-dashed border-border/60",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[11px] font-bold",
                    f.alive ? "text-primary" : "text-muted-foreground/40",
                  )}
                >
                  Process
                </span>
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase tracking-[0.1em]",
                    f.alive
                      ? "text-muted-foreground"
                      : "text-muted-foreground/40",
                  )}
                >
                  {f.alive ? "চলছে" : "নেই"}
                </span>
              </div>

              {/* the two users */}
              <div className="space-y-1.5 mb-4">
                {[0, 1].map((idx) => {
                  const state =
                    idx < f.served
                      ? "served"
                      : idx < f.served + f.inflight
                        ? "waiting"
                        : "lost";
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 border text-[11px] transition-colors duration-300",
                        state === "served"
                          ? "border-accent/50 bg-accent/10 text-accent"
                          : state === "waiting"
                            ? "border-border text-muted-foreground"
                            : "border-dashed border-border/50 text-muted-foreground/40 line-through",
                      )}
                    >
                      <span className="font-mono text-[9px]">
                        ইউজার {toBn(idx + 1)}
                      </span>
                      <span className="ml-auto">
                        {state === "served"
                          ? "উত্তর পেলেন"
                          : state === "waiting"
                            ? "অপেক্ষায়"
                            : "কিছুই পেলেন না"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-border font-mono text-[10px]">
                <span className="text-muted-foreground">সেবা পেলেন </span>
                <span
                  className={cn(
                    "font-bold",
                    f.served > 0 ? "text-accent" : "text-primary",
                  )}
                >
                  {toBn(f.served)} / ২
                </span>
              </div>

              <motion.p
                key={i}
                initial={reduce ? false : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground leading-relaxed"
              >
                {f.note}
              </motion.p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
