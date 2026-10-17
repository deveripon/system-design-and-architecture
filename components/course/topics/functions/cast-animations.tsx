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
/* 1. একটা লেখা নিন, একটা Type বাছুন: PostgreSQL কী বলে, MySQL কী বলে              */
/* ------------------------------------------------------------------------- */

const INPUTS = ["42", " 42 ", "42.7", "12,500", "abc", "2026-11-01", "01/11/2026", "yes", ""] as const;
type Input = (typeof INPUTS)[number];
const TARGETS = ["integer", "numeric", "date", "boolean"] as const;
type Target = (typeof TARGETS)[number];

type Outcome = { ok: true; value: string; note?: string } | { ok: false; error: string; code: string; note?: string };

/** PostgreSQL 18 answers, each one run as SELECT '<input>'::<target>. */
const PG: Record<Input, Record<Target, Outcome>> = {
  "42": {
    integer: { ok: true, value: "42" },
    numeric: { ok: true, value: "42" },
    date: { ok: false, error: 'date/time field value out of range: "42"', code: "22008" },
    boolean: { ok: false, error: 'invalid input syntax for type boolean: "42"', code: "22P02" },
  },
  " 42 ": {
    integer: { ok: true, value: "42", note: "দুই পাশের ফাঁকা জায়গা সংখ্যা পড়ার সময় বাদ পড়ে।" },
    numeric: { ok: true, value: "42", note: "দুই পাশের ফাঁকা জায়গা সংখ্যা পড়ার সময় বাদ পড়ে।" },
    date: { ok: false, error: 'date/time field value out of range: " 42 "', code: "22008" },
    boolean: { ok: false, error: 'invalid input syntax for type boolean: " 42 "', code: "22P02" },
  },
  "42.7": {
    integer: {
      ok: false,
      error: 'invalid input syntax for type integer: "42.7"',
      code: "22P02",
      note: "লেখা থেকে integer এ দশমিক চলে না। আগে numeric, তারপর integer: '42.7'::numeric::integer দেয় 43।",
    },
    numeric: { ok: true, value: "42.7" },
    date: { ok: false, error: 'invalid input syntax for type date: "42.7"', code: "22007" },
    boolean: { ok: false, error: 'invalid input syntax for type boolean: "42.7"', code: "22P02" },
  },
  "12,500": {
    integer: {
      ok: false,
      error: 'invalid input syntax for type integer: "12,500"',
      code: "22P02",
      note: "কমা সংখ্যার অংশ না। replace('12,500', ',', '')::integer দেয় 12500।",
    },
    numeric: {
      ok: false,
      error: 'invalid input syntax for type numeric: "12,500"',
      code: "22P02",
      note: "to_number('12,500', '99,999') দেয় 12500।",
    },
    date: { ok: false, error: 'date/time field value out of range: "12,500"', code: "22008" },
    boolean: { ok: false, error: 'invalid input syntax for type boolean: "12,500"', code: "22P02" },
  },
  abc: {
    integer: { ok: false, error: 'invalid input syntax for type integer: "abc"', code: "22P02" },
    numeric: { ok: false, error: 'invalid input syntax for type numeric: "abc"', code: "22P02" },
    date: { ok: false, error: 'invalid input syntax for type date: "abc"', code: "22007" },
    boolean: { ok: false, error: 'invalid input syntax for type boolean: "abc"', code: "22P02" },
  },
  "2026-11-01": {
    integer: { ok: false, error: 'invalid input syntax for type integer: "2026-11-01"', code: "22P02" },
    numeric: { ok: false, error: 'invalid input syntax for type numeric: "2026-11-01"', code: "22P02" },
    date: { ok: true, value: "2026-11-01", note: "বছর-মাস-দিন: সবচেয়ে নিরাপদ লেখা, কোনো Setting এ গুলিয়ে যায় না।" },
    boolean: { ok: false, error: 'invalid input syntax for type boolean: "2026-11-01"', code: "22P02" },
  },
  "01/11/2026": {
    integer: { ok: false, error: 'invalid input syntax for type integer: "01/11/2026"', code: "22P02" },
    numeric: { ok: false, error: 'invalid input syntax for type numeric: "01/11/2026"', code: "22P02" },
    date: {
      ok: true,
      value: "2026-01-11",
      note: "সাবধান! DateStyle MDY বলে প্রথমটা মাস: এটা ১১ জানুয়ারি, ১ নভেম্বর না। Error নেই, শুধু ভুল তারিখ।",
    },
    boolean: { ok: false, error: 'invalid input syntax for type boolean: "01/11/2026"', code: "22P02" },
  },
  yes: {
    integer: { ok: false, error: 'invalid input syntax for type integer: "yes"', code: "22P02" },
    numeric: { ok: false, error: 'invalid input syntax for type numeric: "yes"', code: "22P02" },
    date: { ok: false, error: 'invalid input syntax for type date: "yes"', code: "22007" },
    boolean: { ok: true, value: "t", note: "yes, y, on, true, t, 1 সবই true বোঝায়।" },
  },
  "": {
    integer: { ok: false, error: 'invalid input syntax for type integer: ""', code: "22P02", note: "খালি লেখা শূন্য না, NULL ও না। আগে NULLIF('', '') দিয়ে NULL বানাতে হয় (Lesson 05)।" },
    numeric: { ok: false, error: 'invalid input syntax for type numeric: ""', code: "22P02" },
    date: { ok: false, error: 'invalid input syntax for type date: ""', code: "22007" },
    boolean: { ok: false, error: 'invalid input syntax for type boolean: ""', code: "22P02" },
  },
};

