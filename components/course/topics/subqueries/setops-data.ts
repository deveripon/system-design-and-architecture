/**
 * Real rows from the sample database for the set operation labs, and the
 * multiset logic of UNION, INTERSECT and EXCEPT. Kept free of React so a
 * script can check every combination against PostgreSQL.
 */

export type SetDatasetKey = 'places' | 'trips' | 'departures';

export interface SetDataset {
    key: SetDatasetKey;
    label: string;
    leftName: string;
    rightName: string;
    leftSql: string;
    rightSql: string;
    /** One entry per row the left query returns, duplicates included. */
    left: string[];
    right: string[];
    numeric?: boolean;
}

const TRIP_CHAIN = `FROM customers c
JOIN bookings b      ON b.customer_id = c.customer_id
JOIN departures d    ON d.departure_id = b.departure_id
JOIN tours t         ON t.tour_id = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id`;

export const SET_DATASETS: SetDataset[] = [
    {
        key: 'places',
        label: 'শহর বনাম অঞ্চল',
        leftName: 'customers.city',
        rightName: 'destinations.region',
        leftSql: 'SELECT city FROM customers',
        rightSql: 'SELECT region FROM destinations',
        left: [
            'Dhaka', 'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Dhaka', 'Khulna', 'Dhaka',
            'Kolkata', 'Kuala Lumpur', 'London', 'Barishal', 'Dhaka', 'Chattogram', 'Dhaka',
        ],
        right: ['Chattogram', 'Chattogram', 'Khulna', 'Chattogram', 'Chattogram', 'Sylhet', 'Barishal'],
    },
    {
        key: 'trips',
        label: 'সমুদ্র বনাম পাহাড়',
        leftName: 'island বা beach এর যাত্রী',
        rightName: 'hills এর যাত্রী',
        leftSql: `SELECT c.full_name\n${TRIP_CHAIN}\nWHERE ds.kind IN ('island', 'beach')`,
        rightSql: `SELECT c.full_name\n${TRIP_CHAIN}\nWHERE ds.kind = 'hills'`,
        left: [
            'Rahim Uddin', 'Nusrat Jahan', 'Nusrat Jahan', 'Tanvir Ahmed', 'Tanvir Ahmed', 'Farhana Akter',
            'Sabbir Hossain', 'Sumaiya Islam', 'Oliver Bennett', 'Kamal Hasan', 'Shuvo Das',
        ],
        right: ['Rahim Uddin', 'Mitu Rahman', 'Sumaiya Islam', 'Priya Sharma', 'Oliver Bennett'],
    },
    {
        key: 'departures',
        label: 'Departure বনাম Booking',
        leftName: 'departures.departure_id',
        rightName: 'bookings.departure_id',
        leftSql: 'SELECT departure_id FROM departures',
        rightSql: 'SELECT departure_id FROM bookings',
        left: Array.from({ length: 16 }, (_, i) => String(i + 1)),
        right: [
            '1', '1', '2', '3', '3', '4', '4', '5', '6', '6', '7', '2',
            '8', '8', '10', '11', '11', '12', '13', '14', '15', '9', '10', '14',
        ],
        numeric: true,
    },
];

export type SetOp = 'union-all' | 'union' | 'intersect' | 'intersect-all' | 'except' | 'except-reverse';

export const SET_OPS: { key: SetOp; label: string }[] = [
    { key: 'union-all', label: 'UNION ALL' },
    { key: 'union', label: 'UNION' },
    { key: 'intersect', label: 'INTERSECT' },
    { key: 'intersect-all', label: 'INTERSECT ALL' },
    { key: 'except', label: 'A EXCEPT B' },
    { key: 'except-reverse', label: 'B EXCEPT A' },
];

function counts(values: string[]): Map<string, number> {
    const map = new Map<string, number>();
    for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
    return map;
}

/** The rows the set operation returns, duplicates included where the operation keeps them. */
export function combine(left: string[], right: string[], op: SetOp): string[] {
    const l = counts(left);
    const r = counts(right);
    switch (op) {
        case 'union-all':
            return [...left, ...right];
        case 'union':
            return [...new Set([...left, ...right])];
        case 'intersect':
            return [...l.keys()].filter(v => r.has(v));
        case 'intersect-all':
            return [...l.entries()].flatMap(([v, n]): string[] =>
                Array.from({ length: Math.min(n, r.get(v) ?? 0) }, () => v)
            );
        case 'except':
            return [...l.keys()].filter(v => !r.has(v));
        case 'except-reverse':
            return [...r.keys()].filter(v => !l.has(v));
    }
}

/** Sorted for display, numbers by value and names alphabetically. */
export function sortValues(values: string[], numeric?: boolean): string[] {
    return [...values].sort((a, b) => (numeric ? Number(a) - Number(b) : a.localeCompare(b)));
}

/** The SQL a dataset and an operation stand for, as the lab prints it. */
export function setOpSql(dataset: SetDataset, op: SetOp): string {
    const keyword =
        op === 'union-all'
            ? 'UNION ALL'
            : op === 'union'
              ? 'UNION'
              : op === 'intersect'
                ? 'INTERSECT'
                : op === 'intersect-all'
                  ? 'INTERSECT ALL'
                  : 'EXCEPT';
    const [first, second] = op === 'except-reverse' ? [dataset.rightSql, dataset.leftSql] : [dataset.leftSql, dataset.rightSql];
    return `${first}\n${keyword}\n${second};`;
}
