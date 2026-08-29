"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
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
/* shared maths                                                              */
/* ------------------------------------------------------------------------- */

/** Bit i (0..31) is a network bit when i is below the prefix length. */
function maskOctets(prefix: number): number[] {
  return [0, 1, 2, 3].map((oct) => {
    let v = 0;
    for (let b = 0; b < 8; b++) {
      if (oct * 8 + b < prefix) v += 128 >> b;
    }
    return v;
  });
}

function parseIp(ip: string): number[] {
  return ip.split(".").map((n) => parseInt(n, 10));
}

function networkOf(ip: number[], mask: number[]): number[] {
  return ip.map((o, i) => o & mask[i]);
}

/* ------------------------------------------------------------------------- */
/* 1. Prefix ঘোরান, Mask আর যন্ত্রসংখ্যা বদলাতে দেখুন                          */
/* ------------------------------------------------------------------------- */

const PREFIX_PRESETS = [8, 16, 24, 25, 26, 30];

export function PrefixLab() {
  const [prefix, setPrefix] = useState(24);

  const mask = maskOctets(prefix);
  const maskStr = mask.join(".");
  const hostBits = 32 - prefix;
  const usable = Math.pow(2, hostBits) - 2;
  const bits = Array.from({ length: 32 }, (_, i) => i < prefix);

  return (
    <Panel
      label="Interactive"
      title="Prefix বদলান, লাইনটা সরতে দেখুন"
      footer="বাঁ দিকের নীল bit গুলো Network, ডান দিকের ফাঁকা bit গুলো Host। Prefix বাড়ালে Network এর দিকে লাইন সরে, Host এর জায়গা কমে, তাই যন্ত্র কম ধরে। /24 এ ৮টা Host bit, তাই ২৫৪টা যন্ত্র। একটা bit ধার করে /25 করলেই সেটা অর্ধেক হয়ে ১২৬। প্রতিবার ২টা ঠিকানা বাদ যায়, একটা Network Address আর একটা Broadcast এর জন্য।"
    >
      {/* controls */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setPrefix((p) => Math.max(8, p - 1))}
          aria-label="Prefix কমান"
          className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span
          className="px-4 py-2 border border-primary bg-primary/10 font-mono text-sm font-bold text-primary tabular-nums"
          data-prefix={prefix}
        >
          /{prefix}
        </span>
        <button
          onClick={() => setPrefix((p) => Math.min(30, p + 1))}
          aria-label="Prefix বাড়ান"
          className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <span className="mx-2 h-5 w-px bg-border" />
        {PREFIX_PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setPrefix(p)}
            className={cn(
              "px-3 py-1.5 border font-mono text-[11px] font-bold transition-colors",
              prefix === p
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            /{p}
          </button>
        ))}
      </div>

      {/* 32 bits, grouped by octet */}
      <div className="overflow-x-auto mb-6">
        <div className="flex items-center gap-2" style={{ minWidth: 560 }}>
          {[0, 1, 2, 3].map((oct) => (
            <div key={oct} className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 8 }, (_, b) => {
                  const idx = oct * 8 + b;
                  const on = bits[idx];
                  return (
                    <span
                      key={b}
                      data-bit={idx}
                      data-net={on ? "1" : "0"}
                      className={cn(
                        "flex items-center justify-center w-5 h-7 border font-mono text-[10px] font-bold",
                        on
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border bg-background text-muted-foreground/40",
                      )}
                    >
                      {on ? "1" : "0"}
                    </span>
                  );
                })}
              </div>
              {oct < 3 && (
                <span className="font-mono text-muted-foreground/50">.</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* readout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            Subnet Mask
          </div>
          <div className="font-mono text-base font-bold text-primary" data-mask={maskStr}>
            {maskStr}
          </div>
        </div>
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            Network / Host bit
          </div>
          <div className="font-mono text-base font-bold text-foreground">
            {toBn(prefix)} / {toBn(hostBits)}
          </div>
        </div>
        <div className="border border-primary/40 bg-primary/5 p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            যন্ত্র ধরে
          </div>
          <div
            className="font-mono text-base font-bold text-primary tabular-nums"
            data-hosts={usable}
          >
            {usable.toLocaleString("en-US")}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একই Mask, একই দুই IP, তবু এক নাকি আলাদা Network                          */
/* ------------------------------------------------------------------------- */

const IP_A = "192.168.1.10";
const IP_B = "192.168.1.200";
const SAME_PRESETS = [23, 24, 25, 26];

export function SameSubnetLab() {
  const reduce = useReducedMotion();
  const [prefix, setPrefix] = useState(24);

  const mask = maskOctets(prefix);
  const maskStr = mask.join(".");
  const netA = networkOf(parseIp(IP_A), mask).join(".");
  const netB = networkOf(parseIp(IP_B), mask).join(".");
  const same = netA === netB;

  return (
    <Panel
      label="Interactive"
      title="এক Network নাকি আলাদা, Mask ঠিক করে"
      footer="মজার ব্যাপারটা দেখুন, IP দুইটা এক রেখেই শুধু Mask বদলালে উত্তর বদলে যায়। /24 এ দুইজনের Network এক, তাই তারা সরাসরি কথা বলে। /25 এ একজন পড়ে নিচের অর্ধেকে, আরেকজন উপরের অর্ধেকে, Network আলাদা হয়ে যায়, তখন তাদের কথা বলতে মাঝে Router লাগে। Network Address বের হয় IP আর Mask এর প্রতিটা অংশ AND করে। এই এক সিদ্ধান্তই ঠিক করে চিঠি সরাসরি যাবে নাকি দরজা দিয়ে বেরোবে।"
    >
      {/* prefix control */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          Mask
        </span>
        <button
          onClick={() => setPrefix((p) => Math.max(20, p - 1))}
          aria-label="Prefix কমান"
          className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="px-3 py-2 border border-primary bg-primary/10 font-mono text-sm font-bold text-primary tabular-nums">
          /{prefix}
        </span>
        <button
          onClick={() => setPrefix((p) => Math.min(28, p + 1))}
          aria-label="Prefix বাড়ান"
          className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <span className="mx-2 h-5 w-px bg-border" />
        {SAME_PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setPrefix(p)}
            className={cn(
              "px-3 py-1.5 border font-mono text-[11px] font-bold transition-colors",
              prefix === p
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            /{p}
          </button>
        ))}
        <span className="font-mono text-[10px] text-muted-foreground" data-mask={maskStr}>
          {maskStr}
        </span>
      </div>

      {/* two devices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            যন্ত্র A
          </div>
          <div className="font-mono text-sm font-bold text-foreground mb-2">
            {IP_A}
          </div>
          <div className="font-mono text-[10px] text-muted-foreground">
            Network:{" "}
            <span className="text-primary font-bold" data-net-a={netA}>
              {netA}
            </span>
          </div>
        </div>
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            যন্ত্র B
          </div>
          <div className="font-mono text-sm font-bold text-foreground mb-2">
            {IP_B}
          </div>
          <div className="font-mono text-[10px] text-muted-foreground">
            Network:{" "}
            <span className="text-primary font-bold" data-net-b={netB}>
              {netB}
            </span>
          </div>
        </div>
      </div>

      {/* verdict */}
      <motion.div
        key={same ? "same" : "diff"}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={cn(
          "border p-4 text-sm leading-relaxed",
          same
            ? "border-accent/50 bg-accent/5 text-accent"
            : "border-primary/50 bg-primary/5 text-primary",
        )}
        data-same={same ? "true" : "false"}
      >
        {same
          ? "একই Network। দুইজনের Network Address মিলে গেছে, তাই তারা সরাসরি একে অপরের সাথে কথা বলতে পারে, মাঝে Router লাগে না।"
          : "আলাদা Network। দুইজনের Network Address আলাদা, তাই সরাসরি কথা হয় না, চিঠি Router দিয়ে ঘুরে যেতে হয়।"}
      </motion.div>
    </Panel>
  );
}
