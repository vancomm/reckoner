import fsp from 'node:fs/promises';

export default async function parseCSSVariants() {
    const variants: Array<string> = [];
    for await (const cssFile of fsp.glob(['*.css', './src/**/*.css'])) {
        const content = await fsp.readFile(cssFile, { encoding: 'utf-8' });
        variants.push(...content.split('\n').flatMap((x) => /^\s*\[data-variant=['"]([^'"]+)/.exec(x)?.[1] ?? []));
    }
    return variants;
}
