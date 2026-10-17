import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. একই 'CXB', তিনটা Type এ                                                   */
/* ------------------------------------------------------------------------- */

const CELL = 46;

function Cell({ x, y, ch, pad, dim }: { x: number; y: number; ch: string; pad?: boolean; dim?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                fill={pad ? 'transparent' : 'var(--primary)'}
                fillOpacity={pad ? 0 : 0.1}
                stroke={pad ? 'currentColor' : 'var(--primary)'}
                strokeOpacity={pad ? 0.5 : 1}
                strokeDasharray={pad ? '4 3' : undefined}
                strokeWidth='1.2'
            />
            <SketchText x={x + CELL / 2} y={y + CELL / 2 + 6} size={16} bold={!pad} accent={!pad} opacity={dim ? 0.55 : 1}>
                {ch}
            </SketchText>
        </g>
    );
}

function TypeRow({
    y,
    type,
    cells,
    pads,
    limitAt,
    open,
    note,
    sub,
}: {
    y: number;
    type: string;
    cells: string[];
    pads: number;
    limitAt?: number;
    open?: boolean;
    note: string;
    sub: string;
}) {
    const x0 = 190;
    const end = x0 + (cells.length + pads) * CELL;
    return (
        <g>
            <SketchText x={30} y={y + 22} size={13} anchor='start' bold>
                {type}
            </SketchText>
            <SketchText x={30} y={y + 40} size={10} anchor='start' opacity={0.7}>
                {sub}
            </SketchText>
            {cells.map((ch, i) => (
                <Cell key={`c${i}`} x={x0 + i * CELL} y={y} ch={ch} />
            ))}
            {Array.from({ length: pads }, (_, i) => (
                <Cell key={`p${i}`} x={x0 + (cells.length + i) * CELL} y={y} ch='␣' pad dim />
            ))}
            {limitAt !== undefined && (
                <g>
                    <line
                        x1={x0 + limitAt * CELL}
                        y1={y - 8}
                        x2={x0 + limitAt * CELL}
                        y2={y + CELL + 8}
                        stroke='currentColor'
                        strokeOpacity={0.6}
                        strokeWidth='1.4'
                        strokeDasharray='5 4'
                    />
                    <SketchText x={x0 + limitAt * CELL + 6} y={y - 10} size={9.5} anchor='start' opacity={0.75}>
                        সীমা: 5
                    </SketchText>
                </g>
            )}
            {open && (
                <g>
                    <line x1={end + 6} y1={y + CELL / 2} x2={end + 120} y2={y + CELL / 2} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' strokeDasharray='2 5' />
                    <SketchText x={end + 6} y={y - 10} size={9.5} anchor='start' opacity={0.75}>
                        সীমা নেই, প্রায় 1 GB পর্যন্ত
                    </SketchText>
                </g>
            )}
            <SketchText x={560} y={y + 20} size={11} anchor='start' body>
                {note}
            </SketchText>
        </g>
    );
}

/**
 * The value 'CXB' stored three times: char(5) fills the two missing places
 * with spaces, varchar(5) keeps exactly what came in but refuses a sixth
 * character, text keeps what came in with no declared ceiling at all.
 */
