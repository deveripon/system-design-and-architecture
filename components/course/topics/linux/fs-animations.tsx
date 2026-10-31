/**
 * What: The interactive labs for Module 07 Lesson 01. FsExplorerLab walks the top level
 * folders of the Island Tours server one at a time. FsPathLab resolves a typed path from a
 * chosen current folder and shows every step. FsWhereLab asks where a real file belongs and
 * explains each wrong answer.
 *
 * Why: Paths and the folder map only stick once the reader has guessed and been corrected.
 * All three labs are pure: every value is derived from state set in an event handler, never
 * from an effect, and the command output shown in FsExplorerLab was captured on the practice
 * server used to write this lesson.
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

/* ------------------------------------------------------------------------- */
/* 1. Folder ধরে ধরে ঘোরা                                                       */
/* ------------------------------------------------------------------------- */

type Care = "yours" | "careful" | "readonly";

const CARE_LABEL: Record<Care, string> = {
  yours: "আপনার কাজের জায়গা",
  careful: "সাবধানে বদলান",
  readonly: "শুধু দেখুন, হাত দেবেন না",
};

type FolderInfo = {
  path: string;
  short: string;
  what: string;
  windows: string;
  island: string;
  care: Care;
  command: string;
  output: string;
};

const FOLDERS: FolderInfo[] = [
  {
    path: "/etc",
    short: "Setting",
    what: "প্রায় সব Program এর Setting File। নামটা পুরনো, কিন্তু আজ মনে রাখার সহজ উপায়: Editable Text Configuration। এখানে প্রায় সবই সাধারণ Text, যেকোনো Editor এ খোলা যায়।",
    windows: "Control Panel আর Registry এর কাজটা, তবে সাধারণ File হিসেবে",
    island: "/etc/caddy/Caddyfile, /etc/islandtours/api.env, /etc/ssh/sshd_config",
    care: "careful",
    command: "ls /etc/caddy /etc/islandtours",
    output: "/etc/caddy:\nCaddyfile\n\n/etc/islandtours:\napi.env",
  },
  {
    path: "/var",
    short: "বদলাতে থাকা জিনিস",
    what: "যা চলতে চলতে বাড়ে আর বদলায়: Log, Database এর File, Cache, Mail এর লাইন, Backup। নামটা Variable থেকে। Disk ভরে গেলে প্রথম সন্দেহ এই Folder।",
    windows: "ProgramData আর Logs এর মিশ্রণ",
    island: "/var/log/caddy, /var/lib/caddy, /var/lib/docker, /var/backups/islandtours",
    care: "careful",
    command: "ls /var",
    output: "backups  cache  lib  local  lock  log  mail  opt  run  spool  tmp",
  },
  {
    path: "/usr",
    short: "Install করা Program",
    what: "Package Manager যা বসায় তার বেশিরভাগ: Program (/usr/bin), Library (/usr/lib), নথি (/usr/share)। আপনি নিজে হাত দেন না, apt দেয়। নিজের বানানো বা হাতে নামানো Program যায় /usr/local এ।",
    windows: "C:\\Program Files",
    island: "/usr/bin/caddy, /usr/lib/systemd/system/caddy.service",
    care: "readonly",
    command: "ls /usr/bin | wc -l",
    output: "504",
  },
  {
    path: "/home",
    short: "মানুষের Folder",
    what: "প্রতিটা মানুষ User এর নিজের Folder, যেমন /home/deploy। নিজের Setting (লুকানো .bashrc), নিজের SSH Key, নিজের Note এখানে। Prompt এ ~ দেখলে বুঝবেন আপনি এখানে আছেন।",
    windows: "C:\\Users\\আপনার নাম",
    island: "/home/deploy/.ssh/authorized_keys",
    care: "yours",
    command: "ls -l /home",
    output: "drwxr-x--- 2 deploy deploy 4096 Oct 31 07:23 deploy",
  },
  {
    path: "/root",
    short: "root এর Home",
    what: "সবচেয়ে ক্ষমতাবান User root এর নিজের Folder। এটা /home এর ভেতরে নয়, যাতে /home আলাদা Disk এ থাকলেও root ঢুকতে পারে। অন্য কেউ এর ভেতরে তাকাতেও পারে না।",
    windows: "Administrator এর নিজের Folder",
    island: "প্রায় খালি থাকে, কারণ Island Tours এ root হয়ে কেউ ঢোকে না",
    care: "readonly",
    command: "ls -ld /root",
    output: "drwx------ 1 root root 4096 Oct 31 07:15 /root",
  },
  {
    path: "/srv",
    short: "এই Server যা পরিবেশন করে",
    what: "Server টা বাইরের দুনিয়াকে যা দেয় তার Data আর Code রাখার জন্য রাখা জায়গা। নতুন Server এ খালি থাকে। Island Tours নিজের App এর Release গুলো এখানে রাখে।",
    windows: "নির্দিষ্ট কোনো মিল নেই, একটা নিজের বানানো D:\\Sites এর মতো",
    island: "/srv/islandtours/releases, /srv/islandtours/current",
    care: "yours",
    command: "ls -l /srv/islandtours",
    output: "lrwxrwxrwx 1 root root 41 Oct 31 07:25 current -> /srv/islandtours/releases/2026-10-31_0915\ndrwxr-xr-x 4 root root 4096 Oct 31 07:25 releases",
  },
  {
    path: "/opt",
    short: "নিজের ঘরে থাকা Program",
    what: "যে Program একটা Folder হয়ে আসে আর নিজের সবকিছু নিজের ভেতরেই রাখে, যেমন কোনো Vendor এর Agent। apt এর নিয়ম মানে না বলে আলাদা ঘর।",
    windows: "C:\\Program Files এ একটা নিজস্ব Folder",
    island: "খালি। Island Tours এর সব Program apt বা Docker দিয়ে আসে",
    care: "careful",
    command: "ls /opt",
    output: "(কিছু নেই)",
  },
  {
    path: "/tmp",
    short: "অস্থায়ী",
    what: "যে কেউ লিখতে পারে, কিন্তু কেউ অন্যের File মুছতে পারে না। Restart এ বা কয়েকদিন পর পরিষ্কার হতে পারে, তাই দরকারি কিছু এখানে কখনো নয়।",
    windows: "%TEMP%",
    island: "Upload চলার সময়ের অর্ধেক File",
    care: "yours",
    command: "ls -ld /tmp",
    output: "drwxrwxrwt 1 root root 4096 Oct 31 07:25 /tmp",
  },
  {
    path: "/proc",
    short: "Kernel এর জানালা",
    what: "এখানের কোনো File Disk এ নেই। প্রতিবার পড়ার সময় Kernel তখনকার অবস্থা দিয়ে File টা বানিয়ে দেয়। প্রতিটা চলমান Process এর নিজের একটা Folder, নাম তার PID।",
    windows: "Task Manager এর ভেতরের তথ্য, তবে File হিসেবে",
    island: "/proc/382/cmdline বলে Caddy কোন Setting নিয়ে চলছে",
    care: "readonly",
    command: "tr '\\0' ' ' < /proc/$(pgrep -x caddy)/cmdline",
    output: "/usr/bin/caddy run --environ --config /etc/caddy/Caddyfile",
  },
  {
    path: "/dev",
    short: "যন্ত্রগুলো, File হিসেবে",
    what: "Disk, Terminal আর কিছু বিশেষ যন্ত্র File হিসেবে দেখা যায়। /dev/null সব খেয়ে ফেলে, /dev/zero শুধু শূন্য দেয়, /dev/urandom এলোমেলো Byte দেয়।",
    windows: "Device Manager, তবে File হিসেবে",
    island: "Script এ অপ্রয়োজনীয় Output ফেলে দিতে 2>/dev/null",
    care: "readonly",
    command: "ls -l /dev/null /dev/urandom",
    output: "crw-rw-rw- 1 root root 1, 3 Oct 31 07:23 /dev/null\ncrw-rw-rw- 1 root root 1, 9 Oct 31 07:23 /dev/urandom",
  },
  {
    path: "/run",
    short: "এই Boot এর চলমান অবস্থা",
    what: "Memory তে থাকা ছোট ছোট File: কোন Process এর PID কত, কোন Socket কোথায়। Restart দিলেই সব মুছে যায়, আর সেটাই উদ্দেশ্য।",
    windows: "নির্দিষ্ট কোনো মিল নেই",
    island: "systemd আর Docker এর Socket এখানে থাকে",
    care: "readonly",
    command: "ls /run",
    output: "credentials  crond.pid  dbus  lock  log  mount  sudo  systemd  user  utmp",
  },
  {
    path: "/boot",
    short: "চালু হওয়ার File",
    what: "Kernel আর Boot এর জন্য দরকারি File। Kernel Update হলে apt নিজেই এখানে লেখে। হাতে কিছু মুছলে Server আর চালু নাও হতে পারে।",
    windows: "System Reserved Partition",
    island: "Ubuntu এর Kernel Update এ নিজে থেকে বদলায়",
    care: "readonly",
    command: "ls /boot",
    output: "(এই অনুশীলনের যন্ত্রটা Container, তাই খালি। আসল VPS এ vmlinuz আর initrd.img দেখবেন)",
  },
];

