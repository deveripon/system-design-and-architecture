import { Sketch, SketchSplit, SketchText } from '../../sketch';
import { TOUR_GUIDE_IDS, TOURS } from './anyall-data';

/* ------------------------------------------------------------------------- */
/* 1. ভেতরের Query একটা তালিকা বানায়, বাইরের Query তালিকা দেখে ছাঁকে           */
/* ------------------------------------------------------------------------- */

/** customer_id of every confirmed booking, in the order the inner query returns them. */
const CONFIRMED_IDS = [1, 1, 2, 2, 3, 3, 4, 4, 6, 7, 8, 8, 9, 10, 11, 13, 14];

const CUSTOMERS: { id: number; name: string }[] = [
    { id: 1, name: 'Rahim Uddin' },
    { id: 2, name: 'Nusrat Jahan' },
    { id: 3, name: 'Tanvir Ahmed' },
    { id: 4, name: 'Farhana Akter' },
    { id: 5, name: 'Sabbir Hossain' },
    { id: 6, name: 'Mitu Rahman' },
    { id: 7, name: 'Arif Chowdhury' },
    { id: 8, name: 'Sumaiya Islam' },
    { id: 9, name: 'Priya Sharma' },
    { id: 10, name: 'Aiman Zulkifli' },
    { id: 11, name: 'Oliver Bennett' },
    { id: 12, name: 'Kamal Hasan' },
    { id: 13, name: 'Shuvo Das' },
    { id: 14, name: 'Lamia Haque' },
    { id: 15, name: 'Imran Kabir' },
];

/**
 * The inner query runs once and hands back 17 customer ids with repeats; IN
 * treats them as a set of 12; each of the 15 customers is kept when their id
 * is in it, once, however many times it repeats.
 */
