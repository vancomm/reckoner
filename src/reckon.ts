import { readFile } from 'fs/promises';
import inquirer, { CheckboxQuestion } from 'inquirer';
import getParser from './parsers/index.js';
import getFormatter from './formatters/index.js';
import { AssignedItem, Item, Options } from './types.js';

async function readUsers(filepath: string): Promise<string[]> {
  const raw = await readFile(filepath);
  const parse = getParser(filepath);
  return parse(raw.toString());
}

async function readItems(filepath: string, options: Options): Promise<Item[]> {
  const { merge } = options;

  const raw = await readFile(filepath);
  const parse = getParser(filepath);
  const data = parse(raw.toString());

  const { items } = data[0].ticket.document.receipt;

  if (!merge) return items;

  return items.reduce((acc: any[], item: Item) => {
    const index = acc.findIndex((i) => i.name === item.name);
    if (index === -1) return [...acc, item];
    acc[index].quantity += item.quantity;
    acc[index].sum = Math.round(acc[index].quantity * acc[index].price);
    return acc;
  }, []);
}

function sanitizeName(name: string): string {
  return name.replaceAll('.', '·');
}

function getQuestion(item: Item, choices: string[], detailed: boolean): CheckboxQuestion {
  const { name, quantity } = item;
  const price = item.price / 100;
  const moreThanOne = (quantity === 1);
  const quantityText = moreThanOne
    ? ''
    : `Quantity:\t${quantity}`;
  const sumText = moreThanOne
    ? ''
    : `Sum:\t(${item.sum / 100}RUB)`;

  const message = (detailed)
    ? `\t${name}\nPrice:\t${price} RUB\n${quantityText}\n${sumText}`
    : `${quantity} x ${name}`;

  return {
    type: 'checkbox',
    name: sanitizeName(item.name),
    message,
    choices,
    validate: (answers: any[]) => (answers.length > 0 ? true : 'You must select at least one option!'),
  };
};

async function assignItems(items: Item[], users: string[], options: Options): Promise<AssignedItem[]> {
  const { detailed } = options;

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

function getOutput(items: AssignedItem[], options: Options): string {
  const { format } = options;

  return (getFormatter(format))(items);
}

export default async function reckon(receiptPath: string, userlistPath: string, options: Options): Promise<string> {
  const items = await readItems(receiptPath, options);

  const users = await readUsers(userlistPath);

  const assignedItems = await assignItems(items, users, options);

  const output = getOutput(assignedItems, options);

  return (output);
}
