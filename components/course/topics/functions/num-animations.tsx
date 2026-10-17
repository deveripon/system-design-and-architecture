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
/* 1. একটা Expression বেছে নিন: PostgreSQL কী ফেরত দেয়, কোন Type এ             */
/* ------------------------------------------------------------------------- */

/** Every value and type here was printed by PostgreSQL 18 for exactly this expression. */
const EXPRESSIONS = [
  {
    id: "int-div",
    sql: "5 / 2",
    value: "2",
    type: "integer",
    trap: true,
    note: "দুই পাশেই integer, তাই integer ভাগ। দশমিকের পরের .5 কেটে ফেলা হলো, গোল করা হলো না।",
  },
  {
    id: "neg-div",
    sql: "-5 / 2",
    value: "-2",
    type: "integer",
    trap: true,
    note: "কাটা হয় শূন্যের দিকে: -2.5 থেকে -2, -3 না। ঋণাত্মক সংখ্যায় এটা floor এর সাথে মেলে না।",
  },
  {
    id: "mod",
    sql: "5 % 2",
    value: "1",
    type: "integer",
    note: "ভাগশেষ। integer ভাগের পরে যা পড়ে রইল। 5 = 2 × 2 + 1।",
  },
  {
    id: "numeric-literal",
    sql: "5.0 / 2",
    value: "2.5000000000000000",
    type: "numeric",
    note: "দশমিক বিন্দুসহ লেখা সংখ্যা numeric। এক পাশে numeric থাকলেই পুরো ভাগ numeric।",
  },
  {
    id: "cast",
    sql: "5::numeric / 2",
    value: "2.5000000000000000",
    type: "numeric",
    note: "Column এর ক্ষেত্রে এটাই আসল উপায়: একটা পাশকে ::numeric দিয়ে বদলে নেওয়া।",
  },
  {
    id: "float",
    sql: "5::float8 / 2",
    value: "2.5",
    type: "double precision",
    note: "double precision এ ভাগও ঠিক উত্তর দেয়। শুধু টাকার হিসাবে এটা নেওয়া হয় না, কারণ নিচে দেখবেন।",
  },
  {
    id: "smallint",
    sql: "max_seats / duration_days",
    value: "6",
    type: "smallint",
    trap: true,
    note: "Saint Martin Island Escape এর জন্য 20 / 3। দুটো Column ই smallint, তাই integer ভাগ। 6.67 না, 6।",
  },
  {
    id: "third",
    sql: "1 / 3.0",
    value: "0.33333333333333333333",
    type: "numeric",
    note: "এক তৃতীয়াংশ কোনো দশমিকেই শেষ হয় না, তাই numeric একটা নির্দিষ্ট সংখ্যক অঙ্কের পরে থামে।",
  },
  {
    id: "third-back",
    sql: "1.0 / 3 * 3",
    value: "0.99999999999999999999",
    type: "numeric",
    note: "যে কারণে উপরেরটা থেমেছিল, সেটাই এখানে ধরা পড়ল। আগে গুণ, পরে ভাগ লিখলে (1.0 * 3 / 3) উত্তর ঠিক 1।",
  },
  {
    id: "float-sum",
    sql: "0.1::float8 + 0.2::float8",
    value: "0.30000000000000004",
    type: "double precision",
    trap: true,
    note: "Binary তে 0.1 হুবহু লেখা যায় না। তাই যোগফলের শেষে একটা ছোট্ট গরমিল। numeric এ একই যোগ ঠিক 0.3।",
  },
  {
    id: "power",
    sql: "2 ^ 3 ^ 2",
    value: "64",
    type: "double precision",
    note: "PostgreSQL এ ^ বাঁ থেকে ডানে: (2 ^ 3) ^ 2 = 64। অঙ্ক বইয়ের নিয়মে হতো 2 ^ 9 = 512।",
  },
  {
    id: "div-fn",
    sql: "div(7, 2)",
    value: "3",
    type: "numeric",
    note: "ইচ্ছা করে ভাগফল চাইলে div() নাম দিয়ে পরিষ্কার করে বলুন। পরে যে পড়বে সে বুঝবে এটা ভুল না, সিদ্ধান্ত।",
  },
] as const;

