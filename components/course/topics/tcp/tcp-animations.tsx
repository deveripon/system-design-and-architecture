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

const BTN = "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors";
const BTN_ON = "border-primary bg-primary/10 text-primary";
const BTN_OFF = "border-border text-muted-foreground hover:text-foreground hover:border-primary/40";

/* ------------------------------------------------------------------------- */
/* 1. TCP Header, ঘর ধরে ধরে                                                  */
/* ------------------------------------------------------------------------- */

type Field = {
  id: string;
  name: string;
  bits: string;
  /** আট ভাগের গ্রিডে কয় ভাগ জুড়ে থাকবে (৩২ Bit = ৮ ভাগ) */
  span: number;
  value: string;
  job: string;
  serves: string;
};

const FIELDS: Field[] = [
  {
    id: "sport",
    name: "Source Port",
    bits: "১৬ Bit",
    span: 4,
    value: "51514",
    job: "যে Program পাঠাচ্ছে তার Port। আমাদের গল্পে ফোনের Browser এর জন্য Kernel যে অস্থায়ী Port বেছে দিয়েছে। উত্তরটা ফেরার সময় এই নম্বর দেখেই ফোনের Kernel বুঝবে কোন Program কে দিতে হবে।",
    serves: "সঠিক Program খুঁজে পাওয়া",
  },
  {
    id: "dport",
    name: "Destination Port",
    bits: "১৬ Bit",
    span: 4,
    value: "443",
    job: "যে Program এর কাছে যাচ্ছে তার Port। 443 মানে HTTPS। IP Header মেশিন পর্যন্ত পৌঁছে দেয়, আর এই ঘরটা মেশিনের ভেতরে সঠিক ফ্ল্যাটের দরজায় পৌঁছে দেয়। ১৬ Bit বলেই Port এর সর্বোচ্চ মান 65535।",
    serves: "সঠিক Program খুঁজে পাওয়া",
  },
  {
    id: "seq",
    name: "Sequence Number",
    bits: "৩২ Bit",
    span: 8,
    value: "1001",
    job: "এই Segment এর প্রথম Byte টা পুরো স্রোতের কত নম্বর Byte। TCP বার্তা গোনে না, Byte গোনে। এই একটা সংখ্যা দিয়েই Receiver তিনটা কাজ করে। ক্রম ভেঙে এলে সাজিয়ে নেয়, একই Byte দুইবার এলে ফেলে দেয়, আর মাঝে ফাঁক থাকলে টের পায় কিছু হারিয়েছে।",
    serves: "ক্রম, হারানো ধরা, নকল ধরা",
  },
  {
    id: "ack",
    name: "Acknowledgment Number",
    bits: "৩২ Bit",
    span: 8,
    value: "5201",
    job: "উল্টো দিকের হিসাব। এর মানে, আপনার কাছ থেকে এর আগের সব Byte আমি পেয়ে গেছি, এবার এই নম্বরের Byte টা চাই। অর্থাৎ এটা পরের প্রত্যাশিত Byte এর নম্বর, শেষ পাওয়া Byte এর নয়। প্রতিটা Segment এ এই ঘর থাকে, তাই Data পাঠানোর সাথে সাথেই প্রাপ্তি স্বীকারও সেরে ফেলা যায়।",
    serves: "প্রাপ্তি স্বীকার, Retransmission",
  },
  {
    id: "offset",
    name: "Data Offset",
    bits: "৪ Bit",
    span: 1,
    value: "8",
    job: "Header টা কত লম্বা, ৪ Byte এর এককে। 5 মানে ২০ Byte, যা সবচেয়ে ছোট Header। 8 মানে ৩২ Byte, অর্থাৎ ১২ Byte Options আছে। Options এর দৈর্ঘ্য বদলায়, তাই Receiver কে জানাতে হয় Header কোথায় শেষ আর Data কোথায় শুরু।",
    serves: "Header আর Data আলাদা করা",
  },
  {
    id: "rsv",
    name: "Reserved",
    bits: "৪ Bit",
    span: 1,
    value: "0",
    job: "ভবিষ্যতের জন্য ফাঁকা রাখা ঘর, সবসময় শূন্য। নতুন কিছু যোগ করতে হলে যাতে পুরো Header এর নকশা না বদলাতে হয়, তাই শুরু থেকেই কিছু জায়গা ছেড়ে রাখা হয়েছিল।",
    serves: "ভবিষ্যতের জায়গা",
  },
  {
    id: "flags",
    name: "Flags",
    bits: "৮ Bit",
    span: 2,
    value: "PSH, ACK",
    job: "আটটা এক Bit এর সুইচ, প্রতিটা একটা করে সংকেত। SYN মানে Connection শুরু করতে চাই। ACK মানে Acknowledgment ঘরটা কাজের। FIN মানে আমার বলা শেষ। RST মানে এই Connection এখনই ভেঙে দিতে হবে। PSH মানে জমিয়ে না রেখে এখনই Program কে দিতে হবে। URG প্রায় ব্যবহারই হয় না। ECE আর CWR ভিড়ের সংকেত দেওয়ার জন্য।",
    serves: "Connection খোলা, বন্ধ, ভাঙা",
  },
  {
    id: "win",
    name: "Window",
    bits: "১৬ Bit",
    span: 4,
    value: "2058",
    job: "আমার Receive Buffer এ এই মুহূর্তে আর কত জায়গা খালি। Sender এর বেশি পাঠাবে না। এটাই Flow Control এর পুরো যন্ত্র। ১৬ Bit এ সর্বোচ্চ 65535 ধরে, যা আজকের গতির জন্য খুব ছোট, তাই Handshake এর সময় একটা গুণক ঠিক করে নেওয়া হয়, যার নাম Window Scale।",
    serves: "Flow Control",
  },
  {
    id: "sum",
    name: "Checksum",
    bits: "১৬ Bit",
    span: 4,
    value: "0x8f2c",
    job: "পুরো Segment এর উপর করা একটা যোগফলের হিসাব। Sender হিসাব করে এখানে লিখে দেয়, Receiver আবার হিসাব করে মিলিয়ে দেখে। না মিললে পথে কোনো Bit উল্টে গেছে, আর Receiver চুপচাপ Segment টা ফেলে দেয়। ACK না পেয়ে Sender নিজেই আবার পাঠায়।",
    serves: "নষ্ট Data ধরা",
  },
  {
    id: "urg",
    name: "Urgent Pointer",
    bits: "১৬ Bit",
    span: 4,
    value: "0",
    job: "URG Flag চালু থাকলে জরুরি Data কোথায় শেষ তা দেখায়। পুরনো দিনের জিনিস, আধুনিক Program এ প্রায় কখনো ব্যবহার হয় না। জেনে রাখুন ঘরটা আছে, মনে রাখার দরকার নেই।",
    serves: "প্রায় অব্যবহৃত",
  },
  {
    id: "opt",
    name: "Options",
    bits: "০ থেকে ৪০ Byte",
    span: 8,
    value: "Timestamps, SACK",
    job: "বাড়তি সুবিধার ঘর। Handshake এর সময় এখানে থাকে MSS (একটা Segment এ সর্বোচ্চ কত Byte Data নেব), Window Scale আর SACK চলবে কি না। পরে এখানে থাকে Timestamps, যা দিয়ে Round Trip Time মাপা হয়, আর SACK ব্লক, যা দিয়ে Receiver বলে ফাঁকের পরে ঠিক কোন কোন অংশ সে পেয়ে গেছে।",
    serves: "MSS, Window Scale, SACK, সময় মাপা",
  },
  {
    id: "data",
    name: "Data",
    bits: "০ থেকে MSS Byte",
    span: 8,
    value: "517 Byte",
    job: "আসল মাল, আপনার Program যা লিখেছিল তার একটা টুকরো। HTTPS এ এটা TLS দিয়ে মোড়া, তাই পথের কেউ পড়তে পারে না। একটা Segment এ Data শূন্যও হতে পারে, যেমন শুধু ACK বহন করা Segment এ।",
    serves: "আপনার আসল তথ্য",
  },
];

