import { Sketch, SketchSplit, SketchText } from '../../sketch';

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
                strokeOpacity={accent ? 0.9 : 0.35}
                strokeDasharray={dashed ? '4 3' : undefined}
                strokeWidth='1'
            />
            <SketchText x={x + w / 2} y={y + h / 2 + 4} size={9.5} opacity={muted ? 0.45 : 1} accent={accent} bold={bold}>
                {text}
            </SketchText>
        </g>
    );
}

/** The real month by status counts, the long way and the wide way. */
const LONG_ROWS: [string, string, string][] = [
    ['2025-12', 'confirmed', '2'],
    ['2026-01', 'cancelled', '2'],
    ['2026-01', 'confirmed', '4'],
    ['2026-02', 'confirmed', '1'],
    ['2026-03', 'confirmed', '3'],
    ['2026-09', 'cancelled', '1'],
    ['2026-09', 'confirmed', '2'],
    ['2026-10', 'confirmed', '5'],
    ['2026-10', 'pending', '4'],
];

const WIDE_ROWS: [string, string, string, string][] = [
    ['2025-12', '2', '0', '0'],
    ['2026-01', '4', '0', '2'],
    ['2026-02', '1', '0', '0'],
    ['2026-03', '3', '0', '0'],
    ['2026-09', '2', '0', '1'],
    ['2026-10', '5', '4', '0'],
];

/* ------------------------------------------------------------------------- */
/* 1. লম্বা আকার আর চওড়া আকার                                                   */
/* ------------------------------------------------------------------------- */

/**
 * The same 24 bookings counted two ways. On the left the shape GROUP BY gives,
 * one row per month and status; on the right the shape a manager reads, one
 * row per month with a column per status. Every number is from the sample.
 */
