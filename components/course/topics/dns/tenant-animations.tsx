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
/* 1. Wildcard কাকে ধরে, কাকে ধরে না                                           */
/* ------------------------------------------------------------------------- */

const ZONE = [
  { name: "@", type: "A", value: "103.94.135.2" },
  { name: "www", type: "CNAME", value: "islandtours.example" },
  { name: "api", type: "A", value: "103.94.135.3" },
  { name: "mail", type: "MX", value: "10 mail1.provider.example" },
  { name: "*", type: "A", value: "103.94.135.2" },
];

type Probe = {
  host: string;
  row: number | null;
  answer: string;
  verdict: "wild" | "exact" | "none" | "cert";
  why: string;
};

const PROBES: Probe[] = [
  {
    host: "seagull.islandtours.example",
    row: 4,
    answer: "103.94.135.2",
    verdict: "wild",
    why: "seagull নামে কোনো Record নেই। তাই Wildcard সারিটা উত্তর দেয়। নতুন গ্রাহক যোগ হলে DNS এ কিছুই করতে হয় না, এটাই Wildcard এর পুরো সুবিধা।",
  },
  {
    host: "coral.islandtours.example",
    row: 4,
    answer: "103.94.135.2",
    verdict: "wild",
    why: "একই ঘটনা। একটা সারি, অসংখ্য গ্রাহক। এমনকি যে নাম কোনো গ্রাহকের নয়, যেমন একটা ভুল বানান, সেটাও এই উত্তর পায়। তাই App কে নিজে দেখতে হয় নামটা সত্যিই কোনো গ্রাহকের কি না।",
  },
  {
    host: "api.islandtours.example",
    row: 2,
    answer: "103.94.135.3",
    verdict: "exact",
    why: "api নামে নিজের একটা Record আছে। নির্দিষ্ট Record সবসময় Wildcard এর উপরে জেতে। তাই Wildcard থাকলেও আপনার নিজের উপনামগুলো নিজের জায়গায় যায়।",
  },
  {
    host: "islandtours.example",
    row: 0,
    answer: "103.94.135.2",
    verdict: "exact",
    why: "মূল নাম Wildcard এর আওতায় পড়ে না। তারকা মানে মূল নামের নিচের নামগুলো, মূল নাম নিজে নয়। তাই মূল নামের জন্য সবসময় আলাদা একটা Record লাগে।",
  },
  {
    host: "mail.islandtours.example",
    row: 3,
    answer: "কোনো A Record নেই",
    verdict: "none",
    why: "একটা সূক্ষ্ম ফাঁদ। mail নামটা আছে, কারণ তার একটা MX আছে। Wildcard শুধু সেই নামের জন্য কাজ করে যেটা একেবারেই নেই। নামটা যেকোনো ধরনের Record নিয়ে থাকলেই Wildcard সরে দাঁড়ায়। তাই এখানে A চাইলে উত্তর ফাঁকা।",
  },
  {
    host: "shop.seagull.islandtours.example",
    row: 4,
    answer: "103.94.135.2",
    verdict: "cert",
    why: "DNS এ Wildcard দুই স্তর গভীর নামকেও ধরে, তাই IP ঠিকই আসে। কিন্তু HTTPS এর Wildcard সার্টিফিকেট ঠিক এক স্তরই ঢাকে। তাই এই নামে সাইটে পৌঁছানো যায়, অথচ Browser সার্টিফিকেটের সতর্কবার্তা দেখায়। DNS আর সার্টিফিকেটের Wildcard এক নিয়মে চলে না।",
  },
];

const VERDICT: Record<Probe["verdict"], { text: string; cls: string }> = {
  wild: { text: "Wildcard উত্তর দিল", cls: "border-primary bg-primary/10 text-primary" },
  exact: { text: "নিজের Record উত্তর দিল", cls: "border-accent/60 text-accent" },
  none: { text: "উত্তর নেই", cls: "border-destructive bg-destructive/10 text-destructive" },
  cert: { text: "DNS ঠিক, সার্টিফিকেট নয়", cls: "border-destructive bg-destructive/10 text-destructive" },
};

