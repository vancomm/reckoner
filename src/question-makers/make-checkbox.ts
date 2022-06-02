import { CheckboxQuestion } from 'inquirer';

export function makeCheckboxQuestion(name: string, message: string, choices: string[]): CheckboxQuestion {
	const validate = (answers: any[]) => (answers.length > 0 ? true : 'You must select at least one option!');
	return {
		type: 'checkbox',
		name,
		message: message,
		choices,
		validate,
		prefix: "",
	};
}
