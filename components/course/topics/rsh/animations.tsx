"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw, Send } from "lucide-react";
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
/* 1. Hub সবাইকে, Switch শুধু একজনকে                                            */
/* ------------------------------------------------------------------------- */

const DEVICES = ["A", "B", "C", "D"] as const;
type Dev = (typeof DEVICES)[number];

export function HubVsSwitchLab() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"hub" | "switch">("switch");
  const [target, setTarget] = useState<Dev>("C");
  const [sent, setSent] = useState(false);

  const from: Dev = "A";
  const recipients: Dev[] =
    mode === "hub" ? DEVICES.filter((d) => d !== from) : [target];
  const wasted =
    mode === "hub" ? DEVICES.filter((d) => d !== from && d !== target) : [];

  return (
    <Panel
      label="Interactive"
      title="A থেকে চিঠি, কে কে পায়"
      footer="একই চিঠি, A থেকে শুধু গন্তব্যের জন্য। Hub মোডে সেটা বাকি সবাই পায়, কারণ Hub মনে রাখে না কে কোথায়, তাই সে সবাইকে চেঁচিয়ে শোনায়। এতে অকারণ ভিড় হয়, আর গোপন কথাও সবাই শুনে ফেলে। Switch মোডে শুধু গন্তব্যই পায়, কারণ Switch একটা টেবিলে মনে রাখে কে কোন তারে বসে। এই কারণেই আজ সব LAN এ Switch, আর Hub জাদুঘরে। Switch কীভাবে মনে রাখে, সেই টেবিলের চাবি হলো MAC Address, যেটা পরের লেসন।"
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-2">
          {(["hub", "switch"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setSent(false);
              }}
              data-mode={m}
              data-active={mode === m ? "true" : "false"}
              className={cn(
                "px-4 py-2 border font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors",
                mode === m
                  ? m === "hub"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "hub" ? "HUB, বোকা" : "SWITCH, চালাক"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            গন্তব্য
          </span>
          {DEVICES.filter((d) => d !== from).map((d) => (
            <button
              key={d}
              onClick={() => {
                setTarget(d);
                setSent(false);
              }}
              data-target={d}
              className={cn(
                "w-8 h-8 border font-mono text-[11px] font-bold transition-colors",
                target === d
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* the box + devices */}
      <div className="border border-border bg-background p-6">
        <div
          className={cn(
            "mx-auto mb-6 w-32 py-2 border text-center font-mono text-[11px] font-bold uppercase tracking-[0.15em]",
            mode === "hub"
              ? "border-primary text-primary bg-primary/5"
              : "border-accent text-accent bg-accent/5",
          )}
        >
          {mode === "hub" ? "HUB" : "SWITCH"}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {DEVICES.map((d) => {
            const isFrom = d === from;
            const got = sent && recipients.includes(d);
            const wastedHit = sent && wasted.includes(d);
            return (
              <div
                key={d}
                data-device={d}
                data-got={got ? "true" : "false"}
                data-wasted={wastedHit ? "true" : "false"}
                className={cn(
                  "p-3 border text-center transition-colors duration-300",
                  isFrom
                    ? "border-foreground/40 bg-muted/30"
                    : got
                      ? "border-accent bg-accent/15"
                      : wastedHit
                        ? "border-primary bg-primary/10"
                        : "border-border",
                )}
              >
                <div
                  className={cn(
                    "font-mono text-lg font-bold",
                    isFrom
                      ? "text-foreground"
                      : got
                        ? "text-accent"
                        : wastedHit
                          ? "text-primary"
                          : "text-muted-foreground/50",
                  )}
                >
                  {d}
                </div>
                <div className="font-mono text-[8px] text-muted-foreground mt-1">
                  {isFrom
                    ? "পাঠাল"
                    : got
                      ? "পেল, দরকারি"
                      : wastedHit
                        ? "পেল, অকারণ"
                        : sent
                          ? "কিছুই না"
                          : "অপেক্ষায়"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setSent(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors"
        >
          <Send className="w-3 h-3" />A থেকে {target} কে পাঠান
        </button>
        <button
          onClick={() => setSent(false)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        {sent && (
          <motion.span
            key={`${mode}-${target}`}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="font-mono text-[11px] text-muted-foreground"
          >
            পেল{" "}
            <span
              className="text-accent font-bold"
              data-received={recipients.length}
            >
              {toBn(recipients.length)}
            </span>{" "}
            জন, অকারণ{" "}
            <span
              className={cn(
                "font-bold",
                wasted.length ? "text-primary" : "text-muted-foreground",
              )}
              data-wasted-count={wasted.length}
            >
              {toBn(wasted.length)}
            </span>{" "}
            জন
          </motion.span>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন কাজে কোন বাক্স                                                        */
/* ------------------------------------------------------------------------- */

type Q = { task: string; answer: "hub" | "switch" | "router"; why: string };

const QUIZ: Q[] = [
  {
    task: "অফিসে দশটা তারের কম্পিউটার একে অন্যের সাথে জোড়া লাগাতে হবে, একই ঘরে।",
    answer: "switch",
    why: "একই LAN এর ভেতরে যন্ত্র জোড়া, আর প্রত্যেককে শুধু তার চিঠি দেওয়া, এটাই Switch এর কাজ। Hub পুরনো, সবাইকে চেঁচিয়ে শোনাত।",
  },
  {
    task: "আপনার বাসার LAN কে ISP এর মাধ্যমে Internet এর সাথে জোড়া লাগাতে হবে।",
    answer: "router",
    why: "দুইটা আলাদা Network জোড়া, মানে আপনার LAN আর বাইরের WAN, এটাই Router এর কাজ। Lesson 01 এর সেই এক দরজা।",
  },
  {
    task: "একটা Datacenter এ একই Rack এর সার্ভারগুলো নিজেদের মধ্যে দ্রুত কথা বলবে।",
    answer: "switch",
    why: "একই LAN, ভেতরের যন্ত্র জোড়া। Datacenter এ Switch ই সার্ভারগুলোকে জোড়ে, আর প্রত্যেককে ঠিক তার চিঠি দেয়।",
  },
  {
    task: "১৯৯০ এর দশকের একটা পুরনো Network, যেখানে সব যন্ত্র একে অন্যের সব চিঠি শুনে ফেলত।",
    answer: "hub",
    why: "সবাই সবার চিঠি শোনা মানেই Hub। এটা মনে রাখত না কে কোথায়, তাই সবাইকে কপি করত। আজ আর ব্যবহার হয় না।",
  },
  {
    task: "দুইটা আলাদা অফিসের LAN, দুই শহরে, একে অন্যের সাথে যুক্ত করতে হবে।",
    answer: "router",
    why: "আলাদা Network জোড়া, এমনকি আলাদা শহরে, এটাই Router। Switch শুধু এক LAN এর ভেতরে কাজ করে, Network পার হতে পারে না।",
  },
];

export function WhichBoxLab() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<number, string>>({});

  const q = QUIZ[i];
  const pick = picks[i];
  const answered = pick !== undefined;
  const correct = answered && pick === q.answer;
  const score = Object.entries(picks).filter(
    ([k, v]) => QUIZ[Number(k)].answer === v,
  ).length;

  const OPTIONS: { key: "hub" | "switch" | "router"; label: string }[] = [
    { key: "hub", label: "HUB" },
    { key: "switch", label: "SWITCH" },
    { key: "router", label: "ROUTER" },
  ];

  const choose = (k: string) => {
    if (answered) return;
    setPicks((p) => ({ ...p, [i]: k }));
  };

  return (
    <Panel
      label="Interactive"
      title="কাজটা শুনে বলুন, কোন বাক্স"
      footer="নিয়মটা এক লাইনে মনে রাখুন। একই LAN এর ভেতরে যন্ত্র জোড়া, আর প্রত্যেককে ঠিক তার চিঠি, মানে Switch। দুইটা আলাদা Network জোড়া, বিশেষ করে LAN থেকে বাইরে, মানে Router। আর সবাইকে সব চিঠি শোনানো, মানে সেকেলে Hub, যেটা আজ আর কেউ ব্যবহার করে না। ভেতরে জোড়া Switch, বাইরে জোড়া Router, এই দুইটা গেঁথে নিলেই যথেষ্ট।"
    >
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          কাজ {toBn(i + 1)} / {toBn(QUIZ.length)}
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
          এই কাজটার জন্য
        </div>
        <div className="text-base text-foreground leading-relaxed">
          {q.task}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((o) => {
          const isPick = pick === o.key;
          const isAns = answered && o.key === q.answer;
          return (
            <button
              key={o.key}
              onClick={() => choose(o.key)}
              disabled={answered}
              data-option={o.key}
              className={cn(
                "px-4 py-3 border font-mono text-[11px] font-bold uppercase tracking-[0.1em] transition-colors",
                !answered &&
                  "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
                answered && isAns && "border-accent bg-accent/10 text-accent",
                answered &&
                  !isAns &&
                  isPick &&
                  "border-primary bg-primary/10 text-primary",
                answered && !isAns && !isPick && "border-border opacity-50",
              )}
            >
              {o.label}
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
            {correct ? "ঠিক" : "আসলে"} {q.answer.toUpperCase()}
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
          {i === QUIZ.length - 1 ? "প্রথম থেকে" : "পরের কাজ"}
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
