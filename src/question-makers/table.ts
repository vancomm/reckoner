import { Item } from '../types.js';
import { makeCheckboxQuestion } from './make-checkbox.js';

const NAME_LENGTH = 32;

function splitName(name: string): [string, string | undefined] {
  if (name.length < NAME_LENGTH) return [name, undefined];
  const spaceIndex = name.slice(0, NAME_LENGTH - 1).lastIndexOf(' ');
  const first = name.slice(0, spaceIndex);
  const second = name.slice(spaceIndex);
  return [first, second];
}

export default function table(item: Item, choices: string[]) {
  const { name, quantity } = item;

  const [name1, name2] = splitName(name);
  const nameTextTop = `\t${name1.padEnd(NAME_LENGTH, ' ')}`;
  const nameTextBtm = name2
    ? `\n\t${name2.trimStart()}`
    : '';

  const price = `${(item.price / 100).toFixed(2)} RUB`;

  const moreThanOne = (quantity > 1);

  const quantityText = moreThanOne
    ? `\t${quantity}`
    : '';

  const sumText = moreThanOne
    ? `\t${item.sum / 100} RUB`
    : '';

  const message = `${nameTextTop}${price}${quantityText}${sumText}${nameTextBtm}\n`;

  return makeCheckboxQuestion(name, message, choices);
}
