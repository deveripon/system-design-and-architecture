/**
 * Real rows and three-valued comparison logic behind the Lesson 02 labs of
 * Module 07. Kept free of React so a script can check every combination the
 * labs show against PostgreSQL.
 */

/** TRUE, FALSE or UNKNOWN (SQL's NULL truth value). */
export type Tri = boolean | null;

export type Op = '>' | '<' | '=' | '<>';
export type Quant = 'ANY' | 'ALL';

/** The nine tours of the sample database: id, title, price and guide (NULL for Ratargul). */
export const TOURS: { id: number; title: string; price: number; guide: number | null }[] = [
    { id: 1, title: 'Saint Martin Island Escape', price: 12500, guide: 1 },
    { id: 2, title: "Cox's Bazar Beach Weekend", price: 8500, guide: 2 },
    { id: 3, title: 'Sundarbans Mangrove Cruise', price: 18000, guide: 3 },
    { id: 4, title: 'Sajek Valley Cloud Trip', price: 9500, guide: 1 },
    { id: 5, title: 'Bandarban Hill Trek', price: 14000, guide: 4 },
    { id: 6, title: 'Sylhet Tea Garden Tour', price: 7800, guide: 2 },
    { id: 7, title: 'Ratargul Swamp Boat Day', price: 3500, guide: null },
    { id: 8, title: 'Saint Martin Luxury Stay', price: 32000, guide: 4 },
    { id: 9, title: "Cox's Bazar Family Package", price: 15500, guide: 3 },
];

/** The five guides; Nazmul Karim (5) leads no tour. */
export const GUIDES: { id: number; name: string; language: string }[] = [
    { id: 1, name: 'Jamal Hossain', language: 'Bangla' },
    { id: 2, name: 'Shirin Akter', language: 'English' },
    { id: 3, name: 'Rubel Mia', language: 'Bangla' },
    { id: 4, name: 'Ayesha Siddiqua', language: 'English' },
    { id: 5, name: 'Nazmul Karim', language: 'Bangla' },
];

/** The lists a comparison can run against, with the subquery that produces each. */
export const LISTS: { key: string; label: string; sql: string; values: (number | null)[] }[] = [
    {
        key: 'sylhet',
        label: 'Sylhet এর ট্যুর',
        sql: 'SELECT price_bdt FROM tours WHERE destination_id = 6',
        values: [7800, 3500],
    },
    {
        key: 'coxs',
        label: "Cox's Bazar এর ট্যুর",
        sql: 'SELECT price_bdt FROM tours WHERE destination_id = 2',
        values: [8500, 15500],
    },
    {
        key: 'kuakata',
        label: 'Kuakata এর ট্যুর (একটাও নেই)',
        sql: 'SELECT price_bdt FROM tours WHERE destination_id = 7',
        values: [],
    },
    {
        key: 'with-null',
        label: 'একটা NULL সহ তালিকা',
        sql: 'SELECT v FROM (VALUES (9500::numeric), (NULL)) AS x(v)',
        values: [9500, null],
    },
];

export const OPS: Op[] = ['>', '<', '=', '<>'];
export const QUANTS: Quant[] = ['ANY', 'ALL'];

/** One comparison under SQL rules: anything compared with NULL is UNKNOWN. */
export function compare(left: number | null, op: Op, right: number | null): Tri {
    if (left === null || right === null) return null;
    switch (op) {
        case '>':
            return left > right;
        case '<':
            return left < right;
        case '=':
            return left === right;
        case '<>':
            return left !== right;
    }
}

/**
 * ANY is TRUE if one comparison is TRUE, else UNKNOWN if one is UNKNOWN, else
 * FALSE (an empty list gives FALSE). ALL is FALSE if one is FALSE, else
 * UNKNOWN if one is UNKNOWN, else TRUE (an empty list gives TRUE).
 */
export function quantify(
    left: number | null,
    op: Op,
    quant: Quant,
    values: (number | null)[]
): { each: Tri[]; result: Tri } {
    const each = values.map(v => compare(left, op, v));
    if (quant === 'ANY') {
        if (each.some(r => r === true)) return { each, result: true };
        return { each, result: each.some(r => r === null) ? null : false };
    }
    if (each.some(r => r === false)) return { each, result: false };
    return { each, result: each.some(r => r === null) ? null : true };
}

/** The guide ids as the tours table holds them, NULL included, in tour order. */
export const TOUR_GUIDE_IDS: (number | null)[] = TOURS.map(t => t.guide);

/** Guide ids of the English speaking guides, the list in the IN / NOT IN halves. */
export const ENGLISH_GUIDE_IDS: number[] = GUIDES.filter(g => g.language === 'English').map(g => g.id);

/** `value IN (list)` under SQL rules. */
export function inList(value: number | null, list: (number | null)[]): Tri {
    return quantify(value, '=', 'ANY', list).result;
}

/** `value NOT IN (list)`, the same as `value <> ALL (list)`. */
export function notInList(value: number | null, list: (number | null)[]): Tri {
    return quantify(value, '<>', 'ALL', list).result;
}
