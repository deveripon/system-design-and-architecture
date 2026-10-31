/**
 * What: The interactive labs for Module 07 Lesson 11, VPS Setup, End to End.
 * SetupChecklistLab walks the whole build step by step and shows how the server's safety
 * changes as each step is ticked, including what happens when steps are done out of order.
 * LockoutLab replays five real ways people lock themselves out of a new server, with the
 * exact error each one prints and the way back in. OutsideCheckLab lets the reader plant
 * a mistake on the server and see which of the final outside checks catches it.
 *
 * Why: The order of the first hour matters more than any single command, and that is
 * something a reader learns by getting it wrong safely. Every result here is derived from
 * the reader's choices during render, never set inside an effect. The error texts were
 * captured on an Ubuntu 24.04 practice server.
 */
"use client";

import { cn } from "@/lib/utils";
import { Check, RotateCcw, X } from "lucide-react";
import Link from "next/link";
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

function Status({ good, label, detail }: { good: boolean; label: string; detail: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 px-3 py-2.5 border transition-colors",
        good ? "border-primary/50 bg-primary/5" : "border-border",
      )}
    >
      <span
        className={cn(
          "mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center border",
          good ? "border-primary text-primary" : "border-muted-foreground/50 text-muted-foreground",
        )}
      >
        {good ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      </span>
      <span className="min-w-0">
        <span className={cn("block text-[0.75rem] font-bold", good ? "text-primary" : "text-foreground")}>
          {label}
        </span>
        <span className="block text-[0.6875rem] text-muted-foreground leading-relaxed">{detail}</span>
      </span>
    </div>
  );
}

const lessonHref = (id: string) => `/devops/topic/${id}`;

/* ------------------------------------------------------------------------- */
/* 1. পুরো Setup, এক এক করে                                                    */
/* ------------------------------------------------------------------------- */

type StepId =
  | "create"
  | "login"
  | "updates"
  | "deploy-user"
  | "ssh-harden"
  | "ufw"
  | "basics"
  | "node"
  | "app-home"
  | "service"
  | "caddy"
  | "backup"
  | "outside";

const STEPS: {
  id: StepId;
  phase: string;
  title: string;
  command: string;
  see: string;
  lesson?: { id: string; label: string };
}[] = [
  {
    id: "create",
    phase: "ভাড়া",
    title: "Server বানান, SSH Key সহ",
    command: "Dashboard: Ubuntu 24.04 LTS, আপনার id_ed25519.pub",
    see: "একটা Public IP, যেমন 198.51.100.42",
    lesson: { id: "linux-filesystem", label: "লেসন ০১" },
  },
  {
    id: "login",
    phase: "ভাড়া",
    title: "প্রথম Login, Fingerprint মিলিয়ে",
    command: "ssh root@198.51.100.42",
    see: "Are you sure you want to continue connecting",
    lesson: { id: "ssh-security-keys", label: "লেসন ০৩" },
  },
  {
    id: "updates",
    phase: "তালা",
    title: "Update আর স্বয়ংক্রিয় Security Patch",
    command: "apt update && apt full-upgrade",
    see: "unattended-upgrades: enabled",
  },
  {
    id: "deploy-user",
    phase: "তালা",
    title: "deploy User, sudo, Key কপি",
    command: "adduser deploy; usermod -aG sudo deploy",
    see: "groups=...(deploy),27(sudo)",
    lesson: { id: "permissions-users-groups", label: "লেসন ০৪" },
  },
  {
    id: "ssh-harden",
    phase: "তালা",
    title: "root আর Password Login বন্ধ",
    command: "00-hardening.conf; sshd -t; reload ssh",
    see: "passwordauthentication no",
    lesson: { id: "ssh-security-keys", label: "লেসন ০৩" },
  },
  {
    id: "ufw",
    phase: "তালা",
    title: "ufw: আগে OpenSSH, তারপর enable",
    command: "ufw allow OpenSSH; ufw allow 80,443; ufw enable",
    see: "Status: active",
    lesson: { id: "firewall-ufw", label: "লেসন ০৬" },
  },
  {
    id: "basics",
    phase: "তালা",
    title: "UTC, Hostname, Swap",
    command: "timedatectl; hostnamectl; /swapfile",
    see: "Time zone: Etc/UTC (UTC, +0000)",
    lesson: { id: "monitoring-tools", label: "লেসন ০৮" },
  },
  {
    id: "node",
    phase: "চালু",
    title: "Node LTS, NodeSource থেকে",
    command: "apt install nodejs",
    see: "v24.22.2",
  },
  {
    id: "app-home",
    phase: "চালু",
    title: "mytours User, Folder, api.env",
    command: "useradd --system ... mytours",
    see: "-rw-r----- root mytours api.env",
    lesson: { id: "environment-variables", label: "লেসন ০৫" },
  },
  {
    id: "service",
    phase: "চালু",
    title: "Code পাঠান, Service চালু",
    command: "rsync; npm ci; systemctl enable --now",
    see: "Active: active (running)",
    lesson: { id: "process-management-systemd", label: "লেসন ০২" },
  },
  {
    id: "caddy",
    phase: "চালু",
    title: "Caddy, DNS আর HTTPS",
    command: "apt install caddy; Caddyfile",
    see: "HTTP/2 200",
  },
  {
    id: "backup",
    phase: "টিকিয়ে রাখা",
    title: "Log, Uptime Check, রাতের Backup",
    command: "my-tours-backup.timer",
    see: "restore matches live files",
    lesson: { id: "cron-jobs", label: "লেসন ১০" },
  },
  {
    id: "outside",
    phase: "টিকিয়ে রাখা",
    title: "বাইরে থেকে শেষ পরীক্ষা আর Reboot",
    command: "nmap; ssh root@...; curl https://...",
    see: "সাতটা উত্তরই প্রত্যাশামতো",
    lesson: { id: "network-debugging", label: "লেসন ০৯" },
  },
];

