import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. একটা Table, দুটো নাম                                                     */
/* ------------------------------------------------------------------------- */

const MINI = [
    { name: 'Tanvir Ahmed', city: 'Chattogram' },
    { name: 'Lamia Haque', city: 'Chattogram' },
    { name: 'Rahim Uddin', city: 'Dhaka' },
    { name: 'Nusrat Jahan', city: 'Dhaka' },
    { name: 'Kamal Hasan', city: 'Barishal' },
];

function MiniTable({ x, y, alias }: { x: number; y: number; alias: string }) {
    return (
        <g>
            <rect x={x} y={y} width={200} height={26} fill='var(--primary)' fillOpacity={0.12} />
            <rect
                x={x}
                y={y}
                width={200}
                height={26 + MINI.length * 30}
                fill='transparent'
                stroke='currentColor'
                strokeOpacity={0.45}
                strokeWidth='1.2'
            />
            <SketchText x={x + 12} y={y + 17} anchor='start' size={11} bold accent>
                {`customers AS ${alias}`}
            </SketchText>
            {MINI.map((row, i) => (
                <g key={row.name}>
                    <SketchText x={x + 12} y={y + 46 + i * 30} anchor='start' size={10.5}>
                        {row.name}
                    </SketchText>
                    <SketchText x={x + 188} y={y + 46 + i * 30} anchor='end' size={9} opacity={0.7}>
                        {row.city}
                    </SketchText>
                </g>
            ))}
        </g>
    );
}

/**
 * The idea of the lesson: the database does not copy anything. It reads the
 * same table twice under two names, and every line is one pair that
 * `a.city = b.city` lets through, a person with themselves included.
 */
