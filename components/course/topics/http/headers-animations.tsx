"use client";

/**
 * What: The three hands-on panels of the HTTP Headers lesson: a raw request and response whose
 * lines explain themselves when clicked, a cache timeline that replays five Cache-Control
 * policies over the same four visits, and a CORS checker that decides, like a browser, whether a
 * page may read an API response.
 *
 * Why: Caching and CORS are rules about time and about who asks, and a reader learns them faster
 * by changing one input and watching the outcome than by reading a table. Every panel derives what
 * it shows straight from React state, with no effects, so rapid clicks can never leave it stale.
 */
import { cn } from "@/lib/utils";
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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. একটা আসল Request আর Response, প্রতিটা লাইন নিজের কথা বলে                 */
/* ------------------------------------------------------------------------- */

type InspectorLine = { text: string; what: string; who: string; lesson: string };

const REQUEST_LINES: InspectorLine[] = [
  {
    text: "GET /tours/saint-martin HTTP/1.1",
    what: "Request Line, Header নয়। Method, Path আর Version। লেসন ০২ এ এর গঠন দেখেছেন।",
    who: "Browser, Address Bar থেকে",
    lesson: "লেসন ০২, ০৩",
  },
  {
    text: "Host: islandtours.example",
    what: "কোন সাইটটা চাই। একই IP তে অনেক সাইট থাকতে পারে, তাই এটা বাধ্যতামূলক।",
    who: "Browser, URL এর Host অংশ থেকে",
    lesson: "লেসন ০২",
  },
  {
    text: "User-Agent: Mozilla/5.0 (Linux; Android 10; K) ... Chrome/156.0.0.0 Mobile Safari/537.36",
    what: "কোন Browser আর কোন যন্ত্র। পরিসংখ্যানের জন্য কাজের, কিন্তু যে কেউ যা খুশি লিখতে পারে, তাই এর উপর নিরাপত্তার সিদ্ধান্ত নয়।",
    who: "Browser নিজে",
    lesson: "এই লেসন, ০০৩",
  },
  {
    text: "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,...,*/*;q=0.8",
    what: "কোন রূপের উত্তর পেলে Browser খুশি। পাতা খুলতে গেলে HTML সবার আগে।",
    who: "Browser, Request এর ধরন দেখে",
    lesson: "এই লেসন, ০০৬",
  },
  {
    text: "Accept-Encoding: gzip, deflate, br, zstd",
    what: "কোন কোন Compression Browser খুলতে পারে। Server এর মধ্য থেকে একটা বেছে নেয়।",
    who: "Browser নিজে",
    lesson: "এই লেসন, ০০৬",
  },
  {
    text: "Accept-Language: bn-BD,bn;q=0.9,en;q=0.8",
    what: "পছন্দের ভাষা, যন্ত্রের Setting থেকে। সাইট চাইলে বাংলা পাতা দিতে পারে।",
    who: "Browser, যন্ত্রের ভাষার Setting থেকে",
    lesson: "এই লেসন, ০০৬",
  },
  {
    text: 'If-None-Match: "TLA3YHQRl1KfW0Q0"',
    what: "আমার কাছে এই ছাপের একটা কপি আছে, বদলে থাকলে তবেই নতুনটা পাঠান।",
    who: "Browser, নিজের Cache থেকে",
    lesson: "এই লেসন, ০০৮",
  },
  {
    text: "Cookie: __Host-session=...",
    what: "আগে Server যে Cookie দিয়েছিল, প্রতিটা Request এ সেটা ফেরত যায়। এভাবেই Server চেনে আপনি Login করা।",
    who: "Browser, Cookie Jar থেকে",
    lesson: "লেসন ০৫, ০৬",
  },
];

