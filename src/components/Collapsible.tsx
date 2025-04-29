import cn from 'classnames';
import React, { useRef } from 'react';

import styles from './Collapsible.module.css';

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
    open: boolean;
}

export default function Collapsible({ open, className, style, ...props }: CollapsibleProps) {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={ref}
            className={cn(styles.collapsible, className)}
            style={open ? { height: `${ref.current?.scrollHeight}px`, ...style } : { height: '0', ...style }}
            {...props}
        />
    );
}
