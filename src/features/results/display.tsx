import ContentCopy from '@mui/icons-material/ContentCopy';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Launch from '@mui/icons-material/Launch';
import { Link } from '@tanstack/react-router';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import Fraction from '@/components/Fraction';
import formatMoney from '@/lib/formatMoney';
import type { UniqueItem } from '@/lib/receiptDocument';
import type { ItemShare, Shareholder } from '@/lib/shareholder';
import { VARIANTS } from '@/variants.gen';

type ResultsRecord = ItemShare & { shares: number };

interface ShareholderReceiptProps {
    records: ResultsRecord[];
    shareholder: Shareholder;
    variant: string;
}

function ShareholderReceipt({ records, variant }: ShareholderReceiptProps) {
    const sumSpanRef = React.useRef(null!);
    const totalAmount = records.map((r) => r.item.sum * (r.share / r.shares)).reduce((sum, add) => sum + add, 0);

    return (
        <div
            data-variant={variant}
            className="overflow-clip rounded-md bg-(--color-canvas) px-1 text-black shadow-lg/30"
        >
            <div className="grid grid-cols-[min-content_2fr_1fr_min-content] items-start gap-x-1.5 gap-y-1 border-b-2 border-dotted border-black px-2 py-2 text-sm">
                <div />
                <div className="font-mono text-black/60">Название</div>
                <div className="text-end font-mono text-black/60">Цена</div>
                <div className="text-end font-mono text-black/60">Сумма</div>
                {records.map(({ item, share, shares }, index) => (
                    <React.Fragment key={`total-${index}`}>
                        <div className="font-mono text-black/60">{`${index + 1}.`}</div>
                        <div className="font-mono text-sm break-all">{item.name}</div>
                        <div className="flex flex-wrap items-center justify-end gap-x-1">
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
                        </div>
                        <div className="text-end font-mono">{formatMoney(item.sum * (share / shares))}</div>
                    </React.Fragment>
                ))}
                <div></div>
            </div>
            <div
                onClick={() => {
                    navigator.clipboard.writeText(formatMoney(totalAmount));
                    const selection = window.getSelection();
                    if (selection) {
                        const range = new Range();
                        range.setStart(sumSpanRef.current, 0);
                        range.setEnd(sumSpanRef.current, 1);
                        selection.addRange(range);
                    }
                }}
                className="flex cursor-pointer items-center justify-end gap-x-5 px-2 font-mono font-bold"
            >
                <span className="text-black/60 select-none">Итого:</span>

                <div className="flex items-center gap-1 text-lg font-bold">
                    <ContentCopy sx={{ fontSize: '.9em', opacity: '60%' }} />
                    <span ref={sumSpanRef}>{formatMoney(totalAmount)}</span>
                </div>
            </div>
        </div>
    );
}

interface ResultsProps {
    receiptItems: UniqueItem[];
    shareholders: Shareholder[];
    itemShares: ItemShare[];
}

export default function ResultsDisplay({ shareholders, itemShares, receiptItems }: ResultsProps) {
    const itemSharesMap = itemShares.reduce((acc, { item, share }) => {
        const prev = acc.get(item.index) ?? 0;
        acc.set(item.index, prev + share);
        return acc;
    }, new Map<number, number>());

    const getTotalsById = (shareholderId: string) =>
        itemShares
            .filter((r) => r.shareholder.id === shareholderId && r.share > 0)
            .reduce((acc, r) => {
                return [...acc, { ...r, shares: itemSharesMap.get(r.item.index) ?? r.share }];
            }, [] as ResultsRecord[]);

    const unfilledItems = receiptItems.filter(
        (item) => !itemShares.some((r) => r.item.index === item.index && r.share > 0)
    );

    const results = shareholders.map((shareholder, index) => ({
        records: getTotalsById(shareholder.id),
        variant: VARIANTS[index % VARIANTS.length],
        shareholder,
        index,
    }));

    const [activeTab, setActiveTab] = React.useState(0);

    const tabs = [
        ...results.map((props) => <ShareholderReceipt key={`results-${props.index}`} {...props} />),
        <div className="flex flex-col items-start gap-2 rounded-md bg-white/20 p-2 inset-shadow-sm">
            {unfilledItems.map((item) => (
                <Link
                    to="."
                    key={`${item.index}-${item.name}`}
                    hash={encodeURIComponent(`item-${item.name}-${item.index}`)}
                    className="shadow-red-black/50 rounded-md bg-black/60 p-1 text-balance break-words shadow-md"
                >
                    <Launch sx={{ fontSize: '1em', opacity: '60%' }} /> {item.name}
                </Link>
            ))}
        </div>,
    ];

    return (
        <div className="mt-5 flex flex-col gap-y-2">
            <h3 className="text-lg font-bold">Итоговый чек</h3>

            <div className="flex flex-col gap-y-2">
                <div className="flex flex-wrap gap-x-1 rounded-lg bg-black/30 px-1 py-0.5 shadow-md/50">
                    {[
                        ...results.map(({ shareholder, variant, records }, index) => (
                            <div
                                key={`results-${index}`}
                                data-variant={variant}
                                className={twMerge(
                                    'text-md flex cursor-pointer items-center gap-0.5 rounded-lg px-2 pt-1 pb-0.5 underline select-none',
                                    index === activeTab && 'bg-[var(--color-primary)] text-black',
                                    records.length === 0 && 'cursor-not-allowed text-white/50 no-underline'
                                )}
                                onClick={() => records.length > 0 && setActiveTab(index)}
                            >
                                {records.length === 0 && <DoDisturbIcon fontSize="small" />}
                                <div>{shareholder.name}</div>
                            </div>
                        )),
                        <div
                            key={'results-unfilled'}
                            className={twMerge(
                                'text-md flex cursor-pointer items-center gap-x-1 rounded-md px-2 pt-1 pb-0.5 text-white underline select-none',
                                shareholders.length === activeTab && 'bg-white text-black'
                            )}
                            onClick={() => setActiveTab(shareholders.length)}
                        >
                            Не заполнено
                        </div>,
                    ]}
                </div>

                {tabs[activeTab]}
            </div>
        </div>
    );
}
