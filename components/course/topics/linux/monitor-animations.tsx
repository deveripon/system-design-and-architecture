/**
 * What: The interactive labs for Module 07 Lesson 08, Monitoring Tools. LoadAverageLab lets
 * the reader change the number of cores and of busy processes and watch the load average and
 * its verdict change. CpuLineLab shows the %Cpu(s) line of top for six situations and says
 * which field gives each one away. TriageLab walks a symptom (slow site, full disk, an app that
 * restarts by itself, a sluggish SSH login) through the checks in order.
 *
 * Why: Load and the CPU line are the two numbers beginners misread most. Reading them right
 * comes from seeing the same number mean different things on different machines, which a
 * sentence cannot do but a toggle can. Every visual is derived straight from state in event
 * handlers, never from an effect, so nothing is set while rendering.
 */
"use client";

import { cn } from "@/lib/utils";
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

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1 w-full sm:w-auto">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Load average: একই সংখ্যা, আলাদা যন্ত্রে আলাদা মানে                          */
/* ------------------------------------------------------------------------- */

const CORE_CHOICES = [1, 2, 4] as const;
const WANT_CHOICES = [0, 1, 2, 3, 4, 6, 8] as const;
const BLOCKED_CHOICES = [0, 1, 2] as const;

type Verdict = { level: string; text: string };

function loadVerdict(perCore: number, idleCores: number, blocked: number): Verdict {
  if (blocked > 0 && idleCores > 0) {
    return {
      level: "Disk দেখুন",
      text: "CPU এর কিছু Core বসে আছে, তবু Load শূন্য নয়। বাড়তি সংখ্যাটা আসছে D State এর Process থেকে, যারা Disk এর উত্তরের অপেক্ষায়। এখানে CPU কিনে লাভ নেই। top এর wa আর iostat দেখুন।",
    };
  }
  if (perCore < 0.7) {
    return {
      level: "শান্ত",
      text: "প্রতি Core এ কাজ একের অনেক কম। কেউ লাইনে দাঁড়িয়ে নেই, Server আরাম করছে।",
    };
  }
  if (perCore <= 1) {
    return {
      level: "ব্যস্ত, তবে ঠিক আছে",
      text: "Core গুলো প্রায় পুরো সময় কাজ করছে, কিন্তু লাইন জমেনি। ভিড় আরেকটু বাড়লেই অপেক্ষা শুরু হবে, তাই চোখ রাখুন।",
    };
  }
  if (perCore < 2) {
    return {
      level: "লাইন জমছে",
      text: "Core এর চেয়ে বেশি কাজ CPU চাইছে। কিছু Process অপেক্ষা করছে, তাই Request গুলো ধীর হবে। কিছুক্ষণের জন্য হলে চলে, ১৫ মিনিটের গড়েও এমন থাকলে কারণ খুঁজুন।",
    };
  }
  return {
    level: "Overloaded",
    text: "প্রতিটা Core এর সামনে একাধিক Process দাঁড়িয়ে। পর্যটকেরা ধীরগতি টের পাচ্ছেন, SSH এ ঢুকতেও দেরি হতে পারে। এখনই top খুলে দেখুন কে এত চাইছে।",
  };
}

