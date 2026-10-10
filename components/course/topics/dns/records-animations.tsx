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
/* 1. Record এর ধরনগুলো, একটা একটা করে                                         */
/* ------------------------------------------------------------------------- */

type Rec = {
  type: string;
  answers: string;
  example: string;
  use: string;
  dig: string;
};

const RECS: Rec[] = [
  {
    type: "A",
    answers: "এই নামের IPv4 ঠিকানা কী?",
    example: "islandtours.example   A   103.94.135.2",
    use: "সবচেয়ে মৌলিক Record। একটা নামকে সরাসরি একটা সার্ভারের IP তে নিয়ে যায়। আপনার সাইট কোথায়, সেটা বলে এই Record।",
    dig: "dig +short A islandtours.example",
  },
  {
    type: "AAAA",
    answers: "এই নামের IPv6 ঠিকানা কী?",
    example: "islandtours.example   AAAA   2001:db8::7334",
    use: "A এর যমজ, শুধু IPv6 এর জন্য। সার্ভারের IPv6 ঠিকানা থাকলে এটাও বসান, যাতে নতুন ধরনের Network থেকেও পৌঁছানো যায়।",
    dig: "dig +short AAAA google.com",
  },
  {
    type: "CNAME",
    answers: "এই নামটা আসলে কোন নামের ডাকনাম?",
    example: "www   CNAME   islandtours.example",
    use: "IP দেয় না, আরেকটা নাম দেয়। www বা shop এর মতো উপনামকে আরেকটা নামের দিকে দেখাতে, বিশেষ করে Hosting এর দেওয়া নামের দিকে।",
    dig: "dig +short CNAME www.github.com",
  },
  {
    type: "MX",
    answers: "এই Domain এর ইমেইল কোন সার্ভারে যাবে?",
    example: "islandtours.example   MX   10 mail.provider.example",
    use: "ইমেইলের ঠিকানা। সামনের সংখ্যাটা অগ্রাধিকার, ছোট সংখ্যা আগে চেষ্টা করা হয়। এটা না থাকলে আপনার Domain এ ইমেইল আসবে না।",
    dig: "dig +short MX google.com",
  },
  {
    type: "TXT",
    answers: "এই নামের সাথে কোনো লেখা তথ্য জুড়ে আছে কি?",
    example: 'islandtours.example   TXT   "v=spf1 include:_spf.provider.example ~all"',
    use: "যেকোনো লেখা রাখার জায়গা। মূলত দুই কাজে, Domain যে আপনার সেটা প্রমাণ করতে, আর ইমেইল জালিয়াতি ঠেকাতে (SPF, DKIM, DMARC)।",
    dig: "dig +short TXT google.com",
  },
  {
    type: "NS",
    answers: "এই Domain এর Authoritative server কারা?",
    example: "islandtours.example   NS   ns1.dnshost.example",
    use: "আগের লেসনের সেই Name Server। বলে দেয় এই নামের আসল হিসাব কার কাছে। সাধারণত দুই বা তার বেশি থাকে, একটা বন্ধ হলে আরেকটা সামলায়।",
    dig: "dig +short NS islandtours.example",
  },
  {
    type: "SRV",
    answers: "এই সেবাটা কোন সার্ভারের কোন Port এ চলছে?",
    example: "_sip._tcp   SRV   10 5 5060 sip.provider.example",
    use: "শুধু নাম নয়, Port ও বলে দেয়। সাধারণ Website এ লাগে না, কিন্তু Voice Call, Chat বা কিছু Database সেবা নিজের ঠিকানা এভাবে জানায়।",
    dig: "dig +short SRV _imaps._tcp.gmail.com",
  },
];

