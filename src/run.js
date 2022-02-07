import inquirer from 'inquirer';
import * as data from '../file.json';

const items = [...data.default[0].ticket.document.receipt.items].map((item) => ({ ...item, name: item.name.replaceAll('.', '·') }));

export default async () => {
  const questions = items.map((item) => ({
    type: 'checkbox',
    name: item.name.replaceAll('.', '·'),
    message: `${item.name}\nWhose is this?`,
    choices: ['Vanek', 'Zhenek'],
  }));
  const answers = await inquirer.prompt(questions);
  console.log(answers);
};
