import { cantor } from "./number.js";

export interface PointLike {
    x: number;
    y: number;
}
export class Point implements PointLike {
    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number) {
        this.set(x, y);
    }

    public add(that: PointLike): Point {
        return new Point(this.x + that.x, this.y + that.y);
    }

    public clone(): Point { return new Point(this.x, this.y) };

    public distance(that: PointLike): Point {
        return new Point(Math.abs(this.x - that.x), Math.abs(this.y - that.y));
    }

    public euclideanDistance(that: PointLike): number {
        return Math.sqrt(
            Math.pow(this.x - that.x, 2) +
            Math.pow(this.y - that.y, 2)
        );
    }

    public equals(that: PointLike): boolean { return (this.x == that.x) && (this.y == that.y); }

    public flip() { return new Point(this.y, this.x); }

    public hash() { return cantor(this.x, this.y); }

    public intersects(topLeft: PointLike, bottomRight: PointLike): boolean {
        return (this.x >= topLeft.x) && (this.y >= topLeft.y) &&
            (this.x <= bottomRight.x) && (this.y <= bottomRight.y);
    }

    public magnitude(): number { return Math.sqrt((this.x * this.x) + (this.y * this.y)); }

    public set(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    public substract(that: PointLike): Point {
        return new Point(this.x - that.x, this.y - that.y);
    }

    public toString() { return `${this.x},${this.y}`; }
};
