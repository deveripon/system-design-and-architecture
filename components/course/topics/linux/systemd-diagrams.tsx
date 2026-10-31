/**
 * What: The still diagrams for Module 07 Lesson 02, Process Management and systemd. They show
 * the process tree on the practice server, the states a process moves through, why a process
 * started by hand has nobody to look after it, where unit files live and how they merge, what
 * happens in the seconds after a stop, and the chain that starts the app when the server boots.
 *
 * Why: A process tree, a state machine and a boot chain are pictures before they are words.
 * The PIDs and file paths are the real ones captured on the practice server, so the reader
 * sees the same numbers in the drawing and in the terminal. Every marker id starts with
 * "systemd-" so two diagrams on one page never share an id.
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
  size = 10,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  sub?: string;
  accent?: boolean;
  size?: number;
  dashed?: boolean;
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
  d,
  marker,
  dashed,
  accent,
}: {
  d: string;
  marker?: string;
  dashed?: boolean;
  accent?: boolean;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={accent ? "var(--primary)" : "currentColor"}
      strokeOpacity={accent ? 0.9 : 0.5}
      strokeWidth="1.3"
      strokeDasharray={dashed ? "5 4" : undefined}
      markerEnd={marker ? `url(#${marker})` : undefined}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 1. একটা গাছ, যার গোড়ায় PID 1                                               */
/* ------------------------------------------------------------------------- */

