import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Shared bits                                                               */
/* ------------------------------------------------------------------------- */

function ArrowMarker({ scope }: { scope: string }) {
    return (
        <defs>
            <marker
                id={`dbkinds-${scope}-arrow`}
                markerWidth={8}
                markerHeight={8}
                refX={7}
                refY={3.5}
                orient='auto'
                markerUnits='userSpaceOnUse'>
                <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
            </marker>
            <marker
                id={`dbkinds-${scope}-arrow-muted`}
                markerWidth={8}
                markerHeight={8}
                refX={7}
                refY={3.5}
                orient='auto'
                markerUnits='userSpaceOnUse'>
                <path d='M0,0 L7,3.5 L0,7 Z' fill='currentColor' fillOpacity={0.55} />
            </marker>
        </defs>
    );
}

function Cell({
    x,
    y,
    w,
    h,
    accent,
    faint,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    accent?: boolean;
    faint?: boolean;
}) {
    return (
        <rect
            x={x}
            y={y}
            width={w}
            height={h}
            fill={accent ? 'var(--primary)' : 'currentColor'}
            fillOpacity={accent ? 0.16 : faint ? 0.02 : 0.05}
            stroke={accent ? 'var(--primary)' : 'currentColor'}
            strokeOpacity={accent ? 0.9 : 0.4}
            strokeWidth='1'
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 1. নয় রকম Data এর নয়টা চেহারা                                             */
/* ------------------------------------------------------------------------- */

const SHAPES: { title: string; line: string }[] = [
    { title: 'Relational', line: 'সারি আর কলামের Table, Key দিয়ে জোড়া' },
    { title: 'Document', line: 'একটা জিনিসের সব তথ্য এক Document এ' },
    { title: 'Key-Value', line: 'চাবি দিলে মান, আর কিছু না' },
    { title: 'Wide-column', line: 'প্রতিটা Row এ যত খুশি Column' },
    { title: 'Graph', line: 'বিন্দু আর তাদের মধ্যের সম্পর্ক' },
    { title: 'Time-series', line: 'সময়ের সাথে আসতে থাকা মাপ' },
    { title: 'Search', line: 'শব্দ থেকে কোন কোন লেখায় আছে' },
    { title: 'Vector', line: 'অর্থ সংখ্যায়, কাছাকাছি মানে মিল' },
    { title: 'Columnar', line: 'Column ধরে রাখা, Report এর জন্য' },
];

function MiniRelational({ x, y }: { x: number; y: number }) {
    const cells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
            cells.push(<Cell key={`a${r}${c}`} x={x + c * 34} y={y + r * 18} w={34} h={18} accent={r === 0} />);
        }
    }
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
            cells.push(<Cell key={`b${r}${c}`} x={x + 150 + c * 34} y={y + 30 + r * 18} w={34} h={18} accent={r === 0} />);
        }
    }
    return (
        <g>
            {cells}
            <path
                d={`M ${x + 102} ${y + 45} H ${x + 126} V ${y + 57} H ${x + 150}`}
                fill='none'
                stroke='var(--primary)'
                strokeWidth='1.3'
            />
        </g>
    );
}

function MiniDocument({ x, y }: { x: number; y: number }) {
    return (
        <g>
            <rect x={x} y={y} width={240} height={104} fill='none' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            <SketchText x={x + 12} y={y + 18} anchor='start' size={9}>
                title, price_bdt
            </SketchText>
            <rect x={x + 12} y={y + 30} width={216} height={64} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1' />
            <SketchText x={x + 22} y={y + 46} anchor='start' size={9} accent>
                {'days: [ ]'}
            </SketchText>
            <Cell x={x + 22} y={y + 56} w={90} h={28} accent />
            <Cell x={x + 124} y={y + 56} w={90} h={28} accent />
            <SketchText x={x + 67} y={y + 74} size={9}>
                day 1
            </SketchText>
            <SketchText x={x + 169} y={y + 74} size={9}>
                day 2
            </SketchText>
        </g>
    );
}

function MiniKeyValue({ x, y }: { x: number; y: number }) {
    const pairs = [
        ['session:7f3a', '{ customer: 1 }'],
        ['cart:2', '{ seats: 2 }'],
        ['tours:active', '[ ... ]'],
    ];
    return (
        <g>
            {pairs.map(([key, value], i) => {
                const ry = y + i * 36;
                return (
                    <g key={key}>
                        <Cell x={x} y={ry} w={104} h={26} accent />
                        <SketchText x={x + 52} y={ry + 17} size={9}>
                            {key}
                        </SketchText>
                        <line x1={x + 108} y1={ry + 13} x2={x + 134} y2={ry + 13} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#dbkinds-data-shapes-arrow)' />
                        <Cell x={x + 140} y={ry} w={104} h={26} />
                        <SketchText x={x + 192} y={ry + 17} size={9}>
                            {value}
                        </SketchText>
                    </g>
                );
            })}
        </g>
    );
}

