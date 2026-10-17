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

/** All 24 bookings of the sample database, newest first (booked_at DESC, booking_id DESC). */
const BOOKINGS = [
  { id: 24, at: "2026-10-14 11:05" },
  { id: 23, at: "2026-10-13 20:55" },
  { id: 22, at: "2026-10-12 08:30" },
  { id: 21, at: "2026-10-11 18:00" },
  { id: 20, at: "2026-10-10 17:20" },
  { id: 17, at: "2026-10-08 09:15" },
  { id: 19, at: "2026-10-04 13:40" },
  { id: 16, at: "2026-10-02 10:05" },
  { id: 14, at: "2026-10-01 12:25" },
  { id: 18, at: "2026-09-28 23:30" },
  { id: 15, at: "2026-09-20 19:45" },
  { id: 13, at: "2026-09-15 21:10" },
  { id: 11, at: "2026-03-25 07:50" },
  { id: 10, at: "2026-03-02 14:00" },
  { id: 9, at: "2026-03-01 16:35" },
  { id: 8, at: "2026-02-20 11:20" },
  { id: 12, at: "2026-01-30 15:30" },
  { id: 7, at: "2026-01-28 08:05" },
  { id: 6, at: "2026-01-25 22:40" },
  { id: 3, at: "2026-01-10 09:30" },
  { id: 5, at: "2026-01-06 12:10" },
  { id: 4, at: "2026-01-05 18:45" },
  { id: 2, at: "2025-12-28 20:02" },
  { id: 1, at: "2025-12-20 10:15" },
];

/* ------------------------------------------------------------------------- */
/* 1. পাতার অঙ্ক: পাতা p, আকার s, OFFSET কত                                     */
/* ------------------------------------------------------------------------- */

const SIZES = [3, 5, 8];

