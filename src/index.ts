import { Command } from "commander";
import padLeft from "voca/pad_left";
import { SolverImport } from "#/types/solver.ts";

const app = new Command();

app.argument(
        "<day>",
        "Number of the day for which the puzzle must be solved. Can be one of 1 to 12"
    ).argument(
        "<part>",
        "Part to be solved, Can be 1 or 2"
    ).action(async (dayStr: string, partStr: string) => {
        const day = parseInt(dayStr)
        if (!isFinite(day) || ((day < 1) || (day > 12)))
            throw new RangeError(`Invalid day value "${day}"`);

        const part = parseInt(partStr);
        if ((part < 1) || (part > 2))
            throw new RangeError(`Invalid part value "${part}"`);

        dayStr = padLeft(day.toString(), 2, "0");
        partStr = padLeft(part.toString(), 2, "0");

        const solver: SolverImport = await import(`./${dayStr}/${dayStr}_${partStr}.ts`);
        solver.solver();
    }).parse();
