import { Sketch, SketchBox, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Small drawing helpers                                                      */
/* ------------------------------------------------------------------------- */

/** One customer as a small square: the id, and whether the UPDATE touched it. */
function IdCell({ x, y, id, hit, size = 40 }: { x: number; y: number; id: number; hit: boolean; size?: number }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={size}
                height={size}
                fill={hit ? 'var(--primary)' : 'var(--card)'}
                fillOpacity={hit ? 0.16 : 1}
                stroke={hit ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={hit ? 0.9 : 0.3}
                strokeWidth='1'
            />
            <SketchText x={x + size / 2} y={y + size / 2 + 4} size={11} bold={hit} accent={hit}>
                {String(id)}
            </SketchText>
        </g>
    );
}

/** Fifteen customers in a five by three grid, ids 1 to 15, the ones in `hits` coloured. */
function CustomerGrid({ x, y, hits }: { x: number; y: number; hits: number[] }) {
    return (
        <g>
            {Array.from({ length: 15 }, (_, i) => (
                <IdCell key={i} x={x + (i % 5) * 48} y={y + Math.floor(i / 5) * 48} id={i + 1} hit={hits.includes(i + 1)} />
            ))}
        </g>
    );
}

const ALL = Array.from({ length: 15 }, (_, i) => i + 1);

/* ------------------------------------------------------------------------- */
/* 1. রবিবার সকালের ঘটনা, মিনিট ধরে                                               */
/* ------------------------------------------------------------------------- */

const INCIDENT: { time: string; line1: string; line2: string; accent?: boolean }[] = [
    { time: '10:02', line1: 'Arif এর ফোন', line2: 'নতুন নম্বর চাই' },
    { time: '10:04', line1: 'UPDATE চলল', line2: 'উত্তর: UPDATE 15', accent: true },
    { time: '10:30', line1: 'Reminder SMS Job', line2: 'সব বার্তা এক নম্বরে' },
    { time: '11:10', line1: 'Arif আবার ফোন করলেন', line2: 'এত SMS কেন?' },
    { time: '11:15', line1: 'Job বন্ধ, সময় লেখা', line2: 'আগে থামুন, পরে খুঁজুন' },
    { time: '11:50', line1: 'Phone ফেরত এল', line2: 'Backup থেকে, যাচাইসহ', accent: true },
];

/**
 * The incident of the Theory section as a timeline. The UPDATE itself takes a
 * second; everything after it is what one missing line costs.
 */
export function OopsIncidentTimeline() {
    const x0 = 60;
    const step = 128;
    const lineY = 130;
    return (
        <Sketch
            label='এক লাইন বাদ পড়ার দাম, মিনিট ধরে'
            height={260}
            viewBox='0 0 760 260'
            caption={
                <>
                    UPDATE চলতে লাগে এক সেকেন্ডেরও কম। তারপরের প্রায় দুই ঘণ্টা গেছে ভুলটার দাম দিতে: ভুল নম্বরে SMS, একজন বিরক্ত গ্রাহক, থামানো
                    Job, আর Backup থেকে ফেরানো। 10:04 এর উত্তর <code>UPDATE 15</code> নিজেই বলে দিচ্ছিল কী হয়েছে, কেউ পড়েনি।
                </>
            }>
            <line x1={30} y1={lineY} x2={730} y2={lineY} stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.2' />
            {INCIDENT.map((e, i) => {
                const x = x0 + i * step;
                const above = i % 2 === 0;
                const textY = above ? 46 : 172;
                return (
                    <g key={e.time}>
                        <line
                            x1={x}
                            y1={above ? 92 : lineY + 8}
                            x2={x}
                            y2={above ? lineY - 8 : 160}
                            stroke={e.accent ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={e.accent ? 0.9 : 0.35}
                            strokeDasharray='3 3'
                        />
                        <circle
                            cx={x}
                            cy={lineY}
                            r={e.accent ? 7 : 5}
                            fill={e.accent ? 'var(--primary)' : 'var(--card)'}
                            fillOpacity={e.accent ? 0.9 : 1}
                            stroke={e.accent ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={e.accent ? 1 : 0.5}
                        />
                        <SketchText x={x} y={textY} size={11} bold accent={e.accent}>
                            {e.time}
                        </SketchText>
                        <SketchText x={x} y={textY + 18} size={10} body>
                            {e.line1}
                        </SketchText>
                        <SketchText x={x} y={textY + 34} size={9.5} body opacity={0.7}>
                            {e.line2}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={380} y={250} size={9} body opacity={0.6}>
                রবিবার, 1 November 2026, Island Tours অফিস
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. WHERE থাকলে আর না থাকলে                                                   */
/* ------------------------------------------------------------------------- */

/** The same UPDATE with and without its WHERE line, on the fifteen customers. */
export function OopsWhereScopeSplit() {
    return (
        <SketchSplit
            label='WHERE হলো কমান্ডের ঠিকানা'
            caption={
                <>
                    দুই পাশে একই <code>UPDATE customers SET phone = ...</code>। বাঁয়ে WHERE বলে দিচ্ছে ঠিক কোন Row: শুধু customer_id 7। ডানে
                    WHERE নেই, তাই PostgreSQL ধরে নেয় Table এর প্রতিটা Row ই উদ্দেশ্য, আর পনেরোটাই বদলায়। দুই ক্ষেত্রেই কোনো Error নেই,
                    পার্থক্য শুধু শেষের সংখ্যায়।
                </>
            }
            panels={[
                {
                    title: 'WHERE customer_id = 7',
                    sub: '15টার মধ্যে 1টা',
                    viewBox: '0 0 300 220',
                    height: 220,
                    children: (
                        <>
                            <CustomerGrid x={32} y={14} hits={[7]} />
                            <SketchText x={150} y={190} size={12} bold accent>
                                UPDATE 1
                            </SketchText>
                            <SketchText x={150} y={210} size={9.5} body opacity={0.7}>
                                বাকি 14 জনের নম্বর অক্ষত
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'WHERE নেই',
                    sub: '15টার মধ্যে 15টা',
                    viewBox: '0 0 300 220',
                    height: 220,
                    children: (
                        <>
                            <CustomerGrid x={32} y={14} hits={ALL} />
                            <SketchText x={150} y={190} size={12} bold accent>
                                UPDATE 15
                            </SketchText>
                            <SketchText x={150} y={210} size={9.5} body opacity={0.7}>
                                সবার নম্বর এখন একটাই
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Autocommit বনাম আগে BEGIN                                                 */
/* ------------------------------------------------------------------------- */

function Step({ x, y, w = 120, text, accent, dashed }: { x: number; y: number; w?: number; text: string; accent?: boolean; dashed?: boolean }) {
    return <SketchBox x={x} y={y} w={w} h={30} title={text} accent={accent} dashed={dashed} />;
}

function Arrow({ x1, y1, x2, y2, id }: { x1: number; y1: number; x2: number; y2: number; id: string }) {
    return (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' markerEnd={`url(#${id})`} />
    );
}

function ArrowHead({ id }: { id: string }) {
    return (
        <defs>
            <marker id={id} viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                <path d='M0,0 L10,5 L0,10 z' fill='currentColor' fillOpacity={0.6} />
            </marker>
        </defs>
    );
}

/**
 * Left: autocommit, the default of psql, the query box and most tools. Each
 * statement is saved the moment it finishes, so a later ROLLBACK finds nothing
 * to undo. Right: the same work inside BEGIN, with a check before the decision.
 */
export function OopsAutocommitSplit() {
    return (
        <SketchSplit
            label='প্রতিটা Statement নিজেই Save, নাকি আগে BEGIN'
            caption={
                <>
                    বাঁয়ে Autocommit: প্রতিটা Statement নিজের ছোট্ট Transaction এ চলে আর শেষ হওয়ামাত্র COMMIT হয়ে যায়। তাই পরের ROLLBACK
                    এর হাতে ফেরানোর মতো কিছু থাকে না, psql শুধু বলে <code>there is no transaction in progress</code>। ডানে আগে BEGIN: UPDATE
                    এর পরে দেখে নেওয়ার সময় পাওয়া যায়, আর সিদ্ধান্ত আপনার হাতে, COMMIT নাকি ROLLBACK।
                </>
            }
            panels={[
                {
                    title: 'Autocommit (ডিফল্ট)',
                    sub: 'Statement শেষ মানেই Save',
                    viewBox: '0 0 300 250',
                    height: 250,
                    children: (
                        <>
                            <ArrowHead id='oops-ac-arrow' />
                            <Step x={20} y={16} w={150} text='UPDATE ... ;' />
                            <Step x={190} y={16} w={90} text='COMMIT' accent />
                            <Arrow x1={170} y1={31} x2={188} y2={31} id='oops-ac-arrow' />
                            <SketchText x={235} y={64} size={9} body opacity={0.7}>
                                নিজে থেকেই, সাথে সাথে
                            </SketchText>
                            <Step x={20} y={96} w={150} text='ROLLBACK;' dashed />
                            <SketchText x={150} y={152} size={9.5} opacity={0.8}>
                                WARNING: there is no
                            </SketchText>
                            <SketchText x={150} y={166} size={9.5} opacity={0.8}>
                                transaction in progress
                            </SketchText>
                            <SketchText x={150} y={204} size={10.5} body bold accent>
                                বদল থেকে গেল, ফেরার পথ নেই
                            </SketchText>
                            <SketchText x={150} y={226} size={9} body opacity={0.6}>
                                বাকি উপায় শুধু Backup বা আগের Copy
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'আগে BEGIN',
                    sub: 'দেখে নিয়ে তারপর সিদ্ধান্ত',
                    viewBox: '0 0 300 250',
                    height: 250,
                    children: (
                        <>
                            <ArrowHead id='oops-tx-arrow' />
                            <Step x={90} y={10} w={120} text='BEGIN;' accent />
                            <Arrow x1={150} y1={40} x2={150} y2={54} id='oops-tx-arrow' />
                            <Step x={90} y={56} w={120} text='UPDATE ... ;' />
                            <Arrow x1={150} y1={86} x2={150} y2={100} id='oops-tx-arrow' />
                            <Step x={70} y={102} w={160} text='SELECT দিয়ে যাচাই' />
                            <Arrow x1={130} y1={132} x2={80} y2={160} id='oops-tx-arrow' />
                            <Arrow x1={170} y1={132} x2={220} y2={160} id='oops-tx-arrow' />
                            <Step x={20} y={162} w={110} text='COMMIT;' accent />
                            <Step x={170} y={162} w={110} text='ROLLBACK;' />
                            <SketchText x={75} y={214} size={9.5} body opacity={0.75}>
                                সংখ্যা ঠিক থাকলে
                            </SketchText>
                            <SketchText x={225} y={214} size={9.5} body opacity={0.75}>
                                একটুও সন্দেহ হলে
                            </SketchText>
                            <SketchText x={225} y={232} size={9} body opacity={0.6}>
                                কিছুই বদলায়নি
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. GUI তে শুধু দাগানো অংশটুকু চলে                                              */
/* ------------------------------------------------------------------------- */

/**
 * A query editor with three lines, the first two selected. Workbench and pgAdmin
 * run the selection when there is one, so the WHERE on line three never leaves
 * the editor.
 */
export function OopsHighlightDiagram() {
    const lines = [
        { no: '1', text: 'UPDATE customers', selected: true },
        { no: '2', text: "SET phone = '+8801000000199'", selected: true },
        { no: '3', text: 'WHERE customer_id = 7;', selected: false },
    ];
    return (
        <Sketch
            label='যা দাগানো, শুধু সেটুকুই যায়'
            height={250}
            viewBox='0 0 760 250'
            caption={
                <>
                    GUI তে কিছু অংশ দাগানো (Select করা) থাকলে Run বোতাম সাধারণত শুধু সেই অংশটুকুই পাঠায়। MySQL Workbench এর Docs এ এই
                    বোতামের কাজই লেখা আছে এভাবে: Script এর দাগানো অংশ, আর কিছু দাগানো না থাকলে পুরোটা। এখানে প্রথম দুই লাইন দাগানো ছিল,
                    তৃতীয় লাইনের WHERE কখনো Database পর্যন্ত পৌঁছায়নি।
                </>
            }>
            <defs>
                <marker id='oops-hl-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M0,0 L10,5 L0,10 z' fill='var(--primary)' />
                </marker>
            </defs>
            <rect x={20} y={20} width={370} height={190} fill='var(--card)' stroke='currentColor' strokeOpacity={0.4} />
            <rect x={20} y={20} width={370} height={26} fill='currentColor' fillOpacity={0.06} stroke='currentColor' strokeOpacity={0.4} />
            <SketchText x={34} y={37} size={9.5} anchor='start' opacity={0.7}>
                Query Editor
            </SketchText>
            <rect x={312} y={25} width={66} height={16} fill='var(--primary)' fillOpacity={0.15} stroke='var(--primary)' />
            <SketchText x={345} y={37} size={9} accent bold>
                Run ▶
            </SketchText>
            {lines.map((l, i) => {
                const y = 76 + i * 34;
                return (
                    <g key={l.no}>
                        {l.selected && (
                            <rect x={52} y={y - 16} width={330} height={24} fill='var(--primary)' fillOpacity={0.14} />
                        )}
                        <SketchText x={38} y={y} size={10} opacity={0.4}>
                            {l.no}
                        </SketchText>
                        <SketchText x={60} y={y} size={11} anchor='start' opacity={l.selected ? 1 : 0.45}>
                            {l.text}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={205} y={196} size={9.5} body opacity={0.7}>
                কার্সর দিয়ে টানতে গিয়ে তৃতীয় লাইন বাদ পড়েছে
            </SketchText>
            <line x1={398} y1={110} x2={468} y2={110} stroke='var(--primary)' strokeWidth='1.5' markerEnd='url(#oops-hl-arrow)' />
            <SketchText x={433} y={100} size={9} body opacity={0.7}>
                যায় শুধু এটুকু
            </SketchText>
            <SketchBox x={474} y={66} w={266} h={88} title='' accent />
            <SketchText x={607} y={90} size={11} bold accent>
                PostgreSQL
            </SketchText>
            <SketchText x={607} y={116} size={9.5} opacity={0.8}>
                UPDATE customers SET phone = ...
            </SketchText>
            <SketchText x={607} y={136} size={9.5} opacity={0.8}>
                (WHERE নেই)
            </SketchText>
            <SketchText x={607} y={182} size={13} bold accent>
                UPDATE 15
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. ফেরার পথ: কোনটা কত দ্রুত, কী হারায়                                         */
/* ------------------------------------------------------------------------- */

const LADDER: { title: string; how: string; time: string; loss: string; width: number }[] = [
    { title: 'Transaction এখনো খোলা', how: 'ROLLBACK;', time: 'কয়েক সেকেন্ড', loss: 'কিছুই না', width: 90 },
    { title: 'মান অন্য Table থেকে হিসাব করা যায়', how: 'UPDATE ... FROM দিয়ে আবার হিসাব', time: 'কয়েক মিনিট', loss: 'কিছুই না', width: 170 },
    { title: 'আগের Copy বা Audit Table আছে', how: 'UPDATE ... FROM copy', time: 'কয়েক মিনিট', loss: 'কিছুই না', width: 190 },
    { title: 'Point in Time Recovery চালু', how: 'ভুলের এক মিনিট আগে পর্যন্ত, আলাদা Server এ', time: 'এক বা কয়েক ঘণ্টা', loss: 'প্রায় কিছুই না', width: 300 },
    { title: 'শুধু রাতের pg_dump', how: 'আলাদা Database এ Restore, Column টা কপি', time: 'এক বা কয়েক ঘণ্টা', loss: 'রাতের পরের বদল', width: 330 },
];

/** Recovery options from the cheapest to the most expensive, by the time each one takes. */
export function OopsRecoveryLadder() {
    return (
        <Sketch
            label='ফেরার পাঁচ পথ, সস্তা থেকে দামি'
            height={330}
            viewBox='0 0 760 330'
            caption={
                <>
                    উপরের পথ যত পাওয়া যায়, তত ভালো। প্রথমটা শুধু তখনই খোলা যখন আপনি আগে BEGIN দিয়েছিলেন, তিন নম্বরটা তখনই যখন কেউ আগে থেকে
                    Copy রেখেছিল বা Audit Table বানিয়েছিল। নিচের দুটো সবসময় শেষ ভরসা: Backup থেকে আলাদা জায়গায় Restore করে শুধু নষ্ট Column টা
                    ফেরত আনা। দাগের দৈর্ঘ্য মোটামুটি সময়ের আন্দাজ, মাপা সংখ্যা না।
                </>
            }>
            <SketchText x={20} y={22} size={9.5} anchor='start' bold opacity={0.7}>
                অবস্থা
            </SketchText>
            <SketchText x={400} y={22} size={9.5} anchor='start' bold opacity={0.7}>
                সময় লাগে, আর কী হারায়
            </SketchText>
            {LADDER.map((r, i) => {
                const y = 44 + i * 56;
                return (
                    <g key={r.title}>
                        <SketchText x={20} y={y + 12} size={10.5} body anchor='start' bold>
                            {`${i + 1}. ${r.title}`}
                        </SketchText>
                        <SketchText x={36} y={y + 30} size={9.5} anchor='start' opacity={0.7}>
                            {r.how}
                        </SketchText>
                        <rect
                            x={400}
                            y={y}
                            width={r.width}
                            height={18}
                            fill='var(--primary)'
                            fillOpacity={0.08 + i * 0.05}
                            stroke='var(--primary)'
                            strokeOpacity={0.7}
                        />
                        <SketchText x={406} y={y + 13} size={9.5} body anchor='start'>
                            {r.time}
                        </SketchText>
                        <SketchText x={406} y={y + 34} size={9} body anchor='start' opacity={0.7}>
                            {`হারায়: ${r.loss}`}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 6. Module 10 এক ছবিতে: একটা Booking এর জীবন                                     */
/* ------------------------------------------------------------------------- */

const LIFE: { lesson: string; verb: string; line: string }[] = [
    { lesson: 'Lesson 01', verb: 'INSERT', line: 'Booking এর জন্ম, RETURNING এ নতুন id' },
    { lesson: 'Lesson 02', verb: 'UPDATE', line: 'pending থেকে confirmed' },
    { lesson: 'Lesson 03', verb: 'DELETE', line: 'সরানো, অথবা deleted_at দিয়ে লুকানো' },
    { lesson: 'Lesson 04', verb: 'ON CONFLICT', line: 'থাকলে বদল, না থাকলে নতুন Row' },
    { lesson: 'Lesson 05', verb: 'COPY', line: 'হাজার Row একসাথে, CSV থেকে' },
    { lesson: 'Lesson 06', verb: 'IDENTITY', line: 'নম্বর আসে Sequence থেকে, ফাঁকসহ' },
    { lesson: 'Lesson 07', verb: 'BEGIN', line: 'বদলের আগে দেখা, ভুলের পরে ফেরা' },
];

/** The seven lessons of Module 10 as moments in the life of one booking row. */
export function ModuleTenStoryDiagram() {
    return (
        <Sketch
            label='Module 10: একটা Row এর পুরো জীবন'
            height={300}
            viewBox='0 0 760 300'
            caption={
                <>
                    Module 09 এ আপনি ঘর বানিয়েছিলেন, Module 10 এ সেই ঘরে মানুষ ঢুকল, থাকল, বদলাল, চলে গেল। প্রতিটা লেসন একটা Booking এর জীবনের
                    একটা মুহূর্ত, আর শেষ লেসনটা সবগুলোর উপর পাহারা: যেকোনো বদলের আগে দেখে নেওয়া, আর ভুল হলে ফেরার রাস্তা জানা।
                </>
            }>
            <defs>
                <marker id='oops-life-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M0,0 L10,5 L0,10 z' fill='currentColor' fillOpacity={0.6} />
                </marker>
            </defs>
            {LIFE.map((s, i) => {
                const row = i < 4 ? 0 : 1;
                const col = row === 0 ? i : i - 4;
                const x = row === 0 ? 20 + col * 185 : 112 + col * 185;
                const y = row === 0 ? 30 : 166;
                const last = i === LIFE.length - 1;
                return (
                    <g key={s.lesson}>
                        <SketchBox x={x} y={y} w={165} h={58} title={s.verb} sub={s.lesson} accent={last} />
                        <SketchText x={x + 82} y={y + 80} size={9.5} body opacity={0.75}>
                            {s.line}
                        </SketchText>
                        {row === 0 && col < 3 && (
                            <line
                                x1={x + 167}
                                y1={y + 29}
                                x2={x + 183}
                                y2={y + 29}
                                stroke='currentColor'
                                strokeOpacity={0.5}
                                markerEnd='url(#oops-life-arrow)'
                            />
                        )}
                        {row === 1 && col < 2 && (
                            <line
                                x1={x + 167}
                                y1={y + 29}
                                x2={x + 183}
                                y2={y + 29}
                                stroke='currentColor'
                                strokeOpacity={0.5}
                                markerEnd='url(#oops-life-arrow)'
                            />
                        )}
                    </g>
                );
            })}
            <path
                d='M 657 118 C 657 140, 194 136, 194 162'
                fill='none'
                stroke='currentColor'
                strokeOpacity={0.4}
                strokeDasharray='4 4'
                markerEnd='url(#oops-life-arrow)'
            />
            <SketchText x={380} y={286} size={9} body opacity={0.6}>
                শেষ বাক্স রঙিন, কারণ বাকি ছয়টার প্রতিটা বদল এই লেসনের অভ্যাস দিয়েই নিরাপদে চালাতে হয়
            </SketchText>
        </Sketch>
    );
}
