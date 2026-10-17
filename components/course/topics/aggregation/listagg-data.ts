/**
 * The 24 real bookings of the Island Tours sample database, and the logic the
 * list-aggregation lab uses to build string_agg and array_agg results in the
 * browser. Kept free of React so a script can compare every combination with
 * PostgreSQL itself.
 */

export interface BookingRow {
    booking_id: number;
    customer_id: number;
    departure_id: number;
    seats: number;
    status: 'confirmed' | 'pending' | 'cancelled';
    /** Dhaka wall time, enough to order by; the real column is timestamptz. */
    booked_at: string;
}

export const BOOKINGS: BookingRow[] = [
    { booking_id: 1, customer_id: 1, departure_id: 1, seats: 2, status: 'confirmed', booked_at: '2025-12-20 10:15' },
    { booking_id: 2, customer_id: 2, departure_id: 1, seats: 4, status: 'confirmed', booked_at: '2025-12-28 20:02' },
    { booking_id: 3, customer_id: 3, departure_id: 2, seats: 1, status: 'confirmed', booked_at: '2026-01-10 09:30' },
    { booking_id: 4, customer_id: 4, departure_id: 3, seats: 3, status: 'confirmed', booked_at: '2026-01-05 18:45' },
    { booking_id: 5, customer_id: 5, departure_id: 3, seats: 2, status: 'cancelled', booked_at: '2026-01-06 12:10' },
    { booking_id: 6, customer_id: 6, departure_id: 4, seats: 2, status: 'confirmed', booked_at: '2026-01-25 22:40' },
    { booking_id: 7, customer_id: 7, departure_id: 4, seats: 1, status: 'confirmed', booked_at: '2026-01-28 08:05' },
    { booking_id: 8, customer_id: 1, departure_id: 5, seats: 2, status: 'confirmed', booked_at: '2026-02-20 11:20' },
    { booking_id: 9, customer_id: 8, departure_id: 6, seats: 2, status: 'confirmed', booked_at: '2026-03-01 16:35' },
    { booking_id: 10, customer_id: 9, departure_id: 6, seats: 1, status: 'confirmed', booked_at: '2026-03-02 14:00' },
    { booking_id: 11, customer_id: 10, departure_id: 7, seats: 2, status: 'confirmed', booked_at: '2026-03-25 07:50' },
    { booking_id: 12, customer_id: 11, departure_id: 2, seats: 2, status: 'cancelled', booked_at: '2026-01-30 15:30' },
    { booking_id: 13, customer_id: 2, departure_id: 8, seats: 2, status: 'confirmed', booked_at: '2026-09-15 21:10' },
    { booking_id: 14, customer_id: 12, departure_id: 8, seats: 4, status: 'pending', booked_at: '2026-10-01 12:25' },
    { booking_id: 15, customer_id: 13, departure_id: 10, seats: 3, status: 'confirmed', booked_at: '2026-09-20 19:45' },
    { booking_id: 16, customer_id: 14, departure_id: 11, seats: 2, status: 'confirmed', booked_at: '2026-10-02 10:05' },
    { booking_id: 17, customer_id: 1, departure_id: 11, seats: 2, status: 'pending', booked_at: '2026-10-08 09:15' },
    { booking_id: 18, customer_id: 6, departure_id: 12, seats: 1, status: 'cancelled', booked_at: '2026-09-28 23:30' },
    { booking_id: 19, customer_id: 11, departure_id: 13, seats: 2, status: 'confirmed', booked_at: '2026-10-04 13:40' },
    { booking_id: 20, customer_id: 9, departure_id: 14, seats: 2, status: 'pending', booked_at: '2026-10-10 17:20' },
    { booking_id: 21, customer_id: 4, departure_id: 15, seats: 3, status: 'confirmed', booked_at: '2026-10-11 18:00' },
    { booking_id: 22, customer_id: 3, departure_id: 9, seats: 1, status: 'confirmed', booked_at: '2026-10-12 08:30' },
    { booking_id: 23, customer_id: 8, departure_id: 10, seats: 5, status: 'confirmed', booked_at: '2026-10-13 20:55' },
    { booking_id: 24, customer_id: 13, departure_id: 14, seats: 2, status: 'pending', booked_at: '2026-10-14 11:05' },
];

