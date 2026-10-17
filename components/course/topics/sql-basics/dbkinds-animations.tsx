"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Check, RotateCcw, X } from "lucide-react";
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

/* ------------------------------------------------------------------------- */
/* 1. পরিস্থিতি দেখে Database বাছাই                                            */
/* ------------------------------------------------------------------------- */

type Kind =
  | "relational"
  | "document"
  | "keyvalue"
  | "widecolumn"
  | "graph"
  | "timeseries"
  | "search"
  | "vector"
  | "columnar";

const KINDS: { id: Kind; label: string }[] = [
  { id: "relational", label: "Relational" },
  { id: "document", label: "Document" },
  { id: "keyvalue", label: "Key-Value" },
  { id: "widecolumn", label: "Wide-column" },
  { id: "graph", label: "Graph" },
  { id: "timeseries", label: "Time-series" },
  { id: "search", label: "Search Engine" },
  { id: "vector", label: "Vector" },
  { id: "columnar", label: "Columnar" },
];

interface Scenario {
  id: string;
  label: string;
  situation: string;
  answer: Kind;
  why: string;
  postgres: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "payment",
    label: "bKash Payment",
    situation:
      "Rahim Uddin bKash এ টাকা দিলেন, এখন তাঁর Booking টা confirmed করতে হবে আর সিট কমাতে হবে। টাকা কেটে Booking না হওয়া, বা একই টাকা দুইবার কাটা, কোনোটাই চলবে না।",
    answer: "relational",
    why: "টাকা আর সিটের হিসাবে দরকার কড়া নিয়ম আর Transaction: কয়েকটা কাজ হয় সবগুলো হবে, নয়তো একটাও না। Table, Key আর Constraint দিয়ে এই নিশ্চয়তা দেওয়াই Relational Database এর সবচেয়ে বড় শক্তি।",
    postgres: "PostgreSQL নিজেই এর সবচেয়ে ভালো উত্তর। আলাদা কিছু লাগে না।",
  },
  {
    id: "session",
    label: "Login Session",
    situation:
      "প্রতিটা Page খোলার সময় জানতে হবে কে Login করে আছেন। দিনে লাখখানেক বার একই প্রশ্ন, আর প্রতিবার হাতে থাকে শুধু একটা Session ID।",
    answer: "keyvalue",
    why: "Session ID একটা Key, উত্তর একটা Value। Memory তে রাখা Key-Value Store এক মিলিসেকেন্ডেরও কম সময়ে উত্তর দেয়, আর এত বারের প্রশ্ন মূল Database এর ঘাড়ে পড়ে না।",
    postgres:
      "ছোট App এ PostgreSQL এর একটা sessions Table দিয়েই চলে। ভিড় বাড়লে Redis এর মতো Key-Value Store পাশে বসানো হয়।",
  },
  {
    id: "itinerary",
    label: "ট্যুরের দিনভিত্তিক Plan",
    situation:
      "প্রতিটা ট্যুরের Plan আলাদা আকারের। কোনোটা তিন দিনের, কোনোটা এক দিনের, কোনোটায় জাহাজের সময়সূচি, কোনোটায় ট্রেকিংয়ের জিনিসপত্রের তালিকা। ট্যুরের Page খুললে পুরোটা একসাথে দেখাতে হয়।",
    answer: "document",
    why: "Data এর আকার ট্যুর থেকে ট্যুরে বদলায়, আর পড়া হয় পুরোটা একসাথে। একটা Document এ রেখে দিলে এক Read এ পুরো Page এর Data চলে আসে, Table জোড়া লাগাতে হয় না।",
    postgres:
      "PostgreSQL এর JSONB Column এও ঠিক এভাবে রাখা যায়। এই লেসনের See It Yourself অংশে নিজে চালিয়ে দেখবেন।",
  },
  {
    id: "also-went",
    label: "যাঁরা গেছেন, তাঁরা আর কোথায়",
    situation:
      "Owner জানতে চান, Saint Martin এ যাঁরা গেছেন তাঁরা আর কোথায় যান, আর তাঁদের রেফার করা বন্ধুরা কোথায় যান। তিন চার ধাপ ধরে সম্পর্কের প্রশ্ন।",
    answer: "graph",
    why: "প্রশ্নটা জিনিস নিয়ে নয়, জিনিসগুলোর মধ্যের সম্পর্ক নিয়ে, আর অনেক ধাপ ধরে। Graph Database সম্পর্ক ধরে হাঁটার জন্যই বানানো, ধাপ বাড়লেও Query সহজ থাকে।",
    postgres:
      "Data ছোট থাকলে SQL এর Join আর Recursive CTE দিয়েই হয় (Module 07)। সম্পর্কের জাল বিশাল আর গভীর হলে তখন Graph Database।",
  },
  {
    id: "ship-gps",
    label: "জাহাজের GPS",
    situation:
      "Saint Martin এর জাহাজে একটা GPS যন্ত্র বসেছে, প্রতি দশ সেকেন্ডে অবস্থান পাঠায়। তিন বছরের Data রাখতে হবে, আর পুরনো Data কে ঘণ্টার গড়ে ছোট করে রাখতে হবে।",
    answer: "timeseries",
    why: "প্রতিটা মাপের সাথে সময় লাগানো, নতুন Data শুধু শেষে যোগ হয়, আর প্রশ্ন হয় সময়ের সীমা ধরে। পুরনো Data ছোট করা আর মেয়াদ শেষে মুছে ফেলা Time-series Database এর নিজের কাজ।",
    postgres:
      "TimescaleDB নামের একটা PostgreSQL Extension ঠিক এই কাজের জন্য, আলাদা Database ছাড়াই।",
  },
  {
    id: "typo-search",
    label: "ভুল বানানে Search",
    situation:
      "পর্যটক Search Box এ লিখলেন sant martin bich। বানান ভুল, তবু Saint Martin আর সৈকতের ট্যুরগুলো আসা উচিত, আর সবচেয়ে মানানসইটা সবার উপরে।",
    answer: "search",
    why: "শব্দ ভেঙে নির্ঘণ্ট বানানো, ভুল বানানের কাছাকাছি শব্দ খোঁজা আর ফলাফলকে মানানসই হওয়ার ক্রমে সাজানো, এই তিনটাই Search Engine এর মূল কাজ।",
    postgres:
      "PostgreSQL এর Full-text Search অনেকদূর পর্যন্ত চলে (Module 15)। বানান ভুল আর জটিল Ranking বেশি দরকার হলে আলাদা Search Engine।",
  },
  {
    id: "meaning",
    label: "অর্থ দিয়ে খোঁজা",
    situation:
      "পর্যটক লিখলেন, শান্ত, সবুজ, পানির ধারে কোথাও। কোনো ট্যুরের নামে বা বর্ণনায় এই শব্দগুলো নেই, তবু Ratargul আর Sundarbans দেখানো উচিত।",
    answer: "vector",
    why: "এখানে শব্দ মেলে না, মেলে অর্থ। AI Model লেখাকে সংখ্যার তালিকায় (Embedding) বদলায়, আর Vector Database অর্থের দিক থেকে সবচেয়ে কাছের জিনিসগুলো খুঁজে দেয়।",
    postgres:
      "pgvector Extension দিয়ে PostgreSQL নিজেই Vector রাখে আর কাছের প্রতিবেশী খোঁজে (Module 15)।",
  },
  {
    id: "revenue",
    label: "পাঁচ বছরের আয়",
    situation:
      "কয়েক বছর পরের কথা ভাবুন। Owner প্রতি সোমবার গত পাঁচ বছরের আয় দেখেন, মাস আর Destination অনুযায়ী ভাগ করে। কোটি Row পড়তে হয়, কিন্তু প্রতিটা Row থেকে লাগে মাত্র তিনটা Column।",
    answer: "columnar",
    why: "অনেক Row, অল্প কয়েকটা Column, আর যোগফল। Columnar Database Data কে Column ধরে রাখে, তাই শুধু দরকারি তিনটা Column পড়ে, বাকিগুলো ছুঁয়েও দেখে না।",
    postgres:
      "মাঝারি Data তে PostgreSQL এর একটা Replica তেই চলে। অনেক বড় হলে Warehouse (Lesson 07 আর Module 20)।",
  },
  {
    id: "clicks",
    label: "সেকেন্ডে বিশ হাজার Click",
    situation:
      "ধরুন কয়েক বছর পর Island Tours তিন দেশে চলে। প্রতিটা Click আর Page View জমা হচ্ছে, সেকেন্ডে বিশ হাজার Write। প্রশ্ন প্রায় একটাই: এই Visitor এর শেষ একশটা কাজ কী ছিল।",
    answer: "widecolumn",
    why: "বিশাল পরিমাণ Write, অনেক দেশে ছড়ানো Server, আর আগে থেকে জানা একটাই ধরনের প্রশ্ন। Wide-column Database Visitor এর ID দিয়ে Data ভাগ করে অনেক মেশিনে ছড়িয়ে রাখে, তাই Write আটকায় না।",
    postgres:
      "এই পরিমাণ Write আর এতগুলো দেশে ছড়ানো Data একটা PostgreSQL Server এর সীমার বাইরে। এখানে সত্যিই আলাদা Database দরকার।",
  },
];

