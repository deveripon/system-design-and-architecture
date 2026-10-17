/**
 * The real rows of the six Island Tours tables that the multi-table join
 * lesson chains together, exactly as `public/sql/island-tours.sql` holds them.
 * The labs compute their joins from these rows, so every count they show is
 * the count PostgreSQL prints for the same query.
 */

export interface Customer {
    id: number;
    name: string;
}

export interface Booking {
    id: number;
    customer: number;
    departure: number;
    seats: number;
    status: 'confirmed' | 'pending' | 'cancelled';
    total: number;
}

export interface Departure {
    id: number;
    tour: number;
    seatsLeft: number;
}

export interface Tour {
    id: number;
    title: string;
    destination: number;
    guide: number | null;
}

export const CUSTOMERS: Customer[] = [
    { id: 1, name: 'Rahim Uddin' },
    { id: 2, name: 'Nusrat Jahan' },
    { id: 3, name: 'Tanvir Ahmed' },
    { id: 4, name: 'Farhana Akter' },
    { id: 5, name: 'Sabbir Hossain' },
    { id: 6, name: 'Mitu Rahman' },
    { id: 7, name: 'Arif Chowdhury' },
    { id: 8, name: 'Sumaiya Islam' },
    { id: 9, name: 'Priya Sharma' },
    { id: 10, name: 'Aiman Zulkifli' },
    { id: 11, name: 'Oliver Bennett' },
    { id: 12, name: 'Kamal Hasan' },
    { id: 13, name: 'Shuvo Das' },
    { id: 14, name: 'Lamia Haque' },
    { id: 15, name: 'Imran Kabir' },
];

export const BOOKINGS: Booking[] = [
    { id: 1, customer: 1, departure: 1, seats: 2, status: 'confirmed', total: 25000 },
    { id: 2, customer: 2, departure: 1, seats: 4, status: 'confirmed', total: 50000 },
    { id: 3, customer: 3, departure: 2, seats: 1, status: 'confirmed', total: 12500 },
    { id: 4, customer: 4, departure: 3, seats: 3, status: 'confirmed', total: 25500 },
    { id: 5, customer: 5, departure: 3, seats: 2, status: 'cancelled', total: 17000 },
    { id: 6, customer: 6, departure: 4, seats: 2, status: 'confirmed', total: 36000 },
    { id: 7, customer: 7, departure: 4, seats: 1, status: 'confirmed', total: 18000 },
    { id: 8, customer: 1, departure: 5, seats: 2, status: 'confirmed', total: 19000 },
    { id: 9, customer: 8, departure: 6, seats: 2, status: 'confirmed', total: 28000 },
    { id: 10, customer: 9, departure: 6, seats: 1, status: 'confirmed', total: 14000 },
    { id: 11, customer: 10, departure: 7, seats: 2, status: 'confirmed', total: 15600 },
    { id: 12, customer: 11, departure: 2, seats: 2, status: 'cancelled', total: 25000 },
    { id: 13, customer: 2, departure: 8, seats: 2, status: 'confirmed', total: 25000 },
    { id: 14, customer: 12, departure: 8, seats: 4, status: 'pending', total: 50000 },
    { id: 15, customer: 13, departure: 10, seats: 3, status: 'confirmed', total: 25500 },
    { id: 16, customer: 14, departure: 11, seats: 2, status: 'confirmed', total: 36000 },
    { id: 17, customer: 1, departure: 11, seats: 2, status: 'pending', total: 36000 },
    { id: 18, customer: 6, departure: 12, seats: 1, status: 'cancelled', total: 9500 },
    { id: 19, customer: 11, departure: 13, seats: 2, status: 'confirmed', total: 28000 },
    { id: 20, customer: 9, departure: 14, seats: 2, status: 'pending', total: 15600 },
    { id: 21, customer: 4, departure: 15, seats: 3, status: 'confirmed', total: 10500 },
    { id: 22, customer: 3, departure: 9, seats: 1, status: 'confirmed', total: 12500 },
    { id: 23, customer: 8, departure: 10, seats: 5, status: 'confirmed', total: 42500 },
    { id: 24, customer: 13, departure: 14, seats: 2, status: 'pending', total: 15600 },
];

export const DEPARTURES: Departure[] = [
    { id: 1, tour: 1, seatsLeft: 14 },
    { id: 2, tour: 1, seatsLeft: 19 },
    { id: 3, tour: 2, seatsLeft: 27 },
    { id: 4, tour: 3, seatsLeft: 13 },
    { id: 5, tour: 4, seatsLeft: 16 },
    { id: 6, tour: 5, seatsLeft: 9 },
    { id: 7, tour: 6, seatsLeft: 23 },
    { id: 8, tour: 1, seatsLeft: 14 },
    { id: 9, tour: 1, seatsLeft: 19 },
    { id: 10, tour: 2, seatsLeft: 22 },
    { id: 11, tour: 3, seatsLeft: 12 },
    { id: 12, tour: 4, seatsLeft: 18 },
    { id: 13, tour: 5, seatsLeft: 10 },
    { id: 14, tour: 6, seatsLeft: 21 },
    { id: 15, tour: 7, seatsLeft: 12 },
    { id: 16, tour: 8, seatsLeft: 10 },
];

