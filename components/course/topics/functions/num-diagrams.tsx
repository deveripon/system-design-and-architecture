import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. ৫টা আম, ২টা ঝুড়ি: ভাগফল, ভাগশেষ আর আসল ভাগ                              */
/* ------------------------------------------------------------------------- */

function Mango({ x, y, half, muted }: { x: number; y: number; half?: boolean; muted?: boolean }) {
    return (
        <g>
            <circle
                cx={x}
                cy={y}
                r={13}
                fill='var(--primary)'
                fillOpacity={muted ? 0.08 : 0.22}
                stroke='var(--primary)'
                strokeOpacity={muted ? 0.4 : 0.9}
                strokeWidth='1.2'
                strokeDasharray={muted ? '3 3' : undefined}
            />
            {half && <line x1={x} y1={y - 15} x2={x} y2={y + 15} stroke='currentColor' strokeWidth='1.4' />}
        </g>
    );
}

export function SharingMangoesDiagram() {
    return (
        <Sketch
            label='৫ ÷ ২: তিন রকম উত্তর'
            height={300}
            minWidth={900}
            viewBox='0 0 900 300'
            caption='একই ভাগ, তিনটা প্রশ্ন। 5 / 2 দুটো integer হলে জিজ্ঞেস করে "প্রত্যেক ঝুড়িতে কয়টা আস্ত আম?", উত্তর 2। 5 % 2 জিজ্ঞেস করে "কয়টা বাকি থাকল?", উত্তর 1। আর 5.0 / 2 জিজ্ঞেস করে "আম কেটে সমান ভাগ করলে কত?", উত্তর 2.5। কোন প্রশ্নটা করছেন, সেটা ঠিক করে সংখ্যাগুলোর Type।'>
            {/* integer division */}
            <SketchText x={150} y={36} size={12} bold accent>
                5 / 2 = 2
            </SketchText>
            <SketchText x={150} y={56} size={10} body opacity={0.75}>
                আস্ত আম, ভাগফল
            </SketchText>
            {[0, 1].map(b => (
                <g key={b}>
                    <rect x={40 + b * 115} y={80} width={100} height={70} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
                    <Mango x={70 + b * 115} y={115} />
                    <Mango x={110 + b * 115} y={115} />
                </g>
            ))}
            <Mango x={150} y={200} muted />
            <SketchText x={150} y={240} size={10} body opacity={0.7}>
                একটা পড়ে রইল, হিসাবে নেই
            </SketchText>

            {/* modulo */}
            <SketchText x={450} y={36} size={12} bold accent>
                5 % 2 = 1
            </SketchText>
            <SketchText x={450} y={56} size={10} body opacity={0.75}>
                যা বাকি থাকে, ভাগশেষ
            </SketchText>
            {[0, 1].map(b => (
                <g key={b}>
                    <rect x={340 + b * 115} y={80} width={100} height={70} fill='transparent' stroke='currentColor' strokeOpacity={0.3} />
                    <Mango x={370 + b * 115} y={115} muted />
                    <Mango x={410 + b * 115} y={115} muted />
                </g>
            ))}
            <Mango x={450} y={200} />
            <SketchText x={450} y={240} size={10} body opacity={0.85}>
                এই একটাই উত্তর
            </SketchText>

            {/* exact division */}
            <SketchText x={750} y={36} size={12} bold accent>
                5.0 / 2 = 2.5
            </SketchText>
            <SketchText x={750} y={56} size={10} body opacity={0.75}>
                কেটে সমান ভাগ
            </SketchText>
            {[0, 1].map(b => (
                <g key={b}>
                    <rect x={640 + b * 115} y={80} width={100} height={70} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
                    <Mango x={660 + b * 115} y={115} />
                    <Mango x={690 + b * 115} y={115} />
                    <Mango x={722 + b * 115} y={115} half />
                </g>
            ))}
            <SketchText x={750} y={200} size={10} body opacity={0.85}>
                শেষ আমটা দুই টুকরো
            </SketchText>
            <SketchText x={750} y={240} size={10} body opacity={0.7}>
                কিছুই পড়ে রইল না
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন Type এর সাথে কোন Type ভাগ করলে ফলাফল কী Type                       */
/* ------------------------------------------------------------------------- */

const TYPES = ['integer', 'numeric', 'double precision'];
const RESULT: Record<string, { type: string; example: string; trap?: boolean }> = {
    'integer|integer': { type: 'integer', example: '5 / 2 = 2', trap: true },
    'integer|numeric': { type: 'numeric', example: '5 / 2.0 = 2.5000…' },
    'integer|double precision': { type: 'double precision', example: '5 / 2::float8 = 2.5' },
    'numeric|integer': { type: 'numeric', example: '5.0 / 2 = 2.5000…' },
    'numeric|numeric': { type: 'numeric', example: '1 / 3.0 = 0.3333…' },
    'numeric|double precision': { type: 'double precision', example: 'float8 জেতে' },
    'double precision|integer': { type: 'double precision', example: '5::float8 / 2 = 2.5' },
    'double precision|numeric': { type: 'double precision', example: 'float8 জেতে' },
    'double precision|double precision': { type: 'double precision', example: '0.1 + 0.2 ≈ 0.3' },
};

export function DivisionTypeGridDiagram() {
    const cellW = 230;
    const cellH = 64;
    const left = 190;
    const top = 70;
    return (
        <Sketch
            label='ভাগের ফলাফলের Type: বাঁয়ের সংখ্যা ÷ উপরের সংখ্যা'
            height={300}
            minWidth={900}
            viewBox='0 0 900 300'
            caption='শুধু একটা ঘরেই ফাঁদ: দুই পাশেই integer। তখন PostgreSQL integer ভাগ করে, দশমিকের পরের অংশ কেটে ফেলে। যেকোনো এক পাশে numeric থাকলে ফলাফল numeric, আর কোথাও double precision থাকলে ফলাফল double precision। smallint আর bigint ও integer পরিবারের, তাই max_seats / duration_days ও কেটে যায়।'>
            {TYPES.map((t, c) => (
                <SketchText key={`h-${t}`} x={left + c * cellW + cellW / 2} y={top - 16} size={10.5} bold>
                    {t}
                </SketchText>
            ))}
            {TYPES.map((row, r) => (
                <g key={row}>
                    <SketchText x={left - 14} y={top + r * cellH + cellH / 2 + 4} anchor='end' size={10.5} bold>
                        {row}
                    </SketchText>
                    {TYPES.map((col, c) => {
                        const cell = RESULT[`${row}|${col}`];
                        const x = left + c * cellW;
                        const y = top + r * cellH;
                        return (
                            <g key={col}>
                                <rect
                                    x={x + 4}
                                    y={y + 4}
                                    width={cellW - 8}
                                    height={cellH - 8}
                                    fill={cell.trap ? 'var(--primary)' : 'transparent'}
                                    fillOpacity={cell.trap ? 0.14 : 0}
                                    stroke={cell.trap ? 'var(--primary)' : 'currentColor'}
                                    strokeOpacity={cell.trap ? 1 : 0.35}
                                    strokeWidth='1.2'
                                />
                                <SketchText x={x + cellW / 2} y={y + 28} size={10.5} bold accent={cell.trap}>
                                    {cell.type}
                                </SketchText>
                                <SketchText x={x + cellW / 2} y={y + 46} size={9.5} opacity={0.75}>
                                    {cell.example}
                                </SketchText>
                            </g>
                        );
                    })}
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. একই সংখ্যা, দুই রকম লেখা: Parentheses ছাড়া আর সহ                         */
/* ------------------------------------------------------------------------- */

function TreeNode({ x, y, label, value, accent }: { x: number; y: number; label: string; value?: string; accent?: boolean }) {
    return (
        <g>
            <rect
                x={x - 52}
                y={y - 16}
                width={104}
                height={32}
                fill={accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.12 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 1 : 0.45}
                strokeWidth='1.2'
            />
            <SketchText x={x} y={y + 4} size={11} bold accent={accent}>
                {label}
            </SketchText>
            {value && (
                <SketchText x={x} y={y + 32} size={9.5} opacity={0.8}>
                    {value}
                </SketchText>
            )}
        </g>
    );
}

function Edge({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
    return <line x1={x1} y1={y1 + 16} x2={x2} y2={y2 - 16} stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.1' />;
}

export function PrecedenceTreeSplit() {
    return (
        <SketchSplit
            label='VAT যোগ করার দুই লেখা'
            caption='বাঁয়ে Parentheses নেই, তাই PostgreSQL আগে গুণ আর ভাগ করে, পরে যোগ। 15 / 100 দুটোই integer বলে হয় 0, আর পুরো VAT হারিয়ে যায়। ডানে Parentheses যোগটাকে আগে করায়, আর 100.0 ভাগটাকে numeric রাখে। দুটো ভুল একসাথে ঠিক হয়।'
            panels={[
                {
                    title: '12500 * 1 + 15 / 100',
                    sub: 'ফলাফল 12500, VAT গায়েব',
                    viewBox: '0 0 400 250',
                    height: 250,
                    children: (
                        <>
                            <TreeNode x={200} y={30} label='+' value='12500' />
                            <Edge x1={200} y1={30} x2={100} y2={110} />
                            <Edge x1={200} y1={30} x2={300} y2={110} />
                            <TreeNode x={100} y={110} label='*' value='12500' />
                            <TreeNode x={300} y={110} label='/' value='0, integer ভাগ' accent />
                            <Edge x1={100} y1={110} x2={50} y2={200} />
                            <Edge x1={100} y1={110} x2={150} y2={200} />
                            <Edge x1={300} y1={110} x2={250} y2={200} />
                            <Edge x1={300} y1={110} x2={350} y2={200} />
                            <TreeNode x={50} y={200} label='12500' />
                            <TreeNode x={150} y={200} label='1' />
                            <TreeNode x={250} y={200} label='15' />
                            <TreeNode x={350} y={200} label='100' />
                        </>
                    ),
                },
                {
                    title: '12500 * (1 + 15 / 100.0)',
                    sub: 'ফলাফল 14375',
                    viewBox: '0 0 400 250',
                    height: 250,
                    children: (
                        <>
                            <TreeNode x={200} y={30} label='*' value='14375' />
                            <Edge x1={200} y1={30} x2={100} y2={110} />
                            <Edge x1={200} y1={30} x2={300} y2={110} />
                            <TreeNode x={100} y={110} label='12500' />
                            <TreeNode x={300} y={110} label='+' value='1.15' accent />
                            <Edge x1={300} y1={110} x2={240} y2={200} />
                            <Edge x1={300} y1={110} x2={360} y2={200} />
                            <TreeNode x={240} y={200} label='1' />
                            <TreeNode x={360} y={200} label='15 / 100.0' value='0.15' />
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. numeric বনাম double precision: খাতা বনাম আন্দাজ                          */
/* ------------------------------------------------------------------------- */

export function ExactVsApproxSplit() {
    return (
        <SketchSplit
            label='0.1 + 0.2: দুই রকম যোগ'
            caption='numeric প্রতিটা দশমিক অঙ্ক হুবহু রাখে, খাতায় লেখা হিসাবের মতো। double precision সংখ্যা রাখে দুইয়ের ঘাতে (Binary), আর 0.1 কে Binary তে হুবহু লেখা যায় না, যেমন ১ কে ৩ দিয়ে ভাগ করলে দশমিকে হুবহু লেখা যায় না। তাই সে রাখে সবচেয়ে কাছের একটা মান। দেখাতে গেলে সেই ছোট্ট গরমিল কখনো কখনো চোখে পড়ে।'
            panels={[
                {
                    title: 'numeric',
                    sub: 'হুবহু দশমিক',
                    viewBox: '0 0 400 220',
                    height: 220,
                    children: (
                        <>
                            {[
                                ['0.1', 40],
                                ['+ 0.2', 80],
                            ].map(([t, y]) => (
                                <SketchText key={t} x={300} y={Number(y)} anchor='end' size={14}>
                                    {t}
                                </SketchText>
                            ))}
                            <line x1={180} y1={96} x2={310} y2={96} stroke='currentColor' strokeOpacity={0.6} />
                            <SketchText x={300} y={126} anchor='end' size={14} bold accent>
                                0.3
                            </SketchText>
                            <SketchText x={200} y={180} size={10} body opacity={0.8}>
                                0.1 + 0.2 = 0.3 হলো t
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'double precision',
                    sub: 'Binary তে কাছাকাছি মান',
                    viewBox: '0 0 400 220',
                    height: 220,
                    children: (
                        <>
                            <SketchText x={20} y={40} anchor='start' size={10}>
                                0.1 → 0.1000000000000000055…
                            </SketchText>
                            <SketchText x={20} y={70} anchor='start' size={10}>
                                0.2 → 0.2000000000000000111…
                            </SketchText>
                            <line x1={20} y1={86} x2={380} y2={86} stroke='currentColor' strokeOpacity={0.6} />
                            <SketchText x={20} y={112} anchor='start' size={10} bold accent>
                                যোগফল → 0.3000000000000000444…
                            </SketchText>
                            <SketchText x={20} y={142} anchor='start' size={10} opacity={0.75}>
                                0.3 নিজে → 0.2999999999999999888…
                            </SketchText>
                            <SketchText x={200} y={190} size={10} body opacity={0.8}>
                                দুটো আলাদা, তাই = দিলে f
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 5. round, ceil, floor, trunc: সংখ্যারেখায় কে কোন দিকে যায়                   */
/* ------------------------------------------------------------------------- */

const MOVES = [
    { name: 'round', from: 2.5, to: 3, note: 'কাছেরটা, সমান দূরে হলে শূন্য থেকে দূরে' },
    { name: 'ceil', from: 2.5, to: 3, note: 'সবসময় উপরে' },
    { name: 'floor', from: 2.5, to: 2, note: 'সবসময় নিচে' },
    { name: 'trunc', from: 2.5, to: 2, note: 'দশমিক কেটে ফেলা' },
    { name: 'round', from: -2.5, to: -3, note: 'শূন্য থেকে দূরে' },
    { name: 'ceil', from: -2.5, to: -2, note: 'উপরে মানে শূন্যের দিকে' },
    { name: 'floor', from: -2.5, to: -3, note: 'নিচে মানে আরও ঋণাত্মক' },
    { name: 'trunc', from: -2.5, to: -2, note: 'কাটলে শূন্যের দিকে' },
];

export function RoundingNumberLineDiagram() {
    const x = (v: number) => 550 + v * 80;
    return (
        <Sketch
            label='2.5 আর -2.5: চার Function, চার দিক'
            height={420}
            minWidth={1100}
            viewBox='0 0 1100 420'
            caption='ধনাত্মক সংখ্যায় floor আর trunc একই কাজ করে, ঋণাত্মক সংখ্যায় আলাদা হয়ে যায়: floor নামে নিচের দিকে, trunc যায় শূন্যের দিকে। একইভাবে ceil সবসময় উপরে ওঠে। round কাছের পূর্ণসংখ্যায় যায়, আর ঠিক মাঝখানে পড়লে numeric শূন্য থেকে দূরে যায়।'>
            <defs>
                <marker id='num-line-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <line x1={x(-3.6)} y1={70} x2={x(3.6)} y2={70} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.2' />
            {[-3, -2, -1, 0, 1, 2, 3].map(v => (
                <g key={v}>
                    <line x1={x(v)} y1={62} x2={x(v)} y2={78} stroke='currentColor' strokeOpacity={0.6} />
                    <SketchText x={x(v)} y={50} size={11} bold={v === 0}>
                        {String(v)}
                    </SketchText>
                </g>
            ))}
            {[-2.5, 2.5].map(v => (
                <g key={v}>
                    <circle cx={x(v)} cy={70} r={5} fill='var(--primary)' />
                    <SketchText x={x(v)} y={98} size={10} bold accent>
                        {String(v)}
                    </SketchText>
                </g>
            ))}
            {MOVES.map((m, i) => {
                const y = 140 + (i % 4) * 66;
                const side = m.from > 0;
                return (
                    <g key={`${m.name}-${m.from}`}>
                        <SketchText x={side ? 1080 : 20} y={y + 4} anchor={side ? 'end' : 'start'} size={10.5} bold>
                            {`${m.name}(${m.from}) = ${m.to}`}
                        </SketchText>
                        <SketchText x={side ? 1080 : 20} y={y + 22} anchor={side ? 'end' : 'start'} size={9.5} body opacity={0.75}>
                            {m.note}
                        </SketchText>
                        <line
                            x1={x(m.from)}
                            y1={y}
                            x2={x(m.to)}
                            y2={y}
                            stroke='var(--primary)'
                            strokeWidth='1.5'
                            markerEnd='url(#num-line-arrow)'
                        />
                        <circle cx={x(m.from)} cy={y} r={3} fill='currentColor' fillOpacity={0.6} />
                    </g>
                );
            })}
        </Sketch>
    );
}
