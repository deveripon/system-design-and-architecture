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
/* NAT টেবিল: এক Public IP, অনেক Connection, Port দিয়ে আলাদা                    */
/* ------------------------------------------------------------------------- */

const PUBLIC_IP = "103.94.135.2";

type Row = {
  pubPort: string;
  inside: string;
  who: string;
  dest: string;
};

const ROWS: Row[] = [
  {
    pubPort: "40001",
    inside: "192.168.0.5:51001",
    who: "Laptop, Site A",
    dest: "103.20.5.8",
  },
  {
    pubPort: "40002",
    inside: "192.168.0.6:52340",
    who: "Phone, একটা App",
    dest: "20.44.10.9",
  },
  {
    pubPort: "40003",
    inside: "192.168.0.5:51002",
    who: "Laptop, Site B",
    dest: "104.18.7.1",
  },
];

const CHOICES = ["40001", "40002", "40003", "55555"];

export function NatTableLab() {
  const reduce = useReducedMotion();
  const [port, setPort] = useState<string>("40001");
  const matched = ROWS.find((r) => r.pubPort === port) ?? null;

  return (
    <Panel
      label="Interactive"
      title="এক Public IP, অনেক Connection, Port আলাদা করে"
      footer="খেয়াল করুন, তিনটা Connection ই বাইরে যাচ্ছে একটাই Public IP (103.94.135.2) দিয়ে, এমনকি প্রথম আর তৃতীয়টা একই Laptop এর। তবু গণ্ডগোল হয় না, কারণ প্রতিটার Public Port আলাদা। উত্তর যখন ফেরে, Router শুধু Port নম্বরটা দেখে টেবিলে মিলিয়ে বুঝে ফেলে এটা ভেতরের ঠিক কার। আর যে Port এর কোনো সারি নেই, তার উত্তর ফেলে দেয়, এটাই বাইরের থেকে ভেতরে সরাসরি ঢোকা আটকে দেয়।"
    >
      {/* the table */}
      <div className="border border-border bg-background overflow-x-auto mb-6">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[1.4fr_1.2fr_1.1fr] gap-2 px-4 py-2 border-b border-border bg-muted/20 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>ভেতরের (Private)</span>
            <span>বাইরের Port</span>
            <span>কার সাথে</span>
          </div>
          {ROWS.map((r) => {
            const active = r.pubPort === port;
            return (
              <div
                key={r.pubPort}
                data-row={r.pubPort}
                data-active={active ? "true" : "false"}
                className={cn(
                  "grid grid-cols-[1.4fr_1.2fr_1.1fr] gap-2 px-4 py-3 border-b border-border/60 transition-colors",
                  active ? "bg-primary/10" : "bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[11px] font-bold",
                    active ? "text-primary" : "text-foreground",
                  )}
                >
                  {r.inside}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {PUBLIC_IP}:
                  <span className={active ? "text-primary font-bold" : "text-foreground"}>
                    {r.pubPort}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {r.who}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* reply chooser */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          উত্তর ফিরল
        </span>
        {CHOICES.map((p) => (
          <button
            key={p}
            onClick={() => setPort(p)}
            data-port={p}
            className={cn(
              "px-3 py-1.5 border font-mono text-[11px] font-bold transition-colors",
              port === p
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {PUBLIC_IP}:{p}
          </button>
        ))}
      </div>

      {/* verdict */}
      <motion.div
        key={port}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={cn(
          "border p-4 text-sm leading-relaxed",
          matched
            ? "border-accent/50 bg-accent/5 text-accent"
            : "border-primary/50 bg-primary/5 text-primary",
        )}
        data-matched={matched ? "true" : "false"}
      >
        {matched ? (
          <>
            টেবিলে মিলল। Router এটা ভেতরে পাঠাল{" "}
            <span className="font-mono font-bold">{matched.inside}</span> এ, মানে{" "}
            {matched.who}। শুধু Port নম্বরটা দেখেই সে বুঝে গেল কার উত্তর।
          </>
        ) : (
          <>
            এই Port এর কোনো সারি টেবিলে নেই, তাই Router বুঝল না এটা ভেতরের কার
            জন্য, তাই ফেলে দিল। এই কারণেই বাইরের কেউ নিজে থেকে ভেতরে ঢুকতে পারে
            না, একটা স্বাভাবিক দেয়াল।
          </>
        )}
      </motion.div>
    </Panel>
  );
}
