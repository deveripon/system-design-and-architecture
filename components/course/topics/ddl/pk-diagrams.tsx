import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. PRIMARY KEY এর তিন প্রতিজ্ঞা                                              */
/* ------------------------------------------------------------------------- */

const PROMISE_ROWS = [
    ['1', 'Kalabagan Counter', 'Dhanmondi'],
    ['2', 'Arambagh Counter', 'Motijheel'],
    ['3', 'Uttara Counter', 'Uttara'],
];

function PromiseBox({
    y,
    title,
    sub,
    guard,
    breaks,
}: {
    y: number;
    title: string;
    sub: string;
    guard: string;
    breaks: string;
}) {
    return (
        <g>
            <rect
                x={430}
                y={y}
                width={490}
                height={92}
                fill='var(--primary)'
                fillOpacity={0.05}
                stroke='var(--primary)'
                strokeOpacity={0.7}
                strokeWidth='1.2'
            />
            <SketchText x={448} y={y + 24} size={13} anchor='start' bold accent>
                {title}
            </SketchText>
            <SketchText x={448 + title.length * 8.6 + 14} y={y + 24} size={11} anchor='start' body>
                {sub}
            </SketchText>
            <SketchText x={448} y={y + 50} size={10.5} anchor='start' opacity={0.85}>
                {guard}
            </SketchText>
            <SketchText x={448} y={y + 74} size={10.5} anchor='start' opacity={0.7}>
                {breaks}
            </SketchText>
        </g>
    );
}

/**
 * A primary key is three promises kept by the database: no two rows share the
 * value (a unique index), no row leaves it empty (a NOT NULL constraint), and a
 * table has only one of them. Each promise is shown with the object that keeps
 * it in PostgreSQL 18 and the error with its SQLSTATE when it is broken.
 */
