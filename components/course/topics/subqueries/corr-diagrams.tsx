import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Real values used by the pictures in this lesson                           */
/* ------------------------------------------------------------------------- */

/** Four real customers, their booking totals and their own average (2 decimals). */
const OWN_AVERAGES: { id: number; name: string; avg: string }[] = [
    { id: 1, name: 'Rahim Uddin', avg: '26666.67' },
    { id: 2, name: 'Nusrat Jahan', avg: '37500.00' },
    { id: 5, name: 'Sabbir Hossain', avg: '17000.00' },
    { id: 15, name: 'Imran Kabir', avg: 'NULL' },
];

function Arrow({ id }: { id: string }) {
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

/* ------------------------------------------------------------------------- */
/* 1. Two kinds of subquery: once for all, or once per row                   */
/* ------------------------------------------------------------------------- */

export function TwoKindsSplit() {
    return (
        <SketchSplit
            label='দুই রকম Subquery: সবার জন্য একবার, নাকি প্রতিটা Row এর জন্য একবার'
            caption='বাঁয়ে Lesson 01 এর Subquery: ভেতরের Query বাইরের কিছুই দেখে না, তাই একবার চলে আর একটাই মান দেয়, 24679.17, যেটা চব্বিশটা Booking এর প্রত্যেকের সাথে তুলনা হয়। ডানে Correlated Subquery: ভেতরের Query বাইরের Row এর customer_id দেখে, তাই প্রতিটা Customer এর জন্য তার উত্তর আলাদা। Imran Kabir এর কোনো Booking নেই, তাই তাঁর গড় NULL।'
            panels={[
                {
                    title: 'Uncorrelated',
                    sub: 'Lesson 01 এর মতো',
                    viewBox: '0 0 360 230',
                    height: 230,
                    minWidth: 320,
                    children: (
                        <>
                            <Arrow id='corr-kinds-arrow-a' />
                            <rect x={20} y={20} width={320} height={60} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeWidth='1.2' />
                            <SketchText x={180} y={44} size={10}>
                                SELECT avg(total_bdt) FROM bookings
                            </SketchText>
                            <SketchText x={180} y={66} size={9.5} body accent>
                                একবার চলে, বাইরের কিছু দেখে না
                            </SketchText>
                            <line x1={180} y1={82} x2={180} y2={112} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#corr-kinds-arrow-a)' />
                            <rect x={115} y={116} width={130} height={36} fill='transparent' stroke='var(--primary)' strokeWidth='1.3' />
                            <SketchText x={180} y={139} size={11} bold accent>
                                24679.17
                            </SketchText>
                            <SketchText x={180} y={180} size={9.5} body opacity={0.85}>
                                এই একটা সংখ্যার সাথে
                            </SketchText>
                            <SketchText x={180} y={198} size={9.5} body opacity={0.85}>
                                চব্বিশটা Booking এর তুলনা
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'Correlated',
                    sub: 'এই লেসনের বিষয়',
                    viewBox: '0 0 360 230',
                    height: 230,
                    minWidth: 320,
                    children: (
                        <>
                            <Arrow id='corr-kinds-arrow-b' />
                            {OWN_AVERAGES.map((c, i) => {
                                const y = 18 + i * 52;
                                const last = c.avg === 'NULL';
                                return (
                                    <g key={c.id}>
                                        <rect x={10} y={y} width={110} height={36} fill='transparent' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.1' />
                                        <SketchText x={65} y={y + 15} size={9}>
                                            {`customer ${c.id}`}
                                        </SketchText>
                                        <SketchText x={65} y={y + 29} size={8.5} opacity={0.75}>
                                            {c.name}
                                        </SketchText>
                                        <line x1={122} y1={y + 18} x2={150} y2={y + 18} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#corr-kinds-arrow-b)' />
                                        <rect x={154} y={y} width={124} height={36} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1.1' />
                                        <SketchText x={216} y={y + 15} size={8.5}>
                                            avg(...) WHERE
                                        </SketchText>
                                        <SketchText x={216} y={y + 29} size={8.5} accent>
                                            {`customer_id = ${c.id}`}
                                        </SketchText>
                                        <line x1={280} y1={y + 18} x2={296} y2={y + 18} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#corr-kinds-arrow-b)' />
                                        <SketchText x={326} y={y + 22} size={9.5} bold accent={!last} opacity={last ? 0.6 : 1}>
                                            {c.avg}
                                        </SketchText>
                                    </g>
                                );
                            })}
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 2. The per-row model: one small question for each outer row               */
/* ------------------------------------------------------------------------- */

/** Real booking counts for the first five customers and Imran. */
const COUNTS: { id: number; name: string; count: number }[] = [
    { id: 1, name: 'Rahim Uddin', count: 3 },
    { id: 2, name: 'Nusrat Jahan', count: 2 },
    { id: 3, name: 'Tanvir Ahmed', count: 2 },
    { id: 5, name: 'Sabbir Hossain', count: 1 },
    { id: 15, name: 'Imran Kabir', count: 0 },
];

export function PerRowDiagram() {
    return (
        <Sketch
            label='মডেল: বাইরের প্রতিটা Row এর জন্য ভেতরের Query তে নতুন একটা সংখ্যা'
            height={360}
            minWidth={840}
            viewBox='0 0 840 360'
            caption='বাইরের Query customers এর পনেরোটা Row এক এক করে নেয়। প্রতিটা Row এর জন্য ভেতরের Query তে c.customer_id এর জায়গায় সেই Row এর নম্বর বসে, ভেতরের Query চলে, আর তার একটা উত্তর ফলাফলের নতুন Column এ বসে। ছবিতে পনেরো জনের পাঁচজন। এটা বোঝার মডেল: ফলাফল সবসময় এই মডেলের সাথে মেলে, যদিও Database কখনো কখনো কাজটা আরও চালাকির সাথে করে।'>
            <Arrow id='corr-row-arrow' />
            <SketchText x={110} y={24} size={10} bold>
                customers c (বাইরের)
            </SketchText>
            <SketchText x={420} y={24} size={10} bold accent>
                ভেতরের Query, নম্বর বসিয়ে
            </SketchText>
            <SketchText x={730} y={24} size={10} bold>
                ফলাফলের Row
            </SketchText>
            {COUNTS.map((c, i) => {
                const y = 44 + i * 58;
                const zero = c.count === 0;
                return (
                    <g key={c.id}>
                        <rect x={20} y={y} width={180} height={40} fill='transparent' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.1' />
                        <SketchText x={110} y={y + 17} size={9.5}>
                            {`customer_id = ${c.id}`}
                        </SketchText>
                        <SketchText x={110} y={y + 32} size={9} opacity={0.75}>
                            {c.name}
                        </SketchText>
                        <line x1={202} y1={y + 20} x2={246} y2={y + 20} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#corr-row-arrow)' />
                        <rect x={250} y={y} width={340} height={40} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1.1' />
                        <SketchText x={420} y={y + 17} size={9}>
                            SELECT count(*) FROM bookings b
                        </SketchText>
                        <SketchText x={420} y={y + 32} size={9} accent>
                            {`WHERE b.customer_id = ${c.id}`}
                        </SketchText>
                        <line x1={592} y1={y + 20} x2={636} y2={y + 20} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#corr-row-arrow)' />
                        <rect x={640} y={y} width={180} height={40} fill={zero ? 'transparent' : 'var(--primary)'} fillOpacity={zero ? 0 : 0.1} stroke={zero ? 'currentColor' : 'var(--primary)'} strokeOpacity={zero ? 0.5 : 1} strokeWidth='1.1' />
                        <SketchText x={730} y={y + 25} size={9.5} bold accent={!zero}>
                            {`${c.name.split(' ')[0]} | ${c.count}`}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={420} y={346} size={9.5} body opacity={0.75}>
                Imran এর কোনো Booking নেই, তাই count(*) দেয় 0, Row টা হারায় না
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Whose column is it: the inner scope is searched first                  */
/* ------------------------------------------------------------------------- */

export function ScopeDiagram() {
    return (
        <Sketch
            label='কোন নাম কার: আগে ভেতরের FROM, না পেলে বাইরের'
            height={330}
            minWidth={840}
            viewBox='0 0 840 330'
            caption='ভেতরের Query এ একটা Column এর নাম পেলে PostgreSQL প্রথমে ভেতরের FROM এর Table গুলোতে খোঁজে। সেখানে পেলে সেটাই, না পেলে এক ধাপ বাইরে যায়। তাই customer_id = customer_id দুটোই bookings এর Column হয়ে যায়, আর তুলনাটা নিজের সাথে নিজের। আর payments এ customer_id নামে কোনো Column নেই, তাই সেটা চুপচাপ বাইরের c.customer_id হয়ে যায়, কোনো Error ছাড়া। দুটো ভুলের ওষুধ একটাই: ভেতরে বাইরে সবখানে Alias দিয়ে লিখুন।'>
            <Arrow id='corr-scope-arrow' />
            {/* outer scope */}
            <rect x={20} y={20} width={800} height={290} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={40} y={42} size={10} bold anchor='start'>
                বাইরের Query: FROM customers c
            </SketchText>
            <SketchText x={40} y={60} size={9} anchor='start' opacity={0.75}>
                এখানে আছে: customer_id, full_name, email, phone, city, country, joined_at
            </SketchText>

            {/* inner scope */}
            <rect x={60} y={80} width={420} height={210} fill='var(--primary)' fillOpacity={0.05} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={80} y={102} size={10} bold accent anchor='start'>
                ভেতরের Query: FROM bookings b
            </SketchText>
            <SketchText x={80} y={120} size={9} anchor='start' opacity={0.75}>
                এখানে আছে: booking_id, customer_id, departure_id, ...
            </SketchText>

            <SketchText x={80} y={156} size={9.5} anchor='start'>
                b.customer_id
            </SketchText>
            <SketchText x={250} y={156} size={9.5} body anchor='start' accent>
                ভেতরে, bookings এর
            </SketchText>
            <SketchText x={80} y={184} size={9.5} anchor='start'>
                c.customer_id
            </SketchText>
            <SketchText x={250} y={184} size={9.5} body anchor='start'>
                বাইরের, customers এর
            </SketchText>
            <SketchText x={80} y={212} size={9.5} anchor='start'>
                customer_id
            </SketchText>
            <SketchText x={250} y={212} size={9.5} body anchor='start' accent>
                ভেতরে আগে পায়, bookings এর
            </SketchText>
            <SketchText x={80} y={248} size={9} anchor='start' opacity={0.85}>
                WHERE customer_id = customer_id
            </SketchText>
            <SketchText x={80} y={266} size={9} body anchor='start' opacity={0.85}>
                দুটোই bookings এর, তাই সবসময় সত্য
            </SketchText>

            {/* the payments trap */}
            <rect x={520} y={80} width={280} height={140} fill='transparent' stroke='currentColor' strokeOpacity={0.55} strokeDasharray='5 4' strokeWidth='1.2' />
            <SketchText x={660} y={102} size={10} bold>
                ভেতরে: FROM payments
            </SketchText>
            <SketchText x={660} y={120} size={9} opacity={0.75}>
                payment_id, booking_id, amount_bdt, ...
            </SketchText>
            <SketchText x={660} y={150} size={9.5}>
                SELECT customer_id FROM payments
            </SketchText>
            <SketchText x={660} y={174} size={9.5} body>
                payments এ এই নাম নেই
            </SketchText>
            <SketchText x={660} y={194} size={9.5} body accent>
                তাই এটা বাইরের c.customer_id
            </SketchText>
            <path d='M 660 222 V 250 H 560 V 66' fill='none' stroke='var(--primary)' strokeWidth='1.2' strokeDasharray='4 3' markerEnd='url(#corr-scope-arrow)' />
            <SketchText x={700} y={270} size={9} body opacity={0.8}>
                কোনো Error নেই, ফলাফল ভুল
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. For all, written as "none breaks the rule"                             */
/* ------------------------------------------------------------------------- */

/** seats_left of every real departure, per tour; tour 9 has none. */
const TOUR_SEATS: { id: number; title: string; seats: number[] }[] = [
    { id: 1, title: 'Saint Martin Escape', seats: [14, 19, 14, 19] },
    { id: 2, title: "Cox's Bazar Weekend", seats: [27, 22] },
    { id: 3, title: 'Sundarbans Cruise', seats: [13, 12] },
    { id: 4, title: 'Sajek Cloud Trip', seats: [16, 18] },
    { id: 5, title: 'Bandarban Trek', seats: [9, 10] },
    { id: 6, title: 'Sylhet Tea Garden', seats: [23, 21] },
    { id: 7, title: 'Ratargul Boat Day', seats: [12] },
    { id: 8, title: 'Saint Martin Luxury', seats: [10] },
    { id: 9, title: 'Family Package', seats: [] },
];

export function ForAllDiagram() {
    return (
        <Sketch
            label='"প্রতিটা Departure এ ১৫ বা তার কম সিট" = "১৫ এর বেশি সিটওয়ালা একটাও Departure নেই"'
            height={400}
            minWidth={840}
            viewBox='0 0 840 400'
            caption='প্রতিটা বৃত্ত একটা আসল Departure, ভেতরে তার seats_left। লাল দাগের বৃত্ত নিয়ম ভাঙে, মানে ১৫ এর বেশি সিট খালি। যে ট্যুরের একটাও নিয়ম ভাঙা Departure নেই, সে টেকে: ৩, ৫, ৭, ৮ আর ৯। Family Package এর কোনো Departure ই নেই, তাই নিয়ম ভাঙারও কেউ নেই, আর সেও টেকে। একে বলে Vacuous Truth: খালি দলের ব্যাপারে "সবাই" কথাটা সবসময় সত্য।'>
            <SketchText x={30} y={24} size={10} bold anchor='start'>
                ট্যুর
            </SketchText>
            <SketchText x={250} y={24} size={10} bold anchor='start'>
                Departure গুলোর seats_left
            </SketchText>
            <SketchText x={720} y={24} size={10} bold>
                টেকে?
            </SketchText>
            {TOUR_SEATS.map((t, i) => {
                const y = 50 + i * 38;
                const breaks = t.seats.some(s => s > 15);
                return (
                    <g key={t.id}>
                        <SketchText x={30} y={y + 4} size={9.5} anchor='start' opacity={breaks ? 0.55 : 1}>
                            {`${t.id}. ${t.title}`}
                        </SketchText>
                        {t.seats.length === 0 ? (
                            <SketchText x={250} y={y + 4} size={9.5} body anchor='start' accent>
                                কোনো Departure নেই
                            </SketchText>
                        ) : (
                            t.seats.map((s, j) => {
                                const bad = s > 15;
                                return (
                                    <g key={j}>
                                        <circle
                                            cx={265 + j * 44}
                                            cy={y}
                                            r={14}
                                            fill='transparent'
                                            stroke={bad ? 'var(--destructive)' : 'var(--primary)'}
                                            strokeWidth={bad ? 1.6 : 1.2}
                                            strokeDasharray={bad ? '3 2' : undefined}
                                        />
                                        <SketchText x={265 + j * 44} y={y + 4} size={9.5}>
                                            {String(s)}
                                        </SketchText>
                                    </g>
                                );
                            })
                        )}
                        <SketchText x={720} y={y + 4} size={10} bold accent={!breaks} opacity={breaks ? 0.55 : 1}>
                            {breaks ? 'না' : 'হ্যাঁ'}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={420} y={392} size={9.5} body opacity={0.75}>
                NOT EXISTS (SELECT 1 FROM departures d WHERE d.tour_id = t.tour_id AND d.seats_left &gt; 15)
            </SketchText>
        </Sketch>
    );
}
