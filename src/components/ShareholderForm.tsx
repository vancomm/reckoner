import React from 'react';
import { twMerge } from 'tailwind-merge';

import FocusableOnMountInput from '@/components/FocusableOnMountInput';
import { Shareholder, getShareholderColors } from '@/lib/shareholder';

import Clear from './Clear';
import Edit from './Edit';
import WithClickOutside from './WithClickOutside';

interface ShareholderFormProps {
    shareholders: Shareholder[];
    setShareholders: React.Dispatch<React.SetStateAction<Shareholder[]>>;
}

export default function ShareholderForm({ shareholders, setShareholders }: ShareholderFormProps) {
    const [editableShareholderId, setEditableShareholderId] = React.useState<string>();

    return (
        <>
            <Header />

            <div className="flex flex-wrap items-center gap-1">
                {shareholders?.map(function ShareholderInput(shareholder, i) {
                    const editable = shareholder.id === editableShareholderId;
                    const updateName = (name: string) => {
                        setShareholders((shareholders) => shareholders.map((sh) => (sh.id === shareholder.id ? { ...shareholder, name } : sh)));
                    };
                    const deleteShareholder = () => {
                        setShareholders((shareholders) => shareholders.filter((sh) => sh.id !== shareholder.id));
                    };
                    const setEditable = () => setEditableShareholderId(shareholder.id);
                    const unsetEditable = () => setEditableShareholderId(undefined);

                    return (
                        <WithClickOutside
                            key={`name-form-${shareholder.id}`}
                            onClickOutside={() => {
                                if (editable) unsetEditable();
                            }}
                            onClick={() => {
                                if (!editable) setEditable();
                            }}
                            className={twMerge(
                                'flex h-9 items-center gap-1 overflow-hidden rounded-lg border-b-4 bg-black/30 p-1 font-semibold transition-colors',
                                editable ? getShareholderColors(i).input : getShareholderColors(i).pill,
                                !editable && 'group cursor-pointer select-none'
                            )}
                        >
                            <Edit className={twMerge('text-white/50', editable && 'text-black/80')} />
                            {editable ? (
                                <>
                                    <FocusableOnMountInput
                                        placeholder="Имя..."
                                        defaultValue={shareholder.name}
                                        onBlur={(e) => {
                                            if (!e.target.value) {
                                                deleteShareholder();
                                            }
                                            unsetEditable();
                                        }}
                                        onKeyDown={(e) => {
                                            const target = e.target as EventTarget & HTMLInputElement;
                                            if (e.key === 'Escape') {
                                                unsetEditable();
                                            }
                                            if (e.key === 'Enter') {
                                                if (target.value.length === 0) return;
                                                updateName(target.value);
                                                unsetEditable();
                                            }
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    {shareholder.name}
                                    <div className={twMerge('ml-0.5 h-[80%] border-x-1 border-white/10')} />
                                    <button className="cursor-pointer p-0.5" onMouseDown={deleteShareholder} tabIndex={-1}>
                                        <Clear width="1em" height="1em" className={twMerge('text-white opacity-50 transition-colors hover:opacity-100')} />
                                    </button>
                                </>
                            )}
                        </WithClickOutside>
                    );
                })}
                <label htmlFor="new-shareholder-input" className="flex cursor-pointer items-center overflow-clip rounded-lg border-transparent bg-black/30">
                    <div className="pr-1 pl-2 text-xl">+</div>
                    <FocusableOnMountInput
                        id="new-shareholder-input"
                        focusOnMount={false}
                        placeholder="Добавить..."
                        className="h-9 pr-1"
                        onKeyDown={(e) => {
                            const target = e.target as EventTarget & HTMLInputElement;
                            const { value } = target;
                            if (e.key === 'Escape') {
                                target.value = '';
                                target.blur();
                            } else if (e.key === 'Enter') {
                                if (value.length > 0) {
                                    setShareholders((shareholders) => shareholders.concat({ id: crypto.randomUUID(), name: value }));
                                    target.value = '';
                                }
                            }
                        }}
                        onBlur={(e) => {
                            e.target.value = '';
                        }}
                    />
                </label>
            </div>
        </>
    );

    function Header() {
        return (
            <h3 className="mx-1 flex justify-between">
                <span>Между кем делим чек?</span>
                {shareholders.length > 0 && (
                    <button className="cursor-pointer text-white/50 underline hover:text-white/80" onClick={() => setShareholders([])}>
                        Очистить
                    </button>
                )}
            </h3>
        );
    }
}
