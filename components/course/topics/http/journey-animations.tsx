/**
 * What: The interactive labs for the Full HTTPS Journey lesson: a stage by stage walk of one
 * request, a comparison of first and repeat visits, a curl timing breakdown, and an error to stage
 * debugging guide.
 *
 * Why: The capstone asks the reader to hold every stage at once. Clicking through a journey, and
 * turning an error message back into the stage that failed, builds that picture faster than reading
 * it. Every lab derives what it shows straight from state, so nothing syncs inside an effect.
 */
"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
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

type LessonRef = { label: string; href: string };

function LessonLink({ lesson }: { lesson: LessonRef }) {
  return (
    <Link href={lesson.href} className="text-primary underline underline-offset-4">
      {lesson.label}
    </Link>
  );
}

const LESSON = {
  url: { label: "লেসন ০১, URL vs URI", href: "/devops/topic/url-vs-uri" },
  basics: { label: "লেসন ০২, HTTP Protocol Basics", href: "/devops/topic/http-basics" },
  methods: { label: "লেসন ০৩, Methods & Status Codes", href: "/devops/topic/http-methods-status-codes" },
  headers: { label: "লেসন ০৪, HTTP Headers", href: "/devops/topic/http-headers" },
  cookies: { label: "লেসন ০৫, Cookies", href: "/devops/topic/cookies" },
  session: { label: "লেসন ০৬, Session vs JWT", href: "/devops/topic/session-vs-jwt" },
  tls: { label: "লেসন ০৭, HTTPS, TLS, and SSL", href: "/devops/topic/https-tls-ssl" },
  certs: { label: "লেসন ০৮, Certificates and Keys", href: "/devops/topic/certificates-keys" },
  ws: { label: "লেসন ১০, WebSocket", href: "/devops/topic/websocket-realtime" },
  dnsJourney: { label: "Module 04, Full DNS Journey", href: "/devops/topic/dns-journey" },
  cloudflare: { label: "Module 04, Cloudflare DNS", href: "/devops/topic/cloudflare-dns" },
  handshake: { label: "Module 05, Three-way Handshake", href: "/devops/topic/three-way-handshake" },
  port: { label: "Module 05, Port and Socket", href: "/devops/topic/port-and-socket" },
  close: { label: "Module 05, Connection Close", href: "/devops/topic/connection-close" },
  nat: { label: "Module 03, NAT and PAT", href: "/devops/topic/nat-pat" },
} satisfies Record<string, LessonRef>;

/* ------------------------------------------------------------------------- */
/* 1. একটা Request, ধাপে ধাপে                                                 */
/* ------------------------------------------------------------------------- */

type Place = "browser" | "resolver" | "router" | "hops" | "caddy" | "app" | "data";

const PLACES: { id: Place; name: string }[] = [
  { id: "browser", name: "Browser" },
  { id: "resolver", name: "Resolver" },
  { id: "router", name: "Router, NAT" },
  { id: "hops", name: "ISP, Hop" },
  { id: "caddy", name: "Caddy :443" },
  { id: "app", name: "App :3000" },
  { id: "data", name: "Redis, PostgreSQL" },
];

