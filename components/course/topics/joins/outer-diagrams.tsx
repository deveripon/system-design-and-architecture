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
    h = 28,
    text,
    accent,
    muted,
    head,
}: {
    x: number;
    y: number;
    w: number;
    h?: number;
    text: string;
    accent?: boolean;
    muted?: boolean;
    head?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={accent ? 'var(--primary)' : head ? 'currentColor' : 'var(--card)'}
                fillOpacity={accent ? 0.12 : head ? 0.08 : 1}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.9 : 0.4}
                strokeWidth='1.1'
            />
            <SketchText
                x={x + 10}
                y={y + h / 2 + 4}
                anchor='start'
                size={head ? 9.5 : 10}
                bold={head}
                accent={accent}
                opacity={muted ? 0.55 : 1}>
                {text}
            </SketchText>
        </g>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. বাঁ দিকের প্রতিটা Row থাকে                                                 */
/* ------------------------------------------------------------------------- */

const LEFT_ROWS = [
    { id: '13', name: 'Shuvo Das' },
    { id: '14', name: 'Lamia Haque' },
    { id: '15', name: 'Imran Kabir' },
];

const RIGHT_ROWS = [
    { id: '15', customer: '13', status: 'confirmed' },
    { id: '24', customer: '13', status: 'pending' },
    { id: '16', customer: '14', status: 'confirmed' },
];

const RESULT_ROWS = [
    { name: 'Shuvo Das', booking: '15', nulls: false },
    { name: 'Shuvo Das', booking: '24', nulls: false },
    { name: 'Lamia Haque', booking: '16', nulls: false },
    { name: 'Imran Kabir', booking: 'NULL', nulls: true },
];

/**
 * Three real customers and their bookings. Shuvo has two bookings, Lamia one,
 * Imran none. LEFT JOIN keeps Imran anyway, with NULL where a booking would be.
 */
