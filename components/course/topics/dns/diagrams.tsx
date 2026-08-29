import { Sketch, SketchText } from "../../sketch";

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
/* 1. নাম দিলে ঠিকানা, Internet এর ফোনবুক                                       */
/* ------------------------------------------------------------------------- */

const BOOK = [
  { name: "google.com", ip: "142.250.194.14" },
  { name: "github.com", ip: "20.205.243.166" },
  { name: "islandtours.example", ip: "103.94.135.2", hi: true },
  { name: "wikipedia.org", ip: "198.35.26.96" },
];

export function PhonebookDiagram() {
  const rowH = 34;
  const bookTop = 60;
  return (
    <Sketch
      label="Diagram: নাম দিন, ঠিকানা নিন"
      height={260}
      minWidth={780}
      viewBox="0 0 780 260"
      caption="মানুষ নাম মনে রাখে, কম্পিউটার সংখ্যা চেনে। DNS হলো এই দুইয়ের মাঝের ফোনবুক। আপনি একটা নাম দেন, যেমন islandtours.example, আর DNS ফেরত দেয় তার IP Address, যেমন 103.94.135.2। ঠিক যেমন ফোনবুকে নাম দেখে নম্বর বের করেন। আপনার নাম মনে রাখলেই চলে, নম্বরটা DNS মনে রাখে।"
    >
      <Arrow id="pb-a" />

      {/* name in */}
      <SketchText x={100} y={48} size={9} opacity={0.55}>
        আপনি যা লেখেন
      </SketchText>
      <rect x={30} y={100} width={160} height={50} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={110} y={130} size={11} bold accent>
        islandtours.example
      </SketchText>
      <line x1={190} y1={125} x2={266} y2={125} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#pb-a)" />

      {/* the book */}
      <SketchText x={420} y={44} size={10} bold anchor="middle">
        DNS, Internet এর ফোনবুক
      </SketchText>
      <rect x={270} y={54} width={300} height={168} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.4} strokeWidth="1.2" />
      {BOOK.map((b, i) => {
        const y = bookTop + i * rowH;
        return (
          <g key={b.name}>
            {b.hi && (
              <rect x={280} y={y - 4} width={280} height={rowH - 6} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeOpacity={0.5} strokeWidth="1" />
            )}
            <SketchText x={294} y={y + 13} size={9.5} anchor="start" body accent={b.hi} bold={b.hi} opacity={b.hi ? 1 : 0.8}>
              {b.name}
            </SketchText>
            <SketchText x={556} y={y + 13} size={9.5} anchor="end" body accent={b.hi} bold={b.hi} opacity={b.hi ? 1 : 0.7}>
              {b.ip}
            </SketchText>
          </g>
        );
      })}

      {/* ip out */}
      <line x1={570} y1={125} x2={620} y2={125} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#pb-a)" />
      <SketchText x={700} y={48} size={9} opacity={0.55}>
        DNS যা ফেরত দেয়
      </SketchText>
      <rect x={624} y={100} width={140} height={50} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" />
      <SketchText x={694} y={130} size={11} bold>
        103.94.135.2
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. খোঁজার পথ, উঁচু থেকে দেখা                                                */
/* ------------------------------------------------------------------------- */

export function LookupPathDiagram() {
  return (
    <Sketch
      label="Diagram: নাম থেকে পেজ, উঁচু থেকে"
      height={240}
      minWidth={820}
      viewBox="0 0 820 240"
      caption="ছবিটা উঁচু থেকে এমন। আপনার যন্ত্র নামটা নিয়ে যায় একটা Resolver এর কাছে, মানে যে DNS server আপনাকে DHCP দিয়েছিল (আগের মডিউল)। Resolver DNS এর জগতে খোঁজ করে IP টা বের করে ফেরত দেয়। এবার আপনার যন্ত্রের হাতে IP আছে, তাই সে সরাসরি Server এ connect করে, নাম আর লাগে না। কীভাবে Resolver খোঁজে, সেই ভেতরের গল্প এই মডিউলের পরের লেসনগুলোতে।"
    >
      <Arrow id="lp-a" />

      {/* you */}
      <rect x={24} y={90} width={130} height={56} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" />
      <SketchText x={89} y={114} size={11} bold>
        আপনার যন্ত্র
      </SketchText>
      <SketchText x={89} y={131} size={9} opacity={0.6} body>
        নাম লিখল
      </SketchText>

      {/* resolver */}
      <line x1={154} y1={118} x2={210} y2={118} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#lp-a)" />
      <rect x={212} y={90} width={140} height={56} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={282} y={112} size={11} bold accent>
        Resolver
      </SketchText>
      <SketchText x={282} y={129} size={8.5} opacity={0.75} body>
        DHCP এর দেওয়া DNS
      </SketchText>

      {/* dns world cloud */}
      <line x1={352} y1={118} x2={408} y2={118} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#lp-a)" />
      <rect x={410} y={78} width={180} height={80} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" strokeDasharray="5 4" />
      <SketchText x={500} y={106} size={11} bold>
        DNS এর জগৎ
      </SketchText>
      <SketchText x={500} y={124} size={8.5} opacity={0.6} body>
        অনেক server, কীভাবে খোঁজে
      </SketchText>
      <SketchText x={500} y={140} size={8.5} accent body>
        পরের লেসন
      </SketchText>

      {/* ip back to you */}
      <line x1={410} y1={180} x2={155} y2={180} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" strokeDasharray="5 3" markerEnd="url(#lp-a)" />
      <SketchText x={300} y={172} size={8.5} body opacity={0.7}>
        IP ফেরত এল
      </SketchText>

      {/* connect to server */}
      <line x1={154} y1={104} x2={640} y2={62} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#lp-a)" />
      <SketchText x={400} y={72} size={8.5} accent body>
        এবার সরাসরি IP তে connect
      </SketchText>
      <rect x={642} y={40} width={150} height={48} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" />
      <SketchText x={717} y={62} size={11} bold>
        Server
      </SketchText>
      <SketchText x={717} y={78} size={9} accent body>
        103.94.135.2
      </SketchText>
    </Sketch>
  );
}
