import { cantor, toIntOrThrow } from "#/utils/number.ts";

export class Range {
    start: number = 0; end: number = 0;

    public get size() : number { return this.end - this.start; }

    constructor (start: number, end: number) {
        if (end < start) throw new RangeError("The end value cannot be smaller than the start value");
        this.start = start;
        this.end = end;
    }

    public static fromRangeString(v: string): Range {
        const [start, end] = v.split("-").map(i => toIntOrThrow(i));
        if ((start === undefined) || (end === undefined))
            throw new RangeError(`Invalid range string "${v}"`);
        return new Range(start, end);
    };

    public contains(n: number) {
        return (n >= this.start) && (n <= this.end);
    }

    public hash(): number { return cantor(this.start, this.end); }

    public toString() { return `${this.start},${this.end}`; }
};