/** MySQL 8.4.11 answers for CAST('<input>' AS SIGNED / DECIMAL(10,2) / DATE). */
const MYSQL_TARGET: Record<Target, string | null> = {
  integer: "SIGNED",
  numeric: "DECIMAL(10,2)",
  date: "DATE",
  boolean: null,
};

type MysqlOutcome = { value: string; warning?: string };

const MYSQL: Record<Input, Record<Exclude<Target, "boolean">, MysqlOutcome>> = {
  "42": {
    integer: { value: "42" },
    numeric: { value: "42.00" },
    date: { value: "NULL", warning: "Incorrect datetime value: '42'" },
  },
  " 42 ": {
    integer: { value: "42" },
    numeric: { value: "42.00" },
    date: { value: "NULL", warning: "Incorrect datetime value: ' 42 '" },
  },
  "42.7": {
    integer: { value: "42", warning: "Truncated incorrect INTEGER value: '42.7'" },
    numeric: { value: "42.70" },
    date: { value: "NULL", warning: "Incorrect datetime value: '42.7'" },
  },
  "12,500": {
    integer: { value: "12", warning: "Truncated incorrect INTEGER value: '12,500'" },
    numeric: { value: "12.00", warning: "Truncated incorrect DECIMAL value: '12,500'" },
    date: { value: "NULL", warning: "Incorrect datetime value: '12,500'" },
  },
  abc: {
    integer: { value: "0", warning: "Truncated incorrect INTEGER value: 'abc'" },
    numeric: { value: "0.00", warning: "Truncated incorrect DECIMAL value: 'abc'" },
    date: { value: "NULL", warning: "Incorrect datetime value: 'abc'" },
  },
  "2026-11-01": {
    integer: { value: "2026", warning: "Truncated incorrect INTEGER value: '2026-11-01'" },
    numeric: { value: "2026.00", warning: "Truncated incorrect DECIMAL value: '2026-11-01'" },
    date: { value: "2026-11-01" },
  },
  "01/11/2026": {
    integer: { value: "1", warning: "Truncated incorrect INTEGER value: '01/11/2026'" },
    numeric: { value: "1.00", warning: "Truncated incorrect DECIMAL value: '01/11/2026'" },
    date: { value: "NULL", warning: "Incorrect datetime value: '01/11/2026'" },
  },
  yes: {
    integer: { value: "0", warning: "Truncated incorrect INTEGER value: 'yes'" },
    numeric: { value: "0.00", warning: "Truncated incorrect DECIMAL value: 'yes'" },
    date: { value: "NULL", warning: "Incorrect datetime value: 'yes'" },
  },
  "": {
    integer: { value: "0", warning: "Truncated incorrect INTEGER value: ''" },
    numeric: { value: "0.00", warning: "Truncated incorrect DECIMAL value: ''" },
    date: { value: "NULL", warning: "Incorrect datetime value: ''" },
  },
};

