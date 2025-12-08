export const expect = (target: unknown) => {
    return {
        toEqual: (expected: unknown) => assertEqual(target, expected),
    };
};

const assertEqual = (target: unknown, expected: unknown): boolean => {
    if (typeof target !== typeof expected) return false;

    switch (typeof target) {
        case "object":
            if ((target === null) || (expected === null)) return (target === expected);
            if (
                Array.isArray(target) &&
                Array.isArray(expected) &&
                (target.length === expected.length)
            ) return target.every((t, i) => assertEqual(t, expected[i]));
            if (expected === undefined) return false;
            return assertEqualObject(target, expected);

        case "undefined":
        case "boolean":
        case "number":
        case "bigint":
        case "string":
        case "symbol":
            return target === expected;

        case "function":
            throw new RangeError("Equality asserts on functions are not yet supported");

        case "string":
            return target == expected;

        default:
            throw new RangeError("I guess javascript has a new promitive type now ...");
    }
};

const assertEqualObject = (target: object, expected: object): boolean => {
    const keys = Object.keys(target);
    if (Object.keys(expected).length !== keys.length) return false;
    for (const k of keys) {
        if (!assertEqual(
            (target as Record<string, unknown>)[k],
            (expected as Record<string, unknown>)[k]
        )) return false;
    };
    return true;
}
