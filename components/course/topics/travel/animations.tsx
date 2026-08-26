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

/* ------------------------------------------------------------------------- */
/* 1. Hop ধরে ধরে, TTL কমে, ঠিকানা থাকে                                        */
/* ------------------------------------------------------------------------- */

type Stop = { x: number; label: string; sub: string; medium: string };

const STOPS: Stop[] = [
  { x: 60, label: "Phone", sub: "Cox’s Bazar", medium: "রেডিও" },
  { x: 195, label: "Tower", sub: "GP", medium: "তামা" },
  { x: 330, label: "ISP", sub: "GP core", medium: "Fiber" },
  { x: 465, label: "IIG", sub: "দেশের গেট", medium: "Fiber" },
  { x: 600, label: "Cable", sub: "সমুদ্রের নিচে", medium: "আলো" },
  { x: 735, label: "Singtel", sub: "Singapore", medium: "Fiber" },
  { x: 860, label: "Server", sub: "Datacenter", medium: "তার" },
];

const DEST = "103.94.135.2";
const START_TTL = 64;

const NOTES = [
  "Packet টা Phone এ তৈরি হলো। খামে গন্তব্য 103.94.135.2, আর TTL বসানো ৬৪। এবার যাত্রা শুরু।",
  "Tower এ পৌঁছাল, বাতাসের রেডিও থেকে তামার তারে উঠল। গন্তব্য একই, TTL এক কমে ৬৩। বাহন বদলাল, যাত্রী নয়।",
  "GP এর core Router। এখানে অনেক রাস্তা মেশে। Router ঠিকানা দেখে বেছে নিল কোন দিকে। TTL ৬২।",
  "IIG, দেশের গেট। এর পরেই বাংলাদেশ শেষ। Router সমুদ্রের তারের দিকে ঠেলে দিল। TTL ৬১।",
  "সমুদ্রের নিচের কাচের তার। এখন যাত্রীটা আলো হয়ে ছুটছে, কয়েক হাজার কিলোমিটার। TTL ৬০।",
  "Singapore এ উঠল, Singtel এর Router। বিদেশ, কিন্তু একই নিয়ম, একই ঠিকানা পড়া। TTL ৫৯।",
  "Datacenter এর ভেতরে Server এ পৌঁছাল। TTL ৫৮। গোটা পথে ঠিকানা একবারও বদলায়নি, প্রতিটা Router শুধু এক ধাপ জানত।",
];

