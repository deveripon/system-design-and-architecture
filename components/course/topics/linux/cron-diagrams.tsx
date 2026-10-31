/**
 * What: The still diagrams for Module 07 Lesson 10, Cron and Scheduled Tasks. They show where
 * cron reads its jobs from, the five time fields of a cron line, how cron's environment differs
 * from your terminal, the same instant on a UTC clock and a Dhaka clock, a systemd timer and
 * service pair, and every scheduled job on the Island Tours VPS across one day.
 *
 * Why: A schedule is about time and places on disk, and both are easier to see than to read. All
 * values come from a real Ubuntu 24.04 practice server. Every marker id starts with "cron-" so
 * two diagrams on the same page never share an id.
 */
import { Sketch, SketchSplit, SketchText } from "../../sketch";

function Arrow({ id, muted }: { id: string; muted?: boolean }) {
  return (
    <defs>
      <marker
        id={id}
        markerWidth={8}
        markerHeight={8}
        refX={7}
        refY={3.5}
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path
          d="M0,0 L7,3.5 L0,7 Z"
          fill={muted ? "currentColor" : "var(--primary)"}
          fillOpacity={muted ? 0.55 : 1}
        />
      </marker>
    </defs>
  );
}

function Box({
  x,
  y,
  w,
  h = 40,
  text,
  sub,
  subMono,
  accent,
  dashed,
  size = 10,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  sub?: string;
  /** Show the sub-label in the mono font, for paths and commands. */
  subMono?: boolean;
  accent?: boolean;
  dashed?: boolean;
  size?: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.1 : 0.04}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 1 : 0.45}
        strokeWidth="1.3"
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <SketchText
        x={x + w / 2}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
        size={size}
        bold
        accent={accent}
      >
        {text}
      </SketchText>
      {sub && (
        <SketchText
          x={x + w / 2}
          y={y + h / 2 + 13}
          size={subMono ? 8.5 : 9}
          body={!subMono}
          opacity={0.75}
        >
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/** A box with a mono title and a few left-aligned lines of config inside it. */
function ConfigBox({
  x,
  y,
  w,
  title,
  lines,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  lines: string[];
  accent?: boolean;
}) {
  const h = 34 + lines.length * 15;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.08 : 0.04}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 1 : 0.45}
        strokeWidth="1.3"
      />
      <line
        x1={x}
        y1={y + 24}
        x2={x + w}
        y2={y + 24}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 0.6 : 0.3}
      />
      <SketchText x={x + 10} y={y + 16} size={10} bold anchor="start" accent={accent}>
        {title}
      </SketchText>
      {lines.map((line, i) => (
        <SketchText key={line} x={x + 10} y={y + 40 + i * 15} size={8.5} anchor="start" opacity={0.85}>
          {line}
        </SketchText>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. cron কোথা থেকে কাজের তালিকা পড়ে                                           */
/* ------------------------------------------------------------------------- */

export function CronPlacesDiagram() {
  const sources = [
    { y: 24, text: "crontab -e", sub: "/var/spool/cron/crontabs/<user>", note: "User এর ঘর নেই, মালিকই User" },
    { y: 100, text: "/etc/crontab", sub: "Server এর নিজের খাতা", note: "প্রতি লাইনে User এর নাম" },
    { y: 176, text: "/etc/cron.d/<file>", sub: "Package আর আপনার নিজের File", note: "User এর ঘর আছে, নামে ডট নয়" },
    { y: 252, text: "/etc/cron.daily/", sub: "শুধু Script, run-parts চালায়", note: "/etc/crontab থেকে, 06:25 UTC" },
  ];
  return (
    <Sketch
      label="Diagram: cron চারটা জায়গা থেকে কাজের তালিকা পড়ে"
      height={330}
      minWidth={760}
      viewBox="0 0 860 330"
      caption={
        <>
          cron একটা মাত্র Program, কিন্তু কাজের তালিকা পড়ে চার জায়গা থেকে। প্রতি মিনিটের
          শুরুতে সে মিলিয়ে দেখে কোন লাইনের সময় হয়েছে, তারপর সেই লাইনের Command টা ঠিক
          User হয়ে চালায়, আর Journal এ একটা CMD লাইন লিখে রাখে। প্রথম জায়গাটা প্রতিটা User
          এর নিজের, তাই সেখানে User এর নাম লেখার ঘর নেই। বাকি তিনটা পুরো Server এর, তাই
          প্রতি লাইনে কে হয়ে চলবে সেটা লিখে দিতে হয়।
        </>
      }
    >
      <Arrow id="cron-places-arrow" />
      <Arrow id="cron-places-arrow-muted" muted />
      {sources.map((s) => (
        <g key={s.text}>
          <Box x={20} y={s.y} w={250} h={50} text={s.text} sub={s.sub} subMono={s.sub.startsWith("/")} />
          <SketchText x={280} y={s.y + 25 < 165 ? s.y + 17 : s.y + 42} size={9} body anchor="start" opacity={0.7}>
            {s.note}
          </SketchText>
          <path
            d={`M 270 ${s.y + 25} C 420 ${s.y + 25}, 400 165, 470 165`}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth="1.2"
            markerEnd="url(#cron-places-arrow-muted)"
          />
        </g>
      ))}
      <Box x={472} y={130} w={150} h={70} text="cron" sub="প্রতি মিনিটে খাতা মেলায়" accent size={13} />
      <line x1={622} y1={150} x2={668} y2={96} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#cron-places-arrow)" />
      <line x1={622} y1={182} x2={668} y2={232} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#cron-places-arrow)" />
      <Box x={672} y={64} w={176} h={56} text="Command চলে" sub="সেই User হয়ে, /bin/sh দিয়ে" />
      <Box x={672} y={208} w={176} h={56} text="Journal" sub="CRON[692]: (mytours) CMD (...)" subMono />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা cron লাইনের পাঁচটা ঘর                                                 */
/* ------------------------------------------------------------------------- */

export function CronFieldsDiagram() {
  const fields = [
    { x: 70, value: "30", name: "Minute", bn: "মিনিট", range: "0-59" },
    { x: 165, value: "21", name: "Hour", bn: "ঘণ্টা", range: "0-23" },
    { x: 260, value: "*", name: "Day of month", bn: "মাসের দিন", range: "1-31" },
    { x: 355, value: "*", name: "Month", bn: "মাস", range: "1-12, jan-dec" },
    { x: 450, value: "*", name: "Day of week", bn: "সপ্তাহের দিন", range: "0-7, sun-sat" },
  ];
  return (
    <Sketch
      label="Diagram: একটা cron লাইন, পাঁচটা সময়ের ঘর আর একটা Command"
      height={270}
      minWidth={760}
      viewBox="0 0 900 270"
      caption={
        <>
          বাম থেকে পাঁচটা ঘর সময় বলে, ছোট থেকে বড়: মিনিট, ঘণ্টা, মাসের দিন, মাস, সপ্তাহের
          দিন। তারকা মানে যেকোনো মান। তারপর বাকি পুরো লাইনটাই Command। এই লাইন পড়া হয়
          Server এর ঘড়িতে, আর Island Tours এর Server এর ঘড়ি UTC তে, তাই 21:30 মানে ঢাকায়
          পরের দিনের রাত সাড়ে তিনটা। সপ্তাহের দিনের ঘরে 0 আর 7 দুইটাই রবিবার।
        </>
      }
    >
      {fields.map((f) => (
        <g key={f.name}>
          <SketchText x={f.x} y={64} size={24} bold accent>
            {f.value}
          </SketchText>
          <path
            d={`M ${f.x - 30} 82 L ${f.x - 30} 90 L ${f.x + 30} 90 L ${f.x + 30} 82`}
            fill="none"
            stroke="var(--primary)"
            strokeOpacity={0.7}
            strokeWidth="1.2"
          />
          <line x1={f.x} y1={90} x2={f.x} y2={104} stroke="var(--primary)" strokeOpacity={0.7} />
          <SketchText x={f.x} y={122} size={10} bold>
            {f.name}
          </SketchText>
          <SketchText x={f.x} y={140} size={10} body opacity={0.85}>
            {f.bn}
          </SketchText>
          <SketchText x={f.x} y={158} size={9} opacity={0.7}>
            {f.range}
          </SketchText>
        </g>
      ))}
      <SketchText x={520} y={60} size={16} anchor="start" bold>
        /usr/local/bin/my-tours-backup
      </SketchText>
      <path d="M 520 82 L 520 90 L 820 90 L 820 82" fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.2" />
      <line x1={670} y1={90} x2={670} y2={104} stroke="currentColor" strokeOpacity={0.5} />
      <SketchText x={670} y={122} size={10} bold>
        Command
      </SketchText>
      <SketchText x={670} y={140} size={10} body opacity={0.85}>
        যা চালানো হবে, পুরো Path সহ
      </SketchText>
      <SketchText x={670} y={158} size={9} body opacity={0.7}>
        লাইনের শেষ পর্যন্ত সবটা, % ছাড়া
      </SketchText>
      <line x1={40} y1={188} x2={860} y2={188} stroke="currentColor" strokeOpacity={0.15} />
      <SketchText x={450} y={216} size={11} body>
        পড়ুন: প্রতি মাসের প্রতিটা দিনে, সপ্তাহের যেকোনো বারে, Server এর ঘড়িতে 21 টা বেজে 30 মিনিটে
      </SketchText>
      <SketchText x={450} y={244} size={11} bold accent>
        21:30 UTC = 03:30 Asia/Dhaka, পরের দিন
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. আপনার Terminal আর cron এর ভেতরের দুনিয়া                                    */
/* ------------------------------------------------------------------------- */

function EnvRows({ rows, accent }: { rows: [string, string][]; accent?: boolean }) {
  return (
    <g>
      {rows.map(([label, value], i) => (
        <g key={label}>
          <rect
            x={4}
            y={8 + i * 40}
            width={352}
            height={34}
            fill={accent ? "var(--primary)" : "currentColor"}
            fillOpacity={accent ? 0.06 : 0.03}
            stroke={accent ? "var(--primary)" : "currentColor"}
            strokeOpacity={accent ? 0.5 : 0.25}
          />
          <SketchText x={14} y={29 + i * 40} size={9.5} body bold anchor="start" accent={accent}>
            {label}
          </SketchText>
          <SketchText x={112} y={29 + i * 40} size={9} anchor="start" opacity={0.85} body={/[\u0980-\u09FF]/.test(value)}>
            {value}
          </SketchText>
        </g>
      ))}
    </g>
  );
}

export function CronEnvSplit() {
  return (
    <SketchSplit
      label="Diagram: একই Command, দুইটা আলাদা পরিবেশ"
      caption={
        <>
          বাম পাশের মানগুলো এসেছে deploy User এর Login Shell থেকে, ডান পাশের মানগুলো একটা
          cron Job এর ভেতরে চালানো <code>env</code> থেকে, একই Ubuntu 24.04 Server এ। তফাতগুলো
          ছোট দেখায়, কিন্তু এর যেকোনো একটা একটা Job কে চুপচাপ ব্যর্থ করে দিতে পারে। ~/.local/bin
          এর Program cron খুঁজে পায় না, bash এর source শব্দটা dash চেনে না, আর Error টা কোথাও
          দেখা যায় না।
        </>
      }
      panels={[
        {
          title: "আপনার Terminal",
          sub: "ssh করে ঢুকে যা পান",
          viewBox: "0 0 360 250",
          height: 250,
          minWidth: 300,
          children: (
            <EnvRows
              rows={[
                ["Shell", "/bin/bash"],
                ["PATH", "~/.local/bin:/usr/local/sbin:…:/bin"],
                ["যা পড়ে", "~/.profile, ~/.bashrc"],
                ["Terminal", "আছে, আপনি দেখছেন"],
                ["কোথা থেকে", "আপনি যে Folder এ আছেন"],
                ["Output", "সোজা আপনার পর্দায়"],
              ]}
            />
          ),
        },
        {
          title: "cron এর ভেতরে",
          sub: "একই User, একই Server",
          viewBox: "0 0 360 250",
          height: 250,
          minWidth: 300,
          children: (
            <EnvRows
              accent
              rows={[
                ["Shell", "/bin/sh, মানে dash"],
                ["PATH", "/etc/environment থেকে, ~/.local/bin নেই"],
                ["যা পড়ে", ".bashrc না, .profile ও না"],
                ["Terminal", "নেই, কেউ দেখছে না"],
                ["কোথা থেকে", "User এর HOME"],
                ["Output", "Mail এ, MTA নেই তাই ফেলে দেয়"],
              ]}
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 4. একই মুহূর্ত, দুইটা ঘড়ি                                                     */
/* ------------------------------------------------------------------------- */

export function CronTimezoneDiagram() {
  // 12 hours from 18:00 UTC on Oct 31, 60 units per hour, starting at x = 80.
  const x0 = 80;
  const perHour = 60;
  const ticks = [0, 2, 4, 6, 8, 10, 12];
  const pad = (n: number) => String(n % 24).padStart(2, "0") + ":00";
  const runX = x0 + 3.5 * perHour;
  const midnightUtcX = x0 + 6 * perHour;
  return (
    <Sketch
      label="Diagram: 21:30 UTC আর 03:30 ঢাকা, একই মুহূর্ত"
      height={290}
      minWidth={760}
      viewBox="0 0 880 290"
      caption={
        <>
          উপরের পট্টি Server এর ঘড়ি, নিচেরটা ঢাকার দেয়ালঘড়ি। দুইটার মাঝে সবসময় ঠিক ছয় ঘণ্টা,
          কারণ বাংলাদেশ এখন Daylight Saving Time মানে না। খেয়াল করুন তারিখটাও: Server এর হিসাবে
          Backup চলে ৩১ অক্টোবর রাতে, ঢাকার হিসাবে ১ নভেম্বর ভোরে। Log পড়ার সময় এই একটা
          তফাতই সবচেয়ে বেশি বিভ্রান্তি তৈরি করে।
        </>
      }
    >
      {/* UTC band */}
      <SketchText x={x0} y={30} size={10} body bold anchor="start">
        Server এর ঘড়ি, UTC
      </SketchText>
      <rect x={x0} y={44} width={12 * perHour} height={40} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.4} />
      <rect x={x0} y={44} width={6 * perHour} height={40} fill="currentColor" fillOpacity={0.05} />
      <SketchText x={x0 + 3 * perHour - 70} y={68} size={10} opacity={0.6}>
        Oct 31
      </SketchText>
      <SketchText x={midnightUtcX + 3 * perHour} y={68} size={10} opacity={0.6}>
        Nov 1
      </SketchText>
      <line x1={midnightUtcX} y1={40} x2={midnightUtcX} y2={88} stroke="currentColor" strokeOpacity={0.6} strokeDasharray="3 3" />
      {ticks.map((t) => (
        <SketchText key={`u${t}`} x={x0 + t * perHour} y={102} size={9} opacity={0.75}>
          {pad(18 + t)}
        </SketchText>
      ))}

      {/* Dhaka band */}
      <SketchText x={x0} y={150} size={10} body bold anchor="start">
        ঢাকার ঘড়ি, Asia/Dhaka (UTC+6)
      </SketchText>
      <rect x={x0} y={164} width={12 * perHour} height={40} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.4} />
      <line x1={x0} y1={160} x2={x0} y2={208} stroke="currentColor" strokeOpacity={0.6} strokeDasharray="3 3" />
      <SketchText x={x0 + 9 * perHour} y={188} size={10} opacity={0.6}>
        Nov 1
      </SketchText>
      {ticks.map((t) => (
        <SketchText key={`d${t}`} x={x0 + t * perHour} y={222} size={9} opacity={0.75}>
          {pad(t)}
        </SketchText>
      ))}

      {/* the run */}
      <line x1={runX} y1={40} x2={runX} y2={208} stroke="var(--primary)" strokeWidth="2" />
      <rect x={runX - 4} y={60} width={8} height={8} fill="var(--primary)" />
      <rect x={runX - 4} y={180} width={8} height={8} fill="var(--primary)" />
      <SketchText x={runX + 10} y={128} size={10} bold accent anchor="start">
        Backup চলে: 21:30 UTC = 03:30 ঢাকা
      </SketchText>
      <SketchText x={250} y={262} size={10} opacity={0.8}>
        cron: 30 21 * * *
      </SketchText>
      <SketchText x={600} y={262} size={10} opacity={0.8}>
        systemd: OnCalendar=*-*-* 03:30:00 Asia/Dhaka
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. systemd Timer: একজোড়া Unit                                                */
/* ------------------------------------------------------------------------- */

export function TimerPairDiagram() {
  return (
    <Sketch
      label="Diagram: Timer সময় রাখে, Service কাজ করে"
      height={360}
      minWidth={780}
      viewBox="0 0 900 360"
      caption={
        <>
          systemd এ একটা নির্ধারিত কাজ মানে দুইটা File। .timer File শুধু বলে কখন, আর কিছু
          জানে না। .service File বলে কী, কে হয়ে, কোন Environment নিয়ে। সময় হলে Timer তার
          জোড়া Service টা Start করে। শেষ কবে চলেছিল সেটা Timer একটা Stamp File এ লিখে রাখে,
          যা দিয়ে Persistent=true বন্ধ থাকার সময়ে ফসকে যাওয়া Run টা ধরে। Service এর
          প্রতিটা লাইন Output যায় Journal এ, আর ব্যর্থ হলে OnFailure একজন মানুষকে খবর দেয়।
        </>
      }
    >
      <Arrow id="cron-timer-arrow" />
      <Arrow id="cron-timer-arrow-muted" muted />
      <ConfigBox
        x={20}
        y={74}
        w={250}
        title="my-tours-backup.timer"
        accent
        lines={["OnCalendar=*-*-* 03:30:00 Asia/Dhaka", "Persistent=true", "WantedBy=timers.target"]}
      />
      <ConfigBox
        x={322}
        y={74}
        w={270}
        title="my-tours-backup.service"
        lines={[
          "Type=oneshot",
          "User=mytours",
          "EnvironmentFile=/etc/my-tours/backup.env",
          "ExecStart=/usr/local/bin/my-tours-backup",
        ]}
      />
      <ConfigBox
        x={644}
        y={74}
        w={236}
        title="my-tours-backup (Script)"
        lines={["tar দিয়ে একটা Archive", "find -mtime +6 -delete", "Heartbeat এর curl"]}
      />
      <line x1={270} y1={110} x2={318} y2={110} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#cron-timer-arrow)" />
      <SketchText x={294} y={102} size={8.5} body accent>
        সময় হলে
      </SketchText>
      <line x1={592} y1={110} x2={640} y2={110} stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.4" markerEnd="url(#cron-timer-arrow-muted)" />
      <SketchText x={616} y={102} size={8.5} opacity={0.7}>
        Exec
      </SketchText>

      {/* failure path */}
      <Box x={347} y={8} w={220} h={34} text="OnFailure → my-tours-alert@" size={9} dashed />
      <line x1={457} y1={74} x2={457} y2={46} stroke="currentColor" strokeOpacity={0.5} strokeDasharray="4 3" markerEnd="url(#cron-timer-arrow-muted)" />

      {/* outputs */}
      <line x1={145} y1={146} x2={145} y2={248} stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 3" markerEnd="url(#cron-timer-arrow-muted)" />
      <line x1={457} y1={168} x2={457} y2={248} stroke="currentColor" strokeOpacity={0.45} markerEnd="url(#cron-timer-arrow-muted)" />
      <line x1={762} y1={153} x2={762} y2={248} stroke="currentColor" strokeOpacity={0.45} markerEnd="url(#cron-timer-arrow-muted)" />
      <Box x={20} y={252} w={250} h={56} text="stamp-my-tours-backup.timer" sub="/var/lib/systemd/timers/ এ শেষ Run এর সময়" size={9.5} />
      <Box x={322} y={252} w={270} h={56} text="Journal" sub="journalctl -u my-tours-backup.service" subMono />
      <Box x={644} y={252} w={236} h={56} text="/var/backups/my-tours/" sub="my-tours-<সময়>.tar.gz, mode 600" />
      <SketchText x={450} y={340} size={9.5} body opacity={0.7}>
        Enable করতে হয় .timer টা, .service টা নয়: sudo systemctl enable --now my-tours-backup.timer
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. Island Tours এর VPS এ এক দিনের সব নির্ধারিত কাজ                              */
/* ------------------------------------------------------------------------- */

export function IslandScheduleDiagram() {
  const x0 = 60;
  const perHour = 32;
  const axisY = 170;
  const jobs = [
    { h: 0, label: "logrotate.timer", sub: "Log ঘোরানো (লেসন ০৭)", row: 0 },
    { h: 6.5, label: "apt-daily-upgrade.timer", sub: "Security Update (লেসন ০৩)", row: 1 },
    { h: 12, label: "apt-daily.timer", sub: "দিনে দুইবার, এলোমেলো সময়ে", row: 0 },
    { h: 21.5, label: "islandtours-backup.timer", sub: "03:30 ঢাকা, Database এর Dump", row: 1, accent: true },
  ];
  return (
    <Sketch
      label="Diagram: Island Tours এর VPS, এক দিনের নির্ধারিত কাজ (UTC)"
      height={260}
      minWidth={780}
      viewBox="0 0 900 260"
      caption={
        <>
          Island Tours নিজে লিখেছে শুধু একটা Timer, রাতের Backup। বাকিগুলো Ubuntu নিজেই নিয়ে
          আসে, আর সেগুলোও একই নিয়মে চলে: systemd Timer, Persistent=true, Journal এ Log। মধ্যরাতে
          logrotate এর পাশে dpkg-db-backup ও চলে, Package এর তালিকার একটা কপি রাখে। apt-daily আর
          apt-daily-upgrade এর সময় প্রতিদিন একটু করে এলোমেলো, যাতে পৃথিবীর সব Server একই মিনিটে
          Update Server এ ঝাঁপিয়ে না পড়ে। Certificate নবীকরণের কোনো Timer নেই, কারণ Caddy নিজের
          ভেতরেই সেটা হিসাব রাখে (Module 06, লেসন ০৮)।
        </>
      }
    >
      <line x1={x0} y1={axisY} x2={x0 + 24 * perHour} y2={axisY} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.4" />
      {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => (
        <g key={h}>
          <line x1={x0 + h * perHour} y1={axisY - 5} x2={x0 + h * perHour} y2={axisY + 5} stroke="currentColor" strokeOpacity={0.5} />
          <SketchText x={x0 + h * perHour} y={axisY + 22} size={9} opacity={0.7}>
            {String(h % 24).padStart(2, "0") + ":00"}
          </SketchText>
          <SketchText x={x0 + h * perHour} y={axisY + 37} size={8} body opacity={0.5}>
            {String((h + 6) % 24).padStart(2, "0") + ":00 ঢাকা"}
          </SketchText>
        </g>
      ))}
      {jobs.map((j) => {
        const x = x0 + j.h * perHour;
        const y = j.row === 0 ? 20 : 82;
        return (
          <g key={j.label}>
            <line
              x1={x}
              y1={y + 40}
              x2={x}
              y2={axisY}
              stroke={j.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={j.accent ? 1 : 0.4}
              strokeDasharray={j.accent ? undefined : "3 3"}
            />
            <circle cx={x} cy={axisY} r={4} fill={j.accent ? "var(--primary)" : "currentColor"} fillOpacity={j.accent ? 1 : 0.6} />
            <SketchText x={x} y={y + 14} size={9.5} bold accent={j.accent}>
              {j.label}
            </SketchText>
            <SketchText x={x} y={y + 30} size={9} body opacity={0.75}>
              {j.sub}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={x0 + 24 * perHour} y={250} size={8.5} body opacity={0.6} anchor="end">
        সপ্তাহে একবার fstrim.timer, Disk গোছানো
      </SketchText>
    </Sketch>
  );
}
