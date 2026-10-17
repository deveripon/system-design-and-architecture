import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Shared bits                                                               */
/* ------------------------------------------------------------------------- */

const money = (n: number) => n.toLocaleString('en-US');

function Row({
    x,
    y,
    w,
    label,
    value,
    state,
}: {
    x: number;
    y: number;
    w: number;
    label: string;
    value: string;
    state: 'current' | 'in' | 'out';
}) {
    const current = state === 'current';
    const inside = state !== 'out';
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={26}
                fill={inside ? 'var(--primary)' : 'transparent'}
                fillOpacity={current ? 0.22 : inside ? 0.09 : 0}
                stroke={current ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={current ? 1 : 0.35}
                strokeWidth={current ? 1.6 : 1}
            />
            <SketchText x={x + 12} y={y + 17} size={10.5} anchor='start' accent={current} opacity={inside ? 1 : 0.55}>
                {label}
            </SketchText>
            <SketchText x={x + w - 12} y={y + 17} size={10.5} anchor='end' bold={current} accent={current} opacity={inside ? 1 : 0.55}>
                {value}
            </SketchText>
        </g>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. Frame এর গঠন: Partition, Current Row আর তার চারপাশ                       */
/* ------------------------------------------------------------------------- */

const ANATOMY_ROWS: [string, number][] = [
    ['#1  20 Dec', 25000],
    ['#2  28 Dec', 50000],
    ['#4  05 Jan', 25500],
    ['#3  10 Jan', 12500],
    ['#6  25 Jan', 36000],
    ['#7  28 Jan', 18000],
    ['#8  20 Feb', 19000],
    ['#9  01 Mar', 28000],
    ['#10 02 Mar', 14000],
];

/**
 * One partition of nine confirmed bookings in time order. Row #6 is the
 * current row; ROWS BETWEEN 2 PRECEDING AND CURRENT ROW lights up #4, #3 and
 * #6. The labels on the left name every position a frame boundary can use.
 */
export function FrameAnatomyDiagram() {
    const top = 46;
    const step = 32;
    const current = 4;
    const x = 250;
    const w = 300;
    const labels: [number, string][] = [
        [0, 'UNBOUNDED PRECEDING'],
        [2, '2 PRECEDING'],
        [current, 'CURRENT ROW'],
        [5, '1 FOLLOWING'],
        [8, 'UNBOUNDED FOLLOWING'],
    ];
    return (
        <Sketch
            label='Anatomy of a Frame'
            height={400}
            minWidth={900}
            viewBox='0 0 920 400'
            caption='বাম দিকের নামগুলো একটা Frame এর সীমা বলার শব্দ, সবই Current Row থেকে মাপা। এখানে Current Row হলো #6। ROWS BETWEEN 2 PRECEDING AND CURRENT ROW বললে হিসাবে আসে শুধু রঙিন তিনটা Row: #4, #3 আর #6। পরের Row এ গেলে Frame টাও এক ধাপ নিচে নামে।'>
            <defs>
                <marker id='frame-anatomy-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchText x={x + w / 2} y={28} size={10} bold opacity={0.7}>
                Partition: confirmed Booking, booked_at এর ক্রমে
            </SketchText>
            {ANATOMY_ROWS.map(([label, value], i) => (
                <Row
                    key={label}
                    x={x}
                    y={top + i * step}
                    w={w}
                    label={label}
                    value={money(value)}
                    state={i === current ? 'current' : i >= current - 2 && i <= current ? 'in' : 'out'}
                />
            ))}
            {labels.map(([i, text]) => {
                const y = top + i * step + 13;
                const here = i === current;
                return (
                    <g key={text}>
                        <SketchText x={x - 26} y={y + 4} size={10} anchor='end' bold={here} accent={here} opacity={here ? 1 : 0.75}>
                            {text}
                        </SketchText>
                        <line x1={x - 20} y1={y} x2={x - 4} y2={y} stroke='var(--primary)' strokeOpacity={here ? 1 : 0.5} strokeWidth='1.2' markerEnd='url(#frame-anatomy-arrow)' />
                    </g>
                );
            })}
            <path
                d={`M ${x + w + 14} ${top + (current - 2) * step + 2} H ${x + w + 30} V ${top + current * step + 24} H ${x + w + 14}`}
                fill='none'
                stroke='var(--primary)'
                strokeWidth='1.6'
            />
            <SketchText x={x + w + 42} y={top + (current - 1) * step + 6} size={10.5} anchor='start' bold accent>
                Frame
            </SketchText>
            <SketchText x={x + w + 42} y={top + (current - 1) * step + 24} size={10} anchor='start' opacity={0.85}>
                ROWS BETWEEN 2 PRECEDING
            </SketchText>
            <SketchText x={x + w + 42} y={top + (current - 1) * step + 40} size={10} anchor='start' opacity={0.85}>
                AND CURRENT ROW
            </SketchText>
            <SketchText x={x + w + 42} y={top + (current - 1) * step + 62} size={10.5} anchor='start' bold accent>
                sum = 74,000
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. ORDER BY থাকলে আর না থাকলে Default Frame                                  */
/* ------------------------------------------------------------------------- */

const SIX: [string, number][] = [
    ['#1', 25000],
    ['#2', 50000],
    ['#4', 25500],
    ['#3', 12500],
    ['#6', 36000],
    ['#7', 18000],
];

function DefaultPanel({ withOrder }: { withOrder: boolean }) {
    const current = 2;
    return (
        <g>
            {SIX.map(([label, value], i) => (
                <Row
                    key={label}
                    x={30}
                    y={20 + i * 32}
                    w={200}
                    label={label}
                    value={money(value)}
                    state={i === current ? 'current' : !withOrder || i < current ? 'in' : 'out'}
                />
            ))}
            <SketchText x={130} y={226} size={11} bold accent>
                {withOrder ? 'sum = 100,500' : 'sum = 167,000'}
            </SketchText>
        </g>
    );
}

/**
 * The same six bookings, the same current row (#4). Without ORDER BY the frame
 * is the whole partition; with ORDER BY it runs from the first row to the
 * current one. That single difference is why a running total appears.
 */
export function DefaultFrameSplit() {
    return (
        <SketchSplit
            label='Default Frame: Without and With ORDER BY'
            caption='ধরে নিন Partition এ শুধু এই ছয়টা Booking। OVER () তে কোনো ক্রম নেই, তাই প্রতিটা Row এর Frame পুরো Partition, সবাই একই 167,000 পায়। OVER (ORDER BY booked_at) লিখলেই Frame হয়ে যায় শুরু থেকে এই Row পর্যন্ত, তাই #4 এর ঘরে আসে 100,500, চলমান যোগফল। কোনো Frame না লিখলেও একটা Frame সবসময় থাকে, শুধু চোখে পড়ে না।'
            panels={[
                { title: 'OVER ()', sub: 'পুরো Partition', viewBox: '0 0 260 240', height: 240, children: <DefaultPanel withOrder={false} /> },
                { title: 'OVER (ORDER BY booked_at)', sub: 'শুরু থেকে এই Row', viewBox: '0 0 260 240', height: 240, children: <DefaultPanel withOrder /> },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. সমান মানের Row: সিঁড়ি বনাম ঢাল                                            */
/* ------------------------------------------------------------------------- */

const STAIR_ROWS = ['#1', '#2', '#4', '#3', '#6', '#7'];
const BY_MONTH = [75000, 75000, 167000, 167000, 167000, 167000];
const BY_TIME = [25000, 75000, 100500, 113000, 149000, 167000];

/**
 * December and January's six confirmed bookings. Ordered by the month alone,
 * every booking in a month is a peer, so the default RANGE frame gives them all
 * the month-end total: stairs. Ordered by booked_at, each row adds itself.
 */
export function PeersStairsDiagram() {
    const left = 110;
    const width = 660;
    const bottom = 300;
    const height = 230;
    const max = 180000;
    const xAt = (i: number) => left + 50 + i * ((width - 100) / (STAIR_ROWS.length - 1));
    const yAt = (v: number) => bottom - (v / max) * height;
    const line = (values: number[]) => values.map((v, i) => `${i ? 'L' : 'M'} ${xAt(i)} ${yAt(v)}`).join(' ');
    return (
        <Sketch
            label='Ties Make Stairs'
            height={360}
            minWidth={900}
            viewBox='0 0 920 360'
            caption='ORDER BY date_trunc(month, booked_at) লিখলে একই মাসের সব Booking একে অপরের সমান, মানে Peer। Default Frame টা RANGE, আর RANGE এ CURRENT ROW মানে এই Row এর শেষ Peer পর্যন্ত। তাই জানুয়ারির চারটা Booking সবাই পায় 167,000, যেন সিঁড়ি। booked_at দিয়ে সাজালে কেউ কারো Peer না, প্রতিটা Row নিজেরটা যোগ করে।'>
            <line x1={left} y1={bottom} x2={left + width} y2={bottom} stroke='currentColor' strokeOpacity={0.4} />
            <line x1={left} y1={bottom} x2={left} y2={bottom - height - 10} stroke='currentColor' strokeOpacity={0.4} />
            {[0, 50000, 100000, 150000].map(v => (
                <g key={v}>
                    <line x1={left - 4} y1={yAt(v)} x2={left + width} y2={yAt(v)} stroke='currentColor' strokeOpacity={0.08} />
                    <SketchText x={left - 10} y={yAt(v) + 4} size={9.5} anchor='end' opacity={0.6}>
                        {money(v)}
                    </SketchText>
                </g>
            ))}
            {STAIR_ROWS.map((label, i) => (
                <g key={label}>
                    <SketchText x={xAt(i)} y={bottom + 18} size={10} opacity={0.75}>
                        {label}
                    </SketchText>
                    <SketchText x={xAt(i)} y={bottom + 34} size={9} opacity={0.55}>
                        {i < 2 ? 'Dec' : 'Jan'}
                    </SketchText>
                </g>
            ))}
            <path d={line(BY_TIME)} fill='none' stroke='currentColor' strokeOpacity={0.55} strokeWidth='1.6' strokeDasharray='5 4' />
            <path d={line(BY_MONTH)} fill='none' stroke='var(--primary)' strokeWidth='2.2' />
            {BY_MONTH.map((v, i) => (
                <circle key={`m${i}`} cx={xAt(i)} cy={yAt(v)} r={4} fill='var(--primary)' />
            ))}
            {BY_TIME.map((v, i) => (
                <circle key={`t${i}`} cx={xAt(i)} cy={yAt(v)} r={3.2} fill='var(--card)' stroke='currentColor' strokeOpacity={0.7} />
            ))}
            <SketchText x={left + width + 14} y={yAt(167000) - 10} size={10.5} anchor='start' bold accent>
                ORDER BY month
            </SketchText>
            <SketchText x={left + width + 14} y={yAt(167000) + 6} size={9.5} anchor='start' accent>
                সিঁড়ি: Peer রা একই মান
            </SketchText>
            <SketchText x={xAt(2) + 14} y={yAt(100500) + 22} size={10.5} anchor='start' bold opacity={0.8}>
                ORDER BY booked_at
            </SketchText>
            <SketchText x={xAt(2) + 14} y={yAt(100500) + 38} size={9.5} anchor='start' opacity={0.7}>
                ঢাল: প্রতিটা Row নিজেরটা যোগ করে
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. ROWS, RANGE আর GROUPS একই "1 PRECEDING" কে কীভাবে পড়ে                    */
/* ------------------------------------------------------------------------- */

const LINE_POINTS: { id: string; v: number }[] = [
    { id: '#21', v: 10500 },
    { id: '#3', v: 12500 },
    { id: '#22', v: 12500 },
    { id: '#10', v: 14000 },
    { id: '#11', v: 15600 },
];

/**
 * Current row #10 (14,000). ROWS 1 PRECEDING takes the one row just before it,
 * #22. RANGE 1000 PRECEDING takes values from 13,000 to 14,000, which is only
 * #10 itself. GROUPS 1 PRECEDING takes the previous group of equal values, both
 * 12,500 rows, plus the current group.
 */
export function RowsRangeGroupsDiagram() {
    const left = 200;
    const width = 600;
    const lo = 10000;
    const hi = 16000;
    const xAt = (v: number) => left + ((v - lo) / (hi - lo)) * width;
    const tracks: { name: string; rule: string; keep: string[] }[] = [
        { name: 'ROWS', rule: '1 PRECEDING: ঠিক আগের একটা Row', keep: ['#22', '#10'] },
        { name: 'RANGE', rule: '1000 PRECEDING: মান 13,000 থেকে 14,000', keep: ['#10'] },
        { name: 'GROUPS', rule: '1 PRECEDING: আগের সমান মানের দল', keep: ['#3', '#22', '#10'] },
    ];
    return (
        <Sketch
            label='Three Ways to Count Back'
            height={330}
            minWidth={900}
            viewBox='0 0 920 330'
            caption='একই Current Row #10, একই কথা "আগের একটা"। ROWS গোনে Row, তাই নেয় ঠিক আগের Row #22। RANGE মাপে মানের দূরত্ব, 14,000 থেকে 1,000 পিছনে কোনো Booking নেই, তাই শুধু নিজে। GROUPS গোনে সমান মানের দল, আগের দলটা 12,500 এর দুজন, তাই তিনজন। Row গুলো booking_id দিয়েও সাজানো, তাই 12,500 এর মধ্যে #3 আগে, #22 পরে।'>
            {tracks.map((track, t) => {
                const y = 70 + t * 90;
                return (
                    <g key={track.name}>
                        <SketchText x={30} y={y + 4} size={12} anchor='start' bold accent>
                            {track.name}
                        </SketchText>
                        <SketchText x={30} y={y + 22} size={9.5} anchor='start' body opacity={0.75}>
                            {track.rule}
                        </SketchText>
                        <line x1={left} y1={y} x2={left + width} y2={y} stroke='currentColor' strokeOpacity={0.3} />
                        {LINE_POINTS.map(p => {
                            const twin = LINE_POINTS.filter(q => q.v === p.v);
                            const offset = twin.length > 1 ? (twin.indexOf(p) === 0 ? -9 : 9) : 0;
                            const cx = xAt(p.v) + offset;
                            const kept = track.keep.includes(p.id);
                            const current = p.id === '#10';
                            return (
                                <g key={`${track.name}${p.id}`}>
                                    <circle
                                        cx={cx}
                                        cy={y}
                                        r={current ? 8 : 6.5}
                                        fill={kept ? 'var(--primary)' : 'var(--card)'}
                                        fillOpacity={current ? 1 : kept ? 0.55 : 1}
                                        stroke={kept ? 'var(--primary)' : 'currentColor'}
                                        strokeOpacity={kept ? 1 : 0.5}
                                    />
                                    <SketchText x={cx} y={y - 14} size={9.5} opacity={kept ? 1 : 0.55} accent={kept}>
                                        {p.id}
                                    </SketchText>
                                    {t === 2 && twin.indexOf(p) === 0 && (
                                        <SketchText x={xAt(p.v)} y={y + 28} size={9} opacity={0.6}>
                                            {money(p.v)}
                                        </SketchText>
                                    )}
                                </g>
                            );
                        })}
                        <SketchText x={left + width + 20} y={y + 4} size={10.5} anchor='start' bold accent>
                            {`count = ${track.keep.length}`}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. ক্যালেন্ডারে ফাঁক: ROWS বনাম RANGE INTERVAL                               */
/* ------------------------------------------------------------------------- */

const MONTHS: { label: string; revenue: number | null }[] = [
    { label: 'Dec', revenue: 75000 },
    { label: 'Jan', revenue: 92000 },
    { label: 'Feb', revenue: 19000 },
    { label: 'Mar', revenue: 57600 },
    { label: 'Apr', revenue: null },
    { label: 'May', revenue: null },
    { label: 'Jun', revenue: null },
    { label: 'Jul', revenue: null },
    { label: 'Aug', revenue: null },
    { label: 'Sep', revenue: 50500 },
    { label: 'Oct', revenue: 129500 },
];

/**
 * The monthly revenue has a hole from April to August. For September, ROWS 2
 * PRECEDING reaches back over the hole to February and March; RANGE INTERVAL
 * '2 months' PRECEDING only reaches July, and July and August have no row.
 */
export function CalendarGapDiagram() {
    const left = 60;
    const slot = 72;
    const base = 230;
    const scale = 140 / 130000;
    const xAt = (i: number) => left + i * slot + slot / 2;
    const sep = 9;
    return (
        <Sketch
            label='A Gap in the Calendar'
            height={360}
            minWidth={900}
            viewBox='0 0 920 360'
            caption='মাস প্রতি confirmed আয়ে এপ্রিল থেকে আগস্ট পর্যন্ত কোনো Row নেই। সেপ্টেম্বরের জন্য ROWS 2 PRECEDING ফাঁক ডিঙিয়ে ফেব্রুয়ারি আর মার্চ টেনে আনে, ছয় মাস আগের আয় দিয়ে "শেষ তিন মাসের গড়" বানায়: 42,366.67। RANGE INTERVAL 2 months PRECEDING ক্যালেন্ডার মাপে, জুলাই থেকে সেপ্টেম্বর, সেখানে শুধু সেপ্টেম্বর নিজে: 50,500।'>
            {MONTHS.map((m, i) => (
                <g key={m.label}>
                    {m.revenue !== null ? (
                        <rect
                            x={xAt(i) - 18}
                            y={base - m.revenue * scale}
                            width={36}
                            height={m.revenue * scale}
                            fill={i === sep ? 'var(--primary)' : 'currentColor'}
                            fillOpacity={i === sep ? 0.5 : 0.18}
                            stroke={i === sep ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={i === sep ? 1 : 0.4}
                        />
                    ) : (
                        <line x1={xAt(i) - 14} y1={base - 2} x2={xAt(i) + 14} y2={base - 2} stroke='currentColor' strokeOpacity={0.3} strokeDasharray='3 3' />
                    )}
                    <SketchText x={xAt(i)} y={base + 18} size={10} bold={i === sep} accent={i === sep} opacity={m.revenue === null ? 0.45 : 0.85}>
                        {m.label}
                    </SketchText>
                </g>
            ))}
            <line x1={left} y1={base} x2={left + MONTHS.length * slot} y2={base} stroke='currentColor' strokeOpacity={0.4} />
            <path d={`M ${xAt(2) - 22} ${base + 40} V ${base + 50} H ${xAt(sep) + 22} V ${base + 40}`} fill='none' stroke='currentColor' strokeOpacity={0.7} strokeWidth='1.4' />
            <SketchText x={(xAt(2) + xAt(sep)) / 2} y={base + 68} size={10.5} bold opacity={0.85}>
                ROWS BETWEEN 2 PRECEDING AND CURRENT ROW: Feb, Mar, Sep
            </SketchText>
            <path d={`M ${xAt(7) - 22} ${base + 86} V ${base + 96} H ${xAt(sep) + 22} V ${base + 86}`} fill='none' stroke='var(--primary)' strokeWidth='1.8' />
            <SketchText x={xAt(8)} y={base + 114} size={10.5} bold accent>
                {"RANGE INTERVAL '2 months' PRECEDING: Jul থেকে Sep, শুধু Sep"}
            </SketchText>
        </Sketch>
    );
}
