/**
 * What: The still pictures for the URL vs URI lesson: the URI family, a URL taken apart, who reads
 * which part, how Bengali text becomes bytes in a URL, and how an open redirect works.
 *
 * Why: A URL is one line of text, and a learner only sees its parts once each part is drawn apart
 * and labelled. Every value drawn here was produced by Node's own URL parser, so the picture and
 * the terminal always agree.
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
  accent,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  accent?: boolean;
  dashed?: boolean;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill={accent ? "var(--primary)" : "currentColor"}
      fillOpacity={accent ? 0.08 : 0.03}
      stroke={accent ? "var(--primary)" : "currentColor"}
      strokeOpacity={accent ? 1 : 0.45}
      strokeWidth="1.3"
      strokeDasharray={dashed ? "4 3" : undefined}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 1. URI পরিবার: URL আর URN                                                   */
/* ------------------------------------------------------------------------- */

export function UriFamilyDiagram() {
  return (
    <Sketch
      label="Diagram: URI, URL আর URN এর সম্পর্ক"
      height={330}
      minWidth={820}
      viewBox="0 0 840 330"
      caption="বাইরের বড় বাক্সটা URI, মানে যেকোনো জিনিসকে চেনানোর একটা নিয়মমাফিক লেখা। তার ভেতরে দুই ধরনের সদস্য। বাঁ দিকের URL শুধু চেনায় না, কোথায় আছে আর কীভাবে পৌঁছাতে হবে সেটাও বলে, যেমন একটা বাসার ঠিকানা। ডান দিকের URN শুধু একটা স্থায়ী নাম দেয়, যেমন জাতীয় পরিচয়পত্রের নম্বর, মানুষটা এখন কোথায় থাকেন তা বলে না। তাই প্রতিটা URL একটা URI, কিন্তু প্রতিটা URI একটা URL নয়।"
    >
      <rect x={20} y={16} width={800} height={298} fill="currentColor" fillOpacity={0.02} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" />
      <SketchText x={420} y={44} size={13} bold>
        URI · Uniform Resource Identifier
      </SketchText>
      <SketchText x={420} y={64} size={10} body opacity={0.75}>
        যেকোনো জিনিসকে চেনানোর একটা নিয়মমাফিক লেখা
      </SketchText>

      {/* URL */}
      <Box x={44} y={84} w={364} h={206} accent />
      <SketchText x={226} y={112} size={14} bold accent>
        URL
      </SketchText>
      <SketchText x={226} y={128} size={9} opacity={0.7}>
        Uniform Resource Locator
      </SketchText>
      <SketchText x={226} y={152} size={10} body>
        কোথায় আছে, আর কীভাবে পৌঁছাবেন
      </SketchText>
      <SketchText x={226} y={184} size={9.5} accent>
        https://islandtours.example/tours/saint-martin
      </SketchText>
      <SketchText x={226} y={206} size={9.5} accent>
        wss://islandtours.example/ws
      </SketchText>
      <SketchText x={226} y={228} size={9.5} accent>
        mailto:help@mail.example
      </SketchText>
      <SketchText x={226} y={268} size={9.5} body opacity={0.8}>
        বাসার ঠিকানার মতো: সেখানে গেলে জিনিসটা পাবেন
      </SketchText>

      {/* URN */}
      <Box x={432} y={84} w={364} h={206} />
      <SketchText x={614} y={112} size={14} bold>
        URN
      </SketchText>
      <SketchText x={614} y={128} size={9} opacity={0.7}>
        Uniform Resource Name
      </SketchText>
      <SketchText x={614} y={152} size={10} body>
        শুধু একটা স্থায়ী নাম, কোথায় আছে বলে না
      </SketchText>
      <SketchText x={614} y={184} size={9.5}>
        urn:isbn:9780000000002
      </SketchText>
      <SketchText x={614} y={206} size={9.5}>
        urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66
      </SketchText>
      <SketchText x={614} y={228} size={9.5}>
        urn:ietf:rfc:3986
      </SketchText>
      <SketchText x={614} y={268} size={9.5} body opacity={0.8}>
        পরিচয়পত্রের নম্বরের মতো: মানুষটা চেনা যায়, বাসা নয়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা URL কে টুকরো করে দেখা                                              */
/* ------------------------------------------------------------------------- */

/* JetBrains Mono এর প্রতিটা অক্ষর ঠিক 0.6em চওড়া, তাই অক্ষরের ক্রম দিয়েই
   প্রতিটা টুকরোর জায়গা হিসাব করা যায়। */
const ANATOMY_SIZE = 14;
const ANATOMY_CW = ANATOMY_SIZE * 0.6;
const ANATOMY_X0 = 40;
const ANATOMY_Y = 150;

const ANATOMY_PARTS = [
  { text: "https", label: "Scheme", note: "কীভাবে কথা বলবেন", row: 0 },
  { text: "://", label: "", note: "", row: 0 },
  { text: "islandtours.example", label: "Host", note: "কোন যন্ত্রে", row: 0 },
  { text: ":443", label: "Port", note: "যন্ত্রের কোন দরজায়", row: 1 },
  { text: "/tours/saint-martin", label: "Path", note: "কোন জিনিসটা", row: 0 },
  { text: "?date=2026-12-20&guests=2", label: "Query", note: "কোন শর্তে", row: 1 },
  { text: "#reviews", label: "Fragment", note: "পাতার কোন অংশ", row: 0 },
] as const;

function anatomyRanges() {
  let index = 0;
  return ANATOMY_PARTS.map((part) => {
    const start = ANATOMY_X0 + index * ANATOMY_CW;
    index += part.text.length;
    return { ...part, start, end: ANATOMY_X0 + index * ANATOMY_CW };
  });
}

function TopBracket({ x1, x2, y, text, accent }: { x1: number; x2: number; y: number; text: string; accent?: boolean }) {
  const stroke = accent ? "var(--primary)" : "currentColor";
  return (
    <g>
      <path
        d={`M${x1 + 2},${y + 10} L${x1 + 2},${y} L${x2 - 2},${y} L${x2 - 2},${y + 10}`}
        fill="none"
        stroke={stroke}
        strokeOpacity={accent ? 1 : 0.55}
        strokeWidth="1.2"
      />
      <SketchText x={(x1 + x2) / 2} y={y - 8} size={9.5} body bold accent={accent}>
        {text}
      </SketchText>
    </g>
  );
}

export function UrlAnatomyDiagram() {
  const parts = anatomyRanges();
  const host = parts[2];
  const port = parts[3];
  const path = parts[4];
  const query = parts[5];
  const fragment = parts[6];
  return (
    <Sketch
      label="Diagram: একটা URL এর প্রতিটা টুকরো"
      height={280}
      minWidth={780}
      viewBox="0 0 780 280"
      caption="একটা URL আসলে কয়েকটা প্রশ্নের উত্তর, পাশাপাশি সাজানো। Scheme বলে কোন নিয়মে কথা হবে, Host বলে কোন যন্ত্রে যেতে হবে, Port বলে যন্ত্রের কোন দরজায় টোকা দিতে হবে, Path বলে কোন জিনিসটা চাই, Query বলে কোন শর্তে চাই, আর Fragment বলে পাতা খোলার পর কোন অংশে চোখ রাখতে হবে। উপরের বন্ধনী গুলো খেয়াল করুন। Host আর Port মিলে Authority। Path আর Query মিলে Request Target, শুধু এটুকুই Server এর কাছে Request এর প্রথম লাইনে যায়। Fragment কখনো Browser ছেড়ে বেরোয় না। আর :443 না লিখলেও https এর জন্য Browser নিজে থেকেই 443 ধরে নেয়।"
    >
      <TopBracket x1={host.start} x2={port.end} y={104} text="Authority" />
      <TopBracket x1={path.start} x2={query.end} y={104} text="Request Target, Server এর কাছে যায়" accent />
      <TopBracket x1={fragment.start} x2={fragment.end} y={104} text="Browser এ থাকে" />

      {parts.map((part) => (
        <text
          key={part.text}
          x={part.start}
          y={ANATOMY_Y}
          fontFamily="var(--font-mono), monospace"
          fontSize={ANATOMY_SIZE}
          fontWeight={700}
          fill={part.label ? "var(--primary)" : "currentColor"}
          fillOpacity={part.label ? 1 : 0.6}
        >
          {part.text}
        </text>
      ))}

      {parts
        .filter((part) => part.label)
        .map((part) => {
          const mid = (part.start + part.end) / 2;
          const labelY = part.row === 0 ? 196 : 238;
          return (
            <g key={part.label}>
              <line x1={part.start + 1} y1={162} x2={part.end - 1} y2={162} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.2" />
              <line x1={mid} y1={162} x2={mid} y2={labelY - 14} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="2 3" />
              <SketchText x={mid} y={labelY} size={10.5} bold>
                {part.label}
              </SketchText>
              <SketchText x={mid} y={labelY + 15} size={9} body opacity={0.75}>
                {part.note}
              </SketchText>
            </g>
          );
        })}

      <SketchText x={ANATOMY_X0} y={40} size={9.5} anchor="start" body opacity={0.75}>
        পর্যটক বন্ধুকে এই লিংকটা পাঠালেন:
      </SketchText>
      <SketchText x={ANATOMY_X0} y={62} size={9.5} anchor="start" opacity={0.75}>
        {"islandtours.example/tours/saint-martin?date=2026-12-20&guests=2#reviews"}
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. কোন টুকরো কে পড়ে                                                         */
/* ------------------------------------------------------------------------- */

const READERS = [
  { part: "https", who: "Browser: কোন Protocol, আর TLS চালু হবে কি না", where: "HTTPS এর লেসন ০৭" },
  { part: "islandtours.example", who: "DNS: নাম থেকে IP, উত্তর 103.94.135.2", where: "Module 04, DNS" },
  { part: ":443 (না লিখলেও)", who: "TCP: কোন Port এ Connection খুলবে", where: "Module 05, Port and Socket" },
  { part: "/tours/saint-martin?date=2026-12-20&guests=2", who: "Server এর App: কোন পাতা, কোন শর্তে", where: "HTTP Basics, লেসন ০২" },
  { part: "#reviews", who: "শুধু Browser: পাতা খুলে ওই অংশে Scroll", where: "কোথাও পাঠানো হয় না" },
];

export function UrlReadersDiagram() {
  return (
    <Sketch
      label="Diagram: URL এর কোন টুকরো কার হাতে যায়"
      height={330}
      minWidth={840}
      viewBox="0 0 860 330"
      caption="একটা URL এর পাঁচটা টুকরো পাঁচজন আলাদা পাঠকের জন্য লেখা। Scheme পড়ে Browser নিজে, Host যায় DNS এর কাছে, Port যায় TCP এর কাছে, Path আর Query যায় Server এর App এর কাছে, আর Fragment কোথাও যায় না। আগের দুই Module এ যা শিখেছেন, DNS আর TCP, সেগুলো আসলে এই এক লাইনের দুইটা টুকরোর গল্প। এই Module এর বাকি লেসন গুলো তৃতীয় আর চতুর্থ সারি নিয়ে।"
    >
      <Arrow id="url-readers-a" />
      {READERS.map((row, i) => {
        const y = 22 + i * 60;
        const accent = i === 3;
        return (
          <g key={row.part}>
            <Box x={16} y={y} w={330} h={42} accent={accent} />
            <SketchText x={181} y={y + 25} size={row.part.length > 30 ? 9.5 : 11} bold accent>
              {row.part}
            </SketchText>
            <line x1={352} y1={y + 21} x2={414} y2={y + 21} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#url-readers-a)" />
            <Box x={422} y={y} w={422} h={42} dashed={i === 4} />
            <SketchText x={436} y={y + 18} size={10} anchor="start" body bold>
              {row.who}
            </SketchText>
            <SketchText x={436} y={y + 33} size={8.5} anchor="start" body opacity={0.7}>
              {row.where}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. বাংলা অক্ষর থেকে Percent-encoding                                        */
/* ------------------------------------------------------------------------- */

const CODE_POINTS = [
  { glyph: "স", cp: "U+09B8", bytes: ["E0", "A6", "B8"] },
  { glyph: "ে", cp: "U+09C7", bytes: ["E0", "A7", "87"] },
  { glyph: "ন", cp: "U+09A8", bytes: ["E0", "A6", "A8"] },
  { glyph: "্", cp: "U+09CD", bytes: ["E0", "A7", "8D"] },
  { glyph: "ট", cp: "U+099F", bytes: ["E0", "A6", "9F"] },
];

export function PercentBytesDiagram() {
  const x0 = 210;
  const step = 128;
  return (
    <Sketch
      label="Diagram: সেন্ট শব্দটা URL এ কীভাবে লেখা হয়"
      height={300}
      minWidth={840}
      viewBox="0 0 860 300"
      caption="চোখে সেন্ট শব্দটা তিনটা অক্ষর, কিন্তু Computer এর হিসাবে এটা পাঁচটা Code Point: স, এ কার, ন, হসন্ত আর ট। প্রতিটা Code Point কে UTF-8 নিয়মে তিনটা করে Byte এ লেখা হয়, মোট ১৫ Byte। URL এ একটা Byte কে লেখা হয় শতাংশ চিহ্নের পরে দুইটা Hex অক্ষর দিয়ে, তাই প্রতিটা Code Point হয়ে যায় নয়টা অক্ষরের একটা টুকরো। এই কারণেই একটা বাংলা শব্দ URL এ এত লম্বা দেখায়। শব্দটা হারায়নি, শুধু এমন রূপে লেখা হয়েছে যা পৃথিবীর যেকোনো যন্ত্র নিরাপদে বহন করতে পারে।"
    >
      <Arrow id="url-bytes-a" />
      <SketchText x={24} y={62} size={10} anchor="start" body bold>
        Code Point
      </SketchText>
      <SketchText x={24} y={78} size={8.5} anchor="start" body opacity={0.7}>
        Unicode এর নম্বর
      </SketchText>
      <SketchText x={24} y={160} size={10} anchor="start" body bold>
        UTF-8 Byte
      </SketchText>
      <SketchText x={24} y={176} size={8.5} anchor="start" body opacity={0.7}>
        প্রতিটায় তিনটা
      </SketchText>
      <SketchText x={24} y={250} size={10} anchor="start" body bold>
        URL এ লেখা
      </SketchText>
      <SketchText x={24} y={266} size={8.5} anchor="start" body opacity={0.7}>
        Percent-encoding
      </SketchText>

      {CODE_POINTS.map((point, i) => {
        const cx = x0 + i * step;
        return (
          <g key={point.cp}>
            <Box x={cx - 50} y={30} w={100} h={62} accent />
            <SketchText x={cx} y={60} size={20} body bold accent>
              {point.glyph}
            </SketchText>
            <SketchText x={cx} y={82} size={9.5}>
              {point.cp}
            </SketchText>
            <line x1={cx} y1={96} x2={cx} y2={128} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#url-bytes-a)" />
            <Box x={cx - 50} y={134} w={100} h={46} />
            <SketchText x={cx} y={162} size={11} bold>
              {point.bytes.join(" ")}
            </SketchText>
            <line x1={cx} y1={184} x2={cx} y2={216} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#url-bytes-a)" />
            <Box x={cx - 50} y={222} w={100} h={46} accent />
            <SketchText x={cx} y={250} size={10.5} bold accent>
              {point.bytes.map((b) => `%${b}`).join("")}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. Path এ এক নিয়ম, Host এ আরেক                                             */
/* ------------------------------------------------------------------------- */

function TwoStep({
  id,
  top,
  topSub,
  bottom,
  bottomSub,
  rule,
}: {
  id: string;
  top: string;
  topSub: string;
  bottom: string;
  bottomSub: string;
  rule: string;
}) {
  return (
    <>
      <Arrow id={id} />
      <Box x={10} y={10} w={300} h={56} />
      <SketchText x={160} y={36} size={11} body bold>
        {top}
      </SketchText>
      <SketchText x={160} y={54} size={8.5} body opacity={0.7}>
        {topSub}
      </SketchText>
      <line x1={160} y1={70} x2={160} y2={112} stroke="var(--primary)" strokeWidth="1.4" markerEnd={`url(#${id})`} />
      <SketchText x={172} y={96} size={9} anchor="start" body accent bold>
        {rule}
      </SketchText>
      <Box x={10} y={118} w={300} h={56} accent />
      <SketchText x={160} y={144} size={10} bold accent>
        {bottom}
      </SketchText>
      <SketchText x={160} y={162} size={8.5} body opacity={0.7}>
        {bottomSub}
      </SketchText>
    </>
  );
}

export function HostVsPathSplit() {
  return (
    <SketchSplit
      label="Diagram: বাংলা লেখা URL এর দুই জায়গায় দুইভাবে বদলায়"
      caption="একই URL এ বাংলা লেখা দুই জায়গায় থাকতে পারে, আর দুই জায়গায় নিয়ম আলাদা। Path আর Query তে প্রতিটা Byte কে শতাংশ চিহ্ন দিয়ে লেখা হয়, এর নাম Percent-encoding। Host এ সেটা চলে না, কারণ Domain Name এর পুরনো নিয়মে শুধু ইংরেজি অক্ষর, অঙ্ক আর হাইফেন বসতে পারে। তাই Host এর জন্য আলাদা একটা রূপান্তর আছে, যার নাম Punycode, আর তার ফল সবসময় xn-- দিয়ে শুরু হয়। দুইটা কাজই Browser নিজে করে, আপনি Address Bar এ বাংলাই দেখেন।"
      panels={[
        {
          title: "Path আর Query",
          sub: "Percent-encoding",
          viewBox: "0 0 320 184",
          height: 184,
          children: (
            <TwoStep
              id="url-split-a"
              top="?q=সেন্ট"
              topSub="পর্যটক যা লিখলেন"
              rule="প্রতিটা Byte কে %XX"
              bottom="?q=%E0%A6%B8%E0%A7%87..."
              bottomSub="তারে যা যায়, ১৫ Byte এর ৪৫ অক্ষর"
            />
          ),
        },
        {
          title: "Host",
          sub: "Punycode",
          viewBox: "0 0 320 184",
          height: 184,
          children: (
            <TwoStep
              id="url-split-b"
              top="দ্বীপ.example"
              topSub="Address Bar এ যা দেখা যায়"
              rule="পুরো Label কে ASCII তে"
              bottom="xn--65bif4fxc.example"
              bottomSub="DNS আর Certificate এ যা থাকে"
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 6. Open Redirect: একটা অসাবধান next Parameter                              */
/* ------------------------------------------------------------------------- */

function RedirectPanel({ id, safe }: { id: string; safe: boolean }) {
  return (
    <>
      <Arrow id={id} />
      <Box x={10} y={10} w={300} h={50} />
      <SketchText x={160} y={32} size={9} bold>
        /login?next=https://attacker.example
      </SketchText>
      <SketchText x={160} y={50} size={8.5} body opacity={0.7}>
        ইমেইলে আসা লিংক, শুরুটা আসল সাইটের
      </SketchText>
      <line x1={160} y1={64} x2={160} y2={96} stroke="var(--primary)" strokeWidth="1.4" markerEnd={`url(#${id})`} />
      <Box x={10} y={102} w={300} h={50} accent={safe} />
      <SketchText x={160} y={124} size={9.5} body bold accent={safe}>
        {safe ? "Server: next এর Origin কি আমার নিজের?" : "Server: next যা বলে, সেখানেই পাঠাই"}
      </SketchText>
      <SketchText x={160} y={142} size={8.5} body opacity={0.7}>
        {safe ? "new URL(next, নিজের Origin) দিয়ে মিলিয়ে দেখা" : "কোনো যাচাই নেই"}
      </SketchText>
      <line x1={160} y1={156} x2={160} y2={188} stroke="var(--primary)" strokeWidth="1.4" markerEnd={`url(#${id})`} />
      <Box x={10} y={194} w={300} h={50} accent={safe} dashed={!safe} />
      <SketchText x={160} y={216} size={9.5} bold accent={safe}>
        {safe ? "Location: /" : "Location: https://attacker.example"}
      </SketchText>
      <SketchText x={160} y={234} size={8.5} body opacity={0.7}>
        {safe ? "অচেনা ঠিকানা, তাই নিজের Home এ" : "পর্যটক নকল Login পাতায়"}
      </SketchText>
    </>
  );
}

export function OpenRedirectSplit() {
  return (
    <SketchSplit
      label="Diagram: Open Redirect, আর তার সমাধান"
      caption="Login এর পরে পর্যটককে আগের পাতায় ফেরত পাঠাতে অনেক সাইট URL এ একটা next Parameter রাখে। বাঁ দিকে Server চোখ বন্ধ করে next এর ঠিকানায় পাঠিয়ে দিচ্ছে। আক্রমণকারী তখন এমন একটা লিংক ছড়ায় যার শুরুটা আসল Island Tours এর, তাই মানুষ বিশ্বাস করে ক্লিক করেন, আর Login এর পরে পৌঁছে যান নকল একটা পাতায়। ডান দিকে Server আগে next কে নিজের Origin এর সাথে মিলিয়ে নিয়ে তারপর পাঠাচ্ছে, অচেনা ঠিকানা হলে সোজা Home এ।"
      panels={[
        {
          title: "অসাবধান",
          sub: "Open Redirect",
          viewBox: "0 0 320 254",
          height: 254,
          children: <RedirectPanel id="url-redirect-a" safe={false} />,
        },
        {
          title: "নিরাপদ",
          sub: "Origin মিলিয়ে তবে পাঠানো",
          viewBox: "0 0 320 254",
          height: 254,
          children: <RedirectPanel id="url-redirect-b" safe />,
        },
      ]}
    />
  );
}
