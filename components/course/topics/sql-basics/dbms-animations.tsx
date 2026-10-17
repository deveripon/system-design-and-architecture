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
/* 1. DBMS এর সাতটা কাজ                                                       */
/* ------------------------------------------------------------------------- */

type Job = {
  id: string;
  name: string;
  term: string;
  before: string;
  does: string;
  island: string;
  where: string;
};

const JOBS: Job[] = [
  {
    id: "durable",
    name: "টেকসই রাখা",
    term: "Durability",
    before:
      "অফিসের Laptop এর Charge শেষ হয়ে বন্ধ হয়ে গেল। শেষ দশ মিনিটে যে তিনটা বুকিং লেখা হয়েছিল, সেগুলো Save হয়নি। Customer রা Confirmation পেয়ে গেছেন, অথচ খাতায় তাঁদের নাম নেই।",
    does:
      "DBMS কোনো পরিবর্তনকে সফল বলার আগে সেটা Disk এ একটা আলাদা খাতায় লিখে রাখে, যার নাম WAL (Write-Ahead Log)। বিদ্যুৎ চলে গেলেও ফিরে এসে সে ওই খাতা মিলিয়ে নেয়। একবার সফল বলা মানে সেটা থেকে যাবে।",
    island:
      "Customer এর ফোনে বুকিং নিশ্চিত লেখা আসে কেবল তখনই, যখন PostgreSQL বলে দিয়েছে পরিবর্তনটা Disk এ পাকা হয়েছে।",
    where: "Module 12 (ACID), Module 18 (WAL আর Backup)",
  },
  {
    id: "fast",
    name: "দ্রুত খোঁজা",
    term: "Indexing, Query Planning",
    before:
      "দুই লাখ লাইনের Sheet এ একজন Customer কে খুঁজতে Ctrl+F। প্রতিবার প্রথম লাইন থেকে শেষ লাইন পর্যন্ত চোখ বোলানো, আর ফাইল খুলতেই এক মিনিট।",
    does:
      "DBMS বইয়ের শেষের সূচির মতো Index রাখতে পারে, যাতে পুরো Data না পড়েই ঠিক জায়গায় পৌঁছানো যায়। আর প্রতিটা প্রশ্নের জন্য সে নিজেই ঠিক করে কোন পথে খুঁজলে সবচেয়ে কম কাজ লাগবে। এই সিদ্ধান্ত নেওয়া অংশের নাম Planner।",
    island:
      "Customer Email দিয়ে Login করলে লাখ Customer এর মধ্যেও তাঁর Row টা এক Millisecond এর কম সময়ে বের হয়।",
    where: "Module 13 (Indexes & Performance)",
  },
  {
    id: "rules",
    name: "নিয়ম পাহারা",
    term: "Data Types, Constraints",
    before:
      "সিটের ঘরে কেউ লিখেছেন পাঁচ, কেউ লিখেছেন 5, কেউ ভুল করে -2। Status এর ঘরে কেউ লিখেছেন Confirmed, কেউ confirm, কেউ ok। Sheet কাউকে থামায় না।",
    does:
      "প্রতিটা Column এর একটা নির্দিষ্ট ধরন থাকে, আর তার উপর নিয়ম বসানো যায়। সিট শূন্যের বেশি হতে হবে, Status তিনটা নির্দিষ্ট শব্দের একটা হতে হবে, একই Email দুইবার চলবে না। নিয়ম ভাঙা Data কে DBMS ঢুকতেই দেয় না, সাথে সাথে Error দেয়।",
    island:
      "bookings Table এ seats শূন্য বা তার কম লিখলে PostgreSQL বুকিংটা ফিরিয়ে দেয়। একটু পরে নিজের চোখে দেখবেন।",
    where: "Module 09 (Tables, Data Types & Constraints)",
  },
  {
    id: "together",
    name: "একসাথে অনেকে",
    term: "Concurrency, Transactions",
    before:
      "দুজন কর্মী একই Excel ফাইলের দুটো Copy খুলে কাজ করলেন। যিনি পরে Save করলেন, তাঁর Copy আগের জনের সব কাজ মুছে দিল। কেউ টেরও পেলেন না।",
    does:
      "একই মুহূর্তে হাজার Request এলেও DBMS এমনভাবে সাজায় যেন সেগুলো একটার পর একটা ঘটেছে। একটা Row কেউ বদলাচ্ছে, এমন সময় আরেকজন সেটা বদলাতে এলে তাঁকে অপেক্ষা করায়। এর হাতিয়ার Transaction আর Lock।",
    island:
      "Saint Martin এর শেষ সিটটা দুজন একসাথে বুক করতে চাইলে একজনই পাবেন। নিচের Lab এ ঠিক এই ঘটনাটা ধাপে ধাপে দেখবেন।",
    where: "Module 12 (Transactions & Concurrency)",
  },
  {
    id: "access",
    name: "কে কী দেখবে",
    term: "Users, Roles, Permissions",
    before:
      "Sheet এর Link যাঁর কাছে আছে, তিনিই সব Customer এর ফোন নম্বর আর সব Payment দেখতে পান। একজন Guide চাইলে পুরো ফাইল Download করে নিয়ে যেতে পারেন।",
    does:
      "DBMS এ প্রতিটা ব্যবহারকারীর আলাদা পরিচয় থাকে, যার নাম User বা Role। কোন Role কোন Table পড়তে পারবে, কোনটায় লিখতে পারবে, কোনটা দেখতেই পাবে না, তা আলাদা করে ঠিক করা যায়।",
    island:
      "হিসাবরক্ষক payments দেখতে পারেন। Guide দের Tool শুধু departures দেখে। আর Website এর API এর Role দিয়ে কোনো Table মুছে ফেলা যায় না।",
    where: "Module 16 (Security)",
  },
  {
    id: "backup",
    name: "বিপদের দিনের Copy",
    term: "Backup, Recovery",
    before:
      "কেউ ভুল করে পুরো একটা Column মুছে Save করে দিলেন। আগের Version কোথাও নেই। গত মাসের সব Payment এর হিসাব গেল।",
    does:
      "DBMS এর সাথে Backup নেওয়ার Tool থাকে, আর চাইলে অতীতের যেকোনো নির্দিষ্ট মুহূর্তে Data ফিরিয়ে আনার ব্যবস্থা করা যায়। এর নাম Point-in-time Recovery।",
    island:
      "প্রতি রাতে Database এর একটা Backup অন্য জায়গায় চলে যায়, আর মাঝে মাঝে সেটা Restore করে দেখা হয় আসলেই কাজ করে কিনা।",
    where: "Module 18 (Operations, Backup & Recovery)",
  },
  {
    id: "language",
    name: "প্রশ্ন করার ভাষা",
    term: "Query Language, SQL",
    before:
      "প্রতিটা নতুন প্রশ্নের জন্য হাতে Filter বসানো, Formula লেখা, তিনটা Sheet পাশাপাশি খুলে মেলানো। মাস শেষের Report বানাতে পুরো একটা দিন।",
    does:
      "DBMS এর সাথে কথা বলার একটা ভাষা থাকে। Relational DBMS এর ভাষা SQL। আপনি শুধু লেখেন কী চান, যেমন কোন ট্যুরে কত সিট খালি। কীভাবে খুঁজতে হবে, সেটা DBMS নিজে ঠিক করে।",
    island:
      "Island Tours এর Website, Admin Panel আর মাসিক Report, তিনটাই একই Database কে SQL এ প্রশ্ন করে।",
    where: "এই মডিউলের Lesson 05, তারপর Module 03 থেকে",
  },
];

