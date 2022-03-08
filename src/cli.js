/* eslint-disable no-console */
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { program } from 'commander';
import yaml from 'js-yaml';
import reckon from './reckon.js';

const defaultReceiptPath = './file.json';
const defaultUserListPath = './users.yml';

async function createUserlist(users, path) {
  const content = yaml.dump(users);
  await writeFile(path, content);
}

export default () => {
  program
    .option('-r, --receipt <path>', 'path to receipt', defaultReceiptPath)
    .option('-u, --userlist <path>', 'path to list of users', defaultUserListPath)
    .option('-f, --format <type>', 'output format', 'short')
    .option('--merge', 'merge identical items', true)
    .option('--no-merge', 'do not merge identical items')
    .option('--detailed', 'show detailed descriptions of items', true)
    .option('--no-detailed', 'do not show detailed descriptions of items')
    .action(async (options) => {
      const { receipt, userlist, ...rest } = options;
      if (!existsSync(receipt)) {
        console.log(`Receipt not found at ${receipt}!`);
        return;
      }
      if (!existsSync(userlist)) {
        console.log(`Userlist not found at ${userlist}!\nTo create a userlist type\n\treckon users <...users>`);
        return;
      }
      await reckon(receipt, userlist, rest)
        .then(console.log)
        .catch(console.log);
    });

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

  program.parse();
};
