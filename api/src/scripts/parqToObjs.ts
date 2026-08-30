import { writeFile } from 'node:fs/promises';
import { findRecentParquetInDir, getParquet, parquetToObjects, readParquetFile } from '../utils/parquet';

const objs = await parquetToObjects((await readParquetFile(await findRecentParquetInDir())) || (await getParquet()));

// filter to oss-slu repos
const filtered = objs.filter((r) => ['UC-OSPO-Network', 'oss-slu'].includes(r.owner));

await writeFile('data/sample/sampleRepoData.json', JSON.stringify(filtered, null, 2));

console.log(filtered);
