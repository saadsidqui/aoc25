import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { Device, parseInput } from "#/puzzles/11/common.ts";

const step = (
    current: Device, target: string, chain: Set<string>,
    devices: Readonly<Map<string, Device>>
): number => {
    if (current.name === target) return 1;

    let paths = 0;
    for (const o of current.outputs) {
        if (chain.has(o)) continue;
        chain.add(o);

        const output = devices.get(o);
        if (output === undefined) throw new RangeError(`Cannot find device "${o}"`);
        paths += step(output, target, chain, devices);

        chain.delete(o);
    }
    return paths;
}
export const solver: Solver = () => {
    console.time('solver');
    const devices = parseInput(readLines(puzzleInput(11), true));

    const start = devices.get("you");
    const end = devices.get("out");
    if ((start === undefined) || (end === undefined))
        throw new RangeError("Cannot find the source or destination device");
    let total = step(start, end.name, new Set<string>(), devices);

    console.log(
        success("There are ") + shout(total) +
        success(` paths from "${start.name}" to "${end.name}" `)
    );
    console.timeEnd('solver');
};
