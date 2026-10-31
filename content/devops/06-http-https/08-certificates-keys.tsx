/**
 * What: Module 06 Lesson 08, Certificates, Public Key and Private Key. It teaches key pairs,
 * digital signatures, what a certificate holds, CAs and the chain of trust, how a browser
 * validates a certificate, Let's Encrypt and ACME, revocation and shrinking lifetimes, how
 * to protect a private key, the file formats, and how to install a certificate from
 * localhost to production.
 *
 * Why: Lesson 07 showed how HTTPS keeps a conversation secret, but not how a browser knows
 * who is on the other side. This lesson closes that gap with real commands run against
 * example.com and a toy CA built on the reader's own machine, so every claim can be seen.
 */
import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import {
  CertFieldLab,
  SignatureLab,
  ValidationLab,
} from "../../../components/course/topics/http/cert-animations";
import {
  AcmeFlowDiagram,
  CertAnatomyDiagram,
  ChainOfTrustDiagram,
  EncryptVsSignSplit,
  ImpostorDiagram,
  KeyPairDiagram,
  LifetimeTimelineDiagram,
  SignatureFlowDiagram,
} from "../../../components/course/topics/http/cert-diagrams";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

const linkClass = "text-primary underline underline-offset-4";

export const certificatesKeysContent: TopicData = {
  id: "certificates-keys",
  introduction: {
    badge: "MODULE 06 · LESSON 08",
    title: <SectionTitle>তালার চিহ্নের পেছনে কে জামিন হয়ে আছে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          শীতের এক সকালে একজন পর্যটক টেকনাফের জেটির পাশের একটা ক্যাফেতে বসে আছেন।
          Saint Martin এর জাহাজ ছাড়তে এখনো এক ঘণ্টা। দেয়ালে লেখা Teknaf Jetty
          Free WiFi, তিনি যুক্ত হলেন, আর ফোনে islandtours.example খুলে নিজের
          বুকিংটা আরেকবার দেখতে চাইলেন। পাতা খুলল না। তার জায়গায় পুরো পর্দা জুড়ে
          একটা সতর্কবার্তা এলো: আপনার Connection টা Private নয়।
        </ContentParagraph>
        <ContentParagraph>
          আগের লেসনে আপনি দেখেছেন HTTPS কীভাবে একটা Handshake দিয়ে দুই পাশের মাঝে
          একটা গোপন চাবি বানায়, যাতে পথের কেউ কিছু পড়তে না পারে। কিন্তু একটা
          প্রশ্ন সেখানে খোলা রেখে আসা হয়েছিল। গোপন চাবিটা তো তৈরি হলো, কিন্তু কার
          সাথে? ক্যাফের Wi-Fi টা যদি একজন প্রতারকের হয়, আর প্রতারক নিজেই
          islandtours.example সেজে Handshake করে, তাহলে এনক্রিপশন নিখুঁত থাকবে,
          অথচ পর্যটক গোপন কথা বলবেন ভুল মানুষের সাথে। Browser ঠিক এটাই ধরেছে।
          Browser কীভাবে ধরল, সেটাই এই লেসন।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন Public Key আর Private Key আসলে কী, একটা
          Digital Signature কীভাবে কাজ করে, একটা Certificate এর ভেতরে কী লেখা
          থাকে, CA কারা আর Chain of Trust কীভাবে একটা অচেনা Server কে বিশ্বাসযোগ্য
          করে, Browser ঠিক কোন আটটা জিনিস মিলিয়ে দেখে, Let&apos;s Encrypt কীভাবে
          বিনা পয়সায় আর কোনো মানুষ ছাড়াই Certificate দেয়, Certificate এর আয়ু কেন
          ছোট হয়ে আসছে, আর Private Key নামের সবচেয়ে দামি ফাইলটা কীভাবে রক্ষা করতে
          হয়। আর হাতে কলমে আপনি নিজের যন্ত্রে একটা ছোট CA বানাবেন, Certificate
          বানাবেন, ইচ্ছা করে ভাঙবেন, তারপর আবার সারাবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "পাসপোর্টে নাম আর ছবি যে কেউ ছাপাতে পারে। ইমিগ্রেশনের কর্মকর্তা ভরসা করেন সরকারের সিলমোহরে, যা জাল করা যায় না। Certificate হলো Internet এর পাসপোর্ট, আর CA হলো সেই সরকার, যার সিল আপনার Browser আগে থেকেই চেনে।",
      author: "Certificate",
      role: "Lesson 08",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "who-are-you",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>এনক্রিপশন বলে কথাটা গোপন, বলে না কার সাথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসন ০৭ এর Handshake টা একবার মনে করি। ফোন আর Server দুইজনে মিলে
                Key Exchange করে, রং মেশানোর সেই খেলার মতো, আর শেষে দুইজনের হাতে
                একই গোপন চাবি থাকে যা পথের কেউ জানে না। এরপর প্রতিটা Byte সেই চাবি
                দিয়ে বন্ধ হয়ে যায়। বাসার Router, ISP, সমুদ্রের নিচের তার, কেউ আর
                ভেতরে কী আছে পড়তে পারে না।
              </ContentParagraph>
              <ContentParagraph>
                ফাঁদটা হলো, Key Exchange যে কারো সাথেই করা যায়। রং মেশানোর খেলা
                প্রতারকও খেলতে পারে। প্রতারক যদি পথের মাঝখানে বসে islandtours.example
                এর হয়ে উত্তর দেয়, তাহলে সে পর্যটকের ফোনের সাথে একটা Handshake করে,
                আর আসল Server এর সাথে আরেকটা। দুইটাই নিখুঁত, দুইটাই এনক্রিপ্টেড।
                মাঝখানে বসে সে এক দিক থেকে খোলে, পড়ে, দরকার হলে বদলায়, আবার বন্ধ
                করে অন্য দিকে পাঠায়। এই আক্রমণের নাম Man in the Middle।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ImpostorDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতারক মাঝখানে ঢোকে কীভাবে? আপনি আগের মডিউলগুলোতেই রাস্তাগুলো দেখে
                এসেছেন। একটা ভুয়া Wi-Fi নিজেই DHCP Server হয়, তাই সে ফোনকে নিজের
                পছন্দের DNS Resolver ধরিয়ে দিতে পারে (Module 03 এর DHCP লেসন)।
                সেই Resolver islandtours.example এর জন্য 103.94.135.2 এর বদলে
                প্রতারকের নিজের ঠিকানা বলে দেয় (Module 04)। একই Wi-Fi তে থাকা কেউ
                ARP দিয়ে নিজেকে Gateway বলে চালিয়ে দিতে পারে (Module 03 এর ARP
                লেসন)। মোট কথা, Network এর রাস্তাকে কখনো বিশ্বাস করা যায় না।
              </ContentParagraph>
              <ContentParagraph>
                লেসন ০৭ এ HTTPS এর তিনটা প্রতিশ্রুতির কথা বলা হয়েছিল। এই লেসনে
                দেখব তিন নম্বরটা কোথা থেকে আসে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Confidentiality, গোপনীয়তা:</strong> পথের কেউ পড়তে পারবে
                  না। আসে Key Exchange থেকে পাওয়া গোপন চাবি থেকে।
                </ListItem>
                <ListItem>
                  <strong>Integrity, অখণ্ডতা:</strong> পথে কেউ একটা Byte বদলালে ধরা
                  পড়বে। এটাও আসে সেই গোপন চাবি থেকে।
                </ListItem>
                <ListItem>
                  <strong>Authentication, পরিচয়ের প্রমাণ:</strong> যে উত্তর দিচ্ছে,
                  সে সত্যিই islandtours.example। এটা গোপন চাবি দিতে পারে না। এটা
                  আসে এই লেসনের তিনটা জিনিস থেকে: একজোড়া চাবি, Digital Signature,
                  আর Certificate।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                রোজকার জীবনের একটা উদাহরণ ধরি। আপনার ফোনে একটা Call এলো, ওপাশের
                মানুষটি বলছেন তিনি আপনার Bank থেকে বলছেন। গলা নকল করা যায়, নম্বরও
                নকল করা যায়। একজন সাবধানী মানুষ কী করেন? তিনি ফোন রেখে দিয়ে নিজের
                Card এর পেছনে ছাপা নম্বরে ফোন করেন। মানে এমন একটা রাস্তা ব্যবহার
                করেন, যেটা তিনি এই Call আসার আগে থেকেই বিশ্বাস করতেন। Web এও ঠিক
                তাই হয়। আপনার ফোন কেনার দিন থেকেই তার ভেতরে কয়েকশো বিশ্বস্ত
                প্রতিষ্ঠানের একটা তালিকা ঢোকানো আছে। প্রতিটা অচেনা Server এর পরিচয়
                শেষমেশ সেই তালিকার কারো সই দিয়ে প্রমাণ হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এখানে Authentication মানে Server এর পরিচয়",
          content: (
            <p>
              লেসন ০৬ এ Authentication মানে ছিল একজন ব্যবহারকারী Login করে প্রমাণ
              করেন তিনি কে। এই লেসনে উল্টো দিক: Server প্রমাণ করে সে কে। দুইটা আলাদা
              জিনিস, আর একটা আরেকটার বদলি নয়। ভুয়া Server এর পাতায় পর্যটক Password
              দিয়ে Login করলে Session, JWT সব নিখুঁত থাকলেও Password টা চলে যায়
              প্রতারকের হাতে। তাই ব্যবহারকারীর পরিচয় যাচাইয়ের আগে Server এর পরিচয়
              যাচাই হতে হয়, আর সেটা করে Certificate।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "key-pair",
      subHeader: { index: "002", title: "Key Pair" },
      title: <SectionTitle>এক জোড়া চাবি: যা সবাইকে দেন, আর যা কাউকে দেন না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Certificate বোঝার আগে তার ভিত্তিটা বুঝি। কল্পনা করুন আপনার কাছে এক
                বাক্স খোলা তালা আছে, শত শত, আর সবগুলোর চাবি একটাই, যা থাকে শুধু
                আপনার পকেটে। খোলা তালাগুলো আপনি যাকে খুশি বিলিয়ে দেন। কেউ আপনাকে
                গোপন কিছু পাঠাতে চাইলে একটা বাক্সে রেখে আপনার একটা তালা লাগিয়ে দেয়।
                তালা লাগাতে চাবি লাগে না, শুধু চেপে দিলেই বন্ধ। কিন্তু খুলতে পারেন
                শুধু আপনি।
              </ContentParagraph>
              <ContentParagraph>
                এই খোলা তালাটার নাম <strong>Public Key</strong>, আর পকেটের চাবিটার
                নাম <strong>Private Key</strong>। দুইটা মিলে একটা{" "}
                <strong>Key Pair</strong>। এই ধরনের ব্যবস্থাকে বলে Asymmetric
                Cryptography, কারণ দুই পাশের চাবি আলাদা। লেসন ০৭ এর গোপন চাবিটা ছিল
                Symmetric, দুই পাশে একই চাবি।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <KeyPairDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাস্তবে চাবি দুইটা আসলে দুইটা বিশাল সংখ্যা, যাদের মধ্যে একটা গাণিতিক
                সম্পর্ক আছে। অঙ্কটা জানার দরকার নেই, তিনটা আচরণ জানলেই চলবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা দিয়ে যা করা হয়, শুধু অন্যটা দিয়ে তা খোলা বা যাচাই
                  করা যায়।</strong> Public Key দিয়ে তালা দিলে শুধু Private Key
                  খোলে। Private Key দিয়ে সই করলে শুধু Public Key দিয়ে সেটা মেলে।
                </ListItem>
                <ListItem>
                  <strong>তীরটা একমুখী।</strong> Private Key থেকে Public Key বানানো
                  চোখের পলকের কাজ। Public Key দেখে Private Key বের করতে আজকের সব
                  কম্পিউটার মিলেও কোটি কোটি বছর লাগবে।
                </ListItem>
                <ListItem>
                  <strong>Public Key ছড়ালে কোনো ক্ষতি নেই, Private Key ফাঁস হলে সব
                  শেষ।</strong> যার হাতে Private Key, সে আপনার হয়ে সই করতে পারে, মানে
                  আপনি সাজতে পারে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিজের যন্ত্রে একজোড়া বানিয়ে দেখুন। প্রথম কমান্ড Private Key বানায়,
                দ্বিতীয়টা তার Permission এমন করে যাতে শুধু আপনি পড়তে পারেন, তৃতীয়টা
                Private Key থেকে Public Key বের করে। উল্টো দিকের কোনো কমান্ড নেই,
                কারণ উল্টোটা সম্ভবই নয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "make-a-key-pair.sh",
          code: `# একটা P-256 Private Key বানান
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 -out island.key

# শুধু মালিক পড়তে আর লিখতে পারবেন, আর কেউ না
chmod 600 island.key

# Private Key থেকে Public Key বের করুন
openssl pkey -in island.key -pubout -out island.pub
cat island.pub
# -----BEGIN PUBLIC KEY-----
# MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEL63ozv/AWaLZ2+zxottiSlvXD39A
# qxI3qL0Brf9uu8A9JdwsDnl3HBywWXEW7s3eBGZeS24+clLcrtIkDanVWQ==
# -----END PUBLIC KEY-----
# (আপনার টা আলাদা হবে, প্রতিবার নতুন চাবি তৈরি হয়)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              BEGIN আর END লাইনের মাঝের লেখাটা আসলে চাবির Byte গুলো, Base64 করে
              লেখা যাতে Text হিসেবে Copy করা যায়। এই ফরম্যাটের নাম PEM, সেকশন ০১৩
              তে পুরো ফরম্যাটের গল্প আছে। আর চাবি বানানোর অঙ্ক দুই রকম চালু আছে,
              দুইটাই আপনি চারপাশে দেখবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "RSA", "ECDSA (P-256)"],
          rows: [
            ["কীসের উপর দাঁড়িয়ে", "দুইটা বড় মৌলিক সংখ্যা গুণ করা সহজ, গুণফল ভেঙে ফেরত পাওয়া কার্যত অসম্ভব", "Elliptic Curve এর উপর একটা একমুখী অঙ্ক"],
            ["সাধারণ চাবির আকার", mono("2048 বা 3072 bit"), mono("256 bit")],
            ["একটা সইয়ের আকার", mono("256 Byte (2048 bit চাবিতে)"), mono("প্রায় 64 থেকে 72 Byte")],
            ["গতি", "সই ধীর, যাচাই দ্রুত", "সই দ্রুত, Handshake এ কম Byte"],
            ["কোথায় দেখবেন", "পুরনো Server, অনেক Root CA, খুব পুরনো যন্ত্রের সাথে মেলাতে", "example.com এর Certificate, Caddy এর Default, আজকের বেশিরভাগ নতুন Certificate"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Ed25519 এর নাম শুনলে",
          content: (
            <p>
              Ed25519 নামে আরেকটা আধুনিক, দ্রুত চাবির ধরন আছে। SSH এ আপনি এটাই
              ব্যবহার করবেন, Module 07 এ দেখবেন। কিন্তু প্রকাশ্য Web Certificate এর
              নিয়মে এখনো শুধু RSA আর ECDSA চলে, তাই কোনো CA Ed25519 এর Web
              Certificate দেয় না। Caddy এর Setting এ ed25519 লেখার সুযোগ থাকলেও
              প্রকাশ্য সাইটের জন্য p256 ই রাখুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "encrypt-vs-sign",
      subHeader: { index: "003", title: "Encrypt vs Sign" },
      title: <SectionTitle>একই চাবিজোড়ার দুই কাজ: তালা দেওয়া আর সই করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                খোলা তালার গল্পটা চাবিজোড়ার প্রথম কাজ: <strong>Encrypt</strong>।
                যে কেউ Public Key দিয়ে তালা দেয়, শুধু Private Key এর মালিক খোলেন।
                ফল হলো গোপনীয়তা।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় কাজটা উল্টো দিকে: <strong>Sign</strong>। এবার ভাবুন আপনার
                একটা সিলমোহর আছে, যা পৃথিবীতে শুধু আপনার কাছে। আপনি একটা কাগজে সিল
                দিলেন। যে কেউ সেই সিলের একটা ছবি হাতে নিয়ে মিলিয়ে দেখতে পারে
                কাগজের সিলটা আসল কি না, কিন্তু ছবি দেখে নতুন সিল বানাতে পারে না।
                Private Key হলো সিলমোহর, Public Key হলো সিলের ছবি। ফল হলো প্রমাণ:
                কে লিখেছে, আর কাগজটা পথে বদলায়নি।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <EncryptVsSignSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে একটা প্রচলিত ভুল ধারণা ভাঙা দরকার। অনেক পুরনো Blog আর ভিডিওতে
                বলা হয়, Browser Server এর Public Key দিয়ে Session এর চাবি Encrypt
                করে পাঠায়। TLS 1.2 পর্যন্ত RSA দিয়ে সত্যিই এভাবে হতো। সমস্যা ছিল,
                কেউ যদি বছরের পর বছর Traffic রেকর্ড করে রাখে, আর পরে কোনোদিন
                Server এর Private Key চুরি করতে পারে, তাহলে সব পুরনো Traffic খুলে
                পড়া যেত। TLS 1.3 এই পদ্ধতি পুরোপুরি বাদ দিয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                আজকের HTTPS এ গোপন চাবিটা আসে ECDHE Key Exchange থেকে, প্রতি
                Connection এ নতুন, যা লেসন ০৭ এ দেখেছেন। Certificate এর চাবি দিয়ে
                শুধু সই করা হয়। Handshake এর সময় Server এখন পর্যন্ত হওয়া পুরো
                আলাপের উপর নিজের Private Key দিয়ে একটা সই করে পাঠায়, যার নাম
                CertificateVerify। ফোন Certificate এর ভেতরের Public Key দিয়ে সেটা
                মিলিয়ে দেখে। মিললে প্রমাণ হলো, এই Key Exchange টা যে করল তার কাছে
                ওই Certificate এর Private Key আছে। এই একটা সই-ই লেসন ০৭ এর নামহীন
                গোপন চাবিটাকে islandtours.example নামের সাথে বেঁধে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                সই করার ব্যবহার এখানেই শেষ নয়। আপনি এটা বহু জায়গায় দেখবেন, কখনো নাম
                না জেনেই।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা Certificate:</strong> CA তার Private Key দিয়ে
                  আপনার Certificate এ সই করে। এই লেসনের বাকিটা এটা নিয়েই।
                </ListItem>
                <ListItem>
                  <strong>JWT এর ES256 আর RS256:</strong> লেসন ০৬ এ দেখা Token এর
                  তৃতীয় অংশটা ঠিক এই ধরনের সই।
                </ListItem>
                <ListItem>
                  <strong>Software Update আর Package:</strong> Operating System এর
                  Update, Android আর iPhone এর App, npm এর Package Provenance, সবই
                  সই করা থাকে, যাতে মাঝপথে কেউ ভাইরাস ঢোকাতে না পারে।
                </ListItem>
                <ListItem>
                  <strong>Git Commit:</strong> চাইলে প্রতিটা Commit সই করা যায়, যাতে
                  প্রমাণ থাকে Code টা আসলে কে লিখেছেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "HS256 আর ES256, লেসন ০৬ এর সাথে মিলিয়ে",
          content: (
            <p>
              লেসন ০৬ এর HS256 একটা ভাগ করা গোপন কথা (Secret) দিয়ে HMAC বানায়। যে
              যাচাই করতে পারে, সে একই Secret দিয়ে নতুন Token বানাতেও পারে। একই Server
              Token দেয় আর যাচাই করে, এমন ক্ষেত্রে এটা ঠিক আছে। ES256 আর RS256 চলে
              Key Pair দিয়ে: শুধু একজন সই করতে পারে, হাজারজন যাচাই করতে পারে, কিন্তু
              কেউ নকল করতে পারে না। Certificate এর ক্ষেত্রে দ্বিতীয়টাই একমাত্র উপায়,
              কারণ কোটি কোটি Browser যাচাই করে, আর তাদের কারো হাতেই যেন নকল করার
              ক্ষমতা না থাকে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "digital-signature",
      subHeader: { index: "004", title: "Digital Signature" },
      title: <SectionTitle>Digital Signature: আগে Hash, তারপর সই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সই আসলে কীভাবে হয়, ধাপে ধাপে দেখি। প্রথম ধাপে লাগে একটা{" "}
                <strong>Hash</strong>। Hash হলো একটা যন্ত্র, যা যেকোনো আকারের তথ্য
                নিয়ে নির্দিষ্ট আকারের একটা আঙুলের ছাপ বানায়। SHA-256 নামের Hash
                সবসময় ৩২ Byte এর ছাপ দেয়, তথ্যটা এক লাইনের হোক বা দুই GB এর। এর
                চারটা আচরণ মনে রাখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>একই তথ্য দিলে প্রতিবার, প্রতিটা যন্ত্রে, হুবহু একই ছাপ।</ListItem>
                <ListItem>
                  তথ্যের একটা Bit বদলালেও ছাপটা পুরো বদলে যায়, কাছাকাছিও থাকে না।
                </ListItem>
                <ListItem>ছাপ দেখে আসল তথ্য ফেরত বানানো যায় না।</ListItem>
                <ListItem>
                  একই ছাপের দুইটা আলাদা তথ্য খুঁজে বের করা কার্যত অসম্ভব।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচে Island Tours এর একটা বুকিং বার্তার Hash, আর একটা অক্ষর বদলানো
                বার্তার Hash। দুইটা পাশাপাশি রেখে দেখুন, একটা অক্ষরের মিলও খুঁজে
                পাবেন না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "hash-two-messages.sh",
          code: `printf 'booking bk_7Q2M9X confirmed, 2 seats, 2026-12-20\\n' | openssl dgst -sha256
# SHA2-256(stdin)= eedf7a96df0662d836eaca389e89b3f00d03b9aca498ef36b2a65fcf84cf1062

printf 'booking bk_7Q2M9X confirmed, 9 seats, 2026-12-20\\n' | openssl dgst -sha256
# SHA2-256(stdin)= c27e7665c5e7e56ec148674715196f1bf29b5d9ae12191334a55b10a30758e7b`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় ধাপে Private Key এর অঙ্কটা এই ৩২ Byte এর ছাপের উপর চালানো
                হয়, আর যা বের হয় তার নাম <strong>Signature</strong>। পুরো তথ্যের
                উপর সরাসরি না করে আগে Hash কেন? কারণ চাবির অঙ্ক ধীর, আর ছোট জিনিসেই
                চলে। দুই MB এর একটা ফাইলের বদলে ৩২ Byte এ সই করা অনেক দ্রুত, আর Hash
                এর চারটা আচরণের কারণে ফলটা একই রকম নিরাপদ।
              </ContentParagraph>
              <ContentParagraph>
                যাচাই করার সময় Browser নিজে পাওয়া তথ্যের Hash বানায়, তারপর
                Signature আর Public Key নিয়ে দেখে, এই সইটা কি ঠিক এই Hash এর উপর, এই
                Public Key এর জোড়া Private Key দিয়ে করা? উত্তর শুধু হ্যাঁ বা না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SignatureFlowDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Terminal এ পুরো ব্যাপারটা তিন লাইনের। আগের সেকশনের island.key আর
              island.pub দিয়ে একটা বুকিং বার্তায় সই করুন, যাচাই করুন, তারপর বার্তাটা
              বদলে আবার যাচাই করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "sign-and-verify.sh",
          code: `printf 'booking bk_7Q2M9X confirmed, 2 seats, 2026-12-20\\n' > booking.txt

# Private Key দিয়ে সই, ফলটা booking.sig ফাইলে
openssl dgst -sha256 -sign island.key -out booking.sig booking.txt
ls -l booking.sig
# -rw-r--r--  1 you  staff  71 Oct 31 12:28 booking.sig     (70 থেকে 72 Byte)

# Public Key দিয়ে যাচাই
openssl dgst -sha256 -verify island.pub -signature booking.sig booking.txt
# Verified OK

# কেউ 2 seats বদলে 9 seats করল
printf 'booking bk_7Q2M9X confirmed, 9 seats, 2026-12-20\\n' > booking.txt
openssl dgst -sha256 -verify island.pub -signature booking.sig booking.txt
# ...error:030000EA:digital envelope routines:EVP_DigestVerifyFinal:provider signature failure...
# Verification failure`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একই জিনিস আপনার Browser এর ভেতরে, কোনো Terminal ছাড়া। নিচের
              Lab টা প্রতিবার সত্যিকারের চাবি বানায় আর সত্যিকারের সই করে। বার্তার
              শেষে একটা Space যোগ করেও দেখুন, মানুষের চোখে যা কোনো বদলই নয়।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SignatureLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab এ প্রতারকের চাবি দিয়ে যাচাই করে যা দেখলেন, সেটাই পরের সেকশনের
                দরজা। একটা সই প্রমাণ করে যে এই Private Key এর মালিক ঠিক এই Byte
                গুলোতে সই করেছে। কিন্তু মালিকটা কে, সেটা সই বলে না। প্রতারকও
                একজোড়া চাবি বানিয়ে তার নাম দিতে পারে Island Tours। সইটা তখনও নিখুঁত
                মিলবে, শুধু ভুল মানুষের।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সই করা মানে গোপন করা নয়",
          content: (
            <p>
              উপরের booking.txt সই করার পরেও যে কেউ খুলে পড়তে পারে। সই শুধু বলে কে
              লিখেছে আর বদলায়নি, লুকায় না কিছুই। লেসন ০৬ এর JWT এর ক্ষেত্রেও একই
              কথা: Payload টা Base64url এ লেখা, যে কেউ পড়তে পারে। তাই সই করা Token
              বা বার্তায় কখনো Password বা গোপন কিছু রাখবেন না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "why-certificate",
      subHeader: { index: "005", title: "Why Certificates" },
      title: <SectionTitle>শুধু Public Key দিয়ে কেন চলে না, আর Certificate কী সমাধান করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ক্যাফেতে ফিরে যাই। ধরুন Handshake এর সময় Server শুধু নিজের Public
                Key পাঠাত, সাথে একটা বাক্য: এটা islandtours.example এর চাবি। প্রতারকও
                ঠিক এটাই পাঠাতে পারত, নিজের Public Key আর একই বাক্য। Public Key একটা
                সংখ্যা মাত্র, তার গায়ে কারো নাম খোদাই করা থাকে না। ফোন তখন প্রতারকের
                সই নিখুঁতভাবে যাচাই করত, প্রতারকের চাবি দিয়ে, আর খুশি মনে বুকিং এর
                তথ্য তুলে দিত।
              </ContentParagraph>
              <ContentParagraph>
                দরকার এমন কেউ, যাকে ফোন আগে থেকেই বিশ্বাস করে, আর যে লিখিতভাবে জামিন
                হবে: এই Public Key টা islandtours.example এর, আমি যাচাই করে দেখেছি।
                সেই লিখিত জামিননামা, জামিনদারের সই সহ, এটাই{" "}
                <strong>Certificate</strong>। আর জামিনদারের নাম{" "}
                <strong>Certificate Authority</strong>, সংক্ষেপে{" "}
                <strong>CA</strong>।
              </ContentParagraph>
              <ContentParagraph>
                পাসপোর্টের সাথে মিলিয়ে দেখলে পুরো ব্যাপারটা সহজ হয়ে যায়। বিমানবন্দরের
                কর্মকর্তা আপনাকে চেনেন না। তিনি চেনেন সরকারের সিলমোহর আর পাসপোর্টের
                নিরাপত্তা চিহ্ন। পাসপোর্টে আপনার নাম আর ছবি আছে, সরকার সেগুলোর জামিন
                হয়েছে, তাই কর্মকর্তা আপনার নাম বিশ্বাস করেন। তারপর তিনি ছবির সাথে
                আপনার মুখ মেলান, কারণ চুরি করা পাসপোর্ট হাতে নিয়ে অন্য কেউ দাঁড়াতে
                পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পাসপোর্টে", "Certificate এ", "কে মেলায়"],
          rows: [
            ["নাম", "Subject Alternative Name: islandtours.example", "Browser, Address Bar এর নামের সাথে"],
            ["ছবি", "Public Key", "Browser, Handshake এর সইয়ের সাথে"],
            ["ইস্যু করা দপ্তর", "Issuer: যে CA সই করেছে", "Browser, নিজের বিশ্বস্ত তালিকার সাথে"],
            ["মেয়াদ", "Validity: Not Before আর Not After", "Browser, নিজের ঘড়ির সাথে"],
            ["সরকারের সিলমোহর", "CA এর Digital Signature", "Browser, CA এর Public Key দিয়ে"],
            ["মুখের সাথে ছবি মেলানো", "CertificateVerify: Server নিজের Private Key দিয়ে সই করে দেখায়", "Browser, Certificate এর Public Key দিয়ে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ লাইনটা সবচেয়ে গুরুত্বপূর্ণ, আর এটা একটা বড় প্রশ্নের উত্তর দেয়।
                Certificate তো প্রতিটা Visitor এর কাছে পাঠানো হয়, তাহলে প্রতারক কি
                islandtours.example এর Certificate টা কপি করে নিজের Laptop এ বসাতে
                পারে না? পারে, কপি করা খুব সহজ, একটা openssl কমান্ডেই হয়। কিন্তু
                তাতে কোনো লাভ নেই। Handshake এ তাকে সেই Certificate এর Public Key এর
                জোড়া Private Key দিয়ে সই করে দেখাতে হবে, আর সেই চাবি আছে শুধু
                103.94.135.2 এর ভেতরে। মুখ না মিললে চুরি করা পাসপোর্ট অচল।
              </ContentParagraph>
              <ContentParagraph>
                তাই ক্যাফের প্রতারকের সামনে মাত্র দুইটা রাস্তা ছিল, আর দুইটাই বন্ধ।
                নিজের নামে একটা Certificate দেখালে নাম মেলে না। নিজে নিজেই
                islandtours.example নামে একটা Certificate বানালে কোনো বিশ্বস্ত CA এর
                সই থাকে না। পর্যটকের ফোন দুই ক্ষেত্রেই সতর্কবার্তা দেখাত, আর ঠিক তাই
                দেখিয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Certificate গোপন নয়, Private Key গোপন",
          content: (
            <p>
              নতুনরা প্রায়ই উল্টো ভাবেন: .crt ফাইলটাকে Password এর মতো লুকিয়ে রাখেন,
              আর .key ফাইলটা সাধারণ ফাইলের মতো এখানে সেখানে Copy করেন। আসলে
              Certificate প্রতিটা Visitor পায়, পৃথিবীর যে কেউ যেকোনো সাইটের
              Certificate নামিয়ে দেখতে পারে। গোপন জিনিস শুধু একটা: Private Key। এই
              পার্থক্যটা মাথায় গেঁথে নিন, সেকশন ০১৩ পুরোটা এর উপর দাঁড়িয়ে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "inside-a-certificate",
      subHeader: { index: "006", title: "Certificate Anatomy" },
      title: <SectionTitle>একটা আসল Certificate খুলে পড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কথা অনেক হলো, এবার একটা আসল Certificate খুলি। example.com একটা
                সংরক্ষিত Domain, শেখার জন্যই রাখা, আর এর Server সত্যিই HTTPS চালায়।
                প্রথম কমান্ড Server এর সাথে TLS Handshake করে পাঠানো Certificate টা
                ধরে, দ্বিতীয়টা সেটা মানুষের পড়ার মতো করে লেখে। Certificate এর এই
                ফরম্যাটের নাম <strong>X.509</strong>, সংস্করণ 3, আর পৃথিবীর প্রায় সব
                Web Certificate এই ফরম্যাটে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "read-example-com.sh",
          code: `echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | openssl x509 -noout -text

# আসল ফলাফল, লম্বা Hex লাইনগুলো বাদ দিয়ে (অক্টোবর 2026):
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: (একটা লম্বা অনন্য সংখ্যা)
        Signature Algorithm: ecdsa-with-SHA256
        Issuer: C=US, O=SSL Corporation, CN=Cloudflare TLS Issuing ECC CA 3
        Validity
            Not Before: Sep 26 22:49:11 2026 GMT
            Not After : Dec 25 22:56:35 2026 GMT
        Subject: CN=example.com
        Subject Public Key Info:
            Public Key Algorithm: id-ecPublicKey
                Public-Key: (256 bit)
                NIST CURVE: P-256
        X509v3 extensions:
            X509v3 Basic Constraints: critical
                CA:FALSE
            Authority Information Access:
                CA Issuers - URI:http://i.cf-i.ssl.com/Cloudflare-TLS-I-E3.cer
                OCSP - URI:http://o.cf-i.ssl.com
            X509v3 Subject Alternative Name:
                DNS:example.com, DNS:*.example.com
            X509v3 Certificate Policies:
                Policy: 2.23.140.1.2.1
            X509v3 Extended Key Usage:
                TLS Web Server Authentication
            X509v3 CRL Distribution Points:
                URI:http://c.cf-i.ssl.com/ae801ed1c55bb579d79208b0d772acfb8cc3a208.crl
            X509v3 Key Usage: critical
                Digital Signature
            CT Precertificate SCTs:
                Signed Certificate Timestamp: (দুইটা, দুইটা আলাদা Log থেকে)
    Signature Algorithm: ecdsa-with-SHA256
    Signature Value: (Issuer এর সই)`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CertAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা লাইন পড়তে শিখুন, কারণ Production এর প্রতিটা Certificate
                সমস্যা এর কোনো না কোনো লাইনে লেখা থাকে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Subject আর Subject Alternative Name:</strong> কার
                  Certificate। Subject এর CN পুরনো দিনের জিনিস, আজকের Browser শুধু
                  SAN তালিকা দেখে। example.com এর তালিকায় দুইটা নাম: মূল নাম, আর{" "}
                  <code>*.example.com</code>, যা এক স্তরের যেকোনো উপনাম ঢাকে।
                </ListItem>
                <ListItem>
                  <strong>Subject Public Key Info:</strong> Server এর Public Key,
                  এখানে ECDSA P-256। পাসপোর্টের ছবির ঘর।
                </ListItem>
                <ListItem>
                  <strong>Issuer:</strong> কে সই করেছে। এখানে Cloudflare TLS Issuing
                  ECC CA 3, যা SSL.com নামের CA এর একটা Intermediate। সেকশন ০০৮ এ
                  এর পেছনের পুরো শিকল দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>Validity:</strong> Sep 26 থেকে Dec 25, ঠিক 90 দিন। আর সব
                  সময় GMT তে লেখা, তাই নিজের ঘড়ির সাথে মেলাতে সময়ের অঞ্চল মাথায়
                  রাখবেন।
                </ListItem>
                <ListItem>
                  <strong>Basic Constraints, CA:FALSE:</strong> এই Certificate দিয়ে
                  অন্য কোনো Certificate এ সই করা যাবে না। এটা না থাকলে যে কেউ নিজের
                  সাইটের Certificate দিয়ে CA সেজে বসত।
                </ListItem>
                <ListItem>
                  <strong>Key Usage আর Extended Key Usage:</strong> চাবিটা শুধু সই
                  করতে পারবে, আর শুধু Web Server হিসেবে। পাশে critical লেখার মানে,
                  যে Client এই ঘরটা বোঝে না, সে Certificate টাই মানবে না।
                </ListItem>
                <ListItem>
                  <strong>Authority Information Access আর CRL Distribution
                  Points:</strong> Issuer এর Certificate কোথায় পাওয়া যাবে, আর বাতিল
                  করা Certificate এর তালিকা কোথায়। সেকশন ০০৯ আর ০১২ তে দুইটারই কাজ
                  দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>Certificate Policies 2.23.140.1.2.1:</strong> এই সংখ্যাটার
                  মানে Domain Validated, সেকশন ০০৭ এর DV।
                </ListItem>
                <ListItem>
                  <strong>CT Precertificate SCTs:</strong> প্রমাণের রসিদ যে এই
                  Certificate টা প্রকাশ্য খাতায় লেখা হয়েছে। সেকশন ০১২ তে।
                </ListItem>
                <ListItem>
                  <strong>Signature Value:</strong> উপরের সব কিছুর উপর Issuer এর সই।
                  একটা অক্ষর বদলালেই এটা আর মেলে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এ প্রতিটা ঘরে চাপ দিয়ে দেখুন, ঘরটায় কী লেখা, কে সেটা
                মিলিয়ে দেখে, আর ভুল হলে ঠিক কোন Error আসে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CertFieldLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিদিনের কাজে পুরো লেখাটা লাগে না। চারটা ঘর দেখলেই বেশিরভাগ প্রশ্নের
              উত্তর পাওয়া যায়, আর একটা প্রশ্ন সবচেয়ে বেশি লাগে: মেয়াদ কি শিগগির শেষ
              হচ্ছে?
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "the-daily-four.sh",
          code: `# Certificate টা একবার ফাইলে রাখুন
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | openssl x509 -out leaf.pem

# কার, কে দিল, কবে থেকে কবে, কোন কোন নাম
openssl x509 -in leaf.pem -noout -subject -issuer -dates -ext subjectAltName
# subject=CN=example.com
# issuer=C=US, O=SSL Corporation, CN=Cloudflare TLS Issuing ECC CA 3
# notBefore=Sep 26 22:49:11 2026 GMT
# notAfter=Dec 25 22:56:35 2026 GMT
# X509v3 Subject Alternative Name:
#     DNS:example.com, DNS:*.example.com

# আগামী 30 দিনে মেয়াদ শেষ হবে? (Exit code 0 মানে না, 1 মানে হ্যাঁ)
openssl x509 -in leaf.pem -noout -checkend 2592000
# Certificate will not expire

# আগামী 90 দিনে?
openssl x509 -in leaf.pem -noout -checkend 7776000
# Certificate will expire`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Browser এও একই জিনিস দেখা যায়",
          content: (
            <p>
              যেকোনো HTTPS সাইটে Address Bar এর বাঁ দিকের চিহ্নটায় চাপ দিন। Chrome
              এ সেখান থেকে Connection is secure, তারপর Certificate is valid। Firefox
              এ তালার চিহ্ন, তারপর Connection secure, তারপর More information। যে
              পাতাটা খুলবে, তাতে ঠিক এই ঘরগুলোই সাজানো আছে, আর পাশে একটা তালিকায়
              পুরো শিকলটাও। আজই পাঁচটা চেনা সাইট খুলে Issuer আর মেয়াদ দেখে নিন। কয়টা
              ভিন্ন CA আর কয় রকম মেয়াদ পেলেন, সেটা নিজেই একটা শিক্ষা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "kinds-of-certificates",
      subHeader: { index: "007", title: "Certificate Types" },
      title: <SectionTitle>DV, OV, EV, Wildcard আর অনেক নামের Certificate</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Certificate কেনার বা নেওয়ার সময় দুই রকম ভাগের কথা শুনবেন। প্রথম ভাগ
              হলো CA সই করার আগে কতটা যাচাই করেছে। দ্বিতীয় ভাগ হলো Certificate টা
              কয়টা নাম ঢাকে। প্রথমে যাচাইয়ের ভাগ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ধরন", "CA কী যাচাই করে", "কত সময় লাগে", "Browser এ কী দেখায়", "কারা নেয়"],
          rows: [
            [mono("DV"), "শুধু এটুকু যে Domain টা আবেদনকারীর নিয়ন্ত্রণে আছে, একটা যান্ত্রিক পরীক্ষা দিয়ে", "কয়েক সেকেন্ড থেকে মিনিট, পুরোটা যন্ত্রে", "তালার চিহ্ন", "প্রায় সবাই: Let's Encrypt, Caddy, Vercel, Cloudflare"],
            [mono("OV"), "Domain এর পাশাপাশি প্রতিষ্ঠানটা আসলে আছে কি না, কাগজপত্র দেখে", "কয়েক দিন, মানুষ দেখে", "একই তালা। প্রতিষ্ঠানের নাম শুধু Certificate এর ভেতরে", "কিছু কোম্পানি, নিজেদের নীতির কারণে"],
            [mono("EV"), "আরও কড়া প্রতিষ্ঠান যাচাই", "কয়েক দিন থেকে সপ্তাহ", "একই তালা। Address Bar এর সবুজ নাম Browser গুলো তুলে দিয়েছে", "কিছু Bank, পুরনো অভ্যাসে, প্রতি বছর কমছে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                EV এর সবুজ নাম কেন উঠে গেল? গবেষণায় দেখা গেল বেশিরভাগ মানুষ সেটা
                খেয়ালই করেন না, আর কাছাকাছি নামের একটা কোম্পানি নিবন্ধন করে EV নেওয়া
                অসম্ভব নয়। এনক্রিপশন আর নাম মেলানোর নিরাপত্তা তিন ধরনেই হুবহু এক।
                তাই একটা সাধারণ সাইটের জন্য DV ই যথেষ্ট, আর আপনি যে Certificate গুলো
                নিজে নেবেন তার প্রায় সবই DV হবে। example.com এর Certificate এর
                Policy সংখ্যা 2.23.140.1.2.1 মানেও DV।
              </ContentParagraph>
              <ContentParagraph>
                এবার নামের ভাগ। একটা Certificate তিনভাবে নাম ঢাকতে পারে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক নাম:</strong> শুধু <code>islandtours.example</code>।
                  www দিয়ে ঢুকলে এই Certificate কাজ করবে না।
                </ListItem>
                <ListItem>
                  <strong>অনেক নাম, এক Certificate এ:</strong> SAN তালিকায় একাধিক
                  নাম, যেমন <code>islandtours.example</code> আর{" "}
                  <code>www.islandtours.example</code>। Let&apos;s Encrypt একটা
                  Certificate এ একশো পর্যন্ত নাম দেয়। সুবিধা একটা ফাইল, অসুবিধা হলো
                  সব নামের তালিকা প্রকাশ্য, আর একটা Private Key সব নামের জন্য।
                </ListItem>
                <ListItem>
                  <strong>Wildcard:</strong> <code>*.islandtours.example</code>, এক
                  স্তরের যেকোনো উপনাম। <code>blog.islandtours.example</code> আর{" "}
                  <code>admin.islandtours.example</code> ঢাকে, কিন্তু মূল নাম{" "}
                  <code>islandtours.example</code> ঢাকে না, আর দুই স্তরের{" "}
                  <code>shop.seagull.islandtours.example</code> ও না। স্তরের এই নিয়ম
                  আর Platform এ Wildcard চালানোর পুরো পদ্ধতি Module 04 এর{" "}
                  <Link href="/devops/topic/wildcard-multi-tenant-domains" className={linkClass}>
                    Wildcard আর Multi-tenant Domain
                  </Link>{" "}
                  লেসনে আছে। এখানে শুধু মনে রাখুন, Let&apos;s Encrypt থেকে Wildcard
                  নিতে DNS-01 Challenge লাগে, সেকশন ০১১ তে কেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Wildcard এর চাবি সব Server এ ছড়াবেন না",
          content: (
            <p>
              একটা Wildcard Certificate দশটা Server এ বসানো মানে একই Private Key দশ
              জায়গায়। একটা Server ভাঙলে প্রতারক আপনার সব উপনাম সাজতে পারে। Island
              Tours তাই প্রতিটা Host এর জন্য আলাদা Certificate রাখে:
              islandtours.example এর একটা, api.islandtours.example এর আরেকটা, আলাদা
              Server এ, আলাদা চাবিতে। Wildcard তখনই নিন, যখন উপনাম গুনে শেষ করা যায়
              না, যেমন প্রতিটা গ্রাহকের নিজের উপনাম।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "chain-of-trust",
      subHeader: { index: "008", title: "Chain of Trust" },
      title: <SectionTitle>CA আর Chain of Trust: অচেনাকে বিশ্বাস করার শিকল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CA আসলে কারা? কয়েক ডজন প্রতিষ্ঠান: Let&apos;s Encrypt (ISRG নামের
                একটা অলাভজনক সংস্থা চালায়), DigiCert, Sectigo, GlobalSign, Google
                Trust Services, SSL.com এবং আরও কিছু। এরা প্রতি বছর বাইরের Auditor দিয়ে
                পরীক্ষা করায়, আর CA/Browser Forum নামের একটা জোটের ঠিক করা নিয়ম মেনে
                চলে। এই Forum এ CA গুলো আর Browser কোম্পানিগুলো একসাথে বসে নিয়ম
                বানায়।
              </ContentParagraph>
              <ContentParagraph>
                কোন CA বিশ্বাসযোগ্য, সেই সিদ্ধান্ত কিন্তু CA নেয় না। নেয় Operating
                System আর Browser এর নির্মাতারা: Apple, Microsoft, Google, Mozilla।
                প্রত্যেকের একটা তালিকা আছে, যার নাম <strong>Trust Store</strong>।
                আপনার ফোন বা Laptop কেনার দিন থেকেই এই তালিকা তার ভেতরে বসানো, আর
                Update এর সাথে বদলায়। কোনো CA নিয়ম ভাঙলে তাকে তালিকা থেকে বাদ দেওয়া
                হয়, আর বাস্তবে এটা ঘটেছে। 2011 সালে DigiNotar নামের একটা CA হ্যাক
                হয়ে ভুয়া Certificate দিয়েছিল, কয়েক সপ্তাহের মধ্যে সব Browser তাকে
                বাদ দেয় আর কোম্পানিটা উঠে যায়। 2018 সালে Symantec আর 2024 সালে
                Entrust কে Chrome অবিশ্বাস করা শুরু করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "count-trusted-roots.sh",
          code: `# Node নিজের সাথে Mozilla এর তালিকার একটা কপি নিয়ে আসে
node -e 'console.log(require("node:tls").rootCertificates.length)'
# 144     (এই যন্ত্রে, Node 25.8 এ। আপনার সংস্করণে সংখ্যাটা একটু আলাদা হতে পারে)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তালিকার প্রতিটা জিনিস একটা <strong>Root CA Certificate</strong>। Root
                এর বিশেষত্ব হলো, তার Certificate এ সে নিজেই সই করেছে, Issuer আর
                Subject একই। তাকে বিশ্বাস করার কারণ অঙ্ক নয়, কারণ হলো Apple বা
                Mozilla তাকে আপনার তালিকায় ঢুকিয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে Root নিজেই কেন প্রতিটা সাইটের Certificate এ সই করে না? কারণ
                Root এর Private Key পৃথিবীর সবচেয়ে দামি জিনিসগুলোর একটা। সেটা ফাঁস হলে
                কোটি কোটি যন্ত্রের তালিকা বদলাতে হবে, যাতে বছরের পর বছর লাগে। তাই
                Root এর চাবি রাখা হয় Internet থেকে বিচ্ছিন্ন একটা বিশেষ যন্ত্রে
                (HSM), পাহারা দেওয়া ভল্টে, বছরে কয়েকবার মাত্র বের করা হয়। সেই বিরল
                সময়ে Root সই করে কয়েকটা <strong>Intermediate CA</strong> এর
                Certificate এ। প্রতিদিনের লক্ষ লক্ষ সই করে Intermediate। কোনো
                Intermediate বিপদে পড়লে শুধু সেটাকে বাতিল করে নতুন একটা বানানো যায়,
                Root আর তালিকা যেমন ছিল তেমনই থাকে।
              </ContentParagraph>
              <ContentParagraph>
                ফলে একটা সাইটের পরিচয় দাঁড়ায় একটা শিকলে: Root সই করেছে Intermediate
                এ, Intermediate সই করেছে আপনার সাইটের Certificate এ, যাকে বলে{" "}
                <strong>Leaf</strong>। এই শিকলের নাম <strong>Chain of Trust</strong>।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ChainOfTrustDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              example.com এর Server আসলে কী পাঠায়, দেখি। openssl এর Certificate
              chain অংশে প্রতিটা লাইনে s মানে Subject, কার Certificate, আর i মানে
              Issuer, কে সই করেছে। খেয়াল করুন প্রতিটা লাইনের i পরের লাইনের s এর
              সাথে হুবহু মেলে। শিকল এভাবেই জোড়া লাগে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "example-com-chain.sh",
          code: `echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | grep -E "^ *[0-9] s:|^ +i:"
#  0 s:CN=example.com
#    i:C=US, O=SSL Corporation, CN=Cloudflare TLS Issuing ECC CA 3
#  1 s:C=US, O=SSL Corporation, CN=Cloudflare TLS Issuing ECC CA 3
#    i:C=US, O=SSL Corporation, CN=SSL.com TLS Transit ECC CA R2
#  2 s:C=US, O=SSL Corporation, CN=SSL.com TLS Transit ECC CA R2
#    i:C=US, O=SSL Corporation, CN=SSL.com TLS ECC Root CA 2022
#  3 s:C=US, O=SSL Corporation, CN=SSL.com TLS ECC Root CA 2022
#    i:C=GB, ST=Greater Manchester, L=Salford, O=Comodo CA Limited, CN=AAA Certificate Services

# Node দিয়ে একই শিকল, শেষ ধাপটা আসে Node এর নিজের Trust Store থেকে
# (পুরো Script টা Lab এর ৬ নম্বরে)
# chain 0  : example.com <- signed by Cloudflare TLS Issuing ECC CA 3
# chain 1  : Cloudflare TLS Issuing ECC CA 3 <- signed by SSL.com TLS Transit ECC CA R2
# chain 2  : SSL.com TLS Transit ECC CA R2 <- signed by SSL.com TLS ECC Root CA 2022
# chain 3  : SSL.com TLS ECC Root CA 2022 <- signed by AAA Certificate Services
# chain 4  : AAA Certificate Services <- signed by AAA Certificate Services`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে একটা মজার জিনিস দেখা যাচ্ছে। শিকলটা চার ধাপের, আর তিন নম্বরে
                একটা Root, SSL.com TLS ECC Root CA 2022, যার উপর আবার আরেকজনের সই:
                AAA Certificate Services, একটা অনেক পুরনো Root। এর নাম{" "}
                <strong>Cross-sign</strong>। নতুন Root কে সব যন্ত্রের তালিকায় ঢুকতে
                বছর লাগে। সেই সময়টায় পুরনো যন্ত্রগুলোও যেন সাইটটা বিশ্বাস করে, তাই
                পুরনো আর বহুল পরিচিত একটা Root নতুনটার উপর সই করে দেয়। যে যন্ত্র নতুন
                Root চেনে, সে সেখানেই থামে। যে চেনে না, সে আরেক ধাপ উঠে পুরনোটায়
                পৌঁছায়।
              </ContentParagraph>
              <ContentParagraph>
                যাচাই চলে নিচ থেকে উপরে। Browser Leaf এর Issuer নাম দেখে, শিকলে
                সেই নামের Certificate খোঁজে, তার Public Key দিয়ে Leaf এর সই মেলায়।
                মিললে এক ধাপ উপরে উঠে একই কাজ করে। এভাবে উঠতে উঠতে যখন এমন একটা
                Certificate এ পৌঁছায় যা নিজের Trust Store এ আছে, তখন থামে। পৌঁছাতে না
                পারলে পুরো শিকল অবিশ্বাস্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিজের Trust Store এ কী ঢোকাচ্ছেন, খেয়াল রাখুন",
          content: (
            <p>
              Trust Store এ একটা Root ঢোকানো মানে তার মালিককে পৃথিবীর যেকোনো সাইট
              সাজার ক্ষমতা দেওয়া, শুধু আপনার যন্ত্রের জন্য। অনেক অফিস কর্মীদের
              Laptop এ নিজেদের Root বসায়, যাতে অফিসের Proxy সব HTTPS খুলে দেখতে
              পারে। কিছু Antivirus ও এটা করে। সেকশন ০১৪ এর mkcert ও নিজের যন্ত্রে
              একটা Root বসায়, তবে সেটার চাবি থাকে শুধু আপনার যন্ত্রে। নিয়ম একটাই:
              কেউ একটা Root Certificate পাঠিয়ে বললেন এটা Install করুন, আর আপনি জানেন
              না কেন, তাহলে করবেন না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "missing-intermediate",
      subHeader: { index: "009", title: "Missing Intermediate" },
      title: <SectionTitle>Intermediate পাঠাতে ভুলে গেলে: যে ভুল নিজের Browser এ ধরা পড়ে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Root থাকে Client এর কাছে। কিন্তু Intermediate? সেটা Client এর কাছে
                থাকার কথা নয়, Server কে Handshake এর সময় Leaf এর সাথে পাঠাতে হয়।
                এটাই Production এর সবচেয়ে প্রতারক Certificate ভুল, কারণ যিনি ভুলটা
                করেন, তাঁর নিজের Browser এ সব ঠিক দেখায়।
              </ContentParagraph>
              <ContentParagraph>
                কেন ঠিক দেখায়? কিছু Browser হারানো Intermediate নিজে খুঁজে নেয়।
                Leaf এর Authority Information Access ঘরে Issuer এর ঠিকানা লেখা থাকে,
                সেখান থেকে নামিয়ে আনে, অথবা আগে অন্য কোনো সাইটে দেখা Intermediate মনে
                রাখে। কিন্তু curl, Node, Python, Java, Go, অনেক Mobile App, আর
                Payment Gateway এর Webhook পাঠানো Server, এরা এই উদারতা দেখায় না।
                তারা Server যা পাঠিয়েছে শুধু তা দিয়েই শিকল বানায়।
              </ContentParagraph>
              <ContentParagraph>
                নিজের যন্ত্রে একটা খেলনা CA বানিয়ে ব্যাপারটা ঘটিয়ে দেখি। নিচের Script
                প্রথমে একটা Root বানায়, তারপর Root এর সই করা একটা Intermediate, তারপর
                Intermediate এর সই করা localhost এর Leaf। তারপর একবার Server চালায়
                শুধু Leaf দিয়ে, আরেকবার Leaf আর Intermediate জোড়া fullchain দিয়ে।
                Client দুইবারই বিশ্বাস করে শুধু Root কে, ঠিক বাস্তবের মতো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "missing-intermediate-result.sh",
          code: `LAB_PORT=47687 bash 4-make-chain.sh      # পুরো Script টা Lab এর ৪ নম্বরে

# openssl নিজেও একই কথা বলে
== openssl verify, শুধু Root হাতে নিয়ে
CN=localhost
error 20 at 0 depth lookup: unable to get local issuer certificate
error leaf.crt: verification failed
== openssl verify, Intermediate সহ
leaf.crt: OK

== Server পাঠাচ্ছে leaf.crt, Client বিশ্বাস করে শুধু root.crt
curl: (60) SSL certificate problem: unable to get local issuer certificate
node: UNABLE_TO_VERIFY_LEAF_SIGNATURE

== Server পাঠাচ্ছে fullchain.crt, Client বিশ্বাস করে শুধু root.crt
hello over TLS, you asked for /
node: ok`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই Leaf, একই Private Key, একই Root। পার্থক্য শুধু Server Handshake এ
                কয়টা Certificate পাঠাল। এখন নিজের Server এ এই ভুল কীভাবে ধরবেন আর
                সারাবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>গুনে দেখুন:</strong>{" "}
                  <code>openssl s_client -connect islandtours.example:443 -servername islandtours.example</code>{" "}
                  চালিয়ে Certificate chain অংশে অন্তত দুইটা লাইন থাকা চাই, 0 আর 1।
                  শুধু 0 থাকলে Intermediate বাদ পড়েছে। শেষে Verify return code 0
                  (ok) দেখা চাই, 21 (unable to verify the first certificate) নয়।
                </ListItem>
                <ListItem>
                  <strong>নিজের Browser দিয়ে নয়, curl দিয়ে পরীক্ষা করুন,</strong>{" "}
                  আর সম্ভব হলে অন্য একটা যন্ত্র থেকে।
                </ListItem>
                <ListItem>
                  <strong>সারানো:</strong> Server কে fullchain দিন, শুধু Leaf নয়।
                  Nginx এ <code>ssl_certificate</code> এর পাশে fullchain.pem, Node
                  এর <code>cert</code> এ fullchain এর Text, Caddy নিজেই ঠিক করে নেয়।
                  ক্রম জরুরি: Leaf আগে, তারপর Intermediate।
                </ListItem>
                <ListItem>
                  <strong>Root পাঠাবেন না।</strong> Client এর কাছে Root আগে থেকেই
                  আছে, না থাকলে Server এর পাঠানো Root সে বিশ্বাসও করবে না। পাঠালে
                  প্রতিটা Handshake এ শুধু শুধু কয়েকশো Byte বাড়ে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আমার Browser এ তো ঠিক আছে, কোনো পরীক্ষা নয়",
          content: (
            <p>
              কেউ বললেন সাইট ঠিকই খুলছে, অথচ Android App বা Webhook ব্যর্থ হচ্ছে, তখন
              প্রথম সন্দেহ Intermediate। দলের নিয়ম বানিয়ে নিন: Certificate বদলানোর পর
              কোনো Browser নয়, curl আর openssl s_client দিয়ে যাচাই হবে, আর Deploy এর
              Pipeline এ এই যাচাইটা যন্ত্র নিজেই করবে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "validation",
      subHeader: { index: "010", title: "Validation" },
      title: <SectionTitle>Browser ঠিক কী কী মিলিয়ে দেখে, আর কোন ভুলে কোন Error</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণে যা যা শিখলেন, সব জোড়া লাগাই। Handshake এ Server এর
                Certificate হাতে পেয়ে একটা Browser মোটামুটি এই আটটা প্রশ্নের উত্তর
                খোঁজে। একটারও উত্তর না হলে পাতা খোলে না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>শিকল কি Trust Store এর একটা Root এ পৌঁছায়?</strong>{" "}
                  Server এর পাঠানো Leaf আর Intermediate দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>শিকলের প্রতিটা সই কি মেলে?</strong> প্রতিটা Certificate এর
                  সই তার উপরের জনের Public Key দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>Address Bar এর নামটা কি SAN তালিকায় আছে?</strong> Wildcard
                  হলে ঠিক এক স্তর।
                </ListItem>
                <ListItem>
                  <strong>আজকের তারিখ কি Not Before আর Not After এর মাঝে?</strong>{" "}
                  নিজের ঘড়ি দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>কাজটা কি অনুমোদিত?</strong> Leaf এ CA:FALSE আর TLS Web
                  Server Authentication, Intermediate এ CA:TRUE।
                </ListItem>
                <ListItem>
                  <strong>বাতিল তালিকায় নেই তো?</strong> সেকশন ০১২ তে দেখবেন এটা কতটা
                  দুর্বল।
                </ListItem>
                <ListItem>
                  <strong>প্রকাশ্য খাতার রসিদ আছে?</strong> Chrome আর Safari রসিদ
                  ছাড়া প্রকাশ্য Certificate মানে না।
                </ListItem>
                <ListItem>
                  <strong>Server এর কাছে কি মেলানো Private Key আছে?</strong>{" "}
                  CertificateVerify এর সই দিয়ে, লেসন ০৭ এর Handshake এর ভেতরে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এ আটটা পরিস্থিতি সাজানো। প্রতিটা বেছে নিয়ে এক এক করে যাচাই
                চালান, আর দেখুন কোথায় থামে, আর তিনটা আলাদা Client ঠিক কী লেখা দেখায়।
                শেষ পরিস্থিতিটা, চুরি করা Certificate, আলাদা করে খেয়াল করবেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ValidationLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের টেবিলটা হাতের কাছে রাখার মতো। Error এর লেখা দেখে আপনি সাথে সাথে
              বুঝবেন সমস্যাটা কোন যাচাইয়ে, আর সারানোর দায়িত্ব কার। curl আর Node এর
              লেখাগুলো এই লেসনের Lab এ সত্যিই চালিয়ে পাওয়া। Browser এর লেখাগুলো Chrome
              আর Firefox যা দেখায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পরিস্থিতি", "Chrome", "curl", "Node", "কে সারাবেন"],
          rows: [
            ["Self-signed", mono("NET::ERR_CERT_AUTHORITY_INVALID"), "self signed certificate", mono("DEPTH_ZERO_SELF_SIGNED_CERT"), "Server: প্রকাশ্য CA এর Certificate নিন"],
            ["Intermediate বাদ", "অনেক সময় কিছুই না", "unable to get local issuer certificate", mono("UNABLE_TO_VERIFY_LEAF_SIGNATURE"), "Server: fullchain পাঠান"],
            ["ভুল নাম", mono("NET::ERR_CERT_COMMON_NAME_INVALID"), "no alternative certificate subject name matches target host name", mono("ERR_TLS_CERT_ALTNAME_INVALID"), "Server: নামটা SAN এ যোগ করে নতুন Certificate"],
            ["মেয়াদ শেষ", mono("NET::ERR_CERT_DATE_INVALID"), "certificate has expired", mono("CERT_HAS_EXPIRED"), "Server: নবায়ন, আর নবায়ন কেন থেমেছিল খুঁজুন"],
            ["ঘড়ি পিছিয়ে", mono("NET::ERR_CERT_DATE_INVALID"), "certificate is not yet valid", mono("CERT_NOT_YET_VALID"), "Client: যন্ত্রের তারিখ আর সময়"],
            ["বাতিল করা", mono("NET::ERR_CERT_REVOKED"), "সাধারণত কিছুই না", "সাধারণত কিছুই না", "Server: নতুন চাবি আর নতুন Certificate"],
            ["চাবি আর Certificate মেলে না", "Server চালুই হয় না", "Connection হয় না", mono("ERR_OSSL_X509_KEY_VALUES_MISMATCH"), "Server: ঠিক জোড়াটা বসান"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Firefox এর নামগুলো একটু আলাদা, যেমন অচেনা Issuer হলে
              SEC_ERROR_UNKNOWN_ISSUER, ভুল নামে SSL_ERROR_BAD_CERT_DOMAIN, মেয়াদ
              শেষে SEC_ERROR_EXPIRED_CERTIFICATE। নাম আলাদা হলেও যাচাই একই, তাই
              উপরের আটটা প্রশ্ন জানলে যেকোনো Browser এর Error পড়তে পারবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "যাচাই বন্ধ করে কখনো সমস্যা ঢাকবেন না",
          content: (
            <p>
              Stack Overflow এ এই Error গুলোর সবচেয়ে জনপ্রিয় উত্তর প্রায়ই সবচেয়ে
              বিপজ্জনক: curl এ <code>-k</code>, Node এ{" "}
              <code>rejectUnauthorized: false</code>, অথবা পুরো Process এর জন্য{" "}
              <code>NODE_TLS_REJECT_UNAUTHORIZED=0</code>। এগুলো Error টা চুপ করায়,
              কিন্তু সাথে সাথে Certificate যাচাইও পুরো বন্ধ করে। তখন ক্যাফের প্রতারক
              আবার মাঝখানে বসতে পারে, আর আপনার Code খুশি মনে তার সাথে কথা বলবে।
              আসল সমাধান হলো Error এর কারণ সারানো, আর নিজের বানানো CA বিশ্বাস করাতে
              হলে নির্দিষ্টভাবে শুধু সেটাকে দেওয়া: curl এ <code>--cacert</code>, Node
              এ <code>NODE_EXTRA_CA_CERTS</code>। সেকশন ০১৪ তে দুইটাই চালিয়ে দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "acme",
      subHeader: { index: "011", title: "Let's Encrypt & ACME" },
      title: <SectionTitle>Let&apos;s Encrypt আর ACME: কোনো মানুষ ছাড়া Certificate</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                2015 সালের আগে একটা Certificate মানে ছিল টাকা দিয়ে কেনা, ফর্ম পূরণ,
                Email এ আসা ফাইল, হাতে Server এ বসানো, আর বছর শেষে আবার একই ঝামেলা।
                ফলে বেশিরভাগ সাইট HTTP তেই থেকে যেত। Let&apos;s Encrypt এসে দুইটা
                জিনিস বদলাল: Certificate বিনা পয়সায়, আর পুরো প্রক্রিয়াটা যন্ত্রের সাথে
                যন্ত্রের কথোপকথন, যার নাম <strong>ACME</strong> (Automatic
                Certificate Management Environment, RFC 8555)। আজ Web এর বেশিরভাগ
                পাতা যে HTTPS এ চলে, তার পেছনে এই দুইটা সিদ্ধান্তের বড় ভূমিকা।
              </ContentParagraph>
              <ContentParagraph>
                ACME এর মূল প্রশ্ন একটাই: আপনি যে নামের Certificate চাইছেন, নামটা কি
                সত্যিই আপনার নিয়ন্ত্রণে? Let&apos;s Encrypt আপনার কথায় বিশ্বাস করে
                না, নিজে এসে পরীক্ষা করে। Island Tours এর Server এ Caddy ঠিক এই
                আলাপটাই করে, কোনো মানুষের হাত ছাড়া।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <AcmeFlowDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়ন্ত্রণ প্রমাণের তিনটা উপায় আছে, যাদের নাম Challenge। কোনটা কখন
                লাগে, সেটা জানা থাকলে অর্ধেক সমস্যা আগেই এড়ানো যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>HTTP-01:</strong> Let&apos;s Encrypt Port 80 এ এসে চায়{" "}
                  <code>http://islandtours.example/.well-known/acme-challenge/&lt;token&gt;</code>,
                  আর Caddy সেখানে ঠিক Token টা দেখায়। শর্ত দুইটা: নামটার DNS এই
                  Server এর দিকে থাকতে হবে, আর Port 80 Internet থেকে খোলা থাকতে হবে।
                  Firewall এ Port 80 বন্ধ করে দিলে নবায়ন চুপচাপ থেমে যায়, এটা খুব
                  সাধারণ ভুল। আর এই পথে Wildcard হয় না।
                </ListItem>
                <ListItem>
                  <strong>DNS-01:</strong> একটা TXT Record বসাতে হয়{" "}
                  <code>_acme-challenge.islandtours.example</code> নামে। Server টা
                  Internet থেকে দেখা না গেলেও চলে, আর Wildcard এর একমাত্র উপায় এটাই।
                  কারণ Wildcard মানে পুরো এক স্তরের যেকোনো নামের দাবি, আর সেই দাবির
                  প্রমাণ একটা Server এর ফাইল দিয়ে হয় না, পুরো Zone এর নিয়ন্ত্রণ
                  দেখাতে হয়। এর জন্য Server এর কাছে DNS Provider এর একটা API Token
                  লাগে, যেটা নিজেই একটা গোপন জিনিস।
                </ListItem>
                <ListItem>
                  <strong>TLS-ALPN-01:</strong> Port 443 এর উপরেই একটা বিশেষ Handshake
                  দিয়ে প্রমাণ। Caddy এটাও নিজে থেকে চেষ্টা করে, তাই Port 80 না থাকলেও
                  অনেক সময় কাজ চলে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                প্রমাণ পাওয়ার পর Caddy যা পাঠায় তার নাম <strong>CSR</strong>,
                Certificate Signing Request। এতে থাকে নতুন Public Key আর নামের তালিকা,
                আর পুরোটা সেই Public Key এর জোড়া Private Key দিয়ে সই করা, যাতে প্রমাণ
                হয় আবেদনকারীর কাছে চাবিটা আছে। Private Key কখনো পাঠানো হয় না। নিজের
                হাতেও একটা বানিয়ে দেখতে পারেন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "make-a-csr.sh",
          code: `# আগে বানানো চাবি দিয়ে islandtours.example আর www এর জন্য একটা CSR
openssl req -new -key localhost.key -subj "/CN=islandtours.example" \\
  -addext "subjectAltName=DNS:islandtours.example,DNS:www.islandtours.example" \\
  -out islandtours.csr

# CSR এর নিজের সই ঠিক আছে কি না, আর ভেতরে কী আছে
openssl req -in islandtours.csr -noout -subject -verify
# Certificate request self-signature verify OK
# subject=CN=islandtours.example

openssl req -in islandtours.csr -noout -text | grep -A1 "Alternative"
#                 X509v3 Subject Alternative Name:
#                     DNS:islandtours.example, DNS:www.islandtours.example`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা জিনিস যা অনেকে জানেন না, অথচ Module 04 এর DNS Records
                লেসনে নাম শুনেছেন: <strong>CAA Record</strong>। এই Record বলে দেয়
                আপনার Domain এর জন্য কোন কোন CA Certificate দিতে পারবে। কোনো CA
                Certificate দেওয়ার আগে এটা দেখতে বাধ্য। কেউ আপনার নামে অন্য কোনো CA
                থেকে Certificate নিতে চাইলে CA নিজেই মানা করবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "caa.zone",
          code: `; Name                 Type   Value
islandtours.example.   CAA    0 issue "letsencrypt.org"
islandtours.example.   CAA    0 issue "sectigo.com"     ; ZeroSSL, Caddy এর দ্বিতীয় পছন্দ

; যাচাই
; dig +short CAA islandtours.example`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "CAA আর Caddy এর দ্বিতীয় CA",
          content: (
            <p>
              Caddy Let&apos;s Encrypt থেকে Certificate না পেলে নিজে থেকে ZeroSSL এর
              কাছে যায়। ZeroSSL Certificate দেয় Sectigo এর নামে, তাই CAA তে চেনার
              নাম <code>sectigo.com</code>। CAA তে শুধু letsencrypt.org লিখে রাখলে
              Let&apos;s Encrypt এর একদিনের সমস্যায় Caddy এর বিকল্প পথটাও বন্ধ হয়ে
              যায়, আর আপনি জানতেও পারেন না। যেকোনো ACME Client এর বেলায় একই কথা:
              Client কোন কোন CA ব্যবহার করতে পারে জেনে নিন, আর CAA তে ঠিক সেগুলোই
              রাখুন।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "পরীক্ষা চালান Staging এ",
          content: (
            <p>
              Let&apos;s Encrypt এ একই নামের জন্য সপ্তাহে কতগুলো Certificate নেওয়া
              যায় তার সীমা আছে। নতুন Setup নিয়ে বারবার চেষ্টা করলে সীমায় আটকে কয়েক
              দিন অপেক্ষা করতে হতে পারে। তাই পরীক্ষার সময় Staging ঠিকানা ব্যবহার
              করুন, যার Certificate কেউ বিশ্বাস করে না কিন্তু পুরো প্রক্রিয়াটা একই।
              Caddy এ <code>acme_ca</code> Option, certbot এ{" "}
              <code>--staging</code>। সব ঠিক চললে তারপর আসলটায় যান।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "revocation-and-lifetimes",
      subHeader: { index: "012", title: "Revocation & Lifetimes" },
      title: <SectionTitle>বাতিল করা, প্রকাশ্য খাতা, আর ছোট হয়ে আসা আয়ু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরুন Island Tours এর Private Key কোনোভাবে ফাঁস হয়ে গেল। Certificate
                এর মেয়াদ তো আরও দুই মাস। এই দুই মাস প্রতারক সেই চাবি আর Certificate
                দিয়ে নিখুঁতভাবে islandtours.example সাজতে পারবে, যদি না Certificate
                টা আগেই বাতিল করা হয়। বাতিল করার নাম <strong>Revocation</strong>, আর
                Client কে জানানোর দুইটা পদ্ধতি তৈরি হয়েছিল।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>CRL, Certificate Revocation List:</strong> CA এর প্রকাশ করা
                  বাতিল Certificate এর তালিকা। example.com এর Certificate এর CRL
                  Distribution Points ঘরে এর ঠিকানা দেখেছেন।
                </ListItem>
                <ListItem>
                  <strong>OCSP:</strong> প্রতিটা Connection এ CA কে জিজ্ঞেস করা, এই
                  Certificate টা কি এখনো ঠিক আছে? সমস্যা তিনটা। CA জেনে যায় কে কোন
                  সাইটে যাচ্ছে। প্রতিটা Handshake ধীর হয়। আর CA উত্তর না দিলে Browser
                  গুলো সাধারণত ধরে নেয় সব ঠিক আছে, তাই যে প্রতারক Network আটকাতে পারে
                  সে প্রশ্নটাও আটকে দিতে পারে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই দুর্বলতার কারণে বড় বদল এসেছে। Let&apos;s Encrypt 7 মে 2025 থেকে
                Certificate এ OCSP ঠিকানা দেওয়া বন্ধ করেছে, আর 6 আগস্ট 2025 এ OCSP
                সেবা পুরো বন্ধ করে শুধু CRL এ চলে গেছে। Firefox এখন CRLite নামের একটা
                ব্যবস্থায় সব বাতিল Certificate এর একটা ঘন তালিকা নিয়মিত নামিয়ে রাখে,
                আর প্রতিটা Connection এ নিজের যন্ত্রেই দেখে নেয়, কাউকে জিজ্ঞেস না
                করে। Chrome ও নিজের পাঠানো একটা তালিকা দেখে। আর আপনার Lab এই দেখাবে,
                curl আর Node নিজে থেকে বাতিল তালিকা দেখেই না। সব CA একসাথে বদলায়নি,
                তাই example.com এর Certificate এ এখনো একটা OCSP ঠিকানা দেখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                এর পাশে আরেকটা ব্যবস্থা অনেক বেশি কার্যকর হয়েছে:{" "}
                <strong>Certificate Transparency</strong>, সংক্ষেপে CT। প্রতিটা
                প্রকাশ্য Certificate দেওয়ার আগে CA কে সেটা কয়েকটা প্রকাশ্য খাতায়
                (Log) লিখতে হয়, যেখান থেকে কিছু মোছা যায় না। খাতা থেকে পাওয়া রসিদ,
                SCT, Certificate এর ভেতরেই বসানো থাকে। example.com এর Certificate এ
                দুইটা রসিদ দেখেছেন। Chrome আর Safari রসিদ ছাড়া প্রকাশ্য Certificate
                মানে না। ফলে কোনো CA লুকিয়ে আপনার নামে Certificate দিতে পারে না।
                crt.sh এর মতো সাইটে নিজের Domain লিখে আপনি দেখতে পারেন কবে কোন CA
                আপনার কোন নামের জন্য Certificate দিয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "CT Log আপনার উপনামগুলোও প্রকাশ করে",
          content: (
            <p>
              খাতাটা প্রকাশ্য, তাই <code>staging-payments.islandtours.example</code>{" "}
              নামে একটা Certificate নিলে নামটা পৃথিবীর সবাই দেখতে পায়, আর
              আক্রমণকারীরা নতুন উপনাম খুঁজতে নিয়মিত এই খাতা পড়ে। একটা উপনাম
              Internet থেকে লুকিয়ে রাখা নিরাপত্তা নয়, তবু নামে গোপন পরিকল্পনা লিখবেন
              না। ভেতরের সেবার জন্য প্রকাশ্য Certificate না নিয়ে ভেতরের CA ব্যবহার
              করা যায়, বা Wildcard, যাতে আলাদা নামগুলো খাতায় ওঠে না।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাতিল করা যেহেতু ঠিকমতো কাজ করে না, শিল্প অন্য পথ ধরেছে: Certificate
                এর আয়ুই ছোট করে দেওয়া। চুরি করা চাবি তাহলে অল্প কয়েক দিন কাজে লাগে।
                2025 সালের এপ্রিলে CA/Browser Forum এ Ballot SC-081v3 পাস হয়েছে,
                যাতে সব প্রকাশ্য Certificate এর সর্বোচ্চ মেয়াদ ধাপে ধাপে কমছে।
                Let&apos;s Encrypt ও নিজের পরিকল্পনা ঘোষণা করেছে ডিসেম্বর 2025 এ।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LifetimeTimelineDiagram /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কবে থেকে", "সব প্রকাশ্য Certificate এর সর্বোচ্চ", "Let's Encrypt এর classic Profile"],
          rows: [
            ["এখন, অক্টোবর 2026", mono("200 দিন (15 মার্চ 2026 থেকে)"), mono("90 দিন")],
            ["13 মে 2026 থেকে", "একই", "ইচ্ছা হলে tlsserver Profile এ 45 দিন। আর আছে 6 দিনের shortlived Profile"],
            ["10 ফেব্রুয়ারি 2027", "15 মার্চ 2027 থেকে 100 দিন", mono("64 দিন")],
            ["16 ফেব্রুয়ারি 2028", "একই", mono("45 দিন")],
            ["15 মার্চ 2029", mono("47 দিন"), "45 দিন"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আয়ুর সাথে আরেকটা জিনিসও ছোট হচ্ছে, যা অনেকে খেয়াল করেন না: একবার
                Domain এর নিয়ন্ত্রণ প্রমাণ করলে সেই প্রমাণ কতদিন আবার ব্যবহার করা যায়।
                Let&apos;s Encrypt এ এখন 30 দিন, 2027 এ হবে 10 দিন, আর 2028 এ মাত্র 7
                ঘণ্টা। মানে প্রায় প্রতিটা নবায়নে নতুন করে Challenge পার হতে হবে। Port
                80 বা DNS Token এর সমস্যা তখন আর মাসে একবার নয়, প্রতিবার ধরা পড়বে।
              </ContentParagraph>
              <ContentParagraph>
                আপনার কাজে এর মানে তিনটা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>হাতে নবায়নের যুগ শেষ।</strong> 45 দিনের Certificate হাতে
                  বসালে বছরে আটবার একই কাজ, আর একবার ভুললেই Outage। ACME Client ছাড়া
                  উপায় নেই।
                </ListItem>
                <ListItem>
                  <strong>নবায়ন নির্দিষ্ট দিন গুনে নয়।</strong> পুরনো 60 দিনের
                  Cron আর চলবে না। Let&apos;s Encrypt এর পরামর্শ: ARI (ACME Renewal
                  Information) চালু করুন, যাতে CA নিজেই বলে দেয় কবে নবায়ন করতে হবে।
                  ARI না থাকলে মেয়াদের দুই তৃতীয়াংশ পেরোলে নবায়ন। Caddy নিজে থেকে
                  মেয়াদের শেষ এক তৃতীয়াংশে নবায়ন শুরু করে।
                </ListItem>
                <ListItem>
                  <strong>নজরদারি বাধ্যতামূলক।</strong> Let&apos;s Encrypt 4 জুন 2025
                  থেকে মেয়াদ শেষের Email পাঠানো বন্ধ করেছে। কেউ আপনাকে মনে করিয়ে দেবে
                  না, নিজের ব্যবস্থা নিজেকে করতে হবে। Lab এর ৬ নম্বর Script ঠিক এই
                  কাজের।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "তারিখগুলো আবার মিলিয়ে নিন",
          content: (
            <p>
              উপরের সব তারিখ অক্টোবর 2026 এ CA/Browser Forum এর Ballot আর Let&apos;s
              Encrypt এর ঘোষণা থেকে মেলানো। এই ধরনের তারিখ মাঝে মাঝে বদলায়। কোনো
              সিদ্ধান্ত নেওয়ার আগে letsencrypt.org এর Blog আর cabforum.org দেখে নিন।
              তবে দিকটা বদলাবে না: আয়ু ছোট হবে, স্বয়ংক্রিয়তা বাধ্যতামূলক হবে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "private-key-and-files",
      subHeader: { index: "013", title: "Keys & File Formats" },
      title: <SectionTitle>Private Key আর Certificate এর ফাইলগুলো: কোনটা কী, কোথায় থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পুরো ব্যবস্থায় গোপন জিনিস একটাই, Private Key। এটা যার হাতে, সে
                আপনার সাইট সাজতে পারে, আর CT, CAA, Chain কোনো কিছুই তাকে আটকাতে পারবে
                না যতক্ষণ Certificate বৈধ। তাই প্রথমে জেনে নিন প্রতিটা Setup এ এটা
                কোথায় থাকে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Caddy:</strong> নিজের Data Folder এ। Docker এ চালালে সেটা{" "}
                  <code>/data</code>, আর Caddy এর নথি বলে এটাকে একটা Named Volume এ
                  রাখতে, যাতে Container নতুন হলেও Certificate আর চাবি থেকে যায়। Image
                  এর ভেতরে কখনো নয়।
                </ListItem>
                <ListItem>
                  <strong>certbot:</strong>{" "}
                  <code>/etc/letsencrypt/live/islandtours.example/privkey.pem</code>,
                  যা আসলে archive Folder এর একটা ফাইলের দিকে Link। শুধু root পড়তে
                  পারে।
                </ListItem>
                <ListItem>
                  <strong>Vercel, Cloudflare এর মতো Platform:</strong> চাবি
                  Platform এর কাছে, আপনি কখনো দেখেন না, আর দেখার দরকারও নেই।
                </ListItem>
                <ListItem>
                  <strong>নিজের Node App:</strong> ডিস্কের একটা ফাইল, যার Path আসে
                  Environment Variable থেকে, Repository থেকে কখনো নয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Permission টা দেখুন। Private Key শুধু মালিক পড়তে পারবেন (600),
                Certificate সবাই পড়তে পারে (644), কারণ সেটা প্রকাশ্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "permissions-and-pairs.sh",
          code: `ls -l localhost.key localhost.crt
# -rw-r--r--  1 you  staff  615 Oct 31 12:27 localhost.crt
# -rw-------  1 you  staff  241 Oct 31 12:27 localhost.key

# এই চাবি কি এই Certificate এর জোড়া? দুইটা Hash একই হলে হ্যাঁ
openssl x509 -in localhost.crt -noout -pubkey | openssl sha256
# SHA2-256(stdin)= a61877539bb82c8513b3411876cbaac3a17f8a2fed069649267cf495797ec008
openssl pkey -in localhost.key -pubout | openssl sha256
# SHA2-256(stdin)= a61877539bb82c8513b3411876cbaac3a17f8a2fed069649267cf495797ec008

# অন্য একটা চাবি হলে Hash আলাদা, আর Server চালু করতে গেলে:
#   Error: error:05800074:x509 certificate routines::key values mismatch
#     code: 'ERR_OSSL_X509_KEY_VALUES_MISMATCH'`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার নিয়মগুলো, যেগুলো প্রতিটা দল একবার না একবার ভাঙে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Permission 600, মালিক Server চালানো ব্যবহারকারী।</strong>{" "}
                  অন্য ব্যবহারকারী বা অন্য Process যেন পড়তে না পারে।
                </ListItem>
                <ListItem>
                  <strong>Git এ কখনো নয়।</strong> <code>.gitignore</code> এ{" "}
                  <code>*.key</code>, <code>*.pem</code>, <code>*.pfx</code> রাখুন, আর
                  GitHub এর Secret Scanning চালু রাখুন। একবার Push হলে History তে
                  থেকে যায়, পরে মুছলেও।
                </ListItem>
                <ListItem>
                  <strong>Docker Image এ কখনো নয়।</strong> Dockerfile এ COPY করলে
                  Image যার হাতে, চাবিও তার হাতে। চাবি আসবে Volume বা Secret থেকে, চলার
                  সময়।
                </ListItem>
                <ListItem>
                  <strong>Chat, Ticket, Email এ কখনো নয়।</strong> সাহায্য চাইতে
                  Certificate পাঠানো যায়, চাবি কখনো না।
                </ListItem>
                <ListItem>
                  <strong>Backup এনক্রিপ্ট করে।</strong> Caddy এর Volume এর Backup
                  খোলা পড়ে থাকলে সেটাও একটা ফাঁস।
                </ListItem>
                <ListItem>
                  <strong>ফাঁস হলে, দেরি না করে:</strong> নতুন চাবি দিয়ে নতুন
                  Certificate নিন, পুরনোটা বাতিল করুন (certbot এ{" "}
                  <code>certbot revoke --cert-name islandtours.example --reason keycompromise</code>),
                  crt.sh এ দেখুন অচেনা কোনো Certificate আছে কি না, আর DNS-01 এর API
                  Token ও বদলে ফেলুন যদি সেটাও একই জায়গায় ছিল।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শেষে ফাইলের নাম আর ফরম্যাট, যা প্রথম দেখায় সবচেয়ে বিভ্রান্ত করে। ফাইলের
                Extension আসলে খুব একটা কিছু বলে না, আসল কথা ভেতরে কী আছে। সবচেয়ে
                নির্ভরযোগ্য উপায় হলো <code>head -1</code> দিয়ে প্রথম লাইনটা দেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ফাইল", "ভেতরে কী", "প্রথম লাইন", "গোপন?", "কোথায় লাগে"],
          rows: [
            [mono("privkey.pem, .key"), "Private Key", "-----BEGIN PRIVATE KEY-----", "হ্যাঁ, একমাত্র", "শুধু Server এ"],
            [mono("cert.pem, .crt, .cer"), "শুধু Leaf Certificate", "-----BEGIN CERTIFICATE-----", "না", "যাচাই আর দেখার কাজে"],
            [mono("chain.pem"), "শুধু Intermediate গুলো", "-----BEGIN CERTIFICATE-----", "না", "কিছু পুরনো Setting এ আলাদা করে"],
            [mono("fullchain.pem"), "Leaf, তারপর Intermediate", "-----BEGIN CERTIFICATE-----, একাধিকবার", "না", "Server এ, Handshake এ যা পাঠানো হয়"],
            [mono(".csr"), "Certificate এর আবেদন: Public Key আর নাম", "-----BEGIN CERTIFICATE REQUEST-----", "না", "CA এর কাছে পাঠানো"],
            [mono(".der"), "একই Certificate, Text না করে সরাসরি Byte এ", "পড়ার মতো কিছু নেই", "না", "কিছু Java আর Windows যন্ত্র"],
            [mono(".pfx, .p12"), "চাবি আর Certificate এক ফাইলে, Password দিয়ে বন্ধ", "পড়ার মতো কিছু নেই", "হ্যাঁ, চাবি ভেতরে", "Windows, IIS, Azure, কিছু Java Server"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "convert-formats.sh",
          code: `# PEM থেকে DER, একই Certificate
openssl x509 -in localhost.crt -outform der -out localhost.der
file localhost.crt localhost.der
# localhost.crt: PEM certificate
# localhost.der: Certificate, Version=3

# চাবি আর Certificate একটা PFX এ। Password Command এ লিখবেন না,
# Environment Variable এ রাখুন, যাতে Shell History তে না থাকে
export PFX_PASSWORD="$(openssl rand -base64 24)"
openssl pkcs12 -export -inkey localhost.key -in localhost.crt \\
  -out localhost.pfx -passout env:PFX_PASSWORD
ls -l localhost.pfx
# -rw-------  1 you  staff  1096 Oct 31 12:29 localhost.pfx

# PFX এর ভেতরে কী আছে দেখা
openssl pkcs12 -in localhost.pfx -passin env:PFX_PASSWORD -nokeys 2>/dev/null \\
  | openssl x509 -noout -subject
# subject=CN=localhost`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "fullchain আর cert, কোনটা কোথায়",
          content: (
            <p>
              certbot এর live Folder এ চারটা ফাইল পাবেন: cert.pem, chain.pem,
              fullchain.pem আর privkey.pem। Server এর Setting এ লাগে শুধু দুইটা:
              fullchain.pem আর privkey.pem। সেকশন ০০৯ এর সবচেয়ে সাধারণ ভুলটা হয়
              fullchain এর জায়গায় cert.pem লিখে ফেললে, কারণ নাম দেখে cert টাই বেশি
              সঠিক মনে হয়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "install",
      subHeader: { index: "014", title: "Hands-on" },
      title: <SectionTitle>Certificate বসানো: localhost থেকে Production পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার পুরো পথটা হাতে কলমে, নিজের Laptop থেকে শুরু করে Island Tours
                এর মতো আসল Server পর্যন্ত। প্রথম ধাপ localhost এর জন্য একটা
                Self-signed Certificate। <code>-x509</code> মানে CSR না বানিয়ে সরাসরি
                Certificate, আর নিজের চাবি দিয়েই সই। <code>-addext</code> দিয়ে SAN এ
                localhost আর 127.0.0.1 দুইটাই রাখা হলো, কারণ Browser শুধু SAN দেখে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "self-signed-localhost.sh",
          code: `openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \\
  -keyout localhost.key -out localhost.crt -days 30 -subj "/CN=localhost" \\
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
chmod 600 localhost.key

openssl x509 -in localhost.crt -noout -subject -issuer -dates -ext subjectAltName
# subject=CN=localhost
# issuer=CN=localhost                  <- নিজের সই নিজে, তাই Subject আর Issuer একই
# notBefore=Oct 31 06:27:46 2026 GMT
# notAfter=Nov 30 06:27:46 2026 GMT
# X509v3 Subject Alternative Name:
#     DNS:localhost, IP Address:127.0.0.1`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই চাবি আর Certificate দিয়ে Node এর নিজের <code>https</code> Module এ
              একটা Server চালান (পুরো Code টা Lab এর ৩ নম্বরে, Path আর Port আসে
              Environment Variable থেকে)। তারপর তিনভাবে Client চালিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "talk-to-localhost.sh",
          code: `LAB_PORT=47680 TLS_KEY_FILE=localhost.key TLS_CERT_FILE=localhost.crt node 3-https-server.mjs
# https://localhost:47680 is ready

# আরেক Terminal এ। ১. সাধারণ curl: কেউ জামিন হয়নি, তাই অস্বীকার
curl -sS https://localhost:47680/tours
# curl: (60) SSL certificate problem: self signed certificate

# ২. শুধু এই Certificate টা বিশ্বাস করতে বলুন
curl -sS --cacert localhost.crt https://localhost:47680/tours
# hello over TLS, you asked for /tours

# ৩. Node এর fetch, প্রথমে এমনি, তারপর এই Certificate যোগ করে
node -e 'fetch("https://localhost:47680/").then(r => r.text()).then(console.log).catch(e => console.log(e.cause?.code))'
# DEPTH_ZERO_SELF_SIGNED_CERT
NODE_EXTRA_CA_CERTS=localhost.crt node -e 'fetch("https://localhost:47680/").then(r => r.text()).then(console.log)'
# hello over TLS, you asked for /

# Server এর Terminal এ প্রথম দুইটা ব্যর্থ চেষ্টার চিহ্ন:
# tls error from a client: ERR_SSL_TLSV1_ALERT_UNKNOWN_CA`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Browser এ <code>https://localhost:47680</code> খুললে পুরো পাতা জুড়ে
                সতর্কবার্তা আসবে, Chrome এ NET::ERR_CERT_AUTHORITY_INVALID। ক্যাফের
                পর্যটক ঠিক এই পাতাটাই দেখেছিলেন, একই কারণে: কেউ জামিন হয়নি। নিচে
                Advanced, তারপর Proceed চাপলে পাতা খোলে। নিজের যন্ত্রের নিজের Server
                এর বেলায় এক মুহূর্তের জন্য চলে, কিন্তু অভ্যাস করবেন না। যে হাত
                localhost এ না ভেবে Proceed চাপে, সেই হাত একদিন ক্যাফেতেও চাপবে।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিদিনের Development এর জন্য ভালো উপায় হলো এমন একটা Certificate,
                যা আপনার যন্ত্র সত্যিই বিশ্বাস করে। <strong>mkcert</strong> নামের
                ছোট্ট যন্ত্রটা ঠিক এটা করে: আপনার যন্ত্রে একটা নিজস্ব Root বানিয়ে
                Trust Store এ বসায়, তারপর সেই Root দিয়ে localhost এর Certificate সই
                করে। Next.js এর Dev Server এর <code>--experimental-https</code>{" "}
                Option ও ভেতরে ভেতরে mkcert দিয়েই এটা করে, এই Project এর Next.js এর
                নথিতে লেখা আছে। এই যন্ত্রে mkcert বসানো নেই, তাই নিচের কমান্ডগুলো
                নমুনা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "trusted-local-dev.sh",
          code: `# নমুনা, mkcert বসানো থাকলে
mkcert -install                     # একবারই: নিজের Local Root বানিয়ে Trust Store এ বসায়
mkcert localhost 127.0.0.1 ::1      # localhost+2.pem আর localhost+2-key.pem

# Next.js এর Dev Server, নিজে থেকে বিশ্বস্ত localhost Certificate বানিয়ে নেয়
next dev --experimental-https

# mkcert এর Root এর চাবি (rootCA-key.pem) কাউকে দেবেন না, Repository তে রাখবেন না।
# যার হাতে এটা, সে আপনার যন্ত্রের কাছে যেকোনো সাইট সাজতে পারে।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Production। Island Tours এর Server এ Caddy চলে, আর Caddy এর
                সবচেয়ে বড় গুণ হলো আপনাকে Certificate নিয়ে প্রায় কিছুই করতে হয় না।
                Site এর নাম লিখলেই Caddy নিজে ACME দিয়ে Certificate আনে, Port 80 কে
                HTTPS এ পাঠিয়ে দেয়, আর মেয়াদ শেষের আগে নিজে নবায়ন করে। নিচের
                Caddyfile টা নমুনা, নিজের Server এর মতো বদলে নেবেন। Email আসে
                Environment Variable থেকে, Caddyfile এ লেখা থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "Caddyfile",
          code: `# নমুনা: Island Tours এর মতো একটা Server
{
	# ACME Account এর Email, Environment Variable থেকে
	email {$ACME_EMAIL}
	# ECDSA P-256 চাবি, Caddy এর Default ও এটাই
	key_type p256
}

# www থেকে মূল নামে স্থায়ী Redirect। এই নামেরও নিজের Certificate লাগে,
# কারণ Redirect পাঠানোর আগেই Handshake হয়ে যায়
www.islandtours.example {
	redir https://islandtours.example{uri} permanent
}

islandtours.example {
	reverse_proxy 127.0.0.1:3000
}`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "yaml",
          filename: "compose.yaml (অংশ)",
          code: `# নমুনা: Caddy এর Certificate আর চাবি যেন Container বদলালেও থাকে
    volumes:
      - caddy_data:/data       # Certificate, Private Key আর ACME Account এখানে
      - caddy_config:/config

volumes:
  caddy_data:
  caddy_config:`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              অনেক Server এ Caddy এর বদলে Nginx থাকে, আর Certificate আনে certbot।
              তখন কাজটা দুই ভাগে: certbot Certificate আনে আর নবায়ন করে, Nginx শুধু
              ফাইলগুলো পড়ে। নিচের Setting আর কমান্ডগুলো নমুনা, এই যন্ত্রে চালানো
              হয়নি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "nginx",
          filename: "/etc/nginx/sites-available/islandtours.example (নমুনা)",
          code: `server {
    listen 443 ssl;
    http2 on;
    server_name islandtours.example;

    # fullchain: Leaf আগে, তারপর Intermediate। শুধু cert.pem দিলে শিকল ভাঙে
    ssl_certificate     /etc/letsencrypt/live/islandtours.example/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/islandtours.example/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "certbot-nginx.sh (নমুনা)",
          code: `# Certificate আনা, Nginx এর Setting এ নিজে বসিয়ে দেয়
sudo certbot --nginx -d islandtours.example -d www.islandtours.example

# কোন Certificate কবে শেষ হচ্ছে
sudo certbot certificates

# নবায়নের মহড়া, আসলে কিছু বদলায় না
sudo certbot renew --dry-run

# Setting বদলালে আগে পরীক্ষা, তারপর Reload
sudo nginx -t && sudo systemctl reload nginx`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আর Vercel এর মতো Platform এ কাজ আরও কম। Domain যোগ করে DNS ঠিক
                করলেই Platform নিজে Certificate আনে, নবায়ন করে, চাবি নিজের কাছে রাখে।
                কোন Record কোথায় বসাতে হয়, তা Module 04 এর{" "}
                <Link href="/devops/topic/domain-setup-guide" className={linkClass}>
                  Domain Setup Guide
                </Link>{" "}
                লেসনে আছে। আর সামনে Cloudflare এর Proxy থাকলে Browser দেখে Cloudflare
                এর Certificate, আর Cloudflare থেকে আপনার Server পর্যন্ত আরেকটা
                Connection হয়। সেখানে Full (strict) রাখতে Server এও একটা বৈধ
                Certificate লাগে, Module 04 এর{" "}
                <Link href="/devops/topic/cloudflare-dns" className={linkClass}>
                  Cloudflare DNS
                </Link>{" "}
                লেসনে SSL/TLS Mode গুলো দেখুন।
              </ContentParagraph>
              <ContentParagraph>
                যে পথেই বসান, বসানোর পর একই তিনটা যাচাই করুন, আর পারলে অন্য যন্ত্র
                থেকে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>openssl s_client -connect islandtours.example:443 -servername islandtours.example</code>:
                  শিকলে অন্তত দুইটা Certificate, আর Verify return code: 0 (ok)।
                </ListItem>
                <ListItem>
                  <code>curl -sSI https://islandtours.example</code>: কোনো
                  Certificate Error ছাড়া একটা Status Line।
                </ListItem>
                <ListItem>
                  <code>www</code> সহ প্রতিটা নাম আলাদা করে খুলুন, আর মেয়াদ কতদিন
                  বাকি দেখুন, Lab এর ৬ নম্বর Script দিয়ে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, যেখানে Certificate কেউ হাতে ছোঁয় না</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর দলে কেউ শেষ কবে নিজের হাতে একটা Certificate বসিয়েছেন,
                কেউ মনে করতে পারেন না। এটা অবহেলা নয়, এটাই লক্ষ্য। কিন্তু হাতে না ছোঁয়া
                মানে চিন্তা না করা নয়। Certificate নিয়ে Island Tours এ যে সাতটা
                সিদ্ধান্ত নেওয়া হয়েছে, সেগুলো দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Caddy আনে, Caddy নবায়ন করে।</strong> 103.94.135.2 এর Caddy
                  islandtours.example আর www.islandtours.example এর জন্য নিজে
                  Certificate আনে, ECDSA P-256 চাবিতে, Let&apos;s Encrypt থেকে, না পেলে
                  ZeroSSL থেকে। প্রতি নবায়নে নতুন চাবি তৈরি হয়, পুরনো চাবি ফাঁস হলেও
                  তার আয়ু ফুরায় পুরনো Certificate এর সাথে।
                </ListItem>
                <ListItem>
                  <strong>CAA তে দুইটা CA।</strong> letsencrypt.org আর sectigo.com,
                  ঠিক যে দুইটা Caddy ব্যবহার করতে পারে। আর কেউ islandtours.example এর
                  Certificate দিতে পারে না।
                </ListItem>
                <ListItem>
                  <strong>Port 80 খোলা, কিন্তু শুধু দুইটা কাজে।</strong> ACME এর
                  HTTP-01 Challenge, আর HTTP থেকে HTTPS এ Redirect। একবার Firewall
                  গোছাতে গিয়ে কেউ Port 80 বন্ধ করেছিলেন, তিন সপ্তাহ পর নবায়ন ব্যর্থ
                  হওয়ার Alarm বাজার আগে কেউ টেরও পায়নি। তখন থেকে Firewall এর নিয়মে
                  পাশে লেখা থাকে কেন Port 80 খোলা।
                </ListItem>
                <ListItem>
                  <strong>চাবি থাকে Volume এ, Image এ বা Repository তে নয়।</strong>{" "}
                  Caddy এর <code>caddy_data</code> Volume প্রতি রাতে এনক্রিপ্ট করে
                  Backup হয়। Repository তে কোনো .pem বা .key নেই, Secret Scanning সেটা
                  পাহারা দেয়।
                </ListItem>
                <ListItem>
                  <strong>আলাদা Host, আলাদা চাবি।</strong> api.islandtours.example
                  চলে 103.94.135.3 এ, নিজের Caddy আর নিজের Certificate নিয়ে। একটা
                  Server ভাঙলে অন্যটার পরিচয় নিরাপদ। Wildcard ব্যবহার হয় না।
                </ListItem>
                <ListItem>
                  <strong>নজরদারি দুই রকম।</strong> প্রতিদিন একটা ছোট Job Lab এর ৬
                  নম্বর Script এর মতো তিনটা নামের মেয়াদ দেখে, আর{" "}
                  <code>WARN_DAYS</code> এর চেয়ে কম দিন বাকি থাকলে Alarm দেয়। সংখ্যাটা
                  Environment Variable এ, কারণ 45 দিনের Certificate এ চলে গেলে এটা
                  বদলাতে হবে, Code নয়। সাথে একটা CT নজরদারি সেবা, যা
                  islandtours.example এর যেকোনো নতুন Certificate দেখলেই জানায়, Caddy এর
                  নেওয়া হোক বা অচেনা কারো।
                </ListItem>
                <ListItem>
                  <strong>Mobile App এ Leaf Pinning নেই।</strong> একসময় প্রস্তাব
                  এসেছিল App এর ভেতরে islandtours.example এর Certificate এর চাবি গেঁথে
                  দিতে, যাতে অন্য কোনো Certificate মানা না হয়। সিদ্ধান্ত হয়েছিল না,
                  কারণ প্রতি নবায়নে চাবি বদলায়, আর একটা নবায়নের পরেই পুরনো App গুলো
                  কাজ করা বন্ধ করে দিত।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর একটা ঘটনা, যা দল এখনো মনে রাখে। একবার Staging এর একটা Nginx এ
                কেউ fullchain.pem এর বদলে cert.pem লিখেছিলেন। সবার Laptop এর Browser
                এ Staging দিব্যি খুলছিল। কিন্তু Payment Gateway এর Webhook দুই ঘণ্টা
                ধরে ব্যর্থ হচ্ছিল, Log এ লেখা unable to get local issuer certificate।
                সমাধান ছিল এক শব্দের। তারপর থেকে Deploy এর Pipeline এ একটা ধাপ আছে,
                যা openssl s_client দিয়ে শিকলের দৈর্ঘ্য গোনে, আর দুইয়ের কম হলে Deploy
                থামিয়ে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Certificate এর জীবন, জন্ম থেকে বিদায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              islandtours.example এর একটা Certificate এর পুরো জীবন, Caddy এর চাবি
              বানানো থেকে ক্যাফের পর্যটকের ফোনে তালার চিহ্ন পর্যন্ত, আর তারপর তার
              বিদায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Caddy একজোড়া চাবি বানায়",
              description:
                "103.94.135.2 এর Caddy একটা নতুন ECDSA P-256 Private Key বানিয়ে caddy_data Volume এ রাখে। এই চাবি এই Server ছেড়ে কোথাও যাবে না।",
            },
            {
              title: "Let's Encrypt এর কাছে Order",
              description:
                "Caddy ACME দিয়ে জানায়, islandtours.example এর জন্য Certificate চাই। Let's Encrypt একটা Token দিয়ে বলে, আগে প্রমাণ করুন নামটা আপনার।",
            },
            {
              title: "Challenge পার হওয়া",
              description:
                "Caddy Port 80 এ /.well-known/acme-challenge/ এর নিচে Token টা দেখায়। Let's Encrypt কয়েকটা আলাদা জায়গা থেকে DNS দিয়ে নামটা খুঁজে 103.94.135.2 এ এসে Token মেলায়। কয়েক জায়গা থেকে দেখার কারণ, কোনো একটা পথে কেউ DNS বা Route চুরি করে থাকলেও যেন ধরা পড়ে।",
            },
            {
              title: "CSR আর সই",
              description:
                "Caddy Public Key আর নামের তালিকা দিয়ে CSR পাঠায়। Let's Encrypt এর Intermediate সই করার আগে Certificate টা প্রকাশ্য CT Log এ লেখে, রসিদ ভেতরে বসায়, তারপর Leaf আর Intermediate ফেরত দেয়।",
            },
            {
              title: "Caddy পরিবেশন শুরু করে",
              description:
                "এখন থেকে Port 443 এর প্রতিটা Handshake এ Caddy Leaf আর Intermediate পাঠায়, আর Private Key দিয়ে CertificateVerify সই করে।",
            },
            {
              title: "ক্যাফেতে পর্যটকের ফোন যাচাই করে",
              description:
                "আসল Server এর সাথে কথা হলে আটটা যাচাই পার হয়, তালার চিহ্ন আসে। প্রতারকের Laptop এর সাথে কথা হলে প্রথম বা তৃতীয় যাচাইয়েই থামে, কারণ প্রতারকের কাছে islandtours.example এর কোনো বৈধ Certificate নেই, আর আসল Certificate কপি করলেও চাবি নেই।",
            },
            {
              title: "মেয়াদের শেষ ভাগে নবায়ন",
              description:
                "মেয়াদের শেষ এক তৃতীয়াংশ শুরু হলে Caddy নিজে থেকে প্রথম ধাপ থেকে আবার শুরু করে, নতুন চাবি, নতুন Challenge, নতুন Certificate। প্রতিদিনের Job দেখে নেয় নতুন মেয়াদ এসেছে কি না।",
            },
            {
              title: "পুরনো Certificate এর বিদায়",
              description:
                "পুরনোটা নিজের Not After এ চুপচাপ অচল হয়ে যায়, কেউ কিছু করে না। চাবি ফাঁস হলে বিদায় আগেই: বাতিল করা, নতুন চাবি, নতুন Certificate, আর CT তে অচেনা কিছু আছে কি না খোঁজা।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিচের Lab টা আগে করুন</strong>, ছয়টা পরীক্ষায় আসল Certificate
                পড়া, সই করা, নিজের CA বানানো, ইচ্ছা করে ভাঙা আর মেয়াদ পাহারা দেওয়া,
                সব নিজের যন্ত্রে হবে।
              </ListItem>
              <ListItem>
                <strong>badssl.com</strong>, ইচ্ছা করে ভাঙা Certificate এর সাইটের
                সংগ্রহ: মেয়াদ শেষ, ভুল নাম, Self-signed, অবিশ্বস্ত Root, অসম্পূর্ণ
                শিকল। প্রতিটা Browser এ খুলে Error গুলো নিজের চোখে দেখুন।{" "}
                <a href="https://badssl.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  badssl.com
                </a>
              </ListItem>
              <ListItem>
                <strong>Let&apos;s Encrypt, How It Works আর Chain of Trust</strong>,
                ACME এর ধাপ আর তাদের এখনকার Root আর Intermediate এর তালিকা।{" "}
                <a href="https://letsencrypt.org/how-it-works/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  letsencrypt.org/how-it-works
                </a>
                {" আর "}
                <a href="https://letsencrypt.org/certificates/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  letsencrypt.org/certificates
                </a>
              </ListItem>
              <ListItem>
                <strong>From 90 to 45</strong>, Let&apos;s Encrypt এর আয়ু কমানোর
                পুরো সময়সূচি আর নবায়নের পরামর্শ।{" "}
                <a href="https://isrg.org/post/from-90-to-45/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  isrg.org/post/from-90-to-45
                </a>
              </ListItem>
              <ListItem>
                <strong>Caddy, Automatic HTTPS</strong>, Caddy কখন কোন Certificate
                আনে, কোথায় রাখে, ব্যর্থ হলে কী করে।{" "}
                <a href="https://caddyserver.com/docs/automatic-https" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  caddyserver.com/docs/automatic-https
                </a>
              </ListItem>
              <ListItem>
                <strong>crt.sh</strong>, প্রকাশ্য CT খাতা খোঁজার সাইট। নিজের বা
                প্রিয় কোনো Domain লিখে দেখুন কবে কোন Certificate নেওয়া হয়েছে।{" "}
                <a href="https://crt.sh" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  crt.sh
                </a>
              </ListItem>
              <ListItem>
                <strong>SSL Labs Server Test</strong>, যেকোনো প্রকাশ্য সাইটের শিকল,
                Protocol আর দুর্বলতার পূর্ণ রিপোর্ট।{" "}
                <a href="https://www.ssllabs.com/ssltest/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  ssllabs.com/ssltest
                </a>
              </ListItem>
              <ListItem>
                <strong>Mozilla এর CRLite লেখা</strong>, বাতিল তালিকা কীভাবে দ্রুত
                আর গোপনীয়তা রেখে দেখা যায়।{" "}
                <a
                  href="https://hacks.mozilla.org/2025/08/crlite-fast-private-and-comprehensive-certificate-revocation-checking-in-firefox/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  hacks.mozilla.org, CRLite
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 5280 আর RFC 8555</strong>, X.509 Certificate আর ACME এর
                মূল নিয়মের কাগজ। পুরোটা পড়ার দরকার নেই, কোনো ঘরের সঠিক মানে জানতে
                খুলবেন।{" "}
                <a href="https://www.rfc-editor.org/rfc/rfc5280" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  rfc5280
                </a>
                {" আর "}
                <a href="https://www.rfc-editor.org/rfc/rfc8555" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  rfc8555
                </a>
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 18 */
    {
      id: "recap",
      subHeader: { index: "018", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  এনক্রিপশন বলে কথা গোপন, বলে না কার সাথে। মাঝখানের প্রতারক দুইটা
                  নিখুঁত Handshake করতে পারে। পরিচয়ের প্রমাণ আসে আলাদা জায়গা থেকে।
                </ListItem>
                <ListItem>
                  Key Pair: Public Key খোলা তালা, সবাইকে দেওয়া যায়। Private Key
                  একমাত্র চাবি, কাউকে না। Private থেকে Public সহজ, উল্টোটা অসম্ভব।
                </ListItem>
                <ListItem>
                  Digital Signature: তথ্যের Hash এর উপর Private Key এর সই। Public Key
                  দিয়ে যে কেউ যাচাই করে। প্রমাণ করে কে লিখেছে আর বদলায়নি, লুকায় না
                  কিছু। TLS 1.3 এ Certificate এর চাবি শুধু সই করে, গোপন চাবি আসে Key
                  Exchange থেকে।
                </ListItem>
                <ListItem>
                  Public Key এর গায়ে নাম লেখা থাকে না। Certificate হলো CA এর সই করা
                  জামিননামা: এই চাবি এই নামের। Server Handshake এ Private Key দিয়ে সই
                  করে দেখায় যে জোড়াটা তার কাছে আছে, তাই কপি করা Certificate অচল।
                </ListItem>
                <ListItem>
                  একটা X.509 Certificate এ SAN, Public Key, Issuer, Validity, Key
                  Usage, CA:FALSE আর Issuer এর সই। নাম মেলে SAN দিয়ে, CN দিয়ে নয়।
                </ListItem>
                <ListItem>
                  Chain of Trust: Trust Store এর Root, তার সই করা Intermediate, তার
                  সই করা Leaf। Server পাঠায় Leaf আর Intermediate, মানে fullchain।
                  Intermediate বাদ পড়লে নিজের Browser এ ঠিক দেখায়, curl আর App এ ভাঙে।
                </ListItem>
                <ListItem>
                  Let&apos;s Encrypt আর ACME: HTTP-01 Port 80 এ, DNS-01 TXT Record এ,
                  Wildcard এর জন্য শুধু DNS-01। CAA বলে দেয় কোন CA দিতে পারবে।
                </ListItem>
                <ListItem>
                  বাতিল করা দুর্বল, তাই আয়ু ছোট হচ্ছে: সর্বোচ্চ 200 দিন এখন, 2029
                  এ 47। Let&apos;s Encrypt 90 থেকে 2028 এ 45। হাতে নবায়ন শেষ, নজরদারি
                  বাধ্যতামূলক।
                </ListItem>
                <ListItem>
                  একমাত্র গোপন ফাইল Private Key: 600, Git আর Image এর বাইরে, Backup
                  এনক্রিপ্ট করা, ফাঁস হলে নতুন চাবি আর বাতিল।
                </ListItem>
                <ListItem>
                  কখনো যাচাই বন্ধ করে Error চুপ করাবেন না। নিজের CA বিশ্বাস করাতে
                  --cacert আর NODE_EXTRA_CA_CERTS।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার ক্যাফের গল্পটা একবার টানা বলুন, যেভাবে অন্য কাউকে বলবেন। পর্যটক
                ভুয়া Wi-Fi তে যুক্ত হলেন। প্রতারকের Resolver islandtours.example এর
                জন্য নিজের ঠিকানা দিল। ফোন প্রতারকের Laptop এর সাথে Handshake শুরু
                করল, আর একটা Certificate চাইল। প্রতারকের হাতে দুইটা পথ ছিল। নিজে নিজে
                islandtours.example নামে Certificate বানালে কোনো বিশ্বস্ত Root এ
                শিকল পৌঁছায় না। আসল Certificate কপি করলে CertificateVerify এর সই
                দিতে পারে না, কারণ চাবিটা আছে শুধু 103.94.135.2 এ। দুই পথেই ফোন
                থামল, আর পর্যটককে সতর্ক করল। আর যে মুহূর্তে পর্যটক জাহাজে উঠে
                Mobile Data তে আবার খুললেন, আসল Server এর আসল শিকল আটটা যাচাই পার
                হলো, আর তালার চিহ্ন ফিরে এলো।
              </ContentParagraph>
              <ContentParagraph>
                এই অনুচ্ছেদটা না দেখে বলতে পারলে, আর প্রতিটা বাক্যের পরে কেউ কেন
                জিজ্ঞেস করলে উত্তর দিতে পারলে, এই লেসন আপনার হয়ে গেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৯, Full HTTPS Journey",
          content: (
            <p>
              এই মডিউলে এখন আপনার হাতে সব অংশ আছে: URL, HTTP এর Request আর
              Response, Method, Status Code, Header, Cookie, Session আর JWT, TLS এর
              Handshake, আর আজকের Certificate। কিন্তু একটা আসল Request এ এই সবগুলো
              কোন ক্রমে ঘটে, কোথায় কত মিলিসেকেন্ড যায়, আর কিছু ভাঙলে কোন অংশটা
              দোষী, সেটা এখনো একটা গল্পে জোড়া লাগানো হয়নি। পরের লেসন ঠিক সেটাই করবে:
              Address Bar এ islandtours.example/tours/saint-martin লেখা থেকে পাতা
              আঁকা পর্যন্ত, একটা পুরো HTTPS Journey।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Man in the Middle", "মাঝখানে বসে দুই দিকে আলাদা Handshake। এনক্রিপশন ঠেকায় না, Certificate ঠেকায়"],
      ["Public Key", "খোলা তালা আর সিলের ছবি। সবাইকে দেওয়া যায়, Certificate এর ভেতরে থাকে"],
      ["Private Key", "একমাত্র চাবি আর সিলমোহর। শুধু Server এ, 600, কখনো Git বা Image এ নয়"],
      ["Hash", "যেকোনো তথ্যের ৩২ Byte এর আঙুলের ছাপ। এক Bit বদলালে পুরো বদলায়"],
      ["Digital Signature", "Hash এর উপর Private Key এর সই। প্রমাণ করে কে লিখেছে আর বদলায়নি"],
      ["CertificateVerify", "Handshake এ Server এর সই, প্রমাণ যে Certificate এর চাবি তার কাছে আছে"],
      ["Certificate", "CA এর সই করা জামিননামা: এই Public Key এই নামের। প্রকাশ্য, গোপন নয়"],
      ["SAN", "Certificate যে যে নামের জন্য বৈধ। Browser শুধু এটাই মেলায়"],
      ["CA", "জামিনদার প্রতিষ্ঠান। কোনটা বিশ্বস্ত, ঠিক করে OS আর Browser এর Trust Store"],
      ["Root, Intermediate, Leaf", "Root ভল্টে আর Trust Store এ, Intermediate প্রতিদিন সই করে, Leaf আপনার সাইটের"],
      ["fullchain", "Leaf আর Intermediate একসাথে। Server এ এটাই দিতে হয়, শুধু cert.pem নয়"],
      ["DV, OV, EV", "CA কতটা যাচাই করেছে। Browser এ তিনটাই একই তালা, DV ই যথেষ্ট"],
      ["Wildcard", "*.islandtours.example, ঠিক এক স্তর। Let's Encrypt এ শুধু DNS-01 দিয়ে"],
      ["ACME", "যন্ত্রের সাথে যন্ত্রের Certificate নেওয়া। HTTP-01, DNS-01, TLS-ALPN-01"],
      ["CAA", "DNS Record, কোন CA আপনার নামে Certificate দিতে পারবে"],
      ["Revocation", "মেয়াদের আগে বাতিল। CRL আর OCSP দুর্বল, Let's Encrypt এখন শুধু CRL"],
      ["Certificate Transparency", "প্রতিটা প্রকাশ্য Certificate প্রকাশ্য খাতায়। crt.sh এ খোঁজা যায়"],
      ["মেয়াদ", "সর্বোচ্চ এখন 200 দিন, 2029 এ 47। Let's Encrypt 90 থেকে 2028 এ 45"],
      ["PEM, DER, PFX", "Text এ লেখা, Byte এ লেখা, আর চাবি সহ Password দেওয়া এক ফাইল"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "TLS 1.3 এর Handshake এ Server এর Certificate এর ভেতরের Public Key দিয়ে ফোন আসলে কী করে?",
        options: [
          {
            key: "A",
            text: "Session এর গোপন চাবিটা Encrypt করে Server কে পাঠায়",
            isCorrect: false,
            explanation:
              "TLS 1.2 পর্যন্ত RSA দিয়ে এটা হতো। TLS 1.3 এই পদ্ধতি বাদ দিয়েছে, গোপন চাবি আসে ECDHE Key Exchange থেকে।",
          },
          {
            key: "B",
            text: "Server এর CertificateVerify সইটা যাচাই করে, যাতে বোঝা যায় Private Key টা Server এর কাছেই আছে",
            isCorrect: true,
            explanation:
              "ঠিক। Certificate এর চাবি আজ শুধু সইয়ের কাজে লাগে। এই সই-ই Key Exchange টাকে নামের সাথে বেঁধে দেয়।",
          },
          {
            key: "C",
            text: "প্রতিটা HTTP Request আলাদা করে Encrypt করে",
            isCorrect: false,
            explanation:
              "Request গুলো Encrypt হয় Key Exchange থেকে পাওয়া Symmetric চাবি দিয়ে, যা অনেক দ্রুত।",
          },
          {
            key: "D",
            text: "কিছুই করে না, Public Key টা শুধু দেখানোর জন্য",
            isCorrect: false,
            explanation:
              "Public Key ই সেই ছবি, যার সাথে Server এর মুখ মেলানো হয়। এটা ছাড়া Certificate এর কোনো মানে থাকে না।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা বার্তার উপর বৈধ Digital Signature থাকলে কোনটা প্রমাণ হয়?",
        options: [
          {
            key: "A",
            text: "বার্তাটা গোপন, আর কেউ পড়তে পারেনি",
            isCorrect: false,
            explanation: "সই কিছু লুকায় না। সই করা বার্তা যে কেউ পড়তে পারে।",
          },
          {
            key: "B",
            text: "বার্তাটা নির্দিষ্ট একজন মানুষের নামে লেখা, যেমন Island Tours",
            isCorrect: false,
            explanation:
              "সই বলে Private Key এর মালিক সই করেছে। মালিকটা কে, সেটা সই বলে না। সেই কাজটা Certificate এর।",
          },
          {
            key: "C",
            text: "এই Public Key এর জোড়া Private Key এর মালিক ঠিক এই Byte গুলোতে সই করেছে, আর পরে কেউ বদলায়নি",
            isCorrect: true,
            explanation:
              "ঠিক। দুইটা কথা একসাথে: কোন চাবি সই করেছে, আর বার্তা অক্ষত। একটা Space বদলালেও সই আর মেলে না।",
          },
          {
            key: "D",
            text: "বার্তাটা গত এক ঘণ্টার মধ্যে পাঠানো",
            isCorrect: false,
            explanation:
              "সাধারণ সইয়ে সময়ের কোনো প্রমাণ থাকে না। সময় লাগলে বার্তার ভেতরেই সময় লিখে সই করতে হয়, যেমন JWT এর exp।",
          },
        ],
      },
      {
        id: 3,
        text: "প্রতারক islandtours.example এর আসল Certificate টা কপি করে নিজের Laptop এ বসাল। পর্যটকের ফোনে কী হবে?",
        options: [
          {
            key: "A",
            text: "তালার চিহ্ন আসবে, কারণ Certificate টা আসল",
            isCorrect: false,
            explanation:
              "কাগজটা আসল, কিন্তু প্রতারককে Handshake এ সেই Certificate এর Private Key দিয়ে সই করে দেখাতে হবে।",
          },
          {
            key: "B",
            text: "Handshake ব্যর্থ হবে, কারণ প্রতারকের কাছে মেলানো Private Key নেই, তাই CertificateVerify দিতে পারবে না",
            isCorrect: true,
            explanation:
              "ঠিক। মুখ না মিললে চুরি করা পাসপোর্ট অচল। আসলে প্রতারকের Server ভুল চাবি দিয়ে চালুই হবে না: key values mismatch।",
          },
          {
            key: "C",
            text: "ফোন NET::ERR_CERT_DATE_INVALID দেখাবে",
            isCorrect: false,
            explanation: "মেয়াদ তো ঠিক আছে। সমস্যা মেয়াদে নয়, চাবিতে।",
          },
          {
            key: "D",
            text: "CA সাথে সাথে Certificate টা বাতিল করে দেবে",
            isCorrect: false,
            explanation:
              "Certificate কপি করা কোনো অপরাধ নয়, প্রতিটা Visitor ই একটা কপি পায়। বাতিল করা লাগে Private Key ফাঁস হলে।",
          },
        ],
      },
      {
        id: 4,
        text: "আপনার Laptop এর Chrome এ Staging সাইট ঠিকই খুলছে, কিন্তু Payment Gateway এর Webhook ব্যর্থ, Log এ unable to get local issuer certificate। সবচেয়ে সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "Payment Gateway এর Trust Store পুরনো",
            isCorrect: false,
            explanation:
              "অসম্ভব নয়, কিন্তু প্রথম সন্দেহ নিজের Server। আর Gateway অন্য হাজার সাইটে ঠিকই পৌঁছাচ্ছে।",
          },
          {
            key: "B",
            text: "Server Intermediate পাঠাচ্ছে না, শুধু Leaf। Chrome নিজে খুঁজে নিচ্ছে, Gateway নিচ্ছে না",
            isCorrect: true,
            explanation:
              "ঠিক। fullchain এর বদলে cert.pem বসানো সবচেয়ে সাধারণ কারণ। openssl s_client এ শিকলে শুধু 0 থাকবে।",
          },
          {
            key: "C",
            text: "Certificate এর মেয়াদ শেষ",
            isCorrect: false,
            explanation:
              "মেয়াদ শেষ হলে Chrome ও সতর্ক করত, আর লেখা হতো certificate has expired।",
          },
          {
            key: "D",
            text: "Webhook এর URL এ ভুল Port",
            isCorrect: false,
            explanation:
              "ভুল Port হলে Connection ই হতো না, Certificate এর প্রশ্নই আসত না।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা Certificate এর SAN এ আছে islandtours.example আর *.islandtours.example। কোন নামটা এটা ঢাকে না?",
        options: [
          {
            key: "A",
            text: "islandtours.example",
            isCorrect: false,
            explanation: "মূল নামটা তালিকায় আলাদা করে আছে, তাই ঢাকে।",
          },
          {
            key: "B",
            text: "blog.islandtours.example",
            isCorrect: false,
            explanation: "এক স্তরের উপনাম, Wildcard ঠিক এটাই ঢাকে।",
          },
          {
            key: "C",
            text: "admin.islandtours.example",
            isCorrect: false,
            explanation: "এটাও এক স্তরের উপনাম।",
          },
          {
            key: "D",
            text: "shop.seagull.islandtours.example",
            isCorrect: true,
            explanation:
              "ঠিক। * শুধু ঠিক এক স্তর ঢাকে। দুই স্তরের নামের জন্য আলাদা নাম বা আলাদা Wildcard লাগবে।",
          },
        ],
      },
      {
        id: 6,
        text: "Let's Encrypt থেকে *.islandtours.example নিতে DNS-01 Challenge কেন লাগে?",
        options: [
          {
            key: "A",
            text: "কারণ Wildcard এর দাম বেশি, তাই বাড়তি যাচাই",
            isCorrect: false,
            explanation: "Let's Encrypt এর সব Certificate বিনা পয়সার।",
          },
          {
            key: "B",
            text: "কারণ Wildcard মানে এক স্তরের যেকোনো নামের দাবি, আর সেটা প্রমাণ করতে পুরো Zone এর নিয়ন্ত্রণ দেখাতে হয়, একটা Server এর ফাইল দিয়ে নয়",
            isCorrect: true,
            explanation:
              "ঠিক। HTTP-01 শুধু প্রমাণ করে একটা নির্দিষ্ট Host আপনার। DNS এ TXT বসাতে পারা মানে Zone আপনার হাতে।",
          },
          {
            key: "C",
            text: "কারণ Wildcard Certificate Port 80 এ চলে না",
            isCorrect: false,
            explanation:
              "Certificate কোন Port এ ব্যবহার হবে তার সাথে Challenge এর সম্পর্ক নেই।",
          },
          {
            key: "D",
            text: "কারণ DNS-01 দ্রুততর",
            isCorrect: false,
            explanation:
              "গতি কারণ নয়। DNS এর পরিবর্তন ছড়াতে সময় লাগে বলে DNS-01 প্রায়ই বরং ধীর।",
          },
        ],
      },
      {
        id: 7,
        text: "Certificate এর সর্বোচ্চ আয়ু 398 দিন থেকে কমিয়ে 2029 এ 47 দিন করার মূল কারণ কী?",
        options: [
          {
            key: "A",
            text: "CA গুলো বেশি Certificate বিক্রি করতে চায়",
            isCorrect: false,
            explanation:
              "Let's Encrypt এর Certificate বিনা পয়সার, আর Ballot এর পক্ষে Browser কোম্পানিগুলোও ভোট দিয়েছে।",
          },
          {
            key: "B",
            text: "ছোট Certificate এর Handshake দ্রুত",
            isCorrect: false,
            explanation: "মেয়াদের সাথে Certificate এর আকার বা গতির কোনো সম্পর্ক নেই।",
          },
          {
            key: "C",
            text: "বাতিল করার ব্যবস্থা নির্ভরযোগ্য নয়, তাই চুরি করা চাবি যেন অল্প দিনই কাজে লাগে, আর সবাই স্বয়ংক্রিয় নবায়নে যেতে বাধ্য হয়",
            isCorrect: true,
            explanation:
              "ঠিক। OCSP আর CRL অনেক Client দেখেই না। ছোট আয়ু বাতিল করার কাজটা ঘড়ির হাতে তুলে দেয়।",
          },
          {
            key: "D",
            text: "পুরনো Browser গুলো লম্বা মেয়াদ বোঝে না",
            isCorrect: false,
            explanation: "পুরনো Browser লম্বা মেয়াদ ঠিকই বুঝত, বহু বছর তাই চলেছে।",
          },
        ],
      },
      {
        id: 8,
        text: "Development এ নিজের বানানো Certificate এর কারণে Node Script এ DEPTH_ZERO_SELF_SIGNED_CERT আসছে। সঠিক সমাধান কোনটা?",
        options: [
          {
            key: "A",
            text: "NODE_TLS_REJECT_UNAUTHORIZED=0 দিয়ে চালানো",
            isCorrect: false,
            explanation:
              "এটা পুরো Process এর সব Certificate যাচাই বন্ধ করে। ভুল করে Production এ গেলে প্রতিটা Connection প্রতারকের জন্য খোলা।",
          },
          {
            key: "B",
            text: "Code এ rejectUnauthorized: false লেখা",
            isCorrect: false,
            explanation: "একই সমস্যা, শুধু ছোট পরিসরে। Error চুপ হয়, নিরাপত্তাও যায়।",
          },
          {
            key: "C",
            text: "NODE_EXTRA_CA_CERTS দিয়ে শুধু নিজের Certificate বা নিজের Root টা বিশ্বাস করানো, অথবা mkcert দিয়ে বিশ্বস্ত Local Certificate",
            isCorrect: true,
            explanation:
              "ঠিক। যাচাই চালু থাকে, শুধু একটা নির্দিষ্ট জিনিস বাড়তি বিশ্বাস পায়। Lab এ এটা চালিয়ে দেখেছেন।",
          },
          {
            key: "D",
            text: "HTTPS বাদ দিয়ে HTTP তে চলে যাওয়া",
            isCorrect: false,
            explanation:
              "তাহলে Development আর Production আলাদা আচরণ করবে, আর Secure Cookie এর মতো জিনিস Development এ পরীক্ষাই হবে না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Certificate পড়ুন, বানান, ভাঙুন, সারান",
    subtitle: "ছয়টা পরীক্ষা, শুধু openssl, curl আর Node, কোনোটাতেই sudo লাগে না",
    stepName: "LAB",
    steps: [
      {
        title: "একটা আসল Certificate পড়া",
        description:
          "example.com এর Certificate ধরে চারটা ঘর, চাবির ধরন, কাজের ঘর, মেয়াদ শেষের পরীক্ষা আর পুরো শিকল দেখুন।",
      },
      {
        title: "সই করা, যাচাই, আর জাল ধরা",
        description:
          "Node এর node:crypto দিয়ে একজোড়া চাবি বানিয়ে বুকিং এর বার্তায় সই করুন। বার্তা বদলে আর অন্যের চাবি দিয়ে যাচাই করে দেখুন।",
      },
      {
        title: "নিজের HTTPS Server",
        description:
          "localhost এর Self-signed Certificate দিয়ে Node এর https Server চালান। curl আর fetch দিয়ে তিনভাবে কথা বলুন।",
      },
      {
        title: "নিজের খেলনা CA আর হারানো Intermediate",
        description:
          "Root, Intermediate আর Leaf বানিয়ে একবার শুধু Leaf, একবার fullchain দিয়ে Server চালান। Client বিশ্বাস করবে শুধু Root কে।",
      },
      {
        title: "চারভাবে ভাঙা",
        description:
          "ভুল নাম, মেয়াদ শেষ, এখনো শুরু হয়নি, আর চাবি না মেলা। প্রতিটার আসল Error নিজের চোখে দেখুন।",
      },
      {
        title: "মেয়াদের পাহারাদার",
        description:
          "একটা ছোট Script যা যেকোনো সাইটের মেয়াদ আর শিকল দেখে, আর কম দিন বাকি থাকলে ব্যর্থ Exit code দেয়।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-read-a-real-cert.sh",
        language: "bash",
        code: `#!/usr/bin/env bash
# চালান:  SITE=example.com bash 1-read-a-real-cert.sh
set -uo pipefail
: "\${SITE:?SITE is not set}"

# Server এর পাঠানো প্রথম Certificate টা (Leaf) একটা ফাইলে রাখুন
echo | openssl s_client -connect "$SITE:443" -servername "$SITE" 2>/dev/null \\
  | openssl x509 -out leaf.pem

echo "== প্রতিদিনের কাজের চারটা ঘর"
openssl x509 -in leaf.pem -noout -subject -issuer -dates -ext subjectAltName

echo "== চাবির ধরন আর কাজ"
openssl x509 -in leaf.pem -noout -text | grep -E "Public Key Algorithm|NIST CURVE"
openssl x509 -in leaf.pem -noout -ext basicConstraints,keyUsage,extendedKeyUsage

echo "== আগামী 30 দিনে মেয়াদ শেষ হবে কি?"
openssl x509 -in leaf.pem -noout -checkend $((30 * 24 * 3600))

echo "== Server পুরো শিকলে কী কী পাঠাল"
echo | openssl s_client -connect "$SITE:443" -servername "$SITE" 2>/dev/null \\
  | grep -E "^ *[0-9] s:|^ +i:"

echo "== যাচাইয়ের ফল"
echo | openssl s_client -connect "$SITE:443" -servername "$SITE" 2>&1 | grep -E "Verify return code"

# ফলাফলের শেষ অংশ (example.com, অক্টোবর 2026):
# X509v3 Basic Constraints: critical
#     CA:FALSE
# X509v3 Extended Key Usage:
#     TLS Web Server Authentication
# X509v3 Key Usage: critical
#     Digital Signature
# == আগামী 30 দিনে মেয়াদ শেষ হবে কি?
# Certificate will not expire
# == যাচাইয়ের ফল
# Verify return code: 0 (ok)`,
      },
      {
        filename: "2-sign-verify.mjs",
        language: "javascript",
        code: `// চালান:  node 2-sign-verify.mjs
import { generateKeyPairSync, sign, verify } from "node:crypto";

// একজোড়া চাবি: privateKey নিজের কাছে, publicKey সবাইকে দেওয়া যায়
const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });

const message = Buffer.from("booking bk_7Q2M9X confirmed, 2 seats");
const signature = sign("sha256", message, privateKey);
console.log("signature bytes:", signature.length);

console.log("original message valid:", verify("sha256", message, publicKey, signature));

const tampered = Buffer.from("booking bk_7Q2M9X confirmed, 9 seats");
console.log("tampered message valid:", verify("sha256", tampered, publicKey, signature));

// অন্য কারো চাবিজোড়া দিয়ে যাচাই করলে
const stranger = generateKeyPairSync("ec", { namedCurve: "P-256" });
console.log("checked with a stranger's public key:", verify("sha256", message, stranger.publicKey, signature));

// ফলাফল:
// signature bytes: 70                   (প্রতিবার 70 থেকে 72)
// original message valid: true
// tampered message valid: false
// checked with a stranger's public key: false`,
      },
      {
        filename: "3-https-server.mjs",
        language: "javascript",
        code: `// আগে Certificate বানান:
//   openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \\
//     -keyout localhost.key -out localhost.crt -days 30 -subj "/CN=localhost" \\
//     -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
//   chmod 600 localhost.key
// চালান:  LAB_PORT=47680 TLS_KEY_FILE=localhost.key TLS_CERT_FILE=localhost.crt node 3-https-server.mjs
import { readFileSync } from "node:fs";
import https from "node:https";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");
const keyFile = process.env.TLS_KEY_FILE;
const certFile = process.env.TLS_CERT_FILE;
if (!keyFile || !certFile) throw new Error("TLS_KEY_FILE and TLS_CERT_FILE must both be set");

// key হলো Private Key, cert হলো Certificate (বা fullchain, Leaf আগে)
const server = https.createServer(
  { key: readFileSync(keyFile), cert: readFileSync(certFile) },
  (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("hello over TLS, you asked for " + req.url + "\\n");
  },
);

// যে Client আমাদের Certificate মানেনি, তার Handshake এখানে ভাঙে
server.on("tlsClientError", (err) => console.log("tls error from a client:", err.code ?? err.message));
server.listen(port, "127.0.0.1", () => console.log("https://localhost:" + port + " is ready"));

// আরেক Terminal এ:
//   curl -sS https://localhost:47680/tours
//     curl: (60) SSL certificate problem: self signed certificate
//   curl -sS --cacert localhost.crt https://localhost:47680/tours
//     hello over TLS, you asked for /tours
//   NODE_EXTRA_CA_CERTS=localhost.crt node -e 'fetch("https://localhost:47680/").then(r => r.text()).then(console.log)'
//     hello over TLS, you asked for /`,
      },
      {
        filename: "4-make-chain.sh",
        language: "bash",
        code: `#!/usr/bin/env bash
# চালান:  LAB_PORT=47687 bash 4-make-chain.sh   (3-https-server.mjs একই Folder এ থাকতে হবে)
# একটা খেলনা CA: Root, তার নিচে Intermediate, তার নিচে localhost এর Leaf
set -euo pipefail
: "\${LAB_PORT:?LAB_PORT is not set}"
EC="-newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes"

# ১. Root CA: নিজের সই নিজে করা, CA:TRUE
openssl req -x509 $EC -keyout root.key -out root.crt -days 3650 -subj "/CN=My Toy Root CA" \\
  -addext "basicConstraints=critical,CA:TRUE" -addext "keyUsage=critical,keyCertSign,cRLSign" 2>/dev/null

# ২. Intermediate: CSR বানায়, Root তাতে সই করে
openssl req $EC -keyout intermediate.key -out intermediate.csr -subj "/CN=My Toy Intermediate CA" 2>/dev/null
openssl x509 -req -in intermediate.csr -CA root.crt -CAkey root.key -days 1825 -out intermediate.crt \\
  -extfile <(printf "basicConstraints=critical,CA:TRUE,pathlen:0\\nkeyUsage=critical,keyCertSign,cRLSign") 2>/dev/null

# ৩. Leaf: localhost এর জন্য, Intermediate সই করে
openssl req $EC -keyout leaf.key -out leaf.csr -subj "/CN=localhost" 2>/dev/null
openssl x509 -req -in leaf.csr -CA intermediate.crt -CAkey intermediate.key -days 30 -out leaf.crt \\
  -extfile <(printf "basicConstraints=critical,CA:FALSE\\nkeyUsage=critical,digitalSignature\\nextendedKeyUsage=serverAuth\\nsubjectAltName=DNS:localhost") 2>/dev/null

# ৪. Server যা পাঠাবে: Leaf আগে, তারপর Intermediate। Root কখনো না
cat leaf.crt intermediate.crt > fullchain.crt
chmod 600 root.key intermediate.key leaf.key

echo "== openssl verify, শুধু Root হাতে নিয়ে"
openssl verify -CAfile root.crt leaf.crt || true
echo "== openssl verify, Intermediate সহ"
openssl verify -CAfile root.crt -untrusted intermediate.crt leaf.crt

for cert in leaf.crt fullchain.crt; do
  LAB_PORT=$LAB_PORT TLS_KEY_FILE=leaf.key TLS_CERT_FILE=$cert node 3-https-server.mjs > /dev/null 2>&1 &
  pid=$!; sleep 1
  echo "== Server পাঠাচ্ছে $cert, Client বিশ্বাস করে শুধু root.crt"
  curl -sS --cacert root.crt "https://localhost:$LAB_PORT/" 2>&1 | head -1 || true
  NODE_EXTRA_CA_CERTS=root.crt node -e 'fetch("https://localhost:" + process.env.LAB_PORT + "/").then(() => console.log("node: ok")).catch((e) => console.log("node:", e.cause?.code))'
  kill $pid; wait $pid 2>/dev/null || true
done

# ফলাফল:
# == Server পাঠাচ্ছে leaf.crt, Client বিশ্বাস করে শুধু root.crt
# curl: (60) SSL certificate problem: unable to get local issuer certificate
# node: UNABLE_TO_VERIFY_LEAF_SIGNATURE
# == Server পাঠাচ্ছে fullchain.crt, Client বিশ্বাস করে শুধু root.crt
# hello over TLS, you asked for /
# node: ok`,
      },
      {
        filename: "5-break-it.sh",
        language: "bash",
        code: `#!/usr/bin/env bash
# চালান:  LAB_PORT=47686 bash 5-break-it.sh   (3-https-server.mjs একই Folder এ থাকতে হবে)
set -uo pipefail
: "\${LAB_PORT:?LAB_PORT is not set}"

serve() {   # serve <key> <cert>: Server চালু করে, এক সেকেন্ড অপেক্ষা
  LAB_PORT=$LAB_PORT TLS_KEY_FILE=$1 TLS_CERT_FILE=$2 node 3-https-server.mjs > /dev/null 2>&1 &
  SERVER_PID=$!
  sleep 1
}
stop() { kill "$SERVER_PID" 2>/dev/null; wait "$SERVER_PID" 2>/dev/null; }

new_cert() {  # new_cert <name> <বাড়তি openssl flag...>
  local name=$1; shift
  openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \\
    -keyout "$name.key" -out "$name.crt" -subj "/CN=localhost" \\
    -addext "subjectAltName=DNS:localhost" "$@" 2>/dev/null
  chmod 600 "$name.key"
}

echo "== ১. ভুল নাম: Certificate localhost এর, আমরা চাইছি islandtours.example"
new_cert good -days 30
serve good.key good.crt
curl -sS --cacert good.crt --resolve "islandtours.example:$LAB_PORT:127.0.0.1" \\
  "https://islandtours.example:$LAB_PORT/" 2>&1 | head -1
stop

echo "== ২. মেয়াদ শেষ: 2025 সালের জানুয়ারির এক মাসের Certificate"
new_cert old -not_before 20250101000000Z -not_after 20250201000000Z
serve old.key old.crt
curl -sS --cacert old.crt "https://localhost:$LAB_PORT/" 2>&1 | head -1
stop

echo "== ৩. এখনো শুরুই হয়নি: 2030 সালের Certificate, যেন যন্ত্রের ঘড়ি পিছিয়ে আছে"
new_cert future -not_before 20300101000000Z -not_after 20300201000000Z
serve future.key future.crt
curl -sS --cacert future.crt "https://localhost:$LAB_PORT/" 2>&1 | head -1
stop

echo "== ৪. চাবি আর Certificate মেলে না: Server চালুই হয় না"
LAB_PORT=$LAB_PORT TLS_KEY_FILE=old.key TLS_CERT_FILE=good.crt node 3-https-server.mjs 2>&1 | grep -m1 "code:"

echo "== ৫. মিলিয়ে দেখার উপায়: দুইটা Hash একই হলে জোড়া ঠিক"
openssl x509 -in good.crt -noout -pubkey | openssl sha256
openssl pkey -in good.key -pubout | openssl sha256
openssl pkey -in old.key -pubout | openssl sha256

# ফলাফল (Hash গুলো আপনার আলাদা হবে):
# == ১. ... curl: (60) SSL: no alternative certificate subject name matches target host name 'islandtours.example'
# == ২. ... curl: (60) SSL certificate problem: certificate has expired
# == ৩. ... curl: (60) SSL certificate problem: certificate is not yet valid
# == ৪. ...   code: 'ERR_OSSL_X509_KEY_VALUES_MISMATCH'
# == ৫. ... প্রথম দুইটা Hash একই, তৃতীয়টা আলাদা`,
      },
      {
        filename: "6-check-expiry.mjs",
        language: "javascript",
        code: `// চালান:  CHECK_HOST=example.com WARN_DAYS=21 node 6-check-expiry.mjs
import tls from "node:tls";

const host = process.env.CHECK_HOST;
const warnDays = Number(process.env.WARN_DAYS);
if (!host) throw new Error("CHECK_HOST is not set");
if (!warnDays) throw new Error("WARN_DAYS is not set");

const DAY_MS = 86_400_000;

const socket = tls.connect({ host, port: 443, servername: host }, () => {
  const cert = socket.getPeerCertificate(true);
  const daysLeft = Math.floor((new Date(cert.valid_to) - Date.now()) / DAY_MS);

  console.log("name     :", cert.subject.CN);
  console.log("also for :", cert.subjectaltname);
  console.log("issuer   :", cert.issuer.CN);
  console.log("expires  :", cert.valid_to, "(" + daysLeft + " days left)");
  console.log("trusted  :", socket.authorized, socket.authorizationError ?? "");

  // শিকল ধরে উপরে ওঠা। Root এ পৌঁছালে issuerCertificate নিজেকেই দেখায়
  let link = cert;
  for (let depth = 0; link && depth < 6; depth += 1) {
    console.log("chain " + depth + "  :", link.subject.CN, "<- signed by", link.issuer.CN);
    if (link.issuerCertificate === link) break;
    link = link.issuerCertificate;
  }

  socket.end();
  if (daysLeft < warnDays) {
    console.log("WARNING: fewer than " + warnDays + " days left, renewal is not working");
    process.exitCode = 1;
  }
});

socket.on("error", (err) => {
  console.log("could not check:", err.code, err.message);
  process.exitCode = 2;
});

// ফলাফল (example.com, 31 অক্টোবর 2026):
// name     : example.com
// also for : DNS:example.com, DNS:*.example.com
// issuer   : Cloudflare TLS Issuing ECC CA 3
// expires  : Dec 25 22:56:35 2026 GMT (55 days left)
// trusted  : true
// chain 0  : example.com <- signed by Cloudflare TLS Issuing ECC CA 3
// ...
// chain 4  : AAA Certificate Services <- signed by AAA Certificate Services
//
// WARN_DAYS=90 দিয়ে চালালে শেষ লাইন আর Exit code 1:
// WARNING: fewer than 90 days left, renewal is not working`,
      },
    ],
    tip: "পরীক্ষা ৩ আর ৪ পাশাপাশি রেখে ভাবুন। দুইটাতেই Client প্রথমে অস্বীকার করল, কিন্তু কারণ আলাদা। ৩ নম্বরে কেউ জামিন হয়নি, তাই সমাধান ছিল Client কে বলা ঠিক কাকে বিশ্বাস করতে হবে। ৪ নম্বরে জামিনদার ছিল, Client তাকে বিশ্বাসও করত, কিন্তু Server মাঝের কাগজটা দেখায়নি, তাই সমাধান ছিল Server এ। Production এ কেউ যখন বলবে Certificate এ সমস্যা, প্রথম প্রশ্ন এটাই: কোন যাচাইয়ে থামছে, আর সারানোর হাত কার, Server এর না Client এর। Error এর লেখাটা মন দিয়ে পড়লে উত্তর প্রায় সবসময় সেখানেই লেখা থাকে।",
  },
  assignment: {
    title: "Mini Project: my-tours এর জন্য Certificate এর নিয়মপত্র",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>তিনটা আসল Certificate পড়ুন:</strong> example.com আর নিজের পছন্দের
        আরও দুইটা সাইটের Certificate openssl দিয়ে পড়ুন। একটা টেবিলে লিখুন: Issuer,
        SAN এ কয়টা নাম, মেয়াদ কত দিনের, চাবির ধরন, Server শিকলে কয়টা Certificate
        পাঠায়, আর কোনো Cross-sign আছে কি না। তারপর এক লাইনে লিখুন তিনটার মধ্যে সবচেয়ে
        অবাক করা পার্থক্য কোনটা।
      </span>,
      <span key="2">
        <strong>নিজের CA, নিজের শিকল:</strong> Lab এর ৪ নম্বর Script চালান। তারপর
        Leaf এর মেয়াদ 30 থেকে 7 দিন করুন আর Intermediate এর CA:TRUE বদলে CA:FALSE
        করে আবার চালান। প্রতিবার কোন যাচাইয়ে থামল, কী লেখা এলো, আর কেন, লিখে রাখুন।
        কাগজে নিজের শিকলটা আঁকুন, কে কার উপর সই করেছে তীর দিয়ে।
      </span>,
      <span key="3">
        <strong>my-tours এ Local HTTPS:</strong> নিজের my-tours Server টা HTTPS এ
        চালান, এমন একটা Certificate দিয়ে যা আপনার যন্ত্র সত্যিই বিশ্বাস করে (mkcert
        দিয়ে, বা নিজের খেলনা Root দিয়ে)। চাবি আর Certificate এর Path দুইটাই
        Environment Variable থেকে পড়ুন, আর না থাকলে Server যেন চালুই না হয়। প্রমাণ
        দিন যে <code>git check-ignore</code> আপনার .key ফাইলটাকে উপেক্ষা করছে।
      </span>,
      <span key="4">
        <strong>Certificate Runbook লিখুন:</strong> my-tours যখন সত্যিকারের Server এ
        যাবে, তার জন্য এক পাতার নিয়মপত্র। কোন ACME Client, কোন Challenge আর কেন, চাবি
        কোথায় থাকবে আর কে পড়তে পারবে, কোন CAA Record বসাবেন, মেয়াদ পাহারার Script
        কীভাবে চলবে (<code>WARN_DAYS</code> Environment Variable থেকে, 45 দিনের
        Certificate এর কথা মাথায় রেখে), আর চাবি ফাঁস হলে প্রথম এক ঘণ্টায় ঠিক কী কী
        করবেন, ক্রম অনুযায়ী।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> একজন বন্ধু লিখেছেন, ক্যাফের
        Wi-Fi তে একটা সাইট খুলতে গিয়ে লাল পাতা এলো, Advanced চেপে Proceed করলাম,
        দিব্যি চলল, তাহলে সমস্যা কী ছিল? তাঁকে বোঝান Certificate কী প্রমাণ করে, ওই
        Wi-Fi এর পেছনের লোকটা কেন একটা বৈধ Certificate দেখাতে পারল না, আসল
        Certificate কপি করলেও কেন কাজ হতো না, আর Proceed চাপার সাথে সাথে ঠিক কী
        হারালেন।
      </span>,
    ],
    deliverables: [
      <span key="1">তিন সাইটের Certificate এর তুলনার টেবিল, আর এক লাইনের পর্যবেক্ষণ</span>,
      <span key="2">তিনবারের ফলাফল, প্রতিটার কারণ সহ, আর নিজের আঁকা শিকলের ছবি</span>,
      <span key="3">my-tours এর HTTPS চালানোর Code, Browser এ তালার ছবি, আর git check-ignore এর ফলাফল</span>,
      <span key="4">এক পাতার Certificate Runbook</span>,
      <span key="5">বন্ধুর জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
