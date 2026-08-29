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
/* কোন চিঠি সরাসরি, কোনটা দরজা দিয়ে                                            */
/* ------------------------------------------------------------------------- */

const MY_IP = "192.168.0.5";
const MY_NETWORK = "192.168.0.0";
const GATEWAY = "192.168.0.1";
const MASK = [255, 255, 255, 0];

function networkOf(ip: string): string {
  return ip
    .split(".")
    .map((o, i) => parseInt(o, 10) & MASK[i])
    .join(".");
}

const DESTS = [
  { ip: "192.168.0.50", label: "পাশের Laptop" },
  { ip: "192.168.0.200", label: "বাসার Printer" },
  { ip: "192.168.1.5", label: "পাশের Subnet" },
  { ip: "8.8.8.8", label: "Google DNS" },
  { ip: "103.94.135.2", label: "একটা Website" },
];

export function RouteDecisionLab() {
  const reduce = useReducedMotion();
  const [ip, setIp] = useState<string>(DESTS[0].ip);

  const local = networkOf(ip) === MY_NETWORK;
  const nextHop = local ? ip : GATEWAY;

  return (
    <Panel
      label="Interactive"
      title="সরাসরি নাকি দরজা দিয়ে, চিঠি ঠিক করে"
      footer="আপনার যন্ত্র প্রতিটা চিঠির আগে একটাই প্রশ্ন করে, গন্তব্য কি আমার Network এর (192.168.0.0/24)? হ্যাঁ হলে সরাসরি পৌঁছে দেয়। না হলে সে গন্তব্যের পুরো ঠিকানা নিয়ে মাথা ঘামায় না, শুধু চিঠিটা তুলে দেয় Default Gateway 192.168.0.1 এর হাতে, আর দরজা বাকিটা সামলায়। খেয়াল করুন, 192.168.1.5 কাছের মনে হলেও আলাদা Network, তাই সেটাও দরজা দিয়ে যায়।"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-5 font-mono text-[10px] text-muted-foreground">
        <span>
          আপনি{" "}
          <span className="text-foreground font-bold">{MY_IP}</span>
        </span>
        <span>
          Network{" "}
          <span className="text-foreground font-bold">{MY_NETWORK}/24</span>
        </span>
        <span>
          Gateway{" "}
          <span className="text-primary font-bold">{GATEWAY}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {DESTS.map((d) => (
          <button
            key={d.ip}
            onClick={() => setIp(d.ip)}
            data-ip={d.ip}
            data-active={d.ip === ip ? "true" : "false"}
            className={cn(
              "flex flex-col items-start gap-0.5 px-3 py-2 border transition-colors",
              d.ip === ip
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            <span className="font-mono text-[11px] font-bold">{d.ip}</span>
            <span className="text-[9px] opacity-70">{d.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            গন্তব্যের Network
          </div>
          <div className="font-mono text-sm font-bold text-foreground" data-destnet={networkOf(ip)}>
            {networkOf(ip)}
          </div>
        </div>
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            আমার Network এর?
          </div>
          <div
            className={cn(
              "font-mono text-sm font-bold",
              local ? "text-accent" : "text-primary",
            )}
            data-local={local ? "true" : "false"}
          >
            {local ? "হ্যাঁ" : "না"}
          </div>
        </div>
        <div className="border border-primary/40 bg-primary/5 p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            পরের হাত
          </div>
          <div className="font-mono text-sm font-bold text-primary" data-nexthop={nextHop}>
            {nextHop}
          </div>
        </div>
      </div>

      <motion.div
        key={local ? `direct-${ip}` : "gateway"}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={cn(
          "border p-4 text-sm leading-relaxed",
          local
            ? "border-accent/50 bg-accent/5 text-accent"
            : "border-primary/50 bg-primary/5 text-primary",
        )}
        data-verdict={local ? "direct" : "gateway"}
      >
        {local
          ? "একই Network, তাই চিঠি সরাসরি ওই যন্ত্রেই যায়, LAN এর ভেতরে, Gateway লাগে না।"
          : "আলাদা Network, তাই চিঠি যায় Default Gateway 192.168.0.1 এর হাতে, আর দরজা সেটা বাইরের পথে এগিয়ে দেয়।"}
      </motion.div>
    </Panel>
  );
}
