/**
 * What: The still diagrams for Module 07 Lesson 01, Linux Filesystem Architecture. They show
 * what Linux is made of, the four ways to rent a server, how to read a shell prompt, the one
 * tree that starts at "/", drive letters against mounts, where an installed package puts its
 * pieces, and the releases folder with its "current" link.
 *
 * Why: A filesystem is a map, and a map is learned by looking at it, not by reading a list.
 * Each picture uses the real paths of the Island Tours server, so the reader recognises them
 * later on a real terminal. Every marker id starts with "fs-" so two diagrams on one page
 * never share an id.
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
  h = 34,
  text,
  sub,
  accent,
  size = 10,
  dashed,
  mono = true,
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
      <SketchText
        x={x + w / 2}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
        size={size}
        bold
        accent={accent}
        body={!mono}
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

/* ------------------------------------------------------------------------- */
/* 1. Linux আসলে কী দিয়ে তৈরি                                                   */
/* ------------------------------------------------------------------------- */

export function FsKernelDistroDiagram() {
  return (
    <Sketch
      label="Diagram: Kernel আর Distribution"
      height={340}
      viewBox="0 0 880 340"
      minWidth={720}
      caption={
        <>
          নিচ থেকে উপরে পড়ুন। Hardware কে সরাসরি ছোঁয় শুধু Kernel, বাকি সবাই Kernel এর কাছে চেয়ে
          নেয়। Kernel একা কোনো কাজের নয়, তার সাথে Shell, Tools, systemd আর apt জুড়ে যে পুরো
          প্যাকেজটা আপনি Install করেন, সেটাই একটা Distribution। Ubuntu সেরকম একটা।
        </>
      }
    >
      {/* Your apps */}
      <rect x={40} y={20} width={540} height={52} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.35} strokeWidth="1.2" strokeDasharray="4 3" />
      <SketchText x={58} y={40} size={9} anchor="start" opacity={0.65}>YOUR APPS</SketchText>
      <SketchText x={58} y={60} size={10.5} anchor="start" body>আপনার Program: Caddy, Node.js, PostgreSQL, Redis</SketchText>

      {/* Distribution band */}
      <rect x={40} y={86} width={540} height={96} fill="var(--primary)" fillOpacity={0.04} stroke="var(--primary)" strokeOpacity={0.5} strokeWidth="1.2" />
      <SketchText x={58} y={104} size={9} anchor="start" accent bold>UBUNTU এর বাকিটা</SketchText>
      <Box x={58} y={116} w={160} h={54} text="Shell আর Tools" sub="bash, ls, cp, grep" mono={false} />
      <Box x={230} y={116} w={160} h={54} text="systemd" sub="Service চালু রাখে, লেসন ০২" />
      <Box x={402} y={116} w={160} h={54} text="apt" sub="Program আনে আর বসায়" />

      {/* Kernel */}
      <Box x={40} y={196} w={540} h={58} text="Linux Kernel" sub="Process, Memory, File, Network আর Driver সামলায়" accent size={12} />

      {/* Hardware */}
      <rect x={40} y={268} width={540} height={52} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" />
      <SketchText x={58} y={288} size={9} anchor="start" opacity={0.65}>HARDWARE</SketchText>
      <SketchText x={58} y={308} size={10.5} anchor="start">CPU · RAM · Disk · Network Card</SketchText>

      {/* Bracket: distribution = kernel + rest */}
      <path d="M600,86 L612,86 L612,254 L600,254" fill="none" stroke="var(--primary)" strokeWidth="1.4" />
      <SketchText x={624} y={120} size={11} anchor="start" accent bold>Distribution</SketchText>
      <SketchText x={624} y={138} size={9.5} anchor="start" body opacity={0.85}>= Kernel + উপরের সবকিছু</SketchText>

      <SketchText x={624} y={176} size={10} anchor="start" bold>Ubuntu</SketchText>
      <SketchText x={690} y={176} size={9} anchor="start" body opacity={0.75}>VPS এ সবচেয়ে চেনা</SketchText>
      <SketchText x={624} y={198} size={10} anchor="start" bold>Debian</SketchText>
      <SketchText x={690} y={198} size={9} anchor="start" body opacity={0.75}>Ubuntu এর ভিত্তি</SketchText>
      <SketchText x={624} y={220} size={10} anchor="start" bold>Fedora</SketchText>
      <SketchText x={690} y={220} size={9} anchor="start" body opacity={0.75}>RHEL পরিবারের</SketchText>
      <SketchText x={624} y={242} size={10} anchor="start" bold>Alpine</SketchText>
      <SketchText x={690} y={242} size={9} anchor="start" body opacity={0.75}>খুব ছোট, Docker এ</SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Server ভাড়ার চার রকম                                                     */
/* ------------------------------------------------------------------------- */

function Machine({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <rect x={x} y={y} width={w} height={h} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" />
  );
}

export function FsHostingKindsDiagram() {
  const cols = [
    { x: 20, title: "Shared Hosting", you: "একটা Folder পান", root: "Root নেই", analogy: "হোস্টেলের এক বিছানা" },
    { x: 240, title: "VPS", you: "নিজের পুরো OS পান", root: "Root আছে", analogy: "বড় বাড়ির একটা ফ্ল্যাট" },
    { x: 460, title: "Dedicated", you: "পুরো যন্ত্রটাই আপনার", root: "Root আছে", analogy: "পুরো একটা বাড়ি" },
    { x: 680, title: "Cloud VM", you: "VPS, সাথে API", root: "Root আছে", analogy: "ঘণ্টা হিসেবে ভাড়ার ফ্ল্যাট" },
  ];
  return (
    <Sketch
      label="Diagram: Server ভাড়ার চার রকম"
      height={330}
      viewBox="0 0 900 330"
      minWidth={760}
      caption={
        <>
          প্রতিটা কলামে একটা আসল যন্ত্র। Shared Hosting এ সবাই একই OS ভাগ করে, আপনি শুধু একটা
          Folder পান। VPS এ যন্ত্রটার উপর Hypervisor নামের একটা স্তর অনেকগুলো আলাদা Virtual Machine
          বানায়, তার একটা আপনার, ভেতরে নিজের Ubuntu আর নিজের Root। Island Tours এই দ্বিতীয়
          কলামে।
        </>
      }
    >
      {cols.map((c, i) => (
        <SketchText key={c.title} x={c.x + 100} y={22} size={11} bold accent={i === 1}>
          {c.title}
        </SketchText>
      ))}

      {/* Shared hosting: one OS, many folders */}
      <Machine x={20} y={36} w={200} h={180} />
      <rect x={30} y={168} width={180} height={38} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.4} />
      <SketchText x={120} y={191} size={9.5} body>একটাই OS, সবার</SketchText>
      {[0, 1, 2, 3].map(r => (
        <g key={r}>
          <rect x={30 + (r % 2) * 92} y={48 + Math.floor(r / 2) * 56} width={86} height={46} fill={r === 0 ? "var(--primary)" : "currentColor"} fillOpacity={r === 0 ? 0.12 : 0.04} stroke={r === 0 ? "var(--primary)" : "currentColor"} strokeOpacity={r === 0 ? 1 : 0.4} />
          <SketchText x={73 + (r % 2) * 92} y={75 + Math.floor(r / 2) * 56} size={9} accent={r === 0} body>
            {r === 0 ? "আপনার Folder" : `অন্য সাইট ${r}`}
          </SketchText>
        </g>
      ))}

      {/* VPS: hypervisor and three VMs */}
      <Machine x={240} y={36} w={200} h={180} />
      <rect x={250} y={168} width={180} height={38} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.4} />
      <SketchText x={340} y={191} size={9.5}>Hypervisor</SketchText>
      {[0, 1, 2].map(v => (
        <g key={v}>
          <rect x={250 + v * 61} y={48} width={56} height={110} fill={v === 0 ? "var(--primary)" : "currentColor"} fillOpacity={v === 0 ? 0.12 : 0.04} stroke={v === 0 ? "var(--primary)" : "currentColor"} strokeOpacity={v === 0 ? 1 : 0.4} />
          <SketchText x={278 + v * 61} y={72} size={8.5} accent={v === 0} bold>VM</SketchText>
          <SketchText x={278 + v * 61} y={100} size={8} opacity={0.8}>{v === 0 ? "Ubuntu" : v === 1 ? "Debian" : "Ubuntu"}</SketchText>
          <SketchText x={278 + v * 61} y={130} size={8.5} body accent={v === 0} opacity={v === 0 ? 1 : 0.7}>{v === 0 ? "আপনার" : "অন্যের"}</SketchText>
        </g>
      ))}

      {/* Dedicated: the whole machine */}
      <Machine x={460} y={36} w={200} h={180} />
      <rect x={470} y={48} width={180} height={158} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" />
      <SketchText x={560} y={110} size={10} accent bold body>আপনার Ubuntu</SketchText>
      <SketchText x={560} y={130} size={9} body opacity={0.8}>পুরো CPU, RAM, Disk</SketchText>

      {/* Cloud VM: like VPS, plus an API */}
      <Machine x={680} y={36} w={200} h={180} />
      <rect x={690} y={168} width={180} height={38} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.4} />
      <SketchText x={780} y={191} size={9.5}>Hypervisor</SketchText>
      <rect x={690} y={48} width={84} height={110} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" />
      <SketchText x={732} y={100} size={9} accent bold body>আপনার VM</SketchText>
      <rect x={786} y={48} width={84} height={110} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="4 3" />
      <SketchText x={828} y={92} size={8.5} body opacity={0.8}>API দিয়ে</SketchText>
      <SketchText x={828} y={108} size={8.5} body opacity={0.8}>এক মিনিটে</SketchText>
      <SketchText x={828} y={124} size={8.5} body opacity={0.8}>আরেকটা</SketchText>

      {cols.map(c => (
        <g key={`${c.title}-rows`}>
          <SketchText x={c.x + 100} y={242} size={9.5} body>{c.you}</SketchText>
          <SketchText x={c.x + 100} y={262} size={9.5} body opacity={0.8}>{c.root}</SketchText>
          <SketchText x={c.x + 100} y={290} size={9.5} body accent>{c.analogy}</SketchText>
        </g>
      ))}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Prompt টা পড়তে শেখা                                                       */
