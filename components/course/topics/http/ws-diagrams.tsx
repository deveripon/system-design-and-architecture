/**
 * What: The still diagrams of the WebSocket and real-time lesson (Module 06, Lesson 10): who may speak
 * first, polling timelines, an SSE stream, the upgrade handshake, a frame's bytes, the path through
 * NAT and Caddy, fan out through Redis, and the whole module as one story.
 *
 * Why: Real-time is about direction and time, and both are easier to see than to read. Each drawing
 * uses the lesson's real values (the lab's timings, the RFC example frame, the Island Tours addresses)
 * so the picture and the terminal output tell the same story. Marker ids start with ws- so no two
 * diagrams on one page collide.
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

function MutedArrow({ id }: { id: string }) {
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
        <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" fillOpacity={0.55} />
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
      <SketchText x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} size={size} bold accent={accent}>
        {text}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 12} size={8} opacity={0.7}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. HTTP এ কথা শুরু করে কে                                                   */
/* ------------------------------------------------------------------------- */

const HTTP_PAIRS = [
  { y: 66, ask: "GET /api/tours", answer: "200" },
  { y: 122, ask: "GET /api/tours/saint-martin", answer: "200" },
  { y: 178, ask: "POST /api/bookings", answer: "201" },
];

function HttpPanel() {
  const lx = 50;
  const rx = 250;
  return (
    <>
      <Arrow id="ws-dir-a" />
      <MutedArrow id="ws-dir-m" />
      <Box x={lx - 40} y={8} w={80} h={28} text="ফোন" accent size={9} />
      <Box x={rx - 40} y={8} w={80} h={28} text="Server" size={9} />
      <line x1={lx} y1={36} x2={lx} y2={226} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={36} x2={rx} y2={226} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      {HTTP_PAIRS.map((p) => (
        <g key={p.y}>
          <line x1={lx + 4} y1={p.y} x2={rx - 6} y2={p.y} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ws-dir-a)" />
          <SketchText x={150} y={p.y - 6} size={8} bold accent>
            {p.ask}
          </SketchText>
          <line x1={rx - 4} y1={p.y + 20} x2={lx + 6} y2={p.y + 20} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.2" markerEnd="url(#ws-dir-m)" />
          <SketchText x={150} y={p.y + 16} size={8}>
            {p.answer}
          </SketchText>
        </g>
      ))}
    </>
  );
}

function PushPanel() {
  const lx = 50;
  const rx = 250;
  return (
    <>
      <Arrow id="ws-dir-b" />
      <Box x={lx - 40} y={8} w={80} h={28} text="ফোন" accent size={9} />
      <Box x={rx - 40} y={8} w={80} h={28} text="Server" size={9} />
      <line x1={lx} y1={36} x2={lx} y2={226} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={36} x2={rx} y2={226} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <circle cx={rx} cy={78} r={7} fill="var(--primary)" fillOpacity={0.2} stroke="var(--primary)" />
      <SketchText x={rx - 14} y={70} size={8.5} anchor="end" body accent bold>
        আসন 14A বিক্রি হলো
      </SketchText>
      <line x1={rx - 6} y1={116} x2={lx + 10} y2={116} stroke="var(--primary)" strokeWidth="1.4" strokeDasharray="5 4" />
      <SketchText x={150} y={110} size={14} bold accent>
        ?
      </SketchText>
      <SketchText x={150} y={134} size={8.5} body opacity={0.8}>
        Server নিজে থেকে বলার রাস্তা নেই
      </SketchText>
      <line x1={lx + 4} y1={182} x2={rx - 6} y2={182} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ws-dir-b)" />
      <SketchText x={150} y={176} size={8} bold accent>
        ফোন আবার জিজ্ঞেস করলে
      </SketchText>
      <SketchText x={150} y={204} size={8.5} body opacity={0.8}>
        তখনই জানবে, যত দেরিই হোক
      </SketchText>
    </>
  );
}

