import { Sketch, SketchBox, SketchText as T } from '../../sketch';

/* ------------------------------------------------------------------ 1 */

/** The loop the CPU never leaves: fetch, decode, execute, repeat. */
export function FetchDecodeExecuteDiagram() {
    return (
        <Sketch
            label='Diagram: CPU এর চারটা ধাপ'
            height={330}
            viewBox='0 0 760 330'
            caption='এই চারটা ধাপ ছাড়া CPU আর কিছুই করে না। Program Counter শুধু বলে দেয় পরের Instruction কোথায়, আর পুরো চক্রটা আবার শুরু হয়।'>
            <defs>
                <marker id='cpu-a' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                    <path d='M0,0 L0,6 L8,3 z' fill='var(--primary)' />
                </marker>
                <marker id='cpu-b' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                    <path d='M0,0 L0,6 L8,3 z' fill='currentColor' fillOpacity={0.45} />
                </marker>
            </defs>

            {/* memory holding the program */}
            <rect x={14} y={70} width={150} height={190} fill='transparent'
                stroke='currentColor' strokeOpacity={0.35} strokeWidth='1'
                strokeDasharray='5 4' />
            <T x={89} y={60} size={9} bold accent>MEMORY</T>
            {['LOAD 5', 'ADD 3', 'STORE', '...'].map((ins, i) => (
                <g key={ins}>
                    <rect x={28} y={86 + i * 44} width={122} height={32}
                        fill={i === 0 ? 'var(--primary)' : 'transparent'}
                        fillOpacity={i === 0 ? 0.12 : 0}
                        stroke={i === 0 ? 'var(--primary)' : 'currentColor'}
                        strokeOpacity={i === 0 ? 1 : 0.3} strokeWidth='1' />
                    <T x={89} y={106 + i * 44} size={11} accent={i === 0}>{ins}</T>
                </g>
            ))}
            <T x={89} y={278} size={9} body opacity={0.75}>Program এখানে থাকে</T>

            {/* the four stages */}
            <path d='M 170 102 L 214 102' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#cpu-a)' />
            <SketchBox x={220} y={78} w={124} h={50} title='1. FETCH' sub='নিয়ে আসা' accent />
            <path d='M 350 103 L 394 103' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#cpu-a)' />
            <SketchBox x={400} y={78} w={124} h={50} title='2. DECODE' sub='মানে বোঝা' />
            <path d='M 530 103 L 574 103' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#cpu-a)' />
            <SketchBox x={580} y={78} w={124} h={50} title='3. EXECUTE' sub='কাজটা করা' />

            {/* result back to a register */}
            <path d='M 642 134 L 642 176' stroke='currentColor' strokeOpacity={0.45}
                strokeWidth='1.2' markerEnd='url(#cpu-b)' />
            <SketchBox x={580} y={182} w={124} h={46} title='4. STORE' sub='ফল রাখা' />

            {/* loop back */}
            <path d='M 580 205 L 400 205' stroke='currentColor' strokeOpacity={0.45}
                strokeWidth='1.2' strokeDasharray='4 3' markerEnd='url(#cpu-b)' />
            <T x={490} y={196} size={9} body opacity={0.75}>আবার প্রথম থেকে</T>

            {/* program counter */}
            <SketchBox x={220} y={182} w={150} h={46} title='PROGRAM COUNTER' sub='পরেরটা কোথায়' dashed />
            <path d='M 282 178 L 282 134' stroke='currentColor' strokeOpacity={0.45}
                strokeWidth='1.2' markerEnd='url(#cpu-b)' />

            <path d='M 14 300 L 746 300' stroke='currentColor' strokeOpacity={0.2} strokeWidth='1' />
            <T x={14} y={320} size={9} anchor='start' body opacity={0.8}>
                একটা 3 GHz CPU এই চক্রটা সেকেন্ডে প্রায় ৩০০ কোটি বার ঘোরায়।
            </T>
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 2 */

const LADDER = [
    { name: 'Register', size: 'কয়েক Byte', ns: 0.3, human: '১ সেকেন্ড' },
    { name: 'L1 Cache', size: '৬৪ KB', ns: 1, human: '৩ সেকেন্ড' },
    { name: 'L2 Cache', size: '৫১২ KB', ns: 4, human: '১৩ সেকেন্ড' },
    { name: 'L3 Cache', size: '৮ MB', ns: 12, human: '৪০ সেকেন্ড' },
    { name: 'RAM', size: '১৬ GB', ns: 100, human: '৫ মিনিট' },
    { name: 'SSD', size: '৫০০ GB', ns: 150000, human: '৬ দিন' },
    { name: 'Network', size: 'অসীম', ns: 500000, human: '১৯ দিন' },
];

/** Why the CPU spends most of its life waiting. */
export function MemoryLadderDiagram() {
    const max = Math.log10(LADDER[LADDER.length - 1].ns * 4);
    return (
        <Sketch
            label='Diagram: অপেক্ষার সিঁড়ি'
            height={320}
            viewBox='0 0 760 320'
            caption='সংখ্যাগুলো আনুমানিক, আর বারগুলো log scale-এ আঁকা। ডান পাশের হিসাবটা এভাবে পড়ুন: CPU এর একটা ধাপ যদি ১ সেকেন্ড হতো, তাহলে RAM থেকে ডেটা আনতে ৫ মিনিট লাগত।'>
            <T x={14} y={20} size={9} anchor='start' bold accent>কোথায় ডেটা আছে</T>
            <T x={300} y={20} size={9} anchor='middle' bold accent>কত সময় লাগে</T>
            <T x={746} y={20} size={9} anchor='end' bold accent>মানুষের হিসাবে</T>

            {LADDER.map((row, i) => {
                const y = 40 + i * 38;
                const w = Math.max(8, (Math.log10(row.ns * 1000) / max) * 300);
                const far = i >= 5;
                return (
                    <g key={row.name}>
                        <T x={14} y={y + 16} size={11} anchor='start' bold accent={i < 2}>
                            {row.name}
                        </T>
                        <T x={150} y={y + 16} size={9} anchor='start' opacity={0.7}>
                            {row.size}
                        </T>
                        <rect x={252} y={y + 4} width={w} height={16}
                            fill={far ? 'currentColor' : 'var(--primary)'}
                            fillOpacity={far ? 0.25 : 0.65}
                            stroke={far ? 'currentColor' : 'var(--primary)'}
                            strokeOpacity={far ? 0.4 : 0.8} strokeWidth='1' />
                        <T x={746} y={y + 16} size={11} anchor='end' bold>
                            {row.human}
                        </T>
                    </g>
                );
            })}

            <path d='M 14 300 L 746 300' stroke='currentColor' strokeOpacity={0.2} strokeWidth='1' />
            <T x={14} y={316} size={9} anchor='start' body opacity={0.8}>
                এই কারণেই Cache এত জরুরি। ডেটা যত কাছে থাকে, CPU তত কম বসে থাকে।
            </T>
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 3 */

/** One core juggling versus four cores actually working at once. */
export function CoresDiagram() {
    const tasks = ['A', 'B', 'C', 'D'];
    return (
        <Sketch
            label='Diagram: এক Core আর চার Core'
            height={300}
            viewBox='0 0 760 300'
            caption='এক Core কাজগুলো ভাগ ভাগ করে চালায়, তাই সব শেষ হতে সময় লাগে চার গুণ। চার Core সত্যিই একসাথে চালায়। কিন্তু আটটা Core মানে সবসময় আট গুণ গতি নয়, কারণ অনেক কাজ ভাগ করাই যায় না।'>
            <T x={14} y={20} size={10} anchor='start' bold accent>এক CORE</T>
            {/* time axis */}
            <path d='M 120 60 L 700 60' stroke='currentColor' strokeOpacity={0.3} strokeWidth='1' />
            {tasks.map((t, i) => (
                <g key={t}>
                    <rect x={120 + i * 145} y={36} width={139} height={22}
                        fill='var(--primary)' fillOpacity={0.15}
                        stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1' />
                    <T x={190 + i * 145} y={52} size={10}>{`কাজ ${t}`}</T>
                </g>
            ))}
            <T x={410} y={80} size={9} body opacity={0.75}>একটার পর একটা, তাই মোট সময় বেশি</T>

            <path d='M 14 108 L 746 108' stroke='currentColor' strokeOpacity={0.2} strokeWidth='1' />

            <T x={14} y={136} size={10} anchor='start' bold accent>চার CORE</T>
            {tasks.map((t, i) => {
                const y = 126 + i * 38;
                return (
                    <g key={t}>
                        <T x={100} y={y + 16} size={9} anchor='end' opacity={0.7}>
                            {`Core ${i + 1}`}
                        </T>
                        <rect x={120} y={y + 4} width={139} height={22}
                            fill='var(--primary)' fillOpacity={0.15}
                            stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1' />
                        <T x={190} y={y + 20} size={10}>{`কাজ ${t}`}</T>
                        <path d={`M 268 ${y + 15} L 700 ${y + 15}`} stroke='currentColor'
                            strokeOpacity={0.15} strokeWidth='1' strokeDasharray='3 4' />
                    </g>
                );
            })}
            <T x={410} y={292} size={9} body opacity={0.75}>
                চারটাই একসাথে, তাই একই সময়ে চার গুণ কাজ
            </T>
        </Sketch>
    );
}
