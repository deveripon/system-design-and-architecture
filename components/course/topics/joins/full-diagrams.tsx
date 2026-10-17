import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Real rows, as the sample database holds them                               */
/* ------------------------------------------------------------------------- */

/** The tours in guide order, so the pairing lines run side by side. */
const TOUR_ROWS: { title: string; guide: string | null }[] = [
    { title: 'Saint Martin Island Escape', guide: 'Jamal Hossain' },
    { title: 'Sajek Valley Cloud Trip', guide: 'Jamal Hossain' },
    { title: "Cox's Bazar Beach Weekend", guide: 'Shirin Akter' },
    { title: 'Sylhet Tea Garden Tour', guide: 'Shirin Akter' },
    { title: 'Sundarbans Mangrove Cruise', guide: 'Rubel Mia' },
    { title: "Cox's Bazar Family Package", guide: 'Rubel Mia' },
    { title: 'Bandarban Hill Trek', guide: 'Ayesha Siddiqua' },
    { title: 'Saint Martin Luxury Stay', guide: 'Ayesha Siddiqua' },
    { title: 'Ratargul Swamp Boat Day', guide: null },
];

const GUIDE_ROWS = ['Jamal Hossain', 'Shirin Akter', 'Rubel Mia', 'Ayesha Siddiqua', 'Nazmul Karim'];

/* ------------------------------------------------------------------------- */
/* 1. একটা FULL JOIN এর তিন রকম Row                                            */
/* ------------------------------------------------------------------------- */

/**
 * The lesson's main picture on the real data: five guides on the left, nine
 * tours on the right, a line for every matching pair, and the one row left
 * alone on each side.
 */
