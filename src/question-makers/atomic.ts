import { CheckboxQuestion } from 'inquirer';
import { Item } from '../types.js';
import { makeCheckboxQuestion } from './make-checkbox.js';

export default function atomic(item: Item, choices: string[]): CheckboxQuestion {
  const { name, quantity } = item;
  const price = item.price / 100;
  const moreThanOne = (quantity === 1);
  const quantityText = moreThanOne
    ? ''
    : `\t${quantity}`;
  const sumText = moreThanOne
    ? ''
    : `\t${item.sum / 100} RUB`;

  const message = `\t${name}\nPrice:\t${price} RUB${quantityText}${sumText}\n`;

  return makeCheckboxQuestion(name, message, choices);
}
