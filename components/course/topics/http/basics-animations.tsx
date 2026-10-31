/**
 * What: The interactive labs for the HTTP Protocol Basics lesson: take a message apart line by line,
 * watch a stateless server forget a visitor, give a body the wrong Content-Length, walk the HTTP
 * versions in order, and race HTTP/1.1, HTTP/2 and HTTP/3 with one lost packet.
 *
 * Why: Each idea here is a rule the reader can discover by changing one input and seeing what
 * breaks, which teaches it better than a sentence. Every visual is derived straight from state, with
 * no effects and no exit animations, so rapid clicks can never freeze a lab.
 */
"use client";

import { cn, toBn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

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

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Reset"
      className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
    >
      <RotateCcw className="w-3 h-3" />
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Message এর প্রতিটা লাইন খুলে দেখা                                      */
/* ------------------------------------------------------------------------- */

type LineKind = "start" | "header" | "blank" | "body";

type MessageLine = { text: string; kind: LineKind; title: string; note: string };

const MESSAGES: Record<"request" | "response", MessageLine[]> = {
  request: [
    {
      text: "POST /api/bookings HTTP/1.1",
      kind: "start",
      title: "Request Line",
      note: "তিন টুকরো, মাঝে একটা করে Space। POST হলো Method, মানে আমি নতুন কিছু জমা দিতে চাই। /api/bookings হলো Target, কোন জিনিসটা নিয়ে কথা। HTTP/1.1 হলো Version, কোন নিয়মে কথা বলছি। Server প্রথমে এই লাইনটাই পড়ে, বাকি সব পরে।",
    },
    {
      text: "Host: islandtours.example",
      kind: "header",
      title: "Host Header",
      note: "কোন সাইটের কাছে চাইছি। একই IP তে অনেক সাইট থাকতে পারে, তাই HTTP/1.1 এ এই লাইনটা বাধ্যতামূলক। না থাকলে Server 400 Bad Request ফেরত দেয়।",
    },
    {
      text: "Content-Type: application/json",
      kind: "header",
      title: "Content-Type Header",
      note: "Body টা কোন ধরনের লেখা। এখানে JSON। এটা না জানলে Server বুঝত না Body টা কীভাবে পড়তে হবে। Header Lesson এ এর পুরো তালিকা দেখবেন।",
    },
    {
      text: "Content-Length: 54",
      kind: "header",
      title: "Content-Length Header",
      note: "Body ঠিক কত Byte। TCP এর ধারায় কোনো দাগ নেই, তাই Server এই সংখ্যা গুনেই জানে Body কোথায় শেষ। পরের এক সেকশন এটা নিয়েই।",
    },
    {
      text: "Accept: application/json",
      kind: "header",
      title: "Accept Header",
      note: "উত্তরটা কোন ধরনে পেলে Client খুশি। Server চাইলে এটা দেখে উত্তরের ধরন বেছে নিতে পারে।",
    },
    {
      text: "",
      kind: "blank",
      title: "ফাঁকা লাইন",
      note: "শুধু \\r\\n, আর কিছু না। Header যে শেষ, Server এটা দেখেই বোঝে। এই লাইনটা ভুলে গেলে Server চুপ করে আরও Header এর অপেক্ষায় বসে থাকে।",
    },
    {
      text: '{"tour":"saint-martin","date":"2026-12-20","guests":2}',
      kind: "body",
      title: "Body",
      note: "আসল তথ্য, এখানে বুকিং এর বিবরণ। ঠিক 54 Byte, Content-Length এর সাথে মিলে যায়। GET Request এ সাধারণত Body থাকে না।",
    },
  ],
  response: [
    {
      text: "HTTP/1.1 201 Created",
      kind: "start",
      title: "Status Line",
      note: "এখানেও তিন টুকরো। HTTP/1.1 হলো Version। 201 হলো Status Code, তিন অঙ্কের একটা সংখ্যা যা Program পড়ে। Created হলো Reason Phrase, মানুষের জন্য। Program গুলো শুধু সংখ্যাটা দেখে, লেখাটা নয়।",
    },
    {
      text: "Date: Sat, 31 Oct 2026 06:30:00 GMT",
      kind: "header",
      title: "Date Header",
      note: "উত্তরটা কখন তৈরি হলো, সবসময় GMT তে। Cache এর হিসাবে এটা কাজে লাগে।",
    },
    {
      text: "Content-Type: application/json; charset=utf-8",
      kind: "header",
      title: "Content-Type Header",
      note: "উত্তরের Body কোন ধরনের, আর লেখাটা কোন Encoding এ। Browser এই লাইন দেখে ঠিক করে Body টাকে পাতা হিসেবে আঁকবে, নাকি ছবি, নাকি JSON।",
    },
    {
      text: "Content-Length: 39",
      kind: "header",
      title: "Content-Length Header",
      note: "উত্তরের Body ঠিক 39 Byte। Browser গুনে গুনে 39 টা নিয়ে বোঝে উত্তর শেষ, তারপর একই Connection এ পরের Request পাঠাতে পারে।",
    },
    {
      text: "Location: /api/bookings/bk_7Q2M9X",
      kind: "header",
      title: "Location Header",
      note: "নতুন তৈরি হওয়া বুকিংটা কোন ঠিকানায় পাওয়া যাবে। 201 এর সাথে এই লাইনটা থাকে। Status Code এর লেসনে আরও দেখবেন।",
    },
    {
      text: "",
      kind: "blank",
      title: "ফাঁকা লাইন",
      note: "Request এর মতোই, এখানে Header শেষ আর Body শুরু।",
    },
    {
      text: '{"id":"bk_7Q2M9X","status":"confirmed"}',
      kind: "body",
      title: "Body",
      note: "উত্তরের আসল তথ্য। পর্যটকের পর্দায় যে নিশ্চিতকরণ দেখা যায়, সেটা এখান থেকেই আসে।",
    },
  ],
};

export function MessageAnatomyLab() {
  const [kind, setKind] = useState<"request" | "response">("request");
  const [index, setIndex] = useState(0);
  const lines = MESSAGES[kind];
  const current = lines[index];
  // প্রতিটা লাইনের সাথে অদৃশ্য \r\n, তাই দুই Byte বেশি
  const lineBytes = new TextEncoder().encode(current.text).length + 2;
  const totalBytes = lines.reduce(
    (sum, line) => sum + new TextEncoder().encode(line.text).length + (line.kind === "body" ? 0 : 2),
    0,
  );

  return (
    <Panel
      label="Interactive"
      title="একটা Message, লাইন ধরে ধরে"
      footer="উপরে বেছে নিন Request নাকি Response, তারপর যেকোনো লাইনে চাপ দিন। খেয়াল করুন দুইটার গঠন হুবহু এক: প্রথম লাইন, Header গুলো, একটা ফাঁকা লাইন, তারপর Body। তফাত শুধু প্রথম লাইনে। আর নিচের সংখ্যাটা দেখুন, পুরো Message টা আসলে কয়েকশো Byte লেখা ছাড়া আর কিছু নয়।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Label>Message</Label>
        {(["request", "response"] as const).map((k) => (
          <Chip
            key={k}
            active={kind === k}
            onClick={() => {
              setKind(k);
              setIndex(0);
            }}
            data-kind={k}
          >
            {k === "request" ? "Request" : "Response"}
          </Chip>
        ))}
      </div>

      <div className="border border-border bg-muted/20 font-mono text-[0.75rem] overflow-x-auto">
        {lines.map((line, i) => (
          <button
            key={`${kind}-${i}`}
            onClick={() => setIndex(i)}
            data-line={i}
            className={cn(
              "flex w-full items-center justify-between gap-6 px-4 py-2 text-left border-b border-border/60 last:border-b-0 transition-colors",
              i === index ? "bg-primary/10 text-primary" : "text-foreground/85 hover:bg-muted/40",
            )}
          >
            <span className={cn("whitespace-pre", line.kind === "start" && "font-bold")}>
              {line.kind === "blank" ? "(ফাঁকা লাইন)" : line.text}
            </span>
            {line.kind !== "body" && (
              <span className="text-[0.625rem] text-muted-foreground shrink-0">\r\n</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 border border-border px-4 py-3" data-part={current.kind}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
          <span className="font-mono text-[0.6875rem] font-bold text-primary">{current.title}</span>
          <span className="font-mono text-[0.625rem] text-muted-foreground">
            এই লাইনে {toBn(current.kind === "body" ? lineBytes - 2 : lineBytes)} Byte
            {current.kind === "body" ? "" : ", \\r\\n সহ"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{current.note}</p>
      </div>
      <p className="mt-3 font-mono text-[0.625rem] text-muted-foreground" data-total={totalBytes}>
        পুরো {kind === "request" ? "Request" : "Response"}: {toBn(totalBytes)} Byte লেখা
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Stateless: Server এর স্মৃতি বনাম Request এর ভেতরের পরিচয়               */
/* ------------------------------------------------------------------------- */

const STATELESS_REQUESTS = [
  "POST /api/auth/login",
  "GET /api/me",
  "POST /api/bookings",
  "GET /api/bookings/bk_7Q2M9X",
  "GET /api/me",
  "GET /api/bookings/bk_7Q2M9X",
];

type Memory = "server" | "request";

function statelessOutcome(
  i: number,
  memory: Memory,
  servers: number,
  restartAt: number | null,
): { server: string; ok: boolean; text: string } {
  const target = i % servers;
  const server = target === 0 ? "Server A" : "Server B";
  if (i === 0) {
    return {
      server,
      ok: true,
      text:
        memory === "server"
          ? "লগইন সফল। Server A নিজের Memory তে লিখে রাখল, এই মানুষটা কে।"
          : "লগইন সফল। পর্যটকের হাতে একটা পরিচয়ের টিকিট দেওয়া হলো, এরপর প্রতিটা Request সেটা সাথে নিয়ে আসবে।",
    };
  }
  if (memory === "request") {
    return {
      server,
      ok: true,
      text: `${server} Request এর ভেতরেই পরিচয় পেল। আগে কে কোথায় এসেছিল, জানার দরকারই নেই।`,
    };
  }
  const forgotten = restartAt !== null && restartAt > 0 && restartAt <= i;
  if (forgotten && target === 0) {
    return { server, ok: false, text: "Server A Restart হয়েছে, Memory মুছে গেছে। সে আর চেনে না। ফলাফল 401।" };
  }
  if (target !== 0) {
    return { server, ok: false, text: "Server B এর Memory তে এই মানুষের কোনো খবর নেই। লগইন হয়েছিল Server A তে। ফলাফল 401।" };
  }
  return { server, ok: true, text: "Server A এর Memory তে খুঁজে পাওয়া গেল। এবার কাজ হলো, কিন্তু শুধু ভাগ্যের জোরে।" };
}

export function StatelessLab() {
  const [memory, setMemory] = useState<Memory>("server");
  const [servers, setServers] = useState(1);
  const [sent, setSent] = useState(0);
  const [restartAt, setRestartAt] = useState<number | null>(null);

  const reset = () => {
    setSent(0);
    setRestartAt(null);
  };
  const rows = Array.from({ length: sent }, (_, i) => ({
    request: STATELESS_REQUESTS[i],
    ...statelessOutcome(i, memory, servers, restartAt),
  }));
  const failed = rows.filter((r) => !r.ok).length;
  const done = sent === STATELESS_REQUESTS.length;

  return (
    <Panel
      label="Interactive"
      title="মনে রাখবে কে, Server নাকি Request"
      footer="প্রথমে এক Server আর Server এর Memory রেখে সবগুলো Request পাঠান, সব ঠিকঠাক চলবে। তারপর Server দুইটা করুন: Load Balancer পালা করে একবার A, একবার B তে পাঠায়, আর অর্ধেক Request ব্যর্থ। আবার এক Server এ ফিরে মাঝপথে Restart চাপুন। শেষে মনে রাখার জায়গা বদলে Request এর ভেতরে দিন, আর সব পরীক্ষা আবার করুন। HTTP কেন Stateless, উত্তরটা এই তফাতে।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Label>মনে রাখে</Label>
        <Chip active={memory === "server"} onClick={() => { setMemory("server"); reset(); }} data-memory="server">
          Server এর Memory
        </Chip>
        <Chip active={memory === "request"} onClick={() => { setMemory("request"); reset(); }} data-memory="request">
          প্রতিটা Request নিজে
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Label>Server</Label>
        {[1, 2].map((n) => (
          <Chip key={n} active={servers === n} onClick={() => { setServers(n); reset(); }} data-servers={n}>
            {n === 1 ? "একটা, A" : "দুইটা, A আর B"}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setSent((s) => Math.min(STATELESS_REQUESTS.length, s + 1))}
          disabled={done}
          data-action="send"
          className={cn(
            "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            done ? "border-border text-muted-foreground/40" : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          পরের Request পাঠান
        </button>
        <button
          onClick={() => setRestartAt(sent)}
          disabled={sent === 0 || restartAt !== null || done}
          data-action="restart"
          className={cn(
            "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            sent === 0 || restartAt !== null || done
              ? "border-border text-muted-foreground/40"
              : "border-border text-foreground hover:border-primary/40",
          )}
        >
          Server A Restart করুন
        </button>
        <ResetButton onClick={reset} />
        <span className="font-mono text-[0.625rem] text-muted-foreground">
          পাঠানো {toBn(sent)} / {toBn(STATELESS_REQUESTS.length)}
        </span>
      </div>

      <div className="border border-border divide-y divide-border">
        {rows.length === 0 && (
          <p className="px-4 py-3 text-sm text-muted-foreground">এখনো কিছু পাঠানো হয়নি।</p>
        )}
        {rows.map((r, i) => (
          <div key={i} data-row={i} data-ok={r.ok ? "yes" : "no"} className="grid grid-cols-1 md:grid-cols-[220px_90px_1fr] gap-x-4 gap-y-1 px-4 py-3">
            <span className="font-mono text-[0.6875rem] font-bold text-foreground">{r.request}</span>
            <span className="font-mono text-[0.6875rem] text-muted-foreground">{r.server}</span>
            <span className={cn("text-sm leading-relaxed", r.ok ? "text-muted-foreground" : "text-foreground")}>
              <span className={cn("font-mono font-bold mr-2", r.ok ? "text-primary" : "text-foreground")}>
                {r.ok ? "সফল" : "ব্যর্থ"}
              </span>
              {r.text}
            </span>
          </div>
        ))}
        {restartAt !== null && (
          <p className="px-4 py-2 font-mono text-[0.625rem] text-muted-foreground">
            Server A Restart হয়েছিল {toBn(restartAt)} নম্বর Request এর পরে
          </p>
        )}
      </div>
      <p className="mt-3 font-mono text-[0.625rem] text-muted-foreground" data-failed={failed}>
        ব্যর্থ Request: {toBn(failed)}
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Content-Length ভুল হলে কী হয়                                           */
/* ------------------------------------------------------------------------- */

const LENGTH_BODY = "seats=2";

const LENGTH_CASES: { value: number; title: string; text: string }[] = [
  {
    value: 5,
    title: "কম বলা হলো",
    text: "Server 5 Byte গুনে নিল, seats। ভাবল Body শেষ, আর বাকি দুইটা Byte, =2, কে ধরে নিল পরের Request এর শুরু। কিন্তু =2 দিয়ে কোনো Request Line শুরু হয় না, তাই সে 400 Bad Request দিয়ে Connection বন্ধ করে দিল। আর বুকিং গেল মাত্র seats নিয়ে, সংখ্যা ছাড়া। এই ধরনের মাপের অমিলই Request Smuggling নামের এক আক্রমণের মূল, যেখানে দুইটা যন্ত্র একই Byte গুলোকে আলাদাভাবে ভাগ করে।",
  },
  {
    value: 7,
    title: "ঠিক মাপ",
    text: "Server ঠিক 7 Byte নিল, seats=2। Body শেষ, Request সম্পূর্ণ। এরপর যা আসবে তা নতুন Request, আর একই Connection এ সেটা নিশ্চিন্তে পাঠানো যায়।",
  },
  {
    value: 12,
    title: "বেশি বলা হলো",
    text: "Server 7 Byte পেল, কিন্তু তাকে বলা হয়েছে 12। সে বাকি 5 Byte এর অপেক্ষায় বসে রইল। ওদিকে Client ভাবছে সে সব পাঠিয়ে দিয়েছে, এখন উত্তরের অপেক্ষায়। দুইজনই অপেক্ষা করছে, কেউ এগোচ্ছে না, যতক্ষণ না কারো Timeout শেষ হয়। বাইরে থেকে দেখতে মনে হয় সাইটটা ঝুলে গেছে।",
  },
];

export function ContentLengthLab() {
  const [value, setValue] = useState(7);
  const chosen = LENGTH_CASES.find((c) => c.value === value) ?? LENGTH_CASES[1];
  const cells = Math.max(value, LENGTH_BODY.length);

  return (
    <Panel
      label="Interactive"
      title="Content-Length ভুল লিখলে কী হয়"
      footer="Body টা ঠিক 7 Byte, seats=2। Header এ মাপটা বদলে দেখুন Server কী বোঝে। কম বললে Body কেটে যায় আর বাকিটা জঞ্জাল হয়ে পরের Request এর ঘাড়ে পড়ে। বেশি বললে দুই পাশ একে অপরের অপেক্ষায় আটকে থাকে। এই কারণেই নিজে হাতে Content-Length লিখবেন না, আপনার Framework কে গুনতে দিন।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Label>Content-Length</Label>
        {LENGTH_CASES.map((c) => (
          <Chip key={c.value} active={value === c.value} onClick={() => setValue(c.value)} data-length={c.value}>
            {String(c.value)}
          </Chip>
        ))}
      </div>

      <div className="border border-border bg-muted/20 px-4 py-3 font-mono text-[0.75rem] mb-4">
        <div className="text-foreground/85">POST /api/bookings/bk_7Q2M9X/seats HTTP/1.1</div>
        <div className="text-foreground/85">Host: islandtours.example</div>
        <div className="text-foreground/85">Content-Type: application/x-www-form-urlencoded</div>
        <div className="text-primary font-bold">Content-Length: {value}</div>
        <div className="text-muted-foreground">(ফাঁকা লাইন)</div>
      </div>

      <div className="flex flex-wrap gap-1 mb-2" data-cells={cells}>
        {Array.from({ length: cells }, (_, i) => {
          const arrived = i < LENGTH_BODY.length;
          const counted = i < value;
          const state = arrived && counted ? "body" : arrived ? "leftover" : "missing";
          return (
            <span
              key={i}
              data-cell={state}
              className={cn(
                "w-8 h-9 flex items-center justify-center font-mono text-[0.8125rem] border transition-colors",
                state === "body" && "border-primary bg-primary/15 text-primary font-bold",
                state === "leftover" && "border-foreground/60 bg-foreground/10 text-foreground font-bold",
                state === "missing" && "border-dashed border-border text-muted-foreground/50",
              )}
            >
              {arrived ? LENGTH_BODY[i] : "?"}
            </span>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 mb-5 font-mono text-[0.625rem] text-muted-foreground">
        <span>রঙিন: Server যাকে Body ধরল</span>
        <span>গাঢ়: বাড়তি, পরের Request ভাবল</span>
        <span>ফাঁকা: আসেনি, Server অপেক্ষায়</span>
      </div>

      <div className="border border-border px-4 py-3" data-case={chosen.value}>
        <span className="font-mono text-[0.6875rem] font-bold text-primary">{chosen.title}</span>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{chosen.text}</p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Version এর গল্প, একটার সমস্যা থেকে পরেরটার জন্ম                       */
/* ------------------------------------------------------------------------- */

const VERSIONS: {
  id: string;
  name: string;
  year: string;
  spec: string;
  wire: string;
  added: string[];
  left: string;
}[] = [
  {
    id: "0.9",
    name: "HTTP/0.9",
    year: "1991",
    spec: "আলাদা কোনো RFC নেই, Tim Berners-Lee এর এক পাতার বর্ণনা",
    wire: "GET /tours.html",
    added: ["এক লাইনের Request, শুধু GET", "উত্তরে শুধু HTML, কোনো Header বা Status নেই", "উত্তর শেষ হলে Server Connection বন্ধ করে দেয়"],
    left: "ভুল হলে জানানোর উপায় নেই, ছবি বা অন্য ফাইল পাঠানোর উপায় নেই, কোনো বাড়তি তথ্য নেই।",
  },
  {
    id: "1.0",
    name: "HTTP/1.0",
    year: "1996",
    spec: "RFC 1945",
    wire: "GET /tours.html HTTP/1.0\r\nUser-Agent: Mosaic\r\n\r\n",
    added: ["Request Line এ Version", "Status Line আর Status Code, যেমন 200 আর 404", "Header, তাই Content-Type দিয়ে ছবি আর অন্য ফাইলও পাঠানো গেল", "POST আর HEAD"],
    left: "প্রতিটা Request এ নতুন TCP Connection। আর Host Header বাধ্যতামূলক নয়, তাই এক IP তে কার্যত একটাই সাইট।",
  },
  {
    id: "1.1",
    name: "HTTP/1.1",
    year: "1997",
    spec: "RFC 2068, পরে 2616, আজ RFC 9110 আর 9112 (2022)",
    wire: "GET /tours HTTP/1.1\r\nHost: islandtours.example\r\n\r\n",
    added: ["Host বাধ্যতামূলক, তাই এক IP তে অনেক সাইট", "Keep-Alive স্বাভাবিক নিয়ম, একটা Connection এ অনেক Request", "chunked, মাপ না জেনেও উত্তর পাঠানো", "Cache নিয়ন্ত্রণের Header, আরও Method"],
    left: "একটা Connection এ একসাথে একটাই উত্তর, পেছনের সবাই লাইনে। Browser তাই ছয়টা Connection খোলে। আর প্রতিটা Request এ একই লম্বা Header বারবার লেখা হয়।",
  },
  {
    id: "2",
    name: "HTTP/2",
    year: "2015",
    spec: "RFC 7540, আজ RFC 9113 (2022)",
    wire: "HEADERS frame, stream 1\n:method GET\n:path /tours\n:authority islandtours.example",
    added: ["লেখার বদলে Binary Frame", "একটা Connection এ অনেক Stream একসাথে, Multiplexing", "HPACK দিয়ে Header ছোট করা, বারবার একই কথা না লেখা", "Browser এ শুধু HTTPS এর উপরে"],
    left: "নিচে TCP একটাই। একটা Packet হারালে TCP পরের সব Byte আটকে রাখে, তাই সব Stream একসাথে থামে। আর শুরুতে TCP আর TLS এর দুইটা আলাদা Handshake।",
  },
  {
    id: "3",
    name: "HTTP/3",
    year: "2022",
    spec: "RFC 9114, নিচে QUIC, RFC 9000 (2021)",
    wire: "QUIC packet over UDP 443\nHEADERS frame, stream 0\n:method GET\n:path /tours",
    added: ["TCP এর বদলে UDP এর উপরে QUIC", "প্রতিটা Stream এর হারানো Packet আলাদাভাবে সামলানো", "TLS 1.3 ভেতরেই গাঁথা, শুরু দ্রুত", "Connection ID, তাই Wi-Fi থেকে Mobile Data তে গেলেও Connection টিকে থাকে"],
    left: "কিছু Firewall UDP 443 আটকে রাখে, তখন Browser নিঃশব্দে HTTP/2 তে ফিরে যায়। আর QUIC চালাতে CPU একটু বেশি লাগে।",
  },
];

export function VersionTimelineLab() {
  const [id, setId] = useState("1.1");
  const index = VERSIONS.findIndex((v) => v.id === id);
  const v = VERSIONS[index];
  const next = VERSIONS[index + 1];

  return (
    <Panel
      label="Interactive"
      title="পাঁচটা Version, একটার সমস্যা থেকে পরেরটা"
      footer="বাঁ থেকে ডানে একটা একটা করে Version খুলুন। প্রতিটার নিচে লেখা যে সমস্যাটা রয়ে গেল, আর পরের Version ঠিক সেটাই সারাতে এসেছে। এভাবে পড়লে Version গুলো আর মুখস্থের তালিকা থাকে না, একটা গল্প হয়ে যায়। খেয়াল করুন, প্রতিটা Version এ Method, Status Code আর Header এর মানে একই থেকে গেছে, বদলেছে শুধু তারে পাঠানোর কায়দা।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {VERSIONS.map((ver) => (
          <Chip key={ver.id} active={id === ver.id} onClick={() => setId(ver.id)} data-version={ver.id}>
            {ver.name}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-5" data-current={v.id}>
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 mb-2">
            <span className="font-mono text-[1rem] font-bold text-primary">{v.name}</span>
            <span className="font-mono text-[0.6875rem] text-muted-foreground">{v.year}</span>
          </div>
          <p className="font-mono text-[0.625rem] text-muted-foreground mb-3">{v.spec}</p>
          <pre className="border border-border bg-muted/20 px-3 py-2 font-mono text-[0.6875rem] text-foreground/85 whitespace-pre-wrap">
            {v.wire}
          </pre>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            তারে কথাটা দেখতে এরকম{v.id === "2" || v.id === "3" ? ", তবে আসলে Binary, এখানে পড়ার মতো করে লেখা" : ""}।
          </p>
        </div>
        <div>
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
            যা নিয়ে এলো
          </span>
          <ul className="mt-2 mb-4 space-y-1.5">
            {v.added.map((a) => (
              <li key={a} className="text-sm text-foreground/85 leading-relaxed pl-3 border-l-2 border-primary/50">
                {a}
              </li>
            ))}
          </ul>
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
            যে সমস্যা রয়ে গেল
          </span>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.left}</p>
          {next && (
            <button
              onClick={() => setId(next.id)}
              className="mt-4 px-3 py-1.5 border border-primary bg-primary/10 text-primary text-[0.6875rem] font-bold hover:bg-primary/20 transition-colors"
            >
              {next.name} কীভাবে সারাল
            </button>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. একটা হারানো Packet, তিন Version এ                                      */
/* ------------------------------------------------------------------------- */

const RACE_FILES = ["style.css", "app.js", "boat-1.jpg", "boat-2.jpg", "boat-3.jpg", "map.svg", "logo.png", "font.woff2"];
const LOST_FILE = 1; // app.js এর একটা Packet হারায়
const ROUNDS = 5;

type Segment = { from: number; to: number; kind: "setup" | "wait" | "transfer" | "stall" };

type RaceVersion = "h1" | "h2" | "h3";

/**
 * সরল মডেল, এক ঘর মানে এক Round Trip। HTTP/1.1 এ ছয়টা Connection, প্রতিটার
 * নিজের Handshake (TCP আর TLS, দুই Round)। HTTP/2 এ একটাই Connection, একই দুই
 * Round। HTTP/3 এ QUIC দুই Handshake কে এক Round এ সারে। Packet হারালে আবার
 * পাঠাতে এক Round বেশি লাগে।
 */
function raceSegments(version: RaceVersion, loss: boolean, file: number): Segment[] {
  if (version === "h1") {
    if (file < 6) {
      const segs: Segment[] = [
        { from: 0, to: 2, kind: "setup" },
        { from: 2, to: 3, kind: "transfer" },
      ];
      if (loss && file === LOST_FILE) segs.push({ from: 3, to: 4, kind: "stall" });
      return segs;
    }
    // সাত আর আট নম্বর ফাইল লাইনে দাঁড়ায়, প্রথম খালি হওয়া Connection এ যায়
    return [
      { from: 0, to: 3, kind: "wait" },
      { from: 3, to: 4, kind: "transfer" },
    ];
  }
  if (version === "h2") {
    const segs: Segment[] = [
      { from: 0, to: 2, kind: "setup" },
      { from: 2, to: 3, kind: "transfer" },
    ];
    // একটাই TCP: হারানো Byte ফিরে না আসা পর্যন্ত সব Stream আটকে
    if (loss) segs.push({ from: 3, to: 4, kind: "stall" });
    return segs;
  }
  const segs: Segment[] = [
    { from: 0, to: 1, kind: "setup" },
    { from: 1, to: 2, kind: "transfer" },
  ];
  if (loss && file === LOST_FILE) segs.push({ from: 2, to: 3, kind: "stall" });
  return segs;
}

const RACE_NAMES: Record<RaceVersion, { name: string; connections: string }> = {
  h1: { name: "HTTP/1.1", connections: "ছয়টা TCP Connection" },
  h2: { name: "HTTP/2", connections: "একটা TCP Connection" },
  h3: { name: "HTTP/3", connections: "একটা QUIC Connection, UDP তে" },
};

const SEGMENT_STYLE: Record<Segment["kind"], string> = {
  setup: "bg-foreground/10 border border-foreground/25",
  wait: "border border-dashed border-foreground/40",
  transfer: "bg-primary/25 border border-primary",
  stall: "bg-foreground/25 border border-dashed border-foreground/70",
};

export function ProtocolLossLab() {
  const [version, setVersion] = useState<RaceVersion>("h2");
  const [loss, setLoss] = useState(false);

  const rows = RACE_FILES.map((name, i) => ({ name, segments: raceSegments(version, loss, i) }));
  const finish = Math.max(...rows.map((r) => r.segments[r.segments.length - 1].to));
  const stalled = rows.filter((r) => r.segments.some((s) => s.kind === "stall")).length;

  return (
    <Panel
      label="Interactive"
      title="আটটা ফাইল, তিন Version, একটা হারানো Packet"
      footer="একটা পাতা খুলতে আটটা ফাইল লাগে। প্রথমে Packet হারানো বন্ধ রেখে তিনটা Version দেখুন: কে কত Round এ শেষ করে, কে কয়টা Connection খোলে। তারপর হারানো চালু করে আবার দেখুন। HTTP/2 এ একটা ফাইলের হারানো Packet সবগুলোকে থামিয়ে দেয়, HTTP/3 এ থামে শুধু সেই একটা। এটা একটা সরল মডেল, এক ঘর মানে এক Round Trip, আসল মিলিসেকেন্ড নয়। তবে তফাতের চেহারাটা আসল।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Label>Version</Label>
        {(["h1", "h2", "h3"] as const).map((v) => (
          <Chip key={v} active={version === v} onClick={() => setVersion(v)} data-race={v}>
            {RACE_NAMES[v].name}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Label>Packet</Label>
        <Chip active={!loss} onClick={() => setLoss(false)} data-loss="off">
          কিছু হারায় না
        </Chip>
        <Chip active={loss} onClick={() => setLoss(true)} data-loss="on">
          app.js এর একটা Packet হারায়
        </Chip>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 560 }}>
          <div className="grid grid-cols-[110px_1fr] gap-3 mb-2">
            <span />
            <div className="grid font-mono text-[0.5625rem] text-muted-foreground" style={{ gridTemplateColumns: `repeat(${ROUNDS}, 1fr)` }}>
              {Array.from({ length: ROUNDS }, (_, r) => (
                <span key={r} className="border-l border-border pl-1">
                  Round {toBn(r + 1)}
                </span>
              ))}
            </div>
          </div>
          {rows.map((row, i) => (
            <div key={row.name} className="grid grid-cols-[110px_1fr] gap-3 items-center mb-1.5" data-file={row.name}>
              <span className={cn("font-mono text-[0.6875rem]", i === LOST_FILE && loss ? "text-foreground font-bold" : "text-muted-foreground")}>
                {row.name}
              </span>
              <div className="relative h-6 border-l border-border bg-muted/10">
                {row.segments.map((s, k) => (
                  <span
                    key={k}
                    data-seg={s.kind}
                    className={cn("absolute top-0.5 bottom-0.5 transition-all duration-300", SEGMENT_STYLE[s.kind])}
                    style={{ left: `${(s.from / ROUNDS) * 100}%`, width: `calc(${((s.to - s.from) / ROUNDS) * 100}% - 2px)` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 font-mono text-[0.625rem] text-muted-foreground">
        <span>হালকা: Handshake</span>
        <span>ফাঁকা দাগ: লাইনে অপেক্ষা</span>
        <span>রঙিন: ফাইল আসছে</span>
        <span>গাঢ় দাগ: হারানো Packet এর জন্য থেমে আছে</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5" data-finish={finish} data-stalled={stalled}>
        <div className="border border-border px-4 py-3">
          <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">সব শেষ</span>
          <span className="font-mono text-[1rem] font-bold text-primary">Round {toBn(finish)}</span>
        </div>
        <div className="border border-border px-4 py-3">
          <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">Connection</span>
          <span className="text-sm font-bold text-foreground">{RACE_NAMES[version].connections}</span>
        </div>
        <div className="border border-border px-4 py-3">
          <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">থেমে থাকা ফাইল</span>
          <span className="font-mono text-[1rem] font-bold text-foreground">{toBn(stalled)} টা</span>
        </div>
      </div>
    </Panel>
  );
}
