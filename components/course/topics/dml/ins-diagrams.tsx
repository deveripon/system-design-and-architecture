import { Sketch, SketchSplit, SketchText } from '../../sketch';

function ArrowHead({ id, muted }: { id: string; muted?: boolean }) {
    return (
        <marker id={id} markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
            <path d='M0,0 L7,3.5 L0,7 Z' fill={muted ? 'currentColor' : 'var(--primary)'} />
        </marker>
    );
}

function Arrow({ d, id, dashed, muted }: { d: string; id: string; dashed?: boolean; muted?: boolean }) {
    return (
        <path
            d={d}
            fill='none'
            stroke={muted ? 'currentColor' : 'var(--primary)'}
            strokeOpacity={muted ? 0.55 : 1}
            strokeWidth='1.4'
            strokeDasharray={dashed ? '5 4' : undefined}
            markerEnd={`url(#${id})`}
        />
    );
}

function Cell({
    x,
    y,
    w,
    h,
    title,
    sub,
    accent,
    dashed,
    warn,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    sub?: string;
    accent?: boolean;
    dashed?: boolean;
    warn?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={accent || warn ? 'var(--primary)' : 'var(--card)'}
                fillOpacity={accent ? 0.1 : warn ? 0.18 : 1}
                stroke={accent || warn ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent || warn ? 1 : 0.45}
                strokeWidth={warn ? 2 : 1.3}
                strokeDasharray={dashed ? '4 3' : undefined}
            />
            <SketchText x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} size={10.5} bold accent={accent || warn}>
                {title}
            </SketchText>
            {sub && (
                <SketchText x={x + w / 2} y={y + h / 2 + 13} size={9} body opacity={0.75}>
                    {sub}
                </SketchText>
            )}
        </g>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. একটা INSERT এর চার অংশ                                                   */
/* ------------------------------------------------------------------------- */

/**
 * The lesson's first INSERT laid out part by part, and the row it produces.
 * Three cells come from VALUES; the other four are filled by the database
 * itself: the identity number, NULL where no default exists, and two defaults.
 */
export function InsertAnatomyDiagram() {
    const parts = [
        { y: 24, code: 'INSERT INTO ins_customers', note: 'কোন Table এ নতুন Row' },
        { y: 70, code: '(full_name, email, city)', note: 'কোন Column গুলো আপনি ভরবেন, কোন ক্রমে' },
        { y: 116, code: "VALUES ('Rafiq Islam', 'rafiq.islam@…', 'Dhaka')", note: 'ঠিক সেই ক্রমে মানগুলো' },
        { y: 162, code: 'RETURNING customer_id;', note: 'চাইলে: নতুন Row থেকে কী ফেরত চাই' },
    ];
    const cells = [
        { x: 20, w: 108, col: 'customer_id', val: '1', sub: 'Identity দিল', from: 'db' },
        { x: 134, w: 132, col: 'full_name', val: 'Rafiq Islam', sub: 'VALUES থেকে', from: 'values' },
        { x: 272, w: 170, col: 'email', val: 'rafiq.islam@…', sub: 'VALUES থেকে', from: 'values' },
        { x: 448, w: 92, col: 'phone', val: 'NULL', sub: 'DEFAULT নেই', from: 'db' },
        { x: 546, w: 96, col: 'city', val: 'Dhaka', sub: 'VALUES থেকে', from: 'values' },
        { x: 648, w: 126, col: 'country', val: 'Bangladesh', sub: 'DEFAULT', from: 'db' },
        { x: 780, w: 140, col: 'joined_at', val: 'now()', sub: 'DEFAULT', from: 'db' },
    ];
    return (
        <Sketch
            label='Anatomy of an INSERT'
            height={420}
            minWidth={920}
            viewBox='0 0 940 420'
            caption='উপরে Statement এর চারটা অংশ, নিচে যে Row টা জন্মাল। গাঢ় ঘরগুলোর মান এসেছে VALUES থেকে, Column এর তালিকার ক্রম ধরে। ভাঙা দাগের ঘরগুলো আপনি ছোঁননি: customer_id এর নম্বর দিল Identity, country আর joined_at পেল নিজের DEFAULT, আর phone এর কোনো DEFAULT নেই বলে সে পেল NULL। RETURNING না লিখলে Statement টা শুধু জানায় কয়টা Row ঢুকল।'>
            {parts.map((p, i) => (
                <g key={p.code}>
                    <rect
                        x={20}
                        y={p.y}
                        width={470}
                        height={36}
                        fill={i === 3 ? 'var(--card)' : 'var(--primary)'}
                        fillOpacity={i === 3 ? 1 : 0.07}
                        stroke={i === 3 ? 'currentColor' : 'var(--primary)'}
                        strokeOpacity={i === 3 ? 0.45 : 0.8}
                        strokeDasharray={i === 3 ? '4 3' : undefined}
                        strokeWidth='1.2'
                    />
                    <SketchText x={34} y={p.y + 23} size={11} anchor='start' bold={i !== 3} accent={i !== 3}>
                        {p.code}
                    </SketchText>
                    <SketchText x={510} y={p.y + 23} size={10} anchor='start' body opacity={0.85}>
                        {p.note}
                    </SketchText>
                </g>
            ))}

            <SketchText x={470} y={248} size={10} body opacity={0.8}>
                নতুন Row, ins_customers এ
            </SketchText>
            {cells.map(c => (
                <g key={c.col}>
                    <SketchText x={c.x + c.w / 2} y={276} size={9.5} opacity={0.75}>
                        {c.col}
                    </SketchText>
                    <Cell
                        x={c.x}
                        y={284}
                        w={c.w}
                        h={56}
                        title={c.val}
                        sub={c.sub}
                        accent={c.from === 'values'}
                        dashed={c.from === 'db'}
                    />
                </g>
            ))}

            <rect x={20} y={366} width={14} height={14} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={42} y={378} size={9.5} anchor='start' body>
                আপনার দেওয়া মান
            </SketchText>
            <rect x={180} y={366} width={14} height={14} fill='none' stroke='currentColor' strokeOpacity={0.6} strokeDasharray='4 3' strokeWidth='1.2' />
            <SketchText x={202} y={378} size={9.5} anchor='start' body>
                Database নিজে ভরেছে: Identity, DEFAULT, নয়তো NULL
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. অবস্থান দিয়ে মেলানো বনাম নাম দিয়ে মেলানো                                   */
/* ------------------------------------------------------------------------- */

const MAP_COLS = ['full_name', 'language', 'phone'];
const MAP_VALS = ["'Tania Akter'", "'+8801000000207'", "'English'"];

/**
 * The MySQL story from the lesson: a column was added in the middle with
 * AFTER, the old positional INSERT broke with 1136, and the quick "fix" of
 * appending a value lands two values in each other's column with no error.
 * The named list maps each value by name, so the table's order stops mattering.
 */
export function ColumnListSplit() {
    const colX = [10, 125, 240];
    return (
        <SketchSplit
            label='By Position vs By Name'
            caption='দুই পাশেই একই Table: MySQL এ ALTER TABLE ... ADD COLUMN language ... AFTER full_name এর পরে Column এর ক্রম full_name, language, phone। বাঁ পাশে তালিকা নেই, তাই প্রথম মান প্রথম ঘরে, দ্বিতীয়টা দ্বিতীয় ঘরে: ফোন নম্বর চলে গেল language এ, আর English গেল phone এ। কোনো Error নেই, আমাদের MySQL 8.4 Container এ ঠিক এটাই হয়েছে। ডান পাশে তালিকা আছে, তাই প্রতিটা মান নিজের নামের ঘর খুঁজে নেয়, Table এর ক্রম যাই হোক।'
            panels={[
                {
                    title: 'তালিকা ছাড়া',
                    sub: 'INSERT INTO ins_guides VALUES (…)',
                    viewBox: '0 0 360 230',
                    height: 230,
                    minWidth: 320,
                    children: (
                        <>
                            <defs>
                                <ArrowHead id='ins-map-pos-arrow' muted />
                            </defs>
                            {MAP_VALS.map((v, i) => (
                                <g key={v}>
                                    <rect x={colX[i]} y={20} width={110} height={30} fill='var(--card)' stroke='currentColor' strokeOpacity={0.45} />
                                    <SketchText x={colX[i] + 55} y={39} size={9.5}>
                                        {v}
                                    </SketchText>
                                    <SketchText x={colX[i] + 55} y={66} size={9} body opacity={0.7}>
                                        {`${i + 1} নম্বর মান`}
                                    </SketchText>
                                    <Arrow id='ins-map-pos-arrow' d={`M ${colX[i] + 55} 74 L ${colX[i] + 55} 112`} muted />
                                </g>
                            ))}
                            {MAP_COLS.map((c, i) => (
                                <g key={c}>
                                    <SketchText x={colX[i] + 55} y={130} size={9.5} opacity={0.75}>
                                        {c}
                                    </SketchText>
                                    <Cell
                                        x={colX[i]}
                                        y={138}
                                        w={110}
                                        h={40}
                                        title={MAP_VALS[i].replace(/'/g, '')}
                                        warn={i > 0}
                                    />
                                </g>
                            ))}
                            <SketchText x={180} y={208} size={10} body accent bold>
                                দুটো মান ভুল ঘরে, কোনো Error নেই
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'তালিকা সহ',
                    sub: 'INSERT INTO ins_guides (full_name, phone, language) VALUES (…)',
                    viewBox: '0 0 360 230',
                    height: 230,
                    minWidth: 320,
                    children: (
                        <>
                            <defs>
                                <ArrowHead id='ins-map-name-arrow' />
                            </defs>
                            {['full_name', 'phone', 'language'].map((name, i) => (
                                <g key={name}>
                                    <rect x={colX[i]} y={20} width={110} height={30} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' />
                                    <SketchText x={colX[i] + 55} y={39} size={9.5} accent>
                                        {MAP_VALS[i]}
                                    </SketchText>
                                    <SketchText x={colX[i] + 55} y={66} size={9} opacity={0.8}>
                                        {`→ ${name}`}
                                    </SketchText>
                                </g>
                            ))}
                            <Arrow id='ins-map-name-arrow' d='M 65 74 L 65 112' />
                            <Arrow id='ins-map-name-arrow' d='M 180 74 C 220 92, 275 98, 295 112' />
                            <Arrow id='ins-map-name-arrow' d='M 295 74 C 255 92, 200 98, 180 112' />
                            {MAP_COLS.map((c, i) => (
                                <g key={c}>
                                    <SketchText x={colX[i] + 55} y={130} size={9.5} opacity={0.75}>
                                        {c}
                                    </SketchText>
                                    <Cell
                                        x={colX[i]}
                                        y={138}
                                        w={110}
                                        h={40}
                                        title={['Tania Akter', 'English', '+8801000000207'][i]}
                                        accent
                                    />
                                </g>
                            ))}
                            <SketchText x={180} y={208} size={10} body accent bold>
                                প্রতিটা মান নিজের নামের ঘরে
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. max(id) এর দৌড়                                                           */
/* ------------------------------------------------------------------------- */

/**
 * Two website requests on two connections, replayed from two real psql
 * sessions on PostgreSQL 18: Rafiq's request inserts first, Nadia's inserts in
 * between, and Rafiq's "SELECT max(booking_id)" then returns Nadia's number.
 * RETURNING, currval and lastval all gave Rafiq his own 1.
 */
export function MaxIdRaceDiagram() {
    const laneA = 80;
    const laneB = 210;
    const steps = [
        { x: 150, lane: laneA, title: 'INSERT Rafiq', sub: 'নম্বর পেল 1', accent: false },
        { x: 390, lane: laneB, title: 'INSERT Nadia', sub: 'নম্বর পেল 2', accent: false },
        { x: 630, lane: laneA, title: 'SELECT max(booking_id)', sub: 'উত্তর 2, কিন্তু Rafiq এর 1', accent: true },
    ];
    return (
        <Sketch
            label='The max(id) Race'
            height={380}
            minWidth={900}
            viewBox='0 0 920 380'
            caption='দুটো psql জানালায় আসল PostgreSQL 18 এ এই ক্রমে চালানো। Rafiq এর Request আগে INSERT করল আর নম্বর পেল 1। ঠিক তার পরে Nadia এর Request, নম্বর 2। এবার Rafiq এর কোড জিজ্ঞেস করল "সবচেয়ে বড় নম্বর কত", উত্তর এল 2, যেটা Nadia এর Booking। একই মুহূর্তে currval আর lastval দুটোই Rafiq কে 1 দিয়েছে, কারণ ওরা নিজের Session এর হিসাব রাখে। সবচেয়ে সোজা পথ প্রথম ধাপেই RETURNING, আলাদা প্রশ্নই লাগে না।'>
            <defs>
                <ArrowHead id='ins-race-arrow' muted />
            </defs>
            <SketchText x={20} y={laneA - 34} size={10} anchor='start' bold>
                Session A: Rafiq এর Request
            </SketchText>
            <SketchText x={20} y={laneB - 34} size={10} anchor='start' bold>
                Session B: Nadia এর Request
            </SketchText>
            <line x1={20} y1={laneA + 30} x2={900} y2={laneA + 30} stroke='currentColor' strokeOpacity={0.25} />
            <line x1={20} y1={laneB + 30} x2={900} y2={laneB + 30} stroke='currentColor' strokeOpacity={0.25} />
            {steps.map(s => (
                <Cell key={s.title} x={s.x - 100} y={s.lane - 20} w={200} h={52} title={s.title} sub={s.sub} warn={s.accent} />
            ))}
            <Arrow id='ins-race-arrow' d='M 250 86 L 286 196' muted />
            <Arrow id='ins-race-arrow' d='M 490 216 L 526 96' muted />
            {['1', '2', '3'].map((n, i) => (
                <SketchText key={n} x={steps[i].x} y={laneB + 66} size={9.5} body opacity={0.7}>
                    {`সময় ${n}`}
                </SketchText>
            ))}
            <rect x={20} y={300} width={880} height={56} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={40} y={322} size={10.5} anchor='start' bold accent>
                INSERT ... RETURNING booking_id
            </SketchText>
            <SketchText x={40} y={342} size={9.5} anchor='start' body>
                নম্বরটা আসে সেই Statement থেকেই যেটা Row বানাল, তাই মাঝখানে অন্য কেউ ঢুকে পড়ার সুযোগই নেই।
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. ব্যর্থ INSERT ও নম্বর খরচ করে                                              */
/* ------------------------------------------------------------------------- */

/**
 * The seven attempts of the lesson's constraint box and what each did to the
 * identity counter: rows that were built and then rejected (foreign key,
 * CHECK, NOT NULL, UNIQUE) used up a number; the text-in-a-number attempt
 * failed before any row existed, so the next real row got 7.
 */
export function BurnedNumbersDiagram() {
    const slots = [
        { n: '1', state: 'stored', why: 'ঠিকঠাক Row' },
        { n: '2', state: 'burned', why: 'Foreign Key' },
        { n: '3', state: 'burned', why: 'CHECK seats' },
        { n: '4', state: 'burned', why: 'CHECK status' },
        { n: '5', state: 'burned', why: 'NOT NULL' },
        { n: '6', state: 'burned', why: 'UNIQUE' },
        { n: '7', state: 'stored', why: 'পরের ঠিকঠাক Row' },
    ];
    return (
        <Sketch
            label='Failed Inserts Use Numbers'
            height={260}
            minWidth={880}
            viewBox='0 0 900 260'
            caption='বক্সের সাতটা চেষ্টার পরে Sequence এর খাতা। যে চেষ্টায় Row তৈরি হয়ে তারপর কোনো নিয়মে আটকেছে (Foreign Key, দুটো CHECK, NOT NULL, UNIQUE), সে একটা নম্বর নিয়ে গেছে, ফেরত দেয়নি। সপ্তম চেষ্টা, সিটের ঘরে "two", Row বানানোর আগেই আটকেছে, তাই কোনো নম্বর খরচ হয়নি। পরের ঠিকঠাক Row তাই পেল 7, মাঝে 2 থেকে 6 ফাঁকা। ফাঁকটা ভুল না, স্বাভাবিক।'>
            {slots.map((s, i) => {
                const x = 30 + i * 122;
                const stored = s.state === 'stored';
                return (
                    <g key={s.n}>
                        <circle
                            cx={x + 45}
                            cy={80}
                            r={34}
                            fill={stored ? 'var(--primary)' : 'var(--card)'}
                            fillOpacity={stored ? 0.12 : 1}
                            stroke={stored ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={stored ? 1 : 0.5}
                            strokeDasharray={stored ? undefined : '4 3'}
                            strokeWidth='1.4'
                        />
                        <SketchText x={x + 45} y={88} size={20} bold accent={stored} opacity={stored ? 1 : 0.55}>
                            {s.n}
                        </SketchText>
                        {!stored && (
                            <line
                                x1={x + 22}
                                y1={57}
                                x2={x + 68}
                                y2={103}
                                stroke='currentColor'
                                strokeOpacity={0.55}
                                strokeWidth='1.4'
                            />
                        )}
                        <SketchText x={x + 45} y={140} size={9.5} body opacity={0.85}>
                            {s.why}
                        </SketchText>
                        <SketchText x={x + 45} y={160} size={9} body opacity={0.65}>
                            {stored ? 'Table এ আছে' : 'খরচ, Row নেই'}
                        </SketchText>
                    </g>
                );
            })}
            <rect x={30} y={190} width={840} height={44} fill='none' stroke='currentColor' strokeOpacity={0.35} strokeDasharray='4 3' />
            <SketchText x={450} y={217} size={10} body>
                {'সিটের ঘরে "two": Row বানানোর আগেই 22P02, তাই কোনো নম্বর যায়নি'}
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. এক Statement এ Customer, Booking, Payment                                */
/* ------------------------------------------------------------------------- */

/**
 * The project example's chain of data-modifying CTEs. Each INSERT hands its
 * new key forward through RETURNING, and the whole chain is one statement, so
 * either every row lands or none does.
 */
export function BookingChainDiagram() {
    const steps = [
        { x: 20, title: 'new_customer', sub: 'INSERT INTO customers', out: 'RETURNING customer_id' },
        { x: 330, title: 'new_booking', sub: 'INSERT INTO bookings', out: 'RETURNING booking_id, total_bdt' },
        { x: 640, title: 'শেষ INSERT', sub: 'INSERT INTO payments', out: 'RETURNING payment_id' },
    ];
    return (
        <Sketch
            label='One Statement, Three Inserts'
            height={330}
            minWidth={920}
            viewBox='0 0 940 330'
            caption='WITH এর প্রতিটা অংশ একটা INSERT, আর প্রত্যেকে RETURNING দিয়ে নিজের নতুন নম্বর পরের অংশের হাতে দেয়: Customer এর নম্বর Booking এ, Booking এর নম্বর আর টাকা Payment এ। পুরোটা একটা Statement, তাই মাঝের কোনো ধাপ আটকালে, ধরুন Payment এর method এ বানান ভুল, তিনটার একটাও থাকে না। অর্ধেক Booking, মানে টাকা ছাড়া Booking বা Booking ছাড়া Customer, তৈরিই হতে পারে না।'>
            <defs>
                <ArrowHead id='ins-chain-arrow' />
            </defs>
            <rect x={10} y={20} width={920} height={210} fill='var(--primary)' fillOpacity={0.03} stroke='var(--primary)' strokeOpacity={0.6} strokeDasharray='6 4' />
            <SketchText x={470} y={44} size={10.5} body bold accent>
                একটা Statement: তিনটাই হয়, নয়তো একটাও না
            </SketchText>
            {steps.map(s => (
                <g key={s.title}>
                    <Cell x={s.x + 10} y={66} w={260} h={64} title={s.title} sub={s.sub} accent />
                    <rect x={s.x + 10} y={146} width={260} height={34} fill='var(--card)' stroke='currentColor' strokeOpacity={0.45} />
                    <SketchText x={s.x + 140} y={168} size={9.5}>
                        {s.out}
                    </SketchText>
                </g>
            ))}
            <Arrow id='ins-chain-arrow' d='M 280 163 C 300 163, 300 98, 336 98' />
            <Arrow id='ins-chain-arrow' d='M 590 163 C 610 163, 610 98, 646 98' />
            <SketchText x={308} y={210} size={9.5} body opacity={0.8}>
                customer_id যায় Booking এ
            </SketchText>
            <SketchText x={618} y={210} size={9.5} body opacity={0.8}>
                booking_id আর টাকা যায় Payment এ
            </SketchText>
            <rect x={10} y={254} width={920} height={52} fill='var(--card)' stroke='currentColor' strokeOpacity={0.4} />
            <SketchText x={30} y={276} size={10} anchor='start' bold>
                ফলাফল: তিনটা নতুন Row, তিনটা নতুন নম্বর
            </SketchText>
            <SketchText x={30} y={295} size={9.5} anchor='start' body opacity={0.85}>
                পাতা খোলার পরে এটাই প্রথম INSERT হলে customer_id 16, booking_id 25, payment_id 20। ROLLBACK Row ফেরায়, নম্বর ফেরায় না।
            </SketchText>
        </Sketch>
    );
}
