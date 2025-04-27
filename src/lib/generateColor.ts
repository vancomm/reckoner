import scale from './scale';

const scaleSinToColor = scale(0, 1, 128, 255);

const sin = Math.sin;

export default function generateColor(seed: number, saturation = 1, b = 1, c = 1): string {
    const color = Array(3)
        .fill(seed)
        .map((s, i) => saturation * sin((i + 1) * b * (s + c)))
        .map(scaleSinToColor)
        .map(Math.round)
        .map((n) => n.toString(16))
        .join('');
    return `#${color}`;
}
