/**
 * What: The four interactive labs of the WebSocket and real-time lesson (Module 06, Lesson 10): the
 * handshake key calculator, the frame byte builder, the polling vs push comparison, and the
 * reconnect storm simulator.
 *
 * Why: These ideas are about bytes and about time, which a still picture cannot show. Every number a
 * lab shows is computed in the page from the reader's own input, so the reader can test the rule
 * instead of trusting a sentence. Random parts use a seeded generator so the server render and the
 * browser render always agree.
 */
"use client";

import { cn } from "@/lib/utils";
import { RotateCcw, Shuffle } from "lucide-react";
import { useMemo, useState } from "react";

function Panel({
  label,
  title,
  children,
  footer,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <figure className="my-10 border border-border bg-card">
      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 border-b border-border bg-muted/30">
        <span className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-primary">
          {label}
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </span>
      </figcaption>
      <div className="p-5 md:p-8">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed">
          {footer}
        </div>
      )}
    </figure>
  );
}

function Chip({
  active,
  onClick,
  children,
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
} & Record<`data-${string}`, string | number>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={cn(
        "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
        {label}
      </span>
      {children}
    </div>
  );
}

const hex = (byte: number) => byte.toString(16).padStart(2, "0");
const count = (value: number) => value.toLocaleString("en-US");

/* ------------------------------------------------------------------------- */
/* 1. Sec-WebSocket-Key থেকে Sec-WebSocket-Accept                             */
/* ------------------------------------------------------------------------- */

/** RFC 6455 এর নির্দিষ্ট GUID। প্রতিটা WebSocket Server এই একই লেখা জোড়ে। */
const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
const RFC_KEY = "dGhlIHNhbXBsZSBub25jZQ==";

/**
 * SHA-1, hand written so the lab can derive the Accept value during render
 * (Web Crypto is async, and syncing its result through an effect is the
 * set-state-in-effect trap this repo bans). Checked against node:crypto on 200
 * random keys before shipping.
 */
function sha1(bytes: Uint8Array): Uint8Array {
  const bitLength = bytes.length * 8;
  const total = Math.ceil((bytes.length + 9) / 64) * 64;
  const message = new Uint8Array(total);
  message.set(bytes);
  message[bytes.length] = 0x80;
  const view = new DataView(message.buffer);
  view.setUint32(total - 8, Math.floor(bitLength / 2 ** 32));
  view.setUint32(total - 4, bitLength >>> 0);
  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  const w = new Uint32Array(80);
  for (let offset = 0; offset < total; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4);
    for (let i = 16; i < 80; i++) {
      const x = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
      w[i] = (x << 1) | (x >>> 31);
    }
    let [a, b, c, d, e] = h;
    for (let i = 0; i < 80; i++) {
      const f =
        i < 20 ? (b & c) | (~b & d) : i < 40 ? b ^ c ^ d : i < 60 ? (b & c) | (b & d) | (c & d) : b ^ c ^ d;
      const k = i < 20 ? 0x5a827999 : i < 40 ? 0x6ed9eba1 : i < 60 ? 0x8f1bbcdc : 0xca62c1d6;
      const next = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) >>> 0;
      e = d;
      d = c;
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = next;
    }
    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0;
  }
  const out = new Uint8Array(20);
  const outView = new DataView(out.buffer);
  h.forEach((word, i) => outView.setUint32(i * 4, word));
  return out;
}

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

type ServerKind = "correct" | "confused";

