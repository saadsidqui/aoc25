import { Point3D } from "#/utils/Point3D.ts";

export const makeBoxPairKey = (a: Point3D, b: Point3D): string => {
    const keyA = a.hash();
    const keyB = b.hash();
    return keyA >= keyB ? `${keyA}-${keyB}` : `${keyB}-${keyA}`;
};
