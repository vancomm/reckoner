export default function short(items) {
    const userTotals = items.reduce((acc, { owners, sum }) => {
        const amount = sum / owners.length;
        owners.forEach((owner) => {
            var _a;
            acc[owner] = ((_a = acc[owner]) !== null && _a !== void 0 ? _a : 0) + amount;
        });
        return acc;
    }, {});
    const output = Object.entries(userTotals)
        .map(([user, total]) => `${user}:\t${total / 100}`)
        .join('\n');
    return output;
}
