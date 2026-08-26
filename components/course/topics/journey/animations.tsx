"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
/* 1. পুরো যাত্রা, ধাপে ধাপে, ঘড়ি সহ                                          */
/* ------------------------------------------------------------------------- */

type Stage = {
  where: "you" | "road" | "server";
  title: string;
  lesson: string;
  ms: number; // added at this stage
  note: string;
  faded?: boolean; // previewed, not taught this module
};

const STAGES: Stage[] = [
  {
    where: "you",
    title: "আপনি URL লিখলেন",
    lesson: "শুরু",
    ms: 0,
    note: "Browser এ islandtours.com লিখে Enter চাপলেন। এখনো কিছুই বাইরে যায়নি, শুধু আপনার একটা ইচ্ছা।",
  },
  {
    where: "you",
    title: "নাম থেকে নম্বর",
    lesson: "DNS, Module 04",
    ms: 30,
    faded: true,
    note: "Internet নাম চেনে না, শুধু সংখ্যা। তাই আগে islandtours.com কে একটা IP Address এ বদলাতে হয়। এটা কীভাবে হয়, সেটা Module 04। আপাতত ধরে নিন নম্বরটা পাওয়া গেল, 103.94.135.2।",
  },
  {
    where: "road",
    title: "রাস্তা খুঁজে বেরোনো",
    lesson: "Lesson 01, 05",
    ms: 40,
    note: "এবার Packet রওনা দিল। আপনার Router, ISP, IIG, সমুদ্রের তার, প্রত্যেকে শুধু পরের এক ধাপ জেনে ঠিকানার দিকে ঠেলল।",
  },
  {
    where: "server",
    title: "দরজায় কড়া, Port 443",
    lesson: "Lesson 03",
    ms: 100,
    note: "Singapore এ পৌঁছে Packet মেশিনের ঠিকানা পেল, এবার ফ্ল্যাট খুঁজল, 443। Kernel খাতা দেখে nginx এর হ্যান্ডসেটে দিল।",
  },
  {
    where: "server",
    title: "খাম বন্ধ হলো",
    lesson: "HTTPS, Module 06",
    ms: 180,
    faded: true,
    note: "কথা শুরুর আগে দুই পক্ষ একটা গোপন তালা বানাল, যাতে মাঝের কোনো Router ভেতরটা পড়তে না পারে। এটাই HTTPS, আর এই ধাপে কয়েকবার যাওয়া আসা লাগে, তাই সময় বেশি। বিস্তারিত Module 06।",
  },
  {
    where: "server",
    title: "API Request পেল",
    lesson: "Lesson 02",
    ms: 185,
    note: "nginx ভেতরে ভেতরে API কে ডাকল, 127.0.0.1:3000 এ। এই কথায় nginx হলো Client, API হলো Server। API এবার বুঝল, একটা Tour list চাওয়া হয়েছে।",
  },
  {
    where: "server",
    title: "API এখন Database এর Client",
    lesson: "Lesson 02",
    ms: 210,
    note: "API উত্তর জানে না, তাই Database কে জিজ্ঞেস করল। এক সেকেন্ড আগে যে Server ছিল, সে এখন Client। ভূমিকা কথা ধরে বদলায়।",
  },
  {
    where: "server",
    title: "Response তৈরি",
    lesson: "Lesson 04",
    ms: 225,
    note: "Database তালিকা দিল, API সেটা সাজিয়ে একটা Response বানাল। এবার এই Response আবার টুকরো টুকরো Packet এ ভাগ হবে ফেরার জন্য।",
  },
  {
    where: "road",
    title: "উত্তর ফিরতি পথে",
    lesson: "Lesson 04, 05",
    ms: 290,
    note: "একই সমুদ্র, উল্টো দিকে। এবার খামে যাওয়ার ঠিকানা আপনার Phone এর, আর সেই সাময়িক ফেরার Port টা, যেটা Kernel শুরুতে দিয়েছিল।",
  },
  {
    where: "you",
    title: "Browser পর্দায় আঁকল",
    lesson: "শেষ",
    ms: 380,
    note: "Packet গুলো এসে ক্রমে সাজল, Browser উত্তরটা পড়ে পর্দায় Tour এর তালিকা আঁকল। পুরো যাত্রা শেষ, প্রায় ৩৮০ মিলিসেকেন্ডে। আপনি শুধু দেখলেন তালিকা এলো।",
  },
];

const WHERE_LABEL: Record<Stage["where"], string> = {
  you: "আপনার দিক",
  road: "রাস্তা",
  server: "সার্ভারের দিক",
};

