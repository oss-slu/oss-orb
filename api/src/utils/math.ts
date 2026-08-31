import type { parquetData } from '../types/parquetData';

/* 
    Calculate distribution of the values in the field passed to keyFn (mostly used for pie charts)
*/
export function getDistribution(rows: parquetData[], keyFn: (row: parquetData) => string): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const row of rows) {
        const key = keyFn(row) || 'Unknown';
        counts[key] = (counts[key] || 0) + 1;
    }

    const total = rows.length;
    const dist: Record<string, number> = {};

    for (const [key, count] of Object.entries(counts)) {
        dist[key] = count / total;
    }

    return dist;
}
