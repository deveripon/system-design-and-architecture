/**
 * What: The interactive labs for Module 07 Lesson 10. CronExpressionLab reads a cron line and
 * lists its next runs on a UTC clock and a Dhaka clock. OverlapLab replays a slow job that runs
 * every minute, with no lock, with flock and as a systemd timer. MissedRunLab switches the server
 * off around the nightly backup and shows which scheduler still runs it. JobDebugLab maps the
 * symptom of a job that did not run to its likely cause and the command that proves it.
 *
 * Why: Schedules go wrong in time, which a reader cannot watch on a page unless the page replays
 * it. Every result is derived from state in render, never set from an effect, and the start time
 * is fixed so the server render and the browser render always match. The numbers in OverlapLab
 * and MissedRunLab follow runs captured on a real Ubuntu 24.04 practice server.
 */
"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Check, X } from "lucide-react";
import { useMemo, useState } from "react";

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

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
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
/* 1. একটা cron লাইন পড়ুন, পরের Run গুলো দেখুন                                    */
/* ------------------------------------------------------------------------- */

type FieldSpec = { key: string; label: string; min: number; max: number; names?: Record<string, number> };

const MONTH_NAMES: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
const DOW_NAMES: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

const FIELD_SPECS: FieldSpec[] = [
  { key: "minute", label: "মিনিট", min: 0, max: 59 },
  { key: "hour", label: "ঘণ্টা", min: 0, max: 23 },
  { key: "dom", label: "মাসের দিন", min: 1, max: 31 },
  { key: "month", label: "মাস", min: 1, max: 12, names: MONTH_NAMES },
  { key: "dow", label: "সপ্তাহের দিন", min: 0, max: 7, names: DOW_NAMES },
];

const SPECIAL: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

type ParsedField = { values: Set<number>; star: boolean; text: string };
type Parsed = { ok: true; fields: ParsedField[]; expanded: string } | { ok: false; error: string };

function readNumber(token: string, spec: FieldSpec): number | null {
  const lower = token.toLowerCase();
  if (spec.names && lower in spec.names) return spec.names[lower];
  if (!/^\d+$/.test(token)) return null;
  return Number(token);
}

function parseField(text: string, spec: FieldSpec): ParsedField | string {
  const values = new Set<number>();
  for (const part of text.split(",")) {
    if (part === "") return `${spec.label} এর ঘরে একটা ফাঁকা অংশ আছে`;
    const [rangeText, stepText, extra] = part.split("/");
    if (extra !== undefined) return `${spec.label} এর ঘরে একটার বেশি / আছে`;
    let step = 1;
    if (stepText !== undefined) {
      if (!/^\d+$/.test(stepText) || Number(stepText) < 1) return `${spec.label} এর ঘরে ধাপটা (${stepText}) একটা ধনাত্মক সংখ্যা নয়`;
      step = Number(stepText);
    }
    let from: number;
    let to: number;
    if (rangeText === "*") {
      from = spec.min;
      to = spec.max;
    } else if (rangeText.includes("-")) {
      const [a, b] = rangeText.split("-");
      const na = readNumber(a, spec);
      const nb = readNumber(b, spec);
      if (na === null || nb === null) return `${spec.label} এর ঘরে "${rangeText}" পড়া গেল না`;
      from = na;
      to = nb;
    } else {
      const n = readNumber(rangeText, spec);
      if (n === null) return `${spec.label} এর ঘরে "${rangeText}" পড়া গেল না`;
      if (stepText !== undefined) {
        return `${spec.label} এর ঘরে ${n}/${step}: Ubuntu র crontab এটা চুপচাপ মেনে নেয়, কিন্তু cron এমন লাইন কখনো চালায় না। পরিসর সহ লিখুন, যেমন ${n}-${spec.max}/${step}`;
      }
      from = n;
      to = n;
    }
    if (from < spec.min || to > spec.max || from > to) {
      return `${spec.label} এর ঘরে মান হতে হবে ${spec.min} থেকে ${spec.max} এর মধ্যে, ছোট থেকে বড়`;
    }
    for (let v = from; v <= to; v += step) values.add(spec.key === "dow" && v === 7 ? 0 : v);
  }
  return { values, star: text.startsWith("*"), text };
}

