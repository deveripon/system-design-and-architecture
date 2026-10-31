/**
 * What: The interactive labs for Module 07 Lesson 02. SignalLab sends one signal to a
 * program with or without a handler and shows what happens and which exit code comes back.
 * UnitFileLab walks my-tours-api.service line by line. StopTimelineLab replays the seconds
 * after `systemctl stop` for three kinds of app. RestartLoopLab simulates a crash loop and
 * shows whether systemd's start limit ever stops it.
 *
 * Why: Signals, stop timeouts and start limits are rules about time and order, and those are
 * learned by changing one input and watching the result move. Every number the labs print
 * (exit codes 143, 130, 137 and 129, the journal lines, the default limit of 5 starts in 10 s)
 * was checked on the Ubuntu 24.04 practice server. State is derived from the selected inputs
 * in render, never synced in an effect.
 */
"use client";

import { cn, toBn } from "@/lib/utils";
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

function Choice({
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
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "px-3 py-1.5 border font-mono text-[0.6875rem] transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary font-bold"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40",
      )}
    >
      {children}
    </button>
  );
}

function Fact({ term, value, strong }: { term: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className="border border-border bg-background px-4 py-3 min-w-0">
      <div className="text-[0.625rem] text-muted-foreground mb-1">{term}</div>
      <div
        className={cn(
          "text-[0.8125rem] leading-relaxed",
          strong ? "font-mono font-bold text-primary" : "text-foreground",
        )}
      >
        {value}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. SignalLab                                                               */
/* ------------------------------------------------------------------------- */

type SignalId = "HUP" | "INT" | "TERM" | "KILL" | "STOP";

const SIGNALS: Record<
  SignalId,
  {
    number: number;
    catchable: boolean;
    from: string;
    withHandler: string;
    withoutHandler: string;
    exitWithout: string;
    exitWith: string;
  }
> = {
  HUP: {
    number: 1,
    catchable: true,
    from: "Terminal বা SSH Connection বন্ধ হলে। অনেক Daemon এটাকে Setting আবার পড়ার ইশারা হিসেবেও নেয়।",
    withHandler: "Program নিজে ঠিক করে কী করবে। অনেক Server এ এর মানে Config আবার পড়া, Process না থামিয়ে।",
    withoutHandler: "Default নিয়মে Process মরে যায়। & দিয়ে চালানো Job এভাবেই SSH বন্ধ হলে মরে।",
    exitWithout: "129, মানে 128 যোগ 1",
    exitWith: "Program যা ঠিক করে",
  },
  INT: {
    number: 2,
    catchable: true,
    from: "Terminal এ Ctrl+C চাপলে, শুধু সামনের Process এ যায়।",
    withHandler: "Program গুছিয়ে নিয়ে বেরোতে পারে, যেমন একটা লেখা অর্ধেক ফাইল মুছে দেওয়া।",
    withoutHandler: "Process সাথে সাথে মরে।",
    exitWithout: "130, মানে 128 যোগ 2",
    exitWith: "Program যা ঠিক করে, ভালো হলে 0",
  },
  TERM: {
    number: 15,
    catchable: true,
    from: "systemctl stop, Server Reboot, Docker stop, kill কমান্ড এর Default।",
    withHandler: "নতুন কাজ নেওয়া বন্ধ, চলমান কাজ শেষ, তারপর নিজে বেরোনো। এটাই Graceful Shutdown।",
    withoutHandler: "Process সাথে সাথে মরে, মাঝপথের Request গুলো কাটা পড়ে।",
    exitWithout: "143, মানে 128 যোগ 15",
    exitWith: "Program যা ঠিক করে, ভালো হলে 0",
  },
  KILL: {
    number: 9,
    catchable: false,
    from: "kill -9, systemd এর TimeoutStopSec পার হলে, আর Memory ফুরালে Kernel এর OOM Killer।",
    withHandler: "Handler থাকলেও কিছু যায় আসে না। Kernel নিজে Process টা মুছে দেয়, Program কিছু জানতেও পারে না।",
    withoutHandler: "Kernel নিজে Process টা মুছে দেয়। খোলা ফাইল, অর্ধেক লেখা Data, সব যেমন ছিল তেমন পড়ে থাকে।",
    exitWithout: "137, মানে 128 যোগ 9",
    exitWith: "137, Handler এর কোনো সুযোগই নেই",
  },
  STOP: {
    number: 19,
    catchable: false,
    from: "kill -STOP। Terminal এর Ctrl+Z পাঠায় এর ভদ্র ভাই SIGTSTP।",
    withHandler: "ধরা যায় না। Process জমে যায়, STAT কলামে T। SIGCONT পেলে যেখানে ছিল সেখান থেকে চলে।",
    withoutHandler: "Process জমে যায়, STAT কলামে T। মরে না, শুধু থেমে থাকে। SIGCONT, fg বা bg দিলে আবার চলে।",
    exitWithout: "নেই, Process বেঁচেই আছে",
    exitWith: "নেই, Process বেঁচেই আছে",
  },
};

export function SignalLab() {
  const [signal, setSignal] = useState<SignalId>("TERM");
  const [handler, setHandler] = useState(true);
  const s = SIGNALS[signal];
  const caught = handler && s.catchable;

  return (
    <Panel
      label="Lab: Signal পাঠান"
      title="kill -SIGNAL PID"
      footer="Exit Code গুলো Practice Server এ sleep এর উপর kill, kill -INT, kill -KILL আর kill -HUP চালিয়ে মিলিয়ে দেখা: 143, 130, 137, 129। নিয়মটা একটাই, Signal এ মরলে Shell দেখায় 128 যোগ Signal এর নম্বর। তাই Log এ 137 দেখলেই বুঝবেন কেউ SIGKILL দিয়েছিল।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          Signal
        </span>
        {(Object.keys(SIGNALS) as SignalId[]).map(id => (
          <Choice key={id} active={signal === id} onClick={() => setSignal(id)}>
            {`SIG${id} (${SIGNALS[id].number})`}
          </Choice>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          Program এ
        </span>
        <Choice active={handler} onClick={() => setHandler(true)}>
          Handler আছে
        </Choice>
        <Choice active={!handler} onClick={() => setHandler(false)}>
          Handler নেই
        </Choice>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <Fact term="ধরা যায়?" value={s.catchable ? "হ্যাঁ, Program চাইলে ধরতে পারে" : "না, কোনোভাবেই না"} strong />
        <Fact term="Shell এ Exit Code" value={caught ? s.exitWith : s.exitWithout} strong />
        <Fact term="কোথা থেকে আসে" value={s.from} />
      </div>
      <div
        className={cn(
          "border px-4 py-3",
          caught ? "border-primary bg-primary/5" : "border-border bg-background",
        )}
      >
        <div className="text-[0.625rem] text-muted-foreground mb-1">কী ঘটে</div>
        <p className="text-[0.8125rem] text-foreground leading-relaxed">
          {handler ? s.withHandler : s.withoutHandler}
        </p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. UnitFileLab                                                             */
/* ------------------------------------------------------------------------- */

const UNIT_LINES: { text: string; section?: boolean; does: string; without: string }[] = [
  {
    text: "[Unit]",
    section: true,
    does: "এই অংশে থাকে Unit টার পরিচয় আর অন্যদের সাথে সম্পর্ক: কে কার পরে চালু হবে।",
    without: "অংশের নাম ভুল হলে নিচের লাইনগুলো systemd বুঝবে না, Log এ Unknown section লিখবে।",
  },
  {
    text: "Description=my-tours API (Node.js)",
    does: "মানুষের পড়ার জন্য একটা নাম। systemctl status এর প্রথম লাইনে আর Journal এর Started লাইনে এটাই দেখায়।",
    without: "কিছু ভাঙে না, কিন্তু Log এ শুধু ফাইলের নাম দেখাবে, রাতে খুঁজতে কষ্ট হবে।",
  },
  {
    text: "After=network-online.target",
    does: "ক্রম ঠিক করে: এই Service চালু হবে Network পুরো তৈরি হওয়ার পরে। After নিজে কাউকে চালু করে না, শুধু অপেক্ষা করায়।",
    without: "Boot এর সময় App এমন মুহূর্তে চালু হতে পারে যখন Network তৈরি নয়, তখন Database বা বাইরের API তে প্রথম Connection ব্যর্থ হতে পারে।",
  },
  {
    text: "Wants=network-online.target",
    does: "After এর সঙ্গী। এটা systemd কে network-online.target টাকেও চালু করতে বলে। দুইটা একসাথে লাগে: Wants চালু করায়, After অপেক্ষা করায়।",
    without: "কেউ network-online.target চালু না করলে After এর অপেক্ষার কোনো মানে থাকে না।",
  },
  {
    text: "[Service]",
    section: true,
    does: "এই অংশে থাকে আসল কাজ: কোন Program, কোন User হয়ে, কোন Setting নিয়ে, মরলে কী।",
    without: "Service Unit এ এই অংশ না থাকলে চালানোর কিছুই নেই।",
  },
  {
    text: "Type=simple",
    does: "ExecStart এর Process টাই মূল Process, সে চালু হওয়া মানেই Service চালু। Node, Python, Go এর Server এর জন্য এটাই ঠিক, আর এটাই Default।",
    without: "Default ও simple, তাই না লিখলেও চলে। পুরনো দিনের যেসব Daemon নিজে Background এ চলে যায়, তাদের জন্য forking লাগে।",
  },
  {
    text: "User=mytours",
    does: "App চলবে mytours নামের একটা আলাদা User হয়ে, যার Login নেই আর ক্ষমতা কম।",
    without: "App চলবে root হয়ে। App এ একটা ফুটো থাকলে আক্রমণকারী পুরো Server এর মালিক হয়ে যাবে। লেসন ০৪ এ এই User এর গল্প।",
  },
  {
    text: "Group=mytours",
    does: "Process এর Group। /srv/my-tours আর api.env এর Group ও mytours, তাই App সেগুলো পড়তে পারে।",
    without: "User এর নিজের Primary Group ধরা হয়, এখানে ফল একই। তবু লিখে রাখা ভালো, পড়লেই বোঝা যায়।",
  },
  {
    text: "WorkingDirectory=/srv/my-tours",
    does: "App চালু হওয়ার সময় কোন Folder এ দাঁড়িয়ে থাকবে। Code এ ./ দিয়ে কোনো ফাইল খুঁজলে এখান থেকে খুঁজবে।",
    without: "App দাঁড়াবে / এ। Relative Path দিয়ে কোনো ফাইল খুলতে গেলে ENOENT Error।",
  },
  {
    text: "EnvironmentFile=/etc/my-tours/api.env",
    does: "এই ফাইলের প্রতিটা KEY=value লাইন App এর Environment এ যায়: PORT, NODE_ENV, SHUTDOWN_GRACE_MS। লেসন ০৫ এর বিষয়।",
    without: "App এর Environment প্রায় খালি। .bashrc এ লেখা Variable গুলো এখানে কখনো আসে না। আমাদের App লিখবে PORT is not set আর বেরিয়ে যাবে।",
  },
  {
    text: "ExecStart=/usr/bin/node /srv/my-tours/server.mjs",
    does: "আসল কমান্ড, পুরো Path সহ। কোন node, সেটা which node দিয়ে দেখে নিন।",
    without: "Service চালুই হবে না। Path ভুল হলে status এ দেখাবে status=203/EXEC, মানে systemd ফাইলটা চালাতেই পারেনি।",
  },
  {
    text: "Restart=on-failure",
    does: "App ভুল Exit Code দিয়ে বা Signal এ মরলে systemd নিজে আবার চালু করে। আপনি stop দিলে করে না।",
    without: "Default হলো no। রাত তিনটায় App একবার Crash করলে সকাল পর্যন্ত বন্ধ থাকবে।",
  },
  {
    text: "RestartSec=2",
    does: "আবার চালু করার আগে ২ সেকেন্ড অপেক্ষা, যাতে Database এর মতো যার জন্য Crash হয়েছিল সে একটু সামলে নিতে পারে।",
    without: "Default ১০০ মিলিসেকেন্ড। একটা ভাঙা App সেকেন্ডে কয়েকবার চালু হওয়ার চেষ্টা করবে, আর দ্রুত Start Limit এ আটকে যাবে।",
  },
  {
    text: "TimeoutStopSec=15",
    does: "stop দেওয়ার পর SIGTERM পেয়ে App কে গুছিয়ে নিতে ১৫ সেকেন্ড। তারপর systemd SIGKILL পাঠায়।",
    without: "Default ৯০ সেকেন্ড। একটা জেদি App প্রতিটা Deploy আর Reboot দেড় মিনিট আটকে রাখতে পারে।",
  },
  {
    text: "[Install]",
    section: true,
    does: "এই অংশ শুধু systemctl enable পড়ে। কোন Target এর সাথে জুড়লে Boot এ চালু হবে, সেটা এখানে।",
    without: "enable করা যাবে না। status এ দেখাবে static, মানে নিজে Boot এ চালু হবে না।",
  },
  {
    text: "WantedBy=multi-user.target",
    does: "enable করলে multi-user.target.wants Folder এ একটা Symlink বসে। Boot এ এই Target পৌঁছালেই App চালু।",
    without: "Reboot এর পর App নিজে চালু হবে না, কাউকে হাতে start দিতে হবে।",
  },
];

export function UnitFileLab() {
  const [index, setIndex] = useState(6);
  const line = UNIT_LINES[index];

  return (
    <Panel
      label="Lab: Unit ফাইল, লাইন ধরে ধরে"
      title="/etc/systemd/system/my-tours-api.service"
      footer="যেকোনো লাইনে চাপ দিন। ডানে দেখবেন লাইনটা কী করে আর না থাকলে কী হয়। ফাইলটা এই লেসনের Practice Server এ হুবহু এভাবেই বসানো আর চালানো হয়েছে।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="border border-border bg-background py-2 min-w-0 overflow-x-auto">
          {UNIT_LINES.map((l, i) => (
            <button
              key={l.text}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
              className={cn(
                "block w-full text-left px-4 py-1 font-mono text-[0.75rem] whitespace-pre transition-colors",
                l.section && i > 0 && "mt-3",
                i === index
                  ? "bg-primary/10 text-primary font-bold"
                  : l.section
                    ? "text-foreground hover:bg-muted/40"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              {l.text}
            </button>
          ))}
        </div>
        <div className="space-y-3 min-w-0">
          <div className="font-mono text-[0.8125rem] font-bold text-primary break-all">{line.text}</div>
          <Fact term="কী করে" value={line.does} />
          <Fact term="না থাকলে বা ভুল হলে" value={line.without} />
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. StopTimelineLab                                                         */
/* ------------------------------------------------------------------------- */

type Behaviour = "graceful" | "nohandler" | "ignore";

function stopOutcome(behaviour: Behaviour, workSec: number, timeoutSec: number) {
  if (behaviour === "nohandler") {
    return {
      stopSec: 0,
      booking: false,
      result: "success",
      lines: [
        "Stopping my-tours-api.service - my-tours API (Node.js)...",
        "my-tours-api.service: Deactivated successfully.",
        "Stopped my-tours-api.service - my-tours API (Node.js).",
      ],
      verdict:
        "systemd খুশি, Result success। কিন্তু চলমান বুকিংটা মাঝপথে কাটা পড়েছে, পর্যটক Error দেখেছেন। systemd এর success মানে শুধু Process টা থেমেছে, ভালোভাবে থেমেছে এমন নয়।",
    };
  }
  if (behaviour === "graceful" && workSec <= timeoutSec) {
    return {
      stopSec: workSec,
      booking: true,
      result: "success",
      lines: [
        "Stopping my-tours-api.service - my-tours API (Node.js)...",
        "SIGTERM received, finishing open requests",
        "all requests done, exiting with code 0",
        "my-tours-api.service: Deactivated successfully.",
      ],
      verdict: `চলমান বুকিং ${toBn(workSec)} সেকেন্ডে শেষ, তারপর App নিজে বেরিয়ে গেল। কেউ কিছু টের পাননি। এটাই লক্ষ্য।`,
    };
  }
  const finishedBeforeKill = behaviour === "ignore" && workSec < timeoutSec;
  return {
    stopSec: timeoutSec,
    booking: finishedBeforeKill,
    result: "timeout",
    lines: [
      "Stopping my-tours-api.service - my-tours API (Node.js)...",
      behaviour === "ignore" ? "got SIGTERM, ignoring it" : "SIGTERM received, finishing open requests",
      "my-tours-api.service: State 'stop-sigterm' timed out. Killing.",
      "my-tours-api.service: Main process exited, code=killed, status=9/KILL",
      "my-tours-api.service: Failed with result 'timeout'.",
    ],
    verdict:
      behaviour === "ignore"
        ? `App SIGTERM কানেই নেয়নি। systemd পুরো ${toBn(timeoutSec)} সেকেন্ড বসে থেকে SIGKILL দিল। ${finishedBeforeKill ? "বুকিংটা কপালগুণে আগেই শেষ হয়েছিল, কিন্তু প্রতিটা stop এখন এতক্ষণ লাগবে।" : "বুকিংটা শেষ হওয়ার আগেই Process মুছে গেছে।"}`
        : `App চেষ্টা করছিল, কিন্তু কাজটা ${toBn(workSec)} সেকেন্ডের আর সময়সীমা ${toBn(timeoutSec)} সেকেন্ড। মাঝপথে SIGKILL। হয় কাজ ছোট করুন, নয় TimeoutStopSec বাড়ান, আর SHUTDOWN_GRACE_MS কে সবসময় তার চেয়ে ছোট রাখুন।`,
  };
}

export function StopTimelineLab() {
  const [behaviour, setBehaviour] = useState<Behaviour>("graceful");
  const [workSec, setWorkSec] = useState(4);
  const [timeoutSec, setTimeoutSec] = useState(15);
  const o = stopOutcome(behaviour, workSec, timeoutSec);
  const scale = Math.max(timeoutSec, workSec, 1);
  const pct = (s: number) => `${Math.min(100, (s / scale) * 100)}%`;

  return (
    <Panel
      label="Lab: systemctl stop এর পরে"
      title="SIGTERM, অপেক্ষা, তারপর হয়তো SIGKILL"
      footer="Journal এর লাইনগুলো Practice Server এর আসল Log এর লেখা। শুধু সময়গুলো আপনার বেছে নেওয়া সংখ্যা দিয়ে হিসাব করা। তিনটা আচরণই সেখানে চালিয়ে দেখা হয়েছে।"
    >
      <div className="space-y-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground w-28">
            App এর আচরণ
          </span>
          <Choice active={behaviour === "graceful"} onClick={() => setBehaviour("graceful")}>
            SIGTERM ধরে
          </Choice>
          <Choice active={behaviour === "nohandler"} onClick={() => setBehaviour("nohandler")}>
            Handler নেই
          </Choice>
          <Choice active={behaviour === "ignore"} onClick={() => setBehaviour("ignore")}>
            SIGTERM উপেক্ষা করে
          </Choice>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground w-28">
            চলমান কাজ
          </span>
          {[2, 4, 10, 20].map(n => (
            <Choice key={n} active={workSec === n} onClick={() => setWorkSec(n)}>
              {`${n}s`}
            </Choice>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground w-28">
            TimeoutStopSec
          </span>
          {[5, 15, 90].map(n => (
            <Choice key={n} active={timeoutSec === n} onClick={() => setTimeoutSec(n)}>
              {`${n}s`}
            </Choice>
          ))}
        </div>
      </div>

      <div className="border border-border bg-background p-4 mb-4">
        <div className="relative h-8 mb-2">
          <div className="absolute inset-y-3 left-0 right-0 bg-muted/40" />
          {behaviour !== "nohandler" && (
            <div
              className="absolute inset-y-2 left-0 bg-primary/25 border border-primary transition-all duration-500"
              style={{ width: pct(Math.min(workSec, behaviour === "ignore" ? timeoutSec : workSec)) }}
            />
          )}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-foreground transition-all duration-500"
            style={{ left: pct(o.stopSec) }}
          />
        </div>
        <div className="flex justify-between font-mono text-[0.625rem] text-muted-foreground">
          <span>0s SIGTERM</span>
          <span>{`${scale}s`}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Fact term="Process থামল" value={`${o.stopSec} সেকেন্ডে`} strong />
        <Fact term="systemd এর Result" value={o.result} strong />
        <Fact term="চলমান বুকিং" value={o.booking ? "বাঁচল" : "হারাল"} strong />
      </div>
      <pre className="border border-border bg-background px-4 py-3 font-mono text-[0.6875rem] text-muted-foreground overflow-x-auto mb-3">
        {o.lines.join("\n")}
      </pre>
      <p className="text-[0.8125rem] text-foreground leading-relaxed">{o.verdict}</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. RestartLoopLab                                                          */
/* ------------------------------------------------------------------------- */

type Limit = { id: string; label: string; intervalSec: number; burst: number };

const LIMITS: Limit[] = [
  { id: "default", label: "Default: 10s এ 5", intervalSec: 10, burst: 5 },
  { id: "custom", label: "Drop-in: 60s এ 5", intervalSec: 60, burst: 5 },
];

/**
 * Replays systemd's start rate limit: a start is refused when, counting itself, more than
 * `burst` starts fall inside the last `intervalSec`. Times are in seconds from the first start.
 */
function simulateLoop(crashAfterSec: number, restartSec: number, limit: Limit, horizonSec: number) {
  const starts: number[] = [];
  let t = 0;
  while (t <= horizonSec) {
    const recent = starts.filter(s => s > t - limit.intervalSec).length + 1;
    if (recent > limit.burst) {
      return { starts, refusedAt: t };
    }
    starts.push(t);
    t = t + crashAfterSec + restartSec;
  }
  return { starts, refusedAt: null as number | null };
}

export function RestartLoopLab() {
  const [crashAfter, setCrashAfter] = useState(1);
  const [restartSec, setRestartSec] = useState(2);
  const [limitId, setLimitId] = useState("default");
  const limit = LIMITS.find(l => l.id === limitId) ?? LIMITS[0];
  const horizon = 60;
  const { starts, refusedAt } = simulateLoop(crashAfter, restartSec, limit, horizon);
  const restarts = Math.max(0, starts.length - 1);

  return (
    <Panel
      label="Lab: Crash Loop"
      title="Restart=on-failure, আর systemd কখন হাল ছাড়ে"
      footer="Practice Server এ PORT মুছে দিয়ে আসল Crash Loop চালানো হয়েছিল। App প্রায় ১ সেকেন্ডে মরছিল, RestartSec=2। Default সীমায় ৪০ সেকেন্ডে ১৪ বার আবার চালু হয়েছে, থামেনি। 60s এ 5 এর Drop-in বসানোর পর পঞ্চম Restart এর চেষ্টায় লিখেছে Start request repeated too quickly, আর Service গেছে failed এ। এই Lab ঠিক সেই নিয়মটাই হিসাব করে।"
    >
      <div className="space-y-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground w-28">
            App মরে
          </span>
          {[0.5, 1, 5].map(n => (
            <Choice key={n} active={crashAfter === n} onClick={() => setCrashAfter(n)}>
              {`${n}s পরে`}
            </Choice>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground w-28">
            RestartSec
          </span>
          {[0.1, 2, 10].map(n => (
            <Choice key={n} active={restartSec === n} onClick={() => setRestartSec(n)}>
              {n === 0.1 ? "100ms (Default)" : `${n}s`}
            </Choice>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground w-28">
            Start Limit
          </span>
          {LIMITS.map(l => (
            <Choice key={l.id} active={limitId === l.id} onClick={() => setLimitId(l.id)}>
              {l.label}
            </Choice>
          ))}
        </div>
      </div>

      <div className="border border-border bg-background p-4 mb-4">
        <div className="relative h-10">
          <div className="absolute top-5 left-0 right-0 h-px bg-border" />
          {starts.map((s, i) => (
            <div
              key={`${s}-${i}`}
              className="absolute top-3 w-2 h-4 -ml-1 bg-primary/70"
              style={{ left: `${(s / horizon) * 100}%` }}
              title={`start at ${s.toFixed(1)}s`}
            />
          ))}
          {refusedAt !== null && (
            <div
              className="absolute top-1 w-0.5 h-8 bg-foreground"
              style={{ left: `${Math.min(100, (refusedAt / horizon) * 100)}%` }}
            />
          )}
        </div>
        <div className="flex justify-between font-mono text-[0.625rem] text-muted-foreground">
          <span>0s</span>
          <span>{`${horizon}s`}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Fact term="৬০ সেকেন্ডে চালু হলো" value={`${toBn(starts.length)} বার`} strong />
        <Fact term="Restart এর সংখ্যা" value={toBn(restarts)} strong />
        <Fact
          term="শেষ অবস্থা"
          value={refusedAt !== null ? `failed, ${refusedAt.toFixed(1)}s এ` : "activating, চলতেই থাকবে"}
          strong
        />
      </div>
      <p className="text-[0.8125rem] text-foreground leading-relaxed">
        {refusedAt !== null
          ? `শেষ ${toBn(limit.intervalSec)} সেকেন্ডে ${toBn(limit.burst)} বারের বেশি চালু হতে চাইছিল, তাই systemd থেমে গেল: Start request repeated too quickly। এখন কেউ কারণ ঠিক করে systemctl reset-failed আর start না দেওয়া পর্যন্ত Service বন্ধ থাকবে।`
          : `প্রতিটা চক্র ${toBn(crashAfter + restartSec)} সেকেন্ডের, তাই কোনো ${toBn(limit.intervalSec)} সেকেন্ডের জানালায় ${toBn(limit.burst)} বারের বেশি চালু হয় না। systemd কখনো হাল ছাড়বে না, App চিরকাল চালু হবে আর মরবে, আর Log ভরতে থাকবে।`}
      </p>
    </Panel>
  );
}
