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
