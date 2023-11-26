// god i wish i made this in kotlin

export function zip<T, U>(a: T[], b: U[]): Array<[T, U]> {
    return a.map((item, index) => [item, b[index]]);
}

export function chunked<T>(array: T[], size: number) {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

export function isUppercase(str: string) {
    return str.toUpperCase() === str && str !== str.toLowerCase()
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}