function postureOf(done: Set<StepId>) {
  const has = (id: StepId) => done.has(id);
  const lockedOut = has("ssh-harden") && !has("deploy-user");
  return {
    lockedOut,
    items: [
      {
        good: has("updates"),
        label: "Security Patch",
        detail: has("updates")
          ? "সব Update বসানো, আর রোজ রাতে নতুন Security Patch নিজে বসবে।"
          : "Image টা যেদিন বানানো, সেদিনের পরের কোনো Patch এখনো নেই।",
      },
      {
        good: has("ssh-harden") && has("deploy-user"),
        label: "root আর Password Login",
        detail: has("ssh-harden")
          ? "দুইটাই বন্ধ। Bot এর হাজার Password আন্দাজ এখন অর্থহীন।"
          : "এখনো খোলা। নতুন Server এ প্রথম দিনেই Bot Password আন্দাজ করা শুরু করে।",
      },
      {
        good: has("ufw"),
        label: "Firewall",
        detail: has("ufw")
          ? "শুধু 22, 80, 443 খোলা। বাকি সব Port এ টোকা দিলে কোনো উত্তর যায় না।"
          : "বন্ধ। যে Program ভুল করে 0.0.0.0 এ শোনে, সে সরাসরি Internet এ।",
      },
      {
        good: has("service"),
        label: "App চলছে, Reboot এর পরেও",
        detail: has("service")
          ? "systemd চালায়, ভাঙলে পাঁচ সেকেন্ড পরে আবার চালায়, Boot এ নিজে ওঠে।"
          : "এখনো কিছু চলছে না।",
      },
      {
        good: has("caddy"),
        label: "HTTPS",
        detail: has("caddy")
          ? "Caddy Certificate এনেছে আর নবীকরণ করবে। http এ এলে https এ পাঠায়।"
          : "পর্যটক এখনো কোনো ঠিকানায় পৌঁছাতে পারবেন না।",
      },
      {
        good: has("backup"),
        label: "Backup আর চোখ",
        detail: has("backup")
          ? "রাতের Backup চলে, একবার Restore করে মিলিয়ে দেখা হয়েছে।"
          : "Disk নষ্ট হলে বা ভুলে কিছু মুছলে ফেরার রাস্তা নেই।",
      },
      {
        good: has("outside"),
        label: "বাইরে থেকে প্রমাণিত",
        detail: has("outside")
          ? "অচেনা কেউ যা দেখবেন, আপনি নিজে সেটা দেখে নিয়েছেন।"
          : "ভেতর থেকে সব ঠিক দেখালেও বাইরে থেকে এখনো যাচাই হয়নি।",
      },
    ],
  };
}

