/**
 * What: The static drawings for Module 06 Lesson 03, HTTP Methods and Status Codes: the request
 * line and status line side by side, PUT against PATCH, the my-tours API map, the five status code
 * families, where each 5xx is born, and how an Idempotency-Key stops a double charge.
 *
 * Why: Each idea in this lesson is about structure or order, which a reader sees faster than they
 * read it. The drawings are inline SVG with currentColor strokes, so they work in both themes, and
 * every marker id starts with "methods-" so no other visual on the page can collide with it.
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
      <SketchText x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} size={size} bold accent={accent}>
        {text}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 12} size={8.5} opacity={0.7}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/** Width of one character of the mono font at a given size, used to place tokens side by side. */
const MONO_CHAR = 0.6;

/* ------------------------------------------------------------------------- */
/* 1. প্রথম লাইনের প্রথম শব্দ, আর উত্তরের তিনটা অঙ্ক                            */
/* ------------------------------------------------------------------------- */

function Callout({ x, top, title, sub }: { x: number; top: number; title: string; sub: string }) {
  return (
    <g>
      <SketchText x={x} y={top} size={9} bold accent>
        {title}
      </SketchText>
      <SketchText x={x} y={top + 13} size={8.5} body opacity={0.75}>
        {sub}
      </SketchText>
      <line x1={x} y1={top + 18} x2={x} y2={top + 30} stroke="var(--primary)" strokeWidth="1.2" />
    </g>
  );
}

