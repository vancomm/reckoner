export function sanitizeName(name: string): string {
	return name.replaceAll('.', '·');
}