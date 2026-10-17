import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. অনেক Row ঢোকে, একটা মান বের হয়                                          */
/* ------------------------------------------------------------------------- */

/** Seats of the first eight real bookings, in booking_id order. */
const FIRST_SEATS = [2, 4, 1, 3, 2, 2, 1, 2];

/** Twenty-four booking rows go in, one number comes out, twice over. */
export function ManyToOneDiagram() {
    const rowX = 40;
    const rowW = 150;
    const rowH = 24;
    return (
        <Sketch
            label='Many Rows In, One Value Out'
            height={330}
            minWidth={860}
            viewBox='0 0 860 330'
            caption='বাঁ দিকে bookings Table এর প্রথম আটটা Row এর seats, আর তার নিচে আরও ষোলোটা। Aggregate Function সবগুলো Row পড়ে, কিন্তু ফেরত দেয় একটাই মান। SUM(seats) সব সিট যোগ করে দেয় 53, আর COUNT(*) শুধু Row গোনে, দেয় 24। প্রশ্ন বদলায়, কিন্তু আকৃতি একই: অনেক ঢোকে, একটা বের হয়।'>
            <defs>
                <marker
                    id='agg-many-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            <SketchText x={rowX + rowW / 2} y={24} size={10} bold>
                bookings.seats
            </SketchText>
            {FIRST_SEATS.map((seats, i) => {
                const y = 36 + i * (rowH + 4);
                return (
                    <g key={i}>
                        <rect
                            x={rowX}
                            y={y}
                            width={rowW}
                            height={rowH}
                            fill='transparent'
                            stroke='currentColor'
                            strokeOpacity={0.4}
                            strokeWidth='1.1'
                        />
                        <SketchText x={rowX + 12} y={y + 16} size={9.5} anchor='start' opacity={0.6}>
                            {`booking ${i + 1}`}
                        </SketchText>
                        <SketchText x={rowX + rowW - 14} y={y + 16} size={11} anchor='end' bold>
                            {seats}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={rowX + rowW / 2} y={278} size={10} body opacity={0.7}>
                আরও ষোলোটা Row, মোট 24
            </SketchText>

            {[0, 1].map(i => {
                const midY = i === 0 ? 110 : 220;
                return (
                    <path
                        key={i}
                        d={`M ${rowX + rowW + 10} ${midY} C 260 ${midY}, 300 ${midY}, 340 ${midY}`}
                        fill='none'
                        stroke='var(--primary)'
                        strokeWidth='1.3'
                        markerEnd='url(#agg-many-arrow)'
                    />
                );
            })}

            {[
                { y: 80, fn: 'SUM(seats)', sub: 'সব সিট যোগ', out: '53' },
                { y: 190, fn: 'COUNT(*)', sub: 'শুধু Row গোনা', out: '24' },
            ].map(box => (
                <g key={box.fn}>
                    <rect
                        x={350}
                        y={box.y}
                        width={200}
                        height={60}
                        fill='var(--primary)'
                        fillOpacity={0.08}
                        stroke='var(--primary)'
                        strokeWidth='1.3'
                    />
                    <SketchText x={450} y={box.y + 26} size={12} bold accent>
                        {box.fn}
                    </SketchText>
                    <SketchText x={450} y={box.y + 46} size={10} body opacity={0.75}>
                        {box.sub}
                    </SketchText>
                    <line
                        x1={556}
                        y1={box.y + 30}
                        x2={636}
                        y2={box.y + 30}
                        stroke='var(--primary)'
                        strokeWidth='1.3'
                        markerEnd='url(#agg-many-arrow)'
                    />
                    <rect
                        x={646}
                        y={box.y + 8}
                        width={110}
                        height={44}
                        fill='transparent'
                        stroke='currentColor'
                        strokeOpacity={0.55}
                        strokeWidth='1.3'
                    />
                    <SketchText x={701} y={box.y + 36} size={16} bold>
                        {box.out}
                    </SketchText>
                </g>
            ))}
            <SketchText x={701} y={290} size={10} body opacity={0.7}>
                ফলাফল: একটা Row, একটা মান
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. তিন রকম COUNT                                                          */
/* ------------------------------------------------------------------------- */

/** The real phone column: ten numbers and five NULLs, in customer_id order. */
const PHONES = [
    '…101', '…102', 'NULL', '…104', '…105', 'NULL', '…107', '…108',
    'NULL', 'NULL', 'NULL', '…112', '…113', '…114', '…115',
];

/** The real city column, in customer_id order. */
const CITIES = [
    'Dhaka', 'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Dhaka', 'Khulna', 'Dhaka',
    'Kolkata', 'Kuala Lumpur', 'London', 'Barishal', 'Dhaka', 'Chattogram', 'Dhaka',
];

function ColumnTiles({
    values,
    mark,
}: {
    values: string[];
    mark: (value: string, index: number) => 'plain' | 'null' | 'repeat';
}) {
    return (
        <>
            {values.map((value, i) => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                const x = 10 + col * 112;
                const y = 10 + row * 34;
                const kind = mark(value, i);
                return (
                    <g key={i}>
                        <rect
                            x={x}
                            y={y}
                            width={104}
                            height={26}
                            fill={kind === 'plain' ? 'var(--primary)' : 'transparent'}
                            fillOpacity={kind === 'plain' ? 0.08 : 0}
                            stroke={kind === 'plain' ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={kind === 'plain' ? 0.8 : 0.35}
                            strokeDasharray={kind === 'null' ? '4 3' : undefined}
                            strokeWidth='1.1'
                        />
                        <SketchText x={x + 52} y={y + 17} size={9.5} opacity={kind === 'plain' ? 1 : 0.5}>
                            {value}
                        </SketchText>
                    </g>
                );
            })}
        </>
    );
}

/** COUNT(*) against COUNT(phone), and COUNT(city) against COUNT(DISTINCT city), on the real columns. */
export function CountKindsSplit() {
    const seen = new Set<string>();
    const firstCity = CITIES.map(city => {
        const first = !seen.has(city);
        seen.add(city);
        return first;
    });
    return (
        <SketchSplit
            label='Three Kinds of COUNT'
            caption='বাঁয়ে customers Table এর phone Column: পনেরোটা ঘরের পাঁচটা NULL (দাগ কাটা)। COUNT(*) পনেরোটা Row ই গোনে, COUNT(phone) শুধু ভরা ঘরগুলো, তাই 10। ডানে city Column: কোনো ঘর ফাঁকা নেই, তাই COUNT(city) 15। কিন্তু COUNT(DISTINCT city) প্রতিটা শহর একবারই গোনে (রঙিন ঘর), Dhaka ছয়বার থাকলেও একবার, তাই 9।'
            panels={[
                {
                    title: 'customers.phone',
                    sub: 'COUNT(*) = 15 · COUNT(phone) = 10',
                    viewBox: '0 0 350 180',
                    height: 180,
                    minWidth: 320,
                    children: <ColumnTiles values={PHONES} mark={v => (v === 'NULL' ? 'null' : 'plain')} />,
                },
                {
                    title: 'customers.city',
                    sub: 'COUNT(city) = 15 · COUNT(DISTINCT city) = 9',
                    viewBox: '0 0 350 180',
                    height: 180,
                    minWidth: 320,
                    children: <ColumnTiles values={CITIES} mark={(_, i) => (firstCity[i] ? 'plain' : 'repeat')} />,
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. কিছুই না মিললে                                                          */
/* ------------------------------------------------------------------------- */

const EMPTY_ROWS = [
    { fn: 'count(*)', out: '0', note: 'গোনার কিছু নেই, তাই শূন্য' },
    { fn: 'sum(seats)', out: 'NULL', note: 'যোগ করার কিছু নেই, উত্তর অজানা' },
    { fn: 'avg(seats)', out: 'NULL', note: 'শূন্য দিয়ে ভাগের বদলে NULL' },
    { fn: 'max(total_bdt)', out: 'NULL', note: 'সবচেয়ে বড় কেউ নেই' },
    { fn: 'coalesce(sum(seats), 0)', out: '0', note: 'Report এ শূন্য দেখাতে চাইলে' },
];

/** What each aggregate returns when the WHERE lets no row through. */
export function EmptyInputDiagram() {
    return (
        <Sketch
            label='When No Row Matches'
            height={280}
            minWidth={760}
            viewBox='0 0 760 280'
            caption='1 November 2026 এর পরে করা Booking খুঁজলে কিছুই মেলে না। তবু Aggregate একটা Row ফেরত দেয়। COUNT সেখানে শূন্য বলে, কিন্তু SUM, AVG, MIN আর MAX বলে NULL, কারণ ফাঁকা একটা স্তূপের যোগফল বা গড় আসলে জানা নেই। Report এ শূন্য দেখাতে হলে COALESCE জুড়ে দিতে হয়।'>
            <SketchText x={20} y={28} size={10} anchor='start' bold>
                WHERE booked_at &gt;= &apos;2026-11-01&apos; → 0 Row
            </SketchText>
            {EMPTY_ROWS.map((row, i) => {
                const y = 52 + i * 42;
                const isNull = row.out === 'NULL';
                return (
                    <g key={row.fn}>
                        <rect
                            x={20}
                            y={y}
                            width={230}
                            height={32}
                            fill='transparent'
                            stroke='currentColor'
                            strokeOpacity={0.4}
                            strokeWidth='1.1'
                        />
                        <SketchText x={34} y={y + 21} size={11} anchor='start'>
                            {row.fn}
                        </SketchText>
                        <rect
                            x={270}
                            y={y}
                            width={90}
                            height={32}
                            fill={isNull ? 'transparent' : 'var(--primary)'}
                            fillOpacity={isNull ? 0 : 0.1}
                            stroke={isNull ? 'currentColor' : 'var(--primary)'}
                            strokeOpacity={isNull ? 0.4 : 1}
                            strokeDasharray={isNull ? '4 3' : undefined}
                            strokeWidth='1.2'
                        />
                        <SketchText x={315} y={y + 21} size={12} bold accent={!isNull}>
                            {row.out}
                        </SketchText>
                        <SketchText x={380} y={y + 21} size={10.5} anchor='start' body opacity={0.8}>
                            {row.note}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Database ভেতরে কী রাখে                                                  */
/* ------------------------------------------------------------------------- */

const STEPS = [
    { row: 'booking 1, seats 2', count: 1, sum: 2 },
    { row: 'booking 2, seats 4', count: 2, sum: 6 },
    { row: 'booking 3, seats 1', count: 3, sum: 7 },
    { row: 'booking 4, seats 3', count: 4, sum: 10 },
];

/** AVG(seats) as the database computes it: a running count and sum, one division at the end. */
export function RunningStateDiagram() {
    const boxW = 150;
    const gap = 26;
    return (
        <Sketch
            label='A Running Count and Sum'
            height={260}
            minWidth={920}
            viewBox='0 0 920 260'
            caption='AVG(seats) চালালে Database প্রতিটা Row এর জন্য একটা গড় বানায় না। সে দুটো ছোট খাতা রাখে: কয়টা Row দেখা হলো, আর এখন পর্যন্ত যোগফল কত। প্রতিটা নতুন Row এ খাতা দুটো একটু বাড়ে। সব 24 টা Row শেষ হলে একবারই ভাগ: 53 ÷ 24 = 2.2083…। এই কারণেই লাখ Row এর গড় বের করতেও খুব কম Memory লাগে।'>
            <defs>
                <marker
                    id='agg-state-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {STEPS.map((step, i) => {
                const x = 20 + i * (boxW + gap);
                return (
                    <g key={step.row}>
                        <SketchText x={x + boxW / 2} y={34} size={9.5} opacity={0.7}>
                            {step.row}
                        </SketchText>
                        <rect
                            x={x}
                            y={50}
                            width={boxW}
                            height={84}
                            fill='transparent'
                            stroke='currentColor'
                            strokeOpacity={0.45}
                            strokeWidth='1.2'
                        />
                        <SketchText x={x + 14} y={80} size={11} anchor='start'>
                            {`count = ${step.count}`}
                        </SketchText>
                        <SketchText x={x + 14} y={110} size={11} anchor='start'>
                            {`sum   = ${step.sum}`}
                        </SketchText>
                        <line
                            x1={x + boxW + 3}
                            y1={92}
                            x2={x + boxW + gap - 3}
                            y2={92}
                            stroke='var(--primary)'
                            strokeWidth='1.2'
                            markerEnd='url(#agg-state-arrow)'
                        />
                    </g>
                );
            })}
            <SketchText x={20 + 4 * (boxW + gap) + 40} y={96} size={14} bold opacity={0.6}>
                …
            </SketchText>
            <rect
                x={20 + 4 * (boxW + gap) + 70}
                y={50}
                width={150}
                height={84}
                fill='var(--primary)'
                fillOpacity={0.08}
                stroke='var(--primary)'
                strokeWidth='1.3'
            />
            <SketchText x={20 + 4 * (boxW + gap) + 145} y={34} size={9.5} accent bold>
                24 Row এর পরে
            </SketchText>
            <SketchText x={20 + 4 * (boxW + gap) + 84} y={80} size={11} anchor='start' accent>
                count = 24
            </SketchText>
            <SketchText x={20 + 4 * (boxW + gap) + 84} y={110} size={11} anchor='start' accent>
                sum   = 53
            </SketchText>
            <SketchText x={460} y={190} size={13} bold>
                avg = sum ÷ count = 53 ÷ 24 = 2.2083333333333333
            </SketchText>
            <SketchText x={460} y={220} size={10.5} body opacity={0.75}>
                ভাগ হয় একবারই, একদম শেষে
            </SketchText>
        </Sketch>
    );
}
