"use client";

import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
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
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
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
/* Proxy এর সুইচ: কোন Record এ কমলা, কোনটায় ধূসর                               */
/* ------------------------------------------------------------------------- */

const CF_IP = "104.21.48.1";

type Row = {
  id: string;
  name: string;
  type: string;
  value: string;
  job: string;
  /** dig দিয়ে DNS Only অবস্থায় যা দেখা যায় */
  plain: string;
  /** Proxied করা ঠিক কি না */
  proxyOk: boolean;
  onText: string;
  offText: string;
};

const ROWS: Row[] = [
  {
    id: "root",
    name: "@",
    type: "A",
    value: "103.94.135.2",
    job: "মূল Website",
    plain: "103.94.135.2",
    proxyOk: true,
    onText:
      "ঠিক পছন্দ। এটা একটা Website, চলে HTTP আর HTTPS এ, যেটা Cloudflare এর Proxy বোঝে। এখন সার্ভারের আসল IP লুকানো, আর পথে ঢাল আর Cache দুইটাই আছে।",
    offText:
      "চলবে, কিন্তু সুবিধাগুলো হারালেন। পর্যটক সরাসরি আপনার সার্ভারে আসছেন, আসল IP সবাই দেখতে পাচ্ছে, আর আক্রমণ এলে সোজা সার্ভারে লাগবে।",
  },
  {
    id: "www",
    name: "www",
    type: "CNAME",
    value: "islandtours.example",
    job: "www সহ একই সাইট",
    plain: "islandtours.example, তারপর 103.94.135.2",
    proxyOk: true,
    onText:
      "ঠিক পছন্দ। মূল নামের মতোই এটাও Website। দুইটা একই অবস্থায় রাখুন, নাহলে www দিয়ে আর www ছাড়া সাইটটা দুই রকম আচরণ করবে।",
    offText:
      "চলবে, তবে মূল নাম Proxied আর www DNS Only হলে দুই নামে সাইটের গতি আর নিরাপত্তা আলাদা হয়ে যায়। দুইটা মিলিয়ে রাখুন।",
  },
  {
    id: "api",
    name: "api",
    type: "A",
    value: "103.94.135.3",
    job: "Backend API (HTTPS)",
    plain: "103.94.135.3",
    proxyOk: true,
    onText:
      "ঠিক আছে, কারণ API ও HTTPS এ চলে। তবে খেয়াল রাখুন, খুব লম্বা সময়ের Request বা বড় ফাইল Upload এ Cloudflare এর সীমা আছে। সাধারণ বুকিং এর API তে সমস্যা হয় না।",
    offText:
      "চলবে। কিছু দল API কে ইচ্ছা করেই DNS Only রাখে, যাতে মাঝখানে কিছু না থাকে। তখন সার্ভারের নিরাপত্তা নিজেকেই সামলাতে হয়।",
  },
  {
    id: "mail",
    name: "mail",
    type: "A",
    value: "103.94.135.9",
    job: "ইমেইল সার্ভার (MX এর লক্ষ্য)",
    plain: "103.94.135.9",
    proxyOk: false,
    onText:
      "ভুল। ইমেইল HTTP তে চলে না, চলে SMTP তে, আর Cloudflare এর Proxy শুধু HTTP আর HTTPS বোঝে। এখন অন্যের ইমেইল সার্ভার Cloudflare এর IP তে গিয়ে কড়া নাড়বে, আর কেউ সাড়া দেবে না। ইমেইল আসা বন্ধ।",
    offText:
      "ঠিক পছন্দ। ইমেইলের সাথে জড়িত প্রতিটা Record সবসময় DNS Only। এটা এই লেসনের সবচেয়ে চেনা ভুলের জায়গা।",
  },
  {
    id: "ssh",
    name: "ssh",
    type: "A",
    value: "103.94.135.2",
    job: "সার্ভারে SSH দিয়ে ঢোকা",
    plain: "103.94.135.2",
    proxyOk: false,
    onText:
      "ভুল। SSH ও HTTP নয়। Proxied করলে ssh কমান্ডটা Cloudflare এর কাছে যাবে, যে SSH বোঝে না, আর সংযোগ ঝুলে থেকে ব্যর্থ হবে।",
    offText:
      "ঠিক পছন্দ। SSH, FTP, Database, Game server, যা কিছু Website নয়, সব DNS Only। তবে মনে রাখুন, এই Record টা আপনার সার্ভারের আসল IP ফাঁস করে দিচ্ছে।",
  },
];