export function PageMathLab() {
  const reduce = useReducedMotion();
  const [size, setSize] = useState(5);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(BOOKINGS.length / size);
  const current = Math.min(page, totalPages);
  const offset = (current - 1) * size;
  const shown = BOOKINGS.slice(offset, offset + size);

  return (
    <Panel
      label="Interactive"
      title="পাতার আকার আর পাতা বাছুন, OFFSET নিজে হিসাব হবে"
      footer={
        <>
          তালিকাটা Sample Database এর ২৪টা Booking, নতুন থেকে পুরনো। OFFSET হলো পাতার
          নম্বর থেকে ১ বাদ দিয়ে পাতার আকার দিয়ে গুণ, আর মোট পাতা হলো ২৪ কে পাতার আকার
          দিয়ে ভাগ করে উপরের দিকে গোল করা। শেষ পাতায় প্রায়ই Row কম থাকে, সেটা
          স্বাভাবিক।
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mr-1">
          পাতার আকার
        </span>
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            data-size={s}
            onClick={() => {
              setSize(s);
              setPage(1);
            }}
            className={cn(BTN, s === size ? BTN_ON : BTN_OFF)}
          >
            {toBn(s)}টা
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mr-1">
          পাতা
        </span>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            data-page={p}
            onClick={() => setPage(p)}
            className={cn(BTN, "min-w-9 text-center", p === current ? BTN_ON : BTN_OFF)}
          >
            {toBn(p)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed">
            <span className="text-muted-foreground">OFFSET = ({toBn(current)} − ১) × {toBn(size)} = </span>
            <span className="font-bold text-primary" data-offset={offset}>
              {toBn(offset)}
            </span>
          </div>
          <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground">
            {`SELECT booking_id, booked_at
FROM bookings
ORDER BY booked_at DESC, booking_id DESC
LIMIT ${size} OFFSET ${offset};`}
          </pre>
          <p className="text-sm leading-relaxed text-muted-foreground">
            মোট {toBn(BOOKINGS.length)}টা Row, প্রতি পাতায় {toBn(size)}টা, তাই মোট{" "}
            <strong className="text-foreground">{toBn(totalPages)}</strong> পাতা। এই পাতায়{" "}
            <strong className="text-foreground" data-rows={shown.length}>
              {toBn(shown.length)}
            </strong>
            টা Row।
          </p>
        </div>
        <ol className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {BOOKINGS.map((b, i) => {
            const on = i >= offset && i < offset + size;
            const skipped = i < offset;
            return (
              <motion.li
                key={b.id}
                layout={!reduce}
                transition={{ duration: 0.3, ease: EASE }}
                className={cn(
                  "border px-2 py-1 font-mono text-[0.625rem] leading-tight transition-colors duration-300",
                  on
                    ? "border-primary bg-primary/10 text-primary"
                    : skipped
                      ? "border-dashed border-border text-muted-foreground/50"
                      : "border-border text-muted-foreground"
                )}
              >
                <span className="block font-bold">#{b.id}</span>
                <span className="block opacity-80">{b.at.slice(5)}</span>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. দুই পাতার মাঝখানে Data বদলালে                                              */
/* ------------------------------------------------------------------------- */

type Mode = "offset" | "keyset";
type Change = "insert" | "delete";

const NEW_BOOKING = { id: 25, at: "2026-10-15 09:00" };

function listAfter(change: Change) {
  return change === "insert" ? [NEW_BOOKING, ...BOOKINGS] : BOOKINGS.filter((b) => b.id !== 24);
}

/** Page 2 as each method would fetch it after the change. Page size is 5. */
function pageTwo(mode: Mode, change: Change) {
  const rows = listAfter(change);
  if (mode === "offset") return rows.slice(5, 10);
  // Keyset: everything strictly older than the last row we showed on page 1, booking 20.
  const lastIndex = rows.findIndex((b) => b.id === 20);
  return rows.slice(lastIndex + 1, lastIndex + 6);
}

const STEPS = [
  { id: 1, label: "১. পাতা ১ দেখান" },
  { id: 2, label: "২. এর মধ্যে Data বদলাল" },
  { id: 3, label: "৩. পাতা ২ চান" },
];

export function ShiftingPagesLab() {
  const [mode, setMode] = useState<Mode>("offset");
  const [change, setChange] = useState<Change>("insert");
  const [step, setStep] = useState(1);

  const pageOne = BOOKINGS.slice(0, 5);
  const seen = new Set(pageOne.map((b) => b.id));
  const second = pageTwo(mode, change);
  const fullAfter = listAfter(change);
  // Every older row down to the last one on page 2 should have been shown on
  // page 1 or page 2. Whatever is in that stretch but on neither page was skipped.
  const lastShown = fullAfter.findIndex((b) => b.id === second[second.length - 1]?.id);
  const missed = fullAfter
    .slice(0, lastShown + 1)
    .filter((b) => b.id !== NEW_BOOKING.id && !seen.has(b.id) && !second.some((s) => s.id === b.id));
  const duplicated = second.filter((b) => seen.has(b.id));

  const verdict =
    duplicated.length > 0
      ? `booking ${duplicated.map((b) => b.id).join(", ")} দুইবার দেখা গেল`
      : missed.length > 0
        ? `booking ${missed.map((b) => b.id).join(", ")} কখনো দেখাই গেল না`
        : "কোনো Row দুইবার আসেনি, কোনোটা হারায়নি";

  return (
    <Panel
      label="Interactive"
      title="দুই পাতার মাঝখানে নতুন Booking এলে বা একটা মুছে গেলে"
      footer={
        <>
          পাতার আকার ৫। পাতা ১ দেখানোর পর, পাতা ২ চাওয়ার আগে, Database এ একটা বদল হলো।
          নতুন Booking টা (booking 25, ১৫ অক্টোবর) বানানো উদাহরণ, Sample Data তে নেই।
          মুছে যাওয়া Booking টা আসল booking 24। Keyset এর বুকমার্ক হলো পাতা ১ এর শেষ
          Row, booking 20। নতুন booking 25 পাতা ২ তে আসে না, কারণ সেটা পাতা ১ এর চেয়েও
          নতুন। পাতা ১ আবার খুললে সেটা মাথায় দেখা যাবে, ঠিক যেমন হওয়া উচিত।
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {(["offset", "keyset"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            data-mode={m}
            onClick={() => setMode(m)}
            className={cn(BTN, m === mode ? BTN_ON : BTN_OFF)}
          >
            {m === "offset" ? "OFFSET 5" : "Keyset (বুকমার্ক)"}
          </button>
        ))}
        <span className="w-px bg-border mx-1" />
        {(["insert", "delete"] as Change[]).map((c) => (
          <button
            key={c}
            type="button"
            data-change={c}
            onClick={() => setChange(c)}
            className={cn(BTN, c === change ? BTN_ON : BTN_OFF)}
          >
            {c === "insert" ? "নতুন Booking এল" : "একটা Booking মুছে গেল"}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            data-step={s.id}
            onClick={() => setStep(s.id)}
            className={cn(BTN, s.id === step ? BTN_ON : BTN_OFF)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-border bg-background p-4">
          <p className="mb-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            পাতা ১ (আগেই দেখানো)
          </p>
          <ul className="space-y-1.5">
            {pageOne.map((b) => (
              <li key={b.id} className="flex justify-between font-mono text-[0.75rem]">
                <span>#{b.id}</span>
                <span className="text-muted-foreground">{b.at.slice(5)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-border bg-background p-4" data-result={step === 3 ? verdict : ""}>
          <p className="mb-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            {step < 2 ? "এখনো কিছু বদলায়নি" : step === 2 ? "Database এ বদল" : "পাতা ২"}
          </p>
          {step === 2 && (
            <p className="text-sm leading-relaxed text-foreground">
              {change === "insert"
                ? "একজন নতুন Customer এইমাত্র বুক করলেন: booking 25, সময় ১৫ অক্টোবর ০৯:০০। সবচেয়ে নতুন বলে সে তালিকার একদম মাথায় বসল, আর বাকি সবাইকে এক ঘর নিচে ঠেলে দিল।"
                : "booking 24 মুছে ফেলা হলো। তালিকার মাথা থেকে একটা Row চলে গেল, তাই বাকি সবাই এক ঘর উপরে উঠে এল।"}
            </p>
          )}
          {step === 3 && (
            <>
              <ul className="space-y-1.5">
                {second.map((b) => {
                  const dup = seen.has(b.id);
                  return (
                    <li
                      key={b.id}
                      className={cn(
                        "flex justify-between font-mono text-[0.75rem] px-1",
                        dup && "bg-destructive/10 text-destructive"
                      )}
                    >
                      <span>
                        #{b.id}
                        {dup && " (আবার!)"}
                      </span>
                      <span className={dup ? undefined : "text-muted-foreground"}>{b.at.slice(5)}</span>
                    </li>
                  );
                })}
              </ul>
              <p
                className={cn(
                  "mt-3 border-t border-border pt-3 text-sm font-bold",
                  duplicated.length || missed.length ? "text-destructive" : "text-primary"
                )}
              >
                {verdict}
              </p>
            </>
          )}
          {step === 1 && (
            <p className="text-sm text-muted-foreground">ধাপ ২ চাপুন।</p>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. গভীর পাতায় কতগুলো Row ছুঁতে হয়                                            */
/* ------------------------------------------------------------------------- */

const DEPTHS = [1, 10, 100, 1000, 10000];
const PAGE_SIZE = 20;

export function OffsetCostLab() {
  const [page, setPage] = useState(1);
  const offsetRows = page * PAGE_SIZE;
  const keysetRows = PAGE_SIZE;
  // Bars on a log scale, so page 1 and page 10,000 both stay visible.
  const scale = (n: number) => Math.max(2, (Math.log10(n) / Math.log10(DEPTHS[DEPTHS.length - 1] * PAGE_SIZE)) * 100);

  return (
    <Panel
      label="Interactive"
      title="পাতা যত গভীর, OFFSET তত বেশি Row ছোঁয়"
      footer={
        <>
          এটা গোনার হিসাব, মাপা সময় না: প্রতি পাতায় ২০টা Row, আর ধরা হয়েছে সাজানোর
          Column এ Index আছে। OFFSET কে বাদ দেওয়া Row গুলোও পড়তে হয় (PostgreSQL এর Docs
          এর ভাষায়, সেগুলো Server এর ভেতরে হিসাব করতেই হয়)। Keyset বুকমার্ক থেকে শুরু
          করে বলে প্রতি পাতায় একই কাজ। বার গুলো Log Scale এ আঁকা।
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {DEPTHS.map((d) => (
          <button
            key={d}
            type="button"
            data-depth={d}
            onClick={() => setPage(d)}
            className={cn(BTN, d === page ? BTN_ON : BTN_OFF)}
          >
            পাতা {toBn(d.toLocaleString("en-US"))}
          </button>
        ))}
      </div>
      <div className="space-y-5">
        {[
          { name: `OFFSET ${((page - 1) * PAGE_SIZE).toLocaleString("en-US")} LIMIT 20`, rows: offsetRows, accent: false },
          { name: "Keyset ... LIMIT 20", rows: keysetRows, accent: true },
        ].map((row) => (
          <div key={row.name}>
            <div className="flex flex-wrap justify-between gap-2 mb-1.5 font-mono text-[0.6875rem]">
              <span className={row.accent ? "text-primary font-bold" : "text-foreground font-bold"}>{row.name}</span>
              <span className="text-muted-foreground" data-rows-touched={row.rows}>
                {toBn(row.rows.toLocaleString("en-US"))}টা Row ছোঁয়া, ২০টা ফেরত
              </span>
            </div>
            <div className="h-4 border border-border bg-background">
              <div
                className={cn("h-full transition-[width] duration-500", row.accent ? "bg-primary" : "bg-foreground/40")}
                style={{ width: `${scale(row.rows)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
