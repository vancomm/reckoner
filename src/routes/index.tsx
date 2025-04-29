import { Link, createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import Collapsible from '../components/Collapsible';
import ExpandMore from '../components/ExpandMore';
import FocusableOnMountInput from '../components/FocusableOnMountInput';
import Fraction from '../components/Fraction';
import PillInput from '../components/PillInput';
import WelcomePopup from '../components/WelcomePopup';
import { InputRecord, useAppState } from '../contexts/AppStateContext';
import formatMoney from '../lib/formatMoney';
import parseReceipt, { UniqueItem } from '../lib/parseReceiptDocument';
import testfile from '../test-file.json';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    const { receiptData } = useAppState();

    return (
        <>
            <WelcomePopup />
            <Container>
                <NamesForm />
            </Container>
            <Container>
                <ReceiptForm />
            </Container>
            {!!receiptData?.items.length && (
                <Container>
                    <SplitForm />
                </Container>
            )}
            {!!receiptData?.items.length && (
                <Container>
                    <Results />
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

function ReceiptForm() {
    const [errorMessage, setErrorMessage] = React.useState('');
    const { receiptData, setReceiptData } = useAppState();

    return (
        <>
            <h3 className="ml-1">Загрузите JSON с данными о вашем чеке:</h3>
            <fieldset className="flex flex-col overflow-clip rounded-lg border-2 border-transparent bg-[rgba(0,0,0,0.3)]">
                <input
                    id="receipt-file"
                    className="cursor-pointer px-2 py-3 text-sm"
                    type="file"
                    accept="application/json"
                    onChange={async (e) => {
                        const inputFile = e.target.files?.[0];
                        if (!inputFile) return;
                        if (inputFile.type !== 'application/json') {
                            setReceiptData(undefined);
                            setErrorMessage('Uploaded file must be of JSON format');
                            return;
                        }
                        const content = await inputFile.text();
                        const receiptDataOption = parseReceipt(content);
                        if (receiptDataOption.isErr()) {
                            setReceiptData(undefined);
                            setErrorMessage(receiptDataOption.error);
                            return;
                        }

                        const { items } = receiptDataOption.value;
                        const uniqueItems: UniqueItem[] = items.map((item, index) => ({
                            ...item,
                            index,
                        }));
                        setReceiptData({ items: uniqueItems });
                        setErrorMessage('');
                    }}
                />
                <hr />
                <button
                    className="cursor-pointer px-2 pt-1 pb-2 text-start text-sm font-bold"
                    onClick={() => {
                        const opt = parseReceipt(JSON.stringify(testfile));
                        if (opt.isOk()) {
                            setReceiptData(opt.value);
                            setErrorMessage('');
                        }
                    }}
                >
                    Загрузить демо
                </button>
            </fieldset>

            {(errorMessage || receiptData) && (
                <div className={twMerge('px-2 text-sm', receiptData ? '' : '')}>
                    {errorMessage
                        ? `✘ ${errorMessage}`
                        : receiptData && `✔ найдено позиций: ${receiptData.items.length}`}
                </div>
            )}
        </>
    );
}

function NamesForm() {
    const { names, setNames } = useAppState();
    const [editableNameIndex, setEditableNameIndex] = React.useState<number>();

    return (
        <>
            <h3 className="ml-1">Между кем делим чек?</h3>

            <div className="flex flex-wrap items-center gap-1">
                {names.map((name, index) => {
                    const updateName = (name: string) =>
                        setNames((names) => names.map((n, i) => (i === index ? name.trim() : n)));
                    return (
                        <PillInput
                            key={`name-form-${index}`}
                            editable={index === editableNameIndex}
                            onClickOutside={() => {
                                console.log('onclickoutside', index, name);
                                if (editableNameIndex === index) setEditableNameIndex(undefined);
                            }}
                            onClose={() => {
                                setNames((state) => state.filter((_, i) => i !== index));
                            }}
                            pillProps={{
                                children: name,
                                onClick: () => {
                                    console.log('onclick', index, name);
                                    if (editableNameIndex !== index) setEditableNameIndex(index);
                                },
                            }}
                            inputProps={{
                                value: name,
                                onChange: (e) => {
                                    const { value } = e.target;
                                    updateName(value);
                                },
                                onBlur: (e) => {
                                    const { value } = e.target;
                                    if (!value) {
                                        setNames((state) => state.filter((_, i) => i !== index));
                                    }
                                },
                                onKeyDown: (e) => {
                                    const target = e.target as EventTarget & HTMLInputElement;
                                    const { value } = target;
                                    console.log(e.key, value);
                                    if (e.key === 'Enter' || e.key === 'Escape') {
                                        if (value) {
                                            updateName(value);
                                            setEditableNameIndex(undefined);
                                        }
                                    }
                                },
                            }}
                        />
                    );
                })}
                <FocusableOnMountInput
                    name={''}
                    focusOnMount={false}
                    placeholder="Добавить..."
                    style={{ width: `20ch` }}
                    className="h-9"
                    onKeyDown={(e) => {
                        const target = e.target as EventTarget & HTMLInputElement;
                        const { value } = target;
                        if (e.key === 'Enter') {
                            if (value) {
                                setNames((ns) => [...ns, value]);
                                target.value = '';
                            }
                        }
                    }}
                />
            </div>
        </>
    );
}

function SplitForm() {
    const { receiptData } = useAppState();

    if (!receiptData) return null;
    const items = receiptData.items;

    return (
        <>
            <h3 className="ml-1">Разделите свои покупки:</h3>
            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <SplitControl key={item.index} item={item} />
                ))}
            </div>
        </>
    );
}

interface SplitControlProps {
    item: UniqueItem;
}

function SplitControl({ item }: SplitControlProps) {
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
        <div className="relative flex flex-col gap-y-2 rounded-md bg-black/20 px-4 pt-3 pb-2 sm:p-5">
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
                className={twMerge(
                    'absolute top-0 right-0 h-5/6 w-1 -translate-x-1.5 translate-y-1/12 rounded-full bg-pink-300 transition-colors',
                    isFilled && 'bg-green-300'
                )}
            />
        </div>
    );
}

function Results() {
    const { names, receiptData, inputRecords } = useAppState();

    if (!receiptData) return null;

    const items = receiptData.items;
    const unfilledItems = items.filter((item) => !inputRecords.some((r) => r.item === item && r.share > 0));

    const itemSharesMap = inputRecords.reduce((acc, { item, share }) => {
        const prev = acc.get(item) ?? 0;
        acc.set(item, prev + share);
        return acc;
    }, new Map<UniqueItem, number>());

    const getTotalsByName = (name: string) =>
        inputRecords
            .filter((r) => r.name === name && r.share > 0)
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
                {names.map((name, index) => (
                    <TotalCard key={`total-card-${index}`} name={name} records={getTotalsByName(name)} />
                ))}
            </div>
        </>
    );
}

interface TotalRecord extends InputRecord {
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
