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
/* 1. একই ভুল, তিনভাবে চালালে তিন ফলাফল                                       */
/* ------------------------------------------------------------------------- */

type ModeId = "plain" | "stop" | "single";
type ScenarioId = "again" | "mine";

const MODES: { id: ModeId; label: string; flags: string }[] = [
  { id: "plain", label: "শুধু -f", flags: "" },
  { id: "stop", label: "ON_ERROR_STOP", flags: "-v ON_ERROR_STOP=1 " },
  {
    id: "single",
    label: "ON_ERROR_STOP + single-transaction",
    flags: "-v ON_ERROR_STOP=1 --single-transaction ",
  },
];

const SCENARIOS: {
  id: ScenarioId;
  label: string;
  file: string;
  story: string;
  tables: string[];
  before: number[];
}[] = [
  {
    id: "again",
    label: "শুধু INSERT অংশটা আবার",
    file: "inserts-only.sql",
    story:
      "Database আগেই Load করা। এবার কেউ পুরো ফাইল না চালিয়ে শুধু INSERT এর অংশটা কপি করে আরেকটা ফাইলে রেখে চালালেন। মানে DROP আর CREATE বাদ, একই Row আবার ঢোকানোর চেষ্টা।",
    tables: ["destinations", "guides", "tours", "customers", "departures", "bookings", "payments", "reviews"],
    before: [7, 5, 9, 15, 16, 24, 19, 10],
  },
  {
    id: "mine",
    label: "তিন লাইনের নিজের ফাইল",
    file: "my-additions.sql",
    story:
      "নিজে একটা ছোট ফাইল লিখলেন: প্রথম লাইনে নতুন Guide Tania Sultana, দ্বিতীয় লাইনে তাঁকে দিয়ে Kuakata তে নতুন ট্যুর, তৃতীয় লাইনে একজন Customer যাঁর Email ভুল করে Rahim Uddin এর Email এর সাথে মিলে গেছে।",
    tables: ["guides", "tours", "customers"],
    before: [5, 9, 15],
  },
];

type Outcome = { output: string[]; exit: number; after: number[]; verdict: string; good: boolean };

// Every line, exit code and count below was produced by running the command
// against PostgreSQL 18.6 with the Island Tours database freshly loaded.
const OUTCOMES: Record<ScenarioId, Record<ModeId, Outcome>> = {
  again: {
    plain: {
      output: [
        'psql:inserts-only.sql:8: ERROR:  duplicate key value violates unique constraint "destinations_name_key"',
        "INSERT 0 5",
        "INSERT 0 9",
        'psql:inserts-only.sql:43: ERROR:  duplicate key value violates unique constraint "customers_email_key"',
        "INSERT 0 16",
        "INSERT 0 24",
        "INSERT 0 19",
        'psql:inserts-only.sql:120: ERROR:  duplicate key value violates unique constraint "reviews_booking_id_key"',
      ],
      exit: 0,
      after: [7, 10, 18, 15, 32, 48, 38, 10],
      verdict:
        "তিনটা Table এ Error এসে থেমেছে, কারণ সেখানে UNIQUE নিয়ম আছে। বাকি পাঁচটায় কোনো বাধা নেই, তাই সব Row দ্বিতীয়বার ঢুকে গেছে। Bookings এখন ৪৮টা, অর্ধেক নকল। আর psql শেষে বলছে সব ঠিক আছে, Exit Code 0।",
      good: false,
    },
    stop: {
      output: [
        'psql:inserts-only.sql:8: ERROR:  duplicate key value violates unique constraint "destinations_name_key"',
      ],
      exit: 3,
      after: [7, 5, 9, 15, 16, 24, 19, 10],
      verdict:
        "প্রথম Error এই থেমে গেছে, আর প্রথম Statement টাই ব্যর্থ হয়েছিল, তাই কিছুই বদলায়নি। Exit Code 3 মানে Script এর ভেতরে Error হয়েছে।",
      good: true,
    },
    single: {
      output: [
        'psql:inserts-only.sql:8: ERROR:  duplicate key value violates unique constraint "destinations_name_key"',
      ],
      exit: 3,
      after: [7, 5, 9, 15, 16, 24, 19, 10],
      verdict:
        "একই ফলাফল, কারণ ভুলটা একদম প্রথম লাইনে। পার্থক্য দেখতে অন্য Scenario টা বেছে নিন।",
      good: true,
    },
  },
  mine: {
    plain: {
      output: [
        "INSERT 0 1",
        "INSERT 0 1",
        'psql:my-additions.sql:3: ERROR:  duplicate key value violates unique constraint "customers_email_key"',
      ],
      exit: 0,
      after: [6, 10, 15],
      verdict:
        "Guide আর ট্যুর ঢুকেছে, Customer ঢোকেনি। ফাইলটা অর্ধেক চলেছে, অথচ Exit Code 0। কোনো Script বা Deploy Pipeline এই ভুলটা ধরতেই পারবে না।",
      good: false,
    },
    stop: {
      output: [
        "INSERT 0 1",
        "INSERT 0 1",
        'psql:my-additions.sql:3: ERROR:  duplicate key value violates unique constraint "customers_email_key"',
      ],
      exit: 3,
      after: [6, 10, 15],
      verdict:
        "Error এ থেমেছে আর Exit Code 3 দিয়ে জানিয়েছে, এটা ভালো। কিন্তু আগের দুটো লাইন ততক্ষণে ঢুকে গেছে, Database এখনো অর্ধেক বদলানো অবস্থায়।",
      good: false,
    },
    single: {
      output: [
        "INSERT 0 1",
        "INSERT 0 1",
        'psql:my-additions.sql:3: ERROR:  duplicate key value violates unique constraint "customers_email_key"',
      ],
      exit: 3,
      after: [5, 9, 15],
      verdict:
        "পুরো ফাইল একটা Transaction এর ভেতরে চলেছিল। তৃতীয় লাইনে Error হতেই আগের দুটোও বাতিল। হয় সবটা, নয়তো কিছুই না। ভুলটা ঠিক করে আবার চালালেই হলো।",
      good: true,
    },
  },
};

