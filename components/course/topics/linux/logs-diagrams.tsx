/**
 * What: The still diagrams for Module 07 Lesson 07, System Logs. They show where every log line
 * goes on an Ubuntu server, what one journal line is made of, how to read a failed
 * `systemctl status`, what a crash loop looks like on a time line, how journald and logrotate
 * keep logs from filling the disk, and a bad log line next to a good one.
 *
 * Why: Logs are scattered across one binary journal and a handful of text files, and a reader
 * who cannot picture where a line went will not know where to look for it. Every value here
 * (PIDs, times, messages) is taken from a real run on the practice server, and every marker id
 * starts with "logs-" so two diagrams on one page never share an id.
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
        <SketchText x={x + w / 2} y={y + h / 2 + 12} size={8.5} body opacity={0.75}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

function Line({
  x1,
  y1,
  x2,
  y2,
  marker,
  muted,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  marker: string;
  muted?: boolean;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={muted ? "currentColor" : "var(--primary)"}
      strokeOpacity={muted ? 0.5 : 0.9}
      strokeWidth="1.3"
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd={`url(#${marker})`}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Log কে লেখে, কে রাখে, কে পড়ে                                              */
/* ------------------------------------------------------------------------- */

const SOURCES = [
  { text: "Kernel", sub: "Driver, Disk, OOM Killer" },
  { text: "systemd", sub: "চালু, বন্ধ, আবার চালু" },
  { text: "my-tours-api", sub: "শুধু stdout এ লেখে" },
  { text: "sshd, sudo, cron", sub: "syslog() ডেকে লেখে" },
  { text: "caddy", sub: "নিজের কাজের খবর" },
];

