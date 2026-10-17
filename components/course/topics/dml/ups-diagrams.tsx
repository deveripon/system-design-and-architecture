import { Sketch, SketchSplit, SketchText } from '../../sketch';

function ArrowHead({ id }: { id: string }) {
    return (
        <marker id={id} markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
            <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
        </marker>
    );
}

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

function Node({
    x,
    y,
    w,
    h,
    title,
    sub,
    accent,
    dashed,
    danger,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    sub?: string;
    accent?: boolean;
    dashed?: boolean;
    danger?: boolean;
}) {
    const stroke = danger ? 'var(--destructive)' : accent ? 'var(--primary)' : 'currentColor';
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={danger ? 'var(--destructive)' : accent ? 'var(--primary)' : 'var(--card)'}
                fillOpacity={danger ? 0.08 : accent ? 0.1 : 1}
                stroke={stroke}
                strokeOpacity={accent || danger ? 1 : 0.45}
                strokeWidth='1.3'
                strokeDasharray={dashed ? '4 3' : undefined}
            />
            <SketchText x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} size={11} bold accent={accent}>
                {title}
            </SketchText>
            {sub && (
                <SketchText x={x + w / 2} y={y + h / 2 + 14} size={9.5} body opacity={0.8}>
                    {sub}
                </SketchText>
            )}
        </g>
    );
}

