"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
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

function Choice({
  active,
  onClick,
  children,
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      onClick={onClick}
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

/* ------------------------------------------------------------------------- */
/* 1. একটা টুকরো হারাল: TCP অপেক্ষা করে, UDP এগিয়ে যায়                        */
/* ------------------------------------------------------------------------- */

const PIECES = [1, 2, 3, 4, 5, 6, 7, 8];
const LOST = 3;
/** TCP তে হারানো টুকরোটা আবার পাঠানো হয়ে এই মুহূর্তে পৌঁছায়। */
const RESENT_AT = 6;
const LAST_TICK = 8;

type Transport = "tcp" | "udp";
type Work = "call" | "file";
type PieceState = "waiting" | "lost" | "held" | "late" | "ok";

function pieceState(transport: Transport, piece: number, tick: number): PieceState {
  if (tick < piece) return "waiting";
  if (transport === "udp") return piece === LOST ? "lost" : "ok";
  if (piece < LOST) return "ok";
  if (tick < RESENT_AT) return piece === LOST ? "lost" : "held";
  return piece < RESENT_AT ? "late" : "ok";
}

const STATE_TEXT: Record<PieceState, string> = {
  waiting: "এখনো আসেনি",
  lost: "হারিয়েছে",
  held: "Kernel এ আটকা",
  late: "দেরিতে পেল",
  ok: "সময়মতো পেল",
};

function verdict(transport: Transport, work: Work): string {
  if (work === "call") {
    return transport === "tcp"
      ? "আটটা টুকরোই পৌঁছেছে, একটাও হারায়নি। কিন্তু ৩ নম্বরটা আবার না আসা পর্যন্ত ৪ আর ৫ নম্বর পৌঁছে গিয়েও Kernel এ আটকে ছিল, কারণ TCP ক্রম ভেঙে কিছু দেয় না। ফলে কলটা তিন মুহূর্ত জমে রইল, তারপর তিনটা পুরনো টুকরো একসাথে এলো। কলে এই তিনটা টুকরো এখন কাজে লাগে না, কথাটা তো আগেই বলা হয়ে গেছে। নিখুঁত, কিন্তু দেরিতে, আর কলে দেরি মানেই নষ্ট।"
      : "৩ নম্বর টুকরোটা চিরতরে হারিয়েছে, কেউ সেটা আবার পাঠায়নি। কিন্তু বাকি সাতটা ঠিক নিজের সময়ে পৌঁছেছে। কলে আপনি টের পেলেন এক মুহূর্তের একটা খটকা, তারপর কথা আবার স্বাভাবিক। কল জমে যায়নি, পিছিয়েও পড়েনি। এই কারণেই Voice আর Video Call UDP তে চলে।"
    ;
  }
  return transport === "tcp"
    ? "আটটা টুকরোই পৌঁছেছে, ঠিক ক্রমে। মাঝে তিন মুহূর্ত দেরি হয়েছে, কিন্তু ফাইল নামানোর সময় সেটা কেউ টেরই পায় না। ফাইলটা নিখুঁত। এই কারণেই ফাইল, Web Page, Database, যেখানে একটা Byte হারালেও চলবে না, সেখানে TCP।"
    : "সাতটা টুকরো দ্রুত পৌঁছেছে, কিন্তু ৩ নম্বরটা নেই। ফাইলের মাঝখানে একটা গর্ত, ফাইলটা ভাঙা। UDP নিজে থেকে এটা সারাবে না। ফাইল UDP তে পাঠাতে চাইলে আপনার Application কে নিজে খেয়াল করতে হবে কোন টুকরো আসেনি আর সেটা আবার চাইতে হবে, মানে TCP র কাজটা নিজে বানাতে হবে।";
}

export function LostPieceLab() {
  const reduce = useReducedMotion();
  const [transport, setTransport] = useState<Transport>("tcp");
  const [work, setWork] = useState<Work>("call");
  const [tick, setTick] = useState(0);

  const states = PIECES.map((p) => ({ piece: p, state: pieceState(transport, p, tick) }));
  const done = tick >= LAST_TICK;
  // এই মুহূর্ত পর্যন্ত কয়টা মুহূর্তে Application এর হাতে নতুন কিছু আসেনি
  const emptyMoments = PIECES.filter((p) => {
    if (p > tick) return false;
    if (transport === "udp") return p === LOST;
    return p >= LOST && p < RESENT_AT;
  }).length;

  return (
    <Panel
      label="Interactive"
      title="আটটা টুকরো, তিন নম্বরটা পথে হারাল"
      footer="পাঠানো হচ্ছে আটটা টুকরো, প্রতি মুহূর্তে একটা। ৩ নম্বরটা পথে হারিয়ে যাবে। উপরে বেছে নিন কোন Transport আর কী কাজ, তারপর এক মুহূর্ত করে এগোন। চারটা জোড়াই চালিয়ে দেখুন। খেয়াল করার জিনিস দুইটা। TCP তে ৪ আর ৫ নম্বর পৌঁছে গিয়েও বসে থাকে, কারণ তাদের সামনের জন আসেনি। আর একই আচরণ কলের বেলায় সমস্যা, ফাইলের বেলায় আশীর্বাদ। কোনটা ভালো সেটা Protocol এর গুণ নয়, কাজের ধরনের উপর নির্ভর করে।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          Transport
        </span>
        <Choice active={transport === "tcp"} onClick={() => { setTransport("tcp"); setTick(0); }} data-transport="tcp">
          TCP
        </Choice>
        <Choice active={transport === "udp"} onClick={() => { setTransport("udp"); setTick(0); }} data-transport="udp">
          UDP
        </Choice>
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground ml-3 mr-1">
          কাজ
        </span>
        <Choice active={work === "call"} onClick={() => { setWork("call"); setTick(0); }} data-work="call">
          Video Call
        </Choice>
        <Choice active={work === "file"} onClick={() => { setWork("file"); setTick(0); }} data-work="file">
          ফাইল নামানো
        </Choice>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setTick((t) => Math.min(LAST_TICK, t + 1))}
          disabled={done}
          data-action="advance"
          className={cn(
            "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            done
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          এক মুহূর্ত এগোন
        </button>
        <button
          onClick={() => setTick(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[0.625rem] text-muted-foreground">
          মুহূর্ত {toBn(tick)} / {toBn(LAST_TICK)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {states.map(({ piece, state }) => (
          <div
            key={piece}
            data-piece={piece}
            data-state={state}
            className={cn(
              "border px-3 py-2 transition-colors",
              state === "ok" && "border-primary/50 bg-primary/5",
              state === "late" && "border-primary/40 bg-muted/40",
              state === "held" && "border-border bg-muted/50",
              state === "lost" && "border-destructive/60 bg-destructive/5",
              state === "waiting" && "border-border bg-background opacity-50",
            )}
          >
            <div className="font-mono text-[0.8125rem] font-bold text-foreground">
              টুকরো {toBn(piece)}
            </div>
            <div
              className={cn(
                "text-[0.625rem]",
                state === "lost" ? "text-destructive" : state === "ok" ? "text-primary" : "text-muted-foreground",
              )}
            >
              {STATE_TEXT[state]}
            </div>
          </div>
        ))}
      </div>

      <div className="font-mono text-[0.625rem] text-muted-foreground mb-3" data-empty={emptyMoments}>
        Application এর হাত খালি ছিল {toBn(emptyMoments)} মুহূর্ত
      </div>

      <motion.p
        key={`${transport}-${work}-${done}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
      >
        {done
          ? verdict(transport, work)
          : "এগিয়ে যান। ৩ নম্বর মুহূর্তে কী ঘটে, আর তার পরের দুই মুহূর্তে ৪ আর ৫ নম্বরের কী হয়, সেটা দেখুন।"}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Datagram কত বড় হলে কী হয়                                               */
/* ------------------------------------------------------------------------- */

const MTU = 1500;
const IP_HEADER = 20;
const UDP_HEADER = 8;
const MAX_UDP_DATA = 65507;
const SIZES = [512, 1232, 1472, 1473, 4000, 9000, 65507, 65508];

export function DatagramSizeLab() {
  const reduce = useReducedMotion();
  const [size, setSize] = useState(1232);

  const possible = size <= MAX_UDP_DATA;
  const perFragment = MTU - IP_HEADER;
  const fragments = possible ? Math.ceil((size + UDP_HEADER) / perFragment) : 0;
  const single = fragments === 1;
  // প্রতিটা টুকরো ১% সম্ভাবনায় হারালে পুরো Datagram হারানোর সম্ভাবনা
  const lossPct = possible ? (1 - Math.pow(0.99, fragments)) * 100 : 0;
  const lossText = toBn(lossPct.toFixed(lossPct < 10 ? 1 : 0));

  let text: string;
  if (!possible) {
    text =
      "এটা পাঠানোই যাবে না। UDP Header এর Length ঘরটা ২ Byte এর, তাই একটা IP Packet এ সর্বোচ্চ 65535 Byte ধরে। তা থেকে IP Header 20 আর UDP Header 8 বাদ দিলে Data র জন্য থাকে 65507। এর বেশি দিলে Kernel পাঠানোর আগেই EMSGSIZE Error দিয়ে ফিরিয়ে দেয়।";
  } else if (single && size <= 1232) {
    text =
      "একটা Packet এ আরামে আঁটে, আর হাতে জায়গাও থাকে। পথে VPN বা Tunnel থাকলে তারা নিজের Header জোড়ে, এই ফাঁকা জায়গাটা তখন কাজে লাগে। DNS এখন সাধারণত 1232 আর QUIC 1200 Byte এর আশেপাশে থাকে ঠিক এই কারণে। নিজে UDP Protocol বানালে এই সীমার নিচে থাকুন।";
  } else if (single) {
    text =
      "একটা সাধারণ Ethernet Packet এ ঠিক কানায় কানায় আঁটে (1472 + 8 + 20 = 1500)। আপনার নিজের Network এ চলবে। কিন্তু পথে কোথাও MTU ছোট হলে, যেমন PPPoE বা VPN, এটা আর আঁটবে না। তাই এটা নিরাপদ সীমা নয়, সর্বোচ্চ সীমা।";
  } else {
    text = `একটা Packet এ আঁটে না, তাই IP এটাকে ${toBn(fragments)}টা টুকরোয় ভাঙবে, যাকে বলে Fragmentation। সমস্যা হলো, একটা টুকরো হারালেই পুরো Datagram বাতিল, কারণ UDP আধখানা বার্তা দেয় না আর হারানো টুকরো আবার চায়ও না। প্রতিটা টুকরো হারানোর সম্ভাবনা ১% হলে পুরো Datagram হারানোর সম্ভাবনা দাঁড়ায় প্রায় ${lossText}%। তার উপর অনেক Firewall টুকরো Packet সোজা ফেলে দেয়।`;
  }

  return (
    <Panel
      label="Interactive"
      title="Datagram এর আকার বাছুন, দেখুন পথে তার কী হয়"
      footer="হিসাবটা ধরা হয়েছে সাধারণ Ethernet এর জন্য, যেখানে একটা IP Packet সর্বোচ্চ 1500 Byte হতে পারে। এই সীমার নাম MTU, যা নিয়ে বিস্তারিত আসছে Packet, Segment and Frame লেসনে। 1472 আর 1473 পরপর চেপে দেখুন, মাত্র এক Byte এর জন্য একটা Packet দুইটা হয়ে যায়। আর খেয়াল করুন, আকার যত বাড়ে, পুরোটা হারানোর ঝুঁকি তত দ্রুত বাড়ে। আপনার নিজের যন্ত্র আরও আগেই থামিয়ে দিতে পারে। macOS এ একটা UDP Datagram এর সীমা স্বাভাবিকভাবে 9216 Byte।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          Data, Byte
        </span>
        {SIZES.map((s) => (
          <Choice key={s} active={size === s} onClick={() => setSize(s)} data-size={s}>
            {s}
          </Choice>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
        <div className="border border-border bg-background px-3 py-2">
          <div className="text-[0.625rem] text-muted-foreground">IP Packet এর মোট আকার</div>
          <div className="font-mono text-[0.8125rem] font-bold text-foreground" data-total={possible ? size + UDP_HEADER + IP_HEADER : -1}>
            {possible ? `${size} + 8 + 20 = ${size + UDP_HEADER + IP_HEADER}` : "সীমার বাইরে"}
          </div>
        </div>
        <div
          className={cn(
            "border px-3 py-2",
            !possible
              ? "border-destructive/60 bg-destructive/5"
              : single
                ? "border-primary/50 bg-primary/5"
                : "border-border bg-muted/40",
          )}
        >
          <div className="text-[0.625rem] text-muted-foreground">পথে কয়টা Packet</div>
          <div className="font-mono text-[0.8125rem] font-bold text-foreground" data-fragments={fragments}>
            {!possible ? "EMSGSIZE" : single ? "১টা, ভাঙেনি" : `${toBn(fragments)}টা টুকরো`}
          </div>
        </div>
        <div className="border border-border bg-background px-3 py-2">
          <div className="text-[0.625rem] text-muted-foreground">পুরোটা হারানোর ঝুঁকি</div>
          <div className="font-mono text-[0.8125rem] font-bold text-foreground">
            {possible ? `প্রায় ${lossText}%` : "প্রযোজ্য নয়"}
          </div>
        </div>
      </div>

      {possible && (
        <div className="flex flex-wrap gap-1 mb-5" aria-hidden>
          {Array.from({ length: Math.min(fragments, 45) }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-4 w-6 border",
                single ? "border-primary bg-primary/20" : "border-border bg-muted",
              )}
            />
          ))}
        </div>
      )}

      <motion.p
        key={size}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
      >
        {text}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. কোন কাজে কোনটা, নিজে বাছুন                                              */
/* ------------------------------------------------------------------------- */

const CASES: { id: string; what: string; answer: Transport; why: string }[] = [
  {
    id: "payment",
    what: "Island Tours এ বুকিং এর টাকা পরিশোধের Request",
    answer: "tcp",
    why: "একটা Byte হারালে বা দুইবার পৌঁছালে টাকার হিসাব ভুল। এখানে নিখুঁত হওয়া গতির চেয়ে জরুরি।",
  },
  {
    id: "dns",
    what: "islandtours.example এর IP জানতে একটা DNS প্রশ্ন",
    answer: "udp",
    why: "এক Packet প্রশ্ন, এক Packet উত্তর। Handshake করলে প্রশ্নের চেয়ে আয়োজনই বড় হয়ে যেত। উত্তর না এলে আবার জিজ্ঞেস করলেই হয়।",
  },
  {
    id: "call",
    what: "গাইডের সাথে পর্যটকের Video Call",
    answer: "udp",
    why: "আধা সেকেন্ড আগের শব্দ এখন এসে কাজে লাগে না। হারানো টুকরোর জন্য থামার চেয়ে এগিয়ে যাওয়াই ভালো।",
  },
  {
    id: "db",
    what: "Backend থেকে Database এ একটা Query",
    answer: "tcp",
    why: "Query আর তার ফলাফল পুরোটা, ঠিক ক্রমে চাই। আর Connection টা খোলা রেখে বারবার ব্যবহার করা যায়।",
  },
  {
    id: "metric",
    what: "প্রতিটা Request শেষে একটা Metric পাঠানো (StatsD)",
    answer: "udp",
    why: "হাজারটার মধ্যে একটা Metric হারালে গ্রাফে কিছু যায় আসে না। কিন্তু Metric সার্ভার ধীর হলে আপনার App যেন আটকে না থাকে, এটাই আসল চাওয়া।",
  },
  {
    id: "ssh",
    what: "সার্ভারে SSH দিয়ে ঢুকে কমান্ড চালানো",
    answer: "tcp",
    why: "আপনার টাইপ করা প্রতিটা অক্ষর ঠিক ক্রমে পৌঁছাতে হবে। rm এর পরের অংশটা হারালে বিপদ।",
  },
  {
    id: "game",
    what: "Online Game এ খেলোয়াড়ের এই মুহূর্তের অবস্থান",
    answer: "udp",
    why: "হারানো অবস্থান আবার পাঠিয়ে লাভ নেই, ততক্ষণে খেলোয়াড় সরে গেছে। পরের Packet এ নতুন অবস্থান এমনিই আসছে।",
  },
  {
    id: "h3",
    what: "HTTP/3 দিয়ে একটা Web Page খোলা",
    answer: "udp",
    why: "ফাঁদের প্রশ্ন। Web Page এ নিখুঁত Data চাই, তবু উত্তর UDP। কারণ HTTP/3 চলে QUIC এর উপর, আর QUIC নিজেই UDP র উপরে ক্রম, ACK আর Retransmission বানিয়ে নিয়েছে।",
  },
];

export function TransportPickerLab() {
  const [picked, setPicked] = useState<Record<string, Transport>>({});

  const answered = CASES.filter((c) => picked[c.id]).length;
  const right = CASES.filter((c) => picked[c.id] === c.answer).length;

  return (
    <Panel
      label="Interactive"
      title="আটটা কাজ, প্রতিটায় TCP নাকি UDP"
      footer="প্রতিটা কাজ পড়ে আগে নিজে ভাবুন, তারপর বাছুন। ভাবার সময় দুইটা প্রশ্ন করুন। এক, একটা টুকরো হারালে কি পুরো কাজটা নষ্ট, নাকি সামান্য খটকা? দুই, দেরিতে পৌঁছানো টুকরো কি এখনো কাজে লাগে? প্রথমটায় নষ্ট আর দ্বিতীয়টায় লাগে হলে TCP। উল্টো হলে UDP। শেষ প্রশ্নটায় একটা ফাঁদ আছে, সেটা ধরতে পারলে আপনি এই লেসনের সবচেয়ে সূক্ষ্ম কথাটা বুঝে গেছেন।"
    >
      <div className="space-y-2 mb-5">
        {CASES.map((c) => {
          const choice = picked[c.id];
          const correct = choice === c.answer;
          return (
            <div
              key={c.id}
              data-case={c.id}
              data-result={choice ? (correct ? "right" : "wrong") : "open"}
              className={cn(
                "border px-3 py-3 transition-colors",
                !choice && "border-border bg-background",
                choice && correct && "border-primary/50 bg-primary/5",
                choice && !correct && "border-destructive/50 bg-destructive/5",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[0.75rem] font-bold text-foreground">{c.what}</div>
                <div className="flex gap-2">
                  <Choice
                    active={choice === "tcp"}
                    onClick={() => setPicked((p) => ({ ...p, [c.id]: "tcp" }))}
                    data-pick="tcp"
                  >
                    TCP
                  </Choice>
                  <Choice
                    active={choice === "udp"}
                    onClick={() => setPicked((p) => ({ ...p, [c.id]: "udp" }))}
                    data-pick="udp"
                  >
                    UDP
                  </Choice>
                </div>
              </div>
              {choice && (
                <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">
                  <strong className={correct ? "text-primary" : "text-destructive"}>
                    {correct ? "ঠিক। " : `এখানে ${c.answer.toUpperCase()}। `}
                  </strong>
                  {c.why}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[0.625rem] text-muted-foreground" data-right={right} data-answered={answered}>
          {toBn(answered)}টার উত্তর দিয়েছেন, ঠিক হয়েছে {toBn(right)}টা
        </span>
        <button
          onClick={() => setPicked({})}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </Panel>
  );
}
