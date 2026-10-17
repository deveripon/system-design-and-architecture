import { Sketch, SketchBox, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. চারটা যন্ত্র, এক নজরে                                                    */
/* ------------------------------------------------------------------------- */

const TOOLS = [
    {
        name: 'COALESCE',
        input: 'NULL, NULL, \'Dhaka\'',
        output: '\'Dhaka\'',
        line1: 'ফাঁকা হলে বিকল্প',
        line2: 'প্রথম যেটা NULL না',
    },
    {
        name: 'NULLIF',
        input: '0, 0',
        output: 'NULL',
        line1: 'মান থেকে NULL',
        line2: 'দুটো সমান হলে NULL',
    },
    {
        name: 'GREATEST',
        input: '-1, 0',
        output: '0',
        line1: 'সবচেয়ে বড়টা',
        line2: 'নিচের সীমা বসাতে',
    },
    {
        name: 'LEAST',
        input: '18000, 15000',
        output: '15000',
        line1: 'সবচেয়ে ছোটটা',
        line2: 'উপরের সীমা বসাতে',
    },
];

/** The four functions as four little machines: what goes in, what comes out. */
export function FourToolsDiagram() {
    const w = 190;
    const gap = 22;
    const x0 = (880 - (4 * w + 3 * gap)) / 2;
    return (
        <Sketch
            label='Four Small Tools'
            height={290}
            minWidth={880}
            viewBox='0 0 880 290'
            caption='চারটা Function, চারটা আলাদা কাজ। COALESCE ফাঁকা ঘরে একটা মান বসায়, NULLIF উল্টো কাজটা করে, একটা মানকে NULL বানায়। GREATEST আর LEAST কয়েকটা মানের মধ্যে সবচেয়ে বড় বা ছোটটা বেছে নেয়, যা দিয়ে একটা সীমা টানা যায়।'>
            <defs>
                <marker
                    id='nullfn-tools-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {TOOLS.map((tool, i) => {
                const x = x0 + i * (w + gap);
                return (
                    <g key={tool.name}>
                        <SketchText x={x + w / 2} y={34} size={9} opacity={0.6}>
                            ভেতরে যায়
                        </SketchText>
                        <SketchText x={x + w / 2} y={54} size={11}>
                            {tool.input}
                        </SketchText>
                        <line
                            x1={x + w / 2}
                            y1={64}
                            x2={x + w / 2}
                            y2={92}
                            stroke='var(--primary)'
                            strokeWidth='1.3'
                            markerEnd='url(#nullfn-tools-arrow)'
                        />
                        <SketchBox x={x} y={98} w={w} h={50} title={tool.name} accent />
                        <line
                            x1={x + w / 2}
                            y1={152}
                            x2={x + w / 2}
                            y2={180}
                            stroke='var(--primary)'
                            strokeWidth='1.3'
                            markerEnd='url(#nullfn-tools-arrow)'
                        />
                        <SketchText x={x + w / 2} y={202} size={12} bold accent>
                            {tool.output}
                        </SketchText>
                        <SketchText x={x + w / 2} y={234} size={10.5} body>
                            {tool.line1}
                        </SketchText>
                        <SketchText x={x + w / 2} y={256} size={10} body opacity={0.7}>
                            {tool.line2}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. COALESCE বাঁ থেকে ডানে খোঁজে                                              */
/* ------------------------------------------------------------------------- */

type Slot = { text: string; state: 'null' | 'picked' | 'skipped' };

const CHAIN_ROWS: { who: string; slots: Slot[]; result: string }[] = [
    {
        who: 'Rahim Uddin',
        slots: [
            { text: '+8801000000101', state: 'picked' },
            { text: 'rahim.uddin@…', state: 'skipped' },
            { text: "'no contact'", state: 'skipped' },
        ],
        result: '+8801000000101',
    },
    {
        who: 'Tanvir Ahmed',
        slots: [
            { text: 'NULL', state: 'null' },
            { text: 'tanvir.ahmed@…', state: 'picked' },
            { text: "'no contact'", state: 'skipped' },
        ],
        result: 'tanvir.ahmed@…',
    },
    {
        who: 'নতুন কেউ',
        slots: [
            { text: 'NULL', state: 'null' },
            { text: 'NULL', state: 'null' },
            { text: "'no contact'", state: 'picked' },
        ],
        result: 'no contact',
    },
];

/**
 * COALESCE(phone, email, 'no contact') walked for three people: it stops at
 * the first argument that is not NULL and never looks at the rest.
 */
export function FallbackChainDiagram() {
    const slotW = 150;
    const startX = 150;
    return (
        <Sketch
            label="COALESCE(phone, email, 'no contact')"
            height={330}
            minWidth={900}
            viewBox='0 0 900 330'
            caption='COALESCE বাঁ দিক থেকে একটা একটা করে দেখে। প্রথম যে মানটা NULL না, সেটাই উত্তর, আর তার ডানের কিছু সে আর দেখেও না (ধূসর ঘরগুলো)। সব ঘর NULL হলে উত্তর NULL, তাই শেষে একটা নিশ্চিত মান রাখলে উত্তর কখনো ফাঁকা থাকে না।'>
            <defs>
                <marker
                    id='nullfn-chain-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {['phone', 'email', "'no contact'"].map((name, i) => (
                <SketchText key={name} x={startX + i * (slotW + 20) + slotW / 2} y={30} size={10} bold opacity={0.7}>
                    {name}
                </SketchText>
            ))}
            <SketchText x={startX + 3 * (slotW + 20) + 60} y={30} size={10} bold accent>
                উত্তর
            </SketchText>
            {CHAIN_ROWS.map((row, r) => {
                const y = 52 + r * 92;
                return (
                    <g key={row.who}>
                        <SketchText x={16} y={y + 26} anchor='start' size={11} body>
                            {row.who}
                        </SketchText>
                        {row.slots.map((slot, i) => {
                            const x = startX + i * (slotW + 20);
                            const picked = slot.state === 'picked';
                            const skipped = slot.state === 'skipped';
                            return (
                                <g key={i} opacity={skipped ? 0.35 : 1}>
                                    <rect
                                        x={x}
                                        y={y}
                                        width={slotW}
                                        height={40}
                                        fill={picked ? 'var(--primary)' : 'transparent'}
                                        fillOpacity={picked ? 0.12 : 0}
                                        stroke={picked ? 'var(--primary)' : 'currentColor'}
                                        strokeOpacity={picked ? 1 : 0.45}
                                        strokeDasharray={slot.state === 'null' ? '4 3' : undefined}
                                        strokeWidth='1.2'
                                    />
                                    <SketchText x={x + slotW / 2} y={y + 25} size={10} accent={picked} bold={picked}>
                                        {slot.text}
                                    </SketchText>
                                    <SketchText x={x + slotW / 2} y={y + 58} size={9} body opacity={0.7}>
                                        {slot.state === 'null'
                                            ? 'ফাঁকা, তাই পরের ঘরে'
                                            : picked
                                              ? 'এটাই নেওয়া হলো'
                                              : 'দেখাই হলো না'}
                                    </SketchText>
                                </g>
                            );
                        })}
                        <line
                            x1={startX + 3 * (slotW + 20) - 14}
                            y1={y + 20}
                            x2={startX + 3 * (slotW + 20) + 8}
                            y2={y + 20}
                            stroke='var(--primary)'
                            strokeWidth='1.3'
                            markerEnd='url(#nullfn-chain-arrow)'
                        />
                        <SketchText x={startX + 3 * (slotW + 20) + 60} y={y + 25} size={10.5} bold accent>
                            {row.result}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. শূন্য দিয়ে ভাগ: NULLIF ছাড়া আর NULLIF সহ                                   */
/* ------------------------------------------------------------------------- */

function Step({ x, y, text, accent, danger }: { x: number; y: number; text: string; accent?: boolean; danger?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={250}
                height={34}
                fill={danger ? 'var(--destructive)' : accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={danger || accent ? 0.1 : 0}
                stroke={danger ? 'var(--destructive)' : accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={danger || accent ? 1 : 0.45}
                strokeWidth='1.2'
            />
            <SketchText x={x + 125} y={y + 22} size={10.5} bold={accent || danger}>
                {text}
            </SketchText>
        </g>
    );
}

function Down({ x, y, id }: { x: number; y: number; id: string }) {
    return (
        <line x1={x} y1={y} x2={x} y2={y + 16} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' markerEnd={`url(#${id})`} />
    );
}

function DownMarker({ id }: { id: string }) {
    return (
        <defs>
            <marker id={id} markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                <path d='M0,0 L7,3.5 L0,7 Z' fill='currentColor' fillOpacity={0.6} />
            </marker>
        </defs>
    );
}

/** Ratargul (a one day tour) through the price per night formula, with and without the guard. */
export function NullifGuardSplit() {
    return (
        <SketchSplit
            label='Ratargul Swamp Boat Day: price_bdt / (duration_days - 1)'
            caption='একদিনের ট্যুরে রাত নেই, তাই duration_days - 1 হয় শূন্য। বাঁ দিকে শূন্য দিয়ে ভাগ করতে গিয়ে পুরো Query থেমে যায়, বাকি আটটা ট্যুরের উত্তরও আর আসে না। ডান দিকে NULLIF শূন্যটাকে NULL বানিয়ে দেয়, NULL দিয়ে ভাগের উত্তর NULL, কোনো Error নেই, আর COALESCE সেই ফাঁকা ঘরে একটা বোঝার মতো লেখা বসায়।'
            panels={[
                {
                    title: 'NULLIF ছাড়া',
                    sub: 'একটা Row, পুরো Query শেষ',
                    viewBox: '0 0 300 250',
                    height: 250,
                    children: (
                        <>
                            <DownMarker id='nullfn-guard-left' />
                            <Step x={25} y={10} text='duration_days = 1' />
                            <Down x={150} y={46} id='nullfn-guard-left' />
                            <Step x={25} y={66} text='1 - 1 = 0' />
                            <Down x={150} y={102} id='nullfn-guard-left' />
                            <Step x={25} y={122} text='3500.00 / 0' />
                            <Down x={150} y={158} id='nullfn-guard-left' />
                            <Step x={25} y={178} text='ERROR: division by zero' danger />
                            <SketchText x={150} y={236} size={9.5} body opacity={0.75}>
                                কোনো Row ই ফেরত আসে না
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'NULLIF সহ',
                    sub: 'শূন্য হয়ে যায় NULL',
                    viewBox: '0 0 300 250',
                    height: 250,
                    children: (
                        <>
                            <DownMarker id='nullfn-guard-right' />
                            <Step x={25} y={10} text='NULLIF(1 - 1, 0) = NULL' accent />
                            <Down x={150} y={46} id='nullfn-guard-right' />
                            <Step x={25} y={66} text='3500.00 / NULL = NULL' />
                            <Down x={150} y={102} id='nullfn-guard-right' />
                            <Step x={25} y={122} text="COALESCE(…, 'day trip')" accent />
                            <Down x={150} y={158} id='nullfn-guard-right' />
                            <Step x={25} y={178} text="'day trip'" accent />
                            <SketchText x={150} y={236} size={9.5} body opacity={0.75}>
                                নয়টা Row ই আসে
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 4. GREATEST(5, NULL, 9): PostgreSQL আর MySQL                                */
/* ------------------------------------------------------------------------- */

function ValueRow({ y, picked }: { y: number; picked: 'nine' | 'null' }) {
    const values = ['5', 'NULL', '9'];
    return (
        <g>
            {values.map((v, i) => {
                const x = 30 + i * 85;
                const isNull = v === 'NULL';
                const highlight = (picked === 'nine' && v === '9') || (picked === 'null' && isNull);
                return (
                    <g key={v} opacity={picked === 'nine' && isNull ? 0.4 : 1}>
                        <rect
                            x={x}
                            y={y}
                            width={70}
                            height={36}
                            fill={highlight ? 'var(--primary)' : 'transparent'}
                            fillOpacity={highlight ? 0.12 : 0}
                            stroke={highlight ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={highlight ? 1 : 0.45}
                            strokeDasharray={isNull ? '4 3' : undefined}
                            strokeWidth='1.2'
                        />
                        <SketchText x={x + 35} y={y + 23} size={11} bold={highlight} accent={highlight}>
                            {v}
                        </SketchText>
                    </g>
                );
            })}
        </g>
    );
}

/** The one place the two databases disagree in this lesson: a NULL inside GREATEST or LEAST. */
export function GreatestNullSplit() {
    return (
        <SketchSplit
            label='GREATEST(5, NULL, 9)'
            caption='PostgreSQL তালিকার NULL গুলো বাদ দিয়ে বাকিগুলোর মধ্যে সবচেয়ে বড়টা দেয়, NULL দেয় শুধু তখন যখন সবগুলোই NULL। MySQL SQL Standard মেনে চলে: একটাও NULL থাকলে উত্তর NULL। PostgreSQL এর Docs নিজেই বলে এটা Standard থেকে ইচ্ছাকৃত বিচ্যুতি। তাই কোনো Column এ NULL থাকতে পারলে MySQL এ আগে COALESCE দিয়ে মোড়াতে হয়।'
            panels={[
                {
                    title: 'PostgreSQL',
                    sub: 'NULL বাদ দিয়ে হিসাব',
                    viewBox: '0 0 300 170',
                    height: 170,
                    children: (
                        <>
                            <ValueRow y={20} picked='nine' />
                            <SketchText x={150} y={100} size={10} body opacity={0.75}>
                                NULL কে পাশে সরিয়ে রাখে
                            </SketchText>
                            <SketchText x={150} y={140} size={13} bold accent>
                                উত্তর: 9
                            </SketchText>
                        </>
                    ),
                },
                {
                    title: 'MySQL',
                    sub: 'একটা NULL মানে উত্তর NULL',
                    viewBox: '0 0 300 170',
                    height: 170,
                    children: (
                        <>
                            <ValueRow y={20} picked='null' />
                            <SketchText x={150} y={100} size={10} body opacity={0.75}>
                                অজানা থাকলে সবচেয়ে বড়টাও অজানা
                            </SketchText>
                            <SketchText x={150} y={140} size={13} bold accent>
                                উত্তর: NULL
                            </SketchText>
                        </>
                    ),
                },
            ]}
        />
    );
}
