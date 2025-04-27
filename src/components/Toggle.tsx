import cn from 'classnames';
import React from 'react';

import styles from './Card/Card.module.css';

interface ToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    id: string;
    active: boolean;
    label: string;
    onClick?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function Toggle({ id, active, label, onClick, className, style }: ToggleProps) {
    return (
        <div className={styles.cardAction}>
            <input
                id={id}
                className={styles.toggleInput}
                type="checkbox"
                value={label}
                checked={active}
                onChange={onClick}
                style={style}
            />
            <label htmlFor={id} className={cn(styles.toggleLabel, className)}>
                {label}
            </label>
        </div>
    );
}