export function WsHandshakeLab() {
  const [key, setKey] = useState(RFC_KEY);
  const [server, setServer] = useState<ServerKind>("correct");

  const expectedDigest = useMemo(() => sha1(new TextEncoder().encode(key + WS_GUID)), [key]);
  const expected = toBase64(expectedDigest);
  // একটা বিভ্রান্ত Server, যে GUID জোড়ে না। হিসাব মিলবে না।
  const confusedDigest = useMemo(() => sha1(new TextEncoder().encode(key)), [key]);
  const sent = server === "correct" ? expected : toBase64(confusedDigest);
  const digest = server === "correct" ? expectedDigest : confusedDigest;
  const matches = sent === expected;

  const newKey = () => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    setKey(toBase64(bytes));
  };

  const rows: { step: string; label: string; value: string; accent?: boolean }[] = [
    { step: "১", label: "Browser বানাল 16টা Random Byte, Base64 করে পাঠাল", value: `Sec-WebSocket-Key: ${key}` },
    {
      step: "২",
      label: server === "correct" ? "Server Key এর পেছনে নির্দিষ্ট GUID জুড়ল" : "এই Server GUID জুড়তে জানে না",
      value: server === "correct" ? `${key}${WS_GUID}` : key,
    },
    { step: "৩", label: "তার SHA-1, 20 Byte, Hex এ লেখা", value: Array.from(digest, hex).join("") },
    { step: "৪", label: "সেই 20 Byte এর Base64, উত্তরের Header এ", value: `Sec-WebSocket-Accept: ${sent}`, accent: true },
  ];

  return (
    <Panel
      label="Interactive"
      title="Handshake এর হিসাবটা নিজে করুন"
      footer="প্রথমে RFC এর নিজের উদাহরণের Key টা দেখুন, উত্তর আসে s3pPLMBiTxaQ9kYGzzhZRbK+xOo=, ঠিক যা Lab এ openssl আর Node দিয়ে পাবেন। তারপর নতুন Key বানান, প্রতিবার Accept পুরো বদলে যায়। শেষে Server টা বিভ্রান্ত করে দিন। দেখবেন হিসাব মেলে না আর Browser Connection টা বাতিল করে দেয়। এটাই এই হিসাবের একমাত্র কাজ: প্রমাণ করা যে ওপাশে সত্যিই WebSocket বোঝে এমন কেউ বসে আছে। এটা কোনো Password নয়, কোনো গোপনীয়তাও নয়।"
    >
      <ChipRow label="Key">
        <Chip active={key === RFC_KEY} onClick={() => setKey(RFC_KEY)} data-key="rfc">
          RFC এর উদাহরণ
        </Chip>
        <button
          onClick={newKey}
          data-action="new-key"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-[0.6875rem] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <Shuffle className="w-3 h-3" />
          নতুন Key বানান
        </button>
      </ChipRow>
      <ChipRow label="Server">
        <Chip active={server === "correct"} onClick={() => setServer("correct")} data-server="correct">
          WebSocket বোঝে
        </Chip>
        <Chip active={server === "confused"} onClick={() => setServer("confused")} data-server="confused">
          বিভ্রান্ত, GUID জোড়ে না
        </Chip>
      </ChipRow>

      <ol className="mt-5 space-y-3">
        {rows.map((row) => (
          <li key={row.step} className="border border-border bg-background px-4 py-3">
            <div className="text-[0.6875rem] text-muted-foreground mb-1">
              <span className="font-bold text-primary mr-2">{row.step}</span>
              {row.label}
            </div>
            <div
              className={cn(
                "font-mono text-[0.75rem] break-all",
                row.accent ? "font-bold text-primary" : "text-foreground",
              )}
            >
              {row.value}
            </div>
          </li>
        ))}
      </ol>

      <div
        data-result={matches ? "match" : "mismatch"}
        className={cn(
          "mt-4 border px-4 py-3 text-sm leading-relaxed",
          matches ? "border-primary/60 bg-primary/5 text-foreground" : "border-border bg-muted/30 text-foreground",
        )}
      >
        <div className="font-mono text-[0.6875rem] text-muted-foreground mb-1">
          Browser নিজেও একই হিসাব করে রেখেছিল: {expected}
        </div>
        {matches
          ? "মিলেছে। Browser বুঝল ওপাশের Server সত্যিই WebSocket বোঝে। readyState হলো OPEN, এখন থেকে Frame চলবে।"
          : "মেলেনি। Browser এক মুহূর্ত দেরি না করে Connection বন্ধ করে দিল, আর পাতার JavaScript পেল একটা error আর তারপর 1006 Code এর close ঘটনা।"}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা বার্তা থেকে একটা Frame, Byte ধরে ধরে                                  */
/* ------------------------------------------------------------------------- */

const RFC_MASK = [0x37, 0xfa, 0x21, 0x3d];
const MAX_CHARS = 200;
const SHOWN_PAYLOAD_BYTES = 40;

type Direction = "client" | "server";

type ByteGroup = { name: string; note: string; bytes: number[]; tone: "head" | "len" | "mask" | "data" };

function buildFrame(text: string, direction: Direction, mask: number[]) {
  const payload = Array.from(new TextEncoder().encode(text));
  const masked = direction === "client";
  const len = payload.length;
  const groups: ByteGroup[] = [
    { name: "Byte 0", note: "FIN=1, opcode=1 (text)", bytes: [0x81], tone: "head" },
    {
      name: "Byte 1",
      note: `MASK=${masked ? 1 : 0}, length=${len < 126 ? len : 126}`,
      bytes: [(masked ? 0x80 : 0) | (len < 126 ? len : 126)],
      tone: "head",
    },
  ];
  if (len >= 126) {
    groups.push({ name: "Extended Length", note: `আসল দৈর্ঘ্য ${len}, 2 Byte এ`, bytes: [len >> 8, len & 0xff], tone: "len" });
  }
  if (masked) groups.push({ name: "Masking Key", note: "প্রতি Frame এ নতুন Random", bytes: mask, tone: "mask" });
  const body = masked ? payload.map((b, i) => b ^ mask[i % 4]) : payload;
  groups.push({ name: "Payload", note: masked ? "Mask দিয়ে XOR করা" : "যেমন আছে তেমন", bytes: body, tone: "data" });
  const headerBytes = 2 + (len >= 126 ? 2 : 0) + (masked ? 4 : 0);
  return { payload, groups, headerBytes, total: headerBytes + len };
}

const TONE: Record<ByteGroup["tone"], string> = {
  head: "border-primary/60 bg-primary/10 text-primary",
  len: "border-primary/40 bg-primary/5 text-primary",
  mask: "border-border bg-muted/60 text-foreground",
  data: "border-border bg-background text-foreground",
};

export function WsFrameLab() {
  const [text, setText] = useState("Hello");
  const [direction, setDirection] = useState<Direction>("client");
  const [mask, setMask] = useState<number[]>(RFC_MASK);

  const frame = useMemo(() => buildFrame(text, direction, mask), [text, direction, mask]);
  const chars = Array.from(text).length;

  const newMask = () => {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    setMask(Array.from(bytes));
  };

  return (
    <Panel
      label="Interactive"
      title="একটা বার্তা, তার Frame এর প্রতিটা Byte"
      footer="শুরুতে RFC এর নিজের উদাহরণ: Hello, আর Mask 37 fa 21 3d। Frame টা হয় 81 85 37 fa 21 3d 7f 9f 4d 51 58, এগারো Byte। এবার বার্তাটা বদলান। বাংলায় লিখলে দেখবেন অক্ষরের চেয়ে Byte অনেক বেশি, কারণ UTF-8 এ একটা বাংলা অক্ষর সাধারণত ৩ Byte (লেসন ০১)। ১২৫ Byte পার হলেই Byte 1 এর দৈর্ঘ্য হয়ে যায় 126 আর পেছনে দুইটা বাড়তি Byte আসে আসল দৈর্ঘ্য নিয়ে। দিক বদলে Server থেকে Client করুন: Masking Key উধাও, Payload হুবহু পড়া যায়। আর নতুন Mask দিলে একই Hello এর Payload Byte গুলো পুরো বদলে যায়।"
    >
      <label className="block mb-3">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
          বার্তা (সর্বোচ্চ {MAX_CHARS} অক্ষর)
        </span>
        <input
          value={text}
          maxLength={MAX_CHARS}
          onChange={(e) => setText(e.target.value)}
          data-input="message"
          className="mt-1 w-full border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
        />
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        <Chip active={text === "Hello"} onClick={() => setText("Hello")} data-preset="hello">
          Hello
        </Chip>
        <Chip active={text === "আসন 14A চাই"} onClick={() => setText("আসন 14A চাই")} data-preset="bangla">
          আসন 14A চাই
        </Chip>
        <Chip
          active={text.startsWith("seat-map")}
          onClick={() => setText(`seat-map ${"14A:sold 14B:free ".repeat(8)}`.trim())}
          data-preset="long"
        >
          ১২৫ Byte এর বেশি
        </Chip>
      </div>
      <ChipRow label="দিক">
        <Chip active={direction === "client"} onClick={() => setDirection("client")} data-direction="client">
          Client থেকে Server
        </Chip>
        <Chip active={direction === "server"} onClick={() => setDirection("server")} data-direction="server">
          Server থেকে Client
        </Chip>
        <button
          onClick={newMask}
          disabled={direction === "server"}
          data-action="new-mask"
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            direction === "server"
              ? "border-border text-muted-foreground/40"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
          )}
        >
          <Shuffle className="w-3 h-3" />
          নতুন Mask
        </button>
        <button
          onClick={() => setMask(RFC_MASK)}
          aria-label="Reset mask"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </ChipRow>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-5">
        {[
          ["অক্ষর", chars],
          ["Payload Byte", frame.payload.length],
          ["Header Byte", frame.headerBytes],
          ["মোট Frame", frame.total],
        ].map(([name, value]) => (
          <div key={name} className="border border-border bg-background px-3 py-2">
            <div className="text-[0.625rem] text-muted-foreground">{name}</div>
            <div className="font-mono text-[0.9375rem] font-bold text-primary" data-metric={name}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3" data-frame-bytes={frame.groups.flatMap((g) => g.bytes).map(hex).join(" ")}>
        {frame.groups.map((group) => {
          const shown = group.tone === "data" ? group.bytes.slice(0, SHOWN_PAYLOAD_BYTES) : group.bytes;
          const hidden = group.bytes.length - shown.length;
          return (
            <div key={group.name} className="flex flex-col sm:flex-row sm:items-start gap-2">
              <div className="sm:w-44 shrink-0">
                <div className="font-mono text-[0.6875rem] font-bold text-foreground">{group.name}</div>
                <div className="text-[0.625rem] text-muted-foreground">{group.note}</div>
              </div>
              <div className="flex flex-wrap gap-1">
                {shown.map((byte, i) => (
                  <span
                    key={`${group.name}-${i}`}
                    className={cn("font-mono text-[0.6875rem] border px-1.5 py-0.5", TONE[group.tone])}
                  >
                    {hex(byte)}
                  </span>
                ))}
                {hidden > 0 && (
                  <span className="font-mono text-[0.6875rem] text-muted-foreground px-1.5 py-0.5">
                    আরও {hidden} Byte
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {direction === "client" && frame.payload.length > 0 && (
        <div className="mt-5 border border-dashed border-border px-4 py-3">
          <div className="text-[0.6875rem] text-muted-foreground mb-2">
            Server এর দিকে খোলা: প্রথম কয়েকটা Byte, Mask এর সাথে আবার XOR করলে আসলটা ফেরে
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.6875rem] text-foreground">
            {frame.payload.slice(0, 6).map((original, i) => (
              <span key={i}>
                {hex(original ^ mask[i % 4])} ^ {hex(mask[i % 4])} = <b className="text-primary">{hex(original)}</b>
              </span>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. চার উপায় পাশাপাশি: কত Request, কত দেরি                                    */
/* ------------------------------------------------------------------------- */

/** এক মিনিটে নৌকার আসনে কখন কখন বদল হলো, শুরু থেকে কত সেকেন্ড পরে। */
const PATTERNS = {
  quiet: { name: "শান্ত দুপুর", events: [3.5, 41.2] },
  busy: {
    name: "ভিড়ের সন্ধ্যা",
    events: [1.2, 3.9, 6.1, 8.8, 11.0, 13.7, 16.2, 18.4, 21.5, 24.0, 27.3, 30.1, 33.6, 36.2, 39.0, 42.4, 45.1, 48.7, 52.0, 56.3],
  },
} as const;
type PatternKey = keyof typeof PATTERNS;

const WINDOW_SECONDS = 60;
const LONG_POLL_HOLD_SECONDS = 30;
const HEARTBEAT_SECONDS = 25;

type Technique = {
  id: string;
  name: string;
  direction: string;
  requests: number;
  empty: number;
  delay: string;
  pushes: number;
  /** SSE and WebSocket open one request and keep it, so no new requests arrive each second. */
  opensOnce: boolean;
};

function shortPolling(events: readonly number[], every: number): Technique {
  const polls: number[] = [];
  for (let t = every; t <= WINDOW_SECONDS; t += every) polls.push(t);
  let useful = 0;
  let previous = 0;
  for (const poll of polls) {
    if (events.some((e) => e > previous && e <= poll)) useful += 1;
    previous = poll;
  }
  const delays = events.map((e) => (polls.find((p) => p >= e) ?? WINDOW_SECONDS) - e);
  const average = delays.reduce((a, c) => a + c, 0) / delays.length;
  return {
    id: "short",
    name: "Short Polling",
    direction: "শুধু Client জিজ্ঞেস করে",
    requests: polls.length,
    empty: polls.length - useful,
    delay: `${average.toFixed(1)} s`,
    pushes: 0,
    opensOnce: false,
  };
}

function longPolling(events: readonly number[]): Technique {
  let t = 0;
  let requests = 0;
  let empty = 0;
  while (t < WINDOW_SECONDS) {
    requests += 1;
    const next = events.find((e) => e > t && e <= t + LONG_POLL_HOLD_SECONDS);
    if (next === undefined) {
      t += LONG_POLL_HOLD_SECONDS;
      if (t <= WINDOW_SECONDS) empty += 1;
    } else {
      t = next;
    }
  }
  return {
    id: "long",
    name: "Long Polling",
    direction: "Client জিজ্ঞেস করে, Server ধরে রাখে",
    requests,
    empty,
    delay: "প্রায় 0",
    pushes: 0,
    opensOnce: false,
  };
}

function streaming(id: string, name: string, direction: string, events: readonly number[]): Technique {
  return {
    id,
    name,
    direction,
    requests: 1,
    empty: 0,
    delay: "প্রায় 0",
    pushes: events.length + Math.floor(WINDOW_SECONDS / HEARTBEAT_SECONDS),
    opensOnce: true,
  };
}

export function WsCompareLab() {
  const [pattern, setPattern] = useState<PatternKey>("quiet");
  const [every, setEvery] = useState(2);
  const [tourists, setTourists] = useState(10000);

  const events = PATTERNS[pattern].events;
  const techniques = [
    shortPolling(events, every),
    longPolling(events),
    streaming("sse", "Server-Sent Events", "শুধু Server থেকে Client", events),
    streaming("ws", "WebSocket", "দুই দিকেই, যখন খুশি", events),
  ];

  return (
    <Panel
      label="Interactive"
      title="চার উপায় পাশাপাশি, এক মিনিটের হিসাব"
      footer={`একজন পর্যটক Saint Martin এর নৌকার আসনের পাতা খুলে এক মিনিট বসে আছেন। এই মিনিটে আসনে কতবার বদল হয়, সেটা উপরে বেছে নিন। প্রতিটা কার্ডে একই মিনিটের হিসাব: কতগুলো HTTP Request গেল, তার কতগুলো খালি হাতে ফিরল, আর একটা বদল ঘটার কতক্ষণ পরে পর্যটক সেটা জানলেন। Long Polling এখানে প্রতিটা Request ${LONG_POLL_HOLD_SECONDS} সেকেন্ড ধরে রাখে, আর SSE আর WebSocket প্রতি ${HEARTBEAT_SECONDS} সেকেন্ডে একটা ছোট Heartbeat পাঠায় (সেকশন ০০৯), সেগুলোও Push এর গণনায় আছে। শান্ত দুপুরে Short Polling এর প্রায় সব Request খালি, ভিড়ের সন্ধ্যায় Long Polling প্রায় প্রতিটা বদলে একটা নতুন Request খরচ করে। SSE আর WebSocket দুই অবস্থাতেই একটা Request এ পুরো মিনিট চালায়। দেরির হিসাবে Network এর যাওয়া আসার সময় ধরা হয়নি, সেটা চারটাতেই আছে।`}
    >
      <ChipRow label="আসনে বদল">
        {(Object.keys(PATTERNS) as PatternKey[]).map((key) => (
          <Chip key={key} active={pattern === key} onClick={() => setPattern(key)} data-pattern={key}>
            {`${PATTERNS[key].name}, ${PATTERNS[key].events.length}টা বদল`}
          </Chip>
        ))}
      </ChipRow>
      <ChipRow label="Short Polling কত পরপর">
        {[2, 10].map((value) => (
          <Chip key={value} active={every === value} onClick={() => setEvery(value)} data-every={value}>
            {`${value} সেকেন্ড`}
          </Chip>
        ))}
      </ChipRow>
      <ChipRow label="একসাথে পর্যটক">
        {[100, 10000].map((value) => (
          <Chip key={value} active={tourists === value} onClick={() => setTourists(value)} data-tourists={value}>
            {count(value)}
          </Chip>
        ))}
      </ChipRow>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-5">
        {techniques.map((tech) => (
          <div key={tech.id} data-technique={tech.id} className="border border-border bg-background px-4 py-3">
            <div className="font-mono text-[0.6875rem] font-bold text-primary">{tech.name}</div>
            <div className="text-[0.625rem] text-muted-foreground mb-3">{tech.direction}</div>
            <dl className="space-y-2 text-[0.6875rem]">
              <div>
                <dt className="text-muted-foreground">HTTP Request, একজনের এক মিনিটে</dt>
                <dd className="font-mono text-[0.9375rem] font-bold text-foreground" data-metric="requests">
                  {tech.requests}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">খালি হাতে ফেরা উত্তর</dt>
                <dd className="font-mono font-bold text-foreground" data-metric="empty">
                  {tech.empty}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Server থেকে নিজে আসা বার্তা</dt>
                <dd className="font-mono font-bold text-foreground" data-metric="pushes">
                  {tech.pushes}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">বদলের পরে জানতে গড় দেরি</dt>
                <dd className="font-mono font-bold text-foreground" data-metric="delay">
                  {tech.delay}
                </dd>
              </div>
              <div className="pt-2 border-t border-border">
                <dt className="text-muted-foreground">Server এ প্রতি সেকেন্ডে নতুন Request, সবাই মিলে</dt>
                <dd className="font-mono text-[0.9375rem] font-bold text-primary" data-metric="rps">
                  {tech.opensOnce
                    ? "0, শুধু শুরুতে একবার"
                    : count(Math.round((tech.requests * tourists) / WINDOW_SECONDS))}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Server Restart এর পরে ফিরে আসার ঢল                                       */
/* ------------------------------------------------------------------------- */

const STORM = {
  clients: 10000,
  acceptPerSecond: 2000,
  overloadAbove: 8000,
  acceptWhenOverloaded: 500,
  downSeconds: 2,
  horizonSeconds: 40,
  shownSeconds: 24,
  maxDelaySeconds: 8,
  seed: 2026,
};

type Strategy = "fixed" | "backoff" | "jitter";

const STRATEGIES: { id: Strategy; name: string; rule: string }[] = [
  { id: "fixed", name: "সাথে সাথে, প্রতি সেকেন্ডে", rule: "ব্যর্থ হলেই ১ সেকেন্ড পরে আবার" },
  { id: "backoff", name: "Exponential Backoff", rule: "প্রতিবার অপেক্ষা দ্বিগুণ: ১, ২, ৪, ৮ সেকেন্ড, কিন্তু সবার ঠিক একই" },
  { id: "jitter", name: "Backoff আর Jitter", rule: "অপেক্ষার সীমা ১, ২, ৪, ৮ সেকেন্ড, কিন্তু প্রত্যেকে সীমার ভেতরে নিজের মতো একটা সময় বাছেন" },
];

/** Seeded PRNG (mulberry32), so the server render and the browser render draw the same chart. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function simulateStorm(strategy: Strategy) {
  const random = seeded(STORM.seed);
  const ceiling = (failures: number) => Math.min(STORM.maxDelaySeconds, 2 ** failures);
  const delay = (failures: number) =>
    strategy === "fixed"
      ? 1
      : strategy === "backoff"
        ? ceiling(failures)
        : 1 + Math.floor(random() * ceiling(failures));

  const next = new Int32Array(STORM.clients);
  const failures = new Uint8Array(STORM.clients);
  if (strategy === "jitter") for (let i = 0; i < STORM.clients; i++) next[i] = Math.floor(random() * 2);

  const attempts = new Array<number>(STORM.horizonSeconds).fill(0);
  const accepted = new Array<number>(STORM.horizonSeconds).fill(0);
  let connected = 0;
  let ninetyAt: number | null = null;
  let allAt: number | null = null;

  for (let second = 0; second < STORM.horizonSeconds; second++) {
    const due: number[] = [];
    for (let i = 0; i < STORM.clients; i++) if (next[i] === second) due.push(i);
    attempts[second] = due.length;
    const capacity =
      second < STORM.downSeconds
        ? 0
        : due.length > STORM.overloadAbove
          ? STORM.acceptWhenOverloaded
          : STORM.acceptPerSecond;
    due.forEach((client, position) => {
      if (position < capacity) {
        next[client] = -1;
        accepted[second] += 1;
        connected += 1;
      } else {
        next[client] = second + delay(failures[client]);
        failures[client] += 1;
      }
    });
    if (ninetyAt === null && connected >= STORM.clients * 0.9) ninetyAt = second + 1;
    if (allAt === null && connected === STORM.clients) allAt = second + 1;
  }

  return {
    attempts,
    accepted,
    ninetyAt,
    allAt,
    peak: Math.max(...attempts.slice(STORM.downSeconds)),
    total: attempts.reduce((a, c) => a + c, 0),
  };
}

export function WsReconnectLab() {
  const [strategy, setStrategy] = useState<Strategy>("fixed");
  const result = useMemo(() => simulateStorm(strategy), [strategy]);
  const tallest = Math.max(...result.attempts.slice(0, STORM.shownSeconds), 1);
  const overloadLine = (STORM.overloadAbove / tallest) * 100;

  const metrics: [string, string][] = [
    ["Server ফেরার পরে এক সেকেন্ডে সর্বোচ্চ চেষ্টা", count(result.peak)],
    ["মোট চেষ্টা", count(result.total)],
    ["৯০% পর্যটক ফিরলেন", result.ninetyAt === null ? `${STORM.horizonSeconds} s এও না` : `${result.ninetyAt} s`],
    ["সবাই ফিরলেন", result.allAt === null ? `${STORM.horizonSeconds} s এও না` : `${result.allAt} s`],
  ];

  return (
    <Panel
      label="Interactive"
      title="Deploy এর পরে দশ হাজার জনের ফিরে আসা"
      footer={`Deploy এর জন্য Server থামল, ${count(STORM.clients)} খোলা WebSocket একসাথে ভাঙল, আর ${STORM.downSeconds} সেকেন্ড পরে নতুন Server চালু হলো। এই সরল Model এ Server প্রতি সেকেন্ডে ${count(STORM.acceptPerSecond)} জনকে নিতে পারে। কিন্তু এক সেকেন্ডে ${count(STORM.overloadAbove)} এর বেশি চেষ্টা এলে TCP আর TLS Handshake সামলাতেই তার CPU শেষ, তখন নিতে পারে মাত্র ${count(STORM.acceptWhenOverloaded)} জন। দাগ টানা রেখাটা সেই সীমা। প্রতিটা কৌশল চালিয়ে দেখুন। সাথে সাথে চেষ্টা করলে Server সীমার উপরে ডুবে থাকে। শুধু Backoff এ সবাই একই মুহূর্তে অপেক্ষা শেষ করেন, তাই ঢেউ আসে আর প্রতিটা ঢেউ আবার সীমা পার হয়। Jitter মিশালে চেষ্টাগুলো ছড়িয়ে পড়ে, মোট চেষ্টা অর্ধেকেরও কম, আর বেশিরভাগ পর্যটক আগে ফেরেন। শেষ কয়েকজন একটু দেরিতে ফেরেন, এটাই Jitter এর দাম।`}
    >
      <ChipRow label="কৌশল">
        {STRATEGIES.map((s) => (
          <Chip key={s.id} active={strategy === s.id} onClick={() => setStrategy(s.id)} data-strategy={s.id}>
            {s.name}
          </Chip>
        ))}
      </ChipRow>
      <p className="text-[0.6875rem] text-muted-foreground mb-5">
        {STRATEGIES.find((s) => s.id === strategy)?.rule}
      </p>

      <div className="relative h-48 border-b border-l border-border pl-1" data-chart={strategy}>
        <div
          className="absolute left-0 right-0 border-t border-dashed border-primary/70"
          style={{ bottom: `${Math.min(overloadLine, 100)}%` }}
        >
          <span className="absolute right-0 -top-4 font-mono text-[0.5625rem] text-primary">
            {count(STORM.overloadAbove)} এর বেশি হলে Server ডোবে
          </span>
        </div>
        <div className="absolute inset-0 flex items-end gap-0.5 pl-1">
          {result.attempts.slice(0, STORM.shownSeconds).map((value, second) => (
            <div
              key={second}
              className="relative flex-1 flex flex-col justify-end h-full"
              title={`${second} s: ${count(value)} চেষ্টা, ${count(result.accepted[second])} সফল`}
            >
              <div
                className={cn(
                  "w-full transition-[height] duration-500",
                  second < STORM.downSeconds ? "bg-muted-foreground/30" : "bg-primary/25",
                )}
                style={{ height: `${(value / tallest) * 100}%` }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary transition-[height] duration-500"
                  style={{ height: `${(result.accepted[second] / tallest) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between font-mono text-[0.5625rem] text-muted-foreground mt-1 mb-5">
        <span>0 s, Server বন্ধ</span>
        <span>{STORM.downSeconds} s, নতুন Server চালু</span>
        <span>{STORM.shownSeconds} s</span>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.625rem] text-muted-foreground mb-5">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 bg-primary/25 inline-block" /> চেষ্টা
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 bg-primary inline-block" /> সফল
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {metrics.map(([name, value]) => (
          <div key={name} className="border border-border bg-background px-3 py-2">
            <div className="text-[0.625rem] text-muted-foreground">{name}</div>
            <div className="font-mono text-[0.9375rem] font-bold text-primary" data-metric={name}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
