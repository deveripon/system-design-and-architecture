/**
 * What: The still diagrams for Module 07 Lesson 05, Environment Variables. They show one piece of
 * code taking different values in three places, how a process hands a copy of its environment to
 * a child, how the shell walks PATH to find a command, what Next.js freezes at build time against
 * what a server reads at run time, and the eight places a secret usually leaks.
 *
 * Why: An environment is invisible until you draw it. Each idea gets one small picture with the
 * real names from the lesson (my-tours, Island Tours, the Ubuntu 24.04 PATH). Every marker id
 * starts with "env-" so two diagrams on one page never share an id.
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

function Card({
  x,
  y,
  w,
  h,
  title,
  lines = [],
  accent,
  dashed,
  titleSize = 10,
  lineSize = 8.5,
  mono,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  accent?: boolean;
  dashed?: boolean;
  titleSize?: number;
  lineSize?: number;
  mono?: boolean;
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
      <SketchText x={x + 12} y={y + 20} size={titleSize} anchor="start" bold body accent={accent}>
        {title}
      </SketchText>
      {lines.map((line, i) => (
        <SketchText
          key={line}
          x={x + 12}
          y={y + 38 + i * 15}
          size={lineSize}
          anchor="start"
          body={!mono}
          opacity={0.85}
        >
          {line}
        </SketchText>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. একই Code, তিন জায়গায় তিনটা মান                                          */
/* ------------------------------------------------------------------------- */

