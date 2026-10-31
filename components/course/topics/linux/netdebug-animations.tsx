/**
 * What: The interactive labs for Module 07 Lesson 09, Network Debugging. NetdebugSsLab
 * lets the reader switch ss flags and see which lines and columns appear. NetdebugErrorLab
 * decodes one error message at a time: which layer broke, what happened on the wire and
 * the first command to run. NetdebugOutsideInLab is a small incident drill: a hidden fault,
 * seven checks, and the reader finds the first one that fails.
 *
 * Why: Reading a list of flags or error texts does not stick; choosing them does. Every
 * line these labs print comes from the practice server runs in the lesson, shortened where
 * noted. All state is changed from event handlers and everything else is derived, so no
 * state is ever set inside an effect.
 */
"use client";

import { cn } from "@/lib/utils";
import { Check, RotateCcw, X } from "lucide-react";
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
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
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

function Terminal({ prompt, command, lines }: { prompt: string; command: string; lines: string[] }) {
  return (
    <pre className="overflow-x-auto border border-border bg-background p-4 font-mono text-[0.75rem] leading-relaxed text-foreground">
      <span className="text-muted-foreground">{prompt}</span> {command}
      {lines.map((line, i) => (
        <span key={i} className="block whitespace-pre">
          {line}
        </span>
      ))}
    </pre>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. ss এর Flag বদলান, তালিকা বদলাবে                                          */
/* ------------------------------------------------------------------------- */

type SockState = "LISTEN" | "UNCONN" | "ESTAB" | "TIME-WAIT";

type Sock = {
  proto: "tcp" | "udp";
  state: SockState;
  recvQ: string;
  sendQ: string;
  local: string;
  localName: string;
  peer: string;
  peerName: string;
  process: string;
  owner: string;
};

// Captured from the practice server with ss -tanp and ss -uanp, shortened: Docker's own resolver
// lines, the 127.0.0.54 resolver lines and the IPv6 twins of 22 and 6379 are left out.
const SOCKETS: Sock[] = [
  { proto: "tcp", state: "LISTEN", recvQ: "0", sendQ: "4096", local: "127.0.0.53%lo:53", localName: "127.0.0.53%lo:domain", peer: "0.0.0.0:*", peerName: "0.0.0.0:*", process: 'users:(("systemd-resolve",pid=602,fd=15))', owner: "systemd-resolve" },
  { proto: "tcp", state: "LISTEN", recvQ: "0", sendQ: "4096", local: "127.0.0.1:2019", localName: "127.0.0.1:2019", peer: "0.0.0.0:*", peerName: "0.0.0.0:*", process: 'users:(("caddy",pid=1391,fd=3))', owner: "caddy" },
  { proto: "tcp", state: "LISTEN", recvQ: "0", sendQ: "511", local: "0.0.0.0:8080", localName: "0.0.0.0:http-alt", peer: "0.0.0.0:*", peerName: "0.0.0.0:*", process: 'users:(("node",pid=909,fd=24))', owner: "deploy" },
  { proto: "tcp", state: "LISTEN", recvQ: "0", sendQ: "511", local: "127.0.0.1:6379", localName: "127.0.0.1:redis", peer: "0.0.0.0:*", peerName: "0.0.0.0:*", process: 'users:(("redis-server",pid=883,fd=6))', owner: "redis" },
  { proto: "tcp", state: "LISTEN", recvQ: "0", sendQ: "4096", local: "0.0.0.0:22", localName: "0.0.0.0:ssh", peer: "0.0.0.0:*", peerName: "0.0.0.0:*", process: 'users:(("sshd",pid=930,fd=3),("systemd",pid=1,fd=92))', owner: "root" },
  { proto: "tcp", state: "LISTEN", recvQ: "0", sendQ: "511", local: "127.0.0.1:3000", localName: "127.0.0.1:3000", peer: "0.0.0.0:*", peerName: "0.0.0.0:*", process: 'users:(("node",pid=1220,fd=24))', owner: "mytours" },
  { proto: "tcp", state: "LISTEN", recvQ: "0", sendQ: "4096", local: "*:443", localName: "*:https", peer: "*:*", peerName: "*:*", process: 'users:(("caddy",pid=1391,fd=7))', owner: "caddy" },
  { proto: "tcp", state: "LISTEN", recvQ: "0", sendQ: "4096", local: "*:80", localName: "*:http", peer: "*:*", peerName: "*:*", process: 'users:(("caddy",pid=1391,fd=9))', owner: "caddy" },
  { proto: "tcp", state: "ESTAB", recvQ: "0", sendQ: "0", local: "127.0.0.1:41408", localName: "127.0.0.1:41408", peer: "127.0.0.1:3000", peerName: "127.0.0.1:3000", process: 'users:(("caddy",pid=1391,fd=14))', owner: "caddy" },
  { proto: "tcp", state: "ESTAB", recvQ: "0", sendQ: "0", local: "127.0.0.1:3000", localName: "127.0.0.1:3000", peer: "127.0.0.1:41408", peerName: "127.0.0.1:41408", process: 'users:(("node",pid=1220,fd=25))', owner: "mytours" },
  { proto: "tcp", state: "ESTAB", recvQ: "0", sendQ: "0", local: "[::ffff:103.94.135.2]:443", localName: "[::ffff:103.94.135.2]:https", peer: "[::ffff:103.94.135.77]:37898", peerName: "[::ffff:103.94.135.77]:37898", process: 'users:(("caddy",pid=1391,fd=10))', owner: "caddy" },
  { proto: "tcp", state: "TIME-WAIT", recvQ: "0", sendQ: "0", local: "127.0.0.1:41380", localName: "127.0.0.1:41380", peer: "127.0.0.1:3000", peerName: "127.0.0.1:3000", process: "", owner: "" },
  { proto: "tcp", state: "TIME-WAIT", recvQ: "0", sendQ: "0", local: "127.0.0.1:41382", localName: "127.0.0.1:41382", peer: "127.0.0.1:3000", peerName: "127.0.0.1:3000", process: "", owner: "" },
  { proto: "udp", state: "UNCONN", recvQ: "0", sendQ: "0", local: "127.0.0.53%lo:53", localName: "127.0.0.53%lo:domain", peer: "0.0.0.0:*", peerName: "0.0.0.0:*", process: 'users:(("systemd-resolve",pid=602,fd=14))', owner: "systemd-resolve" },
  { proto: "udp", state: "UNCONN", recvQ: "0", sendQ: "0", local: "*:443", localName: "*:https", peer: "*:*", peerName: "*:*", process: 'users:(("caddy",pid=1391,fd=8))', owner: "caddy" },
];

type SsFlags = { t: boolean; u: boolean; l: boolean; a: boolean; n: boolean; p: boolean };
type Runner = "root" | "deploy";

const FLAG_HELP: Record<keyof SsFlags, string> = {
  t: "TCP Socket",
  u: "UDP Socket",
  l: "শুধু যারা শুনছে",
  a: "সব অবস্থা, শোনা আর কথা বলা দুইটাই",
  n: "নাম নয়, সংখ্যা",
  p: "কোন Process",
};

function visibleSockets(flags: SsFlags): Sock[] {
  return SOCKETS.filter((s) => {
    if (s.proto === "tcp" && !flags.t) return false;
    if (s.proto === "udp" && !flags.u) return false;
    const listening = s.state === "LISTEN" || s.state === "UNCONN";
    if (flags.a) return true;
    if (flags.l) return listening;
    // With neither -l nor -a, ss shows only connected sockets, and leaves TIME-WAIT out.
    return s.state === "ESTAB";
  });
}

function ssLine(s: Sock, flags: SsFlags, runner: Runner, showProto: boolean): string {
  const local = flags.n ? s.local : s.localName;
  const peer = flags.n ? s.peer : s.peerName;
  const canSee = runner === "root" || s.owner === "deploy";
  const proc = flags.p && canSee ? s.process : "";
  const head = showProto ? `${s.proto.padEnd(6)}` : "";
  return `${head}${s.state.padEnd(10)}${s.recvQ.padStart(4)}  ${s.sendQ.padStart(6)}  ${local.padEnd(32)}${peer.padEnd(31)}${proc}`;
}

export function NetdebugSsLab() {
  const [flags, setFlags] = useState<SsFlags>({ t: true, u: false, l: true, a: false, n: true, p: true });
  const [runner, setRunner] = useState<Runner>("root");

  function toggle(key: keyof SsFlags) {
    setFlags((current) => {
      const next = { ...current, [key]: !current[key] };
      // -l and -a ask opposite questions, so turning one on turns the other off.
      if (key === "l" && next.l) next.a = false;
      if (key === "a" && next.a) next.l = false;
      return next;
    });
  }

  const letters = (Object.keys(flags) as (keyof SsFlags)[]).filter((k) => flags[k]).join("");
  const command = `${runner === "root" ? "sudo " : ""}ss${letters ? ` -${letters}` : ""}`;
  const noKind = !flags.t && !flags.u;
  const rows = noKind ? [] : visibleSockets(flags);
  const showProto = flags.t && flags.u;
  const header = `${showProto ? "Netid ".padEnd(6) : ""}${"State".padEnd(10)}${"Recv-Q".padStart(4)} ${"Send-Q".padStart(6)}  ${"Local Address:Port".padEnd(32)}${"Peer Address:Port".padEnd(31)}${flags.p ? "Process" : ""}`;
  const hidden = flags.p && runner === "deploy" ? rows.filter((r) => r.owner && r.owner !== "deploy").length : 0;

  const note = noKind
    ? "-t বা -u কোনোটাই না দিলে ss সব ধরনের Socket দেখায়, Unix Socket সহ। আসল Server এ সেটা শত শত লাইন। তাই প্রায় সবসময় -t বা -u দিয়ে শুরু করুন।"
    : rows.length === 0
      ? "এই প্রশ্নের উত্তরে কোনো লাইন নেই। -l বা -a ছাড়া ss শুধু চলমান কথোপকথন দেখায়, আর UDP তে এই Server এ কোনো চলমান কথোপকথন নেই।"
      : !flags.l && !flags.a
        ? "-l বা -a ছাড়া ss শুধু ESTAB, মানে এই মুহূর্তে চলমান Connection দেখায়। TIME-WAIT গুলোও লুকানো থাকে। সব দেখতে -a দিন।"
        : hidden > 0
          ? `deploy হিসেবে চালালে ${hidden} টা লাইনের Process ঘর ফাঁকা থাকে, কারণ অন্য User এর Process এর নাম Kernel আপনাকে বলবে না। sudo দিয়ে চালান।`
          : flags.n
            ? "-n থাকায় Port গুলো সংখ্যায়। Debug এর সময় এটাই চাই, কারণ 3000 এর মতো Port এর কোনো নাম নেই, আর নাম খুঁজতে ss কে আলাদা খাতা দেখতে হয়।"
            : "-n নেই, তাই ss যেসব Port এর নাম চেনে সেগুলো নামে লিখছে: 443 হলো https, 6379 হলো redis। চেনা লাগে, কিন্তু grep 443 দিলে এই লাইন আর মিলবে না।";

  return (
    <Panel
      label="Interactive"
      title="ss এর Flag বদলান, তালিকা বদলাবে"
      footer="সব লাইন practice server এ ss চালিয়ে পাওয়া, তালিকা ছোট রাখতে কয়েকটা লাইন বাদ। ss নিজে Host এর নাম খোঁজে না, শুধু চেনা Port এর নাম বসায়, তাই -n ছাড়াও IP গুলো সংখ্যাতেই থাকে। Flag গুলো একটা একটা করে চাপুন আর দেখুন কোন লাইন আসে বা যায়, কোন ঘর ভরে বা খালি হয়। সবচেয়ে কাজের জোড়া দুইটা মুখস্থ রাখার মতো: sudo ss -tlnp, কে কোন দরজায় শুনছে; আর sudo ss -tanp, এই মুহূর্তে কে কার সাথে কথা বলছে।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {(Object.keys(flags) as (keyof SsFlags)[]).map((key) => (
          <Chip key={key} active={flags[key]} onClick={() => toggle(key)}>
            -{key} <span className="font-normal opacity-80">{FLAG_HELP[key]}</span>
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          কে চালাচ্ছে
        </span>
        <Chip active={runner === "root"} onClick={() => setRunner("root")}>
          sudo দিয়ে
        </Chip>
        <Chip active={runner === "deploy"} onClick={() => setRunner("deploy")}>
          deploy হিসেবে, sudo ছাড়া
        </Chip>
      </div>
      <Terminal
        prompt="deploy@island-vps-01:~$"
        command={command}
        lines={noKind ? ["(সব ধরনের Socket, শত শত লাইন)"] : [header, ...rows.map((r) => ssLine(r, flags, runner, showProto))]}
      />
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{note}</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Error এর বার্তা থেকে স্তর                                                */
/* ------------------------------------------------------------------------- */

type Layer = "DNS" | "ROUTE" | "PORT" | "TLS" | "HTTP" | "APP";

type ErrorCard = {
  id: string;
  chip: string;
  seen: string[];
  layer: Layer;
  wire: string;
  causes: string[];
  first: { where: string; command: string };
};

const ERRORS: ErrorCard[] = [
  {
    id: "refused",
    chip: "Connection refused",
    seen: ["curl: (7) Failed to connect ... Couldn't connect to server", "Node: ECONNREFUSED", "Chrome: ERR_CONNECTION_REFUSED"],
    layer: "PORT",
    wire: "SYN পৌঁছেছে, আর ওপাশের Kernel সাথে সাথে RST দিয়ে না বলেছে। মানে যন্ত্রটা আছে, পথও আছে, শুধু ওই দরজায় কেউ নেই।",
    causes: [
      "ওই Port এ কোনো Program শুনছে না, App বন্ধ বা Crash করেছে",
      "App শুনছে, কিন্তু শুধু 127.0.0.1 এ, আর আপনি বাইরে থেকে এসেছেন",
      "Port নম্বর ভুল, App বসে আছে অন্য Port এ",
      "Firewall এ REJECT Rule, যেটা ইচ্ছা করে RST পাঠায়",
    ],
    first: { where: "Server এ", command: "sudo ss -tlnp 'sport = :443'" },
  },
  {
    id: "timeout",
    chip: "Connection timed out",
    seen: ["curl: (28) Connection timed out after 5004 milliseconds", "Node: ETIMEDOUT", "Chrome: ERR_CONNECTION_TIMED_OUT"],
    layer: "PORT",
    wire: "SYN গেছে, উত্তর আসেনি। Laptop একই SYN বারবার পাঠিয়ে শেষে হাল ছেড়েছে। পথের কেউ একজন Packet টা চুপচাপ ফেলে দিচ্ছে।",
    causes: [
      "ufw এর Default deny, ওই Port এর জন্য allow Rule নেই",
      "Provider এর Cloud Firewall এ Port খোলা নেই",
      "DNS ভুল IP দিচ্ছে, আর সেই IP এর যন্ত্র চুপ থাকে",
      "Server এত ব্যস্ত যে নতুন Connection নিতেই পারছে না",
    ],
    first: { where: "Server এ", command: "sudo tcpdump -ni any 'tcp port 443 and tcp[tcpflags] & tcp-syn != 0'" },
  },
  {
    id: "noroute",
    chip: "No route to host",
    seen: ["nc: ... failed: No route to host", "Node: EHOSTUNREACH", "curl -v: connect ... failed: No route to host"],
    layer: "ROUTE",
    wire: "SYN তারে নামতেই পারেনি। একই Network এ ARP তিনবার জিজ্ঞেস করেছে ওই IP কার, কেউ সাড়া দেয়নি। অথবা পথের কোনো Router ICMP দিয়ে জানিয়েছে ওখানে পৌঁছানো যাবে না।",
    causes: [
      "Server বন্ধ, বা ওই IP তে এখন কোনো যন্ত্রই নেই",
      "IP টাই ভুল, পুরনো Server এর ঠিকানা",
      "কোনো Firewall REJECT করছে ICMP host unreachable দিয়ে",
    ],
    first: { where: "যেখান থেকে চেষ্টা করছেন", command: "ip route get 103.94.135.2 && ping -c 3 103.94.135.2" },
  },
  {
    id: "dns",
    chip: "Could not resolve host",
    seen: ["curl: (6) Could not resolve host: islandtours.invalid", "Node: ENOTFOUND", "Chrome: ERR_NAME_NOT_RESOLVED"],
    layer: "DNS",
    wire: "তারে একটা Packet ও যায়নি Server এর দিকে। নামটাকে IP তে বদলানোই যায়নি, তাই কোথায় যেতে হবে কেউ জানে না।",
    causes: [
      "নামে বানান ভুল",
      "Record টাই নেই, বা এখনো ছড়ায়নি (Module 04)",
      "এই যন্ত্রের Resolver নিজেই কাজ করছে না",
    ],
    first: { where: "যেখান থেকে চেষ্টা করছেন", command: "dig +short islandtours.example; dig @1.1.1.1 +short islandtours.example" },
  },
  {
    id: "netunreach",
    chip: "Network is unreachable",
    seen: ["connect: Network is unreachable", "Node: ENETUNREACH"],
    layer: "ROUTE",
    wire: "Kernel এর Routing Table এ এই ঠিকানার জন্য কোনো রাস্তাই লেখা নেই, তাই সে পাঠানোর চেষ্টাও করেনি।",
    causes: [
      "Default Route নেই, ip route এ default via ... লাইনটা অনুপস্থিত",
      "IPv6 ঠিকানায় যাচ্ছেন, অথচ এই যন্ত্রে IPv6 পথ নেই",
    ],
    first: { where: "যেখান থেকে চেষ্টা করছেন", command: "ip route; ip -6 route" },
  },
  {
    id: "502",
    chip: "502 Bad Gateway",
    seen: ["HTTP/2 502, server: Caddy", "Caddy Log: dial tcp 127.0.0.1:3000: connect: connection refused"],
    layer: "HTTP",
    wire: "বাইরের সব ঠিক আছে: DNS, Port 443, TLS। Caddy আপনার Request পেয়েছে, তারপর পেছনের App এর দরজায় টোকা দিয়ে refused পেয়েছে।",
    causes: [
      "App বন্ধ বা Crash করেছে",
      "App অন্য Port এ চলছে, Caddy পুরনো Port এ খুঁজছে",
      "App 127.0.0.1 এর বদলে অন্য কোনো ঠিকানায় বসেছে",
    ],
    first: { where: "Server এ", command: "curl -sS http://127.0.0.1:3000/health; systemctl status my-tours-api" },
  },
  {
    id: "504",
    chip: "504 Gateway Timeout",
    seen: ["HTTP/2 504, server: Caddy"],
    layer: "HTTP",
    wire: "Caddy App এর সাথে Connection খুলতে পেরেছে, Request ও দিয়েছে, কিন্তু নির্দিষ্ট সময়ের মধ্যে উত্তর আসেনি।",
    causes: [
      "App কোনো ধীর কাজে আটকে আছে, যেমন ধীর Database Query",
      "App এর ভেতরে কোনো বাইরের ডাক Timeout ছাড়া ঝুলে আছে (Module 05 L08)",
    ],
    first: { where: "Server এ", command: "curl -sS -o /dev/null -w '%{time_total}\\n' http://127.0.0.1:3000/tours" },
  },
  {
    id: "inuse",
    chip: "Address already in use",
    seen: ["Error: listen EADDRINUSE: address already in use 127.0.0.1:3000"],
    layer: "PORT",
    wire: "এবার সমস্যা Request এ নয়, App চালু হওয়ার সময়। App যে দরজায় বসতে চাইছে, সেখানে আগে থেকেই কেউ বসে আছে।",
    causes: [
      "পুরনো Process টা এখনো চলছে, systemd আর হাতে চালানো একটা, দুইটা একসাথে",
      "অন্য কোনো Service একই Port নিয়েছে",
      "নিজের Process TIME_WAIT এর কারণে আটকে, Module 05 L08 দেখুন",
    ],
    first: { where: "Server এ", command: "sudo ss -tlnp 'sport = :3000'; sudo lsof -nP -i :3000" },
  },
  {
    id: "reset",
    chip: "Connection reset by peer",
    seen: ["curl: (56) Recv failure: Connection reset by peer", "Node: ECONNRESET"],
    layer: "APP",
    wire: "Connection খুলেছিল, কথাও শুরু হয়েছিল, তারপর ওপাশ হঠাৎ RST পাঠিয়ে কথার মাঝখানে লাইন কেটেছে।",
    causes: [
      "App উত্তর দিতে দিতে Crash করেছে",
      "দুই পাশের Idle Timeout মেলে না, Module 05 L08 এর Keep-Alive দৌড়",
    ],
    first: { where: "Server এ", command: "journalctl -u my-tours-api --since '10 min ago'" },
  },
  {
    id: "empty",
    chip: "Empty reply from server",
    seen: ["curl: (52) Empty reply from server"],
    layer: "APP",
    wire: "Connection খুলল, Request গেল, তারপর ওপাশ একটা Byte ও না পাঠিয়ে Connection বন্ধ করে দিল।",
    causes: [
      "App Request টা পেয়েই Crash করেছে বা Socket ফেলে দিয়েছে",
      "ওই Port এ এমন কিছু বসে আছে যে HTTP বোঝে না",
    ],
    first: { where: "Server এ", command: "curl -v http://127.0.0.1:3000/ ; journalctl -u my-tours-api -n 30" },
  },
  {
    id: "wrongversion",
    chip: "SSL wrong version number",
    seen: ["curl: (35) OpenSSL/3.0.13: error:0A00010B:SSL routines::wrong version number", "Chrome: ERR_SSL_PROTOCOL_ERROR"],
    layer: "TLS",
    wire: "Client TLS এর ভাষায় শুরু করেছে, আর ওপাশ জবাব দিয়েছে সাধারণ HTTP তে। দুই পক্ষ দুই ভাষায় কথা বলছে।",
    causes: [
      "https:// দিয়ে এমন Port এ গেছেন যেটা শুধু http বোঝে, যেমন https://127.0.0.1:3000",
      "উল্টোটাও আছে: http:// দিয়ে 443 এ গেলে Caddy বলে Client sent an HTTP request to an HTTPS server",
    ],
    first: { where: "যেখান থেকে চেষ্টা করছেন", command: "Scheme আর Port মিলিয়ে দেখুন: http://...:3000, https://...:443" },
  },
  {
    id: "cert",
    chip: "SSL certificate problem",
    seen: ["curl: (60) SSL certificate problem: ...", "Chrome: NET::ERR_CERT_DATE_INVALID, ERR_CERT_COMMON_NAME_INVALID"],
    layer: "TLS",
    wire: "TLS Handshake শুরু হয়েছে, Server Certificate পাঠিয়েছে, আর Client সেটা বিশ্বাস করেনি।",
    causes: [
      "Certificate এর মেয়াদ শেষ, নবীকরণ হয়নি",
      "Certificate এ এই নাম নেই",
      "Intermediate পাঠানো হয়নি, বা নিজের বানানো Certificate (Module 06 L08)",
    ],
    first: { where: "যেখান থেকে চেষ্টা করছেন", command: "openssl s_client -connect 103.94.135.2:443 -servername islandtours.example </dev/null | openssl x509 -noout -dates -ext subjectAltName" },
  },
  {
    id: "alert",
    chip: "tlsv1 alert internal error",
    seen: ["openssl: ssl3_read_bytes:tlsv1 alert internal error ... SSL alert number 80"],
    layer: "TLS",
    wire: "Client যে নাম চেয়েছে (SNI), Caddy সেই নামের কোনো Site চেনে না, তাই Handshake এর শুরুতেই আপত্তি জানিয়েছে।",
    causes: [
      "Caddyfile এ এই Domain এর Block নেই, বা নামে বানান ভুল",
      "openssl এ -servername দিতে ভুলে গেছেন, বা অন্য নাম দিয়েছেন",
    ],
    first: { where: "Server এ", command: "sudo cat /etc/caddy/Caddyfile; journalctl -u caddy -n 20" },
  },
];

const LAYER_LABEL: Record<Layer, string> = {
  DNS: "স্তর ১, DNS",
  ROUTE: "স্তর ২, পথ",
  PORT: "স্তর ৩, Port",
  TLS: "স্তর ৪, TLS",
  HTTP: "স্তর ৫, HTTP",
  APP: "App এর ভেতরে",
};

export function NetdebugErrorLab() {
  const [selected, setSelected] = useState<string>("refused");
  const card = ERRORS.find((e) => e.id === selected) ?? ERRORS[0];

  return (
    <Panel
      label="Interactive"
      title="Error এর বার্তা দেখে স্তর চেনা"
      footer="প্রতিটা বার্তা হয় practice server এ সত্যি ঘটিয়ে নেওয়া, নয়তো Node, curl আর Chrome যেভাবে লেখে সেভাবে। একটা বার্তা বেছে নিন, তারপর তিনটা প্রশ্নের উত্তর মিলিয়ে নিন: কোন স্তর ভেঙেছে, তারে আসলে কী ঘটেছে, আর প্রথম কোন কমান্ডটা চালাবেন। খেয়াল করুন, প্রথম কমান্ড সবসময় সম্ভাব্য কারণগুলোর মধ্যে বাছাই করার জন্য, অনুমান করে কিছু বদলানোর জন্য নয়।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {ERRORS.map((e) => (
          <Chip key={e.id} active={e.id === selected} onClick={() => setSelected(e.id)}>
            {e.chip}
          </Chip>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div>
            <span className="inline-block px-2 py-1 border border-primary text-primary font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em]">
              {LAYER_LABEL[card.layer]}
            </span>
          </div>
          <div>
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">যেভাবে চোখে পড়ে</p>
            <ul className="space-y-1">
              {card.seen.map((s) => (
                <li key={s} className="font-mono text-[0.75rem] text-foreground break-words">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">তারে যা ঘটেছে</p>
            <p className="text-sm leading-relaxed text-foreground">{card.wire}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">সম্ভাব্য কারণ, বেশি থেকে কম</p>
            <ol className="space-y-1.5 list-decimal list-inside">
              {card.causes.map((c) => (
                <li key={c} className="text-sm leading-relaxed text-foreground">
                  {c}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2">
              প্রথম কমান্ড, {card.first.where}
            </p>
            <pre className="overflow-x-auto border border-border bg-background p-3 font-mono text-[0.75rem] text-foreground whitespace-pre-wrap break-all">
              {card.first.command}
            </pre>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. বাইরে থেকে ভেতরে, একটা লুকানো সমস্যা খুঁজুন                                */
/* ------------------------------------------------------------------------- */

type CheckId = "dig" | "nc" | "tls" | "http" | "service" | "ss" | "app";

type CheckDef = { id: CheckId; where: "out" | "in"; command: string };

const CHECKS: CheckDef[] = [
  { id: "dig", where: "out", command: "dig +short islandtours.example" },
  { id: "nc", where: "out", command: "nc -vz -w 5 103.94.135.2 443" },
  { id: "tls", where: "out", command: "openssl s_client -connect 103.94.135.2:443 -servername islandtours.example -brief </dev/null" },
  { id: "http", where: "out", command: "curl -sSI https://islandtours.example/health" },
  { id: "service", where: "in", command: "systemctl is-active caddy my-tours-api; sudo ufw status | grep -E '80|443'" },
  { id: "ss", where: "in", command: "sudo ss -tlnp | grep -E ':(80|443|3000|3001) '" },
  { id: "app", where: "in", command: "curl -sS http://127.0.0.1:3000/health" },
];

type Outcome = { ok: boolean; lines: string[] };

const OK_DIG: Outcome = { ok: true, lines: ["103.94.135.2"] };
const OK_NC: Outcome = { ok: true, lines: ["Connection to 103.94.135.2 443 port [tcp/https] succeeded!"] };
const OK_TLS: Outcome = {
  ok: true,
  lines: ["CONNECTION ESTABLISHED", "Protocol version: TLSv1.3", "Ciphersuite: TLS_AES_128_GCM_SHA256", "Verification: OK"],
};
const OK_HTTP: Outcome = { ok: true, lines: ["HTTP/2 200", "content-type: application/json", "server: Caddy"] };
const OK_SERVICE: Outcome = {
  ok: true,
  lines: ["active", "active", "80/tcp                     ALLOW       Anywhere", "443/tcp                    ALLOW       Anywhere", "443/udp                    ALLOW       Anywhere"],
};
const OK_SS: Outcome = {
  ok: true,
  lines: [
    'LISTEN 0      511        127.0.0.1:3000       0.0.0.0:*    users:(("node",pid=1220,fd=24))',
    'LISTEN 0      4096               *:443              *:*    users:(("caddy",pid=1391,fd=7))',
    'LISTEN 0      4096               *:80               *:*    users:(("caddy",pid=1391,fd=9))',
  ],
};
const OK_APP: Outcome = { ok: true, lines: ['{"status":"ok"}'] };

type Scenario = {
  id: string;
  name: string;
  firstFail: CheckId;
  verdict: string;
  outcomes: Partial<Record<CheckId, Outcome>>;
};

const SCENARIOS: Scenario[] = [
  {
    id: "app-down",
    name: "App বন্ধ হয়ে গেছে",
    firstFail: "http",
    verdict: "বাইরের চারটা পরীক্ষার তিনটা পাস, চতুর্থটায় 502। মানে Caddy পর্যন্ত সব ঠিক, তার পেছনে কেউ নেই। ss এ 3000 এর লাইনটাই নেই, আর App কে সরাসরি ডাকলে refused। systemctl status my-tours-api আর journalctl -u my-tours-api দিয়ে দেখুন কেন থেমেছে (লেসন ০২, ০৭)।",
    outcomes: {
      http: { ok: false, lines: ["HTTP/2 502", "server: Caddy", "content-length: 0"] },
      service: { ok: false, lines: ["active", "inactive", "80/tcp                     ALLOW       Anywhere", "443/tcp                    ALLOW       Anywhere", "443/udp                    ALLOW       Anywhere"] },
      ss: {
        ok: false,
        lines: [
          'LISTEN 0      4096               *:443              *:*    users:(("caddy",pid=1391,fd=7))',
          'LISTEN 0      4096               *:80               *:*    users:(("caddy",pid=1391,fd=9))',
        ],
      },
      app: { ok: false, lines: ["curl: (7) Failed to connect to 127.0.0.1 port 3000 after 0 ms: Couldn't connect to server"] },
    },
  },
  {
    id: "ufw-443",
    name: "ufw থেকে 443/tcp এর Rule মুছে গেছে",
    firstFail: "nc",
    verdict: "DNS ঠিক, কিন্তু 443 এ পাঁচ সেকেন্ড চুপ, তারপর timed out। refused নয়, তাই কেউ পথে Packet ফেলছে। ভেতরে Caddy চলছে আর 443 এ শুনছেও, অথচ ufw এর তালিকায় 443/tcp নেই। sudo ufw allow 443/tcp দিলে সারবে (লেসন ০৬)। Provider এর Firewall ও একবার দেখে নিন।",
    outcomes: {
      nc: { ok: false, lines: ["nc: connect to 103.94.135.2 port 443 (tcp) timed out: Operation now in progress"] },
      tls: { ok: false, lines: ["(কোনো উত্তর নেই, অনেকক্ষণ অপেক্ষার পর)", "BIO_connect:Connection timed out"] },
      http: { ok: false, lines: ["curl: (28) Connection timed out after 5004 milliseconds"] },
      service: { ok: false, lines: ["active", "active", "80/tcp                     ALLOW       Anywhere", "443/udp                    ALLOW       Anywhere"] },
    },
  },
  {
    id: "caddy-down",
    name: "Caddy থেমে আছে",
    firstFail: "nc",
    verdict: "443 এ সাথে সাথে refused। পথ আছে, যন্ত্র আছে, শুধু দরজায় কেউ নেই। ভেতরে caddy inactive আর ss এ 443 এর লাইন নেই, অথচ App নিজে ঠিক আছে। systemctl status caddy আর journalctl -u caddy দিয়ে দেখুন কেন থেমেছে, প্রায়ই Caddyfile এ একটা ভুল (লেসন ০৭)।",
    outcomes: {
      nc: { ok: false, lines: ["nc: connect to 103.94.135.2 port 443 (tcp) failed: Connection refused"] },
      tls: { ok: false, lines: ["connect:errno=111"] },
      http: { ok: false, lines: ["curl: (7) Failed to connect to islandtours.example port 443 after 0 ms: Couldn't connect to server"] },
      service: { ok: false, lines: ["inactive", "active", "80/tcp                     ALLOW       Anywhere", "443/tcp                    ALLOW       Anywhere", "443/udp                    ALLOW       Anywhere"] },
      ss: { ok: false, lines: ['LISTEN 0      511        127.0.0.1:3000       0.0.0.0:*    users:(("node",pid=1220,fd=24))'] },
    },
  },
  {
    id: "dns-old",
    name: "DNS পুরনো IP দিচ্ছে",
    firstFail: "dig",
    verdict: "dig এর উত্তর 103.94.135.9, যেটা পুরনো Server। IP হাতে লিখে যত পরীক্ষা, সব পাস, কারণ সেগুলো DNS কে পাশ কাটিয়ে সঠিক Server এ যায়। কিন্তু নাম দিয়ে curl ভুল ঠিকানায় গিয়ে ব্যর্থ। পরীক্ষার ফলাফল মেলানোর আগে নিজের কমান্ড কোন ঠিকানায় যাচ্ছে সেটা দেখুন। Record ঠিক করুন আর TTL এর কথা মনে রাখুন (Module 04)।",
    outcomes: {
      dig: { ok: false, lines: ["103.94.135.9"] },
      http: { ok: false, lines: ["curl: (7) Failed to connect to islandtours.example port 443 after 3010 ms: Couldn't connect to server"] },
    },
  },
  {
    id: "wrong-port",
    name: "App 3001 এ চলছে, Caddy খুঁজছে 3000",
    firstFail: "http",
    verdict: "বাইরে থেকে দেখতে ঠিক App বন্ধের মতো: 502। পার্থক্য ধরা পড়ে ভেতরে। systemctl বলছে App active, আর ss বলছে node শুনছে 127.0.0.1:3001 এ। কেউ api.env এ PORT বদলেছে, Caddyfile বদলায়নি। দুই জায়গার সংখ্যা মেলান। শুধু active দেখে থামলে এই ভুল কখনো ধরা পড়ত না।",
    outcomes: {
      http: { ok: false, lines: ["HTTP/2 502", "server: Caddy", "content-length: 0"] },
      ss: {
        ok: false,
        lines: [
          'LISTEN 0      511        127.0.0.1:3001       0.0.0.0:*    users:(("node",pid=1302,fd=24))',
          'LISTEN 0      4096               *:443              *:*    users:(("caddy",pid=1391,fd=7))',
          'LISTEN 0      4096               *:80               *:*    users:(("caddy",pid=1391,fd=9))',
        ],
      },
      app: { ok: false, lines: ["curl: (7) Failed to connect to 127.0.0.1 port 3000 after 0 ms: Couldn't connect to server"] },
    },
  },
  {
    id: "cert-expired",
    name: "Certificate এর মেয়াদ শেষ",
    firstFail: "tls",
    verdict: "Port খোলা, কিন্তু TLS এ যাচাই ব্যর্থ, কারণ Certificate এর মেয়াদ শেষ। Caddy তো নিজেই নবীকরণ করে, তাহলে কেন হলো? ভেতরে ufw এর তালিকায় 80/tcp নেই। Let's Encrypt এর HTTP-01 পরীক্ষা Port 80 দিয়ে আসে, সেটা বন্ধ থাকায় নবীকরণ চুপচাপ ব্যর্থ হয়েছে (Module 06 L08)। 80 খুলুন, journalctl -u caddy এ নবীকরণের Log দেখুন।",
    outcomes: {
      tls: { ok: false, lines: ["CONNECTION ESTABLISHED", "Protocol version: TLSv1.3", "Verification error: certificate has expired"] },
      http: { ok: false, lines: ["curl: (60) SSL certificate problem: certificate has expired"] },
      service: { ok: false, lines: ["active", "active", "443/tcp                    ALLOW       Anywhere", "443/udp                    ALLOW       Anywhere"] },
    },
  },
];

const DEFAULT_OUTCOMES: Record<CheckId, Outcome> = {
  dig: OK_DIG,
  nc: OK_NC,
  tls: OK_TLS,
  http: OK_HTTP,
  service: OK_SERVICE,
  ss: OK_SS,
  app: OK_APP,
};

function outcomeFor(scenario: Scenario, id: CheckId): Outcome {
  return scenario.outcomes[id] ?? DEFAULT_OUTCOMES[id];
}

const INCIDENT_LETTERS = ["ক", "খ", "গ", "ঘ", "ঙ", "চ"];

export function NetdebugOutsideInLab() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [ran, setRan] = useState<CheckId[]>([]);
  const [revealed, setRevealed] = useState(false);
  const scenario = SCENARIOS[scenarioIndex];

  function pickScenario(i: number) {
    setScenarioIndex(i);
    setRan([]);
    setRevealed(false);
  }

  function run(id: CheckId) {
    setRan((current) => (current.includes(id) ? current : [...current, id]));
  }

  const firstFailRan = ran.includes(scenario.firstFail);
  const outsideRan = CHECKS.filter((c) => c.where === "out" && ran.includes(c.id)).length;

  return (
    <Panel
      label="Interactive"
      title="বাইরে থেকে ভেতরে: লুকানো সমস্যাটা খুঁজুন"
      footer="ছয়টা ঘটনা, প্রতিটায় একটা করে লুকানো দোষ। প্রথমে একটা ঘটনা বেছে নিন, তারপর বাঁ পাশের পরীক্ষাগুলো যে ক্রমে চান চালান। নিয়মটা একটাই: উপরের বাইরের পরীক্ষা আগে, ভেতরের পরে। প্রথম যে পরীক্ষা লাল হয়, সেটাই আপনার উত্তরের দিক দেখায়। Output গুলো practice server এর আসল Output এর ছাঁচে বানানো, কিছু ছোট করা। দুইটা ঘটনা বাইরে থেকে হুবহু একই রকম দেখায়, ভেতরে না ঢুকলে আলাদা করা যায় না, সেই দুইটা খুঁজে বের করুন।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">ঘটনা</span>
        {SCENARIOS.map((s, i) => (
          <Chip key={s.id} active={i === scenarioIndex} onClick={() => pickScenario(i)}>
            {INCIDENT_LETTERS[i]}
          </Chip>
        ))}
        <button
          onClick={() => pickScenario(scenarioIndex)}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-[0.6875rem] font-bold text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3" /> আবার শুরু
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <div className="space-y-2">
          {CHECKS.map((c, i) => {
            const done = ran.includes(c.id);
            const result = done ? outcomeFor(scenario, c.id) : null;
            return (
              <div key={c.id}>
                {i === 4 && (
                  <p className="mt-4 mb-2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-primary">ssh island, Server এর ভেতরে</p>
                )}
                {i === 0 && (
                  <p className="mb-2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">নিজের Laptop থেকে, বাইরে</p>
                )}
                <button
                  onClick={() => run(c.id)}
                  className={cn(
                    "w-full flex items-start gap-2 px-3 py-2 border text-left transition-colors",
                    !done && "border-border hover:border-primary/50",
                    result?.ok && "border-border bg-muted/30",
                    result && !result.ok && "border-primary bg-primary/10",
                  )}
                >
                  <span className="mt-0.5 shrink-0">
                    {!result && <span className="block w-3.5 h-3.5 border border-muted-foreground/50" />}
                    {result?.ok && <Check className="w-3.5 h-3.5 text-muted-foreground" />}
                    {result && !result.ok && <X className="w-3.5 h-3.5 text-primary" />}
                  </span>
                  <span className="font-mono text-[0.6875rem] leading-snug text-foreground break-all">{c.command}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="space-y-4 min-w-0">
          {ran.length === 0 && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              এখনো কোনো পরীক্ষা চালাননি। পর্যটকরা বলছেন সাইট খুলছে না। কোথা থেকে শুরু করবেন? উপরের পরীক্ষাটা দিয়ে, নিজের Laptop থেকে।
            </p>
          )}
          {ran.map((id) => {
            const def = CHECKS.find((c) => c.id === id);
            if (!def) return null;
            const result = outcomeFor(scenario, id);
            return (
              <Terminal
                key={id}
                prompt={def.where === "out" ? "you@laptop:~$" : "deploy@island-vps-01:~$"}
                command={def.command}
                lines={result.lines}
              />
            );
          })}
          {ran.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setRevealed(true)}
                className="px-3 py-1.5 border border-primary bg-primary/10 text-primary text-[0.6875rem] font-bold hover:bg-primary/20 transition-colors"
              >
                উত্তর দেখুন
              </button>
              {!firstFailRan && outsideRan < 4 && (
                <span className="text-xs text-muted-foreground">বাইরের চারটা পরীক্ষা শেষ করার আগে উত্তর দেখলে শেখাটা অর্ধেক থাকে।</span>
              )}
            </div>
          )}
          {revealed && (
            <div className="border border-primary/60 bg-primary/5 p-4">
              <p className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-primary mb-2">
                ঘটনা {INCIDENT_LETTERS[scenarioIndex]}: {scenario.name}
              </p>
              <p className="text-sm leading-relaxed text-foreground">{scenario.verdict}</p>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
