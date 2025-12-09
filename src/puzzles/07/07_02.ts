import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { Point } from "#/utils/Point.ts";
import { isWithinGridBounds, parseInput } from "#/puzzles/07/common.ts";

const step = (beam: Point, grid: boolean[][], cache: Map<number, number>): number => {
    const key = beam.hash();

    let result = cache.get(key);
    if (result !== undefined) return result;

    if (!isWithinGridBounds(beam, grid)) result = 1;
    else if (grid[beam.y][beam.x]) { // Meets a splitter ...
        result = step(beam.addXY(-1, 1), grid, cache) + step(beam.addXY(1, 1), grid, cache);
    } else result = step(beam.addXY(0, 1), grid, cache);

    cache.set(key, result);
    return result;
};

export const solver: Solver = () => {
    const mainfold = parseInput();

    const timelines = step(mainfold.start, mainfold.grid, new Map<number, number>());
    console.log(success("The total number of time the tachyon beam split is ") + shout(timelines));
};
