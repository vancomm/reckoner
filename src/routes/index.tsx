import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import ReceiptForm from '../components/ReceiptForm';
import Results from '../components/Results';
import ShareholderForm from '../components/ShareholderForm';
import SplitForm from '../components/SharesForm';
import WelcomePopup from '../components/WelcomePopup';
import idbCache from '../lib/idbCache';
import { UniqueItem } from '../lib/receiptDocument';
import { ItemShare, Shareholder } from '../lib/shareholder';

export const Route = createFileRoute('/')({
    component: App,
    loader: () => idbCache.get('names').then((res) => res.unwrapOr<string[]>([])),
});

function App() {
    const cachedShareholderNames = Route.useLoaderData();

    const [shareholders, setShareholders] = React.useState<Shareholder[]>(
        cachedShareholderNames.map((name) => ({ name, id: name }))
    );
    const [names, setNames] = React.useState(cachedShareholderNames);
    const [receiptItems, setReceiptItems] = React.useState<UniqueItem[]>([]);
    const [itemShares, setItemShares] = React.useState<ItemShare[]>([]);

    React.useEffect(() => {
        setItemShares([]);
    }, [receiptItems]);

    React.useEffect(() => {
        idbCache.set('names', names);
        setItemShares([]);
    }, [names]);

    const findOneItemShare = React.useMemo(
        () =>
            ({ item, name }: { item: UniqueItem; name: string }) =>
                itemShares.find((x) => x.item === item && x.name === name),
        [itemShares]
    );

    const findManyItemShares = React.useMemo(
        () =>
            ({ item, name }: { item?: UniqueItem; name?: string }) =>
                itemShares.filter((x) => {
                    if (item && x.item !== item) return false;
                    if (name && x.name !== name) return false;
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
                <ShareholderForm
                    names={names}
                    setNames={setNames}
                    shareholders={shareholders}
                    setShareholders={setShareholders}
                />
            </Container>
            <Container>
                <ReceiptForm receiptItems={receiptItems} setReceiptItems={setReceiptItems} />
            </Container>
            {!!receiptItems.length && (
                <Container>
                    <SplitForm
                        names={names}
                        receiptItems={receiptItems}
                        setNames={setNames}
                        setItemShares={setItemShares}
                        getShareCount={getShareCount}
                        findManyItemShares={findManyItemShares}
                        findOneItemShare={findOneItemShare}
                    />
                </Container>
            )}
            {!!receiptItems.length && (
                <Container>
                    <Results names={names} itemShares={itemShares} receiptItems={receiptItems} />
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
