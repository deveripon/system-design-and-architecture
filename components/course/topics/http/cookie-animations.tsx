"use client";

/**
 * What: The three hands-on labs for the Cookies lesson. One lets the reader build a Set-Cookie line
 * and see which Island Tours requests carry the cookie. One compares two addresses and says whether
 * they are the same origin and the same site. One shows every SameSite mode against every kind of
 * request at once.
 *
 * Why: Cookie rules are easy to recite and easy to get wrong. Every verdict here is computed from
 * the same matching rules a browser uses (host, path prefix, scheme, site), not typed in by hand,
 * so the reader can change one input and discover the rule themselves.
 */

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
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

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1 w-full sm:w-32">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Cookie টা কোন Request এ যাবে                                              */
/* ------------------------------------------------------------------------- */

const SET_BY = "islandtours.example";

const SCOPE_URLS = [
  "https://islandtours.example/tours/saint-martin",
  "https://islandtours.example/api/bookings",
  "https://islandtours.example/api-docs",
  "https://islandtours.example:8443/api/tours",
  "http://islandtours.example/api/tours",
  "https://blog.islandtours.example/",
  "https://admin.islandtours.example/api/bookings",
  "https://seagulltours.example/api/tours",
];

type DomainMode = "host" | "domain";
type PathMode = "/" | "/api";

/** Browser এর তিনটা পরীক্ষা, এই ক্রমে: নাম, Path, Scheme। প্রথম যেটা ব্যর্থ হয় সেটাই কারণ। */
function scopeVerdict(
  url: string,
  domain: DomainMode,
  path: PathMode,
  secure: boolean,
): { sent: boolean; reason: string } {
  const u = new URL(url);
  const host = u.hostname;
  const hostOk = domain === "host" ? host === SET_BY : host === SET_BY || host.endsWith(`.${SET_BY}`);
  if (!hostOk) {
    return {
      sent: false,
      reason:
        domain === "host" && host.endsWith(`.${SET_BY}`)
          ? "Host-only Cookie, শুধু islandtours.example নিজে পায়। Subdomain পায় না।"
          : "পুরো অন্য একটা নাম। এর Jar আলাদা, এখানে Island Tours এর Cookie কখনো যায় না।",
    };
  }
  const reqPath = u.pathname;
  const pathOk = path === "/" || reqPath === path || reqPath.startsWith(`${path}/`);
  if (!pathOk) {
    return {
      sent: false,
      reason: `Path=${path} মানে ${path} বা ${path}/ দিয়ে শুরু। ${reqPath} শুধু অক্ষরে মেলে, ভাগে মেলে না।`,
    };
  }
  if (secure && u.protocol !== "https:") {
    return { sent: false, reason: "Secure Cookie, আর এই Request সাধারণ http:// তে। Browser দেবে না।" };
  }
  const notes: string[] = [];
  if (u.port) notes.push("Port আলাদা হলেও যায়, Cookie Port দেখে না।");
  if (!secure && u.protocol !== "https:") notes.push("যায়, কিন্তু খোলা http তে, পথের যে কেউ পড়তে পারে।");
  if (host !== SET_BY) notes.push("Domain লেখা আছে বলে Subdomain ও পায়।");
  return { sent: true, reason: notes.join(" ") || "নাম, Path আর Scheme তিনটাই মিলেছে।" };
}

