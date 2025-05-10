import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface FocusableOnMountInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    focusOnMount?: boolean;
}

export default function FocusableOnMountInput({
    className,
    focusOnMount = true,
    ...props
}: FocusableOnMountInputProps) {
    const ref = React.useRef<HTMLInputElement>(null!);

    React.useEffect(() => {
        if (focusOnMount) ref.current.focus();
    }, [focusOnMount]);

    const [width, setWidth] = React.useState<string>(
        `${String(props.defaultValue || props.placeholder || '').length + 5}ch`
    );

    return (
        <input
            ref={ref}
            type="text"
            style={{ width }}
            className={twMerge('w-full min-w-[10ch] bg-black/30 p-1 pr-6 focus:bg-black/50 focus:outline-0', className)}
            {...props}
            onChange={(e) => {
                console.log({
                    value: e.target.value,
                    defaultValue: e.target.defaultValue,
                    placeholder: e.target.placeholder,
                });
                setWidth(`${String(e.target.value || e.target.placeholder || '').length + 5}ch`);
                props.onChange?.(e);
            }}
        />
    );
}
