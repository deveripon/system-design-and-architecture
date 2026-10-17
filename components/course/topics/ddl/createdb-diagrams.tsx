import { Sketch, SketchBox, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. CREATE DATABASE আসলে একটা Copy                                           */
/* ------------------------------------------------------------------------- */

/**
 * A new database is never built from nothing: the server copies a template.
 * Plain CREATE DATABASE copies template1; a different encoding or locale
 * needs the untouched template0 instead.
 */
export function CreatedbTemplateCopyDiagram() {
    return (
        <Sketch
            label='CREATE DATABASE copies a template'
            height={340}
            minWidth={860}
            viewBox='0 0 860 340'
            caption='উপরের পথটা রোজকার: কিছু না বললে CREATE DATABASE হুবহু template1 এর Copy বানায়। নিচের পথটা লাগে যখন নতুন Database এর Encoding বা Locale ছাঁচের থেকে আলাদা, যেমন ICU এর bn-BD। তখন TEMPLATE template0 বলতে হয়, কারণ template0 কখনো বদলানো হয় না আর তাতে কেউ Connect ও করতে পারে না। Copy চলার সময় ছাঁচে অন্য কেউ Connect থাকলে PostgreSQL কাজটাই শুরু করে না।'>
            <defs>
                <marker
                    id='createdb-copy-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
                <marker
                    id='createdb-copy-arrow-muted'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='currentColor' fillOpacity={0.6} />
                </marker>
            </defs>

            {/* the two templates */}
            <SketchBox x={40} y={50} w={220} h={70} title='template1' sub='ডিফল্ট ছাঁচ' accent />
            <SketchText x={150} y={142} size={9.5} body opacity={0.8}>
                এখানে কেউ Connect থাকলে Copy হয় না
            </SketchText>

            <SketchBox x={40} y={210} w={220} h={70} title='template0' sub='আসল ছাঁচ, কখনো বদলায় না' dashed />
            <SketchText x={150} y={302} size={9.5} body opacity={0.8}>
                datallowconn = false, কেউ ঢুকতে পারে না
            </SketchText>

            {/* everyday path */}
            <line x1={262} y1={85} x2={572} y2={85} stroke='var(--primary)' strokeWidth='1.5' markerEnd='url(#createdb-copy-arrow)' />
            <SketchText x={417} y={72} size={10.5} bold accent>
                CREATE DATABASE island_tours_dev;
            </SketchText>
            <SketchText x={417} y={106} size={9.5} body opacity={0.8}>
                কিছু না বললে template1 থেকে Copy
            </SketchText>

            {/* template0 path */}
            <line
                x1={262}
                y1={245}
                x2={572}
                y2={245}
                stroke='currentColor'
                strokeOpacity={0.6}
                strokeWidth='1.4'
                strokeDasharray='5 4'
                markerEnd='url(#createdb-copy-arrow-muted)'
            />
            <SketchText x={417} y={224} size={10}>
                ... TEMPLATE template0
            </SketchText>
            <SketchText x={417} y={268} size={10}>
                LOCALE_PROVIDER icu ICU_LOCALE &apos;bn-BD&apos;
            </SketchText>

            {/* the copies */}
            <SketchBox x={580} y={50} w={240} h={70} title='island_tours_dev' sub='template1 এর হুবহু Copy' accent />
            <SketchBox x={580} y={210} w={240} h={70} title='island_tours_bn' sub='নতুন Locale, পরিষ্কার Copy' />
            <SketchText x={700} y={142} size={9.5} body opacity={0.8}>
                template1 এ যা আছে, এখানেও তাই
            </SketchText>
            <SketchText x={700} y={302} size={9.5} body opacity={0.8}>
                template1 এর Locale libc, তাই template0 লাগল
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Query বক্স একটা ঘর, আপনার Server একটা বাড়ি                                */
/* ------------------------------------------------------------------------- */

function BoxPanel() {
    return (
        <g>
            <defs>
                <marker
                    id='createdb-box-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchBox x={100} y={14} w={140} h={44} title='Query বক্স' sub='একটাই Connection' />
            <line x1={170} y1={60} x2={95} y2={140} stroke='var(--primary)' strokeWidth='1.8' markerEnd='url(#createdb-box-arrow)' />
            <SketchBox x={20} y={146} w={150} h={52} title='postgres' sub='সব সময় এখানেই' accent />

            <line x1={170} y1={60} x2={245} y2={140} stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.2' strokeDasharray='4 4' />
            <line x1={196} y1={92} x2={220} y2={112} stroke='var(--primary)' strokeWidth='2' />
            <line x1={220} y1={92} x2={196} y2={112} stroke='var(--primary)' strokeWidth='2' />
            <SketchBox x={180} y={146} w={150} h={52} title='createdb_practice' sub='Catalog এ আছে' dashed />

            <SketchText x={170} y={226} size={9.5} body opacity={0.85}>
                \c নেই, তাই নতুন Database এ ঢোকা যায় না
            </SketchText>
        </g>
    );
}

function ServerPanel() {
    const dbs = [
        { name: 'island_tours', x: 10 },
        { name: 'island_tours_dev', x: 120 },
        { name: 'island_tours_test', x: 230 },
    ];
    return (
        <g>
            <defs>
                <marker
                    id='createdb-server-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchBox x={100} y={14} w={140} h={44} title='psql' sub='\c দিয়ে ঘর বদল' accent />
            {dbs.map((db, i) => (
                <g key={db.name}>
                    <line
                        x1={170}
                        y1={60}
                        x2={db.x + 50}
                        y2={140}
                        stroke={i === 1 ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={i === 1 ? 1 : 0.45}
                        strokeWidth={i === 1 ? '1.8' : '1.2'}
                        markerEnd={i === 1 ? 'url(#createdb-server-arrow)' : undefined}
                    />
                    <rect
                        x={db.x}
                        y={146}
                        width={100}
                        height={52}
                        fill={i === 1 ? 'var(--primary)' : 'transparent'}
                        fillOpacity={i === 1 ? 0.1 : 0}
                        stroke={i === 1 ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={i === 1 ? 1 : 0.4}
                        strokeWidth='1.2'
                    />
                    <SketchText x={db.x + 50} y={176} size={8.5} bold accent={i === 1}>
                        {db.name}
                    </SketchText>
                </g>
            ))}
            <SketchText x={170} y={226} size={9.5} body opacity={0.85}>
                যত খুশি Database, যখন খুশি যেকোনোটায়
            </SketchText>
        </g>
    );
}

/**
 * The page's query box holds one connection that can never leave the
 * `postgres` database, while a real server lets psql hop between databases.
 */
export function CreatedbBoxVsServerSplit() {
    return (
        <SketchSplit
            label='One room here, a whole house at home'
            caption='বাম দিকে এই পাতার Query বক্স: ভেতরে আসল PostgreSQL 18, কিন্তু একটাই Connection, আর সেটা postgres Database এ বাঁধা। CREATE DATABASE এখানে চলে, Catalog এ নতুন নামটাও ওঠে, কিন্তু সেখানে যাওয়ার দরজা নেই, কারণ \c psql এর Command, SQL না। ডান দিকে আপনার নিজের Server: psql দিয়ে যতগুলো খুশি Database এর মধ্যে আসা যাওয়া করা যায়।'
            panels={[
                {
                    title: 'এই পাতার Query বক্স',
                    sub: 'একটা ঘর',
                    viewBox: '0 0 340 240',
                    height: 240,
                    minWidth: 300,
                    children: <BoxPanel />,
                },
                {
                    title: 'আপনার নিজের PostgreSQL',
                    sub: 'পুরো বাড়ি',
                    viewBox: '0 0 340 240',
                    height: 240,
                    minWidth: 300,
                    children: <ServerPanel />,
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. একটা পূর্ণ CREATE DATABASE এর শরীর                                        */
/* ------------------------------------------------------------------------- */

const ANATOMY = [
    { code: 'CREATE DATABASE island_tours_dev', note: 'নাম: ছোট হাতের অক্ষর, শব্দের মাঝে _', key: true },
    { code: '    OWNER island_app', note: 'কার জিনিস: App এর Role, superuser না', key: false },
    { code: '    TEMPLATE template0', note: 'কোন ছাঁচ থেকে Copy', key: false },
    { code: "    ENCODING 'UTF8'", note: 'লেখাকে Byte এ রাখার নিয়ম', key: false },
    { code: '    LOCALE_PROVIDER icu', note: 'সাজানোর নিয়ম কে দেবে: libc, icu, builtin', key: false },
    { code: "    ICU_LOCALE 'bn-BD'", note: 'কোন ভাষার নিয়মে সাজানো হবে', key: false },
    { code: '    CONNECTION LIMIT 50;', note: 'একসাথে সর্বোচ্চ কতজন', key: false },
];

/**
 * The full statement Tanim ends up writing, one clause per line, each with a
 * plain-language label. Every clause except the name is optional.
 */
export function CreatedbAnatomyDiagram() {
    const rowY = (i: number) => 52 + i * 38;
    return (
        <Sketch
            label='Anatomy of CREATE DATABASE'
            height={330}
            minWidth={860}
            viewBox='0 0 860 330'
            caption='শুধু প্রথম লাইনটা বাধ্যতামূলক, বাকি প্রতিটা Clause ঐচ্ছিক, আর না দিলে মান আসে ছাঁচ থেকে। ক্রম নিয়ে চিন্তা নেই, PostgreSQL যেকোনো ক্রমে নেয়। প্রতিটা লাইনের মানে এই লেসনের আলাদা একটা Section এ আছে।'>
            <rect x={30} y={24} width={380} height={282} fill='var(--primary)' fillOpacity={0.04} stroke='currentColor' strokeOpacity={0.35} />
            {ANATOMY.map((row, i) => (
                <g key={row.code}>
                    <SketchText x={46} y={rowY(i) + 4} anchor='start' size={11} bold={row.key} accent={row.key}>
                        {row.code}
                    </SketchText>
                    <line
                        x1={404}
                        y1={rowY(i)}
                        x2={474}
                        y2={rowY(i)}
                        stroke={row.key ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={row.key ? 1 : 0.4}
                        strokeWidth='1.1'
                        strokeDasharray={row.key ? undefined : '3 3'}
                    />
                    <circle cx={478} cy={rowY(i)} r={3} fill={row.key ? 'var(--primary)' : 'currentColor'} fillOpacity={row.key ? 1 : 0.5} />
                    <SketchText x={490} y={rowY(i) + 4} anchor='start' size={10} body accent={row.key}>
                        {row.note}
                    </SketchText>
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. এক App, প্রতিটা পরিবেশে আলাদা Database                                     */
/* ------------------------------------------------------------------------- */

const ENVS = [
    { title: 'Developer এর Laptop', x: 30, dbs: ['island_tours_dev', 'island_tours_test'], url: '.env এ DATABASE_URL' },
    { title: 'Staging Server', x: 320, dbs: ['island_tours'], url: 'Server এর DATABASE_URL' },
    { title: 'Production Server', x: 610, dbs: ['island_tours'], url: 'Secret Store এর DATABASE_URL' },
];

/**
 * The same application code runs in three places, and the only thing that
 * tells it which database to use is the DATABASE_URL of that environment.
 */
export function CreatedbEnvironmentsDiagram() {
    return (
        <Sketch
            label='One app, one database per environment'
            height={330}
            minWidth={880}
            viewBox='0 0 880 330'
            caption='Code একটাই, তিন জায়গায় চলে। কোন Database এ যাবে, সেটা Code জানে না, জানে শুধু সেই পরিবেশের DATABASE_URL। Laptop এ কাজের জন্য _dev আর Test এর জন্য _test, যাতে Test চালাতে গিয়ে কাজের Data মুছে না যায়। Staging আর Production আলাদা Server এ, তাই নাম একই হলেও একটা আরেকটাকে ছুঁতে পারে না।'>
            <defs>
                <marker
                    id='createdb-env-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {ENVS.map((env, i) => (
                <g key={env.title}>
                    <rect
                        x={env.x}
                        y={20}
                        width={240}
                        height={290}
                        fill='transparent'
                        stroke='currentColor'
                        strokeOpacity={0.35}
                        strokeDasharray={i === 0 ? undefined : '5 4'}
                    />
                    <SketchText x={env.x + 120} y={44} size={10.5} bold accent>
                        {env.title}
                    </SketchText>
                    <SketchBox x={env.x + 50} y={62} w={140} h={40} title='Island Tours App' />
                    <line x1={env.x + 120} y1={104} x2={env.x + 120} y2={160} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#createdb-env-arrow)' />
                    <SketchText x={env.x + 128} y={136} anchor='start' size={9} body opacity={0.85}>
                        {env.url}
                    </SketchText>
                    {env.dbs.map((db, j) => (
                        <SketchBox
                            key={db}
                            x={env.x + 30}
                            y={168 + j * 64}
                            w={180}
                            h={46}
                            title={db}
                            sub={db.endsWith('_test') ? 'প্রতিবার খালি করে নতুন' : 'Server এর নিজের'}
                            accent={j === 0}
                        />
                    ))}
                </g>
            ))}
        </Sketch>
    );
}