export function EnvSameCodeDiagram() {
  const envs = [
    {
      title: "আপনার Laptop",
      lines: ["NODE_ENV=development", "DATABASE_URL=postgresql://localhost/mytours_dev"],
    },
    {
      title: "Practice Server",
      lines: ["NODE_ENV=production", "DATABASE_URL=postgresql://127.0.0.1/mytours"],
    },
    {
      title: "Island Tours VPS, 103.94.135.2",
      lines: ["NODE_ENV=production", "DATABASE_URL=•••••••• (Secret, কেউ দেখে না)"],
    },
  ];
  return (
    <Sketch
      label="Diagram: একই Code, তিন জায়গায় তিনটা মান"
      height={320}
      minWidth={720}
      viewBox="0 0 780 320"
      caption="বাম পাশের তিনটা যন্ত্রে Code টা হুবহু এক, একটা অক্ষরও আলাদা নয়। আলাদা শুধু চালু হওয়ার সময় Process এর হাতে দেওয়া মানগুলো। Code সেগুলো জিজ্ঞেস করে process.env দিয়ে, আর যে যন্ত্রে চলছে সেই যন্ত্রের উত্তর পায়। এই কারণেই Database এর ঠিকানা বা Password কখনো Code এর ভেতরে লেখা থাকে না।"
    >
      <Arrow id="env-same-arrow" />
      {envs.map((env, i) => {
        const y = 22 + i * 98;
        return (
          <g key={env.title}>
            <Card
              x={14}
              y={y}
              w={330}
              h={78}
              title={env.title}
              lines={env.lines}
              mono
              lineSize={9}
              accent={i === 2}
            />
            <path
              d={`M344,${y + 39} C410,${y + 39} 420,160 488,160`}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={0.75}
              strokeWidth="1.3"
              markerEnd="url(#env-same-arrow)"
            />
          </g>
        );
      })}
      <SketchText x={414} y={60} size={9} body opacity={0.8}>
        চালু হওয়ার সময়
      </SketchText>
      <SketchText x={414} y={74} size={9} body opacity={0.8}>
        মান ঢোকে
      </SketchText>
      <rect
        x={494}
        y={112}
        width={272}
        height={96}
        fill="var(--primary)"
        fillOpacity={0.08}
        stroke="var(--primary)"
        strokeWidth="1.4"
      />
      <SketchText x={630} y={138} size={12} bold accent>
        server.mjs
      </SketchText>
      <SketchText x={630} y={160} size={9} body opacity={0.85}>
        একই Code, তিন জায়গাতেই
      </SketchText>
      <SketchText x={630} y={186} size={9.5}>
        process.env.DATABASE_URL
      </SketchText>
      <SketchText x={630} y={250} size={9} body opacity={0.75}>
        Code জিজ্ঞেস করে, যন্ত্র উত্তর দেয়।
      </SketchText>
      <SketchText x={630} y={266} size={9} body opacity={0.75}>
        মান বদলাতে Code বদলাতে হয় না।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Environment উত্তরাধিকার, Parent থেকে Child এ একটা কপি                     */
/* ------------------------------------------------------------------------- */

export function EnvInheritanceDiagram() {
  const boxes = [
    { x: 14, title: "sshd", sub: "Login এর পাহারাদার" },
    { x: 290, title: "bash", sub: "deploy এর Shell" },
    { x: 566, title: "node server.mjs", sub: "bash এর Child" },
  ];
  return (
    <Sketch
      label="Diagram: Environment হাতবদল হয় কপি হয়ে, একদিকে"
      height={330}
      minWidth={760}
      viewBox="0 0 800 330"
      caption="sshd আপনার Login এর জন্য একটা নতুন Environment বানিয়ে bash কে দেয়। bash এরপর যত Program চালায়, প্রত্যেকের হাতে নিজের Environment এর একটা কপি দেয়, কিন্তু শুধু export করা মানগুলোর। PORT এখানে শুধু bash এর Shell Variable, তাই node সেটা পায়নি। আর কপি একবারই হয়, চালু হওয়ার মুহূর্তে। node নিজের কপিতে যা ইচ্ছা বদলাক, bash এর কিছুই বদলায় না।"
    >
      <Arrow id="env-inherit-arrow" />
      <Arrow id="env-inherit-muted" muted />
      {boxes.map((b) => (
        <g key={b.title}>
          <rect
            x={b.x}
            y={20}
            width={220}
            height={52}
            fill="currentColor"
            fillOpacity={0.05}
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeWidth="1.3"
          />
          <SketchText x={b.x + 110} y={42} size={11.5} bold>
            {b.title}
          </SketchText>
          <SketchText x={b.x + 110} y={60} size={9} body opacity={0.75}>
            {b.sub}
          </SketchText>
        </g>
      ))}
      <line x1={234} y1={46} x2={286} y2={46} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#env-inherit-arrow)" />
      <SketchText x={260} y={36} size={8} body opacity={0.8}>
        বানিয়ে দেয়
      </SketchText>
      <line x1={510} y1={46} x2={562} y2={46} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#env-inherit-arrow)" />
      <SketchText x={536} y={36} size={8} body opacity={0.8}>
        কপি দেয়
      </SketchText>

      {/* sshd যা বানায় */}
      <Card
        x={14}
        y={90}
        w={220}
        h={112}
        title="নতুন Login Environment"
        lines={["USER=deploy", "HOME=/home/deploy", "SHELL=/bin/bash", "PATH=/usr/local/sbin:...", "SSH_CONNECTION=..."]}
        mono
        titleSize={9.5}
        lineSize={8.5}
      />

      {/* bash এর দুই রকম Variable */}
      <Card
        x={290}
        y={90}
        w={220}
        h={112}
        title="Environment (export করা)"
        lines={["USER=deploy", "HOME=/home/deploy", "PATH=/usr/local/sbin:...", "DATABASE_URL=postgresql://..."]}
        mono
        accent
        titleSize={9.5}
        lineSize={8.5}
      />
      <Card
        x={290}
        y={214}
        w={220}
        h={54}
        title="Shell Variable (শুধু নিজের)"
        lines={["PORT=3000"]}
        mono
        dashed
        titleSize={9.5}
        lineSize={8.5}
      />

      {/* node যা পেল */}
      <Card
        x={566}
        y={90}
        w={220}
        h={112}
        title="node এর নিজের কপি"
        lines={["USER=deploy", "HOME=/home/deploy", "PATH=/usr/local/sbin:...", "DATABASE_URL=postgresql://...", "PORT: নেই"]}
        mono
        titleSize={9.5}
        lineSize={8.5}
      />

      {/* উল্টো দিকে কিছু যায় না */}
      <path
        d="M676,210 L676,296 L400,296 L400,276"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeDasharray="4 3"
        strokeWidth="1.2"
        markerEnd="url(#env-inherit-muted)"
      />
      <line x1={530} y1={288} x2={546} y2={304} stroke="var(--primary)" strokeWidth="2" />
      <line x1={546} y1={288} x2={530} y2={304} stroke="var(--primary)" strokeWidth="2" />
      <SketchText x={618} y={318} size={9} body opacity={0.85}>
        Child এর বদল কখনো Parent এ ফেরে না
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. PATH: বাম থেকে ডানে খোঁজা, প্রথম যেটা পাওয়া যায় সেটাই চলে                 */
/* ------------------------------------------------------------------------- */

export function EnvPathLookupDiagram() {
  const folders = [
    { path: "/usr/local/sbin", state: "নেই" },
    { path: "/usr/local/bin", state: "নেই" },
    { path: "/usr/sbin", state: "নেই" },
    { path: "/usr/bin", state: "node আছে" },
    { path: "/sbin", state: "দেখাই হয়নি" },
    { path: "/bin", state: "দেখাই হয়নি" },
  ];
  return (
    <Sketch
      label="Diagram: node লিখলে Shell কোথায় খোঁজে"
      height={300}
      minWidth={760}
      viewBox="0 0 800 300"
      caption="PATH হলো Folder এর একটা তালিকা, কোলন দিয়ে আলাদা করা। node লিখলে bash তালিকার প্রথম Folder থেকে শুরু করে ডানে যায়, আর যেখানে প্রথম node নামের Execute করা যায় এমন File পায়, সেখানেই থামে। এর পরের Folder গুলো দেখাই হয় না। তাই একই নামের দুইটা Program থাকলে PATH এর ক্রমই ঠিক করে কোনটা চলবে। পুরো তালিকায় কোথাও না পেলে আসে command not found।"
    >
      <Arrow id="env-path-arrow" />
      <Arrow id="env-path-muted" muted />
      <rect x={14} y={14} width={300} height={40} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.5} />
      <SketchText x={26} y={39} size={11} anchor="start">
        deploy@island-vps-01:~$ node
      </SketchText>
      <SketchText x={330} y={30} size={9} anchor="start" opacity={0.8}>
        PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
      </SketchText>
      <SketchText x={330} y={46} size={8.5} anchor="start" body opacity={0.65}>
        (systemd Service এর চেয়ে লম্বা, Login Shell এ আরও কয়েকটা থাকে)
      </SketchText>
      <path d="M60,54 L60,96" stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#env-path-arrow)" />

      {folders.map((f, i) => {
        const x = 14 + i * 130;
        const found = f.state === "node আছে";
        const skipped = f.state === "দেখাই হয়নি";
        return (
          <g key={f.path} opacity={skipped ? 0.45 : 1}>
            <rect
              x={x}
              y={102}
              width={118}
              height={46}
              fill={found ? "var(--primary)" : "currentColor"}
              fillOpacity={found ? 0.12 : 0.04}
              stroke={found ? "var(--primary)" : "currentColor"}
              strokeOpacity={found ? 1 : 0.45}
              strokeDasharray={skipped ? "4 3" : undefined}
              strokeWidth="1.3"
            />
            <SketchText x={x + 59} y={130} size={9.5} bold={found} accent={found}>
              {f.path}
            </SketchText>
            <SketchText x={x + 59} y={170} size={9} body accent={found} opacity={found ? 1 : 0.8}>
              {f.state}
            </SketchText>
            <SketchText x={x + 59} y={186} size={8.5} opacity={0.6}>
              {`${i + 1}`}
            </SketchText>
            {i < folders.length - 1 && (
              <line
                x1={x + 118}
                y1={125}
                x2={x + 128}
                y2={125}
                stroke="currentColor"
                strokeOpacity={0.5}
                strokeWidth="1.2"
                markerEnd={skipped || found ? undefined : "url(#env-path-muted)"}
              />
            )}
          </g>
        );
      })}

      <path d="M463,192 L463,224" stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#env-path-arrow)" />
      <rect x={350} y={230} width={226} height={44} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={463} y={250} size={10.5} bold accent>
        চলবে /usr/bin/node
      </SketchText>
      <SketchText x={463} y={266} size={8.5} body opacity={0.8}>
        type -a node দিয়ে মিলিয়ে নিন
      </SketchText>

      <rect x={14} y={230} width={300} height={44} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="4 3" />
      <SketchText x={164} y={250} size={9} body opacity={0.85}>
        ছয়টার কোনোটাতেই না পেলে:
      </SketchText>
      <SketchText x={164} y={266} size={9}>
        bash: node: command not found
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Next.js: Build এ জমে যায়, Run এ পড়া হয়                                  */
/* ------------------------------------------------------------------------- */

function FlowBox({ x, y, w, title, sub, accent }: { x: number; y: number; w: number; title: string; sub?: string; accent?: boolean }) {
  const h = sub ? 44 : 32;
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
      />
      <SketchText x={x + w / 2} y={y + (sub ? 18 : 20)} size={9.5} bold accent={accent}>
        {title}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + 34} size={8.5} body opacity={0.8}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

export function EnvBuildVsRuntimeSplit() {
  return (
    <SketchSplit
      label="Diagram: NEXT_PUBLIC_ জমে যায় Build এ, বাকিগুলো পড়া হয় চালুর সময়"
      caption="বাম পাশে next build একবার চলে, আর NEXT_PUBLIC_ দিয়ে শুরু হওয়া প্রতিটা নামকে তার তখনকার মান দিয়ে সরাসরি JavaScript এর ভেতরে লিখে দেয়। সেই File যায় প্রতিটা Browser এ, তাই এখানে কোনো Secret রাখা মানে সেটা সবাইকে বিলিয়ে দেওয়া, আর পরে মান বদলালে নতুন Build ছাড়া কিছুই বদলায় না। ডান পাশে সাধারণ নামগুলো শুধু Server Process পড়ে, প্রতিবার চালু হওয়ার সময়, আর Browser পর্যন্ত কখনো যায় না।"
      panels={[
        {
          title: "Build এর সময়",
          sub: "next build, একবার",
          viewBox: "0 0 360 300",
          height: 300,
          children: (
            <g>
              <Arrow id="env-build-arrow" />
              <FlowBox x={40} y={10} w={280} title="NEXT_PUBLIC_SITE_URL" sub="Vercel বা .env থেকে, Build এর মুহূর্তে" />
              <line x1={180} y1={54} x2={180} y2={78} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#env-build-arrow)" />
              <FlowBox x={40} y={82} w={280} title="next build" sub="নামটা খুঁজে মানটা বসিয়ে দেয়" />
              <line x1={180} y1={126} x2={180} y2={150} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#env-build-arrow)" />
              <FlowBox x={40} y={154} w={280} title="JS Bundle এ লেখা হয়ে গেল" sub="'https://islandtours.example'" accent />
              <line x1={180} y1={198} x2={180} y2={222} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#env-build-arrow)" />
              <FlowBox x={40} y={226} w={280} title="প্রতিটা পর্যটকের Browser" sub="যে কেউ File খুলে পড়তে পারে" />
              <SketchText x={180} y={292} size={8.5} body opacity={0.75}>
                পরে মান বদলালে? নতুন Build না হওয়া পর্যন্ত কিছুই না।
              </SketchText>
            </g>
          ),
        },
        {
          title: "চালুর সময়",
          sub: "Server Process, প্রতিবার",
          viewBox: "0 0 360 300",
          height: 300,
          children: (
            <g>
              <Arrow id="env-run-arrow" />
              <Arrow id="env-run-muted" muted />
              <FlowBox x={40} y={10} w={280} title="DATABASE_URL, SESSION_SECRET" sub="Vercel বা api.env থেকে" />
              <line x1={180} y1={54} x2={180} y2={78} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#env-run-arrow)" />
              <FlowBox x={40} y={82} w={280} title="Server Process" sub="process.env থেকে পড়ে, চালুর সময়" accent />
              <line x1={180} y1={126} x2={180} y2={150} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#env-run-arrow)" />
              <FlowBox x={40} y={154} w={280} title="PostgreSQL" sub="মানটা কাজে লাগে এখানেই" />
              <line x1={180} y1={198} x2={180} y2={222} stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 3" strokeWidth="1.2" />
              <line x1={172} y1={204} x2={188} y2={216} stroke="var(--primary)" strokeWidth="2" />
              <line x1={188} y1={204} x2={172} y2={216} stroke="var(--primary)" strokeWidth="2" />
              <FlowBox x={40} y={226} w={280} title="Browser" sub="এই মানগুলো কখনো এখানে পৌঁছায় না" />
              <SketchText x={180} y={292} size={8.5} body opacity={0.75}>
                মান বদলালে? Restart বা Redeploy করলেই নতুন মান।
              </SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 5. একটা Secret যে আটটা পথে বেরিয়ে যায়                                      */
/* ------------------------------------------------------------------------- */

export function EnvSecretLeaksDiagram() {
  const leaks = [
    { x: 14, y: 16, title: "Git এর ইতিহাস", fix: "শুরু থেকেই .gitignore, ফাঁস হলে বদলান" },
    { x: 310, y: 16, title: "Shell History", fix: "read -s, বা শুরুতে একটা Space" },
    { x: 606, y: 16, title: "ps এর Argument", fix: "Argument এ নয়, Environment বা File এ" },
    { x: 14, y: 156, title: "Log আর Error পাতা", fix: "process.env কখনো Log করবেন না" },
    { x: 606, y: 156, title: "URL এর Query", fix: "Header বা Body তে পাঠান" },
    { x: 14, y: 296, title: "NEXT_PUBLIC_ Bundle", fix: "Secret কখনো NEXT_PUBLIC_ নয়" },
    { x: 310, y: 296, title: "সবাই পড়তে পারে এমন File", fix: "chmod 600, মালিক root" },
    { x: 606, y: 296, title: "Chat, Ticket, Screenshot", fix: "নাম পাঠান, মান কখনো নয়" },
  ];
  const cx = 400;
  const cy = 184;
  return (
    <Sketch
      label="Diagram: একটা Secret, আটটা ফাঁকফোকর"
      height={380}
      minWidth={760}
      viewBox="0 0 800 380"
      caption="মাঝখানে my-tours এর SESSION_SECRET। চারপাশের প্রতিটা বাক্স একটা আসল পথ, যেটা দিয়ে এরকম মান রোজ কোথাও না কোথাও বেরিয়ে যায়, আর বাক্সের নিচের লাইনটা সেই পথ বন্ধ করার উপায়। প্রথম তিনটা এই লেসনের Lab এ নিজের চোখে দেখবেন। মনে রাখবেন, একবার বেরিয়ে গেলে লুকানো যায় না, শুধু নতুন মান বানিয়ে পুরনোটা বাতিল করা যায়।"
    >
      {leaks.map((l) => {
        const bx = l.x + 90;
        const by = l.y + 34;
        return (
          <line
            key={`line-${l.title}`}
            x1={cx}
            y1={cy}
            x2={bx}
            y2={by}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeDasharray="4 3"
            strokeWidth="1.1"
          />
        );
      })}
      {leaks.map((l) => (
        <g key={l.title}>
          <rect x={l.x} y={l.y} width={180} height={68} fill="var(--card)" stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
          <rect x={l.x} y={l.y} width={180} height={68} fill="currentColor" fillOpacity={0.04} />
          <SketchText x={l.x + 90} y={l.y + 26} size={10} bold body>
            {l.title}
          </SketchText>
          <SketchText x={l.x + 90} y={l.y + 48} size={8.5} body accent>
            {l.fix}
          </SketchText>
        </g>
      ))}
      <rect x={cx - 92} y={cy - 30} width={184} height={60} fill="var(--card)" stroke="var(--primary)" strokeWidth="1.6" />
      <rect x={cx - 92} y={cy - 30} width={184} height={60} fill="var(--primary)" fillOpacity={0.12} />
      <SketchText x={cx} y={cy - 6} size={11.5} bold accent>
        SESSION_SECRET
      </SketchText>
      <SketchText x={cx} y={cy + 14} size={8.5} body opacity={0.85}>
        my-tours এর সবচেয়ে গোপন মান
      </SketchText>
    </Sketch>
  );
}
