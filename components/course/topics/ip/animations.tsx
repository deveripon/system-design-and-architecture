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
/* 1. একটা Byte, ৮টা Bit, কেন 0 থেকে 255                                        */
/* ------------------------------------------------------------------------- */

const PLACES = [128, 64, 32, 16, 8, 4, 2, 1];

function valueToBits(v: number): boolean[] {
  return PLACES.map((p) => (v & p) !== 0);
}

const PRESETS = [
  { label: "0", value: 0 },
  { label: "5", value: 5 },
  { label: "168", value: 168 },
  { label: "192", value: 192 },
  { label: "255", value: 255 },
];

export function OctetBinaryLab() {
  const [bits, setBits] = useState<boolean[]>(() => valueToBits(192));

  const value = bits.reduce((sum, on, i) => sum + (on ? PLACES[i] : 0), 0);
  const binary = bits.map((b) => (b ? "1" : "0")).join("");
  const isMax = value === 255;

  const toggle = (i: number) =>
    setBits((prev) => prev.map((b, idx) => (idx === i ? !b : b)));

  return (
    <Panel
      label="Interactive"
      title="একটা Byte এর ভেতরে ৮টা Bit"
      footer="192.168.0.5 এর প্রথম সংখ্যা 192, আর সেটা আসলে 11000000, মানে বাঁ দিকের দুইটা Bit জ্বালানো (128 + 64)। উপরের ঘরগুলোতে চাপ দিয়ে Bit জ্বালান আর নেভান, নিচের সংখ্যাটা সাথে সাথে বদলাবে। আটটাই জ্বালালে পাবেন 255, এর বেশি কিছুতেই যাবে না, কারণ ৮টা Bit এর বেশি একটা Byte ধরতেই পারে না। এই কারণেই IP এর প্রতিটা সংখ্যা 0 থেকে 255 এর মধ্যে বাঁধা।"
    >
      {/* presets */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          দেখুন
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setBits(valueToBits(p.value))}
            data-preset={p.value}
            className={cn(
              "px-3 py-1.5 border font-mono text-[11px] font-bold transition-colors",
              value === p.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* the 8 bit cells */}
      <div className="grid grid-cols-8 gap-1.5 sm:gap-2 mb-6">
        {PLACES.map((place, i) => {
          const on = bits[i];
          return (
            <button
              key={place}
              onClick={() => toggle(i)}
              data-bit={i}
              data-on={on ? "1" : "0"}
              aria-label={`Bit ${place}, ${on ? "on" : "off"}`}
              className={cn(
                "flex flex-col items-center gap-1 py-3 border transition-colors",
                on
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-background text-muted-foreground/40 hover:border-primary/40",
              )}
            >
              <span className="font-mono text-lg font-bold leading-none">
                {on ? "1" : "0"}
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] leading-none opacity-70">
                {place}
              </span>
            </button>
          );
        })}
      </div>

      {/* readout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            এই Byte এর সংখ্যা
          </div>
          <div
            className="font-mono text-3xl font-bold text-primary leading-none"
            data-value={value}
          >
            {value}
          </div>
          <div
            className="font-mono text-[11px] text-muted-foreground mt-2"
            data-binary={binary}
          >
            {binary}
          </div>
        </div>
        <div
          className={cn(
            "flex items-center border p-4 text-sm leading-relaxed",
            isMax
              ? "border-primary/50 bg-primary/5 text-primary"
              : "border-border bg-background text-muted-foreground",
          )}
          data-max={isMax ? "true" : "false"}
        >
          {isMax
            ? "আটটাই এক, এটাই সর্বোচ্চ 255। এর পরের সংখ্যা 256 এর জন্য ৯ম একটা Bit লাগত, কিন্তু একটা Byte এ মোটে ৮টা। তাই 255 এর বেশি যায় না।"
            : "প্রতিটা জ্বালানো Bit তার নিচের সংখ্যাটা যোগ করে। সবগুলো জ্বালিয়ে দেখুন, সর্বোচ্চ কত হয়।"}
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. এই ঠিকানাটা কী রকম, IPv4 নাকি IPv6                                        */
/* ------------------------------------------------------------------------- */

type Sample = {
  id: string;
  addr: string;
  version: "IPv4" | "IPv6";
  bits: string;
  notation: string;
  sep: string;
  groups: string;
  note: string;
};

const SAMPLES: Sample[] = [
  {
    id: "v4-private",
    addr: "192.168.0.5",
    version: "IPv4",
    bits: "৩২ Bit",
    notation: "চারটা সংখ্যা (Decimal)",
    sep: "ফোঁটা (.)",
    groups: "৪টা অংশ, প্রতিটা 0 থেকে 255",
    note: "ফোঁটা দেখেই বোঝা যায় এটা IPv4। এটা বাসা বা অফিসের ভেতরের একটা ঠিকানা, বাইরের Internet এ এটা দিয়ে সরাসরি পৌঁছানো যায় না। কেন আলাদা, সেটা পরের লেসনের বিষয়।",
  },
  {
    id: "v4-public",
    addr: "103.94.135.2",
    version: "IPv4",
    bits: "৩২ Bit",
    notation: "চারটা সংখ্যা (Decimal)",
    sep: "ফোঁটা (.)",
    groups: "৪টা অংশ, প্রতিটা 0 থেকে 255",
    note: "এটাও IPv4, একই গঠন। তফাত শুধু এটা বাইরের দুনিয়ায় চেনানোর মতো একটা ঠিকানা, ভেতরের নয়। এই দুইয়ের তফাত পরের লেসনে।",
  },
  {
    id: "v6-full",
    addr: "2001:db8:85a3::8a2e:370:7334",
    version: "IPv6",
    bits: "১২৮ Bit",
    notation: "আটটা দল (Hex)",
    sep: "কোলন (:)",
    groups: "৮টা দল, প্রতিটা চারটা Hex অক্ষর",
    note: "কোলন দেখেই বোঝা যায় এটা IPv6, অনেক বড়। মাঝের :: আসলে একগাদা শূন্যের দল, ছোট করে লেখা। পুরো রূপে খুললে আটটা দল হতো।",
  },
  {
    id: "v4-loopback",
    addr: "127.0.0.1",
    version: "IPv4",
    bits: "৩২ Bit",
    notation: "চারটা সংখ্যা (Decimal)",
    sep: "ফোঁটা (.)",
    groups: "৪টা অংশ",
    note: "এটা একটা বিশেষ IPv4, যার নাম loopback। এটা মানে নিজের সাথে নিজে, যন্ত্রটা এই ঠিকানায় নিজেকেই খুঁজে পায়। localhost বললে এটাই বোঝায়।",
  },
  {
    id: "v6-loopback",
    addr: "::1",
    version: "IPv6",
    bits: "১২৮ Bit",
    notation: "দল (Hex)",
    sep: "কোলন (:)",
    groups: "প্রায় সবই শূন্য, শেষে 1",
    note: "এটাও নিজের সাথে নিজে, মানে loopback, কিন্তু IPv6 এর ভাষায়। 127.0.0.1 এর যমজ ভাই। :: মানে সামনের সব দলই শূন্য, শুধু শেষে একটা 1।",
  },
];

export function AddressInspectorLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState<string>(SAMPLES[0].id);
  const s = SAMPLES.find((x) => x.id === id) ?? SAMPLES[0];

  return (
    <Panel
      label="Interactive"
      title="ঠিকানাটা পড়ে বলুন, IPv4 নাকি IPv6"
      footer="চেনার সবচেয়ে সহজ নিয়ম, বিরামচিহ্ন দেখুন। ফোঁটা মানে IPv4, ছোট, চারটা সংখ্যা। কোলন মানে IPv6, বড়, দলে দলে Hex। খেয়াল করুন, 127.0.0.1 আর ::1 আসলে একই কাজ করে, নিজের সাথে নিজে, শুধু দুই প্রজন্মের দুই রূপ। ঠিকানাগুলোতে চাপ দিয়ে গঠনটা মিলিয়ে দেখুন।"
    >
      {/* the address chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SAMPLES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => setId(sample.id)}
            data-addr={sample.addr}
            data-active={sample.id === id ? "true" : "false"}
            className={cn(
              "px-3 py-2 border font-mono text-[11px] font-bold transition-colors",
              sample.id === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {sample.addr}
          </button>
        ))}
      </div>

      {/* the verdict */}
      <div className="border border-border bg-background p-5">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span
            className={cn(
              "px-3 py-1 border font-mono text-[11px] font-bold uppercase tracking-[0.12em]",
              "border-primary bg-primary/10 text-primary",
            )}
            data-version={s.version}
          >
            {s.version}
          </span>
          <span className="font-mono text-lg font-bold text-foreground break-all">
            {s.addr}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {[
            { k: "আকার", v: s.bits },
            { k: "কীভাবে লেখা", v: s.notation },
            { k: "আলাদা করে", v: s.sep },
            { k: "অংশ", v: s.groups },
          ].map((row) => (
            <div
              key={row.k}
              className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground shrink-0">
                {row.k}
              </span>
              <span className="text-[13px] text-foreground text-right">
                {row.v}
              </span>
            </div>
          ))}
        </div>

        <motion.p
          key={s.id}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="mt-5 text-sm leading-relaxed text-muted-foreground"
          data-note-for={s.id}
        >
          {s.note}
        </motion.p>
      </div>
    </Panel>
  );
}
