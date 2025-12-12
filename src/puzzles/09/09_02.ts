import { Solver } from "#/types/solver.ts";
import { shout, success } from "#/utils/console.ts";
import { puzzleInput, readLines } from "#/utils/filesystem.ts";
import { makePairKey } from "#/utils/misc.ts";
import { toIntOrThrow } from "#/utils/number.ts";
import { Point } from "#/utils/Point.ts";
import { Rectangle } from "#/utils/Rectangle.ts";
import { Segment } from "#/utils/Segment.ts";

type Direction = "up" | "right" | "down" | "left";
type Axis = "x" | "y";
type WalkParams = {
    axis: Axis;
    step: 1 | -1;
};

const mapBounds = {
    topLeft: { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER },
    bottomRight: { x: 0, y: 0 },
};

const DirectionToWalkParamsMap: Record<Direction, WalkParams> = {
    up: { axis: "y", step: -1 }, right: { axis: "x", step: 1 },
    down: { axis: "y", step: 1 }, left: { axis: "x", step: -1 },
};

const corners = new Map<number, Point>();
const polygon = new Map<number, Point>();
const polygonEdges: Segment[] = [];
const visited = new Set<string>();

export const solver: Solver = async () => {
    console.time('solver');
    const input = readLines(puzzleInput(9), true).map(l => {
        const [x, y] = l.split(",").map(c => toIntOrThrow(c));
        return new Point(x, y);
    });

    for (let i = 0; i < input.length; i++) {
        const a = input[i];
        const b = input[(i + 1) % input.length];
        polygonEdges.push(new Segment(a, b));
        corners.set(a.hash, a);

        for (const pt of walk(a, b)) polygon.set(pt.hash, pt);

        mapBounds.topLeft.x = Math.min(mapBounds.topLeft.x, a.x);
        mapBounds.topLeft.y = Math.min(mapBounds.topLeft.y, a.y);
        mapBounds.bottomRight.x = Math.max(mapBounds.bottomRight.x, a.x);
        mapBounds.bottomRight.y = Math.max(mapBounds.bottomRight.y, a.y);
    }

    let largest = 0, progress = 0, fits = false;
    const total = corners.size * corners.size;
    for (const [_, a] of corners) {
        for (const [_, b] of corners) {
            const str = `\u001b[2K\r[${a} - ${b}], ${(++progress * 100 / total).toFixed(2)}%`;
            process.stdout.write(str);

            const key = makePairKey(a, b);
            if (visited.has(key)) continue;
            visited.add(key);

            if (a.equals(b) || a.colinear(b)) continue;

            const rect = Rectangle.fromCorners(a, b);

            fits = isInsidePolygon(rect.topLeft) && isInsidePolygon(rect.topRight) &&
                isInsidePolygon(rect.bottomRight) && isInsidePolygon(rect.bottomLeft);
            if (!fits) continue;

            for (const [_, c] of corners) {
                if (c.equals(a) || c.equals(b) || !rect.contains(c, true)) continue;
                fits = false;
                break;
            }
            if (!fits) continue;

            for (const polyEdge of polygonEdges) {
                for (const rectEdge of rect.edges) {
                    if (!doEdgesCross(rectEdge, polyEdge)) continue;
                    fits = false;
                    break;
                }
            }
            if (!fits) continue;

            const area = (rect.height + 1) * (rect.width + 1);
            largest = (area > largest) ? area : largest;
        }
    }

    process.stdout.write("\n");
    console.log(
        success("The largest area of any possible rectangle using only red and green tiles is ") +
        shout(largest)
    );
    console.timeEnd('solver');
};

const doEdgesCrossCache = new Map<string, boolean>();
const doEdgesCross = (a: Segment, b: Segment): boolean => {
    const key = makePairKey(a, b);
    const cached = doEdgesCrossCache.get(key);
    if (cached !== undefined) return cached;

    const ab1 = a.orientation(b.p1);
    const ab2 = a.orientation(b.p2);
    const ba1 = b.orientation(a.p1);
    const ba2 = b.orientation(a.p2);
    const result = (ab1 * ab2 < 0) && (ba1 * ba2 < 0);
    doEdgesCrossCache.set(key, result);
    return result;
};

const isWithinMapBounds = (pt: Point): boolean => {
    return (pt.x >= mapBounds.topLeft.x) && (pt.x <= mapBounds.bottomRight.x) &&
        (pt.y >= mapBounds.topLeft.y) && (pt.y <= mapBounds.bottomRight.y);
};

const findWalkParams = (src: Point, dst: Point): WalkParams => {
    let axis: Axis = "x";

    if (src.x === dst.x) axis = "y";
    else if (src.y === dst.y) axis = "x";
    else throw new RangeError("Invalid source-destination pair for a walk");

    const step = dst[axis] > src[axis] ? 1 : -1;
    return { axis, step };
};

const walk = (src: Point, dst: Point): Point[] => {
    const result: Point[] = [];

    result.push(src.clone());
    if (src.equals(dst)) return result;

    const { axis, step } = findWalkParams(src, dst);
    const walker = src.clone();
    do {
        walker[axis] += step;
        result.push(walker.clone());
    } while (!dst.equals(walker));

    return result;
};

const findRaycastWalkParams = (pt: Point): WalkParams => {
    const direction = Object.entries({
        left: Math.abs(pt.x - mapBounds.topLeft.x),
        right: Math.abs(mapBounds.bottomRight.x - pt.x),
        up: Math.abs(pt.y - mapBounds.topLeft.y),
        down: Math.abs(mapBounds.bottomRight.y - pt.y),
    }).sort((a, b) => a[1] - b[1])[0][0] as Direction;
    return DirectionToWalkParamsMap[direction];
};

const isInsidePolygonCache = new Map<number, boolean>();
const isInsidePolygon = (pt: Point): boolean => {
    const key = pt.hash;
    const cached = isInsidePolygonCache.get(key);
    if (cached !== undefined) return cached;

    if (polygon.has(key)) {
        isInsidePolygonCache.set(key, true);
        return true;
    }

    const { axis, step } = findRaycastWalkParams(pt);
    const walker = pt.clone();
    let crossings = 0;
    while (isWithinMapBounds(walker)) {
        if (polygon.has(walker.hash)) crossings++;
        walker[axis] += step;
    }

    const inside = (crossings % 2) === 1;
    isInsidePolygonCache.set(key, inside);
    return inside;
};
