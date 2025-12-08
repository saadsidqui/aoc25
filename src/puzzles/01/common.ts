import { toIntOrThrow } from "#/utils/number.ts";

export const MaxOperandValue = 99;
export const OperandUpperBound = MaxOperandValue + 1;

export const ValidOperation = ["L", "R"] as const;
export type Operation = (typeof ValidOperation)[number];

export const isValidOperation = (op: any): op is Operation => ValidOperation.includes(op);

export class Instruction {
    #op: Operation;
    #operand: number;

    public get op() : Operation { return this.#op };
    public get operand() : number { return this.#operand };

    constructor (op: Operation, operand: number) {
        this.#op = op;
        this.#operand = operand;
    }

    static fromOpcode (opcode: string) {
        const op = opcode.substring(0, 1);
        if (!isValidOperation(op)) throw RangeError(`Invalid operation (${op})`);
        const operand = toIntOrThrow(opcode.substring(1));
        return new Instruction(op, operand)
    }

    hash() { return `${this.#op}${this.#operand}`}
    equals(other: Instruction) {
        return (this.#op === other.#op) && (this.#operand === other.#operand);
    }
};
