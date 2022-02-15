const getDistinctItems = (items) => items.reduce((acc, item) => {
  const index = acc.findIndex((i) => i.name === item.name);
  if (index === -1) return [...acc, item];
  acc[index].quantity += item.quantity;
  acc[index].sum = Math.round(acc[index].quantity * acc[index].price);
  return acc;
}, []);

const getTotal = (items, user) => items.reduce((acc, { sum, owners }) => {
  if (!owners.includes(user)) return acc;
  return acc + sum / owners.length;
}, 0);

export default async function reckon(users, data, getAnswers) {
  const items = getDistinctItems(data[0].ticket.document.receipt.items);

  /* getAnswers function must return an object of the following format:
      {
        'item1': [ 'userA', 'userB' ],
        'item2': [ 'userA' ],
        'item3': [ 'userB' ],
        ...
      }
  */
  const answers = await getAnswers(users, items);

  const assignedItems = items.map((item) => {
    const owners = answers[item.name.replaceAll('.', '·')];
    return { ...item, owners };
  });

  const totals = users.map((user) => ({
    user,
    total: getTotal(assignedItems, user),
  }));

  return totals;
}
