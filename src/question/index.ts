import inquirer, { Answers, CheckboxQuestion, Question } from 'inquirer';
import { AssignedItem, Item, Options } from '../types.js';
import * as utils from './utils.js';
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

export function showHeader(header: string): void {
  // eslint-disable-next-line no-console
  console.log(header);
}

export async function askAnswers(questions: Question[]) {
  return inquirer.prompt(questions);
}

export function applyAnswers(items: Item[], answers: Answers): AssignedItem[] {
  return items.map((item) => {
    const name = utils.sanitizeName(item.name);
    const owners = answers[name];
    return { ...item, owners };
  });
}
