/**
 * The full ASCII table, 0 to 127, generated rather than hand typed.
 *
 * Codes 0 to 31 and 127 are control characters: they were commands for old
 * teleprinters, and a few of them still run the modern world (newline, tab,
 * escape). Codes 32 to 126 are the printable ones.
 */

export interface AsciiRow {
    dec: number;
    hex: string;
    binary: string;
    /** What to print for this code. Control codes show their abbreviation. */
    glyph: string;
    /** Full name, for control codes and the few printable ones worth naming. */
    name: string;
    /** Bengali note, only where the code is actually worth knowing. */
    note?: string;
    /** Extra search terms, so "newline" finds LF. */
    keywords?: string[];
    control: boolean;
}

const CONTROL_NAMES = [
    'NUL Null',
    'SOH Start of Heading',
    'STX Start of Text',
    'ETX End of Text',
    'EOT End of Transmission',
    'ENQ Enquiry',
    'ACK Acknowledge',
    'BEL Bell',
    'BS Backspace',
    'HT Horizontal Tab',
    'LF Line Feed',
    'VT Vertical Tab',
    'FF Form Feed',
    'CR Carriage Return',
    'SO Shift Out',
    'SI Shift In',
    'DLE Data Link Escape',
    'DC1 Device Control 1',
    'DC2 Device Control 2',
    'DC3 Device Control 3',
    'DC4 Device Control 4',
    'NAK Negative Acknowledge',
    'SYN Synchronous Idle',
    'ETB End of Transmission Block',
    'CAN Cancel',
    'EM End of Medium',
    'SUB Substitute',
    'ESC Escape',
    'FS File Separator',
    'GS Group Separator',
    'RS Record Separator',
    'US Unit Separator',
];

/** Only the codes a developer actually meets get a note. */
const NOTES: Record<number, string> = {
    0: 'C ভাষায় স্ট্রিং এখানেই শেষ ধরা হয়। তাই একে Null Terminator বলে।',
    7: 'পুরনো টার্মিনালে বিপ শব্দ করত।',
    8: 'Backspace। এক ঘর পিছিয়ে যায়।',
    9: 'Tab। Code Indent করার সময় এটাই যায়।',
    10: 'নতুন লাইন। Linux আর Mac-এ Enter চাপলে এটাই যায়।',
    13: 'লাইনের শুরুতে ফেরা। Windows-এ Enter মানে CR আর LF দুইটা একসাথে।',
    27: 'Escape। টার্মিনালের রঙ আর কার্সর কোড এখান থেকে শুরু হয়।',
    32: 'Space। এটাও একটা অক্ষর, জায়গাও নেয় ১ Byte।',
    48: 'অঙ্ক ০ থেকে ৯ পর্যন্ত সাজানো আছে, তাই 48 বিয়োগ করলেই আসল সংখ্যা পাওয়া যায়।',
    65: 'বড় হাতের A। এই লেসনের উদাহরণ।',
    97: 'ছোট হাতের a। বড় হাতের থেকে ঠিক 32 বেশি, তাই একটা Bit বদলালেই ছোট বড় হয়।',
    127: 'Delete। শুরুর দিকে কাগজের টেপ থেকে ভুল মোছার কাজে লাগত।',
};

const KEYWORDS: Record<number, string[]> = {
    0: ['null', 'nul', 'terminator'],
    7: ['bell', 'beep'],
    8: ['backspace'],
    9: ['tab', 'indent'],
    10: ['newline', 'new line', 'line feed', 'enter', 'lf'],
    13: ['carriage return', 'enter', 'return', 'cr', 'crlf'],
    27: ['escape', 'esc', 'ansi'],
    32: ['space', 'blank'],
    127: ['delete', 'del'],
};

export const ASCII_ROWS: AsciiRow[] = Array.from({ length: 128 }, (_, dec) => {
    const control = dec < 32 || dec === 127;
    const label = dec === 127 ? 'DEL Delete' : CONTROL_NAMES[dec];

    return {
        dec,
        hex: dec.toString(16).toUpperCase().padStart(2, '0'),
        binary: dec.toString(2).padStart(8, '0'),
        glyph: control
            ? (label as string).split(' ')[0]
            : dec === 32
              ? 'SP'
              : String.fromCharCode(dec),
        name: control
            ? (label as string).split(' ').slice(1).join(' ')
            : dec === 32
              ? 'Space'
              : '',
        note: NOTES[dec],
        keywords: KEYWORDS[dec],
        control,
    };
});

/**
 * Rows matching a search. A single character is matched against the glyph, the
 * decimal and the hex value only: substring matching one letter against the
 * names would return most of the table.
 */
export function searchAscii(query: string) {
    const raw = query.trim();
    if (!raw) return ASCII_ROWS;

    const q = raw.toLowerCase();
    const isBinary = /^[01]{4,8}$/.test(q);
    // A bare number reads as decimal. Hex only counts when it says so, either
    // with an 0x prefix or with a letter in it, so searching 65 does not also
    // return 0x65 (101).
    const hex = /^0x/.test(q) || /[a-f]/.test(q) ? q.replace(/^0x/, '') : null;

    if (raw.length === 1) {
        return ASCII_ROWS.filter(
            row =>
                (!row.control && row.glyph === raw) ||
                String(row.dec) === raw ||
                (hex !== null && row.hex.toLowerCase() === hex)
        );
    }

    return ASCII_ROWS.filter(
        row =>
            String(row.dec) === q ||
            (hex !== null && row.hex.toLowerCase() === hex) ||
            (isBinary && row.binary.endsWith(q)) ||
            row.glyph.toLowerCase() === q ||
            row.name.toLowerCase().includes(q) ||
            (row.note ?? '').toLowerCase().includes(q) ||
            (row.keywords ?? []).some(k => k.includes(q))
    );
}
