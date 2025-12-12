import { Point, PointLike } from "#/utils/Point.ts";
import { toIntOrThrow } from "#/utils/number.ts";
import { Segment } from "#/utils/Segment.ts";

export interface RectangleLike {
    topLeft: PointLike;
    bottomRight: PointLike;
};

export class Rectangle {
    #topLeft: Point;
    #bottomRight: Point;

    public get topLeft(): Point { return this.#topLeft.clone(); }
    public get bottomRight(): Point { return this.#bottomRight.clone(); }
    public get topRight(): Point {
        return new Point(this.#bottomRight.x, this.#topLeft.y);
    }
    public get bottomLeft(): Point {
        return new Point(this.#topLeft.x, this.#bottomRight.y);
    }

    public get corners(): [Point, Point, Point, Point] {
        return [this.topLeft, this.bottomRight, this.topRight, this.bottomLeft];
    }

    public get edges(): [Segment, Segment, Segment, Segment] {
        return [
            new Segment(this.topLeft, this.topRight),
            new Segment(this.topRight, this.bottomRight),
            new Segment(this.bottomRight, this.bottomLeft),
            new Segment(this.bottomLeft, this.#topLeft)
        ];
    }

    public get height(): number {
        return Math.abs(this.#bottomRight.y - this.#topLeft.y);
    }

    public get width(): number {
        return Math.abs(this.#bottomRight.x - this.#topLeft.x);
    }

    public get area(): number {
        return this.height * this.width;
    }

    public get hash(): string {
        return `${this.#topLeft.x},${this.#topLeft.y}-` +
            `${this.#bottomRight.x},${this.#bottomRight.y}`;
    }

    constructor(topLeft: PointLike, bottomRight: PointLike) {
        this.#topLeft = new Point(topLeft.x, topLeft.y);
        this.#bottomRight = new Point(bottomRight.x, bottomRight.y);
    }

    public clone(): Rectangle {
        return new Rectangle(this.#topLeft, this.#bottomRight)
    }

    public contains(pt: PointLike, strictly: boolean = false): boolean {
        if (strictly) {
            return (pt.x > this.#topLeft.x) && (pt.y > this.#topLeft.y) &&
                (pt.x < this.#bottomRight.x) && (pt.y < this.#bottomRight.y);
        }
        return (pt.x >= this.#topLeft.x) && (pt.y >= this.#topLeft.y) &&
            (pt.x <= this.#bottomRight.x) && (pt.y <= this.#bottomRight.y);
    }

    public toString() {
        return `Rect(${this.#topLeft.x},${this.#topLeft.y}-` +
            `${this.#bottomRight.x},${this.#bottomRight.y})`;
    }

    public static fromHash(hash: string): Rectangle {
        const [[x, y], [a, b]] = hash.split("-").map(
            corners => corners.split(",").map(c => toIntOrThrow(c))
        );
        return new Rectangle({ x, y }, { x: a, y: b });
    }

    public static fromCorners(a: Point, b: Point): Rectangle {
        return new Rectangle(
            { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) },
            { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) }
        );
    }
}