export function VerbAndAnswerDiagram() {
  const size = 13;
  const cw = size * MONO_CHAR;
  const lx = 40;
  const rx = 470;
  const lineY = 118;

  // Request line: POST /api/bookings HTTP/1.1
  const methodEnd = lx + 4 * cw;
  const targetX = lx + 5 * cw;
  const versionX = targetX + 14 * cw;
  // Status line: HTTP/1.1 201 Created
  const codeX = rx + 9 * cw;
  const phraseX = codeX + 4 * cw;

  return (
    <Sketch
      label="Diagram: Request এর প্রথম শব্দ আর Response এর তিনটা অঙ্ক"
      height={380}
      minWidth={860}
      viewBox="0 0 880 380"
      caption="বাঁ দিকে পর্যটকের ফোন যা পাঠাল, ডান দিকে Island Tours যা ফেরত দিল। লেসন ০২ এ এই দুইটা বার্তার পুরো চেহারা দেখেছেন। এই লেসন শুধু দুইটা জিনিস নিয়ে। Request এর প্রথম শব্দ POST হলো Method, মানে ফোন কী করতে চায়। Response এর প্রথম লাইনের 201 হলো Status Code, মানে Server কী করতে পারল। পাশের Created শব্দটা শুধু মানুষের পড়ার জন্য, কোনো Program এটা পড়ে না। HTTP/2 তে এই শব্দটা পাঠানোই হয় না।"
    >
      <Arrow id="methods-verb-a" />

      {/* Request */}
      <SketchText x={20} y={30} size={9} anchor="start" bold opacity={0.8}>
        REQUEST, ফোন থেকে
      </SketchText>
      <rect x={20} y={40} width={410} height={226} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.4} />
      <Callout x={(lx + methodEnd) / 2} top={58} title="Method" sub="কী করতে চাই" />
      <Callout x={targetX + 6.5 * cw} top={58} title="Target" sub="কোন জিনিস" />
      <Callout x={versionX + 4 * cw} top={58} title="Version" sub="লেসন ০২" />
      <SketchText x={lx} y={lineY} size={size} anchor="start" bold accent>
        POST
      </SketchText>
      <SketchText x={targetX} y={lineY} size={size} anchor="start" bold>
        /api/bookings
      </SketchText>
      <SketchText x={versionX} y={lineY} size={size} anchor="start" opacity={0.8}>
        HTTP/1.1
      </SketchText>
      {[
        "Host: islandtours.example",
        "Authorization: Bearer ...",
        "Content-Type: application/json",
      ].map((line, i) => (
        <SketchText key={line} x={lx} y={146 + i * 20} size={10.5} anchor="start" opacity={0.75}>
          {line}
        </SketchText>
      ))}
      <SketchText x={lx} y={238} size={10.5} anchor="start" opacity={0.9}>
        {'{"tour":"saint-martin","guests":2}'}
      </SketchText>

      {/* Response */}
      <SketchText x={450} y={30} size={9} anchor="start" bold opacity={0.8}>
        RESPONSE, Server থেকে
      </SketchText>
      <rect x={450} y={40} width={410} height={226} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.4} />
      <Callout x={codeX + 1.5 * cw} top={58} title="Status Code" sub="কী হলো" />
      <SketchText x={rx} y={lineY} size={size} anchor="start" opacity={0.8}>
        HTTP/1.1
      </SketchText>
      <SketchText x={codeX} y={lineY} size={size} anchor="start" bold accent>
        201
      </SketchText>
      <SketchText x={phraseX} y={lineY} size={size} anchor="start" opacity={0.8}>
        Created
      </SketchText>
      <SketchText x={phraseX + 8 * cw} y={lineY - 2} size={8.5} anchor="start" body opacity={0.7}>
        Reason Phrase, শুধু মানুষের জন্য
      </SketchText>
      {[
        "Location: /api/bookings/bk_7Q2M9X",
        "Content-Type: application/json",
        "Content-Length: 118",
      ].map((line, i) => (
        <SketchText key={line} x={rx} y={146 + i * 20} size={10.5} anchor="start" opacity={0.75}>
          {line}
        </SketchText>
      ))}
      <SketchText x={rx} y={238} size={10.5} anchor="start" opacity={0.9}>
        {'{"id":"bk_7Q2M9X","status":"confirmed"}'}
      </SketchText>

      {/* Who talks to whom */}
      <Box x={110} y={296} w={210} h={36} text="ফোন 192.168.1.20" accent />
      <Box x={560} y={296} w={220} h={36} text="islandtours.example" />
      <line x1={324} y1={306} x2={554} y2={306} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#methods-verb-a)" />
      <SketchText x={440} y={298} size={9} bold accent>
        Request: POST /api/bookings
      </SketchText>
      <line x1={556} y1={324} x2={326} y2={324} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#methods-verb-a)" />
      <SketchText x={440} y={346} size={9} bold accent>
        Response: 201 Created
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. PUT পুরোটা বদলায়, PATCH শুধু যা পাঠালেন                                  */
/* ------------------------------------------------------------------------- */

function BookingCard({
  y,
  title,
  rows,
}: {
  y: number;
  title: string;
  rows: { text: string; state?: "changed" | "lost" }[];
}) {
  return (
    <g>
      <SketchText x={20} y={y} size={8.5} anchor="start" body bold opacity={0.8}>
        {title}
      </SketchText>
      <rect x={20} y={y + 8} width={260} height={rows.length * 20 + 12} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.4} />
      {rows.map((row, i) => (
        <SketchText
          key={row.text}
          x={34}
          y={y + 28 + i * 20}
          size={10}
          anchor="start"
          bold={row.state !== undefined}
          accent={row.state !== undefined}
          body={row.state === "lost"}
        >
          {row.text}
        </SketchText>
      ))}
    </g>
  );
}

