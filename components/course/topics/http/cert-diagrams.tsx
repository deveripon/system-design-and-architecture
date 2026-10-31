/**
 * What: The still diagrams for Module 06 Lesson 08, Certificates, Public Key and Private Key.
 * They show the impostor problem, a key pair, encrypt against sign, how a signature is made,
 * what a certificate holds, the chain of trust, how ACME issues a certificate, and how
 * certificate lifetimes are shrinking.
 *
 * Why: Trust on the web is a chain of who signed what for whom. That is far easier to see
 * than to read, so each idea gets its own small picture. Every marker id starts with
 * "cert-" so two diagrams on the same page never share an id.
 */
import { Sketch, SketchSplit, SketchText } from "../../sketch";

function Arrow({ id, muted }: { id: string; muted?: boolean }) {
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
        <path
          d="M0,0 L7,3.5 L0,7 Z"
          fill={muted ? "currentColor" : "var(--primary)"}
          fillOpacity={muted ? 0.55 : 1}
        />
      </marker>
    </defs>
  );
}

function Box({
  x,
  y,
  w,
  h = 34,
  text,
  sub,
  accent,
  size = 9.5,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  sub?: string;
  accent?: boolean;
  size?: number;
  dashed?: boolean;
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
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <SketchText
        x={x + w / 2}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
        size={size}
        bold
        accent={accent}
      >
        {text}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 12} size={8} body opacity={0.75}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/** A small closed padlock, drawn around its top-left corner. */
function Padlock({ x, y, accent, open }: { x: number; y: number; accent?: boolean; open?: boolean }) {
  const stroke = accent ? "var(--primary)" : "currentColor";
  return (
    <g>
      <path
        d={
          open
            ? `M${x + 3},${y + 8} L${x + 3},${y + 4} A5,5 0 0 1 ${x + 13},${y + 2}`
            : `M${x + 3},${y + 8} L${x + 3},${y + 5} A5,5 0 0 1 ${x + 13},${y + 5} L${x + 13},${y + 8}`
        }
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeOpacity={accent ? 1 : 0.7}
      />
      <rect
        x={x}
        y={y + 8}
        width={16}
        height={11}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.25 : 0.12}
        stroke={stroke}
        strokeWidth="1.3"
        strokeOpacity={accent ? 1 : 0.7}
      />
    </g>
  );
}

