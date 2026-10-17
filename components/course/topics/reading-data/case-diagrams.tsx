import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. একটা CASE এর অংশগুলো                                                     */
/* ------------------------------------------------------------------------- */

const ANATOMY = [
    { x: 40, w: 70, code: 'CASE', label: 'শুরু', sub: 'এখান থেকে নিয়ম' },
    { x: 126, w: 196, code: 'WHEN price_bdt < 8000', label: 'শর্ত', sub: 'সত্য হলে থামবে' },
    { x: 338, w: 136, code: "THEN 'Budget'", label: 'ফলাফল', sub: 'এই শর্তের উত্তর' },
    { x: 490, w: 124, code: "ELSE 'Other'", label: 'বাকি সবার', sub: 'না দিলে NULL' },
    { x: 630, w: 60, code: 'END', label: 'শেষ', sub: 'ভুললে Error' },
    { x: 706, w: 150, code: 'AS price_band', label: 'Column এর নাম', sub: 'না দিলে "case"' },
];

/** The parts of one searched CASE, each with what it does. */
export function CaseAnatomyDiagram() {
    return (
        <Sketch
            label='CASE Expression: অংশগুলো'
            height={210}
            minWidth={900}
            viewBox='0 0 900 210'
            caption='একটা CASE আসলে একটা মাত্র মান বানায়, প্রতিটা Row এর জন্য একটা। WHEN আর THEN জোড়ায় জোড়ায় আসে, যত খুশি জোড়া রাখা যায়। ELSE ঐচ্ছিক, কিন্তু END বাধ্যতামূলক।'>
            {ANATOMY.map(part => {
                const mid = part.x + part.w / 2;
                return (
                    <g key={part.code}>
                        <rect
                            x={part.x}
                            y={62}
                            width={part.w}
                            height={40}
                            fill='var(--primary)'
                            fillOpacity={part.code === 'END' || part.code === 'CASE' ? 0.14 : 0.05}
                            stroke='var(--primary)'
                            strokeOpacity={0.7}
                            strokeWidth='1.2'
                        />
                        <SketchText x={mid} y={87} size={11.5} bold accent>
                            {part.code}
                        </SketchText>
                        <line x1={mid} y1={104} x2={mid} y2={128} stroke='currentColor' strokeOpacity={0.4} strokeWidth='1' />
                        <SketchText x={mid} y={146} size={11} bold body>
                            {part.label}
                        </SketchText>
                        <SketchText x={mid} y={166} size={9.5} body opacity={0.75}>
                            {part.sub}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={450} y={34} size={10} opacity={0.7}>
                SELECT title, … , পুরো এই অংশটা একটা Column
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. প্রথম সত্য শর্তই জেতে                                                    */
/* ------------------------------------------------------------------------- */

function Ladder({
    gates,
    stopAt,
    result,
}: {
    gates: { text: string; truth: boolean }[];
    stopAt: number;
    result: string;
}) {
    return (
        <>
            <defs>
                <marker
                    id={`case-ladder-arrow-${result}`}
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <rect x={70} y={10} width={220} height={32} fill='currentColor' fillOpacity={0.05} stroke='currentColor' strokeOpacity={0.4} />
            <SketchText x={180} y={31} size={10.5} bold>
                Sylhet Tea Garden Tour, 7800.00
            </SketchText>
            {gates.map((gate, i) => {
                const y = 64 + i * 54;
                const checked = i <= stopAt;
                const winner = i === stopAt;
                return (
                    <g key={gate.text} opacity={checked ? 1 : 0.35}>
                        <line x1={180} y1={y - 22} x2={180} y2={y} stroke='var(--primary)' strokeWidth='1.2' markerEnd={`url(#case-ladder-arrow-${result})`} />
                        <rect
                            x={60}
                            y={y}
                            width={240}
                            height={30}
                            fill={winner ? 'var(--primary)' : 'transparent'}
                            fillOpacity={winner ? 0.14 : 0}
                            stroke={winner ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={winner ? 1 : 0.45}
                            strokeWidth='1.2'
                        />
                        <SketchText x={180} y={y + 19} size={10.5} accent={winner} bold={winner}>
                            {gate.text}
                        </SketchText>
                        <SketchText x={318} y={y + 19} size={10} anchor='start' accent={winner} opacity={checked ? 1 : 0.6}>
                            {checked ? (gate.truth ? 'সত্য, এখানেই শেষ' : 'মিথ্যা, পরেরটায় যায়') : 'দেখাই হয় না'}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={180} y={240} size={12} bold accent>
                ফলাফল: {result}
            </SketchText>
        </>
    );
}

/** The same row through two orderings of the same WHEN branches. */
export function FirstTrueWinsSplit() {
    return (
        <SketchSplit
            label='প্রথম সত্য শর্তই জেতে'
            caption='একই তিনটা শর্ত, শুধু ক্রম আলাদা। ডানদিকে প্রথম শর্তটা এত চওড়া যে ৫০০০ এর বেশি দামের সবাই সেখানেই আটকে যায়, Premium পর্যন্ত কেউ পৌঁছায় না। এই Query এর জন্য PostgreSQL কোনো Error দেয় না, শুধু চুপচাপ ভুল উত্তর দেয়।'
            panels={[
                {
                    title: 'সঠিক ক্রম',
                    sub: 'ছোট থেকে বড়',
                    viewBox: '0 0 420 252',
                    height: 252,
                    minWidth: 380,
                    children: (
                        <Ladder
                            result='Budget'
                            stopAt={0}
                            gates={[
                                { text: 'WHEN price_bdt < 8000', truth: true },
                                { text: 'WHEN price_bdt < 15000', truth: true },
                                { text: 'ELSE', truth: true },
                            ]}
                        />
                    ),
                },
                {
                    title: 'উল্টো ক্রম',
                    sub: 'চওড়া শর্ত আগে',
                    viewBox: '0 0 420 252',
                    height: 252,
                    minWidth: 380,
                    children: (
                        <Ladder
                            result='Standard'
                            stopAt={0}
                            gates={[
                                { text: 'WHEN price_bdt >= 5000', truth: true },
                                { text: 'WHEN price_bdt >= 15000', truth: false },
                                { text: 'ELSE', truth: true },
                            ]}
                        />
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Simple CASE বনাম Searched CASE                                          */
/* ------------------------------------------------------------------------- */

function CodeLines({ lines, highlight }: { lines: string[]; highlight: number[] }) {
    return (
        <>
            {lines.map((line, i) => (
                <SketchText
                    key={line}
                    x={20}
                    y={34 + i * 24}
                    anchor='start'
                    size={11}
                    accent={highlight.includes(i)}
                    bold={highlight.includes(i)}>
                    {line}
                </SketchText>
            ))}
        </>
    );
}

export function SimpleVsSearchedSplit() {
    return (
        <SketchSplit
            label='দুই রকম CASE'
            caption='Simple CASE একটা Column বা মান একবার লিখে তার সাথে প্রতিটা WHEN এর সমান কিনা মেলায়। Searched CASE এর প্রতিটা WHEN একটা পূর্ণ শর্ত, তাই সেখানে <, BETWEEN, IS NULL, AND সবই চলে। Simple দিয়ে যা লেখা যায় তার সবটা Searched দিয়েও লেখা যায়, উল্টোটা না।'
            panels={[
                {
                    title: 'Simple CASE',
                    sub: 'শুধু সমান কিনা',
                    viewBox: '0 0 400 200',
                    height: 200,
                    minWidth: 360,
                    children: (
                        <>
                            <CodeLines
                                highlight={[0]}
                                lines={[
                                    'CASE status',
                                    "  WHEN 'confirmed' THEN 'Confirmed'",
                                    "  WHEN 'pending'   THEN 'Waiting'",
                                    "  ELSE 'Cancelled'",
                                    'END',
                                ]}
                            />
                            <SketchText x={20} y={178} anchor='start' size={10} body opacity={0.75}>
                                status একবার লিখলেই হয়, কিন্তু WHEN NULL কখনো মেলে না
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'Searched CASE',
                    sub: 'যেকোনো শর্ত',
                    viewBox: '0 0 400 200',
                    height: 200,
                    minWidth: 360,
                    children: (
                        <>
                            <CodeLines
                                highlight={[1, 2]}
                                lines={[
                                    'CASE',
                                    "  WHEN guide_id IS NULL THEN 'No guide'",
                                    "  WHEN price_bdt < 8000 THEN 'Budget'",
                                    "  ELSE 'Regular'",
                                    'END',
                                ]}
                            />
                            <SketchText x={20} y={178} anchor='start' size={10} body opacity={0.75}>
                                প্রতিটা WHEN আলাদা Column নিয়েও প্রশ্ন করতে পারে
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. পুরো Module 03, একটা Query এর যাত্রায়                                    */
/* ------------------------------------------------------------------------- */

const STAGES = [
    { code: 'FROM tours', lesson: 'Lesson 01', idea: 'কোন Table' },
    { code: 'WHERE', lesson: 'Lesson 03, 04, 05', idea: 'কোন Row থাকবে' },
    { code: 'SELECT … CASE', lesson: 'Lesson 01, 09', idea: 'কোন Column, কী লেবেল' },
    { code: 'DISTINCT', lesson: 'Lesson 08', idea: 'একই Row একবার' },
    { code: 'ORDER BY', lesson: 'Lesson 06', idea: 'কোন ক্রমে' },
    { code: 'LIMIT', lesson: 'Lesson 07', idea: 'কয়টা' },
];

/** The logical order of a query with the Module 03 lesson that owns each step. */
export function ModuleThreeStoryDiagram() {
    const w = 132;
    const gap = 22;
    return (
        <Sketch
            label='Module 03: একটা Query, ছয়টা ধাপ'
            height={230}
            minWidth={940}
            viewBox='0 0 940 230'
            caption='Lesson 02 এর সেই ক্রম, এবার পুরো মডিউল বসিয়ে। Database Query টা এই ক্রমে চালায়, আপনি যে ক্রমে লেখেন সেভাবে না। NULL এর নিয়ম (Lesson 05) সবচেয়ে বেশি কাজ করে WHERE এর ধাপে, যেখানে অজানা মানের Row চুপচাপ বাদ পড়ে।'>
            <defs>
                <marker
                    id='case-story-arrow'
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
                const x = 20 + i * (w + gap);
                const mid = x + w / 2;
                return (
                    <g key={stage.code}>
                        <SketchText x={mid} y={40} size={9.5} opacity={0.6}>
                            ধাপ {i + 1}
                        </SketchText>
                        <rect
                            x={x}
                            y={52}
                            width={w}
                            height={48}
                            fill='var(--primary)'
                            fillOpacity={stage.code.includes('CASE') ? 0.16 : 0.05}
                            stroke='var(--primary)'
                            strokeOpacity={0.75}
                            strokeWidth='1.2'
                        />
                        <SketchText x={mid} y={81} size={11} bold accent>
                            {stage.code}
                        </SketchText>
                        <SketchText x={mid} y={128} size={10.5} body bold>
                            {stage.idea}
                        </SketchText>
                        <SketchText x={mid} y={150} size={9.5} opacity={0.7}>
                            {stage.lesson}
                        </SketchText>
                        {i < STAGES.length - 1 && (
                            <line
                                x1={x + w + 3}
                                y1={76}
                                x2={x + w + gap - 3}
                                y2={76}
                                stroke='var(--primary)'
                                strokeWidth='1.3'
                                markerEnd='url(#case-story-arrow)'
                            />
                        )}
                    </g>
                );
            })}
            <SketchText x={470} y={196} size={10.5} body opacity={0.8}>
                ফলাফল একটা নতুন অস্থায়ী Table, যেটা Database আপনাকে ফেরত দেয়
            </SketchText>
        </Sketch>
    );
}