export function FullJourneyLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  const finished = i >= STAGES.length - 1;
  const running = playing && !finished;
  const advance = useCallback(
    () => setI((v) => Math.min(v + 1, STAGES.length - 1)),
    [],
  );

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(advance, 2600);
    return () => clearTimeout(id);
  }, [running, i, advance]);

  const s = STAGES[i];

  return (
    <Panel
      label="Animation story"
      title="islandtours.com থেকে পর্দায় তালিকা, পুরোটা"
      footer="এই এক ছবিতে গোটা মডিউল। বাঁ পাশের তালিকায় প্রতিটা ধাপের পাশে লেখা সেটা কোন লেসনের, আর ঘড়িটা দেখায় সময় কীভাবে জমে। দুইটা ধূসর ধাপ, নাম থেকে নম্বর আর খাম বন্ধ, এখনো শেখা বাকি, ওগুলো Module 04 আর 06। বাকি সব আপনি জানেন। এবার লক্ষ্য একটাই, এই পুরো যাত্রাটা নিজের মুখে বলতে পারা, কারো সাহায্য ছাড়া।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => {
            if (finished) setI(0);
            setPlaying((p) => !p);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors"
        >
          {running ? (
            <Pause className="w-3 h-3" />
          ) : (
            <Play className="w-3 h-3" />
          )}
          {running ? "Pause" : finished ? "আবার" : "Play"}
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setI((v) => (v >= STAGES.length - 1 ? 0 : v + 1));
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <SkipForward className="w-3 h-3" /> Step
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setI(0);
          }}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          ঘড়ি{" "}
          <span className="text-primary font-bold text-base" data-clock={s.ms}>
            {toBn(s.ms)}
          </span>{" "}
          ms
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* stage rail */}
        <ol className="space-y-1">
          {STAGES.map((st, idx) => {
            const active = idx === i;
            const done = idx < i;
            return (
              <li
                key={st.title}
                data-stage={idx}
                data-active={active ? "true" : "false"}
                className={cn(
                  "flex items-start gap-2 px-3 py-1.5 border transition-colors duration-200",
                  active
                    ? "border-primary bg-primary/10"
                    : done
                      ? "border-border bg-muted/20"
                      : "border-transparent",
                  st.faded && !active && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[10px] pt-0.5 w-4 shrink-0",
                    active ? "text-primary" : "text-muted-foreground/50",
                  )}
                >
                  {toBn(idx + 1)}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-[12px] leading-snug",
                      active
                        ? "text-foreground"
                        : done
                          ? "text-muted-foreground"
                          : "text-muted-foreground/50",
                    )}
                  >
                    {st.title}
                  </span>
                  <span
                    className={cn(
                      "block font-mono text-[8px] uppercase tracking-[0.1em]",
                      st.faded ? "text-muted-foreground/50" : "text-primary/70",
                    )}
                  >
                    {st.lesson}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        {/* current stage detail */}
        <div className="border border-border bg-background p-5">
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <span
              className={cn(
                "font-mono text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 border",
                s.where === "server"
                  ? "border-primary/50 text-primary"
                  : s.where === "road"
                    ? "border-border text-muted-foreground"
                    : "border-accent/50 text-accent",
              )}
              data-where={s.where}
            >
              {WHERE_LABEL[s.where]}
            </span>
            <span
              className={cn(
                "font-mono text-[9px] uppercase tracking-[0.12em]",
                s.faded ? "text-muted-foreground/60" : "text-primary",
              )}
            >
              {s.lesson}
            </span>
          </div>
          <div className="text-lg font-bold text-foreground mb-3">
            {s.title}
          </div>
          <motion.p
            key={i}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {s.note}
          </motion.p>
          {s.faded && (
            <div className="mt-4 px-3 py-2 border border-dashed border-border/60 font-mono text-[10px] text-muted-foreground">
              এই ধাপটা এখনো শেখানো হয়নি, {s.lesson} এ শিখবেন।
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. প্রতিটা ধাপ, কোন লেসন, নিজে মেলান                                        */
/* ------------------------------------------------------------------------- */

type Q = { stage: string; options: string[]; answer: number; why: string };

const QUIZ: Q[] = [
  {
    stage: "মেশিনের কোন Program টা চিঠি পাবে, সেটা ঠিক হয়",
    options: [
      "Lesson 02, Client Server",
      "Lesson 03, Port আর Socket",
      "Lesson 05, রাস্তা",
    ],
    answer: 1,
    why: "Port হলো ফ্ল্যাটের নম্বর, আর Kernel এর খাতা ঠিক করে কোন Program চিঠি পাবে। এটা Lesson 03।",
  },
  {
    stage: "API নিজে Database কে জিজ্ঞেস করে, মানে Server এখন Client",
    options: [
      "Lesson 02, ভূমিকা বদলায়",
      "Lesson 04, Packet",
      "Lesson 03, Socket",
    ],
    answer: 0,
    why: "একই মেশিন এক মুহূর্তে Server, পরের মুহূর্তে Client। ভূমিকা কথা ধরে বদলায়, এটা Lesson 02।",
  },
  {
    stage: "বড় Response ছোট টুকরো হয়ে ফেরে, কোনোটা আগে কোনোটা পরে",
    options: [
      "Lesson 01, নেটওয়ার্ক",
      "Lesson 04, Packet",
      "Lesson 02, Server",
    ],
    answer: 1,
    why: "টুকরো করা, নম্বর দেওয়া, ক্রম ভাঙা, এই সবকিছু Packet এর গল্প, Lesson 04।",
  },
  {
    stage: "সমুদ্রের তার আর Router Hop পেরিয়ে Packet সার্ভারে যায়",
    options: [
      "Lesson 05, ডেটা কীভাবে যায়",
      "Lesson 03, Port",
      "Lesson 02, ISP",
    ],
    answer: 0,
    why: "শারীরিক পথ, মাধ্যম বদল, Router Hop, TTL, এই পুরোটা Lesson 05।",
  },
  {
    stage: "কেউ পুরো Internet এর মালিক নয়, তবু সব জোড়া লাগানো",
    options: ["Lesson 04, Latency", "Lesson 01, Internet কী", "Lesson 05, Hop"],
    answer: 1,
    why: "নেটওয়ার্কের নেটওয়ার্ক, কারো মালিকানায় নয়, এটাই ছিল Lesson 01 এর মূল কথা।",
  },
];

export function NarrateItLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<number, number>>({});

  const q = QUIZ[i];
  const pick = picks[i];
  const answered = pick !== undefined;
  const correct = answered && pick === q.answer;
  const score = Object.entries(picks).filter(
    ([k, v]) => QUIZ[Number(k)].answer === v,
  ).length;

  const choose = (idx: number) => {
    if (answered) return;
    setPicks((p) => ({ ...p, [i]: idx }));
  };

  return (
    <Panel
      label="Interactive"
      title="কোন ধাপ কোন লেসনের, নিজে বলুন"
      footer="এই মডিউলটা যদি সত্যিই বসে থাকে, তাহলে যাত্রার যেকোনো ধাপ শুনে আপনি বলতে পারবেন সেটা কোন লেসনের গল্প। পাঁচটাই ঠিক হলে ধরে নিন Module 02 আপনার হাতের মুঠোয়। এবার Module 03 এ আমরা এই যাত্রার সেই অংশগুলোতে ঢুকব যেগুলো এতক্ষণ ধরে নিয়েছিলাম, বিশেষ করে ঠিকানা আসলে কীভাবে কাজ করে।"
    >
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          প্রশ্ন {toBn(i + 1)} / {toBn(QUIZ.length)}
        </span>
        <span
          className="font-mono text-[10px] text-muted-foreground"
          data-score={score}
        >
          ঠিক <span className="text-primary font-bold">{toBn(score)}</span> /{" "}
          {toBn(Object.keys(picks).length)}
        </span>
      </div>

      <div className="border border-border bg-background p-4 mb-4">
        <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
          যাত্রার এই ধাপটা
        </div>
        <div className="text-base text-foreground">{q.stage}</div>
      </div>

      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          const isPick = pick === idx;
          const isAns = answered && idx === q.answer;
          return (
            <button
              key={opt}
              onClick={() => choose(idx)}
              disabled={answered}
              data-option={idx}
              className={cn(
                "w-full text-left px-4 py-3 border font-mono text-[12px] transition-colors",
                !answered &&
                  "hover:border-primary/50 hover:bg-primary/5 cursor-pointer border-border",
                answered && isAns && "border-accent bg-accent/10 text-accent",
                answered && !isAns && isPick && "border-primary bg-primary/10",
                answered && !isAns && !isPick && "border-border opacity-50",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          data-result={correct ? "correct" : "wrong"}
          className={cn(
            "mt-4 p-4 border text-sm leading-relaxed",
            correct
              ? "border-accent/50 bg-accent/5 text-foreground"
              : "border-primary/50 bg-primary/5 text-foreground",
          )}
        >
          <span
            className={cn(
              "font-mono text-[9px] font-bold uppercase tracking-[0.15em] block mb-1",
              correct ? "text-accent" : "text-primary",
            )}
          >
            {correct ? "ঠিক" : "আসলে"}
          </span>
          {q.why}
        </motion.div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setI((v) => (v + 1) % QUIZ.length)}
          disabled={!answered}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 border font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
            answered
              ? "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
              : "border-border text-muted-foreground/40",
          )}
        >
          <SkipForward className="w-3 h-3" />
          {i === QUIZ.length - 1 ? "প্রথম থেকে" : "পরের প্রশ্ন"}
        </button>
        <button
          onClick={() => {
            setPicks({});
            setI(0);
          }}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </Panel>
  );
}
