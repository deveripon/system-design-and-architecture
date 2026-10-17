import { Sketch, SketchBox, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. একই দুই অক্ষর, দুই Type, দুই রকম আচরণ                                     */
/* ------------------------------------------------------------------------- */

const SAME_ROWS = [
    { op: "< '9'", text: 't (true)', number: 'f (false)', textNote: 'অক্ষর ধরে তুলনা, 4 আগে 9', numberNote: '42 বড়, 9 ছোট' },
    { op: '+ 1', text: 'ERROR', number: '43', textNote: 'text + integer নেই', numberNote: 'যোগ হয়' },
    { op: "|| '!'", text: '42!', number: '42!', textNote: 'জোড়া লাগে', numberNote: 'আগে text হয়, তারপর জোড়া' },
    { op: 'ORDER BY', text: '100, 42, 9', number: '9, 42, 100', textNote: 'প্রথম অক্ষর ধরে সাজায়', numberNote: 'মান ধরে সাজায়' },
];

/**
 * The same two characters behave like two different things depending on the
 * type they carry. Every value in the grid was run on PostgreSQL 18.
 */
export function SameCharactersDiagram() {
    const colX = [40, 260, 590];
    const rowY = (i: number) => 120 + i * 62;
    return (
        <Sketch
            label='Same Characters, Different Type'
            height={400}
            minWidth={860}
            viewBox='0 0 880 400'
            caption="বাঁদিকে লেখা '42', ডানদিকে সংখ্যা 42। দেখতে এক, কিন্তু PostgreSQL প্রতিটা কাজ করে Type দেখে। প্রতিটা ঘরের উত্তর আসল PostgreSQL 18 এ চালিয়ে নেওয়া।">
            <SketchText x={colX[0]} y={40} anchor='start' size={10} opacity={0.6}>
                কাজটা
            </SketchText>
            <SketchBox x={colX[1] - 10} y={22} w={290} h={52} title="'42'::text" sub='লেখা, অক্ষরের সারি' />
            <SketchBox x={colX[2] - 10} y={22} w={290} h={52} title="'42'::integer" sub='সংখ্যা, একটা মান' accent />
            {SAME_ROWS.map((row, i) => {
                const y = rowY(i);
                const textBad = row.text === 'ERROR';
                return (
                    <g key={row.op}>
                        <line x1={30} y1={y - 26} x2={870} y2={y - 26} stroke='currentColor' strokeOpacity={0.15} />
                        <SketchText x={colX[0]} y={y} anchor='start' size={12} bold>
                            {row.op}
                        </SketchText>
                        <SketchText x={colX[1]} y={y} anchor='start' size={12} bold accent={textBad}>
                            {row.text}
                        </SketchText>
                        <SketchText x={colX[1]} y={y + 18} anchor='start' size={10} body opacity={0.7}>
                            {row.textNote}
                        </SketchText>
                        <SketchText x={colX[2]} y={y} anchor='start' size={12} bold>
                            {row.number}
                        </SketchText>
                        <SketchText x={colX[2]} y={y + 18} anchor='start' size={10} body opacity={0.7}>
                            {row.numberNote}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন Type থেকে কোন Type এ PostgreSQL নিজে যায়, কোথায় আপনাকে বলতে হয়          */
/* ------------------------------------------------------------------------- */

type Node = { id: string; x: number; y: number; w: number; label: string; sub?: string };

const NODES: Node[] = [
    { id: 'smallint', x: 30, y: 60, w: 120, label: 'smallint' },
    { id: 'integer', x: 200, y: 60, w: 120, label: 'integer' },
    { id: 'bigint', x: 370, y: 60, w: 120, label: 'bigint' },
    { id: 'numeric', x: 200, y: 190, w: 120, label: 'numeric' },
    { id: 'double', x: 370, y: 190, w: 150, label: 'double precision' },
    { id: 'boolean', x: 30, y: 300, w: 120, label: 'boolean' },
    { id: 'date', x: 600, y: 60, w: 120, label: 'date' },
    { id: 'timestamp', x: 770, y: 60, w: 130, label: 'timestamp' },
    { id: 'timestamptz', x: 690, y: 190, w: 140, label: 'timestamptz' },
    { id: 'text', x: 390, y: 330, w: 140, label: 'text', sub: 'Quote এর ভেতরের লেখা' },
];

const BOX_H = 44;

/** Each arrow as start and end points; label position only on the dashed ones. */
const EDGES: { id: string; p: [number, number, number, number]; implicit: boolean; label?: string; lx?: number; ly?: number }[] = [
    { id: 'smallint-integer', p: [150, 82, 200, 82], implicit: true },
    { id: 'integer-bigint', p: [320, 82, 370, 82], implicit: true },
    { id: 'integer-numeric', p: [290, 104, 290, 190], implicit: true },
    { id: 'numeric-double', p: [320, 212, 370, 212], implicit: true },
    { id: 'date-timestamp', p: [720, 82, 770, 82], implicit: true },
    { id: 'date-timestamptz', p: [685, 104, 745, 190], implicit: true },
    { id: 'timestamp-timestamptz', p: [835, 104, 800, 190], implicit: true },
    { id: 'numeric-integer', p: [230, 190, 230, 104], implicit: false, label: 'Round হয়', lx: 150, ly: 152 },
    { id: 'timestamptz-date', p: [710, 190, 645, 104], implicit: false, label: 'TimeZone দেখে', lx: 560, ly: 152 },
    { id: 'boolean-integer', p: [90, 300, 214, 104], implicit: false, label: 'boolean ↔ integer, শুধু ::', lx: 30, ly: 362 },
    { id: 'text-numeric', p: [390, 352, 260, 234], implicit: false, label: 'লেখা ঠিক হলে, নইলে 22P02', lx: 175, ly: 312 },
    { id: 'text-timestamptz', p: [530, 352, 760, 234], implicit: false, label: 'লেখা ঠিক হলে, নইলে Error', lx: 650, ly: 332 },
];

/**
 * The casts PostgreSQL applies on its own (solid, from pg_cast with context
 * implicit) and the ones it only does when asked (dashed).
 */
export function CastMapDiagram() {
    return (
        <Sketch
            label='Cast Map: Implicit vs Explicit'
            height={430}
            minWidth={900}
            viewBox='0 0 920 430'
            caption='ভরাট দাগ: PostgreSQL নিজে থেকে বদলে নেয়, কারণ তাতে কিছু হারায় না (ছোট সংখ্যা বড় সংখ্যায়, তারিখ সময়সহ তারিখে)। ভাঙা দাগ: আপনাকে CAST বা :: লিখে চাইতে হয়, কারণ কিছু হারাতে পারে বা ভুল হতে পারে। তালিকাটা PostgreSQL 18 এর pg_cast Catalog থেকে নেওয়া।'>
            <defs>
                <marker id='cast-map-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
                <marker id='cast-map-arrow-muted' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='currentColor' fillOpacity={0.6} />
                </marker>
            </defs>
            <SketchText x={260} y={30} size={10} opacity={0.6}>
                সংখ্যার পরিবার
            </SketchText>
            <SketchText x={745} y={30} size={10} opacity={0.6}>
                সময়ের পরিবার
            </SketchText>
            {EDGES.map(edge => {
                const [x1, y1, x2, y2] = edge.p;
                return (
                    <g key={edge.id}>
                        <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={edge.implicit ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={edge.implicit ? 0.9 : 0.6}
                            strokeWidth='1.4'
                            strokeDasharray={edge.implicit ? undefined : '5 4'}
                            markerEnd={edge.implicit ? 'url(#cast-map-arrow)' : 'url(#cast-map-arrow-muted)'}
                        />
                        {edge.label && (
                            <SketchText x={edge.lx!} y={edge.ly!} anchor='start' size={9.5} body opacity={0.8}>
                                {edge.label}
                            </SketchText>
                        )}
                    </g>
                );
            })}
            {NODES.map(node => (
                <SketchBox
                    key={node.id}
                    x={node.x}
                    y={node.y}
                    w={node.w}
                    h={BOX_H}
                    title={node.label}
                    sub={node.sub}
                    accent={node.id === 'text'}
                />
            ))}
            <line x1={40} y1={405} x2={80} y2={405} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#cast-map-arrow)' />
            <SketchText x={90} y={409} anchor='start' size={10} body>
                নিজে থেকে (Implicit)
            </SketchText>
            <line x1={260} y1={405} x2={300} y2={405} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.4' strokeDasharray='5 4' markerEnd='url(#cast-map-arrow-muted)' />
            <SketchText x={310} y={409} anchor='start' size={10} body>
                চাইতে হয় (Explicit, CAST বা ::)
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. PostgreSQL নিজে করে, বনাম আপনাকে বলতে হয়                                  */
/* ------------------------------------------------------------------------- */

function SplitRows({ rows }: { rows: { sql: string; result: string; bad?: boolean }[] }) {
    return (
        <>
            {rows.map((row, i) => (
                <g key={row.sql}>
                    <SketchText x={10} y={34 + i * 58} anchor='start' size={11} bold>
                        {row.sql}
                    </SketchText>
                    <SketchText x={10} y={54 + i * 58} anchor='start' size={10} body accent={row.bad} opacity={row.bad ? 1 : 0.75}>
                        {row.result}
                    </SketchText>
                </g>
            ))}
        </>
    );
}

export function ImplicitExplicitSplit() {
    return (
        <SketchSplit
            label='Implicit vs Explicit'
            caption='বাঁদিকের তিনটায় PostgreSQL নিঃশব্দে মিলিয়ে নেয়, কারণ মানের কোনো ক্ষতি হয় না। ডানদিকের তিনটায় সে থেমে যায়, কারণ আন্দাজ করে বদলালে ভুল উত্তর আসতে পারত। প্রতিটা লাইন আসল PostgreSQL এ চালানো।'
            panels={[
                {
                    title: 'PostgreSQL নিজে মিলিয়ে নেয়',
                    sub: 'Implicit',
                    viewBox: '0 0 380 200',
                    height: 200,
                    minWidth: 320,
                    children: (
                        <SplitRows
                            rows={[
                                { sql: '1 + 1.5', result: 'integer বড় হয়ে numeric, উত্তর 2.5' },
                                { sql: "tour_id = '3'", result: "Quote এর '3' হয়ে যায় integer 3" },
                                { sql: "DATE '2026-11-01' + 3", result: 'তারিখই থাকে, উত্তর 2026-11-04' },
                            ]}
                        />
                    ),
                },
                {
                    title: 'আপনাকে বলতে হয়',
                    sub: 'Explicit',
                    viewBox: '0 0 380 200',
                    height: 200,
                    minWidth: 320,
                    children: (
                        <SplitRows
                            rows={[
                                { sql: 'phone = 8801000000101', result: 'ERROR: text = bigint নেই', bad: true },
                                { sql: "price_bdt LIKE '1%'", result: 'ERROR: numeric এ LIKE নেই', bad: true },
                                { sql: 'is_active = 1', result: 'ERROR: boolean = integer নেই', bad: true },
                            ]}
                        />
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Column এ Cast বনাম মানের দিকে সীমা: Index কে কী দেখায়                         */
/* ------------------------------------------------------------------------- */

export function CastInWhereDiagram() {
    const rows = Array.from({ length: 8 }, (_, i) => i);
    return (
        <Sketch
            label='Cast on the Column vs Range on the Value'
            height={360}
            minWidth={880}
            viewBox='0 0 900 360'
            caption='উপরে: booked_at::date লিখলে প্রতিটা Row এর booked_at আগে date এ বদলাতে হয়, তারপর তুলনা। booked_at এর উপর Index থাকলেও সে কাজে আসে না, কারণ Index সাজানো আছে booked_at ধরে, booked_at::date ধরে না। নিচে: একই প্রশ্ন সীমা দিয়ে লিখলে Column যেমন আছে তেমন থাকে, Index সরাসরি সেই জায়গায় লাফ দেয়। লেসনের Query বক্সে EXPLAIN এ দুটো Plan ই দেখানো আছে।'>
            <defs>
                <marker id='cast-where-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchText x={20} y={30} anchor='start' size={11} bold>
                {"WHERE booked_at::date = '2026-10-14'"}
            </SketchText>
            <SketchText x={20} y={48} anchor='start' size={10} body opacity={0.7}>
                প্রতিটা Row রূপান্তর, তারপর তুলনা: Seq Scan
            </SketchText>
            {rows.map(i => (
                <g key={`a${i}`}>
                    <rect x={20 + i * 52} y={66} width={44} height={26} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
                    <line x1={42 + i * 52} y1={92} x2={42 + i * 52} y2={118} stroke='currentColor' strokeOpacity={0.5} markerEnd='url(#cast-where-arrow)' />
                    <rect x={20 + i * 52} y={122} width={44} height={26} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeOpacity={0.6} />
                    <SketchText x={42 + i * 52} y={139} size={9}>
                        ::date
                    </SketchText>
                </g>
            ))}
            <SketchText x={460} y={100} anchor='start' size={10} body>
                ২৪টা Row থাকলে ২৪বার, লাখ Row থাকলে লাখবার
            </SketchText>

            <line x1={20} y1={180} x2={880} y2={180} stroke='currentColor' strokeOpacity={0.2} />

            <SketchText x={20} y={212} anchor='start' size={11} bold>
                {"WHERE booked_at >= '2026-10-14' AND booked_at < '2026-10-15'"}
            </SketchText>
            <SketchText x={20} y={230} anchor='start' size={10} body opacity={0.7}>
                সীমা একবারই হিসাব হয়, Index সেখানে সরাসরি পৌঁছায়: Index Scan
            </SketchText>
            <rect x={20} y={250} width={416} height={30} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
            {rows.map(i => (
                <line key={`b${i}`} x1={20 + i * 52} y1={250} x2={20 + i * 52} y2={280} stroke='currentColor' strokeOpacity={0.25} />
            ))}
            <rect x={280} y={250} width={52} height={30} fill='var(--primary)' fillOpacity={0.15} stroke='var(--primary)' />
            <path d='M 560 320 C 460 320 330 320 306 286' fill='none' stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#cast-where-arrow)' />
            <SketchText x={570} y={324} anchor='start' size={10} body>
                Index: সাজানো booked_at, সরাসরি 14 অক্টোবরে
            </SketchText>
        </Sketch>
    );
}
