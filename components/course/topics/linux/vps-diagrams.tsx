/**
 * What: The still diagrams for Module 07 Lesson 11, VPS Setup, End to End. They show the
 * finished server and what guards each door, who looks after which layer on each kind of
 * hosting, the two-session habit that prevents a lockout, why the name of an sshd drop-in
 * file decides which setting wins, the final check run from outside, and the whole module
 * as one server.
 *
 * Why: This lesson stitches ten earlier lessons into one build, and a reader can only keep
 * that many moving parts in mind with a map in front of them. Every marker id starts with
 * "vps-" so these diagrams never collide with another drawing on the same page.
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

function Cross({ x, y }: { x: number; y: number }) {
  return (
    <g stroke="var(--primary)" strokeWidth="2">
      <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} />
      <line x1={x - 6} y1={y + 6} x2={x + 6} y2={y - 6} />
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. শেষে যে Server টা দাঁড়াবে                                                 */
/* ------------------------------------------------------------------------- */

export function ServerMapDiagram() {
  return (
    <Sketch
      label="Diagram: শেষে আপনার Server দেখতে এমন হবে"
      height={440}
      minWidth={860}
      viewBox="0 0 900 440"
      caption={
        <>
          বাঁ দিকে বাইরের দুনিয়া, ডান দিকে আপনার Server। মাঝখানে দুইটা দেয়াল: Provider এর
          Cloud Firewall আর Server এর নিজের ufw। আপনার Laptop ঢোকে শুধু Port 22 দিয়ে, শুধু
          Key নিয়ে। পর্যটকের Browser ঢোকে 80 আর 443 দিয়ে, আর Caddy তাকে ভেতরের App এর কাছে
          নিয়ে যায়। App নিজে বাইরের কারো সাথে কথা বলে না, সে শুধু 127.0.0.1 এ শোনে। বাকি সব
          টোকা দেয়ালেই আটকে যায়। প্রতিটা বাক্সের নিচে লেখা আছে কোন লেসন সেটা শিখিয়েছে।
        </>
      }
    >
      <Arrow id="vps-map-arrow" />
      <Arrow id="vps-map-arrow-muted" muted />

      {/* বাইরের দুনিয়া */}
      <SketchText x={95} y={30} size={9} bold opacity={0.7}>
        বাইরের দুনিয়া
      </SketchText>
      <Box x={20} y={55} w={150} h={46} text="আপনার Laptop" sub="ssh deploy@..." />
      <Box x={20} y={175} w={150} h={46} text="পর্যটকের Browser" sub="https://api.my-tours.example" size={9.5} />
      <Box x={20} y={300} w={150} h={46} text="Bot আর Scanner" sub="সব Port এ টোকা দেয়" dashed />

      {/* Provider firewall */}
      <rect x={205} y={40} width={26} height={360} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="4 3" />
      <SketchText x={218} y={420} size={8.5} body opacity={0.8}>
        Provider Firewall
      </SketchText>

      {/* ufw */}
      <rect x={250} y={40} width={58} height={360} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={279} y={60} size={10} bold accent>
        ufw
      </SketchText>
      <SketchText x={279} y={112} size={8.5}>22 allow</SketchText>
      <SketchText x={279} y={128} size={8.5}>80 allow</SketchText>
      <SketchText x={279} y={144} size={8.5}>443 allow</SketchText>
      <SketchText x={279} y={166} size={8.5} accent>বাকি সব</SketchText>
      <SketchText x={279} y={180} size={8.5} accent>deny</SketchText>
      <SketchText x={279} y={420} size={8.5} body opacity={0.8}>
        লেসন ০৬
      </SketchText>

      {/* server */}
      <rect x={330} y={20} width={555} height={410} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.4" />
      <SketchText x={345} y={40} size={10} bold anchor="start">
        mytours-vps-01
      </SketchText>
      <SketchText x={870} y={40} size={8.5} anchor="end" opacity={0.7}>
        Ubuntu 24.04 LTS · 198.51.100.42
      </SketchText>

      <Box x={350} y={60} w={170} h={46} text="sshd :22" sub="শুধু Key, root ঢুকতে পারে না" accent />
      <SketchText x={435} y={122} size={8.5} body opacity={0.75}>
        লেসন ০৩ · ০৪
      </SketchText>

      <Box x={350} y={175} w={170} h={46} text="Caddy :80 :443" sub="TLS খোলে, Certificate রাখে" accent />
      <SketchText x={435} y={237} size={8.5} body opacity={0.75}>
        Module 06 আর এই লেসন
      </SketchText>

      <Box x={600} y={175} w={265} h={46} text="my-tours-api" sub="127.0.0.1:3000 · user mytours · systemd" accent />
      <SketchText x={732} y={237} size={8.5} body opacity={0.75}>
        লেসন ০২ · ০৪ · ০৫
      </SketchText>

      {/* files row */}
      <Box x={350} y={275} w={120} h={42} text="/srv/my-tours" sub="Code, owner deploy" size={9} />
      <Box x={480} y={275} w={140} h={42} text="/etc/my-tours/api.env" sub="640 root:mytours" size={9} />
      <Box x={630} y={275} w={110} h={42} text="journald" sub="সব Log এখানে" size={9} />
      <Box x={750} y={275} w={115} h={42} text="/var/backups" sub="রাতের Backup" size={9} />
      <SketchText x={607} y={333} size={8.5} body opacity={0.75}>
        লেসন ০১ · ০৪ · ০৫ · ০৭
      </SketchText>

      <Box x={350} y={355} w={250} h={40} text="my-tours-backup.timer" sub="প্রতি রাতে 21:30 UTC, ঢাকায় 03:30" size={9} />
      <Box x={615} y={355} w={250} h={40} text="unattended-upgrades" sub="Security Patch নিজে বসে" size={9} />
      <SketchText x={607} y={414} size={8.5} body opacity={0.75}>
        লেসন ০৮ · ১০ আর এই লেসন
      </SketchText>

      {/* arrows */}
      <line x1={170} y1={78} x2={346} y2={83} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#vps-map-arrow)" />
      <line x1={170} y1={198} x2={346} y2={198} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#vps-map-arrow)" />
      <line x1={520} y1={198} x2={596} y2={198} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#vps-map-arrow)" />
      <line x1={170} y1={323} x2={246} y2={323} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" strokeDasharray="4 3" markerEnd="url(#vps-map-arrow-muted)" />
      <Cross x={262} y={323} />
      <line x1={685} y1={221} x2={685} y2={271} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" markerEnd="url(#vps-map-arrow-muted)" />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন Hosting এ কে কোন তলা দেখে                                             */
/* ------------------------------------------------------------------------- */

const LAYERS = ["আপনার App", "Runtime (Node)", "OS আর Patch", "Hardware"] as const;

const HOSTING = [
  { name: "Shared Hosting", sub: "এক Server, অনেক গ্রাহক", yours: [true, false, false, false] },
  { name: "PaaS", sub: "Vercel, Render ধরনের", yours: [true, false, false, false] },
  { name: "VPS", sub: "একটা যন্ত্রের একটা ভাগ", yours: [true, true, true, false] },
  { name: "Dedicated", sub: "পুরো যন্ত্রটা আপনার", yours: [true, true, true, false] },
] as const;

export function HostingSpectrumDiagram() {
  return (
    <Sketch
      label="Diagram: কোন Hosting এ কোন তলার দায়িত্ব আপনার"
      height={330}
      minWidth={760}
      viewBox="0 0 820 330"
      caption={
        <>
          প্রতিটা স্তম্ভ চার তলার একটা বাড়ি। রঙ করা তলা আপনার দায়িত্ব, ফ্যাকাশে তলা Provider
          এর। বাঁ থেকে ডানে গেলে নিয়ন্ত্রণ বাড়ে, সাথে দায়িত্বও। VPS আর Dedicated এ OS এর
          Security Patch থেকে App পর্যন্ত সব আপনার হাতে, পার্থক্য শুধু যন্ত্রটা ভাগের না পুরো।
          এই লেসন VPS এর স্তম্ভটা নিয়ে, যেখানে তিনটা তলা আপনাকেই সামলাতে হবে।
        </>
      }
    >
      <Arrow id="vps-spectrum-arrow" />
      {HOSTING.map((h, col) => {
        const x = 40 + col * 195;
        return (
          <g key={h.name}>
            <SketchText x={x + 75} y={30} size={11} bold accent={h.name === "VPS"}>
              {h.name}
            </SketchText>
            <SketchText x={x + 75} y={48} size={8.5} body opacity={0.75}>
              {h.sub}
            </SketchText>
            {LAYERS.map((layer, row) => {
              const mine = h.yours[row];
              return (
                <g key={layer}>
                  <rect
                    x={x}
                    y={65 + row * 46}
                    width={150}
                    height={38}
                    fill={mine ? "var(--primary)" : "currentColor"}
                    fillOpacity={mine ? 0.16 : 0.04}
                    stroke={mine ? "var(--primary)" : "currentColor"}
                    strokeOpacity={mine ? 1 : 0.35}
                    strokeWidth="1.2"
                  />
                  <SketchText x={x + 75} y={88 + row * 46} size={9} body accent={mine} opacity={mine ? 1 : 0.65}>
                    {layer}
                  </SketchText>
                </g>
              );
            })}
          </g>
        );
      })}
      <line x1={40} y1={268} x2={770} y2={268} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#vps-spectrum-arrow)" />
      <SketchText x={405} y={292} size={9.5} body>
        ডানে গেলে নিয়ন্ত্রণ বাড়ে, দায়িত্বও বাড়ে
      </SketchText>
      <rect x={250} y={306} width={14} height={12} fill="var(--primary)" fillOpacity={0.16} stroke="var(--primary)" />
      <SketchText x={270} y={316} size={8.5} body anchor="start">
        আপনার দায়িত্ব
      </SketchText>
      <rect x={420} y={306} width={14} height={12} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.35} />
      <SketchText x={440} y={316} size={8.5} body anchor="start" opacity={0.75}>
        Provider এর দায়িত্ব
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. দুইটা Session এর অভ্যাস                                                   */
/* ------------------------------------------------------------------------- */

export function TwoSessionsDiagram() {
  return (
    <Sketch
      label="Diagram: প্রথম Session খোলা রেখে দ্বিতীয়টায় পরীক্ষা"
      height={300}
      minWidth={760}
      viewBox="0 0 820 300"
      caption={
        <>
          SSH বা Firewall এর যেকোনো বদল একটা খোলা Session থেকে করুন, আর সেটা বন্ধ না করে আরেকটা
          Terminal এ নতুন করে Login করে দেখুন। নতুন Login সফল হলে তবেই পুরনোটা বন্ধ করুন।
          ব্যর্থ হলে পুরনো Session টা এখনো আপনার হাতে, সেখান থেকেই ভুলটা ঠিক করুন। এই একটা
          অভ্যাস Web Console এ ছোটাছুটি থেকে বাঁচায়।
        </>
      }
    >
      <Arrow id="vps-two-arrow" />
      <Arrow id="vps-two-arrow-muted" muted />

      {/* session 1 */}
      <rect x={20} y={30} width={240} height={160} fill="currentColor" fillOpacity={0.04} stroke="var(--primary)" strokeWidth="1.4" />
      <SketchText x={140} y={52} size={10} bold accent>
        Session ১, খোলা থাকে
      </SketchText>
      <SketchText x={35} y={82} size={9} anchor="start">deploy@mytours-vps-01:~$</SketchText>
      <SketchText x={35} y={102} size={9} anchor="start">sudo nano 00-hardening.conf</SketchText>
      <SketchText x={35} y={122} size={9} anchor="start">sudo sshd -t</SketchText>
      <SketchText x={35} y={142} size={9} anchor="start">sudo systemctl reload ssh</SketchText>
      <SketchText x={140} y={176} size={8.5} body opacity={0.75}>
        এটা বন্ধ করবেন না
      </SketchText>

      {/* session 2 */}
      <rect x={330} y={30} width={240} height={160} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" />
      <SketchText x={450} y={52} size={10} bold>
        Session ২, নতুন Login
      </SketchText>
      <SketchText x={345} y={82} size={9} anchor="start">you@laptop:~$</SketchText>
      <SketchText x={345} y={102} size={9} anchor="start">ssh mytours</SketchText>
      <SketchText x={345} y={122} size={9} anchor="start">sudo -v</SketchText>
      <SketchText x={450} y={176} size={8.5} body opacity={0.75}>
        নতুন নিয়মে কি ঢোকা যায়?
      </SketchText>

      <line x1={260} y1={110} x2={326} y2={110} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#vps-two-arrow)" />
      <SketchText x={293} y={100} size={8.5} body>
        তারপর
      </SketchText>

      {/* outcomes */}
      <Box x={640} y={40} w={160} h={56} text="ঢোকা গেল" sub="এবার Session ১ বন্ধ করুন" accent />
      <Box x={640} y={130} w={160} h={56} text="ঢোকা গেল না" sub="Session ১ থেকে ঠিক করুন" dashed />
      <line x1={570} y1={90} x2={636} y2={70} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#vps-two-arrow)" />
      <line x1={570} y1={130} x2={636} y2={155} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" markerEnd="url(#vps-two-arrow-muted)" />

      <path d="M720,186 L720,240 L140,240 L140,194" fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" strokeDasharray="4 3" markerEnd="url(#vps-two-arrow-muted)" />
      <SketchText x={430} y={262} size={9} body opacity={0.85}>
        ভুল হলে ফিরে আসার রাস্তা এই খোলা Session, Web Console লাগে না
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Drop-in File এর নামই ঠিক করে কোন Setting জিতবে                              */
/* ------------------------------------------------------------------------- */

function ReadOrder({
  files,
  result,
}: {
  files: { name: string; line: string; wins: boolean }[];
  result: string;
}) {
  return (
    <>
      <SketchText x={10} y={20} size={9} anchor="start" opacity={0.75}>
        sshd_config, লাইন 12: Include sshd_config.d/*.conf
      </SketchText>
      {files.map((f, i) => (
        <g key={f.name}>
          <rect
            x={10}
            y={36 + i * 62}
            width={300}
            height={48}
            fill={f.wins ? "var(--primary)" : "currentColor"}
            fillOpacity={f.wins ? 0.12 : 0.04}
            stroke={f.wins ? "var(--primary)" : "currentColor"}
            strokeOpacity={f.wins ? 1 : 0.4}
            strokeWidth="1.3"
          />
          <SketchText x={22} y={56 + i * 62} size={9.5} bold anchor="start" accent={f.wins}>
            {`${i + 1}. ${f.name}`}
          </SketchText>
          <SketchText x={22} y={73 + i * 62} size={9} anchor="start" opacity={f.wins ? 1 : 0.6}>
            {f.line}
          </SketchText>
          <SketchText x={300} y={73 + i * 62} size={8.5} anchor="end" body accent={f.wins} opacity={f.wins ? 1 : 0.6}>
            {f.wins ? "আগে পড়া, এটাই টিকল" : "পরে পড়া, বাদ"}
          </SketchText>
        </g>
      ))}
      <SketchText x={10} y={178} size={9} anchor="start">
        sshd -T বলছে:
      </SketchText>
      <SketchText x={10} y={196} size={10} bold anchor="start" accent>
        {result}
      </SketchText>
    </>
  );
}

export function DropInOrderSplit() {
  return (
    <SketchSplit
      label="Diagram: প্রথমে যে মান পড়ে, sshd সেটাই রাখে"
      caption={
        <>
          OpenSSH একটা Setting এর প্রথম মানটাই রাখে, পরেরগুলো উপেক্ষা করে। আর sshd_config.d
          এর File গুলো সে নামের বর্ণক্রমে পড়ে। অনেক VPS Image এ Cloud-init আগে থেকে একটা
          50-cloud-init.conf রেখে দেয়, যেখানে Password Login চালু। আপনার File এর নাম 99 দিয়ে
          শুরু হলে সেটা পরে পড়া হয় আর হেরে যায়, 00 দিয়ে শুরু হলে আগে পড়া হয় আর জেতে। দুই
          পাশের শেষ লাইনটা অনুশীলনের Server এ sshd -T চালিয়ে পাওয়া আসল ফলাফল।
        </>
      }
      panels={[
        {
          title: "99-hardening.conf",
          sub: "নাম ভুল",
          viewBox: "0 0 320 210",
          height: 210,
          minWidth: 300,
          children: (
            <ReadOrder
              files={[
                { name: "50-cloud-init.conf", line: "PasswordAuthentication yes", wins: true },
                { name: "99-hardening.conf", line: "PasswordAuthentication no", wins: false },
              ]}
              result="passwordauthentication yes"
            />
          ),
        },
        {
          title: "00-hardening.conf",
          sub: "নাম ঠিক",
          viewBox: "0 0 320 210",
          height: 210,
          minWidth: 300,
          children: (
            <ReadOrder
              files={[
                { name: "00-hardening.conf", line: "PasswordAuthentication no", wins: true },
                { name: "50-cloud-init.conf", line: "PasswordAuthentication yes", wins: false },
              ]}
              result="passwordauthentication no"
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 5. বাইরে থেকে শেষ পরীক্ষা                                                    */
/* ------------------------------------------------------------------------- */

const PROBES = [
  { probe: "ssh root@...", expect: "Permission denied", ok: true },
  { probe: "ssh, শুধু Password দিয়ে", expect: "Permission denied", ok: true },
  { probe: "Port 22, 80, 443", expect: "open", ok: true },
  { probe: "Port 3000, 5432, 6379", expect: "filtered", ok: true },
  { probe: "curl https://api.../health", expect: "HTTP/2 200", ok: true },
  { probe: "http:// দিয়ে ঢোকা", expect: "308 → https", ok: true },
  { probe: "Reboot এর পরে আবার", expect: "সব active", ok: true },
] as const;

export function OutsideCheckDiagram() {
  return (
    <Sketch
      label="Diagram: Laptop থেকে সাতটা টোকা, সাতটা প্রত্যাশিত উত্তর"
      height={390}
      minWidth={760}
      viewBox="0 0 820 390"
      caption={
        <>
          Server এর ভেতরে বসে সব ঠিক দেখালেও আসল প্রশ্ন হলো বাইরে থেকে কী দেখা যায়, কারণ
          আক্রমণকারী আর পর্যটক দুইজনই বাইরে থাকেন। তাই শেষ পরীক্ষাটা Laptop থেকে, ঠিক যেভাবে
          একজন অচেনা মানুষ টোকা দেবেন। প্রতিটা উত্তর অনুশীলনের Server এ চালিয়ে পাওয়া। একটাও না
          মিললে Setup শেষ হয়নি।
        </>
      }
    >
      <Arrow id="vps-check-arrow" />
      <Box x={20} y={160} w={130} h={56} text="you@laptop" sub="বাইরের চোখ" accent />
      <Box x={670} y={160} w={130} h={56} text="mytours-vps-01" sub="198.51.100.42" />
      {PROBES.map((p, i) => {
        const y = 40 + i * 48;
        return (
          <g key={p.probe}>
            <line x1={150} y1={188} x2={250} y2={y + 10} stroke="currentColor" strokeOpacity={0.3} strokeWidth="1" />
            <rect x={250} y={y - 6} width={380} height={34} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.35} />
            <SketchText x={262} y={y + 15} size={9.5} anchor="start">
              {p.probe}
            </SketchText>
            <SketchText x={618} y={y + 15} size={9.5} anchor="end" bold accent>
              {p.expect}
            </SketchText>
            <line x1={630} y1={y + 10} x2={666} y2={188} stroke="var(--primary)" strokeOpacity={0.5} strokeWidth="1" markerEnd="url(#vps-check-arrow)" />
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. পুরো মডিউল, একটা Server এর চারপাশে                                         */
/* ------------------------------------------------------------------------- */

const MODULE_SPOKES = [
  { n: "০১", title: "Filesystem", line: "কোথায় কী থাকে" },
  { n: "০২", title: "systemd", line: "কে চালু রাখে" },
  { n: "০৩", title: "SSH", line: "কীভাবে ঢুকি" },
  { n: "০৪", title: "Permission", line: "কে কী ছুঁতে পারে" },
  { n: "০৫", title: "Env Variable", line: "Setting আর Secret" },
  { n: "০৬", title: "ufw", line: "কোন দরজা খোলা" },
  { n: "০৭", title: "Logs", line: "কী ঘটেছিল" },
  { n: "০৮", title: "Monitoring", line: "এখন কেমন আছে" },
  { n: "০৯", title: "Network Debug", line: "কোথায় আটকাচ্ছে" },
  { n: "১০", title: "Cron, Timer", line: "কখন কী চলবে" },
  { n: "১১", title: "VPS Setup", line: "সব একসাথে" },
] as const;

export function ModuleServerDiagram() {
  const cx = 410;
  const cy = 215;
  return (
    <Sketch
      label="Diagram: এগারোটা লেসন, একটা Server"
      height={440}
      minWidth={780}
      viewBox="0 0 820 440"
      caption={
        <>
          মাঝখানে একটা Server, চারপাশে এগারোটা প্রশ্ন। প্রতিটা লেসন একটা প্রশ্নের উত্তর দিয়েছে।
          কোনো Server এ প্রথমবার ঢুকে এই এগারোটা প্রশ্ন নিজেকে করলে আপনি জানবেন সে কী চালায়,
          কে চালায়, কারা ঢুকতে পারে, আর কিছু ভাঙলে কোথায় তাকাতে হবে।
        </>
      }
    >
      <rect x={cx - 90} y={cy - 36} width={180} height={72} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.5" />
      <SketchText x={cx} y={cy - 6} size={11} bold accent>
        island-vps-01
      </SketchText>
      <SketchText x={cx} y={cy + 14} size={9} body>
        একটা Linux Server
      </SketchText>
      {MODULE_SPOKES.map((s, i) => {
        const angle = (Math.PI * 2 * i) / MODULE_SPOKES.length - Math.PI / 2;
        const rx = 300;
        const ry = 165;
        const x = cx + Math.cos(angle) * rx;
        const y = cy + Math.sin(angle) * ry;
        const last = i === MODULE_SPOKES.length - 1;
        return (
          <g key={s.n}>
            <line
              x1={cx + Math.cos(angle) * 95}
              y1={cy + Math.sin(angle) * 40}
              x2={x - Math.cos(angle) * 60}
              y2={y - Math.sin(angle) * 20}
              stroke={last ? "var(--primary)" : "currentColor"}
              strokeOpacity={last ? 1 : 0.35}
              strokeWidth="1.1"
            />
            <rect
              x={x - 62}
              y={y - 20}
              width={124}
              height={40}
              fill={last ? "var(--primary)" : "currentColor"}
              fillOpacity={last ? 0.12 : 0.04}
              stroke={last ? "var(--primary)" : "currentColor"}
              strokeOpacity={last ? 1 : 0.4}
            />
            <SketchText x={x} y={y - 4} size={9} bold accent={last}>
              {`${s.n} ${s.title}`}
            </SketchText>
            <SketchText x={x} y={y + 12} size={8.5} body opacity={0.8}>
              {s.line}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
