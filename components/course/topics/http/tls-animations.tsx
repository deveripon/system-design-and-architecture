"use client";

/**
 * What: The interactive labs for the HTTPS, TLS and SSL lesson: who on the path sees which part of one
 * login request, a key exchange with small numbers, the TLS 1.3 handshake one message at a time, and
 * how many round trips each kind of connection costs at three distances.
 *
 * Why: TLS is about who knows what at which moment. Reading that in prose is hard; changing the viewer,
 * the secret or the distance and watching the answer change makes the rule obvious. Every value shown
 * is derived from state during render (no effects), so the labs cannot fall out of sync.
 */
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

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Who sees what: one login request, three watchers, HTTP or HTTPS         */
/* ------------------------------------------------------------------------- */

type Viewer = "cafe" | "isp" | "caddy";
type Scheme = "http" | "https";

const VIEWER_NAME: Record<Viewer, string> = {
  cafe: "ক্যাফের Wi-Fi",
  isp: "ISP",
  caddy: "Caddy, Island Tours এর Server",
};

/**
 * One row per part of the request. `outer` parts sit on the envelope and are visible on the path even
 * with HTTPS; the rest travel inside TLS and only the side that ends TLS (Caddy) can read them.
 */
const WIRE_FIELDS: {
  id: string;
  label: string;
  outer: boolean;
  value: (viewer: Viewer, scheme: Scheme) => string;
}[] = [
  {
    id: "source",
    label: "কে পাঠাল",
    outer: true,
    value: (viewer) => (viewer === "cafe" ? "192.168.1.20:51514" : "203.0.113.25:62001"),
  },
  {
    id: "destination",
    label: "কার কাছে",
    outer: true,
    value: (_viewer, scheme) => (scheme === "http" ? "103.94.135.2:80" : "103.94.135.2:443"),
  },
  {
    id: "name",
    label: "Server এর নাম",
    outer: true,
    value: (_viewer, scheme) =>
      scheme === "http" ? "Host: islandtours.example" : "SNI: islandtours.example",
  },
  {
    id: "sizes",
    label: "কত Byte, কখন",
    outer: true,
    value: () => "319 B, 815 B, 229 B, 793 B ...",
  },
  { id: "line", label: "Method আর Path", outer: false, value: () => "POST /api/auth/login" },
  { id: "type", label: "Header", outer: false, value: () => "Content-Type: application/json" },
  {
    id: "body",
    label: "Body",
    outer: false,
    value: () => '{"email":"tourist@mail.example","password":"648e542dc19e515e"}',
  },
  { id: "status", label: "উত্তরের Status", outer: false, value: () => "HTTP/1.1 200 OK" },
  {
    id: "cookie",
    label: "উত্তরের Cookie",
    outer: false,
    value: () => "Set-Cookie: __Host-session=Qm9va2luZy...",
  },
];

