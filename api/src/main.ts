// MOVED ALL BELOW TO parquetScript.ts 
/*
import { snakeToCamel } from './utils/strings';
import { findRecentParquetInDir, getParquet, parquetColumnNames, readParquet } from './utils/parquet';

// reads local parquet if it exists, otherwise fetches from UC OSPO s3 bucket
const parqBuf = (await readParquet(await findRecentParquetInDir()) || await getParquet());

const columns = (await parquetColumnNames(parqBuf)).map(col => snakeToCamel(col));

console.log(columns);
*/