function parseCron(raw: string): Parsed {
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (trimmed === "") return { ok: false, error: "একটা cron লাইনের সময়ের অংশ লিখুন, যেমন 30 21 * * *" };
  if (trimmed.toLowerCase() === "@reboot") {
    return { ok: false, error: "@reboot কোনো ঘড়ির সময় নয়: cron চালু হওয়ার সময় একবার চলে, মানে Server Boot হলে।" };
  }
  const expanded = SPECIAL[trimmed.toLowerCase()] ?? trimmed;
  const parts = expanded.split(" ");
  if (parts.length !== 5) {
    return { ok: false, error: `পাঁচটা ঘর দরকার, পাওয়া গেছে ${parts.length} টা। Command টা এখানে লিখবেন না, শুধু সময়ের পাঁচটা ঘর।` };
  }
  const fields: ParsedField[] = [];
  for (let i = 0; i < 5; i++) {
    const result = parseField(parts[i], FIELD_SPECS[i]);
    if (typeof result === "string") return { ok: false, error: result };
    fields.push(result);
  }
  return { ok: true, fields, expanded };
}

/** Cron's day rule: when both day fields are restricted, either one matching is enough. */
function matches(fields: ParsedField[], d: Date): boolean {
  const [minute, hour, dom, month, dow] = fields;
  if (!minute.values.has(d.getUTCMinutes())) return false;
  if (!hour.values.has(d.getUTCHours())) return false;
  if (!month.values.has(d.getUTCMonth() + 1)) return false;
  const domHit = dom.values.has(d.getUTCDate());
  const dowHit = dow.values.has(d.getUTCDay());
  return dom.star || dow.star ? domHit && dowHit : domHit || dowHit;
}

