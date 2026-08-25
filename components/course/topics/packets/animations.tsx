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
/* 1. পাঁচটা Packet, আলাদা রাস্তা, একটা হারানো                                 */
/* ------------------------------------------------------------------------- */

type Frame = {
  /** which packet numbers have arrived at the receiver, in arrival order */
  arrived: number[];
  /** true once the lost packet's absence is noticed */
  noticedLoss: boolean;
  /** true once the resend has arrived */
  resent: boolean;
  note: string;
};

const TOTAL = 5;
const LOST = 4;

const FRAMES: Frame[] = [
  {
    arrived: [],
    noticedLoss: false,
    resent: false,
    note: "পাঁচটা Packet ছাড়া হলো। প্রত্যেকের গায়ে লেখা সে কত নম্বর, মোট কয়টা। এবার প্রত্যেকে নিজের মতো রওনা দিল।",
  },
  {
    arrived: [3],
    noticedLoss: false,
    resent: false,
    note: "৩ নম্বর সবার আগে পৌঁছাল, যদিও সে তিন নম্বরে ছাড়া হয়েছিল। ছোট রাস্তা পেয়েছে বলে আগে এসে গেছে।",
  },
  {
    arrived: [3, 1],
    noticedLoss: false,
    resent: false,
    note: "১ নম্বর এলো এখন। ওপাশের Kernel এদের সাজিয়ে রাখছে, কিন্তু ২ নম্বর ছাড়া ৩ কে ব্যবহার করছে না। ক্রমটা জরুরি।",
  },
  {
    arrived: [3, 1, 5],
    noticedLoss: false,
    resent: false,
    note: "৫ নম্বর এলো, ২ আর ৪ এর আগেই। জমছে, কিন্তু ফাঁক থেকে যাচ্ছে। এখনো ২ আর ৪ নেই।",
  },
  {
    arrived: [3, 1, 5, 2],
    noticedLoss: false,
    resent: false,
    note: "২ নম্বর এলো। এখন ১, ২, ৩ পরপর আছে, তাই এই তিনটা ব্যবহার করা যায়। কিন্তু ৪ কোথায়? ৫ আছে, ৪ নেই।",
  },
  {
    arrived: [3, 1, 5, 2],
    noticedLoss: true,
    resent: false,
    note: "৪ আর আসছে না। রাস্তায় কোথাও হারিয়ে গেছে, হয়তো কোনো Router ভিড়ে সেটা ফেলে দিয়েছে। ওপাশ বুঝল, ৫ পেয়েছি কিন্তু ৪ পাইনি, মানে ৪ হারানো।",
  },
  {
    arrived: [3, 1, 5, 2],
    noticedLoss: true,
    resent: false,
    note: "ওপাশ এপাশকে বলল, ৪ নম্বরটা আবার পাঠাও। এই বলাটাও একটা ছোট Packet, উল্টো দিকে গেল।",
  },
  {
    arrived: [3, 1, 5, 2, LOST],
    noticedLoss: true,
    resent: true,
    note: "৪ আবার পাঠানো হলো, এইবার পৌঁছাল। এখন পাঁচটাই আছে। Kernel ১, ২, ৩, ৪, ৫ ক্রমে সাজিয়ে পুরো ফাইলটা Program কে দিল। Program কিছুই টের পেল না।",
  },
];

function PacketChip({
  n,
  tone,
}: {
  n: number;
  tone: "wire" | "arrived" | "lost" | "resent";
}) {
  return (
    <div
      data-packet={n}
      data-tone={tone}
      className={cn(
        "flex flex-col items-center justify-center w-14 h-12 border shrink-0 transition-colors duration-200",
        tone === "arrived" && "border-primary bg-primary/10",
        tone === "resent" && "border-accent bg-accent/15",
        tone === "lost" && "border-dashed border-border/50 opacity-40",
        tone === "wire" && "border-border",
      )}
    >
      <span
        className={cn(
          "font-mono text-sm font-bold",
          tone === "lost"
            ? "text-muted-foreground/50"
            : tone === "resent"
              ? "text-accent"
              : "text-primary",
        )}
      >
        {toBn(n)}
      </span>
      <span className="font-mono text-[7px] text-muted-foreground">
        / {toBn(TOTAL)}
      </span>
    </div>
  );
}

