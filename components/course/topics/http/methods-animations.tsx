"use client";

/**
 * What: The four interactive labs for Module 06 Lesson 03: send a method again and again and watch
 * the server's state, follow each kind of redirect, pick the right status code for a situation, and
 * decide whether a failed request is safe to send again.
 *
 * Why: Safe, idempotent and "is a retry safe" are rules a reader learns best by pressing a button and
 * seeing the result change. Every visual is derived straight from state, with no effects, so rapid
 * clicks never leave the panel out of step (see the curriculum gotchas about set-state-in-effect).
 */
import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
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

function Badge({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 border font-mono text-[0.625rem] font-bold uppercase tracking-[0.1em] transition-colors",
        on ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground/50 line-through",
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. একই Request বারবার, Server এর খাতায় কী বদলায়                             */
/* ------------------------------------------------------------------------- */

type Booking = { id: string; guests: number };

type MethodCase = {
  id: string;
  label: string;
  line: string;
  body: string | null;
  safe: boolean;
  idempotent: boolean;
  cacheable: boolean;
  /** The server's bookings after this request has been sent `sends` times. */
  after: (sends: number) => Booking[];
  /** The status code of the latest send. */
  code: (sends: number) => string;
  lesson: string;
};

const START: Booking[] = [{ id: "bk_7Q2M9X", guests: 2 }];
const NEW_IDS = ["bk_8F3K1A", "bk_9H4L2B", "bk_2J5M3C", "bk_4K6N4D", "bk_6L7P5E", "bk_3M8Q6F"];
const MAX_SENDS = 6;

const METHOD_CASES: MethodCase[] = [
  {
    id: "get",
    label: "GET",
    line: "GET /api/bookings/bk_7Q2M9X",
    body: null,
    safe: true,
    idempotent: true,
    cacheable: true,
    after: () => START,
    code: () => "200 OK",
    lesson: "যতবার খুশি পাঠান, খাতায় একটা অক্ষরও বদলায় না। এটাই Safe। আর যেহেতু কিছু বদলায় না, প্রতিবার একই উত্তর আসে, তাই উত্তরটা জমিয়ে রেখে আবার ব্যবহার করা যায়। এটাই Cacheable।",
  },
  {
    id: "head",
    label: "HEAD",
    line: "HEAD /api/bookings/bk_7Q2M9X",
    body: null,
    safe: true,
    idempotent: true,
    cacheable: true,
    after: () => START,
    code: () => "200 OK, Body ছাড়া",
    lesson: "GET এর মতোই, শুধু উত্তরে Body নেই, Header গুলো আছে। কিছু বদলায় না, তাই Safe।",
  },
  {
    id: "post",
    label: "POST",
    line: "POST /api/bookings",
    body: '{"tour":"saint-martin","guests":2}',
    safe: false,
    idempotent: false,
    cacheable: false,
    after: (n) => [...START, ...NEW_IDS.slice(0, n).map((id) => ({ id, guests: 2 }))],
    code: () => "201 Created",
    lesson: "প্রতিবার পাঠালে একটা নতুন বুকিং। তিনবার চাপলে তিনটা বুকিং, তিনবার টাকা। POST Safe ও নয়, Idempotent ও নয়। তাই উত্তর না এলে POST আবার পাঠানোর আগে ভাবতে হয়।",
  },
  {
    id: "put",
    label: "PUT",
    line: "PUT /api/bookings/bk_7Q2M9X",
    body: '{"tour":"saint-martin","guests":3}',
    safe: false,
    idempotent: true,
    cacheable: false,
    after: (n) => (n === 0 ? START : [{ id: "bk_7Q2M9X", guests: 3 }]),
    code: () => "200 OK",
    lesson: "প্রথমবার খাতা বদলায়, guests ২ থেকে ৩। তারপর যতবারই পাঠান, খাতা ৩ এই থাকে। একবার পাঠানো আর দশবার পাঠানোর ফল এক, এটাই Idempotent। Safe নয়, কারণ প্রথমবার কিছু একটা বদলেছে।",
  },
  {
    id: "patch-set",
    label: "PATCH, মান ৩",
    line: "PATCH /api/bookings/bk_7Q2M9X",
    body: '{"guests":3}',
    safe: false,
    idempotent: false,
    cacheable: false,
    after: (n) => (n === 0 ? START : [{ id: "bk_7Q2M9X", guests: 3 }]),
    code: () => "200 OK",
    lesson: "এই PATCH টা বলছে guests এর মান হবে ৩, তাই এটা বাস্তবে Idempotent আচরণ করছে। কিন্তু HTTP এর নিয়ম PATCH কে Idempotent বলে প্রতিশ্রুতি দেয় না। কারণটা দেখতে পাশের PATCH টা চালান।",
  },
  {
    id: "patch-add",
    label: "PATCH, একজন বেশি",
    line: "PATCH /api/bookings/bk_7Q2M9X",
    body: '{"addGuests":1}',
    safe: false,
    idempotent: false,
    cacheable: false,
    after: (n) => [{ id: "bk_7Q2M9X", guests: 2 + n }],
    code: () => "200 OK",
    lesson: "একই PATCH, কিন্তু এবার বলছে অতিথি একজন বাড়বে। প্রতিবার খাতা বদলায়: ৩, ৪, ৫। কোন PATCH Idempotent হবে সেটা নির্ভর করে Body তে কী লেখা তার উপর, তাই নিয়মটা PATCH কে সেই প্রতিশ্রুতি দেয় না, আর কোনো Proxy নিজে থেকে PATCH আবার পাঠায় না।",
  },
  {
    id: "delete",
    label: "DELETE",
    line: "DELETE /api/bookings/bk_7Q2M9X",
    body: null,
    safe: false,
    idempotent: true,
    cacheable: false,
    after: (n) => (n === 0 ? START : []),
    code: (n) => (n <= 1 ? "204 No Content" : "404 Not Found"),
    lesson: "প্রথমবার বুকিং মুছে যায়, উত্তর 204। দ্বিতীয়বার থেকে উত্তর 404, কারণ মোছার মতো কিছু নেই। উত্তর বদলাল, কিন্তু খাতার অবস্থা একই থাকল: বুকিং নেই। Idempotent কথাটা Server এর অবস্থা নিয়ে, উত্তর নিয়ে নয়।",
  },
];

export function SendTwiceLab() {
  const reduce = useReducedMotion();
  const [caseId, setCaseId] = useState(METHOD_CASES[0].id);
  const [sends, setSends] = useState(0);

  const cur = METHOD_CASES.find((c) => c.id === caseId) ?? METHOD_CASES[0];
  const ledger = cur.after(sends);
  const full = sends >= MAX_SENDS;

  return (
    <Panel
      label="Interactive"
      title="একই Request বারবার পাঠান, খাতাটা দেখুন"
      footer="উপরে একটা Method বেছে নিন, তারপর পাঠান বোতামটা কয়েকবার চাপুন। ডান দিকে Server এর বুকিং খাতা। প্রতিটা Method এর জন্য খেয়াল করুন, প্রথম চাপে খাতা বদলায় কি না, আর দ্বিতীয় চাপ থেকে আবার বদলায় কি না। প্রথম প্রশ্নের উত্তর না হলে Method টা Safe। দ্বিতীয় প্রশ্নের উত্তর না হলে Method টা Idempotent। এই দুইটা প্রশ্নই পুরো লেসনের চাবি, কারণ উত্তর না এলে কোন Request আবার পাঠানো নিরাপদ, তা এখান থেকেই ঠিক হয়।"
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {METHOD_CASES.map((c) => (
          <Chip
            key={c.id}
            active={caseId === c.id}
            onClick={() => {
              setCaseId(c.id);
              setSends(0);
            }}
            data-method={c.id}
          >
            {c.label}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="border border-border bg-background px-4 py-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            ফোন যা পাঠায়
          </div>
          <div className="font-mono text-[0.8125rem] font-bold text-primary break-all">{cur.line}</div>
          <div className="font-mono text-[0.75rem] text-muted-foreground break-all mt-1 min-h-[1.25rem]">
            {cur.body ?? "Body নেই"}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button
              onClick={() => setSends((s) => Math.min(MAX_SENDS, s + 1))}
              disabled={full}
              data-action="send"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
                full
                  ? "border-border text-muted-foreground/40"
                  : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
              )}
            >
              পাঠান <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setSends(0)}
              aria-label="Reset"
              className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <span className="font-mono text-[0.625rem] text-muted-foreground" data-sends={sends}>
              পাঠানো হয়েছে {toBn(sends)} বার
            </span>
          </div>
          <div className="mt-3 font-mono text-[0.75rem]" data-code={sends === 0 ? "" : cur.code(sends)}>
            <span className="text-muted-foreground">শেষ উত্তর: </span>
            <span className="font-bold text-foreground">{sends === 0 ? "এখনো কিছু পাঠানো হয়নি" : cur.code(sends)}</span>
          </div>
        </div>

        <div className="border border-border bg-background px-4 py-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Server এর বুকিং খাতা
          </div>
          {ledger.length === 0 ? (
            <div className="text-[0.8125rem] text-muted-foreground py-1">খাতা খালি, কোনো বুকিং নেই</div>
          ) : (
            <ul className="space-y-1" data-ledger={ledger.length}>
              {ledger.map((b) => {
                const changed = !START.some((s) => s.id === b.id && s.guests === b.guests);
                return (
                  <li
                    key={b.id}
                    className={cn(
                      "flex items-center justify-between border px-2.5 py-1 font-mono text-[0.75rem] transition-colors",
                      changed ? "border-primary/60 bg-primary/5 text-primary" : "border-border text-foreground",
                    )}
                  >
                    <span>{b.id}</span>
                    <span>guests: {b.guests}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge on={cur.safe}>Safe</Badge>
        <Badge on={cur.idempotent}>Idempotent</Badge>
        <Badge on={cur.cacheable}>Cacheable</Badge>
      </div>

      <motion.p
        key={`${cur.id}-${sends >= 2 ? "seen" : "fresh"}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
      >
        {sends < 2 ? "অন্তত দুইবার পাঠান, তারপর এখানে ব্যাখ্যাটা আসবে।" : cur.lesson}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. পাঁচ রকম Redirect, Browser এর দ্বিতীয় Request টা কেমন হয়                  */
/* ------------------------------------------------------------------------- */

type RedirectCode = "301" | "302" | "303" | "307" | "308";

const REDIRECTS: Record<
  RedirectCode,
  { name: string; permanent: boolean; keepsMethod: boolean; use: string; note: string }
> = {
  "301": {
    name: "Moved Permanently",
    permanent: true,
    keepsMethod: false,
    use: "একটা পাতা চিরদিনের জন্য নতুন ঠিকানায় গেছে। www থেকে মূল Domain এ পাঠানো।",
    note: "নিয়মের কাগজে লেখা ছিল Method বদলাবে না। কিন্তু পুরনো Browser গুলো POST কে GET বানিয়ে ফেলত, আর এখনো সবাই তাই করে। তাই 301 নিরাপদ শুধু GET পাতার জন্য।",
  },
  "302": {
    name: "Found",
    permanent: false,
    keepsMethod: false,
    use: "কিছুক্ষণের জন্য অন্য জায়গায়। Login না থাকলে /login এ পাঠানো।",
    note: "301 এর মতোই ইতিহাস। কাগজে Method রাখার কথা, বাস্তবে Browser আর curl দুইজনই POST কে GET বানায়। পরের দুইটা Code ঠিক এই গোলমাল মেটাতে এসেছে।",
  },
  "303": {
    name: "See Other",
    permanent: false,
    keepsMethod: false,
    use: "Form জমা দেওয়ার পর নিশ্চিতকরণের পাতায় পাঠানো। Post, Redirect, Get।",
    note: "এখানে Method বদলানোটাই উদ্দেশ্য। Server বলছে কাজ হয়ে গেছে, ফলাফল দেখতে এই ঠিকানায় GET করুন। এরপর পর্যটক Refresh চাপলে শুধু সেই GET টাই আবার যায়, বুকিং আবার হয় না।",
  },
  "307": {
    name: "Temporary Redirect",
    permanent: false,
    keepsMethod: true,
    use: "API কিছুক্ষণের জন্য অন্য ঠিকানায়, আর POST কে POST ই থাকতে হবে।",
    note: "302 এর কড়া রূপ। Method আর Body দুইটাই হুবহু নতুন ঠিকানায় যায়। Chrome এ HSTS এর কারণে http থেকে https এ যাওয়াটা DevTools এ 307 Internal Redirect নামে দেখায়, সেটা লেসন ০৭ এ।",
  },
  "308": {
    name: "Permanent Redirect",
    permanent: true,
    keepsMethod: true,
    use: "API চিরদিনের জন্য সরল, অথবা http থেকে https এ পাঠানো। Caddy নিজে থেকে এটাই দেয়।",
    note: "301 এর কড়া রূপ। চিরদিনের, আর Method ও Body দুইটাই থাকে। POST /api/bookings কে http থেকে https এ পাঠালে 308 এ বুকিং টা হারায় না।",
  },
};

export function RedirectLab() {
  const reduce = useReducedMotion();
  const [code, setCode] = useState<RedirectCode>("301");
  const [first, setFirst] = useState<"get" | "post">("post");

  const r = REDIRECTS[code];
  const secondMethod = first === "get" ? "GET" : r.keepsMethod ? "POST" : "GET";
  const bodyKept = first === "post" && r.keepsMethod;

  return (
    <Panel
      label="Interactive"
      title="Redirect এর পরে Browser কী পাঠায়"
      footer="প্রথমে বেছে নিন Browser প্রথমবার কী পাঠাচ্ছে, একটা সাধারণ পাতা দেখা নাকি একটা বুকিং এর Form জমা দেওয়া। তারপর Server এর উত্তর হিসেবে পাঁচটা Redirect এর একটা বেছে নিন। ডান দিকের বাক্সটা Browser এর দ্বিতীয় Request। খেয়াল করুন, GET দিয়ে শুরু করলে পাঁচটা Code এ তফাত শুধু চিরদিনের নাকি কিছুক্ষণের। আসল তফাতটা বোঝা যায় POST দিয়ে শুরু করলে।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1 w-full sm:w-40">
          প্রথম Request
        </span>
        <Chip active={first === "get"} onClick={() => setFirst("get")} data-first="get">
          GET /tours/saint-martin
        </Chip>
        <Chip active={first === "post"} onClick={() => setFirst("post")} data-first="post">
          POST /bookings, Body সহ
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1 w-full sm:w-40">
          Server এর উত্তর
        </span>
        {(Object.keys(REDIRECTS) as RedirectCode[]).map((c) => (
          <Chip key={c} active={code === c} onClick={() => setCode(c)} data-code={c}>
            {c}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-stretch mb-5">
        <div className="border border-border bg-background px-3 py-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">১. Browser</div>
          <div className="font-mono text-[0.8125rem] font-bold text-foreground">{first === "get" ? "GET" : "POST"}</div>
          <div className="font-mono text-[0.6875rem] text-muted-foreground break-all">
            {first === "get" ? "/tours/saint-martin" : "/bookings"}
          </div>
          <div className="font-mono text-[0.6875rem] text-muted-foreground mt-1">
            {first === "get" ? "Body নেই" : "guests=2"}
          </div>
        </div>
        <div className="hidden sm:flex items-center text-primary">
          <ArrowRight className="w-4 h-4" />
        </div>
        <div className="border border-primary/60 bg-primary/5 px-3 py-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">২. Server</div>
          <div className="font-mono text-[0.8125rem] font-bold text-primary">
            {code} {r.name}
          </div>
          <div className="font-mono text-[0.6875rem] text-muted-foreground break-all">Location: /new-place</div>
          <div className="text-[0.6875rem] text-muted-foreground mt-1">{r.permanent ? "চিরদিনের, Browser মনে রাখে" : "কিছুক্ষণের, মনে রাখে না"}</div>
        </div>
        <div className="hidden sm:flex items-center text-primary">
          <ArrowRight className="w-4 h-4" />
        </div>
        <div
          className={cn(
            "border px-3 py-3 transition-colors",
            first === "post" && !bodyKept ? "border-destructive/60 bg-destructive/5" : "border-border bg-background",
          )}
          data-second={secondMethod}
          data-body={bodyKept ? "kept" : "dropped"}
        >
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">৩. Browser আবার</div>
          <div className="font-mono text-[0.8125rem] font-bold text-foreground">{secondMethod}</div>
          <div className="font-mono text-[0.6875rem] text-muted-foreground">/new-place</div>
          <div className="font-mono text-[0.6875rem] mt-1 text-muted-foreground">
            {first === "get" ? "Body নেই" : bodyKept ? "guests=2, Body রইল" : "Body হারিয়ে গেল"}
          </div>
        </div>
      </div>

      <motion.div
        key={`${code}-${first}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="space-y-2"
      >
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-bold">কখন ব্যবহার করবেন: </span>
          {r.use}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{r.note}</p>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. পরিস্থিতি দেখে Code বেছে নিন                                             */
/* ------------------------------------------------------------------------- */

const SITUATIONS: { text: string; options: string[]; answer: string; why: string }[] = [
  {
    text: "Saint Martin এর শেষ আসনটা এক সেকেন্ড আগে আরেকজন নিয়ে নিয়েছেন। এখন দ্বিতীয় পর্যটকের বুকিং এসে পৌঁছাল।",
    options: ["400", "409", "422", "500"],
    answer: "409",
    why: "Request এ কোনো ভুল নেই, Server এর এখনকার অবস্থার সাথে সংঘর্ষ। 409 Conflict। উত্তরের Body তে বলে দিন আসন বাকি নেই, যাতে App অন্য তারিখ দেখাতে পারে।",
  },
  {
    text: "App এর একটা Bug এ JSON এর মাঝখান থেকে একটা কমা বাদ পড়েছে। Server Body টা পড়তেই পারছে না।",
    options: ["400", "415", "422", "500"],
    answer: "400",
    why: "Request টার গঠনই ভাঙা, Server বুঝতেই পারছে না কী লেখা। এটা 400 Bad Request। 500 নয়, কারণ দোষ Server এর নয়।",
  },
  {
    text: "JSON একদম ঠিক আছে, কিন্তু তাতে লেখা guests: -2।",
    options: ["400", "403", "409", "422"],
    answer: "422",
    why: "Server Body টা পড়তে পেরেছে, কিন্তু মানটা অর্থহীন। 422 Unprocessable Content। অনেক দল এখানেও 400 দেয়, সেটাও চলে, তবে একটা নিয়ম বেছে সব জায়গায় সেটাই মানুন।",
  },
  {
    text: "কেউ Login না করেই POST /api/bookings পাঠালেন। কোনো Token নেই।",
    options: ["400", "401", "403", "404"],
    answer: "401",
    why: "Server জানে না আপনি কে। 401 Unauthorized, নামটা বিভ্রান্তিকর হলেও মানে হলো পরিচয় দিন। সাথে WWW-Authenticate Header পাঠানো বাধ্যতামূলক।",
  },
  {
    text: "usr_77 Login করা আছেন, কিন্তু usr_42 এর বুকিং bk_7Q2M9X খুলতে চাইছেন।",
    options: ["401", "403", "404", "409"],
    answer: "403",
    why: "Server জানে আপনি কে, আর জানে আপনার অনুমতি নেই। আবার Login করলেও লাভ নেই, তাই 403 Forbidden। বুকিং টা আছে কি না সেটাই গোপন রাখতে চাইলে অনেক Server এখানে 404 দেয়, GitHub এর Private Repository র মতো।",
  },
  {
    text: "কেউ DELETE /api/tours পাঠালেন। ঠিকানাটা আছে, কিন্তু সব Tour মুছে ফেলার কোনো ব্যবস্থা নেই।",
    options: ["403", "404", "405", "501"],
    answer: "405",
    why: "ঠিকানা আছে, এই Method টা এখানে চলে না। 405 Method Not Allowed, আর সাথে Allow Header এ লিখতে হয় কোন Method গুলো চলে, যেমন GET, HEAD।",
  },
  {
    text: "App টা JSON এর বদলে Form এর ভাষায় Body পাঠিয়েছে: tour=saint-martin&guests=1।",
    options: ["400", "406", "415", "422"],
    answer: "415",
    why: "Body টা Server এর অচেনা ধরনে লেখা। 415 Unsupported Media Type। Content-Type ঠিক করে পাঠালেই কাজ হবে, Header এর বিস্তারিত লেসন ০৪ এ।",
  },
  {
    text: "পর্যটক ২০ MB এর একটা ছবি Upload করছেন, অথচ সীমা ৫ MB।",
    options: ["400", "413", "422", "507"],
    answer: "413",
    why: "Body টা বেশি বড়। 413 Content Too Large। এই Code টা অনেক সময় App নয়, সামনের Proxy নিজেই দেয়, কারণ Proxy র নিজের একটা সীমা আছে।",
  },
  {
    text: "এক মিনিটে একই Account এ ষষ্ঠবার ভুল Password দিয়ে Login এর চেষ্টা।",
    options: ["401", "403", "423", "429"],
    answer: "429",
    why: "অনেক বেশি Request। 429 Too Many Requests, সাথে Retry-After এ লিখে দিন কত সেকেন্ড পরে আবার চেষ্টা করা যাবে।",
  },
  {
    text: "বুকিং হয়ে গেছে। Ticket এর PDF বানিয়ে Email করতে কয়েক সেকেন্ড লাগবে, কাজটা Queue তে রাখা হলো, শেষ হওয়ার আগেই উত্তর দিতে হবে।",
    options: ["200", "201", "202", "204"],
    answer: "202",
    why: "Request গ্রহণ করা হয়েছে, কাজ এখনো শেষ হয়নি। 202 Accepted। উত্তরে একটা ঠিকানা দিন যেখানে পরে অবস্থা দেখা যাবে।",
  },
  {
    text: "গত বছরের একটা বাতিল বুকিং ইচ্ছা করে মুছে ফেলা হয়েছে। কেউ পুরনো Link খুললেন।",
    options: ["301", "400", "404", "410"],
    answer: "410",
    why: "জিনিসটা এখানে ছিল, ইচ্ছা করে সরানো হয়েছে, আর কখনো ফিরবে না। 410 Gone। 404 দিলেও ভুল নয়, কিন্তু 410 বেশি স্পষ্ট খবর দেয়।",
  },
  {
    text: "Port 3000 এর App টা Crash করেছে। Caddy Request টা পৌঁছাতে চেষ্টা করে Connection Refused পেল।",
    options: ["500", "502", "503", "504"],
    answer: "502",
    why: "এই Code App লেখেনি, App তো বন্ধ। লিখেছে Caddy: পেছনের জনের কাছ থেকে ঠিকঠাক উত্তর পাইনি। 502 Bad Gateway।",
  },
];

export function StatusDecisionLab() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, seen: 0 });

  const cur = SITUATIONS[index];
  const correct = picked === cur.answer;

  return (
    <Panel
      label="Interactive"
      title="পরিস্থিতি দেখে Code বেছে নিন"
      footer="প্রতিটা পরিস্থিতি পড়ে নিজেকে তিনটা প্রশ্ন করুন। এক, দোষটা কার, Request এর নাকি Server এর? দুই, Server কি Request টা পড়তে পেরেছিল? তিন, একই জিনিস আবার পাঠালে কি অন্য ফল আসতে পারে? এই তিনটা প্রশ্নের উত্তরই বারোটার মধ্যে প্রায় সবগুলো ঠিক Code এ পৌঁছে দেয়। একবার উত্তর দিলে ব্যাখ্যা আসবে, তারপর পরেরটায় যান।"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <span className="font-mono text-[0.625rem] text-muted-foreground">
          পরিস্থিতি {toBn(index + 1)} / {toBn(SITUATIONS.length)}
        </span>
        <span className="font-mono text-[0.625rem] text-muted-foreground" data-score={score.right}>
          ঠিক হয়েছে {toBn(score.right)} / {toBn(score.seen)}
        </span>
      </div>

      <p className="text-[0.9375rem] leading-relaxed text-foreground mb-5" data-situation={index}>
        {cur.text}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {cur.options.map((o) => {
          const state = picked === null ? "idle" : o === cur.answer ? "answer" : o === picked ? "wrong" : "idle";
          return (
            <button
              key={o}
              disabled={picked !== null}
              onClick={() => {
                setPicked(o);
                setScore((s) => ({ right: s.right + (o === cur.answer ? 1 : 0), seen: s.seen + 1 }));
              }}
              data-option={o}
              className={cn(
                "min-w-16 px-4 py-2 border font-mono text-[0.875rem] font-bold transition-colors",
                state === "answer" && "border-primary bg-primary/15 text-primary",
                state === "wrong" && "border-destructive/60 bg-destructive/10 text-destructive",
                state === "idle" &&
                  (picked === null
                    ? "border-border text-foreground hover:border-primary/50"
                    : "border-border text-muted-foreground/50"),
              )}
            >
              {o}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <motion.div
          key={`${index}-${picked}`}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={cn("border px-4 py-3 mb-4", correct ? "border-primary/50 bg-primary/5" : "border-border bg-background")}
          data-result={correct ? "right" : "wrong"}
        >
          <div className="text-[0.75rem] font-bold mb-1 text-foreground">
            {correct ? "ঠিক।" : `সঠিক উত্তর ${cur.answer}।`}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{cur.why}</p>
        </motion.div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setIndex((i) => (i + 1) % SITUATIONS.length);
            setPicked(null);
          }}
          disabled={picked === null}
          data-action="next"
          className={cn(
            "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            picked === null
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          পরের পরিস্থিতি
        </button>
        <button
          onClick={() => {
            setIndex(0);
            setPicked(null);
            setScore({ right: 0, seen: 0 });
          }}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. আবার পাঠাবেন কি না                                                      */
/* ------------------------------------------------------------------------- */

type RetryMethod = "get" | "put" | "delete" | "post" | "post-key";
type Outcome = "timeout" | "reset" | "429" | "503" | "502" | "504" | "500" | "400" | "409" | "422";
type Verdict = "yes" | "wait" | "check" | "no";

const RETRY_METHODS: { id: RetryMethod; label: string; idempotent: boolean }[] = [
  { id: "get", label: "GET", idempotent: true },
  { id: "put", label: "PUT", idempotent: true },
  { id: "delete", label: "DELETE", idempotent: true },
  { id: "post", label: "POST, Key ছাড়া", idempotent: false },
  { id: "post-key", label: "POST, Idempotency-Key সহ", idempotent: true },
];

const OUTCOMES: { id: Outcome; label: string }[] = [
  { id: "timeout", label: "কোনো উত্তরই এলো না" },
  { id: "reset", label: "ECONNRESET" },
  { id: "502", label: "502" },
  { id: "504", label: "504" },
  { id: "500", label: "500" },
  { id: "503", label: "503 + Retry-After" },
  { id: "429", label: "429 + Retry-After" },
  { id: "400", label: "400" },
  { id: "409", label: "409" },
  { id: "422", label: "422" },
];

const VERDICT_TEXT: Record<Verdict, string> = {
  yes: "আবার পাঠান, একটু দেরি করে",
  wait: "অপেক্ষা করে আবার পাঠান",
  check: "আগে খোঁজ নিন, তারপর সিদ্ধান্ত",
  no: "হুবহু আবার পাঠাবেন না",
};

/** The retry rule of this lesson as one pure function: method plus what came back. */
function decideRetry(method: RetryMethod, outcome: Outcome): { verdict: Verdict; why: string } {
  const safeToRepeat = RETRY_METHODS.find((m) => m.id === method)?.idempotent ?? false;
  if (outcome === "400" || outcome === "422") {
    return { verdict: "no", why: "দোষ Request এর। হুবহু আবার পাঠালে হুবহু একই উত্তর আসবে। আগে Request টা ঠিক করুন, ব্যবহারকারীকে ভুলটা দেখান।" };
  }
  if (outcome === "409") {
    return { verdict: "no", why: "Server এর এখনকার অবস্থার সাথে সংঘর্ষ, যেমন আসন আর নেই। আবার পাঠালে লাভ নেই। নতুন অবস্থাটা GET করে আনুন, তারপর ব্যবহারকারী ঠিক করবেন কী করবেন।" };
  }
  if (outcome === "429" || outcome === "503") {
    return {
      verdict: "wait",
      why: "Server নিজেই বলছে এখন পারব না, এতক্ষণ পরে আসুন। এই দুইটা উত্তরে Server সাধারণত কাজ শুরুই করেনি, তাই Retry-After এ লেখা সময় পার করে আবার পাঠানো চলে। তার আগে বারবার পাঠালে ভিড় শুধু বাড়ে।",
    };
  }
  // বাকিগুলো: উত্তর এলো না, Connection ভাঙল, বা মাঝের কেউ 502, 504, অথবা 500।
  if (safeToRepeat) {
    return {
      verdict: "yes",
      why:
        method === "post-key"
          ? "কাজটা হয়েছিল কি না জানেন না, কিন্তু Key টা আছে। একই Key দিয়ে আবার পাঠান। কাজ হয়ে থাকলে Server আগের উত্তরটাই দেবে, না হয়ে থাকলে এবার করবে। প্রতিবার একটু বেশি অপেক্ষা করুন, আর কয়েকবারের পর থামুন।"
          : "এই Method টা Idempotent, তাই আগের চেষ্টা Server এ পৌঁছে থাকলেও আবার পাঠালে ক্ষতি নেই। একটু অপেক্ষা করে আবার পাঠান, প্রতিবার অপেক্ষা একটু বাড়িয়ে, আর কয়েকবারের পর থামুন।",
    };
  }
  return {
    verdict: "check",
    why:
      outcome === "504" || outcome === "timeout"
        ? "সবচেয়ে বিপজ্জনক অবস্থা। উত্তর আসেনি মানে কাজ হয়নি, এমন নয়। App হয়তো এখনো কাজ করছে, হয়তো বুকিং হয়েও গেছে। আবার পাঠালে দুইটা বুকিং হতে পারে। আগে খোঁজ নিন, যেমন GET /api/bookings দিয়ে দেখুন বুকিং টা তৈরি হয়েছে কি না।"
        : "Request টা Server এ পৌঁছে কাজ শুরু করেছিল কি না জানা নেই। POST Idempotent নয়, তাই অন্ধভাবে আবার পাঠালে দ্বিগুণ কাজ হতে পারে। আগে খোঁজ নিন। আর ভবিষ্যতের জন্য এই Request এ Idempotency-Key যোগ করুন।",
  };
}

export function RetryDecisionLab() {
  const reduce = useReducedMotion();
  const [method, setMethod] = useState<RetryMethod>("post");
  const [outcome, setOutcome] = useState<Outcome>("504");
  const { verdict, why } = decideRetry(method, outcome);

  return (
    <Panel
      label="Interactive"
      title="উত্তর এলো না, বা ভুল এলো: আবার পাঠাবেন?"
      footer="বাঁ দিকের সারিতে Method, নিচের সারিতে কী ফেরত এলো। প্রতিটা জোড়ার জন্য সিদ্ধান্ত বদলায়। প্রথমে Method টা POST, Key ছাড়া রেখে সবগুলো ফলাফল একবার ঘুরে দেখুন। তারপর Method টা GET করে একই কাজ করুন। শেষে POST, Idempotency-Key সহ বেছে নিন, দেখবেন বিপজ্জনক লাল সিদ্ধান্তগুলো কীভাবে নিরাপদ হয়ে যায়। Key এর পুরো কাজটাই এটুকু।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1 w-full sm:w-28">
          Method
        </span>
        {RETRY_METHODS.map((m) => (
          <Chip key={m.id} active={method === m.id} onClick={() => setMethod(m.id)} data-retry-method={m.id}>
            {m.label}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1 w-full sm:w-28">
          যা এলো
        </span>
        {OUTCOMES.map((o) => (
          <Chip key={o.id} active={outcome === o.id} onClick={() => setOutcome(o.id)} data-outcome={o.id}>
            {o.label}
          </Chip>
        ))}
      </div>

      <motion.div
        key={`${method}-${outcome}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={cn(
          "border px-4 py-3",
          verdict === "check" && "border-destructive/60 bg-destructive/5",
          verdict === "no" && "border-border bg-background",
          (verdict === "yes" || verdict === "wait") && "border-primary/50 bg-primary/5",
        )}
        data-verdict={verdict}
      >
        <div
          className={cn(
            "font-bold text-[0.9375rem] mb-1",
            verdict === "check" ? "text-destructive" : verdict === "no" ? "text-foreground" : "text-primary",
          )}
        >
          {VERDICT_TEXT[verdict]}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{why}</p>
      </motion.div>
    </Panel>
  );
}
