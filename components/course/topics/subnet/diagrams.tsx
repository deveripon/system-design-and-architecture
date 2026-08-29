import { Sketch, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* 1. Mask কোথায় লাইন টানে                                                     */
/* ------------------------------------------------------------------------- */

const IP_OCTETS = ["192", "168", "1", "10"];
const MASK_OCTETS = ["255", "255", "255", "0"];

export function MaskAnatomyDiagram() {
  const w = 150;
  const gap = 24;
  const startX = (760 - (4 * w + 3 * gap)) / 2;
  const rowY = (label: string, y: number, octets: string[], maskRow: boolean) => (
    <g>
      <SketchText x={startX - 14} y={y + 30} size={9} anchor="end" opacity={0.6} body>
        {label}
      </SketchText>
      {octets.map((o, i) => {
        const x = startX + i * (w + gap);
        const network = i < 3;
        return (
          <g key={`${label}-${i}`}>
            <rect
              x={x}
              y={y}
              width={w}
              height={48}
              fill={
                maskRow && network
                  ? "var(--primary)"
                  : maskRow
                    ? "currentColor"
                    : "currentColor"
              }
              fillOpacity={maskRow && network ? 0.14 : 0.04}
              stroke={maskRow && network ? "var(--primary)" : "currentColor"}
              strokeOpacity={maskRow && network ? 1 : 0.4}
              strokeWidth="1.3"
            />
            <SketchText
              x={x + w / 2}
              y={y + 31}
              size={20}
              bold
              accent={maskRow && network}
            >
              {o}
            </SketchText>
          </g>
        );
      })}
    </g>
  );
  return (
    <Sketch
      label="Diagram: 255 মানে Network, 0 মানে Host"
      height={260}
      minWidth={760}
      viewBox="0 0 760 260"
      caption="একটা IP এর কতটুকু Network আর কতটুকু Host, সেই লাইনটা টেনে দেয় Subnet Mask। Mask এর যেখানে 255, সেই অংশটা Network, আর যেখানে 0, সেই অংশটা Host। এখানে Mask হলো 255.255.255.0, তাই প্রথম তিন অংশ (192.168.1) Network আর শেষ অংশ (10) Host। এক Network এর সবাই, মানে যাদের প্রথম তিন অংশ এক, তারা সরাসরি একে অপরের সাথে কথা বলতে পারে।"
    >
      {rowY("IP", 40, IP_OCTETS, false)}
      {rowY("Mask", 108, MASK_OCTETS, true)}

      {/* brackets */}
      <line
        x1={startX}
        y1={172}
        x2={startX + 3 * w + 2 * gap}
        y2={172}
        stroke="var(--primary)"
        strokeWidth="1.4"
      />
      <SketchText x={startX + (3 * w + 2 * gap) / 2} y={190} size={11} bold accent>
        Network অংশ
      </SketchText>
      <line
        x1={startX + 3 * (w + gap)}
        y1={172}
        x2={startX + 4 * w + 3 * gap}
        y2={172}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.4"
      />
      <SketchText x={startX + 3 * (w + gap) + w / 2} y={190} size={11} bold>
        Host অংশ
      </SketchText>

      <SketchText x={380} y={228} size={11} body>
        দুইটা মিলিয়ে Network Address = 192.168.1.0
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. CIDR টেবিল, /n মানে কতগুলো 1                                             */
/* ------------------------------------------------------------------------- */

const CIDR_ROWS = [
  { cidr: "/8", mask: "255.0.0.0", hosts: "১.৬ কোটি", note: "খুব বড় Network", hi: false },
  { cidr: "/16", mask: "255.255.0.0", hosts: "৬৫,৫৩৪", note: "বড় Network", hi: false },
  {
    cidr: "/24",
    mask: "255.255.255.0",
    hosts: "২৫৪",
    note: "বাসা আর ছোট অফিসে এটাই",
    hi: true,
  },
  {
    cidr: "/25",
    mask: "255.255.255.128",
    hosts: "১২৬",
    note: "/24 এর ঠিক অর্ধেক",
    hi: false,
  },
  {
    cidr: "/26",
    mask: "255.255.255.192",
    hosts: "৬২",
    note: "আরও ছোট ভাগ",
    hi: false,
  },
];

export function CidrTableDiagram() {
  const rowH = 40;
  const top = 54;
  const h = top + CIDR_ROWS.length * rowH + 24;
  return (
    <Sketch
      label="Diagram: CIDR, /n মানে শুরুর n টা bit Network"
      height={h}
      minWidth={700}
      viewBox={`0 0 700 ${h}`}
      caption="255.255.255.0 লিখতে লম্বা লাগে, তাই একটা সংক্ষিপ্ত রূপ আছে, নাম CIDR। /24 মানে শুরুর ২৪টা bit Network, যেটা ঠিক 255.255.255.0 এর সমান। খেয়াল করুন, /n এ n যত বড়, Network অংশ তত বড়, আর Host এর জন্য তত কম জায়গা, মানে তত কম যন্ত্র ধরে। প্রতিটা host সংখ্যা থেকে ২টা বাদ যায়, একটা Network Address আর একটা Broadcast Address এর জন্য।"
    >
      <SketchText x={70} y={38} size={9} anchor="start" opacity={0.55}>
        CIDR
      </SketchText>
      <SketchText x={180} y={38} size={9} anchor="start" opacity={0.55}>
        Subnet Mask
      </SketchText>
      <SketchText x={410} y={38} size={9} anchor="start" opacity={0.55}>
        কতগুলো যন্ত্র
      </SketchText>
      <SketchText x={520} y={38} size={9} anchor="start" opacity={0.55}>
        কোথায়
      </SketchText>
      {CIDR_ROWS.map((r, i) => {
        const y = top + i * rowH;
        return (
          <g key={r.cidr}>
            <rect
              x={30}
              y={y}
              width={640}
              height={rowH - 8}
              fill={r.hi ? "var(--primary)" : "transparent"}
              fillOpacity={r.hi ? 0.1 : 0}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth="1"
            />
            <SketchText x={70} y={y + 20} size={13} anchor="start" bold accent={r.hi}>
              {r.cidr}
            </SketchText>
            <SketchText x={180} y={y + 20} size={12} anchor="start" body>
              {r.mask}
            </SketchText>
            <SketchText x={410} y={y + 20} size={12} anchor="start" bold accent={r.hi}>
              {r.hosts}
            </SketchText>
            <SketchText x={520} y={y + 20} size={9.5} anchor="start" opacity={0.7} body>
              {r.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. একটা /24 কে দুইটা /25 এ ভাগ                                             */
/* ------------------------------------------------------------------------- */

export function SplitDiagram() {
  return (
    <Sketch
      label="Diagram: একটা বড় Network দুই ভাগ"
      height={220}
      minWidth={720}
      viewBox="0 0 720 220"
      caption="Subnetting মানে একটা বড় Network কে ছোট ছোট ভাগে ভাগ করা। এখানে একটা 192.168.1.0/24 (২৫৪টা যন্ত্র ধরে) কে ভাগ করা হয়েছে দুইটা /25 এ। Host অংশ থেকে মাত্র একটা bit ধার করলেই Network সংখ্যা দ্বিগুণ হয়, আর প্রতিটার যন্ত্রধারণ ক্ষমতা অর্ধেক হয়ে যায়। এভাবে আলাদা বিভাগ, আলাদা তলা বা আলাদা কাজের যন্ত্রগুলোকে আলাদা Network এ রাখা যায়।"
    >
      {/* the whole /24 */}
      <rect
        x={140}
        y={34}
        width={440}
        height={40}
        fill="currentColor"
        fillOpacity={0.05}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.3"
      />
      <SketchText x={360} y={59} size={12} bold>
        192.168.1.0/24, ২৫৪টা যন্ত্র
      </SketchText>

      {/* arrow down */}
      <line
        x1={360}
        y1={80}
        x2={360}
        y2={110}
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      <SketchText x={380} y={100} size={9} anchor="start" accent body>
        ১ bit ধার
      </SketchText>

      {/* two /25 */}
      <rect
        x={140}
        y={120}
        width={210}
        height={48}
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      <SketchText x={245} y={140} size={12} bold accent>
        192.168.1.0/25
      </SketchText>
      <SketchText x={245} y={158} size={9} opacity={0.75} body>
        .1 থেকে .126, ১২৬টা যন্ত্র
      </SketchText>

      <rect
        x={370}
        y={120}
        width={210}
        height={48}
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      <SketchText x={475} y={140} size={12} bold accent>
        192.168.1.128/25
      </SketchText>
      <SketchText x={475} y={158} size={9} opacity={0.75} body>
        .129 থেকে .254, ১২৬টা যন্ত্র
      </SketchText>

      <SketchText x={360} y={196} size={9} opacity={0.6} body>
        দুই ভাগ আলাদা Network, নিজেদের মধ্যে সরাসরি, একে অপরের কাছে Router দিয়ে
      </SketchText>
    </Sketch>
  );
}
