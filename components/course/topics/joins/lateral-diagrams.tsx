import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. FROM এর ভেতরের Subquery: আগে একবার চলে, তারপর একটা Table               */
/* ------------------------------------------------------------------------- */

const CHEAP = [
    { title: 'Ratargul Swamp Boat Day', price: '3500.00' },
    { title: 'Sylhet Tea Garden Tour', price: '7800.00' },
    { title: "Cox's Bazar Beach Weekend", price: '8500.00' },
    { title: 'Sajek Valley Cloud Trip', price: '9500.00' },
];

/** A subquery in FROM runs once, on its own, and the outer query reads its result like a table named cheap. */
export function DerivedTableDiagram() {
    return (
        <Sketch
            label='FROM এর ভেতরে একটা ছোট Query'
            height={300}
            minWidth={880}
            viewBox='0 0 880 300'
            caption={
                <>
                    Parenthesis এর ভেতরের SELECT টা আগে একবার চলে, নিজের মতো করে, বাইরের Query এর কিছুই না দেখে। তার
                    ফল চারটা Row এর একটা অস্থায়ী Table, যার নাম AS দিয়ে দেওয়া হয়েছে cheap। বাইরের Query সেই নামটাকে
                    একটা সাধারণ Table এর মতো পড়ে। এটাই Subquery র সবচেয়ে সহজ রূপ, যার পুরো বিস্তার Module 07 এ।
                </>
            }>
            <defs>
                <marker
                    id='lateral-derived-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchText x={140} y={36} size={10} bold>
                ১. ভেতরের Query, একবার
            </SketchText>
            <rect x={20} y={52} width={240} height={150} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1.2' />
            {['SELECT title, price_bdt', 'FROM tours', 'WHERE price_bdt < 10000'].map((line, i) => (
                <SketchText key={line} x={36} y={84 + i * 26} anchor='start' size={10.5} accent={i === 2}>
                    {line}
                </SketchText>
            ))}
            <SketchText x={140} y={184} size={10} body opacity={0.75}>
                বাইরের কিছুই দেখে না
            </SketchText>
            <line x1={264} y1={127} x2={322} y2={127} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#lateral-derived-arrow)' />

            <SketchText x={480} y={36} size={10} bold>
                ২. ফল: একটা অস্থায়ী Table, নাম cheap
            </SketchText>
            <rect x={330} y={52} width={300} height={30} fill='currentColor' fillOpacity={0.06} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={346} y={72} anchor='start' size={10} bold>
                title
            </SketchText>
            <SketchText x={614} y={72} anchor='end' size={10} bold>
                price_bdt
            </SketchText>
            {CHEAP.map((row, i) => (
                <g key={row.title}>
                    <rect x={330} y={82 + i * 30} width={300} height={30} fill='transparent' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1' />
                    <SketchText x={346} y={102 + i * 30} anchor='start' size={10} opacity={0.9}>
                        {row.title}
                    </SketchText>
                    <SketchText x={614} y={102 + i * 30} anchor='end' size={10} accent>
                        {row.price}
                    </SketchText>
                </g>
            ))}
            <line x1={634} y1={127} x2={692} y2={127} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#lateral-derived-arrow)' />

            <SketchText x={780} y={36} size={10} bold>
                ৩. বাইরের Query
            </SketchText>
            <rect x={700} y={52} width={160} height={150} fill='currentColor' fillOpacity={0.03} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            {['SELECT *', 'FROM (...) AS cheap', 'ORDER BY price_bdt'].map((line, i) => (
                <SketchText key={line} x={712} y={84 + i * 26} anchor='start' size={10} accent={i === 1}>
                    {line}
                </SketchText>
            ))}
            <SketchText x={780} y={184} size={10} body opacity={0.75}>
                cheap কে Table ভাবে
            </SketchText>

            <SketchText x={440} y={250} size={11} body>
                এক কথায়: ভেতরেরটা আগে, একবার, একা। তারপর তার ফল একটা নাম পায়, আর বাইরেরটা সেই নাম পড়ে।
            </SketchText>
            <SketchText x={440} y={276} size={10.5} body opacity={0.75}>
                এই একা থাকাটাই পরের Section এর দেয়াল, আর LATERAL সেই দেয়ালে একটা জানালা কাটে।
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. প্রতিটা Row এর জন্য একবার                                                */
/* ------------------------------------------------------------------------- */

const FOR_EACH = [
    { id: 1, name: 'Rahim Uddin', out: '17, 8', rows: 2 },
    { id: 2, name: 'Nusrat Jahan', out: '13, 2', rows: 2 },
    { id: 5, name: 'Sabbir Hossain', out: '5', rows: 1 },
    { id: 15, name: 'Imran Kabir', out: 'কোনো Row নেই', rows: 0 },
];

/** For four real customers, the LATERAL subquery runs once each, with that customer's id filled in. */
export function ForEachRowDiagram() {
    return (
        <Sketch
            label='LATERAL: প্রতিটা Row এর জন্য ভেতরের Query একবার'
            height={360}
            minWidth={900}
            viewBox='0 0 900 360'
            caption={
                <>
                    বাঁ দিকে customers এর চারটা আসল Row। প্রতিটা Row এর জন্য ভেতরের Query আলাদা করে চলে, আর
                    c.customer_id এর জায়গায় সেই Row এর নম্বর বসে যায়: 1, 2, 5, 15। প্রতিবার ফল আসে সর্বোচ্চ দুটো Row:
                    Rahim এর 17 আর 8, Nusrat এর 13 আর 2, Sabbir এর শুধু 5, আর Imran এর কিছুই না। তারপর প্রতিটা ফল তার
                    নিজের Customer এর পাশে জোড়া লাগে।
                </>
            }>
            <defs>
                <marker
                    id='lateral-each-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchText x={110} y={30} size={10} bold>
                customers c
            </SketchText>
            <SketchText x={470} y={30} size={10} bold>
                ভেতরের Query, এই Row এর জন্য
            </SketchText>
            <SketchText x={790} y={30} size={10} bold>
                ফল
            </SketchText>
            {FOR_EACH.map((row, i) => {
                const y = 48 + i * 74;
                const empty = row.rows === 0;
                return (
                    <g key={row.id}>
                        <rect x={20} y={y} width={180} height={48} fill='currentColor' fillOpacity={0.04} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
                        <SketchText x={34} y={y + 21} anchor='start' size={10.5} bold accent>
                            {String(row.id)}
                        </SketchText>
                        <SketchText x={34} y={y + 38} anchor='start' size={10} opacity={0.85}>
                            {row.name}
                        </SketchText>
                        <line x1={204} y1={y + 24} x2={262} y2={y + 24} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#lateral-each-arrow)' />
                        <rect x={270} y={y} width={400} height={48} fill='var(--primary)' fillOpacity={0.05} stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1.1' />
                        <SketchText x={284} y={y + 21} anchor='start' size={9.5} opacity={0.85}>
                            SELECT booking_id FROM bookings b
                        </SketchText>
                        <SketchText x={284} y={y + 38} anchor='start' size={9.5}>
                            {'WHERE b.customer_id = '}
                        </SketchText>
                        <SketchText x={448} y={y + 38} anchor='start' size={9.5} bold accent>
                            {String(row.id)}
                        </SketchText>
                        <SketchText x={472} y={y + 38} anchor='start' size={9.5} opacity={0.7}>
                            ORDER BY booked_at DESC LIMIT 2
                        </SketchText>
                        <line x1={674} y1={y + 24} x2={712} y2={y + 24} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#lateral-each-arrow)' />
                        <rect
                            x={720}
                            y={y + 6}
                            width={160}
                            height={36}
                            fill={empty ? 'transparent' : 'var(--primary)'}
                            fillOpacity={empty ? 0 : 0.1}
                            stroke={empty ? 'currentColor' : 'var(--primary)'}
                            strokeOpacity={empty ? 0.35 : 0.8}
                            strokeDasharray={empty ? '4 3' : undefined}
                            strokeWidth='1.1'
                        />
                        <SketchText x={800} y={y + 29} size={empty ? 9.5 : 11} body={empty} bold={!empty} accent={!empty} opacity={empty ? 0.65 : 1}>
                            {row.out}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={450} y={348} size={10.5} body opacity={0.8}>
                সাধারণ JOIN দুটো Table একবার মেলায়। LATERAL ভেতরের Query টা বারবার চালায়, প্রতিটা বাইরের Row এর জন্য একবার।
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. CROSS JOIN LATERAL বনাম LEFT JOIN LATERAL ... ON true                   */
/* ------------------------------------------------------------------------- */

const SPLIT_ROWS = [
    { who: 'Sabbir Hossain', inner: '5' },
    { who: 'Kamal Hasan', inner: '14' },
    { who: 'Imran Kabir', inner: '' },
];

function SplitPanel({ keep }: { keep: boolean }) {
    return (
        <>
            <SketchText x={20} y={22} anchor='start' size={9.5} bold opacity={0.7}>
                বাইরের Row
            </SketchText>
            <SketchText x={240} y={22} anchor='start' size={9.5} bold opacity={0.7}>
                ভেতরের ফল
            </SketchText>
            <SketchText x={330} y={22} anchor='start' size={9.5} bold opacity={0.7}>
                শেষ ফলে
            </SketchText>
            {SPLIT_ROWS.map((row, i) => {
                const y = 36 + i * 52;
                const empty = row.inner === '';
                const dropped = empty && !keep;
                return (
                    <g key={row.who}>
                        <rect x={14} y={y} width={196} height={36} fill='currentColor' fillOpacity={0.04} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.1' />
                        <SketchText x={26} y={y + 23} anchor='start' size={10} opacity={0.9}>
                            {row.who}
                        </SketchText>
                        <rect
                            x={232}
                            y={y + 4}
                            width={74}
                            height={28}
                            fill='transparent'
                            stroke={empty ? 'currentColor' : 'var(--primary)'}
                            strokeOpacity={empty ? 0.35 : 0.8}
                            strokeDasharray={empty ? '4 3' : undefined}
                            strokeWidth='1.1'
                        />
                        <SketchText x={269} y={y + 23} size={10} bold={!empty} accent={!empty} opacity={empty ? 0.55 : 1} body={empty}>
                            {empty ? 'খালি' : row.inner}
                        </SketchText>
                        <SketchText x={330} y={y + 23} anchor='start' size={10} bold accent={!dropped} opacity={dropped ? 0.55 : 1} body={dropped || (empty && keep)}>
                            {dropped ? 'বাদ পড়ল' : empty ? 'থাকল, ভেতরের ঘর NULL' : 'থাকল, ' + row.inner}
                        </SketchText>
                    </g>
                );
            })}
        </>
    );
}

/** The same three customers through CROSS JOIN LATERAL and LEFT JOIN LATERAL ... ON true. */
export function CrossVsLeftLateralSplit() {
    return (
        <SketchSplit
            label='খালি ফল পেলে কী হয়'
            caption={
                <>
                    ভেতরের Query কিছুই না পেলে দুই রকম JOIN দুই রকম আচরণ করে। CROSS JOIN LATERAL ঠিক INNER JOIN এর
                    মতো: জোড়ার কিছু নেই, তাই Imran পুরো ফল থেকে বাদ। LEFT JOIN LATERAL ঠিক LEFT JOIN এর মতো: বাঁ দিকের
                    Row থাকবেই, আর ভেতরের Column গুলো NULL। ON true লাগে কারণ LEFT JOIN এর ব্যাকরণে একটা ON চাই, আর
                    মেলানোর আসল শর্তটা তো ভেতরের WHERE এ আগেই লেখা।
                </>
            }
            panels={[
                {
                    title: 'CROSS JOIN LATERAL',
                    sub: 'খালি মানে বাদ',
                    viewBox: '0 0 460 200',
                    height: 200,
                    minWidth: 420,
                    children: <SplitPanel keep={false} />,
                },
                {
                    title: 'LEFT JOIN LATERAL ... ON true',
                    sub: 'খালি হলেও থাকে',
                    viewBox: '0 0 460 200',
                    height: 200,
                    minWidth: 420,
                    children: <SplitPanel keep />,
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. একটা Booking, চারটা টিকিট                                                */
/* ------------------------------------------------------------------------- */

/** Booking 2 has 4 seats; generate_series(1, 4) turns its one row into four rows, one per seat. */
export function SeatExpandDiagram() {
    return (
        <Sketch
            label='একটা Row থেকে কয়েকটা Row: generate_series'
            height={250}
            minWidth={860}
            viewBox='0 0 860 250'
            caption={
                <>
                    Booking 2 তে seats 4। generate_series(1, b.seats) এই Row এর জন্য 1 থেকে 4 পর্যন্ত চারটা সংখ্যা বানায়,
                    আর প্রতিটা সংখ্যা Booking টার সাথে জোড়া লেগে একটা আলাদা Row হয়। seats এর মান প্রতিটা Booking এর
                    নিজের, তাই Function টাকে বাঁ দিকের Row দেখতে হয়। Function এর বেলায় PostgreSQL এটা নিজে থেকেই করে,
                    তাই LATERAL শব্দটা লেখা না লেখা সমান।
                </>
            }>
            <defs>
                <marker
                    id='lateral-seat-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchText x={120} y={40} size={10} bold>
                bookings
            </SketchText>
            <rect x={30} y={96} width={180} height={52} fill='currentColor' fillOpacity={0.04} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={46} y={118} anchor='start' size={10.5} bold accent>
                booking_id 2
            </SketchText>
            <SketchText x={46} y={138} anchor='start' size={10} opacity={0.85}>
                seats 4
            </SketchText>
            <line x1={214} y1={122} x2={276} y2={122} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#lateral-seat-arrow)' />
            <rect x={284} y={92} width={220} height={60} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeOpacity={0.8} strokeWidth='1.2' />
            <SketchText x={394} y={118} size={10.5} bold accent>
                generate_series(1, b.seats)
            </SketchText>
            <SketchText x={394} y={138} size={10} body opacity={0.8}>
                এখানে মানে 1 থেকে 4
            </SketchText>
            {[1, 2, 3, 4].map((seat, i) => {
                const y = 40 + i * 44;
                return (
                    <g key={seat}>
                        <path d={`M 508 122 C 550 122, 550 ${y + 16}, 592 ${y + 16}`} fill='none' stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1.1' markerEnd='url(#lateral-seat-arrow)' />
                        <rect x={600} y={y} width={230} height={32} fill='currentColor' fillOpacity={0.03} stroke='currentColor' strokeOpacity={0.4} strokeWidth='1' />
                        <SketchText x={614} y={y + 21} anchor='start' size={10}>
                            {'booking 2  ·  seat_no ' + seat}
                        </SketchText>
                        <SketchText x={818} y={y + 21} anchor='end' size={10} bold accent>
                            {'B2-S' + seat}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={430} y={232} size={10.5} body opacity={0.8}>
                নিশ্চিত আর অপেক্ষার সব Booking এ এভাবে মোট 48টা টিকিট, ঠিক যত সিট ধরা আছে
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. Module 06 এর গল্প                                                       */
/* ------------------------------------------------------------------------- */

const STAGES = [
    { lesson: 'L01', code: 'Split', idea: 'কেন ভাগ' },
    { lesson: 'L02', code: 'INNER', idea: 'শুধু মিল' },
    { lesson: 'L03', code: 'LEFT', idea: 'কেউ বাদ না' },
    { lesson: 'L04', code: 'FULL', idea: 'দুই দিকই' },
    { lesson: 'L05', code: 'CROSS', idea: 'সব জোড়া' },
    { lesson: 'L06', code: 'SELF', idea: 'নিজের সাথে' },
    { lesson: 'L07', code: 'MULTI', idea: 'অনেক Table' },
    { lesson: 'L08', code: 'EXISTS', idea: 'আছে কি নেই' },
    { lesson: 'L09', code: 'LATERAL', idea: 'প্রতিটার জন্য' },
];

/** The nine lessons of Module 06 as one path, from why tables are split to LATERAL. */
export function ModuleSixStoryDiagram() {
    const w = 84;
    const gap = 14;
    return (
        <Sketch
            label='Module 06: ভাগ করা Data আবার জোড়া'
            height={210}
            minWidth={900}
            viewBox='0 0 900 210'
            caption={
                <>
                    Module 05 পর্যন্ত প্রতিটা Query একটা Table এর ভেতরে থাকত। Module 06 শেখাল কেন Data কয়েকটা Table এ
                    ভাগ থাকে, আর কীভাবে আবার জোড়া লাগে: শুধু মিলগুলো, একদিকের সবাই, দুই দিকের সবাই, সব সম্ভাব্য জোড়া,
                    একই Table দুইবার, অনেক Table একসাথে, আছে কি নেই সেই প্রশ্ন, আর শেষে প্রতিটা Row এর জন্য আলাদা একটা
                    ছোট Query।
                </>
            }>
            <defs>
                <marker
                    id='lateral-story-arrow'
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
                const x = 14 + i * (w + gap);
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
                        <SketchText x={mid} y={118} size={10} body bold>
                            {stage.idea}
                        </SketchText>
                        {i < STAGES.length - 1 && (
                            <line
                                x1={x + w + 2}
                                y1={70}
                                x2={x + w + gap - 2}
                                y2={70}
                                stroke='var(--primary)'
                                strokeWidth='1.2'
                                markerEnd='url(#lateral-story-arrow)'
                            />
                        )}
                    </g>
                );
            })}
            <SketchText x={450} y={168} size={10.5} body>
                শেষে সবগুলো একসাথে: ছয়টা Table, INNER আর LEFT JOIN, দুটো LATERAL, যোগফল আর NOT EXISTS,
            </SketchText>
            <SketchText x={450} y={190} size={10.5} body>
                প্রতিটা চালু ট্যুরের পুরো ছবি একটা Query তে
            </SketchText>
        </Sketch>
    );
}
