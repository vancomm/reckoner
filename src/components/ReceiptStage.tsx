import cn from 'classnames';
import { useState } from 'react';

import { useAppState } from '../contexts/AppStateContext';
import parseReceipt, { UniqueItem } from '../lib/parseReceiptDocument';
import testfile from '../test-file.json';
import Button from './Button';
import styles from './ReceiptStage.module.css';
import StageContainer from './StageContainer';

interface ReceiptStageProps {
    nextFn: () => void;
}

export default function ReceiptStage({ nextFn }: ReceiptStageProps) {
    const [errorMessage, setErrorMessage] = useState('');

    const {
        receiptData,
        setReceiptData,
        uiState: { setShowManual },
    } = useAppState();

    return (
        <StageContainer
            handleNext={() => {
                nextFn();
            }}
            nextCondition={!!receiptData}
            extraButtons={[
                {
                    onClick: () => {
                        const opt = parseReceipt(JSON.stringify(testfile));
                        if (opt.isOk()) {
                            setReceiptData(opt.value);
                            setErrorMessage('');
                        }
                    },
                    style: { order: -1 },
                    children: 'Test',
                },
            ]}
        >
            <StageContainer.Title>
                File Upload{' '}
                <Button label="(?)" className={styles.helpButton} onClick={() => setShowManual((state) => !state)} />
            </StageContainer.Title>
            <span>Upload a JSON file with the receipt.</span>
            <div className={styles.fileForm}>
                <input
                    className={styles.fileInput}
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
            </div>

            {(errorMessage || receiptData) && (
                <div
                    className={cn(styles.message, {
                        [styles.success]: !!receiptData,
                        [styles.error]: !receiptData,
                    })}
                >
                    {errorMessage ||
                        (receiptData && (
                            <>
                                {`Detected a receipt for ${receiptData.items.length} items`}
                                {/* <ul>
                  {receiptData.items.slice(0, 3).map(({ name }, index) => (
                    <li key={index}>{name}</li>
                  ))}
                  {receiptData.items.length > 3 && "..."}
                </ul> */}
                            </>
                        ))}
                </div>
            )}
        </StageContainer>
    );
}
