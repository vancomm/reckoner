import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useAppState } from '../contexts/AppStateContext';
import parseReceipt, { UniqueItem } from '../lib/parseReceiptDocument';
import testfile from '../test-file.json';

export default function ReceiptForm() {
    const [errorMessage, setErrorMessage] = React.useState('');
    const { receiptData, setReceiptData } = useAppState();

    return (
        <>
            <h3 className="ml-1">Загрузите JSON с данными о вашем чеке:</h3>
            <fieldset className="flex flex-col overflow-clip rounded-lg border-2 border-transparent bg-[rgba(0,0,0,0.3)]">
                <input
                    id="receipt-file"
                    className="cursor-pointer px-2 py-3 text-sm"
                    type="file"
                    accept="application/json"
                    onChange={async (e) => {
                        const inputFile = e.target.files?.[0];
                        if (!inputFile) return;
                        if (inputFile.type !== 'application/json') {
                            setReceiptData(undefined);
                            setErrorMessage('Uploaded file must be of JSON format');
                            return;
                        }
                        const content = await inputFile.text();
                        const receiptDataOption = parseReceipt(content);
                        if (receiptDataOption.isErr()) {
                            setReceiptData(undefined);
                            setErrorMessage(receiptDataOption.error);
                            return;
                        }

                        const { items } = receiptDataOption.value;
                        const uniqueItems: UniqueItem[] = items.map((item, index) => ({
                            ...item,
                            index,
                        }));
                        setReceiptData({ items: uniqueItems });
                        setErrorMessage('');
                    }}
                />
                <hr />
                <button
                    className="cursor-pointer px-2 pt-1 pb-2 text-start text-sm font-bold"
                    onClick={() => {
                        const opt = parseReceipt(JSON.stringify(testfile));
                        if (opt.isOk()) {
                            setReceiptData(opt.value);
                            setErrorMessage('');
                        }
                    }}
                >
                    Загрузить демо
                </button>
            </fieldset>

            {(errorMessage || receiptData) && (
                <div className={twMerge('px-2 text-sm', receiptData ? '' : '')}>
                    {errorMessage
                        ? `✘ ${errorMessage}`
                        : receiptData && `✔ найдено позиций: ${receiptData.items.length}`}
                </div>
            )}
        </>
    );
}
