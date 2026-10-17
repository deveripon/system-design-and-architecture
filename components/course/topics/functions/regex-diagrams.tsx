import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. LIKE পুরো লেখা ঢাকে, Regex যেকোনো জায়গায় খোঁজে                          */
/* ------------------------------------------------------------------------- */

const TITLE = 'Saint Martin Island Escape';
const CHAR_W = 12.4;

function TitleStrip({
    y,
    highlight,
    tone,
}: {
    y: number;
    /** [start, end) character range to mark, or null for none. */
    highlight: [number, number] | null;
    tone: 'match' | 'miss';
}) {
    const x0 = 20;
    const w = TITLE.length * CHAR_W + 16;
    return (
        <g>
            <rect
                x={x0}
                y={y}
                width={w}
                height={34}
                fill='currentColor'
                fillOpacity={0.04}
                stroke='currentColor'
                strokeOpacity={0.4}
                strokeWidth='1.1'
            />
            {highlight && (
                <rect
                    x={x0 + 8 + highlight[0] * CHAR_W}
                    y={y + 4}
                    width={(highlight[1] - highlight[0]) * CHAR_W}
                    height={26}
                    fill={tone === 'match' ? 'var(--primary)' : 'currentColor'}
                    fillOpacity={tone === 'match' ? 0.18 : 0.08}
                    stroke={tone === 'match' ? 'var(--primary)' : 'currentColor'}
                    strokeOpacity={tone === 'match' ? 0.9 : 0.4}
                    strokeDasharray={tone === 'match' ? undefined : '4 3'}
                />
            )}
            <SketchText x={x0 + 8} y={y + 22} anchor='start' size={11.5}>
                {TITLE}
            </SketchText>
        </g>
    );
}

