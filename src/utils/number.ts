
export const toInt = (val: string, radix?: number): number | null => {
    const result = parseInt(val, radix ?? 10);
    return (isFinite(result) ? result : null);
}

export const toIntOrThrow = (val: string, radix?: number): number => {
    const result = toInt(val, radix);
    if (result === null) throw new RangeError(`Invalid integer "${val}"`);
    return result;
}

export const toFloat = (val: string): number | null => {
    const result = parseFloat(val);
    return isFinite(result) ? result : null;
}

export const toFloatOrThrow = (val: string): number => {
    const result = toFloat(val);
    if (result === null) throw new RangeError(`Invalid float "${val}"`);
    return result;
}

export const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), max);

export const gcd = (a: number, b: number): number => {
    if (a < b) {
        let swap = a;
        a = b;
        b = swap;
    }

    let r;
    while ((r = a % b) > 0) {
        a = b;
        b = r;
    }
    return b;
};

export const lcm = (a: number, b: number): number =>
    ((a | b) === 0) ? 0 : Math.abs(a) * (Math.abs(b) / gcd(a, b));

export const cantor = (x: number, y: number): number => (((x + y) * (x + y + 1)) / 2) + y;