export function ExpressionLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>(EXPRESSIONS[0].id);
  const current = EXPRESSIONS.find((e) => e.id === active) ?? EXPRESSIONS[0];
  const trap = "trap" in current && current.trap;

  return (
    <Panel
      label="Interactive"
      title="একটা Expression বেছে নিন"
      footer="প্রতিটা মান আর Type PostgreSQL 18 এ চালিয়ে নেওয়া। Type দেখতে চাইলে নিজের Query বক্সে লিখুন SELECT pg_typeof(5 / 2); এটা বলে দেয় একটা মান কোন Type এর।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {EXPRESSIONS.map((e) => (
          <button
            key={e.id}
            type="button"
            data-expr={e.id}
            aria-pressed={e.id === active}
            onClick={() => setActive(e.id)}
            className={cn(BTN, "font-mono", e.id === active ? BTN_ON : BTN_OFF)}
          >
            {e.sql}
          </button>
        ))}
      </div>
      <motion.div
        key={current.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-active={current.id}
        data-type={current.type}
        className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4"
      >
        <div className="border border-border bg-background p-4 font-mono text-[0.8125rem]">
          <div className="text-muted-foreground mb-2">SELECT {current.sql};</div>
          <div className={cn("text-xl font-bold break-all", trap ? "text-primary" : "text-foreground")}>
            {current.value}
          </div>
          <div className="mt-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
            Type: {current.type}
          </div>
        </div>
        <div
          className={cn(
            "border p-4 text-[0.8125rem] leading-relaxed",
            trap ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground",
          )}
        >
          {trap && (
            <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary mb-2">
              ফাঁদ
            </div>
          )}
          {current.note}
        </div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা সংখ্যা বেছে নিন: পাঁচ রকম গোল করা পাশাপাশি                           */
/* ------------------------------------------------------------------------- */

/** Real PostgreSQL 18 output for round, ceil, floor, trunc on numeric, and round on double precision. */
const ROUND_ROWS = [
  { v: "2.4", round: "2", ceil: "3", floor: "2", trunc: "2", roundFloat: "2" },
  { v: "2.5", round: "3", ceil: "3", floor: "2", trunc: "2", roundFloat: "2" },
  { v: "2.6", round: "3", ceil: "3", floor: "2", trunc: "2", roundFloat: "3" },
  { v: "3.5", round: "4", ceil: "4", floor: "3", trunc: "3", roundFloat: "4" },
  { v: "-2.5", round: "-3", ceil: "-2", floor: "-3", trunc: "-2", roundFloat: "-2" },
  { v: "-2.7", round: "-3", ceil: "-2", floor: "-3", trunc: "-2", roundFloat: "-3" },
  { v: "4166.6666666666666667", round: "4167", ceil: "4167", floor: "4166", trunc: "4166", roundFloat: "4167" },
];

const ROUND_COLUMNS = [
  { key: "round", label: "round(v)", note: "কাছের পূর্ণসংখ্যা, মাঝখানে হলে শূন্য থেকে দূরে" },
  { key: "ceil", label: "ceil(v)", note: "সবসময় উপরের দিকে" },
  { key: "floor", label: "floor(v)", note: "সবসময় নিচের দিকে" },
  { key: "trunc", label: "trunc(v)", note: "দশমিক কেটে, শূন্যের দিকে" },
  { key: "roundFloat", label: "round(v::float8)", note: "double precision এ মাঝখানে হলে জোড় সংখ্যায়" },
] as const;

export function RoundingLab() {
  const [value, setValue] = useState(ROUND_ROWS[1].v);
  const row = ROUND_ROWS.find((r) => r.v === value) ?? ROUND_ROWS[1];
  const differs = row.round !== row.roundFloat;

  return (
    <Panel
      label="Interactive"
      title="একটা সংখ্যা, পাঁচ রকম গোল"
      footer="সব উত্তর PostgreSQL 18 এর। শেষ Column টা দেখুন: 2.5 numeric এ হয় 3, কিন্তু double precision এ হয় 2। -2.5 এ উল্টো দিকে একই গল্প। টাকার হিসাব numeric এ রাখার এটাও একটা কারণ।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {ROUND_ROWS.map((r) => (
          <button
            key={r.v}
            type="button"
            data-value={r.v}
            aria-pressed={r.v === value}
            onClick={() => setValue(r.v)}
            className={cn(BTN, "font-mono", r.v === value ? BTN_ON : BTN_OFF)}
          >
            {r.v === "4166.6666666666666667" ? "12500 / 3.0" : r.v}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" data-round-row={row.v}>
        {ROUND_COLUMNS.map((c) => {
          const highlight = c.key === "roundFloat" && differs;
          return (
            <div
              key={c.key}
              className={cn(
                "border p-4",
                highlight ? "border-primary/60 bg-primary/5" : "border-border bg-background",
              )}
            >
              <div className="font-mono text-[0.6875rem] text-muted-foreground mb-2 break-all">{c.label}</div>
              <div className={cn("font-mono text-2xl font-bold", highlight ? "text-primary" : "text-foreground")}>
                {row[c.key]}
              </div>
              <div className="mt-2 text-[0.75rem] leading-snug text-muted-foreground">{c.note}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. কিস্তিতে ভাগ: হারানো পয়সা খোঁজা                                         */
/* ------------------------------------------------------------------------- */

const PRICES = [12500, 15500, 14000, 8500, 9500, 7800, 3500];
const PARTS = [2, 3, 4, 6];

/** Money is counted in paisa (whole numbers) so the arithmetic here is exact. */
function roundHalfAwayFromZero(paisa: number, parts: number) {
  return Math.floor((2 * paisa + parts) / (2 * parts));
}

function taka(paisa: number) {
  const sign = paisa < 0 ? "-" : "";
  const abs = Math.abs(paisa);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

export function InstallmentLab() {
  const [price, setPrice] = useState(12500);
  const [parts, setParts] = useState(3);

  const total = price * 100;
  const each = roundHalfAwayFromZero(total, parts);
  const naive = each * parts;
  const diff = naive - total;
  const last = total - each * (parts - 1);

  return (
    <Panel
      label="Interactive"
      title="কিস্তিতে ভাগ করলে পয়সা কোথায় যায়"
      footer="হিসাবগুলো পয়সায় (পূর্ণসংখ্যায়) করা, তাই নির্ভুল, আর PostgreSQL এর round(p / n, 2) এর সাথে মেলে। 12500 কে ৩ ভাগে, 8500 কে ৬ ভাগে, আর 12500 কে ৬ ভাগে চালিয়ে দেখুন: কোথাও এক পয়সা বেশি, কোথাও দুই পয়সা কম।"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
            দাম
          </span>
          {PRICES.map((p) => (
            <button
              key={p}
              type="button"
              data-price={p}
              aria-pressed={p === price}
              onClick={() => setPrice(p)}
              className={cn(BTN, "font-mono", p === price ? BTN_ON : BTN_OFF)}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
            কিস্তি
          </span>
          {PARTS.map((n) => (
            <button
              key={n}
              type="button"
              data-parts={n}
              aria-pressed={n === parts}
              onClick={() => setParts(n)}
              className={cn(BTN, "font-mono", n === parts ? BTN_ON : BTN_OFF)}
            >
              {toBn(n)} ভাগ
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-diff={taka(diff)}>
          <div className={cn("border p-4", diff !== 0 ? "border-primary/50 bg-primary/5" : "border-border bg-background")}>
            <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">
              সরল উপায়: সব কিস্তি সমান
            </div>
            <ol className="space-y-1 font-mono text-[0.8125rem]">
              {Array.from({ length: parts }, (_, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">কিস্তি {toBn(i + 1)}</span>
                  <span>{taka(each)}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 border-t border-border pt-3 font-mono text-[0.8125rem] flex justify-between">
              <span className="text-muted-foreground">মোট</span>
              <span className={diff !== 0 ? "text-primary font-bold" : ""}>{taka(naive)}</span>
            </div>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {diff === 0
                ? "এই দাম আর এই কিস্তিতে ভাগটা হুবহু মিলে গেছে।"
                : diff > 0
                  ? `Customer দেবেন ${taka(diff)} টাকা বেশি।`
                  : `কোম্পানি পাবে ${taka(-diff)} টাকা কম।`}
            </p>
          </div>
          <div className="border border-border bg-background p-4">
            <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary mb-3">
              ঠিক উপায়: বাকিটা শেষ কিস্তিতে
            </div>
            <ol className="space-y-1 font-mono text-[0.8125rem]">
              {Array.from({ length: parts }, (_, i) => {
                const isLast = i === parts - 1;
                return (
                  <li key={i} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">কিস্তি {toBn(i + 1)}</span>
                    <span className={isLast && last !== each ? "text-primary font-bold" : ""}>
                      {taka(isLast ? last : each)}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 border-t border-border pt-3 font-mono text-[0.8125rem] flex justify-between">
              <span className="text-muted-foreground">মোট</span>
              <span>{taka(total)}</span>
            </div>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              শেষ কিস্তি = দাম − (কিস্তি সংখ্যা − ১) × প্রতি কিস্তি। মোট সবসময় দামের সমান।
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
