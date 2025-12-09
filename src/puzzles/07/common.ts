import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { Point } from "#/utils/Point.ts";

export const START = "S";
export const SPLITTER = "^";
export const OPEN_SPACE = ".";

export type Manifold = {
    start: Point,
    grid: boolean[][],
};

export const parseInput = (): Manifold => {
    const result: Manifold = {
        start: new Point(0, 0),
        grid: [],
    };
    const lines = readLines(puzzleInput(7), true);

    for (let y = 0; y < lines.length; y++) {
        const line = lines[y].split("");
        const lineItems = [];
        for (let x = 0; x < line.length; x++) {
            if (line[x] === START) {
                result.start.set(x, y);
                line[x] = OPEN_SPACE;
            }
            lineItems.push(line[x] === SPLITTER);
        }
        result.grid.push(lineItems);
    }
    return result;
};

export const isWithinGridBounds = <T>(pt: Point, grid: T[][]): boolean => {
    if ((grid.length < 1) || (grid[0].length < 1)) return false;
    return (pt.x >= 0) && (pt.x < grid[0].length) &&
        (pt.y >= 0) && (pt.y < grid.length);
};
