import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { isValidOperation, Problem } from "#/puzzles/06/common.ts";
import { expect } from "#/utils/assertion.ts";
import { toIntOrThrow } from "#/utils/number.ts";

const parseInput = (): Problem[] => {
    const result: Problem[] = [];
    const lines = readLines(puzzleInput(6), true);

    for (const line of lines) {
        const items = line.trim().split(/\s+/).map(i => i.trim());
        expect(items.length).toBeGreaterThan(0);

        for (let i = 0; i < items.length; i++) {
            if (result[i] === undefined) result[i] = new Problem();

            const op = items[i];
            if (isValidOperation(op)) result[i].operation = op;
            else result[i].operands.push(toIntOrThrow(items[i]));
        }
    }
    return result;
};

export const solver: Solver = () => {
    const problems = parseInput();
    const total = problems.reduce((acc, p) => acc += p.answer(), 0);
    console.log(success("The grand total is ") + shout(total));
};