const RESPONSE_LINES: InspectorLine[] = [
  {
    text: "HTTP/1.1 200 OK",
    what: "Status Line, Header নয়। Version, Status Code আর তার নাম।",
    who: "App",
    lesson: "লেসন ০৩",
  },
  {
    text: "Content-Type: text/html; charset=utf-8",
    what: "Body টা কী আর কোন Encoding এ। এটা দেখেই Browser ঠিক করে পাতা আঁকবে নাকি অন্য কিছু করবে।",
    who: "App, বা Framework নিজে",
    lesson: "এই লেসন, ০০৫",
  },
  {
    text: "Content-Encoding: zstd",
    what: "Body টা Zstandard দিয়ে ছোট করা। Browser আগে খোলে, তারপর পড়ে। Browser zstd বোঝে বলে আগেই জানিয়েছিল, তাই Caddy এটা বেছে নিয়েছে।",
    who: "Caddy, encode Directive দিয়ে",
    lesson: "এই লেসন, ০০৬",
  },
  {
    text: "Vary: Accept-Encoding",
    what: "এই উত্তর Accept-Encoding এর উপর নির্ভর করে। Cache যেন আলাদা কপি রাখে।",
    who: "Caddy",
    lesson: "এই লেসন, ০০৬",
  },
  {
    text: "Cache-Control: no-cache",
    what: "রেখে দিতে পারেন, কিন্তু প্রতিবার ব্যবহারের আগে Server কে জিজ্ঞেস করে নিন। HTML পাতার জন্য নিরাপদ পছন্দ।",
    who: "App",
    lesson: "এই লেসন, ০০৭",
  },
  {
    text: 'ETag: "p1Xr8sGm0aQe3TfK"',
    what: "এই Body এর আঙুলের ছাপ। পরের বার If-None-Match এ এটাই ফেরত আসবে।",
    who: "App",
    lesson: "এই লেসন, ০০৮",
  },
  {
    text: "Strict-Transport-Security: max-age=31536000; includeSubDomains",
    what: "এক বছর এই সাইট শুধু HTTPS এ খুলবেন। নিরাপত্তার Header, লেসন ০৭ এ পুরোটা।",
    who: "Caddy, সব পাতায় একসাথে",
    lesson: "এই লেসন, ০১২ আর লেসন ০৭",
  },
  {
    text: "X-Request-Id: 7363fa00-c570-4484-9701-1b8c99bc1651",
    what: "এই Request এর নম্বর। পর্যটক সমস্যার কথা জানালে এই নম্বর দিয়ে Log এ ঠিক এই Request টা খোঁজা যায়।",
    who: "App",
    lesson: "এই লেসন, ০১৩",
  },
];

