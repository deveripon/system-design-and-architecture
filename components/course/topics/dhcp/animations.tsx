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
/* DORA: Discover, Offer, Request, Acknowledge                               */
/* ------------------------------------------------------------------------- */

type Step = {
  code: string;
  name: string;
  from: string;
  to: string;
  broadcast: boolean;
  msg: string;
  note: string;
};

const STEPS: Step[] = [
  {
    code: "D",
    name: "Discover",
    from: "নতুন যন্ত্র",
    to: "সবাই",
    broadcast: true,
    msg: "DHCP server কি আছে? একটা ঠিকানা দরকার।",
    note: "যন্ত্রের এখনো কোনো IP নেই, DHCP server এর ঠিকানাও সে জানে না। তাই সে পুরো Network এ চেঁচিয়ে জিজ্ঞেস করে, যাকে বলে Broadcast। এটাই যাত্রার প্রথম পা।",
  },
  {
    code: "O",
    name: "Offer",
    from: "DHCP Server",
    to: "নতুন যন্ত্র",
    broadcast: false,
    msg: "একটা ঠিকানা দেওয়া যাচ্ছে, 192.168.0.5, সাথে Mask, Gateway আর DNS।",
    note: "server তার পুল থেকে একটা খালি ঠিকানা বেছে অফার করে, আর শুধু IP নয়, পুরো সেটিং একসাথে। Network এ একাধিক server থাকলে একাধিক অফারও আসতে পারে।",
  },
  {
    code: "R",
    name: "Request",
    from: "নতুন যন্ত্র",
    to: "সবাই",
    broadcast: true,
    msg: "আমি 192.168.0.5 টাই নিচ্ছি।",
    note: "যন্ত্র একটা অফার বেছে আনুষ্ঠানিকভাবে সেটাই চায়। এটাও Broadcast, যাতে বাকি server রা বুঝে যায় তাদের অফার নেওয়া হয়নি, তারা নিজেদের ঠিকানা ফেরত রাখতে পারে।",
  },
  {
    code: "A",
    name: "Acknowledge",
    from: "DHCP Server",
    to: "নতুন যন্ত্র",
    broadcast: false,
    msg: "ঠিক আছে, এই ঠিকানা এখন এই যন্ত্রের, ২৪ ঘণ্টার Lease এ।",
    note: "server নিশ্চিত করে দেয়, ঠিকানাটা এখন এই যন্ত্রের, একটা নির্দিষ্ট সময়ের জন্য, যাকে বলে Lease। এবার যন্ত্র পুরো Network এ কথা বলতে প্রস্তুত।",
  },
];

export function DoraLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const s = STEPS[i];

  return (
    <Panel
      label="Interactive"
      title="DORA, চার ধাপের হাত মেলানো"
      footer="পুরো ব্যাপারটা মনে রাখার সহজ নাম DORA: Discover, Offer, Request, Acknowledge। যন্ত্র চেঁচিয়ে খোঁজে, server ঠিকানা অফার করে, যন্ত্র একটা বেছে চায়, server নিশ্চিত করে। খেয়াল করুন, যন্ত্রের নিজের ঠিকানা না থাকায় তার দুইটা কথা (Discover আর Request) পুরো Network এ Broadcast হয়। চারটা ধাপ শেষ হলেই যন্ত্র অনলাইন। ধাপগুলোতে চাপ দিয়ে দেখুন কে কাকে কী বলে।"
    >
      {/* DORA rail */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {STEPS.map((step, idx) => (
          <button
            key={step.code}
            onClick={() => setI(idx)}
            data-step={step.code}
            data-active={idx === i ? "true" : "false"}
            className={cn(
              "flex flex-col items-center gap-1 py-3 border transition-colors",
              idx === i
                ? "border-primary bg-primary/10 text-primary"
                : idx < i
                  ? "border-border text-muted-foreground"
                  : "border-dashed border-border/50 text-muted-foreground/50 hover:text-foreground hover:border-primary/40",
            )}
          >
            <span className="font-mono text-lg font-bold leading-none">
              {step.code}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em]">
              {step.name}
            </span>
          </button>
        ))}
      </div>

      {/* who to who */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="px-3 py-1.5 border border-border bg-background font-mono text-[11px] font-bold text-foreground">
          {s.from}
        </span>
        <span className="text-primary font-mono">{"->"}</span>
        <span className="px-3 py-1.5 border border-border bg-background font-mono text-[11px] font-bold text-foreground">
          {s.to}
        </span>
        <span
          className={cn(
            "px-2.5 py-1 border font-mono text-[9px] font-bold uppercase tracking-[0.12em]",
            s.broadcast
              ? "border-primary/50 bg-primary/5 text-primary"
              : "border-accent/50 bg-accent/5 text-accent",
          )}
          data-broadcast={s.broadcast ? "true" : "false"}
        >
          {s.broadcast ? "Broadcast, সবাইকে" : "সরাসরি"}
        </span>
      </div>

      {/* message */}
      <div className="border border-primary/40 bg-primary/5 p-4 mb-5" data-msg={s.code}>
        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
          {s.code} · {s.name}
        </div>
        <div className="text-sm md:text-base font-medium text-foreground leading-relaxed">
          “{s.msg}”
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