export function LoadModeLab() {
  const reduce = useReducedMotion();
  const [scenario, setScenario] = useState<ScenarioId>("mine");
  const [mode, setMode] = useState<ModeId>("plain");
  const sc = SCENARIOS.find((s) => s.id === scenario)!;
  const out = OUTCOMES[scenario][mode];
  const flags = MODES.find((m) => m.id === mode)!.flags;

  return (
    <Panel
      label="Lab"
      title="একই ফাইল, তিনভাবে চালানো"
      footer="প্রতিটা লাইন, Exit Code আর সংখ্যা PostgreSQL 18.6 এ সত্যি চালিয়ে নেওয়া, প্রতিবার Database আগে নতুন করে Load করে। জায়গা বাঁচাতে প্রতিটা Error এর নিচের DETAIL লাইনটা এখানে দেখানো হয়নি। Exit Code 0 মানে psql এর চোখে সব ঠিক, 3 মানে Script এর ভেতরে Error হয়ে থেমেছে।"
    >
      <div className="space-y-5">
        <div>
          <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">
            কী চালাচ্ছেন
          </p>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                data-scenario={s.id}
                aria-pressed={s.id === scenario}
                onClick={() => setScenario(s.id)}
                className={cn(BTN, s.id === scenario ? BTN_ON : BTN_OFF)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{sc.story}</p>
        </div>

        <div>
          <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">
            কীভাবে চালাচ্ছেন
          </p>
          <div className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                data-mode={m.id}
                aria-pressed={m.id === mode}
                onClick={() => setMode(m.id)}
                className={cn(BTN, m.id === mode ? BTN_ON : BTN_OFF)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={`${scenario}-${mode}`}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          data-outcome={`${scenario}-${mode}`}
          className="space-y-4"
        >
          <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground/90">
            <span className="text-primary">$ </span>
            {`psql ${flags}-d island_tours -f ${sc.file}`}
            {"\n"}
            {out.output.join("\n")}
            {"\n"}
            <span className="text-muted-foreground">{`$ echo $?\n${out.exit}`}</span>
          </pre>

          <div className="overflow-x-auto border border-border">
            <table className="w-full border-collapse font-mono text-[0.75rem]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-3 py-2 text-left font-bold">table</th>
                  <th className="px-3 py-2 text-right font-bold">আগে</th>
                  <th className="px-3 py-2 text-right font-bold">পরে</th>
                </tr>
              </thead>
              <tbody>
                {sc.tables.map((table, i) => {
                  const changed = out.after[i] !== sc.before[i];
                  return (
                    <tr key={table} className="border-t border-border/60" data-changed={changed}>
                      <td className="px-3 py-1.5">{table}</td>
                      <td className="px-3 py-1.5 text-right text-muted-foreground">{sc.before[i]}</td>
                      <td className={cn("px-3 py-1.5 text-right", changed ? "font-bold text-primary" : "text-foreground/90")}>
                        {out.after[i]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div
            className={cn(
              "border px-4 py-3 text-sm leading-relaxed",
              out.good ? "border-primary/50 bg-primary/5 text-foreground" : "border-destructive/40 bg-destructive/5 text-foreground",
            )}
            data-verdict={out.good ? "safe" : "unsafe"}
          >
            <span className="mr-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em]">
              {out.good ? "নিরাপদ" : "বিপদ"}
            </span>
            {out.verdict}
          </div>
        </motion.div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Error টা পড়ুন, কারণ আর সমাধান খুঁজুন                                    */
/* ------------------------------------------------------------------------- */

type LoadError = {
  id: string;
  label: string;
  message: string;
  who: string;
  cause: string;
  fix: string;
};

// The messages are copied from real runs (PostgreSQL 18.6 and MySQL 8.4.11 in
// Docker). On your machine a socket path or file path inside them may differ.
const ERRORS: LoadError[] = [
  {
    id: "no-file",
    label: "ফাইল নেই",
    message: "psql: error: island-tour.sql: No such file or directory",
    who: "psql, আপনার নিজের কম্পিউটারে",
    cause:
      "psql যে ফোল্ডারে দাঁড়িয়ে আছে, সেখানে এই নামে কোনো ফাইল নেই। হয় নামের বানান ভুল (এখানে island-tours এর s বাদ পড়েছে), নয়তো আপনি অন্য ফোল্ডারে আছেন।",
    fix: "ls (Windows এ dir) দিয়ে দেখুন ফাইলটা এখানে আছে কিনা। না থাকলে cd ~/Downloads করে সেখানে যান, অথবা পুরো পথ লিখুন। নাম লেখার সময় Tab চাপলে Terminal নিজেই বাকিটা পূরণ করে, বানান ভুলের সুযোগ থাকে না।",
  },
  {
    id: "spaces",
    label: "পথে Space",
    message:
      'psql: warning: extra command-line argument "files/island-tours.sql" ignored\npsql: error: /tmp/my: No such file or directory',
    who: "psql, আপনার নিজের কম্পিউটারে",
    cause:
      "ফোল্ডারের নাম my files, মাঝে একটা Space। Quote ছাড়া লিখলে Shell পথটাকে দুই টুকরো ভাবে: /tmp/my একটা, files/island-tours.sql আরেকটা। psql প্রথমটা খোঁজে আর দ্বিতীয়টা উপেক্ষা করে।",
    fix: 'পুরো পথটা Double Quote এর ভেতরে রাখুন: psql -d island_tours -f "/tmp/my files/island-tours.sql"। আরও সহজ হলো ফাইলটা Space ছাড়া কোনো ফোল্ডারে রাখা।',
  },
  {
    id: "no-db",
    label: "Database নেই",
    message:
      'psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  database "island_tour" does not exist',
    who: "Server, Connect করার মুহূর্তে",
    cause:
      "Server চলছে, আপনার পরিচয়ও ঠিক আছে, কিন্তু এই নামের Database নেই। হয় নামে বানান ভুল, নয়তো createdb চালাতে ভুলে গেছেন।",
    fix: "psql -l দিয়ে Server এর সব Database এর নাম দেখুন। island_tours না থাকলে আগে createdb island_tours চালান, তারপর Load।",
  },
  {
    id: "exists",
    label: "Database আগে থেকেই আছে",
    message: 'createdb: error: database creation failed: ERROR:  database "island_tours" already exists',
    who: "Server, createdb এর অনুরোধে",
    cause:
      "আপনি আগেও একবার createdb চালিয়েছেন। এটা কোনো ক্ষতি করেনি, শুধু জানাচ্ছে যে আবার বানানোর দরকার নেই।",
    fix: "সরাসরি Load এর ধাপে যান। ফাইলটা নিজেই আগের সব Table মুছে নতুন করে বানায়। পুরোপুরি খালি Database চাইলে আগে dropdb island_tours, তারপর createdb।",
  },
  {
    id: "wrong-db",
    label: "ভুল Database এ Connect",
    message:
      'ERROR:  relation "bookings" does not exist\nLINE 1: SELECT count(*) FROM bookings;\n                             ^',
    who: "Server, Query চালানোর সময়",
    cause:
      "আপনি Connect করে আছেন অন্য কোনো Database এ, প্রায়ই postgres নামেরটায়, যেখানে এই Table নেই। আরও খারাপ হয় যদি Load টাই সেখানে চালিয়ে থাকেন: তখন আটটা Table postgres Database এ তৈরি হয়ে বসে থাকে।",
    fix: "SELECT current_database(); দিয়ে দেখুন কোথায় আছেন, তারপর \\c island_tours। ভুল করে postgres এ Load করে থাকলে সেখানে \\dt দেখে আটটা Table DROP করে দিন।",
  },
  {
    id: "permission",
    label: "অনুমতি নেই",
    message: "psql: error: /tmp/locked.sql: Permission denied",
    who: "Operating System, psql ফাইল খুলতে গেলে",
    cause:
      "যে OS User হিসেবে psql চলছে, সে এই ফাইলটা পড়তে পারে না। Linux এ sudo -u postgres psql ... -f ~/Downloads/... চালালে প্রায়ই এটা হয়: postgres নামের OS User আপনার Home ফোল্ডারে ঢুকতে পারে না।",
    fix: "ফাইলটা আপনার Shell কে দিয়ে পড়ান: sudo -u postgres psql -d island_tours < island-tours.sql। এখানে < চিহ্ন দেখে ফাইলটা খোলে আপনার নিজের Shell, psql শুধু লেখাগুলো পায়।",
  },
  {
    id: "duplicate",
    label: "একই Row দুইবার",
    message:
      'psql:inserts-only.sql:8: ERROR:  duplicate key value violates unique constraint "destinations_name_key"\nDETAIL:  Key (name)=(Saint Martin\'s Island) already exists.',
    who: "Server, INSERT এর সময়",
    cause:
      "পুরো ফাইল না চালিয়ে শুধু INSERT এর অংশটা আবার চালানো হয়েছে। যেখানে UNIQUE নিয়ম আছে সেখানে Error, আর যেখানে নেই সেখানে চুপচাপ নকল Row ঢুকে গেছে।",
    fix: "সবসময় পুরো ফাইলটা চালান, কারণ সেটা আগে DROP করে। নকল ঢুকে গিয়ে থাকলে পুরো ফাইল আরেকবার চালালেই সব আগের অবস্থায় ফিরবে। নিজের ফাইলে -v ON_ERROR_STOP=1 --single-transaction ব্যবহার করুন।",
  },
  {
    id: "mysql-no-db",
    label: "MySQL: Database বলা হয়নি",
    message: "ERROR 1046 (3D000) at line 11: No database selected",
    who: "MySQL Server",
    cause:
      "mysql Command এ Database এর নাম দিতে ভুলে গেছেন। ফাইলের ভেতরে কোনো USE লাইন নেই, তাই MySQL জানে না Table গুলো কোথায় বানাবে।",
    fix: "নামটা Command এ দিন: mysql -u root -p island_tours < island-tours.mysql.sql",
  },
  {
    id: "mysql-unknown",
    label: "MySQL: Database অচেনা",
    message: "ERROR 1049 (42000): Unknown database 'island_tours'",
    who: "MySQL Server, Connect করার মুহূর্তে",
    cause: "নাম ঠিকই দিয়েছেন, কিন্তু Database টা এখনো বানানো হয়নি।",
    fix: 'আগে বানান: mysql -u root -p -e "CREATE DATABASE island_tours", তারপর Load।',
  },
];

export function LoadErrorLab() {
  const [active, setActive] = useState(ERRORS[0].id);
  const current = ERRORS.find((e) => e.id === active) ?? ERRORS[0];
  const index = ERRORS.indexOf(current);

  return (
    <Panel
      label="Lab"
      title="Load ভাঙলে কী লেখে, আর কী করবেন"
      footer="প্রতিটা Message সত্যি চালিয়ে পাওয়া, Docker এর ভেতরে PostgreSQL 18.6 আর MySQL 8.4.11 এ। আপনার মেশিনে Socket বা ফাইলের পথটুকু আলাদা হতে পারে, বাকিটা একই থাকবে।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {ERRORS.map((e) => (
          <button
            key={e.id}
            type="button"
            data-error={e.id}
            aria-pressed={e.id === active}
            onClick={() => setActive(e.id)}
            className={cn(BTN, e.id === active ? BTN_ON : BTN_OFF)}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div data-active={current.id} className="space-y-4">
        <pre className="overflow-x-auto border border-destructive/40 bg-destructive/5 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground/90 whitespace-pre">
          {current.message}
        </pre>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border border-border bg-background p-4">
            <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              কে বলছে
            </p>
            <p className="text-[0.8125rem] leading-relaxed">{current.who}</p>
          </div>
          <div className="border border-border bg-background p-4">
            <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              কেন হলো
            </p>
            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{current.cause}</p>
          </div>
          <div className="border border-primary/50 bg-primary/5 p-4">
            <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary">
              কী করবেন
            </p>
            <p className="text-[0.8125rem] leading-relaxed">{current.fix}</p>
          </div>
        </div>
        <p className="font-mono text-[0.625rem] text-muted-foreground">
          {toBn(index + 1)} / {toBn(ERRORS.length)}
        </p>
      </div>
    </Panel>
  );
}
