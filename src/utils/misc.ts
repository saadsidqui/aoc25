import crypto from "node:crypto";

let _uid = 0;

export const unique_id = (): number => {
    return _uid++;
};

export const sha1 = (payload: crypto.BinaryLike): string =>
    crypto.createHash('sha1').update(payload).digest('hex');

export const sha256 = (payload: crypto.BinaryLike): string =>
    crypto.createHash('sha256').update(payload).digest('hex');

export const wait = async (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

interface Hashable<T> {
    hash: T;
};

export const makePairKey = <T>(
    a: Hashable<T>, b: Hashable<T>, separator: string = "-"
): string => {
    const keyA = a.hash;
    const keyB = b.hash;
    return keyA >= keyB ? `${keyA}-${keyB}` : `${keyB}${separator}${keyA}`;
};
