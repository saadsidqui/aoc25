export const Operations = {
    "*": (operands: number[]) => operands.reduce((acc, v) => acc *= v, 1),
    "+": (operands: number[]) => operands.reduce((acc, v) => acc += v, 0),
} as const;
export type Operation = keyof typeof Operations;
abstract class BaseProblem<T> {
    public operands: T[];
    public operation: Operation;

    constructor (operation: Operation = "+", operands: T[] = []) {
        this.operands = operands;
        this.operation = operation;
    }

    public abstract answer(): number;
    public abstract toString(): string;
}

export class Problem extends BaseProblem<number> {
    public answer(): number {
        return Operations[this.operation](this.operands);
    }

    public toString(): string { return this.operands.join(` ${this.operation} `); }
}

export class CephalopodProblem extends BaseProblem<(number|" ")[]> {
    public toProblem(): Problem {
        const result = new Problem(this.operation);

        for (const operand of this.operands) {
            result.operands.push(
                operand.toReversed().filter(o => o !== " ").reduce(
                    (acc, d, i) => acc += d * Math.pow(10, i), 0
                )
            );
        }
        return result;
    }

    public answer(): number { return this.toProblem().answer(); }

    public toString(): string {
        return this.toProblem().toString();
    }
}

const ValidOperations = Object.keys(Operations);
export const isValidOperation = (v: any): v is Operation => ValidOperations.includes(v);
