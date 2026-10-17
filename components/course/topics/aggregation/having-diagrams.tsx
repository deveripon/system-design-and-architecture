import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. দুটো ছাঁকনি: Row এর জন্য WHERE, Group এর জন্য HAVING                     */
/* ------------------------------------------------------------------------- */

function Funnel({ x, y, label, sub }: { x: number; y: number; label: string; sub: string }) {
    return (
        <g>
            <path
                d={`M ${x} ${y} L ${x + 160} ${y} L ${x + 115} ${y + 70} L ${x + 45} ${y + 70} Z`}
                fill='var(--primary)'
                fillOpacity={0.1}
                stroke='var(--primary)'
                strokeWidth='1.3'
            />
            <SketchText x={x + 80} y={y + 22} size={10.5} bold accent>
                {label}
            </SketchText>
            <SketchText x={x + 80} y={y + 38} size={8.5} opacity={0.8}>
                {sub}
            </SketchText>
        </g>
    );
}

function Stack({ x, y, title, count, note }: { x: number; y: number; title: string; count: string; note: string }) {
    return (
        <g>
            {[0, 1, 2].map(i => (
                <rect
                    key={i}
                    x={x + i * 5}
                    y={y + 10 - i * 5}
                    width={120}
                    height={58}
                    fill='var(--card)'
                    stroke='currentColor'
                    strokeOpacity={0.45}
                    strokeWidth='1.1'
                />
            ))}
            <SketchText x={x + 70} y={y + 32} size={10.5} bold>
                {title}
            </SketchText>
            <SketchText x={x + 70} y={y + 50} size={10} accent bold>
                {count}
            </SketchText>
            <SketchText x={x + 68} y={y + 98} size={10} body opacity={0.8}>
                {note}
            </SketchText>
        </g>
    );
}

/**
 * The whole lesson in one picture: 24 booking rows go through WHERE, become
 * groups, and the groups go through HAVING. The numbers are the real counts
 * for "departures with more than 4 live seats booked".
 */
