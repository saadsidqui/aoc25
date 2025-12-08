import { Point } from "#/utils/Point.ts";

export const ROLL = "@";

export const isWithinGridBounds = <T>(pt: Point, grid: T[][]): boolean => {
    if ((grid.length < 1) || (grid[0].length < 1)) return false;
    return (pt.x >= 0) && (pt.x < grid[0].length) &&
        (pt.y >= 0) && (pt.y < grid.length);
};

export const isRollAccessibleAt = (pt: Point, grid: boolean[][], threshold: number = 4): boolean => {
    let x = 0, y = 0, count = 0;
    for (let j = -1; j < 2; j++) {
        y = pt.y + j;
        for (let i = -1; i < 2; i++) {
            x = pt.x + i;
            const target = new Point(x, y);
            if ((target.equals(pt)) || !isWithinGridBounds(target, grid)) continue;
            if (grid[target.y][target.x]) count++;
        }
    }
    return count < threshold;
};