function MiniWideColumn({ x, y }: { x: number; y: number }) {
    const counts = [6, 2, 8];
    return (
        <g>
            {counts.map((count, r) => {
                const ry = y + r * 34;
                return (
                    <g key={r}>
                        <Cell x={x} y={ry} w={48} h={22} accent />
                        {Array.from({ length: count }, (_, c) => (
                            <Cell key={c} x={x + 52 + c * 24} y={ry} w={22} h={22} />
                        ))}
                    </g>
                );
            })}
            <SketchText x={x} y={y + 112} anchor='start' size={8.5} opacity={0.7}>
                partition key, then any columns
            </SketchText>
        </g>
    );
}

function MiniGraph({ x, y }: { x: number; y: number }) {
    const nodes: [number, number][] = [
        [x + 30, y + 22],
        [x + 120, y + 10],
        [x + 214, y + 40],
        [x + 70, y + 92],
        [x + 176, y + 96],
    ];
    const edges: [number, number][] = [
        [0, 1],
        [1, 2],
        [0, 3],
        [3, 4],
        [1, 4],
        [2, 4],
    ];
    return (
        <g>
            {edges.map(([a, b]) => (
                <line
                    key={`${a}-${b}`}
                    x1={nodes[a][0]}
                    y1={nodes[a][1]}
                    x2={nodes[b][0]}
                    y2={nodes[b][1]}
                    stroke='currentColor'
                    strokeOpacity={0.5}
                    strokeWidth='1.2'
                />
            ))}
            {nodes.map(([cx, cy], i) => (
                <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={11}
                    fill={i === 1 ? 'var(--primary)' : 'var(--card)'}
                    fillOpacity={i === 1 ? 0.3 : 1}
                    stroke={i === 1 ? 'var(--primary)' : 'currentColor'}
                    strokeOpacity={i === 1 ? 1 : 0.6}
                    strokeWidth='1.3'
                />
            ))}
        </g>
    );
}

function MiniTimeSeries({ x, y }: { x: number; y: number }) {
    const values = [60, 52, 66, 40, 48, 30, 44, 26, 38, 20, 34];
    const points = values.map((v, i) => [x + i * 23, y + v] as const);
    return (
        <g>
            <line x1={x} y1={y + 100} x2={x + 240} y2={y + 100} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1' />
            <polyline
                points={points.map(([px, py]) => `${px},${py}`).join(' ')}
                fill='none'
                stroke='var(--primary)'
                strokeWidth='1.4'
            />
            {points.map(([px, py], i) => (
                <circle key={i} cx={px} cy={py} r={2.6} fill='var(--primary)' />
            ))}
            <SketchText x={x + 240} y={y + 114} anchor='end' size={8.5} opacity={0.7}>
                time →
            </SketchText>
        </g>
    );
}

function MiniSearch({ x, y }: { x: number; y: number }) {
    const rows = [
        ['saint', '1, 8'],
        ['martin', '1, 8'],
        ['beach', '2'],
        ['trek', '5'],
    ];
    return (
        <g>
            {rows.map(([word, ids], i) => {
                const ry = y + i * 26;
                return (
                    <g key={word}>
                        <Cell x={x} y={ry} w={84} h={20} accent />
                        <SketchText x={x + 42} y={ry + 14} size={9}>
                            {word}
                        </SketchText>
                        <line x1={x + 88} y1={ry + 10} x2={x + 128} y2={ry + 10} stroke='var(--primary)' strokeWidth='1.1' markerEnd='url(#dbkinds-data-shapes-arrow)' />
                        <Cell x={x + 134} y={ry} w={84} h={20} />
                        <SketchText x={x + 176} y={ry + 14} size={9}>
                            {ids}
                        </SketchText>
                    </g>
                );
            })}
        </g>
    );
}

function MiniVector({ x, y }: { x: number; y: number }) {
    const points: [number, number][] = [
        [x + 30, y + 24],
        [x + 50, y + 40],
        [x + 22, y + 52],
        [x + 160, y + 20],
        [x + 182, y + 36],
        [x + 200, y + 18],
        [x + 120, y + 88],
        [x + 142, y + 100],
    ];
    return (
        <g>
            <circle cx={x + 134} cy={y + 90} r={30} fill='none' stroke='var(--primary)' strokeDasharray='4 3' strokeWidth='1.1' />
            {points.map(([px, py], i) => (
                <circle key={i} cx={px} cy={py} r={5} fill='currentColor' fillOpacity={0.35} />
            ))}
            <path
                d={`M ${x + 128} ${y + 76} l 4 8 l 9 1 l -7 6 l 2 9 l -8 -5 l -8 5 l 2 -9 l -7 -6 l 9 -1 Z`}
                fill='var(--primary)'
            />
        </g>
    );
}

