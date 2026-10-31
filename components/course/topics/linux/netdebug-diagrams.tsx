/**
 * What: The still diagrams for Module 07 Lesson 09, Network Debugging. They show the five
 * layers to check in order, the checkpoints between a tourist and the app with the command
 * that tests each one, how to read one line of `ss`, the two bind addresses, what refused,
 * timed out and no route look like on the wire, and a decision tree for "the site is down".
 *
 * Why: Network debugging is a search, and a search goes faster when the reader can see the
 * whole map before choosing where to look. Every number in these pictures comes from the
 * practice server runs in the lesson. Every marker id starts with "netdebug-" so two
 * diagrams on one page never share an id.
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
  dashed,
  size = 9.5,
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
        <SketchText x={x + w / 2} y={y + h / 2 + 12} size={8} body opacity={0.75}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. পাঁচটা স্তর, পাঁচটা প্রশ্ন                                                  */
/* ------------------------------------------------------------------------- */

const LAYERS = [
  {
    n: "1",
    name: "DNS",
    question: "নামটা কি ঠিক IP তে মিলছে?",
    tools: "dig +short, getent hosts",
    fail: "Could not resolve host",
  },
  {
    n: "2",
    name: "ROUTE",
    question: "সেই IP পর্যন্ত কি পথ আছে?",
    tools: "ip route, ping, traceroute",
    fail: "No route to host",
  },
  {
    n: "3",
    name: "PORT",
    question: "দরজা খোলা, ভেতরে কেউ শুনছে?",
    tools: "nc -vz, ss -tlnp",
    fail: "Connection refused, timed out",
  },
  {
    n: "4",
    name: "TLS",
    question: "তালা খোলে, Certificate ঠিক?",
    tools: "openssl s_client, curl -v",
    fail: "curl (35), curl (60), alert",
  },
  {
    n: "5",
    name: "HTTP",
    question: "উত্তরটা কি ঠিক?",
    tools: "curl -I, curl -w",
    fail: "502, 504, 500, ভুল পাতা",
  },
];

