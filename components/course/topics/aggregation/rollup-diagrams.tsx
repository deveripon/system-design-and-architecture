import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. একটা Report এর তিন তলা                                                    */
/* ------------------------------------------------------------------------- */

type ReportRow = { method: string; status: string; count: string; amount: string; level: 0 | 1 | 2 };

/** The real ROLLUP (method, status) result over the 19 payments. */
const REPORT: ReportRow[] = [
    { method: 'bank', status: 'paid', count: '2', amount: '54000.00', level: 2 },
    { method: 'bank', status: '', count: '2', amount: '54000.00', level: 1 },
    { method: 'bkash', status: 'failed', count: '1', amount: '50000.00', level: 2 },
    { method: 'bkash', status: 'paid', count: '5', amount: '107000.00', level: 2 },
    { method: 'bkash', status: 'refunded', count: '1', amount: '17000.00', level: 2 },
    { method: 'bkash', status: '', count: '7', amount: '174000.00', level: 1 },
    { method: 'card', status: 'paid', count: '7', amount: '211600.00', level: 2 },
    { method: 'card', status: '', count: '7', amount: '211600.00', level: 1 },
    { method: 'nagad', status: 'paid', count: '3', amount: '51000.00', level: 2 },
    { method: 'nagad', status: '', count: '3', amount: '51000.00', level: 1 },
    { method: '', status: '', count: '19', amount: '490600.00', level: 0 },
];

/**
 * The payments report with its three levels marked: the detail rows (method
 * and status), one subtotal per method, and the grand total. Every number is
 * the real output of ROLLUP (method, status).
 */
