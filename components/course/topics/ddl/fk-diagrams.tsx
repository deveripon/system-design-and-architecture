import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. Parent, child আর মাঝের প্রতিশ্রুতি                                          */
/* ------------------------------------------------------------------------- */

const PARENT_ROWS = [
    { id: '1', name: 'Rahim Uddin' },
    { id: '2', name: 'Nusrat Jahan' },
    { id: '3', name: 'Tanvir Ahmed' },
];

// Real rows of the sample database; the child's referencing column is drawn
// first and the parent's key last only so the arrows do not cross a column.
const CHILD_ROWS = [
    { customer: '1', booking: '1', total: '25000.00', parentRow: 0 },
    { customer: '1', booking: '8', total: '19000.00', parentRow: 0 },
    { customer: '2', booking: '2', total: '50000.00', parentRow: 1 },
    { customer: '3', booking: '3', total: '12500.00', parentRow: 2 },
];

const ROW_H = 32;
const FIRST_ROW = 102;

function rowY(i: number) {
    return FIRST_ROW + i * ROW_H;
}

/**
 * customers on the left, bookings on the right, an arrow from every
 * booking's customer_id to the one customer it names, and the refused
 * orphan row underneath: the whole idea of a foreign key in one picture.
 */
export function FkParentChildDiagram() {
    return (
        <Sketch
            label='Parent, Child and the Promise'
            height={430}
            minWidth={920}
            viewBox='0 0 940 430'
            caption='বাঁয়ে Parent Table customers, ডানে Child Table bookings। প্রতিটা Booking এর customer_id থেকে একটা তীর যায় ঠিক একজন Customer এর কাছে। Foreign Key এর প্রতিশ্রুতি একটাই: Child এর এই Column এ যে মান লেখা থাকবে, সেটা Parent এর Key তে থাকতেই হবে। 999 এর মতো মান, যার কোনো Customer নেই, PostgreSQL ঢুকতেই দেয় না।'>
            <defs>
                <marker id='fk-arrow-pc' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M0,0 L10,5 L0,10 z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* parent */}
            <SketchText x={40} y={36} size={10} anchor='start' bold accent>
                PARENT · REFERENCED TABLE
            </SketchText>
            <SketchText x={40} y={58} size={14} anchor='start' bold>
                customers
            </SketchText>
            <rect x={40} y={70} width={320} height={ROW_H} fill='var(--primary)' fillOpacity={0.08} stroke='currentColor' strokeOpacity={0.4} />
            <SketchText x={56} y={91} size={11} anchor='start' bold>
                full_name
            </SketchText>
            <rect x={230} y={70} width={130} height={ROW_H} fill='var(--primary)' fillOpacity={0.12} />
            <SketchText x={246} y={91} size={11} anchor='start' bold accent>
                customer_id PK
            </SketchText>
            {PARENT_ROWS.map((r, i) => (
                <g key={r.id}>
                    <rect x={40} y={rowY(i)} width={320} height={ROW_H} fill='transparent' stroke='currentColor' strokeOpacity={0.3} />
                    <line x1={230} y1={rowY(i)} x2={230} y2={rowY(i) + ROW_H} stroke='currentColor' strokeOpacity={0.3} />
                    <SketchText x={56} y={rowY(i) + 21} size={11} anchor='start' body>
                        {r.name}
                    </SketchText>
                    <SketchText x={295} y={rowY(i) + 21} size={12} bold accent>
                        {r.id}
                    </SketchText>
                </g>
            ))}
            <SketchText x={40} y={rowY(3) + 22} size={10} anchor='start' opacity={0.6}>
                ... আরও ১২ জন
            </SketchText>

            {/* child */}
            <SketchText x={560} y={36} size={10} anchor='start' bold accent>
                CHILD · REFERENCING TABLE
            </SketchText>
            <SketchText x={560} y={58} size={14} anchor='start' bold>
                bookings
            </SketchText>
            <rect x={560} y={70} width={340} height={ROW_H} fill='var(--primary)' fillOpacity={0.08} stroke='currentColor' strokeOpacity={0.4} />
            <rect x={560} y={70} width={120} height={ROW_H} fill='var(--primary)' fillOpacity={0.12} />
            <SketchText x={574} y={91} size={11} anchor='start' bold accent>
                customer_id FK
            </SketchText>
            <SketchText x={694} y={91} size={11} anchor='start' bold>
                booking_id
            </SketchText>
            <SketchText x={800} y={91} size={11} anchor='start' bold>
                total_bdt
            </SketchText>
            {CHILD_ROWS.map((r, i) => (
                <g key={r.booking}>
                    <rect x={560} y={rowY(i)} width={340} height={ROW_H} fill='transparent' stroke='currentColor' strokeOpacity={0.3} />
                    <line x1={680} y1={rowY(i)} x2={680} y2={rowY(i) + ROW_H} stroke='currentColor' strokeOpacity={0.3} />
                    <SketchText x={620} y={rowY(i) + 21} size={12} bold accent>
                        {r.customer}
                    </SketchText>
                    <SketchText x={694} y={rowY(i) + 21} size={11} anchor='start'>
                        {r.booking}
                    </SketchText>
                    <SketchText x={800} y={rowY(i) + 21} size={11} anchor='start'>
                        {r.total}
                    </SketchText>
                    <path
                        d={`M 556 ${rowY(i) + 16} C 470 ${rowY(i) + 16}, 450 ${rowY(r.parentRow) + 16}, 366 ${rowY(r.parentRow) + 16}`}
                        fill='none'
                        stroke='var(--primary)'
                        strokeWidth='1.3'
                        markerEnd='url(#fk-arrow-pc)'
                    />
                </g>
            ))}

            {/* the refused orphan */}
            <rect x={560} y={rowY(4) + 18} width={340} height={ROW_H} fill='transparent' stroke='currentColor' strokeOpacity={0.5} strokeDasharray='4 3' />
            <SketchText x={620} y={rowY(4) + 39} size={12} bold>
                999
            </SketchText>
            <SketchText x={694} y={rowY(4) + 39} size={11} anchor='start' opacity={0.6}>
                নতুন
            </SketchText>
            <SketchText x={800} y={rowY(4) + 39} size={11} anchor='start' opacity={0.6}>
                12500.00
            </SketchText>
            <line x1={556} y1={rowY(4) + 34} x2={430} y2={rowY(4) + 34} stroke='currentColor' strokeOpacity={0.5} strokeDasharray='4 3' />
            <line x1={412} y1={rowY(4) + 24} x2={432} y2={rowY(4) + 44} stroke='currentColor' strokeWidth='2' />
            <line x1={432} y1={rowY(4) + 24} x2={412} y2={rowY(4) + 44} stroke='currentColor' strokeWidth='2' />
            <SketchText x={900} y={rowY(4) + 72} size={10.5} anchor='end' bold>
                ERROR 23503: Key (customer_id)=(999) is not present in table &quot;customers&quot;
            </SketchText>

            {/* the three names */}
            <line x1={40} y1={362} x2={900} y2={362} stroke='currentColor' strokeOpacity={0.15} />
            <SketchText x={40} y={386} size={11} anchor='start' bold accent>
                Referenced column
            </SketchText>
            <SketchText x={40} y={406} size={11} anchor='start' body>
                PRIMARY KEY অথবা UNIQUE হতেই হবে
            </SketchText>
            <SketchText x={470} y={386} size={11} bold accent>
                Foreign Key
            </SketchText>
            <SketchText x={470} y={406} size={11} body>
                bookings.customer_id থেকে customers.customer_id
            </SketchText>
            <SketchText x={900} y={386} size={11} anchor='end' bold accent>
                Referencing column
            </SketchText>
            <SketchText x={900} y={406} size={11} anchor='end' body>
                এখানের মান ওখানে থাকবে, নয়তো NULL
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. কোন কাজে Check হয়                                                         */
/* ------------------------------------------------------------------------- */

function Tick({ x, y }: { x: number; y: number }) {
    return (
        <g>
            <circle cx={x} cy={y} r={11} fill='var(--primary)' fillOpacity={0.15} stroke='var(--primary)' strokeWidth='1.2' />
            <path d={`M ${x - 5} ${y} L ${x - 1} ${y + 4} L ${x + 5} ${y - 4}`} fill='none' stroke='var(--primary)' strokeWidth='1.8' />
        </g>
    );
}

function Skip({ x, y }: { x: number; y: number }) {
    return (
        <g>
            <circle cx={x} cy={y} r={11} fill='transparent' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' strokeDasharray='3 2' />
            <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.6' />
        </g>
    );
}

function CheckRow({ y, sql, checked, line1, line2 }: { y: number; sql: string; checked: boolean; line1: string; line2: string }) {
    return (
        <g>
            <rect
                x={10}
                y={y}
                width={400}
                height={64}
                fill={checked ? 'var(--primary)' : 'transparent'}
                fillOpacity={checked ? 0.06 : 0}
                stroke={checked ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={checked ? 0.7 : 0.35}
                strokeDasharray={checked ? undefined : '4 3'}
            />
            {checked ? <Tick x={34} y={y + 32} /> : <Skip x={34} y={y + 32} />}
            <SketchText x={56} y={y + 22} size={11} anchor='start' bold accent={checked}>
                {sql}
            </SketchText>
            <SketchText x={56} y={y + 40} size={10.5} anchor='start' body>
                {line1}
            </SketchText>
            <SketchText x={56} y={y + 55} size={10.5} anchor='start' body opacity={0.75}>
                {line2}
            </SketchText>
        </g>
    );
}

/**
 * The six things you can do to a parent and a child, split by side. Four are
 * checked by the foreign key, two can never break it and are never checked.
 */
export function FkCheckSplit() {
    return (
        <SketchSplit
            label='Which Statements a Foreign Key Checks'
            caption='Child এ নতুন মান ঢুকলে বা মান বদলালে PostgreSQL দেখে Parent এ সেটা আছে কিনা। Parent থেকে Key সরে গেলে বা বদলালে দেখে কোনো Child এখনো সেটাকে দেখাচ্ছে কিনা, আর থাকলে ON DELETE বা ON UPDATE এর নিয়ম খাটায়। বাকি দুটো কাজ, Child মোছা আর নতুন Parent যোগ করা, প্রতিশ্রুতি ভাঙতেই পারে না, তাই সেখানে কোনো Check নেই। Parent Table পুরোটা DROP বা TRUNCATE করতে গেলেও আটকে যায়।'
            panels={[
                {
                    title: 'Child Table',
                    sub: 'fk_rooms, যে দেখায়',
                    viewBox: '0 0 420 240',
                    height: 240,
                    minWidth: 380,
                    children: (
                        <>
                            <CheckRow y={8} sql='INSERT INTO fk_rooms' checked line1='নতুন hotel_id কি Parent এ আছে?' line2='না থাকলে ERROR 23503' />
                            <CheckRow y={86} sql='UPDATE fk_rooms SET hotel_id' checked line1='বদলানো মান আবার মিলিয়ে দেখা হয়' line2='না থাকলে একই ERROR 23503' />
                            <CheckRow y={164} sql='DELETE FROM fk_rooms' checked={false} line1='Check নেই, Room গেলে কেউ অনাথ হয় না' line2='Hotel আগের মতোই থাকে' />
                        </>
                    ),
                },
                {
                    title: 'Parent Table',
                    sub: 'fk_hotels, যাকে দেখানো হয়',
                    viewBox: '0 0 420 240',
                    height: 240,
                    minWidth: 380,
                    children: (
                        <>
                            <CheckRow y={8} sql='DELETE FROM fk_hotels' checked line1='কোনো Room কি এখনো এই Hotel দেখাচ্ছে?' line2='থাকলে ON DELETE এর নিয়ম' />
                            <CheckRow y={86} sql='UPDATE fk_hotels SET hotel_id' checked line1='পুরনো Key কি কেউ দেখাচ্ছে?' line2='থাকলে ON UPDATE এর নিয়ম' />
                            <CheckRow y={164} sql='INSERT INTO fk_hotels' checked={false} line1='Check নেই, নতুন Hotel কাউকে ভাঙে না' line2='Room ছাড়া Hotel থাকা চলে' />
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. একটা DELETE, পাঁচ রকম পরিণতি                                                */
/* ------------------------------------------------------------------------- */

interface Fate {
    action: string;
    rows: { id: string; hotel: string; gone?: boolean; changed?: boolean }[];
    result: string;
    note: string;
    error?: boolean;
}

// Each column is PostgreSQL 18 running the same DELETE with only the ON DELETE
// word changed (rooms 101 and 102 point at hotel 1, room 201 at hotel 2).
const FATES: Fate[] = [
    {
        action: 'NO ACTION',
        rows: [
            { id: '101', hotel: '1' },
            { id: '102', hotel: '1' },
            { id: '201', hotel: '2' },
        ],
        result: 'ERROR 23503',
        note: 'Statement শেষে Check',
        error: true,
    },
    {
        action: 'RESTRICT',
        rows: [
            { id: '101', hotel: '1' },
            { id: '102', hotel: '1' },
            { id: '201', hotel: '2' },
        ],
        result: 'ERROR 23001',
        note: 'সাথে সাথে Check',
        error: true,
    },
    {
        action: 'CASCADE',
        rows: [
            { id: '101', hotel: '1', gone: true },
            { id: '102', hotel: '1', gone: true },
            { id: '201', hotel: '2' },
        ],
        result: 'DELETE 1',
        note: 'Room দুটোও মুছে গেল',
    },
    {
        action: 'SET NULL',
        rows: [
            { id: '101', hotel: 'NULL', changed: true },
            { id: '102', hotel: 'NULL', changed: true },
            { id: '201', hotel: '2' },
        ],
        result: 'DELETE 1',
        note: 'Column এ NULL চলতে হবে',
    },
    {
        action: 'SET DEFAULT',
        rows: [
            { id: '101', hotel: '0', changed: true },
            { id: '102', hotel: '0', changed: true },
            { id: '201', hotel: '2' },
        ],
        result: 'DELETE 1',
        note: 'Hotel 0 থাকতেই হবে',
    },
];

/**
 * DELETE FROM fk_hotels WHERE hotel_id = 1 run five times, once per
 * ON DELETE action, with the rooms table as it stands afterwards.
 */
export function FkActionsDiagram() {
    const colW = 172;
    const gap = 10;
    return (
        <Sketch
            label='One DELETE, Five Outcomes'
            height={400}
            minWidth={920}
            viewBox='0 0 940 400'
            caption='একই Statement পাঁচবার চালানো হয়েছে, শুধু ON DELETE এর পরের শব্দটা বদলে। প্রথম দুটোয় Hotel মোছাই যায়নি, কারণ দুটো Room এখনো তাকে দেখাচ্ছে, তাই কিছুই বদলায়নি। CASCADE এ Room দুটোও চলে গেছে, SET NULL এ Room থেকে গেছে কিন্তু কোন Hotel এর সেটা ফাঁকা, SET DEFAULT এ Room গুলো চলে গেছে Default মান 0 এর Hotel এ। Room 201 সব ক্ষেত্রেই অক্ষত, কারণ সে Hotel 2 এর।'>
            <rect x={250} y={14} width={440} height={34} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeOpacity={0.6} />
            <SketchText x={470} y={36} size={12} bold accent>
                DELETE FROM fk_hotels WHERE hotel_id = 1;
            </SketchText>

            {FATES.map((f, i) => {
                const x = 20 + i * (colW + gap);
                return (
                    <g key={f.action}>
                        <line x1={470} y1={48} x2={x + colW / 2} y2={78} stroke='currentColor' strokeOpacity={0.3} />
                        <rect x={x} y={78} width={colW} height={292} fill='transparent' stroke='currentColor' strokeOpacity={0.35} />
                        <rect x={x} y={78} width={colW} height={30} fill='var(--primary)' fillOpacity={0.1} />
                        <SketchText x={x + colW / 2} y={98} size={12} bold accent>
                            {f.action}
                        </SketchText>
                        <SketchText x={x + 20} y={132} size={10} anchor='start' bold opacity={0.7}>
                            room_id
                        </SketchText>
                        <SketchText x={x + colW - 20} y={132} size={10} anchor='end' bold opacity={0.7}>
                            hotel_id
                        </SketchText>
                        {f.rows.map((r, j) => {
                            const y = 146 + j * 36;
                            return (
                                <g key={r.id} opacity={r.gone ? 0.45 : 1}>
                                    <rect
                                        x={x + 12}
                                        y={y}
                                        width={colW - 24}
                                        height={28}
                                        fill={r.changed ? 'var(--primary)' : 'transparent'}
                                        fillOpacity={r.changed ? 0.12 : 0}
                                        stroke='currentColor'
                                        strokeOpacity={0.3}
                                        strokeDasharray={r.gone ? '4 3' : undefined}
                                    />
                                    <SketchText x={x + 22} y={y + 19} size={11} anchor='start'>
                                        {r.id}
                                    </SketchText>
                                    <SketchText x={x + colW - 22} y={y + 19} size={11} anchor='end' bold accent={r.changed}>
                                        {r.hotel}
                                    </SketchText>
                                    {r.gone && (
                                        <line x1={x + 16} y1={y + 14} x2={x + colW - 16} y2={y + 14} stroke='currentColor' strokeWidth='1.5' />
                                    )}
                                </g>
                            );
                        })}
                        <line x1={x + 12} y1={268} x2={x + colW - 12} y2={268} stroke='currentColor' strokeOpacity={0.2} />
                        <SketchText x={x + colW / 2} y={296} size={12} bold accent={!f.error}>
                            {f.result}
                        </SketchText>
                        <SketchText x={x + colW / 2} y={322} size={10.5} body>
                            {f.note}
                        </SketchText>
                        <SketchText x={x + colW / 2} y={350} size={9.5} opacity={0.65}>
                            {f.error ? 'কিছুই বদলায়নি' : 'Hotel 1 মুছে গেছে'}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Referencing Column এ Index থাকা আর না থাকা                                  */
/* ------------------------------------------------------------------------- */

function RowStrip({ y, lit, total }: { y: number; lit: (i: number) => boolean; total: number }) {
    return (
        <g>
            {Array.from({ length: total }, (_, i) => (
                <rect
                    key={i}
                    x={20 + (i % 40) * 9.5}
                    y={y + Math.floor(i / 40) * 12}
                    width={7.5}
                    height={9}
                    fill={lit(i) ? 'var(--primary)' : 'currentColor'}
                    fillOpacity={lit(i) ? 0.75 : 0.18}
                />
            ))}
        </g>
    );
}

/**
 * What the foreign key has to do for every deleted parent row: find the
 * children. Without an index on the child's column that means reading the
 * whole child table; with one it is a short jump. Timings are from a real run.
 */
export function FkIndexSplit() {
    return (
        <SketchSplit
            label='Why the Referencing Column Wants an Index'
            caption='Parent থেকে একটা Row মুছলেই PostgreSQL কে খুঁজতে হয় কোন Child Row গুলো তাকে দেখাচ্ছে, অনেকটা SELECT 1 FROM fk_big_rooms WHERE hotel_id = 42 এর মতো। Index না থাকলে প্রতিবার পুরো Child Table পড়া। এখানে ১ লাখ Room, ৫০০ Hotel, ২০টা Hotel মোছা হয়েছে: Index ছাড়া Foreign Key এর কাজে লেগেছে 91 ms, Index দেওয়ার পরে পরের ২০টায় 3.7 ms। সময় মেশিন ভেদে বদলাবে, অনুপাতটাই আসল কথা।'
            panels={[
                {
                    title: 'Index নেই',
                    sub: 'Seq Scan on fk_big_rooms',
                    viewBox: '0 0 420 230',
                    height: 230,
                    minWidth: 380,
                    children: (
                        <>
                            <SketchText x={20} y={22} size={11} anchor='start' bold>
                                hotel_id = 42 এর Room কোথায়?
                            </SketchText>
                            <RowStrip y={40} total={320} lit={() => true} />
                            <SketchText x={20} y={170} size={10.5} anchor='start' body>
                                প্রতিটা Row পড়ে দেখতে হয়, মিলুক বা না মিলুক
                            </SketchText>
                            <SketchText x={20} y={200} size={13} anchor='start' bold>
                                Trigger for constraint: time=91.155
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'Index আছে',
                    sub: 'Bitmap Index Scan on fk_big_rooms_hotel_id_idx',
                    viewBox: '0 0 420 230',
                    height: 230,
                    minWidth: 380,
                    children: (
                        <>
                            <SketchText x={20} y={22} size={11} anchor='start' bold>
                                hotel_id = 42 এর Room কোথায়?
                            </SketchText>
                            <RowStrip y={40} total={320} lit={i => i % 41 === 7} />
                            <SketchText x={20} y={170} size={10.5} anchor='start' body>
                                Index সরাসরি দেখিয়ে দেয় কোন Row গুলো
                            </SketchText>
                            <SketchText x={20} y={200} size={13} anchor='start' bold accent>
                                Trigger for constraint: time=3.652
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}
