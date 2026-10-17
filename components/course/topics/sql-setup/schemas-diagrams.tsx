import { Sketch, SketchSplit, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* Shared bits                                                               */
/* ------------------------------------------------------------------------- */

function Arrow({ id, muted }: { id: string; muted?: boolean }) {
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
          fill={muted ? "currentColor" : "var(--primary)"}
          fillOpacity={muted ? 0.55 : 1}
        />
      </marker>
    </defs>
  );
}

function Frame({
  x,
  y,
  w,
  h,
  accent,
  dashed,
  strong,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent?: boolean;
  dashed?: boolean;
  strong?: boolean;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill={accent ? "var(--primary)" : "currentColor"}
      fillOpacity={accent ? 0.07 : strong ? 0.04 : 0.02}
      stroke={accent ? "var(--primary)" : "currentColor"}
      strokeOpacity={accent ? 0.9 : 0.4}
      strokeWidth="1.2"
      strokeDasharray={dashed ? "5 4" : undefined}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Server, Database, Schema, Table: চার স্তর                                 */
/* ------------------------------------------------------------------------- */

const PUBLIC_TABLES = [
  "tours",
  "bookings",
  "customers",
  "departures",
  "destinations",
  "guides",
  "payments",
  "reviews",
];

const SIDE_DATABASES = [
  { name: "postgres", note: "শুরু থেকেই থাকে, Tool গুলোর জন্য", dashed: false },
  { name: "template1", note: "নতুন Database এর ছাঁচ", dashed: false },
  { name: "template0", note: "কখনো না বদলানো মূল ছাঁচ", dashed: false },
  { name: "my_tours", note: "আপনার বানানো আরেকটা Database", dashed: true },
];

export function ClusterLevelsDiagram() {
  return (
    <Sketch
      label="একটা Server এর ভেতরে চার স্তর"
      height={500}
      minWidth={960}
      viewBox="0 0 960 500"
      caption="সবচেয়ে বাইরে একটা চালু PostgreSQL Server, যাকে PostgreSQL এর ভাষায় বলে Cluster। তার ভেতরে কয়েকটা Database, প্রতিটা আলাদা ঘরের মতো বন্ধ। একটা Database এর ভেতরে কয়েকটা Schema, আর Schema এর ভেতরে Table। Role, মানে কে Login করতে পারবেন, সেটা থাকে পুরো Server এর স্তরে, তাই একই Role সব Database এ চেনা যায়।"
    >
      {/* Server */}
      <Frame x={10} y={14} w={940} h={476} strong />
      <SketchText x={28} y={38} anchor="start" size={12} bold>
        PostgreSQL Server (Cluster), Port 5432
      </SketchText>
      <SketchText x={932} y={38} anchor="end" size={10} opacity={0.75}>
        Role: postgres, app_user (পুরো Server এ একবার)
      </SketchText>

      {/* island_tours */}
      <Frame x={28} y={56} w={580} h={418} accent />
      <SketchText x={44} y={80} anchor="start" size={11.5} bold accent>
        Database: island_tours
      </SketchText>

      {/* public schema */}
      <Frame x={44} y={96} w={262} h={362} />
      <SketchText x={58} y={118} anchor="start" size={11} bold>
        Schema: public
      </SketchText>
      {PUBLIC_TABLES.map((table, i) => (
        <g key={table}>
          <rect
            x={58}
            y={132 + i * 39}
            width={234}
            height={30}
            fill="var(--card)"
            stroke="currentColor"
            strokeOpacity={0.35}
          />
          <SketchText x={70} y={151 + i * 39} anchor="start" size={10.5}>
            {`Table: ${table}`}
          </SketchText>
        </g>
      ))}

      {/* analytics schema */}
      <Frame x={324} y={96} w={268} h={160} />
      <SketchText x={338} y={118} anchor="start" size={11} bold>
        Schema: analytics
      </SketchText>
      {["tours", "daily_revenue"].map((table, i) => (
        <g key={table}>
          <rect
            x={338}
            y={132 + i * 39}
            width={240}
            height={30}
            fill="var(--card)"
            stroke="currentColor"
            strokeOpacity={0.35}
          />
          <SketchText x={350} y={151 + i * 39} anchor="start" size={10.5}>
            {`Table: ${table}`}
          </SketchText>
        </g>
      ))}
      <SketchText x={338} y={232} anchor="start" size={9.5} body opacity={0.75}>
        নাম public এর tours এর মতো, তবু আলাদা Table
      </SketchText>

      {/* audit schema */}
      <Frame x={324} y={272} w={268} h={186} />
      <SketchText x={338} y={294} anchor="start" size={11} bold>
        Schema: audit
      </SketchText>
      <rect
        x={338}
        y={308}
        width={240}
        height={30}
        fill="var(--card)"
        stroke="currentColor"
        strokeOpacity={0.35}
      />
      <SketchText x={350} y={327} anchor="start" size={10.5}>
        Table: audit_log
      </SketchText>
      <SketchText x={338} y={366} anchor="start" size={9.5} body opacity={0.75}>
        কে কখন কী বদলালেন, তার হিসাব
      </SketchText>
      <SketchText x={338} y={386} anchor="start" size={9.5} body opacity={0.75}>
        App এর Table থেকে আলাদা রাখা
      </SketchText>

      {/* other databases */}
      {SIDE_DATABASES.map((db, i) => (
        <g key={db.name}>
          <Frame x={628} y={56 + i * 106} w={304} h={88} dashed={db.dashed} />
          <SketchText x={644} y={84 + i * 106} anchor="start" size={11.5} bold>
            {`Database: ${db.name}`}
          </SketchText>
          <SketchText x={644} y={110 + i * 106} anchor="start" size={10} body opacity={0.8}>
            {db.note}
          </SketchText>
          <SketchText x={644} y={130 + i * 106} anchor="start" size={9} opacity={0.6}>
            ভেতরে নিজের Schema, নিজের Table
          </SketchText>
        </g>
      ))}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা নাম খোঁজার পথ: search_path                                          */
/* ------------------------------------------------------------------------- */

type Stop = { label: string; note: string; state: "skip" | "found" | "unseen" };

const LOOKUPS: { path: string; stops: Stop[]; result: string }[] = [
  {
    path: 'search_path = "$user", public',
    stops: [
      { label: '"$user"', note: "postgres নামে Schema নেই, বাদ", state: "skip" },
      { label: "public", note: "tours আছে, এখানেই থামা", state: "found" },
    ],
    result: "public.tours, ৯টা Row",
  },
  {
    path: "search_path = analytics, public",
    stops: [
      { label: "analytics", note: "tours আছে, এখানেই থামা", state: "found" },
      { label: "public", note: "এখানে আর দেখাই হলো না", state: "unseen" },
    ],
    result: "analytics.tours, ১টা Row",
  },
];

export function NameLookupDiagram() {
  return (
    <Sketch
      label="SELECT * FROM tours: PostgreSQL tours খোঁজে কোথায়"
      height={300}
      minWidth={900}
      viewBox="0 0 900 300"
      caption="Schema এর নাম না লিখলে PostgreSQL search_path এর তালিকা ধরে বাম থেকে ডানে একটা একটা Schema এ খোঁজে, আর প্রথম যেখানে নামটা পায় সেখানেই থামে। তালিকার ক্রম বদলালে একই Query অন্য Table পড়ে, কোনো Error ছাড়াই। তাই ক্রমটা জানা জরুরি।"
    >
      <Arrow id="schemas-lookup-arrow" />
      <Arrow id="schemas-lookup-arrow-muted" muted />
      {LOOKUPS.map((row, r) => {
        const y = 40 + r * 130;
        return (
          <g key={row.path}>
            <SketchText x={14} y={y - 12} anchor="start" size={10.5} bold accent>
              {row.path}
            </SketchText>
            <rect
              x={14}
              y={y}
              width={170}
              height={56}
              fill="var(--card)"
              stroke="currentColor"
              strokeOpacity={0.5}
            />
            <SketchText x={99} y={y + 33} size={11}>
              FROM tours
            </SketchText>
            {row.stops.map((stop, i) => {
              const x = 240 + i * 230;
              const found = stop.state === "found";
              const unseen = stop.state === "unseen";
              return (
                <g key={stop.label} opacity={unseen ? 0.45 : 1}>
                  <line
                    x1={i === 0 ? 188 : x - 46}
                    y1={y + 28}
                    x2={x - 6}
                    y2={y + 28}
                    stroke={unseen ? "currentColor" : "var(--primary)"}
                    strokeOpacity={unseen ? 0.5 : 1}
                    strokeWidth="1.3"
                    strokeDasharray={unseen ? "4 3" : undefined}
                    markerEnd={
                      unseen ? "url(#schemas-lookup-arrow-muted)" : "url(#schemas-lookup-arrow)"
                    }
                  />
                  <rect
                    x={x}
                    y={y}
                    width={180}
                    height={56}
                    fill={found ? "var(--primary)" : "transparent"}
                    fillOpacity={found ? 0.1 : 0}
                    stroke={found ? "var(--primary)" : "currentColor"}
                    strokeOpacity={found ? 1 : 0.45}
                    strokeWidth="1.2"
                    strokeDasharray={stop.state === "skip" ? "4 3" : undefined}
                  />
                  <SketchText x={x + 90} y={y + 24} size={11} bold accent={found}>
                    {stop.label}
                  </SketchText>
                  <SketchText x={x + 90} y={y + 43} size={9.5} body opacity={0.85}>
                    {stop.note}
                  </SketchText>
                </g>
              );
            })}
            <SketchText x={720} y={y + 24} anchor="start" size={10} opacity={0.7}>
              ফলাফল
            </SketchText>
            <SketchText x={720} y={y + 43} anchor="start" size={11} bold accent>
              {row.result}
            </SketchText>
          </g>
        );
      })}
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. PostgreSQL এর চার স্তর বনাম MySQL এর তিন স্তর                             */
/* ------------------------------------------------------------------------- */

function LevelStack({
  levels,
  footer,
  markerId,
}: {
  levels: { name: string; sub: string; accent?: boolean }[];
  footer: string[];
  markerId: string;
}) {
  return (
    <g>
      <Arrow id={markerId} />
      {levels.map((level, i) => {
        const y = 12 + i * 62;
        return (
          <g key={level.name}>
            <rect
              x={20 + i * 14}
              y={y}
              width={320 - i * 28}
              height={44}
              fill={level.accent ? "var(--primary)" : "transparent"}
              fillOpacity={level.accent ? 0.1 : 0}
              stroke={level.accent ? "var(--primary)" : "currentColor"}
              strokeOpacity={level.accent ? 1 : 0.45}
              strokeWidth="1.2"
            />
            <SketchText x={180} y={y + 19} size={11} bold accent={level.accent}>
              {level.name}
            </SketchText>
            <SketchText x={180} y={y + 35} size={9.5} body opacity={0.8}>
              {level.sub}
            </SketchText>
            {i < levels.length - 1 && (
              <line
                x1={180}
                y1={y + 45}
                x2={180}
                y2={y + 60}
                stroke="var(--primary)"
                strokeWidth="1.2"
                markerEnd={`url(#${markerId})`}
              />
            )}
          </g>
        );
      })}
      {footer.map((line, i) => (
        <SketchText
          key={line}
          x={20}
          y={290 + i * 18}
          anchor="start"
          size={10}
          body={i > 0}
          bold={i === 0}
          accent={i === 0}
        >
          {line}
        </SketchText>
      ))}
    </g>
  );
}

export function PostgresMysqlLevelsSplit() {
  return (
    <SketchSplit
      label="একই শব্দ, আলাদা জিনিস: Database আর Schema"
      caption="PostgreSQL এ Database আর Schema দুটো আলাদা স্তর, আর একটা Connection একটাই Database দেখে। MySQL এ Schema শব্দটা Database এরই আরেক নাম, স্তর একটা কম, আর একই Server এর দুটো Database এর Table একটা Query তেই জোড়া যায়। MySQL এর কোনো ভিডিওতে Schema শুনলে PostgreSQL এর Database ভাবুন।"
      panels={[
        {
          title: "PostgreSQL",
          sub: "চার স্তর",
          viewBox: "0 0 360 340",
          height: 340,
          children: (
            <LevelStack
              markerId="schemas-pg-arrow"
              levels={[
                { name: "Server (Cluster)", sub: "একটা চালু Process, Port 5432" },
                { name: "Database", sub: "island_tours, Connect করার একক", accent: true },
                { name: "Schema", sub: "public, analytics, audit" },
                { name: "Table", sub: "tours, bookings" },
              ]}
              footer={[
                "নাম: schema.table",
                "অন্য Database এর Table: সরাসরি না",
                "এক Connection, এক Database",
              ]}
            />
          ),
        },
        {
          title: "MySQL",
          sub: "তিন স্তর",
          viewBox: "0 0 360 340",
          height: 340,
          children: (
            <LevelStack
              markerId="schemas-mysql-arrow"
              levels={[
                { name: "Server", sub: "একটা চালু Process, Port 3306" },
                { name: "Database = Schema", sub: "একই জিনিসের দুই নাম", accent: true },
                { name: "Table", sub: "tours, bookings" },
              ]}
              footer={[
                "নাম: database.table",
                "অন্য Database এর Table: একই Query তে চলে",
                "USE দিয়ে Database বদলানো যায়",
              ]}
            />
          ),
        },
      ]}
    />
  );
}
