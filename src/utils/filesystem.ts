import path from "node:path";
import url from "node:url";
import fs from 'node:fs';
import isBlank from "voca/is_blank.js";
import padLeft from "voca/pad_left.js";

/**
 * Get the path to a given day's puzzle directory
 */
export const puzzlePath = (day: number) => path.join(
    path.dirname(url.fileURLToPath(import.meta.url)), '..', 'puzzles', padLeft(day.toString(), 2, "0") ?? ''
);

/**
 * Get the path to a given day's puzzle input file
 *
 */
export const puzzleInput = (day: number, filename: string = 'input.txt') => path.join(puzzlePath(day), filename);

/**
 * Read file content as a string
 */
export const readFile = (filepath: string) =>
    fs.readFileSync(filepath, {
        encoding: 'utf-8',
        flag: 'r'
    });

/**
 * Read file content as an array of lines
 */
export const readLines = (filepath: string, filterBlanks: boolean = false): string[] => {
    let result = readFile(filepath).split("\n");
    return filterBlanks ? result.filter(line => !isBlank(line)) : result;
};

export const writeFile = (filepath: string, data: string) =>
    fs.writeFileSync(filepath, data, {
        encoding: 'utf-8',
        flag: 'w'
    });

export const writeJson = (filepath: string, value: unknown, pretty: boolean = false) => {
    const json = JSON.stringify(value, undefined, pretty ? " " : undefined);
    fs.writeFileSync(filepath, json, {
        encoding: 'utf-8',
        flag: 'w'
    });
}

export const writePrettyJson = (filepath: string, value: unknown) => writeJson(filepath, value, true);
