import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. একটা CTE এর গঠন                                                          */
/* ------------------------------------------------------------------------- */

function CodeLine({ x, y, children, accent, dim }: { x: number; y: number; children: React.ReactNode; accent?: boolean; dim?: boolean }) {
    return (
        <SketchText x={x} y={y} size={11.5} anchor='start' accent={accent} opacity={dim ? 0.6 : 1}>
            {children}
        </SketchText>
    );
}

function Callout({ x1, y, x2, label, sub }: { x1: number; y: number; x2: number; label: string; sub: string }) {
    return (
        <g>
            <line x1={x1} y1={y - 4} x2={x2 - 8} y2={y - 4} stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1' strokeDasharray='3 3' />
            <circle cx={x2 - 4} cy={y - 4} r={3} fill='var(--primary)' />
            <SketchText x={x2 + 6} y={y - 6} size={10.5} anchor='start' bold accent>
                {label}
            </SketchText>
            <SketchText x={x2 + 6} y={y + 9} size={10} anchor='start' body opacity={0.8}>
                {sub}
            </SketchText>
        </g>
    );
}

/**
 * The parts of a WITH statement, read top to bottom: the keyword, each named
 * step with its query in brackets, the comma between steps, and the main query
 * that finally produces the result.
 */
export function CteAnatomyDiagram() {
    return (
        <Sketch
            label='Anatomy of a WITH Statement'
            height={380}
            minWidth={920}
            viewBox='0 0 940 380'
            caption='WITH দিয়ে শুরু, তারপর একটা একটা নাম দেওয়া ধাপ, প্রতিটার Query বন্ধনীর ভেতরে, ধাপগুলোর মাঝে কমা। শেষে একটা সাধারণ Query, যেটা আগের ধাপগুলোকে Table এর মতো পড়ে। পুরোটা মিলে একটাই Statement, তাই সেমিকোলন বসে একদম শেষে, মাঝে কোথাও না।'>
            <rect x={20} y={20} width={470} height={340} fill='var(--card)' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.2' />
            <rect x={20} y={20} width={470} height={26} fill='var(--primary)' fillOpacity={0.1} />
            <SketchText x={34} y={37} size={10} anchor='start' bold accent>
                report.sql
            </SketchText>

            <CodeLine x={40} y={74} accent>WITH confirmed AS (</CodeLine>
            <CodeLine x={64} y={96} dim>SELECT b.total_bdt, d.tour_id</CodeLine>
            <CodeLine x={64} y={116} dim>FROM bookings b JOIN departures d ...</CodeLine>
            <CodeLine x={64} y={136} dim>{"WHERE b.status = 'confirmed'"}</CodeLine>
            <CodeLine x={40} y={158} accent>),</CodeLine>
            <CodeLine x={40} y={186} accent>revenue_by_destination AS (</CodeLine>
            <CodeLine x={64} y={208} dim>SELECT ds.name, sum(c.total_bdt) AS revenue</CodeLine>
            <CodeLine x={64} y={228} dim>FROM confirmed c JOIN tours t ...</CodeLine>
            <CodeLine x={64} y={248} dim>GROUP BY ds.name</CodeLine>
            <CodeLine x={40} y={270} accent>)</CodeLine>
            <CodeLine x={40} y={300}>SELECT name, revenue</CodeLine>
            <CodeLine x={40} y={320}>FROM revenue_by_destination</CodeLine>
            <CodeLine x={40} y={340}>ORDER BY revenue DESC;</CodeLine>

            <Callout x1={200} y={74} x2={520} label='WITH' sub='একবারই লেখা হয়, সবার আগে' />
            <Callout x1={170} y={108} x2={520} label='নাম AS ( Query )' sub='প্রথম ধাপ, নাম confirmed' />
            <Callout x1={60} y={158} x2={520} label='কমা' sub='পরের ধাপ আসছে, সেমিকোলন না' />
            <Callout x1={270} y={220} x2={520} label='পরের ধাপ' sub='আগের ধাপকে Table এর মতো পড়ে' />
            <Callout x1={60} y={270} x2={520} label='শেষ বন্ধনী, কমা নেই' sub='ধাপের তালিকা এখানে শেষ' />
            <Callout x1={250} y={320} x2={520} label='মূল Query' sub='ফলাফল আসে শুধু এখান থেকে' />
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. ভেতর থেকে বাইরে বনাম উপর থেকে নিচে                                         */
/* ------------------------------------------------------------------------- */

function StepBadge({ x, y, n }: { x: number; y: number; n: number }) {
    return (
        <g>
            <circle cx={x} cy={y} r={11} fill='var(--primary)' fillOpacity={0.15} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={x} y={y + 4} size={10.5} bold accent>
                {n}
            </SketchText>
        </g>
    );
}

/**
 * The same three-step report as nested derived tables (read from the innermost
 * bracket outwards) and as a WITH chain (read in the order it is written).
 */
export function InsideOutVsTopDownSplit() {
    return (
        <SketchSplit
            label='Inside Out vs Top Down'
            caption='বাঁ দিকে Derived Table: প্রথম কাজটা সবচেয়ে ভেতরের বন্ধনীতে, তাই চোখ যায় মাঝখানে, তারপর বাইরের দিকে। ডান দিকে একই কাজ WITH দিয়ে: যে ক্রমে কাজ হয়, ঠিক সেই ক্রমে লেখা, উপর থেকে নিচে। Database এর কাছে দুটো একই, পার্থক্য শুধু মানুষের পড়ায়।'
            panels={[
                {
                    title: 'Derived Tables',
                    sub: 'ভেতর থেকে বাইরে পড়তে হয়',
                    viewBox: '0 0 400 260',
                    height: 260,
                    minWidth: 320,
                    children: (
                        <g>
                            <rect x={20} y={20} width={360} height={220} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
                            <SketchText x={34} y={40} size={10} anchor='start' opacity={0.85}>
                                SELECT ... FROM (
                            </SketchText>
                            <rect x={50} y={52} width={300} height={150} fill='var(--primary)' fillOpacity={0.04} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
                            <SketchText x={64} y={72} size={10} anchor='start' opacity={0.85}>
                                SELECT ... FROM (
                            </SketchText>
                            <rect x={80} y={84} width={240} height={86} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.2' />
                            <SketchText x={96} y={108} size={10} anchor='start'>
                                SELECT ... FROM bookings
                            </SketchText>
                            <SketchText x={96} y={128} size={10} anchor='start'>
                                {"WHERE status = 'confirmed'"}
                            </SketchText>
                            <SketchText x={64} y={192} size={10} anchor='start' opacity={0.85}>
                                ) c GROUP BY ...
                            </SketchText>
                            <SketchText x={34} y={226} size={10} anchor='start' opacity={0.85}>
                                ) r CROSS JOIN ( আবার একই কথা ) a
                            </SketchText>
                            <StepBadge x={300} y={150} n={1} />
                            <StepBadge x={330} y={192} n={2} />
                            <StepBadge x={360} y={226} n={3} />
                        </g>
                    ),
                },
                {
                    title: 'WITH Chain',
                    sub: 'লেখার ক্রমেই পড়া যায়',
                    viewBox: '0 0 400 260',
                    height: 260,
                    minWidth: 320,
                    children: (
                        <g>
                            {[
                                { y: 20, label: 'confirmed AS ( ... )', note: 'confirmed Booking' },
                                { y: 80, label: 'revenue_by_destination AS ( ... )', note: 'জায়গা প্রতি আয়' },
                                { y: 140, label: 'average AS ( ... )', note: 'গড় আয়' },
                                { y: 200, label: 'SELECT ... FROM ...', note: 'মূল Query' },
                            ].map((box, i) => (
                                <g key={box.label}>
                                    <rect
                                        x={50}
                                        y={box.y}
                                        width={320}
                                        height={44}
                                        fill={i === 3 ? 'var(--primary)' : 'transparent'}
                                        fillOpacity={i === 3 ? 0.1 : 0}
                                        stroke={i === 3 ? 'var(--primary)' : 'currentColor'}
                                        strokeOpacity={i === 3 ? 1 : 0.5}
                                        strokeWidth='1.2'
                                    />
                                    <SketchText x={66} y={box.y + 19} size={10} anchor='start' bold={i === 3} accent={i === 3}>
                                        {box.label}
                                    </SketchText>
                                    <SketchText x={66} y={box.y + 35} size={9.5} anchor='start' body opacity={0.75}>
                                        {box.note}
                                    </SketchText>
                                    <StepBadge x={26} y={box.y + 22} n={i + 1} />
                                </g>
                            ))}
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. কোন ধাপ কোন ধাপকে পড়ে                                                     */
/* ------------------------------------------------------------------------- */

function ChainBox({ x, y, w, name, rows, accent }: { x: number; y: number; w: number; name: string; rows: string; accent?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={56}
                fill={accent ? 'var(--primary)' : 'var(--card)'}
                fillOpacity={accent ? 0.12 : 1}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 1 : 0.5}
                strokeWidth='1.3'
            />
            <SketchText x={x + w / 2} y={y + 24} size={11} bold accent={accent}>
                {name}
            </SketchText>
            <SketchText x={x + w / 2} y={y + 42} size={9.5} opacity={0.7}>
                {rows}
            </SketchText>
        </g>
    );
}

/**
 * The owner's report as a chain: bookings feed `confirmed`, which feeds
 * `revenue_by_destination`, which is read twice: by `average` and by the main
 * query. Row counts are the real ones from the sample data.
 */
export function CteChainDiagram() {
    const arrow = (d: string) => (
        <path d={d} fill='none' stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#cte-chain-arrow)' />
    );
    return (
        <Sketch
            label='Who Reads Whom'
            height={300}
            minWidth={940}
            viewBox='0 0 960 300'
            caption='প্রতিটা তীর মানে "এই ধাপ ওই ধাপের ফলাফল পড়ে"। revenue_by_destination থেকে দুটো তীর বেরিয়েছে: average তাকে পড়ে গড় বের করতে, আর মূল Query তাকে পড়ে প্রতিটা জায়গার Row দেখাতে। একই ধাপ দুই জায়গায় কাজে লাগল, অথচ লেখা হয়েছে একবার। বন্ধনীর সংখ্যাগুলো আসল Sample Data এর Row।'>
            <defs>
                <marker id='cte-chain-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <ChainBox x={20} y={40} w={150} name='bookings' rows='24 rows (Table)' />
            <ChainBox x={20} y={180} w={150} name='departures' rows='16 rows (Table)' />
            <ChainBox x={230} y={110} w={160} name='confirmed' rows='17 rows' />
            <ChainBox x={450} y={110} w={210} name='revenue_by_destination' rows='6 rows' />
            <ChainBox x={720} y={30} w={200} name='average' rows='1 row: 70600' />
            <ChainBox x={720} y={190} w={200} name='মূল SELECT' rows='6 rows' accent />
            {arrow('M 170 68 L 226 128')}
            {arrow('M 170 208 L 226 152')}
            {arrow('M 390 138 L 446 138')}
            {arrow('M 660 128 L 716 66')}
            {arrow('M 660 150 L 716 212')}
            {arrow('M 820 86 L 820 186')}
            <SketchText x={310} y={186} size={9.5} opacity={0.75}>
                {"status = 'confirmed'"}
            </SketchText>
            <SketchText x={555} y={186} size={9.5} body opacity={0.75}>
                tours আর destinations এর সাথে জোড়া
            </SketchText>
            <SketchText x={555} y={204} size={9.5} body accent>
                লেখা একবার, পড়া দুইবার
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. কে কতক্ষণ বাঁচে                                                          */
/* ------------------------------------------------------------------------- */

/**
 * How long each kind of named query result lives: a CTE for one statement, a
 * temporary table for the session, a view until someone drops it.
 */
export function LifetimeDiagram() {
    const cols = [
        { x: 200, label: 'Statement 1' },
        { x: 330, label: 'Statement 2' },
        { x: 460, label: 'Statement 3' },
        { x: 600, label: 'Connection বন্ধ' },
        { x: 760, label: 'পরের দিন' },
    ];
    const bars = [
        { y: 80, name: 'CTE (WITH)', end: 300, note: 'শুধু নিজের Statement এর ভেতরে', accent: true },
        { y: 140, name: 'Derived Table', end: 300, note: 'শুধু নিজের FROM এর ভেতরে' },
        { y: 200, name: 'TEMP Table', end: 590, note: 'Connection যতক্ষণ খোলা' },
        { y: 260, name: 'VIEW', end: 900, note: 'DROP না করা পর্যন্ত, Database এ সংরক্ষিত' },
    ];
    return (
        <Sketch
            label='How Long Each One Lives'
            height={320}
            minWidth={920}
            viewBox='0 0 940 320'
            caption='CTE একটা Statement এর ভেতরেই জন্মায় আর সেখানেই শেষ। পরের Statement এ তার নাম লিখলে Database বলবে "relation does not exist"। বারবার লাগলে TEMP Table (Session জুড়ে) অথবা VIEW (স্থায়ী, Module 14) দরকার।'>
            {cols.map(c => (
                <g key={c.label}>
                    <line x1={c.x} y1={44} x2={c.x} y2={292} stroke='currentColor' strokeOpacity={0.2} strokeDasharray='3 4' />
                    <SketchText x={c.x} y={34} size={9.5} opacity={0.75}>
                        {c.label}
                    </SketchText>
                </g>
            ))}
            {bars.map(b => (
                <g key={b.name}>
                    <SketchText x={20} y={b.y + 15} size={10.5} anchor='start' bold accent={b.accent}>
                        {b.name}
                    </SketchText>
                    <rect
                        x={170}
                        y={b.y}
                        width={b.end - 170}
                        height={22}
                        fill='var(--primary)'
                        fillOpacity={b.accent ? 0.35 : 0.15}
                        stroke='var(--primary)'
                        strokeOpacity={0.7}
                        strokeWidth='1'
                    />
                    <SketchText
                        x={b.end > 700 ? 180 : b.end + 8}
                        y={b.y + 15}
                        size={9.5}
                        anchor='start'
                        body
                        opacity={0.85}>
                        {b.note}
                    </SketchText>
                </g>
            ))}
        </Sketch>
    );
}
