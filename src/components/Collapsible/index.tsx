import cn from 'classnames';
import { useRef } from 'react';

import { Customizable } from '../../types/Customizable';
import { Nestable } from '../../types/Nestable';
import styles from './Collapsible.module.css';

interface CollapsibleProps extends Nestable, Customizable {
    open: boolean;
}

export default function Collapsible({ open, children, id, className, style }: CollapsibleProps) {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            id={id}
            ref={ref}
            className={cn(styles.collapsible, className)}
            style={open ? { height: `${ref.current?.scrollHeight}px`, ...style } : { height: '0', ...style }}
        >
            {children}
        </div>
    );
}
