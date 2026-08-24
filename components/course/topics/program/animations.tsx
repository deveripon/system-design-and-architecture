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
              PID {frame.pid ?? 'নেই'}
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
