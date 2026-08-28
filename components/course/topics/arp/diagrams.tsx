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
/* 1. চেঁচিয়ে প্রশ্ন, একজনের উত্তর                                              */
/* ------------------------------------------------------------------------- */

export function ArpFlowDiagram() {
  const others = [
    { x: 250, name: "B", ip: ".6", owner: false },
    { x: 400, name: "C", ip: ".1", owner: true },
    { x: 550, name: "D", ip: ".9", owner: false },
  ];
  return (
    <Sketch
      label="Diagram: এই IP টা কার, তার MAC কী"
      height={300}
      minWidth={700}
      viewBox="0 0 700 300"
      caption="A এর হাতে গন্তব্যের IP আছে (192.168.0.1), কিন্তু চিঠি পাঠাতে দরকার সেই যন্ত্রের MAC। তাই A পুরো LAN এ চেঁচিয়ে একটা প্রশ্ন ছোড়ে, এই IP টা কার, তার MAC কী? এই প্রশ্নটা সবাই শোনে, B, C, D সবাই। কিন্তু উত্তর দেয় শুধু একজন, যার সেই IP, মানে C। C ফিরতি একটা চিঠিতে বলে, ওই IP আমার, আমার MAC এই। এবার A এর কাছে IP আর MAC দুইটাই, চিঠি পাঠাতে পারে।"
    >
      {/* A the asker */}
      <SketchBox
        x={40}
        y={130}
        w={100}
        h={50}
        title="A"
        sub="IP জানে, MAC চায়"
        accent
      />

      {/* broadcast to all */}
      {others.map((o) => (
        <line
          key={`b-${o.name}`}
          x1={140}
          y1={150}
          x2={o.x - 4}
          y2={70}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth="1.1"
          strokeDasharray="4 3"
          markerEnd="url(#af-b)"
        />
      ))}
      <SketchText x={370} y={30} size={10} bold>
        ১. চেঁচিয়ে প্রশ্ন, সবাই শোনে
      </SketchText>
      <SketchText x={370} y={45} size={8.5} opacity={0.65} body>
        এই IP 192.168.0.1 টা কার?
      </SketchText>

      {others.map((o) => (
        <g key={o.name}>
          <rect
            x={o.x - 40}
            y={70}
            width={80}
            height={44}
            fill={o.owner ? "var(--primary)" : "transparent"}
            fillOpacity={o.owner ? 0.12 : 0}
            stroke={o.owner ? "var(--primary)" : "currentColor"}
            strokeOpacity={o.owner ? 1 : 0.4}
            strokeWidth="1.2"
          />
          <SketchText x={o.x} y={90} size={12} bold accent={o.owner}>
            {o.name}
          </SketchText>
          <SketchText x={o.x} y={104} size={8} opacity={0.6}>
            IP {o.ip}
          </SketchText>
          {o.owner && (
            <SketchText x={o.x} y={130} size={8} accent>
              এটা আমি!
            </SketchText>
          )}
          {!o.owner && (
            <SketchText x={o.x} y={130} size={8} opacity={0.4}>
              আমি নই
            </SketchText>
          )}
        </g>
      ))}

      {/* reply from owner only */}
      <path
        d="M 400 150 Q 260 240 140 175"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.6"
        markerEnd="url(#af-a)"
      />
      <SketchText x={280} y={260} size={10} bold accent>
        ২. উত্তর দেয় শুধু C
      </SketchText>
      <SketchText x={280} y={275} size={8.5} opacity={0.7} body>
        ওই IP আমার, আমার MAC এই
      </SketchText>

      <Defs id="af-a" accent />
      <Defs id="af-b" />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Broadcast আর Unicast                                                     */
/* ------------------------------------------------------------------------- */

export function BroadcastVsUnicastSplit() {
  return (
    <SketchSplit
      label="Diagram: সবাইকে বনাম একজনকে"
      caption="ARP এর প্রশ্ন আর উত্তর দুই রকম। প্রশ্নটা Broadcast, মানে সবাইকে একসাথে, কারণ A জানে না কার কাছে জিজ্ঞেস করবে, তাই সবাইকেই জিজ্ঞেস করে। এটা একটা ভরা ঘরে চেঁচিয়ে রফিক কে বলার মতো, সবাই শোনে। উত্তরটা Unicast, মানে শুধু একজনকে, কারণ C এখন জানে কে জিজ্ঞেস করেছে, তাই সরাসরি A কেই ফিরিয়ে বলে। প্রশ্ন সবার, উত্তর একজনের।"
      panels={[
        {
          title: "প্রশ্ন, Broadcast",
          sub: "সবাইকে একসাথে",
          viewBox: "0 0 300 180",
          height: 180,
          children: (
            <g>
              <SketchBox x={110} y={20} w={80} h={36} title="A" sub="" accent />
              {[
                { x: 40, n: "B" },
                { x: 120, n: "C" },
                { x: 200, n: "D" },
              ].map((d) => (
                <g key={d.n}>
                  <rect
                    x={d.x}
                    y={120}
                    width={56}
                    height={30}
                    fill="transparent"
                    stroke="currentColor"
                    strokeOpacity={0.4}
                    strokeWidth="1.1"
                  />
                  <SketchText x={d.x + 28} y={139} size={11} bold>
                    {d.n}
                  </SketchText>
                  <line
                    x1={150}
                    y1={56}
                    x2={d.x + 28}
                    y2={120}
                    stroke="currentColor"
                    strokeOpacity={0.4}
                    strokeWidth="1.1"
                    strokeDasharray="3 3"
                    markerEnd="url(#bu-b)"
                  />
                </g>
              ))}
              <SketchText x={150} y={172} size={8.5} body opacity={0.65}>
                কার কাছে জানি না, তাই সবাইকে
              </SketchText>
              <Defs id="bu-b" />
            </g>
          ),
        },
        {
          title: "উত্তর, Unicast",
          sub: "শুধু A কে",
          viewBox: "0 0 300 180",
          height: 180,
          children: (
            <g>
              <SketchBox x={110} y={20} w={80} h={36} title="A" sub="" accent />
              {[
                { x: 40, n: "B", o: false },
                { x: 120, n: "C", o: true },
                { x: 200, n: "D", o: false },
              ].map((d) => (
                <g key={d.n}>
                  <rect
                    x={d.x}
                    y={120}
                    width={56}
                    height={30}
                    fill={d.o ? "var(--primary)" : "transparent"}
                    fillOpacity={d.o ? 0.12 : 0}
                    stroke={d.o ? "var(--primary)" : "currentColor"}
                    strokeOpacity={d.o ? 1 : 0.3}
                    strokeWidth="1.1"
                  />
                  <SketchText x={d.x + 28} y={139} size={11} bold accent={d.o}>
                    {d.n}
                  </SketchText>
                </g>
              ))}
              <path
                d="M 148 120 L 150 56"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.6"
                markerEnd="url(#bu-a)"
              />
              <SketchText x={150} y={172} size={8.5} body opacity={0.65}>
                এখন জানি কে জিজ্ঞেস করেছে
              </SketchText>
              <Defs id="bu-a" accent />
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. ARP Cache, একবার জিজ্ঞেস, মনে রাখা                                        */
/* ------------------------------------------------------------------------- */

const CACHE = [
  { ip: "192.168.0.1", mac: "a4:83:e7:...:0c", who: "Router, Gateway" },
  { ip: "192.168.0.6", mac: "3c:22:fb:...:91", who: "Phone" },
  { ip: "192.168.0.9", mac: "b8:27:eb:...:4a", who: "TV" },
];

export function ArpCacheDiagram() {
  const rowH = 42;
  const top = 50;
  const h = top + CACHE.length * rowH + 30;
  return (
    <Sketch
      label="Diagram: ARP Cache, মনে রাখা জোড়া"
      height={h}
      minWidth={640}
      viewBox={`0 0 640 ${h}`}
      caption="প্রতিবার চেঁচিয়ে জিজ্ঞেস করা অপচয়, তাই যন্ত্র উত্তরটা মনে রাখে একটা ছোট টেবিলে, নাম ARP Cache। একবার জেনে নিলে পরের বার আর জিজ্ঞেস করতে হয় না, সোজা টেবিল দেখে নেয়। এই টেবিলটাই আপনি গত লেসনে arp -a কমান্ডে দেখেছিলেন। প্রতিটা সারি একটা IP আর তার MAC এর জোড়া। কিছুক্ষণ ব্যবহার না হলে সারিটা মুছে যায়, কারণ যন্ত্র বদলাতে পারে, তাই পুরনো তথ্য ধরে রাখা ঠিক নয়।"
    >
      <SketchText x={90} y={30} size={9} anchor="start" opacity={0.55}>
        IP জানা
      </SketchText>
      <SketchText x={290} y={30} size={9} anchor="start" opacity={0.55}>
        মানে এই MAC
      </SketchText>
      <SketchText x={490} y={30} size={9} anchor="start" opacity={0.55}>
        কে
      </SketchText>
      {CACHE.map((r, i) => {
        const y = top + i * rowH;
        return (
          <g key={r.ip}>
            <rect
              x={24}
              y={y}
              width={592}
              height={rowH - 8}
              fill={i === 0 ? "var(--primary)" : "transparent"}
              fillOpacity={i === 0 ? 0.08 : 0}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth="1"
            />
            <SketchText
              x={90}
              y={y + 21}
              size={10}
              anchor="start"
              bold
              accent={i === 0}
              body
            >
              {r.ip}
            </SketchText>
            <SketchText x={290} y={y + 21} size={10} anchor="start" body>
              {r.mac}
            </SketchText>
            <SketchText
              x={490}
              y={y + 21}
              size={9}
              anchor="start"
              opacity={0.7}
              body
            >
              {r.who}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}
