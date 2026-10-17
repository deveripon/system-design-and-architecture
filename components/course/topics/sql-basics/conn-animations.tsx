"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
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

function Choice({
  active,
  onClick,
  children,
  ...rest
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
} & Record<`data-${string}`, string>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      {...rest}
      className={cn(
        "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left",
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
/* Lab 1: একটা Connection খোলা থেকে প্রথম উত্তর পর্যন্ত                           */
/* ------------------------------------------------------------------------- */

type Step = {
  id: string;
  name: string;
  who: "App" | "Server" | "দুই পক্ষ";
  wire: string;
  story: string;
  roundTrips: number;
};

const STEPS: Step[] = [
  {
    id: "dns",
    name: "নাম থেকে ঠিকানা",
    who: "App",
    wire: "db.internal.example  →  10.0.0.12",
    story:
      "Connection String এ Host লেখা আছে নাম হিসেবে। Driver আগে DNS কে জিজ্ঞেস করে এই নামের IP কত। Host হিসেবে সরাসরি IP বা localhost লেখা থাকলে এই ধাপটা বাদ যায়।",
    roundTrips: 1,
  },
  {
    id: "tcp",
    name: "TCP Handshake",
    who: "দুই পক্ষ",
    wire: "SYN  →  SYN-ACK  ←  ACK  →   (Port 5432)",
    story:
      "App এর Kernel 10.0.0.12 এর Port 5432 এ SYN পাঠায়। ওখানে PostgreSQL এর মূল Process টা শুনছে, তার নাম postmaster। তিন বার্তার পর একটা TCP Connection খোলা। নতুন কেউ আসার সাথে সাথে postmaster তার জন্য একটা নতুন Process চালু করে দেয়, যার নাম Backend Process। এরপরের সব কথা হয় সেই Process এর সাথে। এখনো একটা অক্ষরও SQL যায়নি।",
    roundTrips: 1,
  },
  {
    id: "tls",
    name: "TLS চাওয়া",
    who: "দুই পক্ষ",
    wire: "SSLRequest  →   'S'  ←   TLS Handshake",
    story:
      "Network এর মধ্য দিয়ে Password আর Data খোলা অবস্থায় যাওয়া ঠিক না, তাই Driver আগে জিজ্ঞেস করে, TLS চলবে? Server রাজি থাকলে উত্তর দেয় S, তারপর TLS এর পরিচয় পর্ব। একই মেশিনের ভেতরের Connection এ অনেক সময় এই ধাপ বাদ রাখা হয়।",
    roundTrips: 2,
  },
  {
    id: "startup",
    name: "পরিচয় দেওয়া",
    who: "App",
    wire: "StartupMessage { user: island_api, database: island_tours }",
    story:
      "এবার Driver বলে, আমি island_api, আর আমি island_tours Database টা চাই। Backend Process এখন জানল কে এসেছেন আর কোন Database এ কাজ হবে। এই দুটো তথ্য ছাড়া সে কিছুই শুরু করতে পারে না।",
    roundTrips: 1,
  },
  {
    id: "auth",
    name: "প্রমাণ দেওয়া",
    who: "দুই পক্ষ",
    wire: "AuthenticationSASL  ←   SCRAM-SHA-256 ↔   AuthenticationOk  ←",
    story:
      "Server বলে, প্রমাণ দিন। SCRAM পদ্ধতিতে Password নিজে কখনো তারে যায় না। দুই পক্ষ কয়েক দফা ধাঁধা আর উত্তর বিনিময় করে, যা থেকে Server বুঝে নেয় Client আসল Password জানে। ভুল হলে এখানেই Connection শেষ।",
    roundTrips: 2,
  },
  {
    id: "ready",
    name: "তৈরি",
    who: "Server",
    wire: "ParameterStatus …  BackendKeyData  ReadyForQuery  ←",
    story:
      "প্রমাণ মিলল। Server কিছু তথ্য পাঠায়, যেমন নিজের Version আর Time Zone, তারপর বলে ReadyForQuery। এখান থেকে এই Connection একটা Session: যতক্ষণ খোলা, যত খুশি Query পাঠানো যায়।",
    roundTrips: 0,
  },
  {
    id: "query",
    name: "Query পাঠানো",
    who: "App",
    wire: "Query  'SELECT title, price_bdt FROM tours WHERE tour_id = 3'",
    story:
      "Query যায় একটা সাধারণ লেখা হিসেবে। Driver এর ভেতরে Query টা বোঝার কোনো চেষ্টা হয় না। Backend Process লেখাটা পেয়ে Parse, Analyze, Plan আর Execute করে।",
    roundTrips: 1,
  },
  {
    id: "rows",
    name: "উত্তর ফেরত",
    who: "Server",
    wire: "RowDescription  DataRow  CommandComplete 'SELECT 1'  ReadyForQuery  ←",
    story:
      "উত্তর আসে কয়েক টুকরোয়: আগে Column এর নাম আর Type, তারপর প্রতিটা Row, শেষে কয়টা Row গেল তার হিসাব। Driver এগুলো জুড়ে আপনার Code এর হাতে দেয় একটা Array, প্রতিটা Row একটা Object।",
    roundTrips: 0,
  },
];

export function ConnectionStepLab() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const tripsSoFar = STEPS.slice(0, index + 1).reduce((n, s) => n + s.roundTrips, 0);
  const sqlStarted = index >= 6;

  return (
    <Panel
      label="Interactive"
      title="একটা Connection খোলা থেকে প্রথম উত্তর পর্যন্ত"
      footer="Round Trip এর সংখ্যাগুলো মোটামুটি হিসাব, DNS আগে থেকে Cache এ থাকলে বা TLS বন্ধ থাকলে কমে যায়। আসল কথাটা এখানে: প্রথম SQL টা তারে ওঠার আগেই প্রায় ছয় সাতটা Round Trip খরচ হয়ে যায়। Server যদি আরেক শহরে থাকে আর প্রতিটা Round Trip ৪০ মিলিসেকেন্ড হয়, শুধু Connection খুলতেই চলে যায় ২৪০ মিলিসেকেন্ডের বেশি।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] gap-6">
        <ol className="space-y-1.5">
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                data-step={s.id}
                aria-current={i === index ? "step" : undefined}
                className={cn(
                  "w-full flex items-center gap-3 border px-3 py-2 text-left transition-colors",
                  i === index
                    ? "border-primary bg-primary/10 text-primary"
                    : i < index
                      ? "border-border text-foreground/80 hover:border-primary/40"
                      : "border-border text-muted-foreground hover:border-primary/40",
                )}
              >
                <span className="font-mono text-[0.625rem] font-bold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.8125rem] font-medium">{s.name}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="min-w-0 space-y-4">
          <motion.div
            key={step.id}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            data-active-step={step.id}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-primary/50 bg-primary/5 px-2 py-0.5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary">
                {step.who}
              </span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
                ধাপ {toBn(index + 1)} / {toBn(STEPS.length)}
              </span>
            </div>
            <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] text-foreground">
              {step.wire}
            </pre>
            <p className="text-sm md:text-base leading-relaxed text-foreground">{step.story}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-border bg-background p-3">
              <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">
                এ পর্যন্ত Round Trip
              </div>
              <div className="text-xl font-black tabular-nums text-primary">{toBn(tripsSoFar)}</div>
            </div>
            <div className="border border-border bg-background p-3">
              <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">
                SQL কি গেছে?
              </div>
              <div className={cn("text-sm font-bold", sqlStarted ? "text-primary" : "text-muted-foreground")}>
                {sqlStarted ? "হ্যাঁ, এবার গেল" : "এখনো একটা অক্ষরও না"}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="flex h-8 items-center gap-1 border border-border px-2.5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> আগের
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(STEPS.length - 1, i + 1))}
              disabled={index === STEPS.length - 1}
              data-next
              className="flex h-8 items-center gap-1 border border-primary bg-primary px-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary-foreground disabled:opacity-40"
            >
              পরের <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIndex(0)}
              className="flex h-8 items-center gap-1 border border-border px-2.5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" /> শুরু
            </button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* Lab 2: জোড়া দেওয়া লেখা বনাম Parameter                                       */
