import { Sketch, SketchSplit, SketchText } from "../../sketch";

/* ------------------------------------------------------------------------- */
/* Shared bits. Marker ids carry the lesson prefix and the diagram name, so   */
/* two diagrams on one page never share an id.                               */
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

function Box({
  x,
  y,
  w,
  h = 44,
  text,
  sub,
  accent,
  dashed,
  size = 10.5,
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
        y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
        size={size}
        bold
        accent={accent}
      >
        {text}
      </SketchText>
      {sub && (
        <SketchText x={x + w / 2} y={y + h / 2 + 13} size={9} body opacity={0.75}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. MySQL ইনস্টল করলে মেশিনে কী কী আসে                                     */
/* ------------------------------------------------------------------------- */

export function MysqlPartsDiagram() {
  return (
    <Sketch
      label="What an install puts on your machine"
      height={380}
      minWidth={880}
      viewBox="0 0 880 380"
      caption="MySQL ইনস্টল মানে একটা না, কয়েকটা জিনিস একসাথে আসা। মাঝখানে mysqld, আসল Server Process, যে Port 3306 এ অপেক্ষা করে আর Data Directory তে ফাইল লেখে। বাঁয়ে Client Program গুলো, যেগুলো দিয়ে আপনি তার সাথে কথা বলেন। নিচে Service, যে মেশিন চালু হলে mysqld কে চালু করে। আর ভেতরে প্রথম Account, root। PostgreSQL এর ছবিটা প্রায় হুবহু এক, শুধু নামগুলো আলাদা: postgres, psql, 5432।"
    >
      <Arrow id="install-mysql-parts-arrow" />
      <rect
        x={20}
        y={20}
        width={840}
        height={340}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeDasharray="5 4"
      />
      <SketchText x={40} y={42} anchor="start" size={10} bold opacity={0.7}>
        আপনার Laptop
      </SketchText>

      {/* clients */}
      <SketchText x={140} y={84} size={9.5} bold opacity={0.7}>
        Client Program
      </SketchText>
      <Box x={60} y={96} w={160} h={40} text="mysql" sub="প্রশ্ন পাঠানোর Terminal" />
      <Box x={60} y={150} w={160} h={40} text="mysqladmin" sub="চালু আছে কি, বন্ধ করা" />
      <Box x={60} y={204} w={160} h={40} text="mysqldump" sub="Backup নেওয়া" />

      {/* server */}
      <Box
        x={340}
        y={110}
        w={210}
        h={92}
        text="mysqld"
        sub="Server Process, সবসময় চালু"
        accent
        size={13}
      />
      <SketchText x={445} y={98} size={9.5} bold accent>
        Port 3306
      </SketchText>
      <line
        x1={222}
        y1={116}
        x2={336}
        y2={140}
        stroke="var(--primary)"
        strokeWidth="1.3"
        markerEnd="url(#install-mysql-parts-arrow)"
      />
      <line
        x1={222}
        y1={170}
        x2={336}
        y2={160}
        stroke="var(--primary)"
        strokeWidth="1.3"
        strokeOpacity={0.6}
        markerEnd="url(#install-mysql-parts-arrow)"
      />
      <line
        x1={222}
        y1={224}
        x2={336}
        y2={182}
        stroke="var(--primary)"
        strokeWidth="1.3"
        strokeOpacity={0.6}
        markerEnd="url(#install-mysql-parts-arrow)"
      />

      {/* data directory */}
      <Box x={640} y={86} w={190} h={52} text="Data Directory" sub="Table আর Row এর ফাইল" />
      <line
        x1={552}
        y1={140}
        x2={636}
        y2={116}
        stroke="var(--primary)"
        strokeWidth="1.3"
        markerEnd="url(#install-mysql-parts-arrow)"
      />
      <SketchText x={735} y={158} size={8.5} opacity={0.65}>
        Homebrew: /opt/homebrew/var/mysql
      </SketchText>
      <SketchText x={735} y={172} size={8.5} opacity={0.65}>
        Docker: /var/lib/mysql
      </SketchText>

      {/* root */}
      <Box x={640} y={196} w={190} h={52} text="root" sub="প্রথম Account, সব ক্ষমতা" />
      <line
        x1={552}
        y1={178}
        x2={636}
        y2={218}
        stroke="currentColor"
        strokeOpacity={0.45}
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />

      {/* service */}
      <Box
        x={300}
        y={268}
        w={290}
        h={58}
        text="Service"
        sub="মেশিন চালু হলে mysqld কে চালু করে"
        dashed
      />
      <line
        x1={445}
        y1={266}
        x2={445}
        y2={206}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth="1.2"
        markerEnd="url(#install-mysql-parts-arrow)"
      />
      <SketchText x={445} y={346} size={8.5} opacity={0.65}>
        macOS: brew services · Windows: MySQL84 · Ubuntu: mysql.service
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. একই Laptop এ দুই Server                                                 */
/* ------------------------------------------------------------------------- */

export function TwoServersDiagram() {
  return (
    <Sketch
      label="PostgreSQL and MySQL on one laptop"
      height={330}
      minWidth={860}
      viewBox="0 0 860 330"
      caption="দুটো Server একই মেশিনে একসাথে চলতে পারে, কারণ তারা আলাদা Port এ অপেক্ষা করে: PostgreSQL 5432, MySQL 3306। প্রত্যেকের নিজের Data Directory, নিজের Account আর নিজের Client। দুটোর ভেতরেই island_tours আছে, একই Row, তাই একই প্রশ্ন দুই জায়গায় চালিয়ে উত্তর মেলাতে পারবেন।"
    >
      <Arrow id="install-mysql-two-arrow" />
      <rect
        x={20}
        y={20}
        width={820}
        height={290}
        fill="transparent"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeDasharray="5 4"
      />
      <SketchText x={40} y={42} anchor="start" size={10} bold opacity={0.7}>
        আপনার Laptop
      </SketchText>

      {/* PostgreSQL row */}
      <Box x={60} y={70} w={150} h={50} text="psql" sub="PostgreSQL Client" />
      <line
        x1={212}
        y1={95}
        x2={346}
        y2={95}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#install-mysql-two-arrow)"
      />
      <SketchText x={279} y={86} size={9.5} bold accent>
        Port 5432
      </SketchText>
      <Box x={350} y={62} w={210} h={66} text="PostgreSQL 18" sub="এই ট্র্যাকের মূল Server" accent />
      <Box x={620} y={70} w={190} h={50} text="island_tours" sub="২৪টা Booking সহ" />
      <line x1={562} y1={95} x2={616} y2={95} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.2" />

      {/* MySQL row */}
      <Box x={60} y={196} w={150} h={50} text="mysql" sub="MySQL Client" />
      <line
        x1={212}
        y1={221}
        x2={346}
        y2={221}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#install-mysql-two-arrow)"
      />
      <SketchText x={279} y={212} size={9.5} bold accent>
        Port 3306
      </SketchText>
      <Box x={350} y={188} w={210} h={66} text="MySQL 8.4" sub="ভিডিও ফলো করার জন্য" />
      <Box x={620} y={196} w={190} h={50} text="island_tours" sub="একই Row, MySQL এর ভাষায়" />
      <line x1={562} y1={221} x2={616} y2={221} stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.2" />

      <SketchText x={455} y={160} size={9.5} body opacity={0.75}>
        আলাদা Port, তাই কেউ কারো জায়গা নেয় না
      </SketchText>
      <SketchText x={715} y={286} size={9} body opacity={0.7}>
        একই প্রশ্ন, দুই জায়গায় চালিয়ে মেলান
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. localhost বনাম 127.0.0.1                                                */
/* ------------------------------------------------------------------------- */

export function SocketVsTcpSplit() {
  return (
    <SketchSplit
      label="Two roads to the same server"
      caption="MySQL এর Client localhost নামটা দেখলে Network এ যায়ই না, মেশিনের ভেতরের একটা Socket ফাইল দিয়ে সরাসরি কথা বলে, আর তখন -P দিয়ে দেওয়া Port চুপচাপ উপেক্ষা করে। 127.0.0.1 লিখলে সে আসল TCP Connection খোলে আর Port মেনে চলে। Docker এর ভেতরের MySQL এর কাছে বাইরে থেকে যাওয়ার রাস্তা শুধু এই দ্বিতীয়টা।"
      panels={[
        {
          title: "-h localhost",
          sub: "Unix Socket ফাইল দিয়ে",
          viewBox: "0 0 380 230",
          height: 230,
          minWidth: 320,
          children: (
            <g>
              <Arrow id="install-mysql-socket-arrow" />
              <Box x={20} y={20} w={150} h={46} text="mysql" sub="-h localhost -P 9999" />
              <Box x={210} y={20} w={150} h={46} text="mysqld.sock" sub="মেশিনের ভেতরের ফাইল" accent />
              <line
                x1={172}
                y1={43}
                x2={206}
                y2={43}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#install-mysql-socket-arrow)"
              />
              <Box x={210} y={110} w={150} h={46} text="mysqld" sub="আসলে চলছে 3306 এ" />
              <line
                x1={285}
                y1={68}
                x2={285}
                y2={106}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#install-mysql-socket-arrow)"
              />
              <SketchText x={95} y={110} size={9.5} body opacity={0.8}>
                9999 লেখা হলো,
              </SketchText>
              <SketchText x={95} y={126} size={9.5} body opacity={0.8}>
                কিন্তু কেউ দেখলই না
              </SketchText>
              <SketchText x={190} y={200} size={9.5} body accent>
                Connect হয়ে যায়, Port উপেক্ষিত
              </SketchText>
            </g>
          ),
        },
        {
          title: "-h 127.0.0.1",
          sub: "TCP Connection দিয়ে",
          viewBox: "0 0 380 230",
          height: 230,
          minWidth: 320,
          children: (
            <g>
              <Arrow id="install-mysql-tcp-arrow" />
              <Box x={20} y={20} w={150} h={46} text="mysql" sub="-h 127.0.0.1 -P 3306" />
              <Box x={210} y={20} w={150} h={46} text="TCP :3306" sub="Network এর দরজা" accent />
              <line
                x1={172}
                y1={43}
                x2={206}
                y2={43}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#install-mysql-tcp-arrow)"
              />
              <Box x={210} y={110} w={150} h={46} text="mysqld" sub="Docker এর ভেতরেও পৌঁছায়" />
              <line
                x1={285}
                y1={68}
                x2={285}
                y2={106}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#install-mysql-tcp-arrow)"
              />
              <SketchText x={95} y={110} size={9.5} body opacity={0.8}>
                Port ভুল দিলে
              </SketchText>
              <SketchText x={95} y={126} size={9.5} body opacity={0.8}>
                সাথে সাথে ERROR 2003
              </SketchText>
              <SketchText x={190} y={200} size={9.5} body accent>
                যা লিখবেন, ঠিক সেখানেই যাবে
              </SketchText>
            </g>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 4. Inline REFERENCES এর ফাঁদ                                               */
/* ------------------------------------------------------------------------- */

export function InlineReferenceTrapDiagram() {
  return (
    <Sketch
      label="The same foreign key, written two ways, in MySQL 8.4"
      height={300}
      minWidth={880}
      viewBox="0 0 880 300"
      caption="উপরের লাইনটা PostgreSQL এ পুরোদস্তুর Foreign Key। MySQL একই লাইন পড়ে, কোনো Error দেয় না, কিন্তু নিয়মটা মনেও রাখে না। ফলে parent এ নেই এমন 999 নম্বরের Row চুপচাপ ঢুকে যায়। নিচের লেখাটায়, যেখানে FOREIGN KEY আলাদা লাইনে, MySQL নিয়মটা মানে আর ERROR 1452 দিয়ে ফিরিয়ে দেয়। দুটো ফলই এই লেসনের জন্য একটা MySQL 8.4 Container এ চালিয়ে দেখা।"
    >
      <Arrow id="install-mysql-trap-arrow" />
      <Arrow id="install-mysql-trap-arrow-muted" muted />

      {/* inline */}
      <SketchText x={30} y={36} anchor="start" size={10} bold opacity={0.75}>
        Column এর পাশে লেখা
      </SketchText>
      <rect x={30} y={48} width={360} height={56} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.45} />
      <SketchText x={44} y={72} anchor="start" size={10}>
        parent_id INT REFERENCES parent (id)
      </SketchText>
      <SketchText x={44} y={92} anchor="start" size={9} body opacity={0.7}>
        PostgreSQL এর ফাইলে ঠিক এভাবে লেখা
      </SketchText>
      <line
        x1={392}
        y1={76}
        x2={466}
        y2={76}
        stroke="currentColor"
        strokeOpacity={0.55}
        strokeWidth="1.3"
        markerEnd="url(#install-mysql-trap-arrow-muted)"
      />
      <Box x={470} y={52} w={170} h={48} text="গৃহীত, তারপর ভুলে যাওয়া" size={9.5} />
      <line
        x1={642}
        y1={76}
        x2={696}
        y2={76}
        stroke="currentColor"
        strokeOpacity={0.55}
        strokeWidth="1.3"
        markerEnd="url(#install-mysql-trap-arrow-muted)"
      />
      <Box x={700} y={52} w={150} h={48} text="999 ঢুকে গেল" sub="কোনো Error নেই" dashed />

      {/* table level */}
      <SketchText x={30} y={164} anchor="start" size={10} bold accent>
        আলাদা লাইনে লেখা
      </SketchText>
      <rect x={30} y={176} width={360} height={56} fill="var(--primary)" fillOpacity={0.06} stroke="var(--primary)" />
      <SketchText x={44} y={200} anchor="start" size={10}>
        FOREIGN KEY (parent_id) REFERENCES parent (id)
      </SketchText>
      <SketchText x={44} y={220} anchor="start" size={9} body opacity={0.7}>
        MySQL ফাইলে প্রতিটা Table এ এভাবে
      </SketchText>
      <line
        x1={392}
        y1={204}
        x2={466}
        y2={204}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#install-mysql-trap-arrow)"
      />
      <Box x={470} y={180} w={170} h={48} text="নিয়ম হিসেবে রাখা" accent size={10} />
      <line
        x1={642}
        y1={204}
        x2={696}
        y2={204}
        stroke="var(--primary)"
        strokeWidth="1.4"
        markerEnd="url(#install-mysql-trap-arrow)"
      />
      <Box x={700} y={180} w={150} h={48} text="ERROR 1452" sub="999 ফিরিয়ে দেওয়া" accent />

      <SketchText x={440} y={276} size={9.5} body opacity={0.8}>
        তাই MySQL ফাইলটা শুধু Type বদলানো কপি না, Foreign Key গুলো নতুন করে লেখা
      </SketchText>
    </Sketch>
  );
}
