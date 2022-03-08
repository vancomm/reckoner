var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/* eslint-disable no-console */
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { program } from 'commander';
import yaml from 'js-yaml';
import reckon from './reckon.js';
const defaultReceiptPath = './file.json';
const defaultUserListPath = './users.yml';
function createUserlist(users, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yaml.dump(users);
        yield writeFile(path, content);
    });
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
        .action((options) => __awaiter(void 0, void 0, void 0, function* () {
        const { receipt, userlist } = options, rest = __rest(options, ["receipt", "userlist"]);
        if (!existsSync(receipt)) {
            console.log(`Receipt not found at ${receipt}!`);
            return;
        }
        if (!existsSync(userlist)) {
            console.log(`Userlist not found at ${userlist}!\nTo create a userlist type\n\treckon users <...users>`);
            return;
        }
        yield reckon(receipt, userlist, rest)
            .then(console.log)
            .catch(console.log);
    }));
    program
        .command('users')
        .description('create a list of users')
        .argument('<users...>')
        .option('-p, --path <path>', 'path to new list', './users.yml')
        .action((users, { path }) => __awaiter(void 0, void 0, void 0, function* () {
        yield createUserlist(users, path)
            .then(() => console.log(`Created a userlist at ${path}!`))
            .catch((err) => console.log(err));
    }));
    program.parse();
};
