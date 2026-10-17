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
/* 1. নিজের WHERE বানান, Row ধরে ধরে দেখুন                                     */
/* ------------------------------------------------------------------------- */

/** The nine tours exactly as the sample database holds them. */
const TOURS = [
  { id: 1, title: "Saint Martin Island Escape", price: 12500, days: 3, active: true },
  { id: 2, title: "Cox's Bazar Beach Weekend", price: 8500, days: 2, active: true },
  { id: 3, title: "Sundarbans Mangrove Cruise", price: 18000, days: 3, active: true },
  { id: 4, title: "Sajek Valley Cloud Trip", price: 9500, days: 2, active: true },
  { id: 5, title: "Bandarban Hill Trek", price: 14000, days: 4, active: true },
  { id: 6, title: "Sylhet Tea Garden Tour", price: 7800, days: 2, active: true },
  { id: 7, title: "Ratargul Swamp Boat Day", price: 3500, days: 1, active: true },
  { id: 8, title: "Saint Martin Luxury Stay", price: 32000, days: 4, active: false },
  { id: 9, title: "Cox's Bazar Family Package", price: 15500, days: 3, active: true },
];

type Tour = (typeof TOURS)[number];

const CONDITIONS = [
  { id: "cheap", sql: "price_bdt < 10000", test: (t: Tour) => t.price < 10000 },
  { id: "long", sql: "duration_days >= 3", test: (t: Tour) => t.days >= 3 },
  { id: "active", sql: "is_active", test: (t: Tour) => t.active },
] as const;

type ConditionId = (typeof CONDITIONS)[number]["id"];

