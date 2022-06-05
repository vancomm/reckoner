declare type Options = {
	receipt: string,
	userlist: string,
	merge: boolean,
	style: 'table' | 'simple' | 'minimal',
	format: 'short',
}

declare type Item = {
	quantity: number,
	productType: number,
	nds: number,
	price: number,
	paymentType: number,
	name: string,
	sum: number,
}

declare type ItemParser = (raw: string) => Item[];

declare type UserParser = (raw: string) => string[];

declare type AssignedItem = Item & { owners: string[] };

declare type QuestionMaker = (item: Item, choices: string[]) => CheckboxQuestion;
