"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
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
/* 1. একই নাম, পাঁচ রকম যাত্রা                                                 */
/* ------------------------------------------------------------------------- */

const STAGES = [
  "Browser এর Cache",
  "Operating System এর Cache",
  "Router (Forwarder)",
  "Resolver এর Cache",
  "Root Server",
  "TLD Server",
  "Authoritative Server",
];

type State = "miss" | "hit" | "skip" | "pass" | "refer" | "nx";

type Scenario = {
  id: string;
  label: string;
  story: string;
  states: State[];
  texts: string[];
  ms: number;
  result: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "cold",
    label: "একদম প্রথমবার",
    story: "নামটা আগে কেউ কোথাও খোঁজেনি। সব খাতা ফাঁকা।",
    states: ["miss", "miss", "pass", "miss", "refer", "refer", "hit"],
    texts: [
      "খাতায় নেই। Operating System কে জিজ্ঞেস করে।",
      "hosts ফাইলে নেই, Cache এও নেই। DHCP র দেওয়া DNS ঠিকানায় পাঠায়।",
      "নিজে খোঁজে না। ISP র Resolver এর কাছে এগিয়ে দেয়।",
      "খাতায় কিছুই নেই। Root Hints দেখে হাঁটা শুরু করে।",
      "বলে, আমি জানি না, তবে .example এর TLD server এরা।",
      "বলে, এই Domain এর Name Server হলো এই দুইজন।",
      "আসল A Record দেয়, 103.94.135.2, TTL সহ।",
    ],
    ms: 140,
    result: "পুরো হাঁটা, সাতটা ধাপই লাগল। এটাই সবচেয়ে ধীর ক্ষেত্র, আর বাস্তবে সবচেয়ে বিরল।",
  },
  {
    id: "tld",
    label: "একই TLD এর আরেক নাম",
    story: "Resolver একটু আগে আরেকটা .example নাম খুঁজেছিল।",
    states: ["miss", "miss", "pass", "miss", "skip", "refer", "hit"],
    texts: [
      "খাতায় নেই।",
      "খাতায় নেই।",
      "এগিয়ে দেয়।",
      "এই নামটা নেই, কিন্তু .example এর TLD server কোথায় তা জানা।",
      "যেতে হয়নি। TLD এর ঠিকানা Resolver এর খাতায় ছিল।",
      "বলে, এই Domain এর Name Server হলো এই দুইজন।",
      "আসল A Record দেয়।",
    ],
    ms: 90,
    result: "Root বাদ। একটা ব্যস্ত Resolver এর বেশিরভাগ নতুন নামের খোঁজ এখান থেকেই শুরু হয়।",
  },
  {
    id: "resolver",
    label: "অন্য কেউ একটু আগে খুঁজেছে",
    story: "একই ISP র আরেকজন পাঁচ মিনিট আগে এই সাইটে গিয়েছিলেন।",
    states: ["miss", "miss", "pass", "hit", "skip", "skip", "skip"],
    texts: [
      "খাতায় নেই।",
      "খাতায় নেই।",
      "এগিয়ে দেয়।",
      "খাতায় আছে, মেয়াদ বাকি। সাথে সাথে উত্তর দেয়।",
      "যেতে হয়নি।",
      "যেতে হয়নি।",
      "যেতে হয়নি। সে জানেই না কেউ তার নাম খুঁজেছে।",
    ],
    ms: 18,
    result: "অন্যের খোঁজা উত্তর আপনার কাজে লাগল। জনপ্রিয় সাইটের বেশিরভাগ প্রশ্ন এখানেই মেটে।",
  },
  {
    id: "browser",
    label: "একই পাতা, আবার",
    story: "আপনি দশ সেকেন্ড আগে এই সাইটেই ছিলেন, আরেকটা লিংকে চাপ দিলেন।",
    states: ["hit", "skip", "skip", "skip", "skip", "skip", "skip"],
    texts: [
      "খাতায় আছে। কাউকে জিজ্ঞেস করার দরকারই পড়েনি।",
      "যেতে হয়নি।",
      "যেতে হয়নি।",
      "যেতে হয়নি।",
      "যেতে হয়নি।",
      "যেতে হয়নি।",
      "যেতে হয়নি।",
    ],
    ms: 0,
    result: "কোনো DNS প্রশ্নই হয়নি। Network এ একটা Packet ও যায়নি। আপনার দিনের বেশিরভাগ DNS খোঁজ আসলে এটাই।",
  },
  {
    id: "typo",
    label: "ভুল বানান",
    story: "আপনি islandtuors.example লিখেছেন। এই নামে কোনো Domain নেই।",
    states: ["miss", "miss", "pass", "miss", "refer", "nx", "skip"],
    texts: [
      "খাতায় নেই।",
      "খাতায় নেই।",
      "এগিয়ে দেয়।",
      "খাতায় নেই। হাঁটা শুরু করে।",
      "বলে, .example এর TLD server এরা।",
      "বলে, এই নামে আমার কাছে কোনো Domain নিবন্ধিত নেই। NXDOMAIN।",
      "এমন কোনো server ই নেই, কারণ Domain টাই নেই।",
    ],
    ms: 95,
    result: "উত্তর NXDOMAIN, আর এই নেই উত্তরটাও পথের সবাই কিছুক্ষণ Cache এ রাখে। Browser দেখায় সাইট খুঁজে পাওয়া যায়নি।",
  },
];

