import { Sketch, SketchBox, SketchSplit, SketchText } from "../../sketch";

function Arrow({ id, muted }: { id: string; muted?: boolean }) {
  return (
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
  );
}

/* ------------------------------------------------------------------------- */
/* 1. ইনস্টল করলে আসলে কী কী আসে                                              */
/* ------------------------------------------------------------------------- */

export function InstallAnatomyDiagram() {
  return (
    <Sketch
      label="PostgreSQL ইনস্টল করলে আপনার কম্পিউটারে যা যা বসে"
      height={400}
      minWidth={900}
      viewBox="0 0 900 400"
      caption="একটা ইনস্টল মানে একটা Program না, পাঁচটা জিনিস একসাথে। Server Program টা (postgres) Data Directory তে Data রাখে আর Port 5432 এ অপেক্ষা করে। Service তাকে কম্পিউটার চালু হলেই চালু করে দেয়। আর psql এর মতো Client Program গুলো সেই Port দিয়ে Server এর সাথে কথা বলে। শুরুতে Data Directory তে তিনটা Database তৈরি থাকে, আর একজন Superuser Role, যার কাছে সব চাবি।"
    >
      <defs>
        <Arrow id="install-pg-anatomy-arrow" />
      </defs>

      {/* the computer */}
      <rect
        x={20}
        y={20}
        width={860}
        height={360}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeDasharray="6 4"
      />
      <SketchText x={40} y={44} anchor="start" size={11} bold opacity={0.7}>
        আপনার কম্পিউটার (Laptop, VPS অথবা একটা Container)
      </SketchText>

      {/* service */}
      <SketchBox x={50} y={80} w={170} h={64} title="Service" sub="চালু করে, চালু রাখে" />
      <line
        x1={220}
        y1={112}
        x2={300}
        y2={112}
        stroke="var(--primary)"
        strokeWidth={1.4}
        markerEnd="url(#install-pg-anatomy-arrow)"
      />

      {/* server */}
      <SketchBox x={304} y={74} w={250} h={76} title="Server Program: postgres" sub="সবসময় চলতে থাকা Process" accent />

      {/* data directory */}
      <rect
        x={304}
        y={196}
        width={250}
        height={160}
        fill="var(--primary)"
        fillOpacity={0.04}
        stroke="currentColor"
        strokeOpacity={0.45}
      />
      <SketchText x={429} y={218} size={11} bold>
        Data Directory (Cluster)
      </SketchText>
      {["postgres", "template0", "template1"].map((name, i) => (
        <g key={name}>
          <ellipse cx={354 + i * 75} cy={250} rx={30} ry={7} fill="none" stroke="currentColor" strokeOpacity={0.6} />
          <path
            d={`M ${324 + i * 75} 250 V 282 A 30 7 0 0 0 ${384 + i * 75} 282 V 250`}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.6}
          />
          <SketchText x={354 + i * 75} y={304} size={9.5}>
            {name}
          </SketchText>
        </g>
      ))}
      <SketchText x={429} y={334} size={10} body opacity={0.85}>
        শুরু থেকে তিনটা Database, আর একজন Superuser
      </SketchText>
      <line
        x1={429}
        y1={150}
        x2={429}
        y2={192}
        stroke="var(--primary)"
        strokeWidth={1.4}
        markerEnd="url(#install-pg-anatomy-arrow)"
      />
      <SketchText x={437} y={176} anchor="start" size={9.5} body opacity={0.8}>
        Data পড়ে আর লেখে
      </SketchText>

      {/* port */}
      <rect x={600} y={92} width={86} height={40} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" />
      <SketchText x={643} y={117} size={12} bold accent>
        5432
      </SketchText>
      <SketchText x={643} y={150} size={9.5} body opacity={0.8}>
        Port, দরজা
      </SketchText>
      <line x1={554} y1={112} x2={600} y2={112} stroke="var(--primary)" strokeWidth={1.4} />

      {/* clients */}
      <rect x={720} y={70} width={140} height={190} fill="none" stroke="currentColor" strokeOpacity={0.45} />
      <SketchText x={790} y={92} size={11} bold>
        Client Program
      </SketchText>
      {["psql", "createdb", "pg_dump", "pg_isready"].map((tool, i) => (
        <SketchText key={tool} x={790} y={124 + i * 30} size={11} accent={i === 0}>
          {tool}
        </SketchText>
      ))}
      <line
        x1={718}
        y1={112}
        x2={690}
        y2={112}
        stroke="var(--primary)"
        strokeWidth={1.4}
        markerEnd="url(#install-pg-anatomy-arrow)"
      />
      <SketchText x={790} y={290} size={9.5} body opacity={0.8}>
        Server এর সাথে কথা বলে
      </SketchText>
      <SketchText x={790} y={308} size={9.5} body opacity={0.8}>
        Port দিয়ে, প্রশ্ন পাঠিয়ে
      </SketchText>

      <SketchText x={135} y={186} size={9.5} body opacity={0.8}>
        Mac এ brew services,
      </SketchText>
      <SketchText x={135} y={204} size={9.5} body opacity={0.8}>
        Linux এ systemctl,
      </SketchText>
      <SketchText x={135} y={222} size={9.5} body opacity={0.8}>
        Windows এ Services অ্যাপ
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন Version কতদিন পাহারা পায়                                            */
/* ------------------------------------------------------------------------- */

/** First release and final release dates, from postgresql.org/support/versioning. */
const VERSIONS = [
  { v: "18", from: 2025 + 268 / 365, to: 2030 + 318 / 365, first: "Sep 2025", last: "Nov 2030" },
  { v: "17", from: 2024 + 269 / 365, to: 2029 + 311 / 365, first: "Sep 2024", last: "Nov 2029" },
  { v: "16", from: 2023 + 256 / 365, to: 2028 + 313 / 365, first: "Sep 2023", last: "Nov 2028" },
  { v: "15", from: 2022 + 285 / 365, to: 2027 + 314 / 365, first: "Oct 2022", last: "Nov 2027" },
  { v: "14", from: 2021 + 272 / 365, to: 2026 + 315 / 365, first: "Sep 2021", last: "Nov 2026" },
];

const YEAR0 = 2021;
const YEAR1 = 2031;
const X0 = 90;
const X1 = 860;
const xOf = (year: number) => X0 + ((year - YEAR0) / (YEAR1 - YEAR0)) * (X1 - X0);
/** Today, as these lessons were written: 17 October 2026. */
const TODAY = 2026 + 289 / 365;

export function VersionSupportDiagram() {
  return (
    <Sketch
      label="প্রতিটা Major Version পাঁচ বছর পাহারা পায়"
      height={300}
      minWidth={900}
      viewBox="0 0 900 300"
      caption="প্রতিটা দাগ একটা Major Version এর জীবন: প্রথম Release থেকে শেষ Release পর্যন্ত, মোটামুটি পাঁচ বছর। এই সময়ে প্রতি তিন মাসে অন্তত একবার Minor Release আসে, যাতে Bug আর নিরাপত্তার সমস্যা সারানো থাকে। খাড়া দাগটা এই লেসন লেখার দিন। 14 এর জীবন প্রায় শেষ, তাই নতুন কিছু শুরু করলে 18 নেওয়াই ঠিক। তারিখগুলো postgresql.org এর Versioning পাতা থেকে।"
    >
      {Array.from({ length: YEAR1 - YEAR0 + 1 }, (_, i) => YEAR0 + i).map((year) => (
        <g key={year}>
          <line x1={xOf(year)} y1={36} x2={xOf(year)} y2={250} stroke="currentColor" strokeOpacity={0.12} />
          <SketchText x={xOf(year)} y={272} size={10} opacity={0.7}>
            {String(year)}
          </SketchText>
        </g>
      ))}
      {VERSIONS.map((ver, i) => {
        const y = 52 + i * 42;
        const current = ver.v === "18";
        const ending = ver.v === "14";
        return (
          <g key={ver.v}>
            <SketchText x={50} y={y + 15} size={12} bold accent={current}>
              {ver.v}
            </SketchText>
            <rect
              x={xOf(ver.from)}
              y={y}
              width={xOf(ver.to) - xOf(ver.from)}
              height={22}
              fill={current ? "var(--primary)" : "currentColor"}
              fillOpacity={current ? 0.2 : 0.08}
              stroke={current ? "var(--primary)" : "currentColor"}
              strokeOpacity={current ? 1 : 0.45}
              strokeDasharray={ending ? "4 3" : undefined}
            />
            <SketchText x={xOf(ver.from) + 8} y={y + 15} anchor="start" size={9.5} opacity={0.85}>
              {ver.first}
            </SketchText>
            <SketchText x={xOf(ver.to) - 8} y={y + 15} anchor="end" size={9.5} opacity={0.85}>
              {ver.last}
            </SketchText>
          </g>
        );
      })}
      <line x1={xOf(TODAY)} y1={30} x2={xOf(TODAY)} y2={256} stroke="var(--primary)" strokeWidth={1.6} />
      <SketchText x={xOf(TODAY) + 6} y={30} anchor="start" size={10} bold accent>
        আজ, অক্টোবর 2026
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. psql খালি লিখলে কোন চারটা ঘর নিজে ভরে নেয়                                */
/* ------------------------------------------------------------------------- */

const DEFAULTS = [
  { field: "host", value: "Unix Socket (Mac, Linux)", note: "Windows এ localhost" },
  { field: "port", value: "5432", note: "অথবা PGPORT" },
  { field: "user", value: "আপনার OS এর নাম, যেমন rahim", note: "অথবা -U দিয়ে বলা নাম" },
  { field: "dbname", value: "user এর নামের সমান, rahim", note: "অথবা শেষে লেখা নাম" },
];

export function ConnectDefaultsDiagram() {
  return (
    <Sketch
      label="শুধু psql লিখলে যা ঘটে"
      height={300}
      minWidth={860}
      viewBox="0 0 860 300"
      caption="psql কে কিছু না বললে সে চারটা ঘর নিজেই ভরে নেয়। সবচেয়ে বড় ফাঁদ শেষ দুটো: আপনার কম্পিউটারের লগইন নামটাকেই সে Database এর Role ভেবে নেয়, আর সেই নামেই একটা Database খোঁজে। Server এ ওই নামে Role বা Database না থাকলে প্রথম দিনের দুটো বিখ্যাত Error আসে। নিয়মগুলো psql এর অফিসিয়াল Docs এ লেখা।"
    >
      <defs>
        <Arrow id="install-pg-defaults-arrow" />
      </defs>
      <rect x={30} y={120} width={150} height={56} fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" />
      <SketchText x={105} y={154} size={15} bold accent>
        $ psql
      </SketchText>
      <SketchText x={105} y={200} size={10} body opacity={0.8}>
        আর কিছু লেখা নেই
      </SketchText>
      {DEFAULTS.map((d, i) => {
        const y = 30 + i * 64;
        return (
          <g key={d.field}>
            <path
              d={`M 182 148 C 230 148 230 ${y + 24} 270 ${y + 24}`}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={0.7}
              strokeWidth={1.3}
              markerEnd="url(#install-pg-defaults-arrow)"
            />
            <rect x={274} y={y} width={110} height={48} fill="none" stroke="currentColor" strokeOpacity={0.5} />
            <SketchText x={329} y={y + 29} size={12} bold>
              {d.field}
            </SketchText>
            <rect
              x={396}
              y={y}
              width={300}
              height={48}
              fill={i >= 2 ? "var(--primary)" : "transparent"}
              fillOpacity={i >= 2 ? 0.08 : 0}
              stroke={i >= 2 ? "var(--primary)" : "currentColor"}
              strokeOpacity={i >= 2 ? 1 : 0.4}
            />
            <SketchText x={546} y={y + 29} size={11} body accent={i >= 2}>
              {d.value}
            </SketchText>
            <SketchText x={712} y={y + 29} anchor="start" size={9.5} body opacity={0.75}>
              {d.note}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. একটা Port, দুটো Server                                                  */
/* ------------------------------------------------------------------------- */

export function PortConflictSplit() {
  return (
    <SketchSplit
      label="একটা Port এ একজনই বসতে পারে"
      caption="একটা Port একসাথে একটাই Program নিতে পারে। আগে থেকে একটা PostgreSQL 5432 ধরে থাকলে দ্বিতীয়টা হয় চালুই হয় না, নয়তো Docker সোজা জানিয়ে দেয় port is already allocated। সবচেয়ে বিপজ্জনক অবস্থা হলো যখন দুটোই কোনোভাবে চলে, আর psql চুপচাপ ভুলটার সাথে কথা বলে। সমাধান সহজ: নতুনটাকে 5433 এ বসান, আর Connect করার সময় Port টা বলে দিন।"
      panels={[
        {
          title: "ঝগড়া",
          sub: "দুজনেই 5432 চায়",
          viewBox: "0 0 360 230",
          height: 230,
          children: (
            <g>
              <defs>
                <Arrow id="install-pg-conflict-arrow" />
                <Arrow id="install-pg-conflict-arrow-muted" muted />
              </defs>
              <SketchBox x={10} y={30} w={150} h={52} title="Homebrew 17" sub="আগে থেকে চলছে" />
              <SketchBox x={10} y={140} w={150} h={52} title="Docker 18" sub="নতুন, চালু হতে চায়" dashed />
              <rect x={250} y={84} width={90} height={50} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" />
              <SketchText x={295} y={114} size={13} bold accent>
                5432
              </SketchText>
              <line x1={160} y1={56} x2={246} y2={100} stroke="var(--primary)" strokeWidth={1.4} markerEnd="url(#install-pg-conflict-arrow)" />
              <line
                x1={160}
                y1={166}
                x2={246}
                y2={124}
                stroke="currentColor"
                strokeOpacity={0.55}
                strokeWidth={1.3}
                strokeDasharray="4 3"
                markerEnd="url(#install-pg-conflict-arrow-muted)"
              />
              <SketchText x={204} y={180} size={14} bold accent>
                ✕
              </SketchText>
              <SketchText x={180} y={218} size={9.5} body opacity={0.85}>
                port is already allocated
              </SketchText>
            </g>
          ),
        },
        {
          title: "মীমাংসা",
          sub: "নতুনটা 5433 এ",
          viewBox: "0 0 360 230",
          height: 230,
          children: (
            <g>
              <defs>
                <Arrow id="install-pg-settle-arrow" />
              </defs>
              <SketchBox x={10} y={30} w={150} h={52} title="Homebrew 17" sub="আগের মতোই" />
              <SketchBox x={10} y={140} w={150} h={52} title="Docker 18" sub="-p 127.0.0.1:5433:5432" accent />
              <rect x={250} y={30} width={90} height={50} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.5} />
              <SketchText x={295} y={60} size={13} bold>
                5432
              </SketchText>
              <rect x={250} y={140} width={90} height={50} fill="var(--primary)" fillOpacity={0.12} stroke="var(--primary)" />
              <SketchText x={295} y={170} size={13} bold accent>
                5433
              </SketchText>
              <line x1={160} y1={56} x2={246} y2={56} stroke="var(--primary)" strokeOpacity={0.6} strokeWidth={1.3} markerEnd="url(#install-pg-settle-arrow)" />
              <line x1={160} y1={166} x2={246} y2={166} stroke="var(--primary)" strokeWidth={1.4} markerEnd="url(#install-pg-settle-arrow)" />
              <SketchText x={180} y={218} size={9.5} body opacity={0.85}>
                psql -h 127.0.0.1 -p 5433 -U postgres
              </SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}
