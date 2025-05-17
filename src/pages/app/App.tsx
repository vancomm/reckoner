import React from 'react';
import { twMerge } from 'tailwind-merge';

import ReceiptForm from '@/components/ReceiptForm';
import Results from '@/components/Results';
import ShareholderForm from '@/components/ShareholderForm';
import SharesForm from '@/components/SharesForm';
import WelcomePopup from '@/components/WelcomePopup';
import idbCache from '@/lib/idbCache';
import { UniqueItem } from '@/lib/receiptDocument';
import { ItemShare, Shareholder } from '@/lib/shareholder';

interface AppProps {
    initialShareholders?: Shareholder[];
}

export default function App({ initialShareholders }: AppProps) {
    const [shareholders, setShareholders] = React.useState<Shareholder[]>(initialShareholders || []);
    const [receiptItems, setReceiptItems] = React.useState<UniqueItem[]>([]);
    const [itemShares, setItemShares] = React.useState<ItemShare[]>([]);

    React.useEffect(() => {
        idbCache.set('shareholders', shareholders);
        setItemShares((itemShares) => itemShares.filter((x) => shareholders.includes(x.shareholder)));
    }, [shareholders]);

    React.useEffect(() => {
        setItemShares([]);
    }, [receiptItems]);

    const findOneItemShare = React.useMemo(
        () =>
            ({ item, shareholderId }: { item: UniqueItem; shareholderId: string }) =>
                itemShares.find((x) => x.item === item && x.shareholder.id === shareholderId),
        [itemShares]
    );

    function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
        return <div className={twMerge('flex flex-col gap-2 rounded-2xl bg-black/20 p-3 sm:w-sm md:w-xl', className)} {...props} />;
    }

    return (
        <>
            <WelcomePopup className="hidden sm:block" />
            <Container>
                <ShareholderForm shareholders={shareholders} setShareholders={setShareholders} />
            </Container>
            <Container>
                <ReceiptForm receiptItems={receiptItems} setReceiptItems={setReceiptItems} />
            </Container>
            {!!receiptItems.length && (
                <Container>
                    <h3 className="ml-1">Разделите свои покупки:</h3>
                    <div className="flex flex-col gap-2">
                        {receiptItems.map((item) => (
                            <SharesForm
                                key={item.index}
                                item={item}
                                shareholders={shareholders}
                                itemShares={itemShares.filter((x) => x.item === item)}
                                setItemShares={setItemShares}
                                findOneItemShare={findOneItemShare}
                            />
                        ))}
                    </div>
                </Container>
            )}
            {!!receiptItems.length && (
                <Container className="gap-0">
                    <Results shareholders={shareholders} itemShares={itemShares} receiptItems={receiptItems} />
                </Container>
            )}
        </>
    );
}
