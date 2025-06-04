import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Shareholder } from '@/lib/shareholder';

export interface OneShareholderFormProps {
    setShareholders: React.Dispatch<React.SetStateAction<Shareholder[]>>;
    shouldFocus?: boolean;
    setShouldFocus: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OneShareholderForm({
    setShareholders,
    shouldFocus,
    setShouldFocus,
    id,
    ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & OneShareholderFormProps & { id: string }) {
    const placeholder = 'имя...';
    const [width, setWidth] = React.useState<string>(`${placeholder.length + 2}ch`);
    return (
        <label htmlFor={id} {...props}>
            <div className="pr-1 pl-2 text-xl">+</div>
            <input
                ref={(ref) => {
                    if (ref !== null && shouldFocus) {
                        ref.focus();
                    }
                    console.log({ ref, shouldFocus });
                }}
                id={id}
                placeholder={placeholder}
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
                            setShareholders((shareholders) =>
                                shareholders.concat({ name: value.slice(0, 20), id: crypto.randomUUID() })
                            );
                            target.value = '';
                        }
                    }
                    setWidth(`${Math.max(target.value.length + 2, target.placeholder.length + 2, 3)}ch`);
                }}
                onChange={(e) => {
                    setWidth(`${Math.max(e.target.value.length + 2, e.target.placeholder.length + 2, 3)}ch`);
                }}
                onBlur={(e) => {
                    const { value } = e.target;
                    if (value.length > 0) {
                        setShareholders((shareholders) =>
                            shareholders.concat({ name: value, id: crypto.randomUUID() })
                        );
                        e.target.value = '';
                    }
                    setWidth(`${Math.max(e.target.value.length + 2, e.target.placeholder.length + 2, 3)}ch`);
                    setShouldFocus(false);
                }}
            />
        </label>
    );
}
