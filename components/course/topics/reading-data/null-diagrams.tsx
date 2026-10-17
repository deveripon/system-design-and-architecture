import { Sketch, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. শূন্য, খালি লেখা আর NULL                                                 */
/* ------------------------------------------------------------------------- */

const BOXES = [
    {
        x: 40,
        value: '0',
        name: 'শূন্য',
        lines: ['মান জানা আছে', 'পরিমাণটা শূন্য', 'seats_left = 0'],
        accent: false,
    },
    {
        x: 290,
        value: "''",
        name: 'খালি লেখা',
        lines: ['মান জানা আছে', 'লেখায় কোনো অক্ষর নেই', "comment = ''"],
        accent: false,
    },
    {
        x: 540,
        value: 'NULL',
        name: 'জানা নেই',
        lines: ['মানটাই অজানা', 'বা এখানে প্রযোজ্য না', 'phone IS NULL'],
        accent: true,
    },
];

/** Zero, empty text and NULL side by side: two known values and one unknown. */
export function NullBoxesDiagram() {
    return (
        <Sketch
            label='Zero, Empty Text and NULL'
            height={270}
            minWidth={780}
            viewBox='0 0 780 270'
            caption='প্রথম দুটো বাক্সে একটা মান আছে, শুধু মানটা ছোট। তৃতীয় বাক্সে কোনো মানই নেই, আছে একটা চিরকুট: জানা নেই। SQL এর NULL হলো সেই চিরকুট, কোনো মান না।'>
            {BOXES.map(box => (
                <g key={box.name}>
                    <rect
                        x={box.x}
                        y={30}
                        width={200}
                        height={110}
                        fill={box.accent ? 'var(--primary)' : 'transparent'}
                        fillOpacity={box.accent ? 0.08 : 0}
                        stroke={box.accent ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={box.accent ? 1 : 0.45}
                        strokeWidth='1.3'
                        strokeDasharray={box.accent ? '6 4' : undefined}
                    />
                    <SketchText x={box.x + 100} y={78} size={box.accent ? 24 : 30} bold accent={box.accent}>
                        {box.value}
                    </SketchText>
                    {box.accent && (
                        <SketchText x={box.x + 100} y={112} size={12} body accent>
                            ? মান অজানা
                        </SketchText>
                    )}
                    <SketchText x={box.x + 100} y={168} size={13} bold body accent={box.accent}>
                        {box.name}
                    </SketchText>
                    {box.lines.map((line, i) => (
                        <SketchText
                            key={line}
                            x={box.x + 100}
                            y={194 + i * 22}
                            size={i === 2 ? 10.5 : 11.5}
                            body={i < 2}
                            opacity={0.85}>
                            {line}
                        </SketchText>
                    ))}
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. তিন মানের যুক্তি: AND, OR, NOT এর টেবিল                                   */
/* ------------------------------------------------------------------------- */

type V = 'T' | 'F' | 'U';
const VALUES: V[] = ['T', 'F', 'U'];

function and(a: V, b: V): V {
    if (a === 'F' || b === 'F') return 'F';
    if (a === 'U' || b === 'U') return 'U';
    return 'T';
}
function or(a: V, b: V): V {
    if (a === 'T' || b === 'T') return 'T';
    if (a === 'U' || b === 'U') return 'U';
    return 'F';
}

const NAME: Record<V, string> = { T: 'TRUE', F: 'FALSE', U: 'UNKNOWN' };

function Cell({ x, y, v, w = 86 }: { x: number; y: number; v: V; w?: number }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={34}
                fill={v === 'T' ? 'var(--primary)' : 'currentColor'}
                fillOpacity={v === 'T' ? 0.16 : v === 'F' ? 0.06 : 0}
                stroke={v === 'U' ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={v === 'U' ? 0.8 : 0.35}
                strokeDasharray={v === 'U' ? '4 3' : undefined}
                strokeWidth='1.1'
            />
            <SketchText x={x + w / 2} y={y + 22} size={10.5} bold={v !== 'F'} accent={v !== 'F'} opacity={v === 'F' ? 0.75 : 1}>
                {NAME[v]}
            </SketchText>
        </g>
    );
}

function Grid({ x, title, op }: { x: number; title: string; op: (a: V, b: V) => V }) {
    const cw = 86;
    return (
        <g>
            <SketchText x={x + 60 + (cw * 3) / 2} y={28} size={13} bold accent>
                {title}
            </SketchText>
            {VALUES.map((b, j) => (
                <SketchText key={`h${b}`} x={x + 60 + j * cw + cw / 2} y={58} size={10} bold opacity={0.7}>
                    {NAME[b]}
                </SketchText>
            ))}
            {VALUES.map((a, i) => (
                <g key={`r${a}`}>
                    <SketchText x={x + 52} y={88 + i * 40} size={10} bold anchor='end' opacity={0.7}>
                        {NAME[a]}
                    </SketchText>
                    {VALUES.map((b, j) => (
                        <Cell key={`${a}${b}`} x={x + 60 + j * cw} y={66 + i * 40} v={op(a, b)} />
                    ))}
                </g>
            ))}
        </g>
    );
}

/** AND, OR and NOT over TRUE, FALSE and UNKNOWN, the whole of three-valued logic in one picture. */
export function TruthTablesDiagram() {
    return (
        <Sketch
            label='Three-valued Logic: AND, OR, NOT'
            height={250}
            minWidth={980}
            viewBox='0 0 980 250'
            caption='বাঁ দিকের নাম প্রথম মান, উপরের নাম দ্বিতীয় মান। ভরাট ঘর TRUE, হালকা ঘর FALSE, দাগ কাটা ঘর UNKNOWN। চোখে পড়ার মতো দুটো জায়গা: FALSE AND UNKNOWN হলো FALSE, আর TRUE OR UNKNOWN হলো TRUE। অজানা মানটা যা-ই হোক, এই দুই উত্তর বদলায় না।'>
            <Grid x={10} title='AND' op={and} />
            <Grid x={390} title='OR' op={or} />
            <g>
                <SketchText x={880} y={28} size={13} bold accent>
                    NOT
                </SketchText>
                {VALUES.map((a, i) => (
                    <g key={`n${a}`}>
                        <SketchText x={836} y={88 + i * 40} size={10} bold anchor='end' opacity={0.7}>
                            {NAME[a]}
                        </SketchText>
                        <Cell x={844} y={66 + i * 40} v={a === 'T' ? 'F' : a === 'F' ? 'T' : 'U'} w={100} />
                    </g>
                ))}
            </g>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. WHERE এর দরজা: শুধু TRUE ভেতরে ঢোকে                                       */
/* ------------------------------------------------------------------------- */

/** The 15 customers meeting WHERE phone <> Rahim's number: 9 TRUE kept, 1 FALSE and 5 UNKNOWN dropped. */
export function WhereGateDiagram() {
    const lanes = [
        { y: 60, label: 'TRUE', count: '৯ জন', note: 'অন্য নম্বর আছে', keep: true },
        { y: 130, label: 'FALSE', count: '১ জন', note: 'Rahim নিজে', keep: false },
        { y: 200, label: 'UNKNOWN', count: '৫ জন', note: 'নম্বরই নেই', keep: false },
    ];
    return (
        <Sketch
            label='WHERE Keeps Only TRUE'
            height={280}
            minWidth={900}
            viewBox='0 0 900 280'
            caption="WHERE phone <> '+8801000000101' পনেরো জনের প্রত্যেকের জন্য একটা উত্তর বের করে। উত্তর TRUE হলে Row ফলাফলে যায়। FALSE আর UNKNOWN, দুটোই একই দরজায় আটকে যায়। তাই ফলাফলে আসে ৯ জন, ১৪ জন না।">
            <defs>
                <marker id='null-gate-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
                <marker id='null-gate-arrow-muted' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='currentColor' fillOpacity={0.5} />
                </marker>
            </defs>

            <rect x={20} y={95} width={150} height={80} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={95} y={128} size={12} bold>
                customers
            </SketchText>
            <SketchText x={95} y={150} size={11} body opacity={0.8}>
                ১৫ জন
            </SketchText>

            <line x1={172} y1={135} x2={238} y2={135} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#null-gate-arrow)' />

            <rect x={240} y={30} width={230} height={210} fill='var(--primary)' fillOpacity={0.05} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={355} y={22} size={11} bold accent>
                WHERE phone &lt;&gt; Rahim
            </SketchText>

            {lanes.map(lane => (
                <g key={lane.label}>
                    <SketchText x={258} y={lane.y + 5} size={11} bold anchor='start' accent={lane.label !== 'FALSE'}>
                        {lane.label}
                    </SketchText>
                    <SketchText x={258} y={lane.y + 24} size={10.5} body anchor='start' opacity={0.8}>
                        {`${lane.count}, ${lane.note}`}
                    </SketchText>
                    <line
                        x1={472}
                        y1={lane.y + 8}
                        x2={lane.keep ? 618 : 578}
                        y2={lane.y + 8}
                        stroke={lane.keep ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={lane.keep ? 1 : 0.45}
                        strokeWidth='1.3'
                        strokeDasharray={lane.keep ? undefined : '4 3'}
                        markerEnd={lane.keep ? 'url(#null-gate-arrow)' : 'url(#null-gate-arrow-muted)'}
                    />
                    {!lane.keep && (
                        <SketchText x={600} y={lane.y + 12} size={11} bold opacity={0.6}>
                            বাদ
                        </SketchText>
                    )}
                </g>
            ))}

            <rect x={620} y={38} width={250} height={60} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={745} y={64} size={12} bold accent>
                ফলাফল: ৯টা Row
            </SketchText>
            <SketchText x={745} y={84} size={10.5} body opacity={0.85}>
                শুধু TRUE ঢুকতে পেরেছে
            </SketchText>

            <SketchText x={745} y={185} size={11} body opacity={0.8}>
                বাদ পড়া ৬ জনের ৫ জনকে
            </SketchText>
            <SketchText x={745} y={205} size={11} body opacity={0.8}>
                কেউ বাদ দিতে চায়নি
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. NULL যেখানে ছোঁয়, সেখানে NULL                                             */
/* ------------------------------------------------------------------------- */

const SPREAD = [
    { expr: '12500 + NULL', result: 'NULL', spreads: true },
    { expr: 'NULL * 2', result: 'NULL', spreads: true },
    { expr: "'Rahim' || NULL", result: 'NULL', spreads: true },
    { expr: "concat('Rahim', NULL)", result: "'Rahim'", spreads: false },
    { expr: "concat_ws(' ', 'Rahim', NULL, 'Uddin')", result: "'Rahim Uddin'", spreads: false },
];

/** Operators pass NULL on; concat and concat_ws are built to skip it. */
export function NullSpreadDiagram() {
    return (
        <Sketch
            label='NULL Spreads Through Expressions'
            height={250}
            minWidth={760}
            viewBox='0 0 760 250'
            caption='যোগ, গুণ আর || এর মতো Operator এর একটা দিক অজানা হলে উত্তরও অজানা, তাই NULL ছড়িয়ে পড়ে। concat আর concat_ws Function দুটো ইচ্ছা করে NULL কে বাদ দিয়ে বাকিটা জোড়ে। MySQL এর CONCAT এ এই সুবিধা নেই, সেখানে উত্তর NULL।'>
            {SPREAD.map((row, i) => {
                const y = 30 + i * 42;
                return (
                    <g key={row.expr}>
                        <rect x={20} y={y} width={400} height={30} fill='transparent' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1' />
                        <SketchText x={34} y={y + 20} size={11.5} anchor='start'>
                            {row.expr}
                        </SketchText>
                        <SketchText x={460} y={y + 20} size={14} opacity={0.6}>
                            =
                        </SketchText>
                        <rect
                            x={500}
                            y={y}
                            width={160}
                            height={30}
                            fill={row.spreads ? 'transparent' : 'var(--primary)'}
                            fillOpacity={row.spreads ? 0 : 0.1}
                            stroke='var(--primary)'
                            strokeOpacity={row.spreads ? 0.8 : 1}
                            strokeDasharray={row.spreads ? '4 3' : undefined}
                            strokeWidth='1.1'
                        />
                        <SketchText x={580} y={y + 20} size={11.5} bold accent>
                            {row.result}
                        </SketchText>
                        <SketchText x={672} y={y + 20} size={10} body anchor='start' opacity={0.7}>
                            {row.spreads ? 'ছড়িয়েছে' : 'বাদ দিয়েছে'}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}
