import React from 'react';
import { twMerge } from 'tailwind-merge';

// import Fraction from '@/components/Fraction';
import formatMoney from '@/lib/formatMoney';
import { UniqueItem } from '@/lib/receiptDocument';
import { ItemShare, Shareholder, getShareholderClassNames } from '@/lib/shareholder';

import Collapsible from './Collapsible';
import Edit from './Edit';
import PillInput from './PillInput';

interface SharesFormProps {
    item: UniqueItem;
    shareholders: Shareholder[];
    setItemShares: React.Dispatch<React.SetStateAction<ItemShare[]>>;
    findOneItemShare: (props: { item: UniqueItem; shareholderId: string }) => ItemShare | undefined;
    findManyItemShares: (props: { item?: UniqueItem; shareholderId?: string }) => ItemShare[];
    getShareCount: (item: UniqueItem) => number;
}

export default function SharesForm({
    item,
    shareholders,
    setItemShares,
    findOneItemShare,
    findManyItemShares,
    // getShareCount,
}: SharesFormProps) {
    const [collapsed, setCollapsed] = React.useState(true);

    const itemShares = findManyItemShares({ item });
    const isFilled = itemShares.some((r) => r.share > 0);
    const activeShareholders = shareholders
        .map((shareholder, index) => ({
            shareholder,
            index,
            share: findOneItemShare({ item, shareholderId: shareholder.id })?.share ?? 0,
        }))
        .filter(({ share }) => share > 0);

    return (
        <div className="flex flex-col gap-y-4 rounded-md bg-black/20 px-4 pt-3 pb-2 sm:p-5">
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
                {shareholders.map((sh, i) => {
                    const id = `${item.name}-${item.index}-${i}`;
                    const checked = (findOneItemShare({ item, shareholderId: sh.id })?.share ?? 0) > 0;
                    return (
                        <label
                            key={id}
                            htmlFor={id}
                            className={twMerge(
                                'cursor-pointer rounded-sm bg-[rgba(0,0,0,.2)] px-2 py-1 transition-colors select-none hover:bg-[rgba(0,0,0,.3)]',
                                checked && getShareholderClassNames(i).bg,
                                checked && 'text-black'
                            )}
                        >
                            <input
                                id={id}
                                className="hidden"
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                    const updated: ItemShare = {
                                        item,
                                        shareholder: sh,
                                        share: e.target.checked ? 1 : 0,
                                    };
                                    setItemShares((records) => {
                                        const stale = records.find(
                                            (r) => r.item === item && r.shareholder.id === sh.id
                                        );
                                        return stale
                                            ? records.map((r) => (r === stale ? updated : r))
                                            : [...records, updated];
                                    });
                                }}
                            />
                            <div className="flex items-center gap-1">
                                <div className="font-mono">{checked ? '-' : '+'}</div>
                                <div>{sh.name}</div>
                            </div>
                        </label>
                    );
                })}
            </div>
            <div
                className={twMerge(
                    'grid h-4 min-h-1 grid-flow-col overflow-hidden rounded bg-white/30 transition-colors',
                    isFilled && `grid-cols-(--sharebar-columns)`
                )}
                style={{
                    '--sharebar-columns': activeShareholders.map(({ share }) => `${share}fr`).join(' '),
                }}
            >
                {activeShareholders.map(({ index }) => (
                    <div key={index} className={getShareholderClassNames(index).shareBar} />
                ))}
            </div>
            {activeShareholders.length > 1 && (
                <div>
                    <label htmlFor={`expand-${item.index}`} className="cursor-pointer select-none">
                        <input
                            type="checkbox"
                            id={`expand-${item.index}`}
                            checked={!collapsed}
                            onChange={(e) => setCollapsed(!e.target.checked)}
                        />{' '}
                        указать пропорции
                    </label>
                    <Collapsible open={!collapsed}>
                        <div className="mt-2 grid w-fit grid-cols-[1fr_min-content] items-center gap-x-3 gap-y-2">
                            {activeShareholders.map(({ shareholder, share }, i) => (
                                <ShareholderShareForm
                                    key={i}
                                    shareholder={shareholder}
                                    share={share}
                                    setShare={(share) => {
                                        const updated: ItemShare = { item, shareholder, share };
                                        setItemShares((records) => {
                                            const stale = records.find(
                                                (r) => r.item === item && r.shareholder.id === shareholder.id
                                            );
                                            return stale
                                                ? records.map((r) => (r === stale ? updated : r))
                                                : [...records, updated];
                                        });
                                    }}
                                />
                            ))}
                        </div>
                    </Collapsible>{' '}
                </div>
            )}
        </div>
    );
}

interface ShareholderShareFormProps {
    shareholder: Shareholder;
    share: number;
    setShare: (share: number) => unknown;
}

function ShareholderShareForm({ shareholder, share, setShare }: ShareholderShareFormProps) {
    const [editable, setEditable] = React.useState(false);

    return (
        <>
            <div>{shareholder.name}:</div>
            <PillInput
                editable={editable}
                pillProps={{
                    children: (
                        <>
                            <div>{share}</div>
                            <Edit className="fill-white opacity-50 group-hover:opacity-100" />
                        </>
                    ),
                    onClick: () => setEditable((x) => !x),
                }}
                inputProps={{
                    defaultValue: share,
                    pattern: '\\d*',
                    onBlur: () => setEditable(false),
                    onChange: (e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/, '');
                        if (e.target.value.length > 0) {
                            setShare(Number(e.target.value));
                        }
                    },
                    onKeyDown: (e) => {
                        if (e.key === 'Escape' || e.key === 'Enter') {
                            setEditable(false);
                        }
                    },
                }}
            />
        </>
    );
}
