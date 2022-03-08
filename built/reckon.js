var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFile } from 'fs/promises';
import inquirer from 'inquirer';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';
function readUsers(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const raw = yield readFile(path);
        const parse = getParser(path);
        return parse(raw.toString());
    });
}
function readItems(path, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { merge } = options;
        const raw = yield readFile(path);
        const parse = getParser(path);
        const data = parse(raw.toString());
        const { items } = data[0].ticket.document.receipt;
        if (!merge)
            return items;
        return items.reduce((acc, item) => {
            const index = acc.findIndex((i) => i.name === item.name);
            if (index === -1)
                return [...acc, item];
            acc[index].quantity += item.quantity;
            acc[index].sum = Math.round(acc[index].quantity * acc[index].price);
            return acc;
        }, []);
    });
}
function sanitizeName(name) {
    return name.replaceAll('.', '·');
}
const getQuestion = (item, choices, detailed) => {
    const { name, quantity } = item;
    const price = item.price / 100;
    const sumText = (quantity === 1)
        ? ''
        : ` (${item.sum / 100}RUB)`;
    const message = (detailed) ? `${quantity} x ${name} @ ${price}RUB${sumText}\n` : `${quantity} x ${name}\n`;
    return {
        type: 'checkbox',
        name: sanitizeName(item.name),
        message,
        choices,
        validate: (answers) => (answers.length > 0 ? true : 'You must select at least one option!'),
    };
};
function assignItems(items, users, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { detailed } = options;
        const questions = items.map((item) => getQuestion(item, users, detailed));
        // eslint-disable-next-line no-console
        console.log('Items:');
        const itemUserMap = yield inquirer.prompt(questions);
        return items.map((item) => {
            const name = sanitizeName(item.name);
            const owners = itemUserMap[name];
            return Object.assign(Object.assign({}, item), { owners });
        });
    });
}
function getOutput(items, options) {
    const { format } = options;
    return (getFormatter(format))(items);
}
export default function reckon(receiptPath, userlistPath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = yield readItems(receiptPath, options);
        const users = yield readUsers(userlistPath);
        const assignedItems = yield assignItems(items, users, options);
        const output = getOutput(assignedItems, options);
        return (output);
    });
}
