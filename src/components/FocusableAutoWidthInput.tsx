import React from 'react';

export interface FocusableOnMountInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    focusOnMount?: boolean;
    selectOnMount?: boolean;
}

export default function FocusableAutoWidthInput({
    focusOnMount = true,
    selectOnMount = false,
    ...props
}: FocusableOnMountInputProps) {
    const ref = React.useRef<HTMLInputElement>(null!);

    React.useEffect(() => {
        if (focusOnMount) ref.current.focus();
        if (selectOnMount) ref.current.select();
    }, [focusOnMount, selectOnMount]);

    const [width, setWidth] = React.useState<string>(
        `${Math.max((props.defaultValue?.toString().length || 0) + 2, (props.placeholder?.length || 0) + 2, 3)}ch`
    );

    return (
        <input
            ref={ref}
            type="text"
            style={{ width }}
            {...props}
            onChange={(e) => {
                props.onChange?.(e);
                console.log({
                    value: e.target.value,
                    defaultValue: e.target.defaultValue,
                    placeholder: e.target.placeholder,
                });
                setWidth(`${Math.max(e.target.value.length + 2, e.target.placeholder.length + 2, 3)}ch`);
            }}
            onBlur={(e) => {
                props.onBlur?.(e);
                setWidth(`${Math.max(e.target.value.length + 2, e.target.placeholder.length + 2, 3)}ch`);
            }}
        />
    );
}
