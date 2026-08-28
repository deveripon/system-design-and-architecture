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
/* 1. এই ঠিকানাটা Private নাকি Public                                          */
/* ------------------------------------------------------------------------- */

type Scope = {
  id: string;
  ip: string;
  kind: "Private" | "Public" | "Special";
  block: string;
  note: string;
};

const SCOPES: Scope[] = [
  {
    id: "p-192",
    ip: "192.168.0.5",
    kind: "Private",
    block: "192.168 ব্লক",
    note: "বাসার Router এর সবচেয়ে চেনা Private ঠিকানা। Internet এ এটা দিয়ে সরাসরি পৌঁছানো যায় না, এটা শুধু ভেতরের দুনিয়ার।",
  },
  {
    id: "p-10",
    ip: "10.0.0.8",
    kind: "Private",
    block: "10 ব্লক",
    note: "এটাও Private, তবে বড় ব্লকের। বড় কোম্পানি আর Cloud এ এই 10 দিয়ে শুরু ঠিকানা প্রচুর দেখবেন।",
  },
  {
    id: "p-172",
    ip: "172.16.5.20",
    kind: "Private",
    block: "172.16 থেকে 172.31 ব্লক",
    note: "মাঝের ব্লকটা, এটাও Private। মনে রাখার নিয়ম, 172 এর দ্বিতীয় সংখ্যা 16 থেকে 31 এর মধ্যে হলে তবেই Private।",
  },
  {
    id: "pub-103",
    ip: "103.94.135.2",
    kind: "Public",
    block: "কোনো Private ব্লকে পড়ে না",
    note: "এটা একটা Public ঠিকানা, Internet এ চেনানোর মতো। ISP এমন ঠিকানা দেয়, আর পুরো দুনিয়ায় এটা অনন্য।",
  },
  {
    id: "pub-8",
    ip: "8.8.8.8",
    kind: "Public",
    block: "কোনো Private ব্লকে পড়ে না",
    note: "এটাও Public, আর বেশ বিখ্যাত, এটা Google এর একটা DNS সার্ভার। যেকোনো জায়গা থেকে এটায় পৌঁছানো যায়, কারণ এটা বাইরের দুনিয়ার।",
  },
  {
    id: "loop",
    ip: "127.0.0.1",
    kind: "Special",
    block: "loopback, আলাদা জাত",
    note: "এটা Private ও নয়, Public ও নয়, এটা loopback, মানে নিজের সাথে নিজে (আগের লেসন)। যন্ত্র এই ঠিকানায় নিজেকেই খুঁজে পায়, কোথাও যায় না।",
  },
];

const KIND_STYLE: Record<Scope["kind"], string> = {
  Private: "border-primary bg-primary/10 text-primary",
  Public: "border-accent bg-accent/10 text-accent",
  Special: "border-border bg-muted text-muted-foreground",
};

export function IpScopeLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState<string>(SCOPES[0].id);
  const s = SCOPES.find((x) => x.id === id) ?? SCOPES[0];

  return (
    <Panel
      label="Interactive"
      title="Private নাকি Public, চিনুন"
      footer="চেনার সহজ নিয়ম, তিনটা ব্লক মুখস্থ রাখুন, 10 দিয়ে শুরু, 172.16 থেকে 172.31, আর 192.168 দিয়ে শুরু। এই তিনটার মধ্যে পড়লে সেটা Private, ভেতরের দুনিয়ার। এর বাইরের প্রায় সব কিছুই Public। আর 127 দিয়ে শুরু loopback, সে আলাদা জাত। ঠিকানাগুলোতে চাপ দিয়ে মিলিয়ে দেখুন।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {SCOPES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => setId(sample.id)}
            data-ip={sample.ip}
            data-active={sample.id === id ? "true" : "false"}
            className={cn(
              "px-3 py-2 border font-mono text-[11px] font-bold transition-colors",
              sample.id === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {sample.ip}
          </button>
        ))}
      </div>

      <div className="border border-border bg-background p-5">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span
            className={cn(
              "px-3 py-1 border font-mono text-[11px] font-bold uppercase tracking-[0.12em]",
              KIND_STYLE[s.kind],
            )}
            data-kind={s.kind}
          >
            {s.kind}
          </span>
          <span className="font-mono text-lg font-bold text-foreground">
            {s.ip}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2 mb-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground shrink-0">
            কোন ব্লক
          </span>
          <span className="text-[13px] text-foreground text-right">
            {s.block}
          </span>
        </div>

        <motion.p
          key={s.id}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="text-sm leading-relaxed text-muted-foreground"
          data-note-for={s.id}
        >
          {s.note}
        </motion.p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. এই মুহূর্তে কে কোন IP দেখছে                                              */
