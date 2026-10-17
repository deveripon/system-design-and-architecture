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

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto border border-border bg-background px-3 py-2 font-mono text-[0.75rem] leading-relaxed text-foreground whitespace-pre">
      {children}
    </pre>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. কোন পথে ইনস্টল করবেন                                                    */
/* ------------------------------------------------------------------------- */

type InstallPath = {
  id: string;
  label: string;
  who: string;
  steps: string[];
  connect: string;
  superuser: string;
  startStop: string;
  remove: string;
};

const PATHS: InstallPath[] = [
  {
    id: "postgres-app",
    label: "Mac: Postgres.app",
    who: "Mac এ সবচেয়ে সহজ পথ। Terminal এর ঝামেলা কম, একটা অ্যাপ খুললেই Server চালু, বন্ধ করলেই বন্ধ।",
    steps: [
      "postgresapp.com থেকে নামিয়ে Applications ফোল্ডারে সরান, তারপর Double Click",
      "অ্যাপের ভেতরে Initialize চাপুন, নতুন Server তৈরি হবে",
      "Terminal থেকে psql চালাতে PATH ঠিক করুন (নিচের লাইন), তারপর নতুন Terminal খুলুন",
    ],
    connect:
      "sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp\npsql",
    superuser: "আপনার Mac এর লগইন নাম, আর সেই নামেই একটা Database",
    startStop: "অ্যাপের ভেতরের Start আর Stop বাটন",
    remove: "অ্যাপ বন্ধ করে Trash এ ফেলুন, আর নিজের বানানো PATH ফাইলটা মুছুন: sudo rm /etc/paths.d/postgresapp",
  },
  {
    id: "homebrew",
    label: "Mac: Homebrew",
    who: "যাঁরা Terminal এ স্বচ্ছন্দ আর Homebrew দিয়েই সব কিছু রাখেন। একটা Command এ ইনস্টল, একটা Command এ চালু।",
    steps: [
      "brew install postgresql@18",
      "Formula টা keg-only, তাই psql PATH এ নিজে আসে না, PATH এ যোগ করুন",
      "brew services start postgresql@18, Server চালু হলো আর লগইনের সময় নিজে চালু হবে",
    ],
    connect:
      "echo 'export PATH=\"/opt/homebrew/opt/postgresql@18/bin:$PATH\"' >> ~/.zshrc\nsource ~/.zshrc\npsql postgres",
    superuser: "আপনার Mac এর লগইন নাম। postgres নামে কোনো Role থাকে না",
    startStop: "brew services start postgresql@18 / brew services stop postgresql@18",
    remove:
      "brew services stop postgresql@18, তারপর brew uninstall postgresql@18। Data Directory /opt/homebrew/var/postgresql@18 থেকে যায়, দরকার না থাকলে নিজে মুছুন",
  },
  {
    id: "windows",
    label: "Windows: EDB Installer",
    who: "Windows এ PostgreSQL এর নিজের Download পাতা এই Installer টাই দেখায়। Next চেপে চেপে শেষ।",
    steps: [
      "postgresql.org/download/windows থেকে EDB এর Installer নিন, প্রয়োজনে Run as Administrator",
      "Component এ PostgreSQL Server আর Command Line Tools রাখুন, pgAdmin 4 রাখতে পারেন",
      "postgres Superuser এর Password দিন, Port 5432 রাখুন, শেষে Stack Builder এর টিক তুলে দিলেও চলে",
      "C:\\Program Files\\PostgreSQL\\18\\bin ফোল্ডারটা Path এ যোগ করে নতুন Terminal খুলুন",
    ],
    connect: "psql -U postgres",
    superuser: "postgres, Installer এ যে Password দিয়েছেন",
    startStop: "Windows এর Services অ্যাপে PostgreSQL এর Service",
    remove: "Windows Settings এর Apps তালিকা থেকে PostgreSQL Uninstall করুন",
  },
  {
    id: "ubuntu",
    label: "Ubuntu / Debian",
    who: "Linux Laptop আর বেশিরভাগ VPS। PostgreSQL এর নিজের apt Repository থেকে নিলে সবসময় নতুন Version পাবেন।",
    steps: [
      "sudo apt install -y postgresql-common",
      "sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh",
      "sudo apt update && sudo apt install postgresql-18",
      "ইনস্টলের সাথেই একটা Cluster তৈরি হয় আর Service চালু থাকে",
    ],
    connect: "sudo systemctl status postgresql\nsudo -u postgres psql",
    superuser: "postgres, আর Login হয় Peer দিয়ে: OS এর postgres ব্যবহারকারী হয়েই ঢুকতে হয়",
    startStop: "sudo systemctl start postgresql / sudo systemctl stop postgresql",
    remove: "sudo apt remove postgresql-18। Data আর Config থেকে যায় /var/lib/postgresql আর /etc/postgresql এ",
  },
  {
    id: "docker",
    label: "Docker",
    who: "যেকোনো OS এ হুবহু একই। দুটো Version পাশাপাশি চালানো, আর কাজ শেষে পুরোটা মুছে ফেলা সবচেয়ে সহজ। অনেক টিম এভাবেই কাজ করে।",
    steps: [
      "Password টা Shell এ একবার নিন, কোনো Command এ সরাসরি লিখবেন না",
      "একটা Named Volume তৈরি করুন, Data সেখানে থাকবে",
      "postgres:18 Image দিয়ে Container চালান, Port শুধু 127.0.0.1 এ খুলুন",
    ],
    connect:
      "printf 'Password: '; read -rs POSTGRES_PASSWORD; echo; export POSTGRES_PASSWORD\ndocker volume create island-pg-data\ndocker run -d --name island-pg \\\n  -e POSTGRES_PASSWORD=\"$POSTGRES_PASSWORD\" \\\n  -p 127.0.0.1:5432:5432 \\\n  -v island-pg-data:/var/lib/postgresql \\\n  postgres:18\ndocker exec -it island-pg psql -U postgres",
    superuser: "postgres, আর Password যেটা POSTGRES_PASSWORD এ দিয়েছেন",
    startStop: "docker stop island-pg / docker start island-pg",
    remove: "docker rm -f island-pg, আর Data সহ মুছতে docker volume rm island-pg-data",
  },
];

