import { readFile } from 'fs/promises';
import getParser from './parsers/index.js';
import getFormatter from './formatters/index.js';
import { AssignedItem, Item, Options } from './types.js';
import {
  applyAnswers, askAnswers, getQuestionMaker, getQuestionsHeader, showHeader,
} from './question/index.js';

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

async function assignItems(items: Item[], users: string[], options: Options): Promise<AssignedItem[]> {
  const { style } = options;

  const header = getQuestionsHeader(style);

  const getQuestion = getQuestionMaker(style);

  const questions = items.map((item) => getQuestion(item, users));

  showHeader(header);

  const answers = await askAnswers(questions);

  const assignedItems = applyAnswers(items, answers);

  return assignedItems;
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
