import { isNumeric, Numeric } from "#/utils/number.ts";

export class AssertionError extends Error {
    constructor (message: string = "Assertion failure", options?: ErrorOptions) {
        super(message, options);
    }
};

export const expect = (target: unknown) => {
    return {
        toEqual: (expected: unknown) => {
            if (!assertEqual(target, expected)) throw new AssertionError()
        },
        toNotEqual: (expected: unknown) => {
            if (assertEqual(target, expected)) throw new AssertionError()
        },
        toBeLessThan: (expected: Numeric) => {
            if (assertLessThan(target, expected)) throw new AssertionError()
        },
        toBeLessThanOrEqualTo: (expected: Numeric) => {
            if (assertLessThan(target, expected, true)) throw new AssertionError()
        },
        toBeGreaterThan: (expected: Numeric) => {
            if (assertGreaterThan(target, expected)) throw new AssertionError()
        },
        toBeGreaterThanOrEqualTo: (expected: Numeric) => {
            if (assertGreaterThan(target, expected, true)) throw new AssertionError()
        },
    };
};

const assertEqual = (target: unknown, expected: unknown): boolean => {
    if (typeof target !== typeof expected) throw new AssertionError();

    switch (typeof target) {
        case "object":
            if (
                ((target === null) || (expected === null)) &&
                (target !== expected)
            ) return false;

            if (
                Array.isArray(target) &&
                Array.isArray(expected) &&
                (target.length === expected.length) &&
                !target.every((t, i) => assertEqual(t, expected[i]))
            ) return false;

            if (expected === undefined) return false;
            return assertEqualObject(target!, expected!);

        case "undefined":
        case "boolean":
        case "number":
        case "bigint":
        case "string":
        case "symbol":
            return (target === expected);

        case "function":
            throw new RangeError("Equality asserts on functions are not yet supported");

        case "string":
            return (target === expected);

        default:
            throw new RangeError("I guess javascript has a new promitive type now ...");
    }
};

const assertEqualObject = (target: object, expected: object): boolean => {
    const keys = Object.keys(target);
    if (Object.keys(expected).length !== keys.length) return false;
    for (const k of keys) {
        const flag = assertEqual(
            (target as Record<string, unknown>)[k],
            (expected as Record<string, unknown>)[k]
        );
        if (!flag) return false;
    };
    return true;
}

const assertGreaterThan = (
    target: unknown,
    expected: Numeric,
    orEquals: boolean = false
): boolean => {
    if (!isNumeric(target))
        throw new RangeError(`Invalid target value "${target}", expected number or bigint`);
    return orEquals ? (target >= expected) : (target > expected);
}

const assertLessThan = (
    target: unknown,
    expected: Numeric,
    orEquals: boolean = false
): boolean => {
    if (!isNumeric(target))
        throw new RangeError(`Invalid target value "${target}", expected number or bigint`);
    return orEquals ? (target <= expected) : (target < expected);
};
