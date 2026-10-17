import { Sketch, SketchBox, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. একটা Generated Column এর লাইন, টুকরো টুকরো করে                           */
/* ------------------------------------------------------------------------- */

const ANATOMY_PARTS: { text: string; x: number; label: string; note: string }[] = [
    { text: 'total_bdt', x: 40, label: 'Column এর নাম', note: 'বাকি Column এর মতোই, SELECT এ এই নামেই আসে' },
    { text: 'numeric(10, 2)', x: 150, label: 'ফলাফলের Type', note: 'হিসাবের উত্তর এই Type এ বদলে রাখা হয়' },
    {
        text: 'GENERATED ALWAYS AS',
        x: 310,
        label: 'হাতে লেখা নিষেধ',
        note: 'মান দেয় শুধু Database, নিজের মান দিলে Error 428C9',
    },
    {
        text: '(seats * unit_price_bdt)',
        x: 520,
        label: 'হিসাবের সূত্র',
        note: 'একই Row এর অন্য Column, আর শুধু IMMUTABLE Function',
    },
    {
        text: 'STORED',
        x: 790,
        label: 'কখন হিসাব',
        note: 'STORED: লেখার সময়, Disk এ থাকে। না লিখলে PostgreSQL 18 এ VIRTUAL',
    },
];

function NumberBadge({ x, y, n }: { x: number; y: number; n: number }) {
    return (
        <g>
            <circle cx={x} cy={y} r={10} fill='var(--primary)' fillOpacity={0.15} stroke='var(--primary)' />
            <SketchText x={x} y={y + 4} size={10.5} bold accent>
                {String(n)}
            </SketchText>
        </g>
    );
}

/**
 * The one line that makes a generated column, cut into its five parts, each
 * with what it promises. The example row at the bottom is the gen_quotes row
 * the lesson builds: seats 3 and 12500.00 give 37500.00 with no one typing it.
 */
export function GeneratedAnatomyDiagram() {
    return (
        <Sketch
            label='Anatomy of a Generated Column'
            height={450}
            minWidth={940}
            viewBox='0 0 940 450'
            caption='একটা লাইনেই পুরো নিয়ম। নাম আর Type সাধারণ Column এর মতো, তারপর GENERATED ALWAYS AS বলে দেয় এই ঘরে মানুষ লিখবে না, বন্ধনীর সূত্র বলে কী দিয়ে হিসাব, আর শেষ শব্দ বলে হিসাবটা কখন হবে। নিচের Row টা এই লেসনের gen_quotes থেকে: seats 3 আর unit_price_bdt 12500.00 লেখা হয়েছে, total_bdt 37500.00 কেউ লেখেনি।'>
            <rect x={24} y={36} width={892} height={52} fill='var(--primary)' fillOpacity={0.05} stroke='currentColor' strokeOpacity={0.3} />
            {ANATOMY_PARTS.map((part, i) => (
                <g key={part.text}>
                    <NumberBadge x={part.x + (part.text.length * 8.4) / 2} y={22} n={i + 1} />
                    <SketchText x={part.x} y={69} size={14} anchor='start' bold accent={i === 2 || i === 4}>
                        {part.text}
                    </SketchText>
                </g>
            ))}

            {ANATOMY_PARTS.map((part, i) => {
                const y = 124 + i * 48;
                return (
                    <g key={`${part.text}-row`}>
                        <line x1={40} y1={y - 22} x2={900} y2={y - 22} stroke='currentColor' strokeOpacity={0.12} />
                        <NumberBadge x={52} y={y} n={i + 1} />
                        <SketchText x={76} y={y + 4} size={11.5} anchor='start' bold accent>
                            {part.text}
                        </SketchText>
                        <SketchText x={340} y={y} size={12} anchor='start' bold body>
                            {part.label}
                        </SketchText>
                        <SketchText x={340} y={y + 18} size={10.5} anchor='start' body opacity={0.85}>
                            {part.note}
                        </SketchText>
                    </g>
                );
            })}

            <rect x={40} y={374} width={560} height={52} fill='var(--card)' stroke='currentColor' strokeOpacity={0.35} />
            {['customer', 'seats', 'unit_price_bdt', 'total_bdt'].map((c, i) => (
                <SketchText key={c} x={[56, 220, 300, 460][i]} y={394} size={10} anchor='start' bold accent={i === 3}>
                    {c}
                </SketchText>
            ))}
            {['Nusrat Jahan', '3', '12500.00', '37500.00'].map((c, i) => (
                <SketchText key={c} x={[56, 220, 300, 460][i]} y={416} size={10.5} anchor='start' accent={i === 3} bold={i === 3}>
                    {c}
                </SketchText>
            ))}
            <rect x={450} y={380} width={140} height={42} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeDasharray='4 3' />
            <SketchText x={620} y={398} size={11} anchor='start' body accent bold>
                কেউ লেখেনি, Database হিসাব করেছে
            </SketchText>
            <SketchText x={620} y={418} size={10.5} anchor='start' body opacity={0.8}>
                3 × 12500.00 = 37500.00
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. STORED বনাম VIRTUAL: হিসাব কখন, Disk এ কী                               */
/* ------------------------------------------------------------------------- */

function DiskRow({ x, y, cells, faded }: { x: number; y: number; cells: string[]; faded?: number }) {
    return (
        <g>
            {cells.map((cell, i) => (
                <g key={i} opacity={faded === i ? 0.45 : 1}>
                    <rect
                        x={x + i * 96}
                        y={y}
                        width={92}
                        height={30}
                        fill={faded === i ? 'transparent' : 'var(--card)'}
                        stroke='currentColor'
                        strokeOpacity={0.4}
                        strokeDasharray={faded === i ? '4 3' : undefined}
                    />
                    <SketchText x={x + i * 96 + 46} y={y + 19} size={10.5} bold={i === 2 && faded !== i} accent={i === 2 && faded !== i}>
                        {cell}
                    </SketchText>
                </g>
            ))}
        </g>
    );
}

function FlowArrow({ d, id }: { d: string; id: string }) {
    return <path d={d} fill='none' stroke='var(--primary)' strokeWidth='1.3' markerEnd={`url(#${id})`} />;
}

function ArrowHead({ id }: { id: string }) {
    return (
        <defs>
            <marker id={id} markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
            </marker>
        </defs>
    );
}

/**
 * The same quote row under the two kinds. STORED does the multiplication on
 * INSERT and UPDATE and keeps the answer on disk, so SELECT only reads it.
 * VIRTUAL keeps only seats and price; every SELECT that asks for the column
 * multiplies again. The byte counts are the lesson's own measurement of 5000
 * rows with three such columns.
 */
export function StoredVirtualSplit() {
    return (
        <SketchSplit
            label='STORED vs VIRTUAL'
            caption='একই Row, দুই রকম জীবন। STORED এ গুণটা হয় লেখার মুহূর্তে, উত্তরটা Disk এ বসে থাকে, পড়া মানে শুধু তুলে আনা। VIRTUAL এ Disk এ শুধু seats আর দাম, প্রতিবার SELECT এ গুণটা নতুন করে হয়। এই লেসনের মাপে ৫০০০ Row আর তিনটা হিসাবের Column এ STORED Table 303104 Byte, VIRTUAL Table 229376 Byte, ঠিক হিসাবহীন Table এর সমান।'
            panels={[
                {
                    title: 'STORED',
                    sub: 'হিসাব লেখার সময়',
                    viewBox: '0 0 440 300',
                    height: 300,
                    minWidth: 400,
                    children: (
                        <g>
                            <ArrowHead id='gen-sv-stored-arrow' />
                            <SketchBox x={20} y={20} w={170} h={44} title='INSERT / UPDATE' sub='seats = 3' accent />
                            <FlowArrow d='M 190 42 L 246 42' id='gen-sv-stored-arrow' />
                            <SketchBox x={250} y={20} w={170} h={44} title='হিসাব' sub='3 × 12500.00' />
                            <FlowArrow d='M 335 64 C 335 100, 258 90, 258 126' id='gen-sv-stored-arrow' />
                            <SketchText x={20} y={124} size={10} anchor='start' bold>
                                Disk এ Row
                            </SketchText>
                            <DiskRow x={20} y={132} cells={['3', '12500.00', '37500.00']} />
                            <FlowArrow d='M 160 172 L 160 214' id='gen-sv-stored-arrow' />
                            <SketchBox x={70} y={218} w={180} h={44} title='SELECT' sub='শুধু তুলে আনে' />
                            <SketchText x={270} y={244} size={10.5} anchor='start' body accent>
                                গুণ আর হয় না
                            </SketchText>
                            <SketchText x={20} y={288} size={10} anchor='start' body opacity={0.75}>
                                জায়গা বেশি লাগে, পড়া সস্তা, Index বসানো যায়
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'VIRTUAL',
                    sub: 'হিসাব পড়ার সময়, PostgreSQL 18 এর Default',
                    viewBox: '0 0 440 300',
                    height: 300,
                    minWidth: 400,
                    children: (
                        <g>
                            <ArrowHead id='gen-sv-virtual-arrow' />
                            <SketchBox x={20} y={20} w={170} h={44} title='INSERT / UPDATE' sub='seats = 3' accent />
                            <FlowArrow d='M 105 64 L 105 104' id='gen-sv-virtual-arrow' />
                            <SketchText x={20} y={124} size={10} anchor='start' bold>
                                Disk এ Row
                            </SketchText>
                            <DiskRow x={20} y={132} cells={['3', '12500.00', 'নেই']} faded={2} />
                            <FlowArrow d='M 160 172 L 160 214' id='gen-sv-virtual-arrow' />
                            <SketchBox x={70} y={218} w={180} h={44} title='SELECT' sub='পড়তে পড়তে গুণ' />
                            <FlowArrow d='M 250 240 L 296 240' id='gen-sv-virtual-arrow' />
                            <SketchBox x={300} y={218} w={124} h={44} title='37500.00' sub='3 × 12500.00' accent />
                            <SketchText x={20} y={288} size={10} anchor='start' body opacity={0.75}>
                                জায়গা লাগে না, প্রতিবার পড়ায় হিসাব, Index বসে না
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Function এর তিন চরিত্র                                                  */
/* ------------------------------------------------------------------------- */

const LADDER = [
    {
        code: 'IMMUTABLE',
        mark: 'i',
        rule: ['একই Input দিলে চিরকাল একই Output'],
        examples: ['round(numeric, integer)', 'text || text', 'lower(text)', "date_trunc('month', ts, 'Asia/Dhaka')"],
        verdict: 'Generated Column এ চলে',
        ok: true,
    },
    {
        code: 'STABLE',
        mark: 's',
        rule: ['এক Statement এর ভেতরে একই, কিন্তু', 'সময় বা Setting বদলালে বদলায়'],
        examples: ['now(), current_date', 'concat(...)', 'to_char(...)', "date_trunc('month', timestamptz)"],
        verdict: 'Error 42P17: not immutable',
        ok: false,
    },
    {
        code: 'VOLATILE',
        mark: 'v',
        rule: ['প্রতিবার ডাকলে আলাদা হতে পারে'],
        examples: ['random()', 'clock_timestamp()', "nextval('...')"],
        verdict: 'Error 42P17: not immutable',
        ok: false,
    },
];

/**
 * PostgreSQL marks every function with one of three volatility categories.
 * A generated column (and an index expression) may only use the first one,
 * because a stored answer must still be right tomorrow, in any time zone, for
 * any DateStyle. The examples are the ones the lesson checks in pg_proc.
 */
export function VolatilityLadderDiagram() {
    return (
        <Sketch
            label='Three Kinds of Function'
            height={360}
            minWidth={940}
            viewBox='0 0 940 360'
            caption='pg_proc এর provolatile Column এ প্রতিটা Function এর চরিত্র লেখা থাকে: i, s অথবা v। Generated Column এর সূত্রে শুধু i চলে, কারণ আজ লেখা উত্তর কাল, অন্য Time Zone এ, অন্য Date Format এও ঠিক থাকতে হবে। একই কারণে Index এর Expression এও শুধু IMMUTABLE চলে, সেটা Module 13 এ।'>
            {LADDER.map((step, i) => {
                const x = 24 + i * 306;
                return (
                    <g key={step.code}>
                        <rect
                            x={x}
                            y={24}
                            width={290}
                            height={312}
                            fill={step.ok ? 'var(--primary)' : 'transparent'}
                            fillOpacity={step.ok ? 0.07 : 0}
                            stroke={step.ok ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={step.ok ? 0.9 : 0.4}
                            strokeWidth='1.2'
                        />
                        <SketchText x={x + 18} y={56} size={15} anchor='start' bold accent={step.ok}>
                            {step.code}
                        </SketchText>
                        <SketchText x={x + 272} y={56} size={12} anchor='end' opacity={0.7}>
                            {`provolatile = '${step.mark}'`}
                        </SketchText>
                        {step.rule.map((line, j) => (
                            <SketchText key={line} x={x + 18} y={90 + j * 20} size={11} anchor='start' body>
                                {line}
                            </SketchText>
                        ))}
                        <line x1={x + 18} y1={128} x2={x + 272} y2={128} stroke='currentColor' strokeOpacity={0.25} />
                        {step.examples.map((example, j) => (
                            <SketchText key={example} x={x + 18} y={156 + j * 28} size={10.5} anchor='start'>
                                {example}
                            </SketchText>
                        ))}
                        <rect
                            x={x + 14}
                            y={282}
                            width={262}
                            height={38}
                            fill={step.ok ? 'var(--primary)' : 'currentColor'}
                            fillOpacity={step.ok ? 0.15 : 0.06}
                            stroke={step.ok ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={0.6}
                            strokeDasharray={step.ok ? undefined : '4 3'}
                        />
                        <SketchText x={x + 145} y={306} size={11} bold accent={step.ok} body={step.ok}>
                            {step.ok ? `✓ ${step.verdict}` : `✗ ${step.verdict}`}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Sequence এর রাস্তা: START, INCREMENT, MAXVALUE, আর CYCLE কোথায় ফেরে     */
/* ------------------------------------------------------------------------- */

function lineX(value: number) {
    // 1 sits at the left edge, then a break, then 95..120 spread wide.
    if (value < 50) return 70 + (value - 1) * 24;
    return 300 + (value - 95) * 22;
}

/**
 * Two sequences with START WITH 100, INCREMENT BY 5, MAXVALUE 115 and CYCLE.
 * The only difference is MINVALUE. Without it the minimum is the default 1, so
 * after 115 the sequence jumps to 1, not back to 100. Both rows are the real
 * output of the lesson's query box.
 */
export function SequenceLineDiagram() {
    const ticks = [1, 6, 100, 105, 110, 115];
    const lane = (y: number, back: number, label: string, values: string, id: string) => (
        <g>
            <line x1={50} y1={y} x2={880} y2={y} stroke='currentColor' strokeOpacity={0.35} />
            <path d={`M 230 ${y - 6} l 8 12 M 240 ${y - 6} l 8 12`} stroke='currentColor' strokeOpacity={0.5} />
            {ticks.map(t => (
                <g key={t}>
                    <line x1={lineX(t)} y1={y - 6} x2={lineX(t)} y2={y + 6} stroke='currentColor' strokeOpacity={0.6} />
                    <SketchText x={lineX(t)} y={y + 24} size={10.5} bold={t >= 100 || t === back}>
                        {String(t)}
                    </SketchText>
                </g>
            ))}
            {[100, 105, 110].map(t => (
                <path
                    key={t}
                    d={`M ${lineX(t) + 4} ${y - 10} Q ${lineX(t) + 55} ${y - 34}, ${lineX(t + 5) - 4} ${y - 10}`}
                    fill='none'
                    stroke='var(--primary)'
                    strokeWidth='1.2'
                    markerEnd={`url(#${id})`}
                />
            ))}
            <path
                d={`M ${lineX(115)} ${y + 32} C ${lineX(115)} ${y + 78}, ${lineX(back)} ${y + 78}, ${lineX(back)} ${y + 34}`}
                fill='none'
                stroke='var(--primary)'
                strokeWidth='1.5'
                strokeDasharray='5 3'
                markerEnd={`url(#${id})`}
            />
            <SketchText x={50} y={y - 44} size={11.5} anchor='start' bold accent>
                {label}
            </SketchText>
            <SketchText x={880} y={y - 44} size={10.5} anchor='end' opacity={0.8}>
                {values}
            </SketchText>
        </g>
    );
    return (
        <Sketch
            label='Where CYCLE Goes Back To'
            height={420}
            minWidth={940}
            viewBox='0 0 940 420'
            caption='দুটো Sequence এ START WITH 100, INCREMENT BY 5, MAXVALUE 115, CYCLE একই। উপরেরটায় MINVALUE লেখা হয়নি, তাই সর্বনিম্ন মান Default 1, আর 115 এর পরে সে ফেরে 1 এ, তারপর 6। নিচেরটায় MINVALUE 100, তাই ফেরে 100 এ। CYCLE সবসময় MINVALUE এ ফেরে, START এ না।'>
            <defs>
                <marker id='gen-line-arrow-a' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
                <marker id='gen-line-arrow-b' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {lane(110, 1, 'MINVALUE লেখা নেই (Default 1)', '100, 105, 110, 115, 1, 6, ...', 'gen-line-arrow-a')}
            {lane(300, 100, 'MINVALUE 100', '100, 105, 110, 115, 100, 105, ...', 'gen-line-arrow-b')}
            <SketchText x={lineX(115) + 14} y={188} size={10.5} anchor='start' body accent>
                115 এর পরে 1
            </SketchText>
            <SketchText x={lineX(110) + 30} y={392} size={10.5} anchor='start' body accent>
                115 এর পরে 100
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. CACHE: প্রতিটা Session একটা গোছা নেয়                                     */
/* ------------------------------------------------------------------------- */

const CACHE_BLOCKS = [
    { window: 'জানালা A', from: 1, used: [1, 2, 3], x: 40 },
    { window: 'জানালা B', from: 21, used: [21], x: 330 },
    { window: 'জানালা C', from: 41, used: [41], x: 620 },
];

/**
 * CREATE SEQUENCE ... CACHE 20 lets each session take twenty numbers at once
 * and hand them out from memory. Window A took 1 to 20, B took 21 to 40, C
 * took 41 to 60. What a session did not use is gone when it closes, which is
 * why the next new session got 61. All numbers are the psql run in the lesson.
 */
export function CacheBlocksDiagram() {
    return (
        <Sketch
            label='CACHE 20 in Three Windows'
            height={360}
            minWidth={940}
            viewBox='0 0 940 360'
            caption='CACHE 20 মানে প্রতিটা Session একবারে কুড়িটা নম্বর তুলে নিজের কাছে রাখে। জানালা A পেল 1 থেকে 20, B পেল 21 থেকে 40, C পেল 41 থেকে 60। A তিনটা খরচ করল, B আর C একটা করে। জানালা বন্ধ হলেই বাকিগুলো হারায়, তাই পরের নতুন জানালা পেল 61। Disk এর last_value তখন 60, যদিও বিলি হয়েছে মাত্র পাঁচটা।'>
            <defs>
                <marker id='gen-cache-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchBox x={300} y={20} w={340} h={54} title='gen_token_seq  (CACHE 20)' sub='Disk এ last_value: 60' accent />
            {CACHE_BLOCKS.map(block => (
                <g key={block.window}>
                    <path
                        d={`M 470 74 C 470 110, ${block.x + 130} 100, ${block.x + 130} 128`}
                        fill='none'
                        stroke='var(--primary)'
                        strokeWidth='1.2'
                        markerEnd='url(#gen-cache-arrow)'
                    />
                    <rect x={block.x} y={132} width={270} height={150} fill='var(--card)' stroke='currentColor' strokeOpacity={0.4} />
                    <SketchText x={block.x + 14} y={154} size={11.5} anchor='start' bold body>
                        {block.window}
                    </SketchText>
                    <SketchText x={block.x + 256} y={154} size={10} anchor='end' opacity={0.7}>
                        {`${block.from} থেকে ${block.from + 19}`}
                    </SketchText>
                    {Array.from({ length: 20 }, (_, k) => {
                        const value = block.from + k;
                        const used = block.used.includes(value);
                        const col = k % 5;
                        const row = Math.floor(k / 5);
                        return (
                            <g key={value}>
                                <rect
                                    x={block.x + 14 + col * 50}
                                    y={166 + row * 26}
                                    width={44}
                                    height={22}
                                    fill={used ? 'var(--primary)' : 'transparent'}
                                    fillOpacity={used ? 0.18 : 0}
                                    stroke={used ? 'var(--primary)' : 'currentColor'}
                                    strokeOpacity={used ? 1 : 0.25}
                                    strokeDasharray={used ? undefined : '3 3'}
                                />
                                <SketchText x={block.x + 36 + col * 50} y={181 + row * 26} size={10} bold={used} accent={used} opacity={used ? 1 : 0.45}>
                                    {String(value)}
                                </SketchText>
                            </g>
                        );
                    })}
                </g>
            ))}
            <rect x={40} y={300} width={16} height={14} fill='var(--primary)' fillOpacity={0.18} stroke='var(--primary)' />
            <SketchText x={64} y={312} size={10.5} anchor='start' body>
                বিলি হয়েছে
            </SketchText>
            <rect x={160} y={300} width={16} height={14} fill='transparent' stroke='currentColor' strokeOpacity={0.35} strokeDasharray='3 3' />
            <SketchText x={184} y={312} size={10.5} anchor='start' body>
                তুলে রাখা, জানালা বন্ধ হলে হারায়
            </SketchText>
            <SketchText x={900} y={312} size={11} anchor='end' body accent bold>
                পরের নতুন জানালা: 61
            </SketchText>
        </Sketch>
    );
}
