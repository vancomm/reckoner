import cn from 'classnames';

import styles from './Card/Card.module.css';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label?: string;
    disabled?: boolean;
}

export default function Button({ label, className, children, ...props }: ButtonProps) {
    return (
        <button className={cn(styles.button, className)} {...props}>
            {label}
            {children}
        </button>
    );
}
