import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Real rows used by every picture in this lesson                            */
/* ------------------------------------------------------------------------- */

/** Six real customers and how many bookings each has in the sample data. */
const SAMPLE_CUSTOMERS: { name: string; bookings: number }[] = [
    { name: 'Rahim Uddin', bookings: 3 },
    { name: 'Nusrat Jahan', bookings: 2 },
    { name: 'Sabbir Hossain', bookings: 1 },
    { name: 'Kamal Hasan', bookings: 1 },
    { name: 'Lamia Haque', bookings: 1 },
    { name: 'Imran Kabir', bookings: 0 },
];

/**
 * The two questions of the lesson side by side on the same six customers:
 * "has at least one booking" keeps five of them once each, "has none" keeps
 * only Imran.
 */
export function SemiAntiSplit() {
    return (
        <SketchSplit
            label='Semi Join আর Anti Join: একই Customer, দুটো প্রশ্ন'
            caption='বাঁয়ে প্রশ্ন "অন্তত একটা Booking আছে কি?" যাঁর আছে তিনি একবারই আসেন, Rahim এর তিনটা Booking থাকলেও। ডানে প্রশ্ন "একটাও Booking নেই কি?" শুধু Imran Kabir টিকে থাকেন। দুই প্রশ্নেই উত্তরে থাকে শুধু customers Table এর Column, bookings Table থেকে কিছুই আসে না।'
            panels={[
                {
                    title: 'Semi Join',
                    sub: 'অন্তত একটা আছে',
                    viewBox: '0 0 340 260',
                    height: 260,
                    minWidth: 320,
                    children: <SemiPanel />,
                },
                {
                    title: 'Anti Join',
                    sub: 'একটাও নেই',
                    viewBox: '0 0 340 260',
                    height: 260,
                    minWidth: 320,
                    children: <AntiPanel />,
                },
            ]}
        />
    );
}

function SemiPanel() {
    return (
        <g>
            <SketchText x={12} y={16} size={9} anchor='start' bold opacity={0.7}>
                customers
            </SketchText>
            <SketchText x={182} y={16} size={9} anchor='start' bold opacity={0.7}>
                bookings এ
            </SketchText>
            <SketchText x={290} y={16} size={9} bold opacity={0.7}>
                ফলাফল
            </SketchText>
            <CustomerColumnLabels keep={n => n > 0} />
        </g>
    );
}

function AntiPanel() {
    return (
        <g>
            <SketchText x={12} y={16} size={9} anchor='start' bold opacity={0.7}>
                customers
            </SketchText>
            <SketchText x={182} y={16} size={9} anchor='start' bold opacity={0.7}>
                bookings এ
            </SketchText>
            <SketchText x={290} y={16} size={9} bold opacity={0.7}>
                ফলাফল
            </SketchText>
            <CustomerColumnLabels keep={n => n === 0} />
        </g>
    );
}

