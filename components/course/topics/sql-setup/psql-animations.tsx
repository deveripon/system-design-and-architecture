"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, RotateCcw } from "lucide-react";
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

/** A terminal window. Every transcript in this file was captured from psql 18. */
function Terminal({ text, label }: { text: string; label?: string }) {
  return (
    <div className="border border-border bg-background">
      {label && (
        <div className="px-3 py-1.5 border-b border-border font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground/90 whitespace-pre">
        {text}
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Prompt কীভাবে বদলায়                                                    */
/* ------------------------------------------------------------------------- */

type PromptStep = {
  /** What appears on screen after this line is entered. */
  screen: string;
  /** Has anything been sent to the server yet? */
  sent: boolean;
  note: string;
};

type PromptScenario = {
  id: string;
  label: string;
  steps: PromptStep[];
  lesson: string;
};

const PROMPT_SCENARIOS: PromptScenario[] = [
  {
    id: "complete",
    label: "কয়েক লাইনের Query",
    lesson:
      "Enter চাপা মানে পাঠানো না। psql লেখাগুলো জমিয়ে রাখে, আর Semicolon পেলে তবেই পুরোটা একসাথে Server এ পাঠায়। তাই লম্বা Query ইচ্ছামতো ভেঙে কয়েক লাইনে লেখা যায়।",
    steps: [
      {
        screen: String.raw`island_tours=# SELECT title`,
        sent: false,
        note: "প্রথম লাইন লিখে Enter চাপলেন। Semicolon নেই, তাই psql কিছুই পাঠায়নি।",
      },
      {
        screen: String.raw`island_tours=# SELECT title
island_tours-# FROM tours`,
        sent: false,
        note: "Prompt এ = এর জায়গায় এখন -। মানে psql বলছে: আগের Statement এর বাকি অংশ লিখছেন, আমি অপেক্ষা করছি।",
      },
      {
        screen: String.raw`island_tours=# SELECT title
island_tours-# FROM tours
island_tours-# WHERE price_bdt < 9000`,
        sent: false,
        note: "এখনো পাঠানো হয়নি। তিন লাইনই psql এর হাতে জমা আছে, যাকে Docs বলে Query Buffer।",
      },
      {
        screen: String.raw`island_tours=# SELECT title
island_tours-# FROM tours
island_tours-# WHERE price_bdt < 9000
island_tours-# ;
           title
---------------------------
 Cox's Bazar Beach Weekend
 Sylhet Tea Garden Tour
 Ratargul Swamp Boat Day
(3 rows)

island_tours=# `,
        sent: true,
        note: "শুধু একটা Semicolon দিলেন, আর জমে থাকা পুরো Query টা একবারে Server এ গেল। উত্তর এল, Prompt আবার = হয়ে নতুন Statement চাইছে।",
      },
    ],
  },
  {
    id: "forgot",
    label: "Semicolon ভুলে গেলে",
    lesson:
      "Semicolon ভুলে নতুন Query লেখা শুরু করলে দুটো জোড়া লেগে একটা অদ্ভুত Statement হয়ে যায়, আর Error আসে দ্বিতীয় লাইনের দিকে আঙুল তুলে। Prompt এ - দেখলেই থামুন: আগের Statement এখনো খোলা।",
    steps: [
      {
        screen: String.raw`island_tours=# SELECT count(*) FROM tours`,
        sent: false,
        note: "পুরো Query লিখলেন, কিন্তু শেষে Semicolon দিতে ভুলে গেলেন। Enter চাপার পরে কিছুই ঘটল না।",
      },
      {
        screen: String.raw`island_tours=# SELECT count(*) FROM tours
island_tours-# SELECT (1 +`,
        sent: false,
        note: "উত্তর না পেয়ে ভাবলেন কিছু হয়নি, তাই নতুন Query লেখা শুরু করলেন। কিন্তু psql এর কাছে এটা আগের Statement এরই পরের লাইন।",
      },
      {
        screen: String.raw`island_tours=# SELECT count(*) FROM tours
island_tours-# SELECT (1 +
island_tours(# 2);
ERROR:  syntax error at or near "SELECT"
LINE 2: SELECT (1 +
        ^
island_tours=# `,
        sent: true,
        note: "Bracket খোলা থাকায় Prompt হয়েছিল (। তারপর Semicolon পেয়ে psql দুই Query জোড়া লাগিয়ে পাঠাল। Server বলল দ্বিতীয় লাইনের SELECT এর কাছে ভুল, কারণ একটা Statement এর মাঝখানে আরেকটা SELECT বসে না।",
      },
    ],
  },
  {
    id: "quote",
    label: "Quote খোলা থাকলে",
    lesson:
      "Prompt এ ' দেখা মানে একটা লেখা শুরু হয়েছে কিন্তু শেষের Quote আসেনি। psql তখন Enter কেও লেখার অংশ ধরে নেয়। এমন হলে বেশিরভাগ সময় সবচেয়ে সহজ রাস্তা Ctrl+C চেপে নতুন করে লেখা।",
    steps: [
      {
        screen: String.raw`island_tours=# SELECT 'Cox`,
        sent: false,
        note: "একটা লেখা Quote দিয়ে শুরু করলেন, কিন্তু শেষের Quote দেওয়ার আগে Enter চেপে ফেললেন।",
      },
      {
        screen: String.raw`island_tours=# SELECT 'Cox
island_tours'# ';`,
        sent: false,
        note: "Prompt এ এখন '। psql জানাচ্ছে: আপনি একটা লেখার ভেতরে আছেন। এই লাইনে Quote বন্ধ করে Semicolon দিলেন।",
      },
      {
        screen: String.raw`island_tours=# SELECT 'Cox
island_tours'# ';
 ?column?
----------
 Cox     +

(1 row)

island_tours=# `,
        sent: true,
        note: "Query চলল, কিন্তু উত্তরে Cox এর পরে একটা + চিহ্ন। মানে লেখার ভেতরে একটা নতুন লাইন ঢুকে গেছে, কারণ মাঝের Enter টাও লেখার অংশ হয়ে গিয়েছিল।",
      },
    ],
  },
  {
    id: "cancel",
    label: "Ctrl+C দিয়ে বাতিল",
    lesson:
      "Ctrl+C জমে থাকা অর্ধেক লেখা Query টা ফেলে দেয়, psql বন্ধ করে না। Session থেকে বের হতে লাগে \\q। আর কোনো Query চলতে চলতে অনেক সময় নিলে, সেটাকেও Ctrl+C দিয়ে থামানো যায়।",
    steps: [
      {
        screen: String.raw`island_tours=# SELECT count(*)
island_tours-# FROM tours`,
        sent: false,
        note: "দুই লাইন লিখে বুঝলেন ভুল Table এ প্রশ্ন করছেন। এখনো Semicolon দেননি, তাই কিছু পাঠানো হয়নি।",
      },
      {
        screen: String.raw`island_tours=# SELECT count(*)
island_tours-# FROM tours
island_tours-# ^C
island_tours=# `,
        sent: false,
        note: "Ctrl+C চাপলেন। জমে থাকা দুই লাইন মুছে গেল, Prompt আবার = হয়ে গেল। কিছুই Server এ যায়নি।",
      },
      {
        screen: String.raw`island_tours=# SELECT count(*)
island_tours-# FROM tours
island_tours-# ^C
island_tours=# SELECT 1;
 ?column?
----------
        1
(1 row)

island_tours=# \q`,
        sent: true,
        note: "নতুন Query পরিষ্কারভাবে চলল। শেষে \\q লিখে Session থেকে বের হলেন। Ctrl+C বের করে না, \\q করে।",
      },
    ],
  },
];

export function PromptLab() {
  const reduce = useReducedMotion();
  const [scenarioId, setScenarioId] = useState(PROMPT_SCENARIOS[0].id);
  const [step, setStep] = useState(0);
  const scenario =
    PROMPT_SCENARIOS.find((s) => s.id === scenarioId) ?? PROMPT_SCENARIOS[0];
  const current = scenario.steps[step];
  const last = step === scenario.steps.length - 1;

  return (
    <Panel
      label="Interactive"
      title="Prompt কীভাবে বদলায়"
      footer="প্রতিটা Terminal লেখা PostgreSQL 18 এর psql থেকে হুবহু নেওয়া। একটা পরিস্থিতি বেছে নিন, তারপর পরের লাইন চাপতে থাকুন আর Prompt এর শেষের চিহ্নটা লক্ষ করুন।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {PROMPT_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            data-scenario={s.id}
            onClick={() => {
              setScenarioId(s.id);
              setStep(0);
            }}
            className={cn(BTN, s.id === scenarioId ? BTN_ON : BTN_OFF)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <motion.div
        key={`${scenario.id}-${step}`}
        initial={reduce ? false : { opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        <Terminal text={current.screen} label={`psql · ধাপ ${toBn(step + 1)} / ${toBn(scenario.steps.length)}`} />
      </motion.div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-start">
        <p className="text-sm leading-relaxed text-foreground">{current.note}</p>
        <span
          data-sent={current.sent ? "yes" : "no"}
          className={cn(
            "px-2.5 py-1 border font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] whitespace-nowrap",
            current.sent
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground",
          )}
        >
          {current.sent ? "Server এ গেছে" : "এখনো psql এর হাতে"}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          data-action="next"
          disabled={last}
          onClick={() => setStep((s) => Math.min(s + 1, scenario.steps.length - 1))}
          className={cn(BTN, "inline-flex items-center gap-1.5", last ? "border-border text-muted-foreground/50" : BTN_ON)}
        >
          পরের লাইন <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          data-action="reset"
          onClick={() => setStep(0)}
          className={cn(BTN, BTN_OFF, "inline-flex items-center gap-1.5")}
        >
          <RotateCcw className="w-3.5 h-3.5" /> শুরু থেকে
        </button>
      </div>

      {last && (
        <div className="mt-5 border border-primary/40 bg-primary/5 p-4 text-sm leading-relaxed">
          {scenario.lesson}
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Meta-command গুলো ঘুরে দেখা                                              */
/* ------------------------------------------------------------------------- */

type Meta = {
  cmd: string;
  answers: string;
  output: string;
  read: string;
  mysql: string;
};

const METAS: Meta[] = [
  {
    cmd: String.raw`\l`,
    answers: "এই Server এ কোন কোন Database আছে?",
    output: String.raw`                                                      List of databases
     Name     |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | Locale | ICU Rules |   Access privileges
--------------+----------+----------+-----------------+------------+------------+--------+-----------+-----------------------
 island_tours | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           |
 postgres     | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           |
 template0    | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           | =c/postgres          +
              |          |          |                 |            |            |        |           | postgres=CTc/postgres
 template1    | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           | =c/postgres          +
              |          |          |                 |            |            |        |           | postgres=CTc/postgres
(4 rows)`,
    read: "চারটা Database। island_tours আপনার বানানো, postgres আসে ইনস্টলের সাথেই, আর template0, template1 হলো নতুন Database বানানোর ছাঁচ (Lesson 05)। লম্বা শেষ Column এর + মানে লেখাটা পরের লাইনে চলে গেছে।",
    mysql: "SHOW DATABASES;",
  },
  {
    cmd: String.raw`\dt`,
    answers: "এই Database এ কোন কোন Table আছে?",
    output: String.raw`              List of tables
 Schema |     Name     | Type  |  Owner
--------+--------------+-------+----------
 public | bookings     | table | postgres
 public | customers    | table | postgres
 public | departures   | table | postgres
 public | destinations | table | postgres
 public | guides       | table | postgres
 public | payments     | table | postgres
 public | reviews      | table | postgres
 public | tours        | table | postgres
(8 rows)`,
    read: "Island Tours এর আটটা Table, সবগুলো public Schema তে। Schema কী, সেটা Lesson 05 এ। Database বদলালে এই তালিকাও বদলে যায়।",
    mysql: "SHOW TABLES;",
  },
  {
    cmd: String.raw`\d tours`,
    answers: "tours Table টা দেখতে কেমন, কোন Column, কোন নিয়ম?",
    output: String.raw`                                      Table "public.tours"
     Column     |           Type           | Collation | Nullable |           Default
----------------+--------------------------+-----------+----------+------------------------------
 tour_id        | integer                  |           | not null | generated always as identity
 title          | text                     |           | not null |
 destination_id | integer                  |           | not null |
 guide_id       | integer                  |           |          |
 duration_days  | smallint                 |           | not null |
 price_bdt      | numeric(10,2)            |           | not null |
 max_seats      | smallint                 |           | not null |
 is_active      | boolean                  |           | not null | true
 created_at     | timestamp with time zone |           | not null | now()
Indexes:
    "tours_pkey" PRIMARY KEY, btree (tour_id)
Check constraints:
    "tours_duration_days_check" CHECK (duration_days > 0)
    "tours_max_seats_check" CHECK (max_seats > 0)
    "tours_price_bdt_check" CHECK (price_bdt >= 0::numeric)
Foreign-key constraints:
    "tours_destination_id_fkey" FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
    "tours_guide_id_fkey" FOREIGN KEY (guide_id) REFERENCES guides(guide_id)
Referenced by:
    TABLE "departures" CONSTRAINT "departures_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES tours(tour_id)`,
    read: "একটা Table এর পুরো পরিচয়পত্র। উপরে Column আর Type, Nullable এ not null মানে খালি রাখা যাবে না। নিচে Primary Key, তিনটা Check নিয়ম, দুটো Foreign Key, আর শেষে কে এই Table কে দেখায়: departures। Module 01 এর Lesson 04 এর সব শব্দ এক পাতায়।",
    mysql: "DESCRIBE tours;",
  },
  {
    cmd: String.raw`\dn`,
    answers: "কোন কোন Schema আছে?",
    output: String.raw`      List of schemas
  Name  |       Owner
--------+-------------------
 public | pg_database_owner
(1 row)`,
    read: "আপাতত একটাই, public। একটা Database এর ভেতরে Table গুলোকে ভাগ করে রাখার ফোল্ডার হলো Schema। পুরো গল্প Lesson 05 এ।",
    mysql: "MySQL এ Schema আর Database একই জিনিস, তাই আলাদা Command নেই।",
  },
  {
    cmd: String.raw`\du`,
    answers: "কোন কোন User বা Role আছে, কার কী ক্ষমতা?",
    output: String.raw`                             List of roles
 Role name |                         Attributes
-----------+------------------------------------------------------------
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS`,
    read: "এখন একজনই, postgres, আর সে Superuser: সব পারে। রোজকার কাজে এত ক্ষমতা নিয়ে ঘোরা বিপজ্জনক, তাই Module 16 এ কম ক্ষমতার আলাদা User বানানো শিখবেন।",
    mysql: "SELECT user, host FROM mysql.user;",
  },
  {
    cmd: String.raw`\df`,
    answers: "নিজের বানানো কোনো Function আছে?",
    output: String.raw`                       List of functions
 Schema | Name | Result data type | Argument data types | Type
--------+------+------------------+---------------------+------
(0 rows)`,
    read: "শূন্য Row। এখনো কেউ কোনো Function বানায়নি। খালি তালিকাও একটা উত্তর: Function নেই। Module 14 এ এখানে নাম আসবে।",
    mysql: "SHOW FUNCTION STATUS WHERE Db = 'island_tours';",
  },
  {
    cmd: String.raw`\dv`,
    answers: "কোনো View আছে?",
    output: String.raw`Did not find any views.`,
    read: "View নেই, তাই psql সোজা ভাষায় বলে দিল। Table এর মতো দেখতে কিন্তু আসলে নাম দেওয়া Query, এটাই View, আসবে Module 14 এ।",
    mysql: "SHOW FULL TABLES WHERE Table_type = 'VIEW';",
  },
  {
    cmd: String.raw`\conninfo`,
    answers: "আমি এখন ঠিক কোথায়, কে হয়ে Connect আছি?",
    output: String.raw`           Connection Information
      Parameter       |        Value
----------------------+---------------------
 Database             | island_tours
 Client User          | postgres
 Socket Directory     | /var/run/postgresql
 Server Port          | 5432
 Options              |
 Protocol Version     | 3.0
 Password Used        | false
 GSSAPI Authenticated | false
 Backend PID          | 181
 SSL Connection       | false
 Superuser            | on
 Hot Standby          | off
(12 rows)`,
    read: "কোন Database, কোন User, Socket দিয়ে না TCP দিয়ে, কোন Port। psql 18 এটা Table করে দেখায়। পুরনো psql একই তথ্য এক লাইনে বলে: You are connected to database ... as user ...। Production এ কাজের আগে এক নজর দেখে নেওয়ার মতো Command।",
    mysql: "status",
  },
];

export function MetaCommandLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(METAS[0].cmd);
  const meta = METAS.find((m) => m.cmd === active) ?? METAS[0];

  return (
    <Panel
      label="Interactive"
      title="চারপাশ দেখার Meta-command"
      footer="প্রতিটা Output Island Tours Database Load করা PostgreSQL 18 এর psql থেকে হুবহু নেওয়া। আপনার মেশিনে Owner বা Collate একটু আলাদা দেখালে অবাক হবেন না, ওগুলো ইনস্টলের ধরন অনুযায়ী বদলায়।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {METAS.map((m) => (
          <button
            key={m.cmd}
            type="button"
            data-meta={m.cmd}
            onClick={() => setActive(m.cmd)}
            className={cn(BTN, "font-mono", m.cmd === active ? BTN_ON : BTN_OFF)}
          >
            {m.cmd}
          </button>
        ))}
      </div>

      <motion.div
        key={meta.cmd}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="space-y-4"
      >
        <p className="text-sm font-bold text-foreground">
          <span className="font-mono text-primary mr-2">{meta.cmd}</span>
          {meta.answers}
        </p>
        <Terminal text={`island_tours=# ${meta.cmd}\n${meta.output}`} />
        <p className="text-sm leading-relaxed text-foreground">{meta.read}</p>
        <div className="flex flex-wrap items-baseline gap-2 border-t border-border pt-3">
          <span className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            MySQL এ কাছাকাছি
          </span>
          <code className="font-mono text-[0.75rem] text-foreground">{meta.mysql}</code>
        </div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Script এ Error হলে থামবে কি না                                            */
/* ------------------------------------------------------------------------- */

const SCRIPT = String.raw`-- fix_prices.sql
UPDATE tours SET price_bdt = price_bdt + 500 WHERE tour_id = 1;
UPDATE tours SET price_bdt = price_bdt + 500 WHERE tour_idd = 2;
UPDATE tours SET price_bdt = price_bdt + 500 WHERE tour_id = 3;`;

const RUNS = {
  off: {
    command: String.raw`$ psql -U postgres -d island_tours -f fix_prices.sql
UPDATE 1
psql:fix_prices.sql:2: ERROR:  column "tour_idd" does not exist
LINE 1: ...PDATE tours SET price_bdt = price_bdt + 500 WHERE tour_idd =...
                                                             ^
HINT:  Perhaps you meant to reference the column "tours.tour_id".
UPDATE 1
$ echo $?
0`,
    rows: [
      { id: 1, before: "12500.00", after: "13000.00", changed: true },
      { id: 2, before: "8500.00", after: "8500.00", changed: false },
      { id: 3, before: "18000.00", after: "18500.00", changed: true },
    ],
    exit: "0",
    verdict:
      "Error এর পরেও psql থামেনি, তৃতীয় লাইনও চলেছে। তিনটার মধ্যে দুটো ট্যুরের দাম বেড়েছে, একটার বাড়েনি, আর Exit Code 0, মানে বাইরে থেকে দেখলে সব ঠিকঠাক। অর্ধেক কাজ হয়ে থাকা অবস্থাটাই সবচেয়ে বিপজ্জনক।",
  },
  on: {
    command: String.raw`$ psql -U postgres -d island_tours -v ON_ERROR_STOP=1 -f fix_prices.sql
UPDATE 1
psql:fix_prices.sql:2: ERROR:  column "tour_idd" does not exist
LINE 1: ...PDATE tours SET price_bdt = price_bdt + 500 WHERE tour_idd =...
                                                             ^
HINT:  Perhaps you meant to reference the column "tours.tour_id".
$ echo $?
3`,
    rows: [
      { id: 1, before: "12500.00", after: "13000.00", changed: true },
      { id: 2, before: "8500.00", after: "8500.00", changed: false },
      { id: 3, before: "18000.00", after: "18000.00", changed: false },
    ],
    exit: "3",
    verdict:
      "প্রথম Error এই psql থেমে গেল, তৃতীয় লাইন আর চলেনি, আর Exit Code 3। কোনো Deploy Script বা Automation এই 3 দেখে বুঝবে কিছু ভুল হয়েছে আর পরের ধাপে যাবে না। তবে লক্ষ করুন, প্রথম লাইনের পরিবর্তন রয়ে গেছে। পুরোটা হয় সব নয় কিছুই করতে Transaction লাগে, সেটা Module 12 এ।",
  },
} as const;

export function ScriptStopLab() {
  const [mode, setMode] = useState<"off" | "on">("off");
  const run = RUNS[mode];

  return (
    <Panel
      label="Interactive"
      title="Script এর মাঝখানে Error হলে"
      footer="দুটো Run ই PostgreSQL 18 এর psql এ সত্যিই চালানো, দ্বিতীয় লাইনে ইচ্ছা করে ভুল Column নাম (tour_idd) রাখা। Exit Code এর মানে psql এর অফিসিয়াল Docs থেকে: 0 সব ঠিক, 1 psql এর নিজের সমস্যা, 2 Connection ভেঙেছে, 3 ON_ERROR_STOP চালু অবস্থায় Script এ Error।"
    >
      <Terminal text={SCRIPT} label="fix_prices.sql" />

      <div className="flex flex-wrap gap-2 my-6">
        <button
          type="button"
          data-mode="off"
          onClick={() => setMode("off")}
          className={cn(BTN, mode === "off" ? BTN_ON : BTN_OFF)}
        >
          ON_ERROR_STOP ছাড়া
        </button>
        <button
          type="button"
          data-mode="on"
          onClick={() => setMode("on")}
          className={cn(BTN, mode === "on" ? BTN_ON : BTN_OFF)}
        >
          ON_ERROR_STOP=1 সহ
        </button>
      </div>

      <Terminal text={run.command} label="Terminal" />

      <div className="mt-5 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5">
        <div className="overflow-x-auto border border-border">
          <table className="w-full font-mono text-[0.75rem]">
            <thead>
              <tr className="bg-muted/40">
                <th className="px-3 py-2 text-left">tour_id</th>
                <th className="px-3 py-2 text-left">আগে</th>
                <th className="px-3 py-2 text-left">পরে</th>
              </tr>
            </thead>
            <tbody>
              {run.rows.map((row) => (
                <tr key={row.id} className="border-t border-border/60" data-changed={row.changed ? "yes" : "no"}>
                  <td className="px-3 py-1.5">{row.id}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">{row.before}</td>
                  <td className={cn("px-3 py-1.5", row.changed && "text-primary font-bold")}>{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
            Exit Code <span className="text-primary text-[0.875rem] ml-1" data-exit={run.exit}>{run.exit}</span>
          </p>
          <p className="text-sm leading-relaxed text-foreground">{run.verdict}</p>
        </div>
      </div>
    </Panel>
  );
}
