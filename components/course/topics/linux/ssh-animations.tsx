/**
 * What: The interactive labs for Module 07 Lesson 03, SSH and Security Keys. ConnectStepLab
 * walks one ssh command through its five stages for five different situations. KeyPermissionLab
 * lets the reader set the mode of each key file and shows whether the login works and the exact
 * message each side prints. LockoutLab lets the reader apply the first-hour hardening steps in
 * any order and shows which ways into the server are still open.
 *
 * Why: The common SSH failures (a changed host key, a key file that is too open, locking
 * yourself out) are frightening the first time and obvious the second. These labs let the
 * reader cause each failure safely. Every message shown was captured from a real Ubuntu 24.04
 * practice server, with only the two addresses replaced. All state is changed in event
 * handlers and everything else is derived, so no effect ever sets state.
 */
"use client";

import { cn } from "@/lib/utils";
import { Check, Minus, RotateCcw, X } from "lucide-react";
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

function Terminal({ lines }: { lines: string }) {
  return (
    <pre className="mt-2 overflow-x-auto border border-border bg-background px-3 py-2 font-mono text-[0.75rem] leading-relaxed text-foreground whitespace-pre">
      {lines}
    </pre>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. একটা ssh Command এর পাঁচটা ধাপ                                             */
/* ------------------------------------------------------------------------- */

type StepState = "ok" | "ask" | "fail" | "skip";

type StepResult = { state: StepState; terminal?: string; why: string };

type ScenarioId = "known" | "first" | "changed" | "nokey" | "root";

const STEP_TITLES = [
  "TCP Connection",
  "Version আর Key Exchange",
  "Server কে চেনা",
  "আপনাকে চেনা",
  "Shell",
] as const;

const CONNECT: StepResult = {
  state: "ok",
  terminal: "debug1: Connecting to 103.94.135.2 [103.94.135.2] port 22.\ndebug1: Connection established.",
  why: "Module 05 এর Three-way Handshake, Port 22 তে। এখানে SSH এর নিজের কোনো কথা এখনো শুরু হয়নি।",
};

const KEX: StepResult = {
  state: "ok",
  terminal:
    "debug1: Remote protocol version 2.0, remote software version OpenSSH_9.6p1 Ubuntu-3ubuntu13.20\ndebug1: kex: algorithm: sntrup761x25519-sha512@openssh.com",
  why: "দুই পাশ Version জানায়, তারপর Module 06 এর মতো একটা Key Exchange করে একটা গোপন চাবি বানায়। এর পর থেকে সব কথা তালাবন্ধ।",
};

const HOST_KNOWN: StepResult = {
  state: "ok",
  terminal: "debug1: Host '103.94.135.2' is known and matches the ED25519 host key.",
  why: "known_hosts এ এই Server এর Host Key আগে থেকে লেখা ছিল, আর আজকেরটা হুবহু মিলেছে। তাই কোনো প্রশ্ন নেই।",
};

const KEY_OK: StepResult = {
  state: "ok",
  terminal:
    "debug1: Offering public key: /home/you/.ssh/id_ed25519 ED25519 SHA256:iTjwJb0l...ZvJg agent\ndebug1: Server accepts key: /home/you/.ssh/id_ed25519 ED25519 SHA256:iTjwJb0l...ZvJg agent\nAuthenticated to 103.94.135.2 ([103.94.135.2]:22) using \"publickey\".",
  why: "Laptop একটা Public Key দেখাল, Server সেটা deploy এর authorized_keys এ পেল, আর Laptop সই করে প্রমাণ দিল যে Private Key টা তার কাছেই আছে।",
};

const SHELL_OK: StepResult = {
  state: "ok",
  terminal: "deploy@island-vps-01:~$",
  why: "Server আপনার জন্য deploy User হিসেবে একটা bash চালু করল। এখন যা লিখবেন, সেটা Server এ চলবে।",
};

const SKIP: StepResult = { state: "skip", why: "আগের ধাপ পার হয়নি, তাই এই ধাপে পৌঁছানোই হয়নি।" };

const SCENARIOS: Record<
  ScenarioId,
  { label: string; command: string; steps: [StepResult, StepResult, StepResult, StepResult, StepResult] }
> = {
  known: {
    label: "চেনা Server, Key আছে",
    command: "you@laptop:~$ ssh -v deploy@103.94.135.2",
    steps: [CONNECT, KEX, HOST_KNOWN, KEY_OK, SHELL_OK],
  },
  first: {
    label: "এই Server এ প্রথমবার",
    command: "you@laptop:~$ ssh deploy@103.94.135.2",
    steps: [
      CONNECT,
      KEX,
      {
        state: "ask",
        terminal:
          "The authenticity of host '103.94.135.2 (103.94.135.2)' can't be established.\nED25519 key fingerprint is SHA256:h09SOc4FQw2H5l3y0VyxfLEuljJ+lmhKtCghOw+Wo6I.\nThis key is not known by any other names.\nAre you sure you want to continue connecting (yes/no/[fingerprint])? yes\nWarning: Permanently added '103.94.135.2' (ED25519) to the list of known hosts.",
        why: "known_hosts এ এই Server নেই, আর কোনো CA জামিনও নেই। তাই ssh থেমে আপনাকে জিজ্ঞেস করে। yes বলার আগে Provider এর Console এ আসল Fingerprint দেখে মিলিয়ে নিন।",
      },
      KEY_OK,
      SHELL_OK,
    ],
  },
  changed: {
    label: "Server নতুন করে বানানো",
    command: "you@laptop:~$ ssh deploy@103.94.135.2",
    steps: [
      CONNECT,
      KEX,
      {
        state: "fail",
        terminal:
          "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\nIT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!\n...\nHost key verification failed.",
        why: "একই ঠিকানা, কিন্তু Host Key আলাদা। হয় Server নতুন করে বানানো হয়েছে, নয়তো মাঝখানে কেউ বসে আছে। ssh নিজে থেকে কোনোটা ধরে নেয় না, থেমে যায়। আপনার Password বা Key এর সইও তাই কখনো পাঠানো হয় না।",
      },
      SKIP,
      SKIP,
    ],
  },
  nokey: {
    label: "অন্য Laptop, Key নেই",
    command: "you@other-laptop:~$ ssh deploy@103.94.135.2",
    steps: [
      CONNECT,
      KEX,
      HOST_KNOWN,
      {
        state: "fail",
        terminal: "deploy@103.94.135.2: Permission denied (publickey).",
        why: "এই Laptop এ এমন কোনো Private Key নেই যার Public অংশ authorized_keys এ আছে। আর Password Login বন্ধ, Bracket এর ভেতরে publickey ছাড়া আর কিছু লেখা নেই। দরজাটা ঠিক যেমন থাকার কথা, তেমনই বন্ধ।",
      },
      SKIP,
    ],
  },
  root: {
    label: "root হিসেবে চেষ্টা",
    command: "you@laptop:~$ ssh root@103.94.135.2",
    steps: [
      CONNECT,
      KEX,
      HOST_KNOWN,
      {
        state: "fail",
        terminal: "root@103.94.135.2: Permission denied (publickey).",
        why: "Key টা ঠিকই আছে, কিন্তু PermitRootLogin no। Server এর Log এ লেখা হয়: ROOT LOGIN REFUSED FROM 203.0.113.25। root এর কাজ করতে হলে deploy হিসেবে ঢুকে sudo চালান।",
      },
      SKIP,
    ],
  },
};

const SCENARIO_ORDER: ScenarioId[] = ["known", "first", "changed", "nokey", "root"];

function StateBadge({ state }: { state: StepState }) {
  const map = {
    ok: { text: "পার হলো", icon: <Check className="w-3 h-3" />, cls: "border-primary text-primary bg-primary/10" },
    ask: { text: "আপনাকে জিজ্ঞেস করে", icon: <Minus className="w-3 h-3" />, cls: "border-foreground/40 text-foreground" },
    fail: { text: "থেমে গেল", icon: <X className="w-3 h-3" />, cls: "border-foreground text-foreground bg-foreground/10" },
    skip: { text: "পৌঁছায়নি", icon: <Minus className="w-3 h-3" />, cls: "border-border text-muted-foreground" },
  }[state];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 border font-mono text-[0.625rem] font-bold", map.cls)}>
      {map.icon}
      {map.text}
    </span>
  );
}

export function ConnectStepLab() {
  const [scenario, setScenario] = useState<ScenarioId>("known");
  const [shown, setShown] = useState(1);

  const data = SCENARIOS[scenario];
  const lastReal = data.steps.findIndex((s) => s.state === "skip");
  const total = lastReal === -1 ? data.steps.length : lastReal;
  const finished = shown >= total;

  function handleScenario(next: ScenarioId) {
    setScenario(next);
    setShown(1);
  }

  return (
    <Panel
      label="Interactive"
      title="একটা ssh Command, পাঁচটা ধাপ"
      footer="ওপর থেকে একটা অবস্থা বেছে নিন, তারপর পরের ধাপ চাপতে থাকুন। প্রতিটা ধাপে Terminal এ যা আসে, সেটা একটা আসল Ubuntu 24.04 Practice Server থেকে নেওয়া, শুধু ঠিকানা দুইটা বদলানো। খেয়াল করুন, কোথায় থামে তার ওপরই নির্ভর করে কী ঠিক করতে হবে: তৃতীয় ধাপে থামলে সমস্যা Server চেনায়, চতুর্থ ধাপে থামলে সমস্যা আপনাকে চেনায়।"
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {SCENARIO_ORDER.map((id) => (
          <Chip key={id} active={scenario === id} onClick={() => handleScenario(id)}>
            {SCENARIOS[id].label}
          </Chip>
        ))}
      </div>

      <Terminal lines={data.command} />

      <ol className="mt-5 space-y-3">
        {data.steps.map((step, i) => {
          const visible = i < shown || (step.state === "skip" && shown >= total);
          return (
            <li
              key={STEP_TITLES[i]}
              className={cn(
                "border border-border p-4 transition-opacity",
                visible ? "opacity-100" : "opacity-35",
              )}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[0.625rem] font-bold text-primary">0{i + 1}</span>
                <span className="text-[0.8125rem] font-bold text-foreground">{STEP_TITLES[i]}</span>
                {visible && <StateBadge state={step.state} />}
              </div>
              {visible && (
                <>
                  {step.terminal && <Terminal lines={step.terminal} />}
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">{step.why}</p>
                </>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap gap-2 mt-5">
        <button
          onClick={() => setShown((n) => Math.min(n + 1, total))}
          disabled={finished}
          className="px-3 py-1.5 border border-primary bg-primary/10 text-primary text-[0.6875rem] font-bold hover:bg-primary/20 transition-colors disabled:opacity-40"
        >
          পরের ধাপ
        </button>
        <button
          onClick={() => setShown(1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-muted-foreground text-[0.6875rem] font-bold hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          আবার শুরু
        </button>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Permission ঠিক না থাকলে কী হয়                                              */
/* ------------------------------------------------------------------------- */

const PRIVATE_MODES = ["600", "400", "644"] as const;
const DOTSSH_MODES = ["700", "755", "777"] as const;
const AUTH_MODES = ["600", "644", "666"] as const;
const HOME_MODES = ["750", "755", "777"] as const;

type PrivateMode = (typeof PRIVATE_MODES)[number];
type DotSshMode = (typeof DOTSSH_MODES)[number];
type AuthMode = (typeof AUTH_MODES)[number];
type HomeMode = (typeof HOME_MODES)[number];

/** Turns an octal mode such as "640" into the string ls -l prints, such as "-rw-r-----". */
function modeString(mode: string, isDirectory: boolean) {
  const triplet = (digit: number) =>
    (digit & 4 ? "r" : "-") + (digit & 2 ? "w" : "-") + (digit & 1 ? "x" : "-");
  return (isDirectory ? "d" : "-") + mode.split("").map((d) => triplet(Number(d))).join("");
}

type Verdict = { ok: boolean; client: string; server?: string; why: string };

function permissionVerdict(p: PrivateMode, s: DotSshMode, a: AuthMode, h: HomeMode): Verdict {
  if (p === "644") {
    return {
      ok: false,
      client:
        "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\nPermissions 0644 for '/home/you/.ssh/id_ed25519' are too open.\nIt is required that your private key files are NOT accessible by others.\nThis private key will be ignored.\nLoad key \"/home/you/.ssh/id_ed25519\": bad permissions\ndeploy@103.94.135.2: Permission denied (publickey).",
      why: "সমস্যাটা আপনার Laptop এ। Private Key টা অন্যরাও পড়তে পারে, তাই ssh নিজেই সেটা ব্যবহার করতে রাজি নয়। Server পর্যন্ত কোনো Key ই যায়নি, তাই Server এর Log এ বিশেষ কিছু নেই। সমাধান: chmod 600 ~/.ssh/id_ed25519।",
    };
  }
  const denied = "deploy@103.94.135.2: Permission denied (publickey).";
  if (a === "666") {
    return {
      ok: false,
      client: denied,
      server: "sshd[876]: Authentication refused: bad ownership or modes for file /home/deploy/.ssh/authorized_keys",
      why: "authorized_keys এ অন্য যে কেউ লিখতে পারে, মানে যে কেউ নিজের Key ঢুকিয়ে দিতে পারত। sshd তাই ফাইলটা বিশ্বাসই করে না। আপনার Terminal শুধু Permission denied দেখায়, আসল কারণ লেখা থাকে Server এর Log এ।",
    };
  }
  if (s === "777") {
    return {
      ok: false,
      client: denied,
      server: "sshd[891]: Authentication refused: bad ownership or modes for directory /home/deploy/.ssh",
      why: "ফাইলটা ঠিক থাকলেও তার Folder এ যে কেউ লিখতে পারলে কেউ পুরো authorized_keys ফাইলটাই বদলে দিতে পারে। sshd ফাইল থেকে শুরু করে ওপরের প্রতিটা Folder দেখে।",
    };
  }
  if (h === "777") {
    return {
      ok: false,
      client: denied,
      server: "sshd[891]: Authentication refused: bad ownership or modes for directory /home/deploy",
      why: "Home Folder এ যে কেউ লিখতে পারলে কেউ .ssh Folder টাই সরিয়ে নিজেরটা বসাতে পারে। তাই এটাও আটকায়।",
    };
  }
  return {
    ok: true,
    client: "deploy@island-vps-01:~$",
    server:
      "sshd[668]: Accepted publickey for deploy from 203.0.113.25 port 54726 ssh2: ED25519 SHA256:iTjwJb0l...ZvJg",
    why: "কেউ অন্যের ফাইলে লিখতে পারে না, আর Private Key শুধু আপনি পড়তে পারেন। দুই পাশই খুশি।",
  };
}

const RECOMMENDED = { p: "600", s: "700", a: "600", h: "750" } as const;

function ModeRow<T extends string>({
  label,
  path,
  modes,
  value,
  onChange,
  recommended,
}: {
  label: string;
  path: string;
  modes: readonly T[];
  value: T;
  onChange: (next: T) => void;
  recommended: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2 border-b border-border last:border-b-0">
      <span className="w-full md:w-56 text-[0.8125rem] text-foreground">
        {label}
        <span className="block font-mono text-[0.6875rem] text-muted-foreground">{path}</span>
      </span>
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <Chip key={m} active={value === m} onClick={() => onChange(m)}>
            {m}
            {m === recommended ? " ✓" : ""}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export function KeyPermissionLab() {
  const [p, setP] = useState<PrivateMode>("600");
  const [s, setS] = useState<DotSshMode>("700");
  const [a, setA] = useState<AuthMode>("600");
  const [h, setH] = useState<HomeMode>("750");

  const verdict = permissionVerdict(p, s, a, h);
  const listing = [
    "you@laptop:~$ ls -l ~/.ssh/id_ed25519",
    `${modeString(p, false)} 1 you you 444 Oct 31 07:25 /home/you/.ssh/id_ed25519`,
    "deploy@island-vps-01:~$ ls -ld ~ ~/.ssh ~/.ssh/authorized_keys",
    `${modeString(h, true)} 5 deploy deploy 4096 Oct 31 07:30 /home/deploy`,
    `${modeString(s, true)} 2 deploy deploy 4096 Oct 31 07:32 /home/deploy/.ssh`,
    `${modeString(a, false)} 1 deploy deploy   92 Oct 31 07:26 /home/deploy/.ssh/authorized_keys`,
  ].join("\n");

  return (
    <Panel
      label="Interactive"
      title="চারটা Permission, একটা Login"
      footer={
        <>
          প্রতিটা সারিতে একটা Mode বেছে নিন, ✓ চিহ্নটা প্রস্তাবিত মান। নিচে দেখবেন ls -l কী দেখাত, Login হতো কি না, আর দুই পাশের যন্ত্র ঠিক কী লিখত। সব বার্তা Practice Server এ এই Mode গুলো সত্যি বসিয়ে নেওয়া। একটা কথা মনে রাখবেন: Laptop এর Agent এ Key আগে থেকে Load করা থাকলে ssh ফাইলটা আর খোলেই না, তখন প্রথম সতর্কবার্তাটা দেখা নাও যেতে পারে। আর 755 বা 644 এ Login হলেও প্রস্তাবিত মানই রাখুন, কারণ এগুলো অন্যদের পড়তে দেয়, যার দরকার নেই।
        </>
      }
    >
      <div className="mb-5">
        <ModeRow label="Laptop এর Private Key" path="~/.ssh/id_ed25519" modes={PRIVATE_MODES} value={p} onChange={setP} recommended={RECOMMENDED.p} />
        <ModeRow label="Server এ deploy এর Home" path="/home/deploy" modes={HOME_MODES} value={h} onChange={setH} recommended={RECOMMENDED.h} />
        <ModeRow label="Server এ .ssh Folder" path="/home/deploy/.ssh" modes={DOTSSH_MODES} value={s} onChange={setS} recommended={RECOMMENDED.s} />
        <ModeRow label="Server এ authorized_keys" path="/home/deploy/.ssh/authorized_keys" modes={AUTH_MODES} value={a} onChange={setA} recommended={RECOMMENDED.a} />
      </div>

      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">ls -l যা দেখাত</span>
      <Terminal lines={listing} />

      <div className="mt-5 flex items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 border font-mono text-[0.6875rem] font-bold",
            verdict.ok ? "border-primary text-primary bg-primary/10" : "border-foreground text-foreground bg-foreground/10",
          )}
        >
          {verdict.ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
          {verdict.ok ? "Login হলো" : "Login হলো না"}
        </span>
      </div>

      <span className="mt-4 block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
        আপনার Terminal
      </span>
      <Terminal lines={`you@laptop:~$ ssh deploy@103.94.135.2\n${verdict.client}`} />
      {verdict.server && (
        <>
          <span className="mt-4 block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
            Server এর /var/log/auth.log
          </span>
          <Terminal lines={verdict.server} />
        </>
      )}
      <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">{verdict.why}</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. নিজেকে বাইরে আটকে না ফেলে দরজা বন্ধ করা                                     */
/* ------------------------------------------------------------------------- */

type HardeningStep = "providerKey" | "deployCreated" | "keyCopied" | "passwordOff" | "rootOff";

const HARDENING_STEPS: { id: HardeningStep; label: string; detail: string }[] = [
  { id: "providerKey", label: "VPS বানানোর সময় SSH Key দেওয়া", detail: "Provider আপনার Public Key টা root এর authorized_keys এ বসিয়ে দেয়" },
  { id: "deployCreated", label: "deploy User বানানো, sudo সহ", detail: "adduser deploy, তারপর usermod -aG sudo deploy" },
  { id: "keyCopied", label: "deploy এর কাছে Key কপি", detail: "rsync দিয়ে root এর .ssh টা deploy এর Home এ" },
  { id: "passwordOff", label: "PasswordAuthentication no", detail: "Password দিয়ে SSH Login বন্ধ, কারো জন্যই নয়" },
  { id: "rootOff", label: "PermitRootLogin no", detail: "root নামে সরাসরি SSH বন্ধ, Key থাকলেও" },
];

type PathResult = { label: string; open: boolean; mine: boolean };

function loginPaths(on: Record<HardeningStep, boolean>): PathResult[] {
  const keyCopied = on.deployCreated && on.keyCopied;
  return [
    { label: "আপনি, root হিসেবে, Key দিয়ে", open: on.providerKey && !on.rootOff, mine: true },
    { label: "আপনি, root হিসেবে, Provider এর দেওয়া Password দিয়ে", open: !on.providerKey && !on.passwordOff && !on.rootOff, mine: true },
    { label: "আপনি, deploy হিসেবে, Key দিয়ে", open: keyCopied, mine: true },
    { label: "আপনি, deploy হিসেবে, Password দিয়ে", open: on.deployCreated && !on.passwordOff, mine: true },
    { label: "Internet এর Bot, Password অনুমান করে", open: !on.passwordOff && (on.deployCreated || !on.providerKey), mine: false },
  ];
}

export function LockoutLab() {
  const [on, setOn] = useState<Record<HardeningStep, boolean>>({
    providerKey: true,
    deployCreated: false,
    keyCopied: false,
    passwordOff: false,
    rootOff: false,
  });

  const paths = loginPaths(on);
  const mineOpen = paths.filter((p) => p.mine && p.open);
  const botOpen = paths.some((p) => !p.mine && p.open);
  const lockedOut = mineOpen.length === 0;
  const hardened = !lockedOut && on.deployCreated && on.keyCopied && on.passwordOff && on.rootOff && on.providerKey;

  function toggle(id: HardeningStep) {
    setOn((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const verdict = lockedOut
    ? {
        title: "Locked out",
        text: "আপনার নিজের ঢোকার আর কোনো পথ খোলা নেই। এই অবস্থায় যে Session টা খোলা আছে সেটা বন্ধ করলে ফেরার উপায় শুধু Provider এর Web Console। দেখুন কোন ধাপটা আগে হওয়ার কথা ছিল।",
      }
    : hardened
      ? {
          title: "দরজা বন্ধ, আর আপনি ভেতরে",
          text: "ঢোকার পথ এখন একটাই: deploy, Key দিয়ে। root নামে কেউ সরাসরি আসতে পারে না, আর Password অনুমান করার কিছু নেই।",
        }
      : {
          title: "এখনো কাজ চলছে",
          text: botOpen
            ? "আপনি ঢুকতে পারছেন, কিন্তু Password দিয়ে Login এখনো খোলা, তাই Bot রা অনুমান চালিয়ে যেতে পারে। বাকি ধাপগুলো শেষ করুন।"
            : "আপনি ঢুকতে পারছেন, আর এই মুহূর্তে অনুমান করে ঢোকার মতো কোনো Password খোলা নেই। তবে কাজ শেষ হয়নি, বাঁ দিকের বাকি ধাপগুলো দেখুন।",
        };

  return (
    <Panel
      label="Interactive"
      title="প্রথম ঘণ্টা: দরজা বন্ধ করুন, নিজেকে বাইরে না রেখে"
      footer="বাঁ দিকের ধাপগুলো যেকোনো ক্রমে চালু বা বন্ধ করুন। ডান দিকে দেখবেন এই মুহূর্তে Server এ ঢোকার কোন কোন পথ খোলা। একবার ইচ্ছা করে ভুল ক্রমে চেষ্টা করুন: deploy এর কাছে Key কপি না করেই PermitRootLogin no আর PasswordAuthentication no চালু করুন। ঠিক এই ভুলটাই নতুন VPS এ সবচেয়ে বেশি মানুষকে বাইরে আটকে দেয়।"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="block mb-3 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">ধাপগুলো</span>
          <ul className="space-y-2">
            {HARDENING_STEPS.map((step) => (
              <li key={step.id}>
                <button
                  onClick={() => toggle(step.id)}
                  aria-pressed={on[step.id]}
                  className={cn(
                    "w-full text-left border px-3 py-2 transition-colors",
                    on[step.id] ? "border-primary bg-primary/10" : "border-border hover:border-primary/40",
                  )}
                >
                  <span className="flex items-center gap-2 text-[0.8125rem] font-bold text-foreground">
                    <span
                      className={cn(
                        "inline-flex w-4 h-4 items-center justify-center border",
                        on[step.id] ? "border-primary text-primary" : "border-border",
                      )}
                    >
                      {on[step.id] && <Check className="w-3 h-3" />}
                    </span>
                    {step.label}
                  </span>
                  <span className="block mt-1 pl-6 text-[0.75rem] text-muted-foreground">{step.detail}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="block mb-3 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">ঢোকার পথ</span>
          <ul className="space-y-2">
            {paths.map((path) => (
              <li key={path.label} className="flex items-center justify-between gap-3 border border-border px-3 py-2">
                <span className="text-[0.8125rem] text-foreground">{path.label}</span>
                <span
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1 px-2 py-0.5 border font-mono text-[0.625rem] font-bold",
                    path.open
                      ? path.mine
                        ? "border-primary text-primary bg-primary/10"
                        : "border-foreground text-foreground bg-foreground/10"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {path.open ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {path.open ? "খোলা" : "বন্ধ"}
                </span>
              </li>
            ))}
          </ul>

          <div
            className={cn(
              "mt-4 border p-4",
              lockedOut ? "border-foreground bg-foreground/5" : hardened ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            <span className={cn("block text-[0.875rem] font-bold", hardened ? "text-primary" : "text-foreground")}>
              {verdict.title}
            </span>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">{verdict.text}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
