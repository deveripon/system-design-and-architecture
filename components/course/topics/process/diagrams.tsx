import {
    Sketch,
    SketchBox,
    SketchSplit,
    SketchText as T,
} from '../../sketch';

/* ------------------------------------------------------------------ 1 */

/** Separate kitchens, or many cooks in one kitchen. */
export function ProcessVsThreadDiagram() {
    return (
        <SketchSplit
            label='Diagram: আলাদা রান্নাঘর আর একই রান্নাঘর'
            caption='দুইটা Process মানে দুইটা আলাদা রান্নাঘর, একজন আরেকজনের ফ্রিজে হাত দিতে পারে না। একটা Process এর ভেতরের Thread গুলো একই রান্নাঘরের কয়েকজন রাঁধুনি, সবাই একই ফ্রিজ আর একই টেবিল ব্যবহার করেন। এখানেই সুবিধা, আর এখানেই বিপদ।'
            panels={[
                {
                    title: 'দুইটা PROCESS',
                    sub: 'আলাদা Memory',
                    viewBox: '0 0 320 260',
                    height: 260,
                    children: (
                        <>
                            {[0, 1].map(i => (
                                <g key={i}>
                                    <rect x={10 + i * 158} y={20} width={142} height={186}
                                        fill='transparent' stroke='var(--primary)'
                                        strokeOpacity={0.6} strokeWidth='1.2'
                                        strokeDasharray='5 4' />
                                    <T x={81 + i * 158} y={40} size={10} bold accent>
                                        {`Process ${i + 1}`}
                                    </T>
                                    <SketchBox x={22 + i * 158} y={52} w={118} h={38}
                                        title='Thread' />
                                    <SketchBox x={22 + i * 158} y={98} w={118} h={44}
                                        title='নিজের Memory' />
                                    <SketchBox x={22 + i * 158} y={150} w={118} h={40}
                                        title='নিজের ফাইল' />
                                </g>
                            ))}
                            <T x={160} y={228} size={9} body opacity={0.85}>
                                একজন আরেকজনের কিছুই ছুঁতে পারে না
                            </T>
                            <T x={160} y={248} size={9} body opacity={0.7}>
                                তাই একটা মরলেও অন্যটা দিব্যি চলে
                            </T>
                        </>
                    ),
                },
                {
                    title: 'এক PROCESS, তিন THREAD',
                    sub: 'একই Memory',
                    viewBox: '0 0 320 260',
                    height: 260,
                    children: (
                        <>
                            <rect x={10} y={20} width={300} height={186}
                                fill='transparent' stroke='var(--primary)'
                                strokeOpacity={0.6} strokeWidth='1.2' strokeDasharray='5 4' />
                            <T x={160} y={40} size={10} bold accent>একটা Process</T>
                            {[0, 1, 2].map(i => (
                                <SketchBox key={i} x={20 + i * 96} y={52} w={88} h={38}
                                    title={`Thread ${i + 1}`} accent />
                            ))}
                            <SketchBox x={20} y={102} w={280} h={44}
                                title='একই Memory, সবাই ছুঁতে পারে' />
                            <SketchBox x={20} y={154} w={280} h={38}
                                title='একই খোলা ফাইল' />
                            <T x={160} y={228} size={9} body opacity={0.85}>
                                ডেটা ভাগ করা সহজ, কারণ সব একই জায়গায়
                            </T>
                            <T x={160} y={248} size={9} body opacity={0.7}>
                                কিন্তু একজন ভুল করলে পুরো Process যায়
                            </T>
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------ 2 */

/** The distinction people mix up most. */
export function ConcurrencyVsParallelismDiagram() {
    return (
        <Sketch
            label='Diagram: Concurrency আর Parallelism এক জিনিস নয়'
            height={300}
            viewBox='0 0 760 300'
            caption='Concurrency মানে একজন অনেক কাজ সামলাচ্ছেন, একটা অপেক্ষায় গেলে অন্যটা ধরছেন। Parallelism মানে সত্যিই একসাথে অনেকজন কাজ করছেন। এক Core এ Concurrency হয়, Parallelism হতে হলে একাধিক Core লাগে।'>
            {/* concurrency */}
            <T x={14} y={22} size={10} anchor='start' bold accent>CONCURRENCY</T>
            <T x={150} y={22} size={9} anchor='start' opacity={0.7}>
                একজন রাঁধুনি, দুইটা রান্না
            </T>
            <path d='M 90 66 L 700 66' stroke='currentColor' strokeOpacity={0.25} strokeWidth='1' />
            {[
                { x: 90, w: 90, t: 'ভাত বসালেন' },
                { x: 184, w: 120, t: 'ফুটতে দিলেন, ডাল ধরলেন' },
                { x: 308, w: 96, t: 'ডাল নামালেন' },
                { x: 408, w: 110, t: 'ভাতে ফিরলেন' },
                { x: 522, w: 100, t: 'দুইটাই শেষ' },
            ].map(s => (
                <g key={s.x}>
                    <rect x={s.x} y={42} width={s.w} height={24}
                        fill='var(--primary)' fillOpacity={0.35}
                        stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1' />
                </g>
            ))}
            <T x={380} y={92} size={9} body opacity={0.8}>
                এক সময়ে হাত একটাতেই, কিন্তু কোনো কাজ থেমে থাকে না
            </T>
            <T x={14} y={116} size={9} anchor='start' body opacity={0.7}>
                অপেক্ষার সময়টা কাজে লাগানোই এখানে আসল কৌশল
            </T>

            <path d='M 14 140 L 746 140' stroke='currentColor' strokeOpacity={0.2} strokeWidth='1' />

            {/* parallelism */}
            <T x={14} y={172} size={10} anchor='start' bold accent>PARALLELISM</T>
            <T x={150} y={172} size={9} anchor='start' opacity={0.7}>
                দুইজন রাঁধুনি, দুইটা চুলা
            </T>
            {['রাঁধুনি ১: ভাত', 'রাঁধুনি ২: ডাল'].map((n, i) => (
                <g key={n}>
                    <T x={80} y={210 + i * 40} size={9} anchor='end' opacity={0.8}>
                        {n}
                    </T>
                    <rect x={90} y={194 + i * 40} width={430} height={24}
                        fill='var(--primary)' fillOpacity={0.35}
                        stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1' />
                </g>
            ))}
            <T x={640} y={218} size={9} body opacity={0.8}>
                সময় প্রায় অর্ধেক
            </T>
            <T x={14} y={274} size={9} anchor='start' body opacity={0.7}>
                Node.js এক Thread এ Concurrency করে। Parallelism চাইলে Cluster বা Worker Thread লাগে।
            </T>
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 3 */

/** How a lost update happens, step by step. */
export function RaceConditionDiagram() {
    const rows = [
        { t: 'Thread A', y: 60, steps: ['seat পড়ল: ১', '', 'হিসাব করল: ১ - ১ = ০', 'লিখল: ০'] },
        { t: 'Thread B', y: 150, steps: ['', 'seat পড়ল: ১', 'হিসাব করল: ১ - ১ = ০', 'লিখল: ০'] },
    ];
    return (
        <Sketch
            label='Diagram: একই Seat দুইজনকে বিক্রি'
            height={300}
            viewBox='0 0 760 300'
            caption='দুইজন একই সময়ে শেষ Seat টা দেখল, দুইজনই দেখল একটা খালি আছে, আর দুইজনই বুক করে ফেলল। কেউ ভুল কোড লেখেনি, তবু ফল ভুল। পড়া, হিসাব করা আর লেখা, এই তিনটা ধাপের মাঝখানে অন্যজন ঢুকে পড়তে পারে বলেই এটা ঘটে।'>
            {[0, 1, 2, 3].map(i => (
                <T key={i} x={150 + i * 150} y={36} size={9} accent bold>
                    {`সময় ${i + 1}`}
                </T>
            ))}
            <path d='M 90 44 L 700 44' stroke='currentColor' strokeOpacity={0.25} strokeWidth='1' />

            {rows.map(row => (
                <g key={row.t}>
                    <T x={80} y={row.y + 30} size={11} anchor='end' bold accent>
                        {row.t}
                    </T>
                    {row.steps.map((s, i) =>
                        s ? (
                            <g key={i}>
                                <rect x={92 + i * 150} y={row.y + 10} width={140} height={32}
                                    fill='var(--primary)' fillOpacity={0.12}
                                    stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1' />
                                <T x={162 + i * 150} y={row.y + 30} size={9}>
                                    {s}
                                </T>
                            </g>
                        ) : null
                    )}
                </g>
            ))}

            <path d='M 14 214 L 746 214' stroke='currentColor' strokeOpacity={0.2} strokeWidth='1' />
            <T x={14} y={240} size={10} anchor='start' bold>ফলাফল</T>
            <SketchBox x={92} y={224} w={200} h={40} title='Seat বাকি: ০' sub='Database এ' />
            <SketchBox x={306} y={224} w={200} h={40} title='Booking হয়েছে: ২টা' sub='বাস্তবে' accent />
            <T x={530} y={248} size={9} anchor='start' body opacity={0.85}>
                একটা Seat, দুইজন যাত্রী
            </T>
            <T x={14} y={286} size={9} anchor='start' body opacity={0.75}>
                সমাধান হলো তিনটা ধাপকে এমনভাবে বাঁধা, যাতে মাঝখানে কেউ ঢুকতে না পারে। সেটাই Lock।
            </T>
        </Sketch>
    );
}