export function FullJoinPartsDiagram() {
    const rowY = (i: number) => 52 + i * 38;
    const tourCenter = (i: number) => rowY(i) + 15;
    const guideCenter = (name: string) => {
        if (name === 'Nazmul Karim') return tourCenter(9);
        const idx = TOUR_ROWS.map((t, i) => (t.guide === name ? i : -1)).filter(i => i >= 0);
        return (tourCenter(idx[0]) + tourCenter(idx[idx.length - 1])) / 2;
    };

    return (
        <Sketch
            label='FULL OUTER JOIN: Three Kinds of Rows'
            height={500}
            minWidth={900}
            viewBox='0 0 960 500'
            caption='আসল Data: বামে guides Table এর পাঁচজন, ডানে tours Table এর নয়টা ট্যুর। প্রতিটা দাগ একটা মিল, মানে ট্যুরের guide_id আর Guide এর guide_id সমান। আটটা মিল, তার সাথে বামে একা Nazmul Karim, যাঁর এখনো কোনো ট্যুর নেই, আর ডানে একা Ratargul Swamp Boat Day, যার এখনো কোনো Guide নেই। FULL OUTER JOIN তিন রকম Row ই রাখে: 8 + 1 + 1 = 10।'>
            <SketchText x={175} y={30} size={11} bold>
                guides (৫টা Row)
            </SketchText>
            <SketchText x={785} y={30} size={11} bold>
                tours (৯টা Row)
            </SketchText>

            {TOUR_ROWS.filter(t => t.guide).map((t, i) => (
                <line
                    key={t.title}
                    x1={290}
                    y1={guideCenter(t.guide!)}
                    x2={670}
                    y2={tourCenter(i)}
                    stroke='var(--primary)'
                    strokeOpacity={0.55}
                    strokeWidth='1.3'
                />
            ))}

            {GUIDE_ROWS.map(name => {
                const lonely = name === 'Nazmul Karim';
                const cy = guideCenter(name);
                return (
                    <g key={name}>
                        <rect
                            x={60}
                            y={cy - 16}
                            width={230}
                            height={32}
                            fill={lonely ? 'var(--primary)' : 'var(--card)'}
                            fillOpacity={lonely ? 0.1 : 1}
                            stroke={lonely ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={lonely ? 1 : 0.45}
                            strokeDasharray={lonely ? '5 4' : undefined}
                            strokeWidth='1.2'
                        />
                        <SketchText x={175} y={cy + 4} size={10.5} bold={lonely} accent={lonely}>
                            {name}
                        </SketchText>
                        {lonely && (
                            <SketchText x={175} y={cy + 34} size={10} body accent>
                                শুধু বামে: কোনো ট্যুর নেই
                            </SketchText>
                        )}
                    </g>
                );
            })}

            {TOUR_ROWS.map((t, i) => {
                const lonely = t.guide === null;
                return (
                    <g key={t.title}>
                        <rect
                            x={670}
                            y={rowY(i)}
                            width={230}
                            height={30}
                            fill={lonely ? 'var(--primary)' : 'var(--card)'}
                            fillOpacity={lonely ? 0.1 : 1}
                            stroke={lonely ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={lonely ? 1 : 0.45}
                            strokeDasharray={lonely ? '5 4' : undefined}
                            strokeWidth='1.2'
                        />
                        <SketchText x={785} y={rowY(i) + 19} size={9.5} bold={lonely} accent={lonely}>
                            {t.title}
                        </SketchText>
                        {lonely && (
                            <SketchText x={785} y={rowY(i) + 48} size={10} body accent>
                                শুধু ডানে: কোনো Guide নেই
                            </SketchText>
                        )}
                    </g>
                );
            })}

            <SketchText x={480} y={470} size={13} bold accent>
                8 মিল + 1 শুধু বামে + 1 শুধু ডানে = 10 Row
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. চার রকম Join, কোনটা কী রাখে                                               */
/* ------------------------------------------------------------------------- */

const JOIN_ROWS: { name: string; keeps: [boolean, boolean, boolean]; total: number }[] = [
    { name: 'INNER JOIN', keeps: [true, false, false], total: 8 },
    { name: 'LEFT JOIN', keeps: [true, true, false], total: 9 },
    { name: 'RIGHT JOIN', keeps: [true, false, true], total: 9 },
    { name: 'FULL OUTER JOIN', keeps: [true, true, true], total: 10 },
];

/**
 * Every join type is the same three piles of rows, kept or thrown away. The
 * counts are the real ones for guides joined to tours.
 */
export function FourJoinsDiagram() {
    const cols = [
        { x: 330, title: 'মিলে যাওয়া', sub: '8 Row' },
        { x: 500, title: 'শুধু বামের', sub: 'Nazmul, 1 Row' },
        { x: 670, title: 'শুধু ডানের', sub: 'Ratargul, 1 Row' },
        { x: 830, title: 'মোট', sub: 'Row সংখ্যা' },
    ];
    return (
        <Sketch
            label='Which Rows Each Join Keeps'
            height={300}
            minWidth={880}
            viewBox='0 0 920 300'
            caption='সব Join আসলে একই তিনটা স্তূপ নিয়ে কাজ করে: মিলে যাওয়া জোড়া, বামের একা Row, আর ডানের একা Row। INNER শুধু প্রথমটা রাখে, LEFT প্রথম দুটো, RIGHT প্রথম আর তৃতীয়টা, FULL তিনটাই। guides FULL JOIN tours এ সংখ্যাগুলো আসল: 8, 9, 9, 10।'>
            {cols.map(c => (
                <g key={c.title}>
                    <SketchText x={c.x} y={40} size={10.5} body bold>
                        {c.title}
                    </SketchText>
                    <SketchText x={c.x} y={58} size={9} opacity={0.7}>
                        {c.sub}
                    </SketchText>
                </g>
            ))}
            {JOIN_ROWS.map((row, r) => {
                const y = 96 + r * 50;
                const isFull = row.name === 'FULL OUTER JOIN';
                return (
                    <g key={row.name}>
                        <rect
                            x={30}
                            y={y - 22}
                            width={870}
                            height={40}
                            fill={isFull ? 'var(--primary)' : 'transparent'}
                            fillOpacity={isFull ? 0.08 : 0}
                            stroke='currentColor'
                            strokeOpacity={0.2}
                        />
                        <SketchText x={50} y={y + 3} size={11} anchor='start' bold accent={isFull}>
                            {row.name}
                        </SketchText>
                        {row.keeps.map((keep, i) => (
                            <SketchText
                                key={i}
                                x={cols[i].x}
                                y={y + 4}
                                size={15}
                                bold
                                accent={keep}
                                opacity={keep ? 1 : 0.35}>
                                {keep ? '✓' : '✗'}
                            </SketchText>
                        ))}
                        <SketchText x={cols[3].x} y={y + 4} size={13} bold accent={isFull}>
                            {String(row.total)}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. WHERE না ON: FULL JOIN এর শর্ত কোথায় বসবে                                   */
/* ------------------------------------------------------------------------- */

type MiniRow = { guide: string; tour: string; mark?: 'gone' | 'new' };

function MiniRows({ rows }: { rows: MiniRow[] }) {
    return (
        <g>
            {rows.map((r, i) => {
                const y = 30 + i * 22;
                const gone = r.mark === 'gone';
                const fresh = r.mark === 'new';
                return (
                    <g key={`${r.guide}-${r.tour}`}>
                        {fresh && (
                            <rect x={4} y={y - 14} width={392} height={20} fill='var(--primary)' fillOpacity={0.12} />
                        )}
                        <SketchText x={12} y={y} size={9.5} anchor='start' opacity={gone ? 0.4 : 0.95} accent={fresh}>
                            {r.guide}
                        </SketchText>
                        <SketchText x={170} y={y} size={9.5} anchor='start' opacity={gone ? 0.4 : 0.95} accent={fresh}>
                            {r.tour}
                        </SketchText>
                        {gone && (
                            <line x1={8} y1={y - 4} x2={392} y2={y - 4} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.1' />
                        )}
                    </g>
                );
            })}
        </g>
    );
}

const BASE: MiniRow[] = [
    { guide: 'Jamal Hossain', tour: 'Saint Martin Island Escape' },
    { guide: 'Jamal Hossain', tour: 'Sajek Valley Cloud Trip' },
    { guide: 'Shirin Akter', tour: "Cox's Bazar Beach Weekend" },
    { guide: 'Shirin Akter', tour: 'Sylhet Tea Garden Tour' },
    { guide: 'Rubel Mia', tour: 'Sundarbans Mangrove Cruise' },
    { guide: 'Rubel Mia', tour: "Cox's Bazar Family Package" },
    { guide: 'Ayesha Siddiqua', tour: 'Bandarban Hill Trek' },
];

/**
 * The same condition, `is_active`, placed in WHERE and in ON. In WHERE it
 * throws rows away after the join; in ON it only changes which rows count as a
 * match, so the inactive tour comes back looking as if it had no guide.
 */
export function OnVsWhereSplit() {
    const whereRows: MiniRow[] = [
        ...BASE,
        { guide: 'Ayesha Siddiqua', tour: 'Saint Martin Luxury Stay', mark: 'gone' },
        { guide: 'Nazmul Karim', tour: '(NULL)', mark: 'gone' },
        { guide: '(NULL)', tour: 'Ratargul Swamp Boat Day' },
    ];
    const onRows: MiniRow[] = [
        ...BASE,
        { guide: 'Nazmul Karim', tour: '(NULL)' },
        { guide: '(NULL)', tour: 'Ratargul Swamp Boat Day' },
        { guide: '(NULL)', tour: 'Saint Martin Luxury Stay', mark: 'new' },
    ];
    return (
        <SketchSplit
            label='The Same Condition in WHERE and in ON'
            caption='বামে: WHERE t.is_active চলে Join এর পরে। Luxury Stay এর is_active false, আর Nazmul এর Row এ ট্যুরই নেই বলে is_active NULL, তাই দুটোই কাটা পড়ে, থাকে আটটা। ডানে: একই শর্ত ON এ বসালে কোনো Row বাদ যায় না, FULL JOIN এ ON শুধু ঠিক করে কোন জোড়া মিল। Luxury Stay আর Ayesha এর জোড়া আর মিল না, তাই ট্যুরটা ডানের একা Row হয়ে ফেরে, যেন তার Guide নেই। মোট দশটা, কিন্তু একটা মিথ্যা কথাসহ।'
            panels={[
                {
                    title: 'WHERE t.is_active',
                    sub: '10 থেকে 8 Row',
                    viewBox: '0 0 400 250',
                    height: 250,
                    minWidth: 380,
                    children: <MiniRows rows={whereRows} />,
                },
                {
                    title: 'ON ... AND t.is_active',
                    sub: 'এখনো 10 Row',
                    viewBox: '0 0 400 250',
                    height: 250,
                    minWidth: 380,
                    children: <MiniRows rows={onRows} />,
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. MySQL এ FULL JOIN জোড়া লাগানো                                             */
/* ------------------------------------------------------------------------- */

function Box({
    x,
    y,
    w,
    h,
    title,
    lines,
    accent,
    dashed,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    lines: string[];
    accent?: boolean;
    dashed?: boolean;
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
                strokeOpacity={accent ? 1 : 0.45}
                strokeDasharray={dashed ? '5 4' : undefined}
                strokeWidth='1.2'
            />
            <SketchText x={x + w / 2} y={y + 24} size={10.5} bold accent={accent}>
                {title}
            </SketchText>
            {lines.map((line, i) => (
                <SketchText key={line} x={x + w / 2} y={y + 46 + i * 18} size={10} body opacity={0.85}>
                    {line}
                </SketchText>
            ))}
        </g>
    );
}

/**
 * MySQL has no FULL JOIN, so it is assembled from two parts: a LEFT JOIN for
 * the matches and the left-only rows, and a RIGHT JOIN cut down to the
 * right-only rows. UNION ALL glues them without losing real duplicates.
 */
export function MysqlEmulationDiagram() {
    return (
        <Sketch
            label='Building a FULL JOIN in MySQL'
            height={300}
            minWidth={920}
            viewBox='0 0 960 300'
            caption='MySQL এ FULL OUTER JOIN নেই, তাই দুই টুকরো জুড়ে বানাতে হয়। প্রথম টুকরো LEFT JOIN: মিল আর বামের একা Row, ৯টা। দ্বিতীয় টুকরো RIGHT JOIN, কিন্তু WHERE g.guide_id IS NULL দিয়ে শুধু ডানের একা Row, ১টা। UNION ALL দুটোকে পাশাপাশি জোড়ে: ১০টা, PostgreSQL এর FULL JOIN এর সমান। শুধু UNION লিখলে সে একই রকম দেখতে Row গুলোকে এক করে ফেলে, আর language আর duration_days এর মতো Column বাছলে ১০টা আসল Row কমে ৬টা হয়ে যায়।'>
            <defs>
                <marker
                    id='full-mysql-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <Box x={20} y={30} w={290} h={100} title='LEFT JOIN' lines={['মিল + শুধু বামের', '8 + 1 = 9 Row']} />
            <Box
                x={20}
                y={160}
                w={290}
                h={110}
                title='RIGHT JOIN'
                lines={['WHERE g.guide_id IS NULL', 'শুধু ডানের, 1 Row']}
            />
            <Box x={380} y={95} w={180} h={90} title='UNION ALL' lines={['দুই টুকরো পাশাপাশি']} accent />
            <Box x={630} y={30} w={300} h={100} title='FULL JOIN এর সমান' lines={['8 + 1 + 1 = 10 Row', 'PostgreSQL এর সাথে মেলে']} accent />
            <Box
                x={630}
                y={160}
                w={300}
                h={110}
                title='শুধু UNION হলে?'
                lines={['একই রকম Row এক হয়ে যায়', 'আসল 10 থেকে 6 Row']}
                dashed
            />
            <line x1={310} y1={80} x2={378} y2={128} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#full-mysql-arrow)' />
            <line x1={310} y1={215} x2={378} y2={160} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#full-mysql-arrow)' />
            <line x1={560} y1={130} x2={628} y2={85} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#full-mysql-arrow)' />
        </Sketch>
    );
}
