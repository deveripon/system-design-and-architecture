/**
 * What: The static drawings for the Session vs JWT lesson: the two kinds of
 * proof, the login moment, a session lookup, session fixation, the three parts
 * of a JWT, the two ways to sign one, and the access plus refresh timeline.
 *
 * Why: Each idea here is a picture of who holds what and who checks what, and
 * a reader understands that faster from boxes and arrows than from a sentence.
 * They are plain SVG with theme colours, so both themes work with no hex value.
 */
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
  h = 34,
  text,
  accent,
  size = 9.5,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
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
      <SketchText x={x + w / 2} y={y + h / 2 + 4} size={size} bold accent={accent}>
        {text}
      </SketchText>
    </g>
  );
}

function Line({
  x1,
  y1,
  x2,
  y2,
  marker,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  marker: string;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--primary)"
      strokeWidth="1.4"
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd={`url(#${marker})`}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 1. দুই রকম প্রমাণ: ক্লোকরুমের টোকেন আর সিল মারা পাস                        */
/* ------------------------------------------------------------------------- */

function CoatCheck() {
  return (
    <>
      <Arrow id="session-proof-a" />
      <Box x={14} y={20} w={96} h={56} text="টোকেন 7Q" accent size={10} />
      <SketchText x={62} y={96} size={8} body opacity={0.75}>
        শুধু একটা নম্বর
      </SketchText>
      <Line x1={114} y1={48} x2={164} y2={48} marker="session-proof-a" />
      <rect x={170} y={14} width={116} height={124} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <SketchText x={228} y={32} size={9} bold>
        কাউন্টারের খাতা
      </SketchText>
      {[
        { y: 56, text: "3K  →  usr_17" },
        { y: 78, text: "7Q  →  usr_42", accent: true },
        { y: 100, text: "9B  →  usr_88" },
      ].map((row) => (
        <SketchText key={row.text} x={228} y={row.y} size={9} bold={row.accent} accent={row.accent}>
          {row.text}
        </SketchText>
      ))}
      <SketchText x={228} y={124} size={7.5} body opacity={0.7}>
        লাইন কাটলেই টোকেন অচল
      </SketchText>
      <SketchText x={150} y={170} size={8.5} body opacity={0.8}>
        প্রতিবার খাতা দেখে চিনতে হয়
      </SketchText>
      <SketchText x={150} y={188} size={8.5} body opacity={0.8}>
        এটাই Server Session
      </SketchText>
    </>
  );
}

function SealedPass() {
  return (
    <>
      <Arrow id="session-proof-b" />
      <rect x={14} y={14} width={150} height={124} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={89} y={34} size={9} bold accent>
        প্রবেশ পাস
      </SketchText>
      {["নাম: usr_42", "ভূমিকা: customer", "মেয়াদ: 10:15 পর্যন্ত"].map((t, i) => (
        <SketchText key={t} x={26} y={58 + i * 20} size={8.5} anchor="start" body>
          {t}
        </SketchText>
      ))}
      <circle cx={140} cy={116} r={13} fill="none" stroke="var(--primary)" strokeWidth="1.5" />
      <SketchText x={140} y={120} size={8} bold accent>
        সিল
      </SketchText>
      <Line x1={168} y1={76} x2={206} y2={76} marker="session-proof-b" />
      <Box x={212} y={56} w={78} h={40} text="প্রহরী" size={9.5} />
      <SketchText x={251} y={116} size={7.5} body opacity={0.7}>
        সিল আসল তো?
      </SketchText>
      <SketchText x={150} y={170} size={8.5} body opacity={0.8}>
        খাতা লাগে না, পাসেই সব লেখা
      </SketchText>
      <SketchText x={150} y={188} size={8.5} body opacity={0.8}>
        এটাই JWT
      </SketchText>
    </>
  );
}

export function ProofTypesSplit() {
  return (
    <SketchSplit
      label="Diagram: Login এর পরের প্রমাণ, দুই রকম"
      caption="বাঁ দিকে ক্লোকরুম। আপনি কোট জমা দিয়ে একটা নম্বর লেখা টোকেন পেলেন। টোকেনটা নিজে কিছু বলে না, কাউন্টারের মানুষ খাতা খুলে দেখেন নম্বরটা কার। খাতা থেকে লাইনটা কেটে দিলে টোকেন সাথে সাথে অচল। ডান দিকে মেলার প্রবেশ পাস। পাসের গায়েই নাম, ভূমিকা আর মেয়াদ লেখা, সাথে আয়োজকের সিল। প্রহরী কাউকে ফোন করেন না, শুধু সিলটা আসল কি না দেখেন। দ্রুত, কিন্তু পাসটা একবার দিয়ে দিলে মেয়াদ শেষের আগে ফেরত নেওয়ার সহজ উপায় নেই। পুরো লেসনটা এই দুইটা ছবির তফাত।"
      panels={[
        { title: "Session", sub: "ক্লোকরুমের টোকেন", viewBox: "0 0 300 200", height: 200, children: <CoatCheck /> },
        { title: "JWT", sub: "সিল মারা পাস", viewBox: "0 0 300 200", height: 200, children: <SealedPass /> },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Login: Password একবার, প্রমাণ প্রতিবার                                 */
/* ------------------------------------------------------------------------- */

const LOGIN_ROWS = [
  { y: 112, dir: "right", label: "POST /api/auth/login", note: "email আর Password, শুধু এই একবার", accent: true },
  { y: 162, dir: "left", label: "Set-Cookie অথবা Token", note: "Server প্রমাণ তুলে দিল", accent: true },
  { y: 222, dir: "right", label: "GET /api/me", note: "সাথে শুধু প্রমাণ" },
  { y: 264, dir: "right", label: "GET /api/tours/saint-martin", note: "সাথে শুধু প্রমাণ" },
  { y: 306, dir: "right", label: "POST /api/bookings", note: "সাথে শুধু প্রমাণ" },
] as const;

export function LoginProofDiagram() {
  const lx = 170;
  const rx = 670;
  return (
    <Sketch
      label="Diagram: Password একবার যায়, প্রমাণ যায় প্রতিবার"
      height={360}
      minWidth={840}
      viewBox="0 0 840 360"
      caption="বাঁ দিকে পর্যটকের Browser, ডান দিকে Island Tours এর App। উপরের দুইটা তীর Login এর মুহূর্ত: Password একবার গেল, Server সেটা যাচাই করে একটা প্রমাণ ফেরত দিল। নিচের তিনটা তীর তার পরের সাধারণ Request। কোনোটাতেই Password নেই, আছে শুধু সেই প্রমাণ। Server প্রতিটা Request এ প্রমাণটা দেখে বোঝে এটা usr_42। প্রমাণটা কী দিয়ে বানানো, সেটাই Session আর JWT এর তফাত, কিন্তু এই ছবিটা দুইটার জন্যই এক।"
    >
      <Arrow id="session-login-a" />
      <Box x={lx - 100} y={24} w={200} h={40} text="Browser, ফোনে" accent />
      <Box x={rx - 100} y={24} w={200} h={40} text="App, 127.0.0.1:3000" />
      <line x1={lx} y1={64} x2={lx} y2={340} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={64} x2={rx} y2={340} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <SketchText x={rx + 14} y={140} size={8.5} anchor="start" body opacity={0.8}>
        Password এর Hash মেলানো
      </SketchText>
      <SketchText x={rx + 14} y={154} size={8.5} anchor="start" body opacity={0.8}>
        তারপর প্রমাণ বানানো
      </SketchText>
      <line x1={60} y1={196} x2={780} y2={196} stroke="currentColor" strokeOpacity={0.25} />
      <SketchText x={186} y={190} size={8} anchor="start" body opacity={0.6}>
        Login শেষ, এরপর থেকে Password আর কখনো নয়
      </SketchText>
      {LOGIN_ROWS.map((row) => {
        const from = row.dir === "right" ? lx + 4 : rx - 4;
        const to = row.dir === "right" ? rx - 6 : lx + 6;
        return (
          <g key={row.label}>
            <Line x1={from} y1={row.y} x2={to} y2={row.y} marker="session-login-a" dashed={!("accent" in row)} />
            <SketchText x={420} y={row.y - 7} size={9.5} bold accent={"accent" in row}>
              {row.label}
            </SketchText>
            <SketchText x={420} y={row.y + 13} size={8} body opacity={0.7}>
              {row.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. একটা Session খোঁজা: Cookie থেকে Redis পর্যন্ত                          */
/* ------------------------------------------------------------------------- */

export function SessionLookupDiagram() {
  return (
    <Sketch
      label="Diagram: প্রতিটা Request এ Session খোঁজা"
      height={280}
      minWidth={860}
      viewBox="0 0 860 280"
      caption="১. Browser এর Cookie তে আছে শুধু একটা এলোমেলো id, তার বেশি কিছু নয়। ২. App সেই id দিয়ে Redis কে জিজ্ঞেস করে। ৩. Redis এ id এর পাশে লেখা আছে এটা usr_42 এর Session, আর একটা TTL, মানে কত সেকেন্ড পরে Redis নিজেই লাইনটা মুছে দেবে। ৪. App এখন জানে কে, তারপর আসল কাজটা করে। খাতাটা পুরোপুরি Server এর হাতে, তাই Server যখন খুশি লাইনটা মুছতে পারে। এটাই Session এর সবচেয়ে বড় শক্তি।"
    >
      <Arrow id="session-lookup-a" />
      <Box x={20} y={40} w={200} h={52} text="Browser" accent />
      <SketchText x={120} y={116} size={8.5} opacity={0.8}>
        Cookie: __Host-session=hcxE...
      </SketchText>
      <SketchText x={120} y={132} size={8} body opacity={0.7}>
        ৪৩ অক্ষরের এলোমেলো id
      </SketchText>

      <Box x={330} y={40} w={200} h={52} text="App :3000" />
      <SketchText x={430} y={116} size={8} body opacity={0.7}>
        Cookie পড়ে, Redis এ খোঁজে
      </SketchText>

      <Box x={640} y={40} w={200} h={52} text="Redis" />
      <rect x={640} y={150} width={200} height={96} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <SketchText x={652} y={172} size={8.5} anchor="start" bold accent>
        session:hcxE...
      </SketchText>
      <SketchText x={652} y={192} size={8.5} anchor="start">
        {'{"userId":"usr_42",'}
      </SketchText>
      <SketchText x={652} y={208} size={8.5} anchor="start">
        {' "createdAt":1793428145}'}
      </SketchText>
      <SketchText x={652} y={232} size={8.5} anchor="start" opacity={0.75}>
        TTL 1209600 সেকেন্ড
      </SketchText>
      <line x1={740} y1={92} x2={740} y2={150} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />

      <Line x1={224} y1={58} x2={324} y2={58} marker="session-lookup-a" />
      <SketchText x={274} y={50} size={9} bold accent>
        ১
      </SketchText>
      <Line x1={534} y1={58} x2={634} y2={58} marker="session-lookup-a" />
      <SketchText x={584} y={50} size={9} bold accent>
        ২. GET
      </SketchText>
      <Line x1={634} y1={80} x2={534} y2={80} marker="session-lookup-a" />
      <SketchText x={584} y={98} size={9} bold accent>
        ৩. usr_42
      </SketchText>
      <path d="M 430 140 L 430 200 L 306 200" fill="none" stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#session-lookup-a)" />
      <SketchText x={440} y={176} size={9} bold accent anchor="start">
        ৪. চেনা গেল
      </SketchText>
      <Box x={100} y={184} w={200} h={32} text="আসল কাজ, যেমন Booking" size={9} accent />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Session Fixation: id না বদলালে আর বদলালে                                */
/* ------------------------------------------------------------------------- */

function FixationPanel({ rotate }: { rotate: boolean }) {
  const marker = rotate ? "session-fix-b" : "session-fix-a";
  return (
    <>
      <Arrow id={marker} />
      <Box x={10} y={12} w={120} h={30} text="আক্রমণকারী" size={9} dashed />
      <Box x={170} y={12} w={120} h={30} text="পর্যটক" size={9} accent />
      <SketchText x={150} y={66} size={8.5} body opacity={0.8}>
        ১. একটা id আগে থেকে জানা: X
      </SketchText>
      <Line x1={130} y1={78} x2={168} y2={78} marker={marker} dashed />
      <SketchText x={150} y={98} size={8.5} body opacity={0.8}>
        ২. কোনোভাবে পর্যটকের Browser এ X বসালেন
      </SketchText>
      <SketchText x={150} y={122} size={8.5} body opacity={0.8}>
        ৩. পর্যটক Login করলেন
      </SketchText>
      <Box
        x={40}
        y={136}
        w={220}
        h={30}
        text={rotate ? "Server নতুন id দিল: Y, X মুছে দিল" : "Server একই X কে Login করা বানাল"}
        size={8.5}
        accent={rotate}
      />
      <SketchText x={150} y={190} size={8.5} body opacity={0.8}>
        ৪. আক্রমণকারী X নিয়ে Request পাঠালেন
      </SketchText>
      <SketchText x={150} y={214} size={10} bold accent>
        {rotate ? "401, X আর নেই" : "200, আক্রমণকারী এখন পর্যটক"}
      </SketchText>
    </>
  );
}

export function FixationSplit() {
  return (
    <SketchSplit
      label="Diagram: Session Fixation, আর তার এক লাইনের প্রতিরোধ"
      caption="দুই পাশে একই আক্রমণ। আক্রমণকারী নিজে Island Tours খুলে একটা Session id পেল, তারপর ছলে বলে সেই id টা পর্যটকের Browser এ বসিয়ে দিল। বাঁ দিকের Server Login এর পরেও একই id রেখে দেয়, তাই পর্যটক Login করা মাত্র আক্রমণকারীর হাতের id টাও Login করা হয়ে যায়। ডান দিকের Server প্রতিটা Login এ একটা নতুন id বানায় আর পুরনোটা মুছে ফেলে। আক্রমণকারীর জানা id টা তখন খাতায় আর নেই।"
      panels={[
        { title: "id বদলায় না", sub: "বিপদ", viewBox: "0 0 300 230", height: 230, children: <FixationPanel rotate={false} /> },
        { title: "Login এ নতুন id", sub: "নিরাপদ", viewBox: "0 0 300 230", height: 230, children: <FixationPanel rotate /> },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 5. JWT এর তিন অংশ                                                         */
/* ------------------------------------------------------------------------- */

const JWT_PARTS = [
  {
    x: 20,
    w: 220,
    token: "eyJhbGciOiJIUzI1NiIs...",
    name: "Header",
    lines: ['{"alg":"HS256",', ' "typ":"JWT"}'],
    note: "কোন নিয়মে সই হয়েছে",
  },
  {
    x: 300,
    w: 280,
    token: "eyJpc3MiOiJodHRwczov...",
    name: "Payload, মানে Claims",
    lines: ['{"iss":"https://api.islandtours.example",', ' "sub":"usr_42", "aud":"islandtours-mobile",', ' "iat":1793428214, "exp":1793429114,', ' "jti":"5c0ef52f-...", "role":"customer"}'],
    note: "কার জন্য, কে দিল, কতক্ষণ",
  },
  {
    x: 640,
    w: 200,
    token: "X1eYLYCc8NrA3V-i...",
    name: "Signature",
    lines: ["HMAC-SHA256(", "  header + '.' + payload,", "  JWT_SECRET )"],
    note: "সিল, Secret ছাড়া বানানো যায় না",
    accent: true,
  },
];

export function JwtAnatomyDiagram() {
  return (
    <Sketch
      label="Diagram: একটা JWT, দুইটা বিন্দুতে ভাগ করা তিন অংশ"
      height={300}
      minWidth={860}
      viewBox="0 0 860 300"
      caption="উপরের সারিতে Token টা যেমন দেখায়, দুইটা বিন্দু দিয়ে তিন ভাগ। নিচে প্রতিটা ভাগ base64url খুলে পড়লে যা পাওয়া যায়। প্রথম দুইটা ভাগ সাধারণ JSON, যে কেউ খুলে পড়তে পারে, কোনো চাবি লাগে না। তৃতীয় ভাগটা আসল নিরাপত্তা: প্রথম দুইটা ভাগ আর Server এর Secret মিলিয়ে বানানো একটা ছাপ। Payload এর একটা অক্ষর বদলালে এই ছাপ আর মেলে না, আর Secret ছাড়া নতুন ছাপ বানানো যায় না। এখানের সংখ্যাগুলো এই লেসনের Lab ৩ চালিয়ে পাওয়া।"
    >
      {JWT_PARTS.map((part, i) => (
        <g key={part.name}>
          <rect
            x={part.x}
            y={20}
            width={part.w}
            height={34}
            fill={part.accent ? "var(--primary)" : "currentColor"}
            fillOpacity={part.accent ? 0.12 : 0.05}
            stroke={part.accent ? "var(--primary)" : "currentColor"}
            strokeOpacity={part.accent ? 1 : 0.45}
            strokeWidth="1.3"
          />
          <SketchText x={part.x + part.w / 2} y={41} size={9.5} bold accent={part.accent}>
            {part.token}
          </SketchText>
          {i < 2 && (
            <circle cx={part.x + part.w + 30} cy={44} r={4} fill="var(--primary)" />
          )}
          <path
            d={`M ${part.x} 66 L ${part.x} 74 L ${part.x + part.w} 74 L ${part.x + part.w} 66`}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.5}
          />
          <SketchText x={part.x + part.w / 2} y={98} size={10} bold accent={part.accent}>
            {part.name}
          </SketchText>
          <rect x={part.x} y={110} width={part.w} height={110} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.3} />
          {part.lines.map((line, j) => (
            <SketchText key={line} x={part.x + 10} y={132 + j * 20} size={8.2} anchor="start">
              {line}
            </SketchText>
          ))}
          <SketchText x={part.x + part.w / 2} y={246} size={8.5} body opacity={0.8}>
            {part.note}
          </SketchText>
        </g>
      ))}
      <SketchText x={430} y={282} size={9} body bold>
        প্রথম দুই অংশ Encoding, তালা নয়। তৃতীয়টা সিল।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. সই করার দুই উপায়: এক Secret, নাকি চাবির জোড়া                            */
/* ------------------------------------------------------------------------- */

function SharedSecret() {
  return (
    <>
      <Arrow id="session-sign-a" />
      <Box x={95} y={10} w={110} h={34} text="JWT_SECRET" accent size={9} />
      <SketchText x={150} y={62} size={8} body opacity={0.75}>
        একটাই চাবি, সবার হাতে কপি
      </SketchText>
      {[
        { x: 10, text: "Auth অংশ" },
        { x: 110, text: "Booking API" },
        { x: 210, text: "Seat Service" },
      ].map((b) => (
        <g key={b.text}>
          <Line x1={150} y1={70} x2={b.x + 40} y2={96} marker="session-sign-a" dashed />
          <Box x={b.x} y={100} w={80} h={34} text={b.text} size={8} />
          <SketchText x={b.x + 40} y={152} size={7.5} body opacity={0.75}>
            সই করে, যাচাই করে
          </SketchText>
        </g>
      ))}
      <SketchText x={150} y={186} size={8.5} body bold accent>
        যে যাচাই করতে পারে, সে বানাতেও পারে
      </SketchText>
      <SketchText x={150} y={204} size={8} body opacity={0.75}>
        এক জায়গা থেকে Secret ফাঁস মানে সব শেষ
      </SketchText>
    </>
  );
}

function KeyPair() {
  return (
    <>
      <Arrow id="session-sign-b" />
      <Box x={10} y={10} w={120} h={34} text="Private Key" accent size={9} />
      <Box x={170} y={10} w={120} h={34} text="Public Key" size={9} />
      <SketchText x={70} y={62} size={8} body opacity={0.75}>
        শুধু Auth অংশের কাছে
      </SketchText>
      <SketchText x={230} y={62} size={8} body opacity={0.75}>
        jwks.json এ সবার জন্য খোলা
      </SketchText>
      <Line x1={70} y1={70} x2={70} y2={96} marker="session-sign-b" />
      <Box x={20} y={100} w={100} h={34} text="Auth অংশ" size={8.5} accent />
      <SketchText x={70} y={152} size={7.5} body opacity={0.75}>
        শুধু এখানেই সই
      </SketchText>
      <Line x1={230} y1={70} x2={190} y2={96} marker="session-sign-b" dashed />
      <Line x1={230} y1={70} x2={262} y2={96} marker="session-sign-b" dashed />
      <Box x={150} y={100} w={70} h={34} text="Booking" size={8} />
      <Box x={226} y={100} w={70} h={34} text="Seat" size={8} />
      <SketchText x={223} y={152} size={7.5} body opacity={0.75}>
        শুধু যাচাই
      </SketchText>
      <SketchText x={150} y={186} size={8.5} body bold accent>
        যাচাই করা যায়, বানানো যায় না
      </SketchText>
      <SketchText x={150} y={204} size={8} body opacity={0.75}>
        Public Key ফাঁস হলেও কেউ Token বানাতে পারে না
      </SketchText>
    </>
  );
}

export function SigningKeysSplit() {
  return (
    <SketchSplit
      label="Diagram: HS256 আর ES256, কার হাতে কোন চাবি"
      caption="বাঁ দিকে HS256। সই আর যাচাই দুইটাই হয় একই Secret দিয়ে, তাই যত জায়গায় Token যাচাই করতে হবে, তত জায়গায় Secret এর কপি রাখতে হয়। আর যার হাতে কপি আছে, সে চাইলে নতুন Token ও বানাতে পারে। ডান দিকে ES256 বা RS256। সই হয় Private Key দিয়ে, যা থাকে শুধু Login এর দায়িত্বে থাকা অংশের কাছে। যাচাই হয় Public Key দিয়ে, যা খোলাখুলি প্রকাশ করা যায়। Booking API আর Seat Service দুইজনই Token যাচাই করতে পারে, কিন্তু কেউই একটা Token বানাতে পারে না।"
      panels={[
        { title: "HS256", sub: "একটা Secret", viewBox: "0 0 300 214", height: 214, children: <SharedSecret /> },
        { title: "ES256 বা RS256", sub: "চাবির জোড়া", viewBox: "0 0 300 214", height: 214, children: <KeyPair /> },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 7. Access আর Refresh, সময়ের রেখায়                                          */
/* ------------------------------------------------------------------------- */

export function RefreshTimelineDiagram() {
  const x0 = 70;
  const perMinute = 9.5;
  const access = [0, 15, 30, 45];
  const logoutAt = 55;
  return (
    <Sketch
      label="Diagram: ছোট Access Token, লম্বা Refresh Token"
      height={290}
      minWidth={860}
      viewBox="0 0 860 290"
      caption="উপরের সারিতে Access Token, প্রতিটা মাত্র ১৫ মিনিট বাঁচে। প্রতিটা Request এর সাথে এটাই যায়, Server শুধু সই আর মেয়াদ দেখে, কোনো খাতা খোলে না। মেয়াদ ফুরালে App চুপচাপ Refresh Token দেখিয়ে নতুন একটা নেয়। নিচের সারিতে Refresh Token, যা ৩০ দিন পর্যন্ত চলতে পারে, কিন্তু প্রতিবার ব্যবহারে বদলে যায়: R1 দিয়ে নিলে R2, R2 দিয়ে নিলে R3। Refresh এর হিসাব Server এর খাতায় থাকে, তাই ৫৫ মিনিটে Logout করলে Server সেই খাতার লাইনটা বাতিল করে। হাতে থাকা শেষ Access Token টা তখনো কিছুক্ষণ চলে, কিন্তু সর্বোচ্চ ১৫ মিনিটের মধ্যে মরে যায়, আর নতুন কিছু পাওয়ার রাস্তা আর থাকে না।"
    >
      <Arrow id="session-refresh-a" />
      <line x1={x0} y1={250} x2={x0 + 75 * perMinute} y2={250} stroke="currentColor" strokeOpacity={0.4} />
      {[0, 15, 30, 45, 60, 75].map((m) => (
        <g key={m}>
          <line x1={x0 + m * perMinute} y1={246} x2={x0 + m * perMinute} y2={254} stroke="currentColor" strokeOpacity={0.5} />
          <SketchText x={x0 + m * perMinute} y={272} size={8.5} opacity={0.75}>
            {`${m} মিনিট`}
          </SketchText>
        </g>
      ))}
      <SketchText x={20} y={74} size={9} anchor="start" bold>
        Access
      </SketchText>
      <SketchText x={20} y={170} size={9} anchor="start" bold>
        Refresh
      </SketchText>
      {access.map((m, i) => (
        <g key={m}>
          <rect
            x={x0 + m * perMinute + 2}
            y={56}
            width={15 * perMinute - 4}
            height={28}
            fill="var(--primary)"
            fillOpacity={0.12}
            stroke="var(--primary)"
            strokeWidth="1.2"
          />
          <SketchText x={x0 + (m + 7.5) * perMinute} y={74} size={9} bold accent>
            {`A${i + 1}`}
          </SketchText>
        </g>
      ))}
      <rect
        x={x0 + 60 * perMinute + 2}
        y={56}
        width={15 * perMinute - 4}
        height={28}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.45}
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      <SketchText x={x0 + 67.5 * perMinute} y={74} size={8.5} body opacity={0.75}>
        A5 আর আসে না
      </SketchText>
      {[
        { m: 0, label: "R1" },
        { m: 15, label: "R2" },
        { m: 30, label: "R3" },
        { m: 45, label: "R4" },
      ].map((r, i, all) => (
        <g key={r.label}>
          <circle cx={x0 + r.m * perMinute + 10} cy={166} r={13} fill="var(--primary)" fillOpacity={r.m === 45 ? 0.04 : 0.12} stroke="var(--primary)" strokeWidth="1.2" strokeDasharray={r.m === 45 ? "3 3" : undefined} />
          <SketchText x={x0 + r.m * perMinute + 10} y={170} size={8.5} bold accent>
            {r.label}
          </SketchText>
          {i < all.length - 1 && (
            <Line x1={x0 + r.m * perMinute + 26} y1={166} x2={x0 + all[i + 1].m * perMinute - 6} y2={166} marker="session-refresh-a" />
          )}
          {i > 0 && (
            <line x1={x0 + r.m * perMinute + 10} y1={152} x2={x0 + r.m * perMinute + 10} y2={88} stroke="var(--primary)" strokeOpacity={0.6} strokeDasharray="2 3" />
          )}
        </g>
      ))}
      <SketchText x={x0 + 30 * perMinute} y={206} size={8} body opacity={0.75}>
        মেয়াদ শেষে R দেখিয়ে নতুন A, আর নতুন R
      </SketchText>
      <line x1={x0 + logoutAt * perMinute} y1={40} x2={x0 + logoutAt * perMinute} y2={240} stroke="var(--primary)" strokeWidth="1.5" />
      <SketchText x={x0 + logoutAt * perMinute + 6} y={36} size={9} anchor="start" bold accent>
        55 মিনিটে Logout
      </SketchText>
      <SketchText x={x0 + logoutAt * perMinute + 6} y={110} size={8} anchor="start" body opacity={0.8}>
        Server R4 বাতিল করল
      </SketchText>
      <SketchText x={x0 + logoutAt * perMinute + 6} y={126} size={8} anchor="start" body opacity={0.8}>
        A4 বড়জোর 60 মিনিট পর্যন্ত
      </SketchText>
      <SketchText x={x0 + logoutAt * perMinute + 6} y={200} size={8} anchor="start" body opacity={0.8}>
        এরপর নতুন A আর আসবে না
      </SketchText>
    </Sketch>
  );
}
