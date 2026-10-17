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
const BTN_OFF =
  "border-border text-muted-foreground hover:text-foreground hover:border-primary/40";

/* ------------------------------------------------------------------------- */
/* 1. Sheet এর ভুলগুলো খুঁজে বের করুন                                         */
/* ------------------------------------------------------------------------- */

const SHEET_HEAD = ["Booked on", "Customer", "Phone", "Tour", "Tour date", "Seats", "Price", "Total", "Paid"];

const SHEET_ROWS: string[][] = [
  ["2025-12-20", "Rahim Uddin", "+8801000000101", "Saint Martin Escape", "15 Jan", "2", "12500", "25000", "bKash"],
  ["2025-12-28", "Nusrat Jahan", "01000000102", "Saint Martin Escape", "15/01/2026", "4", "12500", "50000", "Card"],
  ["2026-01-05", "Farhana Akter", "+8801000000104", "Cox's Bazar Weekend", "23 Jan", "3", "8500", "25500", "bKash"],
  ["2026-01-10", "rahim udin", "+8801000000101", "Saint Martin Escape", "12 Feb", "1", "12500", "12500", "Nagad"],
  ["2026-01-25", "Mitu Rahman", "", "Sundarbans Cruise", "5 Feb", "five", "18000", "36000", "Card"],
  ["2026-01-28", "Arif Chowdhury", "+8801000000107", "Sundarbans Cruise", "5 Feb", "1", "17500", "17500", "?"],
  ["2026-02-20", "Rahim Uddin", "+8801000000101", "Sajek Cloud Trip", "6 Mar", "2", "9500", "18000", "bKash"],
  ["2026-03-01", "Sumaiya Islam", "+8801000000108", "Bandarban Trek", "19 Mar", "-1", "14000", "-14000", "Card"],
];

/** Problem cells, keyed "row:col", with what is wrong and what it breaks. */
const PROBLEMS: Record<string, { what: string; breaks: string }> = {
  "3:1": {
    what: "rahim udin আর Rahim Uddin কি একই মানুষ? ফোন নম্বর একই, কিন্তু নাম ছোট হাতের অক্ষরে আর একটা d কম।",
    breaks: "Sheet এর কাছে এটা একজন নতুন Customer। নাম ধরে খুঁজলে বা গুনলে Rahim সাহেবের এই ট্যুরটা বাদ পড়বে, আর তিনি কয়টা ট্যুর করেছেন সেই উত্তর ভুল আসবে।",
  },
  "1:2": {
    what: "একই ধরনের নম্বর অন্য Row গুলোতে +880 দিয়ে শুরু, এখানে 0 দিয়ে।",
    breaks: "+8801000000102 দিয়ে খুঁজলে এই Row পাওয়া যাবে না, অথচ নম্বরটা একই।",
  },
  "1:4": {
    what: "তারিখ বাকিদের মতো 15 Jan না, লেখা হয়েছে 15/01/2026।",
    breaks: "তারিখ ধরে সাজালে বা ফিল্টার করলে এই Row ভুল জায়গায় যায়, কারণ Spreadsheet একে লেখা ভাবতে পারে, তারিখ না।",
  },
  "4:2": {
    what: "ফোন নম্বরের ঘর ফাঁকা।",
    breaks: "নম্বর নেই, নাকি কেউ লিখতে ভুলে গেছেন, নাকি Customer দিতে চাননি? ফাঁকা ঘর থেকে এর কোনোটাই বোঝা যায় না।",
  },
  "4:5": {
    what: "সিটের সংখ্যা অঙ্কে না, কথায় লেখা: five।",
    breaks: "Seats Column এর যোগফল করলে এই Row বাদ পড়ে, কারণ Spreadsheet five কে সংখ্যা ভাবে না। ট্যুরে কতজন যাচ্ছেন তার হিসাব কমে যায়।",
  },
  "5:6": {
    what: "একই Sundarbans Cruise এর দাম আগের Row তে 18000, এখানে 17500।",
    breaks: "দাম বদলানোর সময় কেউ সব Row বদলাননি। এখন একই ট্যুরের দুটো দাম, আর কোনটা ঠিক সেটা Sheet জানে না।",
  },
  "5:8": {
    what: "Paid ঘরে প্রশ্নবোধক চিহ্ন।",
    breaks: "টাকা এসেছে কিনা নিশ্চিত হতে কাউকে আলাদা করে bKash এর Statement ঘাঁটতে হবে। দুটো জায়গার হিসাব মেলানোর কোনো নিয়ম নেই।",
  },
  "6:7": {
    what: "Total হাতে লেখা 18000, অথচ ২টা সিট গুণ 9500 হয় 19000।",
    breaks: "Total কেউ হিসাব করে টাইপ করেছেন, আর ভুল করেছেন। Sheet কাউকে সাবধান করেনি, আর মাস শেষের আয়ের হিসাবে ১০০০ টাকা কম দেখাবে।",
  },
  "7:5": {
    what: "সিট -1, মানে ঋণাত্মক।",
    breaks: "কেউ ভুল করে মাইনাস চেপেছেন। একটা ট্যুরে মাইনাস একজন মানুষ যেতে পারেন না, তবু Sheet ঘরটা চুপচাপ নিয়ে নিল।",
  },
  "7:7": {
    what: "Total ও ঋণাত্মক, -14000।",
    breaks: "ভুল সিটের সংখ্যা থেকে হিসাব করা Total। মাস শেষে আয়ের যোগফল থেকে ১৪০০০ টাকা নিঃশব্দে কমে যাবে, আর কেউ জানবেন না কেন।",
  },
};