/* ------------------------------------------------------------------------- */

type Station = {
  at: string;
  src: string;
  swap: boolean;
  note: string;
};

const STATIONS: Station[] = [
  {
    at: "আপনার Laptop",
    src: "192.168.0.5",
    swap: false,
    note: "ভেতরের দুনিয়ায় আপনার Laptop এর ঠিকানা Private, 192.168.0.5। এই ঠিকানা দিয়েই সে অনুরোধটা বাসার Router এর কাছে পাঠায়।",
  },
  {
    at: "Router এর সীমানা",
    src: "103.94.135.2",
    swap: true,
    note: "অনুরোধ বাইরে পাঠানোর ঠিক আগে Router উৎস ঠিকানা বদলে দেয়, Private 192.168.0.5 এর জায়গায় বসায় বাসার Public IP 103.94.135.2। এই বদলে দেওয়ার কৌশলের নাম NAT, তার ভেতরের হিসাব পরের লেসনে।",
  },
  {
    at: "গন্তব্য Server",
    src: "103.94.135.2",
    swap: false,
    note: "Server অনুরোধটা পেয়ে দেখে এটা এসেছে 103.94.135.2 থেকে, মানে আপনার বাসার Public IP। আপনার Laptop এর Private 192.168.0.5 সে কখনো দেখেই না, তাই উত্তর সে পাঠায় ওই Public IP তেই।",
  },
  {
    at: "উত্তর, Router এ ফিরে",
    src: "192.168.0.5",
    swap: true,
    note: "উত্তর বাসার Public IP তে ফিরে এলে Router তার মনে রাখা হিসাব দেখে বুঝে ফেলে এটা আসলে আপনার Laptop এর, তাই ভেতরে 192.168.0.5 এ পৌঁছে দেয়। বাইরের কেউ কখনো আপনার ভেতরের ঠিকানা জানল না।",
  },
];

export function BoundaryLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const st = STATIONS[i];

  return (
    <Panel
      label="Interactive"
      title="কে কোন IP দেখে, ধাপে ধাপে"
      footer="পুরো গল্পের মূল কথা একটাই, আপনার Private IP কখনো বাসা ছাড়ে না। বাইরের Server শুধু আপনার বাসার Public IP দেখে, তাই আপনার Log এ ইউজারের Public IP থাকে, ভেতরের নয়। Router সীমানায় বসে ঠিকানা বদলে দেয় আসতে যেতে, আর সেই বদলের নাম NAT, পরের লেসনে বিস্তারিত। স্টেশনগুলোতে চাপ দিয়ে দেখুন প্রতি জায়গায় উৎস ঠিকানা কী।"
    >
      {/* station rail */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto">
        {STATIONS.map((s, idx) => (
          <div key={s.at} className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setI(idx)}
              data-station={idx}
              data-active={idx === i ? "true" : "false"}
              className={cn(
                "px-3 py-2 border font-mono text-[9px] transition-colors",
                idx === i
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
              )}
            >
              {s.at}
            </button>
            {idx < STATIONS.length - 1 && (
              <span className="text-muted-foreground/40 font-mono">{"->"}</span>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="border border-primary/50 bg-primary/5 p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            এখানে উৎস ঠিকানা দেখা যায়
          </div>
          <div
            className="font-mono text-base font-bold text-primary"
            data-src={st.src}
          >
            {st.src}
          </div>
        </div>
        <div
          className={cn(
            "flex items-center border p-4 font-mono text-[11px]",
            st.swap
              ? "border-accent/50 bg-accent/5 text-accent"
              : "border-border bg-background text-muted-foreground",
          )}
          data-swap={st.swap ? "true" : "false"}
        >
          {st.swap
            ? "এই সীমানায় Router ঠিকানা বদলে দিল (NAT)"
            : "এখানে ঠিকানা যেমন ছিল তেমনই"}
        </div>
      </div>

      <motion.p
        key={i}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
      >
        {st.note}
      </motion.p>
    </Panel>
  );
}