export function FsExplorerLab() {
  const [path, setPath] = useState<string>("/etc");
  const folder = FOLDERS.find(f => f.path === path) ?? FOLDERS[0];
  return (
    <Panel
      label="Lab"
      title="Server এর প্রতিটা ঘরে একবার ঢুকুন"
      footer={
        <>
          প্রতিটা Folder চাপুন। ভাবুন Island Tours এ এখানে কী থাকবে, তারপর মিলিয়ে নিন। নিচের
          Command আর তার Output এই লেসন লেখার সময় অনুশীলনের Server এ সত্যি চালিয়ে পাওয়া।
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {FOLDERS.map(f => (
          <Chip key={f.path} active={f.path === path} onClick={() => setPath(f.path)}>
            {f.path}
          </Chip>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-xl font-bold text-primary">{folder.path}</span>
            <span className="text-sm text-muted-foreground">{folder.short}</span>
          </div>
          <p className="text-sm leading-relaxed">{folder.what}</p>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">
                Windows এ যেমন
              </dt>
              <dd>{folder.windows}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">
                Island Tours এ
              </dt>
              <dd className="font-mono text-[0.8125rem]">{folder.island}</dd>
            </div>
          </dl>
          <span
            className={cn(
              "inline-block px-2 py-1 border font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em]",
              folder.care === "yours" && "border-primary text-primary",
              folder.care === "careful" && "border-amber-500/60 text-amber-600 dark:text-amber-400",
              folder.care === "readonly" && "border-border text-muted-foreground",
            )}
          >
            {CARE_LABEL[folder.care]}
          </span>
        </div>
        <div className="border border-border bg-muted/30">
          <div className="px-4 py-2 border-b border-border font-mono text-[0.75rem] text-muted-foreground">
            deploy@island-vps-01:~$ {folder.command}
          </div>
          <pre className="px-4 py-3 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap break-words">
            {folder.output}
          </pre>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Path টা শেষে কোথায় গিয়ে দাঁড়ায়                                               */
/* ------------------------------------------------------------------------- */

const HOME = "/home/deploy";

const START_DIRS = ["/home/deploy", "/etc/caddy", "/var/log/caddy", "/srv/islandtours"] as const;

const SAMPLE_PATHS = [
  "Caddyfile",
  "..",
  "../..",
  "../../backups/islandtours",
  "/etc/caddy",
  "~",
  "~/practice/notes",
  "./releases",
  ".",
  "../caddy/./Caddyfile",
] as const;

type Step = { part: string; result: string; note: string };

/**
 * Resolves `typed` against `cwd` the way the shell does for plain folders, one part at a
 * time. Symbolic links are not followed: the lab is about the path text, and the lesson
 * shows `pwd -P` separately for links.
 */
export function resolvePath(cwd: string, typed: string): { kind: string; steps: Step[]; final: string } {
  const text = typed.trim();
  let stack: string[];
  let kind: string;
  const steps: Step[] = [];
  let rest: string;
  if (text.startsWith("~")) {
    kind = "~ দিয়ে শুরু, মানে Home থেকে";
    stack = HOME.split("/").filter(Boolean);
    steps.push({ part: "~", result: HOME, note: "~ মানে আপনার Home Folder" });
    rest = text.slice(1);
  } else if (text.startsWith("/")) {
    kind = "Absolute Path, / থেকে শুরু";
    stack = [];
    steps.push({ part: "/", result: "/", note: "শুরু একদম গোড়া থেকে, এখন কোথায় আছেন তাতে কিছু যায় আসে না" });
    rest = text;
  } else {
    kind = "Relative Path, এখন যেখানে আছেন সেখান থেকে";
    stack = cwd.split("/").filter(Boolean);
    steps.push({ part: "(শুরু)", result: cwd, note: "এখন যে Folder এ আছেন, সেখান থেকে হাঁটা শুরু" });
    rest = text;
  }
  for (const part of rest.split("/").filter(Boolean)) {
    if (part === ".") {
      steps.push({ part, result: "/" + stack.join("/"), note: ". মানে এই Folder টাই, কোথাও যাওয়া হয় না" });
    } else if (part === "..") {
      stack.pop();
      steps.push({ part, result: "/" + stack.join("/"), note: ".. মানে এক ধাপ উপরে, মা Folder এ" });
    } else {
      stack.push(part);
      steps.push({ part, result: "/" + stack.join("/"), note: `${part} নামের জিনিসটার ভেতরে বা সেটাকে` });
    }
  }
  return { kind, steps, final: "/" + stack.join("/") };
}

export function FsPathLab() {
  const [cwd, setCwd] = useState<string>(START_DIRS[2]);
  const [typed, setTyped] = useState<string>("../../backups/islandtours");
  const result = typed.trim() ? resolvePath(cwd, typed) : null;
  return (
    <Panel
      label="Lab"
      title="Path টা শেষে কোথায় গিয়ে দাঁড়ায়"
      footer={
        <>
          একটা শুরুর Folder বাছুন, তারপর একটা Path চাপুন বা নিজে লিখুন। Lab টা Shell এর মতো করেই
          প্রতিটা অংশ বাম থেকে ডানে একটা একটা করে মেলায়। লক্ষ করুন, / দিয়ে শুরু হলে শুরুর Folder
          বদলালেও উত্তর বদলায় না।
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground mb-2">
            এখন আপনি আছেন (pwd)
          </div>
          <div className="flex flex-wrap gap-2">
            {START_DIRS.map(d => (
              <Chip key={d} active={d === cwd} onClick={() => setCwd(d)}>
                {d}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground mb-2">
            আপনি লিখলেন cd ...
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {SAMPLE_PATHS.map(p => (
              <Chip key={p} active={p === typed} onClick={() => setTyped(p)}>
                {p}
              </Chip>
            ))}
          </div>
          <label className="flex items-center gap-2 border border-border bg-muted/30 px-3 py-2 font-mono text-[0.8125rem]">
            <span className="text-muted-foreground shrink-0">cd</span>
            <input
              value={typed}
              onChange={e => setTyped(e.target.value)}
              spellCheck={false}
              aria-label="Path লিখুন"
              className="flex-1 min-w-0 bg-transparent outline-none"
            />
          </label>
        </div>
        {result && (
          <div className="border border-border">
            <div className="px-4 py-2 border-b border-border text-sm">{result.kind}</div>
            <ol className="divide-y divide-border">
              {result.steps.map((s, i) => (
                <li key={i} className="grid grid-cols-[6rem_1fr] md:grid-cols-[7rem_16rem_1fr] gap-x-4 gap-y-1 px-4 py-2 text-sm">
                  <span className="font-mono font-bold text-primary">{s.part}</span>
                  <span className="font-mono text-[0.8125rem] break-all">{s.result}</span>
                  <span className="col-span-2 md:col-span-1 text-muted-foreground">{s.note}</span>
                </li>
              ))}
            </ol>
            <div className="px-4 py-3 border-t border-border bg-primary/5 flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground">
                pwd এখন দেখাবে
              </span>
              <span className="font-mono font-bold text-primary break-all">{result.final}</span>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. এই File টা কোথায় রাখবেন                                                   */
/* ------------------------------------------------------------------------- */

type Choice = { path: string; why: string; right?: boolean };

type Placement = { item: string; choices: Choice[] };

const PLACEMENTS: Placement[] = [
  {
    item: "my-tours এর নতুন Caddyfile",
    choices: [
      { path: "/etc/caddy/Caddyfile", why: "ঠিক। Setting থাকে /etc এ, আর Caddy এর Service ঠিক এই Path টাই খোঁজে।", right: true },
      { path: "/home/deploy/Caddyfile", why: "আপনার Home এ রাখলে Caddy জানেই না। তাছাড়া Setting এক মানুষের Folder এ থাকলে সেই মানুষ চলে গেলে সমস্যা।" },
      { path: "/usr/bin/Caddyfile", why: "/usr/bin শুধু Program এর জন্য, আর এখানে apt ছাড়া কেউ লেখে না।" },
      { path: "/tmp/Caddyfile", why: "/tmp যেকোনো সময় পরিষ্কার হতে পারে। Restart এর পর Caddy আর Setting খুঁজে পাবে না।" },
    ],
  },
  {
    item: "API এর Secret ভরা Environment File",
    choices: [
      { path: "/srv/islandtours/current/.env", why: "Code এর পাশে রাখলে প্রতিটা Deploy এ হারায়, আর Code এর সাথে ভুল করে git এ চলে যাওয়ার ঝুঁকি থাকে।" },
      { path: "/etc/islandtours/api.env", why: "ঠিক। Setting তাই /etc, App এর নিজের নামে একটা Folder, আর Permission এমনভাবে যে শুধু App পড়তে পারে (লেসন ০৪, ০৫)।", right: true },
      { path: "/var/log/islandtours/api.env", why: "/var/log এ Log থাকে, অনেকে পড়তে পারে, আর Log ঘোরানোর Tool পুরনো File মুছে দেয়।" },
      { path: "/home/deploy/api.env", why: "deploy একজন মানুষ। App টা অন্য User হয়ে চলে, সে deploy এর Home এ ঢুকতেই পারবে না।" },
    ],
  },
  {
    item: "রাতের Database Backup",
    choices: [
      { path: "/tmp/backup.sql.gz", why: "/tmp এ রাখা Backup মানে Backup না রাখা। যেকোনো Restart এ যেতে পারে।" },
      { path: "/var/backups/islandtours/", why: "ঠিক। বদলাতে থাকা Data তাই /var, আর /var/backups ঠিক এই কাজের জন্যই। তবু মনে রাখুন, একই Server এ রাখা Backup Server হারালে সাথে হারায়, তাই একটা কপি বাইরেও যায়।", right: true },
      { path: "/etc/islandtours/backup.sql.gz", why: "/etc এ Setting থাকে। এখানে বড় বড় Data File রাখলে Setting এর Backup ও অকারণে ভারী হয়।" },
      { path: "/usr/local/backups/", why: "/usr এ Program থাকে, Data নয়। Data আর Program আলাদা রাখলেই Disk এর হিসাব সহজ হয়।" },
    ],
  },
  {
    item: "App এর চালু Code, প্রতিটা Release",
    choices: [
      { path: "/srv/islandtours/releases/", why: "ঠিক। Server যা পরিবেশন করে তার জন্য /srv, আর প্রতিটা Release আলাদা Folder এ, current তীরটা চালুটাকে দেখায়।", right: true },
      { path: "/root/app/", why: "root এর Home এ রাখলে App চালানো User ভেতরে ঢুকতেই পারবে না, আর root হয়ে App চালানো বিপজ্জনক।" },
      { path: "/var/www/html/", why: "এটা পুরনো Apache যুগের Default, Static পাতার জন্য চলে। চলবে, কিন্তু Island Tours এর নিয়মে App থাকে /srv এ।" },
      { path: "/usr/bin/islandtours/", why: "/usr/bin এ শুধু apt এর বসানো Program। নিজের App এখানে রাখলে পরের Upgrade এ ঝামেলা।" },
    ],
  },
  {
    item: "নিজে Build করা একটা ছোট Tool",
    choices: [
      { path: "/usr/bin/", why: "এখানে apt এর রাজত্ব। একই নামের Package পরে এলে আপনার File চুপচাপ মুছে যাবে।" },
      { path: "/usr/local/bin/", why: "ঠিক। নিজের বসানো Program এর জন্যই /usr/local, apt এখানে হাত দেয় না, আর এটা PATH এ আগে থেকেই আছে।", right: true },
      { path: "/etc/", why: "/etc এ Program নয়, Setting।" },
      { path: "/proc/", why: "/proc এ কিছু লেখা যায় না, এটা Kernel এর জানালা, Disk এ কিছুই নেই।" },
    ],
  },
  {
    item: "Caddy এর Access Log",
    choices: [
      { path: "/var/log/caddy/access.log", why: "ঠিক। Log মানে বদলাতে থাকা Data, তাই /var/log, আর Program এর নিজের নামে Folder।", right: true },
      { path: "/etc/caddy/access.log", why: "Log প্রতি সেকেন্ডে বাড়ে। /etc এ রাখলে Setting এর Folder ভারী হয়, আর Setting এর Backup এ অকারণে Log ঢোকে।" },
      { path: "/home/deploy/access.log", why: "Caddy নিজের User হয়ে চলে, deploy এর Home এ সে লিখতে পারবে না।" },
      { path: "/dev/null", why: "এখানে লিখলে সব হারিয়ে যায়। কোনো সমস্যা হলে খোঁজার কিছু থাকবে না।" },
    ],
  },
];

export function FsWhereLab() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const score = Object.entries(answers).filter(([q, c]) => PLACEMENTS[Number(q)].choices[c]?.right).length;
  return (
    <Panel
      label="Lab"
      title="এই File টা কোথায় রাখবেন"
      footer={
        <>
          প্রতিটা প্রশ্নে একটা ঘর বাছুন। ভুল উত্তরেও ব্যাখ্যা আসবে, আর ভুলগুলো পড়াই আসল শেখা,
          কারণ বাস্তবে মানুষ ঠিক এই ভুলগুলোই করে। এখন পর্যন্ত ঠিক: {score} / {PLACEMENTS.length}
        </>
      }
    >
      <div className="space-y-6">
        {PLACEMENTS.map((p, qi) => {
          const picked = answers[qi];
          const choice = picked === undefined ? null : p.choices[picked];
          return (
            <div key={p.item} className="border border-border">
              <div className="px-4 py-3 border-b border-border text-sm font-bold">{p.item}</div>
              <div className="p-4 flex flex-wrap gap-2">
                {p.choices.map((c, ci) => (
                  <Chip key={c.path} active={picked === ci} onClick={() => setAnswers(a => ({ ...a, [qi]: ci }))}>
                    {c.path}
                  </Chip>
                ))}
              </div>
              {choice && (
                <div
                  className={cn(
                    "px-4 py-3 border-t border-border text-sm flex gap-3 items-start",
                    choice.right ? "bg-primary/5" : "bg-muted/30",
                  )}
                >
                  {choice.right ? (
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <span>{choice.why}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
