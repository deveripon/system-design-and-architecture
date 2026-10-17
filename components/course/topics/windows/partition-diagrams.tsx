import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* Real values used by the pictures in this lesson                           */
/* ------------------------------------------------------------------------- */

/** The nine tours by destination, with each destination's real average price. */
const DESTINATIONS: {
    id: number;
    name: string;
    avg: string;
    tours: { title: string; price: string }[];
}[] = [
    {
        id: 1,
        name: "Saint Martin's Island",
        avg: '22250.00',
        tours: [
            { title: 'Saint Martin Island Escape', price: '12500.00' },
            { title: 'Saint Martin Luxury Stay', price: '32000.00' },
        ],
    },
    {
        id: 2,
        name: "Cox's Bazar",
        avg: '12000.00',
        tours: [
            { title: "Cox's Bazar Beach Weekend", price: '8500.00' },
            { title: "Cox's Bazar Family Package", price: '15500.00' },
        ],
    },
    { id: 3, name: 'Sundarbans', avg: '18000.00', tours: [{ title: 'Sundarbans Mangrove Cruise', price: '18000.00' }] },
    { id: 4, name: 'Sajek Valley', avg: '9500.00', tours: [{ title: 'Sajek Valley Cloud Trip', price: '9500.00' }] },
    { id: 5, name: 'Bandarban', avg: '14000.00', tours: [{ title: 'Bandarban Hill Trek', price: '14000.00' }] },
    {
        id: 6,
        name: 'Sylhet',
        avg: '5650.00',
        tours: [
            { title: 'Sylhet Tea Garden Tour', price: '7800.00' },
            { title: 'Ratargul Swamp Boat Day', price: '3500.00' },
        ],
    },
];

function Arrow({ id, muted }: { id: string; muted?: boolean }) {
    return (
        <defs>
            <marker
                id={id}
                markerWidth={8}
                markerHeight={8}
                refX={7}
                refY={3.5}
                orient='auto'
                markerUnits='userSpaceOnUse'>
                <path
                    d='M0,0 L7,3.5 L0,7 Z'
                    fill={muted ? 'currentColor' : 'var(--primary)'}
                    fillOpacity={muted ? 0.55 : 1}
                />
            </marker>
        </defs>
    );
}

/* ------------------------------------------------------------------------- */
/* 1. One window per group: the tours table cut into destination slices      */
/* ------------------------------------------------------------------------- */

const SLICE_ROW_H = 26;

/** Where each destination's slice starts, worked out once so render never reassigns. */
const SLICE_TOPS = DESTINATIONS.reduce<number[]>((tops, d, i) => {
    const prev = i === 0 ? 46 : tops[i - 1] + DESTINATIONS[i - 1].tours.length * SLICE_ROW_H + 18;
    return [...tops, prev];
}, []);

