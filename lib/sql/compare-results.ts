/**
 * Decides whether a reader's query answered an exercise: same number of
 * columns, same rows, same values. Column names are ignored, because an alias
 * is a matter of taste, and row order only counts when the task asks for it.
 */
export interface ResultShape {
    columns: string[];
    rows: string[][];
}

export type MismatchReason = 'no-result' | 'column-count' | 'row-count' | 'values' | 'order';

export type Verdict =
    | { match: true }
    | {
          match: false;
          reason: MismatchReason;
          actualRows: number;
          expectedRows: number;
          actualColumns: number;
          expectedColumns: number;
      };

/**
 * A number written with more or fewer trailing zeros is the same answer:
 * `45000.000` from `* 0.9` and `45000.0000` from `* 0.90` must compare equal.
 * Only plain decimal text is touched; phone numbers like `+880…` stay text.
 */
export function normalizeCell(cell: string): string {
    if (!/^-?\d+(\.\d+)?$/.test(cell)) return cell;
    let text = cell.includes('.') ? cell.replace(/0+$/, '').replace(/\.$/, '') : cell;
    text = text.replace(/^(-?)0+(?=\d)/, '$1');
    return text === '-0' ? '0' : text;
}

const key = (row: string[]) => JSON.stringify(row.map(normalizeCell));

export function compareResults(
    actual: ResultShape | null,
    expected: ResultShape,
    orderMatters: boolean
): Verdict {
    const counts = {
        actualRows: actual?.rows.length ?? 0,
        expectedRows: expected.rows.length,
        actualColumns: actual?.columns.length ?? 0,
        expectedColumns: expected.columns.length,
    };
    if (!actual) return { match: false, reason: 'no-result', ...counts };
    if (actual.columns.length !== expected.columns.length) {
        return { match: false, reason: 'column-count', ...counts };
    }
    if (actual.rows.length !== expected.rows.length) {
        return { match: false, reason: 'row-count', ...counts };
    }
    const sortedActual = actual.rows.map(key).sort();
    const sortedExpected = expected.rows.map(key).sort();
    if (sortedActual.some((row, i) => row !== sortedExpected[i])) {
        return { match: false, reason: 'values', ...counts };
    }
    if (orderMatters && actual.rows.some((row, i) => key(row) !== key(expected.rows[i]))) {
        return { match: false, reason: 'order', ...counts };
    }
    return { match: true };
}
