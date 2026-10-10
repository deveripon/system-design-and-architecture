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
  h = 40,
  top,
  sub,
  accent,
  size = 9.5,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  top: string;
  sub?: string;
  accent?: boolean;
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
      />
      <SketchText x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} size={size} bold accent={accent}>
        {top}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 13} size={8} body opacity={0.7}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. গ্রাহকের ঠিকানার দুই ধরন                                                 */
/* ------------------------------------------------------------------------- */

function Style({
  id,
  names,
  owner,
  foot,
}: {
  id: string;
  names: string[];
  owner: string;
  foot: string;
}) {
  return (
    <>
      <Arrow id={id} />
      {names.map((n, i) => (
        <g key={n}>
          <Box x={20} y={16 + i * 44} w={260} h={34} top={n} size={9} />
          <line x1={150} y1={50 + i * 44} x2={150} y2={168} stroke="var(--primary)" strokeWidth="1" strokeOpacity={0.5} />
        </g>
      ))}
      <line x1={150} y1={150} x2={150} y2={168} stroke="var(--primary)" strokeWidth="1.3" markerEnd={`url(#${id})`} />
      <Box x={70} y={170} w={160} h={36} top="আপনার একটাই App" accent />
      <SketchText x={150} y={228} size={8.5} body bold accent>
        {owner}
      </SketchText>
      <SketchText x={150} y={244} size={8.5} body opacity={0.7}>
        {foot}
      </SketchText>
    </>
  );
}

