import CasinoIcon from '@mui/icons-material/Casino';
import FileUpload from '@mui/icons-material/FileUpload';
import Replay from '@mui/icons-material/Replay';
import { Result } from 'neverthrow';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import demofile from '@/2025-05-27T19-30.json';
import { UniqueItem, receiptDocumentSchema } from '@/lib/receiptDocument';

interface ReceiptItemsFormProps {
    receiptItems: UniqueItem[];
    setReceiptItems: React.Dispatch<React.SetStateAction<UniqueItem[]>>;
}

export default function ReceiptItemsForm({ receiptItems, setReceiptItems }: ReceiptItemsFormProps) {
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

    const handleLoadDemo = () =>
        Result.fromThrowable(receiptDocumentSchema.parse)(demofile).match(
            (receiptDocument) => {
                setReceiptItems(
                    receiptDocument[0].ticket.document.receipt.items.map((item, index) => ({
                        ...item,
                        index,
                        order: index,
                        id: crypto.randomUUID(),
                    }))
                );
                setErrorMessage('');
            },
            (err) => {
                console.error(err);
            }
        );

    return (
        <>
            <div className="ml-1 flex justify-between md:justify-start md:gap-x-4">
                <h3>Загрузите ваш чек:</h3>
                <button
                    className="flex cursor-pointer items-center gap-x-0.5 text-white/60 transition-colors hover:text-white/80"
                    onClick={() => setReceiptItems([])}
                >
                    <Replay fontSize="small" />
                    <span>заново</span>
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-transparent md:w-fit">
                <label
                    htmlFor="receipt-file"
                    className="flex min-w-fit grow-1 cursor-pointer items-center justify-center rounded-lg bg-black/50 px-1 py-3 text-sm font-bold md:px-4"
                >
                    <input
                        id="receipt-file"
                        className="hidden"
                        type="file"
                        accept="application/json"
                        onChange={handleUploadFile}
                    />
                    <FileUpload sx={{ fontSize: '1.5em' }} className="text-white/50" />
                    <div>Файл с устройства</div>
                </label>
                <button
                    className="flex min-w-fit grow-1 cursor-pointer items-center justify-center gap-x-1 rounded-lg bg-black/30 px-1 py-3 text-sm font-bold md:px-4"
                    onClick={handleLoadDemo}
                >
                    <CasinoIcon sx={{ fontSize: '1.5em' }} className="text-white/40" />
                    <div>Демо</div>
                </button>
                {(errorMessage || !!receiptItems.length) && (
                    <div className={twMerge('px-2 text-sm', receiptItems.length ? '' : '')}>
                        {errorMessage
                            ? `✘ ${errorMessage}`
                            : !!receiptItems.length && `✔ найдено позиций: ${receiptItems.length}`}
                    </div>
                )}
            </div>
        </>
    );
}
