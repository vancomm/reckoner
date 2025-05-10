import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useOnClickOutside } from 'usehooks-ts';

import FocusableOnMountInput, { FocusableOnMountInputProps } from '@/components/FocusableOnMountInput';
import Pill, { PillProps } from '@/components/Pill';

interface PillInputProps extends React.InputHTMLAttributes<HTMLDivElement> {
    editable?: boolean;
    pillProps?: PillProps;
    inputProps?: FocusableOnMountInputProps;
    onClickOutside?: () => unknown;
}

export default function PillInput({
    className,
    editable,
    inputProps,
    pillProps,
    onClickOutside,
    ...props
}: PillInputProps) {
    const ref = React.useRef<HTMLDivElement>(null!);

    useOnClickOutside(ref, () => onClickOutside?.());

    return (
        <div ref={ref} className={twMerge('pill-input overflow-hidden rounded', className)} {...props}>
            {editable ? (
                <FocusableOnMountInput {...inputProps} className={twMerge('h-9', inputProps?.className)} />
            ) : (
                <Pill {...pillProps} className={twMerge('group h-9', pillProps?.className)} />
            )}
        </div>
    );
}
