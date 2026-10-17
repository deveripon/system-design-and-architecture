import { Sketch, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Shared bits                                                               */
/* ------------------------------------------------------------------------- */

function Arrow({ id, muted }: { id: string; muted?: boolean }) {
    return (
        <defs>
            <marker
                id={id}
                markerWidth={8}
                markerHeight={8}
                refX={7}
                refY={3.5}
                orient='auto'
                markerUnits='userSpaceOnUse'>
                <path
                    d='M0,0 L7,3.5 L0,7 Z'
                    fill={muted ? 'currentColor' : 'var(--primary)'}
                    fillOpacity={muted ? 0.55 : 1}
                />
            </marker>
        </defs>
    );
}

function Box({
    x,
    y,
    w,
    h,
    accent,
    dashed,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    accent?: boolean;
    dashed?: boolean;
}) {
    return (
        <rect
            x={x}
            y={y}
            width={w}
            height={h}
            fill={accent ? 'var(--primary)' : 'currentColor'}
            fillOpacity={accent ? 0.1 : 0.04}
            stroke={accent ? 'var(--primary)' : 'currentColor'}
            strokeOpacity={accent ? 1 : 0.45}
            strokeWidth='1.2'
            strokeDasharray={dashed ? '4 3' : undefined}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 1. GUI আরেকটা Client মাত্র                                                  */
/* ------------------------------------------------------------------------- */

const CLIENTS = [
    { name: 'psql', sub: 'Terminal এ লেখা' },
    { name: 'pgAdmin 4', sub: 'জানালা আর মাউস' },
    { name: 'DBeaver', sub: 'জানালা আর মাউস' },
    { name: 'TablePlus', sub: 'জানালা আর মাউস' },
    { name: 'Island Tours API', sub: 'Code থেকে' },
];

export function GuiIsAClientDiagram() {
    const rowH = 62;
    const top = 30;
    return (
        <Sketch
            label='Every Client Knocks on the Same Door'
            height={360}
            minWidth={880}
            viewBox='0 0 900 360'
            caption='psql, pgAdmin, DBeaver, TablePlus আর Island Tours এর নিজের API, সবাই একই কাজ করে: Port 5432 এ একটা TCP Connection খোলে, Login করে, SQL পাঠায় আর Row ফেরত পায়। GUI কোনো আলাদা Database না, Server এর সামনে একটা আরামদায়ক জানালা মাত্র।'>
            <Arrow id='gui-client-arrow' />
            {CLIENTS.map((client, i) => {
                const y = top + i * rowH;
                const isApp = i === CLIENTS.length - 1;
                return (
                    <g key={client.name}>
                        <Box x={30} y={y} w={210} h={46} accent={i === 1} dashed={isApp} />
                        <SketchText x={135} y={y + 20} size={11.5} bold accent={i === 1}>
                            {client.name}
                        </SketchText>
                        <SketchText x={135} y={y + 37} size={9.5} body opacity={0.75}>
                            {client.sub}
                        </SketchText>
                        <path
                            d={`M 244 ${y + 23} C 330 ${y + 23}, 340 180, 420 180`}
                            fill='none'
                            stroke='var(--primary)'
                            strokeOpacity={0.65}
                            strokeWidth='1.3'
                            markerEnd='url(#gui-client-arrow)'
                        />
                    </g>
                );
            })}

            <Box x={430} y={150} w={150} h={60} />
            <SketchText x={505} y={175} size={11} bold>
                TCP Connection
            </SketchText>
            <SketchText x={505} y={194} size={10} accent>
                Port 5432
            </SketchText>
            <line
                x1={584}
                y1={180}
                x2={636}
                y2={180}
                stroke='var(--primary)'
                strokeWidth='1.4'
                markerEnd='url(#gui-client-arrow)'
            />

            <Box x={640} y={80} w={230} h={200} accent />
            <SketchText x={755} y={108} size={12} bold accent>
                PostgreSQL Server
            </SketchText>
            <SketchText x={755} y={128} size={9.5} body opacity={0.8}>
                একই নিয়ম, একই Permission
            </SketchText>
            <Box x={670} y={148} w={170} h={50} />
            <SketchText x={755} y={170} size={11} bold>
                island_tours
            </SketchText>
            <SketchText x={755} y={187} size={9} body opacity={0.75}>
                আটটা Table
            </SketchText>
            <SketchText x={755} y={232} size={9.5} body opacity={0.85}>
                কে কোন জানালা দিয়ে এল,
            </SketchText>
            <SketchText x={755} y={250} size={9.5} body opacity={0.85}>
                Server এর কাছে সবাই Client
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. প্রায় সব GUI এর একই চার ভাগ                                               */
/* ------------------------------------------------------------------------- */

export function GuiAnatomyDiagram() {
    return (
        <Sketch
            label='Anatomy of a Database GUI'
            height={420}
            minWidth={820}
            viewBox='0 0 860 420'
            caption='নাম আলাদা, চেহারা আলাদা, কিন্তু প্রায় প্রতিটা GUI চারটা ভাগে সাজানো। বাঁয়ে Server আর Table এর গাছ, ডানে উপরে SQL লেখার জায়গা, নিচে ফলাফলের ছক, আর একদম নিচে একটা ছোট লাইন যেটা বলে আপনি কোথায় Connected আর Transaction এর অবস্থা কী। pgAdmin এ এগুলোর নাম Object Explorer, Query Tool আর Data Output।'>
            {/* window frame */}
            <rect x={20} y={14} width={820} height={392} fill='transparent' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.3' />
            <rect x={20} y={14} width={820} height={28} fill='currentColor' fillOpacity={0.06} />
            {[0, 1, 2].map(i => (
                <circle key={i} cx={38 + i * 16} cy={28} r={4.5} fill='currentColor' fillOpacity={0.3} />
            ))}
            <SketchText x={430} y={32} size={10} opacity={0.7}>
                Island Tours Local · island_tours
            </SketchText>

            {/* 1. tree */}
            <rect x={20} y={42} width={230} height={336} fill='currentColor' fillOpacity={0.03} stroke='currentColor' strokeOpacity={0.3} />
            <SketchText x={36} y={66} anchor='start' size={10.5} bold accent>
                ১ · Object Tree
            </SketchText>
            {[
                ['Servers', 0],
                ['Island Tours Local', 1],
                ['Databases', 2],
                ['island_tours', 3],
                ['Schemas', 4],
                ['public', 5],
                ['Tables (8)', 6],
                ['bookings', 7],
                ['customers', 7],
                ['tours', 7],
            ].map(([name, depth], i) => (
                <SketchText key={`${name}-${i}`} x={40 + Number(depth) * 12} y={92 + i * 22} anchor='start' size={10} opacity={name === 'bookings' ? 1 : 0.8} accent={name === 'bookings'}>
                    {Number(depth) < 7 ? '▾ ' : '· '}
                    {String(name)}
                </SketchText>
            ))}

            {/* 2. editor */}
            <rect x={250} y={42} width={590} height={150} fill='transparent' stroke='currentColor' strokeOpacity={0.3} />
            <SketchText x={266} y={66} anchor='start' size={10.5} bold accent>
                ২ · SQL Editor
            </SketchText>
            <SketchText x={266} y={98} anchor='start' size={11}>
                SELECT booking_id, status, total_bdt
            </SketchText>
            <SketchText x={266} y={118} anchor='start' size={11}>
                FROM bookings
            </SketchText>
            <SketchText x={266} y={138} anchor='start' size={11}>
                WHERE status = &apos;pending&apos;;
            </SketchText>
            <rect x={740} y={56} width={80} height={24} fill='var(--primary)' fillOpacity={0.15} stroke='var(--primary)' strokeWidth='1.1' />
            <SketchText x={780} y={72} size={10} bold accent>
                ▶ Run
            </SketchText>

            {/* 3. grid */}
            <rect x={250} y={192} width={590} height={186} fill='transparent' stroke='currentColor' strokeOpacity={0.3} />
            <SketchText x={266} y={216} anchor='start' size={10.5} bold accent>
                ৩ · Result Grid
            </SketchText>
            {[
                ['booking_id', 'status', 'total_bdt'],
                ['14', 'pending', '50000.00'],
                ['17', 'pending', '36000.00'],
                ['20', 'pending', '15600.00'],
                ['24', 'pending', '15600.00'],
            ].map((row, r) =>
                row.map((cell, c) => (
                    <g key={`${r}-${c}`}>
                        <rect
                            x={266 + c * 150}
                            y={228 + r * 26}
                            width={150}
                            height={26}
                            fill={r === 0 ? 'currentColor' : 'transparent'}
                            fillOpacity={r === 0 ? 0.07 : 0}
                            stroke='currentColor'
                            strokeOpacity={0.25}
                        />
                        <SketchText x={276 + c * 150} y={245 + r * 26} anchor='start' size={10} bold={r === 0}>
                            {cell}
                        </SketchText>
                    </g>
                ))
            )}
            <SketchText x={730} y={262} size={9.5} body opacity={0.75}>
                Sort, Filter, Copy,
            </SketchText>
            <SketchText x={730} y={280} size={9.5} body opacity={0.75}>
                ঘরে ক্লিক করে বদল,
            </SketchText>
            <SketchText x={730} y={298} size={9.5} body opacity={0.75}>
                CSV তে Export
            </SketchText>

            {/* 4. status */}
            <rect x={20} y={378} width={820} height={28} fill='currentColor' fillOpacity={0.06} />
            <SketchText x={36} y={396} anchor='start' size={10} bold accent>
                ৪ · Status
            </SketchText>
            <SketchText x={120} y={396} anchor='start' size={10} opacity={0.8}>
                postgres@localhost:5432/island_tours · Auto commit: on · 4 rows · 3 ms
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Dialog এর ঘর আর Connection String এর টুকরো                             */
/* ------------------------------------------------------------------------- */

/** Form rows in the same order as the URI, so no connector crosses another. */
const URI_PARTS = [
    { field: 'Username', value: 'postgres', part: 'postgres', chars: 8 },
    { field: 'Host', value: 'localhost', part: '@localhost', chars: 10 },
    { field: 'Port', value: '5432', part: ':5432', chars: 5 },
    { field: 'Database', value: 'island_tours', part: '/island_tours', chars: 13 },
    { field: 'SSL mode', value: 'prefer', part: '?sslmode=prefer', chars: 15 },
];

/** Monospace width of one character at the URI font size, for placing connectors. */
const CHAR_W = 6.9;
const URI_X = 312;
const SCHEME = 'postgresql://';

/** Where each URI part's middle falls, so a connector lands under its own text. */
const URI_CENTERS = URI_PARTS.map((p, i) => {
    const before = URI_PARTS.slice(0, i).reduce((sum, q) => sum + q.chars, SCHEME.length);
    return URI_X + (before + p.chars / 2) * CHAR_W;
});

export function DialogToUriDiagram() {
    const formX = 30;
    const rowY = (i: number) => 92 + i * 44;
    const passwordRow = URI_PARTS.length;
    return (
        <Sketch
            label='Every Dialog Field Is a Piece of the Connection String'
            height={380}
            minWidth={900}
            viewBox='0 0 920 380'
            caption='বাঁয়ে যেকোনো GUI এর New Connection ফর্ম, ডানে Module 01 এর চেনা Connection String। প্রতিটা ঘর String এর ঠিক একটা টুকরো। Password টা ইচ্ছা করে String এর বাইরে রাখা হয়েছে: GUI সেটা আলাদা জায়গায় রাখে, তাই String টা কাউকে দেখালেও Password ফাঁস হয় না।'>
            <Arrow id='gui-map-arrow' />
            <Arrow id='gui-map-arrow-muted' muted />

            {/* form */}
            <rect x={formX} y={40} width={250} height={300} fill='currentColor' fillOpacity={0.03} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={formX + 125} y={64} size={11} bold accent>
                New Connection
            </SketchText>
            {[...URI_PARTS, { field: 'Password', value: '••••••••' }].map((f, i) => (
                <g key={f.field}>
                    <SketchText x={formX + 14} y={rowY(i) + 4} anchor='start' size={10} opacity={0.75}>
                        {f.field}
                    </SketchText>
                    <rect x={formX + 104} y={rowY(i) - 13} width={132} height={24} fill='var(--card)' stroke='currentColor' strokeOpacity={0.4} />
                    <SketchText x={formX + 112} y={rowY(i) + 4} anchor='start' size={10.5} accent={f.field !== 'Password'}>
                        {f.value}
                    </SketchText>
                </g>
            ))}

            {/* URI */}
            <SketchText x={606} y={52} size={10} body opacity={0.8}>
                Connection String (URI)
            </SketchText>
            <rect x={300} y={66} width={600} height={40} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeWidth='1.2' />
            <text x={URI_X} y={91} fontFamily='var(--font-mono), monospace' fontSize={11.5} fontWeight={700}>
                <tspan fill='currentColor'>{SCHEME}</tspan>
                {URI_PARTS.map(p => (
                    <tspan key={p.part} fill='var(--primary)'>
                        {p.part}
                    </tspan>
                ))}
            </text>

            {URI_PARTS.map((p, i) => (
                <path
                    key={p.field}
                    d={`M ${formX + 240} ${rowY(i)} H ${URI_CENTERS[i]} V 112`}
                    fill='none'
                    stroke='var(--primary)'
                    strokeOpacity={0.6}
                    strokeWidth='1.2'
                    markerEnd='url(#gui-map-arrow)'
                />
            ))}

            {/* password goes elsewhere */}
            <path
                d={`M ${formX + 240} ${rowY(passwordRow)} H 520`}
                fill='none'
                stroke='currentColor'
                strokeOpacity={0.55}
                strokeDasharray='5 4'
                strokeWidth='1.2'
                markerEnd='url(#gui-map-arrow-muted)'
            />
            <rect x={524} y={282} width={370} height={62} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeDasharray='4 3' />
            <SketchText x={709} y={306} size={10.5} bold>
                Password আলাদা জায়গায়
            </SketchText>
            <SketchText x={709} y={326} size={9.5} body opacity={0.8}>
                Save password, OS এর Keychain, অথবা প্রতিবার জিজ্ঞেস
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Connect চাপার পর কোন চেকপোস্টে কোন Error                                */
/* ------------------------------------------------------------------------- */

const CHECKPOINTS = [
    {
        title: 'Port এ কেউ আছে?',
        sub: 'Host আর Port',
        error: 'Connection refused',
    },
    {
        title: 'SSL কথাবার্তা',
        sub: 'sslmode',
        error: 'server does not support SSL',
    },
    {
        title: 'Login',
        sub: 'Username, Password',
        error: 'password authentication failed',
    },
    {
        title: 'Database বাছাই',
        sub: 'Database এর নাম',
        error: 'database "..." does not exist',
    },
];

export function ConnectCheckpointsDiagram() {
    const w = 170;
    const gap = 30;
    const startX = 30;
    return (
        <Sketch
            label='Four Checkpoints Between Connect and Connected'
            height={300}
            minWidth={900}
            viewBox='0 0 920 300'
            caption='Connect চাপার পর আপনার GUI চারটা দরজা পার হয়। যেকোনো একটায় আটকালে সেই দরজার নিজস্ব Error আসে, তাই Error এর বাক্যটা পড়েই বোঝা যায় ঠিক কোন ঘরে ভুল। চারটাই পার হলে তবেই Object Tree খোলে।'>
            <Arrow id='gui-check-arrow' />
            <Arrow id='gui-check-arrow-muted' muted />
            {CHECKPOINTS.map((c, i) => {
                const x = startX + i * (w + gap);
                return (
                    <g key={c.title}>
                        <Box x={x} y={60} w={w} h={64} />
                        <SketchText x={x + w / 2} y={86} size={11} bold>
                            {c.title}
                        </SketchText>
                        <SketchText x={x + w / 2} y={106} size={9.5} body opacity={0.75}>
                            {c.sub}
                        </SketchText>
                        <line
                            x1={x + w / 2}
                            y1={128}
                            x2={x + w / 2}
                            y2={182}
                            stroke='currentColor'
                            strokeOpacity={0.5}
                            strokeDasharray='4 3'
                            markerEnd='url(#gui-check-arrow-muted)'
                        />
                        <rect x={x} y={188} width={w} height={52} fill='var(--destructive)' fillOpacity={0.07} stroke='var(--destructive)' strokeOpacity={0.6} />
                        <SketchText x={x + w / 2} y={210} size={9} opacity={0.9}>
                            ভুল হলে
                        </SketchText>
                        <SketchText x={x + w / 2} y={228} size={9.5} bold>
                            {c.error}
                        </SketchText>
                        {i < CHECKPOINTS.length - 1 && (
                            <line
                                x1={x + w + 2}
                                y1={92}
                                x2={x + w + gap - 2}
                                y2={92}
                                stroke='var(--primary)'
                                strokeWidth='1.4'
                                markerEnd='url(#gui-check-arrow)'
                            />
                        )}
                    </g>
                );
            })}
            <SketchText x={460} y={36} size={10} body opacity={0.8}>
                Connect চাপলেন
            </SketchText>
            <SketchText x={460} y={276} size={10.5} bold accent>
                চারটা পার হলে: Connected, Object Tree খোলে
            </SketchText>
        </Sketch>
    );
}
