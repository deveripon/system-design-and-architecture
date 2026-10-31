/**
 * What: The interactive labs for Module 07 Lesson 04. PermModeLab turns nine switches into the
 * ls -l string, the octal number and the chmod command. PermAccessLab lets the reader pick a
 * user, a path on the Island Tours server and an action, then walks the path the way the kernel
 * does and says exactly where access was granted or refused. PermUmaskLab shows what a umask
 * does to new files and directories.
 *
 * Why: Permission rules are short but their consequences surprise people. Flipping a bit and
 * watching the result change teaches the rule faster than reading it. The access check uses the
 * real modes, owners and ACL entries captured from the practice server in this lesson, so every
 * verdict matches what the terminal printed. All state changes come from clicks, never from an
 * effect.
 */
"use client";

import { cn } from "@/lib/utils";
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

function SmallLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------- */
/* Shared: turning bits into the strings ls and chmod print                   */
/* ------------------------------------------------------------------------- */

type Kind = "file" | "dir";
type Special = { setuid: boolean; setgid: boolean; sticky: boolean };

const CLASS_NAMES = ["Owner", "Group", "Other"] as const;
const LETTERS = ["r", "w", "x"] as const;

/** Nine booleans in ls order (owner rwx, group rwx, other rwx) to the three octal digits. */
function digitsOf(bits: boolean[]): number[] {
  return [0, 1, 2].map((c) => (bits[c * 3] ? 4 : 0) + (bits[c * 3 + 1] ? 2 : 0) + (bits[c * 3 + 2] ? 1 : 0));
}

function specialDigit(special: Special): number {
  return (special.setuid ? 4 : 0) + (special.setgid ? 2 : 0) + (special.sticky ? 1 : 0);
}

/** The ten characters ls -l prints, with s, S, t and T where a special bit is set. */
function lsString(kind: Kind, bits: boolean[], special: Special): string {
  const chars: string[] = bits.map((on, i) => (on ? LETTERS[i % 3] : "-"));
  const swap = (index: number, set: boolean, lower: string, upper: string) => {
    if (set) chars[index] = bits[index] ? lower : upper;
  };
  swap(2, special.setuid, "s", "S");
  swap(5, special.setgid, "s", "S");
  swap(8, special.sticky, "t", "T");
  return (kind === "dir" ? "d" : "-") + chars.join("");
}

function symbolicOf(bits: boolean[]): string {
  return ["u", "g", "o"]
    .map((who, c) => {
      const letters = LETTERS.filter((_, i) => bits[c * 3 + i]).join("");
      return `${who}=${letters}`;
    })
    .join(",");
}

/* ------------------------------------------------------------------------- */
/* 1. PermModeLab                                                             */
/* ------------------------------------------------------------------------- */

const MODE_PRESETS: { mode: string; kind: Kind; note: string }[] = [
  { mode: "644", kind: "file", note: "সাধারণ File" },
  { mode: "640", kind: "file", note: "Config, Group পড়ে" },
  { mode: "600", kind: "file", note: "Private Key" },
  { mode: "755", kind: "dir", note: "সাধারণ Directory" },
  { mode: "750", kind: "dir", note: "App এর Directory" },
  { mode: "700", kind: "dir", note: "~/.ssh" },
  { mode: "777", kind: "dir", note: "কখনো না" },
  { mode: "1777", kind: "dir", note: "/tmp" },
  { mode: "2775", kind: "dir", note: "দলের Directory" },
  { mode: "4755", kind: "file", note: "/usr/bin/passwd" },
];

function bitsFromMode(mode: string): { bits: boolean[]; special: Special } {
  const digits = mode.padStart(4, "0").split("").map(Number);
  const bits: boolean[] = [];
  for (const d of digits.slice(1)) bits.push(Boolean(d & 4), Boolean(d & 2), Boolean(d & 1));
  return {
    bits,
    special: { setuid: Boolean(digits[0] & 4), setgid: Boolean(digits[0] & 2), sticky: Boolean(digits[0] & 1) },
  };
}

const FILE_MEANING = ["ভেতরের লেখা পড়তে পারে", "ভেতরের লেখা বদলাতে পারে", "Program হিসেবে চালাতে পারে"];
const DIR_MEANING = ["ভেতরের নামগুলো দেখতে পারে", "নাম যোগ, মোছা, বদলানো (x সহ)", "ভেতরে ঢুকতে, পথ পার হতে পারে"];

