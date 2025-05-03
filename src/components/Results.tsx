import { Link } from '@tanstack/react-router';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import Collapsible from '@/components/Collapsible';
import ExpandMore from '@/components/ExpandMore';
import Fraction from '@/components/Fraction';
import formatMoney from '@/lib/formatMoney';
import { UniqueItem } from '@/lib/receiptDocument';
import { ItemShare, Shareholder } from '@/lib/shareholder';

interface ResultsProps {
    receiptItems: UniqueItem[];
    shareholders: Shareholder[];
    itemShares: ItemShare[];
}

export default function Results({ shareholders, itemShares, receiptItems }: ResultsProps) {
    const unfilledItems = receiptItems.filter((item) => !itemShares.some((r) => r.item === item && r.share > 0));

    const itemSharesMap = itemShares.reduce((acc, { item, share }) => {
        const prev = acc.get(item) ?? 0;
        acc.set(item, prev + share);
        return acc;
    }, new Map<UniqueItem, number>());

    const getTotalsById = (shareholderId: string) =>
        itemShares
            .filter((r) => r.shareholder.id === shareholderId && r.share > 0)
            .reduce((acc, r) => {
                return [...acc, { ...r, shares: itemSharesMap.get(r.item) ?? r.share }];
            }, [] as TotalRecord[]);

    return (
        <>
            <div className="ml-1">
                <h3>Итоговый чек</h3>
                {!!unfilledItems.length && (
                    <div className="flex w-fit items-center gap-1 rounded-sm py-0.5 pr-1 text-sm">
                        <div className="mr-0.5 rounded-full bg-amber-500/60 px-1.5 text-xs font-bold">!</div>
                        <h4 className="italic">
                            Не заполнены товары:{' '}
                            {unfilledItems.map((item, i) => (
                                <React.Fragment key={`${item.index}-${item.name}`}>
                                    {i > 0 && ', '}
                                    <Link
                                        to="."
                                        hash={encodeURIComponent(`${item.index}-${item.name}`)}
                                        className="underline"
                                    >
                                        {item.name}
                                    </Link>
                                </React.Fragment>
                            ))}
                        </h4>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2">
                {shareholders.map((sh, index) => (
                    <TotalCard key={`total-card-${index}`} name={sh.name} records={getTotalsById(sh.id)} />
                ))}
            </div>
        </>
    );
}

interface TotalRecord extends ItemShare {
    shares: number;
}

interface TotalCardProps {
    name: string;
    records: TotalRecord[];
}

function TotalCard({ name, records }: TotalCardProps) {
    const [expanded, setExpanded] = React.useState(false);
    const hasDetails = !!records.length;

    return (
        <div
            className={twMerge(
                'rounded-md bg-black/20 px-2 pt-2 pb-1 text-sm transition-colors',
                hasDetails && 'hover:bg-black/30',
                expanded && 'bg-black/30'
            )}
        >
            <div>
                <div
                    className="group mb-1 ml-1 flex justify-between text-lg"
                    onClick={() => hasDetails && setExpanded((x) => !x)}
                >
                    {hasDetails ? (
                        <button className="flex items-center">
                            <h3>{name}</h3>
                            <ExpandMore
                                className={twMerge(
                                    'opacity-60 transition group-hover:opacity-80 hover:opacity-100',
                                    expanded && 'rotate-180'
                                )}
                            />
                        </button>
                    ) : (
                        <h3>{name}</h3>
                    )}
                    <span className={twMerge('font-mono font-bold transition-colors', expanded && 'text-white/0')}>
                        {formatMoney(
                            records.map((r) => r.item.sum * (r.share / r.shares)).reduce((sum, add) => sum + add, 0)
                        )}
                    </span>
                </div>

                <div>
                    {hasDetails && (
                        <Collapsible open={expanded}>
                            <div className="grid grid-cols-[min-content_1fr_repeat(5,min-content)] gap-x-1.5 border-y-2 border-dotted border-white">
                                <div></div>
                                <div className="font-mono opacity-60">Название</div>
                                <div className="text-end font-mono opacity-60">Цена</div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div className="text-end font-mono opacity-60">Сумма</div>
                                {records.map(({ item, share, shares }, index) => (
                                    <React.Fragment key={`total-${name}-${index}`}>
                                        <div className="font-mono opacity-60">{`${index + 1}.`}</div>
                                        <div className="font-mono text-sm">{item.name}</div>
                                        <div className="text-end font-mono">{formatMoney(item.sum)}</div>
                                        <div className="font-mono">×</div>
                                        <div className="font-mono">
                                            {share === shares ? (
                                                <div>{item.quantity}</div>
                                            ) : (
                                                <Fraction className="" numerator={share} denominator={shares} />
                                            )}
                                        </div>
                                        <div className="font-mono">=</div>
                                        <div className="text-end font-mono">
                                            {formatMoney(item.sum * (share / shares))}
                                        </div>
                                    </React.Fragment>
                                ))}
                                <div></div>
                            </div>
                            <div className="flex justify-end">
                                <span className="font-mono text-lg font-bold">
                                    {formatMoney(
                                        records
                                            .map((r) => r.item.sum * (r.share / r.shares))
                                            .reduce((sum, add) => sum + add, 0)
                                    )}
                                </span>
                            </div>
                        </Collapsible>
                    )}
                </div>
            </div>
        </div>
    );
}
