"use client";

import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
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

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-background p-4">
      <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
        {label}
      </div>
      <div className="text-[0.8125rem] leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-foreground/90 whitespace-pre">
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
  version: string;
  root: string;
  commands: string;
  verify: string;
  data: string;
  remove: string;
  watch: string;
};

const PATHS: InstallPath[] = [
  {
    id: "homebrew",
    label: "macOS · Homebrew",
    version: "mysql@8.4, এখন 8.4.11। Keg-only, তাই PATH এ নিজে যোগ করতে হয়।",
    root: "শুরুতে root এর কোনো Password নেই। mysql -u root দিয়ে ঢোকা যায়, তারপর mysql_secure_installation চালিয়ে Password বসান।",
    commands: `brew install mysql@8.4
echo "export PATH=\\"$(brew --prefix mysql@8.4)/bin:\\$PATH\\"" >> ~/.zshrc
source ~/.zshrc
brew services start mysql@8.4
mysql_secure_installation`,
    verify: `mysql --version
mysql -u root -p`,
    data: "/opt/homebrew/var/mysql (Apple Silicon Mac এ)",
    remove: "brew services stop mysql@8.4, তারপর brew uninstall mysql@8.4। Data Directory আলাদা ফাইল, সেটা নিজে না মুছলে থেকে যায়।",
    watch: "আগের কোনো ইনস্টল থেকে /etc/my.cnf থেকে গেলে Server চালু হতে বাধা দিতে পারে, Homebrew নিজেই এই সতর্কতা দেয়।",
  },
  {
    id: "windows",
    label: "Windows · MSI",
    version: "dev.mysql.com থেকে MySQL Community Server 8.4 এর Windows MSI।",
    root: "MySQL Configurator এর Accounts and Roles পাতায় root এর Password আপনি নিজে ঠিক করেন।",
    commands: `MSI চালান, শেষে MySQL Configurator চালু হবে
Type and Networking: Port 3306 যেমন আছে থাকুক
Accounts and Roles: root এর Password দিন
Windows Service: নাম MySQL84, Startup এ চালু
Sample Databases: বাদ দিন, আমাদের নিজের আছে
Apply Configuration চাপুন`,
    verify: `mysql --version
mysql -u root -p`,
    data: "Configurator যেখানে দেখায়। Program এর ফাইল থাকে C:\\Program Files\\MySQL\\MySQL Server 8.4",
    remove: "Windows এর Apps থেকে MySQL Server 8.4 Uninstall। Service আগে থামাতে Stop-Service MySQL84।",
    watch: "mysql চেনা না গেলে C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin কে PATH এ যোগ করে নতুন PowerShell খুলুন।",
  },
  {
    id: "ubuntu",
    label: "Ubuntu · নিজের Package",
    version: "Ubuntu 24.04 এর নিজের mysql-server আসলে MySQL 8.0 (এখন 8.0.46), 8.4 না।",
    root: "root ঢোকে Password ছাড়া, sudo দিয়ে। কারণ Ubuntu তাকে auth_socket দিয়ে চেনে, মানে Linux এর root User কিনা দেখে।",
    commands: `sudo apt update
sudo apt install mysql-server
sudo service mysql status`,
    verify: `mysql --version
sudo mysql -u root`,
    data: "সাধারণত /var/lib/mysql",
    remove: "sudo apt remove mysql-server। Data মুছতে আলাদা পদক্ষেপ লাগে, ভেবেচিন্তে।",
    watch: "mysql -u root -p দিয়ে ঢুকতে চাইলে ERROR 1045 আসবে, কারণ এখানে root Password দিয়ে চেনা হয় না। sudo mysql ব্যবহার করুন।",
  },
  {
    id: "apt-repo",
    label: "Ubuntu/Debian · MySQL APT Repo",
    version: "MySQL এর নিজের Repository থেকে 8.4 LTS, আপনি বেছে নেন কোন Series।",
    root: "ইনস্টলের সময় root এর Password চায়। খালি রাখলে Socket দিয়ে চেনা চালু হয়, পরে mysql_secure_installation দিয়ে বসানো যায়।",
    commands: `# dev.mysql.com/downloads/repo/apt থেকে mysql-apt-config এর .deb নামান
sudo dpkg -i mysql-apt-config_w.x.y-z_all.deb   # নামটা আপনার ফাইলের মতো
# যে মেনু আসবে, সেখানে mysql-8.4-lts বেছে নিন
sudo apt-get update
sudo apt-get install mysql-server`,
    verify: `mysql --version
mysql -u root -p`,
    data: "সাধারণত /var/lib/mysql",
    remove: "sudo apt-get remove mysql-server, Repository টাও সরাতে চাইলে mysql-apt-config।",
    watch: "Debian এ default-mysql-server নামের Package আসলে MariaDB ইনস্টল করে, MySQL না। নাম দেখে ভুলবেন না।",
  },
  {
    id: "docker",
    label: "Docker · mysql:8.4",
    version: "অফিসিয়াল Image mysql:8.4, ভেতরে এখন 8.4.11।",
    root: "root এর Password আসে MYSQL_ROOT_PASSWORD থেকে, যেটা আপনার Shell এ আগে export করা। Image এ mysql_secure_installation নেই, দরকারও নেই।",
    commands: `read -s MYSQL_ROOT_PASSWORD     # Password টাইপ করে Enter, স্ক্রিনে কিছু দেখাবে না
export MYSQL_ROOT_PASSWORD
docker run -d --name island-mysql \\
  -e MYSQL_ROOT_PASSWORD \\
  -e MYSQL_DATABASE=island_tours \\
  -v island-mysql-data:/var/lib/mysql \\
  -p 127.0.0.1:3306:3306 \\
  mysql:8.4`,
    verify: `docker logs island-mysql | grep "ready for connections"
docker exec -it island-mysql mysql -u root -p`,
    data: "Container এর ভেতরে /var/lib/mysql, যেটা island-mysql-data নামের Volume এ রাখা",
    remove: "docker rm -f island-mysql। Data সহ সব মুছতে docker volume rm island-mysql-data।",
    watch: "Password এর Variable export না করলে Container চালু হয়েই থেমে যায়: Database is uninitialized and password option is not specified।",
  },
];

