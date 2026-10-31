/**
 * What: The still pictures for the Cookies lesson: the Set-Cookie and Cookie round trip, one
 * Set-Cookie line taken apart, the browser's jar against what the server receives, origin against
 * site, the CSRF attack with and without SameSite, and a third-party cookie inside an embedded widget.
 *
 * Why: Cookies are rules about who gets a note and when. A rule like that is much easier to hold
 * once you have seen the two sides of the conversation drawn next to each other, so each idea in the
 * lesson gets one drawing. Every marker id starts with "cookie-" so two drawings on one page never
 * share an arrow head.
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
  body,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  accent?: boolean;
  size?: number;
  dashed?: boolean;
  body?: boolean;
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
      <SketchText x={x + w / 2} y={y + h / 2 + 4} size={size} bold accent={accent} body={body}>
        {text}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Set-Cookie যায়, Cookie ফিরে আসে                                          */
/* ------------------------------------------------------------------------- */

const TRIP = [
  {
    y: 112,
    dir: "right",
    top: null,
    main: "POST /api/auth/login",
    note: "Email আর Password যাচ্ছে, এখনো কোনো Cookie নেই",
  },
  {
    y: 182,
    dir: "left",
    top: "200 OK",
    main: "Set-Cookie: __Host-session=Gx2f9Q...; Path=/; Secure; HttpOnly",
    note: "Server বলছে, এই নোটটা রেখে দিন, প্রতিবার দেখাবেন",
  },
  {
    y: 318,
    dir: "right",
    top: "GET /api/me",
    main: "Cookie: __Host-session=Gx2f9Q...",
    note: "Browser নিজে থেকেই নোটটা জুড়ে দিল, কোনো Code লাগেনি",
  },
  {
    y: 392,
    dir: "left",
    top: null,
    main: '200 OK  {"id": "usr_42"}',
    note: "Server নোট দেখে Redis এ খুঁজল আর মানুষটাকে চিনে ফেলল",
  },
] as const;

