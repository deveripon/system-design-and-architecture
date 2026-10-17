import { Sketch, SketchSplit, SketchText } from '../../sketch';

function Arrow({ d, id, dashed }: { d: string; id: string; dashed?: boolean }) {
    return (
        <path
            d={d}
            fill='none'
            stroke='var(--primary)'
            strokeWidth='1.4'
            strokeDasharray={dashed ? '5 4' : undefined}
            markerEnd={`url(#${id})`}
        />
    );
}

function ArrowHead({ id, muted }: { id: string; muted?: boolean }) {
    return (
        <marker id={id} markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
            <path d='M0,0 L7,3.5 L0,7 Z' fill={muted ? 'currentColor' : 'var(--primary)'} />
        </marker>
    );
}

function Node({
    x,
    y,
    w,
    h,
    title,
    sub,
    accent,
    dashed,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    sub?: string;
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
                strokeWidth='1.3'
                strokeDasharray={dashed ? '4 3' : undefined}
            />
            <SketchText x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} size={11} bold accent={accent}>
                {title}
            </SketchText>
            {sub && (
                <SketchText x={x + w / 2} y={y + h / 2 + 14} size={9.5} body opacity={0.75}>
                    {sub}
                </SketchText>
            )}
        </g>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. নিয়ম কোথায় থাকে                                                          */
/* ------------------------------------------------------------------------- */

/**
 * Four ways a row can reach the promo table. Only two pass the API's checks;
 * the CSV import and the hand typed psql session go straight to the database.
 * The constraint gate is the one place every path has to cross.
 */
export function RuleLayersDiagram() {
    const sources = [
        { y: 30, title: 'Website Form', sub: 'Browser এর যাচাই' },
        { y: 110, title: 'Mobile App', sub: 'নিজের যাচাই' },
        { y: 190, title: 'CSV Import', sub: 'psql \\copy দিয়ে' },
        { y: 270, title: 'psql হাতে', sub: 'Admin এর INSERT' },
    ];
    return (
        <Sketch
            label='Where Rules Live'
            height={380}
            minWidth={920}
            viewBox='0 0 940 380'
            caption='Website আর Mobile App দুটোই API Server হয়ে আসে, তাই API এর যাচাই তাদের ধরতে পারে। কিন্তু CSV Import আর হাতে লেখা psql সরাসরি Database এ যায়, API কে পাশ কাটিয়ে। Database এর Constraint একমাত্র দরজা যেটা চারটা পথকেই পার হতে হয়। তাই শেষ পাহারাদার সবসময় Database।'>
            <defs>
                <ArrowHead id='cons-layers-arrow' />
            </defs>
            {sources.map(s => (
                <Node key={s.title} x={20} y={s.y} w={190} h={56} title={s.title} sub={s.sub} />
            ))}

            <Node x={300} y={60} w={190} h={96} title='API Server' sub='Code এ লেখা যাচাই' />
            <SketchText x={395} y={180} size={9.5} body opacity={0.8}>
                সবাই এই পথে আসে না
            </SketchText>

            <rect x={580} y={20} width={340} height={340} fill='var(--primary)' fillOpacity={0.04} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.3' />
            <SketchText x={750} y={44} size={11} bold>
                PostgreSQL
            </SketchText>
            <rect x={610} y={64} width={44} height={276} fill='var(--primary)' fillOpacity={0.14} stroke='var(--primary)' strokeWidth='1.4' />
            {['N', 'O', 'T', ' ', 'N', 'U', 'L', 'L'].map((ch, i) => (
                <SketchText key={i} x={632} y={96 + i * 15} size={10} bold accent>
                    {ch}
                </SketchText>
            ))}
            {['C', 'H', 'E', 'C', 'K'].map((ch, i) => (
                <SketchText key={`c${i}`} x={632} y={232 + i * 15} size={10} bold accent>
                    {ch}
                </SketchText>
            ))}
            <SketchText x={632} y={330} size={8.5} bold accent>
                UNIQUE
            </SketchText>
            <Node x={700} y={150} w={190} h={80} title='promo_codes' sub='শুধু নিয়ম মানা Row' accent />
            <SketchText x={795} y={262} size={9.5} body accent>
                সব পথ এই দরজা দিয়েই ঢোকে
            </SketchText>
            <SketchText x={795} y={280} size={9.5} body opacity={0.8}>
                নিয়ম ভাঙলে Row ফেরত যায়
            </SketchText>

            <Arrow id='cons-layers-arrow' d='M 210 58 L 296 92' />
            <Arrow id='cons-layers-arrow' d='M 210 138 L 296 124' />
            <Arrow id='cons-layers-arrow' d='M 490 108 L 606 140' />
            <Arrow id='cons-layers-arrow' d='M 210 218 L 606 220' dashed />
            <Arrow id='cons-layers-arrow' d='M 210 298 L 606 270' dashed />
            <Arrow id='cons-layers-arrow' d='M 654 190 L 696 190' />
            <SketchText x={410} y={232} size={9.5} body opacity={0.8}>
                API কে পাশ কাটিয়ে, সরাসরি
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. CREATE TABLE এ নিয়মগুলো কোথায় বসে                                        */
/* ------------------------------------------------------------------------- */

function Code({ y, children, accent, dim, indent = 0 }: { y: number; children: React.ReactNode; accent?: boolean; dim?: boolean; indent?: number }) {
    return (
        <SketchText x={40 + indent * 22} y={y} size={11.5} anchor='start' accent={accent} opacity={dim ? 0.6 : 1}>
            {children}
        </SketchText>
    );
}

function Callout({ fromX, y, label, sub }: { fromX: number; y: number; label: string; sub: string }) {
    return (
        <g>
            <line x1={fromX} y1={y - 4} x2={572} y2={y - 4} stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1' strokeDasharray='3 3' />
            <circle cx={576} cy={y - 4} r={3} fill='var(--primary)' />
            <SketchText x={588} y={y - 6} size={10.5} anchor='start' bold accent>
                {label}
            </SketchText>
            <SketchText x={588} y={y + 9} size={10} anchor='start' body opacity={0.8}>
                {sub}
            </SketchText>
        </g>
    );
}

/**
 * Where each kind of rule is written inside CREATE TABLE: next to a column,
 * after all the columns as a table constraint, with or without a name of its
 * own, and the DEFAULT that fills a value rather than refusing one.
 */
export function ConstraintAnatomyDiagram() {
    return (
        <Sketch
            label='Anatomy of the Rules in CREATE TABLE'
            height={400}
            minWidth={940}
            viewBox='0 0 960 400'
            caption='একটা Column এর নিয়ম তার Type এর ঠিক পরেই লেখা যায়: এটা Column Constraint। কয়েকটা Column একসাথে লাগে এমন নিয়ম, যেমন ends_on > starts_on, সব Column এর পরে আলাদা লাইনে বসে: এটা Table Constraint। দুই জায়গাতেই সামনে CONSTRAINT নাম লিখে নিজের পছন্দের নাম দেওয়া যায়, না দিলে PostgreSQL নিজে একটা নাম বানায়। DEFAULT কোনো বাধা না, শুধু খালি জায়গা পূরণ করে।'>
            <rect x={20} y={20} width={520} height={360} fill='var(--card)' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.2' />
            <rect x={20} y={20} width={520} height={26} fill='var(--primary)' fillOpacity={0.1} />
            <SketchText x={34} y={37} size={10} anchor='start' bold accent>
                promo-codes.sql
            </SketchText>

            <Code y={76}>CREATE TABLE cons_promo_codes (</Code>
            <Code y={100} indent={1}>
                code text <tspan fill='var(--primary)'>NOT NULL</tspan>,
            </Code>
            <Code y={122} indent={1}>
                percent_off integer <tspan fill='var(--primary)'>NOT NULL</tspan>,
            </Code>
            <Code y={144} indent={1} dim>
                starts_on date NOT NULL,
            </Code>
            <Code y={166} indent={1} dim>
                ends_on date NOT NULL,
            </Code>
            <Code y={188} indent={1}>
                max_uses integer NOT NULL <tspan fill='var(--primary)'>DEFAULT 100</tspan>,
            </Code>
            <Code y={222} indent={1} accent>
                CONSTRAINT promo_code_unique UNIQUE (code),
            </Code>
            <Code y={250} indent={1} accent>
                CONSTRAINT promo_percent_range
            </Code>
            <Code y={272} indent={2} accent>
                CHECK (percent_off BETWEEN 1 AND 50),
            </Code>
            <Code y={306} indent={1}>
                CHECK (ends_on &gt; starts_on)
            </Code>
            <Code y={340}>);</Code>

            <Callout fromX={220} y={100} label='Column Constraint' sub='Type এর ঠিক পরে, শুধু এই Column এর নিয়ম' />
            <Callout fromX={345} y={188} label='DEFAULT' sub='বাধা না, মান না দিলে 100 বসে' />
            <Callout fromX={375} y={222} label='CONSTRAINT নাম' sub='নিজের দেওয়া নাম, Error এ এটাই দেখা যায়' />
            <Callout fromX={355} y={272} label='Table Constraint' sub='সব Column এর পরে, আলাদা লাইনে' />
            <Callout fromX={265} y={306} label='নাম ছাড়া Table Constraint' sub='PostgreSQL নিজে নাম দেয়: cons_promo_codes_check' />
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. CHECK এর তিন রকম উত্তর                                                    */
/* ------------------------------------------------------------------------- */

/**
 * One CHECK, three incoming rows: true lets the row in, false refuses it with
 * 23514, and NULL (unknown) also lets it in, which is the trap.
 */
export function CheckOutcomeDiagram() {
    const lanes = [
        { y: 40, value: 'percent_off = 25', result: 'true', verdict: 'Row ঢুকল', ok: true },
        { y: 140, value: 'percent_off = 250', result: 'false', verdict: 'ERROR 23514, Row ফেরত', ok: false },
        { y: 240, value: 'percent_off = NULL', result: 'NULL (unknown)', verdict: 'Row ঢুকল, এটাই ফাঁদ', ok: true },
    ];
    return (
        <Sketch
            label='Three Answers a CHECK Can Give'
            height={340}
            minWidth={920}
            viewBox='0 0 940 340'
            caption='CHECK এর শর্ত প্রতিটা নতুন Row এর জন্য একবার হিসাব হয়। উত্তর true হলে Row ঢোকে, false হলে Error। তৃতীয় উত্তরটা NULL: 250 BETWEEN 1 AND 50 false, কিন্তু NULL BETWEEN 1 AND 50 অজানা। PostgreSQL এর নিয়মে অজানা মানে পাস। তাই খালি রাখা যাবে না এমন Column এ CHECK এর সাথে NOT NULL ও লাগে।'>
            <defs>
                <ArrowHead id='cons-check-arrow' />
                <ArrowHead id='cons-check-arrow-muted' muted />
            </defs>
            <rect x={330} y={20} width={240} height={300} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeWidth='1.4' />
            <SketchText x={450} y={46} size={10.5} bold accent>
                CHECK (percent_off
            </SketchText>
            <SketchText x={450} y={62} size={10.5} bold accent>
                BETWEEN 1 AND 50)
            </SketchText>
            {lanes.map(l => (
                <g key={l.value}>
                    <Node x={20} y={l.y + 20} w={220} h={50} title={l.value} />
                    <Arrow id='cons-check-arrow' d={`M 240 ${l.y + 45} L 326 ${l.y + 45}`} />
                    <SketchText x={450} y={l.y + 50} size={11} bold accent={l.result !== 'false'}>
                        {l.result}
                    </SketchText>
                    {l.ok ? (
                        <Arrow id='cons-check-arrow' d={`M 570 ${l.y + 45} L 676 ${l.y + 45}`} />
                    ) : (
                        <path d={`M 570 ${l.y + 45} L 676 ${l.y + 45}`} fill='none' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.4' strokeDasharray='4 4' markerEnd='url(#cons-check-arrow-muted)' />
                    )}
                    <Node x={680} y={l.y + 20} w={240} h={50} title={l.verdict} accent={l.ok} dashed={!l.ok} />
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. UNIQUE আর NULL                                                           */
/* ------------------------------------------------------------------------- */

function MiniTable({ rows, y0, newRow, verdict, accepted }: { rows: [string, string][]; y0: number; newRow: [string, string]; verdict: string; accepted: boolean }) {
    return (
        <g>
            <rect x={30} y={y0} width={340} height={26} fill='var(--primary)' fillOpacity={0.08} stroke='currentColor' strokeOpacity={0.45} />
            <SketchText x={50} y={y0 + 17} size={10.5} anchor='start' bold>
                full_name
            </SketchText>
            <SketchText x={210} y={y0 + 17} size={10.5} anchor='start' bold>
                email (UNIQUE)
            </SketchText>
            {rows.map((r, i) => (
                <g key={r[0]}>
                    <rect x={30} y={y0 + 26 + i * 26} width={340} height={26} fill='transparent' stroke='currentColor' strokeOpacity={0.3} />
                    <SketchText x={50} y={y0 + 43 + i * 26} size={10.5} anchor='start'>
                        {r[0]}
                    </SketchText>
                    <SketchText x={210} y={y0 + 43 + i * 26} size={10.5} anchor='start' opacity={r[1] === 'NULL' ? 0.6 : 1}>
                        {r[1]}
                    </SketchText>
                </g>
            ))}
            <rect
                x={30}
                y={y0 + 26 + rows.length * 26 + 20}
                width={340}
                height={30}
                fill={accepted ? 'var(--primary)' : 'transparent'}
                fillOpacity={accepted ? 0.1 : 0}
                stroke={accepted ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accepted ? 1 : 0.5}
                strokeDasharray={accepted ? undefined : '4 3'}
            />
            <SketchText x={50} y={y0 + 26 + rows.length * 26 + 40} size={10.5} anchor='start' accent={accepted}>
                + {newRow[0]}
            </SketchText>
            <SketchText x={210} y={y0 + 26 + rows.length * 26 + 40} size={10.5} anchor='start' accent={accepted}>
                {newRow[1]}
            </SketchText>
            <SketchText x={200} y={y0 + 26 + rows.length * 26 + 78} size={10.5} body bold accent={accepted}>
                {verdict}
            </SketchText>
        </g>
    );
}

/**
 * The same second NULL email arriving at two tables: with the default
 * NULLS DISTINCT it is welcome, with NULLS NOT DISTINCT it is a duplicate.
 */
export function UniqueNullsSplit() {
    const rows: [string, string][] = [
        ['Rina', 'rina@mail.example'],
        ['Joy', 'NULL'],
    ];
    return (
        <SketchSplit
            label='UNIQUE and NULL'
            caption='দুই Table এই একই দুটো Row আছে, আর দুই জায়গাতেই নতুন Row Mitu, Email খালি। বাঁ দিকে সাধারণ UNIQUE: NULL মানে অজানা, আর দুটো অজানা সমান কিনা কেউ বলতে পারে না, তাই PostgreSQL তাদের আলাদা ধরে, Row ঢোকে। ডান দিকে UNIQUE NULLS NOT DISTINCT: এখানে NULL কে একটা মান ধরা হয়, দ্বিতীয় NULL তাই নকল।'
            panels={[
                {
                    title: 'UNIQUE',
                    sub: 'Default: NULLS DISTINCT',
                    viewBox: '0 0 400 230',
                    height: 230,
                    minWidth: 320,
                    children: <MiniTable rows={rows} y0={20} newRow={['Mitu', 'NULL']} verdict='Row ঢুকল, দুটো NULL আলাদা' accepted />,
                },
                {
                    title: 'UNIQUE NULLS NOT DISTINCT',
                    sub: 'PostgreSQL 15 থেকে',
                    viewBox: '0 0 400 230',
                    height: 230,
                    minWidth: 320,
                    children: (
                        <MiniTable rows={rows} y0={20} newRow={['Mitu', 'NULL']} verdict='23505: Key (email)=(null) already exists' accepted={false} />
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 5. কোন পাহারাদার আগে                                                         */
/* ------------------------------------------------------------------------- */

/**
 * The order PostgreSQL checks a new row in: every NOT NULL first, then the
 * CHECK constraints in alphabetical order of their names, then UNIQUE while
 * the row is written into the index. The first failure stops the row.
 */
export function CheckOrderDiagram() {
    const gates = [
        { x: 190, title: '1. NOT NULL', sub: 'সব Column', code: '23502' },
        { x: 390, title: '2. CHECK', sub: 'নামের বর্ণক্রমে', code: '23514' },
        { x: 590, title: '3. UNIQUE', sub: 'Index এ লেখার সময়', code: '23505' },
    ];
    return (
        <Sketch
            label='The Order of the Checks'
            height={330}
            minWidth={940}
            viewBox='0 0 960 330'
            caption='একটা Row একসাথে কয়েকটা নিয়ম ভাঙলেও Error আসে একটাই, প্রথম যে পাহারাদার থামায় তার। PostgreSQL এর Documentation বলে CHECK গুলো পরীক্ষা হয় NOT NULL এর পরে, নামের বর্ণক্রমে। নিচের তিনটা উদাহরণ আসল PostgreSQL 18 থেকে। Foreign Key এর পাহারা Lesson 09 এ।'>
            <defs>
                <ArrowHead id='cons-order-arrow' />
            </defs>
            <Node x={20} y={70} w={130} h={60} title='INSERT' sub='নতুন Row' />
            {gates.map(g => (
                <g key={g.title}>
                    <Node x={g.x} y={60} w={160} h={80} title={g.title} sub={g.sub} accent />
                    <SketchText x={g.x + 80} y={162} size={10} opacity={0.75}>
                        থামলে {g.code}
                    </SketchText>
                </g>
            ))}
            <Node x={790} y={70} w={150} h={60} title='Table' sub='Row জমা হলো' />
            <Arrow id='cons-order-arrow' d='M 150 100 L 186 100' />
            <Arrow id='cons-order-arrow' d='M 350 100 L 386 100' />
            <Arrow id='cons-order-arrow' d='M 550 100 L 586 100' />
            <Arrow id='cons-order-arrow' d='M 750 100 L 786 100' />

            {[
                { y: 214, row: "(NULL, 250, ...)", stop: 270, text: 'NOT NULL এ থামে, 250 পর্যন্ত যাওয়াই হয় না' },
                { y: 248, row: "('X', 250, ...)", stop: 470, text: 'promo_code_format আগে, কারণ c আসে p এর আগে' },
                { y: 282, row: "('EID25', 250, ...)", stop: 470, text: 'নকল হলেও CHECK আগে, তাই 23514' },
            ].map(e => (
                <g key={e.row}>
                    <SketchText x={30} y={e.y} size={10.5} anchor='start'>
                        {e.row}
                    </SketchText>
                    <line x1={190} y1={e.y - 4} x2={e.stop} y2={e.y - 4} stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1.2' />
                    <circle cx={e.stop} cy={e.y - 4} r={4} fill='var(--primary)' />
                    <SketchText x={e.stop + 14} y={e.y} size={10} anchor='start' body opacity={0.85}>
                        {e.text}
                    </SketchText>
                </g>
            ))}
        </Sketch>
    );
}
