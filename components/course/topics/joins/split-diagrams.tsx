import { Sketch, SketchSplit, SketchText } from '../../sketch';

/* ------------------------------------------------------------------------- */
/* 1. এক চওড়া Table এ একই কথা বারবার                                          */
/* ------------------------------------------------------------------------- */

/** Five real rows of the flattened view, as a join of four tables prints them. */
const WIDE_ROWS = [
    { id: '1', name: 'Rahim Uddin', phone: '+8801000000101', title: 'Saint Martin Island Escape', price: '12500.00' },
    { id: '8', name: 'Rahim Uddin', phone: '+8801000000101', title: 'Sajek Valley Cloud Trip', price: '9500.00' },
    { id: '17', name: 'Rahim Uddin', phone: '+8801000000101', title: 'Sundarbans Mangrove Cruise', price: '18000.00' },
    { id: '2', name: 'Nusrat Jahan', phone: '+8801000000102', title: 'Saint Martin Island Escape', price: '12500.00' },
    { id: '3', name: 'Tanvir Ahmed', phone: '', title: 'Saint Martin Island Escape', price: '12500.00' },
];

const WIDE_COLUMNS = [
    { key: 'id', label: 'booking_id', x: 20, w: 90 },
    { key: 'name', label: 'full_name', x: 110, w: 130 },
    { key: 'phone', label: 'phone', x: 240, w: 140 },
    { key: 'title', label: 'title', x: 380, w: 230 },
    { key: 'price', label: 'price_bdt', x: 610, w: 100 },
] as const;

/** Which cells repeat information another row already holds. */
function repeated(rowIndex: number, key: string) {
    if ((key === 'name' || key === 'phone') && rowIndex <= 2) return true;
    if ((key === 'title' || key === 'price') && [0, 3, 4].includes(rowIndex)) return true;
    return false;
}

/**
 * What one wide table looks like with the Island Tours data: Rahim's name and
 * phone written three times, the Saint Martin title and price on every one of
 * its bookings. Every repeated cell is a place an update can be missed.
 */
