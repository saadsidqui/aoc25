import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { DisjointSet } from "#/utils/DisjointSet.ts";
import { makeBoxPairKey } from "#/puzzles/08/common.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { toIntOrThrow } from "#/utils/number.ts";
import { Point3D } from "#/utils/Point3D.ts";

export const solver: Solver = () => {
    const input = readLines(puzzleInput(8), true).map(l => {
        const [x, y, z] = l.split(',').map(v => toIntOrThrow(v));
        return new Point3D(x, y, z);
    });

    let distances = new Map<string, number>();
    const grid = new DisjointSet<string>();
    for (const a of input) {
        grid.makeSet(a.hash());
        for (const b of input) {
            if (a.equals(b)) continue;
            const key = makeBoxPairKey(a, b);
            distances.set(key, a.euclideanDistance(b));
        }
    }
    distances = new Map([...distances].sort((a, b) => a[1] - b[1]));

    let finalConnection: [string, string] = ["", ""];
    for (const [pair, _] of distances) {
        const [left, right] = pair.split("-");
        if (grid.areInSameSet(left, right)) continue;
        grid.union(left, right);
        finalConnection = [left, right];
    }

    const [a, b] = finalConnection.map(hash => Point3D.fromHash(hash));
    const result = a.x * b.x;

    console.log(
        success("The multiplication result of the X coordinates of the last two junction boxes is ") +
        shout(result)
    );
};
