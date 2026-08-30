// script used by jdetok on 8/29/2026 to create parquetData type from parquet column names
// run with: npx tsx ./api/src/parqToType.ts

import { findRecentParquetInDir, formatParquetColsAsType, getParquet, readParquetFile } from './utils/parquet';

// reads local parquet if it exists, otherwise fetches from UC OSPO s3 bucket
const parqBuf =
    (await readParquetFile(await findRecentParquetInDir())) ||
    (await getParquet());

// print to stdout - ran inside a $() using echo in terminal to write to file
console.log(await formatParquetColsAsType(parqBuf)); 
