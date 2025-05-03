import React from 'react';

import FocusableOnMountInput from '@/components/FocusableOnMountInput';
import PillInput from '@/components/PillInput';
import { Shareholder } from '@/lib/shareholder';

interface ShareholderFormProps {
    shareholders: Shareholder[];
    setShareholders: React.Dispatch<React.SetStateAction<Shareholder[]>>;
}

export default function ShareholderForm({ shareholders, setShareholders }: ShareholderFormProps) {
    const [editableShareholderId, setEditableShareholderId] = React.useState<string>();

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
                <FocusableOnMountInput
                    name={''}
                    focusOnMount={false}
                    placeholder="Добавить..."
                    className="h-9"
                    onKeyDown={(e) => {
                        const target = e.target as EventTarget & HTMLInputElement;
                        const { value } = target;
                        if (e.key === 'Escape') {
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
                />
            </div>
        </>
    );
}
