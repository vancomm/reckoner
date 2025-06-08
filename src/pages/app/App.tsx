import React from 'react';

import Reset from '@/components/Reset';
import ReceiptItemsForm from '@/features/items/form';
import ResultsDisplay from '@/features/results/display';
import ItemSharesForm from '@/features/share/form';
import ManyShareholdersForm from '@/features/shareholder/form-many';
import OneShareholderForm from '@/features/shareholder/form-one';
import usePersistentState from '@/hooks/use-persistent-storage';
import { UniqueItem } from '@/lib/receiptDocument';
import { ItemShare, Shareholder } from '@/lib/shareholder';

export default function App() {
    const [shareholders, setShareholders] = usePersistentState<Shareholder[]>('shareholders', []);
    const [receiptItems, setReceiptItems] = usePersistentState<UniqueItem[]>('receipt-items', []);
    const [itemShares, setItemShares] = usePersistentState<ItemShare[]>('item-shares', []);

    const [shouldFocusShareholderInput, setShouldFocusShareholderInput] = React.useState(false);

    React.useEffect(() => {
        setShouldFocusShareholderInput(true);
        setItemShares((itemShares) =>
            itemShares.filter(({ shareholder }) => shareholders.find((x) => x.id === shareholder.id))
        );
    }, [shareholders, setItemShares]);

    React.useEffect(() => {
        setItemShares((itemShares) =>
            itemShares.filter(({ item }) => receiptItems.find((x) => x.index === item.index))
        );
    }, [receiptItems, setItemShares]);

    console.log(__VARIANTS__);

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between md:justify-start md:gap-x-4">
                    <h3 className="ml-1">Давайте знакомиться!</h3>
                    {shareholders.length > 0 && <Reset onClick={() => setShareholders([])} />}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                    <ManyShareholdersForm shareholders={shareholders} setShareholders={setShareholders} />
                    <OneShareholderForm
                        id="new-shareholder-input-desktop"
                        className="flex cursor-pointer items-center overflow-clip rounded-lg border-transparent bg-black/30 md:inline-flex"
                        setShareholders={setShareholders}
                        shouldFocus={shouldFocusShareholderInput}
                        setShouldFocus={setShouldFocusShareholderInput}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <ReceiptItemsForm receiptItems={receiptItems} setReceiptItems={setReceiptItems} />
            </div>

            {!!receiptItems.length && (
                <div className="flex flex-col gap-y-2">
                    <div className="flex items-start justify-between md:justify-start md:gap-x-4">
                        <h3 className="ml-1">Разделите свои покупки:</h3>
                        {shareholders.length > 0 && <Reset onClick={() => setItemShares([])} />}
                    </div>
                    <div className="flex flex-col gap-2">
                        {receiptItems.map((item) => (
                            <ItemSharesForm
                                key={item.index}
                                item={item}
                                itemShares={itemShares.filter((x) => x.item.index === item.index)}
                                shareholders={shareholders}
                                setItemShares={setItemShares}
                            />
                        ))}
                    </div>
                </div>
            )}

            {!!receiptItems.length && (
                <ResultsDisplay shareholders={shareholders} itemShares={itemShares} receiptItems={receiptItems} />
            )}
        </>
    );
}
