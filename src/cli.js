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
    .action(async ({ receipt, userlist }) => {
      await reckon(receipt, userlist)
        .then(console.log)
        .catch((err) => console.log(err.message));
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
