export default function formatMoney(value: number) {
    return (Math.round(+(value / 1e2).toFixed(3) * 1e3) / 1e3).toFixed(2);
}
