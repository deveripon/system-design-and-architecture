import { ISLAND_TOURS_TABLES } from '@/lib/sql/island-tours-schema';
import { Sketch, SketchText } from '../../sketch';

/** Where each table box sits. Columns come from the schema description. */
const LAYOUT: Record<string, { x: number; y: number; show: string[] }> = {
    destinations: { x: 30, y: 30, show: ['destination_id', 'name', 'region', 'kind'] },
    tours: { x: 370, y: 30, show: ['tour_id', 'destination_id', 'guide_id', 'title', 'price_bdt'] },
    guides: { x: 710, y: 30, show: ['guide_id', 'full_name', 'language'] },
    departures: { x: 370, y: 220, show: ['departure_id', 'tour_id', 'starts_on', 'seats_left'] },
    customers: { x: 30, y: 390, show: ['customer_id', 'full_name', 'email', 'country'] },
    bookings: { x: 370, y: 390, show: ['booking_id', 'customer_id', 'departure_id', 'status', 'total_bdt'] },
    payments: { x: 710, y: 280, show: ['payment_id', 'booking_id', 'method', 'status'] },
    reviews: { x: 710, y: 430, show: ['review_id', 'booking_id', 'rating'] },
};

const W = 220;
const HEAD = 26;
const ROW = 17;

function rowY(table: string, column: string) {
    const box = LAYOUT[table];
    return box.y + HEAD + 13 + box.show.indexOf(column) * ROW - 4;
}

/** Every foreign key drawn as an elbow from the many side to the one side. */
const LINKS: { from: string; column: string; to: string; side: 'left' | 'right' | 'up' }[] = [
    { from: 'tours', column: 'destination_id', to: 'destinations', side: 'left' },
    { from: 'tours', column: 'guide_id', to: 'guides', side: 'right' },
    { from: 'departures', column: 'tour_id', to: 'tours', side: 'up' },
    { from: 'bookings', column: 'customer_id', to: 'customers', side: 'left' },
    { from: 'bookings', column: 'departure_id', to: 'departures', side: 'up' },
    { from: 'payments', column: 'booking_id', to: 'bookings', side: 'left' },
    { from: 'reviews', column: 'booking_id', to: 'bookings', side: 'left' },
];

/**
 * The eight tables of the Island Tours database and how they point at each
 * other. N marks the many side of a relationship, 1 the one side.
 */
export function IslandToursDatabaseDiagram() {
    const tables = new Map(ISLAND_TOURS_TABLES.map(t => [t.name, t]));
    return (
        <Sketch
            label='Island Tours Database: Tables and Relationships'
            height={540}
            minWidth={960}
            viewBox='0 0 960 540'
            caption='প্রতিটা দাগ একটা Foreign Key: যে Table এ N লেখা, তার একটা Column অন্য Table এর 1 লেখা দিকের Primary Key কে দেখায়। যেমন অনেকগুলো Booking একজন Customer এর হতে পারে, কিন্তু একটা Booking এর Customer একজনই।'>
            {LINKS.map(link => {
                const fromBox = LAYOUT[link.from];
                const toBox = LAYOUT[link.to];
                const toPk = tables.get(link.to)!.columns.find(c => c.key === 'PK')!.name;
                let d: string;
                let nAt: [number, number];
                let oneAt: [number, number];
                if (link.side === 'up') {
                    const x = fromBox.x + W / 2;
                    const top = fromBox.y;
                    const bottom = toBox.y + HEAD + toBox.show.length * ROW + 8;
                    d = `M ${x} ${top} V ${bottom}`;
                    nAt = [x + 10, top - 6];
                    oneAt = [x + 10, bottom + 14];
                } else {
                    const y1 = rowY(link.from, link.column);
                    const y2 = rowY(link.to, toPk);
                    const x1 = link.side === 'left' ? fromBox.x : fromBox.x + W;
                    const x2 = link.side === 'left' ? toBox.x + W : toBox.x;
                    const mid = (x1 + x2) / 2;
                    d = `M ${x1} ${y1} H ${mid} V ${y2} H ${x2}`;
                    const dir = link.side === 'left' ? -1 : 1;
                    nAt = [x1 + dir * 10, y1 - 5];
                    oneAt = [x2 - dir * 10, y2 - 5];
                }
                return (
                    <g key={`${link.from}.${link.column}`}>
                        <path d={d} fill='none' stroke='var(--primary)' strokeOpacity={0.7} strokeWidth='1.3' />
                        <SketchText x={nAt[0]} y={nAt[1]} size={10} bold accent>
                            N
                        </SketchText>
                        <SketchText x={oneAt[0]} y={oneAt[1]} size={10} bold accent>
                            1
                        </SketchText>
                    </g>
                );
            })}

            {Object.entries(LAYOUT).map(([name, box]) => {
                const table = tables.get(name)!;
                const h = HEAD + box.show.length * ROW + 8;
                return (
                    <g key={name}>
                        <rect x={box.x} y={box.y} width={W} height={h} fill='var(--card)' stroke='currentColor' strokeOpacity={0.45} strokeWidth='1.2' />
                        <rect x={box.x} y={box.y} width={W} height={HEAD} fill='var(--primary)' fillOpacity={0.12} />
                        <SketchText x={box.x + 12} y={box.y + 17} anchor='start' size={11.5} bold accent>
                            {name}
                        </SketchText>
                        {box.show.map((columnName, i) => {
                            const column = table.columns.find(c => c.name === columnName)!;
                            const y = box.y + HEAD + 13 + i * ROW;
                            return (
                                <g key={columnName}>
                                    <SketchText x={box.x + 12} y={y} anchor='start' size={10.5} opacity={0.9}>
                                        {columnName}
                                    </SketchText>
                                    {column.key && (
                                        <SketchText x={box.x + W - 10} y={y} anchor='end' size={9} bold accent={column.key === 'PK'} opacity={column.key === 'PK' ? 1 : 0.7}>
                                            {column.key}
                                        </SketchText>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                );
            })}
        </Sketch>
    );
}
