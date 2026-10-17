import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. মেনুর Combo: প্রতিটা Row প্রতিটা Row এর সাথে                                */
/* ------------------------------------------------------------------------- */

const COMBO_TOURS = [
    { title: 'Saint Martin Island Escape', price: '12500.00' },
    { title: 'Sylhet Tea Garden Tour', price: '7800.00' },
    { title: 'Ratargul Swamp Boat Day', price: '3500.00' },
];
const COMBO_PEOPLE = ['1', '2', '3'];

/**
 * Three real tours on the left, three party sizes on the right, and a line
 * for every pair. Nine lines, nine rows: that is the whole idea of CROSS JOIN.
 */
export function MenuComboDiagram() {
    const leftY = (i: number) => 60 + i * 80;
    const rightY = (i: number) => 60 + i * 80;
    return (
        <Sketch
            label='CROSS JOIN: Every Row Meets Every Row'
            height={330}
            minWidth={900}
            viewBox='0 0 900 330'
            caption='বাঁয়ে tours Table এর আসল তিনটা ট্যুর, ডানে মানুষের সংখ্যা ১, ২ আর ৩। CROSS JOIN কোনো মিল খোঁজে না, প্রতিটা বাঁয়ের Row কে প্রতিটা ডানের Row এর সাথে একবার করে জোড়া দেয়। প্রতিটা দাগ ফলাফলের একটা Row। তিনটা গুণ তিনটা, তাই নয়টা Row।'>
            {COMBO_TOURS.map((t, i) =>
                COMBO_PEOPLE.map((p, j) => (
                    <line
                        key={`${i}-${j}`}
                        x1={330}
                        y1={leftY(i) + 22}
                        x2={600}
                        y2={rightY(j) + 22}
                        stroke='var(--primary)'
                        strokeOpacity={0.55}
                        strokeWidth='1.2'
                    />
                ))
            )}
            {COMBO_TOURS.map((t, i) => (
                <g key={t.title}>
                    <rect
                        x={60}
                        y={leftY(i)}
                        width={270}
                        height={44}
                        fill='var(--card)'
                        stroke='currentColor'
                        strokeOpacity={0.45}
                        strokeWidth='1.2'
                    />
                    <SketchText x={74} y={leftY(i) + 19} anchor='start' size={10.5} bold>
                        {t.title}
                    </SketchText>
                    <SketchText x={74} y={leftY(i) + 35} anchor='start' size={9} opacity={0.7}>
                        price_bdt {t.price}
                    </SketchText>
                </g>
            ))}
            {COMBO_PEOPLE.map((p, j) => (
                <g key={p}>
                    <rect
                        x={600}
                        y={rightY(j)}
                        width={130}
                        height={44}
                        fill='var(--primary)'
                        fillOpacity={0.08}
                        stroke='var(--primary)'
                        strokeWidth='1.2'
                    />
                    <SketchText x={665} y={rightY(j) + 27} size={11} bold accent>
                        people = {p}
                    </SketchText>
                </g>
            ))}
            <SketchText x={195} y={32} size={10} bold opacity={0.8}>
                tours (৩টা Row)
            </SketchText>
            <SketchText x={665} y={32} size={10} bold opacity={0.8}>
                generate_series(1, 3)
            </SketchText>
            <SketchText x={465} y={32} size={10.5} bold accent>
                CROSS JOIN
            </SketchText>
            <SketchText x={815} y={150} size={22} bold accent>
                = ৯
            </SketchText>
            <SketchText x={815} y={172} size={9.5} body opacity={0.8}>
                ৩ × ৩ টা জোড়া
            </SketchText>
            <SketchText x={450} y={310} size={10} body opacity={0.8}>
                কোনো শর্ত নেই, তাই কোনো জোড়া বাদ যায় না
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. সংখ্যা গুণ হয়: চারটা ছোট Table, হাজার হাজার Row                            */
/* ------------------------------------------------------------------------- */

const GROWTH = [
    { label: 'tours', expr: '9', rows: 9 },
    { label: '× destinations', expr: '9 × 7', rows: 63 },
    { label: '× guides', expr: '63 × 5', rows: 315 },
    { label: '× customers', expr: '315 × 15', rows: 4725 },
];

/**
 * The real row counts as tables are cross joined one after another. Bar
 * heights are on a log scale, otherwise the first bar would be invisible.
 */
export function SizeMultiplyDiagram() {
    const base = 250;
    const maxLog = Math.log10(4725);
    return (
        <Sketch
            label='Row Counts Multiply'
            height={310}
            minWidth={900}
            viewBox='0 0 900 310'
            caption='সংখ্যাগুলো এই ট্র্যাকের Sample Database থেকে চালিয়ে পাওয়া। প্রতিটা নতুন Table আগের ফলাফলকে তার নিজের Row সংখ্যা দিয়ে গুণ করে। চারটা ছোট Table, যাদের কোনোটাতেই বিশটার বেশি Row নেই, মিলে ৪,৭২৫টা Row বানায়। দাগগুলোর উচ্চতা log স্কেলে, নইলে প্রথমটা চোখেই পড়ত না।'>
            <line x1={60} y1={base} x2={860} y2={base} stroke='currentColor' strokeOpacity={0.35} strokeWidth='1' />
            {GROWTH.map((g, i) => {
                const x = 90 + i * 200;
                const h = 30 + (Math.log10(g.rows) / maxLog) * 160;
                return (
                    <g key={g.label}>
                        <rect
                            x={x}
                            y={base - h}
                            width={110}
                            height={h}
                            fill='var(--primary)'
                            fillOpacity={0.12 + i * 0.07}
                            stroke='var(--primary)'
                            strokeWidth='1.2'
                        />
                        <SketchText x={x + 55} y={base - h - 12} size={14} bold accent>
                            {g.rows.toLocaleString('en-US')}
                        </SketchText>
                        <SketchText x={x + 55} y={base + 22} size={10.5} bold>
                            {g.label}
                        </SketchText>
                        <SketchText x={x + 55} y={base + 40} size={9.5} opacity={0.7}>
                            {g.expr}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. পুরনো Comma ধরন আর Explicit JOIN                                         */
/* ------------------------------------------------------------------------- */

function CodeLines({
    lines,
}: {
    lines: { text: string; tone?: 'accent' | 'warn' | 'muted' }[];
}) {
    return (
        <g>
            {lines.map((line, i) => (
                <SketchText
                    key={i}
                    x={16}
                    y={34 + i * 24}
                    anchor='start'
                    size={11}
                    bold={line.tone === 'accent'}
                    accent={line.tone === 'accent'}
                    opacity={line.tone === 'muted' ? 0.55 : 1}>
                    {line.text}
                </SketchText>
            ))}
        </g>
    );
}

/**
 * The same question written in the two styles. In the comma style the join
 * condition lives far away in WHERE, mixed with ordinary filters, so it is
 * easy to lose. In the JOIN style it is welded to the table it joins.
 */
export function CommaVsExplicitSplit() {
    return (
        <SketchSplit
            label='Where the Join Condition Lives'
            caption='দুটো Query একই উত্তর দেয়। বাঁয়েরটায় জোড়া লাগানোর শর্ত বসে WHERE এ, সাধারণ ছাঁকনির ভিড়ে। ওই একটা লাইন মুছে গেলে Query তবুও চলে, শুধু Row ২৪ থেকে ৩৬০ হয়ে যায়। ডানেরটায় শর্ত লেগে থাকে JOIN এর গায়ে, ON এর ভেতরে। ON মুছে দিলে PostgreSQL Query টা চালাতেই রাজি হয় না।'
            panels={[
                {
                    title: 'Comma Style',
                    sub: 'FROM a, b WHERE ...',
                    viewBox: '0 0 420 200',
                    height: 200,
                    minWidth: 360,
                    children: (
                        <>
                            <rect
                                x={8}
                                y={86}
                                width={404}
                                height={30}
                                fill='transparent'
                                stroke='var(--primary)'
                                strokeDasharray='4 3'
                                strokeWidth='1.2'
                            />
                            <CodeLines
                                lines={[
                                    { text: 'SELECT c.full_name, b.booking_id' },
                                    { text: 'FROM bookings b, customers c' },
                                    { text: "WHERE b.status = 'pending'" },
                                    { text: '  AND b.customer_id = c.customer_id', tone: 'accent' },
                                    { text: '-- এই লাইন হারালে: 4 নয়, 60 Row', tone: 'muted' },
                                ]}
                            />
                        </>
                    ),
                },
                {
                    title: 'Explicit JOIN',
                    sub: 'FROM a JOIN b ON ...',
                    viewBox: '0 0 420 200',
                    height: 200,
                    minWidth: 360,
                    children: (
                        <>
                            <rect
                                x={8}
                                y={62}
                                width={404}
                                height={30}
                                fill='var(--primary)'
                                fillOpacity={0.08}
                                stroke='var(--primary)'
                                strokeWidth='1.2'
                            />
                            <CodeLines
                                lines={[
                                    { text: 'SELECT c.full_name, b.booking_id' },
                                    { text: 'FROM bookings b' },
                                    { text: 'JOIN customers c ON c.customer_id = b.customer_id', tone: 'accent' },
                                    { text: "WHERE b.status = 'pending'" },
                                    { text: '-- ON ছাড়া JOIN: PostgreSQL এ Error', tone: 'muted' },
                                ]}
                            />
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Report এর Grid: ক্যালেন্ডার × ট্যুর, তারপর আসল সংখ্যা                       */
/* ------------------------------------------------------------------------- */

const GRID_MONTHS = ['2026-11', '2026-12', '2027-01', '2027-02'];

/** Active tours in report order, and which of the four months has a departure. */
const GRID_ROWS: { title: string; counts: number[] }[] = [
    { title: 'Bandarban Hill Trek', counts: [0, 0, 1, 0] },
    { title: "Cox's Bazar Beach Weekend", counts: [1, 0, 0, 0] },
    { title: "Cox's Bazar Family Package", counts: [0, 0, 0, 0] },
    { title: 'Ratargul Swamp Boat Day', counts: [1, 0, 0, 0] },
    { title: 'Saint Martin Island Escape', counts: [1, 1, 0, 0] },
    { title: 'Sajek Valley Cloud Trip', counts: [0, 1, 0, 0] },
    { title: 'Sundarbans Mangrove Cruise', counts: [0, 1, 0, 0] },
    { title: 'Sylhet Tea Garden Tour', counts: [1, 0, 0, 0] },
];

function MiniGrid({ x, filled }: { x: number; filled: boolean }) {
    const cw = 34;
    const ch = 20;
    return (
        <g>
            {GRID_MONTHS.map((m, j) => (
                <SketchText key={m} x={x + j * cw + cw / 2} y={52} size={7.5} opacity={0.7}>
                    {m.slice(2)}
                </SketchText>
            ))}
            {GRID_ROWS.map((row, i) =>
                row.counts.map((c, j) => {
                    const on = filled && c > 0;
                    return (
                        <g key={`${i}-${j}`}>
                            <rect
                                x={x + j * cw}
                                y={60 + i * ch}
                                width={cw - 4}
                                height={ch - 4}
                                fill={on ? 'var(--primary)' : 'transparent'}
                                fillOpacity={on ? 0.25 : 0}
                                stroke={on ? 'var(--primary)' : 'currentColor'}
                                strokeOpacity={on ? 1 : 0.35}
                                strokeWidth='1'
                            />
                            {filled && (
                                <SketchText
                                    x={x + j * cw + (cw - 4) / 2}
                                    y={60 + i * ch + 12}
                                    size={8.5}
                                    bold={on}
                                    accent={on}
                                    opacity={on ? 1 : 0.5}>
                                    {String(c)}
                                </SketchText>
                            )}
                        </g>
                    );
                })
            )}
        </g>
    );
}

/**
 * The three moves of a report grid on the real data: a calendar of months, a
 * cross join with the active tours to make every cell, then a LEFT JOIN that
 * fills each cell with a count, zero where nothing departs.
 */
export function GridStepsDiagram() {
    return (
        <Sketch
            label='Building a Report Grid'
            height={300}
            minWidth={960}
            viewBox='0 0 960 300'
            caption='প্রথমে চার মাসের একটা ক্যালেন্ডার, ধরুন চারটা Row। তারপর CROSS JOIN দিয়ে আটটা চালু ট্যুরের প্রতিটার সাথে প্রতিটা মাস: ৩২টা খালি ঘর, প্রতিটা ট্যুর আর মাসের জোড়ার জন্য একটা। শেষে LEFT JOIN দিয়ে departures থেকে আসল সংখ্যা ভরা হয়। আটটা ঘরে ১, বাকি ২৪টায় ০। শূন্যগুলোই এই Report এর আসল খবর: কোন মাসে কোন ট্যুরের কোনো তারিখ নেই।'>
            <SketchText x={90} y={30} size={10.5} bold accent>
                ১. মাসের তালিকা
            </SketchText>
            {GRID_MONTHS.map((m, i) => (
                <g key={m}>
                    <rect
                        x={40}
                        y={60 + i * 40}
                        width={100}
                        height={28}
                        fill='var(--primary)'
                        fillOpacity={0.08}
                        stroke='var(--primary)'
                        strokeWidth='1.1'
                    />
                    <SketchText x={90} y={60 + i * 40 + 18} size={10} bold>
                        {m}
                    </SketchText>
                </g>
            ))}
            <SketchText x={225} y={160} size={11} bold accent>
                × ৮ ট্যুর
            </SketchText>
            <SketchText x={410} y={30} size={10.5} bold accent>
                ২. CROSS JOIN: ৩২টা ঘর
            </SketchText>
            <MiniGrid x={340} filled={false} />
            <SketchText x={585} y={160} size={11} bold accent>
                LEFT JOIN
            </SketchText>
            <SketchText x={760} y={30} size={10.5} bold accent>
                ৩. গুনতি বসানো
            </SketchText>
            <MiniGrid x={690} filled />
        </Sketch>
    );
}
