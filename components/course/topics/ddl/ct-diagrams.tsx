import { Sketch, SketchBox, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. Table মানে একটা চুক্তি                                                     */
/* ------------------------------------------------------------------------- */

const CONTRACT_COLUMNS = [
    { name: 'extra_id', type: 'integer', x: 40 },
    { name: 'tour_id', type: 'integer', x: 150 },
    { name: 'name', type: 'text', x: 250 },
    { name: 'price_bdt', type: 'numeric(8,2)', x: 440 },
    { name: 'is_optional', type: 'boolean', x: 570 },
];
const CONTRACT_RIGHT = 690;

const CONTRACT_ROWS = [
    ['1', '1', 'Life jacket', '300.00', 't'],
    ['2', '1', 'Snorkeling kit', '800.00', 't'],
    ['3', '3', 'Forest boat permit', '1500.00', 'f'],
];

/**
 * A table split into its two halves: the definition on top (every column's
 * name and type, written once by CREATE TABLE) and the rows below it, each of
 * which must fit that definition. A row that does not fit never gets in.
 */
export function CtTableContractDiagram() {
    const left = CONTRACT_COLUMNS[0].x;
    const xs = CONTRACT_COLUMNS.map(col => col.x);
    const width = CONTRACT_RIGHT - left;
    return (
        <Sketch
            label='A Table Is a Promise'
            height={360}
            minWidth={900}
            viewBox='0 0 920 360'
            caption='উপরের দুই সারি Table এর সংজ্ঞা: প্রতিটা Column এর নাম আর Type। CREATE TABLE ঠিক এই অংশটাই লেখে, একবার। নিচের Row গুলো Data, যেগুলো পরে আসে আর যায়। প্রতিটা নতুন Row কে এই সংজ্ঞার সাথে মিলতে হয়। price_bdt এর ঘরে free লেখা Row টা মেলে না, তাই Database তাকে ঢুকতেই দেয় না।'>
            <rect x={left} y={30} width={width} height={56} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.3' />
            {CONTRACT_COLUMNS.map((col, i) => (
                <g key={col.name}>
                    {i > 0 && <line x1={xs[i]} y1={30} x2={xs[i]} y2={226} stroke='currentColor' strokeOpacity={0.25} />}
                    <SketchText x={xs[i] + 10} y={52} size={11} anchor='start' bold accent>
                        {col.name}
                    </SketchText>
                    <SketchText x={xs[i] + 10} y={74} size={10} anchor='start' opacity={0.8}>
                        {col.type}
                    </SketchText>
                </g>
            ))}
            <rect x={left} y={86} width={width} height={140} fill='transparent' stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.2' />
            {CONTRACT_ROWS.map((row, r) => (
                <g key={row[0]}>
                    {r > 0 && <line x1={left} y1={86 + r * 40} x2={left + width} y2={86 + r * 40} stroke='currentColor' strokeOpacity={0.15} />}
                    {row.map((cell, c) => (
                        <SketchText key={c} x={xs[c] + 10} y={110 + r * 40} size={10.5} anchor='start'>
                            {cell}
                        </SketchText>
                    ))}
                </g>
            ))}
            <SketchText x={left + 10} y={218} size={9.5} anchor='start' body opacity={0.6}>
                Row গুলো আসে আর যায়, সংজ্ঞা একই থাকে
            </SketchText>

            <g opacity={0.9}>
                <rect x={left} y={262} width={width} height={36} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeDasharray='4 3' />
                {['4', '2', 'Beach photographer', 'free', 't'].map((cell, c) => (
                    <SketchText key={c} x={xs[c] + 10} y={285} size={10.5} anchor='start' accent={c === 3} bold={c === 3}>
                        {cell}
                    </SketchText>
                ))}
                <line x1={xs[3] + 4} y1={270} x2={xs[3] + 70} y2={292} stroke='var(--primary)' strokeWidth='2' />
                <line x1={xs[3] + 70} y1={270} x2={xs[3] + 4} y2={292} stroke='var(--primary)' strokeWidth='2' />
            </g>
            <SketchText x={left} y={322} size={10} anchor='start' accent bold>
                ERROR: invalid input syntax for type numeric: &quot;free&quot;
            </SketchText>
            <SketchText x={left} y={342} size={9.5} anchor='start' body opacity={0.75}>
                সংজ্ঞার সাথে না মেলা Row বাইরেই থেকে যায়, Table এ কিছুই বদলায় না
            </SketchText>

            <SketchText x={left + width + 14} y={62} size={10} anchor='start' body accent bold>
                সংজ্ঞা
            </SketchText>
            <SketchText x={left + width + 14} y={160} size={10} anchor='start' body bold>
                Data
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. CREATE TABLE এর গঠন                                                      */
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

/**
 * The parts of a CREATE TABLE statement: the two keywords, the table name, the
 * bracket that holds the column list, one "name type" pair per line, the comma
 * between pairs (and none after the last), and the closing semicolon.
 */
export function CtAnatomyDiagram() {
    return (
        <Sketch
            label='Anatomy of CREATE TABLE'
            height={360}
            minWidth={920}
            viewBox='0 0 940 360'
            caption='CREATE TABLE, তারপর নাম, তারপর বন্ধনীর ভেতরে Column এর তালিকা। প্রতিটা Column এ অন্তত দুটো জিনিস: নাম আর Type। Column গুলোর মাঝে কমা, শেষ Column এর পরে কমা নেই। বন্ধনী বন্ধ, তারপর সেমিকোলন। Type এর পরে আরও নিয়ম (NOT NULL, DEFAULT, PRIMARY KEY) বসানো যায়, সেগুলো এই Module এর Lesson 07 থেকে 09।'>
            <rect x={20} y={20} width={460} height={320} fill='var(--card)' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.2' />
            <rect x={20} y={20} width={460} height={26} fill='var(--primary)' fillOpacity={0.1} />
            <SketchText x={34} y={37} size={10} anchor='start' bold accent>
                ct_tour_extras.sql
            </SketchText>

            <CodeLine x={40} y={80} accent>
                CREATE TABLE ct_tour_extras (
            </CodeLine>
            <CodeLine x={64} y={110}>extra_id    integer,</CodeLine>
            <CodeLine x={64} y={136}>tour_id     integer,</CodeLine>
            <CodeLine x={64} y={162}>name        text,</CodeLine>
            <CodeLine x={64} y={188}>price_bdt   numeric(8, 2),</CodeLine>
            <CodeLine x={64} y={214}>is_optional boolean,</CodeLine>
            <CodeLine x={64} y={240}>created_at  timestamptz</CodeLine>
            <CodeLine x={40} y={272} accent>
                );
            </CodeLine>
            <CodeLine x={40} y={310} dim>
                -- psql বলবে: CREATE TABLE
            </CodeLine>

            <Callout x1={170} y={80} x2={520} label='CREATE TABLE' sub='কী বানাচ্ছেন, সেই দুই শব্দ' />
            <Callout x1={300} y={98} x2={520} label='Table এর নাম' sub='ছোট হাতের অক্ষর, শব্দের মাঝে _' />
            <Callout x1={170} y={128} x2={520} label='নাম  Type' sub='প্রতিটা Column এর এক জোড়া, প্রতি লাইনে একটা' />
            <Callout x1={270} y={188} x2={520} label='Type এর ভেতরের মাপ' sub='numeric(8, 2): মোট ৮ অঙ্ক, দশমিকের পরে ২' />
            <Callout x1={240} y={214} x2={520} label='কমা' sub='পরের Column আসছে' />
            <Callout x1={270} y={240} x2={520} label='শেষ Column, কমা নেই' sub='এখানে কমা দিলে syntax error' />
            <Callout x1={70} y={272} x2={520} label='বন্ধনী বন্ধ, তারপর ;' sub='পুরোটা মিলে একটাই Statement' />
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. Type এর পরিবার                                                           */
/* ------------------------------------------------------------------------- */

const FAMILIES = [
    { title: 'সংখ্যা', types: 'smallint · integer · bigint', more: 'numeric(p, s) · double precision', example: 'price_bdt numeric(10,2)', lesson: 'Lesson 03' },
    { title: 'লেখা', types: 'text · varchar(n)', more: 'char(n)', example: 'title text', lesson: 'Lesson 04' },
    { title: 'তারিখ আর সময়', types: 'date · timestamptz', more: 'time · interval', example: 'starts_on date', lesson: 'Lesson 05' },
    { title: 'হ্যাঁ/না, পরিচয়, তালিকা', types: 'boolean · uuid', more: 'enum', example: 'is_active boolean', lesson: 'Lesson 06' },
];

/**
 * The four families of column types this module teaches, each with the types a
 * beginner meets first, one real column from the sample database, and the
 * lesson of this module that goes deep into it.
 */
export function CtTypeFamiliesDiagram() {
    return (
        <Sketch
            label='Type Families at a Glance'
            height={300}
            minWidth={920}
            viewBox='0 0 940 300'
            caption='প্রতিটা Column এর Type এই চারটা পরিবারের কোনো একটা থেকে আসে। নিচের সারিতে Island Tours এর আসল একটা করে Column। এই লেসনে শুধু চেনা পরিচয়, প্রতিটা পরিবারের নিজের লেসন আছে এই Module এই, যেখানে সীমা, Error আর কোনটা কখন, সব আলাদা করে দেখবেন।'>
            {FAMILIES.map((f, i) => {
                const x = 20 + i * 228;
                return (
                    <g key={f.title}>
                        <rect x={x} y={30} width={212} height={170} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
                        <rect x={x} y={30} width={212} height={36} fill='var(--primary)' fillOpacity={0.1} />
                        <SketchText x={x + 106} y={53} size={12} body bold accent>
                            {f.title}
                        </SketchText>
                        <SketchText x={x + 106} y={96} size={10.5}>
                            {f.types}
                        </SketchText>
                        <SketchText x={x + 106} y={120} size={10} opacity={0.7}>
                            {f.more}
                        </SketchText>
                        <line x1={x + 16} y1={142} x2={x + 196} y2={142} stroke='currentColor' strokeOpacity={0.2} />
                        <SketchText x={x + 106} y={166} size={10} accent>
                            {f.example}
                        </SketchText>
                        <SketchText x={x + 106} y={186} size={9} body opacity={0.65}>
                            Island Tours এ
                        </SketchText>
                        <SketchBox x={x + 56} y={222} w={100} h={34} title={f.lesson} accent />
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. নাম ছোট হাতে ভাঁজ হয়                                                        */
/* ------------------------------------------------------------------------- */

function Step({ y, label, value, accent, error }: { y: number; label: string; value: string; accent?: boolean; error?: boolean }) {
    return (
        <g>
            <SketchText x={20} y={y} size={9.5} anchor='start' body opacity={0.7}>
                {label}
            </SketchText>
            <rect
                x={20}
                y={y + 8}
                width={360}
                height={34}
                fill={accent || error ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.1 : error ? 0.05 : 0}
                stroke={accent || error ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent || error ? 1 : 0.45}
                strokeDasharray={error ? '4 3' : undefined}
                strokeWidth='1.2'
            />
            <SketchText x={34} y={y + 30} size={11} anchor='start' bold={accent || error} accent={accent || error}>
                {value}
            </SketchText>
        </g>
    );
}

/**
 * What PostgreSQL does with a name: without double quotes it lowercases the
 * name before storing or looking it up, so every spelling finds the table;
 * with quotes it keeps the exact letters, and from then on only the exact
 * quoted spelling finds it.
 */
export function CtNameFoldingSplit() {
    return (
        <SketchSplit
            label='How PostgreSQL Reads a Name'
            caption='বাঁ দিকে: উদ্ধৃতি চিহ্ন ছাড়া লেখা নাম PostgreSQL আগে ছোট হাতের অক্ষরে বদলে নেয়, রাখার সময়ও, খোঁজার সময়ও। তাই যেভাবেই লিখুন, একই Table পাওয়া যায়। ডান দিকে: দুই পাশে " দিলে অক্ষর হুবহু থাকে। তখন খোঁজার সময়ও হুবহু, উদ্ধৃতি সহ লিখতে হয়, না হলে PostgreSQL ছোট হাতের নামটা খোঁজে আর পায় না।'
            panels={[
                {
                    title: 'Unquoted',
                    sub: 'ছোট হাতে ভাঁজ হয়',
                    viewBox: '0 0 400 300',
                    height: 300,
                    minWidth: 320,
                    children: (
                        <g>
                            <Step y={20} label='আপনি লিখলেন' value='CREATE TABLE CT_TourExtras (...)' />
                            <Step y={96} label='PostgreSQL রাখল' value='ct_tourextras' accent />
                            <Step y={172} label='যেকোনো বানানে খুঁজলে' value='ct_tourextras · CT_TOUREXTRAS' />
                            <SketchText x={20} y={268} size={10.5} anchor='start' body accent bold>
                                সব বানানে একই Table পাওয়া যায়
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'Quoted',
                    sub: 'অক্ষর হুবহু থাকে',
                    viewBox: '0 0 400 300',
                    height: 300,
                    minWidth: 320,
                    children: (
                        <g>
                            <Step y={20} label='আপনি লিখলেন' value='CREATE TABLE "Ct_PhotoPackages" (...)' />
                            <Step y={96} label='PostgreSQL রাখল' value='Ct_PhotoPackages' accent />
                            <Step y={172} label='উদ্ধৃতি ছাড়া খুঁজলে খোঁজা হয় ct_photopackages' value='relation does not exist' error />
                            <SketchText x={20} y={268} size={10.5} anchor='start' body accent bold>
                                প্রতিবার লিখতে হবে &quot;Ct_PhotoPackages&quot;
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 5. AS কপি করে Row, LIKE কপি করে গঠন                                          */
/* ------------------------------------------------------------------------- */

function CopyRow({ y, label, copied, note }: { y: number; label: string; copied: boolean; note?: string }) {
    return (
        <g>
            <circle
                cx={34}
                cy={y - 4}
                r={8}
                fill={copied ? 'var(--primary)' : 'transparent'}
                fillOpacity={copied ? 0.2 : 0}
                stroke={copied ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={copied ? 1 : 0.45}
                strokeWidth='1.2'
            />
            {copied ? (
                <path d={`M ${29} ${y - 4} l 4 4 l 6 -8`} fill='none' stroke='var(--primary)' strokeWidth='1.6' />
            ) : (
                <path d={`M ${30} ${y - 8} l 8 8 M ${38} ${y - 8} l -8 8`} fill='none' stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.4' />
            )}
            <SketchText x={54} y={y} size={10.5} anchor='start' bold={copied} accent={copied} opacity={copied ? 1 : 0.65}>
                {label}
            </SketchText>
            {note && (
                <SketchText x={250} y={y} size={9.5} anchor='start' body opacity={0.7}>
                    {note}
                </SketchText>
            )}
        </g>
    );
}

/**
 * What each way of making a table from another one carries over. CREATE TABLE
 * AS keeps the rows and the column types but none of the rules; LIKE keeps the
 * shape and NOT NULL, more with INCLUDING options, and never the rows or the
 * foreign keys. Checked on PostgreSQL 18 against the tours table.
 */
export function CtCopySplit() {
    return (
        <SketchSplit
            label='What Gets Copied'
            caption='CREATE TABLE AS একটা Query চালায় আর তার ফলাফল নতুন Table এ ঢেলে দেয়: Row আসে, Column এর Type আসে, কিন্তু কোনো নিয়ম আসে না, সব Column NULL নিতে রাজি। LIKE উল্টো: Row একটাও আসে না, আসে গঠন আর NOT NULL। INCLUDING ALL লিখলে DEFAULT, CHECK, PRIMARY KEY আর Identity ও আসে। Foreign Key কোনোটাতেই আসে না। দুটোই PostgreSQL 18 এ tours Table দিয়ে যাচাই করা।'
            panels={[
                {
                    title: 'CREATE TABLE ... AS SELECT',
                    sub: 'Query এর ফলাফল একবার',
                    viewBox: '0 0 400 270',
                    height: 270,
                    minWidth: 320,
                    children: (
                        <g>
                            <CopyRow y={34} label='Row (Data)' copied note='Query চালানোর মুহূর্তের' />
                            <CopyRow y={70} label='Column এর নাম আর Type' copied />
                            <CopyRow y={106} label='NOT NULL' copied={false} />
                            <CopyRow y={142} label='DEFAULT' copied={false} />
                            <CopyRow y={178} label='CHECK, PRIMARY KEY' copied={false} />
                            <CopyRow y={214} label='FOREIGN KEY' copied={false} />
                            <SketchText x={20} y={254} size={10} anchor='start' body accent bold>
                                পরে মূল Table বদলালে কপি বদলায় না
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'CREATE TABLE ... (LIKE src)',
                    sub: 'শুধু গঠন, Row ছাড়া',
                    viewBox: '0 0 400 270',
                    height: 270,
                    minWidth: 320,
                    children: (
                        <g>
                            <CopyRow y={34} label='Row (Data)' copied={false} note='একটাও না' />
                            <CopyRow y={70} label='Column এর নাম আর Type' copied />
                            <CopyRow y={106} label='NOT NULL' copied note='সবসময়' />
                            <CopyRow y={142} label='DEFAULT' copied note='INCLUDING DEFAULTS দিলে' />
                            <CopyRow y={178} label='CHECK, PRIMARY KEY' copied note='INCLUDING ALL দিলে' />
                            <CopyRow y={214} label='FOREIGN KEY' copied={false} note='কখনো না' />
                            <SketchText x={20} y={254} size={10} anchor='start' body accent bold>
                                একই রকম খালি Table, নতুন Data এর জন্য
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 6. Table এর সংজ্ঞা নিজেও Data                                                 */
/* ------------------------------------------------------------------------- */

/**
 * CREATE TABLE writes the definition as rows in the system catalog: one row in
 * pg_class for the table, one row per column in pg_attribute. Every way of
 * reading a table back (psql's \d, the information_schema views, pg_dump)
 * reads those same rows.
 */
export function CtCatalogDiagram() {
    const arrow = (d: string) => (
        <path d={d} fill='none' stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#ct-catalog-arrow)' />
    );
    return (
        <Sketch
            label='Where a Definition Lives'
            height={330}
            minWidth={940}
            viewBox='0 0 960 330'
            caption='CREATE TABLE চালালে PostgreSQL তার নিজের কিছু Table এ নতুন Row লেখে। pg_class এ একটা Row: Table টার নাম আর পরিচয়। pg_attribute এ প্রতিটা Column এর জন্য একটা Row: নাম, ক্রম, Type। এই Table গুলোর নাম System Catalog। psql এর \d, information_schema আর pg_dump, তিনজনই আসলে এই একই Row গুলো পড়ে, শুধু আলাদা চেহারায় দেখায়।'>
            <defs>
                <marker id='ct-catalog-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchBox x={20} y={130} w={190} h={60} title='CREATE TABLE' sub='ct_tour_extras (...)' accent />

            <rect x={290} y={30} width={330} height={270} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeDasharray='5 4' strokeWidth='1.2' />
            <SketchText x={455} y={52} size={10.5} body bold>
                System Catalog (pg_catalog)
            </SketchText>
            <SketchBox x={310} y={70} w={290} h={60} title='pg_class' sub='১টা Row: ct_tour_extras, kind r (table)' />
            <SketchBox x={310} y={150} w={290} h={60} title='pg_attribute' sub='প্রতিটা Column এ একটা Row: extra_id 1, ...' />
            <SketchBox x={310} y={230} w={290} h={52} title='pg_type' sub='integer, text, numeric ... (আগে থেকেই আছে)' dashed />

            <SketchBox x={720} y={40} w={220} h={56} title='\d ct_tour_extras' sub='psql এর ছোট আদেশ' />
            <SketchBox x={720} y={132} w={220} h={56} title='information_schema' sub='SQL Standard এর View' />
            <SketchBox x={720} y={224} w={220} h={56} title='pg_dump --schema-only' sub='আবার CREATE TABLE লিখে দেয়' />

            {arrow('M 210 150 L 306 104')}
            {arrow('M 210 170 L 306 180')}
            {arrow('M 716 68 L 604 100')}
            {arrow('M 716 160 L 604 178')}
            {arrow('M 716 252 L 604 190')}
            <SketchText x={258} y={118} size={9.5} body opacity={0.75}>
                লেখে
            </SketchText>
            <SketchText x={662} y={126} size={9.5} body opacity={0.75}>
                পড়ে
            </SketchText>
        </Sketch>
    );
}
