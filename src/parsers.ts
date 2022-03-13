import path from 'path';
import * as cheerio from 'cheerio';
import yaml from 'js-yaml';
import { Item } from './types.js';

const fromJSON = JSON.parse;

const fromYAML = yaml.load;

function fromHTML(raw: string) {
  const $ = cheerio.load(raw);

  const rows = $('body > div > table > tbody > tr');

  const itemRows = rows.filter((i, el) => {
    return $(el).children('td').length === 5;
  });

  let items: Item[] = [];
  itemRows.each((i, el) => {
    const [, nameEl, priceEl, quantityEl, sumEl] = $(el).children('td');
    const price = Number($(priceEl).text().replace('.', ''));
    const quantity = Number($(quantityEl).text().split('.')[0]);
    const sum = Number($(sumEl).text().replace('.', ''));
    const item = {
      name: $(nameEl).text(),
      price,
      quantity,
      sum,
      productType: -1,
      nds: -1,
      paymentType: -1,
    };
    items.push(item);
  })

  // emulation of a JSON receipt
  const data = [{ ticket: { document: { receipt: { items } } } }];

  return data;
}

function getParser(filepath: string) {
  const ext = path.extname(filepath);

  if (ext === '.json') {
    return fromJSON;
  }
  if (ext === '.yaml' || ext === '.yml') {
    return fromYAML;
  }
  if (ext === '.html') {
    return fromHTML;
  }
  return (raw: string) => raw;
};

export default getParser;
