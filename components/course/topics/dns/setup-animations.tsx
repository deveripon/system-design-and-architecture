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
/* 1. কোথায় জুড়বেন বাছুন, কী পাবেন আর কোথায় বসাবেন দেখুন                      */
/* ------------------------------------------------------------------------- */

type Rec = { type: string; name: string; value: string };

type Dest = {
  id: string;
  label: string;
  what: string;
  where: string;
  records: Rec[];
  source: string;
  verify: string;
};

const DESTS: Dest[] = [
  {
    id: "vps",
    label: "নিজের সার্ভার (VPS)",
    what: "আপনি একটা সার্ভার ভাড়া নিয়েছেন আর তাতে নিজে সাইট বসিয়েছেন।",
    where: "সার্ভার ভাড়া দেওয়া কোম্পানির পাতায়, সার্ভারটার বিবরণে, Public IP বা IPv4 নামে লেখা থাকে।",
    records: [
      { type: "A", name: "@", value: "103.94.135.2" },
      { type: "CNAME", name: "www", value: "islandtours.example" },
    ],
    source: "IP টা আপনার ভাড়া করা সার্ভারের নিজের ঠিকানা। কেউ আপনাকে কোনো ছক দেয় না, আপনি নিজেই IP টা দেখে A Record বানান।",
    verify: "কেউ যাচাই করে না। Record বসিয়ে dig দিয়ে নিজে দেখুন, তারপর সার্ভারের Web server এ নামটা বসান আর সার্টিফিকেট নিন।",
  },
  {
    id: "host",
    label: "Managed Hosting (Vercel এর মতো)",
    what: "সাইট এমন একটা Hosting এ, যেখানে সার্ভার আপনি দেখেন না, শুধু কোড তোলেন।",
    where: "Hosting এর পাতায় Project খুলে Settings, তারপর Domains। সেখানে নিজের Domain লিখে Add চাপলে সে একটা ছক দেখায়।",
    records: [
      { type: "A", name: "@", value: "76.76.21.21" },
      { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
    ],
    source: "দুইটা মানই Hosting এর। IP টা তাদের সার্ভারের, আর CNAME এর লক্ষ্যটা তাদের নিজেদের একটা নাম। এই মান Project ভেদে আলাদা হতে পারে, তাই সবসময় নিজের পাতায় যা দেখায় সেটাই কপি করুন।",
    verify: "Hosting নিজে আপনার Domain কে dig করে দেখে Record গুলো তার দিকে দেখাচ্ছে কি না। মিললে অবস্থা Valid হয়, আর সে নিজেই সার্টিফিকেট বানিয়ে নেয়।",
  },
  {
    id: "pages",
    label: "GitHub Pages",
    what: "একটা স্থির সাইট, যেটা GitHub এর Repository থেকে সরাসরি চলে।",
    where: "Repository র Settings এ Pages অংশে Custom domain ঘরে নাম লিখুন। Record এর মান থাকে GitHub এর নির্দেশিকায়, পাতায় নয়।",
    records: [
      { type: "A", name: "@", value: "185.199.108.153" },
      { type: "A", name: "@", value: "185.199.109.153" },
      { type: "A", name: "@", value: "185.199.110.153" },
      { type: "A", name: "@", value: "185.199.111.153" },
      { type: "CNAME", name: "www", value: "username.github.io" },
    ],
    source: "চারটা IP ই GitHub এর, সব গ্রাহকের জন্য একই। চারটাই বসাতে হয়, যাতে একটা বন্ধ হলে বাকিগুলো সামলায়। CNAME এর লক্ষ্য আপনার নিজের GitHub নাম দিয়ে তৈরি।",
    verify: "GitHub নিজে DNS পরীক্ষা করে। ঠিক হলে Pages এর পাতায় সবুজ টিক আসে, আর Enforce HTTPS চালু করা যায়।",
  },
  {
    id: "mail",
    label: "ইমেইল সেবা (Google Workspace এর মতো)",
    what: "নিজের Domain এর নামে ইমেইল ঠিকানা চান।",
    where: "ইমেইল সেবার Admin পাতায় Domain যোগ করলে একটা ধাপে ধাপে নির্দেশিকা চালু হয়। প্রথমে যাচাইয়ের লেখা দেয়, তারপর MX।",
    records: [
      { type: "TXT", name: "@", value: "google-site-verification=AbC123..." },
      { type: "MX", name: "@", value: "1 smtp.google.com" },
      { type: "TXT", name: "@", value: "v=spf1 include:_spf.google.com ~all" },
      { type: "TXT", name: "google._domainkey", value: "v=DKIM1; k=rsa; p=MIIB..." },
    ],
    source: "যাচাইয়ের লেখা আর DKIM এর চাবি শুধু আপনার Account এর জন্য বানানো, অন্য কারো সাথে মিলবে না। MX এর নাম আর SPF এর include সব গ্রাহকের জন্য একই, ইমেইল সেবার নিজের।",
    verify: "প্রতিটা ধাপের পর সেবার পাতায় Verify বা Activate চাপতে হয়। সে DNS এ লেখাটা খুঁজে পেলে পরের ধাপে যেতে দেয়।",
  },
  {
    id: "txn",
    label: "App থেকে ইমেইল পাঠানো (Resend, SendGrid এর মতো)",
    what: "আপনার App বুকিং নিশ্চিতকরণের মতো স্বয়ংক্রিয় ইমেইল পাঠাবে।",
    where: "সেবার পাতায় Domains অংশে Add Domain চাপুন। সে তিন থেকে পাঁচটা Record এর একটা ছক দেখায়, প্রতিটার পাশে অবস্থা।",
    records: [
      { type: "TXT", name: "s1._domainkey", value: "p=MIGfMA0GCSq..." },
      { type: "MX", name: "send", value: "10 feedback.mailservice.example" },
      { type: "TXT", name: "send", value: "v=spf1 include:mailservice.example ~all" },
    ],
    source: "সব মানই সেবার বানানো। খেয়াল করুন তারা প্রায়ই একটা উপনাম (যেমন send) ব্যবহার করে, যাতে আপনার মূল নামের ইমেইল সেটিংয়ে হাত না পড়ে।",
    verify: "সেবা কয়েক মিনিট পরপর নিজে DNS দেখে। প্রতিটা Record এর পাশে Pending থেকে Verified হয়। সবগুলো Verified না হলে সে আপনার নামে ইমেইল পাঠাতে দেয় না।",
  },
  {
    id: "proof",
    label: "শুধু মালিকানার প্রমাণ (Search Console এর মতো)",
    what: "কোনো সেবা শুধু জানতে চায় Domain টা আপনার, কোনো Traffic সেখানে যাবে না।",
    where: "সেবার পাতায় Domain যোগ করলে সে একটা লেখা দেখায় আর বলে এটা TXT Record হিসেবে বসান।",
    records: [{ type: "TXT", name: "@", value: "google-site-verification=Xy9..." }],
    source: "লেখাটা সেবা নিজে এলোমেলোভাবে বানায় আর নিজের খাতায় আপনার Account এর পাশে লিখে রাখে। এর নিজের কোনো মানে নেই, এটা শুধু একটা গোপন সংকেত।",
    verify: "Verify চাপলে সেবা আপনার Domain এর TXT খোঁজে। নিজের খাতার লেখার সাথে মিললে প্রমাণ হয় আপনার হাতে DNS এর নিয়ন্ত্রণ আছে।",
  },
];

export function SetupScenarioLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState<string>(DESTS[0].id);
  const d = DESTS.find((x) => x.id === id) ?? DESTS[0];

  return (
    <Panel
      label="Interactive"
      title="কোথায় জুড়বেন বাছুন, Record কোথা থেকে আসে দেখুন"
      footer="ছয়টা জায়গা একটা একটা করে বেছে দেখুন। প্রতিটায় চারটা প্রশ্নের উত্তর আছে, মানটা কোন পাতায় পাবেন, দেখতে কেমন, মানটা আসলে কার, আর শেষে কে কীভাবে যাচাই করে। খেয়াল করুন, ছয়টা জায়গা আলাদা হলেও গল্পটা প্রতিবার একই। সেবার পাতায় নিজের Domain লিখুন, সে একটা ছক দেখাবে, ছকটা নিজের DNS পাতায় বসান, তারপর সেবা নিজে DNS দেখে মিলিয়ে নেবে। এখানকার মানগুলো উদাহরণ, বাস্তবে সবসময় নিজের পাতায় যা দেখায় সেটাই কপি করুন।"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
        {DESTS.map((x) => (
          <button
            key={x.id}
            onClick={() => setId(x.id)}
            data-dest={x.id}
            data-active={x.id === id ? "true" : "false"}
            className={cn(
              "px-3 py-2 border text-left text-[12px] font-bold transition-colors",
              x.id === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {x.label}
          </button>
        ))}
      </div>

      <motion.div
        key={d.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="space-y-4"
        data-scenario={d.id}
      >
        <p className="text-sm text-foreground leading-relaxed">{d.what}</p>

        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            ১. মানগুলো কোন পাতায় পাবেন
          </div>
          <div className="text-sm text-foreground leading-relaxed">{d.where}</div>
        </div>

        <div className="border border-border bg-background">
          <div className="px-4 pt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            ২. আপনি যা পাবেন, আর নিজের DNS পাতায় যা বসাবেন
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[460px]">
              <div className="grid grid-cols-[70px_150px_1fr] gap-2 px-4 py-2 border-y border-border bg-muted/30 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                <span>Type</span>
                <span>Name</span>
                <span>Value</span>
              </div>
              {d.records.map((r, i) => (
                <div
                  key={`${r.type}-${r.name}-${i}`}
                  className="grid grid-cols-[70px_150px_1fr] gap-2 px-4 py-2 border-b border-border/60 last:border-b-0 font-mono text-[11px]"
                >
                  <span className="font-bold text-primary">{r.type}</span>
                  <span className="text-foreground break-all">{r.name}</span>
                  <span className="text-muted-foreground break-all">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-primary/40 bg-primary/5 p-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              ৩. মানগুলো আসলে কার
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">{d.source}</div>
          </div>
          <div className="border border-border bg-background p-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              ৪. কে যাচাই করে, কীভাবে
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">{d.verify}</div>
          </div>
        </div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. এই মানটা কোথায় বসবে: Registrar নাকি DNS সেবা                            */
/* ------------------------------------------------------------------------- */

type Place = "registrar" | "dns" | "service";

type Card = { text: string; from: string; answer: Place; why: string };

const CARDS: Card[] = [
  {
    text: "ada.ns.cloudflare.com",
    from: "Cloudflare এ Domain যোগ করার পর সে এটা দেখাল",
    answer: "registrar",
    why: "এটা একটা Name Server এর নাম। Name Server বসে শুধু এক জায়গায়, যেখানে Domain কিনেছেন, মানে Registrar এ।",
  },
  {
    text: "A   @   76.76.21.21",
    from: "Hosting এর Domains পাতা এই সারিটা দেখাল",
    answer: "dns",
    why: "এটা একটা Record। Record বসে DNS সেবায়, মানে আপনার Name Server যেখানে দেখাচ্ছে সেখানে।",
  },
  {
    text: "islandtours.example",
    from: "নিজের কেনা Domain এর নাম",
    answer: "service",
    why: "নিজের Domain এর নামটা আপনি লেখেন সেবার পাতায়, Add Domain ঘরে। এভাবেই সেবা জানে কোন নামের Request তার কাছে আসবে।",
  },
  {
    text: "TXT   @   google-site-verification=Xy9...",
    from: "Google যাচাইয়ের জন্য এটা দিল",
    answer: "dns",
    why: "এটাও একটা Record, তাই DNS সেবায়। Google এরপর DNS এ এটা খুঁজে দেখবে।",
  },
  {
    text: "MX   @   1 smtp.google.com",
    from: "ইমেইল সেবা এটা দিল",
    answer: "dns",
    why: "MX একটা Record। Registrar এ শুধু Name Server বসে, বাকি সব ধরনের Record বসে DNS সেবায়।",
  },
  {
    text: "ns1.vercel-dns.com",
    from: "Hosting বলল, চাইলে আমাদের Name Server ব্যবহার করুন",
    answer: "registrar",
    why: "আবার একটা Name Server এর নাম, তাই Registrar এ। এটা বসালে পুরো DNS এর দায়িত্ব Hosting এর হাতে চলে যায়।",
  },
  {
    text: "CNAME   www   cname.hosting.example",
    from: "Hosting এর Domains পাতা এই সারিটা দেখাল",
    answer: "dns",
    why: "Record, তাই DNS সেবায়। Name এ শুধু www, আর Value তে সেবার দেওয়া নামটা হুবহু।",
  },
];

const PLACES: { id: Place; label: string }[] = [
  { id: "registrar", label: "Registrar এ" },
  { id: "dns", label: "DNS সেবায়" },
  { id: "service", label: "যে সেবায় জুড়ছি তার পাতায়" },
];

export function WherePasteLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Place | null>(null);
  const [score, setScore] = useState(0);

  const done = i >= CARDS.length;
  const card = CARDS[Math.min(i, CARDS.length - 1)];
  const right = picked === card.answer;

  const pick = (p: Place) => {
    if (picked) return;
    setPicked(p);
    if (p === card.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    setI((n) => n + 1);
  };

  const reset = () => {
    setI(0);
    setPicked(null);
    setScore(0);
  };

  return (
    <Panel
      label="Interactive"
      title="এই মানটা কোথায় বসবে"
      footer="Domain Setup এর সবচেয়ে চেনা ভুল হলো ঠিক জিনিস ভুল জায়গায় বসানো। সাতটা মান একটা একটা করে আসবে। প্রতিটার জন্য বলুন, এটা কোন পাতায় গিয়ে বসাতে হবে। নিয়মটা ছোট, Name Server এর নাম যায় Registrar এ, বাকি সব Record যায় DNS সেবায়, আর নিজের Domain এর নামটা লিখতে হয় সেই সেবার পাতায় যেখানে জুড়ছেন।"
    >
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="font-mono text-[10px] text-muted-foreground" data-progress={i}>
          {done ? "শেষ" : `${toBn(i + 1)} / ${toBn(CARDS.length)}`}
        </span>
        <span className="font-mono text-[10px] text-primary" data-score={score}>
          ঠিক হয়েছে {toBn(score)}টা
        </span>
        <button
          onClick={reset}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {done ? (
        <div className="border border-primary/50 bg-primary/5 p-5" data-state="done">
          <div className="text-base font-bold text-primary mb-2">
            সাতটার মধ্যে {toBn(score)}টা ঠিক
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            সব ঠিক হলে আপনি Domain Setup এর সবচেয়ে বড় বিভ্রান্তিটা পার করে ফেলেছেন। কোনোটা
            ভুল হলে আবার চেষ্টা করুন, আর প্রতিবার নিজেকে জিজ্ঞেস করুন, এটা কি একটা Name Server
            এর নাম, নাকি একটা Record।
          </p>
        </div>
      ) : (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          data-card={i}
        >
          <div className="border border-border bg-background p-5 mb-4">
            <div className="text-[11px] text-muted-foreground mb-2">{card.from}</div>
            <div className="font-mono text-sm font-bold text-foreground break-all">
              {card.text}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            {PLACES.map((p) => {
              const isAnswer = picked && p.id === card.answer;
              const isWrongPick = picked === p.id && p.id !== card.answer;
              return (
                <button
                  key={p.id}
                  onClick={() => pick(p.id)}
                  data-place={p.id}
                  className={cn(
                    "px-3 py-2 border text-left text-[12px] font-bold transition-colors",
                    isAnswer
                      ? "border-primary bg-primary/10 text-primary"
                      : isWrongPick
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {picked && (
            <div
              className={cn(
                "border p-4",
                right ? "border-primary/40 bg-primary/5" : "border-destructive/40 bg-destructive/5",
              )}
              data-result={right ? "right" : "wrong"}
            >
              <div className={cn("text-sm font-bold mb-1", right ? "text-primary" : "text-destructive")}>
                {right ? "ঠিক" : "এখানে নয়"}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{card.why}</p>
              <button
                onClick={next}
                data-action="next"
                className="px-3 py-1.5 border border-primary bg-primary/10 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors"
              >
                পরেরটা
              </button>
            </div>
          )}
        </motion.div>
      )}
    </Panel>
  );
}
