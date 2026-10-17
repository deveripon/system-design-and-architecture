import { Sketch, SketchSplit, SketchText } from '../../sketch';
import { BOOKINGS, DEPARTURES, placementReport } from './multi-data';

/* ------------------------------------------------------------------------- */
/* 1. ছয়টা Table, পাঁচটা চাবি                                                  */
/* ------------------------------------------------------------------------- */

function TableBox({
    x,
    y,
    name,
    rows,
    accent,
}: {
    x: number;
    y: number;
    name: string;
    rows: string;
    accent?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={140}
                height={54}
                fill={accent ? 'var(--primary)' : 'var(--card)'}
                fillOpacity={accent ? 0.12 : 1}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 1 : 0.5}
                strokeWidth='1.3'
            />
            <SketchText x={x + 70} y={y + 23} size={11.5} bold accent={accent}>
                {name}
            </SketchText>
            <SketchText x={x + 70} y={y + 41} size={9} opacity={0.7}>
                {rows}
            </SketchText>
        </g>
    );
}

/**
 * The path every multi-table question walks: a booking points at a customer
 * and a departure, the departure at a tour, the tour at a destination and a
 * guide. Each line is one ON condition.
 */
export function JoinChainMapDiagram() {
    const link = (x1: number, y1: number, x2: number, y2: number, dashed?: boolean) => (
        <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke='var(--primary)'
            strokeWidth='1.4'
            strokeDasharray={dashed ? '5 4' : undefined}
            markerEnd='url(#multi-chain-arrow)'
        />
    );
    return (
        <Sketch
            label='Six Tables, Five Keys'
            height={330}
            minWidth={980}
            viewBox='0 0 1000 330'
            caption='প্রতিটা তীর একটা ON শর্ত: বাঁ দিকের Table এর একটা Column ডান দিকের Table এর Primary Key কে দেখায়। একটা Booking থেকে তার Guide এর নাম পেতে চারটা লাফ লাগে: bookings থেকে departures, departures থেকে tours, tours থেকে guides। guides এর তীরটা ভাঙা দাগে, কারণ tours.guide_id খালি থাকতে পারে, Ratargul এর বেলায় যেমন।'>
            <defs>
                <marker
                    id='multi-chain-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            <TableBox x={30} y={40} name='customers' rows='15 rows' />
            <TableBox x={220} y={150} name='bookings' rows='24 rows' accent />
            <TableBox x={430} y={150} name='departures' rows='16 rows' />
            <TableBox x={640} y={150} name='tours' rows='9 rows' />
            <TableBox x={840} y={40} name='destinations' rows='7 rows' />
            <TableBox x={840} y={260} name='guides' rows='5 rows' />

            {link(240, 150, 140, 98)}
            {link(360, 177, 426, 177)}
            {link(570, 177, 636, 177)}
            {link(780, 162, 838, 96)}
            {link(780, 192, 838, 262, true)}

            <SketchText x={150} y={140} size={9} anchor='start' opacity={0.85}>
                b.customer_id = c.customer_id
            </SketchText>
            <SketchText x={398} y={232} size={9} opacity={0.85}>
                b.departure_id
            </SketchText>
            <SketchText x={398} y={246} size={9} opacity={0.85}>
                = d.departure_id
            </SketchText>
            <SketchText x={604} y={232} size={9} opacity={0.85}>
                d.tour_id
            </SketchText>
            <SketchText x={604} y={246} size={9} opacity={0.85}>
                = t.tour_id
            </SketchText>
            <SketchText x={700} y={110} size={9} anchor='start' opacity={0.85}>
                t.destination_id
            </SketchText>
            <SketchText x={700} y={252} size={9} anchor='start' opacity={0.85}>
                t.guide_id (NULL হতে পারে)
            </SketchText>

            <SketchText x={290} y={300} size={10} body opacity={0.85}>
                প্রশ্ন শুরু হয় যেখানে উত্তরের এক Row মানে এক জিনিস, এখানে এক Booking
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. LEFT JOIN এর শিকল, শেষে একটা INNER JOIN                                  */
/* ------------------------------------------------------------------------- */

function Cell({ x, y, w, text, faded }: { x: number; y: number; w: number; text: string; faded?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={26}
                fill='transparent'
                stroke='currentColor'
                strokeOpacity={0.4}
                strokeWidth='1'
            />
            <SketchText x={x + w / 2} y={y + 17} size={9.5} opacity={faded ? 0.5 : 0.95}>
                {text}
            </SketchText>
        </g>
    );
}

/**
 * Imran Kabir has no booking. Two LEFT JOINs keep him, with NULLs. The third
 * join is INNER, its ON compares NULL with a tour id, the answer is unknown,
 * and his row silently disappears: 25 rows become 24.
 */
export function LeftChainTrapDiagram() {
    const stage = (x: number, title: string, count: string, cells: string[], dropped?: boolean) => (
        <g>
            <SketchText x={x + 130} y={36} size={10.5} bold accent>
                {title}
            </SketchText>
            {cells.map((c, i) => (
                <Cell key={i} x={x + i * 65} y={70} w={65} text={c} faded={c === 'NULL'} />
            ))}
            {dropped && (
                <line
                    x1={x - 6}
                    y1={83}
                    x2={x + cells.length * 65 + 6}
                    y2={83}
                    stroke='var(--primary)'
                    strokeWidth='2'
                />
            )}
            <SketchText x={x + 130} y={130} size={10} bold>
                {count}
            </SketchText>
        </g>
    );
    return (
        <Sketch
            label='The Trap: A Late INNER JOIN Undoes the LEFT JOINs'
            height={250}
            minWidth={980}
            viewBox='0 0 1000 250'
            caption='Imran Kabir এর কোনো Booking নেই। প্রথম দুটো LEFT JOIN তাঁর Row রাখে, ফাঁকা ঘরে NULL বসিয়ে। তৃতীয় Join টা INNER, তার শর্ত t.tour_id = d.tour_id, আর d.tour_id তো NULL। NULL এর সাথে তুলনা সত্যও না, মিথ্যাও না, অজানা। INNER JOIN অজানাকে মিল ধরে না, তাই Imran নিঃশব্দে হারিয়ে যান: ২৫টা Row থেকে ২৪টা। কোনো Error নেই।'>
            <defs>
                <marker
                    id='multi-trap-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {stage(20, 'customers LEFT JOIN bookings', '25 rows', ['15', 'Imran', 'NULL', 'NULL'])}
            {stage(345, '... LEFT JOIN departures', '25 rows', ['Imran', 'NULL', 'NULL', 'NULL'])}
            {stage(670, '... JOIN tours (INNER)', '24 rows', ['Imran', 'NULL', 'NULL', 'NULL'], true)}
            <line x1={290} y1={83} x2={335} y2={83} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#multi-trap-arrow)' />
            <line x1={615} y1={83} x2={660} y2={83} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#multi-trap-arrow)' />
            <SketchText x={800} y={180} size={10} body accent>
                NULL = 1 ? অজানা, তাই মিল নেই, Row বাদ
            </SketchText>
            <SketchText x={480} y={215} size={10} body opacity={0.85}>
                সমাধান: শিকলের পরের সব Join ও LEFT, অথবা INNER Join টা বন্ধনীর ভেতরে
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. শর্ত ON এ নাকি WHERE এ                                                    */
/* ------------------------------------------------------------------------- */

function PlacementColumn({ placement }: { placement: 'on' | 'where' }) {
    const kept = placementReport(placement, 'confirmed');
    const keptIds = new Set(kept.map(r => r.id));
    const all = placementReport('on', 'confirmed');
    return (
        <g>
            {all.map((row, i) => {
                const y = 18 + i * 21;
                const isKept = keptIds.has(row.id);
                const count = kept.find(k => k.id === row.id)?.count;
                return (
                    <g key={row.id}>
                        <SketchText x={8} y={y} size={9.5} anchor='start' opacity={isKept ? 0.95 : 0.35}>
                            {`${row.id}  ${row.name}`}
                        </SketchText>
                        <SketchText
                            x={250}
                            y={y}
                            size={9.5}
                            anchor='end'
                            bold={count === 0}
                            accent={count === 0}
                            opacity={isKept ? 1 : 0.35}>
                            {isKept ? String(count) : 'বাদ'}
                        </SketchText>
                        {!isKept && (
                            <line x1={6} y1={y - 3} x2={226} y2={y - 3} stroke='var(--primary)' strokeWidth='1.3' />
                        )}
                    </g>
                );
            })}
        </g>
    );
}

/**
 * The same LEFT JOIN with `status = 'confirmed'` in two places. In ON it only
 * decides which bookings attach, so all 15 customers stay, three with 0. In
 * WHERE it runs after the join and throws whole rows away: 12 customers.
 */
export function OnVsWhereSplit() {
    return (
        <SketchSplit
            label='The Same Condition, Two Places'
            caption='বাঁ দিকে শর্ত ON এ: কোন Booking জোড়া লাগবে সেটা ঠিক করে, কিন্তু Customer কে ফেলে না। তাই Sabbir (শুধু বাতিল), Kamal (শুধু pending) আর Imran (কিছুই নেই) সবাই আছেন, গুনতি ০। ডান দিকে একই শর্ত WHERE এ: Join শেষ হওয়ার পরে চলে, আর NULL এর সাথে status তুলনা অজানা, তাই ওই তিনজনের Row বাদ। ১৫ থেকে ১২।'
            panels={[
                {
                    title: "ON ... AND b.status = 'confirmed'",
                    sub: '15 customers',
                    viewBox: '0 0 260 330',
                    height: 330,
                    children: <PlacementColumn placement='on' />,
                },
                {
                    title: "WHERE b.status = 'confirmed'",
                    sub: '12 customers',
                    viewBox: '0 0 260 330',
                    height: 330,
                    children: <PlacementColumn placement='where' />,
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Fan-out: Departure এর সংখ্যা Booking এর সাথে গুণ হয়ে যায়                 */
/* ------------------------------------------------------------------------- */

/**
 * Tour 1's four departures hold 66 free seats. Join the bookings first and
 * each departure row repeats once per booking, so sum(seats_left) adds 14 and
 * 19 twice: 113. Nothing errors, the number is simply wrong.
 */
export function FanOutDiagram() {
    const deps = DEPARTURES.filter(d => d.tour === 1);
    const joined = deps.flatMap(d => {
        const books = BOOKINGS.filter(b => b.departure === d.id);
        return books.map(b => ({ dep: d.id, left: d.seatsLeft, booking: b.id }));
    });
    const before = deps.reduce((s, d) => s + d.seatsLeft, 0);
    const after = joined.reduce((s, r) => s + r.left, 0);
    return (
        <Sketch
            label='Fan-out: One Departure Row Becomes Several'
            height={300}
            minWidth={900}
            viewBox='0 0 900 300'
            caption={`Saint Martin Island Escape এর চারটা Departure এ খালি সিট মোট ${before}টা। কিন্তু bookings জোড়া দেওয়ার পরে প্রতিটা Departure এর Row যতগুলো Booking ততবার আসে: Departure 1, 2 আর 8 দুইবার করে, 9 একবার। তখন sum(seats_left) একই ১৪ আর ১৯ বারবার যোগ করে ${after} বানায়। Departure এর হিসাব Departure এর Row এ, Booking এর হিসাব Booking এর Row এ।`}>
            <SketchText x={150} y={30} size={10.5} bold accent>
                departures একা
            </SketchText>
            {deps.map((d, i) => (
                <g key={d.id}>
                    <rect x={60} y={50 + i * 34} width={180} height={26} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
                    <SketchText x={110} y={67 + i * 34} size={10}>
                        {`departure ${d.id}`}
                    </SketchText>
                    <SketchText x={210} y={67 + i * 34} size={10} bold>
                        {String(d.seatsLeft)}
                    </SketchText>
                </g>
            ))}
            <SketchText x={150} y={210} size={11} bold>
                {`sum = ${before}`}
            </SketchText>

            <SketchText x={620} y={30} size={10.5} bold accent>
                departures JOIN bookings
            </SketchText>
            {joined.map((r, i) => (
                <g key={`${r.dep}-${r.booking}`}>
                    <rect x={480} y={46 + i * 30} width={290} height={24} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
                    <SketchText x={540} y={62 + i * 30} size={9.5}>
                        {`departure ${r.dep}`}
                    </SketchText>
                    <SketchText x={650} y={62 + i * 30} size={9.5} bold accent>
                        {String(r.left)}
                    </SketchText>
                    <SketchText x={730} y={62 + i * 30} size={9.5} opacity={0.7}>
                        {`booking ${r.booking}`}
                    </SketchText>
                </g>
            ))}
            <SketchText x={625} y={272} size={11} bold accent>
                {`sum = ${after}`}
            </SketchText>
            <SketchText x={370} y={140} size={18} bold accent>
                ×
            </SketchText>
        </Sketch>
    );
}
