import { Sketch, SketchSplit, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* Shared bits                                                               */
/* ------------------------------------------------------------------------- */

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

/** The first twelve bookings, newest first, exactly as the sample database orders them. */
const NEWEST = [
  { id: 24, at: "14 Oct 11:05" },
  { id: 23, at: "13 Oct 20:55" },
  { id: 22, at: "12 Oct 08:30" },
  { id: 21, at: "11 Oct 18:00" },
  { id: 20, at: "10 Oct 17:20" },
  { id: 17, at: "08 Oct 09:15" },
  { id: 19, at: "04 Oct 13:40" },
  { id: 16, at: "02 Oct 10:05" },
  { id: 14, at: "01 Oct 12:25" },
  { id: 18, at: "28 Sep 23:30" },
  { id: 15, at: "20 Sep 19:45" },
  { id: 13, at: "15 Sep 21:10" },
];

/* ------------------------------------------------------------------------- */
/* 1. OFFSET বাদ দেয়, LIMIT জানালা খোলে                                         */
/* ------------------------------------------------------------------------- */

export function LimitWindowDiagram() {
  const top = 46;
  const rowH = 26;
  const x = 250;
  const w = 300;
  const offset = 5;
  const limit = 5;
  return (
    <Sketch
      label="OFFSET 5 LIMIT 5: সাজানো তালিকা থেকে একটা জানালা"
      height={420}
      minWidth={760}
      viewBox="0 0 800 420"
      caption={
        <>
          Database আগে পুরো তালিকাটা ORDER BY অনুযায়ী সাজায় (booked_at নতুন থেকে পুরনো,
          সমান হলে booking_id)। তারপর OFFSET 5 প্রথম পাঁচটা Row ফেলে দেয়, আর LIMIT 5
          পরের পাঁচটা নিয়ে থামে। ছবির Row গুলো Sample Database এর আসল Booking, আসল
          ক্রমে। খেয়াল করুন booking_id ক্রমে নেই: 17 আছে 19 এর আগে, কারণ সাজানো হয়েছে
          সময় দিয়ে, নম্বর দিয়ে না।
        </>
      }
    >
      <Arrow id="page-window-arrow" />
      <SketchText x={x + w / 2} y={28} size={11} bold>
        ORDER BY booked_at DESC, booking_id DESC
      </SketchText>
      {NEWEST.map((row, i) => {
        const y = top + i * rowH;
        const skipped = i < offset;
        const picked = i >= offset && i < offset + limit;
        return (
          <g key={row.id}>
            <rect
              x={x}
              y={y}
              width={w}
              height={rowH - 4}
              fill={picked ? "var(--primary)" : "currentColor"}
              fillOpacity={picked ? 0.14 : skipped ? 0.06 : 0.02}
              stroke={picked ? "var(--primary)" : "currentColor"}
              strokeOpacity={picked ? 0.9 : 0.3}
              strokeWidth="1.1"
              strokeDasharray={skipped ? "4 3" : undefined}
            />
            <SketchText x={x + 14} y={y + 15} anchor="start" size={10.5} accent={picked} opacity={skipped ? 0.5 : 0.9}>
              {`booking ${row.id}`}
            </SketchText>
            <SketchText x={x + w - 14} y={y + 15} anchor="end" size={10} opacity={skipped ? 0.45 : 0.75}>
              {row.at}
            </SketchText>
            <SketchText x={x - 14} y={y + 15} anchor="end" size={9.5} opacity={0.5}>
              {`${i + 1}`}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={x + w / 2} y={top + NEWEST.length * rowH + 14} size={10} opacity={0.5}>
        ... আরও 12টা Row
      </SketchText>

      {/* Left: what OFFSET does */}
      <path
        d={`M ${x - 40} ${top} H ${x - 52} V ${top + offset * rowH - 4} H ${x - 40}`}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.2"
      />
      <SketchText x={x - 64} y={top + (offset * rowH) / 2 - 6} anchor="end" size={11} bold>
        OFFSET 5
      </SketchText>
      <SketchText x={x - 64} y={top + (offset * rowH) / 2 + 12} anchor="end" size={10} body opacity={0.75}>
        পড়া হলো, ফেলে দেওয়া হলো
      </SketchText>

      {/* Right: what LIMIT returns */}
      <path
        d={`M ${x + w + 40} ${top + offset * rowH} H ${x + w + 52} V ${top + (offset + limit) * rowH - 4} H ${x + w + 40}`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.4"
      />
      <line
        x1={x + w + 60}
        y1={top + (offset + limit / 2) * rowH - 2}
        x2={x + w + 96}
        y2={top + (offset + limit / 2) * rowH - 2}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#page-window-arrow)"
      />
      <SketchText x={x + w + 104} y={top + (offset + limit / 2) * rowH - 8} anchor="start" size={11} bold accent>
        LIMIT 5
      </SketchText>
      <SketchText x={x + w + 104} y={top + (offset + limit / 2) * rowH + 10} anchor="start" size={10} body accent>
        শুধু এগুলোই ফেরত আসে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. OFFSET গোনে, Keyset লাফ দেয়                                              */
/* ------------------------------------------------------------------------- */

function RowsStrip({
  readUntil,
  returnFrom,
  jump,
  markerId,
}: {
  readUntil: number;
  returnFrom: number;
  jump?: boolean;
  markerId: string;
}) {
  const cells = 20;
  const cw = 15;
  const x0 = 20;
  const y = 70;
  return (
    <>
      <Arrow id={markerId} />
      {Array.from({ length: cells }, (_, i) => {
        const read = i < readUntil;
        const returned = i >= returnFrom && i < readUntil;
        return (
          <rect
            key={i}
            x={x0 + i * cw}
            y={y}
            width={cw - 3}
            height={34}
            fill={returned ? "var(--primary)" : "currentColor"}
            fillOpacity={returned ? 0.45 : read ? 0.18 : 0.04}
            stroke={returned ? "var(--primary)" : "currentColor"}
            strokeOpacity={returned ? 0.9 : 0.3}
            strokeWidth="1"
          />
        );
      })}
      {jump ? (
        <path
          d={`M ${x0} ${y - 8} C ${x0 + 60} ${y - 52}, ${x0 + returnFrom * cw - 40} ${y - 52}, ${x0 + returnFrom * cw + 4} ${y - 6}`}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.4"
          markerEnd={`url(#${markerId})`}
        />
      ) : (
        <line
          x1={x0}
          y1={y - 14}
          x2={x0 + readUntil * cw - 6}
          y2={y - 14}
          stroke="currentColor"
          strokeOpacity={0.6}
          strokeWidth="1.3"
          markerEnd={`url(#${markerId})`}
        />
      )}
    </>
  );
}

export function OffsetVsKeysetSplit() {
  return (
    <SketchSplit
      label="গভীর পাতায় দুই পদ্ধতির খরচ"
      caption={
        <>
          ধরুন পাতা ৪, প্রতি পাতায় ৫টা Row। OFFSET 15 এ Database প্রথম থেকে গুনে ১৫টা Row
          পড়ে ফেলে দেয়, তারপর ৫টা দেয়: মোট ২০টা Row এর কাজ। Keyset এ আগের পাতার শেষ
          Row টা বুকমার্ক, Index এর সাহায্যে Database সোজা সেখানে লাফ দেয় আর ৫টা পড়ে।
          পাতা যত গভীর, তফাত তত বড়।
        </>
      }
      panels={[
        {
          title: "OFFSET 15 LIMIT 5",
          sub: "গুনে গুনে এগোনো",
          viewBox: "0 0 340 150",
          height: 150,
          children: (
            <>
              <RowsStrip readUntil={20} returnFrom={15} markerId="page-split-offset-arrow" />
              <SketchText x={170} y={130} size={10} body opacity={0.8}>
                ২০টা পড়া, ১৫টা ফেলে দেওয়া, ৫টা ফেরত
              </SketchText>
            </>
          ),
        },
        {
          title: "WHERE (booked_at, booking_id) < বুকমার্ক",
          sub: "সোজা লাফ",
          viewBox: "0 0 340 150",
          height: 150,
          children: (
            <>
              <RowsStrip readUntil={20} returnFrom={15} jump markerId="page-split-keyset-arrow" />
              <rect x={20} y={70} width={15 * 15 - 3} height={34} fill="var(--card)" fillOpacity={0.75} />
              <SketchText x={130} y={92} size={9.5} body opacity={0.6}>
                ছোঁয়াই হয় না
              </SketchText>
              <SketchText x={170} y={130} size={10} body accent>
                ৫টা পড়া, ৫টা ফেরত
              </SketchText>
            </>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. দুই অংশের তুলনা, বাম থেকে ডানে                                             */
/* ------------------------------------------------------------------------- */

function Pair({
  y,
  left,
  right,
  decides,
  verdict,
}: {
  y: number;
  left: [string, string];
  right: [string, string];
  decides: 0 | 1;
  verdict: string;
}) {
  const cell = (x: number, text: string, accent: boolean) => (
    <g>
      <rect
        x={x}
        y={y}
        width={150}
        height={30}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.12 : 0.03}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 0.9 : 0.35}
        strokeWidth="1.1"
      />
      <SketchText x={x + 75} y={y + 19} size={10.5} accent={accent}>
        {text}
      </SketchText>
    </g>
  );
  return (
    <g>
      {cell(40, left[0], decides === 0)}
      {cell(194, left[1], decides === 1)}
      <SketchText x={372} y={y + 20} size={14} bold>
        {"<"}
      </SketchText>
      {cell(400, right[0], decides === 0)}
      {cell(554, right[1], decides === 1)}
      <SketchText x={720} y={y + 19} anchor="start" size={10} body opacity={0.85}>
        {verdict}
      </SketchText>
    </g>
  );
}

export function RowCompareDiagram() {
  return (
    <Sketch
      label="(booked_at, booking_id) < (…, …): অভিধানের মতো তুলনা"
      height={260}
      minWidth={900}
      viewBox="0 0 900 260"
      caption={
        <>
          দুই অংশের Row তুলনা হয় অভিধানে শব্দ সাজানোর মতো: আগে প্রথম অংশ, সেটা সমান হলে
          তবেই দ্বিতীয় অংশ। উজ্জ্বল ঘরটাই রায় দেয়। প্রথম জোড়ায় সময়েই তফাত, তাই
          booking_id দেখাই হয় না। দ্বিতীয় জোড়ায় সময় হুবহু এক, তখন booking_id ঠিক
          করে কে আগে। এই কারণেই Keyset এ একটা অনন্য Column শেষে রাখতে হয়।
        </>
      }
    >
      <SketchText x={115} y={34} size={10} bold opacity={0.7}>
        booked_at
      </SketchText>
      <SketchText x={269} y={34} size={10} bold opacity={0.7}>
        booking_id
      </SketchText>
      <SketchText x={475} y={34} size={10} bold opacity={0.7}>
        booked_at
      </SketchText>
      <SketchText x={629} y={34} size={10} bold opacity={0.7}>
        booking_id
      </SketchText>
      <SketchText x={205} y={16} size={10} body opacity={0.6}>
        যে Row টা দেখছি
      </SketchText>
      <SketchText x={565} y={16} size={10} body opacity={0.6}>
        বুকমার্ক
      </SketchText>
      <Pair
        y={50}
        left={["10-08 09:15", "17"]}
        right={["10-10 17:20", "20"]}
        decides={0}
        verdict="সত্য: সময়টাই আগের"
      />
      <Pair
        y={110}
        left={["10-14 11:05", "24"]}
        right={["10-10 17:20", "20"]}
        decides={0}
        verdict="মিথ্যা: সময়টা পরের"
      />
      <Pair
        y={170}
        left={["10-10 17:20", "19"]}
        right={["10-10 17:20", "20"]}
        decides={1}
        verdict="সত্য: সময় সমান, তাই ID"
      />
      <SketchText x={450} y={240} size={10} body opacity={0.6}>
        তৃতীয় জোড়াটা বানানো উদাহরণ: Sample Data তে দুটো Booking এর সময় কখনো এক না।
      </SketchText>
    </Sketch>
  );
}