export function InstallPathLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(PATHS[1].id);
  const path = PATHS.find((p) => p.id === active) ?? PATHS[0];

  return (
    <Panel
      label="Interactive"
      title="আপনার কম্পিউটারের জন্য পথ বাছুন"
      footer="প্রতিটা পথের শেষ গন্তব্য একই: একটা চালু PostgreSQL Server আর একটা psql যা তার সাথে কথা বলতে পারে। পথগুলো আলাদা শুধু তিন জায়গায়: কে Server চালু রাখে, Superuser কে, আর psql কোথায় থাকে।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {PATHS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-path={p.id}
            aria-pressed={p.id === active}
            onClick={() => setActive(p.id)}
            className={cn(BTN, p.id === active ? BTN_ON : BTN_OFF)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <motion.div
        key={path.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-active-path={path.id}
        className="space-y-5"
      >
        <p className="text-sm leading-relaxed text-foreground">{path.who}</p>
        <ol className="space-y-2">
          {path.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              <span className="font-mono text-[0.6875rem] font-bold text-primary pt-0.5">
                {toBn(i + 1)}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div>
          <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
            Terminal এ
          </div>
          <Code>{path.connect}</Code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            ["Superuser", path.superuser],
            ["চালু আর বন্ধ", path.startStop],
            ["মুছে ফেলা", path.remove],
          ].map(([title, text]) => (
            <div key={title} className="border border-border bg-background p-3">
              <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary mb-1.5">
                {title}
              </div>
              <p className="text-[0.75rem] leading-relaxed text-muted-foreground break-words">{text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একই psql, চার রকম কম্পিউটারে চার রকম ফল                                  */
/* ------------------------------------------------------------------------- */

type Machine = "homebrew" | "ubuntu" | "docker" | "windows";
type Command = "plain" | "db" | "user" | "tcp";

const MACHINES: { id: Machine; label: string; context: string }[] = [
  {
    id: "homebrew",
    label: "Mac + Homebrew",
    context: "লগইন নাম rahim। Homebrew এর Cluster তৈরি হয়েছে rahim এর নামে, Database আছে শুধু postgres, template0, template1। নিজের কম্পিউটারে ঢোকার নিয়ম trust।",
  },
  {
    id: "ubuntu",
    label: "Ubuntu",
    context: "লগইন নাম rahim। Server এ শুধু postgres Role আছে। Socket দিয়ে ঢোকার নিয়ম peer: OS এর নাম আর Role এর নাম মিলতে হবে।",
  },
  {
    id: "docker",
    label: "Docker থেকে",
    context: "Mac এর Terminal, নিজের কোনো PostgreSQL চলছে না। island-pg Container চলছে, Port 127.0.0.1:5432 খোলা। Container এর বাইরে থেকে ঢুকতে Password লাগে।",
  },
  {
    id: "windows",
    label: "Windows + EDB",
    context: "লগইন নাম rahim। Installer শুধু postgres Superuser বানিয়েছে, যার Password আপনি দিয়েছেন। Windows এ psql সবসময় localhost এ TCP দিয়ে যায়, আর সেখানে Password লাগে।",
  },
];

const COMMANDS: { id: Command; text: string; filled: string }[] = [
  { id: "plain", text: "psql", filled: "user = আপনার OS এর নাম, database = সেই একই নাম" },
  { id: "db", text: "psql postgres", filled: "user = আপনার OS এর নাম, database = postgres" },
  { id: "user", text: "psql -U postgres", filled: "user = postgres, database = postgres" },
  { id: "tcp", text: "psql -h 127.0.0.1 -U postgres", filled: "TCP দিয়ে 127.0.0.1:5432, user = postgres" },
];

type Result = { ok: boolean; output: string; why: string; fix?: string };

const RESULTS: Record<Machine, Record<Command, Result>> = {
  homebrew: {
    plain: {
      ok: false,
      output: 'psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL:  database "rahim" does not exist',
      why: "Role rahim আছে, তাই পরিচয় পার। কিন্তু psql নিজে থেকে rahim নামের Database খুঁজল, যেটা Homebrew বানায় না।",
      fix: "psql postgres লিখুন, অথবা একবার createdb চালিয়ে নিজের নামের Database বানিয়ে নিন",
    },
    db: {
      ok: true,
      output: 'psql (18.6 (Homebrew))\nType "help" for help.\n\npostgres=#',
      why: "Role rahim আছে, Database postgres আছে, নিয়ম trust। তিনটাই মিলেছে।",
    },
    user: {
      ok: false,
      output: 'psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL:  role "postgres" does not exist',
      why: "Homebrew Cluster বানায় আপনার নামে। postgres নামে কোনো Role নেই, তাই অন্য টিউটোরিয়ালের psql -U postgres এখানে চলে না।",
      fix: "-U না দিয়ে নিজের নামেই ঢুকুন। দরকার হলে createuser -s postgres দিয়ে Role টা বানিয়ে নিতে পারেন",
    },
    tcp: {
      ok: false,
      output: 'psql: error: connection to server at "127.0.0.1", port 5432 failed: FATAL:  role "postgres" does not exist',
      why: "TCP দিয়ে গেলেও একই কথা। দরজা পার হয়েছেন, কিন্তু postgres নামে কেউ ভেতরে নেই।",
      fix: "-U rahim, মানে নিজের নাম দিন",
    },
  },
  ubuntu: {
    plain: {
      ok: false,
      output: 'psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  role "rahim" does not exist',
      why: "Peer নিয়মে OS এর নাম rahim আর চাওয়া Role rahim মিলেছে। কিন্তু Server এ rahim নামে কোনো Role নেই।",
      fix: "sudo -u postgres createuser --superuser rahim, তারপর createdb। এর পরে শুধু psql লিখলেই চলবে",
    },
    db: {
      ok: false,
      output: 'psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  role "rahim" does not exist',
      why: "Database এর নাম দিলেও user এখনো rahim। পরিচয়ের ধাপেই আটকে গেল, Database পর্যন্ত যাওয়াই হয়নি।",
      fix: "আগের মতোই rahim এর জন্য Role বানান",
    },
    user: {
      ok: false,
      output: 'psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  Peer authentication failed for user "postgres"',
      why: "Peer নিয়ম বলে OS এর নাম আর Role এর নাম এক হতে হবে। আপনি OS এ rahim, অথচ চাইছেন postgres হতে।",
      fix: "sudo -u postgres psql, মানে OS এও postgres হয়ে ঢুকুন",
    },
    tcp: {
      ok: false,
      output: 'Password for user postgres:\npsql: error: connection to server at "127.0.0.1", port 5432 failed: FATAL:  password authentication failed for user "postgres"',
      why: "TCP দিয়ে এলে Peer খাটে না, Ubuntu তে সেখানে নিয়ম scram-sha-256, মানে Password লাগে। Ubuntu এর নিজের Docs আগে ALTER USER দিয়ে postgres এর Password সেট করে নিতে বলে। সেট না করা পর্যন্ত এই পথে ঢোকা যায় না।",
      fix: "Socket দিয়েই ঢুকুন (sudo -u postgres psql), অথবা ALTER ROLE দিয়ে Password সেট করুন, Module 16 এ বিস্তারিত",
    },
  },
  docker: {
    plain: {
      ok: false,
      output: 'psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory\n\tIs the server running locally and accepting connections on that socket?',
      why: "-h না দিলে psql নিজের কম্পিউটারের Socket খোঁজে। Server আছে Container এর ভেতরে, Mac এ কোনো Socket নেই।",
      fix: "-h 127.0.0.1 দিন, অথবা docker exec -it island-pg psql -U postgres",
    },
    db: {
      ok: false,
      output: 'psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory\n\tIs the server running locally and accepting connections on that socket?',
      why: "Database এর নাম দিলেও psql এখনো ভুল জায়গায় খুঁজছে, নিজের কম্পিউটারের Socket এ।",
      fix: "-h 127.0.0.1 -U postgres দিন",
    },
    user: {
      ok: false,
      output: 'psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory\n\tIs the server running locally and accepting connections on that socket?',
      why: "নাম ঠিক, ঠিকানা ভুল। দরজাটা Container এ, আর psql খুঁজছে Mac এর ভেতরে।",
      fix: "-h 127.0.0.1 যোগ করুন",
    },
    tcp: {
      ok: true,
      output: 'Password for user postgres:\npsql (18.6 (Debian 18.6-1.pgdg13+2))\nType "help" for help.\n\npostgres=#',
      why: "TCP দিয়ে Container এর খোলা Port এ পৌঁছল, postgres Role আছে, Password মিলেছে।",
    },
  },
  windows: {
    plain: {
      ok: false,
      output: 'Password for user rahim:\npsql: error: connection to server at "localhost" (::1), port 5432 failed: FATAL:  password authentication failed for user "rahim"',
      why: "Windows এ psql user হিসেবে আপনার Windows এর নাম নেয়। rahim নামে কোনো Role নেই, তাই কোনো Password ই মিলবে না। নিরাপত্তার জন্য PostgreSQL বলে না যে Role টাই নেই।",
      fix: "সবসময় psql -U postgres লিখুন",
    },
    db: {
      ok: false,
      output: 'Password for user rahim:\npsql: error: connection to server at "localhost" (::1), port 5432 failed: FATAL:  password authentication failed for user "rahim"',
      why: "Database এর নাম দিলেও user এখনো rahim।",
      fix: "-U postgres দিন",
    },
    user: {
      ok: true,
      output: 'Password for user postgres:\npsql (18.6)\nType "help" for help.\n\npostgres=#',
      why: "postgres Role আছে, Installer এর সময় দেওয়া Password মিলেছে।",
    },
    tcp: {
      ok: true,
      output: 'Password for user postgres:\npsql (18.6)\nType "help" for help.\n\npostgres=#',
      why: "Windows এ এমনিতেই TCP, তাই -h 127.0.0.1 দিলেও ফল একই।",
    },
  },
};

export function ConnectDefaultsLab() {
  const [machine, setMachine] = useState<Machine>("homebrew");
  const [command, setCommand] = useState<Command>("plain");
  const result = RESULTS[machine][command];
  const m = MACHINES.find((x) => x.id === machine)!;
  const c = COMMANDS.find((x) => x.id === command)!;

  return (
    <Panel
      label="Interactive"
      title="একই psql, আলাদা কম্পিউটারে আলাদা ফল"
      footer="ভেতরের Error গুলো আসল PostgreSQL 18 থেকে নেওয়া, শুধু ব্যবহারকারীর নাম rahim বসানো। Windows আর Homebrew এর লাইনগুলো একই PostgreSQL এর একই নিয়মে তৈরি, সেখানে আপনার মেশিনে Path বা Version একটু আলাদা দেখাতে পারে।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
            কম্পিউটার
          </div>
          <div className="flex flex-wrap gap-2">
            {MACHINES.map((x) => (
              <button
                key={x.id}
                type="button"
                data-machine={x.id}
                aria-pressed={x.id === machine}
                onClick={() => setMachine(x.id)}
                className={cn(BTN, x.id === machine ? BTN_ON : BTN_OFF)}
              >
                {x.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">{m.context}</p>
        </div>
        <div>
          <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
            Command
          </div>
          <div className="flex flex-wrap gap-2">
            {COMMANDS.map((x) => (
              <button
                key={x.id}
                type="button"
                data-command={x.id}
                aria-pressed={x.id === command}
                onClick={() => setCommand(x.id)}
                className={cn(BTN, "font-mono", x.id === command ? BTN_ON : BTN_OFF)}
              >
                {x.text}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">psql যা ধরে নিল: {c.filled}</p>
        </div>
      </div>

      <div data-result={result.ok ? "ok" : "error"} className="space-y-3">
        <Code>{`$ ${c.text}\n${result.output}`}</Code>
        <div
          className={cn(
            "border p-4 text-[0.8125rem] leading-relaxed",
            result.ok ? "border-primary/50 bg-primary/5 text-foreground" : "border-border bg-background text-muted-foreground"
          )}
        >
          <span className={cn("font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] mr-2", result.ok ? "text-primary" : "text-destructive")}>
            {result.ok ? "ঢুকে গেছেন" : "আটকে গেছে"}
          </span>
          {result.why}
          {result.fix && (
            <span className="block mt-2 text-foreground">
              <strong>যা করবেন:</strong> {result.fix}
            </span>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Error দেখে বুঝুন কোন ধাপে আটকেছেন                                        */
/* ------------------------------------------------------------------------- */

const STAGES = ["Program খোঁজা", "Server এ পৌঁছানো", "পরিচয় দেওয়া", "Database বাছা"];

type Diagnosis = {
  id: string;
  short: string;
  message: string;
  stage: number;
  cause: string;
  fix: string;
};

const DIAGNOSES: Diagnosis[] = [
  {
    id: "not-found",
    short: "command not found",
    message: "zsh: command not found: psql",
    stage: 0,
    cause: "Shell psql নামের Program টা খুঁজেই পায়নি। Server এর সাথে কোনো কথাই হয়নি। প্রায় সবসময় কারণ PATH: Homebrew এর keg-only Formula, Postgres.app এর PATH ফাইল তৈরি না করা, বা Windows এ bin ফোল্ডার Path এ না দেওয়া।",
    fix: "যে পথে ইনস্টল করেছেন তার PATH লাইনটা যোগ করে নতুন Terminal খুলুন। which psql (Windows এ where psql) দিয়ে মিলিয়ে নিন।",
  },
  {
    id: "no-socket",
    short: "No such file or directory",
    message: 'psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory\n\tIs the server running locally and accepting connections on that socket?',
    stage: 1,
    cause: "psql নিজের কম্পিউটারের Socket ফাইল খুঁজেছে আর পায়নি। হয় Server বন্ধ, নয়তো Server আছে অন্য কোথাও, যেমন Docker এর ভেতরে।",
    fix: "Server চালু করুন (brew services start, systemctl start, docker start)। Docker হলে -h 127.0.0.1 দিন।",
  },
  {
    id: "refused",
    short: "Connection refused",
    message: 'psql: error: connection to server at "127.0.0.1", port 5432 failed: Connection refused\n\tIs the server running on that host and accepting TCP/IP connections?',
    stage: 1,
    cause: "ঠিকানায় পৌঁছেছে, কিন্তু ওই Port এ কেউ দরজা খোলেনি। Server বন্ধ, অথবা অন্য Port এ চলছে।",
    fix: "pg_isready -h 127.0.0.1 -p 5432 দিয়ে দেখুন। Server চালু করুন, বা ঠিক Port টা -p দিয়ে বলুন।",
  },
  {
    id: "password",
    short: "password authentication failed",
    message: 'psql: error: connection to server at "127.0.0.1", port 5432 failed: FATAL:  password authentication failed for user "postgres"',
    stage: 2,
    cause: "দরজা খুলেছে, কিন্তু Password মেলেনি। Password ভুল, Role টার কোনো Password নেই, অথবা Role টাই নেই। নিরাপত্তার জন্য PostgreSQL তিনটার জন্য একই কথা বলে।",
    fix: "Password আবার দেখুন, -U ঠিক কিনা দেখুন। মনে না থাকলে Socket দিয়ে Superuser হয়ে ঢুকে ALTER ROLE দিয়ে নতুন Password দিন।",
  },
  {
    id: "peer",
    short: "Peer authentication failed",
    message: 'psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  Peer authentication failed for user "postgres"',
    stage: 2,
    cause: "Linux এর Peer নিয়ম: আপনি OS এ যে নামে আছেন, Database এও সেই নামে ঢুকতে হবে। আপনি OS এ অন্য কেউ, অথচ চাইছেন postgres হতে।",
    fix: "sudo -u postgres psql। নিজের নামে কাজ করতে চাইলে নিজের নামে একটা Role বানিয়ে নিন।",
  },
  {
    id: "role",
    short: 'role "..." does not exist',
    message: 'psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  role "rahim" does not exist',
    stage: 2,
    cause: "Server এ পৌঁছেছেন, কিন্তু যে নামে ঢুকতে চাইছেন সেই নামে কোনো Role নেই। -U না দিলে নামটা আসে আপনার OS থেকে।",
    fix: "-U দিয়ে আসল Role এর নাম দিন, অথবা Superuser হয়ে createuser দিয়ে Role টা বানান।",
  },
  {
    id: "database",
    short: 'database "..." does not exist',
    message: 'psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  database "rahim" does not exist',
    stage: 3,
    cause: "পরিচয় পার, শুধু Database টা নেই। Database এর নাম না দিলে psql আপনার Role এর নামেই একটা Database খোঁজে।",
    fix: "psql postgres লিখুন, অথবা createdb দিয়ে ওই নামের Database বানান।",
  },
  {
    id: "port-taken",
    short: "port is already allocated",
    message: "docker: Error response from daemon: ... Bind for 127.0.0.1:5432 failed: port is already allocated",
    stage: 1,
    cause: "নতুন Server চালুই হয়নি, কারণ 5432 আগে থেকে অন্য কেউ ধরে আছে: পুরনো ইনস্টল, অন্য Container, বা Postgres.app।",
    fix: "lsof -nP -iTCP:5432 -sTCP:LISTEN দিয়ে দেখুন কে ধরে আছে। নতুনটাকে 5433 এ বসান: -p 127.0.0.1:5433:5432।",
  },
];

export function ErrorStageLab() {
  const [active, setActive] = useState(DIAGNOSES[0].id);
  const d = DIAGNOSES.find((x) => x.id === active) ?? DIAGNOSES[0];

  return (
    <Panel
      label="Interactive"
      title="Error টা কোন ধাপে আটকেছে"
      footer="প্রতিটা Connection চারটা ধাপ পার হয়: Program খোঁজা, Server এ পৌঁছানো, পরিচয় দেওয়া, Database বাছা। Error এর প্রথম কয়েকটা শব্দ পড়লেই বোঝা যায় কোন ধাপে আটকেছেন, আর তাতেই অর্ধেক সমাধান হয়ে যায়।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {DIAGNOSES.map((x) => (
          <button
            key={x.id}
            type="button"
            data-error={x.id}
            aria-pressed={x.id === active}
            onClick={() => setActive(x.id)}
            className={cn(BTN, "font-mono", x.id === active ? BTN_ON : BTN_OFF)}
          >
            {x.short}
          </button>
        ))}
      </div>

      <ol className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5" data-stage={d.stage}>
        {STAGES.map((stage, i) => (
          <li
            key={stage}
            className={cn(
              "border px-3 py-2 text-[0.75rem] leading-snug transition-colors duration-300",
              i < d.stage && "border-primary/40 text-foreground",
              i === d.stage && "border-destructive bg-destructive/10 text-destructive font-bold",
              i > d.stage && "border-border text-muted-foreground/50"
            )}
          >
            <span className="font-mono text-[0.625rem] mr-1.5">{toBn(i + 1)}</span>
            {stage}
            {i < d.stage && <span className="ml-1 text-primary">✓</span>}
          </li>
        ))}
      </ol>

      <Code>{d.message}</Code>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
            কেন হলো
          </div>
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{d.cause}</p>
        </div>
        <div className="border border-primary/50 bg-primary/5 p-4">
          <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary mb-2">
            যা করবেন
          </div>
          <p className="text-[0.8125rem] leading-relaxed text-foreground">{d.fix}</p>
        </div>
      </div>
    </Panel>
  );
}
