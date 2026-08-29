import { Sketch, SketchBox, SketchText } from "../../sketch";

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

/* ------------------------------------------------------------------------- */
/* 1. একটাই দরজা, সবাই এখান দিয়ে বাইরে                                        */
/* ------------------------------------------------------------------------- */

const LAN_DEVICES = [
  { name: "Laptop", ip: "192.168.0.5" },
  { name: "Phone", ip: "192.168.0.6" },
  { name: "TV", ip: "192.168.0.7" },
];

export function GatewayDoorDiagram() {
  return (
    <Sketch
      label="Diagram: বাইরে বেরোনোর একটাই দরজা"
      height={320}
      minWidth={820}
      viewBox="0 0 820 320"
      caption="বাসার ভেতরের যন্ত্রগুলো নিজেদের মধ্যে সরাসরি কথা বলে। কিন্তু বাইরের কোথাও যেতে হলে সবাইকে একটা দরজা দিয়ে বেরোতে হয়, আর সেই দরজার নাম Default Gateway, প্রায় সবসময় বাসার Router। এখানে দরজার ঠিকানা 192.168.0.1, যেটা আপনার যন্ত্রেরই মতো একই Network এর একটা ঠিকানা। বাইরের যেকোনো জায়গায় যাওয়ার চিঠি প্রথমে এই দরজায় যায়, তারপর দরজা বাকিটা সামলায়।"
    >
      <Arrow id="gw-a" />

      {/* LAN box */}
      <SketchText x={170} y={30} size={10} bold anchor="middle">
        বাসার ভেতর (LAN)
      </SketchText>
      <rect
        x={30}
        y={44}
        width={280}
        height={252}
        fill="currentColor"
        fillOpacity={0.03}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth="1.2"
      />
      {LAN_DEVICES.map((d, i) => (
        <SketchBox
          key={d.ip}
          x={70}
          y={70 + i * 70}
          w={200}
          h={50}
          title={d.name}
          sub={d.ip}
        />
      ))}

      {/* arrows from devices to gateway */}
      {LAN_DEVICES.map((d, i) => (
        <line
          key={d.ip}
          x1={270}
          y1={95 + i * 70}
          x2={392}
          y2={168}
          stroke="var(--primary)"
          strokeOpacity={0.6}
          strokeWidth="1.2"
          markerEnd="url(#gw-a)"
        />
      ))}

      {/* the gateway / door */}
      <rect
        x={394}
        y={128}
        width={130}
        height={84}
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeWidth="1.5"
      />
      <SketchText x={459} y={154} size={12} bold accent>
        Default
      </SketchText>
      <SketchText x={459} y={172} size={12} bold accent>
        Gateway
      </SketchText>
      <SketchText x={459} y={192} size={10} opacity={0.8} body>
        192.168.0.1
      </SketchText>
      <SketchText x={459} y={228} size={9} opacity={0.6} body>
        বাইরে বেরোনোর দরজা
      </SketchText>

      {/* gateway to internet */}
      <line
        x1={524}
        y1={170}
        x2={600}
        y2={170}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#gw-a)"
      />
      <rect
        x={604}
        y={144}
        width={180}
        height={52}
        fill="currentColor"
        fillOpacity={0.05}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.2"
      />
      <SketchText x={694} y={168} size={12} bold>
        বাকি Internet
      </SketchText>
      <SketchText x={694} y={184} size={9} opacity={0.6} body>
        আর সব Network
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. দরজা থেকে দরজা, চিঠি এগিয়ে যায়                                          */
/* ------------------------------------------------------------------------- */

const HOPS = [
  { net: "আপনার Network", gw: "192.168.0.1" },
  { net: "ISP এর Network", gw: "ISP Gateway" },
  { net: "মাঝের Network", gw: "পরের Gateway" },
  { net: "Server এর Network", gw: "সেখানকার Gateway" },
];

export function DoorToDoorDiagram() {
  const w = 168;
  const gap = 30;
  const startX = 20;
  const y = 70;
  return (
    <Sketch
      label="Diagram: প্রতিটা Network এর নিজের দরজা"
      height={220}
      minWidth={820}
      viewBox="0 0 820 220"
      caption="একটা চিঠি বাসা থেকে দূরের সার্ভারে যাওয়ার পথে অনেকগুলো Network পার হয়। মজার ব্যাপার, প্রতিটা Network এর নিজের একটা Gateway, মানে নিজের দরজা আছে। চিঠি এক Network এর দরজা দিয়ে বেরিয়ে পরের Network এর দরজায় ঢোকে, তারপর তার দরজা দিয়ে আরও এগোয়। এভাবে দরজা থেকে দরজা, ধাপে ধাপে, চিঠি ঠিক গন্তব্যের Network এ পৌঁছায়। কেউই পুরো পথ জানে না, প্রত্যেকে শুধু পরের দরজা পর্যন্ত জানে।"
    >
      <Arrow id="d2d-a" />
      {HOPS.map((h, i) => {
        const x = startX + i * (w + gap);
        return (
          <g key={h.net}>
            <rect
              x={x}
              y={y}
              width={w}
              height={70}
              fill="currentColor"
              fillOpacity={0.03}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth="1.2"
            />
            <SketchText x={x + w / 2} y={y + 26} size={11} bold>
              {h.net}
            </SketchText>
            {/* the door */}
            <rect
              x={x + w / 2 - 44}
              y={y + 38}
              width={88}
              height={22}
              fill="var(--primary)"
              fillOpacity={0.12}
              stroke="var(--primary)"
              strokeWidth="1.2"
            />
            <SketchText x={x + w / 2} y={y + 53} size={8.5} accent bold body>
              {h.gw}
            </SketchText>
            {i < HOPS.length - 1 && (
              <line
                x1={x + w}
                y1={y + 35}
                x2={x + w + gap}
                y2={y + 35}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#d2d-a)"
              />
            )}
          </g>
        );
      })}
      <SketchText x={410} y={40} size={9} opacity={0.6} body>
        প্রতিটা Network এর নিজের দরজা, চিঠি দরজা থেকে দরজা এগোয়
      </SketchText>
      <SketchText x={410} y={186} size={10} accent bold>
        Server এ পৌঁছাল
      </SketchText>
    </Sketch>
  );
}
