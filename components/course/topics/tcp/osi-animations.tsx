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

/* ------------------------------------------------------------------------- */
/* 1. সাত তলা ঘুরে দেখা                                                        */
/* ------------------------------------------------------------------------- */

const LAYERS = [
  {
    n: 7,
    name: "Application",
    job: "Program কোন ভাষায় সেবা চাইবে আর উত্তর পাবে, তার নিয়ম। Browser বলে GET /tours, Server বলে 200 OK।",
    analogy: "চিঠির ভেতরের কথাগুলো, যা প্রাপক পড়ে বুঝবেন।",
    unit: "Data, Message",
    addr: "নাম আর URL, যেমন islandtours.example/tours",
    protocols: "HTTP, DNS, SMTP, SSH, FTP",
    device: "L7 Load Balancer, Reverse Proxy, WAF",
    learned: "Module 02 এর Request আর Response, Module 04 এর পুরো DNS",
    command: "curl -sI https://example.com",
    breaks: "404, 500, 502, ভুল উত্তর, DNS এ নাম নেই",
  },
  {
    n: 6,
    name: "Presentation",
    job: "Data কোন রূপে যাবে। অক্ষরকে Byte বানানো, ছোট করা, আর তালা মারা।",
    analogy: "চিঠিটা কোন ভাষায় লেখা, আর খামটা সিল করা কি না।",
    unit: "Data",
    addr: "নিজের কোনো ঠিকানা নেই",
    protocols: "TLS এর Encryption, UTF-8, JSON, JPEG, gzip",
    device: "আলাদা যন্ত্র নেই, কাজটা Program আর Library করে",
    learned: "Module 01 এর Binary আর Encoding",
    command: "openssl s_client -connect example.com:443",
    breaks: "Certificate এর মেয়াদ শেষ, হিজিবিজি অক্ষর, ভুল Content-Encoding",
  },
  {
    n: 5,
    name: "Session",
    job: "দুই পক্ষের একটা আলাপ শুরু করা, চালু রাখা, মাঝপথে কাটলে আবার ধরা, আর শেষ করা।",
    analogy: "ফোনে হ্যালো বলা থেকে রাখছি বলা পর্যন্ত পুরো আলাপটা।",
    unit: "Data",
    addr: "নিজের কোনো ঠিকানা নেই",
    protocols: "TLS Session, RPC, SOCKS, NetBIOS",
    device: "আলাদা যন্ত্র নেই, কাজটা Program আর Library করে",
    learned: "নতুন, তবে Login করে থাকার ধারণাটা চেনা",
    command: "openssl s_client -tls1_2 -reconnect -connect example.com:443",
    breaks: "বারবার Login চাওয়া, মাঝপথে আলাপ কেটে যাওয়া",
  },
  {
    n: 4,
    name: "Transport",
    job: "যন্ত্র পর্যন্ত পৌঁছানো তথ্যকে ভেতরের ঠিক Program এর হাতে দেওয়া। TCP হলে হারানো টুকরো আবার পাঠানো আর ক্রম ঠিক রাখা।",
    analogy: "বিল্ডিং এ পৌঁছানোর পর ঠিক ফ্ল্যাটের দরজায় দেওয়া।",
    unit: "Segment (TCP), Datagram (UDP)",
    addr: "Port, যেমন 443",
    protocols: "TCP, UDP",
    device: "Firewall, Security Group, L4 Load Balancer, NAT",
    learned: "Module 02 এর Port আর Socket, Module 03 এর NAT আর PAT",
    command: "nc -vz example.com 443",
    breaks: "Connection refused, Connection timed out, Port বন্ধ",
  },
  {
    n: 3,
    name: "Network",
    job: "এক Network থেকে আরেক Network এ, দরকার হলে পৃথিবীর ওপাশে, পথ খুঁজে Packet পৌঁছানো।",
    analogy: "শহর থেকে শহরে চিঠি পাঠানোর ডাক ব্যবস্থা।",
    unit: "Packet",
    addr: "IP Address, যেমন 103.94.135.2",
    protocols: "IP (IPv4, IPv6), ICMP",
    device: "Router, Layer 3 Switch",
    learned: "Module 03 এর IP Address, Subnet, Gateway আর Module 02 এর Hop",
    command: "ping -c 3 1.1.1.1",
    breaks: "Request timeout, No route to host, ভুল Gateway, ভুল Subnet",
  },
  {
    n: 2,
    name: "Data Link",
    job: "একই Network এর ভেতরে এক যন্ত্র থেকে পাশের যন্ত্রে Frame পৌঁছানো, আর পথে নষ্ট হয়েছে কি না ধরা।",
    analogy: "একই পাড়ার ভেতরে বাড়ি থেকে বাড়ি হাতে হাতে দেওয়া।",
    unit: "Frame",
    addr: "MAC Address, যেমন a4:83:e7:12:9c:01",
    protocols: "Ethernet, Wi-Fi (802.11), ARP, VLAN",
    device: "Switch, Access Point, Network Card",
    learned: "Module 03 এর MAC Address, Switch আর ARP",
    command: "arp -a",
    breaks: "ARP এ incomplete, ভুল Wi-Fi Password, ভুল VLAN",
  },
  {
    n: 1,
    name: "Physical",
    job: "0 আর 1 কে বিদ্যুৎ, আলো বা Radio তরঙ্গ বানিয়ে তার বা বাতাসে ছাড়া, আর ওপাশে আবার 0 আর 1 এ ফেরানো।",
    analogy: "রাস্তাটা নিজে, যার উপর দিয়ে গাড়ি চলে।",
    unit: "Bit",
    addr: "কোনো ঠিকানা নেই",
    protocols: "তামার তার, Fiber Optic, Wi-Fi এর Radio, 4G আর 5G এর তরঙ্গ",
    device: "তার, Connector, Hub, Repeater, Antenna",
    learned: "Module 01 এর Binary, Module 02 এর সমুদ্রের তলার Cable",
    command: "ifconfig en0   (Linux: ip link show)",
    breaks: "তার খোলা, Wi-Fi বন্ধ, দুর্বল Signal, status: inactive",
  },
];

