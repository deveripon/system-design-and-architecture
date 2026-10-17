import Link from 'next/link';
import { Sketch, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. একটা ALTER TABLE Statement এর গঠন                                         */
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
 * The parts of one ALTER TABLE statement: the command, the optional IF EXISTS,
 * the table, then a comma separated list of actions that all happen under one
 * lock and either all succeed or all fail.
 */
export function AlterAnatomyDiagram() {
    return (
        <Sketch
            label='Anatomy of an ALTER TABLE Statement'
            height={390}
            minWidth={920}
            viewBox='0 0 940 390'
            caption='একটা ALTER TABLE এ একটাই Table, তার পরে যত খুশি Action, কমা দিয়ে আলাদা। সব Action একসাথে একটা Lock এর ভেতরে চলে, আর হয় সবগুলো হয়, নয়তো একটাও না। ব্যতিক্রম শুধু RENAME আর SET SCHEMA: এরা একা একটা Statement চায়, অন্য Action এর সাথে কমা দিয়ে বসালে Syntax Error।'>
            <rect x={20} y={20} width={480} height={300} fill='var(--card)' stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.2' />
            <rect x={20} y={20} width={480} height={26} fill='var(--primary)' fillOpacity={0.1} />
            <SketchText x={34} y={37} size={10} anchor='start' bold accent>
                migration.sql
            </SketchText>

            <CodeLine x={40} y={78} accent>ALTER TABLE IF EXISTS alter_customers</CodeLine>
            <CodeLine x={64} y={108}>ADD COLUMN whatsapp text,</CodeLine>
            <CodeLine x={64} y={134}>ADD COLUMN vip boolean NOT NULL DEFAULT false,</CodeLine>
            <CodeLine x={64} y={160}>{"ALTER COLUMN city SET DEFAULT 'Dhaka',"}</CodeLine>
            <CodeLine x={64} y={186}>ADD CONSTRAINT alter_customers_city_check</CodeLine>
            <CodeLine x={88} y={208} dim>CHECK (length(city) &gt; 1);</CodeLine>

            <rect x={40} y={236} width={440} height={66} fill='var(--primary)' fillOpacity={0.05} stroke='currentColor' strokeOpacity={0.3} strokeDasharray='4 3' />
            <SketchText x={56} y={258} size={10.5} anchor='start' opacity={0.85}>
                ALTER TABLE alter_customers
            </SketchText>
            <SketchText x={80} y={278} size={10.5} anchor='start' opacity={0.85}>
                RENAME COLUMN phone TO mobile;
            </SketchText>
            <SketchText x={470} y={294} size={9.5} anchor='end' body opacity={0.7}>
                RENAME সবসময় আলাদা Statement এ
            </SketchText>

            <Callout x1={306} y={78} x2={540} label='ALTER TABLE IF EXISTS নাম' sub='IF EXISTS ঐচ্ছিক: Table না থাকলে Error না, শুধু NOTICE' />
            <Callout x1={250} y={121} x2={540} label='Action, কমা দিয়ে আলাদা' sub='যত খুশি, সব একটা Lock এর ভেতরে, একসাথে' />
            <Callout x1={336} y={160} x2={540} label='ALTER COLUMN' sub='একটা Column এর Default, NOT NULL বা Type বদল' />
            <Callout x1={345} y={197} x2={540} label='ADD CONSTRAINT নাম' sub='নিজে নাম দিলে পরে খোঁজা আর মোছা সহজ' />
            <Callout x1={270} y={236} x2={540} label='সেমিকোলন একদম শেষে' sub='সব Action একসাথে হয়, অথবা একটাও না' />
            <Callout x1={300} y={282} x2={540} label='RENAME একা' sub='অন্য Action এর সাথে কমা দিয়ে মেলে না' />
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. ALTER এর তিন রকম খরচ: শুধু Catalog, পুরো Scan, পুরো Rewrite                     */
/* ------------------------------------------------------------------------- */

function WorkColumn({
    x,
    title,
    sub,
    items,
    footer,
    children,
    accent,
}: {
    x: number;
    title: string;
    sub: string;
    items: string[];
    footer: string;
    children: React.ReactNode;
    accent?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={20}
                width={290}
                height={360}
                fill={accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.04 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.8 : 0.4}
                strokeWidth='1.2'
            />
            <SketchText x={x + 145} y={46} size={12} bold accent={accent}>
                {title}
            </SketchText>
            <SketchText x={x + 145} y={64} size={10} body opacity={0.8}>
                {sub}
            </SketchText>
            {children}
            {items.map((item, i) => (
                <SketchText key={item} x={x + 18} y={218 + i * 20} size={10} anchor='start' opacity={0.9}>
                    {item}
                </SketchText>
            ))}
            <line x1={x + 14} y1={334} x2={x + 276} y2={334} stroke='currentColor' strokeOpacity={0.25} />
            <SketchText x={x + 145} y={358} size={10} body opacity={0.85}>
                {footer}
            </SketchText>
        </g>
    );
}

function RowStrip({ x, y, n, accent, faded }: { x: number; y: number; n: number; accent?: boolean; faded?: boolean }) {
    return (
        <g>
            {Array.from({ length: n }, (_, i) => (
                <rect
                    key={i}
                    x={x + i * 22}
                    y={y}
                    width={18}
                    height={14}
                    fill={accent ? 'var(--primary)' : 'currentColor'}
                    fillOpacity={faded ? 0.08 : accent ? 0.35 : 0.18}
                    stroke={accent ? 'var(--primary)' : 'currentColor'}
                    strokeOpacity={faded ? 0.2 : 0.5}
                />
            ))}
        </g>
    );
}

/**
 * Every ALTER TABLE action costs one of three things: a change to the catalog
 * only, a full read of the table to prove something, or a full rewrite into a
 * new file. Which one decides whether it takes a millisecond or an hour.
 */
export function AlterWorkDiagram() {
    return (
        <Sketch
            label='Catalog Only, Full Scan, Full Rewrite'
            height={400}
            minWidth={940}
            viewBox='0 0 960 400'
            caption='বাঁ দিকের কাজগুলো শুধু Catalog এ, মানে Table এর বর্ণনায়, একটা লাইন বদলায়: Table এ দশ Row থাকুক বা দশ কোটি, সময় প্রায় শূন্য। মাঝের কাজগুলো একটা কথা প্রমাণ করতে প্রতিটা Row পড়ে, কিছু লেখে না। ডান দিকেরগুলো প্রতিটা Row নতুন একটা File এ আবার লেখে, তাই সময় আর Disk দুটোই লাগে। তালিকার প্রতিটা দাবি এই লেসনের Box এ pg_relation_filenode দিয়ে যাচাই করা।'>
            <WorkColumn
                x={20}
                title='শুধু Catalog'
                sub='Table এর বর্ণনা বদলায়, Data ছোঁয় না'
                items={['ADD COLUMN (Default ছাড়া)', "ADD COLUMN ... DEFAULT 'easy'", 'DROP COLUMN, RENAME', 'SET DEFAULT, DROP DEFAULT', 'varchar(40) থেকে varchar(60)', 'ADD CHECK ... NOT VALID']}
                footer='সময়: Table যত বড়ই হোক, প্রায় সাথে সাথে'>
                <rect x={50} y={88} width={230} height={100} fill='var(--card)' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
                <SketchText x={62} y={106} size={9.5} anchor='start' accent bold>
                    Catalog: alter_customers
                </SketchText>
                <SketchText x={62} y={126} size={9.5} anchor='start' opacity={0.75}>
                    1 customer_id integer
                </SketchText>
                <SketchText x={62} y={144} size={9.5} anchor='start' opacity={0.75}>
                    2 full_name text
                </SketchText>
                <rect x={56} y={152} width={218} height={20} fill='var(--primary)' fillOpacity={0.15} stroke='var(--primary)' strokeWidth='1' />
                <SketchText x={62} y={166} size={9.5} anchor='start' accent bold>
                    6 whatsapp text (নতুন)
                </SketchText>
            </WorkColumn>
            <WorkColumn
                x={335}
                title='পুরো Table পড়া (Scan)'
                sub='প্রতিটা Row দেখে, কিছু লেখে না'
                items={['SET NOT NULL', 'ADD CONSTRAINT ... CHECK', 'ADD FOREIGN KEY', 'VALIDATE CONSTRAINT', 'ADD UNIQUE, ADD PRIMARY KEY', '(শেষেরটা নতুন Index ও বানায়)']}
                footer='সময়: Row সংখ্যার সাথে বাড়ে, Data একই থাকে'>
                <RowStrip x={358} y={100} n={11} />
                <RowStrip x={358} y={124} n={11} />
                <RowStrip x={358} y={148} n={11} />
                <rect x={356} y={96} width={88} height={70} fill='var(--primary)' fillOpacity={0.12} stroke='var(--primary)' strokeWidth='1.2' />
                <SketchText x={400} y={188} size={9.5} body accent>
                    এখানে পর্যন্ত পড়া হয়েছে
                </SketchText>
                <SketchText x={560} y={188} size={9.5} body opacity={0.7}>
                    বাকিটা এখনো বাকি
                </SketchText>
            </WorkColumn>
            <WorkColumn
                x={650}
                title='নতুন করে লেখা (Rewrite)'
                sub='প্রতিটা Row নতুন File এ, পুরনোটা পরে মোছে'
                items={['smallint থেকে integer', 'text থেকে varchar(40)', 'DEFAULT gen_random_uuid()', 'DEFAULT clock_timestamp()', 'USING দিয়ে যেকোনো রূপান্তর', '(Column এর Index ও নতুন করে)']}
                footer='সময় আর Disk: পুরনো File এর সমান আরেকটা'>
                <SketchText x={680} y={98} size={9.5} anchor='start' opacity={0.75}>
                    পুরনো File (16545)
                </SketchText>
                <RowStrip x={680} y={104} n={10} faded />
                <SketchText x={680} y={148} size={9.5} anchor='start' accent bold>
                    নতুন File (16556)
                </SketchText>
                <RowStrip x={680} y={154} n={6} accent />
                <line x1={720} y1={122} x2={720} y2={150} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#alter-work-arrow)' />
                <line x1={790} y1={122} x2={790} y2={150} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#alter-work-arrow)' />
                <SketchText x={800} y={192} size={9.5} body opacity={0.75}>
                    শেষ না হওয়া পর্যন্ত দুটো File ই Disk এ
                </SketchText>
            </WorkColumn>
            <defs>
                <marker id='alter-work-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M0,0 L10,5 L0,10 z' fill='var(--primary)' />
                </marker>
            </defs>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. USING: প্রতিটা Row এর পুরনো মান থেকে নতুন মান                                 */
/* ------------------------------------------------------------------------- */

function ValueCell({ x, y, text, accent, bad }: { x: number; y: number; text: string; accent?: boolean; bad?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={150}
                height={30}
                fill={bad ? 'var(--destructive)' : accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={bad ? 0.08 : accent ? 0.1 : 0}
                stroke={bad ? 'var(--destructive)' : accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={bad ? 0.8 : accent ? 1 : 0.45}
                strokeWidth='1.2'
            />
            <SketchText x={x + 75} y={y + 20} size={11} accent={accent}>
                {text}
            </SketchText>
        </g>
    );
}

/**
 * ALTER COLUMN ... TYPE ... USING runs the USING expression once per row on
 * the old value and stores the result in the new type. One row that cannot be
 * converted stops the whole statement, and nothing changes.
 */
export function UsingFlowDiagram() {
    const rows = [
        { old: "'12,500'", fresh: '12500.00' },
        { old: "'9500'", fresh: '9500.00' },
        { old: "'18,000.50'", fresh: '18000.50' },
    ];
    return (
        <Sketch
            label='ALTER COLUMN TYPE with USING, Row by Row'
            height={330}
            minWidth={920}
            viewBox='0 0 940 330'
            caption='USING এর Expression প্রতিটা Row এর পুরনো মানের উপর একবার চলে, আর যা ফেরত দেয় সেটাই নতুন Type এ জমা হয়। নিচের সারির মতো একটা Row ও যদি রূপান্তর না হয়, পুরো ALTER বাতিল: কোনো Row বদলায় না, Column এর Type ও আগের মতো text থাকে। তাই আগে ভুল Row খুঁজে ঠিক করুন, তারপর ALTER।'>
            <SketchText x={115} y={34} size={10.5} bold>
                price (text)
            </SketchText>
            <SketchText x={470} y={34} size={10.5} bold accent>
                {"USING replace(price, ',', '')::numeric"}
            </SketchText>
            <SketchText x={825} y={34} size={10.5} bold accent>
                price (numeric)
            </SketchText>
            {rows.map((row, i) => {
                const y = 52 + i * 46;
                return (
                    <g key={row.old}>
                        <ValueCell x={40} y={y} text={row.old} />
                        <line x1={196} y1={y + 15} x2={330} y2={y + 15} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#alter-using-arrow)' />
                        <rect x={336} y={y + 2} width={268} height={26} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeOpacity={0.5} strokeDasharray='4 3' />
                        <SketchText x={470} y={y + 20} size={10} body opacity={0.85}>
                            কমা সরানো হয়, তারপর সংখ্যায় রূপান্তর
                        </SketchText>
                        <line x1={608} y1={y + 15} x2={744} y2={y + 15} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#alter-using-arrow)' />
                        <ValueCell x={750} y={y} text={row.fresh} accent />
                    </g>
                );
            })}
            <line x1={30} y1={204} x2={910} y2={204} stroke='currentColor' strokeOpacity={0.25} strokeDasharray='4 4' />
            <ValueCell x={40} y={222} text="'three'" bad />
            <line x1={196} y1={237} x2={330} y2={237} stroke='var(--destructive)' strokeWidth='1.2' markerEnd='url(#alter-using-stop)' />
            <rect x={336} y={222} width={268} height={30} fill='var(--destructive)' fillOpacity={0.06} stroke='var(--destructive)' strokeOpacity={0.7} />
            <SketchText x={470} y={242} size={10}>
                invalid input syntax for type numeric
            </SketchText>
            <SketchText x={760} y={234} size={10.5} anchor='start' bold>
                পুরো ALTER বাতিল
            </SketchText>
            <SketchText x={760} y={252} size={10} anchor='start' body opacity={0.8}>
                কোনো Row বদলায়নি
            </SketchText>
            <SketchText x={470} y={292} size={10.5} body opacity={0.85}>
                একটা ALTER মানে একটা কাজ: হাজার Row এর মধ্যে একটা ভুল থাকলেও আধা বদলানো Table কখনো থাকে না
            </SketchText>
            <defs>
                <marker id='alter-using-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M0,0 L10,5 L0,10 z' fill='var(--primary)' />
                </marker>
                <marker id='alter-using-stop' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M0,0 L10,5 L0,10 z' fill='var(--destructive)' />
                </marker>
            </defs>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. NOT VALID থেকে VALIDATE: চার ধাপের সময়রেখা                                  */
/* ------------------------------------------------------------------------- */

function Station({ x, n, title, lines, accent }: { x: number; n: number; title: string; lines: string[]; accent?: boolean }) {
    return (
        <g>
            <circle cx={x} cy={70} r={14} fill='var(--primary)' fillOpacity={accent ? 0.25 : 0.12} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={x} y={75} size={11} bold accent>
                {String(n)}
            </SketchText>
            <SketchText x={x} y={108} size={10.5} bold>
                {title}
            </SketchText>
            {lines.map((line, i) => (
                <SketchText key={line} x={x} y={130 + i * 17} size={9.5} body opacity={0.8}>
                    {line}
                </SketchText>
            ))}
        </g>
    );
}

/**
 * Adding a constraint to a table that already holds bad rows, without one long
 * blocking scan: add it NOT VALID, find and fix the old rows, then VALIDATE
 * under a lock that lets reads and writes continue.
 */
export function NotValidTimelineDiagram() {
    return (
        <Sketch
            label='NOT VALID Now, VALIDATE Later'
            height={300}
            minWidth={920}
            viewBox='0 0 940 300'
            caption='ধাপ ১ এর পর থেকেই নতুন আর বদলানো প্রতিটা Row পাহারায় থাকে, শুধু পুরনো Row গুলো তখনো পরীক্ষা হয়নি। ধাপ ২ আর ৩ এ সেগুলো খুঁজে ঠিক করা হয়, যত সময় লাগুক। ধাপ ৪ পুরো Table পড়ে, কিন্তু এমন Lock নিয়ে যেটা SELECT, INSERT, UPDATE, DELETE কাউকে থামায় না। এই Lock এর নামগুলো এই লেসনের Box এ pg_locks থেকে পড়া।'>
            <line x1={110} y1={70} x2={830} y2={70} stroke='currentColor' strokeOpacity={0.35} strokeWidth='1.5' />
            <Station x={110} n={1} title='ADD ... NOT VALID' lines={['নতুন Row এখন থেকেই পাহারায়', 'পুরনো Row পরীক্ষা হয়নি', 'convalidated = false']} accent />
            <Station x={350} n={2} title='পুরনো ভুল খুঁজুন' lines={['WHERE NOT (শর্ত)', 'কয়টা, কোনগুলো, কেন', 'কিছু বদলায় না']} />
            <Station x={590} n={3} title='ঠিক করুন' lines={['UPDATE দিয়ে মান ঠিক', 'বড় Table এ ছোট ছোট ভাগে', 'সাইট চালু থাকে']} />
            <Station x={830} n={4} title='VALIDATE CONSTRAINT' lines={['পুরো Table একবার পড়ে', 'ভুল পেলে Error, কিছু বদলায় না', 'convalidated = true']} accent />
            <rect x={60} y={200} width={100} height={30} fill='var(--destructive)' fillOpacity={0.08} stroke='var(--destructive)' strokeOpacity={0.6} />
            <SketchText x={110} y={213} size={9}>
                AccessExclusive
            </SketchText>
            <SketchText x={110} y={225} size={9} body opacity={0.8}>
                এক মুহূর্তের জন্য
            </SketchText>
            <rect x={170} y={200} width={560} height={30} fill='transparent' stroke='currentColor' strokeOpacity={0.3} strokeDasharray='4 3' />
            <SketchText x={450} y={220} size={10} body opacity={0.8}>
                কোনো বিশেষ Lock নেই, শুধু সাধারণ UPDATE এর Row Lock
            </SketchText>
            <rect x={740} y={200} width={180} height={30} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeOpacity={0.7} />
            <SketchText x={830} y={213} size={9} accent>
                ShareUpdateExclusive
            </SketchText>
            <SketchText x={830} y={225} size={9} body opacity={0.8}>
                পড়া আর লেখা চলতে থাকে
            </SketchText>
            <SketchText x={470} y={268} size={10.5} body opacity={0.85}>
                একসাথে ADD CHECK লিখলে এই চার ধাপ একটা লম্বা AccessExclusive এর ভেতরে হতো, পুরো সময় সাইট আটকে
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. RENAME: কী সঙ্গে যায়, কী পুরনো নামে থেকে যায়                                   */
/* ------------------------------------------------------------------------- */

function SideItem({ x, y, title, sub, accent }: { x: number; y: number; title: string; sub: string; accent?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={250}
                height={40}
                fill={accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.08 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.8 : 0.45}
                strokeWidth='1.2'
            />
            <SketchText x={x + 12} y={y + 17} size={10} anchor='start' bold accent={accent}>
                {title}
            </SketchText>
            <SketchText x={x + 12} y={y + 32} size={9.5} anchor='start' body opacity={0.8}>
                {sub}
            </SketchText>
        </g>
    );
}

/**
 * PostgreSQL knows its objects by an internal number (OID), not by name, so a
 * rename carries every dependent object along. Names derived from the old name,
 * and every piece of code outside the database, are left behind.
 */
export function RenameFollowsDiagram() {
    const follows = [
        { title: 'View: alter_trip_list', sub: 'নতুন নাম দেখায়, চলতেই থাকে' },
        { title: 'Foreign Key', sub: 'অন্য Table এর সম্পর্ক অটুট' },
        { title: 'Index আর Constraint', sub: 'কাজ করে আগের মতোই' },
        { title: 'Identity, Trigger, Grant', sub: 'সব Table এর সাথে বাঁধা' },
    ];
    const stays = [
        { title: 'alter_trips_pkey', sub: 'Index আর Constraint এর নাম' },
        { title: 'alter_trips_trip_id_seq', sub: 'Sequence এর নাম' },
        { title: 'App এর SQL', sub: "FROM alter_trips: relation does not exist" },
        { title: 'Report, Script, Cron Job', sub: 'Database এর বাইরে, কেউ জানায় না' },
    ];
    return (
        <Sketch
            label='What a Rename Carries Along'
            height={330}
            minWidth={920}
            viewBox='0 0 940 330'
            caption='PostgreSQL ভেতরে প্রতিটা জিনিস চেনে একটা নম্বর দিয়ে (OID), নাম দিয়ে না। তাই Table এর নাম বদলালে View, Foreign Key, Index সবাই সাথে সাথে নতুন নাম ধরে নেয়। কিন্তু পুরনো নাম থেকে বানানো নামগুলো নিজে বদলায় না, আর Database এর বাইরের কোড তো জানেই না। বাঁ দিকের সব এই লেসনের Box এ দেখানো, ডান দিকের প্রথম দুটোও।'>
            <rect x={340} y={110} width={260} height={100} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.4' />
            <SketchText x={470} y={138} size={11} opacity={0.7}>
                alter_trips
            </SketchText>
            <SketchText x={470} y={160} size={12} bold accent>
                alter_tour_plans
            </SketchText>
            <SketchText x={470} y={186} size={9.5} body opacity={0.8}>
                OID একই থাকে, শুধু নাম বদলায়
            </SketchText>
            <SketchText x={155} y={34} size={11} bold accent>
                নিজে থেকে সঙ্গে যায়
            </SketchText>
            <SketchText x={785} y={34} size={11} bold>
                পুরনো নামেই থেকে যায়
            </SketchText>
            {follows.map((item, i) => (
                <g key={item.title}>
                    <SideItem x={30} y={50 + i * 66} title={item.title} sub={item.sub} accent />
                    <line x1={280} y1={70 + i * 66} x2={338} y2={160} stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1' />
                </g>
            ))}
            {stays.map((item, i) => (
                <g key={item.title}>
                    <SideItem x={660} y={50 + i * 66} title={item.title} sub={item.sub} />
                    <line x1={602} y1={160} x2={658} y2={70 + i * 66} stroke='currentColor' strokeOpacity={0.35} strokeWidth='1' strokeDasharray='4 3' />
                </g>
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 6. Expand and Contract: চালু সাইটে Column এর নাম বদলানোর নিরাপদ পথ                */
/* ------------------------------------------------------------------------- */

function Phase({ x, n, title, db, code, accent }: { x: number; n: number; title: string; db: string[]; code: string[]; accent?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={40}
                width={205}
                height={220}
                fill={accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.05 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.8 : 0.4}
                strokeWidth='1.2'
            />
            <SketchText x={x + 102} y={64} size={11.5} bold accent>
                {`${n}. ${title}`}
            </SketchText>
            <SketchText x={x + 14} y={92} size={9.5} anchor='start' bold opacity={0.9}>
                Database এ
            </SketchText>
            {db.map((line, i) => (
                <SketchText key={line} x={x + 14} y={110 + i * 16} size={9.5} anchor='start' opacity={0.85}>
                    {line}
                </SketchText>
            ))}
            <line x1={x + 12} y1={160} x2={x + 193} y2={160} stroke='currentColor' strokeOpacity={0.2} />
            <SketchText x={x + 14} y={182} size={9.5} anchor='start' bold opacity={0.9}>
                App এর কোডে
            </SketchText>
            {code.map((line, i) => (
                <SketchText key={line} x={x + 14} y={200 + i * 17} size={9.5} anchor='start' body opacity={0.85}>
                    {line}
                </SketchText>
            ))}
        </g>
    );
}

/**
 * Renaming phone to mobile on a live site in four deploys, so that at no
 * moment does running code ask for a column that is not there. Module 17 owns
 * the full migration story; this is the shape of it.
 */
export function ExpandContractDiagram() {
    return (
        <Sketch
            label='Expand and Contract: Renaming a Live Column'
            height={300}
            minWidth={920}
            viewBox='0 0 940 300'
            caption={
                <>
                    এক লাইনের RENAME COLUMN চালু সাইটে বিপদ, কারণ যে মুহূর্তে নাম বদলায়, তখনো চালু পুরনো কোড পুরনো নাম খোঁজে।
                    এই চার ধাপে কোনো মুহূর্তেই কোড এমন Column চায় না যেটা নেই। ধাপগুলোর মাঝে দিন বা সপ্তাহ পার হতে পারে। পুরো গল্পটা,
                    Migration Tool সহ, আছে Module 17 এর{' '}
                    <Link href='/sql/topic/migrations' className='text-primary underline underline-offset-4'>
                        Migrations and Zero-downtime Schema Changes
                    </Link>{' '}
                    লেসনে।
                </>
            }>
            <Phase x={20} n={1} title='Expand' db={['ADD COLUMN mobile text', 'phone আগের মতোই আছে']} code={['phone পড়ে', 'phone আর mobile', 'দুটোতেই লেখে']} accent />
            <Phase x={250} n={2} title='Backfill' db={['UPDATE ... SET mobile = phone', 'পুরনো Row গুলো ভরা']} code={['আগের মতোই', 'দুটোতে লেখা চলছে']} />
            <Phase x={480} n={3} title='Switch' db={['কিছু বদলায় না']} code={['এখন mobile পড়ে', 'phone আর ছোঁয় না']} />
            <Phase x={710} n={4} title='Contract' db={['DROP COLUMN phone', 'পুরনো নাম বিদায়']} code={['শুধু mobile']} accent />
            <line x1={225} y1={150} x2={248} y2={150} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#alter-expand-arrow)' />
            <line x1={455} y1={150} x2={478} y2={150} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#alter-expand-arrow)' />
            <line x1={685} y1={150} x2={708} y2={150} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#alter-expand-arrow)' />
            <SketchText x={470} y={286} size={10} body opacity={0.8}>
                প্রতিটা তীর একটা আলাদা Deploy: Database আর কোড কখনো একে অপরের অপেক্ষায় ভাঙে না
            </SketchText>
            <defs>
                <marker id='alter-expand-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M0,0 L10,5 L0,10 z' fill='var(--primary)' />
                </marker>
            </defs>
        </Sketch>
    );
}