const PG_SUCCESSES = INPUTS.reduce(
  (sum, input) => sum + TARGETS.filter((target) => PG[input][target].ok).length,
  0,
);

const show = (input: Input) => (input === "" ? "(খালি)" : input.replace(/ /g, "␣"));

export function CastLab() {
  const reduce = useReducedMotion();
  const [input, setInput] = useState<Input>("42.7");
  const [target, setTarget] = useState<Target>("integer");
  const [engine, setEngine] = useState<"postgres" | "mysql">("postgres");

  const literal = `'${input}'`;
  const mysqlTarget = MYSQL_TARGET[target];
  const sql =
    engine === "postgres"
      ? `SELECT ${literal}::${target};`
      : mysqlTarget
        ? `SELECT CAST(${literal} AS ${mysqlTarget});`
        : "-- MySQL এ boolean নামে আলাদা Type নেই";
  const pg = PG[input][target];
  const my = target === "boolean" ? null : MYSQL[input][target];
  const verdict = engine === "postgres" ? (pg.ok ? "value" : "error") : my ? (my.warning ? "warning" : "value") : "none";

  return (
    <Panel
      label="Interactive"
      title="একটা লেখা, একটা Type: কী হয়?"
      footer="প্রতিটা উত্তর আসল Database এ চালিয়ে নেওয়া: PostgreSQL 18 এ SELECT 'লেখা'::type, আর MySQL 8.4.11 এ SELECT CAST('লেখা' AS ...)। ␣ চিহ্ন মানে ফাঁকা জায়গা।"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">লেখা</span>
          {INPUTS.map((value) => (
            <button
              key={value === "" ? "empty" : value}
              type="button"
              data-input={value === "" ? "empty" : value}
              aria-pressed={input === value}
              onClick={() => setInput(value)}
              className={cn(BTN, "font-mono", input === value ? BTN_ON : BTN_OFF)}
            >
              {show(value)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">Type</span>
          {TARGETS.map((value) => (
            <button
              key={value}
              type="button"
              data-target={value}
              aria-pressed={target === value}
              onClick={() => setTarget(value)}
              className={cn(BTN, "font-mono", target === value ? BTN_ON : BTN_OFF)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">Database</span>
          {(["postgres", "mysql"] as const).map((value) => (
            <button
              key={value}
              type="button"
              data-engine={value}
              aria-pressed={engine === value}
              onClick={() => setEngine(value)}
              className={cn(BTN, engine === value ? BTN_ON : BTN_OFF)}
            >
              {value === "postgres" ? "PostgreSQL 18" : "MySQL 8.4"}
            </button>
          ))}
        </div>

        <motion.div
          key={`${engine}-${input}-${target}`}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="border border-border bg-background"
          data-verdict={verdict}
        >
          <pre className="overflow-x-auto border-b border-border px-4 py-3 font-mono text-[0.8125rem] text-foreground">{sql}</pre>
          <div className="px-4 py-4 space-y-2">
            {engine === "postgres" &&
              (pg.ok ? (
                <p className="font-mono text-sm text-foreground">
                  ফলাফল: <span className="font-bold text-primary">{pg.value}</span>
                </p>
              ) : (
                <p className="font-mono text-[0.8125rem] text-destructive">
                  ERROR: {pg.error} <span className="text-muted-foreground">[{pg.code}]</span>
                </p>
              ))}
            {engine === "postgres" && pg.note && (
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{pg.note}</p>
            )}
            {engine === "mysql" && !my && (
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                MySQL এ boolean আসলে TINYINT(1), TRUE মানে 1 আর FALSE মানে 0। তাই CAST(... AS BOOLEAN) বলে কিছু নেই।
              </p>
            )}
            {engine === "mysql" && my && (
              <>
                <p className="font-mono text-sm text-foreground">
                  ফলাফল: <span className="font-bold text-primary">{my.value}</span>
                </p>
                {my.warning && (
                  <p className="font-mono text-[0.75rem] text-muted-foreground">
                    Warning (Code 1292): {my.warning}
                  </p>
                )}
                {my.warning && (
                  <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                    Error না, শুধু একটা Warning, যেটা আলাদা করে SHOW WARNINGS না চালালে চোখেই পড়ে না। Query টা একটা উত্তর ফেরত দিয়েছে, আর উত্তরটা ভুল হতে পারে।
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>
        <p className="font-mono text-[0.625rem] text-muted-foreground">
          {toBn(INPUTS.length)}টা লেখা × {toBn(TARGETS.length)}টা Type = {toBn(INPUTS.length * TARGETS.length)}টা চেষ্টা। PostgreSQL এ এর মধ্যে মাত্র {toBn(PG_SUCCESSES)}টা Cast সফল হয়, বাকি সব থামে Error দিয়ে।
        </p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. PostgreSQL একটা Expression এর Type কীভাবে ঠিক করে, ধাপে ধাপে                  */
/* ------------------------------------------------------------------------- */

type Case = {
  id: string;
  sql: string;
  steps: string[];
  result: string;
  ok: boolean;
  fix?: string;
};

const CASES: Case[] = [
  {
    id: "tour-id-text",
    sql: "WHERE tour_id = '3'",
    steps: [
      "বাঁদিকের tour_id একটা Column, তার Type জানা: integer।",
      "ডানদিকের '3' Quote এর ভেতরে, কিন্তু PostgreSQL এর কাছে সে এখনো কোনো Type পায়নি। তার Type হলো unknown।",
      "unknown লেখাকে PostgreSQL অন্য পাশের Type দেয়। '3' পড়া হয় integer হিসেবে, পাওয়া গেল 3।",
      "এখন integer = integer। তুলনা চলে।",
    ],
    result: "1 row: Sundarbans Mangrove Cruise",
    ok: true,
  },
  {
    id: "text-plus-one",
    sql: "SELECT '3' + 1",
    steps: [
      "ডানদিকের 1 একটা integer।",
      "বাঁদিকের '3' এর Type unknown।",
      "PostgreSQL unknown কে integer বানায়, কারণ অন্য পাশ integer। '3' পড়া হয় 3 হিসেবে।",
      "integer + integer = 4।",
    ],
    result: "4",
    ok: true,
  },
  {
    id: "decimal-text-plus-one",
    sql: "SELECT '3.5' + 1",
    steps: [
      "ডানদিকের 1 একটা integer, বাঁদিকের '3.5' unknown।",
      "আগের মতোই PostgreSQL ঠিক করে '3.5' কে integer হিসেবে পড়বে।",
      "কিন্তু 3.5 কোনো integer না। লেখাটা integer এর বৈধ লেখা না।",
    ],
    result: 'ERROR: invalid input syntax for type integer: "3.5" [22P02]',
    ok: false,
    fix: "'3.5'::numeric + 1 দেয় 4.5। নিজে Type বলে দিলে আর আন্দাজ লাগে না।",
  },
  {
    id: "phone-number",
    sql: "WHERE phone = 8801000000101",
    steps: [
      "phone Column এর Type text।",
      "8801000000101 Quote ছাড়া, তাই এটা একটা সংখ্যা। integer এ ধরে না বলে PostgreSQL তাকে bigint ধরে।",
      "text আর bigint তুলনার কোনো Operator নেই, আর এই দুইয়ের মধ্যে PostgreSQL নিজে থেকে বদলায় না।",
    ],
    result: "ERROR: operator does not exist: text = bigint [42883]",
    ok: false,
    fix: "phone = '+8801000000101'। Data তে ফোন নম্বর লেখা হিসেবে আছে, + সহ। 8801000000101::text লিখলে Error যায় কিন্তু + না থাকায় ০টা Row আসে।",
  },
  {
    id: "price-as-text",
    sql: "WHERE price_bdt::text = '12500'",
    steps: [
      "price_bdt numeric, মান 12500.00।",
      "::text মানে মানটাকে লেখায় বদলানো। numeric থেকে লেখা হয় হুবহু যেমন দেখায়: '12500.00'।",
      "এখন দুই পাশেই লেখা। লেখা মেলে অক্ষরে অক্ষরে: '12500.00' আর '12500' আলাদা।",
    ],
    result: "0 rows, কোনো Error ছাড়াই",
    ok: false,
    fix: "price_bdt = 12500 লিখুন, সংখ্যার সাথে সংখ্যা মেলান: 1 row, Saint Martin Island Escape।",
  },
  {
    id: "price-like",
    sql: "WHERE price_bdt LIKE '1%'",
    steps: [
      "LIKE লেখার জন্য বানানো। numeric এর উপর LIKE এর কোনো Operator নেই।",
      "numeric থেকে text এ PostgreSQL নিজে থেকে যায় না।",
    ],
    result: "ERROR: operator does not exist: numeric ~~ unknown [42883]",
    ok: false,
    fix: "price_bdt::text LIKE '1%' দেয় 4 rows: যাদের দাম 1 দিয়ে শুরু।",
  },
];

export function TypeResolverLab() {
  const reduce = useReducedMotion();
  const [caseId, setCaseId] = useState(CASES[0].id);
  const [step, setStep] = useState(0);
  const current = CASES.find((c) => c.id === caseId) ?? CASES[0];
  const finished = step >= current.steps.length;

  return (
    <Panel
      label="Step by Step"
      title="PostgreSQL কীভাবে Type ঠিক করে"
      footer="প্রতিটা ফলাফল আর Error এর লেখা PostgreSQL 18 এ চালিয়ে নেওয়া। Next চাপলে একটা করে ধাপ খোলে, শেষ ধাপের পরে আসে উত্তর।"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              data-case={c.id}
              aria-pressed={c.id === caseId}
              onClick={() => {
                setCaseId(c.id);
                setStep(0);
              }}
              className={cn(BTN, "font-mono", c.id === caseId ? BTN_ON : BTN_OFF)}
            >
              {c.sql}
            </button>
          ))}
        </div>

        <ol className="space-y-2" data-step={step}>
          {current.steps.map((text, i) => (
            <motion.li
              key={`${current.id}-${i}`}
              initial={false}
              animate={{ opacity: i < step ? 1 : 0.25 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
              className={cn(
                "flex gap-3 border px-4 py-2.5 text-sm leading-relaxed",
                i < step ? "border-primary/40 bg-primary/5" : "border-border",
              )}
            >
              <span className="font-mono text-[0.6875rem] font-bold text-primary pt-0.5">{toBn(i + 1)}</span>
              <span className={i < step ? "text-foreground" : "text-muted-foreground"}>
                {i < step ? text : "..."}
              </span>
            </motion.li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-action="next"
            disabled={finished}
            onClick={() => setStep((s) => Math.min(s + 1, current.steps.length))}
            className={cn(BTN, BTN_OFF, "disabled:opacity-40")}
          >
            Next
          </button>
          <button
            type="button"
            data-action="all"
            onClick={() => setStep(current.steps.length)}
            className={cn(BTN, BTN_OFF)}
          >
            সব দেখান
          </button>
          <button type="button" data-action="reset" onClick={() => setStep(0)} className={cn(BTN, BTN_OFF)}>
            আবার
          </button>
        </div>

        {finished && (
          <div
            className={cn(
              "border px-4 py-3 space-y-2",
              current.ok ? "border-primary/50 bg-primary/5" : "border-destructive/40 bg-destructive/5",
            )}
            data-result={current.ok ? "ok" : "problem"}
          >
            <p className={cn("font-mono text-[0.8125rem]", current.ok ? "text-foreground" : "text-destructive")}>
              {current.result}
            </p>
            {current.fix && <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">ঠিক করার উপায়: {current.fix}</p>}
          </div>
        )}
      </div>
    </Panel>
  );
}