export function DbmsJobsLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(JOBS[0].id);
  const job = JOBS.find((j) => j.id === active) ?? JOBS[0];

  return (
    <Panel
      label="Interactive"
      title="DBMS এর সাতটা কাজ"
      footer="প্রতিটা কাজের নাম চাপুন। বাম দিকে Spreadsheet এর দিনের সমস্যা, ডান দিকে DBMS কীভাবে সেটা সামলায়। নিচে লেখা আছে এই ট্র্যাকের কোথায় কাজটা গভীরভাবে শিখবেন।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {JOBS.map((j, i) => (
          <button
            key={j.id}
            type="button"
            onClick={() => setActive(j.id)}
            aria-pressed={j.id === active}
            data-job={j.id}
            className={cn(BTN, j.id === active ? BTN_ON : BTN_OFF)}
          >
            <span className="font-mono opacity-60 mr-1.5">{toBn(i + 1)}</span>
            {j.name}
          </button>
        ))}
      </div>

      <motion.div
        key={job.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-active={job.id}
      >
        <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary mb-4">
          {job.term}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border border-border bg-background p-4">
            <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
              Spreadsheet এর দিনে
            </div>
            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              {job.before}
            </p>
          </div>
          <div className="border border-primary/50 bg-primary/5 p-4">
            <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary mb-2">
              DBMS যা করে
            </div>
            <p className="text-[0.8125rem] leading-relaxed text-foreground">
              {job.does}
            </p>
          </div>
        </div>
        <div className="border border-border bg-muted/20 p-4 mb-3">
          <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
            Island Tours এ
          </div>
          <p className="text-[0.8125rem] leading-relaxed text-foreground/90">
            {job.island}
          </p>
        </div>
        <p className="font-mono text-[0.6875rem] text-muted-foreground">
          গভীরে শিখবেন: <span className="text-foreground">{job.where}</span>
        </p>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. শেষ সিট, দুজন কর্মী: ফাইল বনাম DBMS                                    */
/* ------------------------------------------------------------------------- */

type Mode = "file" | "dbms";

type Frame = {
  text: string;
  riya: string;
  sajib: string;
  /** What is actually stored right now. */
  seatsLeft: number;
  /** Bookings confirmed to customers for this departure. */
  booked: number;
  lockedBy?: "riya";
  verdict?: "bad" | "good";
};

const FRAMES: Record<Mode, Frame[]> = {
  file: [
    {
      text: "শুরু। ধরুন Saint Martin Island Escape এর ২০ নভেম্বরের তারিখে একটাই সিট বাকি। দুজন কর্মী, রিয়া আর সজীব, দুজন আলাদা Customer এর ফোন ধরে আছেন, আর দুজন Customer ই ওই সিটটা চান।",
      riya: "ফোনে Customer",
      sajib: "ফোনে Customer",
      seatsLeft: 1,
      booked: 0,
    },
    {
      text: "রিয়া নিজের Computer এ ফাইলটা খুলে দেখলেন সিট বাকি ১। ঠিক একই সময়ে সজীবও নিজের Computer এ ফাইলের একটা Copy খুলে দেখলেন সিট বাকি ১। দুজনের চোখে এখন একই ছবি।",
      riya: "দেখছেন: ১ সিট",
      sajib: "দেখছেন: ১ সিট",
      seatsLeft: 1,
      booked: 0,
    },
    {
      text: "রিয়া বুকিংটা লিখলেন, সিট বাকি ০ করলেন, Save করলেন। Customer কে বলে দিলেন, আপনার সিট নিশ্চিত।",
      riya: "Save করেছেন: ০ সিট",
      sajib: "এখনো দেখছেন: ১ সিট",
      seatsLeft: 0,
      booked: 1,
    },
    {
      text: "সজীবের Copy তে তখনো সিট বাকি ১। তিনিও বুকিং লিখলেন, ০ করলেন, Save করলেন, আর নিজের Customer কেও নিশ্চিত বলে দিলেন। ফাইলে লেখা ০, অথচ সিট বিক্রি হয়েছে দুটো। একটা সিটের জন্য দুজন যাত্রী জাহাজঘাটে আসবেন।",
      riya: "Customer নিশ্চিত",
      sajib: "Customer নিশ্চিত",
      seatsLeft: 0,
      booked: 2,
      verdict: "bad",
    },
  ],
  dbms: [
    {
      text: "শুরু। একই অবস্থা, একটাই সিট বাকি। এবার Data থাকে PostgreSQL এ, আর দুজন কর্মীর Admin Panel দুটো আলাদা Connection দিয়ে একই Database এর সাথে কথা বলে।",
      riya: "ফোনে Customer",
      sajib: "ফোনে Customer",
      seatsLeft: 1,
      booked: 0,
    },
    {
      text: "রিয়ার Request এক মুহূর্ত আগে পৌঁছাল, যার কথা হলো: সিট থাকলে একটা কমিয়ে দিন। PostgreSQL departures Table এর ওই Row টা রিয়ার কাজের জন্য আটকে দিল, এর নাম Lock। সজীবের Request ও এসেছে, কিন্তু একই Row বদলাতে চায়, তাই তাকে লাইনে দাঁড় করানো হলো।",
      riya: "কাজ চলছে",
      sajib: "অপেক্ষায়",
      seatsLeft: 1,
      booked: 0,
      lockedBy: "riya",
    },
    {
      text: "রিয়ার কাজ শেষ: সিট বাকি ০, বুকিং লেখা হলো, পরিবর্তন পাকা হলো (Commit)। Lock খুলে গেল। রিয়ার Customer নিশ্চিত।",
      riya: "Customer নিশ্চিত",
      sajib: "অপেক্ষায়",
      seatsLeft: 0,
      booked: 1,
    },
    {
      text: "এবার সজীবের পালা। PostgreSQL সজীবের Request এর শর্তটা, সিট থাকলে একটা কমিয়ে দিন, নতুন মানের উপর আবার যাচাই করল। সিট এখন ০, তাই কিছুই বদলাল না। Admin Panel সজীবকে জানাল, এই তারিখে আর সিট নেই। সজীব Customer কে অন্য তারিখ দিলেন।",
      riya: "Customer নিশ্চিত",
      sajib: "সিট নেই, অন্য তারিখ",
      seatsLeft: 0,
      booked: 1,
      verdict: "good",
    },
  ],
};

function ClerkCard({
  name,
  state,
  highlight,
}: {
  name: string;
  state: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "border p-4 transition-colors duration-300",
        highlight ? "border-primary/60 bg-primary/5" : "border-border bg-background",
      )}
    >
      <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
        কর্মী
      </div>
      <div className="text-sm font-bold text-foreground mb-1">{name}</div>
      <div className="text-[0.8125rem] text-muted-foreground">{state}</div>
    </div>
  );
}

