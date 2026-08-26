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
/* 1. আকারের সিঁড়ি                                                            */
/* ------------------------------------------------------------------------- */

const RUNGS = [
  {
    name: "PAN",
    area: "আপনার শরীরের কাছে",
    ex: "Phone আর Bluetooth Earbud",
    reach: "কয়েক মিটার",
    w: 90,
  },
  {
    name: "LAN",
    area: "এক বিল্ডিং, এক বাসা",
    ex: "বাসার Wi-Fi, অফিসের Network",
    reach: "কয়েকশো মিটার",
    w: 170,
    hot: true,
  },
  {
    name: "MAN",
    area: "এক শহর",
    ex: "শহরজুড়ে ISP এর জাল",
    reach: "কয়েক কিলোমিটার",
    w: 300,
  },
  {
    name: "WAN",
    area: "দেশ, মহাদেশ, পৃথিবী",
    ex: "Internet নিজেই সবচেয়ে বড় WAN",
    reach: "হাজার হাজার কিলোমিটার",
    w: 470,
    hot: true,
  },
];

export function ScaleLadderDiagram() {
  const rowH = 66;
  const top = 44;
  const h = top + RUNGS.length * rowH + 30;
  return (
    <Sketch
      label="Diagram: আকার অনুযায়ী নেটওয়ার্কের নাম"
      height={h}
      minWidth={720}
      viewBox={`0 0 720 ${h}`}
      caption="একটা Network কতটুকু এলাকা জুড়ে, সেটার উপর তার নাম বদলায়। বাসার ভেতরের ছোট Network টা LAN, Local Area Network। শহরজুড়ে ছড়ালে MAN, আর দেশ বা পৃথিবীজুড়ে হলে WAN, Wide Area Network। নামগুলো মুখস্থ করার দরকার নেই, কিন্তু একটা কথা মাথায় গেঁথে নিন, দুইটাই সবচেয়ে বেশি কাজে লাগে, LAN মানে আপনার নিজের ছোট Network, আর WAN মানে বাইরের বিশাল দুনিয়া। Internet নিজেই পৃথিবীর সবচেয়ে বড় WAN।"
    >
      {RUNGS.map((r, i) => {
        const y = top + i * rowH;
        return (
          <g key={r.name}>
            <rect
              x={20}
              y={y}
              width={r.w}
              height={rowH - 16}
              fill={r.hot ? "var(--primary)" : "transparent"}
              fillOpacity={r.hot ? 0.12 : 0}
              stroke={r.hot ? "var(--primary)" : "currentColor"}
              strokeOpacity={r.hot ? 1 : 0.4}
              strokeWidth="1.3"
            />
            <SketchText x={20 + 46} y={y + 22} size={13} bold accent={r.hot}>
              {r.name}
            </SketchText>
            <SketchText
              x={20 + r.w + 14}
              y={y + 14}
              size={9.5}
              anchor="start"
              bold
            >
              {r.area}
            </SketchText>
            <SketchText
              x={20 + r.w + 14}
              y={y + 28}
              size={8}
              anchor="start"
              opacity={0.6}
              body
            >
              {r.ex}, {r.reach}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={30} y={h - 12} size={8} anchor="start" opacity={0.5}>
        বাক্স যত চওড়া, এলাকা তত বড়
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. LAN আর WAN, চারটা তফাত                                                  */
/* ------------------------------------------------------------------------- */

const LAN_ROWS = [
  { k: "মালিক", v: "আপনি নিজে" },
  { k: "গতি", v: "খুব দ্রুত, কাছে বলে" },
  { k: "খরচ", v: "বিনামূল্যে, নিজের তার" },
  { k: "বিশ্বাস", v: "চেনা যন্ত্র, মোটামুটি নিরাপদ" },
];

const WAN_ROWS = [
  { k: "মালিক", v: "অনেক কোম্পানি, ভাড়া করা" },
  { k: "গতি", v: "ধীর, দূরত্বের সীমা" },
  { k: "খরচ", v: "মাসে টাকা, ISP কে" },
  { k: "বিশ্বাস", v: "অচেনা সবাই, সাবধান থাকতে হয়" },
];

export function LanVsWanSplit() {
  const rows = (data: { k: string; v: string }[], accent: boolean) =>
    data.map((r, i) => (
      <g key={r.k}>
        <SketchText
          x={16}
          y={54 + i * 34}
          size={9}
          anchor="start"
          opacity={0.6}
          bold
        >
          {r.k}
        </SketchText>
        <SketchText
          x={16}
          y={68 + i * 34}
          size={9.5}
          anchor="start"
          accent={accent}
          body
        >
          {r.v}
        </SketchText>
        {i < data.length - 1 && (
          <line
            x1={16}
            y1={76 + i * 34}
            x2={264}
            y2={76 + i * 34}
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth="1"
          />
        )}
      </g>
    ));
  return (
    <SketchSplit
      label="Diagram: ভেতরের দুনিয়া, বাইরের দুনিয়া"
      caption="এই চারটা তফাত মনে রাখলে বাকি পুরো মডিউল সহজ হয়ে যায়। LAN হলো আপনার নিজের উঠান, আপনার মালিকানা, দ্রুত, বিনামূল্যে, চেনা মানুষ। WAN হলো বাইরের রাস্তা, অন্যের মালিকানা, ধীর, টাকা লাগে, অচেনা ভিড়। এই তফাতের কারণেই পরে অনেক সিদ্ধান্ত হয়, যেমন Database কে LAN এর ভেতরে রাখা, বা বাইরের দরজায় পাহারা বসানো।"
      panels={[
        {
          title: "LAN, ভেতরে",
          sub: "আপনার নিজের উঠান",
          viewBox: "0 0 280 190",
          height: 190,
          children: (
            <g>
              <SketchText x={16} y={24} size={10} accent bold anchor="start">
                নিজের, দ্রুত, নিরাপদ
              </SketchText>
              {rows(LAN_ROWS, true)}
            </g>
          ),
        },
        {
          title: "WAN, বাইরে",
          sub: "অন্যের রাস্তা",
          viewBox: "0 0 280 190",
          height: 190,
          children: (
            <g>
              <SketchText
                x={16}
                y={24}
                size={10}
                bold
                anchor="start"
                opacity={0.75}
              >
                ভাড়া, ধীর, অচেনা
              </SketchText>
              {rows(WAN_ROWS, false)}
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. নেটওয়ার্কের ভেতরে নেটওয়ার্ক                                             */
/* ------------------------------------------------------------------------- */

export function NestedNetworksDiagram() {
  return (
    <Sketch
      label="Diagram: আপনার Laptop কোথায় বসে আছে"
      height={300}
      minWidth={640}
      viewBox="0 0 640 300"
      caption="আপনার Laptop একা কোথাও ভাসছে না, সে কয়েকটা স্তরের ভেতরে বসে আছে। সবচেয়ে ভেতরে আপনার বাসার LAN। সেটা বসে আছে আপনার ISP এর বড় Network এর ভেতরে। আর সেটা বসে আছে গোটা Internet এর ভেতরে, মানে সবচেয়ে বড় WAN। বাইরের দিকে যত যাবেন, তত ধীর, তত অচেনা, তত টাকা লাগে। এই ছবিটাই পরের সব লেসনের ভিত্তি, কারণ প্রতিটা লেসন আসলে এই স্তরগুলোর কোনো একটা সীমানা পার হওয়ার গল্প।"
    >
      {/* outer: internet */}
      <rect
        x={30}
        y={24}
        width={580}
        height={252}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth="1.2"
        strokeDasharray="5 4"
      />
      <SketchText x={320} y={44} size={11} bold>
        INTERNET, সবচেয়ে বড় WAN
      </SketchText>
      {/* mid: ISP */}
      <rect
        x={70}
        y={64}
        width={500}
        height={180}
        fill="currentColor"
        fillOpacity={0.03}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth="1.2"
      />
      <SketchText x={320} y={84} size={10} opacity={0.75}>
        আপনার ISP এর Network
      </SketchText>
      {/* inner: LAN */}
      <rect
        x={130}
        y={104}
        width={380}
        height={116}
        fill="var(--primary)"
        fillOpacity={0.08}
        stroke="var(--primary)"
        strokeWidth="1.4"
      />
      <SketchText x={320} y={124} size={10} accent bold>
        আপনার বাসার LAN
      </SketchText>
      <SketchBox
        x={165}
        y={140}
        w={90}
        h={40}
        title="Router"
        sub="দরজা"
        accent
      />
      <SketchBox x={290} y={140} w={80} h={40} title="Laptop" sub="আপনি" />
      <SketchBox x={390} y={140} w={80} h={40} title="Phone" sub="" />
      <line
        x1={255}
        y1={160}
        x2={290}
        y2={160}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth="1.2"
      />
      <line
        x1={255}
        y1={166}
        x2={390}
        y2={166}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth="1.1"
      />
      {/* arrow out */}
      <line
        x1={210}
        y1={140}
        x2={210}
        y2={64}
        stroke="var(--primary)"
        strokeWidth="1.3"
        markerEnd="url(#nn-a)"
      />
      <SketchText x={252} y={100} size={8} accent opacity={0.8} anchor="start">
        Router দিয়ে বাইরে
      </SketchText>
      <SketchText x={320} y={266} size={8.5} opacity={0.6} body>
        ভেতর থেকে বাইরে: দ্রুত থেকে ধীর, চেনা থেকে অচেনা
      </SketchText>
      <Defs id="nn-a" accent />
    </Sketch>
  );
}