export function LayerExplorerLab() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(4);
  const layer = LAYERS.find((l) => l.n === active) ?? LAYERS[3];

  const facts = [
    { k: "কাজ", v: layer.job },
    { k: "রোজকার তুলনা", v: layer.analogy },
    { k: "টুকরোর নাম", v: layer.unit },
    { k: "ঠিকানা", v: layer.addr },
    { k: "Protocol", v: layer.protocols },
    { k: "এই তলার যন্ত্র", v: layer.device },
    { k: "আগে কোথায় শিখেছেন", v: layer.learned },
    { k: "ভাঙলে যা দেখবেন", v: layer.breaks },
  ];

  return (
    <Panel
      label="Interactive"
      title="একটা তলায় চাপ দিন, তার সব কথা দেখুন"
      footer="সাতটা তলার যেকোনোটায় চাপ দিন। প্রতিটার জন্য একই আটটা প্রশ্নের উত্তর দেখাবে, যাতে তুলনা করা সহজ হয়। বিশেষ করে তিনটা জিনিস মিলিয়ে দেখুন। ঠিকানার ঘরটা, যেখানে Layer 2, 3 আর 4 এ যথাক্রমে MAC, IP আর Port। আগে কোথায় শিখেছেন ঘরটা, যেখানে দেখবেন প্রায় প্রতিটা তলাই আপনার চেনা। আর নিচের কমান্ডটা, যা দিয়ে ওই তলাটা ঠিক আছে কি না নিজের Terminal এ দেখা যায়।"
    >
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
        <div className="flex flex-col gap-1.5">
          {LAYERS.map((l) => (
            <button
              key={l.n}
              onClick={() => setActive(l.n)}
              data-layer={l.n}
              className={cn(
                "flex items-center gap-3 border px-3 py-2 text-left transition-colors",
                active === l.n
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
              )}
            >
              <span className="font-mono text-[0.8125rem] font-bold w-4">{l.n}</span>
              <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.08em]">
                {l.name}
              </span>
            </button>
          ))}
        </div>

        <motion.div
          key={layer.n}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          data-active-layer={layer.n}
        >
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-primary mb-3">
            Layer {layer.n} · {layer.name}
          </div>
          <dl className="space-y-2.5">
            {facts.map((f) => (
              <div key={f.k} className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-3 gap-y-0.5">
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground pt-0.5">
                  {f.k}
                </dt>
                <dd className="text-sm leading-relaxed text-foreground">{f.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 border border-border bg-background px-3 py-2">
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              নিজে দেখার কমান্ড
            </div>
            <code className="font-mono text-[0.75rem] text-primary break-all">{layer.command}</code>
          </div>
        </motion.div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. এটা কোন তলার জিনিস                                                       */
/* ------------------------------------------------------------------------- */

const ITEMS = [
  { q: "MAC Address a4:83:e7:12:9c:01", a: 2, why: "MAC Address দিয়ে একই Network এর পাশের যন্ত্র চেনা হয়, এটা Data Link Layer এর ঠিকানা।" },
  { q: "Port 443", a: 4, why: "Port দিয়ে যন্ত্রের ভেতরের ঠিক Program চেনা হয়, এটা Transport Layer এর ঠিকানা।" },
  { q: "IP Address 103.94.135.2", a: 3, why: "IP Address দিয়ে এক Network থেকে আরেক Network এ পথ খোঁজা হয়, এটা Network Layer এর ঠিকানা।" },
  { q: "HTTP 404 Not Found", a: 7, why: "404 হলো Server এর Program এর দেওয়া উত্তর। নিচের ছয় তলা ঠিকঠাক কাজ করেছে বলেই উত্তরটা পৌঁছেছে।" },
  { q: "Wi-Fi এর Signal দুর্বল", a: 1, why: "Signal মানে Radio তরঙ্গ, যা Bit বহন করে। এটা Physical Layer।" },
  { q: "Connection refused", a: 4, why: "যন্ত্র পর্যন্ত পৌঁছানো গেছে, কিন্তু ওই Port এ কোনো Program শুনছে না। Transport Layer এর উত্তর।" },
  { q: "traceroute এ পথের প্রতিটা Hop", a: 3, why: "Hop মানে একটা করে Router, আর Router কাজ করে Network Layer এ, IP Address দেখে।" },
  { q: "Certificate এর মেয়াদ শেষ", a: 6, why: "Certificate হলো TLS এর অংশ, যা তথ্যে তালা মারে। তালা মারার কাজটা Presentation Layer এর।" },
  { q: "Switch", a: 2, why: "Switch Frame খুলে MAC Address পড়ে ঠিক করে কোন তারে পাঠাবে। তাই Layer 2 এর যন্ত্র।" },
  { q: "Router", a: 3, why: "Router Packet খুলে IP Address পড়ে পরের পথ ঠিক করে। তাই Layer 3 এর যন্ত্র।" },
  { q: "UTF-8, অক্ষরকে Byte বানানো", a: 6, why: "Data কোন রূপে লেখা হবে সেটা Presentation Layer এর কাজ।" },
  { q: "তার খুলে গেছে", a: 1, why: "তার নিজে Physical Layer। এটা না থাকলে উপরের কোনো তলাই কাজ করে না।" },
];

export function WhichLayerLab() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const item = ITEMS[index];
  const answered = picked !== null;
  const right = picked === item.a;
  const last = index === ITEMS.length - 1;

  return (
    <Panel
      label="Interactive"
      title="এটা কোন Layer এর জিনিস"
      footer="বারোটা চেনা জিনিস, একটা একটা করে। প্রতিটার জন্য ভাবুন, এটা সাত তলার কোনটায় পড়ে, তারপর সেই সংখ্যায় চাপ দিন। ভুল হলে সমস্যা নেই, কারণটা সাথে সাথে দেখাবে। এই খেলাটা আসলে একটা অভ্যাস তৈরি করে, যেকোনো Error বা যন্ত্রের নাম শুনলে আগে ভাবা, এটা কোন তলার। ওই এক প্রশ্নই Debugging এর অর্ধেক কাজ করে দেয়।"
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
          প্রশ্ন {toBn(index + 1)} / {toBn(ITEMS.length)}
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-primary" data-score={score}>
          ঠিক হয়েছে {toBn(score)}
        </span>
        <button
          onClick={() => {
            setIndex(0);
            setPicked(null);
            setScore(0);
          }}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="border border-border bg-background px-4 py-4 mb-4">
        <div className="font-mono text-[0.875rem] font-bold text-foreground" data-question={index}>
          {item.q}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <button
            key={n}
            disabled={answered}
            onClick={() => {
              setPicked(n);
              if (n === item.a) setScore((s) => s + 1);
            }}
            data-pick={n}
            className={cn(
              "w-11 h-11 border font-mono text-[0.8125rem] font-bold transition-colors",
              answered && n === item.a
                ? "border-primary bg-primary/10 text-primary"
                : answered && n === picked
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            L{n}
          </button>
        ))}
      </div>

      {answered && (
        <motion.div
          key={`${index}-${picked}`}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          data-result={right ? "right" : "wrong"}
        >
          <p className="text-sm leading-relaxed text-muted-foreground mb-3">
            <strong className={right ? "text-primary" : "text-destructive"}>
              {right ? "ঠিক। " : `উত্তর Layer ${item.a}। `}
            </strong>
            {item.why}
          </p>
          {last ? (
            <p className="text-sm leading-relaxed text-foreground">
              শেষ। বারোটার মধ্যে {toBn(score)}টা ঠিক হয়েছে। দশের কম হলে উপরের ছকটা আরেকবার দেখে আবার
              খেলুন।
            </p>
          ) : (
            <button
              onClick={() => {
                setIndex((i) => i + 1);
                setPicked(null);
              }}
              data-action="next"
              className="px-3 py-1.5 border border-primary bg-primary/10 text-primary text-[0.6875rem] font-bold hover:bg-primary/20 transition-colors"
            >
              পরের প্রশ্ন
            </button>
          )}
        </motion.div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. নিচ থেকে উপরে, তলা ধরে Debugging                                          */
/* ------------------------------------------------------------------------- */

const CHECKS = [
  { layer: "L1", ask: "তার বা Wi-Fi জোড়া আছে তো", cmd: "ifconfig en0", ok: "status: active" },
  { layer: "L2", ask: "Router এর MAC পাওয়া গেছে তো", cmd: "arp -a", ok: "192.168.1.1 at c8:3a:35:4b:10:fe" },
  { layer: "L3", ask: "নিজের Router পর্যন্ত যাওয়া যায় তো", cmd: "ping -c 3 192.168.1.1", ok: "3 packets received, 0.0% packet loss" },
  { layer: "L3", ask: "Internet পর্যন্ত যাওয়া যায় তো", cmd: "ping -c 3 1.1.1.1", ok: "3 packets received, 0.0% packet loss" },
  { layer: "L7", ask: "নামটা IP তে বদলায় তো", cmd: "dig +short islandtours.example", ok: "103.94.135.2" },
  { layer: "L4", ask: "Port 443 এ কেউ শুনছে তো", cmd: "nc -vz islandtours.example 443", ok: "port 443 [tcp/https] succeeded!" },
  { layer: "L6", ask: "তালা আর Certificate ঠিক তো", cmd: "openssl s_client -connect islandtours.example:443", ok: "Verify return code: 0 (ok)" },
  { layer: "L7", ask: "Server ঠিক উত্তর দিচ্ছে তো", cmd: "curl -sI https://islandtours.example", ok: "HTTP/2 200" },
];

const CASES = [
  {
    id: "wifi",
    failAt: 0,
    out: "status: inactive",
    verdict: "Layer 1। ফোন বা ল্যাপটপ কোনো Network এই জোড়া নেই। Wi-Fi চালু করুন বা তারটা দেখুন। এর উপরের কোনো পরীক্ষা করার মানে নেই, কারণ রাস্তাই নেই।",
  },
  {
    id: "isp",
    failAt: 3,
    out: "3 packets transmitted, 0 packets received, 100.0% packet loss",
    verdict: "Layer 3। নিজের Router পর্যন্ত সব ঠিক, কিন্তু তার বাইরে Packet যাচ্ছে না। সমস্যা Router এর বাইরের দিকে বা ISP তে। Island Tours এর Server এর কোনো দোষ নেই।",
  },
  {
    id: "dns",
    failAt: 4,
    out: "(কোনো উত্তর নেই)",
    verdict: "নাম থেকে IP পাওয়া যাচ্ছে না, যদিও Internet চালু। এটা DNS এর সমস্যা, যা Application Layer এর একটা সেবা। Module 04 এর Debugging এর ধাপগুলো এখানে কাজে লাগবে।",
  },
  {
    id: "refused",
    failAt: 5,
    out: "connect to islandtours.example port 443 (tcp) failed: Connection refused",
    verdict: "Layer 4। Server যন্ত্রটা চালু আর পৌঁছানো যাচ্ছে, কিন্তু Port 443 এ কোনো Program শুনছে না। সম্ভবত Reverse Proxy বন্ধ হয়ে গেছে। Server এ ঢুকে সেটা চালু করতে হবে।",
  },
  {
    id: "timeout",
    failAt: 5,
    out: "connect to islandtours.example port 443 (tcp) failed: Operation timed out",
    verdict: "Layer 4, কিন্তু অন্য কারণ। কোনো উত্তরই আসেনি, না হ্যাঁ না না। মাঝখানে একটা Firewall বা Security Group Port 443 এর Packet চুপচাপ ফেলে দিচ্ছে। Port টা খুলে দিতে হবে।",
  },
  {
    id: "cert",
    failAt: 6,
    out: "Verify return code: 10 (certificate has expired)",
    verdict: "Layer 6। সংযোগ হয়েছে, কিন্তু তালার Certificate এর মেয়াদ শেষ। Browser এই জন্যই সতর্কবার্তা দেখাচ্ছে। Certificate নবায়ন করতে হবে।",
  },
  {
    id: "app",
    failAt: 7,
    out: "HTTP/2 502",
    verdict: "Layer 7। নিচের ছয় তলাই ঠিক, Reverse Proxy উত্তরও দিচ্ছে, কিন্তু তার পেছনের App টা, যা Port 3000 এ চলার কথা, সাড়া দিচ্ছে না। App এর Log দেখতে হবে।",
  },
];

export function LayerDebugLab() {
  const reduce = useReducedMotion();
  const [caseId, setCaseId] = useState("refused");
  const [step, setStep] = useState(0);

  const current = CASES.find((c) => c.id === caseId) ?? CASES[0];
  const found = step > current.failAt;
  const shown = CHECKS.slice(0, Math.min(step, current.failAt + 1));

  return (
    <Panel
      label="Interactive"
      title="সাইট খুলছে না, কোন তলায় সমস্যা"
      footer="সাতটা ঘটনা, আর সাতটাতেই পর্যটকের অভিযোগ হুবহু এক, সাইট খুলছে না। কিন্তু কারণ সাতটা আলাদা তলায়। একটা ঘটনা বেছে নিয়ে পরের পরীক্ষা চালান বোতামে চাপ দিতে থাকুন। পরীক্ষাগুলো সবসময় একই ক্রমে চলে, সবচেয়ে নিচের তলা থেকে উপরের দিকে। যে পরীক্ষাটা প্রথম ব্যর্থ হবে, সমস্যা সেই তলায়, আর তার উপরের পরীক্ষাগুলো আর চালানোর দরকার নেই। খেয়াল করুন ঘটনা ৪ আর ৫, দুইটাই একই পরীক্ষায় ব্যর্থ হয় কিন্তু বার্তা আলাদা, আর সেই তফাতটাই বলে দেয় Program বন্ধ নাকি Firewall আটকাচ্ছে।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {CASES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => {
              setCaseId(c.id);
              setStep(0);
            }}
            data-case={c.id}
            className={cn(
              "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
              caseId === c.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            ঘটনা {toBn(i + 1)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setStep((s) => s + 1)}
          disabled={found}
          data-action="check"
          className={cn(
            "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            found
              ? "border-border text-muted-foreground/40"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          পরের পরীক্ষা চালান
        </button>
        <button
          onClick={() => setStep(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[0.625rem] text-muted-foreground">
          পর্যটক বলছেন: সাইট খুলছে না
        </span>
      </div>

      <div className="space-y-2 mb-5">
        {shown.length === 0 && (
          <p className="text-sm text-muted-foreground">
            এখনো কোনো পরীক্ষা চালানো হয়নি। সবচেয়ে নিচের তলা থেকে শুরু করুন।
          </p>
        )}
        {shown.map((c, i) => {
          const failed = i === current.failAt;
          return (
            <div
              key={c.cmd}
              data-check={i}
              data-state={failed ? "fail" : "pass"}
              className={cn(
                "grid grid-cols-1 sm:grid-cols-[44px_1fr] gap-x-3 gap-y-1 border px-3 py-2",
                failed ? "border-destructive/60 bg-destructive/5" : "border-border bg-background",
              )}
            >
              <div
                className={cn(
                  "font-mono text-[0.75rem] font-bold",
                  failed ? "text-destructive" : "text-primary",
                )}
              >
                {c.layer}
              </div>
              <div>
                <div className="text-[0.75rem] font-bold text-foreground">{c.ask}</div>
                <div className="font-mono text-[0.6875rem] text-muted-foreground break-all">$ {c.cmd}</div>
                <div
                  className={cn(
                    "font-mono text-[0.6875rem] break-all",
                    failed ? "text-destructive" : "text-primary",
                  )}
                >
                  {failed ? current.out : c.ok}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {found && (
        <motion.p
          key={current.id}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="text-sm leading-relaxed text-muted-foreground"
          data-verdict={current.id}
        >
          <strong className="text-foreground">রায়: </strong>
          {current.verdict} মোট {toBn(current.failAt + 1)}টা পরীক্ষায় সমস্যার তলা ধরা পড়ল।
        </motion.p>
      )}
    </Panel>
  );
}
