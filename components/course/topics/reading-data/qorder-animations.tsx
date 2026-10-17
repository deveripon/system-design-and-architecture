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
/* Real rows from the Island Tours sample database                           */
/* ------------------------------------------------------------------------- */

/** tours: tour_id, title, price_bdt, is_active. Copied from the sample file. */
const TOURS: [number, string, string, boolean][] = [
  [1, "Saint Martin Island Escape", "12500.00", true],
  [2, "Cox's Bazar Beach Weekend", "8500.00", true],
  [3, "Sundarbans Mangrove Cruise", "18000.00", true],
  [4, "Sajek Valley Cloud Trip", "9500.00", true],
  [5, "Bandarban Hill Trek", "14000.00", true],
  [6, "Sylhet Tea Garden Tour", "7800.00", true],
  [7, "Ratargul Swamp Boat Day", "3500.00", true],
  [8, "Saint Martin Luxury Stay", "32000.00", false],
  [9, "Cox's Bazar Family Package", "15500.00", true],
];

/** bookings: booking_id, status, seats. Copied from the sample file. */
const BOOKINGS: [number, string, number][] = [
  [1, "confirmed", 2], [2, "confirmed", 4], [3, "confirmed", 1], [4, "confirmed", 3],
  [5, "cancelled", 2], [6, "confirmed", 2], [7, "confirmed", 1], [8, "confirmed", 2],
  [9, "confirmed", 2], [10, "confirmed", 1], [11, "confirmed", 2], [12, "cancelled", 2],
  [13, "confirmed", 2], [14, "pending", 4], [15, "confirmed", 3], [16, "confirmed", 2],
  [17, "pending", 2], [18, "cancelled", 1], [19, "confirmed", 2], [20, "pending", 2],
  [21, "confirmed", 3], [22, "confirmed", 1], [23, "confirmed", 5], [24, "pending", 2],
];

type Grid = { columns: string[]; rows: string[][]; dropped?: string[][] };

type Clause = "FROM" | "WHERE" | "GROUP BY" | "HAVING" | "SELECT" | "DISTINCT" | "ORDER BY" | "LIMIT";
const ORDER: Clause[] = ["FROM", "WHERE", "GROUP BY", "HAVING", "SELECT", "DISTINCT", "ORDER BY", "LIMIT"];

type FlowStep = {
  clause: Clause;
  /** Index of the written line this step runs, or null when the query has no such clause. */
  line: number | null;
  text: string;
  grid: Grid;
};

function tourFlow(): FlowStep[] {
  const from: Grid = {
    columns: ["tour_id", "title", "price_bdt", "is_active"],
    rows: TOURS.map(([id, title, price, active]) => [String(id), title, price, active ? "t" : "f"]),
  };
  const kept = TOURS.filter((t) => t[3]);
  const where: Grid = {
    columns: from.columns,
    rows: kept.map(([id, title, price]) => [String(id), title, price, "t"]),
    dropped: TOURS.filter((t) => !t[3]).map(([id, title, price]) => [String(id), title, price, "f"]),
  };
  const selected = kept.map(([, title, price]) => [title, (Number(price) * 2).toFixed(2)]);
  const select: Grid = { columns: ["title", "for_two"], rows: selected };
  const sorted = [...selected].sort((a, b) => Number(b[1]) - Number(a[1]));
  const order: Grid = { columns: ["title", "for_two"], rows: sorted };
  const limit: Grid = { columns: ["title", "for_two"], rows: sorted.slice(0, 3) };
  return [
    { clause: "FROM", line: 1, grid: from, text: "প্রথম কাজ: কোন Table থেকে। tours এর নয়টা Row ই টেবিলে চলে এল, সব Column সহ। এখনো কিছু বাদ পড়েনি, কিছু হিসাবও হয়নি। জায়গার জন্য এখানে চারটা Column দেখানো হচ্ছে।" },
    { clause: "WHERE", line: 2, grid: where, text: "WHERE প্রতিটা Row কে আলাদা করে জিজ্ঞেস করে: is_active কি সত্য? Saint Martin Luxury Stay বন্ধ, তাই সে বাদ। খেয়াল করুন, for_two নামটা এখনো কোথাও নেই, কারণ SELECT এখনো চলেনি।" },
    { clause: "GROUP BY", line: null, grid: where, text: "এই Query তে GROUP BY নেই। ধাপটা আছে, কিন্তু কিছুই বদলায় না।" },
    { clause: "HAVING", line: null, grid: where, text: "HAVING ও নেই, তাই আটটা Row যেমন ছিল তেমনই থাকল।" },
    { clause: "SELECT", line: 0, grid: select, text: "এতক্ষণে SELECT এর পালা। প্রতিটা Row থেকে title নেওয়া হলো, আর price_bdt * 2 হিসাব করে নতুন Column বানানো হলো। for_two নামটার জন্ম ঠিক এই মুহূর্তে।" },
    { clause: "DISTINCT", line: null, grid: select, text: "DISTINCT লেখা নেই, তাই একই রকম Row মোছার কাজও নেই।" },
    { clause: "ORDER BY", line: 3, grid: order, text: "ORDER BY চলে SELECT এর পরে, তাই for_two নামটা সে চেনে। সবচেয়ে বড় for_two উপরে, ছোট নিচে।" },
    { clause: "LIMIT", line: 4, grid: limit, text: "সবশেষে LIMIT 3 সাজানো তালিকার উপরের তিনটা রেখে বাকিগুলো ফেলে দিল। সাজানোর আগে কাটলে ভুল তিনটা আসত, তাই LIMIT এর শেষে থাকাটা জরুরি।" },
  ];
}