const PROBLEM_COUNT = Object.keys(PROBLEMS).length;

/**
 * A booking sheet with ten problems hidden in it. The reader clicks cells to
 * find them; each find explains what is wrong and what it quietly breaks.
 */
export function SheetSpotLab() {
  const reduce = useReducedMotion();
  const [found, setFound] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealAll, setRevealAll] = useState(false);

  const pick = (key: string) => {
    setSelected(key);
    if (PROBLEMS[key] && !found.includes(key)) setFound((prev) => [...prev, key]);
  };

  const problem = selected ? PROBLEMS[selected] : null;

  return (
    <Panel
      label="Interactive"
      title="এই Sheet এ দশটা ভুল লুকিয়ে আছে"
      footer="যেকোনো ঘরে চাপ দিন। ভুল ঘর পেলে সেটা লাল হবে আর নিচে বলবে কী ভুল আর তাতে কী ভাঙে। আটকে গেলে সব দেখান চাপুন।"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          খুঁজে পেয়েছেন {toBn(found.length)} / {toBn(PROBLEM_COUNT)}
        </span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={() => setRevealAll((v) => !v)}
            className={cn(BTN, revealAll ? BTN_ON : BTN_OFF)}
          >
            সব দেখান
          </button>
          <button
            type="button"
            onClick={() => {
              setFound([]);
              setSelected(null);
              setRevealAll(false);
            }}
            className={cn(BTN, BTN_OFF, "inline-flex items-center gap-1.5")}
          >
            <RotateCcw className="w-3 h-3" />
            আবার
          </button>
        </span>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[46rem] border-collapse font-mono text-[0.6875rem]">
          <thead>
            <tr className="bg-muted/40">
              <th className="border-b border-r border-border px-2 py-1.5 text-muted-foreground/70 font-normal w-8" />
              {SHEET_HEAD.map((h) => (
                <th
                  key={h}
                  className="border-b border-r border-border px-2 py-1.5 text-left font-bold text-foreground whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHEET_ROWS.map((row, r) => (
              <tr key={r}>
                <td className="border-b border-r border-border px-2 py-1.5 text-center text-muted-foreground/70">
                  {r + 2}
                </td>
                {row.map((cell, c) => {
                  const key = `${r}:${c}`;
                  const isProblem = Boolean(PROBLEMS[key]);
                  const shown = isProblem && (found.includes(key) || revealAll);
                  const isSelected = selected === key;
                  return (
                    <td key={key} className="border-b border-r border-border p-0">
                      <button
                        type="button"
                        onClick={() => pick(key)}
                        aria-pressed={isSelected}
                        className={cn(
                          "block w-full min-h-[1.9rem] px-2 py-1.5 text-left whitespace-nowrap transition-colors",
                          shown
                            ? "bg-destructive/10 text-destructive font-bold"
                            : "text-foreground/85 hover:bg-primary/5",
                          isSelected && "outline outline-1 outline-primary"
                        )}
                      >
                        {cell || " "}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.div
        key={selected ?? "none"}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="mt-5 min-h-[5.5rem]"
        data-sheet-spot={selected ?? ""}
      >
        {!selected && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sheet টা প্রথমে সাধারণ দেখায়। প্রতিটা Row আলাদা করে পড়ুন, আর
            নিজেকে জিজ্ঞেস করুন: এই মানটা কি অন্য Row এর সাথে মিলছে?
          </p>
        )}
        {selected && !problem && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            এই ঘরে সমস্যা নেই। পাশের ঘরগুলো আর একই Column এর অন্য Row গুলোর
            সাথে মিলিয়ে দেখুন।
          </p>
        )}
        {problem && (
          <div className="border border-destructive/40 bg-destructive/5 p-4 space-y-2">
            <p className="text-sm font-bold text-foreground">{problem.what}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{problem.breaks}</p>
          </div>
        )}
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. দাম বদলান: চল্লিশ জায়গায় নাকি এক জায়গায়                                  */
/* ------------------------------------------------------------------------- */

const COPY_ROWS = [
  "Rahim Uddin",
  "Nusrat Jahan",
  "Tanvir Ahmed",
  "Shuvo Das",
  "Kamal Hasan",
  "Lamia Haque",
];

const OLD_PRICE = 12500;
const NEW_PRICE = 13000;

/**
 * The same price change done two ways. In the sheet every row carries its own
 * copy, so the change is six edits and the sheet is inconsistent in between.
 * In the database the price lives once, so one edit changes every view.
 */
export function CopiedPriceLab() {
  const [mode, setMode] = useState<"sheet" | "db">("sheet");
  const [edited, setEdited] = useState(0);
  const [dbPrice, setDbPrice] = useState(OLD_PRICE);

  const switchMode = (next: "sheet" | "db") => {
    setMode(next);
    setEdited(0);
    setDbPrice(OLD_PRICE);
  };

  const sheetPrices = COPY_ROWS.map((_, i) => (i < edited ? NEW_PRICE : OLD_PRICE));
  const distinct = new Set(mode === "sheet" ? sheetPrices : [dbPrice]).size;
  const done = mode === "sheet" ? edited === COPY_ROWS.length : dbPrice === NEW_PRICE;
  const edits = mode === "sheet" ? edited : dbPrice === NEW_PRICE ? 1 : 0;

  return (
    <Panel
      label="Interactive"
      title="Saint Martin এর দাম 12500 থেকে 13000"
      footer="দুটো পদ্ধতিতেই একই কাজ করুন: দাম বাড়ান। তারপর নিচের দুটো সংখ্যা দেখুন, কয়বার হাত লাগল আর একই ট্যুরের কয়টা আলাদা দাম এখন চালু আছে।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => switchMode("sheet")}
          aria-pressed={mode === "sheet"}
          className={cn(BTN, mode === "sheet" ? BTN_ON : BTN_OFF)}
        >
          Spreadsheet: প্রতিটা Row এ দামের কপি
        </button>
        <button
          type="button"
          onClick={() => switchMode("db")}
          aria-pressed={mode === "db"}
          className={cn(BTN, mode === "db" ? BTN_ON : BTN_OFF)}
        >
          Database: দাম এক জায়গায়
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] gap-6">
        <div className="space-y-4">
          {mode === "db" && (
            <div className="border border-primary/50 bg-primary/5 p-3 font-mono text-[0.75rem]">
              <div className="text-[0.625rem] uppercase tracking-[0.15em] text-primary mb-1.5">
                tours, একটাই Row
              </div>
              <div className="flex justify-between gap-3">
                <span>1 · Saint Martin Island Escape</span>
                <span className="font-bold text-primary">{dbPrice}</span>
              </div>
            </div>
          )}
          <div className="border border-border overflow-x-auto">
            <table className="w-full border-collapse font-mono text-[0.75rem]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-3 py-1.5 text-left border-b border-border">Customer</th>
                  <th className="px-3 py-1.5 text-left border-b border-border">Tour</th>
                  <th className="px-3 py-1.5 text-right border-b border-border">
                    {mode === "sheet" ? "Price (কপি)" : "Price (tours থেকে)"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {COPY_ROWS.map((name, i) => {
                  const price = mode === "sheet" ? sheetPrices[i] : dbPrice;
                  const stale = price === OLD_PRICE && edits > 0 && !done;
                  return (
                    <tr key={name} className="border-b border-border/60 last:border-b-0">
                      <td className="px-3 py-1.5">{name}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">
                        {mode === "sheet" ? "Saint Martin Escape" : "tour_id 1"}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-1.5 text-right transition-colors duration-300",
                          price === NEW_PRICE && "text-primary font-bold",
                          stale && "text-destructive font-bold bg-destructive/5"
                        )}
                      >
                        {price}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            disabled={done}
            onClick={() =>
              mode === "sheet" ? setEdited((n) => Math.min(COPY_ROWS.length, n + 1)) : setDbPrice(NEW_PRICE)
            }
            className={cn(BTN, BTN_ON, "w-full py-2 disabled:opacity-50")}
          >
            {mode === "sheet" ? "পরের Row এর দাম বদলান" : "tours এর দাম বদলান"}
          </button>
          <button
            type="button"
            onClick={() => switchMode(mode)}
            className={cn(BTN, BTN_OFF, "w-full inline-flex items-center justify-center gap-1.5")}
          >
            <RotateCcw className="w-3 h-3" />
            আবার শুরু
          </button>
          <div className="border border-border p-3 space-y-2 font-mono text-[0.6875rem]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">কয়বার হাত লাগল</span>
              <span className="font-bold">{toBn(edits)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">চালু দাম কয়টা</span>
              <span className={cn("font-bold", distinct > 1 && "text-destructive")}>{toBn(distinct)}</span>
            </div>
          </div>
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground" data-copied-price={`${mode}:${edits}:${distinct}`}>
            {mode === "sheet" && edits === 0 && "চাপ দিয়ে একটা একটা করে Row বদলান, যেভাবে একজন কর্মী Sheet এ বদলাতেন।"}
            {mode === "sheet" && edits > 0 && !done &&
              "এই মুহূর্তে একই ট্যুরের দুটো দাম চালু। Website যে Row পড়বে, Customer সেই দাম দেখবেন। এখন কেউ ডেকে নিলে বা ফোন এলে কাজটা এভাবেই অর্ধেক পড়ে থাকবে।"}
            {mode === "sheet" && done &&
              "ছয়বার কাজ করে অবশেষে সব মিলল। বাস্তবে Row থাকে চল্লিশটা বা চারশো, আর একটা বাদ পড়লেই আবার দুটো দাম।"}
            {mode === "db" && edits === 0 && "এখানে Booking গুলো দাম নিজের কাছে রাখে না, শুধু tour_id রাখে। দাম আছে tours Table এর একটা Row তে।"}
            {mode === "db" && done && "একবার বদলেছেন, সব জায়গায় নতুন দাম। মাঝখানে কোনো মুহূর্তে দুটো দাম ছিল না, কারণ দামটা কখনো দুই জায়গায় ছিলই না।"}
          </p>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. শেষ সিট, দুইজন কর্মী                                                     */
/* ------------------------------------------------------------------------- */

type RaceStep = { office: string; agent: string; seats: string; note: string };

const SHEET_RACE: RaceStep[] = [
  {
    office: "",
    agent: "",
    seats: "1",
    note: "Saint Martin, ২০ নভেম্বর। Sheet এ লেখা ১টা সিট বাকি। দুইজন কর্মী একই Google Sheet খুলে রেখেছেন।",
  },
  {
    office: "Sheet দেখলেন: ১টা সিট বাকি",
    agent: "",
    seats: "1",
    note: "অফিসের কর্মী ফোনে Rahim Uddin এর সাথে কথা বলছেন। তিনি Sheet দেখে নিশ্চিত হলেন, সিট আছে।",
  },
  {
    office: "Rahim সাহেবকে বলছেন: আছে",
    agent: "Sheet দেখলেন: ১টা সিট বাকি",
    seats: "1",
    note: "একই সময়ে মাঠের এজেন্ট Farhana Akter কে নিয়ে বসে আছেন। তিনিও Sheet দেখলেন। তাঁর পর্দাতেও ১টা সিট।",
  },
  {
    office: "নতুন Row লিখলেন, সিট 0 করলেন",
    agent: "Farhana আপাকে বলছেন: আছে",
    seats: "0",
    note: "অফিসের কর্মী Booking টা লিখে সিট 0 করে দিলেন। এজেন্টের মাথায় এখনো আগের দেখা সংখ্যা, ১।",
  },
  {
    office: "",
    agent: "নতুন Row লিখলেন, সিট 0 করলেন",
    seats: "0",
    note: "এজেন্টও Booking লিখলেন আর সিটের ঘরে 0 বসালেন। ঘরে আগে থেকেই 0 ছিল, তাই কেউ কিছু টেরই পেলেন না। Sheet কোনো প্রশ্ন করেনি।",
  },
  {
    office: "",
    agent: "",
    seats: "0",
    note: "ফল: একটা সিট, দুইটা Booking, দুইজনই টাকা দিয়েছেন। ২০ নভেম্বর জেটিতে একজন যাত্রীকে ফিরিয়ে দিতে হবে।",
  },
];

const DB_RACE: RaceStep[] = [
  {
    office: "",
    agent: "",
    seats: "1",
    note: "একই দিন, একই শেষ সিট। এবার Booking লেখে Database, আর দুইজন কর্মীই একটা App ব্যবহার করেন।",
  },
  {
    office: "Booking শুরু: Database Row টা আটকে দিল, সিট ১",
    agent: "",
    seats: "1",
    note: "অফিসের Booking শুরু হতেই Database ওই তারিখের Row টায় একটা Lock বসায়। এখন আর কেউ এই Row বদলাতে পারবে না, যতক্ষণ এই কাজ শেষ না হয়।",
  },
  {
    office: "Booking লেখা চলছে",
    agent: "Booking শুরু: Row আটকানো, অপেক্ষা",
    seats: "1",
    note: "এজেন্টের Booking ও একই Row চাইল। Database তাকে বলল একটু দাঁড়ান। এজেন্টের App কয়েক মিলিসেকেন্ড অপেক্ষা করছে।",
  },
  {
    office: "সিট 0, কাজ শেষ, Lock খুলল",
    agent: "অপেক্ষা",
    seats: "0",
    note: "অফিসের Booking শেষ হলো। সিট এখন 0, আর Lock উঠে গেল।",
  },
  {
    office: "",
    agent: "এবার পড়ল: সিট 0, Booking বাতিল",
    seats: "0",
    note: "এজেন্টের Booking এবার Row টা পড়ল, আর দেখল সিট 0। সে Booking লেখার আগেই থেমে গেল, App দেখাল সিট শেষ।",
  },
  {
    office: "",
    agent: "",
    seats: "0",
    note: "ফল: একটা সিট, একটা Booking। এজেন্ট সাথে সাথে Farhana আপাকে পরের তারিখের কথা বলতে পারলেন। কাউকে জেটি থেকে ফেরাতে হলো না।",
  },
];

/**
 * The last-seat race, step by step, once on a shared sheet and once in a
 * database that locks the row. Same people, same seat, different ending.
 */
export function TwoEditorsLab() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"sheet" | "db">("sheet");
  const [step, setStep] = useState(0);
  const steps = mode === "sheet" ? SHEET_RACE : DB_RACE;
  const current = steps[step];
  const last = step === steps.length - 1;

  const bookings = mode === "sheet" ? (step >= 4 ? 2 : step >= 3 ? 1 : 0) : step >= 3 ? 1 : 0;

  return (
    <Panel
      label="Interactive"
      title="শেষ সিট, দুইজন কর্মী"
      footer="পরের ধাপ চেপে চেপে এগোন। তারপর উপরের বোতাম বদলে একই ঘটনা Database এ দেখুন। কোন ধাপে দুটো গল্প আলাদা হয়ে যায়, সেটা খেয়াল করুন।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {(["sheet", "db"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setStep(0);
            }}
            aria-pressed={mode === m}
            className={cn(BTN, mode === m ? BTN_ON : BTN_OFF)}
          >
            {m === "sheet" ? "Shared Spreadsheet" : "Database, Row Lock সহ"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {[
          { who: "অফিসের কর্মী", text: current.office },
          { who: mode === "sheet" ? "Sheet এ সিট বাকি" : "Database এ সিট বাকি", text: current.seats, center: true },
          { who: "মাঠের এজেন্ট", text: current.agent },
        ].map((cell) => (
          <div
            key={cell.who}
            className={cn(
              "border p-4 min-h-[6rem] transition-colors duration-300",
              cell.center ? "border-primary/50 bg-primary/5 text-center" : "border-border bg-background"
            )}
          >
            <div className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground mb-2">
              {cell.who}
            </div>
            <div
              className={cn(
                cell.center ? "font-mono text-3xl font-black text-primary" : "text-[0.8125rem] leading-relaxed text-foreground"
              )}
            >
              {cell.text || (cell.center ? "" : " ")}
            </div>
          </div>
        ))}
      </div>

      <motion.p
        key={`${mode}-${step}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className={cn(
          "text-sm leading-relaxed mb-5 p-4 border",
          last && mode === "sheet"
            ? "border-destructive/40 bg-destructive/5 text-foreground"
            : last
              ? "border-primary/50 bg-primary/5 text-foreground"
              : "border-border text-muted-foreground"
        )}
        data-two-editors={`${mode}:${step}:${bookings}`}
      >
        {current.note}
      </motion.p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          ধাপ {toBn(step + 1)} / {toBn(steps.length)} · Booking হয়েছে {toBn(bookings)}টা
        </span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className={cn(BTN, BTN_OFF, "disabled:opacity-40")}
          >
            আগের ধাপ
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={last}
            className={cn(BTN, BTN_ON, "disabled:opacity-40")}
          >
            পরের ধাপ
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            className={cn(BTN, BTN_OFF, "inline-flex items-center gap-1.5")}
          >
            <RotateCcw className="w-3 h-3" />
            শুরু
          </button>
        </span>
      </div>
    </Panel>
  );
}
