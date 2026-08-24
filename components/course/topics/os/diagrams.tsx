import {
    Sketch,
    SketchBox,
    SketchSplit,
    SketchText as T,
} from '../../sketch';

/* ------------------------------------------------------------------ 1 */

/** Two rooms and the one doorway between them. */
export function KernelUserSpaceDiagram() {
    const apps = [
        { name: 'আপনার API', x: 30 },
        { name: 'Browser', x: 250 },
        { name: 'Backup Script', x: 470 },
    ];
    const kernelJobs = [
        { name: 'SCHEDULER', sub: 'কে কখন CPU পাবে', x: 30 },
        { name: 'MEMORY', sub: 'কে কতটুকু RAM পাবে', x: 214 },
        { name: 'FILESYSTEM', sub: 'Disk এর দায়িত্ব', x: 398 },
        { name: 'NETWORK', sub: 'Packet আনা নেওয়া', x: 582 },
    ];
    const hw = [
        { name: 'CPU', x: 30 },
        { name: 'RAM', x: 214 },
        { name: 'DISK', x: 398 },
        { name: 'NETWORK CARD', x: 582 },
    ];

    return (
        <Sketch
            label='Diagram: দুইটা ঘর, একটা দরজা'
            height={340}
            viewBox='0 0 760 340'
            caption='আপনার কোড যা কিছু চায়, সবই Kernel এর কাছে চাইতে হয়। ওই চাওয়ার নাম System Call, আর ওটাই দুই ঘরের মাঝের একমাত্র দরজা।'>
            <defs>
                <marker id='os-a' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                    <path d='M0,0 L0,6 L8,3 z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* user space */}
            <rect x={14} y={26} width={732} height={72} fill='transparent'
                stroke='currentColor' strokeOpacity={0.3} strokeWidth='1' strokeDasharray='5 4' />
            <T x={22} y={20} size={9} anchor='start' bold accent>USER SPACE</T>
            {apps.map(a => (
                <SketchBox key={a.name} x={a.x} y={40} w={160} h={44} title={a.name} />
            ))}
            <T x={700} y={68} size={9} anchor='end' body opacity={0.75}>
                এখানে হার্ডওয়্যার ছোঁয়া যায় না
            </T>

            {/* the doorway */}
            <path d='M 110 100 L 110 128' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#os-a)' />
            <path d='M 330 100 L 330 128' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#os-a)' />
            <path d='M 550 100 L 550 128' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#os-a)' />
            <rect x={266} y={110} width={228} height={28}
                fill='var(--primary)' fillOpacity={0.14}
                stroke='var(--primary)' strokeWidth='1.2' />
            <T x={380} y={129} size={11} bold accent>SYSTEM CALL</T>

            {/* kernel */}
            <rect x={14} y={150} width={732} height={82}
                fill='var(--primary)' fillOpacity={0.05}
                stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1.2' />
            <T x={22} y={166} size={9} anchor='start' bold accent>KERNEL</T>
            {kernelJobs.map(k => (
                <SketchBox key={k.name} x={k.x} y={176} w={148} h={44}
                    title={k.name} sub={k.sub} accent />
            ))}

            {/* hardware */}
            <path d='M 380 234 L 380 258' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#os-a)' />
            <rect x={14} y={266} width={732} height={58} fill='transparent'
                stroke='currentColor' strokeOpacity={0.3} strokeWidth='1' strokeDasharray='5 4' />
            <T x={22} y={260} size={9} anchor='start' bold accent>HARDWARE</T>
            {hw.map(h => (
                <SketchBox key={h.name} x={h.x} y={278} w={148} h={36} title={h.name} />
            ))}
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 2 */

/** One core, three programs, and the illusion of everything at once. */
export function SchedulerTimelineDiagram() {
    const slices = [
        { p: 0, x: 60, w: 62 },
        { p: 1, x: 126, w: 48 },
        { p: 2, x: 178, w: 70 },
        { p: 0, x: 252, w: 54 },
        { p: 1, x: 310, w: 66 },
        { p: 0, x: 380, w: 44 },
        { p: 2, x: 428, w: 58 },
        { p: 1, x: 490, w: 52 },
        { p: 0, x: 546, w: 68 },
        { p: 2, x: 618, w: 60 },
    ];
    const names = ['API', 'Browser', 'Backup'];
    const shade = [0.55, 0.32, 0.16];

    return (
        <Sketch
            label='Diagram: এক Core, তিনটা Program'
            height={280}
            viewBox='0 0 760 280'
            caption='প্রতিটা টুকরো কয়েক মিলিসেকেন্ডের। এত দ্রুত অদলবদল হয় যে আমাদের চোখে তিনটাই একসাথে চলছে মনে হয়। প্রতিটা অদলবদলের নাম Context Switch, আর প্রতিটাতেই অল্প একটু সময় নষ্ট হয়।'>
            {/* who wants the core */}
            {names.map((n, i) => (
                <g key={n}>
                    <T x={50} y={46 + i * 34} size={11} anchor='end' bold accent={i === 0}>
                        {n}
                    </T>
                    <path d={`M 60 ${41 + i * 34} L 700 ${41 + i * 34}`}
                        stroke='currentColor' strokeOpacity={0.15} strokeWidth='1' strokeDasharray='3 5' />
                    {slices.filter(s => s.p === i).map(s => (
                        <rect key={s.x} x={s.x} y={30 + i * 34} width={s.w} height={22}
                            fill='var(--primary)' fillOpacity={shade[i]}
                            stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1' />
                    ))}
                </g>
            ))}
            <T x={710} y={46} size={9} anchor='start' body opacity={0.75}>
                কে কখন
            </T>
            <T x={710} y={66} size={9} anchor='start' body opacity={0.75}>
                চলছে
            </T>

            {/* the single core */}
            <path d='M 14 156 L 746 156' stroke='currentColor' strokeOpacity={0.2} strokeWidth='1' />
            <T x={50} y={190} size={11} anchor='end' bold>CORE ১</T>
            {slices.map(s => (
                <g key={`c-${s.x}`}>
                    <rect x={s.x} y={174} width={s.w} height={26}
                        fill='var(--primary)' fillOpacity={shade[s.p]}
                        stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1' />
                    <T x={s.x + s.w / 2} y={191} size={8}>
                        {names[s.p]}
                    </T>
                </g>
            ))}
            <T x={380} y={222} size={9} body opacity={0.8}>
                Core কখনো খালি বসে থাকে না, শুধু হাত বদলায়
            </T>

            {/* switches */}
            {slices.slice(1).map(s => (
                <path key={`s-${s.x}`} d={`M ${s.x - 2} 168 L ${s.x - 2} 206`}
                    stroke='var(--primary)' strokeOpacity={0.9} strokeWidth='1' />
            ))}
            <T x={14} y={252} size={9} anchor='start' body opacity={0.8}>
                প্রতিটা খাড়া দাগ একটা Context Switch। একবার Switch এ কয়েক মাইক্রোসেকেন্ড যায়,
            </T>
            <T x={14} y={270} size={9} anchor='start' body opacity={0.8}>
                তাই হাজার হাজার Switch হলে সেটাও গোনায় চলে আসে।
            </T>
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 3 */

/** Every process thinks it owns the machine. */
export function VirtualMemoryDiagram() {
    return (
        <SketchSplit
            label='Diagram: Process যা দেখে, আর যা আসলে আছে'
            caption='প্রতিটা Process ভাবে পুরো Memory তার একার। Kernel পেছনে একটা ম্যাপ রাখে, যেটা বলে কোন Virtual ঠিকানা আসলে RAM এর কোথায় বসে আছে। এই ম্যাপের কারণেই একটা Process অন্যটার Memory ছুঁতে পারে না।'
            panels={[
                {
                    title: 'Process যা দেখে',
                    sub: 'Virtual Memory',
                    viewBox: '0 0 320 250',
                    height: 250,
                    children: (
                        <>
                            <T x={10} y={18} size={9} anchor='start' opacity={0.7}>
                                API Process
                            </T>
                            {['Code', 'Heap', 'ফাঁকা', 'Stack'].map((n, i) => (
                                <g key={n}>
                                    <rect x={10} y={30 + i * 46} width={300} height={38}
                                        fill={n === 'ফাঁকা' ? 'transparent' : 'var(--primary)'}
                                        fillOpacity={n === 'ফাঁকা' ? 0 : 0.12}
                                        stroke='var(--primary)'
                                        strokeOpacity={n === 'ফাঁকা' ? 0.3 : 0.7}
                                        strokeWidth='1.2'
                                        strokeDasharray={n === 'ফাঁকা' ? '4 3' : undefined} />
                                    <T x={160} y={53 + i * 46} size={11} accent={n !== 'ফাঁকা'}>
                                        {n}
                                    </T>
                                </g>
                            ))}
                            <T x={160} y={238} size={9} body opacity={0.8}>
                                সাজানো, পরিষ্কার, শুরু থেকে শেষ
                            </T>
                        </>
                    ),
                },
                {
                    title: 'আসলে RAM এ',
                    sub: 'Physical Memory',
                    viewBox: '0 0 320 250',
                    height: 250,
                    children: (
                        <>
                            <T x={10} y={18} size={9} anchor='start' opacity={0.7}>
                                পুরো মেশিনের RAM
                            </T>
                            {Array.from({ length: 24 }).map((_, i) => {
                                const col = i % 6;
                                const row = Math.floor(i / 6);
                                const mine = [1, 4, 7, 12, 15, 20].includes(i);
                                const other = [2, 9, 17, 22].includes(i);
                                return (
                                    <rect key={i}
                                        x={10 + col * 51} y={30 + row * 44}
                                        width={43} height={36}
                                        fill={mine ? 'var(--primary)' : other ? 'currentColor' : 'transparent'}
                                        fillOpacity={mine ? 0.35 : other ? 0.15 : 0}
                                        stroke={mine ? 'var(--primary)' : 'currentColor'}
                                        strokeOpacity={mine ? 0.9 : 0.3}
                                        strokeWidth='1' />
                                );
                            })}
                            <rect x={10} y={214} width={16} height={12}
                                fill='var(--primary)' fillOpacity={0.35}
                                stroke='var(--primary)' strokeWidth='1' />
                            <T x={34} y={224} size={9} anchor='start' body opacity={0.8}>
                                এই Process এর Page
                            </T>
                            <T x={160} y={244} size={9} body opacity={0.8}>
                                এলোমেলো, আর অন্যদের সাথে মেশানো
                            </T>
                        </>
                    ),
                },
            ]}
        />
    );
}
