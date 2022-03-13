export interface Options {
  merge: boolean,
  detailed: boolean,
  style: 'table' | 'atomic' | 'minimal',
  format: 'short',
}

export interface Item {
  quantity: number,
  productType: number,
  nds: number,
  price: number,
  paymentType: number,
  name: string,
  sum: number,
}

export interface AssignedItem extends Item {
  owners: string[],
}
