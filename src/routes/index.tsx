import { createFileRoute } from '@tanstack/react-router';
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

export const Route = createFileRoute('/')({
    component: App,
    loader: async () => {
        const cachedShareholdersResult = await idbCache.get('shareholders');
        return {
            shareholders: cachedShareholdersResult.unwrapOr<Shareholder[]>([]),
        };
    },
});

function App() {
    const { shareholders: cachedShareholders } = Route.useLoaderData();

    const [shareholders, setShareholders] = React.useState<Shareholder[]>(cachedShareholders);

    // const [names, setNames] = React.useState(cachedShareholderNames);
    const [receiptItems, setReceiptItems] = React.useState<UniqueItem[]>([]);
    const [itemShares, setItemShares] = React.useState<ItemShare[]>([]);

    React.useEffect(() => {
        setItemShares([]);
    }, [receiptItems]);

    React.useEffect(() => {
        idbCache.set('shareholders', shareholders);
        setItemShares([]);
    }, [shareholders]);

    const findOneItemShare = React.useMemo(
        () =>
            ({ item, shareholderId }: { item: UniqueItem; shareholderId: string }) =>
                itemShares.find((x) => x.item === item && x.shareholder.id === shareholderId),
        [itemShares]
    );

    const findManyItemShares = React.useMemo(
        () =>
            ({ item, shareholderId }: { item?: UniqueItem; shareholderId?: string }) =>
                itemShares.filter((x) => {
                    if (item && x.item !== item) return false;
                    if (shareholderId && x.shareholder.id !== shareholderId) return false;
                    return true;
                }),
        [itemShares]
    );

    const getShareCount: (item: UniqueItem) => number = React.useMemo(
        () => (item) => findManyItemShares({ item }).reduce((sum, x) => sum + x.share, 0),
        [findManyItemShares]
    );

    return (
        <>
            <WelcomePopup />
            <Container>
                <ShareholderForm shareholders={shareholders} setShareholders={setShareholders} />
            </Container>
            <Container>
                <ReceiptForm receiptItems={receiptItems} setReceiptItems={setReceiptItems} />
            </Container>
            {!!receiptItems.length && (
                <Container>
                    <SharesForm
                        shareholders={shareholders}
                        receiptItems={receiptItems}
                        setItemShares={setItemShares}
                        getShareCount={getShareCount}
                        findManyItemShares={findManyItemShares}
                        findOneItemShare={findOneItemShare}
                    />
                </Container>
            )}
            {!!receiptItems.length && (
                <Container>
                    <Results shareholders={shareholders} itemShares={itemShares} receiptItems={receiptItems} />
                </Container>
            )}
        </>
    );
}

function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={twMerge('flex flex-col gap-2 rounded-2xl bg-black/20 p-3 sm:w-sm md:w-xl', className)}
            {...props}
        />
    );
}
