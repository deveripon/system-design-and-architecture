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
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
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
} & Record<`data-${string}`, string | number>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={cn(
        "px-3 py-1.5 border text-[11px] font-bold transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mr-1">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Encapsulation: এক Layer নামলে এক মোড়ক বাড়ে                               */
/* ------------------------------------------------------------------------- */

const ETH_HEADER = 14;
const IP_HEADER = 20;
const TCP_HEADER = 20;
const FCS = 4;

const DATA_SIZES = [
  { label: "৩২ Byte, ছোট একটা বার্তা", value: 32 },
  { label: "৫০০ Byte, মাঝারি", value: 500 },
  { label: "১৪৬০ Byte, ভরা Segment", value: 1460 },
];

/** depth = কয়টা মোড়ক এই মুহূর্তে Data র গায়ে আছে। 4 মানে তারে Bits। */
const DEPTHS = [
  {
    layer: "Application Layer",
    unit: "Data",
    send: "আপনার Browser একটা বার্তা বানাল। এখনো এর গায়ে কোনো ঠিকানা নেই, এটা শুধু কথাটুকু।",
    receive:
      "শেষ মোড়কটাও খোলা হলো। Server এর Program এখন হাতে পেল ঠিক সেই Byte গুলো, যা Browser লিখেছিল। মাঝের কোনো Header সে কখনো দেখেই না।",
  },
  {
    layer: "Transport Layer",
    unit: "Segment",
    send: "Kernel এর TCP অংশ সামনে ২০ Byte এর TCP Header জুড়ল। এতে লেখা কোন Port থেকে কোন Port, আর এই টুকরোর Sequence Number কত। Data এখন Segment।",
    receive:
      "IP Header খুলে ফেলার পর যা রইল সেটা Segment। TCP এবার Destination Port দেখে ঠিক করবে কোন Program এর Socket এ Data তুলে দিতে হবে।",
  },
  {
    layer: "Internet Layer",
    unit: "Packet",
    send: "Kernel এর IP অংশ Segment এর সামনে ২০ Byte এর IP Header জুড়ল। এতে লেখা কোন IP থেকে কোন IP, আর TTL কত। Segment এখন Packet এর ভেতরের মাল।",
    receive:
      "Ethernet Header আর FCS খুলে ফেলার পর যা রইল সেটা Packet। IP এবার দেখবে Destination IP টা নিজের কি না, আর Protocol ঘরে ৬ লেখা দেখে TCP কে ডাকবে।",
  },
  {
    layer: "Link Layer",
    unit: "Frame",
    send: "Network Card Packet এর সামনে ১৪ Byte এর Ethernet Header আর পেছনে ৪ Byte এর FCS জুড়ল। Header এ লেখা পরের যন্ত্রের MAC। Packet এখন Frame এর ভেতরের মাল।",
    receive:
      "Network Card Bits গুলোকে জোড়া দিয়ে একটা Frame বানাল। আগে FCS মিলিয়ে দেখল পথে কিছু নষ্ট হয়েছে কি না, তারপর Destination MAC টা নিজের কি না।",
  },
  {
    layer: "Physical",
    unit: "Bits",
    send: "Frame টা এবার তারে বিদ্যুতের স্পন্দন, Fiber এ আলো, বা বাতাসে Radio তরঙ্গ হয়ে বেরিয়ে গেল। এখানে আর কোনো Header যোগ হয় না, শুধু ১ আর ০।",
    receive:
      "তার, Fiber বা বাতাস থেকে ১ আর ০ এসে পৌঁছাল। এই অবস্থায় এটা শুধু সংকেত, কোনো যন্ত্র এখনো জানে না এর ভেতরে কী আছে।",
  },
];

export function EncapsulationLab() {
  const reduce = useReducedMotion();
  const [size, setSize] = useState(1460);
  const [sending, setSending] = useState(true);
  const [step, setStep] = useState(0);

  const depth = sending ? step : 4 - step;
  const info = DEPTHS[depth];
  const wrapped = Math.min(depth, 3);
  const total =
    size +
    (wrapped >= 1 ? TCP_HEADER : 0) +
    (wrapped >= 2 ? IP_HEADER : 0) +
    (wrapped >= 3 ? ETH_HEADER + FCS : 0);
  const overhead = total - size;
  const percent = Math.round((overhead / total) * 1000) / 10;
  const last = step === 4;

  const blocks = [
    { id: "eth", text: "Ethernet Header", bytes: ETH_HEADER, on: wrapped >= 3 },
    { id: "ip", text: "IP Header", bytes: IP_HEADER, on: wrapped >= 2 },
    { id: "tcp", text: "TCP Header", bytes: TCP_HEADER, on: wrapped >= 1 },
    { id: "data", text: "Data", bytes: size, on: true },
    { id: "fcs", text: "FCS", bytes: FCS, on: wrapped >= 3 },
  ];

  return (
    <Panel
      label="Interactive"
      title="একটা বার্তা Layer ধরে নামে, আবার ওঠে"
      footer="উপরে Data র মাপ আর দিক বেছে নিন, তারপর এক ধাপ করে এগোন। পাঠানোর দিকে প্রতিটা Layer নিজের একটা Header সামনে জুড়ে দেয়, আর জিনিসটার নাম বদলে যায়। পাওয়ার দিকে ঠিক উল্টো, প্রতিটা Layer নিজের Header টা খুলে ফেলে আর বাকিটা উপরে তুলে দেয়। দুইটা জিনিস খেয়াল করুন। এক, Data র Byte সংখ্যা কোনো ধাপেই বদলায় না, শুধু মোড়ক বাড়ে বা কমে। দুই, ছোট বার্তায় মোড়কের ভাগ অনেক বড়, ৩২ Byte পাঠাতে ৫৮ Byte মোড়ক লাগে।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Label>Data র মাপ</Label>
        {DATA_SIZES.map((d) => (
          <Choice
            key={d.value}
            active={size === d.value}
            data-size={d.value}
            onClick={() => setSize(d.value)}
          >
            {d.label}
          </Choice>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Label>দিক</Label>
        <Choice
          active={sending}
          data-direction="send"
          onClick={() => {
            setSending(true);
            setStep(0);
          }}
        >
          পাঠানো, উপর থেকে নিচে
        </Choice>
        <Choice
          active={!sending}
          data-direction="receive"
          onClick={() => {
            setSending(false);
            setStep(0);
          }}
        >
          পাওয়া, নিচ থেকে উপরে
        </Choice>
      </div>

      <div className="flex flex-wrap items-stretch gap-1 mb-5">
        {blocks.map((b) => (
          <div
            key={b.id}
            data-block={b.id}
            data-on={b.on ? "yes" : "no"}
            className={cn(
              "border px-3 py-3 text-center transition-all duration-300",
              b.id === "data" ? "flex-1 min-w-[120px]" : "min-w-[92px]",
              b.on
                ? b.id === "data"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-foreground/40 bg-foreground/5 text-foreground"
                : "border-dashed border-border text-muted-foreground/40",
            )}
          >
            <div className="font-mono text-[10px] font-bold">{b.text}</div>
            <div className="font-mono text-[10px] mt-1">{b.on ? `${b.bytes} Byte` : "নেই"}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
        <div className="border border-border px-3 py-2">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            এই মুহূর্তে নাম
          </div>
          <div className="text-sm font-bold text-primary" data-unit={info.unit}>
            {info.unit}
          </div>
          <div className="text-[11px] text-muted-foreground">{info.layer}</div>
        </div>
        <div className="border border-border px-3 py-2">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            মোট মাপ
          </div>
          <div className="text-sm font-bold text-foreground" data-total={total}>
            {depth === 4 ? `${toBn(total * 8)} Bit` : `${toBn(total)} Byte`}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {depth === 4 ? `${toBn(total)} Byte গুণ ৮` : `Data ${toBn(size)} Byte`}
          </div>
        </div>
        <div className="border border-border px-3 py-2">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            মোড়কের ভাগ
          </div>
          <div className="text-sm font-bold text-foreground" data-overhead={overhead}>
            {toBn(overhead)} Byte
          </div>
          <div className="text-[11px] text-muted-foreground">মোটের {toBn(percent)} শতাংশ</div>
        </div>
      </div>

      <motion.p
        key={`${sending}-${step}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground mb-5"
      >
        {sending ? info.send : info.receive}
      </motion.p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStep((s) => Math.min(4, s + 1))}
          disabled={last}
          data-action="next"
          className={cn(
            "px-3 py-1.5 border text-[11px] font-bold transition-colors",
            last
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          {sending ? "এক Layer নিচে নামুন" : "এক Layer উপরে উঠুন"}
        </button>
        <button
          onClick={() => setStep(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[10px] text-muted-foreground">
          ধাপ {toBn(step + 1)} / ৫
        </span>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Hop ধরে ধরে: কোন ঘর বদলায়, কোনটা বদলায় না                               */
/* ------------------------------------------------------------------------- */

type Fields = {
  srcMac: string;
  dstMac: string;
  srcIp: string;
  dstIp: string;
  ttl: string;
  srcPort: string;
  dstPort: string;
  seq: string;
  data: string;
};

const LINKS: { id: string; name: string; note: string; fields: Fields }[] = [
  {
    id: "lan",
    name: "ফোন থেকে বাসার Router",
    note: "যাত্রার প্রথম তার। Frame এ ফোনের MAC থেকে Router এর MAC, কারণ ফোন জানে বাইরের সব কিছু Gateway এর হাতে দিতে হয়। Packet এ কিন্তু Destination IP হলো দূরের Server, Router নয়।",
    fields: {
      srcMac: "a4:83:e7:12:9c:01",
      dstMac: "c8:3a:35:4b:10:fe",
      srcIp: "192.168.1.20",
      dstIp: "103.94.135.2",
      ttl: "64",
      srcPort: "51514",
      dstPort: "443",
      seq: "1000",
      data: "৩২ Byte, যেমন ছিল",
    },
  },
  {
    id: "wan",
    name: "বাসার Router থেকে ISP র Router",
    note: "এখানে সবচেয়ে বেশি বদল। Router পুরনো Frame ফেলে দিয়ে নতুন Frame বানিয়েছে, তাই দুইটা MAC ই নতুন। TTL এক কমেছে। আর এটা বাসার Router বলে NAT ও হয়েছে, তাই Source IP আর Source Port বদলে গেছে। এই দুইটা বদল সাধারণ Router করে না, শুধু NAT করা Router করে।",
    fields: {
      srcMac: "c8:3a:35:4b:10:ff",
      dstMac: "00:1b:21:aa:07:10",
      srcIp: "203.0.113.25",
      dstIp: "103.94.135.2",
      ttl: "63",
      srcPort: "62001",
      dstPort: "443",
      seq: "1000",
      data: "৩২ Byte, যেমন ছিল",
    },
  },
  {
    id: "core",
    name: "Internet এর মাঝের একটা Router থেকে পরেরটায়",
    note: "মাঝের প্রতিটা Router একই কাজ করে। পুরনো Frame খোলে, Packet এর Destination IP দেখে পথ ঠিক করে, TTL এক কমায়, নতুন Frame এ মুড়ে পরের Router এর দিকে ছাড়ে। IP বা Port এ হাত দেয় না। এখানে দেখানো হয়েছে ছয়টা Router পেরোনোর পরের অবস্থা।",
    fields: {
      srcMac: "00:25:90:6c:44:1a",
      dstMac: "f4:cc:55:09:be:72",
      srcIp: "203.0.113.25",
      dstIp: "103.94.135.2",
      ttl: "57",
      srcPort: "62001",
      dstPort: "443",
      seq: "1000",
      data: "৩২ Byte, যেমন ছিল",
    },
  },
  {
    id: "last",
    name: "শেষ Router থেকে Island Tours এর Server",
    note: "শেষ তার। এই প্রথম Frame এর Destination MAC হলো Server এর নিজের MAC, কারণ শেষ Router আর Server একই Network এ আছে, আর Router ARP করে Server এর MAC জেনেছে। Server Frame খুলবে, Packet খুলবে, তারপর এই প্রথম কেউ Segment টা খুলবে।",
    fields: {
      srcMac: "dc:38:e1:55:20:0a",
      dstMac: "52:54:00:9a:3c:7e",
      srcIp: "203.0.113.25",
      dstIp: "103.94.135.2",
      ttl: "52",
      srcPort: "62001",
      dstPort: "443",
      seq: "1000",
      data: "৩২ Byte, যেমন ছিল",
    },
  },
];

const ROWS: { key: keyof Fields; unit: string; label: string }[] = [
  { key: "srcMac", unit: "Frame", label: "Source MAC" },
  { key: "dstMac", unit: "Frame", label: "Destination MAC" },
  { key: "srcIp", unit: "Packet", label: "Source IP" },
  { key: "dstIp", unit: "Packet", label: "Destination IP" },
  { key: "ttl", unit: "Packet", label: "TTL" },
  { key: "srcPort", unit: "Segment", label: "Source Port" },
  { key: "dstPort", unit: "Segment", label: "Destination Port" },
  { key: "seq", unit: "Segment", label: "Sequence Number" },
  { key: "data", unit: "Data", label: "আসল Data" },
];

export function HopRewriteLab() {
  const reduce = useReducedMotion();
  const [at, setAt] = useState(0);
  const link = LINKS[at];
  const prev = at > 0 ? LINKS[at - 1] : null;
  const changed = ROWS.filter((r) => prev && prev.fields[r.key] !== link.fields[r.key]).length;

  return (
    <Panel
      label="Interactive"
      title="একই বার্তা, চারটা তারে চার রকম চেহারা"
      footer="চারটা বোতাম পথের চারটা তার। একটা থেকে পরেরটায় গেলে যে ঘরগুলো বদলেছে সেগুলো রঙিন হয়ে যায়। পুরো পথ ঘুরে দেখলে তিনটা নিয়ম নিজেই বেরিয়ে আসবে। Frame এর দুইটা MAC প্রতিটা তারে নতুন। Packet এর Destination IP কখনো বদলায় না, TTL প্রতি Router এ এক কমে, আর Source IP বদলায় শুধু একবার, NAT এর জায়গায়। Segment এর Sequence Number আর আসল Data শুরু থেকে শেষ পর্যন্ত অক্ষত।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {LINKS.map((l, i) => (
          <Choice key={l.id} active={at === i} data-link={l.id} onClick={() => setAt(i)}>
            তার {toBn(i + 1)}: {l.name}
          </Choice>
        ))}
      </div>

      <div className="space-y-1.5 mb-5">
        {ROWS.map((r) => {
          const isChanged = !!prev && prev.fields[r.key] !== link.fields[r.key];
          return (
            <div
              key={r.key}
              data-field={r.key}
              data-changed={isChanged ? "yes" : "no"}
              className={cn(
                "grid grid-cols-[70px_1fr] sm:grid-cols-[80px_170px_1fr_90px] gap-x-3 gap-y-0.5 items-center border px-3 py-2 transition-colors",
                isChanged ? "border-primary/60 bg-primary/5" : "border-border bg-background",
              )}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                {r.unit}
              </span>
              <span className="text-[12px] font-bold text-foreground">{r.label}</span>
              <span
                className={cn(
                  "col-span-2 sm:col-span-1 font-mono text-[12px]",
                  isChanged ? "text-primary font-bold" : "text-muted-foreground",
                )}
              >
                {link.fields[r.key]}
              </span>
              <span
                className={cn(
                  "hidden sm:block font-mono text-[9px] uppercase tracking-[0.12em] text-right",
                  isChanged ? "text-primary" : "text-muted-foreground/50",
                )}
              >
                {!prev ? "শুরু" : isChanged ? "বদলেছে" : "একই"}
              </span>
            </div>
          );
        })}
      </div>

      <motion.p
        key={link.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
        data-changed-count={changed}
      >
        {prev ? `আগের তার থেকে ${toBn(changed)}টা ঘর বদলেছে। ` : ""}
        {link.note}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Fragmentation: বড় Packet, ছোট রাস্তা                                    */
/* ------------------------------------------------------------------------- */

const PAYLOADS = [
  { label: "১২০০ Byte", value: 1200 },
  { label: "৩০০৮ Byte", value: 3008 },
  { label: "৬০০০ Byte", value: 6000 },
];

const MTUS = [
  { label: "১৫০০, সাধারণ Ethernet", value: 1500 },
  { label: "১৪৯২, PPPoE", value: 1492 },
  { label: "১৪০০, একটা VPN", value: 1400 },
];

export function FragmentLab() {
  const reduce = useReducedMotion();
  const [payload, setPayload] = useState(3008);
  const [mtu, setMtu] = useState(1500);
  const [df, setDf] = useState(false);

  const total = payload + IP_HEADER;
  const fits = total <= mtu;
  // Fragment এর Data ৮ এর গুণিতক হতে হয়, কারণ Offset ঘরটা ৮ Byte এর এককে গোনে।
  const per = Math.floor((mtu - IP_HEADER) / 8) * 8;
  const count = fits ? 1 : Math.ceil(payload / per);
  const fragments = Array.from({ length: count }, (_, i) => {
    const data = fits ? payload : Math.min(per, payload - i * per);
    return { index: i, offset: i * per, data, total: data + IP_HEADER, more: i < count - 1 };
  });
  const dropped = !fits && df;
  const extra = (count - 1) * IP_HEADER;

  let verdict: string;
  if (fits) {
    verdict = `মোট ${toBn(total)} Byte, MTU ${toBn(mtu)} এর ভেতরেই। Packet টা যেমন আছে তেমনই যায়, ভাঙার দরকার নেই। DF চালু থাক বা বন্ধ, কোনো তফাত নেই।`;
  } else if (dropped) {
    verdict = `মোট ${toBn(total)} Byte, কিন্তু রাস্তায় ধরে ${toBn(mtu)}। DF চালু বলে Router এটা ভাঙতে পারবে না, তাই ফেলে দেবে আর পাঠানো যন্ত্রকে একটা ICMP বার্তা ফেরত দেবে, যাতে লেখা থাকবে frag needed and DF set, আর সাথে MTU ${toBn(mtu)}। পাঠানো যন্ত্র তখন ছোট করে আবার পাঠাবে। এটাই Path MTU Discovery।`;
  } else {
    verdict = `মোট ${toBn(total)} Byte, রাস্তায় ধরে ${toBn(mtu)}, DF বন্ধ। তাই Packet টা ${toBn(count)} টুকরো হলো। প্রতিটা টুকরো নিজে একটা পুরো Packet, নিজের ২০ Byte এর IP Header সহ, তাই বাড়তি ${toBn(extra)} Byte Header খরচ হলো। এর যেকোনো একটা হারালে গন্তব্য বাকিগুলোও ফেলে দেবে।`;
  }

  return (
    <Panel
      label="Interactive"
      title="Packet বড়, রাস্তা সরু, তখন কী হয়"
      footer="Packet এর ভেতরের মালের মাপ, রাস্তার MTU আর DF bit বদলে দেখুন। তিন রকম ফল পাবেন। Packet রাস্তায় ধরলে কিছুই হয় না। না ধরলে আর DF বন্ধ থাকলে Router সেটাকে কয়েক টুকরো করে, আর প্রতিটা টুকরোর Offset বলে দেয় সে মূল Packet এর কোন জায়গার। না ধরলে আর DF চালু থাকলে Router Packet ফেলে দিয়ে খবর পাঠায়। আজকের TCP প্রায় সবসময় DF চালু রেখে পাঠায়, তাই তৃতীয় ফলটাই আপনি বাস্তবে সবচেয়ে বেশি দেখবেন।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Label>Packet এর ভেতরের মাল</Label>
        {PAYLOADS.map((p) => (
          <Choice
            key={p.value}
            active={payload === p.value}
            data-payload={p.value}
            onClick={() => setPayload(p.value)}
          >
            {p.label}
          </Choice>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Label>রাস্তার MTU</Label>
        {MTUS.map((m) => (
          <Choice key={m.value} active={mtu === m.value} data-mtu={m.value} onClick={() => setMtu(m.value)}>
            {m.label}
          </Choice>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Label>DF bit</Label>
        <Choice active={!df} data-df="off" onClick={() => setDf(false)}>
          বন্ধ, ভাঙা যাবে
        </Choice>
        <Choice active={df} data-df="on" onClick={() => setDf(true)}>
          চালু, ভাঙা নিষেধ
        </Choice>
      </div>

      <div className="space-y-1.5 mb-5" data-fragments={dropped ? 0 : count}>
        {dropped ? (
          <div className="border border-destructive/60 bg-destructive/5 px-3 py-3">
            <div className="text-[12px] font-bold text-destructive">Router Packet টা ফেলে দিল</div>
            <div className="font-mono text-[11px] text-muted-foreground mt-1">
              ICMP: frag needed and DF set (MTU {mtu})
            </div>
          </div>
        ) : (
          fragments.map((f) => (
            <div
              key={f.index}
              className="grid grid-cols-2 sm:grid-cols-[110px_1fr_1fr_1fr] gap-x-3 gap-y-0.5 items-center border border-border bg-background px-3 py-2"
            >
              <span className="text-[12px] font-bold text-foreground">
                {fits ? "একটাই Packet" : `টুকরো ${toBn(f.index + 1)}`}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Header 20 + Data {f.data} = {f.total}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">Offset {f.offset}</span>
              <span
                className={cn(
                  "font-mono text-[11px]",
                  f.more ? "text-primary font-bold" : "text-muted-foreground",
                )}
              >
                {fits ? "MF 0" : f.more ? "MF 1, আরও আছে" : "MF 0, এটাই শেষ"}
              </span>
            </div>
          ))
        )}
      </div>

      <motion.p
        key={`${payload}-${mtu}-${df}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
      >
        {verdict}
      </motion.p>
    </Panel>
  );
}