export function LastSeatLab() {
  const [mode, setMode] = useState<Mode>("file");
  const [step, setStep] = useState(0);
  const frames = FRAMES[mode];
  const frame = frames[Math.min(step, frames.length - 1)];
  const last = step >= frames.length - 1;

  const choose = (next: Mode) => {
    setMode(next);
    setStep(0);
  };

  return (
    <Panel
      label="Interactive"
      title="শেষ সিট, দুজন কর্মী"
      footer="একবার ফাইল দিয়ে, একবার DBMS দিয়ে, ধাপে ধাপে চালিয়ে দেখুন। একটা সতর্কতা: DBMS নিজে থেকে সব ঠিক করে দেয় না, সে হাতিয়ার দেয়। এখানে App এমনভাবে প্রশ্ন করেছে যাতে শর্ত আর বদল একসাথে হয়। ভুলভাবে প্রশ্ন করলে Database থাকা সত্ত্বেও একই ভুল ঘটতে পারে, আর ঠিক কীভাবে প্রশ্ন করতে হয় তা Module 12 এর Double-booking লেসনে দেখবেন।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          data-mode="file"
          aria-pressed={mode === "file"}
          onClick={() => choose("file")}
          className={cn(BTN, mode === "file" ? BTN_ON : BTN_OFF)}
        >
          শেয়ার করা ফাইল
        </button>
        <button
          type="button"
          data-mode="dbms"
          aria-pressed={mode === "dbms"}
          onClick={() => choose("dbms")}
          className={cn(BTN, mode === "dbms" ? BTN_ON : BTN_OFF)}
        >
          PostgreSQL
        </button>
        <span className="ml-auto flex items-center gap-2">
          <button
            type="button"
            data-action="next"
            onClick={() => setStep((s) => Math.min(s + 1, frames.length - 1))}
            disabled={last}
            className={cn(BTN, last ? "border-border text-muted-foreground/50" : BTN_ON)}
          >
            পরের ধাপ
          </button>
          <button
            type="button"
            data-action="reset"
            onClick={() => setStep(0)}
            aria-label="আবার শুরু"
            className={cn(BTN, BTN_OFF, "flex items-center gap-1.5")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            আবার
          </button>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <ClerkCard name="রিয়া" state={frame.riya} highlight={frame.lockedBy === "riya"} />
        <div className="border border-border bg-muted/20 p-4 text-center" data-seats={frame.seatsLeft}>
          <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
            {mode === "file" ? "ফাইলে লেখা" : "departures Row"}
          </div>
          <div className="font-mono text-3xl font-black text-foreground tabular-nums">
            {toBn(frame.seatsLeft)}
          </div>
          <div className="text-[0.75rem] text-muted-foreground mt-1">সিট বাকি</div>
          <div className="mt-3 font-mono text-[0.6875rem] text-muted-foreground" data-booked={frame.booked}>
            নিশ্চিত বুকিং: <span className="text-foreground font-bold">{toBn(frame.booked)}</span>
          </div>
          {frame.lockedBy && (
            <div className="mt-2 inline-block border border-primary px-2 py-0.5 font-mono text-[0.625rem] font-bold text-primary">
              LOCK: রিয়া
            </div>
          )}
        </div>
        <ClerkCard name="সজীব" state={frame.sajib} />
      </div>

      <div className="flex items-start gap-3">
        <span className="font-mono text-[0.6875rem] font-bold text-primary pt-0.5 shrink-0">
          {toBn(step + 1)}/{toBn(frames.length)}
        </span>
        <p className="text-sm leading-relaxed text-foreground/90">{frame.text}</p>
      </div>

      {frame.verdict && (
        <p
          className={cn(
            "mt-5 border px-4 py-3 text-sm font-bold",
            frame.verdict === "bad"
              ? "border-destructive/50 bg-destructive/5 text-destructive"
              : "border-primary/50 bg-primary/5 text-primary",
          )}
          data-verdict={frame.verdict}
        >
          {frame.verdict === "bad"
            ? "ফল: একটা সিট, দুটো বিক্রি। ফাইল জানেই না দুজন একসাথে কাজ করছিলেন।"
            : "ফল: একটা সিট, একটা বিক্রি। দ্বিতীয়জন অপেক্ষা করেছেন, তারপর সত্যি অবস্থাটা দেখেছেন।"}
        </p>
      )}
    </Panel>
  );
}
