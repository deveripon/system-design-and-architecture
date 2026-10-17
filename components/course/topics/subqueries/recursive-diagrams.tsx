import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. WITH RECURSIVE এর গঠন: শুরুর অংশ, পুনরাবৃত্তির অংশ, আর শেষের SELECT      */
/* ------------------------------------------------------------------------- */

/** The three parts of a recursive CTE, with the self reference drawn as a loop back to the CTE's own name. */
export function RecursiveAnatomyDiagram() {
    return (
        <Sketch
            label='WITH RECURSIVE এর তিনটা অংশ'
            height={330}
            minWidth={860}
            viewBox='0 0 860 330'
            caption={
                <>
                    উপরের অংশটা Anchor, শুরুর Row গুলো দেয়, আর চলে একবার। নিচের অংশটা Recursive Member, যে নিজের নামটাই
                    (এখানে n) FROM এ পড়ে, আর প্রতিবার আগের বারের নতুন Row গুলো থেকে পরের Row বানায়। বাঁকা তীরটা সেই
                    নিজেকে পড়া। মাঝের UNION ALL দুই অংশকে জোড়ে। শেষের SELECT পুরো জমানো ফলটা পড়ে, যেন n একটা সাধারণ
                    Table।
                </>
            }>
            <defs>
                <marker
                    id='recursive-anatomy-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            <SketchText x={40} y={40} anchor='start' size={12} bold>
                WITH RECURSIVE n(x) AS (
            </SketchText>

            <rect x={70} y={58} width={360} height={58} fill='currentColor' fillOpacity={0.05} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            <SketchText x={88} y={92} anchor='start' size={11.5}>
                SELECT 1
            </SketchText>
            <SketchText x={450} y={80} anchor='start' size={10} bold>
                Anchor: শুরুর Row
            </SketchText>
            <SketchText x={450} y={100} anchor='start' size={10} body opacity={0.75}>
                একবারই চলে, নিজের নাম পড়ে না
            </SketchText>

            <SketchText x={88} y={142} anchor='start' size={11.5} bold accent>
                UNION ALL
            </SketchText>
            <SketchText x={450} y={142} anchor='start' size={10} body opacity={0.75}>
                দুই অংশের Row একসাথে জমা হয়
            </SketchText>

            <rect x={70} y={158} width={360} height={84} fill='var(--primary)' fillOpacity={0.07} stroke='var(--primary)' strokeOpacity={0.8} strokeWidth='1.2' />
            <SketchText x={88} y={186} anchor='start' size={11.5}>
                SELECT x + 1
            </SketchText>
            <SketchText x={88} y={206} anchor='start' size={11.5} accent>
                FROM n
            </SketchText>
            <SketchText x={88} y={226} anchor='start' size={11.5}>
                WHERE x {'<'} 5
            </SketchText>
            <SketchText x={450} y={186} anchor='start' size={10} bold accent>
                Recursive Member: পরের Row
            </SketchText>
            <SketchText x={450} y={206} anchor='start' size={10} body opacity={0.75}>
                FROM n মানে আগের বারের নতুন Row গুলো
            </SketchText>
            <SketchText x={450} y={226} anchor='start' size={10} body opacity={0.75}>
                WHERE ঠিক করে কখন আর নতুন Row আসবে না
            </SketchText>

            <path
                d='M 70 206 C 26 206, 26 40, 168 40'
                fill='none'
                stroke='var(--primary)'
                strokeWidth='1.3'
                strokeDasharray='5 4'
                markerEnd='url(#recursive-anatomy-arrow)'
            />
            <SketchText x={22} y={124} size={9.5} body accent>
                নিজেকে
            </SketchText>
            <SketchText x={22} y={138} size={9.5} body accent>
                পড়ে
            </SketchText>

            <SketchText x={40} y={272} anchor='start' size={12} bold>
                )
            </SketchText>
            <SketchText x={40} y={302} anchor='start' size={12} bold>
                SELECT x FROM n;
            </SketchText>
            <SketchText x={450} y={292} anchor='start' size={10} bold>
                শেষের SELECT
            </SketchText>
            <SketchText x={450} y={312} anchor='start' size={10} body opacity={0.75}>
                সব বারের জমানো ফল পড়ে: 1, 2, 3, 4, 5
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. প্রতিটা বারে নতুন Row: Working Table আর জমানো ফল                         */
/* ------------------------------------------------------------------------- */

const ROUNDS = [
    { round: '০', label: 'Anchor', rows: ['Bangladesh'], total: 1 },
    { round: '১', label: 'বিভাগ', rows: ['Chattogram Div.', 'Khulna Div.', 'Sylhet Div.', 'Barishal Div.'], total: 5 },
    {
        round: '২',
        label: 'এক ধাপ নিচে',
        rows: ["Cox's Bazar Dist.", 'Rangamati Dist.', 'Bandarban Dist.', 'Sundarbans', 'Sylhet Dist.', 'Patuakhali Dist.'],
        total: 11,
    },
    {
        round: '৩',
        label: 'আরও এক ধাপ',
        rows: ["Saint Martin's Isl.", "Cox's Bazar", 'Sajek Valley', 'Bandarban', 'Sylhet', 'Kuakata'],
        total: 17,
    },
    { round: '৪', label: 'খালি', rows: [], total: 17 },
];

/** The places tree walked round by round: each round's new rows, the running total, and the empty round that stops it. */
export function IterationRoundsDiagram() {
    const colW = 172;
    return (
        <Sketch
            label='প্রতিটা বারে শুধু আগের বারের নতুন Row থেকে খোঁজ'
            height={380}
            minWidth={900}
            viewBox='0 0 900 380'
            caption={
                <>
                    এটা এই লেসনের জায়গার Tree, বাস্তবে যেভাবে চলে। বার ০ তে Anchor দেয় শুধু Bangladesh। বার ১ এ
                    Recursive Member শুধু Bangladesh এর সন্তানদের খোঁজে, চারটা বিভাগ। বার ২ তে শুধু সেই চারটার সন্তান, ছয়টা।
                    বার ৩ এ আবার ছয়টা। বার ৪ এ কেউ কারো সন্তান না, Working Table খালি, তাই PostgreSQL থামে। নিচের সংখ্যা
                    জমানো ফল: 1, 5, 11, 17।
                </>
            }>
            {ROUNDS.map((r, i) => {
                const x = 14 + i * colW;
                const empty = r.rows.length === 0;
                return (
                    <g key={r.round}>
                        <SketchText x={x + colW / 2 - 8} y={30} size={11} bold accent={!empty}>
                            {`বার ${r.round}`}
                        </SketchText>
                        <SketchText x={x + colW / 2 - 8} y={48} size={9.5} body opacity={0.7}>
                            {r.label}
                        </SketchText>
                        <rect
                            x={x}
                            y={60}
                            width={colW - 16}
                            height={232}
                            fill={empty ? 'transparent' : 'var(--primary)'}
                            fillOpacity={empty ? 0 : 0.05}
                            stroke={empty ? 'currentColor' : 'var(--primary)'}
                            strokeOpacity={empty ? 0.4 : 0.6}
                            strokeDasharray={empty ? '5 4' : undefined}
                            strokeWidth='1.2'
                        />
                        {r.rows.map((name, j) => (
                            <SketchText key={name} x={x + 10} y={86 + j * 34} anchor='start' size={9.5}>
                                {name}
                            </SketchText>
                        ))}
                        {empty && (
                            <>
                                <SketchText x={x + (colW - 16) / 2} y={170} size={10.5} bold>
                                    কোনো নতুন Row নেই
                                </SketchText>
                                <SketchText x={x + (colW - 16) / 2} y={190} size={9.5} body opacity={0.75}>
                                    তাই এখানেই থামা
                                </SketchText>
                            </>
                        )}
                        <SketchText x={x + (colW - 16) / 2} y={318} size={9.5} body opacity={0.75}>
                            {`নতুন Row: ${r.rows.length}`}
                        </SketchText>
                        <SketchText x={x + (colW - 16) / 2} y={344} size={11} bold accent={!empty}>
                            {`জমানো: ${r.total}`}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. VALUES দিয়ে বানানো জায়গার Tree                                          */
/* ------------------------------------------------------------------------- */

type TreeNode = { id: number; name: string; kind: string; parent: number | null; x: number; level: number };

/** Leaves sit in seven columns; every parent sits above the middle of its children. */
const COL = (i: number) => 74 + i * 136;
const NODES: TreeNode[] = [
    { id: 1, name: 'Bangladesh', kind: 'country', parent: null, x: (COL(0) + COL(6)) / 2, level: 0 },
    { id: 2, name: 'Chattogram Division', kind: 'division', parent: 1, x: (COL(0) + COL(3)) / 2, level: 1 },
    { id: 3, name: 'Khulna Division', kind: 'division', parent: 1, x: COL(4), level: 1 },
    { id: 4, name: 'Sylhet Division', kind: 'division', parent: 1, x: COL(5), level: 1 },
    { id: 5, name: 'Barishal Division', kind: 'division', parent: 1, x: COL(6), level: 1 },
    { id: 6, name: "Cox's Bazar District", kind: 'district', parent: 2, x: (COL(0) + COL(1)) / 2, level: 2 },
    { id: 7, name: 'Rangamati District', kind: 'district', parent: 2, x: COL(2), level: 2 },
    { id: 8, name: 'Bandarban District', kind: 'district', parent: 2, x: COL(3), level: 2 },
    { id: 15, name: 'Sundarbans', kind: 'place', parent: 3, x: COL(4), level: 2 },
    { id: 9, name: 'Sylhet District', kind: 'district', parent: 4, x: COL(5), level: 2 },
    { id: 10, name: 'Patuakhali District', kind: 'district', parent: 5, x: COL(6), level: 2 },
    { id: 11, name: "Saint Martin's Island", kind: 'place', parent: 6, x: COL(0), level: 3 },
    { id: 12, name: "Cox's Bazar", kind: 'place', parent: 6, x: COL(1), level: 3 },
    { id: 13, name: 'Sajek Valley', kind: 'place', parent: 7, x: COL(2), level: 3 },
    { id: 14, name: 'Bandarban', kind: 'place', parent: 8, x: COL(3), level: 3 },
    { id: 16, name: 'Sylhet', kind: 'place', parent: 9, x: COL(5), level: 3 },
    { id: 17, name: 'Kuakata', kind: 'place', parent: 10, x: COL(6), level: 3 },
];

const LEVEL_Y = [40, 130, 220, 310];
const BOX_W = 128;
const BOX_H = 40;

/** The 17-node places tree that the lesson builds with VALUES: country, division, district, place. */
export function PlacesTreeDiagram() {
    const byId = new Map(NODES.map(n => [n.id, n]));
    return (
        <Sketch
            label='জায়গার Tree: দেশ, বিভাগ, জেলা, জায়গা'
            height={380}
            minWidth={980}
            viewBox='0 0 980 380'
            caption={
                <>
                    Sample Database এ এমন কোনো Table নেই, তাই লেসনটা এই Tree টা VALUES দিয়ে Query এর ভেতরেই বানায়।
                    প্রতিটা ঘরের parent_id উপরের ঘরের place_id। নিচের সারির সাতটা জায়গা হুবহু destinations Table এর সাতটা
                    নাম, তাই Tree থেকে Booking পর্যন্ত Join করা যায়। Sundarbans কয়েকটা জেলা জুড়ে ছড়ানো বন, তাই এখানে সে
                    সরাসরি Khulna Division এর নিচে: একটা Tree এর সব পাতা একই গভীরতায় থাকতে হয় না।
                </>
            }>
            {NODES.filter(n => n.parent !== null).map(n => {
                const p = byId.get(n.parent as number)!;
                return (
                    <path
                        key={`edge-${n.id}`}
                        d={`M ${p.x} ${LEVEL_Y[p.level] + BOX_H} V ${(LEVEL_Y[p.level] + BOX_H + LEVEL_Y[n.level]) / 2} H ${n.x} V ${LEVEL_Y[n.level]}`}
                        fill='none'
                        stroke='currentColor'
                        strokeOpacity={0.45}
                        strokeWidth='1.1'
                    />
                );
            })}
            {NODES.map(n => {
                const leaf = n.kind === 'place';
                return (
                    <g key={n.id}>
                        <rect
                            x={n.x - BOX_W / 2}
                            y={LEVEL_Y[n.level]}
                            width={BOX_W}
                            height={BOX_H}
                            fill={leaf ? 'var(--primary)' : 'var(--card)'}
                            fillOpacity={leaf ? 0.1 : 1}
                            stroke={leaf ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={leaf ? 0.8 : 0.45}
                            strokeWidth='1.2'
                        />
                        <SketchText x={n.x} y={LEVEL_Y[n.level] + 17} size={9.5} body bold accent={leaf}>
                            {n.name}
                        </SketchText>
                        <SketchText x={n.x} y={LEVEL_Y[n.level] + 32} size={8.5} opacity={0.65}>
                            {`${n.id} · ${n.kind}`}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={20} y={364} anchor='start' size={9} body opacity={0.7}>
                প্রতিটা ঘরে: নাম, তারপর place_id আর kind। রঙিন ঘরগুলো kind = place, destinations এর সাতটা জায়গা।
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. যাতায়াতের পথ: একটা Graph, যেখানে চক্র আছে                                */
/* ------------------------------------------------------------------------- */

const STOPS: Record<string, { x: number; y: number }> = {
    Dhaka: { x: 150, y: 170 },
    Sylhet: { x: 150, y: 50 },
    Khulna: { x: 150, y: 290 },
    Sundarbans: { x: 150, y: 380 },
    Kuakata: { x: 330, y: 380 },
    Chattogram: { x: 420, y: 170 },
    Bandarban: { x: 420, y: 50 },
    Rangamati: { x: 640, y: 50 },
    'Sajek Valley': { x: 840, y: 50 },
    "Cox's Bazar": { x: 640, y: 250 },
    Teknaf: { x: 840, y: 250 },
    "Saint Martin's Island": { x: 840, y: 370 },
};

const LEGS: [string, string, boolean][] = [
    ['Dhaka', 'Sylhet', false],
    ['Dhaka', 'Khulna', false],
    ['Khulna', 'Sundarbans', false],
    ['Dhaka', 'Kuakata', false],
    ['Dhaka', 'Chattogram', true],
    ['Chattogram', 'Bandarban', false],
    ['Chattogram', 'Rangamati', false],
    ['Rangamati', 'Sajek Valley', false],
    ['Chattogram', "Cox's Bazar", true],
    ["Cox's Bazar", 'Teknaf', false],
    ['Teknaf', "Saint Martin's Island", true],
];

/** The made-up transfer map: one-way legs in grey, the three two-way legs that make cycles in the accent colour. */
export function RouteGraphDiagram() {
    return (
        <Sketch
            label='যাতায়াতের নকশা: কিছু পথ দুই দিকেই'
            height={430}
            minWidth={960}
            viewBox='0 0 960 430'
            caption={
                <>
                    এই নকশাটা বানানো, শেখার জন্য সহজ করা, আসল বাস বা জাহাজের সময়সূচি না। ধূসর তীর এক দিকের পথ। রঙিন
                    দুই মাথার তীর মানে দুই দিকেই যাওয়া যায়: Dhaka আর Chattogram, Chattogram আর Cox&apos;s Bazar, Teknaf আর
                    Saint Martin&apos;s Island। এই তিনটাই চক্র বানায়: Teknaf থেকে Saint Martin, সেখান থেকে আবার Teknaf, তারপর
                    আবার Saint Martin, শেষ নেই। Tree তে এমন হয় না, Graph এ হয়।
                </>
            }>
            <defs>
                <marker id='recursive-leg-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='currentColor' fillOpacity={0.6} />
                </marker>
                <marker id='recursive-cycle-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto-start-reverse' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {LEGS.map(([from, to, both]) => {
                const a = STOPS[from];
                const b = STOPS[to];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const len = Math.hypot(dx, dy);
                const pad = 30;
                const x1 = a.x + (dx / len) * pad;
                const y1 = a.y + (dy / len) * pad;
                const x2 = b.x - (dx / len) * pad;
                const y2 = b.y - (dy / len) * pad;
                return (
                    <line
                        key={`${from}-${to}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={both ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={both ? 0.9 : 0.5}
                        strokeWidth={both ? 1.6 : 1.2}
                        markerEnd={both ? 'url(#recursive-cycle-arrow)' : 'url(#recursive-leg-arrow)'}
                        markerStart={both ? 'url(#recursive-cycle-arrow)' : undefined}
                    />
                );
            })}
            {Object.entries(STOPS).map(([name, p]) => (
                <g key={name}>
                    <rect
                        x={p.x - 72}
                        y={p.y - 15}
                        width={144}
                        height={30}
                        fill={name === 'Dhaka' ? 'var(--primary)' : 'var(--card)'}
                        fillOpacity={name === 'Dhaka' ? 0.12 : 1}
                        stroke={name === 'Dhaka' ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={name === 'Dhaka' ? 0.9 : 0.45}
                        strokeWidth='1.2'
                    />
                    <SketchText x={p.x} y={p.y + 4} size={10} body bold accent={name === 'Dhaka'}>
                        {name}
                    </SketchText>
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. UNION বনাম UNION ALL: পুরনো Row আবার এলে কী হয়                            */
/* ------------------------------------------------------------------------- */

/** n % 3 + 1 walks 1, 2, 3, 1 ...: UNION drops the repeated 1 and stops, UNION ALL keeps it and never stops. */
export function UnionVsUnionAllSplit() {
    const seq = ['1', '2', '3', '1', '2', '3', '1'];
    return (
        <SketchSplit
            label='একই Recursive Member, দুই রকম জোড়া'
            caption={
                <>
                    দুই দিকেই Recursive Member একই: SELECT n % 3 + 1 FROM t, যেটা 1 থেকে 2, 2 থেকে 3, 3 থেকে আবার 1
                    বানায়। UNION প্রতিটা নতুন Row কে আগে জমানো সব Row এর সাথে মেলায়, আর হুবহু মিললে ফেলে দেয়। চতুর্থ বারের 1
                    আগেই আছে, তাই ফেলে দেওয়া হয়, Working Table খালি হয়, Query থামে। UNION ALL কিছুই মেলায় না, তাই 1, 2, 3
                    ঘুরতেই থাকে।
                </>
            }
            panels={[
                {
                    title: 'UNION',
                    sub: 'পুরনো Row ফেলে দেয়',
                    viewBox: '0 0 420 170',
                    height: 170,
                    minWidth: 360,
                    children: (
                        <>
                            {seq.slice(0, 4).map((v, i) => {
                                const dropped = i === 3;
                                return (
                                    <g key={`u-${i}`}>
                                        <rect
                                            x={14 + i * 96}
                                            y={40}
                                            width={80}
                                            height={44}
                                            fill={dropped ? 'transparent' : 'var(--primary)'}
                                            fillOpacity={dropped ? 0 : 0.1}
                                            stroke={dropped ? 'currentColor' : 'var(--primary)'}
                                            strokeOpacity={dropped ? 0.45 : 0.8}
                                            strokeDasharray={dropped ? '4 3' : undefined}
                                            strokeWidth='1.2'
                                        />
                                        <SketchText x={54 + i * 96} y={68} size={14} bold accent={!dropped} opacity={dropped ? 0.5 : 1}>
                                            {v}
                                        </SketchText>
                                        <SketchText x={54 + i * 96} y={28} size={9} body opacity={0.7}>
                                            {`বার ${['০', '১', '২', '৩'][i]}`}
                                        </SketchText>
                                    </g>
                                );
                            })}
                            <line x1={302} y1={44} x2={378} y2={80} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.4' />
                            <SketchText x={210} y={118} size={10} body>
                                1 আগেই আছে, তাই বাদ
                            </SketchText>
                            <SketchText x={210} y={142} size={10.5} bold accent>
                                ফল: 1, 2, 3, তারপর থামা
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'UNION ALL',
                    sub: 'সবই রাখে',
                    viewBox: '0 0 420 170',
                    height: 170,
                    minWidth: 360,
                    children: (
                        <>
                            {seq.map((v, i) => (
                                <g key={`a-${i}`}>
                                    <rect
                                        x={10 + i * 58}
                                        y={40}
                                        width={48}
                                        height={44}
                                        fill='var(--primary)'
                                        fillOpacity={0.1}
                                        stroke='var(--primary)'
                                        strokeOpacity={0.8}
                                        strokeWidth='1.2'
                                    />
                                    <SketchText x={34 + i * 58} y={68} size={14} bold accent>
                                        {v}
                                    </SketchText>
                                </g>
                            ))}
                            <SketchText x={210} y={118} size={10} body>
                                কেউ কিছু মেলায় না, প্রতিবার নতুন একটা Row
                            </SketchText>
                            <SketchText x={210} y={142} size={10.5} bold>
                                ফল: 1, 2, 3, 1, 2, 3 ... কখনো থামে না
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}
