"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

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
/* 1. এলাকা বাড়ালে কী কী বদলায়                                                */
/* ------------------------------------------------------------------------- */

type Rung = {
  name: string;
  scale: string;
  latency: string;
  owner: string;
  trust: string;
  cost: string;
  kind: "LAN" | "MAN" | "WAN";
  note: string;
};

const RUNGS: Rung[] = [
  {
    name: "এক ঘরের ভেতরে",
    scale: "কয়েক মিটার",
    latency: "১ ms এর কম",
    owner: "পুরোটাই আপনার",
    trust: "শুধু আপনার যন্ত্র",
    cost: "বিনামূল্যে",
    kind: "LAN",
    note: "Phone থেকে Laptop এ একটা ফাইল পাঠালেন Bluetooth এ। এটা এত ছোট আর এত কাছে যে চোখের পলকেই যায়। পুরোটা আপনার হাতের মুঠোয়।",
  },
  {
    name: "পুরো বাসা বা অফিস",
    scale: "কয়েকশো মিটার",
    latency: "১ থেকে ৫ ms",
    owner: "আপনি নিজে",
    trust: "বাসার সবার যন্ত্র",
    cost: "বিনামূল্যে, নিজের Router",
    kind: "LAN",
    note: "এটাই আসল LAN, Local Area Network। বাসার Wi-Fi। সব যন্ত্র একটা Router এ জোড়া, দ্রুত, বিনামূল্যে, আর মোটামুটি চেনা। এই ভেতরের দুনিয়াটাই আপনার নিজের।",
  },
  {
    name: "পুরো শহর জুড়ে",
    scale: "কয়েক কিলোমিটার",
    latency: "৫ থেকে ২০ ms",
    owner: "আপনার ISP",
    trust: "ISP এর গ্রাহকরা",
    cost: "মাসে টাকা",
    kind: "MAN",
    note: "শহরজুড়ে ছড়ানো ISP এর জাল, MAN, Metropolitan Area Network। এখন আর পুরোটা আপনার নয়, আপনি একজন গ্রাহক মাত্র। গতি একটু কমল, টাকা লাগতে শুরু করল।",
  },
  {
    name: "দেশ থেকে দেশ",
    scale: "হাজার কিলোমিটার",
    latency: "৫০ থেকে ১৫০ ms",
    owner: "অনেক কোম্পানি",
    trust: "কেউ চেনা নয়",
    cost: "সবাই ভাড়া করা",
    kind: "WAN",
    note: "এবার WAN, Wide Area Network। সমুদ্রের তার, অন্য দেশ। কোনো একজন মালিক নেই, সব ভাড়া করা রাস্তা। ধীর, আর একদম অচেনা।",
  },
  {
    name: "গোটা পৃথিবী",
    scale: "পুরো গ্রহ",
    latency: "১৫০ থেকে ৩০০ ms",
    owner: "কারো না",
    trust: "কোটি অচেনা মানুষ",
    cost: "পুরো শৃঙ্খল",
    kind: "WAN",
    note: "এটাই Internet, পৃথিবীর সবচেয়ে বড় WAN। কেউ এর মালিক নয়, এটা কোটি কোটি Network এর জোড়া, Lesson 01 এ যেমন দেখেছিলেন। সবচেয়ে ধীর, সবচেয়ে অচেনা, কিন্তু সবচেয়ে বড়।",
  },
];

const KIND_LABEL: Record<Rung["kind"], string> = {
  LAN: "LAN, ভেতরের দুনিয়া",
  MAN: "MAN, মাঝামাঝি",
  WAN: "WAN, বাইরের দুনিয়া",
};

