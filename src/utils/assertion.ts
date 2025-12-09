import { isNumeric, Numeric } from "#/utils/number.ts";

export class AssertionError extends Error {
    constructor (message: string = "Assertion failure", options?: ErrorOptions) {
        super(message, options);
    }
};

export const expect = (target: unknown) => {
    return {
        toEqual: (expected: unknown) => assertEqual(target, expected),
        toBeLessThan: (expected: Numeric) => assertLessThan(target, expected),
        toBeLessThanOrEqualTo: (expected: Numeric) => assertLessThan(target, expected, true),
        toBeGreaterThan: (expected: Numeric) => assertGreaterThan(target, expected),
        toBeGreaterThanOrEqualTo: (expected: Numeric) => assertGreaterThan(target, expected, true),
    };
};

const assertEqual = (target: unknown, expected: unknown): void => {
    if (typeof target !== typeof expected) throw new AssertionError();;

    switch (typeof target) {
        case "object":
            if (
                ((target === null) || (expected === null)) &&
                (target !== expected)
            ) throw new AssertionError();

            if (
                Array.isArray(target) &&
                Array.isArray(expected) &&
                (target.length === expected.length) &&
                !target.every((t, i) => assertEqual(t, expected[i]))
            ) throw new AssertionError();

            if (expected === undefined) throw new AssertionError();;
            assertEqualObject(target!, expected!);
            break;

        case "undefined":
        case "boolean":
        case "number":
        case "bigint":
        case "string":
        case "symbol":
            if (target !== expected) throw new AssertionError();
            break;

        case "function":
            throw new RangeError("Equality asserts on functions are not yet supported");

        case "string":
            if (target !== expected) throw new AssertionError();
            break;

        default:
            throw new RangeError("I guess javascript has a new promitive type now ...");
    }
};

const assertEqualObject = (target: object, expected: object): void => {
    const keys = Object.keys(target);
    if (Object.keys(expected).length !== keys.length) throw new AssertionError();
    for (const k of keys) {
        assertEqual(
            (target as Record<string, unknown>)[k],
            (expected as Record<string, unknown>)[k]
        );
    };
}

const assertGreaterThan = (
    target: unknown,
    expected: Numeric,
    orEquals: boolean = false
): void => {
    if (!isNumeric(target))
        throw new RangeError(`Invalid target value "${target}", expected number or bigint`);
    const result = orEquals ? (target >= expected) : (target > expected);
    if (!result) throw new AssertionError();
}

const assertLessThan = (
    target: unknown,
    expected: Numeric,
    orEquals: boolean = false
): void => {
    if (!isNumeric(target))
        throw new RangeError(`Invalid target value "${target}", expected number or bigint`);
    const result = orEquals ? (target <= expected) : (target < expected)
    if (!result) throw new AssertionError();
};
