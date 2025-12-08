import { Solver } from "#/types/solver.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { shout, success } from "#/utils/console.ts";
import { toIntOrThrow } from "#/utils/number.ts";

const BatteryCount = 12;
export const solver: Solver = () => {
    const input = readLines(puzzleInput(3), true)
        .map(
            l => l.trim().split("").map(c => toIntOrThrow(c))
        );

    let total = 0;
    for (const bank of input) {
        const p = Array(BatteryCount).fill(0);

        let i, j, offset = -1, limit;
        for (j = 0; j < BatteryCount; j++) {
            ++offset;
            limit = bank.length - (BatteryCount - (j + 1));
            for (i = offset; i < limit; i++) {
                if (bank[i] <= p[j]) continue;
                p[j] = bank[i];
                offset = i;
            }
        }
        total += p.reverse().reduce((acc, v, i) => acc += v * Math.pow(10, i), 0);
    }
    console.log(success("The total output joltage ") + shout(total));
};
