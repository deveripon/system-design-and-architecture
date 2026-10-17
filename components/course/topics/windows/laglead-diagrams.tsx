import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Shared bits                                                               */
/* ------------------------------------------------------------------------- */

function ArrowDefs({ id }: { id: string }) {
    return (
        <defs>
            <marker
                id={id}
                markerWidth={8}
                markerHeight={8}
                refX={7}
                refY={3.5}
                orient='auto'
                markerUnits='userSpaceOnUse'>
                <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
            </marker>
        </defs>
    );
}

function Cell({
    x,
    y,
    w,
    h,
    text,
    accent,
    head,
    dim,
    anchor = 'middle',
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
    accent?: boolean;
    head?: boolean;
    dim?: boolean;
    anchor?: 'start' | 'middle';
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={accent ? 'var(--primary)' : head ? 'currentColor' : 'transparent'}
                fillOpacity={accent ? 0.12 : head ? 0.06 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.9 : 0.3}
                strokeWidth='1'
            />
            <SketchText
                x={anchor === 'middle' ? x + w / 2 : x + 10}
                y={y + h / 2 + 4}
                size={11}
                anchor={anchor}
                bold={head}
                accent={accent}
                opacity={dim ? 0.45 : 1}>
                {text}
            </SketchText>
        </g>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. LAG পেছনে তাকায়, LEAD সামনে                                              */
/* ------------------------------------------------------------------------- */

const MONTHS: [string, string][] = [
    ['2025-12', '75000.00'],
    ['2026-01', '92000.00'],
    ['2026-02', '19000.00'],
    ['2026-03', '57600.00'],
    ['2026-09', '50500.00'],
    ['2026-10', '129500.00'],
];

/**
 * Six real monthly revenue rows. For the highlighted row (2026-02) LAG reads
 * the revenue one row up and LEAD reads it one row down; the first row has
 * nothing above it and the last nothing below, so those cells are NULL.
 */
export function LookBackAheadDiagram() {
    const x0 = 40;
    const y0 = 40;
    const rowH = 38;
    const cols = [
        { label: 'month', w: 120 },
        { label: 'revenue', w: 130 },
        { label: 'LAG(revenue)', w: 150 },
        { label: 'LEAD(revenue)', w: 150 },
    ];
    const colX = cols.map((_, i) => x0 + cols.slice(0, i).reduce((s, c) => s + c.w, 0));
    const lag = [null, '75000.00', '92000.00', '19000.00', '57600.00', '50500.00'];
    const lead = ['92000.00', '19000.00', '57600.00', '50500.00', '129500.00', null];
    const current = 2;
    const rowY = (i: number) => y0 + rowH * (i + 1);
    return (
        <Sketch
            label='LAG and LEAD on Six Real Rows'
            height={340}
            minWidth={880}
            viewBox='0 0 900 340'
            caption='২০২৬-০২ এর Row টা ধরুন। LAG তার ঠিক উপরের Row এর revenue পড়ে, 92000.00। LEAD ঠিক নিচের Row এর, 57600.00। প্রথম Row এর উপরে কেউ নেই, তাই তার LAG খালি, মানে NULL। শেষ Row এর নিচে কেউ নেই, তাই তার LEAD NULL। Row গুলো কোন ক্রমে সাজানো, সেটা ঠিক করে OVER এর ভেতরের ORDER BY month।'>
            <ArrowDefs id='laglead-look-arrow' />
            {cols.map((c, i) => (
                <Cell key={c.label} x={colX[i]} y={y0} w={c.w} h={rowH} text={c.label} head />
            ))}
            {MONTHS.map(([month, revenue], i) => {
                const y = rowY(i);
                const here = i === current;
                const isLagSource = i === current - 1;
                const isLeadSource = i === current + 1;
                return (
                    <g key={month}>
                        <Cell x={colX[0]} y={y} w={cols[0].w} h={rowH} text={month} accent={here} />
                        <Cell
                            x={colX[1]}
                            y={y}
                            w={cols[1].w}
                            h={rowH}
                            text={revenue}
                            accent={here || isLagSource || isLeadSource}
                        />
                        <Cell
                            x={colX[2]}
                            y={y}
                            w={cols[2].w}
                            h={rowH}
                            text={lag[i] ?? 'NULL'}
                            accent={here}
                            dim={lag[i] === null}
                        />
                        <Cell
                            x={colX[3]}
                            y={y}
                            w={cols[3].w}
                            h={rowH}
                            text={lead[i] ?? 'NULL'}
                            accent={here}
                            dim={lead[i] === null}
                        />
                    </g>
                );
            })}
            {/* LAG: from the current row's LAG cell up to the previous row's revenue */}
            <path
                d={`M ${colX[2] + 4} ${rowY(current) + rowH / 2} C ${colX[2] - 30} ${rowY(current)} ${colX[2] - 30} ${rowY(current - 1) + rowH / 2} ${colX[2] - 6} ${rowY(current - 1) + rowH / 2}`}
                fill='none'
                stroke='var(--primary)'
                strokeWidth='1.4'
                markerEnd='url(#laglead-look-arrow)'
            />
            {/* LEAD: from the current row's LEAD cell down to the next row's revenue */}
            <path
                d={`M ${colX[3] + 4} ${rowY(current) + rowH / 2} C ${colX[3] - 70} ${rowY(current) + rowH} ${colX[2] - 40} ${rowY(current + 1) + rowH / 2} ${colX[2] - 6} ${rowY(current + 1) + rowH / 2}`}
                fill='none'
                stroke='var(--primary)'
                strokeWidth='1.4'
                strokeDasharray='5 3'
                markerEnd='url(#laglead-look-arrow)'
            />
            <SketchText x={640} y={rowY(0) + 24} size={10.5} anchor='start' body opacity={0.8}>
                প্রথম Row: উপরে কেউ নেই, LAG = NULL
            </SketchText>
            <SketchText x={640} y={rowY(current) + 18} size={10.5} anchor='start' bold accent>
                এই Row এর জন্য:
            </SketchText>
            <SketchText x={640} y={rowY(current) + 36} size={10.5} anchor='start' body accent>
                LAG উপরের Row, LEAD নিচের Row
            </SketchText>
            <SketchText x={640} y={rowY(5) + 24} size={10.5} anchor='start' body opacity={0.8}>
                শেষ Row: নিচে কেউ নেই, LEAD = NULL
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. PARTITION BY এর দেয়াল                                                    */
/* ------------------------------------------------------------------------- */

const CUSTOMER_ROWS: { customer: number; booking: number; on: string; lag: string | null }[] = [
    { customer: 1, booking: 1, on: '2025-12-20', lag: null },
    { customer: 1, booking: 8, on: '2026-02-20', lag: '2025-12-20' },
    { customer: 1, booking: 17, on: '2026-10-08', lag: '2026-02-20' },
    { customer: 2, booking: 2, on: '2025-12-28', lag: null },
    { customer: 2, booking: 13, on: '2026-09-15', lag: '2025-12-28' },
    { customer: 13, booking: 15, on: '2026-09-20', lag: null },
    { customer: 13, booking: 24, on: '2026-10-14', lag: '2026-09-20' },
];

/** Vertical position of each row; a small gap between customers draws the wall. */
function placeRows(top: number, rowH: number) {
    return CUSTOMER_ROWS.map((row, i) => {
        const walls = CUSTOMER_ROWS.slice(1, i + 1).filter(
            (r, j) => r.customer !== CUSTOMER_ROWS[j].customer
        ).length;
        return { ...row, y: top + i * rowH + walls * 14 };
    });
}

/**
 * Customers 1, 2 and 13 with PARTITION BY customer_id: each customer is a
 * walled room, LAG only looks up inside its own room, so the first booking in
 * every room gets NULL instead of another customer's date.
 */
export function PartitionWallsDiagram() {
    const x0 = 60;
    const y0 = 36;
    const rowH = 34;
    const widths = [110, 100, 130, 150];
    const heads = ['customer_id', 'booking_id', 'booked_on', 'previous_on'];
    const colX = widths.map((_, i) => x0 + widths.slice(0, i).reduce((s, w) => s + w, 0));
    const tableW = widths.reduce((s, w) => s + w, 0);
    const placed = placeRows(y0 + rowH + 6, rowH);
    const y = placed[placed.length - 1].y + rowH;
    const rooms = [1, 2, 13].map(c => {
        const rows = placed.filter(r => r.customer === c);
        return { customer: c, top: rows[0].y, bottom: rows[rows.length - 1].y + rowH };
    });
    return (
        <Sketch
            label='PARTITION BY Builds Walls'
            height={y + 30}
            minWidth={860}
            viewBox={`0 0 880 ${y + 30}`}
            caption='PARTITION BY customer_id প্রতিটা Customer এর Booking গুলোকে আলাদা ঘরে রাখে। LAG শুধু নিজের ঘরের উপরের Row দেখে। তাই প্রতিটা ঘরের প্রথম Booking এর আগের তারিখ NULL, পাশের ঘরের অন্য কারো তারিখ না। Customer 2 এর প্রথম Booking এর ঠিক উপরে Customer 1 এর Booking আছে, কিন্তু দেয়াল পার হয়ে LAG সেটা পড়ে না।'>
            <ArrowDefs id='laglead-wall-arrow' />
            {heads.map((h, i) => (
                <Cell key={h} x={colX[i]} y={y0} w={widths[i]} h={rowH} text={h} head />
            ))}
            {rooms.map(room => (
                <rect
                    key={room.customer}
                    x={x0 - 8}
                    y={room.top - 4}
                    width={tableW + 16}
                    height={room.bottom - room.top + 8}
                    fill='var(--primary)'
                    fillOpacity={0.04}
                    stroke='var(--primary)'
                    strokeOpacity={0.55}
                    strokeWidth='1.3'
                />
            ))}
            {placed.map(row => (
                <g key={row.booking}>
                    <Cell x={colX[0]} y={row.y} w={widths[0]} h={rowH} text={String(row.customer)} />
                    <Cell x={colX[1]} y={row.y} w={widths[1]} h={rowH} text={String(row.booking)} />
                    <Cell x={colX[2]} y={row.y} w={widths[2]} h={rowH} text={row.on} />
                    <Cell
                        x={colX[3]}
                        y={row.y}
                        w={widths[3]}
                        h={rowH}
                        text={row.lag ?? 'NULL'}
                        accent={row.lag === null}
                        dim={false}
                    />
                </g>
            ))}
            {placed
                .filter(row => row.lag !== null)
                .map(row => (
                    <path
                        key={`a-${row.booking}`}
                        d={`M ${colX[3] + widths[3] + 6} ${row.y + rowH / 2} C ${colX[3] + widths[3] + 40} ${row.y + rowH / 2} ${colX[3] + widths[3] + 40} ${row.y - rowH / 2} ${colX[2] + widths[2] + 4} ${row.y - rowH / 2 + 2}`}
                        fill='none'
                        stroke='var(--primary)'
                        strokeOpacity={0.8}
                        strokeWidth='1.2'
                        markerEnd='url(#laglead-wall-arrow)'
                    />
                ))}
            {rooms.map(room => (
                <SketchText
                    key={`label-${room.customer}`}
                    x={x0 + tableW + 70}
                    y={room.top + 18}
                    size={10.5}
                    anchor='start'
                    body
                    accent>
                    {`Customer ${room.customer} এর ঘর`}
                </SketchText>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. আগের Row মানেই আগের মাস না                                               */
/* ------------------------------------------------------------------------- */

const FILLED: [string, string, boolean][] = [
    ['2025-12', '75000.00', false],
    ['2026-01', '92000.00', false],
    ['2026-02', '19000.00', false],
    ['2026-03', '57600.00', false],
    ['2026-04', '0', true],
    ['2026-05', '0', true],
    ['2026-06', '0', true],
    ['2026-07', '0', true],
    ['2026-08', '0', true],
    ['2026-09', '50500.00', false],
    ['2026-10', '129500.00', false],
];

function MonthList({
    rows,
    current,
    source,
    arrowId,
}: {
    rows: [string, string, boolean][];
    current: number;
    source: number;
    arrowId: string;
}) {
    const rowH = 26;
    const y0 = 16;
    return (
        <g>
            <ArrowDefs id={arrowId} />
            {rows.map(([month, revenue, filled], i) => {
                const y = y0 + i * rowH;
                const here = i === current || i === source;
                return (
                    <g key={month}>
                        <rect
                            x={70}
                            y={y}
                            width={190}
                            height={rowH - 4}
                            fill={here ? 'var(--primary)' : 'transparent'}
                            fillOpacity={here ? 0.12 : 0}
                            stroke={here ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={here ? 0.9 : filled ? 0.25 : 0.35}
                            strokeDasharray={filled ? '4 3' : undefined}
                            strokeWidth='1'
                        />
                        <SketchText x={82} y={y + 15} size={10.5} anchor='start' accent={here} opacity={filled ? 0.6 : 1}>
                            {month}
                        </SketchText>
                        <SketchText x={248} y={y + 15} size={10.5} anchor='end' accent={here} opacity={filled ? 0.6 : 1}>
                            {revenue}
                        </SketchText>
                    </g>
                );
            })}
            <path
                d={`M 64 ${y0 + current * rowH + 11} C 20 ${y0 + current * rowH + 11} 20 ${y0 + source * rowH + 11} 64 ${y0 + source * rowH + 11}`}
                fill='none'
                stroke='var(--primary)'
                strokeWidth='1.4'
                markerEnd={`url(#${arrowId})`}
            />
        </g>
    );
}

/**
 * The same LAG over confirmed revenue twice. Left: only months that have
 * bookings, so September's previous row is March, six months earlier. Right:
 * every calendar month generated first, so September's previous row is August
 * with 0.
 */
export function GapMonthsSplit() {
    return (
        <SketchSplit
            label='The Previous Row Is Not the Previous Month'
            caption='বাঁয়ে শুধু যেসব মাসে confirmed Booking আছে, ছয়টা Row। 2026-09 এর আগের Row হলো 2026-03, ছয় মাস আগের, তাই LAG বলে 57600.00 আর বদল দেখায় -7100.00, যেন আয় একটু কমেছে। ডানে আগে সব মাস বানিয়ে ফাঁকা মাসে 0 বসানো, এগারোটা Row। এবার 2026-09 এর আগের Row 2026-08, আয় 0, তাই বদল +50500.00। কোনটা সত্যি, সেটা নির্ভর করে প্রশ্নের উপর, কিন্তু মাস থেকে মাসের তুলনা চাইলে ডানেরটা।'
            panels={[
                {
                    title: 'শুধু Data থাকা মাস',
                    sub: '৬টা Row',
                    viewBox: '0 0 280 300',
                    height: 300,
                    minWidth: 280,
                    children: <MonthList rows={FILLED.filter(r => !r[2])} current={4} source={3} arrowId='laglead-gap-left' />,
                },
                {
                    title: 'আগে পুরো ক্যালেন্ডার',
                    sub: '১১টা Row, ফাঁকা মাসে 0',
                    viewBox: '0 0 280 300',
                    height: 300,
                    minWidth: 280,
                    children: <MonthList rows={FILLED} current={9} source={8} arrowId='laglead-gap-right' />,
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. LAST_VALUE এর ফাঁদ                                                      */
/* ------------------------------------------------------------------------- */

const TOUR1 = ['2026-01-15', '2026-02-12', '2026-11-20', '2026-12-18'];

/**
 * Tour 1's four departures with the second one as the current row. With only
 * ORDER BY, the frame ends at the current row, so LAST_VALUE returns the
 * current row itself. With the frame stretched to UNBOUNDED FOLLOWING it
 * returns the real last departure.
 */
export function LastValueTrapDiagram() {
    const x0 = 230;
    const y0 = 40;
    const rowH = 40;
    const current = 1;
    const rowY = (i: number) => y0 + i * rowH;
    return (
        <Sketch
            label='Why LAST_VALUE Looks Broken'
            height={260}
            minWidth={880}
            viewBox='0 0 900 260'
            caption='Tour 1 এর চারটা Departure, এখন দ্বিতীয় Row টা চলছে। OVER এ শুধু ORDER BY থাকলে Frame হয় শুরু থেকে এই Row পর্যন্ত, বাঁয়ের বন্ধনী। সেই Frame এর শেষ Row এই Row নিজেই, তাই LAST_VALUE দেয় 2026-02-12, এই Row এর নিজের তারিখ। Frame কে UNBOUNDED FOLLOWING পর্যন্ত টানলে, ডানের বন্ধনী, শেষ Row হয় 2026-12-18, যেটা আসলে চাওয়া হয়েছিল।'>
            {TOUR1.map((d, i) => (
                <Cell
                    key={d}
                    x={x0}
                    y={rowY(i)}
                    w={160}
                    h={rowH - 6}
                    text={d}
                    accent={i === current}
                />
            ))}
            {/* default frame bracket on the left */}
            <path
                d={`M ${x0 - 14} ${rowY(0)} H ${x0 - 30} V ${rowY(current) + rowH - 6} H ${x0 - 14}`}
                fill='none'
                stroke='var(--primary)'
                strokeWidth='1.6'
            />
            <SketchText x={x0 - 40} y={rowY(0) + 22} size={10.5} anchor='end' bold accent>
                শুধু ORDER BY
            </SketchText>
            <SketchText x={x0 - 40} y={rowY(0) + 40} size={10} anchor='end' body opacity={0.85}>
                Frame: শুরু থেকে এই Row
            </SketchText>
            <SketchText x={x0 - 40} y={rowY(0) + 58} size={10.5} anchor='end' accent>
                LAST_VALUE = 2026-02-12
            </SketchText>
            {/* full frame bracket on the right */}
            <path
                d={`M ${x0 + 174} ${rowY(0)} H ${x0 + 190} V ${rowY(3) + rowH - 6} H ${x0 + 174}`}
                fill='none'
                stroke='currentColor'
                strokeOpacity={0.7}
                strokeWidth='1.6'
                strokeDasharray='5 3'
            />
            <SketchText x={x0 + 204} y={rowY(1) + 4} size={10.5} anchor='start' bold>
                ROWS BETWEEN UNBOUNDED PRECEDING
            </SketchText>
            <SketchText x={x0 + 204} y={rowY(1) + 22} size={10.5} anchor='start' bold>
                AND UNBOUNDED FOLLOWING
            </SketchText>
            <SketchText x={x0 + 204} y={rowY(1) + 42} size={10} anchor='start' body opacity={0.85}>
                Frame: পুরো Partition, চারটা Row
            </SketchText>
            <SketchText x={x0 + 204} y={rowY(1) + 60} size={10.5} anchor='start'>
                LAST_VALUE = 2026-12-18
            </SketchText>
        </Sketch>
    );
}
