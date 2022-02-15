import { readFile } from 'fs/promises';
import inquirer from 'inquirer';
import reckon from './reckon.js';
import format from './format.js';

async function getUsers() {
  return ['Vanek', 'Zhenek'];
}

async function getData() {
  const path = '/home/vancomm/reckoner/file.json';
  const data = await readFile(path);
  return JSON.parse(data);
}

function getAnswers(users, items) {
  const questions = items.map((item) => ({
    type: 'checkbox',
    name: item.name.replaceAll('.', '·'),
    message: `${item.name}\nWhose item is this?`,
    choices: users,
    validate: (answers) => (answers.length > 0 ? true : 'You must select at least one option!'),
  }));
  return inquirer.prompt(questions);
}

export default async function cli() {
  const users = await getUsers();

  const data = await getData();

  const result = await reckon(users, data, getAnswers);

  const output = format(result);

  console.log(output);
}
