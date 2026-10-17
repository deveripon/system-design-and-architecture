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
/* 1. DISTINCT কে Row ধরে ধরে চলতে দেখা                                        */
/* ------------------------------------------------------------------------- */

type Value = string | null;

/** Real columns from the sample database, in primary key order. */
const DATASETS: {
  id: string;
  label: string;
  sql: string;
  columns: string[];
  rows: Value[][];
  note: string;
}[] = [
  {
    id: "country",
    label: "customers.country",
    sql: "SELECT DISTINCT country FROM customers;",
    columns: ["country"],
    rows: [
      "Bangladesh", "Bangladesh", "Bangladesh", "Bangladesh", "Bangladesh",
      "Bangladesh", "Bangladesh", "Bangladesh", "India", "Malaysia",
      "United Kingdom", "Bangladesh", "Bangladesh", "Bangladesh", "Bangladesh",
    ].map((v) => [v]),
    note: "পনেরো Row, চারটা আলাদা দেশ। Bangladesh প্রথম Row তেই ঢুকে গেছে, তারপর বারোবার এসে প্রতিবার বাদ পড়েছে।",
  },
  {
    id: "status",
    label: "bookings.status",
    sql: "SELECT DISTINCT status FROM bookings;",
    columns: ["status"],
    rows: [
      "confirmed", "confirmed", "confirmed", "confirmed", "cancelled", "confirmed",
      "confirmed", "confirmed", "confirmed", "confirmed", "confirmed", "cancelled",
      "confirmed", "pending", "confirmed", "confirmed", "pending", "cancelled",
      "confirmed", "pending", "confirmed", "confirmed", "confirmed", "pending",
    ].map((v) => [v]),
    note: "চব্বিশ Row, তিনটা status। pending প্রথম আসে চোদ্দ নম্বর Row তে। মাঝপথে থামলে মনে হতো status মাত্র দুটো: DISTINCT এর উত্তর পুরো Table পড়ার পরই সম্পূর্ণ।",
  },
  {
    id: "region-kind",
    label: "destinations (region, kind)",
    sql: "SELECT DISTINCT region, kind FROM destinations;",
    columns: ["region", "kind"],
    rows: [
      ["Chattogram", "island"],
      ["Chattogram", "beach"],
      ["Khulna", "forest"],
      ["Chattogram", "hills"],
      ["Chattogram", "hills"],
      ["Sylhet", "tea_garden"],
      ["Barishal", "beach"],
    ],
    note: "দুই Column একসাথে। Chattogram চারবার আছে, beach দুইবার, তবু শুধু Chattogram আর hills এর জোড়াটাই হুবহু দুইবার, তাই সাত থেকে ছয়।",
  },
  {
    id: "phone",
    label: "customers.phone",
    sql: "SELECT DISTINCT phone FROM customers;",
    columns: ["phone"],
    rows: [
      "+8801000000101", "+8801000000102", null, "+8801000000104", "+8801000000105",
      null, "+8801000000107", "+8801000000108", null, null,
      null, "+8801000000112", "+8801000000113", "+8801000000114", "+8801000000115",
    ].map((v) => [v]),
    note: "পাঁচজনের ফোন নম্বর নেই, মানে পাঁচটা NULL। WHERE এ NULL = NULL কখনো সত্য হয় না, অথচ DISTINCT পাঁচটা NULL কে একটাই মান ধরে, তাই উত্তরে NULL একবার। দশটা নম্বর আর একটা NULL, মোট এগারো।",
  },
];

const rowKey = (row: Value[]) => JSON.stringify(row);

