import Replay from '@mui/icons-material/Replay';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import ReceiptForm from '@/components/ReceiptForm';
import Results from '@/components/Results';
import WelcomePopup from '@/components/WelcomePopup';
import SharesForm from '@/features/share/edit';
import NewShareholderInput from '@/features/shareholder/add';
import EditableShareholderList from '@/features/shareholder/edit';
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
        return <div className={twMerge('rounded-2xl bg-black/20 p-3 sm:w-sm md:w-xl', className)} {...props} />;
    }

    return (
        <>
            <WelcomePopup className="hidden sm:block" />
            <Container className="flex flex-col gap-2">
                <h3 className="mx-1 flex items-start justify-between">
                    <span>Между кем делим чек?</span>
                    {shareholders.length > 0 && (
                        <button className="flex cursor-pointer items-center gap-x-0.5 text-white/60 transition-colors hover:text-white/80" onClick={() => setShareholders([])}>
                            <Replay fontSize="small" />
                            <span>сбросить</span>
                        </button>
                    )}
                </h3>
                <div className="flex flex-wrap items-center gap-1">
                    <EditableShareholderList shareholders={shareholders} setShareholders={setShareholders} />
                    <NewShareholderInput setShareholders={setShareholders} />
                </div>
            </Container>
            <Container className="flex flex-col gap-2">
                <ReceiptForm receiptItems={receiptItems} setReceiptItems={setReceiptItems} />
            </Container>
            {!!receiptItems.length && (
                <Container className="flex flex-col gap-2">
                    <h3 className="ml-1">Разделите свои покупки:</h3>
                    <div className="flex flex-col gap-2">
                        {receiptItems.map((item) => (
                            <SharesForm
                                key={item.index}
                                item={item}
                                itemShares={itemShares}
                                shareholders={shareholders}
                                setItemShares={setItemShares}
                                findOneItemShare={findOneItemShare}
                            />
                        ))}
                    </div>
                </Container>
            )}
            {!!receiptItems.length && (
                <Container className="flex flex-col gap-0">
                    <Results shareholders={shareholders} itemShares={itemShares} receiptItems={receiptItems} />
                </Container>
            )}
        </>
    );
}
