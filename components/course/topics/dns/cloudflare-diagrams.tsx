import { Sketch, SketchSplit, SketchText } from "../../sketch";

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
  h = 50,
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
      <SketchText x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} size={10} bold accent={accent}>
        {top}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 14} size={8.5} body opacity={0.7}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Name Server বদলের আগে আর পরে                                             */
/* ------------------------------------------------------------------------- */

function NsRow({
  y,
  id,
  label,
  last,
  lastSub,
  accent,
}: {
  y: number;
  id: string;
  label: string;
  last: string;
  lastSub: string;
  accent?: boolean;
}) {
  return (
    <g>
      <SketchText x={20} y={y + 30} size={9.5} anchor="start" bold accent={accent}>
        {label}
      </SketchText>
      <Node x={110} y={y} w={170} top="Registrar" sub="Name Server এর নাম রাখে" />
      <Node x={330} y={y} w={170} top="TLD Server" sub="সেই নামের দিকে পাঠায়" />
      <Node x={550} y={y} w={230} top={last} sub={lastSub} accent={accent} />
      <line x1={280} y1={y + 25} x2={328} y2={y + 25} stroke="var(--primary)" strokeWidth="1.4" markerEnd={`url(#${id})`} />
      <line x1={500} y1={y + 25} x2={548} y2={y + 25} stroke="var(--primary)" strokeWidth="1.4" markerEnd={`url(#${id})`} />
    </g>
  );
}

