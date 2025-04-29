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

    return (
        <input
            ref={ref}
            type="text"
            className={twMerge(
                'w-full min-w-[10ch] rounded-sm border-none bg-black/30 p-1 pr-6 focus:bg-black/50 focus:outline-0',
                className
            )}
            {...props}
        />
    );
}
