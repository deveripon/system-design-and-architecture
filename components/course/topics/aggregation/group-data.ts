/**
 * The 24 Island Tours bookings exactly as `public/sql/island-tours.sql` loads
 * them, trimmed to the columns the GROUP BY visuals need. The diagrams and labs
 * group these rows in the browser; every total they show was checked against
 * PostgreSQL running the same GROUP BY on the sample database.
 */
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export interface BookingRow {
    id: number;
    departureId: number;
    seats: number;
    status: BookingStatus;
    /** total_bdt in whole taka; every sample amount ends in .00 */
    total: number;
}

export const BOOKINGS: BookingRow[] = [
    { id: 1, departureId: 1, seats: 2, status: 'confirmed', total: 25000 },
    { id: 2, departureId: 1, seats: 4, status: 'confirmed', total: 50000 },
    { id: 3, departureId: 2, seats: 1, status: 'confirmed', total: 12500 },
    { id: 4, departureId: 3, seats: 3, status: 'confirmed', total: 25500 },
    { id: 5, departureId: 3, seats: 2, status: 'cancelled', total: 17000 },
    { id: 6, departureId: 4, seats: 2, status: 'confirmed', total: 36000 },
    { id: 7, departureId: 4, seats: 1, status: 'confirmed', total: 18000 },
    { id: 8, departureId: 5, seats: 2, status: 'confirmed', total: 19000 },
    { id: 9, departureId: 6, seats: 2, status: 'confirmed', total: 28000 },
    { id: 10, departureId: 6, seats: 1, status: 'confirmed', total: 14000 },
    { id: 11, departureId: 7, seats: 2, status: 'confirmed', total: 15600 },
    { id: 12, departureId: 2, seats: 2, status: 'cancelled', total: 25000 },
    { id: 13, departureId: 8, seats: 2, status: 'confirmed', total: 25000 },
    { id: 14, departureId: 8, seats: 4, status: 'pending', total: 50000 },
    { id: 15, departureId: 10, seats: 3, status: 'confirmed', total: 25500 },
    { id: 16, departureId: 11, seats: 2, status: 'confirmed', total: 36000 },
    { id: 17, departureId: 11, seats: 2, status: 'pending', total: 36000 },
    { id: 18, departureId: 12, seats: 1, status: 'cancelled', total: 9500 },
    { id: 19, departureId: 13, seats: 2, status: 'confirmed', total: 28000 },
    { id: 20, departureId: 14, seats: 2, status: 'pending', total: 15600 },
    { id: 21, departureId: 15, seats: 3, status: 'confirmed', total: 10500 },
    { id: 22, departureId: 9, seats: 1, status: 'confirmed', total: 12500 },
    { id: 23, departureId: 10, seats: 5, status: 'confirmed', total: 42500 },
    { id: 24, departureId: 14, seats: 2, status: 'pending', total: 15600 },
];

/** The bookings in one status, in booking_id order. */
export function idsWithStatus(status: BookingStatus): number[] {
    return BOOKINGS.filter(b => b.status === status).map(b => b.id);
}
