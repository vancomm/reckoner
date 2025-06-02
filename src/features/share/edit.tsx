import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

import Collapsible from '@/components/Collapsible';
import Edit from '@/components/Edit';
import PillInput from '@/components/PillInput';
import UnfoldLess from '@/components/UnfoldLess';
import { UnfoldMore } from '@/components/UnfoldMore';
import formatMoney from '@/lib/formatMoney';
import { UniqueItem } from '@/lib/receiptDocument';
import { ItemShare, Shareholder, getShareholderColors, shareholderColors } from '@/lib/shareholder';

function ItemTypography({ item }: { item: UniqueItem }) {
    return (
        <div>
            <h3 className="font-mono text-xl break-all" id={encodeURIComponent(`${item.index}-${item.name}`)}>
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
    );
}

interface SharesFormProps {
    item: UniqueItem;
    shareholders: Shareholder[];
    itemShares: ItemShare[];
    setItemShares: React.Dispatch<React.SetStateAction<ItemShare[]>>;
}

export default function ItemSharesForm({ item, shareholders, itemShares, setItemShares }: SharesFormProps) {
    const [showTextInputs, setShowTextInputs] = React.useState(true);

    const selectedShareholders = shareholders
        .map((shareholder, index) => ({
            shareholder,
            index,
            share:
                itemShares.find((x) => x.item.index === item.index && x.shareholder.id === shareholder.id)?.share || 0,
        }))
        .filter(({ share }) => share > 0);
    const allSelected = shareholders.length === selectedShareholders.length;

    function ShareToggle({ shareholder, index }: { shareholder: Shareholder; index: number }) {
        const id = `${item.name}-${item.index}-${index}`;
        const checked =
            (itemShares.find((x) => x.item.index === item.index && x.shareholder.id === shareholder.id)?.share || 0) >
            0;

        return (
            <label
                htmlFor={id}
                className={twJoin(
                    'flex-1 cursor-pointer rounded-lg border-b-4 bg-black/30 px-2 py-1 transition-colors duration-[5s] select-none active:border-0',
                    getShareholderColors(index).checkbox
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
                                (x) => x.item.index === item.index && x.shareholder.id === shareholder.id
                            );
                            return previous ? xs.map((x) => (x === previous ? updated : x)) : [...xs, updated];
                        });
                    }}
                />
                <div className="flex items-center justify-between gap-1">
                    <div className="font-mono">{checked ? '-' : '+'}</div>
                    <div>{shareholder.name}</div>
                    <div className="font-mono opacity-0" aria-hidden>
                        1
                    </div>
                </div>
            </label>
        );
    }

    function ShareTextInput({ share, setShare }: { share: number; setShare: (share: number) => unknown }) {
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

    function SharesGraph() {
        return (
            <div
                className={twMerge(
                    'grid min-h-4 grid-flow-col grid-cols-(--sharebar-columns) overflow-hidden rounded bg-white/10'
                )}
                style={{
                    '--sharebar-columns': selectedShareholders.map(({ share }) => `${share}fr`).join(' '),
                }}
            >
                {selectedShareholders.map(({ index }) => (
                    <div
                        key={index}
                        className={twMerge(
                            getShareholderColors(index).shareBar,
                            index >= shareholderColors.length && 'brightness-75'
                        )}
                    />
                ))}
            </div>
        );
    }

    function ShowTextInputsToggle() {
        return (
            <label
                htmlFor={`expand-${item.index}`}
                className="flex cursor-pointer items-center text-white/60 select-none hover:text-white"
            >
                <input
                    id={`expand-${item.index}`}
                    type="checkbox"
                    className="hidden"
                    checked={!showTextInputs}
                    onChange={(e) => setShowTextInputs(!e.target.checked)}
                />
                {showTextInputs ? (
                    <UnfoldMore className="transform-[scale(1.2)]" />
                ) : (
                    <UnfoldLess className="transform-[scale(1.2)]" />
                )}
                <div>{'пропорции'}</div>
            </label>
        );
    }

    function SelectionToggle() {
        return (
            <button
                className="flex cursor-pointer items-center text-white/60 select-none hover:text-white"
                onClick={() => {
                    if (allSelected) {
                        setItemShares((shares) => shares.filter((share) => share.item.index !== item.index));
                    } else {
                        shareholders.forEach((shareholder) => {
                            const updated: ItemShare = { item, shareholder, share: 1 };
                            setItemShares((xs) => {
                                const previous = xs.find(
                                    (x) => x.item.index === item.index && x.shareholder.id === shareholder.id
                                );
                                return previous ? xs.map((x) => (x === previous ? updated : x)) : [...xs, updated];
                            });
                        });
                    }
                }}
            >
                {allSelected ? 'очистить' : 'выбрать всех'}
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-y-4 rounded-2xl bg-black/20 px-4 pt-3 pb-2">
            <ItemTypography item={item} />

            <div className="flex flex-wrap items-end gap-2">
                {shareholders.map((shareholder, index) => (
                    <ShareToggle
                        key={`item-${item.index}-shareholder-toggle-${shareholder.id}`}
                        shareholder={shareholder}
                        index={index}
                    />
                ))}
            </div>

            <SharesGraph />

            <div>
                <div className="flex justify-between">
                    <SelectionToggle />
                    {selectedShareholders.length > 1 && <ShowTextInputsToggle />}
                </div>

                <Collapsible
                    open={!showTextInputs}
                    className="mt-2 grid w-fit grid-cols-[1fr_min-content] items-center justify-center gap-x-2"
                >
                    {selectedShareholders.map(({ shareholder, share }, i) => (
                        <React.Fragment key={i}>
                            <div>{shareholder.name}:</div>
                            <ShareTextInput
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
                </Collapsible>
            </div>
        </div>
    );
}
