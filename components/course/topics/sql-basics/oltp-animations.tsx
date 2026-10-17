"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
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

const BTN = "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors";
const BTN_ON = "border-primary bg-primary/10 text-primary";
const BTN_OFF = "border-border text-muted-foreground hover:text-foreground hover:border-primary/40";

/* ------------------------------------------------------------------------- */
/* 1. কাজটা OLTP না OLAP, নিজে বাছাই করুন                                       */
/* ------------------------------------------------------------------------- */

type Kind = "oltp" | "olap";

type Task = {
  id: string;
  task: string;
  answer: Kind;
  rows: string;
  often: string;
  why: string;
};

const TASKS: Task[] = [
  {
    id: "book",
    task: "একজন Customer Saint Martin ট্যুরের ১৮ ডিসেম্বরের তারিখে ২টা সিট বুক করলেন",
    answer: "oltp",
    rows: "২টা Row লেখা, ১টা Row বদলানো",
    often: "দিনে শত শত বার",
    why: "একটা নতুন Booking এর Row ঢোকে আর সেই তারিখের seats_left কমে। ছোট, নির্দিষ্ট, আর Customer উত্তরের জন্য স্ক্রিনের সামনে অপেক্ষা করছেন। একদম আদর্শ OLTP।",
  },
  {
    id: "seats",
    task: "ট্যুরের পাতায় দেখাতে হবে এই তারিখে আর কয়টা সিট খালি",
    answer: "oltp",
    rows: "১টা Row পড়া",
    often: "প্রতিটা পাতা খোলায়",
    why: "departure_id দিয়ে ঠিক একটা Row খুঁজে seats_left পড়া। উত্তর হতে হবে এই মুহূর্তের, কয়েক মিনিট আগের হলেও চলবে না, কারণ ভুল সংখ্যা দেখালে দুইজন একই শেষ সিট বুক করতে চাইবেন।",
  },
  {
    id: "monthly",
    task: "Accountant জানতে চান ২০২৬ সালের প্রতি মাসে confirmed Booking থেকে কত টাকা এসেছে",
    answer: "olap",
    rows: "সারা বছরের সব Booking পড়া",
    often: "মাসে একবার",
    why: "উত্তর একটা ছোট Table, কিন্তু সেটা বের করতে হাজার হাজার Row পড়ে মাস ধরে ভাগ করে যোগ করতে হয়। কেউ মিলিসেকেন্ডে উত্তর চান না, কয়েক সেকেন্ড লাগলেও সমস্যা নেই।",
  },
  {
    id: "phone",
    task: "একজন Customer তাঁর Profile এ নতুন ফোন নম্বর দিলেন",
    answer: "oltp",
    rows: "১টা Row বদলানো",
    often: "যেকোনো সময়",
    why: "customer_id দিয়ে একটা Row খুঁজে একটা ঘর বদলানো। ছোট, সঠিক আর সাথে সাথে।",
  },
  {
    id: "dhaka",
    task: "Marketing জানতে চায় ঢাকার Customer রা কোন Destination সবচেয়ে বেশি পছন্দ করেন",
    answer: "olap",
    rows: "চারটা Table জুড়ে অনেক Row",
    often: "প্রতি Campaign এর আগে",
    why: "customers, bookings, departures, tours আর destinations জুড়ে পুরো ইতিহাস ঘেঁটে দল বানিয়ে গোনা। প্রশ্নটা ব্যবসার সিদ্ধান্তের জন্য, কোনো একজন Customer এর জন্য নয়।",
  },
  {
    id: "webhook",
    task: "bKash থেকে খবর এলো Payment সফল, Booking টা confirmed করতে হবে",
    answer: "oltp",
    rows: "১টা Row ঢোকানো, ১টা Row বদলানো",
    often: "প্রতিটা Payment এ",
    why: "payments এ একটা Row আর bookings এর status বদল, দুটো একসাথে হতে হবে, নয়তো একটাও না। টাকা আর সিটের হিসাব, তাই নির্ভুলতা সবার আগে। এটা OLTP এর সবচেয়ে গুরুত্বপূর্ণ ধরনের কাজ।",
  },
  {
    id: "rating",
    task: "CEO এর Dashboard এ প্রতিটা ট্যুরের গড় Rating, শুরু থেকে আজ পর্যন্ত",
    answer: "olap",
    rows: "সব Review আর সব Booking",
    often: "প্রতিদিন সকালে",
    why: "সব Review পড়ে ট্যুর ধরে গড় করা। Dashboard গতকাল রাত পর্যন্ত তাজা হলেও কারো ক্ষতি নেই, তাই এটা মূল Database থেকে সরিয়ে চালানো যায়।",
  },
  {
    id: "forecast",
    task: "Data Team তিন বছরের Booking দিয়ে আগামী শীতে কত চাহিদা হবে তার পূর্বাভাস বানাবে",
    answer: "olap",
    rows: "তিন বছরের সব Row",
    often: "বছরে কয়েকবার",
    why: "বিশাল পরিমাণ ইতিহাস একবারে পড়া, অনেক রকম ভাগ আর হিসাব। এমন কাজ লেনদেনের Database এ চালালে Customer দের Booking ধীর হয়ে যাবে। এর জায়গা Data Warehouse।",
  },
];

