"use client";

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
const BTN_OFF = "border-border text-muted-foreground hover:text-foreground hover:border-primary/40";

/* ------------------------------------------------------------------------- */
/* 1. নিজে সাজিয়ে দেখুন                                                       */
/* ------------------------------------------------------------------------- */

interface Tour {
  tour_id: number;
  title: string;
  guide_id: number | null;
  duration_days: number;
  price_bdt: number;
}

/** The nine tours of the sample database, as public/sql/island-tours.sql has them. */
const TOURS: Tour[] = [
  { tour_id: 1, title: "Saint Martin Island Escape", guide_id: 1, duration_days: 3, price_bdt: 12500 },
  { tour_id: 2, title: "Cox's Bazar Beach Weekend", guide_id: 2, duration_days: 2, price_bdt: 8500 },
  { tour_id: 3, title: "Sundarbans Mangrove Cruise", guide_id: 3, duration_days: 3, price_bdt: 18000 },
  { tour_id: 4, title: "Sajek Valley Cloud Trip", guide_id: 1, duration_days: 2, price_bdt: 9500 },
  { tour_id: 5, title: "Bandarban Hill Trek", guide_id: 4, duration_days: 4, price_bdt: 14000 },
  { tour_id: 6, title: "Sylhet Tea Garden Tour", guide_id: 2, duration_days: 2, price_bdt: 7800 },
  { tour_id: 7, title: "Ratargul Swamp Boat Day", guide_id: null, duration_days: 1, price_bdt: 3500 },
  { tour_id: 8, title: "Saint Martin Luxury Stay", guide_id: 4, duration_days: 4, price_bdt: 32000 },
  { tour_id: 9, title: "Cox's Bazar Family Package", guide_id: 3, duration_days: 3, price_bdt: 15500 },
];

type Key = "price_bdt" | "duration_days" | "guide_id" | "title" | "tour_id";
type Dir = "ASC" | "DESC";
type Nulls = "default" | "FIRST" | "LAST";

const FIRST_KEYS: Key[] = ["price_bdt", "duration_days", "guide_id", "title"];
const SECOND_KEYS: (Key | "none")[] = ["none", "tour_id", "title", "price_bdt"];

/** Compares like PostgreSQL: NULL counts as larger than any value unless told otherwise; text by code point, like the query boxes. */
function compareBy(a: Tour, b: Tour, key: Key, dir: Dir, nulls: Nulls) {
  const va = a[key];
  const vb = b[key];
  const nullsFirst = nulls === "default" ? dir === "DESC" : nulls === "FIRST";
  if (va === null && vb === null) return 0;
  if (va === null) return nullsFirst ? -1 : 1;
  if (vb === null) return nullsFirst ? 1 : -1;
  const base = va < vb ? -1 : va > vb ? 1 : 0;
  return dir === "ASC" ? base : -base;
}

function clause(key: Key, dir: Dir, nulls: Nulls) {
  return `${key}${dir === "DESC" ? " DESC" : ""}${nulls === "default" ? "" : ` NULLS ${nulls}`}`;
}

function show(t: Tour, key: Key) {
  const v = t[key];
  if (v === null) return "NULL";
  if (key === "price_bdt") return `${v}.00`;
  return String(v);
}

