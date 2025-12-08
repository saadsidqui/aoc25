import { Solver } from "#/types/solver.ts";
import { puzzleInput, readFile } from "#/utils/filesystem.ts";
import { IdRange } from "#/puzzles/02/common.ts";
import { shout, success } from "#/utils/console.ts";
import { chunk } from "#/utils/string.ts";

const isValidId = (id: number): boolean => {
    const v = id.toString();
    if (v.length < 2) return true;

    let chunkSize = v.length;
    do {
        chunkSize--;
        if ((v.length % chunkSize) !== 0) continue;

        const chunks = chunk(v, chunkSize);
        let allMatch = true;
        for (let i = 1; i < chunks.length; i++) {
            if (chunks[i] === chunks[0]) continue;
            allMatch = false;
            break;
        }
        if (allMatch) return false;
    } while (chunkSize > 1);
    return true;
};

export const solver: Solver = () => {
    const input = readFile(puzzleInput(2)).trim().split(",")
        .map(id => IdRange.fromIdRangeString(id));

    let sum = 0;
    for (const range of input) {
        for (let id = range.start; id <= range.end; id++) {
            if (isValidId(id)) continue;
            sum += id;
        }
    }
    console.log(success("The sum of all of the invalid IDs is ") + shout(sum));
};
