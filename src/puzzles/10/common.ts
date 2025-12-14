import { toIntOrThrow } from "#/utils/number.ts";

export type Machine = {
    lights: number,
    buttons: Button[],
    joltage: Joltage,
};

export type PatternMap = Map<number, Array<Button[]>>;
export class Button {
    #value: number = 0;
    #components: number[] = [];

    public get value(): number { return this.#value; }
    public get hash(): number { return this.#value; }
    public get components(): number[] { return structuredClone(this.#components); }

    constructor(state: number | number[] = 0) {
        if (Array.isArray(state)) this.#setFromComponents(state);
        else this.#setFromValue(state);
    }

    public clone(): Button { return new Button(this.#value); }
    public equals(that: Button): boolean { return this.#value === that.value; }

    public toString(): string { return this.#components.join(); }

    static toComponents(value: number): number[] {
        let i = -1, sum = 0;
        const result: number[] = [];
        while (sum != value) {
            const v = 1 << ++i;
            if ((value & v) !== v) continue;
            sum += v;
            result.push(i);
        }
        return result;
    }

    static toValue(components: number[]): number {
        let result = 0;
        for (const c of components) result += (1 << c);
        return result;
    }

    #setFromValue(value: number) {
        this.#value = value;
        this.#components = Button.toComponents(value);
    }

    #setFromComponents(components: number[]) {
        this.#components = structuredClone(components);
        this.#value = Button.toValue(components);
    }
};

export class Joltage {
    #state: number[];

    public get state(): number[] { return structuredClone(this.#state); }
    public get length(): number { return this.#state.length; }
    public get hash(): string { return this.#state.join(); }

    constructor(state: number[]) { this.#state = structuredClone(state); }

    public clone(): Joltage { return new Joltage(this.#state); }
    public equals(that: Joltage): boolean { return this.hash === that.hash; }

    public divideBy(n: number): this {
        for (let i = 0; i < this.#state.length; i++)
            this.#state[i] /= n;
        return this;
    }

    public up(button: Button | number): this {
        this.#state = Joltage.#applyButtonsToState(this.#state, button);
        return this;
    }

    public down(button: Button | number): this {
        this.#state = Joltage.#applyButtonsToState(this.#state, button, true);
        return this;
    }

    public isValid(): boolean { return !this.#state.some(counter => counter < 0); }

    public isAllZeros(): boolean {
        return this.#state.every(counter => counter === 0);
    }

    public toString(): string { return this.hash; }

    public toPattern(): number {
        let result = 0;
        for (let i = 0; i < this.#state.length; i++) {
            if ((this.#state[i] % 2) !== 1) continue;
            result += 1 << i;
        }
        return result;
    }

    static #applyButtonsToState(
        state: number[], button: Button | number, countDown: boolean = false
    ): number[] {
        const result: number[] = [], step = countDown ? -1 : 1;
        let i = -1;
        if (button instanceof Button) button = button.value;
        for (const counter of state) {
            const v = 1 << ++i;
            result.push(counter + ((button & v) === v ? step : 0));
        }
        return result;
    }
};

export const parseLine = (line: string): Machine => {
    const re = {
        lights: /^\[[\.#]+\]/g,
        buttons: /\([\d,]+\)/g,
        joltage: /\{[\d,]+\}$/g,
    };

    const [lightsDiagram] = line.matchAll(re.lights);
    if (!lightsDiagram || !Array.isArray(lightsDiagram))
        throw new RangeError("Invalid line: bad lights diagram");
    const lights = lightsDiagram[0].substring(1, lightsDiagram[0].length - 1)
        .split("").reduce((acc, v, i) => acc += (v == "#") ? 1 << i : 0, 0);


    const buttons = line.matchAll(re.buttons).toArray().map(match => {
        return new Button(
            match[0].substring(1, match[0].length - 1).split(",")
                .map(b => toIntOrThrow(b))
        );
    });
    if (buttons.length < 1)
        throw new RangeError("Invalid line: bad buttons wiring");

    const joltageRequirements = line.matchAll(re.joltage).toArray()
    if (joltageRequirements.length < 1)
        throw new RangeError("Invalid line: bad joltage requirements");
    const joltage = new Joltage(
        line.matchAll(re.joltage).toArray().map(match => {
            return match[0].substring(1, match[0].length - 1).split(",")
                .map(b => toIntOrThrow(b));
        })[0]
    );

    return { lights, joltage, buttons, };
};