export function WildcardMatchLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const p = PROBES[i];
  const v = VERDICT[p.verdict];

  return (
    <Panel
      label="Interactive"
      title="Wildcard কাকে ধরে, কাকে ধরে না"
      footer="উপরে একটা Zone, যার শেষ সারিটা একটা Wildcard। নিচের ছয়টা নাম একটা একটা করে বেছে দেখুন, কোন সারিটা উত্তর দেয় আর কেন। চারটা নিয়ম বেরিয়ে আসবে। নির্দিষ্ট Record সবসময় আগে। মূল নাম Wildcard এর বাইরে। যে নাম অন্য কোনো Record নিয়ে আগে থেকেই আছে, সেখানে Wildcard কাজ করে না। আর DNS এর Wildcard যত গভীরেই ধরুক, সার্টিফিকেটের Wildcard ধরে শুধু এক স্তর।"
    >
      <div className="border border-border mb-5 overflow-x-auto">
        <div className="min-w-[420px]">
          <div className="grid grid-cols-[80px_80px_1fr] gap-2 px-3 py-2 border-b border-border bg-muted/30 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>Name</span>
            <span>Type</span>
            <span>Value</span>
          </div>
          {ZONE.map((z, idx) => (
            <div
              key={`${z.name}-${z.type}`}
              data-zone-row={idx}
              data-hit={p.row === idx ? "true" : "false"}
              className={cn(
                "grid grid-cols-[80px_80px_1fr] gap-2 px-3 py-2 border-b border-border/60 last:border-b-0 font-mono text-[11px] transition-colors",
                p.row === idx && p.verdict !== "none" && "bg-primary/10",
                p.row === idx && p.verdict === "none" && "bg-destructive/10",
              )}
            >
              <span className="font-bold text-foreground">{z.name}</span>
              <span className="font-bold text-primary">{z.type}</span>
              <span className="text-muted-foreground break-all">{z.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
        {PROBES.map((pr, idx) => (
          <button
            key={pr.host}
            onClick={() => setI(idx)}
            data-probe={idx}
            data-active={idx === i ? "true" : "false"}
            className={cn(
              "px-3 py-2 border text-left font-mono text-[11px] font-bold transition-colors break-all",
              idx === i
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {pr.host}
          </button>
        ))}
      </div>

      <motion.div
        key={i}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="border border-border bg-background p-5"
        data-verdict={p.verdict}
      >
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className={cn("px-2 py-1 border text-[11px] font-bold", v.cls)}>{v.text}</span>
          <span className="font-mono text-[12px] font-bold text-foreground">{p.answer}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{p.why}</p>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. গ্রাহককে কোন Record দেখাবেন, আর প্রতিটা মান কোথা থেকে এলো               */
/* ------------------------------------------------------------------------- */

type Row = { type: string; name: string; value: string; from: string };

type Kind = {
  id: string;
  label: string;
  input: string;
  note: string;
  rows: Row[];
};

const KINDS: Kind[] = [
  {
    id: "sub",
    label: "গ্রাহক একটা উপনাম দিলেন",
    input: "booking.seagulltours.example",
    note: "সবচেয়ে সহজ আর সবচেয়ে নিরাপদ ক্ষেত্র। উপনামে CNAME চলে, তাই আপনি নিজের স্থায়ী নামটাই দিতে পারেন।",
    rows: [
      {
        type: "CNAME",
        name: "booking",
        value: "customers.islandtours.example",
        from: "এটা আপনার CNAME Target। আপনি একবার ঠিক করে নিজের DNS এ বসিয়েছেন। সব গ্রাহকের জন্য একই, তাই কোডে এটা একটা স্থির মান, যা আসে Configuration থেকে।",
      },
      {
        type: "TXT",
        name: "_islandtours-verify.booking",
        value: "it-verify=9f2c1e7a40b84d63",
        from: "এটা আপনার Backend এইমাত্র এলোমেলোভাবে বানাল, আর Database এ এই Domain এর সারিতে রেখে দিল। প্রতিটা Domain এর জন্য আলাদা।",
      },
    ],
  },
  {
    id: "apex",
    label: "গ্রাহক মূল নাম দিলেন",
    input: "seagulltours.example",
    note: "মূল নামে CNAME বসে না। তাই এখানে আপনাকে একটা IP দিতে হবে, যে IP আপনি আর কখনো সহজে বদলাতে পারবেন না। সাথে www এর জন্য একটা CNAME দিন, যাতে দুই নামই কাজ করে।",
    rows: [
      {
        type: "A",
        name: "@",
        value: "103.94.135.2",
        from: "এটা আপনার সার্ভার বা Load Balancer এর স্থায়ী Public IP। এটাও Configuration থেকে আসে। দেওয়ার আগে নিশ্চিত হোন IP টা স্থায়ী (Static বা Reserved), নাহলে সার্ভার নতুন করে চালু করলে সব গ্রাহকের সাইট বন্ধ হবে।",
      },
      {
        type: "CNAME",
        name: "www",
        value: "customers.islandtours.example",
        from: "সেই একই CNAME Target। মূল নাম আর www দুইটাকেই আপনার App এ আলাদা করে নিবন্ধন করতে হবে।",
      },
      {
        type: "TXT",
        name: "_islandtours-verify",
        value: "it-verify=5b7d03c9e1aa4f20",
        from: "আপনার Backend এর বানানো, এই Domain এর জন্য আলাদা একটা সংকেত।",
      },
    ],
  },
  {
    id: "platform",
    label: "আপনার App একটা Hosting Platform এ চলে",
    input: "booking.seagulltours.example",
    note: "আপনি নিজে সার্ভার চালান না, App বসানো Vercel এর মতো Platform এ। তখন Record এর মান আপনি বানান না, Platform এর API থেকে নেন, আর হুবহু গ্রাহককে দেখান।",
    rows: [
      {
        type: "CNAME",
        name: "booking",
        value: "cname.vercel-dns.com",
        from: "আপনার Backend Platform এর API কে বলল এই Domain টা আমার Project এ যোগ করুন। তারপর Domain এর Configuration জানার API ডাকল, আর সেখান থেকে প্রস্তাবিত CNAME টা পেল। আপনি এটা কোডে লিখে রাখেন না, প্রতিবার API থেকে পড়েন।",
      },
      {
        type: "TXT",
        name: "_vercel",
        value: "vc-domain-verify=booking.seagulltours.example,ab12...",
        from: "এটা শুধু তখনই আসে যখন Domain টা Platform এর অন্য কোনো Account এ আগে থেকে যুক্ত। Platform এর API উত্তরে একটা যাচাইয়ের তালিকা দেয়, আপনি সেখান থেকে নিয়ে দেখান।",
      },
    ],
  },
];

export function RecordsForUserLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState<string>(KINDS[0].id);
  const [open, setOpen] = useState<number>(0);
  const k = KINDS.find((x) => x.id === id) ?? KINDS[0];
  const row = k.rows[Math.min(open, k.rows.length - 1)];

  return (
    <Panel
      label="Interactive"
      title="আপনার App গ্রাহককে যে পাতাটা দেখায়"
      footer="এটা আপনার নিজের App এর সেই Domain জোড়ার পাতা, যেটা আগের লেসনে আপনি অন্যদের সেবায় দেখেছেন। এবার আপনি পাতার ওপাশে। উপরে তিনটা অবস্থা বেছে দেখুন গ্রাহককে কোন ছকটা দেখাতে হবে। তারপর ছকের প্রতিটা সারিতে চাপ দিয়ে দেখুন, সেই মানটা আপনার কোড পেল কোথা থেকে। মাত্র তিনটা উৎস আছে, আপনার Configuration এর একটা স্থির মান, আপনার Backend এর বানানো একটা এলোমেলো সংকেত, অথবা আপনার Hosting Platform এর API র উত্তর।"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-5">
        {KINDS.map((x) => (
          <button
            key={x.id}
            onClick={() => {
              setId(x.id);
              setOpen(0);
            }}
            data-kind={x.id}
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
        key={k.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-shown={k.id}
      >
        <div className="border border-border bg-background p-4 mb-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            গ্রাহক Add Domain ঘরে লিখলেন
          </div>
          <div className="font-mono text-sm font-bold text-foreground break-all">{k.input}</div>
          <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">{k.note}</p>
        </div>

        <div className="border border-border mb-4 overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="px-3 pt-3 pb-2 text-[12px] font-bold text-foreground">
              আপনার DNS সেবায় এই Record গুলো বসান
            </div>
            <div className="grid grid-cols-[70px_190px_1fr] gap-2 px-3 py-2 border-y border-border bg-muted/30 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              <span>Type</span>
              <span>Name</span>
              <span>Value</span>
            </div>
            {k.rows.map((r, idx) => (
              <button
                key={`${r.type}-${r.name}`}
                onClick={() => setOpen(idx)}
                data-row={idx}
                data-open={idx === open ? "true" : "false"}
                className={cn(
                  "grid grid-cols-[70px_190px_1fr] gap-2 w-full px-3 py-2 border-b border-border/60 last:border-b-0 text-left font-mono text-[11px] transition-colors",
                  idx === open ? "bg-primary/10" : "hover:bg-muted/30",
                )}
              >
                <span className="font-bold text-primary">{r.type}</span>
                <span className="text-foreground break-all">{r.name}</span>
                <span className="text-muted-foreground break-all">{r.value}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border border-primary/40 bg-primary/5 p-4" data-source-row={open}>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            এই মানটা আপনার কোড পেল কোথা থেকে
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{row.from}</p>
        </div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. একটা Custom Domain এর জীবনচক্র                                           */
/* ------------------------------------------------------------------------- */

type Stage = {
  status: string;
  title: string;
  user: string;
  backend: string;
};

const STAGES: Stage[] = [
  {
    status: "নেই",
    title: "গ্রাহক Domain লেখেন",
    user: "Settings এ Custom Domain ঘরে booking.seagulltours.example লিখে Add চাপেন।",
    backend: "নামটা পরিষ্কার করে (ছোট হাতের অক্ষর, https আর স্ল্যাশ বাদ), দেখে নামটা বৈধ কি না আর নিজের Domain এর নিচে নয় তো। তারপর দেখে Database এ এই নাম আগে থেকে অন্য কারো নামে আছে কি না।",
  },
  {
    status: "pending_verification",
    title: "সারি তৈরি, সংকেত তৈরি",
    user: "একটা ছক দেখেন, দুইটা Record সহ, প্রতিটার পাশে Copy বোতাম, আর উপরে লেখা যাচাইয়ের অপেক্ষায়।",
    backend: "একটা এলোমেলো সংকেত বানায়, আর Database এ একটা সারি বসায়: নাম, গ্রাহকের পরিচয়, সংকেত, অবস্থা pending_verification। তারপর CNAME Target আর সংকেত দিয়ে ছকটা সাজিয়ে পাঠায়।",
  },
  {
    status: "pending_verification",
    title: "গ্রাহক নিজের DNS এ বসান",
    user: "নিজের DNS সেবায় ঢুকে CNAME আর TXT বসান, তারপর আপনার পাতায় ফিরে Verify চাপেন।",
    backend: "এই ধাপে কিছুই করে না। গ্রাহকের DNS এ তার কোনো হাত নেই, সে শুধু অপেক্ষা করে।",
  },
  {
    status: "verified",
    title: "মালিকানা যাচাই",
    user: "TXT সারিটার পাশে সবুজ টিক দেখেন।",
    backend: "একটা DNS প্রশ্ন করে, _islandtours-verify.booking.seagulltours.example এর TXT কী। উত্তরে নিজের Database এর সংকেতটা পেলে অবস্থা verified করে। না পেলে কিছু বদলায় না, আর গ্রাহককে বলে কী পাওয়া গেছে।",
  },
  {
    status: "pending_certificate",
    title: "পথ যাচাই",
    user: "CNAME সারিটার পাশেও সবুজ টিক দেখেন, আর লেখা দেখেন সার্টিফিকেট তৈরি হচ্ছে।",
    backend: "আরেকটা DNS প্রশ্ন করে, booking.seagulltours.example কোথায় যায়। CNAME এর শেষে নিজের Target, বা A তে নিজের IP পেলে বোঝে Traffic এখন তার কাছে আসবে। অবস্থা pending_certificate করে।",
  },
  {
    status: "active",
    title: "সার্টিফিকেট, তারপর চালু",
    user: "অবস্থা দেখেন Active, আর নিজের Domain এ https দিয়ে সাইট খোলে।",
    backend: "এই নামের জন্য একটা সার্টিফিকেট নেয় (নিজে, অথবা Platform নেয়)। সার্টিফিকেট সংস্থা নিজে এই নামে একটা Request পাঠিয়ে দেখে সেটা এই সার্ভারে পৌঁছায় কি না। সফল হলে অবস্থা active, আর এই নামটা গ্রাহক খোঁজার তালিকায় ওঠে।",
  },
  {
    status: "misconfigured",
    title: "নজরদারি চলতে থাকে",
    user: "মাস ছয়েক পরে DNS সেবা বদলাতে গিয়ে CNAME টা হারিয়ে ফেললে একটা ইমেইল পান, আপনার Domain আর আমাদের দিকে দেখাচ্ছে না।",
    backend: "একটা নিয়মিত কাজ প্রতিদিন সব active Domain আবার পরীক্ষা করে। CNAME সরে গেলে অবস্থা misconfigured করে আর গ্রাহককে জানায়। অনেক দিন ঠিক না হলে, বা গ্রাহক Account মুছলে, সারি আর সার্টিফিকেট দুইটাই মুছে দেয়।",
  },
];

export function CustomDomainFlowLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const s = STAGES[i];
  const last = i === STAGES.length - 1;

  return (
    <Panel
      label="Interactive"
      title="একটা Custom Domain এর জীবনচক্র"
      footer="একটা Domain যোগ করা থেকে চালু হওয়া পর্যন্ত সাতটা ধাপ, আর প্রতিটা ধাপে দুই দিকের ছবি, গ্রাহক কী দেখেন আর আপনার Backend কী করে। পরের ধাপ চেপে এগোন। মাঝের অবস্থার নামগুলো খেয়াল করুন, এগুলোই আপনার Database এর status ঘরের মান। এই জীবনচক্রটা যেকোনো সেবায় একই, শুধু অবস্থার নাম একটু আলাদা হয়।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setI((n) => Math.max(0, n - 1))}
          disabled={i === 0}
          data-action="prev"
          className={cn(
            "px-3 py-1.5 border text-[11px] font-bold transition-colors",
            i === 0
              ? "border-border text-muted-foreground/40"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
          )}
        >
          আগের ধাপ
        </button>
        <button
          onClick={() => setI((n) => Math.min(STAGES.length - 1, n + 1))}
          disabled={last}
          data-action="next"
          className={cn(
            "px-3 py-1.5 border text-[11px] font-bold transition-colors",
            last
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          পরের ধাপ
        </button>
        <button
          onClick={() => setI(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[10px] text-muted-foreground" data-stage={i}>
          ধাপ {toBn(i + 1)} / {toBn(STAGES.length)}
        </span>
      </div>

      <div className="flex gap-1 mb-5">
        {STAGES.map((st, idx) => (
          <div
            key={st.title}
            className={cn(
              "h-1.5 flex-1 border border-border",
              idx <= i ? "bg-primary border-primary" : "bg-background",
            )}
          />
        ))}
      </div>

      <motion.div
        key={i}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-base font-bold text-foreground">{s.title}</span>
          <span
            className="px-2 py-1 border border-primary bg-primary/10 font-mono text-[10px] font-bold text-primary"
            data-status={s.status}
          >
            status: {s.status}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-border bg-background p-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              গ্রাহক যা করেন বা দেখেন
            </div>
            <p className="text-sm text-foreground leading-relaxed">{s.user}</p>
          </div>
          <div className="border border-primary/40 bg-primary/5 p-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              আপনার Backend যা করে
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.backend}</p>
          </div>
        </div>
      </motion.div>
    </Panel>
  );
}