export function NetdebugLayersDiagram() {
  const rowH = 52;
  const top = 34;
  return (
    <Sketch
      label="Diagram: পাঁচ স্তর, নিচ থেকে নয়, বাইরে থেকে ভেতরে"
      height={330}
      minWidth={720}
      viewBox="0 0 760 330"
      caption="প্রতিটা স্তরের একটা প্রশ্ন আছে, আর সেই প্রশ্নের উত্তর দেওয়ার এক দুইটা যন্ত্র। উপর থেকে নিচে একটা একটা করে পরীক্ষা করুন। প্রথম যে স্তরে উত্তর না আসে, সমস্যাটা সেখানেই, আর তার নিচের স্তর নিয়ে তখন মাথা ঘামানোর দরকার নেই। ডান পাশের লাইনটা বলে সেই স্তর ভাঙলে কোন বার্তা চোখে পড়ে।"
    >
      <SketchText x={30} y={20} size={8} anchor="start" opacity={0.6}>
        LAYER
      </SketchText>
      <SketchText x={200} y={20} size={8} anchor="start" opacity={0.6}>
        QUESTION
      </SketchText>
      <SketchText x={430} y={20} size={8} anchor="start" opacity={0.6}>
        TOOLS
      </SketchText>
      <SketchText x={600} y={20} size={8} anchor="start" opacity={0.6}>
        WHEN IT FAILS
      </SketchText>
      {LAYERS.map((layer, i) => {
        const y = top + i * rowH;
        const accent = i === 2;
        return (
          <g key={layer.name}>
            <rect
              x={20}
              y={y}
              width={720}
              height={rowH - 8}
              fill={accent ? "var(--primary)" : "currentColor"}
              fillOpacity={accent ? 0.08 : 0.03}
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 0.9 : 0.3}
              strokeWidth="1.1"
            />
            <circle
              cx={44}
              cy={y + (rowH - 8) / 2}
              r={11}
              fill="none"
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 1 : 0.6}
            />
            <SketchText x={44} y={y + (rowH - 8) / 2 + 4} size={10} bold accent={accent}>
              {layer.n}
            </SketchText>
            <SketchText x={66} y={y + (rowH - 8) / 2 + 4} size={11} anchor="start" bold accent={accent}>
              {layer.name}
            </SketchText>
            <SketchText x={200} y={y + (rowH - 8) / 2 + 4} size={10} anchor="start" body>
              {layer.question}
            </SketchText>
            <SketchText x={430} y={y + (rowH - 8) / 2 + 4} size={9} anchor="start">
              {layer.tools}
            </SketchText>
            <SketchText x={600} y={y + (rowH - 8) / 2 + 4} size={8} anchor="start" body opacity={0.8}>
              {layer.fail}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={380} y={320} size={9} body opacity={0.7}>
        বেশিরভাগ রাতের Error এর ঘর ৩ নম্বর, Port। তাই এই লেসনের সবচেয়ে বড় অংশটা ওই স্তরের যন্ত্রগুলো নিয়ে।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. পর্যটক থেকে App, পথের প্রতিটা চৌকি                                         */
/* ------------------------------------------------------------------------- */

const CHECKPOINTS = [
  { x: 20, w: 92, title: "TOURIST", sub: "ফোন বা Laptop", check: "dig, curl -v", where: "out" },
  { x: 136, w: 100, title: "PROVIDER FW", sub: "Dashboard এর Rule", check: "nc -vz :443", where: "out" },
  { x: 260, w: 84, title: "UFW", sub: "VPS এর Firewall", check: "ufw status", where: "in" },
  { x: 368, w: 100, title: "CADDY :443", sub: "TLS, Reverse Proxy", check: "openssl s_client", where: "in" },
  { x: 492, w: 116, title: "APP 127.0.0.1:3000", sub: "my-tours-api", check: "curl 127.0.0.1:3000", where: "in" },
  { x: 632, w: 110, title: "REDIS, POSTGRES", sub: "শুধু 127.0.0.1", check: "ss -tnp", where: "in" },
] as const;

export function NetdebugCheckpointsDiagram() {
  return (
    <Sketch
      label="Diagram: একটা Request কোন কোন চৌকি পার হয়, আর কোনটা কোথা থেকে পরীক্ষা করবেন"
      height={250}
      minWidth={740}
      viewBox="0 0 760 250"
      caption="বাঁয়ের দুইটা চৌকি শুধু বাইরে থেকে পরীক্ষা করা যায়, কারণ Server এর ভেতর থেকে Provider এর Firewall দেখা যায় না। ডানের চারটা পরীক্ষা Server এ ঢুকে। দুই দিক থেকে একই প্রশ্ন করলে সমস্যাটা দুই চৌকির মাঝে আটকে যায়: ভেতর থেকে চলে কিন্তু বাইরে থেকে চলে না মানে দোষ বাইরের দিকের কোনো চৌকিতে।"
    >
      <Arrow id="netdebug-cp-arrow" />
      <Arrow id="netdebug-cp-muted" muted />
      {CHECKPOINTS.map((c, i) => {
        const next = CHECKPOINTS[i + 1];
        return (
          <g key={c.title}>
            <Box x={c.x} y={70} w={c.w} h={46} text={c.title} sub={c.sub} accent={i === 4} size={8.5} />
            {next && (
              <line
                x1={c.x + c.w + 2}
                y1={93}
                x2={next.x - 4}
                y2={93}
                stroke="var(--primary)"
                strokeWidth="1.3"
                markerEnd="url(#netdebug-cp-arrow)"
              />
            )}
            <line
              x1={c.x + c.w / 2}
              y1={118}
              x2={c.x + c.w / 2}
              y2={150}
              stroke="currentColor"
              strokeOpacity={0.4}
              strokeDasharray="3 3"
            />
            <SketchText x={c.x + c.w / 2} y={166} size={8.5}>
              {c.check}
            </SketchText>
          </g>
        );
      })}
      {/* where each check runs */}
      <rect x={20} y={186} width={216} height={30} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="4 3" />
      <SketchText x={128} y={205} size={9} body>
        বাইরে থেকে, নিজের Laptop এ
      </SketchText>
      <rect x={260} y={186} width={482} height={30} fill="var(--primary)" fillOpacity={0.06} stroke="var(--primary)" strokeOpacity={0.6} strokeDasharray="4 3" />
      <SketchText x={501} y={205} size={9} body accent>
        Server এর ভেতরে, ssh island করে ঢুকে
      </SketchText>
      <SketchText x={380} y={34} size={10} body>
        পর্যটকের Request বাঁ থেকে ডানে যায়। ভাঙা জায়গা খুঁজতে আমরাও বাঁ থেকে ডানে হাঁটি।
      </SketchText>
      <SketchText x={128} y={54} size={8} opacity={0.6}>
        INTERNET
      </SketchText>
      <SketchText x={501} y={54} size={8} opacity={0.6}>
        island-vps-01, 103.94.135.2
      </SketchText>
      <line x1={248} y1={44} x2={248} y2={226} stroke="currentColor" strokeOpacity={0.3} />
      <SketchText x={380} y={240} size={8} body opacity={0.6}>
        মাঝের খাড়া রেখাটা VPS এর দেয়াল। তার বাঁয়ে যা, তা আপনার Server এর হাতে নেই।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. ss এর একটা লাইন, ঘর ধরে ধরে                                              */
/* ------------------------------------------------------------------------- */

export function NetdebugSsLineDiagram() {
  const cols = [
    { x: 30, text: "LISTEN", label: "State", note: "দরজায় দাঁড়িয়ে অপেক্ষা" },
    { x: 118, text: "0", label: "Recv-Q", note: "লাইনে অপেক্ষমাণ" },
    { x: 172, text: "511", label: "Send-Q", note: "লাইনের সর্বোচ্চ মাপ" },
    { x: 260, text: "127.0.0.1:3000", label: "Local Address:Port", note: "কোন দরজা, কোন Port" },
    { x: 420, text: "0.0.0.0:*", label: "Peer Address:Port", note: "যে কেউ, এখনো কেউ নেই" },
    { x: 560, text: 'users:(("node",pid=1220,fd=24))', label: "Process", note: "কে ধরে আছে, sudo লাগে" },
  ];
  return (
    <Sketch
      label="Diagram: ss -tlnp এর একটা লাইন, প্রতিটা ঘরের মানে"
      height={210}
      minWidth={760}
      viewBox="0 0 800 210"
      caption="এই লাইনটা practice server থেকে নেওয়া, আসল। LISTEN অবস্থার Socket এ Recv-Q মানে এই মুহূর্তে কয়টা নতুন Connection Accept এর অপেক্ষায় লাইনে দাঁড়িয়ে আছে, আর Send-Q মানে সেই লাইন সর্বোচ্চ কত লম্বা হতে পারে। Recv-Q যদি বারবার Send-Q এর কাছে পৌঁছায়, App নতুন Connection নিতে পারছে না, লাইন উপচে পড়ছে। সবচেয়ে কাজের ঘর দুইটা: Local Address বলে কোন দরজায় শুনছে, আর Process বলে কে।"
    >
      <Arrow id="netdebug-ss-arrow" muted />
      <rect x={20} y={88} width={760} height={34} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.35} />
      {cols.map((c, i) => (
        <g key={c.label}>
          <SketchText x={c.x} y={110} size={11} anchor="start" bold={i === 3} accent={i === 3 || i === 5}>
            {c.text}
          </SketchText>
          <line
            x1={c.x + 8}
            y1={i % 2 === 0 ? 62 : 150}
            x2={c.x + 8}
            y2={i % 2 === 0 ? 86 : 124}
            stroke="currentColor"
            strokeOpacity={0.5}
            markerEnd="url(#netdebug-ss-arrow)"
          />
          <SketchText x={c.x} y={i % 2 === 0 ? 38 : 168} size={9} anchor="start" bold>
            {c.label}
          </SketchText>
          <SketchText x={c.x} y={i % 2 === 0 ? 54 : 184} size={8.5} anchor="start" body opacity={0.8}>
            {c.note}
          </SketchText>
        </g>
      ))}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. দুইটা Bind Address                                                       */
/* ------------------------------------------------------------------------- */

function BindPanel({ open }: { open: boolean }) {
  const marker = open ? "netdebug-bind-open" : "netdebug-bind-closed";
  return (
    <g>
      <Arrow id={marker} muted={!open} />
      {/* the server, with Caddy and the app both inside it */}
      <rect x={110} y={12} width={184} height={194} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.4} />
      <SketchText x={202} y={28} size={8.5} opacity={0.7}>
        island-vps-01
      </SketchText>
      {/* two doors */}
      <rect x={104} y={50} width={12} height={32} fill="currentColor" fillOpacity={0.15} stroke="currentColor" strokeOpacity={0.6} />
      <SketchText x={122} y={46} size={7.5} anchor="start" opacity={0.75}>
        eth0 103.94.135.2
      </SketchText>
      <rect x={104} y={150} width={12} height={32} fill="var(--primary)" fillOpacity={0.15} stroke="var(--primary)" strokeOpacity={0.8} />
      <SketchText x={122} y={198} size={7.5} anchor="start" opacity={0.75}>
        lo 127.0.0.1
      </SketchText>
      {/* the app */}
      <Box x={200} y={88} w={88} h={36} text={open ? "0.0.0.0:8080" : "127.0.0.1:3000"} sub={open ? "সব দরজায়" : "শুধু ভেতরের দরজায়"} accent={!open} size={8.5} />
      {/* outside client */}
      <Box x={6} y={49} w={78} h={34} text="LAPTOP" sub="বাইরে থেকে" size={8.5} />
      <line x1={84} y1={66} x2={open ? 198 : 102} y2={open ? 100 : 66} stroke={open ? "var(--primary)" : "currentColor"} strokeOpacity={open ? 1 : 0.5} strokeWidth="1.3" markerEnd={`url(#${marker})`} />
      {!open && (
        <SketchText x={45} y={102} size={8} body>
          refused
        </SketchText>
      )}
      {/* Caddy lives on the same machine and reaches the app through lo */}
      <Box x={124} y={140} w={66} h={32} text="CADDY" sub="একই যন্ত্রে" size={8.5} />
      <line x1={190} y1={152} x2={236} y2={127} stroke="var(--primary)" strokeWidth="1.3" markerEnd={`url(#${marker})`} />
    </g>
  );
}

export function NetdebugBindSplit() {
  return (
    <SketchSplit
      label="Diagram: একই App, দুই রকম Bind, দুই রকম ফল"
      panels={[
        {
          title: "127.0.0.1:3000",
          sub: "শুধু এই যন্ত্রের ভেতর থেকে",
          viewBox: "0 0 300 215",
          height: 215,
          children: <BindPanel open={false} />,
        },
        {
          title: "0.0.0.0:8080",
          sub: "যে কেউ, Firewall পার হলে",
          viewBox: "0 0 300 215",
          height: 215,
          children: <BindPanel open />,
        },
      ]}
      caption="বাঁয়ের App শুধু lo নামের ভেতরের দরজায় বসে আছে, তাই বাইরে থেকে কেউ এলে Kernel সরাসরি না বলে দেয়, Connection refused। Caddy একই যন্ত্রে থাকে বলে ভেতরের দরজা দিয়ে ঠিকই পৌঁছায়। ডানের App সব দরজায় বসেছে, তাই বাইরে থেকে সরাসরি পৌঁছানো যায়। Island Tours এর App, Redis আর PostgreSQL সবাই বাঁয়ের মতো। ডানের মতো যা আছে, তার প্রতিটার পেছনে একটা লিখিত কারণ থাকা চাই।"
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 5. Refused, Timed out, No route: তারে কী ঘটে                                  */
/* ------------------------------------------------------------------------- */

function Lane({
  y,
  title,
  sub,
  children,
}: {
  y: number;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <g>
      <rect x={20} y={y} width={740} height={96} fill="currentColor" fillOpacity={0.025} stroke="currentColor" strokeOpacity={0.25} />
      <SketchText x={34} y={y + 22} size={10} anchor="start" bold accent>
        {title}
      </SketchText>
      <SketchText x={34} y={y + 38} size={8.5} anchor="start" body opacity={0.8}>
        {sub}
      </SketchText>
      {children}
    </g>
  );
}

export function NetdebugWireSplit() {
  const left = 250;
  const right = 700;
  return (
    <Sketch
      label="Diagram: তিনটা ব্যর্থতা, তারে আসলে কী ঘটে"
      height={340}
      minWidth={760}
      viewBox="0 0 780 340"
      caption="তিনটা ছবিই practice server এর tcpdump আর ping থেকে নেওয়া সময় দিয়ে আঁকা। Refused এ উত্তর আসে, শুধু উত্তরটা না, আর আসে প্রায় সাথে সাথে। Timed out এ কোনো উত্তরই আসে না, Laptop একই SYN বারবার পাঠায়, তারপর হাল ছাড়ে। No route এ SYN তারে নামতেই পারে না, কারণ একই Network এ ওই ঠিকানার কাউকে ARP খুঁজে পায় না।"
    >
      <Arrow id="netdebug-wire-arrow" />
      <Arrow id="netdebug-wire-muted" muted />
      {/* column heads */}
      <SketchText x={left} y={18} size={8.5} bold>
        LAPTOP 103.94.135.77
      </SketchText>
      <SketchText x={right} y={18} size={8.5} bold>
        SERVER 103.94.135.2
      </SketchText>

      <Lane y={26} title="REFUSED" sub="কেউ শুনছে না, বা REJECT Rule">
        <line x1={left} y1={52} x2={right} y2={60} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#netdebug-wire-arrow)" />
        <SketchText x={(left + right) / 2} y={50} size={8.5}>
          SYN
        </SketchText>
        <line x1={right} y1={70} x2={left} y2={84} stroke="currentColor" strokeOpacity={0.7} strokeWidth="1.3" markerEnd="url(#netdebug-wire-muted)" />
        <SketchText x={(left + right) / 2} y={94} size={8.5}>
          RST, 0.002 s পরে
        </SketchText>
      </Lane>

      <Lane y={130} title="TIMED OUT" sub="Firewall চুপচাপ ফেলে দেয় (DROP)">
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line
              x1={left}
              y1={150 + i * 16}
              x2={left + 330}
              y2={154 + i * 16}
              stroke="var(--primary)"
              strokeOpacity={1 - i * 0.18}
              strokeWidth="1.3"
              markerEnd="url(#netdebug-wire-arrow)"
            />
            <SketchText x={left + 336} y={157 + i * 16} size={8} anchor="start">
              {`SYN, ${i}s`}
            </SketchText>
          </g>
        ))}
        <SketchText x={right} y={175} size={11} bold opacity={0.7}>
          ✕
        </SketchText>
        <SketchText x={right} y={195} size={8} body opacity={0.75}>
          কোনো উত্তর নেই
        </SketchText>
      </Lane>

      <Lane y={234} title="NO ROUTE" sub="ঠিকানায় কোনো যন্ত্রই নেই">
        <line x1={left} y1={262} x2={left + 200} y2={262} stroke="currentColor" strokeOpacity={0.55} strokeDasharray="4 3" markerEnd="url(#netdebug-wire-muted)" />
        <SketchText x={left + 100} y={256} size={8}>
          ARP: 103.94.135.9 কে?
        </SketchText>
        <SketchText x={left + 100} y={284} size={8} body opacity={0.8}>
          তিনবার জিজ্ঞেস, কেউ সাড়া দেয় না
        </SketchText>
        <line x1={left + 200} y1={300} x2={left} y2={300} stroke="currentColor" strokeOpacity={0.7} markerEnd="url(#netdebug-wire-muted)" />
        <SketchText x={left + 100} y={318} size={8}>
          EHOSTUNREACH, প্রায় 3 s পরে
        </SketchText>
        <SketchText x={right} y={286} size={8.5} body opacity={0.6}>
          103.94.135.9, কেউ নেই
        </SketchText>
      </Lane>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. সাইট খুলছে না: সিদ্ধান্তের গাছ                                              */
/* ------------------------------------------------------------------------- */

function Question({ x, y, w, text, sub }: { x: number; y: number; w: number; text: string; sub: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={42} rx={4} fill="var(--primary)" fillOpacity={0.07} stroke="var(--primary)" strokeOpacity={0.8} strokeWidth="1.2" />
      <SketchText x={x + w / 2} y={y + 17} size={9.5} body bold accent>
        {text}
      </SketchText>
      <SketchText x={x + w / 2} y={y + 33} size={8}>
        {sub}
      </SketchText>
    </g>
  );
}

function Verdict({ x, y, w, text, sub }: { x: number; y: number; w: number; text: string; sub: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={40} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.45} />
      <SketchText x={x + w / 2} y={y + 16} size={8.5} body bold>
        {text}
      </SketchText>
      <SketchText x={x + w / 2} y={y + 31} size={7.5}>
        {sub}
      </SketchText>
    </g>
  );
}

export function NetdebugDecisionTreeDiagram() {
  const qx = 260;
  const qw = 260;
  const vx = 560;
  const vw = 210;
  const rows = [
    {
      y: 46,
      q: "নামটা কি ঠিক IP দেয়?",
      qs: "dig +short islandtours.example",
      v: "না: DNS এর ঘর",
      vs: "Module 04, Record আর TTL দেখুন",
    },
    {
      y: 136,
      q: "Port 443 বাইরে থেকে খোলা?",
      qs: "nc -vz 103.94.135.2 443",
      v: "refused: কেউ শুনছে না",
      vs: "ssh করে systemctl status caddy",
    },
    {
      y: 240,
      q: "TLS Handshake হয়?",
      qs: "openssl s_client -servername ...",
      v: "না: Certificate বা নাম",
      vs: "Module 06 L08, তারিখ আর SAN",
    },
    {
      y: 330,
      q: "Caddy কোন Status দেয়?",
      qs: "curl -sI https://islandtours.example",
      v: "502: App নেই, 504: App ধীর",
      vs: "curl 127.0.0.1:3000/health",
    },
  ];
  return (
    <Sketch
      label="Diagram: সাইট খুলছে না, কোন প্রশ্নের পর কোনটা"
      height={470}
      minWidth={780}
      viewBox="0 0 790 470"
      caption="গাছটা উপর থেকে পড়ুন। প্রতিটা প্রশ্নের হ্যাঁ উত্তর আপনাকে এক ধাপ নিচে নামায়, আর না উত্তর ডান পাশে একটা নির্দিষ্ট ঘরে পাঠায়। Port এর প্রশ্নে দুই রকম না আছে, আর এই দুইটা আলাদা করে চেনাই এই লেসনের সবচেয়ে দামি দক্ষতা: refused মানে কেউ শুনছে না, timed out মানে মাঝপথে কেউ ফেলে দিচ্ছে।"
    >
      <Arrow id="netdebug-tree-arrow" />
      <Arrow id="netdebug-tree-muted" muted />
      <Box x={20} y={50} w={180} h={40} text="সাইট খুলছে না" sub="Browser এ লাল পাতা" accent />
      <line x1={200} y1={70} x2={qx - 4} y2={67} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#netdebug-tree-arrow)" />
      {rows.map((r, i) => {
        const next = rows[i + 1];
        return (
          <g key={r.q}>
            <Question x={qx} y={r.y} w={qw} text={r.q} sub={r.qs} />
            <line x1={qx + qw} y1={r.y + 21} x2={vx - 4} y2={r.y + 21} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.2" markerEnd="url(#netdebug-tree-muted)" />
            <SketchText x={(qx + qw + vx) / 2} y={r.y + 15} size={8} body opacity={0.8}>
              না
            </SketchText>
            <Verdict x={vx} y={r.y + 1} w={vw} text={r.v} sub={r.vs} />
            {next && (
              <>
                <line x1={qx + qw / 2} y1={r.y + 42} x2={qx + qw / 2} y2={next.y - 4} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#netdebug-tree-arrow)" />
                <SketchText x={qx + qw / 2 + 10} y={r.y + 62} size={8} anchor="start" body opacity={0.8}>
                  হ্যাঁ
                </SketchText>
              </>
            )}
          </g>
        );
      })}
      {/* the second kind of "no" on the port question */}
      <Verdict x={vx} y={184} w={vw} text="timed out: পথে কেউ ফেলছে" sub="ufw status, Provider Firewall" />
      <line x1={qx + qw} y1={166} x2={vx - 4} y2={204} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.2" markerEnd="url(#netdebug-tree-muted)" />
      <line x1={qx + qw / 2} y1={372} x2={qx + qw / 2} y2={404} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#netdebug-tree-arrow)" />
      <SketchText x={qx + qw / 2 + 10} y={392} size={8} anchor="start" body opacity={0.8}>
        200
      </SketchText>
      <Verdict x={qx} y={408} w={qw} text="Network ঠিক আছে" sub="App এর Log আর Cache দেখুন (লেসন ০৭)" />
      <SketchText x={110} y={150} size={8.5} body opacity={0.7}>
        প্রথম ধাপ সবসময়
      </SketchText>
      <SketchText x={110} y={164} size={8.5} body opacity={0.7}>
        বাইরে থেকে, নিজের
      </SketchText>
      <SketchText x={110} y={178} size={8.5} body opacity={0.7}>
        Laptop এ
      </SketchText>
    </Sketch>
  );
}
