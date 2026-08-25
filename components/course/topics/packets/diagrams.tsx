import { Sketch, SketchBox, SketchSplit, SketchText } from "../../sketch";

function Defs({ id, accent }: { id: string; accent?: boolean }) {
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
          fill={accent ? "var(--primary)" : "currentColor"}
          fillOpacity={accent ? 1 : 0.55}
        />
      </marker>
    </defs>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. একটা বড় চিঠি, অনেক ছোট খাম                                              */
/* ------------------------------------------------------------------------- */

export function ChopIntoPacketsDiagram() {
  const pkts = [1, 2, 3, 4, 5];
  return (
    <Sketch
      label="Diagram: এক ফাইল, পাঁচটা Packet, তিনটা রাস্তা"
      height={300}
      minWidth={880}
      viewBox="0 0 880 300"
      caption="বাঁ পাশের বড় ফাইলটা একটানা যায় না। Kernel সেটাকে ছোট ছোট টুকরো করে, প্রতিটার নাম Packet, আর প্রতিটার গায়ে লেখা থাকে সে কত নম্বর, মোট কয়টা। তারপর প্রতিটা Packet আলাদাভাবে ছাড়া হয়, আর তারা আলাদা রাস্তায় যেতে পারে। ৩ নম্বর হয়তো ২ নম্বরের আগে পৌঁছাল, আর ৪ নম্বর হারিয়ে গেল। ওপাশে Kernel নম্বর দেখে আবার সাজায়, আর হারানোটা আবার চায়। এই সাজানো আর আবার চাওয়ার কাজটা কে করে, সেটা Module 05।"
    >
      {/* the file */}
      <SketchBox
        x={20}
        y={110}
        w={120}
        h={70}
        title="ছবি.jpg"
        sub="২ MB"
        accent
      />
      <SketchText x={80} y={200} size={8} opacity={0.6} body>
        একটা বড় ফাইল
      </SketchText>

      {/* chopping */}
      <line
        x1={140}
        y1={145}
        x2={196}
        y2={145}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.2"
        markerEnd="url(#cp-a)"
      />
      <SketchText x={168} y={136} size={7.5} opacity={0.6}>
        কাটা
      </SketchText>

      {/* five packets stacked */}
      {pkts.map((n, i) => (
        <g key={n}>
          <rect
            x={200}
            y={40 + i * 44}
            width={70}
            height={34}
            fill={n === 4 ? "transparent" : "var(--primary)"}
            fillOpacity={n === 4 ? 0 : 0.1}
            stroke={n === 4 ? "currentColor" : "var(--primary)"}
            strokeOpacity={n === 4 ? 0.3 : 1}
            strokeWidth="1.1"
            strokeDasharray={n === 4 ? "3 3" : undefined}
          />
          <SketchText
            x={235}
            y={54 + i * 44}
            size={10}
            bold
            accent={n !== 4}
            opacity={n === 4 ? 0.4 : 1}
          >
            {n} / ৫
          </SketchText>
          <SketchText x={235} y={66 + i * 44} size={7} opacity={0.5}>
            Packet
          </SketchText>
        </g>
      ))}

      {/* three roads */}
      <SketchBox
        x={360}
        y={130}
        w={90}
        h={40}
        title="Router"
        sub="তিন রাস্তা"
      />
      <line
        x1={270}
        y1={145}
        x2={356}
        y2={145}
        stroke="currentColor"
        strokeOpacity={0.45}
        strokeWidth="1.2"
        markerEnd="url(#cp-a)"
      />
      {[70, 145, 220].map((y, i) => (
        <path
          key={i}
          d={`M 450 145 Q 540 ${y} 640 ${y}`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.4}
          strokeWidth="1.1"
          strokeDasharray="4 3"
          markerEnd="url(#cp-a)"
        />
      ))}
      <SketchText x={545} y={30} size={7.5} opacity={0.55}>
        প্রতিটা Packet নিজের রাস্তা পায়
      </SketchText>

      {/* arrival, out of order, one missing */}
      <SketchText x={720} y={30} size={7.5} opacity={0.55}>
        যেভাবে পৌঁছাল
      </SketchText>
      {[
        { label: "৩ / ৫", y: 55 },
        { label: "১ / ৫", y: 99 },
        { label: "৫ / ৫", y: 143 },
        { label: "২ / ৫", y: 187 },
        { label: "৪ হারিয়ে গেছে", y: 231, lost: true },
      ].map((p, i) => (
        <g key={i}>
          <rect
            x={680}
            y={p.y}
            width={p.lost ? 150 : 80}
            height={30}
            fill={p.lost ? "transparent" : "var(--primary)"}
            fillOpacity={p.lost ? 0 : 0.08}
            stroke={p.lost ? "currentColor" : "var(--primary)"}
            strokeOpacity={p.lost ? 0.3 : 0.9}
            strokeWidth="1"
            strokeDasharray={p.lost ? "3 3" : undefined}
          />
          <SketchText
            x={p.lost ? 755 : 720}
            y={p.y + 19}
            size={p.lost ? 9 : 10}
            bold={!p.lost}
            accent={!p.lost}
            opacity={p.lost ? 0.5 : 1}
          >
            {p.label}
          </SketchText>
        </g>
      ))}
      <Defs id="cp-a" />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. চওড়া পাইপ আর দ্রুত পাইপ এক জিনিস নয়                                     */
/* ------------------------------------------------------------------------- */

export function LatencyVsBandwidthSplit() {
  return (
    <SketchSplit
      label="Diagram: চওড়া, নাকি দ্রুত"
      caption="Latency মানে একটা Packet এক মাথা থেকে অন্য মাথায় পৌঁছাতে কতক্ষণ, মাপা হয় মিলিসেকেন্ডে। Bandwidth মানে এক সেকেন্ডে কতটা Data ঢোকানো যায়, মাপা হয় Mbps তে। দুইটা আলাদা জিনিস, আর একটা বাড়ালে অন্যটা বাড়ে না। বাঁ পাশে সরু কিন্তু ছোট পাইপ, প্রথম ফোঁটা দ্রুত পৌঁছায় কিন্তু একসাথে কম যায়। ডান পাশে চওড়া কিন্তু লম্বা পাইপ, একসাথে অনেক যায় কিন্তু প্রথম ফোঁটা পৌঁছাতে দেরি।"
      panels={[
        {
          title: "কম Latency",
          sub: "কাছের, প্রথম ফোঁটা দ্রুত",
          viewBox: "0 0 320 180",
          height: 180,
          children: (
            <g>
              <SketchBox x={10} y={70} w={70} h={40} title="আপনি" />
              <SketchBox x={240} y={70} w={70} h={40} title="Server" accent />
              <rect
                x={80}
                y={82}
                width={160}
                height={16}
                fill="var(--primary)"
                fillOpacity={0.1}
                stroke="var(--primary)"
                strokeWidth="1"
              />
              <SketchText x={160} y={64} size={8} opacity={0.6} body>
                ছোট পাইপ, কাছে
              </SketchText>
              <SketchText x={160} y={125} size={9} accent bold>
                ৫ ms
              </SketchText>
              <SketchText x={160} y={140} size={8} opacity={0.6} body>
                প্রথম ফোঁটা এখানে পৌঁছাল
              </SketchText>
              <SketchText x={160} y={162} size={8} opacity={0.55} body>
                Chat, Game, Type করার সময় এটা লাগে
              </SketchText>
            </g>
          ),
        },
        {
          title: "বেশি Bandwidth",
          sub: "চওড়া, কিন্তু দূরে",
          viewBox: "0 0 320 180",
          height: 180,
          children: (
            <g>
              <SketchBox x={10} y={70} w={70} h={40} title="আপনি" />
              <SketchBox x={240} y={70} w={70} h={40} title="Server" accent />
              <rect
                x={80}
                y={70}
                width={160}
                height={40}
                fill="var(--primary)"
                fillOpacity={0.14}
                stroke="var(--primary)"
                strokeWidth="1.4"
              />
              <SketchText x={160} y={60} size={8} opacity={0.6} body>
                চওড়া পাইপ, দূরে
              </SketchText>
              <SketchText x={160} y={135} size={9} accent bold>
                ২০০ ms, কিন্তু একসাথে অনেক
              </SketchText>
              <SketchText x={160} y={162} size={8} opacity={0.55} body>
                বড় File, Video Download এ এটা লাগে
              </SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. দূরত্বই Latency এর মেঝে                                                   */
/* ------------------------------------------------------------------------- */

const HOPS = [
  { place: "একই শহর", ms: "৫ ms", bar: 0.04, note: "পাশের এলাকার Server" },
  { place: "একই দেশ", ms: "২০ ms", bar: 0.1, note: "Dhaka থেকে Dhaka" },
  { place: "Singapore", ms: "৬০ ms", bar: 0.3, note: "বেশিরভাগ সাইট এখানে" },
  { place: "Europe", ms: "১২০ ms", bar: 0.6, note: "অর্ধেক পৃথিবী" },
  { place: "US পশ্চিম", ms: "২২০ ms", bar: 1, note: "প্রায় উল্টো পিঠ" },
];

export function DistanceLatencyDiagram() {
  const rowH = 44;
  const top = 44;
  const h = top + HOPS.length * rowH + 40;
  return (
    <Sketch
      label="Diagram: যত দূর, তত দেরি"
      height={h}
      minWidth={780}
      viewBox={`0 0 780 ${h}`}
      caption="আলো কাচের তারে যায় সেকেন্ডে প্রায় দুই লাখ কিলোমিটার। দ্রুত, কিন্তু অসীম নয়। তাই দূরত্ব থেকে একটা সবচেয়ে কম Latency ঠিক হয়ে যায়, যেটা যত টাকা দিলেও কমানো যায় না, কারণ আলোর চেয়ে দ্রুত কিছু যায় না। US এর সার্ভারে আপনার প্রতিটা কথা যাওয়া আসায় অন্তত ২২০ মিলিসেকেন্ড লাগবেই। এই কারণেই বড় কোম্পানিরা Server আপনার কাছে এনে বসায়, যাকে বলে CDN, আর সেটা Module 12।"
    >
      <SketchText x={20} y={26} size={8} anchor="start" opacity={0.55}>
        Bangladesh থেকে দূরত্ব
      </SketchText>
      <SketchText x={470} y={26} size={8} anchor="start" opacity={0.55}>
        যাওয়া আসার সবচেয়ে কম সময়
      </SketchText>
      {HOPS.map((hop, i) => {
        const y = top + i * rowH;
        const accent = i >= 3;
        return (
          <g key={hop.place}>
            <SketchText x={20} y={y + 20} size={11} anchor="start" bold>
              {hop.place}
            </SketchText>
            <SketchText
              x={20}
              y={y + 34}
              size={8}
              anchor="start"
              opacity={0.55}
              body
            >
              {hop.note}
            </SketchText>
            <rect
              x={200}
              y={y + 6}
              width={240 * hop.bar}
              height={22}
              fill={accent ? "var(--primary)" : "currentColor"}
              fillOpacity={accent ? 0.7 : 0.35}
            />
            <SketchText
              x={460}
              y={y + 22}
              size={11}
              anchor="start"
              bold
              accent={accent}
            >
              {hop.ms}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={390} y={h - 14} size={8} opacity={0.5} body>
        এই সংখ্যাগুলো আনুমানিক, কিন্তু আলোর সীমা আসল আর কমে না
      </SketchText>
    </Sketch>
  );
}