export function ListMachineDiagram() {
    const set = [...new Set(CONFIRMED_IDS)];
    return (
        <Sketch
            label='IN (Subquery): ভেতরে তালিকা, বাইরে ছাঁকনি'
            height={420}
            minWidth={900}
            viewBox='0 0 900 420'
            caption='ভেতরের Query একবারই চলে আর ১৭টা customer_id দেয়, কয়েকটা দুইবার করে। IN এর কাছে তালিকাটা একটা সেট: কোন নম্বর আছে, শুধু সেটুকু জরুরি, কতবার আছে সেটা না। তাই ১২টা আলাদা নম্বর। তারপর customers এর ১৫ জনের প্রত্যেকের customer_id এই সেটে খোঁজা হয়। পেলে রাখা, না পেলে বাদ। Rahim এর তিনটা confirmed Booking থাকলেও তিনি ফলাফলে একবারই আসেন।'>
            <defs>
                <marker
                    id='anyall-list-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* Step 1: the inner query and its raw output */}
            <SketchText x={20} y={28} size={10} anchor='start' bold accent>
                ১. ভেতরের Query, একবার
            </SketchText>
            <rect x={20} y={40} width={250} height={54} fill='transparent' stroke='currentColor' strokeOpacity={0.45} />
            <SketchText x={30} y={60} size={9.5} anchor='start'>
                SELECT customer_id FROM bookings
            </SketchText>
            <SketchText x={30} y={80} size={9.5} anchor='start'>
                WHERE status = &apos;confirmed&apos;
            </SketchText>
            <SketchText x={20} y={122} size={9} anchor='start' opacity={0.7}>
                ফলাফল: ১৭টা নম্বর
            </SketchText>
            {CONFIRMED_IDS.map((id, i) => {
                const col = i % 6;
                const row = Math.floor(i / 6);
                const x = 20 + col * 42;
                const y = 134 + row * 30;
                const repeat = CONFIRMED_IDS.indexOf(id) !== i;
                return (
                    <g key={`raw-${i}`}>
                        <rect
                            x={x}
                            y={y}
                            width={36}
                            height={22}
                            fill={repeat ? 'transparent' : 'var(--primary)'}
                            fillOpacity={repeat ? 0 : 0.1}
                            stroke='currentColor'
                            strokeOpacity={repeat ? 0.25 : 0.5}
                            strokeDasharray={repeat ? '3 3' : undefined}
                        />
                        <SketchText x={x + 18} y={y + 15} size={9.5} opacity={repeat ? 0.5 : 1}>
                            {id}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={20} y={248} size={8.5} anchor='start' opacity={0.6}>
                ডটেড বাক্স: আগে একবার এসেছে, আবার এল
            </SketchText>

            <line
                x1={285}
                y1={180}
                x2={335}
                y2={180}
                stroke='var(--primary)'
                strokeWidth='1.4'
                markerEnd='url(#anyall-list-arrow)'
            />

            {/* Step 2: the set */}
            <SketchText x={345} y={28} size={10} anchor='start' bold accent>
                ২. IN এর চোখে একটা সেট
            </SketchText>
            <rect x={345} y={40} width={210} height={150} fill='var(--primary)' fillOpacity={0.05} stroke='var(--primary)' strokeOpacity={0.6} />
            {set.map((id, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                return (
                    <SketchText key={`set-${id}`} x={375 + col * 50} y={75 + row * 40} size={12} bold accent>
                        {id}
                    </SketchText>
                );
            })}
            <SketchText x={450} y={214} size={9} opacity={0.75}>
                ১২টা আলাদা customer_id
            </SketchText>

            <line
                x1={565}
                y1={180}
                x2={615}
                y2={180}
                stroke='var(--primary)'
                strokeWidth='1.4'
                markerEnd='url(#anyall-list-arrow)'
            />

            {/* Step 3: the outer query checks each customer */}
            <SketchText x={625} y={28} size={10} anchor='start' bold accent>
                ৩. প্রতিটা Customer: আছে কি?
            </SketchText>
            {CUSTOMERS.map((c, i) => {
                const kept = set.includes(c.id);
                const y = 44 + i * 24;
                return (
                    <g key={`cust-${c.id}`}>
                        <rect
                            x={625}
                            y={y}
                            width={260}
                            height={20}
                            fill={kept ? 'var(--primary)' : 'transparent'}
                            fillOpacity={kept ? 0.08 : 0}
                            stroke='currentColor'
                            strokeOpacity={kept ? 0.45 : 0.2}
                        />
                        <SketchText x={635} y={y + 14} size={9} anchor='start' opacity={kept ? 1 : 0.5}>
                            {`${c.id}  ${c.name}`}
                        </SketchText>
                        <SketchText x={875} y={y + 14} size={9} anchor='end' bold accent={kept} opacity={kept ? 1 : 0.5}>
                            {kept ? 'রাখা' : 'বাদ'}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. NOT IN খুলে লিখলে: AND এর লম্বা শিকল                                    */
/* ------------------------------------------------------------------------- */

function verdictText(v: boolean | null) {
    if (v === null) return 'NULL';
    return v ? 'TRUE' : 'FALSE';
}

/**
 * `guide_id NOT IN (list)` written out as `guide_id <> v1 AND guide_id <> v2 ...`
 * for two real guides. Jamal is stopped by a FALSE; Nazmul passes every real
 * number but meets the NULL from Ratargul, and AND with UNKNOWN stays UNKNOWN.
 */
export function NotInUnrollDiagram() {
    const rows = [
        { id: 1, name: 'Jamal Hossain (guide 1)' },
        { id: 5, name: 'Nazmul Karim (guide 5)' },
    ];
    const cellW = 76;
    return (
        <Sketch
            label='NOT IN খুলে লেখা: প্রতিটা মানের সাথে একটা <>, মাঝে AND'
            height={330}
            minWidth={900}
            viewBox='0 0 900 330'
            caption='tours এর guide_id তালিকায় নয়টা মান, তার একটা Ratargul এর NULL। NOT IN আসলে প্রতিটার সাথে একটা <> তুলনা, সবগুলো AND দিয়ে জোড়া। Jamal এর বেলায় প্রথম তুলনাই FALSE, তাই পুরোটা FALSE, বাদ, যেটা ঠিকই আছে কারণ তাঁর ট্যুর আছে। Nazmul এর বেলায় আটটা আসল নম্বরের সাথে তুলনা TRUE, কিন্তু NULL এর সাথে তুলনা অজানা। TRUE AND অজানা মানে অজানা, আর WHERE শুধু TRUE রাখে। তাই যাঁর সত্যিই কোনো ট্যুর নেই, তিনিও বাদ।'>
            <SketchText x={20} y={30} size={10} anchor='start' bold opacity={0.8}>
                তালিকা (SELECT guide_id FROM tours):
            </SketchText>
            {TOUR_GUIDE_IDS.map((v, i) => (
                <g key={`list-${i}`}>
                    <rect
                        x={250 + i * 66}
                        y={14}
                        width={56}
                        height={24}
                        fill={v === null ? 'var(--primary)' : 'transparent'}
                        fillOpacity={v === null ? 0.15 : 0}
                        stroke={v === null ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={v === null ? 1 : 0.4}
                    />
                    <SketchText x={278 + i * 66} y={30} size={10} bold={v === null} accent={v === null}>
                        {v === null ? 'NULL' : String(v)}
                    </SketchText>
                </g>
            ))}

            {rows.map((row, r) => {
                const y0 = 90 + r * 120;
                const results = TOUR_GUIDE_IDS.map(v => (v === null ? null : row.id !== v));
                const overall = results.some(x => x === false) ? false : results.some(x => x === null) ? null : true;
                return (
                    <g key={`row-${row.id}`}>
                        <SketchText x={20} y={y0} size={10.5} anchor='start' bold accent>
                            {row.name}
                        </SketchText>
                        {results.map((res, i) => {
                            const x = 20 + i * (cellW + 14);
                            const v = TOUR_GUIDE_IDS[i];
                            return (
                                <g key={`cell-${row.id}-${i}`}>
                                    <rect
                                        x={x}
                                        y={y0 + 12}
                                        width={cellW}
                                        height={44}
                                        fill={res === true ? 'transparent' : 'var(--primary)'}
                                        fillOpacity={res === true ? 0 : 0.12}
                                        stroke={res === true ? 'currentColor' : 'var(--primary)'}
                                        strokeOpacity={res === true ? 0.35 : 0.9}
                                    />
                                    <SketchText x={x + cellW / 2} y={y0 + 30} size={9}>
                                        {`${row.id} <> ${v === null ? 'NULL' : v}`}
                                    </SketchText>
                                    <SketchText x={x + cellW / 2} y={y0 + 48} size={9} bold accent={res !== true}>
                                        {verdictText(res)}
                                    </SketchText>
                                    {i < results.length - 1 && (
                                        <SketchText x={x + cellW + 7} y={y0 + 38} size={7.5} opacity={0.6}>
                                            AND
                                        </SketchText>
                                    )}
                                </g>
                            );
                        })}
                        <SketchText x={20} y={y0 + 82} size={10} anchor='start' bold accent>
                            {`ফলাফল: ${verdictText(overall)}  →  ${overall === true ? 'রাখা' : 'বাদ'}`}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. ANY আর ALL একটা সংখ্যারেখায়                                             */
/* ------------------------------------------------------------------------- */

/**
 * The nine real tour prices on a line, with the two Sylhet prices marked.
 * `> ANY` clears the lowest Sylhet price (3500), `> ALL` must clear the
 * highest (7800).
 */
export function AnyAllNumberLine() {
    const x0 = 60;
    const x1 = 860;
    const max = 34000;
    const px = (v: number) => x0 + ((x1 - x0) * v) / max;
    const sylhet = [3500, 7800];
    const anyCount = TOURS.filter(t => t.price > Math.min(...sylhet)).length;
    const allCount = TOURS.filter(t => t.price > Math.max(...sylhet)).length;
    return (
        <Sketch
            label='> ANY আর > ALL: Sylhet এর দুই দামের সাথে তুলনা'
            height={300}
            minWidth={900}
            viewBox='0 0 900 300'
            caption={`Sylhet এর দুটো ট্যুরের দাম 3500 আর 7800। > ANY মানে অন্তত একটার চেয়ে বেশি, তাই আসলে সবচেয়ে ছোটটা, 3500, পার হলেই যথেষ্ট: ${anyCount}টা ট্যুর। > ALL মানে প্রতিটার চেয়ে বেশি, তাই সবচেয়ে বড়টা, 7800, পার হতে হবে: ${allCount}টা ট্যুর। Sylhet Tea Garden Tour নিজে 7800, সে 3500 এর চেয়ে বেশি কিন্তু 7800 এর চেয়ে বেশি না, তাই প্রথম দলে আছে, দ্বিতীয়তে নেই।`}>
            {/* bands */}
            <rect x={px(3500)} y={40} width={x1 - px(3500)} height={30} fill='var(--primary)' fillOpacity={0.08} />
            <SketchText x={px(3500) + 8} y={60} size={9.5} anchor='start' bold accent>
                {`> ANY (Sylhet): 3500 এর বেশি, ${anyCount}টা ট্যুর`}
            </SketchText>
            <rect x={px(7800)} y={80} width={x1 - px(7800)} height={30} fill='var(--primary)' fillOpacity={0.16} />
            <SketchText x={px(7800) + 8} y={100} size={9.5} anchor='start' bold accent>
                {`> ALL (Sylhet): 7800 এর বেশি, ${allCount}টা ট্যুর`}
            </SketchText>

            {/* axis */}
            <line x1={x0} y1={160} x2={x1} y2={160} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            {[0, 10000, 20000, 30000].map(v => (
                <g key={`tick-${v}`}>
                    <line x1={px(v)} y1={155} x2={px(v)} y2={165} stroke='currentColor' strokeOpacity={0.4} />
                    <SketchText x={px(v)} y={182} size={8.5} opacity={0.6}>
                        {String(v)}
                    </SketchText>
                </g>
            ))}

            {/* Sylhet markers */}
            {sylhet.map(v => (
                <g key={`syl-${v}`}>
                    <line x1={px(v)} y1={36} x2={px(v)} y2={160} stroke='var(--primary)' strokeDasharray='4 3' strokeWidth='1.2' />
                    <rect x={px(v) - 6} y={154} width={12} height={12} fill='var(--primary)' />
                </g>
            ))}

            {/* tours */}
            {TOURS.map((t, i) => {
                const y = 210 + (i % 3) * 26;
                const above = t.price > 7800;
                const mid = t.price > 3500 && !above;
                return (
                    <g key={`tour-${t.id}`}>
                        <line x1={px(t.price)} y1={164} x2={px(t.price)} y2={y - 10} stroke='currentColor' strokeOpacity={0.25} />
                        <circle cx={px(t.price)} cy={160} r={4} fill={above || mid ? 'var(--primary)' : 'currentColor'} fillOpacity={above ? 1 : mid ? 0.6 : 0.35} />
                        <SketchText x={px(t.price)} y={y} size={8.5} opacity={above ? 1 : 0.7} bold={above}>
                            {`${t.id}: ${t.price}`}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. খালি তালিকা: ALL বলে সত্য, MAX বলে অজানা                               */
/* ------------------------------------------------------------------------- */

function EmptyAllPanel() {
    return (
        <g>
            <SketchText x={170} y={22} size={10} bold>
                price_bdt &gt; ALL (Kuakata এর দাম)
            </SketchText>
            <rect x={110} y={40} width={120} height={46} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeDasharray='4 3' />
            <SketchText x={170} y={68} size={12} bold opacity={0.7}>
                {'{ }'}
            </SketchText>
            <SketchText x={170} y={110} size={9.5} body>
                তুলনা করার মতো একটাও দাম নেই
            </SketchText>
            <SketchText x={170} y={130} size={9.5} body>
                তাই আপত্তিও নেই
            </SketchText>
            <SketchText x={170} y={166} size={13} bold accent>
                TRUE
            </SketchText>
            <SketchText x={170} y={200} size={10} bold accent>
                ৯টা ট্যুরের ৯টাই আসে
            </SketchText>
        </g>
    );
}

function EmptyMaxPanel() {
    return (
        <g>
            <SketchText x={170} y={22} size={10} bold>
                price_bdt &gt; (SELECT max(...) Kuakata)
            </SketchText>
            <rect x={110} y={40} width={120} height={46} fill='var(--primary)' fillOpacity={0.12} stroke='var(--primary)' />
            <SketchText x={170} y={68} size={12} bold accent>
                max = NULL
            </SketchText>
            <SketchText x={170} y={110} size={9.5} body>
                খালি তালিকার max বলে কিছু নেই
            </SketchText>
            <SketchText x={170} y={130} size={9.5} body>
                12500 &gt; NULL কী, কেউ জানে না
            </SketchText>
            <SketchText x={170} y={166} size={13} bold accent>
                NULL
            </SketchText>
            <SketchText x={170} y={200} size={10} bold accent>
                একটা ট্যুরও আসে না
            </SketchText>
        </g>
    );
}

/**
 * The same question against an empty list, two ways that look equivalent: ALL
 * over no rows is TRUE and keeps all nine tours, MAX over no rows is NULL and
 * keeps none.
 */
export function EmptyListSplit() {
    return (
        <SketchSplit
            label='Kuakata তে কোনো ট্যুর নেই: দুই লেখা, দুই উল্টো উত্তর'
            caption='দুটো Query দেখতে একই প্রশ্ন: Kuakata এর সব ট্যুরের চেয়ে দামি কোনগুলো। Kuakata তে একটাও ট্যুর নেই। ALL এর নিয়ম: যার সাথে তুলনা নেই, তার বিরুদ্ধে কোনো FALSE ও নেই, তাই TRUE, আর ৯টা ট্যুরই আসে। MAX এর নিয়ম: খালি তালিকার সবচেয়ে বড় মান NULL, আর NULL এর সাথে তুলনা অজানা, তাই একটাও আসে না। তালিকা খালি না হলে দুটো একই উত্তর দেয়, তাই এই পার্থক্য প্রায়ই ধরা পড়ে না।'
            panels={[
                { title: '> ALL', sub: 'খালি তালিকা মানে TRUE', viewBox: '0 0 340 220', height: 220, minWidth: 320, children: <EmptyAllPanel /> },
                { title: '> (SELECT max)', sub: 'খালি তালিকা মানে NULL', viewBox: '0 0 340 220', height: 220, minWidth: 320, children: <EmptyMaxPanel /> },
            ]}
        />
    );
}
