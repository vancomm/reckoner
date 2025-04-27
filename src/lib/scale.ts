export default function scale(r_min: number, r_max: number, t_min: number, t_max: number) {
    return (x: number) => ((x - r_min) / (r_max - r_min)) * (t_max - t_min) + t_min;
}
