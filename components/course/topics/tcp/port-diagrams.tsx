import { Sketch, SketchSplit, SketchText } from "../../sketch";

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

function Box({
  x,
  y,
  w,
  h = 34,
  text,
  sub,
  accent,
  dashed,
  size = 9.5,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  sub?: string;
  accent?: boolean;
  dashed?: boolean;
  size?: number;
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
        y={sub ? y + h / 2 - 2 : y + h / 2 + 4}
        size={size}
        bold
        accent={accent}
      >
        {text}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 12} size={8} body opacity={0.7}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Port এর তিন পাড়া                                                        */
/* ------------------------------------------------------------------------- */

const RANGES = [
  {
    x: 30,
    w: 200,
    from: "0",
    to: "1023",
    name: "Well Known Port",
    who: "বিখ্যাত Service এর জন্য তোলা",
    eg: "22 SSH, 53 DNS, 80 HTTP, 443 HTTPS",
    note: "বসতে root এর অনুমতি লাগে",
  },
  {
    x: 240,
    w: 330,
    from: "1024",
    to: "49151",
    name: "Registered Port",
    who: "নাম লেখানো Software আর আপনার App",
    eg: "3000 Dev, 3306 MySQL, 5432 PostgreSQL, 6379 Redis",
    note: "যে কেউ বসতে পারে",
  },
  {
    x: 580,
    w: 230,
    from: "49152",
    to: "65535",
    name: "Ephemeral Port",
    who: "Client এর সাময়িক ফেরার ঠিকানা",
    eg: "51514, 57271, 62001",
    note: "Kernel নিজে বেছে দেয়",
  },
];

export function PortRangesDiagram() {
  return (
    <Sketch
      label="Diagram: ০ থেকে ৬৫৫৩৫, Port এর তিন পাড়া"
      height={250}
      minWidth={840}
      viewBox="0 0 840 250"
      caption="Port একটা ১৬ Bit এর সংখ্যা, তাই মোট ৬৫৫৩৬টা নম্বর, ০ থেকে ৬৫৫৩৫। এই নম্বরগুলো তিন পাড়ায় ভাগ করা। প্রথম পাড়া, ০ থেকে ১০২৩, সবার চেনা Service এর জন্য তোলা, আর এখানে বসতে root এর অনুমতি লাগে। মাঝের বড় পাড়া, ১০২৪ থেকে ৪৯১৫১, যেখানে Database আর আপনার নিজের App বসে। শেষ পাড়া, ৪৯১৫২ থেকে ৬৫৫৩৫, কেউ স্থায়ীভাবে নেয় না। আপনার যন্ত্র যখন Client হয়ে কোথাও Connection খোলে, Kernel এই পাড়া থেকে একটা নম্বর কিছুক্ষণের জন্য ধার দেয়, আর কথা শেষ হলে ফেরত নেয়। ছবিতে পাড়াগুলোর চওড়া মাপমতো আঁকা নয়, আসলে মাঝের পাড়াটা প্রথমটার প্রায় ৪৭ গুণ বড়।"
    >
      {RANGES.map((r, i) => {
        const accent = i === 2;
        return (
          <g key={r.name}>
            <rect
              x={r.x}
              y={62}
              width={r.w}
              height={46}
              fill={accent ? "var(--primary)" : "currentColor"}
              fillOpacity={accent ? 0.1 : 0.04 + i * 0.02}
              stroke={accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={accent ? 1 : 0.45}
              strokeWidth="1.3"
            />
            <SketchText x={r.x + r.w / 2} y={90} size={11} bold accent={accent}>
              {r.name}
            </SketchText>
            <SketchText x={r.x + 2} y={52} size={9} anchor="start" opacity={0.7}>
              {r.from}
            </SketchText>
            <SketchText x={r.x + r.w - 2} y={52} size={9} anchor="end" opacity={0.7}>
              {r.to}
            </SketchText>
            <SketchText x={r.x + r.w / 2} y={134} size={9.5} body bold>
              {r.who}
            </SketchText>
            <SketchText x={r.x + r.w / 2} y={156} size={8.5} opacity={0.75}>
              {r.eg}
            </SketchText>
            <SketchText x={r.x + r.w / 2} y={178} size={9} body accent={accent} opacity={accent ? 1 : 0.7}>
              {r.note}
            </SketchText>
          </g>
        );
      })}
      <SketchText x={420} y={218} size={9} body opacity={0.7}>
        Server বসে বাঁ দিকের দুই পাড়ায়, Client এর সাময়িক নম্বর আসে ডান দিকের পাড়া থেকে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. চারটা সংখ্যায় একটা Connection                                           */
/* ------------------------------------------------------------------------- */

const CLIENTS = [
  { y: 40, who: "পর্যটক ক, প্রথম Tab", ip: "203.0.113.25", port: "62001", diff: "" },
  { y: 112, who: "পর্যটক ক, দ্বিতীয় Tab", ip: "203.0.113.25", port: "62002", diff: "Port আলাদা" },
  { y: 184, who: "পর্যটক খ", ip: "198.51.100.7", port: "62001", diff: "IP আলাদা" },
];

export function FourTupleDiagram() {
  return (
    <Sketch
      label="Diagram: এক Port 443, তবু তিনটা আলাদা Connection"
      height={300}
      minWidth={840}
      viewBox="0 0 840 300"
      caption="Server এর দিকে তিনটা Connection এরই ঠিকানা হুবহু এক, 103.94.135.2 এর Port 443। তবু Kernel এদের কখনো গুলিয়ে ফেলে না, কারণ সে একটা Connection চেনে চারটা সংখ্যা একসাথে মিলিয়ে: কার IP থেকে, কার Port থেকে, কোন IP তে, কোন Port এ। পর্যটক ক এর দুইটা Tab একই IP থেকে আসছে, কিন্তু তাঁর ফোনের Kernel দুই Tab কে দুইটা আলাদা Ephemeral Port দিয়েছে। পর্যটক খ এর Port কাকতালীয়ভাবে প্রথম Tab এর সমান, কিন্তু তাঁর IP আলাদা। চারটার যেকোনো একটা আলাদা হলেই সেটা আলাদা Connection। এই কারণেই একটা মাত্র Port 443 দিয়ে হাজার হাজার মানুষের সাথে একসাথে কথা বলা যায়।"
    >
      <Arrow id="port-ft" />
      {CLIENTS.map((c) => (
        <g key={c.who}>
          <Box x={30} y={c.y} w={230} h={50} text={`${c.ip} : ${c.port}`} sub={c.who} size={10.5} />
          <line
            x1={260}
            y1={c.y + 25}
            x2={596}
            y2={137}
            stroke="var(--primary)"
            strokeWidth="1.3"
            markerEnd="url(#port-ft)"
          />
          {c.diff && (
            <SketchText x={300} y={c.y + 16} size={8.5} body accent anchor="start">
              {c.diff}
            </SketchText>
          )}
        </g>
      ))}
      <Box x={600} y={100} w={210} h={74} text="103.94.135.2 : 443" sub="Island Tours, একটাই Port" accent size={11} />
      <SketchText x={705} y={196} size={8.5} body opacity={0.7}>
        তিনটারই গন্তব্য এক
      </SketchText>
      <rect x={30} y={250} width={780} height={30} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.25} />
      <SketchText x={420} y={269} size={9.5}>
        Connection = ( Source IP , Source Port , Destination IP , Destination Port ) + Protocol
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Listening Socket আর Connected Socket                                     */
/* ------------------------------------------------------------------------- */

function Listening() {
  return (
    <>
      <Box x={60} y={30} w={180} h={50} text="0.0.0.0 : 443" sub="Listening Socket, একটাই" accent size={10.5} />
      <SketchText x={150} y={104} size={8.5} body opacity={0.75}>
        ওপাশের ঘর ফাঁকা, কারো সাথে জোড়া নয়
      </SketchText>
      <rect x={40} y={122} width={220} height={52} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="4 3" />
      <SketchText x={150} y={143} size={9} body bold>
        কাজ একটাই
      </SketchText>
      <SketchText x={150} y={161} size={8.5} body opacity={0.75}>
        নতুন কেউ এলে দরজা খুলে দেওয়া
      </SketchText>
      <SketchText x={150} y={198} size={8.5} body opacity={0.7}>
        এটা দিয়ে কোনো Data আসা যাওয়া করে না
      </SketchText>
    </>
  );
}

function Connected() {
  const rows = [
    { y: 30, peer: "203.0.113.25 : 62001" },
    { y: 86, peer: "203.0.113.25 : 62002" },
    { y: 142, peer: "198.51.100.7 : 62001" },
  ];
  return (
    <>
      {rows.map((r) => (
        <g key={r.peer}>
          <Box x={20} y={r.y} w={260} h={42} text={`:443  <->  ${r.peer}`} sub="Connected Socket" size={9.5} />
        </g>
      ))}
      <SketchText x={150} y={206} size={8.5} body opacity={0.75}>
        প্রতি Client এ একটা, আর Data চলে এগুলো দিয়েই
      </SketchText>
    </>
  );
}

export function ListenVsConnectedSplit() {
  return (
    <SketchSplit
      label="Diagram: Server এর হাতে দুই রকম Socket"
      caption="Server এর Program এর হাতে আসলে দুই রকম Socket থাকে, আর এই তফাতটা না জানলে পরের অনেক কিছু ধাঁধা লাগে। বাঁ দিকেরটা Listening Socket। এটা দোকানের দরজার ঘণ্টার মতো, একটাই থাকে, আর এর কাজ শুধু জানানো যে নতুন কেউ এসেছে। এটা দিয়ে কখনো কোনো Data যায় না। ডান দিকেরগুলো Connected Socket। নতুন একজন Client এলে Kernel তার জন্য একটা আলাদা Socket বানিয়ে Program এর হাতে দেয়, যেন প্রতিটা খদ্দেরের জন্য আলাদা একজন কর্মী। খেয়াল করুন, সবগুলো Connected Socket এর নিজের দিকের Port সেই একই 443। নতুন Client এলে নতুন Port খরচ হয় না, খরচ হয় শুধু একটা নতুন Socket।"
      panels={[
        {
          title: "Listening Socket",
          sub: "দরজার ঘণ্টা",
          viewBox: "0 0 300 220",
          height: 220,
          children: <Listening />,
        },
        {
          title: "Connected Socket",
          sub: "প্রতি খদ্দেরে একজন কর্মী",
          viewBox: "0 0 300 220",
          height: 220,
          children: <Connected />,
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Bind Address: কোন দরজায় কান পাতা                                        */
/* ------------------------------------------------------------------------- */

const DOORS = [
  { name: "lo", ip: "127.0.0.1", who: "শুধু এই যন্ত্র নিজে" },
  { name: "eth1", ip: "10.0.0.5", who: "ভেতরের Private Network" },
  { name: "eth0", ip: "103.94.135.2", who: "পুরো Internet" },
];

const BINDS = [
  { bind: "127.0.0.1", open: [true, false, false], use: "Database, ভেতরের App" },
  { bind: "10.0.0.5", open: [false, true, false], use: "শুধু নিজেদের অন্য Server এর জন্য" },
  { bind: "0.0.0.0", open: [true, true, true], use: "সব দরজা, যেমন Reverse Proxy" },
];

export function BindAddressDiagram() {
  const colX = [300, 470, 640];
  const colW = 150;
  return (
    <Sketch
      label="Diagram: Bind Address ঠিক করে কোন দরজা দিয়ে ঢোকা যাবে"
      height={290}
      minWidth={840}
      viewBox="0 0 840 290"
      caption="একটা Server এর সাধারণত একটার বেশি IP থাকে, আর প্রতিটা IP একটা আলাদা দরজা। 127.0.0.1 হলো ভেতরের দরজা, যেটা দিয়ে শুধু ওই যন্ত্রের নিজের Program ঢুকতে পারে। Private IP টা নিজেদের ভেতরের Network এর দরজা। Public IP টা রাস্তার দিকের সদর দরজা। Program যখন একটা Port এ বসে, সে একই সাথে বলে দেয় কোন দরজায় কান পাতবে, আর এটাকেই বলে Bind Address। 127.0.0.1 এ Bind করলে বাইরের কেউ ওই Port এ পৌঁছাতেই পারে না, Firewall খোলা থাকলেও না। 0.0.0.0 কোনো আসল ঠিকানা নয়, এর মানে আমার যত IP আছে সবগুলোতে। স্থানীয়ভাবে চলে কিন্তু বাইরে থেকে খোলে না, এই চেনা সমস্যার সবচেয়ে সাধারণ কারণ এই ছকের প্রথম সারি।"
    >
      <SketchText x={40} y={44} size={9} anchor="start" opacity={0.55}>
        Program যেখানে Bind করল
      </SketchText>
      {DOORS.map((d, i) => (
        <g key={d.ip}>
          <SketchText x={colX[i] + colW / 2} y={30} size={10} bold>
            {`${d.name}  ${d.ip}`}
          </SketchText>
          <SketchText x={colX[i] + colW / 2} y={46} size={8.5} body opacity={0.7}>
            {d.who}
          </SketchText>
        </g>
      ))}
      {BINDS.map((b, r) => {
        const y = 66 + r * 62;
        return (
          <g key={b.bind}>
            <rect x={30} y={y} width={250} height={48} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.4} strokeWidth="1.2" />
            <SketchText x={155} y={y + 21} size={11} bold>
              {`listen(3000, "${b.bind}")`}
            </SketchText>
            <SketchText x={155} y={y + 38} size={8.5} body opacity={0.7}>
              {b.use}
            </SketchText>
            {b.open.map((o, i) => (
              <g key={i}>
                <rect
                  x={colX[i]}
                  y={y}
                  width={colW}
                  height={48}
                  fill={o ? "var(--primary)" : "transparent"}
                  fillOpacity={o ? 0.1 : 0}
                  stroke={o ? "var(--primary)" : "currentColor"}
                  strokeOpacity={o ? 1 : 0.3}
                  strokeWidth="1.2"
                  strokeDasharray={o ? undefined : "4 3"}
                />
                <SketchText x={colX[i] + colW / 2} y={y + 28} size={9.5} body bold accent={o} opacity={o ? 1 : 0.5}>
                  {o ? "খোলা" : "বন্ধ, Connection refused"}
                </SketchText>
              </g>
            ))}
          </g>
        );
      })}
      <SketchText x={420} y={270} size={9} body accent>
        0.0.0.0 মানে কোনো একটা ঠিকানা নয়, মানে সবগুলো ঠিকানা
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. এক 443 এর পেছনে অনেক App                                                */
/* ------------------------------------------------------------------------- */

const APPS = [
  { y: 30, ly: 82, host: "islandtours.example", target: "127.0.0.1 : 3000", name: "মূল সাইট" },
  { y: 100, ly: 121, host: "admin.islandtours.example", target: "127.0.0.1 : 3001", name: "Admin Panel" },
  { y: 170, ly: 182, host: "api.islandtours.example", target: "127.0.0.1 : 4000", name: "API" },
];

export function ReverseProxyDiagram() {
  return (
    <Sketch
      label="Diagram: বাইরে একটা Port, ভেতরে অনেক App"
      height={320}
      minWidth={840}
      viewBox="0 0 840 320"
      caption="একটা যন্ত্রে Port 443 একটাই, আর এক Port এ একসাথে একটা Program ই বসতে পারে। অথচ একই Server এ তিনটা আলাদা সাইট চালাতে হবে, আর প্রতিটাই পর্যটকের কাছে 443 এ খুলতে হবে। সমাধান হলো সামনে একজন অভ্যর্থনাকারী বসানো, যার নাম Reverse Proxy। সে একা 0.0.0.0 এর Port 443 এ বসে, বাইরের সব Connection সে ধরে। প্রতিটা অনুরোধে লেখা থাকে পর্যটক কোন নামে এসেছেন, সেটা দেখে সে ভেতরে ঠিক App এর কাছে নতুন একটা Connection খোলে। App গুলো বসে 127.0.0.1 এর আলাদা আলাদা Port এ, যেখানে বাইরের কেউ সরাসরি পৌঁছাতে পারে না। Database ও একই রকম ভেতরে থাকে। বাইরে থেকে খোলা থাকে শুধু 80, 443 আর নিজের জন্য 22।"
    >
      <Arrow id="port-rp" />
      <Box x={24} y={104} w={130} h={54} text="পর্যটক" sub="Internet থেকে" />
      <line x1={154} y1={131} x2={236} y2={131} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#port-rp)" />
      <SketchText x={196} y={122} size={9} accent bold>
        :443
      </SketchText>
      <rect x={240} y={20} width={576} height={270} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeDasharray="5 4" />
      <SketchText x={528} y={306} size={9} body opacity={0.7}>
        একটাই Server, 103.94.135.2
      </SketchText>
      <Box x={256} y={96} w={170} h={70} text="Reverse Proxy" sub="0.0.0.0 : 443 এ বসা" accent size={11} />
      {APPS.map((a) => (
        <g key={a.host}>
          <line x1={426} y1={131} x2={596} y2={a.y + 25} stroke="var(--primary)" strokeWidth="1.2" markerEnd="url(#port-rp)" />
          <Box x={600} y={a.y} w={200} h={50} text={a.target} sub={a.name} size={10} />
          <SketchText x={512} y={a.ly} size={7.5} opacity={0.8}>
            {a.host}
          </SketchText>
        </g>
      ))}
      <Box x={600} y={236} w={200} h={42} text="127.0.0.1 : 5432" sub="PostgreSQL, বাইরে থেকে অদৃশ্য" dashed size={10} />
    </Sketch>
  );
}