export function SubtotalLevelsDiagram() {
    const top = 58;
    const rowH = 25;
    const cols = [250, 360, 490, 580];
    return (
        <Sketch
            label='Three Levels in One Report'
            height={380}
            minWidth={800}
            viewBox='0 0 800 380'
            caption='একই Report এ তিন স্তরের লাইন। সাধারণ লাইনগুলো method আর status দুটো দিয়ে ভাগ করা। হালকা রঙের লাইনগুলো প্রতিটা method এর Subtotal, যেখানে status এর ঘর ফাঁকা। আর সবশেষের গাঢ় লাইনটা Grand Total, যেখানে দুটো ঘরই ফাঁকা। সংখ্যাগুলো ১৯টা আসল Payment থেকে নেওয়া।'>
            <SketchText x={cols[0]} y={36} anchor='start' size={10} bold opacity={0.7}>
                method
            </SketchText>
            <SketchText x={cols[1]} y={36} anchor='start' size={10} bold opacity={0.7}>
                status
            </SketchText>
            <SketchText x={cols[2]} y={36} anchor='end' size={10} bold opacity={0.7}>
                payments
            </SketchText>
            <SketchText x={cols[3] + 70} y={36} anchor='end' size={10} bold opacity={0.7}>
                amount
            </SketchText>
            <line x1={235} y1={44} x2={665} y2={44} stroke='currentColor' strokeOpacity={0.35} />
            {REPORT.map((row, i) => {
                const y = top + i * rowH;
                const fill = row.level === 0 ? 0.22 : row.level === 1 ? 0.08 : 0;
                return (
                    <g key={i}>
                        {fill > 0 && (
                            <rect
                                x={235}
                                y={y - 6}
                                width={430}
                                height={rowH - 2}
                                fill='var(--primary)'
                                fillOpacity={fill}
                            />
                        )}
                        <SketchText x={cols[0]} y={y + 10} anchor='start' size={10.5} bold={row.level === 0}>
                            {row.method || ' '}
                        </SketchText>
                        <SketchText x={cols[1]} y={y + 10} anchor='start' size={10.5} bold={row.level === 0}>
                            {row.status || ' '}
                        </SketchText>
                        <SketchText x={cols[2]} y={y + 10} anchor='end' size={10.5} bold={row.level < 2} accent={row.level === 0}>
                            {row.count}
                        </SketchText>
                        <SketchText x={cols[3] + 70} y={y + 10} anchor='end' size={10.5} bold={row.level < 2} accent={row.level === 0}>
                            {row.amount}
                        </SketchText>
                    </g>
                );
            })}
            {/* Brackets on the left name the three levels. */}
            <g>
                <line x1={205} y1={top - 4} x2={205} y2={top + 9 * rowH + 18} stroke='currentColor' strokeOpacity={0.35} />
                <SketchText x={190} y={top + 70} anchor='end' size={10} body>
                    সাধারণ লাইন
                </SketchText>
                <SketchText x={190} y={top + 88} anchor='end' size={9} opacity={0.6}>
                    method + status
                </SketchText>
                <SketchText x={190} y={top + 150} anchor='end' size={10} body accent>
                    Subtotal লাইন
                </SketchText>
                <SketchText x={190} y={top + 168} anchor='end' size={9} opacity={0.6}>
                    শুধু method
                </SketchText>
                <SketchText x={190} y={top + 10 * rowH + 10} anchor='end' size={10} body accent bold>
                    Grand Total
                </SketchText>
                <SketchText x={190} y={top + 10 * rowH + 26} anchor='end' size={9} opacity={0.6}>
                    কোনো ভাগ নেই
                </SketchText>
            </g>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. ROLLUP আর CUBE আসলে কোন কোন দল বানায়                                     */
/* ------------------------------------------------------------------------- */

function SetBox({
    x,
    y,
    label,
    rows,
    accent,
}: {
    x: number;
    y: number;
    label: string;
    rows: string;
    accent?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={170}
                height={46}
                fill={accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.1 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.9 : 0.45}
                strokeWidth='1.2'
            />
            <SketchText x={x + 85} y={y + 20} size={11} bold accent={accent}>
                {label}
            </SketchText>
            <SketchText x={x + 85} y={y + 36} size={9} opacity={0.65}>
                {rows}
            </SketchText>
        </g>
    );
}

/**
 * What each shorthand expands to, on the payments table: ROLLUP (method,
 * status) is three grouping sets, CUBE (method, status) is four. The row counts
 * are the real number of result rows each set adds.
 */
export function GroupingSetsMapDiagram() {
    return (
        <Sketch
            label='ROLLUP and CUBE as Grouping Sets'
            height={340}
            minWidth={820}
            viewBox='0 0 820 340'
            caption='ROLLUP আর CUBE আসলে GROUPING SETS এর দুটো সংক্ষিপ্ত রূপ। ROLLUP (method, status) তালিকার শুরু থেকে একটা একটা করে Column বাদ দেয়: তিনটা দল, n + 1। CUBE সম্ভাব্য সব জোড়া নেয়: চারটা দল, 2 এর ঘাত n। প্রতিটা বাক্সের নিচে লেখা, Payment Table এ সেই দলটা ফলাফলে কয়টা Row যোগ করে।'>
            <defs>
                <marker
                    id='rollup-map-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* ROLLUP column */}
            <SketchText x={205} y={34} size={12} bold accent>
                ROLLUP (method, status)
            </SketchText>
            <SketchText x={205} y={52} size={9.5} opacity={0.65}>
                ৩টা দল, মোট ১১টা Row
            </SketchText>
            <SetBox x={120} y={78} label='(method, status)' rows='৬টা Row' />
            <SetBox x={120} y={162} label='(method)' rows='৪টা Row, Subtotal' accent />
            <SetBox x={120} y={246} label='( )' rows='১টা Row, Grand Total' accent />
            <line x1={205} y1={126} x2={205} y2={158} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#rollup-map-arrow)' />
            <line x1={205} y1={210} x2={205} y2={242} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#rollup-map-arrow)' />
            <SketchText x={300} y={146} anchor='start' size={9} body opacity={0.7}>
                ডান দিক থেকে status বাদ
            </SketchText>
            <SketchText x={300} y={230} anchor='start' size={9} body opacity={0.7}>
                এবার method ও বাদ
            </SketchText>

            <line x1={430} y1={30} x2={430} y2={310} stroke='currentColor' strokeOpacity={0.2} strokeDasharray='4 4' />

            {/* CUBE column */}
            <SketchText x={630} y={34} size={12} bold accent>
                CUBE (method, status)
            </SketchText>
            <SketchText x={630} y={52} size={9.5} opacity={0.65}>
                ৪টা দল, মোট ১৪টা Row
            </SketchText>
            <SetBox x={545} y={78} label='(method, status)' rows='৬টা Row' />
            <SetBox x={460} y={162} label='(method)' rows='৪টা Row' accent />
            <SetBox x={630} y={162} label='(status)' rows='৩টা Row' accent />
            <SetBox x={545} y={246} label='( )' rows='১টা Row' accent />
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. একই ফাঁকা ঘর, দুটো আলাদা মানে                                             */
/* ------------------------------------------------------------------------- */

const GUIDE_ROWS = [
    { guide: '1', tours: '2', bit: '0' },
    { guide: '2', tours: '2', bit: '0' },
    { guide: '3', tours: '2', bit: '0' },
    { guide: '4', tours: '2', bit: '0' },
    { guide: '', tours: '1', bit: '0', mark: 'data' as const },
    { guide: '', tours: '9', bit: '1', mark: 'total' as const },
];

function GuideTable({ focus }: { focus: 'data' | 'total' }) {
    return (
        <>
            <SketchText x={40} y={24} anchor='start' size={10} bold opacity={0.7}>
                guide_id
            </SketchText>
            <SketchText x={150} y={24} anchor='end' size={10} bold opacity={0.7}>
                tours
            </SketchText>
            <SketchText x={240} y={24} anchor='end' size={10} bold opacity={0.7}>
                GROUPING
            </SketchText>
            {GUIDE_ROWS.map((row, i) => {
                const y = 44 + i * 26;
                const hit = row.mark === focus;
                return (
                    <g key={i}>
                        {hit && (
                            <rect x={28} y={y - 15} width={222} height={22} fill='var(--primary)' fillOpacity={0.14} stroke='var(--primary)' strokeWidth='1.2' />
                        )}
                        <SketchText x={40} y={y} anchor='start' size={10.5} opacity={row.mark && !hit ? 0.4 : 1}>
                            {row.guide || ' '}
                        </SketchText>
                        <SketchText x={150} y={y} anchor='end' size={10.5} bold={hit} accent={hit} opacity={row.mark && !hit ? 0.4 : 1}>
                            {row.tours}
                        </SketchText>
                        <SketchText x={240} y={y} anchor='end' size={10.5} bold={hit} accent={hit} opacity={row.mark && !hit ? 0.4 : 1}>
                            {row.bit}
                        </SketchText>
                    </g>
                );
            })}
        </>
    );
}

/**
 * ROLLUP (guide_id) on tours gives two rows with an empty guide_id. One is a
 * real group (the Ratargul tour has no guide), the other is the grand total.
 * GROUPING(guide_id) is what tells them apart.
 */
export function NullTwoMeaningsSplit() {
    return (
        <SketchSplit
            label='One Empty Cell, Two Meanings'
            caption='tours Table এ ROLLUP (guide_id) চালালে দুটো Row এর guide_id ফাঁকা আসে। বাঁয়ের হাইলাইট করা Row টা Data এর NULL: Ratargul Swamp Boat Day এর এখনো Guide নেই, তাই সে নিজেই একটা দল, ১টা ট্যুর। ডানেরটা ROLLUP এর বানানো Grand Total, ৯টা ট্যুর। চোখে দুটোই ফাঁকা, শুধু GROUPING(guide_id) বলে দেয় কোনটা কী: 0 মানে আসল দল, 1 মানে মোট।'
            panels={[
                {
                    title: 'Data এর NULL',
                    sub: 'Guide এখনো ঠিক হয়নি',
                    viewBox: '0 0 280 200',
                    height: 200,
                    children: <GuideTable focus='data' />,
                },
                {
                    title: 'ROLLUP এর NULL',
                    sub: 'সব Guide মিলিয়ে মোট',
                    viewBox: '0 0 280 200',
                    height: 200,
                    children: <GuideTable focus='total' />,
                },
            ]}
        />
    );
}
