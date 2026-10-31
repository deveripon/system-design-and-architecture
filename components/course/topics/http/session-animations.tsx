"use client";

/**
 * What: The interactive labs for the Session vs JWT lesson: sessions across two
 * servers, checking a JWT step by step, refresh token rotation catching a
 * thief, and a picker that recommends a kind of proof for a real situation.
 *
 * Why: These ideas are about cause and effect (which server held the session,
 * which check failed first, who used a token second). Letting the reader flip
 * the input and watch the result teaches the rule better than stating it.
 * Every visual is derived from state, with no effects, so nothing can drift.
 */
import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Minus, RotateCcw, X } from "lucide-react";
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
      aria-pressed={active}
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

function ActionButton({
  onClick,
  disabled,
  children,
  ...rest
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
} & Record<`data-${string}`, string | number>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      {...rest}
      className={cn(
        "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
        disabled
          ? "border-border text-muted-foreground/40"
          : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. দুইটা Server, Session কোথায় থাকে                                        */
/* ------------------------------------------------------------------------- */

type StoreMode = "memory" | "sticky" | "redis";
type AppName = "A" | "B";

interface ScaleEntry {
  n: number;
  server: AppName;
  kind: "login" | "request" | "restart";
  ok: boolean;
  text: string;
}

interface ScaleState {
  mode: StoreMode;
  nextServer: AppName;
  pinned: AppName | null;
  sessionIn: { A: boolean; B: boolean; redis: boolean };
  loggedIn: boolean;
  counts: { A: number; B: number };
  log: ScaleEntry[];
}

const MODE_INFO: Record<StoreMode, { name: string; note: string }> = {
  memory: { name: "প্রতিটা App এর নিজের Memory", note: "Session থাকে যে App Login সামলেছে, শুধু তার Memory তে" },
  sticky: { name: "Sticky Session", note: "Load Balancer একজন ইউজারকে সবসময় একই App এ পাঠায়" },
  redis: { name: "সবার জন্য একটা Redis", note: "দুইটা App ই একই Redis থেকে Session পড়ে" },
};

function freshScale(mode: StoreMode): ScaleState {
  return {
    mode,
    nextServer: "A",
    pinned: null,
    sessionIn: { A: false, B: false, redis: false },
    loggedIn: false,
    counts: { A: 0, B: 0 },
    log: [],
  };
}

function other(server: AppName): AppName {
  return server === "A" ? "B" : "A";
}

function pickServer(state: ScaleState): AppName {
  if (state.mode === "sticky" && state.pinned) return state.pinned;
  return state.nextServer;
}

function addEntry(state: ScaleState, entry: Omit<ScaleEntry, "n">): ScaleEntry[] {
  const n = (state.log[0]?.n ?? 0) + 1;
  return [{ n, ...entry }, ...state.log].slice(0, 6);
}

function scaleLogin(state: ScaleState): ScaleState {
  const server = pickServer(state);
  const sessionIn =
    state.mode === "redis"
      ? { ...state.sessionIn, redis: true }
      : { ...state.sessionIn, [server]: true };
  const where = state.mode === "redis" ? "Redis এ" : `App ${server} এর Memory তে`;
  return {
    ...state,
    sessionIn,
    loggedIn: true,
    pinned: state.mode === "sticky" ? server : state.pinned,
    nextServer: other(state.nextServer),
    counts: { ...state.counts, [server]: state.counts[server] + 1 },
    log: addEntry(state, { server, kind: "login", ok: true, text: `Login, Session লেখা হলো ${where}` }),
  };
}

function scaleRequest(state: ScaleState): ScaleState {
  const server = pickServer(state);
  const found = state.mode === "redis" ? state.sessionIn.redis : state.sessionIn[server];
  const ok = state.loggedIn && found;
  const text = !state.loggedIn
    ? "401, এখনো Login ই করা হয়নি"
    : ok
      ? state.mode === "redis"
        ? "200, Redis এ Session পাওয়া গেল"
        : `200, App ${server} এর Memory তে Session আছে`
      : `401, App ${server} এই Session চেনে না`;
  return {
    ...state,
    nextServer: other(state.nextServer),
    counts: { ...state.counts, [server]: state.counts[server] + 1 },
    log: addEntry(state, { server, kind: "request", ok, text }),
  };
}

function scaleRestart(state: ScaleState): ScaleState {
  const lost = state.mode !== "redis" && state.sessionIn.A;
  return {
    ...state,
    sessionIn: { ...state.sessionIn, A: false },
    log: addEntry(state, {
      server: "A",
      kind: "restart",
      ok: !lost,
      text:
        state.mode === "redis"
          ? "Deploy এ App A Restart, Session Redis এ, কিছুই হারায়নি"
          : lost
            ? "Deploy এ App A Restart, তার Memory র সব Session মুছে গেল"
            : "Deploy এ App A Restart, এই পর্যটকের Session তার Memory তে ছিল না",
    }),
  };
}

export function SessionScaleLab() {
  const reduce = useReducedMotion();
  const [state, setState] = useState<ScaleState>(() => freshScale("memory"));
  const failures = state.log.filter((e) => !e.ok).length;

  return (
    <Panel
      label="Interactive"
      title="দুইটা App, একটা Load Balancer, Session কোথায়"
      footer="প্রথমে Memory বেছে নিন, Login করুন, তারপর কয়েকবার Request পাঠান। Load Balancer পালা করে A আর B তে পাঠায়, তাই প্রতি দ্বিতীয় Request এ পর্যটক হঠাৎ Logout হয়ে যান। Sticky তে সেটা থামে, কিন্তু Deploy বোতাম চাপলে আবার সবাই বেরিয়ে যান, আর Request গণনায় দেখবেন সব ভার একটা App এর ঘাড়ে। Redis এ কোনো সমস্যাই হয় না, কারণ খাতাটা আর কোনো একটা App এর পকেটে নেই।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          Session রাখা হয়
        </span>
        {(Object.keys(MODE_INFO) as StoreMode[]).map((mode) => (
          <Chip key={mode} active={state.mode === mode} onClick={() => setState(freshScale(mode))} data-mode={mode}>
            {MODE_INFO[mode].name}
          </Chip>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-4">{MODE_INFO[state.mode].note}</p>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <ActionButton onClick={() => setState(scaleLogin)} data-action="login">
          Login
        </ActionButton>
        <ActionButton onClick={() => setState(scaleRequest)} data-action="request">
          পরের Request পাঠান
        </ActionButton>
        <ActionButton onClick={() => setState(scaleRestart)} data-action="restart">
          App A তে Deploy
        </ActionButton>
        <button
          onClick={() => setState(freshScale(state.mode))}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {(["A", "B"] as AppName[]).map((server) => (
          <div
            key={server}
            data-server={server}
            data-has-session={String(state.sessionIn[server])}
            className={cn(
              "border px-4 py-3 transition-colors",
              state.mode !== "redis" && state.sessionIn[server] ? "border-primary/60 bg-primary/5" : "border-border bg-background",
            )}
          >
            <div className="text-[0.6875rem] font-bold text-foreground">App {server}</div>
            <div className="text-[0.625rem] text-muted-foreground mb-2">
              Request এসেছে {toBn(state.counts[server])} টা
            </div>
            <div className="font-mono text-[0.75rem] font-bold text-primary">
              {state.mode === "redis" ? "Memory তে কিছু নেই" : state.sessionIn[server] ? "usr_42 এর Session" : "খালি"}
            </div>
          </div>
        ))}
        <div
          data-server="redis"
          className={cn(
            "border px-4 py-3 transition-colors",
            state.mode === "redis" ? (state.sessionIn.redis ? "border-primary/60 bg-primary/5" : "border-border bg-background") : "border-dashed border-border bg-background opacity-50",
          )}
        >
          <div className="text-[0.6875rem] font-bold text-foreground">Redis</div>
          <div className="text-[0.625rem] text-muted-foreground mb-2">
            {state.mode === "redis" ? "দুই App এরই খাতা" : "এই মোডে ব্যবহার হচ্ছে না"}
          </div>
          <div className="font-mono text-[0.75rem] font-bold text-primary">
            {state.mode === "redis" && state.sessionIn.redis ? "usr_42 এর Session" : "খালি"}
          </div>
        </div>
      </div>

      <div className="space-y-2" data-failures={failures}>
        {state.log.length === 0 && (
          <p className="text-sm text-muted-foreground">এখনো কিছু ঘটেনি। Login দিয়ে শুরু করুন।</p>
        )}
        {state.log.map((entry) => (
          <motion.div
            key={entry.n}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="grid grid-cols-[36px_64px_1fr] items-center gap-3 text-[0.75rem]"
            data-ok={String(entry.ok)}
          >
            <span className="font-mono text-muted-foreground">#{toBn(entry.n)}</span>
            <span className="font-mono font-bold text-foreground">App {entry.server}</span>
            <span className={cn(entry.ok ? "text-muted-foreground" : "text-primary font-bold")}>{entry.text}</span>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা JWT যাচাই, ধাপে ধাপে                                               */
/* ------------------------------------------------------------------------- */

type Attack = "tamper" | "none" | "attackerKey" | "expired" | "partnerAud" | "decodeOnly";

const ATTACKS: { id: Attack; label: string }[] = [
  { id: "tamper", label: "Payload এ role কে admin বানান" },
  { id: "none", label: "Header এ alg কে none বানান" },
  { id: "attackerKey", label: "আক্রমণকারীর নিজের Secret এ সই" },
  { id: "expired", label: "ঘড়ি ২০ মিনিট এগিয়ে দিন" },
  { id: "partnerAud", label: "Partner App এর জন্য বানানো Token দিন" },
  { id: "decodeOnly", label: "Server শুধু decode করে, verify নয়" },
];

type CheckResult = "pass" | "fail" | "skip";

const CHECKS = [
  { id: "parts", label: "তিনটা অংশ, বিন্দু দিয়ে ভাগ" },
  { id: "alg", label: "alg ঠিক HS256, যা Server আগে থেকে ঠিক করে রেখেছে" },
  { id: "signature", label: "নিজের Secret দিয়ে Signature আবার হিসাব করে মেলে" },
  { id: "exp", label: "exp পার হয়নি, ৩০ সেকেন্ডের ছাড় সহ" },
  { id: "iss", label: "iss হলো https://api.islandtours.example" },
  { id: "aud", label: "aud হলো islandtours-mobile" },
] as const;

type CheckId = (typeof CHECKS)[number]["id"];

function failingCheck(attacks: Set<Attack>): CheckId | null {
  if (attacks.has("none")) return "alg";
  if (attacks.has("tamper") || attacks.has("attackerKey")) return "signature";
  if (attacks.has("expired")) return "exp";
  if (attacks.has("partnerAud")) return "aud";
  return null;
}

export function JwtVerifyLab() {
  const [attacks, setAttacks] = useState<Set<Attack>>(() => new Set());

  const toggle = (id: Attack) =>
    setAttacks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const decodeOnly = attacks.has("decodeOnly");
  const failAt = failingCheck(attacks);
  const failIndex = failAt ? CHECKS.findIndex((c) => c.id === failAt) : -1;
  const results: CheckResult[] = CHECKS.map((_, i) => {
    if (decodeOnly) return "skip";
    if (failIndex === -1 || i < failIndex) return "pass";
    return i === failIndex ? "fail" : "skip";
  });
  const accepted = decodeOnly || failIndex === -1;
  const forged = attacks.has("tamper") || attacks.has("none") || attacks.has("attackerKey");
  // decode ছাড়া অন্য কোনো বোতামও চাপা মানে একটা নষ্ট Token বিনা পরীক্ষায় ঢুকছে
  const bypassed = decodeOnly && attacks.size > 1;
  const role = forged ? "admin" : "customer";
  const aud = attacks.has("partnerAud") ? "islandtours-partner" : "islandtours-mobile";
  const alg = attacks.has("none") ? "none" : "HS256";
  const signature = attacks.has("none")
    ? "(খালি)"
    : attacks.has("attackerKey")
      ? "kQ81vZ...(অন্য Secret)"
      : "X1eYLY...(আসল)";

  return (
    <Panel
      label="Interactive"
      title="Server একটা JWT কীভাবে যাচাই করে"
      footer="উপরের বোতামগুলো এক বা একাধিক চেপে Token টা নষ্ট করুন, আর দেখুন কোন পরীক্ষায় এসে আটকায়। যাচাই থেমে যায় প্রথম ব্যর্থতাতেই, তার পরের ধাপ আর দেখা হয় না। শেষ বোতামটা সবচেয়ে শিক্ষণীয়: Server যদি Token শুধু decode করে, মানে খুলে পড়ে কিন্তু সই যাচাই না করে, তাহলে যেকোনো জাল Token পাস হয়ে যায়। আসল হিসাবটা হয় এই লেসনের Lab ৪ এ, এখানে শুধু তার ফলাফলটা সাজিয়ে দেখানো।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {ATTACKS.map((a) => (
          <Chip key={a.id} active={attacks.has(a.id)} onClick={() => toggle(a.id)} data-attack={a.id}>
            {a.label}
          </Chip>
        ))}
        <button
          onClick={() => setAttacks(new Set())}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 font-mono text-[0.6875rem]">
        <div className="border border-border bg-background px-3 py-2">
          <div className="text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">Header</div>
          <div data-alg={alg}>
            {"{"}&quot;alg&quot;:&quot;<span className={cn(attacks.has("none") && "text-primary font-bold")}>{alg}</span>&quot;,&quot;typ&quot;:&quot;JWT&quot;{"}"}
          </div>
        </div>
        <div className="border border-border bg-background px-3 py-2">
          <div className="text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">Payload</div>
          <div>&quot;sub&quot;:&quot;usr_42&quot;</div>
          <div>
            &quot;role&quot;:&quot;<span className={cn(forged && "text-primary font-bold")}>{role}</span>&quot;
          </div>
          <div>
            &quot;aud&quot;:&quot;<span className={cn(attacks.has("partnerAud") && "text-primary font-bold")}>{aud}</span>&quot;
          </div>
          <div className={cn(attacks.has("expired") && "text-primary font-bold")}>
            &quot;exp&quot;: {attacks.has("expired") ? "২০ মিনিট আগে পার হয়েছে" : "১৫ মিনিট বাকি"}
          </div>
        </div>
        <div className="border border-border bg-background px-3 py-2">
          <div className="text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">Signature</div>
          <div className={cn((attacks.has("none") || attacks.has("attackerKey")) && "text-primary font-bold")}>{signature}</div>
        </div>
      </div>

      <ol className="space-y-2 mb-6">
        {CHECKS.map((check, i) => {
          const result = results[i];
          return (
            <li key={check.id} className="flex items-center gap-3 text-[0.8125rem]" data-check={check.id} data-result={result}>
              <span
                className={cn(
                  "inline-flex items-center justify-center w-6 h-6 border shrink-0",
                  result === "pass" && "border-primary/60 text-primary",
                  result === "fail" && "border-primary bg-primary/15 text-primary",
                  result === "skip" && "border-border text-muted-foreground/50",
                )}
              >
                {result === "pass" ? <Check className="w-3.5 h-3.5" /> : result === "fail" ? <X className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              </span>
              <span className={cn(result === "skip" ? "text-muted-foreground/60" : "text-foreground", result === "fail" && "font-bold")}>
                {toBn(i + 1)}. {check.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div
        data-verdict={accepted ? "accepted" : "rejected"}
        className={cn(
          "border px-4 py-3 text-sm leading-relaxed",
          bypassed ? "border-primary bg-primary/10 text-primary font-bold" : "border-border bg-background text-foreground",
        )}
      >
        {decodeOnly
          ? bypassed
            ? "গ্রহণ করা হলো, আর এটাই বিপদ। কোনো পরীক্ষাই হয়নি, তাই জাল বা মেয়াদোত্তীর্ণ Token ও ভেতরে ঢুকে গেল।"
            : "গ্রহণ করা হলো, কিন্তু ভাগ্যের জোরে। এবারের Token আসল ছিল, তবে Server সেটা যাচাই করেনি, তাই জাল এলেও একইভাবে মেনে নিত।"
          : accepted
            ? "গ্রহণ করা হলো। ছয়টা পরীক্ষাই পাস, এই Request টা usr_42 এর, ভূমিকা customer।"
            : `বাতিল, 401। ${toBn(failIndex + 1)} নম্বর পরীক্ষায় আটকে গেছে, তার পরের ধাপ আর দেখা হয়নি।`}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Refresh Token Rotation, চোর ধরা                                         */
/* ------------------------------------------------------------------------- */

type Order = "app-first" | "thief-first";
type TokenStatus = "active" | "used" | "revoked" | "none";

interface RotationStep {
  actor: string;
  text: string;
  tokens: { r1: TokenStatus; r2: TokenStatus; r3: TokenStatus };
  verdict: string;
}

function rotationSteps(order: Order): RotationStep[] {
  const first = order === "app-first" ? "পর্যটকের App" : "চোর";
  const second = order === "app-first" ? "চোর" : "পর্যটকের App";
  return [
    {
      actor: "Login",
      text: "পর্যটক Password দিয়ে Login করলেন। Server একটা Refresh Token R1 দিল আর নিজের খাতায় তার Hash লিখে রাখল। ধরা যাক কোনোভাবে R1 এর একটা কপি একজন চোরের হাতেও পৌঁছে গেছে।",
      tokens: { r1: "active", r2: "none", r3: "none" },
      verdict: "পরিবার ঠিক আছে",
    },
    {
      actor: first,
      text: `${first} আগে R1 দেখিয়ে নতুন Access Token চাইল। R1 এখনো ব্যবহার হয়নি, তাই Server খুশি মনে নতুন Access Token আর নতুন Refresh Token R2 দিল, আর R1 কে খাতায় ব্যবহৃত বলে দাগ দিল।`,
      tokens: { r1: "used", r2: "active", r3: "none" },
      verdict: "পরিবার ঠিক আছে",
    },
    {
      actor: second,
      text: `এবার ${second} সেই একই R1 দেখাল। কিন্তু R1 তো আগেই একবার ব্যবহার হয়ে গেছে। একটা Refresh Token দুইবার আসার একটাই ব্যাখ্যা: কেউ একটা কপি রেখেছে। Server জানে না কে আসল আর কে চোর, তাই নিরাপদ সিদ্ধান্ত নিল: এই Login থেকে জন্মানো পুরো পরিবার বাতিল।`,
      tokens: { r1: "revoked", r2: "revoked", r3: "none" },
      verdict: "Reuse ধরা পড়েছে, পুরো পরিবার বাতিল",
    },
    {
      actor: first,
      text: `${first} এবার নিজের হাতের R2 দেখাল। R2 ও বাতিল পরিবারের সদস্য, তাই 401। চোর যদি আগে এসে থাকে, তার চুরি করা R2 এখন অচল। আর তার হাতে থাকা শেষ Access Token টা বড়জোর ১৫ মিনিটে মরে যাবে।`,
      tokens: { r1: "revoked", r2: "revoked", r3: "none" },
      verdict: "দুইজনই বাইরে",
    },
    {
      actor: "পর্যটক আবার Login",
      text: "পর্যটককে আবার Password দিয়ে Login করতে হলো। একটু অসুবিধা, কিন্তু Password চোরের কাছে নেই, তাই নতুন পরিবারের R3 শুধু পর্যটকের হাতে। চোর এখানেই আটকে গেল।",
      tokens: { r1: "revoked", r2: "revoked", r3: "active" },
      verdict: "নতুন পরিবার, শুধু আসল মানুষের হাতে",
    },
  ];
}

const STATUS_TEXT: Record<TokenStatus, string> = {
  active: "চালু",
  used: "ব্যবহৃত",
  revoked: "বাতিল",
  none: "এখনো নেই",
};

export function RefreshRotationLab() {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState<Order>("app-first");
  const [step, setStep] = useState(0);
  const steps = rotationSteps(order);
  const cur = steps[step];
  const last = step === steps.length - 1;

  return (
    <Panel
      label="Interactive"
      title="একটা চুরি যাওয়া Refresh Token কীভাবে ধরা পড়ে"
      footer="প্রথমে পর্যটকের App আগে আসুক এভাবে চালান, তারপর চোর আগে আসুক এভাবে। দুইবারেই ফল এক: যে দ্বিতীয়বার R1 দেখায়, তার হাতেই ধরা পড়ে যে একটা কপি আছে, আর Server পুরো পরিবার বাতিল করে দেয়। Rotation ছাড়া চোর নিঃশব্দে ৩০ দিন ধরে নতুন Access Token নিতে থাকত, কেউ টেরও পেত না।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          R1 আগে দেখাচ্ছে
        </span>
        <Chip active={order === "app-first"} onClick={() => { setOrder("app-first"); setStep(0); }} data-order="app-first">
          পর্যটকের App
        </Chip>
        <Chip active={order === "thief-first"} onClick={() => { setOrder("thief-first"); setStep(0); }} data-order="thief-first">
          চোর
        </Chip>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <ActionButton onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={last} data-action="next">
          পরের ধাপ
        </ActionButton>
        <button
          onClick={() => setStep(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[0.625rem] text-muted-foreground">
          ধাপ {toBn(step + 1)} / {toBn(steps.length)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {(["r1", "r2", "r3"] as const).map((key) => {
          const status = cur.tokens[key];
          return (
            <div
              key={key}
              data-token={key}
              data-status={status}
              className={cn(
                "border px-4 py-3 transition-colors",
                status === "active" && "border-primary/60 bg-primary/5",
                status === "revoked" && "border-primary bg-primary/10",
                (status === "used" || status === "none") && "border-border bg-background",
              )}
            >
              <div className="text-[0.6875rem] font-bold text-foreground">{key.toUpperCase()}</div>
              <div className="text-[0.625rem] text-muted-foreground mb-2">
                {key === "r3" ? "নতুন Login এর পরিবার" : "প্রথম Login এর পরিবার"}
              </div>
              <div className={cn("font-mono text-[0.875rem] font-bold", status === "none" ? "text-muted-foreground" : "text-primary")}>
                {STATUS_TEXT[status]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-3 font-mono text-[0.6875rem] font-bold text-primary" data-verdict={cur.verdict}>
        {cur.actor}: {cur.verdict}
      </div>
      <motion.p
        key={`${order}-${step}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
        data-step={step}
      >
        {cur.text}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. কোন পরিস্থিতিতে কোন প্রমাণ                                             */
/* ------------------------------------------------------------------------- */

const SITUATIONS: {
  id: string;
  label: string;
  pick: string;
  why: string;
  watch: string;
}[] = [
  {
    id: "website",
    label: "একটা Website, নিজের Domain, একটা Backend",
    pick: "Server Session, HttpOnly Cookie তে id, খাতা Redis এ",
    why: "Browser নিজেই Cookie পাঠায়, JavaScript id টা পড়তেই পারে না, আর Logout বা Ban সাথে সাথে কাজ করে। একটা Redis Lookup এর খরচ খুবই কম।",
    watch: "Cookie এর SameSite আর Secure ঠিক রাখুন, Login এ id বদলান, আর একাধিক App হলে খাতা Redis এ রাখুন।",
  },
  {
    id: "mobile",
    label: "Android আর iOS App",
    pick: "ছোট Access JWT, সাথে Rotation করা Refresh Token",
    why: "Mobile App এ Cookie এর সুবিধা কম, Authorization Header এ Token পাঠানো সহজ। Access Token ছোট রাখলে বাতিল করার সমস্যা ছোট হয়ে যায়।",
    watch: "Refresh Token রাখুন Android Keystore বা iOS Keychain এ, কখনো Log এ নয়। Reuse Detection চালু রাখুন।",
  },
  {
    id: "services",
    label: "অনেকগুলো Service একই ইউজারকে চেনে",
    pick: "ES256 বা RS256 সই করা JWT, Public Key দিয়ে যাচাই",
    why: "প্রতিটা Service নিজেই Token যাচাই করতে পারে, কাউকে জিজ্ঞেস না করে, আর কেউ নতুন Token বানাতে পারে না।",
    watch: "প্রতিটা Service এ alg, iss আর aud নির্দিষ্ট করে দিন। Authorization এর সিদ্ধান্ত নিজের Database থেকে নিন।",
  },
  {
    id: "google",
    label: "Sign in with Google",
    pick: "Google এর ID Token একবার যাচাই, তারপর নিজের Session",
    why: "OpenID Connect এ Google একটা JWT দেয়, যা Google এর Public Key দিয়ে যাচাই হয়। সেটা শুধু Login এর প্রমাণ। এরপর আপনার সাইট নিজের প্রমাণ বানায়।",
    watch: "aud যেন আপনার নিজের Client ID হয় আর iss Google এর। Google এর Token নিজের API এর চাবি হিসেবে ঘুরিয়ে ব্যবহার করবেন না।",
  },
  {
    id: "admin",
    label: "Admin Panel, এখনই আটকাতে হবে এমন ক্ষমতা",
    pick: "Server Session, ছোট Idle Timeout",
    why: "একজন Admin এর ক্ষমতা কেড়ে নিলে সেটা পরের Request থেকেই কার্যকর হওয়া চাই। Session এর খাতা থেকে লাইন মুছলেই তা হয়।",
    watch: "Admin হওয়ার মুহূর্তে আবার Password চান আর Session id বদলান। Idle Timeout কয়েক মিনিটের, দিনের নয়।",
  },
  {
    id: "partner",
    label: "Seagull Tours এর Server থেকে Island Tours এর API ডাকা",
    pick: "কোনো ইউজার Session নয়: API Key বা OAuth Client Credentials থেকে ছোট JWT",
    why: "এখানে কোনো মানুষ Login করছেন না, একটা Server আরেকটা Server এর সাথে কথা বলছে। প্রমাণটা Partner এর, কোনো পর্যটকের নয়।",
    watch: "Partner এর Token এ aud আলাদা রাখুন, যেন সেটা Mobile App এর জায়গায় চলে না যায়। Key এর মেয়াদ আর বাতিলের ব্যবস্থা রাখুন।",
  },
];

export function ProofChoiceLab() {
  const [picked, setPicked] = useState(SITUATIONS[0].id);
  const cur = SITUATIONS.find((s) => s.id === picked) ?? SITUATIONS[0];

  return (
    <Panel
      label="Interactive"
      title="আপনার পরিস্থিতি বেছে নিন"
      footer="এখানে কোনো একটা উত্তর সব জায়গায় খাটে না। খেয়াল করুন, প্রতিটা সুপারিশ আসছে তিনটা প্রশ্ন থেকে: প্রমাণটা কে বহন করে, কে যাচাই করে, আর কত দ্রুত বাতিল করতে হবে। এই তিনটা প্রশ্নের উত্তর জানলে আপনি নতুন যেকোনো পরিস্থিতিতে নিজেই সিদ্ধান্ত নিতে পারবেন।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {SITUATIONS.map((s) => (
          <Chip key={s.id} active={picked === s.id} onClick={() => setPicked(s.id)} data-situation={s.id}>
            {s.label}
          </Chip>
        ))}
      </div>
      <div className="space-y-4" data-picked={cur.id}>
        <div className="border border-primary/60 bg-primary/5 px-4 py-3">
          <div className="text-[0.5625rem] font-mono uppercase tracking-[0.12em] text-muted-foreground mb-1">সুপারিশ</div>
          <div className="text-sm font-bold text-primary">{cur.pick}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-border bg-background px-4 py-3">
            <div className="text-[0.5625rem] font-mono uppercase tracking-[0.12em] text-muted-foreground mb-1">কেন</div>
            <p className="text-sm leading-relaxed text-foreground">{cur.why}</p>
          </div>
          <div className="border border-border bg-background px-4 py-3">
            <div className="text-[0.5625rem] font-mono uppercase tracking-[0.12em] text-muted-foreground mb-1">সাবধান</div>
            <p className="text-sm leading-relaxed text-foreground">{cur.watch}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