export function WsDirectionSplit() {
  return (
    <SketchSplit
      label="Diagram: HTTP এ প্রতিটা কথা শুরু করে Client"
      caption="বাঁ দিকে সাধারণ HTTP। তিনটা আলাদা কাজ, কিন্তু তিনবারই তীর শুরু হয়েছে ফোন থেকে, আর Server শুধু উত্তর দিয়েছে। ডান দিকে আমাদের সমস্যা। Server এর কাছে একটা খবর আছে, আসন 14A বিক্রি হয়ে গেছে, আর ফোনের এখনই সেটা জানা দরকার। কিন্তু HTTP তে Server এর দিক থেকে শুরু হওয়া কোনো তীর নেই। এই লেসনের চারটা উপায়ই এই এক ফাঁক ভরানোর চেষ্টা।"
      panels={[
        { title: "HTTP", sub: "ফোন জিজ্ঞেস করে, Server উত্তর দেয়", viewBox: "0 0 300 236", height: 236, children: <HttpPanel /> },
        { title: "Real-time এর চাহিদা", sub: "Server আগে বলতে চায়", viewBox: "0 0 300 236", height: 236, children: <PushPanel /> },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Short Polling আর Long Polling, Lab এর আসল সময় ধরে                        */
/* ------------------------------------------------------------------------- */

const tx = (t: number) => 80 + t * 34;
const SALES = [3.5, 11.2];
const POLLS = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
const USEFUL_POLLS = new Set([2, 4, 12]);
const HELD = [
  { from: 0, to: 3.5, result: "200" },
  { from: 3.5, to: 11.2, result: "200" },
  { from: 11.2, to: 19.2, result: "204" },
  { from: 19.2, to: 20, result: "" },
];

export function WsPollingTimelineDiagram() {
  return (
    <Sketch
      label="Diagram: একই ২০ সেকেন্ড, দুইভাবে জিজ্ঞেস করা"
      height={330}
      minWidth={860}
      viewBox="0 0 860 330"
      caption="দুইটা সারিই Lab এর আসল ফলাফল থেকে আঁকা। একই ২০ সেকেন্ডে দুইটা আসন বিক্রি হয়েছে, 3.5 আর 11.2 সেকেন্ডে, উপরের সারির গোল দাগগুলো। Short Polling এ ফোন প্রতি ২ সেকেন্ডে জিজ্ঞেস করেছে: দশটা Request, যার তিনটা নতুন কিছু এনেছে (রঙিন), বাকি সাতটা খালি হাতে ফিরেছে। আর বিক্রির খবর পৌঁছাতে দেরি হয়েছে পরের Poll পর্যন্ত। Long Polling এ Server প্রতিটা Request ধরে রেখেছে, লম্বা দাগগুলো। খবর ঘটার মুহূর্তেই উত্তর গেছে। কিছু না ঘটলে ৮ সেকেন্ড পরে খালি 204 গেছে, আর ফোন সাথে সাথে আবার জিজ্ঞেস করেছে।"
    >
      <Arrow id="ws-poll-a" />
      <MutedArrow id="ws-poll-m" />
      {/* Short polling row */}
      <SketchText x={20} y={36} size={10} anchor="start" bold accent>
        Short Polling, প্রতি 2 s
      </SketchText>
      <SketchText x={84} y={68} size={8.5} anchor="end">
        Server
      </SketchText>
      <SketchText x={84} y={128} size={8.5} anchor="end">
        ফোন
      </SketchText>
      <line x1={tx(0)} y1={64} x2={tx(20)} y2={64} stroke="currentColor" strokeOpacity={0.4} />
      <line x1={tx(0)} y1={124} x2={tx(20)} y2={124} stroke="currentColor" strokeOpacity={0.4} />
      {SALES.map((t) => (
        <g key={`s-${t}`}>
          <circle cx={tx(t)} cy={64} r={6} fill="var(--primary)" fillOpacity={0.25} stroke="var(--primary)" />
          <SketchText x={tx(t)} y={52} size={8} bold accent>
            {`${t} s বিক্রি`}
          </SketchText>
        </g>
      ))}
      {POLLS.map((t) => {
        const useful = USEFUL_POLLS.has(t);
        return (
          <g key={`p-${t}`}>
            <line
              x1={tx(t) - 5}
              y1={122}
              x2={tx(t) - 5}
              y2={70}
              stroke={useful ? "var(--primary)" : "currentColor"}
              strokeOpacity={useful ? 1 : 0.45}
              strokeWidth="1.2"
              markerEnd={useful ? "url(#ws-poll-a)" : "url(#ws-poll-m)"}
            />
            <line
              x1={tx(t) + 5}
              y1={66}
              x2={tx(t) + 5}
              y2={118}
              stroke={useful ? "var(--primary)" : "currentColor"}
              strokeOpacity={useful ? 1 : 0.45}
              strokeWidth="1.2"
              markerEnd={useful ? "url(#ws-poll-a)" : "url(#ws-poll-m)"}
            />
          </g>
        );
      })}
      <SketchText x={tx(20) + 12} y={98} size={8.5} anchor="start" body>
        10 Request
      </SketchText>
      <SketchText x={tx(20) + 12} y={112} size={8.5} anchor="start" body accent bold>
        কাজের মাত্র 3
      </SketchText>

      {/* Long polling row */}
      <SketchText x={20} y={186} size={10} anchor="start" bold accent>
        Long Polling, প্রতিটা Request 8 s পর্যন্ত ধরে রাখা
      </SketchText>
      <SketchText x={84} y={218} size={8.5} anchor="end">
        Server
      </SketchText>
      <SketchText x={84} y={278} size={8.5} anchor="end">
        ফোন
      </SketchText>
      <line x1={tx(0)} y1={214} x2={tx(20)} y2={214} stroke="currentColor" strokeOpacity={0.4} />
      <line x1={tx(0)} y1={274} x2={tx(20)} y2={274} stroke="currentColor" strokeOpacity={0.4} />
      {SALES.map((t) => (
        <circle key={`ls-${t}`} cx={tx(t)} cy={214} r={6} fill="var(--primary)" fillOpacity={0.25} stroke="var(--primary)" />
      ))}
      {HELD.map((h) => (
        <g key={`h-${h.from}`}>
          <rect
            x={tx(h.from) + 3}
            y={234}
            width={tx(h.to) - tx(h.from) - 6}
            height={16}
            fill={h.result === "200" ? "var(--primary)" : "currentColor"}
            fillOpacity={h.result === "200" ? 0.15 : 0.06}
            stroke={h.result === "200" ? "var(--primary)" : "currentColor"}
            strokeOpacity={h.result === "200" ? 0.8 : 0.4}
            strokeDasharray={h.result === "" ? "4 3" : undefined}
          />
          {h.result && (
            <SketchText x={(tx(h.from) + tx(h.to)) / 2} y={246} size={8} bold accent={h.result === "200"}>
              {h.result === "200" ? "ধরে রাখা, খবর এলেই 200" : "8 s কিছু নেই, 204"}
            </SketchText>
          )}
        </g>
      ))}
      <SketchText x={tx(20) + 12} y={248} size={8.5} anchor="start" body>
        চলছে
      </SketchText>

      {/* time axis */}
      <line x1={tx(0)} y1={300} x2={tx(20)} y2={300} stroke="currentColor" strokeOpacity={0.5} />
      {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((t) => (
        <g key={`t-${t}`}>
          <line x1={tx(t)} y1={296} x2={tx(t)} y2={304} stroke="currentColor" strokeOpacity={0.5} />
          <SketchText x={tx(t)} y={318} size={8} opacity={0.75}>
            {`${t}s`}
          </SketchText>
        </g>
      ))}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. SSE: একটা Response যেটা শেষ হয় না                                        */
/* ------------------------------------------------------------------------- */

const SSE_FIRST = [
  { x: 210, top: "retry: 3000", bottom: "Browser এর জন্য নিয়ম" },
  { x: 330, top: "id: 1", bottom: "pending" },
  { x: 450, top: "id: 2", bottom: "payment_received" },
];
const SSE_SECOND = [
  { x: 470, top: "id: 3", bottom: "seat_locked" },
  { x: 590, top: "id: 4", bottom: "confirmed" },
  { x: 710, top: ": comment", bottom: "শেষ, Stream বন্ধ" },
];

function EventChip({ x, y, top, bottom }: { x: number; y: number; top: string; bottom: string }) {
  return (
    <g>
      <rect x={x - 52} y={y} width={104} height={38} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeOpacity={0.8} />
      <SketchText x={x} y={y + 15} size={8.5} bold accent>
        {top}
      </SketchText>
      <SketchText x={x} y={y + 29} size={8}>
        {bottom}
      </SketchText>
    </g>
  );
}

export function WsSseStreamDiagram() {
  return (
    <Sketch
      label="Diagram: Server-Sent Events, একটা লম্বা Response"
      height={300}
      minWidth={860}
      viewBox="0 0 860 300"
      caption="উপরের সারিতে Browser একবার GET পাঠিয়েছে, আর Server উত্তর শুরু করেছে Content-Type: text/event-stream দিয়ে। এরপর উত্তরটা আর শেষ হয়নি। যখনই বুকিংয়ের অবস্থা বদলেছে, Server সেই একই Response এ আরেকটা ছোট অংশ লিখে দিয়েছে, প্রতিটার একটা id সহ। মাঝে লাইন কেটে গেছে। নিচের সারিতে Browser নিজে থেকেই আবার যুক্ত হয়েছে, আর সাথে বলেছে Last-Event-ID: 2, মানে আমি ২ পর্যন্ত পেয়েছি। Server তাই শুরু করেছে ৩ থেকে। এগুলো Lab এর আসল ধাপ আর আসল নাম।"
    >
      <Arrow id="ws-sse-a" />
      <SketchText x={20} y={30} size={10} anchor="start" bold accent>
        প্রথম Connection
      </SketchText>
      <line x1={30} y1={84} x2={130} y2={84} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ws-sse-a)" />
      <SketchText x={80} y={76} size={8} bold accent>
        GET .../events
      </SketchText>
      <rect x={140} y={56} width={380} height={56} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeDasharray="5 4" />
      <SketchText x={330} y={50} size={8} body opacity={0.8}>
        200, text/event-stream, একটাই Response, খোলা থাকে
      </SketchText>
      {SSE_FIRST.map((e) => (
        <EventChip key={e.top} x={e.x} y={65} top={e.top} bottom={e.bottom} />
      ))}
      <path d="M530,58 l8,12 l-8,12 l8,12 l-8,12" fill="none" stroke="var(--primary)" strokeWidth="1.6" />
      <SketchText x={548} y={88} size={8.5} anchor="start" body accent bold>
        লাইন কেটে গেল
      </SketchText>

      <SketchText x={20} y={170} size={10} anchor="start" bold accent>
        retry এর 3 s পরে, নিজে থেকেই
      </SketchText>
      <line x1={190} y1={224} x2={400} y2={224} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ws-sse-a)" />
      <SketchText x={295} y={216} size={8} bold accent>
        GET .../events
      </SketchText>
      <SketchText x={295} y={242} size={8} bold>
        Last-Event-ID: 2
      </SketchText>
      <rect x={410} y={196} width={360} height={56} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeDasharray="5 4" />
      {SSE_SECOND.map((e) => (
        <EventChip key={e.top} x={e.x} y={205} top={e.top} bottom={e.bottom} />
      ))}
      <SketchText x={590} y={274} size={8.5} body opacity={0.8}>
        যা আগে পেয়েছিল তা আর আসেনি, যা হারিয়েছিল তাও হারায়নি
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. HTTP থেকে WebSocket: Upgrade Handshake                                   */
/* ------------------------------------------------------------------------- */

const REQUEST_LINES = [
  "GET /ws HTTP/1.1",
  "Host: islandtours.example",
  "Upgrade: websocket",
  "Connection: Upgrade",
  "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==",
  "Sec-WebSocket-Version: 13",
  "Origin: https://islandtours.example",
  "Cookie: __Host-session=...",
];
const RESPONSE_LINES = [
  "HTTP/1.1 101 Switching Protocols",
  "Upgrade: websocket",
  "Connection: Upgrade",
  "Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=",
];
const FRAMES = [
  { y: 452, dir: "right", text: "text: {\"type\":\"watch\",\"tour\":\"saint-martin\"}" },
  { y: 482, dir: "left", text: "text: {\"type\":\"seat_sold\",\"seat\":\"14A\"}" },
  { y: 512, dir: "left", text: "ping" },
  { y: 536, dir: "right", text: "pong" },
] as const;

export function WsUpgradeDiagram() {
  const lx = 200;
  const rx = 660;
  return (
    <Sketch
      label="Diagram: একটা HTTP Request যেটা WebSocket হয়ে যায়"
      height={620}
      minWidth={860}
      viewBox="0 0 860 620"
      caption="উপর থেকে নিচে সময়। প্রথমে চেনা দুইটা ধাপ, TCP Handshake (Module 05) আর TLS Handshake (লেসন ০৭)। তারপর একটা সাধারণ HTTP/1.1 GET, শুধু সাথে কয়েকটা বিশেষ Header। Server রাজি হলে 200 না দিয়ে দেয় 101 Switching Protocols। দাগ টানা রেখাটার পর থেকে এই TCP Connection এ আর কোনো HTTP নেই, আছে শুধু Frame, আর সেগুলো দুই দিক থেকেই যখন খুশি যেতে পারে। Connection টা বন্ধ হয় নিজের Close Frame দিয়ে, তারপর TCP এর চেনা FIN।"
    >
      <Arrow id="ws-up-a" />
      <MutedArrow id="ws-up-m" />
      <Box x={lx - 110} y={14} w={220} h={40} text="ফোন, Browser" sub="192.168.1.20:51522" accent />
      <Box x={rx - 110} y={14} w={220} h={40} text="Caddy, তারপর App" sub="103.94.135.2:443" />
      <line x1={lx} y1={54} x2={lx} y2={600} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={54} x2={rx} y2={600} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />

      <rect x={lx + 6} y={74} width={rx - lx - 12} height={24} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.3} />
      <SketchText x={(lx + rx) / 2} y={90} size={8.5}>
        TCP Handshake: SYN, SYN-ACK, ACK (Module 05)
      </SketchText>
      <rect x={lx + 6} y={106} width={rx - lx - 12} height={24} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.3} />
      <SketchText x={(lx + rx) / 2} y={122} size={8.5}>
        TLS Handshake, এর পর থেকে সব Encrypted (লেসন ০৭)
      </SketchText>

      <line x1={lx + 4} y1={156} x2={rx - 6} y2={156} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#ws-up-a)" />
      <rect x={lx + 30} y={164} width={rx - lx - 60} height={REQUEST_LINES.length * 15 + 12} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeOpacity={0.5} />
      {REQUEST_LINES.map((line, i) => (
        <SketchText key={line} x={lx + 42} y={182 + i * 15} size={8.5} anchor="start" bold={i === 0 || line.startsWith("Upgrade") || line.startsWith("Sec-WebSocket-Key")} accent={line.startsWith("Upgrade") || line.startsWith("Sec-WebSocket-Key")}>
          {line}
        </SketchText>
      ))}
      <SketchText x={20} y={160} size={9} anchor="start" bold accent>
        HTTP Request
      </SketchText>

      <line x1={rx - 4} y1={318} x2={lx + 6} y2={318} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#ws-up-a)" />
      <rect x={lx + 30} y={326} width={rx - lx - 60} height={RESPONSE_LINES.length * 15 + 12} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeOpacity={0.5} />
      {RESPONSE_LINES.map((line, i) => (
        <SketchText key={line} x={lx + 42} y={344 + i * 15} size={8.5} anchor="start" bold={i === 0 || line.startsWith("Sec-WebSocket-Accept")} accent={i === 0 || line.startsWith("Sec-WebSocket-Accept")}>
          {line}
        </SketchText>
      ))}
      <SketchText x={20} y={322} size={9} anchor="start" bold accent>
        HTTP Response
      </SketchText>

      <line x1={20} y1={420} x2={840} y2={420} stroke="var(--primary)" strokeWidth="1.4" strokeDasharray="6 4" />
      <SketchText x={(lx + rx) / 2} y={412} size={9} body bold accent>
        এখান থেকে HTTP শেষ। একই TCP Connection, এখন শুধু Frame
      </SketchText>
      <SketchText x={20} y={456} size={9} anchor="start" bold accent>
        WebSocket Frame
      </SketchText>
      {FRAMES.map((f) => (
        <g key={f.y}>
          <line
            x1={f.dir === "right" ? lx + 4 : rx - 4}
            y1={f.y}
            x2={f.dir === "right" ? rx - 6 : lx + 6}
            y2={f.y}
            stroke="var(--primary)"
            strokeWidth="1.4"
            markerEnd="url(#ws-up-a)"
          />
          <SketchText x={(lx + rx) / 2} y={f.y - 6} size={8.5} bold accent>
            {f.text}
          </SketchText>
        </g>
      ))}
      <line x1={lx + 4} y1={568} x2={rx - 6} y2={568} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.3" markerEnd="url(#ws-up-m)" />
      <line x1={rx - 4} y1={584} x2={lx + 6} y2={584} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.3" markerEnd="url(#ws-up-m)" />
      <SketchText x={(lx + rx) / 2} y={562} size={8.5} bold>
        close 1001 আর তার জবাব, তারপর TCP FIN (Module 05 লেসন ০৮)
      </SketchText>
      <SketchText x={20} y={580} size={9} anchor="start" bold>
        বিদায়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. একটা Frame এর Byte গুলো: RFC এর নিজের Hello                              */
/* ------------------------------------------------------------------------- */

const BIT_WIDTH = 34;
const BIT_GROUPS = [
  { bits: "1", name: "FIN" },
  { bits: "000", name: "RSV" },
  { bits: "0001", name: "opcode" },
  { bits: "1", name: "MASK" },
  { bits: "0000101", name: "length" },
].map((group, i, all) => ({
  ...group,
  x: 60 + all.slice(0, i).reduce((sum, g) => sum + g.bits.length * BIT_WIDTH + 6, 0),
  width: group.bits.length * BIT_WIDTH,
}));
const FRAME_BYTES = ["81", "85", "37", "fa", "21", "3d", "7f", "9f", "4d", "51", "58"];
const DECODED = ["48 H", "65 e", "6c l", "6c l", "6f o"];

export function WsFrameDiagram() {
  const bx = (i: number) => 60 + i * 68;
  return (
    <Sketch
      label="Diagram: একটা Frame, এগারো Byte"
      height={360}
      minWidth={860}
      viewBox="0 0 860 360"
      caption="RFC 6455 এর নিজের উদাহরণ: Browser থেকে Server এ Hello লেখা একটা Text Frame। উপরে প্রথম দুই Byte কে Bit এ ভেঙে দেখানো। FIN 1 মানে বার্তাটা এই এক Frame এই শেষ। opcode 0001 মানে Text। MASK 1 মানে Payload ঢাকা আছে। length 0000101 মানে 5, কারণ Hello পাঁচ অক্ষর। তারপর চার Byte এর Masking Key, আর শেষে পাঁচ Byte এর Payload, যেটা Key দিয়ে XOR করা বলে পড়া যায় না। নিচের সারিতে Server সেই XOR আবার করে আসল অক্ষর ফেরত পেয়েছে।"
    >
      {/* bit breakdown of byte 0 and byte 1 */}
      {BIT_GROUPS.map((group) => (
        <g key={group.name}>
          {group.bits.split("").map((bit, j) => (
            <g key={j}>
              <rect x={group.x + j * BIT_WIDTH} y={30} width={BIT_WIDTH - 2} height={30} fill={bit === "1" ? "var(--primary)" : "currentColor"} fillOpacity={bit === "1" ? 0.18 : 0.04} stroke="currentColor" strokeOpacity={0.45} />
              <SketchText x={group.x + j * BIT_WIDTH + 16} y={50} size={11} bold accent={bit === "1"}>
                {bit}
              </SketchText>
            </g>
          ))}
          <SketchText x={group.x + group.width / 2} y={78} size={8.5} bold>
            {group.name}
          </SketchText>
        </g>
      ))}
      <SketchText x={60 + 8 * 34 / 2 + 6} y={18} size={8.5} opacity={0.8}>
        Byte 0 = 0x81
      </SketchText>
      <SketchText x={60 + 8 * 34 + 18 + 8 * 34 / 2 + 6} y={18} size={8.5} opacity={0.8}>
        Byte 1 = 0x85
      </SketchText>

      {/* group labels */}
      {[
        { from: 0, to: 1, text: "Header, 2 Byte" },
        { from: 2, to: 5, text: "Masking Key, 4 Byte" },
        { from: 6, to: 10, text: "Payload, 5 Byte, ঢাকা অবস্থায়" },
      ].map((g) => (
        <g key={g.text}>
          <line x1={bx(g.from)} y1={136} x2={bx(g.to) + 60} y2={136} stroke="var(--primary)" strokeWidth="1.2" />
          <line x1={bx(g.from)} y1={136} x2={bx(g.from)} y2={144} stroke="var(--primary)" strokeWidth="1.2" />
          <line x1={bx(g.to) + 60} y1={136} x2={bx(g.to) + 60} y2={144} stroke="var(--primary)" strokeWidth="1.2" />
          <SketchText x={(bx(g.from) + bx(g.to) + 60) / 2} y={128} size={9} body bold accent>
            {g.text}
          </SketchText>
        </g>
      ))}
      {FRAME_BYTES.map((byte, i) => (
        <g key={i}>
          <rect
            x={bx(i)}
            y={150}
            width={60}
            height={40}
            fill={i < 2 ? "var(--primary)" : "currentColor"}
            fillOpacity={i < 2 ? 0.15 : i < 6 ? 0.1 : 0.04}
            stroke={i < 2 ? "var(--primary)" : "currentColor"}
            strokeOpacity={i < 2 ? 1 : 0.45}
          />
          <SketchText x={bx(i) + 30} y={175} size={12} bold accent={i < 2}>
            {byte}
          </SketchText>
        </g>
      ))}

      {/* decoding row */}
      {DECODED.map((text, i) => (
        <g key={text + i}>
          <line x1={bx(i + 6) + 30} y1={194} x2={bx(i + 6) + 30} y2={210} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="3 3" />
          <line x1={bx(i + 6) + 30} y1={230} x2={bx(i + 6) + 30} y2={238} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="3 3" />
          <SketchText x={bx(i + 6) + 30} y={224} size={8} opacity={0.75}>
            {`^ ${FRAME_BYTES[2 + (i % 4)]}`}
          </SketchText>
          <rect x={bx(i + 6)} y={242} width={60} height={40} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeOpacity={0.7} />
          <SketchText x={bx(i + 6) + 30} y={267} size={11} bold accent>
            {text}
          </SketchText>
        </g>
      ))}
      <SketchText x={bx(5) + 50} y={267} size={9} anchor="end" body>
        Server Mask খুলে পেল
      </SketchText>
      <SketchText x={430} y={320} size={9} body opacity={0.85}>
        Server থেকে Browser এ একই Hello গেলে: 81 05 48 65 6c 6c 6f, সাত Byte, কোনো Mask নেই
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. পথের মাঝের সবাই, আর তাদের ধৈর্য                                           */
/* ------------------------------------------------------------------------- */

const PATH_BOXES = [
  { x: 20, w: 130, text: "ফোন", sub: "192.168.1.20:51522", accent: true },
  { x: 190, w: 140, text: "বাসার Router", sub: "NAT, 203.0.113.25:62005" },
  { x: 370, w: 120, text: "Internet এর Hop", sub: "শুধু Packet পার করে", dashed: true },
  { x: 530, w: 140, text: "Caddy", sub: "103.94.135.2:443" },
  { x: 710, w: 130, text: "App", sub: "127.0.0.1:3000" },
];

export function WsProxyPathDiagram() {
  return (
    <Sketch
      label="Diagram: একটা WebSocket এর পথ, wss থেকে ws"
      height={300}
      minWidth={860}
      viewBox="0 0 860 300"
      caption="ফোন থেকে Caddy পর্যন্ত রাস্তাটা wss, মানে TLS দিয়ে মোড়া, ঠিক HTTPS এর মতো। Caddy সেখানে TLS খুলে ফেলে আর VPS এর ভেতরে App এর সাথে কথা বলে সাধারণ ws এ, কারণ সেই রাস্তা কখনো বাইরে যায় না। মাঝের দুইজনের পাশে ঘড়ি আঁকা আছে, বাসার Router এর NAT টেবিল আর Caddy। পথে কোনো Load Balancer বা Firewall থাকলে তারও একই ঘড়ি থাকে। এরা সবাই চুপচাপ পড়ে থাকা Connection কিছুক্ষণ পরে ভুলে যেতে পারে (Module 05 লেসন ০৮)। নিচের দুই তীর সেই সমস্যার সমাধান: App প্রতি 25 সেকেন্ডে একটা ছোট ping পাঠায়, Browser নিজে থেকে pong ফেরত দেয়, আর পথের সবাই দেখে Connection টা এখনো বেঁচে আছে।"
    >
      <Arrow id="ws-path-a" />
      <MutedArrow id="ws-path-m" />
      <rect x={85} y={34} width={515} height={20} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeOpacity={0.7} />
      <SketchText x={342} y={48} size={9} bold accent>
        wss://, TLS দিয়ে মোড়া (লেসন ০৭)
      </SketchText>
      <rect x={600} y={34} width={175} height={20} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 3" />
      <SketchText x={687} y={48} size={9} bold>
        ws://, VPS এর ভেতরে
      </SketchText>
      {PATH_BOXES.map((b) => (
        <Box key={b.text} x={b.x} y={84} w={b.w} h={52} text={b.text} sub={b.sub} accent={b.accent} dashed={b.dashed} />
      ))}
      {[150, 330, 490, 670].map((x) => (
        <line key={x} x1={x + 2} y1={110} x2={x + 36} y2={110} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#ws-path-a)" />
      ))}
      {[260, 600].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={160} r={9} fill="none" stroke="var(--primary)" strokeWidth="1.2" />
          <line x1={cx} y1={160} x2={cx} y2={154} stroke="var(--primary)" strokeWidth="1.2" />
          <line x1={cx} y1={160} x2={cx + 5} y2={160} stroke="var(--primary)" strokeWidth="1.2" />
          <SketchText x={cx} y={186} size={8.5} body accent bold>
            চুপ থাকলে ভুলে যায়
          </SketchText>
        </g>
      ))}
      <line x1={773} y1={222} x2={88} y2={222} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#ws-path-a)" />
      <SketchText x={430} y={216} size={9} bold accent>
        ping, প্রতি 25 s (App থেকে)
      </SketchText>
      <line x1={88} y1={256} x2={773} y2={256} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.3" markerEnd="url(#ws-path-m)" />
      <SketchText x={430} y={250} size={9} bold>
        pong (Browser নিজে থেকে)
      </SketchText>
      <SketchText x={430} y={284} size={8.5} body opacity={0.8}>
        দুইটাই মাত্র কয়েক Byte, কিন্তু পথের প্রতিটা ঘড়ি আবার শূন্য থেকে শুরু হয়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 7. অনেক Server, একটা খবর: Redis Pub/Sub                                     */
/* ------------------------------------------------------------------------- */

export function WsFanOutDiagram() {
  return (
    <Sketch
      label="Diagram: এক Container এ বুকিং, সব Container এর পর্যটক জানেন"
      height={340}
      minWidth={860}
      viewBox="0 0 860 340"
      caption="প্রতিটা WebSocket একটা নির্দিষ্ট API Container এর সাথে বাঁধা। পর্যটক A এর Connection API 1 এ, C আর D এর API 2 তে। এখন পর্যটক B আসন 14A বুক করলেন, তাঁর Request গেল API 1 এ। API 1 নিজের পর্যটকদের জানাতে পারে, কিন্তু C আর D যে API 2 তে বসে আছেন, সেটা সে জানেই না। তাই API 1 খবরটা Redis এর একটা Channel এ PUBLISH করে। দুইটা Container ই সেই Channel এ SUBSCRIBE করে রেখেছে, তাই দুইজনই খবর পায়, আর যার যার পর্যটকদের Frame পাঠায়।"
    >
      <Arrow id="ws-fan-a" />
      <Box x={20} y={40} w={150} h={52} text="পর্যটক B" sub="POST /api/bookings" />
      <line x1={172} y1={66} x2={244} y2={66} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.3" markerEnd="url(#ws-fan-a)" />
      <Box x={250} y={40} w={150} h={52} text="API 1" sub="Container" accent />
      <Box x={250} y={240} w={150} h={52} text="API 2" sub="Container" accent />
      <Box x={460} y={140} w={180} h={56} text="Redis" sub="seats:saint-martin:2026-12-20" />

      <line x1={325} y1={94} x2={454} y2={160} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ws-fan-a)" />
      <SketchText x={360} y={140} size={8.5} anchor="end" bold accent>
        PUBLISH
      </SketchText>
      <path d="M490,198 C470,222 360,214 330,236" fill="none" stroke="var(--primary)" strokeWidth="1.4" strokeDasharray="5 4" markerEnd="url(#ws-fan-a)" />
      <path d="M560,138 C560,100 480,72 406,72" fill="none" stroke="var(--primary)" strokeWidth="1.4" strokeDasharray="5 4" markerEnd="url(#ws-fan-a)" />
      <SketchText x={600} y={92} size={8.5} body accent>
        দুইজনকেই পৌঁছায়
      </SketchText>
      <SketchText x={560} y={216} size={8.5} anchor="start" body accent>
        দুইজনই SUBSCRIBE করে রেখেছে
      </SketchText>

      <Box x={700} y={22} w={140} h={44} text="পর্যটক A" sub="WebSocket, API 1 এ" />
      <Box x={700} y={226} w={140} h={44} text="পর্যটক C" sub="WebSocket, API 2 তে" />
      <Box x={700} y={282} w={140} h={44} text="পর্যটক D" sub="WebSocket, API 2 তে" />
      <path d="M400,52 C520,20 620,30 694,42" fill="none" stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ws-fan-a)" />
      <line x1={402} y1={262} x2={694} y2={248} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ws-fan-a)" />
      <line x1={402} y1={276} x2={694} y2={302} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#ws-fan-a)" />
      <SketchText x={560} y={22} size={8.5} bold accent>
        seat_sold 14A
      </SketchText>
      <SketchText x={600} y={318} size={8.5} bold accent>
        seat_sold 14A
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 8. পুরো Module, একটা গল্প                                                   */
/* ------------------------------------------------------------------------- */

const STORY = [
  { n: "01", title: "URL", sub: "কোথায়, কী চাই" },
  { n: "02", title: "HTTP Message", sub: "TCP এর উপর লেখা চিঠি" },
  { n: "03", title: "Method, Status", sub: "কী চাই, কী হলো" },
  { n: "04", title: "Headers", sub: "চিঠির খামের লেখা" },
  { n: "05", title: "Cookie", sub: "ভুলে যাওয়া Server এর স্মৃতি" },
  { n: "06", title: "Session, JWT", sub: "আপনি কে, প্রমাণ" },
  { n: "07", title: "TLS", sub: "কেউ পড়তে না পারে" },
  { n: "08", title: "Certificate", sub: "ওপাশে সত্যিই কে" },
  { n: "09", title: "Full Journey", sub: "সব একসাথে" },
  { n: "10", title: "WebSocket", sub: "Server ও আগে বলে" },
];

export function WsModuleStoryDiagram() {
  const xs = [20, 190, 360, 530, 700];
  return (
    <Sketch
      label="Diagram: Module 06 এর দশটা লেসন, একটা পথে"
      height={250}
      minWidth={860}
      viewBox="0 0 860 250"
      caption="উপরের সারি বাঁ থেকে ডানে, তারপর নিচের সারি ডান থেকে বাঁয়ে। প্রথম পাঁচটা লেসন একটা HTTP চিঠি নিজে কেমন: ঠিকানা, চিঠির গঠন, কাজের নাম আর ফলাফল, খামের লেখা, আর Server এর ভুলে যাওয়ার সমস্যার সমাধান। পরের তিনটা সেই চিঠিকে নিরাপদ করে: কে পাঠাচ্ছে, কেউ যেন পড়তে না পারে, আর ওপাশে যে আছে সে সত্যিই সে কি না। নবম লেসন সবগুলোকে এক Request এ জুড়েছে। আর দশম লেসন, আজকেরটা, চিঠির নিয়মটাই ভেঙে দিয়েছে: এখন Server ও আগে কথা বলতে পারে।"
    >
      <Arrow id="ws-story-a" />
      {STORY.slice(0, 5).map((s, i) => (
        <g key={s.n}>
          <Box x={xs[i]} y={30} w={150} h={58} text={`${s.n} ${s.title}`} sub={s.sub} />
          {i < 4 && <line x1={xs[i] + 152} y1={59} x2={xs[i + 1] - 4} y2={59} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#ws-story-a)" />}
        </g>
      ))}
      <path d="M850,59 C858,59 858,169 852,169" fill="none" stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#ws-story-a)" />
      {STORY.slice(5).map((s, i) => {
        const x = xs[4 - i];
        return (
          <g key={s.n}>
            <Box x={x} y={140} w={150} h={58} text={`${s.n} ${s.title}`} sub={s.sub} accent={s.n === "10"} />
            {i < 4 && <line x1={x - 2} y1={169} x2={xs[3 - i] + 154} y2={169} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#ws-story-a)" />}
          </g>
        );
      })}
      <SketchText x={430} y={232} size={9} body opacity={0.85}>
        প্রথম পাঁচটা: চিঠিটা কেমন। পরের তিনটা: চিঠিটা নিরাপদ কীভাবে। শেষ দুইটা: সব একসাথে, আর নিয়মের বাইরে।
      </SketchText>
    </Sketch>
  );
}
