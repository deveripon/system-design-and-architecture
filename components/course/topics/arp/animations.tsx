"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw, Send, SkipForward } from "lucide-react";
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
/* 1. চেঁচিয়ে জিজ্ঞেস, একজন উত্তর                                              */
/* ------------------------------------------------------------------------- */

type Dev = { name: string; ip: string; mac: string };
const HOSTS: Dev[] = [
  { name: "B", ip: "192.168.0.6", mac: "3c:...:91" },
  { name: "C", ip: "192.168.0.1", mac: "a4:...:0c" },
  { name: "D", ip: "192.168.0.9", mac: "b8:...:4a" },
];

export function WhoHasIpLab() {
  const reduce = useReducedMotion();
  const [targetIdx, setTargetIdx] = useState(1);
  const [sent, setSent] = useState(false);
  const target = HOSTS[targetIdx];

  return (
    <Panel
      label="Interactive"
      title="এই IP টা কার, চেঁচিয়ে জিজ্ঞেস করুন"
      footer="খেয়াল করুন দুইটা জিনিস। প্রশ্নটা সবাই শোনে, কারণ A জানে না কার কাছে জিজ্ঞেস করবে, তাই Broadcast, সবাইকে একসাথে। কিন্তু উত্তর দেয় শুধু একজন, যার সেই IP। বাকিরা প্রশ্নটা শুনেই বোঝে এটা তাদের নয়, তাই চুপ থাকে, চিঠিটা ফেলে দেয়। তিনজন শুনল, একজন উত্তর দিল। এই কারণেই ARP এর প্রশ্ন সবার কাছে যায় কিন্তু জবাব আসে ঠিক জনের থেকে।"
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          A কার MAC চায়
        </span>
        {HOSTS.map((h, idx) => (
          <button
            key={h.name}
            onClick={() => {
              setTargetIdx(idx);
              setSent(false);
            }}
            data-target={idx}
            className={cn(
              "px-3 py-1.5 border font-mono text-[10px] transition-colors",
              targetIdx === idx
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {h.ip}
          </button>
        ))}
      </div>

      <div className="border border-border bg-background p-6">
        <div className="mx-auto mb-6 w-40 py-2 border border-primary bg-primary/5 text-center">
          <div className="font-mono text-[11px] font-bold text-primary">A</div>
          <div className="font-mono text-[8px] text-muted-foreground">
            {sent ? `${target.ip} এর MAC চায়` : "জিজ্ঞেস করতে প্রস্তুত"}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {HOSTS.map((h, idx) => {
            const owner = idx === targetIdx;
            const heard = sent;
            const replied = sent && owner;
            return (
              <div
                key={h.name}
                data-host={h.name}
                data-heard={heard ? "true" : "false"}
                data-replied={replied ? "true" : "false"}
                className={cn(
                  "p-3 border text-center transition-colors duration-300",
                  replied
                    ? "border-primary bg-primary/15"
                    : heard
                      ? "border-border bg-muted/30"
                      : "border-border",
                )}
              >
                <div
                  className={cn(
                    "font-mono text-lg font-bold",
                    replied ? "text-primary" : "text-foreground",
                  )}
                >
                  {h.name}
                </div>
                <div className="font-mono text-[8px] text-muted-foreground">
                  {h.ip}
                </div>
                <div
                  className={cn(
                    "mt-2 font-mono text-[9px]",
                    replied
                      ? "text-primary font-bold"
                      : heard
                        ? "text-muted-foreground"
                        : "text-muted-foreground/40",
                  )}
                >
                  {!sent
                    ? "অপেক্ষায়"
                    : replied
                      ? "এটা আমি, MAC এই"
                      : "শুনলাম, আমি নই"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setSent(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors"
        >
          <Send className="w-3 h-3" /> চেঁচিয়ে জিজ্ঞেস করুন
        </button>
        <button
          onClick={() => setSent(false)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        {sent && (
          <motion.span
            key={targetIdx}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="font-mono text-[11px] text-muted-foreground"
          >
            শুনল{" "}
            <span
              className="text-foreground font-bold"
              data-heard-count={HOSTS.length}
            >
              {toBn(HOSTS.length)}
            </span>{" "}
            জন, উত্তর দিল{" "}
            <span className="text-primary font-bold" data-replied-count="1">
              ১
            </span>{" "}
            জন
          </motion.span>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একবার জিজ্ঞেস, তারপর Cache                                                */
/* ------------------------------------------------------------------------- */

type Step = {
  label: string;
  cached: boolean;
  broadcast: boolean;
  note: string;
  cost: string;
};

const STEPS: Step[] = [
  {
    label: "প্রথমবার পাঠাতে চাই",
    cached: false,
    broadcast: false,
    note: "A প্রথমবার Router (192.168.0.1) কে চিঠি পাঠাতে চায়। আগে ARP Cache দেখল, ওই IP এর MAC জানা আছে কিনা।",
    cost: "",
  },
  {
    label: "Cache খালি, Miss",
    cached: false,
    broadcast: false,
    note: "Cache এ ওই IP নেই। এটাই Cache Miss। এখন বাধ্য হয়ে চেঁচিয়ে জিজ্ঞেস করতে হবে, একটু সময় লাগবে।",
    cost: "একটু দেরি",
  },
  {
    label: "চেঁচিয়ে জিজ্ঞেস, উত্তর এলো",
    cached: false,
    broadcast: true,
    note: "A পুরো LAN এ Broadcast করল, এই IP টা কার? Router উত্তর দিল, ওই IP আমার, MAC এই। এবার A জেনে গেল।",
    cost: "একটা যাওয়া আসা",
  },
  {
    label: "Cache এ লিখে রাখল",
    cached: true,
    broadcast: false,
    note: "A উত্তরটা ARP Cache এ লিখে রাখল, 192.168.0.1 মানে ওই MAC। এবার চিঠি পাঠাল। প্রথমবারের কাজ শেষ।",
    cost: "",
  },
  {
    label: "দ্বিতীয়বার, একই জায়গায়",
    cached: true,
    broadcast: false,
    note: "একটু পরে A আবার Router কে চিঠি পাঠাতে চাইল। এবার Cache দেখল, আর ওই IP এর MAC পেয়ে গেল। কোনো জিজ্ঞাসা লাগল না।",
    cost: "",
  },
  {
    label: "Cache Hit, সরাসরি",
    cached: true,
    broadcast: false,
    note: "এটাই Cache Hit। কোনো Broadcast নেই, কোনো অপেক্ষা নেই, সোজা চিঠি পাঠাল। এই কারণেই ARP প্রতিবার হয় না, শুধু প্রথমবার। বাকি সময় Cache।",
    cost: "সাথে সাথেই",
  },
];

export function CacheLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const s = STEPS[i];

  return (
    <Panel
      label="Interactive"
      title="একবার জিজ্ঞেস, তারপর মনে রাখা"
      footer="ARP প্রতিটা চিঠির আগে হয় না, নাহলে LAN অকারণ চেঁচামেচিতে ভরে যেত। প্রথমবার একটা IP এর MAC দরকার হলে ARP হয়, একটু দেরি লাগে, তারপর উত্তরটা Cache এ জমা থাকে। এর পরের প্রতিটা চিঠি সরাসরি Cache থেকে MAC নিয়ে যায়, কোনো জিজ্ঞাসা ছাড়া। এই কারণেই একটা সাইট প্রথমবার খুলতে সামান্য বেশি সময় লাগতে পারে, আর তারপর দ্রুত। Cache কিছুক্ষণ পরে মুছে যায়, কারণ যন্ত্র বদলাতে পারে, তখন আবার একবার জিজ্ঞেস করতে হয়।"
    >
      <div className="flex flex-wrap gap-1.5 mb-6">
        {STEPS.map((st, idx) => (
          <button
            key={st.label}
            onClick={() => setI(idx)}
            data-step={idx}
            data-active={idx === i ? "true" : "false"}
            className={cn(
              "px-3 py-1.5 border font-mono text-[9px] transition-colors",
              idx === i
                ? "border-primary bg-primary/10 text-primary"
                : idx < i
                  ? "border-border text-muted-foreground"
                  : "border-dashed border-border/50 text-muted-foreground/40",
            )}
          >
            {toBn(idx + 1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            এই ধাপে
          </div>
          <div className="text-base font-bold text-foreground mb-3">
            {s.label}
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              data-cache={s.cached ? "hit" : "miss"}
              className={cn(
                "px-3 py-1 border font-mono text-[9px] font-bold uppercase tracking-[0.1em]",
                s.cached
                  ? "border-accent text-accent bg-accent/10"
                  : "border-border text-muted-foreground",
              )}
            >
              Cache {s.cached ? "আছে" : "খালি"}
            </span>
            <span
              data-broadcast={s.broadcast ? "true" : "false"}
              className={cn(
                "px-3 py-1 border font-mono text-[9px] font-bold uppercase tracking-[0.1em]",
                s.broadcast
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground/40",
              )}
            >
              {s.broadcast ? "চেঁচিয়ে জিজ্ঞেস" : "জিজ্ঞাসা নেই"}
            </span>
          </div>
        </div>
        {s.cost && (
          <div
            className={cn(
              "border p-4 min-w-[130px]",
              s.cost.includes("সাথে")
                ? "border-accent/50 bg-accent/5"
                : "border-primary/50 bg-primary/5",
            )}
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              খরচ
            </div>
            <div
              className={cn(
                "font-mono text-sm font-bold",
                s.cost.includes("সাথে") ? "text-accent" : "text-primary",
              )}
              data-cost={s.cost}
            >
              {s.cost}
            </div>
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
        {s.note}
      </motion.p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setI((v) => (v + 1) % STEPS.length)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors"
        >
          {i === STEPS.length - 1 ? "প্রথম থেকে" : "পরের ধাপ"}
        </button>
        <button
          onClick={() => setI(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. পুরো Round Trip, প্রতি Hop এ IP, MAC, ARP                                */
/* ------------------------------------------------------------------------- */

const LAPTOP_IP = "192.168.0.5";
const SERVER_IP = "103.94.135.2";

type Hop = {
  name: string;
  role: string;
  ipSrc: string;
  ipDst: string;
  macSrc: string;
  macDst: string;
  arpTarget: string;
  arpFires: boolean; // এই দিকে, এই Packet এ
  edgeArp: boolean; // চূড়ান্ত যন্ত্রকে ARP (Server বা Laptop নিজে)
  note: string;
};

// অনুরোধ: Laptop -> Server, প্রথম Packet, তাই প্রতি হাতে Cache Miss, ARP হয়
const REQUEST: Hop[] = [
  {
    name: "Laptop",
    role: "শুরু",
    ipSrc: LAPTOP_IP,
    ipDst: SERVER_IP,
    macSrc: "Laptop",
    macDst: "গেটওয়ে",
    arpTarget: "গেটওয়ে",
    arpFires: true,
    edgeArp: false,
    note: "গন্তব্য Server আমার LAN এ নেই, তাই তাকে ARP করা যায় না। Laptop গেটওয়ের MAC ARP করে। IP জোড়া: উৎস Laptop, গন্তব্য Server, পুরো পথে এক। MAC জোড়া: উৎস Laptop, গন্তব্য গেটওয়ে।",
  },
  {
    name: "বাসার Router",
    role: "গেটওয়ে",
    ipSrc: LAPTOP_IP,
    ipDst: SERVER_IP,
    macSrc: "Router",
    macDst: "ISP রাউটার",
    arpTarget: "ISP রাউটার",
    arpFires: true,
    edgeArp: false,
    note: "Router পুরনো MAC জোড়া ফেলে নতুন বসাল। IP এক থাকল (Laptop থেকে Server), কিন্তু MAC হলো Router থেকে ISP রাউটার। পরের হাতের MAC এর জন্য ARP।",
  },
  {
    name: "ISP Router",
    role: "GP",
    ipSrc: LAPTOP_IP,
    ipDst: SERVER_IP,
    macSrc: "ISP রাউটার",
    macDst: "IIG রাউটার",
    arpTarget: "IIG রাউটার",
    arpFires: true,
    edgeArp: false,
    note: "একই নিয়ম। IP জোড়া অটুট, MAC আবার নতুন, পরের রাউটারের। প্রতিটা হাত শুধু পরের হাত চেনে।",
  },
  {
    name: "IIG",
    role: "দেশের গেট",
    ipSrc: LAPTOP_IP,
    ipDst: SERVER_IP,
    macSrc: "IIG রাউটার",
    macDst: "সমুদ্র রাউটার",
    arpTarget: "সমুদ্র রাউটার",
    arpFires: true,
    edgeArp: false,
    note: "সমুদ্রের তারের মুখের রাউটারের MAC ARP করে সেখানে পাঠাল। IP এখনো Laptop থেকে Server।",
  },
  {
    name: "Singapore ISP",
    role: "বিদেশি",
    ipSrc: LAPTOP_IP,
    ipDst: SERVER_IP,
    macSrc: "SG রাউটার",
    macDst: "DC রাউটার",
    arpTarget: "DC রাউটার",
    arpFires: true,
    edgeArp: false,
    note: "সমুদ্র পার। DC রাউটারের MAC ARP করে সেদিকে পাঠাল। এখনো Server নয়, শুধু আরেক রাউটার।",
  },
  {
    name: "DC Router",
    role: "শেষ রাউটার",
    ipSrc: LAPTOP_IP,
    ipDst: SERVER_IP,
    macSrc: "DC রাউটার",
    macDst: "Server",
    arpTarget: "Server নিজে",
    arpFires: true,
    edgeArp: true,
    note: "এইবার তফাত। Server এখন এই রাউটারের নিজের LAN এ। তাই এবার সরাসরি Server কেই ARP, পুরো পথে একমাত্র এখানেই। MAC জোড়া: DC রাউটার থেকে Server। চিঠি পৌঁছাল।",
  },
];

// উত্তর: Server -> Laptop, Cache request এই গরম হয়ে গেছে, তাই ARP প্রায় হয় না
const RESPONSE: Hop[] = [
  {
    name: "Server",
    role: "উত্তর শুরু",
    ipSrc: SERVER_IP,
    ipDst: LAPTOP_IP,
    macSrc: "Server",
    macDst: "DC রাউটার",
    arpTarget: "DC রাউটার",
    arpFires: false,
    edgeArp: false,
    note: "Server উত্তর দিল। IP জোড়া এবার উল্টো, উৎস Server, গন্তব্য Laptop, আবার পুরো পথে এক। Server তার গেটওয়ে DC রাউটারের MAC আগেই জানে (request এর সময় শেখা), তাই ARP লাগল না, সোজা Cache থেকে।",
  },
  {
    name: "DC Router",
    role: "শেষ রাউটার",
    ipSrc: SERVER_IP,
    ipDst: LAPTOP_IP,
    macSrc: "DC রাউটার",
    macDst: "SG রাউটার",
    arpTarget: "SG রাউটার",
    arpFires: false,
    edgeArp: false,
    note: "উত্তর পিছন দিকে চলল। প্রতিটা রাউটার Laptop এর দিকে পরের হাত ঠিক করে। SG রাউটারের MAC request এই জানা ছিল, তাই Cache Hit, ARP নেই।",
  },
  {
    name: "Singapore ISP",
    role: "বিদেশি",
    ipSrc: SERVER_IP,
    ipDst: LAPTOP_IP,
    macSrc: "SG রাউটার",
    macDst: "IIG রাউটার",
    arpTarget: "IIG রাউটার",
    arpFires: false,
    edgeArp: false,
    note: "IP এখনো Server থেকে Laptop, MAC আবার নতুন পরের হাতের। Cache গরম, তাই চেঁচানো লাগল না।",
  },
  {
    name: "IIG",
    role: "দেশের গেট",
    ipSrc: SERVER_IP,
    ipDst: LAPTOP_IP,
    macSrc: "IIG রাউটার",
    macDst: "ISP রাউটার",
    arpTarget: "ISP রাউটার",
    arpFires: false,
    edgeArp: false,
    note: "দেশে ফিরল। ISP রাউটারের MAC জানা ছিল। উত্তরের পথে ARP প্রায় হয় না, কারণ যাওয়ার সময় সব শিখে রাখা হয়েছে।",
  },
  {
    name: "ISP Router",
    role: "GP",
    ipSrc: SERVER_IP,
    ipDst: LAPTOP_IP,
    macSrc: "ISP রাউটার",
    macDst: "Router",
    arpTarget: "বাসার Router",
    arpFires: false,
    edgeArp: false,
    note: "ISP আপনার বাসার Router এর দিকে পাঠাল। তার MAC ও জানা। IP এখনো Server থেকে Laptop, MAC হলো ISP থেকে বাসার Router।",
  },
  {
    name: "বাসার Router",
    role: "গেটওয়ে",
    ipSrc: SERVER_IP,
    ipDst: LAPTOP_IP,
    macSrc: "Router",
    macDst: "Laptop",
    arpTarget: "Laptop নিজে",
    arpFires: false,
    edgeArp: true,
    note: "শেষ হাত। Laptop এই Router এর নিজের LAN এ, তাই এখানে সরাসরি Laptop কেই দেওয়া। আর Laptop এর MAC request এর সময়ই শেখা হয়েছিল, তাই এখানেও ARP লাগল না। MAC জোড়া: Router থেকে Laptop। উত্তর পৌঁছাল।",
  },
];

export function FullPathArpLab() {
  const reduce = useReducedMotion();
  const [dir, setDir] = useState<"req" | "res">("req");
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  const hops = dir === "req" ? REQUEST : RESPONSE;
  const finished = i >= hops.length - 1;
  const running = playing && !finished;
  const advance = useCallback(
    () => setI((v) => Math.min(v + 1, hops.length - 1)),
    [hops.length],
  );

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(advance, 3200);
    return () => clearTimeout(id);
  }, [running, i, advance]);

  const h = hops[i];
  const arpSoFar = hops.slice(0, i + 1).filter((x) => x.arpFires).length;

  return (
    <Panel
      label="Interactive"
      title="Laptop আর Server, পুরো যাত্রা, প্রতি Hop এ IP MAC ARP"
      footer="এই এক লাবে পুরো গল্প। অনুরোধ আর উত্তর, দুই দিকেই খেয়াল করুন তিনটা জিনিস। এক, IP জোড়া এক দিকে পুরো পথে এক থাকে, শুধু উত্তরে উৎস আর গন্তব্য উল্টে যায়। দুই, MAC জোড়া প্রতিটা Hop এ নতুন, কারণ MAC মানে শুধু পরের হাত। তিন, ARP হয় শুধু পরের হাতের MAC অজানা থাকলে, মানে অনুরোধের প্রথম Packet এ প্রতি হাতে একবার। উত্তরের সময় সেই Cache গরম, তাই ARP প্রায় হয়ই না। আর ARP কখনো Router পার হয় না, তাই Laptop কখনো Server কে ARP করে না, শুধু একদম শেষ রাউটার চূড়ান্ত যন্ত্রকে ARP করে।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex gap-1.5">
          {(["req", "res"] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDir(d);
                setI(0);
                setPlaying(false);
              }}
              data-dir={d}
              data-active={dir === d ? "true" : "false"}
              className={cn(
                "px-4 py-2 border font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors",
                dir === d
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {d === "req"
                ? "অনুরোধ, Laptop → Server"
                : "উত্তর, Server → Laptop"}
            </button>
          ))}
        </div>
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
            setI((v) => (v >= hops.length - 1 ? 0 : v + 1));
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <SkipForward className="w-3 h-3" /> Step
        </button>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          এই দিকে ARP{" "}
          <span
            className={cn(
              "font-bold text-base",
              arpSoFar === 0 ? "text-accent" : "text-primary",
            )}
            data-arp-count={arpSoFar}
          >
            {toBn(arpSoFar)}
          </span>
        </span>
      </div>

      {/* station rail */}
      <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
        {hops.map((st, idx) => (
          <div key={st.name + idx} className="flex items-center gap-1 shrink-0">
            <div
              data-station={idx}
              data-active={idx === i ? "true" : "false"}
              className={cn(
                "px-2.5 py-1.5 border font-mono text-[8.5px] transition-colors whitespace-nowrap",
                idx === i
                  ? st.edgeArp
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-primary bg-primary/10 text-primary"
                  : idx < i
                    ? "border-border text-muted-foreground"
                    : "border-dashed border-border/50 text-muted-foreground/40",
              )}
            >
              {st.name}
            </div>
            {idx < hops.length - 1 && (
              <span className="text-muted-foreground/40 font-mono text-[9px]">
                {dir === "req" ? ">" : "<"}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* the per-hop card */}
      <div className="border border-border bg-background p-5">
        <div className="flex flex-wrap items-baseline gap-2 mb-4">
          <span className="font-mono text-[11px] font-bold text-primary">
            {h.name}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">
            {h.role}
          </span>
          <span className="ml-auto font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground">
            {dir === "req" ? "অনুরোধ" : "উত্তর"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="border border-accent/40 bg-accent/5 px-3 py-2">
            <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1">
              IP জোড়া (এই দিকে এক থাকে)
            </div>
            <div
              className="font-mono text-[11px] text-accent font-bold"
              data-ip={`${h.ipSrc}->${h.ipDst}`}
            >
              {h.ipSrc} {"->"} {h.ipDst}
            </div>
          </div>
          <div className="border border-primary/40 bg-primary/5 px-3 py-2">
            <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1">
              MAC জোড়া (প্রতি Hop এ নতুন)
            </div>
            <div
              className="font-mono text-[11px] text-primary font-bold"
              data-mac={`${h.macSrc}->${h.macDst}`}
            >
              {h.macSrc} {"->"} {h.macDst}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "border p-3",
            h.edgeArp
              ? "border-accent/50 bg-accent/5"
              : h.arpFires
                ? "border-primary/40 bg-primary/5"
                : "border-border",
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              ARP খোঁজে
            </span>
            <span
              className={cn(
                "font-mono text-[12px] font-bold",
                h.edgeArp ? "text-accent" : "text-primary",
              )}
              data-arp-target={h.arpTarget}
            >
              {h.arpTarget}
            </span>
            <span
              data-fires={h.arpFires ? "true" : "false"}
              className={cn(
                "ml-auto px-2 py-0.5 border font-mono text-[8.5px] font-bold uppercase tracking-[0.1em]",
                h.arpFires
                  ? "border-primary text-primary"
                  : "border-accent text-accent",
              )}
            >
              {h.arpFires ? "Cache Miss, ARP হলো" : "Cache Hit, ARP লাগল না"}
            </span>
          </div>
          {h.edgeArp && (
            <div className="mt-2 font-mono text-[9px] text-accent">
              {dir === "req"
                ? "পুরো পথে একমাত্র এখানেই সত্যিকারের Server কে ARP"
                : "শেষ হাত, Laptop এই LAN এ, তবু MAC আগেই জানা ছিল"}
            </div>
          )}
        </div>
      </div>

      <motion.p
        key={`${dir}-${i}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="mt-6 text-sm text-muted-foreground leading-relaxed"
      >
        {h.note}
      </motion.p>
    </Panel>
  );
}
