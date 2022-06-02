import inquirer, { Answers, CheckboxQuestion, Question } from 'inquirer';
import { AssignedItem, Item, Options } from '../types.js';
import { sanitizeName } from '../utils/index.js';
import atomic from './atomic.js';
import table from './table.js';
import minimal from './minimal.js';

export function getQuestionMaker(style: Options['style']): (item: Item, choices: string[]) => CheckboxQuestion {
  switch (style) {
    case 'minimal':
      return minimal;
    case 'atomic':
      return atomic;
    case 'table':
    default:
      return table;
  }
}

export function getQuestionsHeader(style: string): string {
  switch (style) {
    case 'minimal':
    case 'atomic':
      return 'Items:';
    case 'table':
    default:
      return '\tName:\t\t\t\tPrice:\t\tQty:\tSum:';
  }
}

export async function getAnswers(questions: Question[]) {
  return inquirer.prompt(questions);
}

export function applyAnswers(items: Item[], answers: Answers): AssignedItem[] {
  return items.map((item) => {
    const name = sanitizeName(item.name);
    const owners = answers[name];
    return { ...item, owners };
  });
}
