"use client";

import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
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

const BTN = "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left";
const BTN_ON = "border-primary bg-primary/10 text-primary";
const BTN_OFF =
  "border-border text-muted-foreground hover:text-foreground hover:border-primary/40";

/* ------------------------------------------------------------------------- */
/* 1. search_path ধরে একটা নাম খোঁজা                                           */
/* ------------------------------------------------------------------------- */

/** What each schema holds in this lesson's island_tours. "$user" means a schema named postgres. */
const SCHEMAS: Record<string, string[]> = {
  public: ["tours", "bookings", "customers", "departures", "destinations", "guides", "payments", "reviews"],
  analytics: ["tours", "daily_revenue"],
  audit: ["audit_log"],
};

const PATHS = [
  { id: "default", label: '"$user", public', schemas: ["$user", "public"] },
  { id: "analytics-first", label: "analytics, public", schemas: ["analytics", "public"] },
  { id: "public-first", label: "public, analytics", schemas: ["public", "analytics"] },
  { id: "audit-only", label: "audit", schemas: ["audit"] },
];

const NAMES = ["tours", "bookings", "daily_revenue", "audit_log", "public.tours"];

type Step = { schema: string; verdict: "missing-schema" | "no-table" | "found" | "unseen" };

function lookUp(name: string, path: string[]) {
  // A qualified name skips the search entirely.
  if (name.includes(".")) {
    const [schema, table] = name.split(".");
    const found = SCHEMAS[schema]?.includes(table) ?? false;
    return {
      steps: [] as Step[],
      found: found ? name : null,
      qualified: true,
      createsIn: path.find((s) => s !== "$user") ?? null,
    };
  }
  const steps: Step[] = [];
  let found: string | null = null;
  for (const schema of path) {
    if (found) {
      steps.push({ schema, verdict: "unseen" });
      continue;
    }
    if (schema === "$user") {
      steps.push({ schema, verdict: "missing-schema" });
      continue;
    }
    if (SCHEMAS[schema].includes(name)) {
      steps.push({ schema, verdict: "found" });
      found = `${schema}.${name}`;
    } else {
      steps.push({ schema, verdict: "no-table" });
    }
  }
  return {
    steps,
    found,
    qualified: false,
    createsIn: path.find((s) => s !== "$user") ?? null,
  };
}

const VERDICT_TEXT: Record<Step["verdict"], string> = {
  "missing-schema": "postgres নামে কোনো Schema নেই, তাই বাদ",
  "no-table": "এই Schema আছে, কিন্তু এই নামের Table নেই, পরেরটায় যাই",
  found: "পাওয়া গেছে, খোঁজা এখানেই শেষ",
  unseen: "আগেই পাওয়া গেছে, এখানে আর দেখাই হলো না",
};

