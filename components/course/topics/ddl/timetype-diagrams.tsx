import { Sketch, SketchBox, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. কোন প্রশ্নের জন্য কোন Column                                               */
/* ------------------------------------------------------------------------- */

function Branch({ y, question, type, sub, examples }: { y: number; question: string; type: string; sub: string; examples: string }) {
    return (
        <g>
            <path d={`M 230 200 C 270 200, 270 ${y}, 310 ${y}`} fill='none' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' markerEnd='url(#timetype-pick-arrow)' />
            <rect x={316} y={y - 22} width={240} height={44} fill='transparent' stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.2' />
            <SketchText x={436} y={y + 5} size={11.5} body>
                {question}
            </SketchText>
            <line x1={556} y1={y} x2={600} y2={y} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#timetype-pick-arrow-accent)' />
            <SketchBox x={606} y={y - 24} w={150} h={48} title={type} sub={sub} accent />
            <SketchText x={772} y={y + 4} size={10} anchor='start' opacity={0.8}>
                {examples}
            </SketchText>
        </g>
    );
}

/**
 * Picks a column type by the question the column answers: how long, at what
 * moment, on which day, at what clock time. The fifth type, timestamp without
 * time zone, sits apart because it answers none of them on its own.
 */
export function TimeColumnPickerDiagram() {
    return (
        <Sketch
            label='Choosing a Time Column'
            height={420}
            minWidth={920}
            viewBox='0 0 960 420'
            caption='Column টা কোন প্রশ্নের উত্তর রাখবে, সেটা আগে ঠিক করুন, ধরন নিজেই বেরিয়ে আসবে। কতক্ষণ হলে interval, কোন মুহূর্তে হলে timestamptz, কোন দিনে হলে date, রোজ কয়টায় হলে time। নিচের ডোরাকাটা বাক্সের timestamp একা কোনো প্রশ্নের পুরো উত্তর দেয় না, কারণ সে জানে না লেখাটা কোন দেশের ঘড়ির।'>
            <defs>
                <marker id='timetype-pick-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M 0 0 L 10 5 L 0 10 z' fill='currentColor' fillOpacity={0.6} />
                </marker>
                <marker id='timetype-pick-arrow-accent' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M 0 0 L 10 5 L 0 10 z' fill='var(--primary)' />
                </marker>
            </defs>

            <rect x={20} y={160} width={210} height={80} fill='var(--primary)' fillOpacity={0.06} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            <SketchText x={125} y={192} size={12} body bold>
                এই Column কোন প্রশ্নের
            </SketchText>
            <SketchText x={125} y={214} size={12} body bold>
                উত্তর রাখবে?
            </SketchText>

            <Branch y={50} question='কতক্ষণ? একটা দৈর্ঘ্য' type='interval' sub='16 bytes' examples='drive_time, cancel_window' />
            <Branch y={140} question='কোন মুহূর্তে ঘটল বা ঘটবে?' type='timestamptz' sub='8 bytes' examples='booked_at, paid_at' />
            <Branch y={230} question='কোন দিন? ঘড়ির সময় লাগবে না' type='date' sub='4 bytes' examples='starts_on, hired_on' />
            <Branch y={320} question='রোজ কয়টায়? কোনো দিন ছাড়া' type='time' sub='8 bytes' examples='opens_at, ready_by' />

            <rect x={316} y={372} width={440} height={36} fill='transparent' stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.2' strokeDasharray='4 3' />
            <SketchText x={330} y={395} size={11} anchor='start' bold>
                timestamp
            </SketchText>
            <SketchText x={420} y={395} size={10.5} anchor='start' body opacity={0.85}>
                দেয়ালঘড়ির একটা লেখা, কোন দেশের জানে না। একা প্রায় কখনো না।
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. timestamp Offset ফেলে দেয়, timestamptz মুহূর্ত রাখে                          */
/* ------------------------------------------------------------------------- */

function InputChip({ x, y, text, sub }: { x: number; y: number; text: string; sub: string }) {
    return (
        <g>
            <rect x={x} y={y} width={150} height={40} fill='transparent' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <SketchText x={x + 75} y={y + 17} size={10.5} bold>
                {text}
            </SketchText>
            <SketchText x={x + 75} y={y + 32} size={9.5} body opacity={0.75}>
                {sub}
            </SketchText>
        </g>
    );
}

function StoredChip({ x, y, text, accent }: { x: number; y: number; text: string; accent?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={160}
                height={30}
                fill={accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.1 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 1 : 0.45}
                strokeWidth='1.2'
            />
            <SketchText x={x + 80} y={y + 19} size={10.5} bold accent={accent}>
                {text}
            </SketchText>
        </g>
    );
}

/**
 * The same two inserts, a Dhaka morning and a London morning, written into a
 * timestamp column and a timestamptz column. All values are real PostgreSQL 18
 * output with the session time zone at Asia/Dhaka.
 */
export function PlainVsAwareSplit() {
    return (
        <SketchSplit
            label='timestamp vs timestamptz on Insert'
            caption='দুই Column এ একই দুটো লেখা ঢোকানো হয়েছে। বাঁ দিকের timestamp শেষের +06 আর +00 চুপচাপ ফেলে দিয়েছে, তাই দুটো আলাদা মুহূর্ত এখন হুবহু একই লেখা, ফারাক শূন্য। ডান দিকের timestamptz প্রতিটাকে UTC তে বদলে রেখেছে, দেখানোর সময় ঢাকার ঘড়িতে বলছে, আর ছয় ঘণ্টার আসল ফারাক অক্ষত।'
            panels={[
                {
                    title: 'timestamp',
                    sub: 'Offset ফেলে দেয়',
                    viewBox: '0 0 400 280',
                    height: 280,
                    minWidth: 320,
                    children: (
                        <g>
                            <InputChip x={20} y={20} text='10:00+06' sub='ঢাকার সকাল' />
                            <InputChip x={230} y={20} text='10:00+00' sub='London এর সকাল' />
                            <line x1={95} y1={64} x2={115} y2={128} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' markerEnd='url(#timetype-split-arrow)' />
                            <line x1={305} y1={64} x2={285} y2={128} stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' markerEnd='url(#timetype-split-arrow)' />
                            <SketchText x={200} y={100} size={10} body opacity={0.8}>
                                +06 আর +00 বাদ
                            </SketchText>
                            <StoredChip x={40} y={134} text='10:00:00' />
                            <StoredChip x={210} y={134} text='10:00:00' />
                            <SketchText x={200} y={196} size={10} body opacity={0.8}>
                                Database এ রাখা আছে
                            </SketchText>
                            <rect x={90} y={216} width={220} height={40} fill='transparent' stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.4' strokeDasharray='4 3' />
                            <SketchText x={200} y={241} size={11.5} bold>
                                ফারাক: 00:00:00
                            </SketchText>
                            <defs>
                                <marker id='timetype-split-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                                    <path d='M 0 0 L 10 5 L 0 10 z' fill='currentColor' fillOpacity={0.6} />
                                </marker>
                            </defs>
                        </g>
                    ),
                },
                {
                    title: 'timestamptz',
                    sub: 'মুহূর্তটা রাখে',
                    viewBox: '0 0 400 280',
                    height: 280,
                    minWidth: 320,
                    children: (
                        <g>
                            <InputChip x={20} y={20} text='10:00+06' sub='ঢাকার সকাল' />
                            <InputChip x={230} y={20} text='10:00+00' sub='London এর সকাল' />
                            <line x1={95} y1={64} x2={115} y2={88} stroke='var(--primary)' strokeWidth='1.2' />
                            <line x1={305} y1={64} x2={285} y2={88} stroke='var(--primary)' strokeWidth='1.2' />
                            <StoredChip x={40} y={92} text='04:00 UTC' accent />
                            <StoredChip x={210} y={92} text='10:00 UTC' accent />
                            <SketchText x={200} y={140} size={10} body opacity={0.8}>
                                ভেতরে UTC, দেখানোর সময় ঢাকার ঘড়ি
                            </SketchText>
                            <StoredChip x={40} y={152} text='10:00:00+06' />
                            <StoredChip x={210} y={152} text='16:00:00+06' />
                            <rect x={90} y={216} width={220} height={40} fill='var(--primary)' fillOpacity={0.1} stroke='var(--primary)' strokeWidth='1.4' />
                            <SketchText x={200} y={241} size={11.5} bold accent>
                                ফারাক: 06:00:00
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. যে ঘণ্টা দুইবার আসে                                                        */
/* ------------------------------------------------------------------------- */

const DST_X0 = 70;
const DST_STEP = 150;

/**
 * New York on Sunday 1 November 2026, the day daylight saving time ends there:
 * at 02:00 EDT the clocks go back to 01:00 EST, so the wall clock reads 01:30
 * twice while the UTC line underneath runs straight on.
 */
export function RepeatedHourDiagram() {
    const utcLabels = ['04:00', '05:00', '06:00', '07:00', '08:00'];
    return (
        <Sketch
            label='The Hour That Happens Twice'
            height={340}
            minWidth={880}
            viewBox='0 0 900 340'
            caption='1 November 2026, রবিবার, New York এ Daylight Saving শেষ হওয়ার দিন। রাত ২টা বাজার মুহূর্তে ঘড়ি পিছিয়ে আবার ১টা হয়, তাই দেয়ালঘড়িতে 01:30 আসে দুইবার: একবার EDT (UTC-4) তে, একবার EST (UTC-5) এ। নিচের UTC রেখা সোজা চলে, সেখানে দুটো আলাদা মুহূর্ত, 05:30 আর 06:30। timestamp এ শুধু 01:30 লেখা থাকে, কোনটা বোঝার উপায় নেই। timestamptz রাখে নিচের রেখার একটা নির্দিষ্ট বিন্দু।'>
            <defs>
                <marker id='timetype-dst-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                    <path d='M 0 0 L 10 5 L 0 10 z' fill='var(--primary)' />
                </marker>
            </defs>

            <SketchText x={20} y={40} size={11} anchor='start' bold>
                New York এর দেয়ালঘড়ি
            </SketchText>
            {/* the wall clock: 00:00 to 02:00 EDT, then back to 01:00 and on to 03:00 EST */}
            <line x1={DST_X0} y1={90} x2={DST_X0 + 2 * DST_STEP} y2={90} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.6' />
            <path d={`M ${DST_X0 + 2 * DST_STEP} 90 C ${DST_X0 + 2 * DST_STEP + 40} 90, ${DST_X0 + 2 * DST_STEP + 40} 130, ${DST_X0 + 2 * DST_STEP} 130`} fill='none' stroke='var(--primary)' strokeWidth='1.4' strokeDasharray='4 3' />
            <line x1={DST_X0 + DST_STEP} y1={130} x2={DST_X0 + 4 * DST_STEP} y2={130} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.6' />
            {[0, 1, 2].map(i => (
                <g key={`edt-${i}`}>
                    <line x1={DST_X0 + i * DST_STEP} y1={84} x2={DST_X0 + i * DST_STEP} y2={96} stroke='currentColor' strokeOpacity={0.6} />
                    <SketchText x={DST_X0 + i * DST_STEP} y={76} size={10.5}>
                        {`0${i}:00`}
                    </SketchText>
                </g>
            ))}
            <SketchText x={DST_X0 + DST_STEP / 2 + DST_STEP} y={76} size={9.5} opacity={0.7}>
                EDT, UTC-4
            </SketchText>
            {[1, 2, 3].map(i => (
                <g key={`est-${i}`}>
                    <line x1={DST_X0 + (i + 1) * DST_STEP} y1={124} x2={DST_X0 + (i + 1) * DST_STEP} y2={136} stroke='currentColor' strokeOpacity={0.6} />
                    <SketchText x={DST_X0 + (i + 1) * DST_STEP} y={152} size={10.5}>
                        {`0${i}:00`}
                    </SketchText>
                </g>
            ))}
            <SketchText x={DST_X0 + 2.5 * DST_STEP + 30} y={168} size={9.5} opacity={0.7}>
                EST, UTC-5
            </SketchText>
            <SketchText x={DST_X0 + 2 * DST_STEP + 40} y={98} size={9.5} anchor='start' body accent>
                ঘড়ি পিছিয়ে ১টা
            </SketchText>

            {/* the two 01:30 readings */}
            <circle cx={DST_X0 + 1.5 * DST_STEP} cy={90} r={5} fill='var(--primary)' />
            <circle cx={DST_X0 + 2.5 * DST_STEP} cy={130} r={5} fill='var(--primary)' />
            <SketchText x={DST_X0 + 1.5 * DST_STEP} y={112} size={10.5} bold accent>
                01:30 EDT
            </SketchText>
            <SketchText x={DST_X0 + 2.5 * DST_STEP + 10} y={122} size={10.5} anchor='start' bold accent>
                01:30 EST
            </SketchText>

            <SketchText x={20} y={214} size={11} anchor='start' bold>
                UTC, যে রেখা কখনো পেছায় না
            </SketchText>
            <line x1={DST_X0} y1={260} x2={DST_X0 + 4 * DST_STEP} y2={260} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.6' />
            {utcLabels.map((label, i) => (
                <g key={label}>
                    <line x1={DST_X0 + i * DST_STEP} y1={254} x2={DST_X0 + i * DST_STEP} y2={266} stroke='currentColor' strokeOpacity={0.6} />
                    <SketchText x={DST_X0 + i * DST_STEP} y={284} size={10.5}>
                        {label}
                    </SketchText>
                </g>
            ))}
            <line x1={DST_X0 + 1.5 * DST_STEP} y1={96} x2={DST_X0 + 1.5 * DST_STEP} y2={250} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#timetype-dst-arrow)' />
            <line x1={DST_X0 + 2.5 * DST_STEP} y1={136} x2={DST_X0 + 2.5 * DST_STEP} y2={250} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#timetype-dst-arrow)' />
            <SketchText x={DST_X0 + 1.5 * DST_STEP} y={306} size={10.5} bold accent>
                05:30 UTC
            </SketchText>
            <SketchText x={DST_X0 + 2.5 * DST_STEP} y={306} size={10.5} bold accent>
                06:30 UTC
            </SketchText>
            <SketchText x={DST_X0 + 2 * DST_STEP} y={326} size={10} body opacity={0.8}>
                এক লেখা, দুই মুহূর্ত, মাঝে পুরো এক ঘণ্টা
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. কোন ধরন কত দূর পর্যন্ত যায়                                                  */
/* ------------------------------------------------------------------------- */

interface RangeBar {
    name: string;
    bytes: string;
    from: string;
    to: string;
    /** Bar position on a schematic axis, not to scale. */
    x1: number;
    x2: number;
    accent?: boolean;
}

const RANGE_BARS: RangeBar[] = [
    { name: 'PostgreSQL date', bytes: '4 bytes', from: '4713 BC', to: '5874897 AD', x1: 250, x2: 900 },
    { name: 'PostgreSQL timestamp(tz)', bytes: '8 bytes', from: '4713 BC', to: '294276 AD', x1: 250, x2: 840 },
    { name: 'MySQL DATETIME', bytes: '5 bytes + fsp', from: '1000', to: '9999', x1: 420, x2: 760 },
    { name: 'MySQL TIMESTAMP', bytes: '4 bytes + fsp', from: '1970 UTC', to: '2038-01-19 03:14:07 UTC', x1: 560, x2: 640, accent: true },
];

/**
 * How far each type reaches, as a schematic ruler. The point is the one short
 * bar: MySQL TIMESTAMP stops in January 2038, closer to today than most
 * mortgages.
 */
export function TimeRangeRulerDiagram() {
    return (
        <Sketch
            label='How Far Each Type Reaches'
            height={330}
            minWidth={900}
            viewBox='0 0 940 330'
            caption='মাপ অনুযায়ী আঁকা না, শুধু কে কত দূর যায় তার একটা ধারণা। PostgreSQL এর date আর timestamp হাজার হাজার বছর ধরে চলে। MySQL এর DATETIME চলে 1000 থেকে 9999 সাল। আর MySQL এর TIMESTAMP থামে 2038 সালের 19 জানুয়ারি, UTC তে রাত ৩টা ১৪ মিনিট ৭ সেকেন্ডে, ঢাকার ঘড়িতে সকাল ৯টা ১৪ মিনিট ৭ সেকেন্ডে। আজ থেকে মাত্র এগারো বছর দূরে।'>
            <line x1={240} y1={34} x2={910} y2={34} stroke='currentColor' strokeOpacity={0.3} strokeDasharray='2 4' />
            <line x1={626} y1={26} x2={626} y2={300} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1' strokeDasharray='4 3' />
            <SketchText x={626} y={20} size={10} bold>
                আজ, 2026
            </SketchText>
            {RANGE_BARS.map((bar, i) => {
                const y = 70 + i * 62;
                return (
                    <g key={bar.name}>
                        <SketchText x={20} y={y + 4} size={11} anchor='start' bold accent={bar.accent}>
                            {bar.name}
                        </SketchText>
                        <SketchText x={20} y={y + 20} size={9.5} anchor='start' opacity={0.7}>
                            {bar.bytes}
                        </SketchText>
                        <rect
                            x={bar.x1}
                            y={y - 8}
                            width={bar.x2 - bar.x1}
                            height={16}
                            fill={bar.accent ? 'var(--primary)' : 'currentColor'}
                            fillOpacity={bar.accent ? 0.35 : 0.12}
                            stroke={bar.accent ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={bar.accent ? 1 : 0.45}
                            strokeWidth='1.2'
                        />
                        <SketchText x={bar.x1} y={y + 24} size={9.5} anchor='start' opacity={0.8}>
                            {bar.from}
                        </SketchText>
                        <SketchText x={bar.x2} y={y + 24} size={9.5} anchor={bar.accent ? 'start' : 'end'} opacity={0.8} accent={bar.accent} bold={bar.accent}>
                            {bar.to}
                        </SketchText>
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. একটা জায়গার Offset সময়ের সাথে বদলায়                                         */
/* ------------------------------------------------------------------------- */

function OffsetSegment({ x, w, y, label, accent }: { x: number; w: number; y: number; label: string; accent?: boolean }) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={30}
                fill={accent ? 'var(--primary)' : 'transparent'}
                fillOpacity={accent ? 0.15 : 0}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 1 : 0.45}
                strokeWidth='1.2'
            />
            <SketchText x={x + w / 2} y={y + 19} size={10.5} bold accent={accent}>
                {label}
            </SketchText>
        </g>
    );
}

/**
 * Two zone names and the offsets they meant over time. Asia/Dhaka was +07 for
 * the second half of 2009; Europe/London switches twice a year. An offset is a
 * fact about one moment, a zone name is the rule for all of them.
 */
export function ZoneNameVsOffsetDiagram() {
    return (
        <Sketch
            label='A Zone Name Is a Rule, an Offset Is One Reading'
            height={300}
            minWidth={880}
            viewBox='0 0 900 300'
            caption='Asia/Dhaka নামটা একটা নিয়মের খাতা। 2009 সালের 19 জুন রাত ১১টায় বাংলাদেশ ঘড়ি এক ঘণ্টা এগিয়ে +07 করেছিল, বছর শেষে আবার +06। Europe/London এ প্রতি বছর দুইবার বদলায়: গ্রীষ্মে +01, শীতে +00। তাই কারও ঘড়ি মনে রাখতে হলে +06 এর মতো Offset না, Asia/Dhaka এর মতো জায়গার নাম রাখুন। Offset শুধু একটা মুহূর্তের সত্য, নাম সব মুহূর্তের।'>
            <SketchText x={20} y={56} size={11} anchor='start' bold>
                Asia/Dhaka
            </SketchText>
            <OffsetSegment x={160} y={36} w={240} label='+06' />
            <OffsetSegment x={400} y={36} w={230} label='+07, 2009 এর জুন থেকে ডিসেম্বর' accent />
            <OffsetSegment x={630} y={36} w={250} label='+06' />
            <SketchText x={400} y={92} size={9.5} opacity={0.75}>
                2009-06-19 23:00
            </SketchText>
            <SketchText x={630} y={92} size={9.5} opacity={0.75}>
                2010-01-01
            </SketchText>

            <SketchText x={20} y={166} size={11} anchor='start' bold>
                Europe/London
            </SketchText>
            {[0, 1, 2, 3, 4, 5].map(i => (
                <OffsetSegment key={i} x={160 + i * 120} y={146} w={120} label={i % 2 === 0 ? '+00 শীত' : '+01 গ্রীষ্ম'} accent={i % 2 === 1} />
            ))}
            <SketchText x={520} y={204} size={9.5} opacity={0.75}>
                প্রতি বছর মার্চের শেষ রবিবার এগোয়, অক্টোবরের শেষ রবিবার পেছায়
            </SketchText>

            <rect x={160} y={232} width={720} height={44} fill='var(--primary)' fillOpacity={0.06} stroke='var(--primary)' strokeOpacity={0.6} strokeWidth='1.2' />
            <SketchText x={520} y={259} size={11} body bold accent>
                Column এ রাখুন: মুহূর্তটা timestamptz এ, দরকার হলে জায়গার নাম আলাদা text Column এ
            </SketchText>
        </Sketch>
    );
}
