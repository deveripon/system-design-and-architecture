import { Sketch, SketchBox, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Small drawing helpers                                                      */
/* ------------------------------------------------------------------------- */

function Cell({
    x,
    y,
    w,
    h = 22,
    text,
    accent,
    muted,
    dashed,
    struck,
    bold,
}: {
    x: number;
    y: number;
    w: number;
    h?: number;
    text: string;
    accent?: boolean;
    muted?: boolean;
    dashed?: boolean;
    struck?: boolean;
    bold?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={accent ? 'var(--primary)' : 'var(--card)'}
                fillOpacity={accent ? 0.1 : 1}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.9 : muted ? 0.2 : 0.35}
                strokeDasharray={dashed ? '4 3' : undefined}
                strokeWidth='1'
            />
            <SketchText x={x + w / 2} y={y + h / 2 + 4} size={9.5} opacity={muted ? 0.4 : 1} accent={accent} bold={bold}>
                {text}
            </SketchText>
            {struck && (
                <line
                    x1={x + 6}
                    y1={y + h / 2}
                    x2={x + w - 6}
                    y2={y + h / 2}
                    stroke='var(--primary)'
                    strokeWidth='1.4'
                />
            )}
        </g>
    );
}

/** The five guests of the first query box, the same rows the reader runs. */
const GUESTS: [string, string, string][] = [
    ['1', 'Nusrat Jahan', 'confirmed'],
    ['2', 'Arif Hasan', 'cancelled'],
    ['3', 'Mitu Rahman', 'confirmed'],
    ['4', 'Sohel Rana', 'cancelled'],
    ['5', 'Tania Akter', 'pending'],
];

/* ------------------------------------------------------------------------- */
/* 1. তিন কমান্ড, তিন মাত্রা                                                     */
/* ------------------------------------------------------------------------- */

/**
 * One small table, three commands. DELETE with a WHERE takes two rows and
 * leaves the rest, TRUNCATE takes every row and leaves the columns, DROP takes
 * the table itself. Rows are the drop_guests rows of the first query box.
 */