export function KeepLeftDiagram() {
    const rowY = (i: number) => 92 + i * 34;
    return (
        <Sketch
            label='LEFT JOIN: বাঁ দিকের কেউ হারায় না'
            height={300}
            minWidth={900}
            viewBox='0 0 900 300'
            caption='বাঁ দিকে customers Table এর তিনজন, মাঝখানে তাঁদের Booking। Shuvo Das এর দুটো Booking, তাই ফলাফলে তিনি দুইবার। Lamia Haque এর একটা। Imran Kabir এর কোনো Booking নেই, তবু LEFT JOIN তাঁকে ফেলে দেয়নি: তাঁর জন্য একটা Row এসেছে, যেখানে bookings এর প্রতিটা Column NULL। INNER JOIN হলে এই শেষ Row টা থাকত না।'>
            <ArrowDefs id='outer-keep-arrow' />
            <SketchText x={30} y={40} anchor='start' size={11} bold accent>
                customers (বাঁ দিক)
            </SketchText>
            <SketchText x={330} y={40} anchor='start' size={11} bold>
                bookings (ডান দিক)
            </SketchText>
            <SketchText x={610} y={40} anchor='start' size={11} bold accent>
                LEFT JOIN এর ফলাফল
            </SketchText>

            <Cell x={30} y={58} w={210} text='customer_id · full_name' head />
            {LEFT_ROWS.map((row, i) => (
                <Cell
                    key={row.id}
                    x={30}
                    y={rowY(i)}
                    w={210}
                    text={`${row.id} · ${row.name}`}
                    accent={row.id === '15'}
                />
            ))}

            <Cell x={330} y={58} w={200} text='booking_id · customer_id' head />
            {RIGHT_ROWS.map((row, i) => (
                <Cell key={row.id} x={330} y={rowY(i)} w={200} text={`${row.id} · ${row.customer} · ${row.status}`} />
            ))}

            {/* customer 13 matches bookings 15 and 24, customer 14 matches 16 */}
            {[
                [0, 0],
                [0, 1],
                [1, 2],
            ].map(([l, r]) => (
                <line
                    key={`${l}-${r}`}
                    x1={240}
                    y1={rowY(l) + 14}
                    x2={330}
                    y2={rowY(r) + 14}
                    stroke='currentColor'
                    strokeOpacity={0.5}
                    strokeWidth='1.1'
                />
            ))}
            <line
                x1={240}
                y1={rowY(2) + 14}
                x2={300}
                y2={rowY(2) + 14}
                stroke='var(--primary)'
                strokeWidth='1.2'
                strokeDasharray='4 3'
            />
            <SketchText x={296} y={rowY(2) + 46} size={9.5} body accent>
                মিল নেই
            </SketchText>

            <line
                x1={545}
                y1={150}
                x2={598}
                y2={150}
                stroke='var(--primary)'
                strokeWidth='1.4'
                markerEnd='url(#outer-keep-arrow)'
            />

            <Cell x={610} y={58} w={150} text='full_name' head />
            <Cell x={760} y={58} w={110} text='booking_id' head />
            {RESULT_ROWS.map((row, i) => (
                <g key={`${row.name}-${row.booking}`}>
                    <Cell x={610} y={rowY(i)} w={150} text={row.name} accent={row.nulls} />
                    <Cell x={760} y={rowY(i)} w={110} text={row.booking} accent={row.nulls} muted={row.nulls} />
                </g>
            ))}
            <SketchText x={740} y={rowY(4) + 22} size={9.5} body opacity={0.85}>
                শেষ Row টা শুধু LEFT JOIN দেয়
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. যা নেই তা খোঁজা                                                           */
/* ------------------------------------------------------------------------- */

/**
 * The anti join recipe on the real data: LEFT JOIN gives 25 rows, one of them
 * padded with NULLs; WHERE b.booking_id IS NULL keeps exactly that one.
 */
export function FindMissingDiagram() {
    return (
        <Sketch
            label='যা নেই, তা খোঁজার নকশা'
            height={250}
            minWidth={880}
            viewBox='0 0 880 250'
            caption='প্রথম ধাপে LEFT JOIN পঁচিশটা Row দেয়: চব্বিশটা আসল জোড়া, আর Imran Kabir এর জন্য একটা NULL ভরা Row। দ্বিতীয় ধাপে WHERE শুধু সেই Row রাখে, যেখানে ডান দিকের Primary Key NULL। মিল পাওয়া Row এ booking_id কখনো NULL হয় না, তাই যা বাকি থাকে তা ঠিক সেই Customer, যাঁর কোনো Booking নেই।'>
            <ArrowDefs id='outer-missing-arrow' />

            <SketchText x={140} y={34} size={11} bold>
                customers LEFT JOIN bookings
            </SketchText>
            {Array.from({ length: 25 }, (_, i) => {
                const col = i % 5;
                const row = Math.floor(i / 5);
                const isNull = i === 24;
                return (
                    <rect
                        key={i}
                        x={40 + col * 42}
                        y={52 + row * 26}
                        width={36}
                        height={18}
                        fill={isNull ? 'var(--primary)' : 'currentColor'}
                        fillOpacity={isNull ? 0.25 : 0.12}
                        stroke={isNull ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={isNull ? 1 : 0.35}
                        strokeWidth='1'
                    />
                );
            })}
            <SketchText x={140} y={202} size={10} body opacity={0.85}>
                ২৫টা Row, একটা NULL ভরা
            </SketchText>

            <line
                x1={262}
                y1={118}
                x2={330}
                y2={118}
                stroke='var(--primary)'
                strokeWidth='1.4'
                markerEnd='url(#outer-missing-arrow)'
            />

            <path
                d='M 340 70 L 560 70 L 500 166 L 400 166 Z'
                fill='var(--primary)'
                fillOpacity={0.08}
                stroke='var(--primary)'
                strokeWidth='1.3'
            />
            <SketchText x={450} y={100} size={10.5} bold accent>
                WHERE b.booking_id
            </SketchText>
            <SketchText x={450} y={118} size={10.5} bold accent>
                IS NULL
            </SketchText>
            <SketchText x={450} y={192} size={10} body opacity={0.85}>
                মিল না পাওয়া Row ই বাকি থাকে
            </SketchText>

            <line
                x1={575}
                y1={118}
                x2={640}
                y2={118}
                stroke='var(--primary)'
                strokeWidth='1.4'
                markerEnd='url(#outer-missing-arrow)'
            />

            <Cell x={650} y={88} w={200} text='15 · Imran Kabir' accent />
            <SketchText x={750} y={146} size={10} body opacity={0.85}>
                ১টা Row: যিনি কখনো বুক করেননি
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. RIGHT JOIN আসলে উল্টো দিক থেকে LEFT JOIN                                    */
/* ------------------------------------------------------------------------- */

function SideBox({ x, label, kept }: { x: number; label: string; kept: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={46}
                width={118}
                height={44}
                fill={kept ? 'var(--primary)' : 'transparent'}
                fillOpacity={kept ? 0.12 : 0}
                stroke={kept ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={kept ? 1 : 0.45}
                strokeWidth='1.3'
            />
            <SketchText x={x + 59} y={73} size={11} bold accent={kept}>
                {label}
            </SketchText>
            {kept && (
                <SketchText x={x + 59} y={112} size={9.5} body accent>
                    সব Row থাকে
                </SketchText>
            )}
        </g>
    );
}

/**
 * The same 25 rows written two ways. The kept table is the one named on the
 * side the keyword points to; flipping the order and the keyword changes nothing.
 */
export function LeftRightMirrorSplit() {
    return (
        <SketchSplit
            label='RIGHT JOIN = উল্টো দিক থেকে LEFT JOIN'
            caption='দুটো Query একই পঁচিশটা Row দেয়, Imran সহ। LEFT মানে JOIN শব্দের বাঁ দিকের Table এর সব Row থাকবে, RIGHT মানে ডান দিকের। তাই Table দুটোর জায়গা বদলে শব্দটাও বদলালে ফলাফল একই। বেশিরভাগ দল সবসময় LEFT লেখে, যাতে Query পড়ার সময় মাথায় দিক ঘোরাতে না হয়।'
            panels={[
                {
                    title: 'customers LEFT JOIN bookings',
                    sub: '25 rows',
                    viewBox: '0 0 360 130',
                    height: 130,
                    children: (
                        <g>
                            <SideBox x={20} label='customers' kept />
                            <SketchText x={180} y={73} size={10} bold>
                                LEFT JOIN
                            </SketchText>
                            <SideBox x={222} label='bookings' kept={false} />
                        </g>
                    ),
                },
                {
                    title: 'bookings RIGHT JOIN customers',
                    sub: '25 rows',
                    viewBox: '0 0 360 130',
                    height: 130,
                    children: (
                        <g>
                            <SideBox x={20} label='bookings' kept={false} />
                            <SketchText x={180} y={73} size={10} bold>
                                RIGHT JOIN
                            </SketchText>
                            <SideBox x={222} label='customers' kept />
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. কোন Column এ IS NULL লিখবেন                                                */
/* ------------------------------------------------------------------------- */

const REVIEW_ROWS = [
    { booking: '1', review: '1', comment: 'Crystal clear…' },
    { booking: '4', review: '4', comment: 'NULL' },
    { booking: '12', review: 'NULL', comment: 'NULL' },
    { booking: '13', review: 'NULL', comment: 'NULL' },
];

function ReviewPanel({ test }: { test: 'review' | 'comment' }) {
    return (
        <g>
            <Cell x={10} y={10} w={80} text='booking' head />
            <Cell x={90} y={10} w={80} text='review_id' head />
            <Cell x={170} y={10} w={120} text='comment' head />
            {REVIEW_ROWS.map((row, i) => {
                const kept = test === 'review' ? row.review === 'NULL' : row.comment === 'NULL';
                const wrong = kept && row.review !== 'NULL';
                const y = 38 + i * 28;
                return (
                    <g key={row.booking}>
                        <Cell x={10} y={y} w={80} text={row.booking} accent={kept} />
                        <Cell x={90} y={y} w={80} text={row.review} accent={kept} muted={row.review === 'NULL'} />
                        <Cell x={170} y={y} w={120} text={row.comment} accent={kept} muted={row.comment === 'NULL'} />
                        <SketchText x={318} y={y + 18} size={10} bold accent={kept && !wrong} opacity={kept ? 1 : 0.4}>
                            {wrong ? 'ভুল' : kept ? 'থাকে' : 'বাদ'}
                        </SketchText>
                    </g>
                );
            })}
        </g>
    );
}

/**
 * bookings LEFT JOIN reviews, four real rows. Testing the review's own key finds
 * exactly the bookings without a review; testing a column that can be NULL even
 * in a matched row also catches booking 4, whose review has no comment.
 */
export function IsNullColumnSplit() {
    return (
        <SketchSplit
            label='IS NULL কোন Column এ'
            caption='booking 4 এর একটা Review আছে, শুধু তাতে মন্তব্য লেখা হয়নি। r.review_id দিয়ে পরীক্ষা করলে সেটা ঠিকভাবে বাদ পড়ে, আর পুরো Data তে Review ছাড়া Booking আসে ১৪টা। r.comment দিয়ে পরীক্ষা করলে booking 4 আর 9 ভুল করে ঢুকে যায়, সংখ্যা হয় ১৬। নিয়ম: IS NULL দিন ডান দিকের Primary Key তে, বা এমন Column এ যা মিল পাওয়া Row এ কখনো NULL হয় না।'
            panels={[
                {
                    title: 'WHERE r.review_id IS NULL',
                    sub: '14 rows, ঠিক',
                    viewBox: '0 0 350 160',
                    height: 160,
                    minWidth: 300,
                    children: <ReviewPanel test='review' />,
                },
                {
                    title: 'WHERE r.comment IS NULL',
                    sub: '16 rows, ভুল',
                    viewBox: '0 0 350 160',
                    height: 160,
                    minWidth: 300,
                    children: <ReviewPanel test='comment' />,
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 5. count(*) বনাম count(Column)                                              */
/* ------------------------------------------------------------------------- */

/**
 * Imran's one joined row, and what two counts make of it. count(*) counts the
 * row that LEFT JOIN made up; count(b.booking_id) skips the NULL in it.
 */
export function CountStarTrapDiagram() {
    return (
        <Sketch
            label='LEFT JOIN এর পরে গোনা'
            height={240}
            minWidth={860}
            viewBox='0 0 860 240'
            caption='GROUP BY customer করলে Imran Kabir এর দলে একটাই Row: LEFT JOIN এর বানানো NULL ভরা Row। count(*) Row গোনে, তাই বলে ১, যেন তিনি একবার বুক করেছেন। count(b.booking_id) শুধু NULL নয় এমন মান গোনে, তাই বলে ০, যেটাই সত্যি। LEFT JOIN এর পরে সবসময় ডান দিকের Primary Key গুনুন।'>
            <ArrowDefs id='outer-count-arrow' />
            <SketchText x={40} y={36} anchor='start' size={11} bold>
                Imran Kabir এর দল (GROUP BY c.customer_id)
            </SketchText>
            <Cell x={40} y={52} w={110} text='customer_id' head />
            <Cell x={150} y={52} w={130} text='full_name' head />
            <Cell x={280} y={52} w={110} text='booking_id' head />
            <Cell x={390} y={52} w={90} text='seats' head />
            <Cell x={40} y={80} w={110} text='15' accent />
            <Cell x={150} y={80} w={130} text='Imran Kabir' accent />
            <Cell x={280} y={80} w={110} text='NULL' accent muted />
            <Cell x={390} y={80} w={90} text='NULL' accent muted />

            <line x1={260} y1={112} x2={200} y2={150} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#outer-count-arrow)' />
            <line x1={335} y1={112} x2={470} y2={150} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#outer-count-arrow)' />

            <rect x={90} y={156} width={230} height={56} fill='transparent' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            <SketchText x={205} y={180} size={11.5} bold>
                count(*) = 1
            </SketchText>
            <SketchText x={205} y={200} size={9.5} body opacity={0.85}>
                Row টা আছে, তাই গোনা হলো
            </SketchText>

            <rect x={380} y={156} width={250} height={56} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={505} y={180} size={11.5} bold accent>
                count(b.booking_id) = 0
            </SketchText>
            <SketchText x={505} y={200} size={9.5} body accent>
                মানটা NULL, তাই বাদ
            </SketchText>

            <SketchText x={760} y={110} size={10} body opacity={0.85}>
                sum(b.seats) হয় NULL,
            </SketchText>
            <SketchText x={760} y={128} size={10} body opacity={0.85}>
                coalesce দিলে 0
            </SketchText>
        </Sketch>
    );
}
