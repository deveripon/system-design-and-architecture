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
          fillOpacity={muted ? 0.6 : 1}
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
  accent,
  size = 9.5,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
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
      <SketchText x={x + w / 2} y={y + h / 2 + 4} size={size} bold accent={accent}>
        {text}
      </SketchText>
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. তিন ধাপের মই, আসল সংখ্যা সহ                                             */
/* ------------------------------------------------------------------------- */

const LADDER = [
  { from: "c", y: 96, flag: "SYN", detail: "seq=1000", note: "১. আমি কথা বলতে চাই, আমার গোনা শুরু ১০০০ থেকে" },
  { from: "s", y: 168, flag: "SYN-ACK", detail: "seq=5000, ack=1001", note: "২. শুনেছি, এরপর ১০০১ চাই। আমার গোনা শুরু ৫০০০ থেকে" },
  { from: "c", y: 240, flag: "ACK", detail: "seq=1001, ack=5001", note: "৩. আপনারটাও শুনেছি, এরপর ৫০০১ চাই" },
];

export function HandshakeLadderDiagram() {
  const cx = 210;
  const sx = 630;
  return (
    <Sketch
      label="Diagram: Three-way Handshake, তিনটা বার্তা আর তাদের সংখ্যা"
      height={340}
      minWidth={840}
      viewBox="0 0 840 340"
      caption="দুইটা খাড়া দাগ দুই পক্ষ, বাঁয়ে পর্যটকের ফোন আর ডানে Island Tours এর Server। সময় উপর থেকে নিচে গড়ায়, তাই তীরগুলো একটু হেলানো, কারণ প্রতিটা বার্তা পৌঁছাতে সময় লাগে। প্রথম তীর SYN, ফোন তার নিজের শুরুর সংখ্যা ১০০০ জানাল। দ্বিতীয় তীর SYN-ACK, Server এক বার্তায় দুইটা কাজ সারল, ফোনের সংখ্যাটা যে পেয়েছে তা জানাল (ack=1001) আর নিজের শুরুর সংখ্যা ৫০০০ জানাল। তৃতীয় তীর ACK, ফোন জানাল Server এর সংখ্যাটাও পেয়েছে (ack=5001)। দুই পাশের লেখাগুলো State, মানে ওই মুহূর্তে Kernel এর খাতায় Connection টার অবস্থা। খেয়াল করুন, ফোন ESTABLISHED হয় দ্বিতীয় বার্তা পেয়েই, আর Server হয় তৃতীয় বার্তা পাওয়ার পর।"
    >
      <Arrow id="handshake-ladder-a" />
      <Box x={cx - 80} y={16} w={160} text="ফোন 192.168.1.20:51514" accent size={9} />
      <Box x={sx - 80} y={16} w={160} text="Server 103.94.135.2:443" accent size={9} />
      <line x1={cx} y1={50} x2={cx} y2={316} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <line x1={sx} y1={50} x2={sx} y2={316} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />

      {LADDER.map((m) => {
        const x1 = m.from === "c" ? cx : sx;
        const x2 = m.from === "c" ? sx - 3 : cx + 3;
        return (
          <g key={m.flag}>
            <line
              x1={x1}
              y1={m.y}
              x2={x2}
              y2={m.y + 34}
              stroke="var(--primary)"
              strokeWidth="1.5"
              markerEnd="url(#handshake-ladder-a)"
            />
            <SketchText x={420} y={m.y - 2} size={11} bold accent>
              {`${m.flag}  ${m.detail}`}
            </SketchText>
            <SketchText x={420} y={m.y + 44} size={8.5} body opacity={0.75}>
              {m.note}
            </SketchText>
          </g>
        );
      })}

      <SketchText x={cx - 14} y={74} size={9} anchor="end" opacity={0.6}>
        CLOSED
      </SketchText>
      <SketchText x={cx - 14} y={112} size={9} anchor="end" bold>
        SYN_SENT
      </SketchText>
      <SketchText x={cx - 14} y={222} size={9} anchor="end" bold accent>
        ESTABLISHED
      </SketchText>
      <SketchText x={sx + 14} y={74} size={9} anchor="start" opacity={0.6}>
        LISTEN
      </SketchText>
      <SketchText x={sx + 14} y={150} size={9} anchor="start" bold>
        SYN_RCVD
      </SketchText>
      <SketchText x={sx + 14} y={292} size={9} anchor="start" bold accent>
        ESTABLISHED
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. দুই ধাপে কেন চলে না                                                     */
/* ------------------------------------------------------------------------- */

function Lifelines({ left, right }: { left: string; right: string }) {
  return (
    <>
      <Box x={20} y={12} w={90} h={28} text={left} size={8.5} />
      <Box x={190} y={12} w={90} h={28} text={right} size={8.5} />
      <line x1={65} y1={40} x2={65} y2={232} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" />
      <line x1={235} y1={40} x2={235} y2={232} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.2" />
    </>
  );
}

function TwoStep() {
  return (
    <>
      <Arrow id="handshake-two-a" />
      <Arrow id="handshake-two-b" muted />
      <Lifelines left="ফোন" right="Server" />
      <line
        x1={65}
        y1={62}
        x2={232}
        y2={92}
        stroke="currentColor"
        strokeOpacity={0.7}
        strokeWidth="1.3"
        strokeDasharray="5 4"
        markerEnd="url(#handshake-two-b)"
      />
      <SketchText x={150} y={64} size={8.5} body opacity={0.8}>
        পথে আটকে থাকা পুরনো SYN
      </SketchText>
      <line x1={235} y1={112} x2={68} y2={142} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#handshake-two-a)" />
      <SketchText x={150} y={114} size={9} bold accent>
        SYN-ACK
      </SketchText>
      <rect x={176} y={156} width={118} height={36} fill="var(--destructive)" fillOpacity={0.08} stroke="var(--destructive)" strokeWidth="1.2" />
      <SketchText x={235} y={171} size={8} body bold>
        খোলা ধরে নিল
      </SketchText>
      <SketchText x={235} y={184} size={7.5} body opacity={0.8}>
        Memory আটকে থাকল
      </SketchText>
      <SketchText x={65} y={170} size={8} body opacity={0.8} anchor="middle">
        ফোন কিছু চায়নি
      </SketchText>
      <SketchText x={150} y={222} size={8.5} body opacity={0.75}>
        ভূতুড়ে Connection, কেউ কখনো ব্যবহার করবে না
      </SketchText>
    </>
  );
}

function ThreeStep() {
  return (
    <>
      <Arrow id="handshake-three-a" />
      <Arrow id="handshake-three-b" muted />
      <Lifelines left="ফোন" right="Server" />
      <line
        x1={65}
        y1={62}
        x2={232}
        y2={92}
        stroke="currentColor"
        strokeOpacity={0.7}
        strokeWidth="1.3"
        strokeDasharray="5 4"
        markerEnd="url(#handshake-three-b)"
      />
      <SketchText x={150} y={64} size={8.5} body opacity={0.8}>
        পথে আটকে থাকা পুরনো SYN
      </SketchText>
      <line x1={235} y1={106} x2={68} y2={134} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#handshake-three-a)" />
      <SketchText x={150} y={108} size={9} bold accent>
        SYN-ACK
      </SketchText>
      <line x1={65} y1={150} x2={232} y2={178} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#handshake-three-a)" />
      <SketchText x={150} y={152} size={9} bold accent>
        RST, এটা আমি চাইনি
      </SketchText>
      <rect x={176} y={186} width={118} height={26} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.2" />
      <SketchText x={235} y={203} size={8} body bold accent>
        খাতা থেকে মুছে দিল
      </SketchText>
      <SketchText x={150} y={228} size={8.5} body opacity={0.75}>
        তৃতীয় ধাপ না এলে Server খোলা ধরে না
      </SketchText>
    </>
  );
}

export function WhyThreeSplit() {
  return (
    <SketchSplit
      label="Diagram: দুই ধাপে থামলে কী বিপদ, তিন ধাপে সেটা কীভাবে ধরা পড়ে"
      caption="Network এ একটা Packet কখনো কখনো পথে আটকে থেকে অনেক দেরিতে পৌঁছায়। ধরুন ফোনের একটা পুরনো SYN, যে Connection অনেক আগেই শেষ, সেটা এখন হঠাৎ Server এ এসে হাজির। বাঁ দিকে নিয়মটা যদি দুই ধাপের হতো, Server উত্তর পাঠিয়েই Connection খোলা ধরে নিত, তার জন্য Memory রাখত আর Data র অপেক্ষায় বসে থাকত, অথচ ফোন এমন কিছু চায়ইনি। ডান দিকে আসল নিয়ম। Server উত্তর পাঠায় কিন্তু খোলা ধরে না, ফোনের তৃতীয় বার্তার অপেক্ষা করে। ফোন SYN-ACK টা দেখে বোঝে এটা তার চাওয়া কোনো Connection এর নয়, তাই ACK এর বদলে RST পাঠায়, আর Server খাতা থেকে নামটা মুছে ফেলে। তৃতীয় ধাপটা তাই শুধু ভদ্রতা নয়, এটা Server এর জন্য প্রমাণ যে ওপাশে সত্যিই কেউ এই মুহূর্তে কথা বলতে চাইছে।"
      panels={[
        {
          title: "দুই ধাপ হলে",
          sub: "পুরনো SYN এ ভূতুড়ে Connection",
          viewBox: "0 0 300 240",
          height: 240,
          children: <TwoStep />,
        },
        {
          title: "তিন ধাপে",
          sub: "ফোন RST দিয়ে না বলে দেয়",
          viewBox: "0 0 300 240",
          height: 240,
          children: <ThreeStep />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. SYN এর সাথে যে চারটা Option যায়                                         */
/* ------------------------------------------------------------------------- */

const OPTIONS = [
  {
    name: "MSS",
    seen: "mss 1460",
    what: "এক Segment এ সর্বোচ্চ কত Byte Data নিতে পারি",
    without: "ধরে নেওয়া হয় মাত্র ৫৩৬ Byte, সব ধীর",
  },
  {
    name: "Window Scale",
    seen: "wscale 7",
    what: "Window এর সংখ্যাটাকে কত গুণ করে পড়তে হবে",
    without: "Window আটকে থাকে ৬৫,৫৩৫ Byte এ",
  },
  {
    name: "SACK Permitted",
    seen: "sackOK",
    what: "মাঝের কোন টুকরো পেয়েছি তা আলাদা করে জানাতে পারব",
    without: "একটা হারালে পরেরগুলোও আবার পাঠাতে হয়",
  },
  {
    name: "Timestamps",
    seen: "TS val ... ecr ...",
    what: "প্রতিটা Segment এ সময়ের ছাপ, RTT মাপার জন্য",
    without: "RTT এর মাপ কম নিখুঁত হয়",
  },
];

export function SynOptionsDiagram() {
  const rowH = 40;
  const top = 54;
  const h = top + OPTIONS.length * rowH + 14;
  return (
    <Sketch
      label="Diagram: SYN এর সাথে যে চারটা Option দরদাম হয়"
      height={h}
      minWidth={840}
      viewBox={`0 0 840 ${h}`}
      caption="Handshake শুধু হ্যালো বলা নয়, এটা একটা ছোট দরদামও। SYN আর SYN-ACK এর সাথে দুই পক্ষ নিজের নিজের সামর্থ্য লিখে পাঠায়, আর এই কথাগুলো শুধু এই দুই বার্তাতেই বলা যায়, পরে আর নয়। দ্বিতীয় ঘরটা হলো tcpdump এ আপনি যেভাবে লেখাটা দেখবেন। একটা নিয়ম মনে রাখুন, বেশিরভাগ Option তখনই চালু হয় যখন দুই পক্ষই সেটা পাঠায়। একজন Window Scale পাঠাল আর অন্যজন পাঠাল না, তাহলে পুরো Connection এ কেউই সেটা ব্যবহার করবে না। MSS একটু আলাদা, প্রত্যেকে নিজের সীমা জানায় আর অপর পক্ষ সেটা মেনে পাঠায়।"
    >
      <SketchText x={40} y={38} size={9} anchor="start" opacity={0.55}>
        Option
      </SketchText>
      <SketchText x={190} y={38} size={9} anchor="start" opacity={0.55}>
        tcpdump এ দেখায়
      </SketchText>
      <SketchText x={340} y={38} size={9} anchor="start" opacity={0.55}>
        কী ঠিক হয়
      </SketchText>
      <SketchText x={610} y={38} size={9} anchor="start" opacity={0.55}>
        না থাকলে
      </SketchText>
      {OPTIONS.map((o, i) => {
        const y = top + i * rowH;
        return (
          <g key={o.name}>
            <rect
              x={24}
              y={y}
              width={792}
              height={rowH - 8}
              fill={i % 2 === 0 ? "currentColor" : "transparent"}
              fillOpacity={0.03}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth="1"
            />
            <SketchText x={40} y={y + 21} size={10} anchor="start" bold accent>
              {o.name}
            </SketchText>
            <SketchText x={190} y={y + 21} size={9} anchor="start" opacity={0.8}>
              {o.seen}
            </SketchText>
            <SketchText x={340} y={y + 21} size={9} anchor="start" body bold>
              {o.what}
            </SketchText>
            <SketchText x={610} y={y + 21} size={8.5} anchor="start" body opacity={0.75}>
              {o.without}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. State, দুই পক্ষের খাতায়                                                 */
/* ------------------------------------------------------------------------- */

const CLIENT_STATES = [
  { name: "CLOSED", x: 150 },
  { name: "SYN_SENT", x: 380 },
  { name: "ESTABLISHED", x: 640 },
];
const CLIENT_MOVES = ["connect() ডাকল, SYN পাঠাল", "SYN-ACK পেল, ACK পাঠাল"];

const SERVER_STATES = [
  { name: "CLOSED", x: 40 },
  { name: "LISTEN", x: 240 },
  { name: "SYN_RCVD", x: 440 },
  { name: "ESTABLISHED", x: 640 },
];
const SERVER_MOVES = ["listen() ডাকল", "SYN পেল, SYN-ACK পাঠাল", "ACK পেল"];

export function HandshakeStatesDiagram() {
  const w = 130;
  return (
    <Sketch
      label="Diagram: Handshake চলার সময় দুই পক্ষের State"
      height={270}
      minWidth={840}
      viewBox="0 0 840 270"
      caption="Kernel প্রতিটা TCP Connection এর জন্য একটা খাতা রাখে, আর খাতায় লেখা থাকে Connection টা এই মুহূর্তে কোন অবস্থায়। এই অবস্থাকেই বলে State। উপরের সারিটা Client এর, নিচেরটা Server এর, আর প্রতিটা তীরের উপরে লেখা কোন ঘটনায় State বদলায়। Server এর পথ এক ঘর লম্বা, কারণ তাকে আগে থেকে LISTEN এ বসে থাকতে হয়। মাঝের দুইটা State, SYN_SENT আর SYN_RCVD, এক পলকের জন্য থাকার কথা। netstat এ এদের কোনোটা যদি অনেকক্ষণ ধরে দেখেন, বুঝবেন Handshake এর কোনো একটা বার্তা পথে হারাচ্ছে। এই লেসনের সমস্যা খোঁজার পুরো অংশটা এই একটা পর্যবেক্ষণের উপর দাঁড়িয়ে।"
    >
      <Arrow id="handshake-states-a" />
      <SketchText x={40} y={34} size={9} anchor="start" bold accent>
        CLIENT (ফোন)
      </SketchText>
      {CLIENT_STATES.map((s, i) => (
        <g key={`c-${s.name}`}>
          <Box x={s.x} y={54} w={w} h={38} text={s.name} accent={i === CLIENT_STATES.length - 1} />
          {i < CLIENT_STATES.length - 1 && (
            <>
              <line
                x1={s.x + w}
                y1={73}
                x2={CLIENT_STATES[i + 1].x - 3}
                y2={73}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#handshake-states-a)"
              />
              <SketchText x={(s.x + w + CLIENT_STATES[i + 1].x) / 2} y={46} size={8} body opacity={0.8}>
                {CLIENT_MOVES[i]}
              </SketchText>
            </>
          )}
        </g>
      ))}

      <line x1={24} y1={126} x2={816} y2={126} stroke="currentColor" strokeOpacity={0.2} strokeDasharray="4 4" />

      <SketchText x={40} y={156} size={9} anchor="start" bold accent>
        SERVER (Island Tours)
      </SketchText>
      {SERVER_STATES.map((s, i) => (
        <g key={`s-${s.name}`}>
          <Box x={s.x} y={176} w={w} h={38} text={s.name} accent={i === SERVER_STATES.length - 1} />
          {i < SERVER_STATES.length - 1 && (
            <>
              <line
                x1={s.x + w}
                y1={195}
                x2={SERVER_STATES[i + 1].x - 3}
                y2={195}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#handshake-states-a)"
              />
              <SketchText x={s.x + w + 35} y={236} size={8} body opacity={0.8}>
                {SERVER_MOVES[i]}
              </SketchText>
            </>
          )}
        </g>
      ))}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. দুইটা লাইন: SYN Queue আর Accept Queue                                   */
/* ------------------------------------------------------------------------- */

function Slots({ x, y, filled, total }: { x: number; y: number; filled: number; total: number }) {
  return (
    <>
      {Array.from({ length: total }, (_, i) => (
        <rect
          key={i}
          x={x + i * 26}
          y={y}
          width={20}
          height={20}
          fill={i < filled ? "var(--primary)" : "transparent"}
          fillOpacity={i < filled ? 0.25 : 0}
          stroke={i < filled ? "var(--primary)" : "currentColor"}
          strokeOpacity={i < filled ? 1 : 0.35}
          strokeWidth="1.1"
        />
      ))}
    </>
  );
}

export function TwoQueuesDiagram() {
  return (
    <Sketch
      label="Diagram: Server এর ভেতরে দুইটা লাইন"
      height={280}
      minWidth={840}
      viewBox="0 0 840 280"
      caption="LISTEN এ থাকা প্রতিটা Socket এর পেছনে Kernel দুইটা লাইন রাখে। প্রথমটা SYN Queue, এখানে থাকে যাদের SYN এসেছে আর SYN-ACK পাঠানো হয়েছে, কিন্তু তৃতীয় বার্তাটা এখনো আসেনি। এরা অর্ধেক হওয়া Connection। তৃতীয় ACK এসে গেলে Connection টা পুরো হয় আর দ্বিতীয় লাইনে, Accept Queue তে সরে যায়। সেখানে সে অপেক্ষা করে আপনার Application কখন accept() ডেকে তাকে তুলে নেবে। এই ছবি থেকে দুইটা জরুরি কথা বেরোয়। এক, পুরো Handshake টা সারে Kernel, আপনার Code কিছু টেরই পায় না যতক্ষণ না Connection তৈরি হয়ে Accept Queue তে পৌঁছায়। দুই, দুইটা লাইনেরই একটা সীমা আছে। Application ধীর হলে দ্বিতীয় লাইন ভরে যায়, আর কেউ নকল SYN এর বন্যা পাঠালে প্রথমটা ভরে যায়। দুই ক্ষেত্রেই নতুন পর্যটকরা ঢুকতে পারেন না।"
    >
      <Arrow id="handshake-queue-a" />

      <SketchText x={60} y={96} size={9} body bold>
        SYN আসে
      </SketchText>
      <line x1={90} y1={92} x2={137} y2={92} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#handshake-queue-a)" />

      <rect x={140} y={48} width={230} height={96} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.3" />
      <SketchText x={255} y={70} size={10.5} bold>
        SYN Queue
      </SketchText>
      <SketchText x={255} y={86} size={8.5} body opacity={0.75}>
        State: SYN_RCVD, অর্ধেক হওয়া
      </SketchText>
      <Slots x={153} y={104} filled={3} total={8} />

      <line x1={370} y1={92} x2={467} y2={92} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#handshake-queue-a)" />
      <SketchText x={420} y={82} size={8.5} body accent>
        তৃতীয় ACK এলে
      </SketchText>

      <rect x={470} y={48} width={230} height={96} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={585} y={70} size={10.5} bold accent>
        Accept Queue
      </SketchText>
      <SketchText x={585} y={86} size={8.5} body opacity={0.75}>
        State: ESTABLISHED, তৈরি
      </SketchText>
      <Slots x={483} y={104} filled={2} total={8} />

      <line x1={700} y1={92} x2={747} y2={92} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#handshake-queue-a)" />
      <SketchText x={724} y={82} size={8.5} accent>
        accept()
      </SketchText>
      <Box x={750} y={74} w={72} h={36} text="আপনার App" size={8.5} accent />

      <line x1={140} y1={168} x2={700} y2={168} stroke="currentColor" strokeOpacity={0.4} strokeWidth="1" />
      <line x1={140} y1={162} x2={140} y2={174} stroke="currentColor" strokeOpacity={0.4} />
      <line x1={700} y1={162} x2={700} y2={174} stroke="currentColor" strokeOpacity={0.4} />
      <SketchText x={420} y={188} size={9} body opacity={0.8}>
        এই পুরো অংশটা Kernel এর ভেতরে, আপনার Code এর এক লাইনও এখানে চলে না
      </SketchText>

      <SketchText x={255} y={226} size={8.5} body opacity={0.75}>
        ভরে গেলে: নতুন SYN ফেলে দেওয়া হয়
      </SketchText>
      <SketchText x={255} y={242} size={8.5} body opacity={0.75}>
        কারণ: SYN Flood, অথবা খুব ধীর Client
      </SketchText>
      <SketchText x={585} y={226} size={8.5} body opacity={0.75}>
        ভরে গেলে: Handshake শেষ হতে পারে না
      </SketchText>
      <SketchText x={585} y={242} size={8.5} body opacity={0.75}>
        কারণ: App ব্যস্ত, accept() ডাকছে না
      </SketchText>
      <SketchText x={420} y={266} size={8.5} body accent>
        Accept Queue এর সীমাকেই বলে Backlog
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. মাঝখানে Proxy থাকলে Handshake দুইটা                                     */
/* ------------------------------------------------------------------------- */

export function TwoHandshakesDiagram() {
  return (
    <Sketch
      label="Diagram: মাঝখানে Proxy থাকলে Handshake একটা নয়, দুইটা"
      height={230}
      minWidth={840}
      viewBox="0 0 840 230"
      caption="এতক্ষণ ধরে নিয়েছি ফোন সরাসরি Island Tours এর Server এর সাথে হাত মেলাচ্ছে। বাস্তবে মাঝখানে প্রায়ই একজন থাকে, Cloudflare এর মতো একটা Proxy, একটা Load Balancer, অথবা Server এর নিজের Nginx। তখন ফোনের SYN যায় ওই মাঝের জনের কাছে, আর Handshake টা তার সাথেই শেষ হয়। এরপর মাঝের জন নিজে আলাদা একটা Connection খোলে পেছনের App এর সাথে, নিজের আলাদা SYN দিয়ে। এই দুইটা Connection পুরোপুরি আলাদা, আলাদা Sequence Number, আলাদা State। এর দুইটা ফল আপনার জানা দরকার। ফোন থেকে nc দিয়ে Port 443 খোলা দেখা মানে শুধু বাঁ দিকের Handshake সফল, পেছনের App চালু আছে তার প্রমাণ নয়। আর পর্যটক 502 বা 504 দেখলে তার মানে প্রায়ই ডান দিকের Handshake টাই ব্যর্থ হয়েছে। নিয়মটা একটা NAT Router এর বেলায় খাটে না, সে শুধু ঠিকানা বদলায়, Handshake নিজে করে না।"
    >
      <Arrow id="handshake-proxy-a" />
      <Box x={40} y={70} w={150} h={50} text="পর্যটকের ফোন" />
      <Box x={345} y={70} w={150} h={50} text="Proxy বা Load Balancer" accent size={9} />
      <Box x={650} y={70} w={150} h={50} text="App, Port 3000" />

      <line x1={190} y1={86} x2={342} y2={86} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#handshake-proxy-a)" />
      <line x1={345} y1={104} x2={193} y2={104} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#handshake-proxy-a)" />
      <SketchText x={267} y={64} size={9} bold accent>
        Handshake ১
      </SketchText>
      <SketchText x={267} y={138} size={8.5} body opacity={0.75}>
        Port 443, দূরের পথ
      </SketchText>

      <line x1={495} y1={86} x2={647} y2={86} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#handshake-proxy-a)" />
      <line x1={650} y1={104} x2={498} y2={104} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#handshake-proxy-a)" />
      <SketchText x={572} y={64} size={9} bold accent>
        Handshake ২
      </SketchText>
      <SketchText x={572} y={138} size={8.5} body opacity={0.75}>
        Port 3000, কাছের পথ
      </SketchText>

      <SketchText x={267} y={180} size={8.5} body opacity={0.8}>
        এটা ব্যর্থ হলে পর্যটক দেখেন
      </SketchText>
      <SketchText x={267} y={196} size={8.5} body bold>
        Connection refused বা timed out
      </SketchText>
      <SketchText x={572} y={180} size={8.5} body opacity={0.8}>
        এটা ব্যর্থ হলে পর্যটক দেখেন
      </SketchText>
      <SketchText x={572} y={196} size={8.5} body bold>
        502 Bad Gateway বা 504 Timeout
      </SketchText>
    </Sketch>
  );
}
