import { Solver } from "#/types/solver.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { shout, success } from "#/utils/console.ts";
import { isRollAccessibleAt, ROLL } from "#/puzzles/04/common.ts";
import { Point } from "#/utils/Point.ts";

export const solver: Solver = () => {
    const initialGrid = readLines(puzzleInput(4), true).map(
        l => l.trim().split("").map(c => c == ROLL)
    );

    let total = 0
    const inaccessibleRolls = {
        current: 0, last: 0
    };

    let grid, nextGrid = structuredClone(initialGrid);
    do {
        grid = structuredClone(nextGrid);
        inaccessibleRolls.last = inaccessibleRolls.current;
        inaccessibleRolls.current = 0;

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                if (grid[y][x]) {
                    if (isRollAccessibleAt(new Point(x, y), grid)) {
                        nextGrid[y][x] = false;
                        total++;
                    } else {
                        inaccessibleRolls.current++;
                    }
                }
            }
        }
    } while (inaccessibleRolls.current !== inaccessibleRolls.last)
    console.log(success(
        "The total count of rolls of paper can be accessed by a forklift is "
    ) + shout(total));
};
