import { Sketch, SketchBox, SketchText as T } from '../../sketch';

/* ------------------------------------------------------------------ 1 */

/** A spinning platter with a moving arm, next to flash with no moving parts. */
export function HddVsSsdDiagram() {
    return (
        <Sketch
            label='Diagram: HDD আর SSD এর ভেতরে'
            height={330}
            viewBox='0 0 760 330'
            caption='HDD তে প্রতিটা পড়ার জন্য হাতটাকে সরতে হয় আর থালাটাকে ঘুরতে হয়, তাই ছড়ানো ডেটা পড়া অনেক ধীর। SSD তে নড়ার কিছু নেই, তাই যেকোনো ঘর থেকে পড়তে প্রায় একই সময় লাগে।'>
            <defs>
                <marker id='st-a' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                    <path d='M0,0 L0,6 L8,3 z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* HDD */}
            <T x={14} y={22} size={10} anchor='start' bold accent>HDD</T>
            <T x={70} y={22} size={9} anchor='start' opacity={0.7}>ঘুরন্ত থালা আর নড়া হাত</T>
            <rect x={14} y={34} width={350} height={222} fill='transparent'
                stroke='currentColor' strokeOpacity={0.3} strokeWidth='1' strokeDasharray='5 4' />

            <circle cx={150} cy={145} r={88} fill='transparent' stroke='currentColor'
                strokeOpacity={0.4} strokeWidth='1.2' />
            <circle cx={150} cy={145} r={58} fill='transparent' stroke='currentColor'
                strokeOpacity={0.25} strokeWidth='1' strokeDasharray='3 4' />
            <circle cx={150} cy={145} r={30} fill='transparent' stroke='currentColor'
                strokeOpacity={0.25} strokeWidth='1' strokeDasharray='3 4' />
            <circle cx={150} cy={145} r={7} fill='currentColor' fillOpacity={0.5} />

            {/* the arm */}
            <path d='M 322 66 L 196 122' stroke='var(--primary)' strokeWidth='3' strokeLinecap='round' />
            <circle cx={322} cy={66} r={6} fill='var(--primary)' />
            <circle cx={196} cy={122} r={4} fill='var(--primary)' />
            <T x={278} y={104} size={9} anchor='start' accent bold>হাত</T>

            {/* the spin */}
            <path d='M 150 42 A 103 103 0 0 1 236 88' fill='none' stroke='var(--primary)'
                strokeOpacity={0.7} strokeWidth='1.2' markerEnd='url(#st-a)' />
            <T x={214} y={54} size={9} anchor='start' accent>ঘুরছে</T>

            <T x={150} y={252} size={9} body opacity={0.8}>
                ডেটা পেতে হাত সরে, তারপর থালা ঘোরে
            </T>

            {/* SSD */}
            <T x={396} y={22} size={10} anchor='start' bold accent>SSD</T>
            <T x={446} y={22} size={9} anchor='start' opacity={0.7}>নড়ার কিছু নেই</T>
            <rect x={396} y={34} width={350} height={222} fill='transparent'
                stroke='currentColor' strokeOpacity={0.3} strokeWidth='1' strokeDasharray='5 4' />

            {Array.from({ length: 20 }).map((_, i) => {
                const col = i % 5;
                const row = Math.floor(i / 5);
                const hot = i === 7 || i === 13;
                return (
                    <g key={i}>
                        <rect
                            x={420 + col * 62}
                            y={62 + row * 46}
                            width={54}
                            height={38}
                            fill={hot ? 'var(--primary)' : 'transparent'}
                            fillOpacity={hot ? 0.18 : 0}
                            stroke={hot ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={hot ? 1 : 0.3}
                            strokeWidth='1'
                        />
                        <T x={447 + col * 62} y={85 + row * 46} size={9} accent={hot}>
                            {i + 1}
                        </T>
                    </g>
                );
            })}
            <T x={571} y={252} size={9} body opacity={0.8}>
                যেকোনো ঘরে সরাসরি পৌঁছানো যায়
            </T>

            <path d='M 14 278 L 746 278' stroke='currentColor' strokeOpacity={0.2} strokeWidth='1' />
            <T x={14} y={298} size={9} anchor='start' body opacity={0.85}>
                একটা ছড়ানো পড়ায় HDD নেয় প্রায় ১০ মিলিসেকেন্ড, SSD নেয় ০.১ মিলিসেকেন্ড। প্রায় ১০০ গুণ তফাত।
            </T>
            <T x={14} y={320} size={9} anchor='start' body opacity={0.7}>
                HDD এর যন্ত্রাংশ নড়ে, তাই ধাক্কা লাগলে নষ্ট হতে পারে। SSD এর ঘর বারবার লিখলে ক্ষয়ে যায়।
            </T>
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 2 */

/** Name to inode to blocks, and why deleting is instant. */
export function FilesystemTreeDiagram() {
    return (
        <Sketch
            label='Diagram: নাম থেকে আসল ডেটা'
            height={310}
            viewBox='0 0 760 310'
            caption='ফাইলের নাম আর ফাইলের ডেটা আলাদা জায়গায় থাকে। মাঝখানে থাকে inode, যেটা বলে ডেটা কোন কোন Block এ আছে। এই কারণেই বড় ফাইল Delete করা চোখের পলকে হয়ে যায়।'>
            <defs>
                <marker id='fs-a' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                    <path d='M0,0 L0,6 L8,3 z' fill='var(--primary)' />
                </marker>
            </defs>

            <T x={14} y={22} size={9} anchor='start' bold accent>১. নাম</T>
            <SketchBox x={14} y={34} w={190} h={64} title='logo.png' sub='Directory Entry' />
            <T x={109} y={118} size={9} body opacity={0.75}>ফোল্ডারে শুধু নাম আর নম্বর</T>

            <path d='M 210 66 L 258 66' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#fs-a)' />

            <T x={266} y={22} size={9} anchor='start' bold accent>২. INODE</T>
            <SketchBox x={266} y={34} w={200} h={64} title='inode 41207' sub='সাইজ, মালিক, Block তালিকা' accent />
            <T x={366} y={118} size={9} body opacity={0.75}>ফাইলের সব খবর এখানে</T>

            <path d='M 472 66 L 520 66' stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#fs-a)' />

            <T x={528} y={22} size={9} anchor='start' bold accent>৩. BLOCK</T>
            {[0, 1, 2, 3].map(i => (
                <g key={i}>
                    <rect x={528 + (i % 2) * 110} y={34 + Math.floor(i / 2) * 36}
                        width={100} height={28}
                        fill='var(--primary)' fillOpacity={0.14}
                        stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1' />
                    <T x={578 + (i % 2) * 110} y={53 + Math.floor(i / 2) * 36} size={9}>
                        {`Block ${1204 + i * 7}`}
                    </T>
                </g>
            ))}
            <T x={638} y={126} size={9} body opacity={0.75}>আসল ছবিটা এখানে টুকরো টুকরো</T>

            <path d='M 14 156 L 746 156' stroke='currentColor' strokeOpacity={0.2} strokeWidth='1' />

            {/* delete */}
            <T x={14} y={182} size={10} anchor='start' bold>Delete করলে কী হয়</T>
            <SketchBox x={14} y={196} w={190} h={54} title='logo.png' sub='নামটা মুছে গেল' dashed />
            <T x={230} y={228} size={9} anchor='start' body opacity={0.85}>
                শুধু ফোল্ডারের এই লাইনটা মুছে যায়, আর inode এর গোনা এক কমে।
            </T>
            <T x={230} y={250} size={9} anchor='start' body opacity={0.85}>
                Block গুলোতে ডেটা তখনো পড়ে থাকে, শুধু জায়গাটা এখন ফাঁকা বলে ধরা হয়।
            </T>
            <T x={14} y={286} size={9} anchor='start' body opacity={0.7}>
                তাই ২ GB ফাইল মুছতেও সময় লাগে না, আর তাই মুছে ফেলা ফাইল অনেক সময় ফেরত আনা যায়।
            </T>
        </Sketch>
    );
}

/* ------------------------------------------------------------------ 3 */

const IO = [
    { name: 'Sequential, SSD', bar: 100, note: 'একটানা পড়া, যেমন Log লেখা' },
    { name: 'Random, SSD', bar: 42, note: 'ছড়ানো পড়া, যেমন Database Index' },
    { name: 'Sequential, HDD', bar: 26, note: 'একটানা হলে HDD ও চলনসই' },
    { name: 'Random, HDD', bar: 3, note: 'ছড়ানো হলে HDD এখানেই হারে' },
];

/** The one storage idea that changes how you design. */
export function SequentialVsRandomDiagram() {
    return (
        <Sketch
            label='Diagram: একটানা বনাম ছড়ানো'
            height={250}
            viewBox='0 0 760 250'
            caption='বারগুলো আপেক্ষিক, আসল সংখ্যা যন্ত্র অনুযায়ী বদলায়। মনে রাখার কথাটা হলো, একই যন্ত্রে একটানা পড়া আর ছড়ানো পড়ার মধ্যে বিশাল তফাত। এই কারণেই Database এর Index এত জরুরি।'>
            <T x={14} y={22} size={9} anchor='start' bold accent>কীভাবে পড়া হচ্ছে</T>
            <T x={746} y={22} size={9} anchor='end' bold accent>আপেক্ষিক গতি</T>

            {IO.map((row, i) => {
                const y = 44 + i * 46;
                return (
                    <g key={row.name}>
                        <T x={14} y={y + 18} size={11} anchor='start' bold accent={i === 0}>
                            {row.name}
                        </T>
                        <rect x={210} y={y + 4} width={(row.bar / 100) * 420} height={22}
                            fill='var(--primary)' fillOpacity={i === 3 ? 0.25 : 0.6}
                            stroke='var(--primary)' strokeOpacity={0.8} strokeWidth='1' />
                        <T x={746} y={y + 20} size={9} anchor='end' body opacity={0.8}>
                            {row.note}
                        </T>
                    </g>
                );
            })}

            <path d='M 14 232 L 746 232' stroke='currentColor' strokeOpacity={0.2} strokeWidth='1' />
            <T x={14} y={248} size={9} anchor='start' body opacity={0.8}>
                Log আর Backup একটানা লেখে, তাই সস্তা Disk এও ভালো চলে। Database ছড়িয়ে পড়ে, তাই তার SSD দরকার।
            </T>
        </Sketch>
    );
}
