import Ajv from 'ajv';

import { ReceiptData } from '../contexts/AppStateContext';
import ReceiptDocument, { Item } from '../types/ReceiptDocument';
import { Optional, makeFailed, makeSuccessful } from './Optional';
import receiptSchema from './ReceiptSchema.json';

export interface UniqueItem extends Item {
    index: number;
}

const ajv = new Ajv();

const validate = ajv.compile<ReceiptDocument>(receiptSchema);

export default function parseReceipt(json: string): Optional<ReceiptData> {
    const data = JSON.parse(json);

    if (!validate(data)) return makeFailed('Bad JSON shape');

    const items = data[0].ticket.document.receipt.items;

    const uniqueItems: UniqueItem[] = items.map((item, index) => ({
        ...item,
        index,
    }));

    const value: ReceiptData = { items: uniqueItems };

    return makeSuccessful(value);
}