export function CookieScopeLab() {
  const [domain, setDomain] = useState<DomainMode>("host");
  const [path, setPath] = useState<PathMode>("/");
  const [secure, setSecure] = useState(true);

  const line = [
    "Set-Cookie: pref=1",
    domain === "domain" ? `Domain=${SET_BY}` : null,
    `Path=${path}`,
    secure ? "Secure" : null,
  ]
    .filter(Boolean)
    .join("; ");

  const verdicts = SCOPE_URLS.map((url) => ({ url, ...scopeVerdict(url, domain, path, secure) }));
  const sentCount = verdicts.filter((v) => v.sent).length;

  return (
    <Panel
      label="Interactive"
      title="Domain, Path আর Secure বদলে দেখুন Cookie কোথায় যায়"
      footer="Cookie টা বসিয়েছে islandtours.example। উপরের তিনটা নিয়ন্ত্রণ বদলালে Set-Cookie লাইনটা বদলায়, আর নিচের আটটা Request এর প্রতিটার পাশে দেখবেন Browser Cookie টা দেবে কি না, আর কেন। তিনটা জিনিস খেয়াল করুন। Domain লিখলে Cookie বেশি জায়গায় যায়, কম জায়গায় নয়। /api-docs আর /api অক্ষরে মিললেও Path হিসেবে মেলে না। আর 8443 Port এর Request টা সবসময় Cookie পায়, কারণ Cookie Port এর হিসাবই রাখে না।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <RowLabel>Domain</RowLabel>
        <Chip active={domain === "host"} onClick={() => setDomain("host")} data-domain="host">
          লেখা নেই (Host-only)
        </Chip>
        <Chip active={domain === "domain"} onClick={() => setDomain("domain")} data-domain="domain">
          Domain=islandtours.example
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <RowLabel>Path</RowLabel>
        <Chip active={path === "/"} onClick={() => setPath("/")} data-path="/">
          Path=/
        </Chip>
        <Chip active={path === "/api"} onClick={() => setPath("/api")} data-path="/api">
          Path=/api
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <RowLabel>Secure</RowLabel>
        <Chip active={secure} onClick={() => setSecure(true)} data-secure="on">
          আছে
        </Chip>
        <Chip active={!secure} onClick={() => setSecure(false)} data-secure="off">
          নেই
        </Chip>
      </div>

      <div className="border border-primary/40 bg-primary/5 px-4 py-3 mb-5 overflow-x-auto">
        <code className="font-mono text-[0.75rem] text-primary whitespace-nowrap" data-line={line}>
          {line}
        </code>
      </div>

      <ul className="space-y-2 mb-4">
        {verdicts.map((v) => (
          <li
            key={v.url}
            data-url={v.url}
            data-sent={v.sent ? "yes" : "no"}
            className={cn(
              "grid grid-cols-[20px_1fr] gap-3 border px-3 py-2 transition-colors",
              v.sent ? "border-primary/40 bg-primary/5" : "border-border bg-background",
            )}
          >
            {v.sent ? (
              <Check className="w-4 h-4 text-primary mt-0.5" />
            ) : (
              <X className="w-4 h-4 text-muted-foreground mt-0.5" />
            )}
            <span className="min-w-0">
              <span className="block font-mono text-[0.6875rem] text-foreground break-all">{v.url}</span>
              <span className="block text-[0.6875rem] text-muted-foreground leading-relaxed">{v.reason}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="font-mono text-[0.6875rem] text-muted-foreground" data-sent-count={sentCount}>
        আটটা Request এর মধ্যে Cookie যাবে {toBn(sentCount)} টায়
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একই Origin? একই Site?                                                   */
/* ------------------------------------------------------------------------- */

const ADDRESSES = [
  "https://islandtours.example",
  "https://islandtours.example:8443",
  "http://islandtours.example",
  "https://blog.islandtours.example",
  "https://api.islandtours.example",
  "https://seagulltours.example",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
];

const DEFAULT_PORT: Record<string, string> = { "http:": "80", "https:": "443" };

/**
 * এই Lab এর সব নাম .example এ শেষ, যেটা নিজেই একটা Public Suffix, তাই শেষ দুইটা অংশই
 * Registrable Domain। আসল Browser এই সিদ্ধান্তটা নেয় Public Suffix List দেখে।
 */
function registrableDomain(host: string) {
  if (host === "localhost" || /^\d+(\.\d+){3}$/.test(host)) return host;
  return host.split(".").slice(-2).join(".");
}

function describe(address: string) {
  const u = new URL(address);
  const port = u.port || DEFAULT_PORT[u.protocol];
  return {
    scheme: u.protocol.replace(":", ""),
    host: u.hostname,
    port,
    origin: `${u.protocol}//${u.hostname}:${port}`,
    site: `${u.protocol}//${registrableDomain(u.hostname)}`,
  };
}

function compare(a: string, b: string) {
  const x = describe(a);
  const y = describe(b);
  const originDiff: string[] = [];
  if (x.scheme !== y.scheme) originDiff.push("Scheme আলাদা");
  if (x.host !== y.host) originDiff.push("Host আলাদা");
  if (x.port !== y.port) originDiff.push("Port আলাদা");
  const siteDiff: string[] = [];
  if (x.scheme !== y.scheme) siteDiff.push("Scheme আলাদা");
  if (registrableDomain(x.host) !== registrableDomain(y.host)) siteDiff.push("Registrable Domain আলাদা");
  return { x, y, originDiff, siteDiff };
}

export function SiteOriginLab() {
  const reduce = useReducedMotion();
  const [a, setA] = useState(ADDRESSES[0]);
  const [b, setB] = useState(ADDRESSES[3]);
  const { x, y, originDiff, siteDiff } = compare(a, b);
  const sameOrigin = originDiff.length === 0;
  const sameSite = siteDiff.length === 0;

  const lesson = sameOrigin
    ? "দুইটা একই Origin, তাই একই Site ও। এদের মাঝে Browser কোনো দেয়াল তোলে না।"
    : sameSite
      ? "আলাদা Origin, কিন্তু একই Site। এখানে CORS এর নিয়ম খাটে, কারণ Origin আলাদা। কিন্তু SameSite এর চোখে এরা আপনজন, Strict Cookie ও এদের মাঝে যায়।"
      : "আলাদা Origin, আলাদা Site। এখানে CORS ও খাটে, SameSite ও খাটে। Cookie এর চোখে এটা অন্য সাইট থেকে আসা Request।";

  return (
    <Panel
      label="Interactive"
      title="দুইটা ঠিকানা বেছে নিন, Browser এর চোখে তারা কতটা আপন"
      footer="উপরের সারি থেকে একটা, নিচের সারি থেকে আরেকটা ঠিকানা বেছে নিন। নিচে Browser এর দুইটা প্রশ্নের উত্তর আসবে: একই Origin কি না, আর একই Site কি না, সাথে কারণ। কয়েকটা জোড়া অবশ্যই চেষ্টা করুন। islandtours.example আর blog.islandtours.example। localhost:3000 আর localhost:5173। localhost:3000 আর 127.0.0.1:3000। শেষেরটা অবাক করবে, একই যন্ত্র, একই Port, তবুও আলাদা Site।"
    >
      {[
        { label: "ঠিকানা ১", value: a, set: setA, key: "a" },
        { label: "ঠিকানা ২", value: b, set: setB, key: "b" },
      ].map((row) => (
        <div key={row.key} className="flex flex-wrap items-center gap-2 mb-3">
          <RowLabel>{row.label}</RowLabel>
          {ADDRESSES.map((addr) => (
            <Chip key={addr} active={row.value === addr} onClick={() => row.set(addr)} data-pick={`${row.key}:${addr}`}>
              <span className="font-mono">{addr}</span>
            </Chip>
          ))}
        </div>
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
        {[x, y].map((d, i) => (
          <div key={i} className="border border-border bg-background px-4 py-3">
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">
              ঠিকানা {toBn(i + 1)}
            </div>
            <div className="font-mono text-[0.6875rem] text-foreground break-all">Origin: {d.origin}</div>
            <div className="font-mono text-[0.6875rem] text-primary break-all">Site: {d.site}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {[
          { q: "একই Origin?", yes: sameOrigin, why: originDiff, tag: "origin" },
          { q: "একই Site?", yes: sameSite, why: siteDiff, tag: "site" },
        ].map((v) => (
          <div
            key={v.q}
            data-verdict={`${v.tag}:${v.yes ? "same" : "different"}`}
            className={cn("border px-4 py-3", v.yes ? "border-primary/50 bg-primary/5" : "border-border bg-background")}
          >
            <div className="text-[0.75rem] font-bold text-foreground">{v.q}</div>
            <div className={cn("font-mono text-[0.9375rem] font-bold", v.yes ? "text-primary" : "text-muted-foreground")}>
              {v.yes ? "হ্যাঁ" : "না"}
            </div>
            <div className="text-[0.6875rem] text-muted-foreground">
              {v.yes ? "সব অংশ মিলেছে" : v.why.join(", ")}
            </div>
          </div>
        ))}
      </div>

      <motion.p
        key={`${a}|${b}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
      >
        {lesson}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. SameSite, প্রতিটা Mode আর প্রতিটা Request একসাথে                         */
/* ------------------------------------------------------------------------- */

type StartFrom = "self" | "same-site" | "cross-site";
type Mode = "strict" | "lax" | "none" | "default";
type Kind = "link" | "form" | "fetch" | "iframe";

const STARTS: { id: StartFrom; label: string; host: string }[] = [
  { id: "self", label: "islandtours.example নিজেই", host: "islandtours.example" },
  { id: "same-site", label: "blog.islandtours.example", host: "blog.islandtours.example" },
  { id: "cross-site", label: "attacker.example", host: "attacker.example" },
];

const MODES: { id: Mode; label: string }[] = [
  { id: "strict", label: "SameSite=Strict" },
  { id: "lax", label: "SameSite=Lax" },
  { id: "none", label: "SameSite=None; Secure" },
  { id: "default", label: "SameSite লেখা নেই" },
];

const KINDS: { id: Kind; label: string; sub: string }[] = [
  { id: "link", label: "Link এ ক্লিক", sub: "Top-level GET" },
  { id: "form", label: "Form Submit", sub: "Top-level POST" },
  { id: "fetch", label: "img বা fetch", sub: "পাতার ভেতর থেকে" },
  { id: "iframe", label: "iframe", sub: "পাতার ভেতরে পাতা" },
];

type Cell = { sent: boolean; star?: boolean; why: string };

/** Chromium এর নিয়ম। Firefox আর Safari এর পার্থক্য Lab এর নিচের লেখায় বলা আছে। */
function sameSiteCell(start: StartFrom, mode: Mode, kind: Kind): Cell {
  if (start !== "cross-site") {
    return {
      sent: true,
      why:
        start === "self"
          ? "Request টা Island Tours এর নিজের পাতা থেকে। SameSite এর কোনো Mode এখানে বাধা দেয় না।"
          : "blog.islandtours.example আলাদা Origin, কিন্তু একই Site। SameSite শুধু Site দেখে, তাই Strict ও যায়।",
    };
  }
  if (mode === "strict") {
    return { sent: false, why: "Strict মানে অন্য Site থেকে শুরু হওয়া কোনো Request এ কখনো না, Link এ ক্লিক হলেও না।" };
  }
  if (mode === "none") {
    return {
      sent: true,
      why:
        kind === "fetch" || kind === "iframe"
          ? "None মানে সব জায়গায়। তবে এই Request এ Cookie টা Third-party, তাই Safari আর Brave দেবে না, Firefox আলাদা Jar থেকে খুঁজবে।"
          : "None মানে সব জায়গায়, অন্য Site থেকে এলেও। এই কারণেই None এর সাথে Secure বাধ্যতামূলক।",
    };
  }
  // lax, আর Chromium এ লেখা না থাকলে Lax
  if (kind === "link") {
    return {
      sent: true,
      why: "Lax এর একমাত্র ছাড়: Top-level Navigation আর নিরাপদ Method (GET)। মানুষ নিজে Link এ ক্লিক করে এসেছেন, তাই দেওয়া হয়।",
    };
  }
  if (kind === "form" && mode === "default") {
    return {
      sent: false,
      star: true,
      why: "Chrome লেখা না থাকা Cookie কে Lax ধরে, তাই সাধারণত যায় না। কিন্তু Cookie টা ২ মিনিটের কম আগে বসানো হলে Chrome Top-level POST এ দিয়ে দেয়, পুরনো Login ব্যবস্থা না ভাঙার জন্য। Firefox আর Safari এই নিয়ম সবার জন্য চালু করেনি।",
    };
  }
  return {
    sent: false,
    why:
      kind === "form"
        ? "অন্য Site থেকে POST, এটাই CSRF এর চেহারা। Lax এখানে Cookie দেয় না।"
        : "পাতার ভেতর থেকে অন্য Site এ যাওয়া Request। Lax এখানে Cookie দেয় না।",
  };
}

export function SameSiteLab() {
  const reduce = useReducedMotion();
  const [start, setStart] = useState<StartFrom>("cross-site");
  const [picked, setPicked] = useState<{ mode: Mode; kind: Kind }>({ mode: "lax", kind: "form" });

  const pickedCell = sameSiteCell(start, picked.mode, picked.kind);
  const startHost = STARTS.find((s) => s.id === start)!.host;
  const sentCount = MODES.flatMap((m) => KINDS.map((k) => sameSiteCell(start, m.id, k.id))).filter(
    (c) => c.sent,
  ).length;

  return (
    <Panel
      label="Interactive"
      title="চার রকম Cookie, চার রকম Request, একসাথে"
      footer="উপরে বেছে নিন Request টা কোন পাতা থেকে শুরু হচ্ছে। Cookie গুলো সবসময় islandtours.example এর, আর Request সবসময় islandtours.example এ যাচ্ছে। ছকটা Chrome এর নিয়মে। প্রথমে islandtours.example নিজেই বেছে নিন, সব ঘরে টিক। তারপর blog.islandtours.example, এখনো সব ঘরে টিক, কারণ এটা একই Site। শেষে attacker.example, এবার ছকটা ভেঙে যায়। যে ঘরে ক্লিক করবেন, নিচে তার কারণ দেখাবে। তারা চিহ্নের ঘরটা আলাদা করে পড়বেন।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <RowLabel>Request শুরু</RowLabel>
        {STARTS.map((s) => (
          <Chip key={s.id} active={start === s.id} onClick={() => setStart(s.id)} data-start={s.id}>
            {s.label}
          </Chip>
        ))}
      </div>

      <div className="overflow-x-auto mb-5">
        <table className="w-full min-w-[560px] border-collapse text-[0.6875rem]">
          <thead>
            <tr>
              <th className="text-left font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground p-2 border border-border">
                Cookie
              </th>
              {KINDS.map((k) => (
                <th key={k.id} className="p-2 border border-border text-left">
                  <span className="block font-bold text-foreground">{k.label}</span>
                  <span className="block text-[0.625rem] text-muted-foreground">{k.sub}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODES.map((m) => (
              <tr key={m.id}>
                <th className="p-2 border border-border text-left font-mono text-[0.6875rem] text-foreground whitespace-nowrap">
                  {m.label}
                </th>
                {KINDS.map((k) => {
                  const cell = sameSiteCell(start, m.id, k.id);
                  const isPicked = picked.mode === m.id && picked.kind === k.id;
                  return (
                    <td key={k.id} className="p-0 border border-border">
                      <button
                        onClick={() => setPicked({ mode: m.id, kind: k.id })}
                        data-cell={`${m.id}:${k.id}`}
                        data-sent={cell.sent ? "yes" : "no"}
                        aria-label={`${m.label}, ${k.label}: ${cell.sent ? "যায়" : "যায় না"}`}
                        className={cn(
                          "w-full h-full min-h-[44px] flex items-center justify-center gap-1 transition-colors",
                          cell.sent ? "bg-primary/10 text-primary" : "bg-background text-muted-foreground",
                          isPicked && "outline outline-2 -outline-offset-2 outline-primary",
                        )}
                      >
                        {cell.sent ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {cell.star && <span className="font-mono text-[0.75rem] font-bold text-primary">*</span>}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="font-mono text-[0.6875rem] text-muted-foreground mb-3" data-sent-count={sentCount}>
        {startHost} থেকে শুরু হলে ১৬ টা ঘরের {toBn(sentCount)} টায় Cookie যায়
      </p>

      <motion.p
        key={`${start}-${picked.mode}-${picked.kind}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="text-sm leading-relaxed text-muted-foreground"
      >
        <span className="font-mono text-[0.75rem] text-foreground">
          {MODES.find((m) => m.id === picked.mode)!.label}, {KINDS.find((k) => k.id === picked.kind)!.label}:{" "}
        </span>
        {pickedCell.why}
      </motion.p>
    </Panel>
  );
}
