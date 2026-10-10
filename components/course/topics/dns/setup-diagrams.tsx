import { Sketch, SketchText } from "../../sketch";

function Arrow({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        markerWidth={8}
        markerHeight={8}
        refX={7}
        refY={3.5}
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--primary)" />
      </marker>
    </defs>
  );
}

function Node({
  x,
  y,
  w,
  h = 64,
  top,
  sub,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  top: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.1 : 0.04}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 1 : 0.45}
        strokeWidth="1.3"
      />
      <SketchText x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 4)} size={11} bold accent={accent}>
        {top}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 15} size={8.5} body opacity={0.7}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. কে কাকে কী দেয়: দুইটা হাতবদল                                            */
/* ------------------------------------------------------------------------- */

export function TwoHandoffsDiagram() {
  return (
    <Sketch
      label="Diagram: দুইটা হাতবদল, এটুকুই পুরো Domain Setup"
      height={330}
      minWidth={860}
      viewBox="0 0 860 330"
      caption="যেকোনো Domain Setup, যত জটিলই দেখাক, আসলে শুধু দুইটা হাতবদল। ডান দিক থেকে পড়ুন। প্রথম হাতবদল, যে সেবায় আপনি Domain জুড়তে চান (Hosting, ইমেইল, বা যেকোনো App) সে আপনাকে কিছু Record এর মান দেয়, আর আপনি সেগুলো নিয়ে বসান আপনার DNS সেবায়। দ্বিতীয় হাতবদল, আপনার DNS সেবা আপনাকে দুইটা Name Server এর নাম দেয়, আর আপনি সেগুলো নিয়ে বসান Registrar এ। দুই ক্ষেত্রেই আপনি শুধু একজন বাহক, এক জায়গা থেকে কপি করে আরেক জায়গায় বসাচ্ছেন। আপনি নিজে কোনো মান বানান না। তাই কোনো মান কোথা থেকে আসবে তা নিয়ে বিভ্রান্তি হলে নিজেকে জিজ্ঞেস করুন, এই তথ্যটা কার সম্পত্তি। Name Server এর নাম DNS সেবার সম্পত্তি। IP আর CNAME এর লক্ষ্য হলো সেই সেবার সম্পত্তি, যার সার্ভারে আপনার সাইট চলে।"
    >
      <Arrow id="th-a" />
      <Node x={30} y={110} w={210} top="Registrar" sub="যেখানে Domain কিনেছেন" />
      <Node x={325} y={110} w={210} top="DNS সেবা" sub="যেখানে Record থাকে" accent />
      <Node x={620} y={110} w={210} top="যে সেবায় জুড়বেন" sub="Hosting, ইমেইল, App" />

      {/* হাতবদল ১: সেবা -> DNS */}
      <line x1={620} y1={128} x2={537} y2={128} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#th-a)" />
      <SketchText x={578} y={84} size={9} accent bold>
        হাতবদল ১
      </SketchText>
      <SketchText x={578} y={100} size={8.5} body opacity={0.75}>
        Record এর মান
      </SketchText>

      {/* হাতবদল ২: DNS -> Registrar */}
      <line x1={325} y1={128} x2={242} y2={128} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#th-a)" />
      <SketchText x={283} y={84} size={9} accent bold>
        হাতবদল ২
      </SketchText>
      <SketchText x={283} y={100} size={8.5} body opacity={0.75}>
        Name Server এর নাম
      </SketchText>

      <SketchText x={135} y={206} size={8.5} body opacity={0.7}>
        এখানে বসে:
      </SketchText>
      <SketchText x={135} y={224} size={9.5} bold>
        ada.ns.cloudflare.com
      </SketchText>
      <SketchText x={135} y={240} size={9.5} bold>
        bob.ns.cloudflare.com
      </SketchText>

      <SketchText x={430} y={206} size={8.5} body opacity={0.7}>
        এখানে বসে:
      </SketchText>
      <SketchText x={430} y={224} size={9.5} bold>
        A, CNAME, MX, TXT
      </SketchText>
      <SketchText x={430} y={240} size={8.5} body opacity={0.7}>
        সেবার দেওয়া মান দিয়ে
      </SketchText>

      <SketchText x={725} y={206} size={8.5} body opacity={0.7}>
        এখান থেকে আসে:
      </SketchText>
      <SketchText x={725} y={224} size={9.5} bold>
        IP, CNAME এর লক্ষ্য,
      </SketchText>
      <SketchText x={725} y={240} size={9.5} bold>
        যাচাইয়ের লেখা
      </SketchText>

      <SketchText x={430} y={290} size={9.5} body accent>
        আপনি কোনো মান বানান না, শুধু এক জায়গা থেকে কপি করে আরেক জায়গায় বসান
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. সেবাগুলো আপনার কাছে যে তিন রকম জিনিস চায়                                */
/* ------------------------------------------------------------------------- */

const ASKS = [
  {
    kind: "পথ দেখানোর Record",
    types: "A, AAAA, CNAME",
    why: "যাতে আপনার নামে আসা মানুষ তাদের সার্ভারে পৌঁছায়",
    from: "তাদের সার্ভারের IP, বা তাদের একটা নাম",
  },
  {
    kind: "প্রমাণের Record",
    types: "TXT (কখনো CNAME)",
    why: "যাতে তারা নিশ্চিত হয় Domain টা সত্যিই আপনার",
    from: "তাদের বানানো একটা এলোমেলো লেখা, শুধু আপনার জন্য",
  },
  {
    kind: "ইমেইলের Record",
    types: "MX, TXT, CNAME",
    why: "যাতে ইমেইল তাদের কাছে আসে, আর তারা আপনার নামে পাঠাতে পারে",
    from: "তাদের ইমেইল সার্ভারের নাম, আর সইয়ের চাবি",
  },
  {
    kind: "পুরো DNS এর দায়িত্ব",
    types: "Name Server (NS)",
    why: "যাতে তারা নিজেরাই সব Record বসাতে আর বদলাতে পারে",
    from: "তাদের DNS server এর দুইটা নাম, বসে Registrar এ",
  },
];

export function FourAsksDiagram() {
  const rowH = 46;
  const top = 54;
  const h = top + ASKS.length * rowH + 16;
  return (
    <Sketch
      label="Diagram: একটা সেবা আপনার কাছে যে চার রকম জিনিস চাইতে পারে"
      height={h}
      minWidth={880}
      viewBox={`0 0 880 ${h}`}
      caption="পৃথিবীতে হাজারটা সেবা আছে, আর প্রত্যেকের Domain জোড়ার পাতা দেখতে আলাদা। কিন্তু তারা আপনার কাছে যা চায়, তা সবসময় এই চার রকমের মধ্যেই পড়ে। প্রথমটা পথ দেখানোর Record, যা মানুষকে তাদের সার্ভারে পাঠায়। দ্বিতীয়টা প্রমাণের Record, যা দিয়ে তারা নিশ্চিত হয় আপনিই মালিক। তৃতীয়টা ইমেইলের Record। আর চতুর্থটা সবচেয়ে বড় চাওয়া, পুরো DNS এর দায়িত্ব তাদের হাতে তুলে দেওয়া। একটা সেবা এর এক বা একাধিক চাইতে পারে। নতুন কোনো সেবার পাতা খুলে ঘাবড়ে গেলে শুধু মিলিয়ে নিন, এরা এই চারটার কোনগুলো চাইছে।"
    >
      <SketchText x={40} y={38} size={9} anchor="start" opacity={0.55}>
        কী চায়
      </SketchText>
      <SketchText x={220} y={38} size={9} anchor="start" opacity={0.55}>
        Record এর ধরন
      </SketchText>
      <SketchText x={370} y={38} size={9} anchor="start" opacity={0.55}>
        কেন চায়
      </SketchText>
      <SketchText x={640} y={38} size={9} anchor="start" opacity={0.55}>
        মানটা কী
      </SketchText>
      {ASKS.map((a, i) => {
        const y = top + i * rowH;
        return (
          <g key={a.kind}>
            <rect
              x={24}
              y={y}
              width={832}
              height={rowH - 8}
              fill={i % 2 === 0 ? "currentColor" : "transparent"}
              fillOpacity={0.03}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth="1"
            />
            <SketchText x={40} y={y + 23} size={10} anchor="start" body bold accent>
              {a.kind}
            </SketchText>
            <SketchText x={220} y={y + 23} size={9.5} anchor="start" bold>
              {a.types}
            </SketchText>
            <SketchText x={370} y={y + 23} size={8.5} anchor="start" body opacity={0.8}>
              {a.why}
            </SketchText>
            <SketchText x={640} y={y + 23} size={8.5} anchor="start" body opacity={0.8}>
              {a.from}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. সেবার ছক থেকে নিজের DNS পাতায়                                           */
/* ------------------------------------------------------------------------- */

export function TranslateRecordDiagram() {
  return (
    <Sketch
      label="Diagram: সেবার দেওয়া সারি, আর আপনার DNS পাতার ঘর"
      height={300}
      minWidth={840}
      viewBox="0 0 840 300"
      caption="সেবা আপনাকে যে ছকটা দেখায় আর আপনার DNS পাতায় যে ঘরগুলো থাকে, দুইটা একই চার তথ্য, শুধু ঘরের নাম আলাদা। উপরের সারিটা একটা সেবার দেওয়া। নিচেরটা আপনার DNS পাতার ফর্ম। Type সরাসরি মিলে যায়। সেবা যেটাকে Name বা Host বলে, DNS পাতাও সেটাকে Name বা Host বলে, আর এখানে শুধু সামনের অংশটুকু বসে। সেবা যেটাকে Value বলে, DNS পাতায় সেটার নাম হতে পারে Content, Target, Points to, Answer বা Data। সবই একই জিনিস। TTL সেবা না বললে Auto বা ৩০০ রাখুন। এই মিলটা একবার চোখে বসে গেলে যেকোনো সেবার যেকোনো ছক যেকোনো DNS পাতায় বসাতে পারবেন।"
    >
      <Arrow id="tr-a" />
      <SketchText x={420} y={30} size={9} opacity={0.55}>
        সেবা যা দেখায়
      </SketchText>
      {[
        { x: 60, w: 130, head: "Type", val: "CNAME" },
        { x: 210, w: 150, head: "Name / Host", val: "www" },
        { x: 380, w: 400, head: "Value", val: "cname.hosting.example" },
      ].map((c) => (
        <g key={c.head}>
          <SketchText x={c.x + c.w / 2} y={52} size={8.5} opacity={0.6}>
            {c.head}
          </SketchText>
          <rect x={c.x} y={60} width={c.w} height={40} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
          <SketchText x={c.x + c.w / 2} y={85} size={11} bold>
            {c.val}
          </SketchText>
          <line x1={c.x + c.w / 2} y1={102} x2={c.x + c.w / 2} y2={176} stroke="var(--primary)" strokeWidth="1.3" strokeDasharray="4 4" markerEnd="url(#tr-a)" />
        </g>
      ))}

      <SketchText x={420} y={150} size={9} body accent>
        হুবহু কপি, নিজে কিছু বদলাবেন না
      </SketchText>

      {[
        { x: 60, w: 130, head: "Type", val: "CNAME" },
        { x: 210, w: 150, head: "Name", val: "www" },
        { x: 380, w: 290, head: "Target / Content / Points to", val: "cname.hosting.example" },
        { x: 690, w: 90, head: "TTL", val: "Auto" },
      ].map((c) => (
        <g key={c.head}>
          <rect x={c.x} y={180} width={c.w} height={40} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.3" />
          <SketchText x={c.x + c.w / 2} y={205} size={11} bold accent>
            {c.val}
          </SketchText>
          <SketchText x={c.x + c.w / 2} y={240} size={8.5} opacity={0.6}>
            {c.head}
          </SketchText>
        </g>
      ))}
      <SketchText x={420} y={274} size={9} opacity={0.55}>
        আপনার DNS পাতার ফর্ম
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. এক Hosting Account, চার রকম নাম                                          */
/* ------------------------------------------------------------------------- */

const KINDS = [
  {
    name: "islandtours.example",
    kind: "মূল Domain",
    folder: "/public_html",
    note: "Account খোলার সময়ের Domain",
    accent: false,
  },
  {
    name: "blog.islandtours.example",
    kind: "Subdomain",
    folder: "/public_html/blog",
    note: "কিনতে হয় না, নিজের ফোল্ডার",
    accent: false,
  },
  {
    name: "seagulltours.example",
    kind: "Addon Domain",
    folder: "/public_html/seagulltours",
    note: "আলাদা কেনা Domain, আলাদা সাইট",
    accent: true,
  },
  {
    name: "island-tours.example",
    kind: "Alias (Parked) Domain",
    folder: "/public_html",
    note: "আলাদা কেনা Domain, একই সাইট",
    accent: false,
  },
];

export function OneAccountManyNamesDiagram() {
  const rowH = 56;
  const top = 60;
  const h = top + KINDS.length * rowH + 44;
  return (
    <Sketch
      label="Diagram: এক Hosting Account, এক IP, চার রকম নাম"
      height={h}
      minWidth={880}
      viewBox={`0 0 880 ${h}`}
      caption="Hosting এর পাতায় (যেমন cPanel) চার রকম নামের কথা আসে, আর এগুলো প্রায়ই গুলিয়ে যায়। চারটাই একই Hosting Account এ, একই সার্ভারে, একই IP তে থাকে। তফাত শুধু দুই জায়গায়, নামটা আলাদা করে কিনতে হয়েছে কি না, আর সার্ভার সেই নামে কোন ফোল্ডারের সাইট দেখায়। মূল Domain হলো যেটা দিয়ে Account খুলেছেন। Subdomain মূল Domain এর নিচের একটা নাম, কিনতে হয় না, আর নিজের ফোল্ডার পায়। Addon Domain সম্পূর্ণ আলাদা একটা কেনা Domain, যা একই Account এ নিজের ফোল্ডারে আলাদা একটা সাইট চালায়। Alias বা Parked Domain ও আলাদা কেনা Domain, কিন্তু এটা কোনো নতুন সাইট নয়, মূল Domain এর সাইটটাই দেখায়। DNS এর চোখে চারটাই একই কাজ করে, নামটাকে একই IP তে পাঠায়। কোন নামে কোন ফোল্ডার, সেটা ঠিক করে সার্ভার, Browser এর বলা নামটা দেখে।"
    >
      <Arrow id="oa-a" />
      <SketchText x={40} y={40} size={9} anchor="start" opacity={0.55}>
        নাম
      </SketchText>
      <SketchText x={290} y={40} size={9} anchor="start" opacity={0.55}>
        Hosting এর ভাষায়
      </SketchText>
      <SketchText x={560} y={40} size={9} anchor="start" opacity={0.55}>
        সার্ভার যে ফোল্ডার দেখায়
      </SketchText>
      {KINDS.map((k, i) => {
        const y = top + i * rowH;
        return (
          <g key={k.name}>
            <rect
              x={24}
              y={y}
              width={832}
              height={rowH - 10}
              fill={k.accent ? "var(--primary)" : "currentColor"}
              fillOpacity={k.accent ? 0.07 : i % 2 === 0 ? 0.03 : 0}
              stroke={k.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={k.accent ? 0.8 : 0.25}
              strokeWidth="1"
            />
            <SketchText x={40} y={y + 27} size={10} anchor="start" bold>
              {k.name}
            </SketchText>
            <SketchText x={290} y={y + 20} size={10} anchor="start" body bold accent>
              {k.kind}
            </SketchText>
            <SketchText x={290} y={y + 36} size={8.5} anchor="start" body opacity={0.7}>
              {k.note}
            </SketchText>
            <line x1={500} y1={y + 23} x2={548} y2={y + 23} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#oa-a)" />
            <SketchText x={560} y={y + 27} size={10} anchor="start" bold>
              {k.folder}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={440} y={h - 16} size={9} body accent>
        DNS এ চারটাই একই IP তে যায়। কোন ফোল্ডার, সেটা সার্ভার ঠিক করে নাম দেখে।
      </SketchText>
    </Sketch>
  );
}