/* ------------------------------------------------------------------------- */

type Mode = "glue" | "param";
type InputId = "normal" | "always" | "delete";

const INPUTS: { id: InputId; label: string; value: string }[] = [
  { id: "normal", label: "সাধারণ Email", value: "nusrat.jahan@mail.example" },
  { id: "always", label: "সবসময় সত্য", value: "' OR '1'='1" },
  { id: "delete", label: "দ্বিতীয় একটা Statement", value: "x'; DELETE FROM reviews; --" },
];

/** What the sample database actually returns for each case, checked against PostgreSQL. */
const OUTCOMES: Record<Mode, Record<InputId, { rows: string; extra?: string; verdict: "ok" | "bad" }>> = {
  glue: {
    normal: { rows: "১টা Row: Nusrat Jahan", verdict: "ok" },
    always: {
      rows: "১৫টা Row: সব Customer এর নাম, শহর",
      extra: "শর্তের শেষে OR '1'='1' সবসময় সত্য, তাই WHERE আর কিছুই ছাঁকে না।",
      verdict: "bad",
    },
    delete: {
      rows: "০টা Row, তারপর DELETE 10",
      extra: "সেমিকোলনের পরে দ্বিতীয় একটা Statement চলেছে। reviews Table এর দশটা Review ই মুছে গেছে। শেষের -- বাকি লেখাটাকে Comment বানিয়ে দিয়েছে।",
      verdict: "bad",
    },
  },
  param: {
    normal: { rows: "১টা Row: Nusrat Jahan", verdict: "ok" },
    always: {
      rows: "০টা Row",
      extra: "পুরো লেখাটা একটা Email হিসেবে খোঁজা হয়েছে। এমন অদ্ভুত Email কারো নেই, তাই কিছুই আসেনি।",
      verdict: "ok",
    },
    delete: {
      rows: "০টা Row, কিছুই মোছেনি",
      extra: "সেমিকোলন, DELETE, -- সবই একটা Email এর অক্ষর মাত্র। Parameter এর মান কখনো SQL হয়ে ওঠে না।",
      verdict: "ok",
    },
  },
};

