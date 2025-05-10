import React from 'react';
import { twMerge } from 'tailwind-merge';

import formatMoney from '@/lib/formatMoney';
import { UniqueItem } from '@/lib/receiptDocument';
import { ItemShare, Shareholder, getShareholderClassNames } from '@/lib/shareholder';

import Collapsible from './Collapsible';
import Edit from './Edit';
import PillInput from './PillInput';

interface SharesFormProps {
    item: UniqueItem;
    shareholders: Shareholder[];
    itemShares: ItemShare[];
    setItemShares: React.Dispatch<React.SetStateAction<ItemShare[]>>;
    findOneItemShare: (props: { item: UniqueItem; shareholderId: string }) => ItemShare | undefined;
}

export default function SharesForm({
    item,
    shareholders,
    itemShares,
    setItemShares,
    findOneItemShare,
}: SharesFormProps) {
    const [collapsed, setCollapsed] = React.useState(true);

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
                {shareholders.map((shareholder, index) => {
                    const id = `${item.name}-${item.index}-${index}`;
                    const checked = (findOneItemShare({ item, shareholderId: shareholder.id })?.share ?? 0) > 0;
                    return (
                        <label
                            key={id}
                            htmlFor={id}
                            className={twMerge(
                                'cursor-pointer rounded-sm bg-[rgba(0,0,0,.2)] px-2 py-1 transition-colors select-none hover:bg-[rgba(0,0,0,.3)]',
                                checked && getShareholderClassNames(index).bg,
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
                                        shareholder,
                                        share: e.target.checked ? 1 : 0,
                                    };
                                    setItemShares((xs) => {
                                        const previous = xs.find(
                                            (x) => x.item === item && x.shareholder.id === shareholder.id
                                        );
                                        return previous
                                            ? xs.map((x) => (x === previous ? updated : x))
                                            : [...xs, updated];
                                    });
                                }}
                            />
                            <div className="flex items-center gap-1">
                                <div className="font-mono">{checked ? '-' : '+'}</div>
                                <div>{shareholder.name}</div>
                            </div>
                        </label>
                    );
                })}
            </div>
            <div
                className={twMerge(
                    'grid h-4 min-h-1 grid-flow-col overflow-hidden rounded bg-white/10 transition-colors',
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
                        <div className="mt-2 grid w-fit grid-cols-[1fr_min-content] items-center justify-center gap-x-3 gap-y-2">
                            {activeShareholders.map(({ shareholder, share }, i) => (
                                <React.Fragment key={i}>
                                    <div>{shareholder.name}:</div>
                                    <ShareInput
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
                                </React.Fragment>
                            ))}
                        </div>
                    </Collapsible>{' '}
                </div>
            )}
        </div>
    );
}

interface ShareInputProps {
    share: number;
    setShare: (share: number) => unknown;
}

function ShareInput({ share, setShare }: ShareInputProps) {
    const [editable, setEditable] = React.useState(false);

    return (
        <PillInput
            editable={editable}
            pillProps={{
                children: (
                    <>
                        <div>{share}</div>
                        <Edit className="fill-white opacity-50 group-hover:opacity-100" />
                    </>
                ),
                onClick: () => setEditable(true),
            }}
            inputProps={{
                defaultValue: share,
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
    );
}
