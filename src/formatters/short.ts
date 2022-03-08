import { AssignedItem } from '../types.js';

export default function short(items: AssignedItem[]) {
  const userTotals = items.reduce((acc: { [key: string]: number }, { owners, sum }) => {
    const amount = sum / owners.length;
    owners.forEach((owner) => {
      acc[owner] = (acc[owner] ?? 0) + amount;
    });
    return acc;
  }, {});

  const output = Object.entries(userTotals)
    .map(([user, total]) => `${user}:\t${total as number / 100}`)
    .join('\n');

  return output;
}
