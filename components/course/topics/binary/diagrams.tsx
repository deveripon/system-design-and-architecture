import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Sketch, SketchText as T } from '../../sketch';

/**
 * Sketch diagrams for the Binary lesson. The frame and text helpers live in
 * `components/course/sketch.tsx` so every topic draws the same way.
 */

/* ------------------------------------------------------------------ 1 */

const BITS = [0, 1, 0, 0, 0, 0, 0, 1];
const VALUES = [128, 64, 32, 16, 8, 4, 2, 1];
const CELL = 74;
const X0 = 74;
const cx = (i: number) => X0 + i * CELL + CELL / 2;

export function ByteAnatomyDiagram() {
    return (
        <Sketch
            label='Diagram: একটা Byte এর ভেতর'
            height={300}
            viewBox='0 0 740 300'
            caption={
                <span className='flex flex-col sm:flex-row sm:items-center gap-3'>
                    <span className='flex-1'>
                        আটটা ঘর, প্রতিটার নিজের দাম। চালু ঘরগুলোর দাম যোগ করলেই
                        Byte-এর মান। এখানে ৬৪ + ১ = ৬৫, আর ৬৫ মানে A।
                    </span>
                    <Link
                        href='/devops/reference/ascii-table'
                        className='inline-flex items-center gap-2 shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary hover:text-foreground transition-colors'>
                        পুরো ASCII টেবিল
                        <ArrowRight className='w-3 h-3' />
                    </Link>
                </span>
            }>
            <defs>
                <marker
                    id='ba-arrow'
                    markerWidth='8'
                    markerHeight='8'
                    refX='6'
                    refY='3'
                    orient='auto'>
                    <path d='M0,0 L0,6 L8,3 z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* MSB / LSB pointers */}
            <T x={cx(0)} y={22} size={10} accent bold>
                MSB
            </T>
            <path
                d={`M ${cx(0)} 30 L ${cx(0)} 58`}
                stroke='var(--primary)'
                strokeWidth='1.2'
                markerEnd='url(#ba-arrow)'
            />
            <T x={cx(7)} y={22} size={10} accent bold>
                LSB
            </T>
            <path
                d={`M ${cx(7)} 30 L ${cx(7)} 58`}
                stroke='var(--primary)'
                strokeWidth='1.2'
                markerEnd='url(#ba-arrow)'
            />

            {/* row labels */}
            <T x={64} y={90} size={11} anchor='end' bold>
                Bit
            </T>
            <T x={64} y={134} size={11} anchor='end' body>
                দাম
            </T>

            {/* cells */}
            {BITS.map((bit, i) => (
                <g key={i}>
                    <rect
                        x={X0 + i * CELL}
                        y={64}
                        width={CELL}
                        height={40}
                        fill={bit ? 'var(--primary)' : 'transparent'}
                        fillOpacity={bit ? 0.12 : 0}
                        stroke={bit ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={bit ? 1 : 0.35}
                        strokeWidth='1.2'
                    />
                    <T x={cx(i)} y={90} size={15} bold accent={bit === 1}>
                        {bit}
                    </T>

                    <rect
                        x={X0 + i * CELL}
                        y={104}
                        width={CELL}
                        height={40}
                        fill='transparent'
                        stroke='currentColor'
                        strokeOpacity={0.35}
                        strokeWidth='1'
                        strokeDasharray='3 3'
                    />
                    <T x={cx(i)} y={130} size={12} accent={bit === 1}>
                        {VALUES[i]}
                    </T>
                </g>
            ))}

            {/* pick out the two switches that are on */}
            {[1, 7].map(i => (
                <path
                    key={i}
                    d={`M ${cx(i)} 150 L ${cx(i)} 178`}
                    stroke='var(--primary)'
                    strokeWidth='1.2'
                    strokeDasharray='4 3'
                />
            ))}
            <T x={cx(1)} y={196} size={13} accent bold>
                64
            </T>
            <T x={cx(7)} y={196} size={13} accent bold>
                1
            </T>

            {/* the sum */}
            <path
                d={`M ${cx(1)} 206 L ${cx(1)} 226 L ${cx(7)} 226 L ${cx(7)} 206`}
                fill='none'
                stroke='currentColor'
                strokeOpacity={0.4}
                strokeWidth='1'
            />
            <T x={(cx(1) + cx(7)) / 2} y={250} size={15} bold accent>
                64 + 1 = 65
            </T>

            {/* what 65 means */}
            <rect
                x={(cx(1) + cx(7)) / 2 - 150}
                y={264}
                width={300}
                height={28}
                fill='transparent'
                stroke='currentColor'
                strokeOpacity={0.35}
                strokeWidth='1'
            />
            <T x={(cx(1) + cx(7)) / 2} y={283} size={11} body>
                ASCII টেবিল বলে: ৬৫ মানে অক্ষর A
            </T>
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 2 */

const ROWS = [
    { n: 1, total: '২', note: '0  1' },
    { n: 2, total: '৪', note: '00  01  10  11' },
    { n: 3, total: '৮', note: '000 … 111' },
    { n: 8, total: '২৫৬', note: 'এটাই ১ Byte' },
];

export function SwitchDoublingDiagram() {
    return (
        <Sketch
            label='Diagram: সুইচ বাড়লে সম্ভাবনা দ্বিগুণ'
            height={240}
            viewBox='0 0 740 240'
            caption='প্রতিটা নতুন সুইচ সম্ভাবনা দুই গুণ করে দেয়। আটটা সুইচে ২৫৬টা সম্ভাবনা, যা ইংরেজি সব অক্ষর, সংখ্যা আর চিহ্নকে আলাদা নম্বর দেওয়ার জন্য যথেষ্ট।'>
            {ROWS.map((row, r) => {
                const y = 30 + r * 52;
                const last = r === ROWS.length - 1;
                return (
                    <g key={row.n}>
                        <T x={44} y={y + 14} size={11} anchor='end' body>
                            {row.n === 8 ? '৮টা' : ['১টা', '২টা', '৩টা'][r]}
                        </T>
                        {Array.from({ length: row.n }).map((_, i) => (
                            <rect
                                key={i}
                                x={58 + i * 26}
                                y={y}
                                width={20}
                                height={20}
                                fill={last ? 'var(--primary)' : 'transparent'}
                                fillOpacity={last ? 0.12 : 0}
                                stroke={
                                    last ? 'var(--primary)' : 'currentColor'
                                }
                                strokeOpacity={last ? 1 : 0.4}
                                strokeWidth='1.2'
                            />
                        ))}
                        <T x={330} y={y + 14} size={12} anchor='middle'>
                            →
                        </T>
                        <T x={392} y={y + 14} size={13} anchor='middle' bold accent>
                            {row.total}
                        </T>
                        <T x={420} y={y + 14} size={11} anchor='start' body>
                            টা সম্ভাবনা
                        </T>
                        <T x={556} y={y + 14} size={10} anchor='start'>
                            {row.note}
                        </T>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 3 */

const EN = [
    { ch: 'R', code: 82, bits: '01010010' },
    { ch: 'i', code: 105, bits: '01101001' },
    { ch: 'p', code: 112, bits: '01110000' },
    { ch: 'o', code: 111, bits: '01101111' },
    { ch: 'n', code: 110, bits: '01101110' },
];
const BN = ['র', 'ি', 'প', 'ন'];

export function NameToBytesDiagram() {
    return (
        <Sketch
            label='Diagram: একই নাম, দুই ভাষায়'
            height={320}
            viewBox='0 0 740 320'
            caption='ইংরেজি অক্ষর সাধারণত ১ Byte, বাংলা অক্ষর UTF-8 এ ৩ Byte। তাই একই নাম বাংলায় লিখলে জায়গা লাগে দুইগুণেরও বেশি। Database column size ঠিক করার সময় এটা মনে রাখতে হয়।'>
            {/* English */}
            <T x={0} y={16} size={10} anchor='start' bold accent>
                ENGLISH, 1 BYTE PER CHARACTER
            </T>
            {EN.map((c, i) => {
                const x = 10 + i * 142;
                return (
                    <g key={c.ch}>
                        <rect
                            x={x}
                            y={30}
                            width={128}
                            height={38}
                            fill='transparent'
                            stroke='currentColor'
                            strokeOpacity={0.35}
                            strokeWidth='1.2'
                        />
                        <T x={x + 64} y={56} size={16} bold>
                            {c.ch}
                        </T>
                        <path
                            d={`M ${x + 64} 70 L ${x + 64} 84`}
                            stroke='currentColor'
                            strokeOpacity={0.4}
                            strokeWidth='1'
                            strokeDasharray='3 3'
                        />
                        <T x={x + 64} y={98} size={13} accent bold>
                            {c.code}
                        </T>
                        <path
                            d={`M ${x + 64} 106 L ${x + 64} 120`}
                            stroke='currentColor'
                            strokeOpacity={0.4}
                            strokeWidth='1'
                            strokeDasharray='3 3'
                        />
                        <rect
                            x={x}
                            y={124}
                            width={128}
                            height={26}
                            fill='var(--primary)'
                            fillOpacity={0.08}
                            stroke='var(--primary)'
                            strokeOpacity={0.5}
                            strokeWidth='1'
                        />
                        <T x={x + 64} y={142} size={11}>
                            {c.bits}
                        </T>
                    </g>
                );
            })}
            <T x={730} y={172} size={11} anchor='end' bold accent>
                মোট ৫ Byte = ৪০ Bit
            </T>

            <path
                d='M 0 190 L 740 190'
                stroke='currentColor'
                strokeOpacity={0.25}
                strokeWidth='1'
            />

            {/* Bengali */}
            <T x={0} y={216} size={10} anchor='start' bold accent>
                বাংলা, ৩ BYTE PER CHARACTER
            </T>
            {BN.map((ch, i) => {
                const x = 10 + i * 178;
                return (
                    <g key={i}>
                        <rect
                            x={x}
                            y={230}
                            width={164}
                            height={38}
                            fill='transparent'
                            stroke='currentColor'
                            strokeOpacity={0.35}
                            strokeWidth='1.2'
                        />
                        <T x={x + 82} y={256} size={16} bold body>
                            {ch}
                        </T>
                        {[0, 1, 2].map(b => (
                            <rect
                                key={b}
                                x={x + 8 + b * 52}
                                y={276}
                                width={44}
                                height={22}
                                fill='var(--primary)'
                                fillOpacity={0.12}
                                stroke='var(--primary)'
                                strokeOpacity={0.6}
                                strokeWidth='1'
                            />
                        ))}
                        {[0, 1, 2].map(b => (
                            <T key={b} x={x + 30 + b * 52} y={291} size={9}>
                                Byte
                            </T>
                        ))}
                    </g>
                );
            })}
            <T x={730} y={316} size={11} anchor='end' bold accent>
                মোট ১২ Byte = ৯৬ Bit
            </T>
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 4 */

const CHIPS = [
    { code: '#FF5733', what: 'রঙের তিনটা মাত্রা', size: '৩ Byte' },
    { code: '192.168.0.1', what: 'IPv4 Address', size: '৪ Byte' },
    { code: 'A3:F1:9B:2C:41:07', what: 'MAC Address', size: '৬ Byte' },
];

export function HexBridgeDiagram() {
    return (
        <Sketch
            label='Diagram: Binary, Hex আর Decimal'
            height={300}
            viewBox='0 0 740 300'
            caption='৪ Bit এর সম্ভাবনা ১৬টা, আর Hex-এ অঙ্কও ১৬টা। তাই ৪ Bit ঠিক ১টা Hex অঙ্কে বসে যায়, আর পুরো Byte বসে ২টা অঙ্কে।'>
            {/* nibbles */}
            <T x={10} y={20} size={10} anchor='start' bold accent>
                BINARY
            </T>
            {['0100', '0001'].map((nib, n) => (
                <g key={n}>
                    <rect
                        x={110 + n * 200}
                        y={30}
                        width={170}
                        height={44}
                        fill='var(--primary)'
                        fillOpacity={0.08}
                        stroke='var(--primary)'
                        strokeOpacity={0.6}
                        strokeWidth='1.2'
                    />
                    <T x={195 + n * 200} y={59} size={20} bold>
                        {nib}
                    </T>
                    <T x={195 + n * 200} y={92} size={10}>
                        ৪ Bit
                    </T>
                    <path
                        d={`M ${195 + n * 200} 100 L ${195 + n * 200} 126`}
                        stroke='currentColor'
                        strokeOpacity={0.4}
                        strokeWidth='1'
                        strokeDasharray='3 3'
                    />
                    <rect
                        x={165 + n * 200}
                        y={130}
                        width={60}
                        height={38}
                        fill='transparent'
                        stroke='var(--primary)'
                        strokeWidth='1.2'
                    />
                    <T x={195 + n * 200} y={155} size={18} bold accent>
                        {n === 0 ? '4' : '1'}
                    </T>
                </g>
            ))}
            <T x={10} y={155} size={10} anchor='start' bold accent>
                HEX
            </T>

            {/* the three readings */}
            <path
                d='M 225 172 L 225 190 L 395 190 L 395 172'
                fill='none'
                stroke='currentColor'
                strokeOpacity={0.4}
                strokeWidth='1'
            />
            <T x={310} y={214} size={16} bold accent>
                0x41
            </T>
            <T x={430} y={214} size={13}>
                = 65 (decimal)
            </T>
            <T x={580} y={214} size={13}>
                = A (character)
            </T>

            {/* real world */}
            <path
                d='M 0 238 L 740 238'
                stroke='currentColor'
                strokeOpacity={0.25}
                strokeWidth='1'
            />
            {CHIPS.map((c, i) => {
                const x = 8 + i * 246;
                return (
                    <g key={c.code}>
                        <rect
                            x={x}
                            y={252}
                            width={228}
                            height={40}
                            fill='transparent'
                            stroke='currentColor'
                            strokeOpacity={0.35}
                            strokeWidth='1'
                        />
                        <T x={x + 12} y={268} size={11} anchor='start' bold>
                            {c.code}
                        </T>
                        <T x={x + 12} y={284} size={9} anchor='start' body>
                            {c.what}
                        </T>
                        <T x={x + 216} y={278} size={10} anchor='end' accent bold>
                            {c.size}
                        </T>
                    </g>
                );
            })}
        </Sketch>
    );
}
