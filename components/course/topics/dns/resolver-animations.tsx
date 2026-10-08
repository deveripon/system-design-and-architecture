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
/* 1. Resolver এর স্মৃতি: যত শেখে, তত কম হাঁটে                                 */
/* ------------------------------------------------------------------------- */

type Ask = { name: string; tld: string; zone: string };

const ASKS: Ask[] = [
  { name: "islandtours.example", tld: "example", zone: "islandtours.example" },
  { name: "api.islandtours.example", tld: "example", zone: "islandtours.example" },
  { name: "shop.example", tld: "example", zone: "shop.example" },
  { name: "news.test", tld: "test", zone: "news.test" },
];

type Memory = { tlds: string[]; zones: string[]; names: string[] };

const EMPTY: Memory = { tlds: [], zones: [], names: [] };

type Outcome = { name: string; hops: string[]; note: string };

function resolve(ask: Ask, mem: Memory): { out: Outcome; next: Memory } {
  if (mem.names.includes(ask.name)) {
    return {
      out: {
        name: ask.name,
        hops: [],
        note: "পুরো উত্তরটাই খাতায় ছিল। কাউকে জিজ্ঞেস করতে হয়নি, সাথে সাথে উত্তর।",
      },
      next: mem,
    };
  }
  const hops: string[] = [];
  let note: string;
  if (mem.zones.includes(ask.zone)) {
    hops.push("Authoritative");
    note =
      "এই Domain এর Authoritative server কে, সেটা আগে থেকেই জানা। তাই Root আর TLD বাদ, সোজা তার কাছে।";
  } else if (mem.tlds.includes(ask.tld)) {
    hops.push("TLD", "Authoritative");
    note = `.${ask.tld} এর TLD server কোথায়, সেটা জানা ছিল। তাই Root বাদ, TLD থেকে শুরু।`;
  } else {
    hops.push("Root", "TLD", "Authoritative");
    note =
      "এই নামের ব্যাপারে খাতায় কিছুই ছিল না। তাই পুরো হাঁটা, Root থেকে শুরু করে তিন ধাপ।";
  }
  return {
    out: { name: ask.name, hops, note },
    next: {
      tlds: mem.tlds.includes(ask.tld) ? mem.tlds : [...mem.tlds, ask.tld],
      zones: mem.zones.includes(ask.zone) ? mem.zones : [...mem.zones, ask.zone],
      names: [...mem.names, ask.name],
    },
  };
}

const ALL_HOPS = ["Root", "TLD", "Authoritative"];