export function DatabasePickerLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(SCENARIOS[0].id);
  const [picks, setPicks] = useState<Record<string, Kind>>({});
  const scenario = SCENARIOS.find((s) => s.id === active) ?? SCENARIOS[0];
  const picked = picks[scenario.id];
  const answered = SCENARIOS.filter((s) => picks[s.id]);
  const correct = answered.filter((s) => picks[s.id] === s.answer).length;
  const answerLabel = KINDS.find((k) => k.id === scenario.answer)?.label;

  return (
    <Panel
      label="Interactive"
      title="পরিস্থিতি দেখে Database বাছাই"
      footer={
        <>
          প্রতিটা পরিস্থিতি পড়ে নিজে একটা বেছে নিন, তারপর কারণটা পড়ুন। ভুল হলে আবার
          অন্যটা বেছে দেখতে পারেন। খেয়াল করুন নিচের PostgreSQL লাইনটা: বেশিরভাগ
          ক্ষেত্রে শুরুটা PostgreSQL দিয়েই করা যায়।
        </>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s, i) => {
            const pick = picks[s.id];
            const state = pick ? (pick === s.answer ? "right" : "wrong") : "open";
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                data-scenario={s.id}
                aria-pressed={s.id === active}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left",
                  s.id === active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
                )}
              >
                <span className="font-mono opacity-60">{toBn(i + 1)}</span>
                {s.label}
                {state === "right" && <Check className="w-3 h-3 text-primary" />}
                {state === "wrong" && <X className="w-3 h-3 text-destructive" />}
              </button>
            );
          })}
        </div>
        <span className="flex items-center gap-3 font-mono text-[0.6875rem] text-muted-foreground">
          <span data-score>
            {toBn(correct)} / {toBn(SCENARIOS.length)} সঠিক
          </span>
          <button
            onClick={() => setPicks({})}
            className="flex items-center gap-1 border border-border px-2 py-1 hover:text-foreground hover:border-primary/40 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            আবার
          </button>
        </span>
      </div>

      <motion.div
        key={scenario.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-active={scenario.id}
      >
        <p className="text-sm md:text-base leading-relaxed text-foreground mb-5">
          {scenario.situation}
        </p>

        <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">
          Which kind fits best?
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
          {KINDS.map((kind) => {
            const isPicked = picked === kind.id;
            const isAnswer = picked && kind.id === scenario.answer;
            return (
              <button
                key={kind.id}
                data-kind={kind.id}
                onClick={() => setPicks((prev) => ({ ...prev, [scenario.id]: kind.id }))}
                className={cn(
                  "px-3 py-2 border text-left font-mono text-[0.75rem] font-bold transition-colors",
                  isAnswer
                    ? "border-primary bg-primary/10 text-primary"
                    : isPicked
                      ? "border-destructive/60 bg-destructive/5 text-destructive"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
                )}
              >
                {kind.label}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-feedback>
            <div
              className={cn(
                "border p-4",
                picked === scenario.answer
                  ? "border-primary/50 bg-primary/5"
                  : "border-destructive/40 bg-destructive/5",
              )}
            >
              <div
                className={cn(
                  "font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] mb-2",
                  picked === scenario.answer ? "text-primary" : "text-destructive",
                )}
              >
                {picked === scenario.answer ? "Right" : `Best fit: ${answerLabel}`}
              </div>
              <p className="text-[0.8125rem] leading-relaxed text-foreground">
                {scenario.why}
              </p>
            </div>
            <div className="border border-border bg-background p-4">
              <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
                With PostgreSQL alone
              </div>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                {scenario.postgres}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একই প্রশ্ন, চার রকম Database                                              */
/* ------------------------------------------------------------------------- */

type Fit = "natural" | "works" | "awkward" | "impossible";

const FIT_LABEL: Record<Fit, string> = {
  natural: "Natural fit",
  works: "Works",
  awkward: "Awkward",
  impossible: "Not possible",
};

const FIT_STYLE: Record<Fit, string> = {
  natural: "border-primary bg-primary/10 text-primary",
  works: "border-border bg-muted/40 text-foreground",
  awkward: "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  impossible: "border-destructive/50 bg-destructive/10 text-destructive",
};

const DATABASES = ["Relational", "Document", "Key-Value", "Graph"] as const;

const QUESTIONS: {
  id: string;
  label: string;
  question: string;
  answers: { fit: Fit; why: string }[];
}[] = [
  {
    id: "key",
    label: "একটা Key এর মান",
    question: "session:7f3a9c এই Session টা কার?",
    answers: [
      {
        fit: "works",
        why: "sessions Table এ Session ID কে Primary Key রাখলে Index ধরে এক লাফে পায়। তবে প্রতি Request এ Disk এর Database ছোঁয়া Redis এর চেয়ে ভারী।",
      },
      {
        fit: "works",
        why: "ID দিয়ে একটা Document তুলে আনা দ্রুত। কাজ চলে, তবে এত সহজ প্রশ্নে Document এর নমনীয়তার দরকার নেই।",
      },
      {
        fit: "natural",
        why: "ঠিক এই প্রশ্নের জন্যই তৈরি। Memory থেকে Key ধরে সরাসরি মান, এক মিলিসেকেন্ডেরও কম সময়ে।",
      },
      {
        fit: "awkward",
        why: "Session এর এমন কোনো সম্পর্ক নেই যা ধরে হাঁটতে হবে। Graph এখানে শুধু বাড়তি ঝামেলা।",
      },
    ],
  },
  {
    id: "owner",
    label: "একজনের সব Booking",
    question: "Rahim Uddin এর সব Booking, ট্যুরের নামসহ।",
    answers: [
      {
        fit: "natural",
        why: "bookings Table এ customer_id ধরে খোঁজা, তারপর departures আর tours এর সাথে Join। ঠিক এই রকম প্রশ্নের জন্যই Relational মডেল।",
      },
      {
        fit: "works",
        why: "Booking গুলো Customer এর Document এর ভেতরে রাখা থাকলে এক Read এই সব। কিন্তু তাহলে ট্যুরের নাম প্রতিটা Booking এ কপি করে রাখতে হয়।",
      },
      {
        fit: "awkward",
        why: "শুধু যদি আগে থেকে customer:1:bookings নামে একটা Key বানিয়ে তালিকাটা নিজে হাতে হালনাগাদ রাখেন। Database নিজে কিছু খুঁজে দেয় না।",
      },
      {
        fit: "works",
        why: "Rahim এর Node থেকে BOOKED সম্পর্ক ধরে এক ধাপ হাঁটা। হয়ে যায়, তবে এই সহজ প্রশ্নে Graph এর বিশেষ কোনো সুবিধা নেই।",
      },
    ],
  },
  {
    id: "hops",
    label: "দুই ধাপের সম্পর্ক",
    question: "Saint Martin এ যাঁরা গেছেন, তাঁরা আর কোন কোন ট্যুরে গেছেন?",
    answers: [
      {
        fit: "works",
        why: "পাঁচ ছয়টা Join লাগে, আর ধাপ যত বাড়ে Query আর সময় দুটোই তত দ্রুত বাড়ে। এই লেসনের Lab এ Query টা নিজে চালিয়ে দেখবেন।",
      },
      {
        fit: "awkward",
        why: "প্রতিটা Customer এর Document খুলে ভেতরের Booking এর তালিকা ঘাঁটতে হয়। Document থেকে Document এ সম্পর্ক ধরে হাঁটা এর স্বভাব নয়।",
      },
      {
        fit: "impossible",
        why: "Value এর ভেতরে কী আছে সেটা সে জানেই না, তাই সম্পর্ক ধরে খোঁজার কোনো উপায় নেই।",
      },
      {
        fit: "natural",
        why: "ট্যুর থেকে মানুষে, মানুষ থেকে অন্য ট্যুরে। দুই ধাপের হাঁটা, আর ধাপ পাঁচটা হলেও একই রকম স্বাভাবিক।",
      },
    ],
  },
  {
    id: "report",
    label: "মাসভিত্তিক মোট আয়",
    question: "২০২৬ সালের প্রতি মাসের মোট আয় কত?",
    answers: [
      {
        fit: "works",
        why: "GROUP BY দিয়ে সহজে লেখা যায়, আর এই আকারের Data তে মুহূর্তে উত্তর আসে। কোটি Row হলে ধীর হবে, তখন Lesson 07 এর কথা।",
      },
      {
        fit: "works",
        why: "Aggregation Pipeline দিয়ে হয়, তবে প্রতিটা Document পুরোটা খুলে পড়তে হয়।",
      },
      {
        fit: "impossible",
        why: "সব Key ঘুরে ঘুরে App কে নিজে যোগ করতে হবে। Store হিসেবে সে যোগফলের ধারণাই জানে না।",
      },
      {
        fit: "awkward",
        why: "সম্ভব, কিন্তু এটা সম্পর্কের প্রশ্ন নয়, গোনার প্রশ্ন। Graph এর শক্তি এখানে কোনো কাজে আসে না।",
      },
    ],
  },
];

export function QuestionFitLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(QUESTIONS[0].id);
  const current = QUESTIONS.find((q) => q.id === active) ?? QUESTIONS[0];

  return (
    <Panel
      label="Interactive"
      title="একই প্রশ্ন, চার রকম Database"
      footer={
        <>
          কোনো Database সব প্রশ্নে সেরা নয়। প্রতিটা প্রশ্ন বদলে দেখুন কোন কার্ডটা
          Natural fit হয়। প্রশ্ন বদলালে বিজয়ীও বদলায়, আর এটাই এই লেসনের মূল কথা।
          Report এর প্রশ্নে সবচেয়ে ভালো Columnar Database, যার কথা Lesson 07 এ।
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {QUESTIONS.map((q) => (
          <button
            key={q.id}
            onClick={() => setActive(q.id)}
            data-question={q.id}
            aria-pressed={q.id === active}
            className={cn(
              "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
              q.id === active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {q.label}
          </button>
        ))}
      </div>

      <p className="text-sm md:text-base font-bold text-foreground mb-5">{current.question}</p>

      <motion.div
        key={current.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"
        data-active={current.id}
      >
        {DATABASES.map((db, i) => {
          const answer = current.answers[i];
          return (
            <div key={db} className="border border-border bg-background p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.75rem] font-bold text-foreground">{db}</span>
                <span
                  data-fit={answer.fit}
                  className={cn(
                    "px-2 py-0.5 border font-mono text-[0.5625rem] font-bold uppercase tracking-[0.1em]",
                    FIT_STYLE[answer.fit],
                  )}
                >
                  {FIT_LABEL[answer.fit]}
                </span>
              </div>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{answer.why}</p>
            </div>
          );
        })}
      </motion.div>
    </Panel>
  );
}