function modeWarnings(kind: Kind, bits: boolean[], special: Special): string[] {
  const warnings: string[] = [];
  if (bits[7]) {
    warnings.push(
      kind === "dir"
        ? "Other এর w জ্বালানো: Server এর যেকোনো User বা যেকোনো ভাঙা Process এই Directory তে File রাখতে আর অন্যের File মুছতে পারবে।"
        : "Other এর w জ্বালানো: Server এর যেকোনো User এই File টা বদলে দিতে পারবে।",
    );
  }
  if (kind === "dir") {
    for (let c = 0; c < 3; c++) {
      if (bits[c * 3 + 1] && !bits[c * 3 + 2]) {
        warnings.push(`${CLASS_NAMES[c]} এর w আছে কিন্তু x নেই: x ছাড়া Directory র w কোনো কাজেই লাগে না।`);
      }
      if (bits[c * 3] && !bits[c * 3 + 2]) {
        warnings.push(`${CLASS_NAMES[c]} এর r আছে কিন্তু x নেই: নাম দেখা যাবে, কিন্তু কোনো File খোলা যাবে না।`);
      }
    }
    if (special.setuid) warnings.push("Directory তে setuid এর Linux এ কোনো মানে নেই, Kernel এটা উপেক্ষা করে।");
  } else {
    if (special.sticky) warnings.push("File এ sticky Bit এর এখন কোনো কাজ নেই। এটা Directory র জিনিস।");
    if (special.setuid && bits[7]) warnings.push("setuid আর Other এর w একসাথে: যে কেউ এই File বদলে root হয়ে চালাতে পারবে। ভয়ংকর।");
  }
  const sticky = special.sticky && kind === "dir";
  if (sticky && !bits[7]) warnings.push("sticky Bit তখনই কাজের, যখন অনেকে লিখতে পারে, যেমন /tmp এর 1777।");
  return warnings;
}