const STAGES: {
  title: string;
  places: Place[];
  atMs: number;
  wire: string;
  text: string;
  lessons: LessonRef[];
}[] = [
  {
    title: "URL পড়া আর নিজের স্মৃতি দেখা",
    places: ["browser"],
    atMs: 0,
    wire: "তারে এখনো কিছু যায়নি",
    text: "Browser লেখাটাকে URL হিসেবে ভাঙে: Scheme https, তাই Port 443; Host islandtours.example; Path /tours/saint-martin। তারপর নিজের স্মৃতিতে চারটা জিনিস খোঁজে: HSTS তালিকায় নামটা আছে কি না, পাতাটা Cache এ আছে কি না, এই Host এর সাথে আগে থেকে খোলা Connection আছে কি না, আর DNS এর উত্তর মনে আছে কি না। এটা প্রথমবার, তাই কোনোটাই নেই।",
    lessons: [LESSON.url, LESSON.tls],
  },
  {
    title: "DNS, নাম থেকে ঠিকানা",
    places: ["browser", "router", "resolver"],
    atMs: 30,
    wire: "একটা ছোট UDP প্রশ্ন আর উত্তর, সাধারণত খোলা লেখায়",
    text: "Operating System এর Stub Resolver প্রশ্নটা পাঠায় সেই Resolver এর কাছে, যাকে DHCP চিনিয়ে দিয়েছিল। Resolver এর Cache এ উত্তর থাকলে সাথে সাথে ফেরে, না থাকলে সে Root, TLD আর Authoritative Server ঘুরে আসে। উত্তর: 103.94.135.2, TTL 3600।",
    lessons: [LESSON.dnsJourney],
  },
  {
    title: "TCP Handshake, দরজায় টোকা",
    places: ["browser", "router", "hops", "caddy"],
    atMs: 70,
    wire: "SYN, SYN-ACK, ACK। IP আর Port সবাই দেখে",
    text: "Kernel ফোনকে একটা Ephemeral Port দেয়, 51514, আর 103.94.135.2:443 এর দিকে SYN পাঠায়। বাসার Router Source টা বদলে 203.0.113.25:62001 করে। Caddy এর যন্ত্রের Kernel SYN-ACK দেয়, ফোন ACK দেয়। একটা পুরো Round Trip, 40 ms।",
    lessons: [LESSON.handshake, LESSON.nat],
  },
  {
    title: "TLS Handshake, তালা লাগানো",
    places: ["browser", "router", "hops", "caddy"],
    atMs: 115,
    wire: "ClientHello তে Domain নামটা খোলা (SNI)। ServerHello এর পর থেকে সব তালাবন্ধ",
    text: "ফোন ClientHello পাঠায়: আমি islandtours.example চাই, h2 আর http/1.1 বুঝি, এই যে আমার Key Share। Caddy নিজের Key Share, Certificate আর একটা Signature পাঠায়, যা প্রমাণ করে Private Key টা তার কাছেই আছে। দুই পাশ একই গোপন Key এ পৌঁছায়, অথচ সেই Key কখনো তারে যায়নি। ALPN এ ঠিক হয় HTTP/2।",
    lessons: [LESSON.tls],
  },
  {
    title: "Certificate যাচাই, ফোনের ভেতরে",
    places: ["browser"],
    atMs: 118,
    wire: "তারে নতুন কিছু যায় না, কাজটা ফোনের CPU তে",
    text: "ফোন তিনটা প্রশ্নের উত্তর মেলায়। নামটা Certificate এর SAN তালিকায় আছে? আজকের তারিখ মেয়াদের ভেতরে? Certificate এর Chain কি ফোনের Trust Store এর কোনো Root পর্যন্ত পৌঁছায়? একটাতেও না হলে এখানেই যাত্রা শেষ, পর্যটক দেখেন লাল সতর্কতার পাতা।",
    lessons: [LESSON.certs],
  },
  {
    title: "HTTP/2 Request, আসল প্রশ্নটা",
    places: ["browser", "router", "hops", "caddy"],
    atMs: 138,
    wire: "পুরোটা TLS এর ভেতরে। পথের কেউ Path, Cookie বা Header দেখে না",
    text: "Stream 1 এ যায় :method GET, :path /tours/saint-martin, :authority islandtours.example, Accept এর তালিকা, আর __Host-session Cookie টা, কারণ এই নাম, এই Path আর HTTPS, তিনটাই Cookie এর শর্ত মেলায়।",
    lessons: [LESSON.basics, LESSON.methods, LESSON.headers, LESSON.cookies],
  },
  {
    title: "Caddy, দরজায় দারোয়ান",
    places: ["caddy", "app"],
    atMs: 139,
    wire: "Caddy থেকে App, 127.0.0.1 এর ভেতরে সাধারণ HTTP/1.1",
    text: "Caddy তালা খুলে Request পড়ে, Host দেখে ঠিক Site বেছে নেয়, X-Forwarded-For এ 203.0.113.25, X-Forwarded-Proto এ https আর একটা নতুন X-Request-Id বসায়, তারপর আগে থেকে খোলা একটা Connection এ App কে দেয়।",
    lessons: [LESSON.headers, LESSON.port],
  },
  {
    title: "App, পাতা বানানো",
    places: ["app", "data"],
    atMs: 185,
    wire: "App থেকে Redis আর PostgreSQL, যন্ত্রের ভেতরের Network এ",
    text: "App Cookie থেকে Session ID পড়ে Redis এ খোঁজে, পায় usr_42, প্রায় 1 ms। PostgreSQL থেকে Tour আর খালি আসনের সংখ্যা আনে, প্রায় 15 ms। HTML বানায়, Status 200, Cache-Control: private, no-cache, কারণ পাতায় পর্যটকের নাম আছে।",
    lessons: [LESSON.session, LESSON.methods],
  },
  {
    title: "Response ফেরা, প্রথম Byte",
    places: ["caddy", "hops", "router", "browser"],
    atMs: 205,
    wire: "আবার তালাবন্ধ। Router NAT টেবিল দেখে 62001 কে 51514 এ ফেরায়",
    text: "Caddy উত্তরটা HTTP/2 Frame এ ভরে, চাপ দিয়ে ছোট করে, Strict-Transport-Security বসিয়ে, তালাবন্ধ করে পাঠায়। ফোনে পৌঁছানোর মুহূর্তটাই Time to First Byte। এই উদাহরণে 205 ms, যার প্রায় অর্ধেক শুধু আসা যাওয়া।",
    lessons: [LESSON.headers, LESSON.nat],
  },
  {
    title: "পাতার বাকি সব",
    places: ["browser", "caddy"],
    atMs: 380,
    wire: "একই Connection এ নতুন Stream, 3, 5, 7। নতুন DNS, TCP বা TLS নেই",
    text: "HTML পড়ে Browser CSS, JavaScript আর ছবির খোঁজ পায়। যাদের নামে Hash আছে আর Cache এ আছে, তাদের জন্য Request ই যায় না। বাকিরা পাশাপাশি চলে একই Connection এ। তারপর JavaScript আসনের তথ্য চায় /api/tours/saint-martin/seats থেকে।",
    lessons: [LESSON.headers, LESSON.basics],
  },
  {
    title: "চুপচাপ খোলা, তারপর বিদায়",
    places: ["browser", "caddy"],
    atMs: 380,
    wire: "কিছুক্ষণ কিছুই যায় না। শেষে FIN, ACK",
    text: "Connection টা সাথে সাথে বন্ধ হয় না, পর্যটক আরেকটা পাতা খুলতে পারেন। কারো Idle Timeout পার হলে সে FIN পাঠায়। যে আগে বন্ধ করে, TIME_WAIT তার ঘাড়ে।",
    lessons: [LESSON.close],
  },
];

