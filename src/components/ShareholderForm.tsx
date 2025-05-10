import React from 'react';
import { twMerge } from 'tailwind-merge';

import FocusableOnMountInput from '@/components/FocusableOnMountInput';
import PillInput from '@/components/PillInput';
import { Shareholder, getShareholderClassNames } from '@/lib/shareholder';

import Clear from './Clear';
import Edit from './Edit';

interface ShareholderFormProps {
    shareholders: Shareholder[];
    setShareholders: React.Dispatch<React.SetStateAction<Shareholder[]>>;
}

export default function ShareholderForm({ shareholders, setShareholders }: ShareholderFormProps) {
    const [editableShareholderId, setEditableShareholderId] = React.useState<string>();

    return (
        <>
            <h3 className="mx-1 flex justify-between">
                <span>Между кем делим чек?</span>
                {shareholders.length > 0 && (
                    <button
                        className="cursor-pointer text-white/50 underline hover:text-white/80"
                        onClick={() => setShareholders([])}
                    >
                        Очистить
                    </button>
                )}
            </h3>

            <div className="flex flex-wrap items-center gap-1">
                {shareholders?.map((shareholder, i) => {
                    const editable = shareholder.id === editableShareholderId;
                    const updateName = (name: string) => {
                        setShareholders((shareholders) =>
                            shareholders.map((sh) => (sh.id === shareholder.id ? { ...shareholder, name } : sh))
                        );
                    };
                    const deleteShareholder = () => {
                        setShareholders((shareholders) => shareholders.filter((sh) => sh.id !== shareholder.id));
                    };
                    const setSelfEditable = () => setEditableShareholderId(shareholder.id);
                    const unsetEditable = () => setEditableShareholderId(undefined);

                    return (
                        <PillInput
                            key={`name-form-${shareholder.id}`}
                            editable={editable}
                            onClickOutside={() => {
                                if (editable) unsetEditable();
                            }}
                            className={twMerge('border-b-4', getShareholderClassNames(i).border)}
                            pillProps={{
                                children: (
                                    <>
                                        <Edit className="fill-white opacity-50 group-hover:opacity-100" />
                                        {shareholder.name}
                                        <div className="ml-0.5 h-[80%] border-x-1 border-white/10" />
                                        <button
                                            className="cursor-pointer p-0.5"
                                            onMouseDown={deleteShareholder}
                                            tabIndex={-1}
                                        >
                                            <Clear
                                                width="1em"
                                                height="1em"
                                                className="fill-white/50 hover:fill-white"
                                            />
                                        </button>
                                    </>
                                ),
                                onClick: () => {
                                    if (!editable) setSelfEditable();
                                },
                            }}
                            inputProps={{
                                placeholder: 'Имя...',
                                defaultValue: shareholder.name,
                                onBlur: (e) => {
                                    if (!e.target.value) {
                                        deleteShareholder();
                                    }
                                    unsetEditable();
                                },
                                onKeyDown: (e) => {
                                    const target = e.target as EventTarget & HTMLInputElement;
                                    if (e.key === 'Escape') {
                                        unsetEditable();
                                    }
                                    if (e.key === 'Enter') {
                                        if (target.value.length === 0) return;
                                        updateName(target.value);
                                        unsetEditable();
                                    }
                                },
                            }}
                        />
                    );
                })}
                <div className="overflow-clip rounded border-y-2 border-transparent bg-black/30 focus-within:bg-black/50 hover:bg-black/50">
                    <FocusableOnMountInput
                        name={''}
                        focusOnMount={false}
                        placeholder="Добавить..."
                        className="h-9 bg-transparent focus:bg-transparent"
                        onKeyDown={(e) => {
                            const target = e.target as EventTarget & HTMLInputElement;
                            const { value } = target;
                            if (e.key === 'Escape') {
                                target.value = '';
                                target.blur();
                            } else if (e.key === 'Enter') {
                                if (value.length > 0) {
                                    setShareholders((shareholders) =>
                                        shareholders.concat({ id: crypto.randomUUID(), name: value })
                                    );
                                    target.value = '';
                                }
                            }
                        }}
                        onBlur={(e) => {
                            e.target.value = '';
                        }}
                    />
                </div>
            </div>
        </>
    );
}