export function TcpHeaderLab() {
  const [active, setActive] = useState("seq");
  const field = FIELDS.find((f) => f.id === active) ?? FIELDS[0];

  return (
    <Panel
      label="Interactive"
      title="TCP Header এর প্রতিটা ঘরে ক্লিক করুন"
      footer="উপরের ছকটা একটা TCP Header, ঠিক যে ক্রমে Byte গুলো তারের উপর দিয়ে যায়। প্রতিটা সারি ৩২ Bit, মানে ৪ Byte, আর ঘরের চওড়া তার Bit সংখ্যার অনুপাতে। Options ছাড়া প্রথম পাঁচ সারি মিলে ২০ Byte, এটাই সবচেয়ে ছোট TCP Header। প্রতিটা ঘরে ক্লিক করে দেখুন সেটা কী বহন করে, আমাদের বুকিংয়ের গল্পে তার মান কী, আর TCP এর কোন প্রতিশ্রুতি রাখতে সেটা লাগে। খেয়াল করুন, এই লেসনের বাকি সব ধারণা, ক্রম, প্রাপ্তি স্বীকার, Flow Control, সবই আসলে এই কয়েকটা ঘরের খেলা।"
    >
      <div className="grid grid-cols-8 gap-1 mb-6">
        {FIELDS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            data-field={f.id}
            style={{ gridColumn: `span ${f.span} / span ${f.span}` }}
            className={cn(
              "min-h-[52px] px-1 py-2 border text-center transition-colors",
              active === f.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            <span className="block font-mono text-[0.5625rem] sm:text-[0.625rem] font-bold leading-tight break-words">
              {f.span === 1 ? f.name.split(" ")[0] : f.name}
            </span>
            <span className="hidden sm:block font-mono text-[0.5rem] opacity-70 mt-0.5">
              {f.bits}
            </span>
          </button>
        ))}
      </div>

      <motion.div
        key={field.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="border border-border bg-background p-4"
        data-active={field.id}
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
          <span className="font-mono text-[0.8125rem] font-bold text-primary">{field.name}</span>
          <span className="font-mono text-[0.625rem] text-muted-foreground">{field.bits}</span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground mb-4">{field.job}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="border border-border px-3 py-2">
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              আমাদের গল্পে মান
            </div>
            <div className="font-mono text-[0.75rem] font-bold text-foreground">{field.value}</div>
          </div>
          <div className="border border-border px-3 py-2">
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              কোন কাজে লাগে
            </div>
            <div className="text-[0.75rem] font-bold text-foreground">{field.serves}</div>
          </div>
        </div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Sequence আর ACK, একটা Segment হারালে কী হয়                               */
/* ------------------------------------------------------------------------- */

type Ev = {
  /** right = ফোন থেকে Server, left = Server থেকে ফোন, lost = পথে হারাল */
  dir: "right" | "left" | "lost";
  text: string;
  note: string;
  /** এই ঘটনার পর Receiver এর পাঁচটা ঘরের অবস্থা: d = Program কে দেওয়া, h = Buffer এ আটকে, e = খালি */
  slots: string;
  dup?: number;
};

const CLEAN: Ev[] = [
  { dir: "right", text: "Seq 1, 1000 Byte", note: "Byte 1 থেকে 1000", slots: "deeee" },
  { dir: "left", text: "ACK 1001", note: "1000 পর্যন্ত পেয়েছি, এবার 1001 চাই", slots: "deeee" },
  { dir: "right", text: "Seq 1001, 1000 Byte", note: "Byte 1001 থেকে 2000", slots: "ddeee" },
  { dir: "left", text: "ACK 2001", note: "2000 পর্যন্ত পেয়েছি", slots: "ddeee" },
  { dir: "right", text: "Seq 2001, 1000 Byte", note: "Byte 2001 থেকে 3000", slots: "dddee" },
  { dir: "left", text: "ACK 3001", note: "3000 পর্যন্ত পেয়েছি", slots: "dddee" },
  { dir: "right", text: "Seq 3001, 1000 Byte", note: "Byte 3001 থেকে 4000", slots: "dddde" },
  { dir: "left", text: "ACK 4001", note: "4000 পর্যন্ত পেয়েছি", slots: "dddde" },
  { dir: "right", text: "Seq 4001, 1000 Byte", note: "Byte 4001 থেকে 5000", slots: "ddddd" },
  { dir: "left", text: "ACK 5001", note: "সব পেয়েছি, এবার 5001 চাই", slots: "ddddd" },
];

const LOSSY: Ev[] = [
  { dir: "right", text: "Seq 1, 1000 Byte", note: "Byte 1 থেকে 1000", slots: "deeee" },
  { dir: "left", text: "ACK 1001", note: "1000 পর্যন্ত পেয়েছি, এবার 1001 চাই", slots: "deeee" },
  { dir: "lost", text: "Seq 1001, 1000 Byte", note: "পথে একটা Router এটাকে ফেলে দিল", slots: "deeee" },
  { dir: "right", text: "Seq 2001, 1000 Byte", note: "পৌঁছাল, কিন্তু আগে একটা ফাঁক", slots: "dehee" },
  { dir: "left", text: "ACK 1001", note: "এখনো 1001 ই চাই। একই ACK আবার, প্রথম Duplicate", slots: "dehee", dup: 1 },
  { dir: "right", text: "Seq 3001, 1000 Byte", note: "এটাও পৌঁছাল, এটাও আটকে থাকবে", slots: "dehhe" },
  { dir: "left", text: "ACK 1001", note: "দ্বিতীয় Duplicate ACK", slots: "dehhe", dup: 2 },
  { dir: "right", text: "Seq 4001, 1000 Byte", note: "শেষ টুকরোও পৌঁছাল", slots: "dehhh" },
  { dir: "left", text: "ACK 1001", note: "তৃতীয় Duplicate ACK। Sender এবার নিশ্চিত, 1001 হারিয়েছে", slots: "dehhh", dup: 3 },
  { dir: "right", text: "Seq 1001, 1000 Byte, আবার", note: "Fast Retransmit, Timer এর অপেক্ষা না করেই", slots: "ddddd" },
  { dir: "left", text: "ACK 5001", note: "ফাঁক ভরেছে, এক লাফে সব স্বীকার", slots: "ddddd" },
];

const SLOT_LABEL = ["1 থেকে 1000", "1001 থেকে 2000", "2001 থেকে 3000", "3001 থেকে 4000", "4001 থেকে 5000"];

export function SeqAckLab() {
  const reduce = useReducedMotion();
  const [lossy, setLossy] = useState(false);
  const [step, setStep] = useState(0);

  const events = lossy ? LOSSY : CLEAN;
  const shown = events.slice(0, step);
  const last = shown[shown.length - 1];
  const slots = last ? last.slots : "eeeee";
  const done = step >= events.length;
  const delivered = slots.split("").filter((s) => s === "d").length;
  const held = slots.split("").filter((s) => s === "h").length;

  let message = "ফোন Server কে ৫০০০ Byte পাঠাবে, ১০০০ Byte করে পাঁচটা Segment এ। পরের ধাপ চেপে একটা একটা করে দেখুন।";
  if (last) {
    if (done) {
      message = lossy
        ? "পাঁচটা Segment এর একটা হারিয়েছিল, তবু Program পুরো ৫০০০ Byte পেল, ঠিক ক্রমে, একটা Byte ও বাদ না দিয়ে। Program টের ই পেল না মাঝে কী ঘটেছিল, শুধু একটু দেরি হলো। এটাই TCP।"
        : "পাঁচটা Segment, পাঁচটা ACK, কোনো গোলমাল নেই। প্রতিটা ACK এর সংখ্যা হলো পরের যে Byte টা Receiver চায় তার নম্বর। এবার উপরে একটা Segment হারানো চালু করে আবার দেখুন।";
    } else if (last.dir === "lost") {
      message = "এই Segment টা Server এ পৌঁছায়নি। Sender এখনো জানে না। Receiver ও জানে না, যতক্ষণ না পরের Segment এসে ফাঁকটা ধরিয়ে দেয়।";
    } else if (last.dup) {
      message = `Server এর Buffer এ ${toBn(held)}টা Segment আটকে আছে, কারণ তার আগের একটা নেই। সে Program কে দিতে পারছে না, তাই বারবার একই ACK পাঠিয়ে বলছে, আমি এখনো 1001 এর অপেক্ষায়। এটা ${toBn(last.dup)} নম্বর Duplicate ACK।`;
    } else {
      message = `এ পর্যন্ত Server এর Program এর হাতে পৌঁছেছে ${toBn(delivered * 1000)} Byte।`;
    }
  }

  return (
    <Panel
      label="Interactive"
      title="Sequence Number আর ACK, ধাপে ধাপে"
      footer="প্রথমে কোনো কিছু না হারিয়ে পুরোটা একবার চালান, আর শুধু সংখ্যাগুলো দেখুন। Seq হলো Segment এর প্রথম Byte এর নম্বর, আর ACK হলো Receiver এরপর যে Byte চায় তার নম্বর। তারপর একটা Segment হারানো চালু করে আবার চালান। এবার তিনটা জিনিস খেয়াল করুন। এক, Receiver পরের Segment গুলো ফেলে দেয় না, নিজের Buffer এ ধরে রাখে, কিন্তু Program কে দেয় না। দুই, সে নতুন কোনো সংখ্যা না বলে একই ACK বারবার পাঠায়। তিন, একই ACK তিনবার বাড়তি পেলেই Sender বুঝে নেয় কোনটা হারিয়েছে আর শুধু সেটাই আবার পাঠায়।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          পথের অবস্থা
        </span>
        <button
          onClick={() => {
            setLossy(false);
            setStep(0);
          }}
          data-mode="clean"
          className={cn(BTN, !lossy ? BTN_ON : BTN_OFF)}
        >
          সব ঠিকঠাক পৌঁছায়
        </button>
        <button
          onClick={() => {
            setLossy(true);
            setStep(0);
          }}
          data-mode="lossy"
          className={cn(BTN, lossy ? BTN_ON : BTN_OFF)}
        >
          দ্বিতীয় Segment হারায়
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setStep((s) => Math.min(events.length, s + 1))}
          disabled={done}
          data-action="next"
          className={cn(BTN, done ? "border-border text-muted-foreground/40" : "border-primary bg-primary/10 text-primary hover:bg-primary/20")}
        >
          পরের ধাপ
        </button>
        <button
          onClick={() => setStep(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[0.625rem] text-muted-foreground">
          ধাপ {toBn(step)} / {toBn(events.length)}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
        <span>ফোন (Sender)</span>
        <span />
        <span className="text-right">Server (Receiver)</span>
      </div>

      <div className="space-y-1.5 mb-6 min-h-[64px]">
        {shown.map((e, i) => (
          <div
            key={`${lossy}-${i}`}
            data-ev={e.dir}
            className={cn(
              "grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-3 gap-y-0.5 items-center border px-3 py-1.5",
              e.dir === "lost"
                ? "border-destructive/50 bg-destructive/5"
                : e.dir === "left"
                  ? "border-border bg-background"
                  : "border-primary/40 bg-primary/5",
            )}
          >
            <div
              className={cn(
                "font-mono text-[0.6875rem] font-bold",
                e.dir === "lost" ? "text-destructive" : e.dir === "left" ? "text-foreground sm:text-right" : "text-primary",
              )}
            >
              {e.dir === "right" ? "→ " : e.dir === "lost" ? "✕ " : "← "}
              {e.text}
            </div>
            <div className="text-[0.6875rem] text-muted-foreground">{e.note}</div>
          </div>
        ))}
      </div>

      <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">
        Server এর দিকে পাঁচটা টুকরোর অবস্থা
      </div>
      <div className="grid grid-cols-5 gap-1 mb-5">
        {slots.split("").map((s, i) => (
          <div
            key={i}
            data-slot={s}
            className={cn(
              "border px-1 py-2 text-center transition-colors",
              s === "d"
                ? "border-primary bg-primary/10"
                : s === "h"
                  ? "border-foreground/40 bg-muted/40"
                  : "border-dashed border-border",
            )}
          >
            <div className="font-mono text-[0.5rem] sm:text-[0.5625rem] text-muted-foreground leading-tight">
              {SLOT_LABEL[i]}
            </div>
            <div
              className={cn(
                "text-[0.625rem] font-bold mt-1",
                s === "d" ? "text-primary" : s === "h" ? "text-foreground" : "text-muted-foreground/60",
              )}
            >
              {s === "d" ? "Program পেয়েছে" : s === "h" ? "Buffer এ আটকে" : "আসেনি"}
            </div>
          </div>
        ))}
      </div>

      <motion.p
        key={`${lossy}-${step}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
        data-delivered={delivered}
      >
        {message}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Congestion Window, রাউন্ড ধরে ধরে                                       */
/* ------------------------------------------------------------------------- */

const MSS_BYTES = 1460;
const START_CWND = 10;
const START_SSTHRESH = 80;
const MAX_ROUNDS = 14;

type Round = { cwnd: number; ssthresh: number; phase: "slow" | "avoid"; event: "start" | "ok" | "dup" | "timeout" };

const FIRST: Round = { cwnd: START_CWND, ssthresh: START_SSTHRESH, phase: "slow", event: "start" };

function kb(segments: number): string {
  return toBn(Math.round((segments * MSS_BYTES) / 1024));
}

export function CongestionWindowLab() {
  const reduce = useReducedMotion();
  const [rounds, setRounds] = useState<Round[]>([FIRST]);

  const cur = rounds[rounds.length - 1];
  const full = rounds.length >= MAX_ROUNDS;
  const peak = Math.max(...rounds.map((r) => r.cwnd), START_SSTHRESH);
  const total = rounds.reduce((sum, r) => sum + r.cwnd, 0);

  function push(event: "ok" | "dup" | "timeout") {
    setRounds((list) => {
      const c = list[list.length - 1];
      if (list.length >= MAX_ROUNDS) return list;
      let next: Round;
      if (event === "ok") {
        if (c.cwnd < c.ssthresh) {
          const cwnd = Math.min(c.cwnd * 2, c.ssthresh);
          next = { cwnd, ssthresh: c.ssthresh, phase: cwnd < c.ssthresh ? "slow" : "avoid", event };
        } else {
          next = { cwnd: c.cwnd + 1, ssthresh: c.ssthresh, phase: "avoid", event };
        }
      } else if (event === "dup") {
        const half = Math.max(2, Math.floor(c.cwnd / 2));
        next = { cwnd: half, ssthresh: half, phase: "avoid", event };
      } else {
        const half = Math.max(2, Math.floor(c.cwnd / 2));
        next = { cwnd: 1, ssthresh: half, phase: "slow", event };
      }
      return [...list, next];
    });
  }

  let message = `শুরুতে Sender পথ সম্পর্কে কিছুই জানে না, তাই সাবধানে ${toBn(START_CWND)}টা Segment দিয়ে শুরু করে, যা প্রায় ${kb(START_CWND)} KB। সব ACK এলো চেপে দেখুন কী হয়।`;
  if (cur.event === "ok" && cur.phase === "slow") {
    message = `সব ACK এসেছে, তাই cwnd দ্বিগুণ হয়ে ${toBn(cur.cwnd)}। এই পর্বের নাম Slow Start। নামে Slow, কিন্তু বাড়ে প্রতি রাউন্ডে দ্বিগুণ হারে। Slow বলা হয় কারণ এটা একবারে পুরো গতিতে শুরু করে না।`;
  } else if (cur.event === "ok" && cur.phase === "avoid") {
    message = `cwnd এখন ${toBn(cur.cwnd)}, যা ssthresh এর সমান বা বেশি। Sender ধরে নেয় সে পথের সীমার কাছাকাছি চলে এসেছে, তাই আর দ্বিগুণ করে না, প্রতি রাউন্ডে মাত্র একটা Segment করে বাড়ায়। এই সাবধানী পর্বের নাম Congestion Avoidance।`;
  } else if (cur.event === "dup") {
    message = `তিনটা Duplicate ACK মানে একটা Segment হারিয়েছে, কিন্তু পরেরগুলো পৌঁছাচ্ছে, অর্থাৎ পথ পুরোপুরি বন্ধ নয়। Sender হারানোটা আবার পাঠায় আর cwnd অর্ধেক করে ${toBn(cur.cwnd)} এ নামায়। ssthresh ও এখন ${toBn(cur.ssthresh)}, তাই এখান থেকে আবার এক এক করে বাড়বে।`;
  } else if (cur.event === "timeout") {
    message = `Timeout মানে কোনো ACK ই ফেরেনি, পথ সম্ভবত গুরুতর ভিড়ে। Sender ধরে নেয় সে পথ সম্পর্কে আর কিছুই জানে না, তাই cwnd একদম ১ এ নামিয়ে নতুন করে Slow Start শুরু করে। ssthresh এখন ${toBn(cur.ssthresh)}, সেখানে পৌঁছে আবার সাবধানী হবে।`;
  }

  return (
    <Panel
      label="Interactive"
      title="Sender কীভাবে পথের ধারণক্ষমতা খুঁজে বের করে"
      footer="প্রতিটা দণ্ড একটা রাউন্ড, মানে মোটামুটি একটা Round Trip। দণ্ডের উচ্চতা হলো সেই রাউন্ডে Sender একসাথে কয়টা Segment পাঠাতে সাহস করছে, অর্থাৎ cwnd। প্রথমে শুধু সব ACK এলো চাপতে থাকুন আর দেখুন বৃদ্ধির ধরন কোথায় বদলায়। তারপর মাঝে একবার তিনটা Duplicate ACK চাপুন, আর আরেকবার Timeout, আর দুইটার তফাত দেখুন। সাজাটা আলাদা কারণ খবরটা আলাদা। Duplicate ACK বলে একটা হারিয়েছে কিন্তু বাকিরা যাচ্ছে। Timeout বলে কিছুই ফিরছে না। পুরো Internet এ কোটি কোটি Connection এই একই নিয়ম মেনে চলে বলেই কেউ একা পুরো রাস্তা দখল করে না।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => push("ok")}
          disabled={full}
          data-action="ok"
          className={cn(BTN, full ? "border-border text-muted-foreground/40" : "border-primary bg-primary/10 text-primary hover:bg-primary/20")}
        >
          সব ACK এলো
        </button>
        <button
          onClick={() => push("dup")}
          disabled={full}
          data-action="dup"
          className={cn(BTN, full ? "border-border text-muted-foreground/40" : BTN_OFF)}
        >
          ৩টা Duplicate ACK
        </button>
        <button
          onClick={() => push("timeout")}
          disabled={full}
          data-action="timeout"
          className={cn(BTN, full ? "border-border text-muted-foreground/40" : BTN_OFF)}
        >
          Timeout
        </button>
        <button
          onClick={() => setRounds([FIRST])}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-end gap-1 h-40 border-b border-l border-border px-1 mb-2">
        {rounds.map((r, i) => (
          <div key={i} className="flex-1 min-w-0 flex flex-col items-center justify-end h-full" data-cwnd={r.cwnd}>
            <span className="font-mono text-[0.5rem] sm:text-[0.5625rem] text-muted-foreground mb-0.5">{toBn(r.cwnd)}</span>
            <div
              className={cn(
                "w-full transition-all duration-300",
                r.event === "dup" || r.event === "timeout"
                  ? "bg-destructive/60"
                  : r.phase === "slow"
                    ? "bg-primary"
                    : "bg-primary/45",
              )}
              style={{ height: `${Math.max(2, (r.cwnd / peak) * 82)}%` }}
            />
          </div>
        ))}
        {Array.from({ length: MAX_ROUNDS - rounds.length }).map((_, i) => (
          <div key={`e-${i}`} className="flex-1 min-w-0" />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5 font-mono text-[0.5625rem] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 bg-primary" /> Slow Start
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 bg-primary/45" /> Congestion Avoidance
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 bg-destructive/60" /> Packet হারানোর পরের রাউন্ড
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {[
          { k: "রাউন্ড", v: toBn(rounds.length) },
          { k: "cwnd", v: `${toBn(cur.cwnd)} Segment` },
          { k: "ssthresh", v: `${toBn(cur.ssthresh)} Segment` },
          { k: "এ পর্যন্ত পাঠানো", v: `${kb(total)} KB` },
        ].map((c) => (
          <div key={c.k} className="border border-border px-3 py-2">
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">{c.k}</div>
            <div className="font-mono text-[0.75rem] font-bold text-foreground">{c.v}</div>
          </div>
        ))}
      </div>

      <motion.p
        key={rounds.length}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
        data-rounds={rounds.length}
      >
        {full ? "ছকে আর জায়গা নেই। Reset চেপে অন্য একটা ক্রমে আবার চালিয়ে দেখুন।" : message}
      </motion.p>
    </Panel>
  );
}