export function HeaderInspectorLab() {
  const [side, setSide] = useState<"request" | "response">("request");
  const [picked, setPicked] = useState(1);
  const lines = side === "request" ? REQUEST_LINES : RESPONSE_LINES;
  const cur = lines[Math.min(picked, lines.length - 1)];

  return (
    <Panel
      label="Interactive"
      title="একটা আসল Request আর Response, লাইন ধরে ধরে"
      footer="উপরে বেছে নিন Request নাকি Response, তারপর যেকোনো লাইনে চাপ দিন। নিচে দেখবেন লাইনটা কী বলে, কে এটা বসায়, আর কোন লেসনে বা এই লেসনের কোন সেকশনে এর পুরো গল্প। একটা জিনিস খেয়াল করুন: Request এর Header গুলোর প্রায় কোনোটাই আপনি নিজে লেখেননি, Browser লিখেছে। আর Response এর কিছু Header লেখে App, কিছু লেখে সামনে বসা Caddy।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Label>দেখুন</Label>
        <Chip
          active={side === "request"}
          onClick={() => {
            setSide("request");
            setPicked(1);
          }}
          data-side="request"
        >
          Request, Browser থেকে
        </Chip>
        <Chip
          active={side === "response"}
          onClick={() => {
            setSide("response");
            setPicked(1);
          }}
          data-side="response"
        >
          Response, Server থেকে
        </Chip>
      </div>

      <div className="border border-border bg-background font-mono text-[0.75rem] leading-relaxed overflow-x-auto">
        {lines.map((line, i) => (
          <button
            key={line.text}
            onClick={() => setPicked(i)}
            data-line={i}
            className={cn(
              "block w-full text-left px-4 py-1.5 whitespace-nowrap transition-colors border-l-2",
              i === picked
                ? "border-primary bg-primary/10 text-primary font-bold"
                : "border-transparent text-foreground/85 hover:bg-muted/40",
            )}
          >
            {line.text}
          </button>
        ))}
        <div className="px-4 py-1.5 text-muted-foreground/70 italic">
          {side === "request" ? "(ফাঁকা লাইন, GET এ Body নেই)" : "(ফাঁকা লাইন, তারপর HTML এর Body)"}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3" data-picked={cur.text}>
        <div className="md:col-span-2 border border-primary/40 bg-primary/5 px-4 py-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-primary mb-1">এটা কী বলে</div>
          <p className="text-sm leading-relaxed text-foreground">{cur.what}</p>
        </div>
        <div className="border border-border px-4 py-3 space-y-2">
          <div>
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">কে বসায়</div>
            <p className="text-[0.8125rem] text-foreground">{cur.who}</p>
          </div>
          <div>
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">কোথায় শিখবেন</div>
            <p className="text-[0.8125rem] text-foreground">{cur.lesson}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. পাঁচটা Cache-Control, একই চারটা দেখা                                      */
/* ------------------------------------------------------------------------- */

type PolicyId = "no-store" | "no-cache" | "short" | "long" | "immutable";
type Visit = { at: string; label: string };
type Outcome = {
  source: "server-200" | "revalidate-304" | "cache" | "new-file";
  sentRequest: boolean;
  shows: "latest" | "old";
  note: string;
};

const POLICIES: { id: PolicyId; header: string; name: string }[] = [
  { id: "no-store", header: "Cache-Control: no-store", name: "কখনো রাখবেন না" },
  { id: "no-cache", header: "Cache-Control: no-cache + ETag", name: "রাখুন, প্রতিবার যাচাই" },
  { id: "short", header: "Cache-Control: max-age=60 + ETag", name: "১ মিনিট নিশ্চিন্ত" },
  { id: "long", header: "Cache-Control: max-age=86400", name: "১ দিন নিশ্চিন্ত" },
  { id: "immutable", header: "max-age=31536000, immutable + Hash নাম", name: "এক বছর, নাম বদলায়" },
];

const VISITS: Visit[] = [
  { at: "0:00", label: "প্রথম দেখা" },
  { at: "0:30", label: "৩০ সেকেন্ড পরে" },
  { at: "5:00", label: "৫ মিনিট পরে" },
  { at: "6:10", label: "৬ মিনিটে Deploy হলো, তারপর" },
];

/**
 * The outcome of each visit for each policy. The deploy lands at 6:00, so only the last visit can
 * see a changed file. Times are minutes:seconds from the first visit.
 */
const OUTCOMES: Record<PolicyId, Outcome[]> = {
  "no-store": [
    { source: "server-200", sentRequest: true, shows: "latest", note: "কিছুই রাখা নেই, পুরোটা Server থেকে।" },
    { source: "server-200", sentRequest: true, shows: "latest", note: "আবারও পুরোটা। কিছুই রাখা হয়নি।" },
    { source: "server-200", sentRequest: true, shows: "latest", note: "আবারও পুরোটা। নিরাপদ, কিন্তু প্রতিবার পুরো দাম।" },
    { source: "server-200", sentRequest: true, shows: "latest", note: "নতুন Version, কারণ সবসময়ই নতুন আনে।" },
  ],
  "no-cache": [
    { source: "server-200", sentRequest: true, shows: "latest", note: "পুরোটা এলো, সাথে একটা ETag। কপিটা রাখা হলো।" },
    { source: "revalidate-304", sentRequest: true, shows: "latest", note: "Browser জিজ্ঞেস করল, বদলেছে? উত্তর 304, Body ছাড়া।" },
    { source: "revalidate-304", sentRequest: true, shows: "latest", note: "আবার ছোট্ট একটা প্রশ্ন, আবার 304।" },
    { source: "server-200", sentRequest: true, shows: "latest", note: "ETag মেলেনি, তাই পুরো নতুন Version। পুরনোটা কখনো দেখায়নি।" },
  ],
  short: [
    { source: "server-200", sentRequest: true, shows: "latest", note: "পুরোটা এলো, ৬০ সেকেন্ডের জন্য তাজা।" },
    { source: "cache", sentRequest: false, shows: "latest", note: "এখনো তাজা, Server এ যাওয়ার দরকারই নেই। একদম সাথে সাথে।" },
    { source: "revalidate-304", sentRequest: true, shows: "latest", note: "৬০ সেকেন্ড পার, কপিটা বাসি। ETag দিয়ে জিজ্ঞেস, 304, আরও ৬০ সেকেন্ড তাজা।" },
    { source: "server-200", sentRequest: true, shows: "latest", note: "আবার বাসি, জিজ্ঞেস করল, এবার বদলেছে, তাই নতুনটা।" },
  ],
  long: [
    { source: "server-200", sentRequest: true, shows: "latest", note: "পুরোটা এলো, পুরো এক দিনের জন্য তাজা।" },
    { source: "cache", sentRequest: false, shows: "latest", note: "তাজা, Server এ যাওয়া নেই।" },
    { source: "cache", sentRequest: false, shows: "latest", note: "তাজা, Server এ যাওয়া নেই।" },
    { source: "cache", sentRequest: false, shows: "old", note: "Server এ নতুন Version আছে, কিন্তু Browser জিজ্ঞেসই করল না। পর্যটক পুরনো ফাইল দেখছেন, কাল পর্যন্ত।" },
  ],
  immutable: [
    { source: "server-200", sentRequest: true, shows: "latest", note: "app.3f9a1c.js এলো, এক বছরের জন্য।" },
    { source: "cache", sentRequest: false, shows: "latest", note: "তাজা, Server এ যাওয়া নেই।" },
    { source: "cache", sentRequest: false, shows: "latest", note: "তাজা, Server এ যাওয়া নেই।" },
    { source: "new-file", sentRequest: true, shows: "latest", note: "নতুন HTML এখন app.8b2e7d.js চায়। নতুন নাম মানে নতুন URL, Cache এ নেই, তাই নতুনটা আসে। পুরনোটা কেউ আর চায় না।" },
  ],
};

const SOURCE_LABEL: Record<Outcome["source"], string> = {
  "server-200": "Server থেকে পুরো 200",
  "revalidate-304": "যাচাই, 304",
  cache: "Browser Cache থেকে",
  "new-file": "নতুন নাম, Server থেকে 200",
};

export function CacheTimelineLab() {
  const [policy, setPolicy] = useState<PolicyId>("short");
  const [shown, setShown] = useState(1);
  const outcomes = OUTCOMES[policy];
  const visible = outcomes.slice(0, shown);
  const trips = visible.filter((o) => o.sentRequest).length;
  const fullBodies = visible.filter((o) => o.source === "server-200" || o.source === "new-file").length;
  const sawOld = visible.some((o) => o.shows === "old");

  return (
    <Panel
      label="Interactive"
      title="একই চারটা দেখা, পাঁচটা আলাদা নিয়মে"
      footer="একটা নিয়ম বেছে নিন, তারপর পরের দেখা চাপতে চাপতে শেষ পর্যন্ত যান। নিচের তিনটা সংখ্যা দেখুন: Server এ কতবার গেল, কতবার পুরো Body আনল, আর পর্যটক কখনো পুরনো জিনিস দেখলেন কি না। তারপর নিয়ম বদলে আবার করুন। no-store সবচেয়ে নিরাপদ কিন্তু সবচেয়ে খরুচে। এক দিনের max-age সবচেয়ে কম খরচের, কিন্তু Deploy এর পরে পুরনো ফাইল দেখায়। শেষ নিয়মটা দুইটা সুবিধাই নেয়, কারণ ফাইলের নাম বদলে দেয়। এজন্যই Next.js এর /_next/static এর ফাইলের নামে একটা Hash থাকে।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Label>নিয়ম</Label>
        {POLICIES.map((p) => (
          <Chip
            key={p.id}
            active={policy === p.id}
            onClick={() => {
              setPolicy(p.id);
              setShown(1);
            }}
            data-policy={p.id}
          >
            {p.name}
          </Chip>
        ))}
      </div>
      <div className="font-mono text-[0.75rem] text-primary mb-5" data-header>
        {POLICIES.find((p) => p.id === policy)?.header}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setShown((n) => Math.min(VISITS.length, n + 1))}
          disabled={shown === VISITS.length}
          data-action="next"
          className={cn(
            "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            shown === VISITS.length
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          পরের দেখা
        </button>
        <button
          onClick={() => setShown(1)}
          className="px-3 py-1.5 border border-border text-[0.6875rem] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          আবার শুরু
        </button>
      </div>

      <ol className="space-y-2 mb-6">
        {VISITS.map((v, i) => {
          const o = outcomes[i];
          const open = i < shown;
          return (
            <li
              key={v.at}
              data-visit={i}
              data-source={open ? o.source : "hidden"}
              className={cn(
                "grid grid-cols-1 sm:grid-cols-[110px_190px_1fr] gap-x-4 gap-y-1 border px-4 py-3 transition-opacity",
                open ? "opacity-100" : "opacity-30",
                open && o.shows === "old" ? "border-primary bg-primary/5" : "border-border",
              )}
            >
              <div>
                <div className="font-mono text-[0.75rem] font-bold text-foreground">{v.at}</div>
                <div className="text-[0.6875rem] text-muted-foreground">{v.label}</div>
              </div>
              <div className={cn("text-[0.8125rem] font-bold", open && o.sentRequest ? "text-primary" : "text-foreground")}>
                {open ? SOURCE_LABEL[o.source] : "..."}
              </div>
              <div className="text-[0.8125rem] text-muted-foreground leading-relaxed">{open ? o.note : ""}</div>
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border border-border px-4 py-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">Server এ গেল</div>
          <div className="font-mono text-[1.25rem] font-bold text-foreground" data-trips={trips}>
            {trips} / {shown}
          </div>
        </div>
        <div className="border border-border px-4 py-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">পুরো Body আনল</div>
          <div className="font-mono text-[1.25rem] font-bold text-foreground" data-bodies={fullBodies}>
            {fullBodies}
          </div>
        </div>
        <div className={cn("border px-4 py-3", sawOld ? "border-primary bg-primary/5" : "border-border")}>
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">পুরনো জিনিস দেখল</div>
          <div className={cn("text-[1rem] font-bold", sawOld ? "text-primary" : "text-foreground")} data-stale={sawOld ? "yes" : "no"}>
            {sawOld ? "হ্যাঁ, Deploy এর পরেও" : "না"}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Browser এর মতো করে CORS যাচাই                                           */
/* ------------------------------------------------------------------------- */

const API_ORIGIN = "https://islandtours.example";

const PAGE_ORIGINS = [
  { id: API_ORIGIN, name: "Island Tours নিজে" },
  { id: "https://admin.islandtours.example", name: "Admin প্যানেল" },
  { id: "https://seagulltours.example", name: "Partner সাইট" },
  { id: "https://attacker.example", name: "অচেনা সাইট" },
] as const;

type RequestKind = "simple" | "credentialed";
type ServerConfig = "none" | "star" | "allowlist";

const ALLOWLIST = ["https://admin.islandtours.example", "https://seagulltours.example"];

const REQUESTS: Record<RequestKind, { label: string; line: string; url: string }> = {
  simple: {
    label: "GET Tour তালিকা",
    line: "fetch(\"https://islandtours.example/api/tours\")",
    url: "https://islandtours.example/api/tours",
  },
  credentialed: {
    label: "PATCH বুকিং, Cookie সহ",
    line: "fetch(\".../api/bookings/bk_7Q2M9X\", { method: \"PATCH\", credentials: \"include\", headers: { \"Content-Type\": \"application/json\" } })",
    url: "https://islandtours.example/api/bookings/bk_7Q2M9X",
  },
};

const CONFIGS: Record<ServerConfig, { label: string; header: string }> = {
  none: { label: "কোনো CORS Header নেই", header: "(Access-Control-Allow-Origin নেই)" },
  star: { label: "Allow-Origin: *", header: "Access-Control-Allow-Origin: *" },
  allowlist: {
    label: "তালিকা থেকে, Credentials সহ",
    header: "Access-Control-Allow-Origin: <তালিকায় থাকলে সেই Origin>, Access-Control-Allow-Credentials: true",
  },
};

type CorsStep = { text: string; ok: boolean | null };
type CorsVerdict = {
  steps: CorsStep[];
  readable: boolean;
  serverActed: boolean;
  error: string | null;
};

/** Decides one request the way the browser does, from the page origin, request kind and server config. */
function decideCors(origin: string, kind: RequestKind, config: ServerConfig): CorsVerdict {
  const target = REQUESTS[kind].url;
  const blocked = (reason: string) =>
    `Access to fetch at '${target}' from origin '${origin}' has been blocked by CORS policy: ${reason}`;

  if (origin === API_ORIGIN) {
    return {
      steps: [{ text: "পাতা আর API একই Origin। CORS এর প্রশ্নই ওঠে না।", ok: true }],
      readable: true,
      serverActed: true,
      error: null,
    };
  }

  const listed = ALLOWLIST.includes(origin);
  const allowOrigin = config === "star" ? "*" : config === "allowlist" && listed ? origin : null;

  if (kind === "simple") {
    const readable = allowOrigin !== null;
    return {
      steps: [
        { text: "Simple Request: GET, বাড়তি Header নেই। Preflight লাগে না।", ok: null },
        { text: `Request সোজা Server এ গেল, Origin: ${origin}`, ok: null },
        { text: "Server উত্তর দিল 200, Tour এর তালিকা সহ।", ok: true },
        {
          text: readable
            ? `উত্তরে Access-Control-Allow-Origin: ${allowOrigin}। Browser মিলিয়ে দেখল, মিলেছে।`
            : "উত্তরে মিলে যাওয়ার মতো Access-Control-Allow-Origin নেই। Browser উত্তরটা লুকিয়ে ফেলল।",
          ok: readable,
        },
      ],
      readable,
      serverActed: true,
      error: readable ? null : blocked("No 'Access-Control-Allow-Origin' header is present on the requested resource."),
    };
  }

  const preflightSteps: CorsStep[] = [
    { text: "PATCH আর JSON এর Content-Type, তাই আগে Preflight লাগবে।", ok: null },
    { text: `OPTIONS গেল, Origin: ${origin}, Access-Control-Request-Method: PATCH`, ok: null },
  ];

  if (allowOrigin === null) {
    return {
      steps: [
        ...preflightSteps,
        { text: "Preflight এর উত্তরে মিলে যাওয়ার মতো Allow-Origin নেই।", ok: false },
        { text: "আসল PATCH কখনো পাঠানোই হলো না। বুকিং যেমন ছিল তেমনই।", ok: null },
      ],
      readable: false,
      serverActed: false,
      error: blocked(
        "Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.",
      ),
    };
  }

  if (allowOrigin === "*") {
    return {
      steps: [
        ...preflightSteps,
        { text: "Preflight এর উত্তরে Allow-Origin: *। কিন্তু Request টা Cookie সহ।", ok: false },
        { text: "Cookie সহ Request এ * চলে না। আসল PATCH পাঠানো হলো না।", ok: null },
      ],
      readable: false,
      serverActed: false,
      error: blocked(
        "Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.",
      ),
    };
  }

  return {
    steps: [
      ...preflightSteps,
      { text: `Preflight এর উত্তর 204: Allow-Origin ${origin}, Allow-Methods এ PATCH, Allow-Credentials: true।`, ok: true },
      { text: "এবার আসল PATCH গেল, Cookie সহ। Server বুকিং বদলাল, উত্তর 200।", ok: true },
      { text: "উত্তরেও Allow-Origin মিলল। JavaScript উত্তরটা পড়তে পারল।", ok: true },
    ],
    readable: true,
    serverActed: true,
    error: null,
  };
}

export function CorsCheckLab() {
  const [origin, setOrigin] = useState<string>("https://seagulltours.example");
  const [kind, setKind] = useState<RequestKind>("simple");
  const [config, setConfig] = useState<ServerConfig>("none");
  const verdict = decideCors(origin, kind, config);

  return (
    <Panel
      label="Interactive"
      title="Browser এর চোখে CORS, তিনটা প্রশ্নে"
      footer="তিনটা জিনিস বদলান: পাতাটা কোন Origin এ, JavaScript কী চাইছে, আর API কী Header দেয়। নিচে Browser ধাপে ধাপে যা করে তা দেখবেন, আর শেষে Console এ যে লেখাটা আসত সেটা। চারটা জিনিস নিজে আবিষ্কার করুন। এক, Island Tours নিজের পাতা থেকে কখনো CORS Error পায় না। দুই, GET এর বেলায় আটকে গেলেও Server কাজটা করে ফেলেছে, শুধু উত্তরটা লুকানো। তিন, PATCH এর বেলায় Preflight আটকালে আসল Request যায়ই না। চার, Cookie সহ Request এ * কখনো চলে না।"
    >
      <div className="space-y-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Label>পাতা চলছে</Label>
          {PAGE_ORIGINS.map((o) => (
            <Chip key={o.id} active={origin === o.id} onClick={() => setOrigin(o.id)} data-origin={o.id}>
              {o.name}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Label>JavaScript চায়</Label>
          {(Object.keys(REQUESTS) as RequestKind[]).map((k) => (
            <Chip key={k} active={kind === k} onClick={() => setKind(k)} data-kind={k}>
              {REQUESTS[k].label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Label>API দেয়</Label>
          {(Object.keys(CONFIGS) as ServerConfig[]).map((c) => (
            <Chip key={c} active={config === c} onClick={() => setConfig(c)} data-config={c}>
              {CONFIGS[c].label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="border border-border bg-background px-4 py-3 mb-4 font-mono text-[0.6875rem] leading-relaxed overflow-x-auto">
        <div className="text-muted-foreground whitespace-nowrap">{`// পাতা: ${origin}`}</div>
        <div className="text-foreground whitespace-nowrap">{REQUESTS[kind].line}</div>
        <div className="text-muted-foreground whitespace-nowrap">{`// API: ${CONFIGS[config].header}`}</div>
      </div>

      <ol className="space-y-2 mb-5">
        {verdict.steps.map((s, i) => (
          <li key={`${i}-${s.text}`} className="flex items-start gap-3 text-[0.8125rem] leading-relaxed">
            <span
              className={cn(
                "mt-0.5 inline-flex items-center justify-center w-5 h-5 border shrink-0",
                s.ok === true && "border-primary text-primary",
                s.ok === false && "border-foreground text-foreground",
                s.ok === null && "border-border text-muted-foreground",
              )}
            >
              {s.ok === true ? <Check className="w-3 h-3" /> : s.ok === false ? <X className="w-3 h-3" /> : <span className="font-mono text-[0.625rem]">{i + 1}</span>}
            </span>
            <span className="text-foreground/90">{s.text}</span>
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className={cn("border px-4 py-3", verdict.readable ? "border-primary bg-primary/5" : "border-border")}>
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">JavaScript উত্তর পড়তে পারল</div>
          <div className={cn("text-[1rem] font-bold", verdict.readable ? "text-primary" : "text-foreground")} data-readable={verdict.readable ? "yes" : "no"}>
            {verdict.readable ? "হ্যাঁ" : "না"}
          </div>
        </div>
        <div className="border border-border px-4 py-3">
          <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">Server আসল কাজটা করল</div>
          <div className="text-[1rem] font-bold text-foreground" data-server-acted={verdict.serverActed ? "yes" : "no"}>
            {verdict.serverActed ? "হ্যাঁ" : "না, Request পৌঁছায়নি"}
          </div>
        </div>
      </div>

      {verdict.error && (
        <div className="border border-border bg-muted/30 px-4 py-3 font-mono text-[0.6875rem] leading-relaxed text-foreground break-words" data-console-error>
          <span className="text-primary font-bold">Console: </span>
          {verdict.error}
        </div>
      )}
    </Panel>
  );
}