export function PacketJourneyLab() {
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
    const id = setTimeout(advance, 2400);
    return () => clearTimeout(id);
  }, [running, i, advance]);

  const f = FRAMES[i];
  const inWire = [1, 2, 3, 4, 5].filter((n) => !f.arrived.includes(n));

  return (
    <Panel
      label="Animation story"
      title="পাঁচটা Packet, আলাদা রাস্তা, একটা হারানো"
      footer="তিনটা জিনিস এখানে ঘটল, আর তিনটাই স্বাভাবিক। Packet রা ক্রম ভেঙে পৌঁছাতে পারে, কারণ প্রত্যেকে আলাদা রাস্তায় যায়। Packet হারিয়ে যেতে পারে, কারণ কোনো Router ভিড়ে সেটা ফেলে দিতে পারে। আর ওপাশ নম্বর দেখে সাজায় আর হারানোটা আবার চায়। এই সাজানো আর আবার চাওয়ার পুরো ব্যবস্থাটার নাম TCP, আর সেটা Module 05 এর পুরোটা। এখানে শুধু দেখলেন সমস্যাটা কী, যেটার জন্য TCP লাগে।"
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
            setI((v) => (v >= FRAMES.length - 1 ? 0 : v + 1));
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

      {/* wire */}
      <div className="mb-4">
        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
          রাস্তায়
        </div>
        <div className="flex flex-wrap gap-2 min-h-[48px] border border-dashed border-border/50 p-3">
          {inWire.length === 0 && (
            <span className="font-mono text-[10px] text-muted-foreground/50 self-center">
              সব পৌঁছে গেছে
            </span>
          )}
          {inWire.map((n) => (
            <PacketChip
              key={n}
              n={n}
              tone={
                n === LOST && f.noticedLoss && !f.resent
                  ? "lost"
                  : n === LOST && f.resent
                    ? "resent"
                    : "wire"
              }
            />
          ))}
        </div>
      </div>

      {/* receiver, in arrival order */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            ওপাশে পৌঁছানোর ক্রমে
          </span>
          <span
            className="font-mono text-[9px] text-muted-foreground"
            data-arrived={f.arrived.length}
          >
            {toBn(f.arrived.length)} / {toBn(TOTAL)} এসেছে
          </span>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[48px] border border-border p-3 bg-background">
          {f.arrived.length === 0 && (
            <span className="font-mono text-[10px] text-muted-foreground/50 self-center">
              এখনো কিছু আসেনি
            </span>
          )}
          {f.arrived.map((n, idx) => (
            <motion.div
              key={`${n}-${idx}`}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <PacketChip n={n} tone={n === LOST ? "resent" : "arrived"} />
            </motion.div>
          ))}
        </div>
        {f.resent && (
          <div
            data-status="reordered"
            className="mt-3 px-4 py-2 border border-accent/50 bg-accent/10 font-mono text-[10px] text-accent"
          >
            Kernel সাজিয়ে দিল: ১ ২ ৩ ৪ ৫। Program পেল একটা নিখুঁত ফাইল।
          </div>
        )}
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
/* 2. চওড়া পাইপ, দ্রুত পাইপ, দুইটা আলাদা হাতল                                 */
/* ------------------------------------------------------------------------- */

const FILE_MB = 50;

export function PipeLab() {
  const [latency, setLatency] = useState(60); // ms one way
  const [bandwidth, setBandwidth] = useState(20); // Mbps

  // first byte: one round trip (send + reply), simplified
  const firstByteMs = latency * 2;
  // big file: round trip to start, then push the bits
  const fileBits = FILE_MB * 8; // megabits
  const pushMs = (fileBits / bandwidth) * 1000;
  const fileTotalMs = firstByteMs + pushMs;

  const fmtMs = (ms: number) =>
    ms >= 1000
      ? `${toBn((ms / 1000).toFixed(1))} s`
      : `${toBn(Math.round(ms))} ms`;
  const feel = (ms: number) =>
    ms <= 100
      ? "সাথে সাথেই"
      : ms <= 400
        ? "একটু দেরি"
        : ms <= 1000
          ? "টের পাওয়া যায়"
          : "বিরক্তিকর";

  return (
    <Panel
      label="Interactive"
      title="দুইটা হাতল, দুইটা আলাদা জিনিস"
      footer='হাতল দুইটা নাড়ুন। Latency নাড়লে "প্রথম Byte" বদলায় কিন্তু চওড়া পাইপ সাহায্য করে না, আর Bandwidth নাড়লে বড় File এর সময় বদলায় কিন্তু ছোট Chat এ কিছু হয় না। এই কারণেই "১০০ Mbps কিনেছি তবু সাইট ধীর" কথাটা এত শোনা যায়। সাইট ধীর হয় প্রথম Byte এ, মানে Latency তে, আর Bandwidth কেনা মানে পাইপ চওড়া করা, দ্রুত করা নয়। Game খেলতে দরকার কম Latency, বড় File নামাতে দরকার বেশি Bandwidth, আর দুইটা একসাথে বাড়ে না।'
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <label className="block">
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground block mb-2">
            Latency:{" "}
            <span className="text-primary font-bold" data-latency={latency}>
              {toBn(latency)} ms
            </span>{" "}
            এক দিকে
          </span>
          <input
            type="range"
            min={2}
            max={220}
            value={latency}
            onChange={(e) => setLatency(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
            aria-label="Latency"
          />
          <span className="font-mono text-[8px] text-muted-foreground">
            পাশের শহর ৫, Singapore ৬০, US ২২০
          </span>
        </label>
        <label className="block">
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground block mb-2">
            Bandwidth:{" "}
            <span className="text-primary font-bold" data-bandwidth={bandwidth}>
              {toBn(bandwidth)} Mbps
            </span>
          </span>
          <input
            type="range"
            min={1}
            max={200}
            value={bandwidth}
            onChange={(e) => setBandwidth(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
            aria-label="Bandwidth"
          />
          <span className="font-mono text-[8px] text-muted-foreground">
            পাইপ কত চওড়া, এক সেকেন্ডে কত ঢোকে
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-border p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
            ছোট Chat message
          </div>
          <div
            className="font-mono text-2xl font-bold text-primary"
            data-firstbyte={Math.round(firstByteMs)}
          >
            {fmtMs(firstByteMs)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            প্রথম Byte পৌঁছাতে, {feel(firstByteMs)}
          </div>
          <div className="mt-3 font-mono text-[8px] text-muted-foreground/70">
            শুধু Latency এর উপর। Bandwidth এখানে কিছু করে না।
          </div>
        </div>
        <div className="border border-border p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
            {toBn(FILE_MB)} MB Video Download
          </div>
          <div
            className="font-mono text-2xl font-bold text-primary"
            data-filetotal={Math.round(fileTotalMs)}
          >
            {fmtMs(fileTotalMs)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            পুরোটা নামাতে, {feel(fileTotalMs)}
          </div>
          <div className="mt-3 font-mono text-[8px] text-muted-foreground/70">
            প্রায় পুরোটাই Bandwidth এর উপর। Latency শুধু শুরুর ধাক্কা।
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-[9px] text-muted-foreground">
        <button
          onClick={() => {
            setLatency(5);
            setBandwidth(20);
          }}
          className="px-3 py-2 border border-border hover:border-primary/40 hover:text-foreground transition-colors text-left"
        >
          <span className="block text-[10px] font-bold text-foreground">
            পাশের শহর
          </span>
          কম Latency, মাঝারি Bandwidth
        </button>
        <button
          onClick={() => {
            setLatency(220);
            setBandwidth(200);
          }}
          className="px-3 py-2 border border-border hover:border-primary/40 hover:text-foreground transition-colors text-left"
        >
          <span className="block text-[10px] font-bold text-foreground">
            দূরের চওড়া লাইন
          </span>
          বেশি Latency, বেশি Bandwidth
        </button>
      </div>
    </Panel>
  );
}
