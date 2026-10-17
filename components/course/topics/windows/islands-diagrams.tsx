import { Sketch, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Real values used by the pictures in this lesson                           */
/* ------------------------------------------------------------------------- */

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

/** January 2026, bookings that were not cancelled, biggest first. */
const JANUARY: { id: number; total: string }[] = [
    { id: 6, total: '36000.00' },
    { id: 4, total: '25500.00' },
    { id: 7, total: '18000.00' },
    { id: 3, total: '12500.00' },
];

/* ------------------------------------------------------------------------- */
/* 1. Top N per group: number inside the group, then keep the first N        */
/* ------------------------------------------------------------------------- */

export function TopNPipelineDiagram() {
    const rowY = (i: number) => 92 + i * 34;
    return (
        <Sketch
            label='Top N per Group: আগে দলের ভেতরে নম্বর, তারপর প্রথম N টা রাখা'
            height={300}
            minWidth={760}
            viewBox='0 0 820 300'
            caption='January 2026 এর বাতিল নয় এমন চারটা Booking। প্রথম ধাপে Window Function মাসের ভেতরে টাকার অঙ্কে বড় থেকে ছোট নম্বর দেয়: 1, 2, 3, 4। দ্বিতীয় ধাপে বাইরের Query শুধু rn ৩ বা তার কম Row গুলো রাখে, তাই Booking 3 (12500.00) বাদ পড়ে। নম্বর দেওয়া আর ছাঁকা দুটো আলাদা ধাপ, কারণ WHERE চলার সময় নম্বর তখনো তৈরি হয়নি।'>
            <Arrow id='islands-pipe-arrow' />
            <SketchText x={130} y={36} size={11} bold>
                bookings, 2026-01
            </SketchText>
            <SketchText x={130} y={56} size={9.5} body opacity={0.75}>
                বাতিল বাদে, যেভাবে আছে
            </SketchText>
            {[...JANUARY]
                .sort((a, b) => a.id - b.id)
                .map((row, i) => (
                    <g key={`raw-${row.id}`}>
                        <rect x={40} y={rowY(i) - 18} width={180} height={28} fill='transparent' stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.1' />
                        <SketchText x={80} y={rowY(i)} size={10}>
                            {`#${row.id}`}
                        </SketchText>
                        <SketchText x={165} y={rowY(i)} size={10}>
                            {row.total}
                        </SketchText>
                    </g>
                ))}

            <line x1={232} y1={150} x2={292} y2={150} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#islands-pipe-arrow)' />
            <SketchText x={262} y={136} size={9} accent>
                OVER
            </SketchText>

            <SketchText x={410} y={36} size={11} bold>
                row_number() OVER (...)
            </SketchText>
            <SketchText x={410} y={56} size={9.5} body opacity={0.75}>
                মাসের ভেতরে বড় থেকে ছোট
            </SketchText>
            {JANUARY.map((row, i) => (
                <g key={`num-${row.id}`}>
                    <rect x={300} y={rowY(i) - 18} width={220} height={28} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1.1' />
                    <SketchText x={330} y={rowY(i)} size={10} bold accent>
                        {`rn ${i + 1}`}
                    </SketchText>
                    <SketchText x={395} y={rowY(i)} size={10}>
                        {`#${row.id}`}
                    </SketchText>
                    <SketchText x={470} y={rowY(i)} size={10}>
                        {row.total}
                    </SketchText>
                </g>
            ))}

            <line x1={532} y1={150} x2={592} y2={150} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#islands-pipe-arrow)' />
            <SketchText x={562} y={136} size={9} accent>
                {'rn <= 3'}
            </SketchText>

            <SketchText x={700} y={36} size={11} bold>
                ফলাফল
            </SketchText>
            <SketchText x={700} y={56} size={9.5} body opacity={0.75}>
                সেরা তিনটা
            </SketchText>
            {JANUARY.map((row, i) => {
                const kept = i < 3;
                return (
                    <g key={`out-${row.id}`} opacity={kept ? 1 : 0.35}>
                        <rect
                            x={605}
                            y={rowY(i) - 18}
                            width={190}
                            height={28}
                            fill='transparent'
                            stroke={kept ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={kept ? 1 : 0.4}
                            strokeDasharray={kept ? undefined : '4 3'}
                            strokeWidth='1.2'
                        />
                        <SketchText x={650} y={rowY(i)} size={10} accent={kept}>
                            {`#${row.id}`}
                        </SketchText>
                        <SketchText x={740} y={rowY(i)} size={10} accent={kept}>
                            {kept ? row.total : 'বাদ'}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={410} y={262} size={9.5} body opacity={0.8}>
                প্রতিটা মাস নিজের দল: December, February, March, September, October এ একই কাজ আলাদা করে
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Ties at the cut: what each ranking function keeps                      */
/* ------------------------------------------------------------------------- */

/** October 2026, not cancelled, biggest first, with the three real numbers. */
const OCTOBER: { id: number; total: string; rn: number; rk: number; drk: number }[] = [
    { id: 14, total: '50000.00', rn: 1, rk: 1, drk: 1 },
    { id: 23, total: '42500.00', rn: 2, rk: 2, drk: 2 },
    { id: 16, total: '36000.00', rn: 3, rk: 3, drk: 3 },
    { id: 17, total: '36000.00', rn: 4, rk: 3, drk: 3 },
    { id: 19, total: '28000.00', rn: 5, rk: 5, drk: 4 },
    { id: 20, total: '15600.00', rn: 6, rk: 6, drk: 5 },
];

export function TieCutDiagram() {
    const cols = [
        { key: 'rn' as const, label: 'ROW_NUMBER', x: 330, kept: '৩টা' },
        { key: 'rk' as const, label: 'RANK', x: 490, kept: '৪টা' },
        { key: 'drk' as const, label: 'DENSE_RANK', x: 650, kept: '৪টা' },
    ];
    const rowY = (i: number) => 92 + i * 30;
    return (
        <Sketch
            label='সমান অঙ্কে কাটা: কোন Function কাকে রাখে'
            height={330}
            minWidth={760}
            viewBox='0 0 800 330'
            caption='October 2026 এর আসল ছয়টা Booking। Booking 16 আর 17 দুটোই 36000.00। ROW_NUMBER এ সমান অঙ্কেও আলাদা নম্বর লাগে, তাই একজন 3 আর একজন 4 পায়, আর ৩ এর দাগে একজন বাদ পড়ে (booking_id কে Tie-breaker রাখলে 17)। RANK আর DENSE_RANK দুজনকেই 3 দেয়, তাই দুজনেই থাকে। পার্থক্য দেখা যায় পরের Row তে: RANK 4 নম্বর এড়িয়ে Booking 19 কে 5 দেয়, DENSE_RANK তাকে 4 দেয়।'>
            <SketchText x={110} y={50} size={10.5} bold>
                booking, total_bdt
            </SketchText>
            {cols.map(col => (
                <SketchText key={col.key} x={col.x} y={50} size={10.5} bold accent>
                    {col.label}
                </SketchText>
            ))}
            {OCTOBER.map((row, i) => {
                const tie = row.id === 16 || row.id === 17;
                return (
                    <g key={row.id}>
                        {tie && <rect x={30} y={rowY(i) - 19} width={740} height={28} fill='var(--primary)' fillOpacity={0.07} />}
                        <SketchText x={110} y={rowY(i)} size={10}>
                            {`#${row.id}   ${row.total}`}
                        </SketchText>
                        {cols.map(col => {
                            const value = row[col.key];
                            const kept = value <= 3;
                            return (
                                <SketchText key={col.key} x={col.x} y={rowY(i)} size={11} bold={kept} accent={kept} opacity={kept ? 1 : 0.45}>
                                    {String(value)}
                                </SketchText>
                            );
                        })}
                    </g>
                );
            })}
            <line x1={30} y1={rowY(3) + 13} x2={770} y2={rowY(3) + 13} stroke='var(--primary)' strokeWidth='1.3' strokeDasharray='6 4' />
            <SketchText x={60} y={rowY(3) + 28} size={9} accent anchor='start'>
                {'<= 3 এর দাগ'}
            </SketchText>
            {cols.map(col => (
                <SketchText key={`k-${col.key}`} x={col.x} y={300} size={9.5} body accent>
                    {`থাকে ${col.kept}`}
                </SketchText>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Islands and gaps on a calendar strip                                   */
/* ------------------------------------------------------------------------- */

/** Days of October 2026 (1 to 14) that have at least one real booking. */
const OCT_BOOKED = new Set([1, 2, 4, 8, 10, 11, 12, 13, 14]);
const OCT_ISLANDS: { from: number; to: number }[] = [
    { from: 1, to: 2 },
    { from: 4, to: 4 },
    { from: 8, to: 8 },
    { from: 10, to: 14 },
];

export function IslandsCalendarDiagram() {
    const cell = 50;
    const x0 = 50;
    const cx = (day: number) => x0 + (day - 1) * cell;
    return (
        <Sketch
            label='Island আর Gap: October 2026 এর প্রথম চোদ্দ দিন'
            height={250}
            minWidth={760}
            viewBox='0 0 800 250'
            caption='ভরা ঘর মানে সেদিন অন্তত একটা Booking এসেছে। পাশাপাশি টানা ভরা ঘরগুলো এক একটা Island: 1 থেকে 2, শুধু 4, শুধু 8, আর 10 থেকে 14। দুই Island এর মাঝের খালি ঘরগুলো Gap: 3, 5 থেকে 7, আর 9। পুরো Data তে এমন Island মোট সতেরোটা, আর সবচেয়ে লম্বাটা এই 10 থেকে 14 October, পাঁচ দিন।'>
            {Array.from({ length: 14 }, (_, i) => i + 1).map(day => {
                const on = OCT_BOOKED.has(day);
                return (
                    <g key={day}>
                        <rect
                            x={cx(day)}
                            y={90}
                            width={cell - 6}
                            height={cell - 6}
                            fill={on ? 'var(--primary)' : 'transparent'}
                            fillOpacity={on ? 0.18 : 0}
                            stroke={on ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={on ? 1 : 0.35}
                            strokeDasharray={on ? undefined : '4 3'}
                            strokeWidth='1.2'
                        />
                        <SketchText x={cx(day) + (cell - 6) / 2} y={118} size={11} bold={on} accent={on} opacity={on ? 1 : 0.5}>
                            {String(day)}
                        </SketchText>
                    </g>
                );
            })}
            {OCT_ISLANDS.map(island => {
                const left = cx(island.from);
                const right = cx(island.to) + cell - 6;
                const mid = (left + right) / 2;
                return (
                    <g key={island.from}>
                        <path d={`M ${left} 80 V 70 H ${right} V 80`} fill='none' stroke='var(--primary)' strokeWidth='1.4' />
                        <SketchText x={mid} y={60} size={9} accent>
                            {island.from === island.to ? '1 দিন' : `${island.to - island.from + 1} দিন`}
                        </SketchText>
                    </g>
                );
            })}
            {[
                { from: 3, to: 3 },
                { from: 5, to: 7 },
                { from: 9, to: 9 },
            ].map(gap => {
                const left = cx(gap.from);
                const right = cx(gap.to) + cell - 6;
                return (
                    <g key={gap.from}>
                        <path d={`M ${left} 146 V 156 H ${right} V 146`} fill='none' stroke='currentColor' strokeOpacity={0.55} strokeWidth='1.2' strokeDasharray='4 3' />
                        <SketchText x={(left + right) / 2} y={174} size={9} body opacity={0.7}>
                            Gap
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={400} y={218} size={10} body opacity={0.85}>
                Island মানে টানা আছে এমন একটা দল, Gap মানে দুই দলের মাঝের ফাঁক
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. The trick: day minus row number stays the same inside an island        */
/* ------------------------------------------------------------------------- */

/** The real rows 16 to 24 of the trick query, the October booking days. */
const TRICK: { day: string; rn: number; key: string; island: number }[] = [
    { day: '2026-10-01', rn: 16, key: '2026-09-15', island: 0 },
    { day: '2026-10-02', rn: 17, key: '2026-09-15', island: 0 },
    { day: '2026-10-04', rn: 18, key: '2026-09-16', island: 1 },
    { day: '2026-10-08', rn: 19, key: '2026-09-19', island: 2 },
    { day: '2026-10-10', rn: 20, key: '2026-09-20', island: 3 },
    { day: '2026-10-11', rn: 21, key: '2026-09-20', island: 3 },
    { day: '2026-10-12', rn: 22, key: '2026-09-20', island: 3 },
    { day: '2026-10-13', rn: 23, key: '2026-09-20', island: 3 },
    { day: '2026-10-14', rn: 24, key: '2026-09-20', island: 3 },
];

export function RowNumberTrickDiagram() {
    const rowY = (i: number) => 84 + i * 26;
    return (
        <Sketch
            label='কৌশলটা: তারিখ থেকে Row Number বিয়োগ করলে Island এর ভেতরে একই উত্তর'
            height={350}
            minWidth={720}
            viewBox='0 0 760 350'
            caption='আসল Query এর শেষ নয়টা Row। টানা দিনে তারিখ প্রতি Row এ এক দিন বাড়ে, Row Number ও এক বাড়ে, তাই দুটোর বিয়োগফল একই থাকে: 10 থেকে 14 October এর পাঁচটা দিনেরই উত্তর 2026-09-20। মাঝে একটা দিন বাদ গেলে তারিখ দুই দিন লাফায় কিন্তু Row Number এক, তাই বিয়োগফল বদলে যায় আর নতুন Island শুরু হয়। বিয়োগফলটা নিজে কোনো অর্থবহ তারিখ না, শুধু একটা দলের নাম।'>
            <SketchText x={140} y={50} size={10.5} bold>
                day
            </SketchText>
            <SketchText x={300} y={50} size={10.5} bold>
                rn
            </SketchText>
            <SketchText x={480} y={50} size={10.5} bold accent>
                day - rn
            </SketchText>
            <SketchText x={650} y={50} size={10.5} bold>
                Island
            </SketchText>
            {TRICK.map((row, i) => {
                const shade = row.island % 2 === 1;
                return (
                    <g key={row.day}>
                        <rect
                            x={60}
                            y={rowY(i) - 17}
                            width={660}
                            height={24}
                            fill='var(--primary)'
                            fillOpacity={shade ? 0.1 : 0.03}
                        />
                        <SketchText x={140} y={rowY(i)} size={10}>
                            {row.day}
                        </SketchText>
                        <SketchText x={300} y={rowY(i)} size={10}>
                            {String(row.rn)}
                        </SketchText>
                        <SketchText x={480} y={rowY(i)} size={10} bold accent>
                            {row.key}
                        </SketchText>
                        <SketchText x={650} y={rowY(i)} size={10} body>
                            {`দল ${row.island + 1}`}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={390} y={330} size={9.5} body opacity={0.8}>
                একই রঙের Row গুলো একই Island, কারণ তাদের day - rn একই
            </SketchText>
        </Sketch>
    );
}