export function DistinctStepLab() {
  const reduce = useReducedMotion();
  const [datasetId, setDatasetId] = useState(DATASETS[0].id);
  const [step, setStep] = useState(0);
  const data = DATASETS.find((d) => d.id === datasetId) ?? DATASETS[0];
  const total = data.rows.length;
  const done = step >= total;

  // Which processed rows were kept: a row is kept when it is the first of its kind.
  const firstIndex = new Map<string, number>();
  data.rows.forEach((row, i) => {
    if (!firstIndex.has(rowKey(row))) firstIndex.set(rowKey(row), i);
  });
  const isKept = (i: number) => firstIndex.get(rowKey(data.rows[i])) === i;
  const kept = data.rows.filter((_, i) => i < step && isKept(i));
  const dropped = step - kept.length;

  const choose = (id: string) => {
    setDatasetId(id);
    setStep(0);
  };

  return (
    <Panel
      label="Interactive"
      title="DISTINCT Row ধরে ধরে"
      footer="প্রতিবার Next চাপলে DISTINCT একটা Row পড়ে আর জিজ্ঞেস করে: এই মানটা কি আগে দেখেছি? না দেখলে উত্তরে রাখে, দেখলে বাদ দেয়। বাস্তবে PostgreSQL এই কাজ একটা Hash Table বা সাজানো তালিকা দিয়ে করে, কিন্তু ফলাফল একই।"
    >
      <div className="flex flex-wrap gap-2 mb-5" data-lab="distinct-step">
        {DATASETS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => choose(d.id)}
            data-dataset={d.id}
            aria-pressed={d.id === datasetId}
            className={cn(BTN, "font-mono", d.id === datasetId ? BTN_ON : BTN_OFF)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <p className="mb-4 font-mono text-[0.75rem] text-foreground">{data.sql}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(total, s + 1))}
          disabled={done}
          className={cn(BTN, BTN_OFF, "disabled:opacity-40")}
        >
          Next row
        </button>
        <button
          type="button"
          onClick={() => setStep(total)}
          disabled={done}
          className={cn(BTN, BTN_OFF, "disabled:opacity-40")}
        >
          শেষ পর্যন্ত চালান
        </button>
        <button type="button" onClick={() => setStep(0)} className={cn(BTN, BTN_OFF)}>
          Reset
        </button>
        <span
          className="ml-auto self-center font-mono text-[0.6875rem] text-muted-foreground"
          data-step={step}
          data-kept={kept.length}
        >
          পড়া হয়েছে {toBn(step)}/{toBn(total)} · রাখা {toBn(kept.length)} · বাদ {toBn(dropped)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6">
        <div>
          <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
            Input, Table এর Row
          </p>
          <ol className="space-y-1">
            {data.rows.map((row, i) => {
              const read = i < step;
              const keep = read && isKept(i);
              return (
                <li
                  key={i}
                  className={cn(
                    "flex items-center gap-3 border px-3 py-1 font-mono text-[0.75rem] transition-colors",
                    !read && "border-border/50 text-muted-foreground/50",
                    keep && "border-primary/60 bg-primary/10 text-foreground",
                    read && !keep && "border-border text-muted-foreground line-through"
                  )}
                >
                  <span className="w-6 shrink-0 tabular-nums opacity-60">{i + 1}</span>
                  <span className="flex-1 min-w-0 truncate">
                    {row.map((v) => (v === null ? "NULL" : v)).join("  |  ")}
                  </span>
                  {read && (
                    <span className={cn("shrink-0 no-underline text-[0.625rem]", keep ? "text-primary" : "")}>
                      {keep ? "নতুন, রাখা হলো" : "আগেই আছে, বাদ"}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        <div>
          <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-primary">
            Output, DISTINCT এর উত্তর
          </p>
          <ul className="space-y-1">
            {kept.map((row) => (
              <motion.li
                key={rowKey(row)}
                initial={reduce ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="border border-primary/60 bg-primary/5 px-3 py-1 font-mono text-[0.75rem] text-foreground"
              >
                {row.map((v) => (v === null ? "NULL" : v)).join("  |  ")}
              </motion.li>
            ))}
          </ul>
          {done && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground" data-note={data.id}>
              {data.note}
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. DISTINCT ON: কোন Row টা থাকবে, ORDER BY ঠিক করে                         */
/* ------------------------------------------------------------------------- */

interface Booking {
  customer: number;
  name: string;
  booking: number;
  status: string;
  at: string;
}

/** Bookings of customers 1, 2, 3, 5 and 6 from the sample data, oldest first. */
const BOOKINGS: Booking[] = [
  { customer: 1, name: "Rahim Uddin", booking: 1, status: "confirmed", at: "2025-12-20 10:15" },
  { customer: 1, name: "Rahim Uddin", booking: 8, status: "confirmed", at: "2026-02-20 11:20" },
  { customer: 1, name: "Rahim Uddin", booking: 17, status: "pending", at: "2026-10-08 09:15" },
  { customer: 2, name: "Nusrat Jahan", booking: 2, status: "confirmed", at: "2025-12-28 20:02" },
  { customer: 2, name: "Nusrat Jahan", booking: 13, status: "confirmed", at: "2026-09-15 21:10" },
  { customer: 3, name: "Tanvir Ahmed", booking: 3, status: "confirmed", at: "2026-01-10 09:30" },
  { customer: 3, name: "Tanvir Ahmed", booking: 22, status: "confirmed", at: "2026-10-12 08:30" },
  { customer: 5, name: "Sabbir Hossain", booking: 5, status: "cancelled", at: "2026-01-06 12:10" },
  { customer: 6, name: "Mitu Rahman", booking: 6, status: "confirmed", at: "2026-01-25 22:40" },
  { customer: 6, name: "Mitu Rahman", booking: 18, status: "cancelled", at: "2026-09-28 23:30" },
];

const ORDERS = [
  {
    id: "newest",
    label: "booked_at DESC",
    sql: "ORDER BY customer_id, booked_at DESC",
    meaning: "প্রতিটা Customer এর সবচেয়ে নতুন Booking",
  },
  {
    id: "oldest",
    label: "booked_at ASC",
    sql: "ORDER BY customer_id, booked_at",
    meaning: "প্রতিটা Customer এর প্রথম Booking",
  },
  {
    id: "none",
    label: "শুধু customer_id",
    sql: "ORDER BY customer_id",
    meaning: "দলের ভেতরে কোনো ক্রম বলা হয়নি",
  },
] as const;

export function DistinctOnLab() {
  const reduce = useReducedMotion();
  const [orderId, setOrderId] = useState<(typeof ORDERS)[number]["id"]>("newest");
  const order = ORDERS.find((o) => o.id === orderId) ?? ORDERS[0];
  const customers = Array.from(new Set(BOOKINGS.map((b) => b.customer)));
  const groups = customers.map((c) => {
    const rows = BOOKINGS.filter((b) => b.customer === c);
    return orderId === "newest" ? [...rows].reverse() : rows;
  });
  const decided = orderId !== "none";

  return (
    <Panel
      label="Interactive"
      title="DISTINCT ON, কোন Row টা থাকবে"
      footer="DISTINCT ON (customer_id) প্রতিটা Customer এর জন্য ঠিক একটা Row রাখে: সাজানোর পর যেটা প্রথমে আসে। দলের ভেতরের ক্রম ORDER BY এ না বললে PostgreSQL যেকোনো একটা Row রাখতে পারে, আর পরেরবার অন্যটা রাখতেও পারে। তাই DISTINCT ON এর সাথে সবসময় পুরো ORDER BY লিখুন।"
    >
      <div className="flex flex-wrap gap-2 mb-5" data-lab="distinct-on">
        {ORDERS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setOrderId(o.id)}
            data-order={o.id}
            aria-pressed={o.id === orderId}
            className={cn(BTN, "font-mono", o.id === orderId ? BTN_ON : BTN_OFF)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <pre className="mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground">
        {`SELECT DISTINCT ON (customer_id)
       customer_id, booking_id, status, booked_at
FROM bookings
WHERE customer_id IN (1, 2, 3, 5, 6)
${order.sql};`}
      </pre>

      <p className="mb-4 text-sm text-muted-foreground" data-meaning={order.id}>
        মানে: {order.meaning}
      </p>

      <div className="space-y-4">
        {groups.map((rows) => (
          <div key={rows[0].customer} className="border border-border">
            <p className="border-b border-border bg-muted/30 px-3 py-1.5 font-mono text-[0.6875rem] text-muted-foreground">
              customer {rows[0].customer}, {rows[0].name}
            </p>
            <ul className="divide-y divide-border/60">
              {rows.map((r, i) => {
                const keep = decided && i === 0;
                const maybe = !decided && rows.length > 1;
                return (
                  <motion.li
                    key={`${orderId}-${r.booking}`}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    data-kept={keep || (!decided && rows.length === 1) ? "yes" : maybe ? "maybe" : "no"}
                    className={cn(
                      "grid grid-cols-[5.5rem_6rem_minmax(0,1fr)_auto] items-center gap-3 px-3 py-1.5 font-mono text-[0.75rem]",
                      keep && "bg-primary/10 text-foreground",
                      decided && !keep && "text-muted-foreground line-through",
                      maybe && "text-foreground"
                    )}
                  >
                    <span>booking {r.booking}</span>
                    <span>{r.status}</span>
                    <span className="truncate">{r.at}</span>
                    <span className={cn("no-underline text-[0.625rem]", keep ? "text-primary" : "text-muted-foreground")}>
                      {keep && "রাখা হলো"}
                      {decided && !keep && "বাদ"}
                      {!decided && (rows.length === 1 ? "একটাই, তাই এটাই" : "এটাও হতে পারে")}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {!decided && (
        <p className="mt-5 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm leading-relaxed text-foreground">
          এই Query চলবে, Error দেবে না। কিন্তু Rahim, Nusrat, Tanvir আর Mitu এর ক্ষেত্রে কোন
          Booking টা আসবে, তার কোনো নিশ্চয়তা নেই। আজ একটা, Data বাড়লে বা Plan বদলালে
          কাল আরেকটা। চুপচাপ বদলে যাওয়া উত্তরই সবচেয়ে বিপজ্জনক।
        </p>
      )}
    </Panel>
  );
}
