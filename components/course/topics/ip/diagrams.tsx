import { Sketch, SketchSplit, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* 1. একটা IPv4 Address এর ভেতরে                                              */
/* ------------------------------------------------------------------------- */

const OCTETS = [
  { dec: "192", bin: "11000000" },
  { dec: "168", bin: "10101000" },
  { dec: "0", bin: "00000000" },
  { dec: "5", bin: "00000101" },
];

export function IPv4AnatomyDiagram() {
  const w = 150;
  const gap = 34;
  const startX = (760 - (OCTETS.length * w + (OCTETS.length - 1) * gap)) / 2;
  return (
    <Sketch
      label="Diagram: 192.168.0.5 এর ভেতরে"
      height={250}
      minWidth={760}
      viewBox="0 0 760 250"
      caption="একটা IPv4 Address চারটা সংখ্যা, মাঝে ফোঁটা দিয়ে আলাদা করা। প্রতিটা সংখ্যা আসলে একটা Byte, মানে ৮টা Bit, যেটা Lesson 01 এ দেখেছিলেন। ৮টা Bit দিয়ে সবচেয়ে ছোট বানানো যায় 0 (আটটাই শূন্য), আর সবচেয়ে বড় 255 (আটটাই এক)। তাই প্রতিটা সংখ্যা 0 থেকে 255 এর মধ্যে থাকে, এর বাইরে যেতে পারে না। চারটা Byte মিলিয়ে মোট ৩২টা Bit, আর এই ৩২ Bit ই একটা যন্ত্রের পুরো ঠিকানা।"
    >
      {OCTETS.map((o, i) => {
        const x = startX + i * (w + gap);
        return (
          <g key={o.bin}>
            <rect
              x={x}
              y={54}
              width={w}
              height={92}
              fill="var(--primary)"
              fillOpacity={0.06}
              stroke="var(--primary)"
              strokeOpacity={0.9}
              strokeWidth="1.3"
            />
            <SketchText x={x + w / 2} y={92} size={30} bold accent>
              {o.dec}
            </SketchText>
            <SketchText x={x + w / 2} y={124} size={12} opacity={0.75}>
              {o.bin}
            </SketchText>
            <SketchText x={x + w / 2} y={166} size={9} opacity={0.6} body>
              ১ Byte, ৮ Bit
            </SketchText>
            {i < OCTETS.length - 1 && (
              <SketchText x={x + w + gap / 2} y={100} size={26} bold>
                .
              </SketchText>
            )}
          </g>
        );
      })}
      {/* full-width bracket for the 32-bit total */}
      <line
        x1={startX}
        y1={192}
        x2={startX + OCTETS.length * w + (OCTETS.length - 1) * gap}
        y2={192}
        stroke="currentColor"
        strokeOpacity={0.45}
        strokeWidth="1.4"
      />
      <SketchText x={380} y={214} size={11} bold>
        মোট ৩২ Bit, চারটা Byte
      </SketchText>
      <SketchText x={380} y={232} size={9} opacity={0.6} body>
        প্রতিটা সংখ্যা 0 থেকে 255, কারণ ৮ Bit এর বেশি ধরে না
      </SketchText>
      <SketchText x={380} y={34} size={9} opacity={0.55}>
        একটা যন্ত্রের ঠিকানা, যাতে উত্তর ফিরে আসতে পারে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Network অংশ আর Host অংশ                                                  */
/* ------------------------------------------------------------------------- */

export function NetworkHostDiagram() {
  return (
    <Sketch
      label="Diagram: বাঁ দিক কোন Network, ডান দিক কোন যন্ত্র"
      height={230}
      minWidth={700}
      viewBox="0 0 700 230"
      caption="একটা ডাকঠিকানার কথা ভাবুন। সেখানে একটা অংশ বলে কোন এলাকা, কোন মহল্লা, আর একটা অংশ বলে সেই মহল্লার ঠিক কোন বাসা। IP Address ও ঠিক তেমন, দুই ভাগ। বাঁ দিকের অংশ বলে কোন Network, ডান দিকের অংশ বলে সেই Network এর ঠিক কোন যন্ত্র। এই ভাগ থাকে বলেই একটা Router শুধু এলাকা দেখে পথ ঠিক করতে পারে, দুনিয়ার প্রতিটা যন্ত্রের নাম মুখস্থ রাখতে হয় না। ঠিক কোথায় এই ভাগটা পড়বে, সেটা ঠিক করে Subnet Mask, পরের লেসনগুলোর বিষয়।"
    >
      {/* the address, split */}
      <rect
        x={90}
        y={64}
        width={300}
        height={64}
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeWidth="1.4"
      />
      <SketchText x={240} y={104} size={24} bold accent>
        192.168.0
      </SketchText>
      <rect
        x={390}
        y={64}
        width={120}
        height={64}
        fill="currentColor"
        fillOpacity={0.04}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.4"
      />
      <SketchText x={450} y={104} size={24} bold>
        .5
      </SketchText>

      {/* labels under each part */}
      <line
        x1={90}
        y1={150}
        x2={390}
        y2={150}
        stroke="var(--primary)"
        strokeWidth="1.4"
      />
      <SketchText x={240} y={172} size={12} bold accent>
        Network অংশ
      </SketchText>
      <SketchText x={240} y={190} size={9.5} opacity={0.65} body>
        কোন এলাকা, কোন মহল্লা
      </SketchText>

      <line
        x1={390}
        y1={150}
        x2={510}
        y2={150}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.4"
      />
      <SketchText x={450} y={172} size={12} bold>
        Host অংশ
      </SketchText>
      <SketchText x={450} y={190} size={9.5} opacity={0.65} body>
        সেই এলাকার কোন বাসা
      </SketchText>

      <SketchText x={300} y={40} size={9} opacity={0.55} body>
        একই ছবি, দুই ভাগ, ঠিক ডাকঠিকানার মতো
      </SketchText>
      <SketchText x={300} y={218} size={8.5} opacity={0.55} body>
        ভাগটা ঠিক কোথায় পড়বে, বলে Subnet Mask, পরের লেসন
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. কেন IPv4 ফুরিয়ে গেল                                                     */
/* ------------------------------------------------------------------------- */

export function AddressScaleDiagram() {
  return (
    <Sketch
      label="Diagram: ছোট ভাণ্ডার, উপচে পড়া যন্ত্র"
      height={250}
      minWidth={720}
      viewBox="0 0 720 250"
      caption="৩২ Bit দিয়ে সব মিলিয়ে বানানো যায় প্রায় ৪৩০ কোটি আলাদা ঠিকানা, ইংরেজিতে 4.3 বিলিয়ন। এক সময় এটা অকল্পনীয় বড় মনে হতো। কিন্তু আজ পৃথিবীতে শুধু মানুষই ৮০০ কোটির বেশি, আর প্রত্যেকের হাতে Phone, Laptop, ঘরের নানা যন্ত্র, সব মিলিয়ে সংখ্যাটা ঠিকানার চেয়ে অনেক বড় হয়ে গেছে। তাই ২০১১ সালের দিকে উপরের স্তরের নতুন IPv4 ঠিকানার ভাণ্ডার আনুষ্ঠানিকভাবে শেষ হয়ে গেল। এটাই সেই সমস্যা, যেটা মেটাতে IPv6 এল।"
    >
      {/* IPv4 pool, small and full */}
      <SketchText x={40} y={60} size={11} bold anchor="start" accent>
        IPv4
      </SketchText>
      <SketchText x={40} y={78} size={9} anchor="start" opacity={0.6} body>
        ৩২ Bit
      </SketchText>
      <rect
        x={150}
        y={44}
        width={190}
        height={40}
        fill="var(--primary)"
        fillOpacity={0.18}
        stroke="var(--primary)"
        strokeWidth="1.3"
      />
      <SketchText x={245} y={69} size={12} bold accent>
        ৪.৩ বিলিয়ন
      </SketchText>
      <SketchText x={360} y={69} size={11} anchor="start" body opacity={0.7}>
        ঠিকানা, এটুকুই সব
      </SketchText>

      {/* devices overflowing */}
      <SketchText x={40} y={132} size={11} bold anchor="start">
        যন্ত্র
      </SketchText>
      <SketchText x={40} y={150} size={9} anchor="start" opacity={0.6} body>
        মানুষ ৮০০ কোটি+
      </SketchText>
      <rect
        x={150}
        y={116}
        width={520}
        height={40}
        fill="currentColor"
        fillOpacity={0.08}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.3"
      />
      <SketchText x={410} y={141} size={11} body opacity={0.8}>
        Phone, Laptop, ঘরের যন্ত্র, সব মিলিয়ে অনেক বেশি
      </SketchText>
      <SketchText x={688} y={141} size={16} bold accent anchor="end">
        ...
      </SketchText>

      {/* IPv6 pool, runs off the edge */}
      <SketchText x={40} y={204} size={11} bold anchor="start" accent>
        IPv6
      </SketchText>
      <SketchText x={40} y={222} size={9} anchor="start" opacity={0.6} body>
        ১২৮ Bit
      </SketchText>
      <rect
        x={150}
        y={188}
        width={520}
        height={40}
        fill="var(--primary)"
        fillOpacity={0.1}
        stroke="var(--primary)"
        strokeWidth="1.3"
        strokeDasharray="6 4"
      />
      <SketchText x={400} y={213} size={11} body accent>
        ৩৪০ আনডেসিলিয়ন, কার্যত ফুরায় না
      </SketchText>
      <SketchText x={688} y={213} size={16} bold accent anchor="end">
        ...
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. IPv6 কীভাবে ছোট করে লেখা হয়                                             */
/* ------------------------------------------------------------------------- */

const V6_ROWS = [
  {
    text: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
    label: "পুরো রূপ",
    sub: "আটটা দল, প্রতিটা চারটা Hex অক্ষর",
    accent: false,
  },
  {
    text: "2001:db8:85a3:0:0:8a2e:370:7334",
    label: "শুরুর শূন্য বাদ",
    sub: "প্রতিটা দলের সামনের শূন্যগুলো ফেলে দেওয়া যায়",
    accent: false,
  },
  {
    text: "2001:db8:85a3::8a2e:370:7334",
    label: "টানা শূন্য :: দিয়ে",
    sub: "একটানা শূন্যের দলগুলো :: দিয়ে বদলানো, একবারই",
    accent: true,
  },
];

export function IPv6CompressionDiagram() {
  const rowH = 72;
  const top = 30;
  const h = top + V6_ROWS.length * rowH + 10;
  return (
    <Sketch
      label="Diagram: লম্বা IPv6 ঠিকানা ছোট করা"
      height={h}
      minWidth={720}
      viewBox={`0 0 720 ${h}`}
      caption="IPv6 লম্বা, তাই এটাকে ছোট করে লেখার দুইটা নিয়ম আছে। এক, প্রতিটা দলের সামনের শূন্যগুলো ফেলে দেওয়া যায়, যেমন 0db8 লেখা যায় db8। দুই, একটানা যত শূন্যের দল আছে, তার পুরোটা একবার :: দিয়ে বদলে দেওয়া যায়। এই :: পুরো ঠিকানায় একবারই ব্যবহার করা যায়, নাহলে কে জানবে ঠিক কয়টা দল লুকানো আছে। তিনটা লাইন আসলে একই ঠিকানা, শুধু লেখার ধরন আলাদা।"
    >
      {V6_ROWS.map((r, i) => {
        const y = top + i * rowH;
        return (
          <g key={r.label}>
            <rect
              x={30}
              y={y}
              width={660}
              height={rowH - 18}
              fill={r.accent ? "var(--primary)" : "currentColor"}
              fillOpacity={r.accent ? 0.1 : 0.03}
              stroke={r.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={r.accent ? 1 : 0.35}
              strokeWidth="1.3"
            />
            <SketchText
              x={50}
              y={y + 26}
              size={16}
              anchor="start"
              bold
              accent={r.accent}
            >
              {r.text}
            </SketchText>
            <SketchText x={50} y={y + 46} size={9} anchor="start" body opacity={0.6}>
              {r.sub}
            </SketchText>
            <SketchText
              x={670}
              y={y + 26}
              size={10}
              anchor="end"
              bold
              accent={r.accent}
            >
              {r.label}
            </SketchText>
            {i < V6_ROWS.length - 1 && (
              <SketchText x={360} y={y + rowH - 4} size={13} bold accent>
                ↓
              </SketchText>
            )}
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. IPv4 বনাম IPv6, পাশাপাশি                                                 */
/* ------------------------------------------------------------------------- */

export function IPv4vsIPv6Split() {
  return (
    <SketchSplit
      label="Diagram: দুই প্রজন্মের ঠিকানা, পাশাপাশি"
      caption="দুইটা একই কাজ করে, একটা যন্ত্রকে ঠিকানা দেয় যাতে উত্তর ফিরে আসে। তফাত মূলত আকারে। IPv4 ছোট, ৩২ Bit, তাই ঠিকানা সীমিত, আর সেটাই ফুরিয়ে গেছে। IPv6 অনেক বড়, ১২৮ Bit, তাই ঠিকানা কার্যত অফুরান। আজও দুইটা পাশাপাশি চলে, বেশিরভাগ যন্ত্র দুইটাই বোঝে, তাই ধীরে ধীরে বদল হচ্ছে, একদিনে নয়।"
      panels={[
        {
          title: "IPv4",
          sub: "পুরনো, ছোট",
          viewBox: "0 0 300 200",
          height: 200,
          children: (
            <g>
              <rect
                x={20}
                y={26}
                width={260}
                height={46}
                fill="var(--primary)"
                fillOpacity={0.1}
                stroke="var(--primary)"
                strokeWidth="1.3"
              />
              <SketchText x={150} y={54} size={18} bold accent>
                103.94.135.2
              </SketchText>
              <SketchText x={150} y={100} size={11} body>
                ৩২ Bit, চারটা সংখ্যা
              </SketchText>
              <SketchText x={150} y={124} size={11} body>
                ফোঁটা দিয়ে আলাদা, 0 থেকে 255
              </SketchText>
              <SketchText x={150} y={148} size={11} body>
                সব মিলিয়ে ৪.৩ বিলিয়ন
              </SketchText>
              <SketchText x={150} y={176} size={10} body accent>
                সমস্যা: ফুরিয়ে গেছে
              </SketchText>
            </g>
          ),
        },
        {
          title: "IPv6",
          sub: "নতুন, বড়",
          viewBox: "0 0 300 200",
          height: 200,
          children: (
            <g>
              <rect
                x={20}
                y={26}
                width={260}
                height={46}
                fill="var(--primary)"
                fillOpacity={0.1}
                stroke="var(--primary)"
                strokeWidth="1.3"
                strokeDasharray="6 4"
              />
              <SketchText x={150} y={54} size={15} bold accent>
                2001:db8::7334
              </SketchText>
              <SketchText x={150} y={100} size={11} body>
                ১২৮ Bit, আটটা দল
              </SketchText>
              <SketchText x={150} y={124} size={11} body>
                কোলন দিয়ে আলাদা, Hex অক্ষর
              </SketchText>
              <SketchText x={150} y={148} size={11} body>
                সব মিলিয়ে ৩৪০ আনডেসিলিয়ন
              </SketchText>
              <SketchText x={150} y={176} size={10} body accent>
                সমাধান: কার্যত ফুরায় না
              </SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}
