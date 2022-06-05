import { readFile } from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import inquirer, { CheckboxQuestion } from 'inquirer';
import parseItemsHTML from './parsers/parse-items-html.js';
import parseItemsJSON from './parsers/parse-items-json.js';
import minimal from './question-makers/minimal.js';
import simple from './question-makers/simple.js';
import table from './question-makers/table.js';

function range(stop: number): number[];
function range(start: number, stop: number): number[];
function range(start: number, stop: number, step: number): number[];
function range(first: number, second?: number, third?: number): number[] {
	if (!second) {
		const stop = first;
		return [...Array(stop).keys()];
	}
	if (!third) {
		const [start, stop] = [first, second];
		if (stop < start) throw new Error('Invalid argument!');
		return [...Array(stop - start).keys()]
			.map((i) => i + start);
	}
	const [start, stop, step] = [first, second, third];
	const n = Math.ceil((stop - start) / step);
	return [...Array(n).keys()]
		.map((i) => start + i * step)
}

function pipe<T>(...funcs: ((arg: T) => T)[]) {
	return (first: T) => funcs.reduce((x, func) => func(x), first);
}

function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, any> {
	return obj.hasOwnProperty(prop);
}

const receiptParsers: Record<string, ItemParser> = {
	'.json': parseItemsJSON,
	'.html': parseItemsHTML,
}

const userlistParsers: Record<string, UserParser> = {
	'.json': (raw: string) => <string[]>JSON.parse(raw),
	'.yml': (raw: string) => <string[]>yaml.load(raw),
	'.yaml': (raw: string) => <string[]>yaml.load(raw),
}

const questionMakers: Record<Options['style'], (item: Item, choices: string[]) => CheckboxQuestion> = {
	'minimal': minimal,
	'simple': simple,
	'table': table,
};

const headers: Record<Options['style'], string> = {
	'minimal': 'Items:',
	'simple': 'Items:',
	'table': '\tName:\t\t\t\tPrice:\t\tQty:\tSum:',
}

function mergeItems(items: Item[]): Item[] {
	return items.reduce((acc: Item[], item) => {
		const index = acc.findIndex((i) => i.name === item.name);
		if (index === -1) return [...acc, item];
		acc[index].quantity += item.quantity;
		acc[index].sum = Math.round(acc[index].quantity * acc[index].price);
		return acc;
	}, []);
}

function spreadItems(items: Item[]): Item[] {
	return items.reduce((acc: Item[], item) => {
		if (item.quantity === 1 || !Number.isInteger(item.quantity)) return [...acc, item];
		console.log(item);
		const duplicates = range(item.quantity).map((i) => { return { ...item, name: `${item.name} (${i + 1}/${item.quantity})`, quantity: 1, sum: item.price } });
		console.log(duplicates);
		return [...acc, ...duplicates];
	}, []);
}

export default async function app(
	receiptPath: string,
	userlistPath: string,
	options: Pick<Options, 'merge' | 'format' | 'style'>,
): Promise<string> {
	const receiptBuffer = await readFile(receiptPath);

	const receiptExt = path.extname(receiptPath).toLowerCase();

	if (!hasOwnProperty(receiptParsers, receiptExt)) return `Bad receipt extension (${receiptExt})`;

	const parseReceipt = <ItemParser>receiptParsers[receiptExt];

	const modifyItems = options.merge ? mergeItems : pipe(mergeItems, spreadItems);

	const items = modifyItems(parseReceipt(receiptBuffer.toString()));


	const userlistBuffer = await readFile(userlistPath);

	const userlistExt = path.extname(userlistPath).toLowerCase();

	if (!hasOwnProperty(userlistParsers, userlistExt)) return `Bad userlist extension (${userlistExt})`;

	const parseUserlist = <UserParser>userlistParsers[userlistExt];

	const userlist = parseUserlist(userlistBuffer.toString());


	const sanitizedItems = items.map((item) => { return { ...item, ...{ name: item.name.replaceAll('.', '') } } });

	const makeQuestion = questionMakers[options.style];

	const questions = sanitizedItems.map((item) => makeQuestion(item, userlist));

	console.log(headers[options.style]);

	const answers = await inquirer.prompt(questions);

	const assignedItems: AssignedItem[] = sanitizedItems.map((item) => { return { ...item, ...{ owners: answers[item.name] } } });


	const counters = Object.fromEntries(userlist.map((name) => [name, 0]));

	assignedItems.forEach(({ sum, owners }) => {
		const share = sum / owners.length;
		owners.forEach((owner) => {
			counters[owner] += share;
		});
	});

	const result = Object.entries(counters)
		.filter(([, sum]) => sum != 0)
		.map(([name, sum]) => `${name}\t${(sum / 100).toFixed(2)}₽`)
		.join('\n')

	return result + '\nSum:\t' + Object.entries(counters).reduce((acc, [, sum]) => acc + sum / 100, 0).toFixed(2) + '₽';
}

