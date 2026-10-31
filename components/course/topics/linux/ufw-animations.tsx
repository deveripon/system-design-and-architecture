/**
 * What: The interactive labs for Module 07 Lesson 06, Firewall Management with ufw.
 * DenyRejectLab shows what a client sees for allow, deny and reject, with and without a program
 * listening. RuleOrderLab walks one packet down a rule list so the reader sees that the first
 * match wins, and lets them reorder the rules. LimitLab replays ufw's limit rule on a simulated
 * clock. UfwCommandLab builds a ufw command from choices and warns about the dangerous ones.
 *
 * Why: Firewall rules are easy to write and easy to get wrong in ways that look fine. Each lab
 * lets the reader cause the mistake on purpose. The client messages and timings come from real
 * runs on the lesson's practice server. Every value on screen is derived from state inside event
 * handlers, never set from an effect.
 */
"use client";

import { cn, toBn } from "@/lib/utils";
import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
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
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
} & Record<`data-${string}`, string | number>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={cn(
        "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="w-28 shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Allow, Deny, Reject: Client কী দেখে                                       */
/* ------------------------------------------------------------------------- */

type Action = "allow" | "deny" | "reject";

const NC_TARGET = "island-vps-01 (172.21.0.2)";

type Outcome = {
  reply: "synack" | "rst" | "none";
  replyLabel: string;
  nc: string;
  ms: number;
  learns: string;
  who: string;
};

function outcomeFor(action: Action, listening: boolean): Outcome {
  if (action === "deny") {
    return {
      reply: "none",
      replyLabel: "কোনো উত্তর নেই",
      nc: `nc: connect to ${NC_TARGET} port 5432 (tcp) timed out: Operation now in progress`,
      ms: 3008,
      learns: "কিছুই না। এখানে আদৌ কোনো যন্ত্র আছে কি না, তাও না। Client কে নিজের ধৈর্য ফুরানো পর্যন্ত অপেক্ষা করতে হলো।",
      who: "ufw চুপচাপ Packet টা ফেলে দিল (DROP)। Program টা জানলই না কেউ এসেছিল।",
    };
  }
  if (action === "reject") {
    return {
      reply: "rst",
      replyLabel: "RST, ufw নিজে পাঠাল",
      nc: `nc: connect to ${NC_TARGET} port 5432 (tcp) failed: Connection refused`,
      ms: 3,
      learns: "এই ঠিকানায় একটা যন্ত্র আছে, আর সে এই দরজায় না বলছে। Client সাথে সাথে উত্তর পেল, অপেক্ষা করতে হলো না।",
      who: "ufw নিজেই একটা RST বানিয়ে ফেরত পাঠাল (REJECT, tcp-reset)। Program এর কাছে Packet পৌঁছায়নি।",
    };
  }
  if (!listening) {
    return {
      reply: "rst",
      replyLabel: "RST, Kernel পাঠাল",
      nc: `nc: connect to ${NC_TARGET} port 5432 (tcp) failed: Connection refused`,
      ms: 3,
      learns: "যন্ত্র আছে, দরজাও খোলা, কিন্তু ভেতরে কেউ শুনছে না। Reject এর সাথে হুবহু একই বার্তা, তাই শুধু বার্তা দেখে দুইটা আলাদা করা যায় না।",
      who: "ufw ঢুকতে দিল, কিন্তু Port 5432 এ কোনো Program নেই। তাই Kernel নিজে RST পাঠাল (Module 05 এর RST মনে আছে?)।",
    };
  }
  return {
    reply: "synack",
    replyLabel: "SYN-ACK, Handshake চলছে",
    nc: `Connection to ${NC_TARGET} 5432 port [tcp/postgresql] succeeded!`,
    ms: 0,
    learns: "এখানে PostgreSQL আছে, আর সে বাইরের যে কারো সাথে কথা বলতে রাজি। একজন আক্রমণকারী ঠিক এই উত্তরটাই খোঁজে।",
    who: "ufw ঢুকতে দিল, Program শুনছিল, Three-way Handshake পূর্ণ হলো।",
  };
}

const ACTIONS: { id: Action; label: string }[] = [
  { id: "allow", label: "allow" },
  { id: "deny", label: "deny" },
  { id: "reject", label: "reject" },
];

export function DenyRejectLab() {
  const [action, setAction] = useState<Action>("deny");
  const [listening, setListening] = useState(true);
  const out = outcomeFor(action, listening);

  return (
    <Panel
      label="Interactive"
      title="একই দরজা, তিনটা উত্তর"
      footer="বাইরের একটা যন্ত্র থেকে nc -vz -w 3 দিয়ে Port 5432 এ টোকা দেওয়া হচ্ছে, যেভাবে এই লেসনের Practice Server এ করা হয়েছিল। বার্তাগুলো আর সময়গুলো সেই আসল পরীক্ষার: deny তে 3008 ms পরে timed out, reject এ 3 ms এ Connection refused। খেয়াল করুন, reject আর খোলা দরজার পেছনে কেউ না থাকা, দুইটার বার্তা হুবহু এক।"
    >
      <Row label="ufw এর Rule">
        {ACTIONS.map((a) => (
          <Chip key={a.id} active={action === a.id} onClick={() => setAction(a.id)} data-action={a.id}>
            {a.label} 5432/tcp
          </Chip>
        ))}
      </Row>
      <Row label="Port 5432 এ">
        <Chip active={listening} onClick={() => setListening(true)} data-listening="yes">
          PostgreSQL শুনছে
        </Chip>
        <Chip active={!listening} onClick={() => setListening(false)} data-listening="no">
          কেউ শুনছে না
        </Chip>
      </Row>

      <div className="overflow-x-auto mt-4">
        <svg viewBox="0 0 640 150" style={{ minWidth: 520, height: 150 }} className="w-full text-muted-foreground" role="img" aria-label="Client আর Server এর মাঝে কী গেল আর কী ফিরল">
          <defs>
            <marker id="ufw-dr-arrow" markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--primary)" />
            </marker>
          </defs>
          <rect x={10} y={45} width={130} height={56} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} />
          <text x={75} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor" fontFamily="var(--font-mono), monospace">laptop</text>
          <text x={75} y={88} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.75} fontFamily="var(--font-mono), monospace">nc -vz -w 3</text>

          <rect x={300} y={20} width={24} height={110} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" />
          <text x={312} y={14} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="var(--primary)" fontFamily="var(--font-mono), monospace">ufw</text>

          <rect x={490} y={45} width={140} height={56} fill={listening ? "var(--primary)" : "currentColor"} fillOpacity={listening ? 0.1 : 0.04} stroke={listening ? "var(--primary)" : "currentColor"} strokeOpacity={listening ? 1 : 0.45} />
          <text x={560} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor" fontFamily="var(--font-mono), monospace">:5432</text>
          <text x={560} y={88} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.75} fontFamily="var(--font-sans), sans-serif">
            {listening ? "PostgreSQL" : "খালি"}
          </text>

          {/* the SYN going out */}
          <line
            x1={142}
            y1={60}
            x2={action === "allow" ? 486 : 296}
            y2={60}
            stroke="var(--primary)"
            strokeWidth={1.6}
            markerEnd="url(#ufw-dr-arrow)"
            style={{ transition: "all 300ms ease" }}
          />
          <text x={215} y={52} textAnchor="middle" fontSize={9} fill="currentColor" fontFamily="var(--font-mono), monospace">SYN</text>

          {/* what comes back */}
          {out.reply !== "none" && (
            <line
              x1={out.reply === "synack" || (action === "allow" && !listening) ? 486 : 296}
              y1={88}
              x2={144}
              y2={88}
              stroke="var(--primary)"
              strokeWidth={1.6}
              strokeDasharray={out.reply === "rst" ? "5 3" : undefined}
              markerEnd="url(#ufw-dr-arrow)"
            />
          )}
          {out.reply === "none" && (
            <g stroke="var(--primary)" strokeWidth={2}>
              <line x1={284} y1={54} x2={296} y2={66} />
              <line x1={296} y1={54} x2={284} y2={66} />
            </g>
          )}
          <text x={215} y={110} textAnchor="middle" fontSize={9} fill="var(--primary)" fontFamily="var(--font-sans), sans-serif">
            {out.replyLabel}
          </text>
        </svg>
      </div>

      <div className="mt-4 border border-border bg-muted/20 p-4 font-mono text-[0.75rem] leading-relaxed break-all" data-output="nc">
        <span className="text-muted-foreground">you@laptop:~$ </span>nc -vz -w 3 island-vps-01 5432
        <br />
        <span className={cn(out.reply === "synack" ? "text-primary" : "text-foreground")}>{out.nc}</span>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-[0.8125rem] leading-relaxed">
        <div className="border border-border p-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">সময় লাগল</div>
          <div className="font-mono text-base font-bold text-primary" data-output="ms">
            {out.ms >= 1000 ? `${out.ms} ms` : out.ms === 0 ? "প্রায় সাথে সাথে" : `${out.ms} ms`}
          </div>
        </div>
        <div className="border border-border p-3 md:col-span-2">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">Server এ কী হলো</div>
          <div>{out.who}</div>
        </div>
      </div>
      <div className="mt-3 border border-primary/40 bg-primary/5 p-3 text-[0.8125rem] leading-relaxed">
        <span className="font-bold text-primary">বাইরের মানুষটা কী জানল: </span>
        {out.learns}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. ক্রম: প্রথম যেটা মেলে                                                      */
