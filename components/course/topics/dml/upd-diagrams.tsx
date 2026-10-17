import { Sketch, SketchBox, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. একটা UPDATE Statement এর গঠন আর তার কাজের ক্রম                              */
/* ------------------------------------------------------------------------- */

function CodeLine({ x, y, children, accent, dim }: { x: number; y: number; children: React.ReactNode; accent?: boolean; dim?: boolean }) {
    return (
        <SketchText x={x} y={y} size={11.5} anchor='start' accent={accent} opacity={dim ? 0.6 : 1}>
            {children}
        </SketchText>
    );
}

function Callout({ x1, y, x2, label, sub }: { x1: number; y: number; x2: number; label: string; sub: string }) {
    return (
        <g>
            <line x1={x1} y1={y - 4} x2={x2 - 8} y2={y - 4} stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1' strokeDasharray='3 3' />
            <circle cx={x2 - 4} cy={y - 4} r={3} fill='var(--primary)' />
            <SketchText x={x2 + 6} y={y - 6} size={10.5} anchor='start' bold accent>
                {label}
            </SketchText>
            <SketchText x={x2 + 6} y={y + 9} size={10} anchor='start' body opacity={0.8}>
                {sub}
            </SketchText>
        </g>
    );
}

const ORDER_STEPS = [
    { n: '১', title: 'Row খোঁজা', sub: 'FROM আর WHERE' },
    { n: '২', title: 'নতুন মান হিসাব', sub: 'SET, পুরনো Row থেকে' },
    { n: '৩', title: 'নিয়ম পরীক্ষা', sub: 'CHECK, UNIQUE, FK' },
    { n: '৪', title: 'নতুন Version লেখা', sub: 'পুরনোটাও রেখে দিয়ে' },
    { n: '৫', title: 'RETURNING', sub: 'তারপর UPDATE n' },
];

/**
 * The clauses of one UPDATE, each with what it decides, and underneath the
 * order in which PostgreSQL actually does the work for every matched row.
 */
export function UpdateAnatomyDiagram() {
    return (
        <Sketch
            label='Anatomy of an UPDATE Statement'
            height={430}
            minWidth={920}
            viewBox='0 0 940 430'
            caption='লেখার ক্রম আর কাজের ক্রম এক না। PostgreSQL আগে FROM আর WHERE দিয়ে ঠিক করে কোন Row গুলো বদলাবে, তারপর প্রতিটা Row এর জন্য SET এর ডানদিকের হিসাব করে পুরনো মান থেকে, নিয়মগুলো পরীক্ষা করে, নতুন একটা Row Version লেখে, আর শেষে RETURNING এর তালিকা দেয়। কোনো একটা Row নিয়ম ভাঙলে পুরো Statement বাতিল, একটা Row ও বদলায় না।'>
            <rect x={20} y={20} width={500} height={250} fill='var(--card)' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.2' />
            <rect x={20} y={20} width={500} height={26} fill='var(--primary)' fillOpacity={0.1} />
            <SketchText x={34} y={37} size={10} anchor='start' bold accent>
                winter-prices.sql
            </SketchText>

            <CodeLine x={40} y={78} accent>UPDATE upd_tours t</CodeLine>
            <CodeLine x={40} y={106}>SET price_bdt = round(t.price_bdt * 1.10, 2),</CodeLine>
            <CodeLine x={76} y={128} dim>is_active = true</CodeLine>
            <CodeLine x={40} y={158}>FROM destinations d</CodeLine>
            <CodeLine x={40} y={186}>WHERE d.destination_id = t.destination_id</CodeLine>
            <CodeLine x={64} y={208} dim>{"AND d.region = 'Chattogram'"}</CodeLine>
            <CodeLine x={40} y={238}>RETURNING t.tour_id, old.price_bdt, new.price_bdt;</CodeLine>

            <Callout x1={200} y={78} x2={560} label='UPDATE Table [Alias]' sub='একবারে একটাই Table বদলায়' />
            <Callout x1={420} y={110} x2={560} label='SET Column = মান, কমা দিয়ে' sub='ডানদিকে যা পড়বেন, সব পুরনো Row এর মান' />
            <Callout x1={220} y={158} x2={560} label='FROM অন্য Table (ঐচ্ছিক)' sub='নতুন মান বা শর্ত অন্য Table থেকে আনতে' />
            <Callout x1={420} y={192} x2={560} label='WHERE শর্ত' sub='কোন Row বদলাবে। না দিলে Table এর সব Row' />
            <Callout x1={510} y={238} x2={560} label='RETURNING (ঐচ্ছিক)' sub='বদলানো Row ফেরত। PostgreSQL 18 এ old আর new' />

            <SketchText x={20} y={306} size={10} anchor='start' bold accent>
                প্রতিটা মিলে যাওয়া Row এর জন্য PostgreSQL যে ক্রমে কাজ করে
            </SketchText>
            <defs>
                <marker id='upd-anat-arrow' markerWidth='8' markerHeight='8' refX='7' refY='4' orient='auto'>
                    <path d='M0,0 L8,4 L0,8 z' fill='currentColor' fillOpacity={0.6} />
                </marker>
            </defs>
            {ORDER_STEPS.map((step, i) => {
                const x = 20 + i * 184;
                return (
                    <g key={step.n}>
                        <rect
                            x={x}
                            y={322}
                            width={160}
                            height={70}
                            fill={i === 1 ? 'var(--primary)' : 'transparent'}
                            fillOpacity={i === 1 ? 0.08 : 0}
                            stroke={i === 1 ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={i === 1 ? 0.9 : 0.4}
                            strokeWidth='1.2'
                        />
                        <SketchText x={x + 16} y={346} size={13} anchor='start' bold accent>
                            {step.n}
                        </SketchText>
                        <SketchText x={x + 34} y={346} size={11} anchor='start' bold body>
                            {step.title}
                        </SketchText>
                        <SketchText x={x + 16} y={374} size={9.5} anchor='start' body opacity={0.8}>
                            {step.sub}
                        </SketchText>
                        {i < ORDER_STEPS.length - 1 && (
                            <line
                                x1={x + 162}
                                y1={357}
                                x2={x + 182}
                                y2={357}
                                stroke='currentColor'
                                strokeOpacity={0.6}
                                strokeWidth='1.2'
                                markerEnd='url(#upd-anat-arrow)'
                            />
                        )}
                    </g>
                );
            })}
            <SketchText x={470} y={418} size={9.5} body opacity={0.75}>
                ধাপ ৩ এ একটা Row ও নিয়ম ভাঙলে পুরো Statement বাতিল: আগের Row গুলোর লেখাও ফেরত যায়
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. SET এর ডানদিক পুরনো Row পড়ে: PostgreSQL বনাম MySQL                          */
/* ------------------------------------------------------------------------- */

function Cell({ x, y, name, value, accent, faded }: { x: number; y: number; name: string; value: string; accent?: boolean; faded?: boolean }) {
    return (
        <g opacity={faded ? 0.55 : 1}>
            <rect
                x={x}
                y={y}
                width={130}
                height={44}
                fill={accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.1 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.9 : 0.4}
                strokeWidth='1.2'
            />
            <SketchText x={x + 12} y={y + 18} size={9.5} anchor='start' opacity={0.7}>
                {name}
            </SketchText>
            <SketchText x={x + 12} y={y + 35} size={12} anchor='start' bold accent={accent}>
                {value}
            </SketchText>
        </g>
    );
}

/**
 * `SET a = b, b = a` on one row. PostgreSQL computes every right hand side
 * from the row as it was, so the two values swap. MySQL runs single table
 * assignments left to right, so the second one reads the value the first one
 * just wrote, and both end up equal. Both results were run, not assumed.
 */
export function SetReadsOldSplit() {
    return (
        <SketchSplit
            label='SET a = b, b = a: Same Statement, Two Answers'
            caption='একই Statement, দুই Database এ দুই ফল। PostgreSQL এ SET এর প্রতিটা ডানদিক আগের Row থেকে পড়া, তাই a আর b জায়গা বদলায়। MySQL এর Documentation বলে এক Table এর UPDATE এ Assignment সাধারণত বাম থেকে ডানে চলে: প্রথমে a = b লেখা হয়, তারপর b = a পড়ে সদ্য লেখা a। দুটো ফলই এই লেসনের জন্য আসল Database এ চালিয়ে দেখা।'
            panels={[
                {
                    title: 'PostgreSQL 18',
                    sub: 'সব ডানদিক পুরনো Row থেকে',
                    viewBox: '0 0 420 270',
                    height: 270,
                    children: (
                        <g>
                            <defs>
                                <marker id='upd-swap-pg-arrow' markerWidth='8' markerHeight='8' refX='7' refY='4' orient='auto'>
                                    <path d='M0,0 L8,4 L0,8 z' fill='var(--primary)' />
                                </marker>
                            </defs>
                            <SketchText x={20} y={22} size={10} anchor='start' body opacity={0.8}>
                                আগের Row
                            </SketchText>
                            <Cell x={60} y={34} name='a' value='left' />
                            <Cell x={230} y={34} name='b' value='right' />
                            <line x1={295} y1={80} x2={140} y2={168} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#upd-swap-pg-arrow)' />
                            <line x1={125} y1={80} x2={280} y2={168} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#upd-swap-pg-arrow)' />
                            <SketchText x={210} y={264} size={9.5} body opacity={0.85}>
                                দুটো হিসাবই একসাথে, আগের মান থেকে
                            </SketchText>
                            <SketchText x={20} y={192} size={10} anchor='start' body opacity={0.8}>
                                নতুন Row
                            </SketchText>
                            <Cell x={60} y={204} name='a' value='right' accent />
                            <Cell x={230} y={204} name='b' value='left' accent />
                        </g>
                    ),
                },
                {
                    title: 'MySQL 8.4',
                    sub: 'বাম থেকে ডানে, একটার পর একটা',
                    viewBox: '0 0 420 270',
                    height: 270,
                    children: (
                        <g>
                            <defs>
                                <marker id='upd-swap-my-arrow' markerWidth='8' markerHeight='8' refX='7' refY='4' orient='auto'>
                                    <path d='M0,0 L8,4 L0,8 z' fill='currentColor' fillOpacity={0.7} />
                                </marker>
                            </defs>
                            <SketchText x={20} y={22} size={10} anchor='start' body opacity={0.8}>
                                আগের Row
                            </SketchText>
                            <Cell x={60} y={34} name='a' value='left' />
                            <Cell x={230} y={34} name='b' value='right' />
                            <line x1={295} y1={80} x2={140} y2={112} stroke='currentColor' strokeOpacity={0.7} strokeWidth='1.2' markerEnd='url(#upd-swap-my-arrow)' />
                            <SketchText x={20} y={106} size={9.5} anchor='start' body opacity={0.85}>
                                ধাপ ১: a = b
                            </SketchText>
                            <Cell x={60} y={118} name='a' value='right' faded />
                            <Cell x={230} y={118} name='b' value='right' faded />
                            <line x1={125} y1={164} x2={280} y2={198} stroke='currentColor' strokeOpacity={0.7} strokeWidth='1.2' markerEnd='url(#upd-swap-my-arrow)' />
                            <SketchText x={20} y={186} size={9.5} anchor='start' body opacity={0.85}>
                                ধাপ ২: b = নতুন a
                            </SketchText>
                            <Cell x={60} y={204} name='a' value='right' accent />
                            <Cell x={230} y={204} name='b' value='right' accent />
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. UPDATE ... FROM: প্রতিটা Row কতগুলো মিল পেল                                 */
/* ------------------------------------------------------------------------- */

function MatchRow({
    y,
    tag,
    target,
    sources,
    outcome,
    good,
    warn,
}: {
    y: number;
    tag: string;
    target: string;
    sources: string[];
    outcome: string;
    good?: boolean;
    warn?: boolean;
}) {
    const stroke = warn ? 'var(--destructive)' : good ? 'var(--primary)' : 'currentColor';
    return (
        <g>
            <SketchText x={20} y={y - 14} size={10} anchor='start' bold accent={good} body>
                {tag}
            </SketchText>
            <rect x={20} y={y} width={230} height={40} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={34} y={y + 25} size={10.5} anchor='start'>
                {target}
            </SketchText>
            {sources.length === 0 && (
                <g>
                    <line x1={250} y1={y + 20} x2={330} y2={y + 20} stroke='currentColor' strokeOpacity={0.35} strokeDasharray='3 4' />
                    <SketchText x={350} y={y + 24} size={10} anchor='start' body opacity={0.7}>
                        মিলে যাওয়া কোনো Row নেই
                    </SketchText>
                </g>
            )}
            {sources.map((source, i) => {
                const sy = y + (sources.length === 1 ? 0 : (i - (sources.length - 1) / 2) * 34);
                return (
                    <g key={source}>
                        <line x1={250} y1={y + 20} x2={340} y2={sy + 20} stroke={stroke} strokeOpacity={0.7} strokeWidth='1.2' />
                        <rect x={340} y={sy + 4} width={220} height={32} fill='transparent' stroke={stroke} strokeOpacity={0.6} strokeWidth='1' />
                        <SketchText x={352} y={sy + 25} size={10} anchor='start'>
                            {source}
                        </SketchText>
                    </g>
                );
            })}
            <rect
                x={600}
                y={y}
                width={320}
                height={40}
                fill={good ? 'var(--primary)' : warn ? 'var(--destructive)' : 'transparent'}
                fillOpacity={good || warn ? 0.08 : 0}
                stroke={stroke}
                strokeOpacity={0.7}
                strokeWidth='1.2'
            />
            <SketchText x={614} y={y + 25} size={10} anchor='start' body>
                {outcome}
            </SketchText>
        </g>
    );
}

/**
 * The three things that can happen to a target row in UPDATE ... FROM: exactly
 * one partner row (updated), none (left alone, silently), several (updated
 * from one of them, and the docs say which one is not readily predictable).
 */
export function UpdateFromMatchDiagram() {
    return (
        <Sketch
            label='UPDATE ... FROM: How Many Partner Rows?'
            height={420}
            minWidth={920}
            viewBox='0 0 940 420'
            caption='UPDATE ... FROM আসলে একটা Join: বদলানোর Table এর প্রতিটা Row তার জোড়া খোঁজে FROM এর Table এ। ঠিক একটা জোড়া পেলে বদলায়, একটাও না পেলে চুপচাপ যেমন ছিল তেমন থাকে। একাধিক জোড়া পেলে PostgreSQL কোনো Error দেয় না, যেকোনো একটা জোড়ার মান বসায়, আর Documentation স্পষ্ট বলে কোনটা বসবে তা আগে থেকে বলা যায় না। তাই FROM এর দিকটা আগে এমনভাবে বানান যাতে প্রতিটা Row এর জন্য একটাই জোড়া থাকে।'>
            <SketchText x={135} y={26} size={10} bold accent>
                বদলানোর Table
            </SketchText>
            <SketchText x={450} y={26} size={10} bold accent>
                FROM এর Table
            </SketchText>
            <SketchText x={760} y={26} size={10} bold accent>
                ফলাফল
            </SketchText>

            <MatchRow
                y={68}
                tag='ঠিক একটা জোড়া'
                target='tour 1, destination 1'
                sources={["destination 1, Chattogram"]}
                outcome='বদলাল: 12500.00 থেকে 13750.00'
                good
            />
            <MatchRow y={168} tag='কোনো জোড়া নেই' target='tour 3, destination 3' sources={[]} outcome='ছোঁয়া হয়নি: 18000.00 ই থাকল, কোনো Error ও না' />
            <MatchRow
                y={300}
                tag='একাধিক জোড়া'
                target='customer 1, last_total'
                sources={['booking 1: 25000.00', 'booking 8: 19000.00', 'booking 17: 36000.00']}
                outcome='যেকোনো একটা বসল, কোনটা তা নিশ্চিত না'
                warn
            />
            <SketchText x={760} y={366} size={9.5} body opacity={0.8}>
                সমাধান: আগে GROUP BY বা DISTINCT ON
            </SketchText>
            <SketchText x={760} y={382} size={9.5} body opacity={0.8}>
                দিয়ে প্রতি Customer এ একটা Row
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. UPDATE আসলে নতুন একটা Row Version লেখে                                      */
/* ------------------------------------------------------------------------- */

function Slot({
    x,
    y,
    ctid,
    text,
    state,
}: {
    x: number;
    y: number;
    ctid: string;
    text: string;
    state: 'live' | 'dead' | 'free' | 'new';
}) {
    const accent = state === 'new';
    return (
        <g opacity={state === 'dead' ? 0.5 : 1}>
            <rect
                x={x}
                y={y}
                width={250}
                height={30}
                fill={accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.1 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.9 : 0.4}
                strokeWidth='1.1'
                strokeDasharray={state === 'free' ? '4 3' : undefined}
            />
            <SketchText x={x + 10} y={y + 20} size={10} anchor='start' accent={accent} bold={accent}>
                {ctid}
            </SketchText>
            <SketchText x={x + 70} y={y + 20} size={10} anchor='start' opacity={state === 'free' ? 0.6 : 1}>
                {text}
            </SketchText>
            {state === 'dead' && <line x1={x + 66} y1={y + 15} x2={x + 240} y2={y + 15} stroke='currentColor' strokeWidth='1' />}
        </g>
    );
}

/**
 * What one UPDATE does on disk in PostgreSQL: the old row version is kept and
 * marked dead, a new version is written elsewhere in the page with a new ctid,
 * and VACUUM later makes the dead slot reusable without shrinking the file.
 * The ctid values are the ones the lesson's query box prints.
 */
export function RowVersionDiagram() {
    const stages = [
        {
            title: 'UPDATE এর আগে',
            slots: [
                { ctid: '(0,1)', text: 'tour 1 · 12500.00', state: 'live' as const },
                { ctid: '(0,2)', text: 'tour 2 · 8500.00', state: 'live' as const },
                { ctid: '...', text: 'tour 3 থেকে 9', state: 'live' as const },
                { ctid: '', text: 'Page এর বাকি খালি জায়গা', state: 'free' as const },
            ],
            note: 'প্রতিটা Row এর ঠিকানা ctid: (Page, Slot)',
        },
        {
            title: 'UPDATE এর পরে',
            slots: [
                { ctid: '(0,1)', text: 'tour 1 · 12500.00', state: 'dead' as const },
                { ctid: '(0,2)', text: 'tour 2 · 8500.00', state: 'live' as const },
                { ctid: '...', text: 'tour 3 থেকে 9', state: 'live' as const },
                { ctid: '(0,10)', text: 'tour 1 · 12501.00', state: 'new' as const },
            ],
            note: 'পুরনো Version মরা, নতুনটা অন্য Slot এ',
        },
        {
            title: 'VACUUM এর পরে',
            slots: [
                { ctid: '(0,1)', text: 'আবার ব্যবহারযোগ্য', state: 'free' as const },
                { ctid: '(0,2)', text: 'tour 2 · 8500.00', state: 'live' as const },
                { ctid: '...', text: 'tour 3 থেকে 9', state: 'live' as const },
                { ctid: '(0,10)', text: 'tour 1 · 12501.00', state: 'live' as const },
            ],
            note: 'জায়গা খালি হয়, File ছোট হয় না',
        },
    ];
    return (
        <Sketch
            label='An UPDATE Writes a New Row Version'
            height={300}
            minWidth={920}
            viewBox='0 0 940 300'
            caption='PostgreSQL কখনো Row এর জায়গায় বসে মান মুছে নতুন মান লেখে না। পুরনো Version টা রেখে দেয়, কারণ অন্য কোনো Transaction তখনো সেটা পড়তে পারে, আর ROLLBACK হলে সেটাই আবার সত্যি। নতুন Version যায় অন্য Slot এ, তাই ctid বদলায়। পুরনো মরা Version পরে VACUUM পরিষ্কার করে, সেই জায়গা পরের লেখায় কাজে লাগে, কিন্তু File নিজে ছোট হয় না। এই ব্যবস্থার নাম MVCC, পুরোটা Module 12 এ।'>
            {stages.map((stage, i) => {
                const x = 20 + i * 310;
                return (
                    <g key={stage.title}>
                        <SketchText x={x + 125} y={26} size={11} bold accent body>
                            {stage.title}
                        </SketchText>
                        <rect x={x - 8} y={38} width={266} height={180} fill='transparent' stroke='currentColor' strokeOpacity={0.25} />
                        <SketchText x={x} y={56} size={9} anchor='start' opacity={0.6}>
                            page 0
                        </SketchText>
                        {stage.slots.map((slot, j) => (
                            <Slot key={`${stage.title}-${slot.ctid}`} x={x} y={66 + j * 36} ctid={slot.ctid} text={slot.text} state={slot.state} />
                        ))}
                        <SketchText x={x + 125} y={246} size={10} body opacity={0.85}>
                            {stage.note}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={470} y={284} size={9.5} body opacity={0.75}>
                মান না বদলালেও নতুন Version লেখা হয়: SET price_bdt = price_bdt ও (0,1) থেকে (0,10) এ সরায়
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. Lost Update: হিসাব App এ বনাম হিসাব SQL এ                                     */
/* ------------------------------------------------------------------------- */

function TimelineStep({ x, y, text, accent, warn }: { x: number; y: number; text: string; accent?: boolean; warn?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={170}
                height={30}
                fill={warn ? 'var(--destructive)' : accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={warn || accent ? 0.08 : 0}
                stroke={warn ? 'var(--destructive)' : accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={0.6}
                strokeWidth='1.1'
            />
            <SketchText x={x + 85} y={y + 19} size={9.5}>
                {text}
            </SketchText>
        </g>
    );
}

/**
 * Two staff members book seats on departure 15 (12 seats left) at the same
 * moment. When the app reads the number and writes back its own result, one
 * booking is lost. When SQL does the subtraction, the second UPDATE waits for
 * the first row lock and then works on the committed value. Both runs were
 * reproduced with two psql sessions on PostgreSQL 18.
 */
export function LostUpdateSplit() {
    return (
        <SketchSplit
            label='Two Bookings at Once: Lost Update vs Atomic UPDATE'
            caption='বাম দিকে App নিজে হিসাব করে: দুজনেই 12 পড়েন, একজন লেখেন 10, আরেকজন 9। শেষে 9, অথচ ৫টা আসন বিক্রি হয়েছে, থাকার কথা 7। একজনের Booking হারিয়ে গেল, এর নাম Lost Update। ডান দিকে হিসাবটা SQL এর ভেতরে: দ্বিতীয় UPDATE প্রথমটার Row Lock ছাড়া পর্যন্ত অপেক্ষা করে, তারপর COMMIT হওয়া 10 থেকে 3 কমায়, ঠিক 7। Lock আর Isolation এর পুরো গল্প Module 12 এ।'
            panels={[
                {
                    title: 'হিসাব App এ',
                    sub: 'পড়া, তারপর নিজের ফল লেখা',
                    viewBox: '0 0 420 300',
                    height: 300,
                    children: (
                        <g>
                            <SketchText x={110} y={22} size={10} bold body>
                                কর্মী A (২ আসন)
                            </SketchText>
                            <SketchText x={310} y={22} size={10} bold body>
                                কর্মী B (৩ আসন)
                            </SketchText>
                            <TimelineStep x={25} y={40} text='SELECT: 12' />
                            <TimelineStep x={225} y={86} text='SELECT: 12' />
                            <TimelineStep x={25} y={132} text='SET seats_left = 10' />
                            <TimelineStep x={225} y={178} text='SET seats_left = 9' warn />
                            <SketchBox x={110} y={236} w={200} h={44} title='শেষে 9, হওয়ার কথা 7' sub='A এর Booking হারাল' />
                        </g>
                    ),
                },
                {
                    title: 'হিসাব SQL এ',
                    sub: 'SET seats_left = seats_left - n',
                    viewBox: '0 0 420 300',
                    height: 300,
                    children: (
                        <g>
                            <SketchText x={110} y={22} size={10} bold body>
                                কর্মী A (২ আসন)
                            </SketchText>
                            <SketchText x={310} y={22} size={10} bold body>
                                কর্মী B (৩ আসন)
                            </SketchText>
                            <TimelineStep x={25} y={40} text='seats_left - 2 → 10' accent />
                            <TimelineStep x={225} y={86} text='seats_left - 3 অপেক্ষা' />
                            <TimelineStep x={25} y={132} text='COMMIT' accent />
                            <TimelineStep x={225} y={178} text='10 - 3 → 7' accent />
                            <SketchBox x={110} y={236} w={200} h={44} title='শেষে 7, ঠিক' sub='কেউ হারায়নি' accent />
                        </g>
                    ),
                },
            ]}
        />
    );
}