export function TextTypesDiagram() {
    return (
        <Sketch
            label="One Value, Three Types"
            height={330}
            minWidth={900}
            viewBox='0 0 940 330'
            caption={
                <>
                    একই &apos;CXB&apos; তিনটা Column এ। char(5) বাকি দুই ঘর Space দিয়ে ভরে রাখে, তাই Disk এ সবসময় পাঁচ অক্ষর।
                    varchar(5) যা এসেছে ঠিক তাই রাখে, তবে ছয় নম্বর অক্ষর এলে Error। text ও যা এসেছে তাই রাখে, কোনো ঘোষিত সীমা
                    ছাড়া। ডট দেওয়া ঘরগুলো Space, চোখে দেখা যায় না, কিন্তু আছে।
                </>
            }>
            <TypeRow y={46} type='char(5)' sub='character(5)' cells={['C', 'X', 'B']} pads={2} note='সবসময় ঠিক ৫ অক্ষর, খালি ঘরে Space' />
            <TypeRow y={146} type='varchar(5)' sub='character varying(5)' cells={['C', 'X', 'B']} pads={0} limitAt={5} note='যা এসেছে তাই, ৫ এর বেশি হলে Error' />
            <TypeRow y={246} type='text' sub='text' cells={['C', 'X', 'B']} pads={0} open note='যা এসেছে তাই, কোনো ঘোষিত সীমা নেই' />
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. যা দেখেন, Code Point, আর Byte                                              */
/* ------------------------------------------------------------------------- */

interface Point {
    glyph: string;
    code: string;
    bytes: string;
}

const WORDS: { seen: string; label: string; points: Point[] }[] = [
    {
        seen: 'Dhaka',
        label: 'ইংরেজি, ৫ অক্ষর',
        points: [
            { glyph: 'D', code: 'U+0044', bytes: '44' },
            { glyph: 'h', code: 'U+0068', bytes: '68' },
            { glyph: 'a', code: 'U+0061', bytes: '61' },
            { glyph: 'k', code: 'U+006B', bytes: '6B' },
            { glyph: 'a', code: 'U+0061', bytes: '61' },
        ],
    },
    {
        seen: 'ঢাকা',
        label: 'চোখে দুটো যুক্ত চিহ্ন',
        points: [
            { glyph: 'ঢ', code: 'U+09A2', bytes: 'E0 A6 A2' },
            { glyph: '◌া', code: 'U+09BE', bytes: 'E0 A6 BE' },
            { glyph: 'ক', code: 'U+0995', bytes: 'E0 A6 95' },
            { glyph: '◌া', code: 'U+09BE', bytes: 'E0 A6 BE' },
        ],
    },
    {
        seen: 'ক্ষ',
        label: 'চোখে একটা অক্ষর',
        points: [
            { glyph: 'ক', code: 'U+0995', bytes: 'E0 A6 95' },
            { glyph: '◌্', code: 'U+09CD', bytes: 'E0 A7 8D' },
            { glyph: 'ষ', code: 'U+09B7', bytes: 'E0 A6 B7' },
        ],
    },
];

/**
 * Three words read at three levels: what the eye sees, the Unicode code
 * points PostgreSQL counts as characters, and the UTF-8 bytes on disk. English
 * letters are one byte each; every Bengali code point is three.
 */
export function Utf8LayersDiagram() {
    const rowH = 118;
    return (
        <Sketch
            label='Seen, Code Points, Bytes'
            height={360}
            minWidth={940}
            viewBox='0 0 960 360'
            caption={
                <>
                    বাঁয়ে যা চোখে দেখেন, মাঝে Unicode এর Code Point, নিচে UTF-8 এর Byte। PostgreSQL এর কাছে একটা Character মানে
                    একটা Code Point। Dhaka তে ৫টা Code Point, ৫ Byte। ঢাকা তে ৪টা Code Point (ঢ, া, ক, া), প্রতিটা ৩ Byte, মোট ১২।
                    ক্ষ চোখে একটা অক্ষর, কিন্তু ভেতরে ক, হসন্ত আর ষ: ৩টা Code Point, ৯ Byte। ◌ চিহ্নটা শুধু দেখানোর জন্য, যাতে
                    একা কার বা হসন্ত চোখে পড়ে।
                </>
            }>
            {WORDS.map((w, r) => {
                const y = 20 + r * rowH;
                const boxW = w.points.length === 5 ? 76 : 112;
                const total = w.points.reduce((sum, p) => sum + p.bytes.split(' ').length, 0);
                return (
                    <g key={w.seen}>
                        <SketchText x={40} y={y + 44} size={30} anchor='start' bold accent>
                            {w.seen}
                        </SketchText>
                        <SketchText x={40} y={y + 70} size={10.5} anchor='start' body opacity={0.75}>
                            {w.label}
                        </SketchText>
                        {w.points.map((p, i) => {
                            const x = 200 + i * (boxW + 10);
                            return (
                                <g key={i}>
                                    <rect x={x} y={y} width={boxW} height={52} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeWidth='1.2' />
                                    <SketchText x={x + boxW / 2} y={y + 24} size={17} bold accent>
                                        {p.glyph}
                                    </SketchText>
                                    <SketchText x={x + boxW / 2} y={y + 43} size={9.5} opacity={0.8}>
                                        {p.code}
                                    </SketchText>
                                    <rect x={x} y={y + 58} width={boxW} height={26} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1' strokeDasharray='3 3' />
                                    <SketchText x={x + boxW / 2} y={y + 75} size={10}>
                                        {p.bytes}
                                    </SketchText>
                                </g>
                            );
                        })}
                        <SketchText x={920} y={y + 30} size={11} anchor='end' bold>
                            {`${w.points.length} code points`}
                        </SketchText>
                        <SketchText x={920} y={y + 75} size={11} anchor='end' bold accent>
                            {`${total} bytes`}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. দেখতে এক, ভেতরে আলাদা                                                     */
/* ------------------------------------------------------------------------- */

function PointBox({ x, y, w, glyph, code }: { x: number; y: number; w: number; glyph: string; code: string }) {
    return (
        <g>
            <rect x={x} y={y} width={w} height={54} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={x + w / 2} y={y + 26} size={17} bold accent>
                {glyph}
            </SketchText>
            <SketchText x={x + w / 2} y={y + 45} size={9.5} opacity={0.8}>
                {code}
            </SketchText>
        </g>
    );
}

/**
 * The Bengali letter ya with a nukta can be stored as one precomposed code
 * point or as ya followed by the nukta sign. Both render the same; the bytes,
 * and therefore a plain = comparison, differ.
 */
export function SameLookSplit() {
    return (
        <SketchSplit
            label='Same Look, Different Bytes'
            caption={
                <>
                    দুই পাশেই চোখে একই য়। বাঁয়েরটা একটা Code Point (U+09DF), ৩ Byte। ডানেরটা য আর তার নিচের ফোঁটা (নুকতা) আলাদা
                    দুইটা Code Point, ৬ Byte। PostgreSQL এর সাধারণ = Byte মেলায়, তাই বলে দুটো আলাদা। normalize() দুটোকেই একই
                    রূপে আনে, তখন = বলে সমান।
                </>
            }
            panels={[
                {
                    title: 'One Code Point',
                    sub: 'U+09DF, 3 bytes',
                    viewBox: '0 0 400 230',
                    height: 230,
                    minWidth: 320,
                    children: (
                        <g>
                            <SketchText x={200} y={70} size={54} bold accent>
                                {'\u09DF'}
                            </SketchText>
                            <PointBox x={140} y={100} w={120} glyph={'\u09DF'} code='U+09DF' />
                            <rect x={140} y={164} width={120} height={28} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeDasharray='3 3' />
                            <SketchText x={200} y={183} size={10.5}>
                                E0 A7 9F
                            </SketchText>
                            <SketchText x={200} y={216} size={10.5} body opacity={0.8}>
                                char_length 1, octet_length 3
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'Two Code Points',
                    sub: 'U+09AF + U+09BC, 6 bytes',
                    viewBox: '0 0 400 230',
                    height: 230,
                    minWidth: 320,
                    children: (
                        <g>
                            <SketchText x={200} y={70} size={54} bold accent>
                                {'\u09AF\u09BC'}
                            </SketchText>
                            <PointBox x={80} y={100} w={116} glyph={'\u09AF'} code='U+09AF' />
                            <PointBox x={204} y={100} w={116} glyph={'\u25CC\u09BC'} code='U+09BC' />
                            <rect x={80} y={164} width={240} height={28} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeDasharray='3 3' />
                            <SketchText x={200} y={183} size={10.5}>
                                E0 A6 AF · E0 A6 BC
                            </SketchText>
                            <SketchText x={200} y={216} size={10.5} body opacity={0.8}>
                                char_length 2, octet_length 6
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. বড় ছোট হাত না মানার নিয়মটা কোথায় থাকে                                       */
/* ------------------------------------------------------------------------- */

const PLACES: { title: string; code: string; lines: string[]; accent?: boolean }[] = [
    {
        title: 'প্রতিটা Query তে',
        code: 'lower(email) = lower($1)',
        lines: ['Column সাধারণ text', 'প্রতিটা Query মনে রাখে', 'ভুলে গেলে চুপচাপ মিস', 'অনন্য রাখতে lower() Index'],
    },
    {
        title: 'Column এর Type এ',
        code: 'email citext',
        lines: ['citext Extension লাগে', '= নিজেই lower করে মেলায়', 'UNIQUE ও বড় ছোট মানে না', 'বক্সে চলে, CREATE EXTENSION'],
    },
    {
        title: 'Column এর Collation এ',
        code: 'email text COLLATE ci',
        lines: ['ICU, deterministic = false', 'Docs এর সুপারিশ', 'PostgreSQL 18 এ LIKE ও চলে', 'একটু ধীর, তাই বুঝে'],
        accent: true,
    },
];

/**
 * Where a case-insensitive rule can live: repeated in every query, carried by
 * the column's type, or carried by the column's collation. The further right,
 * the less each query has to remember.
 */
export function CaseRulePlacesDiagram() {
    return (
        <Sketch
            label='Where the Rule Lives'
            height={300}
            minWidth={900}
            viewBox='0 0 940 300'
            caption='বাঁ থেকে ডানে, নিয়মটা Query থেকে সরে Column এর ভেতরে ঢুকছে। বাঁয়ে প্রতিটা Query কে মনে রাখতে হয় lower লিখতে। মাঝে আর ডানে Column নিজেই জানে যে Rahim আর rahim একই, তাই কেউ ভুলে গেলেও ফলাফল ঠিক থাকে।'>
            {PLACES.map((p, i) => {
                const x = 20 + i * 306;
                return (
                    <g key={p.title}>
                        <rect
                            x={x}
                            y={20}
                            width={290}
                            height={260}
                            fill={p.accent ? 'var(--primary)' : 'transparent'}
                            fillOpacity={p.accent ? 0.06 : 0}
                            stroke={p.accent ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={p.accent ? 1 : 0.45}
                            strokeWidth='1.2'
                        />
                        <SketchText x={x + 145} y={50} size={13} body bold accent={p.accent}>
                            {p.title}
                        </SketchText>
                        <rect x={x + 20} y={66} width={250} height={34} fill='var(--card)' stroke='currentColor' strokeOpacity={0.35} />
                        <SketchText x={x + 145} y={88} size={11}>
                            {p.code}
                        </SketchText>
                        {p.lines.map((line, j) => (
                            <g key={line}>
                                <circle cx={x + 32} cy={134 + j * 36} r={3} fill={p.accent ? 'var(--primary)' : 'currentColor'} fillOpacity={0.7} />
                                <SketchText x={x + 44} y={138 + j * 36} size={11} anchor='start' body>
                                    {line}
                                </SketchText>
                            </g>
                        ))}
                    </g>
                );
            })}
        </Sketch>
    );
}
