import path from 'node:path';
import * as fs from 'node:fs/promises';
import { Readable } from 'node:stream';
import { createWriteStream, Dirent } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { parquetMetadataAsync } from 'hyparquet';
import { MMDDYY_HHMMSS } from '../utils/datetime';
import { UCOSPO_PARQ_S3_URL, PARQUET_DATA_DIR } from '../consts';
import { confirmDirExists } from './cli';
import type { parquetData } from '../types/parquetData';
import { readParquet } from 'parquet-wasm/node';
import { tableFromIPC } from 'apache-arrow';
import { toCamel } from './strings';

/* 
    Fetch a parquet file from a url, save the parquet file if saveParq is true (default)
    Fetches the UC OSPO parquet file from their public S3 bucket if no url is passed
*/
export async function getParquet(url: string = UCOSPO_PARQ_S3_URL, saveParq: boolean = true): Promise<ArrayBuffer> {
    console.log(`Awaiting response from ${url}...`);
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/octet-stream, application/x-parquet',
        },
    });

    if (!resp.ok) {
        throw new Error(`HTTP error: ${resp.status}`);
    }

    const buf = await resp.arrayBuffer();

    if (saveParq) {
        const fname = `${PARQUET_DATA_DIR}/UC_OSPO_data_${MMDDYY_HHMMSS(new Date())}.parquet`;

        console.log(`Saving fetched parquet as ${fname}...`);
        await pipeline(Readable.from(Buffer.from(buf)), createWriteStream(fname));
    }

    return buf;
}

/*
    Find the most recent parquet file in the passed directory, return full path as string
    Looks in the parquet data directory by default
*/
export async function findRecentParquetInDir(dir: string = PARQUET_DATA_DIR): Promise<string> {
    const exists = await confirmDirExists(dir);
    if (!exists) return '';

    const entries: Dirent<string>[] = await fs.readdir(dir, { withFileTypes: true });
    const parqFiles = entries.filter((f) => f.isFile() && f.name.toLowerCase().endsWith('.parquet'));
    if (parqFiles.length === 0) return '';

    const withStats = await Promise.all(
        parqFiles.map(async (f) => {
            const fullPath = path.join(dir, f.name);
            const stat = await fs.stat(fullPath);
            return { fullPath, mtime: stat.mtime.getTime() };
        }),
    );

    withStats.sort((a, b) => b.mtime - a.mtime);

    return withStats[0].fullPath;
}

/* 
    Read the parquet file at the passed path, return an ArrayBuffer
*/
export async function readParquetFile(path: string): Promise<ArrayBuffer> {
    const buf = await fs.readFile(path);
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/*
    Get an array of column name strings from a pargquet buffer
*/
export async function parquetColumnNames(buf: ArrayBuffer): Promise<string[]> {
    return (await parquetMetadataAsync(buf)).schema.slice(1).map((f) => f.name);
}

export async function parquetToObjects(buf: ArrayBuffer): Promise<parquetData[]> {
    const wasmTable = readParquet(new Uint8Array(buf));
    const arrowTable = tableFromIPC(wasmTable.intoIPCStream());

    const rows: parquetData[] = [];
    for (const row of arrowTable) {
        const obj: any = {};
        for (const field of arrowTable.schema.fields) {
            let value = row[field.name];
            if (typeof value === 'bigint') value = Number(value);
            obj[toCamel(field.name)] = value;
        }
        rows.push(obj as parquetData);
    }
    return rows;
}
