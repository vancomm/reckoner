import cn from 'classnames';

import { Customizable } from '../../types/Customizable';
import { Nestable } from '../../types/Nestable';
import styles from '../Card/Card.module.css';

export interface ButtonProps extends Nestable, Customizable {
    label?: string;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ id, label, className, style, disabled, onClick, children }: ButtonProps) {
    return (
        <button id={id} className={cn(styles.button, className)} disabled={disabled} style={style} onClick={onClick}>
            {label}
            {children}
        </button>
    );
}
