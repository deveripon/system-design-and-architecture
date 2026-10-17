import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. একটা প্রশ্ন, তিনটা উত্তর                                                  */
/* ------------------------------------------------------------------------- */

const LEVELS = [
    {
        title: 'প্রতি Booking এ গড়',
        rows: '17টা confirmed Booking',
        answer: '24917.65',
        note: 'avg(total_bdt), এক ধাপে',
        accent: false,
    },
    {
        title: 'যাঁরা কিনেছেন, প্রতিজনে',
        rows: '12 জনের মোট, তারপর গড়',
        answer: '35300.00',
        note: 'আগে sum, পরে avg',
        accent: true,
    },
    {
        title: 'সব Customer, শূন্যসহ',
        rows: '15 জনের মোট, তারপর গড়',
        answer: '28240.00',
        note: 'LEFT JOIN, শূন্য বসিয়ে',
        accent: false,
    },
];

/**
 * "How much does a customer spend on average?" has three honest answers on the
 * real data, depending on what one row of the average stands for. Only one of
 * them is a single aggregate; the other two need a total per customer first.
 */
export function QuestionLevelsDiagram() {
    return (
        <Sketch
            label='One Question, Three Levels'
            height={260}
            minWidth={900}
            viewBox='0 0 920 260'
            caption='তিনটা সংখ্যাই আসল Data থেকে, তিনটাই ঠিক হিসাব, কিন্তু তিনটা আলাদা প্রশ্নের উত্তর। গড়টা কীসের উপর, Booking এর নাকি মানুষের, সেটা আগে ঠিক না করলে Query টাও ঠিক হয় না। মাঝেরটা আর ডানেরটা পেতে আগে প্রতিজনের মোট লাগে, তারপর সেই মোটগুলোর গড়: দুই ধাপের হিসাব।'>
            {LEVELS.map((level, i) => {
                const x = 30 + i * 300;
                return (
                    <g key={level.title}>
                        <rect
                            x={x}
                            y={30}
                            width={260}
                            height={190}
                            fill={level.accent ? 'var(--primary)' : 'transparent'}
                            fillOpacity={level.accent ? 0.08 : 0}
                            stroke={level.accent ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={level.accent ? 1 : 0.45}
                            strokeWidth='1.3'
                        />
                        <SketchText x={x + 130} y={62} size={12} body bold accent={level.accent}>
                            {level.title}
                        </SketchText>
                        <SketchText x={x + 130} y={92} size={10.5} body opacity={0.8}>
                            {level.rows}
                        </SketchText>
                        <SketchText x={x + 130} y={150} size={26} bold accent={level.accent}>
                            {level.answer}
                        </SketchText>
                        <SketchText x={x + 130} y={196} size={10} opacity={0.75}>
                            {level.note}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Query এর ভেতরে Query, FROM এর জায়গায়                                     */
/* ------------------------------------------------------------------------- */

const OUTER = [
    'SELECT round(avg(spent), 2)',
    'FROM (',
    '    SELECT customer_id,',
    '           sum(total_bdt) AS spent',
    '    FROM bookings',
    "    WHERE status = 'confirmed'",
    '    GROUP BY customer_id',
    ') AS per_customer;',
];

const MINI = [
    ['1', '44000.00'],
    ['2', '75000.00'],
    ['3', '25000.00'],
    ['...', '...'],
    ['14', '36000.00'],
];

/**
 * Anatomy of a derived table: the inner query runs first, its result becomes a
 * temporary table with a name, and the outer query reads only that table.
 */
export function DerivedAnatomyDiagram() {
    return (
        <Sketch
            label='A Query Used as a Table'
            height={330}
            minWidth={960}
            viewBox='0 0 980 330'
            caption='বন্ধনীর ভেতরের Query টা আগে চলে আর ১২ Row এর একটা অস্থায়ী Table বানায়, যার নাম per_customer, Column দুটো customer_id আর spent। বাইরের Query শুধু সেই Table টাই দেখে, bookings কে আর দেখে না। Query শেষ হলে per_customer মুছে যায়, Database এ কোথাও জমা থাকে না।'>
            <defs>
                <marker
                    id='derived-anatomy-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            <rect x={20} y={30} width={420} height={250} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <rect x={36} y={104} width={388} height={128} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeWidth='1.3' />
            {OUTER.map((line, i) => (
                <SketchText key={line} x={48} y={66 + i * 26} size={11.5} anchor='start' accent={i >= 2 && i <= 6}>
                    {line}
                </SketchText>
            ))}
            <SketchText x={230} y={302} size={10.5} body opacity={0.8}>
                বাইরের Query, শুধু per_customer পড়ে
            </SketchText>

            <line x1={430} y1={168} x2={560} y2={168} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#derived-anatomy-arrow)' />
            <SketchText x={495} y={156} size={10} body accent>
                আগে চলে
            </SketchText>

            <rect x={570} y={70} width={200} height={190} fill='var(--card)' stroke='var(--primary)' strokeWidth='1.3' />
            <rect x={570} y={70} width={200} height={30} fill='var(--primary)' fillOpacity={0.12} />
            <SketchText x={670} y={90} size={11.5} bold accent>
                per_customer
            </SketchText>
            <SketchText x={620} y={120} size={10} bold opacity={0.8}>
                customer_id
            </SketchText>
            <SketchText x={725} y={120} size={10} bold opacity={0.8}>
                spent
            </SketchText>
            {MINI.map(([id, spent], i) => (
                <g key={`${id}-${i}`}>
                    <SketchText x={620} y={146 + i * 22} size={10.5} opacity={0.85}>
                        {id}
                    </SketchText>
                    <SketchText x={725} y={146 + i * 22} size={10.5} opacity={0.85}>
                        {spent}
                    </SketchText>
                </g>
            ))}
            <SketchText x={670} y={282} size={10} body opacity={0.8}>
                ১২ Row, অস্থায়ী
            </SketchText>

            <line x1={780} y1={168} x2={850} y2={168} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#derived-anatomy-arrow)' />
            <rect x={858} y={138} width={104} height={60} fill='var(--primary)' fillOpacity={0.12} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={910} y={174} size={13} bold accent>
                35300.00
            </SketchText>
            <SketchText x={910} y={222} size={10} body opacity={0.8}>
                বাইরের avg
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. আগে Join না আগে যোগ                                                      */
/* ------------------------------------------------------------------------- */

function RowLine({ x, y, cells, accent, faded }: { x: number; y: number; cells: string[]; accent?: boolean; faded?: boolean }) {
    return (
        <g>
            {cells.map((cell, i) => (
                <SketchText key={`${cell}-${i}`} x={x + i * 78} y={y} size={10.5} accent={accent} opacity={faded ? 0.5 : 0.9}>
                    {cell}
                </SketchText>
            ))}
        </g>
    );
}

/**
 * Departure 1 of tour 1 has seats_left 14 and two bookings. Joining first
 * repeats the 14 once per booking; summing bookings per departure first keeps
 * one row per departure, so 14 is counted once.
 */
export function PreAggregateSplit() {
    return (
        <SketchSplit
            label='Join First or Sum First'
            caption='একই Departure 1, একই দুটো Booking। বাঁ দিকে Join আগে হয়েছে, তাই Departure এর Row দুইবার এসেছে আর seats_left 14 দুইবার যোগ হয়ে 28। ডান দিকে আগে bookings কে Departure প্রতি এক Row এ নামানো হয়েছে (2 + 4 = 6 সিট), তারপর Join, তাই Departure এর Row একবারই, খালি সিট ঠিক 14।'
            panels={[
                {
                    title: 'আগে Join, পরে যোগ',
                    sub: 'free = 28, ভুল',
                    viewBox: '0 0 360 230',
                    height: 230,
                    minWidth: 320,
                    children: (
                        <g>
                            <RowLine x={50} y={30} cells={['dep', 'seats_left', 'booking', 'seats']} faded />
                            <RowLine x={50} y={64} cells={['1', '14', '1', '2']} accent />
                            <RowLine x={50} y={94} cells={['1', '14', '2', '4']} accent />
                            <line x1={20} y1={120} x2={340} y2={120} stroke='currentColor' strokeOpacity={0.3} />
                            <SketchText x={180} y={156} size={12} bold accent>
                                sum(seats_left) = 28
                            </SketchText>
                            <SketchText x={180} y={186} size={11} opacity={0.85}>
                                sum(seats) = 6
                            </SketchText>
                            <SketchText x={180} y={214} size={10} body opacity={0.75}>
                                14 দুইবার গোনা হলো
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'আগে যোগ, পরে Join',
                    sub: 'free = 14, ঠিক',
                    viewBox: '0 0 360 230',
                    height: 230,
                    minWidth: 320,
                    children: (
                        <g>
                            <SketchText x={180} y={30} size={10} body opacity={0.8}>
                                ভেতরে: Departure প্রতি এক Row
                            </SketchText>
                            <RowLine x={90} y={58} cells={['dep', 'seats']} faded />
                            <RowLine x={90} y={84} cells={['1', '6']} accent />
                            <line x1={20} y1={104} x2={340} y2={104} stroke='currentColor' strokeOpacity={0.3} />
                            <RowLine x={50} y={130} cells={['dep', 'seats_left', 'seats']} faded />
                            <RowLine x={50} y={156} cells={['1', '14', '6']} accent />
                            <SketchText x={180} y={194} size={12} bold accent>
                                sum(seats_left) = 14
                            </SketchText>
                            <SketchText x={180} y={218} size={11} opacity={0.85}>
                                sum(seats) = 6
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. দুটো Derived Table, একটা Report                                          */
/* ------------------------------------------------------------------------- */

function Block({ x, y, w, title, lines, accent }: { x: number; y: number; w: number; title: string; lines: string[]; accent?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={36 + lines.length * 20}
                fill={accent ? 'var(--primary)' : 'var(--card)'}
                fillOpacity={accent ? 0.1 : 1}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 1 : 0.5}
                strokeWidth='1.3'
            />
            <SketchText x={x + w / 2} y={y + 22} size={11.5} bold accent={accent}>
                {title}
            </SketchText>
            {lines.map((line, i) => (
                <SketchText key={line} x={x + w / 2} y={y + 46 + i * 20} size={10} opacity={0.85}>
                    {line}
                </SketchText>
            ))}
        </g>
    );
}

/**
 * The tour report: tours in the middle, each child table summarised to one row
 * per tour in its own derived table, then both attached with LEFT JOIN.
 */
export function TwoDerivedDiagram() {
    return (
        <Sketch
            label='Two Summaries, One Report'
            height={300}
            minWidth={960}
            viewBox='0 0 980 300'
            caption='departures আর bookings দুটোই tours এর নিচের Table। দুটোকে আলাদা আলাদা Derived Table এ tour_id প্রতি এক Row এ নামিয়ে তারপর tours এর সাথে LEFT JOIN করলে কেউ কাউকে ফোলায় না। ফলাফল ৯ Row, প্রতিটা ট্যুর একবার, আর Family Package আর Luxury Stay এর ঘরে শূন্য।'>
            <defs>
                <marker
                    id='derived-join-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <Block x={20} y={40} w={250} title='dep (Derived)' lines={['FROM departures', 'GROUP BY tour_id', 'tour_id, departures, free_seats', '8 Row']} />
            <Block x={365} y={60} w={250} title='tours' lines={['9 Row, প্রতিটা ট্যুর একবার', 'বাকি দুটো এর সাথে জোড়া']} accent />
            <Block x={710} y={40} w={250} title='s (Derived)' lines={['bookings JOIN departures', 'GROUP BY tour_id', 'tour_id, bookings, revenue', '7 Row']} />
            <line x1={275} y1={110} x2={360} y2={110} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#derived-join-arrow)' />
            <line x1={705} y1={110} x2={620} y2={110} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#derived-join-arrow)' />
            <SketchText x={318} y={98} size={9.5} opacity={0.8}>
                LEFT JOIN
            </SketchText>
            <SketchText x={662} y={98} size={9.5} opacity={0.8}>
                LEFT JOIN
            </SketchText>
            <rect x={300} y={210} width={380} height={60} fill='transparent' stroke='var(--primary)' strokeWidth='1.3' strokeDasharray='5 4' />
            <SketchText x={490} y={236} size={11.5} bold accent>
                ফলাফল: 9 Row
            </SketchText>
            <SketchText x={490} y={258} size={10} body opacity={0.85}>
                ঘাটতির ঘরে COALESCE দিয়ে 0
            </SketchText>
            <line x1={490} y1={156} x2={490} y2={204} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#derived-join-arrow)' />
        </Sketch>
    );
}
