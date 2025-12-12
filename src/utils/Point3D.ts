import { toIntOrThrow } from "#/utils/number.js";

export interface Point3DLike {
    x: number;
    y: number;
    z: number;
}

export class Point3D implements Point3DLike {
    x: number = 0;
    y: number = 0;
    z: number = 0;

    public get hash() {
        return `${this.x},${this.y},${this.z}`;
    }

    constructor(x: number, y: number, z: number) {
        this.set(x, y, z);
    }

    public add(that: Point3DLike): Point3D {
        return new Point3D(this.x + that.x, this.y + that.y, this.z + that.z);
    }

    public clone(): Point3D { return new Point3D(this.x, this.y, this.z) };

    public distance(that: Point3DLike): Point3D {
        return new Point3D(
            Math.abs(this.x - that.x),
            Math.abs(this.y - that.y),
            Math.abs(this.z - that.z)
        );
    }

    public euclideanDistance(that: Point3DLike): number {
        return Math.sqrt(
            Math.pow(this.x - that.x, 2) +
            Math.pow(this.y - that.y, 2) +
            Math.pow(this.z - that.z, 2)
        );
    }

    public equals(that: Point3DLike): boolean {
        return (this.x == that.x) && (this.y == that.y) && (this.z == that.z);
    }

    public static fromHash(hash: string): Point3D {
        const [x, y, z] = hash.split(",").map(c => toIntOrThrow(c));
        return new Point3D(x, y, z);
    }

    public magnitude(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }

    public set(x: number, y: number, z: number): this {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    public substract(that: Point3DLike): Point3D {
        return new Point3D(this.x - that.x, this.y - that.y, this.z - that.z);
    }

    public toString() { return `Point(${this.x},${this.y},${this.z})`; }
};
