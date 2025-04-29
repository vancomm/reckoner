import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useOnClickOutside } from 'usehooks-ts';

import Clear from '../components/Clear';
import Edit from '../components/Edit';

interface PillInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    editable?: boolean;
    onClose?: () => unknown;
    onClickOutside?: () => unknown;
    onPillClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function PillInput({
    value,
    editable,
    onClose,
    onClickOutside,
    onPillClick,
    onClick,
    ...props
}: PillInputProps) {
    const ref = React.useRef<HTMLDivElement>(null!);

    useOnClickOutside(ref, () => onClickOutside?.());

    return (
        <div ref={ref} onClick={onClick}>
            {editable ? (
                <FocusedOnMountInput
                    value={value}
                    placeholder="Введите текст..."
                    style={{ width: `${String(value).length + 5}ch` }}
                    {...props}
                />
            ) : (
                <div className="flex items-center gap-1 rounded-sm bg-black/30 p-1 font-semibold">
                    <div className="group cursor-pointer p-0.5" onClick={onPillClick}>
                        <Edit className="fill-white opacity-50 group-hover:opacity-100" />
                    </div>
                    <p>{value}</p>
                    <button className="cursor-pointer" onMouseDown={() => onClose?.()} tabIndex={-1}>
                        <Clear width="1em" height="1em" className="fill-white opacity-50 hover:opacity-100" />
                    </button>
                </div>
            )}
        </div>
    );
}

function FocusedOnMountInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!);

    React.useEffect(() => {
        ref.current.focus();
    }, []);

    return (
        <input
            ref={ref}
            type="text"
            className={twMerge(
                'w-full rounded-sm border-none bg-[rgba(0,0,0,0.3)] p-1 pr-6 focus:outline-0',
                className
            )}
            placeholder="Enter name..."
            {...props}
        />
    );
}
