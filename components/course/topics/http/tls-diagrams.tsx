/**
 * What: The still diagrams for the HTTPS, TLS and SSL lesson: who can see plain HTTP on the way, the
 * three dangers and the three guarantees, where TLS sits, the SSL to TLS timeline, the two kinds of
 * lock, the TLS 1.3 handshake, cipher suite names, what HTTPS hides, HSTS, and where TLS ends.
 *
 * Why: Every idea in this lesson is about who can see or change what, and where. A picture of the path
 * makes that obvious in a way prose cannot, so each section gets one drawing built from the shared
 * sketch helpers, with marker ids prefixed `tls-` so they never collide with another lesson's.
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
          fillOpacity={muted ? 0.5 : 1}
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
  size = 9.5,
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
        <SketchText x={x + w / 2} y={y + h / 2 + 12} size={8} body opacity={0.75}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Plain HTTP on the path: everyone in the middle can read it               */
/* ------------------------------------------------------------------------- */

const PATH_STOPS = [
  { x: 20, title: "ফোন", sub: "192.168.1.20", accent: true },
  { x: 196, title: "ক্যাফের Wi-Fi", sub: "Router 192.168.1.1" },
  { x: 372, title: "ISP", sub: "203.0.113.25 এর পরে" },
  { x: 548, title: "মাঝের Hop গুলো", sub: "Router, সমুদ্রের তার" },
  { x: 724, title: "Island Tours", sub: "103.94.135.2:80", accent: true },
];

