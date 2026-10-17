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

const BTN = "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left";
const BTN_ON = "border-primary bg-primary/10 text-primary";
const BTN_OFF =
  "border-border text-muted-foreground hover:text-foreground hover:border-primary/40";

/* ------------------------------------------------------------------------- */
/* 1. একটা Error এর প্রতিটা অংশ                                                 */
/* ------------------------------------------------------------------------- */

type PartKind =
  | "client"
  | "severity"
  | "sqlstate"
  | "message"
  | "line"
  | "caret"
  | "detail"
  | "hint"
  | "location";

const PART_NAMES: Record<PartKind, string> = {
  client: "psql এর নিজের কথা",
  severity: "Severity",
  sqlstate: "SQLSTATE",
  message: "Message",
  line: "LINE",
  caret: "^ চিহ্ন",
  detail: "DETAIL",
  hint: "HINT",
  location: "LOCATION",
};

type Segment = { text: string; part?: PartKind };

type AnatomyError = {
  id: string;
  label: string;
  statement: string;
  lines: Segment[][];
  notes: Partial<Record<PartKind, string>>;
  fix: string;
};

const ANATOMY: AnatomyError[] = [
  {
    id: "comma",
    label: "কমা নেই",
    statement: "SELECT title price_bdt duration_days FROM tours;",
    lines: [
      [{ text: "ERROR:", part: "severity" }, { text: '  syntax error at or near "duration_days"', part: "message" }],
      [{ text: "LINE 1:", part: "line" }, { text: " SELECT title price_bdt duration_days FROM tours;" }],
      [{ text: "                               " }, { text: "^", part: "caret" }],
    ],
    notes: {
      severity:
        "ERROR মানে শুধু এই একটা Statement বাতিল হয়েছে। Connection চালু আছে, পরের লাইনেই আবার লিখতে পারবেন। কিছুই বদলায়নি।",
      message:
        "syntax error at or near মানে বাক্যটার গঠনেই ভুল, PostgreSQL পড়তে পড়তে যে শব্দে এসে আর মেলাতে পারেনি, সেটা Quote এর ভেতরে দেখাচ্ছে: duration_days।",
      line: "LINE 1: এর পরে আপনার বাক্যটাই হুবহু, যে লাইনে PostgreSQL আটকেছে। এক লাইনের Query তে সবসময় LINE 1।",
      caret:
        "^ ঠিক duration_days এর নিচে। কিন্তু আসল ভুলটা তার একটু আগে: title আর price_bdt এর মাঝে কমা নেই, তাই PostgreSQL price_bdt কে title এর ডাকনাম (Alias) ধরে নিয়েছে। তারপর আরেকটা শব্দ এসে সে বিভ্রান্ত। Syntax Error এ ^ এর ঠিক আগের অংশটা আগে দেখুন।",
    },
    fix: "SELECT title, price_bdt, duration_days FROM tours;",
  },
  {
    id: "column",
    label: "Column এর বানান",
    statement: "SELECT titel FROM tours;",
    lines: [
      [{ text: "ERROR:", part: "severity" }, { text: '  column "titel" does not exist', part: "message" }],
      [{ text: "LINE 1:", part: "line" }, { text: " SELECT titel FROM tours;" }],
      [{ text: "               " }, { text: "^", part: "caret" }],
      [{ text: "HINT:", part: "hint" }, { text: '  Perhaps you meant to reference the column "tours.title".', part: "hint" }],
    ],
    notes: {
      severity: "আবারও ERROR, মানে এই Statement টা বাতিল, বাকি সব ঠিক আছে।",
      message:
        "বাক্যের গঠন ঠিক ছিল, তাই এবার Parser আপত্তি করেনি। আপত্তি এসেছে পরের ধাপ থেকে, যে নামগুলো মিলিয়ে দেখে: tours Table এ titel নামে কোনো Column নেই।",
      line: "যে লাইনে নামটা লেখা, সেই লাইন।",
      caret: "^ একদম titel শব্দের শুরুতে। নামের Error এ ^ সাধারণত ঠিক ভুল শব্দটার উপরেই থাকে।",
      hint:
        "HINT হলো PostgreSQL এর পরামর্শ। এখানে সে কাছাকাছি বানানের একটা Column খুঁজে পেয়েছে: tours.title। HINT সবসময় আসে না, কিন্তু এলে প্রায়ই সেটাই উত্তর।",
    },
    fix: "SELECT title FROM tours;",
  },
  {
    id: "unique",
    label: "একই Email দুবার",
    statement:
      "INSERT INTO customers (full_name, email, city)\nVALUES ('Rahim Uddin', 'rahim.uddin@mail.example', 'Dhaka');",
    lines: [
      [
        { text: "ERROR:", part: "severity" },
        { text: '  duplicate key value violates unique constraint "customers_email_key"', part: "message" },
      ],
      [{ text: "DETAIL:", part: "detail" }, { text: "  Key (email)=(rahim.uddin@mail.example) already exists.", part: "detail" }],
    ],
    notes: {
      severity: "ERROR, তাই নতুন Customer লেখা হয়নি। Table আগের মতোই আছে।",
      message:
        "এবার বাক্য আর নাম দুটোই ঠিক। আপত্তি এসেছে কাজ করার সময়: Table এর একটা নিয়ম, যার নাম customers_email_key, বলে দুজন Customer এর Email এক হতে পারবে না। নিয়মের নামটা পড়লেই Table (customers) আর Column (email) বোঝা যায়।",
      detail:
        "DETAIL বলে দেয় ঠিক কোন মানের জন্য: rahim.uddin@mail.example আগে থেকেই আছে। এখানে LINE বা ^ নেই, কারণ আপনার বাক্যে কোনো ভুল ছিল না, ভুল ছিল Data তে।",
    },
    fix: "অন্য একটা Email দিন, অথবা আগে দেখে নিন এই Email এর Customer আগে থেকেই আছেন কিনা।",
  },
  {
    id: "fk",
    label: "যে Customer এর Booking আছে",
    statement: "DELETE FROM customers WHERE customer_id = 1;",
    lines: [
      [
        { text: "ERROR:", part: "severity" },
        {
          text: '  update or delete on table "customers" violates foreign key constraint "bookings_customer_id_fkey" on table "bookings"',
          part: "message",
        },
      ],
      [{ text: "DETAIL:", part: "detail" }, { text: '  Key (customer_id)=(1) is still referenced from table "bookings".', part: "detail" }],
    ],
    notes: {
      severity: "ERROR, তাই Rahim Uddin মোছা হননি। একটা Row ও বদলায়নি।",
      message:
        "লম্বা বাক্য, কিন্তু তিন টুকরো করে পড়লে সহজ: আপনি customers থেকে মুছতে চেয়েছেন, একটা Foreign Key নিয়ম (bookings_customer_id_fkey) আপত্তি করেছে, আর নিয়মটা থাকে bookings Table এ। Foreign Key কীভাবে দুটো Table কে বাঁধে, Module 01 এর Lesson 04 এ দেখেছিলেন।",
      detail:
        "DETAIL বলছে customer_id 1 এখনো bookings Table থেকে উল্লেখ করা হয়েছে। মানে তাঁর Booking আছে। তাঁকে মুছলে সেই Booking গুলো এমন একজন Customer কে দেখাত যিনি নেই।",
    },
    fix: "আগে ঠিক করুন এই Customer এর Booking গুলোর কী হবে। সাধারণত Customer মোছা হয় না, তাঁর Account বন্ধ করা হয়। Module 10 এ Soft Delete দেখবেন।",
  },
  {
    id: "verbose",
    label: "VERBOSITY verbose",
    statement: "\\set VERBOSITY verbose\nSELECT * FROM tour;",
    lines: [
      [
        { text: "ERROR:", part: "severity" },
        { text: "  42P01:", part: "sqlstate" },
        { text: ' relation "tour" does not exist', part: "message" },
      ],
      [{ text: "LINE 1:", part: "line" }, { text: " SELECT * FROM tour;" }],
      [{ text: "                      " }, { text: "^", part: "caret" }],
      [{ text: "LOCATION:", part: "location" }, { text: "  parserOpenTable, parse_relation.c:1498", part: "location" }],
    ],
    notes: {
      severity: "ERROR, একটা Statement বাতিল।",
      sqlstate:
        "42P01 হলো এই Error এর SQLSTATE কোড। প্রথম দুই অক্ষর 42 মানে বাক্য বা নামের সমস্যা, আর পুরোটা মানে undefined_table। Message এর ভাষা বদলাতে পারে, কোড কখনো বদলায় না, তাই Program এই কোড দেখে সিদ্ধান্ত নেয়।",
      message:
        "relation মানে Table (বা View)। tour নামে কোনো Table নেই, আছে tours। এক অক্ষরের তফাত।",
      line: "যে লাইনে নামটা আছে।",
      caret: "^ ঠিক tour শব্দের শুরুতে।",
      location:
        "LOCATION হলো PostgreSQL এর নিজের Source Code এর ঠিকানা: কোন Function আর কোন ফাইলের কোন লাইন Error টা তুলেছে। এটা PostgreSQL এর Developer দের জন্য। আপনার কাজে প্রায় কখনো লাগবে না, তাই সাধারণ অবস্থায় psql এটা দেখায় না।",
    },
    fix: "SELECT * FROM tours;",
  },
  {
    id: "fatal",
    label: "ভুল Database এর নাম",
    statement: "psql -U postgres -d islandtours",
    lines: [
      [
        { text: "psql: error:", part: "client" },
        { text: ' connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed:', part: "client" },
        { text: " FATAL:", part: "severity" },
        { text: '  database "islandtours" does not exist', part: "message" },
      ],
    ],
    notes: {
      client:
        "এই অংশটা psql নিজে লিখেছে: Server এর সাথে Connection টাই তৈরি হয়নি। Socket এর ঠিকানাটা আপনার মেশিনে আলাদা হবে, যেমন Homebrew তে /tmp এর ভেতরে। Network দিয়ে চেষ্টা করলে Socket এর জায়গায় Host আর Port দেখাত।",
      severity:
        "FATAL মানে ERROR এর চেয়ে বড়: পুরো Session টাই শেষ। এখানে Session শুরুই হতে পারেনি। FATAL দেখলে প্রশ্নটা SQL এর না, Connection এর: কে, কোথায়, কোন Database এ।",
      message:
        "Server ঠিকঠাক চলছে, Login ও হয়েছে, কিন্তু islandtours নামে কোনো Database নেই। আসল নাম island_tours, মাঝে একটা আন্ডারস্কোর।",
    },
    fix: "psql -U postgres -d island_tours   (কোন কোন Database আছে, দেখতে psql -l)",
  },
];

