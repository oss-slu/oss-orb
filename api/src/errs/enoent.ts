/*
    Provide type predicate for Error no entry (ENOENT) exception
*/
export function isErrNoEntry(err: unknown): err is NodeJS.ErrnoException {
    return err instanceof Error && 'code' in err && err.code === 'ENOENT';
}
