import { Sketch, SketchBox, SketchSplit, SketchText as T } from '../../sketch';

/* ------------------------------------------------------------------ 1 */

/** A spinning platter with a moving arm, next to flash with no moving parts. */
export function HddVsSsdDiagram() {
    return (
        <SketchSplit
            label='Diagram: HDD আর SSD এর ভেতরে'
            caption={
                <span className='block space-y-1'>
                    <span className='block'>
                        HDD তে প্রতিটা Read এর জন্য Head কে সরতে হয় আর Platter কে
                        ঘুরতে হয়, তাই Random Read অনেক ধীর। SSD তে নড়ার কিছু নেই,
                        তাই যেকোনো Cell থেকে Read করতে প্রায় একই সময় লাগে।
                    </span>
                    <span className='block'>
                        একটা Random Read এ HDD নেয় প্রায় ১০ মিলিসেকেন্ড, SSD নেয়
                        ০.১ মিলিসেকেন্ড। প্রায় ১০০ গুণ তফাত।
                    </span>
                </span>
            }
            panels={[
                {
                    title: 'HDD',
                    sub: 'ঘুরন্ত Platter, নড়া Head',
                    viewBox: '0 0 320 250',
                    height: 250,
                    children: (
                        <>
                            <defs>
                                <marker id='st-a' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'>
                                    <path d='M0,0 L0,6 L8,3 z' fill='var(--primary)' />
                                </marker>
                            </defs>

                            <circle cx={140} cy={118} r={86} fill='transparent'
                                stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.2' />
                            <circle cx={140} cy={118} r={56} fill='transparent'
                                stroke='currentColor' strokeOpacity={0.25} strokeWidth='1' strokeDasharray='3 4' />
                            <circle cx={140} cy={118} r={28} fill='transparent'
                                stroke='currentColor' strokeOpacity={0.25} strokeWidth='1' strokeDasharray='3 4' />
                            <circle cx={140} cy={118} r={7} fill='currentColor' fillOpacity={0.5} />

                            <path d='M 300 44 L 184 96' stroke='var(--primary)' strokeWidth='3' strokeLinecap='round' />
                            <circle cx={300} cy={44} r={6} fill='var(--primary)' />
                            <circle cx={184} cy={96} r={4} fill='var(--primary)' />
                            <T x={262} y={80} size={9} anchor='start' accent bold>HEAD</T>

                            <path d='M 140 22 A 98 98 0 0 1 222 64' fill='none'
                                stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1.2'
                                markerEnd='url(#st-a)' />
                            <T x={204} y={34} size={9} anchor='start' accent>ঘুরছে</T>

                            <T x={140} y={230} size={9} body opacity={0.8}>
                                ডেটা পেতে Head সরে, তারপর Platter ঘোরে
                            </T>
                        </>
                    ),
                },
                {
                    title: 'SSD',
                    sub: 'নড়ার কিছু নেই',
                    viewBox: '0 0 320 250',
                    height: 250,
                    children: (
                        <>
                            {Array.from({ length: 20 }).map((_, i) => {
                                const col = i % 4;
                                const row = Math.floor(i / 4);
                                const hot = i === 6 || i === 13;
                                return (
                                    <g key={i}>
                                        <rect
                                            x={8 + col * 76}
                                            y={12 + row * 40}
                                            width={64}
                                            height={32}
                                            fill={hot ? 'var(--primary)' : 'transparent'}
                                            fillOpacity={hot ? 0.18 : 0}
                                            stroke={hot ? 'var(--primary)' : 'currentColor'}
                                            strokeOpacity={hot ? 1 : 0.3}
                                            strokeWidth='1'
                                        />
                                        <T x={40 + col * 76} y={33 + row * 40} size={9} accent={hot}>
                                            {i + 1}
                                        </T>
                                    </g>
                                );
                            })}
                            <T x={160} y={230} size={9} body opacity={0.8}>
                                যেকোনো Cell এ সরাসরি পৌঁছানো যায়
                            </T>
                        </>
                    ),
                },
            ]}
        />
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
    { name: 'Sequential Read, SSD', bar: 100, note: 'পরপর Read, যেমন Log Write' },
    { name: 'Random Read, SSD', bar: 42, note: 'এলোমেলো Read, যেমন Database Index' },
    { name: 'Sequential Read, HDD', bar: 26, note: 'পরপর হলে HDD ও চলনসই' },
    { name: 'Random Read, HDD', bar: 3, note: 'এলোমেলো হলে HDD এখানেই হারে' },
];

/** The one storage idea that changes how you design. */
export function SequentialVsRandomDiagram() {
    return (
        <Sketch
            label='Diagram: Sequential বনাম Random'
            height={250}
            viewBox='0 0 760 250'
            caption='বারগুলো আপেক্ষিক, আসল সংখ্যা যন্ত্র অনুযায়ী বদলায়। মনে রাখার কথাটা হলো, একই যন্ত্রে Sequential Read আর Random Read এর মধ্যে বিশাল তফাত। এই কারণেই Database এর Index এত জরুরি।'>
            <T x={14} y={22} size={9} anchor='start' bold accent>কীভাবে Read হচ্ছে</T>
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
                Log আর Backup Sequential Write করে, তাই সস্তা Disk এও চলে। Database এলোমেলো Read করে, তাই তার SSD দরকার।
            </T>
        </Sketch>
    );
}