export function ScaleLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(1);
  const r = RUNGS[i];

  const rows: { k: string; v: string; bad?: boolean }[] = [
    { k: "এলাকা", v: r.scale },
    { k: "দেরি (Latency)", v: r.latency, bad: i >= 2 },
    { k: "মালিক", v: r.owner, bad: i >= 2 },
    { k: "বিশ্বাস", v: r.trust, bad: i >= 2 },
    { k: "খরচ", v: r.cost, bad: i >= 2 },
  ];

  return (
    <Panel
      label="Interactive"
      title="এলাকা বাড়ান, দেখুন সবকিছু বদলে যায়"
      footer="হাতলটা টানুন, এক ঘর থেকে গোটা পৃথিবী পর্যন্ত। খেয়াল করুন, এলাকা বড় হওয়ার সাথে সাথে চারটা জিনিস একসাথে খারাপ দিকে যায়, দেরি বাড়ে, মালিকানা হাতছাড়া হয়, অচেনা মানুষ ঢোকে, আর টাকা লাগে। এই একটা কারণেই ভালো ইঞ্জিনিয়াররা যতটা সম্ভব কাজ LAN এর ভেতরে রাখেন, আর বাইরের দুনিয়ায় যাওয়াটা কমান। ভেতরের দুনিয়া সবদিক থেকেই সস্তা আর নিরাপদ।"
    >
      <label className="block mb-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground block mb-2">
          কতটুকু এলাকা:{" "}
          <span className="text-primary font-bold" data-scale-index={i}>
            {r.name}
          </span>
        </span>
        <input
          type="range"
          min={0}
          max={RUNGS.length - 1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          className="w-full accent-[var(--primary)]"
          aria-label="এলাকার আকার"
        />
        <div className="flex justify-between font-mono text-[8px] text-muted-foreground mt-1">
          <span>ঘর</span>
          <span>বাসা</span>
          <span>শহর</span>
          <span>দেশ</span>
          <span>পৃথিবী</span>
        </div>
      </label>

      <div className="flex items-center gap-3 mb-5">
        <span
          data-kind={r.kind}
          className={cn(
            "font-mono text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1 border",
            r.kind === "LAN"
              ? "border-accent text-accent bg-accent/10"
              : r.kind === "WAN"
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground",
          )}
        >
          {r.kind}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {KIND_LABEL[r.kind]}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-6">
        {rows.map((row) => (
          <div key={row.k} className="border border-border p-3">
            <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1">
              {row.k}
            </div>
            <div
              className={cn(
                "font-mono text-[11px] font-bold",
                row.bad ? "text-primary" : "text-accent",
              )}
              data-row={row.k}
            >
              {row.v}
            </div>
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
        {r.note}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. এই কথাটা কি LAN এ থাকে, নাকি WAN এ যায়                                   */
/* ------------------------------------------------------------------------- */

type Scene = {
  from: string;
  to: string;
  setting: string;
  stays: boolean; // true = stays in LAN
  why: string;
};

const SCENES: Scene[] = [
  {
    from: "আপনার Laptop",
    to: "বাসার Printer",
    setting: "বাসায় বসে একটা ফাইল Print করলেন।",
    stays: true,
    why: "দুইটাই আপনার বাসার LAN এ। কথাটা Router পর্যন্ত গিয়েই ফিরে আসে, বাইরে যায় না। তাই দ্রুত, বিনামূল্যে, আর Internet বন্ধ থাকলেও চলে।",
  },
  {
    from: "আপনার Phone",
    to: "একই বাসার Laptop",
    setting: "Phone থেকে Laptop এ AirDrop বা Nearby Share এ ছবি পাঠালেন।",
    stays: true,
    why: "একই LAN এর দুই যন্ত্র। ছবিটা বাসার ভেতরেই ঘোরে, ISP এর তার ছোঁয়ও না। এই কারণেই বড় ফাইলও সেকেন্ডে যায়, আর Data খরচ হয় না।",
  },
  {
    from: "আপনার Laptop",
    to: "Island Tours সার্ভার",
    setting: "Browser এ islandtours.com খুললেন।",
    stays: false,
    why: "সার্ভার Singapore এ, মানে বাইরের দুনিয়া। কথাটা Router দিয়ে বেরিয়ে ISP, সমুদ্রের তার হয়ে WAN এ যায়। তাই ধীর, Data খরচ হয়, আর Internet ছাড়া অচল।",
  },
  {
    from: "আপনার Laptop",
    to: "localhost:3000",
    setting: "নিজের মেশিনে চালানো একটা সার্ভার খুললেন।",
    stays: true,
    why: "এটা LAN এরও ভেতরে, একদম নিজের মেশিন। কথাটা Network Card পর্যন্ত যায়ই না, Lesson 03 এর Loopback। সবচেয়ে দ্রুত, সবচেয়ে ভেতরের দুনিয়া।",
  },
  {
    from: "অফিসের API",
    to: "অফিসের Database",
    setting: "অফিসের সার্ভার একই Rack এর Database এ Query পাঠাল।",
    stays: true,
    why: "দুইটাই এক LAN এ, একই ঘরে। এই কারণেই Database কে LAN এর ভেতরে রাখা হয়, বাইরে নয়, কারণ ভেতরের কথা দ্রুত আর নিরাপদ। বাইরের কেউ এই Database এ পৌঁছাতেই পারে না।",
  },
  {
    from: "পর্যটকের Phone",
    to: "bKash সার্ভার",
    setting: "পর্যটক টাকা দিলেন, API bKash কে ডাকল।",
    stays: false,
    why: "bKash আরেক কোম্পানির সার্ভার, বাইরের দুনিয়া, WAN। তাই এখানে সময় বেশি লাগে, একটা Timeout বাঁধতে হয়, আর নিরাপত্তার জন্য খাম বন্ধ রাখতে হয়। বাইরের প্রতিটা কথায় এই সাবধানতা।",
  },
];

export function InsideOrOutLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<number, boolean>>({});

  const s = SCENES[i];
  const pick = picks[i];
  const answered = pick !== undefined;
  const correct = answered && pick === s.stays;
  const score = Object.entries(picks).filter(
    ([k, v]) => SCENES[Number(k)].stays === v,
  ).length;

  const choose = (v: boolean) => {
    if (answered) return;
    setPicks((p) => ({ ...p, [i]: v }));
  };

  return (
    <Panel
      label="Interactive"
      title="এই কথাটা ভেতরে থাকে, নাকি বাইরে যায়"
      footer="একজন ইঞ্জিনিয়ারের সবচেয়ে কাজের অভ্যাসগুলোর একটা হলো, যেকোনো কথা শুনে সাথে সাথে বোঝা সেটা LAN এ থাকছে নাকি WAN এ যাচ্ছে। ভেতরে থাকলে দ্রুত, বিনামূল্যে, নিরাপদ। বাইরে গেলে ধীর, Data খরচ, আর সাবধানতা লাগে। এই এক প্রশ্নের উত্তরই ঠিক করে দেয় Database কোথায় বসবে, কোন কথায় Timeout লাগবে, আর কোথায় খাম বন্ধ করতে হবে।"
    >
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          দৃশ্য {toBn(i + 1)} / {toBn(SCENES.length)}
        </span>
        <span
          className="font-mono text-[10px] text-muted-foreground"
          data-score={score}
        >
          ঠিক <span className="text-primary font-bold">{toBn(score)}</span> /{" "}
          {toBn(Object.keys(picks).length)}
        </span>
      </div>

      <div className="border border-border bg-background p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] mb-3">
          <span className="px-2 py-1 border border-border text-foreground">
            {s.from}
          </span>
          <span className="text-primary">{"->"}</span>
          <span className="px-2 py-1 border border-border text-foreground">
            {s.to}
          </span>
        </div>
        <div className="text-sm text-foreground">{s.setting}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => choose(true)}
          disabled={answered}
          data-choice="stays"
          className={cn(
            "px-4 py-3 border font-mono text-[11px] font-bold uppercase tracking-[0.1em] transition-colors",
            !answered &&
              "border-border hover:border-accent/60 hover:bg-accent/5 cursor-pointer",
            answered && s.stays && "border-accent bg-accent/10 text-accent",
            answered &&
              !s.stays &&
              pick === true &&
              "border-primary bg-primary/10 text-primary",
            answered && !s.stays && pick !== true && "border-border opacity-50",
          )}
        >
          LAN এ থাকে
        </button>
        <button
          onClick={() => choose(false)}
          disabled={answered}
          data-choice="goes"
          className={cn(
            "px-4 py-3 border font-mono text-[11px] font-bold uppercase tracking-[0.1em] transition-colors",
            !answered &&
              "border-border hover:border-primary/60 hover:bg-primary/5 cursor-pointer",
            answered && !s.stays && "border-accent bg-accent/10 text-accent",
            answered &&
              s.stays &&
              pick === false &&
              "border-primary bg-primary/10 text-primary",
            answered && s.stays && pick !== false && "border-border opacity-50",
          )}
        >
          WAN এ যায়
        </button>
      </div>

      {answered && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          data-result={correct ? "correct" : "wrong"}
          className={cn(
            "mt-4 p-4 border text-sm leading-relaxed",
            correct
              ? "border-accent/50 bg-accent/5 text-foreground"
              : "border-primary/50 bg-primary/5 text-foreground",
          )}
        >
          <span
            className={cn(
              "font-mono text-[9px] font-bold uppercase tracking-[0.15em] block mb-1",
              correct ? "text-accent" : "text-primary",
            )}
          >
            {correct ? "ঠিক" : "আসলে"} {s.stays ? "LAN এ থাকে" : "WAN এ যায়"}
          </span>
          {s.why}
        </motion.div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setI((v) => (v + 1) % SCENES.length)}
          disabled={!answered}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 border font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
            answered
              ? "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
              : "border-border text-muted-foreground/40",
          )}
        >
          {i === SCENES.length - 1 ? "প্রথম থেকে" : "পরের দৃশ্য"}
        </button>
        <button
          onClick={() => {
            setPicks({});
            setI(0);
          }}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </Panel>
  );
}
