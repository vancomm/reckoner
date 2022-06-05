export default function parseItemsJSON(raw: string): Item[] {
  const data = JSON.parse(raw);
  const items: Item[] = data[0].ticket.document.receipt.items;
  return items;
}