import { Solver } from "#/types/solver.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { Range } from "#/puzzles/05/common.ts";
import { shout, success } from "#/utils/console.ts";
import isBlank from "voca/is_blank.js";

const parseInput = (): Range[] => {
    const result: Range[] = [];
    const lines = readLines(puzzleInput(5));

    for (const line of lines) {
        if (isBlank(line)) break;
        result.push(Range.fromRangeString(line));
    }
    return result;
}

export const solver: Solver = () => {
    const initialRanges = parseInput().toSorted((a, b) => a.start - b.start);
    const condensedRanges: Range[] = [];

    let current = initialRanges[0];
    for (const range of initialRanges) {
        if (!current.contains(range.start)) {
            condensedRanges.push(current);
            current = range;
            continue;
        }

        if (current.contains(range.end))
            continue;
        current.end = range.end;
    }
    condensedRanges.push(current);

    const total = condensedRanges.reduce((acc, r) => acc += r.size + 1, 0);

    console.log(success("The total number of ingredient considered fresh is ") + shout(total));
};