export function SortLab() {
  const reduce = useReducedMotion();
  const [first, setFirst] = useState<Key>("duration_days");
  const [firstDir, setFirstDir] = useState<Dir>("DESC");
  const [nulls, setNulls] = useState<Nulls>("default");
  const [second, setSecond] = useState<Key | "none">("none");
  const [secondDir, setSecondDir] = useState<Dir>("ASC");

  // Stable sort on tour_id first, so the drawing is steady; the tie badges say
  // that a real database makes no such promise.
  const sorted = [...TOURS].sort((a, b) => {
    const one = compareBy(a, b, first, firstDir, nulls);
    if (one !== 0) return one;
    if (second !== "none") {
      const two = compareBy(a, b, second, secondDir, "default");
      if (two !== 0) return two;
    }
    return a.tour_id - b.tour_id;
  });

  const tieKey = (t: Tour) =>
    second === "none" ? String(t[first]) : `${t[first]}|${t[second]}`;
  const tied = new Set(
    sorted
      .filter((t, i) => {
        const k = tieKey(t);
        return (i > 0 && tieKey(sorted[i - 1]) === k) || (i < sorted.length - 1 && tieKey(sorted[i + 1]) === k);
      })
      .map((t) => t.tour_id)
  );

  const orderBy =
    `ORDER BY ${clause(first, firstDir, nulls)}` +
    (second !== "none" ? `, ${clause(second, secondDir, "default")}` : "");
  const columns: Key[] = ["title", first, ...(second !== "none" && second !== "title" && second !== first ? [second] : [])].filter(
    (k, i, all) => all.indexOf(k) === i
  ) as Key[];

  return (
    <Panel
      label="Sort Lab"
      title="নয়টা ট্যুর, আপনার ORDER BY"
      footer="Row গুলো এখানে নিজে থেকেই tour_id ধরে স্থির রাখা হয়েছে, যাতে ছবিটা না নড়ে। কিন্তু TIE লেখা Row গুলোর ক্রম আসল PostgreSQL কোনো কথা দেয় না: একটা Query তে এক রকম, আরেকটায় অন্য রকম আসতে পারে। দ্বিতীয় চাবিতে tour_id দিলে TIE গুলো মুছে যায়। Text এখানে Query Box এর মতো অক্ষরের Code ধরে সাজানো।"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-3">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">প্রথম চাবি</p>
            <div className="flex flex-wrap gap-2">
              {FIRST_KEYS.map((k) => (
                <button key={k} type="button" data-first={k} onClick={() => setFirst(k)} className={cn(BTN, first === k ? BTN_ON : BTN_OFF)}>
                  {k}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(["ASC", "DESC"] as Dir[]).map((d) => (
                <button key={d} type="button" data-first-dir={d} onClick={() => setFirstDir(d)} className={cn(BTN, firstDir === d ? BTN_ON : BTN_OFF)}>
                  {d}
                </button>
              ))}
              {(["default", "FIRST", "LAST"] as Nulls[]).map((n) => (
                <button key={n} type="button" data-nulls={n} onClick={() => setNulls(n)} className={cn(BTN, nulls === n ? BTN_ON : BTN_OFF)}>
                  {n === "default" ? "NULL: নিয়ম মতো" : `NULLS ${n}`}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">দ্বিতীয় চাবি (সমান হলে)</p>
            <div className="flex flex-wrap gap-2">
              {SECOND_KEYS.filter((k) => k !== first).map((k) => (
                <button key={k} type="button" data-second={k} onClick={() => setSecond(k)} className={cn(BTN, second === k ? BTN_ON : BTN_OFF)}>
                  {k === "none" ? "কিছু না" : k}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(["ASC", "DESC"] as Dir[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  data-second-dir={d}
                  disabled={second === "none"}
                  onClick={() => setSecondDir(d)}
                  className={cn(BTN, secondDir === d && second !== "none" ? BTN_ON : BTN_OFF, second === "none" && "opacity-40")}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] text-foreground" data-order-by={orderBy}>
          {`SELECT ${columns.join(", ")}\nFROM tours\n${orderBy};`}
        </pre>

        <ol className="border border-border divide-y divide-border/60">
          {sorted.map((t, i) => (
            <motion.li
              key={t.tour_id}
              layout={!reduce}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              data-row={t.tour_id}
              className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 font-mono text-[0.75rem]", tied.has(t.tour_id) && "bg-primary/5")}
            >
              <span className="w-5 text-muted-foreground/60 tabular-nums">{i + 1}</span>
              <span className="min-w-0 flex-1 text-foreground">{t.title}</span>
              {columns
                .filter((c) => c !== "title")
                .map((c) => (
                  <span key={c} className={cn("tabular-nums", t[c] === null ? "italic text-muted-foreground/70" : "text-foreground/80")}>
                    {`${c}=${show(t, c)}`}
                  </span>
                ))}
              {tied.has(t.tour_id) && (
                <span className="border border-primary/50 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-primary">
                  TIE
                </span>
              )}
            </motion.li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground leading-relaxed" data-ties={tied.size}>
          {tied.size === 0
            ? "কোনো TIE নেই: এই ORDER BY প্রতিবার একই ক্রম দেবে।"
            : `${tied.size}টা Row এর চাবি অন্য কোনো Row এর সাথে হুবহু এক। এদের নিজেদের মধ্যে ক্রম নিশ্চিত না।`}
        </p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. সমান চাবি, বদলে যাওয়া ক্রম                                              */
/* ------------------------------------------------------------------------- */

type Run = "a" | "b" | "fixed";

/** Three real result orders, copied from the query box runs in this lesson. */
const RUNS: Record<Run, { sql: string; rows: [string, number | null][] }> = {
  a: {
    sql: "ORDER BY guide_id",
    rows: [
      ["Saint Martin Island Escape", 1],
      ["Sajek Valley Cloud Trip", 1],
      ["Sylhet Tea Garden Tour", 2],
      ["Cox's Bazar Beach Weekend", 2],
      ["Cox's Bazar Family Package", 3],
      ["Sundarbans Mangrove Cruise", 3],
      ["Saint Martin Luxury Stay", 4],
      ["Bandarban Hill Trek", 4],
      ["Ratargul Swamp Boat Day", null],
    ],
  },
  b: {
    sql: "ORDER BY guide_id NULLS FIRST",
    rows: [
      ["Ratargul Swamp Boat Day", null],
      ["Sajek Valley Cloud Trip", 1],
      ["Saint Martin Island Escape", 1],
      ["Sylhet Tea Garden Tour", 2],
      ["Cox's Bazar Beach Weekend", 2],
      ["Cox's Bazar Family Package", 3],
      ["Sundarbans Mangrove Cruise", 3],
      ["Saint Martin Luxury Stay", 4],
      ["Bandarban Hill Trek", 4],
    ],
  },
  fixed: {
    sql: "ORDER BY guide_id, tour_id",
    rows: [
      ["Saint Martin Island Escape", 1],
      ["Sajek Valley Cloud Trip", 1],
      ["Cox's Bazar Beach Weekend", 2],
      ["Sylhet Tea Garden Tour", 2],
      ["Sundarbans Mangrove Cruise", 3],
      ["Cox's Bazar Family Package", 3],
      ["Bandarban Hill Trek", 4],
      ["Saint Martin Luxury Stay", 4],
      ["Ratargul Swamp Boat Day", null],
    ],
  },
};

/** For each guide, the titles in the order a run shows them. */
function orderWithinGuides(run: Run) {
  const groups = new Map<string, string[]>();
  for (const [title, guide] of RUNS[run].rows) {
    const k = guide === null ? "NULL" : String(guide);
    groups.set(k, [...(groups.get(k) ?? []), title]);
  }
  return groups;
}

export function TieShuffleLab() {
  const [run, setRun] = useState<Run>("a");
  const mine = orderWithinGuides(run);
  const other = orderWithinGuides(run === "a" ? "b" : "a");

  return (
    <Panel
      label="Tie Lab"
      title="একই guide_id, দুই Query তে দুই ক্রম"
      footer="তিনটা ক্রমই এই লেসনের Query Box এ আসল PostgreSQL চালিয়ে পাওয়া। প্রথম দুটোতে guide_id এর মান একই রকম সাজানো, কিন্তু একই Guide এর দুটো ট্যুর কখনো এক ক্রমে, কখনো উল্টো। দুটোই নিয়ম মেনে সঠিক। tour_id যোগ করলে আর কোনো দুই Row এর চাবি এক থাকে না, তাই ক্রম একটাই।"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {(["a", "b", "fixed"] as Run[]).map((r) => (
            <button key={r} type="button" data-run={r} onClick={() => setRun(r)} className={cn(BTN, "font-mono", run === r ? BTN_ON : BTN_OFF)}>
              {RUNS[r].sql}
            </button>
          ))}
        </div>
        <ol className="border border-border divide-y divide-border/60">
          {RUNS[run].rows.map(([title, guide], i) => {
            const k = guide === null ? "NULL" : String(guide);
            const pos = mine.get(k)!.indexOf(title);
            const moved = run !== "fixed" && other.get(k)!.indexOf(title) !== pos;
            return (
              <li
                key={`${run}-${title}`}
                data-moved={moved ? "yes" : "no"}
                className={cn("flex items-center gap-4 px-4 py-2 font-mono text-[0.75rem] transition-colors duration-300", moved && "bg-primary/10")}
              >
                <span className="w-5 text-muted-foreground/60 tabular-nums">{i + 1}</span>
                <span className="flex-1 min-w-0 text-foreground">{title}</span>
                <span className={cn("tabular-nums", guide === null ? "italic text-muted-foreground/70" : "text-foreground/80")}>
                  {guide === null ? "NULL" : `guide ${guide}`}
                </span>
                {moved && (
                  <span className="border border-primary/50 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-primary">
                    অন্য Query তে উল্টো
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {run === "fixed"
            ? "প্রতিটা Guide এর ভেতরে tour_id ছোট থেকে বড়। এই ক্রম আজ, কাল, Data বাড়লেও একই থাকবে।"
            : "আলো জ্বলা Row গুলো একই guide_id এর। অন্য Query টায় এরা জায়গা বদল করেছে, অথচ কেউ কোনো ভুল করেনি।"}
        </p>
      </div>
    </Panel>
  );
}
