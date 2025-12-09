import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { CephalopodProblem, isValidOperation, Operation } from "#/puzzles/06/common.ts";
import { toIntOrThrow } from "#/utils/number.ts";

/** =========================================================================
 *  PAY ATTENTION TO THE INPUT DATA:
 *  --------------------------------
 *      Some IDEs will trim trailing white spaces on format or on save.
 *      This will likely break the logic since the puzzle relies on digits
 *      being aligned using whitespaces *
 ========================================================================= */

type BlockDescriptor = {
    operation: Operation,
    offset: number,
    length: number,
};

const parseOperationsLine = (line: string): BlockDescriptor[] => {
    const result: BlockDescriptor[] = [];
    const re = /[\*\+]\s+/g;
    const blocks = line.matchAll(re);

    for (const block of blocks) {
        const op = block[0].trim();
        if (!isValidOperation(op)) throw new RangeError(`Invalid operation "${op}"`);
        result.push({
            operation: op,
            offset: block.index,
            length: block[0].length - 1,
        });
    }
    result[result.length - 1].length++;
    return result;
};

const parseInput = (): CephalopodProblem[] => {
    const result: CephalopodProblem[] = [];
    const lines = readLines(puzzleInput(6), true);
    const blocks = parseOperationsLine(lines.pop() ?? "");

    for (const line of lines) {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const operand = line.substring(block.offset, block.offset + block.length);
            if (result[i] === undefined) result[i] = new CephalopodProblem(block.operation);

            const digits = operand.split("").reverse().map(o => (o === " ") ? o : toIntOrThrow(o));
            for (let j = 0; j < digits.length; j++) {
                if (!Array.isArray(result[i].operands[j])) result[i].operands[j] = [];
                result[i].operands[j].push(digits[j]);
            }
        }
    }
    return result;
};

export const solver: Solver = () => {
    const problems = parseInput();

    let total = 0;

    for (const problem of problems) {
        total += problem.answer();
    }

    console.log(success("The grand total is ") + shout(total));
};
