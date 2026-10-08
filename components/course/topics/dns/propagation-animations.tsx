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
/* Propagation: ছয় Resolver, ছয়টা আলাদা ঘড়ি                                   */
/* ------------------------------------------------------------------------- */

const OLD_IP = "103.94.135.2";
const NEW_IP = "45.120.8.9";

/**
 * left = বদলের মুহূর্তে এই Resolver এর Cache এ মেয়াদের কত ভাগ বাকি ছিল।
 * 0 মানে তার খাতায় নামটা ছিলই না, তাই প্রথম প্রশ্নেই নতুন উত্তর।
 */
const RESOLVERS = [
  { id: "new", name: "নতুন এক পর্যটকের Resolver", note: "নামটা আগে কখনো খোঁজেনি", left: 0 },
  { id: "cf", name: "Cloudflare 1.1.1.1", note: "অনেকক্ষণ আগে শিখেছিল", left: 0.1 },
  { id: "mobile", name: "মোবাইল অপারেটর", note: "বেশ আগে শিখেছিল", left: 0.35 },
  { id: "google", name: "Google 8.8.8.8", note: "মাঝামাঝি সময়ে শিখেছিল", left: 0.55 },
  { id: "isp", name: "ঢাকার একটা ISP", note: "কিছুক্ষণ আগে শিখেছিল", left: 0.8 },
  { id: "you", name: "আপনার নিজের Resolver", note: "বদলের ঠিক আগে শিখেছিল", left: 1 },
];

const TTLS = [
  { label: "৫ মিনিট", value: 300 },
  { label: "১ ঘণ্টা", value: 3600 },
  { label: "১ দিন", value: 86400 },
];

function human(sec: number): string {
  if (sec <= 0) return "০";
  if (sec < 60) return `${toBn(Math.ceil(sec))} সেকেন্ড`;
  if (sec < 3600) return `${toBn(Math.ceil(sec / 60))} মিনিট`;
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return m ? `${toBn(h)} ঘণ্টা ${toBn(m)} মিনিট` : `${toBn(h)} ঘণ্টা`;
}

export function PropagationClocksLab() {
  const reduce = useReducedMotion();
  const [ttl, setTtl] = useState(3600);
  const [elapsed, setElapsed] = useState(0);

  const step = ttl / 4;
  const rows = RESOLVERS.map((r) => {
    const remaining = Math.max(0, r.left * ttl - elapsed);
    return { ...r, remaining, fresh: remaining <= 0 };
  });
  const done = rows.filter((r) => r.fresh).length;
  const all = done === rows.length;

  return (
    <Panel
      label="Interactive"
      title="আপনি IP বদলালেন, কে কখন টের পায়"
      footer="গল্পটা এমন, আপনি এইমাত্র Record এর IP বদলেছেন। ছয়টা Resolver এর প্রত্যেকে পুরনো উত্তরটা আলাদা সময়ে শিখেছিল, তাই প্রত্যেকের মেয়াদ আলাদা সময়ে ফুরাবে। সময় এগিয়ে দেখুন কে আগে নতুন উত্তর পায়। খেয়াল করুন দুইটা জিনিস। এক, সবচেয়ে শেষে পায় আপনার নিজের Resolver, কারণ আপনি বদলের ঠিক আগে সাইটটা খুলে দেখেছিলেন, আর তাতে তার ঘড়ি নতুন করে চালু হয়েছে। দুই, TTL বদলে দেখুন, ৫ মিনিটে পুরো ব্যাপারটা মিনিটের মধ্যে শেষ, আর ১ দিনে পুরো এক দিন।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          বদলের আগে TTL ছিল
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
        <button
          onClick={() => setElapsed((e) => Math.min(ttl, e + step))}
          disabled={all}
          data-action="advance"
          className={cn(
            "px-3 py-1.5 border text-[11px] font-bold transition-colors",
            all
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          সময় এগোন, +{human(step)}
        </button>
        <button
          onClick={() => setElapsed(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[10px] text-muted-foreground">
          বদলের পর পার হয়েছে {elapsed === 0 ? "০" : human(elapsed)}
        </span>
      </div>

      <div className="space-y-2 mb-5">
        {rows.map((r) => (
          <div
            key={r.id}
            data-resolver={r.id}
            data-state={r.fresh ? "new" : "old"}
            className={cn(
              "grid grid-cols-1 sm:grid-cols-[1fr_150px_150px] gap-x-3 gap-y-1 items-center border px-3 py-2 transition-colors",
              r.fresh ? "border-primary/50 bg-primary/5" : "border-border bg-background",
            )}
          >
            <div>
              <div className="text-[12px] font-bold text-foreground">{r.name}</div>
              <div className="text-[10px] text-muted-foreground">{r.note}</div>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">
              {r.fresh ? "মেয়াদ শেষ, নতুন করে জিজ্ঞেস করেছে" : `Cache এ আর ${human(r.remaining)}`}
            </div>
            <div
              className={cn(
                "font-mono text-[12px] font-bold",
                r.fresh ? "text-primary" : "text-muted-foreground",
              )}
            >
              {r.fresh ? NEW_IP : OLD_IP}
            </div>
          </div>
        ))}
      </div>

      <motion.p
        key={`${ttl}-${done}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
        data-done={done}
      >
        {all
          ? `ছয়টার ছয়টাই এখন নতুন IP দিচ্ছে। পুরো ব্যাপারটায় লাগল ঠিক আগের TTL এর সমান সময়, ${human(ttl)}। এটাই সর্বোচ্চ সীমা, এর বেশি লাগার কথা নয়।`
          : `ছয়টার মধ্যে ${toBn(done)}টা এখন নতুন IP দিচ্ছে। এই মুহূর্তে কিছু পর্যটক নতুন সার্ভারে যাচ্ছেন আর কিছু পুরনোটায়, তাই দুইটা সার্ভারই চালু থাকা চাই।`}
      </motion.p>
    </Panel>
  );
}
