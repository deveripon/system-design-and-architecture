"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";
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
        <span className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary">
          {label}
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
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

const LAYERS = ["Application", "Transport", "Internet", "Link"] as const;

/* ------------------------------------------------------------------------- */
/* 1. একটা বুকিং, Stack বেয়ে নিচে আর উপরে                                      */
/* ------------------------------------------------------------------------- */

type Chip = "frame" | "ip" | "tcp" | "data";

const CHIP_LABEL: Record<Chip, string> = {
  frame: "Frame Header",
  ip: "IP Header",
  tcp: "TCP Header",
  data: "Data",
};

type WalkStep = {
  side: "phone" | "path" | "server";
  layer: number; // LAYERS এর index, path এর জন্য 2
  title: string;
  did: string;
  wrote: string;
  chips: Chip[];
  fresh?: Chip;
};

const WALK: WalkStep[] = [
  {
    side: "phone",
    layer: 0,
    title: "ফোন, Application Layer",
    did: "Browser বুকিং এর কথাটা HTTP এর ভাষায় লিখল, তারপর TLS দিয়ে তালা মারল। এই Layer শুধু জানে কী বলতে হবে, কীভাবে পৌঁছাবে তা জানে না।",
    wrote: "POST /bookings, নৌকা ৭, আসন ৪",
    chips: ["data"],
    fresh: "data",
  },
  {
    side: "phone",
    layer: 1,
    title: "ফোন, Transport Layer",
    did: "Browser লেখাটা Socket এ দিল। Kernel এর TCP সামনে নিজের Header বসাল, যাতে লেখা কোন Program থেকে কোন Program এ যাচ্ছে, আর এটা কত নম্বর টুকরো।",
    wrote: "Source Port 51514, Destination Port 443",
    chips: ["tcp", "data"],
    fresh: "tcp",
  },
  {
    side: "phone",
    layer: 2,
    title: "ফোন, Internet Layer",
    did: "Kernel এর IP তার সামনে আরেকটা Header বসাল, যাতে লেখা কোন যন্ত্র থেকে কোন যন্ত্রে। তারপর Routing table দেখে ঠিক করল, এই ঠিকানা বাইরের, তাই Gateway তে পাঠাতে হবে।",
    wrote: "192.168.1.20 থেকে 103.94.135.2, Protocol 6",
    chips: ["ip", "tcp", "data"],
    fresh: "ip",
  },
  {
    side: "phone",
    layer: 3,
    title: "ফোন, Link Layer",
    did: "Wi-Fi card সবার সামনে Frame Header বসাল। খেয়াল করুন, গন্তব্য MAC টা Server এর নয়, বাসার Router এর। Link Layer শুধু পাশের যন্ত্র পর্যন্ত চেনে।",
    wrote: "a4:83:e7:12:9c:01 থেকে c8:3a:35:4b:10:fe",
    chips: ["frame", "ip", "tcp", "data"],
    fresh: "frame",
  },
  {
    side: "path",
    layer: 2,
    title: "পথের Router গুলো, শুধু নিচের দুই Layer",
    did: "প্রতিটা Router পুরনো Frame খুলে ফেলে দেয়, IP Header এর গন্তব্য পড়ে, তারপর পরের Router এর MAC দিয়ে একদম নতুন Frame বানায়। বাসার Router আরেকটা কাজ করে, NAT, তাই Source ঠিকানা বদলে হয় 203.0.113.25। TCP Header আর Data কেউ খোলে না।",
    wrote: "প্রতি মোড়ে নতুন Frame, ভেতরের সব একই",
    chips: ["frame", "ip", "tcp", "data"],
    fresh: "frame",
  },
  {
    side: "server",
    layer: 3,
    title: "Server, Link Layer",
    did: "Server এর Network card দেখল Frame এর গন্তব্য MAC তার নিজের। সে Frame Header খুলে ফেলে দিল। EtherType এ 0x0800 লেখা, তাই ভেতরেরটা Internet Layer কে দিল।",
    wrote: "Frame Header খোলা হলো",
    chips: ["ip", "tcp", "data"],
  },
  {
    side: "server",
    layer: 2,
    title: "Server, Internet Layer",
    did: "Kernel এর IP দেখল গন্তব্য 103.94.135.2, মানে আমিই। সে IP Header খুলে ফেলল। Protocol ঘরে 6 লেখা, তাই ভেতরেরটা TCP কে দিল।",
    wrote: "IP Header খোলা হলো",
    chips: ["tcp", "data"],
  },
  {
    side: "server",
    layer: 1,
    title: "Server, Transport Layer",
    did: "TCP টুকরোর নম্বর মিলিয়ে দেখল কিছু হারায়নি, ক্রম ঠিক আছে, আর ফোনকে প্রাপ্তি স্বীকার পাঠাল। Destination Port 443, তাই 443 এ যে Program শুনছে তার Socket এ Data রাখল।",
    wrote: "TCP Header খোলা হলো, ACK ফেরত গেল",
    chips: ["data"],
  },
  {
    side: "server",
    layer: 0,
    title: "Server, Application Layer",
    did: "Server এর Program Socket থেকে Data পড়ল, TLS এর তালা খুলল, আর দেখল ঠিক সেই লেখাটা যা Browser লিখেছিল। মাঝের কোনো Layer এর কথা সে জানেই না।",
    wrote: "POST /bookings, নৌকা ৭, আসন ৪",
    chips: ["data"],
  },
];