function ReplacePanel({ kind }: { kind: "put" | "patch" }) {
  const id = kind === "put" ? "methods-put-a" : "methods-patch-a";
  const before = [{ text: 'tour: "saint-martin"' }, { text: "guests: 2" }, { text: 'note: "window seat"' }];
  const after =
    kind === "put"
      ? [{ text: 'tour: "saint-martin"' }, { text: "guests: 3", state: "changed" as const }, { text: "note: নেই, মুছে গেছে", state: "lost" as const }]
      : [{ text: 'tour: "saint-martin"' }, { text: "guests: 3", state: "changed" as const }, { text: 'note: "window seat"' }];
  return (
    <>
      <Arrow id={id} />
      <BookingCard y={14} title="আগে, bk_7Q2M9X" rows={before} />
      <SketchText x={20} y={124} size={10} anchor="start" bold accent>
        {kind === "put" ? "PUT /api/bookings/bk_7Q2M9X" : "PATCH /api/bookings/bk_7Q2M9X"}
      </SketchText>
      <SketchText x={20} y={142} size={9.5} anchor="start" opacity={0.85}>
        {kind === "put" ? '{"tour":"saint-martin","guests":3}' : '{"guests":3}'}
      </SketchText>
      <line x1={150} y1={152} x2={150} y2={176} stroke="var(--primary)" strokeWidth="1.4" markerEnd={`url(#${id})`} />
      <BookingCard y={192} title="পরে" rows={after} />
    </>
  );
}

