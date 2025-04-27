function scale(r_min: number, r_max: number, t_min: number, t_max: number) {
    return function (x: number) {
        return ((x - r_min) / (r_max - r_min)) * (t_max - t_min) + t_min;
    };
}

const _scale = scale(0, 1, 128, 255);

export default function generateColor(seed: number, sat = 1, b = 1, c = 1): string {
    const color = [0, 1, 2]
        .map((i) => Math.round(_scale(sat * Math.sin((i + 1) * b * (seed + c)))).toString(16))
        .join('');
    return `#${color}`;
}