export function ErrorAnatomyLab() {
  const reduce = useReducedMotion();
  const [errorId, setErrorId] = useState(ANATOMY[0].id);
  const [part, setPart] = useState<PartKind>("message");
  const current = ANATOMY.find((e) => e.id === errorId) ?? ANATOMY[0];
  const available = Object.keys(current.notes) as PartKind[];
  const activePart = available.includes(part) ? part : "message";

  return (
    <Panel
      label="Interactive"
      title="একটা Error এর প্রতিটা অংশ"
      footer="ছয়টা Error ই PostgreSQL 18 এ হুবহু চালিয়ে পাওয়া। Error বেছে নিন, তারপর লেখার যেকোনো রঙিন অংশে চাপুন। প্রতিটা অংশ আলাদা একটা প্রশ্নের উত্তর দেয়: কী হয়েছে, কোথায়, কেন, আর কী করা যায়।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {ANATOMY.map((e) => (
          <button
            key={e.id}
            type="button"
            data-anatomy={e.id}
            aria-pressed={e.id === errorId}
            onClick={() => {
              setErrorId(e.id);
              setPart("message");
            }}
            className={cn(BTN, e.id === errorId ? BTN_ON : BTN_OFF)}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="mb-3 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">
        যা লেখা হয়েছিল
      </div>
      <pre className="mb-5 overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground/90">
        {current.statement}
      </pre>

      <div className="mb-3 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">
        PostgreSQL যা বলল
      </div>
      <div className="overflow-x-auto border border-destructive/40 bg-destructive/5 px-4 py-3" data-anatomy-output={current.id}>
        {current.lines.map((line, i) => (
          <div key={i} className="whitespace-pre font-mono text-[0.75rem] leading-relaxed">
            {line.map((seg, j) =>
              seg.part ? (
                <button
                  key={j}
                  type="button"
                  data-part={seg.part}
                  onClick={() => setPart(seg.part as PartKind)}
                  className={cn(
                    "whitespace-pre transition-colors",
                    seg.part === activePart
                      ? "bg-primary/20 text-primary outline outline-1 outline-primary/60"
                      : seg.part === "severity"
                        ? "text-destructive font-bold hover:bg-primary/10"
                        : "text-foreground/90 hover:bg-primary/10",
                  )}
                >
                  {seg.text}
                </button>
              ) : (
                <span key={j} className="text-foreground/70">
                  {seg.text}
                </span>
              ),
            )}
          </div>
        ))}
      </div>

      <motion.div
        key={`${current.id}-${activePart}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="mt-5 border border-primary/40 bg-primary/5 p-4"
        data-active-part={activePart}
      >
        <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary mb-2">
          {PART_NAMES[activePart]}
        </div>
        <p className="text-sm leading-relaxed text-foreground">{current.notes[activePart]}</p>
      </motion.div>

      <div className="mt-4 flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">
          সমাধান
        </span>
        <code className="font-mono text-[0.75rem] text-foreground break-words">{current.fix}</code>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Error দেখে বলুন কে কথা বলছে                                             */
/* ------------------------------------------------------------------------- */

type Source = "shell" | "network" | "login" | "sql" | "data" | "transaction";

const SOURCES: { id: Source; label: string }[] = [
  { id: "shell", label: "Shell" },
  { id: "network", label: "Network" },
  { id: "login", label: "Login" },
  { id: "sql", label: "আপনার SQL বাক্য বা নাম" },
  { id: "data", label: "Data বা Table এর নিয়ম" },
  { id: "transaction", label: "Transaction এর অবস্থা" },
];

type TriageCase = {
  id: string;
  message: string;
  answer: Source;
  code?: string;
  why: string;
  fix: string;
};

const CASES: TriageCase[] = [
  {
    id: "not-found",
    message: "zsh: command not found: psql",
    answer: "shell",
    why: "লাইনটা শুরু হয়েছে zsh দিয়ে, PostgreSQL দিয়ে না। আপনার Shell psql নামের Program টাই খুঁজে পায়নি। PostgreSQL পর্যন্ত কিছুই পৌঁছায়নি।",
    fix: "PostgreSQL এর bin Folder PATH এ যোগ করুন। Homebrew তে postgresql@18 keg-only, তাই PATH এর লাইনটা লাগে। এই Module এর Lesson 01 এ প্রতিটা Operating System এর ধাপ আছে।",
  },
  {
    id: "refused",
    message:
      'psql: error: connection to server at "127.0.0.1", port 5499 failed: Connection refused\n\tIs the server running on that host and accepting TCP/IP connections?',
    answer: "network",
    why: "psql চালু হয়েছে, কিন্তু 127.0.0.1 এর 5499 নম্বর Port এ কেউ দরজা খোলেনি। Server বন্ধ, অথবা সে অন্য Port এ শুনছে। FATAL লেখা নেই, কারণ PostgreSQL এর সাথে কথাই হয়নি।",
    fix: "pg_isready দিয়ে দেখুন Server চালু কিনা, আর Port টা মিলিয়ে নিন। এই কোর্সে Default 5432, আগে থেকে কিছু থাকলে 5433।",
  },
  {
    id: "password",
    message:
      'psql: error: connection to server at "127.0.0.1", port 15407 failed: FATAL:  password authentication failed for user "postgres"',
    answer: "login",
    code: "28P01",
    why: "এবার দরজা খুলেছে, আর FATAL এসেছে PostgreSQL এর কাছ থেকে: Password মেলেনি। Network ঠিক আছে, Server চালু আছে, সমস্যা পরিচয়ে।",
    fix: "Password আবার দেখুন। এই কোর্সে Password থাকে POSTGRES_PASSWORD Environment Variable এ, তাই সেটা ঠিকমতো Export হয়েছে কিনা দেখুন। Client এর কাছে শুধু এই ছোট বাক্যটা আসে, আর কোন নিয়মে আটকেছেন তার বিস্তারিত থাকে Server এর Log এ।",
  },
  {
    id: "role",
    message:
      'psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  role "riya" does not exist',
    answer: "login",
    code: "28000",
    why: "PostgreSQL এ riya নামে কোনো User (Role) নেই। -U না দিলে psql আপনার Operating System এর User এর নাম পাঠায়, তাই প্রথমবার এই Error খুব চেনা।",
    fix: "যে Role আছে সেটা দিয়ে ঢুকুন (psql -U postgres), অথবা নিজের নামে একটা Role বানিয়ে নিন। Lesson 01 এ Linux এর ধাপে এটা দেখানো আছে।",
  },
  {
    id: "trailing-comma",
    message: 'ERROR:  syntax error at or near "FROM"\nLINE 2: FROM tours;\n        ^',
    answer: "sql",
    code: "42601",
    why: "ERROR, আর সাথে LINE আর ^। মানে Connection ঠিক আছে, আপনার বাক্যটাই ভাঙা। আগের লাইনের শেষে একটা বাড়তি কমা ছিল, তাই PostgreSQL আরেকটা Column আশা করছিল, পেল FROM।",
    fix: "^ এর ঠিক আগের লাইনটা দেখুন: SELECT title, এর শেষের কমাটা মুছে দিন।",
  },
  {
    id: "relation",
    message: 'ERROR:  relation "tour" does not exist\nLINE 1: SELECT * FROM tour;\n                      ^',
    answer: "sql",
    code: "42P01",
    why: "বাক্যের গঠন ঠিক, কিন্তু নামটা মেলেনি। এই Database এ (আর এখনকার search_path এ) tour নামে কোনো Table নেই।",
    fix: "\\dt দিয়ে Table এর তালিকা দেখুন। নাম ঠিক থাকলেও এই Error এলে, হয় আপনি ভুল Database এ আছেন, নয়তো Table টা অন্য Schema তে। Lesson 05 দেখুন।",
  },
  {
    id: "unique",
    message:
      'ERROR:  duplicate key value violates unique constraint "customers_email_key"\nDETAIL:  Key (email)=(rahim.uddin@mail.example) already exists.',
    answer: "data",
    code: "23505",
    why: "LINE বা ^ নেই, কারণ বাক্যে ভুল নেই। ভুল Data তে: এই Email আগে থেকেই আছে, আর Table এর নিয়ম দুটো এক Email মানে না।",
    fix: "SQL বদলানোর দরকার নেই, মান বদলান। App এ এই কোড দেখে Customer কে বলা হয়: এই Email দিয়ে আগেই Account খোলা আছে।",
  },
  {
    id: "invalid-input",
    message:
      'ERROR:  invalid input syntax for type integer: "abc"\nLINE 1: SELECT * FROM tours WHERE tour_id = \'abc\';\n                                            ^',
    answer: "data",
    code: "22P02",
    why: "tour_id একটা সংখ্যার Column, আর আপনি দিয়েছেন abc। বাক্যের গঠন ঠিক, নামও ঠিক, কিন্তু মানটা এই Column এর ধরনে ঢোকে না। 22 পরিবার মানেই মানের সমস্যা।",
    fix: "সংখ্যার জায়গায় সংখ্যা দিন। App থেকে এই Error এলে প্রায়ই দেখা যায় Form এর একটা খালি বা ভুল ঘর সরাসরি Query তে চলে গেছে।",
  },
  {
    id: "aborted",
    message: "ERROR:  current transaction is aborted, commands ignored until end of transaction block",
    answer: "transaction",
    code: "25P02",
    why: "এই বাক্যে নিজে কোনো ভুল নেই। আগে BEGIN দিয়ে একটা Transaction খুলেছিলেন, তার ভেতরে একটা Statement ভেঙেছে, আর তারপর থেকে PostgreSQL সব নতুন Statement ফিরিয়ে দিচ্ছে।",
    fix: "ROLLBACK লিখুন। তারপর ভাঙা Statement টা ঠিক করে আবার শুরু করুন। psql এর Prompt এ =!# দেখলেই বুঝবেন এই অবস্থায় আছেন।",
  },
];

export function ErrorTriageLab() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Source | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const current = CASES[index];
  const correct = picked === current.answer;

  const choose = (source: Source) => {
    if (picked) return;
    setPicked(source);
    if (source === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index === CASES.length - 1) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <Panel
      label="Interactive"
      title="Error দেখে বলুন, কে কথা বলছে"
      footer="প্রতিটা Error হুবহু একটা আসল Terminal থেকে নেওয়া। প্রথম প্রশ্ন সবসময় একটাই: আপত্তিটা কে করছে? উত্তর ঠিক হলে সমাধান কোথায় খুঁজবেন সেটাও ঠিক হয়ে যায়।"
    >
      {done ? (
        <div className="text-center py-6" data-triage-done>
          <p className="text-lg font-bold mb-2">
            {toBn(CASES.length)}টার মধ্যে {toBn(score)}টা ঠিক
          </p>
          <p className="text-sm text-muted-foreground mb-5">
            {score === CASES.length
              ? "চমৎকার। আপনি এখন যেকোনো লাল লেখার প্রথম লাইন দেখেই বলতে পারবেন সমস্যাটা কোন ধাপের।"
              : "যেগুলো মেলেনি, আরেকবার দেখুন। মূল সূত্র: শুরুর শব্দ (zsh, psql: error, FATAL, ERROR) আর LINE বা DETAIL আছে কিনা।"}
          </p>
          <button type="button" onClick={restart} className={cn(BTN, BTN_OFF, "inline-flex items-center gap-1.5")}>
            <RotateCcw className="w-3.5 h-3.5" />
            আবার শুরু
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 mb-4 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">
            <span data-triage-index={index}>
              Error {toBn(index + 1)} / {toBn(CASES.length)}
            </span>
            <span>ঠিক: {toBn(score)}</span>
          </div>

          <pre className="mb-5 overflow-x-auto border border-destructive/40 bg-destructive/5 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground/90 whitespace-pre">
            {current.message}
          </pre>

          <div className="flex flex-wrap gap-2 mb-5">
            {SOURCES.map((source) => {
              const isAnswer = picked && source.id === current.answer;
              const isWrongPick = picked === source.id && !correct;
              return (
                <button
                  key={source.id}
                  type="button"
                  data-source={source.id}
                  disabled={picked !== null}
                  onClick={() => choose(source.id)}
                  className={cn(
                    BTN,
                    isAnswer
                      ? "border-primary bg-primary/15 text-primary"
                      : isWrongPick
                        ? "border-destructive/60 bg-destructive/10 text-destructive"
                        : BTN_OFF,
                    picked !== null && !isAnswer && !isWrongPick && "opacity-50",
                  )}
                >
                  {source.label}
                </button>
              );
            })}
          </div>

          {picked && (
            <motion.div
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="space-y-3"
              data-triage-verdict={correct ? "right" : "wrong"}
            >
              <p className={cn("text-sm font-bold", correct ? "text-primary" : "text-destructive")}>
                {correct ? "ঠিক ধরেছেন।" : "এবার মেলেনি।"}
                {current.code && (
                  <span className="ml-2 font-mono text-[0.6875rem] font-normal text-muted-foreground">
                    SQLSTATE {current.code}
                  </span>
                )}
              </p>
              <p className="text-sm leading-relaxed text-foreground">{current.why}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-bold text-foreground">কী করবেন: </span>
                {current.fix}
              </p>
              <button type="button" onClick={next} data-triage-next className={cn(BTN, BTN_ON)}>
                {index === CASES.length - 1 ? "ফলাফল দেখুন" : "পরের Error"}
              </button>
            </motion.div>
          )}
        </>
      )}
    </Panel>
  );
}