export function InstallPathLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(PATHS[0].id);
  const path = PATHS.find((p) => p.id === active) ?? PATHS[0];

  return (
    <Panel
      label="Interactive"
      title="আপনার মেশিন, আপনার পথ"
      footer="Homebrew আর Docker এর পথ দুটোর তথ্য সরাসরি যাচাই করা: Homebrew এর নিজের Formula আর এই লেসনের জন্য চালানো একটা mysql:8.4 Container। Windows আর Ubuntu এর ধাপগুলো MySQL আর Ubuntu এর অফিসিয়াল নির্দেশনা থেকে নেওয়া, স্ক্রিনে নাম একটু আলাদা দেখালে স্ক্রিনটাই মানুন।"
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
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Fact label="কোন Version পাবেন">{path.version}</Fact>
          <Fact label="root কীভাবে ঢোকে">{path.root}</Fact>
        </div>
        <div>
          <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-primary mb-2">
            ধাপগুলো
          </div>
          <Mono>{path.commands}</Mono>
        </div>
        <div>
          <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-primary mb-2">
            চালু হলো কিনা যাচাই
          </div>
          <Mono>{path.verify}</Mono>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Fact label="Data কোথায় থাকে">{path.data}</Fact>
          <Fact label="সরাতে চাইলে">{path.remove}</Fact>
          <Fact label="সাবধান">{path.watch}</Fact>
        </div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. psql এর কাজ, mysql এ কীভাবে                                             */
/* ------------------------------------------------------------------------- */

type ClientTask = {
  id: string;
  task: string;
  psql: string;
  mysql: string;
  output: string;
  note: string;
};

const TASKS: ClientTask[] = [
  {
    id: "list-dbs",
    task: "সব Database দেখা",
    psql: "\\l",
    mysql: "SHOW DATABASES;",
    output: `+--------------------+
| Database           |
+--------------------+
| information_schema |
| island_tours       |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)`,
    note: "island_tours ছাড়া বাকি চারটা MySQL এর নিজের, শুরু থেকেই থাকে। এগুলোতে হাত দেবেন না।",
  },
  {
    id: "switch-db",
    task: "একটা Database এ ঢোকা",
    psql: "\\c island_tours",
    mysql: "USE island_tours;",
    output: `Database changed`,
    note: "PostgreSQL এ \\c আসলে নতুন Connection খোলে। MySQL এ USE শুধু বলে দেয় এখন থেকে কোন Database ধরে কাজ হবে।",
  },
  {
    id: "list-tables",
    task: "Table গুলোর নাম",
    psql: "\\dt",
    mysql: "SHOW TABLES;",
    output: `+------------------------+
| Tables_in_island_tours |
+------------------------+
| bookings               |
| customers              |
| departures             |
| destinations           |
| guides                 |
| payments               |
| reviews                |
| tours                  |
+------------------------+
8 rows in set (0.00 sec)`,
    note: "দুই জায়গাতেই আটটা Table, একই নাম।",
  },
  {
    id: "describe",
    task: "একটা Table এর গঠন",
    psql: "\\d tours",
    mysql: "DESCRIBE tours;",
    output: `+----------------+---------------+------+-----+-------------------+-------------------+
| Field          | Type          | Null | Key | Default           | Extra             |
+----------------+---------------+------+-----+-------------------+-------------------+
| tour_id        | int           | NO   | PRI | NULL              | auto_increment    |
| title          | varchar(255)  | NO   |     | NULL              |                   |
| destination_id | int           | NO   | MUL | NULL              |                   |
| guide_id       | int           | YES  | MUL | NULL              |                   |
| duration_days  | smallint      | NO   |     | NULL              |                   |
| price_bdt      | decimal(10,2) | NO   |     | NULL              |                   |
| max_seats      | smallint      | NO   |     | NULL              |                   |
| is_active      | tinyint(1)    | NO   |     | 1                 |                   |
| created_at     | datetime      | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+----------------+---------------+------+-----+-------------------+-------------------+
9 rows in set (0.00 sec)`,
    note: "খেয়াল করুন is_active এর Type tinyint(1): MySQL এ BOOLEAN আসলে ছোট একটা সংখ্যা, true মানে 1।",
  },
  {
    id: "vertical",
    task: "চওড়া Row খাড়া করে দেখা",
    psql: "\\x  (তারপর Query)",
    mysql: "Query এর শেষে ; এর বদলে \\G",
    output: `mysql> SELECT booking_id, booked_at, total_bdt FROM bookings WHERE booking_id = 1\\G
*************************** 1. row ***************************
booking_id: 1
 booked_at: 2025-12-20 10:15:00
 total_bdt: 25000.00
1 row in set (0.00 sec)`,
    note: "\\G একবারের জন্য, শুধু ওই Query তে। psql এর \\x একটা সুইচ, আবার \\x না দেওয়া পর্যন্ত চালু থাকে।",
  },
  {
    id: "run-file",
    task: "একটা SQL ফাইল চালানো",
    psql: "\\i island-tours.sql",
    mysql: "SOURCE island-tours.mysql.sql",
    output: `mysql> SOURCE /tmp/island-tours.mysql.sql
mysql> SELECT COUNT(*) FROM bookings;
+----------+
| COUNT(*) |
+----------+
|       24 |
+----------+`,
    note: "Windows এর PowerShell এ < দিয়ে ফাইল ঢোকানো যায় না, তখন SOURCE ই সবচেয়ে সহজ পথ।",
  },
  {
    id: "clear",
    task: "আধা লেখা Query বাতিল",
    psql: "\\r  (অথবা Ctrl+C)",
    mysql: "\\c",
    output: `mysql> SELECT title FROM tours
    -> \\c
mysql>`,
    note: "সাবধান: psql এ \\c মানে অন্য Database এ যাওয়া, MySQL এ \\c মানে লেখা বাতিল। একই দুই অক্ষর, একদম আলাদা কাজ।",
  },
  {
    id: "quit",
    task: "বের হওয়া",
    psql: "\\q",
    mysql: "exit  বা  quit  বা  \\q",
    output: `mysql> exit
Bye`,
    note: "\\q দুই জায়গাতেই কাজ করে, এটা মনে রাখলেই হলো।",
  },
];

export function ClientCommandLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(TASKS[0].id);
  const task = TASKS.find((t) => t.id === active) ?? TASKS[0];

  return (
    <Panel
      label="Interactive"
      title="psql এ যা করেন, mysql এ কীভাবে"
      footer="MySQL এর Output গুলো এই লেসনের জন্য একটা mysql:8.4 Container এ island_tours Load করে হুবহু তোলা। psql এর Command গুলোর পুরো গল্প Lesson 03 এ।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {TASKS.map((t) => (
          <button
            key={t.id}
            type="button"
            data-task={t.id}
            aria-pressed={t.id === active}
            onClick={() => setActive(t.id)}
            className={cn(BTN, t.id === active ? BTN_ON : BTN_OFF)}
          >
            {t.task}
          </button>
        ))}
      </div>

      <motion.div
        key={task.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-active-task={task.id}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border bg-background p-4">
            <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
              PostgreSQL · psql
            </div>
            <code className="font-mono text-sm text-foreground">{task.psql}</code>
          </div>
          <div className="border border-primary/50 bg-primary/5 p-4">
            <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-primary mb-2">
              MySQL · mysql
            </div>
            <code className="font-mono text-sm text-foreground">{task.mysql}</code>
          </div>
        </div>
        <Mono>{task.output}</Mono>
        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{task.note}</p>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Error দেখে কারণ ধরা                                                     */
/* ------------------------------------------------------------------------- */

type Trouble = {
  id: string;
  short: string;
  message: string;
  cause: string;
  fix: string;
};

const TROUBLES: Trouble[] = [
  {
    id: "not-found",
    short: "command not found",
    message: "zsh: command not found: mysql",
    cause: "Program ইনস্টল হয়েছে, কিন্তু Shell জানে না সেটা কোথায়। Homebrew এর mysql@8.4 keg-only, তাই নিজে থেকে PATH এ বসে না। Windows এ bin Folder টা PATH এ নেই।",
    fix: "PATH এ MySQL এর bin Folder যোগ করুন, তারপর নতুন Terminal খুলুন বা source ~/.zshrc চালান। যাচাই: mysql --version।",
  },
  {
    id: "1045",
    short: "ERROR 1045",
    message: "ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)",
    cause: "Server চলছে, Connection ও হয়েছে, কিন্তু User আর Password এর জোড়া মেলেনি। Ubuntu এর নিজের Package এ root কে Password দিয়ে চেনাই হয় না, তাই সেখানে এটা প্রায়ই আসে।",
    fix: "Password আবার দেখুন। Ubuntu হলে sudo mysql -u root দিয়ে ঢুকুন। (using password: NO) লেখা থাকলে আপনি -p দিতে ভুলে গেছেন।",
  },
  {
    id: "2002",
    short: "ERROR 2002",
    message: "ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)",
    cause: "localhost দিয়ে ঢুকতে গিয়ে Client Socket ফাইলটা খুঁজে পায়নি। হয় Server চালুই নেই, নয়তো Server আছে Docker এর ভেতরে, যেখানে এই ফাইল আপনার মেশিনে নেই।",
    fix: "Server চালু করুন (brew services start mysql@8.4, অথবা Windows Service)। Docker হলে -h 127.0.0.1 দিয়ে TCP তে যান।",
  },
  {
    id: "2003",
    short: "ERROR 2003",
    message: "ERROR 2003 (HY000): Can't connect to MySQL server on '127.0.0.1:3307' (111)",
    cause: "TCP দিয়ে যে Port এ গেলেন, সেখানে কেউ অপেক্ষা করছে না। Port ভুল, অথবা Server বন্ধ। শেষের বন্ধনীর সংখ্যাটা Operating System এর কোড, Linux এ 111, macOS এ আলাদা হতে পারে।",
    fix: "সঠিক Port দিন (সাধারণত 3306)। Server চালু আছে কিনা দেখুন: Docker হলে docker ps।",
  },
  {
    id: "1049",
    short: "ERROR 1049",
    message: "ERROR 1049 (42000): Unknown database 'island_tour'",
    cause: "এই নামের কোনো Database এই Server এ নেই। হয় বানানে ভুল, নয়তো Database টা এখনো বানানোই হয়নি।",
    fix: "SHOW DATABASES; দিয়ে আসল নামটা দেখুন। না থাকলে আগে CREATE DATABASE island_tours; চালান।",
  },
  {
    id: "1046",
    short: "ERROR 1046",
    message: "ERROR 1046 (3D000): No database selected",
    cause: "কোন Database এর Table চাইছেন, MySQL জানে না। Connect করার সময় Database এর নাম দেননি, USE ও চালাননি।",
    fix: "USE island_tours; চালান, অথবা Connect করার Command এর শেষে Database এর নাম দিন: mysql -u root -p island_tours।",
  },
  {
    id: "1146",
    short: "ERROR 1146",
    message: "ERROR 1146 (42S02): Table 'island_tours.tour' doesn't exist",
    cause: "Database ঠিক আছে, কিন্তু এই নামের Table নেই। এখানে tours এর জায়গায় tour লেখা।",
    fix: "SHOW TABLES; দিয়ে নামগুলো মিলিয়ে নিন।",
  },
  {
    id: "port-taken",
    short: "port is already allocated",
    message: "Bind for 127.0.0.1:3306 failed: port is already allocated",
    cause: "Docker যে Port আপনার মেশিনে খুলতে চাইছে, সেটা আগে থেকেই কারো দখলে। হয়তো আরেকটা MySQL, MariaDB, বা আগের কোনো Container।",
    fix: "দখলদারটা বন্ধ করুন, অথবা অন্য Port নিন: -p 127.0.0.1:3307:3306, তারপর Connect করুন -h 127.0.0.1 -P 3307 দিয়ে।",
  },
  {
    id: "no-password",
    short: "Container থেমে গেল",
    message: "[ERROR] [Entrypoint]: Database is uninitialized and password option is not specified",
    cause: "docker run এ -e MYSQL_ROOT_PASSWORD লিখেছেন, কিন্তু Shell এ Variable টা export করেননি। তাই খালি গেছে, আর Image Password ছাড়া চালু হতে রাজি না।",
    fix: "আগে read -s MYSQL_ROOT_PASSWORD আর export MYSQL_ROOT_PASSWORD চালান, থেমে যাওয়া Container টা docker rm দিয়ে সরান, তারপর আবার docker run।",
  },
  {
    id: "powershell",
    short: "PowerShell এ <",
    message: "The '<' operator is reserved for future use.",
    cause: "PowerShell ফাইল থেকে Input ঢোকানোর < চেনে না। macOS আর Linux এর Terminal এ যে Command চলে, PowerShell এ সেটা এখানেই আটকায়।",
    fix: "mysql এ ঢুকে SOURCE C:/Users/আপনার-নাম/Downloads/island-tours.mysql.sql চালান। Path এ / ব্যবহার করুন।",
  },
];

export function ConnectTroubleLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(TROUBLES[0].id);
  const trouble = TROUBLES.find((t) => t.id === active) ?? TROUBLES[0];

  return (
    <Panel
      label="Interactive"
      title="Error টা পড়ুন, কারণটা ধরুন"
      footer="প্রতিটা Error এর গঠন আর লেখা আসল: MySQL এর গুলো mysql:8.4 Container এ, Docker এর গুলো Docker এ ঘটিয়ে তোলা, আর PowerShell এর লেখাটা Microsoft এর নিজের Docs থেকে। উদাহরণে Database এর নাম, Socket এর Path আর Port আপনার মেশিনে আলাদা হতে পারে, আর command not found এর লেখা Shell অনুযায়ী একটু বদলায়।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {TROUBLES.map((t) => (
          <button
            key={t.id}
            type="button"
            data-error={t.id}
            aria-pressed={t.id === active}
            onClick={() => setActive(t.id)}
            className={cn(BTN, "font-mono", t.id === active ? BTN_ON : BTN_OFF)}
          >
            {t.short}
          </button>
        ))}
      </div>

      <motion.div
        key={trouble.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-active-error={trouble.id}
        className="space-y-4"
      >
        <div className="border border-destructive/40 bg-destructive/5 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-destructive break-words">
          {trouble.message}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Fact label="কেন হলো">{trouble.cause}</Fact>
          <div className="border border-primary/50 bg-primary/5 p-4">
            <div className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-primary mb-2">
              কী করবেন
            </div>
            <div className="text-[0.8125rem] leading-relaxed text-foreground">{trouble.fix}</div>
          </div>
        </div>
      </motion.div>
    </Panel>
  );
}
