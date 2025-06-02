import Replay from '@mui/icons-material/Replay';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Shareholder } from '@/lib/shareholder';

import EditableShareholderList from './edit';

export interface ShareholderFormProps {
    shareholders: Shareholder[];
    setShareholders: React.Dispatch<React.SetStateAction<Shareholder[]>>;
    shouldFocus?: boolean;
}

export default function ShareholderForm({ shareholders, setShareholders, shouldFocus }: ShareholderFormProps) {
    const handleSubmit = (name: string) => {
        setShareholders((shareholders) => shareholders.concat({ name, id: crypto.randomUUID() }));
    };

    const [width, setWidth] = React.useState<string>(`${'Добавить...'.length + 2}ch`);

    return (
        <>
            <h3 className="mx-1 flex items-start justify-between">
                <span>Между кем делим чек?</span>
                {shareholders.length > 0 && (
                    <button
                        className="flex cursor-pointer items-center gap-x-0.5 text-white/60 transition-colors hover:text-white/80"
                        onClick={() => setShareholders([])}
                    >
                        <Replay fontSize="small" />
                        <span>сбросить</span>
                    </button>
                )}
            </h3>
            <div className="flex flex-wrap items-center gap-1">
                <EditableShareholderList shareholders={shareholders} setShareholders={setShareholders} />
                <label
                    htmlFor="new-shareholder-input"
                    className="flex cursor-pointer items-center overflow-clip rounded-lg border-transparent bg-black/30"
                >
                    <div className="pr-1 pl-2 text-xl">+</div>
                    <input
                        ref={(ref) => {
                            if (ref !== null && shouldFocus) {
                                ref.focus();
                            }
                            console.log({ ref, shouldFocus });
                        }}
                        id="new-shareholder-input"
                        placeholder="Добавить..."
                        className={twMerge('h-9 min-w-[4ch] pr-1 focus:outline-0')}
                        type="text"
                        style={{ width }}
                        onKeyDown={(e) => {
                            const target = e.target as EventTarget & HTMLInputElement;
                            const { value } = target;
                            if (e.key === 'Escape') {
                                target.value = '';
                                target.blur();
                            } else if (e.key === 'Enter') {
                                if (value.length > 0) {
                                    handleSubmit(value);
                                    target.value = '';
                                }
                            }
                        }}
                        onChange={(e) => {
                            setWidth(`${Math.max(e.target.value.length + 2, e.target.placeholder.length + 2, 3)}ch`);
                        }}
                        onBlur={(e) => {
                            const { value } = e.target;
                            if (value.length > 0) {
                                handleSubmit(value);
                                e.target.value = '';
                            }
                            setWidth(`${Math.max(e.target.value.length + 2, e.target.placeholder.length + 2, 3)}ch`);
                        }}
                    />
                </label>
            </div>
        </>
    );
}