/** A small key: a ring, a shaft and two teeth. */
function KeyIcon({ x, y, accent }: { x: number; y: number; accent?: boolean }) {
  const stroke = accent ? "var(--primary)" : "currentColor";
  return (
    <g stroke={stroke} strokeWidth="1.5" fill="none" strokeOpacity={accent ? 1 : 0.75}>
      <circle cx={x + 7} cy={y + 7} r={6} />
      <line x1={x + 13} y1={y + 7} x2={x + 34} y2={y + 7} />
      <line x1={x + 27} y1={y + 7} x2={x + 27} y2={y + 13} />
      <line x1={x + 32} y1={y + 7} x2={x + 32} y2={y + 12} />
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. এনক্রিপশন ঠিক আছে, কিন্তু কার সাথে                                       */
/* ------------------------------------------------------------------------- */

export function ImpostorDiagram() {
  return (
    <Sketch
      label="Diagram: মাঝখানের প্রতারক, দুইটা নিখুঁত Handshake"
      height={340}
      minWidth={860}
      viewBox="0 0 860 340"
      caption="ঘাটের পাশের ক্যাফেতে একটা Wi-Fi চলছে, নাম Teknaf Jetty Free WiFi। আসলে সেটা একজন প্রতারকের Laptop। পর্যটকের ফোন islandtours.example চাইল, আর প্রতারক নিজের Laptop এর ঠিকানা ধরিয়ে দিল। এরপর দুইটা আলাদা TLS Handshake হলো: ফোন আর প্রতারকের মাঝে একটা, প্রতারক আর আসল Server এর মাঝে আরেকটা। দুইটাতেই এনক্রিপশন একদম ঠিকঠাক, বাইরের কেউ কিছু পড়তে পারছে না। কিন্তু মাঝখানের লোকটা দুই দিকের সব কথা খুলে পড়ছে, ইচ্ছা হলে বদলেও দিচ্ছে। এনক্রিপশন বলে কথাটা গোপন, কিন্তু কার সাথে গোপন, সেটা বলে না। এই লেসনের পুরোটা সেই প্রশ্নের উত্তর।"
    >
      <Arrow id="cert-imp-a" />
      <Arrow id="cert-imp-m" muted />

      <Box x={20} y={150} w={190} h={54} text="পর্যটকের ফোন" sub="192.168.1.20" accent />
      <Box x={335} y={150} w={190} h={54} text="প্রতারকের Laptop" sub="Teknaf Jetty Free WiFi" dashed />
      <Box x={650} y={150} w={190} h={54} text="Island Tours Server" sub="103.94.135.2:443" />

      {/* what the phone believes */}
      <path
        d="M115,146 C200,40 660,40 745,146"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.45}
        strokeDasharray="5 4"
        strokeWidth="1.3"
        markerEnd="url(#cert-imp-m)"
      />
      <SketchText x={430} y={50} size={9.5} body opacity={0.8}>
        ফোন যা ভাবছে: সরাসরি islandtours.example এর সাথে কথা
      </SketchText>

      {/* what actually happens */}
      <line x1={214} y1={177} x2={329} y2={177} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#cert-imp-a)" />
      <line x1={529} y1={177} x2={644} y2={177} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#cert-imp-a)" />
      <Padlock x={263} y={140} accent />
      <Padlock x={578} y={140} accent />
      <SketchText x={272} y={226} size={9.5} bold accent>
        Handshake ১
      </SketchText>
      <SketchText x={272} y={242} size={8.5} body opacity={0.75}>
        গোপন চাবি ভাগ হলো
      </SketchText>
      <SketchText x={272} y={256} size={8.5} body opacity={0.75}>
        ফোন আর প্রতারকের মাঝে
      </SketchText>
      <SketchText x={587} y={226} size={9.5} bold accent>
        Handshake ২
      </SketchText>
      <SketchText x={587} y={242} size={8.5} body opacity={0.75}>
        আরেকটা গোপন চাবি
      </SketchText>
      <SketchText x={587} y={256} size={8.5} body opacity={0.75}>
        প্রতারক আর Server এর মাঝে
      </SketchText>

      <SketchText x={430} y={232} size={8.5} body opacity={0.8}>
        এখানে সব খোলা:
      </SketchText>
      <SketchText x={430} y={246} size={8.5} body opacity={0.8}>
        পড়া যায়, বদলানো যায়
      </SketchText>

      <line x1={20} y1={290} x2={840} y2={290} stroke="currentColor" strokeOpacity={0.2} />
      <SketchText x={430} y={314} size={10} body bold accent>
        দরকার এমন একটা প্রমাণ, যা প্রতারক বানাতে পারবে না: যে Server উত্তর দিচ্ছে, সে সত্যিই islandtours.example
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. এক জোড়া চাবি                                                           */
/* ------------------------------------------------------------------------- */

export function KeyPairDiagram() {
  return (
    <Sketch
      label="Diagram: একটা Private Key, আর তার Public Key এর অনেক কপি"
      height={320}
      minWidth={840}
      viewBox="0 0 840 320"
      caption="বাঁ দিকে Private Key, যা থাকে শুধু Island Tours এর Server এ, একটাই কপি, তালাবন্ধ। ডান দিকে তার Public Key, যার কপি যে কেউ নিতে পারে, Browser, Partner, এমনকি প্রতারকও। দুইটা চাবি গাণিতিকভাবে জোড়া লাগানো: একটা দিয়ে যা করা হয়, শুধু অন্যটা দিয়ে তা খোলা বা যাচাই করা যায়। আর তীরটা একমুখী: Private Key থেকে Public Key বানানো এক মুহূর্তের কাজ, কিন্তু Public Key দেখে Private Key বের করা আজকের কোনো কম্পিউটারের পক্ষে কার্যত অসম্ভব। এই একমুখীতাই পুরো ব্যবস্থার ভিত্তি।"
    >
      <Arrow id="cert-kp-a" />

      {/* the vault */}
      <rect x={30} y={60} width={250} height={170} fill="var(--primary)" fillOpacity={0.06} stroke="var(--primary)" strokeWidth="1.4" />
      <SketchText x={155} y={84} size={10} bold accent>
        PRIVATE KEY
      </SketchText>
      <KeyIcon x={135} y={104} accent />
      <SketchText x={155} y={152} size={9} body>
        Server এর ভেতরে একটাই কপি
      </SketchText>
      <SketchText x={155} y={168} size={9} body>
        কেউ দেখে না, কোথাও যায় না
      </SketchText>
      <SketchText x={155} y={194} size={8.5} opacity={0.75}>
        privkey.pem, permission 600
      </SketchText>
      <SketchText x={155} y={212} size={8.5} body opacity={0.75}>
        কাজ: সই করা, তালা খোলা
      </SketchText>

      {/* one-way derivation */}
      <line x1={286} y1={145} x2={500} y2={145} stroke="var(--primary)" strokeWidth="1.6" markerEnd="url(#cert-kp-a)" />
      <SketchText x={393} y={134} size={9} body bold accent>
        এক মুহূর্তে বানানো যায়
      </SketchText>
      <line x1={500} y1={172} x2={290} y2={172} stroke="currentColor" strokeOpacity={0.4} strokeDasharray="4 4" strokeWidth="1.3" />
      <SketchText x={395} y={177} size={12} bold accent>
        ✕
      </SketchText>
      <SketchText x={393} y={196} size={9} body opacity={0.8}>
        উল্টো দিকে কার্যত অসম্ভব
      </SketchText>

      {/* the copies */}
      <rect x={510} y={60} width={300} height={170} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <SketchText x={660} y={84} size={10} bold>
        PUBLIC KEY
      </SketchText>
      {[540, 610, 680, 750].map((x) => (
        <Padlock key={x} x={x} y={100} open />
      ))}
      <SketchText x={548} y={138} size={8} body opacity={0.75}>
        Browser
      </SketchText>
      <SketchText x={618} y={138} size={8} body opacity={0.75}>
        Partner
      </SketchText>
      <SketchText x={688} y={138} size={8} body opacity={0.75}>
        Mobile App
      </SketchText>
      <SketchText x={758} y={138} size={8} body opacity={0.75}>
        যে কেউ
      </SketchText>
      <SketchText x={660} y={168} size={9} body>
        যত খুশি কপি, সবার হাতে
      </SketchText>
      <SketchText x={660} y={194} size={8.5} opacity={0.75}>
        Certificate এর ভেতরে লেখা থাকে
      </SketchText>
      <SketchText x={660} y={212} size={8.5} body opacity={0.75}>
        কাজ: সই যাচাই, তালা দেওয়া
      </SketchText>

      <SketchText x={420} y={272} size={10} body bold>
        Public Key হলো খোলা তালা, যা আপনি সবাইকে বিলিয়ে দেন। Private Key হলো সেই তালার একমাত্র চাবি।
      </SketchText>
      <SketchText x={420} y={294} size={9} body opacity={0.75}>
        যে কেউ তালাটা লাগাতে পারে, কিন্তু খুলতে পারেন শুধু চাবির মালিক
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. দুই কাজ: তালা দেওয়া আর সই করা                                           */
/* ------------------------------------------------------------------------- */

function EncryptPanel() {
  return (
    <>
      <Arrow id="cert-enc-a" />
      <Box x={8} y={24} w={92} h={44} text="যে কেউ" sub="বার্তা লেখে" size={9} />
      <Box x={214} y={24} w={98} h={44} text="Island Tours" sub="বার্তা খোলে" size={9} accent />
      <line x1={104} y1={46} x2={208} y2={46} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#cert-enc-a)" />
      <Padlock x={148} y={22} accent />
      <SketchText x={160} y={92} size={8.5} body>
        তালা দেয় Island Tours এর
      </SketchText>
      <SketchText x={160} y={107} size={8.5} bold accent>
        Public Key দিয়ে
      </SketchText>
      <SketchText x={160} y={132} size={8.5} body>
        খুলতে পারে শুধু
      </SketchText>
      <SketchText x={160} y={147} size={8.5} bold accent>
        Private Key
      </SketchText>
      <line x1={10} y1={170} x2={310} y2={170} stroke="currentColor" strokeOpacity={0.2} />
      <SketchText x={160} y={192} size={8.5} body opacity={0.8}>
        ফল: গোপনীয়তা
      </SketchText>
      <SketchText x={160} y={210} size={8} body opacity={0.7}>
        TLS 1.2 পর্যন্ত RSA এভাবে চাবি পাঠাত
      </SketchText>
    </>
  );
}

function SignPanel() {
  return (
    <>
      <Arrow id="cert-sign-a" />
      <Box x={8} y={24} w={98} h={44} text="Island Tours" sub="সই করে" size={9} accent />
      <Box x={214} y={24} w={98} h={44} text="যে কেউ" sub="যাচাই করে" size={9} />
      <line x1={110} y1={46} x2={208} y2={46} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#cert-sign-a)" />
      <KeyIcon x={142} y={30} accent />
      <SketchText x={160} y={92} size={8.5} body>
        সই করে নিজের
      </SketchText>
      <SketchText x={160} y={107} size={8.5} bold accent>
        Private Key দিয়ে
      </SketchText>
      <SketchText x={160} y={132} size={8.5} body>
        যাচাই করতে পারে যে কেউ
      </SketchText>
      <SketchText x={160} y={147} size={8.5} bold accent>
        Public Key দিয়ে
      </SketchText>
      <line x1={10} y1={170} x2={310} y2={170} stroke="currentColor" strokeOpacity={0.2} />
      <SketchText x={160} y={192} size={8.5} body opacity={0.8}>
        ফল: পরিচয়ের প্রমাণ, আর বদলায়নি তার প্রমাণ
      </SketchText>
      <SketchText x={160} y={210} size={8} body opacity={0.7}>
        TLS 1.3 আর প্রতিটা Certificate এটা করে
      </SketchText>
    </>
  );
}

export function EncryptVsSignSplit() {
  return (
    <SketchSplit
      label="Diagram: একই চাবিজোড়ার দুইটা আলাদা কাজ"
      caption="বাঁ দিকে Encrypt: যে কেউ Public Key দিয়ে তালা দিতে পারে, খুলতে পারেন শুধু Private Key এর মালিক। ডান দিকে Sign: শুধু Private Key এর মালিক সই করতে পারেন, আর যে কেউ Public Key দিয়ে মিলিয়ে দেখতে পারে। দুইটা একই চাবিজোড়ার কাজ, দিক শুধু উল্টো। আজকের HTTPS এ Certificate এর চাবি দিয়ে শুধু ডান দিকের কাজটা হয়। আসল গোপন চাবিটা আসে লেসন ০৭ এর Key Exchange থেকে।"
      panels={[
        { title: "Encrypt", sub: "Public দিয়ে তালা, Private দিয়ে খোলা", viewBox: "0 0 320 220", height: 220, children: <EncryptPanel /> },
        { title: "Sign", sub: "Private দিয়ে সই, Public দিয়ে যাচাই", viewBox: "0 0 320 220", height: 220, children: <SignPanel /> },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 4. সই কীভাবে হয়: আগে Hash, তারপর Private Key                                */
/* ------------------------------------------------------------------------- */

export function SignatureFlowDiagram() {
  return (
    <Sketch
      label="Diagram: একটা Digital Signature বানানো আর যাচাই করা"
      height={360}
      minWidth={880}
      viewBox="0 0 880 360"
      caption="উপরের সারিতে Island Tours সই করছে। প্রথমে বার্তাটার SHA-256 Hash নেওয়া হলো, যা যেকোনো লম্বা বার্তাকে ৩২ Byte এর একটা আঙুলের ছাপে বদলে দেয়। তারপর সেই ছাপটা Private Key দিয়ে সই করা হলো। নিচের সারিতে Browser যাচাই করছে। সে নিজেও পাওয়া বার্তার Hash নিল, তারপর Public Key দিয়ে দেখল সইটা ঠিক এই Hash এর জন্য এই চাবির মালিকের করা কি না। বার্তার একটা অক্ষর বদলালেই Hash পুরো আলাদা হয়ে যায়, তাই সই আর মেলে না। Hash এর সংখ্যাগুলো এই লেসনের Lab থেকে নেওয়া আসল ফলাফল।"
    >
      <Arrow id="cert-sig-a" />
      <SketchText x={20} y={30} size={10} anchor="start" body bold accent>
        সই করা, Island Tours এর Server এ
      </SketchText>
      <Box x={20} y={46} w={200} h={52} text="বার্তা" sub="2 seats, 2026-12-20" />
      <line x1={224} y1={72} x2={286} y2={72} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#cert-sig-a)" />
      <SketchText x={255} y={64} size={8.5} bold accent>
        SHA-256
      </SketchText>
      <Box x={292} y={46} w={200} h={52} text="Hash, ৩২ Byte" sub="eedf7a96df06..." />
      <line x1={496} y1={72} x2={588} y2={72} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#cert-sig-a)" />
      <KeyIcon x={524} y={44} accent />
      <SketchText x={542} y={90} size={8} bold accent>
        Private Key
      </SketchText>
      <Box x={594} y={46} w={260} h={52} text="Signature, 70 থেকে 72 Byte" sub="বার্তার সাথে পাঠানো হয়" accent />

      <line x1={724} y1={102} x2={724} y2={200} stroke="var(--primary)" strokeWidth="1.3" strokeDasharray="4 3" markerEnd="url(#cert-sig-a)" />
      <line x1={120} y1={102} x2={120} y2={176} stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 3" />
      <SketchText x={130} y={154} size={8.5} anchor="start" body opacity={0.75}>
        বার্তাটা যায় Network দিয়ে
      </SketchText>
      <SketchText x={714} y={154} size={8.5} anchor="end" body opacity={0.75}>
        সইটাও সাথে যায়
      </SketchText>

      <SketchText x={20} y={196} size={10} anchor="start" body bold>
        যাচাই করা, পর্যটকের Browser এ
      </SketchText>
      <Box x={20} y={206} w={200} h={52} text="পাওয়া বার্তা" sub="যা এসে পৌঁছাল" />
      <line x1={224} y1={232} x2={286} y2={232} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#cert-sig-a)" />
      <SketchText x={255} y={224} size={8.5} bold accent>
        SHA-256
      </SketchText>
      <Box x={292} y={206} w={200} h={52} text="নিজের হিসাবের Hash" sub="Browser নিজে বানাল" />
      <line x1={496} y1={232} x2={588} y2={232} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#cert-sig-a)" />
      <Padlock x={532} y={204} open />
      <SketchText x={542} y={250} size={8} bold>
        Public Key
      </SketchText>
      <Box x={594} y={206} w={260} h={52} text="মিলল? Verified OK" sub="না মিললে Verification failure" accent />

      <line x1={20} y1={292} x2={860} y2={292} stroke="currentColor" strokeOpacity={0.2} />
      <SketchText x={440} y={316} size={9.5} body>
        2 seats বদলে 9 seats করলে Hash হয়ে যায় c27e7665c5e7..., একদম আলাদা, তাই সই আর মেলে না
      </SketchText>
      <SketchText x={440} y={338} size={9} body opacity={0.75}>
        আর অন্য কারো Public Key দিয়ে যাচাই করলেও মেলে না। তাই সই একসাথে দুইটা কথা প্রমাণ করে: কে লিখেছে, আর পথে কেউ বদলায়নি
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. একটা Certificate এর ভেতরে                                                */
/* ------------------------------------------------------------------------- */

const CERT_ROWS = [
  { label: "Subject", value: "CN=example.com", group: "কার" },
  { label: "Subject Alternative Name", value: "DNS:example.com, DNS:*.example.com", group: "কার" },
  { label: "Subject Public Key", value: "EC, P-256, 256 bit", group: "কোন চাবি" },
  { label: "Issuer", value: "Cloudflare TLS Issuing ECC CA 3", group: "কে বলছে" },
  { label: "Validity", value: "Sep 26 2026 থেকে Dec 25 2026", group: "কতদিন" },
  { label: "Key Usage, Extended Key Usage", value: "Digital Signature, TLS Web Server", group: "কী কাজে" },
  { label: "Basic Constraints", value: "CA:FALSE", group: "কী কাজে" },
  { label: "CRL, AIA, CT SCTs", value: "বাতিল তালিকা, Issuer এর ঠিকানা, Log এর রসিদ", group: "খোঁজখবর" },
] as const;

const CERT_GROUPS = [
  { name: "কার", note: "পাসপোর্টের নাম", from: 0, to: 1 },
  { name: "কোন চাবি", note: "পাসপোর্টের ছবি", from: 2, to: 2 },
  { name: "কে বলছে", note: "ইস্যু করা দপ্তর", from: 3, to: 3 },
  { name: "কতদিন", note: "মেয়াদ", from: 4, to: 4 },
  { name: "কী কাজে", note: "কোন কাজে বৈধ", from: 5, to: 6 },
  { name: "খোঁজখবর", note: "যাচাইয়ের ঠিকানা", from: 7, to: 7 },
] as const;

export function CertAnatomyDiagram() {
  const top = 62;
  const rowH = 34;
  return (
    <Sketch
      label="Diagram: একটা আসল Certificate এর ভেতরে কী লেখা"
      height={452}
      minWidth={880}
      viewBox="0 0 880 452"
      caption="মানগুলো example.com এর আসল Certificate থেকে, openssl দিয়ে পড়া (অক্টোবর 2026)। আপনি যখন পড়বেন তখন তারিখ আর Issuer বদলে যেতে পারে, কারণ Certificate নিয়মিত নতুন হয়। একটা Certificate আসলে একটা পাসপোর্ট: কার নাম (Subject আর SAN), কোন চাবি তার (Public Key, পাসপোর্টের ছবির মতো যা দেখে মানুষটাকে মেলানো হয়), কোন দপ্তর ইস্যু করেছে (Issuer), কতদিন বৈধ (Validity), কোন কাজে ব্যবহার করা যাবে (Key Usage), আর সবার নিচে ইস্যু করা দপ্তরের সই। উপরের সব তথ্যের উপর এই একটা সই থাকে বলেই একটা অক্ষরও কেউ বদলাতে পারে না।"
    >
      <rect x={20} y={20} width={600} height={416} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.4" />
      <SketchText x={36} y={44} size={10.5} anchor="start" bold accent>
        X.509 v3 Certificate
      </SketchText>
      <SketchText x={604} y={44} size={8.5} anchor="end" opacity={0.7}>
        Serial: একটা লম্বা অনন্য সংখ্যা
      </SketchText>

      {CERT_ROWS.map((row, i) => {
        const y = top + i * rowH;
        return (
          <g key={row.label}>
            <line x1={20} y1={y} x2={620} y2={y} stroke="currentColor" strokeOpacity={0.15} />
            <SketchText x={36} y={y + 21} size={9} anchor="start" bold>
              {row.label}
            </SketchText>
            <SketchText x={604} y={y + 21} size={9} anchor="end" body opacity={0.85}>
              {row.value}
            </SketchText>
          </g>
        );
      })}

      {/* the signature strip */}
      <rect x={20} y={top + CERT_ROWS.length * rowH + 14} width={600} height={74} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.4" />
      <SketchText x={36} y={top + CERT_ROWS.length * rowH + 40} size={10} anchor="start" bold accent>
        Issuer এর Signature
      </SketchText>
      <SketchText x={36} y={top + CERT_ROWS.length * rowH + 60} size={9} anchor="start" body>
        উপরের প্রতিটা লাইনের Hash, Issuer এর Private Key দিয়ে সই করা: ecdsa-with-SHA256
      </SketchText>
      <SketchText x={36} y={top + CERT_ROWS.length * rowH + 76} size={8.5} anchor="start" body opacity={0.75}>
        একটা অক্ষর বদলালে এই সই আর মেলে না, তাই Certificate জাল করা যায় না
      </SketchText>

      {/* group brackets on the right */}
      {CERT_GROUPS.map((g) => {
        const y1 = top + g.from * rowH + 6;
        const y2 = top + (g.to + 1) * rowH - 6;
        const mid = (y1 + y2) / 2;
        return (
          <g key={g.name}>
            <path d={`M632,${y1} L640,${y1} L640,${y2} L632,${y2}`} fill="none" stroke="var(--primary)" strokeWidth="1.2" />
            <SketchText x={652} y={mid} size={9.5} anchor="start" bold accent>
              {g.name}
            </SketchText>
            <SketchText x={652} y={mid + 14} size={8.5} anchor="start" body opacity={0.75}>
              {g.note}
            </SketchText>
          </g>
        );
      })}
      <path
        d={`M632,${top + CERT_ROWS.length * rowH + 20} L640,${top + CERT_ROWS.length * rowH + 20} L640,${top + CERT_ROWS.length * rowH + 82} L632,${top + CERT_ROWS.length * rowH + 82}`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.2"
      />
      <SketchText x={652} y={top + CERT_ROWS.length * rowH + 48} size={9.5} anchor="start" bold accent>
        সিলমোহর
      </SketchText>
      <SketchText x={652} y={top + CERT_ROWS.length * rowH + 62} size={8.5} anchor="start" body opacity={0.75}>
        দপ্তরের সই, জাল করা যায় না
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. Chain of Trust                                                          */
/* ------------------------------------------------------------------------- */

export function ChainOfTrustDiagram() {
  return (
    <Sketch
      label="Diagram: Root থেকে আপনার সাইট পর্যন্ত বিশ্বাসের শিকল"
      height={430}
      minWidth={880}
      viewBox="0 0 880 430"
      caption="সবার উপরে Root CA, যার Certificate সে নিজেই সই করেছে, আর যা আগে থেকেই আপনার Operating System বা Browser এর Trust Store এ রাখা। Root এর Private Key থাকে ইন্টারনেটের বাইরে, ভল্টে, বছরে কয়েকবার মাত্র বের করা হয়। প্রতিদিনের সই করার কাজ করে Intermediate, যার Certificate এ Root এর সই আছে। Intermediate সই করে আপনার সাইটের Leaf Certificate এ। Server পাঠায় নিচের দুইটা, Leaf আর Intermediate, একসাথে যার নাম fullchain। Browser নিচ থেকে উপরে প্রতিটা সই মিলিয়ে দেখে, আর শেষে যে Root এ পৌঁছায় সেটা নিজের তালিকায় আছে কি না দেখে। থাকলে পুরো শিকলটা বিশ্বাসযোগ্য।"
    >
      <Arrow id="cert-chain-a" />
      <Arrow id="cert-chain-m" muted />

      {/* root */}
      <rect x={120} y={26} width={380} height={86} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.4" />
      <SketchText x={310} y={52} size={10.5} bold>
        Root CA
      </SketchText>
      <SketchText x={310} y={72} size={9} body opacity={0.85}>
        Issuer আর Subject একই: নিজের সই নিজে করা
      </SketchText>
      <SketchText x={310} y={92} size={8.5} body opacity={0.75}>
        Private Key ইন্টারনেটের বাইরে, ভল্টে
      </SketchText>

      {/* intermediate */}
      <rect x={120} y={162} width={380} height={86} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.4" />
      <SketchText x={310} y={188} size={10.5} bold>
        Intermediate CA
      </SketchText>
      <SketchText x={310} y={208} size={9} body opacity={0.85}>
        Subject: Intermediate, Issuer: Root, CA:TRUE
      </SketchText>
      <SketchText x={310} y={228} size={8.5} body opacity={0.75}>
        প্রতিদিন হাজার হাজার Certificate এ সই করে
      </SketchText>

      {/* leaf */}
      <rect x={120} y={298} width={380} height={86} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.5" />
      <SketchText x={310} y={324} size={10.5} bold accent>
        Leaf: islandtours.example
      </SketchText>
      <SketchText x={310} y={344} size={9} body>
        Subject: islandtours.example, Issuer: Intermediate
      </SketchText>
      <SketchText x={310} y={364} size={8.5} body opacity={0.75}>
        CA:FALSE, শুধু এই নামের জন্য, অল্প কয়েক দিনের মেয়াদ
      </SketchText>

      {/* signing arrows, downward */}
      <line x1={250} y1={114} x2={250} y2={156} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#cert-chain-a)" />
      <SketchText x={242} y={140} size={8.5} anchor="end" body accent bold>
        Root এর সই
      </SketchText>
      <line x1={250} y1={250} x2={250} y2={292} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#cert-chain-a)" />
      <SketchText x={242} y={276} size={8.5} anchor="end" body accent bold>
        Intermediate এর সই
      </SketchText>

      {/* verification arrow, upward */}
      <line x1={96} y1={376} x2={96} y2={40} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" strokeDasharray="4 3" markerEnd="url(#cert-chain-m)" />
      <SketchText x={88} y={204} size={8.5} anchor="end" body opacity={0.8}>
        যাচাই চলে
      </SketchText>
      <SketchText x={88} y={218} size={8.5} anchor="end" body opacity={0.8}>
        নিচ থেকে উপরে
      </SketchText>

      {/* right side brackets */}
      <path d="M520,32 L530,32 L530,106 L520,106" fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.2" />
      <SketchText x={542} y={56} size={9.5} anchor="start" bold>
        আগে থেকেই আপনার যন্ত্রে
      </SketchText>
      <SketchText x={542} y={74} size={8.5} anchor="start" body opacity={0.8}>
        Trust Store: macOS, Windows, Android, Firefox
      </SketchText>
      <SketchText x={542} y={90} size={8.5} anchor="start" body opacity={0.8}>
        এই যন্ত্রে Node এর নিজের তালিকায় 144 টা Root
      </SketchText>

      <path d="M520,168 L530,168 L530,378 L520,378" fill="none" stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={542} y={258} size={9.5} anchor="start" bold accent>
        Server পাঠায়, Handshake এর সময়
      </SketchText>
      <SketchText x={542} y={276} size={8.5} anchor="start" body opacity={0.85}>
        Leaf আগে, তারপর Intermediate
      </SketchText>
      <SketchText x={542} y={292} size={8.5} anchor="start" opacity={0.85}>
        fullchain.pem
      </SketchText>
      <SketchText x={542} y={310} size={8.5} anchor="start" body opacity={0.75}>
        Intermediate বাদ পড়লে শিকল ভাঙে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 7. ACME: Caddy কীভাবে নিজে Certificate আনে                                    */
/* ------------------------------------------------------------------------- */

const ACME_STEPS = [
  { y: 112, dir: "right", label: "১. Order: islandtours.example এর জন্য একটা Certificate চাই", note: "ACME Account এর চাবি দিয়ে সই করা অনুরোধ" },
  { y: 162, dir: "left", label: "২. Challenge: আগে প্রমাণ দিন নামটা আপনার", note: "একটা Token দিল, সাথে কোন পথে প্রমাণ দেবেন" },
  { y: 212, dir: "none", label: "৩. Caddy Token টা বসায়", note: "HTTP-01: Port 80 এ /.well-known/acme-challenge/ এর নিচে ফাইল, বা DNS-01: _acme-challenge TXT" },
  { y: 262, dir: "left", label: "৪. Let's Encrypt নিজে এসে দেখে, কয়েক জায়গা থেকে", note: "DNS দিয়ে islandtours.example খুঁজে 103.94.135.2 এ গিয়ে Token মেলায়" },
  { y: 312, dir: "right", label: "৫. CSR: নতুন Public Key আর নামগুলো", note: "Private Key কখনো যায় না, শুধু Public অংশ" },
  { y: 362, dir: "left", label: "৬. Certificate আর Intermediate ফেরত", note: "Caddy সাথে সাথে ব্যবহার শুরু করে, মেয়াদের শেষ ভাগে আবার এক থেকে শুরু" },
] as const;

export function AcmeFlowDiagram() {
  const lx = 150;
  const rx = 730;
  return (
    <Sketch
      label="Diagram: ACME, যন্ত্র দিয়ে যন্ত্রের Certificate নেওয়া"
      height={410}
      minWidth={880}
      viewBox="0 0 880 410"
      caption="বাঁ দিকে Island Tours এর Server এ Caddy, ডান দিকে Let's Encrypt। পুরো আলাপটা ACME নামের একটা Protocol এ হয়, কোনো মানুষ কোনো ফর্ম পূরণ করে না। সবচেয়ে গুরুত্বপূর্ণ ধাপ তিন আর চার: Let's Encrypt আপনার কথায় বিশ্বাস করে না, নিজে এসে দেখে নামটা সত্যিই আপনার নিয়ন্ত্রণে কি না। HTTP-01 এ সে Port 80 এ একটা নির্দিষ্ট ফাইল খোঁজে, DNS-01 এ একটা TXT Record। Wildcard Certificate এর জন্য শুধু DNS-01 চলে, যা Module 04 এর Wildcard লেসনে দেখেছেন। আর খেয়াল করুন পাঁচ নম্বর ধাপ: Private Key Server ছেড়ে কোথাও যায় না, Let's Encrypt শুধু Public Key এ সই করে।"
    >
      <Arrow id="cert-acme-a" />
      <Box x={lx - 110} y={20} w={220} h={44} text="Caddy" sub="103.94.135.2, Port 80 আর 443" accent />
      <Box x={rx - 110} y={20} w={220} h={44} text="Let's Encrypt" sub="ACME Server" />
      <line x1={lx} y1={70} x2={lx} y2={392} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <line x1={rx} y1={70} x2={rx} y2={392} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />

      {ACME_STEPS.map((s) => {
        if (s.dir === "none") {
          return (
            <g key={s.y}>
              <rect x={lx - 8} y={s.y - 16} width={16} height={30} fill="var(--primary)" fillOpacity={0.25} stroke="var(--primary)" />
              <SketchText x={lx + 22} y={s.y - 3} size={9.5} anchor="start" bold accent>
                {s.label}
              </SketchText>
              <SketchText x={lx + 22} y={s.y + 13} size={8.5} anchor="start" body opacity={0.8}>
                {s.note}
              </SketchText>
            </g>
          );
        }
        const from = s.dir === "right" ? lx + 4 : rx - 4;
        const to = s.dir === "right" ? rx - 6 : lx + 6;
        return (
          <g key={s.y}>
            <line x1={from} y1={s.y} x2={to} y2={s.y} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#cert-acme-a)" />
            <SketchText x={(lx + rx) / 2} y={s.y - 8} size={9.5} bold accent>
              {s.label}
            </SketchText>
            <SketchText x={(lx + rx) / 2} y={s.y + 15} size={8.5} body opacity={0.8}>
              {s.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 8. Certificate এর আয়ু ছোট হচ্ছে                                              */
/* ------------------------------------------------------------------------- */

const MAX_RULES = [
  { when: "15 মার্চ 2026 এর আগে", days: 398 },
  { when: "15 মার্চ 2026 থেকে", days: 200 },
  { when: "15 মার্চ 2027 থেকে", days: 100 },
  { when: "15 মার্চ 2029 থেকে", days: 47 },
] as const;

const LE_RULES = [
  { when: "এখন, classic Profile", days: 90 },
  { when: "13 মে 2026 থেকে, tlsserver (ইচ্ছা হলে)", days: 45 },
  { when: "10 ফেব্রুয়ারি 2027 থেকে, classic", days: 64 },
  { when: "16 ফেব্রুয়ারি 2028 থেকে, classic", days: 45 },
] as const;

function LifetimeBars({ rows, y0, accent }: { rows: readonly { when: string; days: number }[]; y0: number; accent?: boolean }) {
  const scale = 520 / 398;
  return (
    <>
      {rows.map((r, i) => {
        const y = y0 + i * 32;
        const w = Math.max(6, r.days * scale);
        return (
          <g key={r.when}>
            <SketchText x={250} y={y + 14} size={9} anchor="end" body>
              {r.when}
            </SketchText>
            <rect
              x={262}
              y={y}
              width={w}
              height={20}
              fill={accent ? "var(--primary)" : "currentColor"}
              fillOpacity={accent ? 0.25 : 0.14}
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 1 : 0.5}
            />
            <SketchText x={262 + w + 8} y={y + 14} size={9.5} anchor="start" bold accent={accent}>
              {`${r.days} দিন`}
            </SketchText>
          </g>
        );
      })}
    </>
  );
}

export function LifetimeTimelineDiagram() {
  return (
    <Sketch
      label="Diagram: একটা Certificate সর্বোচ্চ কতদিন বাঁচতে পারে"
      height={360}
      minWidth={880}
      viewBox="0 0 880 360"
      caption="উপরের চারটা দাগ সব প্রকাশ্য Certificate এর জন্য সর্বোচ্চ মেয়াদ, CA/Browser Forum এর Ballot SC-081v3 অনুযায়ী, যেটা 2025 সালের এপ্রিলে পাস হয়েছে। এই Forum এ CA গুলো আর Browser কোম্পানিগুলো মিলে নিয়ম বানায়। নিচের দাগগুলো Let's Encrypt এর নিজের পরিকল্পনা, তাদের ডিসেম্বর 2025 এর ঘোষণা থেকে। দুই দিকেই বার্তা এক: মেয়াদ ছোট হচ্ছে, আর হাতে নবায়ন করার দিন শেষ। তারিখগুলো 2026 সালের অক্টোবরে মিলিয়ে দেখা, নতুন ঘোষণা এলে বদলাতে পারে।"
    >
      <SketchText x={20} y={30} size={10} anchor="start" bold>
        সব প্রকাশ্য Certificate এর সর্বোচ্চ মেয়াদ
      </SketchText>
      <LifetimeBars rows={MAX_RULES} y0={44} />
      <line x1={20} y1={182} x2={860} y2={182} stroke="currentColor" strokeOpacity={0.2} />
      <SketchText x={20} y={206} size={10} anchor="start" bold accent>
        Let&apos;s Encrypt যা দেয়
      </SketchText>
      <LifetimeBars rows={LE_RULES} y0={220} accent />
    </Sketch>
  );
}
