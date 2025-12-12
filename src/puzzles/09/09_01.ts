import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { toIntOrThrow } from "#/utils/number.ts";
import { Point } from "#/utils/Point.ts";
import { Rectangle } from "#/utils/Rectangle.ts";

export const solver: Solver = () => {
    const input = readLines(puzzleInput(9), true).map(l => {
        const [x, y] = l.split(",").map(c => toIntOrThrow(c));
        return new Point(x, y);
    });

    let largest = 0;
    for (const a of input) {
        for (const b of input) {
            if (a.equals(b)) continue;
            const rect = Rectangle.fromCorners(a, b);
            const area = (rect.height + 1) * (rect.width + 1);
            largest = (area > largest) ? area : largest;
        }
    }

    console.log(
        success("The the largest area of any possible rectangle is ") +
        shout(largest)
    );
};