function bookingFlow(): FlowStep[] {
  const from: Grid = {
    columns: ["booking_id", "status", "seats"],
    rows: BOOKINGS.map(([id, status, seats]) => [String(id), status, String(seats)]),
  };
  const kept = BOOKINGS.filter((b) => b[2] >= 2);
  const where: Grid = {
    columns: from.columns,
    rows: kept.map(([id, status, seats]) => [String(id), status, String(seats)]),
    dropped: BOOKINGS.filter((b) => b[2] < 2).map(([id, status, seats]) => [String(id), status, String(seats)]),
  };
  const statuses = ["cancelled", "confirmed", "pending"];
  const groups = statuses.map((s) => [s, kept.filter((b) => b[1] === s).map((b) => b[0]).join(", ")]);
  const group: Grid = { columns: ["status", "এই দলের booking_id"], rows: groups };
  const counts = statuses.map((s) => [s, String(kept.filter((b) => b[1] === s).length)]);
  const having: Grid = {
    columns: ["status", "count(*)"],
    rows: counts.filter((c) => Number(c[1]) > 2),
    dropped: counts.filter((c) => Number(c[1]) <= 2),
  };
  const select: Grid = { columns: ["status", "bookings"], rows: having.rows };
  const order: Grid = {
    columns: ["status", "bookings"],
    rows: [...having.rows].sort((a, b) => Number(b[1]) - Number(a[1])),
  };
  return [
    { clause: "FROM", line: 1, grid: from, text: "bookings এর চব্বিশটা Row টেবিলে এল। এখানে তিনটা Column দেখানো হচ্ছে।" },
    { clause: "WHERE", line: 2, grid: where, text: "seats >= 2 শর্তে এক সিটের পাঁচটা Booking বাদ পড়ল, থাকল উনিশটা। WHERE এখনো প্রতিটা Row আলাদা করে দেখছে, কোনো দল নেই।" },
    { clause: "GROUP BY", line: 3, grid: group, text: "GROUP BY status একই status এর Row গুলোকে এক দলে বাঁধল। এখন থেকে প্রতিটা দল একটা Row এর মতো আচরণ করবে।" },
    { clause: "HAVING", line: 4, grid: having, text: "HAVING দল ধরে ছাঁকে: যে দলে দুইয়ের বেশি Booking নেই, সে বাদ। cancelled দলে মাত্র দুটো, তাই সে বাদ পড়ল। WHERE যেখানে Row ছাঁকে, HAVING সেখানে দল ছাঁকে।" },
    { clause: "SELECT", line: 0, grid: select, text: "SELECT এখন প্রতিটা দল থেকে status আর count(*) নিল, আর count(*) এর নাম দিল bookings। নামটার জন্ম এখানে, HAVING এর পরে। তাই HAVING bookings > 2 লিখলে PostgreSQL নামটা চিনত না।" },
    { clause: "DISTINCT", line: null, grid: select, text: "DISTINCT নেই, কিছু বদলায় না।" },
    { clause: "ORDER BY", line: 5, grid: order, text: "ORDER BY bookings DESC: bookings নামটা এখন চেনা, তাই সাজানো গেল। confirmed উপরে, pending নিচে।" },
    { clause: "LIMIT", line: null, grid: order, text: "LIMIT নেই, তাই দুটো Row ই ফলাফল। PostgreSQL এ এই Query চালালে ঠিক এই দুটো Row আসে।" },
  ];
}

