// creates a formatted string of a typescript type from parquet column names

import { findRecentParquetInDir, getParquet, parquetColumnNames, readParquetFile } from '../utils/parquet';
import { snakeToCamel } from '../utils/strings';

const TYPE_NAME = 'parquetData';

// all fields should be typed as string or number, majority string.
// fields in this array will get typed as number, all others string
const NON_STRING_FIELDS = [
    'id',
    'fork',
    'size',
    'stargazers_count',
    'watchers_count',
    'forks_count',
    'open_issues_count',
    'watchers',
    'release_downloads',
    'contributor_count',
    'bus_factor',
    'subscribers_count',
    'affiliation_prediction_gpt_5_mini',
];

// string fields get | null added by default, fields without null option must go here
const NON_NULL_FIELDS = ['university', 'fullName', 'owner'];

/* 
    Return a formatted string from an array of column name strings
    Each column name is converted from snake_case to camelCase
    Used to automate creation of a typescript type from large parquet dataset
*/
async function formatParquetColsAsType(buf: ArrayBuffer): Promise<string> {
    const parqBuf = await parquetColumnNames(buf);
    return parqBuf
        .map(
            (col) =>
                `\t${snakeToCamel(col)}: ${
                    NON_STRING_FIELDS.includes(col)
                        ? 'number'
                        : `string${NON_NULL_FIELDS.includes(col) ? '' : ' | null'}`
                };`,
        )
        .join('\n');
}

// reads local parquet if it exists, otherwise fetches from UC OSPO s3 bucket
const parqBuf = (await readParquetFile(await findRecentParquetInDir())) || (await getParquet());

// print to stdout - direct output to a file if wanted
console.log(`export type ${TYPE_NAME} = {\n${await formatParquetColsAsType(parqBuf)}\n};`);
