import ContentCopy from '@mui/icons-material/ContentCopy';
import Launch from '@mui/icons-material/Launch';
import { Link } from '@tanstack/react-router';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import Collapsible from '@/components/Collapsible';
import ExpandMore from '@/components/ExpandMore';
import Fraction from '@/components/Fraction';
import UnfoldLess from '@/components/UnfoldLess';
import { UnfoldMore } from '@/components/UnfoldMore';
import formatMoney from '@/lib/formatMoney';
import { UniqueItem } from '@/lib/receiptDocument';
import { ItemShare, Shareholder, ShareholderColors, getShareholderColors } from '@/lib/shareholder';

type ResultsRecord = ItemShare & { shares: number };

interface ResultsSectionProps {
    records: ResultsRecord[];
    header: string;
    colors?: ShareholderColors;
    expanded?: boolean;
    toggleExpanded?: () => unknown;
}

function ResultsSection({ expanded = true, toggleExpanded, header, records, colors }: ResultsSectionProps) {
    const totalAmount = records.map((r) => r.item.sum * (r.share / r.shares)).reduce((sum, add) => sum + add, 0);

    const ref = React.useRef(null!);

    function Header() {
        return (
            <div
                className={twMerge(
                    'group flex justify-between border-b-3 border-transparent pt-2 pr-2 pb-0.5 text-lg transition-colors',
                    colors?.collapsibleHeader,
                    'bg-transparent'
                )}
            >
                <button className="flex flex-1 items-center" onClick={toggleExpanded}>
                    <ExpandMore
                        style={{ '--rotate': expanded ? '180deg' : '0' }}
                        className={twMerge('ml-1 rotate-(--rotate) opacity-60 transition-transform group-hover:opacity-80')}
                    />
                    <h3 className="ml-0.5">{header}</h3>
                </button>
                {!expanded && (
                    <div
                        ref={ref}
                        className={twMerge('flex cursor-pointer items-center gap-x-1 font-mono font-bold')}
                        onClick={() => {
                            navigator.clipboard.writeText(formatMoney(totalAmount));
                            const selection = window.getSelection();
                            if (selection) {
                                const range = new Range();
                                range.setStart(ref.current, 0);
                                range.setEnd(ref.current, 1);
                                selection.addRange(range);
                            }
                        }}
                    >
                        {formatMoney(totalAmount)}
                        <ContentCopy sx={{ fontSize: '.9em', opacity: '50%' }} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <Header />
            <Collapsible open={expanded} className={twMerge('clip overflow-clip rounded-md px-1', colors?.collapsibleContent)}>
                <div className="mt-2 grid grid-cols-[min-content_2fr_1fr_min-content] items-start gap-x-1.5 gap-y-1 border-b-2 border-dotted border-black px-2 py-2 text-sm">
                    <div />
                    <div className="font-mono text-black/60">Название</div>
                    <div className="text-end font-mono text-black/60">Цена</div>
                    <div className="text-end font-mono text-black/60">Сумма</div>
                    {records.map(({ item, share, shares }, index) => (
                        <React.Fragment key={`total-${header}-${index}`}>
                            <div className="font-mono text-black/60">{`${index + 1}.`}</div>
                            <div className="font-mono text-sm break-all">{item.name}</div>
                            <div className="flex flex-wrap items-center justify-end gap-x-1">
                                <div className="text-end font-mono">{formatMoney(item.sum)}</div>
                                <div className="font-mono">×</div>
                                <div className="font-mono">{share === shares ? <div>{item.quantity}</div> : <Fraction className="" numerator={share} denominator={shares} />}</div>
                                <div className="font-mono">=</div>
                            </div>
                            <div className="text-end font-mono">{formatMoney(item.sum * (share / shares))}</div>
                        </React.Fragment>
                    ))}
                    <div></div>
                </div>
                <div className="flex items-center justify-end gap-3 px-2">
                    <span className="font-mono text-black/60">Итого:</span>
                    <span className="font-mono text-lg font-bold">{formatMoney(totalAmount)}</span>
                </div>
            </Collapsible>
        </div>
    );
}

interface ResultsProps {
    receiptItems: UniqueItem[];
    shareholders: Shareholder[];
    itemShares: ItemShare[];
}

export default function ResultsDisplay({ shareholders, itemShares, receiptItems }: ResultsProps) {
    const [openSections, setOpenSections] = React.useState<Shareholder[]>([]);

    function Header() {
        return (
            <div className="px-1">
                <div className="flex justify-between">
                    <h3>Итоговый чек</h3>
                    {itemShares.length > 0 &&
                        (openSections.length === shareholders.length ? (
                            <button className="grid cursor-pointer grid-flow-col items-center text-white/70 hover:text-white active:text-white" onClick={() => setOpenSections([])}>
                                <UnfoldLess className="transform-[scale(1.2)]" />
                                свернуть все
                            </button>
                        ) : (
                            <button
                                className="grid cursor-pointer grid-flow-col items-center text-white/70 hover:text-white active:text-white"
                                onClick={() => setOpenSections(shareholders)}
                            >
                                <UnfoldMore className="transform-[scale(1.2)]" />
                                развернуть все
                            </button>
                        ))}
                </div>
            </div>
        );
    }

    function Bang() {
        return <div className="mr-0.5 inline-block aspect-square w-fit rounded-full bg-white/30 px-1.5 text-xs font-bold text-white">!</div>;
    }

    const unfilledItems = receiptItems.filter((item) => !itemShares.some((r) => r.item.index === item.index && r.share > 0));

    function UnfilledItemsWarning() {
        return (
            <div className="grid w-fit grid-cols-[min-content_1fr] gap-1 rounded-sm py-0.5 pr-1 text-sm">
                <Bang />
                <div className="text-white/60">Не заполнены товары:</div>

                {unfilledItems.map((item) => (
                    <React.Fragment key={`${item.index}-${item.name}`}>
                        <div />
                        <Link to="." hash={encodeURIComponent(`${item.index}-${item.name}`)}>
                            <Launch sx={{ fontSize: '1em', opacity: '60%' }} /> {item.name}
                        </Link>
                    </React.Fragment>
                ))}
            </div>
        );
    }

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

    const sections = shareholders.slice().map((shareholder, index) => ({
        records: getTotalsById(shareholder.id),
        colors: getShareholderColors(index),
        shareholder,
        index,
    }));

    const shareless = sections.filter(({ records }) => records.length === 0);

    function SharelessWarning() {
        return (
            <div className="flex items-center gap-1">
                <Bang />
                <div className="text-sm text-white/60">
                    {shareless.map(({ shareholder }, i, arr) => (
                        <React.Fragment key={i}>
                            <span className="text-white">{shareholder.name}</span>
                            {i !== arr.length - 1 && (i === arr.length - 2 ? ' и ' : ', ')}
                        </React.Fragment>
                    ))}
                    {shareless.length > 1 ? ' ничего не купили' : ' без покупок'}
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="flex flex-col">
                {sections
                    .filter(({ records }) => records.length > 0)
                    .map(({ shareholder, index, colors, records }) => (
                        <ResultsSection
                            expanded={openSections.includes(shareholder)}
                            toggleExpanded={() => {
                                console.log('toggleExpanded');
                                setOpenSections((list) => {
                                    const index = list.indexOf(shareholder);
                                    if (index === -1) return [...list, shareholder];
                                    return list.filter((_, i) => i !== index);
                                });
                            }}
                            colors={colors}
                            key={`total-card-${index}`}
                            header={shareholder.name}
                            records={records}
                        />
                    ))}
            </div>
            <div className="flex flex-col gap-y-1 not-empty:mt-4">
                {shareless.length > 0 && <SharelessWarning />}
                {unfilledItems.length > 0 && <UnfilledItemsWarning />}
            </div>
        </>
    );
}
