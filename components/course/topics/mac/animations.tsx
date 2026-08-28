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
}: {
  running: boolean;
  finished: boolean;
  onPlay: () => void;
  onStep: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
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
        <SkipForward className="w-3 h-3" /> Step
      </button>
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
/* 1. Switch টেবিল শিখে নেয়                                                    */
/* ------------------------------------------------------------------------- */

type Dev = { port: string; mac: string; name: string };
const DEVICES: Dev[] = [
  { port: "Port ১", mac: "a4:...:0c", name: "Laptop" },
  { port: "Port ২", mac: "3c:...:91", name: "Phone" },
  { port: "Port ৩", mac: "b8:...:4a", name: "TV" },
];

type Frame = {
  fromIdx: number;
  toIdx: number;
  learns: number; // which device's port the switch now knows (index) or -1
  known: number[]; // ports known AFTER this step
  flood: boolean; // did the switch flood (dest unknown)?
  note: string;
};

const FRAMES: Frame[] = [
  {
    fromIdx: 0,
    toIdx: 2,
    learns: 0,
    known: [0],
    flood: true,
    note: "Laptop (Port ১) TV কে চিঠি পাঠাল। Switch খামের উৎস MAC দেখে শিখল, Laptop Port ১ এ বসা। কিন্তু TV কোথায় সে এখনো জানে না, তাই এবার বাধ্য হয়ে সবাইকে পাঠাল, ঠিক Hub এর মতো। উত্তর দিল শুধু TV।",
  },
  {
    fromIdx: 2,
    toIdx: 0,
    learns: 2,
    known: [0, 2],
    flood: false,
    note: "TV (Port ৩) উত্তর দিল Laptop কে। এবার Switch TV এর Port ও শিখে নিল। আর যেহেতু Laptop এর Port আগেই জানা, এই চিঠি শুধু Port ১ এ গেল, কাউকে অকারণে নয়। শেখা শুরু হয়ে গেছে।",
  },
  {
    fromIdx: 1,
    toIdx: 0,
    learns: 1,
    known: [0, 1, 2],
    flood: false,
    note: "Phone (Port ২) Laptop কে চিঠি দিল। Switch Phone এর Port শিখল, আর Laptop জানা বলে সোজা Port ১ এ পাঠাল। এখন তিনটাই টেবিলে।",
  },
  {
    fromIdx: 0,
    toIdx: 1,
    learns: -1,
    known: [0, 1, 2],
    flood: false,
    note: "Laptop এবার Phone কে পাঠাল। সব জানা, তাই Switch কোনো নতুন কিছু শেখেনি, শুধু সোজা Port ২ এ পাঠাল। এখন থেকে প্রতিটা চিঠি ঠিক জায়গায়, কোনো ভিড় নেই। এটাই শেখা শেষ Switch।",
  },
];

export function SwitchLearnLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  const finished = i >= FRAMES.length - 1;
  const running = playing && !finished;
  const advance = useCallback(
    () => setI((v) => Math.min(v + 1, FRAMES.length - 1)),
    [],
  );

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(advance, 2800);
    return () => clearTimeout(id);
  }, [running, i, advance]);

  const f = FRAMES[i];

  return (
    <Panel
      label="Animation story"
      title="Switch কীভাবে টেবিলটা শিখে ফেলে"
      footer="খেয়াল করুন, Switch জন্ম থেকে কিছু জানে না, তার টেবিল খালি। প্রতিটা চিঠির উৎস MAC দেখে সে একটু একটু করে শেখে, কে কোন Port এ। যতক্ষণ গন্তব্য অজানা, ততক্ষণ সে বাধ্য হয়ে সবাইকে পাঠায়, মানে সাময়িকভাবে Hub এর মতো আচরণ করে। কিন্তু কয়েকটা চিঠির পরেই টেবিল ভরে যায়, আর তারপর প্রতিটা চিঠি ঠিক জায়গায়। কেউ Switch এ টেবিল লিখে দেয় না, সে নিজে শেখে।"
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
          setI((v) => (v >= FRAMES.length - 1 ? 0 : v + 1));
        }}
        onReset={() => {
          setPlaying(false);
          setI(0);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* the wire event */}
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-3">
            এই চিঠিটা
          </div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="px-3 py-2 border border-primary bg-primary/10 font-mono text-[11px] font-bold text-primary">
              {DEVICES[f.fromIdx].name}
            </span>
            <span className="text-primary font-mono">{"->"}</span>
            <span className="px-3 py-2 border border-border font-mono text-[11px] text-foreground">
              {DEVICES[f.toIdx].name}
            </span>
          </div>
          <div
            className={cn(
              "px-3 py-2 border font-mono text-[10px]",
              f.flood
                ? "border-primary/50 bg-primary/5 text-primary"
                : "border-accent/50 bg-accent/5 text-accent",
            )}
            data-flood={f.flood ? "true" : "false"}
          >
            {f.flood
              ? "গন্তব্য অজানা, তাই সবাইকে পাঠাল"
              : "গন্তব্য জানা, শুধু ঠিক Port এ"}
          </div>
        </div>

        {/* the table */}
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-3">
            Switch এর টেবিল,{" "}
            <span data-known={f.known.length}>{toBn(f.known.length)}</span> / ৩
            শেখা
          </div>
          <div className="space-y-1.5">
            {DEVICES.map((d, idx) => {
              const known = f.known.includes(idx);
              const justLearned = f.learns === idx;
              return (
                <div
                  key={d.port}
                  data-row={d.port}
                  data-known={known ? "true" : "false"}
                  className={cn(
                    "grid grid-cols-[60px_1fr_60px] gap-2 items-center px-3 py-2 border transition-colors duration-300",
                    justLearned
                      ? "border-primary bg-primary/15"
                      : known
                        ? "border-border bg-muted/20"
                        : "border-dashed border-border/50",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] font-bold",
                      known ? "text-primary" : "text-muted-foreground/40",
                    )}
                  >
                    {d.port}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px]",
                      known ? "text-foreground" : "text-muted-foreground/30",
                    )}
                  >
                    {known ? d.mac : "অজানা"}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[9px]",
                      known
                        ? "text-muted-foreground"
                        : "text-muted-foreground/30",
                    )}
                  >
                    {known ? d.name : ""}
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
        className="mt-6 text-sm text-muted-foreground leading-relaxed"
      >
        {f.note}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. IP এক থাকে, MAC প্রতি Hop এ বদলায়                                        */
