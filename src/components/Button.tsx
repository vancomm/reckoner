import cn from 'classnames';

import styles from './Card.module.css';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label?: string;
    disabled?: boolean;
}

export default function Button({ label, className, children, ...props }: ButtonProps) {
    return (
        <button className={cn(className, styles.button)} {...props}>
            {label}
            {children}
        </button>
    );
}