function Cell({ filled, dashed, label }: { filled?: boolean; dashed?: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center h-8 min-w-[3.5rem] px-2 border font-mono text-[0.625rem] font-bold",
        filled && "border-primary bg-primary/15 text-primary",
        !filled && !dashed && "border-border text-muted-foreground",
        dashed && "border-dashed border-border text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

export function LoadAverageLab() {
  const [cores, setCores] = useState<(typeof CORE_CHOICES)[number]>(2);
  const [want, setWant] = useState<(typeof WANT_CHOICES)[number]>(3);
  const [blocked, setBlocked] = useState<(typeof BLOCKED_CHOICES)[number]>(0);

  const onCpu = Math.min(want, cores);
  const waiting = want - onCpu;
  const idleCores = cores - onCpu;
  const load = want + blocked;
  const perCore = load / cores;
  const verdict = loadVerdict(perCore, idleCores, blocked);

  return (
    <Panel
      label="Lab: Load Average"
      title="Core আর Process বদলে দেখুন"
      footer="এই Lab এক মুহূর্তের ছবি দেখায়। আসল load average এই গোনাটারই ১, ৫ আর ১৫ মিনিটের চলমান গড়। তাই হঠাৎ এক সেকেন্ডের ভিড় প্রথম সংখ্যাটা একটু নাড়ায়, তৃতীয়টা প্রায় নাড়ায়ই না।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <RowLabel>vCPU</RowLabel>
        {CORE_CHOICES.map((c) => (
          <Chip key={c} active={cores === c} onClick={() => setCores(c)}>
            {c} Core
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <RowLabel>CPU চাইছে</RowLabel>
        {WANT_CHOICES.map((n) => (
          <Chip key={n} active={want === n} onClick={() => setWant(n)}>
            {n}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <RowLabel>Disk এ আটকে (D)</RowLabel>
        {BLOCKED_CHOICES.map((n) => (
          <Chip key={n} active={blocked === n} onClick={() => setBlocked(n)}>
            {n}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="border border-border bg-background px-4 py-3 min-w-0">
          <div className="text-[0.625rem] text-muted-foreground mb-2">CPU তে চলছে</div>
          <div className="flex flex-wrap gap-1.5" data-on-cpu={onCpu}>
            {Array.from({ length: cores }, (_, i) => (
              <Cell key={i} filled={i < onCpu} label={i < onCpu ? `CPU ${i}` : "ফাঁকা"} />
            ))}
          </div>
        </div>
        <div className="border border-border bg-background px-4 py-3 min-w-0">
          <div className="text-[0.625rem] text-muted-foreground mb-2">লাইনে দাঁড়িয়ে (R)</div>
          <div className="flex flex-wrap gap-1.5 min-h-8" data-waiting={waiting}>
            {waiting === 0 ? (
              <span className="text-[0.75rem] text-muted-foreground">কেউ নেই</span>
            ) : (
              Array.from({ length: waiting }, (_, i) => <Cell key={i} label="অপেক্ষা" />)
            )}
          </div>
        </div>
        <div className="border border-border bg-background px-4 py-3 min-w-0">
          <div className="text-[0.625rem] text-muted-foreground mb-2">Disk এর অপেক্ষায় (D)</div>
          <div className="flex flex-wrap gap-1.5 min-h-8">
            {blocked === 0 ? (
              <span className="text-[0.75rem] text-muted-foreground">কেউ নেই</span>
            ) : (
              Array.from({ length: blocked }, (_, i) => <Cell key={i} dashed label="Disk" />)
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="border border-border bg-background px-4 py-3">
          <div className="text-[0.625rem] text-muted-foreground mb-1">Load</div>
          <div className="font-mono text-[1.25rem] font-bold text-primary" data-load={load}>
            {load.toFixed(2)}
          </div>
        </div>
        <div className="border border-border bg-background px-4 py-3">
          <div className="text-[0.625rem] text-muted-foreground mb-1">প্রতি Core এ</div>
          <div className="font-mono text-[1.25rem] font-bold text-foreground" data-per-core={perCore.toFixed(2)}>
            {perCore.toFixed(2)}
          </div>
        </div>
        <div className="border border-primary/40 bg-primary/5 px-4 py-3">
          <div className="text-[0.625rem] text-muted-foreground mb-1">রায়</div>
          <div className="font-mono text-[1rem] font-bold text-primary" data-verdict={verdict.level}>
            {verdict.level}
          </div>
        </div>
      </div>
      <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{verdict.text}</p>
      <p className="text-[0.8125rem] text-muted-foreground leading-relaxed mt-3">
        একটা পরীক্ষা করুন: CPU চাইছে 4 রেখে Core 1 থেকে 4 এ নিয়ে যান। Load একই 4.00 থাকে, কিন্তু রায় Overloaded থেকে
        ব্যস্ত হয়ে যায়। এজন্যই Load এর পাশে সবসময় <code>nproc</code> এর উত্তরটা মনে রাখতে হয়।
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. %Cpu(s) লাইন: কোন ঘরটা গল্প বলছে                                        */
/* ------------------------------------------------------------------------- */

const CPU_FIELDS = ["us", "sy", "ni", "id", "wa", "hi", "si", "st"] as const;
type CpuField = (typeof CPU_FIELDS)[number];

const FIELD_NAMES: Record<CpuField, string> = {
  us: "User, আপনার Program এর নিজের কাজ",
  sy: "System, Kernel এর কাজ",
  ni: "Nice, নিচু অগ্রাধিকারের কাজ",
  id: "Idle, বসে থাকা",
  wa: "I/O wait, Disk এর অপেক্ষা",
  hi: "Hardware interrupt",
  si: "Software interrupt, বেশিরভাগ Network",
  st: "Steal, পাশের VM নিয়ে গেছে",
};

type CpuScenario = {
  id: string;
  label: string;
  captured: boolean;
  values: Record<CpuField, number>;
  focus: CpuField;
  meaning: string;
  next: string;
};

const CPU_SCENARIOS: CpuScenario[] = [
  {
    id: "report",
    label: "ভারী Report",
    captured: true,
    values: { us: 51.2, sy: 4.7, ni: 0, id: 41.9, wa: 0, hi: 0, si: 2.3, st: 0 },
    focus: "us",
    meaning:
      "us বড় মানে CPU এর সময় যাচ্ছে Program এর নিজের হিসাবে, এখানে Node এর Report বানানোয়। id এখনো 41.9, কারণ Node এর মূল কাজ এক Thread এ চলে, চারটা Core এর একটা পুরো ভরা আর বাকিরা প্রায় ফাঁকা।",
    next: "top এ P চাপুন, কে সবার উপরে দেখুন। তারপর 1 চাপুন, প্রতিটা Core আলাদা দেখবেন, একটা 100 আর বাকিরা কম।",
  },
  {
    id: "backup",
    label: "Backup লিখছে",
    captured: false,
    values: { us: 3.1, sy: 6.0, ni: 0, id: 52.4, wa: 38.2, hi: 0, si: 0.3, st: 0 },
    focus: "wa",
    meaning:
      "wa বড় মানে CPU এর হাতে কাজ নেই, সে বসে আছে Disk এর উত্তরের অপেক্ষায়। CPU কে দোষ দেওয়ার কিছু নেই, ধীর হলো Disk। এমন সময়ে Load ও বাড়ে, কারণ অপেক্ষারত Process গুলো D State এ গোনা হয়।",
    next: "vmstat 1 চালিয়ে b কলাম দেখুন, তারপর iostat -xz 1 দিয়ে কোন Disk কতটা ব্যস্ত দেখুন।",
  },
  {
    id: "steal",
    label: "পাশের VM এর ভিড়",
    captured: false,
    values: { us: 18.0, sy: 4.0, ni: 0, id: 40.0, wa: 0.2, hi: 0, si: 0.3, st: 37.5 },
    focus: "st",
    meaning:
      "st বড় মানে আপনার VPS এর vCPU তার পালা পায়নি, Hypervisor সেই সময় একই Physical যন্ত্রের অন্য কোনো VM কে দিয়েছে। আপনার Code এ কোনো দোষ নেই, অথচ সব ধীর।",
    next: "কয়েক ঘণ্টা ধরে st 5 থেকে 10 এর উপরে থাকলে Provider কে জানান, অথবা ভালো Plan বা অন্য যন্ত্রে সরান।",
  },
  {
    id: "kernel",
    label: "হাজারো ছোট Request",
    captured: false,
    values: { us: 14.0, sy: 31.0, ni: 0, id: 44.5, wa: 0.5, hi: 0, si: 10.0, st: 0 },
    focus: "sy",
    meaning:
      "sy আর si একসাথে বড় মানে Kernel খুব ব্যস্ত, অসংখ্য ছোট Network Packet আর System Call সামলাতে। যেমন হঠাৎ অনেক নতুন Connection, অথবা কোনো Bot এর একটানা ছোট Request।",
    next: "ss -s দিয়ে Connection গুনুন, Caddy এর Access Log এ দেখুন কারা আসছে (লেসন ০৭), দরকার হলে Rate Limit।",
  },
  {
    id: "nice",
    label: "নিচু অগ্রাধিকারের কাজ",
    captured: false,
    values: { us: 6.0, sy: 2.0, ni: 58.0, id: 34.0, wa: 0, hi: 0, si: 0, st: 0 },
    focus: "ni",
    meaning:
      "ni বড় মানে CPU খাচ্ছে এমন কাজ যাকে ইচ্ছা করে নিচু অগ্রাধিকার দেওয়া হয়েছে, যেমন nice দিয়ে চালানো ছবি ছোট করার কাজ। আসল App দরকার হলেই আগে CPU পাবে, তাই এটা সাধারণত দুশ্চিন্তার নয়।",
    next: "top এর NI কলামে ধনাত্মক সংখ্যা খুঁজুন। দীর্ঘ Batch কাজ এভাবেই চালানো ভালো অভ্যাস।",
  },
  {
    id: "quiet",
    label: "শান্ত রাত",
    captured: false,
    values: { us: 1.3, sy: 0.7, ni: 0, id: 97.9, wa: 0.1, hi: 0, si: 0, st: 0 },
    focus: "id",
    meaning:
      "id প্রায় 100 মানে CPU বসে আছে। এই অবস্থায় সাইট ধীর হলে সমস্যা CPU তে নয়। Memory, Disk, Network, অথবা App অন্য কোনো Server এর উত্তরের অপেক্ষায় আছে কি না, সেদিকে তাকান।",
    next: "free -h, df -h দেখুন। কিছু না পেলে লেসন ০৯ এর Network Debugging।",
  },
];

export function CpuLineLab() {
  const [id, setId] = useState(CPU_SCENARIOS[0].id);
  const scenario = CPU_SCENARIOS.find((s) => s.id === id) ?? CPU_SCENARIOS[0];

  return (
    <Panel
      label="Lab: %Cpu(s) লাইন"
      title="একটা পরিস্থিতি বেছে নিন"
      footer="শুধু ভারী Report এর লাইনটা লেসনের অনুশীলনের Server এ ধরা আসল Output। বাকি পাঁচটা সেই পরিস্থিতির সাধারণ চেহারা দেখাতে সাজানো সংখ্যা, আপনার Server এ ঠিক এই সংখ্যা আসবে না, কিন্তু কোন ঘর বড় হয় সেটা এমনই থাকবে।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {CPU_SCENARIOS.map((s) => (
          <Chip key={s.id} active={s.id === id} onClick={() => setId(s.id)}>
            {s.label}
          </Chip>
        ))}
      </div>

      <div className="border border-border bg-background px-4 py-3 mb-4 overflow-x-auto">
        <div className="font-mono text-[0.75rem] whitespace-pre text-foreground" data-scenario={scenario.id}>
          <span className="text-muted-foreground">%Cpu(s):</span>
          {CPU_FIELDS.map((f, i) => (
            <span key={f}>
              {" "}
              <span
                className={cn(
                  f === scenario.focus && "bg-primary/15 text-primary font-bold outline outline-1 outline-primary/60",
                )}
              >
                {scenario.values[f].toFixed(1).padStart(4, " ")} {f}
              </span>
              {i < CPU_FIELDS.length - 1 ? "," : ""}
            </span>
          ))}
        </div>
      </div>

      <div className="flex h-5 w-full overflow-hidden border border-border mb-2" aria-hidden>
        {CPU_FIELDS.map((f) =>
          scenario.values[f] > 0 ? (
            <div
              key={f}
              style={{ width: `${scenario.values[f]}%` }}
              className={cn(
                "h-full border-r border-background last:border-r-0",
                f === scenario.focus ? "bg-primary/70" : f === "id" ? "bg-muted" : "bg-muted-foreground/40",
              )}
              title={f}
            />
          ) : null,
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5">
        {CPU_FIELDS.map((f) => (
          <span key={f} className={cn("text-[0.6875rem]", f === scenario.focus ? "text-primary font-bold" : "text-muted-foreground")}>
            <span className="font-mono">{f}</span> {FIELD_NAMES[f]}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-border bg-background px-4 py-3">
          <div className="text-[0.625rem] text-muted-foreground mb-1">
            কী বলছে {scenario.captured ? "(আসল Output)" : "(সাজানো উদাহরণ)"}
          </div>
          <p className="text-[0.8125rem] text-foreground leading-relaxed">{scenario.meaning}</p>
        </div>
        <div className="border border-primary/40 bg-primary/5 px-4 py-3">
          <div className="text-[0.625rem] text-muted-foreground mb-1">এরপর কী চালাবেন</div>
          <p className="text-[0.8125rem] text-foreground leading-relaxed">{scenario.next}</p>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. লক্ষণ থেকে কারণ: কোন ক্রমে কী দেখবেন                                     */
/* ------------------------------------------------------------------------- */

type Check = { command: string; look: string; worry: string };

type Symptom = {
  id: string;
  label: string;
  intro: string;
  checks: Check[];
  causes: string;
};

const SYMPTOMS: Symptom[] = [
  {
    id: "slow",
    label: "সাইট ধীর",
    intro: "পর্যটকেরা বলছেন পাতা খুলতে দেরি হচ্ছে। প্রথমে বুঝতে হবে Server নিজে হাঁপাচ্ছে কি না।",
    checks: [
      { command: "nproc; uptime", look: "Load কে Core সংখ্যা দিয়ে ভাগ করুন", worry: "১৫ মিনিটের গড়েও প্রতি Core এ 1 এর বেশি" },
      { command: "top", look: "%Cpu(s) লাইনের কোন ঘর বড়: us, wa, নাকি st", worry: "id প্রায় 0, অথবা wa বা st 10 এর বেশি" },
      { command: "top, তারপর P আর M", look: "কোন Process সবচেয়ে বেশি CPU আর Memory নিচ্ছে", worry: "একটা Process একাই একটা Core পুরো ভরিয়ে রেখেছে" },
      { command: "free -h; vmstat 1 5", look: "available কত, আর si, so কলাম শূন্য কি না", worry: "available মোট এর 10% এর নিচে, si বা so একটানা শূন্যের উপরে" },
      { command: "iostat -xz 1 3", look: "Disk এর w_await আর %util", worry: "await অনেক বেশি আর %util প্রায় 100 একটানা" },
    ],
    causes: "সাধারণ কারণ: একটা ভারী Endpoint যা CPU আটকে রাখে, Memory ফুরিয়ে Swap এ নামা, Backup চলার সময় Disk এর ভিড়, অথবা Provider এর পাশের VM। কিছুই না মিললে Server সুস্থ, তখন সমস্যা Network এ বা অন্য Server এর উত্তরে (লেসন ০৯)।",
  },
  {
    id: "full",
    label: "No space left on device",
    intro: "App এর Log এ এই Error, অথবা Deploy আটকে গেছে। Disk ভরে গেছে, এখন খুঁজতে হবে কে ভরাল।",
    checks: [
      { command: "df -h", look: "কোন Filesystem এর Use% বেশি", worry: "Use% 90 এর উপরে, বা 100" },
      { command: "df -i", look: "Inode এর IUse%", worry: "জায়গা আছে অথচ IUse% 100: লাখো ছোট File" },
      { command: "sudo du -xh --max-depth=1 / | sort -h", look: "কোন Folder সবচেয়ে বড়, তারপর তার ভেতরে নামুন", worry: "/var/log, /var/backups, /var/lib/docker হঠাৎ বড়" },
      { command: "sudo find / -xdev -type f -size +100M -exec ls -lh {} +", look: "বড় একক File গুলো", worry: "পুরনো Backup বা Dump যা কেউ মোছেনি" },
      { command: "sudo lsof +L1", look: "মুছে ফেলা অথচ খোলা File", worry: "df বলে ভরা, du খুঁজে পায় না" },
      { command: "journalctl --disk-usage", look: "Journal কত জায়গা নিয়েছে", worry: "কয়েক GB, সীমা বসানো নেই (লেসন ০৭)" },
    ],
    causes: "সাধারণ কারণ: Log যার কোনো সীমা নেই, প্রতি রাতের Backup যা কেউ মোছে না, Docker এর পুরনো Image, আর মুছে ফেলা Log যা কোনো Process তখনো খুলে রেখেছে।",
  },
  {
    id: "restart",
    label: "App নিজে নিজে Restart হচ্ছে",
    intro: "পর্যটকেরা মাঝে মাঝে Error পান, আর systemctl status এ দেখা যায় App কিছুক্ষণ আগে নতুন করে চালু হয়েছে।",
    checks: [
      { command: "systemctl status my-tours-api", look: "Active লাইন আর Result", worry: "Result: oom-kill, অথবা restart counter বাড়ছে" },
      { command: "journalctl -u my-tours-api -n 50", look: "মরার ঠিক আগের লাইনগুলো", worry: "killed by the OOM killer, status=9/KILL (লেসন ০৭)" },
      { command: "top, তারপর M", look: "App এর RES সময়ের সাথে বাড়ছে কি না", worry: "RES থামে না, বাড়তেই থাকে: Memory Leak" },
      { command: "free -h", look: "পুরো Server এর available আর Swap", worry: "available প্রায় শেষ, Swap নেই বা ভরা" },
    ],
    causes: "সাধারণ কারণ: App এর Memory Leak, একসাথে খুব বড় Data Memory তে তোলা, ছোট VPS এ Swap না থাকা। সমাধান Code এ, তবে Swap যোগ করা আর Service এ MemoryMax বসানো বাকি Server কে রক্ষা করে।",
  },
  {
    id: "ssh",
    label: "SSH এ ঢুকতেও দেরি",
    intro: "Prompt আসতে কয়েক সেকেন্ড, টাইপ করলে অক্ষর দেরিতে আসে। Server এর নিজেরই দম ফুরিয়েছে।",
    checks: [
      { command: "uptime", look: "Load কত বড়", worry: "Core সংখ্যার কয়েকগুণ" },
      { command: "vmstat 1 5", look: "r, b, si, so আর wa", worry: "si আর so একটানা বড়: Swap এ ঘুরপাক, Thrashing" },
      { command: "df -h /", look: "Root Filesystem", worry: "100%, তখন অনেক কিছুই লিখতে পারে না" },
      { command: "top", look: "st কলাম আর সবচেয়ে বড় Process", worry: "st বেশি, অথবা একটা Process সব Memory নিয়ে নিয়েছে" },
    ],
    causes: "সাধারণ কারণ: Memory শেষ হয়ে Swap এ টানাটানি, Disk পুরো ভরা, অথবা পাশের VM এর ভিড়। খুব খারাপ অবস্থায় SSH এ ঢোকাই না গেলে Provider এর Web Console থেকে ঢুকে সবচেয়ে বড় Process টা থামান।",
  },
];

export function TriageLab() {
  const [id, setId] = useState(SYMPTOMS[0].id);
  const [shown, setShown] = useState(1);
  const symptom = SYMPTOMS.find((s) => s.id === id) ?? SYMPTOMS[0];
  const done = shown >= symptom.checks.length;

  function choose(next: string) {
    setId(next);
    setShown(1);
  }

  return (
    <Panel
      label="Lab: লক্ষণ থেকে কারণ"
      title="একটা লক্ষণ বেছে নিন, তারপর ধাপে ধাপে এগোন"
      footer="সীমার সংখ্যাগুলো অভিজ্ঞতা থেকে আসা আন্দাজ, আইন নয়। নিজের Server এর স্বাভাবিক দিনের সংখ্যা জানা থাকলে সেটার সাথে তুলনাই সবচেয়ে ভালো মাপকাঠি।"
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {SYMPTOMS.map((s) => (
          <Chip key={s.id} active={s.id === id} onClick={() => choose(s.id)}>
            {s.label}
          </Chip>
        ))}
      </div>
      <p className="text-[0.8125rem] text-muted-foreground leading-relaxed mb-5">{symptom.intro}</p>

      <ol className="space-y-2 mb-5" data-symptom={symptom.id} data-shown={shown}>
        {symptom.checks.slice(0, shown).map((check, i) => (
          <li key={check.command} className="border border-border bg-background px-4 py-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1.5">
              <span className="font-mono text-[0.625rem] text-primary font-bold">ধাপ {i + 1}</span>
              <code className="font-mono text-[0.75rem] text-foreground break-all">{check.command}</code>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                <span className="text-foreground font-bold">দেখুন: </span>
                {check.look}
              </p>
              <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                <span className="text-primary font-bold">চিন্তার কারণ: </span>
                {check.worry}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setShown((n) => Math.min(n + 1, symptom.checks.length))}
          disabled={done}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-primary bg-primary/10 text-primary text-[0.6875rem] font-bold hover:bg-primary/20 transition-colors disabled:opacity-40"
        >
          পরের ধাপ <ChevronRight className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => setShown(1)}
          aria-label="প্রথম ধাপে ফিরুন"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[0.625rem] text-muted-foreground">
          {shown} / {symptom.checks.length}
        </span>
      </div>

      <p className={cn("text-[0.8125rem] leading-relaxed transition-opacity", done ? "opacity-100 text-foreground" : "opacity-30 text-muted-foreground")}>
        {symptom.causes}
      </p>
    </Panel>
  );
}
