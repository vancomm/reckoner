import React from 'react';
import { twMerge } from 'tailwind-merge';

import ReceiptForm from '@/components/ReceiptForm';
import ResultsDisplay from '@/features/results/display';
import ItemSharesForm from '@/features/share/edit';
import ShareholderForm from '@/features/shareholder/form';
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

    function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
        return <div className={twMerge('rounded-2xl bg-black/20 p-3 sm:w-sm md:w-xl', className)} {...props} />;
    }

    return (
        <>
            <Container className="flex flex-col gap-2 bg-transparent">
                <ShareholderForm
                    shareholders={shareholders}
                    setShareholders={setShareholders}
                    shouldFocus={shouldFocusShareholderInput}
                />
            </Container>

            <Container className="flex flex-col gap-2">
                <ReceiptForm receiptItems={receiptItems} setReceiptItems={setReceiptItems} />
            </Container>

            {!!receiptItems.length && (
                <div className="flex flex-col gap-y-2">
                    {/* <Container> */}
                    <h3 className="ml-1">Разделите свои покупки:</h3>
                    {/* </Container> */}
                    <div className="flex flex-col gap-2">
                        {receiptItems.map((item) => (
                            <ItemSharesForm
                                key={item.index}
                                item={item}
                                itemShares={itemShares}
                                shareholders={shareholders}
                                setItemShares={setItemShares}
                            />
                        ))}
                    </div>
                </div>
            )}
            {!!receiptItems.length && (
                <Container className="flex flex-col gap-0">
                    <ResultsDisplay shareholders={shareholders} itemShares={itemShares} receiptItems={receiptItems} />
                </Container>
            )}
        </>
    );
}
