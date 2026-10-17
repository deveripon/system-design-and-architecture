import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. তিনটা Row, তিন রকম উত্তর                                                 */
/* ------------------------------------------------------------------------- */

const CUSTOMER_ONE = [
    { id: '1', status: 'confirmed' },
    { id: '8', status: 'confirmed' },
    { id: '17', status: 'pending' },
];

const ANSWERS = [
    { fn: 'count(*)', out: '3', note: 'শুধু কতগুলো' },
    { fn: "string_agg(booking_id::text, ', ')", out: "'1, 8, 17'", note: 'একটা লেখা, মানুষের জন্য' },
    { fn: 'array_agg(booking_id)', out: '{1,8,17}', note: 'একটা তালিকা, Code এর জন্য' },
];

/** Customer 1's three bookings go into one group and come out as a number, a text or an array. */
export function ManyRowsOneLineDiagram() {
    return (
        <Sketch
            label='একটা দল, তিন রকম উত্তর'
            height={300}
            minWidth={880}
            viewBox='0 0 880 300'
            caption={
                <>
                    বাঁ দিকে customer_id 1 এর তিনটা আসল Booking। GROUP BY customer_id তাদের এক দলে আনে। COUNT শুধু বলে
                    কতগুলো আছে। string_agg তাদের নম্বরগুলো কমা দিয়ে জুড়ে একটা লেখা বানায়, আর array_agg বানায় একটা
                    তালিকা, যার প্রতিটা ঘর আলাদা থাকে। তিনটাই এক দল থেকে একটা মান, শুধু মানের চেহারা আলাদা।
                </>
            }>
            <defs>
                <marker
                    id='listagg-many-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchText x={110} y={34} size={10} bold>
                bookings (customer_id = 1)
            </SketchText>
            {CUSTOMER_ONE.map((row, i) => {
                const y = 56 + i * 52;
                return (
                    <g key={row.id}>
                        <rect x={30} y={y} width={160} height={38} fill='currentColor' fillOpacity={0.04} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
                        <SketchText x={50} y={y + 24} anchor='start' size={11} bold accent>
                            {row.id}
                        </SketchText>
                        <SketchText x={92} y={y + 24} anchor='start' size={10.5} opacity={0.85}>
                            {row.status}
                        </SketchText>
                        <line x1={194} y1={y + 19} x2={268} y2={146} stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1.2' />
                    </g>
                );
            })}
            <rect x={270} y={118} width={150} height={56} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={345} y={142} size={11} bold accent>
                GROUP BY
            </SketchText>
            <SketchText x={345} y={160} size={10} accent>
                customer_id
            </SketchText>
            {ANSWERS.map((answer, i) => {
                const y = 50 + i * 82;
                return (
                    <g key={answer.fn}>
                        <path
                            d={`M 424 146 C 470 146, 470 ${y + 30}, 516 ${y + 30}`}
                            fill='none'
                            stroke='var(--primary)'
                            strokeWidth='1.3'
                            markerEnd='url(#listagg-many-arrow)'
                        />
                        <rect x={520} y={y} width={330} height={60} fill='currentColor' fillOpacity={0.03} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
                        <SketchText x={536} y={y + 22} anchor='start' size={10} opacity={0.8}>
                            {answer.fn}
                        </SketchText>
                        <SketchText x={536} y={y + 46} anchor='start' size={13} bold accent>
                            {answer.out}
                        </SketchText>
                        <SketchText x={838} y={y + 46} anchor='end' size={10} body opacity={0.75}>
                            {answer.note}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. দুটো ORDER BY, দুটো আলাদা কাজ                                            */
/* ------------------------------------------------------------------------- */

const PARTS = [
    { x: 20, w: 150, code: 'string_agg(', label: '', accent: false },
    { x: 170, w: 160, code: 'booking_id::text', label: 'কী জুড়বে', accent: true },
    { x: 330, w: 70, code: ", ', '", label: 'মাঝে কী', accent: true },
    { x: 400, w: 220, code: 'ORDER BY booked_at DESC', label: 'তালিকার ভেতরের ক্রম', accent: true },
    { x: 620, w: 20, code: ')', label: '', accent: false },
];

/**
 * The anatomy of an ordered list aggregate, and why a query can have two
 * ORDER BY clauses that do different jobs.
 */
export function AggOrderDiagram() {
    return (
        <Sketch
            label='ভেতরের ORDER BY বনাম বাইরের ORDER BY'
            height={290}
            minWidth={880}
            viewBox='0 0 880 290'
            caption={
                <>
                    Parenthesis এর ভেতরের ORDER BY সাজায় একটা দলের তালিকার ভেতরের মানগুলো, যেমন customer 1 এর তিনটা Booking
                    নতুন থেকে পুরনো: 17, 8, 1। Query এর শেষের ORDER BY সাজায় পুরো ফলাফলের Row গুলো, মানে দলগুলো। একটা আরেকটার
                    কাজ করে না, তাই দরকার হলে দুটোই লিখতে হয়।
                </>
            }>
            <defs>
                <marker
                    id='listagg-order-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchText x={20} y={30} anchor='start' size={10.5} opacity={0.7}>
                SELECT customer_id,
            </SketchText>
            {PARTS.map(part => (
                <g key={part.code}>
                    {part.accent && (
                        <rect x={part.x} y={44} width={part.w} height={30} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1.1' />
                    )}
                    <SketchText x={part.x + part.w / 2} y={64} size={11} bold={part.accent} accent={part.accent}>
                        {part.code}
                    </SketchText>
                    {part.label && (
                        <SketchText x={part.x + part.w / 2} y={96} size={10} body>
                            {part.label}
                        </SketchText>
                    )}
                </g>
            ))}
            <SketchText x={650} y={64} anchor='start' size={11} opacity={0.8}>
                AS newest_first
            </SketchText>
            <SketchText x={20} y={130} anchor='start' size={10.5} opacity={0.7}>
                FROM bookings GROUP BY customer_id
            </SketchText>
            <rect x={20} y={146} width={210} height={30} fill='currentColor' fillOpacity={0.05} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.1' />
            <SketchText x={125} y={166} size={11} bold>
                ORDER BY customer_id;
            </SketchText>
            <SketchText x={125} y={198} size={10} body>
                দলগুলোর ক্রম
            </SketchText>

            <line x1={510} y1={104} x2={600} y2={222} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#listagg-order-arrow)' />
            <line x1={232} y1={170} x2={330} y2={232} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.2' markerEnd='url(#listagg-order-arrow)' />

            <rect x={340} y={220} width={500} height={56} fill='currentColor' fillOpacity={0.03} stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.1' />
            <SketchText x={360} y={242} anchor='start' size={10.5}>
                customer_id 1 → 17, 8, 1
            </SketchText>
            <SketchText x={360} y={264} anchor='start' size={10.5}>
                customer_id 2 → 13, 2
            </SketchText>
            <SketchText x={820} y={242} anchor='end' size={10} body accent>
                ভেতরে: নতুন আগে
            </SketchText>
            <SketchText x={820} y={264} anchor='end' size={10} body opacity={0.75}>
                বাইরে: 1, 2, 3 ...
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. লেখা না তালিকা                                                          */
/* ------------------------------------------------------------------------- */

const DHAKA = ['+8801000000101', '+8801000000102', 'NULL', '+8801000000108', '+8801000000113', '+8801000000115'];

/** The same six Dhaka phones aggregated two ways: string_agg skips the NULL, array_agg keeps it. */
export function StringVsArraySplit() {
    return (
        <SketchSplit
            label='string_agg বনাম array_agg'
            caption={
                <>
                    ঢাকার ছয়জন Customer এর phone, customer_id এর ক্রমে। Mitu Rahman এর phone নেই। string_agg জোড়ার সময়
                    NULL কে বাদ দেয়, তাই লেখায় পাঁচটা নম্বর। array_agg কিছুই বাদ দেয় না, তাই তালিকায় ছয়টা ঘর, তৃতীয়টা
                    NULL। লেখা দেখানোর জন্য, তালিকা পরে আবার কাজে লাগানোর জন্য।
                </>
            }
            panels={[
                {
                    title: 'string_agg',
                    sub: 'text',
                    viewBox: '0 0 380 250',
                    height: 250,
                    minWidth: 320,
                    children: (
                        <g>
                            {DHAKA.map((phone, i) => (
                                <g key={phone + i}>
                                    <SketchText x={20} y={28 + i * 22} anchor='start' size={10} opacity={phone === 'NULL' ? 0.35 : 0.85}>
                                        {phone}
                                    </SketchText>
                                    {phone === 'NULL' && (
                                        <line x1={18} y1={24 + i * 22} x2={60} y2={24 + i * 22} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
                                    )}
                                </g>
                            ))}
                            <rect x={10} y={160} width={360} height={66} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1.1' />
                            <SketchText x={20} y={180} anchor='start' size={9.5} accent>
                                +8801000000101, +8801000000102,
                            </SketchText>
                            <SketchText x={20} y={197} anchor='start' size={9.5} accent>
                                +8801000000108, +8801000000113,
                            </SketchText>
                            <SketchText x={20} y={214} anchor='start' size={9.5} accent>
                                +8801000000115
                            </SketchText>
                            <SketchText x={190} y={245} size={10} body>
                                একটা লেখা, পাঁচটা নম্বর, NULL বাদ
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'array_agg',
                    sub: 'text[]',
                    viewBox: '0 0 380 250',
                    height: 250,
                    minWidth: 320,
                    children: (
                        <g>
                            {DHAKA.map((phone, i) => (
                                <g key={phone + i}>
                                    <rect
                                        x={20}
                                        y={14 + i * 25}
                                        width={200}
                                        height={22}
                                        fill={phone === 'NULL' ? 'transparent' : 'var(--primary)'}
                                        fillOpacity={phone === 'NULL' ? 0 : 0.08}
                                        stroke={phone === 'NULL' ? 'currentColor' : 'var(--primary)'}
                                        strokeOpacity={0.6}
                                        strokeDasharray={phone === 'NULL' ? '4 3' : undefined}
                                        strokeWidth='1.1'
                                    />
                                    <SketchText x={30} y={29 + i * 25} anchor='start' size={10} accent={phone !== 'NULL'} opacity={phone === 'NULL' ? 0.6 : 1}>
                                        {phone}
                                    </SketchText>
                                    <SketchText x={236} y={29 + i * 25} anchor='start' size={9.5} opacity={0.6}>
                                        [{i + 1}]
                                    </SketchText>
                                </g>
                            ))}
                            <SketchText x={190} y={190} size={10} body>
                                ছয়টা ঘর, প্রতিটার নিজের নম্বর
                            </SketchText>
                            <SketchText x={190} y={210} size={10} body>
                                NULL ও একটা ঘর, গোনা শুরু 1 থেকে
                            </SketchText>
                            <SketchText x={190} y={240} size={10} opacity={0.7}>
                                cardinality = 6
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Module 05 এর গল্প                                                       */
/* ------------------------------------------------------------------------- */

const STAGES = [
    { lesson: 'Lesson 01', code: 'COUNT, SUM', idea: 'অনেক Row, একটা উত্তর' },
    { lesson: 'Lesson 02', code: 'GROUP BY', idea: 'প্রতিটা দলের উত্তর' },
    { lesson: 'Lesson 03', code: 'HAVING', idea: 'দল ছাঁকা' },
    { lesson: 'Lesson 04', code: 'FILTER', idea: 'এক বারে কয়েক হিসাব' },
    { lesson: 'Lesson 05', code: 'ROLLUP', idea: 'উপমোট আর মোট' },
    { lesson: 'Lesson 06', code: 'string_agg', idea: 'দলের তালিকা' },
];

/** The six lessons of Module 05 as one path from a single number to a full report. */
export function ModuleFiveStoryDiagram() {
    const w = 120;
    const gap = 22;
    return (
        <Sketch
            label='Module 05: অনেক Row থেকে একটা Report'
            height={210}
            minWidth={880}
            viewBox='0 0 880 210'
            caption={
                <>
                    Module 04 পর্যন্ত প্রতিটা Query প্রতিটা Row এর জন্য একটা করে উত্তর দিত। Module 05 শেখাল কীভাবে
                    অনেক Row মিলিয়ে একটা উত্তর বানাতে হয়, তারপর সেটা প্রতিটা দলের জন্য, তারপর দল ছেঁকে, এক বারে
                    কয়েকটা হিসাব করে, উপমোট জুড়ে, আর শেষে দলের ভেতরের নামগুলোও দেখিয়ে।
                </>
            }>
            <defs>
                <marker
                    id='listagg-story-arrow'
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
                const x = 20 + i * (w + gap);
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
                            height={48}
                            fill='var(--primary)'
                            fillOpacity={last ? 0.16 : 0.05}
                            stroke='var(--primary)'
                            strokeOpacity={0.75}
                            strokeWidth='1.2'
                        />
                        <SketchText x={mid} y={77} size={11.5} bold accent>
                            {stage.code}
                        </SketchText>
                        <SketchText x={mid} y={124} size={10.5} body bold>
                            {stage.idea}
                        </SketchText>
                        {i < STAGES.length - 1 && (
                            <line
                                x1={x + w + 3}
                                y1={72}
                                x2={x + w + gap - 3}
                                y2={72}
                                stroke='var(--primary)'
                                strokeWidth='1.3'
                                markerEnd='url(#listagg-story-arrow)'
                            />
                        )}
                    </g>
                );
            })}
            <SketchText x={440} y={170} size={10.5} body>
                শেষে সবগুলো একসাথে: প্রতিটা Departure এর Booking সংখ্যা, ধরে রাখা সিট, নিশ্চিত আয়,
            </SketchText>
            <SketchText x={440} y={190} size={10.5} body>
                বাতিলের হার আর Booking এর তালিকা, একটা Table থেকে একটা Query তে
            </SketchText>
        </Sketch>
    );
}
