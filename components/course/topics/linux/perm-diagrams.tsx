/**
 * What: The still diagrams for Module 07 Lesson 04, Permissions, Users and Groups. They show
 * how the kernel compares a process's identity with a file's label, how to read one line of
 * `ls -l`, how rwx turns into a number like 640, what r, w and x mean on a file against a
 * directory, the order in which the kernel picks owner, group or other, the walk down a path,
 * and what sudo does between typing a command and running it as root.
 *
 * Why: Permissions are a comparison between two small labels. Once a reader can see both labels
 * side by side, every "Permission denied" becomes a puzzle they can solve. Every marker id starts
 * with "perm-" so two diagrams on the same page never share an id.
 */
import { Sketch, SketchSplit, SketchText } from "../../sketch";

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
  h = 34,
  text,
  sub,
  accent,
  size = 10,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  sub?: string;
  accent?: boolean;
  size?: number;
  dashed?: boolean;
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
        <SketchText x={x + w / 2} y={y + h / 2 + 12} size={8.5} body opacity={0.75}>
          {sub}
        </SketchText>
      )}
    </g>
  );
}

/** A card with a title bar and a few mono lines, used for an ID card or a file label. */
function Card({
  x,
  y,
  w,
  title,
  lines,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  lines: string[];
  accent?: boolean;
}) {
  const h = 34 + lines.length * 20;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ? "var(--primary)" : "currentColor"}
        fillOpacity={accent ? 0.08 : 0.04}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 1 : 0.45}
        strokeWidth="1.3"
      />
      <line
        x1={x}
        y1={y + 26}
        x2={x + w}
        y2={y + 26}
        stroke={accent ? "var(--primary)" : "currentColor"}
        strokeOpacity={accent ? 0.6 : 0.3}
      />
      <SketchText x={x + 12} y={y + 17} size={9.5} bold anchor="start" accent={accent}>
        {title}
      </SketchText>
      {lines.map((line, i) => (
        <SketchText key={line} x={x + 12} y={y + 46 + i * 20} size={10} anchor="start">
          {line}
        </SketchText>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Process এর পরিচয়পত্র আর File এর লেবেল                                     */
/* ------------------------------------------------------------------------- */

export function PermIdentityDiagram() {
  return (
    <Sketch
      label="Diagram: Kernel দুইটা লেবেল মিলিয়ে দেখে"
      height={330}
      minWidth={860}
      viewBox="0 0 860 330"
      caption="Island Tours এর API একটা Process, আর সে চলছে islandtours নামের User হিসেবে। তাই তার পকেটে একটা পরিচয়পত্র আছে: UID 999, GID 996। api.env File টার গায়েও একটা লেবেল লাগানো: মালিক root, Group islandtours, আর নয়টা Bit। Process যখন File টা খুলতে চায়, Kernel এই দুইটা লেবেল পাশাপাশি রাখে। Process এর UID মালিকের সাথে মেলে না, কিন্তু Group মেলে। তাই Kernel শুধু Group এর তিনটা Bit দেখে: r আছে, w নেই। পড়া চলবে, লেখা চলবে না। Permission এর পুরো বিষয়টা এই একটা তুলনা।"
    >
      <Arrow id="perm-id-a" />
      <Arrow id="perm-id-m" muted />

      <Card
        x={20}
        y={60}
        w={250}
        title="PROCESS: node dist/main.js"
        lines={["UID  999  islandtours", "GID  996  islandtours", "Groups: islandtours"]}
        accent
      />
      <SketchText x={145} y={44} size={10} body opacity={0.8}>
        Process এর পরিচয়পত্র
      </SketchText>

      <Card
        x={590}
        y={60}
        w={250}
        title="FILE: /etc/islandtours/api.env"
        lines={["Owner  root  (UID 0)", "Group  islandtours (996)", "Mode   rw- r-- ---"]}
      />
      <SketchText x={715} y={44} size={10} body opacity={0.8}>
        File এর গায়ের লেবেল
      </SketchText>

      <Box x={345} y={88} w={170} h={60} text="KERNEL" sub="দুইটা লেবেল মেলায়" accent />

      <line x1={272} y1={118} x2={341} y2={118} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#perm-id-a)" />
      <line x1={588} y1={118} x2={519} y2={118} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.4" markerEnd="url(#perm-id-m)" />

      {/* the three questions */}
      <SketchText x={430} y={180} size={10} body>
        UID 999 কি Owner (0)? না
      </SketchText>
      <SketchText x={430} y={200} size={10} body>
        Group 996 কি Process এর Group এ আছে? হ্যাঁ
      </SketchText>
      <SketchText x={430} y={220} size={10} body accent bold>
        তাহলে শুধু Group এর Bit: r--
      </SketchText>

      <line x1={430} y1={232} x2={430} y2={252} stroke="var(--primary)" strokeWidth="1.4" markerEnd="url(#perm-id-a)" />

      <Box x={250} y={258} w={170} h={44} text="open, read" sub="অনুমতি আছে" accent />
      <Box x={440} y={258} w={170} h={44} text="open, write" sub="Permission denied" dashed />
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. ls -l এর একটা লাইন, টুকরো টুকরো করে                                         */
/* ------------------------------------------------------------------------- */

const LS_CELLS: { token: string; w: number; label: string; sub: string; accent?: boolean }[] = [
  { token: "-", w: 34, label: "ধরন", sub: "- মানে File" },
  { token: "rw-", w: 58, label: "Owner", sub: "মালিকের Bit", accent: true },
  { token: "r--", w: 58, label: "Group", sub: "Group এর Bit", accent: true },
  { token: "---", w: 58, label: "Other", sub: "বাকি সবার", accent: true },
  { token: "1", w: 34, label: "Link", sub: "কয়টা নাম" },
  { token: "root", w: 66, label: "Owner", sub: "মালিক" },
  { token: "islandtours", w: 128, label: "Group", sub: "যে Group" },
  { token: "52", w: 46, label: "Size", sub: "Byte" },
  { token: "Oct 31 07:25", w: 132, label: "mtime", sub: "শেষ বদল" },
  { token: "api.env", w: 98, label: "Name", sub: "নাম" },
];

/** Each cell's x, laid out left to right with an 8 unit gap, worked out once at load. */
const LS_LAYOUT = LS_CELLS.reduce<{ x: number; cells: ((typeof LS_CELLS)[number] & { x: number })[] }>(
  (acc, cell) => ({ x: acc.x + cell.w + 8, cells: [...acc.cells, { ...cell, x: acc.x }] }),
  { x: 38, cells: [] },
).cells;

export function PermLsAnatomyDiagram() {
  const cells = LS_LAYOUT;
  return (
    <Sketch
      label="Diagram: ls -l এর একটা লাইন, ঘর ধরে ধরে"
      height={250}
      minWidth={860}
      viewBox="0 0 860 250"
      caption="ls -l এর প্রতিটা লাইন দশটা ঘরে ভাগ করা। প্রথম অক্ষর বলে এটা কী (File, Directory, Link)। পরের নয়টা অক্ষর তিনটা দলে: মালিক, Group, আর বাকি সবাই। তারপর Link সংখ্যা, মালিকের নাম, Group এর নাম, আকার, শেষ বদলের সময়, আর নাম। Permission এর প্রশ্নে আপনার চোখ যাবে চারটা জায়গায়: নয়টা Bit, মালিক, Group, আর নাম। বাকিগুলো অন্য কাজের।"
    >
      <SketchText x={38} y={34} size={11} anchor="start" opacity={0.75}>
        deploy@island-vps-01:~$ ls -l /etc/islandtours
      </SketchText>
      {cells.map((cell) => (
        <g key={cell.token + cell.x}>
          <rect
            x={cell.x}
            y={60}
            width={cell.w}
            height={40}
            fill={cell.accent ? "var(--primary)" : "currentColor"}
            fillOpacity={cell.accent ? 0.1 : 0.04}
            stroke={cell.accent ? "var(--primary)" : "currentColor"}
            strokeOpacity={cell.accent ? 1 : 0.45}
            strokeWidth="1.3"
          />
          <SketchText x={cell.x + cell.w / 2} y={85} size={13} bold accent={cell.accent}>
            {cell.token}
          </SketchText>
          <line
            x1={cell.x + cell.w / 2}
            y1={104}
            x2={cell.x + cell.w / 2}
            y2={124}
            stroke="currentColor"
            strokeOpacity={0.4}
          />
          <SketchText x={cell.x + cell.w / 2} y={140} size={9.5} bold accent={cell.accent}>
            {cell.label}
          </SketchText>
          <SketchText x={cell.x + cell.w / 2} y={158} size={9} body opacity={0.75}>
            {cell.sub}
          </SketchText>
        </g>
      ))}

      {/* the nine bits bracket */}
      <path d="M80,196 L80,206 L270,206 L270,196" fill="none" stroke="var(--primary)" strokeWidth="1.3" />
      <SketchText x={175} y={226} size={10} body accent bold>
        এই নয়টা Bit ই Permission
      </SketchText>
      <path d="M320,196 L320,206 L522,206 L522,196" fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.3" />
      <SketchText x={421} y={226} size={10} body opacity={0.85}>
        কার জন্য Bit গুলো, সেটা এই দুই নাম
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. rwx থেকে 640                                                            */
/* ------------------------------------------------------------------------- */

const BIT_GROUPS = [
  { name: "Owner", bits: [true, true, false], sum: 6 },
  { name: "Group", bits: [true, false, false], sum: 4 },
  { name: "Other", bits: [false, false, false], sum: 0 },
];

export function PermBitsDiagram() {
  const letters = ["r", "w", "x"];
  const values = [4, 2, 1];
  return (
    <Sketch
      label="Diagram: rw-r----- কীভাবে 640 হয়"
      height={290}
      minWidth={860}
      viewBox="0 0 860 290"
      caption="প্রতিটা অক্ষরের একটা দাম আছে: r মানে 4, w মানে 2, x মানে 1। একটা দলের যে অক্ষরগুলো জ্বলে আছে, তাদের দাম যোগ করলেই সেই দলের অঙ্ক। মালিকের rw- মানে 4 যোগ 2, তাই 6। Group এর r-- মানে 4। বাকিদের --- মানে 0। তিনটা অঙ্ক পাশাপাশি বসালে 640। উল্টো দিকে পড়াও একই রকম সহজ: 7 মানে সব (4+2+1), 5 মানে পড়া আর চালানো (4+1), 6 মানে পড়া আর লেখা (4+2)।"
    >
      {BIT_GROUPS.map((group, gi) => {
        const gx = 40 + gi * 270;
        return (
          <g key={group.name}>
            <SketchText x={gx + 105} y={34} size={11} bold accent>
              {group.name}
            </SketchText>
            {letters.map((letter, li) => {
              const on = group.bits[li];
              const cx = gx + li * 74;
              return (
                <g key={letter}>
                  <rect
                    x={cx}
                    y={50}
                    width={62}
                    height={56}
                    fill={on ? "var(--primary)" : "currentColor"}
                    fillOpacity={on ? 0.14 : 0.03}
                    stroke={on ? "var(--primary)" : "currentColor"}
                    strokeOpacity={on ? 1 : 0.35}
                    strokeWidth="1.3"
                    strokeDasharray={on ? undefined : "4 3"}
                  />
                  <SketchText x={cx + 31} y={78} size={18} bold accent={on} opacity={on ? 1 : 0.4}>
                    {on ? letter : "-"}
                  </SketchText>
                  <SketchText x={cx + 31} y={98} size={9} opacity={on ? 0.9 : 0.4}>
                    {`= ${values[li]}`}
                  </SketchText>
                </g>
              );
            })}
            <SketchText x={gx + 105} y={136} size={10} opacity={0.8}>
              {group.bits
                .map((on, i) => (on ? String(values[i]) : "0"))
                .join(" + ")}
            </SketchText>
            <rect
              x={gx + 78}
              y={150}
              width={54}
              height={46}
              fill="var(--primary)"
              fillOpacity={0.1}
              stroke="var(--primary)"
              strokeWidth="1.4"
            />
            <SketchText x={gx + 105} y={181} size={22} bold accent>
              {String(group.sum)}
            </SketchText>
          </g>
        );
      })}
      <line x1={40} y1={222} x2={820} y2={222} stroke="currentColor" strokeOpacity={0.2} />
      <SketchText x={430} y={252} size={13} bold>
        rw- r-- ---   =   6 4 0   =   chmod 640 api.env
      </SketchText>
      <SketchText x={430} y={274} size={9.5} body opacity={0.75}>
        মালিক পড়ে আর লেখে, Group শুধু পড়ে, বাকিরা কিছুই না
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. File এ rwx আর Directory তে rwx                                            */
/* ------------------------------------------------------------------------- */

function MeaningRows({ rows }: { rows: { bit: string; text: string; sub: string }[] }) {
  return (
    <>
      {rows.map((row, i) => (
        <g key={row.bit}>
          <rect
            x={10}
            y={14 + i * 70}
            width={48}
            height={52}
            fill="var(--primary)"
            fillOpacity={0.1}
            stroke="var(--primary)"
            strokeWidth="1.3"
          />
          <SketchText x={34} y={47 + i * 70} size={18} bold accent>
            {row.bit}
          </SketchText>
          <SketchText x={74} y={36 + i * 70} size={11} body bold anchor="start">
            {row.text}
          </SketchText>
          <SketchText x={74} y={56 + i * 70} size={9.5} anchor="start" opacity={0.7}>
            {row.sub}
          </SketchText>
        </g>
      ))}
    </>
  );
}

export function PermFileVsDirSplit() {
  return (
    <SketchSplit
      label="Diagram: একই তিন অক্ষর, File আর Directory তে আলাদা মানে"
      caption="একটা Directory আসলে একটা তালিকা: কোন নামের পেছনে কোন File। তাই Directory তে r মানে সেই তালিকার নামগুলো পড়া, w মানে তালিকায় নাম যোগ করা, মোছা বা বদলানো, আর x মানে তালিকা ধরে ভেতরের কোনো File পর্যন্ত যাওয়া। এখান থেকেই দুইটা চমক আসে। প্রথমত, x ছাড়া r দিয়ে আপনি নাম দেখবেন কিন্তু কিছু খুলতে পারবেন না। দ্বিতীয়ত, কোনো File মুছতে সেই File এর w লাগে না, লাগে তার Directory র w।"
      panels={[
        {
          title: "FILE",
          sub: "যেমন api.env, main.js",
          viewBox: "0 0 400 222",
          height: 222,
          minWidth: 340,
          children: (
            <MeaningRows
              rows={[
                { bit: "r", text: "ভেতরের লেখা পড়া", sub: "cat, less, open for read" },
                { bit: "w", text: "ভেতরের লেখা বদলানো", sub: "echo >>, nano, open for write" },
                { bit: "x", text: "Program হিসেবে চালানো", sub: "./deploy.sh" },
              ]}
            />
          ),
        },
        {
          title: "DIRECTORY",
          sub: "যেমন /srv/islandtours",
          viewBox: "0 0 400 222",
          height: 222,
          minWidth: 340,
          children: (
            <MeaningRows
              rows={[
                { bit: "r", text: "ভেতরের নামগুলোর তালিকা দেখা", sub: "ls" },
                { bit: "w", text: "নাম যোগ, মোছা, বদলানো", sub: "touch, rm, mv  (x ও লাগে)" },
                { bit: "x", text: "ভেতরে ঢোকা, পথ পার হওয়া", sub: "cd, ভেতরের File খোলা" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 5. Kernel কোন দলের Bit দেখবে, সেই ক্রম                                       */
/* ------------------------------------------------------------------------- */

export function PermCheckOrderDiagram() {
  const questions = [
    { x: 30, q: "UID কি 0?", yes: "root", yesSub: "সাধারণ Bit দেখাই হয় না" },
    { x: 240, q: "UID কি Owner?", yes: "Owner এর Bit", yesSub: "শুধু এই তিনটা" },
    { x: 450, q: "Group মেলে?", yes: "Group এর Bit", yesSub: "শুধু এই তিনটা" },
  ];
  return (
    <Sketch
      label="Diagram: Kernel কোন তিনটা Bit দেখবে, সেই ক্রম"
      height={300}
      minWidth={860}
      viewBox="0 0 860 300"
      caption="Kernel বাম থেকে ডানে একটা একটা প্রশ্ন করে, আর যে প্রশ্নে প্রথম হ্যাঁ আসে, সেখানেই থেমে যায়। এর একটা অদ্ভুত ফল আছে। মালিকের Bit যদি Group বা Other এর চেয়ে কম হয়, মালিক কম অধিকারই পাবেন, কারণ Kernel মালিককে চিনে ফেলার পর আর পরের দলগুলো দেখে না। ----rwxrwx Mode এর File এর মালিক নিজেই সেটা পড়তে পারেন না, অথচ অন্য সবাই পারেন। এই লেসনের Lab এ সেটা নিজের চোখে দেখবেন। ACL থাকলে Owner আর Group এর মাঝে আরেকটা প্রশ্ন ঢোকে, সেটা লেসনের শেষের দিকে।"
    >
      <Arrow id="perm-ord-a" />
      <Arrow id="perm-ord-m" muted />

      {questions.map((item, i) => (
        <g key={item.q}>
          <Box x={item.x} y={50} w={170} h={50} text={item.q} />
          <line
            x1={item.x + 85}
            y1={100}
            x2={item.x + 85}
            y2={164}
            stroke="var(--primary)"
            strokeWidth="1.4"
            markerEnd="url(#perm-ord-a)"
          />
          <SketchText x={item.x + 97} y={136} size={9.5} body accent anchor="start">
            হ্যাঁ
          </SketchText>
          <Box x={item.x} y={168} w={170} h={50} text={item.yes} sub={item.yesSub} accent />
          {i < questions.length - 1 && (
            <>
              <line
                x1={item.x + 170}
                y1={75}
                x2={item.x + 206}
                y2={75}
                stroke="currentColor"
                strokeOpacity={0.55}
                strokeWidth="1.4"
                markerEnd="url(#perm-ord-m)"
              />
              <SketchText x={item.x + 188} y={66} size={9.5} body opacity={0.8}>
                না
              </SketchText>
            </>
          )}
        </g>
      ))}

      <line x1={620} y1={75} x2={656} y2={75} stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.4" markerEnd="url(#perm-ord-m)" />
      <SketchText x={638} y={66} size={9.5} body opacity={0.8}>
        না
      </SketchText>
      <Box x={660} y={50} w={170} h={50} text="Other এর Bit" sub="বাকি সবার জন্য" accent />

      <SketchText x={430} y={262} size={10.5} body bold>
        প্রথম যেখানে হ্যাঁ, সেখানেই সিদ্ধান্ত। পরের দলের দিকে আর তাকায় না।
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 6. পথের প্রতিটা Directory তে x লাগে                                          */
/* ------------------------------------------------------------------------- */

const WALK = [
  { name: "/", mode: "drwxr-xr-x root root", ok: true },
  { name: "srv", mode: "drwxr-xr-x root root", ok: true },
  { name: "islandtours", mode: "drwxr-x--- deploy islandtours", ok: false },
  { name: "current/public", mode: "drwxr-s--- deploy islandtours", skipped: true },
  { name: "index.html", mode: "-rw-r----- deploy islandtours", skipped: true },
];

export function PermPathWalkDiagram() {
  return (
    <Sketch
      label="Diagram: caddy একটা পথ ধরে হাঁটছে, তৃতীয় দরজায় আটকে গেল"
      height={300}
      minWidth={880}
      viewBox="0 0 880 300"
      caption="Process যখন /srv/islandtours/current/public/index.html খুলতে চায়, Kernel পথটাকে বাম থেকে ডানে একটা একটা Directory ধরে হাঁটে, আর প্রতিটায় জিজ্ঞেস করে: এই Process কি এখানে x পায়? caddy User / আর srv পার হলো, কারণ সেখানে Other এর x আছে। islandtours Directory তে caddy মালিকও না, Group এও নেই, তাই Other, আর Other এর জন্য সেখানে কিছুই নেই। হাঁটা এখানেই শেষ। index.html এর নিজের Bit কী, সেটা Kernel দেখেই না। namei -l ঠিক এই হাঁটাটাই আপনাকে লাইন ধরে দেখায়।"
    >
      <Arrow id="perm-walk-a" />
      <Arrow id="perm-walk-m" muted />
      <SketchText x={20} y={30} size={10.5} anchor="start" opacity={0.8}>
        caddy চায়: open(&quot;/srv/islandtours/current/public/index.html&quot;, read)
      </SketchText>

      {WALK.map((step, i) => {
        const x = 20 + i * 172;
        const w = 152;
        const color = step.ok ? "var(--primary)" : "currentColor";
        return (
          <g key={step.name}>
            <rect
              x={x}
              y={60}
              width={w}
              height={80}
              fill={step.ok ? "var(--primary)" : "currentColor"}
              fillOpacity={step.ok ? 0.1 : step.skipped ? 0.02 : 0.08}
              stroke={color}
              strokeOpacity={step.ok ? 1 : step.skipped ? 0.3 : 0.8}
              strokeWidth={step.ok || step.skipped ? 1.3 : 2}
              strokeDasharray={step.skipped ? "4 3" : undefined}
            />
            <SketchText x={x + w / 2} y={86} size={12} bold accent={step.ok} opacity={step.skipped ? 0.45 : 1}>
              {step.name}
            </SketchText>
            <SketchText x={x + w / 2} y={108} size={9} opacity={step.skipped ? 0.4 : 0.75}>
              {step.mode.split(" ")[0]}
            </SketchText>
            <SketchText x={x + w / 2} y={124} size={9} opacity={step.skipped ? 0.4 : 0.75}>
              {step.mode.split(" ").slice(1).join(" ")}
            </SketchText>
            {i < WALK.length - 1 && (
              <line
                x1={x + w + 2}
                y1={99}
                x2={x + 168}
                y2={99}
                stroke={step.ok ? "var(--primary)" : "currentColor"}
                strokeOpacity={step.ok ? 1 : 0.3}
                strokeWidth="1.4"
                strokeDasharray={step.ok ? undefined : "4 3"}
                markerEnd={step.ok ? "url(#perm-walk-a)" : "url(#perm-walk-m)"}
              />
            )}
            <SketchText x={x + w / 2} y={164} size={10} body bold accent={step.ok} opacity={step.skipped ? 0.5 : 1}>
              {step.skipped ? "দেখাই হয়নি" : step.ok ? "Other x আছে, পার" : "Other এর ---, এখানেই শেষ"}
            </SketchText>
          </g>
        );
      })}

      <rect x={20} y={200} width={840} height={64} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.3} />
      <SketchText x={440} y={226} size={11} bold>
        cat: /srv/islandtours/current/public/index.html: Permission denied
      </SketchText>
      <SketchText x={440} y={248} size={9.5} body opacity={0.8}>
        Error টা File এর নাম বলে, কিন্তু আটকেছে পথের অনেক আগের একটা Directory তে
      </SketchText>
    </Sketch>
  );
}

/* ------------------------------------------------------------------------- */
/* 7. sudo, টাইপ করা থেকে root হিসেবে চলা পর্যন্ত                                  */
/* ------------------------------------------------------------------------- */

export function PermSudoFlowDiagram() {
  const steps = [
    { text: "deploy টাইপ করেন", sub: "sudo systemctl reload caddy" },
    { text: "sudo চালু হয় root হয়ে", sub: "setuid Bit এর জোরে" },
    { text: "sudoers পড়ে", sub: "/etc/sudoers আর sudoers.d" },
    { text: "নিয়ম মেলে? Password?", sub: "না মিললে এখানেই শেষ" },
    { text: "Command চলে root হয়ে", sub: "শুধু এই একটা Command" },
  ];
  return (
    <Sketch
      label="Diagram: sudo এর ভেতরে পাঁচটা ধাপ"
      height={250}
      minWidth={900}
      viewBox="0 0 900 250"
      caption="sudo নিজেও একটা সাধারণ Program, কিন্তু তার File এ setuid Bit বসানো, তাই যে-ই চালান, sudo চলে root হয়ে। চালু হয়েই সে নিজের নিয়মের খাতা খোলে, /etc/sudoers আর /etc/sudoers.d এর File গুলো। দেখে এই User কি এই Command টা চালাতে পারেন, আর তার আগে নিজের Password দিতে হবে কি না। নিয়ম মিললে শুধু সেই একটা Command root হয়ে চলে, তারপর আবার আপনি সাধারণ deploy। প্রতিটা চেষ্টা, সফল হোক বা না হোক, Journal এ একটা লাইন হয়ে থাকে।"
    >
      <Arrow id="perm-sudo-a" />
      {steps.map((step, i) => {
        const x = 16 + i * 176;
        return (
          <g key={step.text}>
            <Box x={x} y={60} w={156} h={62} text={step.text} sub={step.sub} accent={i === 0 || i === 4} size={9.5} />
            {i < steps.length - 1 && (
              <line
                x1={x + 158}
                y1={91}
                x2={x + 172}
                y2={91}
                stroke="var(--primary)"
                strokeWidth="1.4"
                markerEnd="url(#perm-sudo-a)"
              />
            )}
          </g>
        );
      })}
      <line x1={94} y1={124} x2={94} y2={168} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3 3" />
      <line x1={94} y1={168} x2={798} y2={168} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3 3" />
      <line x1={798} y1={124} x2={798} y2={168} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="3 3" />
      <rect x={150} y={180} width={600} height={44} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.35} />
      <SketchText x={450} y={199} size={9} bold>
        sudo[537]: deploy : PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/systemctl reload caddy
      </SketchText>
      <SketchText x={450} y={216} size={9} body opacity={0.75}>
        প্রতিটা চেষ্টার একটা লাইন Journal এ থাকে, কে, কখন, কী চালালেন
      </SketchText>
    </Sketch>
  );
}
