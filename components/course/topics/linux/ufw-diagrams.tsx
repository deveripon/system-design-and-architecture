/**
 * What: The still diagrams for Module 07 Lesson 06, Firewall Management with ufw. They show the
 * firewall as a guard in front of the server's ports, the layers from the ufw command down to the
 * kernel, why replies to your own connections get in, the safe order for turning ufw on, the path
 * that lets Docker's published ports skip ufw, and the provider's firewall as a second wall.
 *
 * Why: A firewall is a decision made about a packet before any program sees it. That is hard to
 * hold in words and easy to see as a picture of doors, walls and arrows. Every marker id starts
 * with "ufw-" and is unique per diagram, so two diagrams on one page never share an id.
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

/** A small cross drawn where a packet is stopped. */
function Stop({ x, y }: { x: number; y: number }) {
  return (
    <g stroke="var(--primary)" strokeWidth="2">
      <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} />
      <line x1={x + 6} y1={y - 6} x2={x - 6} y2={y + 6} />
    </g>
  );
}

/** A vertical wall, the firewall drawn as a band of bricks. */
function Wall({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  const rows = Math.floor(h / 14);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      {Array.from({ length: rows - 1 }, (_, i) => (
        <line
          key={i}
          x1={x}
          x2={x + w}
          y1={y + (i + 1) * 14}
          y2={y + (i + 1) * 14}
          stroke="var(--primary)"
          strokeOpacity={0.3}
        />
      ))}
      <SketchText x={x + w / 2} y={y - 8} size={9.5} bold accent>
        {label}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. দারোয়ান আর দরজা                                                          */
/* ------------------------------------------------------------------------- */

const DOORS = [
  { y: 70, port: "22/tcp", who: "sshd, আপনার Login", verdict: "LIMIT" },
  { y: 110, port: "80/tcp", who: "Caddy, HTTPS এ পাঠায়", verdict: "ALLOW" },
  { y: 150, port: "443/tcp", who: "Caddy, আসল সাইট", verdict: "ALLOW" },
  { y: 190, port: "3000/tcp", who: "App, শুধু ভেতরের জন্য", verdict: "DENY" },
  { y: 230, port: "5432/tcp", who: "PostgreSQL", verdict: "DENY" },
  { y: 270, port: "6379/tcp", who: "Redis", verdict: "DENY" },
] as const;

export function FirewallGateDiagram() {
  return (
    <Sketch
      label="Diagram: দরজার সামনে একজন দারোয়ান"
      viewBox="0 0 760 320"
      height={320}
      minWidth={680}
      caption="Server এর প্রতিটা Port একটা দরজা, আর Firewall হলো দরজাগুলোর সামনে দাঁড়ানো দারোয়ান। Packet কোনো Program এর কাছে পৌঁছানোর আগেই দারোয়ান তালিকা দেখে ঠিক করে ঢুকতে দেবে কি না। পর্যটকের Packet 443 এ ঢুকল, আপনার SSH 22 এ ঢুকল, কিন্তু অচেনা Scanner এর 5432 আর 6379 এর চেষ্টা দেয়ালেই থেমে গেল। ডান পাশের শব্দগুলো Island Tours এর আসল Rule, এই লেসনের শেষে আপনি নিজেই এগুলো লিখবেন।"
    >
      <Arrow id="ufw-gate-arrow" />
      <Arrow id="ufw-gate-arrow-muted" muted />

      <Box x={20} y={48} w={160} h={44} text="আপনি, deploy" sub="SSH, Port 22" />
      <Box x={20} y={128} w={160} h={44} text="পর্যটকের ফোন" sub="HTTPS, Port 443" />
      <Box x={20} y={228} w={160} h={44} text="অচেনা Scanner" sub="5432 আর 6379 খুঁজছে" dashed />

      <Wall x={292} y={30} w={30} h={274} label="FIREWALL" />

      <rect x={380} y={20} width={360} height={290} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <SketchText x={560} y={40} size={10.5} bold>
        island-vps-01 · 103.94.135.2
      </SketchText>

      {DOORS.map((d) => {
        const open = d.verdict !== "DENY";
        return (
          <g key={d.port}>
            <rect
              x={380}
              y={d.y - 13}
              width={76}
              height={26}
              fill={open ? "var(--primary)" : "currentColor"}
              fillOpacity={open ? 0.12 : 0.05}
              stroke={open ? "var(--primary)" : "currentColor"}
              strokeOpacity={open ? 1 : 0.4}
            />
            <SketchText x={418} y={d.y + 4} size={9.5} bold accent={open}>
              {d.port}
            </SketchText>
            <SketchText x={466} y={d.y + 4} size={9} body anchor="start" opacity={0.85}>
              {d.who}
            </SketchText>
            <SketchText x={728} y={d.y + 4} size={9} bold anchor="end" accent={open} opacity={open ? 1 : 0.6}>
              {d.verdict}
            </SketchText>
          </g>
        );
      })}

      {/* allowed: you to 22, tourist to 443 */}
      <line x1={180} y1={70} x2={376} y2={70} stroke="var(--primary)" strokeWidth="1.6" markerEnd="url(#ufw-gate-arrow)" />
      <line x1={180} y1={150} x2={376} y2={150} stroke="var(--primary)" strokeWidth="1.6" markerEnd="url(#ufw-gate-arrow)" />

      {/* stopped: scanner to 5432 and 6379 */}
      <line x1={180} y1={244} x2={284} y2={230} stroke="currentColor" strokeOpacity={0.55} strokeDasharray="4 3" strokeWidth="1.3" />
      <line x1={180} y1={256} x2={284} y2={270} stroke="currentColor" strokeOpacity={0.55} strokeDasharray="4 3" strokeWidth="1.3" />
      <Stop x={284} y={230} />
      <Stop x={284} y={270} />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. ufw থেকে Kernel পর্যন্ত চারটা তলা                                           */
/* ------------------------------------------------------------------------- */

export function UfwLayersDiagram() {
  return (
    <Sketch
      label="Diagram: ufw আসলে কাকে কী বলে"
      viewBox="0 0 760 300"
      height={300}
      minWidth={680}
      caption="আপনি লেখেন একটা সহজ বাক্য। ufw সেটাকে iptables এর ভাষায় অনুবাদ করে আর একটা ফাইলে লিখে রাখে। iptables সেই Rule Kernel এর netfilter এ বসায়। আর প্রতিটা Packet এর আসল সিদ্ধান্ত হয় একদম নিচে, Kernel এর ভেতরে, কোনো Program জেগে ওঠার আগেই। ufw নিজে কোনো Packet দেখে না, সে শুধু Rule লেখার দোভাষী। Reboot এর পর ufw.service ফাইল থেকে সব Rule আবার বসিয়ে দেয়।"
    >
      <Arrow id="ufw-layers-arrow" />
      <Arrow id="ufw-layers-arrow-muted" muted />

      <Box x={40} y={20} w={330} h={44} text="sudo ufw allow 443/tcp" sub="আপনি যা লেখেন" />
      <Box x={40} y={88} w={330} h={44} text="ufw" sub="সহজ বাক্যকে Rule এ অনুবাদ করে, ফাইলে লিখে রাখে" />
      <Box x={40} y={156} w={330} h={44} text="iptables (nf_tables)" sub="Rule গুলো Kernel এর কাছে পৌঁছে দেয়" />
      <Box x={40} y={224} w={330} h={50} text="netfilter, Kernel এর ভেতরে" sub="প্রতিটা Packet এর সিদ্ধান্ত এখানেই হয়" accent />

      {[64, 132, 200].map((y) => (
        <line key={y} x1={205} y1={y} x2={205} y2={y + 21} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.3" markerEnd="url(#ufw-layers-arrow-muted)" />
      ))}

      {/* packet path into the kernel */}
      <Box x={600} y={224} w={140} h={50} text="Packet আসে" sub="eth0, Port 443" />
      <line x1={598} y1={249} x2={374} y2={249} stroke="var(--primary)" strokeWidth="1.6" markerEnd="url(#ufw-layers-arrow)" />

      {/* notes on the right */}
      <Box x={430} y={20} w={310} h={44} text="/etc/ufw/user.rules" sub="আপনার Rule, Reboot এর পরও থাকে" dashed />
      <Box x={430} y={88} w={310} h={44} text="/etc/default/ufw" sub="Default নীতি আর IPV6=yes" dashed />
      <Box x={430} y={156} w={310} h={44} text="ufw.service" sub="Boot এর সময় সব Rule আবার বসায়" dashed />
      <line x1={428} y1={42} x2={374} y2={110} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 3" />
      <line x1={428} y1={110} x2={374} y2={110} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 3" />
      <line x1={428} y1={178} x2={374} y2={178} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 3" />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Stateful: নিজের শুরু করা কথার উত্তর ঢোকে                                    */
/* ------------------------------------------------------------------------- */

export function StatefulSplit() {
  return (
    <SketchSplit
      label="Diagram: খাতায় নাম আছে কি না"
      caption="বাম পাশে Server নিজে বাইরে একটা Connection খুলল, যেমন apt Update বা Payment Gateway কে ডাকা। Kernel খাতায় লিখে রাখল এই কথোপকথন সে নিজে শুরু করেছে। উত্তর ফিরে এলে দেয়াল খাতা দেখে চিনে নেয়, ESTABLISHED, ঢুকতে দেয়। ডান পাশে বাইরের কেউ একদম নতুন Connection খুলতে চাইল Port 3000 এ। খাতায় তার কোনো নাম নেই, কোনো Rule তাকে অনুমতিও দেয় না, তাই Default নীতি মেনে বাদ। এটাই Stateful Firewall: প্রতিটা Packet আলাদা করে না দেখে, কোন কথোপকথনের অংশ সেটা মনে রাখে।"
      panels={[
        {
          title: "নিজে শুরু করা",
          sub: "উত্তর ঢুকতে পারে",
          viewBox: "0 0 360 220",
          height: 220,
          children: (
            <g>
              <Arrow id="ufw-state-a-arrow" />
              <Box x={6} y={70} w={110} h={50} text="island-vps-01" sub="বাইরে ডাকছে" accent />
              <Wall x={170} y={40} w={22} h={112} label="ufw" />
              <Box x={244} y={70} w={110} h={50} text="অন্য Server" sub="Port 8080" />
              <line x1={118} y1={84} x2={240} y2={84} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#ufw-state-a-arrow)" />
              <line x1={242} y1={108} x2={120} y2={108} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#ufw-state-a-arrow)" />
              <SketchText x={143} y={78} size={9} bold accent>
                ১
              </SketchText>
              <SketchText x={143} y={124} size={9} bold accent>
                ২
              </SketchText>
              <SketchText x={180} y={172} size={8.5} body>
                ১. SYN বাইরে যায়, ২. উত্তর ফেরে
              </SketchText>
              <SketchText x={180} y={190} size={8.5} body accent>
                খাতায় আছে: ESTABLISHED
              </SketchText>
              <SketchText x={180} y={206} size={8.5} body accent>
                ঢুকতে দেওয়া হয়
              </SketchText>
            </g>
          ),
        },
        {
          title: "বাইরে থেকে নতুন",
          sub: "Rule না থাকলে বাদ",
          viewBox: "0 0 360 220",
          height: 220,
          children: (
            <g>
              <Box x={6} y={70} w={110} h={50} text="island-vps-01" sub="Port 3000" />
              <Wall x={170} y={40} w={22} h={112} label="ufw" />
              <Box x={244} y={70} w={110} h={50} text="অচেনা কেউ" sub="নতুন Connection" dashed />
              <line x1={242} y1={95} x2={202} y2={95} stroke="currentColor" strokeOpacity={0.6} strokeDasharray="4 3" strokeWidth="1.4" />
              <Stop x={200} y={95} />
              <SketchText x={180} y={172} size={8.5} body>
                SYN, Port 3000, একদম নতুন
              </SketchText>
              <SketchText x={180} y={190} size={8.5} body accent>
                খাতায় নেই, Rule ও নেই
              </SketchText>
              <SketchText x={180} y={206} size={8.5} body accent>
                Default: deny, বাদ
              </SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 4. নিজেকে তালাবন্ধ করা আর না করা                                               */
/* ------------------------------------------------------------------------- */

function StepColumn({
  steps,
  arrowId,
  badIndex,
}: {
  steps: { text: string; sub: string }[];
  arrowId: string;
  badIndex?: number;
}) {
  return (
    <g>
      <Arrow id={arrowId} muted />
      {steps.map((s, i) => {
        const y = 12 + i * 62;
        const bad = badIndex === i;
        return (
          <g key={s.text}>
            <Box x={20} y={y} w={320} h={44} text={s.text} sub={s.sub} accent={bad || (badIndex === undefined && i === steps.length - 1)} size={9.5} />
            {i < steps.length - 1 && (
              <line x1={180} y1={y + 44} x2={180} y2={y + 60} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.3" markerEnd={`url(#${arrowId})`} />
            )}
          </g>
        );
      })}
    </g>
  );
}

export function LockoutSplit() {
  return (
    <SketchSplit
      label="Diagram: আগে দরজা, তারপর তালা"
      caption="দুই পাশে একই চারটা কাজ, শুধু ক্রমটা আলাদা। বাম পাশে SSH এর অনুমতি না দিয়েই ufw চালু করা হয়েছে। চালু Session টা মরে না, কারণ সেটা আগে থেকেই খাতায় আছে, আর এটাই ফাঁদ: সব ঠিক মনে হয়। তারপর Terminal বন্ধ করলেন বা Wi-Fi বদলাল, আর নতুন SSH আর ঢুকতে পারে না। এই লেসনের Practice Server এ ঠিক এটাই ঘটেছে, নতুন Session এর উত্তর ছিল Connection timed out। ডান পাশে আগে দরজা খোলা, তারপর তালা, আর পুরনো Session বন্ধ করার আগে একটা নতুন Session দিয়ে প্রমাণ।"
      panels={[
        {
          title: "ভুল ক্রম",
          sub: "পরে বোঝা যায়, তখন দেরি",
          viewBox: "0 0 360 250",
          height: 250,
          children: (
            <StepColumn
              arrowId="ufw-lock-bad-arrow"
              badIndex={3}
              steps={[
                { text: "sudo ufw enable", sub: "SSH এর কোনো Rule নেই" },
                { text: "Default: deny incoming", sub: "নতুন সব Connection বাদ" },
                { text: "চালু Session চলছে", sub: "খাতায় আছে বলে, তাই সব ঠিক মনে হয়" },
                { text: "নতুন SSH: timed out", sub: "এখন শুধু Provider এর Web Console ভরসা" },
              ]}
            />
          ),
        },
        {
          title: "সঠিক ক্রম",
          sub: "প্রতিবার এভাবেই",
          viewBox: "0 0 360 250",
          height: 250,
          children: (
            <StepColumn
              arrowId="ufw-lock-good-arrow"
              steps={[
                { text: "sudo ufw allow OpenSSH", sub: "আগে নিজের দরজা খোলা" },
                { text: "sudo ufw show added", sub: "চালুর আগে তালিকা মিলিয়ে দেখা" },
                { text: "sudo ufw enable", sub: "পুরনো Session খোলা রেখেই" },
                { text: "দ্বিতীয় Terminal এ নতুন SSH", sub: "ঢুকতে পারলে তবেই পুরনোটা বন্ধ" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 5. Docker এর পথ, যেটা ufw কে পাশ কাটায়                                         */
/* ------------------------------------------------------------------------- */

export function DockerBypassDiagram() {
  return (
    <Sketch
      label="Diagram: Docker এর Packet কোন পথে যায়"
      viewBox="0 0 760 330"
      height={330}
      minWidth={680}
      caption="ufw এর সব Rule থাকে INPUT চেইনে, যা শুধু Server এর নিজের Program এর জন্য আসা Packet দেখে। docker run -p 5432:5432 করলে Docker আগেই nat টেবিলে একটা নিয়ম বসায়: 5432 এ যা আসবে, তার গন্তব্য বদলে Container এর ঠিকানা করে দেওয়া। গন্তব্য বদলে গেলে Packet আর Server এর নিজের জন্য নয়, সে চলে যায় FORWARD চেইনে, আর সেখানে Docker এর নিজের চেইন ufw এর আগে বসে আছে। ফল: ufw এ 5432 এর কোনো Rule না থাকা সত্ত্বেও বাইরে থেকে Connection সফল। এই লেসনের Practice Server এ ঠিক এটাই ধরা পড়েছে। সমাধান নিচে: Port টা শুধু 127.0.0.1 এ Publish করা।"
    >
      <Arrow id="ufw-docker-arrow" />
      <Arrow id="ufw-docker-arrow-muted" muted />

      <Box x={14} y={120} w={150} h={50} text="বাইরের Packet" sub="গন্তব্য: Port 5432" />
      <Box x={200} y={120} w={180} h={50} text="nat টেবিল, PREROUTING" sub="Docker এর DNAT: 172.17.0.2:5432" accent />
      <line x1={166} y1={145} x2={196} y2={145} stroke="var(--primary)" strokeWidth="1.6" markerEnd="url(#ufw-docker-arrow)" />

      {/* the path ufw guards, which this packet never takes */}
      <Box x={430} y={30} w={170} h={50} text="INPUT চেইন" sub="ufw এর সব Rule এখানে" dashed />
      <Box x={636} y={30} w={110} h={50} text="sshd, Caddy" sub="Host এর Program" dashed />
      <line x1={290} y1={118} x2={426} y2={62} stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 3" strokeWidth="1.3" markerEnd="url(#ufw-docker-arrow-muted)" />
      <line x1={602} y1={55} x2={632} y2={55} stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 3" strokeWidth="1.3" markerEnd="url(#ufw-docker-arrow-muted)" />
      <SketchText x={330} y={78} size={8.5} body opacity={0.8}>
        Host এর জন্য হলে এই পথ
      </SketchText>

      {/* the path the packet actually takes */}
      <Box x={430} y={200} w={170} h={50} text="FORWARD চেইন" sub="DOCKER-USER, DOCKER-FORWARD আগে" accent />
      <Box x={636} y={200} w={110} h={50} text="Container" sub="5432 বাইরে খোলা" accent />
      <line x1={300} y1={172} x2={426} y2={222} stroke="var(--primary)" strokeWidth="1.6" markerEnd="url(#ufw-docker-arrow)" />
      <line x1={602} y1={225} x2={632} y2={225} stroke="var(--primary)" strokeWidth="1.6" markerEnd="url(#ufw-docker-arrow)" />
      <SketchText x={330} y={214} size={8.5} body accent>
        গন্তব্য বদলে গেছে, তাই এই পথ
      </SketchText>

      {/* the fix */}
      <rect x={14} y={274} width={732} height={42} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="4 3" />
      <SketchText x={380} y={292} size={9.5} bold accent>
        docker run -p 127.0.0.1:5432:5432 ...
      </SketchText>
      <SketchText x={380} y={308} size={8.5} body opacity={0.85}>
        শুধু 127.0.0.1 এ Publish করলে বাইরের Packet এর জন্য DNAT ই হয় না, Server এর ভেতর থেকে তবুও পৌঁছানো যায়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. দুইটা দেয়াল: Provider এর Firewall আর ufw                                    */
/* ------------------------------------------------------------------------- */

export function TwoWallsDiagram() {
  return (
    <Sketch
      label="Diagram: দেয়ালের বাইরে আরেকটা দেয়াল"
      viewBox="0 0 760 312"
      height={312}
      minWidth={680}
      caption="Provider এর Cloud Firewall বসে তাদের Network এ, আপনার Server এর বাইরে। ufw বসে Server এর ভেতরে, Kernel এ। Packet কে দুইটাই পার হতে হয়। একটায় ভুল হলে অন্যটা ধরে: কেউ ufw বন্ধ করে ফেললে বা Docker কোনো Port খুলে দিলে বাইরের দেয়াল তখনও দাঁড়িয়ে। আর বাইরের দেয়ালে কোনো Rule বেশি খোলা থাকলে ভেতরেরটা ধরে। নিরাপত্তায় একে বলে Defence in Depth, এক স্তরের ভুল যেন পুরো বাড়ি খুলে না দেয়।"
    >
      <Arrow id="ufw-walls-arrow" />
      <Arrow id="ufw-walls-arrow-muted" muted />

      <Box x={14} y={54} w={130} h={44} text="পর্যটক" sub="443" />
      <Box x={14} y={130} w={130} h={44} text="Scanner" sub="5432" dashed />

      <Wall x={196} y={30} w={26} h={160} label="Cloud Firewall" />

      <rect x={280} y={14} width={466} height={190} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <SketchText x={513} y={32} size={10} bold>
        island-vps-01
      </SketchText>
      <Wall x={320} y={50} w={22} h={140} label="ufw" />
      <Box x={400} y={56} w={150} h={40} text="Caddy :443" accent />
      <Box x={400} y={130} w={150} h={40} text="PostgreSQL" sub="127.0.0.1:5432" />
      <Box x={590} y={56} w={140} h={40} text="App :3000" sub="127.0.0.1" />

      <line x1={146} y1={76} x2={396} y2={76} stroke="var(--primary)" strokeWidth="1.6" markerEnd="url(#ufw-walls-arrow)" />
      <line x1={146} y1={152} x2={188} y2={152} stroke="currentColor" strokeOpacity={0.55} strokeDasharray="4 3" strokeWidth="1.3" />
      <Stop x={190} y={152} />
      <line x1={552} y1={76} x2={586} y2={76} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.3" markerEnd="url(#ufw-walls-arrow-muted)" />

      {/* what each wall is good at */}
      <rect x={14} y={218} width={360} height={80} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.3} />
      <SketchText x={24} y={236} size={9} bold anchor="start" accent>
        Cloud Firewall
      </SketchText>
      <SketchText x={24} y={253} size={8.5} body anchor="start">
        Server এর বাইরে, ভেতরের ভুল Config এ টিকে থাকে
      </SketchText>
      <SketchText x={24} y={269} size={8.5} body anchor="start">
        Docker এর খোলা Port ও এখানে আটকায়
      </SketchText>
      <SketchText x={24} y={286} size={8.5} body anchor="start" opacity={0.75}>
        Dashboard থেকে, একসাথে অনেক Server এ
      </SketchText>

      <rect x={386} y={218} width={360} height={80} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.3} />
      <SketchText x={396} y={236} size={9} bold anchor="start" accent>
        ufw
      </SketchText>
      <SketchText x={396} y={253} size={8.5} body anchor="start">
        সূক্ষ্ম Rule, limit আর Log, Server এর সাথেই থাকে
      </SketchText>
      <SketchText x={396} y={269} size={8.5} body anchor="start">
        Provider বদলালেও একই Rule, Code এর মতো লেখা যায়
      </SketchText>
      <SketchText x={396} y={286} size={8.5} body anchor="start" opacity={0.75}>
        কিন্তু Docker এর Publish করা Port দেখে না
      </SketchText>
    </Sketch>
  );
}