export function RepeatedCellsDiagram() {
    const top = 46;
    const rowH = 34;
    return (
        <Sketch
            label='One Wide Table: The Same Facts Again and Again'
            height={290}
            minWidth={740}
            viewBox='0 0 740 290'
            caption='Sample Database এর আসল পাঁচটা Booking, সব কথা এক Table এ লিখলে যেমন দেখাত। রঙিন ঘরগুলো এমন কথা, যা অন্য কোনো Row এ আগেই লেখা আছে। পুরো ২৪টা Booking এ Rahim Uddin এর নাম আর ফোন আসে তিনবার, আর Saint Martin Island Escape এর নাম আর দাম আসে সাতবার। Rahim ফোন বদলালে তিনটা জায়গায় বদলাতে হবে, একটা ভুলে গেলেই Data দুই রকম কথা বলবে।'>
            {WIDE_COLUMNS.map(col => (
                <SketchText key={col.key} x={col.x + 8} y={30} anchor='start' size={10.5} bold accent>
                    {col.label}
                </SketchText>
            ))}
            <line x1={20} y1={top - 6} x2={710} y2={top - 6} stroke='currentColor' strokeOpacity={0.5} strokeWidth='1.2' />
            {WIDE_ROWS.map((row, r) => {
                const y = top + r * rowH;
                return (
                    <g key={row.id}>
                        {WIDE_COLUMNS.map(col => {
                            const hot = repeated(r, col.key);
                            return (
                                <g key={col.key}>
                                    <rect
                                        x={col.x + 2}
                                        y={y}
                                        width={col.w - 4}
                                        height={rowH - 6}
                                        fill={hot ? 'var(--primary)' : 'transparent'}
                                        fillOpacity={hot ? 0.14 : 0}
                                        stroke={hot ? 'var(--primary)' : 'currentColor'}
                                        strokeOpacity={hot ? 0.8 : 0.2}
                                        strokeWidth='1'
                                    />
                                    <SketchText x={col.x + 8} y={y + 18} anchor='start' size={10} opacity={0.9}>
                                        {row[col.key] || 'NULL'}
                                    </SketchText>
                                </g>
                            );
                        })}
                    </g>
                );
            })}
            <SketchText x={20} y={top + 5 * rowH + 22} anchor='start' size={10.5} body opacity={0.85}>
                রঙিন ঘর মানে একই তথ্যের আরেকটা কপি। কপি যত, ভুলের সুযোগ তত।
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 2. Key দিয়ে এক Table থেকে আরেক Table এ                                      */
/* ------------------------------------------------------------------------- */

function MiniTable({
    x,
    y,
    name,
    columns,
    values,
    highlight,
}: {
    x: number;
    y: number;
    name: string;
    columns: string[];
    values: string[];
    highlight: number[];
}) {
    const w = 190;
    const rowH = 20;
    return (
        <g>
            <rect x={x} y={y} width={w} height={26 + columns.length * rowH + 6} fill='var(--card)' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
            <rect x={x} y={y} width={w} height={24} fill='var(--primary)' fillOpacity={0.12} />
            <SketchText x={x + 10} y={y + 16} anchor='start' size={11} bold accent>
                {name}
            </SketchText>
            {columns.map((col, i) => {
                const hot = highlight.includes(i);
                const cy = y + 26 + i * rowH;
                return (
                    <g key={col}>
                        {hot && (
                            <rect x={x + 4} y={cy + 2} width={w - 8} height={rowH - 4} fill='var(--primary)' fillOpacity={0.14} />
                        )}
                        <SketchText x={x + 10} y={cy + 15} anchor='start' size={9.5} opacity={0.75}>
                            {col}
                        </SketchText>
                        <SketchText x={x + w - 10} y={cy + 15} anchor='end' size={9.5} bold={hot} accent={hot}>
                            {values[i]}
                        </SketchText>
                    </g>
                );
            })}
        </g>
    );
}

/**
 * Booking 13 as the database holds it: two numbers in the booking row point at
 * a customer row and a departure row, and the departure points on at its tour.
 * The values are the real ones from the sample database.
 */
export function KeyLinksDiagram() {
    const arrow = (d: string) => (
        <path d={d} fill='none' stroke='var(--primary)' strokeWidth='1.4' markerEnd='url(#split-key-arrow)' />
    );
    return (
        <Sketch
            label='Keys Are the Links: Booking 13 Across Four Tables'
            height={330}
            minWidth={900}
            viewBox='0 0 900 330'
            caption='Booking 13 এর Row এ Customer এর নাম নেই, আছে শুধু customer_id 2। সেই 2 টা customers Table এর যে Row এর Primary Key 2, সেটাকে দেখায়: Nusrat Jahan। একইভাবে departure_id 8 দেখায় departures এর Row 8 কে, আর সেখান থেকে tour_id 1 দেখায় Saint Martin Island Escape কে। প্রতিটা তীর একটা Foreign Key, আর তীর যেখানে গিয়ে থামে সেটা একটা Primary Key। Join মানে এই তীর ধরে ধরে Row জোড়া লাগানো।'>
            <defs>
                <marker id='split-key-arrow' markerWidth={8} markerHeight={8} refX={7} refY={3.5} orient='auto' markerUnits='userSpaceOnUse'>
                    <path d='M0,0 L7,3.5 L0,7 Z' fill='var(--primary)' />
                </marker>
            </defs>
            <MiniTable
                x={20}
                y={110}
                name='bookings'
                columns={['booking_id', 'customer_id', 'departure_id', 'seats', 'status']}
                values={['13', '2', '8', '2', 'confirmed']}
                highlight={[1, 2]}
            />
            <MiniTable
                x={350}
                y={20}
                name='customers'
                columns={['customer_id', 'full_name', 'phone', 'city']}
                values={['2', 'Nusrat Jahan', '+8801000000102', 'Dhaka']}
                highlight={[0]}
            />
            <MiniTable
                x={350}
                y={190}
                name='departures'
                columns={['departure_id', 'tour_id', 'starts_on', 'seats_left']}
                values={['8', '1', '2026-11-20', '14']}
                highlight={[0, 1]}
            />
            <MiniTable
                x={680}
                y={190}
                name='tours'
                columns={['tour_id', 'title', 'price_bdt']}
                values={['1', 'Saint Martin Is…', '12500.00']}
                highlight={[0]}
            />
            {arrow('M 210 166 C 280 166, 280 56, 346 56')}
            {arrow('M 210 186 C 280 186, 280 226, 346 226')}
            {arrow('M 540 246 C 600 246, 610 226, 676 226')}
            <SketchText x={278} y={110} size={9.5} body accent>
                Foreign Key
            </SketchText>
            <SketchText x={610} y={206} size={9.5} body accent>
                Foreign Key
            </SketchText>
            <SketchText x={445} y={312} size={10} body opacity={0.8}>
                তীরের শুরু Foreign Key, তীরের শেষ Primary Key
            </SketchText>
        </Sketch>
    );
}

/* ------------------------------------------------------------------------- */
/* 3. ON নাকি USING                                                           */
/* ------------------------------------------------------------------------- */

function ColumnStrip({ y, columns, accent }: { y: number; columns: string[]; accent: string }) {
    const widths = columns.map(col => Math.max(54, col.length * 7.2 + 12));
    const starts = widths.map((_, i) => 10 + widths.slice(0, i).reduce((sum, w) => sum + w + 4, 0));
    return (
        <g>
            {columns.map((col, i) => {
                const w = widths[i];
                const cx = starts[i];
                const hot = col === accent;
                return (
                    <g key={`${col}-${i}`}>
                        <rect
                            x={cx}
                            y={y}
                            width={w}
                            height={26}
                            fill={hot ? 'var(--primary)' : 'transparent'}
                            fillOpacity={hot ? 0.15 : 0}
                            stroke={hot ? 'var(--primary)' : 'currentColor'}
                            strokeOpacity={hot ? 0.9 : 0.35}
                            strokeWidth='1'
                        />
                        <SketchText x={cx + w / 2} y={y + 17} size={9.5} bold={hot} accent={hot}>
                            {col}
                        </SketchText>
                    </g>
                );
            })}
        </g>
    );
}

/**
 * The same pairing written two ways, and the columns `SELECT *` hands back for
 * booking 13: ON keeps both copies of customer_id, USING keeps one and puts it
 * first. Column lists are the real ones PostgreSQL 18 prints.
 */
export function OnVsUsingSplit() {
    return (
        <SketchSplit
            label='ON vs USING: The Same Pairs, Different Columns'
            caption='দুটো Query একই Row জোড়া দেয়, booking 13 এর সাথে Nusrat Jahan। পার্থক্য শুধু SELECT * এ কয়টা Column আসে। ON দুই Table এর সব Column দেয়, তাই customer_id দুইবার আসে, মোট ১৪টা। USING জানে দুটো customer_id এর মান সবসময় সমান, তাই একটা রাখে আর সবার আগে বসায়, মোট ১৩টা।'
            panels={[
                {
                    title: 'ON c.customer_id = b.customer_id',
                    sub: '14 columns',
                    viewBox: '0 0 420 170',
                    height: 170,
                    minWidth: 380,
                    children: (
                        <g>
                            <SketchText x={10} y={20} anchor='start' size={10} body opacity={0.8}>
                                bookings এর ৭টা Column
                            </SketchText>
                            <ColumnStrip y={30} columns={['booking_id', 'customer_id', 'departure_id', 'seats']} accent='customer_id' />
                            <SketchText x={10} y={86} anchor='start' size={10} body opacity={0.8}>
                                তারপর customers এর ৭টা Column
                            </SketchText>
                            <ColumnStrip y={96} columns={['customer_id', 'full_name', 'email', 'phone']} accent='customer_id' />
                            <SketchText x={10} y={150} anchor='start' size={10} body accent>
                                customer_id দুইবার, দুটোতেই 2
                            </SketchText>
                        </g>
                    ),
                },
                {
                    title: 'USING (customer_id)',
                    sub: '13 columns',
                    viewBox: '0 0 420 170',
                    height: 170,
                    minWidth: 380,
                    children: (
                        <g>
                            <SketchText x={10} y={20} anchor='start' size={10} body opacity={0.8}>
                                মেলানোর Column একবার, সবার আগে
                            </SketchText>
                            <ColumnStrip y={30} columns={['customer_id', 'booking_id', 'departure_id', 'seats']} accent='customer_id' />
                            <SketchText x={10} y={86} anchor='start' size={10} body opacity={0.8}>
                                তারপর customers এর বাকি ৬টা Column
                            </SketchText>
                            <ColumnStrip y={96} columns={['full_name', 'email', 'phone', 'city']} accent='' />
                            <SketchText x={10} y={150} anchor='start' size={10} body accent>
                                customer_id একবার
                            </SketchText>
                        </g>
                    ),
                },
            ]}
        />
    );
}
