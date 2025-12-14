export type Device = {
    name: string,
    outputs: string[],
};

export const parseInput = (lines: string[]): Map<string, Device> => {
    const result = new Map<string, Device>();

    for (const l of lines) {
        const [self, remainder] = l.split(":").map(p => p.trim());
        const outputs = remainder.split(" ").map(p => p.trim());

        const selfDevice = result.get(self) ?? {
            name: self,
            outputs: [],
        };
        for (const output of outputs) {
            const outputDevice = result.get(output) ?? {
                name: output,
                outputs: [],
            };
            selfDevice.outputs.push(output);
            result.set(output, outputDevice);
        }
        result.set(self, selfDevice);
    }
    return result;
};