export function PlainPathDiagram() {
  return (
    <Sketch
      label="Diagram: Plain HTTP এর পথে কে কে পড়তে পারে"
      height={330}
      minWidth={900}
      viewBox="0 0 900 330"
      caption="উপরের কাগজটা একটা আসল Login Request, এই লেসনের Lab এর তিন নম্বর পরীক্ষায় হুবহু এই লেখাটাই ধরা পড়েছে। নিচে পথের পাঁচটা জায়গা। HTTP তে এই কাগজটা খোলা পোস্টকার্ডের মতো যায়। ক্যাফের Wi-Fi, ISP আর মাঝের প্রতিটা Router এর হাতে পুরো লেখাটা থাকে, Password সহ। কেউ চাইলে পড়তে পারে, কেউ চাইলে একটা শব্দ বদলে আবার পাঠিয়ে দিতে পারে, আর আপনার ফোন সেটা টেরও পাবে না।"
    >
      <Arrow id="tls-plain-a" />
      <rect x={250} y={14} width={400} height={118} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 3" />
      <SketchText x={266} y={36} size={10} anchor="start" bold accent>
        POST /api/auth/login HTTP/1.1
      </SketchText>
      <SketchText x={266} y={54} size={10} anchor="start">
        Host: islandtours.example
      </SketchText>
      <SketchText x={266} y={72} size={10} anchor="start">
        Content-Type: application/json
      </SketchText>
      <SketchText x={266} y={98} size={10} anchor="start">
        {'{"email":"tourist@mail.example",'}
      </SketchText>
      <SketchText x={266} y={116} size={10} anchor="start" bold accent>
        {' "password":"648e542dc19e515e"}'}
      </SketchText>

      {PATH_STOPS.map((stop, i) => (
        <g key={stop.title}>
          <Box x={stop.x} y={176} w={156} h={46} text={stop.title} sub={stop.sub} accent={stop.accent} />
          {i < PATH_STOPS.length - 1 && (
            <line x1={stop.x + 158} y1={199} x2={stop.x + 174} y2={199} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#tls-plain-a)" />
          )}
          {i > 0 && i < PATH_STOPS.length - 1 && (
            <g>
              <line x1={stop.x + 78} y1={172} x2={stop.x + 78} y2={140} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="3 3" />
              <SketchText x={stop.x + 78} y={250} size={9} body bold accent>
                পুরোটা পড়তে পারে
              </SketchText>
              <SketchText x={stop.x + 78} y={266} size={9} body opacity={0.75}>
                বদলেও দিতে পারে
              </SketchText>
            </g>
          )}
        </g>
      ))}
      <SketchText x={98} y={250} size={9} body opacity={0.75}>
        লিখেছে
      </SketchText>
      <SketchText x={802} y={250} size={9} body opacity={0.75}>
        পড়বে, এটাই কথা ছিল
      </SketchText>
      <SketchText x={450} y={308} size={9.5} body opacity={0.8}>
        মাঝের তিনজনের কারো পড়ার কথা ছিল না, অথচ তিনজনই পড়তে পারে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Three dangers, three guarantees, three tools                            */
/* ------------------------------------------------------------------------- */

const THREATS = [
  {
    danger: "পড়ে ফেলা",
    example: "ক্যাফের মালিক Password দেখলেন",
    guarantee: "Confidentiality",
    meaning: "শুধু দুই পাশ পড়তে পারে",
    tool: "Encryption",
  },
  {
    danger: "বদলে দেওয়া",
    example: "টাকার ঠিকানা বদলে গেল",
    guarantee: "Integrity",
    meaning: "এক Byte বদলালেও ধরা পড়ে",
    tool: "AEAD Tag",
  },
  {
    danger: "অন্য কেউ সাজা",
    example: "নকল Server Island Tours সাজল",
    guarantee: "Authentication",
    meaning: "ওপাশে সত্যিই সেই Server",
    tool: "Certificate",
  },
];

export function ThreeGuaranteesDiagram() {
  return (
    <Sketch
      label="Diagram: তিনটা বিপদ, তিনটা প্রতিশ্রুতি"
      height={350}
      minWidth={840}
      viewBox="0 0 840 350"
      caption="প্রতিটা কলাম একটা বিপদ থেকে শুরু হয়ে নিচে নামে। উপরে বিপদটা আর তার একটা বাস্তব উদাহরণ, মাঝে TLS যে প্রতিশ্রুতিটা দেয় তার নাম আর মানে, নিচে কোন যন্ত্র দিয়ে সেই প্রতিশ্রুতি রাখা হয়। তিনটা একসাথে লাগে। শুধু Encryption থাকলে নকল Server এর সাথেও খুব গোপনে কথা বলা যায়, যা কোনো কাজের না। তৃতীয় কলামের Certificate এর পুরো গল্প পরের লেসনে।"
    >
      <Arrow id="tls-three-a" />
      {THREATS.map((t, i) => {
        const x = 30 + i * 270;
        return (
          <g key={t.guarantee}>
            <Box x={x} y={20} w={240} h={56} text={t.danger} sub={t.example} size={11} />
            <line x1={x + 120} y1={80} x2={x + 120} y2={118} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#tls-three-a)" />
            <Box x={x} y={124} w={240} h={62} text={t.guarantee} sub={t.meaning} accent size={12} />
            <line x1={x + 120} y1={190} x2={x + 120} y2={228} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#tls-three-a)" />
            <Box x={x + 30} y={234} w={180} h={40} text={t.tool} size={11} />
          </g>
        );
      })}
      <SketchText x={420} y={312} size={9.5} body opacity={0.8}>
        তিনটা মিলে HTTPS এর তালাটা, একটা বাদ গেলে বাকি দুইটার মূল্য প্রায় শূন্য
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Where TLS sits: HTTP over TCP vs HTTP over TLS over TCP                 */
/* ------------------------------------------------------------------------- */

function Stack({ layers }: { layers: { text: string; sub: string; accent?: boolean }[] }) {
  return (
    <>
      {layers.map((layer, i) => (
        <Box
          key={layer.text}
          x={30}
          y={14 + i * 58}
          w={240}
          h={48}
          text={layer.text}
          sub={layer.sub}
          accent={layer.accent}
          size={11}
        />
      ))}
    </>
  );
}

export function TlsLayerSplit() {
  return (
    <SketchSplit
      label="Diagram: TLS কোথায় বসে"
      caption="বাঁ দিকে সাধারণ HTTP, ডান দিকে HTTPS। দুই পাশের সবচেয়ে উপরের তলা হুবহু এক, একই GET, একই Header, একই Status Code। ফারাক শুধু মাঝের একটা নতুন তলায়। HTTP যে Byte গুলো লেখে, TLS সেগুলো তালাবদ্ধ করে TCP কে দেয়। TCP আর IP জানেও না ভেতরে কী আছে, Module 05 এ যেভাবে শিখেছেন ঠিক সেভাবেই Segment আর Packet বানায়। তাই HTTPS কোনো আলাদা HTTP নয়, একই HTTP, শুধু একটা তালাবদ্ধ সুড়ঙ্গের ভেতরে।"
      panels={[
        {
          title: "HTTP",
          sub: "Port 80",
          viewBox: "0 0 300 260",
          height: 260,
          children: (
            <Stack
              layers={[
                { text: "HTTP", sub: "GET /tours/saint-martin" },
                { text: "TCP", sub: "Port 80, Segment" },
                { text: "IP", sub: "103.94.135.2, Packet" },
                { text: "Wi-Fi বা Ethernet", sub: "Frame" },
              ]}
            />
          ),
        },
        {
          title: "HTTPS",
          sub: "Port 443",
          viewBox: "0 0 300 320",
          height: 320,
          children: (
            <Stack
              layers={[
                { text: "HTTP", sub: "হুবহু একই Request" },
                { text: "TLS", sub: "তালা লাগায়, যাচাই করে", accent: true },
                { text: "TCP", sub: "Port 443, Segment" },
                { text: "IP", sub: "103.94.135.2, Packet" },
                { text: "Wi-Fi বা Ethernet", sub: "Frame" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 4. SSL to TLS, a timeline                                                  */
/* ------------------------------------------------------------------------- */

const VERSIONS = [
  { year: "1995", name: "SSL 2.0", state: "dead" },
  { year: "1996", name: "SSL 3.0", state: "dead" },
  { year: "1999", name: "TLS 1.0", state: "retired" },
  { year: "2006", name: "TLS 1.1", state: "retired" },
  { year: "2008", name: "TLS 1.2", state: "live" },
  { year: "2018", name: "TLS 1.3", state: "best" },
] as const;

const STATE_TEXT = {
  dead: "ভাঙা, নিষিদ্ধ",
  retired: "২০২১ এ অবসর",
  live: "এখনো চলে",
  best: "আজকের মান",
} as const;

export function TlsTimelineDiagram() {
  return (
    <Sketch
      label="Diagram: SSL থেকে TLS, তিরিশ বছরের গল্প"
      height={230}
      minWidth={860}
      viewBox="0 0 860 230"
      caption="Netscape ১৯৯৫ সালে SSL বানায়। ১৯৯৯ সালে নিয়মটা IETF এর হাতে গেলে নাম বদলে হয় TLS, কিন্তু ভেতরের ধারণা একই থাকে। দুইটা SSL ই ভেঙে গেছে, SSL 3.0 এর শেষ পেরেক ছিল ২০১৪ সালের POODLE আক্রমণ। TLS 1.0 আর 1.1 কে RFC 8996 ২০২১ সালে আনুষ্ঠানিকভাবে অবসরে পাঠায়, Browser গুলো তার আগেই ছেড়ে দিয়েছিল। আজ আপনি দেখবেন শুধু TLS 1.2 আর TLS 1.3। SSL নামটা টিকে আছে শুধু মুখের কথায়, যেমন SSL Certificate।"
    >
      <line x1={40} y1={110} x2={820} y2={110} stroke="currentColor" strokeOpacity={0.4} strokeWidth="1.3" />
      {VERSIONS.map((v, i) => {
        const x = 70 + i * 144;
        const strong = v.state === "best" || v.state === "live";
        return (
          <g key={v.name}>
            <circle cx={x} cy={110} r={7} fill={strong ? "var(--primary)" : "currentColor"} fillOpacity={strong ? 1 : 0.35} />
            <SketchText x={x} y={86} size={10} opacity={0.75}>
              {v.year}
            </SketchText>
            <SketchText x={x} y={62} size={12} bold accent={strong}>
              {v.name}
            </SketchText>
            <SketchText x={x} y={140} size={9} body bold={strong} accent={v.state === "best"} opacity={strong ? 1 : 0.7}>
              {STATE_TEXT[v.state]}
            </SketchText>
            {!strong && (
              <line x1={x - 30} y1={56} x2={x + 30} y2={56} stroke="currentColor" strokeOpacity={0.5} />
            )}
          </g>
        );
      })}
      <rect x={30} y={168} width={260} height={30} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="4 3" />
      <SketchText x={160} y={188} size={9} body opacity={0.8}>
        নাম SSL, IETF এর আগের যুগ
      </SketchText>
      <rect x={310} y={168} width={520} height={30} fill="var(--primary)" fillOpacity={0.06} stroke="var(--primary)" strokeOpacity={0.6} />
      <SketchText x={570} y={188} size={9} body accent>
        নাম TLS, একই কাজ, প্রতিবার আরও শক্ত
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. Two kinds of lock                                                       */
/* ------------------------------------------------------------------------- */

function KeyShape({ x, y, accent }: { x: number; y: number; accent?: boolean }) {
  const color = accent ? "var(--primary)" : "currentColor";
  return (
    <g>
      <circle cx={x} cy={y} r={9} fill="none" stroke={color} strokeWidth="1.6" />
      <line x1={x + 9} y1={y} x2={x + 38} y2={y} stroke={color} strokeWidth="1.6" />
      <line x1={x + 30} y1={y} x2={x + 30} y2={y + 8} stroke={color} strokeWidth="1.6" />
      <line x1={x + 37} y1={y} x2={x + 37} y2={y + 8} stroke={color} strokeWidth="1.6" />
    </g>
  );
}

function PadlockShape({ x, y, open }: { x: number; y: number; open?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={34} height={26} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.6" />
      <path
        d={open ? `M${x + 7},${y} V${y - 12} a10,10 0 0 1 20,0 V${y - 18}` : `M${x + 7},${y} V${y - 10} a10,10 0 0 1 20,0 V${y}`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.6"
      />
    </g>
  );
}

export function LockKindsSplit() {
  return (
    <SketchSplit
      label="Diagram: দুই রকমের তালা"
      caption="বাঁ দিকে Symmetric, একটাই চাবি দিয়ে তালা লাগানো আর খোলা, দুইজনের কাছেই সেই চাবির একটা করে নকল। খুব দ্রুত, কিন্তু প্রশ্ন হলো চাবির নকলটা প্রথমবার ওপাশে পৌঁছাবে কীভাবে, যখন রাস্তার সবাই সব দেখছে। ডান দিকে Asymmetric, দুইটা আলাদা জিনিস। খোলা তালাগুলো Server যে কাউকে বিলিয়ে দেয়, এর নাম Public Key। সেই তালা খোলার চাবি একটাই, Server নিজের কাছে রাখে, এর নাম Private Key। ধীর, কিন্তু চাবি ভাগ করার সমস্যা নেই। TLS দুইটাই ব্যবহার করে, কোনটা কোথায়, তা পরের দুই সেকশনে।"
      panels={[
        {
          title: "Symmetric",
          sub: "এক চাবি, দুই নকল",
          viewBox: "0 0 300 230",
          height: 230,
          children: (
            <>
              <rect x={20} y={30} width={110} height={70} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} />
              <SketchText x={75} y={70} size={10} bold>
                ফোন
              </SketchText>
              <rect x={170} y={30} width={110} height={70} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} />
              <SketchText x={225} y={70} size={10} bold>
                Server
              </SketchText>
              <KeyShape x={52} y={130} accent />
              <KeyShape x={202} y={130} accent />
              <SketchText x={150} y={134} size={9} body opacity={0.75}>
                একই চাবি
              </SketchText>
              <SketchText x={150} y={176} size={9.5} bold accent>
                AES, ChaCha20
              </SketchText>
              <SketchText x={150} y={196} size={9} body opacity={0.8}>
                দ্রুত, বিশাল Data র জন্য
              </SketchText>
              <SketchText x={150} y={214} size={9} body opacity={0.8}>
                সমস্যা: চাবিটা পাঠাবেন কীভাবে?
              </SketchText>
            </>
          ),
        },
        {
          title: "Asymmetric",
          sub: "বিলানো তালা, লুকানো চাবি",
          viewBox: "0 0 300 230",
          height: 230,
          children: (
            <>
              <PadlockShape x={30} y={58} open />
              <PadlockShape x={76} y={58} open />
              <PadlockShape x={122} y={58} open />
              <SketchText x={92} y={112} size={9.5} bold accent>
                Public Key
              </SketchText>
              <SketchText x={92} y={128} size={9} body opacity={0.8}>
                যে কাউকে দেওয়া যায়
              </SketchText>
              <KeyShape x={210} y={70} accent />
              <SketchText x={232} y={112} size={9.5} bold accent>
                Private Key
              </SketchText>
              <SketchText x={232} y={128} size={9} body opacity={0.8}>
                শুধু Server এর কাছে
              </SketchText>
              <SketchText x={150} y={176} size={9.5} bold accent>
                ECDHE, ECDSA, RSA
              </SketchText>
              <SketchText x={150} y={196} size={9} body opacity={0.8}>
                ধীর, ছোট কাজের জন্য
              </SketchText>
              <SketchText x={150} y={214} size={9} body opacity={0.8}>
                সুবিধা: গোপন কিছু ভাগ করতে হয় না
              </SketchText>
            </>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 6. The TLS 1.3 handshake as a sequence                                     */
/* ------------------------------------------------------------------------- */

const HANDSHAKE_ROWS = [
  { y: 112, dir: "right", name: "ClientHello", detail: "SNI islandtours.example, ALPN h2, key share, suites", sealed: false },
  { y: 168, dir: "left", name: "ServerHello", detail: "বেছে নেওয়া suite, Server এর key share", sealed: false },
  { y: 232, dir: "left", name: "EncryptedExtensions", detail: "ALPN: h2", sealed: true },
  { y: 270, dir: "left", name: "Certificate", detail: "islandtours.example এর Certificate", sealed: true },
  { y: 308, dir: "left", name: "CertificateVerify", detail: "Private Key দিয়ে করা সই", sealed: true },
  { y: 346, dir: "left", name: "Finished", detail: "এ পর্যন্ত সব কথার হিসাব", sealed: true },
  { y: 400, dir: "right", name: "Finished", detail: "ফোনের দিক থেকেও হিসাব মিলল", sealed: true },
  { y: 444, dir: "right", name: "GET /tours/saint-martin", detail: "আসল HTTP, তালার ভেতরে", sealed: true },
] as const;

export function Tls13HandshakeDiagram() {
  const lx = 210;
  const rx = 690;
  return (
    <Sketch
      label="Diagram: TLS 1.3 Handshake, বার্তা ধরে ধরে"
      height={500}
      minWidth={900}
      viewBox="0 0 900 500"
      caption="বাঁ দিকে পর্যটকের ফোন, ডান দিকে Island Tours এর Server, TCP Handshake আগেই শেষ। প্রথম দুইটা বার্তা খোলা, কারণ তখনো কারো কাছে চাবি নেই। এই দুইটার মধ্যেই দুই পাশ চাবি বানানোর উপকরণ বিনিময় করে ফেলে, আর ServerHello এর পর থেকে সবকিছু তালাবদ্ধ, এমনকি Certificate টাও। গাঢ় পটভূমির অংশটা তালার ভেতরের কথা। ফোন থেকে Server আর Server থেকে ফোন, একবার যাওয়া আর একবার আসা, এর নাম এক Round Trip, ছোট করে 1-RTT। তারপরেই আসল HTTP Request রওনা দেয়।"
    >
      <Arrow id="tls-hs-a" />
      <Box x={lx - 120} y={20} w={240} h={40} text="ফোন 192.168.1.20:51514" accent />
      <Box x={rx - 120} y={20} w={240} h={40} text="Server 103.94.135.2:443" />
      <line x1={lx} y1={64} x2={lx} y2={480} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={64} x2={rx} y2={480} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <SketchText x={450} y={84} size={9} body opacity={0.7}>
        TCP Handshake শেষ, এবার TLS
      </SketchText>
      <rect x={lx + 6} y={206} width={rx - lx - 12} height={266} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeOpacity={0.3} strokeDasharray="4 3" />
      <SketchText x={rx - 14} y={222} size={8.5} anchor="end" body accent>
        এখান থেকে সব তালাবদ্ধ
      </SketchText>
      {HANDSHAKE_ROWS.map((row) => {
        const from = row.dir === "right" ? lx + 4 : rx - 4;
        const to = row.dir === "right" ? rx - 6 : lx + 6;
        return (
          <g key={`${row.name}-${row.y}`}>
            <line x1={from} y1={row.y} x2={to} y2={row.y} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#tls-hs-a)" strokeOpacity={row.sealed ? 1 : 0.8} />
            <SketchText x={450} y={row.y - 7} size={10} bold accent={row.sealed}>
              {row.name}
            </SketchText>
            <SketchText x={450} y={row.y + 14} size={8.5} body opacity={0.75}>
              {row.detail}
            </SketchText>
          </g>
        );
      })}
      <line x1={70} y1={112} x2={70} y2={346} stroke="currentColor" strokeOpacity={0.5} />
      <line x1={66} y1={112} x2={74} y2={112} stroke="currentColor" strokeOpacity={0.5} />
      <line x1={66} y1={346} x2={74} y2={346} stroke="currentColor" strokeOpacity={0.5} />
      <SketchText x={80} y={222} size={10} bold accent anchor="start">
        1-RTT
      </SketchText>
      <SketchText x={80} y={238} size={8.5} body anchor="start" opacity={0.75}>
        যাওয়া আর আসা
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 7. Reading a cipher suite name                                             */
/* ------------------------------------------------------------------------- */

function SuitePart({ x, w, y, text, label, accent }: { x: number; w: number; y: number; text: string; label: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={34} fill={accent ? "var(--primary)" : "currentColor"} fillOpacity={accent ? 0.1 : 0.04} stroke={accent ? "var(--primary)" : "currentColor"} strokeOpacity={accent ? 1 : 0.45} />
      <SketchText x={x + w / 2} y={y + 22} size={11} bold accent={accent}>
        {text}
      </SketchText>
      <line x1={x + w / 2} y1={y + 36} x2={x + w / 2} y2={y + 52} stroke="currentColor" strokeOpacity={0.45} />
      <SketchText x={x + w / 2} y={y + 66} size={8.5} body opacity={0.85}>
        {label}
      </SketchText>
    </g>
  );
}

export function CipherSuiteDiagram() {
  return (
    <Sketch
      label="Diagram: Cipher Suite এর নাম পড়তে শেখা"
      height={300}
      minWidth={860}
      viewBox="0 0 860 300"
      caption="উপরের নামটা এই লেসনের openssl পরীক্ষায় example.com এর সাথে TLS 1.3 এ আসল আলোচনায় এসেছে, নিচেরটা একই Server এর সাথে TLS 1.2 জোর করে চালালে। TLS 1.3 এর নাম ছোট, কারণ চাবি বিনিময় আর সই কোন পদ্ধতিতে হবে তা এখন আলাদা আলোচনায় ঠিক হয়, নামে থাকে না। TLS 1.2 এর নামে চারটা সিদ্ধান্তই লেখা থাকে। নাম পড়তে পারলে কোনো Scanner এর রিপোর্ট আর অচেনা লাগে না।"
    >
      <SketchText x={30} y={34} size={10} anchor="start" bold>
        TLS 1.3
      </SketchText>
      <SuitePart x={110} w={70} y={14} text="TLS" label="Protocol" />
      <SuitePart x={190} w={80} y={14} text="AES_256" label="তালা, 256 bit" accent />
      <SuitePart x={280} w={70} y={14} text="GCM" label="ধরন: AEAD" accent />
      <SuitePart x={360} w={90} y={14} text="SHA384" label="চাবি বানানোর Hash" />
      <SketchText x={480} y={36} size={9} body anchor="start" opacity={0.8}>
        চাবি বিনিময় আলাদা ঠিক হয়েছে: X25519MLKEM768
      </SketchText>

      <SketchText x={30} y={174} size={10} anchor="start" bold>
        TLS 1.2
      </SketchText>
      <SuitePart x={110} w={80} y={154} text="ECDHE" label="চাবি বিনিময়" accent />
      <SuitePart x={200} w={80} y={154} text="ECDSA" label="Server এর সই" />
      <SuitePart x={290} w={110} y={154} text="CHACHA20" label="তালা" accent />
      <SuitePart x={410} w={110} y={154} text="POLY1305" label="বদল ধরার Tag" accent />
      <SketchText x={550} y={176} size={9} body anchor="start" opacity={0.8}>
        Hash টা পুরো IANA নামের শেষে থাকে: _SHA256
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 8. What HTTPS hides and what it shows                                      */
/* ------------------------------------------------------------------------- */

function FieldList({ items, hidden }: { items: { label: string; value: string }[]; hidden?: boolean }) {
  return (
    <>
      {items.map((item, i) => (
        <g key={item.label}>
          <SketchText x={14} y={30 + i * 32} size={9} body anchor="start" opacity={0.8}>
            {item.label}
          </SketchText>
          <SketchText x={14} y={44 + i * 32} size={9.5} anchor="start" bold accent={!hidden}>
            {item.value}
          </SketchText>
        </g>
      ))}
    </>
  );
}

export function VisibleHiddenSplit() {
  return (
    <SketchSplit
      label="Diagram: HTTPS কী লুকায়, কী লুকায় না"
      caption="পর্যটক ক্যাফের Wi-Fi তে বসে https://islandtours.example/tours/saint-martin খুললেন। বাঁ দিকে ক্যাফের মালিক এখনো যা দেখতে পান, ডান দিকে যা আর দেখতে পান না। মনে রাখার নিয়মটা সহজ: কোন বাসায় গেলেন সেটা দেখা যায়, বাসার ভেতরে কী বললেন সেটা দেখা যায় না। নামটা দেখা যায় SNI থেকে, যদি না দুই পাশ ECH ব্যবহার করে, আর DNS প্রশ্ন থেকে, যদি না আপনার Resolver এর সাথে DoH বা DoT চলে, যা Module 04 এর Recursive Resolver লেসনে দেখেছেন।"
      panels={[
        {
          title: "এখনো দেখা যায়",
          sub: "খামের উপরের লেখা",
          viewBox: "0 0 300 230",
          height: 230,
          children: (
            <FieldList
              items={[
                { label: "দুই পাশের IP আর Port", value: "192.168.1.20 -> 103.94.135.2:443" },
                { label: "SNI তে Server এর নাম", value: "islandtours.example" },
                { label: "DNS প্রশ্ন, DoH না থাকলে", value: "islandtours.example A?" },
                { label: "কতটুকু Data, কখন", value: "319 B, 815 B, 229 B ..." },
                { label: "কতক্ষণ Connection খোলা", value: "Session এর দৈর্ঘ্য" },
              ]}
            />
          ),
        },
        {
          title: "আর দেখা যায় না",
          sub: "খামের ভেতরের চিঠি",
          viewBox: "0 0 300 230",
          height: 230,
          children: (
            <FieldList
              hidden
              items={[
                { label: "Method আর Path", value: "GET /tours/saint-martin" },
                { label: "Query", value: "?date=2026-12-20&guests=2" },
                { label: "সব Header, Cookie সহ", value: "Cookie: __Host-session=..." },
                { label: "Body, Password সহ", value: '{"password":"..."}' },
                { label: "Status Code আর উত্তর", value: "200, পুরো পাতা" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 9. Redirect, HSTS and the first-visit gap                                  */
/* ------------------------------------------------------------------------- */

export function HstsFlowDiagram() {
  return (
    <Sketch
      label="Diagram: Redirect, HSTS আর প্রথম দেখার ফাঁক"
      height={380}
      minWidth={880}
      viewBox="0 0 880 380"
      caption="প্রথম সারি, প্রথমবার আসা। পর্যটক শুধু islandtours.example লিখলেন, Browser সাধারণ http দিয়ে শুরু করল, Server 308 দিয়ে HTTPS এ পাঠাল আর সাথে HSTS Header দিল। ঠিক ওই প্রথম Request টা খোলা ছিল, ক্যাফের কেউ চাইলে সেটাকেই আটকে নকল পাতা দেখাতে পারত। দ্বিতীয় সারি, পরের সব বার। Browser নিজের খাতায় HSTS লিখে রেখেছে, তাই http লিখলেও তারে কিছু পাঠানোর আগেই নিজে https বানিয়ে নেয়। তৃতীয় সারি, Preload তালিকায় নাম থাকলে Browser জন্ম থেকেই জানে, প্রথম বারের ফাঁকটাও আর থাকে না।"
    >
      <Arrow id="tls-hsts-a" />
      <Arrow id="tls-hsts-m" muted />
      <SketchText x={20} y={30} size={10} anchor="start" bold>
        প্রথমবার
      </SketchText>
      <Box x={20} y={44} w={150} h={40} text="islandtours.example" sub="শুধু নামটা লিখলেন" size={9.5} />
      <line x1={172} y1={64} x2={226} y2={64} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.4" markerEnd="url(#tls-hsts-m)" />
      <Box x={230} y={44} w={180} h={40} text="http://, Port 80" sub="খোলা, এখানেই ঝুঁকি" dashed size={9.5} />
      <line x1={412} y1={64} x2={466} y2={64} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#tls-hsts-a)" />
      <Box x={470} y={44} w={170} h={40} text="308 Location: https://" sub="Server ফেরত পাঠাল" size={9.5} />
      <line x1={642} y1={64} x2={676} y2={64} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#tls-hsts-a)" />
      <Box x={680} y={44} w={180} h={40} text="https://, Port 443" sub="সাথে HSTS Header" accent size={9.5} />

      <SketchText x={20} y={150} size={10} anchor="start" bold>
        পরের সব বার
      </SketchText>
      <Box x={20} y={164} w={150} h={40} text="http://islandtours..." sub="ভুল করে http লিখলেন" size={9.5} />
      <line x1={172} y1={184} x2={226} y2={184} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#tls-hsts-a)" />
      <Box x={230} y={164} w={180} h={40} text="Browser এর HSTS খাতা" sub="নাম আছে, মেয়াদ আছে" accent size={9.5} />
      <line x1={412} y1={184} x2={676} y2={184} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#tls-hsts-a)" />
      <SketchText x={544} y={176} size={9} body accent>
        তারে কিছু যাওয়ার আগেই https
      </SketchText>
      <Box x={680} y={164} w={180} h={40} text="https://, Port 443" sub="Port 80 ছোঁয়াই হলো না" accent size={9.5} />

      <SketchText x={20} y={270} size={10} anchor="start" bold>
        Preload তালিকায় থাকলে
      </SketchText>
      <Box x={20} y={284} w={150} h={40} text="নতুন ফোন, প্রথম দিন" sub="কখনো আসেননি" size={9.5} />
      <line x1={172} y1={304} x2={226} y2={304} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#tls-hsts-a)" />
      <Box x={230} y={284} w={180} h={40} text="Browser এর ভেতরের তালিকা" sub="Browser এর সাথেই আসে" accent size={9.5} />
      <line x1={412} y1={304} x2={676} y2={304} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#tls-hsts-a)" />
      <SketchText x={544} y={296} size={9} body accent>
        প্রথম বারেও কোনো খোলা Request নেই
      </SketchText>
      <Box x={680} y={284} w={180} h={40} text="https://, Port 443" sub="ফাঁকটা বন্ধ" accent size={9.5} />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 10. Where TLS ends                                                         */
/* ------------------------------------------------------------------------- */

export function TerminationDiagram() {
  return (
    <Sketch
      label="Diagram: TLS কোথায় শেষ হয়"
      height={400}
      minWidth={900}
      viewBox="0 0 900 400"
      caption="প্রথম সারি Island Tours এর আজকের সাজ। তালাবদ্ধ সুড়ঙ্গটা ফোন থেকে Caddy পর্যন্ত, Caddy সেখানে তালা খোলে, একে বলে TLS Termination। Caddy থেকে App পর্যন্ত বাকি পথটা সাধারণ HTTP, কিন্তু সেই পথ 127.0.0.1, মানে একই যন্ত্রের ভেতরে, তার কখনো বাইরে যায় না। দ্বিতীয় সারি, সামনে Cloudflare বসালে সুড়ঙ্গ দুইটা হয়ে যায়, প্রথমটা Cloudflare এ শেষ হয়, দ্বিতীয়টা Cloudflare থেকে Caddy পর্যন্ত। Module 04 এর Full (strict) Mode মানে এই দ্বিতীয় সুড়ঙ্গটাও আছে আর তার Certificate যাচাই হয়। তৃতীয় সারি Flexible, দ্বিতীয় সুড়ঙ্গটাই নেই। Browser এ তালা দেখায়, অথচ পথের অর্ধেক খোলা।"
    >
      <Arrow id="tls-term-a" />
      <Arrow id="tls-term-m" muted />

      <SketchText x={20} y={28} size={10} anchor="start" bold>
        আজকের Island Tours
      </SketchText>
      <Box x={20} y={42} w={150} h={44} text="ফোন" sub="Browser" accent />
      <Box x={420} y={42} w={180} h={44} text="Caddy :443" sub="103.94.135.2, তালা খোলে" accent />
      <Box x={720} y={42} w={160} h={44} text="App :3000" sub="127.0.0.1" />
      <rect x={174} y={54} width={242} height={20} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeWidth="1.2" />
      <SketchText x={295} y={68} size={9} body bold accent>
        TLS, তালাবদ্ধ
      </SketchText>
      <line x1={604} y1={64} x2={716} y2={64} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.4" markerEnd="url(#tls-term-m)" />
      <SketchText x={660} y={56} size={8.5} body opacity={0.8}>
        HTTP, একই যন্ত্রে
      </SketchText>

      <SketchText x={20} y={158} size={10} anchor="start" bold>
        সামনে Cloudflare, Full (strict)
      </SketchText>
      <Box x={20} y={172} w={150} h={44} text="ফোন" sub="Browser" accent />
      <Box x={290} y={172} w={150} h={44} text="Cloudflare Edge" sub="প্রথম তালা খোলে" accent />
      <Box x={560} y={172} w={150} h={44} text="Caddy :443" sub="দ্বিতীয় তালা খোলে" accent />
      <Box x={760} y={172} w={120} h={44} text="App :3000" sub="127.0.0.1" />
      <rect x={174} y={184} width={112} height={20} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeWidth="1.2" />
      <SketchText x={230} y={198} size={9} body bold accent>
        TLS ১
      </SketchText>
      <rect x={444} y={184} width={112} height={20} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeWidth="1.2" />
      <SketchText x={500} y={198} size={9} body bold accent>
        TLS ২, যাচাই সহ
      </SketchText>
      <line x1={712} y1={194} x2={756} y2={194} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.4" markerEnd="url(#tls-term-m)" />

      <SketchText x={20} y={288} size={10} anchor="start" bold>
        সামনে Cloudflare, Flexible
      </SketchText>
      <Box x={20} y={302} w={150} h={44} text="ফোন" sub="তালা দেখছে" accent />
      <Box x={290} y={302} w={150} h={44} text="Cloudflare Edge" sub="তালা খোলে" accent />
      <Box x={560} y={302} w={150} h={44} text="Server :80" sub="খোলা পথে পায়" dashed />
      <rect x={174} y={314} width={112} height={20} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeWidth="1.2" />
      <SketchText x={230} y={328} size={9} body bold accent>
        TLS
      </SketchText>
      <line x1={444} y1={324} x2={556} y2={324} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.4" strokeDasharray="5 4" markerEnd="url(#tls-term-m)" />
      <SketchText x={500} y={316} size={8.5} body opacity={0.85}>
        খোলা HTTP
      </SketchText>
      <SketchText x={500} y={344} size={9} body bold accent>
        যে কেউ পড়তে পারে
      </SketchText>
      <SketchText x={450} y={384} size={9.5} body opacity={0.8}>
        নিয়ম: Certificate আর Private Key থাকতে হয় ঠিক সেখানে, যেখানে তালা খোলা হয়
      </SketchText>
    </Sketch>
  );
}