/** A small table drawn as rows of mono text, used inside split panels. */
function MiniTable({
    x,
    y,
    title,
    columns,
    rows,
    widths,
    highlight,
}: {
    x: number;
    y: number;
    title: string;
    columns: string[];
    rows: string[][];
    widths: number[];
    /** [row, column] cells drawn in the accent colour. */
    highlight?: [number, number][];
}) {
    const total = widths.reduce((a, b) => a + b, 0);
    const lefts = widths.reduce<number[]>((acc, w, i) => [...acc, i === 0 ? 0 : acc[i - 1] + widths[i - 1]], []);
    const isHot = (r: number, c: number) => highlight?.some(([hr, hc]) => hr === r && hc === c) ?? false;
    return (
        <g>
            <SketchText x={x} y={y} size={10} bold anchor='start'>
                {title}
            </SketchText>
            <rect x={x} y={y + 8} width={total} height={22} fill='currentColor' fillOpacity={0.06} stroke='currentColor' strokeOpacity={0.4} />
            {columns.map((c, i) => (
                <SketchText key={c} x={x + lefts[i] + 8} y={y + 23} size={9.5} bold anchor='start'>
                    {c}
                </SketchText>
            ))}
            {rows.map((row, r) => (
                <g key={r}>
                    <rect x={x} y={y + 30 + r * 22} width={total} height={22} fill='none' stroke='currentColor' strokeOpacity={0.3} />
                    {row.map((cell, c) => (
                        <g key={c}>
                            {isHot(r, c) && (
                                <rect
                                    x={x + lefts[c] + 2}
                                    y={y + 32 + r * 22}
                                    width={widths[c] - 4}
                                    height={18}
                                    fill='var(--primary)'
                                    fillOpacity={0.14}
                                />
                            )}
                            <SketchText x={x + lefts[c] + 8} y={y + 45 + r * 22} size={9.5} anchor='start' accent={isHot(r, c)} bold={isHot(r, c)}>
                                {cell}
                            </SketchText>
                        </g>
                    ))}
                </g>
            ))}
        </g>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. একটা প্রস্তাবিত Row এর তিনটা সম্ভাব্য পথ                                    */
/* ------------------------------------------------------------------------- */

/**
 * What PostgreSQL does with each proposed row of INSERT ... ON CONFLICT: look
 * it up in the arbiter index named by the conflict target, insert when there
 * is no match, and otherwise skip it (DO NOTHING) or update the existing row
 * (DO UPDATE), where a WHERE can still turn the update into nothing.
 */
export function UpsertPathsDiagram() {
    return (
        <Sketch
            label='One Proposed Row, Three Paths'
            height={400}
            minWidth={920}
            viewBox='0 0 940 400'
            caption='প্রতিটা প্রস্তাবিত Row আলাদা করে এই পথ পার হয়। Conflict Target এ যে Unique Index এর নাম আছে (Docs এর ভাষায় Arbiter Index), PostgreSQL শুধু সেখানেই মিল খোঁজে। মিল না পেলে সাধারণ INSERT। মিল পেলে DO NOTHING হলে Row টা বাদ, DO UPDATE হলে পুরনো Row টা বদলায়। DO UPDATE এর সাথে WHERE থাকলে আর সেটা মিথ্যা হলে কিছুই বদলায় না, শুধু Row টা Lock হয়, আর RETURNING এ সেই Row আসে না।'>
            <defs>
                <ArrowHead id='ups-paths-arrow' />
            </defs>
            <Node x={20} y={160} w={170} h={70} title='প্রস্তাবিত Row' sub='VALUES বা SELECT থেকে' />
            <Node x={250} y={150} w={200} h={90} title='Arbiter Index এ খোঁজ' sub='ON CONFLICT (email)' accent />

            <Node x={530} y={30} w={170} h={64} title='INSERT' sub='নতুন Row, মিল নেই' accent />
            <Node x={530} y={170} w={170} h={64} title='DO NOTHING' sub='Row টা বাদ, Error না' />
            <Node x={530} y={300} w={170} h={64} title='DO UPDATE SET' sub='পুরনো Row আর EXCLUDED' />

            <Node x={760} y={250} w={160} h={56} title='WHERE সত্য' sub='Row বদলায়, গোনা হয়' accent />
            <Node x={760} y={330} w={160} h={56} title='WHERE মিথ্যা' sub='কিছুই না, শুধু Lock' dashed />

            <Arrow id='ups-paths-arrow' d='M 190 195 L 246 195' />
            <Arrow id='ups-paths-arrow' d='M 450 170 C 490 150 490 70 526 64' />
            <Arrow id='ups-paths-arrow' d='M 450 200 L 526 202' />
            <Arrow id='ups-paths-arrow' d='M 450 225 C 490 245 490 325 526 330' />
            <Arrow id='ups-paths-arrow' d='M 700 320 C 730 310 735 285 756 280' />
            <Arrow id='ups-paths-arrow' d='M 700 342 C 730 350 735 356 756 358' dashed />

            <SketchText x={472} y={100} size={9.5} body opacity={0.85}>
                মিল নেই
            </SketchText>
            <SketchText x={488} y={192} size={9.5} body opacity={0.85}>
                মিল আছে
            </SketchText>
            <SketchText x={472} y={300} size={9.5} body opacity={0.85}>
                মিল আছে
            </SketchText>
            <SketchText x={815} y={110} size={9.5} body opacity={0.85}>
                psql: INSERT 0 n
            </SketchText>
            <SketchText x={815} y={128} size={9.5} body opacity={0.85}>
                n = ঢোকানো + বদলানো
            </SketchText>
            <SketchText x={815} y={146} size={9.5} body opacity={0.85}>
                বাদ পড়াগুলো গোনা হয় না
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. আগে খোঁজা, তারপর ঢোকানো: দুই জানালার দৌড়                                  */
/* ------------------------------------------------------------------------- */

/**
 * The check then insert race, with the timings from a real run on PostgreSQL
 * 18: both sessions count zero rows, the second INSERT waits for the first
 * transaction, and fails with 23505 the moment the first one commits.
 */
export function CheckThenInsertRaceDiagram() {
    const laneA = 90;
    const laneB = 230;
    const t = (s: number) => 140 + s * 200;
    return (
        <Sketch
            label='Check Then Insert: The Race'
            height={340}
            minWidth={920}
            viewBox='0 0 940 340'
            caption='দুটো Browser Tab, দুটো আলাদা Database Connection। দুজনেই আগে খুঁজে দেখে Jui আছেন কিনা, আর দুজনেই 0 পায়, কারণ প্রথম Tab এর INSERT তখনো COMMIT হয়নি, অন্য কেউ সেটা দেখতে পায় না। দ্বিতীয় Tab এর INSERT তখন অপেক্ষা করে। প্রথমটা COMMIT করার সাথে সাথে দ্বিতীয়টা 23505 Error পায়। সময়গুলো PostgreSQL 18 এ দুটো psql জানালায় আসল পরীক্ষা থেকে নেওয়া।'>
            <defs>
                <ArrowHead id='ups-race-arrow' />
            </defs>
            <SketchText x={20} y={laneA + 4} size={11} bold anchor='start'>
                Tab 1
            </SketchText>
            <SketchText x={20} y={laneB + 4} size={11} bold anchor='start'>
                Tab 2
            </SketchText>
            <line x1={110} y1={laneA} x2={920} y2={laneA} stroke='currentColor' strokeOpacity={0.3} />
            <line x1={110} y1={laneB} x2={920} y2={laneB} stroke='currentColor' strokeOpacity={0.3} />

            {[0, 1, 2, 3].map(s => (
                <g key={s}>
                    <line x1={t(s)} y1={40} x2={t(s)} y2={300} stroke='currentColor' strokeOpacity={0.12} strokeDasharray='3 4' />
                    <SketchText x={t(s)} y={322} size={9.5} opacity={0.8}>
                        {`${s} s`}
                    </SketchText>
                </g>
            ))}

            <Node x={t(0) - 10} y={laneA - 50} w={130} h={36} title='count = 0' />
            <Node x={t(0) + 10} y={laneA + 12} w={150} h={36} title='INSERT 0 1' sub='এখনো COMMIT না' />
            <Node x={t(3) - 70} y={laneA - 50} w={140} h={36} title='COMMIT' accent />

            <Node x={t(1) - 60} y={laneB - 54} w={130} h={36} title='count = 0' sub='Tab 1 এর Row অদৃশ্য' />
            <rect x={t(1) + 20} y={laneB + 10} width={t(3) - t(1) - 20} height={26} fill='currentColor' fillOpacity={0.06} stroke='currentColor' strokeOpacity={0.4} strokeDasharray='4 3' />
            <SketchText x={(t(1) + t(3)) / 2 + 10} y={laneB + 27} size={9.5} body opacity={0.9}>
                INSERT অপেক্ষা করছে, 1966 ms
            </SketchText>
            <Node x={t(3) + 20} y={laneB + 2} w={170} h={40} title='ERROR 23505' sub='duplicate key' danger />

            <Arrow id='ups-race-arrow' d={`M ${t(3)} ${laneA - 12} L ${t(3)} ${laneB - 6}`} dashed />
            <SketchText x={t(3) + 70} y={(laneA + laneB) / 2 - 2} size={9.5} body opacity={0.85}>
                COMMIT হতেই অপেক্ষা শেষ
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. পুরনো Row আর EXCLUDED মুখোমুখি                                            */
/* ------------------------------------------------------------------------- */

/**
 * The two rows a DO UPDATE can read: the existing row under the table name or
 * alias, and the rejected proposal under EXCLUDED. SET picks, column by column,
 * which one the final row takes.
 */
export function ExcludedSplit() {
    const cols = ['tour_id', 'title', 'price_bdt', 'is_active'];
    const widths = [70, 210, 90, 80];
    return (
        <SketchSplit
            label='Existing Row Meets EXCLUDED'
            caption='বাঁ দিকে Conflict এর মুহূর্ত: Table এ আগে থেকে থাকা Row (নাম t, কারণ INSERT INTO ups_tours AS t) আর প্রত্যাখ্যাত প্রস্তাব, যার নাম EXCLUDED। ডান দিকে SET price_bdt = EXCLUDED.price_bdt এর পরে: দামটা এসেছে EXCLUDED থেকে, বাকি সব Column আগের মতোই, কারণ SET এ তাদের নাম নেই।'
            panels={[
                {
                    title: 'Conflict এর মুহূর্তে',
                    sub: 'দুটো Row, একই tour_id',
                    viewBox: '0 0 480 200',
                    height: 200,
                    minWidth: 440,
                    children: (
                        <>
                            <MiniTable
                                x={10}
                                y={22}
                                title='t (Table এ যা আছে)'
                                columns={cols}
                                widths={widths}
                                rows={[['1', 'Saint Martin Island Escape', '12500.00', 't']]}
                            />
                            <MiniTable
                                x={10}
                                y={118}
                                title='EXCLUDED (যা ঢুকতে চেয়েছিল)'
                                columns={cols}
                                widths={widths}
                                rows={[['1', 'Saint Martin Island Escape', '13000.00', 't']]}
                                highlight={[[0, 2]]}
                            />
                        </>
                    ),
                },
                {
                    title: 'SET এর পরে',
                    sub: 'SET price_bdt = EXCLUDED.price_bdt',
                    viewBox: '0 0 480 200',
                    height: 200,
                    minWidth: 440,
                    children: (
                        <>
                            <MiniTable
                                x={10}
                                y={22}
                                title='t (নতুন চেহারা)'
                                columns={cols}
                                widths={widths}
                                rows={[['1', 'Saint Martin Island Escape', '13000.00', 't']]}
                                highlight={[[0, 2]]}
                            />
                            <SketchText x={10} y={130} size={10} body anchor='start' opacity={0.85}>
                                tour_id, title, is_active: SET এ নাম নেই, তাই আগের মান
                            </SketchText>
                            <SketchText x={10} y={152} size={10} body anchor='start' opacity={0.85}>
                                price_bdt: EXCLUDED থেকে, 12500.00 থেকে 13000.00
                            </SketchText>
                            <SketchText x={10} y={174} size={10} body anchor='start' opacity={0.85}>
                                EXCLUDED আর t দুটোই একসাথে পড়া যায়: t.price_bdt + 500
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. MERGE: উৎস আর লক্ষ্য, তিন রকম মিল                                          */
/* ------------------------------------------------------------------------- */

/**
 * MERGE joins a source to a target and sorts every pair into one of three
 * buckets, each with its own WHEN clauses. The tour numbers are the lesson's
 * feed (tours 1, 2 and 10) against the nine sample tours.
 */
export function MergeAnatomyDiagram() {
    return (
        <Sketch
            label='MERGE: Three Kinds of Match'
            height={400}
            minWidth={920}
            viewBox='0 0 940 400'
            caption='MERGE প্রথমে উৎস (USING) আর লক্ষ্য (INTO) Table কে ON শর্তে জোড়া লাগায়, তারপর প্রতিটা জোড়াকে তিন ঝুড়ির একটায় রাখে। দুই দিকেই আছে মানে MATCHED, শুধু উৎসে আছে মানে NOT MATCHED, শুধু লক্ষ্যে আছে মানে NOT MATCHED BY SOURCE (PostgreSQL 17 থেকে)। প্রতিটা ঝুড়ির জন্য WHEN লিখে বলে দেন কী হবে, আর WHEN এর সাথে AND শর্ত জুড়ে দেওয়া যায়। একটা Row এর জন্য প্রথম যে WHEN সত্য, শুধু সেটাই চলে।'>
            <defs>
                <ArrowHead id='ups-merge-arrow' />
            </defs>
            <Node x={20} y={40} w={180} h={110} title='উৎস: price feed' sub='tour 1, 2, 10' />
            <Node x={20} y={240} w={180} h={110} title='লক্ষ্য: ups_tours' sub='tour 1 থেকে 9' />
            <Node x={262} y={150} w={190} h={90} title='ON t.tour_id = f.tour_id' sub='দুই দিক জোড়া লাগানো' accent />

            <Node x={520} y={30} w={190} h={80} title='MATCHED' sub='tour 1, 2: দুই দিকেই' accent />
            <Node x={520} y={160} w={190} h={80} title='NOT MATCHED' sub='tour 10: শুধু উৎসে' accent />
            <Node x={520} y={290} w={190} h={80} title='NOT MATCHED BY SOURCE' sub='tour 3 থেকে 9: শুধু লক্ষ্যে' accent />

            <Node x={760} y={30} w={160} h={80} title='UPDATE, DELETE' sub='অথবা DO NOTHING' />
            <Node x={760} y={160} w={160} h={80} title='INSERT' sub='অথবা DO NOTHING' />
            <Node x={760} y={290} w={160} h={80} title='UPDATE, DELETE' sub='অথবা DO NOTHING' />

            <Arrow id='ups-merge-arrow' d='M 200 95 C 232 100 236 170 258 180' />
            <Arrow id='ups-merge-arrow' d='M 200 295 C 232 290 236 220 258 212' />
            <Arrow id='ups-merge-arrow' d='M 452 175 C 485 160 485 80 516 72' />
            <Arrow id='ups-merge-arrow' d='M 452 195 L 516 200' />
            <Arrow id='ups-merge-arrow' d='M 452 215 C 485 230 485 320 516 328' />
            <Arrow id='ups-merge-arrow' d='M 710 70 L 756 70' />
            <Arrow id='ups-merge-arrow' d='M 710 200 L 756 200' />
            <Arrow id='ups-merge-arrow' d='M 710 330 L 756 330' />
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. MySQL: ON DUPLICATE KEY UPDATE বনাম REPLACE                               */
/* ------------------------------------------------------------------------- */

/**
 * The same request handled two ways in MySQL 8.4, from a real run: the upsert
 * changes Rahim's row in place, REPLACE deletes it (firing the cascade and the
 * delete trigger) and inserts a brand new row with a new id and no phone.
 */
export function ReplaceVsUpsertSplit() {
    return (
        <SketchSplit
            label='MySQL: Upsert vs REPLACE'
            caption='দুই পাশেই একই অনুরোধ: Rahim এর Row আবার পাঠানো, ফোন ছাড়া। বাঁ পাশে ON DUPLICATE KEY UPDATE: Row টা জায়গায় দাঁড়িয়ে বদলায়, member_id 1 থাকে, Wishlist অক্ষত। ডান পাশে REPLACE: পুরনো Row মুছে যায়, তাই ON DELETE CASCADE এ Rahim এর দুটো Wishlist Row মুছে যায়, DELETE Trigger চলে, তারপর একদম নতুন Row ঢোকে নতুন member_id 3 নিয়ে, আর ফোনের ঘর খালি, কারণ নতুন Row তে ফোন দেওয়াই হয়নি। দুটোই MySQL 8.4 এ আসল পরীক্ষা।'
            panels={[
                {
                    title: 'ON DUPLICATE KEY UPDATE',
                    sub: '2 rows affected মানে একটা Row বদলেছে',
                    viewBox: '0 0 460 210',
                    height: 210,
                    minWidth: 420,
                    children: (
                        <>
                            <MiniTable
                                x={10}
                                y={22}
                                title='ups_members'
                                columns={['member_id', 'email', 'phone']}
                                widths={[90, 200, 130]}
                                rows={[['1', 'rahim.uddin@...', '+8801000000199']]}
                                highlight={[[0, 2]]}
                            />
                            <MiniTable
                                x={10}
                                y={112}
                                title='ups_wishlist (Rahim এর)'
                                columns={['member_id', 'tour_id']}
                                widths={[90, 90]}
                                rows={[
                                    ['1', '1'],
                                    ['1', '4'],
                                ]}
                            />
                            <SketchText x={300} y={170} size={10} body opacity={0.85}>
                                id একই, সম্পর্ক অক্ষত
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'REPLACE INTO',
                    sub: '2 rows affected মানে 1 মোছা + 1 ঢোকানো',
                    viewBox: '0 0 460 210',
                    height: 210,
                    minWidth: 420,
                    children: (
                        <>
                            <MiniTable
                                x={10}
                                y={22}
                                title='ups_members'
                                columns={['member_id', 'email', 'phone']}
                                widths={[90, 200, 130]}
                                rows={[['3', 'rahim.uddin@...', 'NULL']]}
                                highlight={[
                                    [0, 0],
                                    [0, 2],
                                ]}
                            />
                            <MiniTable
                                x={10}
                                y={112}
                                title='ups_wishlist (Rahim এর)'
                                columns={['member_id', 'tour_id']}
                                widths={[90, 90]}
                                rows={[['(কিছু নেই)', '']]}
                            />
                            <SketchText x={310} y={150} size={10} body opacity={0.85}>
                                CASCADE এ দুটো Row মুছে গেছে
                            </SketchText>
                            <SketchText x={310} y={170} size={10} body opacity={0.85}>
                                DELETE Trigger চলেছে
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}
