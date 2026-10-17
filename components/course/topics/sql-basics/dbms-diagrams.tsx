import { Sketch, SketchBox, SketchSplit, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* 1. জুতার বাক্সে রসিদ বনাম খাতায় সাজানো                                     */
/* ------------------------------------------------------------------------- */

const SLIPS = [
  { x: 24, y: 38, r: -8, text: "রহিম, ২ সিট" },
  { x: 150, y: 30, r: 6, text: "Saint Martin" },
  { x: 60, y: 96, r: 4, text: "১৫ জানুয়ারি?" },
  { x: 176, y: 92, r: -5, text: "১২৫০০ টাকা" },
  { x: 30, y: 150, r: 7, text: "নুসরাত, ফোন?" },
  { x: 160, y: 150, r: -3, text: "Cox's, ৪ জন" },
];

const LEDGER_ROWS = [
  ["রহিম উদ্দিন", "Saint Martin", "১৫ জানু", "২"],
  ["নুসরাত জাহান", "Saint Martin", "১৫ জানু", "৪"],
  ["তানভীর আহমেদ", "Saint Martin", "১২ ফেব্রু", "১"],
  ["ফারহানা আক্তার", "Cox's Bazar", "২৩ জানু", "৩"],
];

const LEDGER_COLS = [14, 104, 196, 262];

export function ShoeboxVsLedgerSplit() {
  return (
    <SketchSplit
      label="দুটোই Data, একটাই Database"
      caption="বাম দিকের বাক্সেও তথ্য আছে, কিন্তু কোনটা কোন বুকিংয়ের অংশ, কোনটা বাদ পড়েছে, কেউ বলতে পারবে না। ডান দিকের খাতায় প্রতিটা লাইনের একই আকার, একই ক্রমে একই ঘর। এই সাজানো ভাবটাই একটা সংগ্রহকে Database বানায়।"
      panels={[
        {
          title: "জুতার বাক্সে রসিদ",
          sub: "তথ্য আছে, সাজানো নেই",
          viewBox: "0 0 320 220",
          height: 220,
          children: (
            <g>
              <rect
                x={8}
                y={14}
                width={304}
                height={196}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.35}
                strokeDasharray="5 4"
              />
              {SLIPS.map((slip) => (
                <g
                  key={slip.text}
                  transform={`rotate(${slip.r} ${slip.x + 60} ${slip.y + 18})`}
                >
                  <rect
                    x={slip.x}
                    y={slip.y}
                    width={120}
                    height={36}
                    fill="var(--card)"
                    stroke="currentColor"
                    strokeOpacity={0.5}
                  />
                  <SketchText x={slip.x + 60} y={slip.y + 23} size={11} body>
                    {slip.text}
                  </SketchText>
                </g>
              ))}
            </g>
          ),
        },
        {
          title: "খাতায় সাজানো",
          sub: "প্রতিটা লাইনের একই আকার",
          viewBox: "0 0 320 220",
          height: 220,
          children: (
            <g>
              <rect
                x={6}
                y={14}
                width={308}
                height={182}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.45}
              />
              <rect
                x={6}
                y={14}
                width={308}
                height={30}
                fill="var(--primary)"
                fillOpacity={0.1}
              />
              {["নাম", "ট্যুর", "তারিখ", "সিট"].map((head, i) => (
                <SketchText
                  key={head}
                  x={LEDGER_COLS[i]}
                  y={34}
                  size={11}
                  anchor="start"
                  body
                  bold
                  accent
                >
                  {head}
                </SketchText>
              ))}
              {LEDGER_ROWS.map((row, r) => (
                <g key={row[0]}>
                  <line
                    x1={6}
                    x2={314}
                    y1={44 + r * 38}
                    y2={44 + r * 38}
                    stroke="currentColor"
                    strokeOpacity={0.25}
                  />
                  {row.map((cell, c) => (
                    <SketchText
                      key={`${row[0]}-${c}`}
                      x={LEDGER_COLS[c]}
                      y={68 + r * 38}
                      size={10.5}
                      anchor="start"
                      body
                    >
                      {cell}
                    </SketchText>
                  ))}
                </g>
              ))}
              {LEDGER_COLS.slice(1).map((x) => (
                <line
                  key={x}
                  x1={x - 8}
                  x2={x - 8}
                  y1={14}
                  y2={196}
                  stroke="currentColor"
                  strokeOpacity={0.2}
                />
              ))}
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Client, DBMS আর Disk: কে কাকে ছোঁয়                                       */
/* ------------------------------------------------------------------------- */

const CLIENTS = [
  { title: "Island Tours API", sub: "NestJS App" },
  { title: "psql", sub: "Terminal থেকে" },
  { title: "pgAdmin", sub: "মাউস দিয়ে" },
];

const ENGINE_PARTS = [
  { title: "Parse", sub: "লেখাটা বোঝা" },
  { title: "Plan", sub: "কোন পথে খুঁজবে" },
  { title: "Permission", sub: "আপনি কি পারবেন?" },
  { title: "Execute", sub: "আসলে খোঁজা" },
  { title: "Constraint", sub: "নিয়ম মানা" },
  { title: "Lock", sub: "একসাথে অনেকে" },
];

export function DbmsLayersDiagram() {
  return (
    <Sketch
      label="Client কখনো ফাইল ছোঁয় না"
      height={340}
      minWidth={860}
      viewBox="0 0 860 340"
      caption="বাম দিকের যেকোনো Program শুধু একটা কাজ পারে: DBMS কে SQL এ প্রশ্ন পাঠানো। মাঝখানের PostgreSQL প্রশ্নটা বোঝে, পথ ঠিক করে, অনুমতি মিলিয়ে নেয়, নিয়ম মেনে কাজটা করে, আর তখনই ডান দিকের Disk এ হাত দেয়। Disk এর ফাইলগুলো শুধু DBMS এর জন্য, আর কারো জন্য না।"
    >
      <defs>
        <marker
          id="dbms-layers-arrow"
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

      <SketchText x={115} y={30} size={10} bold opacity={0.7}>
        CLIENT
      </SketchText>
      {CLIENTS.map((client, i) => (
        <g key={client.title}>
          <SketchBox
            x={30}
            y={48 + i * 92}
            w={170}
            h={60}
            title={client.title}
            sub={client.sub}
          />
          <line
            x1={204}
            y1={70 + i * 92}
            x2={300}
            y2={70 + i * 92}
            stroke="var(--primary)"
            strokeWidth={1.3}
            markerEnd="url(#dbms-layers-arrow)"
          />
          <line
            x1={300}
            y1={88 + i * 92}
            x2={206}
            y2={88 + i * 92}
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeWidth={1.1}
            strokeDasharray="4 3"
            markerEnd="url(#dbms-layers-arrow)"
          />
        </g>
      ))}
      <SketchText x={252} y={62} size={9} accent>
        SQL
      </SketchText>
      <SketchText x={252} y={104} size={9} opacity={0.7}>
        Rows
      </SketchText>

      <rect
        x={304}
        y={40}
        width={300}
        height={270}
        fill="var(--primary)"
        fillOpacity={0.06}
        stroke="var(--primary)"
        strokeWidth={1.4}
      />
      <SketchText x={454} y={64} size={12} bold accent>
        DBMS: PostgreSQL
      </SketchText>
      {ENGINE_PARTS.map((part, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <SketchBox
            key={part.title}
            x={320 + col * 144}
            y={82 + row * 72}
            w={132}
            h={58}
            title={part.title}
            sub={part.sub}
          />
        );
      })}

      <line
        x1={608}
        y1={175}
        x2={672}
        y2={175}
        stroke="var(--primary)"
        strokeWidth={1.3}
        markerEnd="url(#dbms-layers-arrow)"
      />
      <SketchText x={640} y={166} size={9} opacity={0.7}>
        শুধু DBMS
      </SketchText>

      <g>
        <ellipse
          cx={760}
          cy={92}
          rx={78}
          ry={16}
          fill="var(--card)"
          stroke="currentColor"
          strokeOpacity={0.5}
        />
        <path
          d="M 682 92 V 258 A 78 16 0 0 0 838 258 V 92"
          fill="var(--card)"
          stroke="currentColor"
          strokeOpacity={0.5}
        />
        <ellipse
          cx={760}
          cy={92}
          rx={78}
          ry={16}
          fill="var(--card)"
          stroke="currentColor"
          strokeOpacity={0.5}
        />
        <SketchText x={760} y={140} size={11} bold>
          Disk
        </SketchText>
        <SketchText x={760} y={172} size={10} opacity={0.8}>
          Data Files
        </SketchText>
        <SketchText x={760} y={196} size={10} opacity={0.8}>
          WAL
        </SketchText>
        <SketchText x={760} y={226} size={9} body opacity={0.7}>
          হাতে খোলা নিষেধ
        </SketchText>
      </g>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. একটা Server, অনেকগুলো Database                                          */
/* ------------------------------------------------------------------------- */

const DATABASES = [
  { title: "island_tours", sub: "৮টা Table", accent: true },
  { title: "my_tours", sub: "আপনার Project", accent: false },
  { title: "postgres", sub: "শুরু থেকেই থাকে", accent: false },
];

export function ServerDatabasesDiagram() {
  return (
    <Sketch
      label="Database, DBMS আর Server, তিনটা আলাদা শব্দ"
      height={320}
      minWidth={860}
      viewBox="0 0 860 320"
      caption="বাইরের বড় বাক্সটা একটা মেশিন। তার ভেতরে চলছে একটা Program, PostgreSQL, যে Port 5432 এ কান পেতে আছে। এই চলন্ত Program টাই Database Server। আর তার ভেতরে আলাদা আলাদা নামের Database, প্রতিটা নিজের Table নিয়ে। একটা Server, অনেকগুলো Database।"
    >
      <defs>
        <marker
          id="dbms-server-arrow"
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

      {["Island Tours API", "psql"].map((name, i) => (
        <g key={name}>
          <SketchBox x={20} y={96 + i * 90} w={150} h={50} title={name} />
          <line
            x1={174}
            y1={121 + i * 90}
            x2={262}
            y2={160}
            stroke="var(--primary)"
            strokeWidth={1.3}
            markerEnd="url(#dbms-server-arrow)"
          />
        </g>
      ))}
      <SketchText x={95} y={80} size={9} body opacity={0.7}>
        যারা প্রশ্ন পাঠায়
      </SketchText>

      <rect
        x={230}
        y={20}
        width={610}
        height={280}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeDasharray="6 4"
      />
      <SketchText x={250} y={42} size={10} anchor="start" body opacity={0.8}>
        একটা মেশিন: Island Tours এর VPS, অথবা আপনার Laptop
      </SketchText>

      <rect
        x={266}
        y={62}
        width={556}
        height={218}
        fill="var(--primary)"
        fillOpacity={0.06}
        stroke="var(--primary)"
        strokeWidth={1.4}
      />
      <SketchText x={286} y={86} size={11.5} anchor="start" bold accent>
        PostgreSQL Server Process
      </SketchText>
      <rect
        x={244}
        y={146}
        width={46}
        height={28}
        fill="var(--card)"
        stroke="var(--primary)"
        strokeWidth={1.3}
      />
      <SketchText x={267} y={165} size={10} bold accent>
        5432
      </SketchText>

      {DATABASES.map((db, i) => (
        <g key={db.title}>
          <SketchBox
            x={312 + i * 170}
            y={118}
            w={150}
            h={64}
            title={db.title}
            sub={db.sub}
            accent={db.accent}
          />
          {[0, 1, 2].map((t) => (
            <rect
              key={t}
              x={330 + i * 170 + t * 40}
              y={204}
              width={32}
              height={22}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.35}
            />
          ))}
          <SketchText x={387 + i * 170} y={248} size={9} body opacity={0.7}>
            নিজের নিজের Table
          </SketchText>
        </g>
      ))}
    </Sketch>
  );
}
