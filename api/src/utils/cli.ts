import * as fs from 'node:fs/promises';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { isErrNoEntry } from '../errs/enoent';

/* 
    Prompt user with a yes/no question (msg), return answer as boolean
    Default behavior treats no answer (just pressing enter) as No (false)
    Pass defaultNo = false for opposite behavior (Yes/true for just pressing enter)
*/
export async function confirm(msg: string, defaultNo: boolean = true): Promise<boolean> {
    const r1 = readline.createInterface({ input, output });
    try {
        const answer = (await r1.question(`${msg} ${defaultNo ? 'y/N' : 'Y/n'}: `)).trim().toLowerCase();
        return answer === '' ? !defaultNo : answer === 'y';
    } finally {
        r1.close();
    }
}

/* 
    Check if a directory exists, create the directory if it does not. 
    Ask user before creating by default, pass forceYes = true to create without asking
*/
export async function confirmDirExists(dir: string, forceYes: boolean = false) {
    try {
        await fs.access(dir);
        return true;
    } catch (err) {
        if (isErrNoEntry(err)) {
            const proceed = forceYes ? true : await confirm(`Directory does not exist. Create ${dir}?`, false);
            if (proceed) {
                await fs.mkdir(dir, { recursive: true });
                console.log(`Created ${dir}...`);
                return true;
            }
            return false;
        }
        throw err;
    }
}
