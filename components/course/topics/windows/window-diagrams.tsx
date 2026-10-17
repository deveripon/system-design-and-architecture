import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. GROUP BY ভাঁজ করে, Window রেখে দেয়                                         */
/* ------------------------------------------------------------------------- */

// Bookings 1 to 6 of the sample database, enough to see both shapes at once.
const SIX = [
    { id: 1, status: 'confirmed', total: '25000.00' },
    { id: 2, status: 'confirmed', total: '50000.00' },
    { id: 3, status: 'confirmed', total: '12500.00' },
    { id: 4, status: 'confirmed', total: '25500.00' },
    { id: 5, status: 'cancelled', total: '17000.00' },
    { id: 6, status: 'confirmed', total: '36000.00' },
];

function Cell({
    x,
    y,
    w,
    text,
    head,
    accent,
    dim,
}: {
    x: number;
    y: number;
    w: number;
    text: string;
    head?: boolean;
    accent?: boolean;
    dim?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={24}
                fill={accent ? 'var(--primary)' : head ? 'currentColor' : 'transparent'}
                fillOpacity={accent ? 0.12 : head ? 0.06 : 0}
                stroke='currentColor'
                strokeOpacity={0.3}
                strokeWidth='1'
            />
            <SketchText x={x + w / 2} y={y + 16} size={10.5} bold={head} accent={accent} opacity={dim ? 0.5 : 1}>
                {text}
            </SketchText>
        </g>
    );
}

/**
 * The same six bookings, once through GROUP BY status (six rows fold into two)
 * and once with sum(total_bdt) OVER () (six rows stay six, the total written
 * beside each one).
 */
