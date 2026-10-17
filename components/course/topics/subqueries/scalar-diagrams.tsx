import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. একটা মান, একটা খালি ঘর                                                   */
/* ------------------------------------------------------------------------- */

/**
 * The inner query runs, gives back one cell, and that cell drops into the
 * empty slot of the outer query exactly where a typed number would have gone.
 */
export function ValueSlotDiagram() {
    return (
        <Sketch
            label='Scalar subquery: one value into one slot'
            height={300}
            minWidth={820}
            viewBox='0 0 820 300'
            caption='উপরের বাক্সটা ভেতরের Query। সে চলে, আর ফেরত দেয় ঠিক একটা ঘর: 13477.78। নিচের বাইরের Query তে একটা খালি জায়গা ছিল, যেখানে আগে আপনি হাতে একটা সংখ্যা লিখতেন। ভেতরের Query এর উত্তর ঠিক সেই জায়গায় বসে যায়, তারপর বাইরের Query সাধারণ একটা WHERE এর মতো চলে।'>
            <defs>
                <marker
                    id='scalar-slot-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* inner query */}
            <rect x={40} y={30} width={360} height={74} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={56} y={52} anchor='start' size={9.5} bold accent>
                ভেতরের Query, আগে চলে
            </SketchText>
            <SketchText x={56} y={82} anchor='start' size={11}>
                (SELECT avg(price_bdt) FROM tours)
            </SketchText>

            {/* the single cell it returns */}
            <line x1={404} y1={67} x2={484} y2={67} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#scalar-slot-arrow)' />
            <rect x={490} y={46} width={150} height={42} fill='var(--primary)' fillOpacity={0.14} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={565} y={72} size={12} bold accent>
                13477.78
            </SketchText>
            <SketchText x={565} y={110} size={9.5} body opacity={0.8}>
                ১টা Row, ১টা Column, ১টা মান
            </SketchText>

            {/* drop into the slot */}
            <path d='M 640 67 H 700 V 196' fill='none' stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#scalar-slot-arrow)' />

            {/* outer query */}
            <rect x={40} y={170} width={740} height={96} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={56} y={192} anchor='start' size={9.5} bold opacity={0.8}>
                বাইরের Query, পরে চলে
            </SketchText>
            <SketchText x={56} y={226} anchor='start' size={11}>
                SELECT title FROM tours WHERE price_bdt &gt;
            </SketchText>
            <rect x={628} y={204} width={146} height={34} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeDasharray='4 3' strokeWidth='1.2' />
            <SketchText x={701} y={226} size={11.5} bold accent>
                13477.78
            </SketchText>
            <SketchText x={56} y={254} anchor='start' size={9.5} body opacity={0.75}>
                আগে এখানে আপনি হাতে 13477.78 লিখতেন, এখন Database নিজে বসায়
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. দুই ধাপ: ভেতরের Query একবার, বাইরেরটা প্রতিটা Row তে                      */
/* ------------------------------------------------------------------------- */

const TOURS = [
    { id: 1, title: 'Saint Martin Island Escape', price: 12500 },
    { id: 2, title: "Cox's Bazar Beach Weekend", price: 8500 },
    { id: 3, title: 'Sundarbans Mangrove Cruise', price: 18000 },
    { id: 4, title: 'Sajek Valley Cloud Trip', price: 9500 },
    { id: 5, title: 'Bandarban Hill Trek', price: 14000 },
    { id: 6, title: 'Sylhet Tea Garden Tour', price: 7800 },
    { id: 7, title: 'Ratargul Swamp Boat Day', price: 3500 },
    { id: 8, title: 'Saint Martin Luxury Stay', price: 32000 },
    { id: 9, title: "Cox's Bazar Family Package", price: 15500 },
];

const AVG_ALL = TOURS.reduce((sum, t) => sum + t.price, 0) / TOURS.length;

/**
 * Step 1 reads all nine prices once and produces the average. Step 2 walks
 * the nine tours and compares each price with that one value.
 */
export function TwoStepsDiagram() {
    const rowY = (i: number) => 74 + i * 30;
    return (
        <Sketch
            label='Uncorrelated: inner once, outer per row'
            height={400}
            minWidth={860}
            viewBox='0 0 860 400'
            caption='বাম দিকে ধাপ ১: ভেতরের Query নয়টা দামের সবগুলো একবারই পড়ে, আর একটা গড় বানায়। ডান দিকে ধাপ ২: বাইরের Query নয়টা ট্যুরের প্রতিটার দাম সেই একটা গড়ের সাথে তুলনা করে। গড়টা একবারই হিসাব হয়েছে, নয়বার না। ভেতরের Query বাইরের কোনো Row এর ওপর নির্ভর করে না বলেই এটা সম্ভব।'>
            <defs>
                <marker
                    id='scalar-steps-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            <SketchText x={130} y={40} size={10.5} bold accent>
                ধাপ ১: ভেতরের Query, একবার
            </SketchText>
            {TOURS.map((t, i) => (
                <g key={`p${t.id}`}>
                    <rect x={70} y={rowY(i) - 14} width={120} height={24} fill='transparent' stroke='currentColor' strokeOpacity={0.4} />
                    <SketchText x={130} y={rowY(i) + 3} size={10}>
                        {t.price.toFixed(2)}
                    </SketchText>
                    <line x1={192} y1={rowY(i) - 2} x2={258} y2={194} stroke='currentColor' strokeOpacity={0.25} strokeWidth='1' />
                </g>
            ))}
            <circle cx={290} cy={194} r={32} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={290} y={198} size={11} bold accent>
                avg()
            </SketchText>
            <line x1={322} y1={194} x2={372} y2={194} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#scalar-steps-arrow)' />
            <rect x={378} y={176} width={110} height={36} fill='var(--primary)' fillOpacity={0.15} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={433} y={199} size={11} bold accent>
                {AVG_ALL.toFixed(2)}
            </SketchText>
            <SketchText x={433} y={232} size={9.5} body opacity={0.8}>
                এই একটা মানই
            </SketchText>
            <SketchText x={433} y={248} size={9.5} body opacity={0.8}>
                নয়বার ব্যবহার হবে
            </SketchText>

            <SketchText x={680} y={40} size={10.5} bold accent>
                ধাপ ২: বাইরের Query, প্রতিটা Row
            </SketchText>
            {TOURS.map((t, i) => {
                const kept = t.price > AVG_ALL;
                return (
                    <g key={`t${t.id}`} opacity={kept ? 1 : 0.5}>
                        <rect
                            x={520}
                            y={rowY(i) - 14}
                            width={310}
                            height={24}
                            fill={kept ? 'var(--primary)' : 'transparent'}
                            fillOpacity={kept ? 0.1 : 0}
                            stroke={kept ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={kept ? 0.9 : 0.35}
                        />
                        <SketchText x={532} y={rowY(i) + 3} anchor='start' size={9.5}>
                            {t.title}
                        </SketchText>
                        <SketchText x={760} y={rowY(i) + 3} anchor='end' size={9.5} accent={kept}>
                            {t.price.toFixed(2)}
                        </SketchText>
                        <SketchText x={818} y={rowY(i) + 3} anchor='end' size={10} bold accent={kept}>
                            {kept ? 'kept' : 'no'}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={675} y={360} size={9.5} body opacity={0.85}>
                নয়টার মধ্যে চারটা গড়ের বেশি, বাকি পাঁচটা বাদ
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. ভেতরের Query কী আকারে ফেরত দিল, তার ওপর সব নির্ভর করে                   */
/* ------------------------------------------------------------------------- */

const SHAPES: {
    title: string;
    query: string;
    cells: string[][];
    verdict: string;
    detail: string;
    ok: boolean;
}[] = [
    {
        title: '0 Row',
        query: 'tour_id = 99',
        cells: [],
        verdict: 'NULL',
        detail: 'Error নেই, মান NULL',
        ok: true,
    },
    {
        title: '1 Row, 1 Column',
        query: 'tour_id = 3',
        cells: [['18000.00']],
        verdict: '18000.00',
        detail: 'ঠিক যেমন চাওয়া হয়েছিল',
        ok: true,
    },
    {
        title: '2 Row',
        query: 'destination_id = 1',
        cells: [['12500.00'], ['32000.00']],
        verdict: 'ERROR 21000',
        detail: 'more than one row',
        ok: false,
    },
    {
        title: '2 Column',
        query: 'price_bdt, title',
        cells: [['12500.00', 'Saint Martin…']],
        verdict: 'ERROR 42601',
        detail: 'only one column',
        ok: false,
    },
];

/**
 * The four shapes an inner query can come back in, and what the outer query
 * makes of each: a value, a NULL, or one of two errors.
 */
export function ResultShapesDiagram() {
    const w = 196;
    const gap = 14;
    return (
        <Sketch
            label='What the inner query returned decides everything'
            height={290}
            minWidth={880}
            viewBox='0 0 880 290'
            caption='একই ধরনের ভেতরের Query, চার রকম ফলাফল। কোনো Row না এলে মানটা NULL, Error হয় না। ঠিক একটা Row আর একটা Column এলে সেটাই মান। দুটো Row এলে Database বুঝতে পারে না কোনটা নেবে, তাই Error 21000। দুটো Column এলে একটা ঘরে দুটো জিনিস বসানো যায় না, তাই Error 42601। শেষ দুটো আসল PostgreSQL 18 এর বার্তা।'>
            {SHAPES.map((s, i) => {
                const x = 12 + i * (w + gap);
                return (
                    <g key={s.title}>
                        <rect
                            x={x}
                            y={20}
                            width={w}
                            height={250}
                            fill='transparent'
                            stroke={s.ok ? 'currentColor' : 'var(--destructive)'}
                            strokeOpacity={s.ok ? 0.4 : 0.7}
                            strokeWidth='1.2'
                        />
                        <SketchText x={x + w / 2} y={44} size={10.5} bold accent={s.ok}>
                            {s.title}
                        </SketchText>
                        <SketchText x={x + w / 2} y={66} size={9} opacity={0.75}>
                            {s.query}
                        </SketchText>
                        {s.cells.length === 0 ? (
                            <g>
                                <rect x={x + 38} y={88} width={w - 76} height={30} fill='transparent' stroke='currentColor' strokeOpacity={0.35} strokeDasharray='4 3' />
                                <SketchText x={x + w / 2} y={108} size={9.5} body opacity={0.7}>
                                    কিছুই নেই
                                </SketchText>
                            </g>
                        ) : (
                            s.cells.map((row, r) =>
                                row.map((cell, c) => {
                                    const cw = (w - 40) / row.length;
                                    return (
                                        <g key={`${r}-${c}`}>
                                            <rect x={x + 20 + c * cw} y={88 + r * 32} width={cw} height={30} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
                                            <SketchText x={x + 20 + c * cw + cw / 2} y={108 + r * 32} size={9.5}>
                                                {cell}
                                            </SketchText>
                                        </g>
                                    );
                                })
                            )
                        )}
                        <rect
                            x={x + 18}
                            y={182}
                            width={w - 36}
                            height={38}
                            fill={s.ok ? 'var(--primary)' : 'var(--destructive)'}
                            fillOpacity={0.1}
                            stroke={s.ok ? 'var(--primary)' : 'var(--destructive)'}
                            strokeWidth='1.2'
                        />
                        <text
                            x={x + w / 2}
                            y={206}
                            textAnchor='middle'
                            fontFamily='var(--font-mono), monospace'
                            fontSize={11}
                            fontWeight={700}
                            fill={s.ok ? 'var(--primary)' : 'var(--destructive)'}>
                            {s.verdict}
                        </text>
                        <SketchText x={x + w / 2} y={246} size={9.5} body opacity={0.85}>
                            {s.detail}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. max() বনাম LIMIT 1: সমান হলে কী হয়                                      */
/* ------------------------------------------------------------------------- */

const REVIEWS = [
    { id: 1, rating: 5 },
    { id: 3, rating: 5 },
    { id: 5, rating: 5 },
    { id: 8, rating: 5 },
    { id: 2, rating: 4 },
    { id: 4, rating: 4 },
];

function ReviewColumn({ keep }: { keep: (r: (typeof REVIEWS)[number], i: number) => 'kept' | 'maybe' | 'no' }) {
    return (
        <>
            {REVIEWS.map((r, i) => {
                const state = keep(r, i);
                const y = 22 + i * 34;
                return (
                    <g key={r.id} opacity={state === 'no' ? 0.4 : 1}>
                        <rect
                            x={20}
                            y={y}
                            width={300}
                            height={26}
                            fill={state === 'kept' ? 'var(--primary)' : 'transparent'}
                            fillOpacity={state === 'kept' ? 0.12 : 0}
                            stroke={state === 'no' ? 'currentColor' : 'var(--primary)'}
                            strokeOpacity={state === 'no' ? 0.35 : 0.9}
                            strokeDasharray={state === 'maybe' ? '4 3' : undefined}
                        />
                        <SketchText x={34} y={y + 17} anchor='start' size={10}>
                            {`review ${r.id}`}
                        </SketchText>
                        <SketchText x={190} y={y + 17} anchor='start' size={10} accent={state !== 'no'}>
                            {`rating ${r.rating}`}
                        </SketchText>
                        <SketchText x={308} y={y + 17} anchor='end' size={9.5} bold accent={state === 'kept'}>
                            {state === 'kept' ? 'kept' : state === 'maybe' ? '?' : ''}
                        </SketchText>
                    </g>
                );
            })}
        </>
    );
}

/**
 * Four reviews share the top rating. Comparing with max() keeps all four;
 * ORDER BY ... LIMIT 1 keeps exactly one, and without a tie-breaker it is not
 * said which.
 */
export function MaxVsLimitSplit() {
    return (
        <SketchSplit
            label='Ties: max() keeps all, LIMIT 1 keeps one'
            caption='বাম দিকে rating = (SELECT max(rating) FROM reviews): সর্বোচ্চ rating 5, আর চারটা Review এর rating 5, তাই চারটাই আসে। ডান দিকে ORDER BY rating DESC LIMIT 1: ঠিক একটা Row আসে, কিন্তু চারটার মধ্যে কোনটা, সেটা কথা দেওয়া নেই, যতক্ষণ না আপনি review_id এর মতো একটা টাই ভাঙার Column যোগ করেন।'
            panels={[
                {
                    title: '= (SELECT max(rating))',
                    sub: '4 Row',
                    viewBox: '0 0 340 230',
                    height: 230,
                    minWidth: 300,
                    children: <ReviewColumn keep={r => (r.rating === 5 ? 'kept' : 'no')} />,
                },
                {
                    title: 'ORDER BY rating DESC LIMIT 1',
                    sub: '1 Row, কোনটা?',
                    viewBox: '0 0 340 230',
                    height: 230,
                    minWidth: 300,
                    children: <ReviewColumn keep={r => (r.rating === 5 ? 'maybe' : 'no')} />,
                },
            ]}
        />
    );
}
