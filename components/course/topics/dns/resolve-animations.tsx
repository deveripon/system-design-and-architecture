"use client";

import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
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
/* Resolver এর হাঁটা: Root -> TLD -> Authoritative -> উত্তর                      */
/* ------------------------------------------------------------------------- */

type Step = {
  station: string;
  ask: string;
  kind: "referral" | "answer" | "done";
  reply: string;
  note: string;
};

const STEPS: Step[] = [
  {
    station: "Root",
    ask: "Root Server",
    kind: "referral",
    reply: "জানি না, তবে .example চালায় যে TLD server রা, এই তাদের ঠিকানা। উত্তর ওদের কাছে।",
    note: "Root দুনিয়ার কোনো নামের IP জানে না। সে শুধু জানে কোন TLD কে চালায়। তাই এক ধাপ নিচে, TLD এর দিকে পাঠিয়ে দিল। এটাই Referral, উত্তর নয়, দিকনির্দেশ।",
  },
  {
    station: "TLD",
    ask: ".example TLD Server",
    kind: "referral",
    reply: "আমিও জানি না, তবে islandtours.example এর হিসাব রাখে যে Authoritative server, এই তার ঠিকানা।",
    note: "TLD server শুধু জানে কোন Domain এর হিসাব কে রাখে, মানে কার Authoritative server কোনটা। আরেক ধাপ নিচে পাঠাল। এখনো আসল উত্তর নয়।",
  },
  {
    station: "Authoritative",
    ask: "islandtours.example এর Authoritative Server",
    kind: "answer",
    reply: "103.94.135.2। এটাই আসল, চূড়ান্ত উত্তর।",
    note: "এইটাই সেই server যার কাছে নামটার আসল হিসাব। সে চূড়ান্ত উত্তর দিল, যাকে বলে Authoritative answer, সত্যের উৎস। হাঁটা শেষ।",
  },
  {
    station: "উত্তর",
    ask: "আপনার যন্ত্রে ফেরত",
    kind: "done",
    reply: "103.94.135.2 পাওয়া গেছে।",
    note: "Resolver উত্তরটা আপনাকে ফেরত দিল, আর মনে রেখে দিল (Cache)। তাই পরেরবার একই নাম চাইলে এই পুরো হাঁটা আর লাগবে না, উত্তর প্রায় সাথে সাথে।",
  },
];

const KIND_BADGE: Record<Step["kind"], { text: string; cls: string }> = {
  referral: { text: "Referral, দিকনির্দেশ", cls: "border-border bg-muted text-muted-foreground" },
  answer: { text: "Answer, আসল উত্তর", cls: "border-accent/50 bg-accent/5 text-accent" },
  done: { text: "পৌঁছে গেছে", cls: "border-primary/50 bg-primary/5 text-primary" },
};

export function ResolveWalkLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const s = STEPS[i];
  const badge = KIND_BADGE[s.kind];

  return (
    <Panel
      label="Interactive"
      title="Resolver এর হাঁটা, www.islandtours.example"
      footer="খেয়াল করুন, আপনি একবার মাত্র জিজ্ঞেস করেন আপনার Resolver কে, আর সে ভেতরে ভেতরে এই তিন ধাপ হেঁটে উত্তরটা নিয়ে আসে। উপরের দুইজন, Root আর TLD, আসল উত্তর দেয় না, শুধু এক ধাপ নিচে পাঠায় (Referral)। একমাত্র Authoritative server আসল উত্তর দেয়। প্রথমবার পুরো হাঁটা লাগে, কিন্তু উত্তরটা Cache এ রাখা হয় বলে পরেরবার প্রায় সাথে সাথে পাওয়া যায়। ধাপগুলোতে চাপ দিয়ে দেখুন কে কী বলে।"
    >
      {/* rail */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto">
        {STEPS.map((step, idx) => (
          <div key={step.station} className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setI(idx)}
              data-station={step.station}
              data-active={idx === i ? "true" : "false"}
              className={cn(
                "px-3 py-2 border font-mono text-[9px] font-bold transition-colors",
                idx === i
                  ? "border-primary bg-primary/10 text-primary"
                  : idx < i
                    ? "border-border text-muted-foreground"
                    : "border-dashed border-border/50 text-muted-foreground/50 hover:text-foreground hover:border-primary/40",
              )}
            >
              {step.station}
            </button>
            {idx < STEPS.length - 1 && (
              <span className="text-muted-foreground/40 font-mono">{"->"}</span>
            )}
          </div>
        ))}
      </div>

      {/* who is asked + badge */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          জিজ্ঞেস করল
        </span>
        <span className="px-3 py-1.5 border border-border bg-background font-mono text-[11px] font-bold text-foreground">
          {s.ask}
        </span>
        <span
          className={cn(
            "px-2.5 py-1 border font-mono text-[9px] font-bold uppercase tracking-[0.1em]",
            badge.cls,
          )}
          data-kind={s.kind}
        >
          {badge.text}
        </span>
      </div>

      {/* reply */}
      <div
        className={cn(
          "border p-4 mb-5",
          s.kind === "answer"
            ? "border-accent/50 bg-accent/5"
            : s.kind === "done"
              ? "border-primary/50 bg-primary/5"
              : "border-border bg-background",
        )}
        data-reply={s.station}
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
          উত্তর দিল
        </div>
        <div
          className={cn(
            "text-sm md:text-base font-medium leading-relaxed",
            s.kind === "answer"
              ? "text-accent"
              : s.kind === "done"
                ? "text-primary"
                : "text-foreground",
          )}
        >
          “{s.reply}”
        </div>
      </div>

      <motion.p
        key={i}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
      >
        {s.note}
      </motion.p>
    </Panel>
  );
}
