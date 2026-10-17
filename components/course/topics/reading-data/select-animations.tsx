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
/* 1. Column বাছাই করে SELECT বানানো                                           */
/* ------------------------------------------------------------------------- */

/** The real tours table of the sample database, as PostgreSQL prints it. */
const TOUR_COLUMNS = [
  "tour_id",
  "title",
  "destination_id",
  "guide_id",
  "duration_days",
  "price_bdt",
  "max_seats",
  "is_active",
  "created_at",
] as const;

type TourColumn = (typeof TOUR_COLUMNS)[number];

const TOURS: Record<TourColumn, string | null>[] = [
  { tour_id: "1", title: "Saint Martin Island Escape", destination_id: "1", guide_id: "1", duration_days: "3", price_bdt: "12500.00", max_seats: "20", is_active: "t", created_at: "2025-10-01 10:00:00+06" },
  { tour_id: "2", title: "Cox's Bazar Beach Weekend", destination_id: "2", guide_id: "2", duration_days: "2", price_bdt: "8500.00", max_seats: "30", is_active: "t", created_at: "2025-10-01 10:00:00+06" },
  { tour_id: "3", title: "Sundarbans Mangrove Cruise", destination_id: "3", guide_id: "3", duration_days: "3", price_bdt: "18000.00", max_seats: "16", is_active: "t", created_at: "2025-10-05 10:00:00+06" },
  { tour_id: "4", title: "Sajek Valley Cloud Trip", destination_id: "4", guide_id: "1", duration_days: "2", price_bdt: "9500.00", max_seats: "18", is_active: "t", created_at: "2025-10-12 10:00:00+06" },
  { tour_id: "5", title: "Bandarban Hill Trek", destination_id: "5", guide_id: "4", duration_days: "4", price_bdt: "14000.00", max_seats: "12", is_active: "t", created_at: "2025-11-01 10:00:00+06" },
  { tour_id: "6", title: "Sylhet Tea Garden Tour", destination_id: "6", guide_id: "2", duration_days: "2", price_bdt: "7800.00", max_seats: "25", is_active: "t", created_at: "2025-11-20 10:00:00+06" },
  { tour_id: "7", title: "Ratargul Swamp Boat Day", destination_id: "6", guide_id: null, duration_days: "1", price_bdt: "3500.00", max_seats: "15", is_active: "t", created_at: "2026-08-15 10:00:00+06" },
  { tour_id: "8", title: "Saint Martin Luxury Stay", destination_id: "1", guide_id: "4", duration_days: "4", price_bdt: "32000.00", max_seats: "10", is_active: "f", created_at: "2026-09-01 10:00:00+06" },
  { tour_id: "9", title: "Cox's Bazar Family Package", destination_id: "2", guide_id: "3", duration_days: "3", price_bdt: "15500.00", max_seats: "24", is_active: "t", created_at: "2026-10-01 10:00:00+06" },
];

