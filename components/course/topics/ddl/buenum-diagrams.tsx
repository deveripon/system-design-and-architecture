import { Sketch, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. boolean এর তিন অবস্থা, আর কোন লেখা কোথায় যায়                                  */
/* ------------------------------------------------------------------------- */

function Chip({ x, y, w = 58, children, accent, dim }: { x: number; y: number; w?: number; children: string; accent?: boolean; dim?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={24}
                rx={3}
                fill={accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.1 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={dim ? 0.3 : 0.55}
                strokeWidth='1.1'
                strokeDasharray={dim ? '3 3' : undefined}
            />
            <SketchText x={x + w / 2} y={y + 16} size={11} accent={accent} opacity={dim ? 0.7 : 1}>
                {children}
            </SketchText>
        </g>
    );
}

/**
 * Every spelling PostgreSQL accepts for true and for false, the third state
 * NULL, the only two things psql ever prints back (t and f), and the strings
 * that are rejected with error 22P02. All of it checked on PostgreSQL 18.
 */
export function BooleanStatesDiagram() {
    const trueInputs = ['true', 'yes', 'on', '1', 't', 'y'];
    const falseInputs = ['false', 'no', 'off', '0', 'f', 'n'];
    const rejected = ["'o'", "'2'", "'yess'", "'01'", "''", "'null'"];
    return (
        <Sketch
            label='Three States of boolean'
            height={420}
            minWidth={920}
            viewBox='0 0 940 420'
            caption='বাঁ দিকে যা লিখে পাঠানো যায়, ডান দিকে PostgreSQL যা জমা রাখে আর ফেরত দেখায়। বড় হাতের বা ছোট হাতের অক্ষর, আগে পরে ফাঁকা জায়গা, কিছুতেই কিছু বদলায় না। শব্দের শুরুর অংশও চলে, যদি সেই অংশ থেকে একটাই শব্দ বোঝা যায় (tr মানে true, of মানে off)। নিচের সারির লেখাগুলো কোনো অবস্থাতেই পড়ে না, তাই সরাসরি Error 22P02।'>
            <defs>
                <marker id='buenum-bool-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M 0 0 L 10 5 L 0 10 z' fill='var(--primary)' />
                </marker>
            </defs>

            <SketchText x={200} y={30} size={11} bold>
                আপনি যা লেখেন (Input)
            </SketchText>
            <SketchText x={780} y={30} size={11} bold>
                যা জমা থাকে, যা দেখায় (Output)
            </SketchText>

            {/* true row */}
            <rect x={20} y={50} width={400} height={74} fill='none' stroke='currentColor' strokeOpacity={0.3} />
            {trueInputs.map((v, i) => (
                <Chip key={v} x={34 + i * 63} y={62} accent>
                    {v}
                </Chip>
            ))}
            <SketchText x={34} y={112} size={10} anchor='start' body opacity={0.8}>
                শুরুর অংশও চলে: tr, ye, TRUE, &apos; Yes &apos;
            </SketchText>
            <line x1={430} y1={87} x2={650} y2={87} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#buenum-bool-arrow)' />
            <rect x={660} y={60} width={240} height={54} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={700} y={93} size={22} bold accent>
                t
            </SketchText>
            <SketchText x={800} y={84} size={11} bold accent>
                true
            </SketchText>
            <SketchText x={800} y={100} size={10} body opacity={0.85}>
                সত্য, ১ Byte
            </SketchText>

            {/* false row */}
            <rect x={20} y={140} width={400} height={74} fill='none' stroke='currentColor' strokeOpacity={0.3} />
            {falseInputs.map((v, i) => (
                <Chip key={v} x={34 + i * 63} y={152}>
                    {v}
                </Chip>
            ))}
            <SketchText x={34} y={202} size={10} anchor='start' body opacity={0.8}>
                শুরুর অংশও চলে: of, nO, FALSE, &apos; f &apos;
            </SketchText>
            <line x1={430} y1={177} x2={650} y2={177} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.4' markerEnd='url(#buenum-bool-arrow)' />
            <rect x={660} y={150} width={240} height={54} fill='none' stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            <SketchText x={700} y={183} size={22} bold>
                f
            </SketchText>
            <SketchText x={800} y={174} size={11} bold>
                false
            </SketchText>
            <SketchText x={800} y={190} size={10} body opacity={0.85}>
                মিথ্যা, ১ Byte
            </SketchText>

            {/* NULL row */}
            <rect x={20} y={230} width={400} height={60} fill='none' stroke='currentColor' strokeOpacity={0.3} strokeDasharray='4 3' />
            <Chip x={34} y={248} w={70} dim>
                NULL
            </Chip>
            <SketchText x={118} y={264} size={10} anchor='start' body opacity={0.85}>
                কিছুই জানা নেই, অথবা লেখাই হয়নি
            </SketchText>
            <line x1={430} y1={260} x2={650} y2={260} stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.4' strokeDasharray='4 3' markerEnd='url(#buenum-bool-arrow)' />
            <rect x={660} y={236} width={240} height={50} fill='none' stroke='currentColor' strokeOpacity={0.4} strokeDasharray='4 3' />
            <SketchText x={700} y={266} size={12} opacity={0.7}>
                (ফাঁকা)
            </SketchText>
            <SketchText x={800} y={258} size={11} bold>
                unknown
            </SketchText>
            <SketchText x={800} y={274} size={10} body opacity={0.85}>
                তৃতীয় অবস্থা
            </SketchText>

            {/* rejected */}
            <rect x={20} y={318} width={880} height={80} fill='none' stroke='currentColor' strokeOpacity={0.3} />
            <SketchText x={34} y={340} size={10.5} anchor='start' bold>
                এগুলো বাতিল, সাথে সাথে ERROR: invalid input syntax for type boolean (22P02)
            </SketchText>
            {rejected.map((v, i) => (
                <Chip key={v} x={34 + i * 76} y={354} w={66} dim>
                    {v}
                </Chip>
            ))}
            <SketchText x={500} y={366} size={10} anchor='start' body opacity={0.85}>
                &apos;o&apos; থেকে on আর off দুটোই হতে পারে, তাই অস্পষ্ট।
            </SketchText>
            <SketchText x={500} y={382} size={10} anchor='start' body opacity={0.85}>
                হ্যাঁ, null বা 2 লেখাও চলে না: তালিকার বাইরের কোনো শব্দ নয়।
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা UUID এর ভেতরে কী আছে                                                   */
/* ------------------------------------------------------------------------- */

function HexGroups({
    y,
    groups,
    versionAt,
    variantAt,
    timeGroups,
}: {
    y: number;
    groups: string[];
    /** Index of the group whose first digit is the version. */
    versionAt: number;
    variantAt: number;
    /** How many leading groups carry the timestamp (v7 only). */
    timeGroups: number;
}) {
    const charW = 18;
    let x = 40;
    const cells: React.ReactNode[] = [];
    groups.forEach((g, gi) => {
        g.split('').forEach((ch, ci) => {
            const isVersion = gi === versionAt && ci === 0;
            const isVariant = gi === variantAt && ci === 0;
            const isTime = gi < timeGroups;
            cells.push(
                <g key={`${gi}-${ci}`}>
                    <rect
                        x={x}
                        y={y}
                        width={charW - 1}
                        height={30}
                        fill={isVersion || isVariant ? 'var(--primary)' : isTime ? 'var(--primary)' : 'transparent'}
                        fillOpacity={isVersion || isVariant ? 0.28 : isTime ? 0.08 : 0}
                        stroke={isVersion || isVariant ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={isVersion || isVariant ? 1 : 0.25}
                        strokeWidth='1'
                    />
                    <SketchText x={x + (charW - 1) / 2} y={y + 20} size={13} bold={isVersion || isVariant} accent={isVersion || isVariant}>
                        {ch}
                    </SketchText>
                </g>
            );
            x += charW;
        });
        if (gi < groups.length - 1) {
            cells.push(
                <SketchText key={`dash-${gi}`} x={x + 6} y={y + 20} size={13} opacity={0.6}>
                    -
                </SketchText>
            );
            x += 13;
        }
    });
    return <g>{cells}</g>;
}

/**
 * A real version 4 and a real version 7 value from PostgreSQL 18, digit by
 * digit: the 8-4-4-4-12 grouping, the version digit, the variant digit, and in
 * v7 the first 48 bits that hold the creation time in milliseconds.
 */
export function UuidAnatomyDiagram() {
    return (
        <Sketch
            label='Anatomy of a UUID'
            height={436}
            minWidth={920}
            viewBox='0 0 940 436'
            caption='দুটো মানই PostgreSQL 18 এ তৈরি করা আসল UUID। ৩২টা Hex অঙ্ক, মানে ১২৮ Bit, ৮-৪-৪-৪-১২ ভাগে, মাঝে হাইফেন। তৃতীয় ভাগের প্রথম অঙ্ক Version বলে (4 বা 7), চতুর্থ ভাগের প্রথম অঙ্ক Variant (8, 9, a বা b)। v4 এর বাকি প্রায় সবটাই এলোমেলো। v7 এর প্রথম ১২টা অঙ্ক তৈরির মুহূর্ত, 1970 থেকে গোনা মিলিসেকেন্ডে, তাই uuid_extract_timestamp() সেটা ফিরিয়ে দিতে পারে।'>
            <defs>
                <marker id='buenum-uuid-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'>
                    <path d='M 0 0 L 10 5 L 0 10 z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* v4 */}
            <SketchText x={40} y={34} size={11.5} anchor='start' bold accent>
                gen_random_uuid() বা uuidv4(): Version 4
            </SketchText>
            <HexGroups y={48} groups={['a69655ac', 'fb1c', '4f2d', '9860', 'ec3bd1265430']} versionAt={2} variantAt={3} timeGroups={0} />
            <line x1={290} y1={84} x2={290} y2={106} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#buenum-uuid-arrow)' />
            <SketchText x={290} y={122} size={10.5} bold accent>
                Version 4
            </SketchText>
            <line x1={376} y1={84} x2={410} y2={106} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#buenum-uuid-arrow)' />
            <SketchText x={420} y={122} size={10.5} bold accent>
                Variant
            </SketchText>
            <SketchText x={500} y={122} size={10.5} anchor='start' body opacity={0.85}>
                বাকি ১২২ Bit পুরো এলোমেলো
            </SketchText>
            <SketchText x={40} y={150} size={10.5} anchor='start' body opacity={0.85}>
                পরপর দুটো v4 এর মধ্যে কোনো সম্পর্ক নেই। কোনটা আগে তৈরি, মান দেখে বলা যায় না, আর সাজালে তৈরির ক্রম হারিয়ে যায়।
            </SketchText>

            <line x1={20} y1={176} x2={920} y2={176} stroke='currentColor' strokeOpacity={0.2} strokeDasharray='4 4' />

            {/* v7 */}
            <SketchText x={40} y={210} size={11.5} anchor='start' bold accent>
                uuidv7(): Version 7, PostgreSQL 18 থেকে
            </SketchText>
            <HexGroups y={224} groups={['01a14992', '63d6', '75d9', 'b2d2', '4004355f555e']} versionAt={2} variantAt={3} timeGroups={2} />
            <path d='M 40 260 L 40 270 L 269 270 L 269 260' fill='none' stroke='var(--primary)' strokeWidth='1.2' />
            <line x1={154} y1={270} x2={154} y2={296} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#buenum-uuid-arrow)' />
            <SketchText x={40} y={318} size={10.5} anchor='start' bold accent>
                প্রথম ৪৮ Bit: 0x01a1499263d6
            </SketchText>
            <SketchText x={40} y={336} size={10.5} anchor='start' body opacity={0.85}>
                = 1792235693014 মিলিসেকেন্ড
            </SketchText>
            <SketchText x={40} y={352} size={10.5} anchor='start' body opacity={0.85}>
                = 2026-10-17 17:14:53.014, ঢাকার সময়
            </SketchText>
            <line x1={290} y1={260} x2={400} y2={300} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#buenum-uuid-arrow)' />
            <SketchText x={410} y={318} size={10.5} anchor='start' bold accent>
                Version 7
            </SketchText>
            <SketchText x={410} y={336} size={10.5} anchor='start' body opacity={0.85}>
                পরের তিন অঙ্কে মিলিসেকেন্ডের ভগ্নাংশ
            </SketchText>
            <line x1={376} y1={260} x2={650} y2={300} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#buenum-uuid-arrow)' />
            <SketchText x={660} y={318} size={10.5} anchor='start' bold accent>
                Variant, তারপর এলোমেলো
            </SketchText>
            <SketchText x={660} y={336} size={10.5} anchor='start' body opacity={0.85}>
                একই মুহূর্তের দুটো মানও আলাদা
            </SketchText>
            <rect x={40} y={368} width={860} height={48} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeOpacity={0.4} />
            <SketchText x={60} y={389} size={10.5} anchor='start' body>
                সময় সামনে বলে v7 গুলো সাজালে তৈরির ক্রমেই সাজে। দামটাও এখানে: মান দেখেই যে কেউ জেনে যায় কবে তৈরি হয়েছে।
            </SketchText>
            <SketchText x={60} y={406} size={10.5} anchor='start' body opacity={0.85}>
                uuid_extract_timestamp(&apos;01a14992-63d6-75d9-b2d2-4004355f555e&apos;) চালালে ঠিক এই সময়টাই ফেরত আসে।
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. ক্রমিক নম্বর বনাম UUID, একটা Link এ                                            */
/* ------------------------------------------------------------------------- */

/**
 * Why a ticket link built from a sequential number invites guessing, and why a
 * random UUID makes guessing hopeless without being a lock: the server must
 * still check who is asking.
 */
export function GuessableIdDiagram() {
    return (
        <Sketch
            label='Guessable Number vs UUID in a Link'
            height={330}
            minWidth={920}
            viewBox='0 0 940 330'
            caption='ক্রমিক নম্বরে পরের নম্বরটা আন্দাজ করা খেলার মতো সহজ। এলোমেলো UUID এ পাশের কোনো মান নেই, ১২২ Bit এর মধ্যে আন্দাজে ঠিকটা পাওয়ার আশা কার্যত শূন্য। তবে UUID তালা নয়: Link কারও হাতে পৌঁছালে তিনি খুলতে পারবেন। তাই Server কে সবসময় দেখতে হয় যিনি চাইছেন, Ticket টা আসলে তাঁর কিনা।'>
            <defs>
                <marker id='buenum-guess-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M 0 0 L 10 5 L 0 10 z' fill='currentColor' />
                </marker>
            </defs>

            {/* sequential */}
            <rect x={20} y={20} width={430} height={290} fill='none' stroke='currentColor' strokeOpacity={0.35} />
            <SketchText x={235} y={44} size={11.5} bold>
                ক্রমিক নম্বর: ticket_no integer
            </SketchText>
            {[4, 5, 6].map((n, i) => (
                <g key={n}>
                    <rect
                        x={44}
                        y={66 + i * 62}
                        width={382}
                        height={40}
                        fill={i === 0 ? 'var(--primary)' : 'transparent'}
                        fillOpacity={i === 0 ? 0.1 : 0}
                        stroke={i === 0 ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={i === 0 ? 1 : 0.45}
                    />
                    <SketchText x={60} y={91 + i * 62} size={11.5} anchor='start' accent={i === 0}>
                        {`islandtours.example/ticket/${n}`}
                    </SketchText>
                    <SketchText x={410} y={91 + i * 62} size={10} anchor='end' body opacity={0.85}>
                        {i === 0 ? 'ফারহানার নিজের' : 'অন্য কারও'}
                    </SketchText>
                </g>
            ))}
            <line x1={30} y1={106} x2={30} y2={170} stroke='currentColor' strokeOpacity={0.6} markerEnd='url(#buenum-guess-arrow)' />
            <line x1={30} y1={168} x2={30} y2={232} stroke='currentColor' strokeOpacity={0.6} markerEnd='url(#buenum-guess-arrow)' />
            <SketchText x={235} y={276} size={10.5} body>
                শেষের সংখ্যায় এক যোগ করলেই পরের জনের Ticket
            </SketchText>
            <SketchText x={235} y={294} size={10.5} body opacity={0.8}>
                মোট কত Ticket বিক্রি হলো, সেটাও নম্বর দেখে আন্দাজ করা যায়
            </SketchText>

            {/* uuid */}
            <rect x={490} y={20} width={430} height={290} fill='var(--primary)' fillOpacity={0.04} stroke='var(--primary)' strokeOpacity={0.5} />
            <SketchText x={705} y={44} size={11.5} bold accent>
                UUID: ticket_ref uuid
            </SketchText>
            <rect x={514} y={66} width={382} height={40} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' />
            <SketchText x={528} y={84} size={10.5} anchor='start' accent>
                islandtours.example/ticket/
            </SketchText>
            <SketchText x={528} y={99} size={10.5} anchor='start' accent>
                a69655ac-fb1c-4f2d-9860-ec3bd1265430
            </SketchText>
            <SketchText x={705} y={140} size={10.5} body>
                পাশের মান বলে কিছু নেই। একটা অঙ্ক বদলালে
            </SketchText>
            <SketchText x={705} y={158} size={10.5} body>
                সেটা প্রায় নিশ্চিতভাবে কারও Ticket না।
            </SketchText>
            <rect x={514} y={180} width={382} height={50} fill='none' stroke='currentColor' strokeOpacity={0.4} strokeDasharray='4 3' />
            <SketchText x={705} y={201} size={10.5} body>
                v4 এ এলোমেলো অংশ ১২২ Bit, সম্ভাব্য মান
            </SketchText>
            <SketchText x={705} y={219} size={10.5} body>
                এত বেশি যে আন্দাজে খোঁজা অর্থহীন
            </SketchText>
            <SketchText x={705} y={262} size={10.5} body bold accent>
                তবু তালা নয়: Server দেখবে Ticket কার
            </SketchText>
            <SketchText x={705} y={282} size={10.5} body opacity={0.8}>
                UUID আন্দাজ ঠেকায়, অনুমতি যাচাই করে না
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. একই নিয়মের তিন ঠিকানা: enum, CHECK, Lookup Table                              */
/* ------------------------------------------------------------------------- */

function Column({
    x,
    title,
    sub,
    lines,
    store,
    reject,
}: {
    x: number;
    title: string;
    sub: string;
    lines: string[];
    store: string;
    reject: string;
}) {
    return (
        <g>
            <rect x={x} y={20} width={290} height={344} fill='none' stroke='currentColor' strokeOpacity={0.35} />
            <rect x={x} y={20} width={290} height={46} fill='var(--primary)' fillOpacity={0.1} />
            <SketchText x={x + 145} y={40} size={12} bold accent>
                {title}
            </SketchText>
            <SketchText x={x + 145} y={58} size={10} body opacity={0.85}>
                {sub}
            </SketchText>
            <SketchText x={x + 16} y={92} size={10} anchor='start' body bold>
                তালিকাটা কোথায় থাকে
            </SketchText>
            <rect x={x + 16} y={102} width={258} height={118} fill='var(--card)' stroke='currentColor' strokeOpacity={0.3} />
            {lines.map((l, i) => (
                <SketchText key={l} x={x + 26} y={122 + i * 18} size={10.5} anchor='start' accent={i === 0}>
                    {l}
                </SketchText>
            ))}
            <SketchText x={x + 16} y={248} size={10} anchor='start' body bold>
                Column এ কী জমা হয়
            </SketchText>
            <SketchText x={x + 16} y={268} size={10.5} anchor='start' body opacity={0.9}>
                {store}
            </SketchText>
            <SketchText x={x + 16} y={304} size={10} anchor='start' body bold>
                confirmd লিখলে
            </SketchText>
            <rect x={x + 16} y={314} width={258} height={30} fill='none' stroke='currentColor' strokeOpacity={0.35} strokeDasharray='3 3' />
            <SketchText x={x + 26} y={334} size={10.5} anchor='start'>
                {reject}
            </SketchText>
        </g>
    );
}

/**
 * The same rule (a booking status is pending, confirmed or cancelled) kept in
 * three different places: inside a type, inside the table, or as rows of a
 * second table. Each one rejects a typo, each with its own error code.
 */
export function ThreeWaysDiagram() {
    return (
        <Sketch
            label='One Rule, Three Homes'
            height={430}
            minWidth={920}
            viewBox='0 0 940 430'
            caption='একই নিয়ম, তিনটা ঠিকানা। enum এ তালিকা থাকে একটা Type এর ভেতরে, Database এর Catalog এ, আর যত Table চায় সবাই সেই Type ব্যবহার করতে পারে। CHECK এ তালিকা থাকে Table এর নিজের ভেতরে, Island Tours এর bookings ঠিক এভাবেই বানানো। Lookup Table এ তালিকা নিজেই Data, আলাদা একটা Table এর Row, আর নতুন মান যোগ করা মানে শুধু একটা INSERT। তিনটাই ভুল বানান আটকায়, তিনটা আলাদা Error দিয়ে।'>
            <Column
                x={20}
                title='enum Type'
                sub='CREATE TYPE ... AS ENUM'
                lines={['buenum_status (Type)', "1  'pending'", "2  'confirmed'", "3  'cancelled'", 'pg_enum Catalog এ জমা']}
                store='৪ Byte এর একটা ইশারা, ক্রম সহ'
                reject='22P02 invalid input value for enum'
            />
            <Column
                x={325}
                title='CHECK Constraint'
                sub='text + CHECK (status IN (...))'
                lines={['bookings (Table)', 'CHECK (status IN (', "  'pending', 'confirmed',", "  'cancelled'))", 'Table এর সংজ্ঞায় লেখা']}
                store='সাধারণ text, লেখাটা হুবহু'
                reject='23514 violates check constraint'
            />
            <Column
                x={630}
                title='Lookup Table'
                sub='text + REFERENCES another table'
                lines={['buenum_statuses (Table)', 'pending    | পেমেন্টের অপেক্ষায়', 'confirmed  | নিশ্চিত', 'cancelled  | বাতিল', 'তালিকাটা নিজেই Data']}
                store='code লেখা, যা অন্য Table এ খোঁজা হয়'
                reject='23503 violates foreign key'
            />
            <SketchText x={470} y={400} size={10.5} body opacity={0.85}>
                নতুন মান যোগ: enum এ ALTER TYPE, CHECK এ Constraint বদল (Lesson 10), Lookup Table এ শুধু একটা INSERT
            </SketchText>
        </Sketch>
    );
}
