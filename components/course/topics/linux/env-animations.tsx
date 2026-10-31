/**
 * What: The interactive labs for Module 07 Lesson 05, Environment Variables. ExportLab shows what a
 * child process sees as the reader flips export, changes the parent and lets the child change its
 * own copy. PathLookupLab walks PATH folder by folder for a chosen command. StartContextLab shows
 * which startup files each way of starting a process reads. EnvFileDialectLab shows how bash,
 * systemd, Node and Next.js each read the same tricky .env line.
 *
 * Why: These rules are easy to state and easy to forget, and the reader learns them fastest by
 * changing one input and watching the answer move. The data in StartContextLab and
 * EnvFileDialectLab was captured on an Ubuntu 24.04 practice server and Node 25, not written from
 * memory. Every value is derived from state in render, never synced in an effect.
 */
"use client";

import { cn } from "@/lib/utils";
import { Check, Minus, X } from "lucide-react";
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

function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "flex items-center gap-2 px-3 py-2 border text-[0.75rem] text-left transition-colors",
        on ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/40",
      )}
    >
      <span
        className={cn(
          "w-4 h-4 border flex items-center justify-center shrink-0",
          on ? "border-primary bg-primary text-primary-foreground" : "border-border",
        )}
      >
        {on && <Check className="w-3 h-3" />}
      </span>
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. export করলে Child কী পায়                                                 */
/* ------------------------------------------------------------------------- */

export function ExportLab() {
  const [exported, setExported] = useState(false);
  const [parentChanged, setParentChanged] = useState(false);
  const [childSets, setChildSets] = useState(false);

  const parentNow = parentChanged ? "4000" : "3000";
  const childSees = childSets ? "9999" : exported ? "3000" : null;
  const newChildSees = exported ? parentNow : null;

  const explanation = childSets
    ? "Child নিজের কপিতে PORT=9999 লিখল। তাতে শুধু তার নিজের কপি বদলাল, Parent এর মান যেমন ছিল তেমনই আছে। উল্টো দিকে কিছু যাওয়ার কোনো পথই নেই।"
    : !exported
      ? "PORT এখনো শুধু bash এর নিজের খাতায়, একটা Shell Variable। Child চালু হওয়ার সময় যে কপি পায়, তাতে শুধু export করা নামগুলো থাকে, তাই node দেখে undefined।"
      : parentChanged
        ? "Child চালু হয়েছিল যখন PORT ছিল 3000, তখনই কপি হয়ে গেছে। পরে Parent এ 4000 লিখলেও চলমান Child এর কপি বদলায় না। নতুন একটা Child চালু করলে সে অবশ্য 4000 পাবে।"
        : "export করা হয়েছে, তাই Child চালু হওয়ার মুহূর্তে PORT=3000 তার কপিতে চলে গেল।";

  return (
    <Panel
      label="Interactive"
      title="Parent এর কোন মান Child দেখে"
      footer="এখানে Parent হলো আপনার bash, Child হলো তার চালানো node server.mjs। শুরুতে bash এ লেখা হয়েছে PORT=3000। তিনটা সুইচ একটা একটা করে বদলান আর দেখুন কোন কাজে Child এর মান বদলায়, কোনটায় বদলায় না। লেসনের Lab এর ১ নম্বর Script ঠিক এই পরীক্ষাগুলোই আসল যন্ত্রে চালায়।"
    >
      <div className="grid gap-2 sm:grid-cols-3 mb-6">
        <Toggle on={exported} onClick={() => setExported((v) => !v)} label="bash এ export PORT চালানো হলো" />
        <Toggle on={parentChanged} onClick={() => setParentChanged((v) => !v)} label="Child চালুর পরে bash এ PORT=4000" />
        <Toggle on={childSets} onClick={() => setChildSets((v) => !v)} label="Child নিজে PORT=9999 বসাল" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <ValueCard heading="Parent, bash" value={parentNow} note={exported ? "Environment এ, export করা" : "শুধু Shell Variable"} />
        <ValueCard heading="চলমান Child, node" value={childSees} note="চালুর সময় পাওয়া কপি" accent />
        <ValueCard heading="এখন নতুন একটা Child চালালে" value={newChildSees} note="Parent এর এখনকার কপি" />
      </div>

      <p className="mt-5 text-[0.8125rem] leading-relaxed text-foreground">{explanation}</p>
    </Panel>
  );
}