export function ColumnPickerLab() {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<TourColumn[]>(["title", "price_bdt"]);
  const [star, setStar] = useState(false);

  const columns: readonly TourColumn[] = star ? TOUR_COLUMNS : picked;
  const sql = star
    ? "SELECT *\nFROM tours;"
    : picked.length
      ? `SELECT ${picked.join(", ")}\nFROM tours;`
      : "SELECT\nFROM tours;";

  const toggle = (col: TourColumn) => {
    setStar(false);
    setPicked((prev) => (prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]));
  };

  return (
    <Panel
      label="Interactive"
      title="Column বাছুন, SELECT নিজে নিজে লেখা হবে"
      footer={
        <>
          নিচের Data হুবহু Sample Database এর tours Table। যে ক্রমে Column এ চাপ দেবেন,
          ফলাফলে Column সেই ক্রমেই আসবে, Table এ কোন ক্রমে আছে তাতে কিছু যায় আসে না। *
          চাপলে সব Column আসে, Table এর নিজের ক্রমে। একটাও Column না বাছলে PostgreSQL
          নয়টা খালি Row ফেরত দেয়, কারণ Row তো নয়টাই, শুধু দেখানোর মতো কোনো Column নেই।
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {TOUR_COLUMNS.map((col) => {
          const position = picked.indexOf(col);
          const on = star || position >= 0;
          return (
            <button
              key={col}
              type="button"
              data-column={col}
              aria-pressed={on}
              onClick={() => toggle(col)}
              className={cn(BTN, "font-mono", on ? BTN_ON : BTN_OFF)}
            >
              {!star && position >= 0 && (
                <span className="mr-1.5 text-[0.5625rem] opacity-70">{toBn(position + 1)}</span>
              )}
              {col}
            </button>
          );
        })}
        <button
          type="button"
          data-column="*"
          aria-pressed={star}
          onClick={() => setStar((s) => !s)}
          className={cn(BTN, "font-mono", star ? BTN_ON : BTN_OFF)}
        >
          * (সব)
        </button>
        <button
          type="button"
          onClick={() => {
            setStar(false);
            setPicked([]);
          }}
          className={cn(BTN, BTN_OFF)}
        >
          সব মুছুন
        </button>
      </div>

      <pre className="mb-5 border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-foreground overflow-x-auto">
        {sql}
      </pre>

      <motion.div
        key={columns.join(",") || "none"}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="overflow-x-auto border border-border"
        data-result-columns={columns.length}
      >
        <table className="w-full border-collapse font-mono text-[0.75rem]">
          {columns.length > 0 && (
            <thead>
              <tr className="bg-muted/40">
                {columns.map((col) => (
                  <th key={col} className="border-b border-border px-3 py-2 text-left font-bold whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {TOURS.map((row) => (
              <tr key={row.tour_id} className="border-b border-border/60 last:border-b-0">
                {columns.length === 0 ? (
                  <td className="px-3 py-1.5 text-muted-foreground/60">&nbsp;</td>
                ) : (
                  columns.map((col) => (
                    <td
                      key={col}
                      className={cn(
                        "px-3 py-1.5 whitespace-nowrap",
                        row[col] === null ? "italic text-muted-foreground/60" : "text-foreground/90",
                      )}
                    >
                      {row[col] ?? "NULL"}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-border bg-muted/20 px-3 py-1.5 font-mono text-[0.625rem] text-muted-foreground">
          (9 rows), {toBn(columns.length)}টা Column
        </p>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Alias দিলে Column এর নাম কী হয়                                           */
/* ------------------------------------------------------------------------- */

const EXPRESSIONS = [
  { id: "title", sql: "title", plain: true, names: ["tour", "Tour Name", "TourName"] },
  { id: "price", sql: "price_bdt * 2", plain: false, names: ["couple_price", "Couple Price", "CouplePrice"] },
  { id: "hours", sql: "duration_days * 24", plain: false, names: ["hours", "Total Hours", "TotalHours"] },
] as const;

const ALIAS_STYLES = [
  { id: "none", label: "Alias নেই" },
  { id: "snake", label: "AS ছোট_হাতে" },
  { id: "double", label: 'AS "দুই শব্দ"' },
  { id: "camel", label: "AS BadaHate" },
  { id: "single", label: "AS 'Single Quote'" },
] as const;

type StyleId = (typeof ALIAS_STYLES)[number]["id"];

/** What each database prints as the column header. Every case here was run on PostgreSQL 18 and MySQL 8.4. */
function headers(expr: (typeof EXPRESSIONS)[number], style: StyleId) {
  const [snake, spaced, camel] = expr.names;
  switch (style) {
    case "none":
      return {
        sql: `SELECT ${expr.sql} FROM tours;`,
        pg: expr.plain ? expr.sql : "?column?",
        mysql: expr.sql,
        note: expr.plain
          ? "শুধু একটা Column লিখলে দুই Database ই সেই Column এর নামটাই রাখে।"
          : "হিসাবের Column এর নাম না দিলে PostgreSQL নাম দেয় ?column?, আর MySQL পুরো Expression টাকেই নাম বানায়। দুটোই পড়তে বা Code থেকে ধরতে ঝামেলার।",
      };
    case "snake":
      return {
        sql: `SELECT ${expr.sql} AS ${snake} FROM tours;`,
        pg: snake,
        mysql: snake,
        note: "ছোট হাতের অক্ষর আর Underscore: দুই Database এ হুবহু এক, Quote লাগে না। এই ট্র্যাকে এটাই নিয়ম।",
      };
    case "double":
      return {
        sql: `SELECT ${expr.sql} AS "${spaced}" FROM tours;`,
        pg: spaced,
        mysql: spaced,
        note: "Space বা বড় হাতের অক্ষর রাখতে চাইলে Double Quote। PostgreSQL এ এটা নাম, MySQL এ এটা আসলে একটা লেখা, তবু Alias হিসেবে চলে। Report এ মানুষের পড়ার নামের জন্য ভালো।",
      };
    case "camel":
      return {
        sql: `SELECT ${expr.sql} AS ${camel} FROM tours;`,
        pg: camel.toLowerCase(),
        mysql: camel,
        note: "Quote ছাড়া নাম PostgreSQL ছোট হাতের অক্ষরে বদলে নেয়, তাই আসে " +
          camel.toLowerCase() +
          "। MySQL যেমন লিখেছেন তেমন রাখে। App এর Code এ নাম ধরে খুঁজলে এই তফাতেই Bug হয়।",
      };
    case "single":
      return {
        sql: `SELECT ${expr.sql} AS '${spaced}' FROM tours;`,
        pg: null,
        mysql: spaced,
        note: "PostgreSQL এ Single Quote মানে লেখা (Text), নাম না। তাই Syntax Error। MySQL এটা মেনে নেয়, এই জন্যই MySQL এর ভিডিও থেকে আসা Query PostgreSQL এ এখানে ভাঙে।",
      };
  }
}

export function AliasLab() {
  const [exprId, setExprId] = useState<(typeof EXPRESSIONS)[number]["id"]>("price");
  const [style, setStyle] = useState<StyleId>("none");
  const expr = EXPRESSIONS.find((e) => e.id === exprId) ?? EXPRESSIONS[1];
  const out = headers(expr, style);

  return (
    <Panel
      label="Interactive"
      title="Alias দিলে Column এর মাথায় কী লেখা আসে"
      footer={
        <>
          প্রতিটা ঘর PostgreSQL 18 আর MySQL 8.4 এ সত্যি চালিয়ে দেখা। Column এর নাম
          (Header) শুধু ফলাফলের জন্য, Table এর আসল Column এর নাম বদলায় না।
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-2 mb-6">
        <div>
          <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            কী দেখাতে চান
          </p>
          <div className="flex flex-wrap gap-2">
            {EXPRESSIONS.map((e) => (
              <button
                key={e.id}
                type="button"
                data-expression={e.id}
                aria-pressed={e.id === exprId}
                onClick={() => setExprId(e.id)}
                className={cn(BTN, "font-mono", e.id === exprId ? BTN_ON : BTN_OFF)}
              >
                {e.sql}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            নাম দেওয়ার ধরন
          </p>
          <div className="flex flex-wrap gap-2">
            {ALIAS_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                data-style={s.id}
                aria-pressed={s.id === style}
                onClick={() => setStyle(s.id)}
                className={cn(BTN, s.id === style ? BTN_ON : BTN_OFF)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <pre className="mb-5 border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] text-foreground overflow-x-auto">
        {out.sql}
      </pre>

      <div className="grid gap-4 md:grid-cols-2" data-pg-header={out.pg ?? "error"}>
        <div className={cn("border p-4", out.pg === null ? "border-destructive/40 bg-destructive/5" : "border-primary/50 bg-primary/5")}>
          <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary">PostgreSQL</p>
          {out.pg === null ? (
            <p className="font-mono text-[0.75rem] text-destructive">
              ERROR: syntax error at or near &quot;&apos;{expr.names[1]}&apos;&quot;
            </p>
          ) : (
            <p className="font-mono text-sm">
              Column এর নাম: <strong className="text-foreground">{out.pg}</strong>
            </p>
          )}
        </div>
        <div className="border border-border bg-background p-4">
          <p className="mb-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">MySQL 8.4</p>
          <p className="font-mono text-sm">
            Column এর নাম: <strong className="text-foreground">{out.mysql}</strong>
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{out.note}</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. ভুলটা খুঁজুন                                                             */
/* ------------------------------------------------------------------------- */

const BUGS = [
  {
    id: "comma",
    sql: "SELECT title price_bdt FROM tours;",
    pg: "কোনো Error নেই! ফলাফলে একটাই Column, নাম price_bdt, আর তার ভেতরে ট্যুরের নাম। নয়টা Row।",
    silent: true,
    why: "কমা না থাকায় PostgreSQL ভেবেছে price_bdt হলো title এর Alias, কারণ AS লেখা ঐচ্ছিক। সবচেয়ে বিপজ্জনক ভুল, কারণ কিছুই ভাঙে না।",
    fix: "SELECT title, price_bdt FROM tours;",
    mysql: "MySQL এও একই কাণ্ড: Error ছাড়া একটা Column, নাম price_bdt।",
  },
  {
    id: "trailing",
    sql: "SELECT title, FROM tours;",
    pg: 'ERROR:  syntax error at or near "FROM"',
    silent: false,
    why: "শেষ Column এর পরে বাড়তি কমা। PostgreSQL কমার পরে আরেকটা Column আশা করছিল, পেল FROM।",
    fix: "SELECT title FROM tours;",
    mysql: "ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'FROM tours'",
  },
  {
    id: "typo",
    sql: "SELECT titel FROM tours;",
    pg: 'ERROR:  column "titel" does not exist\nHINT:  Perhaps you meant to reference the column "tours.title".',
    silent: false,
    why: "বানান ভুল। PostgreSQL কাছাকাছি নামটাও বলে দিচ্ছে HINT এ।",
    fix: "SELECT title FROM tours;",
    mysql: "ERROR 1054 (42S22): Unknown column 'titel' in 'field list'",
  },
  {
    id: "table",
    sql: "SELECT title FROM tour;",
    pg: 'ERROR:  relation "tour" does not exist',
    silent: false,
    why: "Table এর নাম tours, শেষে s সহ। PostgreSQL এর ভাষায় Relation মানে Table (বা View)।",
    fix: "SELECT title FROM tours;",
    mysql: "ERROR 1146 (42S02): Table 'island_tours.tour' doesn't exist",
  },
  {
    id: "single",
    sql: "SELECT title AS 'Tour Name' FROM tours;",
    pg: "ERROR:  syntax error at or near \"'Tour Name'\"",
    silent: false,
    why: "PostgreSQL এ Single Quote শুধু লেখার (Text) জন্য। নামের জন্য Double Quote।",
    fix: 'SELECT title AS "Tour Name" FROM tours;',
    mysql: "MySQL এ চলে, Column এর নাম আসে Tour Name। তাই MySQL থেকে আসা Query তে এটা খুব দেখা যায়।",
  },
  {
    id: "double",
    sql: 'SELECT "Title" FROM tours;',
    pg: 'ERROR:  column "Title" does not exist\nHINT:  Perhaps you meant to reference the column "tours.title".',
    silent: false,
    why: "Double Quote দিলে PostgreSQL বড় হাতের T সহ হুবহু Title খোঁজে। Column এর আসল নাম ছোট হাতের title।",
    fix: "SELECT title FROM tours;",
    mysql: 'MySQL এ আরও অদ্ভুত: "Title" একটা লেখা, তাই নয়টা Row তেই শুধু Title শব্দটা আসে, কোনো Error ছাড়া।',
  },
  {
    id: "alias",
    sql: "SELECT t.title, tours.price_bdt FROM tours AS t;",
    pg: 'ERROR:  invalid reference to FROM-clause entry for table "tours"\nHINT:  Perhaps you meant to reference the table alias "t".',
    silent: false,
    why: "Table কে t ডাকনাম দেওয়ার পর সেই Query তে আসল নাম tours আর চলে না।",
    fix: "SELECT t.title, t.price_bdt FROM tours AS t;",
    mysql: "ERROR 1054 (42S22): Unknown column 'tours.price_bdt' in 'field list'",
  },
] as const;

export function SpotTheBugLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<(typeof BUGS)[number]["id"]>("comma");
  const [revealed, setRevealed] = useState<string[]>([]);
  const bug = BUGS.find((b) => b.id === active) ?? BUGS[0];
  const shown = revealed.includes(bug.id);

  return (
    <Panel
      label="Interactive"
      title="ভুলটা কোথায়? আগে নিজে ভাবুন, তারপর দেখুন"
      footer={
        <>
          সাতটা Query, সবগুলোর Output PostgreSQL 18 আর MySQL 8.4 এ চালিয়ে নেওয়া।
          প্রথমটাই সবচেয়ে বিপজ্জনক, কারণ সেটা কোনো Error দেখায় না। বাকিগুলো Error দেয়,
          আর Error দেওয়া ভুল আসলে ভালো ভুল: সাথে সাথে চোখে পড়ে।
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {BUGS.map((b, i) => (
          <button
            key={b.id}
            type="button"
            data-bug={b.id}
            aria-pressed={b.id === active}
            onClick={() => setActive(b.id)}
            className={cn(BTN, b.id === active ? BTN_ON : BTN_OFF)}
          >
            Query {toBn(i + 1)}
            {revealed.includes(b.id) && " ✓"}
          </button>
        ))}
      </div>

      <pre className="mb-4 border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] text-foreground overflow-x-auto">
        {bug.sql}
      </pre>

      {!shown ? (
        <button
          type="button"
          data-reveal={bug.id}
          onClick={() => setRevealed((r) => [...r, bug.id])}
          className={cn(BTN, BTN_OFF)}
        >
          PostgreSQL কী বলবে, দেখান
        </button>
      ) : (
        <motion.div
          key={bug.id}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="space-y-3"
          data-revealed={bug.id}
        >
          <pre
            className={cn(
              "border px-4 py-3 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap",
              bug.silent ? "border-primary/50 bg-primary/5 text-foreground" : "border-destructive/40 bg-destructive/5 text-destructive",
            )}
          >
            {bug.pg}
          </pre>
          <p className="text-sm leading-relaxed text-foreground">{bug.why}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            ঠিক করা Query: <code className="font-mono text-foreground">{bug.fix}</code>
          </p>
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
            <span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em]">MySQL: </span>
            {bug.mysql}
          </p>
        </motion.div>
      )}
    </Panel>
  );
}
