import { Solver } from "#/types/solver.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { toIntOrThrow } from "#/utils/number.ts";
import isBlank from "voca/is_blank.js";
import { Range } from "#/puzzles/05/common.ts";
import { shout, success } from "#/utils/console.ts";

type IngredientDatabase = {
    ids: number[],
    ranges: Range[],
};

const isIngredientFresh = (id: number, ranges: Range[], cache?: Set<number>): boolean => {
    const hasCache = cache instanceof Set;
    if (hasCache && cache.has(id)) return true;

    for (const range of ranges) {
        if (range.contains(id)) {
            if (hasCache) cache.add(id);
            return true;
        }
    }

    return false;
};

const parseInput = (): IngredientDatabase => {
    const result: IngredientDatabase = { ids: [], ranges: []};
    const lines = readLines(puzzleInput(5));

    let processingIds = false;

    for (const line of lines) {
        if (isBlank(line)) processingIds = true;
        else if (processingIds) result.ids.push(toIntOrThrow(line));
        else result.ranges.push(Range.fromRangeString(line));
    }
    return result;
}

export const solver: Solver = () => {
    const db = parseInput();

    const cache = new Set<number>();
    let total = 0;
    for (const id of db.ids)
        if (isIngredientFresh(id, db.ranges, cache)) total++;

    console.log(success("The total number of fresh ingredient is ") + shout(total));
};
