import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. সমান মানে তিন রকম নম্বর                                                    */
/* ------------------------------------------------------------------------- */

/* Customers 3 to 7 of the real confirmed-spend leaderboard (PostgreSQL 18). */
const TIE_ROWS = [
    { name: 'Rahim Uddin', spent: '44000.00', rn: 3, rk: 3, dr: 3, tie: false },
    { name: 'Farhana Akter', spent: '36000.00', rn: 4, rk: 4, dr: 4, tie: true },
    { name: 'Mitu Rahman', spent: '36000.00', rn: 5, rk: 4, dr: 4, tie: true },
    { name: 'Lamia Haque', spent: '36000.00', rn: 6, rk: 4, dr: 4, tie: true },
    { name: 'Oliver Bennett', spent: '28000.00', rn: 7, rk: 7, dr: 5, tie: false },
];

/**
 * The three numbering functions side by side on the real three-way tie at
 * 36000. ROW_NUMBER keeps counting, RANK repeats then jumps, DENSE_RANK
 * repeats then carries on with the next number.
 */
export function ThreeNumbersDiagram() {
    const top = 70;
    const rowH = 40;
    const cols = [
        { x: 470, label: 'ROW_NUMBER', key: 'rn' as const },
        { x: 600, label: 'RANK', key: 'rk' as const },
        { x: 730, label: 'DENSE_RANK', key: 'dr' as const },
    ];
    return (
        <Sketch
            label='Ties: three ways to number the same rows'
            height={330}
            minWidth={820}
            viewBox='0 0 820 330'
            caption='Island Tours এর আসল তালিকা, confirmed খরচ অনুযায়ী তৃতীয় থেকে সপ্তম জন। মাঝের তিনজনের খরচ হুবহু 36000.00। ROW_NUMBER তাঁদের তিনটা আলাদা নম্বর দেয়, কে কোনটা পাবেন সেটা ঠিক করা নেই। RANK তিনজনকেই 4 দেয়, তারপর সরাসরি 7 এ লাফ দেয়, কারণ তাঁর আগে ছয়জন আছেন। DENSE_RANK তিনজনকে 4 দিয়ে পরের জনকে দেয় 5, কোনো ফাঁক রাখে না।'>
            <SketchText x={40} y={40} anchor='start' size={10} bold opacity={0.75}>
                customer
            </SketchText>
            <SketchText x={330} y={40} anchor='end' size={10} bold opacity={0.75}>
                spent
            </SketchText>
            {cols.map(c => (
                <SketchText key={c.label} x={c.x} y={40} size={10} bold accent>
                    {c.label}
                </SketchText>
            ))}

            {/* the tie group */}
            <rect
                x={28}
                y={top + rowH - 26}
                width={770}
                height={rowH * 3}
                fill='var(--primary)'
                fillOpacity={0.07}
                stroke='var(--primary)'
                strokeOpacity={0.6}
                strokeDasharray='5 4'
                strokeWidth='1.1'
            />

            {TIE_ROWS.map((row, i) => {
                const y = top + i * rowH;
                return (
                    <g key={row.name}>
                        <SketchText x={40} y={y} anchor='start' size={11} body>
                            {row.name}
                        </SketchText>
                        <SketchText x={330} y={y} anchor='end' size={11}>
                            {row.spent}
                        </SketchText>
                        {cols.map(c => (
                            <SketchText
                                key={c.label}
                                x={c.x}
                                y={y}
                                size={13}
                                bold
                                accent={row.tie}
                                opacity={row.tie && c.key === 'rn' ? 0.6 : 1}>
                                {row[c.key]}
                                {row.tie && c.key === 'rn' ? ' ?' : ''}
                            </SketchText>
                        ))}
                    </g>
                );
            })}

            <SketchText x={470} y={292} size={9.5} body opacity={0.8}>
                তিনজনকে 4, 5, 6, যেকোনো ক্রমে
            </SketchText>
            <SketchText x={600} y={292} size={9.5} body opacity={0.8}>
                4, 4, 4, তারপর 7
            </SketchText>
            <SketchText x={730} y={292} size={9.5} body opacity={0.8}>
                4, 4, 4, তারপর 5
            </SketchText>
            <SketchText x={600} y={312} size={9} opacity={0.6}>
                5 আর 6 কেউ পান না
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. নম্বর কে ঠিক করে, আর দেখানোর ক্রম কে                                       */
/* ------------------------------------------------------------------------- */

const FOUR = [
    { title: 'Bandarban Hill Trek', price: '14000.00', rank: 4 },
    { title: "Cox's Bazar Beach Weekend", price: '8500.00', rank: 7 },
    { title: "Cox's Bazar Family Package", price: '15500.00', rank: 3 },
    { title: 'Ratargul Swamp Boat Day', price: '3500.00', rank: 9 },
];

/**
 * The ORDER BY inside OVER decides which number each row gets; the ORDER BY at
 * the end decides only the order rows are shown in. Same four tours, same
 * numbers, two different orders on screen.
 */
export function TwoOrdersSplit() {
    const byRank = [...FOUR].sort((a, b) => a.rank - b.rank);
    const rowsOf = (rows: typeof FOUR) =>
        rows.map((r, i) => (
            <g key={r.title}>
                <SketchText x={14} y={66 + i * 30} anchor='start' size={10} body>
                    {r.title}
                </SketchText>
                <SketchText x={300} y={66 + i * 30} anchor='end' size={10}>
                    {r.price}
                </SketchText>
                <SketchText x={350} y={66 + i * 30} size={11} bold accent>
                    {r.rank}
                </SketchText>
            </g>
        ));
    return (
        <SketchSplit
            label='ORDER BY inside OVER vs the final ORDER BY'
            caption='দুই পাশে একই চারটা ট্যুর, একই নম্বর। নম্বরটা ঠিক করেছে OVER এর ভেতরের ORDER BY price_bdt DESC, তাই সবচেয়ে দামি Family Package পেয়েছে 3, সবচেয়ে সস্তা Ratargul 9। কোন Row আগে দেখাবে, সেটা ঠিক করে Query এর শেষের ORDER BY। বাঁ পাশে শেষে ORDER BY title, তাই নামের ক্রম। ডান পাশে শেষে ORDER BY price_rank, তাই নম্বরের ক্রম। দুটো আলাদা কাজ, একটা আরেকটাকে বদলায় না।'
            panels={[
                {
                    title: '... ORDER BY title',
                    sub: 'নামের ক্রমে দেখানো',
                    viewBox: '0 0 380 190',
                    height: 190,
                    minWidth: 330,
                    children: (
                        <>
                            <SketchText x={14} y={30} anchor='start' size={9.5} bold opacity={0.7}>
                                title
                            </SketchText>
                            <SketchText x={300} y={30} anchor='end' size={9.5} bold opacity={0.7}>
                                price_bdt
                            </SketchText>
                            <SketchText x={350} y={30} size={9.5} bold accent>
                                rank
                            </SketchText>
                            {rowsOf(FOUR)}
                        </>
                    ),
                },
                {
                    title: '... ORDER BY price_rank',
                    sub: 'নম্বরের ক্রমে দেখানো',
                    viewBox: '0 0 380 190',
                    height: 190,
                    minWidth: 330,
                    children: (
                        <>
                            <SketchText x={14} y={30} anchor='start' size={9.5} bold opacity={0.7}>
                                title
                            </SketchText>
                            <SketchText x={300} y={30} anchor='end' size={9.5} bold opacity={0.7}>
                                price_bdt
                            </SketchText>
                            <SketchText x={350} y={30} size={9.5} bold accent>
                                rank
                            </SketchText>
                            {rowsOf(byRank)}
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. আগে নম্বর, তারপর বাছাই                                                     */
/* ------------------------------------------------------------------------- */

/**
 * Why a rank cannot be filtered in the same WHERE: WHERE runs before the
 * window numbers exist. Number inside a CTE, then filter outside it.
 */
export function WrapThenFilterDiagram() {
    const steps = [
        { x: 30, title: 'FROM, JOIN', sub: 'Row গুলো আসে' },
        { x: 220, title: 'WHERE', sub: 'নম্বর এখনো নেই' },
        { x: 410, title: 'rank() OVER', sub: 'এবার নম্বর বসে' },
        { x: 600, title: 'বাইরের WHERE', sub: 'rnk <= 5 চলে এখানে' },
    ];
    return (
        <Sketch
            label='Number first, then filter: the CTE wrap'
            height={250}
            minWidth={820}
            viewBox='0 0 820 250'
            caption='একটা Query এর ভেতরে WHERE চলে Window Function এর আগে। তাই একই Query এর WHERE এ rank() লিখলে PostgreSQL বলে window functions are not allowed in WHERE, কারণ ঐ সময় নম্বরগুলো তৈরিই হয়নি। সমাধান দুই ধাপ: CTE এর ভেতরে নম্বর বসান, তারপর CTE এর বাইরের WHERE এ সেই নম্বর দিয়ে বাছাই করুন। ডানের শেষ বাক্সটাই বাইরের Query।'>
            <defs>
                <marker
                    id='rank-wrap-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* the CTE boundary */}
            <rect x={18} y={40} width={570} height={130} fill='transparent' stroke='currentColor' strokeOpacity={0.35} strokeDasharray='5 4' strokeWidth='1.1' />
            <SketchText x={30} y={60} anchor='start' size={9.5} bold opacity={0.7}>
                WITH ranked AS ( ... )
            </SketchText>

            {steps.map((s, i) => {
                const outer = i === 3;
                return (
                    <g key={s.title}>
                        <rect
                            x={s.x}
                            y={80}
                            width={170}
                            height={70}
                            fill={outer || i === 2 ? 'var(--primary)' : 'transparent'}
                            fillOpacity={outer || i === 2 ? 0.1 : 0}
                            stroke={outer || i === 2 ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={outer || i === 2 ? 1 : 0.45}
                            strokeWidth='1.2'
                        />
                        <SketchText x={s.x + 85} y={110} size={11} bold accent={outer || i === 2}>
                            {s.title}
                        </SketchText>
                        <SketchText x={s.x + 85} y={132} size={9.5} body opacity={0.8}>
                            {s.sub}
                        </SketchText>
                        {i < 3 && (
                            <line
                                x1={s.x + 172}
                                y1={115}
                                x2={s.x + 188}
                                y2={115}
                                stroke='var(--primary)'
                                strokeWidth='1.4'
                                markerEnd='url(#rank-wrap-arrow)'
                            />
                        )}
                    </g>
                );
            })}

            {/* the forbidden spot */}
            <SketchText x={305} y={196} size={10} bold opacity={0.85}>
                এখানে rank() লিখলে ERROR
            </SketchText>
            <SketchText x={685} y={196} size={10} bold accent>
                এখানে rnk {'<='} 5 ঠিক আছে
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. শতাংশে অবস্থান: PERCENT_RANK আর CUME_DIST                                  */
/* ------------------------------------------------------------------------- */

/* The ten real ratings, sorted, with both values from PostgreSQL 18. */
const SPOTS = [
    { rating: 2, count: 1, pr: 0, cd: 0.1 },
    { rating: 3, count: 1, pr: 0.111, cd: 0.2 },
    { rating: 4, count: 4, pr: 0.222, cd: 0.6 },
    { rating: 5, count: 4, pr: 0.667, cd: 1 },
];

/**
 * Both functions place each row on a 0 to 1 line. PERCENT_RANK counts the rows
 * strictly before it; CUME_DIST counts every row up to and including its ties.
 */
export function PercentLineDiagram() {
    const x0 = 80;
    const x1 = 760;
    const at = (v: number) => x0 + (x1 - x0) * v;
    return (
        <Sketch
            label='PERCENT_RANK and CUME_DIST on the ten real ratings'
            height={300}
            minWidth={840}
            viewBox='0 0 840 300'
            caption='দশটা Review এর rating, ছোট থেকে বড়। উপরের দাগে PERCENT_RANK: (rank - 1) / (মোট Row - 1), মানে আমার আগে কতজন, শতাংশে। সবচেয়ে ছোটটা সবসময় 0। নিচের দাগে CUME_DIST: আমি আর আমার সমান সবাই মিলিয়ে কতজন, মোটের কত ভাগ। সবচেয়ে বড়টা সবসময় 1। চারটা 4 এর PERCENT_RANK 0.222, কারণ তাঁদের আগে দুজন, আর CUME_DIST 0.6, কারণ তাঁরা সহ ছয়জন।'>
            {[
                { y: 90, label: 'PERCENT_RANK', key: 'pr' as const },
                { y: 210, label: 'CUME_DIST', key: 'cd' as const },
            ].map(line => (
                <g key={line.label}>
                    <SketchText x={x0} y={line.y - 44} anchor='start' size={10} bold accent>
                        {line.label}
                    </SketchText>
                    <line x1={x0} y1={line.y} x2={x1} y2={line.y} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
                    {[0, 0.25, 0.5, 0.75, 1].map(t => (
                        <g key={t}>
                            <line x1={at(t)} y1={line.y - 5} x2={at(t)} y2={line.y + 5} stroke='currentColor' strokeOpacity={0.5} />
                            <SketchText x={at(t)} y={line.y + 22} size={9} opacity={0.6}>
                                {t}
                            </SketchText>
                        </g>
                    ))}
                    {SPOTS.map(s => (
                        <g key={s.rating}>
                            <circle cx={at(s[line.key])} cy={line.y} r={6 + s.count} fill='var(--primary)' fillOpacity={0.25} stroke='var(--primary)' strokeWidth='1.2' />
                            <SketchText x={at(s[line.key])} y={line.y - 16} size={9.5} bold accent>
                                {`${s.rating}★ ×${s.count}`}
                            </SketchText>
                            <SketchText x={at(s[line.key])} y={line.y + 38} size={9}>
                                {s[line.key]}
                            </SketchText>
                        </g>
                    ))}
                </g>
            ))}
        </Sketch>
    );
}
