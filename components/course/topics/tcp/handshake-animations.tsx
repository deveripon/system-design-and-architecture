"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
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
} & Record<`data-${string}`, string | number>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={cn(
        "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left",
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
/* 1. Handshake, এক ধাপ এক ধাপ করে                                            */
/* ------------------------------------------------------------------------- */

type Known = { label: string; client: boolean; server: boolean };

const STEPS: {
  title: string;
  packet: { dir: "right" | "left"; flag: string; fields: string[] } | null;
  clientState: string;
  serverState: string;
  known: Known[];
  text: string;
}[] = [
  {
    title: "শুরুর আগে",
    packet: null,
    clientState: "CLOSED",
    serverState: "LISTEN",
    known: [
      { label: "নিজের শুরুর সংখ্যা (ISN)", client: false, server: false },
      { label: "অপর পক্ষের শুরুর সংখ্যা", client: false, server: false },
      { label: "আমার কথা ওপাশে পৌঁছায়", client: false, server: false },
      { label: "ওপাশের কথা আমার কাছে পৌঁছায়", client: false, server: false },
    ],
    text: "Server আগে থেকেই Port 443 এ LISTEN এ বসে আছে, মানে তার Kernel জানে এই Port এ কেউ SYN পাঠালে উত্তর দিতে হবে। ফোনের দিকে এখনো কিছুই নেই। দুই পক্ষই একে অপরের সম্পর্কে পুরোপুরি অন্ধকারে। নিচের চারটা প্রশ্নের একটারও উত্তর কারো জানা নেই, আর এই চারটা প্রশ্নের উত্তর জোগাড় করাই Handshake এর পুরো কাজ।",
  },
  {
    title: "ধাপ ১, SYN",
    packet: { dir: "right", flag: "SYN", fields: ["seq = 1000", "ack নেই", "options: mss 1460, wscale, sackOK"] },
    clientState: "SYN_SENT",
    serverState: "SYN_RCVD",
    known: [
      { label: "নিজের শুরুর সংখ্যা (ISN)", client: true, server: true },
      { label: "অপর পক্ষের শুরুর সংখ্যা", client: false, server: true },
      { label: "আমার কথা ওপাশে পৌঁছায়", client: false, server: false },
      { label: "ওপাশের কথা আমার কাছে পৌঁছায়", client: false, server: true },
    ],
    text: "ফোনের Kernel একটা শুরুর সংখ্যা বেছে নিল, ১০০০, আর SYN পাঠাল। SYN টা Server এ পৌঁছাতেই Server দুইটা জিনিস জেনে গেল, ফোনের শুরুর সংখ্যা কত, আর ফোন থেকে Server এর দিকে রাস্তাটা খোলা। Server নিজের জন্যও একটা সংখ্যা বেছে নিল, ৫০০০। কিন্তু ফোন এখনো কিছুই জানে না, তার SYN পৌঁছেছে কি না সেটাও না।",
  },
  {
    title: "ধাপ ২, SYN-ACK",
    packet: { dir: "left", flag: "SYN-ACK", fields: ["seq = 5000", "ack = 1001", "options: mss 1460, wscale, sackOK"] },
    clientState: "ESTABLISHED",
    serverState: "SYN_RCVD",
    known: [
      { label: "নিজের শুরুর সংখ্যা (ISN)", client: true, server: true },
      { label: "অপর পক্ষের শুরুর সংখ্যা", client: true, server: true },
      { label: "আমার কথা ওপাশে পৌঁছায়", client: true, server: false },
      { label: "ওপাশের কথা আমার কাছে পৌঁছায়", client: true, server: true },
    ],
    text: "Server এক বার্তায় দুই কাজ সারল। ack = 1001 বলে জানাল আপনার ১০০০ পেয়েছি, এরপর ১০০১ চাই। আর seq = 5000 বলে নিজের শুরুর সংখ্যা জানাল। এটা পেয়েই ফোনের চারটা প্রশ্নের চারটারই উত্তর মিলে গেল, তাই ফোনের দিকে Connection এখনই ESTABLISHED। কিন্তু Server এর একটা ঘর এখনো ফাঁকা। Server জানে না তার নিজের কথা ফোন পর্যন্ত পৌঁছায় কি না।",
  },
  {
    title: "ধাপ ৩, ACK",
    packet: { dir: "right", flag: "ACK", fields: ["seq = 1001", "ack = 5001", "এর সাথেই Data যেতে পারে"] },
    clientState: "ESTABLISHED",
    serverState: "ESTABLISHED",
    known: [
      { label: "নিজের শুরুর সংখ্যা (ISN)", client: true, server: true },
      { label: "অপর পক্ষের শুরুর সংখ্যা", client: true, server: true },
      { label: "আমার কথা ওপাশে পৌঁছায়", client: true, server: true },
      { label: "ওপাশের কথা আমার কাছে পৌঁছায়", client: true, server: true },
    ],
    text: "ফোন ack = 5001 পাঠাল, মানে আপনার ৫০০০ পেয়েছি। এটা পেয়ে Server এর শেষ ফাঁকা ঘরটাও ভরল। এখন আটটা ঘরের আটটাই ভরা, আর দুই পক্ষই ESTABLISHED। লক্ষ করুন, তৃতীয় বার্তাটা না থাকলে Server এর একটা ঘর চিরকাল ফাঁকা থাকত। ঠিক এই কারণেই ধাপ তিনটা, দুইটা নয়। আর চারটাও লাগে না, কারণ Server তার ACK আর SYN এক বার্তায় জুড়ে দিয়েছে।",
  },
];

export function HandshakeStepLab() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const filled = s.known.reduce((n, k) => n + (k.client ? 1 : 0) + (k.server ? 1 : 0), 0);

  return (
    <Panel
      label="Interactive"
      title="তিন ধাপে কে কী জানল"
      footer="এক ধাপ করে এগোন আর প্রতিবার নিচের ছকটা দেখুন। চারটা প্রশ্ন, দুই পক্ষ, মোট আটটা ঘর। Handshake এর প্রতিটা বার্তা কয়েকটা করে ঘর ভরে। তৃতীয় বার্তার আগে পর্যন্ত Server এর একটা ঘর ফাঁকা থাকে, সেটা কোনটা খুঁজে বের করুন। ওই একটা ঘরই হলো কেন তিন ধাপ, এই প্রশ্নের পুরো উত্তর।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setStep((v) => Math.max(0, v - 1))}
          disabled={step === 0}
          data-action="prev"
          className={cn(
            "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            step === 0
              ? "border-border text-muted-foreground/40"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
          )}
        >
          আগের ধাপ
        </button>
        <button
          onClick={() => setStep((v) => Math.min(STEPS.length - 1, v + 1))}
          disabled={step === STEPS.length - 1}
          data-action="next"
          className={cn(
            "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            step === STEPS.length - 1
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
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
        <span className="font-mono text-[0.625rem] text-muted-foreground" data-step={step}>
          {s.title}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] gap-3 mb-6 items-stretch">
        <div className="border border-border bg-background px-3 py-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
            ফোন, 192.168.1.20:51514
          </div>
          <div
            data-client-state={s.clientState}
            className={cn(
              "mt-2 font-mono text-[0.8125rem] font-bold transition-colors",
              s.clientState === "ESTABLISHED" ? "text-primary" : "text-foreground",
            )}
          >
            {s.clientState}
          </div>
        </div>

        <div
          className={cn(
            "border px-3 py-3 transition-colors",
            s.packet ? "border-primary/60 bg-primary/5" : "border-dashed border-border bg-background",
          )}
        >
          {s.packet ? (
            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, x: s.packet.dir === "right" ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="flex items-center gap-2 text-primary">
                {s.packet.dir === "left" && <ArrowLeft className="w-4 h-4" />}
                <span className="font-mono text-[0.8125rem] font-bold">{s.packet.flag}</span>
                {s.packet.dir === "right" && <ArrowRight className="w-4 h-4" />}
              </div>
              <ul className="mt-2 space-y-0.5">
                {s.packet.fields.map((f) => (
                  <li key={f} className="font-mono text-[0.625rem] text-muted-foreground">
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <div className="font-mono text-[0.625rem] text-muted-foreground">
              তারে এখনো কিছু নেই
            </div>
          )}
        </div>

        <div className="border border-border bg-background px-3 py-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
            Server, 103.94.135.2:443
          </div>
          <div
            data-server-state={s.serverState}
            className={cn(
              "mt-2 font-mono text-[0.8125rem] font-bold transition-colors",
              s.serverState === "ESTABLISHED" ? "text-primary" : "text-foreground",
            )}
          >
            {s.serverState}
          </div>
        </div>
      </div>

      <div className="border border-border mb-5">
        <div className="grid grid-cols-[1fr_64px_64px] gap-x-2 px-3 py-2 border-b border-border bg-muted/30 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
          <span>কে কী জানে</span>
          <span className="text-center">ফোন</span>
          <span className="text-center">Server</span>
        </div>
        {s.known.map((k) => (
          <div
            key={k.label}
            className="grid grid-cols-[1fr_64px_64px] gap-x-2 px-3 py-2 border-b last:border-b-0 border-border items-center"
          >
            <span className="text-[0.75rem] text-foreground">{k.label}</span>
            {[k.client, k.server].map((v, i) => (
              <span
                key={i}
                className={cn(
                  "mx-auto w-9 text-center font-mono text-[0.625rem] font-bold border py-0.5 transition-colors",
                  v ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground/60",
                )}
              >
                {v ? "হ্যাঁ" : "না"}
              </span>
            ))}
          </div>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground" data-filled={filled}>
        <span className="font-bold text-foreground">আটটার মধ্যে {toBn(filled)}টা ঘর ভরা। </span>
        {s.text}
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Connection হলো না: তিনটা আলাদা ছবি                                       */
/* ------------------------------------------------------------------------- */

const OUTCOMES = [
  {
    id: "ok",
    name: "সব ঠিক",
    wire: ["ফোন → SYN", "Server → SYN-ACK", "ফোন → ACK"],
    wait: "এক Round Trip, সাধারণত কয়েক মিলিসেকেন্ড থেকে কয়েকশ মিলিসেকেন্ড",
    nc: "Connection to ... port 443 [tcp/https] succeeded!",
    code: "connect event, কোনো Error নেই",
    meaning:
      "ওই IP তে একটা যন্ত্র আছে, পথ খোলা, আর ওই Port এ একটা Program LISTEN এ আছে। এর বেশি কিছু এটা প্রমাণ করে না। App ঠিক উত্তর দিচ্ছে কি না সেটা আলাদা প্রশ্ন।",
    check: ["এরপর সমস্যা থাকলে সেটা TCP র উপরের স্তরে, TLS বা HTTP তে", "curl -v দিয়ে পরের স্তরগুলো দেখুন"],
  },
  {
    id: "refused",
    name: "Port এ কেউ শুনছে না",
    wire: ["ফোন → SYN", "Server → RST"],
    wait: "সাথে সাথে, এক Round Trip এর মধ্যে",
    nc: "Connection refused",
    code: "ECONNREFUSED",
    meaning:
      "ভালো খবর আর খারাপ খবর দুইটাই। ভালো খবর, যন্ত্রটা চালু, পথ খোলা, আর আপনার SYN তার Kernel পর্যন্ত পৌঁছেছে, নইলে RST আসত না। খারাপ খবর, ওই Port এ কোনো Program LISTEN এ নেই, তাই Kernel নিজেই না বলে দিয়েছে।",
    check: [
      "App টা কি চালু আছে, নাকি Crash করেছে",
      "App কি ঠিক এই Port এই শুনছে, নাকি অন্য Port এ",
      "App কি শুধু 127.0.0.1 এ শুনছে অথচ আপনি বাইরে থেকে আসছেন",
      "Container এর Port বাইরে Publish করা হয়েছে কি না",
    ],
  },
  {
    id: "timeout",
    name: "SYN পথে হারিয়ে যাচ্ছে",
    wire: ["ফোন → SYN", "নীরবতা", "ফোন → SYN আবার, ১ সেকেন্ড পরে", "নীরবতা", "ফোন → SYN আবার, ২ সেকেন্ড পরে"],
    wait: "অনেকক্ষণ। Timeout না দিলে macOS এ ৭৫ সেকেন্ড, Linux এ দুই মিনিটের বেশি",
    nc: "Operation timed out",
    code: "ETIMEDOUT, অথবা আপনার নিজের বসানো Timeout",
    meaning:
      "কেউ হ্যাঁ বলেনি, কেউ না ও বলেনি। SYN টা কোথাও নীরবে ফেলে দেওয়া হচ্ছে, অথবা উত্তরটা ফেরার পথে হারাচ্ছে। প্রায় সব সময় এর পেছনে একটা Firewall, যাকে বলা আছে এই Port এর Packet চুপচাপ ফেলে দিতে।",
    check: [
      "Cloud এর Security Group বা Firewall এ এই Port খোলা আছে কি না",
      "Server এর নিজের Firewall (ufw, iptables) কী বলছে",
      "IP টা ঠিক তো, DNS কি পুরনো ঠিকানা দিচ্ছে",
      "যন্ত্রটা আদৌ চালু আছে কি না",
    ],
  },
  {
    id: "unreachable",
    name: "পথই নেই",
    wire: ["ফোন → SYN", "পথের একটা Router → ICMP, Destination Unreachable"],
    wait: "সাধারণত দ্রুত, কয়েক সেকেন্ডের মধ্যে",
    nc: "No route to host, অথবা Network is unreachable",
    code: "EHOSTUNREACH, অথবা ENETUNREACH",
    meaning:
      "এবার উত্তরটা Server দেয়নি, দিয়েছে পথের কেউ, অথবা আপনার নিজের যন্ত্র। মানে SYN টা গন্তব্য পর্যন্ত পৌঁছানোর রাস্তাই খুঁজে পায়নি। সমস্যাটা Port এর অনেক নিচে, IP আর Routing এর স্তরে।",
    check: [
      "নিজের যন্ত্রের Internet আছে কি না, Gateway ঠিক আছে কি না",
      "VPN চালু বা বন্ধ থাকায় Route বদলেছে কি না",
      "গন্তব্য একটা Private IP কি না, যেখানে আপনার Network থেকে যাওয়াই যায় না",
    ],
  },
];

export function ConnectOutcomeLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState("ok");
  const o = OUTCOMES.find((x) => x.id === id) ?? OUTCOMES[0];

  return (
    <Panel
      label="Interactive"
      title="Connection হলো না, কিন্তু কীভাবে হলো না"
      footer="চারটা অবস্থা একটা একটা করে বেছে দেখুন। প্রতিটায় তারে আলাদা জিনিস ঘটে, তাই আপনি আলাদা বার্তা দেখেন, আর খোঁজার জায়গাও আলাদা। সবচেয়ে কাজের অভ্যাসটা হলো সময়টা খেয়াল করা। না টা সাথে সাথে এলে কেউ একজন সক্রিয়ভাবে না বলেছে। অনেকক্ষণ ঝুলে থেকে ব্যর্থ হলে কেউ কিছুই বলেনি।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {OUTCOMES.map((x) => (
          <Choice key={x.id} active={x.id === id} onClick={() => setId(x.id)} data-outcome={x.id}>
            {x.name}
          </Choice>
        ))}
      </div>

      <motion.div
        key={o.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-current={o.id}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="border border-border bg-background px-3 py-3">
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">
              তারে যা ঘটে
            </div>
            <ol className="space-y-1">
              {o.wire.map((w, i) => (
                <li key={i} className="font-mono text-[0.6875rem] text-foreground">
                  <span className="text-muted-foreground mr-2">{toBn(i + 1)}.</span>
                  {w}
                </li>
              ))}
            </ol>
          </div>
          <div className="border border-border bg-background px-3 py-3 space-y-2">
            <div>
              <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
                কতক্ষণ পরে জানবেন
              </div>
              <div className="text-[0.75rem] text-foreground">{o.wait}</div>
            </div>
            <div>
              <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
                nc বা curl এ যা দেখবেন
              </div>
              <div className="font-mono text-[0.6875rem] font-bold text-primary">{o.nc}</div>
            </div>
            <div>
              <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
                আপনার Code এ যা আসবে
              </div>
              <div className="font-mono text-[0.6875rem] font-bold text-primary">{o.code}</div>
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground mb-4">{o.meaning}</p>

        <div className="border border-border px-3 py-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            এরপর কোথায় খুঁজবেন
          </div>
          <ul className="space-y-1">
            {o.check.map((c) => (
              <li key={c} className="text-[0.75rem] text-foreground">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Handshake এর দাম: দূরত্ব, আর Connection আবার ব্যবহার                      */
/* ------------------------------------------------------------------------- */

const DISTANCES = [
  { id: "near", label: "একই শহর", rtt: 5 },
  { id: "region", label: "ঢাকা থেকে সিঙ্গাপুর", rtt: 60 },
  { id: "far", label: "ঢাকা থেকে আমেরিকা", rtt: 250 },
];

const COUNTS = [1, 5, 20];

function ms(value: number): string {
  if (value >= 1000) return `${toBn((value / 1000).toFixed(1))} সেকেন্ড`;
  return `${toBn(value)} মিলিসেকেন্ড`;
}

export function HandshakeCostLab() {
  const [rtt, setRtt] = useState(60);
  const [count, setCount] = useState(5);

  // এক Round Trip করে: TCP Handshake, TLS 1.3 Handshake, তারপর Request আর Response।
  const fresh = count * 3 * rtt;
  const reused = (2 + count) * rtt;
  const saved = fresh - reused;
  const max = Math.max(fresh, 1);

  const rows = [
    {
      id: "fresh",
      name: "প্রতিটা Request এ নতুন Connection",
      total: fresh,
      parts: [
        { label: "TCP Handshake", value: count * rtt, tone: "bg-primary" },
        { label: "TLS Handshake", value: count * rtt, tone: "bg-primary/60" },
        { label: "Request আর Response", value: count * rtt, tone: "bg-muted-foreground/40" },
      ],
    },
    {
      id: "reused",
      name: "একটা Connection, বারবার ব্যবহার",
      total: reused,
      parts: [
        { label: "TCP Handshake", value: rtt, tone: "bg-primary" },
        { label: "TLS Handshake", value: rtt, tone: "bg-primary/60" },
        { label: "Request আর Response", value: count * rtt, tone: "bg-muted-foreground/40" },
      ],
    },
  ];

  return (
    <Panel
      label="Interactive"
      title="Handshake এর দাম কত, আর সেটা কীভাবে বাঁচে"
      footer="হিসাবটা সরল রাখা হয়েছে যাতে মূল কথাটা চোখে পড়ে। TCP Handshake এ এক Round Trip, তার উপর TLS 1.3 এর Handshake এ আরও এক Round Trip, তারপর আসল Request যেতে আর Response আসতে আরও এক। Server এর ভাবার সময় আর DNS এখানে ধরা হয়নি, আর Request গুলো একটার পর একটা যাচ্ছে ধরা হয়েছে। দূরত্ব বাড়িয়ে দেখুন, Handshake এর দাম সমান তালে বাড়ে, কারণ এটা Bandwidth এর ব্যাপার নয়, Latency র ব্যাপার। তারপর Request এর সংখ্যা বাড়ান, নিচের সারিটা কতটা এগিয়ে যায় দেখুন। Keep-Alive আর Connection Pool এর পুরো যুক্তি এই দুই সারির তফাতটুকু।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          Server কত দূরে
        </span>
        {DISTANCES.map((d) => (
          <Choice key={d.id} active={rtt === d.rtt} onClick={() => setRtt(d.rtt)} data-rtt={d.rtt}>
            {d.label}, RTT {toBn(d.rtt)} ms
          </Choice>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          কয়টা Request
        </span>
        {COUNTS.map((c) => (
          <Choice key={c} active={count === c} onClick={() => setCount(c)} data-count={c}>
            {toBn(c)}টা
          </Choice>
        ))}
      </div>

      <div className="space-y-4 mb-5">
        {rows.map((r) => (
          <div key={r.id} data-row={r.id} data-total={r.total}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 mb-1">
              <span className="text-[0.75rem] font-bold text-foreground">{r.name}</span>
              <span className="font-mono text-[0.6875rem] font-bold text-primary">{ms(r.total)}</span>
            </div>
            <div className="flex h-5 w-full border border-border bg-background overflow-hidden">
              {r.parts.map((p) => (
                <div
                  key={p.label}
                  title={p.label}
                  className={cn("h-full transition-all duration-500", p.tone)}
                  style={{ width: `${(p.value / max) * 100}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5">
        {rows[0].parts.map((p) => (
          <span key={p.label} className="inline-flex items-center gap-1.5 text-[0.625rem] text-muted-foreground">
            <span className={cn("inline-block w-3 h-3", p.tone)} />
            {p.label}
          </span>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground" data-saved={saved}>
        {count === 1
          ? `একটাই Request হলে দুই সারি সমান, ${ms(fresh)}। এর মধ্যে ${ms(2 * rtt)} গেছে শুধু হাত মেলাতে, আসল কাজে গেছে মাত্র ${ms(rtt)}। প্রথমবার এই দাম দিতেই হয়। লাভটা আসে দ্বিতীয় Request থেকে।`
          : `${toBn(count)}টা Request এ নতুন Connection খুললে মোট ${ms(fresh)}, আর একটা Connection আবার ব্যবহার করলে ${ms(reused)}। বাঁচল ${ms(saved)}, আর পুরোটাই বাঁচল Handshake না করে।`}
      </p>
    </Panel>
  );
}
