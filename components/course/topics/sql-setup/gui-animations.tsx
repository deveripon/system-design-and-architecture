"use client";

import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
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

const BTN = "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors";
const BTN_ON = "border-primary bg-primary/10 text-primary";
const BTN_OFF =
  "border-border text-muted-foreground hover:text-foreground hover:border-primary/40";

/* ------------------------------------------------------------------------- */
/* 1. ফর্ম পূরণ করুন, Connection String নিজে তৈরি হতে দেখুন                     */
/* ------------------------------------------------------------------------- */

type SslMode = "disable" | "prefer" | "require";
type Env = "local" | "development" | "production";

const ENVS: { id: Env; label: string; tone: string }[] = [
  { id: "local", label: "Local", tone: "border-border text-muted-foreground" },
  { id: "development", label: "Development", tone: "border-amber-500/60 text-amber-600 dark:text-amber-400" },
  { id: "production", label: "Production", tone: "border-destructive/70 text-destructive" },
];

/** A made-up password with the three characters that break a URI, for the demo button only. */
const DEMO_PASSWORD = "sea@view#7";

/** Characters that have a meaning inside a URI and so must be percent-encoded in a password. */
const URI_SPECIAL = /[@:/?#&%=+\s]/;

const READ_ONLY_OPTION = "options=-c%20default_transaction_read_only%3Don";

interface Warning {
  id: string;
  tone: "warn" | "info";
  text: string;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2 mb-1">
        <span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        {hint && <span className="text-[0.6875rem] text-muted-foreground/80">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const INPUT =
  "w-full border border-border bg-background px-3 py-2 font-mono text-[0.8125rem] text-foreground outline-none focus:border-primary/60";

export function ConnectionFormLab() {
  const reduce = useReducedMotion();
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("5432");
  const [database, setDatabase] = useState("island_tours");
  const [user, setUser] = useState("postgres");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ssl, setSsl] = useState<SslMode>("prefer");
  const [readOnly, setReadOnly] = useState(false);
  const [env, setEnv] = useState<Env>("local");
  const [guiInContainer, setGuiInContainer] = useState(false);

  const portNumber = Number(port);
  const portValid = /^\d+$/.test(port) && portNumber >= 1 && portNumber <= 65535;
  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(host.trim());

  const params = [`sslmode=${ssl}`, ...(readOnly ? [READ_ONLY_OPTION] : [])].join("&");
  const base = `${encodeURIComponent(user.trim())}@${host.trim()}:${port.trim()}/${encodeURIComponent(database.trim())}`;
  const shareable = `postgresql://${base}?${params}`;
  const encodedPassword = encodeURIComponent(password);
  const withPassword = password
    ? `postgresql://${encodeURIComponent(user.trim())}:${showPassword ? encodedPassword : "•".repeat(Math.min(encodedPassword.length, 12))}@${host.trim()}:${port.trim()}/${encodeURIComponent(database.trim())}?${params}`
    : null;
  const psqlCommand = `PGPASSWORD="$POSTGRES_PASSWORD" psql "${shareable}"`;

  const warnings: Warning[] = [];
  if (!host.trim()) {
    warnings.push({ id: "host", tone: "warn", text: "Host খালি। কোন মেশিনে Server চলছে সেটা না জানলে GUI কোথায় যাবে?" });
  }
  if (!portValid) {
    warnings.push({ id: "port", tone: "warn", text: "Port হতে হবে ১ থেকে ৬৫৫৩৫ এর মধ্যে একটা সংখ্যা। PostgreSQL এর নিজের Port 5432।" });
  }
  if (!database.trim()) {
    warnings.push({
      id: "db",
      tone: "info",
      text: `Database খালি রাখলে psql ধরে নেয় আপনি Username এর নামেই একটা Database চান, মানে "${user.trim() || "username"}"। সেটা না থাকলে Error আসবে: database does not exist। GUI তে খালি রাখলে কী হয় সেটা App ভেদে আলাদা, তাই নামটা সবসময় লিখে দিন।`,
    });
  }
  if (password && URI_SPECIAL.test(password)) {
    warnings.push({
      id: "encode",
      tone: "info",
      text: `Password এ এমন চিহ্ন আছে যার URI তে নিজস্ব মানে আছে। String এর ভেতরে বসাতে হলে সেগুলো Percent-encode করতে হয়, যেমন @ হয়ে যায় %40 আর # হয়ে যায় %23। না করলে psql বা GUI Host এর নাম ভুল পড়ে।`,
    });
  }
  if (ssl === "require" && isLocalHost) {
    warnings.push({
      id: "ssl",
      tone: "warn",
      text: "নিজের মেশিনের PostgreSQL এ সাধারণত SSL চালু থাকে না। require দিলে Connect হবে না, Error আসবে: server does not support SSL, but SSL was required।",
    });
  }
  if (ssl === "disable" && !isLocalHost) {
    warnings.push({
      id: "ssl-off",
      tone: "warn",
      text: "অন্য মেশিনের Server এ SSL বন্ধ রাখলে Password আর Data খোলা অবস্থায় Network দিয়ে যাবে। দূরের Server এ অন্তত require দিন।",
    });
  }
  if (guiInContainer && isLocalHost) {
    warnings.push({
      id: "container",
      tone: "warn",
      text: "GUI নিজেই একটা Container এর ভেতরে চললে localhost মানে সেই Container, আপনার মেশিন না। Docker Desktop এ মেশিনটাকে ডাকতে হয় host.docker.internal নামে।",
    });
  }
  if (env === "production" && !readOnly) {
    warnings.push({
      id: "prod",
      tone: "warn",
      text: "Production এর Connection কিন্তু Read only না। Grid এ একটা ভুল ক্লিক সত্যিকারের Customer এর Data বদলে দিতে পারে। শুধু দেখার কাজে Read only চালু রাখুন।",
    });
  }
  if (env === "production" && user.trim() === "postgres") {
    warnings.push({
      id: "superuser",
      tone: "warn",
      text: "Production এ postgres মানে Superuser, যে সব পারে। দেখার কাজে আলাদা, কম ক্ষমতার একটা User দিয়ে Connect করুন। Module 16 এ এটা হাতে কলমে করবেন।",
    });
  }

  const envTone = ENVS.find((e) => e.id === env)!;

  return (
    <Panel
      label="Interactive"
      title="ফর্ম পূরণ করুন, Connection String নিজে তৈরি হতে দেখুন"
      footer="এটা একটা অনুশীলনের ফর্ম, কোথাও Connect করে না, আর কিছু Save ও করে না। Demo Password টা বানানো, কোনো আসল Server এর না। নিজের আসল Password এখানে লিখবেন না, অন্য কোথাও লেখার অভ্যাসও করবেন না।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-lab="connection-form">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {ENVS.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setEnv(e.id)}
                data-env={e.id}
                aria-pressed={env === e.id}
                className={cn(BTN, env === e.id ? cn(e.tone, "bg-muted/40") : BTN_OFF)}
              >
                {e.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_7rem] gap-3">
            <Field label="Host">
              <input className={INPUT} value={host} onChange={(e) => setHost(e.target.value)} spellCheck={false} data-field="host" />
            </Field>
            <Field label="Port">
              <input className={INPUT} value={port} onChange={(e) => setPort(e.target.value)} inputMode="numeric" data-field="port" />
            </Field>
          </div>
          <Field label="Database" hint="pgAdmin এ নাম Maintenance database">
            <input className={INPUT} value={database} onChange={(e) => setDatabase(e.target.value)} spellCheck={false} data-field="database" />
          </Field>
          <Field label="Username">
            <input className={INPUT} value={user} onChange={(e) => setUser(e.target.value)} spellCheck={false} data-field="user" />
          </Field>
          <Field label="Password" hint="অনুশীলনের জন্য বানানো একটা দিন">
            <div className="flex gap-2">
              <input
                className={INPUT}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                data-field="password"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className={cn(BTN, BTN_OFF, "shrink-0")} data-action="toggle-password">
                {showPassword ? "লুকান" : "দেখান"}
              </button>
            </div>
          </Field>
          <button
            type="button"
            onClick={() => {
              setPassword(DEMO_PASSWORD);
              setShowPassword(true);
            }}
            className={cn(BTN, BTN_OFF)}
            data-action="demo-password"
          >
            Demo Password বসান: {DEMO_PASSWORD}
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground mr-1">
              SSL mode
            </span>
            {(["disable", "prefer", "require"] as SslMode[]).map((m) => (
              <button key={m} type="button" onClick={() => setSsl(m)} data-ssl={m} aria-pressed={ssl === m} className={cn(BTN, ssl === m ? BTN_ON : BTN_OFF)}>
                {m}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setReadOnly((v) => !v)} aria-pressed={readOnly} data-action="read-only" className={cn(BTN, readOnly ? BTN_ON : BTN_OFF)}>
              Read only {readOnly ? "চালু" : "বন্ধ"}
            </button>
            <button
              type="button"
              onClick={() => setGuiInContainer((v) => !v)}
              aria-pressed={guiInContainer}
              data-action="gui-in-container"
              className={cn(BTN, guiInContainer ? BTN_ON : BTN_OFF)}
            >
              GUI নিজেই Docker এ {guiInContainer ? "চলছে" : "চলছে না"}
            </button>
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          <div className={cn("border-l-4 pl-3 py-1 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.12em]", envTone.tone)} data-env-banner={env}>
            {envTone.label} Connection
          </div>
          <div>
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1">
              শেয়ার করা নিরাপদ (Password ছাড়া)
            </p>
            <pre className="overflow-x-auto border border-border bg-background px-3 py-2 font-mono text-[0.75rem] text-foreground whitespace-pre-wrap break-all" data-output="shareable">
              {shareable}
            </pre>
          </div>
          {withPassword && (
            <div>
              <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1">
                Password সহ, যেভাবে URI তে বসে
              </p>
              <pre className="overflow-x-auto border border-border bg-background px-3 py-2 font-mono text-[0.75rem] text-foreground whitespace-pre-wrap break-all" data-output="with-password">
                {withPassword}
              </pre>
            </div>
          )}
          <div>
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1">
              একই Connection, psql দিয়ে
            </p>
            <pre className="overflow-x-auto border border-border bg-background px-3 py-2 font-mono text-[0.75rem] text-foreground whitespace-pre-wrap break-all" data-output="psql">
              {psqlCommand}
            </pre>
          </div>
          <div className="space-y-2" data-warnings={warnings.map((w) => w.id).join(" ")}>
            {warnings.length === 0 ? (
              <p className="text-[0.8125rem] text-muted-foreground">
                কোনো সমস্যা চোখে পড়ছে না। এই মানগুলো দিয়েই আপনার GUI তে Connect করার চেষ্টা করুন।
              </p>
            ) : (
              warnings.map((w) => (
                <motion.p
                  key={w.id}
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className={cn(
                    "border px-3 py-2 text-[0.8125rem] leading-relaxed",
                    w.tone === "warn" ? "border-destructive/40 bg-destructive/5 text-foreground" : "border-primary/40 bg-primary/5 text-foreground",
                  )}
                >
                  {w.text}
                </motion.p>
              ))
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন কাজে কোন জানালা                                                    */
/* ------------------------------------------------------------------------- */

type ToolPick = "psql" | "gui" | "either";

interface Task {
  id: string;
  task: string;
  pick: ToolPick;
  why: string;
}

const TASKS: Task[] = [
  {
    id: "explore",
    task: "অচেনা একটা Database প্রথমবার ঘুরে দেখা",
    pick: "gui",
    why: "Object Tree খুললেই সব Table, প্রতিটার Column আর Row চোখের সামনে। ER View এ কোন Table কোনটাকে দেখায় সেটাও এক ছবিতে। psql এ একই জিনিস \\dt আর \\d দিয়ে একটা একটা করে দেখতে হয়।",
  },
  {
    id: "script",
    task: "একই SQL ফাইল তিনটা Server এ চালানো",
    pick: "psql",
    why: "psql -f ফাইলের নাম দিলেই চলে, আর একটা ছোট Script এ তিনবার লিখে দেওয়া যায়। GUI তে প্রতিটা Server এ গিয়ে হাতে ফাইল খুলে চালাতে হয়, ভুলের সুযোগও বাড়ে।",
  },
  {
    id: "relations",
    task: "কোন Table কোন Table এর সাথে জোড়া, সেটা বোঝা",
    pick: "gui",
    why: "pgAdmin এর ERD Tool বা DBeaver এর Diagram ট্যাব Foreign Key গুলোকে দাগ হিসেবে এঁকে দেয়। আট Table এর সম্পর্ক এক নজরে।",
  },
  {
    id: "csv",
    task: "হিসাব বিভাগের জন্য একটা Report CSV তে দেওয়া",
    pick: "either",
    why: "GUI তে Query চালিয়ে Result Grid থেকে Export, কয়েক ক্লিক। psql এ \\copy দিয়ে এক লাইনে, আর প্রতি মাসে একই কাজ হলে সেটা Script এ রেখে দেওয়া যায়। একবারের কাজে GUI আরামের, বারবারের কাজে psql।",
  },
  {
    id: "ssh",
    task: "SSH দিয়ে ঢোকা একটা Server এ, যেখানে কোনো Desktop নেই",
    pick: "psql",
    why: "ওই Server এ জানালা খোলার উপায়ই নেই, আছে শুধু Terminal। এই কারণেই GUI ভালো লাগলেও psql জানা বাধ্যতামূলক।",
  },
  {
    id: "plan",
    task: "একটা ধীর Query এর Execution Plan ছবির মতো করে দেখা",
    pick: "gui",
    why: "pgAdmin এর Query Tool Plan টা Text, ছবি আর Table, তিনভাবেই দেখাতে পারে। শুরুর দিকে ছবিটা বোঝা সহজ। Plan পড়া শিখবেন Module 13 এ।",
  },
  {
    id: "share",
    task: "টিমের Chat এ ঠিক কোন Command চালিয়েছেন সেটা জানানো",
    pick: "psql",
    why: "psql এর Command হুবহু Copy করে পাঠানো যায়, অন্যজন একই জিনিস চালাতে পারেন। কোন মেনুতে কোথায় ক্লিক করেছেন, সেটা লিখে বোঝানো কঠিন, আর মেনু এক Version থেকে আরেক Version এ বদলায়।",
  },
  {
    id: "fix-one",
    task: "একজন Customer এর ফোন নম্বরের একটা ভুল ঠিক করা",
    pick: "either",
    why: "GUI এর Grid এ ঘরে ক্লিক করে বদলানো যায়, আবার psql এ UPDATE লিখেও। যেভাবেই করুন, আগে ঠিক Row টা SELECT করে দেখে নিন, আর জানুন Auto commit চালু কিনা। Production এ হাতে বদলানোর আগে দুইবার ভাবুন।",
  },
];

const PICK_LABEL: Record<ToolPick, string> = {
  psql: "psql ভালো",
  gui: "GUI ভালো",
  either: "দুটোই চলে",
};

export function TaskToolLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(TASKS[0].id);
  const [guesses, setGuesses] = useState<Record<string, ToolPick>>({});
  const current = TASKS.find((t) => t.id === active) ?? TASKS[0];
  const guess = guesses[current.id];
  const answered = Object.keys(guesses).length;
  const correct = TASKS.filter((t) => guesses[t.id] === t.pick).length;

  return (
    <Panel
      label="Interactive"
      title="কোন কাজে psql, কোন কাজে GUI"
      footer="উত্তরগুলো কোনো আইন না, একজন অভিজ্ঞ Developer সাধারণত যা বেছে নেন। বেশিরভাগ মানুষ দুটোই খোলা রাখেন, কাজ অনুযায়ী একটা থেকে আরেকটায় যান।"
    >
      <div data-lab="task-tool">
        <div className="flex flex-wrap gap-2 mb-6">
          {TASKS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              data-task={t.id}
              aria-pressed={t.id === active}
              className={cn(
                BTN,
                t.id === active ? BTN_ON : BTN_OFF,
                guesses[t.id] && t.id !== active && (guesses[t.id] === t.pick ? "border-primary/40" : "border-destructive/40"),
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>

        <motion.div
          key={current.id}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          data-active={current.id}
        >
          <p className="text-base font-bold text-foreground mb-4">{current.task}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {(["psql", "gui", "either"] as ToolPick[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setGuesses((prev) => ({ ...prev, [current.id]: p }))}
                data-pick={p}
                aria-pressed={guess === p}
                className={cn(
                  BTN,
                  guess === p ? (p === current.pick ? BTN_ON : "border-destructive bg-destructive/10 text-destructive") : BTN_OFF,
                )}
              >
                {PICK_LABEL[p]}
              </button>
            ))}
          </div>
          {guess && (
            <div
              className={cn(
                "border p-4",
                guess === current.pick ? "border-primary/50 bg-primary/5" : "border-destructive/40 bg-destructive/5",
              )}
              data-verdict={guess === current.pick ? "right" : "wrong"}
            >
              <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] mb-2 text-foreground">
                {guess === current.pick ? "ঠিক ধরেছেন" : `বেশিরভাগ সময়: ${PICK_LABEL[current.pick]}`}
              </p>
              <p className="text-[0.8125rem] leading-relaxed text-foreground">{current.why}</p>
            </div>
          )}
        </motion.div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <span className="font-mono text-[0.6875rem] text-muted-foreground" data-score={`${correct}/${answered}`}>
            {answered} টার মধ্যে {correct} টা মিলেছে, মোট {TASKS.length} টা কাজ
          </span>
          <button type="button" onClick={() => setGuesses({})} className={cn(BTN, BTN_OFF)} data-action="reset">
            আবার শুরু
          </button>
        </div>
      </div>
    </Panel>
  );
}
