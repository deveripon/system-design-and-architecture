/**
 * What: The interactive labs for Module 07 Lesson 07, System Logs. JournalFilterLab lets the
 * reader stack journalctl filters on twelve real journal lines and watch which ones survive.
 * PriorityPrefixLab shows why an app's error is invisible to `-p err` until it says how serious
 * it is. CrashReadLab hands the reader the tail of a real crash loop and asks which line holds
 * the reason.
 *
 * Why: Filters only make sense when the reader sees a line disappear and asks why. Every line
 * here, with its unit and its PRIORITY, was read from the practice server with `-o json`, so
 * what the lab keeps or drops is what journalctl really does. All state is driven by clicks and
 * derived during render, never set from an effect.
 */
"use client";

import { cn, toBn } from "@/lib/utils";
import { Check, X } from "lucide-react";
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

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "px-3 py-1.5 border font-mono text-[0.6875rem] font-bold transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}

function ChipRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-24 shrink-0 text-xs font-bold text-muted-foreground">{title}</span>
      {children}
    </div>
  );
}

const PRIORITY_NAMES: Record<number, string> = {
  0: "emerg",
  1: "alert",
  2: "crit",
  3: "err",
  4: "warning",
  5: "notice",
  6: "info",
  7: "debug",
};

function PriorityBadge({ priority }: { priority: number }) {
  return (
    <span
      className={cn(
        "inline-block w-16 shrink-0 text-center border px-1 py-0.5 font-mono text-[0.625rem] font-bold",
        priority <= 3
          ? "border-primary bg-primary/10 text-primary"
          : priority <= 5
            ? "border-foreground/40 text-foreground"
            : "border-border text-muted-foreground",
      )}
    >
      {`${priority} ${PRIORITY_NAMES[priority]}`}
    </span>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Filter জুড়ে জুড়ে দেখুন কোন লাইন টিকে থাকে                                 */
/* ------------------------------------------------------------------------- */

type Source = "all" | "my-tours-api" | "caddy" | "ssh" | "kernel";
type PriorityFilter = "all" | "warning" | "err";
type SinceFilter = "all" | "07:26" | "07:27";
type GrepFilter = "none" | "error" | "req-9K1P";

type Entry = {
  time: string;
  unit: Exclude<Source, "all"> | "cron" | "memory-hog";
  who: string;
  priority: number;
  message: string;
  /** A line that explains a failure, so the lab can warn when a filter hides it. */
  cause?: boolean;
};

// প্রতিটা লাইন Practice Server এর Journal থেকে, Priority সহ, -o json দিয়ে পড়া।
const ENTRIES: Entry[] = [
  { time: "07:24:55", unit: "caddy", who: "caddy[413]", priority: 6, message: '{"level":"info","msg":"serving initial configuration"}' },
  { time: "07:25:01", unit: "cron", who: "CRON[431]", priority: 6, message: "(root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)" },
  { time: "07:25:31", unit: "my-tours-api", who: "node[502]", priority: 6, message: "Error: DATABASE_URL is not set", cause: true },
  { time: "07:25:31", unit: "my-tours-api", who: "systemd[1]", priority: 5, message: "my-tours-api.service: Main process exited, code=exited, status=1/FAILURE" },
  { time: "07:25:38", unit: "my-tours-api", who: "systemd[1]", priority: 4, message: "my-tours-api.service: Start request repeated too quickly." },
  { time: "07:25:38", unit: "my-tours-api", who: "systemd[1]", priority: 3, message: "Failed to start my-tours-api.service - my-tours API." },
  { time: "07:26:04", unit: "my-tours-api", who: "node[592]", priority: 3, message: '{"level":"error","msg":"booking failed","requestId":"req-9K1P"}' },
  { time: "07:26:23", unit: "caddy", who: "caddy[413]", priority: 6, message: '{"level":"warn","msg":"server is listening only on the HTTP port"}' },
  { time: "07:26:38", unit: "kernel", who: "kernel", priority: 3, message: "Memory cgroup out of memory: Killed process 641337 (node)" },
  { time: "07:26:38", unit: "memory-hog", who: "systemd[1]", priority: 4, message: "memory-hog.service: Failed with result 'oom-kill'." },
  { time: "07:27:22", unit: "ssh", who: "sshd[784]", priority: 6, message: "Invalid user admin from 127.0.0.1 port 53976" },
  { time: "07:30:01", unit: "caddy", who: "caddy[413]", priority: 6, message: '{"level":"error","msg":"dial tcp 127.0.0.1:3000: connect: connection refused","status":502}', cause: true },
];

const SOURCE_FLAGS: Record<Source, string> = {
  all: "",
  "my-tours-api": "-u my-tours-api",
  caddy: "-u caddy",
  ssh: "-u ssh",
  kernel: "-k",
};

const PRIORITY_FLAGS: Record<PriorityFilter, string> = { all: "", warning: "-p warning", err: "-p err" };
const PRIORITY_LIMIT: Record<PriorityFilter, number> = { all: 7, warning: 4, err: 3 };
const SINCE_FLAGS: Record<SinceFilter, string> = { all: "", "07:26": '--since "07:26"', "07:27": '--since "07:27"' };
const GREP_FLAGS: Record<GrepFilter, string> = { none: "", error: '--grep "error"', "req-9K1P": '--grep "req-9K1P"' };

function matchesSource(e: Entry, source: Source) {
  return source === "all" || e.unit === source;
}

function matchesSince(e: Entry, since: SinceFilter) {
  return since === "all" || e.time >= `${since}:00`;
}

// journalctl এর --grep: ছোট হাতের খোঁজা হলে বড় ছোট মানে না।
function matchesGrep(e: Entry, grep: GrepFilter) {
  if (grep === "none") return true;
  if (grep === "error") return e.message.toLowerCase().includes("error");
  return e.message.includes(grep);
}

export function JournalFilterLab() {
  const [source, setSource] = useState<Source>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [since, setSince] = useState<SinceFilter>("all");
  const [grep, setGrep] = useState<GrepFilter>("none");

  const limit = PRIORITY_LIMIT[priority];
  const shown = ENTRIES.filter(
    (e) => matchesSource(e, source) && matchesSince(e, since) && matchesGrep(e, grep) && e.priority <= limit,
  );
  // যে লাইনগুলো আসল কারণ, অথচ শুধু Priority Filter এর জন্য বাদ পড়ল
  const hiddenCauses = ENTRIES.filter(
    (e) => e.cause && matchesSource(e, source) && matchesSince(e, since) && matchesGrep(e, grep) && e.priority > limit,
  );

  const command = ["journalctl", SOURCE_FLAGS[source], SINCE_FLAGS[since], PRIORITY_FLAGS[priority], GREP_FLAGS[grep]]
    .filter(Boolean)
    .join(" ");

  return (
    <Panel
      label="LAB"
      title="journalctl Filter জোড়া লাগানো"
      footer={
        <>
          বারোটা লাইনই Practice Server এর Journal থেকে নেওয়া, প্রতিটার Priority সহ। আলাদা
          ধরনের Filter একসাথে দিলে সবগুলো শর্ত মানতে হয়, তাই প্রতিটা নতুন Filter তালিকা
          ছোট করে। <code>-u caddy</code> আর <code>-p err</code> একসাথে বেছে দেখুন, Caddy
          এর 502 লাইনটা কোথায় গেল।
        </>
      }
    >
      <div className="space-y-3">
        <ChipRow title="কার লাইন">
          {(Object.keys(SOURCE_FLAGS) as Source[]).map((s) => (
            <Chip key={s} active={source === s} onClick={() => setSource(s)}>
              {s === "all" ? "সবার" : SOURCE_FLAGS[s]}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow title="কখন থেকে">
          {(Object.keys(SINCE_FLAGS) as SinceFilter[]).map((s) => (
            <Chip key={s} active={since === s} onClick={() => setSince(s)}>
              {s === "all" ? "শুরু থেকে" : SINCE_FLAGS[s]}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow title="কতটা গুরুতর">
          {(Object.keys(PRIORITY_FLAGS) as PriorityFilter[]).map((p) => (
            <Chip key={p} active={priority === p} onClick={() => setPriority(p)}>
              {p === "all" ? "সব" : PRIORITY_FLAGS[p]}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow title="কোন শব্দ">
          {(Object.keys(GREP_FLAGS) as GrepFilter[]).map((g) => (
            <Chip key={g} active={grep === g} onClick={() => setGrep(g)}>
              {g === "none" ? "কিছু না" : GREP_FLAGS[g]}
            </Chip>
          ))}
        </ChipRow>
      </div>

      <div className="mt-6 border border-border bg-muted/30 px-4 py-3 font-mono text-xs break-all">
        <span className="text-muted-foreground">$ </span>
        <span className="text-foreground" data-testid="logs-filter-command">
          {command}
        </span>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        বারোটার মধ্যে <strong className="text-foreground">{toBn(shown.length)}</strong> টা লাইন টিকে আছে।
      </p>

      <ul className="mt-3 space-y-1.5" data-testid="logs-filter-results">
        {shown.length === 0 && (
          <li className="border border-dashed border-border px-3 py-2 font-mono text-xs text-muted-foreground">
            -- No entries --
          </li>
        )}
        {shown.map((e) => (
          <li
            key={`${e.time}-${e.who}-${e.message}`}
            className={cn(
              "flex items-start gap-3 border px-3 py-2",
              e.cause ? "border-primary/60" : "border-border",
            )}
          >
            <PriorityBadge priority={e.priority} />
            <span className="font-mono text-[0.6875rem] leading-relaxed text-foreground break-all">
              <span className="text-muted-foreground">{`${e.time} ${e.who}: `}</span>
              {e.message}
            </span>
          </li>
        ))}
      </ul>

      {hiddenCauses.length > 0 && (
        <div className="mt-5 border-l-2 border-primary bg-primary/5 px-4 py-3 text-sm leading-relaxed">
          <strong className="text-primary">সাবধান:</strong> আসল কারণের {toBn(hiddenCauses.length)} টা
          লাইন Priority Filter এর জন্য বাদ পড়েছে:{" "}
          {hiddenCauses.map((e) => (
            <code key={e.time} className="mr-2">
              {`${e.who} ${e.time}`}
            </code>
          ))}
          এই লাইনগুলো stdout বা stderr এ লেখা, তাই journald এগুলোকে Priority 6 দিয়েছে, ভেতরে
          error লেখা থাকলেও। এদের ধরতে <code>--grep</code> ব্যবহার করুন।
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. App নিজে না বললে journald জানে না লাইনটা কতটা গুরুতর                         */
/* ------------------------------------------------------------------------- */

type Mode = "plain" | "prefixed";

const APP_CALLS = [
  { level: "info", prefix: "<6>", priority: 6, json: '{"level":"info","msg":"listening","port":3000}' },
  { level: "warn", prefix: "<4>", priority: 4, json: '{"level":"warn","msg":"payment gateway slow","ms":4200}' },
  { level: "error", prefix: "<3>", priority: 3, json: '{"level":"error","msg":"booking failed","requestId":"req-9K1P"}' },
] as const;

export function PriorityPrefixLab() {
  const [mode, setMode] = useState<Mode>("plain");

  return (
    <Panel
      label="LAB"
      title="Priority কে বসায়"
      footer={
        <>
          Practice Server এ দুইভাবেই চালিয়ে <code>-o verbose</code> দিয়ে PRIORITY Field পড়া
          হয়েছে। Prefix ছাড়া প্রতিটা লাইন 6, ভেতরে যা ই লেখা থাকুক। লাইনের একদম শুরুতে{" "}
          <code>&lt;3&gt;</code> দিলে journald সেটা কেটে নেয় আর লাইনটার Priority 3 বসায়।
          Caddy নিজের JSON Log এ এই Prefix দেয় না, তাই Caddy এর error লাইনও 6।
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Chip active={mode === "plain"} onClick={() => setMode("plain")}>
          Prefix ছাড়া
        </Chip>
        <Chip active={mode === "prefixed"} onClick={() => setMode("prefixed")}>
          {"<3>, <4>, <6> সহ"}
        </Chip>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-bold">App যা লেখে</th>
              <th className="py-2 pr-3 font-bold">PRIORITY</th>
              <th className="py-2 pr-3 font-bold">-p warning এ আসে</th>
              <th className="py-2 font-bold">-p err এ আসে</th>
            </tr>
          </thead>
          <tbody data-testid="logs-prefix-rows">
            {APP_CALLS.map((c) => {
              const priority = mode === "prefixed" ? c.priority : 6;
              const written = mode === "prefixed" ? `${c.prefix}${c.json}` : c.json;
              return (
                <tr key={c.level} className="border-b border-border/60 align-top">
                  <td className="py-2.5 pr-3 font-mono text-[0.6875rem] break-all">{written}</td>
                  <td className="py-2.5 pr-3">
                    <PriorityBadge priority={priority} />
                  </td>
                  <td className="py-2.5 pr-3">
                    <YesNo yes={priority <= 4} />
                  </td>
                  <td className="py-2.5">
                    <YesNo yes={priority <= 3} />
                  </td>
                </tr>
              );
            })}
            <tr className="align-top">
              <td className="py-2.5 pr-3 font-mono text-[0.6875rem] break-all">
                {'caddy: {"level":"error","msg":"dial tcp 127.0.0.1:3000 ... refused"}'}
              </td>
              <td className="py-2.5 pr-3">
                <PriorityBadge priority={6} />
              </td>
              <td className="py-2.5 pr-3">
                <YesNo yes={false} />
              </td>
              <td className="py-2.5">
                <YesNo yes={false} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function YesNo({ yes }: { yes: boolean }) {
  return yes ? (
    <span className="inline-flex items-center gap-1 text-primary font-bold text-xs">
      <Check className="w-3.5 h-3.5" /> আসে
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
      <X className="w-3.5 h-3.5" /> আসে না
    </span>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. কোন লাইনটা আসল কারণ                                                       */
/* ------------------------------------------------------------------------- */

type Verdict = "cause" | "where" | "summary" | "noise";

const CRASH_LINES: { text: string; verdict: Verdict; why: string }[] = [
  {
    text: "07:25:37 systemd[1]: Started my-tours-api.service - my-tours API.",
    verdict: "noise",
    why: "systemd শুধু জানাচ্ছে সে App টা চালু করেছে। চালু হওয়া কোনো সমস্যা নয়।",
  },
  {
    text: "07:25:37 node[551]: file:///srv/my-tours/server.mjs:13",
    verdict: "where",
    why: "কোন File এর কোন লাইনে ঘটনাটা ঘটল। কারণ নয়, কারণ খুঁজে পাওয়ার ঠিকানা।",
  },
  {
    text: "07:25:37 node[551]:   if (!process.env[name]) throw new Error(`${name} is not set`);",
    verdict: "where",
    why: "Node সেই লাইনের Code টা দেখিয়ে দিচ্ছে, নিচের ^ চিহ্নটা ঠিক কোন জায়গায় তা দেখায়।",
  },
  {
    text: "07:25:37 node[551]: Error: DATABASE_URL is not set",
    verdict: "cause",
    why: "এটাই কারণ, App এর নিজের মুখে। DATABASE_URL নামের Setting টা App পায়নি, তাই সে নিজেই থেমে গেছে। সারানোর জায়গা Environment File, লেসন ০৫।",
  },
  {
    text: "07:25:37 node[551]:     at ModuleJob.run (node:internal/modules/esm/module_job:195:25)",
    verdict: "noise",
    why: "Node এর নিজের ভেতরের ফ্রেম। প্রায় কখনো এখানে আপনার কিছু করার থাকে না, নিজের File এর ফ্রেম খুঁজুন।",
  },
  {
    text: "07:25:37 node[551]: Node.js v18.19.1",
    verdict: "noise",
    why: "কোন Node Version চলছিল। Bug Report এ কাজে লাগে, এই ঘটনার কারণ নয়।",
  },
  {
    text: "07:25:37 systemd[1]: my-tours-api.service: Main process exited, code=exited, status=1/FAILURE",
    verdict: "summary",
    why: "systemd দেখল Process টা Exit Code 1 দিয়ে বেরিয়ে গেছে। কী হয়েছে বলে, কেন হয়েছে বলে না।",
  },
  {
    text: "07:25:38 systemd[1]: my-tours-api.service: Scheduled restart job, restart counter is at 5.",
    verdict: "summary",
    why: "Restart=on-failure এর কাজ। এটা পাঁচ নম্বর চেষ্টা, মানে একই জিনিস বারবার ঘটছে।",
  },
  {
    text: "07:25:38 systemd[1]: my-tours-api.service: Start request repeated too quickly.",
    verdict: "summary",
    why: "systemd হাল ছেড়ে দিল, দশ সেকেন্ডে পাঁচবারের বেশি চেষ্টা করবে না। সবচেয়ে চোখে পড়ে, কিন্তু কারণ নয়।",
  },
  {
    text: "07:25:38 systemd[1]: Failed to start my-tours-api.service - my-tours API.",
    verdict: "summary",
    why: "শেষ লাইন, আর Priority 3 বলে -p err এ শুধু এটাই আসে। এটা ফলাফল, কারণ নয়।",
  },
];

const VERDICT_LABEL: Record<Verdict, string> = {
  cause: "আসল কারণ",
  where: "কোথায় ঘটল",
  summary: "systemd এর সারাংশ",
  noise: "এই মুহূর্তে কাজে লাগে না",
};

export function CrashReadLab() {
  const [picked, setPicked] = useState<number | null>(null);
  const [found, setFound] = useState(false);
  const pickedLine = picked === null ? null : CRASH_LINES[picked];

  function handlePick(index: number) {
    setPicked(index);
    if (CRASH_LINES[index].verdict === "cause") setFound(true);
  }

  return (
    <Panel
      label="LAB"
      title="Crash Loop এর শেষ চেষ্টা, কারণটা খুঁজুন"
      footer={
        <>
          <code>journalctl -u my-tours-api</code> এর শেষ চেষ্টার লাইনগুলো, Practice Server
          থেকে হুবহু, শুধু তারিখ আর Host বাদ। Stack এর মাঝের কয়েকটা Node ফ্রেম ছোট রাখার
          জন্য বাদ দেওয়া হয়েছে। যে লাইনটা বলে App কেন পড়ে গেল, সেটায় চাপ দিন।
        </>
      }
    >
      <ol className="space-y-1" data-testid="logs-crash-lines">
        {CRASH_LINES.map((line, i) => (
          <li key={line.text}>
            <button
              type="button"
              onClick={() => handlePick(i)}
              className={cn(
                "w-full text-left border px-3 py-1.5 font-mono text-[0.6875rem] leading-relaxed break-all transition-colors",
                picked === i
                  ? line.verdict === "cause"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-foreground/50 bg-muted/40 text-foreground"
                  : found && line.verdict === "cause"
                    ? "border-primary/60 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
              )}
            >
              {line.text}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-5 min-h-[5.5rem] border border-border bg-muted/20 px-4 py-3 text-sm leading-relaxed" data-testid="logs-crash-verdict">
        {pickedLine ? (
          <>
            <span
              className={cn(
                "mr-2 inline-block border px-2 py-0.5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.1em]",
                pickedLine.verdict === "cause" ? "border-primary text-primary" : "border-border text-muted-foreground",
              )}
            >
              {VERDICT_LABEL[pickedLine.verdict]}
            </span>
            {pickedLine.why}
            {pickedLine.verdict !== "cause" && !found && (
              <span className="block mt-2 text-muted-foreground">
                আরেকটা লাইন বেছে দেখুন। ইঙ্গিত: systemd এর নয়, App এর নিজের লাইন খুঁজুন।
              </span>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">
            একটা লাইন বেছে নিন। বেশিরভাগ মানুষ প্রথমে একদম শেষের লাইনটা বাছেন, কারণ সেটাই
            সবচেয়ে চোখে পড়ে।
          </span>
        )}
      </div>
    </Panel>
  );
}
