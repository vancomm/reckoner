import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useAppState } from '../contexts/AppStateContext';
import formatMoney from '../lib/formatMoney';
import { UniqueItem } from '../lib/parseReceiptDocument';
import Fraction from './Fraction';

export default function SplitForm() {
    const { receiptData } = useAppState();

    if (!receiptData) return null;
    const items = receiptData.items;

    return (
        <>
            <h3 className="ml-1">Разделите свои покупки:</h3>
            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <SharesForm key={item.index} item={item} />
                ))}
            </div>
        </>
    );
}

interface SplitControlProps {
    item: UniqueItem;
}

function SharesForm({ item }: SplitControlProps) {
    const {
        names,
        setInputRecords,
        inputRecordsInterface: { getRecord, getRecords, getShares },
    } = useAppState();

    const [equalShares, setEqualShares] = React.useState(true);

    const records = getRecords({ item });
    const isFilled = records.some((r) => r.share > 0);
    const shares = getShares(item);
    const buyers = records.filter((r) => r.share);
    const soloBuyer = buyers.length === 1;

    return (
        <div className="flex flex-col gap-y-2 rounded-md bg-black/20 px-4 pt-3 pb-2 sm:p-5">
            <div>
                <h3 className="font-mono text-xl" id={encodeURIComponent(`${item.index}-${item.name}`)}>
                    {item.name}
                </h3>
                <h3 className="flex gap-1 text-sm">
                    <span className="font-mono">{formatMoney(item.sum)}</span>
                    {item.quantity > 1 && (
                        <>
                            <span className="font-mono opacity-50">=</span>
                            <span className="font-mono opacity-50">{formatMoney(item.price)}</span>
                            <span className="font-mono opacity-50">×</span>
                            <span className="font-mono opacity-50">{item.quantity}</span>
                        </>
                    )}
                </h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {names.map((name, i) => {
                    const id = `${item.name}-${item.index}-${name}-${i}`;
                    const checked = (getRecord({ item, name })?.share ?? 0) > 0;
                    return (
                        <label
                            key={id}
                            htmlFor={id}
                            className="cursor-pointer rounded-sm bg-[rgba(0,0,0,.2)] px-2 py-1 transition-colors select-none hover:bg-[rgba(0,0,0,.3)] has-[:checked]:bg-amber-50 has-[:checked]:text-black"
                        >
                            <input
                                id={id}
                                className="hidden"
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                    if (buyers.length === 2 && !e.target.checked) {
                                        setEqualShares(true);
                                    }

                                    const updated = { item, name, share: e.target.checked ? 1 : 0 };
                                    setInputRecords((records) => {
                                        const stale = records.find((r) => r.item === item && r.name === name);
                                        return stale
                                            ? records.map((r) => (r === stale ? updated : r))
                                            : [...records, updated];
                                    });
                                }}
                            />
                            <div className="flex items-center gap-1">
                                <div className="font-mono">{checked ? '-' : '+'}</div>
                                <div>{name}</div>
                            </div>
                        </label>
                    );
                })}
            </div>
            {!!buyers.length && (
                <div>
                    <div className={twMerge('grid w-fit grid-cols-[repeat(6,min-content)] gap-x-2 gap-y-2')}>
                        {buyers.map((buyer) => (
                            <React.Fragment key={buyer.name}>
                                <div>{`${buyer.name}:`}</div>
                                <div className="font-mono">{formatMoney(item.sum * (buyer.share / shares))}</div>

                                <div
                                    className={twMerge(
                                        'font-mono text-white/0 transition-colors',
                                        !equalShares && !soloBuyer && 'text-white/50'
                                    )}
                                >{`=`}</div>
                                <div
                                    className={twMerge(
                                        'font-mono text-white/0 transition-colors',
                                        !equalShares && !soloBuyer && 'text-white/50'
                                    )}
                                >
                                    {formatMoney(item.price)}
                                </div>
                                <div
                                    className={twMerge(
                                        'font-mono text-white/0 transition-colors',
                                        !equalShares && !soloBuyer && 'text-white/50'
                                    )}
                                >{`×`}</div>
                                <Fraction
                                    className={twMerge(
                                        'text-white/0 transition-colors',
                                        !equalShares && !soloBuyer && 'text-white'
                                    )}
                                    numerator={buyer.share}
                                    denominator={shares}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                    {buyers.length > 1 && (
                        <label htmlFor="equal-shares" className="mt-2 block cursor-pointer text-sm select-none">
                            <input
                                type="checkbox"
                                id="equal-shares"
                                checked={equalShares}
                                onChange={(e) => setEqualShares(e.target.checked)}
                            />
                            {' делить поровну'}
                        </label>
                    )}
                </div>
            )}
            <div
                className={twMerge('mb-1 h-1 rounded-full bg-white/30 transition-colors', isFilled && 'bg-green-300')}
            />
        </div>
    );
}