export function LogFlowDiagram() {
  const sx = 20;
  const sw = 175;
  const sh = 44;
  const gap = 62;
  const top = 26;
  const jx = 300;
  const jy = 150;
  const jw = 190;
  const jh = 58;

  return (
    <Sketch
      label="DIAGRAM: একটা Log লাইন কোথায় কোথায় যায়"
      minWidth={760}
      height={380}
      viewBox="0 0 900 380"
      caption={
        <>
          বাঁয়ে যারা লেখে, মাঝে যে জমা রাখে, ডানে যেখানে শেষে পৌঁছায়। প্রায় সবকিছু
          systemd-journald এর হাত দিয়ে যায় আর <code>/var/log/journal</code> এ
          জমে, যেটা <code>journalctl</code> দিয়ে পড়েন। Ubuntu সেই লাইনের একটা কপি
          rsyslog কে দেয়, rsyslog সেটা পুরনো ধাঁচের Text File এ লেখে। Caddy এর Access
          Log আলাদা পথে সোজা নিজের File এ যায়, Journal এ নয়।
        </>
      }
    >
      <Arrow id="logs-flow-arrow" />
      <Arrow id="logs-flow-arrow-muted" muted />

      {SOURCES.map((s, i) => (
        <g key={s.text}>
          <Box x={sx} y={top + i * gap} w={sw} h={sh} text={s.text} sub={s.sub} />
          <Line
            x1={sx + sw}
            y1={top + i * gap + sh / 2}
            x2={jx - 4}
            y2={jy + jh / 2}
            marker="logs-flow-arrow"
          />
        </g>
      ))}

      <Box x={jx} y={jy} w={jw} h={jh} text="systemd-journald" sub="সবার লাইন এক জায়গায়" accent />

      {/* journal files */}
      <Box x={600} y={40} w={280} h={44} text="/var/log/journal/" sub="স্থায়ী, Reboot এর পরেও থাকে" accent />
      <Box x={600} y={100} w={280} h={44} text="/run/log/journal/" sub="অস্থায়ী, Reboot এ মুছে যায়" dashed />
      <Line x1={jx + jw} y1={jy + 14} x2={596} y2={62} marker="logs-flow-arrow" />
      <Line x1={jx + jw} y1={jy + 24} x2={596} y2={122} marker="logs-flow-arrow-muted" muted dashed />
      <SketchText x={740} y={162} size={9} accent bold>
        journalctl দিয়ে পড়েন
      </SketchText>

      {/* rsyslog copy */}
      <Box x={600} y={196} w={110} h={44} text="rsyslog" sub="কপি পায়" />
      <Line x1={jx + jw} y1={jy + 44} x2={596} y2={218} marker="logs-flow-arrow-muted" muted />
      <SketchText x={545} y={236} size={8.5} opacity={0.7}>
        ForwardToSyslog=yes
      </SketchText>
      <Box x={735} y={196} w={145} h={44} text="/var/log/*.log" sub="syslog, auth.log, kern.log" />
      <Line x1={710} y1={218} x2={731} y2={218} marker="logs-flow-arrow-muted" muted />
      <SketchText x={807} y={258} size={9} bold opacity={0.8}>
        tail, less, grep দিয়ে পড়েন
      </SketchText>

      {/* caddy access log, its own path */}
      <Box x={600} y={300} w={280} h={44} text="/var/log/caddy/access.log" sub="Caddyfile এ log লিখলে তবেই" dashed />
      <path
        d={`M ${sx + sw} ${top + 4 * gap + sh / 2 + 8} C 260 ${top + 4 * gap + 60}, 480 ${top + 4 * gap + 60}, 596 322`}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.3"
        strokeDasharray="4 3"
        markerEnd="url(#logs-flow-arrow-muted)"
      />
      <SketchText x={420} y={350} size={8.5} body opacity={0.75}>
        প্রতিটা Request এর লাইন, Journal কে পাশ কাটিয়ে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা Journal লাইনের ভেতরে কী আছে                                         */
/* ------------------------------------------------------------------------- */

const MONO_SIZE = 13;
const CHAR = MONO_SIZE * 0.6;

const LINE_PARTS = [
  { x: 30, text: "Oct 31 07:25:31", label: "সময়", sub: "Server এর ঘড়ি, এখানে UTC" },
  { x: 170, text: "island-vps-01", label: "Host", sub: "কোন যন্ত্র" },
  { x: 290, text: "node[502]:", label: "Program আর PID", sub: "কে লিখেছে, কোন Process" },
  { x: 390, text: "Error: DATABASE_URL is not set", label: "বার্তা", sub: "Program নিজে যা বলেছে", accent: true },
];

const HIDDEN_FIELDS = [
  { field: "_SYSTEMD_UNIT=my-tours-api.service", flag: "-u my-tours-api" },
  { field: "PRIORITY=6", flag: "-p" },
  { field: "_PID=502", flag: "_PID=502" },
  { field: "_UID=997", flag: "_UID=997" },
  { field: "SYSLOG_IDENTIFIER=node", flag: "-t node" },
  { field: "_TRANSPORT=stdout", flag: "কীভাবে এলো" },
];

export function LogLineAnatomyDiagram() {
  return (
    <Sketch
      label="DIAGRAM: একটা Journal লাইনের শরীর"
      minWidth={760}
      height={330}
      viewBox="0 0 900 330"
      caption={
        <>
          উপরের লাইনটা হুবহু Practice Server থেকে নেওয়া। চোখে পড়ে চারটা অংশ, কিন্তু
          journald প্রতিটা লাইনের সাথে আরও অনেক Field চুপচাপ রেখে দেয়। নিচের বাক্সে
          তার কয়েকটা, <code>-o verbose</code> দিলে দেখা যায়। ডানের অংশটা দেখায় কোন
          Field দিয়ে কোন Filter কাজ করে, পুরো লেসনের Filter গুলো আসলে এই Field গুলোই।
        </>
      }
    >
      {LINE_PARTS.map((p) => {
        const w = p.text.length * CHAR;
        return (
          <g key={p.text}>
            <SketchText x={p.x} y={52} size={MONO_SIZE} anchor="start" accent={p.accent} bold={p.accent}>
              {p.text}
            </SketchText>
            <line
              x1={p.x}
              y1={62}
              x2={p.x + w}
              y2={62}
              stroke={p.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={p.accent ? 1 : 0.55}
              strokeWidth="2"
            />
            <line
              x1={p.x + w / 2}
              y1={64}
              x2={p.x + w / 2}
              y2={82}
              stroke="currentColor"
              strokeOpacity={0.4}
              strokeWidth="1"
            />
            <SketchText x={p.x + w / 2} y={98} size={10} bold accent={p.accent}>
              {p.label}
            </SketchText>
            <SketchText x={p.x + w / 2} y={114} size={8.5} body opacity={0.75}>
              {p.sub}
            </SketchText>
          </g>
        );
      })}

      <rect
        x={30}
        y={146}
        width={840}
        height={160}
        fill="currentColor"
        fillOpacity={0.03}
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeDasharray="4 3"
      />
      <SketchText x={46} y={168} size={9.5} anchor="start" bold opacity={0.85}>
        লুকানো Field, journalctl -o verbose দেখায়
      </SketchText>
      <SketchText x={854} y={168} size={9.5} anchor="end" bold accent>
        যে Filter এটা ব্যবহার করে
      </SketchText>
      {HIDDEN_FIELDS.map((f, i) => {
        const y = 196 + i * 18;
        return (
          <g key={f.field}>
            <SketchText x={46} y={y} size={10.5} anchor="start">
              {f.field}
            </SketchText>
            <line
              x1={430}
              y1={y - 4}
              x2={660}
              y2={y - 4}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeDasharray="2 4"
            />
            <SketchText x={854} y={y} size={10.5} anchor="end" accent>
              {f.flag}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. systemctl status, লাইন ধরে ধরে                                            */
/* ------------------------------------------------------------------------- */

const STATUS_LINES = [
  { text: "× my-tours-api.service - my-tours API", note: 0 },
  { text: "     Loaded: loaded (/etc/systemd/system/my-tours-api.service; enabled; preset: enabled)", note: 1 },
  { text: "     Active: failed (Result: exit-code) since Sat 2026-10-31 07:25:38 UTC; 2s ago", note: 2 },
  { text: "   Duration: 296ms", note: -1 },
  { text: "    Process: 551 ExecStart=/usr/bin/node /srv/my-tours/server.mjs (code=exited, status=1/FAILURE)", note: 3 },
  { text: "   Main PID: 551 (code=exited, status=1/FAILURE)", note: -1 },
  { text: "        CPU: 293ms", note: -1 },
  { text: "", note: -1 },
  { text: "07:25:38 systemd[1]: my-tours-api.service: Start request repeated too quickly.", note: 4 },
  { text: "07:25:38 systemd[1]: Failed to start my-tours-api.service - my-tours API.", note: -1 },
];

const STATUS_NOTES = [
  { title: "× মানে ব্যর্থ", body: "চললে সবুজ ●, থামানো থাকলে সাদা ○" },
  { title: "Unit File আর Boot", body: "কোন File, Boot এ নিজে চালু হবে কি না" },
  { title: "এখনকার অবস্থা", body: "failed, আর কেন: exit-code" },
  { title: "কীভাবে শেষ হলো", body: "exited মানে নিজে বেরিয়েছে, Code 1" },
  { title: "শুধু শেষ চেষ্টার লাইন", body: "আসল কারণ এখানে নেই, Journal এ" },
];

export function StatusAnatomyDiagram() {
  const size = 10;
  const top = 40;
  const step = 21;
  const legendX = 700;
  const noted = STATUS_LINES.map((l, i) => ({ ...l, i })).filter((l) => l.note >= 0);
  return (
    <Sketch
      label="DIAGRAM: ব্যর্থ একটা systemctl status পড়া"
      minWidth={820}
      height={300}
      viewBox="0 0 940 300"
      caption={
        <>
          Practice Server এ <code>systemctl status my-tours-api</code> এর আসল ফলাফল, Crash
          Loop শেষ হওয়ার দুই সেকেন্ড পরে। নিচের লাইন দুইটা লক্ষ করুন: status শুধু শেষ
          চেষ্টার Log দেখায়, আর শেষ চেষ্টায় systemd App টা চালুই করেনি, হাল ছেড়ে
          দিয়েছে। তাই এখানে App এর নিজের একটা কথাও নেই। কারণ খুঁজতে হবে{" "}
          <code>journalctl -u</code> দিয়ে।
        </>
      }
    >
      {STATUS_LINES.map((l, i) => (
        <text
          key={i}
          x={16}
          y={top + i * step}
          fontFamily="var(--font-mono), monospace"
          fontSize={size}
          fontWeight={l.note === 0 ? 700 : 400}
          fill={l.note === 0 ? "var(--primary)" : "currentColor"}
          fillOpacity={l.note === -1 ? 0.6 : 1}
          style={{ whiteSpace: "pre" }}
        >
          {l.text}
        </text>
      ))}
      {noted.map((l) => {
        const cx = 16 + l.text.length * size * 0.6 + 14;
        const cy = top + l.i * step - 3.5;
        return (
          <g key={`badge-${l.i}`}>
            <circle cx={cx} cy={cy} r={7.5} fill="var(--primary)" fillOpacity={0.15} stroke="var(--primary)" />
            <SketchText x={cx} y={cy + 3.5} size={9} bold accent>
              {String(l.note + 1)}
            </SketchText>
          </g>
        );
      })}
      <line x1={legendX - 18} y1={20} x2={legendX - 18} y2={282} stroke="currentColor" strokeOpacity={0.2} />
      {STATUS_NOTES.map((n, k) => {
        const y = 36 + k * 52;
        return (
          <g key={n.title}>
            <circle cx={legendX + 6} cy={y - 3.5} r={7.5} fill="var(--primary)" fillOpacity={0.15} stroke="var(--primary)" />
            <SketchText x={legendX + 6} y={y} size={9} bold accent>
              {String(k + 1)}
            </SketchText>
            <SketchText x={legendX + 22} y={y} size={9.5} anchor="start" bold accent>
              {n.title}
            </SketchText>
            <SketchText x={legendX + 22} y={y + 17} size={8.5} anchor="start" body opacity={0.8}>
              {n.body}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. একটা Crash Loop, সময়ের দাগে                                               */
/* ------------------------------------------------------------------------- */

const ATTEMPTS = [
  { t: "07:25:31", pid: "502" },
  { t: "07:25:33", pid: "515" },
  { t: "07:25:34", pid: "527" },
  { t: "07:25:35", pid: "539" },
  { t: "07:25:37", pid: "551" },
];

export function CrashLoopTimelineDiagram() {
  const x0 = 70;
  const colW = 128;
  return (
    <Sketch
      label="DIAGRAM: সাত সেকেন্ডে পাঁচবার পড়ে যাওয়া"
      minWidth={780}
      height={330}
      viewBox="0 0 900 330"
      caption={
        <>
          Practice Server এর আসল Crash Loop। প্রতিটা চেষ্টায় নতুন PID, আর প্রতিটায় App
          এর মুখে একই কথা: <code>Error: DATABASE_URL is not set</code>। সেটাই কারণ। পাঁচ
          নম্বরের পর systemd হাল ছেড়ে দেয়, কারণ Default নিয়মে দশ সেকেন্ডে পাঁচবারের
          বেশি চালু করে না। Journal এর একদম শেষের লাইনগুলো তাই শুধু systemd এর সারাংশ,
          কারণটা থাকে তার উপরে।
        </>
      }
    >
      <Arrow id="logs-loop-arrow" />
      <line x1={40} y1={70} x2={870} y2={70} stroke="currentColor" strokeOpacity={0.35} strokeWidth="1.2" />

      {ATTEMPTS.map((a, i) => {
        const cx = x0 + i * colW;
        return (
          <g key={a.pid}>
            <circle cx={cx} cy={70} r={5} fill="var(--primary)" />
            <SketchText x={cx} y={52} size={9.5} bold>
              {a.t}
            </SketchText>
            <SketchText x={cx} y={92} size={9} opacity={0.7}>
              {`PID ${a.pid}`}
            </SketchText>
            <rect
              x={cx - 56}
              y={108}
              width={112}
              height={30}
              fill="currentColor"
              fillOpacity={0.04}
              stroke="currentColor"
              strokeOpacity={0.4}
            />
            <SketchText x={cx} y={127} size={9}>
              Started
            </SketchText>
            <rect
              x={cx - 56}
              y={146}
              width={112}
              height={44}
              fill="var(--primary)"
              fillOpacity={0.12}
              stroke="var(--primary)"
            />
            <SketchText x={cx} y={164} size={9} bold accent>
              Error:
            </SketchText>
            <SketchText x={cx} y={180} size={8.5} accent>
              DATABASE_URL ...
            </SketchText>
            <rect
              x={cx - 56}
              y={198}
              width={112}
              height={30}
              fill="currentColor"
              fillOpacity={0.04}
              stroke="currentColor"
              strokeOpacity={0.4}
            />
            <SketchText x={cx} y={217} size={9}>
              status=1/FAILURE
            </SketchText>
          </g>
        );
      })}

      {/* the give-up column */}
      <circle cx={760} cy={70} r={6} fill="none" stroke="currentColor" strokeWidth="1.6" />
      <SketchText x={760} y={52} size={9.5} bold>
        07:25:38
      </SketchText>
      <rect x={690} y={108} width={180} height={120} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.5} strokeDasharray="4 3" />
      <SketchText x={780} y={130} size={9}>
        restart counter is at 5
      </SketchText>
      <SketchText x={780} y={152} size={9} bold>
        Start request repeated
      </SketchText>
      <SketchText x={780} y={166} size={9} bold>
        too quickly.
      </SketchText>
      <SketchText x={780} y={190} size={9}>
        Failed with result
      </SketchText>
      <SketchText x={780} y={206} size={9}>
        &apos;exit-code&apos;.
      </SketchText>

      {/* annotations */}
      <path d="M 70 236 L 70 252 L 582 252 L 582 236" fill="none" stroke="var(--primary)" strokeWidth="1.2" />
      <SketchText x={326} y={272} size={10} bold accent body>
        কারণ এখানে, প্রতিটা চেষ্টায় একই কথা
      </SketchText>
      <SketchText x={326} y={290} size={8.5} body opacity={0.75}>
        App এর নিজের লাইন, node[PID] দিয়ে শুরু
      </SketchText>
      <path d="M 690 236 L 690 252 L 870 252 L 870 236" fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.2" />
      <SketchText x={780} y={272} size={10} bold body>
        শেষ লাইন শুধু সারাংশ
      </SketchText>
      <SketchText x={780} y={290} size={8.5} body opacity={0.75}>
        systemd[1] লিখেছে, App নয়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. Log যেন Disk না খেয়ে ফেলে                                                 */
/* ------------------------------------------------------------------------- */

const ROTATE_STEPS = [
  { title: "আজ রাত পর্যন্ত", files: [{ name: "backup.log", note: "লেখা চলছে", accent: true }] },
  {
    title: "প্রথম রাতে",
    files: [
      { name: "backup.log", note: "নতুন, খালি", accent: true },
      { name: "backup.log-20261031", note: "আগেরটা, নাম বদলে" },
    ],
  },
  {
    title: "দ্বিতীয় রাতে",
    files: [
      { name: "backup.log", note: "নতুন, খালি", accent: true },
      { name: "backup.log-20261101", note: "delaycompress" },
      { name: "backup.log-20261031.gz", note: "এবার চেপে ছোট" },
    ],
  },
  {
    title: "পনেরোতম রাতে",
    files: [
      { name: "backup.log", note: "নতুন, খালি", accent: true },
      { name: "... চোদ্দটা পুরনো", note: "rotate 14" },
      { name: "সবচেয়ে পুরনোটা", note: "মুছে ফেলা", gone: true },
    ],
  },
];

export function LogDiskSplit() {
  return (
    <SketchSplit
      label="DIAGRAM: দুই ধরনের Log, দুই রকম ছাঁটাই"
      caption={
        <>
          বাঁয়ে Journal: journald নিজেই একটা সীমা মানে, সীমায় পৌঁছালে সবচেয়ে পুরনো
          File টা মুছে জায়গা করে। ডানে Text File: এখানে কেউ নিজে থেকে ছাঁটে না, সেই কাজ
          logrotate এর। প্রতি রাতে File টার নাম বদলায়, নতুন খালি File খোলে, পুরনোগুলো
          চেপে ছোট করে আর নির্দিষ্ট সংখ্যার পরে মুছে ফেলে।
        </>
      }
      panels={[
        {
          title: "journald",
          sub: "SystemMaxUse=1G",
          viewBox: "0 0 400 260",
          height: 260,
          minWidth: 340,
          children: (
            <g>
              <rect x={30} y={40} width={340} height={56} fill="none" stroke="currentColor" strokeOpacity={0.5} />
              {[0, 1, 2, 3, 4].map((i) => (
                <rect
                  key={i}
                  x={36 + i * 66}
                  y={46}
                  width={60}
                  height={44}
                  fill={i === 4 ? "var(--primary)" : "currentColor"}
                  fillOpacity={i === 0 ? 0.03 : i === 4 ? 0.2 : 0.1}
                  stroke={i === 4 ? "var(--primary)" : "currentColor"}
                  strokeOpacity={i === 0 ? 0.3 : 0.6}
                  strokeDasharray={i === 0 ? "3 3" : undefined}
                />
              ))}
              <SketchText x={66} y={73} size={8.5} opacity={0.6} body>
                সবচেয়ে
              </SketchText>
              <SketchText x={66} y={86} size={8.5} opacity={0.6} body>
                পুরনো
              </SketchText>
              <SketchText x={330} y={72} size={8.5} accent bold body>
                এখন
              </SketchText>
              <SketchText x={330} y={85} size={8.5} accent body>
                লেখা চলছে
              </SketchText>
              <SketchText x={200} y={28} size={9.5} bold>
                সীমা 1G, এর বেশি কখনো নয়
              </SketchText>
              <path d="M 66 104 L 66 132" stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.2" />
              <SketchText x={66} y={150} size={9} body>
                সীমায় পৌঁছালে
              </SketchText>
              <SketchText x={66} y={166} size={9} body>
                এটা আগে মোছে
              </SketchText>
              <SketchText x={250} y={150} size={9} anchor="middle" opacity={0.85}>
                SystemKeepFree=2G
              </SketchText>
              <SketchText x={250} y={166} size={8.5} anchor="middle" body opacity={0.75}>
                Disk এ অন্তত এতটা খালি রাখে
              </SketchText>
              <SketchText x={200} y={210} size={9} opacity={0.85}>
                MaxRetentionSec=1month
              </SketchText>
              <SketchText x={200} y={226} size={8.5} body opacity={0.75}>
                এক মাসের পুরনো লাইনও বাদ
              </SketchText>
            </g>
          ),
        },
        {
          title: "logrotate",
          sub: "daily, rotate 14, compress",
          viewBox: "0 0 460 260",
          height: 260,
          minWidth: 400,
          children: (
            <g>
              {ROTATE_STEPS.map((step, i) => {
                const x = 8 + i * 113;
                return (
                  <g key={step.title}>
                    <SketchText x={x + 52} y={20} size={9} bold body>
                      {step.title}
                    </SketchText>
                    {step.files.map((f, j) => {
                      const y = 34 + j * 66;
                      const gone = "gone" in f && f.gone;
                      const accent = "accent" in f && f.accent;
                      return (
                        <g key={f.name}>
                          <rect
                            x={x}
                            y={y}
                            width={104}
                            height={52}
                            fill={accent ? "var(--primary)" : "currentColor"}
                            fillOpacity={accent ? 0.1 : 0.04}
                            stroke={accent ? "var(--primary)" : "currentColor"}
                            strokeOpacity={gone ? 0.3 : 0.55}
                            strokeDasharray={gone ? "3 3" : undefined}
                          />
                          <SketchText x={x + 52} y={y + 21} size={7.5} bold accent={accent} opacity={gone ? 0.5 : 1}>
                            {f.name}
                          </SketchText>
                          <SketchText x={x + 52} y={y + 38} size={8} body opacity={gone ? 0.5 : 0.75}>
                            {f.note}
                          </SketchText>
                          {gone && (
                            <line x1={x + 6} y1={y + 6} x2={x + 98} y2={y + 46} stroke="currentColor" strokeOpacity={0.5} />
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 6. রাত দুইটায় কাজে লাগে এমন Log, আর যেটা লাগে না                              */
/* ------------------------------------------------------------------------- */

const BAD_LINES = [
  "booking failed!!",
  "error: something went wrong",
  "login ok tourist@mail.example",
  "Cookie: __Host-session=Qm9va2luZ...",
  "10/31 2:10 AM payment slow",
];

const BAD_NOTES = [
  "কোন বুকিং? কোন Request?",
  "কী ভুল? কোথায়?",
  "মানুষের Email, Log এ থাকার কথা নয়",
  "Session চুরির চাবি Log এ পড়ে আছে",
  "কোন দেশের সময়? মাস না দিন আগে?",
];

const GOOD_LINES = [
  '"time":"2026-10-30T20:10:04.447Z"',
  '"level":"error"',
  '"msg":"booking failed"',
  '"requestId":"req-9K1P"',
  '"bookingId":"bk_7Q2M9X","userId":"usr_42"',
  '"reason":"seat already taken"',
];

const GOOD_NOTES = [
  "UTC, ISO, কোনো সন্দেহ নেই",
  "-p আর jq দিয়ে ছাঁকা যায়",
  "ছোট, সবসময় একই শব্দ",
  "Caddy থেকে App পর্যন্ত একই সুতা",
  "নম্বর দিয়ে চেনা, ব্যক্তিগত তথ্য নয়",
  "আসল কারণ, এক নজরে",
];

export function GoodBadLogSplit() {
  return (
    <SketchSplit
      label="DIAGRAM: একই ঘটনা, দুইভাবে লেখা"
      caption={
        <>
          বাঁয়ের লাইনগুলো লিখতে সহজ, পড়তে অসহায়। রাত দুইটায় এগুলো দিয়ে কোনো প্রশ্নের
          উত্তর মেলে না, উল্টো দুইটা লাইন নিজেই বিপদ, কারণ Log File অনেকে পড়ে আর অনেক
          দিন থাকে। ডানের লাইনটা একটাই JSON, প্রতিটা Field একটা প্রশ্নের উত্তর।
        </>
      }
      panels={[
        {
          title: "যেটা কাজে লাগে না",
          sub: "এলোমেলো Text",
          viewBox: "0 0 420 290",
          height: 290,
          minWidth: 360,
          children: (
            <g>
              {BAD_LINES.map((l, i) => (
                <g key={l}>
                  <SketchText x={12} y={28 + i * 54} size={10} anchor="start" opacity={0.9}>
                    {l}
                  </SketchText>
                  <SketchText x={24} y={46 + i * 54} size={8.5} anchor="start" body opacity={0.7}>
                    {`× ${BAD_NOTES[i]}`}
                  </SketchText>
                </g>
              ))}
            </g>
          ),
        },
        {
          title: "যেটা কাজে লাগে",
          sub: "এক লাইনে এক JSON",
          viewBox: "0 0 440 290",
          height: 290,
          minWidth: 380,
          children: (
            <g>
              {GOOD_LINES.map((l, i) => (
                <g key={l}>
                  <SketchText x={12} y={26 + i * 46} size={9.5} anchor="start" accent={i === 3}>
                    {l}
                  </SketchText>
                  <SketchText x={24} y={42 + i * 46} size={8.5} anchor="start" body opacity={0.75}>
                    {`✓ ${GOOD_NOTES[i]}`}
                  </SketchText>
                </g>
              ))}
            </g>
          ),
        },
      ]}
    />
  );
}
