import { Sketch, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. Function একটা যন্ত্র: মান ঢোকে, নতুন মান বের হয়                              */
/* ------------------------------------------------------------------------- */

const MACHINE_ROWS = [
    { input: "'rahim uddin'", fn: 'upper( … )', output: "'RAHIM UDDIN'" },
    { input: "'ঢাকা'", fn: 'char_length( … )', output: '4' },
    { input: 'email (প্রতিটা Row এর)', fn: "split_part( … , '@', 2)", output: "'mail.example'" },
];

/** Input, function, output: the same three part picture for every function in this lesson. */
export function FunctionMachineDiagram() {
    return (
        <Sketch
            label='A Function Is a Machine'
            height={320}
            minWidth={860}
            viewBox='0 0 860 320'
            caption='প্রতিটা Function একটা ছোট যন্ত্রের মতো: একদিক দিয়ে একটা মান ঢোকে, যন্ত্র তার নিজের নিয়মে কাজ করে, অন্যদিক দিয়ে একটা নতুন মান বের হয়। আসল মানটা Table এ যেমন ছিল তেমনই থাকে, বদলায় শুধু ফলাফলে যা দেখানো হয়।'>
            <defs>
                <marker
                    id='str-machine-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <SketchText x={130} y={34} size={10} bold opacity={0.7}>
                INPUT
            </SketchText>
            <SketchText x={430} y={34} size={10} bold accent>
                FUNCTION
            </SketchText>
            <SketchText x={730} y={34} size={10} bold opacity={0.7}>
                OUTPUT
            </SketchText>
            {MACHINE_ROWS.map((row, i) => {
                const y = 60 + i * 86;
                return (
                    <g key={row.fn}>
                        <rect x={20} y={y} width={220} height={52} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
                        <SketchText x={130} y={y + 31} size={11} body={i === 2}>
                            {row.input}
                        </SketchText>
                        <line x1={244} y1={y + 26} x2={316} y2={y + 26} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#str-machine-arrow)' />
                        <rect x={320} y={y} width={220} height={52} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.3' />
                        <SketchText x={430} y={y + 31} size={11} bold accent>
                            {row.fn}
                        </SketchText>
                        <line x1={544} y1={y + 26} x2={616} y2={y + 26} stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#str-machine-arrow)' />
                        <rect x={620} y={y} width={220} height={52} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
                        <SketchText x={730} y={y + 31} size={11}>
                            {row.output}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. অক্ষর আর Byte: Dhaka বনাম ঢাকা                                           */
/* ------------------------------------------------------------------------- */

const LATIN = [
    { ch: 'D', bytes: ['44'] },
    { ch: 'h', bytes: ['68'] },
    { ch: 'a', bytes: ['61'] },
    { ch: 'k', bytes: ['6B'] },
    { ch: 'a', bytes: ['61'] },
];

const BENGALI = [
    { ch: 'ঢ', bytes: ['E0', 'A6', 'A2'] },
    { ch: 'া', bytes: ['E0', 'A6', 'BE'] },
    { ch: 'ক', bytes: ['E0', 'A6', '95'] },
    { ch: 'া', bytes: ['E0', 'A6', 'BE'] },
];

function WordRow({
    y,
    word,
    summary,
    cells,
    byteWidth,
}: {
    y: number;
    word: string;
    summary: string;
    cells: { ch: string; bytes: string[] }[];
    byteWidth: number;
}) {
    // Each cell starts after all the cells before it, plus an 8 unit gap.
    const starts = cells.map((_, i) =>
        cells.slice(0, i).reduce((sum, c) => sum + c.bytes.length * byteWidth + 8, 210)
    );
    return (
        <g>
            <SketchText x={30} y={y + 22} anchor='start' size={14} bold body>
                {word}
            </SketchText>
            <SketchText x={30} y={y + 48} anchor='start' size={9.5} opacity={0.75}>
                {summary}
            </SketchText>
            {cells.map((cell, i) => {
                const w = cell.bytes.length * byteWidth;
                const cx = starts[i];
                return (
                    <g key={`${cell.ch}-${i}`}>
                        <rect x={cx} y={y} width={w} height={30} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.2' />
                        <SketchText x={cx + w / 2} y={y + 20} size={13} body accent bold>
                            {cell.ch}
                        </SketchText>
                        {cell.bytes.map((b, j) => (
                            <g key={j}>
                                <rect
                                    x={cx + j * byteWidth}
                                    y={y + 36}
                                    width={byteWidth}
                                    height={24}
                                    fill='transparent'
                                    stroke='currentColor'
                                    strokeOpacity={0.45}
                                    strokeWidth='1'
                                />
                                <SketchText x={cx + j * byteWidth + byteWidth / 2} y={y + 52} size={9}>
                                    {b}
                                </SketchText>
                            </g>
                        ))}
                    </g>
                );
            })}
        </g>
    );
}

/** The same city, five Latin characters at one byte each and four Bengali characters at three bytes each. */
export function CharVsByteDiagram() {
    return (
        <Sketch
            label='Characters vs Bytes in UTF-8'
            height={250}
            minWidth={820}
            viewBox='0 0 820 250'
            caption='উপরের সারির ঘর হলো অক্ষর, নিচের ছোট ঘর হলো Byte, ভেতরের লেখাটা সেই Byte এর Hex মান। ইংরেজি প্রতিটা অক্ষর এক Byte, বাংলা প্রতিটা অক্ষর তিন Byte। তাই char_length বলে ৫ আর ৪, কিন্তু octet_length বলে ৫ আর ১২। া চিহ্নটাও আলাদা একটা অক্ষর হিসেবে গোনা হয়।'>
            <SketchText x={210} y={26} anchor='start' size={9.5} bold opacity={0.7} body>
                CHARACTERS (উপরে) · BYTES (নিচে)
            </SketchText>
            <WordRow y={48} word='Dhaka' summary='5 char · 5 byte' cells={LATIN} byteWidth={44} />
            <WordRow y={150} word='ঢাকা' summary='4 char · 12 byte' cells={BENGALI} byteWidth={40} />
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. অবস্থান গোনা শুরু ১ থেকে                                                    */
/* ------------------------------------------------------------------------- */

const WORD = 'Saint Martin';

/** Positions 1 to 12 over one title, with substring, left and right drawn as spans. */
export function SubstringPositionsDiagram() {
    const cell = 50;
    const x0 = 60;
    const chars = WORD.split('');
    return (
        <Sketch
            label='Positions Start at 1'
            height={270}
            minWidth={760}
            viewBox='0 0 760 270'
            caption='SQL এ লেখার প্রথম অক্ষরের অবস্থান ১, শূন্য না। ফাঁকা জায়গাটাও একটা অক্ষর, তার অবস্থান ৬। substring(… from 7 for 6) মানে সাত নম্বর থেকে শুরু করে ছয়টা অক্ষর, তাই আসে Martin। left(…, 5) নেয় শুরুর পাঁচটা, right(…, 6) নেয় শেষের ছয়টা।'>
            {chars.map((ch, i) => {
                const x = x0 + i * cell;
                const picked = i >= 6;
                return (
                    <g key={i}>
                        <SketchText x={x + cell / 2} y={40} size={10} opacity={0.75}>
                            {i + 1}
                        </SketchText>
                        <rect
                            x={x}
                            y={52}
                            width={cell}
                            height={44}
                            fill={picked ? 'var(--primary)' : 'transparent'}
                            fillOpacity={picked ? 0.12 : 0}
                            stroke={picked ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={picked ? 1 : 0.45}
                            strokeWidth='1.2'
                        />
                        <SketchText x={x + cell / 2} y={80} size={16} bold accent={picked}>
                            {ch === ' ' ? '␣' : ch}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={x0 + 9 * cell} y={124} size={10} bold accent>
                substring(… from 7 for 6) = &apos;Martin&apos;
            </SketchText>
            <path d={`M ${x0} 150 V 160 H ${x0 + 5 * cell} V 150`} fill='none' stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.3' />
            <SketchText x={x0 + 2.5 * cell} y={182} size={10}>
                left(…, 5) = &apos;Saint&apos;
            </SketchText>
            <path d={`M ${x0 + 6 * cell} 205 V 215 H ${x0 + 12 * cell} V 205`} fill='none' stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.3' />
            <SketchText x={x0 + 9 * cell} y={238} size={10}>
                right(…, 6) = &apos;Martin&apos;
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. split_part: একটা চিহ্ন ধরে লেখা ভাগ করা                                       */
/* ------------------------------------------------------------------------- */

/** One email split at the at sign, with the part numbers counted from both ends. */
export function SplitPartDiagram() {
    return (
        <Sketch
            label='split_part Cuts at a Delimiter'
            height={230}
            minWidth={760}
            viewBox='0 0 760 230'
            caption='split_part লেখাটাকে একটা চিহ্ন ধরে টুকরো করে, তারপর আপনি যে নম্বরের টুকরো চান সেটা দেয়। বাঁ দিক থেকে গুনলে ১, ২; ডান দিক থেকে গুনলে -১, -২। যে নম্বরের টুকরো নেই, তার জন্য আসে খালি লেখা, NULL না।'>
            <rect x={40} y={60} width={330} height={52} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={205} y={92} size={15} bold accent>
                rahim.uddin
            </SketchText>
            <rect x={370} y={60} width={50} height={52} fill='transparent' stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.2' strokeDasharray='4 3' />
            <SketchText x={395} y={92} size={18} bold>
                @
            </SketchText>
            <rect x={420} y={60} width={300} height={52} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.3' />
            <SketchText x={570} y={92} size={15} bold accent>
                mail.example
            </SketchText>
            <SketchText x={395} y={44} size={9.5} opacity={0.75}>
                delimiter
            </SketchText>
            <SketchText x={205} y={140} size={10.5}>
                split_part(email, &apos;@&apos;, 1)
            </SketchText>
            <SketchText x={205} y={162} size={9.5} opacity={0.7} body>
                অথবা -2 দিলেও এটাই
            </SketchText>
            <SketchText x={570} y={140} size={10.5}>
                split_part(email, &apos;@&apos;, 2)
            </SketchText>
            <SketchText x={570} y={162} size={9.5} opacity={0.7} body>
                অথবা -1 দিলেও এটাই
            </SketchText>
            <SketchText x={380} y={204} size={9.5} opacity={0.75} body>
                split_part(email, &apos;@&apos;, 3) = &apos;&apos; (খালি লেখা)
            </SketchText>
        </Sketch>
    );
}
