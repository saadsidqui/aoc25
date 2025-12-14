import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { Button, Joltage, parseLine, PatternMap } from "#/puzzles/10/common.ts";

const preBakePossiblePatterns = (
    state: number, buttons: Readonly<Button[]>, chain: Button[], map: PatternMap
): PatternMap => {
    const existing = map.get(state) ?? [];
    existing.push(chain);
    map.set(state, existing);

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const newChain = chain.slice();
        newChain.push(button);
        preBakePossiblePatterns(state ^ button.value, buttons.slice(i + 1), newChain, map);
    }
    return map;
};

const step = (joltage: Joltage, patterns: PatternMap): number | null => {
    if (joltage.isAllZeros()) return 0;

    let result = null;
    const pattern = joltage.toPattern();
    const candidates = patterns.get(pattern);
    if (candidates === undefined) return null;

    for (const buttons of candidates) {
        const newJoltage = joltage.clone();

        for (const button of buttons) newJoltage.down(button);
        if (!newJoltage.isValid()) continue;

        newJoltage.divideBy(2);

        const halfPresses = step(newJoltage, patterns);
        if (halfPresses === null) continue;

        const presses = (2 * halfPresses) + buttons.length;
        result = (result === null) ? presses : Math.min(result, presses);
    }
    return result;
};

export const solver: Solver = () => {
    console.time('solver');
    const machines = readLines(puzzleInput(10), true).map(l => parseLine(l));

    let total = 0, progress = 0;
    for (const machine of machines) {
        const str = `\u001b[2K\r${(++progress * 100 / machines.length).toFixed(2)}%`;
        process.stdout.write(str);

        const patterns = preBakePossiblePatterns(
            0, machine.buttons, [], new Map<number, Array<Button[]>>()
        );
        const presses = step(machine.joltage, patterns);
        if (presses === null)
            throw new Error(`[${progress}] No solution found for ${machine}]`);
        total += presses;
    }

    process.stdout.write("\n");
    console.log(
        success("The fewest button presses required to correctly configure the to correctly configure the joltage level counters on all of the machines ") +
        shout(total)
    );
    console.timeEnd('solver');
};