export function ProxyToggleLab() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState<Record<string, boolean>>({
    root: true,
    www: true,
    api: true,
    mail: false,
    ssh: false,
  });
  const [focus, setFocus] = useState<string>("root");

  const row = ROWS.find((r) => r.id === focus) ?? ROWS[0];
  const proxied = on[row.id];
  const good = proxied ? row.proxyOk : true;
  const wrong = ROWS.filter((r) => on[r.id] && !r.proxyOk).length;

  return (
    <Panel
      label="Interactive"
      title="মেঘে চাপ দিন, কমলা নাকি ধূসর"
      footer="প্রতিটা সারির ডান দিকের বোতামে চাপ দিয়ে Proxy চালু বা বন্ধ করুন, আর নিচে দেখুন বাইরের দুনিয়া তখন কোন IP দেখে আর ফল কী হয়। নিয়মটা এক লাইনের, যা Browser এ খোলে তা কমলা হতে পারে, বাকি সব ধূসর। mail আর ssh কে ইচ্ছা করে কমলা করে দেখুন কী ভাঙে।"
    >
      <div className="border border-border mb-5 overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[70px_70px_1fr_120px] gap-2 px-3 py-2 border-b border-border bg-muted/30 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>Name</span>
            <span>Type</span>
            <span>Content</span>
            <span>Proxy status</span>
          </div>
          {ROWS.map((r) => {
            const isOn = on[r.id];
            const bad = isOn && !r.proxyOk;
            return (
              <div
                key={r.id}
                data-row={r.id}
                className={cn(
                  "grid grid-cols-[70px_70px_1fr_120px] gap-2 items-center px-3 py-2 border-b border-border/60 last:border-b-0 transition-colors",
                  focus === r.id && "bg-primary/5",
                )}
              >
                <button
                  onClick={() => setFocus(r.id)}
                  className="text-left font-mono text-[12px] font-bold text-foreground"
                >
                  {r.name}
                </button>
                <span className="font-mono text-[11px] font-bold text-primary">
                  {r.type}
                </span>
                <button
                  onClick={() => setFocus(r.id)}
                  className="text-left font-mono text-[11px] text-muted-foreground break-all"
                >
                  {r.value}
                </button>
                <button
                  onClick={() => {
                    setOn((s) => ({ ...s, [r.id]: !s[r.id] }));
                    setFocus(r.id);
                  }}
                  data-toggle={r.id}
                  data-proxied={isOn ? "true" : "false"}
                  aria-pressed={isOn}
                  className={cn(
                    "px-2 py-1.5 border text-[11px] font-bold transition-colors",
                    bad
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : isOn
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {isOn ? "Proxied" : "DNS only"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <motion.div
        key={`${row.id}-${proxied ? "on" : "off"}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={cn(
          "border p-5",
          good ? "border-primary/40 bg-primary/5" : "border-destructive/50 bg-destructive/5",
        )}
        data-verdict={good ? "ok" : "broken"}
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
          <span className="font-mono text-sm font-bold text-foreground">
            {row.name === "@" ? "islandtours.example" : `${row.name}.islandtours.example`}
          </span>
          <span className="text-[11px] text-muted-foreground">{row.job}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="border border-border/60 bg-background px-3 py-2">
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              বাইরে থেকে dig করলে যা আসে
            </div>
            <div className="font-mono text-[11px] font-bold text-foreground break-all" data-seen={proxied ? CF_IP : row.plain}>
              {proxied ? `${CF_IP} (Cloudflare)` : row.plain}
            </div>
          </div>
          <div className="border border-border/60 bg-background px-3 py-2">
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
              সার্ভারের আসল IP
            </div>
            <div className="text-[12px] font-bold text-foreground">
              {proxied ? "লুকানো" : "সবার কাছে খোলা"}
            </div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {proxied ? row.onText : row.offText}
        </p>
      </motion.div>

      <p className="mt-4 text-[11px] text-muted-foreground" data-wrong={wrong}>
        {wrong === 0
          ? "এই মুহূর্তে তালিকায় কোনো ভুল Proxy নেই।"
          : "তালিকায় এমন Record কমলা হয়ে আছে যেটা Website নয়। লাল বোতামটা ধূসর করুন।"}
      </p>
    </Panel>
  );
}
