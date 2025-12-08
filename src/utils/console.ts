import pc from "picocolors";

type Printable = object | string | number | null | undefined;

const serializeIfNeeded = (v: Printable): Exclude<Printable, object> =>
    (typeof v != "object") ? v : JSON.stringify(v, undefined, " ");

export const say = (v: Printable) => serializeIfNeeded(v);
export const shout = (v: Printable) => pc.bold(pc.white(serializeIfNeeded(v)));
export const whisper = (v: Printable) => pc.italic(pc.dim(serializeIfNeeded(v)));
export const error = (v: Printable) => pc.red(serializeIfNeeded(v));
export const warning = (v: Printable) => pc.yellow(serializeIfNeeded(v));
export const success = (v: Printable) => pc.green(serializeIfNeeded(v));
export const info = (v: Printable) => pc.cyan(serializeIfNeeded(v));
