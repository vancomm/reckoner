import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
    open: boolean;
}

export default function Collapsible({ open, className, style, ...props }: CollapsibleProps) {
    const ref = React.useRef<HTMLDivElement>(null);

    return (
        <div
            ref={ref}
            className={twMerge('overflow-hidden transition-[height] duration-200 ease-in-out', className)}
            style={open ? { height: `${ref.current?.scrollHeight}px`, ...style } : { height: '0', ...style }}
            {...props}
        />
    );
}
