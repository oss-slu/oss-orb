import path from 'node:path';
import * as fs from 'node:fs/promises';
import { Readable } from "node:stream";
import { snakeToCamel } from './strings';
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { parquetMetadataAsync } from "hyparquet";
import { MMDDYY_HHMMSS } from "../utils/datetime";
import { UC_OSPO_PARQUET_S3_URL } from "../consts";

/* 
    Fetch a parquet file from a url, save the parquet file if saveParq is true (default)
    Fetches the UC OSPO parquet file from their public S3 bucket if no url is passed
*/
export async function getParquet(
    url: string = UC_OSPO_PARQUET_S3_URL,
    saveParq: boolean = true
): Promise<ArrayBuffer> {
    console.log('fetching', url);
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/octet-stream, application/x-parquet'
        }
    });

    if (!resp.ok) {
        throw new Error(`HTTP error: ${resp.status}`);
    }

    const buf = await resp.arrayBuffer();

    if (saveParq) {
        await pipeline(Readable.from(Buffer.from(buf)),
            createWriteStream(`UC_OSPO_data_${MMDDYY_HHMMSS(new Date())}.parquet`)
        )
    }

    return buf;
}

/*
    Find the most recent parquet file in the passed directory, return full path as string
*/
export async function findRecentParquetInDir(dir: string = '.'): Promise<string> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    const parqFiles = entries.filter(f => f.isFile() && f.name.toLowerCase().endsWith('.parquet'));
    if (parqFiles.length === 0) return '';

    const withStats = await Promise.all(parqFiles.map(async (f) => {
        const fullPath = path.join(dir, f.name);
        const stat = await fs.stat(fullPath);
        return { fullPath, mtime: stat.mtime.getTime() }
    }));

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
    return (await parquetMetadataAsync(buf)).schema.slice(1).map(f => f.name);
}

/* 
    Return a formatted string from an array of column name strings
    Each column name is converted from snake_case to camelCase
    Used to automate creation of a typescript type from large parquet dataset
*/
export async function formatParquetColsAsType(buf: ArrayBuffer, defaultType: string = 'string'): Promise<string> {
    return (await parquetColumnNames(buf)).map(col => `\t${snakeToCamel(col)}: ${defaultType};`).join('\n');
}