export function SetupChecklistLab() {
  const [done, setDone] = useState<Set<StepId>>(new Set());
  const [focus, setFocus] = useState<StepId>("create");

  function toggle(id: StepId) {
    setFocus(id);
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const posture = postureOf(done);
  const step = STEPS.find((s) => s.id === focus) ?? STEPS[0];
  const progress = Math.round((done.size / STEPS.length) * 100);

  return (
    <Panel
      label="Interactive"
      title="তেরোটা ধাপ, আর প্রতিটায় Server কতটা নিরাপদ হলো"
      footer="বাঁ দিকের ধাপগুলোয় চাপ দিয়ে টিক দিন, ডান দিকে দেখুন Server এর অবস্থা কীভাবে বদলায়। ইচ্ছা করে ক্রম ভেঙে দেখুন: deploy User বানানোর আগেই root Login বন্ধ করলে কী হয়। প্রতিটা ধাপের নিচে সেই আসল কমান্ড আর ঠিক হলে আপনি কী দেখবেন, যা এই লেসনে অনুশীলনের Server এ চালিয়ে পাওয়া।"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-1.5 bg-muted overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span className="font-mono text-[0.6875rem] text-muted-foreground" data-field="progress">
          {done.size}/{STEPS.length}
        </span>
        <button
          onClick={() => {
            setDone(new Set());
            setFocus("create");
          }}
          data-action="reset"
          className="inline-flex items-center gap-1 px-2 py-1 border border-border text-[0.6875rem] text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3" /> আবার শুরু
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ol className="space-y-1.5">
          {STEPS.map((s, i) => {
            const checked = done.has(s.id);
            return (
              <li key={s.id}>
                <button
                  onClick={() => toggle(s.id)}
                  data-step={s.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 border text-left transition-colors",
                    checked ? "border-primary/60 bg-primary/5" : "border-border hover:border-primary/40",
                    focus === s.id && "ring-1 ring-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "w-4 h-4 shrink-0 border flex items-center justify-center",
                      checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50",
                    )}
                  >
                    {checked && <Check className="w-3 h-3" />}
                  </span>
                  <span className="font-mono text-[0.625rem] text-muted-foreground w-5 shrink-0">{i + 1}</span>
                  <span className="flex-1 min-w-0 text-[0.75rem] text-foreground">{s.title}</span>
                  <span className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted-foreground shrink-0">
                    {s.phase}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="space-y-4">
          <div className="border border-border p-4 bg-muted/20">
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-primary mb-2">
              ধাপ {STEPS.indexOf(step) + 1}: কমান্ড আর প্রত্যাশিত ফল
            </div>
            <code className="block font-mono text-[0.75rem] text-foreground break-words mb-2" data-field="command">
              {step.command}
            </code>
            <div className="text-[0.6875rem] text-muted-foreground">
              ঠিক হলে দেখবেন: <span className="font-mono text-foreground">{step.see}</span>
            </div>
            {step.lesson && (
              <div className="mt-2 text-[0.6875rem] text-muted-foreground">
                বিস্তারিত শিখেছেন{" "}
                <Link href={lessonHref(step.lesson.id)} className="text-primary underline underline-offset-4">
                  {step.lesson.label}
                </Link>{" "}
                এ।
              </div>
            )}
          </div>

          {posture.lockedOut && (
            <div className="border border-primary p-3 bg-primary/10 text-[0.75rem] text-foreground leading-relaxed" data-field="lockout">
              <strong className="text-primary">আপনি নিজেকে বাইরে আটকে ফেলেছেন।</strong> root এর Login বন্ধ, অথচ
              deploy User এখনো নেই। পরের Login এ Server বলবে Permission denied (publickey)। ফেরার রাস্তা
              এখন শুধু Provider এর Web Console।
            </div>
          )}

          <div className="grid grid-cols-1 gap-2">
            {posture.items.map((item) => (
              <Status key={item.label} good={item.good} label={item.label} detail={item.detail} />
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. নিজেকে বাইরে আটকে ফেলার পাঁচটা আসল উপায়                                    */
/* ------------------------------------------------------------------------- */

const LOCKOUTS = [
  {
    id: "ufw-first",
    label: "OpenSSH allow না করেই ufw enable",
    did: "sudo ufw enable, কিন্তু ufw allow OpenSSH দেওয়া হয়নি",
    error: "ssh: connect to host mytours-vps-01 port 22: Connection timed out",
    why: "Firewall এর Default হলো ভেতরে আসা সব বন্ধ। Port 22 এর জন্য আলাদা অনুমতি নেই, তাই নতুন SSH এর প্রথম SYN টাও চুপচাপ ফেলে দেওয়া হচ্ছে। উত্তর আসে না বলে Laptop অপেক্ষা করে করে হাল ছাড়ে।",
    fix: "খোলা Session থেকে: sudo ufw allow OpenSSH। Session না থাকলে Provider এর Web Console থেকে একই কমান্ড।",
    openSessionSaves: true,
  },
  {
    id: "no-key",
    label: "Key কপি না করেই Password Login বন্ধ",
    did: "PasswordAuthentication no, অথচ deploy এর authorized_keys খালি",
    error: "deploy@mytours-vps-01: Permission denied (publickey).",
    why: "Server এখন শুধু Key মানে, আর deploy এর ঘরে কোনো Public Key নেই। Server আপনার Key দেখে, মেলানোর মতো কিছু পায় না, তাই প্রত্যাখ্যান।",
    fix: "খোলা root বা deploy Session থেকে rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy, তারপর নতুন Terminal এ আবার চেষ্টা।",
    openSessionSaves: true,
  },
  {
    id: "no-sudo",
    label: "deploy কে sudo group এ না দিয়ে root বন্ধ",
    did: "PermitRootLogin no, কিন্তু usermod -aG sudo deploy চালানো হয়নি",
    error: "deploy is not in the sudoers file.",
    why: "Login হয়, কিন্তু Server এর কোনো Setting বদলানোর ক্ষমতা নেই। root আর SSH দিয়ে ঢুকতে পারে না, তাই প্রশাসক হওয়ার কোনো দরজা খোলা নেই।",
    fix: "খোলা root Session থেকে usermod -aG sudo deploy। সেটা বন্ধ হয়ে গেলে Web Console এ root হিসেবে ঢুকে একই কমান্ড, কারণ Console SSH এর নিয়ম মানে না।",
    openSessionSaves: true,
  },
  {
    id: "bad-modes",
    label: "~/.ssh এর Permission 777",
    did: "chmod 777 /home/deploy/.ssh, সুবিধার জন্য ভেবে",
    error: "deploy@mytours-vps-01: Permission denied (publickey).",
    why: "sshd ঝুঁকি নেয় না। যে Folder এ যে কেউ লিখতে পারে, সেখানকার authorized_keys অন্য কেউ বদলে দিতে পারত, তাই sshd পুরোটাই অগ্রাহ্য করে। Server এর Log এ লেখা থাকে: Authentication refused: bad ownership or modes for directory /home/deploy/.ssh",
    fix: "chmod 700 /home/deploy/.ssh আর chmod 600 /home/deploy/.ssh/authorized_keys, মালিক deploy।",
    openSessionSaves: true,
  },
  {
    id: "wrong-name",
    label: "Hardening File এর নাম 99 দিয়ে শুরু",
    did: "99-hardening.conf এ PasswordAuthentication no, পাশে 50-cloud-init.conf এ yes",
    error: "কোনো Error নেই। Password দিয়ে Login এখনো চলে।",
    why: "এটা আটকে ফেলা নয়, তার চেয়েও খারাপ: আপনি ভাবছেন দরজা বন্ধ, আসলে খোলা। sshd প্রথম মানটা রাখে, আর 50 আগে পড়া হয় 99 এর চেয়ে।",
    fix: "File টার নাম 00-hardening.conf করুন, তারপর sudo sshd -T | grep passwordauthentication দিয়ে আসল মানটা দেখুন।",
    openSessionSaves: false,
  },
] as const;

export function LockoutLab() {
  const [pick, setPick] = useState<(typeof LOCKOUTS)[number]["id"]>("ufw-first");
  const [sessionOpen, setSessionOpen] = useState(true);
  const item = LOCKOUTS.find((l) => l.id === pick) ?? LOCKOUTS[0];
  const stuck = item.openSessionSaves && !sessionOpen;

  return (
    <Panel
      label="Interactive"
      title="নতুন Server এ নিজেকে আটকে ফেলার পাঁচটা আসল উপায়"
      footer="প্রতিটা ভুল অনুশীলনের Server এ সত্যি ঘটিয়ে Error গুলো তোলা। একটা ভুল বেছে নিন, তারপর উপরের সুইচটা বদলে দেখুন প্রথম Session খোলা থাকলে আর বন্ধ করে দিলে ফেরার রাস্তা কতটা আলাদা।"
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {LOCKOUTS.map((l) => (
          <Chip key={l.id} active={pick === l.id} onClick={() => setPick(l.id)} data-mistake={l.id}>
            {l.label}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
          প্রথম Session
        </span>
        <Chip active={sessionOpen} onClick={() => setSessionOpen(true)} data-session="open">
          খোলা রেখেছি
        </Chip>
        <Chip active={!sessionOpen} onClick={() => setSessionOpen(false)} data-session="closed">
          বন্ধ করে দিয়েছি
        </Chip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground mb-1">যা করেছিলেন</div>
            <div className="text-[0.8125rem] text-foreground">{item.did}</div>
          </div>
          <div>
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground mb-1">যা দেখবেন</div>
            <code className="block px-3 py-2 border border-border bg-muted/30 font-mono text-[0.75rem] text-foreground break-words" data-field="error">
              {item.error}
            </code>
          </div>
          <div>
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-muted-foreground mb-1">কেন</div>
            <div className="text-[0.8125rem] text-muted-foreground leading-relaxed">{item.why}</div>
          </div>
        </div>
        <div
          className={cn("border p-4 space-y-2", stuck ? "border-primary bg-primary/5" : "border-border")}
          data-field="recovery"
        >
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-primary">ফেরার রাস্তা</div>
          <div className="text-[0.8125rem] text-foreground leading-relaxed">{item.fix}</div>
          <div className="text-[0.75rem] text-muted-foreground leading-relaxed">
            {!item.openSessionSaves
              ? "এখানে আপনি বাইরে আটকাননি, তাই Session খোলা থাকা না থাকায় কিছু যায় আসে না। বিপদটা হলো আপনি জানেনই না যে দরজা খোলা।"
              : stuck
                ? "প্রথম Session বন্ধ, তাই SSH দিয়ে আর ফেরা যাবে না। Provider এর Dashboard এ Server এর Web Console বা Rescue খুলুন। সেখানে Server এর পর্দা সরাসরি আসে, SSH আর Firewall এর নিয়ম সেখানে খাটে না।"
                : "প্রথম Session এখনো খোলা, আর ufw বা sshd এর নতুন নিয়ম চলতি Connection কে কাটে না। সেই Terminal থেকেই উপরের কমান্ড চালান, এক মিনিটে ঠিক।"}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. একটা ভুল লুকিয়ে রাখুন, দেখুন কোন পরীক্ষা ধরে                                */
/* ------------------------------------------------------------------------- */

type MistakeId = "cloud-init" | "ufw-off" | "bind-all" | "not-enabled" | "old-dns";

const MISTAKES: { id: MistakeId; label: string }[] = [
  { id: "cloud-init", label: "Hardening File এর নাম 99" },
  { id: "ufw-off", label: "ufw কখনো enable হয়নি" },
  { id: "bind-all", label: "App শোনে 0.0.0.0:3000 এ" },
  { id: "not-enabled", label: "systemctl enable ভুলে গেছেন" },
  { id: "old-dns", label: "A Record এ পুরনো IP" },
];

function runChecks(m: Set<MistakeId>) {
  const portOpen = m.has("ufw-off") && m.has("bind-all");
  const port3000 = portOpen ? "open" : m.has("ufw-off") ? "closed" : "filtered";
  return [
    {
      check: "ssh root@198.51.100.42",
      expect: "Permission denied (publickey).",
      got: "Permission denied (publickey).",
      pass: true,
      note: "root বন্ধ রাখার Setting কোনো ভুলেই বদলায়নি।",
    },
    {
      check: "ssh -o PubkeyAuthentication=no deploy@...",
      expect: "Permission denied (publickey).",
      got: m.has("cloud-init") ? "deploy@198.51.100.42's password:" : "Permission denied (publickey).",
      pass: !m.has("cloud-init"),
      note: m.has("cloud-init")
        ? "Server Password চাইছে। মানে 50-cloud-init.conf এর yes জিতেছে।"
        : "Server শুধু Key মানে।",
    },
    {
      check: "nmap -Pn -p 22,80,443,3000 ...",
      expect: "3000/tcp filtered",
      got: `3000/tcp ${port3000}`,
      pass: port3000 === "filtered",
      note: portOpen
        ? "App সরাসরি Internet এ, Caddy আর HTTPS কে পাশ কাটিয়ে। দুইটা ভুল একসাথে হলেই এটা ঘটে।"
        : m.has("ufw-off")
          ? "closed মানে কেউ সেখানে শুনছে না, কিন্তু Firewall ও নেই। filtered হলে বুঝতেন Firewall উত্তর ফেলে দিচ্ছে।"
          : "Firewall টোকাটা চুপচাপ ফেলে দিচ্ছে।",
    },
    {
      check: "curl https://api.my-tours.example/health",
      expect: "HTTP/2 200",
      got: m.has("old-dns") ? "Connection timed out" : "HTTP/2 200",
      pass: !m.has("old-dns"),
      note: m.has("old-dns")
        ? "নামটা পুরনো IP তে যাচ্ছে। dig +short api.my-tours.example দিয়ে মিলিয়ে দেখুন (Module 04)।"
        : "নাম, Certificate, Caddy আর App, চারটাই ঠিক।",
    },
    {
      check: "sudo reboot, তারপর systemctl is-active my-tours-api",
      expect: "active",
      got: m.has("not-enabled") ? "inactive" : "active",
      pass: !m.has("not-enabled"),
      note: m.has("not-enabled")
        ? "start করেছিলেন, enable করেননি। আজ চলছিল, Reboot এর পরে আর উঠল না।"
        : "Boot এ systemd নিজেই চালু করেছে।",
    },
  ];
}

export function OutsideCheckLab() {
  const [mistakes, setMistakes] = useState<Set<MistakeId>>(new Set());

  function toggle(id: MistakeId) {
    setMistakes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const results = runChecks(mistakes);
  const failed = results.filter((r) => !r.pass).length;

  return (
    <Panel
      label="Interactive"
      title="Server এ একটা ভুল লুকান, দেখুন কোন পরীক্ষা ধরে"
      footer="উপরে এক বা একাধিক ভুল বেছে নিন, নিচে দেখুন বাইরে থেকে চালানো পাঁচটা পরীক্ষার কোনটা লাল হয়। খেয়াল করুন ufw বন্ধ থাকলেও 3000 এখনো খোলা দেখায় না, যতক্ষণ App 127.0.0.1 এ শোনে। দুইটা ভুল একসাথে হলেই দরজা হাট করে খোলে। তাই প্রতিটা পরীক্ষা একটা নির্দিষ্ট ভুল ধরার জন্য।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {MISTAKES.map((m) => (
          <Chip key={m.id} active={mistakes.has(m.id)} onClick={() => toggle(m.id)} data-plant={m.id}>
            {m.label}
          </Chip>
        ))}
      </div>
      <div className="mb-3 font-mono text-[0.6875rem] text-muted-foreground" data-field="failed">
        {failed === 0 ? "পাঁচটা পরীক্ষাই পাস" : `${failed}টা পরীক্ষা ব্যর্থ`}
      </div>
      <div className="space-y-2">
        {results.map((r) => (
          <div
            key={r.check}
            className={cn("grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-x-4 gap-y-1 px-3 py-2.5 border", r.pass ? "border-border" : "border-primary bg-primary/5")}
          >
            <div className="min-w-0">
              <code className="block font-mono text-[0.75rem] text-foreground break-words">{r.check}</code>
              <span className="block text-[0.6875rem] text-muted-foreground leading-relaxed">{r.note}</span>
            </div>
            <div className="min-w-0">
              <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
                প্রত্যাশা: {r.expect}
              </span>
              <span className={cn("block font-mono text-[0.75rem] break-words", r.pass ? "text-foreground" : "text-primary font-bold")}>
                {r.pass ? "✓ " : "✗ "}
                {r.got}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