/* ------------------------------------------------------------------------- */

type Verdict = "ALLOW" | "DENY" | "REJECT";

type Rule = { id: string; port: number; verdict: Verdict; from: string };

const INITIAL_RULES: Rule[] = [
  { id: "web80", port: 80, verdict: "ALLOW", from: "Anywhere" },
  { id: "web443", port: 443, verdict: "ALLOW", from: "Anywhere" },
  { id: "ssh-office", port: 22, verdict: "ALLOW", from: "203.0.113.0/24" },
  { id: "block-scanner", port: 80, verdict: "DENY", from: "198.51.100.7" },
];

const SOURCES = [
  { id: "office", ip: "203.0.113.10", label: "অফিস" },
  { id: "tourist", ip: "198.51.100.20", label: "পর্যটক" },
  { id: "scanner", ip: "198.51.100.7", label: "বিরক্তিকর Scanner" },
] as const;

const PORTS = [22, 80, 443, 5432] as const;

function sourceMatches(from: string, ip: string) {
  if (from === "Anywhere") return true;
  if (from.endsWith("/24")) return ip.startsWith(from.slice(0, from.lastIndexOf(".") + 1));
  return from === ip;
}

export function RuleOrderLab() {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [sourceId, setSourceId] = useState<(typeof SOURCES)[number]["id"]>("scanner");
  const [port, setPort] = useState<(typeof PORTS)[number]>(80);

  const source = SOURCES.find((s) => s.id === sourceId) ?? SOURCES[0];
  const matchIndex = rules.findIndex((r) => r.port === port && sourceMatches(r.from, source.ip));
  const decided: Verdict = matchIndex === -1 ? "DENY" : rules[matchIndex].verdict;
  const blockIndex = rules.findIndex((r) => r.id === "block-scanner");
  const shadowed =
    sourceId === "scanner" && port === 80 && matchIndex !== -1 && matchIndex < blockIndex && decided === "ALLOW";

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= rules.length) return;
    const next = [...rules];
    [next[index], next[target]] = [next[target], next[index]];
    setRules(next);
  }

  return (
    <Panel
      label="Interactive"
      title="একটা Packet, উপর থেকে নিচে"
      footer="ufw প্রতিটা নতুন Packet কে তালিকার উপর থেকে একটা একটা Rule এর সাথে মেলায়। প্রথম যে Rule এ Port আর From দুইটাই মেলে, সিদ্ধান্ত সেখানেই, নিচের Rule গুলো আর দেখাই হয় না। কোনোটাই না মিললে Default নীতি। শুরুতে বিরক্তিকর Scanner কে আটকানোর Rule টা তালিকার শেষে, তাই কাজই করছে না। তীর দিয়ে সেটাকে উপরে তুলে দেখুন। এই লেসনের Practice Server এ ঠিক এই পরীক্ষাটাই চালানো হয়েছিল।"
    >
      <Row label="কে পাঠাচ্ছে">
        {SOURCES.map((s) => (
          <Chip key={s.id} active={sourceId === s.id} onClick={() => setSourceId(s.id)} data-source={s.id}>
            {s.label} {s.ip}
          </Chip>
        ))}
      </Row>
      <Row label="কোন Port এ">
        {PORTS.map((p) => (
          <Chip key={p} active={port === p} onClick={() => setPort(p)} data-port={p}>
            {p}/tcp
          </Chip>
        ))}
      </Row>

      <div className="mt-4 border border-border overflow-x-auto">
        <div className="min-w-[34rem]">
          <div className="grid grid-cols-[3rem_6rem_6rem_1fr_6rem_4.5rem] gap-2 px-3 py-2 border-b border-border bg-muted/30 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
            <span>#</span>
            <span>To</span>
            <span>Action</span>
            <span>From</span>
            <span>ফল</span>
            <span />
          </div>
          {rules.map((r, i) => {
            const isMatch = i === matchIndex;
            const checked = matchIndex === -1 || i < matchIndex;
            const status = isMatch ? "মিলেছে" : checked ? "মেলেনি" : "দেখাই হয়নি";
            return (
              <div
                key={r.id}
                data-rule={r.id}
                className={cn(
                  "grid grid-cols-[3rem_6rem_6rem_1fr_6rem_4.5rem] gap-2 items-center px-3 py-2 border-b border-border font-mono text-[0.75rem] transition-colors",
                  isMatch && "bg-primary/10",
                  !isMatch && !checked && "opacity-45",
                )}
              >
                <span className="text-muted-foreground">[{i + 1}]</span>
                <span>{r.port}/tcp</span>
                <span className={cn(r.verdict === "ALLOW" ? "text-primary font-bold" : "font-bold")}>{r.verdict} IN</span>
                <span>{r.from}</span>
                <span className={cn("text-[0.6875rem]", isMatch ? "text-primary font-bold" : "text-muted-foreground")}>{status}</span>
                <span className="flex gap-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Rule ${i + 1} উপরে তুলুন`}
                    className="p-1 border border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === rules.length - 1}
                    aria-label={`Rule ${i + 1} নিচে নামান`}
                    className="p-1 border border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </span>
              </div>
            );
          })}
          <div
            className={cn(
              "grid grid-cols-[3rem_6rem_6rem_1fr_6rem_4.5rem] gap-2 items-center px-3 py-2 font-mono text-[0.75rem]",
              matchIndex === -1 ? "bg-primary/10" : "opacity-45",
            )}
          >
            <span className="text-muted-foreground">শেষে</span>
            <span>সব Port</span>
            <span className="font-bold">DENY</span>
            <span>Default: deny (incoming)</span>
            <span className={cn("text-[0.6875rem]", matchIndex === -1 ? "text-primary font-bold" : "text-muted-foreground")}>
              {matchIndex === -1 ? "এখানে থামল" : "দরকার পড়েনি"}
            </span>
            <span />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[0.75rem] text-muted-foreground">
          {source.ip} থেকে {port}/tcp:
        </span>
        <span
          data-output="verdict"
          className={cn(
            "px-3 py-1 border font-mono text-[0.8125rem] font-bold",
            decided === "ALLOW" ? "border-primary text-primary bg-primary/10" : "border-border text-foreground",
          )}
        >
          {decided === "ALLOW" ? "ঢুকতে পারল" : "আটকে গেল"}
        </span>
        <button
          onClick={() => setRules(INITIAL_RULES)}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-[0.6875rem] font-bold text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3" />
          শুরুর ক্রমে ফেরান
        </button>
      </div>
      {shadowed && (
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-primary">
          Scanner কে আটকানোর Rule টা লেখা আছে, কিন্তু তার আগেই Rule {toBn(matchIndex + 1)} মিলে গেছে, তাই
          সেটা কখনো দেখাই হয় না। সমাধান: sudo ufw insert 1 deny from 198.51.100.7 to any port 80 proto tcp
        </p>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. limit: ৩০ সেকেন্ডে ৬ বার                                                   */
/* ------------------------------------------------------------------------- */

const LIMIT_WINDOW_S = 30;
const LIMIT_HITS = 6;
const ATTEMPT_COST_S = 1;
const TIMELINE_S = 45;

type Attempt = { t: number; ok: boolean };

function recordAttempt(attempts: Attempt[], t: number): Attempt {
  const recent = attempts.filter((a) => a.t > t - LIMIT_WINDOW_S).length + 1;
  return { t, ok: recent < LIMIT_HITS };
}

export function LimitLab() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [now, setNow] = useState(0);

  function tryTimes(count: number) {
    let t = now;
    const next = [...attempts];
    for (let i = 0; i < count; i++) {
      next.push(recordAttempt(next, t));
      t += ATTEMPT_COST_S;
    }
    setAttempts(next);
    setNow(t);
  }

  function wait(seconds: number) {
    setNow(now + seconds);
  }

  function reset() {
    setAttempts([]);
    setNow(0);
  }

  const inWindow = attempts.filter((a) => a.t > now - LIMIT_WINDOW_S).length;
  const last = attempts[attempts.length - 1];
  const start = Math.max(0, now - TIMELINE_S);
  const shown = attempts.filter((a) => a.t >= start);
  const okCount = attempts.filter((a) => a.ok).length;
  const blockedCount = attempts.length - okCount;

  return (
    <Panel
      label="Interactive"
      title="ufw limit 22/tcp, একটা নকল ঘড়িতে"
      footer="ufw limit এর নিয়ম: একই ঠিকানা থেকে শেষ ৩০ সেকেন্ডে নতুন Connection এর চেষ্টা ৬ বা তার বেশি হলেই এটা আটকে যায়। আটকে যাওয়া চেষ্টাও গোনা হয়। তাই থেমে থেমে আবার চেষ্টা করলে আটকানো চলতেই থাকে, ছাড়া পেতে হলে পুরো ৩০ সেকেন্ড চুপ থাকতে হয়। Practice Server এ আসল পরীক্ষায় প্রথম পাঁচটা চেষ্টা ঢুকেছিল, ষষ্ঠটা থেকে আটকে গিয়েছিল, আর ২ সেকেন্ড পরপর চেষ্টা চালানো একটা Loop দেড় মিনিটেও ঢুকতে পারেনি। প্রতিটা চেষ্টায় এখানে ১ সেকেন্ড ধরা হয়েছে।"
    >
      <div className="flex flex-wrap gap-2 mb-4">
        <Chip active={false} onClick={() => tryTimes(1)} data-action="once">
          একবার SSH চেষ্টা
        </Chip>
        <Chip active={false} onClick={() => tryTimes(8)} data-action="burst">
          পরপর ৮ বার
        </Chip>
        <Chip active={false} onClick={() => wait(10)} data-action="wait">
          ১০ সেকেন্ড চুপ
        </Chip>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-[0.6875rem] font-bold text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3" />
          নতুন করে
        </button>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 640 110" style={{ minWidth: 520, height: 110 }} className="w-full text-muted-foreground" role="img" aria-label="শেষ ৪৫ সেকেন্ডের চেষ্টাগুলো">
          {/* the 30 second window that ufw counts */}
          <rect
            x={20 + ((Math.max(start, now - LIMIT_WINDOW_S) - start) / TIMELINE_S) * 600}
            y={20}
            width={((now - Math.max(start, now - LIMIT_WINDOW_S)) / TIMELINE_S) * 600}
            height={56}
            fill="var(--primary)"
            fillOpacity={0.08}
            stroke="var(--primary)"
            strokeOpacity={0.4}
            strokeDasharray="4 3"
          />
          <line x1={20} y1={48} x2={620} y2={48} stroke="currentColor" strokeOpacity={0.35} />
          {shown.map((a, i) => {
            const x = 20 + ((a.t - start) / TIMELINE_S) * 600;
            return (
              <circle
                key={`${a.t}-${i}`}
                cx={x}
                cy={48}
                r={6}
                fill={a.ok ? "var(--primary)" : "transparent"}
                stroke={a.ok ? "var(--primary)" : "currentColor"}
                strokeWidth={1.6}
              />
            );
          })}
          <text x={620} y={96} textAnchor="end" fontSize={9} fill="currentColor" fontFamily="var(--font-sans), sans-serif">
            এখন: {toBn(now)} সেকেন্ড
          </text>
          <text x={20} y={96} textAnchor="start" fontSize={9} fill="currentColor" fillOpacity={0.7} fontFamily="var(--font-sans), sans-serif">
            ভরা বৃত্ত: ঢুকল · ফাঁপা বৃত্ত: আটকে গেল · দাগানো ঘর: ufw যে ৩০ সেকেন্ড গোনে
          </text>
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-[0.8125rem]">
        <div className="border border-border p-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">শেষ ৩০ সেকেন্ডে চেষ্টা</div>
          <div className={cn("font-mono text-base font-bold", inWindow >= LIMIT_HITS ? "text-primary" : "text-foreground")} data-output="window">
            {toBn(inWindow)}
          </div>
        </div>
        <div className="border border-border p-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">মোট</div>
          <div className="font-mono text-base font-bold" data-output="totals">
            {toBn(okCount)} ঢুকল, {toBn(blockedCount)} আটকে গেল
          </div>
        </div>
        <div className="border border-border p-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">শেষ চেষ্টার ফল</div>
          <div className={cn("font-mono text-[0.75rem] font-bold", last?.ok ? "text-primary" : "text-foreground")} data-output="last">
            {last ? (last.ok ? "Connection succeeded" : "Connection refused") : "এখনো কোনো চেষ্টা নেই"}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Rule বানানোর যন্ত্র                                                        */
/* ------------------------------------------------------------------------- */

type BuildAction = "allow" | "deny" | "reject" | "limit";
type Proto = "tcp" | "udp";

const BUILD_ACTIONS: BuildAction[] = ["allow", "deny", "reject", "limit"];
const BUILD_PORTS = [22, 80, 443, 3000, 5432, 6379] as const;
const BUILD_SOURCES = ["Anywhere", "203.0.113.0/24", "198.51.100.7"] as const;

const PORT_NAMES: Record<(typeof BUILD_PORTS)[number], string> = {
  22: "SSH",
  80: "HTTP",
  443: "HTTPS",
  3000: "App",
  5432: "PostgreSQL",
  6379: "Redis",
};

function adviceFor(action: BuildAction, port: number, proto: Proto, source: string): { tone: "warn" | "ok"; text: string }[] {
  const notes: { tone: "warn" | "ok"; text: string }[] = [];
  const opens = action === "allow" || action === "limit";
  if (opens && source === "Anywhere" && [3000, 5432, 6379].includes(port)) {
    notes.push({
      tone: "warn",
      text: "এই দরজা পুরো Internet এর জন্য খুলছে। App, PostgreSQL বা Redis বাইরে থেকে সরাসরি পৌঁছানোর কথা নয়। নিজে দেখতে চাইলে SSH Tunnel ব্যবহার করুন (লেসন ০৩)।",
    });
  }
  if (port === 22 && proto === "udp") {
    notes.push({ tone: "warn", text: "SSH চলে TCP তে। UDP এর এই Rule কোনো কাজে আসবে না, আর আসল দরজাটা হয়তো বন্ধই থেকে গেল।" });
  }
  if ((port === 80 || port === 3000 || port === 5432 || port === 6379) && proto === "udp") {
    notes.push({ tone: "warn", text: "এই Port এর Program গুলো TCP তে কথা বলে। UDP খোলা মানে একটা অপ্রয়োজনীয় দরজা।" });
  }
  if (port === 443 && proto === "udp" && opens) {
    notes.push({ tone: "ok", text: "HTTP/3 এর জন্য, যা QUIC এর উপর, আর QUIC চলে UDP তে (Module 06)। Caddy চাইলে এটা ব্যবহার করে।" });
  }
  if (action === "limit" && port !== 22) {
    notes.push({
      tone: "warn",
      text: "limit বানানো Login দরজার জন্য। ওয়েবসাইটের Port এ বসালে একই অফিসের অনেক মানুষ, বা একসাথে অনেক Connection খোলা একটা Browser আটকে যেতে পারে।",
    });
  }
  if (action === "deny" && port === 22 && source === "Anywhere") {
    notes.push({ tone: "warn", text: "নিজের দরজায় নিজেই তালা। অন্য কোনো Rule এ SSH খোলা না থাকলে নতুন Login আর হবে না।" });
  }
  if (action === "deny" && source === "Anywhere" && port !== 22) {
    notes.push({
      tone: "ok",
      text: "Default যেহেতু deny, এই Rule আলাদা কিছু যোগ করে না, যদি না এর আগে কোনো allow থাকে। তবে উদ্দেশ্যটা লিখিত থাকে, সেটাও একটা লাভ।",
    });
  }
  if (opens && port === 22 && source === "203.0.113.0/24") {
    notes.push({
      tone: "ok",
      text: "শুধু অফিসের ঠিকানাগুলো থেকে। কিন্তু বাসার IP বদলায় (Module 03 এর DHCP আর CGNAT), তাই অফিসের বাইরে থেকে ঢোকার আরেকটা পথ রাখুন, যেমন Provider এর Web Console।",
    });
  }
  if (action === "reject") {
    notes.push({ tone: "ok", text: "reject সাথে সাথে Connection refused ফেরত দেয়। বাইরের মানুষ জেনে যায় এখানে কিছু আছে, কিন্তু ভেতরের নিজের Tool গুলো অপেক্ষা না করে দ্রুত ভুল ধরতে পারে।" });
  }
  return notes;
}

export function UfwCommandLab() {
  const [action, setAction] = useState<BuildAction>("allow");
  const [port, setPort] = useState<(typeof BUILD_PORTS)[number]>(443);
  const [proto, setProto] = useState<Proto>("tcp");
  const [source, setSource] = useState<(typeof BUILD_SOURCES)[number]>("Anywhere");

  const anywhere = source === "Anywhere";
  const command = anywhere
    ? `sudo ufw ${action} ${port}/${proto}`
    : `sudo ufw ${action} from ${source} to any port ${port} proto ${proto}`;
  const to = `${port}/${proto}`;
  const verdict = `${action.toUpperCase()} IN`;
  const statusLines = [`${to.padEnd(27)}${verdict.padEnd(12)}${source}`];
  if (anywhere) statusLines.push(`${`${to} (v6)`.padEnd(27)}${verdict.padEnd(12)}Anywhere (v6)`);
  const advice = adviceFor(action, port, proto, source);

  return (
    <Panel
      label="Interactive"
      title="নিজের Rule বানান"
      footer="ঘরগুলো বেছে নিলে নিচে ঠিক সেই ufw কমান্ডটা তৈরি হবে, আর ufw status এ সেটা কেমন দেখাবে তাও। Source যখন Anywhere, ufw নিজে থেকেই IPv6 এর জন্য আরেকটা লাইন যোগ করে, তাই Rule added এর পরে Rule added (v6) আসে। একটা নির্দিষ্ট IPv4 ঠিকানা দিলে শুধু একটা লাইন। বিপজ্জনক কোনো মিল হলে নিচে সতর্কবার্তা আসবে।"
    >
      <Row label="Action">
        {BUILD_ACTIONS.map((a) => (
          <Chip key={a} active={action === a} onClick={() => setAction(a)} data-build-action={a}>
            {a}
          </Chip>
        ))}
      </Row>
      <Row label="Port">
        {BUILD_PORTS.map((p) => (
          <Chip key={p} active={port === p} onClick={() => setPort(p)} data-build-port={p}>
            {p} {PORT_NAMES[p]}
          </Chip>
        ))}
      </Row>
      <Row label="Protocol">
        {(["tcp", "udp"] as const).map((p) => (
          <Chip key={p} active={proto === p} onClick={() => setProto(p)} data-build-proto={p}>
            {p}
          </Chip>
        ))}
      </Row>
      <Row label="কোথা থেকে">
        {BUILD_SOURCES.map((s) => (
          <Chip key={s} active={source === s} onClick={() => setSource(s)} data-build-source={s}>
            {s}
          </Chip>
        ))}
      </Row>

      <div className="mt-4 border border-border bg-muted/20 p-4 font-mono text-[0.75rem] leading-relaxed overflow-x-auto" data-output="command">
        <div className="whitespace-pre">
          <span className="text-muted-foreground">deploy@island-vps-01:~$ </span>
          <span className="text-primary font-bold">{command}</span>
        </div>
        <div className="whitespace-pre text-muted-foreground">Rule added</div>
        {anywhere && <div className="whitespace-pre text-muted-foreground">Rule added (v6)</div>}
        <div className="whitespace-pre mt-3">
          <span className="text-muted-foreground">deploy@island-vps-01:~$ </span>sudo ufw status
        </div>
        {statusLines.map((line) => (
          <div key={line} className="whitespace-pre">
            {line}
          </div>
        ))}
      </div>

      {advice.length > 0 && (
        <ul className="mt-3 space-y-2">
          {advice.map((a) => (
            <li
              key={a.text}
              className={cn(
                "border p-3 text-[0.8125rem] leading-relaxed",
                a.tone === "warn" ? "border-primary/60 bg-primary/5" : "border-border",
              )}
            >
              <span className={cn("font-bold mr-1", a.tone === "warn" ? "text-primary" : "text-foreground")}>
                {a.tone === "warn" ? "সাবধান:" : "জেনে রাখুন:"}
              </span>
              {a.text}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
