import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { Point } from "#/utils/Point.ts";
import { isWithinGridBounds, parseInput } from "#/puzzles/07/common.ts";


export const solver: Solver = () => {
    const mainfold = parseInput();

    let beams: Point[] = [], splits = 0, spawning = true;

    for (let y = mainfold.start.y; y < mainfold.grid.length; y++) {
        const line = mainfold.grid[y];

        if (spawning) {
            beams.push(new Point(mainfold.start.x, y));
            spawning = false;
            continue;
        }

        const newBeams: Point[] = [], visited = new Set<number>()
        let beam;
        while ((beam = beams.shift()) !== undefined) {
            const candidates: Point[] = [];
            if (line[beam.x]) { // Meets a splitter ...
                splits++;

                candidates.push(beam.add({ x: -1, y: 1 }))
                candidates.push(beam.add({ x: 1, y: 1 }));
            } else {
                candidates.push(beam.add({ x: 0, y: 1 }));
            }

            for (const candidate of candidates) {
                const key = candidate.hash;
                if (
                    !isWithinGridBounds(candidate, mainfold.grid) ||
                    visited.has(key)
                ) continue;
                newBeams.push(candidate);
                visited.add(key);
            }
        }
        beams = newBeams;
    }

    console.log(success("The total number of time the tachyon beam split is ") + shout(splits));
};