export function NameserverSwitchDiagram() {
  return (
    <Sketch
      label="Diagram: Name Server বদলের আগে আর পরে"
      height={250}
      minWidth={800}
      viewBox="0 0 800 250"
      caption="Cloudflare এ Domain আনা মানে আসলে একটাই বদল, Registrar এ লেখা Name Server এর নাম দুইটা। আগে TLD server সবাইকে পাঠাত আপনার পুরনো DNS সেবার কাছে। বদলের পর সে পাঠায় Cloudflare এর Name Server এর কাছে, আর তখন থেকে আপনার Domain এর Authoritative server হয় Cloudflare। খেয়াল করুন, Domain টা কিন্তু আগের Registrar এই থাকে, মালিকানা বা নবায়ন কিছুই বদলায় না। বদলায় শুধু প্রশ্নের উত্তর কে দেবে। তাই বদলের আগেই Cloudflare এ সব Record ঠিকঠাক বসানো থাকা চাই, নাহলে বদলের মুহূর্ত থেকে সে ভুল বা ফাঁকা উত্তর দেবে।"
    >
      <Arrow id="ns-a" />
      <NsRow y={40} id="ns-a" label="আগে" last="পুরনো DNS সেবা" lastSub="Authoritative ছিল" />
      <NsRow y={140} id="ns-a" label="পরে" last="Cloudflare" lastSub="এখন Authoritative" accent />
      <SketchText x={400} y={222} size={9} body accent>
        Registrar একই থাকে, শুধু সেখানে লেখা দুইটা নাম বদলায়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. DNS Only আর Proxied                                                      */
/* ------------------------------------------------------------------------- */

function Path({
  id,
  answer,
  middle,
  foot,
}: {
  id: string;
  answer: string;
  middle?: string;
  foot: string;
}) {
  return (
    <>
      <Arrow id={id} />
      <SketchText x={150} y={24} size={8.5} opacity={0.55}>
        DNS এর উত্তর
      </SketchText>
      <SketchText x={150} y={42} size={10.5} bold accent>
        {answer}
      </SketchText>
      <Node x={85} y={58} w={130} h={36} top="পর্যটক" />
      {middle ? (
        <>
          <line x1={150} y1={94} x2={150} y2={112} stroke="var(--primary)" strokeWidth="1.3" markerEnd={`url(#${id})`} />
          <Node x={70} y={114} w={160} h={36} top={middle} accent />
          <line x1={150} y1={150} x2={150} y2={168} stroke="var(--primary)" strokeWidth="1.3" markerEnd={`url(#${id})`} />
        </>
      ) : (
        <line x1={150} y1={94} x2={150} y2={168} stroke="var(--primary)" strokeWidth="1.3" markerEnd={`url(#${id})`} />
      )}
      <Node x={70} y={170} w={160} h={36} top="আপনার সার্ভার" />
      <SketchText x={150} y={230} size={8.5} body opacity={0.75}>
        {foot}
      </SketchText>
    </>
  );
}

export function ProxyModesSplit() {
  return (
    <SketchSplit
      label="Diagram: DNS Only আর Proxied"
      caption="একই Record, দুই রকম আচরণ। বাঁ দিকে DNS Only (ধূসর মেঘ), Cloudflare শুধু DNS এর কাজটুকু করে। সে আপনার সার্ভারের আসল IP বলে দেয়, আর পর্যটক সরাসরি আপনার সার্ভারে যান। ডান দিকে Proxied (কমলা মেঘ), Cloudflare আপনার আসল IP না বলে নিজের একটা IP বলে। ফলে পর্যটক প্রথমে Cloudflare এর কাছে যান, আর Cloudflare তাঁর হয়ে আপনার সার্ভার থেকে পাতা এনে দেয়। পর্যটক কখনো আপনার আসল IP জানতে পারেন না। এই মাঝখানে দাঁড়ানোর জায়গা থেকেই Cloudflare এর বাকি সব সুবিধা আসে, আক্রমণ ঠেকানো, পাতা জমিয়ে রেখে দ্রুত দেওয়া, আর বিনা খরচে HTTPS।"
      panels={[
        {
          title: "DNS Only (ধূসর মেঘ)",
          sub: "Cloudflare শুধু ঠিকানা বলে",
          viewBox: "0 0 300 244",
          height: 244,
          children: (
            <Path
              id="pm-a"
              answer="103.94.135.2 (আসল IP)"
              foot="সরাসরি পথ, আসল IP সবার কাছে খোলা"
            />
          ),
        },
        {
          title: "Proxied (কমলা মেঘ)",
          sub: "Cloudflare মাঝখানে দাঁড়ায়",
          viewBox: "0 0 300 244",
          height: 244,
          children: (
            <Path
              id="pm-b"
              answer="104.21.48.1 (Cloudflare এর IP)"
              middle="Cloudflare"
              foot="আসল IP লুকানো, পথে ঢাল আর Cache"
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. SSL/TLS এর তিন Mode                                                      */
/* ------------------------------------------------------------------------- */

const MODES = [
  {
    name: "Flexible",
    leg: "HTTP, খোলা",
    locked: false,
    note: "সার্ভারে সার্টিফিকেট লাগে না, কিন্তু অর্ধেক পথ খোলা",
  },
  {
    name: "Full",
    leg: "HTTPS",
    locked: true,
    note: "পুরো পথ তালাবদ্ধ, সার্টিফিকেট যাচাই হয় না",
  },
  {
    name: "Full (strict)",
    leg: "HTTPS, যাচাই সহ",
    locked: true,
    note: "পুরো পথ তালাবদ্ধ আর সার্টিফিকেট যাচাই করা, এটাই লক্ষ্য",
  },
];

export function SslModesDiagram() {
  const rowH = 78;
  const top = 34;
  const h = top + MODES.length * rowH + 10;
  return (
    <Sketch
      label="Diagram: Proxied হলে পথটা দুই টুকরো"
      height={h}
      minWidth={820}
      viewBox={`0 0 820 ${h}`}
      caption="Proxied অবস্থায় পর্যটক থেকে আপনার সার্ভার পর্যন্ত পথটা দুই টুকরো হয়ে যায়। প্রথম টুকরো পর্যটক থেকে Cloudflare, এটা Cloudflare নিজেই HTTPS দিয়ে তালাবদ্ধ করে দেয়। দ্বিতীয় টুকরো Cloudflare থেকে আপনার সার্ভার, আর এটা কেমন হবে তা ঠিক করে SSL/TLS Mode। Flexible এ দ্বিতীয় টুকরো খোলা থাকে, অথচ পর্যটকের Browser তালার চিহ্ন দেখায়, তাই এটা একটা মিথ্যা নিরাপত্তা। Full এ দুই টুকরোই তালাবদ্ধ। Full (strict) এ তালার সাথে সাথে Cloudflare এটাও যাচাই করে যে ওপাশে সত্যিই আপনার সার্ভার। লক্ষ্য সবসময় Full (strict)।"
    >
      <Arrow id="ssl-a" />
      {MODES.map((m, i) => {
        const y = top + i * rowH;
        const strict = i === 2;
        return (
          <g key={m.name}>
            <SketchText x={20} y={y + 28} size={10.5} anchor="start" bold accent={strict}>
              {m.name}
            </SketchText>
            <Node x={150} y={y} w={120} h={44} top="পর্যটক" />
            <Node x={390} y={y} w={140} h={44} top="Cloudflare" accent />
            <Node x={660} y={y} w={140} h={44} top="আপনার সার্ভার" />
            <line x1={270} y1={y + 22} x2={388} y2={y + 22} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#ssl-a)" />
            <SketchText x={329} y={y + 13} size={8.5} accent bold>
              HTTPS
            </SketchText>
            <line
              x1={530}
              y1={y + 22}
              x2={658}
              y2={y + 22}
              stroke={m.locked ? "var(--primary)" : "currentColor"}
              strokeOpacity={m.locked ? 1 : 0.5}
              strokeWidth="1.5"
              strokeDasharray={m.locked ? undefined : "5 4"}
              markerEnd="url(#ssl-a)"
            />
            <SketchText x={594} y={y + 13} size={8.5} bold accent={m.locked} opacity={m.locked ? 1 : 0.7}>
              {m.leg}
            </SketchText>
            <SketchText x={475} y={y + 62} size={8.5} body opacity={0.7}>
              {m.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