export function JourneyStepLab() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const cur = STAGES[step];
  const last = step === STAGES.length - 1;
  const totalMs = STAGES[STAGES.length - 1].atMs;

  return (
    <Panel
      label="Interactive"
      title="একটা Request, এক ধাপ করে"
      footer="পরের ধাপ চাপুন আর দেখুন Request টা এই মুহূর্তে কোথায় আছে, তারে কী যাচ্ছে আর পথের লোকেরা তার কতটুকু পড়তে পারছে। প্রতিটা ধাপের নিচে সেই লেসনের নাম, যেখানে ধাপটা বিস্তারিত শিখেছেন। সময়গুলো একটা সাজানো উদাহরণ, ফোন থেকে Server এর RTT 40 ms ধরে। নিজের যন্ত্রে আসল সংখ্যা মাপবেন এই লেসনের Measure অংশে।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          aria-label="আগের ধাপ"
          className={cn(
            "inline-flex items-center justify-center w-8 h-8 border transition-colors",
            step === 0
              ? "border-border text-muted-foreground/40"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
          )}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setStep((s) => Math.min(STAGES.length - 1, s + 1))}
          disabled={last}
          data-action="next"
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            last
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          পরের ধাপ <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => setStep(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[0.625rem] text-muted-foreground">
          ধাপ {toBn(step + 1)} / {toBn(STAGES.length)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-5">
        {PLACES.map((p) => {
          const on = cur.places.includes(p.id);
          return (
            <div
              key={p.id}
              data-place={p.id}
              data-on={on ? "yes" : "no"}
              className={cn(
                "border px-2 py-2 text-center text-[0.6875rem] font-bold transition-colors",
                on ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground",
              )}
            >
              {p.name}
            </div>
          );
        })}
      </div>

      <div className="relative h-2 border border-border bg-background mb-5">
        <div
          className="absolute inset-y-0 left-0 bg-primary/40 transition-all duration-300"
          style={{ width: `${(cur.atMs / totalMs) * 100}%` }}
        />
      </div>

      <motion.div
        key={step}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="space-y-3"
        data-step={step}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="text-[0.9375rem] font-bold text-foreground">{cur.title}</h4>
          <span className="font-mono text-[0.6875rem] text-primary" data-at-ms={cur.atMs}>
            {`≈ ${cur.atMs} ms`}
          </span>
        </div>
        <div className="border border-primary/40 bg-primary/5 px-3 py-2 text-[0.8125rem] text-foreground">
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-2">
            তারে
          </span>
          {cur.wire}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{cur.text}</p>
        <p className="text-[0.75rem] text-muted-foreground">
          শিখেছেন:{" "}
          {cur.lessons.map((l, i) => (
            <span key={l.href}>
              {i > 0 && ", "}
              <LessonLink lesson={l} />
            </span>
          ))}
        </p>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. প্রথমবার আর পরেরবার                                                     */
/* ------------------------------------------------------------------------- */

type RunState = "runs" | "shorter" | "skipped";

const VISIT_ROWS = ["DNS", "TCP Handshake", "TLS Handshake", "HTML পাতা", "CSS আর JavaScript", "Session Cookie"] as const;

const VISITS: {
  id: string;
  label: string;
  totalMs: number;
  rows: [RunState, string][];
  summary: string;
}[] = [
  {
    id: "first",
    label: "একদম প্রথমবার",
    totalMs: 380,
    rows: [
      ["runs", "কোথাও উত্তর মনে নেই, Resolver কে জিজ্ঞেস করতে হয়"],
      ["runs", "নতুন Connection, এক RTT"],
      ["runs", "পুরো Handshake, Certificate সহ, এক RTT"],
      ["runs", "পুরো পাতা আসে, 200"],
      ["runs", "সব নতুন করে নামাতে হয়"],
      ["runs", "আগের Login থেকে Cookie টা আছে, যায়"],
    ],
    summary: "সবগুলো ধাপ চলে। এটাই সবচেয়ে ধীর যাত্রা, আর বেশিরভাগ মাপজোক এটাকে নিয়েই।",
  },
  {
    id: "again",
    label: "৩০ সেকেন্ড পরে আরেকটা পাতা",
    totalMs: 110,
    rows: [
      ["skipped", "TTL 3600 এখনো শেষ হয়নি, উত্তর Cache এ"],
      ["skipped", "আগের Connection টা এখনো খোলা, সেটাই ব্যবহার হয়"],
      ["skipped", "একই Connection, তাই নতুন Handshake নেই"],
      ["runs", "private, no-cache, তাই Server কে জিজ্ঞেস করতে হয়, নতুন Stream এ"],
      ["skipped", "নামে Hash আছে, Cache এ আছে, Request ই যায় না"],
      ["runs", "Cookie যায়, Redis এ Session পাওয়া যায়"],
    ],
    summary: "Connection আর DNS এর খরচ শূন্য। বাকি থাকে শুধু একবার আসা যাওয়া আর Server এর ভাবার সময়।",
  },
  {
    id: "morning",
    label: "পরের দিন সকালে",
    totalMs: 260,
    rows: [
      ["runs", "TTL শেষ, আবার জিজ্ঞেস, তবে Resolver এর Cache এ থাকার সম্ভাবনা বেশি"],
      ["runs", "রাতে Connection বন্ধ হয়ে গেছে, নতুন করে খুলতে হয়"],
      ["shorter", "Session Resumption: আগের Ticket দেখিয়ে, Certificate আর পাঠাতে হয় না"],
      ["shorter", "If-None-Match পাঠায়, পাতা না বদলালে 304, Body ছাড়া"],
      ["skipped", "Disk Cache এ, immutable, এক বছর পর্যন্ত বৈধ"],
      ["runs", "১৪ দিন শেষ হয়নি, Session এখনো বৈধ"],
    ],
    summary: "Connection নতুন করে লাগে, কিন্তু TLS ছোট হয়, আর পাতা ও ফাইলের বেশিরভাগ আসে নিজের Cache থেকে।",
  },
  {
    id: "expired",
    label: "১৫ দিন পরে",
    totalMs: 300,
    rows: [
      ["runs", "আবার জিজ্ঞেস করতে হয়"],
      ["runs", "নতুন Connection"],
      ["runs", "Ticket এর মেয়াদও সম্ভবত শেষ, পুরো Handshake"],
      ["runs", "পাতা আসে, কিন্তু পর্যটক এখন Guest"],
      ["skipped", "Deploy না হলে ফাইলগুলো এখনো Cache এ"],
      ["skipped", "Max-Age=1209600 পার, Browser Cookie মুছে ফেলেছে, যায়ই না"],
    ],
    summary: "পথ প্রায় প্রথমবারের মতো। আর পর্যটক Login ছাড়া পাতা দেখছেন, কারণ Cookie এর মেয়াদ ১৪ দিন, আর Redis এ Session এর TTL ও তাই।",
  },
];

const STATE_LABEL: Record<RunState, string> = {
  runs: "চলে",
  shorter: "ছোট হয়",
  skipped: "লাগে না",
};

export function VisitCompareLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState(VISITS[0].id);
  const cur = VISITS.find((v) => v.id === id) ?? VISITS[0];
  const maxMs = Math.max(...VISITS.map((v) => v.totalMs));

  return (
    <Panel
      label="Interactive"
      title="একই পাতা, চার রকম সময়ে"
      footer="উপর থেকে একটা মুহূর্ত বেছে নিন আর দেখুন যাত্রার কোন অংশ চলে, কোন অংশ ছোট হয়, আর কোন অংশ লাগেই না। সময়গুলো সাজানো উদাহরণ, RTT 40 ms ধরে, কিন্তু অনুপাতটা বাস্তবের মতো। এই চারটা পাশাপাশি দেখলে বোঝা যায় দ্রুত Website এর আসল রহস্য প্রায়ই দ্রুত কাজ করা নয়, বরং যে কাজ না করলেও চলে সেটা না করা।"
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {VISITS.map((v) => (
          <Chip key={v.id} active={id === v.id} onClick={() => setId(v.id)} data-visit={v.id}>
            {v.label}
          </Chip>
        ))}
      </div>

      <motion.div
        key={cur.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-current={cur.id}
      >
        <div className="space-y-2 mb-5">
          {VISIT_ROWS.map((name, i) => {
            const [state, note] = cur.rows[i];
            return (
              <div
                key={name}
                data-row={name}
                data-state={state}
                className="grid grid-cols-1 sm:grid-cols-[150px_90px_1fr] gap-x-3 gap-y-1 items-center border border-border bg-background px-3 py-2"
              >
                <span className="text-[0.75rem] font-bold text-foreground">{name}</span>
                <span
                  className={cn(
                    "justify-self-start px-2 py-0.5 border font-mono text-[0.625rem] font-bold",
                    state === "runs" && "border-primary/60 text-primary bg-primary/10",
                    state === "shorter" && "border-primary/40 text-primary",
                    state === "skipped" && "border-border text-muted-foreground",
                  )}
                >
                  {STATE_LABEL[state]}
                </span>
                <span className="text-[0.8125rem] leading-relaxed text-muted-foreground">{note}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-[110px_1fr] items-center gap-3 mb-4">
          <span className="text-[0.6875rem] font-bold text-foreground">মোট সময়</span>
          <div className="relative h-5 border border-border bg-background">
            <div
              className="absolute inset-y-0 left-0 bg-primary/30 transition-all duration-300"
              style={{ width: `${(cur.totalMs / maxMs) * 100}%` }}
            />
            <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[0.625rem] text-muted-foreground" data-total-ms={cur.totalMs}>
              {`≈ ${cur.totalMs} ms`}
            </span>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{cur.summary}</p>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. curl এর সংখ্যা থেকে ধাপের সময়                                          */
/* ------------------------------------------------------------------------- */

type Timing = {
  namelookup: number;
  connect: number;
  appconnect: number;
  pretransfer: number;
  starttransfer: number;
  total: number;
};

const TIMING_SCENARIOS: {
  id: string;
  label: string;
  real: boolean;
  t: Timing;
  advice: string;
}[] = [
  {
    id: "example-cold",
    label: "example.com, নতুন Connection",
    real: true,
    t: { namelookup: 0.001771, connect: 0.006339, appconnect: 0.02383, pretransfer: 0.023878, starttransfer: 0.041177, total: 0.04152 },
    advice: "এই লেখার যন্ত্রে আসলে মাপা। DNS উত্তর Cache এ ছিল, আর example.com এর পেছনের CDN এর একটা যন্ত্র খুব কাছে, তাই TCP মাত্র কয়েক ms। TLS টা TCP এর চেয়ে বড়, কারণ তাতে একটা RTT এর সাথে Certificate পরীক্ষার কাজও আছে।",
  },
  {
    id: "example-reused",
    label: "example.com, একই Connection এ দ্বিতীয় Request",
    real: true,
    t: { namelookup: 0.00001, connect: 0, appconnect: 0, pretransfer: 0.000037, starttransfer: 0.013713, total: 0.013772 },
    advice: "একই curl কমান্ডে দ্বিতীয় URL। connect আর appconnect শূন্য, মানে কোনো Handshake ই হয়নি, আগের Connection টা আবার ব্যবহার হয়েছে। মোট সময় কমে প্রায় তিন ভাগের এক ভাগ।",
  },
  {
    id: "island-cold",
    label: "Island Tours, ঢাকা থেকে প্রথমবার",
    real: false,
    t: { namelookup: 0.03, connect: 0.07, appconnect: 0.115, pretransfer: 0.116, starttransfer: 0.205, total: 0.23 },
    advice: "সাজানো উদাহরণ, RTT 40 ms। Connection বানাতেই 115 ms, প্রায় অর্ধেক। এখানে সবচেয়ে বড় লাভ আসবে Connection বারবার ব্যবহার করে, আর দূরের পর্যটকদের জন্য Server বা CDN কাছে এনে।",
  },
  {
    id: "island-slow",
    label: "Island Tours, Server ধীর",
    real: false,
    t: { namelookup: 0.03, connect: 0.07, appconnect: 0.115, pretransfer: 0.116, starttransfer: 1.905, total: 1.93 },
    advice: "সাজানো উদাহরণ। Network এর অংশ আগের মতোই, কিন্তু Server এর অপেক্ষা প্রায় 1.8 সেকেন্ড। এখানে DNS, CDN বা HTTP/3 নিয়ে মাথা ঘামানো সময় নষ্ট। খুঁজতে হবে App এর ভেতরে: ধীর Query, Cache এ না পাওয়া, বা বাইরের কোনো Service এর অপেক্ষা।",
  },
  {
    id: "island-mobile",
    label: "Island Tours, দূরের Mobile Data",
    real: false,
    t: { namelookup: 0.13, connect: 0.25, appconnect: 0.38, pretransfer: 0.381, starttransfer: 0.56, total: 0.64 },
    advice: "সাজানো উদাহরণ, RTT 120 ms। প্রতিটা Round Trip তিনগুণ দামি, তাই প্রতিটা Handshake চোখে পড়ার মতো বড়। এই পর্যটকদের জন্য সবচেয়ে কাজের জিনিস HTTP/3, যা TCP আর TLS এর Handshake এক করে দেয়, আর TLS Resumption।",
  },
];

const SEGMENTS: { key: string; name: string; formula: string; tone: string }[] = [
  { key: "dns", name: "DNS", formula: "namelookup", tone: "bg-foreground/15" },
  { key: "tcp", name: "TCP", formula: "connect − namelookup", tone: "bg-foreground/30" },
  { key: "tls", name: "TLS", formula: "appconnect − connect", tone: "bg-primary/35" },
  { key: "wait", name: "Server এর অপেক্ষা", formula: "starttransfer − pretransfer", tone: "bg-primary/70" },
  { key: "download", name: "নামানো", formula: "total − starttransfer", tone: "bg-primary/20" },
];

/** Splits curl's running totals into one duration per stage, in seconds. A reused connection reports 0 for connect and appconnect, so each stage is clamped at zero. */
function stageDurations(t: Timing): Record<string, number> {
  const connected = Math.max(t.connect, t.namelookup);
  const secured = Math.max(t.appconnect, connected);
  return {
    dns: t.namelookup,
    tcp: Math.max(0, t.connect - t.namelookup),
    tls: Math.max(0, t.appconnect - connected),
    wait: Math.max(0, t.starttransfer - Math.max(t.pretransfer, secured)),
    download: Math.max(0, t.total - t.starttransfer),
  };
}

const ms = (seconds: number) => `${(seconds * 1000).toFixed(1)} ms`;

export function TimingBreakdownLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState(TIMING_SCENARIOS[0].id);
  const cur = TIMING_SCENARIOS.find((s) => s.id === id) ?? TIMING_SCENARIOS[0];
  const d = stageDurations(cur.t);
  const sum = SEGMENTS.reduce((acc, s) => acc + d[s.key], 0) || 1;
  const biggest = SEGMENTS.reduce((a, b) => (d[b.key] > d[a.key] ? b : a));

  return (
    <Panel
      label="Interactive"
      title="curl এর সংখ্যা থেকে প্রতিটা ধাপের সময়"
      footer="curl -w যে সংখ্যাগুলো দেয় সেগুলো জমানো সময়, শুরু থেকে ওই মুহূর্ত পর্যন্ত। তাই প্রতিটা ধাপের নিজের সময় পেতে পাশের দুইটা বিয়োগ করতে হয়, ঠিক যেভাবে ডানে লেখা আছে। প্রথম দুইটা উদাহরণ আসলে মাপা, বাকি তিনটা Island Tours এর জন্য সাজানো। প্রতিটা বেছে নিয়ে দেখুন কোন অংশটা সবচেয়ে বড়, কারণ সারানোর কাজ সবসময় সেখান থেকেই শুরু।"
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {TIMING_SCENARIOS.map((s) => (
          <Chip key={s.id} active={id === s.id} onClick={() => setId(s.id)} data-scenario={s.id}>
            {s.label}
          </Chip>
        ))}
      </div>

      <motion.div
        key={cur.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        data-current={cur.id}
      >
        <div className="flex h-8 border border-border bg-background mb-2 overflow-hidden">
          {SEGMENTS.map((s) => (
            <div
              key={s.key}
              className={cn("h-full transition-all duration-300", s.tone)}
              style={{ width: `${(d[s.key] / sum) * 100}%` }}
              title={`${s.name}: ${ms(d[s.key])}`}
            />
          ))}
        </div>
        <p className="font-mono text-[0.625rem] text-muted-foreground mb-5">
          {cur.real ? "আসলে মাপা" : "সাজানো উদাহরণ"} · মোট {ms(cur.t.total)}
        </p>

        <div className="space-y-1.5 mb-5">
          {SEGMENTS.map((s) => (
            <div
              key={s.key}
              data-segment={s.key}
              data-ms={(d[s.key] * 1000).toFixed(1)}
              className={cn(
                "grid grid-cols-[14px_1fr_auto] sm:grid-cols-[14px_150px_1fr_90px] gap-x-3 items-center border px-3 py-1.5",
                s.key === biggest.key ? "border-primary/60 bg-primary/5" : "border-border bg-background",
              )}
            >
              <span className={cn("w-3 h-3", s.tone)} />
              <span className="text-[0.75rem] font-bold text-foreground">{s.name}</span>
              <span className="hidden sm:block font-mono text-[0.625rem] text-muted-foreground">{s.formula}</span>
              <span className="font-mono text-[0.75rem] text-foreground text-right">{ms(d[s.key])}</span>
            </div>
          ))}
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">সবচেয়ে বড় অংশ: {biggest.name}। </span>
          {cur.advice}
        </p>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Error থেকে ভাঙা ধাপ                                                     */
/* ------------------------------------------------------------------------- */

const BREAKS: {
  id: string;
  label: string;
  curl: string;
  stage: string;
  meaning: string;
  check: string;
  lesson: LessonRef;
}[] = [
  {
    id: "nxdomain",
    label: "DNS_PROBE_FINISHED_NXDOMAIN",
    curl: "curl: (6) Could not resolve host",
    stage: "DNS, ধাপ ২",
    meaning: "নামটার কোনো ঠিকানা পাওয়া যায়নি। নামের বানান ভুল, Record নেই, অথবা Domain এর মেয়াদ শেষ। এরপরের কোনো ধাপ শুরুই হয়নি।",
    check: "dig +short islandtours.example, তারপর dig @1.1.1.1 +short islandtours.example",
    lesson: LESSON.dnsJourney,
  },
  {
    id: "refused",
    label: "ERR_CONNECTION_REFUSED",
    curl: "curl: (7) Failed to connect ... Couldn't connect to server",
    stage: "TCP, ধাপ ৩",
    meaning: "যন্ত্রটা পর্যন্ত পৌঁছানো গেছে, কিন্তু Port 443 এ কেউ শুনছে না, তাই উত্তরে RST এসেছে। সাধারণত Caddy বন্ধ, অথবা অন্য Port এ চলছে।",
    check: "nc -vz -w 3 103.94.135.2 443, আর Server এ ss -ltnp দিয়ে দেখুন 443 এ কে আছে",
    lesson: LESSON.port,
  },
  {
    id: "timeout",
    label: "ERR_CONNECTION_TIMED_OUT",
    curl: "curl: (28) Failed to connect ... Timeout was reached",
    stage: "TCP, ধাপ ৩",
    meaning: "SYN গেছে, কিন্তু কোনো উত্তর আসেনি, RST ও না। পথে কেউ চুপচাপ Packet ফেলে দিচ্ছে: Firewall, ভুল IP, অথবা যন্ত্রটাই বন্ধ।",
    check: "dig দিয়ে IP টা ঠিক কি না দেখুন, তারপর nc -vz -w 3 সেই IP 443",
    lesson: LESSON.handshake,
  },
  {
    id: "date",
    label: "NET::ERR_CERT_DATE_INVALID",
    curl: "curl: (60) SSL certificate problem: certificate has expired",
    stage: "Certificate যাচাই, ধাপ ৫",
    meaning: "Certificate এর মেয়াদ শেষ, নয়তো পর্যটকের ফোনের ঘড়ি ভুল। সবার এক সাথে হলে প্রথমটা, একজনের হলে প্রায়ই দ্বিতীয়টা।",
    check: "openssl s_client -connect islandtours.example:443 -servername islandtours.example </dev/null | openssl x509 -noout -dates",
    lesson: LESSON.certs,
  },
  {
    id: "name",
    label: "NET::ERR_CERT_COMMON_NAME_INVALID",
    curl: "curl: (60) SSL: no alternative certificate subject name matches",
    stage: "Certificate যাচাই, ধাপ ৫",
    meaning: "Certificate টা বৈধ, কিন্তু অন্য নামের জন্য। যেমন islandtours.example এর Certificate দিয়ে www.islandtours.example চাওয়া হয়েছে, আর www নামটা তালিকায় নেই।",
    check: "openssl x509 -noout -ext subjectAltName দিয়ে নামের তালিকা দেখুন",
    lesson: LESSON.certs,
  },
  {
    id: "authority",
    label: "NET::ERR_CERT_AUTHORITY_INVALID",
    curl: "curl: (60) SSL certificate problem: self signed certificate, অথবা unable to get local issuer certificate",
    stage: "Certificate যাচাই, ধাপ ৫",
    meaning: "Chain টা কোনো বিশ্বস্ত Root পর্যন্ত পৌঁছাচ্ছে না। নিজের বানানো Certificate, অথবা Server মাঝের Intermediate Certificate টা পাঠাচ্ছে না।",
    check: "openssl s_client -connect islandtours.example:443 -servername islandtours.example -showcerts </dev/null",
    lesson: LESSON.certs,
  },
  {
    id: "protocol",
    label: "ERR_SSL_PROTOCOL_ERROR",
    curl: "curl: (35) ... alert protocol version, অথবা wrong version number",
    stage: "TLS Handshake, ধাপ ৪",
    meaning: "দুই পাশ TLS এ একমত হতে পারেনি। প্রায়ই Port 443 এ এমন কিছু চলছে যে TLS বলেই না, সাধারণ HTTP বলছে। নয়তো একপাশ খুব পুরনো Version চায়।",
    check: "curl -v https://islandtours.example দিয়ে Handshake এর লাইনগুলো দেখুন",
    lesson: LESSON.tls,
  },
  {
    id: "redirects",
    label: "ERR_TOO_MANY_REDIRECTS",
    curl: "curl: (47) Maximum (5) redirects followed",
    stage: "HTTP, ধাপ ৬ আর ৭",
    meaning: "Redirect এর একটা চক্র। চেনা কারণ: Cloudflare Flexible Mode এ Caddy এর কাছে HTTP পাঠায়, Caddy বলে HTTPS এ যান, Cloudflare আবার HTTP পাঠায়।",
    check: "curl -sIL --max-redirs 5 http://islandtours.example | grep -i '^location'",
    lesson: LESSON.cloudflare,
  },
  {
    id: "502",
    label: "502 Bad Gateway",
    curl: "HTTP/2 502",
    stage: "Caddy থেকে App, ধাপ ৭",
    meaning: "Caddy পর্যন্ত সব ঠিক, কিন্তু পেছনের App উত্তর দেয়নি বা Connection কেটে দিয়েছে। App বন্ধ, ভুল Port, নয়তো Keep-Alive এর Timeout এর ভুল ক্রম।",
    check: "Server এ curl -i http://127.0.0.1:3000/ সরাসরি, আর Caddy এর Log",
    lesson: LESSON.close,
  },
  {
    id: "504",
    label: "504 Gateway Timeout",
    curl: "HTTP/2 504",
    stage: "App, ধাপ ৮",
    meaning: "App বেঁচে আছে, কিন্তু সময়মতো উত্তর দিতে পারেনি। ধীর Query, আটকে থাকা বাইরের Service, অথবা ভরা Pool।",
    check: "উত্তরের X-Request-Id দিয়ে App এর Log এ ঠিক সেই Request টা খুঁজুন",
    lesson: LESSON.methods,
  },
  {
    id: "cors",
    label: "Console এ CORS Error",
    curl: "curl এ কোনো Error নেই, উত্তর ঠিকঠাক আসে",
    stage: "Browser এর নিয়ম, ধাপ ১০",
    meaning: "Request গেছে, উত্তরও এসেছে, কিন্তু Browser সেটা JavaScript কে দিচ্ছে না, কারণ উত্তরে অন্য Origin কে অনুমতি দেওয়ার Header নেই। curl এ সব ঠিক দেখায়, কারণ curl Browser নয়।",
    check: "DevTools এর Network এ OPTIONS Request আর Access-Control-Allow-Origin খুঁজুন",
    lesson: LESSON.headers,
  },
  {
    id: "logout",
    label: "Login থাকছে না",
    curl: "curl এ Set-Cookie আসে, কিন্তু পরের Request এ Cookie যায় না",
    stage: "Cookie আর Session, ধাপ ৬ আর ৮",
    meaning: "Browser Cookie টা রাখছে না বা পাঠাচ্ছে না। Secure Cookie কিন্তু পাতা HTTP তে, ভুল Domain বা Path, SameSite এর বাধা, অথবা Redis এ Session এর মেয়াদ শেষ।",
    check: "DevTools এর Application এ Cookies, আর Network এ Request এর Cookie Header",
    lesson: LESSON.cookies,
  },
];

export function BreakpointLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState(BREAKS[0].id);
  const cur = BREAKS.find((b) => b.id === id) ?? BREAKS[0];
  const rows = [
    { k: "curl এ যা দেখবেন", v: cur.curl, mono: true },
    { k: "কোন ধাপ ভেঙেছে", v: cur.stage, mono: false },
    { k: "আসলে কী ঘটেছে", v: cur.meaning, mono: false },
    { k: "প্রথম যা চালাবেন", v: cur.check, mono: true },
  ];

  return (
    <Panel
      label="Interactive"
      title="Error দেখে বুঝুন যাত্রা কোথায় ভেঙেছে"
      footer="উপরের প্রতিটা বোতাম একটা Error, যেভাবে Browser এর পাতায় বা Console এ লেখা থাকে। একটা বেছে নিলে দেখবেন একই সমস্যা curl এ কেমন দেখায়, যাত্রার কোন ধাপে ভেঙেছে, আসলে কী ঘটেছে, আর প্রথম কোন কমান্ডটা চালাবেন। মনে রাখবেন, ধাপগুলো ক্রমে চলে। যে ধাপে ভেঙেছে তার পরের কোনো ধাপ শুরুই হয়নি, তাই তাদের নিয়ে ভাবার দরকার নেই।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {BREAKS.map((b) => (
          <Chip key={b.id} active={id === b.id} onClick={() => setId(b.id)} data-break={b.id}>
            {b.label}
          </Chip>
        ))}
      </div>

      <motion.div
        key={cur.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="space-y-2"
        data-current={cur.id}
      >
        {rows.map((r, i) => (
          <div
            key={r.k}
            className={cn(
              "grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-4 gap-y-1 border px-3 py-2.5",
              i === 1 ? "border-primary/50 bg-primary/5" : "border-border bg-background",
            )}
          >
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground pt-0.5">
              {r.k}
            </div>
            <div className={cn("leading-relaxed text-foreground", r.mono ? "font-mono text-[0.75rem] break-words" : "text-[0.8125rem]")}>
              {r.v}
            </div>
          </div>
        ))}
        <p className="text-[0.75rem] text-muted-foreground pt-2">
          বিস্তারিত: <LessonLink lesson={cur.lesson} />
        </p>
      </motion.div>
    </Panel>
  );
}
