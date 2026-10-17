import { Sketch, SketchSplit, SketchText } from '../../sketch';

function Arrow({ id, color = 'var(--primary)' }: { id: string; color?: string }) {
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
                <path d='M0,0 L7,3.5 L0,7 Z' fill={color} />
            </marker>
        </defs>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. সময়ের পাঁচ রকম মান                                                      */
/* ------------------------------------------------------------------------- */

const VALUES = [
    { name: 'date', example: '2026-11-20', lines: ['শুধু তারিখ', 'ঘড়ির সময় নেই', 'starts_on'] },
    { name: 'time', example: '09:30:00', lines: ['শুধু ঘড়ির সময়', 'কোনো তারিখ নেই', 'রোজকার সময়সূচি'] },
    { name: 'timestamp', example: '2026-11-20 09:30', lines: ['তারিখ আর সময়', 'কোন দেশের, বলা নেই', 'দেয়ালের ঘড়ি'] },
    { name: 'timestamptz', example: '2026-11-20 09:30+06', lines: ['পৃথিবীর একটা মুহূর্ত', 'সব দেশে একই মুহূর্ত', 'booked_at'], accent: true },
    { name: 'interval', example: '3 days 04:00:00', lines: ['একটা সময়ের দৈর্ঘ্য', 'কোনো তারিখ না', 'কত দিন পর'] },
];

/** The five kinds of time values a query works with, with an example each. */
export function TimeValuesDiagram() {
    const w = 160;
    const gap = 16;
    return (
        <Sketch
            label='Five Kinds of Time Values'
            height={250}
            minWidth={900}
            viewBox='0 0 900 250'
            caption='প্রথম চারটা বলে কখন, শেষেরটা বলে কতক্ষণ। timestamptz আলাদা রঙে, কারণ শুধু এটাই পৃথিবীর একটা নির্দিষ্ট মুহূর্ত বোঝায়, আর Island Tours এর booked_at, paid_at, joined_at সবগুলো এই ধরনের।'>
            {VALUES.map((v, i) => {
                const x = 20 + i * (w + gap);
                return (
                    <g key={v.name}>
                        <rect
                            x={x}
                            y={30}
                            width={w}
                            height={86}
                            fill={v.accent ? 'var(--primary)' : 'transparent'}
                            fillOpacity={v.accent ? 0.1 : 0}
                            stroke={v.accent ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={v.accent ? 1 : 0.45}
                            strokeWidth='1.3'
                        />
                        <SketchText x={x + w / 2} y={60} size={14} bold accent={v.accent}>
                            {v.name}
                        </SketchText>
                        <SketchText x={x + w / 2} y={92} size={10} opacity={0.85}>
                            {v.example}
                        </SketchText>
                        {v.lines.map((line, n) => (
                            <SketchText
                                key={line}
                                x={x + w / 2}
                                y={146 + n * 22}
                                size={n === 2 ? 10 : 11}
                                body={n < 2}
                                accent={v.accent && n === 0}
                                opacity={n === 2 ? 0.6 : 0.9}>
                                {line}
                            </SketchText>
                        ))}
                    </g>
                );
            })}
            <line x1={20} y1={226} x2={20 + 4 * (w + gap) - gap} y2={226} stroke='currentColor' strokeOpacity={0.25} />
            <SketchText x={20 + 2 * (w + gap) - gap / 2} y={242} size={10} body opacity={0.7}>
                কখন
            </SketchText>
            <line x1={20 + 4 * (w + gap)} y1={226} x2={20 + 5 * (w + gap) - gap} y2={226} stroke='var(--primary)' strokeOpacity={0.6} />
            <SketchText x={20 + 4 * (w + gap) + w / 2} y={242} size={10} body accent>
                কতক্ষণ
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. তারিখ বিয়োগ বনাম মুহূর্ত বিয়োগ                                            */
/* ------------------------------------------------------------------------- */

/** Subtracting two dates gives a plain number of days; two timestamps give an interval. */
export function DateMathSplit() {
    return (
        <SketchSplit
            label='What a Subtraction Returns'
            caption='বাম দিকে দুটো তারিখ, উত্তর একটা সাধারণ সংখ্যা: কত দিন। ডান দিকে দুটো মুহূর্ত, উত্তর একটা interval: দিন, ঘণ্টা আর মিনিট মিলিয়ে একটা দৈর্ঘ্য। কোনটা ফেরত আসবে সেটা ঠিক করে দুই পাশের ধরন।'
            panels={[
                {
                    title: 'date minus date',
                    sub: 'integer, দিনের সংখ্যা',
                    viewBox: '0 0 360 190',
                    height: 190,
                    children: (
                        <g>
                            <Arrow id='time-math-left-arrow' />
                            <rect x={20} y={20} width={140} height={44} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
                            <SketchText x={90} y={47} size={12}>2026-11-20</SketchText>
                            <SketchText x={180} y={47} size={16} bold>−</SketchText>
                            <rect x={200} y={20} width={140} height={44} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
                            <SketchText x={270} y={47} size={12}>2026-11-01</SketchText>
                            <line x1={180} y1={74} x2={180} y2={112} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#time-math-left-arrow)' />
                            <rect x={110} y={120} width={140} height={44} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' />
                            <SketchText x={180} y={148} size={18} bold accent>19</SketchText>
                            <SketchText x={180} y={182} size={10} body opacity={0.75}>শুধু একটা সংখ্যা, একক দিন</SketchText>
                        </g>
                    ),
                },
                {
                    title: 'timestamptz minus timestamptz',
                    sub: 'interval, একটা দৈর্ঘ্য',
                    viewBox: '0 0 360 190',
                    height: 190,
                    children: (
                        <g>
                            <Arrow id='time-math-right-arrow' />
                            <rect x={10} y={20} width={158} height={44} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
                            <SketchText x={89} y={47} size={10.5}>2026-11-20 09:00+06</SketchText>
                            <SketchText x={180} y={47} size={16} bold>−</SketchText>
                            <rect x={192} y={20} width={158} height={44} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
                            <SketchText x={271} y={47} size={10.5}>2026-11-01 18:30+06</SketchText>
                            <line x1={180} y1={74} x2={180} y2={112} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#time-math-right-arrow)' />
                            <rect x={90} y={120} width={180} height={44} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' />
                            <SketchText x={180} y={148} size={13} bold accent>18 days 14:30:00</SketchText>
                            <SketchText x={180} y={182} size={10} body opacity={0.75}>দিন, ঘণ্টা, মিনিট একসাথে</SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. date_trunc: সময়কে নিচের দিকে কেটে ফেলা                                    */
/* ------------------------------------------------------------------------- */

const SNAPS = [
    { unit: 'month', value: '2026-09-01 00:00', x: 60 },
    { unit: 'week', value: '2026-09-14 00:00', x: 300 },
    { unit: 'day', value: '2026-09-15 00:00', x: 520 },
    { unit: 'hour', value: '2026-09-15 21:00', x: 760 },
];

/** One booking time snapped down to the start of its month, week, day and hour. */
export function TruncateDiagram() {
    return (
        <Sketch
            label='date_trunc Snaps Down'
            height={250}
            minWidth={900}
            viewBox='0 0 900 250'
            caption='Booking 13 হয়েছিল 15 সেপ্টেম্বর রাত ৯টা ১০ এ। date_trunc প্রতিবার সময়টাকে পেছনের দিকে টেনে নেয় বেছে নেওয়া এককের একদম শুরুতে: মাসের প্রথম দিন, সপ্তাহের সোমবার, দিনের মাঝরাত, ঘণ্টার শূন্য মিনিট। সামনের দিকে কখনো যায় না।'>
            <Arrow id='time-trunc-arrow' />
            <line x1={30} y1={150} x2={870} y2={150} stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.2' />
            <circle cx={830} cy={150} r={7} fill='var(--primary)' />
            <SketchText x={830} y={186} size={11} bold accent>
                2026-09-15 21:10
            </SketchText>
            <SketchText x={830} y={204} size={10} body opacity={0.75}>
                Booking 13
            </SketchText>
            {SNAPS.map((s, i) => (
                <g key={s.unit}>
                    <line x1={s.x} y1={140} x2={s.x} y2={160} stroke='currentColor' strokeOpacity={0.7} strokeWidth='1.3' />
                    <path
                        d={`M 822 ${132 - i * 4} Q ${(s.x + 822) / 2} ${70 - i * 14} ${s.x + 6} ${136}`}
                        fill='none'
                        stroke='var(--primary)'
                        strokeOpacity={0.55}
                        strokeWidth='1.1'
                        markerEnd='url(#time-trunc-arrow)'
                    />
                    <SketchText x={s.x} y={186} size={10.5} bold>
                        {s.unit}
                    </SketchText>
                    <SketchText x={s.x} y={204} size={9.5} opacity={0.8}>
                        {s.value}
                    </SketchText>
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. একটা মুহূর্ত, অনেক ঘড়ি                                                    */
/* ------------------------------------------------------------------------- */

const CLOCKS = [
    { zone: 'Asia/Dhaka', wall: '10:15', date: '2025-12-20', x: 120, accent: true },
    { zone: 'UTC', wall: '04:15', date: '2025-12-20', x: 350 },
    { zone: 'Europe/London', wall: '04:15', date: '2025-12-20', x: 560 },
    { zone: 'Asia/Kuala_Lumpur', wall: '12:15', date: '2025-12-20', x: 780 },
];

/** A timestamptz is one instant; each session time zone only changes how it is printed. */
export function InstantDisplayDiagram() {
    return (
        <Sketch
            label='One Instant, Many Clocks'
            height={290}
            minWidth={900}
            viewBox='0 0 900 290'
            caption='Database এর ভেতরে Booking 1 এর জন্য রাখা আছে একটাই মুহূর্ত। Session এর TimeZone যা বলে, PostgreSQL সেই দেশের ঘড়িতে মুহূর্তটা পড়ে শোনায়। ঘড়ি বদলালে লেখা বদলায়, রাখা মানটা একচুলও বদলায় না।'>
            <Arrow id='time-instant-arrow' />
            <rect x={300} y={20} width={300} height={66} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.4' />
            <SketchText x={450} y={46} size={12} bold accent>
                একটা মুহূর্ত, ভেতরে UTC তে রাখা
            </SketchText>
            <SketchText x={450} y={70} size={11}>
                2025-12-20 04:15:00 UTC
            </SketchText>
            {CLOCKS.map(c => (
                <g key={c.zone}>
                    <line
                        x1={450}
                        y1={90}
                        x2={c.x}
                        y2={150}
                        stroke='var(--primary)'
                        strokeOpacity={0.55}
                        strokeWidth='1.1'
                        markerEnd='url(#time-instant-arrow)'
                    />
                    <circle cx={c.x} cy={196} r={34} fill='transparent' stroke={c.accent ? 'var(--primary)' : 'currentColor'} strokeOpacity={c.accent ? 1 : 0.5} strokeWidth='1.3' />
                    <SketchText x={c.x} y={202} size={15} bold accent={c.accent}>
                        {c.wall}
                    </SketchText>
                    <SketchText x={c.x} y={250} size={10.5} bold accent={c.accent}>
                        {c.zone}
                    </SketchText>
                    <SketchText x={c.x} y={268} size={9.5} opacity={0.7}>
                        {c.date}
                    </SketchText>
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. AT TIME ZONE এর দুই দিক                                                 */
/* ------------------------------------------------------------------------- */

/** AT TIME ZONE turns an instant into a wall clock, and a wall clock into an instant. */
export function AtTimeZoneSplit() {
    return (
        <SketchSplit
            label='AT TIME ZONE Works Both Ways'
            caption='বাম দিকে আপনার হাতে একটা মুহূর্ত, প্রশ্নটা: London এর দেয়ালের ঘড়িতে তখন কয়টা বাজে? উত্তর একটা timestamp, যাতে কোনো দেশের চিহ্ন নেই। ডান দিকে হাতে একটা দেয়ালের ঘড়ির সময়, প্রশ্নটা: এটা যদি Dhaka র ঘড়ি হয়, তাহলে পৃথিবীর কোন মুহূর্ত? উত্তর একটা timestamptz।'
            panels={[
                {
                    title: 'timestamptz AT TIME ZONE zone',
                    sub: 'মুহূর্ত থেকে দেয়ালের ঘড়ি',
                    viewBox: '0 0 360 200',
                    height: 200,
                    children: (
                        <g>
                            <Arrow id='time-atz-left-arrow' />
                            <rect x={50} y={16} width={260} height={46} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' />
                            <SketchText x={180} y={36} size={9.5} body accent>timestamptz, একটা মুহূর্ত</SketchText>
                            <SketchText x={180} y={54} size={11}>2025-12-20 10:15:00+06</SketchText>
                            <line x1={180} y1={68} x2={180} y2={112} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#time-atz-left-arrow)' />
                            <SketchText x={190} y={94} size={10} anchor='start' opacity={0.85}>AT TIME ZONE &apos;Europe/London&apos;</SketchText>
                            <rect x={50} y={120} width={260} height={46} fill='transparent' stroke='currentColor' strokeOpacity={0.5} />
                            <SketchText x={180} y={140} size={9.5} body opacity={0.75}>timestamp, শুধু ঘড়ির লেখা</SketchText>
                            <SketchText x={180} y={158} size={11}>2025-12-20 04:15:00</SketchText>
                            <SketchText x={180} y={190} size={9.5} body opacity={0.7}>শেষে কোনো +00 বা +06 নেই</SketchText>
                        </g>
                    ),
                },
                {
                    title: 'timestamp AT TIME ZONE zone',
                    sub: 'দেয়ালের ঘড়ি থেকে মুহূর্ত',
                    viewBox: '0 0 360 200',
                    height: 200,
                    children: (
                        <g>
                            <Arrow id='time-atz-right-arrow' />
                            <rect x={50} y={16} width={260} height={46} fill='transparent' stroke='currentColor' strokeOpacity={0.5} />
                            <SketchText x={180} y={36} size={9.5} body opacity={0.75}>timestamp, শুধু ঘড়ির লেখা</SketchText>
                            <SketchText x={180} y={54} size={11}>2026-11-20 09:00:00</SketchText>
                            <line x1={180} y1={68} x2={180} y2={112} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#time-atz-right-arrow)' />
                            <SketchText x={190} y={94} size={10} anchor='start' opacity={0.85}>AT TIME ZONE &apos;Asia/Dhaka&apos;</SketchText>
                            <rect x={50} y={120} width={260} height={46} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' />
                            <SketchText x={180} y={140} size={9.5} body accent>timestamptz, একটা মুহূর্ত</SketchText>
                            <SketchText x={180} y={158} size={11}>2026-11-20 09:00:00+06</SketchText>
                            <SketchText x={180} y={190} size={9.5} body opacity={0.7}>Dhaka র ৯টা বলে ধরে নেওয়া হলো</SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 6. মাঝরাতের সীমানা                                                          */
/* ------------------------------------------------------------------------- */

const MARKS = [
    { id: '101', dhaka: '1 Nov 23:50', hours: 1 + 50 / 60, anchor: 'middle' as const, inZone: false },
    { id: '102', dhaka: '2 Nov 01:15', hours: 3.25, anchor: 'middle' as const, inZone: true },
    { id: '103', dhaka: '2 Nov 05:59', hours: 7 + 59 / 60, anchor: 'end' as const, inZone: true },
    { id: '104', dhaka: '2 Nov 06:00', hours: 8, anchor: 'start' as const, inZone: false },
];

/** Hours since 1 Nov 22:00 Dhaka time, mapped onto the drawing. */
const toX = (h: number) => 110 + h * 75;

/**
 * Dhaka's midnight comes six hours before UTC's. A booking made between
 * 00:00 and 05:59 in Dhaka has a different date in UTC.
 */
export function MidnightBoundaryDiagram() {
    return (
        <Sketch
            label='Two Midnights, Six Hours Apart'
            height={250}
            minWidth={900}
            viewBox='0 0 900 250'
            caption='উপরের দাগে Dhaka র ঘড়ি, নিচের দাগে UTC। Dhaka র মাঝরাত আসে UTC এর মাঝরাতের ছয় ঘণ্টা আগে। মাঝের হালকা রঙের জায়গায় যে Booking পড়ে, Dhaka বলে সেটা 2 নভেম্বরের, UTC বলে 1 নভেম্বরের। 102 আর 103 ঠিক সেখানে, 104 এক মিনিট পরে বলে বাইরে।'>
            <rect x={toX(2)} y={46} width={toX(8) - toX(2)} height={140} fill='var(--primary)' fillOpacity={0.08} />
            <SketchText x={(toX(2) + toX(8)) / 2} y={36} size={10} body accent>
                দুই ঘড়ি দুই তারিখ বলে
            </SketchText>
            {[0, 1].map(row => {
                const y = row === 0 ? 86 : 156;
                return (
                    <g key={row}>
                        <SketchText x={60} y={y + 4} size={10.5} bold accent={row === 0}>
                            {row === 0 ? 'Dhaka' : 'UTC'}
                        </SketchText>
                        <line x1={110} y1={y} x2={870} y2={y} stroke='currentColor' strokeOpacity={0.4} />
                    </g>
                );
            })}
            <line x1={toX(2)} y1={70} x2={toX(2)} y2={102} stroke='var(--primary)' strokeWidth='1.6' />
            <SketchText x={toX(2)} y={64} size={9.5} bold accent anchor='start'>
                {' '}Dhaka 2 Nov 00:00
            </SketchText>
            <line x1={toX(8)} y1={140} x2={toX(8)} y2={172} stroke='currentColor' strokeOpacity={0.8} strokeWidth='1.6' />
            <SketchText x={toX(8) + 6} y={186} size={9.5} bold anchor='start'>
                UTC 2 Nov 00:00
            </SketchText>
            {MARKS.map(m => {
                const x = toX(m.hours);
                const labelX = m.anchor === 'end' ? x - 8 : m.anchor === 'start' ? x + 8 : x;
                return (
                    <g key={m.id}>
                        <circle cx={x} cy={86} r={5} fill={m.inZone ? 'var(--primary)' : 'currentColor'} fillOpacity={m.inZone ? 1 : 0.6} />
                        <circle cx={x} cy={156} r={5} fill={m.inZone ? 'var(--primary)' : 'currentColor'} fillOpacity={m.inZone ? 1 : 0.6} />
                        <line x1={x} y1={92} x2={x} y2={150} stroke='currentColor' strokeOpacity={0.2} strokeDasharray='3 3' />
                        <SketchText x={labelX} y={216} size={9.5} anchor={m.anchor} accent={m.inZone} opacity={m.inZone ? 1 : 0.75}>
                            {`${m.id}: ${m.dhaka}`}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}
