import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. এক দফায় অনেকগুলো গোনা                                                   */
/* ------------------------------------------------------------------------- */

const SAMPLE_ROWS = [
    { id: 1, status: 'confirmed' },
    { id: 5, status: 'cancelled' },
    { id: 13, status: 'confirmed' },
    { id: 14, status: 'pending' },
    { id: 17, status: 'pending' },
    { id: 18, status: 'cancelled' },
    { id: 23, status: 'confirmed' },
];

const TALLIES = [
    { name: 'count(*)', rule: 'সব Row', value: '24', match: () => true },
    { name: 'confirmed', rule: "status = 'confirmed'", value: '17', match: (s: string) => s === 'confirmed' },
    { name: 'pending', rule: "status = 'pending'", value: '4', match: (s: string) => s === 'pending' },
    { name: 'cancelled', rule: "status = 'cancelled'", value: '3', match: (s: string) => s === 'cancelled' },
];

/**
 * One scan of bookings feeds four counters at once. Every row passes every
 * counter, and each counter only ticks for the rows its condition accepts.
 */
export function OnePassDiagram() {
    const rowH = 30;
    const top = 70;
    const tallyX = 560;
    const tallyW = 250;
    const tallyH = 64;
    return (
        <Sketch
            label='One Pass, Four Counters'
            height={360}
            minWidth={880}
            viewBox='0 0 880 360'
            caption='bookings Table একবারই পড়া হয়। প্রতিটা Row চারটা গোনার খাতার পাশ দিয়ে যায়, আর প্রতিটা খাতা শুধু তখনই দাগ কাটে যখন তার শর্ত সত্যি। এখানে সাতটা নমুনা Row দেখানো, পুরো Table এর 24টা Row এর শেষ হিসাব খাতার নিচে লেখা।'>
            <defs>
                <marker id='condagg-pass-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            <SketchText x={130} y={48} size={11} bold accent>
                bookings
            </SketchText>
            {SAMPLE_ROWS.map((row, i) => (
                <g key={row.id}>
                    <rect x={40} y={top + i * rowH} width={180} height={rowH - 6} fill='currentColor' fillOpacity={0.04} stroke='currentColor' strokeOpacity={0.4} strokeWidth='1' />
                    <SketchText x={56} y={top + i * rowH + 16} size={10} anchor='start' opacity={0.7}>
                        {`#${row.id}`}
                    </SketchText>
                    <SketchText x={204} y={top + i * rowH + 16} size={10} anchor='end'>
                        {row.status}
                    </SketchText>
                </g>
            ))}
            <SketchText x={130} y={top + SAMPLE_ROWS.length * rowH + 14} size={9.5} body opacity={0.7}>
                আরও 17টা Row
            </SketchText>

            <line x1={236} y1={175} x2={540} y2={175} stroke='var(--primary)' strokeWidth='1.6' markerEnd='url(#condagg-pass-arrow)' />
            <SketchText x={388} y={160} size={10.5} body accent>
                একবার পড়া, প্রতিটা Row
            </SketchText>
            <SketchText x={388} y={196} size={10.5} body opacity={0.8}>
                চারটা খাতার পাশ দিয়ে যায়
            </SketchText>

            {TALLIES.map((t, i) => {
                const y = 30 + i * (tallyH + 14);
                const hits = SAMPLE_ROWS.filter(r => t.match(r.status)).length;
                return (
                    <g key={t.name}>
                        <rect x={tallyX} y={y} width={tallyW} height={tallyH} fill='var(--primary)' fillOpacity={i === 0 ? 0.04 : 0.08} stroke={i === 0 ? 'currentColor' : 'var(--primary)'} strokeOpacity={i === 0 ? 0.45 : 0.8} strokeWidth='1.2' />
                        <SketchText x={tallyX + 14} y={y + 22} size={11} bold anchor='start' accent={i > 0}>
                            {t.name}
                        </SketchText>
                        <SketchText x={tallyX + 14} y={y + 42} size={9.5} anchor='start' opacity={0.75}>
                            {t.rule}
                        </SketchText>
                        <SketchText x={tallyX + 14} y={y + 57} size={9} body anchor='start' opacity={0.65}>
                            {`নমুনায় ${hits}টা দাগ`}
                        </SketchText>
                        <SketchText x={tallyX + tallyW - 16} y={y + 40} size={20} bold anchor='end' accent={i > 0}>
                            {t.value}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. COUNT এর ফাঁদ: ELSE 0 দিলেই সব গোনা হয়ে যায়                              */
/* ------------------------------------------------------------------------- */

const TRAP_ROWS = ['confirmed', 'pending', 'confirmed', 'cancelled', 'confirmed', 'pending'];

function TrapPanel({ withElse }: { withElse: boolean }) {
    const top = 40;
    const rowH = 30;
    const counted = TRAP_ROWS.filter(s => withElse || s === 'confirmed').length;
    return (
        <>
            <SketchText x={20} y={22} size={9.5} anchor='start' opacity={0.7}>
                status
            </SketchText>
            <SketchText x={230} y={22} size={9.5} anchor='middle' opacity={0.7}>
                CASE এর ফল
            </SketchText>
            <SketchText x={330} y={22} size={9.5} anchor='middle' opacity={0.7}>
                গোনা হলো?
            </SketchText>
            {TRAP_ROWS.map((status, i) => {
                const y = top + i * rowH;
                const isMatch = status === 'confirmed';
                const value = isMatch ? '1' : withElse ? '0' : 'NULL';
                const counts = isMatch || withElse;
                return (
                    <g key={i}>
                        <SketchText x={20} y={y + 4} size={10.5} anchor='start'>
                            {status}
                        </SketchText>
                        <SketchText x={230} y={y + 4} size={11} bold accent={value === '1'} opacity={value === 'NULL' ? 0.5 : 1}>
                            {value}
                        </SketchText>
                        <SketchText x={330} y={y + 4} size={11} bold accent={counts && !isMatch} opacity={counts ? 1 : 0.45}>
                            {counts ? 'হ্যাঁ' : 'না'}
                        </SketchText>
                    </g>
                );
            })}
            <line x1={20} y1={top + TRAP_ROWS.length * rowH - 6} x2={380} y2={top + TRAP_ROWS.length * rowH - 6} stroke='currentColor' strokeOpacity={0.3} />
            <SketchText x={20} y={top + TRAP_ROWS.length * rowH + 18} size={11} anchor='start' bold>
                COUNT =
            </SketchText>
            <SketchText x={330} y={top + TRAP_ROWS.length * rowH + 18} size={16} bold accent>
                {String(counted)}
            </SketchText>
        </>
    );
}

/**
 * COUNT counts every value that is not NULL. With no ELSE the misses become
 * NULL and are skipped; with ELSE 0 the misses become zeros, and a zero is a
 * value, so every row is counted.
 */
export function CountTrapSplit() {
    return (
        <SketchSplit
            label='COUNT and the ELSE 0 Trap'
            caption='একই ছয়টা Row, দুটো লেখা। বাঁ দিকে ELSE নেই, তাই না মেলা Row গুলো NULL পায় আর COUNT তাদের বাদ দেয়: 3। ডান দিকে ELSE 0, আর শূন্যও একটা মান, তাই COUNT সব ছয়টা গোনে। SUM এর বেলায় ELSE 0 নিরাপদ, কারণ শূন্য যোগ করলে কিছু বদলায় না। COUNT এর বেলায় সেটাই ভুল।'
            panels={[
                {
                    title: 'THEN 1 END',
                    sub: 'COUNT(CASE WHEN … THEN 1 END)',
                    viewBox: '0 0 400 250',
                    height: 250,
                    minWidth: 340,
                    children: <TrapPanel withElse={false} />,
                },
                {
                    title: 'THEN 1 ELSE 0 END',
                    sub: 'COUNT(CASE WHEN … THEN 1 ELSE 0 END)',
                    viewBox: '0 0 400 250',
                    height: 250,
                    minWidth: 340,
                    children: <TrapPanel withElse />,
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. WHERE সবার দরজা, FILTER একজনের দরজা                                      */
/* ------------------------------------------------------------------------- */

const COUNTERS = ['count(*)', 'confirmed', 'pending', 'cancelled'];

function Lane({
    y,
    title,
    gate,
    values,
    perCounter,
}: {
    y: number;
    title: string;
    gate: string;
    values: string[];
    perCounter: boolean;
}) {
    const startX = 330;
    const w = 120;
    const gap = 14;
    return (
        <g>
            <SketchText x={20} y={y + 6} size={11} bold anchor='start' accent>
                {title}
            </SketchText>
            <rect x={20} y={y + 22} width={110} height={44} fill='currentColor' fillOpacity={0.04} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={75} y={y + 40} size={10.5} bold>
                bookings
            </SketchText>
            <SketchText x={75} y={y + 56} size={9} opacity={0.7}>
                24 Row
            </SketchText>
            {!perCounter && (
                <g>
                    <rect x={160} y={y + 18} width={140} height={52} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.3' />
                    <SketchText x={230} y={y + 38} size={10} bold accent>
                        WHERE
                    </SketchText>
                    <SketchText x={230} y={y + 56} size={9} opacity={0.85}>
                        {gate}
                    </SketchText>
                    <line x1={130} y1={y + 44} x2={156} y2={y + 44} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#condagg-gate-arrow)' />
                    <line x1={300} y1={y + 44} x2={326} y2={y + 44} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#condagg-gate-arrow)' />
                </g>
            )}
            {perCounter && (
                <line x1={130} y1={y + 44} x2={326} y2={y + 44} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#condagg-gate-arrow)' />
            )}
            {COUNTERS.map((name, i) => {
                const x = startX + i * (w + gap);
                return (
                    <g key={name}>
                        <rect x={x} y={y + 14} width={w} height={60} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.1' />
                        {perCounter && i > 0 && (
                            <rect x={x} y={y + 14} width={w} height={14} fill='var(--primary)' fillOpacity={0.18} />
                        )}
                        {perCounter && i > 0 && (
                            <SketchText x={x + w / 2} y={y + 25} size={8} bold accent>
                                FILTER
                            </SketchText>
                        )}
                        <SketchText x={x + w / 2} y={y + 44} size={10}>
                            {name}
                        </SketchText>
                        <SketchText x={x + w / 2} y={y + 64} size={14} bold accent={values[i] !== '0'} opacity={values[i] === '0' ? 0.5 : 1}>
                            {values[i]}
                        </SketchText>
                    </g>
                );
            })}
        </g>
    );
}

/**
 * WHERE removes rows before any counter sees them, so every column changes.
 * FILTER sits in front of one counter, so the other columns still see every row.
 */
export function WhereVsFilterDiagram() {
    return (
        <Sketch
            label='WHERE Gates Everyone, FILTER Gates One'
            height={250}
            minWidth={880}
            viewBox='0 0 880 250'
            caption="উপরের সারিতে WHERE status = 'confirmed' দরজায় দাঁড়িয়ে আছে, তাই pending আর cancelled কখনো কোনো Row দেখেই না, আর count(*) নেমে আসে 17 তে। নিচের সারিতে কোনো WHERE নেই, প্রতিটা খাতার সামনে নিজের FILTER, তাই প্রতিটা খাতা নিজের ভাগটা পায় আর মোট থাকে 24।">
            <defs>
                <marker id='condagg-gate-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <Lane y={20} title="WHERE status = 'confirmed'" gate="status = 'confirmed'" values={['17', '17', '0', '0']} perCounter={false} />
            <Lane y={140} title='শুধু FILTER, কোনো WHERE নেই' gate='' values={['24', '17', '4', '3']} perCounter />
        </Sketch>
    );
}