export function CookieRoundTripDiagram() {
  const lx = 170;
  const rx = 690;
  return (
    <Sketch
      label="Diagram: একটা Cookie এর পুরো যাওয়া আসা"
      height={440}
      minWidth={860}
      viewBox="0 0 860 440"
      caption="বাঁ দিকে পর্যটকের Browser, ডান দিকে Island Tours এর Server। Login এর উত্তরে Server একটা Set-Cookie Header পাঠায়। Browser সেটা নিজের Cookie Jar এ রেখে দেয়, মাঝখানের বাক্সটা সেই Jar। এরপর একই সাইটে যতবার Request যাবে, Browser নিজে থেকেই Cookie Header এ নোটটা জুড়ে দেবে। Server প্রতিবার নোটটা দেখে Redis থেকে খুঁজে নেয় মানুষটা কে। HTTP নিজে কিছু মনে রাখে না, মনে রাখার কাজটা ভাগ হয়ে গেছে: নোটটা থাকে Browser এ, নোটের মানে থাকে Server এ।"
    >
      <Arrow id="cookie-trip-a" />
      <Box x={lx - 120} y={20} w={240} h={40} text="Browser, পর্যটকের ফোন" accent body />
      <Box x={rx - 120} y={20} w={240} h={40} text="Server, islandtours.example" body />

      <line x1={lx} y1={60} x2={lx} y2={222} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={lx} y1={282} x2={lx} y2={424} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={60} x2={rx} y2={424} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />

      {/* the jar */}
      <rect x={34} y={222} width={272} height={60} fill="var(--primary)" fillOpacity={0.06} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={170} y={242} size={9} bold accent>
        COOKIE JAR
      </SketchText>
      <SketchText x={170} y={258} size={8.5}>
        __Host-session · islandtours.example · /
      </SketchText>
      <SketchText x={170} y={273} size={8} body opacity={0.75}>
        Secure · HttpOnly · Lax · 14 দিন পর মেয়াদ শেষ
      </SketchText>

      {TRIP.map((s) => {
        const from = s.dir === "right" ? lx + 4 : rx - 4;
        const to = s.dir === "right" ? rx - 6 : lx + 6;
        return (
          <g key={s.y}>
            <line x1={from} y1={s.y} x2={to} y2={s.y} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#cookie-trip-a)" />
            {s.top && (
              <SketchText x={430} y={s.y - 24} size={10} bold>
                {s.top}
              </SketchText>
            )}
            <SketchText x={430} y={s.y - 8} size={9.5} bold accent>
              {s.main}
            </SketchText>
            <SketchText x={430} y={s.y + 16} size={8.5} body opacity={0.75}>
              {s.note}
            </SketchText>
          </g>
        );
      })}

      {/* Redis beside the server */}
      <line x1={rx} y1={350} x2={rx + 34} y2={350} stroke="currentColor" strokeOpacity={0.5} />
      <Box x={rx + 34} y={336} w={110} h={28} text="Redis, Session" size={8.5} dashed />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা Set-Cookie লাইন, ভাগ ভাগ করে                                       */
/* ------------------------------------------------------------------------- */

const ANATOMY: { part: string; meaning: string; more: string; dashed?: boolean }[] = [
  {
    part: "__Host-session",
    meaning: "নাম (Name)।",
    more: "__Host- দিয়ে শুরু, তাই Browser এর উপর কয়েকটা কড়া নিয়ম চাপে",
  },
  {
    part: "Gx2f9Q...",
    meaning: "মান (Value)।",
    more: "Server এর কাছে এর মানে আছে, Browser এর কাছে শুধু কিছু অক্ষর",
  },
  {
    part: "Path=/",
    meaning: "কোন Path এর Request এ যাবে।",
    more: "/ মানে সাইটের সব পাতা আর সব API",
  },
  {
    part: "Secure",
    meaning: "শুধু HTTPS এ যাবে।",
    more: "সাধারণ http:// Request এ কখনো যাবে না",
  },
  {
    part: "HttpOnly",
    meaning: "Page এর JavaScript পড়তে পারবে না।",
    more: "document.cookie এ এর নামও দেখা যাবে না",
  },
  {
    part: "SameSite=Lax",
    meaning: "অন্য সাইট থেকে শুরু হওয়া Request এ কখন যাবে।",
    more: "Lax মানে শুধু Link এ ক্লিক করে আসলে",
  },
  {
    part: "Max-Age=1209600",
    meaning: "কতক্ষণ বাঁচবে, সেকেন্ডে।",
    more: "1209600 সেকেন্ড মানে 14 দিন",
  },
  {
    part: "Domain নেই",
    meaning: "লেখা নেই বলেই Host-only।",
    more: "শুধু islandtours.example পাবে, blog বা admin না",
    dashed: true,
  },
];

export function SetCookieAnatomyDiagram() {
  return (
    <Sketch
      label="Diagram: একটা Set-Cookie লাইনের প্রতিটা অংশ"
      height={430}
      minWidth={860}
      viewBox="0 0 860 430"
      caption="উপরে Island Tours এর Login Response এর আসল Set-Cookie লাইনটা। নিচে প্রতিটা অংশ আলাদা করে। প্রথম দুইটা অংশ Cookie টা নিজে, নাম আর মান। বাকি সবগুলো Attribute, মানে Browser এর জন্য নির্দেশ: কাকে দেবে, কখন দেবে, কতদিন রাখবে। শেষ সারিটা ডটেড, কারণ সেটা লাইনে নেই। Domain না লেখাটাও একটা সিদ্ধান্ত, আর এই লেসনে সেটা সবচেয়ে নিরাপদ সিদ্ধান্তগুলোর একটা।"
    >
      <SketchText x={430} y={34} size={9.5} bold accent>
        Set-Cookie: __Host-session=Gx2f9Q...; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=1209600
      </SketchText>
      <line x1={40} y1={50} x2={820} y2={50} stroke="currentColor" strokeOpacity={0.2} />

      {ANATOMY.map((row, i) => {
        const y = 66 + i * 44;
        const isCookie = i < 2;
        return (
          <g key={row.part}>
            <Box x={40} y={y} w={230} h={30} text={row.part} accent={isCookie} size={10} dashed={row.dashed} body={row.dashed} />
            <line x1={276} y1={y + 15} x2={300} y2={y + 15} stroke="currentColor" strokeOpacity={0.4} />
            <SketchText x={310} y={y + 13} size={10} anchor="start" bold body>
              {row.meaning}
            </SketchText>
            <SketchText x={310} y={y + 27} size={8.5} anchor="start" body opacity={0.75}>
              {row.more}
            </SketchText>
          </g>
        );
      })}

      <SketchText x={155} y={420} size={8.5} body accent>
        উপরের দুইটা: Cookie নিজে
      </SketchText>
      <SketchText x={520} y={420} size={8.5} body opacity={0.7}>
        বাকি সব: Browser এর জন্য নির্দেশ, Server এর কাছে কখনো ফেরত যায় না
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Jar এ যা থাকে, আর Server যা পায়                                         */
/* ------------------------------------------------------------------------- */

const JAR_ROWS = [
  { name: "__Host-session=Gx2f9Q...", where: "islandtours.example · Path=/", flags: "Secure · HttpOnly · Lax · 14 দিন" },
  { name: "theme=dark", where: "islandtours.example · Path=/", flags: "Lax · 365 দিন · JS পড়তে পারে" },
  { name: "lang=bn", where: "Domain=islandtours.example · Path=/", flags: "Lax · 365 দিন · Subdomain ও পায়" },
];

function JarPanel() {
  return (
    <>
      {JAR_ROWS.map((row, i) => {
        const y = 8 + i * 70;
        return (
          <g key={row.name}>
            <rect x={6} y={y} width={368} height={60} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.4} />
            <SketchText x={16} y={y + 18} size={9.5} anchor="start" bold accent>
              {row.name}
            </SketchText>
            <SketchText x={16} y={y + 34} size={8.5} anchor="start" opacity={0.8}>
              {row.where}
            </SketchText>
            <SketchText x={16} y={y + 50} size={8.5} anchor="start" body opacity={0.7}>
              {row.flags}
            </SketchText>
          </g>
        );
      })}
    </>
  );
}

function HeaderPanel() {
  return (
    <>
      <SketchText x={14} y={26} size={10} anchor="start" bold>
        GET /tours/saint-martin
      </SketchText>
      <SketchText x={14} y={44} size={9} anchor="start" opacity={0.7}>
        Host: islandtours.example
      </SketchText>
      <rect x={6} y={58} width={368} height={40} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={14} y={82} size={9} anchor="start" bold accent>
        Cookie: __Host-session=Gx2f9Q...; theme=dark; lang=bn
      </SketchText>
      <SketchText x={190} y={128} size={9} body>
        একটাই লাইন, তিনটা Cookie সেমিকোলন দিয়ে জোড়া।
      </SketchText>
      <SketchText x={190} y={150} size={9} body>
        মেয়াদ নেই, Domain নেই, Path নেই, Flag নেই।
      </SketchText>
      <SketchText x={190} y={172} size={9} body accent bold>
        শুধু নাম আর মান।
      </SketchText>
    </>
  );
}

export function JarVsHeaderSplit() {
  return (
    <SketchSplit
      label="Diagram: Browser জানে অনেক কিছু, Server পায় সামান্য"
      caption="বাঁয়ে Browser এর Jar এ Island Tours এর তিনটা Cookie, প্রতিটার সাথে কোথায় যাবে, কতদিন থাকবে আর কোন Flag আছে সব লেখা। ডানে সেই Browser যখন একটা পাতা চাইল, Server আসলে কী পেল। শুধু নাম আর মান। তাই Server কখনো জানতে পারে না একটা Cookie Secure ছিল কি না বা কবে মেয়াদ শেষ হবে। Attribute গুলো একমুখী: Server পাঠায়, Browser মানে, কিন্তু ফেরত দেয় না।"
      panels={[
        {
          title: "Browser এর Cookie Jar",
          sub: "নাম, মান আর সব নিয়ম",
          viewBox: "0 0 380 220",
          height: 220,
          minWidth: 300,
          children: <JarPanel />,
        },
        {
          title: "Server যা পায়",
          sub: "একটা Cookie Header",
          viewBox: "0 0 380 220",
          height: 220,
          minWidth: 300,
          children: <HeaderPanel />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Origin আর Site, একই URL এ দুইটা আলাদা ভাগ                                 */
/* ------------------------------------------------------------------------- */

const URL_PARTS = [
  { text: "https://", w: 96, role: "scheme" },
  { text: "blog.", w: 62, role: "sub" },
  { text: "islandtours", w: 128, role: "reg" },
  { text: ".example", w: 96, role: "suffix" },
  { text: ":443", w: 58, role: "port" },
  { text: "/tours", w: 80, role: "path" },
] as const;

/** Each part starts where the one before it ends, from x = 170. */
const URL_PARTS_AT = URL_PARTS.map((p, i) => ({
  ...p,
  x: 170 + URL_PARTS.slice(0, i).reduce((sum, q) => sum + q.w, 0),
}));

export function OriginSiteDiagram() {
  const parts = URL_PARTS_AT;
  const xOf = (role: string) => parts.find((p) => p.role === role)!;
  const scheme = xOf("scheme");
  const reg = xOf("reg");
  const suffix = xOf("suffix");
  const port = xOf("port");

  return (
    <Sketch
      label="Diagram: একই ঠিকানার ভেতরে Origin আর Site"
      height={260}
      minWidth={860}
      viewBox="0 0 860 260"
      caption="একটা ঠিকানা, দুইভাবে ভাগ করা। উপরের বন্ধনী Origin: Scheme, পুরো Host আর Port, তিনটাই হুবহু মিলতে হবে। নিচের বন্ধনী Site: শুধু Scheme আর Registrable Domain, মানে Public Suffix এর ঠিক আগের নামটা সহ। blog. অংশটা Site এর হিসাবে ঢোকে না, তাই blog.islandtours.example আর islandtours.example আলাদা Origin হলেও একই Site। Port ও Site এর হিসাবে নেই। আর Path কোনোটাতেই নেই। CORS চলে Origin দিয়ে, SameSite চলে Site দিয়ে। এই একটা তফাত না জানলে দুইটার কোনোটাই পুরো বোঝা যায় না।"
    >
      {/* origin bracket on top: scheme through port */}
      <path
        d={`M${scheme.x + 2},64 L${scheme.x + 2},52 L${port.x + port.w - 2},52 L${port.x + port.w - 2},64`}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth="1.3"
      />
      <SketchText x={(scheme.x + port.x + port.w) / 2} y={42} size={10} bold>
        Origin = Scheme + পুরো Host + Port
      </SketchText>

      {parts.map((p) => {
        const accent = p.role === "scheme" || p.role === "reg" || p.role === "suffix";
        return (
          <g key={p.text}>
            <rect
              x={p.x}
              y={72}
              width={p.w}
              height={40}
              fill={accent ? "var(--primary)" : "currentColor"}
              fillOpacity={accent ? 0.1 : 0.04}
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 0.9 : 0.4}
              strokeWidth="1.2"
              strokeDasharray={p.role === "path" ? "4 3" : undefined}
            />
            <SketchText x={p.x + p.w / 2} y={97} size={12} bold accent={accent}>
              {p.text}
            </SketchText>
          </g>
        );
      })}

      {/* site brackets below: scheme, then registrable domain */}
      <path
        d={`M${scheme.x + 2},120 L${scheme.x + 2},134 L${scheme.x + scheme.w - 2},134 L${scheme.x + scheme.w - 2},120`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      <path
        d={`M${reg.x + 2},120 L${reg.x + 2},134 L${suffix.x + suffix.w - 2},134 L${suffix.x + suffix.w - 2},120`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      <line
        x1={scheme.x + scheme.w / 2}
        y1={134}
        x2={scheme.x + scheme.w / 2}
        y2={150}
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      <line
        x1={(reg.x + suffix.x + suffix.w) / 2}
        y1={134}
        x2={(reg.x + suffix.x + suffix.w) / 2}
        y2={150}
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      <line
        x1={scheme.x + scheme.w / 2}
        y1={150}
        x2={(reg.x + suffix.x + suffix.w) / 2}
        y2={150}
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      <SketchText x={(scheme.x + suffix.x + suffix.w) / 2 - 20} y={170} size={10} bold accent>
        Site = Scheme + Registrable Domain
      </SketchText>

      {/* public suffix note, its leader line stays right of the registrable domain label */}
      <SketchText x={suffix.x + suffix.w / 2} y={240} size={8.5} body opacity={0.8}>
        Public Suffix
      </SketchText>
      <line x1={suffix.x + suffix.w / 2} y1={228} x2={suffix.x + suffix.w / 2} y2={114} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="2 3" />
      <SketchText x={reg.x + 70} y={200} size={8.5} body opacity={0.8}>
        Registrable Domain: islandtours.example
      </SketchText>

      <SketchText x={60} y={97} size={9} body opacity={0.7}>
        একটা URL
      </SketchText>
      <SketchText x={xOf("path").x + 40} y={136} size={8.5} body opacity={0.6}>
        Path কোথাও নেই
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. CSRF, SameSite থাকলে আর না থাকলে                                        */
/* ------------------------------------------------------------------------- */

function CsrfPanel({ safe }: { safe: boolean }) {
  const id = safe ? "cookie-csrf-b" : "cookie-csrf-a";
  return (
    <>
      <Arrow id={id} />
      <Box x={60} y={8} w={260} h={44} text="attacker.example এর পাতা" body />
      <SketchText x={190} y={68} size={8.5} body opacity={0.75}>
        লুকানো একটা Form, পাতা খুলতেই নিজে Submit হয়
      </SketchText>
      <line x1={190} y1={76} x2={190} y2={104} stroke="var(--primary)" strokeWidth="1.4" markerEnd={`url(#${id})`} />

      <Box x={60} y={108} w={260} h={44} text="পর্যটকের Browser" accent body />
      <SketchText x={190} y={170} size={9} bold accent>
        POST /bookings/bk_7Q2M9X/cancel
      </SketchText>
      <SketchText x={190} y={188} size={9} bold accent={!safe}>
        {safe ? "Cookie: (কিছু নেই)" : "Cookie: __Host-session=Gx2f9Q..."}
      </SketchText>
      <line x1={190} y1={196} x2={190} y2={226} stroke="var(--primary)" strokeWidth="1.4" markerEnd={`url(#${id})`} />

      <Box x={60} y={230} w={260} h={44} text="islandtours.example" body />
      <SketchText x={190} y={296} size={9} body bold accent={!safe}>
        {safe ? "401, কাকে বাতিল করব? কিছুই হলো না" : "পর্যটকের বুকিং বাতিল হয়ে গেল"}
      </SketchText>
      <SketchText x={190} y={312} size={8} body opacity={0.7}>
        {safe ? "অন্য Site থেকে আসা POST এ Lax Cookie যায় না" : "Server ভাবল পর্যটক নিজেই বোতাম চেপেছেন"}
      </SketchText>
    </>
  );
}

export function CsrfStorySplit() {
  return (
    <SketchSplit
      label="Diagram: CSRF, একই আক্রমণ দুইবার"
      caption="দুই পাশেই পর্যটক আগে থেকে Island Tours এ Login করা, Jar এ Session Cookie আছে। একটা Email এর Link এ ক্লিক করে তিনি attacker.example এর একটা পাতা খুললেন। সেই পাতায় একটা লুকানো Form আছে, যেটা Island Tours এর বুকিং বাতিলের ঠিকানায় POST করে। বাঁ দিকে Cookie এর SameSite নেই আর Browser পুরনো নিয়মে চলছে: Browser Cookie টা জুড়ে দিল, Server আসল পর্যটকের অনুরোধ ভেবে বুকিং বাতিল করল। ডান দিকে Cookie টা SameSite=Lax: অন্য Site থেকে শুরু হওয়া POST এ Browser Cookie দিল না, Server চিনতেই পারল না কে, কিছুই হলো না। আক্রমণকারীর Code দুই পাশে হুবহু এক, তফাত শুধু Cookie এর একটা Attribute।"
      panels={[
        {
          title: "SameSite ছাড়া",
          sub: "পুরনো দিনের Browser এর নিয়ম",
          viewBox: "0 0 380 322",
          height: 322,
          minWidth: 300,
          children: <CsrfPanel safe={false} />,
        },
        {
          title: "SameSite=Lax থাকলে",
          sub: "আজকের Island Tours",
          viewBox: "0 0 380 322",
          height: 322,
          minWidth: 300,
          children: <CsrfPanel safe />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 6. Third-party Cookie, অন্য সাইটের ভেতরে বসানো Widget                      */
/* ------------------------------------------------------------------------- */

const BROWSER_ROWS = [
  { name: "Chrome, Edge", verdict: "Default এ যায়", detail: "Incognito তে বন্ধ। User নিজে Setting থেকে বন্ধ করতে পারেন", accent: false },
  { name: "Safari", verdict: "যায় না", detail: "২০২০ থেকে সব Third-party Cookie বন্ধ", accent: true },
  { name: "Firefox", verdict: "আলাদা Jar এ", detail: "প্রতিটা Top-level সাইটের জন্য আলাদা ভাঁড়ার, Total Cookie Protection", accent: true },
  { name: "Brave", verdict: "যায় না", detail: "Default এ বন্ধ", accent: true },
];

export function ThirdPartyCookieDiagram() {
  return (
    <Sketch
      label="Diagram: অন্য সাইটের পাতায় Island Tours এর Widget"
      height={330}
      minWidth={860}
      viewBox="0 0 860 330"
      caption="বাঁয়ে একটা Browser এর জানালা। Address Bar এ seagulltours.example, তাই এই মুহূর্তে Top-level Site সেটাই। পাতার ভেতরে Island Tours এর বুকিং Widget বসানো, একটা iframe হিসেবে। Widget এর Request গুলো যায় islandtours.example এ, যা Address Bar এর Site থেকে আলাদা। তাই এই Request এর জন্য Island Tours এর Cookie গুলো Third-party Cookie। ডানে ২০২৬ এ চারটা Browser এই Cookie নিয়ে কী করে। একই Code, চার রকম ফল। Partitioned Attribute দিলে Cookie টা আলাদা একটা ভাঁড়ারে থাকে, যার চাবি islandtours.example আর seagulltours.example দুইটা মিলিয়ে।"
    >
      <Arrow id="cookie-third-a" />
      {/* browser window */}
      <rect x={24} y={20} width={420} height={290} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <rect x={24} y={20} width={420} height={34} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <circle cx={42} cy={37} r={4} fill="currentColor" fillOpacity={0.3} />
      <circle cx={56} cy={37} r={4} fill="currentColor" fillOpacity={0.3} />
      <rect x={74} y={27} width={354} height={20} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeOpacity={0.7} />
      <SketchText x={86} y={41} size={9.5} anchor="start" bold accent>
        https://seagulltours.example/trips
      </SketchText>
      <SketchText x={234} y={82} size={9} body opacity={0.8}>
        Seagull Tours এর নিজের পাতা, নিজের Cookie: First-party
      </SketchText>

      {/* iframe */}
      <rect x={64} y={112} width={340} height={150} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeWidth="1.3" strokeDasharray="5 3" />
      <SketchText x={234} y={134} size={9.5} bold accent>
        iframe: islandtours.example/widget
      </SketchText>
      <SketchText x={234} y={156} size={8.5} body opacity={0.8}>
        Island Tours এর বুকিং Widget
      </SketchText>
      <SketchText x={234} y={196} size={9} bold>
        Cookie: __Host-session ?
      </SketchText>
      <SketchText x={234} y={216} size={8.5} body opacity={0.8}>
        Address Bar এর Site আলাদা, তাই এখানে এটা
      </SketchText>
      <SketchText x={234} y={234} size={8.5} body bold accent>
        Third-party Cookie
      </SketchText>
      <SketchText x={234} y={290} size={8.5} body opacity={0.7}>
        Partitioned দিলে চাবি হয় দুইটা Site মিলিয়ে
      </SketchText>

      <line x1={410} y1={196} x2={486} y2={196} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#cookie-third-a)" />

      {/* browser outcomes */}
      <SketchText x={668} y={36} size={9} bold body opacity={0.8}>
        ২০২৬ এ চার Browser এর আচরণ
      </SketchText>
      {BROWSER_ROWS.map((row, i) => {
        const y = 52 + i * 64;
        return (
          <g key={row.name}>
            <rect
              x={492}
              y={y}
              width={350}
              height={54}
              fill={row.accent ? "var(--primary)" : "currentColor"}
              fillOpacity={row.accent ? 0.07 : 0.04}
              stroke={row.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={row.accent ? 0.8 : 0.4}
              strokeWidth="1.2"
            />
            <SketchText x={506} y={y + 22} size={10} anchor="start" bold>
              {row.name}
            </SketchText>
            <SketchText x={828} y={y + 22} size={9.5} anchor="end" bold body accent={row.accent}>
              {row.verdict}
            </SketchText>
            <SketchText x={506} y={y + 42} size={8} anchor="start" body opacity={0.75}>
              {row.detail}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