function ValueCard({
  heading,
  value,
  note,
  accent,
}: {
  heading: string;
  value: string | null;
  note: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("border p-4", accent ? "border-primary/60 bg-primary/5" : "border-border")}>
      <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">{heading}</div>
      <div className={cn("font-mono text-[0.9375rem] font-bold", value ? "text-foreground" : "text-muted-foreground")}>
        PORT = {value ?? "undefined"}
      </div>
      <div className="mt-1 text-[0.6875rem] text-muted-foreground">{note}</div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. PATH ধরে খোঁজা                                                            */
/* ------------------------------------------------------------------------- */

const NVM_BIN = "/home/deploy/.nvm/versions/node/v22.11.0/bin";

const FILES: Record<string, Record<string, string>> = {
  [NVM_BIN]: { node: "node v22.11.0, nvm দিয়ে বসানো" },
  "/home/deploy/bin": { hello: "deploy এর নিজের Script" },
  "/usr/local/bin": { hello: "Admin এর বসানো Script" },
  "/usr/bin": { node: "node v18.19.1, apt দিয়ে বসানো" },
};

const PATH_PRESETS = [
  {
    id: "login",
    label: "deploy এর Login Shell",
    folders: [NVM_BIN, "/home/deploy/bin", "/usr/local/sbin", "/usr/local/bin", "/usr/sbin", "/usr/bin", "/sbin", "/bin"],
  },
  {
    id: "bin-last",
    label: "~/bin শেষে, nvm ছাড়া",
    folders: ["/usr/local/sbin", "/usr/local/bin", "/usr/sbin", "/usr/bin", "/sbin", "/bin", "/home/deploy/bin"],
  },
  {
    id: "systemd",
    label: "systemd Service",
    folders: ["/usr/local/sbin", "/usr/local/bin", "/usr/sbin", "/usr/bin"],
  },
  {
    id: "empty",
    label: "env -i, PATH খালি",
    folders: [] as string[],
  },
] as const;

type PresetId = (typeof PATH_PRESETS)[number]["id"];
const COMMANDS = ["node", "hello", "my-tours-migrate"] as const;
type CommandName = (typeof COMMANDS)[number];

function pathInsight(preset: PresetId, command: CommandName): string {
  if (preset === "empty") {
    return "PATH খালি, তাই bash কোনো Folder এই খোঁজে না। নাম লিখলে কিছুই পাওয়া যায় না, পুরো ঠিকানা লিখলে (যেমন /usr/bin/node) তবেই চলে। এই কারণেই systemd এর ExecStart আর Cron এর লাইনে পুরো ঠিকানা লেখার অভ্যাস।";
  }
  if (command === "my-tours-migrate") {
    return "এই নামের File তালিকার কোনো Folder এ নেই। Program টা Disk এ অন্য কোথাও থাকলেও bash জানে না, কারণ সে শুধু PATH এর Folder গুলোই দেখে। সমাধান দুইটা: পুরো ঠিকানা লিখুন, অথবা যে Folder এ আছে সেটা PATH এ যোগ করুন।";
  }
  if (command === "node" && preset === "login") {
    return "Login Shell এ nvm এর Folder সবার সামনে, তাই node v22 চলে। এখন systemd Service এ বদলে দেখুন। সেখানে nvm এর Folder নেই, তাই একই node লিখলে চলবে v18। Terminal এ সব ঠিক, Service এ অদ্ভুত Error, এর একটা বড় কারণ এটাই।";
  }
  if (command === "node" && preset === "systemd") {
    return "Service এর PATH ছোট, nvm এর Folder সেখানে নেই। তাই চলছে apt এর v18। আপনার Code যদি v22 এর কোনো সুবিধা ব্যবহার করে, Service টা ঠিক এখানেই ভাঙবে। তাই Unit File এর ExecStart এ পুরো ঠিকানা লিখুন।";
  }
  if (command === "hello" && preset === "login") {
    return "দুইটা hello আছে। ~/bin সামনে, তাই deploy এর নিজেরটা চলে, /usr/local/bin এরটা দেখাই হয় না।";
  }
  if (command === "hello" && preset === "bin-last") {
    return "একই দুইটা File, শুধু ক্রম বদলেছে। এবার /usr/local/bin আগে আসে, তাই Admin এর Script চলে। PATH এর ক্রমই সিদ্ধান্ত নেয়।";
  }
  if (command === "hello" && preset === "systemd") {
    return "~/bin এখানে নেই, কিন্তু /usr/local/bin আছে, তাই Admin এর Script চলে। একই নাম, Terminal এ এক Program, Service এ আরেক।";
  }
  return "bash বাম থেকে ডানে খোঁজে, প্রথম যেটা পায় সেটাই চালায়।";
}

export function PathLookupLab() {
  const [presetId, setPresetId] = useState<PresetId>("login");
  const [command, setCommand] = useState<CommandName>("node");
  const preset = PATH_PRESETS.find((p) => p.id === presetId) ?? PATH_PRESETS[0];

  const foundIndex = preset.folders.findIndex((f) => FILES[f]?.[command]);
  const found = foundIndex >= 0 ? preset.folders[foundIndex] : null;

  return (
    <Panel
      label="Interactive"
      title="PATH ধরে একটা Command খোঁজা"
      footer="এটা একটা নমুনা যন্ত্র: /usr/bin এ apt দিয়ে বসানো node v18, deploy এর Home এ nvm দিয়ে বসানো node v22, আর দুই জায়গায় দুইটা hello নামের Script। একটা PATH বেছে নিন, তারপর একটা Command লিখুন, আর দেখুন bash কোন কোন Folder দেখল, কোথায় থামল, আর কোনগুলো দেখাই হলো না। Folder আর Version গুলো সাজানো, কিন্তু খোঁজার নিয়মটা হুবহু bash এর।"
    >
      <div className="mb-3 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">কোন PATH</div>
      <div className="flex flex-wrap gap-2 mb-5">
        {PATH_PRESETS.map((p) => (
          <Chip key={p.id} active={p.id === presetId} onClick={() => setPresetId(p.id)}>
            {p.label}
          </Chip>
        ))}
      </div>
      <div className="mb-3 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">কোন Command</div>
      <div className="flex flex-wrap gap-2 mb-6">
        {COMMANDS.map((c) => (
          <Chip key={c} active={c === command} onClick={() => setCommand(c)}>
            <span className="font-mono">{c}</span>
          </Chip>
        ))}
      </div>

      <div className="mb-4 px-3 py-2 border border-border bg-muted/30 font-mono text-[0.6875rem] break-all text-muted-foreground">
        PATH={preset.folders.join(":") || "(খালি)"}
      </div>

      <ol className="space-y-1.5">
        {preset.folders.length === 0 && (
          <li className="text-[0.75rem] text-muted-foreground">খোঁজার মতো কোনো Folder নেই।</li>
        )}
        {preset.folders.map((folder, i) => {
          const hit = FILES[folder]?.[command];
          const state = foundIndex === -1 || i < foundIndex ? "miss" : i === foundIndex ? "hit" : "skipped";
          return (
            <li
              key={folder}
              className={cn(
                "flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 border text-[0.75rem]",
                state === "hit" && "border-primary bg-primary/10",
                state === "miss" && "border-border",
                state === "skipped" && "border-dashed border-border opacity-50",
              )}
            >
              <span className="font-mono text-[0.625rem] text-muted-foreground w-5">{i + 1}</span>
              <span className="font-mono text-[0.75rem] break-all flex-1 min-w-0">{folder}</span>
              <span className={cn("text-[0.6875rem]", state === "hit" ? "text-primary font-bold" : "text-muted-foreground")}>
                {state === "hit" ? `পাওয়া গেল: ${hit}` : state === "miss" ? "নেই, পরের Folder" : "দেখাই হয়নি"}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 px-4 py-3 border border-border font-mono text-[0.8125rem]">
        {found ? (
          <span>
            <span className="text-muted-foreground">চলবে </span>
            <span className="text-primary font-bold break-all">
              {found}/{command}
            </span>
          </span>
        ) : (
          <span className="text-primary">bash: {command}: command not found</span>
        )}
      </div>
      <p className="mt-4 text-[0.8125rem] leading-relaxed text-foreground">{pathInsight(presetId, command)}</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. কীভাবে চালু হলো, তার উপর নির্ভর করে কোন File পড়া হবে                      */
/* ------------------------------------------------------------------------- */

const SOURCES = [
  { id: "etc-environment", label: "/etc/environment" },
  { id: "profile-d", label: "/etc/profile.d/*.sh" },
  { id: "profile", label: "~/.profile" },
  { id: "bashrc-top", label: "~/.bashrc, পাহারার আগে" },
  { id: "bashrc-bottom", label: "~/.bashrc, পাহারার পরে" },
  { id: "unit", label: "Unit এর Environment আর EnvironmentFile" },
] as const;

type SourceId = (typeof SOURCES)[number]["id"];

const CONTEXTS: {
  id: string;
  label: string;
  reads: SourceId[];
  example: string;
  advice: string;
}[] = [
  {
    id: "ssh-login",
    label: "SSH দিয়ে Login",
    reads: ["etc-environment", "profile-d", "profile", "bashrc-top", "bashrc-bottom"],
    example: "you@laptop:~$ ssh island",
    advice: "সবচেয়ে উদার পথ, পাঁচটা File ই পড়া হয়। এই কারণেই Terminal এ সব কাজ করে, আর মানুষ ভুল করে ধরে নেয় সব জায়গাতেই করবে।",
  },
  {
    id: "new-bash",
    label: "Login এর ভেতরে নতুন bash",
    reads: ["bashrc-top", "bashrc-bottom"],
    example: "deploy@island-vps-01:~$ bash",
    advice: "Interactive কিন্তু Login নয়, তাই শুধু ~/.bashrc। বাকি সব মান সে পায় Parent এর কপি থেকে, নিজে File থেকে নয়।",
  },
  {
    id: "ssh-command",
    label: "ssh দিয়ে একটা Command",
    reads: ["etc-environment", "bashrc-top"],
    example: "you@laptop:~$ ssh island 'node migrate.mjs'",
    advice: "Ubuntu এর ~/.bashrc শুরুতেই দেখে Shell টা Interactive কি না, না হলে সেখানেই ফিরে যায়। তাই পাহারার নিচে লেখা export এখানে পৌঁছায় না। Deploy Script এ এই ফাঁদ খুব চেনা।",
  },
  {
    id: "su-dash",
    label: "su - deploy -c '...'",
    reads: ["etc-environment", "profile-d", "profile", "bashrc-top"],
    example: "root@island-vps-01:~# su - deploy -c 'printenv'",
    advice: "Login Shell, তবে Interactive নয়। ~/.profile পড়ে, সেটা ~/.bashrc কে ডাকে, কিন্তু ~/.bashrc আবার পাহারায় থেমে যায়।",
  },
  {
    id: "script",
    label: "bash -c বা একটা Script",
    reads: [],
    example: "deploy@island-vps-01:~$ bash deploy.sh",
    advice: "কোনো শুরুর File পড়ে না। যে চালাল, শুধু তার export করা মানের কপি পায়। তাই Terminal থেকে চালালে কাজ করে, Cron থেকে চালালে করে না।",
  },
  {
    id: "cron",
    label: "Cron Job",
    reads: ["etc-environment"],
    example: "30 21 * * * /srv/my-tours/backup.sh",
    advice: "Ubuntu তে Cron শুধু /etc/environment পড়ে, তাও PAM এর মাধ্যমে। আপনার ~/.bashrc বা ~/.profile কিছুই না। লেসন ১০ এ এর পুরো গল্প।",
  },
  {
    id: "systemd",
    label: "systemd Service",
    reads: ["unit"],
    example: "sudo systemctl start my-tours-api",
    advice: "কোনো Shell ই নেই, তাই কোনো Shell এর File পড়ার প্রশ্নই ওঠে না, এমনকি /etc/environment ও না। Service যা পায় তা শুধু Unit File এর Environment আর EnvironmentFile থেকে।",
  },
];

export function StartContextLab() {
  const [contextId, setContextId] = useState(CONTEXTS[0].id);
  const context = CONTEXTS.find((c) => c.id === contextId) ?? CONTEXTS[0];

  return (
    <Panel
      label="Interactive"
      title="কে কোন File পড়ে, চালু হওয়ার পথ দেখে"
      footer="এই তালিকা মুখস্থ থেকে লেখা নয়। একটা Ubuntu 24.04 Practice Server এ ছয়টা জায়গায় ছয়টা আলাদা চিহ্ন বসিয়ে প্রতিটা পথে Process চালু করে দেখা হয়েছে কোন চিহ্ন পৌঁছায়। Lab এর ৩ নম্বর Script দিয়ে আপনি নিজেও একই পরীক্ষা করতে পারবেন। পাহারা মানে Ubuntu এর ~/.bashrc এর শুরুর সেই কয়েকটা লাইন, যা Interactive না হলে File থেকে বেরিয়ে যায়।"
    >
      <div className="mb-3 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">Process টা কীভাবে চালু হলো</div>
      <div className="flex flex-wrap gap-2 mb-6">
        {CONTEXTS.map((c) => (
          <Chip key={c.id} active={c.id === contextId} onClick={() => setContextId(c.id)}>
            {c.label}
          </Chip>
        ))}
      </div>

      <div className="mb-5 px-3 py-2 border border-border bg-muted/30 font-mono text-[0.75rem] break-all">{context.example}</div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {SOURCES.map((s) => {
          const read = context.reads.includes(s.id);
          return (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 border text-[0.75rem]",
                read ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground",
              )}
            >
              {read ? <Check className="w-4 h-4 text-primary shrink-0" /> : <Minus className="w-4 h-4 shrink-0" />}
              <span className="font-mono break-all">{s.label}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-[0.8125rem] leading-relaxed text-foreground">{context.advice}</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. একটা .env লাইন, চারজন পাঠক                                              */
/* ------------------------------------------------------------------------- */

type ReaderId = "bash" | "systemd" | "node" | "next";

const READERS: { id: ReaderId; label: string; how: string }[] = [
  { id: "bash", label: "bash", how: "set -a; source .env" },
  { id: "systemd", label: "systemd", how: "EnvironmentFile=" },
  { id: "node", label: "Node 25", how: "node --env-file=.env" },
  { id: "next", label: "Next.js", how: ".env, @next/env" },
];

type Reading = { value: string | null; verdict: "ok" | "wrong" | "missing"; note?: string };

const LINES: {
  id: string;
  line: string;
  intended: string;
  safe: string;
  readings: Record<ReaderId, Reading>;
}[] = [
  {
    id: "spaces",
    line: "NODE_ENV = production",
    intended: "production",
    safe: "NODE_ENV=production",
    readings: {
      bash: { value: null, verdict: "missing", note: "NODE_ENV: command not found" },
      systemd: { value: "production", verdict: "ok" },
      node: { value: "production", verdict: "ok" },
      next: { value: "production", verdict: "ok" },
    },
  },
  {
    id: "export",
    line: "export SHUTDOWN_GRACE_MS=10000",
    intended: "10000",
    safe: "SHUTDOWN_GRACE_MS=10000",
    readings: {
      bash: { value: "10000", verdict: "ok" },
      systemd: { value: null, verdict: "missing", note: "Ignoring invalid environment assignment" },
      node: { value: "10000", verdict: "ok" },
      next: { value: "10000", verdict: "ok" },
    },
  },
  {
    id: "expand",
    line: "PUBLIC_URL=https://$HOST_NAME/tours",
    intended: "https://islandtours.example/tours",
    safe: "PUBLIC_URL=https://islandtours.example/tours",
    readings: {
      bash: { value: "https://islandtours.example/tours", verdict: "ok" },
      systemd: { value: "https://$HOST_NAME/tours", verdict: "wrong" },
      node: { value: "https://$HOST_NAME/tours", verdict: "wrong" },
      next: { value: "https://islandtours.example/tours", verdict: "ok" },
    },
  },
  {
    id: "comment",
    line: "REDIS_URL=redis://127.0.0.1:6379 # local redis",
    intended: "redis://127.0.0.1:6379",
    safe: "# local redis\nREDIS_URL=redis://127.0.0.1:6379",
    readings: {
      bash: { value: "redis://127.0.0.1:6379", verdict: "ok" },
      systemd: { value: "redis://127.0.0.1:6379 # local redis", verdict: "wrong" },
      node: { value: "redis://127.0.0.1:6379", verdict: "ok" },
      next: { value: "redis://127.0.0.1:6379", verdict: "ok" },
    },
  },
  {
    id: "hash",
    line: "DB_PASSWORD=abc#123",
    intended: "abc#123",
    safe: 'DB_PASSWORD="abc#123"',
    readings: {
      bash: { value: "abc#123", verdict: "ok" },
      systemd: { value: "abc#123", verdict: "ok" },
      node: { value: "abc", verdict: "wrong" },
      next: { value: "abc", verdict: "wrong" },
    },
  },
  {
    id: "space-value",
    line: "APP_NAME=Island Tours",
    intended: "Island Tours",
    safe: 'APP_NAME="Island Tours"',
    readings: {
      bash: { value: null, verdict: "missing", note: "Tours: command not found" },
      systemd: { value: "Island Tours", verdict: "ok" },
      node: { value: "Island Tours", verdict: "ok" },
      next: { value: "Island Tours", verdict: "ok" },
    },
  },
  {
    id: "single-quote",
    line: "GREETING='hello $USER'",
    intended: "hello $USER",
    safe: "এমন মানে $ রাখবেন না, অথবা প্রতিটা পাঠকে পরীক্ষা করুন",
    readings: {
      bash: { value: "hello $USER", verdict: "ok" },
      systemd: { value: "hello $USER", verdict: "ok" },
      node: { value: "hello $USER", verdict: "ok" },
      next: { value: "hello deploy", verdict: "wrong", note: "একক Quote এর ভেতরেও $USER বদলে দিল" },
    },
  },
  {
    id: "newline",
    line: 'WELCOME="line one\\nline two"',
    intended: "দুই লাইনের লেখা",
    safe: "এক লাইনের মান রাখুন, বা প্রতিটা পাঠকে পরীক্ষা করুন",
    readings: {
      bash: { value: "line one\\nline two", verdict: "wrong", note: "উল্টো Slash আর n, দুইটা আলাদা অক্ষর" },
      systemd: { value: "line one\\nline two", verdict: "wrong", note: "উল্টো Slash আর n, দুইটা আলাদা অক্ষর" },
      node: { value: "line one⏎line two", verdict: "ok", note: "সত্যিকারের নতুন লাইন" },
      next: { value: "line one⏎line two", verdict: "ok", note: "সত্যিকারের নতুন লাইন" },
    },
  },
  {
    id: "safe",
    line: 'SAFE_NAME="Island Tours"',
    intended: "Island Tours",
    safe: 'SAFE_NAME="Island Tours"',
    readings: {
      bash: { value: "Island Tours", verdict: "ok" },
      systemd: { value: "Island Tours", verdict: "ok" },
      node: { value: "Island Tours", verdict: "ok" },
      next: { value: "Island Tours", verdict: "ok" },
    },
  },
];

const VERDICT_LABEL: Record<Reading["verdict"], string> = {
  ok: "যা চেয়েছিলেন",
  wrong: "অন্য মান",
  missing: "বসেইনি",
};

export function EnvFileDialectLab() {
  const [lineId, setLineId] = useState(LINES[0].id);
  const line = LINES.find((l) => l.id === lineId) ?? LINES[0];
  const agreeCount = READERS.filter((r) => line.readings[r.id].verdict === "ok").length;

  return (
    <Panel
      label="Interactive"
      title="একটা .env লাইন, চারজন পাঠক"
      footer="প্রতিটা ফলাফল আসল: একই File চারভাবে পড়া হয়েছে, bash আর systemd একটা Ubuntu 24.04 Practice Server এ, Node 25 এর --env-file আর Next.js এর নিজের @next/env একটা ল্যাপটপে। ⏎ চিহ্নটা মানে মানের ভেতরে সত্যিকারের একটা নতুন লাইন। শেষ লাইনটা দেখুন: যে লেখায় চারজনই একমত, Production এর File এ শুধু সেই লেখাই রাখবেন।"
    >
      <div className="mb-3 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">.env এর কোন লাইন</div>
      <div className="flex flex-wrap gap-2 mb-6">
        {LINES.map((l) => (
          <Chip key={l.id} active={l.id === lineId} onClick={() => setLineId(l.id)}>
            <span className="font-mono">{l.line}</span>
          </Chip>
        ))}
      </div>

      <div className="mb-5 grid gap-1 text-[0.75rem]">
        <div>
          <span className="text-muted-foreground">লেখকের মনে যা ছিল: </span>
          <span className="font-mono">{line.intended}</span>
        </div>
        <div>
          <span className="text-muted-foreground">চারজনের মধ্যে একমত: </span>
          <span className={cn("font-bold", agreeCount === 4 ? "text-primary" : "text-foreground")}>{agreeCount} জন</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {READERS.map((r) => {
          const reading = line.readings[r.id];
          const Icon = reading.verdict === "ok" ? Check : X;
          return (
            <div
              key={r.id}
              className={cn(
                "border p-4",
                reading.verdict === "ok" ? "border-border" : "border-primary/60 bg-primary/5",
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[0.8125rem] font-bold">{r.label}</span>
                <span className="font-mono text-[0.625rem] text-muted-foreground">{r.how}</span>
              </div>
              <div className="font-mono text-[0.8125rem] break-all">
                {reading.value === null ? <span className="text-muted-foreground">(নেই)</span> : `[${reading.value}]`}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[0.6875rem]">
                <Icon className={cn("w-3.5 h-3.5", reading.verdict === "ok" ? "text-primary" : "text-foreground")} />
                <span className={reading.verdict === "ok" ? "text-primary" : "text-foreground"}>{VERDICT_LABEL[reading.verdict]}</span>
                {reading.note && <span className="text-muted-foreground">, {reading.note}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 px-4 py-3 border border-border">
        <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">নিরাপদ লেখা</div>
        <pre className="font-mono text-[0.8125rem] whitespace-pre-wrap break-all">{line.safe}</pre>
      </div>
    </Panel>
  );
}
