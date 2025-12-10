
export class DisjointSet<T> {
    #parent = new Map<T, T>();
    #rank = new Map<T, number>();

    constructor (items: T[] = []) {
        for (const item of items) this.makeSet(item);
    }

    public makeSet(root: T): this {
        if (this.find(root) !== null)
            throw new RangeError("This value is already part of an existing subset");
        this.#parent.set(root, root);
        this.#rank.set(root, 0);
        return this;
    }

    public find(item: T): T | null {
        const parent = this.#parent.get(item);
        if (parent === undefined) return null;

        if (item === parent) return item;

        const root = this.find(parent);
        if (root === null) return null;

        this.#parent.set(item, root);

        return root;
    }

    public union(a: T, b: T): this {
        const rootA = this.find(a), rootB = this.find(b);
        if ((rootA === null) || (rootB === null))
            throw new RangeError("One or both values do not exist in any existing subsets");

        if (rootA !== rootB) {
            const rankA = this.#rank.get(a), rankB = this.#rank.get(b);
            if ((rankA === undefined) || (rankB === undefined))
                throw new Error("Something went seriously wrong");

            if (rankA < rankB) {
                this.#parent.set(rootA, rootB);
            } else if (rankB < rankA) {
                this.#parent.set(rootB, rootA);
            } else {
                this.#parent.set(rootB, rootA);
                this.#rank.set(rootA, rankA + 1);
            }
        }
        return this;
    }

    public areInSameSet(a: T, b: T): boolean {
        return this.find(a) === this.find(b);
    }

    public subset(item: T): Set<T> {
        const root = this.find(item);
        if (root === null)
            throw new RangeError("This value is not part of any existing subset");

        const result = new Set<T>();
        for (const [child, _] of this.#parent) {
            if (this.find(child) === root) result.add(child);
        }
        return result;
    }

    public subsets(): Map<T,Set<T>> {
        const result = new Map<T,Set<T>>();
        for (const [child, parent] of this.#parent) {
            if (child !== parent) continue;
            result.set(parent, this.subset(parent));
        }
        return result;
    }
}
