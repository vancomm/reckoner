function range(stop: number): number[];
function range(start: number, stop: number): number[];
function range(start: number, stop: number, step: number): number[];
function range(first: number, second?: number, third?: number): number[] {
    if (!second) {
        const stop = first;
        return [...Array(stop).keys()];
    }
    if (!third) {
        const [start, stop] = [first, second];
        if (stop < start) throw new Error('Invalid argument!');
        return [...Array(stop - start).keys()].map((i) => i + start);
    }
    const [start, stop, step] = [first, second, third];
    const n = Math.ceil((stop - start) / step);
    return [...Array(n).keys()].map((i) => start + i * step);
}

export default range;