// The lab's "now" is fixed so the server render and the browser render agree.
const NOW_UTC_MINUTES = Date.UTC(2026, 9, 31, 7, 30) / 60000;
const SEARCH_MINUTES = 366 * 24 * 60;
const DHAKA_OFFSET_MINUTES = 6 * 60;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatClock(minutes: number) {
  const d = new Date(minutes * 60000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

function nextRuns(fields: ParsedField[], serverOffset: number, count: number): number[] {
  const runs: number[] = [];
  for (let t = NOW_UTC_MINUTES + 1; t <= NOW_UTC_MINUTES + SEARCH_MINUTES && runs.length < count; t++) {
    if (matches(fields, new Date((t + serverOffset) * 60000))) runs.push(t);
  }
  return runs;
}

function warningsFor(fields: ParsedField[], runs: number[]): string[] {
  const [minute, hour, dom, , dow] = fields;
  const notes: string[] = [];
  if (minute.text === "*" && hour.text !== "*") {
    notes.push("মিনিটের ঘরে * আর ঘণ্টা বাঁধা: ওই ঘণ্টার ভেতরে প্রতি মিনিটে একবার, মোট ৬০ বার চলবে। একবার চাইলে মিনিটে একটা সংখ্যা দিন, যেমন 0।");
  }
  if (!dom.star && !dow.star) {
    notes.push("মাসের দিন আর সপ্তাহের দিন দুইটাই বাঁধা, তাই cron এদের যেকোনো একটা মিললেই চালায়, দুইটা একসাথে মেলার অপেক্ষা করে না।");
  }
  for (const [field, size, unit] of [
    [minute, 60, "মিনিট"],
    [hour, 24, "ঘণ্টা"],
  ] as const) {
    const step = field.text.match(/^\*\/(\d+)$/);
    if (step && Number(step[1]) >= size) {
      notes.push(`*/${step[1]} এর ধাপ ${unit} এর ঘরের সীমার চেয়ে বড়, তাই শুধু শূন্যটা থাকে। crontab একটা Warning দিয়ে লাইনটা বসিয়ে নেয়, আর সেটা চলে প্রতি ${unit === "মিনিট" ? "ঘণ্টায়" : "দিনে"} একবার।`);
    } else if (step && size % Number(step[1]) !== 0) {
      notes.push(`*/${step[1]} প্রতি ${unit} সমান ফাঁকে চলে না: গোনা আবার শূন্য থেকে শুরু হয়, তাই শেষের ফাঁকটা ছোট। ${size} কে ভাগ করে এমন সংখ্যা নিন।`);
    }
  }
  if (runs.length === 0) notes.push("পরের এক বছরে একবারও মেলে না। এমন তারিখ চেয়েছেন যা নেই, যেমন ৩১ ফেব্রুয়ারি।");
  return notes;
}

const CRON_PRESETS = [
  { expr: "30 21 * * *", label: "রাতের Backup" },
  { expr: "*/15 * * * *", label: "প্রতি ১৫ মিনিট" },
  { expr: "0 9 * * 1-5", label: "কর্মদিবস 09:00" },
  { expr: "* 0 * * *", label: "ফাঁদ: মিনিটে *" },
  { expr: "0 0 1 * 1", label: "ফাঁদ: দুই দিনের ঘর" },
  { expr: "*/7 * * * *", label: "ফাঁদ: */7" },
  { expr: "0 0 31 2 *", label: "ফাঁদ: ৩১ ফেব্রুয়ারি" },
  { expr: "*/90 * * * *", label: "ফাঁদ: */90" },
  { expr: "@weekly", label: "@weekly" },
];

export function CronExpressionLab() {
  const [expr, setExpr] = useState("30 21 * * *");
  const [serverZone, setServerZone] = useState<"utc" | "dhaka">("utc");
  const serverOffset = serverZone === "utc" ? 0 : DHAKA_OFFSET_MINUTES;

  const parsed = useMemo(() => parseCron(expr), [expr]);
  const runs = useMemo(() => (parsed.ok ? nextRuns(parsed.fields, serverOffset, 6) : []), [parsed, serverOffset]);
  const notes = parsed.ok ? warningsFor(parsed.fields, runs) : [];

  return (
    <Panel
      label="Lab: cron লাইন পড়া"
      title="পাঁচটা ঘর লিখুন, পরের ছয়টা Run দেখুন"
      footer={
        <>
          ধরে নেওয়া হয়েছে এখন Sat 2026-10-31 07:30 UTC, ঠিক যখন এই লেসনের Output গুলো নেওয়া
          হয়েছিল। Server এর ঘড়ি বদলালে একই লাইন অন্য মুহূর্তে চলে, সেটা নিজে বদলে দেখুন। এই Lab
          Ubuntu এর cron এর নিয়মেই পড়ে: সপ্তাহের দিনে 7 মানে রবিবার, আর দুই দিনের ঘর বাঁধা থাকলে
          যেকোনো একটা মিললেই চলে। যাচাইয়ের আরেকটা উপায় Server এ নিজেই আছে:{" "}
          <code>systemd-analyze calendar</code>, যা Timer এর ভাষা পড়ে।
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {CRON_PRESETS.map((p) => (
          <Chip key={p.expr} active={expr === p.expr} onClick={() => setExpr(p.expr)}>
            {p.label}
          </Chip>
        ))}
      </div>

      <label className="block text-xs text-muted-foreground mb-2" htmlFor="cron-expr-input">
        সময়ের পাঁচটা ঘর, অথবা @daily এর মতো একটা শব্দ
      </label>
      <input
        id="cron-expr-input"
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        spellCheck={false}
        className="w-full font-mono text-base px-4 py-3 border border-border bg-background focus:outline-none focus:border-primary"
      />

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="text-xs text-muted-foreground mr-1">Server এর ঘড়ি:</span>
        <Chip active={serverZone === "utc"} onClick={() => setServerZone("utc")}>
          UTC (Island Tours)
        </Chip>
        <Chip active={serverZone === "dhaka"} onClick={() => setServerZone("dhaka")}>
          Asia/Dhaka
        </Chip>
      </div>

      {!parsed.ok ? (
        <div className="mt-6 flex items-start gap-3 border border-border bg-muted/30 p-4 text-sm">
          <X className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <span>{parsed.error}</span>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2">
            {parsed.fields.map((f, i) => {
              const spec = FIELD_SPECS[i];
              const all = f.values.size === (spec.key === "dow" ? 7 : spec.max - spec.min + 1);
              const list = [...f.values].sort((a, b) => a - b);
              return (
                <div key={spec.key} className="border border-border p-3">
                  <div className="text-[0.625rem] text-muted-foreground">{spec.label}</div>
                  <div className="font-mono text-sm font-bold text-primary mt-1">{f.text}</div>
                  <div className="text-[0.6875rem] text-muted-foreground mt-1 font-mono break-words">
                    {all ? "যেকোনো" : list.length > 8 ? `${list.slice(0, 8).join(",")},…` : list.join(",")}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="text-left font-bold py-2 pr-4">#</th>
                  <th className="text-left font-bold py-2 pr-4">UTC</th>
                  <th className="text-left font-bold py-2">Asia/Dhaka</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((t, i) => (
                  <tr key={t} className="border-t border-border">
                    <td className="py-2 pr-4 text-muted-foreground">{i + 1}</td>
                    <td className="py-2 pr-4">{formatClock(t)}</td>
                    <td className="py-2 text-primary">{formatClock(t + DHAKA_OFFSET_MINUTES)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {notes.length > 0 && (
            <div className="mt-5 space-y-2">
              {notes.map((n) => (
                <div key={n} className="flex items-start gap-3 border border-primary/40 bg-primary/5 p-3 text-sm">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <span>{n}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. ধীর কাজ, প্রতি মিনিটে: Lock ছাড়া, flock দিয়ে, Timer দিয়ে                      */
/* ------------------------------------------------------------------------- */

type OverlapMode = "none" | "flock-n" | "flock-w" | "timer";
type Attempt = { at: number; start: number | null; end: number | null; waited: number };

const ATTEMPT_TIMES = [0, 60, 120, 180, 240, 300];
const TIMELINE_SECONDS = 540;
const FLOCK_WAIT_SECONDS = 300;

function simulateOverlap(duration: number, mode: OverlapMode): Attempt[] {
  let lockFreeAt = 0;
  return ATTEMPT_TIMES.map((at) => {
    if (mode === "none") return { at, start: at, end: at + duration, waited: 0 };
    if (mode === "flock-n" || mode === "timer") {
      if (lockFreeAt > at) return { at, start: null, end: null, waited: 0 };
      lockFreeAt = at + duration;
      return { at, start: at, end: at + duration, waited: 0 };
    }
    const start = Math.max(at, lockFreeAt);
    if (start - at > FLOCK_WAIT_SECONDS) return { at, start: null, end: null, waited: FLOCK_WAIT_SECONDS };
    lockFreeAt = start + duration;
    return { at, start, end: start + duration, waited: start - at };
  });
}

function maxConcurrent(attempts: Attempt[]) {
  let best = 0;
  for (let t = 0; t < TIMELINE_SECONDS * 2; t++) {
    const running = attempts.filter((a) => a.start !== null && a.end !== null && a.start <= t && t < a.end).length;
    best = Math.max(best, running);
  }
  return best;
}

const MODE_LABEL: Record<OverlapMode, string> = {
  none: "কোনো Lock নেই",
  "flock-n": "flock -n",
  "flock-w": "flock -w 300",
  timer: "systemd Timer",
};

const MODE_NOTE: Record<OverlapMode, string> = {
  none: "cron ঘড়ি দেখে, আগের কাজ শেষ হয়েছে কি না দেখে না। ধীর কাজ জমতে থাকে, আর দুইটা Backup একই File এ লিখলে দুইটাই নষ্ট হতে পারে।",
  "flock-n": "-n মানে অপেক্ষা নয়: Lock অন্য কারো হাতে থাকলে এই Run টা সাথে সাথে বাদ। একসাথে কখনো একটার বেশি চলে না।",
  "flock-w": "-w মানে Lock এর জন্য কিছুক্ষণ অপেক্ষা। কাজ যদি Interval এর চেয়ে ধীর হয়, অপেক্ষার লাইন লম্বা হতেই থাকে আর কাজ ঘড়ি থেকে পিছিয়ে পড়ে।",
  timer: "Timer এর সময় হলে systemd তার জোড়া Service Start করে। Service আগের Run এ এখনো চলছে, তাই নতুন কিছু শুরু হয় না। আলাদা Lock লাগেই না।",
};

export function OverlapLab() {
  const [duration, setDuration] = useState(150);
  const [mode, setMode] = useState<OverlapMode>("none");
  const attempts = simulateOverlap(duration, mode);
  const ran = attempts.filter((a) => a.start !== null).length;
  const peak = maxConcurrent(attempts);
  const lastEnd = Math.max(...attempts.map((a) => a.end ?? 0));
  const pct = (s: number) => `${(Math.min(s, TIMELINE_SECONDS) / TIMELINE_SECONDS) * 100}%`;
  const clock = (s: number) => {
    const total = 29 * 60 + s;
    return `07:${String(Math.floor(total / 60)).padStart(2, "0")}`;
  };

  return (
    <Panel
      label="Lab: একসাথে দুইটা Backup"
      title="প্রতি মিনিটে একটা কাজ, যেটা নিজে কয়েক মিনিট নেয়"
      footer={
        <>
          ১৫০ সেকেন্ড আর Lock ছাড়া বেছে নিন, ঠিক এটাই Practice Server এ চালানো হয়েছিল: 07:31:01
          তে তিনটা কপি একসাথে চলছিল। flock -n এ একই Server এ Run হয়েছিল 07:29 আর 07:32 এ, মাঝের
          দুইটা বাদ। শেষ Run গুলো নয় মিনিটের এই ছবির বাইরে গেলে দাগটা ডান কিনারায় কেটে যায়।
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground mr-1">কাজটা নেয়:</span>
        {[40, 90, 150].map((d) => (
          <Chip key={d} active={duration === d} onClick={() => setDuration(d)}>
            {d} সেকেন্ড
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-xs text-muted-foreground mr-1">কীভাবে চালানো:</span>
        {(Object.keys(MODE_LABEL) as OverlapMode[]).map((m) => (
          <Chip key={m} active={mode === m} onClick={() => setMode(m)}>
            {MODE_LABEL[m]}
          </Chip>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        {attempts.map((a) => (
          <div key={a.at} className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] text-muted-foreground w-12 shrink-0">{clock(a.at)}</span>
            <div className="relative h-7 flex-1 border border-border bg-muted/20">
              {a.start === null ? (
                <span
                  className="absolute top-0 h-full flex items-center gap-1 pl-1 text-[0.6875rem] text-muted-foreground"
                  style={{ left: pct(a.at) }}
                >
                  <X className="w-3 h-3 text-primary" />
                  বাদ
                </span>
              ) : (
                <>
                  {a.waited > 0 && (
                    <span
                      className="absolute top-1/2 h-px border-t border-dashed border-muted-foreground"
                      style={{ left: pct(a.at), width: `calc(${pct(a.start)} - ${pct(a.at)})` }}
                    />
                  )}
                  <span
                    className="absolute top-1 bottom-1 bg-primary/70"
                    style={{ left: pct(a.start), width: `calc(${pct(a.end ?? 0)} - ${pct(a.start)})` }}
                  />
                </>
              )}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3">
          <span className="w-12 shrink-0" />
          <div className="relative flex-1 h-4">
            {[0, 120, 240, 360, 480].map((s) => (
              <span
                key={s}
                className="absolute font-mono text-[0.625rem] text-muted-foreground -translate-x-1/2"
                style={{ left: pct(s) }}
              >
                {clock(s)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="border border-border p-3">
          <div className="text-[0.625rem] text-muted-foreground">চালু হয়েছে</div>
          <div className="font-mono text-lg font-bold">{ran} / 6</div>
        </div>
        <div className={cn("border p-3", peak > 1 ? "border-primary bg-primary/5" : "border-border")}>
          <div className="text-[0.625rem] text-muted-foreground">সবচেয়ে বেশি একসাথে</div>
          <div className="font-mono text-lg font-bold">{peak}</div>
        </div>
        <div className="border border-border p-3">
          <div className="text-[0.625rem] text-muted-foreground">শেষ Run শেষ হলো</div>
          <div className="font-mono text-lg font-bold">{clock(lastEnd)}</div>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{MODE_NOTE[mode]}</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Backup এর সময় Server বন্ধ ছিল                                             */
/* ------------------------------------------------------------------------- */

type Downtime = "none" | "early" | "short" | "long";
type Scheduler = "cron" | "timer" | "persistent";

// Hours after 18:00 UTC on Oct 31. The backup is due at 21:30, which is 3.5.
const DOWNTIMES: Record<Downtime, { label: string; from: number | null; to: number | null; story: string }> = {
  none: { label: "সারা রাত চালু", from: null, to: null, story: "কিছুই ঘটেনি, Server সারা রাত চালু ছিল।" },
  early: { label: "21:00 থেকে 21:20 বন্ধ", from: 3, to: 3 + 20 / 60, story: "একটা Reboot, কিন্তু Backup এর দশ মিনিট আগেই Server ফিরে এসেছে।" },
  short: { label: "21:20 থেকে 21:45 বন্ধ", from: 3 + 20 / 60, to: 3.75, story: "Kernel Update এর পর Reboot, আর ঠিক এই পঁচিশ মিনিটের ভেতরে 21:30 পড়েছে।" },
  long: { label: "20:00 থেকে 02:00 বন্ধ", from: 2, to: 8, story: "Provider এর Maintenance, ছয় ঘণ্টা Server বন্ধ।" },
};

const SCHEDULER_LABEL: Record<Scheduler, string> = {
  cron: "cron, 30 21 * * *",
  timer: "Timer, Persistent ছাড়া",
  persistent: "Timer, Persistent=true",
};

function hourLabel(h: number) {
  const total = Math.round((18 + h) * 60);
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function MissedRunLab() {
  const [downtime, setDowntime] = useState<Downtime>("short");
  const [scheduler, setScheduler] = useState<Scheduler>("cron");
  const due = 3.5;
  const d = DOWNTIMES[downtime];
  const offAtDue = d.from !== null && d.to !== null && d.from <= due && due < d.to;
  // A persistent timer fires shortly after boot; on the practice server the catch-up came within a second.
  const ranAt = !offAtDue ? due : scheduler === "persistent" ? (d.to as number) : null;
  const span = 10;
  const pct = (h: number) => `${(h / span) * 100}%`;

  const verdict = !offAtDue
    ? "Backup ঠিক 21:30 এ চলেছে। Server চালু থাকলে তিনটা উপায়ই একই কাজ করে।"
    : scheduler === "persistent"
      ? `Server ফেরার পরপরই Backup চলেছে, ${hourLabel(d.to as number)} এ। systemd Stamp File দেখে বুঝেছে শেষ Run এর পর একটা সময় পার হয়ে গেছে যখন সে বন্ধ ছিল।`
      : scheduler === "timer"
        ? "আজ রাতের Backup হয়নি। Persistent ছাড়া Timer শুধু সামনের দিকে তাকায়, পরের Run কাল 21:30 এ।"
        : "আজ রাতের Backup হয়নি। cron প্রতি মিনিটে শুধু সেই মিনিটটা দেখে, পেছনে ফেলে আসা মিনিটের হিসাব রাখে না। কেউ টেরও পাবে না, যদি না Heartbeat দিয়ে নজর রাখা হয়।";

  return (
    <Panel
      label="Lab: ফসকে যাওয়া Run"
      title="Backup এর সময় Server বন্ধ থাকলে কী হয়"
      footer={
        <>
          Persistent=true এর আচরণটা Practice Server এ মাপা: একটা প্রতি মিনিটের Timer বন্ধ রেখে একটা
          মিনিট পার হতে দেওয়া হয়েছিল, আবার চালু করতেই Persistent ওয়ালাটা সেই সেকেন্ডেই চলেছে, অন্যটা
          পরের মিনিটের অপেক্ষায় ছিল। Ubuntu Server এ anacron Default এ থাকে না, তাই cron.daily এর
          কাজও ফসকে গেলে আর চলে না।
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground mr-1">আজ রাতে (UTC):</span>
        {(Object.keys(DOWNTIMES) as Downtime[]).map((k) => (
          <Chip key={k} active={downtime === k} onClick={() => setDowntime(k)}>
            {DOWNTIMES[k].label}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-xs text-muted-foreground mr-1">কে চালায়:</span>
        {(Object.keys(SCHEDULER_LABEL) as Scheduler[]).map((k) => (
          <Chip key={k} active={scheduler === k} onClick={() => setScheduler(k)}>
            {SCHEDULER_LABEL[k]}
          </Chip>
        ))}
      </div>

      <div className="mt-8">
        <div className="relative h-12 border border-border bg-muted/20">
          {d.from !== null && d.to !== null && (
            <span
              className="absolute top-0 bottom-0 bg-foreground/10 border-x border-dashed border-muted-foreground flex items-center justify-center text-[0.6875rem] text-muted-foreground"
              style={{ left: pct(d.from), width: `calc(${pct(d.to)} - ${pct(d.from)})` }}
            >
              বন্ধ
            </span>
          )}
          <span className="absolute -top-5 -translate-x-1/2 font-mono text-[0.625rem] text-muted-foreground" style={{ left: pct(due) }}>
            নির্ধারিত 21:30
          </span>
          <span className="absolute top-0 bottom-0 border-l border-muted-foreground" style={{ left: pct(due) }} />
          {ranAt !== null && (
            <span
              className="absolute top-2 bottom-2 w-3 -translate-x-1/2 bg-primary"
              style={{ left: pct(ranAt) }}
              title="Backup চলেছে"
            />
          )}
        </div>
        <div className="relative h-4 mt-1">
          {[0, 2, 4, 6, 8, 10].map((h) => (
            <span key={h} className="absolute -translate-x-1/2 font-mono text-[0.625rem] text-muted-foreground" style={{ left: pct(h) }}>
              {hourLabel(h)}
            </span>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "mt-6 flex items-start gap-3 border p-4 text-sm",
          ranAt === null ? "border-primary bg-primary/5" : "border-border bg-muted/20",
        )}
      >
        {ranAt === null ? (
          <X className="w-4 h-4 mt-0.5 text-primary shrink-0" />
        ) : (
          <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
        )}
        <span>
          <span className="text-muted-foreground">{d.story} </span>
          {verdict}
        </span>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. যে Job চলেনি: লক্ষণ থেকে কারণ                                              */
/* ------------------------------------------------------------------------- */

const SYMPTOMS: { id: string; symptom: string; causes: string[]; check: string }[] = [
  {
    id: "no-cmd",
    symptom: "Journal এ CMD লাইনই নেই",
    causes: [
      "সময়ের ঘর ভুল, অথবা UTC আর ঢাকার হিসাব গুলিয়ে গেছে",
      "/etc/cron.d এর File এর নামে ডট আছে, cron চুপচাপ এড়িয়ে যায়",
      "File এ Group বা অন্যদের লেখার অনুমতি আছে (INSECURE MODE)",
      "শেষ লাইনের পরে Newline নেই (Missing newline before EOF)",
      "/etc/crontab বা cron.d এর লাইনে User এর ঘর বাদ পড়েছে",
    ],
    check: "journalctl -t cron -t CRON --since today\nls -l /etc/cron.d/\nsystemctl status cron",
  },
  {
    id: "cmd-no-effect",
    symptom: "CMD লাইন আছে, কিন্তু কিছুই হয়নি",
    causes: [
      "Command চালু হয়েছিল, তারপর Error দিয়ে থেমেছে। Error গেছে Mail এ, আর MTA নেই বলে ফেলে দেওয়া",
      "CMD লাইন শুধু প্রমাণ করে শুরু হয়েছিল, সফল হয়েছে কি না বলে না",
    ],
    check: "journalctl -t CRON --since today | grep 'No MTA'\n# লাইনের শেষে যোগ করুন: >> /var/log/my-tours/job.log 2>&1",
  },
  {
    id: "works-by-hand",
    symptom: "হাতে চালালে চলে, cron এ চলে না",
    causes: [
      "Program টা ~/.local/bin বা nvm এর Folder এ, যা শুধু .bashrc PATH এ যোগ করে",
      "bash এর জিনিস (source, [[ ]]) লেখা, কিন্তু cron চালায় /bin/sh, মানে dash",
      "আপেক্ষিক Path, অথচ cron শুরু করে User এর HOME থেকে",
      "Environment Variable গুলো Terminal এ ছিল, cron এ নেই",
    ],
    check: "sudo -u mytours env -i PATH=/usr/bin:/bin /usr/local/bin/my-tours-backup\n* * * * * env > /tmp/cron-env.txt   # cron এর আসল পরিবেশ দেখতে",
  },
  {
    id: "percent",
    symptom: "Command অর্ধেক কাটা, যেমন CMD (date +)",
    causes: ["crontab এ % মানে নতুন লাইন। প্রথম % এর পরের সবটা Command এর stdin হয়ে যায়"],
    check: "date +\\%F    # crontab এ প্রতিটা % এর আগে \\",
  },
  {
    id: "wrong-time",
    symptom: "চলেছে, কিন্তু ভুল সময়ে",
    causes: [
      "Server এর ঘড়ি UTC, লাইনটা লেখা হয়েছিল ঢাকার সময় ধরে",
      "CRON_TZ বা TZ লাইন দিয়েছিলেন, Ubuntu এর cron সেটা মানে না",
    ],
    check: "timedatectl\nsystemd-analyze calendar '*-*-* 03:30:00 Asia/Dhaka'",
  },
  {
    id: "twice",
    symptom: "একই কাজ একসাথে দুইবার চলছে",
    causes: ["কাজটা Interval এর চেয়ে বেশি সময় নেয়, cron আগের Run শেষ হওয়ার অপেক্ষা করে না", "একই কাজ cron আর Timer দুই জায়গাতেই লেখা, অথবা App এর ভেতরেও একটা Scheduler"],
    check: "pgrep -fa my-tours-backup\nflock -n /run/lock/my-tours-backup.lock /usr/local/bin/my-tours-backup",
  },
  {
    id: "missed",
    symptom: "রাতে Server বন্ধ ছিল, সেই রাতের Backup নেই",
    causes: ["cron আর Persistent ছাড়া Timer ফসকে যাওয়া Run আর চালায় না"],
    check: "systemctl cat my-tours-backup.timer | grep Persistent\nls -l /var/lib/systemd/timers/",
  },
  {
    id: "timer-silent",
    symptom: "Timer বানিয়েছি, তবুও কিছু চলে না",
    causes: [
      ".timer এর বদলে .service কে enable করা হয়েছে, Service এর [Install] নেই বলে কিছুই হয় না",
      "File বদলানোর পর systemctl daemon-reload দেওয়া হয়নি",
      "Timer চালু হয়েছে কিন্তু Start হয়নি: enable দিয়েছেন, --now দেননি",
    ],
    check: "systemctl list-timers --all\nsystemctl status my-tours-backup.timer",
  },
];

export function JobDebugLab() {
  const [selected, setSelected] = useState(SYMPTOMS[0].id);
  const current = SYMPTOMS.find((s) => s.id === selected) ?? SYMPTOMS[0];
  return (
    <Panel
      label="Lab: যে Job চলেনি"
      title="লক্ষণ বেছে নিন, কারণ আর প্রমাণের Command দেখুন"
      footer={
        <>
          প্রতিটা কারণ এই লেসনের Practice Server এ ইচ্ছা করে ঘটানো হয়েছিল, আর Error এর লেখাগুলো
          সেখান থেকেই নেওয়া। প্রথম প্রশ্ন সবসময় একটাই: Journal এ CMD লাইন আছে কি না। থাকলে cron
          তার কাজ করেছে, খুঁজতে হবে Command এর ভেতরে। না থাকলে খুঁজতে হবে Schedule আর File এ।
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        {SYMPTOMS.map((s) => (
          <Chip key={s.id} active={selected === s.id} onClick={() => setSelected(s.id)}>
            {s.symptom}
          </Chip>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border p-4">
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-primary mb-3">
            সম্ভাব্য কারণ
          </div>
          <ol className="space-y-2 text-sm list-decimal pl-4">
            {current.causes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
        <div className="border border-border p-4 bg-muted/20">
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-primary mb-3">
            প্রমাণ করুন
          </div>
          <pre className="text-[0.75rem] font-mono whitespace-pre-wrap break-words leading-relaxed">{current.check}</pre>
        </div>
      </div>
    </Panel>
  );
}
