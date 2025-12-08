import { Solver } from "#/types/solver.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { shout, success } from "#/utils/console.ts";
import { toIntOrThrow } from "#/utils/number.ts";

export const solver: Solver = () => {
    const input = readLines(puzzleInput(3), true)
        .map(
            l => l.trim().split("").map(c => toIntOrThrow(c))
        );

    let total = 0;
    for (const bank of input) {
        const result = {
            p1: 0,
            p2: 0,
        };

        let i = 0, offset = 0;
        for (i = 0; i < bank.length - 1; i++) {
            if (bank[i] <= result.p1) continue;
            result.p1 = bank[i];
            offset = i;
        }

        for (i = ++offset; i < bank.length; i++)
            result.p2 = Math.max(result.p2, bank[i]);

        total += (result.p1 * 10) + result.p2;
    }
    console.log(success("The total output joltage ") + shout(total));
};