export function PutVsPatchSplit() {
  return (
    <SketchSplit
      label="Diagram: একই বদল, দুই Method এ"
      caption="পর্যটক অতিথির সংখ্যা ২ থেকে ৩ করতে চান। বাঁ দিকে App টা PUT পাঠাল, কিন্তু Body তে note দিতে ভুলে গেল। PUT এর নিয়ম হলো পাঠানো জিনিসটাই এখন পুরো বুকিং, তাই note মুছে গেল। ডান দিকে PATCH, যার নিয়ম হলো শুধু পাঠানো Field গুলো বদলাবে, বাকিগুলো যেমন আছে তেমন থাকবে। তাই note রয়ে গেল। PUT ব্যবহার করলে প্রতিবার পুরো জিনিসটা পাঠাতে হয়।"
      panels={[
        { title: "PUT", sub: "পুরোটাই নতুন", viewBox: "0 0 300 290", height: 290, minWidth: 280, children: <ReplacePanel kind="put" /> },
        { title: "PATCH", sub: "শুধু পাঠানো অংশ", viewBox: "0 0 300 290", height: 290, minWidth: 280, children: <ReplacePanel kind="patch" /> },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. my-tours এর API, বিশেষ্য পথে আর ক্রিয়া Method এ                          */
/* ------------------------------------------------------------------------- */

const API_ROWS: { path: string; level: number; methods: string[]; note: string }[] = [
  { path: "/tours", level: 0, methods: ["GET"], note: "সব Tour, Query দিয়ে ছাঁকা" },
  { path: "/tours/{slug}", level: 1, methods: ["GET"], note: "একটা Tour এর পাতা" },
  { path: "/tours/{slug}/seats", level: 2, methods: ["GET"], note: "এই মুহূর্তের খালি আসন" },
  { path: "/bookings", level: 0, methods: ["GET", "POST"], note: "আমার বুকিং, নতুন বুকিং" },
  { path: "/bookings/{id}", level: 1, methods: ["GET", "PATCH", "DELETE"], note: "দেখা, বদলানো, বাতিল" },
  { path: "/payments", level: 0, methods: ["POST"], note: "টাকা দেওয়া, Key সহ" },
  { path: "/auth/login", level: 0, methods: ["POST"], note: "Login" },
  { path: "/auth/logout", level: 0, methods: ["POST"], note: "Logout" },
  { path: "/me", level: 0, methods: ["GET"], note: "আমি কে" },
];

export function ApiMapDiagram() {
  const top = 70;
  const step = 36;
  return (
    <Sketch
      label="Diagram: my-tours এর API এর মানচিত্র"
      height={430}
      minWidth={860}
      viewBox="0 0 880 430"
      caption="প্রতিটা লাইনে বাঁ দিকে পথ, মাঝে সেই পথে কোন কোন Method চলে, ডান দিকে এক কথায় কাজটা। পথগুলো সব বিশেষ্য, বহুবচনে: tours, bookings, payments। কোনো পথে get, create বা delete এর মতো ক্রিয়া নেই, কারণ ক্রিয়ার কাজটা করে Method। একটা জিনিসের ভেতরের জিনিস তার নিচে বসে, যেমন একটা Tour এর আসন। ধূসর Method গুলো শুধু পড়ে, রঙিনগুলো Server এর অবস্থা বদলায়। auth এর পথ দুইটা ব্যতিক্রম, কারণ Login কোনো জিনিস নয়, একটা কাজ। এমন জায়গায় POST ই চলে।"
    >
      <SketchText x={40} y={40} size={13} anchor="start" bold accent>
        /api
      </SketchText>
      <SketchText x={440} y={40} size={8.5} anchor="start" bold opacity={0.7}>
        METHOD
      </SketchText>
      <SketchText x={640} y={40} size={8.5} anchor="start" bold opacity={0.7}>
        কাজ
      </SketchText>
      <line x1={52} y1={48} x2={52} y2={top + (API_ROWS.length - 1) * step} stroke="currentColor" strokeOpacity={0.35} />
      {API_ROWS.map((row, i) => {
        const y = top + i * step;
        const x = 80 + row.level * 30;
        return (
          <g key={row.path}>
            <line x1={52} y1={y} x2={x - 8} y2={y} stroke="currentColor" strokeOpacity={0.35} />
            <SketchText x={x} y={y + 4} size={11} anchor="start" bold>
              {row.path}
            </SketchText>
            {row.methods.map((m, j) => {
              const reads = m === "GET";
              return (
                <g key={m}>
                  <rect
                    x={440 + j * 62}
                    y={y - 11}
                    width={56}
                    height={22}
                    fill={reads ? "transparent" : "var(--primary)"}
                    fillOpacity={reads ? 0 : 0.12}
                    stroke={reads ? "currentColor" : "var(--primary)"}
                    strokeOpacity={reads ? 0.45 : 1}
                  />
                  <SketchText x={440 + j * 62 + 28} y={y + 4} size={9.5} bold accent={!reads}>
                    {m}
                  </SketchText>
                </g>
              );
            })}
            <SketchText x={640} y={y + 4} size={9.5} anchor="start" body opacity={0.85}>
              {row.note}
            </SketchText>
          </g>
        );
      })}
      <rect x={440} y={top + API_ROWS.length * step - 4} width={22} height={14} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" />
      <SketchText x={470} y={top + API_ROWS.length * step + 7} size={9} anchor="start" body opacity={0.8}>
        Server এর অবস্থা বদলায়
      </SketchText>
      <rect x={640} y={top + API_ROWS.length * step - 4} width={22} height={14} fill="transparent" stroke="currentColor" strokeOpacity={0.45} />
      <SketchText x={670} y={top + API_ROWS.length * step + 7} size={9} anchor="start" body opacity={0.8}>
        শুধু পড়ে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Status Code এর পাঁচ পরিবার                                              */
/* ------------------------------------------------------------------------- */

const FAMILIES = [
  { code: "1xx", name: "Informational", meaning: ["শুনছি, চালিয়ে যান", "আসল উত্তর পরে"], next: ["Client অপেক্ষা করে"], examples: "100 101 103" },
  { code: "2xx", name: "Success", meaning: ["যা চেয়েছিলেন", "তা হয়ে গেছে"], next: ["উত্তরটা ব্যবহার করুন"], examples: "200 201 202 204 206" },
  { code: "3xx", name: "Redirection", meaning: ["জিনিসটা অন্য জায়গায়", "Location দেখুন"], next: ["নতুন ঠিকানায় যান"], examples: "301 302 303 307 308" },
  { code: "4xx", name: "Client Error", meaning: ["Request এ গোলমাল", "Client কে বদলাতে হবে"], next: ["হুবহু আবার পাঠালে", "হুবহু একই ফল"], examples: "400 401 403 404 409 422 429", accent: true },
  { code: "5xx", name: "Server Error", meaning: ["Request ঠিক ছিল", "Server পারেনি"], next: ["পরে আবার চেষ্টা", "করা যেতে পারে"], examples: "500 502 503 504", accent: true },
];

export function StatusFamiliesDiagram() {
  const w = 164;
  const gap = 10;
  return (
    <Sketch
      label="Diagram: Status Code এর পাঁচ পরিবার"
      height={300}
      minWidth={880}
      viewBox="0 0 890 300"
      caption="প্রতিটা Status Code তিন অঙ্কের, আর প্রথম অঙ্কটা বলে দেয় সে কোন পরিবারের। বাকি দুইটা অঙ্ক শুধু খুঁটিনাটি। মাঝের লাইনটা সবচেয়ে কাজের: উত্তর পাওয়ার পর Client এর এখন কী করা উচিত। 4xx মানে দোষ Request এর, তাই একই জিনিস আবার পাঠালে একই উত্তর আসবে। 5xx মানে Request ঠিক ছিল, Server পারেনি, তাই কিছুক্ষণ পরে আবার চেষ্টা করলে কাজ হতে পারে। রঙিন দুইটা পরিবারই Error, কিন্তু দায় দুই পক্ষের।"
    >
      {FAMILIES.map((f, i) => {
        const x = 12 + i * (w + gap);
        const cx = x + w / 2;
        return (
          <g key={f.code}>
            <rect
              x={x}
              y={16}
              width={w}
              height={236}
              fill={f.accent ? "var(--primary)" : "currentColor"}
              fillOpacity={f.accent ? 0.07 : 0.03}
              stroke={f.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={f.accent ? 0.8 : 0.4}
            />
            <SketchText x={cx} y={52} size={22} bold accent={f.accent}>
              {f.code}
            </SketchText>
            <SketchText x={cx} y={72} size={9} bold opacity={0.8}>
              {f.name}
            </SketchText>
            {f.meaning.map((line, j) => (
              <SketchText key={line} x={cx} y={100 + j * 16} size={9.5} body>
                {line}
              </SketchText>
            ))}
            <line x1={x + 16} y1={136} x2={x + w - 16} y2={136} stroke="currentColor" strokeOpacity={0.25} />
            <SketchText x={cx} y={154} size={8} bold opacity={0.6}>
              এরপর Client
            </SketchText>
            {f.next.map((line, j) => (
              <SketchText key={line} x={cx} y={172 + j * 15} size={9} body opacity={0.85}>
                {line}
              </SketchText>
            ))}
            <SketchText x={cx} y={236} size={8.5} bold accent={f.accent} opacity={f.accent ? undefined : 0.8}>
              {f.examples}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={445} y={282} size={9.5} body opacity={0.8}>
        অচেনা কোনো 4xx পেলে Client সেটাকে 400 ধরে নেয়, অচেনা 5xx কে 500। পরিবারটাই আসল খবর।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. কোন 5xx কোথায় জন্মায়                                                   */
/* ------------------------------------------------------------------------- */

function CodeCard({ x, y, code, lines }: { x: number; y: number; code: string; lines: string[] }) {
  return (
    <g>
      <rect x={x} y={y} width={210} height={48} fill="var(--primary)" fillOpacity={0.06} stroke="var(--primary)" strokeOpacity={0.7} />
      <SketchText x={x + 26} y={y + 30} size={14} bold accent>
        {code}
      </SketchText>
      {lines.map((line, i) => (
        <SketchText key={line} x={x + 54} y={y + 20 + i * 15} size={9} anchor="start" body>
          {line}
        </SketchText>
      ))}
    </g>
  );
}

export function GatewayErrorsDiagram() {
  return (
    <Sketch
      label="Diagram: কোন 5xx কে লেখে"
      height={330}
      minWidth={880}
      viewBox="0 0 900 330"
      caption="পর্যটকের Browser শুধু শেষ সংখ্যাটা দেখে, কিন্তু সংখ্যাটা কে লিখেছে সেটা জানা খুব জরুরি। 500 আর 503 সাধারণত লেখে App নিজে, Port 3000 এ। 502 আর 504 লেখে মাঝের Reverse Proxy, Island Tours এ যেটা Caddy, কারণ App তখন উত্তর দেওয়ার মতো অবস্থাতেই নেই। তাই 502 দেখলে App এর Log এ হয়তো কিছুই পাবেন না, খুঁজতে হবে Proxy র Log এ, আর দেখতে হবে App টা চালু আছে কি না। Database ধীর হলে সেই দেরি App পার হয়ে Proxy পর্যন্ত পৌঁছায়, তখন দেখা দেয় 504।"
    >
      <Arrow id="methods-gw-a" />
      <Box x={20} y={96} w={150} h={50} text="Browser" sub="পর্যটকের ফোন" />
      <Box x={250} y={96} w={170} h={50} text="Caddy :443" sub="Reverse Proxy" accent />
      <Box x={500} y={96} w={170} h={50} text="App :3000" sub="127.0.0.1" accent />
      <Box x={750} y={96} w={130} h={50} text="PostgreSQL" sub="Database" />
      {[
        [174, 246],
        [424, 496],
        [674, 746],
      ].map(([a, b]) => (
        <line key={a} x1={a} y1={121} x2={b} y2={121} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#methods-gw-a)" />
      ))}
      <SketchText x={335} y={78} size={9} body opacity={0.8}>
        এখানে জন্মায় 502, 504
      </SketchText>
      <SketchText x={585} y={78} size={9} body opacity={0.8}>
        এখানে জন্মায় 500, 503
      </SketchText>

      <line x1={335} y1={146} x2={335} y2={180} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="3 3" />
      <line x1={585} y1={146} x2={585} y2={180} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="3 3" />
      <CodeCard x={230} y={182} code="502" lines={["App এর সাথে কথা হলো না,", "বা উত্তরটা ভাঙা এলো"]} />
      <CodeCard x={230} y={244} code="504" lines={["App সময়ের মধ্যে", "উত্তর শুরুই করল না"]} />
      <CodeCard x={480} y={182} code="500" lines={["App এর ভেতরে Bug,", "ধরা না পড়া Error"]} />
      <CodeCard x={480} y={244} code="503" lines={["এখন পারব না: Maintenance", "বা ভিড়, Retry-After দেখুন"]} />
      <SketchText x={815} y={196} size={8.5} body opacity={0.75}>
        Database ধীর হলে
      </SketchText>
      <SketchText x={815} y={210} size={8.5} body opacity={0.75}>
        দেরিটা বাঁয়ে গড়িয়ে
      </SketchText>
      <SketchText x={815} y={224} size={8.5} body opacity={0.75}>
        শেষে হয় 504
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. Idempotency-Key, হারানো উত্তর আর দ্বিতীয় চেষ্টা                          */
/* ------------------------------------------------------------------------- */

export function IdempotencyKeyDiagram() {
  const px = 150;
  const sx = 560;
  return (
    <Sketch
      label="Diagram: একই Key, একবারই টাকা কাটা"
      height={440}
      minWidth={860}
      viewBox="0 0 870 440"
      caption="পর্যটক Pay চাপলেন। App টা একটা নতুন Key বানাল আর Payment এর Request এর সাথে পাঠাল। Server টাকা কাটল, আর Key এর পাশে উত্তরটা খাতায় লিখে রাখল। কিন্তু উত্তরটা ফেরার পথে হারিয়ে গেল, ফোন জানেই না টাকা কাটা হয়েছে কি না। ফোন তাই আবার পাঠাল, তবে একই Key দিয়ে। Server খাতায় Key টা পেয়ে বুঝল এটা একই কাজের দ্বিতীয় চেষ্টা, তাই আবার টাকা না কেটে আগের উত্তরটাই ফেরত দিল। Key ছাড়া এই দ্বিতীয় চেষ্টায় পর্যটকের দুইবার টাকা কাটা যেত।"
    >
      <Arrow id="methods-idem-a" />
      <Box x={px - 90} y={20} w={180} h={36} text="ফোন, my-tours App" accent />
      <Box x={sx - 90} y={20} w={180} h={36} text="Server, /api/payments" />
      <line x1={px} y1={56} x2={px} y2={410} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={sx} y1={56} x2={sx} y2={410} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />

      <line x1={px + 4} y1={96} x2={sx - 6} y2={96} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#methods-idem-a)" />
      <SketchText x={355} y={88} size={10} bold accent>
        ১. POST /api/payments
      </SketchText>
      <SketchText x={355} y={112} size={9} opacity={0.8}>
        Idempotency-Key: 6f1c9a2e
      </SketchText>

      <rect x={650} y={80} width={200} height={84} fill="var(--primary)" fillOpacity={0.06} stroke="var(--primary)" strokeOpacity={0.7} />
      <SketchText x={750} y={100} size={9} body bold>
        Server এর Key খাতা
      </SketchText>
      <SketchText x={750} y={122} size={10} bold accent>
        6f1c9a2e: 201, ch_3
      </SketchText>
      <SketchText x={750} y={142} size={8.5} body opacity={0.75}>
        টাকা কাটা হলো একবার
      </SketchText>
      <SketchText x={750} y={156} size={8.5} body opacity={0.75}>
        কিছু সময় পর্যন্ত রাখা থাকে
      </SketchText>
      <line x1={sx + 4} y1={120} x2={646} y2={120} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="3 3" />

      <line x1={sx - 4} y1={176} x2={330} y2={176} stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4 3" />
      <SketchText x={316} y={181} size={14} bold accent>
        ✕
      </SketchText>
      <SketchText x={445} y={168} size={10} bold accent>
        ২. 201 Created
      </SketchText>
      <SketchText x={445} y={196} size={9} body opacity={0.8}>
        উত্তরটা পথে হারাল
      </SketchText>

      <SketchText x={px - 8} y={232} size={9} anchor="end" body opacity={0.8}>
        উত্তর আসেনি।
      </SketchText>
      <SketchText x={px - 8} y={246} size={9} anchor="end" body opacity={0.8}>
        একই Key দিয়ে আবার
      </SketchText>

      <line x1={px + 4} y1={270} x2={sx - 6} y2={270} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#methods-idem-a)" />
      <SketchText x={355} y={262} size={10} bold accent>
        ৩. POST /api/payments
      </SketchText>
      <SketchText x={355} y={286} size={9} opacity={0.8}>
        Idempotency-Key: 6f1c9a2e
      </SketchText>

      <SketchText x={sx + 10} y={312} size={9} anchor="start" body opacity={0.85}>
        Key খাতায় আছে।
      </SketchText>
      <SketchText x={sx + 10} y={326} size={9} anchor="start" body opacity={0.85}>
        আবার টাকা কাটে না।
      </SketchText>

      <line x1={sx - 4} y1={352} x2={px + 6} y2={352} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#methods-idem-a)" />
      <SketchText x={355} y={344} size={10} bold accent>
        ৪. আগের সেই 201, ch_3
      </SketchText>
      <SketchText x={355} y={368} size={9} opacity={0.8}>
        Idempotent-Replayed: true
      </SketchText>

      <SketchText x={435} y={428} size={9.5} body opacity={0.85}>
        নতুন Key মানে নতুন কাজ। তাই আবার চেষ্টা করার সময় Key বদলাবেন না।
      </SketchText>
    </Sketch>
  );
}
