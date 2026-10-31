/**
 * What: The hands-on labs for the URL vs URI lesson: a URL inspector, an encoding comparer, a
 * relative link resolver and an origin checker. Each one runs the browser's own URL parser live.
 *
 * Why: Reading that a fragment never reaches the server, or that encodeURI breaks a query value,
 * is easy to forget. Typing a URL and watching the real parser take it apart is not. Nothing here
 * is a hand-written imitation of the rules, so whatever the reader tries, the answer is the one a
 * real browser would give.
 */
"use client";

import { cn } from "@/lib/utils";
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
  mono,
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  mono?: boolean;
} & Record<`data-${string}`, string | number>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={cn(
        "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors text-left break-all",
        mono && "font-mono",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}

function Tag({ tone, children }: { tone: "primary" | "muted"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-block px-1.5 py-0.5 border text-[0.5625rem] font-bold uppercase tracking-[0.08em] whitespace-nowrap",
        tone === "primary" ? "border-primary/60 text-primary" : "border-border text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

function parseUrl(value: string, base?: string): URL | null {
  try {
    return new URL(value, base);
  } catch {
    return null;
  }
}

const DEFAULT_PORTS: Record<string, string> = {
  "http:": "80",
  "https:": "443",
  "ws:": "80",
  "wss:": "443",
};

/* ------------------------------------------------------------------------- */
/* 1. URL Inspector                                                           */
/* ------------------------------------------------------------------------- */

const INSPECT_PRESETS = [
  {
    id: "tour",
    label: "Tour এর পাতা",
    url: "https://islandtours.example:443/tours/saint-martin?date=2026-12-20&guests=2#reviews",
  },
  { id: "trick", label: "@ এর কৌশল", url: "https://islandtours.example@attacker.example/login" },
  { id: "ipv6", label: "IPv6 Host", url: "http://[2001:db8::7334]:8080/status" },
  { id: "bangla", label: "বাংলা Host আর Query", url: "https://দ্বীপ.example/tours?q=সেন্ট মার্টিন" },
  { id: "mailto", label: "mailto", url: "mailto:help@mail.example?subject=Booking" },
  { id: "ws", label: "WebSocket", url: "wss://islandtours.example/ws" },
];

function InspectRow({
  name,
  value,
  note,
  tag,
}: {
  name: string;
  value: string;
  note?: string;
  tag?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_auto] gap-x-4 gap-y-1 py-2.5 border-b border-border last:border-b-0 items-baseline">
      <span className="font-mono text-[0.6875rem] font-bold text-muted-foreground">{name}</span>
      <span className="min-w-0">
        <span className={cn("font-mono text-[0.8125rem] break-all", value ? "text-foreground" : "text-muted-foreground/50")}>
          {value || "(খালি)"}
        </span>
        {note && <span className="block text-[0.6875rem] text-muted-foreground mt-0.5">{note}</span>}
      </span>
      <span>{tag}</span>
    </div>
  );
}

export function UrlInspectorLab() {
  const [value, setValue] = useState(INSPECT_PRESETS[0].url);
  const url = parseUrl(value);
  const isWeb = url !== null && (url.protocol === "http:" || url.protocol === "https:");
  const defaultPort = url ? DEFAULT_PORTS[url.protocol] : undefined;
  const params = url ? [...url.searchParams] : [];

  return (
    <Panel
      label="Interactive"
      title="URL Inspector, Browser এর নিজের Parser দিয়ে"
      footer="উপরের যেকোনো একটা বেছে নিন, অথবা নিচের ঘরে নিজের একটা URL লিখুন বা Browser থেকে Paste করুন। প্রতিটা টুকরো এখানে আলাদা করছে আপনার Browser এর নিজের URL Parser, ঠিক যেটা Address Bar এ কাজ করে। খেয়াল করুন তিনটা জিনিস। @ এর কৌশলে আসল Host কোনটা। বাংলা Host টা কীভাবে xn-- হয়ে গেল আর Query টা শতাংশ চিহ্নে। আর সবার নিচে Server এর কাছে যে লাইনটা যাবে, তাতে Fragment নেই।"
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {INSPECT_PRESETS.map((preset) => (
          <Chip
            key={preset.id}
            active={value === preset.url}
            onClick={() => setValue(preset.url)}
            data-preset={preset.id}
          >
            {preset.label}
          </Chip>
        ))}
      </div>
      <label className="block mb-5">
        <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">
          URL লিখুন
        </span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck={false}
          data-input="url"
          className="w-full border border-border bg-background px-3 py-2 font-mono text-[0.8125rem] text-foreground focus:outline-none focus:border-primary"
        />
      </label>

      {url === null ? (
        <div className="border border-primary/60 bg-primary/5 px-4 py-3 text-sm" data-result="invalid">
          এটা একটা সম্পূর্ণ URL নয়, তাই Parser ভেঙে ফেলতে পারল না। সবচেয়ে সাধারণ কারণ হলো
          শুরুতে Scheme নেই, যেমন <code>https://</code>। Address Bar এ Scheme ছাড়া লিখলে
          Browser নিজে থেকে <code>https://</code> জুড়ে দেয় বা লেখাটা Search এ পাঠায়, কিন্তু
          Code এর ভেতরে <code>new URL()</code> এই দয়া করে না।
        </div>
      ) : (
        <div data-result="parsed">
          <div className="border border-border bg-background px-4">
            <InspectRow name="protocol" value={url.protocol} note="Scheme, শেষের কোলন সহ" tag={<Tag tone="muted">Browser</Tag>} />
            {(url.username || url.password) && (
              <InspectRow
                name="username"
                value={url.username + (url.password ? `:${url.password}` : "")}
                note="@ এর আগের সবটুকু userinfo, এটা Host নয়। আসল গন্তব্য নিচের hostname।"
                tag={<Tag tone="primary">সাবধান</Tag>}
              />
            )}
            <InspectRow
              name="hostname"
              value={url.hostname}
              note={url.hostname.startsWith("xn--") || url.hostname.includes(".xn--") ? "বাংলা নাম Punycode এ বদলে গেছে" : undefined}
              tag={isWeb ? <Tag tone="muted">DNS এ যায়</Tag> : undefined}
            />
            <InspectRow
              name="port"
              value={url.port}
              note={
                url.port
                  ? "নিজে লেখা Port"
                  : defaultPort
                    ? `খালি, তাই ${url.protocol} এর Default Port ${defaultPort} ধরা হবে`
                    : "এই Scheme এ Port এর কোনো মানে নেই"
              }
              tag={defaultPort ? <Tag tone="muted">TCP তে যায়</Tag> : undefined}
            />
            <InspectRow name="pathname" value={url.pathname} tag={isWeb ? <Tag tone="primary">Server এ যায়</Tag> : undefined} />
            <InspectRow name="search" value={url.search} tag={isWeb ? <Tag tone="primary">Server এ যায়</Tag> : undefined} />
            {params.map(([key, paramValue], i) => (
              <InspectRow key={`${key}-${i}`} name={`  · ${key}`} value={paramValue} note="URLSearchParams যা পড়ল, Decode করার পরে" />
            ))}
            <InspectRow name="hash" value={url.hash} tag={url.hash ? <Tag tone="muted">Browser এ থাকে</Tag> : undefined} />
            <InspectRow name="origin" value={url.origin === "null" ? "null" : url.origin} note="Scheme, Host আর Port মিলে" />
          </div>

          {isWeb && (
            <div className="mt-5">
              <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">
                Server এর কাছে যা যাবে, প্রথম দুই লাইন
              </span>
              <pre className="border border-primary/50 bg-primary/5 px-4 py-3 font-mono text-[0.8125rem] text-foreground overflow-x-auto" data-result="request-line">
                {`GET ${url.pathname}${url.search} HTTP/1.1\nHost: ${url.host}`}
              </pre>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Encoding তুলনা                                                          */
/* ------------------------------------------------------------------------- */

const ENCODE_PRESETS = ["সেন্ট মার্টিন", "beach & family", "50% off", "a/b?c#d"];

function safeEncode(fn: (text: string) => string, text: string) {
  try {
    return fn(text);
  } catch {
    return "(এই লেখা Encode করা যায় না)";
  }
}

export function EncodeCompareLab() {
  const [text, setText] = useState(ENCODE_PRESETS[0]);
  const byComponent = safeEncode(encodeURIComponent, text);
  const byUri = safeEncode(encodeURI, text);
  const byParams = new URLSearchParams({ q: text }).toString();

  const base = "https://islandtours.example/api/tours?q=";
  const readBack = (encoded: string) => {
    const url = parseUrl(base + encoded);
    return url ? [...url.searchParams] : [];
  };
  const fromComponent = readBack(byComponent);
  const fromUri = readBack(byUri);
  const uriBroke = fromUri.length !== 1 || fromUri[0][1] !== text;

  const rows = [
    { name: "encodeURIComponent(text)", out: byComponent, read: fromComponent, broke: false, good: true },
    { name: "encodeURI(text)", out: byUri, read: fromUri, broke: uriBroke, good: false },
  ];

  return (
    <Panel
      label="Interactive"
      title="একই লেখা, তিন রকম Encoding"
      footer="একটা লেখা বেছে নিন বা নিজে লিখুন। প্রথমে দেখুন তিনটা উপায়ে লেখাটা কেমন হলো। তারপর নিচের অংশটা দেখুন: লেখাটাকে Query এর q এর মান হিসেবে বসিয়ে Server কী পড়বে। beach & family বেছে নিলে encodeURI এর ঘরে দেখবেন Server একটা মানের জায়গায় দুইটা Key পেয়েছে, কারণ encodeURI & চিহ্নটা ছুঁয়েও দেখেনি। এই একটা পর্যবেক্ষণই নিয়মটা: একটা মান Encode করতে encodeURIComponent, পুরো URL নয়।"
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {ENCODE_PRESETS.map((preset) => (
          <Chip key={preset} active={text === preset} onClick={() => setText(preset)} data-preset={preset}>
            {preset}
          </Chip>
        ))}
      </div>
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        spellCheck={false}
        data-input="text"
        className="w-full border border-border bg-background px-3 py-2 font-mono text-[0.8125rem] text-foreground focus:outline-none focus:border-primary mb-6"
      />

      <div className="grid grid-cols-1 gap-3 mb-6">
        {[
          { name: "encodeURIComponent(text)", out: byComponent, note: "একটা মানের জন্য। & / ? # = সবই বদলায়, Space হয় %20" },
          { name: "encodeURI(text)", out: byUri, note: "পুরো URL এর জন্য। URL এর নিজের চিহ্ন গুলো ছেড়ে দেয়" },
          { name: "new URLSearchParams({ q: text })", out: byParams, note: "HTML Form এর নিয়ম। Space হয় +, পুরো q=... জোড়াটা বানায়" },
        ].map((row) => (
          <div key={row.name} className="border border-border bg-background px-4 py-3">
            <div className="font-mono text-[0.6875rem] font-bold text-muted-foreground mb-1">{row.name}</div>
            <div className="font-mono text-[0.8125rem] text-primary break-all" data-encoded={row.name}>
              {row.out}
            </div>
            <div className="text-[0.6875rem] text-muted-foreground mt-1">{row.note}</div>
          </div>
        ))}
      </div>

      <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">
        Query তে বসালে Server কী পড়বে
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rows.map((row) => (
          <div
            key={row.name}
            data-readback={row.good ? "component" : "uri"}
            data-broke={row.broke ? "yes" : "no"}
            className={cn("border px-4 py-3", row.broke ? "border-primary/60 bg-primary/5" : "border-border bg-background")}
          >
            <div className="font-mono text-[0.6875rem] font-bold text-muted-foreground mb-2">{row.name}</div>
            {row.read.length === 0 && <div className="text-[0.75rem] text-muted-foreground">কোনো Key পাওয়া যায়নি</div>}
            {row.read.map(([key, paramValue], i) => (
              <div key={`${key}-${i}`} className="font-mono text-[0.75rem] text-foreground break-all">
                <span className="text-muted-foreground">key</span> {JSON.stringify(key)}{" "}
                <span className="text-muted-foreground">value</span> {JSON.stringify(paramValue)}
              </div>
            ))}
            <div className={cn("text-[0.6875rem] mt-2 font-bold", row.broke ? "text-primary" : "text-muted-foreground")}>
              {row.broke ? "মান ভেঙে গেছে, Server যা পেল তা পর্যটক লেখেননি" : "Server ঠিক সেই লেখাটাই পেল"}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Relative URL কোথায় গিয়ে দাঁড়ায়                                          */
/* ------------------------------------------------------------------------- */

const BASES = ["https://islandtours.example/tours/saint-martin", "https://islandtours.example/tours/saint-martin/"];

const RELATIVES: { ref: string; why: string }[] = [
  { ref: "photos/boat.jpg", why: "শুরুতে / নেই, তাই Base এর শেষ / পর্যন্ত রেখে বাকিটা বদলায়, ঠিক Folder এর ভেতরের File এর মতো। শেষ / এর পরের অংশটাকে Browser File এর নাম ধরে নেয় আর ফেলে দেয়।" },
  { ref: "reviews", why: "একই নিয়ম। শেষ / এর পরের saint-martin অংশটা বাদ পড়ল কি না, সেটা নির্ভর করে Base এর শেষে / আছে কি না তার উপর।" },
  { ref: "../sajek-valley", why: ".. মানে এক ধাপ উপরে, Terminal এর cd .. এর মতো।" },
  { ref: "/api/tours", why: "শুরুতে / মানে Host এর গোড়া থেকে। Base এর Path পুরোটা বাদ। তাই দুই Base এই ফল একই।" },
  { ref: "?guests=4", why: "শুধু Query বদলায়, Path যেমন ছিল তেমনই থাকে।" },
  { ref: "#reviews", why: "শুধু Fragment। একই পাতা, নতুন কোনো Request ই যায় না।" },
  { ref: "//cdn.islandtours.example/img/boat.jpg", why: "দুইটা / মানে নতুন Host, শুধু Scheme টা Base থেকে ধার করা।" },
  { ref: "https://seagulltours.example/", why: "Scheme সহ পূর্ণ URL, Base এর কিছুই লাগে না।" },
];

export function RelativeResolveLab() {
  const [base, setBase] = useState(BASES[0]);
  const [ref, setRef] = useState(RELATIVES[0].ref);
  const resolved = parseUrl(ref, base);
  const otherBase = base === BASES[0] ? BASES[1] : BASES[0];
  const otherHref = parseUrl(ref, otherBase)?.href ?? null;
  const current = RELATIVES.find((r) => r.ref === ref);
  const differs = resolved !== null && otherHref !== null && resolved.href !== otherHref;

  return (
    <Panel
      label="Interactive"
      title="Relative লিংক, কোন Base এর সাপেক্ষে"
      footer="প্রথমে একটা Base বেছে নিন, মানে যে পাতায় লিংকটা লেখা আছে। দুইটা Base এর তফাত শুধু শেষের একটা /। তারপর একটা লিংক বেছে নিন আর দেখুন Browser সেটাকে কোন পূর্ণ URL এ বদলায়। এবার লিংক না বদলে শুধু Base টা বদলান। photos/boat.jpg একবার যায় /tours/photos এ, আরেকবার /tours/saint-martin/photos এ। ওই একটা / এর জন্য এই তফাত, আর Production এ ভাঙা ছবি আর ভাঙা লিংকের একটা বড় কারণ এটাই।"
    >
      <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">Base, মানে বর্তমান পাতা</span>
      <div className="flex flex-wrap gap-2 mb-4">
        {BASES.map((b) => (
          <Chip key={b} mono active={base === b} onClick={() => setBase(b)} data-base={b.endsWith("/") ? "slash" : "no-slash"}>
            {b}
          </Chip>
        ))}
      </div>
      <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">পাতার ভেতরের লিংক, href এ যা লেখা</span>
      <div className="flex flex-wrap gap-2 mb-6">
        {RELATIVES.map((r) => (
          <Chip key={r.ref} mono active={ref === r.ref} onClick={() => setRef(r.ref)} data-ref={r.ref}>
            {r.ref}
          </Chip>
        ))}
      </div>

      <div className="border border-primary/50 bg-primary/5 px-4 py-3 mb-3">
        <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">Browser যেখানে যাবে</div>
        <div className="font-mono text-[0.875rem] font-bold text-primary break-all" data-result="resolved">
          {resolved ? resolved.href : "(ভাঙা লিংক)"}
        </div>
      </div>
      {current && <p className="text-sm text-muted-foreground leading-relaxed">{current.why}</p>}
      {differs && (
        <p className="text-sm text-foreground leading-relaxed mt-2" data-result="differs">
          অন্য Base এ এই একই লিংক যেত <code className="font-mono text-primary break-all">{otherHref}</code>। তফাতটা শুধু Base এর শেষের / এর জন্য।
        </p>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Origin মেলানো                                                           */
/* ------------------------------------------------------------------------- */

const ORIGIN_REFERENCE = "https://islandtours.example/tours/saint-martin";

const ORIGIN_CANDIDATES: { url: string; note: string }[] = [
  { url: "https://islandtours.example/api/tours?guests=2", note: "Path আর Query আলাদা, কিন্তু Origin এ Path গোনা হয় না।" },
  { url: "http://islandtours.example/tours", note: "শুধু Scheme আলাদা। http আর https দুইটা আলাদা দুনিয়া।" },
  { url: "https://www.islandtours.example/tours", note: "www একটা আলাদা Host। একই কোম্পানি, তবু আলাদা Origin।" },
  { url: "https://api.islandtours.example/tours", note: "আলাদা Host। Browser এর চোখে এটা অন্য একজন, তাই এই API ডাকতে CORS লাগবে (লেসন ০৪)।" },
  { url: "https://islandtours.example:8443/tours", note: "Port আলাদা। একই যন্ত্র, অন্য দরজা, অন্য Origin।" },
  { url: "https://ISLANDTOURS.example:443/tours", note: "বড় হাতের অক্ষর আর লেখা 443, দুইটাই Parser মুছে দেয়। তাই Origin একই।" },
  { url: "https://seagulltours.example/widget", note: "পুরো আলাদা Domain। সঙ্গী সাইট, অন্য Origin।" },
];

function effectivePort(url: URL) {
  return url.port || DEFAULT_PORTS[url.protocol] || "";
}

export function OriginCheckLab() {
  const reference = new URL(ORIGIN_REFERENCE);
  const [picked, setPicked] = useState(ORIGIN_CANDIDATES[0].url);
  const candidate = new URL(picked);
  const note = ORIGIN_CANDIDATES.find((c) => c.url === picked)?.note;
  const checks = [
    { part: "Scheme", a: reference.protocol.replace(":", ""), b: candidate.protocol.replace(":", "") },
    { part: "Host", a: reference.hostname, b: candidate.hostname },
    { part: "Port", a: effectivePort(reference), b: effectivePort(candidate) },
  ];
  const same = reference.origin === candidate.origin;

  return (
    <Panel
      label="Interactive"
      title="দুইটা URL, একই Origin কি না"
      footer="উপরের পাতাটা স্থির, Island Tours এর Saint Martin ট্যুর। নিচ থেকে একটা একটা করে URL বেছে নিন আর তিনটা ঘর দেখুন: Scheme, Host, Port। তিনটাই মিললে Same Origin, একটাও না মিললে Cross Origin। Path, Query আর Fragment এখানে কোনো ভূমিকা রাখে না। এই তিন ঘরের নিয়মটা মনে রাখুন, কারণ লেসন ০৪ এর CORS আর লেসন ০৫ এর Cookie দুইটাই এর উপর দাঁড়িয়ে।"
    >
      <div className="border border-border bg-background px-4 py-3 mb-4">
        <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">যে পাতা খোলা আছে</div>
        <div className="font-mono text-[0.8125rem] text-foreground break-all">{ORIGIN_REFERENCE}</div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {ORIGIN_CANDIDATES.map((c) => (
          <Chip key={c.url} mono active={picked === c.url} onClick={() => setPicked(c.url)} data-candidate={c.url}>
            {c.url}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {checks.map((check) => {
          const match = check.a === check.b;
          return (
            <div
              key={check.part}
              data-part={check.part}
              data-match={match ? "yes" : "no"}
              className={cn("border px-4 py-3", match ? "border-border bg-background" : "border-primary/60 bg-primary/5")}
            >
              <div className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1">{check.part}</div>
              <div className="font-mono text-[0.75rem] text-muted-foreground break-all">{check.a}</div>
              <div className={cn("font-mono text-[0.75rem] break-all", match ? "text-foreground" : "text-primary font-bold")}>{check.b}</div>
              <div className={cn("text-[0.6875rem] mt-1 font-bold", match ? "text-muted-foreground" : "text-primary")}>
                {match ? "মিলেছে" : "মেলেনি"}
              </div>
            </div>
          );
        })}
      </div>

      <div
        data-result={same ? "same" : "cross"}
        className={cn("border px-4 py-3 mb-3", same ? "border-primary/50 bg-primary/5" : "border-border bg-muted/30")}
      >
        <span className="font-mono text-[0.9375rem] font-bold text-primary">{same ? "Same Origin" : "Cross Origin"}</span>
        <span className="block font-mono text-[0.75rem] text-muted-foreground mt-1 break-all">
          {reference.origin} {same ? "=" : "≠"} {candidate.origin}
        </span>
      </div>
      {note && <p className="text-sm text-muted-foreground leading-relaxed">{note}</p>}
    </Panel>
  );
}