export function ResolverMemoryLab() {
  const reduce = useReducedMotion();
  const [mem, setMem] = useState<Memory>(EMPTY);
  const [out, setOut] = useState<Outcome | null>(null);
  const [count, setCount] = useState(0);

  const ask = (a: Ask) => {
    const r = resolve(a, mem);
    setMem(r.next);
    setOut(r.out);
    setCount((c) => c + 1);
  };

  const reset = () => {
    setMem(EMPTY);
    setOut(null);
    setCount(0);
  };

  return (
    <Panel
      label="Interactive"
      title="Resolver যত শেখে, তত কম হাঁটে"
      footer="একটা একদম নতুন Resolver দিয়ে শুরু, যার খাতা ফাঁকা। উপর থেকে নিচে একটা একটা করে নামে চাপ দিন, আর দেখুন প্রতিবার সে কয় জায়গায় যায়। প্রথম নামে তিন ধাপ। দ্বিতীয়টা একই Domain এর উপনাম, তাই এক ধাপ। তৃতীয়টা নতুন Domain কিন্তু একই TLD, তাই দুই ধাপ। আর যেকোনো নামে আবার চাপ দিলে শূন্য ধাপ। একটা ব্যস্ত Resolver এর খাতা এতটাই ভরা থাকে যে Root এ তাকে খুব কমই যেতে হয়।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {ASKS.map((a) => (
          <button
            key={a.name}
            onClick={() => ask(a)}
            data-ask={a.name}
            className={cn(
              "px-3 py-2 border font-mono text-[11px] font-bold transition-colors",
              out?.name === a.name
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {a.name}
          </button>
        ))}
        <button
          onClick={reset}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {ALL_HOPS.map((h) => {
          const used = out ? out.hops.includes(h) : false;
          return (
            <div
              key={h}
              data-hop={h}
              data-used={used ? "true" : "false"}
              className={cn(
                "border p-3 text-center transition-colors",
                used
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground/60",
              )}
            >
              <div className="font-mono text-[11px] font-bold">{h}</div>
              <div className="mt-1 text-[10px]">
                {out ? (used ? "যেতে হলো" : "বাদ") : "অপেক্ষায়"}
              </div>
            </div>
          );
        })}
      </div>

      <motion.div
        key={count}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="border border-primary/40 bg-primary/5 p-4 mb-5"
        data-hops={out ? out.hops.length : -1}
      >
        {out ? (
          <>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              {out.name}
            </div>
            <div className="text-base font-bold text-primary mb-1">
              {toBn(out.hops.length)} ধাপ
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {out.note}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">
            খাতা এখন ফাঁকা। উপরের প্রথম নামটায় চাপ দিয়ে শুরু করুন।
          </p>
        )}
      </motion.div>

      <div className="border border-border bg-background p-4">
        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-3">
          Resolver এর খাতায় এখন যা আছে
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
          <div>
            <div className="font-bold text-foreground mb-1">চেনা TLD server</div>
            <div className="font-mono text-muted-foreground break-all">
              {mem.tlds.length ? mem.tlds.map((t) => `.${t}`).join(", ") : "কিছু নেই"}
            </div>
          </div>
          <div>
            <div className="font-bold text-foreground mb-1">চেনা Authoritative</div>
            <div className="font-mono text-muted-foreground break-all">
              {mem.zones.length ? mem.zones.join(", ") : "কিছু নেই"}
            </div>
          </div>
          <div>
            <div className="font-bold text-foreground mb-1">জানা উত্তর</div>
            <div className="font-mono text-muted-foreground break-all">
              {mem.names.length ? mem.names.join(", ") : "কিছু নেই"}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন Resolver, কী সুবিধা                                                  */
/* ------------------------------------------------------------------------- */

type Choice = {
  id: string;
  name: string;
  ips: string;
  who: string;
  good: string;
  watch: string;
};

const CHOICES: Choice[] = [
  {
    id: "isp",
    name: "ISP র Resolver",
    ips: "DHCP নিজে থেকে দেয়",
    who: "আপনার Internet সেবাদাতা",
    good: "কিছু করতে হয় না, আর সাধারণত আপনার খুব কাছে থাকে বলে দ্রুত।",
    watch: "মান ISP ভেদে আলাদা। কিছু ISP র Resolver ধীর, মাঝে মাঝে বন্ধ থাকে, বা নির্দিষ্ট সাইট আটকে দেয়।",
  },
  {
    id: "google",
    name: "Google Public DNS",
    ips: "8.8.8.8 আর 8.8.4.4",
    who: "Google",
    good: "পৃথিবীর সবচেয়ে চেনা Public Resolver। খুব নির্ভরযোগ্য, আর ঠিকানাটা মনে রাখা সহজ, তাই পরীক্ষার জন্য সবার প্রথম পছন্দ।",
    watch: "আপনার প্রশ্নগুলো Google এর কাছে যায়। কোনো ছাঁকনি নেই, যা চাইবেন তাই খুঁজে দেবে।",
  },
  {
    id: "cloudflare",
    name: "Cloudflare DNS",
    ips: "1.1.1.1 আর 1.0.0.1",
    who: "Cloudflare",
    good: "গতির জন্য পরিচিত, আর গোপনীয়তার উপর জোর দেয়। পরিবারের জন্য আলাদা ঠিকানাও আছে, 1.1.1.3, যেটা ক্ষতিকর আর প্রাপ্তবয়স্কদের সাইট আটকায়।",
    watch: "কিছু পুরনো Network যন্ত্র 1.1.1.1 ঠিকানাটাকে ভুলভাবে নিজের কাজে ব্যবহার করে, তখন সেখানে এটা চলে না।",
  },
  {
    id: "quad9",
    name: "Quad9",
    ips: "9.9.9.9 আর 149.112.112.112",
    who: "একটা অলাভজনক সংস্থা",
    good: "চেনা ক্ষতিকর আর প্রতারণার সাইটগুলো নিজে থেকেই আটকে দেয়। বাড়তি কিছু বসানো ছাড়াই এক স্তরের নিরাপত্তা।",
    watch: "খুব কম ক্ষেত্রে একটা নিরীহ সাইটও ভুল করে আটকে যেতে পারে।",
  },
];

export function ResolverPickerLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState<string>(CHOICES[0].id);
  const c = CHOICES.find((x) => x.id === id) ?? CHOICES[0];

  return (
    <Panel
      label="Interactive"
      title="চারটা চেনা Resolver, পাশাপাশি"
      footer="কোনটা সবার জন্য সেরা, এমন কোনো উত্তর নেই। আপনার জায়গা থেকে যেটা দ্রুত আর নির্ভরযোগ্য, সেটাই আপনার জন্য ভালো। তবে একটা কথা সবার জন্য সত্যি, এই ঠিকানাগুলো মনে রাখুন। কোনো সাইট না খুললে প্রথম পরীক্ষাটাই হলো, অন্য একটা Resolver কে জিজ্ঞেস করে দেখা সে কী বলে।"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {CHOICES.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setId(ch.id)}
            data-resolver={ch.id}
            data-active={ch.id === id ? "true" : "false"}
            className={cn(
              "px-3 py-2 border text-left text-[12px] font-bold transition-colors",
              ch.id === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {ch.name}
          </button>
        ))}
      </div>

      <motion.div
        key={c.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="border border-border bg-background p-5 space-y-4"
        data-choice={c.id}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              ঠিকানা
            </div>
            <div className="font-mono text-sm font-bold text-primary">{c.ips}</div>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              কে চালায়
            </div>
            <div className="text-sm font-bold text-foreground">{c.who}</div>
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            ভালো দিক
          </div>
          <div className="text-sm text-foreground leading-relaxed">{c.good}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            খেয়াল রাখুন
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">{c.watch}</div>
        </div>
      </motion.div>
    </Panel>
  );
}
