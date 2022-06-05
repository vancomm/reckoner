import { CheckboxQuestion } from 'inquirer';
import makeCheckboxQuestion from './make-checkbox.js';

export default function minimal(item: Item, choices: string[]): CheckboxQuestion {
  const { name, quantity } = item;

  const message = `${quantity} x ${name}\n`;

  return makeCheckboxQuestion(name, message, choices);
}
