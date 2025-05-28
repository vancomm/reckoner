import React from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

import Clear from '@/components/Clear';
import Edit from '@/components/Edit';
import FocusableOnMountInput from '@/components/FocusableOnMountInput';
import WithClickOutside from '@/components/WithClickOutside';
import { Shareholder, getShareholderColors } from '@/lib/shareholder';

interface EditableShareholderListProps {
    shareholders: Shareholder[];
    setShareholders: React.Dispatch<React.SetStateAction<Shareholder[]>>;
}

export default function EditableShareholderList({ shareholders, setShareholders }: EditableShareholderListProps) {
    const [editableShareholderId, setEditableShareholderId] = React.useState<string>();

    return shareholders?.map((shareholder, index) => {
        const editable = shareholder.id === editableShareholderId;
        const updateName = (name: string) => {
            setShareholders((shareholders) => shareholders.map((sh) => (sh.id === shareholder.id ? { ...shareholder, name } : sh)));
        };
        const deleteShareholder = () => {
            setShareholders((shareholders) => shareholders.filter((sh) => sh.id !== shareholder.id));
        };
        const setEditable = () => setEditableShareholderId(shareholder.id);
        const unsetEditable = () => setEditableShareholderId(undefined);
        const colors = getShareholderColors(index);

        return (
            <WithClickOutside
                key={`name-form-${shareholder.id}`}
                onClickOutside={() => {
                    if (editable) unsetEditable();
                }}
                onClick={() => {
                    if (!editable) setEditable();
                }}
                className={twJoin(
                    'flex h-9 items-center gap-1 overflow-hidden rounded-lg border-b-4 p-1 font-semibold transition-colors',
                    editable ? [colors.input] : ['group cursor-pointer bg-black/30 select-none', colors.pill]
                )}
            >
                <Edit className={twJoin(editable ? 'text-black/80' : 'text-white/50')} />
                {editable ? (
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
    });
}
