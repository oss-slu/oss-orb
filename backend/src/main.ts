import { parquetReadObjects } from "hyparquet";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import * as fs from 'node:fs/promises';
import { createWriteStream } from "node:fs";

async function getParquet(url: string): Promise<ArrayBuffer> {
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

    return await resp.arrayBuffer();
}

async function parseParquet(buf: ArrayBuffer): Promise<Record<string, any>[]> {
    return await parquetReadObjects({ file: buf });
}

async function writeJsonArr(data: Record<string, any>[], path: string) {
    const stream = createWriteStream(path, { encoding: 'utf8' });
    const replacer = (_key: string, val: any) => typeof val === 'bigint' ? Number(val) : val;

    const chunks = Readable.from(
        (function* () {
            yield '[\n';
            for (let i = 0; i < data.length; i++) {
                const json = JSON.stringify(data[i], replacer, 2);
                const indented = json.split('\n').map((line) => '    ' + line).join('\n');
                yield i === 0 ? indented : ',\n' + indented;
            }
            yield '\n]\n';
        })()
    );
    await pipeline(chunks, stream);
}

const buf = await getParquet('https://repoexplorer-data.s3.amazonaws.com/repositories_reduced_affiliated.parquet');
const data = await parseParquet(buf);

await writeJsonArr(data, 'output.json');
// await fs.writeFile('output.json', JSON.stringify(data, (_key, val) => (typeof val === 'bigint' ? Number(val) : val), 2), 'utf8');

// console.log(data);