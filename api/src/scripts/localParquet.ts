// fetch the parquet file from the public UC OSPO S3 bucket

import { confirm } from '../utils/cli';
import { findRecentParquetInDir, getParquet } from '../utils/parquet';

const existingParq = await findRecentParquetInDir();
if (existingParq) {
    const proceed = await confirm(
        `A parquet file already exists locally (${existingParq}) - continue to fetch new file?`,
    );
    if (!proceed) {
        console.log('Aborted');
        process.exit(1);
    }
}
console.log('Fetching parquet file from UC OSPO S3 bucket...');
await getParquet();