export function WhereBuilderLab() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState<ConditionId[]>(["cheap"]);
  const [joiner, setJoiner] = useState<"AND" | "OR">("AND");
  const [negate, setNegate] = useState(false);
  // How many rows have been checked so far. All nine unless the reader steps.
  const [checked, setChecked] = useState(TOURS.length);

  const active = CONDITIONS.filter((c) => enabled.includes(c.id));
  const inner = active.map((c) => c.sql).join(` ${joiner} `);
  const where = negate ? `NOT (${inner})` : inner;
  const passes = (t: Tour) => {
    const parts = active.map((c) => c.test(t));
    const value = joiner === "AND" ? parts.every(Boolean) : parts.some(Boolean);
    return negate ? !value : value;
  };
  const kept = TOURS.filter(passes).length;

  const toggle = (id: ConditionId) => {
    setChecked(TOURS.length);
    setEnabled((prev) => {
      if (prev.includes(id)) return prev.length === 1 ? prev : prev.filter((x) => x !== id);
      return CONDITIONS.map((c) => c.id).filter((x) => x === id || prev.includes(x));
    });
  };

  return (
    <Panel
      label="Interactive"
      title="নিজের WHERE বানান"
      footer="প্রতিটা Row এর মান sample database এর tours থেকে নেওয়া। যেকোনো Combination এর SQL টা কপি করে নিচের Query বক্সে চালালে ঠিক এই Row গুলোই ফেরত আসবে।"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
            শর্ত
          </span>
          {CONDITIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              data-condition={c.id}
              aria-pressed={enabled.includes(c.id)}
              onClick={() => toggle(c.id)}
              className={cn(BTN, "font-mono", enabled.includes(c.id) ? BTN_ON : BTN_OFF)}
            >
              {c.sql}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
            জোড়া
          </span>
          {(["AND", "OR"] as const).map((j) => (
            <button
              key={j}
              type="button"
              data-joiner={j}
              aria-pressed={joiner === j}
              disabled={active.length < 2}
              onClick={() => {
                setJoiner(j);
                setChecked(TOURS.length);
              }}
              className={cn(BTN, "font-mono disabled:opacity-40", joiner === j ? BTN_ON : BTN_OFF)}
            >
              {j}
            </button>
          ))}
          <button
            type="button"
            data-negate
            aria-pressed={negate}
            onClick={() => {
              setNegate((v) => !v);
              setChecked(TOURS.length);
            }}
            className={cn(BTN, "font-mono", negate ? BTN_ON : BTN_OFF)}
          >
            NOT ( … )
          </button>
        </div>

        <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-foreground">
          {`SELECT title FROM tours\nWHERE ${where};`}
        </pre>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-step-start
            onClick={() => setChecked(0)}
            className={cn(BTN, BTN_OFF)}
          >
            শুরু থেকে এক এক Row
          </button>
          <button
            type="button"
            data-step-next
            disabled={checked >= TOURS.length}
            onClick={() => setChecked((n) => Math.min(TOURS.length, n + 1))}
            className={cn(BTN, BTN_OFF, "disabled:opacity-40")}
          >
            পরের Row
          </button>
          <button
            type="button"
            data-step-all
            onClick={() => setChecked(TOURS.length)}
            className={cn(BTN, BTN_OFF)}
          >
            সব একবারে
          </button>
          <span className="font-mono text-[0.6875rem] text-muted-foreground" data-kept={kept}>
            {checked >= TOURS.length
              ? `ফলাফল: ${toBn(kept)}টা Row`
              : `${toBn(checked)}টা Row দেখা হয়েছে`}
          </span>
        </div>

        <div className="overflow-x-auto border border-border">
          <table className="w-full border-collapse font-mono text-[0.75rem]">
            <thead>
              <tr className="bg-muted/40 text-left">
                <th className="px-3 py-2 font-bold">title</th>
                <th className="px-3 py-2 font-bold text-right">price_bdt</th>
                <th className="px-3 py-2 font-bold text-right">days</th>
                <th className="px-3 py-2 font-bold">active</th>
                {active.map((c) => (
                  <th key={c.id} className="px-3 py-2 font-bold text-muted-foreground">
                    {c.sql}
                  </th>
                ))}
                <th className="px-3 py-2 font-bold">ফল</th>
              </tr>
            </thead>
            <tbody>
              {TOURS.map((t, i) => {
                const seen = i < checked;
                const current = i === checked - 1 && checked < TOURS.length;
                const ok = passes(t);
                return (
                  <motion.tr
                    key={t.id}
                    data-row={t.id}
                    data-pass={seen ? String(ok) : "unseen"}
                    initial={false}
                    animate={{ opacity: seen ? 1 : 0.35 }}
                    transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
                    className={cn(
                      "border-t border-border/60",
                      seen && ok && "bg-primary/10",
                      current && "outline outline-1 outline-primary"
                    )}
                  >
                    <td className="px-3 py-1.5 whitespace-nowrap">{t.title}</td>
                    <td className="px-3 py-1.5 text-right">{t.price.toFixed(2)}</td>
                    <td className="px-3 py-1.5 text-right">{t.days}</td>
                    <td className="px-3 py-1.5">{t.active ? "t" : "f"}</td>
                    {active.map((c) => (
                      <td key={c.id} className="px-3 py-1.5 text-muted-foreground">
                        {seen ? String(c.test(t)) : ""}
                      </td>
                    ))}
                    <td className={cn("px-3 py-1.5 font-bold", ok ? "text-primary" : "text-muted-foreground")}>
                      {seen ? (ok ? "রাখা" : "বাদ") : ""}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Parentheses ছাড়া আর সহ: কোন Row গুলো আলাদা                              */
/* ------------------------------------------------------------------------- */

/** booking_id, status, seats of all 24 bookings in the sample database. */
const BOOKINGS: [number, string, number][] = [
  [1, "confirmed", 2], [2, "confirmed", 4], [3, "confirmed", 1], [4, "confirmed", 3],
  [5, "cancelled", 2], [6, "confirmed", 2], [7, "confirmed", 1], [8, "confirmed", 2],
  [9, "confirmed", 2], [10, "confirmed", 1], [11, "confirmed", 2], [12, "cancelled", 2],
  [13, "confirmed", 2], [14, "pending", 4], [15, "confirmed", 3], [16, "confirmed", 2],
  [17, "pending", 2], [18, "cancelled", 1], [19, "confirmed", 2], [20, "pending", 2],
  [21, "confirmed", 3], [22, "confirmed", 1], [23, "confirmed", 5], [24, "pending", 2],
];

const READINGS = [
  {
    id: "plain",
    label: "Parentheses ছাড়া",
    sql: "status = 'confirmed' OR status = 'pending' AND seats >= 3",
    keep: (status: string, seats: number) => status === "confirmed" || (status === "pending" && seats >= 3),
    note: "PostgreSQL আগে AND জোড়া দেয়: pending AND seats >= 3। তারপর সেটার সাথে OR। তাই প্রতিটা confirmed Booking ঢুকে যায়, seats যতই কম হোক।",
  },
  {
    id: "grouped",
    label: "Parentheses সহ",
    sql: "(status = 'confirmed' OR status = 'pending') AND seats >= 3",
    keep: (status: string, seats: number) => (status === "confirmed" || status === "pending") && seats >= 3,
    note: "এবার OR আগে হিসাব হয়, কারণ সেটা Parentheses এর ভেতরে। তারপর পুরো ফলাফলের উপর seats >= 3 খাটে।",
  },
] as const;

export function PrecedenceLab() {
  const [reading, setReading] = useState<(typeof READINGS)[number]["id"]>("plain");
  const current = READINGS.find((r) => r.id === reading) ?? READINGS[0];
  const other = READINGS.find((r) => r.id !== reading) ?? READINGS[1];
  const kept = BOOKINGS.filter(([, status, seats]) => current.keep(status, seats)).length;

  return (
    <Panel
      label="Interactive"
      title="একই শর্ত, দুই রকম পাঠ"
      footer="২৪টা Booking এর status আর seats sample database থেকে নেওয়া। লাল দাগ দেওয়া Row গুলো সেগুলো, যেগুলো দুই পাঠে আলাদা ফল পায়।"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {READINGS.map((r) => (
            <button
              key={r.id}
              type="button"
              data-reading={r.id}
              aria-pressed={reading === r.id}
              onClick={() => setReading(r.id)}
              className={cn(BTN, reading === r.id ? BTN_ON : BTN_OFF)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-foreground">
          {`SELECT booking_id, status, seats FROM bookings\nWHERE ${current.sql};`}
        </pre>
        <p className="text-sm leading-relaxed text-muted-foreground">{current.note}</p>
        <p className="font-mono text-[0.75rem] text-foreground" data-kept={kept}>
          ফলাফল: {toBn(kept)}টা Row
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {BOOKINGS.map(([id, status, seats]) => {
            const keep = current.keep(status, seats);
            const differs = keep !== other.keep(status, seats);
            return (
              <div
                key={id}
                data-booking={id}
                data-keep={String(keep)}
                className={cn(
                  "border px-2.5 py-2 font-mono text-[0.6875rem] leading-snug transition-colors",
                  keep ? "border-primary/60 bg-primary/10 text-foreground" : "border-border text-muted-foreground/70",
                  differs && "ring-1 ring-destructive/60"
                )}
              >
                <span className="block font-bold">#{id}</span>
                <span className="block">{status}</span>
                <span className="block">seats {seats}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
