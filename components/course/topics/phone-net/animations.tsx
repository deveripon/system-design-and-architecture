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
/* Wi-Fi আর Mobile Data, কী আলাদা, কী এক                                       */
/* ------------------------------------------------------------------------- */

type Mode = "wifi" | "mobile";

const RAMP: Record<Mode, { k: string; v: string }[]> = {
  wifi: [
    { k: "পরিচয় দেয়", v: "Wi-Fi Password" },
    { k: "IP কে দিল", v: "বাসার Router (DHCP)" },
    { k: "Gateway", v: "বাসার Router, 192.168.0.1" },
    { k: "Public IP", v: "বাসার NAT, একটা Public IP" },
  ],
  mobile: [
    { k: "পরিচয় দেয়", v: "SIM কার্ড" },
    { k: "IP কে দিল", v: "আপনার Carrier" },
    { k: "Gateway", v: "Carrier এর Gateway" },
    { k: "Public IP", v: "Carrier এর CGNAT, ভাগের" },
  ],
};

export function PathCompareLab() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("wifi");
  const rows = RAMP[mode];

  return (
    <Panel
      label="Interactive"
      title="আলাদাটা শুধু শুরুর কয়েক মিটার"
      footer="দুইটা পথে টগল করে দেখুন, উপরের চারটা সারি বদলায়, কিন্তু নিচের বাক্সটা এক থাকে। মানে ফোন কীভাবে প্রথম জোড়া লাগল আর কে ঠিকানা দিল, সেটুকুই শুধু Wi-Fi আর Mobile Data তে আলাদা। একবার IP, Gateway আর DNS হাতে এলে, তারপরের পুরো গল্প, নাম খোঁজা থেকে Server এ পৌঁছানো, হুবহু এক। তাই একই App দুই পথেই দিব্যি চলে, আপনাকে কিছু বদলাতে হয় না।"
    >
      {/* toggle */}
      <div className="flex gap-2 mb-6">
        {(["wifi", "mobile"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            data-mode={m}
            data-active={mode === m ? "true" : "false"}
            className={cn(
              "px-4 py-2 border font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors",
              mode === m
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {m === "wifi" ? "Wi-Fi" : "Mobile Data"}
          </button>
        ))}
      </div>

      {/* on-ramp rows (change) */}
      <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
        শুরুর অংশ, এটা আলাদা
      </div>
      <div className="border border-border bg-background mb-6">
        {rows.map((r, i) => (
          <div
            key={r.k}
            className={cn(
              "grid grid-cols-[1fr_1.4fr] gap-3 px-4 py-3",
              i < rows.length - 1 && "border-b border-border/60",
            )}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {r.k}
            </span>
            <motion.span
              key={mode + r.k}
              initial={reduce ? false : { opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="text-[13px] font-bold text-primary"
              data-ramp={r.k}
            >
              {r.v}
            </motion.span>
          </div>
        ))}
      </div>

      {/* downstream (same) */}
      <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
        তারপরের অংশ, এটা দুই পথেই এক
      </div>
      <div
        className="border border-accent/50 bg-accent/5 p-4"
        data-downstream="same"
      >
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-accent font-bold">
          <span>DNS দিয়ে নাম</span>
          <span className="opacity-50">{"->"}</span>
          <span>Gateway দিয়ে বাইরে</span>
          <span className="opacity-50">{"->"}</span>
          <span>NAT দিয়ে Public</span>
          <span className="opacity-50">{"->"}</span>
          <span>দরজা থেকে দরজা</span>
          <span className="opacity-50">{"->"}</span>
          <span>Server</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          এই পুরোটা Wi-Fi আর Mobile Data, দুই ক্ষেত্রেই হুবহু এক।
        </p>
      </div>
    </Panel>
  );
}
