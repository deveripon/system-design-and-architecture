import { Sketch, SketchSplit, SketchText } from "../../sketch";

function Arrow({ id, back }: { id: string; back?: boolean }) {
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
          fill={back ? "currentColor" : "var(--primary)"}
          fillOpacity={back ? 0.55 : 1}
        />
      </marker>
    </defs>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. সীমানায় ঠিকানা আর Port বদলে যায়                                         */
/* ------------------------------------------------------------------------- */

export function NatSwapDiagram() {
  return (
    <Sketch
      label="Diagram: বেরোনোর সময় উৎস বদলায়, ফেরার সময় উল্টো"
      height={280}
      minWidth={860}
      viewBox="0 0 860 280"
      caption="একটা চিঠি বাইরে যাওয়ার সময় Router সীমানায় তার উৎস বদলে দেয়, শুধু Private IP নয়, সাথে একটা Port নম্বরও। ভেতরে ছিল 192.168.0.5:51001, বাইরে বেরোয় 103.94.135.2:40001 হয়ে। গন্তব্য একই থাকে। উত্তর যখন 103.94.135.2:40001 এ ফিরে আসে, Router উল্টো কাজ করে, আবার 192.168.0.5:51001 বসিয়ে ঠিক যন্ত্রে পৌঁছে দেয়। এই বদলে দেওয়ার নাম NAT, আর Port সহ বদলানোর নাম PAT।"
    >
      <Arrow id="nat-a" />

      {/* Laptop */}
      <rect x={30} y={60} width={190} height={56} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.4} strokeWidth="1.2" />
      <SketchText x={125} y={82} size={11} bold>
        Laptop
      </SketchText>
      <SketchText x={125} y={100} size={10} accent bold>
        192.168.0.5:51001
      </SketchText>

      {/* Router / NAT */}
      <rect x={340} y={52} width={170} height={72} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeWidth="1.5" />
      <SketchText x={425} y={80} size={12} bold accent>
        Router (NAT)
      </SketchText>
      <SketchText x={425} y={100} size={9} opacity={0.8} body>
        উৎস বদলে দেয়
      </SketchText>

      {/* Server */}
      <rect x={640} y={60} width={190} height={56} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.4} strokeWidth="1.2" />
      <SketchText x={735} y={82} size={11} bold>
        Server
      </SketchText>
      <SketchText x={735} y={100} size={10} body opacity={0.8}>
        103.20.5.8:443
      </SketchText>

      {/* outbound arrows */}
      <line x1={220} y1={88} x2={340} y2={88} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#nat-a)" />
      <SketchText x={280} y={78} size={8.5} body opacity={0.7}>
        উৎস 192.168.0.5:51001
      </SketchText>
      <line x1={510} y1={88} x2={640} y2={88} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#nat-a)" />
      <SketchText x={575} y={78} size={8.5} accent bold>
        উৎস 103.94.135.2:40001
      </SketchText>

      {/* return note */}
      <line x1={640} y1={160} x2={510} y2={160} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" strokeDasharray="5 3" markerEnd="url(#nat-back)" />
      <line x1={340} y1={160} x2={220} y2={160} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" strokeDasharray="5 3" markerEnd="url(#nat-back)" />
      <Arrow id="nat-back" back />
      <SketchText x={575} y={150} size={8.5} body opacity={0.6}>
        উত্তর আসে 103.94.135.2:40001 এ
      </SketchText>
      <SketchText x={280} y={150} size={8.5} body opacity={0.6}>
        Router আবার 192.168.0.5:51001 বসায়
      </SketchText>

      <SketchText x={430} y={210} size={9} opacity={0.55} body>
        বাইরের Server কখনো আপনার Private ঠিকানা দেখে না, শুধু Public IP আর Port
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. এক এ এক, নাকি অনেক এ এক                                                 */
/* ------------------------------------------------------------------------- */

export function NatVsPatSplit() {
  return (
    <SketchSplit
      label="Diagram: Basic NAT বনাম PAT"
      caption="দুইভাবে ঠিকানা বদলানো যায়। বাঁ দিকে Basic NAT, প্রতিটা Private IP এর জন্য একটা করে আলাদা Public IP লাগে, তাই এটা ঠিকানা বাঁচায় না, দরকারও কম পড়ে। ডান দিকে PAT (যাকে NAT Overload ও বলে), অনেকগুলো Private IP একটাই Public IP ভাগ করে, আর Port নম্বর দিয়ে আলাদা করা হয় কে কোনটা। বাসার Router প্রায় সবসময় ডান দিকেরটা করে, তাই শত শত যন্ত্র একটা Public IP তেই চলে।"
      panels={[
        {
          title: "Basic NAT",
          sub: "এক এ এক",
          viewBox: "0 0 300 190",
          height: 190,
          children: (
            <g>
              {["192.168.0.5", "192.168.0.6", "192.168.0.7"].map((ip, i) => (
                <g key={ip}>
                  <SketchText x={70} y={40 + i * 46} size={10} accent bold>
                    {ip}
                  </SketchText>
                  <line x1={130} y1={36 + i * 46} x2={190} y2={36 + i * 46} stroke="currentColor" strokeOpacity={0.4} strokeWidth="1.1" />
                  <SketchText x={240} y={40 + i * 46} size={9.5} body opacity={0.75}>
                    Public {i + 1}
                  </SketchText>
                </g>
              ))}
              <SketchText x={150} y={182} size={9} body opacity={0.6}>
                ৩ যন্ত্র = ৩ Public IP লাগে
              </SketchText>
            </g>
          ),
        },
        {
          title: "PAT (Overload)",
          sub: "অনেক এ এক",
          viewBox: "0 0 300 190",
          height: 190,
          children: (
            <g>
              {["192.168.0.5", "192.168.0.6", "192.168.0.7"].map((ip, i) => (
                <g key={ip}>
                  <SketchText x={64} y={40 + i * 40} size={10} accent bold>
                    {ip}
                  </SketchText>
                  <line x1={124} y1={36 + i * 40} x2={196} y2={92} stroke="var(--primary)" strokeOpacity={0.6} strokeWidth="1.1" />
                </g>
              ))}
              <rect x={198} y={72} width={94} height={40} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeWidth="1.3" />
              <SketchText x={245} y={90} size={8.5} accent bold>
                একটাই Public
              </SketchText>
              <SketchText x={245} y={104} size={8} body opacity={0.75}>
                Port দিয়ে আলাদা
              </SketchText>
              <SketchText x={150} y={182} size={9} body opacity={0.6}>
                ৩ যন্ত্র = ১ Public IP যথেষ্ট
              </SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 3. বাইরে থেকে ভেতরে ঢোকা, Port Forwarding                                   */
/* ------------------------------------------------------------------------- */

export function PortForwardDiagram() {
  return (
    <Sketch
      label="Diagram: ভেতরে ঢোকার দরজা খুলে দেওয়া"
      height={260}
      minWidth={780}
      viewBox="0 0 780 260"
      caption="সাধারণত বাইরের কেউ নিজে থেকে ভেতরে ঢুকতে পারে না, কারণ NAT টেবিলে তার কোনো সারি নেই, Router জানে না চিঠিটা ভেতরের কাকে দেবে, তাই ফেলে দেয়। এটা একটা স্বাভাবিক সুরক্ষার দেয়াল। কিন্তু আপনি যদি ভেতরে একটা সার্ভার রাখতে চান, তাহলে Router কে হাতে করে একটা নিয়ম বলে দিতে হয়, বাইরের এই Port এ যা আসবে, ভেতরের এই যন্ত্রে পাঠাও। এই নিয়মের নাম Port Forwarding।"
    >
      <Arrow id="pf-a" />

      {/* blocked inbound */}
      <SketchText x={90} y={54} size={10} anchor="start" bold>
        নিয়ম ছাড়া
      </SketchText>
      <SketchText x={70} y={92} size={10} anchor="start" body opacity={0.75}>
        বাইরের অনুরোধ
      </SketchText>
      <line x1={210} y1={88} x2={300} y2={88} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" markerEnd="url(#pf-a)" />
      <rect x={302} y={66} width={120} height={44} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.2" />
      <SketchText x={362} y={92} size={11} bold>
        Router
      </SketchText>
      <SketchText x={470} y={92} size={12} accent bold anchor="start">
        ফেলে দিল
      </SketchText>
      <SketchText x={470} y={108} size={8.5} body opacity={0.6} anchor="start">
        টেবিলে সারি নেই, কার জন্য জানে না
      </SketchText>

      {/* with rule */}
      <SketchText x={90} y={168} size={10} anchor="start" bold accent>
        Port Forward নিয়ম দিলে
      </SketchText>
      <SketchText x={70} y={206} size={10} anchor="start" body opacity={0.75}>
        Public:8080 এ অনুরোধ
      </SketchText>
      <line x1={210} y1={202} x2={300} y2={202} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#pf-a)" />
      <rect x={302} y={180} width={120} height={44} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={362} y={206} size={11} bold accent>
        Router
      </SketchText>
      <line x1={422} y1={202} x2={560} y2={202} stroke="var(--primary)" strokeWidth="1.3" markerEnd="url(#pf-a)" />
      <SketchText x={491} y={192} size={8} accent body>
        নিয়ম মেনে
      </SketchText>
      <rect x={562} y={180} width={190} height={44} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.2" />
      <SketchText x={657} y={200} size={10} bold>
        ভেতরের Server
      </SketchText>
      <SketchText x={657} y={216} size={9} accent body>
        192.168.0.10:80
      </SketchText>
    </Sketch>
  );
}