export function CollapseVsKeepSplit() {
    return (
        <SketchSplit
            label='GROUP BY Folds the Rows, a Window Keeps Them'
            caption='একই ছয়টা Booking (১ থেকে ৬)। বাঁদিকে GROUP BY status: ছয়টা Row ভাঁজ হয়ে দুটো হয়ে গেছে, কোন Booking কোনটা সেটা আর জানা যায় না। ডানদিকে sum(total_bdt) OVER (): ছয়টা Row ছয়টাই আছে, প্রতিটার পাশে সবার যোগফল 166000.00 বসেছে। হিসাব একই, ফলাফলের আকার আলাদা।'
            panels={[
                {
                    title: 'GROUP BY status',
                    sub: '6 rows in, 2 rows out',
                    viewBox: '0 0 320 260',
                    height: 260,
                    minWidth: 300,
                    children: (
                        <g>
                            <Cell x={20} y={10} w={60} text='id' head />
                            <Cell x={80} y={10} w={100} text='status' head />
                            <Cell x={180} y={10} w={100} text='total_bdt' head />
                            {SIX.map((row, i) => (
                                <g key={row.id}>
                                    <Cell x={20} y={34 + i * 24} w={60} text={String(row.id)} dim />
                                    <Cell x={80} y={34 + i * 24} w={100} text={row.status} dim />
                                    <Cell x={180} y={34 + i * 24} w={100} text={row.total} dim />
                                </g>
                            ))}
                            <path d='M 150 186 V 202' stroke='var(--primary)' strokeWidth='1.4' />
                            <path d='M 144 196 L 150 204 L 156 196' fill='none' stroke='var(--primary)' strokeWidth='1.4' />
                            <Cell x={40} y={208} w={120} text='confirmed' accent />
                            <Cell x={160} y={208} w={120} text='149000.00' accent />
                            <Cell x={40} y={232} w={120} text='cancelled' accent />
                            <Cell x={160} y={232} w={120} text='17000.00' accent />
                        </g>
                    ),
                },
                {
                    title: 'sum(total_bdt) OVER ()',
                    sub: '6 rows in, 6 rows out',
                    viewBox: '0 0 340 260',
                    height: 260,
                    minWidth: 320,
                    children: (
                        <g>
                            <Cell x={10} y={10} w={50} text='id' head />
                            <Cell x={60} y={10} w={95} text='status' head />
                            <Cell x={155} y={10} w={85} text='total_bdt' head />
                            <Cell x={240} y={10} w={90} text='all_total' head accent />
                            {SIX.map((row, i) => (
                                <g key={row.id}>
                                    <Cell x={10} y={34 + i * 24} w={50} text={String(row.id)} />
                                    <Cell x={60} y={34 + i * 24} w={95} text={row.status} />
                                    <Cell x={155} y={34 + i * 24} w={85} text={row.total} />
                                    <Cell x={240} y={34 + i * 24} w={90} text='166000.00' accent />
                                </g>
                            ))}
                            <SketchText x={170} y={200} size={10.5} body opacity={0.85}>
                                প্রতিটা Row তার নিজের জায়গায়,
                            </SketchText>
                            <SketchText x={170} y={218} size={10.5} body opacity={0.85}>
                                পাশে সবার হিসাব
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 2. avg(total_bdt) OVER () এর গঠন                                              */
/* ------------------------------------------------------------------------- */

function Pointer({
    fromX,
    toX,
    toY,
    label,
    sub,
}: {
    fromX: number;
    toX: number;
    toY: number;
    label: string;
    sub: string;
}) {
    return (
        <g>
            <path
                d={`M ${fromX} 112 V ${toY - 18} H ${toX}`}
                fill='none'
                stroke='var(--primary)'
                strokeOpacity={0.6}
                strokeWidth='1'
                strokeDasharray='3 3'
            />
            <circle cx={fromX} cy={112} r={3} fill='var(--primary)' />
            <SketchText x={toX} y={toY - 22} size={10.5} anchor='start' bold accent>
                {label}
            </SketchText>
            <SketchText x={toX} y={toY - 6} size={10} anchor='start' body opacity={0.8}>
                {sub}
            </SketchText>
        </g>
    );
}

/**
 * The parts of a window function call: an ordinary aggregate, the word OVER
 * that turns it into a window function, and the brackets that describe the
 * window. Empty brackets mean every row of the result.
 */
export function OverAnatomyDiagram() {
    return (
        <Sketch
            label='Anatomy of a Window Function'
            height={330}
            minWidth={860}
            viewBox='0 0 880 330'
            caption='বাঁদিকের অংশটা পুরনো চেনা Aggregate, Module 05 এর। OVER শব্দটা তাকে Window Function বানায়: এখন সে Row গুলোকে ভাঁজ করে না, প্রতিটা Row এর পাশে নিজের উত্তর লেখে। বন্ধনীর ভেতরে লেখা থাকে কোন Row গুলো নিয়ে হিসাব হবে। এই লেসনে বন্ধনী খালি, মানে ফলাফলের সব Row। বন্ধনীর ভেতরে আর কী কী বসতে পারে, সেটা এই মডিউলের পরের লেসনগুলোর বিষয়।'>
            <rect x={150} y={52} width={580} height={60} fill='var(--card)' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.2' />
            <SketchText x={250} y={90} size={20} bold>
                avg(total_bdt)
            </SketchText>
            <SketchText x={430} y={90} size={20} bold accent>
                OVER
            </SketchText>
            <SketchText x={560} y={90} size={20} bold accent>
                (  )
            </SketchText>
            <SketchText x={680} y={90} size={14} opacity={0.6}>
                AS avg_all
            </SketchText>

            <Pointer fromX={250} toX={40} toY={190} label='Aggregate Function' sub='avg, sum, count, min, max: Module 05 এর চেনা Function' />
            <Pointer fromX={430} toX={300} toY={250} label='OVER' sub='এই শব্দটাই বলে: ভাঁজ নয়, প্রতিটা Row থাকবে' />
            <Pointer fromX={560} toX={560} toY={190} label='Window এর বর্ণনা' sub='খালি মানে ফলাফলের সব Row মিলে একটাই Window' />

            <rect x={540} y={260} width={320} height={58} fill='var(--primary)' fillOpacity={0.05} stroke='var(--primary)' strokeOpacity={0.4} strokeDasharray='4 3' />
            <SketchText x={552} y={280} size={10.5} anchor='start' bold accent>
                বন্ধনীর ভেতরে পরে যা বসবে
            </SketchText>
            <SketchText x={552} y={298} size={10} anchor='start' body opacity={0.85}>
                PARTITION BY (Lesson 03), ORDER BY (Lesson 02, 04),
            </SketchText>
            <SketchText x={552} y={312} size={10} anchor='start' body opacity={0.85}>
                Frame (Lesson 04)
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Window কখন চলে                                                             */
/* ------------------------------------------------------------------------- */

const STAGES = [
    { name: 'FROM', note: 'Table আসে' },
    { name: 'WHERE', note: 'Row ছাঁকা' },
    { name: 'GROUP BY', note: 'দল বাঁধা' },
    { name: 'HAVING', note: 'দল ছাঁকা' },
    { name: 'WINDOW', note: 'Window হিসাব', window: true },
    { name: 'SELECT', note: 'Column সাজানো' },
    { name: 'DISTINCT', note: 'একই Row বাদ' },
    { name: 'ORDER BY', note: 'সাজানো' },
    { name: 'LIMIT', note: 'কয়টা দেখাবে' },
];

/**
 * The logical order of a query with the window step placed in it: after
 * WHERE, GROUP BY and HAVING, before ORDER BY and LIMIT. Everything to the
 * left cannot see a window value; everything to the right can.
 */
export function WindowOrderDiagram() {
    const w = 88;
    const gap = 10;
    return (
        <Sketch
            label='Where the Window Step Runs'
            height={250}
            minWidth={900}
            viewBox='0 0 920 250'
            caption='Window এর হিসাব হয় WHERE, GROUP BY আর HAVING শেষ হওয়ার পরে। তাই এই তিনটা ধাপ Window এর মান দেখতে পায় না, সেখানে লিখলে PostgreSQL বলে window functions are not allowed। কিন্তু ORDER BY আর LIMIT আসে পরে, তারা মানটা দেখতে পায়। আরেকটা ফল: WHERE আগে Row ছেঁটে ফেলে, তাই Window শুধু টিকে থাকা Row গুলো দেখে, আর LIMIT পরে আসে বলে Window সব Row দেখার পরেই কয়টা দেখাবে সেটা ঠিক হয়।'>
            <defs>
                <marker id='window-order-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <rect x={14} y={150} width={4 * (w + gap) - gap + 12} height={78} fill='currentColor' fillOpacity={0.04} stroke='currentColor' strokeOpacity={0.25} strokeDasharray='4 3' />
            <SketchText x={14 + (4 * (w + gap)) / 2} y={176} size={11} bold>
                Window এর মান দেখে না
            </SketchText>
            <SketchText x={14 + (4 * (w + gap)) / 2} y={196} size={10} body opacity={0.8}>
                এখানে লিখলে Error
            </SketchText>
            <rect x={20 + 5 * (w + gap) - 6} y={150} width={4 * (w + gap) - gap + 12} height={78} fill='var(--primary)' fillOpacity={0.05} stroke='var(--primary)' strokeOpacity={0.4} strokeDasharray='4 3' />
            <SketchText x={20 + 5 * (w + gap) - 6 + (4 * (w + gap)) / 2} y={176} size={11} bold accent>
                Window এর মান দেখে
            </SketchText>
            <SketchText x={20 + 5 * (w + gap) - 6 + (4 * (w + gap)) / 2} y={196} size={10} body opacity={0.8}>
                SELECT, ORDER BY এ লেখা যায়
            </SketchText>
            {STAGES.map((stage, i) => {
                const x = 20 + i * (w + gap);
                return (
                    <g key={stage.name}>
                        <rect
                            x={x}
                            y={50}
                            width={w}
                            height={56}
                            fill={stage.window ? 'var(--primary)' : 'var(--card)'}
                            fillOpacity={stage.window ? 0.15 : 1}
                            stroke={stage.window ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={stage.window ? 1 : 0.4}
                            strokeWidth={stage.window ? 1.8 : 1.1}
                        />
                        <SketchText x={x + w / 2} y={74} size={10.5} bold accent={stage.window}>
                            {stage.name}
                        </SketchText>
                        <SketchText x={x + w / 2} y={94} size={9.5} body opacity={0.8}>
                            {stage.note}
                        </SketchText>
                        <SketchText x={x + w / 2} y={36} size={9} opacity={0.5}>
                            {String(i + 1)}
                        </SketchText>
                        {i < STAGES.length - 1 && (
                            <line x1={x + w} y1={78} x2={x + w + gap - 1} y2={78} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#window-order-arrow)' />
                        )}
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. GROUP BY এর পরে Window: মোটের কত ভাগ                                       */
/* ------------------------------------------------------------------------- */

const SHARES = [
    { status: 'confirmed', revenue: '423600.00', pct: 71.5 },
    { status: 'pending', revenue: '117200.00', pct: 19.8 },
    { status: 'cancelled', revenue: '51500.00', pct: 8.7 },
];

// Where each bar starts, as a share of the full width: the sum of the shares before it.
const SHARE_STARTS: number[] = SHARES.map((_share: (typeof SHARES)[number], i: number): number =>
    SHARES.slice(0, i).reduce((sum: number, s: (typeof SHARES)[number]): number => sum + s.pct, 0),
);

/**
 * Two levels in one query: GROUP BY first makes one row per status with its
 * sum, then a window adds up those sums across all groups, so each group can
 * be divided by the grand total.
 */
export function ShareOfTotalDiagram() {
    const barX = 40;
    const barW = 820;
    return (
        <Sketch
            label='Share of the Total After GROUP BY'
            height={270}
            minWidth={880}
            viewBox='0 0 900 270'
            caption='প্রথমে GROUP BY status তিনটা দল বানায়, প্রতিটার নিজের যোগফল: sum(total_bdt)। তারপর Window আসে, আর সেই তিনটা যোগফলকেই আবার যোগ করে: sum(sum(total_bdt)) OVER () = 592300.00। ভেতরের sum দলের, বাইরের sum সব দল মিলিয়ে। এবার প্রতিটা দলের যোগফলকে এই মোট দিয়ে ভাগ করলেই শতাংশ। তিনটা শতাংশ যোগ করলে 100।'>
            <SketchText x={barX} y={36} size={11} anchor='start' bold>
                সব Booking এর মোট: 592300.00 টাকা
            </SketchText>
            {SHARES.map((share, i) => {
                const w = (share.pct / 100) * barW;
                const x = barX + (SHARE_STARTS[i] / 100) * barW;
                return (
                    <g key={share.status}>
                        <rect
                            x={x}
                            y={52}
                            width={w}
                            height={46}
                            fill='var(--primary)'
                            fillOpacity={0.35 - i * 0.1}
                            stroke='var(--primary)'
                            strokeWidth='1'
                        />
                        <SketchText x={x + w / 2} y={80} size={w > 120 ? 12 : 10} bold>
                            {`${share.pct}%`}
                        </SketchText>
                    </g>
                );
            })}
            {SHARES.map((share, i) => (
                <g key={`row-${share.status}`}>
                    <SketchText x={barX} y={140 + i * 26} size={11} anchor='start' bold>
                        {share.status}
                    </SketchText>
                    <SketchText x={barX + 150} y={140 + i * 26} size={11} anchor='start'>
                        {`sum = ${share.revenue}`}
                    </SketchText>
                    <SketchText x={barX + 380} y={140 + i * 26} size={11} anchor='start' opacity={0.75}>
                        {`100 × ${share.revenue} / 592300.00 = ${share.pct}`}
                    </SketchText>
                </g>
            ))}
            <SketchText x={barX} y={240} size={10.5} anchor='start' body accent>
                ভেতরের sum প্রতিটা দলের, বাইরের sum(...) OVER () সব দলের যোগফল
            </SketchText>
        </Sketch>
    );
}