export function RecordExplorerLab() {
  const reduce = useReducedMotion();
  const [type, setType] = useState<string>("A");
  const r = RECS.find((x) => x.type === type) ?? RECS[0];

  return (
    <Panel
      label="Interactive"
      title="সাত ধরনের Record, চাপ দিয়ে দেখুন"
      footer="প্রতিটা Record আসলে একটা নির্দিষ্ট প্রশ্নের উত্তর। A বলে IP কী, MX বলে ইমেইল কোথায়, NS বলে হিসাব কার কাছে। মুখস্থ করার দরকার নেই, শুধু মনে রাখুন কোন প্রশ্নের জন্য কোন Record। নিচের কমান্ডটা কপি করে নিজের Terminal এ চালালে সত্যিকারের একটা উত্তর দেখতে পাবেন।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {RECS.map((rec) => (
          <button
            key={rec.type}
            onClick={() => setType(rec.type)}
            data-type={rec.type}
            data-active={rec.type === type ? "true" : "false"}
            className={cn(
              "px-3 py-2 border font-mono text-[12px] font-bold transition-colors",
              rec.type === type
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {rec.type}
          </button>
        ))}
      </div>

      <motion.div
        key={r.type}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="border border-border bg-background p-5 space-y-4"
        data-record={r.type}
      >
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            যে প্রশ্নের উত্তর দেয়
          </div>
          <div className="text-base font-bold text-primary">{r.answers}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            দেখতে যেমন
          </div>
          <div className="font-mono text-[11px] text-foreground break-all border border-border/60 bg-muted/30 px-3 py-2">
            {r.example}
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            কখন লাগে
          </div>
          <div className="text-sm text-foreground leading-relaxed">{r.use}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            নিজে দেখুন
          </div>
          <div className="font-mono text-[11px] text-accent break-all">
            {r.dig}
          </div>
        </div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কাজটা বলুন, Record টা বলে দিই                                            */
/* ------------------------------------------------------------------------- */

type Job = {
  id: string;
  want: string;
  rec: string;
  row: string;
  why: string;
};

const JOBS: Job[] = [
  {
    id: "site",
    want: "মূল নামে সাইট খোলা",
    rec: "A",
    row: "@   A   103.94.135.2",
    why: "মূল নামকে সরাসরি সার্ভারের IP তে নিতে হবে, তাই A। মূল নামে CNAME বসানো যায় না।",
  },
  {
    id: "www",
    want: "www লিখলেও একই সাইট",
    rec: "CNAME",
    row: "www   CNAME   islandtours.example",
    why: "www কে মূল নামের ডাকনাম বানিয়ে দিন। পরে IP বদলালে শুধু A Record বদলাবেন, www নিজে থেকেই ঠিক থাকবে।",
  },
  {
    id: "api",
    want: "api উপনামে Backend",
    rec: "A",
    row: "api   A   103.94.135.3",
    why: "নতুন একটা উপনাম, নিজের আলাদা সার্ভার। তাই আরেকটা A Record, শুধু Name এ api।",
  },
  {
    id: "mail",
    want: "Domain এর নামে ইমেইল পাওয়া",
    rec: "MX",
    row: "@   MX   10 mail.provider.example",
    why: "ইমেইল কোথায় পৌঁছাবে সেটা শুধু MX বলে। A Record দিয়ে ইমেইল আসে না।",
  },
  {
    id: "spam",
    want: "পাঠানো ইমেইল যেন Spam এ না যায়",
    rec: "TXT",
    row: '@   TXT   "v=spf1 include:_spf.provider.example ~all"',
    why: "SPF নামের একটা TXT Record বলে দেয় কোন সার্ভার আপনার নামে ইমেইল পাঠাতে পারে। না থাকলে আপনার ইমেইল সন্দেহের চোখে দেখা হয়।",
  },
  {
    id: "verify",
    want: "Google কে প্রমাণ করা Domain টা আমার",
    rec: "TXT",
    row: '@   TXT   "google-site-verification=abc123..."',
    why: "সেবাটা একটা গোপন লেখা দেয়, আপনি সেটা TXT এ বসান। শুধু মালিকই DNS বদলাতে পারে, তাই এটা মালিকানার প্রমাণ।",
  },
];

export function WhichRecordLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState<string>(JOBS[0].id);
  const j = JOBS.find((x) => x.id === id) ?? JOBS[0];

  return (
    <Panel
      label="Interactive"
      title="কাজটা বাছুন, Record টা দেখুন"
      footer="বাস্তবে আপনি কখনো ভাবেন না আজ একটা MX বসাব। আপনি ভাবেন, ইমেইল চালু করতে হবে। তাই Record শেখার সবচেয়ে কাজের উপায় উল্টো দিক থেকে, কাজটা থেকে Record এ আসা। এই ছয়টা কাজ একটা সাধারণ Website এর প্রায় সব দরকার মিটিয়ে দেয়।"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {JOBS.map((job) => (
          <button
            key={job.id}
            onClick={() => setId(job.id)}
            data-job={job.id}
            data-active={job.id === id ? "true" : "false"}
            className={cn(
              "px-3 py-2 border text-left text-[12px] font-bold transition-colors",
              job.id === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {job.want}
          </button>
        ))}
      </div>

      <motion.div
        key={j.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="border border-primary/40 bg-primary/5 p-5"
        data-answer={j.rec}
      >
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            লাগবে
          </span>
          <span className="px-3 py-1 border border-primary bg-primary/10 font-mono text-sm font-bold text-primary">
            {j.rec}
          </span>
        </div>
        <div className="font-mono text-[11px] text-foreground break-all border border-border/60 bg-background px-3 py-2 mb-3">
          {j.row}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{j.why}</p>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. তিন ধরনের ইমেইল সেবা, তিনটা আলাদা ছক                                     */
/* ------------------------------------------------------------------------- */

type MailRow = { type: string; name: string; value: string; own: boolean; job: string };

type Provider = {
  id: string;
  label: string;
  kind: string;
  does: string;
  page: string;
  rootMx: string;
  rows: MailRow[];
};

const PROVIDERS: Provider[] = [
  {
    id: "inbox",
    label: "Google Workspace",
    kind: "মানুষের ইমেইল, Inbox সহ",
    does: "আপনি আর আপনার দল এখানে ইমেইল পড়েন আর লেখেন। hello@islandtours.example এ আসা চিঠি এখানে জমা হয়।",
    page: "Admin console এ Domain যোগ করলে একটা ধাপে ধাপে নির্দেশিকা চলে। DKIM আলাদা জায়গায়, Apps, Google Workspace, Gmail, Authenticate email।",
    rootMx: "হ্যাঁ। মূল নামের MX এই সেবার দিকে যায়, কারণ চিঠি এখানেই আসবে।",
    rows: [
      { type: "TXT", name: "@", value: "google-site-verification=AbC123...", own: true, job: "মালিকানার প্রমাণ" },
      { type: "MX", name: "@", value: "1 smtp.google.com", own: false, job: "আসা চিঠি এখানে আসবে" },
      { type: "TXT", name: "@", value: "v=spf1 include:_spf.google.com ~all", own: false, job: "SPF, Google পাঠাতে পারে" },
      { type: "TXT", name: "google._domainkey", value: "v=DKIM1; k=rsa; p=MIIBIjAN...", own: true, job: "DKIM এর চাবি" },
    ],
  },
  {
    id: "resend",
    label: "Resend",
    kind: "App থেকে পাঠানো ইমেইল",
    does: "আপনার কোড এর API ডেকে ইমেইল পাঠায়, যেমন বুকিং নিশ্চিতকরণ বা পাসওয়ার্ড বদলের লিংক। এখানে কোনো Inbox নেই, এটা শুধু পাঠায়।",
    page: "Dashboard এ Domains, তারপর Add Domain। নাম আর অঞ্চল বাছলে Records নামের ট্যাবে ছকটা দেখায়, প্রতিটা সারির পাশে অবস্থা।",
    rootMx: "না। সে মূল নামের MX ছোঁয় না। তার MX বসে send নামের উপনামে, শুধু ফেরত চিঠির জন্য।",
    rows: [
      { type: "TXT", name: "resend._domainkey", value: "p=MIGfMA0GCSqGSIb3DQEB...", own: true, job: "DKIM এর চাবি" },
      { type: "MX", name: "send", value: "10 feedback-smtp.us-east-1.amazonses.com", own: false, job: "ফেরত চিঠি আর অভিযোগ এখানে যায়" },
      { type: "TXT", name: "send", value: "v=spf1 include:amazonses.com ~all", own: false, job: "SPF, send উপনামের জন্য" },
    ],
  },
  {
    id: "mailerlite",
    label: "MailerLite",
    kind: "Newsletter আর প্রচারের ইমেইল",
    does: "আপনি এর পাতায় বসে একটা ইমেইল বানান আর একসাথে হাজার গ্রাহককে পাঠান, যেমন নতুন ট্যুরের খবর বা ছাড়ের ঘোষণা।",
    page: "Account settings এ Domains ট্যাব। Domain যোগ করে Authenticate চাপলে দুইটা Record দেখায়, Name আর Value সহ।",
    rootMx: "না। সেও শুধু পাঠায়। তবে তার SPF বসে মূল নামে, তাই আগের SPF এর সাথে জোড়া লাগাতে হয়।",
    rows: [
      { type: "CNAME", name: "litesrv._domainkey", value: "litesrv._domainkey.mlsend.com", own: false, job: "DKIM, চাবিটা তাদের কাছে থাকে" },
      { type: "TXT", name: "@", value: "v=spf1 include:_spf.mlsend.com ~all", own: false, job: "SPF, আগেরটার সাথে মেলাতে হবে" },
    ],
  },
];

export function EmailProviderLab() {
  const reduce = useReducedMotion();
  const [id, setId] = useState<string>(PROVIDERS[1].id);
  const pv = PROVIDERS.find((x) => x.id === id) ?? PROVIDERS[0];

  return (
    <Panel
      label="Interactive"
      title="তিন ধরনের ইমেইল সেবা, তিনটা ছক"
      footer="তিনটা সেবা বেছে দেখুন। তিনটাই ইমেইলের সেবা, কিন্তু কাজ আলাদা, তাই Record এর ছকও আলাদা। সবচেয়ে জরুরি তফাত শেষের ঘরে, সে কি মূল নামের MX ছোঁয়। শুধু সেই সেবা ছোঁয়, যার কাছে আপনার চিঠি আসে। যারা শুধু পাঠায় তারা কখনো ছোঁয় না, তাই একটা Domain এ তিনটা সেবাই পাশাপাশি চলতে পারে। ডান দিকের চিহ্নটা বলে মানটা শুধু আপনার জন্য বানানো, নাকি সব গ্রাহকের জন্য একই। এখানকার মানগুলো উদাহরণ, বাস্তবে নিজের পাতায় যা দেখায় সেটাই কপি করুন।"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
        {PROVIDERS.map((x) => (
          <button
            key={x.id}
            onClick={() => setId(x.id)}
            data-provider={x.id}
            data-active={x.id === id ? "true" : "false"}
            className={cn(
              "px-3 py-2 border text-left transition-colors",
              x.id === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            <div className="text-[12px] font-bold">{x.label}</div>
            <div className="text-[10px] opacity-80">{x.kind}</div>
          </button>
        ))}
      </div>

      <motion.div
        key={pv.id}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="space-y-4"
        data-shown={pv.id}
      >
        <p className="text-sm text-foreground leading-relaxed">{pv.does}</p>

        <div className="border border-border bg-background p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            Record গুলো কোন পাতায় পাবেন
          </div>
          <div className="text-sm text-foreground leading-relaxed">{pv.page}</div>
        </div>

        <div className="border border-border overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[60px_150px_1fr_170px] gap-2 px-3 py-2 border-b border-border bg-muted/30 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              <span>Type</span>
              <span>Name</span>
              <span>Value</span>
              <span>কাজ</span>
            </div>
            {pv.rows.map((r, i) => (
              <div
                key={`${r.type}-${r.name}-${i}`}
                className="grid grid-cols-[60px_150px_1fr_170px] gap-2 items-start px-3 py-2 border-b border-border/60 last:border-b-0"
              >
                <span className="font-mono text-[11px] font-bold text-primary">{r.type}</span>
                <span className="font-mono text-[11px] text-foreground break-all">{r.name}</span>
                <span className="font-mono text-[11px] text-muted-foreground break-all">{r.value}</span>
                <span className="text-[11px] text-muted-foreground leading-snug">
                  {r.job}
                  <span
                    className={cn(
                      "block mt-1 font-mono text-[9px] uppercase tracking-[0.1em]",
                      r.own ? "text-accent" : "text-muted-foreground/70",
                    )}
                  >
                    {r.own ? "শুধু আপনার জন্য" : "সবার জন্য একই"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-primary/40 bg-primary/5 p-4" data-root-mx={pv.id === "inbox" ? "yes" : "no"}>
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            সে কি মূল নামের MX ছোঁয়
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">{pv.rootMx}</div>
        </div>
      </motion.div>
    </Panel>
  );
}
