// god i wish i made this in kotlin
import {PathLike} from "fs";
import * as fs from "fs/promises";

export function zip<T, U>(a: T[], b: U[]): Array<[T, U]> {
    return a.map((item, index) => [item, b[index]]);
}

export async function checkExists(path: PathLike): Promise<boolean> {
    return fs.access(path)
        .then(() => true)
        .catch(() => false)
}