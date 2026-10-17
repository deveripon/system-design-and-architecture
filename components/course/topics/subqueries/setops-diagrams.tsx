import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Small drawing helpers                                                      */
/* ------------------------------------------------------------------------- */

function Cell({
    x,
    y,
    w,
    h = 26,
    text,
    accent,
    dashed,
    muted,
}: {
    x: number;
    y: number;
    w: number;
    h?: number;
    text: string;
    accent?: boolean;
    dashed?: boolean;
    muted?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={accent ? 'var(--primary)' : 'var(--card)'}
                fillOpacity={accent ? 0.1 : 1}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.9 : 0.4}
                strokeDasharray={dashed ? '4 3' : undefined}
                strokeWidth='1.1'
            />
            <SketchText x={x + w / 2} y={y + h / 2 + 4} size={10} opacity={muted ? 0.5 : 1} accent={accent}>
                {text}
            </SketchText>
        </g>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. JOIN পাশাপাশি জোড়ে, UNION উপরে নিচে সাজায়                                  */
/* ------------------------------------------------------------------------- */

/**
 * The one picture that separates this lesson from Module 06: a join widens the
 * result with columns from both tables, a set operation lengthens it with rows
 * from both queries. Real names and booking ids from the sample data.
 */
export function StackVsPairSplit() {
    return (
        <SketchSplit
            label='JOIN vs UNION ALL: পাশাপাশি না উপরে নিচে'
            caption={
                <>
                    বাঁয়ে Module 06 এর Join: customers আর bookings মিলিয়ে প্রতিটা Row চওড়া হয়, Column আসে দুই Table
                    থেকে। ডানে এই লেসনের UNION ALL: customers আর guides এর নাম একটার নিচে আরেকটা বসে, Column একই থাকে,
                    শুধু Row বাড়ে। Join এর জন্য দুই Table এর মধ্যে একটা Key লাগে, Set Operation এর জন্য লাগে একই আকারের
                    দুটো ফলাফল।
                </>
            }
            panels={[
                {
                    title: 'JOIN',
                    sub: 'Column বাড়ে',
                    viewBox: '0 0 420 260',
                    height: 260,
                    minWidth: 360,
                    children: (
                        <g>
                            <SketchText x={95} y={20} size={10} bold>
                                customers
                            </SketchText>
                            <Cell x={20} y={30} w={150} text='Rahim Uddin' />
                            <Cell x={20} y={56} w={150} text='Nusrat Jahan' />
                            <SketchText x={325} y={20} size={10} bold>
                                bookings
                            </SketchText>
                            <Cell x={250} y={30} w={150} text='1  (Rahim)' />
                            <Cell x={250} y={56} w={150} text='8  (Rahim)' />
                            <Cell x={250} y={82} w={150} text='2  (Nusrat)' />
                            <line x1={210} y1={118} x2={210} y2={140} stroke='var(--primary)' strokeWidth='1.3' />
                            <SketchText x={210} y={156} size={10} body accent>
                                Key মিলিয়ে পাশাপাশি
                            </SketchText>
                            <Cell x={40} y={168} w={200} text='Rahim Uddin' accent />
                            <Cell x={240} y={168} w={140} text='1' accent />
                            <Cell x={40} y={194} w={200} text='Rahim Uddin' accent />
                            <Cell x={240} y={194} w={140} text='8' accent />
                            <Cell x={40} y={220} w={200} text='Nusrat Jahan' accent />
                            <Cell x={240} y={220} w={140} text='2' accent />
                        </g>
                    ),
                },
                {
                    title: 'UNION ALL',
                    sub: 'Row বাড়ে',
                    viewBox: '0 0 420 260',
                    height: 260,
                    minWidth: 360,
                    children: (
                        <g>
                            <SketchText x={110} y={20} size={10} bold>
                                customers
                            </SketchText>
                            <Cell x={30} y={30} w={160} text='Rahim Uddin' />
                            <Cell x={30} y={56} w={160} text='Nusrat Jahan' />
                            <Cell x={30} y={82} w={160} text='Tanvir Ahmed' />
                            <SketchText x={110} y={130} size={10} bold>
                                guides
                            </SketchText>
                            <Cell x={30} y={140} w={160} text='Jamal Hossain' />
                            <Cell x={30} y={166} w={160} text='Shirin Akter' />
                            <line x1={196} y1={110} x2={244} y2={110} stroke='var(--primary)' strokeWidth='1.3' />
                            <SketchText x={325} y={42} size={10} bold accent>
                                ফলাফল, ৫টা Row
                            </SketchText>
                            {['Rahim Uddin', 'Nusrat Jahan', 'Tanvir Ahmed', 'Jamal Hossain', 'Shirin Akter'].map((name, i) => (
                                <Cell key={name} x={250} y={52 + i * 26} w={150} text={name} accent />
                            ))}
                            <SketchText x={325} y={204} size={10} body accent>
                                একটার নিচে আরেকটা
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 2. চারটা Operation, চারটা ছায়া                                               */
/* ------------------------------------------------------------------------- */

const VENN = [
    { title: 'UNION', count: 11, mode: 'union' as const },
    { title: 'INTERSECT', count: 3, mode: 'both' as const },
    { title: 'A EXCEPT B', count: 6, mode: 'a-only' as const },
    { title: 'B EXCEPT A', count: 2, mode: 'b-only' as const },
];

/**
 * The four operators as shaded regions, on the real customers who travelled to
 * the sea (A, 9 people) and to the hills (B, 5 people); three went to both.
 */
export function VennQuartetDiagram() {
    return (
        <Sketch
            label='চার Operation, একই দুই দল'
            height={300}
            minWidth={900}
            viewBox='0 0 960 300'
            caption={
                <>
                    A হলো যাঁরা সমুদ্রের (island বা beach) ট্যুরে বুক করেছেন, ৯ জন। B হলো যাঁরা পাহাড়ের (hills) ট্যুরে, ৫
                    জন। দুই দলেই আছেন ৩ জন: Rahim Uddin, Sumaiya Islam আর Oliver Bennett। রঙ করা অংশটাই ফলাফল: UNION এ
                    ৬ + ৩ + ২ = ১১, INTERSECT এ ৩, A EXCEPT B তে ৬, B EXCEPT A তে ২। শেষ দুটো একই দুই দল, দিক উল্টো, উত্তর
                    আলাদা।
                </>
            }>
            {VENN.map((v, i) => {
                const cx = 120 + i * 240;
                const ax = cx - 30;
                const bx = cx + 38;
                const cy = 160;
                const ra = 66;
                const rb = 52;
                const clipA = `setops-venn-a-${i}`;
                return (
                    <g key={v.title}>
                        <defs>
                            <clipPath id={clipA}>
                                <circle cx={ax} cy={cy} r={ra} />
                            </clipPath>
                        </defs>
                        <SketchText x={cx} y={40} size={11} bold accent>
                            {v.title}
                        </SketchText>
                        <SketchText x={cx} y={60} size={10} body opacity={0.8}>
                            {`${v.count} জন`}
                        </SketchText>
                        {v.mode === 'union' && (
                            <>
                                <circle cx={ax} cy={cy} r={ra} fill='var(--primary)' fillOpacity={0.18} />
                                <circle cx={bx} cy={cy} r={rb} fill='var(--primary)' fillOpacity={0.18} />
                            </>
                        )}
                        {v.mode === 'both' && (
                            <circle
                                cx={bx}
                                cy={cy}
                                r={rb}
                                fill='var(--primary)'
                                fillOpacity={0.3}
                                clipPath={`url(#${clipA})`}
                            />
                        )}
                        {v.mode === 'a-only' && (
                            <>
                                <circle cx={ax} cy={cy} r={ra} fill='var(--primary)' fillOpacity={0.25} />
                                <circle cx={bx} cy={cy} r={rb} fill='var(--card)' />
                            </>
                        )}
                        {v.mode === 'b-only' && (
                            <>
                                <circle cx={bx} cy={cy} r={rb} fill='var(--primary)' fillOpacity={0.25} />
                                <circle cx={ax} cy={cy} r={ra} fill='var(--card)' />
                            </>
                        )}
                        <circle cx={ax} cy={cy} r={ra} fill='none' stroke='currentColor' strokeOpacity={0.55} strokeWidth='1.2' />
                        <circle cx={bx} cy={cy} r={rb} fill='none' stroke='currentColor' strokeOpacity={0.55} strokeWidth='1.2' />
                        <SketchText x={ax - 32} y={cy + 4} size={11} bold>
                            6
                        </SketchText>
                        <SketchText x={(ax + ra + bx - rb) / 2} y={cy + 4} size={11} bold>
                            3
                        </SketchText>
                        <SketchText x={bx + 26} y={cy + 4} size={11} bold>
                            2
                        </SketchText>
                        <SketchText x={ax - 20} y={cy + ra + 22} size={10} body opacity={0.7}>
                            A সমুদ্র
                        </SketchText>
                        <SketchText x={bx + 22} y={cy + ra + 22} size={10} body opacity={0.7}>
                            B পাহাড়
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. জোড়া লাগার নিয়ম: সংখ্যা, Type আর নাম                                       */
/* ------------------------------------------------------------------------- */

/**
 * Columns are matched by position, never by name: the first query decides the
 * names, every pair must agree in type, and both sides need the same count.
 */
export function ColumnRulesDiagram() {
    const col = 170;
    const left = 150;
    return (
        <Sketch
            label='Column মেলে অবস্থান ধরে'
            height={420}
            minWidth={900}
            viewBox='0 0 960 420'
            caption={
                <>
                    Set Operation দুই দিকের Column নাম দেখে মেলায় না, মেলায় অবস্থান দেখে: প্রথমটার সাথে প্রথমটা, দ্বিতীয়টার সাথে
                    দ্বিতীয়টা। তাই দুই দিকে Column এর সংখ্যা সমান হতে হয়, আর প্রতিটা জোড়ার Type মিলতে হয়। ফলাফলের Column এর
                    নাম আসে প্রথম Query থেকে, দ্বিতীয়টার নাম বা Alias বাদ পড়ে।
                </>
            }>
            {/* band 1: works */}
            <SketchText x={20} y={34} size={10.5} bold anchor='start' accent>
                ✓ চলে
            </SketchText>
            <SketchText x={left - 12} y={66} size={9.5} anchor='end' opacity={0.7}>
                Query 1
            </SketchText>
            <SketchText x={left - 12} y={104} size={9.5} anchor='end' opacity={0.7}>
                Query 2
            </SketchText>
            <SketchText x={left - 12} y={142} size={9.5} anchor='end' accent>
                ফলাফল
            </SketchText>
            {[
                ['full_name (text)', 'full_name (text)', 'full_name'],
                ['phone (text)', 'phone (text)', 'phone'],
                ["'customer' AS kind", "'guide'", 'kind'],
            ].map(([a, b, r], i) => {
                const x = left + i * (col + 20);
                return (
                    <g key={a}>
                        <Cell x={x} y={48} w={col} text={a} />
                        <Cell x={x} y={86} w={col} text={b} />
                        <Cell x={x} y={124} w={col} text={r} accent />
                        <line x1={x + col / 2} y1={74} x2={x + col / 2} y2={86} stroke='var(--primary)' strokeDasharray='3 3' />
                        <line x1={x + col / 2} y1={112} x2={x + col / 2} y2={124} stroke='var(--primary)' strokeDasharray='3 3' />
                    </g>
                );
            })}
            <SketchText x={left + 3 * (col + 20) + 10} y={142} size={9.5} body anchor='start' opacity={0.8}>
                নাম প্রথম Query র
            </SketchText>

            {/* band 2: column count */}
            <SketchText x={20} y={196} size={10.5} bold anchor='start'>
                ✗ সংখ্যা মেলেনি
            </SketchText>
            <SketchText x={left - 12} y={228} size={9.5} anchor='end' opacity={0.7}>
                Query 1
            </SketchText>
            <SketchText x={left - 12} y={266} size={9.5} anchor='end' opacity={0.7}>
                Query 2
            </SketchText>
            <Cell x={left} y={210} w={col} text='full_name' />
            <Cell x={left + col + 20} y={210} w={col} text='phone' />
            <Cell x={left} y={248} w={col} text='full_name' />
            <Cell x={left + col + 20} y={248} w={col} text='?' dashed muted />
            <SketchText x={left + 2 * (col + 20)} y={266} size={9.5} body anchor='start'>
                each UNION query must have the same number of columns
            </SketchText>

            {/* band 3: type */}
            <SketchText x={20} y={320} size={10.5} bold anchor='start'>
                ✗ Type মেলেনি
            </SketchText>
            <SketchText x={left - 12} y={352} size={9.5} anchor='end' opacity={0.7}>
                Query 1
            </SketchText>
            <SketchText x={left - 12} y={390} size={9.5} anchor='end' opacity={0.7}>
                Query 2
            </SketchText>
            <Cell x={left} y={334} w={col} text='customer_id (integer)' />
            <Cell x={left} y={372} w={col} text='full_name (text)' />
            <SketchText x={left + col + 20} y={390} size={9.5} body anchor='start'>
                UNION types integer and text cannot be matched
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. বন্ধনী কোন কাজ আগে করায়                                                   */
/* ------------------------------------------------------------------------- */

function TreeNode({ x, y, op, value, accent }: { x: number; y: number; op: string; value: string; accent?: boolean }) {
    return (
        <g>
            <rect
                x={x - 70}
                y={y}
                width={140}
                height={44}
                fill={accent ? 'var(--primary)' : 'var(--card)'}
                fillOpacity={accent ? 0.12 : 1}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 1 : 0.45}
                strokeWidth='1.2'
            />
            <SketchText x={x} y={y + 18} size={10} bold accent={accent}>
                {op}
            </SketchText>
            <SketchText x={x} y={y + 35} size={10}>
                {value}
            </SketchText>
        </g>
    );
}

function Edge({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />;
}

/**
 * The same three inputs evaluated two ways. Without brackets INTERSECT binds
 * first and the answer is {1, 2, 3}; with brackets around the UNION it is {3}.
 */
export function PrecedenceSplit() {
    return (
        <SketchSplit
            label='বন্ধনী ছাড়া আর বন্ধনী দিয়ে'
            caption={
                <>
                    A = {'{1, 2}'}, B = {'{2, 3}'}, C = {'{3}'}। বাঁয়ে কোনো বন্ধনী নেই, তাই PostgreSQL আর MySQL দুটোই আগে
                    INTERSECT চালায়: B আর C এর মিল {'{3}'}, তারপর A এর সাথে UNION, ফলাফল {'{1, 2, 3}'}। ডানে UNION কে বন্ধনীতে
                    রাখায় সেটা আগে চলে: {'{1, 2, 3}'}, তারপর C এর সাথে মিল, ফলাফল শুধু {'{3}'}। একই লেখা, শুধু দুটো বন্ধনী, আলাদা
                    উত্তর।
                </>
            }
            panels={[
                {
                    title: 'A UNION B INTERSECT C',
                    sub: 'INTERSECT আগে',
                    viewBox: '0 0 420 250',
                    height: 250,
                    minWidth: 360,
                    children: (
                        <g>
                            <TreeNode x={210} y={14} op='UNION' value='{1, 2, 3}' accent />
                            <Edge x1={190} y1={58} x2={100} y2={96} />
                            <Edge x1={230} y1={58} x2={310} y2={96} />
                            <TreeNode x={100} y={96} op='A' value='{1, 2}' />
                            <TreeNode x={310} y={96} op='INTERSECT' value='{3}' />
                            <Edge x1={290} y1={140} x2={240} y2={180} />
                            <Edge x1={330} y1={140} x2={370} y2={180} />
                            <TreeNode x={240} y={180} op='B' value='{2, 3}' />
                            <TreeNode x={350} y={180} op='C' value='{3}' />
                        </g>
                    ),
                },
                {
                    title: '(A UNION B) INTERSECT C',
                    sub: 'বন্ধনী আগে',
                    viewBox: '0 0 420 250',
                    height: 250,
                    minWidth: 360,
                    children: (
                        <g>
                            <TreeNode x={210} y={14} op='INTERSECT' value='{3}' accent />
                            <Edge x1={190} y1={58} x2={120} y2={96} />
                            <Edge x1={230} y1={58} x2={320} y2={96} />
                            <TreeNode x={120} y={96} op='UNION' value='{1, 2, 3}' />
                            <TreeNode x={320} y={96} op='C' value='{3}' />
                            <Edge x1={100} y1={140} x2={70} y2={180} />
                            <Edge x1={140} y1={140} x2={180} y2={180} />
                            <TreeNode x={80} y={180} op='A' value='{1, 2}' />
                            <TreeNode x={190} y={180} op='B' value='{2, 3}' />
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 5. Module 07 এক নজরে                                                        */
/* ------------------------------------------------------------------------- */

const STAGES = [
    { lesson: 'Lesson 01', code: 'Scalar', idea: 'একটা মান' },
    { lesson: 'Lesson 02', code: 'IN · ANY', idea: 'তালিকার সাথে তুলনা' },
    { lesson: 'Lesson 03', code: 'Correlated', idea: 'প্রতি Row এর প্রশ্ন' },
    { lesson: 'Lesson 04', code: 'Derived', idea: 'FROM এ Table' },
    { lesson: 'Lesson 05', code: 'WITH', idea: 'নাম দেওয়া ধাপ' },
    { lesson: 'Lesson 06', code: 'RECURSIVE', idea: 'নিজেকে ডাকা' },
    { lesson: 'Lesson 07', code: 'UNION', idea: 'ফলাফলের যোগ বিয়োগ' },
];

/** The seven lessons of Module 07 as one chain, ending in the capstone report. */
export function ModuleSevenStoryDiagram() {
    const w = 108;
    const gap = 12;
    const start = (900 - (STAGES.length * w + (STAGES.length - 1) * gap)) / 2;
    return (
        <Sketch
            label='Module 07: Query এর ভেতরে Query, তারপর ফলাফলের হিসাব'
            height={210}
            minWidth={900}
            viewBox='0 0 900 210'
            caption={
                <>
                    Module 06 পর্যন্ত একটা Query মানে একটা SELECT। Module 07 দেখাল একটা Query আরেকটার ভেতরে বসতে পারে: একটা
                    মান হয়ে, একটা তালিকা হয়ে, প্রতিটা Row এর জন্য আলাদা প্রশ্ন হয়ে, FROM এর ভেতরে একটা Table হয়ে। তারপর WITH
                    দিয়ে সেই ধাপগুলোকে নাম দেওয়া, RECURSIVE দিয়ে নিজেকে ডাকা, আর শেষে পুরো ফলাফলগুলো যোগ, মিল আর বিয়োগ করা।
                </>
            }>
            <defs>
                <marker
                    id='setops-story-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {STAGES.map((stage, i) => {
                const x = start + i * (w + gap);
                const mid = x + w / 2;
                const last = i === STAGES.length - 1;
                return (
                    <g key={stage.code}>
                        <SketchText x={mid} y={36} size={9.5} opacity={0.6}>
                            {stage.lesson}
                        </SketchText>
                        <rect
                            x={x}
                            y={48}
                            width={w}
                            height={44}
                            fill='var(--primary)'
                            fillOpacity={last ? 0.16 : 0.05}
                            stroke='var(--primary)'
                            strokeOpacity={0.75}
                            strokeWidth='1.2'
                        />
                        <SketchText x={mid} y={75} size={10.5} bold accent>
                            {stage.code}
                        </SketchText>
                        <SketchText x={mid} y={118} size={9.5} body bold>
                            {stage.idea}
                        </SketchText>
                        {!last && (
                            <line
                                x1={x + w + 2}
                                y1={70}
                                x2={x + w + gap - 2}
                                y2={70}
                                stroke='var(--primary)'
                                strokeWidth='1.2'
                                markerEnd='url(#setops-story-arrow)'
                            />
                        )}
                    </g>
                );
            })}
            <SketchText x={450} y={168} size={10.5} body>
                শেষে সবগুলো একসাথে: WITH এর শিকল, ভেতরে Derived Table, Scalar Subquery, EXISTS আর UNION,
            </SketchText>
            <SketchText x={450} y={190} size={10.5} body>
                কাকে আজ ফোন করা দরকার আর কেন, একটা Report এ
            </SketchText>
        </Sketch>
    );
}
