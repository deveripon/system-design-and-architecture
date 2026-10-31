/**
 * What: The interactive labs for Module 06 Lesson 08. SignatureLab signs a booking message
 * with a real key pair in the browser and lets the reader tamper with it. CertFieldLab walks
 * the fields of a real certificate. ValidationLab runs the checks a browser makes on a
 * certificate, one scenario at a time, and shows the error each client prints.
 *
 * Why: A signature or a broken chain is only convincing when the reader breaks it with
 * their own hands. SignatureLab uses the browser's own WebCrypto, so the "Verified OK"
 * it shows is a real verification, not a canned answer. Everything is driven from event
 * handlers, never from an effect, so no state is set while rendering.
 */
"use client";

import { cn, toBn } from "@/lib/utils";
import { Check, Minus, RotateCcw, X } from "lucide-react";
import { useRef, useState } from "react";

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
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
} & Record<`data-${string}`, string | number>) {
  return (
    <button
      onClick={onClick}
      {...rest}
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

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

/* ------------------------------------------------------------------------- */
/* 1. সই করুন, তারপর বার্তাটা বদলে দেখুন                                         */
/* ------------------------------------------------------------------------- */

const ORIGINAL_MESSAGE = "booking bk_7Q2M9X confirmed, 2 seats, 2026-12-20";

const MESSAGE_PRESETS = [
  { id: "original", label: "আসল বার্তা", text: ORIGINAL_MESSAGE },
  { id: "seats", label: "2 বদলে 9", text: "booking bk_7Q2M9X confirmed, 9 seats, 2026-12-20" },
  { id: "date", label: "তারিখ বদলান", text: "booking bk_7Q2M9X confirmed, 2 seats, 2026-12-21" },
  { id: "space", label: "শেষে একটা Space", text: `${ORIGINAL_MESSAGE} ` },
] as const;

type Verifier = "island" | "attacker";

type Keys = { island: CryptoKeyPair; attacker: CryptoKeyPair };

const ECDSA = { name: "ECDSA", namedCurve: "P-256" } as const;
const ECDSA_SHA256 = { name: "ECDSA", hash: "SHA-256" } as const;

export function SignatureLab() {
  const [keys, setKeys] = useState<Keys | null>(null);
  const [signature, setSignature] = useState<ArrayBuffer | null>(null);
  const [text, setText] = useState<string>(ORIGINAL_MESSAGE);
  const [verifier, setVerifier] = useState<Verifier>("island");
  const [hash, setHash] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const runId = useRef(0);

  // Recomputes the hash and the verification for one message and one key. A newer call
  // makes an older one stale, so a slow result never overwrites a fresh one.
  async function recheck(nextText: string, nextVerifier: Verifier, nextKeys: Keys | null, nextSignature: ArrayBuffer | null) {
    const id = ++runId.current;
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) return;
    const bytes = new TextEncoder().encode(nextText);
    const digest = await subtle.digest("SHA-256", bytes);
    let ok: boolean | null = null;
    if (nextKeys && nextSignature) {
      ok = await subtle.verify(ECDSA_SHA256, nextKeys[nextVerifier].publicKey, nextSignature, bytes);
    }
    if (id !== runId.current) return;
    setHash(toHex(digest));
    setValid(ok);
  }

  async function handleSign() {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) {
      setFailure("এই পাতাটা https বা localhost ঠিকানায় খুলুন, Browser শুধু নিরাপদ পাতায় WebCrypto চালাতে দেয়।");
      return;
    }
    try {
      const island = (await subtle.generateKey(ECDSA, false, ["sign", "verify"])) as CryptoKeyPair;
      const attacker = (await subtle.generateKey(ECDSA, false, ["sign", "verify"])) as CryptoKeyPair;
      const fresh: Keys = { island, attacker };
      const signed = await subtle.sign(ECDSA_SHA256, island.privateKey, new TextEncoder().encode(ORIGINAL_MESSAGE));
      setKeys(fresh);
      setSignature(signed);
      setText(ORIGINAL_MESSAGE);
      setVerifier("island");
      setFailure(null);
      await recheck(ORIGINAL_MESSAGE, "island", fresh, signed);
    } catch (err) {
      setFailure(`এই Browser এ সই করা গেল না: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  function handleText(next: string) {
    setText(next);
    void recheck(next, verifier, keys, signature);
  }

  function handleVerifier(next: Verifier) {
    setVerifier(next);
    void recheck(text, next, keys, signature);
  }

  const changed = text !== ORIGINAL_MESSAGE;
  const reason =
    valid === null
      ? null
      : valid
        ? "বার্তাটা একদম সেই, যেটায় সই হয়েছিল, আর যাচাই হলো Island Tours এর নিজের Public Key দিয়ে। দুইটা কথাই প্রমাণ হলো: লিখেছে Island Tours, আর পথে কেউ বদলায়নি।"
        : changed && verifier === "attacker"
          ? "দুইটা কারণেই ব্যর্থ: বার্তা বদলেছে, আর চাবিটাও ভুল মানুষের।"
          : changed
            ? "বার্তার অন্তত একটা Byte বদলেছে, তাই Hash পুরো আলাদা। পুরনো সই এই নতুন Hash এর জন্য করা নয়।"
            : "বার্তা ঠিক আছে, কিন্তু যাচাই হলো প্রতারকের Public Key দিয়ে। সইটা যার Private Key দিয়ে করা, শুধু তার Public Key দিয়েই মেলে।";

  return (
    <Panel
      label="Interactive"
      title="একটা আসল সই, আপনার Browser এর ভেতরে"
      footer="সই করুন চাপলে আপনার Browser নিজেই দুইটা নতুন P-256 চাবিজোড়া বানায়, একটা Island Tours এর, একটা প্রতারকের, আর Island Tours এর Private Key দিয়ে বুকিং এর বার্তায় সই করে। এরপর বার্তার একটা অক্ষর বদলান, বা যাচাইয়ের চাবি বদলান, আর দেখুন সই টেকে কি না। এখানে কোনো ফলাফল আগে থেকে লেখা নেই, প্রতিবার Browser এর WebCrypto সত্যি সত্যি হিসাব করছে। একটা ছোট পার্থক্য খেয়াল রাখবেন: WebCrypto সইটাকে কাঁচা 64 Byte এ রাখে, আর openssl একই দুইটা সংখ্যাকে একটু মোড়ক দিয়ে 70 থেকে 72 Byte এ লেখে।"
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={handleSign}
          data-action="sign"
          className="px-3 py-1.5 border border-primary bg-primary/10 text-primary text-[0.6875rem] font-bold hover:bg-primary/20 transition-colors"
        >
          {keys ? "নতুন চাবি দিয়ে আবার সই করুন" : "চাবি বানান আর সই করুন"}
        </button>
        {failure && <span className="text-[0.75rem] text-primary">{failure}</span>}
      </div>

      <label className="block mb-2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
        যে বার্তাটা যাচাই হচ্ছে
      </label>
      <input
        value={text}
        onChange={(e) => handleText(e.target.value)}
        disabled={!keys}
        spellCheck={false}
        data-field="message"
        className="w-full mb-3 px-3 py-2 border border-border bg-background font-mono text-[0.8125rem] text-foreground disabled:opacity-50"
      />
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {MESSAGE_PRESETS.map((p) => (
          <Chip key={p.id} active={keys !== null && text === p.text} onClick={() => keys && handleText(p.text)} data-preset={p.id}>
            {p.label}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground mr-1">
          যাচাই করছে
        </span>
        <Chip active={verifier === "island"} onClick={() => keys && handleVerifier("island")} data-verifier="island">
          Island Tours এর Public Key
        </Chip>
        <Chip active={verifier === "attacker"} onClick={() => keys && handleVerifier("attacker")} data-verifier="attacker">
          প্রতারকের Public Key
        </Chip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="border border-border bg-background px-4 py-3 min-w-0">
          <div className="text-[0.625rem] text-muted-foreground mb-1">এই বার্তার SHA-256 Hash</div>
          <div className="font-mono text-[0.75rem] text-foreground break-all" data-hash={hash ?? ""}>
            {hash ? `${hash.slice(0, 32)}...` : "সই করার পরে দেখা যাবে"}
          </div>
        </div>
        <div className="border border-border bg-background px-4 py-3 min-w-0">
          <div className="text-[0.625rem] text-muted-foreground mb-1">আসল বার্তার উপর করা Signature</div>
          <div className="font-mono text-[0.75rem] text-foreground break-all">
            {signature ? `${toHex(signature).slice(0, 32)}... (${signature.byteLength} Byte)` : "এখনো সই হয়নি"}
          </div>
        </div>
        <div
          data-valid={valid === null ? "" : String(valid)}
          className={cn(
            "border px-4 py-3 transition-colors",
            valid === null ? "border-border bg-background" : valid ? "border-primary/60 bg-primary/5" : "border-border bg-muted/40",
          )}
        >
          <div className="text-[0.625rem] text-muted-foreground mb-1">ফলাফল</div>
          <div className={cn("font-mono text-[0.9375rem] font-bold", valid ? "text-primary" : "text-foreground")}>
            {valid === null ? "অপেক্ষায়" : valid ? "Verified OK" : "Verification failure"}
          </div>
        </div>
      </div>

      <p className="text-[0.8125rem] text-muted-foreground leading-relaxed min-h-[2.5rem]">
        {reason ?? "উপরের বোতাম চেপে শুরু করুন।"}
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা আসল Certificate এর প্রতিটা ঘর                                         */
/* ------------------------------------------------------------------------- */

const CERT_FIELDS = [
  {
    id: "subject",
    name: "Subject",
    value: "CN=example.com",
    what: "কার Certificate। CN মানে Common Name। পুরনো দিনে Browser এই নামটাই মিলিয়ে দেখত।",
    checks: "আজকাল প্রায় কেউ না। নাম মেলানো হয় SAN দিয়ে, CN রাখা হয় শুধু পুরনো অভ্যাসে।",
    wrong: "CN আর SAN আলাদা হলে Browser SAN কেই মানবে।",
  },
  {
    id: "san",
    name: "Subject Alternative Name",
    value: "DNS:example.com, DNS:*.example.com",
    what: "যে যে নামের জন্য এই Certificate বৈধ, তার পুরো তালিকা। একটা Certificate এ অনেক নাম থাকতে পারে, আর * দিয়ে এক স্তরের সব উপনাম।",
    checks: "প্রতিটা Client, প্রতিটা Connection এ। Address Bar এর নামটা এই তালিকায় থাকতে হবে।",
    wrong: "Chrome দেখায় NET::ERR_CERT_COMMON_NAME_INVALID, curl বলে no alternative certificate subject name matches target host name।",
  },
  {
    id: "key",
    name: "Subject Public Key Info",
    value: "id-ecPublicKey, P-256, 256 bit",
    what: "Server এর Public Key। পাসপোর্টের ছবির মতো: এই চাবির জোড়া Private Key যার কাছে আছে, Certificate টা তার।",
    checks: "Handshake এ Server এই চাবির জোড়া দিয়ে একটা সই করে দেখায়। Client এই Public Key দিয়ে সেটা যাচাই করে।",
    wrong: "Server এর কাছে মেলানো Private Key না থাকলে Server চালুই হয় না: key values mismatch।",
  },
  {
    id: "issuer",
    name: "Issuer",
    value: "O=SSL Corporation, CN=Cloudflare TLS Issuing ECC CA 3",
    what: "কোন CA এই Certificate এ সই করেছে। এটা সাধারণত একটা Intermediate, Root নয়।",
    checks: "Client এই নাম ধরে পরের Certificate টা খোঁজে, শিকল বানাতে।",
    wrong: "Issuer কে খুঁজে না পেলে শিকল ভাঙে: unable to get local issuer certificate।",
  },
  {
    id: "validity",
    name: "Validity",
    value: "Not Before Sep 26 22:49:11 2026 GMT, Not After Dec 25 22:56:35 2026 GMT",
    what: "কবে থেকে কবে পর্যন্ত বৈধ। example.com এর এই Certificate টা ঠিক 90 দিনের।",
    checks: "প্রতিটা Client, নিজের যন্ত্রের ঘড়ি দিয়ে।",
    wrong: "মেয়াদ পেরোলে NET::ERR_CERT_DATE_INVALID। ফোনের ঘড়ি ভুল হলেও একই Error, তখন Server নির্দোষ।",
  },
  {
    id: "constraints",
    name: "Basic Constraints",
    value: "critical, CA:FALSE",
    what: "এই Certificate নিজে অন্য Certificate এ সই করতে পারবে কি না। Leaf এ সবসময় CA:FALSE, Intermediate আর Root এ CA:TRUE।",
    checks: "শিকলের প্রতিটা ধাপে। একটা সাধারণ সাইটের Certificate দিয়ে কেউ যেন নিজে CA সেজে বসতে না পারে।",
    wrong: "CA:FALSE এমন কারো সই করা Certificate কে Client বাতিল করে দেয়।",
  },
  {
    id: "usage",
    name: "Key Usage, Extended Key Usage",
    value: "Digital Signature; TLS Web Server Authentication",
    what: "চাবিটা কোন কাজে ব্যবহার করা যাবে। এখানে বলা আছে শুধু সই করা, আর শুধু Web Server হিসেবে।",
    checks: "Client, যাতে Email সই করার একটা Certificate দিয়ে কেউ Web Server সাজতে না পারে।",
    wrong: "কাজ না মিললে Client Certificate টা মানে না।",
  },
  {
    id: "aia",
    name: "Authority Information Access, CRL Distribution Points",
    value: "CA Issuers http://i.cf-i.ssl.com/..., CRL http://c.cf-i.ssl.com/....crl",
    what: "Issuer এর Certificate কোথায় পাওয়া যাবে, আর বাতিল তালিকা কোথায় রাখা আছে।",
    checks: "কিছু Browser হারানো Intermediate এই ঠিকানা থেকে নিজে এনে নেয়। বাতিল তালিকা দেখা Browser ভেদে আলাদা।",
    wrong: "এই ঠিকানার উপর ভরসা করে Intermediate না পাঠালে curl, Node আর অনেক App ব্যর্থ হয়।",
  },
  {
    id: "sct",
    name: "CT Precertificate SCTs",
    value: "দুইটা Signed Certificate Timestamp, দুইটা আলাদা Log থেকে",
    what: "রসিদ, যে এই Certificate টা প্রকাশ্য Certificate Transparency Log এ লেখা হয়েছে। লুকিয়ে কোনো Certificate বানানো যায় না।",
    checks: "Chrome আর Safari। রসিদ না থাকলে প্রকাশ্য Certificate মানে না।",
    wrong: "রসিদ ছাড়া প্রকাশ্য Certificate কে Chrome বাতিল করে। আর আপনি crt.sh এ নিজের Domain খুঁজে দেখতে পারেন কে কবে কোন Certificate নিয়েছে।",
  },
  {
    id: "signature",
    name: "Signature Algorithm, Signature Value",
    value: "ecdsa-with-SHA256, Issuer এর সই",
    what: "উপরের সব ঘরের উপর Issuer এর সই। এই সইটাই পুরো কাগজটাকে জাল করার অযোগ্য করে।",
    checks: "Client, Issuer এর Public Key দিয়ে। Issuer এর Public Key আসে শিকলের পরের Certificate থেকে।",
    wrong: "একটা অক্ষর বদলালেও সই মেলে না, আর Certificate টা অচল।",
  },
] as const;

export function CertFieldLab() {
  const [active, setActive] = useState<(typeof CERT_FIELDS)[number]["id"]>("san");
  const field = CERT_FIELDS.find((f) => f.id === active) ?? CERT_FIELDS[0];

  return (
    <Panel
      label="Interactive"
      title="example.com এর Certificate, ঘর ধরে ধরে"
      footer="মানগুলো openssl x509 -noout -text দিয়ে example.com এর আসল Certificate থেকে পড়া, অক্টোবর 2026 এ। প্রতিটা ঘরে তিনটা জিনিস দেখুন: ঘরটায় কী লেখা, কে সেটা মিলিয়ে দেখে, আর ভুল হলে কী Error আসে। শেষ ঘরটা আলাদা করে মনে রাখবেন, কারণ বাকি সব ঘরের বিশ্বাসযোগ্যতা ওই একটা সইয়ের উপর দাঁড়িয়ে।"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {CERT_FIELDS.map((f) => (
          <Chip key={f.id} active={f.id === active} onClick={() => setActive(f.id)} data-field={f.id}>
            {f.name}
          </Chip>
        ))}
      </div>
      <div className="border border-border bg-background" data-active-field={field.id}>
        <div className="px-4 py-3 border-b border-border">
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            example.com এ লেখা
          </div>
          <div className="font-mono text-[0.8125rem] font-bold text-primary break-all">{field.value}</div>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            { term: "এটা কী", body: field.what },
            { term: "কে মিলিয়ে দেখে", body: field.checks },
            { term: "ভুল হলে", body: field.wrong },
          ].map((row) => (
            <div key={row.term} className="px-4 py-3">
              <dt className="text-[0.625rem] font-bold text-foreground mb-1">{row.term}</dt>
              <dd className="text-[0.8125rem] text-muted-foreground leading-relaxed">{row.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Browser এর আটটা যাচাই, আটটা পরিস্থিতিতে                                     */
/* ------------------------------------------------------------------------- */

const CHECKS = [
  { id: "chain", name: "শিকল Trust Store এর একটা Root এ পৌঁছায়" },
  { id: "signatures", name: "শিকলের প্রতিটা সই মেলে" },
  { id: "name", name: "Address Bar এর নামটা SAN এ আছে" },
  { id: "dates", name: "আজকের তারিখ মেয়াদের ভেতরে" },
  { id: "usage", name: "কাজটা অনুমোদিত: Leaf এ CA:FALSE আর Web Server" },
  { id: "revocation", name: "বাতিল তালিকায় নেই" },
  { id: "ct", name: "প্রকাশ্য Log এর রসিদ আছে" },
  { id: "possession", name: "Server এর কাছে মেলানো Private Key আছে" },
] as const;

type CheckId = (typeof CHECKS)[number]["id"];

const SCENARIOS: {
  id: string;
  label: string;
  setup: string;
  failsAt: CheckId | null;
  browser: string;
  curl: string;
  node: string;
  lesson: string;
}[] = [
  {
    id: "healthy",
    label: "সব ঠিক",
    setup: "পর্যটক খুললেন https://islandtours.example। Caddy পাঠাল Let's Encrypt এর দেওয়া Leaf আর Intermediate, মেয়াদ বাকি অনেক দিন।",
    failsAt: null,
    browser: "তালার চিহ্ন, পাতা খোলে",
    curl: "HTTP/2 200",
    node: "কোনো Error নেই",
    lesson: "আটটা যাচাইয়ের প্রতিটা পার হলো, তাই Browser নিশ্চিত যে সে আসল islandtours.example এর সাথে কথা বলছে।",
  },
  {
    id: "self-signed",
    label: "Self-signed",
    setup: "এই লেসনের Lab এর localhost Server, যার Certificate সে নিজেই সই করেছে।",
    failsAt: "chain",
    browser: "NET::ERR_CERT_AUTHORITY_INVALID (Chrome), MOZILLA_PKIX_ERROR_SELF_SIGNED_CERT (Firefox)",
    curl: "SSL certificate problem: self signed certificate",
    node: "DEPTH_ZERO_SELF_SIGNED_CERT",
    lesson: "এনক্রিপশন ঠিকই চলত, কিন্তু কেউ এই পরিচয়ের জামিন হয়নি। যে কেউ নিজের নামে নিজে সই করতে পারে, তাই Browser এটা মানে না।",
  },
  {
    id: "missing-intermediate",
    label: "Intermediate বাদ",
    setup: "কেউ Server এ fullchain.pem এর বদলে শুধু cert.pem বসিয়েছেন। Server পাঠাচ্ছে শুধু Leaf।",
    failsAt: "chain",
    browser: "Desktop Chrome অনেক সময় AIA ঠিকানা থেকে নিজে খুঁজে নেয়, তাই আপনার Browser এ ঠিক দেখায়। অন্য জায়গায় NET::ERR_CERT_AUTHORITY_INVALID",
    curl: "SSL certificate problem: unable to get local issuer certificate",
    node: "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    lesson: "Leaf এ সই করেছে Intermediate, কিন্তু Intermediate টা হাতে নেই, তাই Root পর্যন্ত পৌঁছানো গেল না। সবচেয়ে প্রতারক ভুল, কারণ নিজের Browser এ সব ঠিক দেখায়।",
  },
  {
    id: "wrong-name",
    label: "ভুল নাম",
    setup: "পর্যটক খুললেন https://admin.islandtours.example, কিন্তু Server পাঠাল islandtours.example আর www এর Certificate।",
    failsAt: "name",
    browser: "NET::ERR_CERT_COMMON_NAME_INVALID (Chrome), SSL_ERROR_BAD_CERT_DOMAIN (Firefox)",
    curl: "SSL: no alternative certificate subject name matches target host name",
    node: "ERR_TLS_CERT_ALTNAME_INVALID",
    lesson: "Certificate টা আসল, শিকল ঠিক, কিন্তু অন্য নামের। পাসপোর্ট খাঁটি, কিন্তু অন্য মানুষের।",
  },
  {
    id: "expired",
    label: "মেয়াদ শেষ",
    setup: "নবায়নের Job তিন সপ্তাহ ধরে চুপচাপ ব্যর্থ হচ্ছিল, কেউ খেয়াল করেনি। আজ Not After পেরিয়ে গেছে।",
    failsAt: "dates",
    browser: "NET::ERR_CERT_DATE_INVALID (Chrome), SEC_ERROR_EXPIRED_CERTIFICATE (Firefox)",
    curl: "SSL certificate problem: certificate has expired",
    node: "CERT_HAS_EXPIRED",
    lesson: "বাস্তবে সবচেয়ে বেশি Outage এর কারণ এটাই। সমাধান শুধু নবায়ন নয়, নবায়ন ব্যর্থ হলে কেউ যেন জানতে পারে সেই ব্যবস্থা।",
  },
  {
    id: "wrong-clock",
    label: "ফোনের ঘড়ি ভুল",
    setup: "পর্যটকের ফোনের তারিখ কোনো কারণে 2024 সালে আটকে আছে। Certificate এর Not Before তো 2026।",
    failsAt: "dates",
    browser: "NET::ERR_CERT_DATE_INVALID, সাথে Your clock is behind ধরনের বার্তা",
    curl: "SSL certificate problem: certificate is not yet valid",
    node: "CERT_NOT_YET_VALID",
    lesson: "Server এ কোনো দোষ নেই। শুধু এই একজনের যন্ত্রে সমস্যা, আর সারাতে হবে তাঁর ঘড়ি।",
  },
  {
    id: "revoked",
    label: "বাতিল করা",
    setup: "Private Key ফাঁস হয়েছিল, তাই Island Tours পুরনো Certificate টা বাতিল করেছে। একটা পুরনো Server এখনো সেটা পাঠাচ্ছে।",
    failsAt: "revocation",
    browser: "NET::ERR_CERT_REVOKED, যদি Browser এর বাতিল তালিকায় ইতিমধ্যে উঠে থাকে",
    curl: "সাধারণত কোনো Error নেই, curl নিজে থেকে বাতিল তালিকা দেখে না",
    node: "কোনো Error নেই, Node নিজে থেকে বাতিল তালিকা দেখে না",
    lesson: "বাতিল করা কাগজে কলমে আছে, বাস্তবে দুর্বল। অনেক Client দেখেই না। এই কারণেই Certificate এর আয়ু ছোট করা হচ্ছে।",
  },
  {
    id: "copied",
    label: "চুরি করা Certificate",
    setup: "প্রতারক islandtours.example এর Certificate টা কপি করে নিজের Laptop এ বসাল। Certificate তো প্রকাশ্য, যে কেউ কপি করতে পারে। কিন্তু Private Key তার কাছে নেই।",
    failsAt: "possession",
    browser: "Handshake মাঝপথে ভাঙে, ERR_SSL_PROTOCOL_ERROR ধরনের Error",
    curl: "Handshake ব্যর্থ, Connection বন্ধ",
    node: "প্রতারকের Server চালুই হয় না: ERR_OSSL_X509_KEY_VALUES_MISMATCH",
    lesson: "প্রথম সাতটা যাচাই পার হয়ে গেছে, কারণ কাগজটা আসল। কিন্তু Handshake এ Server কে Private Key দিয়ে একটা সই করে দেখাতে হয়, লেসন ০৭ এর CertificateVerify। চাবি ছাড়া সেটা অসম্ভব।",
  },
];

type CheckStatus = "pass" | "fail" | "skip" | "hidden";

function statusFor(index: number, failIndex: number, revealed: number): CheckStatus {
  if (index >= revealed) return "hidden";
  if (failIndex === -1 || index < failIndex) return "pass";
  if (index === failIndex) return "fail";
  return "skip";
}

export function ValidationLab() {
  const [scenarioId, setScenarioId] = useState<string>("healthy");
  const [revealed, setRevealed] = useState(0);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const failIndex = scenario.failsAt === null ? -1 : CHECKS.findIndex((c) => c.id === scenario.failsAt);
  const stopAt = failIndex === -1 ? CHECKS.length : failIndex + 1;
  const done = revealed >= stopAt;

  function choose(id: string) {
    setScenarioId(id);
    setRevealed(0);
  }

  return (
    <Panel
      label="Interactive"
      title="Browser একটা Certificate কে যেভাবে পরীক্ষা করে"
      footer="একটা পরিস্থিতি বেছে নিন, তারপর এক এক করে যাচাইগুলো চালান। প্রথম যেটা ব্যর্থ হয়, Browser সেখানেই থেমে যায় আর পুরো পাতা জুড়ে সতর্কবার্তা দেখায়, বাকিগুলো আর দেখেই না। নিচে তিনটা Client এর আসল Error এর লেখা দেওয়া আছে। curl আর Node এর লেখাগুলো এই লেসনের Lab এ চালিয়ে পাওয়া। যাচাইয়ের ক্রমটা বোঝার সুবিধার জন্য সাজানো, আসল Browser এর ভেতরের ক্রম একটু আলাদা হতে পারে, কিন্তু আটটা প্রশ্ন এগুলোই।"
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {SCENARIOS.map((s) => (
          <Chip key={s.id} active={s.id === scenarioId} onClick={() => choose(s.id)} data-scenario={s.id}>
            {s.label}
          </Chip>
        ))}
      </div>

      <p className="text-[0.8125rem] text-muted-foreground leading-relaxed mb-5">{scenario.setup}</p>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setRevealed((r) => Math.min(stopAt, r + 1))}
          disabled={done}
          data-action="next-check"
          className={cn(
            "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            done ? "border-border text-muted-foreground/40" : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          পরের যাচাই
        </button>
        <button
          onClick={() => setRevealed(stopAt)}
          disabled={done}
          data-action="all-checks"
          className={cn(
            "px-3 py-1.5 border text-[0.6875rem] font-bold transition-colors",
            done ? "border-border text-muted-foreground/40" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
          )}
        >
          সব একবারে
        </button>
        <button
          onClick={() => setRevealed(0)}
          aria-label="Reset"
          className="inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className="font-mono text-[0.625rem] text-muted-foreground">
          যাচাই {toBn(Math.min(revealed, CHECKS.length))} / {toBn(CHECKS.length)}
        </span>
      </div>

      <ol className="space-y-1.5 mb-6">
        {CHECKS.map((check, i) => {
          const status = statusFor(i, failIndex, revealed);
          return (
            <li
              key={check.id}
              data-check={check.id}
              data-status={status}
              className={cn(
                "flex items-center gap-3 border px-3 py-2 transition-colors",
                status === "fail" ? "border-primary bg-primary/10" : "border-border",
                status === "hidden" && "opacity-40",
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center w-5 h-5 border shrink-0",
                  status === "pass" && "border-primary/60 text-primary",
                  status === "fail" && "border-primary bg-primary text-primary-foreground",
                  (status === "skip" || status === "hidden") && "border-border text-muted-foreground",
                )}
              >
                {status === "pass" && <Check className="w-3 h-3" />}
                {status === "fail" && <X className="w-3 h-3" />}
                {status === "skip" && <Minus className="w-3 h-3" />}
              </span>
              <span className="font-mono text-[0.625rem] text-muted-foreground w-4 shrink-0">{toBn(i + 1)}</span>
              <span className="text-[0.8125rem] text-foreground">{check.name}</span>
              {status === "skip" && (
                <span className="ml-auto text-[0.6875rem] text-muted-foreground">দেখাই হয়নি</span>
              )}
            </li>
          );
        })}
      </ol>

      <div
        className={cn("grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 transition-opacity", done ? "opacity-100" : "opacity-30")}
        data-outcome={done ? scenario.id : ""}
      >
        {[
          { who: "Browser দেখায়", text: scenario.browser },
          { who: "curl বলে", text: scenario.curl },
          { who: "Node এর Error code", text: scenario.node },
        ].map((row) => (
          <div key={row.who} className="border border-border bg-background px-4 py-3 min-w-0">
            <div className="text-[0.625rem] text-muted-foreground mb-1">{row.who}</div>
            <div className="font-mono text-[0.75rem] text-foreground break-words">{row.text}</div>
          </div>
        ))}
      </div>
      <p className={cn("text-[0.8125rem] leading-relaxed transition-opacity", done ? "text-foreground opacity-100" : "opacity-0")}>
        {scenario.lesson}
      </p>
    </Panel>
  );
}
