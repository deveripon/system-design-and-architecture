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
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
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
  disabled,
  ...rest
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
} & Record<`data-${string}`, string>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      {...rest}
      className={cn(
        "px-3 py-1.5 border text-[11px] font-bold transition-colors",
        disabled
          ? "border-border text-muted-foreground/40"
          : active
            ? "border-primary bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------------- */
/* Lab 1: চারটা সংখ্যা, এক Port 443 এ কতজন                                     */
/* ------------------------------------------------------------------------- */

const SERVER_IP = "103.94.135.2";
const SERVER_PORT = 443;
const FIRST_IP = "203.0.113.25";
const FIRST_PORT = 62001;
const OTHER_IPS = ["198.51.100.7", "198.51.100.44", "192.0.2.80", "192.0.2.131"];
const MAX_ROWS = 6;

type Row = { ip: string; port: number; who: string };

const START: Row[] = [{ ip: FIRST_IP, port: FIRST_PORT, who: "পর্যটক ক, প্রথম Tab" }];

export function FourTupleLab() {
  const reduce = useReducedMotion();
  const [rows, setRows] = useState<Row[]>(START);
  const [note, setNote] = useState<"start" | "tab" | "person" | "same-port" | "dup">("start");

  const full = rows.length >= MAX_ROWS;
  const tabsOfFirst = rows.filter((r) => r.ip === FIRST_IP).length;
  const usedIps = new Set(rows.map((r) => r.ip));
  const nextIp = OTHER_IPS.find((ip) => !usedIps.has(ip));

  const addTab = () => {
    setRows((r) => [
      ...r,
      { ip: FIRST_IP, port: FIRST_PORT + tabsOfFirst, who: `পর্যটক ক, Tab ${toBn(tabsOfFirst + 1)}` },
    ]);
    setNote("tab");
  };
  const addPerson = (samePort: boolean) => {
    if (!nextIp) return;
    setRows((r) => [
      ...r,
      {
        ip: nextIp,
        port: samePort ? FIRST_PORT : 49152 + ((r.length * 2711) % 16000),
        who: samePort ? "আরেক পর্যটক, কাকতালীয়ভাবে একই Port" : "আরেক পর্যটক",
      },
    ]);
    setNote(samePort ? "same-port" : "person");
  };

  const messages: Record<typeof note, string> = {
    start:
      "এখন একটাই Connection। নিচের বোতামগুলো দিয়ে আরও Client আনুন, আর প্রতিবার দেখুন চারটা ঘরের কোনটা আগের সারিগুলো থেকে আলাদা হলো।",
    tab: "একই ফোন, তাই Source IP হুবহু এক। কিন্তু ফোনের Kernel নতুন Tab কে একটা নতুন Ephemeral Port দিয়েছে। শুধু এই একটা সংখ্যা আলাদা বলেই Server এর Kernel দুই Tab এর উত্তর কখনো গুলিয়ে ফেলে না।",
    person:
      "নতুন মানুষ, নতুন IP, নতুন Port। Server এর দিকের দুইটা ঘর কিন্তু এখনো সবার এক, 103.94.135.2 আর 443।",
    "same-port":
      "এই পর্যটকের ফোন কাকতালীয়ভাবে ঠিক সেই 62001 ই বেছেছে যা পর্যটক ক এর প্রথম Tab এর। কোনো সমস্যা নেই, কারণ Source IP আলাদা। Port এর নম্বর শুধু একটা যন্ত্রের ভেতরে আলাদা হলেই চলে, পুরো পৃথিবীতে নয়।",
    dup: "Kernel এটা হতেই দেয়নি। চারটা সংখ্যাই যদি আগের একটা Connection এর সাথে মিলে যায়, তাহলে দুইটাকে আলাদা করার আর কোনো উপায় থাকে না। তাই Client এর Kernel কখনো একই গন্তব্যের জন্য একই Source Port দুইবার দেয় না।",
  };

  return (
    <Panel
      label="Interactive"
      title="একটা Port 443, কতগুলো Connection"
      footer="Server এর খাতার প্রতিটা সারি একটা Connection, আর প্রতিটা সারিতে চারটা সংখ্যা। ডান দিকের দুইটা ঘর কখনো বদলায় না, কারণ Server একটাই আর Port ও একটাই। বদলায় শুধু বাঁ দিকের দুইটা, মানে কে আসছে আর তার কোন Port থেকে। একটা Source IP থেকে একটা গন্তব্যে তাত্ত্বিকভাবে হাজার হাজার Connection খোলা যায়, আর Source IP আছে কোটি কোটি। তাই Server এ কতজন একসাথে থাকতে পারবে তার সীমা Port এর সংখ্যা নয়, সীমা হলো Server এর Memory আর খোলা রাখা যায় এমন Socket এর সংখ্যা।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Choice onClick={addTab} disabled={full} data-action="tab">
          একই ফোনে আরেকটা Tab
        </Choice>
        <Choice onClick={() => addPerson(false)} disabled={full || !nextIp} data-action="person">
          নতুন একজন পর্যটক
        </Choice>
        <Choice onClick={() => addPerson(true)} disabled={full || !nextIp} data-action="same-port">
          নতুন পর্যটক, একই Port 62001
        </Choice>
        <Choice onClick={() => setNote("dup")} data-action="dup">
          হুবহু প্রথম সারির নকল
        </Choice>
        <button
          onClick={() => {
            setRows(START);
            setNote("start");
          }}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="overflow-x-auto mb-5">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[1.3fr_1fr_0.7fr_1fr_0.7fr] gap-x-2 px-3 pb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>কে</span>
            <span>Source IP</span>
            <span>Source Port</span>
            <span>Dest IP</span>
            <span>Dest Port</span>
          </div>
          <div className="space-y-1.5">
            {rows.map((r, i) => {
              const last = i === rows.length - 1 && i > 0;
              const ipNew = last && rows.slice(0, i).every((p) => p.ip !== r.ip);
              const portNew = last && rows.slice(0, i).every((p) => p.port !== r.port);
              return (
                <div
                  key={`${r.ip}-${r.port}`}
                  data-row={i}
                  className={cn(
                    "grid grid-cols-[1.3fr_1fr_0.7fr_1fr_0.7fr] gap-x-2 items-center border px-3 py-2 font-mono text-[11px] transition-colors",
                    last ? "border-primary/50 bg-primary/5" : "border-border bg-background",
                  )}
                >
                  <span className="font-sans text-[11px] text-foreground">{r.who}</span>
                  <span className={cn(ipNew ? "text-primary font-bold" : "text-muted-foreground")}>{r.ip}</span>
                  <span className={cn(portNew ? "text-primary font-bold" : "text-muted-foreground")}>{r.port}</span>
                  <span className="text-muted-foreground/60">{SERVER_IP}</span>
                  <span className="text-muted-foreground/60">{SERVER_PORT}</span>
                </div>
              );
            })}
            {note === "dup" && (
              <div
                data-row="dup"
                className="grid grid-cols-[1.3fr_1fr_0.7fr_1fr_0.7fr] gap-x-2 items-center border border-destructive/60 bg-destructive/5 px-3 py-2 font-mono text-[11px] text-destructive line-through"
              >
                <span className="font-sans text-[11px] no-underline">নকল, বাতিল</span>
                <span>{FIRST_IP}</span>
                <span>{FIRST_PORT}</span>
                <span>{SERVER_IP}</span>
                <span>{SERVER_PORT}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.p
        key={`${note}-${rows.length}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
        data-count={rows.length}
        data-note={note}
      >
        <span className="font-bold text-foreground">
          Port 443 এ এখন {toBn(rows.length)}টা Connection।{" "}
        </span>
        {messages[note]}
        {full && " ছকটা ভরে গেছে, আবার শুরু করতে ঘোরানো তীরে চাপুন।"}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* Lab 2: তিনটা গেট, কোনটায় আটকাল                                             */
/* ------------------------------------------------------------------------- */

type Source = "local" | "remote";
type Bind = "loopback" | "all";

type Verdict = {
  ok: boolean;
  gate: 0 | 1 | 2 | 3;
  error: string;
  text: string;
};

function judge(source: Source, firewallOpen: boolean, running: boolean, bind: Bind): Verdict {
  if (source === "remote" && !firewallOpen) {
    return {
      ok: false,
      gate: 1,
      error: "Operation timed out (ETIMEDOUT)",
      text: "Firewall Port 3000 এর জন্য আসা সব কিছু চুপচাপ ফেলে দিচ্ছে। কোনো উত্তরই ফেরে না, তাই Client অনেকক্ষণ অপেক্ষা করে হাল ছাড়ে। লক্ষণ হলো লম্বা নীরবতা। App চালু আছে কি নেই, কোথায় Bind করা, এসব প্রশ্ন এখানে ওঠেই না, কারণ অনুরোধ যন্ত্রের ভেতরে ঢুকতেই পারেনি।",
    };
  }
  if (!running) {
    return {
      ok: false,
      gate: 2,
      error: "Connection refused (ECONNREFUSED)",
      text: "অনুরোধ যন্ত্র পর্যন্ত পৌঁছেছে, কিন্তু Port 3000 এ কোনো Program বসে নেই। Kernel সাথে সাথে একটা না উত্তর পাঠিয়ে দেয়। লক্ষণ হলো এক মুহূর্তেই Error। এর মানে যন্ত্রটা জীবিত আর রাস্তা খোলা, শুধু App টা চালু নেই।",
    };
  }
  if (source === "remote" && bind === "loopback") {
    return {
      ok: false,
      gate: 3,
      error: "Connection refused (ECONNREFUSED)",
      text: "এটাই সেই বিখ্যাত ফাঁদ। App চলছে, Firewall খোলা, তবু বাইরে থেকে refused। কারণ App কান পেতেছে শুধু 127.0.0.1 এ, আর অনুরোধ এসেছে Public IP র দরজায়। Kernel এর চোখে ওই দরজার Port 3000 এ কেউ নেই। Server এর ভেতর থেকে curl করলে কিন্তু দিব্যি কাজ করবে, আর এই কারণেই মানুষ ঘণ্টার পর ঘণ্টা Firewall ঘাঁটে।",
    };
  }
  return {
    ok: true,
    gate: 0,
    error: "HTTP 200",
    text:
      source === "local"
        ? "একই যন্ত্রের ভেতর থেকে localhost এ অনুরোধ, তাই Network এর Firewall এর প্রশ্নই নেই, আর 127.0.0.1 আর 0.0.0.0 দুই Bind এই localhost খোলা থাকে। এই কারণেই নিজের যন্ত্রে সব ঠিক দেখায়।"
        : "তিনটা গেটই পার। Firewall Port টা ঢুকতে দিয়েছে, Port এ একটা Program বসে আছে, আর সে সব দরজায় কান পেতেছে।",
  };
}

const GATES = [
  { n: 1, name: "Firewall", q: "Port 3000 কি ঢুকতে দেওয়া?" },
  { n: 2, name: "Process", q: "Port এ কেউ বসে আছে?" },
  { n: 3, name: "Bind Address", q: "এই দরজায় কান পেতেছে?" },
] as const;

export function ReachabilityLab() {
  const reduce = useReducedMotion();
  const [source, setSource] = useState<Source>("remote");
  const [firewallOpen, setFirewallOpen] = useState(true);
  const [running, setRunning] = useState(true);
  const [bind, setBind] = useState<Bind>("loopback");

  const v = judge(source, firewallOpen, running, bind);

  const gateState = (n: 1 | 2 | 3): "pass" | "fail" | "skip" => {
    if (source === "local" && n === 1) return "skip";
    if (v.ok) return "pass";
    if (v.gate === n) return "fail";
    return n < v.gate ? "pass" : "skip";
  };

  return (
    <Panel
      label="Interactive"
      title="App এ পৌঁছানো গেল না, কোন গেটে আটকাল"
      footer="একটা অনুরোধকে App পর্যন্ত পৌঁছাতে তিনটা গেট পার হতে হয়, আর প্রতিটা গেটে আটকালে আলাদা লক্ষণ দেখা যায়। চারটা সুইচ ঘুরিয়ে সব কয়টা মিশ্রণ নিজে বানান। দুইটা জিনিস খুঁজুন। এক, কোন কোন অবস্থায় Server এর ভেতর থেকে সব ঠিক অথচ বাইরে থেকে বন্ধ। দুই, timed out আর refused এর তফাত, কারণ এই দুই শব্দই আপনাকে বলে দেয় কোন গেটে গিয়ে খুঁজতে হবে।"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            অনুরোধ আসছে কোথা থেকে
          </div>
          <div className="flex flex-wrap gap-2">
            <Choice active={source === "local"} onClick={() => setSource("local")} data-source="local">
              Server এর ভেতর থেকে, localhost
            </Choice>
            <Choice active={source === "remote"} onClick={() => setSource("remote")} data-source="remote">
              বাইরে থেকে, Public IP
            </Choice>
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Firewall এ Port 3000
          </div>
          <div className="flex flex-wrap gap-2">
            <Choice active={firewallOpen} onClick={() => setFirewallOpen(true)} data-fw="open">
              খোলা
            </Choice>
            <Choice active={!firewallOpen} onClick={() => setFirewallOpen(false)} data-fw="closed">
              বন্ধ
            </Choice>
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            App এর Process
          </div>
          <div className="flex flex-wrap gap-2">
            <Choice active={running} onClick={() => setRunning(true)} data-proc="up">
              চলছে
            </Choice>
            <Choice active={!running} onClick={() => setRunning(false)} data-proc="down">
              বন্ধ
            </Choice>
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            App কোথায় Bind করেছে
          </div>
          <div className="flex flex-wrap gap-2">
            <Choice active={bind === "loopback"} onClick={() => setBind("loopback")} data-bind="loopback">
              127.0.0.1
            </Choice>
            <Choice active={bind === "all"} onClick={() => setBind("all")} data-bind="all">
              0.0.0.0
            </Choice>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
        {GATES.map((g) => {
          const s = gateState(g.n);
          return (
            <div
              key={g.n}
              data-gate={g.n}
              data-state={s}
              className={cn(
                "border px-3 py-2.5 transition-colors",
                s === "pass" && "border-primary/50 bg-primary/5",
                s === "fail" && "border-destructive/60 bg-destructive/5",
                s === "skip" && "border-border bg-background opacity-50",
              )}
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                গেট {toBn(g.n)}
              </div>
              <div className="text-[12px] font-bold text-foreground">{g.name}</div>
              <div className="text-[10px] text-muted-foreground">{g.q}</div>
              <div
                className={cn(
                  "mt-1 font-mono text-[10px] font-bold",
                  s === "pass" && "text-primary",
                  s === "fail" && "text-destructive",
                  s === "skip" && "text-muted-foreground",
                )}
              >
                {s === "pass" ? "পার" : s === "fail" ? "এখানে আটকাল" : "এ পর্যন্ত আসেইনি"}
              </div>
            </div>
          );
        })}
      </div>

      <motion.div
        key={`${source}-${firewallOpen}-${running}-${bind}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-ok={v.ok ? "yes" : "no"}
        data-error={v.error}
      >
        <div
          className={cn(
            "inline-block font-mono text-[12px] font-bold px-3 py-1.5 border mb-3",
            v.ok ? "border-primary text-primary bg-primary/10" : "border-destructive/60 text-destructive bg-destructive/5",
          )}
        >
          {v.error}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{v.text}</p>
      </motion.div>
    </Panel>
  );
}
