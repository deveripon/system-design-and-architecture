import { Sketch, SketchBox, SketchSplit, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* 1. psql কোথায় বসে: আপনার Terminal আর Server এর মাঝখানে                      */
/* ------------------------------------------------------------------------- */

export function PsqlWhereDiagram() {
  return (
    <Sketch
      label="psql কোথায় বসে"
      height={300}
      minWidth={860}
      viewBox="0 0 860 300"
      caption="psql একটা আলাদা Program, Server না। আপনি Terminal এ লেখেন, psql সেটা একটা Connection দিয়ে PostgreSQL Server এর কাছে পাঠায়, উত্তর এলে সাজিয়ে Table এর মতো করে দেখায়। একই মেশিনে থাকলে কথা হয় Unix Socket দিয়ে, অন্য মেশিনে বা Docker এর বাইরে থেকে হলে TCP দিয়ে, সাধারণত Port 5432 এ।"
    >
      <defs>
        <marker
          id="psql-where-arrow"
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

      {/* Your machine */}
      <rect
        x={14}
        y={24}
        width={380}
        height={240}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeDasharray="5 4"
      />
      <SketchText x={204} y={46} size={10} bold opacity={0.7}>
        আপনার মেশিন
      </SketchText>
      <SketchBox x={36} y={90} w={150} h={70} title="Terminal" sub="আপনি এখানে লেখেন" />
      <SketchBox x={222} y={90} w={150} h={70} title="psql" sub="Client Program" accent />
      <SketchText x={204} y={210} size={10.5} body opacity={0.85}>
        psql --version দিয়ে এর Version দেখা যায়
      </SketchText>
      <line
        x1={190}
        y1={125}
        x2={218}
        y2={125}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#psql-where-arrow)"
      />

      {/* The connection */}
      <line
        x1={376}
        y1={115}
        x2={510}
        y2={115}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#psql-where-arrow)"
      />
      <line
        x1={510}
        y1={138}
        x2={380}
        y2={138}
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth="1.3"
        markerEnd="url(#psql-where-arrow)"
      />
      <SketchText x={444} y={104} size={9.5} accent>
        SQL এর লেখা
      </SketchText>
      <SketchText x={444} y={158} size={9.5} opacity={0.75}>
        Row ফেরত
      </SketchText>
      <SketchText x={444} y={190} size={9.5} body opacity={0.8}>
        Socket বা TCP 5432
      </SketchText>

      {/* The server */}
      <rect
        x={516}
        y={24}
        width={330}
        height={240}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeDasharray="5 4"
      />
      <SketchText x={681} y={46} size={10} bold opacity={0.7}>
        Server (একই মেশিন, Docker বা দূরের VPS)
      </SketchText>
      <SketchBox x={540} y={74} w={286} h={64} title="PostgreSQL Server" sub="Port 5432 এ অপেক্ষায়" />
      <SketchBox x={560} y={164} w={120} h={58} title="island_tours" sub="Database" accent />
      <SketchBox x={694} y={164} w={120} h={58} title="postgres" sub="Database" />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Connection এর পাঁচটা তথ্য, তিনভাবে বলা                                   */
/* ------------------------------------------------------------------------- */

const PARTS = [
  { name: "Host", flag: "-h localhost", uri: "localhost", env: "PGHOST" },
  { name: "Port", flag: "-p 5432", uri: ":5432", env: "PGPORT" },
  { name: "User", flag: "-U postgres", uri: "postgres@", env: "PGUSER" },
  { name: "Database", flag: "-d island_tours", uri: "/island_tours", env: "PGDATABASE" },
  { name: "Password", flag: "প্রশ্ন করে নেয়", uri: "লিখবেন না", env: "~/.pgpass ভালো" },
];

export function ConnectPartsDiagram() {
  const colX = [24, 190, 400, 640];
  return (
    <Sketch
      label="একই পাঁচটা তথ্য, তিনভাবে"
      height={330}
      minWidth={860}
      viewBox="0 0 860 330"
      caption="psql কে যেকোনো Server এ পাঠাতে এই পাঁচটা তথ্যই লাগে। Flag, URI আর Environment Variable তিনটা আলাদা লেখার ধরন মাত্র, ভেতরে একই জিনিস। Password কোনো ধরনেই Command এ লিখে রাখবেন না: psql নিজে জিজ্ঞেস করবে, আর বারবার লাগলে ~/.pgpass ফাইল আছে।"
    >
      {["তথ্য", "Flag", "URI এর অংশ", "Environment Variable"].map((h, i) => (
        <SketchText key={h} x={colX[i]} y={32} anchor="start" size={10.5} bold accent>
          {h}
        </SketchText>
      ))}
      <line x1={20} y1={44} x2={840} y2={44} stroke="currentColor" strokeOpacity={0.35} />
      {PARTS.map((part, r) => {
        const y = 78 + r * 40;
        return (
          <g key={part.name}>
            <SketchText x={colX[0]} y={y} anchor="start" size={11} bold>
              {part.name}
            </SketchText>
            <SketchText x={colX[1]} y={y} anchor="start" size={11} body={r === 4}>
              {part.flag}
            </SketchText>
            <SketchText x={colX[2]} y={y} anchor="start" size={11} body={r === 4}>
              {part.uri}
            </SketchText>
            <SketchText x={colX[3]} y={y} anchor="start" size={11} body={r === 4}>
              {part.env}
            </SketchText>
            <line
              x1={20}
              y1={y + 14}
              x2={840}
              y2={y + 14}
              stroke="currentColor"
              strokeOpacity={0.12}
            />
          </g>
        );
      })}
      <SketchText x={24} y={300} anchor="start" size={10.5} accent>
        {'psql "postgresql://postgres@localhost:5432/island_tours"'}
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Prompt এর তিন টুকরো                                                      */
/* ------------------------------------------------------------------------- */

const SECOND = [
  { ch: "-", means: "Statement শেষ হয়নি, Semicolon বাকি" },
  { ch: "(", means: "একটা Bracket খোলা, বন্ধ হয়নি" },
  { ch: "'", means: "একটা লেখার Quote খোলা" },
  { ch: '"', means: "একটা নামের Double Quote খোলা" },
  { ch: "$", means: "Dollar Quote খোলা (Module 14)" },
  { ch: "*", means: "/* Comment */ বন্ধ হয়নি" },
];

export function PromptAnatomyDiagram() {
  return (
    <Sketch
      label="Prompt পড়তে শেখা"
      height={360}
      minWidth={860}
      viewBox="0 0 860 360"
      caption="Prompt কোনো সাজসজ্জা না, psql আপনাকে প্রতি লাইনে তিনটা কথা জানায়: এখন কোন Database এ আছেন, psql আপনার কাছ থেকে নতুন Statement চাইছে নাকি আগেরটার বাকি অংশ, আর আপনি Superuser কিনা। নিচের চিহ্নগুলো psql এর অফিসিয়াল Docs থেকে নেওয়া।"
    >
      <SketchText x={240} y={64} size={30} bold accent>
        island_tours
      </SketchText>
      <SketchText x={398} y={64} size={30} bold>
        =
      </SketchText>
      <SketchText x={432} y={64} size={30} bold accent>
        #
      </SketchText>

      <line x1={240} y1={78} x2={240} y2={110} stroke="var(--primary)" strokeWidth="1.2" />
      <line x1={398} y1={78} x2={398} y2={150} stroke="currentColor" strokeOpacity={0.6} strokeWidth="1.2" />
      <line x1={432} y1={78} x2={560} y2={110} stroke="var(--primary)" strokeWidth="1.2" />

      <SketchText x={240} y={128} size={11} bold>
        কোন Database এ আছেন
      </SketchText>
      <SketchText x={240} y={146} size={10} body opacity={0.8}>
        \c দিলে নামটা বদলে যায়
      </SketchText>

      <SketchText x={600} y={128} size={11} bold>
        # মানে Superuser
      </SketchText>
      <SketchText x={600} y={146} size={10} body opacity={0.8}>
        &gt; মানে সাধারণ User
      </SketchText>

      <SketchText x={398} y={168} size={11} bold>
        = মানে নতুন Statement এর জন্য তৈরি
      </SketchText>
      <SketchText x={398} y={188} size={10} body opacity={0.8}>
        দ্বিতীয় লাইন থেকে এই জায়গায় অন্য চিহ্ন আসে, তার মানে:
      </SketchText>

      {SECOND.map((item, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 40 + col * 270;
        const y = 228 + row * 56;
        return (
          <g key={item.ch}>
            <rect
              x={x}
              y={y - 22}
              width={250}
              height={44}
              fill="transparent"
              stroke="currentColor"
              strokeOpacity={0.3}
            />
            <SketchText x={x + 22} y={y + 5} size={16} bold accent>
              {item.ch}
            </SketchText>
            <SketchText x={x + 44} y={y + 4} anchor="start" size={10} body>
              {item.means}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. দুই ধরনের Command                                                       */
/* ------------------------------------------------------------------------- */

export function TwoKindsSplit() {
  return (
    <SketchSplit
      label="psql এ দুই ধরনের লেখা"
      caption="একই Prompt এ দুই ধরনের লেখা চলে। SQL যায় Server এর কাছে, শেষ হয় Semicolon দিয়ে, আর যেকোনো Client থেকে একই কাজ করে। Backslash দিয়ে শুরু হওয়া Meta-command psql নিজেই সামলায়, Enter চাপলেই চলে, আর শুধু psql এই কাজ করে।"
      panels={[
        {
          title: "SQL Statement",
          sub: "Server এর কাছে যায়",
          viewBox: "0 0 380 220",
          height: 220,
          children: (
            <g>
              <defs>
                <marker
                  id="psql-kinds-arrow-a"
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
              <SketchText x={20} y={34} anchor="start" size={12} accent>
                SELECT count(*) FROM tours;
              </SketchText>
              <SketchBox x={20} y={70} w={110} h={50} title="psql" sub="শুধু পাঠায়" />
              <line
                x1={134}
                y1={95}
                x2={222}
                y2={95}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#psql-kinds-arrow-a)"
              />
              <SketchBox x={226} y={70} w={136} h={50} title="Server" sub="চালায়, উত্তর দেয়" accent />
              <SketchText x={20} y={160} anchor="start" size={10.5} body>
                শেষে ; লাগে, নইলে psql অপেক্ষা করে
              </SketchText>
              <SketchText x={20} y={186} anchor="start" size={10.5} body>
                pgAdmin বা কোড থেকেও হুবহু চলে
              </SketchText>
            </g>
          ),
        },
        {
          title: "Meta-command",
          sub: "psql নিজেই সামলায়",
          viewBox: "0 0 380 220",
          height: 220,
          children: (
            <g>
              <SketchText x={20} y={34} anchor="start" size={12} accent>
                \dt
              </SketchText>
              <SketchBox x={20} y={70} w={170} h={50} title="psql" sub="নিজেই বোঝে, নিজেই সাজায়" accent />
              <SketchText x={210} y={92} anchor="start" size={10} body opacity={0.8}>
                ভেতরে সে নিজেও
              </SketchText>
              <SketchText x={210} y={108} anchor="start" size={10} body opacity={0.8}>
                SQL পাঠায়, লুকিয়ে
              </SketchText>
              <SketchText x={20} y={160} anchor="start" size={10.5} body>
                Backslash দিয়ে শুরু, Enter চাপলেই চলে
              </SketchText>
              <SketchText x={20} y={186} anchor="start" size={10.5} body>
                শুধু psql এ চলে, অন্য Tool এ না
              </SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}