export function ProcessTreeDiagram() {
  return (
    <Sketch
      label="Diagram: island-vps-01 এর Process গাছ"
      height={330}
      minWidth={880}
      viewBox="0 0 880 330"
      caption="Practice Server এ ps -ef --forest আর pstree -p যা দেখিয়েছে, সেটাই এখানে আঁকা, my-tours Service বসানোর পরে। সবার গোড়ায় PID 1, systemd। সে নিজে চালু করেছে Journal, cron, SSH Server আর my-tours এর node। আপনি যখন SSH দিয়ে ঢুকলেন, sshd নিজের একটা কপি বানাল, সেটা আরেকটা, তারপর আপনার bash, আর bash এর ভেতরে আপনার চালানো ps। প্রতিটা তীর মানে এই Process টা ওই Process এর সন্তান, মানে তার PPID ওই সংখ্যা। লক্ষ করুন, node এর বাবা সরাসরি PID 1, কোনো Terminal নয়। তাই আপনি Logout করলেও node বেঁচে থাকে।"
    >
      <Arrow id="systemd-tree-a" muted />
      <Arrow id="systemd-tree-p" />

      <Box x={16} y={140} w={130} h={50} text="systemd" sub="PID 1 · root" accent />

      {/* first generation */}
      <Box x={210} y={20} w={150} text="systemd-journald" sub="PID 24" />
      <Box x={210} y={78} w={150} text="cron" sub="PID 73" />
      <Box x={210} y={145} w={150} text="sshd (listener)" sub="PID 127" />
      <Box x={210} y={262} w={150} text="node server.mjs" sub="PID 609 · mytours" accent />

      <Line d="M146,158 C180,158 180,40 208,40" marker="systemd-tree-a" />
      <Line d="M146,162 C180,162 180,98 208,98" marker="systemd-tree-a" />
      <Line d="M146,165 L208,165" marker="systemd-tree-a" />
      <Line d="M146,172 C180,172 180,282 208,282" marker="systemd-tree-p" accent />

      {/* the ssh login chain */}
      <Box x={400} y={145} w={140} text="sshd: deploy" sub="PID 696 · [priv]" />
      <Box x={570} y={145} w={140} text="sshd: deploy" sub="PID 707 · pts/0" />
      <Box x={740} y={145} w={124} text="-bash" sub="PID 708 · deploy" />
      <Box x={740} y={232} w={124} text="ps -ef" sub="PID 717" dashed />

      <Line d="M360,165 L398,165" marker="systemd-tree-a" />
      <Line d="M540,165 L568,165" marker="systemd-tree-a" />
      <Line d="M710,165 L738,165" marker="systemd-tree-a" />
      <Line d="M802,185 L802,230" marker="systemd-tree-a" />

      <SketchText x={632} y={120} size={9} body opacity={0.8}>
        আপনার SSH Login এর শাখা
      </SketchText>
      <SketchText x={560} y={298} size={9} body opacity={0.8}>
        Logout করলে এই শাখাটা মরে যায়, node এর শাখা নয়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Process এর পাঁচ অবস্থা                                                    */
/* ------------------------------------------------------------------------- */

export function ProcessStatesDiagram() {
  return (
    <Sketch
      label="Diagram: ps এর STAT কলামের অক্ষরগুলো"
      height={330}
      minWidth={860}
      viewBox="0 0 860 330"
      caption="একটা Process সারাজীবন এই কয়েকটা অবস্থার মধ্যে ঘোরে। বেশিরভাগ সময় সে S, মানে ঘুমিয়ে কিছুর অপেক্ষায়: একটা Request, একটা Timer, Disk এর উত্তর। কাজ এলে R হয়, CPU পেয়ে চলে। D মানে Disk বা Network Storage এর উত্তরের জন্য এমন অপেক্ষা যেটা Signal দিয়েও ভাঙা যায় না। T মানে কেউ থামিয়ে রেখেছে, Ctrl+Z বা SIGSTOP দিয়ে। আর Z হলো শেষ দশা: Process মরে গেছে, কিন্তু তার বাবা এখনো Exit Code টা পড়েনি, তাই Kernel একটা ছোট্ট চিরকুট রেখে দিয়েছে।"
    >
      <Arrow id="systemd-state-a" muted />
      <Arrow id="systemd-state-p" />

      <Box x={350} y={120} w={160} h={56} text="R" sub="চলছে, বা CPU এর লাইনে" accent size={16} />
      <Box x={40} y={120} w={170} h={56} text="S" sub="ঘুমিয়ে অপেক্ষা" size={16} />
      <Box x={350} y={250} w={160} h={56} text="D" sub="Disk এর জন্য অটল অপেক্ষা" size={16} />
      <Box x={350} y={10} w={160} h={56} text="T" sub="থামিয়ে রাখা" size={16} />
      <Box x={650} y={120} w={170} h={56} text="Z" sub="মৃত, Exit Code পড়া বাকি" size={16} dashed />

      {/* R <-> S */}
      <Line d="M348,138 L214,138" marker="systemd-state-a" />
      <SketchText x={281} y={130} size={8.5} body opacity={0.85}>
        কিছুর অপেক্ষা
      </SketchText>
      <Line d="M212,160 L346,160" marker="systemd-state-a" />
      <SketchText x={281} y={176} size={8.5} body opacity={0.85}>
        অপেক্ষা শেষ
      </SketchText>

      {/* R <-> D */}
      <Line d="M410,178 L410,246" marker="systemd-state-a" />
      <Line d="M452,248 L452,180" marker="systemd-state-a" />
      <SketchText x={540} y={218} size={8.5} body opacity={0.85}>
        Disk পড়া শেষ হলে ফেরে
      </SketchText>

      {/* R <-> T */}
      <Line d="M410,118 L410,70" marker="systemd-state-a" />
      <SketchText x={334} y={98} size={8.5} anchor="end" opacity={0.85}>
        Ctrl+Z, SIGSTOP
      </SketchText>
      <Line d="M452,70 L452,116" marker="systemd-state-a" />
      <SketchText x={466} y={98} size={8.5} anchor="start" opacity={0.85}>
        fg, bg, SIGCONT
      </SketchText>

      {/* R -> Z -> gone */}
      <Line d="M512,148 L646,148" marker="systemd-state-p" accent />
      <SketchText x={579} y={140} size={8.5} body opacity={0.85}>
        exit বা Signal এ মৃত্যু
      </SketchText>
      <Line d="M735,180 L735,250" marker="systemd-state-p" accent />
      <SketchText x={735} y={268} size={8.5} body opacity={0.85}>
        বাবা Exit Code পড়লে
      </SketchText>
      <SketchText x={735} y={284} size={8.5} body opacity={0.85}>
        চিরকুটও মুছে যায়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. হাতে চালানো Process, আর systemd এর দেখাশোনায় চলা Process                 */
/* ------------------------------------------------------------------------- */

function CheckRow({ y, ok, text }: { y: number; ok: boolean; text: string }) {
  return (
    <g>
      <rect
        x={8}
        y={y - 14}
        width={20}
        height={20}
        fill={ok ? "var(--primary)" : "currentColor"}
        fillOpacity={ok ? 0.15 : 0.06}
        stroke={ok ? "var(--primary)" : "currentColor"}
        strokeOpacity={ok ? 1 : 0.5}
      />
      {ok ? (
        <path d={`M12,${y - 4} L17,${y + 1} L24,${y - 9}`} fill="none" stroke="var(--primary)" strokeWidth="2" />
      ) : (
        <path
          d={`M13,${y - 9} L23,${y + 1} M23,${y - 9} L13,${y + 1}`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.7}
          strokeWidth="1.8"
        />
      )}
      <SketchText x={40} y={y} size={10} body anchor="start" opacity={ok ? 1 : 0.85}>
        {text}
      </SketchText>
    </g>
  );
}

export function CaretakerSplit() {
  const nohup = [
    "Crash করলে কেউ আবার চালু করে না",
    "Server Reboot হলে কেউ চালু করে না",
    "চলে আপনার নিজের User হয়ে",
    "Log যায় nohup.out নামের একটা ফাইলে",
    "থামাতে হলে PID খুঁজে নিজে kill",
    "Setting থাকে আপনার Shell এর মাথায়",
  ];
  const systemd = [
    "Crash করলে নিজে আবার চালু করে",
    "Boot এর সময় নিজে চালু করে",
    "চলে আলাদা, কম ক্ষমতার User হয়ে",
    "Log যায় Journal এ, Time সহ",
    "systemctl stop, ভদ্রভাবে, সময়সীমা সহ",
    "Setting লেখা থাকে একটা ফাইলে",
  ];
  return (
    <SketchSplit
      label="Diagram: কে দেখে রাখে"
      caption="বাঁ দিকটা হলো Terminal এ nohup node server.mjs & লিখে চলে যাওয়া। App চলছে ঠিকই, কিন্তু তার কোনো অভিভাবক নেই। ডান দিকটা হলো একই App একটা systemd Service হিসেবে। Code এর একটা লাইনও বদলায়নি, বদলেছে শুধু কে তাকে চালু করল আর কে তার দিকে চোখ রাখছে। Production Server এ প্রতিটা দীর্ঘজীবী Program ডান দিকের মতো চলা উচিত।"
      panels={[
        {
          title: "nohup বা & দিয়ে",
          sub: "হাতে চালানো",
          viewBox: "0 0 380 250",
          height: 250,
          minWidth: 340,
          children: (
            <g>
              {nohup.map((t, i) => (
                <CheckRow key={t} y={30 + i * 38} ok={false} text={t} />
              ))}
            </g>
          ),
        },
        {
          title: "systemd Service",
          sub: "my-tours-api.service",
          viewBox: "0 0 380 250",
          height: 250,
          minWidth: 340,
          children: (
            <g>
              {systemd.map((t, i) => (
                <CheckRow key={t} y={30 + i * 38} ok text={t} />
              ))}
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Unit ফাইল কোথায় থাকে, আর কোনটা জেতে                                      */
/* ------------------------------------------------------------------------- */

export function UnitLocationsDiagram() {
  return (
    <Sketch
      label="Diagram: তিন জায়গার Unit ফাইল, systemd এর চোখে একটা"
      height={330}
      minWidth={880}
      viewBox="0 0 880 330"
      caption="apt দিয়ে কোনো Package বসালে তার Unit ফাইল যায় /usr/lib/systemd/system এ। ওগুলো Package এর সম্পত্তি, পরের Update এ বদলে যেতে পারে, তাই হাত দেবেন না। নিজের লেখা Unit রাখবেন /etc/systemd/system এ। একই নামের ফাইল দুই জায়গায় থাকলে /etc এরটা জেতে। আর পুরো ফাইল না বদলে শুধু একটা দুইটা লাইন বদলাতে চাইলে নামের পাশে .d Folder বানিয়ে তার ভেতরে একটা ছোট .conf ফাইল, যার নাম Drop-in। systemd সব মিলিয়ে একটা Unit বানায়, systemctl cat ঠিক সেটাই দেখায়। আর যেকোনো ফাইল বদলানোর পর daemon-reload না দিলে systemd পুরনো ছবিটাই মনে রাখে।"
    >
      <Arrow id="systemd-loc-a" muted />
      <Arrow id="systemd-loc-p" />

      <Box
        x={20}
        y={24}
        w={360}
        h={64}
        text="/usr/lib/systemd/system/"
        sub="cron.service, ssh.service, caddy.service"
        dashed
      />
      <SketchText x={200} y={106} size={9} body opacity={0.8}>
        Package এর ফাইল, apt বসায়, হাত দেবেন না
      </SketchText>

      <Box
        x={20}
        y={128}
        w={360}
        h={64}
        text="/etc/systemd/system/"
        sub="my-tours-api.service"
        accent
      />
      <SketchText x={200} y={210} size={9} body opacity={0.8}>
        আপনার লেখা ফাইল, একই নাম হলে এটাই জেতে
      </SketchText>

      <Box
        x={20}
        y={232}
        w={360}
        h={64}
        text="/etc/systemd/system/my-tours-api.service.d/"
        sub="override.conf, hardening.conf"
      />
      <SketchText x={200} y={314} size={9} body opacity={0.8}>
        Drop-in, শুধু যেটুকু বদলাতে চান
      </SketchText>

      <Line d="M382,56 C470,56 470,150 548,158" marker="systemd-loc-a" dashed />
      <Line d="M382,160 L548,160" marker="systemd-loc-p" accent />
      <Line d="M382,264 C470,264 470,170 548,164" marker="systemd-loc-a" />

      <SketchText x={466} y={150} size={9} bold accent>
        daemon-reload
      </SketchText>

      <Box x={552} y={120} w={310} h={84} text="systemd এর চোখে একটা Unit" sub="systemctl cat my-tours-api" accent />
      <SketchText x={707} y={232} size={9} body opacity={0.85}>
        Boot এর সময় আর daemon-reload এ
      </SketchText>
      <SketchText x={707} y={248} size={9} body opacity={0.85}>
        systemd সব ফাইল আবার পড়ে মিলিয়ে নেয়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. systemctl stop এর পরের কয়েক সেকেন্ড                                     */
/* ------------------------------------------------------------------------- */

export function StopTimelineDiagram() {
  const x0 = 170;
  const x1 = 830;
  const sec = (s: number) => x0 + ((x1 - x0) * s) / 15;
  const lanes = [
    { y: 70, title: "ভদ্র App", sub: "SIGTERM ধরে, কাজ শেষ করে" },
    { y: 150, title: "Handler নেই", sub: "SIGTERM এ সাথে সাথে মৃত" },
    { y: 230, title: "জেদি App", sub: "SIGTERM শুনেও চলতে থাকে" },
  ];
  return (
    <Sketch
      label="Diagram: stop দেওয়ার পর ১৫ সেকেন্ড, তিন রকম App"
      height={340}
      minWidth={900}
      viewBox="0 0 900 340"
      caption="my-tours-api.service এ TimeoutStopSec=15। শূন্য সেকেন্ডে systemd তিনটা App কেই একই জিনিস পাঠায়, SIGTERM। প্রথম App চলমান বুকিংটা ৪ সেকেন্ডে শেষ করে নিজে বেরিয়ে যায়, ফল success। দ্বিতীয়টার কোনো Handler নেই, সাথে সাথে মরে, systemd তবুও success লেখে, কিন্তু মাঝপথের বুকিংটা হারিয়ে গেছে। তৃতীয়টা কথাই শোনে না, ১৫ সেকেন্ড পুরো হলে systemd SIGKILL পাঠিয়ে জোর করে থামায়, ফল timeout। প্রথম আর তৃতীয় সারির Log লাইনগুলো Practice Server থেকে নেওয়া।"
    >
      <Arrow id="systemd-stop-p" />
      <Arrow id="systemd-stop-a" muted />

      {/* axis */}
      <line x1={x0} y1={300} x2={x1} y2={300} stroke="currentColor" strokeOpacity={0.5} />
      {[0, 4, 15].map(s => (
        <g key={s}>
          <line x1={sec(s)} y1={296} x2={sec(s)} y2={304} stroke="currentColor" strokeOpacity={0.6} />
          <SketchText x={sec(s)} y={320} size={9}>
            {`${s}s`}
          </SketchText>
        </g>
      ))}
      <line
        x1={sec(0)}
        y1={36}
        x2={sec(0)}
        y2={296}
        stroke="var(--primary)"
        strokeOpacity={0.6}
        strokeDasharray="4 3"
      />
      <SketchText x={sec(0)} y={26} size={9} bold accent>
        SIGTERM
      </SketchText>
      <line
        x1={sec(15)}
        y1={36}
        x2={sec(15)}
        y2={296}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeDasharray="4 3"
      />
      <SketchText x={sec(15)} y={26} size={9} bold>
        TimeoutStopSec
      </SketchText>

      {lanes.map(l => (
        <g key={l.title}>
          <SketchText x={12} y={l.y} size={10} body bold anchor="start">
            {l.title}
          </SketchText>
          <SketchText x={12} y={l.y + 16} size={8.5} body anchor="start" opacity={0.75}>
            {l.sub}
          </SketchText>
        </g>
      ))}

      {/* lane 1: finishes at 4 s */}
      <rect x={sec(0)} y={58} width={sec(4) - sec(0)} height={22} fill="var(--primary)" fillOpacity={0.18} stroke="var(--primary)" />
      <SketchText x={(sec(0) + sec(4)) / 2} y={73} size={8.5} body>
        বুকিং শেষ হচ্ছে
      </SketchText>
      <SketchText x={sec(4) + 10} y={66} size={8.5} anchor="start">
        exit 0
      </SketchText>
      <SketchText x={sec(4) + 10} y={80} size={8.5} anchor="start" opacity={0.75}>
        Deactivated successfully
      </SketchText>

      {/* lane 2: dies at 0 */}
      <path
        d={`M${sec(0) + 4},${140} l12,12 M${sec(0) + 16},${140} l-12,12`}
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity={0.8}
      />
      <SketchText x={sec(0) + 26} y={146} size={8.5} anchor="start" opacity={0.85}>
        মৃত, Signal 15
      </SketchText>
      <SketchText x={sec(0) + 26} y={160} size={8.5} anchor="start" body opacity={0.75}>
        systemd লেখে success, কিন্তু চলমান বুকিং হারিয়ে গেছে
      </SketchText>

      {/* lane 3: runs until SIGKILL */}
      <rect x={sec(0)} y={218} width={sec(15) - sec(0)} height={22} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.5} />
      <SketchText x={(sec(0) + sec(15)) / 2} y={233} size={8.5}>
        got SIGTERM, ignoring it
      </SketchText>
      <Line d={`M${sec(15) - 60},${266} L${sec(15) - 4},${244}`} marker="systemd-stop-p" accent />
      <SketchText x={sec(15) - 64} y={272} size={8.5} anchor="end">
        SIGKILL, status=9/KILL, Result: timeout
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. বিদ্যুৎ আসা থেকে my-tours চালু হওয়া পর্যন্ত                               */
/* ------------------------------------------------------------------------- */

export function BootChainDiagram() {
  const chain = [
    { t: "Power On", s: "Provider এর বোতাম" },
    { t: "Firmware", s: "BIOS বা UEFI" },
    { t: "Bootloader", s: "GRUB" },
    { t: "Linux Kernel", s: "Hardware চেনে" },
    { t: "systemd", s: "PID 1" },
    { t: "multi-user.target", s: "Server তৈরি" },
  ];
  const services = [
    { t: "ssh.service", s: "আপনার দরজা" },
    { t: "cron.service", s: "সময়ের কাজ" },
    { t: "caddy.service", s: "Port 80, 443" },
    { t: "docker.service", s: "Island Tours API" },
    { t: "my-tours-api", s: "127.0.0.1:3000" },
  ];
  const w = 128;
  const gap = 20;
  return (
    <Sketch
      label="Diagram: Reboot এর পর App কে কে চালু করে"
      height={320}
      minWidth={900}
      viewBox="0 0 900 320"
      caption="VPS এ বিদ্যুতের বোতাম Provider এর হাতে, কিন্তু তারপরের শিকল সব Linux এ একই। Firmware Bootloader কে জাগায়, Bootloader Kernel কে Memory তে তোলে, আর Kernel তার প্রথম Process হিসেবে systemd চালায়, তাই তার PID 1। systemd এরপর ধাপে ধাপে Target গুলোর দিকে এগোয়। multi-user.target মানে Network সহ পুরোদস্তুর Server, আর যেসব Service এই Target এর Wants এ আছে, systemd তাদের সবাইকে চালু করে। systemctl enable আসলে এটুকুই করে: multi-user.target.wants Folder এ আপনার Unit এর একটা Symlink বসায়। Module 06 এর প্রশ্ন ছিল Server চালু হলে App কে কে চালু করে। উত্তর এই শিকল।"
    >
      <Arrow id="systemd-boot-a" muted />
      <Arrow id="systemd-boot-p" />

      {chain.map((c, i) => {
        const x = 12 + i * (w + gap);
        const last = i === chain.length - 1;
        return (
          <g key={c.t}>
            <Box x={x} y={40} w={w} h={50} text={c.t} sub={c.s} accent={c.t === "systemd"} size={9.5} />
            {!last && <Line d={`M${x + w},65 L${x + w + gap - 2},65`} marker="systemd-boot-a" />}
          </g>
        );
      })}

      {services.map((s, i) => {
        const x = 20 + i * 176;
        const mine = s.t === "my-tours-api";
        const tx = 12 + 5 * (w + gap) + w / 2;
        return (
          <g key={s.t}>
            <Box x={x} y={210} w={156} h={50} text={s.t} sub={s.s} accent={mine} size={9.5} />
            <Line
              d={`M${tx},92 C${tx},150 ${x + 78},150 ${x + 78},206`}
              marker={mine ? "systemd-boot-p" : "systemd-boot-a"}
              accent={mine}
              dashed={!mine}
            />
          </g>
        );
      })}

      <SketchText x={450} y={290} size={9} body opacity={0.85}>
        প্রতিটা Service এর Symlink থাকে /etc/systemd/system/multi-user.target.wants/ এ
      </SketchText>
    </Sketch>
  );
}
