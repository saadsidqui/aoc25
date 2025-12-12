import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { DisjointSet } from "#/utils/DisjointSet.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { toIntOrThrow } from "#/utils/number.ts";
import { Point3D } from "#/utils/Point3D.ts";
import { makePairKey } from "#/utils/misc.ts";

export const solver: Solver = () => {
    const input = readLines(puzzleInput(8), true).map(l => {
        const [x, y, z] = l.split(',').map(v => toIntOrThrow(v));
        return new Point3D(x, y, z);
    });

    let distances = new Map<string, number>();
    const grid = new DisjointSet<string>();
    for (const a of input) {
        grid.makeSet(a.hash);
        for (const b of input) {
            if (a.equals(b)) continue;
            const key = makePairKey(a, b);
            distances.set(key, a.euclideanDistance(b));
        }
    }
    distances = new Map([...distances].sort((a, b) => a[1] - b[1]));

    let i = 0;
    for (const [pair, _] of distances) {
        if (++i > 1000) break;

        const [left, right] = pair.split("-");
        if (grid.areInSameSet(left, right)) continue;
        grid.union(left, right);
    }

    const circuits = grid.subsets().values().toArray();
    circuits.sort((a, b) => b.size - a.size);

    const result = circuits[0].size * circuits[1].size * circuits[2].size;
    console.log(
        success("The multiplication result of the size of the three largest circuits is ") +
        shout(result)
    );
};
