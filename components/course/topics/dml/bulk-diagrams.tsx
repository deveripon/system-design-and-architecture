import { Sketch, SketchBox, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Small drawing helpers                                                      */
/* ------------------------------------------------------------------------- */

/** One arrowhead per diagram, so marker ids never repeat on the page. */
function Arrowhead({ id, accent }: { id: string; accent?: boolean }) {
    return (
        <marker
            id={id}
            markerWidth={8}
            markerHeight={8}
            refX={7}
            refY={3.5}
            orient='auto'
            markerUnits='userSpaceOnUse'>
            <path d='M0,0 L7,3.5 L0,7 Z' fill={accent ? 'var(--primary)' : 'currentColor'} fillOpacity={accent ? 1 : 0.6} />
        </marker>
    );
}

function Arrow({
    x1,
    y1,
    x2,
    y2,
    marker,
    accent,
    dashed,
}: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    marker: string;
    accent?: boolean;
    dashed?: boolean;
}) {
    return (
        <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={accent ? 'var(--primary)' : 'currentColor'}
            strokeOpacity={accent ? 0.9 : 0.5}
            strokeWidth='1.2'
            strokeDasharray={dashed ? '4 3' : undefined}
            markerEnd={`url(#${marker})`}
        />
    );
}

/** A text chip: a small framed label used for CSV fields and table rows. */
function Chip({
    x,
    y,
    w,
    h = 22,
    text,
    accent,
    muted,
    dashed,
}: {
    x: number;
    y: number;
    w: number;
    h?: number;
    text: string;
    accent?: boolean;
    muted?: boolean;
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
                strokeOpacity={accent ? 0.9 : muted ? 0.2 : 0.35}
                strokeDasharray={dashed ? '4 3' : undefined}
            />
            <SketchText x={x + w / 2} y={y + h / 2 + 3.5} size={9} accent={accent} opacity={muted ? 0.5 : 1}>
                {text}
            </SketchText>
        </g>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. তিন পথে অনেক Row                                                          */
/* ------------------------------------------------------------------------- */

/**
 * Three lanes between an app and the database. Single INSERTs make one round
 * trip per row, a multi-row INSERT one trip per batch, COPY one command with
 * the rows streaming behind it.
 */
export function BulkTripsDiagram() {
    const lanes = [
        { y: 16, title: 'একটা একটা INSERT', sub: '5 Row = 5 বার যাওয়া আসা, 5 বার COMMIT' },
        { y: 126, title: 'অনেক Row এর এক INSERT', sub: '5 Row = 1 বার যাওয়া আসা' },
        { y: 236, title: 'COPY', sub: 'একটা Command, তারপর Row গড়িয়ে চলে' },
    ];
    return (
        <Sketch
            label='অনেক Row ঢোকানোর তিন পথ'
            height={350}
            viewBox='0 0 760 340'
            caption={
                <>
                    বাঁয়ে App, ডানে PostgreSQL। প্রথম পথে প্রতিটা Row এর জন্য আলাদা Statement যায় আর আলাদা উত্তর ফেরে। দ্বিতীয় পথে পাঁচটা
                    Row একটা INSERT এর VALUES এ চড়ে একবারে যায়। তৃতীয় পথে COPY একবার বলে দেয় কোন Table আর কোন Format, তারপর Row গুলো
                    সরল লেখা হিসেবে একটানা ঢোকে, প্রতিটার জন্য SQL এর পুরো Parse লাগে না।
                </>
            }>
            <defs>
                <Arrowhead id='bulk-trips-arrow' />
                <Arrowhead id='bulk-trips-arrow-hot' accent />
            </defs>
            {lanes.map((lane, i) => (
                <g key={lane.title}>
                    <SketchBox x={10} y={lane.y + 18} w={100} h={50} title='App' sub='Node, psql' />
                    <SketchBox x={650} y={lane.y + 18} w={100} h={50} title='PostgreSQL' sub='Server' accent={i === 2} />
                    <SketchText x={380} y={lane.y + 8} size={10} bold accent={i === 2}>
                        {lane.title}
                    </SketchText>
                    <SketchText x={380} y={lane.y + 84} size={9} body opacity={0.75}>
                        {lane.sub}
                    </SketchText>
                    {i === 0 &&
                        [0, 1, 2, 3, 4].map(k => (
                            <g key={k}>
                                <Arrow x1={116} y1={lane.y + 24 + k * 9} x2={642} y2={lane.y + 24 + k * 9} marker='bulk-trips-arrow' />
                                <Arrow
                                    x1={644}
                                    y1={lane.y + 28 + k * 9}
                                    x2={118}
                                    y2={lane.y + 28 + k * 9}
                                    marker='bulk-trips-arrow'
                                    dashed
                                />
                            </g>
                        ))}
                    {i === 1 && (
                        <>
                            <Arrow x1={116} y1={lane.y + 36} x2={642} y2={lane.y + 36} marker='bulk-trips-arrow' />
                            <Chip x={300} y={lane.y + 24} w={160} h={20} text='INSERT ... VALUES ×5' />
                            <Arrow x1={644} y1={lane.y + 54} x2={118} y2={lane.y + 54} marker='bulk-trips-arrow' dashed />
                            <SketchText x={380} y={lane.y + 66} size={8.5} opacity={0.7}>
                                INSERT 5
                            </SketchText>
                        </>
                    )}
                    {i === 2 && (
                        <>
                            <Arrow x1={116} y1={lane.y + 30} x2={642} y2={lane.y + 30} marker='bulk-trips-arrow-hot' accent />
                            <SketchText x={190} y={lane.y + 25} size={8.5} accent>
                                COPY ... FROM STDIN
                            </SketchText>
                            {[0, 1, 2, 3, 4].map(k => (
                                <Chip key={k} x={260 + k * 72} y={lane.y + 38} w={62} h={16} text={`row ${k + 1}`} accent />
                            ))}
                            <Arrow x1={644} y1={lane.y + 62} x2={118} y2={lane.y + 62} marker='bulk-trips-arrow' dashed />
                            <SketchText x={560} y={lane.y + 74} size={8.5} opacity={0.7}>
                                COPY 5
                            </SketchText>
                        </>
                    )}
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা CSV এর শরীর                                                         */
/* ------------------------------------------------------------------------- */

/**
 * Three real lines from the query boxes, split into fields, with the rule that
 * decides each tricky field written beside it.
 */
export function CsvAnatomyDiagram() {
    const rows: { y: number; label: string; fields: { text: string; w: number; note?: string; accent?: boolean; dashed?: boolean }[] }[] = [
        {
            y: 44,
            label: 'Header',
            fields: [
                { text: 'review_id', w: 90 },
                { text: 'rating', w: 70 },
                { text: 'comment', w: 300 },
            ],
        },
        {
            y: 112,
            label: 'Row',
            fields: [
                { text: '2', w: 90 },
                { text: '4', w: 70 },
                { text: '"Lovely trip, the ship back was crowded."', w: 300, note: 'ভেতরে কমা, তাই পুরোটা Quote এ', accent: true },
            ],
        },
        {
            y: 180,
            label: 'Row',
            fields: [
                { text: 'has quote', w: 90 },
                { text: '"The ""Cloud"" Valley"', w: 370, note: 'ভেতরের " লেখা হয় "" দিয়ে', accent: true },
            ],
        },
        {
            y: 244,
            label: 'Row',
            fields: [
                { text: 'null', w: 90 },
                { text: '(কিছুই না)', w: 120, note: 'Quote ছাড়া ফাঁকা = NULL', dashed: true },
            ],
        },
        {
            y: 244,
            label: 'Row',
            fields: [
                { text: 'empty text', w: 110 },
                { text: '""', w: 120, note: 'Quote সহ ফাঁকা = ফাঁকা লেখা', accent: true },
            ],
        },
    ];
    return (
        <Sketch
            label='একটা CSV লাইন কীভাবে Field এ ভাঙে'
            height={310}
            viewBox='0 0 760 300'
            caption={
                <>
                    প্রতিটা লাইন একটা Row, কমা Field এর সীমানা। যে মানের ভেতরে কমা, Double Quote বা নতুন লাইন আছে, সেটা পুরোটা Double Quote
                    এর ভেতরে যায়, আর ভেতরের Double Quote লেখা হয় পরপর দুইবার। নিচের সারিতে পাশাপাশি দুটো আলাদা লাইন: PostgreSQL এর
                    চুক্তিতে Quote ছাড়া একদম ফাঁকা Field মানে NULL, আর <code>&quot;&quot;</code> মানে ফাঁকা লেখা। সব লাইন এই লেসনের বক্স থেকে নেওয়া।
                </>
            }>
            <SketchText x={14} y={22} size={9} anchor='start' opacity={0.7}>
                , = Field এর সীমানা (DELIMITER)
            </SketchText>
            {rows.map((row, r) => {
                // The last two rows share a band: two separate lines, side by side.
                let x = r === rows.length - 1 ? 470 : 110;
                return (
                    <g key={r}>
                        <SketchText x={r === rows.length - 1 ? 420 : 14} y={row.y + 15} size={9.5} anchor='start' bold accent={r === 0}>
                            {row.label}
                        </SketchText>
                        {row.fields.map((f, i) => {
                            const fx = x;
                            x += f.w + 22;
                            return (
                                <g key={i}>
                                    <Chip x={fx} y={row.y} w={f.w} text={f.text} accent={f.accent} dashed={f.dashed} />
                                    {i < row.fields.length - 1 && (
                                        <SketchText x={fx + f.w + 11} y={row.y + 16} size={14} bold accent>
                                            ,
                                        </SketchText>
                                    )}
                                    {f.note && (
                                        <SketchText x={fx + f.w / 2} y={row.y + 40} size={9} body accent={f.accent}>
                                            {f.note}
                                        </SketchText>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. File টা কার মেশিনে                                                         */
/* ------------------------------------------------------------------------- */

function Machine({ x, y, w, h, title, sub }: { x: number; y: number; w: number; h: number; title: string; sub: string }) {
    return (
        <g>
            <rect x={x} y={y} width={w} height={h} fill='none' stroke='currentColor' strokeOpacity={0.35} strokeDasharray='6 4' />
            <SketchText x={x + 8} y={y + 14} size={9} anchor='start' bold>
                {title}
            </SketchText>
            <SketchText x={x + 8} y={y + 26} size={8} anchor='start' opacity={0.6}>
                {sub}
            </SketchText>
        </g>
    );
}

/**
 * COPY names a file the server opens on its own disk; \copy has psql open the
 * file on the laptop and stream it over the connection as COPY FROM STDIN.
 */
export function FileLocationSplit() {
    return (
        <SketchSplit
            label='COPY আর \copy: কে File খোলে'
            caption={
                <>
                    বাঁয়ে <code>COPY ... FROM &apos;/home/tanim/imports/agent.csv&apos;</code>: Command যায় Server এ, Server নিজের Disk এ সেই
                    Path খোঁজে, পায় না। ডানে <code>\copy</code>: psql নিজে Laptop এর File খোলে, আর Connection দিয়ে লাইনগুলো পাঠায়, Server এর দিকে
                    তখন চলে <code>COPY ... FROM STDIN</code>। Server এর নিজের Disk এ File থাকলে বাঁয়ের পথই সবচেয়ে দ্রুত।
                </>
            }
            panels={[
                {
                    title: 'COPY ... FROM file',
                    sub: 'Server খোলে, Server এর Disk এ',
                    viewBox: '0 0 340 220',
                    height: 220,
                    children: (
                        <>
                            <defs>
                                <Arrowhead id='bulk-where-server' />
                            </defs>
                            <Machine x={8} y={10} w={140} h={190} title='Laptop' sub='psql চলছে এখানে' />
                            <Machine x={192} y={10} w={140} h={190} title='Server' sub='island-pg Container' />
                            <Chip x={20} y={60} w={116} text='agent.csv' accent />
                            <Chip x={20} y={120} w={116} text='psql' />
                            <Arrow x1={140} y1={131} x2={214} y2={131} marker='bulk-where-server' />
                            <SketchText x={176} y={124} size={8}>
                                COPY ...
                            </SketchText>
                            <Chip x={214} y={120} w={106} text='PostgreSQL' />
                            <Chip x={214} y={60} w={106} text='/home/tanim/...?' dashed muted />
                            <Arrow x1={267} y1={118} x2={267} y2={86} marker='bulk-where-server' dashed />
                            <SketchText x={267} y={176} size={9} body accent>
                                No such file
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: '\\copy ... FROM file',
                    sub: 'psql খোলে, Laptop এর Disk এ',
                    viewBox: '0 0 340 220',
                    height: 220,
                    children: (
                        <>
                            <defs>
                                <Arrowhead id='bulk-where-client' accent />
                            </defs>
                            <Machine x={8} y={10} w={140} h={190} title='Laptop' sub='psql চলছে এখানে' />
                            <Machine x={192} y={10} w={140} h={190} title='Server' sub='island-pg Container' />
                            <Chip x={20} y={60} w={116} text='agent.csv' accent />
                            <Chip x={20} y={120} w={116} text='psql' accent />
                            <Arrow x1={78} y1={84} x2={78} y2={116} marker='bulk-where-client' accent />
                            <Arrow x1={140} y1={131} x2={212} y2={131} marker='bulk-where-client' accent />
                            <SketchText x={176} y={124} size={8} accent>
                                লাইনগুলো
                            </SketchText>
                            <Chip x={214} y={120} w={106} text='PostgreSQL' accent />
                            <SketchText x={267} y={160} size={8.5}>
                                COPY ... FROM STDIN
                            </SketchText>
                            <SketchText x={267} y={180} size={9} body accent>
                                COPY 8
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Staging এর পথ                                                             */
/* ------------------------------------------------------------------------- */

/** The nightly import: file, all-text staging, a verdict per line, then two destinations. */
export function StagingPipelineDiagram() {
    return (
        <Sketch
            label='Staging Table দিয়ে রাতের Import'
            height={270}
            viewBox='0 0 760 260'
            caption={
                <>
                    File এর আটটা লাইন সব text এর Staging Table এ ঢোকে, তাই COPY আটকায় না। তারপর SQL প্রতিটা লাইনের একটা রায় দেয়। ok লাইন যায়
                    bookings এ, বাকিগুলো Rejects এ, File এর লাইন নম্বর আর কারণসহ। শেষে Staging খালি। সংখ্যাগুলো এই লেসনের বক্সের: 4 আর 4।
                </>
            }>
            <defs>
                <Arrowhead id='bulk-stage-arrow' />
                <Arrowhead id='bulk-stage-arrow-hot' accent />
            </defs>
            <SketchBox x={10} y={95} w={110} h={60} title='CSV File' sub='8 লাইন + Header' />
            <Arrow x1={124} y1={125} x2={168} y2={125} marker='bulk-stage-arrow-hot' accent />
            <SketchText x={146} y={116} size={8} accent>
                COPY
            </SketchText>
            <SketchBox x={172} y={85} w={140} h={80} title='Staging' sub='সব Column text' accent />
            <SketchText x={242} y={182} size={8.5} body opacity={0.7}>
                two, ফাঁকা, নকল, সব ঢোকে
            </SketchText>
            <Arrow x1={316} y1={125} x2={360} y2={125} marker='bulk-stage-arrow' />
            <SketchBox x={364} y={85} w={150} h={80} title='রায় (verdict)' sub='trim, lower, JOIN' />
            <SketchText x={439} y={182} size={8.5} body opacity={0.7}>
                pg_input_is_valid, PARTITION BY
            </SketchText>
            <Arrow x1={518} y1={110} x2={598} y2={58} marker='bulk-stage-arrow-hot' accent />
            <Arrow x1={518} y1={140} x2={598} y2={192} marker='bulk-stage-arrow' />
            <SketchText x={548} y={74} size={8.5} accent>
                ok
            </SketchText>
            <SketchText x={548} y={186} size={8.5}>
                বাকি সব
            </SketchText>
            <SketchBox x={602} y={28} w={148} h={56} title='bookings' sub='4টা নতুন Booking' accent />
            <SketchBox x={602} y={166} w={148} h={56} title='Rejects' sub='4টা লাইন, কারণসহ' />
            <SketchText x={676} y={244} size={8.5} body opacity={0.7}>
                COPY TO দিয়ে Agency কে ফেরত
            </SketchText>
            <SketchText x={242} y={60} size={8.5} body opacity={0.7}>
                শেষে TRUNCATE, পরের রাতের জন্য খালি
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. এক লাখ Row, পাঁচ উপায়, আসল সময়                                             */
/* ------------------------------------------------------------------------- */

const SPEED: { label: string; sub: string; seconds: number }[] = [
    { label: 'একটা একটা INSERT', sub: 'Autocommit', seconds: 9.145 },
    { label: 'একটা একটা INSERT', sub: 'এক Transaction, psql -1', seconds: 4.9 },
    { label: 'ব্যাচ INSERT', sub: '1000 Row করে, 100 বার', seconds: 0.231 },
    { label: '\\copy', sub: 'Client এর File', seconds: 0.079 },
    { label: 'COPY', sub: 'Server এর File', seconds: 0.094 },
];

/** Horizontal bars, linear scale, from the first round of the container run. */
export function LoadSpeedChart() {
    const left = 230;
    const width = 470;
    const max = 10;
    return (
        <Sketch
            label='এক লাখ Row Load: আসল সময়, সেকেন্ডে'
            height={290}
            viewBox='0 0 760 280'
            caption={
                <>
                    আমাদের PostgreSQL 18.6 Container, Table এ একটা Primary Key, প্রতিবার আগে TRUNCATE। সংখ্যাগুলো প্রথম দফার, দ্বিতীয় দফা নিচের
                    ছকে। শেষের তিনটা বার এত ছোট যে প্রায় দেখাই যায় না, আর ঠিক সেটাই দেখানোর কথা: প্রথমটার চেয়ে \copy একশো গুণেরও বেশি দ্রুত।
                </>
            }>
            {[0, 2, 4, 6, 8, 10].map(t => (
                <g key={t}>
                    <line
                        x1={left + (t / max) * width}
                        y1={24}
                        x2={left + (t / max) * width}
                        y2={240}
                        stroke='currentColor'
                        strokeOpacity={0.12}
                    />
                    <SketchText x={left + (t / max) * width} y={258} size={8.5} opacity={0.7}>
                        {`${t} s`}
                    </SketchText>
                </g>
            ))}
            {SPEED.map((s, i) => {
                const y = 34 + i * 42;
                const w = Math.max(2, (s.seconds / max) * width);
                const fast = s.seconds < 1;
                return (
                    <g key={s.sub}>
                        <SketchText x={left - 10} y={y + 9} size={10} anchor='end' bold>
                            {s.label}
                        </SketchText>
                        <SketchText x={left - 10} y={y + 22} size={8.5} anchor='end' opacity={0.65}>
                            {s.sub}
                        </SketchText>
                        <rect
                            x={left}
                            y={y}
                            width={w}
                            height={22}
                            fill={fast ? 'var(--primary)' : 'currentColor'}
                            fillOpacity={fast ? 0.85 : 0.35}
                        />
                        <SketchText x={left + w + 8} y={y + 15} size={9.5} anchor='start' bold accent={fast}>
                            {`${s.seconds} s`}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}
