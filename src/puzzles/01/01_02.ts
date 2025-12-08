import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { Instruction, OperandUpperBound } from "#/puzzles/01/common.ts";

export const solver: Solver = () => {
    const instructions = readLines(puzzleInput(1), true)
        .map((opcode: string) => Instruction.fromOpcode(opcode));

    const dial = {
        start: 50,
        end: 50,
        zeroCrosses: 0,
    };
    let totalZeroCrosses = 0, diff = 0;

    for (const instr of instructions) {
        dial.start = dial.end;
        dial.zeroCrosses = 0;

        switch (instr.op) {
            case "L":
                dial.end = (
                    dial.start + (OperandUpperBound - (instr.operand % OperandUpperBound))
                ) % OperandUpperBound;
                diff = dial.start - instr.operand;
                if (diff <= 0) {
                    dial.zeroCrosses = Math.floor(-diff / OperandUpperBound) + 1;
                    if (dial.start === 0) dial.zeroCrosses--;
                }
                break;

            case "R":
                dial.end = (dial.start + instr.operand) % OperandUpperBound;
                dial.zeroCrosses = Math.floor(
                    (dial.start + instr.operand) / OperandUpperBound
                );
                break;

            default:
                throw new Error("Unknown operation");
        }
        totalZeroCrosses += dial.zeroCrosses;
    }
    console.log(success("The password to open the door is ") + shout(totalZeroCrosses));
};
