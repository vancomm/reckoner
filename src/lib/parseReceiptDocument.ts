import Ajv from 'ajv';
import { Result, err, ok } from 'neverthrow';

import { ReceiptData } from '../contexts/AppStateContext';
import ReceiptDocument, { Item } from '../types/ReceiptDocument';
import receiptSchema from './ReceiptSchema.json';

export interface UniqueItem extends Item {
    index: number;
}

const ajv = new Ajv();

const validate = ajv.compile<ReceiptDocument>(receiptSchema);

export default function parseReceipt(json: string): Result<ReceiptData, string> {
    const data = Result.fromThrowable(JSON.parse)(json);
    if (data.isErr()) {
        console.error(data.error);
        return err('Некорректный формат файла');
    }

    if (!validate(data.value)) return err('Bad JSON shape');

    const items = data.value[0].ticket.document.receipt.items;

    const uniqueItems: UniqueItem[] = items.map((item, index) => ({
        ...item,
        index,
    }));

    const value: ReceiptData = { items: uniqueItems };

    return ok(value);
}
