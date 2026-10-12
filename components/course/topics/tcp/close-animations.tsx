"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
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

function Chip({
  active,
  onClick,
  children,
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
} & Record<`data-${string}`, string | number>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={cn(
        "px-3 py-1.5 border text-[11px] font-bold transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. বিদায়ের চার ধাপ, এক ধাপ করে                                             */
/* ------------------------------------------------------------------------- */

type Side = "phone" | "server";

/**
 * প্রতিটা ধাপে Active Closer আর Passive Closer এর State, আর মাঝখানে কোন Segment
 * কোন দিকে গেল। `from` হলো "active" বা "passive", কে পাঠাল।
 */
const CLOSE_FLOW: {
  active: string;
  passive: string;
  segment: string | null;
  from: "active" | "passive" | null;
  text: string;
}[] = [
  {
    active: "ESTABLISHED",
    passive: "ESTABLISHED",
    segment: null,
    from: null,
    text: "Connection খোলা, দুই দিকেই তথ্য যেতে পারে। এখনো কেউ বিদায় বলেনি।",
  },
  {
    active: "FIN_WAIT_1",
    passive: "CLOSE_WAIT",
    segment: "FIN",
    from: "active",
    text: "যে আগে বিদায় বলছে, তার Program close ডাকল। Kernel একটা FIN পাঠাল, যার মানে আমার আর কিছু পাঠানোর নেই। অন্য পাশের Kernel সেটা পেয়ে নিজের Program কে জানাল, ওপাশ থেকে আর কিছু আসবে না।",
  },
  {
    active: "FIN_WAIT_2",
    passive: "CLOSE_WAIT",
    segment: "ACK",
    from: "passive",
    text: "অন্য পাশের Kernel নিজে থেকেই ACK পাঠাল, Program কে জিজ্ঞেস না করেই। এখন একটা দিক বন্ধ। কিন্তু উল্টো দিক এখনো খোলা, আর এই অবস্থায় অন্য পাশ চাইলে আরও তথ্য পাঠাতে পারে। এটাই Half Close। সে CLOSE_WAIT এ থাকবে যতক্ষণ না তার Program নিজে close ডাকে।",
  },
  {
    active: "FIN_WAIT_2",
    passive: "LAST_ACK",
    segment: "FIN",
    from: "passive",
    text: "অন্য পাশের Program ও কাজ শেষ করে close ডাকল। তার Kernel এবার নিজের FIN পাঠাল আর শেষ ACK এর অপেক্ষায় LAST_ACK এ গেল।",
  },
  {
    active: "TIME_WAIT",
    passive: "CLOSED",
    segment: "ACK",
    from: "active",
    text: "প্রথমজন শেষ ACK পাঠাল। ACK পেয়েই অন্য পাশ Connection টা খাতা থেকে মুছে ফেলল, সে CLOSED। কিন্তু প্রথমজন মুছল না, সে TIME_WAIT এ দাঁড়িয়ে রইল। কারণ তার শেষ ACK টা পৌঁছাল কি না সে জানে না।",
  },
  {
    active: "CLOSED",
    passive: "CLOSED",
    segment: null,
    from: null,
    text: "2MSL সময় পার হলো, আর কোনো FIN ফিরে আসেনি। এবার প্রথমজনও Connection টা মুছে ফেলল। এখন চার সংখ্যার এই জোড়াটা আবার ব্যবহার করা যায়।",
  },
];

const SIDE_NAME: Record<Side, string> = {
  phone: "ফোন 192.168.1.20:51514",
  server: "Server 103.94.135.2:443",
};

export function CloseStepLab() {
  const reduce = useReducedMotion();
  const [closer, setCloser] = useState<Side>("phone");
  const [step, setStep] = useState(0);

  const cur = CLOSE_FLOW[step];
  const last = step === CLOSE_FLOW.length - 1;
  const phoneState = closer === "phone" ? cur.active : cur.passive;
  const serverState = closer === "server" ? cur.active : cur.passive;
  const sender: Side | null =
    cur.from === null
      ? null
      : cur.from === "active"
        ? closer
        : closer === "phone"
          ? "server"
          : "phone";

  return (
    <Panel
      label="Interactive"
      title="বিদায়ের চার ধাপ, নিজের গতিতে"
      footer="উপরে বেছে নিন কে আগে বিদায় বলছে, তারপর এক ধাপ করে এগোন। দুই পাশের State কীভাবে বদলায় খেয়াল করুন। তারপর যে আগে বিদায় বলে সেটা বদলে আবার চালান। দেখবেন State এর নামগুলো পাশ বদল করছে, আর TIME_WAIT সবসময় তার ঘাড়েই পড়ে যে আগে বিদায় বলেছিল। এই একটা পর্যবেক্ষণ পরের দুইটা সেকশনের চাবি।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          আগে বিদায় বলছে
        </span>
        <Chip
          active={closer === "phone"}
          onClick={() => {
            setCloser("phone");
            setStep(0);
          }}
          data-closer="phone"
        >
          ফোন
        </Chip>
        <Chip
          active={closer === "server"}
          onClick={() => {
            setCloser("server");
            setStep(0);
          }}
          data-closer="server"
        >
          Server
        </Chip>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setStep((s) => Math.min(CLOSE_FLOW.length - 1, s + 1))}
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
          onClick={() => setStep(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[10px] text-muted-foreground">
          ধাপ {toBn(step)} / {toBn(CLOSE_FLOW.length - 1)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_1fr] gap-3 items-stretch mb-5">
        {(["phone", "server"] as Side[]).map((side, idx) => {
          const state = side === "phone" ? phoneState : serverState;
          const isCloser = side === closer;
          return (
            <div
              key={side}
              data-side={side}
              data-state={state}
              className={cn(
                "border px-4 py-3 transition-colors",
                idx === 1 && "sm:order-3",
                state === "TIME_WAIT" || state === "CLOSE_WAIT"
                  ? "border-primary/60 bg-primary/5"
                  : "border-border bg-background",
              )}
            >
              <div className="text-[11px] font-bold text-foreground">{SIDE_NAME[side]}</div>
              <div className="text-[10px] text-muted-foreground mb-2">
                {isCloser ? "Active Closer" : "Passive Closer"}
              </div>
              <div
                className={cn(
                  "font-mono text-[15px] font-bold",
                  state === "CLOSED" ? "text-muted-foreground" : "text-primary",
                )}
              >
                {state}
              </div>
            </div>
          );
        })}
        <div className="sm:order-2 flex flex-col items-center justify-center border border-dashed border-border px-2 py-3 min-h-[72px]">
          {cur.segment && sender ? (
            <>
              <span className="font-mono text-[13px] font-bold text-primary" data-segment={cur.segment}>
                {cur.segment}
              </span>
              {sender === "phone" ? (
                <ArrowRight className="w-4 h-4 text-primary" />
              ) : (
                <ArrowLeft className="w-4 h-4 text-primary" />
              )}
            </>
          ) : (
            <span className="font-mono text-[10px] text-muted-foreground">
              {step === 0 ? "কথা চলছে" : "নীরব"}
            </span>
          )}
        </div>
      </div>

      <motion.p
        key={`${closer}-${step}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
        data-step={step}
      >
        {cur.text}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Idle Timeout, কে আগে ধৈর্য হারায়                                        */
/* ------------------------------------------------------------------------- */

const LB_OPTIONS = [30, 60, 120];
const APP_OPTIONS = [5, 65, 75, 125];

export function IdleTimeoutLab() {
  const reduce = useReducedMotion();
  const [lb, setLb] = useState(60);
  const [app, setApp] = useState(5);

  const safe = app > lb;
  const max = 130;
  const danger = safe ? 0 : lb - app;

  return (
    <Panel
      label="Interactive"
      title="Load Balancer আর App, দুইটা Timeout মিলিয়ে দেখুন"
      footer="Load Balancer আর App এর মাঝের Connection চুপচাপ পড়ে থাকলে দুই পক্ষই একটা সময় পর সেটা বন্ধ করে দেয়। দুইটা সংখ্যা বদলে দেখুন কে আগে বন্ধ করে। App আগে বন্ধ করলে একটা লাল সময় তৈরি হয়, যখন Load Balancer একটা মরা Connection কে জীবিত ভাবছে। সেই সময়ে আসা Request এর কপালে 502। App এর সংখ্যাটা Load Balancer এর চেয়ে বড় করলেই লাল অংশটা পুরো মিলিয়ে যায়। Node এর Default হলো ৫ সেকেন্ড, তাই Node App কে Load Balancer এর পেছনে বসালে এই সংখ্যাটা প্রায় সবসময় নিজে বাড়াতে হয়।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mr-1 w-full sm:w-44">
          Load Balancer এর Idle Timeout
        </span>
        {LB_OPTIONS.map((v) => (
          <Chip key={v} active={lb === v} onClick={() => setLb(v)} data-lb={v}>
            {toBn(v)} সেকেন্ড
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mr-1 w-full sm:w-44">
          App এর Keep-Alive Timeout
        </span>
        {APP_OPTIONS.map((v) => (
          <Chip key={v} active={app === v} onClick={() => setApp(v)} data-app={v}>
            {toBn(v)} সেকেন্ড
          </Chip>
        ))}
      </div>

      <div className="space-y-3 mb-5">
        {[
          { name: "Load Balancer", value: lb, primary: false },
          { name: "App", value: app, primary: true },
        ].map((row) => (
          <div key={row.name} className="grid grid-cols-[110px_1fr] items-center gap-3">
            <span className="text-[11px] font-bold text-foreground">{row.name}</span>
            <div className="relative h-5 border border-border bg-background">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 transition-all duration-300",
                  row.primary ? "bg-primary/30" : "bg-foreground/15",
                )}
                style={{ width: `${(row.value / max) * 100}%` }}
              />
              <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[10px] text-muted-foreground">
                {toBn(row.value)} সেকেন্ডে বন্ধ করে
              </span>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[110px_1fr] items-center gap-3">
          <span className="text-[11px] font-bold text-foreground">বিপদের সময়</span>
          <div className="relative h-5 border border-border bg-background">
            {!safe && (
              <div
                className="absolute inset-y-0 bg-destructive/25 border-x border-destructive/60 transition-all duration-300"
                style={{
                  left: `${(app / max) * 100}%`,
                  width: `${(danger / max) * 100}%`,
                }}
              />
            )}
            <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[10px] text-muted-foreground">
              {safe ? "নেই" : `${toBn(danger)} সেকেন্ড`}
            </span>
          </div>
        </div>
      </div>

      <motion.p
        key={`${lb}-${app}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={cn("text-sm leading-relaxed", safe ? "text-muted-foreground" : "text-foreground")}
        data-safe={safe ? "yes" : "no"}
        data-danger={danger}
      >
        {safe
          ? `App ${toBn(app)} সেকেন্ড পর্যন্ত ধৈর্য ধরে, Load Balancer ${toBn(lb)} সেকেন্ডেই Connection টা নিজে বন্ধ করে দেয়। যে নিজে বন্ধ করেছে সে জানে ওটা বন্ধ, তাই সে পরের Request এর জন্য নতুন Connection খোলে। এখানে কোনো Request হারায় না।`
          : `App ${toBn(app)} সেকেন্ডে Connection বন্ধ করে দেয়, কিন্তু Load Balancer ভাবে ওটা ${toBn(lb)} সেকেন্ড পর্যন্ত ভালো। মাঝের ${toBn(danger)} সেকেন্ডে, ঠিক App এর FIN পৌঁছানোর মুহূর্তটায় কোনো Request এলে সেটা মরা Connection এ যায় আর RST খেয়ে ফেরে। পর্যটক দেখেন 502। এই ভুল ধরা কঠিন, কারণ এটা দিনে হয়তো কয়েকবার ঘটে, আর আবার চেষ্টা করলেই ঠিক হয়ে যায়।`}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Error বার্তা থেকে উল্টো দিকে, তারে আসলে কী ঘটেছিল                         */
/* ------------------------------------------------------------------------- */

const SYMPTOMS = [
  {
    id: "econnreset",
    label: "ECONNRESET",
    seen: "read ECONNRESET, Connection reset by peer, অথবা Node এর socket hang up",
    wire: "অন্য পাশ থেকে একটা RST এসেছে। সে FIN দিয়ে ভদ্রভাবে বিদায় বলেনি, সোজা কেটে দিয়েছে।",
    who: "অন্য পাশ, অথবা মাঝখানের কেউ। Server টা Crash বা Restart করেছে, তার Idle Timeout পার হয়েছে, অথবা একটা Load Balancer বা Firewall Connection টা ভুলে গেছে।",
    fix: "কখন ঘটে খেয়াল করুন। Deploy এর সময় হলে Graceful Shutdown নেই। অনেকক্ষণ চুপ থাকার পরে হলে Idle Timeout। যেসব Request আবার পাঠালে ক্ষতি নেই, সেগুলোতে Retry দিন।",
  },
  {
    id: "epipe",
    label: "EPIPE",
    seen: "write EPIPE, অথবা Broken pipe",
    wire: "আপনার Program এমন একটা Connection এ লিখতে গেছে যেটা অন্য পাশ আগেই বন্ধ করে দিয়েছে আর Kernel সেটা জানে। সাধারণত তার আগের একটা Write এর উত্তরে RST এসেছিল।",
    who: "অন্য পাশ আগে বন্ধ করেছে, কিন্তু আপনার Program সেই খবর না দেখেই লিখে গেছে।",
    fix: "Socket এর end আর close ঘটনা শুনুন, আর তারপর আর লিখবেন না। Error টা ধরুন, নইলে একটা না ধরা Error পুরো Process ফেলে দেবে।",
  },
  {
    id: "addrinuse",
    label: "EADDRINUSE, Restart এর পর",
    seen: "listen EADDRINUSE, অথবা Address already in use",
    wire: "দুইটার একটা। হয় ওই Port এ আগের Process টা এখনো বেঁচে আছে, নয়তো আগের Process এর Connection গুলো এখনো TIME_WAIT এ, আর নতুন Process টা SO_REUSEADDR ছাড়া Bind করতে চাইছে।",
    who: "প্রথম ক্ষেত্রে পুরনো Process, দ্বিতীয় ক্ষেত্রে TIME_WAIT।",
    fix: "আগে দেখুন Port টা কেউ ধরে আছে কি না (lsof বা ss)। কেউ থাকলে তাকে থামান। কেউ না থাকলে এটা TIME_WAIT, তখন SO_REUSEADDR চালু করুন। Node আর বেশিরভাগ Framework এটা নিজে থেকেই করে।",
  },
  {
    id: "closewait",
    label: "অনেক CLOSE_WAIT",
    seen: "netstat বা ss এ শত শত CLOSE_WAIT, আর সংখ্যাটা শুধু বাড়ছে",
    wire: "অন্য পাশ FIN পাঠিয়েছে, আপনার Kernel ACK ও দিয়েছে। কিন্তু আপনার Program এখনো close ডাকেনি, তাই আপনার দিকের FIN যায়নি।",
    who: "আপনার নিজের Program। এটা প্রায় সবসময় একটা Bug।",
    fix: "Code এ খুঁজুন কোথায় Socket বা Response বন্ধ করা হচ্ছে না। সাধারণত একটা Error এর পথে, যেখানে close ডাকাটা বাদ পড়ে গেছে। Restart করলে সাময়িক সারে, কিন্তু Bug থেকে যায়।",
  },
  {
    id: "timewait",
    label: "অনেক TIME_WAIT",
    seen: "netstat বা ss এ হাজার হাজার TIME_WAIT, আর নতুন Connection খুলতে গেলে EADDRNOTAVAIL",
    wire: "এই যন্ত্রটা খুব দ্রুত অনেক Connection খুলছে আর নিজেই আগে বন্ধ করছে। প্রতিটা বন্ধ Connection কিছুক্ষণ একটা Ephemeral Port আটকে রাখছে।",
    who: "কেউ দোষী নয়, TIME_WAIT নিজে স্বাভাবিক। সমস্যা হলো প্রতি Request এ নতুন Connection খোলা।",
    fix: "Connection বারবার ব্যবহার করুন: HTTP Keep-Alive, Database এর Connection Pool। তাতে খোলা আর বন্ধ দুইটাই কমে যায়।",
  },
  {
    id: "idle",
    label: "অনেকক্ষণ পর প্রথম Request ঝুলে থাকে",
    seen: "কিছুক্ষণ কাজ না করার পর প্রথম Query বা Request টা অনেকক্ষণ আটকে থেকে ETIMEDOUT দেয়",
    wire: "মাঝখানের একটা NAT বা Firewall চুপচাপ Connection টা তার টেবিল থেকে মুছে ফেলেছে, কাউকে FIN বা RST না পাঠিয়ে। দুই পাশই ভাবছে Connection খোলা। এটা Half-open Connection।",
    who: "মাঝখানের যন্ত্রের Idle Timeout।",
    fix: "TCP Keepalive অথবা App এর নিজের Heartbeat চালু করুন, যার বিরতি মাঝের যন্ত্রের Timeout এর চেয়ে ছোট। Pool এ Connection এর সর্বোচ্চ Idle সময় বেঁধে দিন।",
  },
  {
    id: "lb502",
    label: "মাঝে মাঝে 502",
    seen: "দিনে কয়েকবার 502 Bad Gateway, আবার চেষ্টা করলেই ঠিক",
    wire: "Load Balancer একটা পুরনো Connection এ Request পাঠিয়েছে, যেটা App ঠিক তখনই বন্ধ করছিল। উত্তরে এসেছে RST।",
    who: "দুই Timeout এর ভুল ক্রম। App এর Keep-Alive Timeout টা Load Balancer এর Idle Timeout এর চেয়ে ছোট।",
    fix: "App এর Keep-Alive Timeout টা Load Balancer এর Idle Timeout এর চেয়ে কয়েক সেকেন্ড বেশি করুন।",
  },
];

export function CloseSymptomLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState(SYMPTOMS[0].id);
  const cur = SYMPTOMS.find((s) => s.id === id) ?? SYMPTOMS[0];

  const rows = [
    { k: "আপনি যা দেখেন", v: cur.seen },
    { k: "তারে আসলে যা ঘটেছিল", v: cur.wire },
    { k: "কার কাজ", v: cur.who },
    { k: "কী করবেন", v: cur.fix },
  ];

  return (
    <Panel
      label="Interactive"
      title="Error বার্তা থেকে উল্টো দিকে হাঁটুন"
      footer="একটা উপসর্গ বেছে নিন। প্রতিটার জন্য চারটা জিনিস দেখানো হয়েছে: Log বা Terminal এ আপনি কী দেখেন, তারের উপর আসলে কোন Segment গেছে বা যায়নি, কাজটা কার, আর কী করলে সারবে। এই সাতটা একবার মন দিয়ে পড়ে নিলে Production এর প্রায় সব Connection বন্ধ হওয়া সংক্রান্ত Error আপনি চিনতে পারবেন, আর অন্যকেও বুঝিয়ে বলতে পারবেন।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {SYMPTOMS.map((s) => (
          <Chip key={s.id} active={id === s.id} onClick={() => setId(s.id)} data-symptom={s.id}>
            {s.label}
          </Chip>
        ))}
      </div>

      <motion.div
        key={cur.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="space-y-2"
        data-current={cur.id}
      >
        {rows.map((r, i) => (
          <div
            key={r.k}
            className={cn(
              "grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-x-4 gap-y-1 border px-3 py-2.5",
              i === 1 ? "border-primary/50 bg-primary/5" : "border-border bg-background",
            )}
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground pt-0.5">
              {r.k}
            </div>
            <div className="text-[13px] leading-relaxed text-foreground">{r.v}</div>
          </div>
        ))}
      </motion.div>
    </Panel>
  );
}