/** Same rows as CustomerColumn, with a plain kept or dropped verdict. */
function CustomerColumnLabels({ keep }: { keep: (bookings: number) => boolean }) {
    return (
        <>
            {SAMPLE_CUSTOMERS.map((c, i) => {
                const y = 30 + i * 38;
                const kept = keep(c.bookings);
                return (
                    <g key={c.name}>
                        <rect
                            x={12}
                            y={y}
                            width={150}
                            height={28}
                            fill={kept ? 'var(--primary)' : 'transparent'}
                            fillOpacity={kept ? 0.12 : 0}
                            stroke={kept ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={kept ? 1 : 0.35}
                            strokeWidth='1.2'
                        />
                        <SketchText x={22} y={y + 18} size={10.5} anchor='start' bold={kept} accent={kept}>
                            {c.name}
                        </SketchText>
                        <SketchText x={182} y={y + 18} size={10} anchor='start' opacity={0.75}>
                            {`${c.bookings} টা`}
                        </SketchText>
                        <SketchText x={290} y={y + 18} size={10.5} bold body accent={kept} opacity={kept ? 1 : 0.45}>
                            {kept ? 'রাখা হলো' : 'বাদ'}
                        </SketchText>
                    </g>
                );
            })}
        </>
    );
}

/* ------------------------------------------------------------------------- */
/* JOIN repeats the customer, EXISTS does not                                */
/* ------------------------------------------------------------------------- */

/**
 * Rahim Uddin has three bookings. A JOIN pairs him with each of them and
 * produces three rows; EXISTS stops at the first booking and keeps him once.
 */
export function JoinVsExistsDiagram() {
    const bookings = [1, 8, 17];
    return (
        <Sketch
            label='JOIN তিনবার, EXISTS একবার'
            height={280}
            minWidth={760}
            viewBox='0 0 760 280'
            caption='Rahim Uddin এর আসল তিনটা Booking: 1, 8 আর 17। JOIN প্রতিটা মিলের জন্য একটা করে Row বানায়, তাই Rahim তিনবার আসেন। EXISTS প্রথম Booking টা পেয়েই উত্তর জেনে যায় যে আছে, বাকি দুটো আর দেখে না, তাই Rahim আসেন একবার।'>
            <defs>
                <marker
                    id='semi-join-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
                <marker
                    id='semi-join-arrow-muted'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='currentColor' fillOpacity={0.5} />
                </marker>
            </defs>

            {/* the customer */}
            <rect x={20} y={110} width={150} height={44} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={95} y={128} size={10} bold accent>
                customer 1
            </SketchText>
            <SketchText x={95} y={144} size={10.5}>
                Rahim Uddin
            </SketchText>

            {/* the three bookings */}
            {bookings.map((id, i) => {
                const y = 40 + i * 80;
                return (
                    <g key={id}>
                        <rect x={250} y={y} width={130} height={40} fill='transparent' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
                        <SketchText x={315} y={y + 25} size={10.5}>
                            {`booking ${id}`}
                        </SketchText>
                        <line
                            x1={172}
                            y1={132}
                            x2={246}
                            y2={y + 20}
                            stroke={i === 0 ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={i === 0 ? 1 : 0.45}
                            strokeWidth='1.2'
                            markerEnd={i === 0 ? 'url(#semi-join-arrow)' : 'url(#semi-join-arrow-muted)'}
                        />
                    </g>
                );
            })}

            {/* JOIN output */}
            <SketchText x={540} y={30} size={10} bold>
                JOIN এর ফলাফল
            </SketchText>
            {bookings.map((id, i) => (
                <g key={`j${id}`}>
                    <rect x={460} y={42 + i * 32} width={160} height={26} fill='transparent' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.1' />
                    <SketchText x={540} y={59 + i * 32} size={10}>
                        {`Rahim Uddin | ${id}`}
                    </SketchText>
                </g>
            ))}
            <SketchText x={540} y={158} size={10} body opacity={0.8}>
                তিনটা Row
            </SketchText>

            {/* EXISTS output */}
            <SketchText x={540} y={196} size={10} bold accent>
                EXISTS এর ফলাফল
            </SketchText>
            <rect x={460} y={208} width={160} height={26} fill='var(--primary)' fillOpacity={0.12} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={540} y={225} size={10} accent>
                Rahim Uddin
            </SketchText>
            <SketchText x={540} y={256} size={10} body accent>
                একটা Row, প্রথম মিলেই থামে
            </SketchText>
            <SketchText x={680} y={225} size={9} anchor='start' opacity={0.6}>
                8, 17 দেখাই হয়নি
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* How a correlated EXISTS runs                                               */
/* ------------------------------------------------------------------------- */

/**
 * The loop behind a correlated EXISTS: take one outer row, plug its key into
 * the inner query, ask "did any row come back", keep or drop, next row.
 */
export function CorrelatedLoopDiagram() {
    return (
        <Sketch
            label='Correlated Subquery: প্রতিটা Customer এর জন্য একটা ছোট প্রশ্ন'
            height={300}
            minWidth={820}
            viewBox='0 0 820 300'
            caption='বাইরের Query একটা একটা Customer নেয়। প্রতিবার ভেতরের Query তে c.customer_id এর জায়গায় সেই Customer এর নম্বর বসে, যেমন Imran এর বেলায় 15। ভেতরের Query অন্তত একটা Row পেলে EXISTS সত্য, একটাও না পেলে মিথ্যা। এটা বোঝার মডেল: PostgreSQL আসলে প্রায়ই একবারে সব মিলিয়ে নেয়, ফলাফল একই।'>
            <defs>
                <marker
                    id='semi-loop-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* step 1: outer row */}
            <rect x={20} y={40} width={170} height={64} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={105} y={62} size={10} bold accent>
                ১. বাইরের একটা Row
            </SketchText>
            <SketchText x={105} y={82} size={10}>
                c.customer_id = 15
            </SketchText>
            <SketchText x={105} y={97} size={9.5} opacity={0.75}>
                Imran Kabir
            </SketchText>

            {/* step 2: inner query */}
            <rect x={250} y={30} width={280} height={84} fill='transparent' stroke='currentColor' strokeOpacity={0.55} strokeWidth='1.2' />
            <SketchText x={390} y={52} size={10} bold>
                ২. ভেতরের Query, নম্বর বসিয়ে
            </SketchText>
            <SketchText x={390} y={74} size={10}>
                SELECT 1 FROM bookings b
            </SketchText>
            <SketchText x={390} y={92} size={10}>
                WHERE b.customer_id = 15
            </SketchText>

            {/* step 3: did a row come back */}
            <rect x={590} y={40} width={200} height={64} fill='transparent' stroke='currentColor' strokeOpacity={0.55} strokeWidth='1.2' />
            <SketchText x={690} y={62} size={10} bold>
                ৩. কোনো Row এল?
            </SketchText>
            <SketchText x={690} y={84} size={10}>
                0 Row, তাই না
            </SketchText>

            <line x1={192} y1={72} x2={246} y2={72} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#semi-loop-arrow)' />
            <line x1={532} y1={72} x2={586} y2={72} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#semi-loop-arrow)' />

            {/* step 4: verdicts */}
            <rect x={470} y={170} width={150} height={60} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={545} y={192} size={10} bold>
                EXISTS
            </SketchText>
            <SketchText x={545} y={212} size={10} body>
                মিথ্যা, বাদ
            </SketchText>

            <rect x={640} y={170} width={150} height={60} fill='var(--primary)' fillOpacity={0.12} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={715} y={192} size={10} bold accent>
                NOT EXISTS
            </SketchText>
            <SketchText x={715} y={212} size={10} body accent>
                সত্য, রাখা হলো
            </SketchText>

            <path d='M 690 106 V 140 H 545 V 166' fill='none' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#semi-loop-arrow)' />
            <line x1={715} y1={140} x2={715} y2={166} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#semi-loop-arrow)' />

            {/* step 5: next row */}
            <path d='M 470 200 H 105 V 108' fill='none' stroke='var(--primary)' strokeDasharray='5 4' strokeWidth='1.2' markerEnd='url(#semi-loop-arrow)' />
            <SketchText x={280} y={222} size={10} body opacity={0.85}>
                ৪. পরের Customer, আবার একই প্রশ্ন
            </SketchText>
            <SketchText x={280} y={268} size={9.5} body opacity={0.7}>
                Rahim (1) এর বেলায় ভেতরের Query তিনটা Row পায়, প্রথমটাতেই উত্তর সত্য
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* Why NOT IN with a NULL returns nothing                                     */
/* ------------------------------------------------------------------------- */

const CHAIN: { text: string; verdict: 'TRUE' | 'UNKNOWN' }[] = [
    { text: '5 <> 1', verdict: 'TRUE' },
    { text: '5 <> 2', verdict: 'TRUE' },
    { text: '5 <> 3', verdict: 'TRUE' },
    { text: '5 <> 4', verdict: 'TRUE' },
    { text: '5 <> NULL', verdict: 'UNKNOWN' },
];

/**
 * Nazmul Karim (guide 5) has no tour, yet NOT IN drops him: the list holds the
 * Ratargul tour's NULL, and one UNKNOWN in an AND chain makes the whole chain
 * UNKNOWN, which WHERE treats as "not true".
 */
export function NotInChainDiagram() {
    return (
        <Sketch
            label='NOT IN এর ভেতরে লুকানো AND'
            height={230}
            minWidth={820}
            viewBox='0 0 820 230'
            caption='5 NOT IN (1, 2, 3, 4, NULL) আসলে পাঁচটা তুলনার AND। প্রথম চারটা সত্য, শেষটা অজানা, কারণ NULL এর সাথে কোনো তুলনা সত্য বা মিথ্যা হয় না। AND এ একটা অজানা থাকলে আর কোনোটা মিথ্যা না হলে পুরোটাই অজানা, আর WHERE শুধু সত্যকে রাখে। তাই Nazmul Karim, যাঁর সত্যিই কোনো ট্যুর নেই, তিনিও বাদ পড়েন।'>
            {CHAIN.map((c, i) => {
                const x = 20 + i * 140;
                const unknown = c.verdict === 'UNKNOWN';
                return (
                    <g key={c.text}>
                        <rect
                            x={x}
                            y={40}
                            width={110}
                            height={56}
                            fill={unknown ? 'var(--primary)' : 'transparent'}
                            fillOpacity={unknown ? 0.12 : 0}
                            stroke={unknown ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={unknown ? 1 : 0.5}
                            strokeWidth='1.2'
                        />
                        <SketchText x={x + 55} y={62} size={10.5} bold={unknown} accent={unknown}>
                            {c.text}
                        </SketchText>
                        <SketchText x={x + 55} y={84} size={10} bold accent={unknown} opacity={unknown ? 1 : 0.75}>
                            {c.verdict}
                        </SketchText>
                        {i < CHAIN.length - 1 && (
                            <SketchText x={x + 125} y={72} size={10} bold opacity={0.7}>
                                AND
                            </SketchText>
                        )}
                    </g>
                );
            })}
            <rect x={250} y={140} width={320} height={56} fill='transparent' stroke='var(--primary)' strokeWidth='1.3' strokeDasharray='5 4' />
            <SketchText x={410} y={162} size={11} bold accent>
                পুরো শর্ত: UNKNOWN
            </SketchText>
            <SketchText x={410} y={183} size={10} body>
                WHERE রাখে শুধু TRUE, তাই Nazmul বাদ
            </SketchText>
        </Sketch>
    );
}

