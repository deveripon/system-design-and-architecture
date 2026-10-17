import { Sketch, SketchSplit, SketchText } from '../../sketch';
import { BOOKINGS, idsWithStatus, type BookingStatus } from './group-data';

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

/** How a booking cell is drawn for each status, without leaving the theme colours. */
const STATUS_STYLE: Record<BookingStatus, { fill: string; fillOpacity: number; dash?: string; short: string }> = {
    confirmed: { fill: 'var(--primary)', fillOpacity: 0.14, short: 'conf' },
    pending: { fill: 'transparent', fillOpacity: 0, dash: '3 2', short: 'pend' },
    cancelled: { fill: 'currentColor', fillOpacity: 0.12, short: 'canc' },
};

const STATUSES: BookingStatus[] = ['cancelled', 'confirmed', 'pending'];

/* ------------------------------------------------------------------------- */
/* 1. ২৪টা Row থেকে তিনটা স্তূপ, তিনটা স্তূপ থেকে তিনটা Row                       */
/* ------------------------------------------------------------------------- */

/**
 * The 24 real bookings, sorted into one pile per status, and each pile
 * collapsed into one result row with its count.
 */
export function GroupPilesDiagram() {
    const cell = { w: 40, h: 30, gap: 6 };
    const gridX = 24;
    const gridY = 70;
    const pileX = 340;
    const pileW = 250;
    const piles = STATUSES.map((status, i) => ({
        status,
        ids: idsWithStatus(status),
        y: [64, 140, 268][i],
        h: [58, 110, 58][i],
    }));
    const resultX = 650;
    const resultY = 150;
    return (
        <Sketch
            label='GROUP BY status: Rows to Piles to One Row Each'
            height={360}
            minWidth={900}
            viewBox='0 0 900 360'
            caption='বাঁ দিকে bookings Table এর ২৪টা আসল Row। GROUP BY status প্রতিটা Row কে তার status দেখে একটা স্তূপে রাখে: ৩টা cancelled, ১৭টা confirmed, ৪টা pending। তারপর প্রতিটা স্তূপ ভেঙে একটা মাত্র Row হয়, আর সেই Row তে বসে স্তূপটার হিসাব, এখানে count(*)। ২৪টা Row ঢুকে বের হলো ৩টা।'>
            <Arrow id='group-piles-arrow' />

            <SketchText x={gridX + 3 * (cell.w + cell.gap) - cell.gap / 2} y={40} size={11} bold>
                bookings, ২৪টা Row
            </SketchText>
            {BOOKINGS.map((b, i) => {
                const x = gridX + (i % 6) * (cell.w + cell.gap);
                const y = gridY + Math.floor(i / 6) * (cell.h + cell.gap);
                const style = STATUS_STYLE[b.status];
                return (
                    <g key={b.id}>
                        <rect
                            x={x}
                            y={y}
                            width={cell.w}
                            height={cell.h}
                            fill={style.fill}
                            fillOpacity={style.fillOpacity}
                            stroke={b.status === 'confirmed' ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={b.status === 'cancelled' ? 0.4 : 0.8}
                            strokeDasharray={style.dash}
                            strokeWidth='1.1'
                        />
                        <SketchText x={x + cell.w / 2} y={y + 13} size={9.5} bold>
                            {b.id}
                        </SketchText>
                        <SketchText x={x + cell.w / 2} y={y + 25} size={7.5} opacity={0.7}>
                            {style.short}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={gridX} y={232} size={9} anchor='start' opacity={0.75}>
                conf = confirmed, pend = pending,
            </SketchText>
            <SketchText x={gridX} y={248} size={9} anchor='start' opacity={0.75}>
                canc = cancelled
            </SketchText>

            <line
                x1={300}
                y1={180}
                x2={pileX - 10}
                y2={180}
                stroke='var(--primary)'
                strokeWidth='1.4'
                markerEnd='url(#group-piles-arrow)'
            />
            <SketchText x={318} y={168} size={9} bold accent>
                GROUP BY
            </SketchText>

            {piles.map(p => (
                <g key={p.status}>
                    <rect
                        x={pileX}
                        y={p.y}
                        width={pileW}
                        height={p.h}
                        fill={STATUS_STYLE[p.status].fill}
                        fillOpacity={STATUS_STYLE[p.status].fillOpacity}
                        stroke={p.status === 'confirmed' ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={0.6}
                        strokeDasharray={STATUS_STYLE[p.status].dash}
                        strokeWidth='1.2'
                    />
                    <SketchText x={pileX + 12} y={p.y + 18} size={10.5} anchor='start' bold accent={p.status === 'confirmed'}>
                        {`${p.status} (${p.ids.length})`}
                    </SketchText>
                    {Array.from({ length: Math.ceil(p.ids.length / 9) }, (_, line) => (
                        <SketchText key={line} x={pileX + 12} y={p.y + 38 + line * 16} size={9.5} anchor='start' opacity={0.85}>
                            {p.ids.slice(line * 9, line * 9 + 9).join(', ')}
                        </SketchText>
                    ))}
                </g>
            ))}

            <line
                x1={pileX + pileW + 8}
                y1={180}
                x2={resultX - 10}
                y2={180}
                stroke='var(--primary)'
                strokeWidth='1.4'
                markerEnd='url(#group-piles-arrow)'
            />
            <SketchText x={(pileX + pileW + resultX) / 2} y={168} size={9} bold accent>
                count(*)
            </SketchText>

            <rect x={resultX} y={resultY - 28} width={230} height={124} fill='transparent' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            <SketchText x={resultX + 14} y={resultY - 10} size={10} anchor='start' bold>
                status
            </SketchText>
            <SketchText x={resultX + 216} y={resultY - 10} size={10} anchor='end' bold>
                count
            </SketchText>
            <line x1={resultX} y1={resultY} x2={resultX + 230} y2={resultY} stroke='currentColor' strokeOpacity={0.4} />
            {piles.map((p, i) => (
                <g key={p.status}>
                    <SketchText x={resultX + 14} y={resultY + 24 + i * 28} size={10.5} anchor='start' accent={p.status === 'confirmed'}>
                        {p.status}
                    </SketchText>
                    <SketchText x={resultX + 216} y={resultY + 24 + i * 28} size={10.5} anchor='end' bold accent={p.status === 'confirmed'}>
                        {p.ids.length}
                    </SketchText>
                </g>
            ))}
            <SketchText x={resultX + 115} y={resultY + 120} size={10} body opacity={0.8}>
                প্রতিটা স্তূপ থেকে একটা Row
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. স্তূপে ১৭টা booking_id, ঘর মাত্র একটা                                        */
/* ------------------------------------------------------------------------- */

/**
 * Why a column that is neither grouped nor aggregated is refused: the
 * confirmed pile holds 17 different booking ids and the result row has room
 * for one.
 */
export function WhichValueDiagram() {
    const ids = idsWithStatus('confirmed');
    return (
        <Sketch
            label='Which booking_id Goes in the Box?'
            height={300}
            minWidth={880}
            viewBox='0 0 880 300'
            caption='confirmed স্তূপে ১৭টা Row, আর তাদের booking_id ১৭টা আলাদা সংখ্যা। Result এ এই স্তূপের জন্য Row একটাই, তাই booking_id এর ঘরও একটা। কোন সংখ্যাটা বসবে, Database জানে না, তাই PostgreSQL Query টা চালাতেই রাজি হয় না। count(*) এর বেলায় কোনো দ্বিধা নেই: পুরো স্তূপের একটাই উত্তর, ১৭।'>
            <Arrow id='group-which-arrow' />
            <rect x={30} y={50} width={300} height={200} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1.2' />
            <SketchText x={180} y={38} size={11} bold accent>
                confirmed স্তূপ, ১৭টা Row
            </SketchText>
            {ids.map((id, i) => (
                <g key={id}>
                    <rect
                        x={46 + (i % 6) * 46}
                        y={66 + Math.floor(i / 6) * 58}
                        width={38}
                        height={42}
                        fill='var(--card)'
                        stroke='currentColor'
                        strokeOpacity={0.45}
                    />
                    <SketchText x={65 + (i % 6) * 46} y={84 + Math.floor(i / 6) * 58} size={8} opacity={0.6}>
                        booking_id
                    </SketchText>
                    <SketchText x={65 + (i % 6) * 46} y={100 + Math.floor(i / 6) * 58} size={11} bold>
                        {id}
                    </SketchText>
                </g>
            ))}

            <line x1={340} y1={150} x2={460} y2={150} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#group-which-arrow)' />
            <SketchText x={400} y={138} size={9.5} bold accent>
                এক Row
            </SketchText>

            <rect x={470} y={100} width={380} height={100} fill='transparent' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            {['status', 'booking_id', 'count(*)'].map((h, i) => (
                <SketchText key={h} x={533 + i * 127} y={124} size={10} bold>
                    {h}
                </SketchText>
            ))}
            <line x1={470} y1={134} x2={850} y2={134} stroke='currentColor' strokeOpacity={0.4} />
            <line x1={597} y1={100} x2={597} y2={200} stroke='currentColor' strokeOpacity={0.3} />
            <line x1={723} y1={100} x2={723} y2={200} stroke='currentColor' strokeOpacity={0.3} />
            <SketchText x={533} y={172} size={11}>
                confirmed
            </SketchText>
            <rect x={612} y={146} width={96} height={40} fill='var(--primary)' fillOpacity={0.12} stroke='var(--primary)' strokeDasharray='4 3' />
            <SketchText x={660} y={174} size={18} bold accent>
                ?
            </SketchText>
            <SketchText x={787} y={172} size={11} bold>
                17
            </SketchText>
            <SketchText x={660} y={230} size={10} body accent>
                ১৭টা মান, ঘর একটা: কোনটা?
            </SketchText>
            <SketchText x={787} y={230} size={10} body>
                উত্তর একটাই
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. দুই Column এ ভাগ: method, তারপর status                                     */
/* ------------------------------------------------------------------------- */

const METHOD_GROUPS: { method: string; total: number; statuses: { status: string; n: number }[] }[] = [
    { method: 'bank', total: 2, statuses: [{ status: 'paid', n: 2 }] },
    {
        method: 'bkash',
        total: 7,
        statuses: [
            { status: 'failed', n: 1 },
            { status: 'paid', n: 5 },
            { status: 'refunded', n: 1 },
        ],
    },
    { method: 'card', total: 7, statuses: [{ status: 'paid', n: 7 }] },
    { method: 'nagad', total: 3, statuses: [{ status: 'paid', n: 3 }] },
];

/**
 * GROUP BY method, status on the 19 real payments: four method piles, split
 * again by status into six leaf groups, which become the six result rows.
 */
export function CompositeGroupsDiagram() {
    const leafW = 112;
    const leafGap = 18;
    const leaves = METHOD_GROUPS.flatMap((m, mi) => m.statuses.map(s => ({ ...s, method: m.method, mi })));
    const leafX = (i: number) => 30 + i * (leafW + leafGap);
    const parentCenter = (mi: number) => {
        const mine = leaves.map((l, i) => ({ l, i })).filter(({ l }) => l.mi === mi);
        return (leafX(mine[0].i) + leafX(mine[mine.length - 1].i) + leafW) / 2;
    };
    return (
        <Sketch
            label='GROUP BY method, status on payments'
            height={330}
            minWidth={820}
            viewBox='0 0 820 330'
            caption='দুটো Column এ GROUP BY মানে দুই ধাপে ভাগ, যদিও Database একবারেই করে। ১৯টা Payment প্রথমে method অনুযায়ী চারটা স্তূপে, তারপর প্রতিটা স্তূপ status অনুযায়ী আবার ভাগ। bkash এর স্তূপে তিন রকম status, তাই সেটা তিন টুকরো। শেষে যতগুলো আলাদা (method, status) জোড়া, ততগুলো Row: ছয়টা।'>
            <rect x={330} y={22} width={160} height={40} fill='transparent' stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.2' />
            <SketchText x={410} y={47} size={11} bold>
                payments, ১৯টা Row
            </SketchText>
            {METHOD_GROUPS.map((m, mi) => {
                const cx = parentCenter(mi);
                return (
                    <g key={m.method}>
                        <line x1={410} y1={62} x2={cx} y2={112} stroke='currentColor' strokeOpacity={0.4} />
                        <rect x={cx - 62} y={112} width={124} height={42} fill='transparent' stroke='currentColor' strokeOpacity={0.55} strokeWidth='1.2' />
                        <SketchText x={cx} y={130} size={10.5} bold>
                            {m.method}
                        </SketchText>
                        <SketchText x={cx} y={146} size={9} opacity={0.7}>
                            {`${m.total}টা`}
                        </SketchText>
                    </g>
                );
            })}
            {leaves.map((leaf, i) => {
                const x = leafX(i);
                return (
                    <g key={`${leaf.method}-${leaf.status}`}>
                        <line x1={parentCenter(leaf.mi)} y1={154} x2={x + leafW / 2} y2={204} stroke='var(--primary)' strokeOpacity={0.6} />
                        <rect x={x} y={204} width={leafW} height={52} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.2' />
                        <SketchText x={x + leafW / 2} y={224} size={9.5} accent>
                            {`${leaf.method}, ${leaf.status}`}
                        </SketchText>
                        <SketchText x={x + leafW / 2} y={244} size={12} bold accent>
                            {leaf.n}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={410} y={292} size={10.5} body>
                প্রতিটা নিচের বাক্স Result এর একটা Row: মোট ৬টা
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. DISTINCT বনাম GROUP BY                                                   */
/* ------------------------------------------------------------------------- */

const STATUS_COUNTS: [string, number][] = [
    ['cancelled', 3],
    ['confirmed', 17],
    ['pending', 4],
];

function MiniTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
    const colW = headers.length === 1 ? 220 : 140;
    const x0 = (320 - colW * headers.length) / 2;
    return (
        <g>
            <rect x={x0} y={20} width={colW * headers.length} height={36 + rows.length * 30} fill='transparent' stroke='currentColor' strokeOpacity={0.5} />
            {headers.map((h, i) => (
                <SketchText key={h} x={x0 + colW * i + colW / 2} y={42} size={10.5} bold>
                    {h}
                </SketchText>
            ))}
            <line x1={x0} y1={54} x2={x0 + colW * headers.length} y2={54} stroke='currentColor' strokeOpacity={0.4} />
            {rows.map((row, r) =>
                row.map((value, c) => (
                    <SketchText key={`${r}-${c}`} x={x0 + colW * c + colW / 2} y={76 + r * 30} size={11} accent={c === 1}>
                        {value}
                    </SketchText>
                ))
            )}
        </g>
    );
}

/** The same three piles: DISTINCT only names them, GROUP BY can also measure them. */
export function GroupVsDistinctSplit() {
    return (
        <SketchSplit
            label='DISTINCT vs GROUP BY'
            caption='দুটো Query একই তিনটা স্তূপ বানায়, তাই একই তিনটা status দেখায়। পার্থক্য হলো স্তূপ নিয়ে কী করা যায়। DISTINCT শুধু বলে কোন কোন মান আছে। GROUP BY স্তূপগুলোর গায়ে হিসাব বসাতে দেয়: কয়টা, কত টাকা, সবচেয়ে বড় কোনটা।'
            panels={[
                {
                    title: 'SELECT DISTINCT status',
                    sub: 'কোন মানগুলো আছে',
                    viewBox: '0 0 320 160',
                    height: 160,
                    children: <MiniTable headers={['status']} rows={STATUS_COUNTS.map(([s]) => [s])} />,
                },
                {
                    title: 'GROUP BY status',
                    sub: 'প্রতিটার হিসাবসহ',
                    viewBox: '0 0 320 160',
                    height: 160,
                    children: (
                        <MiniTable headers={['status', 'count(*)']} rows={STATUS_COUNTS.map(([s, n]) => [s, String(n)])} />
                    ),
                },
            ]}
        />
    );
}
