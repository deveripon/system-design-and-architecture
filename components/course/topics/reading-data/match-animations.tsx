"use client";

import { cn, toBn } from "@/lib/utils";
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
/* 1. Pattern বদলান, দেখুন কোন Row মেলে                                       */
/* ------------------------------------------------------------------------- */

/**
 * LIKE as PostgreSQL defines it: % is any run of characters, _ exactly one,
 * a backslash makes the next character literal, and the pattern must cover
 * the whole string.
 */
function likeToRegExp(pattern: string, caseInsensitive: boolean): RegExp {
  let source = "";
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "\\" && i + 1 < pattern.length) {
      i++;
      source += pattern[i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    } else if (ch === "%") {
      source += "[\\s\\S]*";
    } else if (ch === "_") {
      source += "[\\s\\S]";
    } else {
      source += ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${source}$`, caseInsensitive ? "i" : "");
}

const DATASETS = {
  title: {
    label: "tours.title",
    column: "title",
    table: "tours",
    rows: [
      "Saint Martin Island Escape",
      "Cox's Bazar Beach Weekend",
      "Sundarbans Mangrove Cruise",
      "Sajek Valley Cloud Trip",
      "Bandarban Hill Trek",
      "Sylhet Tea Garden Tour",
      "Ratargul Swamp Boat Day",
      "Saint Martin Luxury Stay",
      "Cox's Bazar Family Package",
    ],
    presets: ["Saint%", "%Bazar%", "%bazar%", "%Trip", "S____%", "%a%a%a%"],
  },
  kind: {
    label: "destinations.kind",
    column: "kind",
    table: "destinations",
    rows: ["island", "beach", "forest", "hills", "hills", "tea_garden", "beach"],
    presets: ["%_%", "%\\_%", "h%", "_____", "%e%", "BEACH"],
  },
} as const;

type DatasetId = keyof typeof DATASETS;

const MODES = [
  { id: "like", label: "LIKE (PostgreSQL)", insensitive: false },
  { id: "ilike", label: "ILIKE (PostgreSQL)", insensitive: true },
  { id: "mysql", label: "LIKE (MySQL Default)", insensitive: true },
] as const;

type ModeId = (typeof MODES)[number]["id"];

export function PatternMatchLab() {
  const [datasetId, setDatasetId] = useState<DatasetId>("title");
  const [pattern, setPattern] = useState<string>("Saint%");
  const [modeId, setModeId] = useState<ModeId>("like");
  const dataset = DATASETS[datasetId];
  const mode = MODES.find((m) => m.id === modeId) ?? MODES[0];
  const regex = likeToRegExp(pattern, mode.insensitive);
  const matches = dataset.rows.map((row) => regex.test(row));
  const count = matches.filter(Boolean).length;
  const keyword = modeId === "ilike" ? "ILIKE" : "LIKE";

  return (
    <Panel
      label="Interactive"
      title="Pattern বদলান, দেখুন কোন Row মেলে"
      footer={
        <>
          বাঁয়ে Column আর Pattern বাছুন, অথবা নিজে লিখুন। ডানে প্রতিটা আসল Row এর পাশে
          দেখবেন মিলল কিনা। PostgreSQL এর LIKE বড় ছোট হাতের অক্ষর আলাদা ধরে, ILIKE
          ধরে না। MySQL এর Default Collation এ LIKE নিজেই বড় ছোট অক্ষর এক ধরে, তাই
          তৃতীয় বোতামে %bazar% ও মিলে যায়। Backslash এর পরের অক্ষর হুবহু মেলে, যেমন
          \_ মানে আসল একটা Underscore।
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-5 min-w-0">
          <div>
            <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Column
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DATASETS) as DatasetId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  data-dataset={id}
                  onClick={() => {
                    setDatasetId(id);
                    setPattern(DATASETS[id].presets[0]);
                  }}
                  className={cn(BTN, "font-mono", id === datasetId ? BTN_ON : BTN_OFF)}
                >
                  {DATASETS[id].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Pattern
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {dataset.presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  data-pattern={p}
                  onClick={() => setPattern(p)}
                  className={cn(BTN, "font-mono", p === pattern ? BTN_ON : BTN_OFF)}
                >
                  {p}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="sr-only">নিজের Pattern</span>
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                className="w-full border border-border bg-background px-3 py-2 font-mono text-[0.875rem] text-foreground outline-none focus:border-primary/60"
              />
            </label>
          </div>
          <div>
            <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              কোন নিয়মে
            </p>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  data-mode={m.id}
                  onClick={() => setModeId(m.id)}
                  className={cn(BTN, m.id === modeId ? BTN_ON : BTN_OFF)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground">
            {`SELECT ${dataset.column}\nFROM ${dataset.table}\nWHERE ${dataset.column} ${keyword} '${pattern}';`}
          </pre>
        </div>

        <div className="min-w-0" data-count={count}>
          <p className="mb-3 text-sm text-foreground">
            <span className="font-bold text-primary">{toBn(count)}টা</span> Row মিলেছে, মোট{" "}
            {toBn(dataset.rows.length)}টার মধ্যে।
          </p>
          <ul className="space-y-1.5">
            {dataset.rows.map((row, i) => (
              <li
                key={`${row}-${i}`}
                className={cn(
                  "flex items-center gap-3 border px-3 py-1.5 font-mono text-[0.75rem]",
                  matches[i]
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground/70",
                )}
              >
                <span className={cn("w-4 shrink-0 font-bold", matches[i] ? "text-primary" : "")}>
                  {matches[i] ? "✓" : "·"}
                </span>
                <span className="break-all">{row}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. সময়ের সীমা: কোন Booking ভেতরে পড়ে                                        */
/* ------------------------------------------------------------------------- */

/** The real bookings made between 28 Sep and 14 Oct 2026, Dhaka time. */
const RECENT = [
  { id: 18, at: "2026-09-28 23:30" },
  { id: 14, at: "2026-10-01 12:25" },
  { id: 16, at: "2026-10-02 10:05" },
  { id: 19, at: "2026-10-04 13:40" },
  { id: 17, at: "2026-10-08 09:15" },
  { id: 20, at: "2026-10-10 17:20" },
  { id: 21, at: "2026-10-11 18:00" },
  { id: 22, at: "2026-10-12 08:30" },
  { id: 23, at: "2026-10-13 20:55" },
  { id: 24, at: "2026-10-14 11:05" },
];

const FILTERS = [
  {
    id: "between",
    sql: "booked_at BETWEEN '2026-10-01' AND '2026-10-14'",
    // Bounds as Dhaka wall time, minute precision is enough for this data.
    test: (t: string) => t >= "2026-10-01 00:00" && t <= "2026-10-14 00:00",
    note: "শেষ সীমা '2026-10-14' মানে ১৪ তারিখের রাত ১২টা। তার পরের সব সময় বাদ, তাই #24 হারিয়ে গেল।",
  },
  {
    id: "half-open",
    sql: "booked_at >= '2026-10-01' AND booked_at < '2026-10-15'",
    test: (t: string) => t >= "2026-10-01 00:00" && t < "2026-10-15 00:00",
    note: "শুরুটা সহ, শেষটা বাদ, আর শেষটা হলো পরের দিনের শুরু। পুরো ১৪ তারিখ ভেতরে, কোনো অনুমান নেই।",
  },
  {
    id: "end-of-day",
    sql: "booked_at BETWEEN '2026-10-01' AND '2026-10-14 23:59:59'",
    test: (t: string) => t >= "2026-10-01 00:00" && t <= "2026-10-14 23:59",
    note: "এই Data তে ফল ঠিক আসে, কিন্তু timestamptz সেকেন্ডের ভগ্নাংশও রাখে। 23:59:59.5 এ কিছু হলে সেটা বাদ পড়বে। তাই এটা জোড়াতালি, অভ্যাস না।",
  },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export function DateRangeLab() {
  const [filterId, setFilterId] = useState<FilterId>("between");
  const filter = FILTERS.find((f) => f.id === filterId) ?? FILTERS[0];
  const inside = RECENT.map((b) => filter.test(b.at));
  const count = inside.filter(Boolean).length;

  return (
    <Panel
      label="Interactive"
      title="অক্টোবরের প্রথম দুই সপ্তাহের Booking গুনুন"
      footer={
        <>
          প্রশ্নটা একটাই: ১ থেকে ১৪ অক্টোবর 2026 এর মধ্যে কতগুলো Booking হয়েছে? উত্তর
          নয়টা। তিনটা শর্ত চেপে দেখুন কোনটা নয়টাই আনে। তালিকার সময়গুলো Sample
          Database এর আসল booked_at, ঢাকার সময়ে।
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            data-filter={f.id}
            onClick={() => setFilterId(f.id)}
            className={cn(BTN, "font-mono", f.id === filterId ? BTN_ON : BTN_OFF)}
          >
            {f.sql}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ul className="space-y-1.5 min-w-0">
          {RECENT.map((b, i) => (
            <li
              key={b.id}
              className={cn(
                "flex items-center gap-3 border px-3 py-1.5 font-mono text-[0.75rem]",
                inside[i]
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : b.id === 24
                    ? "border-destructive/50 bg-destructive/5 text-foreground"
                    : "border-border text-muted-foreground/70",
              )}
            >
              <span className="w-8 shrink-0 font-bold">#{b.id}</span>
              <span>{b.at}+06</span>
              <span className="ml-auto">{inside[i] ? "✓" : "·"}</span>
            </li>
          ))}
        </ul>
        <div className="min-w-0 space-y-3" data-count={count}>
          <p className="text-sm text-foreground">
            ফলাফল: <span className="font-bold text-primary">{toBn(count)}টা</span> Booking
            {count === 9 ? ", ঠিক উত্তর।" : ", একটা কম।"}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">{filter.note}</p>
        </div>
      </div>
    </Panel>
  );
}
