import { cantor } from "./number.js";

export class Point {
    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number) {
        this.set(x, y);
    }

    public add(that: Point): Point {
        return new Point(this.x + that.x, this.y + that.y);
    }

    public addXY(x: number, y: number): Point {
        return new Point(this.x + x, this.y + y);
    }

    public clone(): Point { return new Point(this.x, this.y) };

    public distance(that: Point): Point {
        return new Point(Math.abs(this.x - that.x), Math.abs(this.y - that.y));
    }

    public equals(that: Point): boolean { return (this.x == that.x) && (this.y == that.y); }

    public flip() { return new Point(this.y, this.x); }

    public hash() { return cantor(this.x, this.y); }

    public intersects(topLeft: Point, bottomRight: Point): boolean {
        return (this.x >= topLeft.x) && (this.y >= topLeft.y) &&
            (this.x <= bottomRight.x) && (this.y <= bottomRight.y);
    }

    public magnitude(): number { return Math.sqrt((this.x * this.x) + (this.y * this.y)); }

    public set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public substract(that: Point): Point {
        return new Point(this.x - that.x, this.y - that.y);
    }

    public toString() { return `${this.x},${this.y}`; }
};