export function PermModeLab() {
  const [kind, setKind] = useState<Kind>("file");
  const [bits, setBits] = useState<boolean[]>(bitsFromMode("640").bits);
  const [special, setSpecial] = useState<Special>({ setuid: false, setgid: false, sticky: false });

  const digits = digitsOf(bits);
  const sd = specialDigit(special);
  const octal = (sd ? String(sd) : "") + digits.join("");
  const name = kind === "dir" ? "uploads" : "api.env";
  const meaning = kind === "dir" ? DIR_MEANING : FILE_MEANING;
  const warnings = modeWarnings(kind, bits, special);

  const flip = (index: number) => setBits((prev) => prev.map((on, i) => (i === index ? !on : on)));
  const applyPreset = (preset: (typeof MODE_PRESETS)[number]) => {
    const parsed = bitsFromMode(preset.mode);
    setKind(preset.kind);
    setBits(parsed.bits);
    setSpecial(parsed.special);
  };

  return (
    <Panel
      label="Lab"
      title="নয়টা সুইচ, একটা Mode"
      footer="একটা সুইচ চাপলেই নিচের তিনটা জিনিস একসাথে বদলায়: ls -l যা দেখাবে, chmod এ যে অঙ্ক লিখবেন, আর কে কী পারবে। File আর Directory বদলে একই Mode এর মানে কীভাবে পাল্টায়, সেটা খেয়াল করুন। 777 চাপলে সতর্কবার্তাগুলো পড়ুন।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <SmallLabel>ধরন</SmallLabel>
        <Chip active={kind === "file"} onClick={() => setKind("file")}>
          File
        </Chip>
        <Chip active={kind === "dir"} onClick={() => setKind("dir")}>
          Directory
        </Chip>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <SmallLabel>চেনা Mode</SmallLabel>
        {MODE_PRESETS.map((preset) => (
          <Chip
            key={preset.mode}
            active={octal === preset.mode && kind === preset.kind}
            onClick={() => applyPreset(preset)}
          >
            {preset.mode}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {CLASS_NAMES.map((cls, c) => (
          <div key={cls} className="border border-border bg-background p-4">
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-mono text-[0.6875rem] font-bold text-foreground">{cls}</span>
              <span className="font-mono text-[1.125rem] font-bold text-primary" data-perm-digit={c}>
                {digits[c]}
              </span>
            </div>
            <div className="flex gap-2 mb-3">
              {LETTERS.map((letter, i) => {
                const index = c * 3 + i;
                const on = bits[index];
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => flip(index)}
                    aria-pressed={on}
                    aria-label={`${cls} ${letter}`}
                    className={cn(
                      "flex-1 py-2 border font-mono text-[0.9375rem] font-bold transition-colors",
                      on
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-dashed border-border text-muted-foreground/60 hover:border-primary/40",
                    )}
                  >
                    {on ? letter : "-"}
                  </button>
                );
              })}
            </div>
            <ul className="space-y-1">
              {LETTERS.map((letter, i) => (
                <li
                  key={letter}
                  className={cn(
                    "text-[0.75rem] leading-relaxed",
                    bits[c * 3 + i] ? "text-foreground" : "text-muted-foreground/50 line-through",
                  )}
                >
                  <span className="font-mono mr-1">{letter}</span>
                  {meaning[i]}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <SmallLabel>বিশেষ Bit</SmallLabel>
        <Chip active={special.setuid} onClick={() => setSpecial((s) => ({ ...s, setuid: !s.setuid }))}>
          setuid (4)
        </Chip>
        <Chip active={special.setgid} onClick={() => setSpecial((s) => ({ ...s, setgid: !s.setgid }))}>
          setgid (2)
        </Chip>
        <Chip active={special.sticky} onClick={() => setSpecial((s) => ({ ...s, sticky: !s.sticky }))}>
          sticky (1)
        </Chip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="border border-border bg-background px-4 py-3 min-w-0">
          <div className="text-[0.625rem] text-muted-foreground mb-1">ls -l দেখাবে</div>
          <div className="font-mono text-[0.9375rem] font-bold text-primary break-all" data-perm-ls={lsString(kind, bits, special)}>
            {lsString(kind, bits, special)} {name}
          </div>
        </div>
        <div className="border border-border bg-background px-4 py-3 min-w-0">
          <div className="text-[0.625rem] text-muted-foreground mb-1">অঙ্কে</div>
          <div className="font-mono text-[0.9375rem] font-bold text-foreground break-all" data-perm-octal={octal}>
            chmod {octal} {name}
          </div>
        </div>
        <div className="border border-border bg-background px-4 py-3 min-w-0">
          <div className="text-[0.625rem] text-muted-foreground mb-1">অক্ষরে</div>
          <div className="font-mono text-[0.8125rem] font-bold text-foreground break-all">
            chmod {symbolicOf(bits)} {name}
          </div>
        </div>
      </div>

      <div className="min-h-[3rem]">
        {warnings.length === 0 ? (
          <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
            এই Mode এ কোনো চোখে পড়ার মতো ঝুঁকি নেই। তবে ঠিক কি না, সেটা নির্ভর করে File টা কার আর কোন Group এর, তার উপর।
          </p>
        ) : (
          <ul className="space-y-2">
            {warnings.map((warning) => (
              <li key={warning} className="flex gap-2 text-[0.8125rem] text-foreground leading-relaxed">
                <X className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. PermAccessLab                                                           */
/* ------------------------------------------------------------------------- */

type Actor = { id: string; uid: number; groups: string[]; note: string };

const ACTORS: Actor[] = [
  { id: "deploy", uid: 1001, groups: ["deploy", "sudo", "users"], note: "মানুষ, Admin" },
  { id: "islandtours", uid: 999, groups: ["islandtours"], note: "API এর Process" },
  { id: "caddy", uid: 997, groups: ["caddy", "www-data"], note: "Caddy এর Process" },
  { id: "guest", uid: 1002, groups: ["guest", "users"], note: "অন্য একজন User" },
  { id: "root", uid: 0, groups: ["root"], note: "UID 0" },
];

type Node = {
  path: string;
  owner: string;
  group: string;
  mode: string;
  dir: boolean;
  /** Named-user ACL entries, as setfacl -m u:NAME:BITS left them. */
  acl?: Record<string, string>;
};

const RELEASE = "/srv/islandtours/releases/2026-10-31-1";

/** The real owners, modes and ACL entries from the practice server in this lesson. */
const NODES: Node[] = [
  { path: "/", owner: "root", group: "root", mode: "755", dir: true },
  { path: "/srv", owner: "root", group: "root", mode: "755", dir: true },
  { path: "/srv/islandtours", owner: "deploy", group: "islandtours", mode: "750", dir: true, acl: { caddy: "--x" } },
  { path: "/srv/islandtours/releases", owner: "deploy", group: "islandtours", mode: "2750", dir: true, acl: { caddy: "--x" } },
  { path: RELEASE, owner: "deploy", group: "islandtours", mode: "2750", dir: true, acl: { caddy: "--x" } },
  { path: `${RELEASE}/dist`, owner: "deploy", group: "islandtours", mode: "2750", dir: true },
  { path: `${RELEASE}/dist/main.js`, owner: "deploy", group: "islandtours", mode: "640", dir: false },
  { path: `${RELEASE}/public`, owner: "deploy", group: "islandtours", mode: "2750", dir: true, acl: { caddy: "r-x" } },
  { path: `${RELEASE}/public/index.html`, owner: "deploy", group: "islandtours", mode: "640", dir: false, acl: { caddy: "r--" } },
  { path: "/srv/islandtours/uploads", owner: "islandtours", group: "islandtours", mode: "750", dir: true },
  { path: "/etc", owner: "root", group: "root", mode: "755", dir: true },
  { path: "/etc/islandtours", owner: "root", group: "islandtours", mode: "750", dir: true },
  { path: "/etc/islandtours/api.env", owner: "root", group: "islandtours", mode: "640", dir: false },
  { path: "/etc/caddy", owner: "root", group: "root", mode: "755", dir: true },
  { path: "/etc/caddy/Caddyfile", owner: "root", group: "root", mode: "644", dir: false },
  { path: "/var", owner: "root", group: "root", mode: "755", dir: true },
  { path: "/var/backups", owner: "root", group: "root", mode: "755", dir: true },
  { path: "/var/backups/islandtours", owner: "root", group: "root", mode: "700", dir: true },
];

const nodeByPath = Object.fromEntries(NODES.map((node) => [node.path, node]));

const TARGETS = [
  "/etc/islandtours/api.env",
  "/etc/caddy/Caddyfile",
  `${RELEASE}/dist/main.js`,
  `${RELEASE}/public/index.html`,
  "/srv/islandtours/uploads",
  "/var/backups/islandtours",
];

const SHORT: Record<string, string> = {
  [`${RELEASE}/dist/main.js`]: ".../dist/main.js",
  [`${RELEASE}/public/index.html`]: ".../public/index.html",
};

type Action = "read" | "write" | "list" | "create";

const FILE_ACTIONS: { id: Action; label: string; need: "r" | "w" }[] = [
  { id: "read", label: "পড়া (cat)", need: "r" },
  { id: "write", label: "লেখা (echo >>)", need: "w" },
];
const DIR_ACTIONS: { id: Action; label: string; need: "r" | "w" }[] = [
  { id: "list", label: "তালিকা দেখা (ls)", need: "r" },
  { id: "create", label: "ভেতরে File বানানো (touch)", need: "w" },
];

type Grant = { cls: string; bits: string };

/** Which three bits apply to this actor on this node, in the kernel's order. */
function grantFor(actor: Actor, node: Node): Grant {
  if (actor.uid === 0) return { cls: "root", bits: "rwx" };
  // The last three digits are owner, group and other; a leading 2 (setgid) changes no check.
  const triplets = node.mode.slice(-3).split("").map((d) => {
    const n = Number(d);
    return `${n & 4 ? "r" : "-"}${n & 2 ? "w" : "-"}${n & 1 ? "x" : "-"}`;
  });
  if (actor.id === node.owner) return { cls: "Owner", bits: triplets[0] };
  if (node.acl && node.acl[actor.id]) return { cls: `ACL u:${actor.id}`, bits: node.acl[actor.id] };
  if (actor.groups.includes(node.group)) return { cls: "Group", bits: triplets[1] };
  return { cls: "Other", bits: triplets[2] };
}

function ancestorsOf(path: string): string[] {
  const parts = path.split("/").filter(Boolean);
  const list = ["/"];
  for (let i = 1; i < parts.length; i++) list.push("/" + parts.slice(0, i).join("/"));
  return list;
}

type WalkStep = { path: string; need: string; grant: Grant; ok: boolean };

function walk(actor: Actor, target: string, need: "r" | "w"): WalkStep[] {
  const steps: WalkStep[] = [];
  for (const dir of ancestorsOf(target)) {
    const grant = grantFor(actor, nodeByPath[dir]);
    const ok = grant.bits.includes("x");
    steps.push({ path: dir, need: "x", grant, ok });
    if (!ok) return steps;
  }
  const node = nodeByPath[target];
  const grant = grantFor(actor, node);
  const letters = node.dir && need === "w" ? ["w", "x"] : [need];
  const ok = letters.every((letter) => grant.bits.includes(letter));
  steps.push({ path: target, need: letters.join(" আর "), grant, ok });
  return steps;
}

export function PermAccessLab() {
  const [actorId, setActorId] = useState("islandtours");
  const [target, setTarget] = useState("/etc/islandtours/api.env");
  const [actionId, setActionId] = useState<Action>("read");

  const actor = ACTORS.find((a) => a.id === actorId) ?? ACTORS[0];
  const node = nodeByPath[target];
  const actions = node.dir ? DIR_ACTIONS : FILE_ACTIONS;
  const action = actions.find((a) => a.id === actionId) ?? actions[0];
  const steps = walk(actor, target, action.need);
  const last = steps[steps.length - 1];
  const allowed = last.ok && last.path === target;

  const chooseTarget = (path: string) => {
    setTarget(path);
    const nextNode = nodeByPath[path];
    if (nextNode.dir !== node.dir) setActionId(nextNode.dir ? "list" : "read");
  };

  return (
    <Panel
      label="Lab"
      title="কে, কোথায়, কী করতে চায়"
      footer="প্রতিটা Mode, মালিক আর ACL এই লেসনের Practice Server থেকে নেওয়া, তাই এখানে যা দেখবেন, Terminal ও ঠিক তাই বলেছিল। চেষ্টা করুন: caddy দিয়ে index.html আর api.env দুইটাই পড়তে চান। তারপর deploy দিয়ে api.env পড়তে চান, আর ভাবুন Admin হয়েও কেন পারছেন না। শেষে root বেছে নিন।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <SmallLabel>কে</SmallLabel>
        {ACTORS.map((a) => (
          <Chip key={a.id} active={a.id === actorId} onClick={() => setActorId(a.id)}>
            {a.id}
          </Chip>
        ))}
      </div>
      <p className="text-[0.75rem] text-muted-foreground mb-5 font-mono">
        uid={actor.uid} groups={actor.groups.join(",")} · {actor.note}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <SmallLabel>কোথায়</SmallLabel>
        {TARGETS.map((path) => (
          <Chip key={path} active={path === target} onClick={() => chooseTarget(path)}>
            {SHORT[path] ?? path}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <SmallLabel>কী</SmallLabel>
        {actions.map((a) => (
          <Chip key={a.id} active={a.id === action.id} onClick={() => setActionId(a.id)}>
            {a.label}
          </Chip>
        ))}
      </div>

      <ol className="border border-border bg-background divide-y divide-border mb-5">
        {steps.map((step) => (
          <li key={step.path} className="flex items-start gap-3 px-4 py-2.5">
            {step.ok ? (
              <Check className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
            ) : (
              <X className="w-4 h-4 shrink-0 mt-0.5 text-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[0.75rem] text-foreground break-all">
                {step.path}
                <span className="text-muted-foreground">
                  {"  "}
                  {nodeByPath[step.path].owner}:{nodeByPath[step.path].group} {nodeByPath[step.path].mode}
                  {nodeByPath[step.path].acl ? " +ACL" : ""}
                </span>
              </div>
              <div className="text-[0.75rem] text-muted-foreground">
                দরকার <span className="font-mono">{step.need}</span>, প্রযোজ্য দল{" "}
                <span className="font-mono text-foreground">{step.grant.cls}</span> এর Bit{" "}
                <span className="font-mono text-foreground">{step.grant.bits}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div
        className={cn(
          "border px-4 py-3",
          allowed ? "border-primary bg-primary/10" : "border-border bg-muted/30",
        )}
        data-perm-verdict={allowed ? "allowed" : "denied"}
      >
        <div className={cn("font-mono text-[0.875rem] font-bold", allowed ? "text-primary" : "text-foreground")}>
          {allowed ? "অনুমতি আছে" : "Permission denied"}
        </div>
        <p className="text-[0.8125rem] text-muted-foreground leading-relaxed mt-1">
          {allowed
            ? actor.uid === 0
              ? "root এর জন্য Kernel সাধারণ Bit গুলো দেখেই না। এই কারণেই root হয়ে কাজ করা বিপজ্জনক: ভুল Command কে থামানোর কেউ নেই।"
              : `শেষ ধাপে ${last.grant.cls} এর Bit ${last.grant.bits} এ দরকারি অক্ষরটা আছে, আর পথের প্রতিটা Directory তে x ছিল।`
            : last.path === target
              ? `পথ পার হয়েছে, কিন্তু শেষ ধাপে ${last.grant.cls} এর Bit ${last.grant.bits} এ দরকারি অক্ষরটা নেই।`
              : `${last.path} এ ${last.grant.cls} এর জন্য x নেই, তাই পথ এখানেই থেমে গেছে। আসল File টার Bit দেখাই হয়নি।`}
        </p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. PermUmaskLab                                                            */
/* ------------------------------------------------------------------------- */

const UMASKS: { value: string; who: string }[] = [
  { value: "022", who: "root এর Default, আর Ubuntu এর বেশিরভাগ Service" },
  { value: "002", who: "Ubuntu তে নিজের নামের Group আছে এমন মানুষ User" },
  { value: "027", who: "Server এর App এর জন্য ভালো পছন্দ, systemd এ UMask=0027" },
  { value: "077", who: "শুধু নিজের জন্য, যেমন Secret নিয়ে কাজের সময়" },
];

function octalToLs(mode: number, dir: boolean): string {
  const out: string[] = [];
  for (const shift of [6, 3, 0]) {
    const d = (mode >> shift) & 7;
    out.push(`${d & 4 ? "r" : "-"}${d & 2 ? "w" : "-"}${d & 1 ? "x" : "-"}`);
  }
  return (dir ? "d" : "-") + out.join("");
}

export function PermUmaskLab() {
  const [umask, setUmask] = useState("027");
  const mask = parseInt(umask, 8);
  const fileMode = 0o666 & ~mask;
  const dirMode = 0o777 & ~mask;
  const fmt = (n: number) => n.toString(8).padStart(3, "0");
  const chosen = UMASKS.find((u) => u.value === umask) ?? UMASKS[0];

  return (
    <Panel
      label="Lab"
      title="umask, নতুন File এর জন্মের Mode"
      footer="নতুন File এর শুরুর প্রস্তাব 666, নতুন Directory র 777। umask হলো সেই প্রস্তাব থেকে কোন Bit গুলো কেটে বাদ যাবে তার তালিকা। এটা বিয়োগ নয়, Bit কেটে ফেলা, তাই 666 থেকে 027 বাদে 640, কোনো অঙ্কই ঋণাত্মক হয় না।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <SmallLabel>umask</SmallLabel>
        {UMASKS.map((u) => (
          <Chip key={u.value} active={u.value === umask} onClick={() => setUmask(u.value)}>
            {u.value}
          </Chip>
        ))}
      </div>
      <p className="text-[0.8125rem] text-muted-foreground mb-5">{chosen.who}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { label: "touch নতুন.txt", start: "666", result: fileMode, dir: false },
          { label: "mkdir নতুন-dir", start: "777", result: dirMode, dir: true },
        ].map((row) => (
          <div key={row.label} className="border border-border bg-background px-4 py-3">
            <div className="font-mono text-[0.6875rem] text-muted-foreground mb-2">{row.label}</div>
            <div className="font-mono text-[0.8125rem] text-foreground mb-1">
              প্রস্তাব {row.start}, কাটা যাবে {umask}
            </div>
            <div className="font-mono text-[1rem] font-bold text-primary" data-perm-umask-result={fmt(row.result)}>
              {fmt(row.result)} {octalToLs(row.result, row.dir)}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
