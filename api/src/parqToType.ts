// run with: npx tsx ./api/src/parqToType.ts
import {
    findRecentParquetInDir,
    formatParquetColsAsType,
    getParquet,
    readParquetFile,
} from './utils/parquet';

// reads local parquet if it exists, otherwise fetches from UC OSPO s3 bucket
const parqBuf =
    (await readParquetFile(await findRecentParquetInDir())) ||
    (await getParquet());

console.log(await formatParquetColsAsType(parqBuf));
