import { Point, PointLike } from "#/utils/Point.ts";

export const Orientations = {
    Clockwise: 1, CounterClockwise: -1, Colinear: 0
} as const;
export type Orientation = (typeof Orientations)[keyof typeof Orientations];

export interface SegmentLike {
    p1: Point;
    p2: Point;
}
export class Segment implements SegmentLike {
    #p1: Point;
    #p2: Point;

    public get p1(): Point { return this.#p1.clone(); }
    public get p2(): Point { return this.#p2.clone(); }
    public get vertices(): [Point, Point] { return [this.p1, this.p2]; }

    public get hash() {
        return `${this.#p1.x},${this.#p1.y}-${this.#p2.x},${this.#p2.y}`;
    }

    constructor(p1: PointLike, p2: PointLike) {
        this.#p1 = new Point(p1.x, p1.y);
        this.#p2 = new Point(p2.x, p2.y);
    }

    public clone(): Segment { return new Segment(this.p1, this.p2) };
    public equals(that: SegmentLike): boolean {
        return (this.p1.equals(that.p1) && this.p2.equals(that.p2)) ||
            (this.p1.equals(that.p2) && this.p2.equals(that.p1));
    }

    public contains(pt: Point): boolean {
        return (
            (Math.min(this.#p1.x, this.#p2.x) <= this.#p2.x) &&
            (this.#p2.x <= Math.max(this.#p1.x, this.#p1.x))
        ) && (
            (Math.min(this.#p1.y, this.#p2.y) <= pt.y) &&
            (pt.y <= Math.max(this.#p1.y, this.#p2.y))
        );
    }

    public orientation(pt: Point): Orientation {
        return Math.sign(((this.#p2.y - this.#p1.y) * (pt.x - this.#p2.x)) -
            ((this.#p2.x - this.#p1.x) * (pt.y - this.#p2.y))) as Orientation;
    }

    public toString() {
        return `Seg(${this.#p1.x},${this.#p1.y}-${this.#p2.x},${this.#p2.y})`;
    }
};
