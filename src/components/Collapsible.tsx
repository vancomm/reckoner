import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
    open: boolean;
}

export default function Collapsible({ open, className, style, ...props }: CollapsibleProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [height, setHeight] = React.useState(0);

    React.useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.scrollHeight);
        }
    }, [setHeight, ref]);

    return (
        <div
            ref={ref}
            className={twMerge('h-(--height) overflow-hidden transition-[height] duration-200 ease-in-out', className)}
            style={{ '--height': open ? `${height}px` : '0', ...style }}
            // data-is-open={open}
            // style={{ height: open ? `${ref.current?.scrollHeight}px` : '0', ...style }}
            {...props}
        />
    );
}
