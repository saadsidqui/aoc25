import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { Button, parseLine } from "#/puzzles/10/common.ts";

const step = (
    lights: number, toBePressed: Readonly<Button[]>, targtet: number,
    chain: Readonly<Button[]> = []
): Readonly<Button[]> | null => {
    if (lights === targtet) return chain;

    const matches = [];
    for (let i = 0; i < toBePressed.length; i++) {
        const button = toBePressed[i];
        const nextChain = chain.slice();
        nextChain.push(button);

        const match = step(
            lights ^ button.value,
            toBePressed.slice(i + 1),
            targtet, nextChain
        );
        if (match !== null) matches.push(match);
    }
    if (matches.length > 0)
        return matches.sort((a, b) => a.length - b.length)[0];
    return null;
};

export const solver: Solver = () => {
    console.time('solver');
    const machines = readLines(puzzleInput(10), true).map(l => parseLine(l));

    let total = 0;
    for (const machine of machines) {
        const match = step(0, machine.buttons, machine.lights);
        if (match === null) throw new Error("No solution found for " + JSON.stringify(machine));
        total += match.length;
    }

    console.log(
        success("The fewest button presses required to correctly configure the indicator lights on all of the machines ") +
        shout(total)
    );
    console.timeEnd('solver');
};
