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

    return (
        <main className="flex grow flex-col gap-16 px-2 md:w-xl">
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between md:justify-start md:gap-x-4">
                    <h3 className="ml-1">Давайте знакомиться!</h3>
                    {shareholders.length > 0 && <Reset onClick={() => setShareholders([])} />}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                    <ManyShareholdersForm
                        className="flex h-9 items-center gap-1 overflow-hidden rounded-lg border-b-4 p-1 text-black shadow-md/50 transition-colors"
                        shareholders={shareholders}
                        setShareholders={setShareholders}
                    />
                    <OneShareholderForm
                        id="new-shareholder-input-desktop"
                        className="flex cursor-pointer items-center overflow-clip rounded-lg border-transparent bg-black/30 shadow-md/50 md:inline-flex"
                        setShareholders={setShareholders}
                        shouldFocus={shouldFocusShareholderInput}
                        setShouldFocus={setShouldFocusShareholderInput}
                    />
                </div>
            </div>

            {shareholders.length > 0 && (
                <div className="flex flex-col gap-4">
                    <ReceiptItemsForm receiptItems={receiptItems} setReceiptItems={setReceiptItems} />
                </div>
            )}

            {receiptItems.length > 0 && (
                <div className="flex flex-col gap-y-4">
                    <div className="flex items-start justify-between md:justify-start md:gap-x-4">
                        <h3 className="ml-1">Разделите свои покупки:</h3>
                        {shareholders.length > 0 && <Reset onClick={() => setItemShares([])} />}
                    </div>
                    <div className="flex flex-col gap-y-10">
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
        </main>
    );
}
