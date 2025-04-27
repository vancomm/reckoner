import cn from 'classnames';
import React from 'react';

import styles from './Container.module.css';

export default function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(styles.container, className)} {...props} />;
}