export function TwoCopiesDiagram() {
    const ax = 120;
    const bx = 560;
    const top = 60;
    const rowY = (i: number) => top + 41 + i * 30;
    const pairs: [number, number][] = [];
    MINI.forEach((a, i) =>
        MINI.forEach((b, j) => {
            if (a.city === b.city) pairs.push([i, j]);
        })
    );
    return (
        <Sketch
            label='Self Join: একই Table, দুটো নাম'
            height={300}
            minWidth={880}
            viewBox='0 0 880 300'
            caption='বাস্তবে Table টা একটাই, Disk এ একবারই রাখা। Query তে দুটো আলাদা নাম (a আর b) দেওয়ায় Database তাকে দুইবার পড়ে, যেন দুটো আলাদা Table। প্রতিটা দাগ একটা জোড়া, যেটা a.city = b.city পাশ করেছে। খেয়াল করুন: প্রত্যেকে নিজের সাথেও জোড়া পেয়েছেন (ফিকে দাগ), আর Tanvir আর Lamia এর জোড়া এসেছে দুইবার, দুই দিক থেকে।'>
            <SketchText x={440} y={30} size={11} bold>
                শর্ত: a.city = b.city
            </SketchText>
            <MiniTable x={ax - 100} y={top} alias='a' />
            <MiniTable x={bx} y={top} alias='b' />
            {pairs.map(([i, j]) => {
                const self = i === j;
                return (
                    <line
                        key={`${i}-${j}`}
                        x1={ax + 104}
                        y1={rowY(i)}
                        x2={bx - 4}
                        y2={rowY(j)}
                        stroke={self ? 'currentColor' : 'var(--primary)'}
                        strokeOpacity={self ? 0.35 : 0.85}
                        strokeDasharray={self ? '4 3' : undefined}
                        strokeWidth='1.3'
                    />
                );
            })}
            <SketchText x={440} y={262} size={10} body opacity={0.85}>
                ৫টা Row থেকে ৯টা জোড়া: Chattogram ২ × ২, Dhaka ২ × ২, Barishal ১ × ১
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. তিনটা শর্ত, তিন রকম জোড়া                                                */
/* ------------------------------------------------------------------------- */

const DHAKA_IDS = [1, 2, 6, 8, 13, 15];

function PairMatrix({
    x,
    y,
    title,
    keep,
    count,
    note,
}: {
    x: number;
    y: number;
    title: string;
    keep: (a: number, b: number) => boolean;
    count: string;
    note: string;
}) {
    const cell = 24;
    return (
        <g>
            <SketchText x={x + (cell * 6) / 2 + 20} y={y - 34} size={10.5} bold accent>
                {title}
            </SketchText>
            <SketchText x={x + (cell * 6) / 2 + 20} y={y - 12} size={8.5} opacity={0.7}>
                b.customer_id
            </SketchText>
            {DHAKA_IDS.map((id, i) => (
                <SketchText key={`t${id}`} x={x + 40 + i * cell + cell / 2} y={y + 6} size={8.5} opacity={0.75}>
                    {String(id)}
                </SketchText>
            ))}
            {DHAKA_IDS.map((a, r) => (
                <g key={`r${a}`}>
                    <SketchText x={x + 30} y={y + 26 + r * cell} anchor='end' size={8.5} opacity={0.75}>
                        {String(a)}
                    </SketchText>
                    {DHAKA_IDS.map((b, c) => {
                        const on = keep(a, b);
                        return (
                            <rect
                                key={`${a}-${b}`}
                                x={x + 40 + c * cell}
                                y={y + 12 + r * cell}
                                width={cell - 3}
                                height={cell - 3}
                                fill={on ? 'var(--primary)' : 'currentColor'}
                                fillOpacity={on ? 0.55 : 0.06}
                                stroke='currentColor'
                                strokeOpacity={0.2}
                            />
                        );
                    })}
                </g>
            ))}
            <SketchText x={x + 6} y={y + 12 + 3 * cell} size={8.5} opacity={0.7} anchor='end'>
                a
            </SketchText>
            <SketchText x={x + (cell * 6) / 2 + 40} y={y + 12 + 6 * cell + 22} size={12} bold accent>
                {count}
            </SketchText>
            <SketchText x={x + (cell * 6) / 2 + 40} y={y + 12 + 6 * cell + 42} size={9.5} body opacity={0.85}>
                {note}
            </SketchText>
        </g>
    );
}

/**
 * Dhaka's six customers against themselves, as a grid. Every lit cell is one
 * output row. The diagonal is "a person paired with themselves"; the two
 * triangles are the same pair seen from both sides.
 */
export function PairMatrixDiagram() {
    return (
        <Sketch
            label='Dhaka এর ছয়জন, তিনটা শর্তে'
            height={330}
            minWidth={900}
            viewBox='0 0 900 330'
            caption='বাঁ থেকে ডানে: শুধু a.city = b.city দিলে ৩৬টা ঘরই জ্বলে, কোণাকুণি ছয়টা ঘর মানে প্রত্যেকে নিজের সাথে। a.customer_id <> b.customer_id যোগ করলে কোণাকুণি নিভে যায়, থাকে ৩০, কিন্তু প্রতিটা জোড়া দুইবার (1 আর 2, আবার 2 আর 1)। a.customer_id < b.customer_id দিলে শুধু উপরের ত্রিভুজ থাকে, ১৫টা জোড়া, প্রতিটা একবার। পুরো Table এ এই তিনটা সংখ্যা ৪৭, ৩২ আর ১৬।'>
            <PairMatrix x={40} y={70} title='a.city = b.city' keep={() => true} count='৩৬টা Row' note='নিজের সাথেও জোড়া' />
            <PairMatrix
                x={330}
                y={70}
                title='আর a.id <> b.id'
                keep={(a, b) => a !== b}
                count='৩০টা Row'
                note='প্রতিটা জোড়া দুইবার'
            />
            <PairMatrix
                x={620}
                y={70}
                title='আর a.id < b.id'
                keep={(a, b) => a < b}
                count='১৫টা Row'
                note='প্রতিটা জোড়া একবার'
            />
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. একই Table, আলাদা ভূমিকা                                                  */
/* ------------------------------------------------------------------------- */

function RoleBox({
    x,
    y,
    title,
    lines,
    accent,
}: {
    x: number;
    y: number;
    title: string;
    lines: string[];
    accent?: boolean;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={250}
                height={30 + lines.length * 20}
                fill={accent ? 'var(--primary)' : 'currentColor'}
                fillOpacity={accent ? 0.08 : 0.03}
                stroke={accent ? 'var(--primary)' : 'currentColor'}
                strokeOpacity={accent ? 0.9 : 0.45}
                strokeWidth='1.2'
            />
            <SketchText x={x + 14} y={y + 20} anchor='start' size={11} bold accent={accent}>
                {title}
            </SketchText>
            {lines.map((line, i) => (
                <SketchText key={line} x={x + 14} y={y + 42 + i * 20} anchor='start' size={9.5} opacity={0.85}>
                    {line}
                </SketchText>
            ))}
        </g>
    );
}

/**
 * Two tables, each used twice: `bookings` as a and b (the pair), `customers`
 * as ca and cb (one name per side). The example row is departure 1, where
 * Rahim Uddin and Nusrat Jahan travelled together.
 */
export function RolesDiagram() {
    return (
        <Sketch
            label='একসাথে ভ্রমণ: দুটো Table, প্রত্যেকটা দুইবার'
            height={330}
            minWidth={880}
            viewBox='0 0 880 330'
            caption='bookings দুইবার এসেছে জোড়া বানাতে: একই Departure, আলাদা Booking। customers দুইবার এসেছে অন্য কারণে: জোড়ার প্রত্যেক পাশের মানুষের নাম আলাদা করে আনতে। ca আর cb নিজেদের মধ্যে কোনো শর্তে জোড়া হয়নি, প্রত্যেকে শুধু নিজের Booking এর সাথে। একটা Table কে আলাদা ভূমিকায় দুইবার ব্যবহার করাও Self Join এর পরিবার।'>
            <RoleBox
                x={60}
                y={40}
                title='bookings AS a'
                lines={['booking_id 1, departure 1', 'customer_id 1']}
                accent
            />
            <RoleBox
                x={570}
                y={40}
                title='bookings AS b'
                lines={['booking_id 2, departure 1', 'customer_id 2']}
                accent
            />
            <RoleBox x={60} y={210} title='customers AS ca' lines={['customer_id 1', 'Rahim Uddin']} />
            <RoleBox x={570} y={210} title='customers AS cb' lines={['customer_id 2', 'Nusrat Jahan']} />
            <line x1={310} y1={75} x2={570} y2={75} stroke='var(--primary)' strokeWidth='1.5' />
            <SketchText x={440} y={62} size={9.5} accent>
                a.departure_id = b.departure_id
            </SketchText>
            <SketchText x={440} y={96} size={9.5} accent>
                a.booking_id &lt; b.booking_id
            </SketchText>
            <line x1={185} y1={110} x2={185} y2={210} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.3' />
            <SketchText x={195} y={165} anchor='start' size={9} opacity={0.8}>
                ca.customer_id = a.customer_id
            </SketchText>
            <line x1={695} y1={110} x2={695} y2={210} stroke='currentColor' strokeOpacity={0.6} strokeWidth='1.3' />
            <SketchText x={685} y={165} anchor='end' size={9} opacity={0.8}>
                cb.customer_id = b.customer_id
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 4. এক Table এর ভেতরে একটা গাছ                                               */
/* ------------------------------------------------------------------------- */

const STAFF = [
    { id: 1, name: 'Rumana', role: 'Owner', manager: null as number | null },
    { id: 2, name: 'Faruk', role: 'Operations Manager', manager: 1 },
    { id: 3, name: 'Tanim', role: 'Developer', manager: 1 },
    { id: 4, name: 'Nabila', role: 'Support', manager: 2 },
    { id: 5, name: 'Sadia', role: 'Sales', manager: 2 },
    { id: 6, name: 'Jamal Hossain', role: 'Guide', manager: 2 },
];

const TREE_POS: Record<number, { x: number; y: number }> = {
    1: { x: 190, y: 50 },
    2: { x: 110, y: 140 },
    3: { x: 270, y: 140 },
    4: { x: 40, y: 230 },
    5: { x: 140, y: 230 },
    6: { x: 240, y: 230 },
};

/**
 * The staff table from the lesson as a tree on the left and as rows on the
 * right. Each `manager_id` points at a `staff_id` in the same table, which is
 * exactly what a self join follows.
 */
export function HierarchyDiagram() {
    const tableX = 470;
    const rowY = (i: number) => 74 + i * 34;
    return (
        <Sketch
            label='Manager এর খোঁজ: একই Table এর ভেতরে তীর'
            height={330}
            minWidth={880}
            viewBox='0 0 880 330'
            caption='বাঁয়ে প্রতিষ্ঠানের গাছ, ডানে সেই একই তথ্য একটা Table এ। প্রতিটা Row এর manager_id একই Table এর আরেকটা Row এর staff_id কে দেখায়। Rumana এর manager_id খালি (NULL), কারণ তাঁর উপরে কেউ নেই। তাই কর্মী আর তাঁর Manager পাশাপাশি আনতে Table টাকে নিজের সাথে জোড়া লাগাতে হয়, আর Rumana কে রাখতে চাইলে সেটা LEFT JOIN।'>
            <defs>
                <marker
                    id='self-tree-arrow'
                    markerWidth={8}
                    markerHeight={8}
                    refX={7}
                    refY={3.5}
                    orient='auto'
                    markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            {STAFF.filter(s => s.manager !== null).map(s => {
                const from = TREE_POS[s.id];
                const to = TREE_POS[s.manager as number];
                return (
                    <line
                        key={`edge${s.id}`}
                        x1={from.x + 50}
                        y1={from.y}
                        x2={to.x + 50}
                        y2={to.y + 36}
                        stroke='var(--primary)'
                        strokeOpacity={0.7}
                        strokeWidth='1.3'
                        markerEnd='url(#self-tree-arrow)'
                    />
                );
            })}
            {STAFF.map(s => {
                const p = TREE_POS[s.id];
                return (
                    <g key={`node${s.id}`}>
                        <rect
                            x={p.x}
                            y={p.y}
                            width={100}
                            height={36}
                            fill={s.manager === null ? 'var(--primary)' : 'var(--card)'}
                            fillOpacity={s.manager === null ? 0.12 : 1}
                            stroke='currentColor'
                            strokeOpacity={0.5}
                            strokeWidth='1.1'
                        />
                        <SketchText x={p.x + 50} y={p.y + 16} size={9.5} bold>
                            {s.name}
                        </SketchText>
                        <SketchText x={p.x + 50} y={p.y + 30} size={8} opacity={0.7}>
                            {s.role}
                        </SketchText>
                    </g>
                );
            })}

            <rect x={tableX} y={40} width={330} height={24} fill='var(--primary)' fillOpacity={0.12} />
            <SketchText x={tableX + 12} y={56} anchor='start' size={10} bold accent>
                staff_id
            </SketchText>
            <SketchText x={tableX + 90} y={56} anchor='start' size={10} bold accent>
                full_name
            </SketchText>
            <SketchText x={tableX + 240} y={56} anchor='start' size={10} bold accent>
                manager_id
            </SketchText>
            {STAFF.map((s, i) => (
                <g key={`row${s.id}`}>
                    <rect
                        x={tableX}
                        y={rowY(i) - 10}
                        width={330}
                        height={30}
                        fill='transparent'
                        stroke='currentColor'
                        strokeOpacity={0.25}
                    />
                    <SketchText x={tableX + 26} y={rowY(i) + 9} size={10}>
                        {String(s.id)}
                    </SketchText>
                    <SketchText x={tableX + 90} y={rowY(i) + 9} anchor='start' size={10}>
                        {s.name}
                    </SketchText>
                    <SketchText x={tableX + 268} y={rowY(i) + 9} size={10} accent={s.manager !== null} opacity={s.manager === null ? 0.5 : 1}>
                        {s.manager === null ? 'NULL' : String(s.manager)}
                    </SketchText>
                </g>
            ))}
            {STAFF.filter(s => s.manager !== null).map((s, k) => {
                const from = STAFF.findIndex(x => x.id === s.id);
                const to = STAFF.findIndex(x => x.id === s.manager);
                const xr = tableX + 345 + (k % 3) * 9;
                return (
                    <path
                        key={`loop${s.id}`}
                        d={`M ${tableX + 300} ${rowY(from) + 5} H ${xr} V ${rowY(to) + 5} H ${tableX + 336}`}
                        fill='none'
                        stroke='var(--primary)'
                        strokeOpacity={0.55}
                        strokeWidth='1.1'
                        markerEnd='url(#self-tree-arrow)'
                    />
                );
            })}
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 5. Self Join বনাম Window Function                                          */
/* ------------------------------------------------------------------------- */

const TOUR1 = ['2026-01-15', '2026-02-12', '2026-11-20', '2026-12-18'];

function DepartureColumn({ x }: { x: number }) {
    return (
        <g>
            {TOUR1.map((d, i) => (
                <g key={d}>
                    <rect
                        x={x}
                        y={30 + i * 44}
                        width={110}
                        height={30}
                        fill='var(--card)'
                        stroke='currentColor'
                        strokeOpacity={0.45}
                    />
                    <SketchText x={x + 55} y={50 + i * 44} size={10}>
                        {d}
                    </SketchText>
                </g>
            ))}
        </g>
    );
}

/**
 * Tour 1's four departures, "which one came just before me". The self join
 * pairs each departure with every earlier one and then keeps the latest; the
 * window function looks one row up in a single sorted pass.
 */
export function SelfJoinVsWindowSplit() {
    const pairs: [number, number][] = [];
    TOUR1.forEach((_, cur) => {
        for (let prev = 0; prev < cur; prev++) pairs.push([cur, prev]);
    });
    return (
        <SketchSplit
            label='আগের Departure: দুই পথে'
            caption='বাঁয়ে Self Join: প্রতিটা Departure তার আগের সবগুলোর সাথে জোড়া পায় (০, ১, ২, ৩ মিলে ৬টা জোড়া), তারপর max() সবচেয়ে কাছেরটা বেছে নেয়। ডানে lag(): সাজানো তালিকায় প্রতিটা Row শুধু ঠিক উপরের Row টা দেখে, ৩টা তীর। ১০০টা Departure হলে বাঁয়ের জোড়া হতো ৪৯৫০টা, ডানের তীর ৯৯টা।'
            panels={[
                {
                    title: 'Self Join + max()',
                    sub: '৬টা জোড়া',
                    viewBox: '0 0 360 220',
                    height: 220,
                    minWidth: 300,
                    children: (
                        <g>
                            <DepartureColumn x={20} />
                            <DepartureColumn x={230} />
                            {pairs.map(([cur, prev]) => (
                                <line
                                    key={`${cur}-${prev}`}
                                    x1={130}
                                    y1={45 + cur * 44}
                                    x2={230}
                                    y2={45 + prev * 44}
                                    stroke='var(--primary)'
                                    strokeOpacity={prev === cur - 1 ? 0.9 : 0.35}
                                    strokeWidth='1.2'
                                />
                            ))}
                            <SketchText x={75} y={18} size={9} opacity={0.75}>
                                cur
                            </SketchText>
                            <SketchText x={285} y={18} size={9} opacity={0.75}>
                                prev
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'lag() OVER (...)',
                    sub: '৩টা তীর',
                    viewBox: '0 0 360 220',
                    height: 220,
                    minWidth: 300,
                    children: (
                        <g>
                            <DepartureColumn x={60} />
                            {TOUR1.slice(1).map((d, i) => (
                                <path
                                    key={d}
                                    d={`M 175 ${45 + (i + 1) * 44} C 215 ${45 + (i + 1) * 44}, 215 ${45 + i * 44}, 175 ${45 + i * 44}`}
                                    fill='none'
                                    stroke='var(--primary)'
                                    strokeWidth='1.3'
                                />
                            ))}
                            <SketchText x={250} y={110} anchor='start' size={9.5} body opacity={0.85}>
                                ঠিক উপরের Row
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}
