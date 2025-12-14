import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { Device, parseInput } from "#/puzzles/11/common.ts";

type MandatoryStops = { dac: boolean, fft: boolean };

const step = (
    current: Device, target: string, required: MandatoryStops, chain: Set<string>,
    devices: Readonly<Map<string, Device>>, cache: Map<string, number>
): number => {
    const newRequired: MandatoryStops = structuredClone(required);
    if (current.name == "dac") newRequired.dac = true;
    else if (current.name == "fft") newRequired.fft = true;

    const key = `${current.name}-${newRequired.dac ? 1 : 0}-${newRequired.fft ? 1 : 0}`;
    const cached = cache.get(key);
    if (cached !== undefined)
        return cached;

    if (current.name === target) {
        const result = (newRequired.dac && newRequired.fft) ? 1 : 0;
        cache.set(key, result);
        return result;
    }

    let paths = 0;
    for (const o of current.outputs) {
        if (chain.has(o)) continue;
        chain.add(o);

        const output = devices.get(o);
        if (output === undefined) throw new RangeError(`Cannot find device "${o}"`);
        paths += step(output, target, newRequired, chain, devices, cache);

        chain.delete(o);
    }
    cache.set(key, paths);
    return paths;
}

export const solver: Solver = () => {
    console.time('solver');
    const devices = parseInput(readLines(puzzleInput(11), true));

    const start = devices.get("svr");
    const end = devices.get("out");
    if ((start === undefined) || (end === undefined))
        throw new RangeError("Cannot find the source or destination device");

    const required = { dac: false, fft: false };
    let total = step(
        start, end.name, required, new Set<string>(), devices, new Map<string, number>()
    );

    console.log(
        success("There are ") + shout(total) +
        success(` path from "${start.name}" to "${end.name}" that go through "dac" and "fft"`)
    );
    console.timeEnd('solver');
};
