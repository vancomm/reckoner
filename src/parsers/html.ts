import * as cheerio from 'cheerio';
import { Item } from '../types.js';

export function fromHTML(raw: string) {
  const $ = cheerio.load(raw);

  const rows = $('body > div > table > tbody > tr');

  const itemRows = rows.filter((i, el) => {
    return $(el).children('td').length === 5;
  });

  let items: Item[] = [];
  itemRows.each((i, el) => {
    const [, nameEl, priceEl, quantityEl, sumEl] = $(el).children('td');
    const name = $(nameEl).text();
    const price = Number($(priceEl).text().replace('.', ''));
    const quantity = Number($(quantityEl).text().split('.')[0]);
    const sum = Number($(sumEl).text().replace('.', ''));
    const item = {
      name,
      price,
      quantity,
      sum,
      productType: -1,  // html receipts
      nds: -1,          // do not contain 
      paymentType: -1,  // this data (yet)
    };
    items.push(item);
  })

  // emulation of a JSON receipt
  const data = [{ ticket: { document: { receipt: { items } } } }];

  return data;
}
