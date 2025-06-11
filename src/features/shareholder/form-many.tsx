import React from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

import Clear from '@/components/Clear';
import Edit from '@/components/Edit';
import FocusableAutoWidthInput from '@/components/FocusableAutoWidthInput';
import WithClickOutside from '@/components/WithClickOutside';
import { Shareholder } from '@/lib/shareholder';
import { VARIANTS } from '@/variants.gen';

interface ManyShareholdersFormProps {
    shareholders: Shareholder[];
    setShareholders: React.Dispatch<React.SetStateAction<Shareholder[]>>;
}

export default function ManyShareholdersForm({
    shareholders,
    setShareholders,
    className,
    ...props
}: ManyShareholdersFormProps & React.InputHTMLAttributes<HTMLDivElement>) {
    const [editableShareholderId, setEditableShareholderId] = React.useState<string>();
    return shareholders.map((shareholder, index) => {
        const editable = shareholder.id === editableShareholderId;
        const updateName = (name: string) => {
            setShareholders((shareholders) =>
                shareholders.map((sh) => (sh.id === shareholder.id ? { ...shareholder, name } : sh))
            );
        };
        const deleteShareholder = () => {
            setShareholders((shareholders) => shareholders.filter((sh) => sh.id !== shareholder.id));
        };
        const setEditable = () => setEditableShareholderId(shareholder.id);
        const unsetEditable = () => setEditableShareholderId(undefined);

        const variant = VARIANTS[index % VARIANTS.length];

        return (
            <WithClickOutside
                key={`name-form-${shareholder.id}`}
                data-variant={variant}
                onClickOutside={() => editable && unsetEditable()}
                onClick={() => !editable && setEditable()}
                className={twMerge(
                    editable
                        ? 'border-(--color-secondary) bg-(--color-primary)'
                        : 'group cursor-pointer border-(--color-primary) bg-(--color-secondary) select-none',
                    className
                )}
                {...props}
            >
                <Edit className={twJoin(editable ? 'text-black/80' : 'text-black/50')} />
                {editable ? (
                    <FocusableAutoWidthInput
                        className="min-w-[4ch] focus:outline-0"
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
                        <div className={twMerge('ml-0.5 h-[80%] border-x-1 border-black/10 text-black/80')} />
                        <button className="cursor-pointer p-0.5" onMouseDown={deleteShareholder} tabIndex={-1}>
                            <Clear
                                width="1em"
                                height="1em"
                                className={twMerge(
                                    'border-black/10 text-black/80 opacity-50 transition-colors hover:opacity-100'
                                )}
                            />
                        </button>
                    </>
                )}
            </WithClickOutside>
        );
    });
}