export type GroupKey = 'customer_id' | 'departure_id' | 'status';
export type ListValue = 'booking_id' | 'status' | 'seats';
export type InnerOrder = 'booking_id' | 'booked_at_desc' | 'value';
export type ListFunction = 'string_agg' | 'array_agg';

export interface LabChoice {
    group: GroupKey;
    value: ListValue;
    order: InnerOrder;
    distinct: boolean;
    fn: ListFunction;
}

/** DISTINCT on booking_id changes nothing (ids are unique), so the lab only offers it for the others. */
export function distinctAllowed(value: ListValue) {
    return value !== 'booking_id';
}

/** PostgreSQL only lets a DISTINCT aggregate sort by its own argument, so DISTINCT forces that order. */
export function effectiveOrder(choice: LabChoice): InnerOrder {
    return choice.distinct && distinctAllowed(choice.value) ? 'value' : choice.order;
}

function argument(choice: LabChoice) {
    return choice.fn === 'string_agg' && choice.value !== 'status' ? `${choice.value}::text` : choice.value;
}

function orderClause(choice: LabChoice) {
    const order = effectiveOrder(choice);
    if (order === 'booking_id') return 'ORDER BY booking_id';
    if (order === 'booked_at_desc') return 'ORDER BY booked_at DESC';
    return `ORDER BY ${argument(choice)}`;
}

/** The exact query the lab is showing, runnable as is. */
export function labSql(choice: LabChoice) {
    const distinct = choice.distinct && distinctAllowed(choice.value) ? 'DISTINCT ' : '';
    const inner =
        choice.fn === 'string_agg'
            ? `string_agg(${distinct}${argument(choice)}, ', ' ${orderClause(choice)})`
            : `array_agg(${distinct}${argument(choice)} ${orderClause(choice)})`;
    return `SELECT ${choice.group},\n       ${inner} AS list\nFROM bookings\nGROUP BY ${choice.group}\nORDER BY ${choice.group};`;
}

function compareKeys(a: string | number, b: string | number) {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0;
}

/** Group, sort inside each group, optionally de-duplicate, then join, exactly as the query above does. */
export function labResult(choice: LabChoice): { key: string; list: string; count: number }[] {
    const groups = new Map<string | number, BookingRow[]>();
    for (const row of BOOKINGS) {
        const key = row[choice.group];
        groups.set(key, [...(groups.get(key) ?? []), row]);
    }
    const order = effectiveOrder(choice);
    const distinct = choice.distinct && distinctAllowed(choice.value);
    return [...groups.entries()]
        .sort(([a], [b]) => compareKeys(a, b))
        .map(([key, rows]) => {
            const sorted = [...rows].sort((a, b) => {
                if (order === 'booking_id') return a.booking_id - b.booking_id;
                if (order === 'booked_at_desc') return b.booked_at < a.booked_at ? -1 : b.booked_at > a.booked_at ? 1 : 0;
                // Sorting by the listed value: as text for string_agg (the argument is cast), as the value itself otherwise.
                const va = rows.length && choice.fn === 'string_agg' ? String(a[choice.value]) : a[choice.value];
                const vb = rows.length && choice.fn === 'string_agg' ? String(b[choice.value]) : b[choice.value];
                const primary = compareKeys(va, vb);
                return primary !== 0 ? primary : a.booking_id - b.booking_id;
            });
            let values = sorted.map(row => String(row[choice.value]));
            if (distinct) values = values.filter((v, i) => values.indexOf(v) === i);
            const list = choice.fn === 'string_agg' ? values.join(', ') : `{${values.join(',')}}`;
            return { key: String(key), list, count: rows.length };
        });
}
