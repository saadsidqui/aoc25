import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { Instruction, OperandUpperBound } from "#/puzzles/01/common.ts";

export const solver: Solver = () => {
    const instructions = readLines(puzzleInput(1), true)
        .map((opcode: string) => Instruction.fromOpcode(opcode));

    const dial = {
        start: 50,
        end: 50
    };
    let total = 0;
    for (const instr of instructions) {
        dial.start = dial.end;

        switch (instr.op) {
            case "L":
                dial.end = (
                    dial.start + (OperandUpperBound - instr.operand)
                ) % OperandUpperBound;
                break;

            case "R":
                dial.end = (dial.start + instr.operand) % OperandUpperBound;
                break;

            default:
                throw new Error("Unknown operation");
        }
        if (dial.end === 0) total++
    }
    console.log(success("The password to open the door is ") + shout(total));
};
