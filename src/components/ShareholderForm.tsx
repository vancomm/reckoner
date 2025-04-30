import React from 'react';

import FocusableOnMountInput from '@/components/FocusableOnMountInput';
import PillInput from '@/components/PillInput';
import { Shareholder } from '@/lib/shareholder';

interface ShareholderFormProps {
    shareholders: Shareholder[];
    setShareholders: React.Dispatch<React.SetStateAction<Shareholder[]>>;
    names: string[];
    setNames: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ShareholderForm({ shareholders, setShareholders, names, setNames }: ShareholderFormProps) {
    const [editableShareholderId, setEditableShareholderId] = React.useState<string>();
    const [editableNameIndex, setEditableNameIndex] = React.useState<number>();

    return (
        <>
            <h3 className="ml-1">Между кем делим чек?</h3>

            <div className="flex flex-wrap items-center gap-1">
                {shareholders?.map((shareholder) => {
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
                            onClose={deleteShareholder}
                            pillProps={{
                                children: shareholder.name,
                                onClick: () => {
                                    if (!editable) setSelfEditable();
                                },
                            }}
                            inputProps={{
                                value: shareholder.name,
                                onChange: (e) => {
                                    updateName(e.target.value);
                                },
                                onBlur: (e) => {
                                    if (!e.target.value) {
                                        deleteShareholder();
                                    }
                                },
                                onKeyDown: (e) => {
                                    const target = e.target as EventTarget & HTMLInputElement;
                                    const { value } = target;
                                    if (e.key === 'Enter' || e.key === 'Escape') {
                                        if (value) {
                                            updateName(value);
                                            unsetEditable();
                                        }
                                    }
                                },
                            }}
                        />
                    );
                })}
            </div>

            <div className="flex flex-wrap items-center gap-1">
                {names.map((name, index) => {
                    const updateName = (name: string) =>
                        setNames((names) => names.map((n, i) => (i === index ? name.trim() : n)));
                    return (
                        <PillInput
                            key={`name-form-${index}`}
                            editable={index === editableNameIndex}
                            onClickOutside={() => {
                                if (editableNameIndex === index) setEditableNameIndex(undefined);
                            }}
                            onClose={() => {
                                setNames((state) => state.filter((_, i) => i !== index));
                            }}
                            pillProps={{
                                children: name,
                                onClick: () => {
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