export function HopByHopLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  const finished = i >= STOPS.length - 1;
  const running = playing && !finished;
  const advance = useCallback(
    () => setI((v) => Math.min(v + 1, STOPS.length - 1)),
    [],
  );

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(advance, 2200);
    return () => clearTimeout(id);
  }, [running, i, advance]);

  const stop = STOPS[i];
  const ttl = START_TTL - i;
  const sea = stop.label === "Cable";

  return (
    <Panel
      label="Animation story"
      title="একটা Packet, সাত ধাপ, ঠিকানা একই থাকে"
      footer="দুইটা জিনিস আলাদাভাবে খেয়াল করুন। গন্তব্যের ঠিকানা পুরো পথে একবারও বদলায় না, প্রতিটা Router সেটাই পড়ে পরের দিক ঠিক করে। আর TTL প্রতিটা Router এ এক করে কমে। TTL মানে Time To Live, একটা সংখ্যা যেটা শূন্য হলে Packet টা ফেলে দেওয়া হয়। এটা আছে যাতে কোনো Packet ভুল করে দুই Router এর মাঝে চিরকাল ঘুরতে না থাকে। traceroute ঠিক এই TTL এর সাথে খেলেই কাজ করে, যেটা নিচের লাবে দেখবেন।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => {
            if (finished) setI(0);
            setPlaying((p) => !p);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors"
        >
          {running ? (
            <Pause className="w-3 h-3" />
          ) : (
            <Play className="w-3 h-3" />
          )}
          {running ? "Pause" : finished ? "আবার" : "Play"}
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setI((v) => (v >= STOPS.length - 1 ? 0 : v + 1));
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <SkipForward className="w-3 h-3" /> Step
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setI(0);
          }}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* the map */}
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 920 150"
          style={{ minWidth: 720, height: 150 }}
          className="w-full text-muted-foreground"
          role="img"
          aria-label="Packet এর পথ"
        >
          <rect
            x={532}
            y={92}
            width={136}
            height={16}
            fill="var(--primary)"
            fillOpacity={0.06}
            stroke="var(--primary)"
            strokeOpacity={0.3}
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text
            x={600}
            y={104}
            textAnchor="middle"
            fontFamily="var(--font-sans), sans-serif"
            fontSize={8}
            fill="var(--primary)"
            fillOpacity={0.7}
          >
            সমুদ্র
          </text>
          {STOPS.slice(0, -1).map((s, k) => (
            <line
              key={k}
              x1={s.x}
              y1={60}
              x2={STOPS[k + 1].x}
              y2={60}
              stroke="currentColor"
              strokeOpacity={k < i ? 0.7 : 0.2}
              strokeWidth={k < i ? 1.6 : 1.1}
            />
          ))}
          {STOPS.map((s, k) => {
            const done = k < i;
            const here = k === i;
            return (
              <g
                key={s.label}
                data-stop={s.label}
                data-here={here ? "true" : "false"}
              >
                <circle
                  cx={s.x}
                  cy={60}
                  r={here ? 9 : 5}
                  fill={here || done ? "var(--primary)" : "transparent"}
                  fillOpacity={here ? 1 : done ? 0.4 : 0}
                  stroke={here || done ? "var(--primary)" : "currentColor"}
                  strokeOpacity={here || done ? 1 : 0.4}
                  strokeWidth="1.4"
                />
                <text
                  x={s.x}
                  y={30}
                  textAnchor="middle"
                  fontFamily="var(--font-mono), monospace"
                  fontSize={here ? 10 : 8}
                  fontWeight={here ? 700 : 400}
                  fill={here ? "var(--primary)" : "currentColor"}
                  fillOpacity={here ? 1 : 0.6}
                >
                  {s.label}
                </text>
                <text
                  x={s.x}
                  y={84}
                  textAnchor="middle"
                  fontFamily="var(--font-sans), sans-serif"
                  fontSize={7}
                  fill="currentColor"
                  fillOpacity={0.5}
                >
                  {s.sub}
                </text>
                {here && (
                  <text
                    x={s.x}
                    y={128}
                    textAnchor="middle"
                    fontFamily="var(--font-sans), sans-serif"
                    fontSize={8}
                    fill="var(--primary)"
                    fillOpacity={0.85}
                  >
                    {s.medium}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* the packet's envelope */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border border-border p-3">
          <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            এখন কোথায়
          </div>
          <div
            className="font-mono text-sm font-bold text-primary"
            data-here-label={stop.label}
          >
            {stop.label}
          </div>
          <div className="font-mono text-[9px] text-muted-foreground">
            {stop.sub}, {sea ? "আলোয়" : stop.medium + " এ"}
          </div>
        </div>
        <div className="border border-border p-3">
          <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            গন্তব্য (বদলায় না)
          </div>
          <div
            className="font-mono text-sm font-bold text-foreground"
            data-dest={DEST}
          >
            {DEST}
          </div>
          <div className="font-mono text-[9px] text-accent">
            একই, শুরু থেকে শেষ
          </div>
        </div>
        <div className="border border-border p-3">
          <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            TTL (প্রতি Hop এ কমে)
          </div>
          <div
            className="font-mono text-sm font-bold text-primary"
            data-ttl={ttl}
          >
            {toBn(ttl)}
          </div>
          <div className="font-mono text-[9px] text-muted-foreground">
            শুরু ৬৪, এখন {toBn(ttl)}
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
        {NOTES[i]}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. traceroute পড়া                                                          */
/* ------------------------------------------------------------------------- */

type Hop = {
  n: number;
  ip: string;
  name: string;
  ms: string;
  where: string;
  note: string;
};

const HOPS: Hop[] = [
  {
    n: 1,
    ip: "192.168.0.1",
    name: "আপনার Router",
    ms: "১ ms",
    where: "আপনার বাসা",
    note: "প্রথম ধাপ সবসময় আপনার নিজের Router, বাসার ভেতরের ঠিকানায়। ১ মিলিসেকেন্ডের কম, কারণ সে ঘরের ভেতরেই।",
  },
  {
    n: 2,
    ip: "10.16.0.1",
    name: "ISP এর প্রথম মেশিন",
    ms: "৮ ms",
    where: "আপনার এলাকা",
    note: "এবার আপনার ISP এর জালে ঢুকলেন। 10 দিয়ে শুরু ঠিকানা মানে এটা তাদের ভেতরের ঠিকানা, Module 03 এ বিস্তারিত।",
  },
  {
    n: 3,
    ip: "103.15.x.x",
    name: "ISP core, Dhaka",
    ms: "১৪ ms",
    where: "ঢাকা",
    note: "আপনার এলাকা থেকে ISP এর মূল কেন্দ্রে পৌঁছালেন, সাধারণত Dhaka তে। এখান থেকেই বাইরের দুনিয়ার রাস্তা।",
  },
  {
    n: 4,
    ip: "103.15.x.x",
    name: "IIG, দেশের গেট",
    ms: "১৮ ms",
    where: "ঢাকা",
    note: "International Internet Gateway। এর পরে বাংলাদেশ শেষ। এই জায়গাটা দিয়েই দেশের প্রায় সব বাইরের Traffic যায়।",
  },
  {
    n: 5,
    ip: "*  *  *",
    name: "সমুদ্রের তার",
    ms: "* ms",
    where: "সমুদ্রের নিচে",
    note: "হঠাৎ তিনটা তারকা। এই Router টা নিজের নাম বলতে চায় না, কিন্তু Packet ঠিকই পার হচ্ছে। এখানেই সাধারণত সমুদ্র পার হয়।",
  },
  {
    n: 6,
    ip: "203.208.x.x",
    name: "Singapore এ ওঠা",
    ms: "৬২ ms",
    where: "Singapore",
    note: "দেখুন সংখ্যাটা ১৮ থেকে লাফিয়ে ৬২ হলো। এই বড় লাফটাই সমুদ্র পার হওয়ার দাম, কয়েক হাজার কিলোমিটার এক ধাপে।",
  },
  {
    n: 7,
    ip: "203.208.x.x",
    name: "বিদেশি ISP",
    ms: "৬৫ ms",
    where: "Singapore",
    note: "Singapore এর ভেতরের কয়েকটা Router। এখন সংখ্যা আর তেমন বাড়ছে না, কারণ সব কাছাকাছি।",
  },
  {
    n: 8,
    ip: "103.94.135.2",
    name: "Server, পৌঁছে গেছি",
    ms: "৬৬ ms",
    where: "Datacenter",
    note: "গন্তব্য। আট ধাপে, এক বাসা থেকে আরেক মহাদেশে। আপনার Packet এই আটজনের হাত ঘুরে গেছে, আর প্রত্যেকে শুধু পরের এক ধাপ জানত।",
  },
];

export function TracerouteLab() {
  const reduce = useReducedMotion();
  const [sel, setSel] = useState<number>(1);
  const hop = HOPS.find((h) => h.n === sel)!;
  const prev = HOPS.find((h) => h.n === sel - 1);
  const jump = prev && sel === 6;

  return (
    <Panel
      label="Interactive"
      title="traceroute পড়ুন, প্রতিটা লাইন একটা মেশিন"
      footer="traceroute আপনাকে পুরো পথটা দেখায়, প্রতিটা Router এক লাইন করে। বাঁ দিকের সংখ্যাগুলো যাওয়া আসার সময়, আর উপর থেকে নিচে সেগুলো বাড়ে, কারণ প্রতিটা ধাপ দূরত্ব যোগ করে। একটা জায়গায় হঠাৎ বড় লাফ দেখলে বুঝবেন সেখানেই সমুদ্র পার হলো। আর তিনটা তারকা মানে ওই Router নিজের নাম বলতে চায় না, কিন্তু Packet ঠিকই পার হয়, তাই ঘাবড়ানোর কিছু নেই। এটাই Internet এ আপনার সবচেয়ে কাজের চোখ।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6">
        {/* the trace */}
        <div className="border border-border bg-background font-mono text-[11px] overflow-x-auto">
          <div className="px-4 py-2 border-b border-border text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
            traceroute to 103.94.135.2
          </div>
          {HOPS.map((h) => (
            <button
              key={h.n}
              onClick={() => setSel(h.n)}
              data-hop={h.n}
              data-selected={sel === h.n ? "true" : "false"}
              className={cn(
                "w-full grid grid-cols-[24px_1fr_56px] gap-2 items-center px-4 py-2 text-left border-b border-border last:border-b-0 transition-colors",
                sel === h.n ? "bg-primary/10" : "hover:bg-muted/30",
              )}
            >
              <span
                className={cn(
                  "text-[10px]",
                  sel === h.n
                    ? "text-primary font-bold"
                    : "text-muted-foreground",
                )}
              >
                {toBn(h.n)}
              </span>
              <span className="truncate">
                <span
                  className={cn(
                    h.ip.includes("*")
                      ? "text-muted-foreground/50"
                      : sel === h.n
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {h.ip}
                </span>
              </span>
              <span
                className={cn(
                  "text-right text-[10px]",
                  sel === h.n
                    ? "text-primary font-bold"
                    : "text-muted-foreground",
                )}
              >
                {h.ms}
              </span>
            </button>
          ))}
        </div>

        {/* the explanation */}
        <div className="border border-border p-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
              ধাপ {toBn(hop.n)}
            </span>
            <span
              className="font-mono text-[9px] text-muted-foreground"
              data-where={hop.where}
            >
              {hop.where}
            </span>
          </div>
          <div className="font-mono text-sm font-bold text-foreground mb-3">
            {hop.name}
          </div>
          <motion.p
            key={sel}
            initial={reduce ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="text-sm text-muted-foreground leading-relaxed"
            data-note
          >
            {hop.note}
          </motion.p>
          {jump && (
            <div
              data-jump
              className="mt-4 px-3 py-2 border border-accent/50 bg-accent/10 font-mono text-[10px] text-accent"
            >
              {prev.ms} থেকে {hop.ms}, এই লাফটাই সমুদ্র।
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSel((s) => (s >= HOPS.length ? 1 : s + 1))}
          className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors"
        >
          <SkipForward className="w-3 h-3" /> পরের ধাপ
        </button>
        <span className="text-xs text-muted-foreground">
          বা যেকোনো লাইনে চাপুন। ৬ নম্বরে সমুদ্রের লাফটা দেখুন।
        </span>
      </div>
    </Panel>
  );
}