function MiniColumnar({ x, y }: { x: number; y: number }) {
    const labels = ['id', 'date', 'amount', 'city'];
    return (
        <g>
            {labels.map((label, c) => (
                <g key={label}>
                    {Array.from({ length: 5 }, (_, r) => (
                        <Cell key={r} x={x + c * 60} y={y + r * 18} w={44} h={18} accent={c === 2} />
                    ))}
                    <SketchText x={x + c * 60 + 22} y={y + 106} size={8.5} accent={c === 2}>
                        {label}
                    </SketchText>
                </g>
            ))}
        </g>
    );
}

const MINIS = [
    MiniRelational,
    MiniDocument,
    MiniKeyValue,
    MiniWideColumn,
    MiniGraph,
    MiniTimeSeries,
    MiniSearch,
    MiniVector,
    MiniColumnar,
];

export function DataShapesDiagram() {
    return (
        <Sketch
            label='নয় রকম Database, নয় রকম Data এর চেহারা'
            height={640}
            minWidth={900}
            viewBox='0 0 950 640'
            caption='প্রতিটা ঘর একটা Database পরিবার। নামটা আসে সে Data কে কোন আকারে রাখে তা থেকে, আর সেই আকারই ঠিক করে দেয় কোন প্রশ্নের উত্তর সে সবচেয়ে দ্রুত দিতে পারবে। এই লেসনে একটা একটা করে প্রতিটা ঘরের ভেতরে ঢুকবেন।'>
            <ArrowMarker scope='data-shapes' />
            {SHAPES.map((shape, i) => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                const x0 = 10 + col * 312;
                const y0 = 10 + row * 210;
                const Mini = MINIS[i];
                return (
                    <g key={shape.title}>
                        <rect x={x0} y={y0} width={300} height={198} fill='none' stroke='currentColor' strokeOpacity={0.18} strokeWidth='1' />
                        <SketchText x={x0 + 14} y={y0 + 24} anchor='start' size={11.5} bold accent>
                            {shape.title}
                        </SketchText>
                        <Mini x={x0 + 26} y={y0 + 42} />
                        <SketchText x={x0 + 14} y={y0 + 184} anchor='start' size={10.5} body>
                            {shape.line}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. একই ট্যুর, তিনটা Table নাকি একটা Document                              */
/* ------------------------------------------------------------------------- */

function TinyTable({
    x,
    y,
    name,
    columns,
    rows,
    widths,
}: {
    x: number;
    y: number;
    name: string;
    columns: string[];
    rows: string[][];
    widths: number[];
}) {
    const total = widths.reduce((a, b) => a + b, 0);
    const xs = widths.map((_, i) => x + widths.slice(0, i).reduce((a, b) => a + b, 0));
    return (
        <g>
            <SketchText x={x} y={y - 6} anchor='start' size={10} bold accent>
                {name}
            </SketchText>
            <rect x={x} y={y} width={total} height={20} fill='var(--primary)' fillOpacity={0.12} stroke='currentColor' strokeOpacity={0.4} />
            {columns.map((col, i) => (
                <SketchText key={col} x={xs[i] + 6} y={y + 14} anchor='start' size={8.5} bold>
                    {col}
                </SketchText>
            ))}
            {rows.map((row, r) => (
                <g key={r}>
                    <rect x={x} y={y + 20 + r * 20} width={total} height={20} fill='none' stroke='currentColor' strokeOpacity={0.3} />
                    {row.map((value, i) => (
                        <SketchText key={i} x={xs[i] + 6} y={y + 34 + r * 20} anchor='start' size={8.5}>
                            {value}
                        </SketchText>
                    ))}
                </g>
            ))}
        </g>
    );
}

const JSON_LINES: [number, string][] = [
    [0, '{'],
    [1, '"title": "Saint Martin Island Escape",'],
    [1, '"price_bdt": 12500,'],
    [1, '"days": ['],
    [2, '{ "day": 1, "plan": "Ship from Teknaf" },'],
    [2, '{ "day": 2, "plan": "Snorkelling at Chera Dwip" },'],
    [2, '{ "day": 3, "plan": "Sunrise walk, ship back" }'],
    [1, '],'],
    [1, '"photos": ["jetty.jpg", "sunset.jpg"]'],
    [0, '}'],
];

export function TourAsTablesOrDocumentSplit() {
    return (
        <SketchSplit
            label='একই ট্যুর, দুই রকম করে রাখা'
            caption='বাঁয়ে Relational ধরন: ট্যুর, তার দিনগুলো আর তার ছবি তিনটা আলাদা Table এ, tour_id দিয়ে জোড়া। ডানে Document ধরন: পুরো ট্যুরটা একটা Document এ, দিনগুলো তার ভেতরেই একটা তালিকা। Page দেখানোর সময় ডানেরটা একবারে পুরোটা দিয়ে দেয়। আবার সব ট্যুরের দ্বিতীয় দিনের Plan খুঁজতে বাঁয়েরটা অনেক সহজ।'
            panels={[
                {
                    title: 'Relational',
                    sub: 'তিনটা Table, Key দিয়ে জোড়া',
                    viewBox: '0 0 440 330',
                    height: 330,
                    minWidth: 400,
                    children: (
                        <g>
                            <TinyTable
                                x={10}
                                y={24}
                                name='tours'
                                columns={['tour_id', 'title', 'price_bdt']}
                                rows={[['1', 'Saint Martin Island Escape', '12500.00']]}
                                widths={[56, 190, 70]}
                            />
                            <TinyTable
                                x={10}
                                y={112}
                                name='tour_days'
                                columns={['tour_id', 'day', 'plan']}
                                rows={[
                                    ['1', '1', 'Ship from Teknaf'],
                                    ['1', '2', 'Snorkelling at Chera Dwip'],
                                    ['1', '3', 'Sunrise walk, ship back'],
                                ]}
                                widths={[56, 40, 220]}
                            />
                            <TinyTable
                                x={10}
                                y={240}
                                name='tour_photos'
                                columns={['tour_id', 'file']}
                                rows={[
                                    ['1', 'jetty.jpg'],
                                    ['1', 'sunset.jpg'],
                                ]}
                                widths={[56, 120]}
                            />
                            <path d='M 330 54 H 360 V 142 H 330' fill='none' stroke='var(--primary)' strokeWidth='1.2' />
                            <path d='M 360 142 V 270 H 190' fill='none' stroke='var(--primary)' strokeWidth='1.2' />
                            <SketchText x={366} y={100} anchor='start' size={9} accent>
                                tour_id
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'Document',
                    sub: 'একটা Document, ভেতরে তালিকা',
                    viewBox: '0 0 440 330',
                    height: 330,
                    minWidth: 400,
                    children: (
                        <g>
                            <rect x={8} y={16} width={424} height={296} fill='var(--primary)' fillOpacity={0.04} stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1.2' />
                            {JSON_LINES.map(([indent, text], i) => (
                                <SketchText key={i} x={24 + indent * 18} y={46 + i * 26} anchor='start' size={10} accent={indent === 2}>
                                    {text}
                                </SketchText>
                            ))}
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Key-Value: চাবি দিলে মান                                                */
/* ------------------------------------------------------------------------- */

const KV_PAIRS: { key: string; value: string; note: string }[] = [
    { key: 'session:7f3a9c', value: '{ "customer_id": 1 }', note: 'কে Login করে আছেন' },
    { key: 'cart:customer:2', value: '{ "departure_id": 8, "seats": 2 }', note: 'ঝুড়িতে কী রাখা' },
    { key: 'cache:tours:active', value: '[ চালু ৮টা ট্যুরের তালিকা ]', note: 'বারবার লাগে এমন উত্তর' },
    { key: 'ratelimit:203.0.113.25', value: '17', note: 'এই মিনিটে কতবার এসেছে' },
];

export function KeyValueDiagram() {
    return (
        <Sketch
            label='Key-Value: চাবি দিলে মান'
            height={330}
            minWidth={820}
            viewBox='0 0 880 330'
            caption='Key-Value Store এর কাছে প্রশ্ন একটাই: এই Key এর মান কী? উত্তর আসে চোখের পলকে, কারণ সে Data রাখে Memory তে আর সরাসরি Key ধরে খোঁজে। কিন্তু ঢাকার সব Session কোনগুলো, এমন প্রশ্ন সে বোঝে না, কারণ Value এর ভেতরে কী আছে সেটা সে খুলেও দেখে না।'>
            <ArrowMarker scope='key-value' />
            <SketchText x={40} y={30} anchor='start' size={10} bold opacity={0.7}>
                KEY
            </SketchText>
            <SketchText x={400} y={30} anchor='start' size={10} bold opacity={0.7}>
                VALUE
            </SketchText>
            {KV_PAIRS.map((pair, i) => {
                const y = 46 + i * 66;
                return (
                    <g key={pair.key}>
                        <rect x={40} y={y} width={290} height={40} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.2' />
                        <SketchText x={56} y={y + 25} anchor='start' size={11}>
                            {pair.key}
                        </SketchText>
                        <line x1={336} y1={y + 20} x2={392} y2={y + 20} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#dbkinds-key-value-arrow)' />
                        <rect x={400} y={y} width={300} height={40} fill='none' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
                        <SketchText x={414} y={y + 25} anchor='start' size={pair.value.startsWith('[ চ') ? 11 : 10.5} body={pair.value.startsWith('[ চ')}>
                            {pair.value}
                        </SketchText>
                        <SketchText x={716} y={y + 25} anchor='start' size={10.5} body opacity={0.8}>
                            {pair.note}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Graph: Saint Martin এ যাঁরা গেছেন, তাঁরা আর কোথায় গেছেন                 */
/* ------------------------------------------------------------------------- */

const GRAPH_PEOPLE: { name: string; y: number; onward: boolean }[] = [
    { name: 'Rahim Uddin', y: 50, onward: true },
    { name: 'Nusrat Jahan', y: 115, onward: false },
    { name: 'Tanvir Ahmed', y: 180, onward: false },
    { name: 'Oliver Bennett', y: 245, onward: true },
    { name: 'Kamal Hasan', y: 310, onward: false },
];

const GRAPH_ONWARD: { title: string; y: number; from: string }[] = [
    { title: 'Sajek Valley Cloud Trip', y: 60, from: 'Rahim Uddin' },
    { title: 'Sundarbans Mangrove Cruise', y: 140, from: 'Rahim Uddin' },
    { title: 'Bandarban Hill Trek', y: 250, from: 'Oliver Bennett' },
];

export function TourGraphDiagram() {
    const start = { x: 130, y: 180 };
    const personX = 420;
    const tourX = 700;
    return (
        <Sketch
            label='Graph: সম্পর্ক ধরে হাঁটা'
            height={380}
            minWidth={860}
            viewBox='0 0 900 380'
            caption='Island Tours এর আসল Booking থেকে আঁকা। প্রশ্ন: Saint Martin Island Escape এ যাঁরা বুক করেছেন, তাঁরা আর কোন কোন ট্যুরে গেছেন? Graph Database এ এটা দুই ধাপের হাঁটা: ট্যুর থেকে মানুষে, মানুষ থেকে অন্য ট্যুরে। উত্তর তিনটা ট্যুর। Oliver এর Saint Martin এর Booking টা পরে cancelled হয়েছিল, কিন্তু সম্পর্কটা Data তে থেকে গেছে।'>
            <ArrowMarker scope='tour-graph' />
            <SketchText x={start.x} y={26} size={9.5} bold opacity={0.7}>
                TOUR
            </SketchText>
            <SketchText x={personX} y={26} size={9.5} bold opacity={0.7}>
                CUSTOMER
            </SketchText>
            <SketchText x={tourX} y={26} size={9.5} bold opacity={0.7}>
                OTHER TOURS
            </SketchText>
            {GRAPH_PEOPLE.map(person => (
                <line
                    key={`e1-${person.name}`}
                    x1={personX - 70}
                    y1={person.y}
                    x2={start.x + 92}
                    y2={start.y}
                    stroke={person.onward ? 'var(--primary)' : 'currentColor'}
                    strokeOpacity={person.onward ? 0.9 : 0.4}
                    strokeWidth='1.3'
                    markerEnd={person.onward ? 'url(#dbkinds-tour-graph-arrow)' : 'url(#dbkinds-tour-graph-arrow-muted)'}
                />
            ))}
            {GRAPH_ONWARD.map(tour => {
                const person = GRAPH_PEOPLE.find(p => p.name === tour.from)!;
                return (
                    <line
                        key={`e2-${tour.title}`}
                        x1={personX + 70}
                        y1={person.y}
                        x2={tourX - 104}
                        y2={tour.y}
                        stroke='var(--primary)'
                        strokeWidth='1.3'
                        markerEnd='url(#dbkinds-tour-graph-arrow)'
                    />
                );
            })}
            <SketchText x={270} y={92} size={9} accent>
                BOOKED
            </SketchText>
            <SketchText x={560} y={86} size={9} accent>
                BOOKED
            </SketchText>

            <rect x={start.x - 92} y={start.y - 26} width={184} height={52} rx={26} fill='var(--primary)' fillOpacity={0.18} stroke='var(--primary)' strokeWidth='1.4' />
            <SketchText x={start.x} y={start.y - 2} size={10} bold accent>
                Saint Martin
            </SketchText>
            <SketchText x={start.x} y={start.y + 13} size={10} bold accent>
                Island Escape
            </SketchText>

            {GRAPH_PEOPLE.map(person => (
                <g key={person.name}>
                    <rect
                        x={personX - 70}
                        y={person.y - 17}
                        width={140}
                        height={34}
                        rx={17}
                        fill={person.onward ? 'var(--primary)' : 'var(--card)'}
                        fillOpacity={person.onward ? 0.14 : 1}
                        stroke={person.onward ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={person.onward ? 1 : 0.5}
                        strokeWidth='1.2'
                    />
                    <SketchText x={personX} y={person.y + 4} size={10} accent={person.onward}>
                        {person.name}
                    </SketchText>
                </g>
            ))}

            {GRAPH_ONWARD.map(tour => (
                <g key={tour.title}>
                    <rect x={tourX - 104} y={tour.y - 17} width={208} height={34} rx={17} fill='var(--primary)' fillOpacity={0.14} stroke='var(--primary)' strokeWidth='1.2' />
                    <SketchText x={tourX} y={tour.y + 4} size={10} accent>
                        {tour.title}
                    </SketchText>
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. Search: বইয়ের পেছনের নির্ঘণ্ট                                            */
/* ------------------------------------------------------------------------- */

const SEARCH_TITLES = [
    [1, 'Saint Martin Island Escape'],
    [2, "Cox's Bazar Beach Weekend"],
    [4, 'Sajek Valley Cloud Trip'],
    [5, 'Bandarban Hill Trek'],
    [7, 'Ratargul Swamp Boat Day'],
    [8, 'Saint Martin Luxury Stay'],
    [9, "Cox's Bazar Family Package"],
] as const;

const SEARCH_INDEX = [
    ['bazar', '2, 9'],
    ['beach', '2'],
    ['island', '1'],
    ['martin', '1, 8'],
    ['saint', '1, 8'],
    ['swamp', '7'],
    ['trek', '5'],
    ['valley', '4'],
] as const;

export function InvertedIndexDiagram() {
    return (
        <Sketch
            label='Search Engine এর ভেতরের নির্ঘণ্ট'
            height={380}
            minWidth={860}
            viewBox='0 0 900 380'
            caption='বইয়ের শেষে যে নির্ঘণ্ট থাকে, শব্দ আর তার পাশে পাতার নম্বর, Search Engine ঠিক সেটাই বানায়, যার নাম Inverted Index। কেউ saint martin লিখলে সে প্রতিটা Row পড়ে না। শুধু দুটো শব্দের লাইন খুলে দেখে, দুই লাইনেই আছে ১ আর ৮, উত্তর এই দুটো ট্যুর। ভুল বানান sant এর জন্য সে কাছাকাছি শব্দ saint ও খুঁজে দেখতে পারে।'>
            <ArrowMarker scope='inverted-index' />
            <SketchText x={30} y={28} anchor='start' size={9.5} bold opacity={0.7}>
                DOCUMENTS (tour_id, title)
            </SketchText>
            {SEARCH_TITLES.map(([id, title], i) => (
                <g key={id}>
                    <rect x={30} y={40 + i * 44} width={250} height={32} fill='none' stroke='currentColor' strokeOpacity={0.4} />
                    <SketchText x={44} y={61 + i * 44} anchor='start' size={10} bold accent={id === 1 || id === 8}>
                        {String(id)}
                    </SketchText>
                    <SketchText x={64} y={61 + i * 44} anchor='start' size={10}>
                        {title}
                    </SketchText>
                </g>
            ))}

            <line x1={292} y1={190} x2={348} y2={190} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#dbkinds-inverted-index-arrow)' />
            <SketchText x={320} y={180} size={9} accent>
                index
            </SketchText>

            <SketchText x={360} y={28} anchor='start' size={9.5} bold opacity={0.7}>
                WORD
            </SketchText>
            <SketchText x={480} y={28} anchor='start' size={9.5} bold opacity={0.7}>
                TOURS
            </SketchText>
            {SEARCH_INDEX.map(([word, ids], i) => {
                const hit = word === 'saint' || word === 'martin';
                return (
                    <g key={word}>
                        <rect x={360} y={40 + i * 38} width={100} height={28} fill={hit ? 'var(--primary)' : 'none'} fillOpacity={hit ? 0.14 : 0} stroke={hit ? 'var(--primary)' : 'currentColor'} strokeOpacity={hit ? 1 : 0.4} />
                        <SketchText x={410} y={59 + i * 38} size={10} accent={hit}>
                            {word}
                        </SketchText>
                        <rect x={470} y={40 + i * 38} width={80} height={28} fill='none' stroke={hit ? 'var(--primary)' : 'currentColor'} strokeOpacity={hit ? 1 : 0.4} />
                        <SketchText x={510} y={59 + i * 38} size={10} accent={hit}>
                            {ids}
                        </SketchText>
                    </g>
                );
            })}

            <line x1={560} y1={210} x2={640} y2={210} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#dbkinds-inverted-index-arrow)' />
            <rect x={650} y={150} width={220} height={120} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={760} y={176} size={10} bold accent>
                query: saint martin
            </SketchText>
            <SketchText x={760} y={204} size={10}>
                saint → 1, 8
            </SketchText>
            <SketchText x={760} y={224} size={10}>
                martin → 1, 8
            </SketchText>
            <SketchText x={760} y={252} size={10.5} bold accent>
                result: 1, 8
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 6. Vector: অর্থের মানচিত্র                                                  */
/* ------------------------------------------------------------------------- */

const MEANING_POINTS: { title: string; x: number; y: number; near?: boolean }[] = [
    { title: 'Saint Martin Island Escape', x: 140, y: 80 },
    { title: 'Saint Martin Luxury Stay', x: 210, y: 120 },
    { title: "Cox's Bazar Beach Weekend", x: 120, y: 160 },
    { title: "Cox's Bazar Family Package", x: 220, y: 190 },
    { title: 'Sajek Valley Cloud Trip', x: 640, y: 80 },
    { title: 'Bandarban Hill Trek', x: 720, y: 140 },
    { title: 'Sylhet Tea Garden Tour', x: 560, y: 250 },
    { title: 'Sundarbans Mangrove Cruise', x: 420, y: 300, near: true },
    { title: 'Ratargul Swamp Boat Day', x: 500, y: 330, near: true },
];

export function MeaningMapDiagram() {
    const query = { x: 455, y: 285 };
    return (
        <Sketch
            label='Vector: অর্থের মানচিত্র'
            height={400}
            minWidth={860}
            viewBox='0 0 900 400'
            caption='প্রতিটা ট্যুরের বর্ণনাকে একটা AI Model কয়েকশো বা কয়েক হাজার সংখ্যার একটা তালিকায় বদলায়, যার নাম Embedding। এখানে বোঝার সুবিধার জন্য মাত্র দুটো সংখ্যায়, মানে একটা সমতলে আঁকা। একই রকম অর্থের ট্যুর কাছাকাছি বসে। কেউ লিখলেন, শান্ত, সবুজ, পানির ধারে। কোনো ট্যুরের নামে এই শব্দগুলো নেই, তবু তারকাটার সবচেয়ে কাছের দুটো বিন্দু Sundarbans আর Ratargul। Vector Database এই কাছের প্রতিবেশী খোঁজার কাজটাই দ্রুত করে।'>
            <rect x={20} y={20} width={860} height={360} fill='none' stroke='currentColor' strokeOpacity={0.15} />
            <SketchText x={170} y={44} size={10.5} body opacity={0.7}>
                সমুদ্র আর সৈকত
            </SketchText>
            <SketchText x={680} y={44} size={10.5} body opacity={0.7}>
                পাহাড় আর মেঘ
            </SketchText>
            <SketchText x={300} y={360} size={10.5} body opacity={0.7}>
                বন, পানি আর সবুজ
            </SketchText>
            <circle cx={query.x} cy={query.y} r={70} fill='var(--primary)' fillOpacity={0.05} stroke='var(--primary)' strokeDasharray='5 4' strokeWidth='1.2' />
            {MEANING_POINTS.map(point => (
                <g key={point.title}>
                    <circle cx={point.x} cy={point.y} r={6} fill={point.near ? 'var(--primary)' : 'currentColor'} fillOpacity={point.near ? 0.9 : 0.45} />
                    <SketchText x={point.x + 12} y={point.y + 4} anchor='start' size={9.5} accent={point.near} opacity={point.near ? 1 : 0.85}>
                        {point.title}
                    </SketchText>
                </g>
            ))}
            <path
                d={`M ${query.x} ${query.y - 13} l 4 9 l 10 1 l -8 7 l 2 10 l -8 -5 l -8 5 l 2 -10 l -8 -7 l 10 -1 Z`}
                fill='var(--primary)'
            />
            <SketchText x={query.x - 14} y={query.y - 20} anchor='end' size={10.5} body accent>
                শান্ত, সবুজ, পানির ধারে
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 7. একটা মূল Database, পাশে কয়েকটা সাহায্যকারী                            */
/* ------------------------------------------------------------------------- */

function Node({
    x,
    y,
    w,
    title,
    sub,
    accent,
    dashed,
}: {
    x: number;
    y: number;
    w: number;
    title: string;
    sub: string;
    accent?: boolean;
    dashed?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={60}
                fill={accent ? 'var(--primary)' : 'var(--card)'}
                fillOpacity={accent ? 0.14 : 1}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 1 : 0.5}
                strokeWidth='1.3'
                strokeDasharray={dashed ? '5 4' : undefined}
            />
            <SketchText x={x + w / 2} y={y + 25} size={11} bold accent={accent}>
                {title}
            </SketchText>
            <SketchText x={x + w / 2} y={y + 45} size={10} body opacity={0.85}>
                {sub}
            </SketchText>
        </g>
    );
}

export function PolyglotDiagram() {
    return (
        <Sketch
            label='একটা মূল Database, পাশে কয়েকটা সাহায্যকারী'
            height={380}
            minWidth={880}
            viewBox='0 0 920 380'
            caption='বড় হতে থাকা প্রায় প্রতিটা App এ দেখবেন একটা Database থাকে আসল হিসাবের মালিক, যাকে বলে Source of Truth। Island Tours এ সেটা PostgreSQL। Redis শুধু দ্রুত পড়ার জন্য কপি রাখে। ডটেড বাক্স দুটো ভবিষ্যতের: দরকার হলে Search Engine আর Warehouse আসবে, আর দুটোই Data পাবে PostgreSQL থেকে কপি হয়ে। কপি হারালে আবার বানানো যায়, Source of Truth হারালে যায় না।'>
            <ArrowMarker scope='polyglot' />
            <Node x={20} y={150} w={150} title='Browser' sub='পর্যটকের ফোন' />
            <Node x={240} y={150} w={190} title='Island Tours API' sub='NestJS, Server এ' />
            <Node x={540} y={40} w={220} title='PostgreSQL' sub='Source of Truth' accent />
            <Node x={540} y={150} w={220} title='Redis' sub='Session আর Cache' />
            <Node x={540} y={270} w={160} title='Search Engine' sub='দরকার হলে' dashed />
            <Node x={730} y={270} w={170} title='Warehouse' sub='Report এর জন্য' dashed />

            <line x1={174} y1={180} x2={234} y2={180} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#dbkinds-polyglot-arrow)' />
            <path d='M 434 165 H 480 V 70 H 532' fill='none' stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#dbkinds-polyglot-arrow)' />
            <line x1={434} y1={180} x2={532} y2={180} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.3' markerEnd='url(#dbkinds-polyglot-arrow-muted)' />
            <SketchText x={486} y={60} size={9.5} body accent>
                লেখা আর পড়া
            </SketchText>
            <SketchText x={486} y={200} size={9.5} body opacity={0.8}>
                দ্রুত পড়া
            </SketchText>

            <path d='M 764 70 H 860 V 262' fill='none' stroke='var(--primary)' strokeDasharray='5 4' strokeWidth='1.2' markerEnd='url(#dbkinds-polyglot-arrow)' />
            <path d='M 764 84 H 800 V 240 H 620 V 262' fill='none' stroke='var(--primary)' strokeDasharray='5 4' strokeWidth='1.2' markerEnd='url(#dbkinds-polyglot-arrow)' />
            <SketchText x={866} y={160} anchor='start' size={9.5} body accent>
                কপি
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 8. প্রতিটা পরিবারের এক নজরের কার্ড                                          */
/* ------------------------------------------------------------------------- */

export function DbKindFacts({
    kind,
    shape,
    example,
    products,
    pick,
    avoid,
}: {
    kind: string;
    shape: React.ReactNode;
    example: React.ReactNode;
    products: string[];
    pick: React.ReactNode;
    avoid: React.ReactNode;
}) {
    const rows: [string, React.ReactNode][] = [
        ['আকার', shape],
        ['Island Tours এ', example],
        ['কখন নেবেন', pick],
        ['কখন নয়', avoid],
    ];
    return (
        <div className='my-8 border border-border bg-card'>
            <div className='flex flex-wrap items-baseline justify-between gap-2 px-5 py-3 border-b border-border bg-muted/30'>
                <span className='font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] text-primary'>
                    {kind}
                </span>
                <span className='flex flex-wrap gap-1.5'>
                    {products.map(product => (
                        <span
                            key={product}
                            className='px-2 py-0.5 border border-border bg-background font-mono text-[0.625rem] text-muted-foreground'>
                            {product}
                        </span>
                    ))}
                </span>
            </div>
            <dl className='divide-y divide-border'>
                {rows.map(([label, value]) => (
                    <div key={label} className='grid grid-cols-1 sm:grid-cols-[9rem_minmax(0,1fr)] gap-1 sm:gap-4 px-5 py-3'>
                        <dt className='text-[0.8125rem] font-bold text-muted-foreground'>
                            {label}
                        </dt>
                        <dd className='text-sm leading-relaxed text-foreground/90'>{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
