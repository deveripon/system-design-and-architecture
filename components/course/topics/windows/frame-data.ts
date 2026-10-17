/**
 * Data and frame logic behind the frame labs. The rows are the Island Tours
 * confirmed bookings exactly as PostgreSQL 18 returns them, and every frame
 * the labs draw was compared with the window functions PostgreSQL computes on
 * the same rows.
 */

export interface FrameBooking {
    id: number;
    day: string;
    amount: number;
}

/** The 17 confirmed bookings, in booked_at order (all booked_at values differ). */
export const BY_TIME: FrameBooking[] = [
    { id: 1, day: '20 Dec', amount: 25000 },
    { id: 2, day: '28 Dec', amount: 50000 },
    { id: 4, day: '05 Jan', amount: 25500 },
    { id: 3, day: '10 Jan', amount: 12500 },
    { id: 6, day: '25 Jan', amount: 36000 },
    { id: 7, day: '28 Jan', amount: 18000 },
    { id: 8, day: '20 Feb', amount: 19000 },
    { id: 9, day: '01 Mar', amount: 28000 },
    { id: 10, day: '02 Mar', amount: 14000 },
    { id: 11, day: '25 Mar', amount: 15600 },
    { id: 13, day: '15 Sep', amount: 25000 },
    { id: 15, day: '20 Sep', amount: 25500 },
    { id: 16, day: '02 Oct', amount: 36000 },
    { id: 19, day: '04 Oct', amount: 28000 },
    { id: 21, day: '11 Oct', amount: 10500 },
    { id: 22, day: '12 Oct', amount: 12500 },
    { id: 23, day: '13 Oct', amount: 42500 },
];

/** The same 17 bookings ordered by total_bdt, then booking_id: ties and gaps. */
export const BY_AMOUNT: FrameBooking[] = [...BY_TIME].sort(
    (a, b) => a.amount - b.amount || a.id - b.id
);

export type SlidePreset = 'running' | 'last3' | 'centered' | 'whole';

/** Frame bounds as row offsets from the current row; null means unbounded. */
export const SLIDE_PRESETS: Record<
    SlidePreset,
    { label: string; clause: string; start: number | null; end: number | null }
> = {
    running: {
        label: 'চলমান যোগফল',
        clause: 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',
        start: null,
        end: 0,
    },
    last3: {
        label: 'শেষ তিনটা',
        clause: 'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW',
        start: -2,
        end: 0,
    },
    centered: {
        label: 'আগে একটা, পরে একটা',
        clause: 'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING',
        start: -1,
        end: 1,
    },
    whole: {
        label: 'পুরোটা',
        clause: 'ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING',
        start: null,
        end: null,
    },
};

/** Indexes of the rows a ROWS frame covers for the row at `index`. */
export function slideFrame(preset: SlidePreset, index: number, size: number): number[] {
    const { start, end } = SLIDE_PRESETS[preset];
    const from = start === null ? 0 : Math.max(0, index + start);
    const to = end === null ? size - 1 : Math.min(size - 1, index + end);
    const out: number[] = [];
    for (let i = from; i <= to; i++) out.push(i);
    return out;
}

export type FrameUnit = 'rows' | 'range' | 'groups';

/** The "N PRECEDING" offset for each unit, small and large. */
export const UNIT_OFFSETS: Record<FrameUnit, [number, number]> = {
    rows: [1, 2],
    range: [1000, 5000],
    groups: [1, 2],
};

/**
 * Indexes of BY_AMOUNT that `<unit> BETWEEN <offset> PRECEDING AND CURRENT
 * ROW` covers for the row at `index`, ordered by total_bdt (and booking_id for
 * ROWS, which needs a unique order to be deterministic). In RANGE and GROUPS
 * mode CURRENT ROW reaches the last peer, a row with the same amount.
 */
export function unitFrame(unit: FrameUnit, offset: number, index: number, rows: FrameBooking[] = BY_AMOUNT): number[] {
    const value = rows[index].amount;
    const out: number[] = [];
    if (unit === 'rows') {
        for (let i = Math.max(0, index - offset); i <= index; i++) out.push(i);
        return out;
    }
    if (unit === 'range') {
        rows.forEach((row, i) => {
            if (row.amount >= value - offset && row.amount <= value) out.push(i);
        });
        return out;
    }
    const distinct = [...new Set(rows.map(r => r.amount))];
    const group = distinct.indexOf(value);
    const allowed = new Set(distinct.slice(Math.max(0, group - offset), group + 1));
    rows.forEach((row, i) => {
        if (allowed.has(row.amount)) out.push(i);
    });
    return out;
}