export function WireViewLab() {
  const [scheme, setScheme] = useState<Scheme>("http");
  const [viewer, setViewer] = useState<Viewer>("cafe");

  const canRead = (outer: boolean) => scheme === "http" || outer || viewer === "caddy";
  const visibleCount = WIRE_FIELDS.filter((f) => canRead(f.outer)).length;

  return (
    <Panel
      label="Interactive"
      title="একই Login Request, কে কতটুকু দেখে"
      footer="প্রথমে HTTP রেখে তিনজন দর্শক একে একে বদলান, দেখবেন সবাই সব পড়ছে, Password সহ। তারপর HTTPS বেছে নিয়ে আবার তিনজনকে দেখুন। ক্যাফে আর ISP এর কাছে শুধু খামের উপরের চারটা জিনিস থাকে, ভেতরের সব তালাবদ্ধ। কিন্তু Caddy সব পড়তে পারে, কারণ TLS এর সুড়ঙ্গটা ঠিক ওখানেই শেষ হয়। আরেকটা জিনিস খেয়াল করুন, ক্যাফে আপনার ভেতরের ঠিকানা 192.168.1.20 দেখে, আর ISP ও Caddy দেখে NAT এর পরের ঠিকানা 203.0.113.25, ঠিক Module 03 এর মতো।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <RowLabel>Protocol</RowLabel>
        {(["http", "https"] as Scheme[]).map((s) => (
          <Chip key={s} active={scheme === s} onClick={() => setScheme(s)} data-scheme={s}>
            {s === "http" ? "HTTP" : "HTTPS"}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <RowLabel>কে দেখছে</RowLabel>
        {(Object.keys(VIEWER_NAME) as Viewer[]).map((v) => (
          <Chip key={v} active={viewer === v} onClick={() => setViewer(v)} data-viewer={v}>
            {VIEWER_NAME[v]}
          </Chip>
        ))}
      </div>

      <div className="border border-border divide-y divide-border">
        {WIRE_FIELDS.map((field) => {
          const readable = canRead(field.outer);
          return (
            <div
              key={field.id}
              data-field={field.id}
              data-readable={readable ? "yes" : "no"}
              className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-4 px-4 py-2.5"
            >
              <span className="text-[0.6875rem] text-muted-foreground">
                {field.label}
                {field.outer && (
                  <span className="ml-2 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted-foreground/70">
                    খামের উপরে
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "font-mono text-[0.75rem] break-all transition-colors",
                  readable ? "text-primary font-bold" : "text-muted-foreground/60",
                )}
              >
                {readable ? field.value(viewer, scheme) : "তালাবদ্ধ, শুধু এলোমেলো Byte"}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-muted-foreground" data-visible-count={visibleCount}>
        {VIEWER_NAME[viewer]} পড়তে পারছে {toBn(WIRE_FIELDS.length)} টার মধ্যে{" "}
        <span className="font-bold text-primary">{toBn(visibleCount)}</span> টা।
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Agreeing on a secret in public, with numbers small enough to check      */
/* ------------------------------------------------------------------------- */

const DH_PRIME = 23;
const DH_BASE = 5;
const SECRET_CHOICES = [3, 4, 6, 7, 9, 11, 13, 15];

/** base^exponent mod modulus, by repeated multiplication so every step stays small. */
function modPow(base: number, exponent: number, modulus: number): number {
  let result = 1;
  for (let i = 0; i < exponent; i += 1) result = (result * base) % modulus;
  return result;
}

/** The smallest exponent that turns the base into `target`, which is what an eavesdropper must find. */
function bruteForceExponent(target: number): number {
  for (let x = 1; x < DH_PRIME; x += 1) {
    if (modPow(DH_BASE, x, DH_PRIME) === target) return x;
  }
  return 0;
}

export function KeyExchangeLab() {
  const [phoneSecret, setPhoneSecret] = useState(6);
  const [serverSecret, setServerSecret] = useState(15);
  const [showAttack, setShowAttack] = useState(false);

  const phonePublic = modPow(DH_BASE, phoneSecret, DH_PRIME);
  const serverPublic = modPow(DH_BASE, serverSecret, DH_PRIME);
  const phoneShared = modPow(serverPublic, phoneSecret, DH_PRIME);
  const serverShared = modPow(phonePublic, serverSecret, DH_PRIME);
  const guessed = bruteForceExponent(phonePublic);
  const cafeShared = modPow(serverPublic, guessed, DH_PRIME);

  return (
    <Panel
      label="Interactive"
      title="সবার সামনে বসে একটা গোপন সংখ্যায় একমত হওয়া"
      footer="দুই পাশের গোপন সংখ্যা যেভাবে খুশি বদলান। প্রতিবার দেখবেন ফোন আর Server আলাদা হিসাব করেও একই শেষ সংখ্যায় পৌঁছায়, অথচ সেই সংখ্যাটা কখনো তারে যায়নি, ক্যাফে শুধু মাঝের সারির সংখ্যাগুলো দেখেছে। তারপর ক্যাফের চেষ্টা বোতামটা চাপুন। এত ছোট সংখ্যায় ক্যাফে কয়েকবার চেষ্টাতেই গোপন সংখ্যাটা খুঁজে ফেলে। আসল TLS এ ঠিক এই কারণেই সংখ্যাগুলো 23 নয়, প্রায় 77 অঙ্কের, যেখানে সব চেষ্টা করে দেখতে পৃথিবীর সব কম্পিউটারের মহাবিশ্বের বয়সের চেয়েও বেশি সময় লাগবে।"
    >
      <div className="font-mono text-[0.6875rem] text-muted-foreground mb-5">
        সবার জানা: p = <span className="text-primary font-bold">{DH_PRIME}</span>, g ={" "}
        <span className="text-primary font-bold">{DH_BASE}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <RowLabel>ফোনের গোপন a</RowLabel>
        {SECRET_CHOICES.map((n) => (
          <Chip key={n} active={phoneSecret === n} onClick={() => setPhoneSecret(n)} data-phone-secret={n}>
            {n}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <RowLabel>Server এর গোপন b</RowLabel>
        {SECRET_CHOICES.map((n) => (
          <Chip key={n} active={serverSecret === n} onClick={() => setServerSecret(n)} data-server-secret={n}>
            {n}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border border-primary/50 bg-primary/5 px-4 py-3">
          <div className="text-[0.6875rem] font-bold text-foreground mb-2">ফোন</div>
          <div className="font-mono text-[0.75rem] space-y-1">
            <div>a = {phoneSecret}, শুধু ফোনের কাছে</div>
            <div>
              A = 5<sup>{phoneSecret}</sup> mod 23 = <span className="font-bold text-primary">{phonePublic}</span>
            </div>
            <div>
              গোপন = {serverPublic}
              <sup>{phoneSecret}</sup> mod 23 ={" "}
              <span className="font-bold text-primary" data-phone-shared={phoneShared}>
                {phoneShared}
              </span>
            </div>
          </div>
        </div>
        <div className="border border-dashed border-border px-4 py-3">
          <div className="text-[0.6875rem] font-bold text-foreground mb-2">তারে যা গেল, ক্যাফে যা দেখল</div>
          <div className="font-mono text-[0.75rem] space-y-1">
            <div className="flex items-center gap-2">
              A = {phonePublic} <ArrowRight className="w-3 h-3 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-3 h-3 text-primary" /> B = {serverPublic}
            </div>
            <div className="text-muted-foreground">a, b আর গোপন সংখ্যা: কখনো তারে যায়নি</div>
          </div>
        </div>
        <div className="border border-border bg-background px-4 py-3">
          <div className="text-[0.6875rem] font-bold text-foreground mb-2">Server</div>
          <div className="font-mono text-[0.75rem] space-y-1">
            <div>b = {serverSecret}, শুধু Server এর কাছে</div>
            <div>
              B = 5<sup>{serverSecret}</sup> mod 23 = <span className="font-bold text-primary">{serverPublic}</span>
            </div>
            <div>
              গোপন = {phonePublic}
              <sup>{serverSecret}</sup> mod 23 ={" "}
              <span className="font-bold text-primary" data-server-shared={serverShared}>
                {serverShared}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground" data-match={phoneShared === serverShared ? "yes" : "no"}>
        দুই পাশের গোপন সংখ্যা{" "}
        <span className="font-bold text-primary">{phoneShared === serverShared ? "মিলে গেছে" : "মেলেনি"}</span>
        , এখন এটা থেকে দুই পাশ একই Symmetric চাবি বানাবে।
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Chip active={showAttack} onClick={() => setShowAttack((v) => !v)} data-action="attack">
          ক্যাফের চেষ্টা
        </Chip>
        {showAttack && (
          <span className="font-mono text-[0.75rem] text-muted-foreground" data-guess={guessed}>
            5<sup>x</sup> mod 23 = {phonePublic} হয় x = {guessed} এ, {toBn(guessed)} বার চেষ্টায়। তাহলে গোপন ={" "}
            {serverPublic}
            <sup>{guessed}</sup> mod 23 = <span className="font-bold text-primary">{cafeShared}</span>
          </span>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. The TLS 1.3 handshake, one message at a time                            */
/* ------------------------------------------------------------------------- */

const HANDSHAKE_STEPS: {
  message: string;
  from: "phone" | "server" | null;
  sealed: boolean;
  inside: string;
  phoneKnows: string;
  serverKnows: string;
  cafeSees: string;
}[] = [
  {
    message: "TCP Handshake শেষ",
    from: null,
    sealed: false,
    inside: "SYN, SYN-ACK, ACK হয়ে গেছে, Module 05 এর মতো। এখন একটা সাধারণ TCP রাস্তা খোলা, তালা নেই।",
    phoneKnows: "Server এর IP আর Port 443",
    serverKnows: "কেউ একজন যোগাযোগ করেছে",
    cafeSees: "192.168.1.20:51514 থেকে 103.94.135.2:443",
  },
  {
    message: "ClientHello",
    from: "phone",
    sealed: false,
    inside: "আমি TLS 1.3 বুঝি। এই Cipher Suite গুলো চলবে। এই আমার Key Share, মানে চাবি বানানোর প্রকাশ্য অর্ধেক। আমি islandtours.example চাই, এটা SNI। HTTP এর জন্য h2 বা http/1.1, এটা ALPN।",
    phoneKnows: "নিজের গোপন সংখ্যা, যা কখনো পাঠাবে না",
    serverKnows: "ফোন কী কী পারে, কোন নাম চায়, ফোনের Key Share",
    cafeSees: "সবকিছু, নাম islandtours.example সহ, কারণ এখনো তালা নেই",
  },
  {
    message: "ServerHello",
    from: "server",
    sealed: false,
    inside: "ঠিক আছে, TLS 1.3, Suite TLS_AES_128_GCM_SHA256। এই আমার Key Share।",
    phoneKnows: "Server এর Key Share। হিসাব করে একই গোপন সংখ্যা পেল, তা থেকে চাবি বানাল",
    serverKnows: "একই গোপন সংখ্যা, একই চাবি",
    cafeSees: "দুইটা Key Share, কিন্তু গোপন সংখ্যাটা হিসাব করতে পারে না",
  },
  {
    message: "EncryptedExtensions, Certificate",
    from: "server",
    sealed: true,
    inside: "এখান থেকে সব তালাবদ্ধ। ALPN এর উত্তর h2। তারপর Certificate, যেখানে লেখা এই Public Key টা islandtours.example এর, আর একজন বিশ্বস্ত CA তাতে সই করেছে।",
    phoneKnows: "Server এর দাবি করা নাম আর Public Key। এখনো প্রমাণ হয়নি সে আসল",
    serverKnows: "সব",
    cafeSees: "শুধু কয়েকশো এলোমেলো Byte",
  },
  {
    message: "CertificateVerify",
    from: "server",
    sealed: true,
    inside: "এ পর্যন্ত যত কথা হলো, তার উপর Server নিজের Private Key দিয়ে একটা সই করল। শুধু আসল মালিকই এই সই বানাতে পারে।",
    phoneKnows: "Certificate এর Public Key দিয়ে সই মিলিয়ে দেখল। মিলেছে, আর Certificate টাও যাচাই করল (পরের লেসন)। এখন জানে ওপাশে আসল Island Tours",
    serverKnows: "সব",
    cafeSees: "আরও কিছু এলোমেলো Byte",
  },
  {
    message: "Finished (Server)",
    from: "server",
    sealed: true,
    inside: "পুরো কথোপকথনের একটা হিসাব, চাবি দিয়ে বানানো। মাঝপথে কেউ ClientHello থেকে একটা Suite মুছে দিলে এই হিসাব মিলত না।",
    phoneKnows: "Handshake এ কেউ হাত দেয়নি",
    serverKnows: "ফোনের Finished এর অপেক্ষায়",
    cafeSees: "এলোমেলো Byte",
  },
  {
    message: "Finished (ফোন), তারপর GET",
    from: "phone",
    sealed: true,
    inside: "ফোনও নিজের হিসাব পাঠাল, আর একই মুহূর্তে আসল HTTP Request: GET /tours/saint-martin, সব Header আর Cookie সহ।",
    phoneKnows: "Request রওনা দিয়েছে",
    serverKnows: "দুই পাশের হিসাব মিলেছে, Request টা পড়তে পারছে",
    cafeSees: "এলোমেলো Byte, কোন পাতা চাওয়া হলো জানে না",
  },
  {
    message: "Response, NewSessionTicket",
    from: "server",
    sealed: true,
    inside: "200 আর পুরো পাতা, তালার ভেতরে। সাথে একটা Session Ticket, যাতে পরের বার ফোন আবার পুরো পরিচয়পর্ব না করে চলে আসতে পারে।",
    phoneKnows: "পাতা পেয়েছে, আর পরের বারের জন্য একটা Ticket",
    serverKnows: "উত্তর দেওয়া শেষ",
    cafeSees: "উত্তরটা কত বড়, এটুকুই",
  },
];

export function HandshakeStepLab() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const cur = HANDSHAKE_STEPS[step];
  const last = step === HANDSHAKE_STEPS.length - 1;

  return (
    <Panel
      label="Interactive"
      title="TLS 1.3 Handshake, এক বার্তা করে"
      footer="এক ধাপ করে এগোন আর তিনটা ঘর খেয়াল করুন: ফোন কী জানে, Server কী জানে, ক্যাফে কী দেখে। প্রথম তিন ধাপে ক্যাফে সব দেখছে, তবুও দুই পাশ চাবি বানিয়ে ফেলেছে। চতুর্থ ধাপ থেকে ক্যাফের ঘরে শুধু এলোমেলো Byte। আর পঞ্চম ধাপটা সবচেয়ে জরুরি, ওখানেই ফোন প্রথম নিশ্চিত হয় যে ওপাশে আসল Island Tours, নকল কেউ নয়।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setStep((s) => Math.min(HANDSHAKE_STEPS.length - 1, s + 1))}
          disabled={last}
          data-action="next"
          className={cn(
            "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            last
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          পরের বার্তা
        </button>
        <button
          onClick={() => setStep(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[0.625rem] text-muted-foreground" data-step={step}>
          ধাপ {toBn(step)} / {toBn(HANDSHAKE_STEPS.length - 1)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="font-mono text-[0.9375rem] font-bold text-primary" data-message={cur.message}>
          {cur.message}
        </span>
        {cur.from && (
          <span className="inline-flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
            {cur.from === "phone" ? "ফোন" : "Server"}
            {cur.from === "phone" ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
            {cur.from === "phone" ? "Server" : "ফোন"}
          </span>
        )}
        <span
          data-sealed={cur.sealed ? "yes" : "no"}
          className={cn(
            "px-2 py-0.5 border font-mono text-[0.5625rem] uppercase tracking-[0.12em]",
            cur.sealed ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground",
          )}
        >
          {cur.sealed ? "তালাবদ্ধ" : "খোলা"}
        </span>
      </div>

      <motion.p
        key={step}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="text-sm text-foreground leading-relaxed mb-5"
      >
        {cur.inside}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { title: "ফোন জানে", text: cur.phoneKnows, id: "phone" },
          { title: "Server জানে", text: cur.serverKnows, id: "server" },
          { title: "ক্যাফে দেখে", text: cur.cafeSees, id: "cafe" },
        ].map((box) => (
          <div
            key={box.id}
            data-box={box.id}
            className={cn(
              "border px-4 py-3 transition-colors",
              box.id === "cafe" && cur.sealed ? "border-border bg-muted/20" : "border-border bg-background",
              box.id === "phone" && step === 4 && "border-primary/60 bg-primary/5",
            )}
          >
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">
              {box.title}
            </div>
            <div className="text-[0.8125rem] leading-relaxed text-foreground">{box.text}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Round trips before the first byte, at three distances                   */
/* ------------------------------------------------------------------------- */

const DISTANCES = [
  { id: "edge", label: "ঢাকার Edge", rttMs: 5 },
  { id: "sg", label: "Singapore", rttMs: 40 },
  { id: "us", label: "আমেরিকার পূর্ব উপকূল", rttMs: 250 },
] as const;

/** Round trips spent on each stage before the first byte of the answer arrives. */
const CONNECTION_KINDS: {
  id: string;
  name: string;
  badge: string;
  transport: number;
  tls: number;
  request: number;
  note: string;
}[] = [
  { id: "plain", name: "HTTP, তালা ছাড়া", badge: "তুলনার জন্য", transport: 1, tls: 0, request: 1, note: "দ্রুত, কিন্তু সবাই সব দেখে" },
  { id: "tls12", name: "TLS 1.2", badge: "2-RTT Handshake", transport: 1, tls: 2, request: 1, note: "পুরনো, এখনো অনেক জায়গায়" },
  { id: "tls13", name: "TLS 1.3", badge: "1-RTT Handshake", transport: 1, tls: 1, request: 1, note: "আজকের সাধারণ অবস্থা" },
  { id: "zero", name: "TLS 1.3, 0-RTT", badge: "Early Data", transport: 1, tls: 0, request: 1, note: "Request টা ClientHello এর সাথেই যায়, শুধু ফিরে আসা মানুষের জন্য" },
  { id: "quic", name: "HTTP/3, QUIC", badge: "রাস্তা আর তালা একসাথে", transport: 0, tls: 1, request: 1, note: "TCP নেই, QUIC নিজেই TLS 1.3 চালায়" },
];

export function RoundTripLab() {
  const [distance, setDistance] = useState<(typeof DISTANCES)[number]["id"]>("sg");
  const rtt = DISTANCES.find((d) => d.id === distance)?.rttMs ?? DISTANCES[0].rttMs;
  const maxTrips = Math.max(...CONNECTION_KINDS.map((k) => k.transport + k.tls + k.request));

  return (
    <Panel
      label="Interactive"
      title="প্রথম Byte আসার আগে কতবার যাওয়া আসা"
      footer="উপরে Server কত দূরে তা বদলান। প্রতিটা সারি একেক রকম Connection, আর বারের প্রতিটা খোপ একটা Round Trip। Server কাছে থাকলে সব সারিই চোখের পলকে শেষ, তফাতটা প্রায় বোঝাই যায় না। দূরে গেলে প্রতিটা বাড়তি Round Trip আপনার পর্যটকের সময় থেকে চলে যায়। এই কারণেই TLS 1.3 এর সবচেয়ে বড় উপহার একটা Round Trip কমানো, আর এই কারণেই CDN আর Edge Server ব্যবহারকারীর কাছাকাছি বসানো হয়। Server এর নিজের কাজের সময় এখানে ধরা হয়নি, শুধু পথের সময়।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <RowLabel>Server কত দূরে</RowLabel>
        {DISTANCES.map((d) => (
          <Chip key={d.id} active={distance === d.id} onClick={() => setDistance(d.id)} data-distance={d.id}>
            {d.label}, প্রায় {d.rttMs} ms
          </Chip>
        ))}
      </div>

      <div className="space-y-4">
        {CONNECTION_KINDS.map((kind) => {
          const trips = kind.transport + kind.tls + kind.request;
          const segments = [
            { key: "transport", count: kind.transport, label: "TCP" },
            { key: "tls", count: kind.tls, label: kind.id === "quic" ? "QUIC + TLS" : "TLS" },
            { key: "request", count: kind.request, label: "Request" },
          ].filter((s) => s.count > 0);
          return (
            <div key={kind.id} data-kind={kind.id} data-total-ms={trips * rtt}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                <span className="text-[0.75rem] font-bold text-foreground">
                  {kind.name}
                  <span className="ml-2 px-1.5 py-0.5 border border-border font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted-foreground">
                    {kind.badge}
                  </span>
                </span>
                <span className="font-mono text-[0.75rem] text-primary font-bold">
                  {trips} RTT = {trips * rtt} ms
                </span>
              </div>
              <div className="flex h-7 border border-border bg-background" style={{ width: `${(trips / maxTrips) * 100}%` }}>
                {segments.map((s) => (
                  <div
                    key={s.key}
                    style={{ width: `${(s.count / trips) * 100}%` }}
                    className={cn(
                      "flex items-center justify-center border-r border-border last:border-r-0 font-mono text-[0.5625rem] transition-all",
                      s.key === "tls" ? "bg-primary/15 text-primary font-bold" : "bg-muted/30 text-muted-foreground",
                    )}
                  >
                    {s.label} {s.count > 1 ? `× ${s.count}` : ""}
                  </div>
                ))}
              </div>
              <p className="mt-1 text-[0.6875rem] text-muted-foreground">{kind.note}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
