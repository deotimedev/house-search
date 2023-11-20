export function zip<T, U>(a: T[], b: U[]): Array<[T, U]> {
    return a.map((item, index) => [item, b[index]]);
}