export function InjectionLab() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("glue");
  const [inputId, setInputId] = useState<InputId>("normal");
  const input = INPUTS.find((i) => i.id === inputId)!;
  const outcome = OUTCOMES[mode][inputId];

  const sentText =
    mode === "glue"
      ? `SELECT customer_id, full_name, city FROM customers WHERE email = '${input.value}';`
      : "SELECT customer_id, full_name, city FROM customers WHERE email = $1";

  return (
    <Panel
      label="Interactive"
      title="Email দিয়ে Customer খোঁজা, দুই রকম Code"
      footer="ফলাফলগুলো এই ট্র্যাকের Sample Database এ সত্যিই চালিয়ে মেলানো। নিচের Query বক্সে আপনি নিজেও জোড়া দেওয়া সংস্করণটা চালিয়ে দেখতে পারবেন। SQL Injection এর পুরো গল্প আর তার সব রূপ আসবে Module 16 তে।"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            App এর Code কীভাবে লেখা
          </div>
          <div className="flex flex-wrap gap-2">
            <Choice active={mode === "glue"} onClick={() => setMode("glue")} data-mode="glue">
              লেখা জোড়া দিয়ে
            </Choice>
            <Choice active={mode === "param"} onClick={() => setMode("param")} data-mode="param">
              Parameter দিয়ে ($1)
            </Choice>
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            ফর্মে কেউ যা লিখলেন
          </div>
          <div className="flex flex-wrap gap-2">
            {INPUTS.map((i) => (
              <Choice key={i.id} active={inputId === i.id} onClick={() => setInputId(i.id)} data-input={i.id}>
                {i.label}
              </Choice>
            ))}
          </div>
          <pre className="overflow-x-auto border border-border bg-background px-4 py-2 font-mono text-[0.75rem] text-foreground">
            {input.value}
          </pre>
        </div>

        <motion.div
          key={`${mode}-${inputId}`}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          data-outcome={outcome.verdict}
          className="space-y-4"
        >
          <div className="space-y-2">
            <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Server এর কাছে যা পৌঁছাল
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-all border border-border bg-background px-4 py-3 font-mono text-[0.75rem] text-foreground">
              {sentText}
              {mode === "param" && `\n\nমান আলাদা বার্তায়, $1 = ${JSON.stringify(input.value)}`}
            </pre>
          </div>

          <div
            className={cn(
              "border p-4",
              outcome.verdict === "bad" ? "border-destructive/50 bg-destructive/5" : "border-primary/50 bg-primary/5",
            )}
          >
            <div
              className={cn(
                "font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] mb-1.5",
                outcome.verdict === "bad" ? "text-destructive" : "text-primary",
              )}
            >
              {outcome.verdict === "bad" ? "বিপদ" : "নিরাপদ"} · ফলাফল
            </div>
            <p className="text-sm font-bold text-foreground">{outcome.rows}</p>
            {outcome.extra && (
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">{outcome.extra}</p>
            )}
          </div>
        </motion.div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* Lab 3: প্রতিবার নতুন Connection বনাম Pool                                    */
/* ------------------------------------------------------------------------- */

/** Example costs for the lab, not measurements: a nearby server, TLS on. */
const OPEN_MS = 20;
const QUERY_MS = 2;
const POOL_SIZE = 10;
const MAX_CONNECTIONS = 100;
const COUNTS = [1, 10, 100, 500] as const;

export function PoolLab() {
  const [count, setCount] = useState<(typeof COUNTS)[number]>(10);
  const [pooled, setPooled] = useState(false);

  const plans = [
    {
      id: "fresh",
      name: "প্রতি Request এ নতুন Connection",
      opens: count,
      total: count * (OPEN_MS + QUERY_MS),
      peak: count,
    },
    {
      id: "pool",
      name: `Pool, সর্বোচ্চ ${toBn(POOL_SIZE)}টা Connection`,
      opens: Math.min(count, POOL_SIZE),
      total: Math.min(count, POOL_SIZE) * OPEN_MS + count * QUERY_MS,
      peak: Math.min(count, POOL_SIZE),
    },
  ];
  const longest = Math.max(...plans.map((p) => p.total));
  const chosen = plans[pooled ? 1 : 0];
  const overLimit = chosen.peak > MAX_CONNECTIONS;

  return (
    <Panel
      label="Interactive"
      title="Connection এর দাম, একসাথে অনেক Request এ"
      footer={`হিসাবটা উদাহরণের জন্য: Connection খুলতে ${toBn(OPEN_MS)} মিলিসেকেন্ড, একটা ছোট Query তে ${toBn(QUERY_MS)} মিলিসেকেন্ড, আর সব Request একসাথে এসেছে ধরে নেওয়া। আপনার Server এ সংখ্যাগুলো আলাদা হবে, কিন্তু অনুপাতটা প্রায় সবসময় এমনই থাকে: Connection খোলা Query চালানোর চেয়ে অনেক গুণ দামি। PostgreSQL এর max_connections এর Default মান ${toBn(MAX_CONNECTIONS)}।`}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mr-1">
            একসাথে Request
          </span>
          {COUNTS.map((n) => (
            <Choice key={n} active={count === n} onClick={() => setCount(n)} data-count={String(n)}>
              {toBn(n)}
            </Choice>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mr-1">
            App এর নিয়ম
          </span>
          <Choice active={!pooled} onClick={() => setPooled(false)} data-plan="fresh">
            প্রতিবার নতুন
          </Choice>
          <Choice active={pooled} onClick={() => setPooled(true)} data-plan="pool">
            Pool থেকে ধার
          </Choice>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => {
            const isChosen = plan.id === chosen.id;
            return (
              <div key={plan.id} data-plan-row={plan.id} className={cn("space-y-1.5", !isChosen && "opacity-60")}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className={cn("text-[0.8125rem] font-bold", isChosen ? "text-primary" : "text-foreground")}>
                    {plan.name}
                  </span>
                  <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
                    মোট কাজের সময় {toBn(plan.total)} ms · Connection খোলা {toBn(plan.opens)} বার
                  </span>
                </div>
                <div className="h-3 w-full bg-muted/40">
                  <div
                    className={cn("h-full transition-[width] duration-500", isChosen ? "bg-primary" : "bg-muted-foreground/40")}
                    style={{ width: `${Math.max(2, (plan.total / longest) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className={cn("border p-4", overLimit ? "border-destructive/50 bg-destructive/5" : "border-border bg-background")}>
          <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1.5">
            Database Server এ একসাথে Process
          </div>
          <p className="text-sm font-bold text-foreground" data-peak={String(chosen.peak)}>
            {toBn(chosen.peak)}টা Backend Process
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {overLimit
              ? `max_connections ${toBn(MAX_CONNECTIONS)} পার হয়ে গেছে। ${toBn(MAX_CONNECTIONS)} এর পরের Connection গুলো পাবে: FATAL: sorry, too many clients already। বুকিং বন্ধ।`
              : pooled
                ? "Request যতই আসুক, Server দেখে সবসময় সর্বোচ্চ দশজন চেনা মুখ। বাকি Request গুলো Pool এর লাইনে কয়েক মিলিসেকেন্ড দাঁড়ায়, তারপর খালি হওয়া Connection টা ধার নেয়।"
                : "প্রতিটা Request এর জন্য Server কে একটা করে নতুন Process জন্ম দিতে হচ্ছে, আর কাজ শেষে মেরে ফেলতে হচ্ছে। Request বাড়লে এই সংখ্যাও সমান তালে বাড়ে।"}
          </p>
        </div>
      </div>
    </Panel>
  );
}
