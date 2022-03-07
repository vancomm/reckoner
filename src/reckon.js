import inquirer from 'inquirer';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import getParser from './parsers.js';

async function getData(path) {
  if (!existsSync(path)) throw new Error(`Receipt not found at ${path}!`);
  const data = await readFile(path);
  const parse = getParser(path);
  return parse(data);
}

async function getUsers(path) {
  const defaultUsers = ['Vanek', 'Zhenek'];
  if (!existsSync(path)) {
    console.log(`Userlist not found at ${path}, using the default list:\n  ${defaultUsers.join('\n  ')}`);
    return defaultUsers;
  }
  const data = await readFile(path);
  const parse = getParser(path);
  return parse(data);
}

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

const sanitizeName = (name) => name.replaceAll('.', '·');

async function getAssignedItems(items, users) {
  const questions = items.map((item) => ({
    type: 'checkbox',
    name: sanitizeName(item.name),
    message: `${item.name} x ${item.quantity}\nWhose item is this?`,
    choices: users,
    validate: (answers) => (answers.length > 0 ? true : 'You must select at least one option!'),
  }));

  console.log('Items:');
  const itemUserMap = await inquirer.prompt(questions);

  return items.map((item) => {
    const name = sanitizeName(item.name);
    const owners = itemUserMap[name];
    return { ...item, owners };
  });
}

function format(totals) {
  return totals.map(({ user, total }) => `${user}:\t${total / 100}`)
    .join('\n');
}

export default async function reckon(receiptPath, userlistPath) {
  const data = await getData(receiptPath);

  const users = await getUsers(userlistPath);

  const items = getDistinctItems(data[0].ticket.document.receipt.items);

  const assignedItems = await getAssignedItems(items, users);

  const result = users.map((user) => ({
    user,
    total: getTotal(assignedItems, user),
  }));

  const output = format(result);

  return (output);
}
