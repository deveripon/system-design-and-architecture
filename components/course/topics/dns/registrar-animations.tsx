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
/* কে কী করে, চাপ দিয়ে দেখুন                                                   */
/* ------------------------------------------------------------------------- */

type Player = {
  id: string;
  name: string;
  role: string;
  analogy: string;
  example: string;
  touch: string;
};

const PLAYERS: Player[] = [
  {
    id: "icann",
    name: "ICANN",
    role: "পুরো নাম ব্যবস্থার তদারক করে, কোন TLD থাকবে ঠিক করে, আর Registrar দের অনুমোদন দেয়।",
    analogy: "যেন ভূমি অধিদপ্তর, যে পুরো ব্যবস্থার নিয়ম বানায়।",
    example: "ICANN, পৃথিবীতে একটাই",
    touch: "আপনি সরাসরি এর সাথে কাজ করেন না, কিন্তু এর নিয়মেই সব চলে।",
  },
  {
    id: "registry",
    name: "Registry",
    role: "একটা নির্দিষ্ট TLD এর আসল মালিক তালিকা রাখে, কোন নাম কার, সেই সত্য এখানে।",
    analogy: "একটা জেলার সরকারি জমির খতিয়ান অফিস।",
    example: "Verisign (.com), PIR (.org), BTCL (.bd)",
    touch: "আপনি সরাসরি Registry থেকে কেনেন না, মাঝে Registrar থাকে।",
  },
  {
    id: "registrar",
    name: "Registrar",
    role: "ICANN অনুমোদিত কোম্পানি, যে আপনার কাছে নাম বেচে আর Registry তে নিবন্ধন করে দেয়।",
    analogy: "লাইসেন্সধারী দালাল, যে কাগজপত্র খতিয়ান অফিসের সাথে সামলায়।",
    example: "Namecheap, GoDaddy, Cloudflare",
    touch: "নাম কিনতে, নবায়ন করতে, স্থানান্তর করতে এর সাথেই কাজ পড়ে।",
  },
  {
    id: "registrant",
    name: "Registrant (আপনি)",
    role: "যে নামটা নিবন্ধন করে, মানে ভাড়া নেয়। নামের দায়িত্ব এর কাঁধে।",
    analogy: "ভাড়াটে, যে জমিটা ভাড়া নিল।",
    example: "আপনি, Island Tours এর মালিক",
    touch: "সময়মতো নবায়ন করা আপনার কাজ, নাহলে নাম হাতছাড়া।",
  },
];

export function RoleLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState<string>(PLAYERS[0].id);
  const p = PLAYERS.find((x) => x.id === id) ?? PLAYERS[0];

  return (
    <Panel
      label="Interactive"
      title="কে কী করে, চার ভূমিকা"
      footer="চারটা ভূমিকা একবার মাথায় বসে গেলে পুরো ছবিটা সহজ হয়ে যায়। ICANN নিয়ম বানায়, Registry এক TLD এর সত্য তালিকা রাখে, Registrar আপনার কাছে বেচে, আর আপনি Registrant হিসেবে নামটা ভাড়া নেন। রোজকার কাজে আপনি শুধু Registrar এর সাথেই কথা বলেন, বাকিরা পেছনে থেকে ব্যবস্থাটা ধরে রাখে। প্রতিটা ভূমিকায় চাপ দিয়ে দেখুন কে ঠিক কী করে।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {PLAYERS.map((player) => (
          <button
            key={player.id}
            onClick={() => setId(player.id)}
            data-player={player.id}
            data-active={player.id === id ? "true" : "false"}
            className={cn(
              "px-3 py-2 border font-mono text-[11px] font-bold transition-colors",
              player.id === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {player.name}
          </button>
        ))}
      </div>

      <motion.div
        key={p.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="border border-border bg-background p-5 space-y-4"
        data-role-for={p.id}
      >
        <div className="font-mono text-sm font-bold text-primary">{p.name}</div>
        {[
          { k: "কাজ", v: p.role },
          { k: "যেন", v: p.analogy },
          { k: "উদাহরণ", v: p.example },
          { k: "কখন লাগে", v: p.touch },
        ].map((row) => (
          <div key={row.k} className="flex flex-col sm:flex-row sm:gap-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground shrink-0 sm:w-24 pt-0.5">
              {row.k}
            </span>
            <span className="text-sm text-foreground leading-relaxed">
              {row.v}
            </span>
          </div>
        ))}
      </motion.div>
    </Panel>
  );
}
