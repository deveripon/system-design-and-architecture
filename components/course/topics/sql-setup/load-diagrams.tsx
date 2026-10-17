import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. ফাইল থেকে Database পর্যন্ত: কে কী পড়ে                                    */
/* ------------------------------------------------------------------------- */

const TABLES = [
    'destinations',
    'guides',
    'tours',
    'customers',
    'departures',
    'bookings',
    'payments',
    'reviews',
];

export function LoadPathDiagram() {
    return (
        <Sketch
            label='Load Path: File থেকে Table পর্যন্ত'
            height={320}
            minWidth={880}
            viewBox='0 0 880 320'
            caption={
                <>
                    ফাইলটা পড়ে psql, আপনার নিজের কম্পিউটারে বসে। তারপর ফাইলের প্রতিটা
                    Statement একটা একটা করে Port 5432 দিয়ে Server এর কাছে পাঠায়। Server
                    কখনো ফাইলের পথ দেখে না, দেখে শুধু SQL লেখাগুলো। তাই ফাইল খুঁজে না
                    পাওয়ার Error সবসময় শুরু হয় <code>psql: error:</code> দিয়ে, আর
                    Table বা Data এর Error আসে Server থেকে, <code>ERROR:</code> দিয়ে।
                </>
            }>
            <defs>
                <marker
                    id='load-path-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* Your computer */}
            <rect x={20} y={30} width={360} height={260} fill='transparent' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.2' strokeDasharray='5 4' />
            <SketchText x={200} y={52} size={11} bold>
                আপনার কম্পিউটার
            </SketchText>

            {/* The file */}
            <path d='M 50 90 H 160 L 180 110 V 230 H 50 Z' fill='var(--primary)' fillOpacity={0.06} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            <path d='M 160 90 V 110 H 180' fill='none' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            <SketchText x={115} y={130} size={10} bold accent>
                island-tours.sql
            </SketchText>
            {['DROP TABLE ...', 'CREATE TABLE ...', 'CREATE TABLE ...', 'INSERT INTO ...', 'INSERT INTO ...'].map((line, i) => (
                <SketchText key={i} x={62} y={152 + i * 16} size={9} anchor='start' opacity={0.7}>
                    {line}
                </SketchText>
            ))}
            <SketchText x={115} y={252} size={9.5} body opacity={0.8}>
                Downloads ফোল্ডারে
            </SketchText>

            {/* psql */}
            <rect x={240} y={130} width={110} height={60} fill='transparent' stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={295} y={157} size={12} bold accent>
                psql
            </SketchText>
            <SketchText x={295} y={177} size={9.5} body>
                ফাইল পড়ে
            </SketchText>
            <line x1={184} y1={160} x2={236} y2={160} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#load-path-arrow)' />
            <SketchText x={210} y={150} size={9} body opacity={0.8}>
                -f
            </SketchText>

            {/* Wire */}
            <line x1={354} y1={160} x2={496} y2={160} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#load-path-arrow)' />
            <SketchText x={425} y={146} size={9.5} body>
                একটা একটা Statement
            </SketchText>
            <SketchText x={425} y={180} size={9} opacity={0.7}>
                Port 5432
            </SketchText>

            {/* Server */}
            <rect x={500} y={30} width={360} height={260} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={680} y={52} size={11} bold>
                PostgreSQL Server
            </SketchText>
            <rect x={525} y={70} width={310} height={200} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={680} y={92} size={11} bold accent>
                island_tours
            </SketchText>
            {TABLES.map((table, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const x = 545 + col * 148;
                const y = 108 + row * 38;
                return (
                    <g key={table}>
                        <rect x={x} y={y} width={126} height={28} fill='var(--card)' stroke='currentColor' strokeOpacity={0.4} strokeWidth='1' />
                        <SketchText x={x + 63} y={y + 18} size={9.5}>
                            {table}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. ফাইলের ভেতরে কী আছে, কোন ক্রমে                                          */
/* ------------------------------------------------------------------------- */

const PARTS = [
    { title: 'মন্তব্য', sub: '-- দিয়ে শুরু, Server উপেক্ষা করে', h: 44 },
    { title: 'DROP TABLE IF EXISTS ... CASCADE', sub: 'আগের সব Table মুছে ফেলে, একটাই Statement', h: 52 },
    { title: 'CREATE TABLE × ৮', sub: 'খালি Table, Column আর নিয়মসহ', h: 70 },
    { title: 'INSERT INTO × ৮', sub: 'প্রতিটা Table এ Row, একবারে অনেকগুলো', h: 70 },
];

/** Where each part of the file starts, stacked top to bottom with a small gap. */
const PART_TOPS = PARTS.reduce<number[]>(
    (tops, part, i) => [...tops, i === 0 ? 40 : tops[i - 1] + PARTS[i - 1].h + 14],
    []
);

const ORDER = [
    { table: 'destinations', needs: '' },
    { table: 'guides', needs: '' },
    { table: 'tours', needs: 'destinations, guides' },
    { table: 'customers', needs: '' },
    { table: 'departures', needs: 'tours' },
    { table: 'bookings', needs: 'customers, departures' },
    { table: 'payments', needs: 'bookings' },
    { table: 'reviews', needs: 'bookings' },
];

export function FileAnatomyDiagram() {
    return (
        <Sketch
            label='Inside island-tours.sql'
            height={380}
            minWidth={860}
            viewBox='0 0 860 380'
            caption='বামে ফাইলের চারটা অংশ, উপর থেকে নিচে যে ক্রমে চলে। ডানে Table গুলো যে ক্রমে তৈরি হয়। যে Table অন্য কোনো Table কে দেখায়, তার আগে সেই অন্য Table টা থাকতেই হবে, নইলে Foreign Key কাকে দেখাবে? তাই tours আসে destinations আর guides এর পরে, আর bookings আসে customers আর departures এর পরে।'>
            <SketchText x={190} y={24} size={10} bold>
                ফাইল, উপর থেকে নিচে
            </SketchText>
            {PARTS.map((part, i) => {
                const top = PART_TOPS[i];
                return (
                    <g key={part.title}>
                        <rect x={30} y={top} width={320} height={part.h} fill={i >= 1 ? 'var(--primary)' : 'transparent'} fillOpacity={i >= 1 ? 0.06 : 0} stroke={i >= 1 ? 'var(--primary)' : 'currentColor'} strokeOpacity={i >= 1 ? 1 : 0.4} strokeWidth='1.2' />
                        <SketchText x={190} y={top + part.h / 2 - 4} size={10.5} bold accent={i >= 1}>
                            {part.title}
                        </SketchText>
                        <SketchText x={190} y={top + part.h / 2 + 14} size={9.5} body opacity={0.8}>
                            {part.sub}
                        </SketchText>
                    </g>
                );
            })}

            <SketchText x={620} y={24} size={10} bold>
                Table তৈরির ক্রম
            </SketchText>
            {ORDER.map((item, i) => {
                const rowY = 40 + i * 40;
                return (
                    <g key={item.table}>
                        <rect x={430} y={rowY} width={30} height={28} fill='var(--primary)' fillOpacity={0.12} stroke='var(--primary)' strokeWidth='1' />
                        <SketchText x={445} y={rowY + 18} size={10} bold accent>
                            {String(i + 1)}
                        </SketchText>
                        <rect x={470} y={rowY} width={140} height={28} fill='var(--card)' stroke='currentColor' strokeOpacity={0.4} strokeWidth='1' />
                        <SketchText x={540} y={rowY + 18} size={10}>
                            {item.table}
                        </SketchText>
                        <SketchText x={626} y={rowY + 18} size={9.5} anchor='start' body opacity={item.needs ? 0.9 : 0.5}>
                            {item.needs ? `আগে লাগবে: ${item.needs}` : 'কাউকে দেখায় না'}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Docker: ফাইল এক জায়গায়, psql আরেক জায়গায়                              */
/* ------------------------------------------------------------------------- */

function Machine({ x, y, w, h, title }: { x: number; y: number; w: number; h: number; title: string }) {
    return (
        <g>
            <rect x={x} y={y} width={w} height={h} fill='transparent' stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.2' />
            <SketchText x={x + w / 2} y={y + 18} size={10} bold>
                {title}
            </SketchText>
        </g>
    );
}

export function HostVsContainerSplit() {
    return (
        <SketchSplit
            label='Docker: দুটো আলাদা File System'
            caption={
                <>
                    Container এর ভেতরের psql শুধু Container এর নিজের ফাইলগুলো দেখে।
                    আপনার Downloads ফোল্ডার তার কাছে অচেনা। তাই হয় ফাইলটা আগে Container
                    এর ভেতরে কপি করুন (<code>docker cp</code>), নয়তো আপনার Shell কে দিয়ে
                    ফাইলটা পড়িয়ে psql এর কাছে পাঠান (<code>&lt;</code> চিহ্ন দিয়ে)।
                </>
            }
            panels={[
                {
                    title: 'যা কাজ করে না',
                    sub: 'psql -f /Users/.../island-tours.sql',
                    viewBox: '0 0 380 230',
                    height: 230,
                    minWidth: 320,
                    children: (
                        <g>
                            <Machine x={10} y={10} w={160} h={200} title='আপনার Mac বা PC' />
                            <rect x={30} y={60} width={120} height={36} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeWidth='1' />
                            <SketchText x={90} y={83} size={9.5} accent>
                                island-tours.sql
                            </SketchText>
                            <Machine x={210} y={10} w={160} h={200} title='Container island-pg' />
                            <rect x={240} y={60} width={100} height={36} fill='transparent' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1' />
                            <SketchText x={290} y={83} size={10} bold>
                                psql
                            </SketchText>
                            <SketchText x={290} y={130} size={9.5} body>
                                ফাইলটা কোথায়?
                            </SketchText>
                            <SketchText x={290} y={150} size={9} opacity={0.8}>
                                No such file
                            </SketchText>
                            <line x1={176} y1={78} x2={204} y2={78} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' strokeDasharray='3 3' />
                            <SketchText x={190} y={104} size={14} bold>
                                ×
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'যা কাজ করে',
                    sub: 'docker cp, অথবা < দিয়ে পাঠানো',
                    viewBox: '0 0 380 230',
                    height: 230,
                    minWidth: 320,
                    children: (
                        <g>
                            <defs>
                                <marker
                                    id='load-container-arrow'
                                    markerWidth={8}
                                    markerHeight={8}
                                    refX={7}
                                    refY={3.5}
                                    orient='auto'
                                    markerUnits='userSpaceOnUse'>
                                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                                </marker>
                            </defs>
                            <Machine x={10} y={10} w={160} h={200} title='আপনার Mac বা PC' />
                            <rect x={30} y={60} width={120} height={36} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeWidth='1' />
                            <SketchText x={90} y={83} size={9.5} accent>
                                island-tours.sql
                            </SketchText>
                            <Machine x={210} y={10} w={160} h={200} title='Container island-pg' />
                            <rect x={230} y={60} width={120} height={36} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeWidth='1' />
                            <SketchText x={290} y={83} size={9.5} accent>
                                /tmp/island-tours.sql
                            </SketchText>
                            <line x1={152} y1={78} x2={226} y2={78} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#load-container-arrow)' />
                            <SketchText x={190} y={70} size={9} accent>
                                docker cp
                            </SketchText>
                            <rect x={240} y={140} width={100} height={36} fill='transparent' stroke='var(--primary)' strokeWidth='1.2' />
                            <SketchText x={290} y={163} size={10} bold accent>
                                psql
                            </SketchText>
                            <line x1={152} y1={158} x2={236} y2={158} stroke='var(--primary)' strokeWidth='1.3' strokeDasharray='5 3' markerEnd='url(#load-container-arrow)' />
                            <SketchText x={190} y={150} size={9} accent>
                                অথবা &lt; file
                            </SketchText>
                            <line x1={290} y1={100} x2={290} y2={136} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#load-container-arrow)' />
                        </g>
                    ),
                },
            ]}
        />
    );
}
