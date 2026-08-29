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
/* নাম দিন, IP পান                                                            */
/* ------------------------------------------------------------------------- */

type Site = {
  id: string;
  name: string;
  ips: string[];
  note: string;
};

const SITES: Site[] = [
  {
    id: "island",
    name: "islandtours.example",
    ips: ["103.94.135.2"],
    note: "একটা নাম, একটা IP। DNS নামটা নিয়ে এই ঠিকানা ফেরত দিল, এবার browser সরাসরি এখানেই connect করবে।",
  },
  {
    id: "google",
    name: "google.com",
    ips: ["142.250.194.14"],
    note: "চেনা নাম, পেছনে একটা সংখ্যা। আপনি কখনো এই সংখ্যাটা টাইপ করেন না, DNS ই মনে রাখে।",
  },
  {
    id: "big",
    name: "bigsite.example",
    ips: ["104.18.7.1", "104.18.8.1", "104.18.9.1"],
    note: "একই নামের পেছনে একাধিক IP। বড় সাইটে এমন হয়, যাতে ভিড় কয়েকটা সার্ভারে ভাগ করা যায়। কোনটা বেছে নেবে, সেটা পরের কথা।",
  },
  {
    id: "local",
    name: "localhost",
    ips: ["127.0.0.1"],
    note: "একটা বিশেষ নাম, নিজের সাথে নিজে (loopback, IP লেসন)। এটা বাইরে যায় না, নিজের যন্ত্রেই থামে।",
  },
];

export function DnsLookupLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState<string>(SITES[0].id);
  const s = SITES.find((x) => x.id === id) ?? SITES[0];
  const multi = s.ips.length > 1;

  return (
    <Panel
      label="Interactive"
      title="নাম দিন, ঠিকানা দেখুন"
      footer="প্রতিটা নামে চাপ দিয়ে দেখুন, DNS একটা করে IP ফেরত দিচ্ছে, আর আপনি সেই সংখ্যাটা কখনো নিজে জানতেন না। এটাই DNS এর মূল কাজ, নাম থেকে সংখ্যা। খেয়াল করুন bigsite এর মতো বড় নামের পেছনে একাধিক IP থাকতে পারে, আর localhost এর মতো কিছু নাম বিশেষ। একবার IP হাতে এলে বাকিটা আগের মডিউলের চেনা পথ, সরাসরি ওই IP তে connect।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {SITES.map((site) => (
          <button
            key={site.id}
            onClick={() => setId(site.id)}
            data-name={site.name}
            data-active={site.id === id ? "true" : "false"}
            className={cn(
              "px-3 py-2 border font-mono text-[11px] font-bold transition-colors",
              site.id === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {site.name}
          </button>
        ))}
      </div>

      {/* name -> resolver -> ip */}
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 mb-5">
        <div className="flex-1 border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            নাম
          </div>
          <div className="font-mono text-sm font-bold text-foreground break-all">
            {s.name}
          </div>
        </div>
        <div className="flex items-center justify-center text-primary font-mono text-lg sm:px-2">
          {"->"}
        </div>
        <div className="flex-1 border border-primary/40 bg-primary/5 p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            DNS ফেরত দিল
          </div>
          <div className="space-y-0.5" data-ips={s.ips.join(",")}>
            {s.ips.map((ip) => (
              <div key={ip} className="font-mono text-sm font-bold text-primary">
                {ip}
              </div>
            ))}
          </div>
          {multi && (
            <div className="mt-1 font-mono text-[9px] text-accent">
              একাধিক IP
            </div>
          )}
        </div>
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
    </Panel>
  );
}