export function DropThreeWaysDiagram() {
    const panels = [
        { x: 16, title: 'DELETE ... WHERE', mode: 'delete' as const },
        { x: 268, title: 'TRUNCATE', mode: 'truncate' as const },
        { x: 520, title: 'DROP TABLE', mode: 'drop' as const },
    ];
    const W = 224;
    return (
        <Sketch
            label='তিন কমান্ড, তিন মাত্রার মুছে ফেলা'
            height={330}
            viewBox='0 0 760 330'
            caption={
                <>
                    একই <code>drop_guests</code> Table এ তিনটা কমান্ড। DELETE শুধু শর্ত মেলা দুটো Row নেয়, বাকি তিনটা থাকে। TRUNCATE সব
                    Row নেয়, কিন্তু Column এর নামগুলো, অর্থাৎ Table এর কাঠামো, থেকে যায় আর নতুন Row নিতে তৈরি। DROP TABLE কাঠামোসহ পুরো
                    Table টাই সরিয়ে দেয়: Column, Index, Constraint, সব।
                </>
            }>
            {panels.map(p => (
                <g key={p.mode}>
                    <SketchText x={p.x + W / 2} y={20} size={10} bold accent>
                        {p.title}
                    </SketchText>
                    {p.mode !== 'drop' ? (
                        <>
                            <Cell x={p.x} y={36} w={34} text='id' bold />
                            <Cell x={p.x + 34} y={36} w={110} text='full_name' bold />
                            <Cell x={p.x + 144} y={36} w={80} text='status' bold />
                            {p.mode === 'delete' &&
                                GUESTS.map((g, i) => {
                                    const gone = g[2] === 'cancelled';
                                    return (
                                        <g key={g[0]}>
                                            <Cell x={p.x} y={58 + i * 24} w={34} h={24} text={g[0]} muted={gone} struck={gone} />
                                            <Cell x={p.x + 34} y={58 + i * 24} w={110} h={24} text={g[1]} muted={gone} struck={gone} />
                                            <Cell x={p.x + 144} y={58 + i * 24} w={80} h={24} text={g[2]} muted={gone} struck={gone} />
                                        </g>
                                    );
                                })}
                            {p.mode === 'truncate' && (
                                <>
                                    <rect
                                        x={p.x}
                                        y={58}
                                        width={W}
                                        height={120}
                                        fill='none'
                                        stroke='currentColor'
                                        strokeOpacity={0.35}
                                        strokeDasharray='4 3'
                                    />
                                    <SketchText x={p.x + W / 2} y={114} size={10} opacity={0.6}>
                                        (0 rows)
                                    </SketchText>
                                    <SketchText x={p.x + W / 2} y={132} size={9} opacity={0.5}>
                                        নতুন Row নিতে তৈরি
                                    </SketchText>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <rect
                                x={p.x}
                                y={36}
                                width={W}
                                height={142}
                                fill='none'
                                stroke='currentColor'
                                strokeOpacity={0.25}
                                strokeDasharray='4 3'
                            />
                            <line x1={p.x + 20} y1={50} x2={p.x + W - 20} y2={164} stroke='var(--primary)' strokeWidth='1.4' />
                            <line x1={p.x + W - 20} y1={50} x2={p.x + 20} y2={164} stroke='var(--primary)' strokeWidth='1.4' />
                            <SketchText x={p.x + W / 2} y={112} size={10} accent bold>
                                relation does not exist
                            </SketchText>
                        </>
                    )}
                    <SketchBox
                        x={p.x}
                        y={196}
                        w={W}
                        h={40}
                        title={p.mode === 'delete' ? 'DELETE 2' : p.mode === 'truncate' ? 'TRUNCATE TABLE' : 'DROP TABLE'}
                        sub={p.mode === 'delete' ? 'কয়টা Row গেল, তার হিসাব আসে' : 'কোনো Row এর হিসাব আসে না'}
                        accent
                    />
                    <SketchText x={p.x} y={262} size={9.5} anchor='start' body>
                        {p.mode === 'delete' ? 'Row: ৫ থেকে ৩' : p.mode === 'truncate' ? 'Row: ৫ থেকে ০' : 'Row: Table এর সাথেই নেই'}
                    </SketchText>
                    <SketchText x={p.x} y={282} size={9.5} anchor='start' body>
                        {p.mode === 'drop' ? 'Column আর Constraint: নেই' : 'Column আর Constraint: আছে'}
                    </SketchText>
                    <SketchText x={p.x} y={302} size={9.5} anchor='start' body>
                        {p.mode === 'delete'
                            ? 'Identity: আগের মতোই চলে'
                            : p.mode === 'truncate'
                              ? 'Identity: চাইলে 1 থেকে আবার'
                              : 'Identity Sequence: সাথে চলে যায়'}
                    </SketchText>
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. TRUNCATE customers CASCADE কতদূর যায়                                       */
/* ------------------------------------------------------------------------- */

interface Node {
    name: string;
    x: number;
    y: number;
    before: number;
    emptied: boolean;
}

const NODES: Node[] = [
    { name: 'destinations', x: 20, y: 30, before: 7, emptied: false },
    { name: 'guides', x: 20, y: 120, before: 5, emptied: false },
    { name: 'tours', x: 215, y: 75, before: 9, emptied: false },
    { name: 'departures', x: 410, y: 75, before: 16, emptied: false },
    { name: 'customers', x: 20, y: 250, before: 15, emptied: true },
    { name: 'bookings', x: 410, y: 250, before: 24, emptied: true },
    { name: 'payments', x: 605, y: 205, before: 19, emptied: true },
    { name: 'reviews', x: 605, y: 300, before: 10, emptied: true },
];

/** Child to parent, the way a foreign key points. */
const EDGES: [string, string][] = [
    ['tours', 'destinations'],
    ['tours', 'guides'],
    ['departures', 'tours'],
    ['bookings', 'departures'],
    ['bookings', 'customers'],
    ['payments', 'bookings'],
    ['reviews', 'bookings'],
];

const NW = 140;
const NH = 46;

/**
 * The eight Island Tours tables with their foreign keys, and the result of
 * TRUNCATE customers CASCADE inside BEGIN ... ROLLBACK: every table that
 * points at customers, and every table that points at those, is emptied.
 * Counts are from the real run.
 */
export function TruncateBlastDiagram() {
    const at = (name: string) => NODES.find(n => n.name === name)!;
    return (
        <Sketch
            label='TRUNCATE customers CASCADE: কোন Table খালি হয়'
            height={380}
            viewBox='0 0 760 380'
            caption={
                <>
                    তীরগুলো Foreign Key এর দিক: যে Table অন্যটাকে দেখায়, তীর তার থেকে শুরু। CASCADE সেই সব Table খালি করে যারা
                    customers কে দেখায় (bookings), তারপর যারা bookings কে দেখায় (payments আর reviews)। উল্টো দিকে যায় না: bookings যে
                    departures কে দেখায়, সেই departures এর ১৬টা Row অক্ষত থাকে। সংখ্যাগুলো এই লেসনের বক্সে BEGIN আর ROLLBACK এর মাঝে
                    চালানো আসল ফলাফল।
                </>
            }>
            <defs>
                <marker
                    id='drop-blast-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='currentColor' />
                </marker>
                <marker
                    id='drop-blast-arrow-hot'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {EDGES.map(([from, to]) => {
                const a = at(from);
                const b = at(to);
                const hot = a.emptied && b.emptied;
                const ax = a.x + NW / 2;
                const ay = a.y + NH / 2;
                const bx = b.x + NW / 2;
                const by = b.y + NH / 2;
                // Stop the line at the edge of the target box so the head shows.
                const dx = bx - ax;
                const dy = by - ay;
                const scale = Math.min(
                    dx === 0 ? Infinity : Math.abs((NW / 2 + 4) / dx),
                    dy === 0 ? Infinity : Math.abs((NH / 2 + 4) / dy)
                );
                return (
                    <line
                        key={`${from}-${to}`}
                        x1={ax + dx * scale}
                        y1={ay + dy * scale}
                        x2={bx - dx * scale}
                        y2={by - dy * scale}
                        stroke={hot ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={hot ? 1 : 0.45}
                        strokeWidth={hot ? 1.6 : 1.1}
                        markerEnd={hot ? 'url(#drop-blast-arrow-hot)' : 'url(#drop-blast-arrow)'}
                    />
                );
            })}
            {NODES.map(n => (
                <SketchBox
                    key={n.name}
                    x={n.x}
                    y={n.y}
                    w={NW}
                    h={NH}
                    title={n.name}
                    sub={n.emptied ? `${n.before} থেকে 0` : `${n.before}, অক্ষত`}
                    accent={n.emptied}
                    dashed={!n.emptied}
                />
            ))}
            <SketchText x={90} y={330} size={9.5} body accent>
                এখান থেকে শুরু
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. CASCADE শব্দ একটা, মানে দুটো                                              */
/* ------------------------------------------------------------------------- */

function MiniTable({
    x,
    y,
    name,
    rows,
    gone,
    emptied,
}: {
    x: number;
    y: number;
    name: string;
    rows: string[];
    gone?: boolean;
    emptied?: boolean;
}) {
    return (
        <g opacity={gone ? 0.45 : 1}>
            <Cell x={x} y={y} w={130} text={name} bold accent={!gone} dashed={gone} />
            {emptied ? (
                <>
                    <rect
                        x={x}
                        y={y + 22}
                        width={130}
                        height={44}
                        fill='none'
                        stroke='currentColor'
                        strokeOpacity={0.35}
                        strokeDasharray='4 3'
                    />
                    <SketchText x={x + 65} y={y + 48} size={9.5} opacity={0.6}>
                        (0 rows)
                    </SketchText>
                </>
            ) : (
                rows.map((r, i) => <Cell key={r} x={x} y={y + 22 + i * 22} w={130} text={r} dashed={gone} muted={gone} />)
            )}
            {gone && (
                <>
                    <line x1={x + 6} y1={y + 4} x2={x + 124} y2={y + 62} stroke='var(--primary)' strokeWidth='1.4' />
                    <line x1={x + 124} y1={y + 4} x2={x + 6} y2={y + 62} stroke='var(--primary)' strokeWidth='1.4' />
                </>
            )}
        </g>
    );
}

/**
 * The same two tables after DROP ... CASCADE and after TRUNCATE ... CASCADE.
 * DROP removes the parent, the view on it and only the foreign key constraint
 * of the child; the child keeps its rows, now pointing at nothing. TRUNCATE
 * keeps both tables and empties both.
 */
export function DropCascadeSplit() {
    return (
        <SketchSplit
            label='CASCADE শব্দ একটা, কাজ দুটো'
            caption={
                <>
                    বাঁয়ে <code>DROP TABLE drop_tours CASCADE</code>: drop_tours আর তার উপর বানানো View চলে যায়, কিন্তু drop_departures
                    থাকে, তার Row গুলোও থাকে। যায় শুধু তার Foreign Key Constraint, তাই tour_id এর 1 আর 2 এখন এমন ট্যুরকে দেখায় যার
                    অস্তিত্বই নেই। ডানে <code>TRUNCATE drop_tours CASCADE</code>: দুটো Table ই থাকে, Foreign Key ও থাকে, কিন্তু দুটোর Row ই
                    শূন্য। দুটো ফলাফলই এই লেসনের বক্সে চালানো।
                </>
            }
            panels={[
                {
                    title: 'DROP ... CASCADE',
                    sub: 'Parent যায়, Child এর শুধু Constraint',
                    viewBox: '0 0 340 200',
                    height: 200,
                    children: (
                        <>
                            <MiniTable x={10} y={20} name='drop_tours' rows={['1 Sundarbans', '2 Sajek']} gone />
                            <MiniTable x={200} y={20} name='drop_departures' rows={['tour_id 1', 'tour_id 2']} />
                            <line
                                x1={196}
                                y1={52}
                                x2={146}
                                y2={52}
                                stroke='var(--primary)'
                                strokeWidth='1.2'
                                strokeDasharray='3 4'
                            />
                            <SketchText x={171} y={44} size={8.5} accent>
                                FK নেই
                            </SketchText>
                            <Cell x={10} y={120} w={130} text='drop_tour_list (View)' dashed muted struck />
                            <SketchText x={170} y={176} size={9} body>
                                Child এর Row থাকে, কিন্তু কেউ আর পাহারা দেয় না
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'TRUNCATE ... CASCADE',
                    sub: 'দুই Table ই থাকে, দুটোই খালি',
                    viewBox: '0 0 340 200',
                    height: 200,
                    children: (
                        <>
                            <defs>
                                <marker
                                    id='drop-cascade-fk'
                                    markerWidth={8}
                                    markerHeight={8}
                                    refX={7}
                                    refY={3.5}
                                    orient='auto'
                                    markerUnits='userSpaceOnUse'>
                                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                                </marker>
                            </defs>
                            <MiniTable x={10} y={20} name='drop_tours' rows={[]} emptied />
                            <MiniTable x={200} y={20} name='drop_departures' rows={[]} emptied />
                            <line
                                x1={196}
                                y1={31}
                                x2={146}
                                y2={31}
                                stroke='var(--primary)'
                                strokeWidth='1.2'
                                markerEnd='url(#drop-cascade-fk)'
                            />
                            <SketchText x={171} y={24} size={8.5} accent>
                                FK আছে
                            </SketchText>
                            <SketchText x={170} y={176} size={9} body>
                                কাঠামো আর নিয়ম সব অক্ষত, শুধু Row নেই
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Disk এ কী ঘটে                                                              */
/* ------------------------------------------------------------------------- */

/**
 * Pages of a table file after DELETE and after TRUNCATE. DELETE marks every
 * row dead inside the same pages, so the file keeps its size (14 MB in the
 * query box); TRUNCATE gives the table a brand new empty file (0 bytes).
 */
export function DeleteVsTruncateDiskSplit() {
    const pages = Array.from({ length: 12 }, (_, i) => i);
    return (
        <SketchSplit
            label='Disk এ: মৃত Row বনাম নতুন ফাঁকা ফাইল'
            caption={
                <>
                    বাঁয়ে DELETE: প্রতিটা Row আলাদা করে মৃত চিহ্নিত হয়, কিন্তু সে যে Page এ ছিল সেখানেই পড়ে থাকে। তাই এই লেসনের বক্সে ২
                    লাখ Row মুছে ফেলার পরেও ফাইল 14 MB। পরে VACUUM সেই জায়গা নতুন Row এর জন্য খালি ঘোষণা করে। ডানে TRUNCATE: পুরনো
                    ফাইলটা ফেলে দিয়ে Table কে একটা নতুন, শূন্য ফাইল দেওয়া হয়, তাই 0 bytes, কোনো Row একটা একটা করে ছুঁতে হয় না।
                </>
            }
            panels={[
                {
                    title: 'DELETE FROM drop_big',
                    sub: '14 MB থেকে 14 MB',
                    viewBox: '0 0 340 190',
                    height: 190,
                    children: (
                        <>
                            {pages.map(i => {
                                const x = 14 + (i % 6) * 52;
                                const y = 16 + Math.floor(i / 6) * 70;
                                return (
                                    <g key={i}>
                                        <rect
                                            x={x}
                                            y={y}
                                            width={44}
                                            height={58}
                                            fill='var(--card)'
                                            stroke='currentColor'
                                            strokeOpacity={0.4}
                                        />
                                        {[0, 1, 2, 3].map(r => (
                                            <g key={r}>
                                                <line
                                                    x1={x + 6}
                                                    y1={y + 12 + r * 12}
                                                    x2={x + 38}
                                                    y2={y + 12 + r * 12}
                                                    stroke='currentColor'
                                                    strokeOpacity={0.3}
                                                    strokeWidth='3'
                                                />
                                                <line
                                                    x1={x + 4}
                                                    y1={y + 8 + r * 12}
                                                    x2={x + 40}
                                                    y2={y + 16 + r * 12}
                                                    stroke='var(--primary)'
                                                    strokeWidth='1'
                                                />
                                            </g>
                                        ))}
                                    </g>
                                );
                            })}
                            <SketchText x={170} y={172} size={9} body>
                                প্রতিটা Row মৃত চিহ্ন পায়, Page গুলো থেকে যায়
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'TRUNCATE drop_big',
                    sub: '14 MB থেকে 0 bytes',
                    viewBox: '0 0 340 190',
                    height: 190,
                    children: (
                        <>
                            {pages.map(i => {
                                const x = 14 + (i % 6) * 26;
                                const y = 30 + Math.floor(i / 6) * 34;
                                return (
                                    <rect
                                        key={i}
                                        x={x}
                                        y={y}
                                        width={22}
                                        height={28}
                                        fill='none'
                                        stroke='currentColor'
                                        strokeOpacity={0.25}
                                        strokeDasharray='3 3'
                                    />
                                );
                            })}
                            <SketchText x={85} y={118} size={9} body opacity={0.7}>
                                পুরনো ফাইল, ফেলে দেওয়া হয়
                            </SketchText>
                            <rect
                                x={220}
                                y={40}
                                width={70}
                                height={54}
                                fill='var(--primary)'
                                fillOpacity={0.08}
                                stroke='var(--primary)'
                                strokeWidth='1.2'
                            />
                            <SketchText x={255} y={71} size={9.5} accent bold>
                                0 bytes
                            </SketchText>
                            <SketchText x={255} y={118} size={9} body accent>
                                নতুন ফাঁকা ফাইল
                            </SketchText>
                            <SketchText x={170} y={172} size={9} body>
                                Row ছোঁয়া হয় না, ফাইলটাই বদলে যায়
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 5. কখন ফেরত আনা যায়                                                          */
/* ------------------------------------------------------------------------- */

const UNDO_ROWS: { cmd: string; pg: string; mysql: string; after: string; mysqlHot: boolean }[] = [
    { cmd: 'DELETE', pg: 'ROLLBACK এ ফেরত', mysql: 'ROLLBACK এ ফেরত', after: 'Backup বা PITR', mysqlHot: false },
    { cmd: 'TRUNCATE', pg: 'ROLLBACK এ ফেরত', mysql: 'ফেরত আসে না', after: 'Backup বা PITR', mysqlHot: true },
    { cmd: 'DROP TABLE', pg: 'ROLLBACK এ ফেরত', mysql: 'ফেরত আসে না', after: 'Backup বা PITR', mysqlHot: true },
];

/**
 * A time line with the COMMIT in the middle. Before it, PostgreSQL can roll
 * back all three commands; MySQL only DELETE, because TRUNCATE and DROP commit
 * on their own. After it, only a backup brings data back.
 */
export function UndoTimelineDiagram() {
    return (
        <Sketch
            label='কখন পর্যন্ত ফেরত আনা যায়'
            height={260}
            viewBox='0 0 760 260'
            caption={
                <>
                    COMMIT এর আগে PostgreSQL তিনটা কমান্ডই ROLLBACK দিয়ে ফেরাতে পারে, কারণ PostgreSQL এ DDL ও Transaction এর অংশ। MySQL
                    এ TRUNCATE আর DROP TABLE নিজেরাই চুপচাপ COMMIT করে দেয়, তাই তাদের পরে ROLLBACK কিছুই ফেরায় না, এমনকি আগের DELETE
                    টাও না। COMMIT এর পরে কোনো Database এই কোনো Undo বোতাম নেই: তখন ভরসা শুধু Backup আর Point-in-time Recovery।
                </>
            }>
            <line x1={150} y1={40} x2={740} y2={40} stroke='currentColor' strokeOpacity={0.4} />
            <line x1={540} y1={26} x2={540} y2={244} stroke='var(--primary)' strokeWidth='1.6' strokeDasharray='5 4' />
            <SketchText x={540} y={20} size={10} bold accent>
                COMMIT
            </SketchText>
            <SketchText x={260} y={30} size={9.5} body>
                Transaction চলছে
            </SketchText>
            <SketchText x={640} y={30} size={9.5} body>
                COMMIT হয়ে গেছে
            </SketchText>
            <SketchText x={250} y={64} size={9.5} bold>
                PostgreSQL এ
            </SketchText>
            <SketchText x={440} y={64} size={9.5} bold>
                MySQL এ
            </SketchText>
            <SketchText x={640} y={64} size={9.5} bold>
                দুই জায়গাতেই
            </SketchText>
            {UNDO_ROWS.map((r, i) => {
                const y = 80 + i * 54;
                return (
                    <g key={r.cmd}>
                        <SketchText x={20} y={y + 24} size={10.5} anchor='start' bold>
                            {r.cmd}
                        </SketchText>
                        <SketchBox x={170} y={y} w={160} h={38} title={r.pg} accent />
                        <SketchBox x={360} y={y} w={160} h={38} title={r.mysql} accent={!r.mysqlHot} dashed={r.mysqlHot} />
                        <SketchBox x={560} y={y} w={160} h={38} title={r.after} dashed />
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 6. Module 09 এর গল্প                                                         */
/* ------------------------------------------------------------------------- */

const STORY: { n: string; title: string; sub: string }[] = [
    { n: '01', title: 'CREATE DATABASE', sub: 'ঘরটা বানানো' },
    { n: '02', title: 'CREATE TABLE', sub: 'প্রথম Table' },
    { n: '03', title: 'Numbers', sub: 'টাকা মানে numeric' },
    { n: '04', title: 'Text', sub: 'UTF-8, Collation' },
    { n: '05', title: 'Date & Time', sub: 'timestamptz' },
    { n: '06', title: 'Bool/UUID/Enum', sub: 'ছোট কিন্তু জরুরি' },
    { n: '07', title: 'Constraints', sub: 'NOT NULL, CHECK' },
    { n: '08', title: 'Primary Keys', sub: 'Identity, UUID' },
    { n: '09', title: 'Foreign Keys', sub: 'ON DELETE' },
    { n: '10', title: 'ALTER TABLE', sub: 'বদলানো' },
    { n: '11', title: 'DROP/TRUNCATE', sub: 'আর DELETE' },
];

const GROUPS: { label: string; from: number; to: number }[] = [
    { label: 'ঘর আর Table', from: 0, to: 1 },
    { label: 'প্রতিটা Column এর Type', from: 2, to: 5 },
    { label: 'নিয়ম, যা ভুল Data আটকায়', from: 6, to: 8 },
    { label: 'বদলানো আর সরানো', from: 9, to: 10 },
];

/**
 * The eleven lessons of Module 09 as one path, from an empty server to a
 * schema that defends itself, and finally to changing and removing it.
 */
export function ModuleNineStoryDiagram() {
    const pos = (i: number) => (i < 6 ? { x: 14 + i * 124, y: 56 } : { x: 14 + (i - 6) * 124 + 62, y: 186 });
    return (
        <Sketch
            label='Module 09: ফাঁকা Server থেকে নিজেকে রক্ষা করা Schema'
            height={300}
            viewBox='0 0 760 300'
            caption={
                <>
                    উপরের সারিতে কাঠামো: Database, Table, আর প্রতিটা Column এর ঠিক Type। নিচের সারিতে নিয়ম: যে Constraint গুলো ভুল Data
                    কে দরজায় আটকায়, আর শেষে কাঠামো বদলানো ও সরানোর কমান্ড। এগারোটা লেসন মিলে আপনি Island Tours এর Table গুলো নিজে
                    বানানোর পুরো হাতিয়ার পেয়েছেন।
                </>
            }>
            <defs>
                <marker
                    id='drop-story-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {GROUPS.map(g => {
                const a = pos(g.from);
                const b = pos(g.to);
                return (
                    <g key={g.label}>
                        <line
                            x1={a.x}
                            y1={a.y - 14}
                            x2={b.x + 112}
                            y2={b.y - 14}
                            stroke='var(--primary)'
                            strokeOpacity={0.6}
                        />
                        <SketchText x={(a.x + b.x + 112) / 2} y={a.y - 22} size={9.5} body accent>
                            {g.label}
                        </SketchText>
                    </g>
                );
            })}
            {STORY.map((s, i) => {
                const p = pos(i);
                const next = i < STORY.length - 1 ? pos(i + 1) : null;
                return (
                    <g key={s.n}>
                        <SketchBox x={p.x} y={p.y} w={112} h={58} title={s.title} sub={`${s.n} · ${s.sub}`} accent={i === 10} />
                        {next && next.y === p.y && (
                            <line
                                x1={p.x + 112}
                                y1={p.y + 29}
                                x2={next.x - 2}
                                y2={next.y + 29}
                                stroke='var(--primary)'
                                strokeWidth='1.1'
                                markerEnd='url(#drop-story-arrow)'
                            />
                        )}
                        {next && next.y !== p.y && (
                            <path
                                d={`M ${p.x + 56} ${p.y + 58} C ${p.x + 56} ${p.y + 100}, ${next.x + 56} ${next.y - 80}, ${next.x + 56} ${next.y - 2}`}
                                fill='none'
                                stroke='var(--primary)'
                                strokeWidth='1.1'
                                markerEnd='url(#drop-story-arrow)'
                            />
                        )}
                    </g>
                );
            })}
        </Sketch>
    );
}