export function PartitionSlicesDiagram() {
    const rowH = SLICE_ROW_H;
    return (
        <Sketch
            label='PARTITION BY destination_id: একটা Table, ছয়টা আলাদা Window'
            height={400}
            minWidth={840}
            viewBox='0 0 840 400'
            caption='নয়টা ট্যুর ছয়টা দলে ভাগ হয়েছে, প্রতিটা Destination এর জন্য একটা। প্রতিটা দলের নিজের গড় ডানে, আর সেই দলের প্রতিটা Row এর পাশে ঠিক সেই সংখ্যাটাই বসে। কোনো Row হারায় না, নয়টা Row ঢুকেছে, নয়টাই বেরিয়েছে। Kuakata (destination 7) এর কোনো ট্যুর নেই, তাই তার কোনো দলও নেই: Window শুধু যেসব Row আছে তাদের থেকেই দল বানায়।'>
            <Arrow id='partition-slice-arrow' />
            <SketchText x={40} y={26} size={10} bold anchor='start'>
                tours (নয়টা Row)
            </SketchText>
            <SketchText x={620} y={26} size={10} bold anchor='start' accent>
                avg(price_bdt) OVER (PARTITION BY destination_id)
            </SketchText>
            {DESTINATIONS.map((d, i) => {
                const top = SLICE_TOPS[i];
                const h = d.tours.length * rowH + 10;
                const shade = i % 2 === 0;
                return (
                    <g key={d.id}>
                        <rect
                            x={30}
                            y={top}
                            width={540}
                            height={h}
                            fill='var(--primary)'
                            fillOpacity={shade ? 0.07 : 0.03}
                            stroke='var(--primary)'
                            strokeOpacity={0.5}
                            strokeWidth='1.1'
                        />
                        <SketchText x={44} y={top + 17} size={8.5} anchor='start' accent bold>
                            {`destination ${d.id}`}
                        </SketchText>
                        <SketchText x={44} y={top + 30} size={8} anchor='start' opacity={0.7}>
                            {d.name}
                        </SketchText>
                        {d.tours.map((t, j) => (
                            <g key={t.title}>
                                <SketchText x={210} y={top + 19 + j * rowH} size={9.5} anchor='start'>
                                    {t.title}
                                </SketchText>
                                <SketchText x={555} y={top + 19 + j * rowH} size={9.5} anchor='end' opacity={0.85}>
                                    {t.price}
                                </SketchText>
                                <line
                                    x1={572}
                                    y1={top + 15 + j * rowH}
                                    x2={612}
                                    y2={top + 15 + j * rowH}
                                    stroke='var(--primary)'
                                    strokeOpacity={0.6}
                                    strokeWidth='1'
                                    markerEnd='url(#partition-slice-arrow)'
                                />
                                <SketchText x={625} y={top + 19 + j * rowH} size={10} anchor='start' bold accent>
                                    {d.avg}
                                </SketchText>
                            </g>
                        ))}
                    </g>
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. GROUP BY folds each group into one row, PARTITION BY keeps every row    */
/* ------------------------------------------------------------------------- */

export function GroupVsPartitionSplit() {
    const rows = DESTINATIONS.flatMap(d => d.tours.map(t => ({ dest: d.id, price: t.price, avg: d.avg })));
    return (
        <SketchSplit
            label='একই দল, দুই রকম ফলাফল'
            caption='বাঁয়ে GROUP BY destination_id: প্রতিটা দল একটা Row এ গুটিয়ে যায়, তাই ছয়টা Row, আর ট্যুরের নিজের দাম আর দেখা যায় না। ডানে PARTITION BY destination_id: দলটা শুধু হিসাবের জন্য, ফলাফলে নয়টা Row ই থাকে, আর প্রতিটা Row এর পাশে তার দলের গড়। দুটো একই গড় দেয়, তফাত শুধু Row থাকে কি না।'
            panels={[
                {
                    title: 'GROUP BY',
                    sub: 'দলপ্রতি একটা Row, ৬টা',
                    viewBox: '0 0 320 290',
                    height: 290,
                    minWidth: 300,
                    children: (
                        <>
                            <SketchText x={70} y={22} size={9.5} bold>
                                destination_id
                            </SketchText>
                            <SketchText x={220} y={22} size={9.5} bold accent>
                                avg
                            </SketchText>
                            {DESTINATIONS.map((d, i) => (
                                <g key={d.id}>
                                    <rect
                                        x={20}
                                        y={34 + i * 36}
                                        width={280}
                                        height={30}
                                        fill='var(--primary)'
                                        fillOpacity={0.06}
                                        stroke='var(--primary)'
                                        strokeOpacity={0.45}
                                        strokeWidth='1'
                                    />
                                    <SketchText x={70} y={53 + i * 36} size={10}>
                                        {String(d.id)}
                                    </SketchText>
                                    <SketchText x={220} y={53 + i * 36} size={10} accent bold>
                                        {d.avg}
                                    </SketchText>
                                </g>
                            ))}
                        </>
                    ),
                },
                {
                    title: 'PARTITION BY',
                    sub: 'সব Row থাকে, ৯টা',
                    viewBox: '0 0 320 290',
                    height: 290,
                    minWidth: 300,
                    children: (
                        <>
                            <SketchText x={50} y={20} size={9} bold>
                                dest
                            </SketchText>
                            <SketchText x={140} y={20} size={9} bold>
                                price_bdt
                            </SketchText>
                            <SketchText x={250} y={20} size={9} bold accent>
                                dest_avg
                            </SketchText>
                            {rows.map((r, i) => {
                                const first = i === 0 || rows[i - 1].dest !== r.dest;
                                return (
                                    <g key={`${r.dest}-${r.price}`}>
                                        <rect
                                            x={20}
                                            y={28 + i * 28}
                                            width={280}
                                            height={24}
                                            fill='var(--primary)'
                                            fillOpacity={r.dest % 2 === 1 ? 0.07 : 0.02}
                                            stroke='currentColor'
                                            strokeOpacity={first ? 0.35 : 0.15}
                                            strokeWidth='1'
                                        />
                                        <SketchText x={50} y={44 + i * 28} size={9.5}>
                                            {String(r.dest)}
                                        </SketchText>
                                        <SketchText x={140} y={44 + i * 28} size={9.5} opacity={0.85}>
                                            {r.price}
                                        </SketchText>
                                        <SketchText x={250} y={44 + i * 28} size={9.5} accent bold>
                                            {r.avg}
                                        </SketchText>
                                    </g>
                                );
                            })}
                        </>
                    ),
                },
            ]}
        />
    );
}

/* ------------------------------------------------------------------------- */
/* 3. A window only ever sees the rows WHERE left behind                      */
/* ------------------------------------------------------------------------- */

export function WhereThenWindowDiagram() {
    const kept: { id: number; customer: number }[] = [
        { id: 1, customer: 1 },
        { id: 8, customer: 1 },
        { id: 17, customer: 1 },
        { id: 2, customer: 2 },
        { id: 13, customer: 2 },
        { id: 5, customer: 5 },
    ];
    return (
        <Sketch
            label='আগে WHERE, পরে Window'
            height={300}
            minWidth={840}
            viewBox='0 0 840 300'
            caption='WHERE customer_id IN (1, 2, 5) চব্বিশটা Booking থেকে ছয়টা রাখে। Window এর হিসাব শুরু হয় এর পরে, তাই count(*) OVER () এর কাছে "সব Booking" মানে এই ছয়টা, চব্বিশটা না। PARTITION BY customer_id এই ছয়টাকেই তিনটা দলে ভাগ করে: Customer 1 এর তিনটা, Customer 2 এর দুটো, Customer 5 এর একটা। কোনো Window কখনো WHERE এ বাদ পড়া Row দেখে না।'>
            <Arrow id='partition-where-arrow' />
            <rect x={20} y={40} width={150} height={200} fill='transparent' stroke='currentColor' strokeOpacity={0.4} strokeWidth='1.2' />
            <SketchText x={95} y={30} size={10} bold>
                bookings
            </SketchText>
            <SketchText x={95} y={130} size={22} bold opacity={0.6}>
                ২৪
            </SketchText>
            <SketchText x={95} y={156} size={9.5} body opacity={0.7}>
                টা Row
            </SketchText>
            <line x1={174} y1={140} x2={236} y2={140} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#partition-where-arrow)' />
            <rect x={240} y={110} width={170} height={60} fill='var(--primary)' fillOpacity={0.08} stroke='var(--primary)' strokeWidth='1.2' />
            <SketchText x={325} y={134} size={9.5} bold accent>
                WHERE customer_id
            </SketchText>
            <SketchText x={325} y={152} size={9.5} bold accent>
                IN (1, 2, 5)
            </SketchText>
            <line x1={414} y1={140} x2={470} y2={140} stroke='var(--primary)' strokeWidth='1.3' markerEnd='url(#partition-where-arrow)' />
            {kept.map((b, i) => {
                const y = 40 + i * 34;
                const groupTop = b.customer === 1 ? 40 : b.customer === 2 ? 142 : 210;
                const first = i === 0 || kept[i - 1].customer !== b.customer;
                return (
                    <g key={b.id}>
                        {first && (
                            <rect
                                x={474}
                                y={groupTop - 4}
                                width={176}
                                height={(b.customer === 1 ? 3 : b.customer === 2 ? 2 : 1) * 34 - 2}
                                fill='var(--primary)'
                                fillOpacity={0.05}
                                stroke='var(--primary)'
                                strokeOpacity={0.6}
                                strokeWidth='1'
                                strokeDasharray='4 3'
                            />
                        )}
                        <SketchText x={486} y={y + 18} size={9.5} anchor='start'>
                            {`booking ${b.id}`}
                        </SketchText>
                        <SketchText x={640} y={y + 18} size={9} anchor='end' opacity={0.7}>
                            {`customer ${b.customer}`}
                        </SketchText>
                        <SketchText x={680} y={y + 18} size={9.5} anchor='start' accent bold>
                            {`6  ·  ${b.customer === 1 ? 3 : b.customer === 2 ? 2 : 1}`}
                        </SketchText>
                    </g>
                );
            })}
            <SketchText x={760} y={26} size={8.5} anchor='middle' accent>
                OVER () · OVER (PARTITION
            </SketchText>
            <SketchText x={760} y={258} size={8.5} anchor='middle' opacity={0.7}>
                BY customer_id)
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. Several windows on one row: each OVER draws its own circle             */
/* ------------------------------------------------------------------------- */

export function SeveralWindowsDiagram() {
    const windows: { label: string; covers: string; value: string; width: number }[] = [
        { label: 'count(*) OVER ()', covers: 'সব Booking', value: '24', width: 700 },
        { label: 'count(*) OVER (PARTITION BY status)', covers: "যাদের status 'confirmed'", value: '17', width: 600 },
        { label: 'count(*) OVER (PARTITION BY customer_id)', covers: 'Customer 1 এর Booking', value: '3', width: 440 },
    ];
    return (
        <Sketch
            label='একটা Row, তিনটা আলাদা Window'
            height={260}
            minWidth={840}
            viewBox='0 0 840 260'
            caption='Booking 1 (Customer 1, confirmed) এর জন্য তিনটা OVER তিনটা আলাদা দল দেখে। OVER () সব চব্বিশটা, PARTITION BY status যে সতেরোটা confirmed, আর PARTITION BY customer_id Customer 1 এর তিনটা। একই Query তে প্রতিটা OVER নিজের মতো দল বানায়, কেউ কারো দলে হাত দেয় না।'>
            <Arrow id='partition-several-arrow' />
            {windows.map((w, i) => {
                const x = 70 + (700 - w.width) / 2;
                const y = 30 + i * 44;
                return (
                    <g key={w.label}>
                        <rect
                            x={x}
                            y={y}
                            width={w.width}
                            height={170 - i * 44}
                            fill='var(--primary)'
                            fillOpacity={0.04 + i * 0.03}
                            stroke='var(--primary)'
                            strokeOpacity={0.4 + i * 0.2}
                            strokeWidth='1.1'
                        />
                        <SketchText x={x + 12} y={y + 16} size={9} anchor='start' accent bold>
                            {w.label}
                        </SketchText>
                        <SketchText x={x + w.width - 12} y={y + 16} size={9} anchor='end' body opacity={0.8}>
                            {`${w.covers}: ${w.value}`}
                        </SketchText>
                    </g>
                );
            })}
            <rect x={300} y={164} width={240} height={30} fill='var(--card)' stroke='currentColor' strokeOpacity={0.7} strokeWidth='1.3' />
            <SketchText x={420} y={184} size={10} bold>
                booking 1 · customer 1 · confirmed
            </SketchText>
            <SketchText x={420} y={228} size={10} accent bold>
                24 · 17 · 3
            </SketchText>
            <line x1={420} y1={196} x2={420} y2={212} stroke='var(--primary)' strokeWidth='1.2' markerEnd='url(#partition-several-arrow)' />
        </Sketch>
    );
}