/* ------------------------------------------------------------------------- */

export function FsPromptDiagram() {
  const charW = 14.4; // JetBrains Mono at 24px is 0.6em wide per glyph
  const parts = [
    { text: "deploy", label: "কে আপনি", sub: "User এর নাম" },
    { text: "@", label: "", sub: "" },
    { text: "island-vps-01", label: "কোন যন্ত্রে", sub: "Hostname" },
    { text: ":", label: "", sub: "" },
    { text: "/etc/caddy", label: "এখন কোথায়", sub: "Current Directory" },
    { text: "$", label: "কী অধিকারে", sub: "$ সাধারণ User, # মানে root" },
  ];
  let cursor = 60;
  const placed = parts.map(p => {
    const w = p.text.length * charW + 12;
    const item = { ...p, x: cursor, w };
    cursor += w + 4;
    return item;
  });
  return (
    <Sketch
      label="Diagram: একটা Prompt এর চার অংশ"
      height={210}
      viewBox="0 0 780 210"
      minWidth={680}
      caption={
        <>
          প্রতিটা Command লেখার আগে Terminal এই লাইনটা দেখায়, আর এতে চারটা প্রশ্নের উত্তর থাকে:
          আপনি কে, কোন যন্ত্রে, কোন Folder এ, আর কোন অধিকারে। ভুল Server এ ভুল Command চালানোর
          আগে এই লাইনটা একবার পড়ে নেওয়ার অভ্যাসই আপনাকে বড় দুর্ঘটনা থেকে বাঁচাবে।
        </>
      }
    >
      {placed.map((p, i) => (
        <g key={i}>
          {p.label && (
            <rect x={p.x} y={52} width={p.w} height={40} fill={i === 4 ? "var(--primary)" : "currentColor"} fillOpacity={i === 4 ? 0.12 : 0.05} stroke={i === 4 ? "var(--primary)" : "currentColor"} strokeOpacity={i === 4 ? 1 : 0.4} />
          )}
          <SketchText x={p.x + p.w / 2} y={80} size={24} bold accent={i === 4}>
            {p.text}
          </SketchText>
          {p.label && (
            <g>
              <line x1={p.x + p.w / 2} y1={94} x2={p.x + p.w / 2} y2={124} stroke="currentColor" strokeOpacity={0.4} />
              <SketchText x={p.x + p.w / 2} y={142} size={10.5} body bold accent={i === 4}>
                {p.label}
              </SketchText>
              <SketchText x={p.x + p.w / 2} y={160} size={9} opacity={0.75} body>
                {p.sub}
              </SketchText>
            </g>
          )}
        </g>
      ))}
      <SketchText x={60} y={32} size={9} anchor="start" opacity={0.6}>
        deploy@island-vps-01:/etc/caddy$ cat Caddyfile
      </SketchText>
      <SketchText x={60} y={192} size={9} anchor="start" body opacity={0.7}>
        Home Folder এ থাকলে Path এর জায়গায় শুধু ~ দেখায়: deploy@island-vps-01:~$
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. একটাই গাছ, "/" থেকে শুরু                                                    */
/* ------------------------------------------------------------------------- */

type TreeRow = { dir: string; child: string; leaf: string; note: string; accent?: boolean };

const TREE_GROUPS: { top: string; rows: TreeRow[] }[] = [
  {
    top: "etc",
    rows: [
      { dir: "etc", child: "caddy/", leaf: "Caddyfile", note: "Caddy এর Setting", accent: true },
      { dir: "etc", child: "islandtours/", leaf: "api.env", note: "App এর Secret, লেসন ০৫", accent: true },
      { dir: "etc", child: "ssh/", leaf: "sshd_config", note: "SSH এর Setting, লেসন ০৩" },
    ],
  },
  {
    top: "srv",
    rows: [{ dir: "srv", child: "islandtours/", leaf: "current → releases/...", note: "চালু Code এর ঠিকানা", accent: true }],
  },
  {
    top: "var",
    rows: [
      { dir: "var", child: "log/caddy/", leaf: "access.log", note: "কে কী চাইল, লেসন ০৭", accent: true },
      { dir: "var", child: "backups/islandtours/", leaf: "*.sql.gz", note: "রাতের Backup, লেসন ১০" },
      { dir: "var", child: "lib/caddy/", leaf: "Certificate", note: "Caddy এর নিজের Data" },
    ],
  },
  {
    top: "home",
    rows: [{ dir: "home", child: "deploy/", leaf: ".ssh/authorized_keys", note: "কোন Key দিয়ে ঢোকা যায়" }],
  },
  {
    top: "usr",
    rows: [
      { dir: "usr", child: "bin/", leaf: "caddy, ls, node", note: "Program গুলো নিজে" },
      { dir: "usr", child: "lib/systemd/system/", leaf: "caddy.service", note: "কে চালু করবে, লেসন ০২" },
    ],
  },
  {
    top: "tmp",
    rows: [{ dir: "tmp", child: "", leaf: "", note: "অস্থায়ী, Restart এ মুছতে পারে" }],
  },
  {
    top: "proc",
    rows: [{ dir: "proc", child: "", leaf: "", note: "Kernel এর জানালা, Disk এ নেই" }],
  },
];

// Each group's first row, worked out once: the tree is fixed, so nothing here depends on render.
const TREE_STARTS = TREE_GROUPS.reduce<number[]>(
  (starts, g, i) => [...starts, i === 0 ? 0 : starts[i - 1] + TREE_GROUPS[i - 1].rows.length],
  [],
);
const TREE_ROWS = TREE_GROUPS.reduce((sum, g) => sum + g.rows.length, 0);

export function FsTreeDiagram() {
  const rowH = 29;
  const top = 34;
  const groups = TREE_GROUPS.map((g, i) => ({ ...g, start: TREE_STARTS[i] }));
  const total = TREE_ROWS;
  const rootY = top + ((total - 1) * rowH) / 2;
  return (
    <Sketch
      label="Diagram: island-vps-01 এর গাছ"
      height={top + total * rowH + 30}
      viewBox={`0 0 900 ${top + total * rowH + 30}`}
      minWidth={760}
      caption={
        <>
          পুরো Server একটাই গাছ, আর সব ডাল শুরু হয়েছে একটা দাগ থেকে: <code>/</code>। রঙ করা চারটা
          জিনিস প্রথম দিনেই আপনার কাজে লাগবে: Caddy এর Setting, App এর Secret, চালু Code আর Log। এই
          ছবিটা মাথায় থাকলে কেউ জিজ্ঞেস করলে আপনি না ভেবেই বলতে পারবেন কোনটা কোথায়।
        </>
      }
    >
      <SketchText x={40} y={rootY + 6} size={22} bold accent>/</SketchText>
      <SketchText x={110} y={18} size={8.5} anchor="start" body opacity={0.6}>প্রথম স্তর</SketchText>
      <SketchText x={220} y={18} size={8.5} anchor="start" body opacity={0.6}>ভেতরে</SketchText>
      <SketchText x={450} y={18} size={8.5} anchor="start" opacity={0.6}>File</SketchText>
      <SketchText x={680} y={18} size={8.5} anchor="start" body opacity={0.6}>কী আছে</SketchText>

      {groups.map(g => {
        const gy = top + g.start * rowH;
        const gMid = gy + ((g.rows.length - 1) * rowH) / 2;
        return (
          <g key={g.top}>
            <path d={`M56,${rootY} C80,${rootY} 80,${gMid} 104,${gMid}`} fill="none" stroke="currentColor" strokeOpacity={0.35} />
            <SketchText x={110} y={gMid + 4} size={11} anchor="start" bold>
              {`${g.top}/`}
            </SketchText>
            {g.rows.map((r, i) => {
              const y = gy + i * rowH;
              return (
                <g key={`${g.top}-${i}`}>
                  {r.child && (
                    <>
                      <line x1={160} y1={gMid} x2={214} y2={y} stroke="currentColor" strokeOpacity={0.25} />
                      <SketchText x={220} y={y + 4} size={10} anchor="start" accent={r.accent}>
                        {r.child}
                      </SketchText>
                    </>
                  )}
                  {r.leaf && (
                    <SketchText x={450} y={y + 4} size={10} anchor="start" bold={r.accent} accent={r.accent}>
                      {r.leaf}
                    </SketchText>
                  )}
                  <SketchText x={680} y={y + 4} size={9.5} anchor="start" body opacity={r.accent ? 1 : 0.75}>
                    {r.note}
                  </SketchText>
                </g>
              );
            })}
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. Drive Letter বনাম একটাই গাছ                                               */
/* ------------------------------------------------------------------------- */

export function FsDrivesVsTreeSplit() {
  return (
    <SketchSplit
      label="Diagram: Windows এর Drive বনাম Linux এর Mount"
      caption={
        <>
          Windows এ প্রতিটা Disk নিজের আলাদা গাছ, নাম C:, D:, E:। Linux এ গাছ একটাই। নতুন একটা Disk
          লাগালে সেটা গাছের কোনো একটা Folder এ জুড়ে দেওয়া হয়, এই জুড়ে দেওয়ার নাম Mount। তারপর
          সেই Folder এ ঢুকলেই আপনি আসলে অন্য Disk এ আছেন, যদিও Path দেখে বোঝার উপায় নেই।
        </>
      }
      panels={[
        {
          title: "Windows",
          sub: "প্রতি Disk এ আলাদা গাছ",
          viewBox: "0 0 380 230",
          height: 230,
          minWidth: 320,
          children: (
            <g>
              {["C:\\", "D:\\", "E:\\"].map((d, i) => (
                <g key={d}>
                  <rect x={20 + i * 120} y={30} width={100} height={44} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.5} />
                  <SketchText x={70 + i * 120} y={57} size={14} bold>{d}</SketchText>
                  <SketchText x={70 + i * 120} y={96} size={9} body opacity={0.75}>
                    {i === 0 ? "System Disk" : i === 1 ? "দ্বিতীয় Disk" : "Pen Drive"}
                  </SketchText>
                  <line x1={70 + i * 120} y1={104} x2={70 + i * 120} y2={124} stroke="currentColor" strokeOpacity={0.35} />
                  <SketchText x={70 + i * 120} y={142} size={9}>{i === 0 ? "Windows\\" : i === 1 ? "Photos\\" : "Backup\\"}</SketchText>
                  <SketchText x={70 + i * 120} y={162} size={9}>{i === 0 ? "Users\\" : i === 1 ? "Movies\\" : ""}</SketchText>
                </g>
              ))}
              <SketchText x={190} y={206} size={9.5} body opacity={0.8}>তিনটা আলাদা শুরু, তিনটা আলাদা গাছ</SketchText>
            </g>
          ),
        },
        {
          title: "Linux",
          sub: "একটাই গাছ, Disk জুড়ে যায় Folder এ",
          viewBox: "0 0 380 230",
          height: 230,
          minWidth: 320,
          children: (
            <g>
              <Arrow id="fs-mount-arrow" muted />
              <SketchText x={60} y={40} size={18} bold accent>/</SketchText>
              {["home/", "etc/", "mnt/data/", "media/usb/"].map((d, i) => (
                <g key={d}>
                  <path d={`M70,36 C90,36 90,${70 + i * 34} 110,${70 + i * 34}`} fill="none" stroke="currentColor" strokeOpacity={0.35} />
                  <SketchText x={116} y={74 + i * 34} size={10.5} anchor="start" bold={i > 1} accent={i > 1}>{d}</SketchText>
                </g>
              ))}
              <rect x={268} y={124} width={96} height={30} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" />
              <SketchText x={316} y={143} size={9} body accent>দ্বিতীয় Disk</SketchText>
              <line x1={266} y1={139} x2={200} y2={139} stroke="currentColor" strokeOpacity={0.5} strokeDasharray="4 3" markerEnd="url(#fs-mount-arrow)" />
              <rect x={268} y={160} width={96} height={30} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" />
              <SketchText x={316} y={179} size={9} body accent>Pen Drive</SketchText>
              <line x1={266} y1={175} x2={214} y2={175} stroke="currentColor" strokeOpacity={0.5} strokeDasharray="4 3" markerEnd="url(#fs-mount-arrow)" />
              <SketchText x={316} y={110} size={8.5} body opacity={0.7}>Mount করা হয়েছে</SketchText>
              <SketchText x={190} y={216} size={9.5} body opacity={0.8}>শুরু একটাই: /</SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 6. apt install এর পর জিনিসগুলো কোথায় গেল                                      */
/* ------------------------------------------------------------------------- */

export function FsPackagePiecesDiagram() {
  const pieces = [
    { path: "/usr/bin/caddy", what: "Program নিজে", who: "Package এর, হাত দেবেন না" },
    { path: "/etc/caddy/Caddyfile", what: "Setting", who: "আপনি বদলাবেন", accent: true },
    { path: "/usr/lib/systemd/system/caddy.service", what: "কে, কীভাবে চালু করবে", who: "লেসন ০২" },
    { path: "/var/lib/caddy/", what: "Program এর নিজের Data", who: "Certificate এখানে" },
    { path: "/var/log/caddy/", what: "Log", who: "লেসন ০৭" },
    { path: "/usr/share/doc/caddy/", what: "নথি আর man পাতা", who: "পড়ার জন্য" },
  ];
  const rowH = 44;
  return (
    <Sketch
      label="Diagram: একটা Package এর টুকরোগুলো কোথায় যায়"
      height={310}
      viewBox="0 0 900 310"
      minWidth={760}
      caption={
        <>
          একটা Program মানে একটা File নয়। <code>apt install caddy</code> চালালে প্যাকেটটা খুলে ছয়
          রকম জিনিস ছয় জায়গায় বসে, আর প্রতিটা জায়গা বেছে নেওয়া হয়েছে কাজ দেখে। এই নিয়মটা প্রায় সব
          Package মানে, তাই একবার শিখলে নতুন যেকোনো Program এর Setting কোথায় খুঁজবেন তা আন্দাজ
          করতে পারবেন। পুরো তালিকা দেখায় <code>dpkg -L caddy</code>।
        </>
      }
    >
      <Arrow id="fs-pkg-arrow" />
      <Box x={20} y={118} w={170} h={50} text="sudo apt install caddy" size={10} />
      <line x1={190} y1={143} x2={236} y2={143} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#fs-pkg-arrow)" />
      <Box x={240} y={118} w={130} h={50} text="caddy .deb" sub="একটা মোড়ানো প্যাকেট" accent />
      {pieces.map((p, i) => {
        const y = 20 + i * rowH;
        return (
          <g key={p.path}>
            <path d={`M370,143 C410,143 410,${y + 17} 446,${y + 17}`} fill="none" stroke={p.accent ? "var(--primary)" : "currentColor"} strokeOpacity={p.accent ? 1 : 0.4} strokeWidth="1.2" markerEnd={p.accent ? "url(#fs-pkg-arrow)" : undefined} />
            <rect x={450} y={y} width={270} height={34} fill={p.accent ? "var(--primary)" : "currentColor"} fillOpacity={p.accent ? 0.1 : 0.04} stroke={p.accent ? "var(--primary)" : "currentColor"} strokeOpacity={p.accent ? 1 : 0.4} />
            <SketchText x={460} y={y + 21} size={9.5} anchor="start" bold accent={p.accent}>{p.path}</SketchText>
            <SketchText x={732} y={y + 14} size={9.5} anchor="start" body>{p.what}</SketchText>
            <SketchText x={732} y={y + 29} size={8.5} anchor="start" body opacity={0.7}>{p.who}</SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 7. releases আর current                                                     */
/* ------------------------------------------------------------------------- */

export function FsReleasesDiagram() {
  const releases = [
    { name: "2026-10-29_1830", note: "আগের Deploy" },
    { name: "2026-10-31_0915", note: "এখন চলছে", live: true },
    { name: "2026-11-02_1400", note: "পরের Deploy", next: true },
  ];
  return (
    <Sketch
      label="Diagram: /srv/islandtours, releases আর current"
      height={250}
      viewBox="0 0 860 250"
      minWidth={720}
      caption={
        <>
          প্রতিটা Deploy নিজের তারিখের Folder এ যায়, পুরনোটা মোছা হয় না। <code>current</code> কোনো
          Folder নয়, একটা Symbolic Link, মানে একটা তীর যা একটা Release কে দেখায়। নতুন Deploy মানে তীরটা
          ঘুরিয়ে নতুন Folder এ বসানো, আর কিছু ভাঙলে Rollback মানে তীরটা আগের Folder এ ফিরিয়ে আনা,
          কয়েক সেকেন্ডের কাজ।
        </>
      }
    >
      <Arrow id="fs-rel-arrow" />
      <Arrow id="fs-rel-arrow-muted" muted />
      <SketchText x={30} y={34} size={11} anchor="start" bold>/srv/islandtours/releases/</SketchText>
      {releases.map((r, i) => (
        <g key={r.name}>
          <Box x={30 + i * 270} y={56} w={240} h={52} text={r.name} sub={r.note} accent={r.live} dashed={r.next} />
        </g>
      ))}
      <Box x={300} y={176} w={240} h={46} text="current" sub="Symbolic Link, একটা তীর" />
      <line x1={420} y1={176} x2={420} y2={114} stroke="var(--primary)" strokeWidth="1.6" markerEnd="url(#fs-rel-arrow)" />
      <path d="M540,199 C640,199 690,160 690,114" fill="none" stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 3" markerEnd="url(#fs-rel-arrow-muted)" />
      <SketchText x={700} y={170} size={9} anchor="start" body opacity={0.8}>Deploy: তীর এদিকে</SketchText>
      <path d="M300,199 C200,199 150,160 150,114" fill="none" stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 3" markerEnd="url(#fs-rel-arrow-muted)" />
      <SketchText x={30} y={170} size={9} anchor="start" body opacity={0.8}>Rollback: তীর এদিকে</SketchText>
    </Sketch>
  );
}
