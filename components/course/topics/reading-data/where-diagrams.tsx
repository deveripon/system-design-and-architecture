import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. WHERE একটা চালনি: প্রতিটা Row পরীক্ষা, শুধু true গুলো পার হয়             */
/* ------------------------------------------------------------------------- */

/** The nine tours as they are in the sample database. */
const TOURS = [
    { title: 'Saint Martin Island Escape', price: '12500.00' },
    { title: "Cox's Bazar Beach Weekend", price: '8500.00' },
    { title: 'Sundarbans Mangrove Cruise', price: '18000.00' },
    { title: 'Sajek Valley Cloud Trip', price: '9500.00' },
    { title: 'Bandarban Hill Trek', price: '14000.00' },
    { title: 'Sylhet Tea Garden Tour', price: '7800.00' },
    { title: 'Ratargul Swamp Boat Day', price: '3500.00' },
    { title: 'Saint Martin Luxury Stay', price: '32000.00' },
    { title: "Cox's Bazar Family Package", price: '15500.00' },
];

export function WhereSieveDiagram() {
    const rowY = (i: number) => 86 + i * 32;
    return (
        <Sketch
            label='WHERE: Row ধরে ধরে পরীক্ষা'
            height={420}
            minWidth={960}
            viewBox='0 0 960 420'
            caption='WHERE price_bdt < 10000 প্রতিটা Row এর জন্য আলাদা করে একটা প্রশ্ন করে। যে Row এর উত্তর true, শুধু সে ডানদিকের ফলাফলে যায়। বাকি পাঁচটা Row মুছে যায় না, Table এ যেমন ছিল তেমনই থাকে, শুধু এই Query র ফলাফলে আসে না।'>
            <defs>
                <marker
                    id='where-sieve-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            <SketchText x={20} y={40} anchor='start' size={11} bold>
                tours, ৯টা Row
            </SketchText>
            <SketchText x={400} y={40} anchor='start' size={11} bold accent>
                WHERE price_bdt &lt; 10000
            </SketchText>
            <SketchText x={690} y={40} anchor='start' size={11} bold>
                ফলাফল, ৪টা Row
            </SketchText>
            <line x1={20} y1={54} x2={940} y2={54} stroke='currentColor' strokeOpacity={0.25} />

            {TOURS.map((tour, i) => {
                const pass = Number(tour.price) < 10000;
                const y = rowY(i);
                return (
                    <g key={tour.title}>
                        <rect
                            x={16}
                            y={y - 18}
                            width={350}
                            height={26}
                            fill={pass ? 'var(--primary)' : 'transparent'}
                            fillOpacity={pass ? 0.08 : 0}
                            stroke='currentColor'
                            strokeOpacity={0.25}
                        />
                        <SketchText x={26} y={y} anchor='start' size={10.5}>
                            {tour.title}
                        </SketchText>
                        <SketchText x={356} y={y} anchor='end' size={10.5} opacity={0.8}>
                            {tour.price}
                        </SketchText>

                        <SketchText x={400} y={y} anchor='start' size={10.5} opacity={0.75}>
                            {tour.price} &lt; 10000
                        </SketchText>
                        <SketchText x={600} y={y} anchor='start' size={10.5} bold accent={pass} opacity={pass ? 1 : 0.5}>
                            {pass ? 'true' : 'false'}
                        </SketchText>

                        {pass ? (
                            <>
                                <line
                                    x1={644}
                                    y1={y - 4}
                                    x2={682}
                                    y2={y - 4}
                                    stroke='var(--primary)'
                                    strokeWidth='1.4'
                                    markerEnd='url(#where-sieve-arrow)'
                                />
                                <rect
                                    x={690}
                                    y={y - 18}
                                    width={250}
                                    height={26}
                                    fill='var(--primary)'
                                    fillOpacity={0.1}
                                    stroke='var(--primary)'
                                    strokeOpacity={0.7}
                                />
                                <SketchText x={700} y={y} anchor='start' size={10.5} accent>
                                    {tour.title}
                                </SketchText>
                            </>
                        ) : (
                            <SketchText x={660} y={y} anchor='start' size={10} body opacity={0.45}>
                                বাদ
                            </SketchText>
                        )}
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. AND আর OR এর সত্যতার ছক                                                  */
/* ------------------------------------------------------------------------- */

function TruthGrid({ op }: { op: 'AND' | 'OR' }) {
    const rows: [boolean, boolean][] = [
        [true, true],
        [true, false],
        [false, true],
        [false, false],
    ];
    const cols = [30, 130, 250];
    return (
        <>
            {['A', 'B', `A ${op} B`].map((head, i) => (
                <SketchText key={head} x={cols[i]} y={26} anchor='start' size={11} bold accent={i === 2}>
                    {head}
                </SketchText>
            ))}
            <line x1={20} y1={38} x2={360} y2={38} stroke='currentColor' strokeOpacity={0.3} />
            {rows.map(([a, b], r) => {
                const result = op === 'AND' ? a && b : a || b;
                const y = 66 + r * 30;
                return (
                    <g key={r}>
                        {result && (
                            <rect x={20} y={y - 19} width={340} height={26} fill='var(--primary)' fillOpacity={0.08} />
                        )}
                        <SketchText x={cols[0]} y={y} anchor='start' size={11} opacity={0.85}>
                            {String(a)}
                        </SketchText>
                        <SketchText x={cols[1]} y={y} anchor='start' size={11} opacity={0.85}>
                            {String(b)}
                        </SketchText>
                        <SketchText x={cols[2]} y={y} anchor='start' size={11} bold accent={result} opacity={result ? 1 : 0.6}>
                            {String(result)}
                        </SketchText>
                    </g>
                );
            })}
        </>
    );
}

export function TruthTableSplit() {
    return (
        <SketchSplit
            label='AND আর OR: কখন true হয়'
            caption='AND শুধু তখনই true, যখন দুই পাশই true। OR true, যখন অন্তত এক পাশ true। তাই AND যোগ করলে ফলাফল ছোট হয় বা একই থাকে, OR যোগ করলে বড় হয় বা একই থাকে। NULL এলে ছকে তৃতীয় একটা মান ঢোকে, সেটা Lesson 05 এর বিষয়।'
            panels={[
                {
                    title: 'AND',
                    sub: 'দুটোই লাগবে',
                    viewBox: '0 0 380 170',
                    height: 170,
                    children: <TruthGrid op='AND' />,
                },
                {
                    title: 'OR',
                    sub: 'একটা হলেই চলে',
                    viewBox: '0 0 380 170',
                    height: 170,
                    children: <TruthGrid op='OR' />,
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. AND আগে জোড়া লাগে: একই লেখার দুই রকম পাঠ                                 */
/* ------------------------------------------------------------------------- */

const PARTS = [
    { x: 40, w: 200, text: "status = 'confirmed'" },
    { x: 310, w: 190, text: "status = 'pending'" },
    { x: 580, w: 130, text: 'seats >= 3' },
];

function ConditionRow({ y, group, label, count }: { y: number; group: [number, number]; label: string; count: string }) {
    const from = PARTS[group[0]];
    const to = PARTS[group[1]];
    return (
        <g>
            <SketchText x={40} y={y - 44} anchor='start' size={10.5} body bold>
                {label}
            </SketchText>
            <rect
                x={from.x - 12}
                y={y - 30}
                width={to.x + to.w - from.x + 24}
                height={50}
                rx={10}
                fill='var(--primary)'
                fillOpacity={0.06}
                stroke='var(--primary)'
                strokeDasharray='5 4'
                strokeWidth='1.2'
            />
            {PARTS.map(part => (
                <g key={part.text}>
                    <rect x={part.x} y={y - 20} width={part.w} height={30} fill='var(--card)' stroke='currentColor' strokeOpacity={0.45} />
                    <SketchText x={part.x + part.w / 2} y={y} size={11}>
                        {part.text}
                    </SketchText>
                </g>
            ))}
            <SketchText x={275} y={y} size={11} bold accent>
                OR
            </SketchText>
            <SketchText x={545} y={y} size={11} bold accent>
                AND
            </SketchText>
            <SketchText x={790} y={y - 6} anchor='start' size={22} bold accent>
                {count}
            </SketchText>
            <SketchText x={790} y={y + 14} anchor='start' size={10} body opacity={0.75}>
                Row ফেরত আসে
            </SketchText>
        </g>
    );
}

export function PrecedenceDiagram() {
    return (
        <Sketch
            label='AND আগে জোড়া লাগে'
            height={300}
            minWidth={960}
            viewBox='0 0 960 300'
            caption='একই তিনটা শর্ত, একই ক্রমে লেখা। Parentheses ছাড়া PostgreSQL আগে AND এর দুই পাশ জোড়া দেয়, তাই অর্থ দাঁড়ায়: সব confirmed, আর pending এর মধ্যে যেগুলোর seats ৩ বা বেশি। Parentheses দিলে আপনি নিজে ঠিক করে দেন কোনটা আগে জোড়া লাগবে।'>
            <ConditionRow y={100} group={[1, 2]} label='Parentheses ছাড়া, PostgreSQL যেভাবে পড়ে' count='18' />
            <ConditionRow y={230} group={[0, 1]} label='Parentheses দিয়ে, আপনি যা চেয়েছিলেন' count='6' />
        </Sketch>
    );
}
