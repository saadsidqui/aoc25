export const chunk = (v: string, size: number, strictEqualLength: boolean = false): string[] => {
  if (size <= 0) throw new RangeError(`Invalid chunking size ${size}`);
  if (strictEqualLength && ((v.length % size) !== 0))
    throw new RangeError("Cannot product strictly equal length chunks for the given arguments");
  return v.match(new RegExp(`.{1,${size}}`, 'g')) || [];
}
