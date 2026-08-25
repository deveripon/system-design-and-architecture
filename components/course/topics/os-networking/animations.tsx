"use client";

import { EASE } from "@/components/motion/reveal";
import { cn, toBn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, RotateCcw, X } from "lucide-react";
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
/* 1. Kernel এর খাতা: কোন ফ্ল্যাটে কে                                            */
/* ------------------------------------------------------------------------- */

type Program = { key: string; name: string; port: number; what: string };

const STARTABLE: Program[] = [
  { key: "nginx", name: "nginx", port: 80, what: "Web Server" },
  { key: "node", name: "node server.js", port: 3000, what: "আপনার API" },
  { key: "pg", name: "postgres", port: 5432, what: "Database" },
  {
    key: "node2",
    name: "node server.js",
    port: 3000,
    what: "একই API, দ্বিতীয়বার চালু",
  },
];

const KNOCK_PORTS = [80, 3000, 3001, 5432];

type Running = { key: string; name: string; port: number; pid: number };

type LogLine = { tone: "ok" | "error" | "info"; text: string };

export function PortTableLab() {
  const reduce = useReducedMotion();
  const [running, setRunning] = useState<Running[]>([]);
  const [nextPid, setNextPid] = useState(4821);
  const [log, setLog] = useState<LogLine | null>(null);
  const [knock, setKnock] = useState<number>(3000);

  const start = (p: Program) => {
    const taken = running.find((r) => r.port === p.port);
    if (taken) {
      setLog({
        tone: "error",
        text: `Error: listen EADDRINUSE: address already in use :::${p.port}\n\nফ্ল্যাট ${p.port} এ আগে থেকেই ${taken.name} (PID ${taken.pid}) বসে আছে। Kernel এক ফ্ল্যাটে দুইজনকে বসায় না। পুরনোটাকে আগে বের করতে হবে।`,
      });
      return;
    }
    setRunning((r) => [
      ...r,
      { key: p.key, name: p.name, port: p.port, pid: nextPid },
    ]);
    setNextPid((n) => n + 7);
    setLog({
      tone: "ok",
      text: `${p.name} চালু হলো, PID ${nextPid}। সে Kernel কে বলল, listen(${p.port})। Kernel খাতায় লিখল: ফ্ল্যাট ${p.port} → PID ${nextPid}। এখন থেকে ${p.port} এ যা আসবে, সব এই Process পাবে।`,
    });
  };

  const kill = (pid: number) => {
    const r = running.find((x) => x.pid === pid);
    setRunning((list) => list.filter((x) => x.pid !== pid));
    if (r)
      setLog({
        tone: "info",
        text: `kill ${pid}। ${r.name} মরে গেল, আর Kernel খাতা থেকে ফ্ল্যাট ${r.port} এর লাইনটা মুছে দিল। ফ্ল্যাট খালি, এখন অন্য কেউ বসতে পারবে।`,
      });
  };

  const doKnock = () => {
    const r = running.find((x) => x.port === knock);
    if (r) {
      setLog({
        tone: "ok",
        text: `curl localhost:${knock}\n\nKernel খাতায় ${knock} খুঁজল, পেল PID ${r.pid}। কড়া নাড়ল, ${r.name} দরজা খুলে উত্তর দিল।`,
      });
    } else {
      setLog({
        tone: "error",
        text: `curl: (7) Failed to connect to localhost port ${knock}: Connection refused\n\nমেশিনটা আছে, Kernel ও জেগে আছে, কিন্তু খাতায় ${knock} এর পাশে কেউ নেই। Kernel সাথে সাথেই না বলে দিল। এটাই Connection refused, মানে বিল্ডিং ঠিক আছে, ফ্ল্যাটটা খালি।`,
      });
    }
  };

  return (
    <Panel
      label="Interactive"
      title="Kernel এর খাতা, নিজে হাতে চালান"
      footer="তিনটা এরর এখানে পাশাপাশি দেখলেন যেগুলো আপনি নিজের Terminal এ একদিন না একদিন পাবেন। EADDRINUSE মানে ফ্ল্যাটে আগেই কেউ বসে আছে, প্রায়ই পুরনো Process টা মরেনি। Connection refused মানে বিল্ডিং আছে কিন্তু ফ্ল্যাট খালি, প্রায়ই Server চালু করতে ভুলে গেছেন বা ভুল Port লিখেছেন। আর এই দুইটার কোনোটাই না হয়ে কিছুই না আসা, অনেকক্ষণ পর Timeout, মানে বিল্ডিং পর্যন্ত চিঠিই পৌঁছায়নি। কোন এরর, সেটা বলে দেয় সমস্যা কোথায়।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
        {/* controls */}
        <div className="space-y-5">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
              Program চালু করুন
            </div>
            <div className="flex flex-col gap-1.5">
              {STARTABLE.map((p) => (
                <button
                  key={p.key}
                  onClick={() => start(p)}
                  data-start={p.key}
                  className="flex items-center justify-between gap-3 px-3 py-2 border border-border text-left hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <span>
                    <span className="font-mono text-[11px] text-foreground">
                      {p.name}
                    </span>
                    <span className="block font-mono text-[8px] text-muted-foreground">
                      {p.what}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] text-primary font-bold shrink-0">
                    listen({p.port})
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
              কড়া নাড়ুন
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {KNOCK_PORTS.map((port) => (
                <button
                  key={port}
                  onClick={() => setKnock(port)}
                  data-knock-port={port}
                  className={cn(
                    "px-3 py-1.5 border font-mono text-[10px] transition-colors",
                    knock === port
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {port}
                </button>
              ))}
              <button
                onClick={doKnock}
                data-knock
                className="ml-auto px-4 py-1.5 border border-primary/40 bg-primary/5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary hover:bg-primary/10 transition-colors"
              >
                curl localhost:{knock}
              </button>
            </div>
          </div>
        </div>

        {/* the table */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
              Kernel এর খাতা: ফ্ল্যাট → Process
            </span>
            <span
              className="font-mono text-[9px] text-muted-foreground"
              data-running={running.length}
            >
              {toBn(running.length)} টা চলছে
            </span>
          </div>
          <div className="border border-border bg-background min-h-[140px]">
            <div className="grid grid-cols-[70px_1fr_70px_36px] gap-2 px-3 py-2 border-b border-border font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
              <span>Port</span>
              <span>Program</span>
              <span>PID</span>
              <span />
            </div>
            {running.length === 0 && (
              <div className="px-3 py-6 text-center font-mono text-[10px] text-muted-foreground/60">
                খাতা খালি। কেউ কোনো দরজা খোলেনি।
              </div>
            )}
            {[...running]
              .sort((a, b) => a.port - b.port)
              .map((r) => (
                <motion.div
                  key={r.pid}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  data-row-port={r.port}
                  className="grid grid-cols-[70px_1fr_70px_36px] gap-2 items-center px-3 py-2 border-b border-border last:border-b-0"
                >
                  <span className="font-mono text-[11px] font-bold text-primary">
                    {r.port}
                  </span>
                  <span className="font-mono text-[10px] text-foreground truncate">
                    {r.name}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {r.pid}
                  </span>
                  <button
                    onClick={() => kill(r.pid)}
                    aria-label={`kill ${r.pid}`}
                    data-kill={r.pid}
                    className="inline-flex items-center justify-center w-7 h-7 border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      {/* the log */}
      {log && (
        <motion.pre
          key={log.text}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          data-log-tone={log.tone}
          className={cn(
            "mt-6 p-4 border text-xs leading-relaxed whitespace-pre-wrap break-words font-sans",
            log.tone === "error" &&
              "border-primary/50 bg-primary/5 text-foreground",
            log.tone === "ok" && "border-accent/50 bg-accent/5 text-foreground",
            log.tone === "info" &&
              "border-border bg-muted/20 text-muted-foreground",
          )}
        >
          {log.text}
        </motion.pre>
      )}

      <div className="mt-4">
        <button
          onClick={() => {
            setRunning([]);
            setLog(null);
            setNextPid(4821);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          সব বন্ধ করুন
        </button>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. পঞ্চাশটা Tab, একটা ঠিকানা                                                 */
/* ------------------------------------------------------------------------- */

const FIRST_EPHEMERAL = 51234;
const SERVER = { ip: "103.94.135.2", port: 443 };
const ME = "192.168.0.12";

export function ManyTabsLab() {
  const reduce = useReducedMotion();
  const [tabs, setTabs] = useState<number[]>([FIRST_EPHEMERAL]);
  const [nextPort, setNextPort] = useState(FIRST_EPHEMERAL + 1);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const open = () => {
    setTabs((t) => [...t, nextPort]);
    setNextPort((n) => n + 1);
  };
  const close = (port: number) => {
    setTabs((t) => t.filter((p) => p !== port));
    if (replyTo === port) setReplyTo(null);
  };

  return (
    <Panel
      label="Interactive"
      title="একই Server, পঞ্চাশটা Tab, উত্তর ঠিক Tab এ ফেরে কীভাবে"
      footer="আপনার Laptop এর ঠিকানা একটাই, Server এর ফ্ল্যাটও একটাই, 443। তবু দশটা Tab এর দশটা উত্তর কখনো গুলিয়ে যায় না। কারণ প্রতিটা Tab কথা শুরু করার সময় Kernel তাকে একটা সাময়িক ফেরার ফ্ল্যাট দেয়, 49152 থেকে 65535 এর মধ্যে একটা নম্বর। খামে সেটা লেখা থাকে, Server উত্তরের খামে সেটাই ফিরিয়ে লেখে, আর আপনার Kernel খাতা দেখে ঠিক Tab টা খুঁজে বের করে। কথা শেষ হলে নম্বরটা ফেরত যায়। Client এরও Port আছে, শুধু সে বেছে নেয় না, Kernel দিয়ে দেয়।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={open}
          data-open-tab
          disabled={tabs.length >= 8}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 border font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
            tabs.length >= 8
              ? "border-border text-muted-foreground/40"
              : "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10",
          )}
        >
          <Plus className="w-3 h-3" />
          নতুন Tab খুলুন
        </button>
        <span className="text-xs text-muted-foreground">
          তারপর কোনো একটা সারিতে চাপুন, দেখুন Server এর উত্তর কোথায় যায়।
        </span>
      </div>

      <div className="border border-border bg-background overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[60px_1fr_1fr_40px] gap-3 px-4 py-2 border-b border-border font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>Tab</span>
            <span>আপনার দিক (ঠিকানা : ফেরার ফ্ল্যাট)</span>
            <span>Server এর দিক</span>
            <span />
          </div>
          {tabs.map((port, idx) => {
            const hot = replyTo === port;
            return (
              <motion.div
                key={port}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, ease: EASE }}
                onClick={() => setReplyTo(port)}
                role="button"
                data-tab-port={port}
                data-hot={hot ? "true" : "false"}
                className={cn(
                  "grid grid-cols-[60px_1fr_1fr_40px] gap-3 items-center px-4 py-2.5 border-b border-border last:border-b-0 cursor-pointer transition-colors duration-200",
                  hot ? "bg-accent/10" : "hover:bg-muted/30",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[11px] font-bold",
                    hot ? "text-accent" : "text-foreground",
                  )}
                >
                  Tab {toBn(idx + 1)}
                </span>
                <span className="font-mono text-[10px]">
                  <span className="text-muted-foreground">{ME}</span>
                  <span className="text-muted-foreground"> : </span>
                  <span
                    className={cn(
                      "font-bold",
                      hot ? "text-accent" : "text-primary",
                    )}
                  >
                    {port}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {SERVER.ip} :{" "}
                  <span className="text-foreground">{SERVER.port}</span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    close(port);
                  }}
                  aria-label={`Tab ${idx + 1} বন্ধ`}
                  data-close-tab={port}
                  className="inline-flex items-center justify-center w-7 h-7 border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            );
          })}
          {tabs.length === 0 && (
            <div className="px-4 py-6 text-center font-mono text-[10px] text-muted-foreground/60">
              কোনো Tab খোলা নেই, কোনো ফেরার ফ্ল্যাটও নেই।
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
        <motion.p
          key={replyTo ?? "none"}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          data-reply-text
          className="text-sm text-muted-foreground leading-relaxed"
        >
          {replyTo === null
            ? "সব Tab একই Server এর একই ফ্ল্যাট 443 এর সাথে কথা বলছে। তফাত শুধু আপনার দিকের নম্বরটায়। কোনো একটা সারিতে চাপুন।"
            : `Server উত্তরের খামে লিখল: ${ME} : ${replyTo}। আপনার Kernel খাতায় ${replyTo} খুঁজল, পেল Tab ${toBn(tabs.indexOf(replyTo) + 1)}। উত্তর ঠিক ওই Tab এ গেল, বাকিরা কিছুই জানল না। চারটা সংখ্যা মিলিয়ে একটা কথা আলাদা হয়: আপনার ঠিকানা, আপনার ফ্ল্যাট, Server এর ঠিকানা, Server এর ফ্ল্যাট।`}
        </motion.p>
        <div className="font-mono text-[9px] text-muted-foreground border border-border px-3 py-2 shrink-0">
          <div className="uppercase tracking-[0.12em] mb-1">
            ব্যবহৃত ফেরার ফ্ল্যাট
          </div>
          <div
            className="text-primary font-bold text-base"
            data-tab-count={tabs.length}
          >
            {toBn(tabs.length)}
          </div>
        </div>
      </div>
    </Panel>
  );
}