const QUERIES = {
  tours: {
    label: "Query ১: tours",
    lines: [
      "SELECT title, price_bdt * 2 AS for_two",
      "FROM tours",
      "WHERE is_active",
      "ORDER BY for_two DESC",
      "LIMIT 3;",
    ],
    steps: tourFlow(),
  },
  bookings: {
    label: "Query ২: bookings, দল ধরে",
    lines: [
      "SELECT status, count(*) AS bookings",
      "FROM bookings",
      "WHERE seats >= 2",
      "GROUP BY status",
      "HAVING count(*) > 2",
      "ORDER BY bookings DESC;",
    ],
    steps: bookingFlow(),
  },
} as const;

type QueryId = keyof typeof QUERIES;

function GridView({ grid }: { grid: Grid }) {
  return (
    <div className="max-h-80 overflow-auto border border-border">
      <table className="w-full border-collapse font-mono text-[0.6875rem]">
        <thead className="sticky top-0 bg-muted">
          <tr>
            {grid.columns.map((c) => (
              <th key={c} className="border-b border-border px-2.5 py-1.5 text-left font-bold text-foreground whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.rows.map((row, r) => (
            <tr key={`k-${r}`} className="border-b border-border/50 last:border-b-0">
              {row.map((cell, c) => (
                <td key={c} className="px-2.5 py-1 text-foreground/90 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {grid.dropped?.map((row, r) => (
            <tr key={`d-${r}`} className="border-b border-border/50 bg-destructive/5">
              {row.map((cell, c) => (
                <td key={c} className="px-2.5 py-1 text-muted-foreground line-through whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Steps a query through the eight logical clauses on real rows. The written
 * query on the left lights up the line that runs at each step, so the jump
 * from the first written line (SELECT) to the fifth step is visible.
 */
export function QueryFlowLab() {
  const reduce = useReducedMotion();
  const [queryId, setQueryId] = useState<QueryId>("tours");
  const [index, setIndex] = useState(0);
  const query = QUERIES[queryId];
  const step = query.steps[index];
  const kept = step.grid.rows.length;

  return (
    <Panel
      label="Interactive"
      title="একটা Query কে ধাপে ধাপে চলতে দেখুন"
      footer={
        <>
          পরের ধাপ চাপতে থাকুন। বাঁ দিকে লেখা Query এর যে লাইনটা এখন চলছে সেটা জ্বলে
          ওঠে, ডান দিকে সেই মুহূর্তের Table। কাটা দাগ দেওয়া Row গুলো ওই ধাপে বাদ পড়েছে।
          দুটো Query ই Sample Database এ চালিয়ে মিলিয়ে দেখা: প্রথমটা শেষে তিনটা Row
          দেয়, দ্বিতীয়টা দুটো।
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(QUERIES) as QueryId[]).map((id) => (
          <button
            key={id}
            type="button"
            data-query={id}
            onClick={() => {
              setQueryId(id);
              setIndex(0);
            }}
            aria-pressed={id === queryId}
            className={cn(BTN, id === queryId ? BTN_ON : BTN_OFF)}
          >
            {QUERIES[id].label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="space-y-5">
          <div>
            <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              যেভাবে লেখা
            </p>
            <pre className="border border-border bg-background px-0 py-2 font-mono text-[0.75rem] leading-relaxed overflow-x-auto">
              {query.lines.map((line, i) => (
                <span
                  key={line}
                  className={cn(
                    "block px-4 transition-colors",
                    step.line === i ? "bg-primary/15 text-primary font-bold" : "text-foreground/70"
                  )}
                >
                  {line}
                </span>
              ))}
            </pre>
          </div>
          <div>
            <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              যে ক্রমে চলে
            </p>
            <ol className="grid grid-cols-2 gap-1.5">
              {ORDER.map((clause, i) => {
                const present = query.steps[i].line !== null;
                return (
                  <li key={clause}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      data-step={i}
                      className={cn(
                        "w-full border px-2.5 py-1.5 text-left font-mono text-[0.6875rem] transition-colors",
                        i === index
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : i < index
                            ? "border-border text-foreground/80"
                            : "border-border text-muted-foreground",
                        !present && "border-dashed opacity-70"
                      )}
                    >
                      {toBn(i + 1)}. {clause}
                      {!present && <span className="ml-1 font-sans text-[0.625rem]">(নেই)</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className={cn(BTN, BTN_OFF, "disabled:opacity-40")}
            >
              আগের ধাপ
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(ORDER.length - 1, i + 1))}
              disabled={index === ORDER.length - 1}
              className={cn(BTN, BTN_ON, "disabled:opacity-40")}
            >
              পরের ধাপ
            </button>
            <button type="button" onClick={() => setIndex(0)} className={cn(BTN, BTN_OFF)}>
              শুরু থেকে
            </button>
          </div>
        </div>

        <motion.div
          key={`${queryId}-${index}`}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          data-active-step={step.clause}
          data-rows={kept}
          className="space-y-3"
        >
          <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-primary">
            ধাপ {toBn(index + 1)}: {step.clause}
            <span className="ml-2 font-sans normal-case tracking-normal text-muted-foreground">
              {toBn(kept)}টা Row
            </span>
          </p>
          <p className="text-sm leading-relaxed text-foreground">{step.text}</p>
          <GridView grid={step.grid} />
        </motion.div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. চলবে, নাকি Error?                                                        */
/* ------------------------------------------------------------------------- */

type Case = {
  id: string;
  sql: string;
  runs: boolean;
  pg: string;
  mysql: string;
  why: string;
};

/** Every outcome below was produced on PostgreSQL 18 and MySQL 8.4.11 with the sample data. */
const CASES: Case[] = [
  {
    id: "where-alias",
    sql: "SELECT title, price_bdt * 2 AS for_two\nFROM tours\nWHERE for_two > 20000;",
    runs: false,
    pg: 'ERROR:  column "for_two" does not exist',
    mysql: "ERROR 1054 (42S22): Unknown column 'for_two' in 'where clause'",
    why: "WHERE চলে দ্বিতীয় ধাপে, for_two এর জন্ম পঞ্চম ধাপে। দুই Database ই একমত।",
  },
  {
    id: "order-alias",
    sql: "SELECT title, price_bdt * 2 AS for_two\nFROM tours\nORDER BY for_two DESC;",
    runs: true,
    pg: "চলে, নয়টা Row, সবচেয়ে বড় for_two উপরে",
    mysql: "চলে, একই নয়টা Row",
    why: "ORDER BY চলে SELECT এর পরে, তাই নামটা তখন আছে।",
  },
  {
    id: "having-alias",
    sql: "SELECT status, count(*) AS n\nFROM bookings\nGROUP BY status\nHAVING n > 3;",
    runs: false,
    pg: 'ERROR:  column "n" does not exist',
    mysql: "চলে: confirmed 17, pending 4",
    why: "HAVING চলে SELECT এর আগে। PostgreSQL নিয়মটা কড়াভাবে মানে, MySQL নিজের সুবিধার জন্য Alias মেনে নেয়। দুই জায়গায় চলবে এমন লেখা: HAVING count(*) > 3।",
  },
  {
    id: "group-alias",
    sql: "SELECT status AS s, count(*)\nFROM bookings\nGROUP BY s;",
    runs: true,
    pg: "চলে, তিনটা দল: cancelled 3, confirmed 17, pending 4",
    mysql: "চলে, একই ফলাফল",
    why: "এটা নিয়মের ব্যতিক্রম। GROUP BY আগে চললেও PostgreSQL এর Docs নিজেই বলে, Output Column এর নাম GROUP BY আর ORDER BY তে ব্যবহার করা যায়।",
  },
  {
    id: "where-aggregate",
    sql: "SELECT title\nFROM tours\nWHERE count(*) > 1;",
    runs: false,
    pg: "ERROR:  aggregate functions are not allowed in WHERE",
    mysql: "ERROR 1111 (HY000): Invalid use of group function",
    why: "count(*) একটা দলের হিসাব। WHERE চলে দল বানানোর আগে, একটা একটা Row ধরে, তখন গোনার মতো কোনো দলই নেই। দলের শর্ত যায় HAVING এ (Module 05)।",
  },
  {
    id: "distinct-order",
    sql: "SELECT DISTINCT region\nFROM destinations\nORDER BY kind;",
    runs: false,
    pg: "ERROR:  for SELECT DISTINCT, ORDER BY expressions must appear in select list",
    mysql: "ERROR 3065 (HY000): Expression #1 of ORDER BY clause is not in SELECT list ... incompatible with DISTINCT",
    why: "DISTINCT চলে ORDER BY এর আগে। একই region এর কয়েকটা Row এক হয়ে যাওয়ার পর kind আর একটা নির্দিষ্ট মান থাকে না, তাই কোন kind ধরে সাজাবে সেটা বলা যায় না।",
  },
  {
    id: "order-hidden",
    sql: "SELECT title\nFROM tours\nORDER BY price_bdt DESC\nLIMIT 2;",
    runs: true,
    pg: "চলে: Saint Martin Luxury Stay, Sundarbans Mangrove Cruise",
    mysql: "চলে, একই দুটো Row",
    why: "DISTINCT না থাকলে ORDER BY এমন Column দিয়েও সাজাতে পারে যেটা SELECT এ নেই, কারণ মূল Row গুলো তখনো তার হাতে আছে।",
  },
  {
    id: "order-alias-expr",
    sql: "SELECT price_bdt * 2 AS for_two\nFROM tours\nORDER BY for_two + 1;",
    runs: false,
    pg: 'ERROR:  column "for_two" does not exist',
    mysql: "চলে, ছোট থেকে বড়",
    why: "PostgreSQL ORDER BY তে Alias শুধু একা দাঁড়ালে চেনে। for_two + 1 একটা Expression, সেখানে নামটা খোঁজা হয় মূল Table এর Column এ, আর সেখানে for_two নেই। MySQL এখানেও নরম।",
  },
];

export function WillItRunLab() {
  const [guesses, setGuesses] = useState<Record<string, boolean>>({});
  const answered = Object.keys(guesses).length;
  const correct = CASES.filter((c) => guesses[c.id] !== undefined && guesses[c.id] === c.runs).length;

  return (
    <Panel
      label="Interactive"
      title="চলবে, নাকি Error? আগে আন্দাজ করুন"
      footer={
        <>
          প্রতিটা Query পড়ে আগে আন্দাজ করুন PostgreSQL এ চলবে কিনা, তারপর উত্তর দেখুন।
          প্রতিটা উত্তর আর Error এর লেখা PostgreSQL 18 আর MySQL 8.4 এ Sample Database এ
          চালিয়ে নেওয়া। রহস্য প্রায় সবসময় একটাই: কোন ধাপ আগে চলে।
        </>
      }
    >
      <p className="mb-5 font-mono text-[0.6875rem] text-muted-foreground" data-score={correct}>
        {toBn(answered)}/{toBn(CASES.length)} উত্তর দেওয়া, {toBn(correct)}টা ঠিক
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {CASES.map((c) => {
          const guess = guesses[c.id];
          const done = guess !== undefined;
          const right = done && guess === c.runs;
          return (
            <div
              key={c.id}
              data-case={c.id}
              data-result={done ? (right ? "right" : "wrong") : "open"}
              className="flex flex-col border border-border bg-background"
            >
              <pre className="overflow-x-auto border-b border-border px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground">
                {c.sql}
              </pre>
              <div className="flex gap-2 px-4 py-3">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    disabled={done}
                    onClick={() => setGuesses((g) => ({ ...g, [c.id]: value }))}
                    className={cn(
                      BTN,
                      done && guess === value ? BTN_ON : BTN_OFF,
                      "disabled:cursor-default"
                    )}
                  >
                    {value ? "চলবে" : "Error"}
                  </button>
                ))}
              </div>
              {done && (
                <div className="space-y-2 border-t border-border px-4 py-3 text-[0.8125rem] leading-relaxed">
                  <p className={cn("font-bold", right ? "text-primary" : "text-destructive")}>
                    {right ? "ঠিক ধরেছেন।" : "এবার মেলেনি।"} PostgreSQL এ {c.runs ? "চলে।" : "Error দেয়।"}
                  </p>
                  <p className="font-mono text-[0.6875rem] text-foreground/80 break-words">PostgreSQL: {c.pg}</p>
                  <p className="font-mono text-[0.6875rem] text-muted-foreground break-words">MySQL: {c.mysql}</p>
                  <p className="text-muted-foreground">{c.why}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setGuesses({})}
        className={cn(BTN, BTN_OFF, "mt-5")}
      >
        আবার শুরু
      </button>
    </Panel>
  );
}
