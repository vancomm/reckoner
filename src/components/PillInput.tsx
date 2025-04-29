import React from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import Edit from '../components/Edit';
import FocusableOnMountInput, { FocusableOnMountInputProps } from './FocusableOnMountInput';
import Pill, { PillProps } from './Pill';

interface PillInputProps extends React.InputHTMLAttributes<HTMLDivElement> {
    editable?: boolean;
    onClose?: () => unknown;
    onClickOutside?: () => unknown;
    pillProps?: PillProps;
    inputProps?: FocusableOnMountInputProps;
}

export default function PillInput({
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
        <div ref={ref} onClick={onClick} {...props}>
            {editable ? (
                <FocusableOnMountInput
                    value={inputProps?.value}
                    placeholder="Введите текст..."
                    style={{ width: `${String(inputProps?.value).length + 5}ch` }}
                    className="h-9"
                    {...inputProps}
                />
            ) : (
                <Pill className="group h-9" onClose={onClose} {...pillProps}>
                    <Edit className="fill-white opacity-50 group-hover:opacity-100" />
                    {pillProps?.children}
                </Pill>
            )}
        </div>
    );
}
