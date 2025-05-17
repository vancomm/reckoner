import React from 'react';
import { useOnClickOutside } from 'usehooks-ts';

interface WithClickOutsideProps extends React.InputHTMLAttributes<HTMLDivElement> {
    onClickOutside?: (e: MouseEvent | TouchEvent | FocusEvent) => unknown;
    eventType?: 'mousedown' | 'mouseup' | 'touchstart' | 'touchend' | 'focusin' | 'focusout';
    eventListenerOptions?: AddEventListenerOptions;
}

export default function WithClickOutside({ onClickOutside, eventType, eventListenerOptions, children, ...props }: WithClickOutsideProps) {
    const ref = React.useRef<HTMLDivElement>(null!);

    useOnClickOutside(ref, (e) => onClickOutside?.(e), eventType, eventListenerOptions);

    return (
        <div ref={ref} {...props}>
            {children}
        </div>
    );
}
