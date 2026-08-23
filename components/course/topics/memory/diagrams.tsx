import { Sketch, SketchBox, SketchSplit, SketchText as T } from '../../sketch';

/* ------------------------------------------------------------------ 1 */

/** What a running program's memory actually looks like, end to end. */
export function MemoryMapDiagram() {
    const regions = [
        { name: 'CODE', sub: 'আপনার Program', w: 110, accent: false },
        { name: 'GLOBALS', sub: 'সারাক্ষণ থাকে', w: 110, accent: false },
        { name: 'HEAP', sub: 'বড় জিনিস এখানে', w: 200, accent: true },
        { name: 'ফাঁকা জায়গা', sub: 'দুই দিক থেকে ভরে', w: 130, accent: false },
        { name: 'STACK', sub: 'ফাংশনের কাজ', w: 160, accent: true },
    ];
    let x = 14;
    const laid = regions.map(r => {
        const box = { ...r, x };
        x += r.w + 6;
        return box;
    });

    return (
        <Sketch
            label='Diagram: একটা Program এর Memory'
            height={280}
            viewBox='0 0 760 280'
            caption='Heap বড় হয় এক দিক থেকে, Stack অন্য দিক থেকে। মাঝের ফাঁকা জায়গাটা যখন শেষ হয়ে যায়, তখনই Out of Memory বা Stack Overflow হয়।'>
            <defs>
                <marker id='mem-a' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                    <path d='M0,0 L0,6 L8,3 z' fill='var(--primary)' />
                </marker>
            </defs>

            <T x={14} y={22} size={9} anchor='start' bold accent>কম Address</T>
            <T x={746} y={22} size={9} anchor='end' bold accent>বেশি Address</T>
            <path d='M 14 32 L 746 32' stroke='currentColor' strokeOpacity={0.25} strokeWidth='1' />

            {laid.map(r => (
                <SketchBox
                    key={r.name}
                    x={r.x}
                    y={60}
                    w={r.w}
                    h={72}
                    title={r.name}
                    sub={r.sub}
                    accent={r.accent}
                    dashed={r.name === 'ফাঁকা জায়গা'}
                />
            ))}

            {/* growth directions */}
            <path d='M 240 152 L 380 152' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#mem-a)' />
            <T x={310} y={170} size={9} body>Heap এদিকে বাড়ে</T>

            <path d='M 700 152 L 570 152' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#mem-a)' />
            <T x={636} y={170} size={9} body>Stack এদিকে বাড়ে</T>

            <path d='M 14 200 L 746 200' stroke='currentColor' strokeOpacity={0.2} strokeWidth='1' />
            <T x={14} y={222} size={10} anchor='start' bold>Stack</T>
            <T x={100} y={222} size={9} anchor='start' body opacity={0.85}>
                ছোট, দ্রুত, নিজে নিজে পরিষ্কার হয়। ফাংশন শেষ হলেই তার জায়গা ফেরত যায়।
            </T>
            <T x={14} y={248} size={10} anchor='start' bold>Heap</T>
            <T x={100} y={248} size={9} anchor='start' body opacity={0.85}>
                বড়, একটু ধীর, আর এখানে রাখা জিনিস নিজে থেকে যায় না। কেউ পরিষ্কার না করলে জমতেই থাকে।
            </T>
            <T x={14} y={272} size={9} anchor='start' body opacity={0.7}>
                বিদ্যুৎ গেলে এই পুরো ছবিটাই মুছে যায়, কারণ এর সবটাই RAM এ।
            </T>
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 2 */

/** Frames stacking up as calls nest, then leaving in reverse. */
export function StackFramesDiagram() {
    const frames = [
        { fn: 'main()', locals: 'name = "Ripon"', y: 196 },
        { fn: 'greet(name)', locals: 'greeting = "হ্যালো"', y: 140 },
        { fn: 'format(text)', locals: 'result', y: 84 },
    ];
    return (
        <Sketch
            label='Diagram: Stack এ ফাংশন জমে'
            height={300}
            viewBox='0 0 760 300'
            caption='যে ফাংশন সবার শেষে ঢোকে, সে সবার আগে বের হয়। ফাংশন শেষ হওয়া মাত্র তার Frame মুছে যায়, তাই তার ভেতরের Local Variable গুলোও চলে যায়।'>
            <defs>
                <marker id='stk-a' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                    <path d='M0,0 L0,6 L8,3 z' fill='var(--primary)' />
                </marker>
                <marker id='stk-b' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                    <path d='M0,0 L0,6 L8,3 z' fill='currentColor' fillOpacity={0.45} />
                </marker>
            </defs>

            <T x={330} y={26} size={9} anchor='middle' bold accent>STACK</T>
            <rect x={180} y={36} width={300} height={230} fill='transparent'
                stroke='currentColor' strokeOpacity={0.3} strokeWidth='1' strokeDasharray='5 4' />

            {frames.map((f, i) => (
                <g key={f.fn}>
                    <rect x={196} y={f.y} width={268} height={48}
                        fill='var(--primary)' fillOpacity={i === 2 ? 0.16 : 0.07}
                        stroke='var(--primary)' strokeOpacity={i === 2 ? 1 : 0.5} strokeWidth='1.2' />
                    <T x={212} y={f.y + 20} size={11} anchor='start' bold accent={i === 2}>
                        {f.fn}
                    </T>
                    <T x={212} y={f.y + 37} size={9} anchor='start' opacity={0.75}>
                        {f.locals}
                    </T>
                </g>
            ))}

            <T x={330} y={278} size={9} body opacity={0.75}>
                নিচের দিকে পুরনো, উপরের দিকে নতুন
            </T>

            {/* in and out */}
            <path d='M 500 210 L 500 100' stroke='var(--primary)' strokeWidth='1.2'
                markerEnd='url(#stk-a)' />
            <T x={560} y={150} size={9} anchor='start' body accent>
                ডাকা হলে উপরে জমে
            </T>
            <path d='M 160 100 L 160 210' stroke='currentColor' strokeOpacity={0.45}
                strokeWidth='1.2' strokeDasharray='4 3' markerEnd='url(#stk-b)' />
            <T x={148} y={150} size={9} anchor='end' body opacity={0.8}>
                শেষ হলে উপর থেকে যায়
            </T>
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 3 */

/** The copy versus share difference that bites every JS developer once. */
export function ValueVsReferenceDiagram() {
    return (
        <SketchSplit
            label='Diagram: কপি হয় নাকি ভাগ হয়'
            caption='সংখ্যা কপি হয়, তাই একটা বদলালে অন্যটা ঠিক থাকে। Object কপি হয় না, দুইটা নাম একই জিনিসকে দেখায়, তাই একটা দিয়ে বদলালে অন্যটাতেও বদলে যায়।'
            panels={[
                {
                    title: 'সংখ্যা',
                    sub: 'কপি হয়',
                    viewBox: '0 0 320 230',
                    height: 230,
                    children: (
                        <>
                            <T x={10} y={20} size={9} anchor='start' opacity={0.7}>STACK</T>
                            <SketchBox x={10} y={32} w={140} h={44} title='a = 5' />
                            <SketchBox x={170} y={32} w={140} h={44} title='b = 5' />
                            <T x={160} y={104} size={9} body opacity={0.8}>
                                b তে আলাদা একটা ৫ বসে
                            </T>
                            <path d='M 10 132 L 310 132' stroke='currentColor'
                                strokeOpacity={0.2} strokeWidth='1' />
                            <T x={10} y={158} size={9} anchor='start' body opacity={0.85}>
                                b বদলালে a এর কিছুই হয় না,
                            </T>
                            <T x={10} y={178} size={9} anchor='start' body opacity={0.85}>
                                কারণ দুইজনের কাছে নিজের কপি আছে।
                            </T>
                        </>
                    ),
                },
                {
                    title: 'OBJECT',
                    sub: 'ভাগ হয়',
                    viewBox: '0 0 320 230',
                    height: 230,
                    children: (
                        <>
                            <defs>
                                <marker id='ref-a' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                                    <path d='M0,0 L0,6 L8,3 z' fill='var(--primary)' />
                                </marker>
                            </defs>
                            <T x={10} y={20} size={9} anchor='start' opacity={0.7}>STACK</T>
                            <SketchBox x={10} y={32} w={140} h={44} title='x' sub='ঠিকানা' />
                            <SketchBox x={170} y={32} w={140} h={44} title='y' sub='একই ঠিকানা' />

                            <path d='M 80 80 L 140 122' stroke='var(--primary)'
                                strokeWidth='1.2' markerEnd='url(#ref-a)' />
                            <path d='M 240 80 L 180 122' stroke='var(--primary)'
                                strokeWidth='1.2' markerEnd='url(#ref-a)' />

                            <T x={160} y={142} size={9} opacity={0.7}>HEAP</T>
                            <rect x={54} y={150} width={212} height={48}
                                fill='var(--primary)' fillOpacity={0.12}
                                stroke='var(--primary)' strokeWidth='1.2' />
                            <T x={160} y={172} size={11} bold accent>{'{ name: "Ripon" }'}</T>
                            <T x={160} y={190} size={9} opacity={0.75}>একটাই Object</T>

                            <T x={160} y={220} size={9} body opacity={0.85}>
                                y দিয়ে বদলালে x ও বদলে যায়
                            </T>
                        </>
                    ),
                },
            ]}
        />
    );
}
