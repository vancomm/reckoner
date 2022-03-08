import { readFile } from 'fs/promises';
import inquirer from 'inquirer';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';

async function readUsers(path) {
  const raw = await readFile(path);
  const parse = getParser(path);
  return parse(raw);
}

async function readItems(path, { merge }) {
  const raw = await readFile(path);
  const parse = getParser(path);
  const data = parse(raw);
  const { items } = data[0].ticket.document.receipt;

  if (!merge) return items;

  return items.reduce((acc, item) => {
    const index = acc.findIndex((i) => i.name === item.name);
    if (index === -1) return [...acc, item];
    acc[index].quantity += item.quantity;
    acc[index].sum = Math.round(acc[index].quantity * acc[index].price);
    return acc;
  }, []);
}

const sanitizeName = (name) => name.replaceAll('.', '·');

const getQuestion = (item, choices, detailed) => {
  const { name, quantity } = item;
  const price = item.price / 100;
  const sumText = (quantity === 1)
    ? ''
    : ` (${item.sum / 100}RUB)`;
  const message = (detailed) ? `${quantity} x ${name} @ ${price}RUB${sumText}\n` : `${quantity} x ${name}\n`;

  return {
    type: 'checkbox',
    name: sanitizeName(item.name),
    message,
    choices,
    validate: (answers) => (answers.length > 0 ? true : 'You must select at least one option!'),
  };
};

async function assignItems(items, users, { detailed }) {
  const questions = items.map((item) => getQuestion(item, users, detailed));

  // eslint-disable-next-line no-console
  console.log('Items:');
  const itemUserMap = await inquirer.prompt(questions);

  return items.map((item) => {
    const name = sanitizeName(item.name);
    const owners = itemUserMap[name];
    return { ...item, owners };
  });
}

function getOutput(items, { format }) {
  return (getFormatter(format))(items);
}

/**
 *
 * @param {string} receiptPath Path to file containing a receipt
 * @param {string} userlistPath Path to file containing a list of users
 * @param {boolean} options.merge Option to merge identical items
 * @param {boolean} options.detailed Option to show a detailed description of item
 * @param {string} options.format Option to choose a style of output format
 * @returns
 */
export default async function reckon(receiptPath, userlistPath, options) {
  const items = await readItems(receiptPath, options);

  const users = await readUsers(userlistPath);

  const assignedItems = await assignItems(items, users, options);

  const output = getOutput(assignedItems, options);

  return (output);
}
