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

function Choice({
  active,
  onClick,
  children,
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}

function CodePane({ title, code, accent }: { title: string; code: string; accent?: boolean }) {
  return (
    <div className={cn("border min-w-0", accent ? "border-primary/50" : "border-border")}>
      <div
        className={cn(
          "px-4 py-2 border-b font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em]",
          accent ? "border-primary/50 bg-primary/5 text-primary" : "border-border bg-muted/30 text-muted-foreground",
        )}
      >
        {title}
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground bg-background">
        {code}
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. MySQL এর ভিডিও দেখছেন, অনুশীলন করছেন PostgreSQL এ: অনুবাদের টেবিল        */
/* ------------------------------------------------------------------------- */

interface DialectTask {
  id: string;
  label: string;
  mysql: string;
  postgres: string;
  same: boolean;
  note: string;
}

const TASKS: DialectTask[] = [
  {
    id: "same",
    label: "সাধারণ একটা প্রশ্ন",
    mysql: "SELECT title, price_bdt\nFROM tours\nWHERE price_bdt < 10000\nORDER BY price_bdt\nLIMIT 3;",
    postgres: "SELECT title, price_bdt\nFROM tours\nWHERE price_bdt < 10000\nORDER BY price_bdt\nLIMIT 3;",
    same: true,
    note: "হুবহু এক। SELECT, FROM, WHERE, ORDER BY আর LIMIT দুই জায়গায় একইভাবে লেখা হয়। আপনার ভিডিওর প্রথম কয়েক ঘণ্টার বেশিরভাগ Query এরকম, তাই সেগুলো PostgreSQL এ টাইপ করলে কিছুই বদলাতে হবে না।",
  },
  {
    id: "auto-id",
    label: "নিজে থেকে বাড়া ID",
    mysql: "CREATE TABLE tour_notes (\n  note_id INT AUTO_INCREMENT PRIMARY KEY,\n  note    TEXT NOT NULL\n);",
    postgres: "CREATE TABLE tour_notes (\n  note_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  note    text NOT NULL\n);",
    same: false,
    note: "ভিডিওতে AUTO_INCREMENT দেখলে PostgreSQL এ লিখবেন GENERATED ALWAYS AS IDENTITY। পুরনো PostgreSQL টিউটোরিয়ালে SERIAL ও দেখবেন, সেটাও কাজ করে, তবে নতুন Table এ IDENTITY ই ভালো। কেন, সেটা Module 09 এ।",
  },
  {
    id: "quote-name",
    label: "অদ্ভুত নাম মুড়িয়ে লেখা",
    mysql: "SELECT `order`\nFROM shop_orders;",
    postgres: 'SELECT "order"\nFROM shop_orders;',
    same: false,
    note: "order শব্দটা SQL এর নিজের Keyword, তাই এই নামের Column কে মুড়িয়ে লিখতে হয়। MySQL মোড়ায় Backtick দিয়ে, PostgreSQL মোড়ায় Double Quote দিয়ে। PostgreSQL এ Backtick লিখলে সরাসরি Syntax Error আসে। সবচেয়ে ভালো উপায় অবশ্য এমন নাম না রাখা।",
  },
  {
    id: "case",
    label: "ছোট বড় হাতের অক্ষর না মেনে খোঁজা",
    mysql: "SELECT title\nFROM tours\nWHERE title LIKE 'saint%';",
    postgres: "SELECT title\nFROM tours\nWHERE title ILIKE 'saint%';",
    same: false,
    note: "MySQL এর Default Setting এ LIKE ছোট আর বড় হাতের অক্ষরকে একই ধরে, তাই saint লিখলেও Saint মিলে যায়। PostgreSQL এ LIKE অক্ষরে অক্ষরে মেলায়, তাই একই Query তে কোনো Row আসে না। ছোট বড় না মানতে চাইলে PostgreSQL এ ILIKE লিখুন।",
  },
  {
    id: "concat",
    label: "লেখা জোড়া দেওয়া",
    mysql: "SELECT CONCAT(full_name, ' (', city, ')')\nFROM customers;",
    postgres: "SELECT full_name || ' (' || city || ')'\nFROM customers;",
    same: false,
    note: "PostgreSQL এ || মানে লেখা জোড়া দেওয়া, CONCAT() ও চলে। MySQL এর Default Setting এ || মানে OR, লেখা জোড়া না, আর এই ব্যবহারটা MySQL এখন Deprecated ঘোষণা করেছে। তাই MySQL এর ভিডিওতে সবসময় CONCAT() দেখবেন, যেটা PostgreSQL এও হুবহু চলে।",
  },
  {
    id: "month",
    label: "তারিখ থেকে মাস বের করা",
    mysql: "SELECT DATE_FORMAT(booked_at, '%Y-%m') AS month\nFROM bookings;",
    postgres: "SELECT to_char(booked_at, 'YYYY-MM') AS month\nFROM bookings;",
    same: false,
    note: "তারিখ সাজিয়ে লেখার Function দুই জায়গায় আলাদা নামের, আর Format লেখার নিয়মও আলাদা। MySQL এ %Y আর %m, PostgreSQL এ YYYY আর MM। Function এর নাম আর Format ভিডিও থেকে হুবহু কপি করবেন না, এটা সবচেয়ে বেশি আটকায়।",
  },
  {
    id: "time-type",
    label: "সময় রাখার Column",
    mysql: "CREATE TABLE payments_demo (\n  paid_at DATETIME NOT NULL\n);",
    postgres: "CREATE TABLE payments_demo (\n  paid_at timestamptz NOT NULL\n);",
    same: false,
    note: "MySQL এর DATETIME কোনো সময় অঞ্চল মনে রাখে না, যা লিখবেন তাই থাকবে। PostgreSQL এর timestamptz সময়টাকে একটা নির্দিষ্ট মুহূর্ত হিসেবে রাখে, তাই ঢাকা আর লন্ডন থেকে দেখলেও গুলিয়ে যায় না। Island Tours এর সব সময় timestamptz এ রাখা। বিস্তারিত Module 09 এ।",
  },
  {
    id: "upsert",
    label: "থাকলে বদলানো, না থাকলে ঢোকানো",
    mysql: "INSERT INTO destinations (name, region, kind)\nVALUES ('Kuakata', 'Barishal', 'beach')\nON DUPLICATE KEY UPDATE kind = 'beach';",
    postgres: "INSERT INTO destinations (name, region, kind)\nVALUES ('Kuakata', 'Barishal', 'beach')\nON CONFLICT (name) DO UPDATE SET kind = EXCLUDED.kind;",
    same: false,
    note: "দুই Program এই কাজটা পারে, কিন্তু লেখার নিয়ম পুরো আলাদা। PostgreSQL এ ON CONFLICT এর পরে বলে দিতে হয় কোন Column এর মিল নিয়ে কথা হচ্ছে। এটা Module 10 এর বিষয়, এখন শুধু চিনে রাখুন যে নাম আলাদা।",
  },
  {
    id: "full-join",
    label: "দুই দিকের সব Row",
    mysql: "SELECT d.name, t.title\nFROM destinations d\nLEFT JOIN tours t ON t.destination_id = d.destination_id\nUNION\nSELECT d.name, t.title\nFROM destinations d\nRIGHT JOIN tours t ON t.destination_id = d.destination_id;",
    postgres: "SELECT d.name, t.title\nFROM destinations d\nFULL OUTER JOIN tours t\n  ON t.destination_id = d.destination_id;",
    same: false,
    note: "MySQL এ FULL OUTER JOIN নেই, তাই ভিডিওতে LEFT আর RIGHT JOIN কে UNION দিয়ে জুড়ে দেখানো হয়। PostgreSQL এ সরাসরি FULL OUTER JOIN লেখা যায়। Join নিয়ে পুরো আলোচনা Module 06 এ।",
  },
];

export function DialectTranslatorLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(TASKS[0].id);
  const task = TASKS.find((t) => t.id === active) ?? TASKS[0];
  const differs = TASKS.filter((t) => !t.same).length;

  return (
    <Panel
      label="Interactive"
      title="MySQL থেকে PostgreSQL এ অনুবাদ"
      footer={`একটা কাজ বেছে নিন, দুই দিকে দেখুন একই কাজ কীভাবে লেখা হয়। এখানে ${toBn(TASKS.length)}টা কাজের মধ্যে ${toBn(differs)}টাতে লেখা আলাদা, শুধু প্রথমটা হুবহু এক। কিন্তু এই তালিকা ইচ্ছা করে পার্থক্য দিয়ে ভরা। বাস্তবে আপনার লেখা Query গুলোর বেশিরভাগই প্রথমটার মতো, দুই জায়গায় একই।`}
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {TASKS.map((t) => (
          <Choice key={t.id} active={t.id === active} onClick={() => setActive(t.id)} data-dialect={t.id}>
            {t.label}
          </Choice>
        ))}
      </div>

      <motion.div
        key={task.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-active-dialect={task.id}
      >
        <div className="mb-4">
          <span
            className={cn(
              "inline-block px-2 py-1 border font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em]",
              task.same ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground",
            )}
          >
            {task.same ? "দুই জায়গায় একই" : "লেখা আলাদা"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <CodePane title="MySQL (আপনার ভিডিও)" code={task.mysql} />
          <CodePane title="PostgreSQL (এই ট্র্যাক)" code={task.postgres} accent />
        </div>
        <p className="text-sm leading-relaxed text-foreground">{task.note}</p>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন Statement কোন পরিবারের                                               */
/* ------------------------------------------------------------------------- */

type Family = "DDL" | "DML" | "DQL" | "DCL" | "TCL";
const FAMILY_NAMES: Family[] = ["DDL", "DML", "DQL", "DCL", "TCL"];

const STATEMENTS: { sql: string; family: Family; why: string }[] = [
  {
    sql: "SELECT title, price_bdt FROM tours;",
    family: "DQL",
    why: "শুধু পড়ছে। Data বা কাঠামো কিছুই বদলাচ্ছে না, যতবার খুশি চালালেও Database আগের মতোই থাকবে।",
  },
  {
    sql: "CREATE TABLE tour_notes (\n  note_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  note text NOT NULL\n);",
    family: "DDL",
    why: "নতুন একটা Table বানাচ্ছে, মানে Database এর কাঠামো বদলাচ্ছে। ভেতরে এখনো একটাও Row নেই।",
  },
  {
    sql: "INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)\nVALUES (15, 9, 2, 'pending', 25000.00);",
    family: "DML",
    why: "নতুন একটা Row ঢোকাচ্ছে। Table এর কাঠামো একই থাকছে, শুধু ভেতরের Data বাড়ছে।",
  },
  {
    sql: "GRANT SELECT ON tours TO report_reader;",
    family: "DCL",
    why: "report_reader নামের একজনকে tours পড়ার অনুমতি দিচ্ছে। Data বা কাঠামো না, অনুমতি বদলাচ্ছে।",
  },
  {
    sql: "BEGIN;",
    family: "TCL",
    why: "একটা Transaction শুরু করছে। এরপরের কাজগুলো একসাথে বাঁধা থাকবে, শেষে COMMIT করলে সবগুলো টিকবে, ROLLBACK করলে একটাও না।",
  },
  {
    sql: "ALTER TABLE customers ADD COLUMN referral_code text;",
    family: "DDL",
    why: "Table এ নতুন Column যোগ করছে। প্রতিটা Customer এর Row তে একটা নতুন ঘর তৈরি হলো, কিন্তু সেটা কাঠামোর বদল, তাই DDL।",
  },
  {
    sql: "UPDATE tours SET price_bdt = 9000 WHERE tour_id = 2;",
    family: "DML",
    why: "একটা Row এর একটা মান বদলাচ্ছে। Column গুলো একই আছে, শুধু Data বদলাল।",
  },
  {
    sql: "DELETE FROM reviews WHERE rating < 3;",
    family: "DML",
    why: "Row মুছছে, Table টা কিন্তু থেকে যাচ্ছে। পুরো Table মুছতে চাইলে লাগত DROP TABLE, সেটা DDL।",
  },
  {
    sql: "REVOKE SELECT ON tours FROM report_reader;",
    family: "DCL",
    why: "আগে দেওয়া অনুমতি ফিরিয়ে নিচ্ছে। GRANT এর উল্টো, একই পরিবার।",
  },
  {
    sql: "ROLLBACK;",
    family: "TCL",
    why: "Transaction এর ভেতরের সব কাজ বাতিল করছে, যেন কিছুই হয়নি।",
  },
  {
    sql: "SELECT count(*) FROM bookings WHERE status = 'confirmed';",
    family: "DQL",
    why: "গুনছে, কিন্তু কিছুই বদলাচ্ছে না। count এর মতো হিসাব করলেও এটা পড়া, তাই DQL।",
  },
  {
    sql: "DROP TABLE tour_notes;",
    family: "DDL",
    why: "পুরো Table টাই, ভেতরের সব Row সহ, মুছে ফেলছে। কাঠামো মুছে যাচ্ছে, তাই DDL। আর এটা সবচেয়ে সাবধানে চালানোর Command।",
  },
];

export function CommandFamilyLab() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Family | null>(null);
  const [score, setScore] = useState(0);
  const finished = index >= STATEMENTS.length;
  const current = STATEMENTS[Math.min(index, STATEMENTS.length - 1)];

  const pick = (family: Family) => {
    if (picked || finished) return;
    setPicked(family);
    if (family === current.family) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setPicked(null);
    setIndex(0);
    setScore(0);
  };

  return (
    <Panel
      label="Interactive"
      title="এই Statement কোন পরিবারের?"
      footer="প্রতিটা Statement পড়ে নিজেকে একটাই প্রশ্ন করুন: এটা কী বদলাচ্ছে? কাঠামো বদলালে DDL, ভেতরের Data বদলালে DML, কিছুই না বদলে শুধু পড়লে DQL, অনুমতি বদলালে DCL, আর কয়েকটা কাজকে একসাথে বাঁধলে বা খুললে TCL। এই একটা প্রশ্নেই প্রায় সব উত্তর মিলে যায়।"
    >
      <div className="flex items-center justify-between gap-3 mb-4 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">
        <span data-family-progress>
          {finished ? "শেষ" : `${toBn(index + 1)} / ${toBn(STATEMENTS.length)}`}
        </span>
        <span data-family-score>সঠিক: {toBn(score)}</span>
      </div>

      {finished ? (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground">
            {toBn(STATEMENTS.length)}টার মধ্যে {toBn(score)}টা সঠিক।{" "}
            {score === STATEMENTS.length
              ? "পুরোটাই ঠিক। পাঁচ পরিবার আপনার মাথায় বসে গেছে।"
              : "যেগুলো ভুল হয়েছে, আবার চালিয়ে দেখুন। প্রতিবার নিজেকে জিজ্ঞেস করুন Statement টা কী বদলাচ্ছে।"}
          </p>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground hover:border-primary/50 hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            আবার শুরু
          </button>
        </div>
      ) : (
        <motion.div
          key={index}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <pre className="mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-foreground">
            {current.sql}
          </pre>
          <div className="flex flex-wrap gap-2 mb-5">
            {FAMILY_NAMES.map((family) => {
              const isAnswer = picked !== null && family === current.family;
              const isWrongPick = picked === family && family !== current.family;
              return (
                <button
                  key={family}
                  type="button"
                  onClick={() => pick(family)}
                  disabled={picked !== null}
                  data-family={family}
                  className={cn(
                    "min-w-16 px-3 py-2 border font-mono text-[0.75rem] font-bold transition-colors",
                    isAnswer && "border-primary bg-primary/10 text-primary",
                    isWrongPick && "border-destructive/60 bg-destructive/10 text-destructive",
                    !isAnswer && !isWrongPick && "border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:hover:text-muted-foreground disabled:hover:border-border",
                  )}
                >
                  {family}
                </button>
              );
            })}
          </div>
          {picked && (
            <div className="space-y-4" data-family-verdict={picked === current.family ? "right" : "wrong"}>
              <p className="text-sm leading-relaxed text-foreground">
                <span className={cn("font-bold", picked === current.family ? "text-primary" : "text-destructive")}>
                  {picked === current.family ? "ঠিক। " : `এটা ${current.family}। `}
                </span>
                {current.why}
              </p>
              <button
                type="button"
                onClick={next}
                className="border border-primary bg-primary px-3 py-1.5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-primary-foreground hover:opacity-90"
              >
                {index + 1 === STATEMENTS.length ? "ফলাফল দেখুন" : "পরেরটা"}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </Panel>
  );
}
