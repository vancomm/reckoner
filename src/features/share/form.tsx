import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import React from 'react';
import { twJoin } from 'tailwind-merge';

import FocusableAutoWidthInput from '@/components/FocusableAutoWidthInput';
import WithClickOutside from '@/components/WithClickOutside';
import formatMoney from '@/lib/formatMoney';
import type { UniqueItem } from '@/lib/receiptDocument';
import type { ItemShare, Shareholder } from '@/lib/shareholder';

interface SharesFormProps {
    item: UniqueItem;
    shareholders: Shareholder[];
    itemShares: ItemShare[];
    setItemShares: React.Dispatch<React.SetStateAction<ItemShare[]>>;
}

export default function ItemSharesForm({ item, shareholders, itemShares, setItemShares }: SharesFormProps) {
    const [showTextInputs, setShowTextInputs] = React.useState(false);

    const shareholderProps = shareholders.map((shareholder, index) => ({
        shareholder,
        variant: __VARIANTS__[index % __VARIANTS__.length],
        share: itemShares.find((x) => x.shareholder.id === shareholder.id)?.share || 0,
    }));

    const universallyShared = shareholders.length === shareholderProps.filter((x) => x.share > 0).length;

    function ShareToggle({
        shareholder,
        variant,
        className,
    }: { shareholder: Shareholder; variant: string } & React.InputHTMLAttributes<HTMLDivElement>) {
        const id = `${item.name}-${item.index}-${shareholder.id}`;
        const checked = (itemShares.find((x) => x.shareholder.id === shareholder.id)?.share || 0) > 0;

        return (
            <label
                data-variant={variant}
                htmlFor={id}
                className={twJoin(
                    'min-h-9 shrink-0 grow-1 cursor-pointer rounded-lg border-b-4 border-(--color-secondary) bg-black/30 px-2 py-1 transition-colors select-none active:border-t-4 active:border-b-0 active:border-t-transparent has-checked:border-b-(--color-primary) has-checked:bg-(--color-secondary) has-checked:text-black',
                    className
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
                    <div className="w-4 text-center font-mono">{checked ? '✔' : '+'}</div>
                    <div>{shareholder.name}</div>
                    <div className="w-4 text-center font-mono opacity-0" aria-hidden />
                </div>
            </label>
        );
    }

    function ShareTextInput({
        shareholder,
        variant,
        share,
        setShare,
        className,
    }: {
        shareholder: Shareholder;
        variant: string;
        share: number;
        setShare: (share: number) => unknown;
    } & React.InputHTMLAttributes<HTMLDivElement>) {
        const [editable, setEditable] = React.useState(false);

        return (
            <WithClickOutside
                data-variant={variant}
                onClickOutside={() => editable && setEditable(false)}
                onClick={() => !editable && setEditable(true)}
                className={twJoin(
                    'flex h-9 shrink-0 grow-1 cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-lg border-b-4 p-1 transition-colors select-none',
                    share > 0
                        ? 'border-(--color-primary) bg-(--color-secondary) text-black'
                        : 'border-(--color-secondary) bg-black/30',
                    className
                )}
            >
                {shareholder.name}:
                {editable ? (
                    <FocusableAutoWidthInput
                        inputMode="numeric"
                        className={twJoin(
                            'min-w-[4ch] text-end font-mono focus:outline-0',
                            editable
                                ? 'border-(--color-secondary) bg-(--color-primary)'
                                : 'cursor-pointer border-(--color-primary) bg-(--color-secondary) select-none'
                        )}
                        defaultValue={share}
                        onBlur={(e) => {
                            const value = e.target.value;
                            if (!value) {
                                setShare(0);
                            } else {
                                setShare(parseFloat(value));
                            }
                            setEditable(false);
                        }}
                        onKeyDown={(e) => {
                            const target = e.target as EventTarget & HTMLInputElement;
                            if (e.key === 'Escape') {
                                setEditable(false);
                            } else if (e.key === 'Enter') {
                                if (target.value.length === 0) return;
                                const value = target.value;
                                setShare(parseFloat(value));
                                setEditable(false);
                            }
                        }}
                    />
                ) : (
                    <div className="min-w-[4ch] text-end font-mono">{share}</div>
                )}
            </WithClickOutside>
        );

        // return (
        //     <PillInput
        //         editable={editable}
        //         pillProps={{
        //             children: (
        //                 <>
        //                     <div>{share}</div>
        //                     <Edit className="fill-white opacity-50 group-hover:opacity-100" />
        //                 </>
        //             ),
        //             onClick: () => setEditable(true),
        //         }}
        //         inputProps={{
        //             defaultValue: share,
        //             onBlur: () => setEditable(false),
        //             onChange: (e) => {
        //                 e.target.value = e.target.value.replace(/[^0-9]/, '');
        //                 if (e.target.value.length > 0) {
        //                     setShare(Number(e.target.value));
        //                 }
        //             },
        //             onKeyDown: (e) => {
        //                 if (e.key === 'Escape' || e.key === 'Enter') {
        //                     setEditable(false);
        //                 }
        //             },
        //         }}
        //     />
        // );
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-1 rounded-xl bg-black/30 px-2 pt-3 pb-2">
                <h3
                    id={encodeURIComponent(`item-${item.name}-${item.index}`)}
                    className="font-mono text-balance break-words"
                >
                    {item.name}
                </h3>

                <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xl">{formatMoney(item.sum)}</h3>

                    <div className="mr-2 tracking-[-.5em]">
                        {shareholderProps.map(
                            ({ variant, share }) =>
                                share > 0 && (
                                    <span data-variant={variant} className="text-xl text-(--color-primary)">
                                        ✔
                                    </span>
                                )
                        )}
                    </div>
                </div>

                <div className="flex justify-between">
                    <label
                        htmlFor={`show-text-inputs-${item.index}`}
                        className="flex cursor-pointer items-center text-white/60 transition-colors ease-out select-none hover:text-white/80 active:text-white/80"
                    >
                        <input
                            id={`show-text-inputs-${item.index}`}
                            type="checkbox"
                            className="hidden"
                            checked={showTextInputs}
                            onChange={(e) => setShowTextInputs(e.target.checked)}
                        />
                        {!showTextInputs ? (
                            <>
                                <CheckBoxIcon fontSize="small" />
                                <ArrowRightIcon fontSize="small" />
                                <LooksOneOutlinedIcon fontSize="small" />
                            </>
                        ) : (
                            <>
                                <CheckBoxOutlinedIcon fontSize="small" />
                                <ArrowLeftIcon fontSize="small" />
                                <LooksOneIcon fontSize="small" />
                            </>
                        )}
                    </label>

                    <button
                        className="flex cursor-pointer items-center text-white/60 select-none hover:text-white"
                        onClick={() => {
                            if (universallyShared) {
                                setItemShares((shares) => shares.filter((share) => share.item.index !== item.index));
                            } else {
                                shareholders.forEach((shareholder) => {
                                    const updated: ItemShare = { item, shareholder, share: 1 };
                                    setItemShares((xs) => {
                                        const previous = xs.find(
                                            (x) => x.item.index === item.index && x.shareholder.id === shareholder.id
                                        );
                                        return previous
                                            ? xs.map((x) => (x === previous ? updated : x))
                                            : [...xs, updated];
                                    });
                                });
                            }
                        }}
                    >
                        {universallyShared ? 'очистить' : 'выбрать всех'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-y-1">
                <div className="flex flex-wrap items-stretch gap-x-1 gap-y-1">
                    {shareholderProps.map(({ shareholder, share, variant }) => (
                        <React.Fragment key={`item-${item.index}-shareholder-input-${shareholder.id}`}>
                            {showTextInputs ? (
                                <ShareTextInput
                                    shareholder={shareholder}
                                    variant={variant}
                                    share={share}
                                    setShare={(share) => {
                                        const updated: ItemShare = { item, shareholder, share };
                                        setItemShares((records) => {
                                            const stale = records.find((r) => r.shareholder.id === shareholder.id);
                                            return stale
                                                ? records.map((r) => (r === stale ? updated : r))
                                                : [...records, updated];
                                        });
                                    }}
                                />
                            ) : (
                                <ShareToggle shareholder={shareholder} variant={variant} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
