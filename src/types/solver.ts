export type Solver = () => void | Promise<void>;
export interface SolverImport {
    solver: Solver;
}