const ALL_CHIPS: Chip[] = ["frame", "ip", "tcp", "data"];

function StackColumn({
  name,
  sub,
  active,
  rows,
}: {
  name: string;
  sub: string;
  active: number | null;
  rows: number[];
}) {
  return (
    <div>
      <div className="text-[0.75rem] font-bold text-foreground">{name}</div>
      <div className="font-mono text-[0.625rem] text-muted-foreground mb-2">{sub}</div>
      <div className="space-y-1.5">
        {LAYERS.map((l, i) => {
          const present = rows.includes(i);
          const on = present && active === i;
          return (
            <div
              key={l}
              className={cn(
                "border px-2 py-2 text-center font-mono text-[0.625rem] font-bold transition-colors",
                !present && "border-dashed border-border/50 text-muted-foreground/30",
                present && !on && "border-border text-muted-foreground",
                on && "border-primary bg-primary/10 text-primary",
              )}
            >
              {present ? l : "নেই"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StackWalkLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const s = WALK[i];
  const last = i === WALK.length - 1;

  return (
    <Panel
      label="Interactive"
      title="একটা বুকিং, চার Layer নিচে, চার Layer উপরে"
      footer="পরের ধাপ চেপে চেপে পুরো যাত্রাটা দেখুন। নিচের সারিতে চারটা ঘর আছে, যেটা এই মুহূর্তে মোড়কে আছে সেটা রঙিন। ফোনের দিকে নামার সময় প্রতি Layer এ সামনে একটা করে Header যোগ হয়, আর Server এর দিকে ওঠার সময় একটা করে খুলে যায়। শেষ ধাপে গিয়ে প্রথম ধাপের সাথে মিলিয়ে দেখুন, Data টা হুবহু একই। মাঝখানে যা কিছু যোগ হয়েছিল সবই ছিল পৌঁছে দেওয়ার জন্য, বার্তার অংশ নয়।"
    >
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StackColumn
          name="পর্যটকের ফোন"
          sub="192.168.1.20"
          active={s.side === "phone" ? s.layer : null}
          rows={[0, 1, 2, 3]}
        />
        <StackColumn
          name="পথের Router"
          sub="বাসার, ISP এর"
          active={s.side === "path" ? s.layer : null}
          rows={[2, 3]}
        />
        <StackColumn
          name="Island Tours Server"
          sub="103.94.135.2"
          active={s.side === "server" ? s.layer : null}
          rows={[0, 1, 2, 3]}
        />
      </div>

      <div className="mb-2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
        এই মুহূর্তে মোড়কে যা আছে
      </div>
      <div className="grid grid-cols-4 gap-1.5 mb-6">
        {ALL_CHIPS.map((c) => {
          const present = s.chips.includes(c);
          const fresh = s.fresh === c;
          return (
            <div
              key={c}
              data-chip={c}
              data-present={present}
              className={cn(
                "border px-1 py-2 text-center font-mono text-[0.625rem] font-bold transition-colors",
                !present && "border-dashed border-border/50 text-muted-foreground/30",
                present && !fresh && "border-border bg-muted/30 text-foreground",
                present && fresh && "border-primary bg-primary/10 text-primary",
              )}
            >
              {CHIP_LABEL[c]}
            </div>
          );
        })}
      </div>

      <motion.div
        key={i}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="border border-border bg-background p-4 mb-5"
        data-step={i}
      >
        <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-primary mb-1">
          ধাপ {toBn(i + 1)} / {toBn(WALK.length)}
        </div>
        <div className="text-sm font-bold text-foreground mb-2">{s.title}</div>
        <p className="text-sm leading-relaxed text-muted-foreground mb-3">{s.did}</p>
        <div className="font-mono text-[0.6875rem] text-foreground break-words">{s.wrote}</div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            i === 0
              ? "border-border text-muted-foreground/40"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
          )}
        >
          <ChevronLeft className="w-3 h-3" />
          আগের ধাপ
        </button>
        <button
          onClick={() => setI((v) => Math.min(WALK.length - 1, v + 1))}
          disabled={last}
          data-action="next"
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            last
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          পরের ধাপ
          <ChevronRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => setI(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. এটা কোন Layer এর জিনিস                                                  */
/* ------------------------------------------------------------------------- */

const ITEMS: { thing: string; layer: number; why: string }[] = [
  {
    thing: "Destination Port 443",
    layer: 1,
    why: "Port হলো যন্ত্রের ভেতরে কোন Program, আর সেটা লেখা থাকে TCP বা UDP Header এ। তাই Transport Layer।",
  },
  {
    thing: "MAC Address c8:3a:35:4b:10:fe",
    layer: 3,
    why: "MAC Address শুধু পাশের যন্ত্র পর্যন্ত কাজে লাগে আর Frame এর Header এ থাকে। তাই Link Layer।",
  },
  {
    thing: "HTTP এর 404 Not Found",
    layer: 0,
    why: "404 মানে Server এ পৌঁছানো গেছে, Connection হয়েছে, Server উত্তরও দিয়েছে। শুধু যা চাওয়া হয়েছে সেটা নেই। এটা কথার অর্থ, তাই Application Layer।",
  },
  {
    thing: "IP Address 103.94.135.2",
    layer: 2,
    why: "IP Address বলে পৃথিবীর কোন যন্ত্র, আর Router এটা দেখেই পথ ঠিক করে। তাই Internet Layer।",
  },
  {
    thing: "DNS দিয়ে নাম থেকে IP বের করা",
    layer: 0,
    why: "DNS নিজে একটা Program এর কাজ, যা UDP এর উপর দিয়ে প্রশ্ন পাঠায়। সে Transport এর সেবা ব্যবহার করে, তাই নিজে Application Layer এ।",
  },
  {
    thing: "Wi-Fi এর Signal দুর্বল",
    layer: 3,
    why: "Wi-Fi হলো পাশের যন্ত্র পর্যন্ত পৌঁছানোর একটা মাধ্যম। মাধ্যম আর তার সব সমস্যা Link Layer এর।",
  },
  {
    thing: "Connection refused",
    layer: 1,
    why: "যন্ত্রটা পাওয়া গেছে, কিন্তু সেই Port এ কোনো Program শুনছে না। Port এর ব্যাপার, তাই Transport Layer।",
  },
  {
    thing: "ping এর উত্তর আসছে না",
    layer: 2,
    why: "ping ICMP ব্যবহার করে, যা IP এর সঙ্গী আর কোনো Port ই ব্যবহার করে না। সে শুধু জিজ্ঞেস করে এই IP তে পৌঁছানো যায় কি না। তাই Internet Layer।",
  },
  {
    thing: "TLS Certificate এর মেয়াদ শেষ",
    layer: 0,
    why: "TCP/IP Model এ TLS এর কাজটা Program নিজে করে, একটা Library দিয়ে, Kernel নয়। তাই এটা Application Layer এর সমস্যা।",
  },
  {
    thing: "হারিয়ে যাওয়া টুকরো আবার পাঠানো",
    layer: 1,
    why: "এই কাজটা TCP এর, আর TCP থাকে Transport Layer এ। পথের Router কিছু আবার পাঠায় না, শুধু দুই প্রান্ত পাঠায়।",
  },
];

export function WhichLayerLab() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const item = ITEMS[idx];
  const answered = picked !== null;
  const right = picked === item.layer;
  const lastItem = idx === ITEMS.length - 1;

  function pick(l: number) {
    if (answered) return;
    setPicked(l);
    if (l === item.layer) setScore((v) => v + 1);
  }

  return (
    <Panel
      label="Interactive"
      title="এটা কোন Layer এর জিনিস"
      footer="দশটা জিনিস একটা একটা করে আসবে। প্রতিটার জন্য চার Layer এর একটা বেছে নিন। মুখস্থ করার দরকার নেই, নিজেকে শুধু একটা প্রশ্ন করুন, এই জিনিসটা কোন প্রশ্নের উত্তর দিচ্ছে। পাশের যন্ত্র পর্যন্ত কীভাবে যাব, তাহলে Link। পৃথিবীর কোন যন্ত্র, তাহলে Internet। সেই যন্ত্রের কোন Program আর কতটা যত্নে, তাহলে Transport। কথাটার অর্থ কী, তাহলে Application।"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <span className="font-mono text-[0.625rem] text-muted-foreground">
          প্রশ্ন {toBn(idx + 1)} / {toBn(ITEMS.length)}
        </span>
        <span className="font-mono text-[0.625rem] text-muted-foreground" data-score={score}>
          ঠিক হয়েছে {toBn(score)}টা
        </span>
      </div>

      <div className="border border-border bg-background px-4 py-5 mb-4 text-center">
        <div className="text-base font-bold text-foreground">{item.thing}</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {LAYERS.map((l, i) => {
          const isRight = answered && i === item.layer;
          const isWrong = answered && i === picked && !right;
          return (
            <button
              key={l}
              onClick={() => pick(i)}
              data-layer={l}
              className={cn(
                "inline-flex items-center justify-center gap-1 px-3 py-2 border text-[0.6875rem] font-bold transition-colors",
                !answered && "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
                answered && !isRight && !isWrong && "border-border text-muted-foreground/40",
                isRight && "border-primary bg-primary/10 text-primary",
                isWrong && "border-destructive bg-destructive/10 text-destructive",
              )}
            >
              {isRight && <Check className="w-3 h-3" />}
              {isWrong && <X className="w-3 h-3" />}
              {l}
            </button>
          );
        })}
      </div>

      {answered && (
        <motion.div
          key={idx}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="mb-4"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className={right ? "text-primary" : "text-destructive"}>
              {right ? "ঠিক ধরেছেন। " : `এটা আসলে ${LAYERS[item.layer]} Layer। `}
            </strong>
            {item.why}
          </p>
        </motion.div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setIdx((v) => v + 1);
            setPicked(null);
          }}
          disabled={!answered || lastItem}
          data-action="next"
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            !answered || lastItem
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          পরের প্রশ্ন
          <ChevronRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => {
            setIdx(0);
            setPicked(null);
            setScore(0);
          }}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        {answered && lastItem && (
          <span className="text-[0.75rem] text-muted-foreground">
            শেষ। দশটার মধ্যে {toBn(score)}টা ঠিক। আটের কম হলে আরেকবার খেলুন।
          </span>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. কোথায় ভাঙল, নিচ থেকে উপরে পরীক্ষা                                       */
/* ------------------------------------------------------------------------- */

type Result = "ok" | "fail" | "skip";

type Fault = {
  id: string;
  label: string;
  broken: number; // LAYERS এর index
  results: [Result, Result, Result, Result]; // Link, Internet, Transport, Application ক্রমে
  says: string;
  story: string;
};

const CHECKS = [
  { layer: 3, cmd: "ifconfig en0", asks: "Network card চালু, IP পেয়েছে?" },
  { layer: 2, cmd: "ping -c 2 103.94.135.2", asks: "Server এর IP তে পৌঁছানো যায়?" },
  { layer: 1, cmd: "nc -vz 103.94.135.2 443", asks: "Port 443 এ Connection হয়?" },
  { layer: 0, cmd: "curl -I https://islandtours.example", asks: "ঠিকঠাক উত্তর আসে?" },
];

const FAULTS: Fault[] = [
  {
    id: "wifi",
    label: "Wi-Fi বন্ধ",
    broken: 3,
    results: ["fail", "skip", "skip", "skip"],
    says: "status: inactive",
    story:
      "সবার নিচের Layer ই নেই। পাশের যন্ত্র পর্যন্তই যাওয়া যাচ্ছে না, তাই উপরের তিনটা পরীক্ষা করার কোনো মানে নেই, সবই ব্যর্থ হবে। এখানে Server বা Code দেখে সময় নষ্ট করবেন না।",
  },
  {
    id: "route",
    label: "ISP এর লাইন কাটা",
    broken: 2,
    results: ["ok", "fail", "skip", "skip"],
    says: "Request timeout for icmp_seq 0",
    story:
      "Wi-Fi ঠিক আছে, Router পর্যন্ত যাওয়া যাচ্ছে, কিন্তু তার বাইরে Packet যাচ্ছে না। সমস্যা Internet Layer এ, মানে পথে। এখানে traceroute চালালে দেখা যাবে কোন মোড় পর্যন্ত গিয়ে থামছে।",
  },
  {
    id: "refused",
    label: "Server এ App চালু নেই",
    broken: 1,
    results: ["ok", "ok", "fail", "skip"],
    says: "Connection refused",
    story:
      "ping এর উত্তর আসছে, মানে যন্ত্রটা জীবিত আর পথও ঠিক। কিন্তু 443 এ কেউ শুনছে না, তাই Server এর Kernel সাথে সাথে না বলে দিয়েছে। সমস্যা Transport Layer এ। Server এ ঢুকে দেখুন Program টা চলছে কি না।",
  },
  {
    id: "firewall",
    label: "Firewall এ Port 443 বন্ধ",
    broken: 1,
    results: ["ok", "ok", "fail", "skip"],
    says: "Operation timed out",
    story:
      "এটাও Transport Layer, কিন্তু চেহারা আলাদা। না বলা হয়নি, কোনো উত্তরই আসেনি, কারণ Firewall Packet টা চুপচাপ ফেলে দিয়েছে। refused মানে দরজায় কেউ নেই, timed out মানে দরজা পর্যন্ত পৌঁছাতেই দেওয়া হয়নি। Hosting এর Firewall বা Security Group দেখুন।",
  },
  {
    id: "app",
    label: "App এর Code এ Bug",
    broken: 0,
    results: ["ok", "ok", "ok", "fail"],
    says: "HTTP/2 500",
    story:
      "নিচের তিন Layer ই নিখুঁত। Connection হয়েছে, Server উত্তরও দিয়েছে, শুধু উত্তরটা একটা Error। এবার আর Network এর দোষ নয়, Application এর Log খুলুন।",
  },
  {
    id: "dns",
    label: "DNS Record ভুল",
    broken: 0,
    results: ["ok", "ok", "ok", "fail"],
    says: "Could not resolve host: islandtours.example",
    story:
      "IP দিয়ে করা তিনটা পরীক্ষাই পাস, কিন্তু নাম দিয়ে করা পরীক্ষাটা ব্যর্থ। এটাই চেনার উপায়। DNS নিজে একটা Application Layer এর সেবা, আর সমস্যাটা সেখানে। আগের Module এর যাচাইয়ের ধাপগুলো এখানে কাজে লাগবে।",
  },
];

export function LayerFaultLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState(FAULTS[0].id);
  const fault = FAULTS.find((f) => f.id === id) ?? FAULTS[0];

  return (
    <Panel
      label="Interactive"
      title="কোথায় ভাঙল, নিচ থেকে উপরে খুঁজুন"
      footer="উপরের ছয়টা সমস্যার একটা বেছে নিন, তারপর নিচের চারটা পরীক্ষা উপর থেকে নিচে পড়ুন, যা আসলে Layer এর হিসাবে নিচ থেকে উপরে। প্রথম যে পরীক্ষাটা ব্যর্থ হয়, সমস্যা সেই Layer এ, আর তার পরের পরীক্ষাগুলো করার দরকার পড়ে না। দুইটা জিনিস আলাদা করে খেয়াল করুন। App চালু নেই আর Firewall বন্ধ, দুইটাই একই Layer এ ভাঙে কিন্তু দুই রকম কথা বলে। আর DNS এর সমস্যায় IP দিয়ে করা সব পরীক্ষা পাস করে, শুধু নাম দিয়ে করাটা ব্যর্থ হয়।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {FAULTS.map((f) => (
          <button
            key={f.id}
            onClick={() => setId(f.id)}
            data-fault={f.id}
            className={cn(
              "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
              f.id === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2 mb-5">
        {CHECKS.map((c, i) => {
          const r = fault.results[i];
          return (
            <div
              key={c.cmd}
              data-check={LAYERS[c.layer]}
              data-result={r}
              className={cn(
                "grid grid-cols-1 sm:grid-cols-[110px_1fr_150px] gap-x-3 gap-y-1 items-center border px-3 py-2 transition-colors",
                r === "ok" && "border-primary/50 bg-primary/5",
                r === "fail" && "border-destructive/60 bg-destructive/5",
                r === "skip" && "border-dashed border-border bg-background",
              )}
            >
              <div className="font-mono text-[0.625rem] font-bold text-foreground">
                {toBn(i + 1)}. {LAYERS[c.layer]}
              </div>
              <div>
                <div className="font-mono text-[0.6875rem] text-foreground break-all">{c.cmd}</div>
                <div className="text-[0.625rem] text-muted-foreground">{c.asks}</div>
              </div>
              <div
                className={cn(
                  "font-mono text-[0.6875rem] font-bold",
                  r === "ok" && "text-primary",
                  r === "fail" && "text-destructive",
                  r === "skip" && "text-muted-foreground/50",
                )}
              >
                {r === "ok" && "পাস"}
                {r === "fail" && "ব্যর্থ"}
                {r === "skip" && "দরকার নেই"}
              </div>
            </div>
          );
        })}
      </div>

      <motion.div
        key={fault.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-broken={LAYERS[fault.broken]}
      >
        <div className="font-mono text-[0.6875rem] text-destructive mb-2 break-words">{fault.says}</div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">ভেঙেছে {LAYERS[fault.broken]} Layer এ। </strong>
          {fault.story}
        </p>
      </motion.div>
    </Panel>
  );
}