export function LikeVsRegexSplit() {
    return (
        <SketchSplit
            label='LIKE বনাম Regex: কতটুকু মিলতে হবে'
            caption={
                <>
                    একই Title, একই শব্দ Saint। LIKE এর Pattern কে পুরো লেখাটা ঢাকতে হয়, তাই শুধু
                    Saint লিখলে মেলে না, লাগে Saint%। Regex শুধু জানতে চায় লেখার কোথাও এই অংশটা
                    আছে কিনা, তাই Saint লিখলেই মেলে। পুরো লেখা মেলাতে চাইলে Regex এ নিজে ^ আর $
                    বসাতে হয়।
                </>
            }
            panels={[
                {
                    title: "title LIKE 'Saint'",
                    sub: 'পুরো লেখা = Pattern? না',
                    viewBox: '0 0 360 150',
                    height: 150,
                    minWidth: 320,
                    children: (
                        <g>
                            <TitleStrip y={20} highlight={[0, TITLE.length]} tone='miss' />
                            <SketchText x={20} y={84} anchor='start' size={10} body>
                                Pattern কে পুরো ২৬টা অক্ষর ঢাকতে হবে
                            </SketchText>
                            <SketchText x={20} y={106} anchor='start' size={10} body>
                                Saint ঢাকে শুধু প্রথম ৫টা
                            </SketchText>
                            <SketchText x={20} y={132} anchor='start' size={11} bold>
                                ফল: false, ০ Row
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: "title ~ 'Saint'",
                    sub: 'লেখার কোথাও আছে? হ্যাঁ',
                    viewBox: '0 0 360 150',
                    height: 150,
                    minWidth: 320,
                    children: (
                        <g>
                            <TitleStrip y={20} highlight={[0, 5]} tone='match' />
                            <SketchText x={20} y={84} anchor='start' size={10} body>
                                Regex পুরো লেখার ভেতর একটা মিল খোঁজে
                            </SketchText>
                            <SketchText x={20} y={106} anchor='start' size={10} body>
                                প্রথম ৫টা অক্ষরেই মিল পেয়ে গেল
                            </SketchText>
                            <SketchText x={20} y={132} anchor='start' size={11} bold accent>
                                ফল: true, ২ Row
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 2. একটা Pattern এর টুকরোগুলো                                                */
/* ------------------------------------------------------------------------- */

const PARTS = [
    { token: '^', meaning: 'এখান থেকে শুরু', detail: 'লেখার একদম প্রথম' },
    { token: '(880|0)', meaning: '880 অথবা 0', detail: 'দুটোর যেকোনো একটা' },
    { token: '1', meaning: 'ঠিক 1 অঙ্কটা', detail: 'সাধারণ অক্ষর, হুবহু' },
    { token: '\\d{9}', meaning: 'ঠিক ৯টা অঙ্ক', detail: '\\d অঙ্ক, {9} সংখ্যা' },
    { token: '$', meaning: 'এখানেই শেষ', detail: 'পরে আর কিছু না' },
];

export function RegexAnatomyDiagram() {
    const widths = [60, 150, 60, 140, 60];
    const gap = 14;
    const total = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);
    const start = (840 - total) / 2;
    const xs = widths.map((_, i) => start + widths.slice(0, i).reduce((a, b) => a + b, 0) + i * gap);
    return (
        <Sketch
            label='একটা Pattern পড়া: বাংলাদেশের মোবাইল নম্বর'
            height={230}
            minWidth={840}
            viewBox='0 0 840 230'
            caption={
                <>
                    Pattern টা বাঁ থেকে ডানে পড়ুন, এক টুকরো এক টুকরো করে। পুরোটা একসাথে বলে: লেখাটা
                    শুরু হবে 880 বা 0 দিয়ে, তারপর 1, তারপর ঠিক নয়টা অঙ্ক, আর তারপর কিছু থাকবে না।
                    তাই 01000000101 আর 8801000000101 দুটোই মেলে, কিন্তু মাঝে Space বা Dash থাকলে
                    মেলে না, কারণ Space অঙ্ক না।
                </>
            }>
            <SketchText x={420} y={30} size={14} bold accent>
                ^(880|0)1\d{'{9}'}$
            </SketchText>
            {PARTS.map((part, i) => {
                const x = xs[i];
                const w = widths[i];
                const mid = x + w / 2;
                return (
                    <g key={part.token}>
                        <rect
                            x={x}
                            y={56}
                            width={w}
                            height={46}
                            fill='var(--primary)'
                            fillOpacity={0.08}
                            stroke='var(--primary)'
                            strokeOpacity={0.8}
                            strokeWidth='1.2'
                        />
                        <SketchText x={mid} y={85} size={13} bold accent>
                            {part.token}
                        </SketchText>
                        <line
                            x1={mid}
                            y1={104}
                            x2={mid}
                            y2={128}
                            stroke='currentColor'
                            strokeOpacity={0.45}
                            strokeWidth='1.1'
                            strokeDasharray='3 3'
                        />
                        <SketchText x={mid} y={150} size={10.5} body bold>
                            {part.meaning}
                        </SketchText>
                        <SketchText x={mid} y={172} size={9.5} body opacity={0.7}>
                            {part.detail}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={420} y={212} size={10} opacity={0.75}>
                01000000101 মেলে · 8801000000101 মেলে · 01000-000101 মেলে না
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. কোন Function কী ফেরত দেয়                                                */
/* ------------------------------------------------------------------------- */

const FUNCTIONS = [
    { name: "~ , ~* , regexp_like", returns: 'true / false', use: 'মেলে কিনা, WHERE এ' },
    { name: 'regexp_count', returns: 'একটা সংখ্যা', use: 'কতবার মেলে' },
    { name: 'regexp_instr', returns: 'একটা সংখ্যা', use: 'কোথায় মেলে, অবস্থান' },
    { name: 'regexp_substr', returns: 'একটা লেখা', use: 'মেলা অংশটা তুলে আনা' },
    { name: 'regexp_match', returns: 'একটা Array', use: 'বন্ধনীর টুকরোগুলো একসাথে' },
    { name: "regexp_matches ... 'g'", returns: 'অনেকগুলো Row', use: 'প্রতিটা মিল আলাদা Row এ' },
    { name: 'regexp_split_to_table', returns: 'অনেকগুলো Row', use: 'Pattern দিয়ে কেটে টুকরো' },
    { name: 'regexp_replace', returns: 'নতুন লেখা', use: 'মেলা অংশ বদলে দেওয়া' },
];

export function RegexFunctionsDiagram() {
    const colW = 200;
    const rowH = 82;
    return (
        <Sketch
            label='Regex এর Function গুলো: কে কী ফেরত দেয়'
            height={210}
            minWidth={860}
            viewBox='0 0 860 210'
            caption={
                <>
                    কোন Function নেবেন, সেটা ঠিক করে প্রশ্নটা: শুধু হ্যাঁ বা না চাই, নাকি একটা
                    সংখ্যা, নাকি মেলা অংশটা, নাকি নতুন একটা লেখা। Row এর সংখ্যা বদলে দেয় শুধু দুটো,
                    regexp_matches এর g Flag আর regexp_split_to_table, তাই এ দুটো SELECT এ বসালে
                    একটা Row থেকে কয়েকটা Row হয়ে যায়।
                </>
            }>
            {FUNCTIONS.map((fn, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                const x = 20 + col * (colW + 10);
                const y = 20 + row * (rowH + 10);
                const many = fn.returns === 'অনেকগুলো Row';
                return (
                    <g key={fn.name}>
                        <rect
                            x={x}
                            y={y}
                            width={colW}
                            height={rowH}
                            fill={many ? 'var(--primary)' : 'currentColor'}
                            fillOpacity={many ? 0.1 : 0.04}
                            stroke={many ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={many ? 0.85 : 0.4}
                            strokeWidth='1.1'
                        />
                        <SketchText x={x + colW / 2} y={y + 24} size={10.5} bold accent={many}>
                            {fn.name}
                        </SketchText>
                        <SketchText x={x + colW / 2} y={y + 48} size={10.5} body bold>
                            {fn.returns}
                        </SketchText>
                        <SketchText x={x + colW / 2} y={y + 68} size={9.5} body opacity={0.75}>
                            {fn.use}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Module 04 এর ছয় লেসন, একটা Report এ                                      */
/* ------------------------------------------------------------------------- */

const STAGES = [
    { code: 'String', idea: 'লেখা ধোয়ামোছা', lesson: 'Lesson 01' },
    { code: 'Number', idea: 'টাকার হিসাব', lesson: 'Lesson 02' },
    { code: 'Date/Time', idea: 'সময় আর অঞ্চল', lesson: 'Lesson 03' },
    { code: 'CAST', idea: 'এক Type থেকে আরেক', lesson: 'Lesson 04' },
    { code: 'COALESCE', idea: 'NULL এর বদলে কিছু', lesson: 'Lesson 05' },
    { code: 'Regex', idea: 'জটিল ছাঁচ', lesson: 'Lesson 06' },
];

export function ModuleFourStoryDiagram() {
    const w = 120;
    const gap = 22;
    return (
        <Sketch
            label='Module 04: একটা মানকে ছয়ভাবে গড়ে নেওয়া'
            height={210}
            minWidth={880}
            viewBox='0 0 880 210'
            caption={
                <>
                    Module 03 শিখিয়েছিল কোন Row আসবে আর কোন ক্রমে। Module 04 শেখাল প্রতিটা Row এর
                    ভেতরের মানকে কীভাবে মানুষের পড়ার মতো করে গড়ে নেবেন। ছয়টা লেসন, ছয়টা হাতিয়ার,
                    আর সবগুলো একই জায়গায় বসে: SELECT এর তালিকায়, WHERE এ, আর ORDER BY তে।
                </>
            }>
            <defs>
                <marker
                    id='regex-story-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {STAGES.map((stage, i) => {
                const x = 20 + i * (w + gap);
                const mid = x + w / 2;
                const last = i === STAGES.length - 1;
                return (
                    <g key={stage.code}>
                        <SketchText x={mid} y={36} size={9.5} opacity={0.6}>
                            {stage.lesson}
                        </SketchText>
                        <rect
                            x={x}
                            y={48}
                            width={w}
                            height={48}
                            fill='var(--primary)'
                            fillOpacity={last ? 0.16 : 0.05}
                            stroke='var(--primary)'
                            strokeOpacity={0.75}
                            strokeWidth='1.2'
                        />
                        <SketchText x={mid} y={77} size={11.5} bold accent>
                            {stage.code}
                        </SketchText>
                        <SketchText x={mid} y={124} size={10.5} body bold>
                            {stage.idea}
                        </SketchText>
                        {i < STAGES.length - 1 && (
                            <line
                                x1={x + w + 3}
                                y1={72}
                                x2={x + w + gap - 3}
                                y2={72}
                                stroke='var(--primary)'
                                strokeWidth='1.3'
                                markerEnd='url(#regex-story-arrow)'
                            />
                        )}
                    </g>
                );
            })}
            <SketchText x={440} y={170} size={10.5} body>
                শেষে সবগুলো একসাথে: একটা Customer Report, যেখানে নাম, ফোন, Email, তারিখ আর
            </SketchText>
            <SketchText x={440} y={190} size={10.5} body>
                মাসের হিসাব, প্রতিটা একটা করে Function দিয়ে গড়া
            </SketchText>
        </Sketch>
    );
}