export function SearchPathLab() {
  const reduce = useReducedMotion();
  const [pathId, setPathId] = useState("default");
  const [name, setName] = useState("tours");
  const path = PATHS.find((p) => p.id === pathId) ?? PATHS[0];
  const result = lookUp(name, path.schemas);

  return (
    <Panel
      label="Interactive"
      title="search_path বদলান, দেখুন কোন Table পাওয়া যায়"
      footer={
        <>
          বাম দিকে search_path বাছুন, ডান দিকে Query তে কোন নাম লিখছেন সেটা বাছুন। এই
          লেসনের island_tours এ public এ আটটা Table, analytics এ tours আর
          daily_revenue, আর audit এ audit_log আছে। public.tours এর মতো পুরো নাম
          লিখলে search_path কোনো কাজেই লাগে না।
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            SET search_path TO ...
          </p>
          <div className="flex flex-wrap gap-2">
            {PATHS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-path={p.id}
                aria-pressed={p.id === pathId}
                onClick={() => setPathId(p.id)}
                className={cn(BTN, "font-mono", p.id === pathId ? BTN_ON : BTN_OFF)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            SELECT * FROM ...
          </p>
          <div className="flex flex-wrap gap-2">
            {NAMES.map((n) => (
              <button
                key={n}
                type="button"
                data-name={n}
                aria-pressed={n === name}
                onClick={() => setName(n)}
                className={cn(BTN, "font-mono", n === name ? BTN_ON : BTN_OFF)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        key={`${pathId}:${name}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="mt-8"
        data-result={result.found ?? "error"}
      >
        <p className="mb-4 font-mono text-[0.8125rem] text-foreground">
          SELECT * FROM {name};
        </p>
        {result.qualified ? (
          <p className="border border-border bg-background p-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
            পুরো নাম দেওয়া আছে, Schema সহ। PostgreSQL সোজা সেই Schema তে যায়,
            search_path এর তালিকা একবারও দেখে না।
          </p>
        ) : (
          <ol className="space-y-2">
            {result.steps.map((step, i) => (
              <li
                key={step.schema}
                className={cn(
                  "flex flex-wrap items-baseline gap-x-3 gap-y-1 border px-4 py-2.5 text-[0.8125rem]",
                  step.verdict === "found"
                    ? "border-primary/60 bg-primary/5 text-foreground"
                    : "border-border bg-background text-muted-foreground",
                  step.verdict === "unseen" && "opacity-50",
                )}
              >
                <span className="font-mono text-[0.6875rem] font-bold">
                  {i + 1}. {step.schema}
                </span>
                <span>{VERDICT_TEXT[step.verdict]}</span>
              </li>
            ))}
          </ol>
        )}

        <div
          className={cn(
            "mt-5 border px-4 py-3 font-mono text-[0.75rem] leading-relaxed",
            result.found
              ? "border-primary/50 bg-primary/5 text-foreground"
              : "border-destructive/40 bg-destructive/5 text-destructive",
          )}
        >
          {result.found
            ? `পড়া হবে: ${result.found}`
            : `ERROR:  relation "${name}" does not exist`}
        </div>
        {!result.found && !result.qualified && (
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
            Table টা Database এ আছে, কিন্তু search_path এর কোনো Schema তে নেই।
            PostgreSQL এর কাছে তখন সেটা না থাকার মতোই। পুরো নাম লিখুন, অথবা
            search_path এ ঠিক Schema টা যোগ করুন।
          </p>
        )}
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
          এই search_path এ Schema না লিখে CREATE TABLE করলে নতুন Table তৈরি হবে{" "}
          <span className="font-mono text-foreground">{result.createsIn ?? "কোথাও না"}</span>{" "}
          Schema তে, মানে তালিকার প্রথম যে Schema সত্যিই আছে।
        </p>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. নতুন জিনিসটা কোথায় রাখবেন                                               */
/* ------------------------------------------------------------------------- */

type Level = "table" | "schema" | "database" | "server";

const LEVELS: { id: Level; label: string }[] = [
  { id: "table", label: "নতুন Table" },
  { id: "schema", label: "নতুন Schema" },
  { id: "database", label: "নতুন Database" },
  { id: "server", label: "নতুন Server" },
];

type Case = { id: string; situation: string; answer: Level; why: string };

const CASES: Case[] = [
  {
    id: "wishlist",
    situation:
      "Island Tours এর Website এ নতুন Feature: Customer পছন্দের ট্যুর Wishlist এ রাখতে পারবেন। Data টা customers আর tours এর সাথে সরাসরি জোড়া।",
    answer: "table",
    why: "একই অ্যাপের নতুন একটা জিনিস, যেটা বাকি Table গুলোর সাথে Foreign Key দিয়ে জোড়া থাকবে। public Schema তে একটা নতুন Table, wishlist_items, সবচেয়ে সহজ আর সঠিক।",
  },
  {
    id: "reports",
    situation:
      "হিসাব বিভাগ মাস শেষের Report এর জন্য কয়েকটা হিসাব করা Table চায়: দৈনিক আয়, মাসিক বুকিং। তাঁরা App এর Table এ হাত দেবেন না, শুধু নিজেদের Table পড়বেন।",
    answer: "schema",
    why: "Report এর Table গুলো একই Data থেকে তৈরি, তাই একই Database এ থাকা দরকার, যাতে Join করা যায়। কিন্তু App এর Table থেকে আলাদা গুছিয়ে রাখতে আর আলাদা Permission দিতে analytics নামে একটা Schema সবচেয়ে মানানসই।",
  },
  {
    id: "audit",
    situation:
      "কে কখন কোন Booking বদলেছেন, তার পুরো ইতিহাস রাখতে হবে। App এর সাধারণ Role যেন এই ইতিহাস মুছতে না পারে।",
    answer: "schema",
    why: "audit নামে আলাদা Schema রাখলে App এর Role কে সেখানে শুধু লেখার অনুমতি দেওয়া যায়, মোছার না। ইতিহাস একই Database এ থাকায় Booking এর সাথে মিলিয়ে দেখাও সহজ।",
  },
  {
    id: "tests",
    situation:
      "Developer রা Test চালান, যেটা প্রতিবার সব Table খালি করে নতুন Data ঢোকায়। আসল Booking এর গায়ে যেন কোনোভাবেই আঁচড় না লাগে।",
    answer: "database",
    why: "island_tours_test নামে আলাদা Database। Test এর Connection অন্য Database এ যায়, তাই আসল Data এর Table দেখতেও পায় না। ভুল করে আসল Data মুছে ফেলার সুযোগই থাকে না।",
  },
  {
    id: "my-tours",
    situation:
      "আপনি নিজের শেখার অ্যাপ my_tours বানাচ্ছেন। এর Table গুলোর Island Tours এর Table এর সাথে কোনো সম্পর্ক নেই, কিন্তু একই PostgreSQL এ চালালেই চলে।",
    answer: "database",
    why: "আলাদা অ্যাপ মানে আলাদা Database। একই Server এ থাকলেও my_tours আর island_tours একে অপরকে দেখে না, আর একটা মুছলে অন্যটার কিছু হয় না।",
  },
  {
    id: "partner",
    situation:
      "একটা সম্পূর্ণ অন্য কোম্পানি, Seagull Tours, তাদের Data রাখতে চায়। তাদের আলাদা Backup সময়, আলাদা Admin, আর চুক্তি অনুযায়ী তাদের Data অন্য কারো মেশিনে থাকতে পারবে না।",
    answer: "server",
    why: "Role আর Backup পুরো Server এর স্তরে চলে, আর Admin পুরো Server দেখতে পান। যখন Admin, Backup বা মেশিনই আলাদা হতে হবে, তখন আলাদা Server, মানে আলাদা Cluster।",
  },
];

export function WhereToPutLab() {
  const [caseId, setCaseId] = useState(CASES[0].id);
  const [picks, setPicks] = useState<Record<string, Level>>({});
  const current = CASES.find((c) => c.id === caseId) ?? CASES[0];
  const picked = picks[current.id];
  const correct = Object.entries(picks).filter(
    ([id, level]) => CASES.find((c) => c.id === id)?.answer === level,
  ).length;

  return (
    <Panel
      label="Interactive"
      title="নতুন জিনিসটা কোন স্তরে রাখবেন"
      footer={
        <>
          প্রতিটা পরিস্থিতির জন্য একটা স্তর বাছুন। নিয়মটা মোটামুটি এরকম: একসাথে
          Join লাগলে একই Database, আলাদা করে গোছানো বা আলাদা Permission লাগলে
          Schema, পুরো আলাদা অ্যাপ হলে Database, আর আলাদা Admin বা Backup লাগলে
          Server।
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {CASES.map((c, i) => (
          <button
            key={c.id}
            type="button"
            data-case={c.id}
            aria-pressed={c.id === caseId}
            onClick={() => setCaseId(c.id)}
            className={cn(BTN, c.id === caseId ? BTN_ON : BTN_OFF)}
          >
            পরিস্থিতি {i + 1}
            {picks[c.id] && (picks[c.id] === c.answer ? " ✓" : " ✗")}
          </button>
        ))}
      </div>

      <p className="text-sm md:text-base leading-relaxed text-foreground mb-5">
        {current.situation}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
        {LEVELS.map((level) => {
          const chosen = picked === level.id;
          const right = level.id === current.answer;
          return (
            <button
              key={level.id}
              type="button"
              data-level={level.id}
              onClick={() => setPicks((prev) => ({ ...prev, [current.id]: level.id }))}
              className={cn(
                "px-3 py-3 border text-[0.8125rem] font-bold transition-colors",
                picked
                  ? right
                    ? "border-primary bg-primary/10 text-primary"
                    : chosen
                      ? "border-destructive/50 bg-destructive/5 text-destructive"
                      : "border-border text-muted-foreground"
                  : "border-border text-foreground hover:border-primary/50",
              )}
            >
              {level.label}
            </button>
          );
        })}
      </div>

      {picked && (
        <div
          data-verdict={picked === current.answer ? "right" : "wrong"}
          className={cn(
            "border px-4 py-3 text-[0.8125rem] leading-relaxed",
            picked === current.answer
              ? "border-primary/50 bg-primary/5 text-foreground"
              : "border-border bg-background text-muted-foreground",
          )}
        >
          <strong className="text-foreground">
            {picked === current.answer ? "ঠিক বেছেছেন। " : "এখানে আরও মানানসই একটা স্তর আছে। "}
          </strong>
          {current.why}
        </div>
      )}

      <p className="mt-5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
        {Object.keys(picks).length} of {CASES.length} answered, {correct} right
      </p>
    </Panel>
  );
}