/* ------------------------------------------------------------------------- */

type Leg = {
  at: string;
  srcMac: string;
  dstMac: string;
  note: string;
};

const DEST_IP = "103.94.135.2";
const SRC_IP = "192.168.0.5";

const LEGS: Leg[] = [
  {
    at: "Laptop থেকে বাসার Router",
    srcMac: "Laptop এর MAC",
    dstMac: "Router এর MAC",
    note: "Laptop চিঠি ছাড়ল। খামে চূড়ান্ত গন্তব্য 103.94.135.2, কিন্তু এই মুহূর্তে হাতে হাতে দেওয়ার MAC দুইটা: উৎস Laptop, গন্তব্য বাসার Router। কারণ এই এক ধাপে Laptop শুধু Router পর্যন্তই দিচ্ছে।",
  },
  {
    at: "Router থেকে ISP এর Router",
    srcMac: "Router এর MAC",
    dstMac: "ISP Router এর MAC",
    note: "Router চিঠি পেল, IP ঠিকানা একই দেখল, তারপর পুরনো MAC দুইটা ফেলে দিয়ে নতুন বসাল: উৎস এবার Router নিজে, গন্তব্য ISP এর Router। IP বদলায়নি, MAC পুরো বদলে গেল।",
  },
  {
    at: "ISP থেকে গন্তব্য Server",
    srcMac: "ISP Router এর MAC",
    dstMac: "Server এর MAC",
    note: "শেষ ধাপে ISP এর Router আবার MAC বদলাল: উৎস ISP Router, গন্তব্য এবার সত্যিকারের Server এর MAC। এতগুলো হাত বদলে চূড়ান্ত IP একবারও বদলায়নি, অথচ MAC প্রতি ধাপে নতুন।",
  },
];

export function HopMacLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  const finished = i >= LEGS.length - 1;
  const running = playing && !finished;
  const advance = useCallback(
    () => setI((v) => Math.min(v + 1, LEGS.length - 1)),
    [],
  );

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(advance, 3000);
    return () => clearTimeout(id);
  }, [running, i, advance]);

  const l = LEGS[i];

  return (
    <Panel
      label="Interactive"
      title="IP এক থাকে, MAC প্রতি Hop এ বদলায়"
      footer="এই লাবটাই M02 এর সেই ঝুলে থাকা প্রশ্নের উত্তর, যেখানে বলেছিলাম চূড়ান্ত গন্তব্য এক থাকে কিন্তু হাতে হাতে দেওয়ার ঠিকানা বদলায়। এবার দেখলেন কীভাবে। চূড়ান্ত গন্তব্য IP পুরো পথে এক, চিঠির উপরের লেখা। কিন্তু প্রতিটা Router চিঠি পেয়ে পুরনো MAC ফেলে দিয়ে নতুন বসায়, কারণ MAC মানে শুধু এই এক ধাপে ঠিক পাশের কে। IP বলে শেষ গন্তব্য, MAC বলে পরের হাত। দুইটা দুই কাজ, তাই দুইটাই লাগে।"
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
          setI((v) => (v >= LEGS.length - 1 ? 0 : v + 1));
        }}
        onReset={() => {
          setPlaying(false);
          setI(0);
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="border border-accent/50 bg-accent/5 p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            চূড়ান্ত গন্তব্য IP (বদলায় না)
          </div>
          <div
            className="font-mono text-base font-bold text-accent"
            data-ip={DEST_IP}
          >
            {DEST_IP}
          </div>
          <div className="font-mono text-[9px] text-muted-foreground mt-1">
            উৎস {SRC_IP}, শুরু থেকে শেষ এক
          </div>
        </div>
        <div className="border border-primary/50 bg-primary/5 p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            এই ধাপের MAC (প্রতিবার নতুন)
          </div>
          <div
            className="font-mono text-[12px] font-bold text-primary"
            data-srcmac={l.srcMac}
          >
            {l.srcMac}
          </div>
          <div className="font-mono text-[10px] text-primary">
            {"->"} <span data-dstmac={l.dstMac}>{l.dstMac}</span>
          </div>
        </div>
      </div>

      {/* hop rail */}
      <div className="flex items-center gap-1 mb-5 overflow-x-auto">
        {LEGS.map((leg, idx) => (
          <div key={leg.at} className="flex items-center gap-1 shrink-0">
            <div
              data-leg={idx}
              data-active={idx === i ? "true" : "false"}
              className={cn(
                "px-3 py-2 border font-mono text-[9px] transition-colors",
                idx === i
                  ? "border-primary bg-primary/10 text-primary"
                  : idx < i
                    ? "border-border text-muted-foreground"
                    : "border-dashed border-border/50 text-muted-foreground/40",
              )}
            >
              {leg.at}
            </div>
            {idx < LEGS.length - 1 && (
              <span className="text-muted-foreground/40 font-mono">{"->"}</span>
            )}
          </div>
        ))}
      </div>

      <motion.p
        key={i}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm text-muted-foreground leading-relaxed"
      >
        {l.note}
      </motion.p>
    </Panel>
  );
}
