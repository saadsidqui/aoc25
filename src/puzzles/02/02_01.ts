import { Solver } from "#/types/solver.ts";
import { puzzleInput, readFile } from "#/utils/filesystem.ts";
import { IdRange } from "#/puzzles/02/common.ts";
import { shout, success } from "#/utils/console.ts";
import { chunk } from "#/utils/string.ts";

const isValidId = (id: number): boolean => {
    const v = id.toString();
    if ((v.length % 2) !== 0) return true;

    const chunks = chunk(v, v.length / 2, true);
    return (chunks[1] !== chunks[0]);
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
