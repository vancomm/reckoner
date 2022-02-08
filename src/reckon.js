import inquirer from 'inquirer';
import * as data from '../file.json';

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

const printTotal = (totals) => {
  totals.forEach(({ user, total }) => console.log(`${user}:\t${total / 100}`));
};

export default async () => {
  const users = ['Vanek', 'Zhenek'];

  const items = getDistinctItems(data.default[0].ticket.document.receipt.items);

  const questions = items.map((item) => ({
    type: 'checkbox',
    name: item.name.replaceAll('.', '·'),
    message: `${item.name}\nWhose item is this?`,
    choices: users,
    validate: (answers) => (answers.length > 0 ? true : 'You must select at least one option!'),
  }));

  const answers = await inquirer.prompt(questions);

  const assignedItems = items.map((item) => {
    const owners = answers[item.name.replaceAll('.', '·')];
    return { ...item, owners };
  });

  const totals = users.map((user) => ({
    user,
    total: getTotal(assignedItems, user),
  }));

  printTotal(totals);
};