export function TwoAddressStylesSplit() {
  return (
    <SketchSplit
      label="Diagram: গ্রাহকের ঠিকানার দুই ধরন"
      caption="একটা Multi-tenant App এ কোড আর সার্ভার একটাই, কিন্তু গ্রাহক অনেক, আর প্রত্যেকের নিজের একটা ঠিকানা লাগে। ঠিকানা দেওয়ার দুইটা ধরন আছে। বাঁ দিকে উপনাম, প্রতিটা গ্রাহক আপনার Domain এর নিচে একটা করে নাম পায়। এখানে Domain টা আপনার, DNS আপনার হাতে, তাই পুরো কাজটা আপনি একাই করতে পারেন, গ্রাহককে কিছুই করতে হয় না। ডান দিকে Custom Domain, গ্রাহক নিজের কেনা Domain আপনার App এ জুড়তে চান। এখানে Domain গ্রাহকের, DNS গ্রাহকের হাতে, তাই আপনাকে তাঁকে বলে দিতে হয় কোন Record বসাতে হবে, আর তিনি বসানোর পর আপনাকে যাচাই করতে হয়। প্রথমটা সহজ, দ্বিতীয়টা এই লেসনের আসল চ্যালেঞ্জ। দুই ক্ষেত্রেই সব Request শেষে একই App এ এসে পৌঁছায়।"
      panels={[
        {
          title: "ধরন ১, উপনাম",
          sub: "আপনার Domain এর নিচে",
          viewBox: "0 0 300 256",
          height: 256,
          children: (
            <Style
              id="ta-a"
              names={[
                "seagull.islandtours.example",
                "coral.islandtours.example",
                "bluewave.islandtours.example",
              ]}
              owner="DNS আপনার হাতে"
              foot="একটা Wildcard Record এ সবাই"
            />
          ),
        },
        {
          title: "ধরন ২, Custom Domain",
          sub: "গ্রাহকের নিজের Domain",
          viewBox: "0 0 300 256",
          height: 256,
          children: (
            <Style
              id="ta-b"
              names={[
                "booking.seagulltours.example",
                "www.coraltrips.example",
                "bluewave.example",
              ]}
              owner="DNS গ্রাহকের হাতে"
              foot="প্রতিটা গ্রাহক নিজে Record বসান"
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 2. তিনটা স্তর, তিনটাই ঠিক হতে হবে                                           */
/* ------------------------------------------------------------------------- */

const LAYERS = [
  {
    layer: "১. DNS",
    q: "নামটা কি আপনার সার্ভারে পৌঁছায়?",
    wild: "একটা Wildcard Record, * থেকে আপনার IP",
    custom: "গ্রাহক নিজের DNS এ একটা CNAME বা A বসান",
  },
  {
    layer: "২. HTTPS",
    q: "এই নামের সার্টিফিকেট আছে তো?",
    wild: "একটাই Wildcard সার্টিফিকেট, সবার জন্য",
    custom: "প্রতিটা গ্রাহকের Domain এর আলাদা সার্টিফিকেট",
  },
  {
    layer: "৩. App",
    q: "এই নামটা কোন গ্রাহকের?",
    wild: "নামের প্রথম অংশ দেখে গ্রাহক খোঁজা",
    custom: "পুরো নামটা Database এ খুঁজে গ্রাহক বের করা",
  },
];

export function ThreeLayersDiagram() {
  const rowH = 58;
  const top = 58;
  const h = top + LAYERS.length * rowH + 14;
  return (
    <Sketch
      label="Diagram: একটা গ্রাহকের ঠিকানা কাজ করতে তিনটা স্তর লাগে"
      height={h}
      minWidth={880}
      viewBox={`0 0 880 ${h}`}
      caption="নতুনরা প্রায়ই ভাবেন Wildcard বা Custom Domain শুধু একটা DNS এর ব্যাপার। আসলে তিনটা আলাদা স্তর আছে, আর তিনটাই ঠিক না হলে গ্রাহকের ঠিকানা কাজ করে না। প্রথম স্তর DNS, নামটা আপনার সার্ভারে পৌঁছাতে হবে। দ্বিতীয় স্তর HTTPS, সেই নামের জন্য আপনার সার্ভারে একটা বৈধ সার্টিফিকেট থাকতে হবে, নাহলে Browser সতর্কবার্তা দেখাবে। তৃতীয় স্তর আপনার App, তাকে বুঝতে হবে এই নামে যে এসেছে তাকে কোন গ্রাহকের তথ্য দেখাতে হবে। DNS ঠিক করে সাইট না খুললে মানুষ DNS এই আটকে থাকে, অথচ সমস্যা প্রায়ই দ্বিতীয় বা তৃতীয় স্তরে। ছকের দুই কলাম দেখায় একই তিন স্তর দুই ধরনের ঠিকানায় কীভাবে সমাধান হয়।"
    >
      <SketchText x={40} y={40} size={9} anchor="start" opacity={0.55}>
        স্তর
      </SketchText>
      <SketchText x={130} y={40} size={9} anchor="start" opacity={0.55}>
        যে প্রশ্নের উত্তর
      </SketchText>
      <SketchText x={360} y={40} size={9} anchor="start" opacity={0.55}>
        উপনামে (Wildcard)
      </SketchText>
      <SketchText x={620} y={40} size={9} anchor="start" opacity={0.55}>
        Custom Domain এ
      </SketchText>
      {LAYERS.map((l, i) => {
        const y = top + i * rowH;
        return (
          <g key={l.layer}>
            <rect
              x={24}
              y={y}
              width={832}
              height={rowH - 10}
              fill={i % 2 === 0 ? "currentColor" : "transparent"}
              fillOpacity={0.03}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth="1"
            />
            <SketchText x={40} y={y + 28} size={11} anchor="start" bold accent>
              {l.layer}
            </SketchText>
            <SketchText x={130} y={y + 28} size={9} anchor="start" body bold>
              {l.q}
            </SketchText>
            <SketchText x={360} y={y + 28} size={8.5} anchor="start" body opacity={0.8}>
              {l.wild}
            </SketchText>
            <SketchText x={620} y={y + 28} size={8.5} anchor="start" body opacity={0.8}>
              {l.custom}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Custom Domain এর শিকল: গ্রাহকের নাম থেকে আপনার সার্ভার                  */
/* ------------------------------------------------------------------------- */

export function CnameTargetChainDiagram() {
  return (
    <Sketch
      label="Diagram: গ্রাহকের Domain থেকে আপনার সার্ভার, আর কোন অংশ কার হাতে"
      height={330}
      minWidth={880}
      viewBox="0 0 880 330"
      caption="এই ছবিটাই উত্তর দেয়, গ্রাহককে দেওয়ার Record আপনি পান কোথা থেকে। আপনি পান না, আপনি বানান। আপনি নিজের Domain এর নিচে একটা স্থায়ী নাম ঠিক করেন, এখানে customers.islandtours.example, আর নিজের DNS এ সেই নামটা নিজের সার্ভারের IP র দিকে দেখান। এই নামটাই আপনার CNAME Target। তারপর প্রতিটা গ্রাহককে একই কথা বলেন, আপনার Domain থেকে এই নামের দিকে একটা CNAME বসান। বাঁ দিকের অংশ গ্রাহকের DNS এ, তিনি একবার বসান আর ভুলে যান। ডান দিকের অংশ আপনার DNS এ, যা পুরোপুরি আপনার হাতে। ভবিষ্যতে সার্ভার বদলালে আপনি শুধু ডান দিকের A Record টা বদলাবেন, আর হাজার গ্রাহকের কাউকে কিছু করতে হবে না। গ্রাহককে সরাসরি IP দিলে এই স্বাধীনতাটা হারাতেন।"
    >
      <Arrow id="ct-a" />

      <rect x={20} y={36} width={300} height={170} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeDasharray="5 4" strokeWidth="1" />
      <SketchText x={170} y={28} size={9} opacity={0.6}>
        গ্রাহকের DNS (তাঁর হাতে)
      </SketchText>
      <Box x={40} y={90} w={260} h={54} top="booking.seagulltours.example" sub="গ্রাহকের নিজের Domain" size={9.5} />

      <rect x={380} y={36} width={480} height={170} fill="none" stroke="var(--primary)" strokeOpacity={0.5} strokeDasharray="5 4" strokeWidth="1" />
      <SketchText x={620} y={28} size={9} accent>
        আপনার DNS (আপনার হাতে)
      </SketchText>
      <Box x={400} y={90} w={250} h={54} top="customers.islandtours.example" sub="আপনার বানানো CNAME Target" accent size={9.5} />
      <Box x={710} y={90} w={130} h={54} top="103.94.135.2" sub="আপনার সার্ভার" />

      <line x1={300} y1={117} x2={398} y2={117} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#ct-a)" />
      <SketchText x={349} y={106} size={9} accent bold>
        CNAME
      </SketchText>
      <SketchText x={349} y={136} size={8} body opacity={0.7}>
        গ্রাহক বসান
      </SketchText>

      <line x1={650} y1={117} x2={708} y2={117} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#ct-a)" />
      <SketchText x={679} y={106} size={9} accent bold>
        A
      </SketchText>
      <SketchText x={679} y={136} size={8} body opacity={0.7}>
        আপনি বসান
      </SketchText>

      <SketchText x={170} y={180} size={8.5} body opacity={0.7}>
        একবার বসালেই চলে, আর বদলাতে হয় না
      </SketchText>
      <SketchText x={620} y={180} size={8.5} body accent>
        সার্ভার বদলালে শুধু এই A Record বদলান
      </SketchText>

      <line x1={775} y1={144} x2={775} y2={238} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#ct-a)" />
      <Box x={560} y={240} w={290} h={50} top="App দেখে Browser কোন নাম চেয়েছে" sub="booking.seagulltours.example, মানে Seagull Tours" accent size={9} />
      <SketchText x={290} y={262} size={9} body opacity={0.75}>
        সার্ভারে পৌঁছানোর পর App কে বুঝতে হয়
      </SketchText>
      <SketchText x={290} y={278} size={9} body opacity={0.75}>
        এই নামটা কোন গ্রাহকের
      </SketchText>
    </Sketch>
  );
}