export function LongVsWideSplit() {
    return (
        <SketchSplit
            label='Long vs Wide: একই হিসাব, দুই চেহারা'
            caption={
                <>
                    বাঁয়ে <code>GROUP BY month, status</code> এর ফলাফল: ৯টা Row, প্রতিটায় একটা মাস, একটা অবস্থা আর একটা সংখ্যা।
                    এটাকে বলে Long আকার। ডানে একই সংখ্যাগুলো Pivot করা: ৬টা Row, প্রতিটা মাস একবার, আর প্রতিটা অবস্থা নিজের
                    Column এ। এটা Wide আকার। কোনো সংখ্যা বদলায়নি, শুধু status Column এর মানগুলো Column এর নাম হয়ে গেছে। যে
                    ঘরের জন্য Long আকারে কোনো Row ছিল না, যেমন ডিসেম্বরের pending, সেখানে ডানে 0।
                </>
            }
            panels={[
                {
                    title: 'LONG',
                    sub: '৯টা Row, ৩টা Column',
                    viewBox: '0 0 330 250',
                    height: 250,
                    minWidth: 300,
                    children: (
                        <g>
                            {['month', 'status', 'n'].map((h, i) => (
                                <SketchText key={h} x={[60, 170, 270][i]} y={18} size={10} bold>
                                    {h}
                                </SketchText>
                            ))}
                            {LONG_ROWS.map(([m, s, n], r) => (
                                <g key={`${m}-${s}`}>
                                    <Cell x={15} y={26 + r * 24} w={90} text={m} />
                                    <Cell x={110} y={26 + r * 24} w={120} text={s} accent={s !== 'confirmed'} />
                                    <Cell x={235} y={26 + r * 24} w={70} text={n} />
                                </g>
                            ))}
                        </g>
                    ),
                },
                {
                    title: 'WIDE',
                    sub: '৬টা Row, ৪টা Column',
                    viewBox: '0 0 400 250',
                    height: 250,
                    minWidth: 340,
                    children: (
                        <g>
                            {['month', 'confirmed', 'pending', 'cancelled'].map((h, i) => (
                                <SketchText key={h} x={[55, 155, 250, 345][i]} y={18} size={10} bold accent={i > 0}>
                                    {h}
                                </SketchText>
                            ))}
                            {WIDE_ROWS.map(([m, c, p, x], r) => (
                                <g key={m}>
                                    <Cell x={10} y={26 + r * 24} w={90} text={m} />
                                    <Cell x={105} y={26 + r * 24} w={95} text={c} />
                                    <Cell x={205} y={26 + r * 24} w={90} text={p} muted={p === '0'} />
                                    <Cell x={300} y={26 + r * 24} w={90} text={x} muted={x === '0'} />
                                </g>
                            ))}
                            <SketchText x={200} y={190} size={10} body accent>
                                status এর তিনটা মান এখন তিনটা Column এর নাম
                            </SketchText>
                            <SketchText x={200} y={212} size={10} body opacity={0.7}>
                                ফাঁকা ঘর মানে সেই মাসে সেই অবস্থার Booking নেই
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 2. জানুয়ারির ছয়টা Booking, তিনটা ছাঁকনি                                       */
/* ------------------------------------------------------------------------- */

const JANUARY: { id: number; status: 'confirmed' | 'cancelled' }[] = [
    { id: 4, status: 'confirmed' },
    { id: 5, status: 'cancelled' },
    { id: 3, status: 'confirmed' },
    { id: 6, status: 'confirmed' },
    { id: 7, status: 'confirmed' },
    { id: 12, status: 'cancelled' },
];

const GATES = [
    { status: 'confirmed', y: 40, count: '4' },
    { status: 'pending', y: 110, count: '0' },
    { status: 'cancelled', y: 180, count: '2' },
] as const;

/**
 * How one row of the pivot is filled. The six real January 2026 bookings all
 * belong to one group; each FILTER lets through only its own status and counts
 * what passes, so one group becomes one row with three cells.
 */
export function FilterGatesDiagram() {
    return (
        <Sketch
            label='FILTER: একটা দল, তিনটা ছাঁকনি, তিনটা ঘর'
            height={250}
            minWidth={760}
            viewBox='0 0 760 250'
            caption={
                <>
                    জানুয়ারি 2026 এর ছয়টা Booking একটা দলে পড়ে, কারণ GROUP BY মাস ধরে দল বানায়। তারপর একই ছয়টা Row তিনটা
                    আলাদা Aggregate এর কাছে যায়, আর প্রতিটা <code>FILTER (WHERE …)</code> শুধু নিজের অবস্থার Row গুনে নেয়। তাই
                    confirmed পায় 4, cancelled পায় 2, আর pending এর ছাঁকনি দিয়ে কিছুই যায় না বলে 0। ছয়টা Row থেকে একটা Row,
                    তিনটা ঘর সহ।
                </>
            }>
            <defs>
                <marker
                    id='pivot-gate-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchText x={95} y={22} size={10} bold>
                2026-01 এর Booking
            </SketchText>
            {JANUARY.map((b, i) => (
                <Cell
                    key={b.id}
                    x={20}
                    y={32 + i * 32}
                    w={150}
                    h={24}
                    text={`#${b.id}  ${b.status}`}
                    accent={b.status === 'cancelled'}
                />
            ))}
            {GATES.map(g => (
                <g key={g.status}>
                    <rect
                        x={300}
                        y={g.y}
                        width={230}
                        height={34}
                        fill='var(--primary)'
                        fillOpacity={0.05}
                        stroke='var(--primary)'
                        strokeOpacity={0.6}
                        strokeWidth='1.1'
                    />
                    <SketchText x={415} y={g.y + 21} size={9.5} accent>
                        {`FILTER (WHERE status = '${g.status}')`}
                    </SketchText>
                    <line
                        x1={534}
                        y1={g.y + 17}
                        x2={600}
                        y2={g.y + 17}
                        stroke='var(--primary)'
                        strokeWidth='1.2'
                        markerEnd='url(#pivot-gate-arrow)'
                    />
                    <Cell x={606} y={g.y + 5} w={130} h={24} text={`${g.status}: ${g.count}`} accent={g.count !== '0'} muted={g.count === '0'} bold />
                </g>
            ))}
            {JANUARY.map((b, i) => {
                const gate = GATES.find(g => g.status === b.status)!;
                return (
                    <line
                        key={b.id}
                        x1={172}
                        y1={44 + i * 32}
                        x2={298}
                        y2={gate.y + 17}
                        stroke='currentColor'
                        strokeOpacity={0.3}
                        strokeWidth='1'
                    />
                );
            })}
            <SketchText x={415} y={236} size={10} body opacity={0.75}>
                pending এর ছাঁকনিতে কোনো দাগ পৌঁছায় না, তাই ঘরে 0
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. crosstab: এক Argument বনাম দুই Argument                                   */
/* ------------------------------------------------------------------------- */

/**
 * The trap in the one-argument crosstab, taken from a real PostgreSQL 18 run:
 * values are poured into the columns left to right, so January's cancelled
 * count lands in the first column. The two-argument form places each value by
 * its category name.
 */
export function CrosstabFormsSplit() {
    return (
        <SketchSplit
            label='crosstab: বাঁ থেকে ভরা বনাম নাম ধরে বসানো'
            caption={
                <>
                    দুই পাশে একই Source Query, একই দুটো মাস, PostgreSQL 18 এ চালানো আসল ফলাফল। বাঁয়ে এক Argument এর crosstab:
                    সে status এর নাম দেখেই না, প্রতিটা মাসের মানগুলো বাঁ দিক থেকে পরপর ঢেলে দেয়। জানুয়ারিতে cancelled আগে আসে
                    (অক্ষর ক্রমে), তাই প্রথম Column এ বসে 2, যেটাকে কেউ confirmed ভেবে পড়লে ভুল Report। ডানে দুই Argument এর
                    crosstab, যার দ্বিতীয় Query তিনটা অবস্থার নাম ক্রমসহ বলে দেয়, তাই প্রতিটা মান নিজের Column এ বসে।
                </>
            }
            panels={[
                {
                    title: 'crosstab(source)',
                    sub: 'বাঁ থেকে ভরে',
                    viewBox: '0 0 380 230',
                    height: 230,
                    minWidth: 330,
                    children: (
                        <g>
                            <SketchText x={190} y={18} size={9.5} opacity={0.7}>
                                Source Row: 2026-01 cancelled 2, 2026-01 confirmed 4
                            </SketchText>
                            {['month', 'c1', 'c2', 'c3'].map((h, i) => (
                                <SketchText key={h} x={[60, 160, 245, 330][i]} y={50} size={10} bold>
                                    {h}
                                </SketchText>
                            ))}
                            <Cell x={15} y={58} w={90} text='2026-01' />
                            <Cell x={115} y={58} w={90} text='2' accent />
                            <Cell x={205} y={58} w={80} text='4' />
                            <Cell x={290} y={58} w={80} text='' dashed />
                            <Cell x={15} y={84} w={90} text='2026-10' />
                            <Cell x={115} y={84} w={90} text='5' />
                            <Cell x={205} y={84} w={80} text='4' />
                            <Cell x={290} y={84} w={80} text='' dashed />
                            <SketchText x={190} y={140} size={10} body accent>
                                জানুয়ারির c1 = cancelled এর 2
                            </SketchText>
                            <SketchText x={190} y={162} size={10} body accent>
                                অক্টোবরের c1 = confirmed এর 5
                            </SketchText>
                            <SketchText x={190} y={192} size={10} body opacity={0.75}>
                                একই Column, দুই Row এ দুই রকম মানে
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'crosstab(source, categories)',
                    sub: 'নাম ধরে বসায়',
                    viewBox: '0 0 380 230',
                    height: 230,
                    minWidth: 330,
                    children: (
                        <g>
                            <SketchText x={190} y={18} size={9.5} opacity={0.7}>
                                Category: confirmed, pending, cancelled
                            </SketchText>
                            {['month', 'confirmed', 'pending', 'cancelled'].map((h, i) => (
                                <SketchText key={h} x={[60, 160, 245, 330][i]} y={50} size={10} bold accent={i > 0}>
                                    {h}
                                </SketchText>
                            ))}
                            <Cell x={15} y={58} w={90} text='2026-01' />
                            <Cell x={115} y={58} w={90} text='4' accent />
                            <Cell x={205} y={58} w={80} text='' dashed />
                            <Cell x={290} y={58} w={80} text='2' accent />
                            <Cell x={15} y={84} w={90} text='2026-10' />
                            <Cell x={115} y={84} w={90} text='5' accent />
                            <Cell x={205} y={84} w={80} text='4' accent />
                            <Cell x={290} y={84} w={80} text='' dashed />
                            <SketchText x={190} y={140} size={10} body accent>
                                প্রতিটা মান নিজের নামের Column এ
                            </SketchText>
                            <SketchText x={190} y={162} size={10} body opacity={0.75}>
                                না থাকা ঘর ফাঁকা, মানে NULL, 0 না
                            </SketchText>
                            <SketchText x={190} y={192} size={10} body opacity={0.75}>
                                0 চাইলে বাইরে coalesce
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. উল্টো পথ: Wide থেকে Long                                                  */
/* ------------------------------------------------------------------------- */

/**
 * Unpivot on one real row: October 2026 as a wide row of three counts becomes
 * three long rows through a LATERAL VALUES list, and WHERE n > 0 removes the
 * empty cancelled cell.
 */
export function UnpivotDiagram() {
    return (
        <Sketch
            label='Unpivot: একটা চওড়া Row থেকে তিনটা লম্বা Row'
            height={230}
            minWidth={760}
            viewBox='0 0 760 230'
            caption={
                <>
                    অক্টোবর 2026 এর চওড়া Row এ তিনটা ঘর: confirmed 5, pending 4, cancelled 0। LATERAL এর ভেতরের VALUES তালিকা
                    এই Row এর তিনটা ঘর থেকে তিনটা নতুন Row বানায়, প্রতিটায় অবস্থার নাম আর সংখ্যা। শেষে{' '}
                    <code>WHERE n &gt; 0</code> ফাঁকা ঘরটা ফেলে দেয়, তাই ফেরে দুটো Row, ঠিক সেই দুটো যা GROUP BY শুরুতে দিয়েছিল।
                </>
            }>
            <defs>
                <marker
                    id='pivot-unpivot-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {['month', 'confirmed', 'pending', 'cancelled'].map((h, i) => (
                <SketchText key={h} x={[60, 150, 230, 310][i]} y={40} size={10} bold>
                    {h}
                </SketchText>
            ))}
            <Cell x={20} y={50} w={80} text='2026-10' />
            <Cell x={105} y={50} w={90} text='5' accent />
            <Cell x={195} y={50} w={70} text='4' accent />
            <Cell x={270} y={50} w={80} text='0' muted />
            <line x1={360} y1={61} x2={420} y2={61} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#pivot-unpivot-arrow)' />
            <SketchText x={390} y={90} size={9.5} accent>
                LATERAL VALUES
            </SketchText>
            {['month', 'status', 'n'].map((h, i) => (
                <SketchText key={h} x={[475, 580, 670][i]} y={40} size={10} bold>
                    {h}
                </SketchText>
            ))}
            {[
                ['confirmed', '5', true],
                ['pending', '4', true],
                ['cancelled', '0', false],
            ].map(([s, n, keep], r) => (
                <g key={s as string}>
                    <Cell x={435} y={50 + r * 28} w={80} text='2026-10' muted={!keep} />
                    <Cell x={520} y={50 + r * 28} w={120} text={s as string} accent={keep as boolean} muted={!keep} />
                    <Cell x={645} y={50 + r * 28} w={60} text={n as string} accent={keep as boolean} muted={!keep} />
                </g>
            ))}
            <line x1={432} y1={117} x2={708} y2={117} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            <SketchText x={570} y={160} size={10} body accent>
                WHERE n &gt; 0 ফাঁকা ঘরের Row টা ফেলে দেয়
            </SketchText>
            <SketchText x={380} y={200} size={10} body opacity={0.75}>
                Chart আর BI Tool প্রায়ই এই লম্বা আকারটাই চায়: একটা Column এ নাম, আরেকটায় মান
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. Module 08 এর সাতটা ধাপ                                                    */
/* ------------------------------------------------------------------------- */

const STAGES = [
    { lesson: 'Lesson 01', code: 'OVER ()', idea: 'Row না হারিয়ে হিসাব' },
    { lesson: 'Lesson 02', code: 'RANK', idea: 'নম্বর আর র‍্যাংক' },
    { lesson: 'Lesson 03', code: 'PARTITION', idea: 'দল ধরে আলাদা হিসাব' },
    { lesson: 'Lesson 04', code: 'FRAME', idea: 'চলমান যোগফল' },
    { lesson: 'Lesson 05', code: 'LAG', idea: 'আগের Row এর সাথে' },
    { lesson: 'Lesson 06', code: 'TOP N', idea: 'দলের সেরা আর ধারা' },
    { lesson: 'Lesson 07', code: 'PIVOT', idea: 'Row থেকে Column' },
];

/**
 * The whole module as one line of seven stations, from the first OVER () to
 * the pivoted report, used in the module recap.
 */
export function ModuleEightStoryDiagram() {
    const w = 108;
    const gap = 12;
    const start = (900 - (STAGES.length * w + (STAGES.length - 1) * gap)) / 2;
    return (
        <Sketch
            label='Module 08: Row রেখে হিসাব, তারপর Report এর আকার'
            height={210}
            minWidth={900}
            viewBox='0 0 900 210'
            caption={
                <>
                    Module 07 পর্যন্ত একটা দলের হিসাব মানে Row গুলো হারানো: GROUP BY একটা দলকে একটা Row বানায়। Module 08 এর
                    Window Function সেই হিসাব প্রতিটা Row এর পাশে রেখে দেয়: পুরো Table এর গড়, দলের ভেতরে র‍্যাংক, চলমান যোগফল,
                    আগের Row এর সাথে তুলনা, দলের সেরা কয়েকটা। শেষ লেসন সেই ফলাফলকে মানুষের পড়ার আকারে সাজায়: মাস নিচে নিচে,
                    অবস্থা পাশে পাশে।
                </>
            }>
            <defs>
                <marker
                    id='pivot-story-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {STAGES.map((stage, i) => {
                const x = start + i * (w + gap);
                const mid = x + w / 2;
                const last = i === STAGES.length - 1;
                return (
                    <g key={stage.code}>
                        <SketchText x={mid} y={36} size={9.5} opacity={0.6}>
                            {stage.lesson}
                        </SketchText>
                        <rect
                            x={x}
                            y={48}
                            width={w}
                            height={44}
                            fill='var(--primary)'
                            fillOpacity={last ? 0.16 : 0.05}
                            stroke='var(--primary)'
                            strokeOpacity={0.75}
                            strokeWidth='1.2'
                        />
                        <SketchText x={mid} y={75} size={10.5} bold accent>
                            {stage.code}
                        </SketchText>
                        <SketchText x={mid} y={118} size={9.5} body bold>
                            {stage.idea}
                        </SketchText>
                        {!last && (
                            <line
                                x1={x + w + 2}
                                y1={70}
                                x2={x + w + gap - 2}
                                y2={70}
                                stroke='var(--primary)'
                                strokeWidth='1.2'
                                markerEnd='url(#pivot-story-arrow)'
                            />
                        )}
                    </g>
                );
            })}
            <SketchText x={450} y={168} size={10.5} body>
                শেষে সবগুলো একসাথে: মাসের আয়, তার চলমান যোগফল, আগের মাসের সাথে পার্থক্য,
            </SketchText>
            <SketchText x={450} y={190} size={10.5} body>
                আয়ের র‍্যাংক আর সেই মাসের সেরা ট্যুর, একটা Report এ
            </SketchText>
        </Sketch>
    );
}
