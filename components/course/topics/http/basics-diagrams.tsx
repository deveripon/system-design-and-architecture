/**
 * What: The still pictures for the HTTP Protocol Basics lesson: HTTP riding on TCP, one request and
 * its response, the parts of each message, one IP serving many sites, how a body ends, keep-alive,
 * HTTP/2 multiplexing and the machines that sit between a browser and an app.
 *
 * Why: Every one of these ideas is a shape (a stack, a timeline, a message split into parts), and a
 * beginner holds a shape far longer than a paragraph. Each marker id starts with "basics-" so two
 * drawings on the same page never share one.
 */
import { Sketch, SketchSplit, SketchText } from "../../sketch";

function Arrow({ id, faded }: { id: string; faded?: boolean }) {
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
          fill={faded ? "currentColor" : "var(--primary)"}
          fillOpacity={faded ? 0.5 : 1}
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
/* 1. HTTP কথা বলে, TCP শুধু Byte বয়ে নেয়                                     */
/* ------------------------------------------------------------------------- */

export function HttpOnTcpDiagram() {
  return (
    <Sketch
      label="Diagram: HTTP এর কথা, TCP এর Byte, IP এর Packet"
      height={380}
      minWidth={860}
      viewBox="0 0 860 380"
      caption="বাঁ দিকে পর্যটকের ফোনের Browser, ডান দিকে Island Tours এর Server এ Caddy। দুই পাশে একই তিনটা তলা, Module 05 এর TCP/IP Model থেকে চেনা। সবচেয়ে উপরের তলায় দুই Program একটা জানা ভাষায় কথা বলছে, সেই ভাষার নাম HTTP। মাঝের তলায় TCP সেই লেখাটাকে শুধু Byte এর একটা ধারা হিসেবে দেখে, 47 45 54 মানে যে GET, সেটা সে জানেও না, জানার দরকারও নেই। নিচের তলায় IP সেই Byte গুলো Packet এ ভরে Hop থেকে Hop এ পাঠায়। তীরগুলো দেখায় লেখাটা ফোনে নিচে নামে আর Server এ আবার উপরে ওঠে।"
    >
      <Arrow id="basics-stack-a" />
      <Arrow id="basics-stack-b" faded />

      <SketchText x={150} y={24} size={10} bold accent>
        ফোন, Browser
      </SketchText>
      <SketchText x={710} y={24} size={10} bold>
        Server 103.94.135.2, Caddy
      </SketchText>

      {[
        { y: 44, t: "Application", s: "HTTP: GET /tours/saint-martin" },
        { y: 144, t: "Transport, TCP", s: "Byte এর নির্ভুল ধারা" },
        { y: 244, t: "Internet, IP", s: "Packet, ঠিকানা সহ" },
      ].map((row, i) => (
        <g key={row.t}>
          <Box x={40} y={row.y} w={220} h={56} text={row.t} sub={row.s} accent={i === 0} />
          <Box x={600} y={row.y} w={220} h={56} text={row.t} sub={row.s} accent={i === 0} />
        </g>
      ))}

      <line x1={150} y1={102} x2={150} y2={140} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#basics-stack-a)" />
      <line x1={150} y1={202} x2={150} y2={240} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#basics-stack-a)" />
      <line x1={710} y1={240} x2={710} y2={204} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#basics-stack-a)" />
      <line x1={710} y1={140} x2={710} y2={104} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#basics-stack-a)" />

      {/* HTTP তলা: দুই Program এর মাঝে চুক্তি */}
      <line x1={266} y1={72} x2={594} y2={72} stroke="var(--primary)" strokeWidth="1.3" strokeDasharray="5 4" markerEnd="url(#basics-stack-a)" />
      <SketchText x={430} y={62} size={10} bold accent>
        GET /tours/saint-martin HTTP/1.1
      </SketchText>
      <SketchText x={430} y={90} size={8.5} body opacity={0.8}>
        দুই পাশ একই ভাষা জানে, এটাই HTTP
      </SketchText>

      {/* TCP তলা: শুধু Byte */}
      <line x1={266} y1={172} x2={594} y2={172} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" strokeDasharray="5 4" markerEnd="url(#basics-stack-b)" />
      <SketchText x={430} y={162} size={10} bold>
        47 45 54 20 2f 74 6f 75 72 ...
      </SketchText>
      <SketchText x={430} y={190} size={8.5} body opacity={0.8}>
        TCP এর চোখে অর্থহীন Byte, শুধু ক্রম আর নির্ভুলতা তার দায়িত্ব
      </SketchText>

      {/* IP তলা: Packet, Hop by Hop */}
      <line x1={266} y1={272} x2={594} y2={272} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" />
      {[300, 372, 444, 516].map((x) => (
        <rect key={x} x={x} y={262} width={44} height={20} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.45} />
      ))}
      <SketchText x={430} y={300} size={8.5} body opacity={0.8}>
        Packet গুলো Router থেকে Router এ, Module 02 এর Hop
      </SketchText>

      <SketchText x={430} y={340} size={9} body opacity={0.85}>
        TCP রাস্তা দিল, IP ঠিকানা দিল। কথাটার মানে দেয় শুধু HTTP।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা Request, একটা Response                                             */
/* ------------------------------------------------------------------------- */

export function RequestResponseDiagram() {
  const lx = 200;
  const rx = 660;
  return (
    <Sketch
      label="Diagram: Request আর Response এর আদান প্রদান"
      height={400}
      minWidth={860}
      viewBox="0 0 860 400"
      caption="বাঁ দিকে Client, এখানে পর্যটকের Browser। ডান দিকে Server। উপর থেকে নিচে সময় এগোচ্ছে। প্রথমে Client একটা Request পাঠায়, Server কাজ করে, তারপর ঠিক একটা Response ফেরত দেয়। এরপর আদান প্রদানটা শেষ। পরের Request আবার একদম শুরু থেকে আসে, আগেরটার কথা Server কে মনে করিয়ে দিতে হয়। খেয়াল করুন, প্রতিটা আলাপ শুরু করে Client। Server নিজে থেকে কখনো প্রথম কথা বলে না।"
    >
      <Arrow id="basics-rr-a" />
      <Box x={lx - 110} y={20} w={220} h={40} text="Client, Browser" sub="192.168.1.20" accent />
      <Box x={rx - 110} y={20} w={220} h={40} text="Server" sub="islandtours.example" />
      <line x1={lx} y1={64} x2={lx} y2={384} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={64} x2={rx} y2={384} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />

      <line x1={lx + 4} y1={100} x2={rx - 6} y2={130} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#basics-rr-a)" />
      <SketchText x={430} y={100} size={10} bold accent>
        ১. Request: GET /api/tours/saint-martin
      </SketchText>

      <rect x={rx - 8} y={136} width={16} height={46} fill="var(--primary)" fillOpacity={0.15} stroke="var(--primary)" />
      <SketchText x={rx + 18} y={156} size={8.5} anchor="start" body opacity={0.8}>
        ২. Server কাজ করে:
      </SketchText>
      <SketchText x={rx + 18} y={170} size={8.5} anchor="start" body opacity={0.8}>
        Database থেকে Tour পড়ে
      </SketchText>

      <line x1={rx - 4} y1={190} x2={lx + 6} y2={220} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#basics-rr-a)" />
      <SketchText x={430} y={194} size={10} bold accent>
        ৩. Response: 200 OK, সাথে Tour এর তথ্য
      </SketchText>

      <SketchText x={430} y={250} size={8.5} body opacity={0.7}>
        আদান প্রদান শেষ। Server এর কাছে এই আলাপের আর কোনো দায় নেই।
      </SketchText>

      <line x1={lx + 4} y1={282} x2={rx - 6} y2={308} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.4" markerEnd="url(#basics-rr-a)" />
      <SketchText x={430} y={284} size={10} bold>
        ৪. নতুন Request: POST /api/bookings
      </SketchText>
      <line x1={rx - 4} y1={330} x2={lx + 6} y2={356} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.4" markerEnd="url(#basics-rr-a)" />
      <SketchText x={430} y={334} size={10} bold>
        ৫. নতুন Response: 201 Created
      </SketchText>
      <SketchText x={430} y={378} size={8.5} body opacity={0.7}>
        প্রতিটা Request এর জন্য ঠিক একটা Response, আর প্রতিবার শুরু করে Client
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3 ও 4. Message এর ভেতরের অংশ                                               */
/* ------------------------------------------------------------------------- */

type AnatomyLine = { text: string; part: "start" | "header" | "blank" | "body" };

function MessageAnatomy({
  lines,
  parts,
  startLabels,
}: {
  lines: AnatomyLine[];
  parts: { part: AnatomyLine["part"]; label: string; note: string }[];
  startLabels: { x: number; w: number; label: string }[];
}) {
  const top = 44;
  const lineH = 30;
  const textX = 40;
  const rowY = (i: number) => top + i * lineH;
  return (
    <>
      {lines.map((line, i) => (
        <g key={`${line.part}-${i}`}>
          <rect
            x={28}
            y={rowY(i) - 19}
            width={540}
            height={26}
            fill={line.part === "start" ? "var(--primary)" : "currentColor"}
            fillOpacity={line.part === "start" ? 0.1 : line.part === "blank" ? 0 : 0.04}
            stroke={line.part === "blank" ? "var(--primary)" : "currentColor"}
            strokeOpacity={line.part === "blank" ? 0.9 : 0.25}
            strokeDasharray={line.part === "blank" ? "4 3" : undefined}
          />
          <SketchText x={textX} y={rowY(i)} size={10.5} anchor="start" bold={line.part === "start"} accent={line.part === "start"}>
            {line.text}
          </SketchText>
          <SketchText x={560} y={rowY(i)} size={8.5} anchor="end" opacity={0.55}>
            \r\n
          </SketchText>
        </g>
      ))}

      {startLabels.map((s) => (
        <g key={s.label}>
          <line x1={s.x} y1={top - 30} x2={s.x + s.w} y2={top - 30} stroke="var(--primary)" strokeWidth="1.2" />
          <line x1={s.x} y1={top - 34} x2={s.x} y2={top - 26} stroke="var(--primary)" strokeWidth="1.2" />
          <line x1={s.x + s.w} y1={top - 34} x2={s.x + s.w} y2={top - 26} stroke="var(--primary)" strokeWidth="1.2" />
          <SketchText x={s.x + s.w / 2} y={top - 36} size={8.5} bold accent>
            {s.label}
          </SketchText>
        </g>
      ))}

      {parts.map((p) => {
        const idx = lines.map((l, i) => (l.part === p.part ? i : -1)).filter((i) => i >= 0);
        const y1 = rowY(idx[0]) - 19;
        const y2 = rowY(idx[idx.length - 1]) + 7;
        return (
          <g key={p.part}>
            <line x1={590} y1={y1} x2={590} y2={y2} stroke="var(--primary)" strokeWidth="1.5" />
            <line x1={586} y1={y1} x2={594} y2={y1} stroke="var(--primary)" strokeWidth="1.5" />
            <line x1={586} y1={y2} x2={594} y2={y2} stroke="var(--primary)" strokeWidth="1.5" />
            <SketchText x={604} y={(y1 + y2) / 2 - 2} size={10} anchor="start" bold accent>
              {p.label}
            </SketchText>
            <SketchText x={604} y={(y1 + y2) / 2 + 12} size={8.5} anchor="start" body opacity={0.8}>
              {p.note}
            </SketchText>
          </g>
        );
      })}
    </>
  );
}

export function RequestAnatomyDiagram() {
  return (
    <Sketch
      label="Diagram: একটা HTTP Request এর চার অংশ"
      height={250}
      minWidth={880}
      viewBox="0 0 880 250"
      caption="Island Tours এ একটা বুকিং পাঠানোর আসল Request, যেমনটা তারে যায় (HTTP/1.1 এ)। প্রথম লাইনটা Request Line, তার তিন টুকরো: Method (কী করতে চাই), Target (কোন জিনিসটা নিয়ে), Version (কোন নিয়মে কথা বলছি)। তারপর Header গুলো, প্রতিটা এক লাইনে নাম, কোলন, মান। তারপর একটা পুরো ফাঁকা লাইন, যেটা দেখে Server বোঝে Header শেষ। সবশেষে Body, এখানে বুকিং এর তথ্য, ঠিক 54 Byte, যেটা Content-Length আগেই বলে রেখেছে। প্রতিটা লাইনের শেষে অদৃশ্য দুইটা অক্ষর \r\n থাকে।"
    >
      <MessageAnatomy
        lines={[
          { text: "POST /api/bookings HTTP/1.1", part: "start" },
          { text: "Host: islandtours.example", part: "header" },
          { text: "Content-Type: application/json", part: "header" },
          { text: "Content-Length: 54", part: "header" },
          { text: "Accept: application/json", part: "header" },
          { text: "", part: "blank" },
          { text: '{"tour":"saint-martin","date":"2026-12-20","guests":2}', part: "body" },
        ]}
        startLabels={[
          { x: 40, w: 25, label: "Method" },
          { x: 72, w: 82, label: "Target" },
          { x: 160, w: 50, label: "Version" },
        ]}
        parts={[
          { part: "start", label: "Request Line", note: "কী চাই, কোনটা, কোন নিয়মে" },
          { part: "header", label: "Headers", note: "Request এর সাথে বাড়তি তথ্য" },
          { part: "blank", label: "ফাঁকা লাইন", note: "এখানেই Header শেষ" },
          { part: "body", label: "Body", note: "আসল তথ্য, ঐচ্ছিক" },
        ]}
      />
    </Sketch>
  );
}

export function ResponseAnatomyDiagram() {
  return (
    <Sketch
      label="Diagram: একটা HTTP Response এর চার অংশ"
      height={250}
      minWidth={880}
      viewBox="0 0 880 250"
      caption="উপরের বুকিং এর উত্তর। গঠনটা Request এর মতোই, শুধু প্রথম লাইনটা আলাদা। এখানে প্রথম লাইনের নাম Status Line, তার তিন টুকরো: Version, Status Code (তিন অঙ্কের একটা সংখ্যা, 201 মানে নতুন কিছু তৈরি হয়েছে), আর Reason Phrase (মানুষের পড়ার জন্য ছোট একটা লেখা)। Location Header বলছে নতুন বুকিংটা কোন ঠিকানায় পাওয়া যাবে। Body তে ঠিক 39 Byte।"
    >
      <MessageAnatomy
        lines={[
          { text: "HTTP/1.1 201 Created", part: "start" },
          { text: "Date: Sat, 31 Oct 2026 06:30:00 GMT", part: "header" },
          { text: "Content-Type: application/json; charset=utf-8", part: "header" },
          { text: "Content-Length: 39", part: "header" },
          { text: "Location: /api/bookings/bk_7Q2M9X", part: "header" },
          { text: "", part: "blank" },
          { text: '{"id":"bk_7Q2M9X","status":"confirmed"}', part: "body" },
        ]}
        startLabels={[
          { x: 40, w: 50, label: "Version" },
          { x: 97, w: 19, label: "Code" },
          { x: 122, w: 44, label: "Reason" },
        ]}
        parts={[
          { part: "start", label: "Status Line", note: "কোন নিয়মে, ফলাফল কী" },
          { part: "header", label: "Headers", note: "উত্তরের সাথে বাড়তি তথ্য" },
          { part: "blank", label: "ফাঁকা লাইন", note: "এখানেই Header শেষ" },
          { part: "body", label: "Body", note: "উত্তরের আসল তথ্য" },
        ]}
      />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. এক IP, অনেক সাইট: Host Header                                          */
/* ------------------------------------------------------------------------- */

const VHOSTS = [
  { y: 50, host: "Host: islandtours.example", to: "App, 127.0.0.1:3000", note: "মূল সাইট", accent: true },
  { y: 120, host: "Host: www.islandtours.example", to: "308, islandtours.example এ যান", note: "Caddy নিজেই উত্তর দেয়", accent: false },
  { y: 190, host: "Host: admin.islandtours.example", to: "Admin App, 127.0.0.1:3001", note: "ধরি এটাও একই Server এ", accent: false },
  { y: 260, host: "Host: unknown.example", to: "এই নামে কোনো সাইট নেই", note: "Caddy প্রত্যাখ্যান করে", accent: false },
];

export function VirtualHostDiagram() {
  return (
    <Sketch
      label="Diagram: একই IP তে চারটা আলাদা Host"
      height={330}
      minWidth={880}
      viewBox="0 0 880 330"
      caption="চারটা Request একই IP আর একই Port এ আসছে, 103.94.135.2:443। TCP আর IP এর চোখে চারটাই হুবহু এক রকম। তফাতটা শুধু Request এর ভেতরের একটা লাইনে, Host Header এ। Caddy প্রতিটা Request এর Host লাইনটা পড়ে ঠিক করে কাকে পাঠাবে। এই কৌশলের নাম Virtual Hosting, আর এই কারণেই Module 04 এর Domain Setup লেসনে বলা হয়েছিল, DNS এ Record বসানোই যথেষ্ট নয়, Server এর দিকেও Domain টা যোগ করতে হয়।"
    >
      <Arrow id="basics-vh-a" />
      <Arrow id="basics-vh-b" faded />
      <Box x={370} y={130} w={150} h={70} text="Caddy" sub="103.94.135.2:443" accent />
      {VHOSTS.map((v) => (
        <g key={v.host}>
          <Box x={20} y={v.y} w={250} h={40} text={v.host} size={9} accent={v.accent} />
          <line x1={272} y1={v.y + 20} x2={366} y2={165} stroke={v.accent ? "var(--primary)" : "currentColor"} strokeOpacity={v.accent ? 1 : 0.45} strokeWidth="1.3" markerEnd={v.accent ? "url(#basics-vh-a)" : "url(#basics-vh-b)"} />
          <line x1={522} y1={165} x2={606} y2={v.y + 20} stroke={v.accent ? "var(--primary)" : "currentColor"} strokeOpacity={v.accent ? 1 : 0.45} strokeWidth="1.3" markerEnd={v.accent ? "url(#basics-vh-a)" : "url(#basics-vh-b)"} />
          <Box x={610} y={v.y} w={250} h={40} text={v.to} size={9} accent={v.accent} dashed={v.y === 260} />
          <SketchText x={735} y={v.y + 54} size={8} body opacity={0.7}>
            {v.note}
          </SketchText>
        </g>
      ))}
      <SketchText x={445} y={226} size={8.5} body opacity={0.8}>
        Host লাইন পড়ে
      </SketchText>
      <SketchText x={445} y={240} size={8.5} body opacity={0.8}>
        ঠিক করে কার কাছে যাবে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. Body কোথায় শেষ: Content-Length বনাম chunked                            */
/* ------------------------------------------------------------------------- */

function ByteCells({ x, y, text, accentCount }: { x: number; y: number; text: string; accentCount?: number }) {
  const w = 15;
  return (
    <g>
      {text.split("").map((ch, i) => (
        <g key={i}>
          <rect
            x={x + i * w}
            y={y}
            width={w - 1}
            height={20}
            fill={accentCount === undefined || i < accentCount ? "var(--primary)" : "currentColor"}
            fillOpacity={accentCount === undefined || i < accentCount ? 0.12 : 0.04}
            stroke="currentColor"
            strokeOpacity={0.3}
          />
          <SketchText x={x + i * w + 7} y={y + 14} size={8.5}>
            {ch === "\n" ? "\\n" : ch === " " ? "·" : ch}
          </SketchText>
        </g>
      ))}
    </g>
  );
}

export function BodyEndSplit() {
  return (
    <SketchSplit
      label="Diagram: Body কোথায় শেষ, দুইটা উপায়"
      caption="TCP শুধু Byte এর একটা লম্বা ধারা দেয়, কোথায় এক উত্তর শেষ আর পরেরটা শুরু, সেই দাগ সে টানে না। তাই HTTP কে নিজেই বলে দিতে হয় Body কোথায় শেষ। বাঁ দিকে Content-Length: Server আগেই বলে দেয় 15 Byte আসছে, গ্রাহক গুনে গুনে 15 টা নেয়। ডান দিকে chunked: মাপ আগে জানা নেই, তাই প্রতিটা টুকরোর আগে তার মাপ লেখা থাকে Hex এ (d মানে 13), আর মাপ 0 মানে শেষ। দুইটা উদাহরণই এই লেসনের Lab এর Server থেকে নেওয়া আসল উত্তর।"
      panels={[
        {
          title: "Content-Length",
          sub: "মাপ আগেই জানা",
          viewBox: "0 0 300 200",
          height: 200,
          children: (
            <>
              <SketchText x={10} y={24} size={10} anchor="start" bold accent>
                Content-Length: 15
              </SketchText>
              <SketchText x={10} y={44} size={8.5} anchor="start" body opacity={0.8}>
                গ্রাহক এখন জানে ঠিক কত Byte গুনতে হবে
              </SketchText>
              <ByteCells x={10} y={64} text={"seats left: 12\n"} />
              <line x1={10} y1={96} x2={234} y2={96} stroke="var(--primary)" strokeWidth="1.2" />
              <SketchText x={122} y={112} size={8.5} bold accent>
                15 Byte গোনা শেষ
              </SketchText>
              <ByteCells x={10} y={130} text="HTTP/1.1 ..." accentCount={0} />
              <SketchText x={10} y={172} size={8.5} anchor="start" body opacity={0.8}>
                এর পরের Byte থেকে নতুন উত্তর শুরু
              </SketchText>
            </>
          ),
        },
        {
          title: "Transfer-Encoding: chunked",
          sub: "মাপ আগে জানা নেই",
          viewBox: "0 0 300 200",
          height: 200,
          children: (
            <>
              {[
                { y: 10, size: "d", text: "boat 1 ready\n" },
                { y: 52, size: "d", text: "boat 2 ready\n" },
                { y: 94, size: "d", text: "boat 3 ready\n" },
              ].map((c) => (
                <g key={c.y}>
                  <rect x={10} y={c.y} width={22} height={20} fill="var(--primary)" fillOpacity={0.25} stroke="var(--primary)" />
                  <SketchText x={21} y={c.y + 14} size={9} bold accent>
                    {c.size}
                  </SketchText>
                  <ByteCells x={40} y={c.y} text={c.text} />
                  <SketchText x={40} y={c.y + 34} size={7.5} body opacity={0.7}>
                    {"মাপ d = 13 Byte, তারপর ঠিক 13 Byte"}
                  </SketchText>
                </g>
              ))}
              <rect x={10} y={142} width={22} height={20} fill="var(--primary)" fillOpacity={0.25} stroke="var(--primary)" />
              <SketchText x={21} y={156} size={9} bold accent>
                0
              </SketchText>
              <SketchText x={42} y={156} size={8.5} anchor="start" body opacity={0.85}>
                মাপ শূন্য, মানে Body এখানেই শেষ
              </SketchText>
            </>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 7. প্রতিবার নতুন Connection বনাম একটাই Connection                        */
/* ------------------------------------------------------------------------- */

function Timeline({ reuse, id }: { reuse: boolean; id: string }) {
  const lx = 50;
  const rx = 250;
  const rows: { y: number; kind: "hs" | "rq" | "rs" | "fin"; label: string }[] = [];
  let y = 30;
  const rounds = reuse ? 1 : 3;
  for (let r = 0; r < rounds; r++) {
    rows.push({ y, kind: "hs", label: "TCP Handshake" });
    y += 26;
    const reqs = reuse ? 3 : 1;
    for (let q = 0; q < reqs; q++) {
      rows.push({ y, kind: "rq", label: `Request ${reuse ? q + 1 : r + 1}` });
      y += 22;
      rows.push({ y, kind: "rs", label: "Response" });
      y += 22;
    }
    rows.push({ y, kind: "fin", label: "বন্ধ" });
    y += 26;
  }
  return (
    <>
      <Arrow id={id} />
      <SketchText x={lx} y={16} size={9} bold accent>
        Browser
      </SketchText>
      <SketchText x={rx} y={16} size={9} bold>
        Server
      </SketchText>
      <line x1={lx} y1={22} x2={lx} y2={300} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3 4" />
      <line x1={rx} y1={22} x2={rx} y2={300} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3 4" />
      {rows.map((row, i) =>
        row.kind === "hs" || row.kind === "fin" ? (
          <g key={i}>
            <rect x={lx + 6} y={row.y - 10} width={rx - lx - 12} height={16} fill="currentColor" fillOpacity={row.kind === "hs" ? 0.1 : 0.04} stroke="currentColor" strokeOpacity={0.3} strokeDasharray={row.kind === "fin" ? "3 3" : undefined} />
            <SketchText x={(lx + rx) / 2} y={row.y + 2} size={8} body={row.kind === "fin"}>
              {row.label}
            </SketchText>
          </g>
        ) : (
          <g key={i}>
            <line x1={row.kind === "rq" ? lx + 4 : rx - 4} y1={row.y} x2={row.kind === "rq" ? rx - 6 : lx + 6} y2={row.y} stroke="var(--primary)" strokeWidth="1.3" markerEnd={`url(#${id})`} />
            <SketchText x={(lx + rx) / 2} y={row.y - 4} size={7.5} accent>
              {row.label}
            </SketchText>
          </g>
        ),
      )}
    </>
  );
}

export function KeepAliveSplit() {
  return (
    <SketchSplit
      label="Diagram: তিনটা Request, দুইভাবে"
      caption="বাঁ দিকে পুরনো HTTP/1.0 এর অভ্যাস: প্রতিটা Request এর জন্য নতুন TCP Connection, মানে প্রতিবার আগে একটা Handshake আর শেষে বিদায়। তিন Request এ তিনটা Handshake। ডান দিকে HTTP/1.1 এর Keep-Alive: একবার Handshake, তারপর একই Connection দিয়ে তিনটা Request একটার পর একটা। প্রতিটা Handshake এ অন্তত একটা Round Trip যায় (Module 05 এর Three-way Handshake লেসন), আর HTTPS হলে তার উপরে TLS এর আরও একটা। তাই Connection আবার ব্যবহার করাটা সময়ের বড় সাশ্রয়।"
      panels={[
        {
          title: "HTTP/1.0",
          sub: "প্রতিবার নতুন Connection",
          viewBox: "0 0 300 310",
          height: 310,
          children: <Timeline reuse={false} id="basics-ka-a" />,
        },
        {
          title: "HTTP/1.1 Keep-Alive",
          sub: "একটা Connection, অনেক Request",
          viewBox: "0 0 300 310",
          height: 310,
          children: <Timeline reuse id="basics-ka-b" />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 8. HTTP/1.1 এর লাইন বনাম HTTP/2 এর এক রাস্তায় মিশে যাওয়া               */
/* ------------------------------------------------------------------------- */

const H1_LANES = [
  ["style.css"],
  ["app.js"],
  ["boat-1.jpg"],
  ["boat-2.jpg"],
  ["boat-3.jpg"],
  ["map.svg"],
];

const H2_FRAMES = [1, 3, 5, 1, 7, 3, 9, 5, 11, 1, 3, 7, 9, 5, 11, 13, 15, 13, 15, 7];

export function MultiplexDiagram() {
  return (
    <Sketch
      label="Diagram: ছয়টা লাইন বনাম একটা রাস্তায় মেশানো Frame"
      height={400}
      minWidth={880}
      viewBox="0 0 880 400"
      caption="উপরে HTTP/1.1। একটা Connection এ একসাথে একটাই উত্তর চলতে পারে, তাই Browser একটা Host এর জন্য সাধারণত ছয়টা পর্যন্ত Connection খোলে। সাত নম্বর আর আট নম্বর ফাইলকে লাইনে দাঁড়াতে হয়, কোনো একটা Connection খালি না হওয়া পর্যন্ত। নিচে HTTP/2। একটাই TCP Connection, তার ভেতরে প্রতিটা ফাইল একটা আলাদা Stream, আর প্রতিটা Stream এর টুকরো, যাকে বলে Frame, একটার ফাঁকে আরেকটা ঢুকে যায়। বাক্সের ভেতরের সংখ্যাটা Stream ID। কেউ কারো জন্য লাইনে দাঁড়ায় না।"
    >
      <SketchText x={20} y={24} size={10} anchor="start" bold>
        HTTP/1.1: ছয়টা আলাদা TCP Connection, প্রতিটায় একবারে একটা উত্তর
      </SketchText>
      {H1_LANES.map((lane, i) => (
        <g key={lane[0]}>
          <line x1={140} y1={50 + i * 26} x2={860} y2={50 + i * 26} stroke="currentColor" strokeOpacity={0.25} />
          <SketchText x={20} y={54 + i * 26} size={8.5} anchor="start" opacity={0.75}>
            {`Connection ${i + 1}`}
          </SketchText>
          <rect x={150} y={40 + i * 26} width={300 + (i % 3) * 60} height={20} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeOpacity={0.6} />
          <SketchText x={160} y={54 + i * 26} size={8.5} anchor="start" accent>
            {lane[0]}
          </SketchText>
        </g>
      ))}
      <rect x={480} y={40} width={220} height={20} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.5} strokeDasharray="4 3" />
      <SketchText x={490} y={54} size={8.5} anchor="start">
        logo.png, লাইনে দাঁড়িয়ে ছিল
      </SketchText>
      <rect x={530} y={66} width={220} height={20} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.5} strokeDasharray="4 3" />
      <SketchText x={540} y={80} size={8.5} anchor="start">
        font.woff2, লাইনে দাঁড়িয়ে ছিল
      </SketchText>

      <SketchText x={20} y={242} size={10} anchor="start" bold accent>
        HTTP/2: একটাই TCP Connection, ভেতরে অনেক Stream
      </SketchText>
      <rect x={140} y={262} width={720} height={46} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeOpacity={0.7} />
      <SketchText x={20} y={290} size={8.5} anchor="start" opacity={0.75}>
        Connection 1
      </SketchText>
      {H2_FRAMES.map((s, i) => (
        <g key={i}>
          <rect x={150 + i * 35} y={272} width={30} height={26} fill={s % 4 === 1 ? "var(--primary)" : "currentColor"} fillOpacity={s % 4 === 1 ? 0.2 : 0.08} stroke="currentColor" strokeOpacity={0.4} />
          <SketchText x={165 + i * 35} y={289} size={8.5} bold>
            {String(s)}
          </SketchText>
        </g>
      ))}
      <SketchText x={500} y={336} size={8.5} body opacity={0.8}>
        Stream 1 = style.css, 3 = app.js, 5 = boat-1.jpg, এভাবে। Client এর খোলা Stream এর ID সবসময় বেজোড়।
      </SketchText>
      <SketchText x={500} y={362} size={8.5} body opacity={0.8}>
        তবে নিচে TCP একটাই। একটা Packet হারালে সব Stream একসাথে থেমে যায়, পরের সেকশনে সেই গল্প।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 9. মাঝখানের যন্ত্রগুলো                                                     */
/* ------------------------------------------------------------------------- */

export function IntermediariesDiagram() {
  const generic = [
    { x: 20, t: "Client", s: "Browser, curl, App" },
    { x: 190, t: "Forward Proxy", s: "অফিসের, ঐচ্ছিক" },
    { x: 360, t: "CDN", s: "কাছের Edge, ঐচ্ছিক" },
    { x: 530, t: "Load Balancer", s: "ভিড় ভাগ, ঐচ্ছিক" },
    { x: 700, t: "Reverse Proxy", s: "Server এর দরজা" },
  ];
  return (
    <Sketch
      label="Diagram: Client আর App এর মাঝে যারা থাকে"
      height={340}
      minWidth={880}
      viewBox="0 0 880 340"
      caption="উপরের সারিতে একটা Request এর পথে যত রকম মধ্যস্থ থাকতে পারে। Forward Proxy থাকে Client এর দিকে, Client এর হয়ে কাজ করে। CDN, Load Balancer আর Reverse Proxy থাকে Server এর দিকে, Server এর হয়ে কাজ করে। প্রত্যেকে একটা পুরো HTTP Request গ্রহণ করে আর পরের জনের কাছে নতুন একটা Request পাঠায়, তাই প্রতিটা ধাপ আসলে আলাদা একটা TCP Connection। নিচের সারিতে Island Tours এর আসল পথ: Browser থেকে Caddy পর্যন্ত HTTPS আর HTTP/2, Caddy থেকে App পর্যন্ত একই যন্ত্রের ভেতরে সাধারণ HTTP/1.1।"
    >
      <Arrow id="basics-mid-a" />
      <Arrow id="basics-mid-b" faded />
      {generic.map((g, i) => (
        <g key={g.t}>
          <Box x={g.x} y={40} w={150} h={50} text={g.t} sub={g.s} accent={i === 0 || i === 4} dashed={i > 0 && i < 4} />
          {i < generic.length - 1 && (
            <line x1={g.x + 152} y1={65} x2={g.x + 167} y2={65} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" markerEnd="url(#basics-mid-b)" />
          )}
        </g>
      ))}
      <SketchText x={440} y={122} size={8.5} body opacity={0.75}>
        প্রতিটা তীর একটা আলাদা TCP Connection, প্রতিটা ধাপে Request নতুন করে পাঠানো হয়
      </SketchText>

      <line x1={20} y1={150} x2={860} y2={150} stroke="currentColor" strokeOpacity={0.2} />
      <SketchText x={20} y={178} size={10} anchor="start" bold accent>
        Island Tours, আসল পথ
      </SketchText>

      <Box x={20} y={200} w={200} h={56} text="Browser" sub="192.168.1.20:51514" accent />
      <line x1={222} y1={228} x2={336} y2={228} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#basics-mid-a)" />
      <SketchText x={279} y={218} size={8.5} bold accent>
        HTTPS, HTTP/2
      </SketchText>
      <SketchText x={279} y={246} size={7.5} body opacity={0.75}>
        Internet পেরিয়ে
      </SketchText>
      <Box x={340} y={200} w={200} h={56} text="Caddy" sub="103.94.135.2:443" accent />
      <line x1={542} y1={228} x2={656} y2={228} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#basics-mid-a)" />
      <SketchText x={599} y={218} size={8.5} bold accent>
        HTTP/1.1
      </SketchText>
      <SketchText x={599} y={246} size={7.5} body opacity={0.75}>
        একই যন্ত্রের ভেতরে
      </SketchText>
      <Box x={660} y={200} w={200} h={56} text="App" sub="127.0.0.1:3000" />
      <SketchText x={440} y={300} size={8.5} body opacity={0.8}>
        দুই অংশের Version আলাদা হতে পারে, কারণ দুইটা আলাদা আলাপ। Caddy দুই ভাষাই বলে।
      </SketchText>
    </Sketch>
  );
}
