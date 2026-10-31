/**
 * What: The still pictures for the Full HTTPS Journey lesson: the whole map, who can read what,
 * the round trips of a cold visit, what Caddy changes on the way in, and how the rest of a page
 * loads over one connection.
 *
 * Why: This lesson joins the whole module into one request, and a learner holds a journey far
 * better as a picture than as a list. Each drawing uses the same scenario values as Module 05, so
 * the numbers the reader already knows appear in the same places here.
 */
import { toBn } from "@/lib/utils";
import { Sketch, SketchText } from "../../sketch";

function Arrow({ id }: { id: string }) {
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
        <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--primary)" />
      </marker>
    </defs>
  );
}

function Node({
  x,
  y,
  w,
  h,
  title,
  sub,
  accent,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  accent?: boolean;
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
      <SketchText x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} size={10} bold body accent={accent}>
        {title}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 13} size={8.5} opacity={0.75}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

function Num({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill="var(--primary)" fillOpacity={0.14} stroke="var(--primary)" strokeWidth="1.2" />
      <SketchText x={x} y={y + 4} size={10} bold accent body>
        {toBn(n)}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. পুরো যাত্রা, এক ছবিতে                                                   */
/* ------------------------------------------------------------------------- */

export function JourneyMapDiagram() {
  return (
    <Sketch
      label="Diagram: একটা HTTPS Request এর পুরো মানচিত্র"
      height={440}
      minWidth={900}
      viewBox="0 0 960 440"
      caption="বাঁ থেকে ডানে একটা Request এর পথ, আর প্রতিটা বৃত্তের সংখ্যা একটা ধাপ। ১, Browser নিজের ভেতরেই URL পড়ে আর HSTS তালিকা দেখে (লেসন ০১, ০৭)। ২, DNS Resolver এর কাছ থেকে IP আনে (Module 04)। ৩, ৪ আর ৫, একই TCP Connection এ পরপর TCP Handshake, TLS Handshake আর HTTP/2 Request, ফোন থেকে Caddy পর্যন্ত (Module 05, লেসন ০২ থেকে ০৮)। ৬, Caddy তালা খুলে Request টা একই যন্ত্রের ভেতরে App কে দেয় (লেসন ০৪)। ৭, App Session আর Data আনে (লেসন ০৬)। ৮, উত্তর একই পথে উল্টো দিকে ফেরে। ডান দিকের বড় ডোরাকাটা বাক্সটা একটাই যন্ত্র, Island Tours এর Server।"
    >
      <Arrow id="journey-map-a" />

      {/* the server outline */}
      <rect x={600} y={30} width={345} height={390} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeDasharray="5 4" />
      <SketchText x={772} y={52} size={9.5} bold>
        Island Tours Server, 103.94.135.2
      </SketchText>

      <Node x={20} y={50} w={160} h={56} title="DNS Resolver" sub="Module 04" />
      <Node x={20} y={200} w={160} h={64} title="পর্যটকের ফোন, Browser" sub="192.168.1.20:51514" accent />
      <Node x={230} y={200} w={150} h={64} title="বাসার Router, NAT" sub="203.0.113.25:62001" />
      <Node x={430} y={200} w={130} h={64} title="ISP আর মাঝের Hop" sub="Module 02" dashed />
      <Node x={620} y={200} w={140} h={64} title="Caddy" sub=":443, TLS এখানে শেষ" />
      <Node x={790} y={200} w={135} h={64} title="App" sub="127.0.0.1:3000" />
      <Node x={790} y={296} w={135} h={40} title="Redis, Session" />
      <Node x={790} y={362} w={135} h={40} title="PostgreSQL, Tour" />
      <SketchText x={652} y={284} size={8.5} anchor="start" body opacity={0.75}>
        Let&apos;s Encrypt Certificate
      </SketchText>

      {/* DNS */}
      <line x1={100} y1={198} x2={100} y2={110} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#journey-map-a)" />
      <Num x={100} y={153} n={2} />
      <SketchText x={116} y={157} size={9} anchor="start" bold accent>
        DNS
      </SketchText>

      {/* main path */}
      {[
        [180, 230],
        [380, 430],
        [560, 620],
        [760, 790],
      ].map(([a, b]) => (
        <line key={a} x1={a + 2} y1={232} x2={b - 3} y2={232} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#journey-map-a)" />
      ))}

      {/* 3, 4, 5 share one connection, phone to Caddy */}
      <line x1={196} y1={150} x2={616} y2={150} stroke="currentColor" strokeOpacity={0.5} />
      <line x1={196} y1={144} x2={196} y2={156} stroke="currentColor" strokeOpacity={0.5} />
      <line x1={616} y1={144} x2={616} y2={156} stroke="currentColor" strokeOpacity={0.5} />
      <Num x={250} y={150} n={3} />
      <SketchText x={250} y={133} size={9} bold accent>
        TCP Handshake
      </SketchText>
      <Num x={400} y={150} n={4} />
      <SketchText x={400} y={133} size={9} bold accent>
        TLS Handshake
      </SketchText>
      <Num x={545} y={150} n={5} />
      <SketchText x={545} y={133} size={9} bold accent>
        HTTP/2 Request
      </SketchText>
      <SketchText x={400} y={178} size={8.5} body opacity={0.75}>
        তিনটাই ফোন থেকে Caddy পর্যন্ত, একটাই TCP Connection এ, পরপর
      </SketchText>

      {/* 1 inside the browser */}
      <Num x={34} y={292} n={1} />
      <SketchText x={50} y={296} size={9} anchor="start" body>
        URL পড়া, HSTS দেখা
      </SketchText>

      {/* 6 Caddy to app */}
      <Num x={775} y={186} n={6} />

      {/* 7 app to data */}
      <line x1={857} y1={266} x2={857} y2={292} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#journey-map-a)" />
      <polyline points="925,244 937,244 937,382 929,382" fill="none" stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#journey-map-a)" />
      <Num x={877} y={280} n={7} />

      {/* 8 the way back */}
      <polyline points="636,266 636,350 160,350 160,270" fill="none" stroke="var(--primary)" strokeWidth="1.4" strokeDasharray="5 4" markerEnd="url(#journey-map-a)" />
      <Num x={300} y={350} n={8} />
      <SketchText x={318} y={372} size={9} anchor="start" body>
        Response ফেরে একই পথে, উল্টো দিকে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. পথের কে কী পড়তে পারে                                                    */
/* ------------------------------------------------------------------------- */

type Seen = "yes" | "no" | "part";

const VIS_COLUMNS = [
  { x: 400, title: "Wi-Fi, Router, ISP, Hop", sub: "TLS এর বাইরে" },
  { x: 600, title: "Caddy", sub: "এখানে তালা খোলে" },
  { x: 790, title: "App", sub: "127.0.0.1:3000" },
];

const VIS_ROWS: { label: string; cells: [Seen, string][] }[] = [
  {
    label: "IP আর Port",
    cells: [
      ["yes", "203.0.113.25:62001"],
      ["yes", "Socket থেকে"],
      ["part", "শুধু 127.0.0.1"],
    ],
  },
  {
    label: "Domain নাম",
    cells: [
      ["yes", "SNI তে খোলা"],
      ["yes", "SNI আর Host"],
      ["yes", "Host Header এ"],
    ],
  },
  {
    label: "Path আর Query",
    cells: [
      ["no", "তালাবন্ধ"],
      ["yes", "/tours/saint-martin"],
      ["yes", "পুরোটা"],
    ],
  },
  {
    label: "Cookie আর বাকি Header",
    cells: [
      ["no", "তালাবন্ধ"],
      ["yes", "পুরোটা"],
      ["yes", "পুরোটা"],
    ],
  },
  {
    label: "Body, বুকিংয়ের তথ্য",
    cells: [
      ["no", "তালাবন্ধ"],
      ["yes", "পুরোটা"],
      ["yes", "পুরোটা"],
    ],
  },
  {
    label: "আকার আর সময়",
    cells: [
      ["yes", "কত Byte, কখন"],
      ["yes", "দেখে"],
      ["yes", "দেখে"],
    ],
  },
  {
    label: "পর্যটকের Public IP",
    cells: [
      ["yes", "Packet এ লেখা"],
      ["yes", "Socket থেকে"],
      ["part", "X-Forwarded-For থেকে"],
    ],
  },
];

function Mark({ x, y, seen }: { x: number; y: number; seen: Seen }) {
  const text = seen === "yes" ? "✓" : seen === "no" ? "✕" : "আংশিক";
  return (
    <SketchText x={x} y={y} size={seen === "part" ? 9 : 13} bold accent={seen !== "no"} opacity={seen === "no" ? 0.55 : undefined} body={seen === "part"}>
      {text}
    </SketchText>
  );
}

export function VisibilityDiagram() {
  const top = 92;
  const step = 40;
  return (
    <Sketch
      label="Diagram: পথের কে কী পড়তে পারে"
      height={400}
      minWidth={860}
      viewBox="0 0 900 400"
      caption="প্রতিটা সারি একটা তথ্য, প্রতিটা কলাম পথের একজন। ✓ মানে সে এটা পড়তে পারে, ✕ মানে তার কাছে এটা শুধু তালাবন্ধ Byte। ডোরাকাটা দাগটা TLS এর দেয়াল। দেয়ালের বাঁ পাশের সবাই, মানে ক্যাফের Wi-Fi, বাসার Router, ISP আর মাঝের প্রতিটা Hop, জানে কে কার সাথে কথা বলছে, কোন Domain, কত Byte আর কখন। কিন্তু কোন পাতা, কোন Cookie, কী বুকিং, সেটা জানে না। Caddy হলো প্রথম জায়গা যেখানে পুরোটা পড়া যায়। আর App এর কাছে পর্যটকের আসল IP পৌঁছায় শুধু Caddy এর বসানো Header দিয়ে, কারণ App এর Socket এ ওপাশে বসে আছে Caddy নিজে।"
    >
      <rect x={20} y={20} width={860} height={44} fill="currentColor" fillOpacity={0.05} />
      <SketchText x={40} y={47} size={10} anchor="start" bold body>
        কোন তথ্য
      </SketchText>
      {VIS_COLUMNS.map((c) => (
        <g key={c.title}>
          <SketchText x={c.x} y={39} size={10} bold body accent={c.title === "Caddy"}>
            {c.title}
          </SketchText>
          <SketchText x={c.x} y={55} size={8.5} body opacity={0.7}>
            {c.sub}
          </SketchText>
        </g>
      ))}

      <line x1={500} y1={20} x2={500} y2={top + step * VIS_ROWS.length - 12} stroke="var(--primary)" strokeOpacity={0.8} strokeDasharray="5 4" />
      <SketchText x={500} y={384} size={9} bold accent body>
        TLS এর দেয়াল
      </SketchText>

      {VIS_ROWS.map((row, i) => {
        const y = top + i * step;
        return (
          <g key={row.label}>
            <line x1={20} y1={y + 20} x2={880} y2={y + 20} stroke="currentColor" strokeOpacity={0.12} />
            <SketchText x={40} y={y + 4} size={10} anchor="start" body>
              {row.label}
            </SketchText>
            {row.cells.map(([seen, note], j) => (
              <g key={j}>
                <Mark x={VIS_COLUMNS[j].x} y={y} seen={seen} />
                <SketchText x={VIS_COLUMNS[j].x} y={y + 14} size={8} body opacity={0.7}>
                  {note}
                </SketchText>
              </g>
            ))}
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. প্রথম Byte এর আগে কতবার আসা যাওয়া                                       */
/* ------------------------------------------------------------------------- */

const TRIPS: { y: number; dir: "toResolver" | "fromResolver" | "toServer" | "fromServer"; text: string }[] = [
  { y: 96, dir: "toResolver", text: "islandtours.example এর A কত?" },
  { y: 126, dir: "fromResolver", text: "103.94.135.2" },
  { y: 176, dir: "toServer", text: "SYN" },
  { y: 206, dir: "fromServer", text: "SYN-ACK" },
  { y: 246, dir: "toServer", text: "ACK, সাথে ClientHello (SNI, ALPN h2, Key Share)" },
  { y: 276, dir: "fromServer", text: "ServerHello, Certificate, CertificateVerify, Finished" },
  { y: 316, dir: "toServer", text: "Finished, সাথে GET /tours/saint-martin" },
  { y: 392, dir: "fromServer", text: "HTTP/2 200, HTML এর প্রথম Byte" },
];

const BRACKETS = [
  { y1: 96, y2: 126, title: "RTT ১", sub: "DNS, Resolver পর্যন্ত" },
  { y1: 176, y2: 206, title: "RTT ২", sub: "TCP" },
  { y1: 246, y2: 276, title: "RTT ৩", sub: "TLS 1.3" },
  { y1: 316, y2: 392, title: "RTT ৪", sub: "HTTP আর Server এর সময়" },
];

export function ColdRoundTripsDiagram() {
  const phone = 130;
  const resolver = 420;
  const server = 740;
  return (
    <Sketch
      label="Diagram: প্রথমবার, প্রথম Byte এর আগে চারটা আসা যাওয়া"
      height={470}
      minWidth={900}
      viewBox="0 0 960 470"
      caption="একদম প্রথমবার পাতা খুললে প্রথম Byte আসার আগে চারবার যাওয়া আসা করতে হয়, যার প্রতিটার নাম Round Trip বা RTT। প্রথমটা DNS, তবে সেটা Resolver পর্যন্ত, তাই সাধারণত ছোট। পরের তিনটা পুরো পথ পাড়ি দেয়, ফোন থেকে Server পর্যন্ত। খেয়াল করুন, TCP এর শেষ ACK এর সাথেই ClientHello চলে যায়, আর TLS এর শেষ Finished এর সাথেই HTTP Request, তাই কোনো ধাপ আলাদা একটা পুরো RTT নষ্ট করে না। ফোন থেকে Server এর RTT যদি 40 ms হয়, শুধু আসা যাওয়াতেই প্রায় 120 ms চলে যায়, DNS আর Server এর ভাবার সময় বাদ দিয়েই।"
    >
      <Arrow id="journey-rtt-a" />
      <Node x={phone - 80} y={24} w={160} h={40} title="ফোন" sub="192.168.1.20" accent />
      <Node x={resolver - 70} y={24} w={140} h={40} title="Resolver" />
      <Node x={server - 80} y={24} w={160} h={40} title="Caddy" sub="103.94.135.2:443" />

      <line x1={phone} y1={66} x2={phone} y2={430} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={resolver} y1={66} x2={resolver} y2={134} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <SketchText x={resolver} y={147} size={8} body opacity={0.6}>
        এরপর Resolver এর কাজ শেষ
      </SketchText>
      <line x1={server} y1={66} x2={server} y2={430} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />

      {TRIPS.map((t) => {
        const right = t.dir === "toResolver" || t.dir === "toServer";
        const far = t.dir === "toResolver" || t.dir === "fromResolver" ? resolver : server;
        const from = right ? phone + 4 : far - 4;
        const to = right ? far - 6 : phone + 6;
        return (
          <g key={t.y}>
            <line x1={from} y1={t.y} x2={to} y2={t.y} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#journey-rtt-a)" />
            <SketchText x={(phone + far) / 2} y={t.y - 7} size={9} bold={t.text.length < 14} body>
              {t.text}
            </SketchText>
          </g>
        );
      })}

      <rect x={server - 64} y={330} width={128} height={48} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeOpacity={0.6} />
      <SketchText x={server} y={351} size={8.5} body>
        App ভাবছে
      </SketchText>
      <SketchText x={server} y={366} size={8.5} body opacity={0.75}>
        Redis, PostgreSQL
      </SketchText>

      {BRACKETS.map((b) => (
        <g key={b.title}>
          <line x1={830} y1={b.y1} x2={830} y2={b.y2} stroke="var(--primary)" strokeWidth="1.2" />
          <line x1={824} y1={b.y1} x2={830} y2={b.y1} stroke="var(--primary)" strokeWidth="1.2" />
          <line x1={824} y1={b.y2} x2={830} y2={b.y2} stroke="var(--primary)" strokeWidth="1.2" />
          <SketchText x={840} y={(b.y1 + b.y2) / 2} size={9.5} anchor="start" bold accent body>
            {b.title}
          </SketchText>
          <SketchText x={840} y={(b.y1 + b.y2) / 2 + 13} size={8} anchor="start" body opacity={0.75}>
            {b.sub}
          </SketchText>
        </g>
      ))}

      <SketchText x={phone + 8} y={418} size={9} anchor="start" bold accent body>
        এই মুহূর্তটার নাম Time to First Byte, বা TTFB
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Caddy এর দুই পাশ                                                        */
/* ------------------------------------------------------------------------- */

function Lock({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 5},${y} v-5 a5,5 0 0 1 10,0 v5`} fill="none" stroke="var(--primary)" strokeWidth="1.4" />
      <rect x={x - 8} y={y} width={16} height={11} fill="var(--primary)" fillOpacity={0.2} stroke="var(--primary)" strokeWidth="1.2" />
    </g>
  );
}

const ADDED_HEADERS = [
  "X-Forwarded-For: 203.0.113.25",
  "X-Forwarded-Proto: https",
  "X-Forwarded-Host: islandtours.example",
  "X-Request-Id: প্রতি Request এ নতুন",
];

export function CaddyHopDiagram() {
  return (
    <Sketch
      label="Diagram: Caddy এর বাইরের পাশ আর ভেতরের পাশ"
      height={320}
      minWidth={880}
      viewBox="0 0 900 320"
      caption="Caddy একটা দরজা, যার দুই পাশে দুই রকম কথা চলে। বাইরের পাশে ফোনের সাথে TLS আর HTTP/2, যেটা পথের কেউ পড়তে পারে না। ভেতরের পাশে App এর সাথে সাধারণ HTTP/1.1, তালা ছাড়া, কারণ এই পথটা এই যন্ত্রের বাইরেই যায় না, 127.0.0.1 এর ভেতরেই থাকে। Request টা ভেতরে পাঠানোর আগে Caddy নিচের চারটা Header বসিয়ে দেয়, যাতে App জানতে পারে আসল পর্যটক কে আর তিনি HTTPS দিয়ে এসেছিলেন। Host Header টা Caddy বদলায় না, যেমন এসেছিল তেমনই যায়।"
    >
      <Arrow id="journey-caddy-a" />
      <Node x={20} y={110} w={150} h={60} title="ফোন, Browser" sub="Caddy দেখে 203.0.113.25" accent />
      <line x1={172} y1={140} x2={356} y2={140} stroke="var(--primary)" strokeWidth="3" markerEnd="url(#journey-caddy-a)" />
      <Lock x={264} y={112} />
      <SketchText x={264} y={160} size={9} bold accent>
        TLS 1.3, HTTP/2
      </SketchText>
      <SketchText x={264} y={176} size={8.5} body opacity={0.75}>
        পথের সবার কাছে তালাবন্ধ
      </SketchText>

      <rect x={360} y={90} width={170} height={100} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={445} y={118} size={11} bold accent>
        Caddy
      </SketchText>
      <SketchText x={445} y={136} size={8.5} opacity={0.8}>
        103.94.135.2:443
      </SketchText>
      <SketchText x={445} y={156} size={8.5} body opacity={0.8}>
        Certificate আর Private Key
      </SketchText>
      <SketchText x={445} y={171} size={8.5} body opacity={0.8}>
        এখানে থাকে
      </SketchText>

      <line x1={532} y1={140} x2={696} y2={140} stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.6" strokeDasharray="6 4" markerEnd="url(#journey-caddy-a)" />
      <SketchText x={614} y={128} size={9} bold>
        HTTP/1.1, তালা ছাড়া
      </SketchText>
      <SketchText x={614} y={160} size={8.5} body opacity={0.75}>
        একই যন্ত্রের ভেতরে
      </SketchText>
      <Node x={700} y={110} w={180} h={60} title="App" sub="127.0.0.1:3000" />

      <rect x={540} y={200} width={340} height={104} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.35} />
      <SketchText x={556} y={222} size={9} anchor="start" bold body>
        ভেতরে যাওয়ার আগে Caddy যা বসায়
      </SketchText>
      {ADDED_HEADERS.map((h, i) => (
        <SketchText key={h} x={556} y={244 + i * 16} size={9} anchor="start" accent={i < 3} body={i === 3}>
          {h}
        </SketchText>
      ))}

      <SketchText x={264} y={232} size={8.5} body opacity={0.8}>
        বাইরে থেকে কেউ নিজের বানানো
      </SketchText>
      <SketchText x={264} y={247} size={8.5} body opacity={0.8}>
        X-Forwarded-For পাঠালে, Caddy
      </SketchText>
      <SketchText x={264} y={262} size={8.5} body opacity={0.8}>
        সেটা ফেলে দিয়ে নিজেরটা বসায়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. পাতার বাকি সব, একটাই Connection এ                                       */
/* ------------------------------------------------------------------------- */

const MS_TO_X = (ms: number) => 250 + ms * 1.6;

const WATERFALL: {
  label: string;
  sub: string;
  start: number;
  end: number;
  kind: "setup" | "stream" | "cache" | "later";
}[] = [
  { label: "Connection তৈরি", sub: "DNS, TCP, TLS", start: 0, end: 115, kind: "setup" },
  { label: "HTML", sub: "/tours/saint-martin, Stream 1", start: 118, end: 230, kind: "stream" },
  { label: "CSS", sub: "/_next/static/css/…", start: 232, end: 232, kind: "cache" },
  { label: "JavaScript", sub: "/_next/static/chunks/…, Stream 3", start: 234, end: 300, kind: "stream" },
  { label: "ছবি", sub: "saint-martin.webp, Stream 5", start: 234, end: 330, kind: "stream" },
  { label: "আসনের তথ্য", sub: "/api/tours/saint-martin/seats, Stream 7", start: 305, end: 360, kind: "stream" },
  { label: "Live আসন", sub: "wss://islandtours.example/ws", start: 362, end: 390, kind: "later" },
];

export function PageLoadDiagram() {
  const top = 70;
  const step = 38;
  return (
    <Sketch
      label="Diagram: HTML এর পরে পাতার বাকি সব"
      height={380}
      minWidth={980}
      viewBox="0 0 1010 380"
      caption="প্রথম সারিটা Connection বানানোর খরচ, যা একবারই দেওয়া হয়। তারপর HTML আসে Stream 1 এ। HTML পড়ে Browser জানে আর কী কী লাগবে। CSS টা আগের দিনের Cache এ ছিল, তাই তার জন্য কোনো Request ই যায়নি। JavaScript আর ছবি একসাথে চলেছে, একই Connection এর আলাদা Stream এ, কারণ HTTP/2 একটা Connection এ অনেক কথা পাশাপাশি চালাতে পারে। আসনের তথ্য চাওয়া হয়েছে JavaScript চলার পরে। কোনো সারিতেই নতুন DNS, TCP বা TLS নেই। শেষ সারির Live আসন পরের লেসনের বিষয়। সময়গুলো বোঝানোর জন্য সাজানো, RTT 40 ms ধরে।"
    >
      {[0, 100, 200, 300, 400].map((ms) => (
        <g key={ms}>
          <line x1={MS_TO_X(ms)} y1={top - 30} x2={MS_TO_X(ms)} y2={top + step * WATERFALL.length - 10} stroke="currentColor" strokeOpacity={0.12} />
          <SketchText x={MS_TO_X(ms)} y={top - 36} size={8.5} opacity={0.7}>
            {`${ms} ms`}
          </SketchText>
        </g>
      ))}

      {WATERFALL.map((row, i) => {
        const y = top + i * step;
        const x1 = MS_TO_X(row.start);
        const x2 = MS_TO_X(row.end);
        return (
          <g key={row.label}>
            <SketchText x={20} y={y + 4} size={10} anchor="start" bold body>
              {row.label}
            </SketchText>
            <SketchText x={20} y={y + 17} size={8} anchor="start" opacity={0.7}>
              {row.sub}
            </SketchText>
            {row.kind === "setup" && (
              <>
                <rect x={MS_TO_X(0)} y={y - 8} width={MS_TO_X(30) - MS_TO_X(0)} height={16} fill="currentColor" fillOpacity={0.15} />
                <rect x={MS_TO_X(30)} y={y - 8} width={MS_TO_X(70) - MS_TO_X(30)} height={16} fill="currentColor" fillOpacity={0.28} />
                <rect x={MS_TO_X(70)} y={y - 8} width={MS_TO_X(115) - MS_TO_X(70)} height={16} fill="var(--primary)" fillOpacity={0.3} />
                <SketchText x={MS_TO_X(15)} y={y + 4} size={8}>
                  DNS
                </SketchText>
                <SketchText x={MS_TO_X(50)} y={y + 4} size={8}>
                  TCP
                </SketchText>
                <SketchText x={MS_TO_X(92)} y={y + 4} size={8}>
                  TLS
                </SketchText>
              </>
            )}
            {row.kind === "stream" && (
              <rect x={x1} y={y - 8} width={x2 - x1} height={16} fill="var(--primary)" fillOpacity={0.55} />
            )}
            {row.kind === "cache" && (
              <>
                <circle cx={x1} cy={y} r={5} fill="none" stroke="var(--primary)" strokeWidth="1.4" />
                <SketchText x={x1 + 12} y={y + 4} size={8.5} anchor="start" body>
                  Cache থেকে, Request ই যায়নি
                </SketchText>
              </>
            )}
            {row.kind === "later" && (
              <>
                <rect x={x1} y={y - 8} width={x2 - x1} height={16} fill="none" stroke="var(--primary)" strokeDasharray="4 3" />
                <SketchText x={x1 - 8} y={y + 4} size={8.5} anchor="end" body>
                  লেসন ১০
                </SketchText>
              </>
            )}
          </g>
        );
      })}

      <line x1={905} y1={top + step - 10} x2={905} y2={top + step * 5 + 10} stroke="var(--primary)" strokeWidth="1.2" />
      <line x1={899} y1={top + step - 10} x2={905} y2={top + step - 10} stroke="var(--primary)" strokeWidth="1.2" />
      <line x1={899} y1={top + step * 5 + 10} x2={905} y2={top + step * 5 + 10} stroke="var(--primary)" strokeWidth="1.2" />
      {["Stream 1 থেকে 7", "সব একই TCP", "Connection এ"].map((line, i) => (
        <SketchText key={line} x={915} y={top + step * 3 - 10 + i * 14} size={8.5} anchor="start" body accent bold>
          {line}
        </SketchText>
      ))}
    </Sketch>
  );
}
