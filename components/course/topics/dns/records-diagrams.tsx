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

/* ------------------------------------------------------------------------- */
/* 1. একটা Record এর চার ঘর                                                    */
/* ------------------------------------------------------------------------- */

const FIELDS = [
  { head: "Name", val: "www", sub: "কোন নামের কথা" },
  { head: "Type", val: "A", sub: "কী ধরনের তথ্য" },
  { head: "TTL", val: "3600", sub: "কতক্ষণ মনে রাখবে" },
  { head: "Value", val: "103.94.135.2", sub: "আসল উত্তর" },
];

export function RecordAnatomyDiagram() {
  const w = 164;
  const gap = 14;
  const startX = (760 - (FIELDS.length * w + (FIELDS.length - 1) * gap)) / 2;
  return (
    <Sketch
      label="Diagram: একটা Record, চারটা ঘর"
      height={210}
      minWidth={760}
      viewBox="0 0 760 210"
      caption="প্রতিটা DNS Record আসলে একটা ছোট সারি, চারটা ঘর নিয়ে। Name বলে কোন নামের কথা হচ্ছে। Type বলে এটা কী ধরনের তথ্য, IP নাকি ইমেইল সার্ভার নাকি অন্য কিছু। TTL বলে উত্তরটা কতক্ষণ মনে রাখা যাবে। আর Value হলো আসল উত্তর। পৃথিবীর যেকোনো DNS সেবার পাতায় গেলে এই চারটা ঘরই দেখবেন, শুধু সাজানো একটু আলাদা। এই সারিটাকে পড়তে হয় এভাবে, www নামের IP হলো 103.94.135.2, আর এটা এক ঘণ্টা মনে রাখা যাবে।"
    >
      {FIELDS.map((f, i) => {
        const x = startX + i * (w + gap);
        const accent = i === 1;
        return (
          <g key={f.head}>
            <SketchText x={x + w / 2} y={46} size={9} opacity={0.55}>
              {f.head}
            </SketchText>
            <rect
              x={x}
              y={58}
              width={w}
              height={58}
              fill={accent ? "var(--primary)" : "currentColor"}
              fillOpacity={accent ? 0.12 : 0.04}
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 1 : 0.45}
              strokeWidth="1.3"
            />
            <SketchText x={x + w / 2} y={93} size={15} bold accent={accent}>
              {f.val}
            </SketchText>
            <SketchText x={x + w / 2} y={140} size={9.5} body opacity={0.7}>
              {f.sub}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={380} y={180} size={9.5} accent body>
        Type বদলালে Value এর মানেও বদলে যায়, তাই Type ই Record এর প্রাণ
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. CNAME এর পথ, ডাকনাম থেকে আসল ঠিকানা                                     */
/* ------------------------------------------------------------------------- */

export function CnameChainDiagram() {
  return (
    <Sketch
      label="Diagram: CNAME ধরে ধরে আসল IP"
      height={230}
      minWidth={820}
      viewBox="0 0 820 230"
      caption="CNAME কোনো IP দেয় না, দেয় আরেকটা নাম। তাই Resolver কে আরেক ধাপ যেতে হয়। এখানে www.islandtours.example এর CNAME বলছে, আমার আসল নাম cname.hosting.example। Resolver তখন সেই নামের A Record খোঁজে, আর সেখান থেকে IP পায়। সুবিধাটা এখানে, Hosting কোম্পানি পরে নিজের IP বদলালে শুধু তাদের A Record বদলায়, আপনার CNAME যেমন ছিল তেমনই থাকে, আপনাকে কিছু করতে হয় না।"
    >
      <Arrow id="cn-a" />
      <rect x={20} y={76} width={220} height={58} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <SketchText x={130} y={102} size={10} bold>
        www.islandtours.example
      </SketchText>
      <SketchText x={130} y={120} size={8.5} body opacity={0.65}>
        আপনি যা লেখেন
      </SketchText>

      <line x1={240} y1={105} x2={296} y2={105} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#cn-a)" />
      <SketchText x={268} y={94} size={8.5} accent bold>
        CNAME
      </SketchText>

      <rect x={298} y={76} width={220} height={58} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={408} y={102} size={10} bold accent>
        cname.hosting.example
      </SketchText>
      <SketchText x={408} y={120} size={8.5} body opacity={0.7}>
        Hosting এর নাম
      </SketchText>

      <line x1={518} y1={105} x2={574} y2={105} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#cn-a)" />
      <SketchText x={546} y={94} size={8.5} accent bold>
        A
      </SketchText>

      <rect x={576} y={76} width={220} height={58} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <SketchText x={686} y={102} size={12} bold>
        76.76.21.21
      </SketchText>
      <SketchText x={686} y={120} size={8.5} body opacity={0.65}>
        আসল ঠিকানা
      </SketchText>

      <SketchText x={410} y={44} size={9} opacity={0.6} body>
        ডাকনাম প্রথমে আরেকটা নাম দেয়, তারপর সেই নাম থেকে IP
      </SketchText>
      <SketchText x={410} y={184} size={9} accent body>
        Hosting IP বদলালে শুধু ডান দিকের তীরটা বদলায়, আপনার অংশ একই থাকে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Island Tours এর পুরো Record তালিকা                                       */
/* ------------------------------------------------------------------------- */

const ZONE = [
  { name: "@", type: "A", value: "103.94.135.2", what: "মূল সাইট" },
  { name: "www", type: "CNAME", value: "islandtours.example", what: "www সহ লিখলেও একই সাইট" },
  { name: "api", type: "A", value: "103.94.135.3", what: "Backend API" },
  { name: "@", type: "MX", value: "10 mail.provider.example", what: "ইমেইল কোথায় যাবে" },
  { name: "@", type: "TXT", value: "v=spf1 include:... ~all", what: "কে ইমেইল পাঠাতে পারে" },
  { name: "@", type: "NS", value: "ns1.dnshost.example", what: "Authoritative server" },
];

export function ZoneTableDiagram() {
  const rowH = 36;
  const top = 54;
  const h = top + ZONE.length * rowH + 22;
  return (
    <Sketch
      label="Diagram: একটা Domain এর পুরো তালিকা"
      height={h}
      minWidth={800}
      viewBox={`0 0 800 ${h}`}
      caption="একটা Domain এর সব Record মিলে যে তালিকা, তাকে বলে Zone। এটা Island Tours এর একটা বাস্তবসম্মত Zone। খেয়াল করুন, একই নামের (@, মানে মূল নাম) নিচে একাধিক ধরনের Record আছে, একটা বলে সাইট কোথায়, একটা বলে ইমেইল কোথায়, একটা বলে কে ইমেইল পাঠাতে পারে। প্রতিটা প্রশ্নের উত্তর আলাদা Record। এই ছয়টা সারি পড়তে পারলে আপনি প্রায় যেকোনো Website এর DNS পাতা পড়তে পারবেন।"
    >
      <SketchText x={50} y={38} size={9} anchor="start" opacity={0.55}>
        Name
      </SketchText>
      <SketchText x={150} y={38} size={9} anchor="start" opacity={0.55}>
        Type
      </SketchText>
      <SketchText x={250} y={38} size={9} anchor="start" opacity={0.55}>
        Value
      </SketchText>
      <SketchText x={540} y={38} size={9} anchor="start" opacity={0.55}>
        কী কাজ
      </SketchText>
      {ZONE.map((z, i) => {
        const y = top + i * rowH;
        return (
          <g key={`${z.name}-${z.type}`}>
            <rect
              x={30}
              y={y}
              width={740}
              height={rowH - 8}
              fill={i % 2 === 0 ? "currentColor" : "transparent"}
              fillOpacity={0.03}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth="1"
            />
            <SketchText x={50} y={y + 19} size={11} anchor="start" bold>
              {z.name}
            </SketchText>
            <SketchText x={150} y={y + 19} size={11} anchor="start" bold accent>
              {z.type}
            </SketchText>
            <SketchText x={250} y={y + 19} size={10} anchor="start">
              {z.value}
            </SketchText>
            <SketchText x={540} y={y + 19} size={9.5} anchor="start" body opacity={0.75}>
              {z.what}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. একটা পাঠানো ইমেইল, আর গ্রহীতা যে চারটা Record দেখে                       */
/* ------------------------------------------------------------------------- */

const CHECKS = [
  {
    n: "১",
    name: "SPF",
    where: "send.islandtours.example",
    type: "TXT",
    q: "এই সার্ভার কি এই নামে পাঠাতে পারে?",
  },
  {
    n: "২",
    name: "DKIM",
    where: "resend._domainkey.islandtours.example",
    type: "TXT",
    q: "ইমেইলের সইটা কি এই চাবিতে মেলে?",
  },
  {
    n: "৩",
    name: "DMARC",
    where: "_dmarc.islandtours.example",
    type: "TXT",
    q: "না মিললে মালিক কী করতে বলেছেন?",
  },
  {
    n: "৪",
    name: "ফেরত চিঠি",
    where: "send.islandtours.example",
    type: "MX",
    q: "পৌঁছাতে না পারলে খবরটা কোথায় যাবে?",
  },
];

export function SentEmailChecksDiagram() {
  const rowH = 50;
  const top = 150;
  const h = top + CHECKS.length * rowH + 16;
  return (
    <Sketch
      label="Diagram: একটা পাঠানো ইমেইল, আর গ্রহীতা DNS এ যা যা দেখে"
      height={h}
      minWidth={880}
      viewBox={`0 0 880 ${h}`}
      caption="আপনার App একটা ইমেইল সেবাকে (এখানে Resend) বলল একটা বুকিং নিশ্চিতকরণ পাঠাতে। ইমেইল সেবা সেটা গ্রহীতার ইমেইল সার্ভারে (যেমন Gmail) পৌঁছে দিল। Gmail ইমেইলটা Inbox এ রাখার আগে আপনার Domain এর DNS এ চারটা জায়গা দেখে। এই চারটা সারিই ব্যাখ্যা করে ইমেইল সেবাগুলো আপনাকে ঠিক কেন ঐ Record গুলো বসাতে বলে। খেয়াল করুন প্রতিটা প্রশ্ন আলাদা একটা নামে করা হয়। SPF আর ফেরত চিঠির MX দুইটাই বসে send নামের উপনামে, কারণ ইমেইলের ফেরত ঠিকানাটা সেই উপনামের। DKIM বসে সেবার নিজের নামের একটা বিশেষ উপনামে, আর DMARC বসে _dmarc এ। কোনোটাই মূল নামের MX ছোঁয় না, তাই আপনার নিজের ইমেইল ঠিকানাগুলো আগের জায়গাতেই থাকে।"
    >
      <Arrow id="se-a" />
      {[
        { x: 40, w: 180, top: "আপনার App", sub: "বলল, এই ইমেইলটা পাঠান" },
        { x: 350, w: 200, top: "ইমেইল সেবা", sub: "সই করে পাঠায়", accent: true },
        { x: 680, w: 170, top: "গ্রহীতার সার্ভার", sub: "যেমন Gmail" },
      ].map((b) => (
        <g key={b.top}>
          <rect
            x={b.x}
            y={30}
            width={b.w}
            height={54}
            fill={b.accent ? "var(--primary)" : "currentColor"}
            fillOpacity={b.accent ? 0.1 : 0.04}
            stroke={b.accent ? "var(--primary)" : "currentColor"}
            strokeOpacity={b.accent ? 1 : 0.45}
            strokeWidth="1.3"
          />
          <SketchText x={b.x + b.w / 2} y={54} size={10.5} bold accent={b.accent}>
            {b.top}
          </SketchText>
          <SketchText x={b.x + b.w / 2} y={72} size={8.5} body opacity={0.7}>
            {b.sub}
          </SketchText>
        </g>
      ))}
      <line x1={220} y1={57} x2={348} y2={57} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#se-a)" />
      <line x1={550} y1={57} x2={678} y2={57} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#se-a)" />
      <line x1={765} y1={84} x2={765} y2={132} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#se-a)" />
      <SketchText x={440} y={118} size={9} body accent>
        Inbox এ রাখার আগে গ্রহীতা আপনার Domain এর DNS এ চারটা জায়গা দেখে
      </SketchText>

      <SketchText x={86} y={142} size={8.5} anchor="start" opacity={0.55}>
        কী
      </SketchText>
      <SketchText x={200} y={142} size={8.5} anchor="start" opacity={0.55}>
        কোন নামে খোঁজে
      </SketchText>
      <SketchText x={520} y={142} size={8.5} anchor="start" opacity={0.55}>
        Type
      </SketchText>
      <SketchText x={590} y={142} size={8.5} anchor="start" opacity={0.55}>
        যে প্রশ্নের উত্তর
      </SketchText>
      {CHECKS.map((c, i) => {
        const y = top + i * rowH;
        return (
          <g key={c.name}>
            <rect
              x={24}
              y={y}
              width={832}
              height={rowH - 10}
              fill={i % 2 === 0 ? "currentColor" : "transparent"}
              fillOpacity={0.03}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth="1"
            />
            <circle cx={52} cy={y + 20} r={10} fill="var(--primary)" fillOpacity={0.15} stroke="var(--primary)" strokeWidth="1" />
            <SketchText x={52} y={y + 24} size={9} bold accent>
              {c.n}
            </SketchText>
            <SketchText x={86} y={y + 24} size={10.5} anchor="start" body bold accent>
              {c.name}
            </SketchText>
            <SketchText x={200} y={y + 24} size={9.5} anchor="start" bold>
              {c.where}
            </SketchText>
            <SketchText x={520} y={y + 24} size={9.5} anchor="start" bold accent>
              {c.type}
            </SketchText>
            <SketchText x={590} y={y + 24} size={8.5} anchor="start" body opacity={0.8}>
              {c.q}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