export const TOURS: Tour[] = [
    { id: 1, title: 'Saint Martin Island Escape', destination: 1, guide: 1 },
    { id: 2, title: "Cox's Bazar Beach Weekend", destination: 2, guide: 2 },
    { id: 3, title: 'Sundarbans Mangrove Cruise', destination: 3, guide: 3 },
    { id: 4, title: 'Sajek Valley Cloud Trip', destination: 4, guide: 1 },
    { id: 5, title: 'Bandarban Hill Trek', destination: 5, guide: 4 },
    { id: 6, title: 'Sylhet Tea Garden Tour', destination: 6, guide: 2 },
    { id: 7, title: 'Ratargul Swamp Boat Day', destination: 6, guide: null },
    { id: 8, title: 'Saint Martin Luxury Stay', destination: 1, guide: 4 },
    { id: 9, title: "Cox's Bazar Family Package", destination: 2, guide: 3 },
];

export const DESTINATIONS: { id: number; name: string }[] = [
    { id: 1, name: "Saint Martin's Island" },
    { id: 2, name: "Cox's Bazar" },
    { id: 3, name: 'Sundarbans' },
    { id: 4, name: 'Sajek Valley' },
    { id: 5, name: 'Bandarban' },
    { id: 6, name: 'Sylhet' },
    { id: 7, name: 'Kuakata' },
];

export const GUIDES: { id: number; name: string }[] = [
    { id: 1, name: 'Jamal Hossain' },
    { id: 2, name: 'Shirin Akter' },
    { id: 3, name: 'Rubel Mia' },
    { id: 4, name: 'Ayesha Siddiqua' },
    { id: 5, name: 'Nazmul Karim' },
];

export const byId = <T extends { id: number }>(rows: T[], id: number | null | undefined) =>
    id == null ? undefined : rows.find(r => r.id === id);

/* ------------------------------------------------------------------------- */
/* The joins the labs need, written once so they can be checked in Node.      */
/* ------------------------------------------------------------------------- */

export type GuideJoin = 'inner' | 'left';

export interface ChainRow {
    booking: number;
    customer: string;
    tour: string;
    destination: string;
    guide: string | null;
}

/**
 * bookings JOIN customers JOIN departures JOIN tours JOIN destinations, then
 * guides joined INNER or LEFT. `upTo` stops the chain early (1 = bookings only
 * ... 6 = all six tables), so a lab can show the row count after every step.
 */
export function chain(upTo: number, guideJoin: GuideJoin): ChainRow[] {
    const rows: ChainRow[] = [];
    for (const b of BOOKINGS) {
        const c = byId(CUSTOMERS, b.customer)!;
        const d = byId(DEPARTURES, b.departure)!;
        const t = byId(TOURS, d.tour)!;
        const ds = byId(DESTINATIONS, t.destination)!;
        const g = byId(GUIDES, t.guide);
        if (upTo >= 6 && !g && guideJoin === 'inner') continue;
        rows.push({
            booking: b.id,
            customer: upTo >= 2 ? c.name : '',
            tour: upTo >= 4 ? t.title : '',
            destination: upTo >= 5 ? ds.name : '',
            guide: upTo >= 6 ? (g?.name ?? null) : '',
        });
    }
    return rows;
}

export type LastJoin = 'inner' | 'left' | 'nested';

export interface TourReportRow {
    tour: number;
    title: string;
    departure: number | null;
    booking: number | null;
    customer: string | null;
}

/**
 * tours LEFT JOIN departures LEFT JOIN bookings, then customers joined three
 * ways: INNER (the trap), LEFT, or nested inside the bookings join.
 */
export function tourReport(last: LastJoin): TourReportRow[] {
    const rows: TourReportRow[] = [];
    for (const t of TOURS) {
        const deps = DEPARTURES.filter(d => d.tour === t.id);
        if (deps.length === 0) {
            if (last !== 'inner') {
                rows.push({ tour: t.id, title: t.title, departure: null, booking: null, customer: null });
            }
            continue;
        }
        for (const d of deps) {
            const books = BOOKINGS.filter(b => b.departure === d.id);
            if (books.length === 0) {
                if (last !== 'inner') {
                    rows.push({ tour: t.id, title: t.title, departure: d.id, booking: null, customer: null });
                }
                continue;
            }
            for (const b of books) {
                rows.push({
                    tour: t.id,
                    title: t.title,
                    departure: d.id,
                    booking: b.id,
                    customer: byId(CUSTOMERS, b.customer)!.name,
                });
            }
        }
    }
    return rows.sort(
        (a, b) =>
            a.tour - b.tour ||
            (a.departure ?? Infinity) - (b.departure ?? Infinity) ||
            (a.booking ?? Infinity) - (b.booking ?? Infinity)
    );
}

export type Placement = 'on' | 'where';

/**
 * customers LEFT JOIN bookings, with `status = ...` placed in ON or in WHERE,
 * grouped per customer: the count of matching bookings, or no row at all.
 */
export function placementReport(
    placement: Placement,
    status: Booking['status']
): { id: number; name: string; count: number }[] {
    const out: { id: number; name: string; count: number }[] = [];
    for (const c of CUSTOMERS) {
        const all = BOOKINGS.filter(b => b.customer === c.id);
        const matching = all.filter(b => b.status === status);
        if (placement === 'on') {
            out.push({ id: c.id, name: c.name, count: matching.length });
        } else if (matching.length > 0) {
            out.push({ id: c.id, name: c.name, count: matching.length });
        }
    }
    return out;
}
