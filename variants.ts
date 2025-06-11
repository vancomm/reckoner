import fsp from 'node:fs/promises';
import * as path from 'node:path';

async function parseCSSVariants() {
    const variants: Array<string> = [];
    for await (const cssFile of fsp.glob(['*.css', './src/**/*.css'])) {
        const content = await fsp.readFile(cssFile, { encoding: 'utf-8' });
        variants.push(...content.split('\n').flatMap((x) => /^\s*\[data-variant=['"]([^'"]+)/.exec(x)?.[1] ?? []));
    }
    return variants;
}

export async function generateVariants() {
    const variants = await parseCSSVariants();
    const ts = `export const VARIANTS = [${variants.map((x) => `'${x}'`).join(', ')}] as const;`;
    await fsp.writeFile(path.join(import.meta.dirname, 'src/variants.gen.ts'), ts);
    return variants;
}
