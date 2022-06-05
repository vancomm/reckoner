/* eslint-disable no-console */
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { program } from 'commander';
import yaml from 'js-yaml';
import app from './app.js';

const defaultReceiptPath = './file.json';
const defaultUserListPath = './users.yml';

async function createUserlist(users: string, path: string) {
  const content = yaml.dump(users);
  await writeFile(path, content);
}

export default () => {

  program
    .command('users')
    .description('create a list of users')
    .argument('<users...>')
    .option('-p, --path <path>', 'path to new list', './users.yml')
    .action(async (users, { path }) => {
      await createUserlist(users, path)
        .then(() => console.log(`Created a userlist at ${path}!`))
        .catch((err) => console.log(err));
    });

  program
    .option('-r, --receipt <path>', 'path to receipt', defaultReceiptPath)
    .option('-u, --userlist <path>', 'path to list of users', defaultUserListPath)
    .option('-f, --format <type>', 'output format', 'short')
    .option('-s, --style <type>', 'style for receipt item output', 'table')
    .option('--merge', 'merge identical items', true)
    .option('--no-merge', 'spread identical items into separate questions')
    .action(async (options) => {
      const {
        receipt: receiptPath,
        userlist: userlistPath,
        format,
        style,
        merge
      }: Options = options;

      if (!existsSync(receiptPath)) {
        console.log(`Receipt not found at ${receiptPath}!`);
        return;
      }

      if (!existsSync(userlistPath)) {
        console.log(`Userlist not found at ${userlistPath}!\nTo create a userlist type\n\treckon users <...users>`);
        return;
      }

      await app(receiptPath, userlistPath, { format, style, merge })
        .then(console.log)
      // .catch(({ message }) => console.log(message));
    });

  program.parse();
};
