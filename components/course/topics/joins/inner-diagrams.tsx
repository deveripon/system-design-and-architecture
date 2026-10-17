import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. জোড়া মেলানো: কোন Customer এর সাথে কোন Booking                           */
/* ------------------------------------------------------------------------- */

const PAIR_CUSTOMERS = [
    { id: 1, name: 'Rahim Uddin' },
    { id: 2, name: 'Nusrat Jahan' },
    { id: 3, name: 'Tanvir Ahmed' },
    { id: 15, name: 'Imran Kabir' },
];

const PAIR_BOOKINGS = [
    { id: 1, customer: 1 },
    { id: 2, customer: 2 },
    { id: 3, customer: 3 },
    { id: 8, customer: 1 },
    { id: 13, customer: 2 },
    { id: 17, customer: 1 },
    { id: 22, customer: 3 },
];

/**
 * Four real customers and their seven real bookings. Every line is one pair
 * the join produces; Imran has no line, so he is not in the result at all.
 */
export function JoinPairsDiagram() {
    const leftX = 40;
    const rightX = 500;
    const w = 220;
    const leftY = (i: number) => 92 + i * 62;
    const rightY = (i: number) => 74 + i * 38;
    return (
        <Sketch
            label='Join: matching rows by key'
            height={380}
            minWidth={760}
            viewBox='0 0 760 380'
            caption='বাম দিকে চারজন আসল Customer, ডান দিকে তাঁদের সাতটা আসল Booking। প্রতিটা দাগ একটা জোড়া, আর প্রতিটা জোড়া ফলাফলের একটা Row। Rahim এর তিনটা দাগ, তাই ফলাফলে তিনি তিনবার। Imran Kabir এর একটাও Booking নেই, তাই তাঁর কোনো দাগ নেই, আর INNER JOIN এর ফলাফলে তাঁর নামই আসে না।'>
            <SketchText x={leftX + w / 2} y={36} size={11} bold accent>
                customers
            </SketchText>
            <SketchText x={rightX + w / 2} y={36} size={11} bold accent>
                bookings
            </SketchText>
            <SketchText x={380} y={36} size={9.5} body opacity={0.7}>
                ON c.customer_id = b.customer_id
            </SketchText>

            {PAIR_BOOKINGS.map((b, i) => {
                const from = PAIR_CUSTOMERS.findIndex(c => c.id === b.customer);
                return (
                    <line
                        key={`l${b.id}`}
                        x1={leftX + w}
                        y1={leftY(from)}
                        x2={rightX}
                        y2={rightY(i)}
                        stroke='var(--primary)'
                        strokeOpacity={0.75}
                        strokeWidth='1.3'
                    />
                );
            })}

            {PAIR_CUSTOMERS.map((c, i) => {
                const lonely = !PAIR_BOOKINGS.some(b => b.customer === c.id);
                return (
                    <g key={c.id} opacity={lonely ? 0.45 : 1}>
                        <rect
                            x={leftX}
                            y={leftY(i) - 18}
                            width={w}
                            height={36}
                            fill='transparent'
                            stroke='currentColor'
                            strokeOpacity={0.45}
                            strokeDasharray={lonely ? '4 3' : undefined}
                        />
                        <SketchText x={leftX + 14} y={leftY(i) + 4} anchor='start' size={10.5} bold accent={!lonely}>
                            {String(c.id)}
                        </SketchText>
                        <SketchText x={leftX + 46} y={leftY(i) + 4} anchor='start' size={10.5}>
                            {c.name}
                        </SketchText>
                        {lonely && (
                            <SketchText x={leftX + w / 2} y={leftY(i) + 36} size={9.5} body>
                                কোনো জোড়া নেই, ফলাফলে আসবে না
                            </SketchText>
                        )}
                    </g>
                );
            })}

            {PAIR_BOOKINGS.map((b, i) => (
                <g key={b.id}>
                    <rect
                        x={rightX}
                        y={rightY(i) - 14}
                        width={w}
                        height={28}
                        fill='transparent'
                        stroke='currentColor'
                        strokeOpacity={0.45}
                    />
                    <SketchText x={rightX + 14} y={rightY(i) + 4} anchor='start' size={10}>
                        {`booking ${b.id}`}
                    </SketchText>
                    <SketchText x={rightX + w - 12} y={rightY(i) + 4} anchor='end' size={10} accent>
                        {`customer_id ${b.customer}`}
                    </SketchText>
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা JOIN Query এর অঙ্গপ্রত্যঙ্গ                                          */
/* ------------------------------------------------------------------------- */

const ANATOMY = [
    { code: 'SELECT b.booking_id, c.full_name', note: 'কোন Column, আর কোন Table এর' },
    { code: 'FROM bookings AS b', note: 'প্রথম Table, ডাকনাম b' },
    { code: 'INNER JOIN customers AS c', note: 'দ্বিতীয় Table, ডাকনাম c' },
    { code: '  ON c.customer_id = b.customer_id;', note: 'জোড়ার শর্ত: কোন Row কার সাথে বসবে' },
];

export function JoinAnatomyDiagram() {
    return (
        <Sketch
            label='Anatomy of an INNER JOIN'
            height={250}
            minWidth={820}
            viewBox='0 0 820 250'
            caption='চারটা লাইন, চারটা কাজ। FROM আর JOIN বলে কোন দুটো Table, AS দিয়ে দুটোকে ছোট ডাকনাম, ON বলে কোন Column এর মান মিললে দুটো Row এক জোড়া, আর SELECT বলে জোড়া থেকে কোন কোন Column দেখাতে হবে। INNER শব্দটা বাদ দিলেও একই কথা।'>
            <defs>
                <marker
                    id='inner-anatomy-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <rect x={30} y={30} width={420} height={190} fill='transparent' stroke='currentColor' strokeOpacity={0.4} />
            {ANATOMY.map((row, i) => {
                const y = 72 + i * 42;
                return (
                    <g key={row.code}>
                        <SketchText x={50} y={y} anchor='start' size={12} bold={i === 3} accent={i === 3}>
                            {row.code}
                        </SketchText>
                        <line
                            x1={460}
                            y1={y - 4}
                            x2={530}
                            y2={y - 4}
                            stroke='var(--primary)'
                            strokeWidth='1.2'
                            markerEnd='url(#inner-anatomy-arrow)'
                        />
                        <SketchText x={544} y={y} anchor='start' size={11} body>
                            {row.note}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. এক থেকে অনেক: একটা Customer, তিনটা ফলাফলের Row                           */
/* ------------------------------------------------------------------------- */

const RAHIM_ROWS = [
    { booking: 1, status: 'confirmed' },
    { booking: 8, status: 'confirmed' },
    { booking: 17, status: 'pending' },
];

export function OneToManyRepeatDiagram() {
    return (
        <Sketch
            label='One customer, three result rows'
            height={260}
            minWidth={760}
            viewBox='0 0 760 260'
            caption='customers Table এ Rahim Uddin একবারই আছেন। কিন্তু bookings এ তাঁর তিনটা Booking, তাই JOIN এর ফলাফলে তাঁর নাম তিনবার, প্রতিটা Booking এর পাশে একবার করে। "এক" দিকের মান পুনরাবৃত্তি হওয়া ভুল না, এটাই JOIN এর স্বাভাবিক আচরণ। তবে এখানে sum(seats) করলে ঠিক, কিন্তু Customer গুনতে count(*) করলে তিন আসবে, একজনের জায়গায়।'>
            <rect x={30} y={100} width={200} height={50} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' />
            <SketchText x={130} y={86} size={10} body opacity={0.75}>
                customers এ একটা Row
            </SketchText>
            <SketchText x={130} y={130} size={11} bold accent>
                1 · Rahim Uddin
            </SketchText>

            <SketchText x={560} y={44} size={10} body opacity={0.75}>
                JOIN এর ফলাফলে তিনটা Row
            </SketchText>
            {RAHIM_ROWS.map((r, i) => {
                const y = 70 + i * 60;
                return (
                    <g key={r.booking}>
                        <path
                            d={`M 230 125 C 300 125, 330 ${y + 18}, 400 ${y + 18}`}
                            fill='none'
                            stroke='var(--primary)'
                            strokeOpacity={0.7}
                            strokeWidth='1.3'
                        />
                        <rect x={400} y={y} width={330} height={36} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
                        <SketchText x={414} y={y + 23} anchor='start' size={10.5} bold accent>
                            Rahim Uddin
                        </SketchText>
                        <SketchText x={560} y={y + 23} anchor='start' size={10.5}>
                            {`booking ${r.booking}`}
                        </SketchText>
                        <SketchText x={716} y={y + 23} anchor='end' size={10} opacity={0.75}>
                            {r.status}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. NATURAL JOIN এর ফাঁদ                                                     */
/* ------------------------------------------------------------------------- */

const BOOKING_COLUMNS = ['booking_id', 'customer_id', 'departure_id', 'seats', 'status', 'total_bdt', 'booked_at'];
const PAYMENT_COLUMNS = ['payment_id', 'booking_id', 'amount_bdt', 'method', 'status', 'paid_at'];
const SHARED = new Set(['booking_id', 'status']);

function ColumnList({ columns, values }: { columns: string[]; values: Record<string, string> }) {
    return (
        <>
            {columns.map((col, i) => {
                const shared = SHARED.has(col);
                const y = 26 + i * 30;
                return (
                    <g key={col}>
                        <rect
                            x={10}
                            y={y - 16}
                            width={240}
                            height={24}
                            fill={shared ? 'var(--primary)' : 'transparent'}
                            fillOpacity={shared ? 0.1 : 0}
                            stroke={shared ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={shared ? 0.9 : 0.3}
                        />
                        <SketchText x={22} y={y} anchor='start' size={10.5} bold={shared} accent={shared}>
                            {col}
                        </SketchText>
                        {values[col] && (
                            <SketchText x={238} y={y} anchor='end' size={9.5} opacity={0.8}>
                                {values[col]}
                            </SketchText>
                        )}
                    </g>
                );
            })}
        </>
    );
}

export function NaturalJoinTrapSplit() {
    return (
        <SketchSplit
            label='NATURAL JOIN matches every same-named column'
            caption='NATURAL JOIN নিজে নিজে খুঁজে নেয় দুই Table এ একই নামের Column কোনগুলো, আর সবগুলো মিলতে হবে এমন শর্ত বানায়। এখানে মিল দুটো: booking_id আর status। কিন্তু bookings এর status হলো confirmed বা pending, আর payments এর status হলো paid বা failed। এক Row এও দুটো এক হয় না, তাই ফলাফল শূন্য Row, কোনো Error ছাড়াই।'
            panels={[
                {
                    title: 'bookings',
                    sub: 'booking 1 এর মান',
                    viewBox: '0 0 260 220',
                    height: 220,
                    children: (
                        <ColumnList
                            columns={BOOKING_COLUMNS}
                            values={{ booking_id: '1', status: 'confirmed' }}
                        />
                    ),
                },
                {
                    title: 'payments',
                    sub: 'payment 1 এর মান',
                    viewBox: '0 0 260 220',
                    height: 220,
                    children: (
                        <ColumnList columns={PAYMENT_COLUMNS} values={{ booking_id: '1', status: 'paid' }} />
                    ),
                },
            ]}
        />
    );
}