export function TwoSievesDiagram() {
    const arrow = (x1: number, x2: number) => (
        <line
            x1={x1}
            y1={130}
            x2={x2}
            y2={130}
            stroke='var(--primary)'
            strokeWidth='1.4'
            markerEnd='url(#having-sieve-arrow)'
        />
    );
    return (
        <Sketch
            label='Two Sieves: WHERE for Rows, HAVING for Groups'
            height={300}
            minWidth={960}
            viewBox='0 0 960 300'
            caption='আসল হিসাব: bookings এর ২৪টা Row থেকে WHERE তিনটা cancelled Row ফেলে দেয়, থাকে ২১টা। সেগুলো departure_id অনুযায়ী ১৪টা দলে ভাগ হয়। তারপর HAVING প্রতিটা দলের মোট সিট দেখে, আর শুধু তিনটা দল টিকে থাকে: Departure 1, 8 আর 10। প্রথম ছাঁকনি একটা একটা Row দেখে, দ্বিতীয়টা একটা একটা দল।'>
            <defs>
                <marker
                    id='having-sieve-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            <Stack x={10} y={95} title='bookings' count='24 rows' note='সব Booking' />
            {arrow(142, 164)}
            <Funnel x={168} y={95} label='WHERE' sub="status <> 'cancelled'" />
            <SketchText x={248} y={196} size={10} body opacity={0.8}>
                একটা একটা Row দেখে
            </SketchText>
            <SketchText x={248} y={214} size={10} body opacity={0.8}>
                Group এর আগে
            </SketchText>
            {arrow(332, 354)}
            <Stack x={358} y={95} title='21 rows' count='→ 14 groups' note='GROUP BY departure_id' />
            {arrow(492, 514)}
            <Funnel x={518} y={95} label='HAVING' sub='sum(seats) > 4' />
            <SketchText x={598} y={196} size={10} body opacity={0.8}>
                একটা একটা Group দেখে
            </SketchText>
            <SketchText x={598} y={214} size={10} body opacity={0.8}>
                হিসাবের পরে
            </SketchText>
            {arrow(682, 704)}
            <rect
                x={708}
                y={95}
                width={240}
                height={70}
                fill='var(--primary)'
                fillOpacity={0.1}
                stroke='var(--primary)'
                strokeWidth='1.3'
            />
            <SketchText x={828} y={120} size={10.5} bold accent>
                3 groups
            </SketchText>
            <SketchText x={828} y={142} size={10}>
                departure 1, 8, 10
            </SketchText>
            <SketchText x={828} y={196} size={10} body opacity={0.8}>
                ফলাফল: ভিড় জমা তিনটা Departure
            </SketchText>

            <SketchText x={248} y={80} size={9.5} body opacity={0.6}>
                ছাঁকনি ১
            </SketchText>
            <SketchText x={598} y={80} size={9.5} body opacity={0.6}>
                ছাঁকনি ২
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন ধাপে কে কী দেখতে পায়                                                 */
/* ------------------------------------------------------------------------- */

const STEPS = [
    { n: '1', name: 'FROM', on: false },
    { n: '2', name: 'WHERE', on: true },
    { n: '3', name: 'GROUP BY', on: false },
    { n: '4', name: 'HAVING', on: true },
    { n: '5', name: 'SELECT', on: false },
    { n: '6', name: 'ORDER BY', on: false },
    { n: '7', name: 'LIMIT', on: false },
];

/**
 * The logical order again, with the two filters lit. Under each one: what it
 * can see at that moment. WHERE runs before any group exists, so it cannot see
 * count() or sum(); HAVING runs after, so it sees nothing but groups.
 */
export function ClauseTimelineDiagram() {
    const w = 112;
    const gap = 18;
    const x0 = (960 - (STEPS.length * w + (STEPS.length - 1) * gap)) / 2;
    const xOf = (i: number) => x0 + i * (w + gap);
    return (
        <Sketch
            label='What Each Filter Can See'
            height={250}
            minWidth={960}
            viewBox='0 0 960 250'
            caption='Database Query টা যে ক্রমে চালায়, সেই ক্রমে সাতটা ধাপ। WHERE বসে দুই নম্বরে, তখনো কোনো দল তৈরি হয়নি, তাই সে শুধু একটা Row এর Column দেখে। HAVING বসে চার নম্বরে, দল আর তার হিসাব তৈরি হওয়ার পরে, তাই সে দেখে প্রতিটা দলের count, sum, avg। SELECT এর Alias তৈরি হয় পাঁচ নম্বরে, এই কারণেই PostgreSQL এ WHERE বা HAVING কেউই Alias চেনে না।'>
            <defs>
                <marker
                    id='having-timeline-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='currentColor' fillOpacity={0.5} />
                </marker>
            </defs>
            {STEPS.map((s, i) => (
                <g key={s.name}>
                    <rect
                        x={xOf(i)}
                        y={40}
                        width={w}
                        height={54}
                        fill={s.on ? 'var(--primary)' : 'transparent'}
                        fillOpacity={s.on ? 0.12 : 0}
                        stroke={s.on ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={s.on ? 1 : 0.4}
                        strokeWidth='1.3'
                    />
                    <SketchText x={xOf(i) + w / 2} y={60} size={9} opacity={0.6}>
                        {`ধাপ ${s.n}`}
                    </SketchText>
                    <SketchText x={xOf(i) + w / 2} y={80} size={11.5} bold accent={s.on}>
                        {s.name}
                    </SketchText>
                    {i < STEPS.length - 1 && (
                        <line
                            x1={xOf(i) + w + 2}
                            y1={67}
                            x2={xOf(i + 1) - 3}
                            y2={67}
                            stroke='currentColor'
                            strokeOpacity={0.5}
                            strokeWidth='1.2'
                            markerEnd='url(#having-timeline-arrow)'
                        />
                    )}
                </g>
            ))}

            <path
                d={`M ${xOf(1) + w / 2} 98 V 128`}
                stroke='var(--primary)'
                strokeWidth='1.2'
                strokeDasharray='3 3'
            />
            <SketchText x={xOf(1) + w / 2} y={146} size={10} body accent bold>
                দেখে: একটা Row
            </SketchText>
            <SketchText x={xOf(1) + w / 2} y={166} size={9.5}>
                status, seats, booked_at
            </SketchText>
            <SketchText x={xOf(1) + w / 2} y={186} size={9.5} opacity={0.7}>
                count(*) এখানে নেই
            </SketchText>

            <path
                d={`M ${xOf(3) + w / 2} 98 V 128`}
                stroke='var(--primary)'
                strokeWidth='1.2'
                strokeDasharray='3 3'
            />
            <SketchText x={xOf(3) + w / 2} y={146} size={10} body accent bold>
                দেখে: একটা Group
            </SketchText>
            <SketchText x={xOf(3) + w / 2} y={166} size={9.5}>
                count(*), sum(seats)
            </SketchText>
            <SketchText x={xOf(3) + w / 2} y={186} size={9.5} opacity={0.7}>
                আলাদা Row আর নেই
            </SketchText>

            <SketchText x={xOf(4) + w / 2} y={146} size={9.5} body opacity={0.75}>
                Alias এর জন্ম
            </SketchText>
            <SketchText x={xOf(4) + w / 2} y={166} size={9.5} opacity={0.6}>
                AS bookings
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. বাতিল Booking কীভাবে দলের হিসাবে ঢুকে পড়ে                               */
/* ------------------------------------------------------------------------- */

const DEPARTURE_THREE = [
    { id: 4, seats: 3, status: 'confirmed' },
    { id: 5, seats: 2, status: 'cancelled' },
];

function LeakPanel({ withWhere }: { withWhere: boolean }) {
    const kept = DEPARTURE_THREE.filter(r => !withWhere || r.status !== 'cancelled');
    const total = kept.reduce((s, r) => s + r.seats, 0);
    const passes = total > 4;
    return (
        <>
            {DEPARTURE_THREE.map((r, i) => {
                const dropped = withWhere && r.status === 'cancelled';
                return (
                    <g key={r.id} opacity={dropped ? 0.35 : 1}>
                        <rect
                            x={14}
                            y={20 + i * 44}
                            width={250}
                            height={34}
                            fill='transparent'
                            stroke={r.status === 'cancelled' ? 'currentColor' : 'var(--primary)'}
                            strokeOpacity={r.status === 'cancelled' ? 0.5 : 0.9}
                            strokeDasharray={dropped ? '4 3' : undefined}
                            strokeWidth='1.2'
                        />
                        <SketchText x={26} y={42 + i * 44} anchor='start' size={10}>
                            {`booking ${r.id} · ${r.seats} seats · ${r.status}`}
                        </SketchText>
                        {dropped && (
                            <line
                                x1={20}
                                y1={37 + i * 44}
                                x2={258}
                                y2={37 + i * 44}
                                stroke='currentColor'
                                strokeOpacity={0.7}
                                strokeWidth='1.2'
                            />
                        )}
                    </g>
                );
            })}
            <SketchText x={14} y={132} anchor='start' size={10.5} bold>
                {`sum(seats) = ${total}`}
            </SketchText>
            <SketchText x={14} y={156} anchor='start' size={10.5} bold accent={!passes}>
                {`> 4 ?  ${passes ? 'true, তালিকায় ঢুকল' : 'false, বাদ পড়ল'}`}
            </SketchText>
            <SketchText x={14} y={182} anchor='start' size={9.5} body opacity={0.8}>
                {withWhere ? 'বাতিল Booking দলে ঢোকার আগেই বাদ' : 'বাতিল দুই সিটও যোগফলে ঢুকে গেছে'}
            </SketchText>
        </>
    );
}

/**
 * Departure 3 has a confirmed booking for 3 seats and a cancelled one for 2.
 * Without WHERE the cancelled seats are summed and the departure looks busy;
 * with WHERE the group only ever sees the live booking.
 */
export function CancelledLeakSplit() {
    return (
        <SketchSplit
            label='Departure 3: Where the Cancelled Seats Go'
            caption='একই প্রশ্ন, "চারটার বেশি সিট বুক হয়েছে এমন Departure", একই HAVING sum(seats) > 4। বাঁ দিকে WHERE নেই, তাই বাতিল Booking এর দুই সিটও যোগ হয়ে Departure 3 ভিড়ের তালিকায় ঢুকে পড়ে। ডান দিকে WHERE আগেই বাতিল Row টা ফেলে দেয়, দলের হিসাব হয় তিন, আর Departure 3 ঠিকভাবেই বাদ পড়ে। HAVING দেখে শুধু যা দলে ঢুকেছে, দলে কী ঢুকবে সেটা ঠিক করে WHERE।'
            panels={[
                {
                    title: 'শুধু HAVING',
                    sub: 'GROUP BY departure_id HAVING sum(seats) > 4',
                    viewBox: '0 0 280 200',
                    height: 200,
                    children: <LeakPanel withWhere={false} />,
                },
                {
                    title: 'WHERE তারপর HAVING',
                    sub: "WHERE status <> 'cancelled' ... HAVING sum(seats) > 4",
                    viewBox: '0 0 280 200',
                    height: 200,
                    children: <LeakPanel withWhere />,
                },
            ]}
        />
    );
}
