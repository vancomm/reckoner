import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useOnClickOutside } from 'usehooks-ts';

import FocusableOnMountInput, { FocusableOnMountInputProps } from '@/components/FocusableOnMountInput';
import Pill, { PillProps } from '@/components/Pill';

interface PillInputProps extends React.InputHTMLAttributes<HTMLDivElement> {
    editable?: boolean;
    onClose?: () => unknown;
    onClickOutside?: () => unknown;
    pillProps?: PillProps;
    inputProps?: FocusableOnMountInputProps;
}

export default function PillInput({
    className,
    editable,
    onClose,
    onClickOutside,
    onClick,
    inputProps,
    pillProps,
    ...props
}: PillInputProps) {
    const ref = React.useRef<HTMLDivElement>(null!);

    useOnClickOutside(ref, () => onClickOutside?.());

    return (
        <div
            ref={ref}
            className={twMerge('pill-input overflow-hidden rounded', className)}
            onClick={onClick}
            {...props}
        >
            {editable ? (
                <FocusableOnMountInput
                    placeholder="Введите текст..."
                    {...inputProps}
                    className={twMerge('h-9', inputProps?.className)}
                />
            ) : (
                <Pill onClose={onClose} {...pillProps} className={twMerge('group h-9', pillProps?.className)} />
            )}
        </div>
    );
}