const BADGE: Record<State, { text: string; cls: string }> = {
  miss: { text: "নেই, পরের জনকে", cls: "border-border text-muted-foreground" },
  pass: { text: "এগিয়ে দিল", cls: "border-border text-muted-foreground" },
  refer: { text: "দিক দেখাল", cls: "border-accent/60 text-accent" },
  hit: { text: "উত্তর এখানে", cls: "border-primary bg-primary/10 text-primary" },
  nx: { text: "নাম নেই", cls: "border-destructive bg-destructive/10 text-destructive" },
  skip: { text: "বাদ", cls: "border-border/50 text-muted-foreground/50" },
};

export function JourneyScenarioLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState<string>(SCENARIOS[0].id);
  const s = SCENARIOS.find((x) => x.id === id) ?? SCENARIOS[0];
  const used = s.states.filter((st) => st !== "skip").length;

  return (
    <Panel
      label="Interactive"
      title="একই নাম, পাঁচ রকম যাত্রা"
      footer="উপরের পাঁচটা অবস্থা একটা একটা করে বেছে দেখুন, একই সাতটা ধাপের কোনটা লাগে আর কোনটা বাদ পড়ে। প্রথমটা সেই পুরো হাঁটা যেটা বইয়ে আঁকা থাকে। বাকি চারটা হলো যা বাস্তবে প্রায় সবসময় ঘটে। DNS দ্রুত, কারণ পুরো যাত্রাটা খুব কমই করতে হয়।"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-5">
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setId(sc.id)}
            data-scenario={sc.id}
            data-active={sc.id === id ? "true" : "false"}
            className={cn(
              "px-3 py-2 border text-left text-[12px] font-bold transition-colors",
              sc.id === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {sc.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-foreground leading-relaxed mb-5">{s.story}</p>

      <motion.div
        key={s.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="space-y-2 mb-5"
      >
        {STAGES.map((stage, i) => {
          const st = s.states[i];
          const b = BADGE[st];
          return (
            <div
              key={stage}
              data-stage={i + 1}
              data-state={st}
              className={cn(
                "grid grid-cols-1 sm:grid-cols-[28px_190px_1fr_130px] gap-x-3 gap-y-1 items-center border px-3 py-2",
                st === "skip" ? "border-border/50 opacity-60" : "border-border",
                st === "hit" && "border-primary/50 bg-primary/5",
              )}
            >
              <span className="font-mono text-[11px] font-bold text-muted-foreground">
                {toBn(i + 1)}
              </span>
              <span className="text-[12px] font-bold text-foreground">{stage}</span>
              <span className="text-[11px] text-muted-foreground leading-relaxed">
                {s.texts[i]}
              </span>
              <span className={cn("px-2 py-1 border text-center text-[10px] font-bold", b.cls)}>
                {b.text}
              </span>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3">
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            মোটামুটি সময়
          </div>
          <div className="font-mono text-lg font-bold text-primary" data-ms={s.ms}>
            {toBn(s.ms)} ms
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground" data-used={used}>
            {toBn(used)}টা ধাপ লাগল
          </div>
        </div>
        <div className="border border-primary/40 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{s.result}</p>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. সাইট খুলছে না, দোষ কার: ধাপে ধাপে রোগ নির্ণয়                             */
/* ------------------------------------------------------------------------- */

type NodeT = {
  q: string;
  cmd: string;
  yes: { label: string; to: string };
  no: { label: string; to: string };
};

type Verdict = { title: string; body: string };

const TREE: Record<string, NodeT> = {
  net: {
    q: "Internet আদৌ আছে তো?",
    cmd: "ping -c 3 8.8.8.8",
    yes: { label: "সাড়া আসছে", to: "local" },
    no: { label: "সাড়া নেই", to: "v-net" },
  },
  local: {
    q: "আপনার নিজের Resolver কি একটা IP দিচ্ছে?",
    cmd: "dig islandtours.example",
    yes: { label: "হ্যাঁ, NOERROR আর একটা IP", to: "right" },
    no: { label: "না, NXDOMAIN, SERVFAIL বা timed out", to: "public" },
  },
  right: {
    q: "IP টা কি ঠিক? উৎসের উত্তরের সাথে মেলে?",
    cmd: "dig +short A islandtours.example @ns1.dnshost.example",
    yes: { label: "মেলে", to: "v-server" },
    no: { label: "মেলে না, পুরনো IP", to: "v-cache" },
  },
  public: {
    q: "অন্য Resolver কি ঠিক উত্তর দিচ্ছে?",
    cmd: "dig @1.1.1.1 islandtours.example",
    yes: { label: "হ্যাঁ, দিচ্ছে", to: "v-resolver" },
    no: { label: "না, সেও পারছে না", to: "auth" },
  },
  auth: {
    q: "TLD কি ঠিক Name Server দেখাচ্ছে, আর তারা সাড়া দিচ্ছে?",
    cmd: "dig +trace islandtours.example",
    yes: { label: "হ্যাঁ, শেষ ধাপে গিয়ে নাম নেই", to: "v-record" },
    no: { label: "না, মাঝপথে থেমে যাচ্ছে", to: "v-ns" },
  },
};

const VERDICTS: Record<string, Verdict> = {
  "v-net": {
    title: "সমস্যা DNS এ নয়, Network এ",
    body: "IP ধরে ping করলেও সাড়া নেই, মানে নাম খোঁজার আগেই পথ বন্ধ। WiFi, Router আর ISP দেখুন। আগের মডিউলের Gateway আর DHCP র পরীক্ষাগুলো এখানে কাজে লাগবে।",
  },
  "v-server": {
    title: "DNS নির্দোষ, সমস্যা সার্ভারে বা পথে",
    body: "নাম ঠিক IP তে যাচ্ছে। এবার দেখুন সেই IP তে সার্ভার চালু আছে কি না, Firewall খোলা কি না, আর Cloudflare এর পেছনে হলে 521 বা 522 এর মতো Error আসছে কি না। curl -I দিয়ে শুরু করুন।",
  },
  "v-cache": {
    title: "পুরনো Cache, শুধু অপেক্ষা",
    body: "উৎস নতুন উত্তর দিচ্ছে, আপনার Resolver পুরনোটা ধরে আছে। এটা Propagation। dig দিয়ে বাকি মেয়াদ দেখুন, নিজের Cache মুছুন, আর পুরনো সার্ভার চালু রাখুন।",
  },
  "v-resolver": {
    title: "দোষ আপনার Resolver এর",
    body: "নাম ঠিক আছে, অন্যরা খুঁজে পাচ্ছে। আপনার ISP র Resolver বন্ধ, ধীর, অথবা সাইটটা আটকে রেখেছে। সাময়িকভাবে 1.1.1.1 বা 8.8.8.8 বসিয়ে নিন।",
  },
  "v-record": {
    title: "Record টা নেই বা ভুল",
    body: "পুরো পথ ঠিক, কিন্তু Authoritative বলছে এই নামে কিছু নেই। বানান দেখুন, Name ঘরে কী লিখেছেন দেখুন, আর নিশ্চিত হোন Record টা সঠিক DNS সেবায় বসানো।",
  },
  "v-ns": {
    title: "Name Server এ গোলমাল",
    body: "হাঁটা মাঝপথে থামছে। Registrar এ Name Server এর নামে ভুল, Domain এর মেয়াদ শেষ, DNS সেবা বন্ধ, অথবা পুরনো DNSSEC এর DS Record রয়ে গেছে। whois আর dig +short DS দিয়ে দেখুন।",
  },
};

export function DebugTreeLab() {
  const reduce = useReducedMotion();
  const [path, setPath] = useState<string[]>(["net"]);
  const current = path[path.length - 1];
  const node = TREE[current];
  const verdict = VERDICTS[current];

  return (
    <Panel
      label="Interactive"
      title="সাইট খুলছে না, দোষ কার"
      footer="প্রতিটা ধাপে উপরের কমান্ডটা চালালে কী ফল পেতেন, সেটা বেছে নিন। সর্বোচ্চ চারটা প্রশ্নে আপনি ছয়টা সম্ভাব্য কারণের একটায় পৌঁছাবেন। আসল পরিস্থিতিতে ঠিক এই ক্রমেই এগোন, আর প্রতিটা ধাপে আসল কমান্ডটা চালান। ক্রমটাই জরুরি, কারণ প্রতিটা প্রশ্ন বাকি সম্ভাবনার অর্ধেক বাদ দেয়।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          ধাপ {toBn(path.length)}
        </span>
        <button
          onClick={() => setPath(["net"])}
          data-action="restart"
          className="px-3 py-1 border border-border text-[11px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          শুরু থেকে
        </button>
        {path.length > 1 && (
          <button
            onClick={() => setPath((p) => p.slice(0, -1))}
            data-action="back"
            className="px-3 py-1 border border-border text-[11px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            এক ধাপ পেছনে
          </button>
        )}
      </div>

      <motion.div
        key={current}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-node={current}
      >
        {node ? (
          <div className="border border-border bg-background p-5">
            <div className="text-base font-bold text-foreground mb-3">{node.q}</div>
            <div className="font-mono text-[11px] text-accent break-all border border-border/60 bg-muted/30 px-3 py-2 mb-4">
              {node.cmd}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setPath((p) => [...p, node.yes.to])}
                data-answer="yes"
                className="px-3 py-2 border border-primary/50 bg-primary/5 text-left text-[12px] font-bold text-primary hover:bg-primary/10 transition-colors"
              >
                {node.yes.label}
              </button>
              <button
                onClick={() => setPath((p) => [...p, node.no.to])}
                data-answer="no"
                className="px-3 py-2 border border-border text-left text-[12px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                {node.no.label}
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-primary/50 bg-primary/5 p-5" data-verdict={current}>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              রায়
            </div>
            <div className="text-base font-bold text-primary mb-2">{verdict.title}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{verdict.body}</p>
          </div>
        )}
      </motion.div>
    </Panel>
  );
}
