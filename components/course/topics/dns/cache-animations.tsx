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
/* TTL ঘড়ি: মালিক IP বদলালেন, Cache কখন টের পায়                              */
/* ------------------------------------------------------------------------- */

const OLD_IP = "103.94.135.2";
const NEW_IP = "45.120.8.9";

const TTLS = [
  { label: "৬০ সেকেন্ড", value: 60 },
  { label: "৫ মিনিট", value: 300 },
  { label: "১ ঘণ্টা", value: 3600 },
];

const JUMPS = [
  { label: "+৩০ সেকেন্ড", value: 30 },
  { label: "+৫ মিনিট", value: 300 },
  { label: "+৩০ মিনিট", value: 1800 },
];

function human(sec: number): string {
  if (sec < 60) return `${toBn(sec)} সেকেন্ড`;
  if (sec < 3600) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s ? `${toBn(m)} মিনিট ${toBn(s)} সেকেন্ড` : `${toBn(m)} মিনিট`;
  }
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return m ? `${toBn(h)} ঘণ্টা ${toBn(m)} মিনিট` : `${toBn(h)} ঘণ্টা`;
}

export function TtlClockLab() {
  const reduce = useReducedMotion();
  const [ttl, setTtl] = useState(300);
  const [elapsed, setElapsed] = useState(0);

  const remaining = Math.max(0, ttl - elapsed);
  const fresh = remaining > 0;
  const served = fresh ? OLD_IP : NEW_IP;
  const pct = Math.round((remaining / ttl) * 100);

  return (
    <Panel
      label="Interactive"
      title="মালিক IP বদলালেন, আপনি কখন টের পাবেন"
      footer="গল্পটা এমন, Resolver পুরনো IP টা মনে রাখল, আর ঠিক তারপরেই মালিক IP বদলে দিলেন। TTL শেষ না হওয়া পর্যন্ত Resolver আর জিজ্ঞেসই করে না, তাই পুরনো ঠিকানাই দিতে থাকে। TTL ছোট করে দেখুন, বদল কত দ্রুত পৌঁছায়। আবার ১ ঘণ্টা করে ৩০ মিনিট এগিয়ে দেখুন, তখনো পুরনো ঠিকানা। এই কারণেই লোকে বলে DNS বদলাতে সময় লাগে, আসলে সময় লাগে পুরনো Cache মরতে।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          TTL
        </span>
        {TTLS.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setTtl(t.value);
              setElapsed(0);
            }}
            data-ttl={t.value}
            className={cn(
              "px-3 py-1.5 border text-[11px] font-bold transition-colors",
              ttl === t.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          সময় এগোন
        </span>
        {JUMPS.map((j) => (
          <button
            key={j.value}
            onClick={() => setElapsed((e) => e + j.value)}
            className="px-3 py-1.5 border border-border text-[11px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            {j.label}
          </button>
        ))}
        <button
          onClick={() => setElapsed(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* TTL bar */}
      <div className="mb-5">
        <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
          <span>Cache এ বাকি সময়</span>
          <span data-remaining={remaining}>{human(remaining)}</span>
        </div>
        <div className="h-2 border border-border bg-background">
          <div
            className={cn(
              "h-full transition-all duration-300",
              fresh ? "bg-primary" : "bg-transparent",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 font-mono text-[9px] text-muted-foreground">
          পার হয়েছে {human(elapsed)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            Authoritative এ এখন আসল ঠিকানা
          </div>
          <div className="font-mono text-sm font-bold text-foreground">
            {NEW_IP}
          </div>
        </div>
        <div
          className={cn(
            "border p-4",
            fresh ? "border-primary/50 bg-primary/5" : "border-accent/50 bg-accent/5",
          )}
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            Resolver আপনাকে দিচ্ছে
          </div>
          <div
            className={cn(
              "font-mono text-sm font-bold",
              fresh ? "text-primary" : "text-accent",
            )}
            data-served={served}
          >
            {served}
          </div>
        </div>
      </div>

      <motion.p
        key={fresh ? "fresh" : "expired"}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
        data-state={fresh ? "cached" : "expired"}
      >
        {fresh
          ? "TTL এখনো শেষ হয়নি, তাই Resolver নতুন করে জিজ্ঞেসই করছে না। সে নিজের খাতার পুরনো ঠিকানাটাই দিচ্ছে, যদিও আসল ঠিকানা বদলে গেছে।"
          : "TTL শেষ। Resolver খাতার লেখাটা ফেলে দিয়ে আবার Authoritative কে জিজ্ঞেস করল, আর এবার নতুন ঠিকানাটা পেল। বদলটা অবশেষে আপনার কাছে পৌঁছাল।"}
      </motion.p>
    </Panel>
  );
}
