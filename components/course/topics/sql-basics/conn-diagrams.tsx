import { Sketch, SketchSplit, SketchText } from "../../sketch";

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

function Box({
  x,
  y,
  w,
  h = 44,
  text,
  sub,
  accent,
  dashed,
  size = 10.5,
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
        <SketchText x={x + w / 2} y={y + h / 2 + 13} size={9} body opacity={0.75}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. তিন পক্ষ: Browser, API, Database                                         */
/* ------------------------------------------------------------------------- */

export function ThreeTiersDiagram() {
  return (
    <Sketch
      label="Diagram: একটা বুকিংয়ের পেছনে তিন পক্ষ"
      height={300}
      minWidth={860}
      viewBox="0 0 860 300"
      caption="পর্যটকের Browser কথা বলে শুধু Island Tours এর API এর সাথে, HTTPS দিয়ে। Database এর সাথে কথা বলে শুধু API, নিজের ভাষায়, Port 5432 এ। ডান দিকের ডট দেওয়া ঘরটা Server এর ভেতরের Network: বাইরে থেকে কেউ এখানে Port 5432 খুঁজে পায় না। Browser থেকে Database পর্যন্ত সরাসরি কোনো পথই নেই।"
    >
      <Arrow id="conn-tiers-arrow" />
      <rect
        x={318}
        y={40}
        width={520}
        height={160}
        fill="currentColor"
        fillOpacity={0.02}
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeDasharray="5 4"
      />
      <SketchText x={578} y={60} size={9.5} body opacity={0.7}>
        Server এর ভেতরের Network, বাইরে থেকে 5432 বন্ধ
      </SketchText>

      <Box x={30} y={98} w={170} h={56} text="Browser" sub="পর্যটকের ফোন" />
      <Box x={345} y={98} w={190} h={56} text="Island Tours API" sub="Server এ চলা App" accent />
      <Box x={640} y={98} w={170} h={56} text="PostgreSQL" sub="Database Server" />

      <line
        x1={204}
        y1={126}
        x2={340}
        y2={126}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#conn-tiers-arrow)"
      />
      <SketchText x={272} y={116} size={9.5} bold accent>
        HTTPS · Port 443
      </SketchText>
      <SketchText x={272} y={145} size={9} body opacity={0.75}>
        JSON চাওয়া, JSON পাওয়া
      </SketchText>

      <line
        x1={539}
        y1={126}
        x2={635}
        y2={126}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#conn-tiers-arrow)"
      />
      <SketchText x={587} y={116} size={9.5} bold accent>
        Port 5432
      </SketchText>
      <SketchText x={587} y={145} size={9} body opacity={0.75}>
        SQL Text, ফেরত Row
      </SketchText>

      <path
        d="M 115 160 V 250 H 725 V 160"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeDasharray="4 4"
        strokeWidth="1.2"
      />
      <g stroke="var(--primary)" strokeWidth="2">
        <line x1={408} y1={238} x2={432} y2={262} />
        <line x1={432} y1={238} x2={408} y2={262} />
      </g>
      <SketchText x={420} y={285} size={10} body opacity={0.85}>
        Browser থেকে সরাসরি Database: এই পথ কখনো খোলা থাকে না
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. সরাসরি বনাম API এর মাধ্যমে                                               */
/* ------------------------------------------------------------------------- */

function DirectPanel() {
  return (
    <>
      <Arrow id="conn-direct-arrow" />
      <Box x={20} y={30} w={130} h={56} text="Browser" sub="সবার হাতে" />
      <rect x={38} y={92} width={94} height={22} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeWidth="1" />
      <SketchText x={85} y={107} size={9} bold accent>
        Password
      </SketchText>
      <line
        x1={154}
        y1={58}
        x2={226}
        y2={58}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#conn-direct-arrow)"
      />
      <Box x={230} y={30} w={130} h={56} text="PostgreSQL" sub="Port খোলা" />
      <SketchText x={190} y={150} size={10} body>
        Password যে কেউ DevTools খুলে পড়তে পারে
      </SketchText>
      <SketchText x={190} y={172} size={10} body>
        যে কেউ যেকোনো SQL চালাতে পারে
      </SketchText>
      <SketchText x={190} y={194} size={10} body>
        দাম আর সিটের নিয়ম পাহারা দেওয়ার কেউ নেই
      </SketchText>
      <SketchText x={190} y={216} size={10} body>
        Database এর Port Internet এ খোলা রাখতে হয়
      </SketchText>
    </>
  );
}

function ApiPanel() {
  return (
    <>
      <Arrow id="conn-api-arrow" />
      <Box x={10} y={30} w={100} h={56} text="Browser" sub="শুধু HTTPS" size={10} />
      <line
        x1={113}
        y1={58}
        x2={136}
        y2={58}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#conn-api-arrow)"
      />
      <Box x={140} y={30} w={100} h={56} text="API" sub="নিয়মের পাহারা" accent size={10} />
      <rect x={153} y={92} width={74} height={22} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeWidth="1" />
      <SketchText x={190} y={107} size={9} bold accent>
        Password
      </SketchText>
      <line
        x1={243}
        y1={58}
        x2={266}
        y2={58}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#conn-api-arrow)"
      />
      <Box x={270} y={30} w={100} h={56} text="PostgreSQL" sub="ভেতরে লুকানো" size={10} />
      <SketchText x={190} y={150} size={10} body>
        Password থাকে শুধু Server এর Environment এ
      </SketchText>
      <SketchText x={190} y={172} size={10} body>
        কোন SQL চলবে, তা ঠিক করে API এর Code
      </SketchText>
      <SketchText x={190} y={194} size={10} body>
        দাম, সিট আর অনুমতির নিয়ম এখানেই যাচাই হয়
      </SketchText>
      <SketchText x={190} y={216} size={10} body>
        Database এর Port বাইরে থেকে দেখাই যায় না
      </SketchText>
    </>
  );
}

export function DirectVsApiSplit() {
  return (
    <SketchSplit
      label="Diagram: Browser কেন সরাসরি Database এ যায় না"
      caption="বাম দিকে যে নকশা কেউ বানায় না, ডান দিকে যেটা সবাই বানায়। পার্থক্যটা শুধু একটা মাঝের ঘর নয়: Password কোথায় থাকে, কে ঠিক করে কোন SQL চলবে, আর Database কতটা লুকানো থাকে, তিনটাই বদলে যায়।"
      panels={[
        {
          title: "সরাসরি Database এ",
          sub: "যা কখনো করা হয় না",
          viewBox: "0 0 380 230",
          height: 230,
          minWidth: 340,
          children: <DirectPanel />,
        },
        {
          title: "API এর মাধ্যমে",
          sub: "যেভাবে আসলে হয়",
          viewBox: "0 0 380 230",
          height: 230,
          minWidth: 340,
          children: <ApiPanel />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Connection String এর প্রতিটা টুকরো                                       */
/* ------------------------------------------------------------------------- */

const CHAR_W = 10.2;
const URI_PARTS: { text: string; label?: string; sub?: string; row?: 0 | 1 }[] = [
  { text: "postgres://", label: "Scheme", sub: "কোন ধরনের Database", row: 0 },
  { text: "island_api", label: "User", sub: "কোন নামে ঢুকবেন", row: 1 },
  { text: ":" },
  { text: "CHANGE_ME", label: "Password", sub: "আসলটা কখনো Code এ নয়", row: 0 },
  { text: "@" },
  { text: "db.internal.example", label: "Host", sub: "Server কোথায়", row: 1 },
  { text: ":" },
  { text: "5432", label: "Port", sub: "কোন দরজায়", row: 0 },
  { text: "/" },
  { text: "island_tours", label: "Database", sub: "Server এর কোন Database", row: 1 },
];

const URI_TOTAL = URI_PARTS.reduce((n, p) => n + p.text.length, 0) * CHAR_W;
const URI_START = (860 - URI_TOTAL) / 2;
/** Each part with its x position, laid out once: the string never changes. */
const URI_PLACED = URI_PARTS.map((part, i) => ({
  ...part,
  x: URI_START + URI_PARTS.slice(0, i).reduce((n, p) => n + p.text.length, 0) * CHAR_W,
  w: part.text.length * CHAR_W,
}));

export function ConnectionStringDiagram() {
  const total = URI_TOTAL;
  const placed = URI_PLACED;

  return (
    <Sketch
      label="Diagram: একটা Connection String এর ছয়টা টুকরো"
      height={250}
      minWidth={860}
      viewBox="0 0 860 250"
      caption="এক লাইনের এই ঠিকানায় Driver যা যা জানতে চায় সব আছে: কোন ধরনের Database, কোন নামে ঢুকবেন, কী দিয়ে প্রমাণ দেবেন, Server কোথায়, কোন Port এ, আর সেই Server এর কোন Database। এখানে Password এর জায়গায় CHANGE_ME লেখা, কারণ আসল Password কখনো কোনো লেখায়, Code এ বা Git এ বসে না। আসল String টা থাকে একটা Environment Variable এ।"
    >
      <rect
        x={(860 - total) / 2 - 16}
        y={88}
        width={total + 32}
        height={44}
        fill="currentColor"
        fillOpacity={0.04}
        stroke="currentColor"
        strokeOpacity={0.35}
      />
      {placed.map((part, i) => (
        <text
          key={`t-${i}`}
          x={part.x}
          y={116}
          fontFamily="var(--font-mono), monospace"
          fontSize={17}
          fontWeight={part.label ? 700 : 400}
          fill={part.label ? "var(--primary)" : "currentColor"}
          fillOpacity={part.label ? 1 : 0.55}
          textLength={part.w}
          lengthAdjust="spacingAndGlyphs"
        >
          {part.text}
        </text>
      ))}
      {placed
        .filter((part) => part.label)
        .map((part) => {
          const up = part.row === 0;
          const mid = part.x + part.w / 2;
          const bracketY = up ? 82 : 138;
          const tickY = up ? bracketY - 6 : bracketY + 6;
          return (
            <g key={part.label}>
              <path
                d={`M ${part.x + 1} ${tickY} V ${bracketY} H ${part.x + part.w - 1} V ${tickY}`}
                fill="none"
                stroke="var(--primary)"
                strokeOpacity={0.7}
                strokeWidth="1.2"
              />
              <line
                x1={mid}
                y1={bracketY}
                x2={mid}
                y2={up ? 52 : 168}
                stroke="var(--primary)"
                strokeOpacity={0.5}
                strokeWidth="1"
              />
              <SketchText x={mid} y={up ? 30 : 186} size={10} bold accent>
                {part.label}
              </SketchText>
              <SketchText x={mid} y={up ? 46 : 203} size={9} body opacity={0.8}>
                {part.sub}
              </SketchText>
            </g>
          );
        })}
      <SketchText x={430} y={238} size={9.5} body opacity={0.7}>
        Port না লিখলে PostgreSQL এর Driver ধরে নেয় 5432, MySQL এর Driver ধরে নেয় 3306
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Query এর ভেতরের যাত্রা                                                    */
/* ------------------------------------------------------------------------- */

const STAGES = [
  {
    name: "Parse",
    what: ["ব্যাকরণ ঠিক আছে?", "শব্দগুলো চেনা?"],
    error: 'syntax error at or near "SELEC"',
  },
  {
    name: "Analyze",
    what: ["Table আর Column", "আসলে আছে তো?"],
    error: 'relation "tuors" does not exist',
  },
  {
    name: "Plan",
    what: ["কোন পথে খুঁজলে", "সবচেয়ে কম খাটুনি"],
    error: "এখানে সাধারণত Error হয় না",
  },
  {
    name: "Execute",
    what: ["Disk আর Memory থেকে", "Row তুলে আনা"],
    error: "division by zero",
  },
];

export function QueryPipelineDiagram() {
  const x0 = 134;
  const w = 156;
  const gap = 18;
  return (
    <Sketch
      label="Diagram: Server এর ভেতরে একটা Query এর চার ধাপ"
      height={290}
      minWidth={900}
      viewBox="0 0 900 290"
      caption="Server এর কাছে Query টা প্রথমে শুধু একটা লেখা। Parse ধাপ ব্যাকরণ দেখে, Analyze ধাপ দেখে নামগুলো সত্যিই আছে কিনা, Plan ধাপ খোঁজার পথ বাছে, আর Execute ধাপ আসল কাজটা করে। নিচের লাল লেখাগুলো প্রতিটা ধাপের নিজস্ব Error, এই লেসনের Query বক্সে এগুলো নিজে ঘটিয়ে দেখবেন। PostgreSQL এর Documentation প্রথম দুটো ধাপকে একসাথে Parser Stage বলে, আর View এর জন্য মাঝে একটা Rewrite ধাপও রাখে।"
    >
      <Arrow id="conn-pipe-arrow" />
      <Box x={18} y={70} w={100} h={52} text="SQL Text" sub="App থেকে আসা" />
      <Box x={x0 + 4 * (w + gap)} y={70} w={62} h={52} text="Rows" sub="ফেরত" />
      {STAGES.map((stage, i) => {
        const x = x0 + i * (w + gap);
        return (
          <g key={stage.name}>
            <line
              x1={i === 0 ? 121 : x - gap + 3}
              y1={96}
              x2={x - 4}
              y2={96}
              stroke="var(--primary)"
              strokeWidth="1.4"
              markerEnd="url(#conn-pipe-arrow)"
            />
            <Box x={x} y={70} w={w} h={52} text={stage.name} accent={i === 3} />
            <SketchText x={x + w / 2} y={150} size={10} body>
              {stage.what[0]}
            </SketchText>
            <SketchText x={x + w / 2} y={168} size={10} body>
              {stage.what[1]}
            </SketchText>
            <rect
              x={x}
              y={190}
              width={w}
              height={50}
              fill={i === 2 ? "transparent" : "var(--destructive)"}
              fillOpacity={0.06}
              stroke={i === 2 ? "currentColor" : "var(--destructive)"}
              strokeOpacity={i === 2 ? 0.3 : 0.6}
              strokeDasharray="3 3"
            />
            <SketchText x={x + w / 2} y={206} size={8.5} bold opacity={0.7}>
              ERROR
            </SketchText>
            <text
              x={x + w / 2}
              y={226}
              textAnchor="middle"
              fontFamily={i === 2 ? "var(--font-sans), sans-serif" : "var(--font-mono), monospace"}
              fontSize={i === 2 ? 9.5 : 8}
              fill={i === 2 ? "currentColor" : "var(--destructive)"}
              fillOpacity={i === 2 ? 0.7 : 1}
            >
              {stage.error}
            </text>
          </g>
        );
      })}
      <line
        x1={x0 + 3 * (w + gap) + w + 4}
        y1={96}
        x2={x0 + 4 * (w + gap) - 4}
        y2={96}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#conn-pipe-arrow)"
      />
      <SketchText x={450} y={272} size={9.5} body opacity={0.7}>
        যে ধাপে ভুল ধরা পড়ে, Query সেখানেই থেমে যায়, পরের ধাপে আর যায় না
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. তারের উপর বার্তাগুলো                                                       */
/* ------------------------------------------------------------------------- */

const MESSAGES: { dir: "out" | "in" | "both"; name: string; note: string }[] = [
  { dir: "out", name: "StartupMessage", note: "আমি island_api, island_tours Database চাই" },
  { dir: "in", name: "AuthenticationSASL", note: "প্রমাণ দিন, SCRAM-SHA-256 দিয়ে" },
  { dir: "both", name: "SCRAM এর কয়েক দফা", note: "Password না পাঠিয়েই তার প্রমাণ" },
  { dir: "in", name: "AuthenticationOk", note: "প্রমাণ মিলেছে" },
  { dir: "in", name: "ParameterStatus, BackendKeyData", note: "Server এর কিছু তথ্য" },
  { dir: "in", name: "ReadyForQuery", note: "এবার Query পাঠাতে পারেন" },
  { dir: "out", name: "Query", note: "SELECT title, price_bdt FROM tours ..." },
  { dir: "in", name: "RowDescription", note: "Column গুলোর নাম আর Type" },
  { dir: "in", name: "DataRow × 3", note: "প্রতিটা Row আলাদা একটা বার্তায়" },
  { dir: "in", name: "CommandComplete", note: "SELECT 3" },
  { dir: "in", name: "ReadyForQuery", note: "পরের Query এর জন্য তৈরি" },
  { dir: "out", name: "Terminate", note: "বিদায়, Connection বন্ধ" },
];

export function MessageLadderDiagram() {
  const left = 170;
  const right = 590;
  const top = 98;
  const step = 40;
  return (
    <Sketch
      label="Diagram: একটা Connection এর জীবনে তারের উপর যা যায়"
      height={600}
      minWidth={760}
      viewBox="0 0 760 600"
      caption="PostgreSQL এর নিজের ভাষাকে বলে Frontend/Backend Protocol। প্রতিটা বার্তার একটা নাম আছে, আর Driver ঠিক এই নামগুলোই পাঠায় আর বোঝে। লক্ষ করুন, Query টা যায় একটা সাধারণ লেখা হিসেবে, আর উত্তর আসে কয়েক টুকরোয়: আগে Column এর বর্ণনা, তারপর প্রতিটা Row আলাদা বার্তায়, শেষে একটা হিসাব। TLS চালু থাকলে এই সবগুলো বার্তা Encrypt হয়ে যায়।"
    >
      <Arrow id="conn-ladder-arrow" />
      <SketchText x={left} y={28} size={11} bold>
        App (Client)
      </SketchText>
      <SketchText x={left} y={44} size={9} body opacity={0.7}>
        pg Driver সহ Node.js
      </SketchText>
      <SketchText x={right} y={28} size={11} bold accent>
        PostgreSQL (Server)
      </SketchText>
      <SketchText x={right} y={44} size={9} body opacity={0.7}>
        এই Connection এর নিজস্ব Process
      </SketchText>
      <line x1={left} y1={56} x2={left} y2={585} stroke="currentColor" strokeOpacity={0.4} strokeWidth="1.2" />
      <line x1={right} y1={56} x2={right} y2={585} stroke="var(--primary)" strokeOpacity={0.6} strokeWidth="1.2" />

      <rect x={left} y={62} width={right - left} height={22} fill="currentColor" fillOpacity={0.06} />
      <SketchText x={(left + right) / 2} y={77} size={9.5} body opacity={0.8}>
        আগে TCP Handshake, তারপর চাইলে SSLRequest আর TLS
      </SketchText>

      {MESSAGES.map((m, i) => {
        const y = top + i * step + 12;
        const fromX = m.dir === "in" ? right - 4 : left + 4;
        const toX = m.dir === "in" ? left + 4 : right - 4;
        return (
          <g key={`${m.name}-${i}`}>
            {m.dir === "both" ? (
              <>
                <line x1={left + 4} y1={y - 3} x2={right - 4} y2={y - 3} stroke="var(--primary)" strokeOpacity={0.6} strokeWidth="1.2" strokeDasharray="5 3" markerEnd="url(#conn-ladder-arrow)" />
                <line x1={right - 4} y1={y + 3} x2={left + 4} y2={y + 3} stroke="var(--primary)" strokeOpacity={0.6} strokeWidth="1.2" strokeDasharray="5 3" markerEnd="url(#conn-ladder-arrow)" />
              </>
            ) : (
              <line x1={fromX} y1={y} x2={toX} y2={y} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#conn-ladder-arrow)" />
            )}
            <SketchText x={(left + right) / 2} y={y - 6} size={9.5} bold accent={m.name === "Query"}>
              {m.name}
            </SketchText>
            <SketchText x={(left + right) / 2} y={y + 15} size={9} body opacity={0.8}>
              {m.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