/**
 * আটটা বাস্তব কাজ। প্রতিটার জন্য পাঠক OLTP বা OLAP বেছে নেন, তারপর দেখেন
 * উত্তর, কয়টা Row ছোঁয়া হয়, কত ঘন ঘন হয়, আর কেন।
 */
export function WorkloadSorterLab() {
  const reduce = useReducedMotion();
  const [picks, setPicks] = useState<Record<string, Kind>>({});
  const answered = TASKS.filter((t) => picks[t.id]);
  const right = answered.filter((t) => picks[t.id] === t.answer).length;

  return (
    <Panel
      label="Interactive"
      title="কাজটা OLTP না OLAP?"
      footer="প্রশ্ন একটাই: কেউ কি এই মুহূর্তে স্ক্রিনের সামনে উত্তরের জন্য অপেক্ষা করছেন, আর কাজটা কি একটা দুটো নির্দিষ্ট Row নিয়ে? হ্যাঁ হলে OLTP। আর যদি অনেক Row পড়ে একটা সারসংক্ষেপ বানাতে হয়, আর কয়েক সেকেন্ড দেরি মানা যায়, তাহলে OLAP।"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="font-mono text-[0.6875rem] text-muted-foreground" data-score>
          {toBn(TASKS.length)}টার মধ্যে {toBn(answered.length)}টা বাছাই হয়েছে, ঠিক{" "}
          {toBn(right)}টা
        </p>
        <button
          type="button"
          onClick={() => setPicks({})}
          className={cn(BTN, BTN_OFF, "inline-flex items-center gap-1.5")}
        >
          <RotateCcw className="w-3 h-3" />
          আবার শুরু
        </button>
      </div>

      <ol className="space-y-3">
        {TASKS.map((t, i) => {
          const pick = picks[t.id];
          const correct = pick === t.answer;
          return (
            <li key={t.id} className="border border-border bg-background p-4" data-task={t.id}>
              <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-5">
                <span className="font-mono text-[0.6875rem] font-bold text-primary pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 text-sm leading-relaxed text-foreground">{t.task}</p>
                <div className="flex gap-2 shrink-0">
                  {(["oltp", "olap"] as Kind[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setPicks((prev) => ({ ...prev, [t.id]: k }))}
                      aria-pressed={pick === k}
                      data-kind={k}
                      className={cn(BTN, pick === k ? BTN_ON : BTN_OFF, "font-mono uppercase")}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
              {pick && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className={cn(
                    "mt-4 border-l-2 pl-4",
                    correct ? "border-primary" : "border-destructive",
                  )}
                  data-verdict={correct ? "right" : "wrong"}
                >
                  <p
                    className={cn(
                      "font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] mb-2",
                      correct ? "text-primary" : "text-destructive",
                    )}
                  >
                    {correct ? "ঠিক" : "আরেকবার ভাবুন"}, এটা {t.answer.toUpperCase()}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-0.5 border border-border font-mono text-[0.625rem] text-muted-foreground">
                      {t.rows}
                    </span>
                    <span className="px-2 py-0.5 border border-border font-mono text-[0.625rem] text-muted-foreground">
                      {t.often}
                    </span>
                  </div>
                  <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{t.why}</p>
                </motion.div>
              )}
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Row Store আর Column Store, কোন প্রশ্নে কতটুকু পড়তে হয়                     */
/* ------------------------------------------------------------------------- */

type Store = "row" | "column";
type Question = "one" | "sum";

const HEADERS = ["booking_id", "customer_id", "departure_id", "seats", "status", "total_bdt"];

// Island Tours এর প্রথম আটটা Booking, Sample Database থেকে হুবহু।
const BOOKINGS: string[][] = [
  ["1", "1", "1", "2", "confirmed", "25000.00"],
  ["2", "2", "1", "4", "confirmed", "50000.00"],
  ["3", "3", "2", "1", "confirmed", "12500.00"],
  ["4", "4", "3", "3", "confirmed", "25500.00"],
  ["5", "5", "3", "2", "cancelled", "17000.00"],
  ["6", "6", "4", "2", "confirmed", "36000.00"],
  ["7", "7", "4", "1", "confirmed", "18000.00"],
  ["8", "1", "5", "2", "confirmed", "19000.00"],
];

const TOTAL_COL = HEADERS.indexOf("total_bdt");
const LOOKUP_ROW = 4; // booking_id 5

/**
 * একই আটটা Booking, দুই রকম Storage, দুই রকম প্রশ্ন। কোন ঘরগুলো পড়তে হলো,
 * কয়টা আলাদা জায়গা থেকে, সেটা গুনে দেখায়।
 */
export function RowColumnScanLab() {
  const [store, setStore] = useState<Store>("row");
  const [question, setQuestion] = useState<Question>("sum");

  const isRead = (r: number, c: number) => {
    if (question === "one") return r === LOOKUP_ROW;
    // Row Store এ একটা ঘর পড়তে পুরো Row টাই আসে।
    return store === "row" ? true : c === TOTAL_COL;
  };

  const cellsRead = BOOKINGS.reduce(
    (sum, row, r) => sum + row.filter((_, c) => isRead(r, c)).length,
    0,
  );
  const places =
    question === "one"
      ? store === "row"
        ? 1
        : HEADERS.length
      : 1;
  const sum = BOOKINGS.reduce((acc, row) => acc + Number(row[TOTAL_COL]), 0);

  const verdict: Record<`${Store}-${Question}`, string> = {
    "row-one":
      "Row Store এ booking_id 5 এর ছয়টা ঘর পাশাপাশি জমা থাকে, তাই এক জায়গা থেকে এক টানে পুরো Booking পাওয়া যায়। লেনদেনের কাজ ঠিক এমনই হয়, তাই PostgreSQL আর MySQL এভাবে Data রাখে।",
    "row-sum":
      "শুধু total_bdt দরকার, অথচ Row Store এ প্রতিটা Row এর সব ঘর একসাথে আসে। আটটা মান যোগ করতে আটচল্লিশটা ঘর পড়তে হলো। আট লাখ Row হলে এই বাড়তি পড়াটাই Report কে ধীর করে।",
    "column-one":
      "Column Store এ একটা Booking এর ছয়টা ঘর ছয়টা আলাদা Column এর ফালিতে ছড়ানো। একটা Booking জোড়া দিতে ছয় জায়গায় যেতে হলো। Column Store তাই লেনদেনের কাজে ভালো না।",
    "column-sum":
      "total_bdt এর আটটা মান এক ফালিতে পাশাপাশি। শুধু সেই ফালিটা পড়লেই যোগফল তৈরি। Report আর Dashboard এর জন্য Column Store এত দ্রুত হওয়ার মূল কারণ এটাই, সাথে একই ধরনের মান পাশাপাশি থাকায় চাপ দিয়ে ছোটও করা যায়।",
  };

  return (
    <Panel
      label="Interactive"
      title="Row Store বনাম Column Store, কতটুকু পড়তে হয়"
      footer="সংখ্যাগুলো এই আটটা Row এর জন্য হুবহু গোনা। বাস্তবে Database Page ধরে পড়ে আর Index ব্যবহার করে (Module 13), কিন্তু মূল কথা একই থাকে: যে কাজে পুরো Row লাগে সেখানে Row Store জেতে, যে কাজে কয়েকটা Column এর সব মান লাগে সেখানে Column Store।"
    >
      <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
            Storage
          </span>
          {(["row", "column"] as Store[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStore(s)}
              aria-pressed={store === s}
              data-store={s}
              className={cn(BTN, store === s ? BTN_ON : BTN_OFF)}
            >
              {s === "row" ? "Row Store" : "Column Store"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
            প্রশ্ন
          </span>
          <button
            type="button"
            onClick={() => setQuestion("one")}
            aria-pressed={question === "one"}
            data-question="one"
            className={cn(BTN, question === "one" ? BTN_ON : BTN_OFF)}
          >
            booking_id 5 এর পুরো Row
          </button>
          <button
            type="button"
            onClick={() => setQuestion("sum")}
            aria-pressed={question === "sum"}
            data-question="sum"
            className={cn(BTN, question === "sum" ? BTN_ON : BTN_OFF)}
          >
            SUM(total_bdt)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full border-collapse font-mono text-[0.75rem]">
          <thead>
            <tr className="bg-muted/40">
              {HEADERS.map((h, c) => (
                <th
                  key={h}
                  className={cn(
                    "px-3 py-2 text-left font-bold whitespace-nowrap border-b border-border",
                    store === "column" && "border-r border-border/60 last:border-r-0",
                    question === "sum" && store === "column" && c === TOTAL_COL
                      ? "text-primary"
                      : "text-foreground",
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOOKINGS.map((row, r) => (
              <tr key={row[0]} className="border-b border-border/60 last:border-b-0">
                {row.map((cell, c) => (
                  <td
                    key={c}
                    data-read={isRead(r, c) ? "yes" : "no"}
                    className={cn(
                      "px-3 py-1.5 whitespace-nowrap transition-colors duration-300",
                      store === "column" && "border-r border-border/60 last:border-r-0",
                      isRead(r, c)
                        ? "bg-primary/20 text-foreground"
                        : "text-muted-foreground/50",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
        <div className="bg-background p-4">
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground">পড়া ঘর</p>
          <p className="mt-1 text-2xl font-black tabular-nums" data-cells>
            {toBn(cellsRead)}
          </p>
        </div>
        <div className="bg-background p-4">
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground">আলাদা জায়গা</p>
          <p className="mt-1 text-2xl font-black tabular-nums" data-places>
            {toBn(places)}
          </p>
        </div>
        <div className="bg-background p-4">
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground">উত্তর</p>
          <p className="mt-1 font-mono text-sm font-bold text-primary" data-answer>
            {question === "sum" ? sum.toFixed(2) : BOOKINGS[LOOKUP_ROW].join(", ")}
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground" data-verdict>
        {verdict[`${store}-${question}`]}
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. ভারী Report কোথায় চালাবেন                                                 */
/* ------------------------------------------------------------------------- */

type Place = "peak" | "night" | "replica" | "warehouse";

const PLACES: {
  id: Place;
  label: string;
  primaryLoad: number;
  booking: string;
  bookingOk: boolean;
  fresh: string;
  cost: string;
  note: string;
}[] = [
  {
    id: "peak",
    label: "মূল Database এ, দুপুরে",
    primaryLoad: 95,
    booking: "ধীর, কখনো Timeout",
    bookingOk: false,
    fresh: "এই মুহূর্তের",
    cost: "কোনো বাড়তি খরচ নেই",
    note: "Report আর Customer দের Booking একই CPU আর Disk এর জন্য লড়ছে। PostgreSQL এ পড়া কখনো লেখাকে আটকায় না, তবু মেশিন একটাই, তাই সবাই ধীর হয়। ভিড়ের সময় এটাই সবচেয়ে খারাপ পছন্দ।",
  },
  {
    id: "night",
    label: "মূল Database এ, রাত ৩টায়",
    primaryLoad: 60,
    booking: "স্বাভাবিক, রাতে Booking কম",
    bookingOk: true,
    fresh: "আগের দিন পর্যন্ত",
    cost: "কোনো বাড়তি খরচ নেই",
    note: "ছোট কোম্পানির জন্য সবচেয়ে সহজ শুরু। Report টা রাতে চলে, সকালে Accountant ফল পান। Island Tours এর এখনকার আকারে এটাই যথেষ্ট। সমস্যা শুরু হয় যখন রাতেও Booking আসে, বা Report এত বড় হয় যে সকাল পর্যন্ত শেষ হয় না।",
  },
  {
    id: "replica",
    label: "Read Replica তে",
    primaryLoad: 30,
    booking: "স্বাভাবিক",
    bookingOk: true,
    fresh: "সাধারণত কয়েক সেকেন্ড পিছিয়ে",
    cost: "আরেকটা Server এর খরচ",
    note: "মূল Database এর একটা Copy যেটা সবসময় তার পিছু পিছু চলে। Report সেখানে চললে মূল Database টের পায় না। সাবধান, Copy টা একটু পিছিয়ে থাকতে পারে, আর খুব লম্বা Query কে PostgreSQL মাঝপথে বাতিলও করে দিতে পারে। বিস্তারিত Module 19 এ।",
  },
  {
    id: "warehouse",
    label: "Data Warehouse এ",
    primaryLoad: 30,
    booking: "স্বাভাবিক",
    bookingOk: true,
    fresh: "শেষ ETL পর্যন্ত, যেমন গতকাল রাত",
    cost: "আলাদা System, আলাদা দক্ষতা",
    note: "রাতে একটা কাজ (ETL) Data তুলে Column Store এ সাজিয়ে রাখে। কোটি Row এর Report সেকেন্ডে চলে, আর অনেক উৎসের Data এক জায়গায় মেলানো যায়। দাম হলো আরেকটা System চালানো আর Data পুরো তাজা না থাকা। বিস্তারিত Module 20 এ।",
  },
];

/**
 * একই ভারী মাসিক Report চারটা জায়গায় চালালে মূল Database, Customer এর
 * Booking আর Report এর তাজা থাকা কেমন বদলায়।
 */
export function ReportPlacementLab() {
  const reduce = useReducedMotion();
  const [place, setPlace] = useState<Place>("peak");
  const current = PLACES.find((p) => p.id === place) ?? PLACES[0];

  return (
    <Panel
      label="Interactive"
      title="মাসিক Report টা কোথায় চালাবেন"
      footer="বারের দৈর্ঘ্য বোঝানোর জন্য আন্দাজ, কোনো মাপা সংখ্যা নয়। আসল সংখ্যা আপনার Data, Query আর Server এর উপর নির্ভর করবে, আর সেটা মাপতে শিখবেন Module 13 আর Module 18 এ।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {PLACES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlace(p.id)}
            aria-pressed={place === p.id}
            data-place={p.id}
            className={cn(BTN, place === p.id ? BTN_ON : BTN_OFF)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-4" data-active={current.id}>
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
              মূল Database এর ব্যস্ততা
            </span>
            <span className="font-mono text-[0.625rem] text-muted-foreground">আন্দাজ</span>
          </div>
          <div className="h-3 border border-border bg-background overflow-hidden">
            <motion.div
              className={cn("h-full", current.primaryLoad > 80 ? "bg-destructive" : "bg-primary")}
              initial={false}
              animate={{ width: `${current.primaryLoad}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
          <div className="bg-background p-4">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground">
              Customer এর Booking
            </p>
            <p
              className={cn(
                "mt-1 text-sm font-bold",
                current.bookingOk ? "text-foreground" : "text-destructive",
              )}
              data-booking
            >
              {current.booking}
            </p>
          </div>
          <div className="bg-background p-4">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground">
              Report কতটা তাজা
            </p>
            <p className="mt-1 text-sm font-bold text-foreground" data-fresh>
              {current.fresh}
            </p>
          </div>
          <div className="bg-background p-4">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground">
              বাড়তি দাম
            </p>
            <p className="mt-1 text-sm font-bold text-foreground">{current.cost}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{current.note}</p>
      </div>
    </Panel>
  );
}
