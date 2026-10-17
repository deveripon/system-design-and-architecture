import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Shared pieces                                                              */
/* ------------------------------------------------------------------------- */

function Node({
    x,
    y,
    w,
    h,
    title,
    sub,
    accent,
    dashed,
    mono,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    sub?: string;
    accent?: boolean;
    dashed?: boolean;
    /** Type names read better in mono, Bengali labels in the body font. */
    mono?: boolean;
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
                strokeWidth='1.2'
                strokeDasharray={dashed ? '5 4' : undefined}
            />
            <SketchText
                x={x + w / 2}
                y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
                size={mono ? 11.5 : 12}
                bold
                body={!mono}
                accent={accent}>
                {title}
            </SketchText>
            {sub && (
                <SketchText x={x + w / 2} y={y + h / 2 + 13} size={9.5} body opacity={0.75}>
                    {sub}
                </SketchText>
            )}
        </g>
    );
}

function Wire({ x1, y1, x2, y2, accent }: { x1: number; y1: number; x2: number; y2: number; accent?: boolean }) {
    return (
        <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={accent ? 'var(--primary)' : 'currentColor'}
            strokeOpacity={accent ? 0.8 : 0.4}
            strokeWidth='1.2'
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 1. সংখ্যার চার পরিবার                                                         */
/* ------------------------------------------------------------------------- */

const FAMILY_COLUMNS = [
    {
        x: 30,
        title: 'পূর্ণসংখ্যা',
        sub: 'Integer family',
        items: [
            { name: 'smallint', sub: '2 bytes' },
            { name: 'integer', sub: '4 bytes' },
            { name: 'bigint', sub: '8 bytes' },
        ],
        use: 'সিট, গণনা, id',
    },
    {
        x: 265,
        title: 'হুবহু দশমিক',
        sub: 'Exact',
        items: [{ name: 'numeric(p, s)', sub: 'যতটা অঙ্ক, ততটা Byte', accent: true }],
        use: 'টাকা, শতাংশ, হিসাব',
    },
    {
        x: 500,
        title: 'আন্দাজি দশমিক',
        sub: 'Floating point',
        items: [
            { name: 'real', sub: '4 bytes, প্রায় ৬ অঙ্ক' },
            { name: 'double precision', sub: '8 bytes, প্রায় ১৫ অঙ্ক' },
        ],
        use: 'মাপজোক, GPS, বিজ্ঞান',
    },
    {
        x: 735,
        title: 'money',
        sub: 'আলাদা একটা Type',
        items: [{ name: 'money', sub: '8 bytes, Locale এ বাঁধা', dashed: true }],
        use: 'নতুন Table এ এড়িয়ে চলুন',
    },
];

/**
 * The whole lesson on one page: four families of number types, what each
 * costs in bytes, and what each is for. money is drawn dashed because the
 * lesson ends up recommending against it.
 */
export function NumtypeFamilyDiagram() {
    return (
        <Sketch
            label='Four Families of Number Types'
            height={380}
            minWidth={900}
            viewBox='0 0 960 380'
            caption='PostgreSQL এ সংখ্যা রাখার চারটা পরিবার। পূর্ণসংখ্যার তিন ভাই শুধু আকারে আলাদা। numeric প্রতিটা দশমিক অঙ্ক হুবহু রাখে। real আর double precision রাখে Binary তে সবচেয়ে কাছের মান। money দেখতে টাকার জন্য বানানো, কিন্তু এই লেসনের শেষে দেখবেন কেন একে এড়িয়ে চলাই ভালো। Byte এর হিসাব PostgreSQL 18 এর pg_column_size থেকে।'>
            <Node x={380} y={18} w={200} h={46} title='একটা সংখ্যা রাখতে হবে' sub='কোন Type এ?' accent />
            <Wire x1={480} y1={64} x2={480} y2={86} />
            <Wire x1={125} y1={86} x2={830} y2={86} />
            {FAMILY_COLUMNS.map(col => (
                <g key={col.title}>
                    <Wire x1={col.x + 95} y1={86} x2={col.x + 95} y2={108} />
                    <Node x={col.x} y={108} w={190} h={48} title={col.title} sub={col.sub} />
                    {col.items.map((item, i) => (
                        <g key={item.name}>
                            <Wire x1={col.x + 95} y1={156 + i * 54} x2={col.x + 95} y2={176 + i * 54} />
                            <Node
                                x={col.x + 10}
                                y={176 + i * 54}
                                w={170}
                                h={40}
                                title={item.name}
                                sub={item.sub}
                                mono
                                accent={'accent' in item && item.accent}
                                dashed={'dashed' in item && item.dashed}
                            />
                        </g>
                    ))}
                    <SketchText x={col.x + 95} y={360} size={11} body opacity={0.85}>
                        {col.use}
                    </SketchText>
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. তিন পূর্ণসংখ্যার সীমা                                                       */
/* ------------------------------------------------------------------------- */

const RANGES = [
    {
        name: 'smallint',
        bytes: '2 bytes',
        min: '-32,768',
        max: '32,767',
        about: 'প্রায় ৩২ হাজার',
        use: 'Island Tours এ: max_seats, seats, rating, duration_days',
        len: 150,
    },
    {
        name: 'integer',
        bytes: '4 bytes',
        min: '-2,147,483,648',
        max: '2,147,483,647',
        about: 'প্রায় ২১৪ কোটি',
        use: 'Island Tours এ: প্রতিটা Table এর id',
        len: 360,
    },
    {
        name: 'bigint',
        bytes: '8 bytes',
        min: '-9,223,372,036,854,775,808',
        max: '9,223,372,036,854,775,807',
        about: 'প্রায় ৯২২ কোটি কোটি',
        use: 'দ্রুত বাড়ে এমন id, মোট View, count(*) এর ফলাফল',
        len: 560,
    },
];

/**
 * Three bars for the three integer types with their exact limits. The bars
 * only show order, not scale: drawn to scale, smallint would be invisible.
 */
export function NumtypeRangeDiagram() {
    return (
        <Sketch
            label='How Far Each Integer Type Reaches'
            height={330}
            minWidth={900}
            viewBox='0 0 960 330'
            caption='দাগের দৈর্ঘ্য মাপমতো না, শুধু কে বড় সেটা বোঝায়। মাপমতো আঁকলে smallint চোখেই পড়ত না: integer এর সীমা smallint এর ৬৫,৫৩৬ গুণ, আর bigint এর সীমা integer এর প্রায় ৪২৯ কোটি গুণ। প্রতিটা সীমা PostgreSQL 18 এ চালিয়ে যাচাই করা, এক বেশি দিলেই out of range Error।'>
            {RANGES.map((r, i) => {
                const y = 40 + i * 100;
                return (
                    <g key={r.name}>
                        <SketchText x={30} y={y + 8} size={13} anchor='start' bold accent>
                            {r.name}
                        </SketchText>
                        <SketchText x={30} y={y + 26} size={10} anchor='start' opacity={0.7}>
                            {r.bytes}
                        </SketchText>
                        <rect x={180} y={y - 6} width={r.len} height={20} fill='var(--primary)' fillOpacity={0.12} stroke='var(--primary)' strokeWidth='1.2' />
                        <line x1={180} y1={y - 12} x2={180} y2={y + 20} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.2' />
                        <line x1={180 + r.len} y1={y - 12} x2={180 + r.len} y2={y + 20} stroke='var(--primary)' strokeWidth='1.6' />
                        <SketchText x={180 + r.len + 10} y={y + 9} size={11} anchor='start' bold accent>
                            {r.max}
                        </SketchText>
                        <SketchText x={180} y={y + 36} size={10} anchor='start' opacity={0.75}>
                            {`সর্বনিম্ন ${r.min}`}
                        </SketchText>
                        <SketchText x={180} y={y + 54} size={10.5} anchor='start' body>
                            {`${r.about}। ${r.use}`}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. numeric(5, 2) এর ঘর                                                       */
/* ------------------------------------------------------------------------- */

const SLOT_W = 54;
const SLOT_Y = 92;
const SLOT_H = 62;
// Three digit slots, the decimal point, then two digit slots.
const SLOTS = [
    { x: 290, digit: '9', part: 'int' },
    { x: 352, digit: '9', part: 'int' },
    { x: 414, digit: '9', part: 'int' },
    { x: 498, digit: '9', part: 'frac' },
    { x: 560, digit: '9', part: 'frac' },
];

function Brace({ x1, x2, y, up, label, sub }: { x1: number; x2: number; y: number; up?: boolean; label: string; sub: string }) {
    const tip = up ? y - 10 : y + 10;
    const mid = (x1 + x2) / 2;
    return (
        <g>
            <path
                d={`M ${x1} ${y} L ${x1} ${tip} L ${x2} ${tip} L ${x2} ${y} M ${mid} ${tip} L ${mid} ${up ? tip - 8 : tip + 8}`}
                fill='none'
                stroke='var(--primary)'
                strokeWidth='1.2'
            />
            <SketchText x={mid} y={up ? tip - 30 : tip + 26} size={12} bold accent>
                {label}
            </SketchText>
            <SketchText x={mid} y={up ? tip - 14 : tip + 42} size={10.5} body opacity={0.85}>
                {sub}
            </SketchText>
        </g>
    );
}

/**
 * What numeric(5, 2) means as five boxes: two after the point (the scale),
 * five in all (the precision), so three before the point. Under it, the two
 * things that happen to a value that does not fit: extra decimals are rounded
 * away, extra whole digits are an error.
 */
export function NumtypePrecisionScaleDiagram() {
    return (
        <Sketch
            label='Precision and Scale in numeric(5, 2)'
            height={400}
            minWidth={900}
            viewBox='0 0 960 400'
            caption='precision মানে মোট কয়টা অঙ্ক, scale মানে তার কয়টা দশমিকের পরে। numeric(5, 2) তে দশমিকের আগে থাকে 5 বিয়োগ 2, মানে 3টা ঘর। দশমিকের পরের বাড়তি অঙ্ক চুপচাপ গোল হয়ে যায়। আগের ঘরে জায়গা না হলে PostgreSQL কিছুই রাখে না, Error দেয়। নিচের দুটো উদাহরণই PostgreSQL 18 এ চালানো।'>
            <SketchText x={460} y={30} size={16} bold accent>
                numeric(5, 2)
            </SketchText>
            {SLOTS.map((s, i) => (
                <g key={i}>
                    <rect
                        x={s.x}
                        y={SLOT_Y}
                        width={SLOT_W}
                        height={SLOT_H}
                        fill={s.part === 'frac' ? 'var(--primary)' : 'var(--card)'}
                        fillOpacity={s.part === 'frac' ? 0.1 : 1}
                        stroke={s.part === 'frac' ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={s.part === 'frac' ? 1 : 0.55}
                        strokeWidth='1.4'
                    />
                    <SketchText x={s.x + SLOT_W / 2} y={SLOT_Y + 40} size={24} bold accent={s.part === 'frac'}>
                        {s.digit}
                    </SketchText>
                </g>
            ))}
            <circle cx={483} cy={SLOT_Y + SLOT_H - 8} r={5} fill='currentColor' />

            <Brace x1={290} x2={614} y={SLOT_Y - 6} up label='precision = 5' sub='মোট অঙ্ক, দশমিকের দুই পাশ মিলিয়ে' />
            <Brace x1={290} x2={468} y={SLOT_Y + SLOT_H + 6} label='5 - 2 = 3' sub='দশমিকের আগে সর্বোচ্চ ৩টা অঙ্ক' />
            <Brace x1={498} x2={614} y={SLOT_Y + SLOT_H + 6} label='scale = 2' sub='দশমিকের পরে ঠিক ২টা' />

            <SketchText x={660} y={SLOT_Y + 22} size={11} anchor='start' body>
                সবচেয়ে বড়: 999.99
            </SketchText>
            <SketchText x={660} y={SLOT_Y + 42} size={11} anchor='start' body>
                সবচেয়ে ছোট: -999.99
            </SketchText>

            <rect x={40} y={292} width={420} height={84} fill='var(--card)' stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.2' />
            <SketchText x={60} y={318} size={12} anchor='start' bold>
                123.456 → 123.46
            </SketchText>
            <SketchText x={60} y={340} size={10.5} anchor='start' body>
                দশমিকের পরে তৃতীয় ঘর নেই, তাই গোল হলো।
            </SketchText>
            <SketchText x={60} y={360} size={10.5} anchor='start' body>
                কোনো Warning নেই, Row ঢুকে গেল।
            </SketchText>

            <rect x={500} y={292} width={420} height={84} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={520} y={318} size={12} anchor='start' bold accent>
                999.995 → 1000.00 → ধরে না
            </SketchText>
            <SketchText x={520} y={340} size={10.5} anchor='start' body>
                গোল করতেই দশমিকের আগে ৪টা অঙ্ক হয়ে গেল।
            </SketchText>
            <SketchText x={520} y={360} size={10.5} anchor='start'>
                ERROR: numeric field overflow
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. হুবহু বনাম সবচেয়ে কাছের মান                                                   */
/* ------------------------------------------------------------------------- */

/**
 * numeric keeps the decimal digits it was given. real can only hold points on
 * a fixed binary grid, so 0.1 lands on the nearest point. The three grid
 * values are real PostgreSQL output (each real widened to double precision).
 */
export function NumtypeExactVsNearestDiagram() {
    return (
        <SketchSplit
            label='Exact Digits vs the Nearest Binary Point'
            caption='বামে numeric: 0.1 দিলে ঘরে থাকে ঠিক 0.1। ডানে real: তার কাছে শুধু নির্দিষ্ট কিছু বিন্দু আছে, আর 0.1 পড়েছে দুটো বিন্দুর মাঝে। তাই real রাখে কাছের বিন্দুটা, 0.10000000149011612। double precision এর বিন্দুগুলো অনেক ঘন, কিন্তু 0.1 সেখানেও কোনো বিন্দুর ঠিক উপরে পড়ে না। তিনটা বিন্দুর মান PostgreSQL 18 এ real থেকে double precision এ বদলে পড়া।'
            panels={[
                {
                    title: 'numeric',
                    sub: 'দশমিক অঙ্ক, হুবহু',
                    viewBox: '0 0 400 220',
                    height: 220,
                    children: (
                        <g>
                            {['0', '.', '1'].map((ch, i) => (
                                <g key={i}>
                                    {ch !== '.' && (
                                        <rect
                                            x={110 + i * 64}
                                            y={50}
                                            width={52}
                                            height={60}
                                            fill='var(--primary)'
                                            fillOpacity={0.1}
                                            stroke='var(--primary)'
                                            strokeWidth='1.4'
                                        />
                                    )}
                                    <SketchText x={136 + i * 64} y={90} size={24} bold accent>
                                        {ch}
                                    </SketchText>
                                </g>
                            ))}
                            <SketchText x={200} y={150} size={12} body>
                                যা দিলেন, ঘরে ঠিক তাই
                            </SketchText>
                            <SketchText x={200} y={176} size={11}>
                                0.1 + 0.2 = 0.3 → true
                            </SketchText>
                            <SketchText x={200} y={200} size={10.5} body opacity={0.75}>
                                দশটা 0.10 যোগ করলে ঠিক 1.00
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'real',
                    sub: 'Binary বিন্দু, কাছেরটা',
                    viewBox: '0 0 400 220',
                    height: 220,
                    children: (
                        <g>
                            <line x1={30} y1={110} x2={370} y2={110} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
                            {[70, 200, 330].map(x => (
                                <g key={x}>
                                    <line x1={x} y1={100} x2={x} y2={120} stroke='currentColor' strokeWidth='1.6' />
                                    <circle cx={x} cy={110} r={4} fill={x === 200 ? 'var(--primary)' : 'currentColor'} />
                                </g>
                            ))}
                            <SketchText x={70} y={146} size={9.5}>
                                0.09999999403953552
                            </SketchText>
                            <SketchText x={200} y={146} size={9.5} bold accent>
                                0.10000000149011612
                            </SketchText>
                            <SketchText x={330} y={146} size={9.5}>
                                0.10000000894069672
                            </SketchText>
                            <line x1={180} y1={52} x2={180} y2={104} stroke='var(--primary)' strokeWidth='1.2' strokeDasharray='4 3' />
                            <SketchText x={180} y={44} size={11} bold>
                                আসল 0.1 এখানে
                            </SketchText>
                            <path d='M 184 80 Q 192 72 198 100' fill='none' stroke='var(--primary)' strokeWidth='1.2' />
                            <SketchText x={200} y={182} size={11} body>
                                মাঝে কোনো বিন্দু নেই, তাই কাছেরটা
                            </SketchText>
                            <SketchText x={200} y={204} size={10.5} body opacity={0.75}>
                                দশটা 0.1 যোগ করলে 1.0000001
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 5. Type বাছাইয়ের প্রশ্ন                                                        */
/* ------------------------------------------------------------------------- */

function Branch({ d, label, lx, ly }: { d: string; label: string; lx: number; ly: number }) {
    return (
        <g>
            <path d={d} fill='none' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            <SketchText x={lx} y={ly} size={10.5} body bold accent>
                {label}
            </SketchText>
        </g>
    );
}

/**
 * Two questions pick almost every numeric column: can it ever hold a
 * fraction, and if so, must it add up exactly. A third question, how large it
 * can grow, picks among the integers.
 */
export function NumtypeChooserDiagram() {
    return (
        <Sketch
            label='Choosing a Number Type'
            height={410}
            minWidth={900}
            viewBox='0 0 960 410'
            caption='প্রথম প্রশ্ন: এই Column এ কখনো ভগ্নাংশ আসবে কি? না আসলে পূর্ণসংখ্যার তিনজনের একজন, সবচেয়ে বড় সম্ভাব্য মান দেখে। আসলে দ্বিতীয় প্রশ্ন: যোগফল কি পয়সায় পয়সায় মিলতে হবে? টাকা, শতাংশ, হিসাবের যেকোনো কিছু হলে numeric। মাপজোক হলে double precision। money কোনো পথেই আসে না।'>
            <Node x={30} y={170} w={230} h={64} title='কখনো ভগ্নাংশ আসবে?' sub='2.5 সিট হয় না, 2.5 টাকা হয়' accent />

            <Branch d='M 145 170 L 145 80 L 320 80' label='না' lx={160} ly={70} />
            <Node x={320} y={50} w={240} h={60} title='সবচেয়ে বড় মান কত হতে পারে?' sub='আজকের না, দশ বছর পরের' />
            <Branch d='M 560 80 L 610 80 L 610 30 L 660 30' label='৩২ হাজারের নিচে' lx={600} ly={20} />
            <Branch d='M 560 80 L 660 80' label='২১৪ কোটির নিচে' lx={600} ly={74} />
            <Branch d='M 560 80 L 610 80 L 610 132 L 660 132' label='তার বেশি' lx={600} ly={152} />
            <Node x={660} y={10} w={250} h={40} title='smallint' sub='seats, rating' mono />
            <Node x={660} y={62} w={250} h={40} title='integer' sub='সন্দেহ হলে এটাই' mono accent />
            <Node x={660} y={114} w={250} h={40} title='bigint' sub='বড় id, মোট View, পয়সায় হিসাব' mono />

            <Branch d='M 145 234 L 145 310 L 320 310' label='হ্যাঁ' lx={160} ly={300} />
            <Node x={320} y={280} w={240} h={60} title='যোগফল হুবহু মিলতে হবে?' sub='টাকা, শতাংশ, হিসাব' />
            <Branch d='M 560 310 L 610 310 L 610 250 L 660 250' label='হ্যাঁ' lx={600} ly={240} />
            <Branch d='M 560 310 L 610 310 L 610 362 L 660 362' label='না, মাপজোক' lx={600} ly={384} />
            <Node x={660} y={230} w={250} h={40} title='numeric(p, s)' sub='price_bdt numeric(10, 2)' mono accent />
            <Node x={660} y={342} w={250} h={40} title='double precision' sub='দূরত্ব, GPS, তাপমাত্রা' mono />

            <Node x={320} y={190} w={240} h={30} title='money: কোনো পথেই না' dashed />
        </Sketch>
    );
}
