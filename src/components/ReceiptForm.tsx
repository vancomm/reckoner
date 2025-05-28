import { Result } from 'neverthrow';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { UniqueItem, receiptDocumentSchema } from '@/lib/receiptDocument';

import testfile from '../2025-05-27T19-30.json';

interface ReceiptFormProps {
    receiptItems: UniqueItem[];
    setReceiptItems: React.Dispatch<React.SetStateAction<UniqueItem[]>>;
}

export default function ReceiptForm({ receiptItems, setReceiptItems }: ReceiptFormProps) {
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputFile = e.target.files?.[0];
        if (!inputFile) return;

        if (inputFile.type !== 'application/json') {
            setReceiptItems([]);
            setErrorMessage('Uploaded file must be of JSON format');
            return;
        }

        const text = await inputFile.text();
        const jsonParseResult = Result.fromThrowable(JSON.parse)(text);
        if (jsonParseResult.isErr()) {
            console.error(jsonParseResult.error);
            setReceiptItems([]);
            setErrorMessage('Invalid receipt');
            return;
        }

        const parseResult = Result.fromThrowable(receiptDocumentSchema.parse)(jsonParseResult.value);
        if (parseResult.isErr()) {
            console.error(parseResult.error);
            setReceiptItems([]);
            setErrorMessage('Invalid receipt');
            return;
        }

        const receiptDocument = parseResult.value;
        const items = receiptDocument[0].ticket.document.receipt.items.map((item, index) => ({
            ...item,
            index,
        }));
        setReceiptItems(items);
        setErrorMessage('');
    };

    const handleLoadDemo = () => {
        const parseResult = Result.fromThrowable(receiptDocumentSchema.parse)(testfile);
        if (parseResult.isOk()) {
            const receiptDocument = parseResult.value;
            const items = receiptDocument[0].ticket.document.receipt.items.map((item, index) => ({
                ...item,
                index,
            }));
            setReceiptItems(items);
            setErrorMessage('');
        } else {
            console.error(parseResult.error);
        }
    };

    return (
        <>
            <h3 className="ml-1">Загрузите JSON с данными о вашем чеке:</h3>
            <div className="flex flex-col overflow-clip rounded-lg border-2 border-transparent bg-[rgba(0,0,0,0.3)]">
                <label htmlFor="receipt-file" className="cursor-pointer px-2 py-3 text-sm">
                    <input id="receipt-file" className="hidden" type="file" accept="application/json" onChange={handleUploadFile} />
                    Выберите файл...
                </label>
                <hr />
                <button className="cursor-pointer px-2 pt-1 pb-2 text-start text-sm font-bold" onClick={handleLoadDemo}>
                    Загрузить демо
                </button>
            </div>

            {(errorMessage || !!receiptItems.length) && (
                <div className={twMerge('px-2 text-sm', receiptItems.length ? '' : '')}>
                    {errorMessage ? `✘ ${errorMessage}` : !!receiptItems.length && `✔ найдено позиций: ${receiptItems.length}`}
                </div>
            )}
        </>
    );
}
