import { toIntOrThrow } from "#/utils/number.ts";

export class IdRange {
    #start: number;
    #end: number;

    public get start() {return this.#start };
    public get end() {return this.#end };

    constructor (start: number, end: number) {
        this.#start = start;
        this.#end = end;
    }

    public static fromIdRangeString(id: string): IdRange {
        const [start, end] = id.split("-").map(part => toIntOrThrow(part));
        return new IdRange(start, end);
    }

    toString(): string { return `${this.#start}-${this.#end}` };
}