export function PkPromisesDiagram() {
    const arrow = (d: string) => (
        <path d={d} fill='none' stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#pk-promise-arrow)' />
    );
    return (
        <Sketch
            label='Three Promises of a Primary Key'
            height={360}
            minWidth={940}
            viewBox='0 0 940 360'
            caption='বাঁদিকে pk_pickup_points, যার point_id হলো Primary Key। ডানদিকে সেই এক লাইনের PRIMARY KEY শব্দটা Database এর ভেতরে যে তিনটা প্রতিজ্ঞা রাখে। প্রথম দুটোর পাহারাদারের নাম PostgreSQL 18 নিজেই দেয়, আর প্রতিটা প্রতিজ্ঞা ভাঙলে আলাদা Error আসে, বন্ধনীতে তার SQLSTATE কোড।'>
            <defs>
                <marker id='pk-promise-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            <rect x={20} y={90} width={350} height={180} fill='var(--card)' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.2' />
            <rect x={20} y={90} width={350} height={28} fill='currentColor' fillOpacity={0.06} />
            <SketchText x={34} y={109} size={11} anchor='start' bold>
                pk_pickup_points
            </SketchText>
            <rect x={20} y={118} width={80} height={152} fill='var(--primary)' fillOpacity={0.12} stroke='var(--primary)' strokeWidth='1.4' />
            {['point_id', 'name', 'area'].map((c, i) => (
                <SketchText key={c} x={[34, 112, 270][i]} y={140} size={10.5} anchor='start' bold accent={i === 0}>
                    {c}
                </SketchText>
            ))}
            <line x1={20} y1={150} x2={370} y2={150} stroke='currentColor' strokeOpacity={0.3} />
            {PROMISE_ROWS.map((row, r) => (
                <g key={row[0]}>
                    {row.map((cell, c) => (
                        <SketchText key={c} x={[34, 112, 270][c]} y={178 + r * 30} size={10.5} anchor='start' accent={c === 0} bold={c === 0}>
                            {cell}
                        </SketchText>
                    ))}
                </g>
            ))}
            <SketchText x={60} y={292} size={10} body accent>
                Primary Key
            </SketchText>

            {arrow('M 100 150 C 220 60, 320 70, 424 76')}
            {arrow('M 100 194 C 240 194, 320 186, 424 186')}
            {arrow('M 100 250 C 220 320, 320 300, 424 296')}

            <PromiseBox
                y={30}
                title='UNIQUE'
                sub='দুটো Row এ একই মান থাকবে না'
                guard='পাহারায়: pk_pickup_points_pkey (unique btree index)'
                breaks='ভাঙলে: duplicate key value violates unique constraint (23505)'
            />
            <PromiseBox
                y={140}
                title='NOT NULL'
                sub='কোনো Row এ মান খালি থাকবে না'
                guard='পাহারায়: pk_pickup_points_point_id_not_null'
                breaks='ভাঙলে: null value in column "point_id" ... (23502)'
            />
            <PromiseBox
                y={250}
                title='ONE'
                sub='প্রতিটা Table এ একটাই Primary Key'
                guard='পাহারায়: CREATE TABLE নিজেই, দ্বিতীয়টা নেয় না'
                breaks='ভাঙলে: multiple primary keys ... are not allowed (42P16)'
            />
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Composite Key: জোড়াটা অনন্য, আলাদা আলাদা না                              */
/* ------------------------------------------------------------------------- */

const LANG_ROWS: { cells: string[]; ok: boolean; note?: string }[] = [
    { cells: ['1', 'Bangla', 'native'], ok: true },
    { cells: ['1', 'English', 'fluent'], ok: true },
    { cells: ['2', 'English', 'native'], ok: true },
    { cells: ['2', 'Hindi', 'basic'], ok: true },
    { cells: ['1', 'English', 'basic'], ok: false, note: 'জোড়া (1, English) আগেই আছে: 23505' },
    { cells: ['2', 'NULL', 'basic'], ok: false, note: 'চাবির অংশ খালি: 23502' },
];

/**
 * Rows of pk_guide_languages with the key (guide_id, language). Each column on
 * its own repeats; only the pair has to be new. The last two rows are the two
 * inserts PostgreSQL rejects, with the real reasons.
 */
export function CompositeKeyDiagram() {
    const X = [44, 140, 270];
    return (
        <Sketch
            label='A Key Made of Two Columns'
            height={380}
            minWidth={940}
            viewBox='0 0 940 380'
            caption='guide_id একা দেখলে 1 দুইবার, 2 দুইবার। language একা দেখলে English দুইবার। তবু প্রথম চারটা Row সবাই ঢুকেছে, কারণ চাবিটা কোনো একটা Column না, দুটো মিলে একটা জোড়া, আর প্রতিটা জোড়া নতুন। নিচের দুটো চেষ্টা আটকে গেছে: একটায় জোড়াটা পুরনো, আরেকটায় জোড়ার এক অংশ খালি।'>
            <rect x={20} y={20} width={400} height={340} fill='var(--card)' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.2' />
            <rect x={20} y={20} width={400} height={28} fill='currentColor' fillOpacity={0.06} />
            <SketchText x={34} y={39} size={11} anchor='start' bold>
                pk_guide_languages
            </SketchText>
            <rect x={30} y={56} width={210} height={30} fill='var(--primary)' fillOpacity={0.12} stroke='var(--primary)' strokeWidth='1.2' />
            {['guide_id', 'language', 'level'].map((c, i) => (
                <SketchText key={c} x={X[i]} y={76} size={10.5} anchor='start' bold accent={i < 2}>
                    {c}
                </SketchText>
            ))}
            {LANG_ROWS.map((row, r) => {
                const y = 116 + r * 40 + (row.ok ? 0 : 14);
                return (
                    <g key={r} opacity={row.ok ? 1 : 0.75}>
                        {!row.ok && (
                            <rect x={30} y={y - 20} width={380} height={30} fill='none' stroke='currentColor' strokeOpacity={0.5} strokeDasharray='4 3' />
                        )}
                        {row.cells.map((cell, c) => (
                            <SketchText key={c} x={X[c]} y={y} size={10.5} anchor='start' accent={row.ok && c < 2}>
                                {cell}
                            </SketchText>
                        ))}
                        <SketchText x={384} y={y} size={13} bold accent={row.ok}>
                            {row.ok ? '✓' : '✗'}
                        </SketchText>
                    </g>
                );
            })}
            <line x1={30} y1={272} x2={410} y2={272} stroke='currentColor' strokeOpacity={0.3} strokeDasharray='2 4' />

            <SketchText x={470} y={60} size={12} anchor='start' bold accent>
                PRIMARY KEY (guide_id, language)
            </SketchText>
            <SketchText x={470} y={100} size={11} anchor='start' body>
                guide_id একা: 1, 1, 2, 2, বারবার আসে, তাতে কোনো সমস্যা নেই।
            </SketchText>
            <SketchText x={470} y={128} size={11} anchor='start' body>
                language একা: English দুইবার। এতেও সমস্যা নেই।
            </SketchText>
            <SketchText x={470} y={156} size={11} anchor='start' body accent>
                জোড়া (1, Bangla), (1, English), (2, English), (2, Hindi): প্রতিটা একবার।
            </SketchText>
            <SketchText x={470} y={294} size={11} anchor='start' body>
                {LANG_ROWS[4].note}
            </SketchText>
            <SketchText x={470} y={334} size={11} anchor='start' body>
                {LANG_ROWS[5].note}
            </SketchText>
            <path d='M 412 286 L 462 290' fill='none' stroke='currentColor' strokeOpacity={0.5} strokeDasharray='3 3' />
            <path d='M 412 326 L 462 330' fill='none' stroke='currentColor' strokeOpacity={0.5} strokeDasharray='3 3' />
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Sequence এর নম্বর কোথায় কোথায় গেল                                        */
/* ------------------------------------------------------------------------- */

const GAP_STEPS: { n: number; what: string; fate: string; saved: boolean }[] = [
    { n: 1, what: "Insert 'Nasrin'", fate: 'Table এ উঠল', saved: true },
    { n: 2, what: "BEGIN, Insert 'Rafiq'", fate: 'ROLLBACK, নম্বর হারাল', saved: false },
    { n: 3, what: "Insert 'Sumon'", fate: 'Table এ উঠল', saved: true },
    { n: 4, what: 'Insert NULL', fate: 'NOT NULL Error, নম্বর হারাল', saved: false },
    { n: 5, what: "Insert 'Mitu'", fate: 'Table এ উঠল', saved: true },
];

/**
 * Every nextval hands out a number for good. The five inserts from the lesson,
 * in order: two of them never reach the table, yet their numbers are gone, so
 * pk_tickets ends with 1, 3 and 5. Exactly what PostgreSQL 18 returned.
 */
export function SequenceGapsDiagram() {
    const xs = GAP_STEPS.map((_, i) => 110 + i * 180);
    const saved = GAP_STEPS.map((s, i) => ({ ...s, x: xs[i] })).filter(s => s.saved);
    return (
        <Sketch
            label='Where Each Number Went'
            height={380}
            minWidth={940}
            viewBox='0 0 940 380'
            caption='উপরের সারি Sequence এর হাত থেকে বেরোনো নম্বর, বাঁ থেকে ডানে সময়ের ক্রমে। প্রতিটা Insert প্রথমেই একটা নম্বর নেয়, তারপর বাকি কাজ। কাজ ব্যর্থ হলে বা ROLLBACK হলে Row ফেরত যায়, কিন্তু নম্বর ফেরত যায় না। তাই নিচের Table এ 1, 3, 5: মাঝের 2 আর 4 চিরদিনের জন্য খালি।'>
            <defs>
                <marker id='pk-gap-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
                <marker id='pk-gap-arrow-lost' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='currentColor' fillOpacity={0.6} />
                </marker>
            </defs>
            <SketchText x={20} y={30} size={10.5} anchor='start' bold opacity={0.8}>
                pk_tickets_ticket_id_seq: nextval()
            </SketchText>
            <line x1={60} y1={66} x2={880} y2={66} stroke='currentColor' strokeOpacity={0.25} strokeDasharray='2 4' />
            {GAP_STEPS.map((s, i) => (
                <g key={s.n}>
                    <circle
                        cx={xs[i]}
                        cy={66}
                        r={18}
                        fill={s.saved ? 'var(--primary)' : 'var(--card)'}
                        fillOpacity={s.saved ? 0.15 : 1}
                        stroke={s.saved ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={s.saved ? 1 : 0.6}
                        strokeWidth='1.3'
                        strokeDasharray={s.saved ? undefined : '4 3'}
                    />
                    <SketchText x={xs[i]} y={71} size={14} bold accent={s.saved}>
                        {String(s.n)}
                    </SketchText>
                    <path
                        d={`M ${xs[i]} 86 L ${xs[i]} 120`}
                        fill='none'
                        stroke={s.saved ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={s.saved ? 1 : 0.6}
                        strokeWidth='1.3'
                        markerEnd={s.saved ? 'url(#pk-gap-arrow)' : 'url(#pk-gap-arrow-lost)'}
                    />
                    <rect
                        x={xs[i] - 78}
                        y={126}
                        width={156}
                        height={58}
                        fill={s.saved ? 'var(--primary)' : 'transparent'}
                        fillOpacity={s.saved ? 0.06 : 0}
                        stroke={s.saved ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={s.saved ? 0.8 : 0.45}
                        strokeWidth='1.2'
                        strokeDasharray={s.saved ? undefined : '4 3'}
                    />
                    <SketchText x={xs[i]} y={150} size={10}>
                        {s.what}
                    </SketchText>
                    <SketchText x={xs[i]} y={170} size={10} body accent={s.saved} opacity={s.saved ? 1 : 0.75}>
                        {s.fate}
                    </SketchText>
                </g>
            ))}

            <rect x={320} y={250} width={300} height={110} fill='var(--card)' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.2' />
            <rect x={320} y={250} width={300} height={26} fill='currentColor' fillOpacity={0.06} />
            <SketchText x={334} y={268} size={10.5} anchor='start' bold>
                pk_tickets
            </SketchText>
            <SketchText x={334} y={292} size={10} anchor='start' bold accent>
                ticket_id
            </SketchText>
            <SketchText x={450} y={292} size={10} anchor='start' bold>
                passenger
            </SketchText>
            {saved.map((s, i) => (
                <g key={s.n}>
                    <SketchText x={334} y={314 + i * 18} size={10.5} anchor='start' accent bold>
                        {String(s.n)}
                    </SketchText>
                    <SketchText x={450} y={314 + i * 18} size={10.5} anchor='start'>
                        {s.what.replace("Insert '", '').replace("'", '')}
                    </SketchText>
                </g>
            ))}
            {saved.map(s => (
                <path
                    key={s.n}
                    d={`M ${s.x} 186 C ${s.x} 222, 470 220, 470 246`}
                    fill='none'
                    stroke='var(--primary)'
                    strokeOpacity={0.5}
                    strokeWidth='1.1'
                    markerEnd='url(#pk-gap-arrow)'
                />
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. নতুন চাবি Index এর কোথায় বসে                                              */
/* ------------------------------------------------------------------------- */

function IndexPages({
    targets,
    keys,
    markerId,
}: {
    /** Which leaf page (0 to 4) each new key lands on. */
    targets: number[];
    keys: string[];
    markerId: string;
}) {
    const pageX = (i: number) => 14 + i * 80;
    return (
        <g>
            <defs>
                <marker id={markerId} markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <rect x={160} y={14} width={100} height={30} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={210} y={34} size={10}>
                root
            </SketchText>
            {[0, 1, 2, 3, 4].map(i => (
                <g key={i}>
                    <line x1={210} y1={44} x2={pageX(i) + 34} y2={150} stroke='currentColor' strokeOpacity={0.25} />
                    <rect
                        x={pageX(i)}
                        y={150}
                        width={68}
                        height={44}
                        fill={targets.includes(i) ? 'var(--primary)' : 'transparent'}
                        fillOpacity={targets.includes(i) ? 0.12 : 0}
                        stroke={targets.includes(i) ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={targets.includes(i) ? 1 : 0.45}
                        strokeWidth='1.2'
                    />
                    <SketchText x={pageX(i) + 34} y={176} size={9.5} opacity={0.75}>
                        {`page ${i + 1}`}
                    </SketchText>
                </g>
            ))}
            {keys.map((k, j) => (
                <g key={k}>
                    <SketchText x={60 + j * 150} y={86} size={10} accent bold>
                        {k}
                    </SketchText>
                    <path
                        d={`M ${60 + j * 150} 94 L ${pageX(targets[j]) + 34} 146`}
                        fill='none'
                        stroke='var(--primary)'
                        strokeWidth='1.2'
                        markerEnd={`url(#${markerId})`}
                    />
                </g>
            ))}
        </g>
    );
}

/**
 * Where three new keys land in a primary key's B-tree index. Increasing
 * numbers (identity, or time-ordered uuidv7) always go to the right-most leaf
 * page; random uuid v4 values land on pages all over the index.
 */
export function KeyLocalitySplit() {
    return (
        <SketchSplit
            label='Where a New Key Lands in the Index'
            caption='প্রতিটা Primary Key এর পেছনে একটা B-tree Index থাকে, যার নিচের সারির পাতাগুলোতে চাবিগুলো ছোট থেকে বড় ক্রমে সাজানো। বাঁদিকে বাড়তে থাকা নম্বর: প্রতিটা নতুন চাবি সবচেয়ে বড়, তাই সবাই শেষ পাতায় বসে, যেটা Memory তে গরম হয়েই থাকে। ডানদিকে এলোমেলো UUID v4: কোন চাবি কোথায় বসবে আগে থেকে বলা যায় না, তাই প্রায় প্রতিটা Insert আলাদা পাতা ছোঁয়। Table বড় হলে সেই পাতাগুলো Disk থেকে আনতে হয়। uuidv7 সময়ের ক্রমে বাড়ে, তাই সেটা বাঁদিকের মতো আচরণ করে।'
            panels={[
                {
                    title: 'identity বা uuidv7',
                    sub: 'নতুন চাবি সবসময় শেষ পাতায়',
                    viewBox: '0 0 420 210',
                    height: 210,
                    minWidth: 360,
                    children: <IndexPages targets={[4, 4, 4]} keys={['1001', '1002', '1003']} markerId='pk-local-arrow-seq' />,
                },
                {
                    title: 'gen_random_uuid() (v4)',
                    sub: 'নতুন চাবি যেকোনো পাতায়',
                    viewBox: '0 0 420 210',
                    height: 210,
                    minWidth: 360,
                    children: <IndexPages targets={[3, 0, 2]} keys={['c04b…', '1a7e…', '9f2c…']} markerId='pk-local-arrow-rand' />,
                },
            ]}
        />
    );
}
