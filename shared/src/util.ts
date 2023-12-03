export function isUppercase(str: string) {
    return str.toUpperCase() === str && str !== str.toLowerCase()
}