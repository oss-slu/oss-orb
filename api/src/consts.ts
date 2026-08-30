import path from 'node:path';
import { fileURLToPath } from 'node:url';

// PATHS RELATIVE TO /api
// consts.ts MUST remain at /api/src/consts.ts for this to work
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const API_ROOT = path.resolve(__dirname, '..');
export const PARQUET_DATA_DIR = path.join(API_ROOT, 'data');

// The UC OSPO Network publishes a static parquet file with the Github data at this public S3 bucket.
export const UCOSPO_PARQ_S3_URL = 'https://repoexplorer-data.s3.amazonaws.com/repositories_reduced_affiliated.parquet';
